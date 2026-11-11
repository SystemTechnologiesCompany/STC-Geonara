'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORAGE_KEY = 'stc_geonara_v2';
let activeStorageKey=STORAGE_KEY;
const defaults = () => ({profile:{avatarId:randomAvatarId(),photo:'',name:'Earth explorer',title:'Geology enthusiast',specialization:'Earth Sciences',interests:'',about:''},saved:[],messages:{},chat:[]});
function readState(key=STORAGE_KEY){try{const raw=JSON.parse(localStorage.getItem(key)||'null');const base=defaults();if(!raw||typeof raw!=='object')return base;return {...base,profile:withDefaultAvatar({...base.profile,...(raw.profile&&typeof raw.profile==='object'?raw.profile:{})}),saved:Array.isArray(raw.saved)?raw.saved.filter(x=>typeof x==='string'):[],messages:raw.messages&&typeof raw.messages==='object'&&!Array.isArray(raw.messages)?raw.messages:{},chat:Array.isArray(raw.chat)?raw.chat.filter(m=>m&&['me','bot'].includes(m.from)&&typeof m.text==='string'):[]};}catch{return defaults();}}
let disposeTerrain=()=>{};
let disposeGlassCards=()=>{};
let state=readState();let currentPage='home';let activeContact='';let aiBusy=false;let toastTimer;
function persist(){try{localStorage.setItem(activeStorageKey,JSON.stringify(state));if(typeof queueAccountSave==='function')queueAccountSave();return true;}catch{toast("Couldn't save changes.");return false;}}
function toast(message){$('.toast').textContent=t(message);$('.toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').classList.remove('visible'),3800);}
function initials(name){return String(name).trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'G';}
const icons={"book":"<svg class=\"site-icon site-icon--filled\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><path opacity=\"0.4\" d=\"M12 5.30019V21.3302C12.17 21.3302 12.35 21.3002 12.49 21.2202L12.53 21.2002C14.45 20.1502 17.8 19.0502 19.97 18.7602L20.26 18.7202C21.22 18.6002 22 17.7002 22 16.7402V4.66018C22 3.47018 21.03 2.57019 19.84 2.67019C17.74 2.84019 14.56 3.90022 12.78 5.01022L12.53 5.16018C12.38 5.25018 12.19 5.30019 12 5.30019Z\" fill=\"currentColor\"/> <path d=\"M2 4.67002V16.74C2 17.7 2.77999 18.6 3.73999 18.72L4.07001 18.76C6.25001 19.05 9.61003 20.16 11.53 21.22C11.66 21.3 11.82 21.3301 12 21.3301V5.30002C11.81 5.30002 11.62 5.25001 11.47 5.16001L11.3 5.05002C9.51999 3.93002 6.32998 2.86003 4.22998 2.68003H4.16998C2.97998 2.58003 2 3.47002 2 4.67002Z\" fill=\"currentColor\"/> <path d=\"M19 2.78027V7.07025C19 7.47025 18.56 7.71023 18.22 7.49023L17 6.68024L15.78 7.49023C15.45 7.71023 15 7.47025 15 7.07025V3.92023C16.31 3.40023 17.77 2.98027 19 2.78027Z\" fill=\"currentColor\"/></svg>","research":"<svg class=\"site-icon site-icon--filled\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.034,18.069a7.982,7.982,0,0,0,3.939-1.035l3.332,3.332a2.164,2.164,0,0,0,3.061-3.061L17.031,13.97a8.026,8.026,0,1,0-7,4.1ZM5.768,5.768A6.033,6.033,0,1,1,4,10.035,5.988,5.988,0,0,1,5.768,5.768Zm-.7,4.267a1.015,1.015,0,0,1,1-1.018.985.985,0,0,1,1,.983v.035A2.968,2.968,0,0,0,10.035,13a1,1,0,0,1,0,2A4.972,4.972,0,0,1,5.069,10.035Z\"/></svg>","ai":"<svg class=\"site-icon site-icon--filled\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><g> <g > <polygon fill=\"currentColor\" fill-rule=\"evenodd\" points=\"16.64 15.13 17.38 13.88 20.91 13.88 22 12 19.82 8.25 16.75 8.25 15.69 6.39 14.5 6.39 14.5 5.13 16.44 5.13 17.5 7 19.09 7 16.9 3.25 12.63 3.25 12.63 8.25 14.36 8.25 15.09 9.5 12.63 9.5 12.63 12 14.89 12 15.94 10.13 18.75 10.13 19.47 11.38 16.67 11.38 15.62 13.25 12.63 13.25 12.63 17.63 16.03 17.63 15.31 18.88 12.63 18.88 12.63 20.75 16.9 20.75 20.18 15.13 18.09 15.13 17.36 16.38 14.5 16.38 14.5 15.13 16.64 15.13\"/> <polygon fill=\"currentColor\" fill-rule=\"evenodd\" opacity=\"0.55\" points=\"7.36 15.13 6.62 13.88 3.09 13.88 2 12 4.18 8.25 7.25 8.25 8.31 6.39 9.5 6.39 9.5 5.13 7.56 5.13 6.5 7 4.91 7 7.1 3.25 11.38 3.25 11.38 8.25 9.64 8.25 8.91 9.5 11.38 9.5 11.38 12 9.11 12 8.06 10.13 5.25 10.13 4.53 11.38 7.33 11.38 8.38 13.25 11.38 13.25 11.38 17.63 7.97 17.63 8.69 18.88 11.38 18.88 11.38 20.75 7.1 20.75 3.82 15.13 5.91 15.13 6.64 16.38 9.5 16.38 9.5 15.13 7.36 15.13\"/> </g> </g></svg>","messages":"<svg class=\"site-icon site-icon--filled\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.19 6H6.79C6.53 6 6.28 6.01 6.04 6.04C3.35 6.27 2 7.86 2 10.79V14.79C2 18.79 3.6 19.58 6.79 19.58H7.19C7.41 19.58 7.7 19.73 7.83 19.9L9.03 21.5C9.56 22.21 10.42 22.21 10.95 21.5L12.15 19.9C12.3 19.7 12.54 19.58 12.79 19.58H13.19C16.12 19.58 17.71 18.24 17.94 15.54C17.97 15.3 17.98 15.05 17.98 14.79V10.79C17.98 7.6 16.38 6 13.19 6ZM6.5 14C5.94 14 5.5 13.55 5.5 13C5.5 12.45 5.95 12 6.5 12C7.05 12 7.5 12.45 7.5 13C7.5 13.55 7.05 14 6.5 14ZM9.99 14C9.43 14 8.99 13.55 8.99 13C8.99 12.45 9.44 12 9.99 12C10.54 12 10.99 12.45 10.99 13C10.99 13.55 10.55 14 9.99 14ZM13.49 14C12.93 14 12.49 13.55 12.49 13C12.49 12.45 12.94 12 13.49 12C14.04 12 14.49 12.45 14.49 13C14.49 13.55 14.04 14 13.49 14Z\" fill=\"currentColor\"/> <path d=\"M21.9802 6.79V10.79C21.9802 12.79 21.3602 14.15 20.1202 14.9C19.8202 15.08 19.4702 14.84 19.4702 14.49L19.4802 10.79C19.4802 6.79 17.1902 4.5 13.1902 4.5L7.10025 4.51C6.75025 4.51 6.51025 4.16 6.69025 3.86C7.44025 2.62 8.80025 2 10.7902 2H17.1902C20.3802 2 21.9802 3.6 21.9802 6.79Z\" fill=\"currentColor\"/></svg>","arrow":"<svg class=\"site-icon site-icon--outline\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><g> <path d=\"M18.3646 5.63623H11.2939M18.3646 5.63623L18.3643 12.7073M18.3646 5.63623L5.63672 18.3642\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> </g></svg>"};
const icon=key=>icons[key]||'';
function memberHome(){return `<div class="page"><section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="status-dot"></span> EARTH SCIENCE</span><h1>Go beneath<br>the surface.<br><em>Discover more.</em></h1><p>Geology, research, and Swingo AI.</p><div class="hero-buttons"><a class="button primary" href="#dictionary">Explore ${icon('arrow')}</a><a class="button secondary" href="#ai">Swingo AI ${icon('ai')}</a></div></div><div class="terrain-scene" aria-hidden="true"><picture><source media="(prefers-reduced-motion: reduce)" srcset="assets/terrain.svg"><img src="assets/terrain-waves.svg" alt=""></picture><div class="field-note"><span>THE BIGGER PICTURE</span><strong>4.54 billion</strong><small>years of Earth’s history.</small></div><span class="terrain-label">EVERY LAYER TELLS A STORY</span></div><div class="hero-bottom"><b>Earth science, connected.</b><a class="scroll-link" href="#explore">Your tools <span>↓</span></a></div></section><div class="marquee" aria-label="Earth science disciplines"><span>GEOLOGY</span><span>SEDIMENTOLOGY</span><span>STRATIGRAPHY</span><span>GEOCHEMISTRY</span><span>EARTH SCIENCES</span></div><section id="explore"><div class="section-heading"><div><h2>Your tools.</h2></div></div><div class="tool-grid">${[['dictionary','book','Dictionary','Explore geological terms and definitions.','Earth Science Terminology'],['research','research','Research','Browse topics. Save what matters.','Research topics'],['ai','ai','Swingo AI','Explore your geological questions.','Geology assistant']].map(card=>`<a class="tool-card" href="#${card[0]}"><span class="glass-sculpture" aria-hidden="true"><svg viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="100" rx="73" ry="40"/><ellipse cx="100" cy="100" rx="73" ry="40" transform="rotate(60 100 100)"/><ellipse cx="100" cy="100" rx="73" ry="40" transform="rotate(120 100 100)"/><circle cx="100" cy="100" r="26"/></svg></span><div class="tool-icon">${icon(card[1])}</div><div class="tool-copy"><h3>${card[2]}</h3><p>${card[3]}</p></div><div class="tool-card-foot"><small>${card[4]}</small><span class="arrow-circle" aria-hidden="true">${icon('arrow')}</span></div></a>`).join('')}</div></section>${featureHome()}<section class="discovery glass-panel" aria-labelledby="discovery-title"><div class="discovery-visual" aria-label="Illustration of sedimentary rock layers"><div class="strata"></div><div class="strata"></div><div class="strata"></div><div class="strata"></div></div><div class="discovery-copy"><span class="discovery-icon" aria-hidden="true"><svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3"><path d="m3 9 11-6 11 6-11 6L3 9Zm0 5 11 6 11-6M3 19l11 6 11-6"/></svg></span><h2 id="discovery-title">Read the layers.</h2><p>Explore the stories preserved in rock.</p><a class="text-link discovery-link" href="#dictionary?q=Stratigraphy">Explore stratigraphy <span class="arrow-circle" aria-hidden="true">${icon('arrow')}</span></a></div></section></div>`;}
function intro(eyebrow,title,description,badge=''){return `<div class="intro"><div><h1>${title}</h1><p>${description}</p></div>${badge?`<span class="badge">${badge}</span>`:''}</div>`;}
const translations={'Sedimentology':['Sédimentologie','علم الرسوبيات'],'Stratigraphy':['Stratigraphie','علم الطبقات'],'Diagenesis':['Diagenèse','التصخر'],'Porosity':['Porosité','المسامية'],'Permeability':['Perméabilité','النفاذية'],'Facies':['Faciès','السحنة'],'Lithology':['Lithologie','علم الصخور'],'Unconformity':['Discordance','عدم التوافق'],'Sequence Stratigraphy':['Stratigraphie séquentielle','الطباقية التتابعية'],'Diapirism':['Diapirisme','القباب الاختراقية'],'Alluvial Fan':['Cône alluvial','مروحة غرينية'],'Carbonate Platform':['Plateforme carbonatée','منصة كربوناتية'],'Clastic Sediment':['Sédiment détritique','رواسب فتاتية'],'Source Rock':['Roche mère','صخر المصدر'],'Reservoir Rock':['Roche réservoir','صخر الخزان']};
function dictionary(){return renderEarthDictionary();}
function research(){return researchPage();}
function bubbles(list){return list.map(m=>`<div class="bubble ${m.from==='me'?'me':'bot'}" ${m.from==='me'?'data-user-content':''} dir="auto">${escapeHTML(m.from==='bot'?(/This question has been received by the (Classic )?Swingo AI demonstration assistant/.test(m.text)?aiAnswer('unknown'):m.text.replaceAll('Classic Swingo AI','Swingo AI')):m.text)}${m.from==='bot'&&Array.isArray(m.sources)?m.sources.filter(url=>/^https:\/\/(www\.)?(nps\.gov|stratigraphy\.org|eionet\.europa\.eu|apps\.usgs\.gov|gcmd\.earthdata\.nasa\.gov|stc-official\.netlify\.app)\//.test(url)).map(url=>'<a class="assistant-source" target="_blank" rel="noopener" href="'+escapeHTML(url)+'">'+t('Read more')+' ↗</a>').join(''):''}</div>`).join('');}
function ai(){return `<div class="page">${intro('MAKE ROOM FOR CURIOSITY','Swingo AI','Explore a geological question.')}<div class="ai-layout"><aside class="ai-aside"><h3>Try a question</h3>${[['Compare rocks','Compare granite and basalt.'],['Identify a mineral','How can I recognise quartz?'],['Explore geological time','Explore geological time'],['Porosity vs permeability','What is the difference between porosity and permeability?'],['Read the rock record','Explain the main principles of stratigraphy.'],['Understand sedimentary facies','What is a sedimentary facies?'],['What happens after deposition?','Explain diagenesis.']].map(t=>`<button class="chip" data-prompt="${t[1]}">${t[0]} <span class="inline-arrow" aria-hidden="true">${icon('arrow')}</span></button>`).join('')}<button class="text-button" id="clear-chat">New conversation</button></aside><section class="chat" aria-label="Swingo AI conversation"><div class="chat-header"><span class="swingo-mark" aria-hidden="true">${icon('ai')}</span><div><h2>Swingo AI</h2><small>Geology assistant</small></div></div><div class="chat-body" id="ai-body" role="log" aria-label="Assistant messages" aria-live="polite">${state.chat.length?bubbles(state.chat):'<div class="bubble bot">Ask about a specimen, compare two rocks, or explore geological time.</div>'}</div><form class="compose" id="ai-form"><input class="field" id="ai-question" maxlength="2000" aria-label="Your geological question" placeholder="Ask a question…" autocomplete="off" required><button class="button primary" id="ai-send">Send ${icon('arrow')}</button></form></section></div></div>`;}

