var ranking;
var boss;
var lang;
var elemRanking;
var elemSort;
var config;
var mapperInfo;

DO.onLoad(function () {
    initPre();
    loadDB(init);
});

function init() {
    loadHelp();
    initVM();
    initPost();
}

function loadHelp() {
    fetch('help' + lang + '.html', { method: 'GET' })
        .then(function(responce){return responce.text()})
        .then(initHelp)
        .catch(function (error) { console.log(error); });
}

function initHelp(html) {
    DO.qid('help').html(html);
    var elmRankingEvent = DO.qid('rankingevents');
    var day = 24 * 60 * 60 * 1000;
    for (var i in db.preset) {        
        var item = db.preset[i];
        if (item.start && item.end) {
            var today = new Date().getTime();
            var key = encodeURIComponent(item['name' + lang].substr(1).split(' ')[0]);
            if (today > item.start && today < item.end) {
                var html = '<p><a href="https://twitter.com/hashtag/' + key + '" target="_blank">' + item['name' + lang] + '</a>';
                html += ' is running until ' + new Date(item.end).toLocaleDateString() + '</p>';
                elmRankingEvent.append(DO.new(html));
            } else if (today > item.start - day * 3 && today < item.end) {
                var html = '<p><a href="https://twitter.com/hashtag/' + key + '" target="_blank">' + item['name' + lang] + '</a>';
                html += ' is comming at ' + new Date(item.start).toLocaleDateString() + '</p>';
                elmRankingEvent.append(DO.new(html));
            } else if (today < item.end + day * 7) {
                var html = '<p><a href="https://twitter.com/hashtag/' + key + '" target="_blank">' + item['name' + lang] + '</a>';
                html += ' was finished at ' + new Date(item.end).toLocaleDateString() + '</p>';
                elmRankingEvent.append(DO.new(html));
            }
        }
    }

    var elemCname = DO.q('#cname tbody').html('');
    var elemThemePreset = DO.qid('theme_preset').html('');
    var array_cname = getObjectArray(db.cname);
    sortObjectArray(array_cname, 'cname_en', true);
    for (var i = 0; i < array_cname.length; i++) {
        var item = array_cname[i];
        var html = '';
        html += '<tr style="color:' + item.color + '; background-color:' + item.body + ';background-image:linear-gradient(45deg,transparent 90%,' + item.body + ' 90%,' + item.body + '),linear-gradient(45deg,transparent 88%,' + item.highlight + ' 88%,' + item.highlight + '), linear-gradient(45deg,transparent 84%,' + item.head + ' 84%,' + item.head + ');"><th>';
        //html+='<tr><th>';
        html += item.cname;
        if (item.meta && item.meta !== '') {
            html += '(' + item.meta + ')';
        }
        html += '</th><td>';
        html += item.cname_en;
        html += '</td></tr>';
        html += '';
        elemCname.append(DO.new(html));
        var cn = item['cname' + lang]
        elemThemePreset.append(DO.new('<option value="' + item.cname + '">' + cn + '</option>'));
    }
    elemThemePreset.value = config.theme.preset;
    var elemGacha = DO.q('#gacha tbody').html('');
    var array_group = getObjectArray(db.group);
    sortObjectArray(array_group, 'group_date', true);
    var mapperGroup = new Mapper('<tr><th class="icon"><i class="g%group_class%"></i></th><td class="short">%group_short% / %group_short_en%</td><td>%group_long% / %group_long_en%</td></tr>'); 
    for (var i = 0; i < array_group.length; i++) {
        var item = array_group[i];
        var html = mapperGroup.map(item);
        elemGacha.append(DO.new(html));
    }
}
function getObjectArray(obj) {
    var array = [];
    for (var i in obj) {
        array.push(obj[i]);
    }
    return array;
}
function sortObjectArray(obj, key, asend) {
    if (asend) {
        obj.sort(function (a, b) {
            if (a[key] < b[key]) { return -1; }
            if (a[key] > b[key]) { return 1; }
            return 0;
        });
    } else {
        obj.sort(function (a, b) {
            if (a[key] > b[key]) { return -1; }
            if (a[key] < b[key]) { return 1; }
            return 0;
        });
    }
}

function initVM() {
    var lvr = [
        { lv: 80, r: 0 },
        { lv: 80, r: 4 },
        { lv: 80, r: 5 },
        { lv: 90, r: 0 },
        { lv: 90, r: 4 },
        { lv: 90, r: 5 },
        { lv: 100, r: 0 },
        { lv: 100, r: 4 },
        { lv: 100, r: 5 },
    ]
    ranking = [];
    for (var i in db.base) {
        var c = db.base[i];
        //console.log(c);
        for (var i in lvr) {
            ranking.push(getViewModel(c, c.eq_atk_wep, c.eq_atk_amr, c.eq_atk_acc, lvr[i].lv, lvr[i].r));
        }
    }
    //console.log('vm',ranking);
}

