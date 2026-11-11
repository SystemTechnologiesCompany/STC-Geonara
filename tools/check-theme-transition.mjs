import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../theme-transition.js',import.meta.url),'utf8');
function setup({supported=true,reduced=false,fail=false}={}){
 const calls=[],attributes=new Map(),classes=new Set();let updates=0;
 const properties=new Map();
 const root={dataset:{},style:{setProperty:(key,value)=>properties.set(key,value),removeProperty:key=>properties.delete(key)},classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}};
 const button={getBoundingClientRect:()=>({left:320,top:20,width:36,height:36}),setAttribute:(key,value)=>attributes.set(key,value),removeAttribute:key=>attributes.delete(key)};
 const document={documentElement:root};
 if(supported)document.startViewTransition=update=>{calls.push({direction:root.dataset.themeReveal,x:properties.get('--theme-reveal-x'),y:properties.get('--theme-reveal-y'),radius:properties.get('--theme-reveal-radius')});update();return {ready:fail?Promise.reject(Error('Transition skipped')):Promise.resolve(),finished:Promise.resolve(),skipTransition:()=>calls.push('skipped')};};
 const context=vm.createContext({document,matchMedia:()=>({matches:reduced}),innerWidth:390,innerHeight:844});
 vm.runInContext(source+';this.reveal=themeReveal;',context);
 return {reveal:context.reveal,button,root,calls,attributes,classes,properties,apply:()=>updates++,get updates(){return updates;}};
}
for(const theme of ['dark','light']){
 const state=setup();const operation=state.reveal.toggle(state.button,theme,state.apply);
 await state.reveal.toggle(state.button,theme,state.apply); // Fast repeated taps must not overlap snapshots.
 await operation;
 assert.equal(state.updates,1);assert.equal(state.calls.length,1);
 const frame=state.calls[0];
 assert.equal(frame.direction,theme==='dark'?'expand':'contract');
 assert.equal(frame.x,'338px');assert.equal(frame.y,'38px');assert.ok(parseInt(frame.radius)>800);
 assert.equal(state.attributes.size,0);assert.equal(state.classes.size,0);assert.equal(state.properties.size,0);assert.equal(state.reveal.busy,false);
 assert.equal(state.root.dataset.themeReveal,undefined);
}
for(const options of [{supported:false},{reduced:true},{fail:true}]){
 const state=setup(options);await state.reveal.toggle(state.button,'dark',state.apply);
 assert.equal(state.updates,1);assert.equal(state.reveal.busy,false);assert.equal(state.classes.size,0);
 if(!options.fail)assert.equal(state.calls.length,0,'Fallback should switch immediately without circular motion.');
}
const css=readFileSync(new URL('../palette.css',import.meta.url),'utf8');
assert.ok(css.includes('::view-transition-new(root){z-index:2;animation:theme-dark-expand'));
assert.ok(css.includes('::view-transition-old(root){z-index:2;animation:theme-dark-contract'));
for(const [width,height,left,top] of [[390,844,5,20],[1440,900,1170,32],[320,568,250,14]]){
 const {reveal}=setup();const {x,y,radius}=reveal.geometry({left,top,width:32,height:32},width,height);
 for(const [cx,cy] of [[0,0],[width,0],[0,height],[width,height]])assert.ok(radius>Math.hypot(cx-x,cy-y),'Reveal must cover every viewport corner.');
}
console.log('Theme transition checks passed: switch-centered reveal, reverse collection, viewport coverage, repeated-tap guard, reduced-motion and unsupported-browser fallbacks, skipped-transition recovery, and cleanup.');
