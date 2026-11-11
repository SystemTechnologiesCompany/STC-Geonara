import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import team from '../stc-team.json' with {type:'json'};
import {stcTeamContext,stcTeamSource} from './stc-team.mjs';
import {createSwingo} from './swingo.mjs';
assert.equal(team.source,'https://stc-official.netlify.app/our-team');
assert.equal(team.members.filter(member=>member.category==='core').length,5);
assert.equal(team.members.filter(member=>member.category==='honorable').length,5);
assert.equal(new Set(team.members.map(member=>member.name.en)).size,10);
assert.equal(team.members.find(member=>member.role.en==='President & Founder').name.en,'Abd Essatar Belkharchouche');
assert.equal(team.members.find(member=>member.role.en==='Vice President').name.ar,'منذر بن مداسي');
for(const member of team.members){assert.ok(member.name.en&&member.name.ar&&member.role.en&&member.role.ar&&member.description);assert.ok(new URL(member.publicProfile).protocol==='https:');}
assert.equal(stcTeamContext('Explain basalt and porosity.'),'');
for(const question of ['Who founded STC?','Qui est le président de STC ?','من هو مؤسس STC؟'])assert.ok(stcTeamContext(question).includes('Abd Essatar Belkharchouche'));
assert.ok(stcTeamContext('Tell me about Haitham').includes('Krid Mohamed Haitham Nour El Yakine'));assert.ok(stcTeamContext('من هو نزيم ميلي؟').includes('Nazim Mili'));assert.ok(!stcTeamContext('Who is the founder of STC?').includes('Nazim Mili'));
assert.ok(stcTeamContext('What does he do?',[{parts:[{text:'Who is STC’s vice president?'}]}]).includes('Mounder Benmadassi'));
let captured;const client=createSwingo({root:fileURLToPath(new URL('../',import.meta.url)),env:{GROQ_API_KEY:'mock-key'},fetchImpl:async(_url,options)=>{captured=JSON.parse(options.body);return {ok:true,status:200,json:async()=>({choices:[{message:{content:'The verified team answer.'}}]})};}});
for(const language of ['en','fr','ar']){const response=await client.answer({question:'Who is on the STC team?',language,mode:'auto'},language);assert.deepEqual(response.sources,[stcTeamSource]);assert.ok(captured.messages[0].content.includes('عبد الستار بلخرشوش'));assert.ok(captured.messages[0].content.includes('Business Development & Partnerships'));assert.ok(captured.messages[0].content.includes('do not invent separate Geonara positions'));}
console.log('STC team checks passed: official EN/AR roster, 5 core and 5 honorable members, exact roles, relevant follow-up context, EN/FR/AR prompts, source attribution and Groq integration.');
