var db;

function loadDB(callback) {
    fetch('data/data.json', { method: 'GET' })
        //.then(function (response) { return response.json() })
        .then(function (response) { return response.text(); })
        .then(function (text) { return JSON.parse(text); })
        .then(initDB)
        .then(callback)
        .catch(function (error) { console.log(error); });
}

function initDB(raw) {
    db = raw;
    for (var i = 0; i < db.relations.length; i++) {
        var rel = db.relations[i];
        refer(db[rel.src], db[rel.dst], rel.key);
    }
    return db;
}
function refer(src, dst, key) {
    for (var i in src) {
        var value = src[i][key];
        src[i][key] = dst[value];
    }
}

function getViewModel(c, wep, amr, acc, lv, r) {
    // init view model object
    var vm = {};
    vm.data = c;
    vm.lv = lv;
    vm.r = r;
    vm.mp = getMaxMP(c);
    vm.duration = formatFloat(c.s3_duration);
    vm.duration_50 = formatFloat(c.s3_duration * (1 - vm.data.combo_speed * 5));

    // prepare SV(static variables)
    // SV is static variable for each element
    vm.sv = {};
    var sv_others = { eRate: undefined };
    var sv_strong = { eRate: 'epRate' };
    var sv_weak = { eRate: 'enRate' };
    for (var i in db.element) {
        vm.sv[i] = sv_others;
    }
    vm.sv_default = sv_others;
    vm.sv[c.element.element_weak] = sv_weak;
    vm.sv[c.element.element_strong] = sv_strong;
    var boss_others = { element: undefined };
    var boss_weak = { element: db.element[c.element.element_weak] };
    var boss_strong = { element: db.element[c.element.element_strong] };

    //calculate base atk
    var lvd = lv - 80;
    var lvup_rate = 0.005245;
    var lb_rate = 0.025775;
    if (c.group.group_class === 'kenbu' || c.group.group_class === 'psr' || c.group.group_class === 'ssr' || c.group.group_class === 'isr') {
        lb_rate = 0.041275;
    }
    var ss_atk = c.ss_atk;
    if (lv > 80) {
        ss_atk += c.ss_dmg_85;
    }
    vm.atk_c = c.atk + c.atk * lvd * lvup_rate + c.atk * Math.floor(lvd / 5) * lb_rate + ss_atk;
    vm.atk_eq = getWeaponAtk(c, wep, r) + getEqValue(c, amr, 'atk') + getEqValue(c, acc, 'atk');
    vm.atk = vm.atk_c + vm.atk_eq;
    //bs    
    calcSVBS(sv_others, c, wep, amr, acc, lv, r, boss_others);
    calcSVBS(sv_weak, c, wep, amr, acc, lv, r, boss_weak);
    calcSVBS(sv_strong, c, wep, amr, acc, lv, r, boss_strong);
    //buff
    vm.buff = c.s3_atk;
    //debuff
    vm.debuf = c.s3_debuf;
    vm.debuf_pnr = c.s3_debuf_pnr;
    sv_others.emod = 1;
    sv_weak.emod = 1;
    sv_strong.emod = c.ss_elem_dmg;
    vm.dtmod = {}
    for (var t in db.dtypes) {
        vm.dtmod[t] = c['dtr_' + db.dtypes[t]];
    }
    vm.mod_dmg = c.ss_dmg;
    if (lv > 85) {
        vm.mod_dmg *= c.ss_elem_dmg_90;
    }
    var mod_crit = c.cri_dmg * c.ss_cri_dmg;
    sv_others.mod_crit = mod_crit * (1 + getWeaponCriEDmg(wep, r, boss_others));
    sv_weak.mod_crit = mod_crit * (1 + getWeaponCriEDmg(wep, r, boss_weak));
    sv_strong.mod_crit = mod_crit * c.ss_elem_cri_dmg * (1 + getWeaponCriEDmg(wep, r, boss_strong));

    vm.rate = c.s3_rate;

    return vm;
}

function calcSVBS(dcv, c, wep, amr, acc, lv, r, boss) {
    dcv.bs_c = c.bs_atk;
    dcv.bs_eq = getWeaponBSAtk(wep, r) + getEqBS(c, amr, 'atk', boss) + getEqBS(c, acc, 'atk', boss);
    dcv.bs = 1 + dcv.bs_c + dcv.bs_eq;
}

