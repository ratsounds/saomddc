const lvr = [{
    lv: 80,
    r: 0
}, {
    lv: 80,
    r: 4
}, {
    lv: 80,
    r: 5
}, {
    lv: 90,
    r: 0
}, {
    lv: 90,
    r: 4
}, {
    lv: 90,
    r: 5
}, {
    lv: 100,
    r: 0
}, {
    lv: 100,
    r: 4
}, {
    lv: 100,
    r: 5
}];
let ranking;
let boss;
const langs = {
    ja: {
        lang: '',
        help: 'ja/usage'
    },
    en: {
        lang: '_en',
        help: 'en/usage'
    },
    zh: {
        lang: '_en',
        help: 'zh/usage'
    },
}
let lang;
let elemRanking;
let elemSort;
let config;
let mapperInfo;

DO.onLoad(function () {
    loadDBFromFile('data/data.json', init);
});

function loadDBFromFile(url, callback) {
    fetch(url, {
            method: 'GET'
        })
        //.then(function (response) { return response.json() })
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {
            return JSON.parse(text);
        })
        .then(DC.loadData)
        .then(callback)
        .catch(function (error) {
            console.log(error);
        });
}

function getObjectArray(obj) {
    const array = [];
    for (let i in obj) {
        array.push(obj[i]);
    }
    return array;
}

function sortObjectArray(obj, key, asend) {
    if (asend) {
        obj.sort(function (a, b) {
            if (a[key] < b[key]) {
                return -1;
            }
            if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    } else {
        obj.sort(function (a, b) {
            if (a[key] > b[key]) {
                return -1;
            }
            if (a[key] < b[key]) {
                return 1;
            }
            return 0;
        });
    }
}

function init() {
    const db = DC.getData();

    //get language
    const languages = window.navigator.languages || [
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage
    ];
    let lang_setting;
    for (let i = 0; i < languages.length; i++) {
        const language = languages[i];
        for (let key in langs) {
            if (language.indexOf(key) === 0) {
                lang_setting = langs[key];
            }
            if (lang_setting) {
                break;
            }
        }
        if (lang_setting) {
            break;
        }
    }
    if (lang_setting === undefined) {
        lang_setting = langs['en']
    }
    lang = lang_setting.lang;
    DO.qid('help').href = lang_setting.help

    DO.qid('ranking').focus();

    // set theme list
    const elemThemePreset = DO.qid('theme_preset').html('');
    const array_cname = getObjectArray(db.cname);
    sortObjectArray(array_cname, 'name_en', true);
    for (let i = 0; i < array_cname.length; i++) {
        const item = array_cname[i];
        elemThemePreset.append(DO.new('<option value="' + item.id + '">' + item['name' + lang] + '</option>'));
    }
    //init config
    config = store.get('config');
    if (config === undefined) {
        config = {
            wallpaper_url: '',
            wallpaper_effect: 'smoke'
        };
        store.set('config', config);
    }

    //set theme
    if (config.theme === undefined) {
        config.theme = getThemeConfig();
        store.set('config', config);
    }
    elemThemePreset.value = config.theme.preset;
    setTheme(config.theme);

    //set wallpaper
    DO.qid('effect').value = config.wallpaper_effect;
    DO.qid('main').className = config.wallpaper_effect;
    DO.qid('wallpaper').value = config.wallpaper_url;
    setWallpaper(config.wallpaper_url);

    //set sidebar
    if (config.sidebar === undefined) {
        config.sidebar = '';
        store.set('config', config);
    }
    DO.qid('sidebar_url').value = config.sidebar;

    showSidebar();

    DO.qid('config_button').on('click', function (ev) {
        DO.qa('.config_bar').forEach(function (elem) {
            elem.classList.toggle('hidden');
        });
        ev.target.classList.toggle('on');
    });

    DO.qid('wallpaper').on('change', function (ev) {
        config.wallpaper_url = ev.target.value;
        setWallpaper(config.wallpaper_url);
        store.set('config', config);
    });
    DO.qid('effect').on('change', function (ev) {
        config.wallpaper_effect = ev.target.value;
        DO.qid('main').className = config.wallpaper_effect;
        store.set('config', config);
    });
    DO.qa('.theme_value').forEach(function (elem) {
        elem.on('change', function (ev) {
            config.theme = getThemeConfig();
            setTheme(config.theme);
            store.set('config', config);
        });
    });
    DO.qid('theme_preset').on('change', function (ev) {
        const cn = DC.getCname()[ev.target.value];
        if (cn) {
            DO.qid('theme_color').value = cn.color;
            DO.qid('theme_body').value = cn.body;
            DO.qid('theme_head').value = cn.head;
            DO.qid('theme_highlight').value = cn.highlight;
            config.theme = getThemeConfig();
            setTheme(config.theme);
            store.set('config', config);
        }
    });
    DO.qid('sidebar_url').on('change', function (ev) {
        config.sidebar = ev.target.value;
        showSidebar();
        store.set('config', config);
    });
    window.addEventListener('resize', function (ev) {
        console.log('resize');
        showSidebar();
    });
    mapperInfo = new Mapper(DO.qid('item_info').innerHTML);

    //create group icon css
    //set app icon
    fetch('data/appicon.json', {
            method: 'GET'
        })
        .then(function (responce) {
            return responce.text();
        })
        .then(function (text) {
            return JSON.parse(text);
        })
        .then(function (json) {
            let gcss = '<style type="text/css">';
            const url = json[Math.floor(Math.random() * json.length)];
            if (url) {
                gcss += '.app {background-image:url(' + url + ')!important} ';
            }
            for (let i in db.group) {
                const gclass = 'g' + db.group[i].class;
                gcss += '.' + gclass + ' {background-image:url(icons/' + gclass + '.png)} ';
            }
            gcss += '</style>';
            DO.q('head').append(DO.new(gcss));
        })
        .catch(function (error) {
            console.log(error);
        });

    //load preset
    const elemPreset = DO.qid('preset').html('');
    for (let i = 0; i < db.preset.length; i++) {
        const name = db.preset[i]['name' + lang];
        elemPreset.append(DO.new('<option value="' + i + '">' + name + '</option>'));
    }

    //init ui
    elemRanking = DO.qid('ranking');
    elemSort = DO.qid('sort');
    //load default
    getBoss();
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
        const elemDetail = this.q('.detail');
        if (elemDetail.innerHTML.trim() === '') {
            elemDetail.html(getCharDetail(this.id));
            createTweetWidgets(elemDetail);
        }
        if (!ev.target.parents('.tcontainer')) {
            elemDetail.classList.toggle('hidden');
        }
    });
    //init meta word list
    /*
      const metalist = DO.qid('metalist');
      const meta = [];
      for (let i in db.base) {          const c = db.base[i];
          const words = c.meta.split(']')[1].trim().split(' ');
          words[0] = words[0].replace(words[5], '');
          for (let j in words) {              const word = words[j].trim();
              const entry = meta.find(obj => obj.word === word);
              if (entry) {                  entry.count++;
              } else {                  meta.push({ word: word, count: 1 });
              }
          }
      }
      meta.sort((a, b) => b.count - a.count);
      for (let i in meta) {          const word = meta[i].word;
          metalist.append(DO.new('<option value="' + word + '">' + word + '</option>'));
      }
      */
}

