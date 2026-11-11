import {requestOriginAllowed} from './deployment.mjs';
import {createSwingo} from './swingo.mjs';
import path from 'node:path';
import {createResearchApi} from './research-api.mjs';
import {createCommunityApi} from './community-api.mjs';
import {createAuth} from './auth.mjs';
import {supabaseSettings} from './supabase-client.mjs';
import {createSupabaseAuth} from './supabase-auth.mjs';
import {createSupabaseDataApi} from './supabase-data.mjs';
const fail=(status,message)=>Object.assign(new Error(message),{status});
async function readJSON(req){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>2100000)throw fail(413,'Request too large.');chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString());}catch{throw fail(400,'Invalid JSON.');}}
export function createApi({root,storePath=path.join(root,'.data/community.json'),env=process.env,fetchImpl=fetch,authenticate,verifyGoogle,supabaseClientFactory,authStore}){
 const swingo=createSwingo({root,env,fetchImpl});
 const settings=supabaseSettings(env);
 const auth=settings?createSupabaseAuth({settings,env,dataRoot:path.dirname(storePath),authStore,clientFactory:supabaseClientFactory}):createAuth({root,env,storePath:path.join(path.dirname(storePath),'accounts.json'),verifyGoogle});
 const users=new WeakMap();
 const getUser=authenticate||(req=>{if(!users.has(req))users.set(req,Promise.resolve(auth.getUser(req)));return users.get(req);});
 const cloud=settings?createSupabaseDataApi({settings,authenticate:getUser,clientFactory:supabaseClientFactory,fetchImpl}):null;
 const researchApi=createResearchApi({root,env,storePath:path.join(path.dirname(storePath),'research.json'),authenticate:getUser});
 const communityApi=createCommunityApi({root,storePath,authenticate:getUser});
 const handle=async function api(req,res,url){
  if(!url.pathname.startsWith('/api/'))return false;
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  try{
   if(!requestOriginAllowed(req,env))throw fail(403,'Origin not allowed.');
   if(await auth.handle(req,res,url))return true;
   const user=await getUser(req);if(!user)throw fail(401,'Sign in with Google to continue.');
   if(cloud&&await cloud(req,res,url))return true;
   if(!cloud&&await researchApi(req,res,url))return true;
   if(url.pathname==='/api/status'&&req.method==='GET'){send(200,{ai:swingo.configured(),community:true});return true;}
   if(url.pathname==='/api/swingo'&&req.method==='POST'){
    send(200,await swingo.answer(await readJSON(req),user.id));return true;
   }
   if(!cloud&&await communityApi(req,res,url))return true;
   throw fail(404,'Not found.');
  }catch(error){send(error.status||500,{error:error.status?error.message:'The server could not complete this request.'});return true;}
 };
 handle.getUser=getUser;
 return handle;
}
