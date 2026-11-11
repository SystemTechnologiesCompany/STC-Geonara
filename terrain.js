'use strict';

const terrainMath={
 height(x,y){
  const peak=(cx,cy,width,amplitude)=>amplitude*Math.exp(-((x-cx)**2+(y-cy)**2)/width);
  return peak(0,-35,30000,175)+peak(130,55,10000,105)+peak(-120,100,12500,75)+15*Math.sin(x*.024+y*.012)*Math.cos(y*.02);
 },
 point(x,y){return {x:450+(x-y)*.82,y:300+(x+y)*.29-this.height(x,y),phase:x*.016+y*.011,crossPhase:y*.024-x*.008,envelope:Math.cos(x/500*Math.PI)*Math.cos(y/500*Math.PI)};},
 ambient(point,time){const phase=time/12*Math.PI*2;return point.envelope*(27*Math.sin(point.phase-phase)+10*Math.sin(point.crossPhase+phase*2));},
 pointerWave(distance,time,strength,pressed=false){return strength*(pressed?1.5:1)*Math.exp(-distance*distance/12500)*(34*Math.cos(distance*.026-time*2.7)+15);},
 ripple(distance,age){return age<0||age>2.2?0:15*Math.sin(distance*.046-age*8)*Math.exp(-((distance-age*135)**2)/4500)*Math.exp(-age*1.5);}
};

function initInteractiveTerrain(hero){
 if(!hero)return ()=>{};
 const scene=hero.querySelector('.terrain-scene');
 const canvas=document.createElement('canvas');
 const context=canvas.getContext('2d');
 if(!scene||!context)return ()=>{};
 canvas.className='terrain-canvas';canvas.setAttribute('aria-hidden','true');
 const backdrop=document.createElement('img');
 backdrop.className='terrain-backdrop';backdrop.src='assets/terrain-backdrop.svg';backdrop.alt='';
 scene.prepend(backdrop,canvas);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const lines=[];
 for(let y=-240;y<=240;y+=8){const points=[];for(let x=-250;x<=250;x+=5)points.push(terrainMath.point(x,y));lines.push({points,color:y>100?'#999b6b':'#cac39a',alpha:.24+(y+240)/1500,width:1});}
 for(let x=-250;x<=250;x+=16){const points=[];for(let y=-240;y<=240;y+=5)points.push(terrainMath.point(x,y));lines.push({points,color:'#999b6b',alpha:.14,width:.7});}
 const pointer={x:450,y:300,targetX:450,targetY:300,strength:0,targetStrength:0,pressed:false};
 let frame=0,visible=true,disposed=false,lastFrame=0,lastTrail=0,rect,scale=1,offsetX=0,offsetY=0,pixelRatio=1;
 let ripples=[];
 const start=performance.now();
 const isControl=target=>target instanceof Element&&Boolean(target.closest('a,button,input,select,textarea'));
 function resize(){
  rect=scene.getBoundingClientRect();
  pixelRatio=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(rect.width*pixelRatio));canvas.height=Math.max(1,Math.round(rect.height*pixelRatio));
  // Match the SVG's object-fit: cover at desktop and mobile sizes, including RTL.
  scale=Math.max(rect.width/800,rect.height/620);
  offsetX=(rect.width-800*scale)/2;offsetY=(rect.height-620*scale)/2;
 }
 function move(event){
  if(reduced.matches||isControl(event.target)){pointer.targetStrength=0;return;}
  rect=scene.getBoundingClientRect();
  const x=(event.clientX-rect.left-offsetX)/scale,y=(event.clientY-rect.top-offsetY)/scale;
  if(x<0||x>800||y<0||y>620){pointer.targetStrength=0;return;}
  const now=performance.now();
  pointer.targetX=x;pointer.targetY=y;pointer.targetStrength=1;
  if(!pointer.strength){pointer.x=x;pointer.y=y;}
  if(now-lastTrail>85){ripples.push({x,y,time:(now-start)/1000});ripples=ripples.slice(-6);lastTrail=now;}
 }
 function leave(){pointer.targetStrength=0;pointer.pressed=false;}
 function down(event){if(isControl(event.target))return;move(event);pointer.pressed=true;}
 function up(){pointer.pressed=false;}
 function draw(now){
  frame=0;
  if(disposed||reduced.matches||document.hidden||!visible)return;
  const delta=Math.min((now-lastFrame)/1000||1/60,.05),time=(now-start)/1000;
  lastFrame=now;
  const ease=1-Math.exp(-delta*13);
  pointer.x+=(pointer.targetX-pointer.x)*ease;pointer.y+=(pointer.targetY-pointer.y)*ease;
  pointer.strength+=(pointer.targetStrength-pointer.strength)*ease;
  ripples=ripples.filter(r=>time-r.time<2.2);
  context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,canvas.width,canvas.height);
  context.setTransform(pixelRatio*scale,0,0,pixelRatio*scale,pixelRatio*offsetX,pixelRatio*offsetY);
  for(const line of lines){
   context.beginPath();context.strokeStyle=line.color;context.globalAlpha=line.alpha;context.lineWidth=line.width;
   for(let i=0;i<line.points.length;i++){
    const point=line.points[i];const restY=point.y-terrainMath.ambient(point,time);let y=restY;
    if(pointer.strength>.002)y-=terrainMath.pointerWave(Math.hypot(point.x-pointer.x,y-pointer.y),time,pointer.strength,pointer.pressed);
    for(const ripple of ripples)y-=terrainMath.ripple(Math.hypot(point.x-ripple.x,restY-ripple.y),time-ripple.time);
    if(i===0)context.moveTo(point.x,y);else context.lineTo(point.x,y);
   }
   context.stroke();
  }
  frame=requestAnimationFrame(draw);
 }
 function update(){
  if(frame){cancelAnimationFrame(frame);frame=0;}
  scene.classList.toggle('is-interactive',!reduced.matches);
  if(!reduced.matches&&!document.hidden&&visible&&!disposed){lastFrame=performance.now();frame=requestAnimationFrame(draw);}
 }
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(scene);
 const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)leave();update();});visibilityObserver.observe(hero);
 hero.addEventListener('pointermove',move);hero.addEventListener('pointerdown',down);hero.addEventListener('pointerleave',leave);hero.addEventListener('pointercancel',leave);
 window.addEventListener('pointerup',up);document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);
 resize();update();
 return ()=>{
  disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();visibilityObserver.disconnect();
  hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerdown',down);hero.removeEventListener('pointerleave',leave);hero.removeEventListener('pointercancel',leave);
  window.removeEventListener('pointerup',up);document.removeEventListener('visibilitychange',update);reduced.removeEventListener('change',update);
  scene.classList.remove('is-interactive');canvas.remove();backdrop.remove();
 };
}