function getThemeConfig() {
    return {
        preset: DO.qid('theme_preset').value,
        color: DO.qid('theme_color').value,
        body: DO.qid('theme_body').value,
        head: DO.qid('theme_head').value,
        highlight: DO.qid('theme_highlight').value
    };
}

function setTheme(theme) {
    DO.qid('header').css({
        color: theme.color,
        'background-color': theme.body,
        'background-image': 'linear-gradient(45deg,transparent 88%,' +
            theme.body +
            ' 88%,' +
            theme.body +
            '),linear-gradient(45deg,transparent 86%,' +
            theme.highlight +
            ' 86%,' +
            theme.highlight +
            '), linear-gradient(45deg,transparent 82%,' +
            theme.head +
            ' 82%,' +
            theme.head +
            ')'
    });
    DO.qid('help').css({
        'border': '0.1em solid ' + theme.color
    });
    DO.q('#header i.app').css({
        'border-color': theme.body
    });
    DO.qid('footer').css({
        color: theme.color,
        'background-color': theme.body
    });
}

function setWallpaper(url) {
    DO.qid('main').css({
        'background-image': 'url(' + url + ')'
    });
}

function showSidebar() {
    const elemMain = DO.qid('main');
    const elemBody = DO.q('body');
    const elemSidebar = DO.qid('sidebar');
    if (elemSidebar) {
        elemMain.removeChild(elemSidebar);
    }
    if (config.sidebar === '') {
        elemBody.classList.remove('withSidebar');
    } else {
        if (window.matchMedia('only screen and (orientation:landscape)').matches) {
            elemMain.append(DO.new('<iframe id="sidebar" src="' + config.sidebar + '"></iframe>'));
            elemBody.classList.add('withSidebar');
        }
    }
}

