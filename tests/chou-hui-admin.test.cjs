const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../chou-hui-admin.js'),'utf8').replace(/^import .*;\r?\n/gm,'');
function fixture(entries,existing=[],failCommit=false){
 const nodes=new Map(),requests=[],writes=[],transactionReads=[];let reads=0;
 const element=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',disabled:false,value:'all'});return nodes.get(id);};
 const fields=s=>({name:'projects/ktvdata-da16f/databases/(default)/documents/songs/'+s.id,fields:Object.fromEntries(Object.entries(s).filter(([k])=>k!=='id').map(([k,v])=>[k,{stringValue:v}]))});
 const sandbox={getFirestore:()=>({}),doc:(_,collection,id)=>({id}),serverTimestamp:()=>({timestamp:true}),runTransaction:async(_,operation)=>{const pending=[];const result=await operation({get:async ref=>{transactionReads.push(ref.id);const value=existing.find(s=>s.id===ref.id);return {exists:()=>!!value,data:()=>value};},set:(ref,data)=>pending.push({id:ref.id,...data})});if(failCommit)throw Error('ABORTED');writes.push(...pending);return result;},document:{getElementById:element},location:{origin:'https://jessieyueh.github.io'},initializeApp:()=>({}),getAuth:()=>({currentUser:{uid:'manager',getIdToken:async()=>'test-token'}}),GoogleAuthProvider:class{},signInWithPopup:async()=>{},onAuthStateChanged:()=>{},KTV_CHOU_HUI:{entries},KTV_VERIFY_CHOU_HUI:{},setTimeout,Blob,URL,fetch:async(url,options)=>{
  const body=options.body?JSON.parse(options.body):{};requests.push({url,body});
  if(url.endsWith(':beginTransaction'))return {ok:true,json:async()=>({transaction:'tx'})};
  if(url.endsWith(':runQuery')){reads++;return {ok:true,json:async()=>[...existing,...writes].map(s=>({document:fields(s)}))};}
  if(url.endsWith(':commit')){if(failCommit)return {ok:false,json:async()=>({error:{message:'ABORTED'}})};writes.push(...body.writes);return {ok:true,json:async()=>({writeResults:writes.map(()=>({}))})};}
  return {ok:true,json:async()=>({})};
 }};
 vm.createContext(sandbox);vm.runInContext(source+'\n globalThis.configure=(rs)=>{admin=true;results=rs;}; globalThis.getReport=()=>report;',sandbox);
 sandbox.configure(entries.map(e=>({ok:true,title:e.title,videoId:e.videoId,seconds:250})));
 return {sandbox,nodes,requests,writes,transactionReads,run:()=>element('import').onclick(),reads:()=>reads};
}
const song=(title='約定',videoId='abcdefghijk')=>({title,artist:'周蕙',lang:'國語',videoId,vocalId:''});
test('reads full server collection and rechecks legacy and target documents before adding',async()=>{const f=fixture([song()],[{id:'legacy',title:'別首歌',artist:'別人'}]);await f.run();assert.equal(f.writes.length,1);assert.deepEqual(f.transactionReads,['legacy','yt_abcdefghijk']);assert.equal(f.reads(),2);assert.equal(f.sandbox.getReport().confirmed,1);});
test('legacy ID, same normalized title and duet artist are preserved',async()=>{const f=fixture([song('約 定！')],[{id:'legacy',title:'約定',artist:'周蕙 feat. 其他',videoId:'different11'}]);await f.run();assert.equal(f.writes.length,0);assert.equal(f.transactionReads.length,0);});
test('existing vocal/video IDs and duplicate candidates cannot create duplicates',async()=>{const a=song(),f=fixture([a,{...a,title:'另一歌名'}],[{id:'legacy',title:'原歌名',artist:'原歌手',videoId:'',vocalId:a.videoId}]);await f.run();assert.equal(f.writes.length,0);const g=fixture([a,{...a,title:'另一歌名'}]);await g.run();assert.equal(g.writes.length,1);});
test('no actual playback passes means no transaction',async()=>{const f=fixture([song()]);f.sandbox.configure([]);await f.run();assert.equal(f.requests.length,0);assert.equal(f.writes.length,0);});
test('transaction conflict reports no success',async()=>{const f=fixture([song()],[],true);await f.run();assert.equal(f.writes.length,0);assert.equal(f.sandbox.getReport().committed,0);assert.match(f.nodes.get('log').textContent,/ABORTED/);});
test('an occupied target ID never overwrites a different song',async()=>{const f=fixture([song()],[{id:'yt_abcdefghijk',title:'另一首歌',artist:'別人',videoId:'other000001'}]);await f.run();assert.equal(f.writes.length,0);});
test('large eligible lists import at most 100 per batch and resume without repeating',async()=>{const songs=Array.from({length:101},(_,i)=>song('歌曲'+i,'vid'+String(i).padStart(8,'0'))),f=fixture(songs);await f.run();assert.equal(f.writes.length,100);assert.equal(f.sandbox.getReport().deferredToNextBatch,1);await f.run();assert.equal(f.writes.length,101);assert.equal(new Set(f.writes.map(s=>s.id)).size,101);assert.equal(f.sandbox.getReport().confirmed,101);});
