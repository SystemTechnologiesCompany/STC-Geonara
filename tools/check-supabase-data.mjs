import assert from 'node:assert/strict';
import http from 'node:http';
import {createSupabaseDataApi} from './supabase-data.mjs';
const user={id:'10000000-0000-4000-8000-000000000001',profile:{name:'Verified member',avatarId:'avatar-01'},isAdmin:false,supabaseAccessToken:'verified-user-jwt'};
const id='20000000-0000-4000-8000-000000000001',path=user.id+'/'+id,queue=[],calls=[];
function factory(_settings,token){assert.equal(token,user.supabaseAccessToken,'Database/storage must use the verified member JWT');
 const take=(kind,name,payload)=>{calls.push({kind,name,payload});const next=queue.shift();assert.ok(next,'Unexpected cloud call '+kind+':'+name);assert.equal(next.kind,kind);assert.equal(next.name,name);return Promise.resolve({data:next.data,error:next.error||null});};
 return {from:table=>{let operation='select',payload;const query={select:()=>query,eq:()=>query,is:()=>query,in:()=>query,order:()=>query,limit:()=>query,insert:value=>{operation='insert';payload=value;return query;},upsert:value=>{operation='upsert';payload=value;return query;},delete:()=>{operation='delete';return query;},maybeSingle:()=>take(operation,table,payload),then:(resolve,reject)=>take(operation,table,payload).then(resolve,reject)};return query;},rpc:(name,payload)=>take('rpc',name,payload),storage:{from:bucket=>({upload:(name,bytes,options)=>take('upload',bucket,{name,bytes,options}),remove:paths=>take('remove',bucket,paths),createSignedUrl:(name,expires)=>take('signed',bucket,{name,expires})})}};
}
const enqueue=(kind,name,data,error)=>queue.push({kind,name,data,error});
let upstream;
const api=createSupabaseDataApi({settings:{},authenticate:async req=>req.headers.cookie==='test=member'?user:null,clientFactory:factory,fetchImpl:async(url,options)=>{upstream={url,options};return new Response(Buffer.from('fragment'),{status:206,headers:{'content-range':'bytes 0-7/20','content-length':'8'}});}});
const server=http.createServer((req,res)=>api(req,res,new URL(req.url,'http://localhost')));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
async function request(route,{method='GET',data,raw,cookie='test=member',headers={}}={}){const response=await fetch(base+route,{method,headers:{Cookie:cookie,'Content-Type':raw?'application/octet-stream':'application/json',...headers},...(data?{body:JSON.stringify(data)}:raw?{body:raw}:{})});return {status:response.status,data:await response.json()};}
try{
 assert.equal((await request('/api/discussions',{cookie:''})).status,401);
 assert.equal((await request('/api/members',{cookie:''})).status,401);
 assert.equal((await request('/api/notebook',{cookie:''})).status,401);
 assert.equal((await request('/api/messages',{cookie:''})).status,401);
 const post={id,owner:user.id,title:'Field note',has_title:true,text:'Rock exposure',type:'Post',author:user.profile.name,avatar_id:'avatar-01',created_at:'2026-11-10T10:00:00Z',likes:[{owner:user.id}],media:[],comments:[]};enqueue('select','geonara_posts',post);
 enqueue('rpc','geonara_public_ids',{[user.id]:'STC-A1B2C3'});const detail=await request('/api/discussions/'+id);assert.equal(detail.data.post.authorPublicId,'STC-A1B2C3');assert.equal(detail.data.post.likeCount,1);assert.equal(detail.data.post.liked,true);assert.equal(detail.data.post.mine,true);assert.ok(!JSON.stringify(detail.data).includes('owner'));assert.ok(!JSON.stringify(detail.data).includes(user.supabaseAccessToken));
 enqueue('upsert','geonara_likes',null);enqueue('select','geonara_likes',[{owner:user.id}]);assert.equal((await request('/api/discussions/'+id+'/likes',{method:'POST',data:{liked:true}})).data.likeCount,1);
 enqueue('insert','geonara_comments',null);assert.equal((await request('/api/discussions/'+id+'/replies',{method:'POST',data:{text:'A comment',author:'Forged author'}})).status,201);assert.equal(calls.at(-1).payload.author,user.profile.name);assert.equal(calls.at(-1).payload.owner,user.id);
 enqueue('rpc','geonara_publish',id);assert.equal((await request('/api/discussions',{method:'POST',data:{text:'A new post',mediaIds:[]}})).status,201);assert.deepEqual(calls.at(-1).payload.p_media,[]);
 const image=Buffer.from([137,80,78,71,13,10,26,10,1]);enqueue('select','geonara_media',[]);enqueue('upload','geonara-community',{});enqueue('insert','geonara_media',null);const uploaded=await request('/api/community-media?name=test.png',{method:'POST',raw:image});assert.equal(uploaded.status,201);assert.equal(uploaded.data.kind,'image');assert.ok(calls.at(-1).payload.path.startsWith(user.id+'/'));assert.ok(!('path' in uploaded.data));
 enqueue('select','geonara_media',{id,owner:user.id,post_id:id,path,kind:'video',mime:'video/mp4',name:'clip.mp4',size:20});enqueue('signed','geonara-community',{signedUrl:'https://example.supabase.co/private-signed-url'});
 const streamed=await fetch(base+'/api/community-media/'+id,{headers:{Cookie:'test=member',Range:'bytes=0-7'}});assert.equal(streamed.status,206);assert.equal(streamed.headers.get('content-type'),'video/mp4');assert.equal(await streamed.text(),'fragment');assert.equal(upstream.options.headers.Range,'bytes=0-7');assert.ok(!JSON.stringify(calls.at(-1).payload).includes(user.supabaseAccessToken));
 assert.equal((await request('/api/research/review')).status,403);
 enqueue('select','geonara_research',[]);enqueue('insert','geonara_research',null);const submitted=await request('/api/research',{method:'POST',data:{title:'Study',authors:'Member',abstract:'A geological study.',topic:'Geology',year:2026,url:'https://example.com/paper',status:'approved'}});assert.equal(submitted.status,201);assert.equal(submitted.data.status,'pending');assert.equal(calls.at(-1).payload.owner,user.id);assert.ok(!('status' in calls.at(-1).payload),'Client-supplied approval must be ignored');
 enqueue('select','geonara_research',null,{code:'42501'});assert.equal((await request('/api/research')).status,403,'Cloud errors must not silently fall back to local data');
 assert.equal(queue.length,0);
 console.log('Supabase data adapter checks passed: verified JWT propagation, existing API shapes, owner/author enforcement, atomic publishing calls, media uploads, private signed-download proxying, video ranges, pending research, admin denial, and fail-closed cloud errors.');
}finally{await new Promise(resolve=>server.close(resolve));}
