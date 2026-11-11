import assert from 'node:assert/strict';
import {createSwingoGenerator} from './swingo-providers.mjs';
import {parseSwingoInput,swingoInstructions} from './swingo.mjs';
const env={GEMINI_API_KEY:'private-gemini-test-key',GROQ_API_KEY:'private-groq-test-key'};
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aW7sAAAAASUVORK5CYII=';
const goodGroq={ok:true,status:200,json:async()=>({choices:[{finish_reason:'stop',message:{content:'<think>Internal thoughts</think>**A concise answer.**',reasoning:'Private internal thoughts'}}]})};
const goodGemini={ok:true,status:200,json:async()=>({candidates:[{content:{parts:[{text:'Gemini recovered.'}]}}]})};
for(const [language,name]of [['en','English'],['fr','French'],['ar','Arabic']]){
 const calls=[];const client=createSwingoGenerator({env,fetchImpl:async(url,options)=>{calls.push({url,options,body:JSON.parse(options.body)});return url.includes('googleapis')?{ok:false,status:429}:goodGroq;}});
 const answer=await client.generate(parseSwingoInput({language,question:'Interpret the layers.',mode:'diagram',image:png,history:[{from:'me',text:'Earlier question'},{from:'bot',text:'Earlier answer'}]}),swingoInstructions(language,'diagram'));
 assert.deepEqual(answer,{answer:'A concise answer.'});assert.equal(calls.length,2);assert.equal(calls[1].url,'https://api.groq.com/openai/v1/chat/completions');assert.equal(calls[1].options.headers.Authorization,'Bearer '+env.GROQ_API_KEY);assert.ok(!calls[1].options.headers['x-goog-api-key']);assert.ok(!calls[0].options.headers.Authorization);assert.equal(calls[1].body.model,'qwen/qwen3.8-27b');assert.match(calls[1].body.messages[0].content,new RegExp(name));assert.equal(calls[1].body.messages[2].role,'assistant');assert.equal(calls[1].body.messages.at(-1).content[1].image_url.url,png);assert.equal(calls[1].body.reasoning_format,'hidden');assert.ok(!JSON.stringify(answer).includes('test-key'));
}
// Honour Retry-After and return to Gemini after the cooldown, without sleeping.
let clock=100000,recovered=false;const urls=[];const cooldown=createSwingoGenerator({env,now:()=>clock,fetchImpl:async url=>{urls.push(url);return url.includes('groq.com')?goodGroq:recovered?goodGemini:{ok:false,status:429,headers:new Headers({'retry-after':'120'})};}});
const input=parseSwingoInput({question:'What is quartz?'});
await cooldown.generate(input,'Instructions');await cooldown.generate(input,'Instructions');assert.equal(urls.filter(url=>url.includes('googleapis')).length,1);clock+=120001;recovered=true;assert.equal((await cooldown.generate(input,'Instructions')).answer,'Gemini recovered.');
// Overload can try the secondary Gemini model, then Groq; network failures go directly to Groq.
for(const failure of ['overload','network','timeout']){const calls=[];const client=createSwingoGenerator({env,fetchImpl:async url=>{calls.push(url);if(url.includes('groq.com'))return goodGroq;if(failure==='network')throw Error('secret upstream details');if(failure==='timeout')throw Object.assign(Error('timeout'),{name:'TimeoutError'});return {ok:false,status:503};}});assert.equal((await client.generate(input,'Instructions')).answer,'A concise answer.');assert.equal(calls.length,failure==='overload'?3:2);}
// Never bypass input/authentication failures or provider safety refusals.
for(const response of [{ok:false,status:403},{ok:true,status:200,json:async()=>({promptFeedback:{blockReason:'SAFETY'}})}]){let calls=0;const client=createSwingoGenerator({env,fetchImpl:async()=>{calls++;return response;}});await assert.rejects(client.generate(input,'Instructions'),error=>[503,422].includes(error.status));assert.equal(calls,1);}
const groqOnly=createSwingoGenerator({env:{GROQ_API_KEY:'private-groq-test-key'},fetchImpl:async url=>{assert.ok(url.includes('groq.com'));return goodGroq;}});assert.equal(groqOnly.configured(),true);assert.equal((await groqOnly.generate(input,'Instructions')).answer,'A concise answer.');
const allLimited=createSwingoGenerator({env,fetchImpl:async()=>({ok:false,status:429})});await assert.rejects(allLimited.generate(input,'Instructions'),{status:429});await assert.rejects(allLimited.generate(input,'Instructions'),{status:429});
console.log('Provider checks passed: Gemini-to-Groq text/image failover, EN/FR/AR prompts, isolated credentials, cooldown/recovery, outages/timeouts, Groq-only operation, safety refusal preservation and bounded quota failures.');
