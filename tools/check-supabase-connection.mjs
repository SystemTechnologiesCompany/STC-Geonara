import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {supabaseSettings,supabaseClient} from './supabase-client.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),folder=process.env.STC_DATA_DIR?path.resolve(process.env.STC_DATA_DIR):path.join(root,'.data');let config={};try{config=JSON.parse(await readFile(path.join(folder,'supabase.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
const settings=supabaseSettings({...config,...Object.fromEntries(Object.entries(process.env).filter(([,value])=>value))});if(!settings)throw Error('Create a Supabase project and configure its Project URL and publishable key first.');
const response=await fetch(settings.url+'/auth/v1/settings',{headers:{apikey:settings.key},signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Could not reach Supabase Auth. Check the Project URL and publishable key.');const auth=await response.json();console.log('Supabase Auth is reachable.');
const {data,error}=await supabaseClient(settings).from('geonara_posts').select('id').limit(1);
if(error?.code==='PGRST205'||error?.code==='42P01')throw Error('Apply supabase/migrations/202611100001_geonara.sql in the project SQL Editor.');
if(error?.code!=='42501')throw Error(data?'Anonymous database access is not restricted as expected. Review the migration policies.':'Could not verify the database schema and anonymous-access restriction.');console.log('Database schema found; anonymous access is blocked.');
if(!auth.external?.google)throw Error('Enable Google in Supabase Authentication > Sign In / Providers before using sign-in.');if(Object.entries(auth.external||{}).some(([name,enabled])=>enabled===true&&name!=='google'))throw Error('Disable Email and other sign-in providers; STC Geonara uses Google only.');console.log('Google provider is enabled. Complete a browser login to verify the provider credentials and redirects.');
