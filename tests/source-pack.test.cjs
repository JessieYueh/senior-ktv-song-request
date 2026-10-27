const test=require('node:test');
const assert=require('node:assert/strict');
const {songs,segment,identity,replacement,resolve}=require('../source-song-pack.js');
test('14 separate complete videos, no shared compilation and no chapter playback',()=>{
  assert.equal(songs.length,14);assert.equal(new Set(songs.map(s=>s.videoId)).size,14);assert.equal(new Set(songs.map(identity)).size,14);
  for(const s of songs){assert.match(s.videoId,/^[\w-]{11}$/);assert.notEqual(s.videoId,'21f7PU0eQgk');assert.equal(segment(s),null);assert.equal('startSeconds' in s,false);assert.equal('endSeconds' in s,false);}
});
test('legacy records resolve before admin login; custom videos and originals survive',()=>{
  for(const s of songs){const old={...s,title:'自訂名稱',artist:'豪聲唱片合輯',videoId:'21f7PU0eQgk',vocalId:'custom00001'};assert.equal(replacement(old).videoId,s.videoId);assert.equal(resolve(old).videoId,s.videoId);assert.equal(resolve(old).title,'自訂名稱');assert.equal(resolve(old).vocalId,'custom00001');assert.equal(identity(old),s.videoId);assert.equal(segment(old),null);assert.equal(replacement({...old,videoId:'custom00002'}),null);}
  assert.equal(replacement({videoId:'21f7PU0eQgk',title:'unrelated',artist:'other'}),null);
});