function getBoss() {
    const db = DC.getData();
    boss = {
        crit: 1
    };
    DO.qa('.boss input,.boss select').forEach(function (item) {
        if (item.type === 'radio') {
            if (item.checked) {
                if (item.name === 'element' && item.getAttribute('disabled') !== 'disabled') {
                    boss[item.name] = db.element[item.value];
                } else {
                    boss[item.name] = parse(item.value);
                }
            }
        } else if (item.type === 'checkbox') {
            boss[item.name] = item.checked;
        } else {
            boss[item.name] = parse(item.value);
        }
    });
    boss.condition = db.preset[DO.qid('preset').value].condition;
    //console.log('getBoss',boss);
    return boss;
}

function setBoss(boss) {
    //console.log('setBoss',boss);
    DO.qid('ena').checked = true;
    DO.qa('.boss input,.boss select').forEach(function (item) {
        if (item.type === 'radio') {
            if (item.name === 'element') {
                if (boss[item.name]) {
                    item.checked = boss[item.name].id === parse(item.value);
                }
            } else {
                item.checked = boss[item.name] === parse(item.value);
            }
        } else if (item.type === 'checkbox') {
            item.checked = boss[item.name];
        } else {
            item.value = boss[item.name];
        }
    });
    if (boss.filter !== 0) {
        DO.qid('keyword').value = boss.filter;
    }
}

