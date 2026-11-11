import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
import essentials from './dictionary-essentials.mjs';
import {petroleumEntries,petroleumTopics} from './dictionary-petroleum.mjs';
const root=new URL('../',import.meta.url);
const read=file=>readFileSync(new URL(file,root),'utf8');
const sandbox=vm.createContext({});
vm.runInContext(read('data.js')+'\n'+read('i18n.js')+'\nglobalThis.core=seedTerms;globalThis.messages=localeMessages;',sandbox);
const incoming=JSON.parse(read('assets/reference/earth-dictionary.json'));
const normalize=value=>String(value).normalize('NFKD').toLocaleLowerCase('en').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const records=new Map(incoming.records.map(row=>[normalize(row.name.en),row]));
const featured=[];
for(const [name,category,definition] of sandbox.core){
 const previous=records.get(normalize(name));const names=sandbox.messages.get(name);const definitions=sandbox.messages.get(definition);
 records.delete(normalize(name));
 featured.push({id:'core-'+normalize(name).replaceAll(' ','-'),name:{en:name,fr:names?.fr||name,ar:names?.ar||name},definition:{en:definition,fr:definitions?.fr||definition,ar:definitions?.ar||definition},category,source:'STC Geonara',url:'',aliases:previous?.aliases||[],featured:true});
}
for(const [name,category,fr,ar,enDefinition,frDefinition,arDefinition] of essentials){
 const canonical=normalize(name);if(featured.some(record=>normalize(record.name.en)===canonical))continue;
 records.set(canonical,{id:'essential-'+canonical.replaceAll(' ','-'),name:{en:name,fr,ar},definition:{en:enDefinition,fr:frDefinition,ar:arDefinition},category,source:'STC Geonara',url:'',aliases:name==='Mohorovicic discontinuity'?['Moho','Mohorovičić discontinuity','انقطاع موهو']:name==='Darcy’s law'?["Darcy's law",'Darcy law']:[]});
}
for(const entry of petroleumEntries){
 const canonical=normalize(entry.name.en);
 const previous=featured.find(record=>normalize(record.name.en)===canonical)||records.get(canonical);
 if(previous){
  previous.disciplines=[...new Set([previous.category,...previous.disciplines||[],'Petroleum Geology'])];
  previous.petroleumTopics=[...new Set([...previous.petroleumTopics||[],entry.topic])];
  previous.aliases=[...new Set([...previous.aliases,...entry.aliases])];
  for(const [language,name] of Object.entries(entry.name))if(!previous.name[language])previous.name[language]=name;
 }else records.set(canonical,{id:'petroleum-'+canonical.replaceAll(' ','-'),name:entry.name,definition:entry.definition,category:'Petroleum Geology',source:'STC Geonara',url:'',aliases:entry.aliases,petroleumTopics:[entry.topic]});
}
const concepts=[...featured,...[...records.values()].sort((a,b)=>normalize(a.name.en).localeCompare(normalize(b.name.en)))];
if(concepts.length<=1500)throw Error('The active dictionary must exceed 1500 defined concepts.');
const petroleumCount=concepts.filter(row=>row.category==='Petroleum Geology'||row.disciplines?.includes('Petroleum Geology')).length;
const meta={retrieved:'2026-11-08',count:concepts.length,categories:[...new Set(concepts.map(row=>row.category))].sort(),sources:[...new Set(concepts.map(row=>row.source))],petroleumCount,petroleumTopics};
writeFileSync(new URL('earth-dictionary-meta.js',root),`'use strict';\nconst earthDictionaryMeta=${JSON.stringify(meta)};\n`);
writeFileSync(new URL('earth-dictionary-data.js',root),`'use strict';\n// Source definitions and available translations: EEA GEMET (CC BY 4.0), USGS (public domain), NASA GCMD.\n// Core STC entries retained. Attribution and import details: docs/DICTIONARY.md.\nconst earthDictionary=${JSON.stringify(concepts)};\n`);
console.log(JSON.stringify({activeConcepts:concepts.length,disciplines:meta.categories.length,featured:featured.length,petroleumCount,petroleumTopics:petroleumTopics.length,sources:meta.sources}));
