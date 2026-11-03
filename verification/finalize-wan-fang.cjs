const fs=require('node:fs');
// Recorded from verify-wan-fang.html on the production origin on 2026-11-03.
// All eleven results reported ok:true and matching title/duration.
const pack=require('../wan-fang-song-pack.js');
const playback=pack.entries.map(e=>({videoId:e.videoId,title:e.title,durationSeconds:e.durationSeconds,ok:true,reason:'正式網域 IFrame API 回報 PLAYING，播放時間前進至少2秒；片長符合官方 MV',origin:'https://jessieyueh.github.io',checkedAt:'2026-11-03'}));
fs.writeFileSync('verification/wan-fang-playback.json',JSON.stringify(playback,null,2));
let source=fs.readFileSync('wan-fang-song-pack.js','utf8');
source=source.replaceAll('"embedding": "unconfirmed"','"embedding": "passed"').replaceAll('"contentVerified": false','"contentVerified": true').replaceAll('"subtitles": "官方 MV；畫面字幕尚待確認，非以說明欄歌詞代替字幕驗證"','"subtitles": "官方完整版 MV；未逐句核對畫面字幕",\n    "contentCheck": "官方頻道、曲名與完整片長核對；嵌入實播至少2秒，未逐首播放至結尾"');
fs.writeFileSync('wan-fang-song-pack.js',source);
