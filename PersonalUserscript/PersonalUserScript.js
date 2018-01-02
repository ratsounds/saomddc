// ==UserScript==
// @name         ratsounds Own Units & Weps & Armors
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Filters your own units with their own lvl + your own weapons and their rarity + own armors
// @author       Zehnzen
// @match        https://ratsounds.github.io/saomddc/
// @grant        unsafewindow
// ==/UserScript==

useMy = {
    get weapons() {
        return this._weapon;
    },
    set weapons(val) {
        this._weapon = val;
        calcRanking();
        showRanking();
    },
    //change true -> false if you want to use all weapons by default
    _weapon: true,

    get chars() {
        return this._char;
    },
    set chars(val) {
        this._char = val;
        calcRanking();
        showRanking();
    },
    //change true -> false if you want to use all characters by default
    _char: true,

    get armors() {
        return this._armor;
    },
    set armors(val) {
        this._armor = val;
        calcRanking();
        showRanking();
    },
    //change true -> false if you want to use all characters by default
    _armor: true,
};

// Use id or name_en for weapon identification. id is slightly quicker at startup.
// Use: showAllWeps() in console to get a list of all weapon id's
myWeapons = [
    { id: "bride_sword1", name_en: "", r: 4},
    { id: "bonds_sword", name_en: "", r: 4},
    { id: "c_sword", name_en: "", r: 4},
    { id: "jr_dual", name_en: "", r: 4},
    { id: "moonlight_sword", name_en: "", r: 4},
    { id: "moonlight_sword1", name_en: "", r: 4},
    { id: "ninja_rapier", name_en: "", r: 4},
    { id: "princess_sword", name_en: "", r: 4},
    { id: "ps_mace", name_en: "", r: 4},
    { id: "sao_dagger1", name_en: "", r: 4},
    { id: "sao_gun", name_en: "", r: 4},
    { id: "sports_dagger", name_en: "", r: 4},
    { id: "sports_sword", name_en: "Glorious Blade", r: 4},
    { id: "steamy_dagger", name_en: "", r: 4},
    { id: "trump_dual", name_en: "", r: 4},
    { id: "cosplay_lance", name_en: "", r: 4},
    { id: "hatsu_mace", name_en: "", r: 4},
];
// Use id or name_en for character identification. id is slightly quicker at startup.
// Use: showAllChars() in console to get a list of all char id's
myUnits = [
    { id: "", name_en: "Kirito [Black Wing]", lv: 80}, // works ala name_en is correct
    { id: "ShitTestingId's", name_en: "Leafa [The Blade - facing the feelings]", lv: 80}, // works ala name_en is correct
    { id: "sports_leafa", name_en: "", lv: 80}, // Preferred example
    { id: "pns_yuuki", name_en: "", lv: 80},
    { id: "jr_asuna", name_en: "", lv: 80},
    { id: "princess_asuna", name_en: "", lv: 80},
    { id: "bride_asuna", name_en: "", lv: 80},
    { id: "groom_kirito", name_en: "", lv: 80},
    { id: "swim_alice", name_en: "", lv: 80},
    { id: "steamyr_strea", name_en: "", lv: 90},
    { id: "swim_kirito", name_en: "", lv: 80},
    { id: "summer_sinon", name_en: "", lv: 80},
    { id: "os_silica", name_en: "", lv: 80},
    { id: "moonlight_asuna", name_en: "", lv: 80},
    { id: "sao_kirito", name_en: "", lv: 80},
    { id: "moonlightr_lisbeth", name_en: "", lv: 90},
    { id: "bonds_asuna", name_en: "", lv: 80},
    { id: "os_asuna", name_en: "", lv: 80},
    { id: "sao_silica", name_en: "", lv: 80},
    { id: "sao_klein", name_en: "", lv: 80},
    { id: "cm_eugeo", name_en: "", lv: 80},
    { id: "cm_kirito", name_en: "", lv: 80},
    { id: "festa_lisbeth", name_en: "", lv: 80},
    //{ id: "bondsr_heathcliff", name_en: "", lv: 80},
    { id: "yukata_suguha", name_en: "", lv: 80},
    { id: "rainy_sakuya", name_en: "", lv: 80},
    { id: "e16_asuna", name_en: "", lv: 80},
    { id: "e16_kirito", name_en: "", lv: 100},
    { id: "g17_yuna", name_en: "", lv: 80},
    { id: "summer_silica", name_en: "", lv: 80},
    { id: "x17r_rain", name_en: "", lv: 100},
    { id: "x17r_seven", name_en: "", lv: 80},
    { id: "friends_asuna", name_en: "Asuna [Heartful Water fairy]", lv: 80},
    { id: "cheer_sinon", name_en: "", lv: 80},
    { id: "e16_sachi", name_en: "", lv: 80},
    { id: "dog_asuna", name_en: "", lv: 80},
    { id: "steamy_asuna", name_en: "", lv: 80},
];
// NOTE: Not all armors are available in the database.
// Use: showAllArmors() in console to check which ones are possible.
myArmors = [
    { id: "mf_dark1", name_en: "Wolf Coat"},
    { id: "f_dark2", name_en: "Pumpkun Dress"}, //Yes pumpk'u'n, I didn't choose that either
    { id: "", name_en: "Gym Clothes in Youth"},
    { id: "", name_en: "Hot Spring Bathtowel"},
    { id: "", name_en: "Heart Dress"},
    { id: "", name_en: "Fiery Wind Cape"},
    { id: "", name_en: "Captain Coat"},
    { id: "", name_en: "Scale Chainmail"},
    { id: "", name_en: "Holy Night Cape"},
    { id: "", name_en: "Snow Fairy Cape"},
    { id: "", name_en: "Scarlet Party Dress"},
];

