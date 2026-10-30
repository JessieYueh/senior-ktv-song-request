/* Family rooms: only the active TV advances playback. No Google profile is stored. */
import { doc, collection, query, where, getDocFromServer, onSnapshot, runTransaction, serverTimestamp, Timestamp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
const randomHex=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),b=>b.toString(16).padStart(2,'0')).join('');
const orderEntries=items=>[...items].sort((a,b)=>Number(b.priority)-Number(a.priority)||(a.addedAt?.toMillis?.()||0)-(b.addedAt?.toMillis?.()||0)||a.index-b.index||a.id.localeCompare(b.id));
class RoomClient {
  constructor(context,callbacks={}){this.ctx=context;this.cb=callbacks;this.tab=randomHex(16);this.epoch=0;this.stops=[];this.mode='local';this.id='';this.room=null;this.entries=[];this.commands=[];this.armed=false;this.busy=false;this.acked=new Set();}
  require(){if(!this.ctx.allowed()||!this.ctx.auth.currentUser)throw new Error('請先取得裝置授權。');if(!navigator.onLine)throw new Error('包廂同步需要網路連線，請連線後重試。');}
  uid(){return this.ctx.auth.currentUser?.uid;}
  ref(){return doc(this.ctx.db,'rooms',this.id);}
  isHost(){return this.mode==='tv'&&this.room?.hostUid===this.uid()&&this.room?.hostTab===this.tab&&(this.room?.leaseUntil?.toMillis?.()||0)>Date.now();}
  state(){return {mode:this.mode,id:this.id,room:this.room,entries:orderEntries(this.entries),waiting:orderEntries(this.entries.filter(e=>e.status==='waiting')),host:this.isHost(),armed:this.armed};}
  emit(){this.cb.onState?.(this.state());}
  async leave(release=true){
    const old=this.id,wasHost=this.isHost();++this.epoch;this.stops.forEach(s=>s());this.stops=[];clearInterval(this.heartbeat);clearInterval(this.expiry);
    this.mode='local';this.id='';this.room=null;this.entries=[];this.commands=[];this.armed=false;this.acked.clear();this.busy=false;this.emit();
    if(release&&wasHost&&this.ctx.allowed())try{const ref=doc(this.ctx.db,'rooms',old);await runTransaction(this.ctx.db,async tx=>{const snap=await tx.get(ref);if(snap.exists()&&snap.data().hostUid===this.uid()&&snap.data().hostTab===this.tab)tx.update(ref,{leaseUntil:serverTimestamp()});});}catch{/* Lease expires automatically even when release cannot be delivered. */}
  }
  async create(){
    this.require();await this.leave();
    for(let attempt=0;attempt<3;attempt++){
      const id=randomHex(4),ref=doc(this.ctx.db,'rooms',id);
      const made=await runTransaction(this.ctx.db,async tx=>{const s=await tx.get(ref);if(s.exists())return false;tx.set(ref,{hostUid:this.uid(),hostTab:this.tab,leaseUntil:Timestamp.fromMillis(Date.now()+45000),createdAt:serverTimestamp(),version:0,currentEntry:'',paused:false,vocal:false});return true;});
      if(made){await this.join(id,'tv');return id;}
    }throw new Error('暫時無法建立包廂，請重試。');
  }
  async join(value,mode='remote'){
    this.require();const id=String(value||'').trim().toLowerCase();if(!/^[a-f0-9]{8}$/.test(id))throw new Error('請輸入電視顯示的 8 碼包廂代碼。');
    await this.leave();const ref=doc(this.ctx.db,'rooms',id);const snap=await getDocFromServer(ref);if(!snap.exists())throw new Error('找不到這個包廂，請確認代碼。');
    if(mode==='tv')await runTransaction(this.ctx.db,async tx=>{const s=await tx.get(ref),r=s.data();if(r.leaseUntil.toMillis()>Date.now()&&(r.hostUid!==this.uid()||r.hostTab!==this.tab))throw new Error('此包廂已有電視播放中。請先在原電視離開包廂，或等候約 45 秒後重試。');tx.update(ref,{hostUid:this.uid(),hostTab:this.tab,leaseUntil:Timestamp.fromMillis(Date.now()+45000)});});
    this.id=id;this.mode=mode;this.room=null;const epoch=++this.epoch;
    const valid=s=>epoch===this.epoch&&this.ctx.allowed()&&!s.metadata.fromCache&&!s.metadata.hasPendingWrites;
    const fail=error=>{if(epoch!==this.epoch)return;this.cb.onError?.(error);this.leave(false);};
    this.stops.push(onSnapshot(ref,{includeMetadataChanges:true},s=>{if(!valid(s))return;if(!s.exists()){fail(new Error('包廂已不存在。'));return;}this.room=s.data();if(this.mode==='tv'&&!this.isHost())this.loseHost();this.emit();this.pump();},fail));
    this.stops.push(onSnapshot(query(collection(ref,'queue'),where('status','in',['waiting','playing'])),{includeMetadataChanges:true},s=>{if(!valid(s))return;this.entries=s.docs.map(d=>({...d.data(),id:d.id}));this.emit();this.pump();},fail));
    if(mode==='tv'){
      this.stops.push(onSnapshot(query(collection(ref,'commands'),where('processed','==',false)),{includeMetadataChanges:true},s=>{if(!valid(s))return;this.commands=s.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>a.createdAt.toMillis()-b.createdAt.toMillis()||a.id.localeCompare(b.id));this.pump();},fail));
      this.heartbeat=setInterval(()=>this.renew().catch(e=>{this.cb.onError?.(e);this.loseHost();}),15000);
      this.expiry=setInterval(()=>{if(this.mode==='tv'&&this.room&&!this.isHost())this.loseHost();},1000);
    }this.emit();
  }
  loseHost(){if(this.mode!=='tv')return;this.mode='remote';this.armed=false;clearInterval(this.heartbeat);clearInterval(this.expiry);this.cb.onHostLost?.();this.emit();}
  async renew(){this.require();if(!this.isHost())throw new Error('電視播放權已到期，請重新選擇電視播放模式。');const ref=this.ref();await runTransaction(this.ctx.db,async tx=>{const s=await tx.get(ref),r=s.data();if(r.hostUid!==this.uid()||r.hostTab!==this.tab||r.leaseUntil.toMillis()<=Date.now())throw new Error('電視播放權已移轉。');tx.update(ref,{leaseUntil:Timestamp.fromMillis(Date.now()+45000)});});}
  arm(){this.require();if(!this.isHost())throw new Error('請先取得此包廂的電視播放權。');this.armed=true;this.emit();this.pump();}
  async enqueue(songs){
    this.require();if(!this.id)throw new Error('請先加入包廂。');if(!songs.length||songs.length>100)throw new Error('每次請加入 1 到 100 首歌曲。');
    if(this.entries.filter(e=>e.status==='waiting').length+songs.length>100)throw new Error('待唱最多 100 首，請唱完一些歌曲後再加入。');
    if(songs.some(s=>!s._cloudId||s._cloudId.includes('/')||s._cloudId.length>512))throw new Error('歌曲尚未在雲端歌本，請管理者先儲存。');
    const epoch=this.epoch,ref=this.ref();let added=0;
    // Small atomic chunks stay within Firestore rules document-access limits.
    try{for(let offset=0;offset<songs.length;offset+=5){if(epoch!==this.epoch)throw new Error('包廂已切換。');const chunk=songs.slice(offset,offset+5);await runTransaction(this.ctx.db,async tx=>{const room=await tx.get(ref);if(!room.exists())throw new Error('包廂不存在。');chunk.forEach((song,index)=>tx.set(doc(collection(ref,'queue')),{songId:song._cloudId,addedBy:this.uid(),addedAt:serverTimestamp(),index:offset+index,status:'waiting',priority:false}));});added+=chunk.length;}return added;}
    catch(e){throw new Error('已加入 '+added+' 首；其餘尚未加入。'+e.message);}
  }
  async editEntry(id,action){this.require();const ref=doc(this.ref(),'queue',id);await runTransaction(this.ctx.db,async tx=>{const s=await tx.get(ref);if(!s.exists()||s.data().status!=='waiting')throw new Error('此歌曲已開始播放或已移除。');tx.update(ref,action==='priority'?{priority:true}:{status:'removed'});});}
  async command(kind){
    this.require();if(!['next','pause','resume','replay','vocal'].includes(kind))throw new Error('不支援的控制指令。');const ref=this.ref(),targetVersion=this.room?.version;if(!Number.isInteger(targetVersion))throw new Error('包廂尚未完成同步。');
    await runTransaction(this.ctx.db,async tx=>{const s=await tx.get(ref);if(!s.exists())throw new Error('包廂不存在。');tx.set(doc(collection(ref,'commands')),{kind,targetVersion,createdAt:serverTimestamp(),createdBy:this.uid(),processed:false});});
  }
  async advance(expectedVersion,command=null){
    this.require();if(!this.isHost()||!this.armed)return false;
    const ref=this.ref(),epoch=this.epoch,candidate=this.state().waiting[0];
    const result=await runTransaction(this.ctx.db,async tx=>{
      const snap=await tx.get(ref),r=snap.data();if(epoch!==this.epoch||r.hostUid!==this.uid()||r.hostTab!==this.tab||r.leaseUntil.toMillis()<=Date.now())throw new Error('電視播放權已失效。');
      const cmdRef=command?doc(ref,'commands',command.id):null;const cmd=cmdRef?await tx.get(cmdRef):null;
      if(cmdRef&&(!cmd.exists()||cmd.data().processed))return false;
      if(r.version!==expectedVersion){if(cmdRef)tx.update(cmdRef,{processed:true});return false;}
      const oldRef=r.currentEntry?doc(ref,'queue',r.currentEntry):null,newRef=candidate?doc(ref,'queue',candidate.id):null;
      const old=oldRef?await tx.get(oldRef):null,chosen=newRef?await tx.get(newRef):null;
      if(epoch!==this.epoch)throw new Error('包廂已切換。');
      const next=chosen?.exists()&&chosen.data().status==='waiting'?candidate.id:'';
      if(old?.exists()&&old.data().status==='playing')tx.update(oldRef,{status:'done'});
      if(next)tx.update(newRef,{status:'playing'});
      tx.update(ref,{currentEntry:next,version:r.version+1,paused:false,vocal:false});if(cmdRef)tx.update(cmdRef,{processed:true});return true;
    });if(command)this.acked.add(command.id);return result;
  }
  async process(command){
    if(command.kind==='next')return this.advance(command.targetVersion,command);
    const ref=this.ref(),cmdRef=doc(ref,'commands',command.id),epoch=this.epoch;
    await runTransaction(this.ctx.db,async tx=>{const snap=await tx.get(ref),cmd=await tx.get(cmdRef),r=snap.data();if(epoch!==this.epoch||r.hostUid!==this.uid()||r.hostTab!==this.tab||r.leaseUntil.toMillis()<=Date.now())throw new Error('電視播放權已失效。');if(!cmd.exists()||cmd.data().processed)return;
      if(r.version===command.targetVersion){const patch=command.kind==='pause'?{paused:true}:command.kind==='resume'?{paused:false}:command.kind==='vocal'?{vocal:!r.vocal,version:r.version+1}:{version:r.version+1};tx.update(ref,patch);}tx.update(cmdRef,{processed:true});});this.acked.add(command.id);
  }
  async pump(){
    if(!this.isHost()||!this.armed)return;if(this.busy){this.repump=true;return;}this.busy=true;this.repump=false;
    try{const command=this.commands.find(c=>!this.acked.has(c.id));if(command){await this.process(command);this.repump=true;}else if(!this.room.currentEntry&&!this.room.paused&&this.state().waiting.length)await this.advance(this.room.version);}
    catch(error){this.cb.onError?.(error);}finally{this.busy=false;if(this.repump){this.repump=false;Promise.resolve().then(()=>this.pump());}}
  }
}
window.KTVRoomClient=RoomClient;
