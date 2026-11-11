import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import http from 'node:http';
import {createApi} from './api.mjs';
const context=vm.createContext({});
for(const file of ['data.js','i18n.js','discovery-data.js','discovery-i18n.js','catalogue-data.js','timescale-data.js','discovery.js','reference.js'])vm.runInContext(await readFile(new URL('../'+file,import.meta.url),'utf8'),context);
vm.runInContext('globalThis.catalogue={specimens,geoIntervals};',context);
const {specimens,geoIntervals}=context.catalogue;
assert.equal(specimens.length,12);assert.equal(new Set(specimens.map(s=>s.id)).size,12);
assert.equal(geoIntervals.length,6);for(let i=1;i<6;i++)assert.equal(geoIntervals[i].start,geoIntervals[i-1].end);
for(const language of ['fr','ar']){
 vm.runInContext(`currentLanguage='${language}'`,context);
 for(const key of ['Rock & mineral explorer','Geological timeline','Field notebook','Community','Save observation','Compare','Reply','Attach image'])assert.notEqual(vm.runInContext(`t(${JSON.stringify(key)})`,context),key);
 for(const specimen of specimens)for(const field of ['name','texture','formation','clue'])assert.ok(specimen[field][language]);
}
vm.runInContext("currentLanguage='en'",context);
assert.match(vm.runInContext("localGeoAnswer('Compare granite and basalt').text",context),/Granite[\s\S]*Basalt/);
const observation={id:'test-note',title:'Sample',notes:'Field note',location:'Site',date:'2026-11-08',photo:'',specimenId:'quartz',lat:0,lng:0};
assert.ok(vm.runInContext(`validObservation(${JSON.stringify(observation)})`,context));
for(const changed of [{date:'2026-02-30'},{lat:91},{lng:181},{photo:'javascript:alert(1)'},{specimenId:'missing'},{lat:'',lng:2}])assert.equal(vm.runInContext(`validObservation(${JSON.stringify({...observation,...changed})})`,context),false);
const temp=await mkdtemp(path.join(tmpdir(),'geonara-check-'));const storePath=path.join(temp,'community.json');let captured;
const env={};const api=createApi({root:temp,storePath,env,authenticate:async req=>({id:req.headers.cookie||'visitor',profile:{name:'Test geologist',avatarId:'avatar-16'}}),fetchImpl:async(url,options)=>{captured={url,body:JSON.parse(options.body)};return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:'A verified test response.'}]}}]})};}});
const server=http.createServer(async(req,res)=>{await api(req,res,new URL(req.url,'http://localhost'));});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
const send=(url,body,cookie,method='POST')=>fetch(base+url,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
try{
 let response=await fetch(base+'/api/discussions');const cookie=response.headers.get('set-cookie').split(';')[0];assert.deepEqual((await response.json()).posts,[]);
 response=await send('/api/discussions',{title:'A field question',text:'What causes these layers?',author:'Test geologist',avatarId:'avatar-16'},cookie);assert.equal(response.status,201);const id=(await response.json()).id;
 response=await send('/api/discussions/'+id+'/replies',{text:'Observe the contacts.',author:'Second observer'},cookie);assert.equal(response.status,201);
 const other=await fetch(base+'/api/discussions');const otherCookie=other.headers.get('set-cookie').split(';')[0];const publicData=await other.json();assert.equal(publicData.posts[0].mine,false);assert.equal(publicData.posts[0].replies.length,1);assert.ok(!JSON.stringify(publicData).includes('owner'));
 assert.equal((await send('/api/discussions/'+id,null,otherCookie,'DELETE')).status,403);
 assert.equal((await fetch(base+'/api/discussions',{method:'POST',headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},body:'{}'})).status,403);
 const persisted=JSON.parse(await readFile(storePath,'utf8'));assert.equal(persisted.posts[0].title,'A field question');
 assert.equal((await send('/api/swingo',{question:'Quartz?'})).status,503);
 env.GEMINI_API_KEY='test-only-not-a-real-key';const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aW7sAAAAASUVORK5CYII=';response=await send('/api/swingo',{question:'Interpret this section',language:'fr',image,history:[{from:'me',text:'Earlier question'},{from:'bot',text:'Earlier answer'}]});assert.equal(response.status,200);assert.equal((await response.json()).answer,'A verified test response.');assert.equal(captured.url,'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent');assert.equal(captured.body.contents.at(-1).parts[0].inlineData.mimeType,'image/png');assert.match(captured.body.systemInstruction.parts[0].text,/French/);
 assert.equal((await send('/api/swingo',{question:'Test',image:'https://untrusted.example/a.png'})).status,400);
 assert.equal((await send('/api/discussions/'+id,null,cookie,'DELETE')).status,200);
 console.log('Discovery checks passed: catalogue, timelines, translations, notebook validation, persistent discussions, reply ownership, origin checks, and mocked live text/image AI. No real AI requests were made.');
}finally{await new Promise(resolve=>server.close(resolve));await rm(path.join(temp,'community.json'),{force:true});await rm(path.join(temp,'community.json.tmp'),{force:true});await rm(temp,{recursive:false,force:true}).catch(()=>{});}
