import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const read=file=>readFileSync(new URL(file,root),'utf8');
const write=(file,text)=>writeFileSync(new URL(file,root),text);
const ttl=read('docs/catalogue-sources/ics-chart.ttl');
const arabic={Precambrian:'ما قبل الكامبري',Hadean:'الدهر الجهنمي',Archean:'الدهر السحيق',Proterozoic:'دهر الطلائع',Phanerozoic:'دهر الحياة الظاهرة',Eoarchean:'السحيق المبكر',Paleoarchean:'السحيق القديم',Mesoarchean:'السحيق الأوسط',Neoarchean:'السحيق الحديث',Paleoproterozoic:'الطلائع القديمة',Mesoproterozoic:'الطلائع الوسطى',Neoproterozoic:'الطلائع الحديثة',Paleozoic:'الحياة القديمة',Mesozoic:'الحياة الوسطى',Cenozoic:'الحياة الحديثة',Cambrian:'الكامبري',Ordovician:'الأوردوفيشي',Silurian:'السيلوري',Devonian:'الديفوني',Carboniferous:'الكربوني',Mississippian:'المسيسيبي',Pennsylvanian:'البنسلفاني',Permian:'البرمي',Triassic:'الترياسي',Jurassic:'الجوراسي',Cretaceous:'الطباشيري',Paleogene:'الباليوجين',Neogene:'النيوجين',Quaternary:'الرباعي',Paleocene:'الباليوسين',Eocene:'الإيوسين',Oligocene:'الأوليغوسين',Miocene:'الميوسين',Pliocene:'البليوسين',Pleistocene:'البليستوسين',Holocene:'الهولوسين',Siderian:'السيديري',Rhyacian:'الرياسي',Orosirian:'الأوروسيري',Statherian:'الستاثيري',Calymmian:'الكاليمي',Ectasian:'الإكتاسي',Stenian:'الستيني',Tonian:'التوني',Cryogenian:'الكرايوجيني',Ediacaran:'الإدياكاري'};
const geologicalScale=[];
for(const match of ttl.matchAll(/^gtsd:([^\s]+)\n([\s\S]*?)\n\.\s*$/gm)){
 const block=match[2];const ranks=[...(block.match(/gts:rank\s+([^;]+);/)?.[1]||'').matchAll(/rank:([\w-]+)/g)].map(value=>value[1]);if(!ranks.length)continue;
 const rank=['Super-Eon','Eon','Era','Period','Sub-Period','Epoch','Age'].find(value=>ranks.includes(value));
 const labels=block.match(/skos:prefLabel\s*([\s\S]*?);/)?.[1]||'';
 const label=language=>labels.match(new RegExp('"([^"\\n]*)"@'+language+'(?:\\s|,)'))?.[1];
 const boundary=which=>{const text=block.match(new RegExp('time:has'+which+'\\s*\\[([\\s\\S]*?)\\]'))?.[1]||'';return {age:Number(text.match(/gtsd:inMYA\s+([\d.]+)/)?.[1]),error:Number(text.match(/schema:marginOfError\s+([\d.]+)/)?.[1]||0),approximate:text.includes('uncertain')};};
 const beginning=boundary('Beginning'),ending=boundary('End');
 if(!Number.isFinite(beginning.age)||!Number.isFinite(ending.age))throw Error('Missing boundary '+match[1]);
 const fallback=match[1].replace(/([a-z])([A-Z])/g,'$1 $2');
 geologicalScale.push({id:match[1],name:{en:label('en')||fallback,fr:label('fr')||label('en')||fallback,...(arabic[match[1]]?{ar:arabic[match[1]]}:{})},rank,ranks,parent:block.match(/skos:broader gtsd:([\w-]+)/)?.[1]||'',start:beginning.age,end:ending.age,startError:beginning.error,endError:ending.error,approximateStart:beginning.approximate,approximateEnd:ending.approximate,color:block.match(/schema:color "(#[A-Fa-f0-9]+)"/)?.[1]||'#93b397'});
}
const mineralPayload=JSON.parse(read('assets/reference/minerals.json'));
// Cross-check against the official 2026/06 PDF. The RDF has two boundary typos
// and omits the eleven ratified subseries/subepochs displayed in that chart.
const unit=id=>geologicalScale.find(row=>row.id===id);
unit('Ludlow').end=422.7;unit('Ludlow').endError=1.6;
unit('Aquitanian').start=23.04;
for(const row of geologicalScale){
 const match=row.id.match(/^(Lower|Middle|Upper)(.+)$/);if(!match)continue;
 const parent=unit(match[2]);if(!parent)continue;
 const en={Lower:'Early',Middle:'Middle',Upper:'Late'}[match[1]];
 const fr={Lower:'inférieur',Middle:'moyen',Upper:'supérieur'}[match[1]];
 const ar={Lower:'المبكر',Middle:'الأوسط',Upper:'المتأخر'}[match[1]];
 row.name={en:`${en} ${parent.name.en}${row.id==='UpperPleistocene'?' (unnamed age)':''}`,fr:`${parent.name.fr} ${fr}${row.id==='UpperPleistocene'?' (âge sans nom)':''}`,...(parent.name.ar?{ar:`${parent.name.ar} ${ar}`}:{})};
}
for(const [parentId,prefix,children] of [
 ['Holocene','Early',['Greenlandian']],['Holocene','Middle',['Northgrippian']],['Holocene','Late',['Meghalayan']],
 ['Pleistocene','Early',['Gelasian','Calabrian']],['Pleistocene','Middle',['Chibanian']],['Pleistocene','Late',['UpperPleistocene']],
 ['Pliocene','Early',['Zanclean']],['Pliocene','Late',['Piacenzian']],
 ['Miocene','Early',['Aquitanian','Burdigalian']],['Miocene','Middle',['Langhian','Serravallian']],['Miocene','Late',['Tortonian','Messinian']]
]){
 const parent=unit(parentId);const oldest=unit(children[0]),youngest=unit(children.at(-1));const id=`${prefix}${parentId}Subepoch`;
 geologicalScale.push({id,name:{en:`${prefix} ${parent.name.en}`,fr:`${parent.name.fr} ${{Early:'inférieur',Middle:'moyen',Late:'supérieur'}[prefix]}`,ar:`${parent.name.ar||parent.name.en} ${{Early:'المبكر',Middle:'الأوسط',Late:'المتأخر'}[prefix]}`},rank:'Sub-Epoch',ranks:['Sub-Epoch'],parent:parentId,start:oldest.start,end:youngest.end,startError:oldest.startError,endError:youngest.endError,approximateStart:oldest.approximateStart,approximateEnd:youngest.approximateEnd,color:parent.color});
 children.forEach(child=>{unit(child).parent=id;});
}
const rockPayload=JSON.parse(read('assets/reference/rocks.json'));
const id=(prefix,name)=>prefix+'-'+createHash('sha256').update(name).digest('hex').slice(0,14);
const officialMinerals=mineralPayload.records.map(row=>({...row,id:id('ima',row.name)}));
const officialRocks=rockPayload.records.map(row=>({...row,name:row.name.split(' - ')[0].trim(),id:id('bgs',row.code)}));
// Only nomenclature and factual codes are retained; source prose is not republished.
write('assets/reference/rocks.json',JSON.stringify({...rockPayload,records:officialRocks.map(({id,...row})=>row)}));
write('timescale-data.js',`'use strict';\n// ICS chart data, retrieved 2026-11-08. CC BY 4.0. See docs/REFERENCE_SOURCES.md.\nconst geologicalScale=${JSON.stringify(geologicalScale)};\n`);
write('catalogue-data.js',`'use strict';\n// Factual IMA-CNMNC and BGS reference data. See docs/REFERENCE_SOURCES.md for attribution and licences.\nconst officialMinerals=${JSON.stringify(officialMinerals)};\nconst officialRocks=${JSON.stringify(officialRocks)};\n`);
console.log(JSON.stringify({timeUnits:geologicalScale.length,ranks:Object.fromEntries([...new Set(geologicalScale.map(u=>u.rank))].map(rank=>[rank,geologicalScale.filter(u=>u.rank===rank).length])),mineralSpecies:officialMinerals.length,rockNames:officialRocks.length,currentRockNames:officialRocks.filter(r=>r.status==='C').length}));
