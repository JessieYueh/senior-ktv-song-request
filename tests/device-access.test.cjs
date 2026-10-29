const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function fixture(){
 const source=fs.readFileSync(path.join(__dirname,'../cloud.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace('export function explain','function explain');
 const listeners=[],states=[],catalogs=[],records=new Map();let onUser;const auth={currentUser:null};
 const snap=(id,data,metadata={fromCache:false,hasPendingWrites:false})=>({id,exists:()=>!!data,data:()=>data,metadata});
 const ctx={console,navigator:{onLine:true},setTimeout:()=>{},window:{addEventListener:()=>{},KTV_APP:{setCloudState:s=>states.push(s),setCloudSongs:s=>catalogs.push(s)}},initializeApp:()=>({}),getAuth:()=>auth,getFirestore:()=>({}),collection:(_,name)=>({name}),doc:(_,name,id)=>({name,id}),GoogleAuthProvider:class{},signInWithPopup:async()=>{},signOut:async()=>{},onAuthStateChanged:(_,cb)=>onUser=cb,signInAnonymously:async()=>{const u={uid:'anonymous-device-A',isAnonymous:true};auth.currentUser=u;onUser(u);return {user:u};},serverTimestamp:()=>123,onSnapshot:(ref,options,callback,error)=>{if(typeof options==='function'){error=callback;callback=options;}const l={ref,callback,error,stopped:false};listeners.push(l);return ()=>{l.stopped=true;};},runTransaction:async(_,op)=>op({get:async r=>snap(r.id,records.get(r.name+'/'+r.id)),set:(r,d)=>records.set(r.name+'/'+r.id,d),update:(r,d)=>records.set(r.name+'/'+r.id,{...records.get(r.name+'/'+r.id),...d})})};
 vm.runInNewContext(source,ctx);
 return {api:ctx.window.KTV_CLOUD,states,catalogs,records,listeners,snap,state:()=>states.at(-1),login(user){auth.currentUser=user;onUser(user);},listener(name){return listeners.findLast(l=>l.ref.name===name&&!l.stopped);}};
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
