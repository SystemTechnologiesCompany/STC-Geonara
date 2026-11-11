import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const folder=new URL('../assets/patterns/',import.meta.url);mkdirSync(folder,{recursive:true});
const svg=(width,height,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none">${body}</svg>`;
// Contours of an original synthetic terrain: actual equal-height isolines, not overlapping rings.
const w=960,h=600,step=8;
const height=(x,y)=>1.35*Math.exp(-((x-265)**2/32000+(y-200)**2/17000))+1.05*Math.exp(-((x-705)**2/25000+(y-410)**2/21000))-.55*Math.exp(-((x-540)**2/43000+(y-180)**2/15000))+.14*Math.sin(x/75)*Math.cos(y/90);
let paths='';
for(let level=-.4,index=0;level<=1.4;level+=.075,index++){
 let path='';
 for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){
  const points=[[x,y],[x+step,y],[x+step,y+step],[x,y+step]];const values=points.map(([px,py])=>height(px,py));const cuts=[];
  for(let edge=0;edge<4;edge++){const next=(edge+1)%4;if((values[edge]>=level)===(values[next]>=level))continue;const f=(level-values[edge])/(values[next]-values[edge]);cuts.push([points[edge][0]+f*(points[next][0]-points[edge][0]),points[edge][1]+f*(points[next][1]-points[edge][1])]);}
  if(cuts.length===4&&height(x+step/2,y+step/2)>=level)cuts.push(cuts.shift());
  for(let i=0;i+1<cuts.length;i+=2)path+=`M${cuts[i][0].toFixed(1)} ${cuts[i][1].toFixed(1)}L${cuts[i+1][0].toFixed(1)} ${cuts[i+1][1].toFixed(1)}`;
 }
 paths+=`<path d="${path}" stroke="black" stroke-width="${index%4===0?2.1:.9}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
let grid='';for(let x=60;x<w;x+=120)for(let y=60;y<h;y+=120)grid+=`<path d="M${x-4} ${y}h8M${x} ${y-4}v8"/>`;
writeFileSync(new URL('contour-field.svg',folder),svg(w,h,paths+`<g stroke="black" stroke-width=".8" opacity=".65">${grid}</g>`));
writeFileSync(new URL('sandstone.svg',folder),svg(48,48,'<g fill="black"><circle cx="7" cy="8" r="1.2"/><circle cx="30" cy="5" r="1"/><circle cx="18" cy="23" r="1.2"/><circle cx="40" cy="28" r="1.1"/><circle cx="5" cy="39" r="1"/><circle cx="28" cy="43" r="1.2"/></g>'));
writeFileSync(new URL('shale.svg',folder),svg(56,40,'<path d="M2 5h17m9 0h24M8 15h22m9 0h14M1 25h15m10 0h25M9 35h24m9 0h12" stroke="black" stroke-width="1.3" stroke-linecap="round"/>'));
writeFileSync(new URL('limestone.svg',folder),svg(64,40,'<path d="M0 0h64M0 20h64M0 40h64M16 0v20m32-20v20M0 20v20m32-20v20m32-20v20" stroke="black" stroke-width="1.1"/>'));
writeFileSync(new URL('basement.svg',folder),svg(40,40,'<path d="m-5 18 18-18m-7 34L34 6m-12 35 19-19M4 8l5 5m10 6 5 5m9 9 5 5" stroke="black" stroke-width="1.1"/>'));
let crystals='';
for(const [x,y,size,lean] of [[75,120,.65,-15],[180,62,1,0],[305,25,1.25,12],[425,100,.85,18],[510,155,.5,25]]){
 crystals+=`<g transform="translate(${x} ${y}) rotate(${lean}) scale(${size})"><path d="M0 40 25 0 50 40v115l-25 25-25-25Z"/><path d="m0 40 25 15 25-15M25 0v180m-25-25 25-15 25 15" stroke-width="1"/></g>`;
}
writeFileSync(new URL('mineral-facets.svg',folder),svg(620,290,`<g stroke="black" stroke-width="2" stroke-linejoin="round">${crystals}</g>`));
let folds='';
const faultDistance=([x,y])=>x-(349+(y-20)*81/260);
function trimAtFault(points,left){
 const result=[];
 for(let i=0;i<points.length;i++){
  const point=points[i],distance=faultDistance(point),inside=left?distance<=0:distance>=0;
  if(i){const previous=points[i-1],previousDistance=faultDistance(previous),previousInside=left?previousDistance<=0:previousDistance>=0;
   if(inside!==previousInside){const fraction=previousDistance/(previousDistance-distance);result.push([previous[0]+fraction*(point[0]-previous[0]),previous[1]+fraction*(point[1]-previous[1])]);}
  }
  if(inside)result.push(point);
 }
 return result;
}
for(let layer=0;layer<15;layer++){
 const points=[];for(let x=0;x<=720;x+=6){const y=57+layer*11+29*Math.sin(x/100)+14*Math.sin(x/49);points.push([x,y]);}
 const left=trimAtFault(points,true),right=trimAtFault(points.map(([x,y])=>[x,y+19]),false);
 if(Math.abs(faultDistance(left.at(-1)))>1e-6||Math.abs(faultDistance(right[0]))>1e-6)throw Error('Rock beds must end on the fault plane.');
 const d=part=>part.map(([x,y],index)=>`${index?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
 folds+=`<path d="${d(left)+d(right)}" stroke-width="${layer%4===0?2.5:1.1}"/>`;
}
writeFileSync(new URL('folded-beds.svg',folder),svg(720,300,`<g stroke="black" stroke-linejoin="round">${folds}<path d="M349 20 430 280" stroke-width="2.1" stroke-dasharray="8 5"/></g>`));
writeFileSync(new URL('field-compass.svg',folder),svg(300,300,'<g stroke="black"><circle cx="150" cy="150" r="112" stroke-width="1"/><circle cx="150" cy="150" r="97" stroke-width=".7" stroke-dasharray="1 10"/><path d="m150 25 16 109 109 16-109 16-16 109-16-109-109-16 109-16Z" stroke-width="1.5"/><path d="m150 25 16 109-16 16-16-16Zm125 125-109 16-16-16 16-16Z" fill="black" stroke="none"/><path d="m77 77 57 57m32 32 57 57m0-146-57 57m-32 32-57 57" stroke-width="1"/><circle cx="150" cy="150" r="6" fill="black"/></g>'));
writeFileSync(new URL('drainage-network.svg',folder),svg(620,310,'<g stroke="black" stroke-linecap="round" stroke-linejoin="round"><path d="M590 290C545 263 547 218 503 191S433 158 407 117 376 70 351 20" stroke-width="2.6"/><path d="M504 192C466 213 426 202 392 183S321 156 284 169M435 153C471 122 482 93 467 53M399 107C358 112 326 85 299 61M546 242C576 211 587 187 575 158M392 183C389 151 367 137 340 132M327 168C300 133 277 114 243 107M466 123C501 117 532 90 536 65M357 94C355 58 339 41 316 30M426 202C407 232 386 239 364 254M548 269C511 289 490 295 458 291" stroke-width="1.4"/><path d="M304 164c-34 14-54 10-79 1m45-48c2-28-10-45-31-58m155 91c18-27 11-44 2-59m91 40c15 6 35 4 53-10m-163 105c-25-5-47 0-61 18m-13-164c-24 3-40-2-59-15m300 110c18 1 35-9 45-28" stroke-width=".9"/></g>'));
// External file:// mask images are blocked by browsers. Embedded images work for
// the supported double-click-index.html workflow as well as hosted previews.
// The supplied gateway icon becomes a branching community connection tree.
const nodes=[[80,180,0],[250,90,1],[250,270,1],[430,45,1],[430,135,1],[430,225,1],[430,315,1],[620,24,0],[620,70,0],[670,112,0],[620,157,0],[620,203,0],[670,248,0],[620,290,0],[620,336,0]];
const edges=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[3,8],[4,9],[4,10],[5,11],[5,12],[6,13],[6,14]];
let network=edges.map(([a,b])=>{const [x,y]=nodes[a],[xx,yy]=nodes[b];return `<path d="M${x+12} ${y}C${(x+xx)/2} ${y} ${(x+xx)/2} ${yy} ${xx-12} ${yy}"/>`;}).join('');
network+=nodes.map(([x,y,gateway])=>gateway?`<rect x="${x-11}" y="${y-11}" width="22" height="22" rx="6"/><circle cx="${x}" cy="${y}" r="2" fill="black" stroke="none"/>`:`<circle cx="${x}" cy="${y}" r="11"/><circle cx="${x}" cy="${y}" r="3" fill="black" stroke="none"/>`).join('');
writeFileSync(new URL('connection-tree.svg',folder),svg(720,360,`<g stroke="black" stroke-width="1.8" stroke-linecap="round">${network}</g>`));
const names=['contour-field','sandstone','shale','limestone','basement','mineral-facets','folded-beds','field-compass','drainage-network','connection-tree'];
const variables=names.map(name=>`--pattern-${name}:url("data:image/svg+xml,${encodeURIComponent(readFileSync(new URL(name+'.svg',folder),'utf8'))}");`).join('\n');
writeFileSync(new URL('../pattern-assets.css',import.meta.url),`/* Generated embedded masks for direct-file and HTTP use. */\n:root{\n${variables}\n}\n`);
console.log('Created geological and community SVGs with direct-file-compatible embedded masks.');
