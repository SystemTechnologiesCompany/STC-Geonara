import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {createSupabaseAuth} from './supabase-auth.mjs';
import {supabaseSettings} from './supabase-client.mjs';
const root=await mkdtemp(path.join(os.tmpdir(),'geonara-supabase-')),settings={url:'https://example.supabase.co',key:'sb_publishable_test_key_long_enough'};
const id='10000000-0000-4000-8000-000000000001',profiles=new Map();let revoked=false,refreshCount=0;
const identity={id,email:'member@example.com',email_confirmed_at:new Date().toISOString(),app_metadata:{provider:'google'},user_metadata:{full_name:'Cloud member'}};
function factory(_settings,token,options={}){let active;return {
 auth:{signInWithOAuth:async input=>{assert.equal(input.provider,'google');assert.equal(options.auth.flowType,'pkce');options.auth.storage.setItem('pkce','private-verifier');return {data:{url:settings.url+'/auth/v1/authorize?provider=google'},error:null};},exchangeCodeForSession:async code=>{assert.equal(options.auth.storage.getItem('pkce'),'private-verifier');return {data:{user:code==='email'?{...identity,app_metadata:{provider:'email'}}:identity,session:{access_token:'access-token-private',refresh_token:'refresh-token-private',expires_at:code==='expired'?1:Math.floor(Date.now()/1000)+3600,provider_token:'unneeded-google-token'}},error:null};},getUser:async access=>({data:{user:access&&!revoked?identity:null},error:null}),refreshSession:async()=>{refreshCount++;return {data:{session:{access_token:'refreshed-access-private',refresh_token:'refreshed-refresh-private',expires_at:Math.floor(Date.now()/1000)+3600}},error:null};},setSession:async session=>{active=session;return {error:null};},signOut:async()=>{assert.ok(active);revoked=true;return {error:null};}},
 from:table=>{assert.equal(table,'geonara_profiles');let selected;const query={select:()=>query,eq:(_key,value)=>{selected=value;return query;},maybeSingle:async()=>({data:profiles.get(selected)||null,error:null}),single:async()=>({data:profiles.get(selected),error:null}),upsert:async row=>{if(!profiles.has(row.id))profiles.set(row.id,{profile:row.profile,saved:row.saved});return {data:null,error:null};},update:row=>({eq:async(_key,value)=>{profiles.set(value,row);return {data:null,error:null};}})};return query;},rpc:async name=>{assert.ok(token);assert.equal(name,'geonara_admin');return {data:false,error:null};}
 };}
let auth=createSupabaseAuth({settings,env:{},dataRoot:root,clientFactory:factory});const server=http.createServer(async(req,res)=>{await auth.handle(req,res,new URL(req.url,'http://localhost'));});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
async function request(route,{method='GET',cookie,data,origin}={}){const response=await fetch(base+route,{method,redirect:'manual',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(origin?{Origin:origin}:{})},...(data?{body:JSON.stringify(data)}:{})});const body=await response.text();return {status:response.status,data:body?JSON.parse(body):null,cookie:response.headers.get('set-cookie')?.split(';')[0],header:response.headers.get('set-cookie'),location:response.headers.get('location')};}
try{
 assert.equal(supabaseSettings({}),null);assert.throws(()=>supabaseSettings({SUPABASE_URL:settings.url,SUPABASE_PUBLISHABLE_KEY:'sb_secret_never_accept_this'}));
 const config=await request('/api/auth/session');assert.equal(config.data.provider,'supabase');assert.equal(config.data.user,null);
 assert.equal((await request('/api/auth/start',{method:'POST',origin:'https://untrusted.example'})).status,403);
 let start=await request('/api/auth/start',{method:'POST'});assert.equal(start.status,200);assert.match(start.header,/HttpOnly; SameSite=Lax/);
 let callback=await request('/api/auth/callback?code=google',{cookie:start.cookie});assert.equal(callback.status,302);assert.match(callback.header,/HttpOnly; SameSite=Strict; Path=\//);const session=callback.cookie;
 assert.equal((await request('/api/auth/callback?code=google',{cookie:start.cookie})).location,'/#login?auth=failed','An OAuth flow must be single use');
 let account=await request('/api/auth/session',{cookie:session});assert.equal(account.data.user.id,id);assert.equal(account.data.user.profile.name,'Cloud member');assert.ok(!JSON.stringify(account.data).includes('access-token'));
 const persisted=await readFile(path.join(root,'supabase-sessions.json'),'utf8');for(const secret of ['access-token-private','refresh-token-private','unneeded-google-token',session.split('=')[1]])assert.ok(!persisted.includes(secret),'Session material must not be stored in plaintext');
 auth=createSupabaseAuth({settings,env:{},dataRoot:root,clientFactory:factory});assert.equal((await request('/api/auth/session',{cookie:session})).data.user.id,id,'Encrypted sessions must survive server restarts');
 const profile={...account.data.user.profile,name:'Updated cloud profile'};assert.equal((await request('/api/auth/profile',{method:'PATCH',cookie:session,data:{profile,saved:['Paper A']}})).data.user.profile.name,'Updated cloud profile');
 start=await request('/api/auth/start',{method:'POST'});assert.equal((await request('/api/auth/callback?code=email',{cookie:start.cookie})).location,'/#login?auth=failed','Other identity providers must be rejected');
 start=await request('/api/auth/start',{method:'POST'});callback=await request('/api/auth/callback?code=expired',{cookie:start.cookie});account=await request('/api/auth/session',{cookie:callback.cookie});assert.equal(account.data.user.id,id);assert.equal(refreshCount,1);
 assert.equal((await request('/api/auth/logout',{method:'POST',cookie:callback.cookie})).status,200);assert.equal((await request('/api/auth/session',{cookie:callback.cookie})).data.user,null);
 console.log('Supabase auth checks passed: Google-only PKCE, single-use flows, origin checks, encrypted HttpOnly sessions, restart persistence, token refresh, profile sync, logout, and secret/service-role key rejection.');
}finally{await new Promise(resolve=>server.close(resolve));const target=path.resolve(root);assert.ok(target.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(target).startsWith('geonara-supabase-'));await rm(target,{recursive:true,force:true});}