function calcRanking() {
    //console.log('calcRanking');
    getBoss();
    const cs = DC.getChar();
    ranking = [];
    for (let i in lvr) {
        const clvr = lvr[i];
        for (let j in cs) {
            const c = cs[j];
            let dcv;
            if (clvr.r > 0) {
                // weapon & armor, accessory
                if (boss.combo > 0) {
                    dcv = DC.calcDamage(c, clvr.lv, 4, c.eq_combo_wep, clvr.r, c.eq_combo_amr, c.eq_combo_acc, boss);
                } else {
                    dcv = DC.calcDamage(c, clvr.lv, 4, c.eq_mp_wep, clvr.r, c.eq_mp_amr, c.eq_mp_acc, boss);
                }
            } else {
                // no weapon & armor, accessory
                dcv = DC.calcDamage(c, clvr.lv, 4, undefined, clvr.r, undefined, undefined, boss);
            }
            let xdcv; // extra dcv for XS+AA
            if (c.rarity >= 6.5) {
                const xa_s3_rate = c.s3_rate + 2.0; // rate for XS+AA
                if (clvr.r > 0) {
                    // weapon & armor, accessory
                    if (boss.combo > 0) {
                        xdcv = DC.calcDamage(c, clvr.lv, 4, c.eq_combo_wep, clvr.r, c.eq_combo_amr, c.eq_combo_acc, boss, xa_s3_rate);
                    } else {
                        xdcv = DC.calcDamage(c, clvr.lv, 4, c.eq_mp_wep, clvr.r, c.eq_mp_amr, c.eq_mp_acc, boss, xa_s3_rate);
                    }
                } else {
                    // no weapon & armor, accessory
                    xdcv = DC.calcDamage(c, clvr.lv, 4, undefined, clvr.r, undefined, undefined, boss, xa_s3_rate);
                }
            }
            ranking.push(dcv);
            dcv.combo_speed_rate = getComboSpeedRate(dcv.sv.c.combo_speed, boss.combo);
            dcv.acceleration_rate = 1.0;
            dcv.acceleration_offset = 0.0;
            if (dcv.sv.c.rarity >= 6) {
                if (boss.ingame) {
                    dcv.acceleration_rate = 3.0;
                } else {
                    if (dcv.sv.c.rarity >= 6.5) {
                        dcv.acceleration_offset = 2.0;
                    }else {
                        dcv.acceleration_offset = 1.0;
                    }
                }
            }
            const dca_x = getDCA(
                dcv.sv.c.s3_duration,
                dcv.sv.c.s3_c_duration,
                dcv.sv.c.s3_acceleration,
                dcv.combo_speed_rate,
                dcv.acceleration_rate,
                dcv.acceleration_offset,
                dcv.sv.c.s3_charge_offset
            );
            dcv.duration = dca_x.duration;
            dcv.cduration = dca_x.combination;
            dcv.acceleration = dca_x.acceleration;
            dcv.c2duration = dcv.duration + (dcv.sv.c.s3_c_duration ? dcv.cduration : dcv.duration);
            const dca_50 = getDCA(
                dcv.sv.c.s3_duration,
                dcv.sv.c.s3_c_duration,
                dcv.sv.c.s3_acceleration,
                getComboSpeedRate(dcv.sv.c.combo_speed, 50),
                dcv.acceleration_rate,
                dcv.acceleration_offset,
                dcv.sv.c.s3_charge_offset
            );
            dcv.duration_50 = dca_50.duration;
            dcv.cduration_50 = dca_50.combination;
            dcv.acceleration_50 = dca_50.acceleration;
            dcv.dps = Math.floor(dcv.damage / dcv.duration);
            dcv.dpm = Math.floor(getDPM(dcv));
            dcv.cdps = Math.floor(dcv.damage / dcv.cduration);
            dcv.c2dps = Math.floor(dcv.damage / dcv.duration + dcv.damage / dcv.c2duration);
            dcv.duration = Math.floor(dcv.duration * 100) / 100;
            dcv.duration_50 = Math.floor(dcv.duration_50 * 100) / 100;
            dcv.cduration = Math.floor(dcv.cduration * 100) / 100;
            dcv.c2duration = Math.floor(dcv.c2duration * 100) / 100;
            const pduration = dcv.sv.c.type.id === 'lance' || dcv.sv.c.type.id === 'staff' || dcv.sv.c.group.id.indexOf('sto1') >= 0 || dcv.sv.c.group.id.indexOf('sto2') >= 0 ? 0.2 : 0.0;
            dcv.pdps = Math.floor(dcv.damage / (dcv.duration - pduration));
            dcv.pcdps = Math.floor(dcv.damage / (dcv.cduration - pduration));
            dcv.gap = Math.floor((dcv.duration - dcv.cduration) * 100) / 100;
            dcv.capacity = Math.floor((dcv.damage * dcv.sv.mp) / dcv.sv.cost);
            dcv.damage = Math.floor(dcv.damage);
            dcv.mp = dcv.sv.mp;
            dcv.mpr = Math.floor(dcv.sv.mpr);
            dcv.mpcost = Math.floor(dcv.sv.mp * 100 / dcv.sv.cost) / 100;
            dcv.hits = dcv.sv.c.hits;
            dcv.rate = Math.floor(dcv.rate * 100) / 100;
            // XS metrics
            if (xdcv) {
                dcv.xadps = Math.floor(xdcv.damage / dcv.duration); // XS+AA DPS
                dcv.xc2dps = dcv.dps * 2 // XS C/2.DPS
                dcv.xac2dps = dcv.xadps * 2; // XS+AA C/2.DPS
                dcv.xacapacity = Math.floor((xdcv.damage * dcv.sv.mp) / dcv.sv.cost); // XS+AA Capacity
                dcv.xadamage = Math.floor(xdcv.damage); // XS+AA Damage
            } else {
                dcv.xadps = dcv.dps;
                dcv.xc2dps = dcv.c2dps;
                dcv.xac2dps = dcv.c2dps;
                dcv.xacapacity = dcv.capacity;
                dcv.xadamage = dcv.damage;
            }
        }
    }
    const sortKey = elemSort.value;
    switch (sortKey) {
        case 'duration':
        case 'cduration':
        case 'c2duration':
            sortObjectArray(ranking, sortKey, true);
            break;
        default:
            sortObjectArray(ranking, sortKey);
            break;
    }
    //console.log('ranking',ranking);
}

function getDCA(duration, combination, acceleration, speed_rate, acceleration_rate, acceleration_offset, charge_offset) {
    const dca = {};
    if (duration > acceleration) {
        dca.duration = speed_rate * (duration - acceleration + acceleration / acceleration_rate) + acceleration_offset;
    } else {
        dca.duration = (speed_rate * duration) / acceleration_rate + acceleration_offset;
    }
    if (combination) {
        if (combination > acceleration) {
            dca.combination =
                speed_rate * (combination - acceleration + acceleration / acceleration_rate) + acceleration_offset;
        } else {
            dca.combination = (speed_rate * combination) / acceleration_rate + acceleration_offset;
        }
    } else {
        dca.combination = Infinity;
    }
    dca.acceleration = acceleration * speed_rate;
    if (charge_offset) {
        dca.duration += charge_offset;
        dca.combination += charge_offset;
    }
    return dca;
}

