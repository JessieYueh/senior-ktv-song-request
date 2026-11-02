const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
const base=path.join(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');const dom=new JSDOM(html,{url:'https://jessieyueh.github.io/senior-ktv-song-request/',runScripts:'outside-only'}),w=dom.window,d=w.document,played=[],commands=[],added=[],resumes=[];
w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
w.KTVPlayback=class{constructor(){this.ready=true;}play(id){played.push(id);}stop(){}resume(){resumes.push(true);}setPaused(){}toggle(){return true;}};
for(const name of ['favorites.js','catalog-sort.js','stroke-sort.js','ost-2026.js','mandarin-song-pack.js','qrcode.js'])w.eval(fs.readFileSync(path.join(base,name),'utf8'));
w.eval(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
const songs=[{_cloudId:'s1',title:'一剪梅',artist:'費玉清',lang:'國語',videoId:'obiNJajbHdw',vocalId:'e9U249EPq_M'},{_cloudId:'s2',title:'家後',artist:'江蕙',lang:'台語',videoId:'W35whQb6wE4',vocalId:'SnEko_SIf3U'}];
w.KTV_CLOUD={roomContext:()=>({}),explain:e=>e.message};w.KTV_APP.setCloudSongs(songs);w.KTV_APP.setCloudState({access:true,readReady:true,authReady:true,admin:false,user:{uid:'device',anonymous:true},count:2});
const flush=()=>new Promise(r=>setImmediate(r)),click=id=>d.getElementById(id).click(),choose=title=>[...d.querySelectorAll('#songList .song')].find(el=>el.querySelector('.songTitle').textContent===title).querySelector('button').click();
class FakeRoom{constructor(_,cb){this.cb=cb;w.testRoom=this;}emit(){this.id=this.s.id;this.cb.onState(this.s); }async leave(){this.s={mode:'local',id:'',entries:[],waiting:[]};this.emit();}async create(){this.s={mode:'tv',id:'12345678',host:true,armed:false,entries:[],waiting:[],room:{version:0,currentEntry:'',vocal:false,paused:false,leaseUntil:{toMillis:()=>Date.now()+45000}}};this.emit();}async join(id,mode){this.s={mode,id,host:mode==='tv',armed:false,entries:[{id:'e1',songId:'s1',status:'playing'}],waiting:[],room:{version:1,currentEntry:'e1',vocal:false,paused:false,leaseUntil:{toMillis:()=>Date.now()+45000}}};this.emit();}arm(){this.s.armed=true;this.s.entries=[{id:'e1',songId:'s1',status:'playing'}];this.s.room.currentEntry='e1';this.s.room.version=1;this.emit();}async enqueue(items){added.push(...items);return items.length;}async command(kind){commands.push(kind);}async editEntry(){}async advance(){}}
w.KTVRoomClient=FakeRoom;w.KTV_ROOM_READY();

const saveName=(name)=>{d.getElementById('favoriteNameInput').value=name;d.getElementById('favoriteNameForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));};
const collect=title=>[...d.querySelectorAll('#songList .song')].find(el=>el.querySelector('.songTitle').textContent===title).querySelectorAll('button')[1].click();
collect('一剪梅');click('newFavoriteTarget');saveName('爸爸愛唱');
click('openFavorites');assert.match(d.getElementById('favoriteHeading').textContent,/爸爸愛唱.*1/);
click('renameFavorite');saveName('爸爸金曲');click('closeFavorites');collect('家後');d.querySelector('#favoriteTargets button').click();click('openFavorites');
assert.equal(d.querySelectorAll('#favoriteSongs .song').length,2);
d.querySelectorAll('#favoriteSongs .song')[1].querySelectorAll('button')[1].click();assert.match(d.querySelector('#favoriteSongs .songTitle').textContent,/家後/);
click('playFavorite');await flush();assert.equal(d.getElementById('currentTitle').textContent,'家後');assert.equal(d.getElementById('queueCount').textContent,'1');assert.equal(d.getElementById('playFavorite').disabled,true);
click('closeFavorites');click('roomJoinBtn');d.getElementById('roomInput').value='12345678';click('roomJoinPhone');await flush();const before=played.length;
click('openFavorites');click('playFavorite');await flush();assert.deepEqual(added.map(s=>s.title),['家後']);assert.equal(played.length,before,'favorite batch on phone must not play locally');
d.querySelector('#favoriteSongs .song').querySelectorAll('button')[3].click();assert.equal(d.querySelectorAll('#favoriteSongs .song').length,1);
const persisted=w.localStorage.getItem('happy_ktv_favorites_v1:device');assert.match(persisted,/爸爸金曲/);
click('deleteFavorite');assert.equal(d.querySelectorAll('#favoriteSongs .song').length,0);assert.equal(JSON.parse(w.localStorage.getItem('happy_ktv_favorites_v1:device')).length,0);
assert.equal(songs.length,2,'deleting favorites preserves shared catalog');
console.log('PASS favorites UI collect/create/rename/reorder/remove/delete, local batch, duplicate skip and remote batch without local playback');w.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
