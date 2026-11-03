const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const pack=require('../wan-fang-song-pack.js');
test('only chart-evidenced, content-verified playable entries are eligible; duet and alternate video dedup preserve existing choices',()=>{
  for(const e of pack.entries){assert.match(e.videoId,/^[\w-]{11}$/);assert.ok(e.chartSource&&e.chartEvidence);}
  const original=pack.entries.map(e=>({...e}));
  try{
    for(const e of pack.entries){e.embedding='passed';e.contentVerified=true;}
    assert.equal(pack.missing([{title:'愛情限時批',artist:'萬芳 & 伍佰',videoId:'abcdefghijk'},{title:'其他',artist:'其他',vocalId:pack.entries[0].videoId}]).length,pack.entries.length-2);
    assert.equal(pack.missing(pack.importable()).length,0);
    pack.entries[0].embedding='failed';assert.equal(pack.importable().length,pack.entries.length-1);
    pack.entries[1].contentVerified=false;assert.equal(pack.importable().length,pack.entries.length-2);
  }finally{pack.entries.forEach((e,i)=>Object.assign(e,original[i]));}
});
test('import waits for authorization and confirmed server data, retries busy state, and does not announce transaction success as sync',async()=>{
  const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
  const code=html.slice(html.indexOf('  let wanImportTimer='),html.indexOf('  function scheduleHouImport(){'));
  let calls=0,scheduled=0;const state={admin:false,access:true,readReady:true,busy:false},fake={missing:s=>s.length?[]:[{title:'新不了情'}]};
  const ctx={window:{KTV_WAN_FANG:fake,KTV_CLOUD:{}},cloudState:state,remoteSongs:[],clearTimeout(){},setTimeout(){scheduled++;},requireCloud:()=>({importSongs:async()=>{calls++;}}),cloudError:e=>e.message,console};
  vm.createContext(ctx);vm.runInContext(code,ctx);
  await vm.runInContext('maybeImportWan()',ctx);assert.equal(calls,0);
  state.admin=true;state.readReady=false;await vm.runInContext('maybeImportWan()',ctx);assert.equal(calls,0);
  state.readReady=true;state.busy=true;await vm.runInContext('maybeImportWan()',ctx);assert.equal(calls,0);assert.equal(scheduled,1);
  state.busy=false;await vm.runInContext('maybeImportWan()',ctx);assert.equal(calls,1);assert.equal(fake.lastReport.confirmed,false);
  ctx.remoteSongs=[{}];await vm.runInContext('maybeImportWan()',ctx);assert.equal(fake.lastReport.confirmed,true);
  assert.doesNotMatch(code,/toast\(|textContent|innerHTML/);
});
