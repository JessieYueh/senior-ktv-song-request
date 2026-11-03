const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../chou-hui-admin.js'),'utf8').replace(/^import .*;\r?\n/gm,'');
function fixture(entries,existing=[],failCommit=false){
 const nodes=new Map(),requests=[],writes=[];let reads=0;
 const element=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',disabled:false,value:'all'});return nodes.get(id);};
 const fields=s=>({name:'projects/ktvdata-da16f/databases/(default)/documents/songs/'+s.id,fields:Object.fromEntries(Object.entries(s).filter(([k])=>k!=='id').map(([k,v])=>[k,{stringValue:v}]))});
 const sandbox={document:{getElementById:element},location:{origin:'https://jessieyueh.github.io'},initializeApp:()=>({}),getAuth:()=>({currentUser:{uid:'manager',getIdToken:async()=>'test-token'}}),GoogleAuthProvider:class{},signInWithPopup:async()=>{},onAuthStateChanged:()=>{},KTV_CHOU_HUI:{entries},KTV_VERIFY_CHOU_HUI:{},setTimeout,Blob,URL,fetch:async(url,options)=>{
  const body=options.body?JSON.parse(options.body):{};requests.push({url,body});
  if(url.endsWith(':beginTransaction'))return {ok:true,json:async()=>({transaction:'tx'})};
  if(url.endsWith(':runQuery')){reads++;return {ok:true,json:async()=>[...(body.newTransaction?[{transaction:'tx'}]:[]),...[...existing,...writes.map(w=>({id:w.update.name.split('/').pop(),...Object.fromEntries(Object.entries(w.update.fields).map(([k,v])=>[k,v.stringValue||v.integerValue]))}))].map(s=>({document:fields(s)}))]};}
  if(url.endsWith(':commit')){if(failCommit)return {ok:false,json:async()=>({error:{message:'ABORTED'}})};writes.push(...body.writes);return {ok:true,json:async()=>({writeResults:writes.map(()=>({}))})};}
  return {ok:true,json:async()=>({})};
 }};
 vm.createContext(sandbox);vm.runInContext(source+'\n globalThis.configure=(rs)=>{admin=true;results=rs;}; globalThis.getReport=()=>report;',sandbox);
 sandbox.configure(entries.map(e=>({ok:true,title:e.title,videoId:e.videoId,seconds:250})));
 return {sandbox,nodes,requests,writes,run:()=>element('import').onclick(),reads:()=>reads};
}
const song=(title='約定',videoId='abcdefghijk')=>({title,artist:'周蕙',lang:'國語',videoId,vocalId:''});
test('reads full collection inside transaction and only creates, then confirms on server',async()=>{const f=fixture([song()]);await f.run();assert.equal(f.writes.length,1);assert.ok(f.requests.find(r=>r.url.endsWith(':runQuery')).body.newTransaction.readWrite);assert.equal(f.requests.find(r=>r.url.endsWith(':commit')).body.transaction,'tx');assert.equal(f.writes[0].currentDocument.exists,false);assert.equal(f.reads(),2);assert.equal(f.sandbox.getReport().confirmed,1);});
test('legacy ID, same normalized title and duet artist are preserved',async()=>{const f=fixture([song('約 定！')],[{id:'legacy',title:'約定',artist:'周蕙 feat. 其他',videoId:'different11'}]);await f.run();assert.equal(f.writes.length,0);assert.ok(f.requests.some(r=>r.url.endsWith(':rollback')));});
test('existing vocal/video IDs and duplicate candidates cannot create duplicates',async()=>{const a=song(),f=fixture([a,{...a,title:'另一歌名'}],[{id:'legacy',title:'原歌名',artist:'原歌手',videoId:'',vocalId:a.videoId}]);await f.run();assert.equal(f.writes.length,0);const g=fixture([a,{...a,title:'另一歌名'}]);await g.run();assert.equal(g.writes.length,1);});
test('no actual playback passes means no transaction',async()=>{const f=fixture([song()]);f.sandbox.configure([]);await f.run();assert.equal(f.requests.length,0);assert.equal(f.writes.length,0);});
test('transaction conflict reports no success and rolls back',async()=>{const f=fixture([song()],[],true);await f.run();assert.equal(f.writes.length,0);assert.equal(f.sandbox.getReport().committed,0);assert.match(f.nodes.get('log').textContent,/ABORTED/);assert.ok(f.requests.some(r=>r.url.endsWith(':rollback')));});