function getComboSpeedRate(combo_speed, combo) {
    return 1 - combo_speed * Math.min(Math.floor(combo / 10), 5);
}

function getDPM(dcv) {
    let mp = dcv.sv.mp;
    const dmp = dcv.sv.c.type.ns_hits * dcv.sv.mpr;
    const ns_duration = dcv.sv.c.type.ns_duration * dcv.combo_speed_rate * dcv.sv.c.s3_speed ? dcv.sv.c.s3_speed : 1;
    let time = 0;
    let count = 0;
    while (time <= 60) {
        if (mp >= dcv.sv.cost) {
            // s3
            time += dcv.duration;
            mp -= dcv.sv.cost;
            count++;
        } else {
            // normal set
            time += ns_duration;
            mp += dmp;
        }
    }
    return dcv.damage * (count + (time - 60) / dcv.duration);
}

function showRanking() {
    const filter = getFilter();
    elemRanking.html('');
    const score_key = elemSort.value;
    let rank = 0;

    const filtered = [];
    let max = 0;
    let min = Number.MAX_VALUE;
    for (let i = 0; i < ranking.length; i++) {
        const dcv = ranking[i];
        if (
            filter.lv[dcv.sv.lv] &&
            filter.s[dcv.sv.c.rarity] &&
            filter.r[dcv.sv.r] &&
            filter.type[dcv.sv.c.type.id] &&
            filter.charge[dcv.sv.c.s3_charge_lv] &&
            match(dcv.sv.c.meta, filter.keyword)
        ) {
            rank++;
            dcv.rank = zero(rank, 3);
            dcv.id = i;
            filtered.push(dcv);
            max = Math.max(max, dcv.capacity);
            min = Math.min(min, dcv.dps);
        }
    }
    //adjust scale of damage to 1.25 and capacity to 2/3
    const dif = (max * 2) / 3 - min;
    const offset = 30;
    const remains = 100 - offset;
    for (let i = 0; i < filtered.length; i++) {
        const dcv = filtered[i];
        dcv.p_dps = offset + (remains * (dcv.dps - min)) / dif;
        dcv.p_damage = offset + (remains * (dcv.damage * 1.25 - min)) / dif;
        dcv.p_capacity = offset + (remains * ((dcv.capacity * 2) / 3 - min)) / dif;
        dcv.score = dcv[score_key];
        dcv.color = dcv.sv.c.element.color;
        dcv.cname = dcv.sv.c.cname['name' + lang];
        dcv.video = 0;
        if (dcv.sv.c.s3_video) {
            dcv.video = 1;
        }
        const html = mapperInfo.map(dcv);
        elemRanking.append(DO.new(html));
    }
}

function getFilter() {
    const filter = {
        lv: {},
        s: {},
        r: {},
        charge: {},
        type: {}
    };
    DO.qa('.filter input').forEach(function (item) {
        if (item.name === 'keyword') {
            filter.keyword = item.value;
        } else {
            filter[item.name][parse(item.value)] = item.checked;
        }
    });
    flipAllZero(filter.lv);
    flipAllZero(filter.r);
    flipAllZero(filter.type);
    filter.charge[undefined] = true;
    if (filter.keyword === '') {
        filter.keyword = [];
    } else {
        filter.keyword = filter.keyword.toLowerCase().split(/\s+/);
    }
    //console.log(filter);
    return filter;
}