// Start integration from ui.js

function sortArrayWithFilter(array) {
    var sortKey = elemSort.value;
    switch (sortKey) {
        case 'duration':
        case 'c2duration':
            sortObjectArray(array, sortKey, true);
            break;
        default:
            sortObjectArray(array, sortKey);
            break;
    }
}

function initPost() {
    loadDBFromFile('data/data.json', initPostPost);
}

lastClicked = -1;

function initPostPost() {
    var db = DC.getData();

    //loading for personal scripts
    cs = DC.getChar();
    fillMissingCharIds();
    fillMissingWepIds();
    fillMissingArmorIds();

    //create group icon css
    //set app icon
    fetch('data/appicon.json', { method: 'GET' })
        .then(function (responce) { return responce.text(); })
        .then(function (text) { return JSON.parse(text); })
        .then(function (json) {
            var gcss = '<style type="text/css">';
            var url = json[Math.floor(Math.random() * json.length)];
            if (url) { gcss += '.app {background-image:url(' + url + ')!important} '; }
            for (var i in db.group) {
                var gclass = 'g' + db.group[i].class;
                gcss += '.' + gclass + ' {background-image:url(icons/' + gclass + '.png)} ';
            }
            gcss += '</style>';
            DO.q('head').append(DO.new(gcss));
        })
        .catch(function (error) { console.log(error); });

    //load preset
    var elemPreset = DO.qid('preset').html('');
    for (var i = 0; i < db.preset.length; i++) {
        var name = db.preset[i]['name' + lang];
        elemPreset.append(DO.new('<option value="' + i + '">' + name + '</option>'));
    }

    //init ui
    elemRanking = DO.qid('ranking');
    elemSort = DO.qid('sort');
    elemSort.append(DO.new('<option value="' + 'floorcapacity' + '">' + 'Floor Capacity' + '</option>'));
    elemSort.append(DO.new('<option value="' + 'c2dpm' + '">' + 'C/2 DPM' + '</option>'));
    //load default
    putBoss();
    calcRanking();
    showRanking();
    //init events
    DO.qa('.boss input,.boss select').forEach(function (elem) {
        elem.on('change', function (ev) {
            calcRanking();
            showRanking();
        });
    });
    DO.qa('.filter input').forEach(function (elem) {
        elem.on('change', function (ev) {
            showRanking();
        });
    });
    elemPreset.on('change', function (ev) {
        setBoss(db.preset[ev.target.value]);
        calcRanking();
        showRanking();
    });
    elemSort.on('change', function (ev) {
        calcRanking();
        showRanking();
    });
    elemRanking.on('.item', 'click', function (ev) {
        var elemDetail = this.q('.detail');
        if (elemDetail.innerHTML.trim() === '') {
            elemDetail.html(getCharDetail(this.id));
            twttr.widgets.load(elemDetail);
        }
        if (!ev.target.parents('.tcontainer')) {
            lastClicked = this.id;
            elemDetail.classList.toggle('hidden');
        }
    });

    elemRanking.onkeydown = function (ev) {
        if (ev.which == 68) { //D press
            var wepId = getCharRankWepId(lastClicked);
            removeWepId(wepId);
        }
        if (ev.which == 82) { //R press
            resetWeps();
        }
    };
}

