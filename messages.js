'use strict';

const messageStatus={
 isUnread(message){return Boolean(message&&typeof message.text==='string'&&typeof message.from==='string'&&message.from!=='me'&&message.read!==true);},
 unreadCount(messages,contactId){
  const threads=contactId?[messages[contactId]]:Object.values(messages);
  return threads.reduce((total,thread)=>total+(Array.isArray(thread)?thread.filter(message=>this.isUnread(message)).length:0),0);
 },
 receive(messages,payload,knownContacts,reading=false){
  if(!payload||typeof payload!=='object'||!knownContacts.includes(payload.contactId)||payload.from==='me')return null;
  if(typeof payload.text!=='string'||!payload.text.trim()||payload.text.length>2000)return null;
  if(payload.id!==undefined&&(typeof payload.id!=='string'||!payload.id.trim()||payload.id.length>160))return null;
  const thread=Array.isArray(messages[payload.contactId])?messages[payload.contactId]:[];
  if(payload.id&&thread.some(message=>message.id===payload.id))return null;
  const message={id:payload.id||(globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`),from:payload.contactId,text:payload.text.trim(),read:reading,createdAt:new Date().toISOString()};
  if(!Array.isArray(messages[payload.contactId]))messages[payload.contactId]=thread;
  thread.push(message);return message;
 },
 markRead(messages,contactId){
  if(!Array.isArray(messages[contactId]))return false;
  let changed=false;
  for(const message of messages[contactId])if(this.isUnread(message)){message.read=true;changed=true;}
  return changed;
 }
};
