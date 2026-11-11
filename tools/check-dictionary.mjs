import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {petroleumEntries,petroleumTopics} from './dictionary-petroleum.mjs';
const context=vm.createContext({URL});
for(const file of ['data.js','i18n.js','earth-dictionary-meta.js','earth-dictionary-data.js','earth-dictionary.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),context);
const run=code=>vm.runInContext(code,context);
run('globalThis.records=earthDictionary;buildDictionaryIndex(earthDictionary);');
const records=context.records;
assert.ok(records.length>1500,'The active dictionary must contain more than 1500 defined concepts.');
assert.ok(records.length>=5175);assert.equal(run('earthDictionaryMeta.count'),records.length);
assert.equal(new Set(records.map(record=>record.id)).size,records.length);
assert.equal(run('new Set(earthDictionary.map(record=>normalizeDictionary(record.name.en))).size'),records.length);
assert.ok(new Set(records.map(record=>record.definition.en.toLowerCase())).size>1500,'Definitions must be substantive, not reused filler.');
assert.equal(new Set(records.map(record=>record.category)).size,28);
for(const record of records){
 assert.ok(record.definition.en.trim().length>=40,record.name.en+': missing definition');
 assert.ok(record.definition.en.trim().split(/\s+/).length>=6);
 assert.ok(!/^no definition|^not available|^tbd|^see also|^see:/i.test(record.definition.en));
 assert.match(record.id,/^[a-z0-9-]+$/);
 if(record.url)assert.ok(run(`dictionarySourceURL(${JSON.stringify(record.url)})`));
}
assert.equal(run('earthDictionary.filter(record=>record.featured).length'),15,'Original concepts must remain available.');
assert.ok(run('filterDictionary(earthDictionary,{query:"porosité"}).some(record=>record.name.en==="Porosity")'));
assert.ok(run('filterDictionary(earthDictionary,{query:"المسامية"}).some(record=>record.name.en==="Porosity")'));
assert.ok(run('filterDictionary(earthDictionary,{query:"geoid"}).length')>0);
assert.equal(run('filterDictionary(earthDictionary,{query:"geoid"})[0].name.en'),'Geoid','Exact concept names should precede definition-only matches.');
for(const category of ['Geology','Oceanography','Climate Science','Hydrology','Soil Science','Geophysics','Cryosphere','Atmospheric Science','Ecology','Palaeontology'])assert.ok(records.some(record=>record.category===category));
const invalidURL=run('dictionarySourceURL("https://apps.usgs.gov.evil.example/test")');assert.equal(invalidURL,'');assert.equal(run('dictionarySourceURL("javascript:alert(1)")'),'');
run('currentLanguage="ar"');assert.equal(run('dictionaryDefinition(earthDictionary.find(record=>record.name.en==="Porosity")).language'),'ar');
const fallback=records.find(record=>!record.definition.fr);assert.ok(fallback);
run('currentLanguage="fr"');assert.equal(run(`dictionaryDefinition(earthDictionary.find(record=>record.id===${JSON.stringify(fallback.id)})).language`),'en');
run('currentLanguage="en"');
const answer=await run('earthDictionaryAnswer("What is the geoid?")');assert.ok(answer?.text.toLowerCase().includes('geoid'));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.ok(!html.includes('src="earth-dictionary-data.js"'),'Bulk dictionary data must load on demand.');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');assert.ok(app.includes('bindEarthDictionary(params)'));assert.ok(!app.includes('seedTerms.length'),'Visible dictionary totals must come from the full glossary.');
const petroleum=run('filterDictionary(earthDictionary,{category:"Petroleum Geology"})');
assert.equal(petroleum.length,run('earthDictionaryMeta.petroleumCount'));
assert.ok(petroleum.length>=500,'Petroleum geology must include the expanded collection.');
assert.equal(new Set(petroleumEntries.map(entry=>entry.name.en.toLowerCase())).size,petroleumEntries.length,'Petroleum entries must have distinct preferred names.');
assert.equal(petroleumTopics.length,14);
for(const topic of petroleumTopics)assert.ok(petroleum.some(record=>record.petroleumTopics?.includes(topic)),topic);
for(const entry of petroleumEntries)assert.ok(petroleum.some(record=>normalize(record.name.en)===normalize(entry.name.en)),entry.name.en+' must be reachable under Petroleum Geology');
function normalize(value){return value.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();}
const porosity=petroleum.find(record=>record.name.en==='Porosity');
assert.ok(porosity);assert.equal(porosity.category,'Petrology','Shared entries must retain their original discipline and definition.');
assert.ok(run('filterDictionary(earthDictionary,{category:"Petrology",query:"porosity"}).some(record=>record.name.en==="Porosity")'));
for(const [alias,preferred] of [['TOC','Source-rock total organic carbon'],['STOIIP','Original oil in place'],['MICP','Mercury injection capillary pressure'],['Ro','Vitrinite reflectance'],['WAG','Water-alternating-gas injection'],['SAGD','Steam-assisted gravity drainage']]){
 assert.equal(run(`filterDictionary(earthDictionary,{category:"Petroleum Geology",query:${JSON.stringify(alias)}})[0].name.en`),preferred);
 const answer=await run(`earthDictionaryAnswer(${JSON.stringify('Define '+alias)})`);assert.ok(answer?.text.startsWith(preferred),alias+' must resolve in Swingo');
}
run('dictionaryFilters.category="Petroleum Geology"');
for(const [alias,preferred,content] of [['Biomarker','Petroleum biomarker','molecular fossil'],['Compaction','Sediment compaction','sediment or rock'],['Total organic carbon','Source-rock total organic carbon','organic carbon content of a rock']]){
 const filtered=run(`filterDictionary(earthDictionary,{category:"Petroleum Geology",query:${JSON.stringify(alias)}})`);
 assert.equal(filtered[0].name.en,preferred,'Petroleum context must disambiguate '+alias);
 const answer=await run(`earthDictionaryAnswer(${JSON.stringify('Define '+alias)})`);assert.ok(answer?.text.toLowerCase().includes(content));
}
run('dictionaryFilters.category=""');
assert.ok(!readFileSync(new URL('../earth-dictionary.js',import.meta.url),'utf8').includes('id="dictionary-source"'),'The removed source dropdown must stay removed.');
console.log(`Dictionary checks passed: ${records.length.toLocaleString('en')} defined concepts, ${petroleum.length} petroleum concepts across 14 topics, preserved shared disciplines, unique entries, multilingual search, acronym retrieval, source links, on-demand data, and Swingo lookup.`);
