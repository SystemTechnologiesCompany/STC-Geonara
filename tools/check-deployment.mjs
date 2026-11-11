import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,readdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {deploymentConfig,requestOriginAllowed} from './deployment.mjs';
import {allowed,memberAsset} from './static-files.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const env={NODE_ENV:'production',SITE_URL:'https://stc-geonara.netlify.app',SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',SUPABASE_SESSION_KEY:'a'.repeat(64),STC_SESSION_STORE:'netlify',PORT:'3210',STC_PORT:'5500'};
const config=deploymentConfig(env,root);assert.equal(config.port,3210);assert.equal(config.host,'0.0.0.0');
for(const change of [{SITE_URL:''},{SITE_URL:'http://localhost:5500'},{SITE_URL:'https://example.com/path'},{SITE_URL:'https://user:pass@example.com'},{SUPABASE_SESSION_KEY:''},{SUPABASE_URL:''},{PORT:'bad'},{STC_SESSION_STORE:'',STC_DATA_DIR:''}])assert.throws(()=>deploymentConfig({...env,...change},root));
assert.equal(requestOriginAllowed({headers:{origin:env.SITE_URL,host:'internal.proxy'}},env),true);assert.equal(requestOriginAllowed({headers:{origin:'https://attacker.example',host:'attacker.example'}},env),false);
const temp=await mkdtemp(path.join(os.tmpdir(),'geonara-deployment-'));let child;
try{
 child=spawn(process.execPath,['tools/serve.mjs'],{cwd:root,env:{...process.env,NODE_ENV:'development',PORT:'0',HOST:'0.0.0.0',STC_DATA_DIR:temp,SITE_URL:'',STC_SESSION_STORE:''},stdio:['ignore','pipe','pipe']});
 const port=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(Error('Server did not start.')),15000);child.once('exit',code=>{clearTimeout(timer);reject(Error('Server exited: '+code));});child.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/listening on 0\.0\.0\.0:(\d+)/);if(match){clearTimeout(timer);resolve(Number(match[1]));}});});
 for(const [route,status]of [['/healthz',200],['/',200],['/.data/gemini-api-key.txt',404],['/tools/serve.mjs',404],['/catalogue-data.js',401],['/assets/fossils/a.js',401],['/api/status',401]]){const response=await fetch('http://127.0.0.1:'+port+route);assert.equal(response.status,status,route);if(route==='/healthz')assert.deepEqual(await response.json(),{status:'ok'});}
 const result=spawn(process.execPath,['tools/build-netlify.mjs'],{cwd:root,env:{...process.env,SITE_URL:env.SITE_URL,URL:env.SITE_URL,CONTEXT:'production'},stdio:'ignore'});assert.equal((await once(result,'exit'))[0],0);
 const publish=path.join(root,'.netlify-publish');for(const name of allowed)if(!memberAsset(name))assert.ok((await readFile(path.join(publish,name))).length);
 const files=await readdir(publish,{recursive:true});for(const name of files)assert.ok(!name.includes('.data')&&!name.endsWith('.env')&&!memberAsset(name.replaceAll('\\','/')));
 const runtime=JSON.parse(await readFile(path.join(root,'deployment-runtime.json'),'utf8'));assert.equal(runtime.siteUrl,env.SITE_URL);assert.equal(runtime.storeName,'stc-geonara-auth-production');
 console.log('Deployment checks passed: public host/PORT, production config validation, proxy-safe origins, health check, private file/member-data access, and Netlify public artifact isolation.');
}finally{if(child&&child.exitCode===null){const exited=once(child,'exit');child.kill('SIGTERM');await exited;}const target=path.resolve(temp);assert.ok(target.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(target).startsWith('geonara-deployment-'));await rm(target,{recursive:true,force:true});}