function validProfilePhoto(photo){return typeof photo==='string'&&photo.length<400000&&/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(photo);}
function profileAvatar(profile){
 const avatar=getProfileAvatar(profile.avatarId);
 const src=validProfilePhoto(profile.photo)?profile.photo:avatar?.src;
 return src?'<img src="'+escapeHTML(src)+'" alt="">':escapeHTML(initials(profile.name));
}
let photoSelection=0;
function syncProfilePhoto(){
 $('#profile-avatar').innerHTML=profileAvatar(state.profile);
 if($('#photo-preview'))$('#photo-preview').innerHTML=profileAvatar(state.profile);
 if($('#remove-photo'))$('#remove-photo').hidden=!validProfilePhoto(state.profile.photo);
 document.querySelectorAll('[data-avatar-id]').forEach(button=>button.setAttribute('aria-pressed',String(!validProfilePhoto(state.profile.photo)&&button.dataset.avatarId===state.profile.avatarId)));
 if($('#avatar-dialog-preview'))$('#avatar-dialog-preview').innerHTML=profileAvatar(state.profile);
}
async function prepareProfilePhoto(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG or WebP image.');
 if(file.size>10*1024*1024)throw new Error('Choose an image smaller than 10 MB.');
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();image.src=url;
  try{await image.decode();}catch{throw new Error('This image could not be opened. Try another photo.');}
  if(!image.naturalWidth||!image.naturalHeight)throw new Error('This image could not be opened. Try another photo.');
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
  const context=canvas.getContext('2d');if(!context)throw new Error('This image could not be opened. Try another photo.');
  context.fillStyle='#d6e1ca';context.fillRect(0,0,256,256);
  const size=Math.min(image.naturalWidth,image.naturalHeight);
  context.drawImage(image,(image.naturalWidth-size)/2,(image.naturalHeight-size)/2,size,size,0,0,256,256);
  return canvas.toDataURL('image/jpeg',.88);
 }finally{URL.revokeObjectURL(url);}
}
function bindPhotoPicker(){
 const input=$('#profile-photo');
 bindAvatarPicker();
 $('#choose-photo').onclick=()=>input.click();
 input.onchange=async()=>{
  const file=input.files?.[0];if(!file)return;
  const selection=++photoSelection;
  $('#choose-photo').disabled=true;$('#photo-feedback').textContent=t('Preparing photo…');
  try{
   const photo=await prepareProfilePhoto(file);if(selection!==photoSelection)return;
   state.profile.photo=photo;const stored=persist();syncProfilePhoto();
   if($('#photo-feedback'))$('#photo-feedback').textContent=t(stored?'Photo updated.':"Couldn't save photo.");
  }catch(error){if(selection===photoSelection&&$('#photo-feedback'))$('#photo-feedback').textContent=t(error.message);}
  finally{input.value='';if(selection===photoSelection&&$('#choose-photo'))$('#choose-photo').disabled=false;}
 };
 $('#remove-photo').onclick=()=>{
  ++photoSelection;state.profile.photo='';persist();syncProfilePhoto();
  $('#choose-photo').disabled=false;$('#photo-feedback').textContent=t('Photo removed.');
 };
}


