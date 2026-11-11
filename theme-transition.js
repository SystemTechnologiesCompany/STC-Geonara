'use strict';

const themeReveal={
 busy:false,
 geometry(rect,width,height){
  const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
  return {x,y,radius:Math.ceil(Math.hypot(Math.max(x,width-x),Math.max(y,height-y)))+2};
 },
 async toggle(button,theme,apply){
  if(this.busy)return;
  if(!document.startViewTransition||matchMedia('(prefers-reduced-motion: reduce)').matches){apply();return;}
  this.busy=true;
  const root=document.documentElement;
  const {x,y,radius}=this.geometry(button.getBoundingClientRect(),innerWidth,innerHeight);
  const dark=theme==='dark';let transition,applied=false;
  const update=()=>{if(!applied){apply();applied=true;}};
  root.dataset.themeReveal=dark?'expand':'contract';
  root.style.setProperty('--theme-reveal-x',x+'px');
  root.style.setProperty('--theme-reveal-y',y+'px');
  root.style.setProperty('--theme-reveal-radius',radius+'px');
  root.classList.add('theme-revealing');
  button.setAttribute('aria-busy','true');
  try{
   transition=document.startViewTransition(update);
   // A skipped transition may reject ready while finished still resolves.
   transition.finished.catch(()=>{});
   await transition.ready;
   await transition.finished;
  }catch{
   transition?.skipTransition();update();
  }finally{
   delete root.dataset.themeReveal;
   root.classList.remove('theme-revealing');
   for(const property of ['--theme-reveal-x','--theme-reveal-y','--theme-reveal-radius'])root.style.removeProperty(property);
   button.removeAttribute('aria-busy');
   this.busy=false;
  }
 }
};
