const test=require('node:test');
const assert=require('node:assert/strict');
const {songs,segment,identity}=require('../source-song-pack.js');
test('all 14 publisher chapters cover 44:51 in order without gaps',()=>{
  assert.equal(songs.length,14);assert.equal(songs[0].startSeconds,0);assert.equal(songs.at(-1).endSeconds,2691);
  for(let i=0;i<songs.length;i++){assert.ok(songs[i].endSeconds>songs[i].startSeconds);if(i)assert.equal(songs[i].startSeconds,songs[i-1].endSeconds);}
  assert.equal(new Set(songs.map(identity)).size,14,'bulk queue must retain each chapter');
});
test('chapter bounds survive cloud storage without new database fields and admin renames',()=>{
  const s=songs[3];const cloud={_cloudId:s._cloudId,videoId:s.videoId,title:'改過的名稱',artist:'已補歌手'};
  assert.deepEqual(segment(cloud),{startSeconds:606,endSeconds:782});
  assert.equal(segment(cloud,'different01'),null,'switching to a separate original must not use compilation bounds');
  assert.equal(segment({...s,videoId:'different01'}),null);
  assert.equal(identity({title:'other',artist:'other',videoId:'different01'}),'different01');
});
