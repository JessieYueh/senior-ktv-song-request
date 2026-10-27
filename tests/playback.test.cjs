const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function fixture(){
  const instances=[],nodes=[];
  const container={textContent:'',replaceChildren(node){nodes.push(node);}};
  const document={createElement:()=>({setAttribute(){}})};
  const root={YT:{PlayerState:{PLAYING:1,PAUSED:2,ENDED:0}}};
  class Player {
    constructor(host,options){this.options=options;this.id=options.videoId;this.state=-1;this.loads=[];this.destroyed=false;this.iframe={setAttribute(){}};instances.push(this);}
    ready(){this.options.events.onReady({target:this});}
    loadVideoById(id){this.id=id;this.loads.push(id);this.state=-1;}
    getVideoUrl(){return 'https://www.youtube.com/watch?v='+this.id;}
    getIframe(){return this.iframe;}
    getPlayerState(){return this.state;}
    pauseVideo(){this.state=2;}
    playVideo(){this.state=1;}
    destroy(){this.destroyed=true;}
    emit(state){this.state=state;this.options.events.onStateChange({target:this,data:state});}
  }
  root.YT.Player=Player;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../playback.js'),'utf8'),{window:root,document,URL,location:{origin:'https://example.test'},setTimeout,clearTimeout});
  return {Playback:root.KTVPlayback,instances,container};
}
test('natural end advances the queue once, reuses player and final end stops',async()=>{
  const f=fixture(),queue=['video000002','video000003'];let advances=0;
  const playback=new f.Playback(f.container,{onEnded(){advances++;if(queue.length)playback.play(queue.shift(),'next');else playback.stop();}});
  await playback.play('video000001','first');const p=f.instances[0];p.ready();p.emit(1);p.emit(0);
  assert.equal(p.loads.at(-1),'video000002');assert.equal(advances,1);
  p.emit(0);assert.equal(advances,1,'duplicate end must not skip another song');
  p.emit(1);p.emit(0);assert.equal(p.loads.at(-1),'video000003');
  p.emit(1);p.emit(0);assert.equal(advances,3);assert.equal(p.destroyed,true);assert.equal(f.instances.length,1);
  p.emit(0);assert.equal(advances,3,'destroyed player events ignored');
});
test('manual skip ignores late events from previous video and pause/buffering do not advance',async()=>{
  const f=fixture();let advances=0;const playback=new f.Playback(f.container,{onEnded(){advances++;}});
  await playback.play('video000001','one');const p=f.instances[0];p.ready();p.emit(1);
  await playback.play('video000002','two');p.id='video000001';p.emit(0);assert.equal(advances,0);
  p.id='video000002';p.emit(1);p.emit(2);p.emit(3);assert.equal(advances,0);p.emit(0);assert.equal(advances,1);
});
test('same song queued twice still needs a new playing event before ending again',async()=>{
  const f=fixture();let advances=0;const playback=new f.Playback(f.container,{onEnded(){advances++;playback.play('video000001','again');}});
  await playback.play('video000001','one');const p=f.instances[0];p.ready();p.emit(1);p.emit(0);p.emit(0);assert.equal(advances,1);p.emit(1);p.emit(0);assert.equal(advances,2);
});
test('selection during initialization uses latest song; stopping cancels pending creation',async()=>{
  const f=fixture();const playback=new f.Playback(f.container);await playback.play('video000001','one');const p=f.instances[0];await playback.play('video000002','two');p.ready();assert.equal(p.loads.at(-1),'video000002');
  const pending=playback.play('video000003','three');playback.stop();await pending;p.ready();assert.equal(playback.player,null);
  const other=new f.Playback(f.container);const pendingOther=other.play('video000004','four');other.stop();await pendingOther;assert.equal(f.instances.length,1);
});
test('pause button follows actual player state, and blocked autoplay offers resume',async()=>{
  const f=fixture();let blocked=0,playing=0;const playback=new f.Playback(f.container,{onBlocked:()=>blocked++,onPlaying:()=>playing++});await playback.play('video000001','one');const p=f.instances[0];p.ready();p.emit(1);playback.toggle();assert.equal(p.state,2);playback.toggle();assert.equal(p.state,1);
  p.options.events.onAutoplayBlocked();assert.equal(blocked,1);p.state=2;playback.resume();assert.equal(p.state,1);p.emit(1);assert.equal(playing,2);
});
