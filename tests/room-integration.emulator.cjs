const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const {initializeTestEnvironment,assertFails}=require('@firebase/rules-unit-testing'),sdk=require('firebase/firestore');
const {doc,collection,getDoc,getDocs,setDoc,updateDoc,serverTimestamp,Timestamp,query,where}=sdk;
async function until(check,label){for(let i=0;i<100;i++){if(await check())return;await new Promise(r=>setTimeout(r,80));}throw new Error('Timeout: '+label);}
(async()=>{
const base=path.join(__dirname,'..'),env=await initializeTestEnvironment({projectId:'demo-family-room',firestore:{host:'127.0.0.1',port:8088,rules:fs.readFileSync(path.join(base,'firestore.rules'),'utf8')}}),clients=[];let n=0;const deny=async p=>{await assertFails(p);n++;};
try{
await env.clearFirestore();await env.withSecurityRulesDisabled(async c=>{const db=c.firestore();await setDoc(doc(db,'admins','owner'),{enabled:true});for(const id of ['tv','a','b'])await setDoc(doc(db,'devices',id),{label:id,enabled:true,createdAt:Timestamp.now(),approvedAt:Timestamp.now()});for(let i=1;i<=15;i++)await setDoc(doc(db,'songs','s'+i),{title:'歌曲'+i,artist:'測試',lang:'國語',videoId:'W35whQb6wE4',vocalId:'',order:i,createdAt:Timestamp.now(),createdBy:'owner',updatedAt:Timestamp.now(),updatedBy:'owner'});});
const owner=env.authenticatedContext('owner',{firebase:{sign_in_provider:'google.com'}}).firestore(),out=env.unauthenticatedContext().firestore();
const scope={...sdk,window:{},crypto:webcrypto,navigator:{onLine:true},console,setInterval,clearInterval,Date,Uint8Array,Promise};new Function(...Object.keys(scope),fs.readFileSync(path.join(base,'room-sync.js'),'utf8').replace(/^import .*;\n/gm,''))(...Object.values(scope));
function make(uid){const db=env.authenticatedContext(uid,{firebase:{sign_in_provider:'anonymous'}}).firestore(),c=new scope.window.KTVRoomClient({db,auth:{currentUser:{uid}},allowed:()=>true},{onError:e=>console.log(uid+': '+e.message)});clients.push(c);return c;}
const tv=make('tv'),a=make('a'),b=make('b'),pending=make('pending');const id=await tv.create();await Promise.all([a.join(id),b.join(id)]);await until(()=>tv.room&&a.room&&b.room,'snapshots');
const root=doc(owner,'rooms',id),q=doc(a.ctx.db,'rooms',id,'queue','attack'),cmd=doc(a.ctx.db,'rooms',id,'commands','attack');const data={songId:'s1',addedBy:'a',addedAt:serverTimestamp(),index:0,status:'waiting',priority:false},command={kind:'next',targetVersion:0,createdAt:serverTimestamp(),createdBy:'a',processed:false};
await deny(getDoc(doc(out,'rooms',id)));await deny(getDocs(collection(a.ctx.db,'rooms')));await deny(pending.join(id));await deny(updateDoc(doc(a.ctx.db,'rooms',id),{hostUid:'a',hostTab:'f'.repeat(32),leaseUntil:Timestamp.fromMillis(Date.now()+45000)}));
for(const patch of [{addedBy:'other'},{songId:'missing'},{status:'playing'},{email:'private'},{index:-1}])await deny(setDoc(q,{...data,...patch}));
for(const patch of [{processed:true},{email:'private'},{targetVersion:100},{kind:'unknown'}])await deny(setDoc(cmd,{...command,...patch}));
await deny(updateDoc(root,{hostUid:'owner',hostTab:'a'.repeat(32),leaseUntil:Timestamp.fromMillis(Date.now()+999999)}));
await Promise.all([a.enqueue([{_cloudId:'s1'},{_cloudId:'s2'}]),b.enqueue([{_cloudId:'s3'},{_cloudId:'s4'}])]);await until(()=>tv.state().waiting.length===4,'concurrent append');assert.equal(tv.room.currentEntry,'');n++;
await a.enqueue(Array.from({length:8},(_,i)=>({_cloudId:'s'+(i+5)})));await until(()=>tv.state().waiting.length===12,'batch');assert.equal(tv.state().waiting.filter(e=>Number(e.songId.slice(1))>=5).map(e=>e.songId).join(','),'s5,s6,s7,s8,s9,s10,s11,s12');n++;
const first=tv.state().waiting[3];await a.editEntry(first.id,'priority');await until(()=>tv.state().waiting[0].id===first.id,'priority');await deny(updateDoc(doc(a.ctx.db,'rooms',id,'queue',first.id),{songId:'s15'}));
tv.arm();await until(()=>tv.room.version===1&&tv.room.currentEntry===first.id,'start');await until(()=>a.room.version===1&&b.room.version===1,'phone state');await deny(updateDoc(doc(a.ctx.db,'rooms',id,'queue',first.id),{status:'done'}));assert.equal(await a.advance(1),false);n++;
await Promise.all([a.command('next'),b.command('next')]);await until(async()=> (await getDocs(query(collection(owner,'rooms',id,'commands'),where('processed','==',false)))).empty,'command ack');await until(()=>tv.room.version===2,'single skip');assert.equal(tv.room.version,2);n++;
assert.equal((await Promise.all([tv.advance(2),tv.advance(2)])).filter(Boolean).length,1);n++;await until(()=>a.room.version===3,'natural end');
await a.command('pause');await until(()=>tv.room.paused,'pause');await a.command('resume');await until(()=>!tv.room.paused,'resume');n+=2;
const before=tv.room.currentEntry;await a.command('replay');await until(()=>tv.room.version===4,'replay');assert.equal(tv.room.currentEntry,before);n++;await until(()=>a.room.version===4,'replay sync');await a.command('vocal');await until(()=>tv.room.version===5&&tv.room.vocal,'vocal');n++;
await assert.rejects(b.join(id,'tv'),/已有電視播放中/);n++;await tv.leave();await b.join(id,'tv');await until(()=>b.isHost(),'handover');assert.equal(await tv.advance(5),false);n++;
await updateDoc(doc(b.ctx.db,'rooms',id),{leaseUntil:serverTimestamp()});await until(()=>b.mode==='remote','expired TV lease stops host');assert.equal(b.isHost(),false);n++;
await updateDoc(doc(owner,'devices','a'),{enabled:false});await deny(getDocs(collection(a.ctx.db,'rooms',id,'queue')));await deny(setDoc(doc(a.ctx.db,'rooms',id,'commands','revoked'),{...command,targetVersion:5}));await deny(getDocs(collection(pending.ctx.db,'rooms','badroom','queue')));
console.log('PASS '+n+' room integration/adversarial checks');
}finally{await Promise.all(clients.map(c=>c.leave(false)));await env.cleanup();}
})().catch(e=>{console.error(e);process.exitCode=1;});
