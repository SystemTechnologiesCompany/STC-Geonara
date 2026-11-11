import {createClient} from '@supabase/supabase-js';
export function supabaseSettings(env){
 const url=env.SUPABASE_URL?.trim(),key=(env.SUPABASE_PUBLISHABLE_KEY||env.SUPABASE_ANON_KEY)?.trim();
 if(!url&&!key)return null;
 if(!url||!key)throw Error('Set both SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
 const parsed=new URL(url);if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.pathname!=='/')throw Error('Use the Supabase HTTPS Project URL.');
 let legacy=false;try{legacy=JSON.parse(Buffer.from(key.split('.')[1],'base64url')).role==='anon';}catch{}
 if(!/^sb_publishable_[\w-]+$/.test(key)&&!legacy)throw Error('Use a publishable or anon key, never a secret or service-role key.');
 return {url:parsed.origin,key};
}
export function supabaseClient(settings,accessToken,options={}){return createClient(settings.url,settings.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},...(accessToken?{global:{headers:{Authorization:'Bearer '+accessToken}}}:{}),...options});}
export async function cloudResult(result){const {data,error}=await result;if(error)throw Object.assign(new Error('Supabase could not complete this request.'),{status:error.code==='42501'?403:502,cloudCode:error.code});return data;}
