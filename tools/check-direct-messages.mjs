import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createMessagesRoute} from './messages-api.mjs';
const alice='10000000-0000-4000-8000-000000000001',bob='10000000-0000-4000-8000-000000000002',nonce='60000000-0000-4000-8000-000000000001';
const route=createMessagesRoute(),queue=[],calls=[];
const add=(name,data,error)=>queue.push({name,data,error});
const db={rpc:async(name,params)=>{calls.push({name,params});const expected=queue.shift();assert.ok(expected,'Unexpected RPC '+name);assert.equal(name,expected.name);return {data:expected.data,error:expected.error};},from:table=>{assert.equal(table,'geonara_messages');const filters=[];const query={select:()=>query,eq:(key,value)=>{filters.push([key,value]);return query;},not:()=>query,order:()=>query,limit:async()=>{assert.deepEqual(filters,[['sender',alice],['recipient',bob]]);return {data:[{seq:4}]};}};return query;}};
async function request(path,method='GET',data){let output;const req=Readable.from(data===undefined?[]:[Buffer.from(JSON.stringify(data))]);req.method=method;await route({req,url:new URL(path,'http://localhost'),db,user:{id:alice},send:(status,body)=>output={status,body}});return output;}
add('geonara_message_unread',3);assert.equal((await request('/api/messages/unread')).body.unreadTotal,3);
add('geonara_message_inbox',{conversations:Array.from({length:21},()=>({member:{id:bob}})),unreadTotal:3});const inbox=await request('/api/messages');assert.equal(inbox.body.conversations.length,20);assert.equal(inbox.body.hasMore,true);
add('geonara_resolve_member',bob);add('geonara_send_message',{id:'5',text:'Hello',clientId:nonce,mine:true});assert.equal((await request('/api/messages/STC-ABC123','POST',{text:' Hello ',clientId:nonce,sender:bob,recipient:alice})).status,201);assert.deepEqual(calls.at(-1).params,{p_recipient:bob,p_text:'Hello',p_client_id:nonce});
add('geonara_member_card',{id:bob,publicId:'STC-ABC123'});add('geonara_message_thread',{messages:[],hasMore:false});const thread=await request('/api/messages/'+bob+'?after=3');assert.equal(thread.body.readThrough,'4');assert.equal(calls.at(-1).params.p_after,'3');
add('geonara_read_messages',null);add('geonara_message_unread',0);assert.equal((await request('/api/messages/'+bob+'/read','POST',{upto:'4'})).body.unreadTotal,0);
await assert.rejects(request('/api/messages/'+alice,'POST',{text:'Self',clientId:nonce}),{status:400});
for(const query of ['?before=-1','?after=9223372036854775808','?before=1&after=2'])await assert.rejects(request('/api/messages/'+bob+query),{status:400});
await assert.rejects(request('/api/messages/'+bob,'POST',{text:'x'.repeat(4001),clientId:nonce}),{status:400});await assert.rejects(request('/api/messages/'+bob,'POST',{text:'Hello',clientId:'invalid'}),{status:400});
add('geonara_send_message',null,{code:'P0001',message:'Message rate limit reached.'});await assert.rejects(request('/api/messages/'+bob,'POST',{text:'Hello',clientId:nonce}),{status:429});assert.equal(queue.length,0);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const context=vm.createContext({console,Intl,URLSearchParams,window:{addEventListener(){}},document:{addEventListener(){}},escapeHTML,icon:()=>'',intro:()=>''});for(const name of ['data.js','i18n.js','direct-messages.js'])vm.runInContext(await readFile(new URL('../'+name,import.meta.url),'utf8'),context);
context.rows=[{id:'9007199254740993',mine:true,text:'<script>bad</script>',createdAt:'2026-11-11T10:00:00Z',readAt:null}];context.incoming=[{...context.rows[0],text:'Updated'},{id:'9007199254740992',mine:false,text:'Earlier'}];const merged=vm.runInContext("mergeDirectMessages(rows,incoming,'9007199254740993')",context);assert.equal(merged.length,2);assert.equal(merged[0].id,'9007199254740992');assert.ok(merged[1].readAt);
const html=vm.runInContext("dmBubble(rows[0],rows[0].id)",context);assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));
for(const language of ['fr','ar']){vm.runInContext(`currentLanguage='${language}'`,context);assert.equal(vm.runInContext("t('Message')",context),language==='fr'?'Message':'مراسلة');for(const label of ['Seen','Choose a conversation','Earlier messages','Send message','Messages could not be loaded. Try again.'])assert.notEqual(vm.runInContext(`t(${JSON.stringify(label)})`,context),label);assert.ok(vm.runInContext('directMessagesPage()',context).includes('dm-conversations'));}
console.log('Direct message checks passed: inbox pagination, verified recipient/sender, idempotency nonce forwarding, read receipts, cursor/length validation, throttling, large-ID merging, escaping and EN/FR/AR interface.');
