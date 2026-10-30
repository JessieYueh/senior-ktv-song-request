/* 周蕙官方 MV 候選清單。找到影片不代表已通過 GitHub Pages 嵌入播放測試。 */
(function(root){
 const entries=[
  {
    "title": "約定",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "Vd-mTkhiThI",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=Vd-mTkhiThI"
  },
  {
    "title": "不想讓你知道",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "kXFMYK9jgFg",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=kXFMYK9jgFg"
  },
  {
    "title": "替身",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "WUKnbOlicps",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=WUKnbOlicps"
  },
  {
    "title": "體溫",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "PGpcKF3hfO4",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=PGpcKF3hfO4"
  },
  {
    "title": "寂寞城市",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "UBR_PKREysc",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=UBR_PKREysc"
  },
  {
    "title": "我看見的世界",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "uSF8M1jZ-Zk",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=uSF8M1jZ-Zk"
  },
  {
    "title": "被遺忘的時光",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "g_VjS-iOcAU",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=g_VjS-iOcAU"
  },
  {
    "title": "感性生物",
    "artist": "周蕙",
    "lang": "國語",
    "videoId": "ypzsoJeZDzg",
    "vocalId": "",
    "type": "官方 MV 候選",
    "embedding": "pending",
    "contentVerified": false,
    "source": "https://www.youtube.com/watch?v=ypzsoJeZDzg"
  }
];
 const verified=()=>entries.filter(e=>e.embedding==='passed'&&e.contentVerified===true);
 const importable=()=>verified().map(({title,artist,lang,videoId,vocalId})=>({title,artist,lang,videoId,vocalId}));
 const missing=songs=>importable().filter(e=>!songs.some(s=>s.videoId===e.videoId||(s.title===e.title&&s.artist===e.artist)));
 root.KTV_CHOU_HUI={entries,verified,importable,missing};
})(typeof window!=='undefined'?window:globalThis);
