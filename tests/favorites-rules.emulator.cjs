const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');
const sdk=require('firebase/firestore');const {doc,setDoc,getDoc,getDocs,collection,updateDoc,deleteDoc,serverTimestamp,Timestamp,deleteField}=sdk;
(async()=>{
const env=await initializeTestEnvironment({projectId:'demo-family-ktv',firestore:{host:'127.0.0.1',port:8088,rules:fs.readFileSync(path.join(__dirname,'../firestore.rules'),'utf8')}});let checks=0;
const allow=async p=>{await assertSucceeds(p);checks++},deny=async p=>{await assertFails(p);checks++};
try{
await env.clearFirestore();await env.withSecurityRulesDisabled(async c=>{for(const uid of ['a','b'])await setDoc(doc(c.firestore(),'devices',uid),{label:'測試',enabled:true,createdAt:Timestamp.now(),approvedAt:Timestamp.now()});});
const anon=uid=>env.authenticatedContext(uid,{firebase:{sign_in_provider:'anonymous'}}).firestore(),a=anon('a'),b=anon('b'),pending=anon('pending'),out=env.unauthenticatedContext().firestore(),stranger=env.authenticatedContext('stranger',{firebase:{sign_in_provider:'google.com'}}).firestore();
const data=(extra={})=>({name:'爸爸愛唱',songIds:'song_a\nsong_b\n',deleted:false,createdBy:'a',createdAt:serverTimestamp(),updatedBy:'a',updatedAt:serverTimestamp(),...extra}),ref=db=>doc(db,'favoriteLists','list');
for(const db of [out,pending,stranger])await deny(getDocs(collection(db,'favoriteLists')));
await deny(setDoc(ref(pending),data({createdBy:'pending',updatedBy:'pending'})));
for(const patch of [{createdBy:'b'},{extra:'bad'},{name:'x'.repeat(41)},{songIds:[]},{songIds:'bad/id\n'},{songIds:'missing-newline'},{songIds:'x\n'.repeat(101)},{createdAt:Timestamp.fromMillis(1)}])await deny(setDoc(ref(a),data(patch)));
await allow(setDoc(ref(a),data()));await allow(getDocs(sdk.query(collection(b,'favoriteLists'),sdk.where('deleted','==',false))));await allow(updateDoc(ref(b),{name:'爸爸金曲',updatedBy:'b',updatedAt:serverTimestamp()}));
for(const patch of [{createdBy:'b'},{createdAt:Timestamp.fromMillis(1)},{songIds:42},{name:deleteField()},{extra:true},{songIds:'x'.repeat(513)+'\n'},{updatedBy:'a'}])await deny(updateDoc(ref(b),{updatedBy:'b',updatedAt:serverTimestamp(),...patch}));
await deny(deleteDoc(ref(b)));await deny(updateDoc(ref(pending),{name:'bad',updatedBy:'pending',updatedAt:serverTimestamp()}));
await env.withSecurityRulesDisabled(c=>updateDoc(doc(c.firestore(),'devices','b'),{enabled:false}));await deny(getDoc(ref(b)));await deny(updateDoc(ref(b),{name:'bad',updatedBy:'b',updatedAt:serverTimestamp()}));
await allow(updateDoc(ref(a),{deleted:true,updatedBy:'a',updatedAt:serverTimestamp()}));await deny(updateDoc(ref(a),{deleted:false,updatedBy:'a',updatedAt:serverTimestamp()}));console.log('PASS '+checks+' favorites security checks');
await env.withSecurityRulesDisabled(c=>updateDoc(doc(c.firestore(),'devices','b'),{enabled:true}));
const source=fs.readFileSync(path.join(__dirname,'../favorites-cloud.js'),'utf8').replace(/^import[^\n]+\n/,'').replace('export class CloudStore','class CloudStore');const Store=new Function(...Object.keys(sdk),'window','navigator',source+';return window.KTVFavoritesCloud;')(...Object.values(sdk),{},{onLine:true});
const wait=async fn=>{const end=Date.now()+10000;while(!fn()){if(Date.now()>end)throw Error('snapshot timeout');await new Promise(r=>setTimeout(r,25));}};
const sa=new Store({db:a,auth:{currentUser:{uid:'a'}},allowed:()=>true},()=>{}),sb=new Store({db:b,auth:{currentUser:{uid:'b'}},allowed:()=>true},()=>{});await wait(()=>sa.ready&&sb.ready);
const id=await sa.create('家人共用',{_cloudId:'song_a'});await wait(()=>sb.read().some(l=>l.id===id));await sb.add(id,{_cloudId:'song_b'});await wait(()=>sa.ready&&sa.read().find(l=>l.id===id)?.songs.length===2);await sb.move(id,'cloud:song_b',-1);await wait(()=>sa.ready&&sa.read().find(l=>l.id===id)?.songs[0].key==='cloud:song_b');await sa.rename(id,'共同金曲');await wait(()=>sb.ready&&sb.read().find(l=>l.id===id)?.name==='共同金曲');
await Promise.all([sa.add(id,{_cloudId:'song_c'}),sb.add(id,{_cloudId:'song_d'})]);await wait(()=>sa.ready&&sb.ready&&sa.read().find(l=>l.id===id)?.songs.length===4);assert.equal(new Set(sa.read().find(l=>l.id===id).songs.map(s=>s.key)).size,4);
await sb.removeSong(id,'cloud:song_c');await wait(()=>sa.ready&&sa.read().find(l=>l.id===id)?.songs.length===3);await sa.remove(id);await wait(()=>sb.ready&&!sb.read().some(l=>l.id===id));
const old=[{id:'old1',name:'本機收藏',songs:[{key:'cloud:song_a'}]}];await sa.importLocal(old);await wait(()=>sa.ready);await sa.importLocal(old);await wait(()=>sb.read().filter(l=>l.name==='本機收藏').length===1);sa.close();sb.close();console.log('PASS actual cloud adapter two-device CRUD, concurrent additions and idempotent migration');
}finally{await env.cleanup();}
})().catch(e=>{console.error(e);process.exitCode=1});
