import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(new URL('../data.js',import.meta.url),'utf8')+';globalThis.data={seedTerms,contacts,aiAnswer};',context);
const {seedTerms,contacts,aiAnswer}=context.data;
assert.equal(seedTerms.length,15);assert.equal(contacts.length,0);

assert.match(aiAnswer('porosity'),/voids/);assert.match(aiAnswer('stratigraphy'),/superposition/);
assert.match(aiAnswer('something unknown'),/^Try a question about porosity/);
for(const f of ['index.html','styles.css','app.js','data.js','i18n.js','assets/mark.svg','assets/terrain.svg','assets/terrain-waves.svg'])assert.ok(fs.statSync(new URL('../'+f,import.meta.url)).size>0);
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const ref of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(ref=>!/^https?:\/\//i.test(ref)))assert.ok(fs.existsSync(new URL('../'+ref,import.meta.url)),`Missing ${ref}`);
assert.ok(!/tailwindcss|font-awesome|type="password"/.test(html));
const patternCSS=fs.readFileSync(new URL('../patterns.css',import.meta.url),'utf8');
const embeddedPatterns=fs.readFileSync(new URL('../pattern-assets.css',import.meta.url),'utf8');
assert.ok(html.indexOf('pattern-assets.css')<html.indexOf('patterns.css'),'Embedded masks must load before pattern styles.');
assert.ok(!/url\(['"]?assets\/patterns\/[^)]+\.svg/.test(patternCSS),'Direct-file pages must not depend on external SVG masks.');
for(const name of ['contour-field','sandstone','shale','limestone','basement','mineral-facets','folded-beds','field-compass','connection-tree']){
 const encoded=embeddedPatterns.match(new RegExp('--pattern-'+name+':url\\("data:image/svg\\+xml,([^"\\n]+)"\\)'))?.[1];
 assert.ok(encoded,'Missing embedded pattern: '+name);
 assert.equal(decodeURIComponent(encoded),fs.readFileSync(new URL('../assets/patterns/'+name+'.svg',import.meta.url),'utf8'),'Embedded patterns must match their vector originals.');
 assert.ok(patternCSS.includes('var(--pattern-'+name+')'));
}
vm.runInContext(fs.readFileSync(new URL('../i18n.js',import.meta.url),'utf8'),context);
for(const language of ['fr','ar']){
 vm.runInContext(`currentLanguage='${language}'`,context);
 for(const text of [...seedTerms.flatMap(term=>[term[0],term[2]]),...['Language','Dark mode','Overview','Save profile','Clear filters'],...['porosity','stratigraphy','facies','diagenesis','weathering','unknown'].map(aiAnswer)]){
  assert.notEqual(vm.runInContext(`t(${JSON.stringify(text)})`,context),text,`${language}: missing translation for ${text}`);
 }
}
assert.equal(aiAnswer('ما الفرق بين المسامية والنفاذية؟'),aiAnswer('porosity'));
assert.equal(aiAnswer('Expliquez la stratigraphie.'),aiAnswer('stratigraphy'));
vm.runInContext(fs.readFileSync(new URL('../terrain.js',import.meta.url),'utf8')+';globalThis.meshMath=terrainMath;',context);
const mesh=context.meshMath;const point=mesh.point(60,-24);
assert.ok(Math.abs(mesh.ambient(point,0)-mesh.ambient(point,12))<1e-9,'Ambient wave must remain seamless.');
assert.equal(Math.abs(mesh.pointerWave(0,1,0)),0,'Pointer deformation must disappear after leaving.');
assert.ok(Math.abs(mesh.pointerWave(0,0,1))>Math.abs(mesh.pointerWave(300,0,1)),'Wave must stay local to the pointer.');
assert.ok(mesh.pointerWave(0,0,1,true)>mesh.pointerWave(0,0,1,false),'Dragging must strengthen the wave.');
assert.equal(mesh.ripple(50,3),0,'Pointer trails must settle.');
for(let x=-250;x<=250;x+=25)for(let y=-240;y<=240;y+=24){const p=mesh.point(x,y);assert.ok(Number.isFinite(p.y-mesh.ambient(p,7)-mesh.pointerWave(50,7,1)));}
console.log('Checks passed: assets, catalogue integrity, French/Arabic translation coverage, multilingual assistant topics, and HTML dependencies.');
