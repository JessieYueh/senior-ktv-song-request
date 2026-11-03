const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function fixture({failCommit=false,beforeTransaction}={}){
 const source=fs.readFileSync(path.join(__dirname,'../cloud.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace('export function explain','function explain');
 const listeners=[],states=[],catalogs=[],records=new Map(),events={};let onUser;const auth={currentUser:null};
 const snap=(id,data,metadata={fromCache:false,hasPendingWrites:false})=>({id,exists:()=>!!data,data:()=>data,metadata});
 const ctx={console,navigator:{onLine:true},setTimeout:()=>{},window:{addEventListener:(name,callback)=>events[name]=callback,KTV_APP:{setCloudState:s=>states.push(s),setCloudSongs:s=>catalogs.push(s)}},initializeApp:()=>({}),getAuth:()=>auth,getFirestore:()=>({}),collection:(_,name)=>({name}),doc:(_,name,id)=>({name,id}),GoogleAuthProvider:class{},signInWithPopup:async()=>{},signOut:async()=>{},onAuthStateChanged:(_,cb)=>onUser=cb,signInAnonymously:async()=>{const u={uid:'anonymous-device-A',isAnonymous:true};auth.currentUser=u;onUser(u);return {user:u};},serverTimestamp:()=>123,onSnapshot:(ref,options,callback,error)=>{if(typeof options==='function'){error=callback;callback=options;}const l={ref,callback,error,stopped:false};listeners.push(l);return ()=>{l.stopped=true;};},runTransaction:async(_,op)=>{beforeTransaction?.(records);const pending=[];const result=await op({get:async r=>snap(r.id,records.get(r.name+'/'+r.id)),set:(r,d)=>pending.push(()=>records.set(r.name+'/'+r.id,d)),update:(r,d)=>pending.push(()=>records.set(r.name+'/'+r.id,{...records.get(r.name+'/'+r.id),...d})),delete:r=>pending.push(()=>records.delete(r.name+'/'+r.id))});if(failCommit)throw Object.assign(new Error('write rejected'),{code:'permission-denied'});pending.forEach(apply=>apply());return result;}};
 vm.runInNewContext(source,ctx);
 return {api:ctx.window.KTV_CLOUD,states,catalogs,records,listeners,snap,events,state:()=>states.at(-1),login(user){auth.currentUser=user;onUser(user);},listener(name){return listeners.findLast(l=>l.ref.name===name&&!l.stopped);}};
}
test('signed-out/pending devices never subscribe to songs; request stores no Google profile and is idempotent',async()=>{
 const f=fixture();f.login(null);assert.equal(f.listener('songs'),undefined);
 await f.api.requestDevice('客廳平板');const d=f.records.get('devices/anonymous-device-A');assert.deepEqual(Object.keys(d).sort(),['approvedAt','createdAt','enabled','label']);assert.equal(d.enabled,false);assert.equal(d.approvedAt,null);assert.equal(f.listener('songs'),undefined);
 await f.api.requestDevice('另一個名字');assert.equal(f.records.size,1);assert.equal(d.label,'客廳平板');await assert.rejects(f.api.setDeviceEnabled('anonymous-device-A',true),/管理帳號/);
});
test('cached approval cannot unlock; live approval loads songs; revocation clears and ignores stale snapshots',async()=>{
 const f=fixture();f.login({uid:'device',isAnonymous:true});const device=f.listener('devices');
 device.callback(f.snap('device',{enabled:true,label:'客廳平板'},{fromCache:true,hasPendingWrites:false}));assert.equal(f.state().access,false);
 device.callback(f.snap('device',{enabled:true,label:'客廳平板'}));assert.equal(f.state().access,true);const songs=f.listener('songs');songs.callback({metadata:{fromCache:false,hasPendingWrites:false},docs:[f.snap('s',{title:'家後',artist:'江蕙'})]});assert.equal(f.state().count,1);
 device.callback(f.snap('device',{enabled:false,label:'客廳平板'}));assert.equal(f.state().access,false);assert.equal(f.state().count,0);assert.equal(f.catalogs.at(-1).length,0);
 songs.callback({metadata:{fromCache:false,hasPendingWrites:false},docs:[f.snap('s',{title:'家後',artist:'江蕙'})]});assert.equal(f.catalogs.at(-1).length,0);
});
test('Google identity is not itself permission and profile data is not exposed in app state',()=>{
 const f=fixture();f.login({uid:'google-user',email:'private@example.test',displayName:'Private Name',photoURL:'private',isAnonymous:false});f.listener('admins').callback(f.snap('google-user',{enabled:false}));assert.equal(f.state().access,false);assert.equal(f.listener('songs'),undefined);assert.deepEqual(Object.keys(f.state().user).sort(),['anonymous','uid']);
});

function manager(f){
 f.login({uid:'owner',isAnonymous:false});f.listener('admins').callback(f.snap('owner',{enabled:true}));
 f.listener('songs').callback({metadata:{fromCache:false,hasPendingWrites:false},docs:[]});
 f.listener('devices').callback({metadata:{fromCache:false,hasPendingWrites:false},docs:[...f.records].filter(([key])=>key.startsWith('devices/')).map(([key,data])=>f.snap(key.slice(8),data))});
}
function devices(f){
 f.records.set('devices/old',{label:'客廳電視',enabled:true,createdAt:1,approvedAt:2});
 f.records.set('devices/new',{label:'重新申請',enabled:false,createdAt:3,approvedAt:null});
}
test('admin replaces a lost browser identity atomically, preserving nickname and new creation time',async()=>{
 const f=fixture();devices(f);manager(f);await f.api.replaceDevice('old','new');
 assert.equal(f.records.has('devices/old'),false);const next=f.records.get('devices/new');assert.equal(next.label,'客廳電視');assert.equal(next.enabled,true);assert.equal(next.createdAt,3);assert.equal(next.approvedAt,123);assert.equal(f.state().deviceBusy,false);
});
test('failed replacement commits neither approval nor deletion and permits a retry',async()=>{
 const f=fixture({failCommit:true});devices(f);manager(f);await assert.rejects(f.api.replaceDevice('old','new'),/write rejected/);
 assert.equal(f.records.get('devices/old').enabled,true);assert.equal(f.records.get('devices/new').enabled,false);assert.equal(f.state().deviceBusy,false);
});
test('replacement rejects same UID, already processed target and concurrently deleted old record',async()=>{
 const f=fixture();devices(f);manager(f);await assert.rejects(f.api.replaceDevice('old','old'),/同一代碼/);
 f.records.get('devices/new').enabled=true;await assert.rejects(f.api.replaceDevice('old','new'),/已被處理/);assert.equal(f.records.has('devices/old'),true);
 f.records.get('devices/new').enabled=false;f.records.delete('devices/old');await assert.rejects(f.api.replaceDevice('old','new'),/已變動/);assert.equal(f.records.get('devices/new').enabled,false);
});
test('delete and replace reject anonymous users, unsynced lists and malformed paths',async()=>{
 const f=fixture();devices(f);f.login({uid:'old',isAnonymous:true});
 await assert.rejects(f.api.deleteDevice('old'),/管理帳號/);await assert.rejects(f.api.replaceDevice('old','new'),/管理帳號/);
 manager(f);f.api.retry();f.listener('admins').callback(f.snap('owner',{enabled:true}));f.listener('songs').callback({metadata:{fromCache:false,hasPendingWrites:false},docs:[]});
 await assert.rejects(f.api.deleteDevice('old'),/名單尚未同步/);await assert.rejects(f.api.deleteDevice('devices/old'),/不正確/);assert.equal(f.records.size,2);
});
test('admin deletion removes only selected device; live deletion revokes access and a new request stays pending',async()=>{
 const f=fixture();devices(f);f.records.set('songs/keep',{title:'家後'});manager(f);await f.api.deleteDevice('old');assert.equal(f.records.has('devices/old'),false);assert.equal(f.records.has('devices/new'),true);assert.equal(f.records.has('songs/keep'),true);
 const user=fixture();user.login({uid:'anonymous-device-A',isAnonymous:true});const listener=user.listener('devices');listener.callback(user.snap('anonymous-device-A',{label:'電視',enabled:true}));assert.equal(user.state().access,true);
 listener.callback(user.snap('anonymous-device-A',null));assert.equal(user.state().access,false);await user.api.requestDevice('電視');assert.equal(user.records.get('devices/anonymous-device-A').enabled,false);
});
test('same browser UID can be reapproved without duplicate records',async()=>{
 const f=fixture();devices(f);f.records.get('devices/old').enabled=false;manager(f);await f.api.setDeviceEnabled('old',true);assert.equal(f.records.size,2);assert.equal(f.records.get('devices/old').enabled,true);
});

test('network recovery rechecks the original anonymous identity without another request or UID',()=>{
 const f=fixture();f.login({uid:'same-browser',isAnonymous:true});f.listener('devices').callback(f.snap('same-browser',{label:'電視',enabled:true}));
 f.listener('songs').error(Object.assign(Error('offline'),{code:'unavailable'}));assert.equal(f.state().access,false);assert.equal(f.state().device.enabled,true);
 f.events.online();assert.equal(f.state().user.uid,'same-browser');assert.equal(f.listener('devices').ref.id,'same-browser');
 f.listener('devices').callback(f.snap('same-browser',{label:'電視',enabled:true}));assert.equal(f.state().access,true);assert.equal(f.records.size,0);
});
