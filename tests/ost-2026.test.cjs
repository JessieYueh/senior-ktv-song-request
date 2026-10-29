const test=require('node:test'),assert=require('node:assert/strict');
const ost=require('../ost-2026.js');
test('only user-confirmed complete embeddable 2026 songs can enter cloud import',()=>{
  assert.deepEqual(ost.importable(),[{title:'初醒',artist:'周深',lang:'國語',videoId:'PJQGy005Ylg',vocalId:''}]);
  for(const e of ost.verified()){assert.equal(e.embedding,'passed');assert.equal(e.contentVerified,true);assert.equal(e.year,2026);}
  assert.equal(ost.verified()[0].durationSeconds,217);
  assert.equal(ost.verified()[0].subtitles,'待確認');
  assert.equal(ost.entries.filter(e=>e.embedding==='failed').length,2);
});
test('OST category overlaps language without including unrelated songs or name collisions',()=>{
  const song=ost.importable()[0];assert.ok(ost.matches(song,ost.category));assert.ok(ost.matches(song,'國語'));assert.ok(ost.matches(song,'全部'));assert.equal(ost.matches(song,'台語'),false);
  assert.equal(ost.matches({...song,videoId:'unrelated01'},ost.category),false);
  assert.equal(ost.metadata({...song,videoId:'custom00001',vocalId:song.videoId}).drama,'白日提燈');
});
test('import avoids existing video, alternate video and edited song duplicates',()=>{
  const song=ost.importable()[0];assert.equal(ost.missing([]).length,1);
  for(const existing of [song,{...song,title:'管理者歌名'},{...song,videoId:'custom00001'},{title:'別名',vocalId:song.videoId}])assert.equal(ost.missing([existing]).length,0);
});
