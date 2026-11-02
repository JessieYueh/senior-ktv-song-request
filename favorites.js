(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KTVFavorites=api;})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const keyOf=s=>s._cloudId?'cloud:'+s._cloudId:'song:'+s.title+'|'+s.artist;
  const refOf=s=>({key:keyOf(s),title:String(s.title||''),artist:String(s.artist||''),lang:String(s.lang||'其他')});
  class Store {
    constructor(storage,uid){this.storage=storage;this.key='happy_ktv_favorites_v1:'+uid;}
    read(){const raw=this.storage.getItem(this.key);if(!raw)return [];let data;try{data=JSON.parse(raw);}catch{throw Error('最愛清單資料無法讀取，請勿清除瀏覽器資料。');}if(!Array.isArray(data)||data.length>50||data.some(l=>!l||typeof l.id!=='string'||typeof l.name!=='string'||!Array.isArray(l.songs)||l.songs.length>300||l.songs.some(s=>!s||typeof s.key!=='string'||typeof s.title!=='string'||typeof s.artist!=='string')))throw Error('最愛清單資料格式不正確，未覆寫原資料。');return data;}
    change(action){const lists=this.read();const result=action(lists);try{this.storage.setItem(this.key,JSON.stringify(lists));}catch{throw Error('無法儲存最愛清單，請確認瀏覽器允許儲存且空間足夠。');}return result;}
    name(value){const name=String(value||'').trim();if(!name||name.length>40)throw Error('清單名稱請填寫 1～40 個字。');return name;}
    create(name,song){name=this.name(name);return this.change(lists=>{if(lists.length>=50)throw Error('最多可建立 50 份清單。');if(lists.some(l=>l.name===name))throw Error('已有同名清單，請使用其他名稱。');const id=Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);lists.push({id,name,songs:song?[refOf(song)]:[]});return id;});}
    edit(id,fn){return this.change(lists=>{const list=lists.find(l=>l.id===id);if(!list)throw Error('清單已被移除，請重新選擇。');return fn(list,lists);});}
    rename(id,name){name=this.name(name);this.edit(id,(l,all)=>{if(all.some(x=>x.id!==id&&x.name===name))throw Error('已有同名清單，請使用其他名稱。');l.name=name;});}
    remove(id){this.change(lists=>{const i=lists.findIndex(l=>l.id===id);if(i<0)throw Error('清單已被移除。');lists.splice(i,1);});}
    add(id,song){return this.edit(id,l=>{const ref=refOf(song);if(l.songs.some(s=>s.key===ref.key))return false;if(l.songs.length>=300)throw Error('每份清單最多可收藏 300 首歌曲。');l.songs.push(ref);return true;});}
    removeSong(id,key){this.edit(id,l=>{l.songs=l.songs.filter(s=>s.key!==key);});}
    move(id,key,delta){this.edit(id,l=>{const i=l.songs.findIndex(s=>s.key===key),j=i+delta;if(i<0||j<0||j>=l.songs.length)return;[l.songs[i],l.songs[j]]=[l.songs[j],l.songs[i]];});}
  }
  function resolve(list,catalog){const byKey=new Map(catalog.map(s=>[keyOf(s),s]));return list.songs.map(ref=>({ref,song:byKey.get(ref.key)||null}));}
  return {Store,keyOf,resolve};
});
