// Dependency-free contract checks for migration and client write handling.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'cloud.js'), 'utf8').replace(/^import .*;\n/gm, '').replace('export function explain', 'function explain');
function fixture({signedIn=true, admin=true, failCommit=false}={}) {
  const data = new Map(), states = [], auth = {currentUser: signedIn ? {uid:'manager',email:'manager@example.test'} : null};
  const snapshot = (id, value) => ({id, exists:()=>!!value, data:()=>value});
  const sandbox = {
    window:{KTV_APP:{setCloudState:s=>states.push(s),setCloudSongs:()=>{}},addEventListener:()=>{}},
    navigator:{onLine:true},setTimeout:()=>0,console,
    initializeApp:()=>({}),getAuth:()=>auth,getFirestore:()=>({}),
    collection:(_,name)=>({name}),doc:(_,name,id)=>({name,id}),
    GoogleAuthProvider: class {},signInWithPopup:async()=>{},signOut:async()=>{},
    onAuthStateChanged:(_,callback)=>callback(auth.currentUser),
    onSnapshot:(ref, options, cb)=>{
      if(ref.name==='admins') options(snapshot(ref.id,{enabled:admin}));
      else cb({metadata:{fromCache:false,hasPendingWrites:false},docs:[]});
      return ()=>{};
    },
    serverTimestamp:()=>({serverTimestamp:true}),
    runTransaction:async(_,operation)=>{
      const pending=[];
      const result=await operation({get:async ref=>snapshot(ref.id,data.get(ref.id)),set:(ref,value)=>pending.push([ref.id,value])});
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