function avatarPicker(){return `<dialog id="avatar-dialog" class="avatar-dialog" aria-labelledby="avatar-dialog-title"><button class="dialog-close icon-button" id="close-avatar-picker" type="button" aria-label="Close avatar picker">×</button><div class="avatar-dialog-header"><span class="avatar" id="avatar-dialog-preview" aria-hidden="true">${profileAvatar(state.profile)}</span><div><h2 id="avatar-dialog-title">Choose your avatar</h2><p>Pick a character or try a random one.</p></div></div><div class="avatar-options" aria-label="Avatars">${profileAvatarChoices.map(avatar=>`<button class="avatar-option" data-avatar-id="${avatar.id}" type="button" aria-label="${avatar.label}" aria-pressed="${!validProfilePhoto(state.profile.photo)&&state.profile.avatarId===avatar.id}"><img src="${avatar.src}" width="80" height="80" alt="" loading="lazy"><span class="avatar-check" aria-hidden="true">✓</span></button>`).join('')}</div><div class="avatar-picker-footer"><button class="button" id="random-avatar" type="button">Surprise me</button><button class="text-button" id="keep-avatar" type="button">Keep current</button></div></dialog>`;}
function selectProfileAvatar(id){
 if(!getProfileAvatar(id))return;
 ++photoSelection;state.profile.avatarId=id;state.profile.photo='';
 const stored=persist();syncProfilePhoto();$('#choose-photo').disabled=false;
 $('#photo-feedback').textContent=t(stored?'Avatar updated.':"Couldn't save changes.");
 $('#avatar-dialog').close();
}
function bindAvatarPicker(){
 const dialog=$('#avatar-dialog');
 $('#choose-avatar').onclick=()=>{syncProfilePhoto();dialog.showModal();};
 $('#close-avatar-picker').onclick=()=>dialog.close();$('#keep-avatar').onclick=()=>dialog.close();
 dialog.querySelector('.avatar-options').onclick=event=>{const button=event.target.closest('[data-avatar-id]');if(button)selectProfileAvatar(button.dataset.avatarId);};
 $('#random-avatar').onclick=()=>selectProfileAvatar(randomAvatarId(state.profile.avatarId));
}

