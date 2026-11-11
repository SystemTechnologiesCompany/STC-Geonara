import {readFile,writeFile,mkdir,rename,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import researchTopics from '../research-topics.js';
const error=(status,message)=>Object.assign(new Error(message),{status});
export function createResearchApi({root,env=process.env,storePath=path.join(root,'.data/research.json'),authenticate=async()=>null}){
 let queue=Promise.resolve();const limits=new Map();
 async function read(){try{const data=JSON.parse(await readFile(storePath,'utf8'));if(!Array.isArray(data.records))throw Error('Invalid research store');return data;}catch(e){if(e.code==='ENOENT')return {records:[]};throw e;}}
 function change(fn){const task=queue.then(async()=>{const data=await read();const result=await fn(data);await mkdir(path.dirname(storePath),{recursive:true});await writeFile(storePath+'.tmp',JSON.stringify(data),'utf8');await rename(storePath+'.tmp',storePath);return result;});queue=task.catch(()=>{});return task;}
 async function body(req,max=24000){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>max)throw error(413,'Submission is too large.');chunks.push(chunk);}try{const data=JSON.parse(Buffer.concat(chunks).toString());if(!data||typeof data!=='object'||Array.isArray(data))throw Error();return data;}catch{throw error(400,'Invalid submission.');}}
 function field(data,key,max){if(typeof data[key]!=='string'||!data[key].trim()||data[key].trim().length>max)throw error(400,'Complete all research fields within their limits.');return data[key].trim();}
 function rate(req,scope,max){const now=Date.now();for(const [key,value]of limits)if(now-value.start>60000)limits.delete(key);const key=scope+req.socket.remoteAddress;const entry=limits.get(key)||{start:now,count:0};entry.count++;limits.set(key,entry);if(entry.count>max)throw error(429,'Too many requests. Please try again shortly.');}
 const publicRecord=record=>({...Object.fromEntries(['id','title','authors','abstract','topic','year','url','publishedAt'].map(key=>[key,record[key]])),...(record.pdf?{pdfUrl:`/api/research/${record.id}/pdf`,pdfName:record.pdf.name,pdfSize:record.pdf.size}:{})});
 const ownRecord=record=>({...publicRecord(record),status:record.status,submittedAt:record.submittedAt,reviewNote:record.reviewNote||''});
 return async(req,res,url)=>{
  if(!url.pathname.startsWith('/api/research'))return false;
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  try{
   if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)throw error(403,'Origin not allowed.');
   const user=await authenticate(req);const admin=!!user?.isAdmin;
   const pdfId=url.pathname.match(/^\/api\/research\/([a-f0-9-]{36})\/pdf$/)?.[1];
   if(pdfId){
    if(!['GET','HEAD'].includes(req.method))throw error(405,'Method not allowed.');
    await queue;const record=(await read()).records.find(item=>item.id===pdfId);
    if(!record?.pdf||(record.status!=='approved'&&!admin&&(!user||record.owner!==('account:'+user.id))))throw error(404,'PDF not found.');
    const file=await readFile(path.join(path.dirname(storePath),'research-pdfs',pdfId+'.pdf'));
    res.writeHead(200,{'Content-Type':'application/pdf','Content-Length':file.length,'Content-Disposition':`attachment; filename="research.pdf"; filename*=UTF-8''${encodeURIComponent(record.pdf.name).replace(/'/g,'%27')}`,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'",'Cache-Control':'private, no-store'});res.end(req.method==='HEAD'?undefined:file);return true;
   }
   if(url.pathname==='/api/research/session'&&req.method==='GET'){send(200,{admin,configured:true});return true;}
   if(url.pathname==='/api/research/session')throw error(405,'Use Google sign-in.');
   if(url.pathname==='/api/research'&&req.method==='GET'){await queue;send(200,{records:(await read()).records.filter(r=>r.status==='approved').map(publicRecord)});return true;}
   if(url.pathname==='/api/research/review'){
    if(!admin)throw error(403,'Admin sign-in is required.');
    if(req.method==='GET'){await queue;send(200,{records:(await read()).records.filter(r=>r.status==='pending').map(ownRecord)});return true;}
    if(req.method==='POST'){rate(req,'review',40);const data=await body(req);if(!['approved','rejected'].includes(data.status))throw error(400,'Choose an approval decision.');if(typeof data.note!=='string'||data.note.length>1000)throw error(400,'Review note is too long.');await change(store=>{const record=store.records.find(r=>r.id===data.id);if(!record)throw error(404,'Submission not found.');if(record.status!=='pending')throw error(409,'This submission has already been reviewed.');record.status=data.status;record.reviewNote=data.note.trim();record.reviewedAt=new Date().toISOString();if(data.status==='approved')record.publishedAt=record.reviewedAt;});send(200,{ok:true});return true;}
    throw error(405,'Method not allowed.');
   }
   if(!['/api/research','/api/research/mine'].includes(url.pathname))throw error(404,'Not found.');
   if(!user)throw error(401,'Sign in with Google to continue.');
   const owner='account:'+user.id;
   if(url.pathname==='/api/research/mine'&&req.method==='GET'){await queue;send(200,{records:(await read()).records.filter(r=>r.owner===owner).map(ownRecord)});return true;}
   if(url.pathname!=='/api/research'||req.method!=='POST')throw error(405,'Method not allowed.');
   rate(req,'submit',8);const data=await body(req,14010000);const record={id:randomUUID(),title:field(data,'title',200),authors:field(data,'authors',300),abstract:field(data,'abstract',8000),topic:field(data,'topic',100),url:typeof data.url==='string'?data.url.trim():'',year:Number(data.year),owner,status:'pending',submittedAt:new Date().toISOString()};
   if(!researchTopics.includes(record.topic))throw error(400,'Choose an Earth science field from the list.');
   if(record.url){let link;try{link=new URL(record.url);}catch{throw error(400,'Use a valid HTTPS publication or PDF link.');}if(record.url.length>2000||link.protocol!=='https:'||link.username||link.password)throw error(400,'Use a valid HTTPS publication or PDF link.');record.url=link.href;}
   let pdf;
   if(data.pdf){
    if(typeof data.pdf.name!=='string'||data.pdf.name.length>180||!data.pdf.name.toLowerCase().endsWith('.pdf')||typeof data.pdf.base64!=='string'||!data.pdf.base64.length||data.pdf.base64.length%4||!/^[A-Za-z0-9+/]*={0,2}$/.test(data.pdf.base64))throw error(400,'Choose a valid PDF file.');
    pdf=Buffer.from(data.pdf.base64,'base64');if(pdf.length>10485760)throw error(413,'PDF files must be 10 MB or smaller.');
    if(!/^%PDF-1\.[0-9]|^%PDF-2\.0/.test(pdf.subarray(0,8).toString('ascii'))||!pdf.subarray(-1024).includes(Buffer.from('%%EOF')))throw error(400,'Choose a valid PDF file.');
    record.pdf={name:data.pdf.name.replace(/[\\/\x00-\x1f\x7f]/g,'_'),size:pdf.length};
   }
   if(!pdf&&!record.url)throw error(400,'Upload a PDF or add a publication link.');
   if(!Number.isInteger(record.year)||record.year<1800||record.year>new Date().getFullYear()+1)throw error(400,'Use a valid publication year.');
   const pdfPath=path.join(path.dirname(storePath),'research-pdfs',record.id+'.pdf');let written=false;
   try{await change(async store=>{if(store.records.filter(r=>r.owner===owner&&r.status==='pending').length>=20)throw error(409,'You already have 20 submissions awaiting review.');if(store.records.length>=5000)throw error(409,'Research capacity reached.');if(pdf){await mkdir(path.dirname(pdfPath),{recursive:true});await writeFile(pdfPath,pdf,{flag:'wx'});written=true;}store.records.unshift(record);});}catch(e){if(written)await unlink(pdfPath).catch(()=>{});throw e;}send(201,{id:record.id,status:'pending'});return true;
  }catch(e){send(e.status||500,{error:e.status?e.message:'The server could not complete this request.'});return true;}
 };
}
