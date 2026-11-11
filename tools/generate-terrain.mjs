import {writeFile} from 'node:fs/promises';
// Deterministic, local vector artwork: no downloaded assets or image dependencies.
const paths=[];
const animatedPaths=[];
const project=(x,y,z)=>[450+(x-y)*.82,300+(x+y)*.29-z];
const height=(x,y)=>{
 const peak=(cx,cy,width,amplitude)=>amplitude*Math.exp(-((x-cx)**2+(y-cy)**2)/width);
 return peak(0,-35,30000,175)+peak(130,55,10000,105)+peak(-120,100,12500,75)+15*Math.sin(x*.024+y*.012)*Math.cos(y*.02);
};
// Both line directions share the same displacement so the mesh stays connected.
const pointAt=(x,y,phase)=>{
 const envelope=Math.cos(x/500*Math.PI)*Math.cos(y/500*Math.PI);
 const wave=envelope*(27*Math.sin(x*.016+y*.011-phase)+10*Math.sin(y*.024-x*.008+phase*2));
 return project(x,y,height(x,y)+wave).map(n=>n.toFixed(1)).join(',');
};
function addLine(coordinates,attributes){
 const points=coordinates.map(([x,y])=>pointAt(x,y,0)).join(' ');
 paths.push(`<polyline points="${points}" ${attributes}/>`);
 const frames=Array.from({length:25},(_,i)=>coordinates.map(([x,y])=>pointAt(x,y,i%24/24*Math.PI*2)).join(' '));
 animatedPaths.push(`<polyline points="${points}" ${attributes}><animate attributeName="points" dur="12s" repeatCount="indefinite" values="${frames.join(';')}"/></polyline>`);
}
for(let y=-240;y<=240;y+=8){const coordinates=[];for(let x=-250;x<=250;x+=5)coordinates.push([x,y]);addLine(coordinates,`fill="none" stroke="${y>100?'#8ba276':'#bad29a'}" stroke-opacity="${(.24+(y+240)/1500).toFixed(2)}" stroke-width="1"`);}
for(let x=-250;x<=250;x+=16){const coordinates=[];for(let y=-240;y<=240;y+=5)coordinates.push([x,y]);addLine(coordinates,'fill="none" stroke="#a8ca85" stroke-opacity=".14" stroke-width=".7"');}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 620"><defs><radialGradient id="glow"><stop stop-color="#9ab781" stop-opacity=".18"/><stop offset="1" stop-color="#9ab781" stop-opacity="0"/></radialGradient></defs><ellipse cx="465" cy="260" rx="340" ry="270" fill="url(#glow)"/><g fill="none" stroke="#adca92" stroke-opacity=".12"><circle cx="450" cy="295" r="215"/><circle cx="450" cy="295" r="262" stroke-dasharray="2 8"/><ellipse cx="450" cy="390" rx="350" ry="120"/></g>${paths.join('')}<g fill="none" stroke="#d1e7b6" stroke-width="1"><circle cx="435" cy="149" r="5"/><circle cx="435" cy="149" r="13" opacity=".35"/><path d="M435 136V97h62" opacity=".5"/><path d="M194 382v50h-40M650 339h38v-45" opacity=".4"/></g><g font-family="monospace" font-size="8" fill="#c5d7b5" opacity=".65"><text x="504" y="100">SURFACE / 001</text><text x="110" y="450">DEEPER PERSPECTIVES</text><text x="620" y="280">EXPLORE THE UNKNOWN</text></g><g fill="#c6d8b6"><circle cx="194" cy="382" r="3"/><circle cx="650" cy="339" r="3"/></g></svg>`;
await writeFile(new URL('../assets/terrain.svg',import.meta.url),svg);
await writeFile(new URL('../assets/terrain-waves.svg',import.meta.url),svg.replace(paths.join(''),animatedPaths.join('')));
await writeFile(new URL('../assets/terrain-backdrop.svg',import.meta.url),svg.replace(paths.join(''),''));
