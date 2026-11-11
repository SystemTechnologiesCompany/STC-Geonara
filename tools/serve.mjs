import {allowed,memberAsset} from './static-files.mjs';
import {deploymentConfig} from './deployment.mjs';
import {createApi} from './api.mjs';
import http from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = process.env.STC_SITE_ROOT||fileURLToPath(new URL('../', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
// Google configuration is loaded from the environment or private data directory.
const apiEnv={...process.env};
const production=apiEnv.NODE_ENV==='production';
const dataRoot=apiEnv.STC_DATA_DIR?path.resolve(apiEnv.STC_DATA_DIR):path.join(root,'.data');
if(!production&&!apiEnv.GOOGLE_CLIENT_ID){try{apiEnv.GOOGLE_CLIENT_ID=(await readFile(path.join(dataRoot,'google-client-id.txt'),'utf8')).trim();}catch{}}
if(!production&&!apiEnv.GOOGLE_ADMIN_EMAILS){try{apiEnv.GOOGLE_ADMIN_EMAILS=(await readFile(path.join(dataRoot,'google-admin-emails.txt'),'utf8')).trim();}catch{}}
if(!production)try{const config=JSON.parse(await readFile(path.join(dataRoot,'supabase.json'),'utf8'));for(const key of ['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','SUPABASE_ANON_KEY','SITE_URL'])if(!apiEnv[key]&&typeof config[key]==='string')apiEnv[key]=config[key];}catch(error){if(error.code!=='ENOENT')throw error;}
if(!production&&!apiEnv.GEMINI_API_KEY){try{apiEnv.GEMINI_API_KEY=(await readFile(path.join(dataRoot,'gemini-api-key.txt'),'utf8')).trim();}catch(error){if(error.code!=='ENOENT')throw error;}}
if(!production&&!apiEnv.GROQ_API_KEY){try{apiEnv.GROQ_API_KEY=(await readFile(path.join(dataRoot,'groq-api-key.txt'),'utf8')).trim();}catch(error){if(error.code!=='ENOENT')throw error;}}
const deployment=deploymentConfig(apiEnv,root);
let authStore;if(apiEnv.STC_SESSION_STORE==='netlify'){const {getStore}=await import('@netlify/blobs');const {netlifyAuthStore}=await import('./netlify-auth-store.mjs');const store=()=>getStore({name:apiEnv.STC_AUTH_STORE_NAME||'stc-geonara-auth-production',consistency:'strong'});authStore=netlifyAuthStore(Object.fromEntries(['get','getWithMetadata','set','delete'].map(method=>[method,(...args)=>store()[method](...args)])));}
const handleApi=createApi({authStore,root,storePath:path.join(deployment.dataRoot,'community.json'),env:apiEnv});
const server = http.createServer(async(req,res)=>{
  try {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');if(deployment.production)res.setHeader('Strict-Transport-Security','max-age=31536000');
    if(url.pathname==='/healthz'&&['GET','HEAD'].includes(req.method)){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:JSON.stringify({status:'ok'}));return;}
    if(await handleApi(req,res,url))return;
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
    const name = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    if(!allowed.has(name)){res.writeHead(404);res.end('Not found');return;}
    if(memberAsset(name)&&!(await handleApi.getUser(req))){res.writeHead(401,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({error:'Sign in with Google to continue.'}));return;}
    const body = await readFile(path.join(root,name));
    res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.headersTimeout=15000;server.requestTimeout=90000;
server.listen(deployment.port,deployment.host,()=>console.log(`STC Geonara listening on ${deployment.host}:${server.address().port}`));
let stopping=false;for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{if(stopping)return;stopping=true;server.close(()=>process.exit(0));server.closeIdleConnections();setTimeout(()=>process.exit(1),65000).unref();});