function calcRanking() {
    //console.log('calcRanking');
    putBoss();
    ranking = [];

    for (var i in lvr) {
        var clvr = lvr[i];

        if (useMy.chars) {
            for (var my in myUnits) {
                var myUnit = myUnits[my];
                var c = copy(DC.getChar(myUnit.id));

                if (myUnit.lv !== clvr.lv) {
                    continue;
                }

                var dcv = calcComboDCVForChar(c, clvr, useMy.weapons, curWeapons, calcWeaponDCVForChar);
                if (dcv === null) {
                    continue;
                }
                ranking.push(dcv);
                setDCVValues(dcv);
            }
        } else {
            for (var j in cs) {
                var c = copy(cs[j]);

                var dcv = calcComboDCVForChar(c, clvr, useMy.weapons, curWeapons, calcWeaponDCVForChar);
                if (dcv === null) {
                    continue;
                }
                ranking.push(dcv);
                setDCVValues(dcv);
            }
        }
    }

    sortArrayWithFilter(ranking);
    //console.log('ranking',ranking);
}

function calcComboDCVForChar(oc, clvr, useCheck, myObjects, comboCall) {
    var dcv;

    if (useCheck) {

        var allCombos = [];
        for (var i in myObjects) {
            var combo = comboCall(oc, myObjects[i], clvr);
            if (combo === null) {
                continue;
            }
            allCombos.push(combo);
            setDCVValues(combo);
        }

        if (allCombos.length <= 0) {
            return null;
        }

        sortArrayWithFilter(allCombos);
        dcv = allCombos[0];

    } else if (clvr.r > 0) { // weapon & armor, accessory
        dcv = DC.calcDamage(oc, clvr.lv, 4, oc.eq_atk_wep, clvr.r, oc.eq_atk_amr, oc.eq_atk_acc, boss);
    } else { // no weapon & armor, accessory
        dcv = DC.calcDamage(oc, clvr.lv, 4, undefined, clvr.r, undefined, undefined, boss);
    }

    return dcv;
}
function calcWeaponDCVForChar(oc, myWeapon, clvr) {
    var weapon = DC.getWeapon(myWeapon.id);
    //Check for compatible weapon type
    if (oc.type.eqtype != weapon.type.id || clvr.r != myWeapon.r) {
        return null;
    }

    var c = copy(oc);
    c.eq_atk_wep = weapon;

    return calcComboDCVForChar(c, clvr, useMy.armors, curArmors, calcArmorDCVForChar);
}
function calcArmorDCVForChar(oc, myArmor, clvr) {
    var armor = DC.getArmor(myArmor.id);
    //Check for compatible armor type
    if (!armor.type.includes(oc.cname.gender)) {
        return null;
    }

    var c = copy(oc);
    c.eq_atk_amr = armor;

    return DC.calcDamage(c, clvr.lv, 4, c.eq_atk_wep, clvr.r, c.eq_atk_amr, c.eq_atk_acc, boss);
}

