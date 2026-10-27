const test=require('node:test');
const assert=require('node:assert/strict');
const sort=require('../catalog-sort.js');
const input=[{title:'三',artist:'李',videoId:'3'},{title:'一',artist:'陳',videoId:'1'},{title:'二',artist:'王',videoId:'2'}];
test('supports both fields in both directions using Traditional Chinese stroke order',()=>{
  assert.deepEqual(sort(input,'title','asc').map(s=>s.title),['一','二','三']);
  assert.deepEqual(sort(input,'title','desc').map(s=>s.title),['三','二','一']);
  assert.deepEqual(sort(input,'artist','asc').map(s=>s.artist),['王','李','陳']);
  assert.deepEqual(sort(input,'artist','desc').map(s=>s.artist),['陳','李','王']);
  assert.deepEqual(input.map(s=>s.title),['三','一','二'],'sorting must not mutate shared catalog or queue');
});
test('same singer has deterministic song ordering and embedded numbers use natural order',()=>{
  const songs=[{title:'Song 10',artist:'A'},{title:'Song 2',artist:'A'}];
  assert.deepEqual(sort(songs,'artist','asc').map(s=>s.title),['Song 2','Song 10']);
  assert.deepEqual(sort(songs,'artist','desc').map(s=>s.title),['Song 10','Song 2']);
});
