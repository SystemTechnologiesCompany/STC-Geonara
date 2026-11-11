import assert from 'node:assert/strict';
import http from 'node:http';
import {createSupabaseAuth} from './supabase-auth.mjs';
import {netlifyAuthStore} from './netlify-auth-store.mjs';
const rows=new Map();let version=0;
const blobs={async get(key){return rows.get(key)?.data||null;},async getWithMetadata(key){const row=rows.get(key);return row?{...row}:null;},async set(key,data,options={}){if(options.onlyIfMatch&&rows.get(key)?.etag!==options.onlyIfMatch)return {modified:false};const etag=String(++version);rows.set(key,{data,etag});return {modified:true,etag};},async delete(key){rows.delete(key);}};
const store=netlifyAuthStore(blobs),identity={id:'10000000-0000-4000-8000-000000000001',email:'member@example.com',email_confirmed_at:'2026-11-01',app_metadata:{provider:'google'}};
const env={NODE_ENV:'production',SITE_URL:'https://stc-geonara.netlify.app',SUPABASE_SESSION_KEY:'b'.repeat(64)},settings={url:'https://example.supabase.co',key:'sb_publishable_mock'};
function factory(_settings,_token,options={}){return {auth:{async signInWithOAuth(input){assert.equal(input.options.redirectTo,env.SITE_URL+'/api/auth/callback');options.auth.storage.setItem('verifier','secret-verifier');return {data:{url:'https://example.supabase.co/auth/v1/authorize'}};},async exchangeCodeForSession(){assert.equal(options.auth.storage.getItem('verifier'),'secret-verifier');return {data:{user:identity,session:{access_token:'private-access',refresh_token:'private-refresh',expires_at:Math.floor(Date.now()/1000)+3600}}};},async getUser(){return {data:{user:identity}};},async setSession(){},async signOut(){}},from:()=>({select(){return this;},eq(){return this;},async maybeSingle(){return {data:{profile:{name:'Member',avatarId:'avatar-01'},saved:[]}};}}),async rpc(){return {data:false};}};}
const instance=()=>createSupabaseAuth({settings,env,dataRoot:'/unused-read-only-filesystem',authStore:store,clientFactory:factory});let active=instance();
const server=http.createServer((req,res)=>active.handle(req,res,new URL(req.url,'http://localhost')));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
async function request(route,method='GET',cookie,origin=env.SITE_URL){const response=await fetch(base+route,{method,redirect:'manual',headers:{Host:'internal.proxy',Origin:origin,...(cookie?{Cookie:cookie}:{})}});const text=await response.text();return {status:response.status,data:text?JSON.parse(text):null,cookie:response.headers.get('set-cookie')?.split(';')[0],header:response.headers.get('set-cookie'),location:response.headers.get('location')};}
try{
 assert.equal((await request('/api/auth/start','POST',null,'https://attacker.example')).status,403);
 const start=await request('/api/auth/start','POST');assert.equal(start.status,200);assert.match(start.header,/Secure/);assert.ok(!JSON.stringify([...rows]).includes('secret-verifier'));
 active=instance();const callback=await request('/api/auth/callback?code=one','GET',start.cookie);assert.equal(callback.location,env.SITE_URL+'/#login');assert.match(callback.header,/HttpOnly; SameSite=Strict/);assert.match(callback.header,/Secure/);
 active=instance();assert.equal((await request('/api/auth/session','GET',callback.cookie)).data.user.id,identity.id);assert.ok(!JSON.stringify([...rows]).includes('private-access'));assert.equal((await request('/api/auth/callback?code=one','GET',start.cookie)).location,'/#login?auth=failed');
 await request('/api/auth/logout','POST',callback.cookie);active=instance();assert.equal((await request('/api/auth/session','GET',callback.cookie)).data.user,null);
 await store.set('race','old');const results=await Promise.all([store.take('race'),store.take('race')]);assert.equal(results.filter(Boolean).length,1);
 await store.set('session-race','old');await store.delete('session-race');assert.equal(await store.replace('session-race','old','new'),false,'A refresh cannot recreate a logged-out session');
 console.log('Durable auth checks passed: encrypted PKCE across cold starts, secure HTTPS callbacks through proxy hosts, cross-instance sessions/logout, atomic single-use flows and no session resurrection.');
}finally{await new Promise(resolve=>server.close(resolve));}
