(function(root){
 const entries=[
  {
    "title": "看著我的眼睛說",
    "artist": "張遠",
    "lang": "國語",
    "videoId": "VW0oYTYhefs",
    "vocalId": "",
    "type": "完整動態歌詞版（非官方 MV）",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 261,
    "subtitles": "歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=VW0oYTYhefs",
    "evidence": "在正式 GitHub Pages 靜音驗證頁收到 PLAYING 並確認完整歌曲長度，未逐首播放至結尾。"
  },
  {
    "title": "可以不是你",
    "artist": "張遠",
    "lang": "國語",
    "videoId": "WWxza4XOo4Q",
    "vocalId": "",
    "type": "完整動態歌詞版（非官方 MV）",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 296,
    "subtitles": "歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=WWxza4XOo4Q",
    "evidence": "在正式 GitHub Pages 靜音驗證頁收到 PLAYING 並確認完整歌曲長度，未逐首播放至結尾。"
  },
  {
    "title": "嘉賓",
    "artist": "張遠",
    "lang": "國語",
    "videoId": "Uv_p43UAdBY",
    "vocalId": "",
    "type": "官方歌詞版 MV（國語）",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 334,
    "subtitles": "歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=Uv_p43UAdBY",
    "evidence": "在正式 GitHub Pages 靜音驗證頁收到 PLAYING 並確認完整歌曲長度，未逐首播放至結尾。"
  }
];
 const verified=()=>entries.filter(s=>s.embedding==='passed'&&s.contentVerified===true);
 const importable=()=>verified().map(({title,artist,lang,videoId,vocalId})=>({title,artist,lang,videoId,vocalId}));
 const missing=songs=>importable().filter(e=>!songs.some(s=>s.videoId===e.videoId||s.vocalId===e.videoId||(s.title===e.title&&s.artist===e.artist)));
 root.KTV_MANDARIN_PACK={entries,verified,importable,missing};
 if(typeof module!=='undefined')module.exports=root.KTV_MANDARIN_PACK;
})(typeof window!=='undefined'?window:globalThis);
