/* Editorial metadata stays outside the existing Firestore song schema.
 * Only fully verified entries can be imported; never overlay local songs on cloud data.
 */
(function(root){
  const category='2026 陸劇 OST';
  const entries=[
    {title:'初醒',artist:'周深',lang:'國語',drama:'白日提燈',year:2026,videoId:'PJQGy005Ylg',vocalId:'',type:'官方 MV',embedding:'passed',contentVerified:true,durationSeconds:217,subtitles:'待確認',checkedAt:'2026-10-29',evidence:'使用者在本機 Chrome 驗證頁確認可嵌入播放，並確認總長 3:37、完整歌曲；字幕尚未回報。'},
    {title:'我對緣分小心翼翼',artist:'林俊傑',drama:'逐玉',year:2026,videoId:'j8yO0LkqA7s',type:'官方 MV',embedding:'failed',contentVerified:false,evidence:'使用者確認嵌入顯示無法播放，僅 YouTube 網站可播放。'},
    {title:'清清如我',artist:'郁可唯',drama:'逐玉',year:2026,videoId:'u1vOwz4AxWw',type:'歌詞影片',embedding:'failed',contentVerified:false,evidence:'使用者確認嵌入顯示無法播放，僅 YouTube 網站可播放。'},
    ...[['眾裡尋他千百度','張碧晨','逐玉'],['一念','張紫寧／李鑫一','逐玉'],['木已成舟','張遠','逐玉'],['前路','黃霄雲','逐玉'],['若能在你眼中','劉宇寧','白日提燈']].map(([title,artist,drama])=>({title,artist,drama,videoId:'',embedding:'pending',contentVerified:false,evidence:'候選；年份、官方曲目及完整可嵌入影片尚待逐項核實。'}))
  ];
  entries.push(...[
  {
    "title": "我對緣分小心翼翼",
    "artist": "林俊傑",
    "drama": "逐玉",
    "year": 2026,
    "videoId": "V79oU4KgPLc",
    "type": "騰訊官方 MV",
    "lang": "國語",
    "vocalId": "",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 273,
    "subtitles": "待確認",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=V79oU4KgPLc",
    "evidence": "在正式 GitHub Pages 驗證頁實測收到 PLAYING，並讀取完整歌曲長度；未逐首播放到結束。"
  },
  {
    "title": "清清如我",
    "artist": "郁可唯",
    "drama": "逐玉",
    "year": 2026,
    "videoId": "PQMA-Fzmm4U",
    "type": "騰訊歌詞版",
    "lang": "國語",
    "vocalId": "",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 200,
    "subtitles": "官方標示歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=PQMA-Fzmm4U",
    "evidence": "在正式 GitHub Pages 驗證頁實測收到 PLAYING，並讀取完整歌曲長度；未逐首播放到結束。"
  },
  {
    "title": "眾裡尋他千百度",
    "artist": "張碧晨",
    "drama": "逐玉",
    "year": 2026,
    "videoId": "frYvL-ZLRQA",
    "type": "騰訊歌詞版（影片標題用「她」，正式曲名依發行資料用「他」）",
    "lang": "國語",
    "vocalId": "",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 190,
    "subtitles": "官方標示歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=frYvL-ZLRQA",
    "evidence": "在正式 GitHub Pages 驗證頁實測收到 PLAYING，並讀取完整歌曲長度；未逐首播放到結束。"
  },
  {
    "title": "前路",
    "artist": "黃霄雲",
    "drama": "逐玉",
    "year": 2026,
    "videoId": "jtK5KfEgjI0",
    "type": "騰訊歌詞版",
    "lang": "國語",
    "vocalId": "",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 199,
    "subtitles": "官方標示歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=jtK5KfEgjI0",
    "evidence": "在正式 GitHub Pages 驗證頁實測收到 PLAYING，並讀取完整歌曲長度；未逐首播放到結束。"
  },
  {
    "title": "木已成舟",
    "artist": "張遠",
    "drama": "逐玉",
    "year": 2026,
    "videoId": "QG7yJCAbV9Q",
    "type": "騰訊歌詞版",
    "lang": "國語",
    "vocalId": "",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 246,
    "subtitles": "官方標示歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=QG7yJCAbV9Q",
    "evidence": "在正式 GitHub Pages 驗證頁實測收到 PLAYING，並讀取完整歌曲長度；未逐首播放到結束。"
  },
  {
    "title": "一念",
    "artist": "張紫寧／李鑫一",
    "drama": "逐玉",
    "year": 2026,
    "videoId": "-JQwmf9J8U0",
    "type": "騰訊歌詞版",
    "lang": "國語",
    "vocalId": "",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 181,
    "subtitles": "官方標示歌詞版；未逐句核對",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=-JQwmf9J8U0",
    "evidence": "在正式 GitHub Pages 驗證頁實測收到 PLAYING，並讀取完整歌曲長度；未逐首播放到結束。"
  },
  {
    "title": "若能在你眼中",
    "artist": "劉宇寧",
    "drama": "白日提燈",
    "year": 2026,
    "videoId": "8FlhQrN_gmo",
    "type": "騰訊官方 MV",
    "lang": "國語",
    "vocalId": "",
    "embedding": "passed",
    "contentVerified": true,
    "durationSeconds": 271,
    "subtitles": "待確認",
    "checkedAt": "2026-10-29",
    "source": "https://www.youtube.com/watch?v=8FlhQrN_gmo",
    "evidence": "在正式 GitHub Pages 驗證頁實測收到 PLAYING，並讀取完整歌曲長度；未逐首播放到結束。"
  }
]);
  const verified=()=>entries.filter(e=>e.year===2026&&e.embedding==='passed'&&e.contentVerified===true);
  const metadata=song=>entries.find(e=>e.year===2026&&e.videoId&&[song.videoId,song.vocalId].includes(e.videoId))||null;
  const matches=(song,name)=>name==='全部'||(name===category?!!metadata(song):(song.lang||'其他')===name);
  const importable=()=>verified().map(({title,artist,lang,videoId,vocalId})=>({title,artist,lang,videoId,vocalId}));
  const missing=songs=>importable().filter(e=>!songs.some(s=>s.videoId===e.videoId||s.vocalId===e.videoId||(s.title===e.title&&s.artist===e.artist)));
  root.KTVOST2026={category,entries,verified,metadata,matches,importable,missing};
  if(typeof module!=='undefined')module.exports=root.KTVOST2026;
})(typeof window!=='undefined'?window:globalThis);
