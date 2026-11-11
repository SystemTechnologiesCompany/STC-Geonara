import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {memberRoute} from './member-api.mjs';
const alice='10000000-0000-4000-8000-000000000001',bob='10000000-0000-4000-8000-000000000002';
const user={id:alice},calls=[],queue=[];
const card={id:bob,publicId:'STC-A1B2C3',profile:{name:'Bob'},followers:0,following:0,notebookShared:false,isFollowing:false};
function result(kind,name,value){calls.push({kind,name,value});const next=queue.shift();assert.ok(next,'Unexpected database operation: '+kind+' '+name);assert.equal(next.kind,kind);assert.equal(next.name,name);return Promise.resolve({data:next.data,error:null});}
const db={rpc:(name,value)=>result('rpc',name,value),from:name=>{let kind='select',value;const filters=[];const query={select:()=>query,eq:(key,v)=>{filters.push([key,v]);return query;},update:v=>{kind='update';value=v;return query;},upsert:v=>{kind='upsert';value=v;return query;},delete:()=>{kind='delete';return query;},maybeSingle:()=>result(kind,name,{value,filters}),then:(resolve,reject)=>result(kind,name,{value,filters}).then(resolve,reject)};return query;}};
const add=(kind,name,data)=>queue.push({kind,name,data});
async function request(path,method='GET',body){let response;const req=Readable.from(body===undefined?[]:[Buffer.from(JSON.stringify(body))]);req.method=method;await memberRoute({req,url:new URL(path,'http://localhost'),db,user,send:(status,data)=>response={status,data},rate:()=>{}});return response;}
add('rpc','geonara_find_members',Array.from({length:21},()=>card));const search=await request('/api/members?q=Bob');assert.equal(search.data.members.length,20);assert.equal(search.data.hasMore,true);assert.equal(calls.at(-1).value.p_query,'Bob');
await assert.rejects(request('/api/members?relation=followers&owner=invalid'),{status:400});await assert.rejects(request('/api/members?offset=-1'),{status:400});
add('rpc','geonara_member_card',card);assert.equal((await request('/api/members/'+bob)).data.member.id,bob);
add('rpc','geonara_resolve_member',bob);add('rpc','geonara_member_card',card);assert.equal((await request('/api/members/stc-a1b2c3')).data.member.publicId,'STC-A1B2C3');
add('rpc','geonara_resolve_member',bob);add('rpc','geonara_find_members',[card]);await request('/api/members?relation=followers&owner=STC-A1B2C3');assert.equal(calls.at(-1).value.p_owner,bob);
add('rpc','geonara_member_card',null);await assert.rejects(request('/api/members/'+bob),{status:404});
add('rpc','geonara_member_card',card);add('upsert','geonara_follows',null);add('rpc','geonara_member_card',{...card,isFollowing:true,followers:1});assert.equal((await request('/api/members/'+bob+'/follow','PUT',{follower:bob})).data.member.isFollowing,true);assert.deepEqual(calls.at(-2).value.value,{follower:alice,followed:bob});
add('rpc','geonara_member_card',card);add('delete','geonara_follows',null);add('rpc','geonara_member_card',card);await request('/api/members/'+bob+'/follow','DELETE');assert.deepEqual(calls.at(-2).value.filters,[['follower',alice],['followed',bob]]);
add('rpc','geonara_member_card',{...card,id:alice});await assert.rejects(request('/api/members/'+alice+'/follow','PUT'),{status:400});
add('rpc','geonara_member_card',card);await assert.rejects(request('/api/members/'+bob+'/notebook'),{status:403});
const observation={id:'outcrop',title:'Field site',notes:'Notes',location:'Written location',date:'2026-11-10',lat:34,lng:2,photo:'javascript:alert(1)'};
add('upsert','geonara_notebooks',null);await request('/api/notebook','PUT',{shared:true,owner:bob,observations:[observation]});const saved=calls.at(-1).value.value;assert.equal(saved.owner,alice);assert.equal(saved.observations[0].photo,'');assert.ok(!('lat' in saved.observations[0]));assert.ok(!('lng' in saved.observations[0]));
add('update','geonara_notebooks',null);await request('/api/notebook','PUT',{shared:false,owner:bob});assert.deepEqual(calls.at(-1).value.filters,[['owner',alice]]);assert.deepEqual(calls.at(-1).value.value.observations,[]);
add('rpc','geonara_member_card',{...card,notebookShared:true});add('select','geonara_notebooks',{shared:true,observations:[observation,{deleted:true,title:'Deleted'}],updated_at:'now'});const notebook=await request('/api/members/'+bob+'/notebook');assert.equal(notebook.data.observations.length,1);assert.equal(notebook.data.observations[0].photo,'');
await assert.rejects(request('/api/notebook','PUT',{shared:'yes',observations:[]}),{status:400});await assert.rejects(request('/api/notebook','PUT',{shared:true,observations:Array(251).fill(observation)}),{status:400});assert.equal(queue.length,0);
// Render untrusted member content through the actual frontend templates in each language.
const context=vm.createContext({console,featurePages:{},googleAccount:{id:alice},featureSymbol:()=>'',profileAvatar:()=>'',icon:()=>'',escapeHTML:value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))});
for(const file of ['data.js','i18n.js','members.js'])vm.runInContext(await readFile(new URL('../'+file,import.meta.url),'utf8'),context);
for(const language of ['en','fr','ar']){
 vm.runInContext(`currentLanguage='${language}'`,context);
 context.card={...card,profile:{name:'<script>alert(1)</script>',about:'<img onerror=alert(1)>',interests:'<b>rock</b>'}};
 const html=vm.runInContext("memberCard(card,'')",context);assert.ok(!html.includes('<script>'));assert.ok(!html.includes('<img onerror'));assert.ok(html.includes('&lt;script&gt;'));
 for(const label of ['Find people','Follow','Unfollow','Followers','User ID','No members found.','Notebook sharing','Private notebook','Share notebook','This notebook is private.'])if(language!=='en')assert.notEqual(vm.runInContext(`t(${JSON.stringify(label)})`,context),label);
}
console.log('Member checks passed: name/ID search, pagination, ownership, follow/unfollow, private notebooks, coordinate removal, safe rendering and EN/FR/AR controls.');