function specializationField(value){return `<select class="field specialization-select" name="specialization" required>${researchTopics.includes(value)?'':`<option value="" selected disabled>${t("Choose a field")}</option>`}${researchTopics.map(topic=>`<option value="${escapeHTML(topic)}" ${value===topic?'selected':''}>${escapeHTML(t(topic))}</option>`).join('')}</select>`;}
function profile(){const p=state.profile;return `<div class="page">${intro('YOUR LITTLE CORNER OF EARTH SCIENCE','Your workspace','Your profile and saved research.')}<div class="profile-layout"><aside class="panel profile-card"><span class="avatar profile-photo" id="photo-preview" role="img" aria-label="Profile picture">${profileAvatar(p)}</span><div class="photo-controls"><input type="file" id="profile-photo" accept="image/jpeg,image/png,image/webp" aria-label="Profile picture" hidden><div class="photo-actions"><button class="button avatar-choose" id="choose-avatar" type="button">Choose avatar</button><button class="button photo-choose" id="choose-photo" type="button">Upload photo</button></div><button class="text-button" id="remove-photo" type="button" ${validProfilePhoto(p.photo)?'':'hidden'}>Remove photo</button><small>JPG, PNG or WebP · Up to 10 MB.</small><span id="photo-feedback" role="status"></span></div>${avatarPicker()}<h2 data-user-content dir="auto">${escapeHTML(p.name)}</h2><p data-user-content dir="auto">${escapeHTML(p.title)}<br>${escapeHTML(t(p.specialization))}</p><p>${state.saved.length} saved research records</p><a class="text-link" href="#research?saved=1">Open your collection ${icon('arrow')}</a><a class="text-link profile-notebook-link" href="#notebook">Field notebook ${icon('arrow')}</a></aside><section class="panel"><form id="profile-form"><div class="form-grid">${[['name','Display name',true],['title','Professional title',false],['specialization','Specialization',false],['interests','Research interests',false]].map(f=>`<label>${f[1]}${f[0]==='specialization'?specializationField(p.specialization):`<input class="field" name="${f[0]}" value="${escapeHTML(p[f[0]])}" maxlength="120" ${f[2]?'required':''}>`}</label>`).join('')}<label class="full">About you<textarea class="field" name="about" maxlength="1500">${escapeHTML(p.about)}</textarea></label></div><div class="profile-actions"><button class="button primary">Save profile ${icon('arrow')}</button><span id="profile-feedback" role="status" class="count"></span></div></form></section></div></div>`;}
function syncUnreadBadge(){syncDirectBadge();}
function messages(){return directMessagesPage();}
window.addEventListener('storage',event=>{if(event.key!==activeStorageKey)return;state=readState(activeStorageKey);syncProfilePhoto();});