function getCharDetail(id) {
    const dcv = ranking[id];
    const c = dcv.sv.c;
    const name_key = 'name' + lang;
    const html = ['<table><tbody>'];
    html.push(getKVTableRow('Short Name', c.short + ' / ' + c.short_en));
    html.push(getKVTableRow('Name(Jp)', c.name));
    html.push(getKVTableRow('Name(En)', c.name_en));
    html.push(getKVTableRow('Gacha(Jp)', c.group.long));
    html.push(getKVTableRow('Gacha(En)', c.group.long_en));
    html.push(getKVTableRow('Atk Weapon', c.eq_atk_wep[name_key]));
    html.push(getKVTableRow('Atk Armor', c.eq_atk_amr[name_key]));
    html.push(getKVTableRow('Atk Accessory', c.eq_atk_acc[name_key]));
    html.push(getKVTableRow('MP Weapon', c.eq_mp_wep[name_key]));
    html.push(getKVTableRow('MP Armor', c.eq_mp_amr[name_key]));
    html.push(getKVTableRow('MP Accessory', c.eq_mp_acc[name_key]));
    html.push(getKVTableRow('Combo Atk Weapon', c.eq_combo_wep[name_key]));
    html.push(getKVTableRow('Combo Atk Armor', c.eq_combo_amr[name_key]));
    html.push(getKVTableRow('Combo Atk Accessory', c.eq_combo_acc[name_key]));

    html.push(getKVTableRow('Character Atk', Math.floor(dcv.sv.atk_c)));
    html.push(getKVTableRow('Equipment Atk', Math.floor(dcv.sv.atk_eq)));
    if (c.s3_gatk > 0) {
        html.push(getKVTableRow('Group Atk Buff', c.s3_gatk));
    } else if (c.s3_atk > 0) {
        html.push(getKVTableRow('Atk Buff', c.s3_atk));
    }
    if (c.s3_catk > 0) {
        html.push(getKVTableRow('Circle Atk Buff', c.s3_catk));
    }
    if (c.combo_damage_20 > 1) {
        html.push(getKVTableRow('Combo Damage 20Hit', c.combo_damage_20));
    }
    if (c.combo_damage_30 > 1) {
        html.push(getKVTableRow('Combo Damage 30Hit', c.combo_damage_30));
    }
    html.push(getKVTableRow('Skill Duration', c.s3_duration, true));
    if (c.combo_speed > 0) {
        html.push(getKVTableRow('Skill Duration (50Hit)', dcv.duration_50, true));
    }
    if (c.s3_c_duration > 0) {
        html.push(getKVTableRow('Combination (sec)', c.s3_c_duration, true));
        if (c.combo_speed > 0) {
            html.push(getKVTableRow('Combination (50Hit)', dcv.cduration_50, true));
        }
    }
    if (c.s3_acceleration > 0) {
        html.push(getKVTableRow('Acceleration (sec)', c.s3_acceleration, true));
        if (c.combo_speed > 0) {
            html.push(getKVTableRow('Acceleration (50Hit)', dcv.acceleration_50, true));
        }
    }
    html.push(getKVTableRow('Skill Rate', c.s3_rate, true));
    html.push(
        getKVTableRow(
            'Slash/Pierce/Blunt/Magic',
            formatFloat(c.dtr_slash) +
            '/' +
            formatFloat(c.dtr_pierce) +
            '/' +
            formatFloat(c.dtr_blunt) +
            '/' +
            formatFloat(c.dtr_magic)
        )
    );
    if (c.s3_debuf > 0) {
        html.push(getKVTableRow('Debuff Rate', c.s3_debuf, true));
        html.push(getKVTableRow('Debuff P/N Rate', c.s3_debuf_pnr, true));
    }
    html.push(getKVTableRow('Hit Count', c.hits === 0 ? 'no data' : c.hits));
    html.push(getKVTableRow('Hit Count at Canceled', c.canceled_hits === 0 ? 'no data' : c.canceled_hits));
    html.push(getKVTableRow('SS MP Cost', c.s3_mp));
    html.push(getKVTableRow('Possible Max MP', dcv.sv.mp));
    html.push(
        getKVTableRow(
            'MP Limit Break',
            c.mp_lb_total + '(' + c.mp_lb_1 + ',' + c.mp_lb_2 + ',' + c.mp_lb_3 + ',' + c.mp_lb_4 + ') EXPERIMENTAL!'
        )
    );
    html.push('</tbody></table>');
    if (c.s3_video) {
        html.push('<div class="tcontainer hidden"><a class="hidden" href="' + c.s3_video + '"></a><div>');
    }
    return html.join('');
}

function createTweetWidgets(detail) {
    const container = detail.q('.tcontainer');
    if (container) {
        const id = container.q('a').href.split('/status/')[1];
        twttr.widgets.createTweet(id, container, {
            width: '100%'
        }).then(() => container.classList.toggle('hidden'));
    }
}

function getKVTableRow(key, value, float) {
    let v = value;
    if (float) {
        v = formatFloat(v);
    }
    return '<tr><th>' + key + '</th><td>' + v + '</td></tr>';
}

function formatFloat(value) {
    return Math.floor(value * 100) / 100;
}