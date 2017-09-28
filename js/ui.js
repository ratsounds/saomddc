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
];
var ranking;
var boss;
var lang;
var elemRanking;
var elemSort;
var config;
var mapperInfo;

DO.onLoad(function () {
    initPre();
    loadDBFromFile('data/data.json', init);
});

function init() {
    loadHelp();
    initPost();
}

function loadHelp() {
    fetch('help' + lang + '.html', { method: 'GET' })
        .then(function (responce) { return responce.text() })
        .then(initHelp)
        .catch(function (error) { console.log(error); });
}

function initHelp(html) {
    DO.qid('help').html(html);
    var elmRankingEvent = DO.qid('rankingevents');
    var day = 24 * 60 * 60 * 1000;
    var db = DC.getData();
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
    sortObjectArray(array_cname, 'name_en', true);
    for (var i = 0; i < array_cname.length; i++) {
        var item = array_cname[i];
        var html = '';
        html += '<tr style="color:' + item.color + '; background-color:' + item.body + ';background-image:linear-gradient(45deg,transparent 90%,' + item.body + ' 90%,' + item.body + '),linear-gradient(45deg,transparent 88%,' + item.highlight + ' 88%,' + item.highlight + '), linear-gradient(45deg,transparent 84%,' + item.head + ' 84%,' + item.head + ');"><th>';
        //html+='<tr><th>';
        html += item.name;
        if (item.nick && item.nick !== item.name) {
            html += '(' + item.nick + ')';
        }
        html += '</th><td>';
        html += item.name_en;
        if (item.nick_en && item.nick_en !== item.name_en) {
            html += '(' + item.nick_en + ')';
        }
        html += '</td></tr>';
        html += '';
        elemCname.append(DO.new(html));
        var cn = item['name' + lang]
        elemThemePreset.append(DO.new('<option value="' + item.id + '">' + cn + '</option>'));
    }
    elemThemePreset.value = config.theme.preset;
    var elemGacha = DO.q('#gacha tbody').html('');
    var array_group = getObjectArray(db.group);
    sortObjectArray(array_group, 'group_date', true);
    var mapperGroup = new Mapper('<tr><th class="icon"><i class="g%class%"></i></th><td class="short">%short% / %short_en%</td><td>%long% / %long_en%</td></tr>');
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

    //set sidebar
    if (config.sidebar === undefined) {
        config.sidebar = '';
        store.set('config', config)
    }
    DO.qid('sidebar_url').value = config.sidebar;        

    showSidebar();

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
        var cn = DC.getCname()[ev.target.value];
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
    window.matchMedia('only screen and (orientation:landscape)').addListener(showSidebar);
    mapperInfo = new Mapper(DO.qid('item_info').innerHTML);
}
function initPost() {
    var db = DC.getData();

    //create group icon css
    //set app icon
    fetch('data/appicon.json', { method: 'GET' })
        .then(function (responce) { return responce.text() })
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

function showSidebar(){
    var elemMain = DO.qid('main');
    var elemBody = DO.q('body');
    var elemSidebar = DO.qid('sidebar');
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

function putBoss() {
    var db = DC.getData();
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
                    item.checked = boss[item.name].id === parse(item.value);
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
    var cs = DC.getChar();
    ranking = [];
    for (var i in lvr) {
        var clvr = lvr[i];
        for (var j in cs) {
            var c = cs[j];
            var dcv = DC.calcDamage(c, clvr.lv, 4, c.eq_atk_wep, clvr.r, c.eq_atk_amr, c.eq_atk_acc, boss);
            ranking.push(dcv);
            dcv.duration = dcv.sv.c.s3_duration * (1 - dcv.sv.c.combo_speed * Math.floor(boss.combo / 10));
            dcv.duration_50 = dcv.sv.c.s3_duration * (1 - dcv.sv.c.combo_speed * Math.floor(50 / 10));
            dcv.dps = Math.floor(dcv.damage / dcv.duration);
            dcv.capacity = Math.floor(dcv.damage * dcv.sv.mp / dcv.sv.cost);
            dcv.damage = Math.floor(dcv.damage);
        }
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
        var dcv = ranking[i];
        if (filter.lv[dcv.sv.lv] && filter.r[dcv.sv.r] && filter.type[dcv.sv.c.type.id] && match(dcv.sv.c.meta, filter.keyword)) {
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

function getCharDetail(id) {
    var dcv = ranking[id];
    var c = dcv.sv.c;
    var html = '<table><tbody>';
    var name_key = 'name' + lang;
    html += getKVTableRow('Name', c[name_key]);
    html += getKVTableRow('Gacha', c.group['long' + lang]);
    html += getKVTableRow('Atk Weapon', c.eq_atk_wep[name_key]);
    html += getKVTableRow('Atk Armor', c.eq_atk_amr[name_key]);
    html += getKVTableRow('Atk Accessory', c.eq_atk_acc[name_key]);
    html += getKVTableRow('MP Weapon', c.eq_mp_wep[name_key]);
    html += getKVTableRow('MP Armor', c.eq_mp_amr[name_key]);
    html += getKVTableRow('MP Accessory', c.eq_mp_acc[name_key]);

    html += getKVTableRow('Character Atk', Math.floor(dcv.sv.atk_c));
    html += getKVTableRow('Equipment Atk', Math.floor(dcv.sv.atk_eq));
    if (c.s3_gatk > 1) {
        html += getKVTableRow('Group Atk Buff', c.s3_gatk);
    } else if (c.s3_atk > 1) {
        html += getKVTableRow('Atk Buff', c.s3_atk);
    }
    if (c.combo_damage_20 > 1) {
        html += getKVTableRow('Combo Damage 20Hit', c.combo_damage_20);
    }
    if (c.combo_damage_30 > 1) {
        html += getKVTableRow('Combo Damage 30Hit', c.combo_damage_30);
    }
    html += getKVTableRow('Skill Duration', dcv.duration, true);
    if (c.combo_speed > 0) {
        html += getKVTableRow('Skill Duration (50Hit)', dcv.duration_50, true);
    }
    html += getKVTableRow('Skill Rate', c.s3_rate, true);
    html += getKVTableRow('Slash/Pierce/Blunt/Magic', formatFloat(c.dtr_slash) + '/' + formatFloat(c.dtr_pierce) + '/' + formatFloat(c.dtr_blunt) + '/' + formatFloat(c.dtr_magic));
    if (c.s3_debuf > 0) {
        html += getKVTableRow('Debuff Rate', c.s3_debuf, true);
        html += getKVTableRow('Debuff P/N Rate', c.s3_debuf_pnr, true);
    }
    html += getKVTableRow('SS MP Cost', c.s3_mp);
    html += getKVTableRow('Possible Max MP', c.mp);
    html += getKVTableRow('MP Limit Break', c.mp_lb_total + '(' + c.mp_lb_1 + ',' + c.mp_lb_2 + ',' + c.mp_lb_3 + ',' + c.mp_lb_4 + ') EXPERIMENTAL!');
    html += '</tbody></table>'
    if (c.s3_video) {
        html += '<div class="tcontainer"><blockquote class="twitter-tweet"><a href="' + c.s3_video + '"></a></blockquote><div>';
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