function setDCVValues(dcv) {
    //Required setting beforehand
    dcv.mpr = Math.floor(dcv.sv.mpr);
    dcv.combo_speed_rate = (1 - dcv.sv.c.combo_speed * Math.floor(boss.combo / 10));
    dcv.duration = dcv.sv.c.s3_duration * dcv.combo_speed_rate;
    dcv.c2duration = (dcv.sv.c.s3_c_duration ? dcv.sv.c.s3_c_duration : dcv.sv.c.s3_duration * dcv.combo_speed_rate) + dcv.duration;

    //Sortable values
    dcv.c2dps = Math.floor(dcv.damage / dcv.c2duration);
    dcv.duration_50 = dcv.sv.c.s3_duration * (1 - dcv.sv.c.combo_speed * Math.floor(50 / 10));
    dcv.dpm = Math.floor(getDPM(dcv));
    dcv.c2dpm = Math.floor(getC2DPM(dcv));

    //Flooring for ranking list
    dcv.dps = Math.floor(dcv.damage / dcv.duration);
    dcv.duration = Math.floor(dcv.duration * 100) / 100;
    dcv.duration_50 = Math.floor(dcv.duration_50 * 100) / 100;
    dcv.c2duration = Math.floor(dcv.c2duration * 100) / 100;
    dcv.capacity = Math.floor(dcv.damage * dcv.sv.mp / dcv.sv.cost);
    dcv.floorcapacity = Math.floor(dcv.damage * Math.floor(dcv.sv.mp / dcv.sv.cost));
    dcv.damage = Math.floor(dcv.damage);
}

function getC2DPM(dcv) {
    var time = 0;
    var mp = dcv.sv.mp;
    var count = 0;
    var ns_duration = dcv.sv.c.type.ns_duration * dcv.combo_speed_rate * (dcv.sv.c.s3_speed ? dcv.sv.c.s3_speed : 1);
    while (time <= 60) {
        if (mp >= dcv.sv.cost) { // s3
            time += dcv.c2duration;
            mp -= dcv.sv.cost;
            count++;
        } else { // normal set
            time += ns_duration;
            mp += dcv.sv.c.type.ns_hits * dcv.mpr;
        }
    }
    return dcv.damage * (count + ((time - 60) / dcv.c2duration));
}

function showRanking() {
    var filter = getFilter();
    elemRanking.html('');
    var filtered = [];
    var score_key = elemSort.value;
    var rank = 0;

    var max = 0;
    var min = Number.MAX_VALUE;
    for (var i = 0; i < ranking.length; i++) {
        var dcv = ranking[i];
        if (match(dcv.sv.c.meta, filter.keyword) && filter.type[dcv.sv.c.type.id] && (useMy.weapons ? true : filter.r[dcv.sv.r]) && (useMy.chars ? true : filter.lv[dcv.sv.lv])) {
            rank++;
            dcv.rank = zero(rank, 3);
            dcv.id = i;
            filtered.push(dcv);
            max = Math.max(max, dcv.capacity);
            min = Math.min(min, dcv.dps);
        }
    }
    var dif = max * 2 / 3 - min;
    var offset = 30;
    var remains = 100 - offset;
    for (var i = 0; i < filtered.length; i++) {
        var dcv = filtered[i];
        dcv.p_dps = offset + remains * (dcv.dps - min) / dif;
        dcv.p_damage = offset + remains * (dcv.damage - min) / dif;
        dcv.p_capacity = offset + remains * (dcv.capacity * 2 / 3 - min) / dif;
        dcv.score = dcv[score_key];
        dcv.color = dcv.sv.c.element.color;
        dcv.cname = dcv.sv.c.cname['name' + lang];
        var html = mapperInfo.map(dcv);
        elemRanking.append(DO.new(html));
    }
}