function initPre() {
    //get lang
    var language = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language || window.navigator.userLanguage || window.navigator.browserLanguage;
    if (language.substr(0, 2) === 'ja') {
        lang = '';
        //lang = '_en';
    } else {
        lang = '_en';
    }
    DO.qid('ranking').focus();

    //init config
    config = store.get('config');
    if (config === undefined) {
        config = {
            wallpaper_url: '',
            wallpaper_effect: 'smoke',
        };
        store.set('config', config);
    }
    //set theme
    if (config.theme === undefined) {
        config.theme = getThemeConfig();
        store.set('config', config);
    }
    setTheme(config.theme);

    //set wallpaper
    DO.qid('effect').value = config.wallpaper_effect;
    DO.qid('main').className = config.wallpaper_effect;
    DO.qid('wallpaper').value = config.wallpaper_url;
    setWallpaper(config.wallpaper_url);
    //set config ui events;
    DO.qid('help_button').on('click', function (ev) {
        DO.qid('help' + lang).classList.toggle('hidden');
        ev.target.classList.toggle('on');
    });
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
        var cn = db.cname[ev.target.value];
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
    mapperInfo = new Mapper(DO.qid('item_info').innerHTML);
}
function initPost() {

    //load preset
    var elemPreset = DO.qid('preset').html('');
    for (var i = 0; i < db.preset.length; i++) {
        var name = db.preset[i]['name' + lang];
        elemPreset.append(DO.new('<option value="' + i + '">' + name + '</option>'));
    }

    //init ui
    elemRanking = DO.qid('ranking');
    elemSort = DO.qid('sort');
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
            elemDetail.classList.toggle('hidden');
        }
    });
}

function getThemeConfig() {
    return {
        preset: DO.qid('theme_preset').value,
        color: DO.qid('theme_color').value,
        body: DO.qid('theme_body').value,
        head: DO.qid('theme_head').value,
        highlight: DO.qid('theme_highlight').value,
    }
}
function setRandomTheme() {
    //set theme
    var cname_keys = Object.keys(db.cname);
    setTheme(db.cname[cname_keys[Math.floor(Math.random() * cname_keys.length)]]);
}
function setTheme(theme) {
    DO.qid('header').css({
        'color': theme.color,
        'background-color': theme.body,
        'background-image': 'linear-gradient(45deg,transparent 90%,' + theme.body + ' 90%,' + theme.body + '),linear-gradient(45deg,transparent 88%,' + theme.highlight + ' 88%,' + theme.highlight + '), linear-gradient(45deg,transparent 84%,' + theme.head + ' 84%,' + theme.head + ')'
    });
    DO.q('#header i.app').css('border-color', theme.body);
    DO.qid('footer').css({
        'color': theme.color,
        'background-color': theme.body
    });
}

function setWallpaper(url) {
    DO.qid('main').css({ 'background-image': 'url(' + url + ')' });
}

function putBoss() {
    boss = { crit: 1 };
    DO.qa('.boss input,.boss select').forEach(function (item) {
        if (item.type === 'radio') {
            if (item.checked) {
                if (item.name === 'element') {
                    boss[item.name] = db.element[item.value];
                } else {
                    boss[item.name] = parse(item.value);
                }
            }
        } else {
            boss[item.name] = parse(item.value);
        }
    });
    //console.log('putBoss',boss);
    return boss;
}

function setBoss(boss) {
    //console.log('setBoss',boss);
    DO.qa('.boss input,.boss select').forEach(function (item) {
        if (item.type === 'radio') {
            if (item.name === 'element') {
                if (boss[item.name]) {
                    item.checked = boss[item.name].element === parse(item.value);
                } else {
                    item.checked = false;
                }
            } else {
                item.checked = boss[item.name] === parse(item.value);
            }
        } else {
            if (item.name === 'condition' && boss[item.name] === 0) {
                item.value = '';
            } else {
                item.value = boss[item.name];
            }
        }
    });
    if (boss.filter !== 0) {
        DO.qid('keyword').value = boss.filter;
    }
}

function calcRanking() {
    //console.log('calcRanking');
    putBoss();
    for (var i in ranking) {
        var vm = ranking[i];
        calcNetDamage(vm, boss);
        var duration = vm.data.s3_duration * (1 - vm.data.combo_speed * Math.floor(boss.combo / 10));
        vm.dps = Math.floor(vm.damage / duration);
        vm.capacity = Math.floor(vm.damage * vm.mp / vm.data.s3_mp);
        vm.damage = Math.floor(vm.damage);
    }
    var sortKey = elemSort.value;
    switch (sortKey) {
        case 'duration':
            sortObjectArray(ranking, sortKey, true);
            break;
        default:
            sortObjectArray(ranking, sortKey);
            break;
    }
    //console.log('ranking',ranking);
}

