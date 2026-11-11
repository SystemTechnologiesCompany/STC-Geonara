import {readFile,writeFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {supabaseSettings} from './supabase-client.mjs';
const config=JSON.parse(await readFile(new URL('../.data/supabase.json',import.meta.url),'utf8'));supabaseSettings(config);
const load=async name=>(await readFile(new URL('../.data/'+name,import.meta.url),'utf8')).trim();
let sessionKey;try{sessionKey=await load('supabase-session-key.txt');}catch(error){if(error.code!=='ENOENT')throw error;sessionKey=randomBytes(32).toString('hex');await writeFile(new URL('../.data/supabase-session-key.txt',import.meta.url),sessionKey,{mode:0o600,flag:'wx'});}
if(!/^[a-f0-9]{64}$/i.test(sessionKey))throw Error('The private session encryption key is invalid.');
const values={SUPABASE_URL:config.SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY:config.SUPABASE_PUBLISHABLE_KEY||config.SUPABASE_ANON_KEY,SUPABASE_SESSION_KEY:sessionKey,GEMINI_API_KEY:await load('gemini-api-key.txt'),GROQ_API_KEY:await load('groq-api-key.txt')};
for(const [name,value] of Object.entries(values))if(!value||/[\r\n]/.test(value))throw Error('Check the saved '+name+' configuration.');
await writeFile(new URL('../.data/netlify.env',import.meta.url),Object.entries(values).map(([name,value])=>name+'='+value).join('\n')+'\n',{mode:0o600});
console.log('Private Netlify environment file saved to .data/netlify.env. Import it into the host environment; never upload it as a public website file or share its contents.');