// END ui.js integration

// Begin Userscript specific scripts
function removeWepId(id) {
    for (var i in curWeapons) {
        var wep = DC.getWeapon(curWeapons[i].id);
        if (wep.id === id || wep.name_en == id) {
            console.log("removed wep: " + id);
            var removedWep = curWeapons.splice(i, 1);
            break;
        }
    }
    calcRanking();
    showRanking();
}

function resetWeps() {
    console.log("resetWeps");
    curWeapons = JSON.parse(JSON.stringify(myWeapons));
    calcRanking();
    showRanking();
}

function showAllWeps() {
    console.log(DC.getWeapon());
}
function showAllChars() {
    console.log(cs);
}
function showAllArmors() {
    console.log(DC.getArmor());
}

function fillMissingCharIds() {
    for (var i in myUnits) {
        var myUnit = myUnits[i];

        if (myUnit.id !== "" && DC.getChar(myUnit.id)) {
            continue;
        }

        myUnit.id = findIdInArray(myUnit, cs);
    }
    curUnits = JSON.parse(JSON.stringify(myUnits));
}
function fillMissingWepIds() {
    var allWeps = DC.getWeapon();
    for (var i in myWeapons) {
        var myWeapon = myWeapons[i];

        if (myWeapon.id !== "" && DC.getWeapon(myWeapon.id)) {
            continue;
        }

        myWeapon.id = findIdInArray(myWeapon, allWeps);
    }
    curWeapons = JSON.parse(JSON.stringify(myWeapons));
}
function fillMissingArmorIds() {
    var allArmors = DC.getArmor();
    for (var i in myArmors) {
        var myArmor = myArmors[i];

        if (myArmor.id !== "" && DC.getArmor(myArmor.id)) {
            continue;
        }

        myArmor.id = findIdInArray(myArmor, allArmors);
    }
    curArmors = JSON.parse(JSON.stringify(myArmors));
}

function findIdInArray(myObject, dbArray) {
    for (var j in dbArray) {
        if (myObject.name_en.toLowerCase() == dbArray[j].name_en.toLowerCase()) {
            return dbArray[j].id;
        }
    }
    console.log("Couldn't find matching id for:");
    console.log(myObject);
}

function getCharRankWepId(id) {
    var dcv = ranking[id];
    var c = dcv.sv.c;
    return c.eq_atk_wep.id;
}

function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}

addJS_Node (calcRanking);
addJS_Node (showRanking);
addJS_Node (setDCVValues);
addJS_Node (getC2DPM);
addJS_Node (resetWeps);
addJS_Node (removeWepId);
addJS_Node (getCharRankWepId);
addJS_Node (initPost);
addJS_Node (initPostPost);
addJS_Node (sortArrayWithFilter);
addJS_Node (copy);
addJS_Node (showAllWeps);
addJS_Node (showAllChars);
addJS_Node (showAllArmors);
addJS_Node (calcComboDCVForChar);
addJS_Node (calcWeaponDCVForChar);
addJS_Node (calcArmorDCVForChar);
addJS_Node (fillMissingCharIds);
addJS_Node (fillMissingWepIds);
addJS_Node (fillMissingArmorIds);
addJS_Node (findIdInArray);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}
// END userscript specific scripts

//Direct copy of modified dc.js file

