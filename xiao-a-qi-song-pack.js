/* KTV chart selections, including historical new-song charts.
   YouTube oEmbed confirms title/author and embed HTML, not successful playback.
   No import progress or result is rendered on the catalog page. */
(function(root){
'use strict';
const entries=[
  {
    "title": "從前說",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2021,
    "videoId": "g2XmkyHJC4k",
    "vocalId": "g2XmkyHJC4k",
    "source": "https://www.youtube.com/watch?v=g2XmkyHJC4k",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "另壺沖",
    "chartSource": "https://tw-pop-chart.blogspot.com/2022/11/20221025-20221031.html",
    "chartEvidence": "錢櫃國語點播榜 2022/10/25–10/31 第1名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "領地",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2022,
    "videoId": "CRwCtkyEl8w",
    "vocalId": "CRwCtkyEl8w",
    "source": "https://www.youtube.com/watch?v=CRwCtkyEl8w",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "EHPMusicChannel",
    "chartSource": "https://tw-pop-chart.blogspot.com/2023/05/20230425-20230501.html",
    "chartEvidence": "錢櫃國語新歌榜 2023/04/25–05/01 第25名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "無人認領",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2022,
    "videoId": "NSuc8m6poyY",
    "vocalId": "NSuc8m6poyY",
    "source": "https://www.youtube.com/watch?v=NSuc8m6poyY",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "4Leaf Music",
    "chartSource": "https://tw-pop-chart.blogspot.com/2023/10/20231003-20231009.html",
    "chartEvidence": "錢櫃國語新歌榜 2023/10/03–10/09 第29名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "你過得好嗎",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2022,
    "videoId": "W0V4zDVb_qo",
    "vocalId": "W0V4zDVb_qo",
    "source": "https://www.youtube.com/watch?v=W0V4zDVb_qo",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "4Leaf Music",
    "chartSource": "https://tw-pop-chart.blogspot.com/2022/12/20221206-20221212.html",
    "chartEvidence": "錢櫃國語新歌榜 2022/12/06–12/12 第20名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "和你路過婚紗店",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2022,
    "videoId": "jucOS8BkMCI",
    "vocalId": "jucOS8BkMCI",
    "source": "https://www.youtube.com/watch?v=jucOS8BkMCI",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "EHPMusicChannel",
    "chartSource": "https://tw-pop-chart.blogspot.com/2023/05/20230425-20230501.html",
    "chartEvidence": "錢櫃國語新歌榜 2023/04/25–05/01 第8名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "歸途有風（女版）",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2023,
    "videoId": "ac30O2H37hM",
    "vocalId": "ac30O2H37hM",
    "source": "https://www.youtube.com/watch?v=ac30O2H37hM",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "COY Music Channel",
    "chartSource": "https://tw-pop-chart.blogspot.com/2024/08/20240806-20240812.html",
    "chartEvidence": "錢櫃國語新歌榜 2024/08/06–08/12 第18名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "如果你是風",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2023,
    "videoId": "tPCVyADE8SQ",
    "vocalId": "tPCVyADE8SQ",
    "source": "https://www.youtube.com/watch?v=tPCVyADE8SQ",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "COY Music Channel",
    "chartSource": "https://tw-pop-chart.blogspot.com/2023/11/20231031-20231106.html?m=0",
    "chartEvidence": "錢櫃國語新歌榜 2023/10/31–11/06 第14名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "她的名字",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2023,
    "videoId": "i5TVlZ_0zCM",
    "vocalId": "i5TVlZ_0zCM",
    "source": "https://www.youtube.com/watch?v=i5TVlZ_0zCM",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "EHPMusicChannel",
    "chartSource": "https://tw-pop-chart.blogspot.com/2024/06/20240604-20240610.html",
    "chartEvidence": "錢櫃國語新歌榜 2024/06/04–06/10 第12名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  },
  {
    "title": "偏偏晚婚",
    "artist": "小阿七",
    "lang": "國語",
    "year": 2024,
    "videoId": "iY4djRt-ASs",
    "vocalId": "iY4djRt-ASs",
    "source": "https://www.youtube.com/watch?v=iY4djRt-ASs",
    "sourceEvidence": "lyric_channel",
    "sourceAuthor": "EHPMusicChannel",
    "chartSource": "https://tw-pop-chart.blogspot.com/2025/03/20250225-20250303.html",
    "chartEvidence": "錢櫃國語新歌榜 2025/02/25–03/03 第13名（歷史榜單轉錄）",
    "metadataVerified": true,
    "embedding": "unconfirmed",
    "contentVerified": false,
    "subtitles": "影片標題標示歌詞字幕；未逐首人工確認畫面",
    "checkedAt": "2026-11-01"
  }
];
const key=v=>String(v||'').normalize('NFKC').replace(/[\s、,，&＆]/g,'').replace(/\(女版\)/g,'');
const matches=(a,b)=>a.videoId===b.videoId||a.vocalId===b.videoId||
  (key(a.title)===key(b.title)&&String(a.artist||'').includes('小阿七'));
const importable=()=>entries.filter(e=>e.metadataVerified).map(({title,artist,lang,videoId,vocalId})=>({title,artist,lang,videoId,vocalId}));
const missing=songs=>importable().filter(e=>!(songs||[]).some(s=>matches(s,e)));
const metadata=song=>entries.find(e=>matches(song,e));
root.KTV_XIAO_A_QI={entries,importable,missing,metadata};
if(typeof module!=='undefined')module.exports=root.KTV_XIAO_A_QI;
})(typeof window!=='undefined'?window:globalThis);
