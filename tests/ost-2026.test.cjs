const test=require('node:test'),assert=require('node:assert/strict');
const ost=require('../ost-2026.js');
test('only verified complete embeddable 2026 songs can enter cloud import',()=>{
  assert.equal(ost.importable().length,8);
  assert.deepEqual(ost.importable().map(s=>s.videoId),['PJQGy005Ylg','V79oU4KgPLc','PQMA-Fzmm4U','frYvL-ZLRQA','jtK5KfEgjI0','QG7yJCAbV9Q','-JQwmf9J8U0','8FlhQrN_gmo']);
  assert.ok(!ost.importable().some(s=>['j8yO0LkqA7s','u1vOwz4AxWw'].includes(s.videoId)));
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
  const song=ost.importable()[0];assert.equal(ost.missing([]).length,8);
  for(const existing of [song,{...song,title:'管理者歌名'},{...song,videoId:'custom00001'},{title:'別名',vocalId:song.videoId}])assert.equal(ost.missing([existing]).length,7);
});
