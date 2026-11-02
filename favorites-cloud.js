import {collection,doc,query,where,onSnapshot,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
// All approved family devices share these named lists. No Google profile is stored.
export class CloudStore {
  constructor(context,onChange){this.ctx=context;this.onChange=onChange;this.lists=[];this.ready=false;this.error='';this.closed=false;this.stop=onSnapshot(query(collection(context.db,'favoriteLists'),where('deleted','==',false)),{includeMetadataChanges:true},snap=>{if(this.closed)return;this.ready=!snap.metadata.fromCache&&!snap.metadata.hasPendingWrites;this.lists=snap.docs.map(d=>this.decode(d.id,d.data())).sort((a,b)=>a.name.localeCompare(b.name,'zh-Hant'));this.error='';onChange();},e=>{if(this.closed)return;this.ready=false;this.lists=[];this.error=e.code?.includes('permission-denied')?'雲端最愛尚未啟用，請管理者發布新版 Firestore 規則。':context.explain?.(e)||e.message;onChange();});}
  decode(id,data){return {id,name:data.name,songs:this.ids(data).map(songId=>({key:'cloud:'+songId,title:'歌本已移除的歌曲',artist:'',lang:'其他'}))};}
  ids(data){return String(data.songIds||'').split('\n').filter(Boolean);}
  pack(ids){if(ids.length>100)throw Error('每份雲端清單最多 100 首歌曲。');if(ids.some(id=>typeof id!=='string'||!/^[^/\n]{1,512}$/.test(id)))throw Error('歌曲代碼不正確，請從雲端歌本重新收藏。');return ids.length?ids.join('\n')+'\n':'';}
  read(){return this.lists.map(l=>({...l,songs:l.songs.map(s=>({...s}))}));}
  require(){if(!this.ctx.allowed()||!this.ctx.auth.currentUser||this.closed)throw Error('請先取得裝置授權。');if(!this.ready)throw Error(this.error||'最愛清單正在連線，請稍候。');if(!navigator.onLine)throw Error('目前離線，連線後才能修改雲端最愛。');return this.ctx.auth.currentUser.uid;}
  name(value){const n=String(value||'').trim();if(!n||n.length>40)throw Error('清單名稱請填寫 1～40 個字。');return n;}
  close(){this.closed=true;this.stop?.();this.lists=[];this.ready=false;}
  async create(name,song,legacyId){const uid=this.require();name=this.name(name);if(!legacyId&&this.lists.some(l=>l.name===name))throw Error('已有同名清單，請使用其他名稱。');const ref=legacyId?doc(this.ctx.db,'favoriteLists',legacyId):doc(collection(this.ctx.db,'favoriteLists'));const ids=song?[song._cloudId]:[];const data={name,songIds:this.pack(ids),deleted:false,createdBy:uid,createdAt:serverTimestamp(),updatedBy:uid,updatedAt:serverTimestamp()};await runTransaction(this.ctx.db,async tx=>{const snap=await tx.get(ref);if(snap.exists()){if(legacyId)return;throw Error('清單已存在');}tx.set(ref,data);});return ref.id;}
  async change(id,fn){const uid=this.require(),ref=doc(this.ctx.db,'favoriteLists',id);return runTransaction(this.ctx.db,async tx=>{const snap=await tx.get(ref);if(!snap.exists()||snap.data().deleted)throw Error('清單已被刪除，請重新選擇。');const data=snap.data(),patch=fn(data);if(!patch)return false;tx.update(ref,{...patch,updatedBy:uid,updatedAt:serverTimestamp()});return true;});}
  async rename(id,name){name=this.name(name);if(this.lists.some(l=>l.id!==id&&l.name===name))throw Error('已有同名清單，請使用其他名稱。');return this.change(id,()=>({name}));}
  async remove(id){return this.change(id,()=>({deleted:true}));}
  async add(id,song){const songId=song._cloudId;this.pack([songId]);return this.change(id,data=>{const ids=this.ids(data);if(ids.includes(songId))return null;ids.push(songId);return {songIds:this.pack(ids)};});}
  async removeSong(id,key){return this.change(id,data=>({songIds:this.pack(this.ids(data).filter(s=>'cloud:'+s!==key))}));}
  async move(id,key,delta){return this.change(id,data=>{const ids=this.ids(data),i=ids.findIndex(s=>'cloud:'+s===key),j=i+delta;if(i<0||j<0||j>=ids.length)return null;[ids[i],ids[j]]=[ids[j],ids[i]];return {songIds:this.pack(ids)};});}
  async importLocal(lists){const uid=this.require();let count=0,skipped=0;for(const l of lists){const ids=l.songs.filter(s=>s.key.startsWith('cloud:')).map(s=>s.key.slice(6));skipped+=l.songs.length-ids.length;if(ids.length>100)throw Error('「'+l.name+'」超過雲端每份 100 首上限，請先拆成兩份。');const ref=doc(this.ctx.db,'favoriteLists','legacy_'+uid+'_'+l.id);const data={name:this.name(l.name),songIds:this.pack([...new Set(ids)]),deleted:false,createdBy:uid,createdAt:serverTimestamp(),updatedBy:uid,updatedAt:serverTimestamp()};await runTransaction(this.ctx.db,async tx=>{const snap=await tx.get(ref);if(snap.exists())return;tx.set(ref,data);count++;});}return {count,skipped};}
}
window.KTVFavoritesCloud=CloudStore;
window.KTV_FAVORITES_READY?.();