function calcNetDamage(vm, boss) {
    var dcv = vm.sv_default;
    if (boss.element) {
        dcv = vm.sv[boss.element.element];
    }
    var buff;
    if (boss.gbuff === undefined) {
        buff = vm.buff;
    } else {
        buff = Math.max(vm.buff, boss.gbuff);
    }
    buff *= boss.trophy;
    var debuff = 1.0;
    if (boss.debuff) {
        debuff = boss.debuff;
    }
    var def;
    if (boss.debuff < 1.0) { //debuff on
        def = boss.def * debuff;
    } else { //debuff off
        def = boss.def * (1 - vm.debuf_pnr + vm.debuf * vm.debuf_pnr);
    }
    var emod = dcv.emod;
    if (dcv.eRate) {
        emod *= boss[dcv.eRate];
    }
    var dtmod = 1;
    for (var t in db.dtypes) {
        dtmod += (boss[db.dtypes[t]] - 1) * vm.dtmod[t];
    }
    var cmod = 1;
    if (boss.condition) {
        var conditions = boss.condition.split(',');
        for (var j in conditions) {
            var cdata = conditions[j].split(':');
            var con = cdata[0].split('=');
            if (c[con[0]] === con[1]) {
                cmod *= cdata[1];
            }
        }
    }
    var combo = 1 + Math.floor(boss.combo / 10) * 0.05;
    if (boss.combo > 20) { combo *= vm.data.combo_damage_20; }
    if (boss.combo > 30) { combo *= vm.data.combo_damage_30; }
    var mod = Math.min(combo * vm.mod_dmg * emod * dtmod * boss.repRate * boss.racc * boss.etcMod * cmod, boss.limit);
    if (boss.crit > 0) {
        mod *= dcv.mod_crit;
    }
    vm.damage = (vm.atk * dcv.bs * buff - def) * vm.rate * mod;
    //console.log(vm.cname,vm.mod_dmg , emod ,dtmod , boss.repRate , boss.racc , boss.etcMod , cmod, boss.limit);    
    //console.log(vm.atk,dcv.bs,buff,def,vm.rate,mod);
    //console.log(dcv.mod_crit);
    return vm;
}

function getWeaponAtk(c, wep, r) {
    var atk = getEqValue(c, wep, 'atk');
    switch (r) {
        case 4:
            return atk * 1;
        case 5:
            return atk * 1.36;
        default:
            return atk * 0;
    }
}
function getWeaponBSAtk(wep, r) {
    switch (r) {
        case 4:
            return wep.bs_atk;
        case 5:
            return wep.bs_atk5;
        default:
            return 0;
    }
}
function getWeaponCriEDmg(wep, r, boss) {
    //console.log(wep);
    if (boss.element && boss.element.element_weak === wep.element.element) {
        switch (r) {
            case 4:
                return wep.bs_cri_edmg;
            case 5:
                return wep.bs_cri_edmg5;
            default:
                return 0;
        }
    } else {
        return 0;
    }
}
function getEqBS(c, eq, key, boss) {
    if (eq === undefined) { return 0; }
    var bs = eq['bs_' + key];
    switch (eq.c_key) {
        case 'hp':
            return bs + eq['bsc_' + key];
        case 'vs':
            //console.log(c.short,eq.name,boss);
            if (boss.element && eq.c_value === boss.element.element) {
                return bs + eq['bsc_' + key];
            } else {
                return bs;
            }
        case 'gender':
            if (eq.c_value === c.cname.gender) {
                return bs + eq['bsc_' + key];
            } else {
                return bs;
            }
        case 'world':
            if (eq.c_value === c[eq.c_key]) {
                return bs + eq['bsc_' + key];
            } else {
                return bs;
            }
        case 0:
        case undefined:
            return bs;
        default:
            //console.log(c.short,eq.name,eq.c_key, eq.c_value);
            if (eq.c_value === c[eq.c_key][eq.c_key]) {
                return bs + eq['bsc_' + key];
            } else {
                return bs;
            }
    }
}
function getEqValue(c, eq, key) {
    if (eq === undefined) { return 0; }
    if (c.element === eq.element) {
        return eq[key] * 1.2;
    } else {
        return eq[key];
    }
}
function getMaxMP(c) {
    return Math.floor((c.mp + getEqValue(c, c.eq_mp_amr, 'mp') + getEqValue(c, c.eq_mp_acc, 'mp')) * (1 + c.bs_mp + getEqBS(c, c.eq_mp_amr, 'mp') + getEqBS(c, c.eq_mp_acc, 'mp')));
}

