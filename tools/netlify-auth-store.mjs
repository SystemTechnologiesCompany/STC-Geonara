// Values are already AES-GCM encrypted. Keys contain only hashes of random tokens.
export function netlifyAuthStore(store){
 return {
  async get(key){return store.get(key);},
  async set(key,value){await store.set(key,value);},
  async delete(key){await store.delete(key);},
  async replace(key,expected,value){const row=await store.getWithMetadata(key,{type:'text'});if(!row||row.data!==expected)return false;return (await store.set(key,value,{onlyIfMatch:row.etag})).modified;},
  async take(key){const row=await store.getWithMetadata(key,{type:'text'});if(!row)return null;const result=await store.set(key,'consumed',{onlyIfMatch:row.etag});if(!result.modified)return null;await store.delete(key);return row.data;}
 };
}
