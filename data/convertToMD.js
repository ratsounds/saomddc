/* 
  Helper Nodejs Script to make unit and equipment name csv file from data.json
*/
const fs = require('fs');
const data = require('./data.json');

function getMDTable(title, src, props) {
    if (props === undefined) {
        for (let key in src) {
            props = Object.keys(src[key]);
            break;
        }
    }
    const out = ['## ' + title, '', props.map((item) => item.key ? item.key : item).join('|')];
    const conf = { col: ':--:', row: [] };
    for (let i = 0; i < props.length; i++) {
        conf.row.push(conf.col);
    }
    out.push(conf.row.join('|'))
    for (let id in src) {
        const item = src[id];
        const line = [];
        for (let p = 0; p < props.length; p++) {
            const prop = props[p];
            if (prop.map) {
                line.push(prop.map(item[prop.key], item));
            }
            else {
                line.push(item[prop]);
            }
        }
        out.push(line.join('|'));
    }
    out.push('');
    out.push('');
    return out.join('\n')
}

function getUnitStyle(item) {
    return 'color:' +
        item.color +
        '; background-color:' +
        item.body +
        ';background-image:linear-gradient(45deg,transparent 90%,' +
        item.body +
        ' 90%,' +
        item.body +
        '),linear-gradient(45deg,transparent 88%,' +
        item.highlight +
        ' 88%,' +
        item.highlight +
        '), linear-gradient(45deg,transparent 84%,' +
        item.head +
        ' 84%,' +
        item.head +
        ');';
}

function writeMD(filename, frontmatter, out) {
    fs.writeFileSync(filename, frontmatter + out, 'utf8');
}
writeMD('./docs/ja/data.md', [
        '---',
        'layout: page',
        'title: Data',
        'permalink: /ja/data/',
        'lang: ja',
        'order: 30',
        '---',
        '',
    ].join('\n'),
    getMDTable('Banners', data.group, [
        { key: 'class', map: function(value) { return '![g' + value + '.png](../../icons/g' + value + '.png)' } },
        'short',
        'short_en',
        'long',
        'long_en'
    ]) // group list 
    +
    getMDTable('Characters', data.cname, [
        'name',
        'name_en',
        { key: 'color', map: function(value, item) { return '<span class="color-box" style="' + getUnitStyle(item) + '">__theme__</span>' } },
    ]) // cname list 
);


writeMD('./docs/en/data.md', [
        '---',
        'layout: page',
        'title: Data',
        'permalink: /en/data/',
        'lang: en',
        'order: 30',
        '---',
        '',
    ].join('\n'),
    getMDTable('Banners', data.group, [
        { key: 'class', map: function(value) { return '![g' + value + '.png](../../icons/g' + value + '.png)' } },
        'short',
        'short_en',
        'long',
        'long_en'
    ]) // group list 
    +
    getMDTable('Characters', data.cname, [
        'name',
        'name_en',
        { key: 'color', map: function(value, item) { return '<span class="color-box" style="' + getUnitStyle(item) + '">__theme__</span>' } },
    ]) // cname list 
);
