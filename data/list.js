/* 
  Helper Nodejs Script to make unit name csv file from data.json
*/

const fs = require('fs');
const data = require('./data.json');
const csv = [['name','name_en','group','group_en'].join(',')];
for(let id in data.base) {
  const unit = data.base[id];
  const group = data.group[unit.group];
  csv.push('"'+[unit.name, unit.name_en, group.long, group.long_en].join('","')+'"');
}
fs.writeFileSync('list.csv',csv.join('\n'),'utf8');