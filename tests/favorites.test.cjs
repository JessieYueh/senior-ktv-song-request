const test=require('node:test'),assert=require('node:assert/strict');
const {Store,resolve}=require('../favorites.js');
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}};
const a={_cloudId:'a',title:'約定',artist:'周蕙',videoId:'abcdefghijk'},b={_cloudId:'b',title:'家後',artist:'江蕙',videoId:'abcdefghijl'};
test('named lists persist, prevent duplicates, edit order, rename and isolate device identities',()=>{
 const storage=memory(),s=new Store(storage,'one'),id=s.create('爸爸',a);assert.equal(s.add(id,a),false);s.add(id,b);s.move(id,'cloud:b',-1);s.rename(id,'爸爸愛唱');
 const again=new Store(storage,'one');assert.deepEqual(again.read()[0].songs.map(s=>s.key),['cloud:b','cloud:a']);assert.equal(again.read()[0].name,'爸爸愛唱');assert.deepEqual(new Store(storage,'two').read(),[]);
 s.removeSong(id,'cloud:a');assert.equal(s.read()[0].songs.length,1);s.remove(id);assert.deepEqual(s.read(),[]);
});
test('invalid names, duplicate lists and failed writes cannot silently lose saved lists',()=>{
 const storage=memory(),s=new Store(storage,'one'),id=s.create('我的歌',a);assert.throws(()=>s.create(' '));assert.throws(()=>s.create('我的歌'));assert.throws(()=>s.rename(id,'x'.repeat(41)));
 const original=storage.getItem(s.key);storage.setItem=()=>{throw Error('quota')};assert.throws(()=>s.add(id,b),/無法儲存/);assert.equal(storage.getItem(s.key),original);
 const bad=new Store({getItem:()=>'{bad',setItem:()=>assert.fail('corrupt data must not be overwritten')},'one');assert.throws(()=>bad.create('新清單'),/無法讀取/);
});
test('references resolve current catalog edits while deleted songs remain visible and unavailable',()=>{
 const s=new Store(memory(),'one'),id=s.create('我的歌',a);s.add(id,b);const resolved=resolve(s.read()[0],[{...a,title:'約定新版',videoId:'abcdefghijm'}]);assert.equal(resolved[0].song.videoId,'abcdefghijm');assert.equal(resolved[1].song,null);assert.equal(resolved[1].ref.title,'家後');
});