DC = (function () {
    var db;
    var sd;
    var lvup_rate = 0.005245;
    var lb_rate = {
        normal: 0.025775,
        high: 0.041275
    };
    var key_mp = 'mp';
    var key_bs_mp = 'bs_mp';
    var key_mp_dec = 'mp_dec';
    var key_e_mp_dec = 'e_mp_dec';
    var key_atk = 'atk';
    var key_bs_atk = 'bs_atk';

    function loadData(raw) {
        db = raw;
        //init relation
        for (var i = 0; i < db.relation.length; i++) {
            var rel = db.relation[i];
            refer(db[rel.src], db[rel.dst], rel.key);
        }
        //init condition object
        createConditionObject(db.armor, 'conditional');
        createConditionObject(db.accessory, 'conditional');
        createConditionObject(db.preset, 'condition');
        //init static data
        sd = {};
        return db;
    }
    function getData() {
        return db;
    }
    function refer(src, dst, key) {
        for (var i in src) {
            var value = src[i][key];
            src[i][key] = dst[value];
        }
    }
    function createConditionObject(object, key) {
        for (var i in object) {
            var condition = {};
            var condition_string = object[i][key];
            if (condition_string !== 0) {
                var conditions = condition_string.split(/,/);
                for (var j in conditions) {
                    var sp = conditions[j].split(/:/);
                    condition.expression = sp[0];
                    var values = sp[1].split(/&/);
                    condition.values = {};
                    for (var k in values) {
                        var kv = values[k].split(/=/);
                        condition.values[kv[0]] = parse(kv[1]);
                    }
                }
                object[i][key] = condition;
            }
        }
    }
    function calcRateAtTryout(c, lv, lb, wep, r, amr, acc, boss, damage) {
        var dcv = getDamageCalculationVariables(c, lv, lb, wep, r, amr, acc, boss);
        dcv.rate = damage / ((dcv.atk * dcv.bs * (1 + (dcv.buff - 1) / 1.5) - dcv.def) * dcv.mod) * 1.1;
        return dcv;
    }
    function calcRate(c, lv, lb, wep, r, amr, acc, boss, damage) {
        var dcv = getDamageCalculationVariables(c, lv, lb, wep, r, amr, acc, boss);
        dcv.rate = damage / ((dcv.atk * dcv.bs * dcv.buff - dcv.def) * dcv.mod);
        return dcv;
    }
    function calcDamage(c, lv, lb, wep, r, amr, acc, boss, custom_rate) {
        var dcv = getDamageCalculationVariables(c, lv, lb, wep, r, amr, acc, boss);
        if (custom_rate) { dcv.rate = custom_rate; }
        dcv.damage = (dcv.atk * dcv.bs * dcv.buff - dcv.def) * dcv.rate * dcv.mod;
        return dcv;
    }
    function getDamageCalculationVariables(c, lv, lb, wep, r, amr, acc, boss) {
        var sv = getSV(c, lv, lb, wep, r, amr, acc);
        var sve = sv['default'];
        if (boss.element) {
            sve = sv[boss.element.id];
        }

        var exp_obj = { c: c, hp: 100, vs: boss.element ? boss.element.id : undefined, combo: boss.combo, switched: boss.switched };
        var bs_con_amr = amr && Expression.eval(amr.conditional.expression, exp_obj) ? amr.conditional.values : {};
        var bs_con_acc = acc && Expression.eval(acc.conditional.expression, exp_obj) ? acc.conditional.values : {};
        var atk = sv.atk + getEqValue(bs_con_amr, key_atk) + getEqValue(bs_con_acc, key_atk);
        var bs_atk = sve.bs_atk + getEqValue(bs_con_amr, key_bs_atk) + getEqValue(bs_con_acc, key_bs_atk);

        var buff;
        if (boss.gbuff === undefined) {
            buff = sv.c.s3_atk;
        } else {
            buff = Math.max(sv.c.s3_atk, boss.gbuff);
        }
        buff *= boss.trophy;

        var debuff = 1.0;
        if (boss.debuff) { debuff = boss.debuff; }

        var def;
        if (boss.debuff < 1.0) { //debuff on
            def = boss.def * debuff;
        } else { //debuff off
            def = boss.def * (1 - sv.c.s3_debuf_pnr + sv.c.s3_debuf * sv.c.s3_debuf_pnr);
        }

        var emod = 1;
        var crit = sve.mod_crit;
        if (sve.eRate) {
            emod += boss[sve.eRate];
        }
        for (var e in db.element) {
            if(e===sv.c.element.id){
                emod += boss[e];
            }
        }

        var dtmod = 0;
        for (var t in db.dtype) { dtmod += boss[t] * sv.dtmod[t]; }

        var cmod = Expression.eval(boss.condition.expression, exp_obj) ? boss.condition.values.mod : 0;

        var combo = Math.floor(boss.combo / 10) * 0.05;
        if (boss.combo >= 20) {
            combo += sv.c.combo_damage_20;
            if (wep) {
                combo += wep.c20_bs_cri_dmg;
            }
        }
        if (boss.combo >= 30) {
            combo += sv.c.combo_damage_30;
        }

        var mod = Math.min(combo + sve.mod_dmg + emod + dtmod + boss.repRate + boss.racc + boss.etcMod + cmod, boss.limit);
        if (boss.crit > 0) {
            mod *= crit;
        }
        var dcv = {
            atk: atk,
            bs: (1 + bs_atk),
            buff: buff,
            def: def,
            rate: sv.c.s3_rate,
            mod: mod,
            sv: sv
        };
        return dcv;
    }
    function getSV(c, lv, lb, wep, r, amr, acc) {
        var obj = sd;
        obj = getSubObject(obj, c.id);
        obj = getSubObject(obj, lv);
        obj = getSubObject(obj, lb);
        obj = getSubObject(obj, wep ? wep.id : 'undefined');
        obj = getSubObject(obj, r);
        obj = getSubObject(obj, amr ? amr.id : 'undefined');
        obj = getSubObject(obj, acc ? acc.id : 'undefined');
        if (Object.keys(obj).length <= 0) {
            obj = createSV(c, lv, lb, wep, r, amr, acc, obj);
        }
        return obj;
    }
    function getSubObject(obj, key) {
        if (obj[key] === undefined) {
            obj[key] = {};
        }
        return obj[key];
    }
    function createSV(c, lv, lb, wep, r, amr, acc, sv) {
        sv.c = c;
        sv.lv = lv;
        sv.wep = wep;
        sv.r = r;
        sv.amr = amr;
        sv.acc = acc;
        sv.mp = Math.floor((c.mp + getEqValueWithElem(c, amr, key_mp) + getEqValueWithElem(c, acc, key_mp)) * (1 + c.bs_mp + getEqValue(amr, key_bs_mp) + getEqValue(acc, key_bs_mp)));
        sv.mpr = sv.mp * c.type.mpr;
        sv.cost = c.s3_mp - c.s3_mp * getWeaponMpDec(c, wep);

        var lv_dif = lv - 80;
        var ss_atk = c.ss_atk;
        if (lv > 80) {
            ss_atk += c.ss_atk_85;
        }
        sv.lb = Math.min(lb, Math.floor(lv_dif / 5));
        sv.atk_c = c.atk + c.atk * lv_dif * lvup_rate + c.atk * sv.lb * lb_rate[c.lvup] + ss_atk;
        sv.atk_eq = getWeaponAtk(c, wep, r) + getEqValueWithElem(c, amr, key_atk) + getEqValueWithElem(c, acc, key_atk);
        sv.atk = sv.atk_c + sv.atk_eq;
        createSVE(sv, 'default');
        for (var elem in db.element) {
            createSVE(sv, elem);
        }
        sv.dtmod = {};
        for (var t in db.dtype) {
            sv.dtmod[t] = c['dtr_' + t];
        }
        return sv;
    }
    function createSVE(sv, elem) {
        var sve = {};
        sv[elem] = sve;
        sve.bs_atk_eq = getWeaponBSAtk(sv.wep, sv.r) + getEqValue(sv.amr, key_bs_atk) + getEqValue(sv.acc, key_bs_atk);
        sve.bs_atk = sv.c.bs_atk + sve.bs_atk_eq;
        sve.mod_dmg = sv.c.ss_dmg;
        sve.mod_crit = sv.c.cri_dmg + sv.c.ss_cri_dmg + getWeaponCriEDmg(sv.wep, sv.r, sv.c, elem);
        sve.eRate = getElementERate(sv.c.element, elem);
        if (sve.eRate === 'epRate' || elem === 'default') {
            sve.mod_dmg += sv.c.ss_elem_dmg;
            if (sv.lv > 85) {
                sve.mod_dmg += sv.c.ss_elem_dmg_90;
            }
            sve.mod_crit += sv.c.ss_elem_cri_dmg;
        }
    }

    function getElementERate(c_elem, boss_elem_id) {
        var eRate;
        if (c_elem.weak === boss_elem_id) {
            eRate = 'enRate';
        }
        if (c_elem.strong === boss_elem_id) {
            eRate = 'epRate';
        }
        return eRate;
    }

    function getWeaponAtk(c, wep, r) {
        var atk = getEqValueWithElem(c, wep, key_atk);
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
        if (wep) {
            switch (r) {
                case 4:
                    return wep.bs_atk;
                case 5:
                    return wep.bs_atk5;
                default:
                    return 0;
            }
        }
        return 0;
    }
    function getWeaponCriEDmg(wep, r, c, vs) {
        var mod = 0;
        if (wep) {
            if (c.element.id === wep.element.id) {
                switch (r) {
                    case 4:
                        mod += wep.e_bs_cri_dmg;
                    case 5:
                        mod += wep.e_bs_cri_dmg5;
                    default:
                }
            }
            if (wep.element.strong === vs) {
                switch (r) {
                    case 4:
                        mod += wep.bs_cri_edmg;
                    case 5:
                        mod += wep.bs_cri_edmg5;
                    default:
                }
            }
        }
        return mod;
    }
    function getWeaponMpDec(c, wep) {
        var mpdec = 0;
        if (wep) {
            mpdec += getEqValue(wep, key_mp_dec);
            if (c.element.id === wep.element.id) {
                mpdec += getEqValue(wep, key_e_mp_dec);
            }
        }
        return mpdec;
    }
    function getEqValueWithElem(c, eq, key) {
        var value = getEqValue(eq, key);
        if (value && c.element.id === eq.element.id) {
            return value * 1.2;
        } else {
            return value;
        }
    }
    function getEqValue(eq, key) {
        if (eq === undefined || eq[key] === undefined) { return 0; }
        return eq[key];
    }
    function get(itemKey, mKey, mValue) {
        var items = db[itemKey];
        for (var i in items) {
            var item = items[i];
            if (item[mKey] === mValue) {
                return item;
            }
        }
        return undefined;
    }
    function getChar(id) {
        if (id) { return db.base[id]; }
        return db.base;
    }
    function getWeapon(id) {
        if (id) { return db.weapon[id]; }
        return db.weapon;
    }
    function getArmor(id) {
        if (id) { return db.armor[id]; }
        return db.armor;
    }
    function getAccessory(id) {
        if (id) { return db.accessory[id]; }
        return db.accessory;
    }
    function getBoss(name) {
        if (name) { return get('preset', 'name', name); }
        return db.preset;
    }
    function getCname(id) {
        if (id) { return db.cname[id]; }
        return db.cname;
    }
    function getElement(id) {
        if (id) { return db.element[id]; }
        return db.element;
    }
    function getType(id) {
        if (id) { return db.type[id]; }
        return db.type;
    }
    function getDtype(id) {
        if (id) { return db.dtype[id]; }
        return db.dtype;
    }
    return {
        loadData: loadData,
        getData: getData,
        getSV: getSV,
        calcRateAtTryout: calcRateAtTryout,
        calcRate: calcRate,
        calcDamage: calcDamage,
        get: get,
        getChar: getChar,
        getWeapon: getWeapon,
        getArmor: getArmor,
        getAccessory: getAccessory,
        getBoss: getBoss,
        getCname: getCname,
        getElement: getElement,
        getType: getType,
        getDtype: getDtype
    };
})();