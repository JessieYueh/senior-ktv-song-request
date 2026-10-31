/* Runs only after a manager clicks "驗證並匯入". No browser credentials are stored. */
(function(root){
 'use strict';
 let apiPromise;
 function loadAPI(){
  if(root.YT?.Player)return Promise.resolve(root.YT);
  if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{
   const previous=root.onYouTubeIframeAPIReady;
   const timer=setTimeout(()=>reject(new Error('YouTube 播放器逾時')),20000);
   root.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);if(typeof previous==='function')previous();resolve(root.YT);};
   const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
   script.onerror=()=>{clearTimeout(timer);reject(new Error('無法載入 YouTube 播放器'));};document.head.append(script);
  });return apiPromise;
 }
 async function run(entries,host,progress){
  if(!Array.isArray(entries)||!host)throw new Error('驗證資料或播放器容器不存在');
  const yt=await loadAPI();
  const mount=document.createElement('div');host.replaceChildren(mount);
  let onError=null;
  const player=await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error('YouTube 播放器初始化逾時')),20000);
   new yt.Player(mount,{width:'100%',height:'100%',playerVars:{playsinline:1,autoplay:0,rel:0,origin:location.origin},events:{
    onReady:event=>{clearTimeout(timeout);resolve(event.target);},
    onError:event=>{if(onError)onError(Number(event.data));}
   }});
  });
  const results=[];
  try{
   player.mute();
   for(let i=0;i<entries.length;i++){
    const entry=entries[i];progress('正在檢查 '+(i+1)+'／'+entries.length+'：'+entry.title);
    const result=await new Promise(resolve=>{
     let finished=false,seconds=0;
     const done=(ok,reason)=>{if(finished)return;finished=true;clearInterval(poll);clearTimeout(timeout);onError=null;resolve({title:entry.title,ok,reason,seconds});};
     onError=code=>done(false,'YouTube 錯誤 '+code);
     const timeout=setTimeout(()=>done(false,'播放逾時或被瀏覽器阻擋'),18000);
     const poll=setInterval(()=>{
      try{
       const videoData=player.getVideoData?.()||{};
       const id=videoData.video_id;
       if(id&&id!==entry.videoId)return;
       seconds=Number(player.getDuration?.()||0);
       if(player.getPlayerState()===yt.PlayerState.PLAYING){
        const expected=Number(entry.expectedDurationSeconds||0);
        if(!expected)done(false,'缺少可靠的歌曲長度基準，不能標記已驗證');
        else if(seconds>=120&&seconds>=expected-45&&seconds<=expected+90)done(true,'已在本網站播放，影片長度 '+seconds+' 秒');
        else if(seconds>0)done(false,'影片長度 '+seconds+' 秒與專輯曲目不符');
       }
      }catch(error){done(false,String(error.message||error));}
     },500);
     try{player.loadVideoById(entry.videoId);player.mute();player.playVideo();}catch(error){done(false,String(error.message||error));}
    });
    try{player.pauseVideo();}catch{}
    results.push({...result,videoId:entry.videoId});
    progress(entry.title+'：'+(result.ok?'可嵌入，長度 '+result.seconds+' 秒':'未通過：'+result.reason));
   }
  }finally{onError=null;try{player.destroy();}catch{}host.replaceChildren();}
  return results;
 }
 root.KTV_VERIFY_CHOU_HUI={run};
})(typeof window!=='undefined'?window:globalThis);
