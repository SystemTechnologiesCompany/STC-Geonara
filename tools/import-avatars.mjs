import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const sandbox=vm.createContext({});
const catalogue=readFileSync(new URL('avatars.js',root),'utf8');
vm.runInContext(catalogue+';globalThis.choices=profileAvatarChoices;',sandbox);
const choices=Array.from(sandbox.choices,choice=>({...choice}));
const digest=body=>createHash('sha256').update(body).digest('hex');
const files=readdirSync(root).filter(name=>/^account-avatar.*\.svg$/i.test(name)).sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
const known=new Set(choices.map(choice=>digest(readFileSync(new URL(choice.source,root)))));
for(const source of files){
 const hash=digest(readFileSync(new URL(source,root)));
 if(known.has(hash))continue;
 known.add(hash);
 const number=choices.length+1;
 choices.push({id:`avatar-${String(number).padStart(2,'0')}`,src:`assets/avatars/avatar-${String(number).padStart(2,'0')}.svg`,label:`Avatar ${number}`,source});
}
const palette=['#cbd7ba','#c1d5cc','#d9ccb2','#c8d4d4','#d2d3bc','#d5c6b8','#c5d6be','#cec9d6'];
for(const [index,choice] of choices.entries()){
 let svg=readFileSync(new URL(choice.source,root),'utf8');
 if(/<script|<foreignObject|\bon\w+\s*=|(?:href|xlink:href)\s*=/i.test(svg))throw new Error(`Unsupported SVG content: ${choice.source}`);
 let background=palette[index%palette.length];
 try{background=readFileSync(new URL(choice.src,root),'utf8').match(/<circle\b(?=[^>]*\br="30\.8999")[^>]*\bfill="([^"]+)"/)?.[1]||background;}catch{}
 svg=svg.replace(/<\?xml[^>]*\?>/g,'').replace(/<!--[\s\S]*?-->/g,'').replace(/<title\s*\/>|<title>[\s\S]*?<\/title>/g,'').replace(/\sdata-name="[^"]*"/g,'');
 // Keep definition IDs: removing these breaks clipping, masks, and gradients.
 svg=svg.replace(/<svg\b[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.7998 61.7998" width="128" height="128">');
 svg=svg.replace(/<circle\b(?=[^>]*\br="30\.8999")[^>]*>/,tag=>tag.replace(/fill="[^"]*"/,`fill="${background}"`));
 writeFileSync(new URL(choice.src,root),`<!-- Adapted from ${choice.source} (SVG Repo). Original artwork and clipping preserved; background matched to STC Geonara. -->\n${svg.trim()}\n`);
}
writeFileSync(new URL('avatars.js',root),catalogue.replace(/const profileAvatarChoices=\[[\s\S]*?\n\];/,`const profileAvatarChoices=${JSON.stringify(choices,null,2)};`));
console.log(`Imported ${choices.length} unique avatars from ${files.length} supplied files. Original files preserved.`);