function initGlassCards(grid){
 if(!grid)return ()=>{};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 const cards=[...grid.querySelectorAll('.tool-card,.glass-panel')];
 const cleanups=[];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}},{threshold:.15});
 cards.forEach((card,index)=>{
  if(!reduced.matches){card.classList.add('card-reveal');card.style.setProperty('--card-delay',index*90+'ms');observer.observe(card);}
  let frame=0;
  function move(event){
   if(reduced.matches||!finePointer.matches)return;
   const bounds=card.getBoundingClientRect();
   const x=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width));
   const y=Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height));
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{card.style.setProperty('--glass-x',x*100+'%');card.style.setProperty('--glass-y',y*100+'%');card.style.setProperty('--tilt-x',(0.5-y)*5+'deg');card.style.setProperty('--tilt-y',(x-0.5)*5+'deg');});
  }
  function reset(){cancelAnimationFrame(frame);card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');card.style.setProperty('--glass-x','50%');card.style.setProperty('--glass-y','0%');}
  card.addEventListener('pointermove',move);card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);
  cleanups.push(()=>{reset();card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',reset);card.removeEventListener('pointercancel',reset);});
 });
 return ()=>{observer.disconnect();cleanups.forEach(cleanup=>cleanup());};
}

function route(){disposeTerrain();disposeGlassCards();disposeFeatures();const [path,query='']=location.hash.slice(1).split('?');let page=({...featurePages,home,dictionary,research,ai,profile,messages,login:googleLoginPage})[path]?path:'home';if(!['home','login'].includes(page)&&!googleAccount){try{sessionStorage.setItem('stc_auth_return',location.hash);}catch{}page='login';}const params=new URLSearchParams(query);currentPage=page;$('#main').innerHTML=localizeHTML(({...featurePages,home,dictionary,research,ai,profile,messages,login:googleLoginPage})[page]());disposeTerrain=initInteractiveTerrain($('#main .hero'));disposeGlassCards=initGlassCards($('#main'));$('#main').classList.remove('route-enter');void $('#main').offsetWidth;$('#main').classList.add('route-enter');document.querySelectorAll('.header nav a').forEach(a=>{if(a.hash===`#${page}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});$('#profile-avatar').innerHTML=profileAvatar(state.profile);syncUnreadBadge();setNavigationOpen(false);document.querySelector('.discover-nav').open=false;const tabLabel=({login:'Sign in',home:'',dictionary:'Dictionary',research:'Research',ai:'Swingo AI',profile:'My profile',messages:'Messages',member:'Member profile',atlas:'Explore',timeline:'Geological timeline',notebook:'Field notebook',community:'Community'})[page];document.title=tabLabel?'STC Geonara · '+t(tabLabel):'STC Geonara';window.scrollTo({top:0,behavior:'instant'});
disposeFeatures=page==='messages'?bindDirectMessages(params):bindFeature(page,params);syncAccountEntry();if(page==='login')bindGoogleLogin();if(page==='profile')decorateGoogleProfile();
if(page==='dictionary')bindEarthDictionary(params);
if(page==='research')bindResearch(params);
if(page==='ai'){bindSwingoExtras(params);$('#ai-send').disabled=aiBusy;$('#ai-form').onsubmit=e=>{e.preventDefault();sendAI();};document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>{$('#ai-question').value=t(b.dataset.prompt);sendAI();});$('#clear-chat').onclick=()=>{if(aiBusy)return;state.chat=[];persist();route();};$('#ai-body').scrollTop=$('#ai-body').scrollHeight;}
if(page==='profile'){bindPhotoPicker();$('#profile-form').onsubmit=e=>{e.preventDefault();const fields=Object.fromEntries(new FormData(e.target));if(!fields.name.trim()){toast('Please enter a display name.');return;}state.profile={...state.profile,...Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.trim()]))};const stored=persist();route();$('#profile-feedback').textContent=t(stored?'Saved.':"Couldn't save changes.");};}

}
async function sendAI(){
 if(aiBusy||assistantImagePreparing)return;
 const text=$('#ai-question').value.trim()||(assistantImage?t('Interpret this image.'):'');if(!text)return;
 if($('#swingo-feedback'))$('#swingo-feedback').textContent='';
 const image=assistantImage;const history=state.chat.slice(-8);const accountId=googleAccount?.id;const mode=swingoFocus;const outgoing={id:crypto.randomUUID(),from:'me',text};aiBusy=true;$('#attach-swingo').disabled=true;$('#swingo-focus').disabled=true;
 state.chat.push(outgoing);persist();$('#ai-question').value='';
 $('#ai-body').innerHTML=localizeHTML(bubbles(state.chat)+'<div class="bubble bot" id="typing">Preparing a response…</div>');$('#ai-body').scrollTop=$('#ai-body').scrollHeight;$('#ai-send').disabled=true;
 try{
  let answer;
  let status={ai:false};
  if(/^https?:$/.test(location.protocol)){const result=await fetch('/api/status',{signal:AbortSignal.timeout(5000)});if(result.ok)status=await result.json();}
  if(status.ai){const result=await geoRequest('/api/swingo',{method:'POST',signal:AbortSignal.timeout(65000),body:JSON.stringify({question:text,history,language:currentLanguage,image,mode})});answer={text:result.answer,sources:result.sources||[]};}
  else {if(image)throw Error('Image analysis is unavailable. Try again later.');answer=localGeoAnswer(text)||await earthDictionaryAnswer(text);if(!answer)throw Error('Swingo could not respond. Try another question.');}
  if(googleAccount?.id!==accountId)return;state.chat.push({from:'bot',text:answer.text,sources:answer.sources});persist();assistantImage='';
  if(currentPage==='ai'){$('#ai-question').required=true;$('#swingo-image-preview').hidden=true;$('#swingo-image-preview').removeAttribute('src');$('#swingo-image-status').textContent='';$('#remove-swingo-image').hidden=true;$('#swingo-image').value='';}
 }catch(error){if(googleAccount?.id===accountId){state.chat=state.chat.filter(message=>message.id!==outgoing.id);persist();}if(currentPage==='ai'&&googleAccount?.id===accountId){let feedback=$('#swingo-feedback');if(!feedback){feedback=document.createElement('p');feedback.id='swingo-feedback';feedback.className='swingo-feedback';feedback.setAttribute('role','status');$('#ai-form').after(feedback);}feedback.textContent=t(error.name==='TimeoutError'?'Swingo could not respond. Try again.':error.message);$('#ai-question').value=text;}}
 finally{aiBusy=false;if(currentPage==='ai'){$('#ai-body').innerHTML=localizeHTML(bubbles(state.chat));$('#ai-body').scrollTop=$('#ai-body').scrollHeight;$('#ai-send').disabled=false;$('#attach-swingo').disabled=false;$('#swingo-focus').disabled=false;}}
}
window.addEventListener('hashchange',()=>{if(location.hash==='#explore'||location.hash==='#main')return;route();$('#main').focus({preventScroll:true});});
const profileNavigationMedia=matchMedia('(max-width:940px)');
function setNavigationOpen(open){
 const mobile=profileNavigationMedia.matches;const expanded=mobile&&open;const avatar=$('#profile-avatar');
 $('#navigation').classList.toggle('open',expanded);
 if(!expanded)document.querySelector('.discover-nav').open=false;
 if(mobile){avatar.setAttribute('role','button');avatar.setAttribute('aria-controls','navigation');avatar.setAttribute('aria-expanded',String(expanded));avatar.setAttribute('aria-label',t(expanded?'Close navigation':'Open navigation'));}
 else{avatar.removeAttribute('role');avatar.removeAttribute('aria-controls');avatar.removeAttribute('aria-expanded');avatar.setAttribute('aria-label',t('My profile'));}
}
$('#profile-avatar').onclick=event=>{if(!profileNavigationMedia.matches)return;event.preventDefault();setNavigationOpen(!$('#navigation').classList.contains('open'));};
$('#profile-avatar').addEventListener('keydown',event=>{if(profileNavigationMedia.matches&&event.key===' '){event.preventDefault();setNavigationOpen(!$('#navigation').classList.contains('open'));}});
$('#navigation').addEventListener('click',event=>{if(event.target.closest('a'))setNavigationOpen(false);});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const discover=document.querySelector('.discover-nav');if(discover.open){discover.open=false;discover.querySelector('summary').focus();}else if($('#navigation').classList.contains('open')){setNavigationOpen(false);$('#profile-avatar').focus();}});
document.addEventListener('click',event=>{const discover=document.querySelector('.discover-nav');if(discover.open&&!discover.contains(event.target))discover.open=false;if(!event.target.closest('#navigation,#profile-avatar')&&$('#navigation').classList.contains('open'))setNavigationOpen(false);});
profileNavigationMedia.addEventListener('change',()=>setNavigationOpen(false));
document.addEventListener('click',e=>{if(e.target.closest('[data-about]')||e.target.closest('#about-button'))$('#about-dialog').showModal();});
$('.dialog-close').onclick=()=>$('#about-dialog').close();$('.dialog-done').onclick=()=>$('#about-dialog').close();
function syncThemeToggle(){
 const dark=document.documentElement.dataset.theme==='dark';
 $('#theme-toggle').setAttribute('aria-pressed',String(dark));
 $('#theme-toggle').title=t(dark?'Switch to light mode':'Switch to dark mode');
 $('meta[name="theme-color"]').content=dark?'#151918':'#e5e5e7';
}
$('#theme-toggle').onclick=()=>{
 const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
 void themeReveal.toggle($('#theme-toggle'),theme,()=>{
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('stc_geonara_theme',theme);}catch{/* Theme still works for this visit. */}
  syncThemeToggle();
 });
};
$('#language-select').onchange=e=>{
 const drafts=[...document.querySelectorAll('#main input,#main textarea,#main select')].filter(el=>el.type!=='file').map(el=>({id:el.id,name:el.name,value:el.value}));
 const savedOnly=$('#saved-papers')?.getAttribute('aria-pressed')==='true';
 const scrollY=window.scrollY;
 currentLanguage=e.target.value;
 try{localStorage.setItem('stc_geonara_language',currentLanguage);}catch{}
 syncLanguage();route();syncThemeToggle();
 for(const draft of drafts){const el=draft.id?document.getElementById(draft.id):document.querySelector('#main [name="'+draft.name+'"]');if(el){el.value=draft.value;el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));}}
 if(savedOnly)$('#saved-papers')?.click();
 window.scrollTo({top:scrollY,behavior:'instant'});
};

function initFloatingNavigation(){
 const header=$('.header');const reduced=matchMedia('(prefers-reduced-motion: reduce)');const pointer=matchMedia('(hover: hover) and (pointer: fine)');let lightFrame=0,scrollFrame=0;
 header.addEventListener('pointermove',event=>{
  if(reduced.matches||!pointer.matches)return;
  const bounds=header.getBoundingClientRect();const x=(event.clientX-bounds.left)/bounds.width*100;
  cancelAnimationFrame(lightFrame);lightFrame=requestAnimationFrame(()=>header.style.setProperty('--nav-light-x',x+'%'));
 });
 header.addEventListener('pointerleave',()=>{cancelAnimationFrame(lightFrame);header.style.setProperty('--nav-light-x','50%');});
 const update=()=>{header.classList.toggle('is-scrolled',window.scrollY>24);scrollFrame=0;};
 window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(update);},{passive:true});update();
}
initFloatingNavigation();

syncLanguage();
syncThemeToggle();
route();
// Save the assigned default once so refreshing never rerolls an existing profile.
persist();

