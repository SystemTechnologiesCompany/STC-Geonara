import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),context=vm.createContext({URL});
for(const file of ['data.js','i18n.js','discovery-i18n.js','earth-dictionary-meta.js','earth-dictionary.js','fossil-meta.js','fossils.js','assets/fossils/index.js'])vm.runInContext(readFileSync(new URL(file,root),'utf8'),context);
const run=code=>vm.runInContext(code,context);
const meta=run('fossilMeta'),index=run('fossilIndex');
assert.equal(index.length,meta.count);assert.ok(meta.count>200000);assert.equal(meta.genera+meta.species,meta.count);
assert.equal(new Set(index.map(row=>row[0])).size,index.length);
assert.equal(index.filter(row=>row[3]===1).length,meta.species);
const groups=run('fossilGroups'),details=new Map();
for(const row of index){assert.ok(Number.isInteger(row[0])&&row[0]>0);assert.ok(row[1]);assert.ok(groups[row[2]]);assert.ok([0,1].includes(row[3]));}
for(const letter of meta.chunks){vm.runInContext(readFileSync(new URL('assets/fossils/'+letter+'.js',root),'utf8'),context);const rows=run(`fossilDetailChunks.get('${letter}')`);for(const row of rows){assert.equal(row.length,17);assert.ok(!details.has(row[0]));details.set(row[0],row);assert.ok(row[9]>0);if(row[5]!=null&&row[6]!=null)assert.ok(row[5]>=row[6]);}}
assert.equal(details.size,index.length);
for(const row of index)assert.ok(details.has(row[0]),'Every indexed fossil needs real details.');
run('fossilRows=fossilIndex;fossilById=new Map(fossilRows.map(row=>[row[0],row]));');
const search=query=>run(`filterFossilRows(fossilIndex,{query:${JSON.stringify(query)},group:'',rank:''})`);
for(const name of ['Calymene','Tyrannosaurus rex','Dactylioceras','Nummulites','Didymograptus','Triceratops'])assert.ok(search(name).some(row=>row[1]===name),name+' must be searchable');
assert.ok(run("filterFossilRows(fossilIndex,{query:'',group:'trilobites',rank:'1'}).every(row=>row[2]==='trilobites'&&row[3]===1)"));
const rex=search('Tyrannosaurus rex').find(row=>row[1]==='Tyrannosaurus rex');context.testRow=rex;context.testDetail=details.get(rex[0]);
assert.ok(run('fossilDescription(testRow,testDetail)').includes('Tyrannosauridae'));
assert.ok(run('fossilProperties(testRow,testDetail)').some(([label,value])=>label==='Diet'&&value==='carnivore'));
assert.equal(run('fossilRange(null)'),'Not recorded');
for(const language of ['fr','ar']){run(`currentLanguage='${language}'`);assert.notEqual(run("t('Fossils')"),'Fossils');assert.ok(run('fossilDescription(testRow,testDetail)').includes('Tyrannosaurus rex'));for(const group of Object.keys(groups))assert.ok(run(`fossilGroupName('${group}')`));}
const html=readFileSync(new URL('index.html',root),'utf8'),server=readFileSync(new URL('tools/serve.mjs',root),'utf8')+readFileSync(new URL('tools/static-files.mjs',root),'utf8');
assert.ok(html.indexOf('fossil-meta.js')<html.indexOf('fossils.js'));assert.ok(html.indexOf('fossils.js')<html.indexOf('src="app.js"'));assert.ok(server.includes("assets/fossils"));
assert.ok(!/fetch\(/.test(readFileSync(new URL('fossils.js',root),'utf8')),'Fossils must load through scripts for direct-file compatibility.');
console.log(`Fossil checks passed: ${meta.count.toLocaleString('en')} unique sourced taxa, complete chunk coverage, classification, real occurrence ranges and ecology, name search, group/rank filters, comparison properties, translations, and direct-file-compatible loading.`);
