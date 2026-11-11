const unavailable='Swingo is temporarily unavailable. Try again later.';
const quota='Swingo has reached its usage limit. Please try again later.';
const blocked='Swingo cannot answer this request. Try a different geological question or image.';
const fail=(status,message,retryable=false)=>Object.assign(new Error(message),{status,retryable});
const retryStatuses=new Set([404,408,429,500,502,503,504]);
function textAnswer(value){return value.replace(/<think\b[^>]*>[\s\S]*?(?:<\/think>|$)/gi,'').trim().replace(/\*\*([^*\n]+)\*\*/g,'$1').replace(/__([^_\n]+)__/g,'$1').replace(/^#{1,6}\s+/gm,'');}
export function createSwingoGenerator({env,fetchImpl=fetch,now=Date.now}){
 const cooldowns=new Map();
 const has=key=>!!env[key]?.trim();
 function configured(){return has('GEMINI_API_KEY')||has('GROQ_API_KEY');}
 function request(candidate,input,instructions,signal){
  if(candidate.provider==='groq'){
   const content=[{type:'text',text:input.question}];if(input.image)content.push({type:'image_url',image_url:{url:'data:'+input.image.mimeType+';base64,'+input.image.data}});
   return fetchImpl('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.GROQ_API_KEY.trim()},signal,body:JSON.stringify({model:candidate.model,messages:[{role:'system',content:instructions},...input.history.map(item=>({role:item.role==='model'?'assistant':'user',content:item.parts.map(part=>part.text).join('\n')})),{role:'user',content:input.image?content:input.question}],max_completion_tokens:2048,...(/^qwen\/qwen3/.test(candidate.model)?{reasoning_effort:'low',reasoning_format:'hidden'}:{})})});
  }
  const parts=[{text:input.question}];if(input.image)parts.unshift({inlineData:input.image});
  return fetchImpl('https://generativelanguage.googleapis.com/v1beta/models/'+candidate.model+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY.trim()},signal,body:JSON.stringify({systemInstruction:{parts:[{text:instructions}]},contents:[...input.history,{role:'user',parts}],generationConfig:{maxOutputTokens:2048,...(/^gemini-[34]/.test(candidate.model)?{thinkingConfig:{thinkingLevel:'LOW'}}:{})},safetySettings:['HARASSMENT','HATE_SPEECH','SEXUALLY_EXPLICIT','DANGEROUS_CONTENT'].map(category=>({category:'HARM_CATEGORY_'+category,threshold:'BLOCK_MEDIUM_AND_ABOVE'}))})});
 }
 function cooldown(candidate,response,status){const raw=response?.headers?.get('retry-after');const seconds=Number(raw);let duration=Number.isFinite(seconds)&&seconds>0?seconds*1000:raw?Date.parse(raw)-now():0;if(!Number.isFinite(duration)||duration<=0)duration=status===429?60000:20000;duration=Math.min(86400000,Math.max(1000,duration));const key=status===429?candidate.provider:candidate.provider+':'+candidate.model;cooldowns.set(key,{until:now()+duration,status});}
 async function decode(candidate,response){let data;try{data=await response.json();}catch{throw fail(502,'Swingo could not respond. Try again.',true);}
  let raw='';if(candidate.provider==='groq'){const choice=data.choices?.[0];if(choice?.finish_reason==='content_filter'||choice?.message?.refusal)throw fail(422,blocked);const content=choice?.message?.content;raw=typeof content==='string'?content:Array.isArray(content)?content.filter(part=>part.type==='text'&&typeof part.text==='string').map(part=>part.text).join(''):'';
  }else{const candidate=data.candidates?.[0];if(data.promptFeedback?.blockReason||['SAFETY','BLOCKLIST','PROHIBITED_CONTENT','SPII','RECITATION','IMAGE_SAFETY'].includes(candidate?.finishReason))throw fail(422,blocked);raw=(candidate?.content?.parts||[]).filter(part=>typeof part.text==='string'&&!part.thought).map(part=>part.text).join('');}
  const answer=textAnswer(raw);if(!answer)throw fail(502,'Swingo could not respond. Try again.',true);return {answer};
 }
 async function generate(input,instructions){
  const primary=env.GEMINI_MODEL||'gemini-3.8-flash',secondary=env.GEMINI_FALLBACK_MODEL||'gemini-3.5-flash',groq=env.GROQ_MODEL||'qwen/qwen3.8-27b';const candidates=[];
  if(has('GEMINI_API_KEY')){if(!/^gemini-[a-z0-9.-]{1,80}$/.test(primary)||!/^gemini-[a-z0-9.-]{1,80}$/.test(secondary))throw fail(503,unavailable);candidates.push({provider:'gemini',model:primary});if(secondary!==primary)candidates.push({provider:'gemini',model:secondary});}
  if(has('GROQ_API_KEY')){if(!/^[a-z0-9][a-z0-9/_.:-]{1,100}$/i.test(groq))throw fail(503,unavailable);candidates.push({provider:'groq',model:groq});}
  const deadline=Date.now()+55000;let lastError;
  for(const candidate of candidates){
   const cooling=[cooldowns.get(candidate.provider),cooldowns.get(candidate.provider+':'+candidate.model)].find(item=>item?.until>now());if(cooling){lastError??=fail(cooling.status===429?429:503,cooling.status===429?quota:unavailable);continue;}
   const left=deadline-Date.now();if(left<=0)throw fail(504,'Swingo could not respond in time. Try again.');
   try{const response=await request(candidate,input,instructions,AbortSignal.timeout(Math.min(18000,left)));if(!response.ok){if(retryStatuses.has(response.status)){cooldown(candidate,response,response.status);throw fail(response.status===429?429:503,response.status===429?quota:unavailable,true);}throw fail(503,unavailable);}
    return await decode(candidate,response);
   }catch(error){if(error.status){if(!error.retryable)throw error;lastError=error;continue;}
    // Treat network/timeout failures as provider outages; do not reveal raw errors or keys.
    cooldowns.set(candidate.provider,{until:now()+20000,status:503});lastError=error.name==='TimeoutError'||error.name==='AbortError'?fail(504,'Swingo could not respond in time. Try again.'):fail(502,'Swingo could not respond. Try again.');
   }
  }
  throw lastError||fail(503,unavailable);
 }
 return {configured,generate};
}
