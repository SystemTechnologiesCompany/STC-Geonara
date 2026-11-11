import {mkdir,copyFile,writeFile,lstat,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {allowed,memberAsset} from './static-files.mjs';
import {siteOrigin} from './deployment.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),publish=path.join(root,'.netlify-publish');
// Copy only the explicit public allowlist. Never publish the repository root.
if(path.resolve(publish)!==path.resolve(root,'.netlify-publish'))throw Error('Invalid publish directory.');
try{if((await lstat(publish)).isSymbolicLink())throw Error('The publish directory must not be a symbolic link.');}catch(error){if(error.code!=='ENOENT')throw error;}
await rm(publish,{recursive:true,force:true});
await mkdir(publish,{recursive:true});
for(const name of allowed){if(memberAsset(name))continue;const target=path.join(publish,name);await mkdir(path.dirname(target),{recursive:true});await copyFile(path.join(root,name),target);}
const siteUrl=process.env.SITE_URL||process.env.URL||null;if(siteUrl)siteOrigin({SITE_URL:siteUrl,NODE_ENV:'production'});
const context=process.env.CONTEXT||'local';const storeName=context==='production'?'stc-geonara-auth-production':'stc-geonara-auth-preview-'+String(process.env.DEPLOY_ID||'local').replace(/[^a-zA-Z0-9-]/g,'').slice(0,80);
await writeFile(path.join(root,'deployment-runtime.json'),JSON.stringify({siteUrl,storeName})+'\n');
await writeFile(path.join(publish,'_headers'),`/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=0, must-revalidate
`);
console.log('Netlify public files prepared; member datasets and private server files stay outside the publish directory.');
if(!siteUrl)console.log('The live site address will be resolved from Netlify’s URL during its build.');
