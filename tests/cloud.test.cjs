// Dependency-free contract checks for migration and client write handling.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'cloud.js'), 'utf8').replace(/^import .*;\n/gm, '').replace('export function explain', 'function explain');
function fixture({signedIn=true, admin=true, failCommit=false, initialSongs=[], lookup, beforeTransaction, pack, replacement}={}) {
  const data = new Map(initialSongs.map(s=>[s._cloudId,{...s}])), states = [], auth = {currentUser: signedIn ? {uid:'manager',email:'manager@example.test'} : null};
  const snapshot = (id, value) => ({id, exists:()=>!!value, data:()=>value});
  const sandbox = {
    window:{KTV_SOURCE_SONGS:pack,KTVSourceReplacement:replacement,KTVGetVocal:lookup,KTV_APP:{setCloudState:s=>states.push(s),setCloudSongs:()=>{}},addEventListener:()=>{}},
    navigator:{onLine:true},setTimeout:()=>0,console,
    initializeApp:()=>({}),getAuth:()=>auth,getFirestore:()=>({}),
    collection:(_,name)=>({name}),doc:(_,name,id)=>({name,id}),
    GoogleAuthProvider: class {},signInWithPopup:async()=>{},signOut:async()=>{},
    onAuthStateChanged:(_,callback)=>callback(auth.currentUser),
    onSnapshot:(ref, options, cb)=>{
      if(ref.name==='admins') options(snapshot(ref.id,{enabled:admin}));
      else cb({metadata:{fromCache:false,hasPendingWrites:false},docs:[...data].map(([id,value])=>snapshot(id,value))});
      return ()=>{};
    },
    serverTimestamp:()=>({serverTimestamp:true}),
    runTransaction:async(_,operation)=>{
      beforeTransaction?.(data);
      const pending=[];
      const result=await operation({get:async ref=>snapshot(ref.id,data.get(ref.id)),set:(ref,value)=>pending.push([ref.id,value]),update:(ref,patch)=>pending.push([ref.id,{...data.get(ref.id),...patch}])});
      if(failCommit)throw Object.assign(new Error('write rejected'),{code:'permission-denied'});
      for(const [id,value] of pending)data.set(id,value);
      return result;
    }
  };
  vm.runInNewContext(source,sandbox);
  return {api:sandbox.window.KTV_CLOUD,data,states};
}
function songs(){const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'songs.js'),'utf8'),context);return context.window.KTV_SONGS;}
test('all 12 defaults migrate, rerun skips existing records and preserves edits',async()=>{
  const f=fixture();assert.equal(songs().length,12);assert.equal(await f.api.importSongs(songs()),12);assert.equal(f.data.size,12);
  const key='yt_'+songs()[0].videoId;f.data.get(key).title='管理者已調整的歌名';
  assert.equal(await f.api.importSongs(songs()),0);assert.equal(f.data.get(key).title,'管理者已調整的歌名');
});
test('signed-out and non-admin clients cannot initiate cloud writes',async()=>{
  for(const options of [{signedIn:false},{admin:false}]){const f=fixture(options);await assert.rejects(f.api.importSongs(songs()),/管理帳號/);assert.equal(f.data.size,0);}
});
test('a rejected transaction reports failure, commits no songs and clears busy status',async()=>{
  const f=fixture({failCommit:true});await assert.rejects(f.api.importSongs(songs()),/write rejected/);assert.equal(f.data.size,0);assert.equal(f.states.at(-1).busy,false);
});
test('duplicates within one import are written once and malformed entries do not partially import',async()=>{
  const f=fixture();assert.equal(await f.api.importSongs([songs()[0],songs()[0]]),1);
  await assert.rejects(f.api.importSongs([songs()[1],{title:'invalid',artist:'test',videoId:'not-an-id'}]),/格式/);assert.equal(f.data.size,1);
});