function showRanking() {
    var filter = getFilter();
    elemRanking.html('');
    var score_key = elemSort.value;
    var rank = 0;

    var filtered = [];
    var max = 0;
    var min = Number.MAX_VALUE;
    for (var i = 0; i < ranking.length; i++) {
        var c = ranking[i];
        if (filter.lv[c.lv] && filter.r[c.r] && filter.type[c.data.type.type] && match(c.data.meta, filter.keyword)) {
            rank++;
            filtered.push({ rank: rank, id: i, c: c });
            max = Math.max(max, c.capacity);
            min = Math.min(min, c.dps);
        }
    }
    var dif = max * 2 / 3 - min;
    var offset = 30;
    var remains = 100 - offset;
    for (var i = 0; i < filtered.length; i++) {
        var f = filtered[i];
        f.c.p_dps = offset + remains * (f.c.dps - min) / dif;
        f.c.p_damage = offset + remains * (f.c.damage - min) / dif;
        f.c.p_capacity = offset + remains * (f.c.capacity * 2 / 3 - min) / dif;
        showInfo(f.id, f.rank, f.c, score_key);
    }
}

function getFilter() {
    var filter = { lv: {}, r: {}, type: {} };
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
    if (filter.keyword === '') {
        filter.keyword = [];
    } else {
        filter.keyword = filter.keyword.toLowerCase().split(/\s+/);
    }
    //console.log(filter);
    return filter;
}

function showInfo(id, rank, c, score_key) {
    var html = mapperInfo.map({
        id:id,
        rank:zero(rank,3),
        color:c.data.element.color,
        c:c,
        cname:c.data.cname['cname' + lang],
        score:c[score_key],
    });
    elemRanking.append(DO.new(html));
}
function getCharDetail(id) {
    var c = ranking[id];
    var html = '<table><tbody>';
    var name_key = 'name' + lang;
    html += getKVTableRow('Name', c.data[name_key]);
    html += getKVTableRow('Gacha', c.data.group['group_long' + lang]);
    html += getKVTableRow('Atk Weapon', c.data.eq_atk_wep[name_key]);
    html += getKVTableRow('Atk Armor', c.data.eq_atk_amr[name_key]);
    html += getKVTableRow('Atk Accessory', c.data.eq_atk_acc[name_key]);
    html += getKVTableRow('MP Weapon', c.data.eq_mp_wep[name_key]);
    html += getKVTableRow('MP Armor', c.data.eq_mp_amr[name_key]);
    html += getKVTableRow('MP Accessory', c.data.eq_mp_acc[name_key]);

    html += getKVTableRow('Character Atk', Math.floor(c.atk_c));
    html += getKVTableRow('Equipment Atk', Math.floor(c.atk_eq));
    if (c.data.s3_gatk > 1) {
        html += getKVTableRow('Group Atk Buff', c.data.s3_gatk);
    } else if (c.data.s3_atk > 1) {
        html += getKVTableRow('Atk Buff', c.data.s3_atk);
    }
    if (c.data.combo_damage_20 > 1) {
        html += getKVTableRow('Combo Damage 20Hit', c.data.combo_damage_20);
    }
    if (c.data.combo_damage_30 > 1) {
        html += getKVTableRow('Combo Damage 30Hit', c.data.combo_damage_30);
    }
    html += getKVTableRow('Skill Duration', c.duration, true);
    if (c.data.combo_speed > 0) {
        html += getKVTableRow('Skill Duration (50Hit)', c.duration_50, true);
    }
    html += getKVTableRow('Skill Rate', c.data.s3_rate, true);
    html += getKVTableRow('Slash/Pierce/Blunt/Magic', formatFloat(c.data.dtr_slash) + '/' + formatFloat(c.data.dtr_pierce) + '/' + formatFloat(c.data.dtr_blunt) + '/' + formatFloat(c.data.dtr_magic));
    if (c.data.s3_debuf > 0) {
        html += getKVTableRow('Debuff Rate', c.data.s3_debuf, true);
        html += getKVTableRow('Debuff P/N Rate', c.data.s3_debuf_pnr, true);
    }
    html += getKVTableRow('SS MP Cost', c.data.s3_mp);
    html += getKVTableRow('Possible Max MP', c.mp);
    html += getKVTableRow('MP Limit Break', c.data.mp_lb_total + '(' + c.data.mp_lb_1 + ',' + c.data.mp_lb_2 + ',' + c.data.mp_lb_3 + ',' + c.data.mp_lb_4 + ') EXPERIMENTAL!');
    html += '</tbody></table>'
    if (c.data.s3_video) {
        html += '<div class="tcontainer"><blockquote class="twitter-tweet"><a href="' + c.data.s3_video + '"></a></blockquote><div>';
    }
    return html;
}
function getKVTableRow(key, value, float) {
    var v = value;
    if (float) {
        v = formatFloat(v);
    }
    return '<tr><th>' + key + '</th><td>' + v + '</td></tr>';
}
function formatFloat(value) {
    return Math.floor(value * 100) / 100;
}

