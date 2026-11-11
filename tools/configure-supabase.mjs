import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {supabaseSettings} from './supabase-client.mjs';
const args=process.argv.slice(2),value=name=>args[args.indexOf(name)+1];
if(!args.includes('--url')||!args.includes('--key'))throw Error('Usage: node tools/configure-supabase.mjs --url PROJECT_URL --key PUBLISHABLE_KEY [--site SITE_URL]');
const config={SUPABASE_URL:value('--url'),SUPABASE_PUBLISHABLE_KEY:value('--key'),SITE_URL:args.includes('--site')?value('--site'):'http://localhost:5500'};
supabaseSettings(config);const site=new URL(config.SITE_URL);if(site.username||site.password||site.pathname!=='/'||(site.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(site.hostname)))throw Error('SITE_URL must be your HTTPS website origin or local development origin.');
const root=fileURLToPath(new URL('../',import.meta.url)),folder=process.env.STC_DATA_DIR?path.resolve(process.env.STC_DATA_DIR):path.join(root,'.data');await mkdir(folder,{recursive:true});await writeFile(path.join(folder,'supabase.json'),JSON.stringify(config,null,2)+'\n',{mode:0o600});console.log('Supabase project configuration saved. Apply the SQL migration and configure Google before starting the website.');