const {lookup:vocalLookup}=require('../vocal-presets.js');
function seeded(){return [...songs(),{title:'酒醉的蝴蝶',artist:'崔偉立',lang:'國語',videoId:'video000013'}].map((s,i)=>({...s,_cloudId:'song'+i,vocalId:'',order:i,createdAt:'original-time',createdBy:'owner'}));}
test('authorized sign-in fills all 13 missing originals without changing accompaniment or ownership',async()=>{
  const original=seeded();const f=fixture({initialSongs:original,lookup:vocalLookup});
  await new Promise(setImmediate);
  assert.equal(f.data.size,13);
  for(const s of original){const result=f.data.get(s._cloudId);assert.equal(result.vocalId,vocalLookup(s));assert.equal(result.videoId,s.videoId);assert.equal(result.createdBy,'owner');assert.equal(result.createdAt,'original-time');assert.equal(result.order,s.order);}
});
test('viewers receive vocal presets without an automatic database write',async()=>{
  const original=seeded();const f=fixture({signedIn:false,initialSongs:original,lookup:vocalLookup});await new Promise(setImmediate);
  assert.ok([...f.data.values()].every(s=>s.vocalId===''));await assert.rejects(f.api.fillVocals(),/管理帳號/);
});
test('backfill transaction preserves an original entered concurrently by another admin',async()=>{
  const original=seeded();const f=fixture({initialSongs:original,lookup:vocalLookup,beforeTransaction(data){data.get('song0').vocalId='custom00001';data.get('song0').title='管理者更新的歌名';}});await new Promise(setImmediate);
  assert.equal(f.data.get('song0').vocalId,'custom00001');assert.equal(f.data.get('song0').title,'管理者更新的歌名');assert.equal(f.data.get('song1').vocalId,vocalLookup(original[1]));
});

const {songs:sourcePack}=require('../source-song-pack.js');
test('standalone song pack imports 14 distinct records and rerun skips them',async()=>{
  const f=fixture({pack:sourcePack});await new Promise(setImmediate);assert.equal(f.data.size,14);
  for(const s of sourcePack){const stored=f.data.get(s._cloudId);assert.equal(stored.title,s.title);assert.equal(stored.videoId,s.videoId);assert.equal(Object.hasOwn(stored,'startSeconds'),false,'chapter metadata stays in versioned source pack; existing Firestore schema unchanged');}
  assert.equal(await f.api.importSourcePack(),0);assert.equal(f.data.size,14);
});
test('pack import preserves existing cloud edits and does not write for anonymous viewers',async()=>{
  const existing={...sourcePack[0],title:'管理者調整過的歌名'};
  const f=fixture({pack:sourcePack,initialSongs:[existing]});await new Promise(setImmediate);assert.equal(f.data.size,14);assert.equal(f.data.get(existing._cloudId).title,existing.title);
  const viewer=fixture({pack:sourcePack,signedIn:false});await new Promise(setImmediate);assert.equal(viewer.data.size,0);
});

const {replacement:sourceReplacement}=require('../source-song-pack.js');
test('legacy compilation migrates in place; preserves names, originals, ownership and concurrent custom links',async()=>{
  const legacy=sourcePack.map((s,i)=>({...s,videoId:'21f7PU0eQgk',artist:'豪聲唱片合輯',vocalId:'custom00001',order:i,createdAt:'then',createdBy:'owner'}));
  const f=fixture({pack:sourcePack,replacement:sourceReplacement,initialSongs:legacy,beforeTransaction(data){data.get(sourcePack[0]._cloudId).title='管理者歌名';data.get(sourcePack[1]._cloudId).videoId='custom00002';}});
  await new Promise(setImmediate);assert.equal(f.data.size,14);
  for(let i=0;i<14;i++){const s=f.data.get(sourcePack[i]._cloudId);assert.equal(s.videoId,i===1?'custom00002':sourcePack[i].videoId);assert.equal(s.vocalId,'custom00001');assert.equal(s.createdBy,'owner');assert.equal(s.createdAt,'then');assert.equal(s.order,i);}
  assert.equal(f.data.get(sourcePack[0]._cloudId).title,'管理者歌名');assert.equal(await f.api.importSourcePack(),0);
});
test('signed-out viewers cannot migrate legacy compilation records',async()=>{
  const old={...sourcePack[0],videoId:'21f7PU0eQgk'};const f=fixture({signedIn:false,pack:sourcePack,replacement:sourceReplacement,initialSongs:[old]});await new Promise(setImmediate);assert.equal(f.data.size,1);assert.equal(f.data.get(old._cloudId).videoId,old.videoId);await assert.rejects(f.api.importSourcePack(),/管理帳號/);
});
