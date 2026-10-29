(function(root){
 const entries=[
  {
    "title": "看著我的眼睛說",
    "artist": "張遠",
    "lang": "國語",
    "videoId": "VW0oYTYhefs",
    "vocalId": "",
    "type": "完整動態歌詞版（非官方 MV）",
    "embedding": "pending",
    "contentVerified": false
  },
  {
    "title": "可以不是你",
    "artist": "張遠",
    "lang": "國語",
    "videoId": "WWxza4XOo4Q",
    "vocalId": "",
    "type": "完整動態歌詞版（非官方 MV）",
    "embedding": "pending",
    "contentVerified": false
  }
];
 const verified=()=>entries.filter(s=>s.embedding==='passed'&&s.contentVerified===true);
 const importable=()=>verified().map(({title,artist,lang,videoId,vocalId})=>({title,artist,lang,videoId,vocalId}));
 const missing=songs=>importable().filter(e=>!songs.some(s=>s.videoId===e.videoId||s.vocalId===e.videoId||(s.title===e.title&&s.artist===e.artist)));
 root.KTV_MANDARIN_PACK={entries,verified,importable,missing};
 if(typeof module!=='undefined')module.exports=root.KTV_MANDARIN_PACK;
})(typeof window!=='undefined'?window:globalThis);
