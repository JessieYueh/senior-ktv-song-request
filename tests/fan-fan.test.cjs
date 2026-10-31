const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const pack=require('../fan-fan-song-pack.js');
test('chart selections deduplicate existing videos, normalized names and duets while preserving cloud choices',()=>{
 assert.equal(pack.entries.length,17);
 const duet=pack.entries.find(e=>e.title==='如果的事');
 const existing=[{title:'一個像夏天 一個像秋天',artist:'范瑋琪',videoId:'abcdefghijk'},
 {title:duet.title,artist:'張韶涵 & 范瑋琪',videoId:'12345678901'},
 {title:'custom name',artist:'custom singer',videoId:pack.entries[0].videoId}];
 assert.equal(pack.missing(existing).length,14);
 assert.equal(pack.missing(existing).some(e=>e.title===duet.title),false);
 assert.equal(pack.missing(pack.importable()).length,0);
 for(const e of pack.entries){assert.match(e.videoId,/^[\w-]{11}$/);assert.ok(e.chartSource&&e.chartEvidence&&e.metadataVerified);assert.equal(e.contentVerified,false);assert.equal(e.embedding,'unconfirmed');}
});
test('automatic import requires admin, access and server readiness; uses only missing entries and retries errors',async()=>{
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
 const code=html.slice(html.indexOf('  let fanImportTimer='),html.indexOf('  function scheduleHouImport(){'));
 let calls=0,scheduled=0;const existing=[pack.importable()[0]];
 const state={admin:false,access:true,readReady:true,busy:false};
 const ctx={window:{KTV_FAN_FAN:pack,KTV_CLOUD:{}},cloudState:state,remoteSongs:existing,console:{error(){}},
 clearTimeout(){},setTimeout(){scheduled++;return 1;},requireCloud:()=>({importSongs:async items=>{calls++;assert.equal(items.length,16);throw Error('network');}})};
 vm.createContext(ctx);vm.runInContext(code,ctx);
 await vm.runInContext('maybeImportFan()',ctx);assert.equal(calls,0);
 state.admin=true;state.readReady=false;await vm.runInContext('maybeImportFan()',ctx);assert.equal(calls,0);
 state.readReady=true;state.access=false;await vm.runInContext('maybeImportFan()',ctx);assert.equal(calls,0);
 state.access=true;state.busy=true;await vm.runInContext('maybeImportFan()',ctx);assert.equal(calls,0);
 state.busy=false;await vm.runInContext('maybeImportFan()',ctx);assert.equal(calls,1);assert.equal(scheduled,1);
 ctx.remoteSongs=pack.importable();await vm.runInContext('maybeImportFan()',ctx);assert.equal(calls,1);
});
