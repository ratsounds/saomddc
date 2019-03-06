/* 
  Helper Nodejs Script to make unit and equipment name csv file from data.json
*/

const fs = require('fs');
const data = require('./data.json');

function writeCSV(filename, src, props) {
  const out = [props.join(',')];
  for (let id in src) {
    const item = src[id];
    const line = [];
    for (let p = 0; p < props.length; p++) {
      line.push(item[props[p]]);
    }
    out.push('"' + line.join('","') + '"');
  }
  fs.writeFileSync(filename, out.join('\n'), 'utf8');
}

// unit list
const csv = [
  ['name', 'name_en', 'group', 'group_en'].join(',')
];
for (let id in data.base) {
  const unit = data.base[id];
  const group = data.group[unit.group];
  csv.push('"' + [unit.name, unit.name_en, group.long, group.long_en].join('","') + '"');
}
fs.writeFileSync('unit+group.csv', csv.join('\n'), 'utf8');

// weapon list
writeCSV('weapon.csv', data.weapon, ['name', 'name_en']);
// armor list 
writeCSV('armor.csv', data.armor, ['name', 'name_en']);
// accesorry list 
writeCSV('accesorry.csv', data.accesorry, ['name', 'name_en']);