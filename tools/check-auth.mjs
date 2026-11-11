import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createApi} from './api.mjs';
const root=await mkdtemp(path.join(os.tmpdir(),'geonara-auth-')),clientId='test-client.apps.googleusercontent.com',claims=new Map();
const env={GOOGLE_CLIENT_ID:clientId,GOOGLE_ADMIN_EMAILS:'admin@example.com'};
const create=()=>createApi({root,env,verifyGoogle:async credential=>{if(!claims.has(credential))throw Error();return claims.get(credential);}});let api=create();
const server=http.createServer((req,res)=>api(req,res,new URL(req.url,'http://localhost')));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
async function request(url,{cookie,method='GET',data,origin}={}){const response=await fetch(base+url,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(origin?{Origin:origin}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0],fullCookie:response.headers.get('set-cookie')};}
async function login(sub,email='member@example.com',overrides={}){const challenge=await request('/api/auth/session');const token=Math.random().toString();claims.set(token,{sub,email,name:'Google member',iss:'https://accounts.google.com',aud:clientId,exp:Math.floor(Date.now()/1000)+3600,email_verified:true,nonce:challenge.data.nonce,...overrides});const result=await request('/api/auth/google',{method:'POST',cookie:challenge.cookie,data:{credential:token}});return {...result,credential:token,challenge};}
try{
 assert.equal((await request('/api/discussions',{method:'POST',data:{text:'Guest'}})).status,401);
 assert.equal((await request('/api/research/mine')).status,401);
 for(const url of ['/api/discussions','/api/research','/api/status','/api/community-media/00000000-0000-0000-0000-000000000000','/api/research/00000000-0000-0000-0000-000000000000/pdf'])assert.equal((await request(url)).status,401,'Guests must not read '+url);
 for(const overrides of [{aud:'wrong'},{iss:'wrong'},{exp:1},{email_verified:false},{nonce:'a'.repeat(64)}])assert.equal((await login('bad','bad@example.com',overrides)).status,401);
 const signed=await login('alice');assert.equal(signed.status,200);assert.match(signed.fullCookie,/HttpOnly; SameSite=Strict/);assert.ok(!JSON.stringify(signed.data).includes('googleSub'));const user=signed.data.user;
 assert.equal((await request('/api/auth/google',{method:'POST',cookie:signed.challenge.cookie,data:{credential:signed.credential}})).status,403,'A challenge cannot be replayed');
 assert.equal((await request('/api/auth/profile',{method:'PATCH',cookie:signed.cookie,data:{profile:{...user.profile,name:'Alice'},saved:['Research A']}})).status,200);
 const post=await request('/api/discussions',{method:'POST',cookie:signed.cookie,data:{text:'An authenticated observation.',author:'Forged author',avatarId:'avatar-99'}});assert.equal(post.status,201);
 const secondDevice=await login('alice');assert.equal(secondDevice.data.user.id,user.id);assert.equal(secondDevice.data.user.profile.name,'Alice');assert.deepEqual(secondDevice.data.user.saved,['Research A']);
 const publicPost=(await request('/api/discussions/'+post.data.id,{cookie:secondDevice.cookie})).data.post;assert.equal(publicPost.mine,true);assert.equal(publicPost.author,'Alice');
 for(const cookie of [signed.cookie,secondDevice.cookie])assert.equal((await request('/api/discussions/'+post.data.id+'/likes',{method:'POST',cookie,data:{liked:true}})).data.likeCount,1,'A Google account contributes one heart across devices');
 const bob=await login('bob','bob@example.com');assert.equal((await request('/api/discussions/'+post.data.id,{method:'DELETE',cookie:bob.cookie})).status,403);
 assert.equal((await request('/api/research/review',{cookie:bob.cookie})).status,403);const admin=await login('admin','admin@example.com');assert.equal(admin.data.user.isAdmin,true);assert.equal((await request('/api/research/review',{cookie:admin.cookie})).status,200);
 assert.equal((await request('/api/research/session',{method:'POST',cookie:admin.cookie,data:{key:'old-admin-key'}})).status,405,'Google is the only login method');
 assert.equal((await request('/api/auth/logout',{method:'POST',cookie:signed.cookie,origin:'https://untrusted.example'})).status,403);
 api=create();assert.equal((await request('/api/auth/session',{cookie:secondDevice.cookie})).data.user.id,user.id,'Sessions persist over restart');
 assert.equal((await request('/api/auth/logout',{method:'POST',cookie:secondDevice.cookie})).status,200);assert.equal((await request('/api/auth/session',{cookie:secondDevice.cookie})).data.user,null);
 const store=await readFile(path.join(root,'.data/accounts.json'),'utf8');assert.ok(!store.includes(signed.cookie.split('=')[1]));assert.ok(!store.includes(signed.credential));
 console.log('Google auth checks passed: issuer/audience/expiry/email/nonce validation, replay protection, HttpOnly sessions, restart persistence, sign-out, account-owned posts/likes, profile sync across devices, forged-author rejection, admin allowlist, Google-only login, origin checks, and guest write rejection.');
}finally{await new Promise(resolve=>server.close(resolve));const target=path.resolve(root);assert.ok(target.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(target).startsWith('geonara-auth-'));await rm(target,{recursive:true,force:true});}
