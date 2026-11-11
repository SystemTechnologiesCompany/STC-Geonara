// Explicit opt-in smoke check. Sends three short prompts and one synthetic image to Gemini.
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {deflateSync,crc32} from 'node:zlib';
import {createSwingo} from './swingo.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const key=process.env.GEMINI_API_KEY||(await readFile(new URL('../.data/gemini-api-key.txt',import.meta.url),'utf8')).trim();
if(!key)throw Error('Save the Gemini key privately before running this check.');
const chunk=(type,data)=>{const label=Buffer.from(type),result=Buffer.alloc(data.length+12);result.writeUInt32BE(data.length);label.copy(result,4);data.copy(result,8);result.writeUInt32BE(crc32(Buffer.concat([label,data])),data.length+8);return result;};
const header=Buffer.alloc(13);header.writeUInt32BE(96,0);header.writeUInt32BE(96,4);header[8]=8;header[9]=2;const rows=[];
for(let y=0;y<96;y++){const row=Buffer.alloc(289);const color=y<32?[203,184,138]:y<64?[151,116,77]:[88,107,91];for(let x=0;x<96;x++)for(let i=0;i<3;i++)row[1+x*3+i]=color[i];rows.push(row);}
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(Buffer.concat(rows))),chunk('IEND',Buffer.alloc(0))]);
const backup=process.argv.includes('--groq-backup');
const groqKey=backup?(process.env.GROQ_API_KEY||(await readFile(new URL('../.data/groq-api-key.txt',import.meta.url),'utf8')).trim()):'';
if(backup&&!groqKey)throw Error('Save the Groq key privately before running the backup check.');
const onlyLanguage=process.argv.find(value=>/^--language=(en|fr|ar)$/.test(value))?.split('=')[1];
const client=createSwingo({root,env:{...process.env,GEMINI_API_KEY:key,...(backup?{GROQ_API_KEY:groqKey}:{})},fetchImpl:backup?(url,options)=>url.includes('generativelanguage.googleapis.com')?Promise.resolve(new Response('{}',{status:429,headers:{'retry-after':'60'}})):fetch(url,options):fetch});
for(const [language,question,mode,image] of [
 ['en','Explain porosity in one short sentence.','auto',undefined],
 ['fr','Décris uniquement les couleurs et les couches visibles, en une phrase.','diagram','data:image/png;base64,'+png.toString('base64')],
 ['ar','كيف أبحث عن عضو في Geonara؟ جملة واحدة فقط.','platform',undefined]
]){if(onlyLanguage&&language!==onlyLanguage)continue;try{const result=await client.answer({language,question,mode,image},'configuration-check-'+language);console.log(language+': '+result.answer);}catch(error){console.error(language+': '+error.status+' '+error.message);process.exitCode=1;break;}}
