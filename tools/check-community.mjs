import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {createCommunityApi} from './community-api.mjs';
const root=await mkdtemp(path.join(os.tmpdir(),'geonara-community-'));let api=createCommunityApi({root,authenticate:async req=>({id:req.headers.cookie||'visitor',profile:{name:'Test geologist',avatarId:'avatar-16'}})});
const server=http.createServer((req,res)=>api(req,res,new URL(req.url,'http://localhost')));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
async function request(url,{cookie,method='GET',data,raw,headers={}}={}){const response=await fetch(base+url,{method,headers:{...(cookie?{Cookie:cookie}:{}),'Content-Type':raw?'application/octet-stream':'application/json',...headers},...(raw?{body:raw}:data?{body:JSON.stringify(data)}:{})});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};}
try{
 const member=(await request('/api/discussions')).cookie,other=(await request('/api/discussions')).cookie;
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jPRkAAAAASUVORK5CYII=','base64');
 const uploaded=await request('/api/community-media?name=field.png',{cookie:member,method:'POST',raw:png});assert.equal(uploaded.status,201);const media=uploaded.data;
 assert.equal((await fetch(base+media.url,{headers:{Cookie:other}})).status,404,'Unpublished media must remain private');assert.equal((await fetch(base+media.url,{headers:{Cookie:member}})).status,200);
 assert.equal((await request('/api/discussions',{method:'POST',cookie:other,data:{text:'Cannot reuse another member upload',mediaIds:[media.id]}})).status,403);
 const created=await request('/api/discussions',{method:'POST',cookie:member,data:{title:'Field photograph',text:'A photographed rock outcrop.',type:'Discovery',mediaIds:[media.id],likes:['forged']}});assert.equal(created.status,201);const id=created.data.id;
 assert.equal((await fetch(base+media.url)).status,200);const exact=await fetch(base+media.url);assert.deepEqual(Buffer.from(await exact.arrayBuffer()),png);
 let post=(await request('/api/discussions/'+id,{cookie:member})).data.post;assert.equal(post.media.length,1);assert.equal(post.likeCount,0);assert.equal(post.mine,true);assert.ok(!JSON.stringify(post).includes('owner'));
 for(let i=0;i<2;i++){const like=await request('/api/discussions/'+id+'/likes',{method:'POST',cookie:member,data:{liked:true}});assert.equal(like.status,200);assert.equal(like.data.likeCount,1);}
 assert.equal((await request('/api/discussions/'+id+'/likes',{method:'POST',cookie:other,data:{liked:true}})).data.likeCount,2);
 assert.equal((await request('/api/discussions/'+id+'/likes',{method:'POST',cookie:member,data:{liked:false}})).data.likeCount,1);
 assert.equal((await request('/api/discussions/'+id+'/likes',{method:'POST',cookie:member,data:{}})).status,400);
 assert.equal((await request('/api/discussions/'+id+'/replies',{method:'POST',cookie:other,data:{text:'What is the grain size?',author:'Field observer'}})).status,201);
 api=createCommunityApi({root,authenticate:async req=>({id:req.headers.cookie||'visitor',profile:{name:'Test geologist',avatarId:'avatar-16'}})});post=(await request('/api/discussions/'+id,{cookie:other})).data.post;assert.equal(post.likeCount,1);assert.equal(post.liked,true);assert.equal(post.replies.length,1);assert.equal(post.replies[0].text,'What is the grain size?');
 assert.equal((await request('/api/community-media/'+media.id,{method:'DELETE',cookie:member})).status,409);
 assert.equal((await request('/api/discussions/'+id,{method:'DELETE',cookie:other})).status,403);
 assert.equal((await request('/api/community-media',{method:'POST',cookie:member,raw:Buffer.from('<svg onload="alert(1)">')})).status,400);
 assert.equal((await request('/api/discussions',{method:'POST',cookie:member,data:{text:'Duplicate attachment',mediaIds:[media.id,media.id]}})).status,400);
 const video=Buffer.concat([Buffer.from([0,0,0,24]),Buffer.from('ftypisom'),Buffer.alloc(48)]);const clip=await request('/api/community-media?name=clip.mp4',{method:'POST',cookie:member,raw:video});assert.equal(clip.status,201);assert.equal(clip.data.kind,'video');
 const photo2=await request('/api/community-media?name=second.png',{method:'POST',cookie:member,raw:png});assert.equal(photo2.status,201);
 assert.equal((await request('/api/discussions',{method:'POST',cookie:member,data:{text:'Mixed media is not supported',mediaIds:[clip.data.id,photo2.data.id]}})).status,400);
 const videoPost=await request('/api/discussions',{method:'POST',cookie:member,data:{mediaIds:[clip.data.id]}});assert.equal(videoPost.status,201);
 const range=await fetch(base+clip.data.url,{headers:{Range:'bytes=4-11'}});assert.equal(range.status,206);assert.equal(range.headers.get('content-type'),'video/mp4');assert.equal(range.headers.get('content-range'),`bytes 4-11/${video.length}`);assert.deepEqual(Buffer.from(await range.arrayBuffer()),video.subarray(4,12));
 assert.equal((await fetch(base+clip.data.url,{headers:{Range:'bytes=999999-'}})).status,416);assert.equal((await fetch(base+clip.data.url,{method:'HEAD'})).headers.get('content-length'),String(video.length));
 assert.equal((await request('/api/community-media/'+photo2.data.id,{method:'DELETE',cookie:other})).status,403);assert.equal((await request('/api/community-media/'+photo2.data.id,{method:'DELETE',cookie:member})).status,200);
 assert.equal((await request('/api/community-media',{method:'POST',cookie:member,raw:png,headers:{Origin:'https://untrusted.example'}})).status,403);
 assert.equal((await request('/api/discussions/'+id,{method:'DELETE',cookie:member})).status,200);assert.equal((await fetch(base+media.url)).status,404);
 const context=vm.createContext({URL,URLSearchParams});for(const file of ['data.js','i18n.js','discovery-i18n.js','community.js'])vm.runInContext(await readFile(new URL('../'+file,import.meta.url),'utf8'),context);
 for(const language of ['fr','ar']){vm.runInContext(`currentLanguage='${language}'`,context);for(const key of ['New post','Comments','Like','Unlike','Share','Uploading media…'])assert.notEqual(vm.runInContext(`t(${JSON.stringify(key)})`,context),key);}
 console.log('Community checks passed: private photo/video staging, publishing, ID-only attachments, ownership, persistent comments, idempotent heart likes, shareable post lookup, video byte ranges, invalid file rejection, media cleanup, origin checks, and translations.');
}finally{await new Promise(resolve=>server.close(resolve));const resolved=path.resolve(root);assert.ok(resolved.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(resolved).startsWith('geonara-community-'));await rm(resolved,{recursive:true,force:true});}
