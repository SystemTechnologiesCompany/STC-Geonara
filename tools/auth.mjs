import {OAuth2Client} from 'google-auth-library';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {createHash,randomBytes,randomUUID,randomInt,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
const fail=(status,message)=>Object.assign(new Error(message),{status});
const digest=value=>createHash('sha256').update(value).digest('hex');
const cookieValue=(req,name)=>(req.headers.cookie||'').match(new RegExp('(?:^|;\\s*)'+name+'=([a-f0-9]{64})(?:;|$)'))?.[1];
export function createAuth({root,env=process.env,storePath=path.join(root,'.data/accounts.json'),verifyGoogle}){
 const client=new OAuth2Client(),challenges=new Map(),rates=new Map();let queue=Promise.resolve();
 const clientId=env.GOOGLE_CLIENT_ID||'',admins=new Set((env.GOOGLE_ADMIN_EMAILS||'').split(',').map(value=>value.trim().toLowerCase()).filter(Boolean));
 async function read(){try{return JSON.parse(await readFile(storePath,'utf8'));}catch(error){if(error.code==='ENOENT')return {users:{},sessions:{}};throw error;}}
 function change(fn){const work=queue.then(async()=>{const data=await read();const result=await fn(data);await mkdir(path.dirname(storePath),{recursive:true});await writeFile(storePath+'.tmp',JSON.stringify(data),{mode:0o600});await rename(storePath+'.tmp',storePath);return result;});queue=work.catch(()=>{});return work;}
 const publicUser=user=>({id:user.id,email:user.email,profile:user.profile,saved:user.saved||[],isAdmin:admins.has(user.email.toLowerCase())});
 async function getUser(req){const token=cookieValue(req,'stc_account_session');if(!token)return null;await queue;const data=await read(),session=data.sessions[digest(token)];if(!session||session.expiresAt<Date.now())return null;const user=data.users[session.userId];return user?publicUser(user):null;}
 function setCookie(req,res,name,value,maxAge){res.setHeader('Set-Cookie',`${name}=${value}; HttpOnly; SameSite=Strict; Path=${name==='stc_account_session'?'/':'/api'}; Max-Age=${maxAge}${req.socket.encrypted?'; Secure':''}`);}
 async function body(req,max=1700000){const parts=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>max)throw fail(413,'Request too large.');parts.push(chunk);}try{const data=JSON.parse(Buffer.concat(parts).toString());if(!data||typeof data!=='object'||Array.isArray(data))throw Error();return data;}catch{throw fail(400,'Invalid request.');}}
 const configured=/^[\w.-]+\.apps\.googleusercontent\.com$/.test(clientId);
 return {getUser,async handle(req,res,url){
  if(!url.pathname.startsWith('/api/auth/'))return false;
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  try{
   if(req.headers.origin&&![`http://${req.headers.host}`,`https://${req.headers.host}`].includes(req.headers.origin))throw fail(403,'Origin not allowed.');
   if(req.method==='GET'&&url.pathname==='/api/auth/session'){
    const user=await getUser(req);let nonce='';if(configured&&!user){const now=Date.now();for(const [key,expires]of challenges)if(expires<now)challenges.delete(key);if(challenges.size>=5000)throw fail(429,'Please try again shortly.');const token=randomBytes(32).toString('hex');nonce=digest(token);challenges.set(nonce,now+600000);setCookie(req,res,'stc_login_challenge',token,600);}send(200,{user,configured,clientId:configured?clientId:'',nonce});return true;
   }
   if(req.method==='POST'&&url.pathname==='/api/auth/google'){
    if(!configured)throw fail(503,'Google sign-in is not available yet.');const now=Date.now();for(const [key,value]of rates)if(value.start<now-60000)rates.delete(key);const key=req.socket.remoteAddress,rate=rates.get(key)||{start:now,count:0};rate.count++;rates.set(key,rate);if(rate.count>12)throw fail(429,'Please try again shortly.');
    const input=await body(req,24000),challenge=cookieValue(req,'stc_login_challenge'),nonce=challenge?digest(challenge):'';if(!nonce||!challenges.has(nonce)||challenges.get(nonce)<now)throw fail(403,'Refresh sign-in and try again.');if(typeof input.credential!=='string'||input.credential.length>16000)throw fail(400,'Google sign-in could not be verified.');
    challenges.delete(nonce);
    let payload;try{payload=verifyGoogle?await verifyGoogle(input.credential,clientId):(await client.verifyIdToken({idToken:input.credential,audience:clientId})).getPayload();}catch{throw fail(401,'Google sign-in could not be verified.');}
    if(!payload||!['accounts.google.com','https://accounts.google.com'].includes(payload.iss)||payload.aud!==clientId||typeof payload.exp!=='number'||!Number.isFinite(payload.exp)||payload.exp*1000<=now||typeof payload.sub!=='string'||!payload.sub||payload.sub.length>255||typeof payload.email!=='string'||payload.email.length>320||payload.email_verified!==true||typeof payload.nonce!=='string'||!/^[a-f0-9]{64}$/.test(payload.nonce)||!timingSafeEqual(Buffer.from(payload.nonce),Buffer.from(nonce)))throw fail(401,'Google sign-in could not be verified.');
    challenges.delete(nonce);const token=randomBytes(32).toString('hex');const user=await change(data=>{for(const [id,session]of Object.entries(data.sessions))if(session.expiresAt<now)delete data.sessions[id];const old=cookieValue(req,'stc_account_session');if(old)delete data.sessions[digest(old)];let user=Object.values(data.users).find(user=>user.googleSub===payload.sub);if(!user){user={id:randomUUID(),googleSub:payload.sub,email:payload.email,profile:{name:typeof payload.name==='string'?payload.name.slice(0,120):'Earth explorer',avatarId:'avatar-'+String(randomInt(1,17)).padStart(2,'0'),photo:'',title:'Geology enthusiast',specialization:'Earth Sciences',interests:'',about:''},saved:[],createdAt:new Date().toISOString()};data.users[user.id]=user;}user.email=payload.email;data.sessions[digest(token)]={userId:user.id,expiresAt:now+7*86400000};return publicUser(user);});setCookie(req,res,'stc_account_session',token,7*86400);send(200,{user});return true;
   }
   if(req.method==='POST'&&url.pathname==='/api/auth/logout'){const token=cookieValue(req,'stc_account_session');if(token)await change(data=>{delete data.sessions[digest(token)];});setCookie(req,res,'stc_account_session','',0);send(200,{ok:true});return true;}
   if(req.method==='PATCH'&&url.pathname==='/api/auth/profile'){
    const user=await getUser(req);if(!user)throw fail(401,'Sign in with Google to continue.');const input=await body(req),profile=input.profile;if(!profile||typeof profile!=='object')throw fail(400,'Invalid profile.');const fields={};for(const [key,max]of Object.entries({name:120,title:120,specialization:120,interests:120,about:1500})){if(typeof profile[key]!=='string'||profile[key].length>max)throw fail(400,'Invalid profile.');fields[key]=profile[key].trim();}if(!fields.name||!/^avatar-(0[1-9]|1[0-6])$/.test(profile.avatarId))throw fail(400,'Invalid profile.');const photo=profile.photo||'';if(typeof photo!=='string'||photo.length>1600000||(photo&&!/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(photo)))throw fail(400,'Invalid profile photo.');if(!Array.isArray(input.saved)||input.saved.length>5000||input.saved.some(value=>typeof value!=='string'||value.length>300))throw fail(400,'Invalid saved records.');const result=await change(data=>{const record=data.users[user.id];record.profile={...fields,avatarId:profile.avatarId,photo};record.saved=[...new Set(input.saved)];return publicUser(record);});send(200,{user:result});return true;
   }
   throw fail(404,'Not found.');
  }catch(error){send(error.status||500,{error:error.status?error.message:'Sign-in is temporarily unavailable.'});return true;}
 }};
}
