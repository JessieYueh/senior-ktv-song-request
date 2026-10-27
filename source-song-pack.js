/* Fourteen standalone karaoke videos. Keep legacy document IDs for in-place migration. */
(function(root){
  const songs = [
  {
    "title": "再會吧！心上人",
    "artist": "經典老歌伴唱",
    "lang": "國語",
    "videoId": "Vxy_5Rc6hw0",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_0"
  },
  {
    "title": "一縷相思情",
    "artist": "高勝美",
    "lang": "國語",
    "videoId": "xiNKN7jx1D4",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_209"
  },
  {
    "title": "梨花淚",
    "artist": "于櫻櫻",
    "lang": "國語",
    "videoId": "Cz--B-m6Qq4",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_408"
  },
  {
    "title": "我在你左右",
    "artist": "經典老歌伴唱",
    "lang": "國語",
    "videoId": "xU6Td7WqQa8",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_606"
  },
  {
    "title": "含淚的分手",
    "artist": "于櫻櫻",
    "lang": "國語",
    "videoId": "Oo0x6ddu1Ls",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_782"
  },
  {
    "title": "遙遠寄相思",
    "artist": "潘秀瓊",
    "lang": "國語",
    "videoId": "ON2INsQ-jvQ",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_956"
  },
  {
    "title": "寒雨曲",
    "artist": "尤雅",
    "lang": "國語",
    "videoId": "WURewUV2BBg",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1155"
  },
  {
    "title": "相逢夕陽下",
    "artist": "經典老歌伴唱",
    "lang": "國語",
    "videoId": "td4a9yaOtHs",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1341"
  },
  {
    "title": "萍水相逢的人",
    "artist": "高勝美",
    "lang": "國語",
    "videoId": "eci0V6m6JtE",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1542"
  },
  {
    "title": "意難忘",
    "artist": "經典老歌伴唱",
    "lang": "國語",
    "videoId": "SZXsMxfcUHg",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1707"
  },
  {
    "title": "秋詞",
    "artist": "高勝美",
    "lang": "國語",
    "videoId": "s7rH5sL7YyI",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1943"
  },
  {
    "title": "不了情",
    "artist": "蔡琴",
    "lang": "國語",
    "videoId": "PoNphIxQTcU",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_2123"
  },
  {
    "title": "愛在夕陽下",
    "artist": "高勝美",
    "lang": "國語",
    "videoId": "YnhV3CvFE2s",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_2293"
  },
  {
    "title": "除了你",
    "artist": "韓寶儀",
    "lang": "國語",
    "videoId": "1RPYlsQpty8",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_2506"
  }
];

  const legacyVideoId='21f7PU0eQgk';
  const key=value=>String(value||'').normalize('NFKC').replace(/[\s！!]/g,'');
  function replacement(song){
    if(song.videoId!==legacyVideoId)return null;
    return songs.find(s=>(song._cloudId&&s._cloudId===song._cloudId)||(song.artist==='豪聲唱片合輯'&&key(s.title)===key(song.title)))||null;
  }
  function resolve(song){const next=replacement(song);return next?{...song,videoId:next.videoId,artist:song.artist==='豪聲唱片合輯'?next.artist:song.artist}:song;}
  // Each entry now plays its own complete video. No chapter boundaries remain.
  function segment(){return null;}
  function identity(song){song=resolve(song);return song.videoId||(song.title+'|'+song.artist);}
  root.KTV_SOURCE_SONGS=songs;root.KTVGetSegment=segment;root.KTVSongIdentity=identity;
  root.KTVSourceReplacement=replacement;root.KTVResolveSourceSong=resolve;
  if(typeof module!=='undefined')module.exports={songs,segment,identity,replacement,resolve};
})(typeof window!=='undefined'?window:globalThis);
