import {cloudResult} from './supabase-client.mjs';
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const fail=(status,message)=>Object.assign(new Error(message),{status});
const text=(v,max)=>typeof v==='string'?v.slice(0,max):'';
export function sharedObservation(row){
 if(!row||typeof row!=='object'||row.deleted)return null;
 const photo=typeof row.photo==='string'&&row.photo.length<=1600000&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(row.photo)?row.photo:'';
 return {id:text(row.id,80),title:text(row.title,160),notes:text(row.notes,6000),location:text(row.location,200),date:text(row.date,10),photo};
}
async function input(req,max=26000000){let size=0;const parts=[];for await(const part of req){size+=part.length;if(size>max)throw fail(413,'Notebook must be 25 MB or smaller.');parts.push(part);}try{const value=JSON.parse(Buffer.concat(parts).toString());if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value;}catch{throw fail(400,'Invalid request.');}}
const shortId=/^STC-[0-9A-Z]{6}$/i;
export async function resolveMember(db,value){if(uuid.test(value||''))return value.toLowerCase();if(!shortId.test(value||''))return null;return cloudResult(db.rpc('geonara_resolve_member',{p_public_id:value.toUpperCase()}));}
export async function memberRoute({req,url,db,user,send,rate}){
 if(!/^\/api\/(members|notebook)(?:\/|$)/.test(url.pathname))return false;
 rate(req,'members',90);
 if(url.pathname==='/api/members'){
  if(req.method!=='GET')throw fail(405,'Method not allowed.');
  const q=(url.searchParams.get('q')||'').trim(),relation=url.searchParams.get('relation')||'',owner=url.searchParams.get('owner'),offset=Number(url.searchParams.get('offset')||0);
  if(q.length>120||!['','followers','following'].includes(relation)||(relation&&!uuid.test(owner||'')&&!shortId.test(owner||''))||!Number.isInteger(offset)||offset<0||offset>100000)throw fail(400,'Invalid member search.');
  const resolvedOwner=relation?await resolveMember(db,owner):null;if(relation&&!resolvedOwner)throw fail(404,'Member not found.');
  const rows=await cloudResult(db.rpc('geonara_find_members',{p_query:q,p_relation:relation,p_owner:resolvedOwner,p_offset:offset}));
  send(200,{members:rows.slice(0,20),hasMore:rows.length>20});return true;
 }
 if(url.pathname==='/api/notebook'){
  if(req.method==='GET'){const row=await cloudResult(db.from('geonara_notebooks').select('shared,updated_at').eq('owner',user.id).maybeSingle());send(200,{shared:!!row?.shared,updatedAt:row?.updated_at||null});return true;}
  if(req.method!=='PUT')throw fail(405,'Method not allowed.');
  const body=await input(req);if(typeof body.shared!=='boolean')throw fail(400,'Choose notebook visibility.');
  if(!body.shared){await cloudResult(db.from('geonara_notebooks').update({shared:false,observations:[],updated_at:new Date().toISOString()}).eq('owner',user.id));send(200,{shared:false});return true;}
  if(!Array.isArray(body.observations)||body.observations.length>250)throw fail(400,'Share up to 250 observations.');
  const observations=body.observations.map(sharedObservation);if(observations.some(row=>!row||!row.id||!row.title))throw fail(400,'Invalid observation.');
  const updatedAt=new Date().toISOString();await cloudResult(db.from('geonara_notebooks').upsert({owner:user.id,shared:true,observations,updated_at:updatedAt},{onConflict:'owner'}));send(200,{shared:true,updatedAt});return true;
 }
 const match=url.pathname.match(/^\/api\/members\/([^/]+)(?:\/(follow|notebook))?$/);if(!match)throw fail(404,'Member not found.');const id=await resolveMember(db,match[1]),action=match[2];if(!id)throw fail(404,'Member not found.');
 const member=await cloudResult(db.rpc('geonara_member_card',{p_id:id}));if(!member)throw fail(404,'Member not found.');
 if(action==='follow'){
  if(!['PUT','DELETE'].includes(req.method))throw fail(405,'Method not allowed.');if(id===user.id)throw fail(400,'You cannot follow yourself.');
  if(req.method==='PUT')await cloudResult(db.from('geonara_follows').upsert({follower:user.id,followed:id},{onConflict:'follower,followed',ignoreDuplicates:true}));
  else await cloudResult(db.from('geonara_follows').delete().eq('follower',user.id).eq('followed',id));
  send(200,{member:await cloudResult(db.rpc('geonara_member_card',{p_id:id}))});return true;
 }
 if(req.method!=='GET')throw fail(405,'Method not allowed.');
 if(action==='notebook'){
  if(!member.notebookShared)throw fail(403,'This notebook is private.');
  const row=await cloudResult(db.from('geonara_notebooks').select('shared,observations,updated_at').eq('owner',id).eq('shared',true).maybeSingle());
  if(!row)throw fail(403,'This notebook is private.');send(200,{observations:row.observations.map(sharedObservation).filter(Boolean),updatedAt:row.updated_at});return true;
 }
 send(200,{member});return true;
}
