import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import vm from 'node:vm';
import os from 'node:os';
import path from 'node:path';
import {createResearchApi} from './research-api.mjs';
import researchTopics from '../research-topics.js';
const dictionary=vm.runInNewContext((await readFile(new URL('../earth-dictionary-meta.js',import.meta.url),'utf8'))+';earthDictionaryMeta.categories');
assert.deepEqual([...researchTopics],[...dictionary],'Research must offer every dictionary field.');
const root=await mkdtemp(path.join(os.tmpdir(),'geonara-research-'));
const key='test-only-research-admin-key-123456789';
const api=createResearchApi({root,authenticate:async req=>({id:req.headers.cookie||'other',isAdmin:req.headers.cookie==='test=admin',profile:{name:'Test geologist',avatarId:'avatar-01'}})});
const server=http.createServer((req,res)=>api(req,res,new URL(req.url,'http://localhost')));
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
async function request(route,{method='GET',cookie='',data,origin}={}){const response=await fetch(base+route,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(origin?{Origin:origin}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};}
try{
 const submission={title:'Test research <script>alert(1)</script>',authors:'Research team',abstract:'A substantive test abstract about sedimentary processes.',topic:'Sedimentology',year:2024,url:'https://example.org/research.pdf',status:'approved',owner:'attacker'};
 const submitted=await request('/api/research',{method:'POST',cookie:'test=member',data:submission});assert.equal(submitted.status,201);assert.equal(submitted.data.status,'pending');const member='test=member',id=submitted.data.id;
 assert.equal((await request('/api/research')).data.records.length,0,'Pending research must not be public');
 assert.equal((await request('/api/research/mine')).data.records.length,0,'Another browser cannot see submissions');
 const mine=(await request('/api/research/mine',{cookie:member})).data.records;assert.equal(mine.length,1);assert.equal(mine[0].status,'pending');assert.ok(!('owner' in mine[0]));
 assert.equal((await request('/api/research/review',{cookie:member})).status,403);
 assert.equal((await request('/api/research/review',{method:'POST',cookie:member,data:{id,status:'approved',note:''}})).status,403);
 assert.equal((await request('/api/research/session',{method:'POST',data:{key:'wrong'}})).status,405);
 assert.equal((await request('/api/research',{method:'POST',origin:'https://unrelated.example',data:submission})).status,403);
 for(const url of ['javascript:alert(1)','http://example.org/file.pdf','https://user:password@example.org'])assert.equal((await request('/api/research',{method:'POST',cookie:member,data:{...submission,url}})).status,400);
 const admin='test=admin';
 const review=(await request('/api/research/review',{cookie:admin})).data.records;assert.equal(review.length,1);assert.ok(!('owner' in review[0]));
 assert.equal((await request('/api/research/review',{method:'POST',cookie:admin,data:{id,status:'approved',note:'Checked the manuscript.'}})).status,200);
 const published=(await request('/api/research')).data.records;assert.equal(published.length,1);assert.equal(published[0].title,submission.title);assert.ok(!('reviewNote' in published[0]));assert.ok(!('owner' in published[0]));assert.ok(published[0].publishedAt);
 assert.equal((await request('/api/research/review',{method:'POST',cookie:admin,data:{id,status:'rejected',note:''}})).status,409);
 const second=await request('/api/research',{method:'POST',cookie:member,data:{...submission,title:'Second submission'}});assert.equal(second.status,201);
 assert.equal((await request('/api/research/review',{method:'POST',cookie:admin,data:{id:second.data.id,status:'rejected',note:'Please revise the methods.'}})).status,200);
 assert.equal((await request('/api/research')).data.records.length,1);assert.equal((await request('/api/research/mine',{cookie:member})).data.records[0].reviewNote,'Please revise the methods.');
 assert.equal((await request('/api/research',{method:'POST',cookie:member,data:{...submission,topic:'Made up field'}})).status,400);
 assert.equal((await request('/api/research',{method:'POST',cookie:member,data:{...submission,url:'',pdf:{name:'fake.pdf',base64:Buffer.from('<html>Not a PDF</html>').toString('base64')}}})).status,400);
 const pdfBytes=Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n');
 const upload=await request('/api/research',{method:'POST',cookie:member,data:{...submission,title:'Uploaded PDF research',url:'',pdf:{name:'study.pdf',base64:pdfBytes.toString('base64')}}});assert.equal(upload.status,201);
 const pdfUrl='/api/research/'+upload.data.id+'/pdf';
 assert.equal((await fetch(base+pdfUrl)).status,404,'An unpublished PDF must remain private');
 for(const cookie of [member,admin]){const response=await fetch(base+pdfUrl,{headers:{Cookie:cookie}});assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/pdf');assert.match(response.headers.get('content-disposition'),/^attachment;/);assert.deepEqual(Buffer.from(await response.arrayBuffer()),pdfBytes);}
 const pdfRecord=(await request('/api/research/mine',{cookie:member})).data.records[0];assert.equal(pdfRecord.pdfName,'study.pdf');assert.equal(pdfRecord.pdfUrl,pdfUrl);assert.ok(!('pdf' in pdfRecord));
 assert.equal((await request('/api/research/review',{method:'POST',cookie:admin,data:{id:upload.data.id,status:'approved',note:''}})).status,200);
 assert.equal((await fetch(base+pdfUrl)).status,200,'Approved PDFs must be downloadable');
 assert.equal((await fetch(base+pdfUrl,{method:'HEAD'})).status,200);
 console.log('Research checks passed: all 28 fields, private PDF uploads, exact download bytes, approval-gated downloads, invalid PDF/topic rejection, owner isolation, authentication, approval/rejection, URL validation, origin checks, and Google-only administrator access.');
}finally{await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});}
