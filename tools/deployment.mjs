import path from 'node:path';
import os from 'node:os';
export function siteOrigin(env){
 const value=env.SITE_URL;if(!value)return null;
 let url;try{url=new URL(value);}catch{throw Error('SITE_URL must be your complete website address.');}
 const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||(url.protocol!=='https:'&&!(local&&env.NODE_ENV!=='production'&&url.protocol==='http:'))||(env.NODE_ENV==='production'&&local))throw Error('Production SITE_URL must be an HTTPS website origin, without a path.');
 return url.origin;
}
export function deploymentConfig(env,root){
 const production=env.NODE_ENV==='production';const origin=siteOrigin(env);
 if(production){if(!origin)throw Error('Set SITE_URL to the live HTTPS website address.');if(!env.SUPABASE_URL||!(env.SUPABASE_PUBLISHABLE_KEY||env.SUPABASE_ANON_KEY))throw Error('Production requires the Supabase project URL and publishable key.');if(!/^[a-f0-9]{64}$/i.test(env.SUPABASE_SESSION_KEY||''))throw Error('Set a stable 64-character SUPABASE_SESSION_KEY in the host’s private environment.');if(env.STC_SESSION_STORE!=='netlify'&&!env.STC_DATA_DIR)throw Error('Set STC_DATA_DIR to persistent storage, or use the Netlify session store.');}
 const port=Number(env.PORT||env.STC_PORT||5500);if(!Number.isInteger(port)||port<0||port>65535||(production&&port===0))throw Error('PORT must be a valid listening port.');
 return {production,origin,port,host:env.HOST||(production?'0.0.0.0':'127.0.0.1'),dataRoot:path.resolve(env.STC_DATA_DIR||(env.STC_SESSION_STORE==='netlify'?path.join(os.tmpdir(),'stc-geonara'):path.join(root,'.data')))};
}
export function requestOriginAllowed(req,env){
 if(!req.headers.origin)return true;
 const canonical=siteOrigin(env);if(env.NODE_ENV==='production')return req.headers.origin===canonical;
 return req.headers.origin===canonical||req.headers.origin===`http://${req.headers.host}`||req.headers.origin===`https://${req.headers.host}`;
}
