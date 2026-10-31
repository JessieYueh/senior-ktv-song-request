/* Historical KTV chart selections. Official MV / lyric video metadata confirmed by YouTube oEmbed. Embedded playback and visual subtitles remain unconfirmed. */
(function(root){
'use strict';
const entries=[
  {
    "title": "一個人生活",
    "artist": "林凡",
    "lang": "國語",
    "year": 2000,
    "videoId": "hUJl1HwYIN8",
    "vocalId": "hUJl1HwYIN8",
    "source": "https://www.youtube.com/watch?v=hUJl1HwYIN8",
    "chartSource": "https://tw-pop-chart.blogspot.com/2000/10/200010-77.html?m=0",
    "chartEvidence": "錢櫃雜誌2000年10月點播榜第14名；影片為2012幸福蛻變版",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "什麼都可以忘記",
    "artist": "林凡",
    "lang": "國語",
    "year": 2000,
    "videoId": "-VsSSTSYuBE",
    "vocalId": "-VsSSTSYuBE",
    "source": "https://www.youtube.com/watch?v=-VsSSTSYuBE",
    "chartSource": "https://tw-pop-chart.blogspot.com/2000/10/200010-77.html?m=0",
    "chartEvidence": "錢櫃雜誌2000年10月點播榜第18名",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "再見西雅圖",
    "artist": "林凡",
    "lang": "國語",
    "year": 2000,
    "videoId": "qrAlNAfg06c",
    "vocalId": "qrAlNAfg06c",
    "source": "https://www.youtube.com/watch?v=qrAlNAfg06c",
    "chartSource": "https://jackli51.pixnet.net/blog/posts/8233032177",
    "chartEvidence": "錢櫃雜誌2000年11月新歌榜第13名",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "重傷",
    "artist": "林凡",
    "lang": "國語",
    "year": 2010,
    "videoId": "usNHFmYx9YU",
    "vocalId": "usNHFmYx9YU",
    "source": "https://www.youtube.com/watch?v=usNHFmYx9YU",
    "chartSource": "https://www.hitoradio.com/newweb/72319hitonews",
    "chartEvidence": "2011/03/30報導林凡有三首進KTV前10；重傷為該報導主打，未載個別名次",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "五天幾年",
    "artist": "林凡",
    "lang": "國語",
    "year": 2010,
    "videoId": "PtrIG-4ulTE",
    "vocalId": "PtrIG-4ulTE",
    "source": "https://www.youtube.com/watch?v=PtrIG-4ulTE",
    "chartSource": "https://www.metropolitanktv.com.tw/rank/3/?page=2",
    "chartEvidence": "大都會KTV國語排行頁收錄；未載統計日期，序號不當作週榜名次",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "我們的故事只講了一半",
    "artist": "林凡",
    "lang": "國語",
    "year": 2013,
    "videoId": "IrZLV9tMTWc",
    "vocalId": "IrZLV9tMTWc",
    "source": "https://www.youtube.com/watch?v=IrZLV9tMTWc",
    "chartSource": "https://tw-pop-chart.blogspot.com/2014/01/?m=0",
    "chartEvidence": "錢櫃新歌榜2014/01/22–01/28第15名",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "明明愛你",
    "artist": "林凡",
    "lang": "國語",
    "year": 2014,
    "videoId": "Tn7Itx_orTA",
    "vocalId": "Tn7Itx_orTA",
    "source": "https://www.youtube.com/watch?v=Tn7Itx_orTA",
    "chartSource": "https://www.apple-line.com/modules/tadnews/index.php?com_mode=flat&com_order=0&nsn=1563",
    "chartEvidence": "Apple K歌榜2014/06/07–06/13第7名，資料為全台各大KTV統計",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "歲月這把刀",
    "artist": "林凡",
    "lang": "國語",
    "year": 2014,
    "videoId": "b14RrwuEPEk",
    "vocalId": "b14RrwuEPEk",
    "source": "https://www.youtube.com/watch?v=b14RrwuEPEk",
    "chartSource": "https://www.apple-line.com/modules/tadnews/pda.php?nsn=1533",
    "chartEvidence": "Apple K歌榜2014/05/16第5名，資料為全台各大KTV統計",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "套不住",
    "artist": "林凡、符致逸",
    "lang": "國語",
    "year": 2014,
    "videoId": "mN-X_zZphZQ",
    "vocalId": "mN-X_zZphZQ",
    "source": "https://www.youtube.com/watch?v=mN-X_zZphZQ",
    "chartSource": "https://tw-pop-chart.blogspot.com/2014/08/",
    "chartEvidence": "錢櫃新歌榜2014/07/30–08/05第15名",
    "sourceEvidence": "official_channel",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "未逐首人工確認",
    "checkedAt": "2026-11-01"
  }
];
const key=v=>String(v||'').normalize('NFKC').replace(/[\s、,，&＆]/g,'');
const matches=(a,b)=>a.videoId===b.videoId||a.vocalId===b.videoId||
  (key(a.title)===key(b.title)&&String(a.artist||'').includes('林凡'));
const importable=()=>entries.filter(e=>e.metadataVerified).map(({title,artist,lang,videoId,vocalId})=>({title,artist,lang,videoId,vocalId}));
const missing=songs=>importable().filter(e=>!(songs||[]).some(s=>matches(s,e)));
const metadata=song=>entries.find(e=>matches(song,e));
root.KTV_LIN_FAN={entries,importable,missing,metadata};
if(typeof module!=='undefined')module.exports=root.KTV_LIN_FAN;
})(typeof window!=='undefined'?window:globalThis);
