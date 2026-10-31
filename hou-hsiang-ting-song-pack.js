/* Historical KTV chart selections; official full-MV links.
   Charts: archived magazine tables linked per entry.
   Album durations: TheAudioDB 2433715/2433737 and volt.fm album 3543849.
   Runtime playback validation is required before any cloud import.
   No progress/results UI is added to the songbook. */
(function(root){
'use strict';
const entries=[
  {
    "title": "秋天別來",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "PxJWtrafRvg",
    "vocalId": "PxJWtrafRvg",
    "year": 1999,
    "expectedDurationSeconds": 283,
    "source": "https://www.youtube.com/watch?v=PxJWtrafRvg",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8229379510",
    "chartEvidence": "錢櫃點播榜 1999/08 第5週第9名",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "我是一隻魚",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "Pea5UfJodJY",
    "vocalId": "Pea5UfJodJY",
    "year": 1999,
    "expectedDurationSeconds": 204,
    "source": "https://www.youtube.com/watch?v=Pea5UfJodJY",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8229440143",
    "chartEvidence": "錢櫃點播榜 1999/10 第4週第6名",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "為你流的淚",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "MY6rc-_LYvE",
    "vocalId": "MY6rc-_LYvE",
    "year": 2000,
    "expectedDurationSeconds": 232,
    "source": "https://www.youtube.com/watch?v=MY6rc-_LYvE",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8232846369",
    "chartEvidence": "錢櫃新歌榜 2000/07 第1名",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "都是真的",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "4bpnLE0dDUg",
    "vocalId": "4bpnLE0dDUg",
    "year": 2000,
    "expectedDurationSeconds": 221,
    "source": "https://www.youtube.com/watch?v=4bpnLE0dDUg",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8229742090",
    "chartEvidence": "錢櫃點播榜 2000/07 第1週第10名",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "離開愛的日子",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "UUmn937nS4w",
    "vocalId": "UUmn937nS4w",
    "year": 2000,
    "expectedDurationSeconds": 312,
    "source": "https://www.youtube.com/watch?v=UUmn937nS4w",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8229742090",
    "chartEvidence": "錢櫃點播榜 2000/07 上榜",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "曖昧",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "tDN_9TQ-tzo",
    "vocalId": "tDN_9TQ-tzo",
    "year": 2001,
    "expectedDurationSeconds": 283,
    "source": "https://www.youtube.com/watch?v=tDN_9TQ-tzo",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8230437539",
    "chartEvidence": "好樂迪點播榜 2001/10 第2週第6名",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "兩個冬天",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "KxrUn8JhSaY",
    "vocalId": "KxrUn8JhSaY",
    "year": 2001,
    "expectedDurationSeconds": 300,
    "source": "https://www.youtube.com/watch?v=KxrUn8JhSaY",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8230562796",
    "chartEvidence": "錢櫃新歌榜 2002/02 第16名",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "我是如此愛你",
    "artist": "侯湘婷",
    "lang": "國語",
    "videoId": "irnGfReshEs",
    "vocalId": "irnGfReshEs",
    "year": 2002,
    "expectedDurationSeconds": 324,
    "source": "https://www.youtube.com/watch?v=irnGfReshEs",
    "sourceEvidence": "official_channel",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8230907406",
    "chartEvidence": "錢櫃新歌榜 2002/09 第14名",
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "尚未逐首人工確認",
    "checkedAt": "2026-11-01"
  }
,{
  "title": "原來的你",
  "artist": "侯湘婷",
  "lang": "國語",
  "videoId": "a9kEtfO0vQc",
  "vocalId": "a9kEtfO0vQc",
  "year": 2000,
  "expectedDurationSeconds": 261,
  "source": "https://www.youtube.com/watch?v=a9kEtfO0vQc",
  "sourceEvidence": "official_channel",
  "chartSource": "https://jackli51.pixnet.net/blog/posts/8229742090",
  "chartEvidence": "錢櫃點播榜 2000/07 第4週第15名",
  "embedding": "unconfirmed",
  "contentVerified": false,
  "subtitles": "尚未逐首人工確認",
  "checkedAt": "2026-11-01"
}
];
const key=value=>String(value||'').normalize('NFKC').replace(/[\s、,，&＆]/g,'');
const exists=(song,entry)=>song.videoId===entry.videoId||song.vocalId===entry.videoId||(key(song.title).replace(/[(（]女生版[)）]/g,'')===key(entry.title)&&String(song.artist||'').includes('侯湘婷'));
const pending=songs=>entries.filter(entry=>!songs.some(song=>exists(song,entry)));
const verified=()=>entries.filter(entry=>entry.embedding==='passed'&&entry.contentVerified===true);
const missing=songs=>verified().filter(entry=>!songs.some(song=>exists(song,entry))).map(({title,artist,lang,videoId,vocalId})=>({title,artist,lang,videoId,vocalId}));
async function verify(list,host,allowed){
 const results=[];
 for(const entry of list){
  if(!allowed())break;
  const result=await new Promise(resolve=>{
   let adapter,timer,poll,finished=false,seconds=0,firstTime=null;
   const done=(ok,reason)=>{
    if(finished)return;finished=true;clearTimeout(timer);clearInterval(poll);adapter?.stop();
    if(ok){entry.embedding='passed';entry.contentVerified=true;entry.durationSeconds=seconds;entry.checkedAt=new Date().toISOString();entry.evidence='Official full MV; exact ID, duration and advancing PLAYING state confirmed on this site. Subtitles not manually verified.';}
    resolve({title:entry.title,videoId:entry.videoId,ok,reason,seconds});
   };
   adapter=new root.KTVPlayback(host,{
    onReady:()=>adapter.player?.mute(),
    onError:reason=>done(false,reason)
   });
   timer=setTimeout(()=>done(false,'播放逾時'),22000);
   poll=setInterval(()=>{
    if(!allowed())return done(false,'已開始點唱或管理權限變更');
    try{
     const player=adapter.player;
     if(!adapter.ready||!player)return;
     player.mute();
     if(player.getVideoData?.().video_id!==entry.videoId||player.getPlayerState()!==1)return;
     seconds=Number(player.getDuration());
     const expected=entry.expectedDurationSeconds;
     if(!Number.isFinite(seconds)||seconds<120||seconds<expected-30||seconds>expected+100)return done(false,'影片長度與完整曲目不符');
     const time=Number(player.getCurrentTime());
     if(!Number.isFinite(time))return;
     if(firstTime===null)firstTime=time;
     else if(time-firstTime>=1)done(true,'已確認嵌入播放與完整長度');
    }catch(error){done(false,String(error.message||error));}
   },500);
   Promise.resolve(adapter.play(entry.videoId,entry.title)).catch(error=>done(false,String(error.message||error)));
  });
  results.push(result);
 }
 return results;
}
root.KTV_HOU_HSIANG_TING={entries,pending,verified,missing,verify,lastReport:null};
if(typeof module!=='undefined')module.exports=root.KTV_HOU_HSIANG_TING;
})(typeof window!=='undefined'?window:globalThis);

