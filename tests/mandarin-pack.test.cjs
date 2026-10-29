const test=require('node:test'),assert=require('node:assert/strict');
const pack=require('../mandarin-song-pack.js'),ost=require('../ost-2026.js');
test('requested solo Zhang Yuan songs import as Mandarin and stay outside 2026 drama category',()=>{
 assert.deepEqual(pack.importable().map(s=>s.title),['看著我的眼睛說','可以不是你','嘉賓']);
 for(const s of pack.importable()){assert.equal(s.artist,'張遠');assert.equal(s.lang,'國語');assert.match(s.videoId,/^[\w-]{11}$/);assert.equal(ost.matches(s,ost.category),false);}
 assert.equal(pack.missing([]).length,3);
 for(const s of pack.importable()){
  assert.equal(pack.missing([s]).length,2);
  assert.equal(pack.missing([{...s,videoId:'custom00001'}]).length,2);
  assert.equal(pack.missing([{vocalId:s.videoId}]).length,2);
 }
 assert.equal(pack.missing(pack.importable()).length,0);
});
