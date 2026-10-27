/* Source: https://www.youtube.com/watch?v=21f7PU0eQgk
   Boundaries follow the publisher's chapter list; performer names were not listed. */
(function(root){
  const songs = [
  {
    "title": "再會吧！心上人",
    "startSeconds": 0,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_0",
    "endSeconds": 209
  },
  {
    "title": "一縷相思情",
    "startSeconds": 209,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_209",
    "endSeconds": 408
  },
  {
    "title": "梨花淚",
    "startSeconds": 408,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_408",
    "endSeconds": 606
  },
  {
    "title": "我在你左右",
    "startSeconds": 606,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_606",
    "endSeconds": 782
  },
  {
    "title": "含淚的分手",
    "startSeconds": 782,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_782",
    "endSeconds": 956
  },
  {
    "title": "遙遠寄相思",
    "startSeconds": 956,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_956",
    "endSeconds": 1155
  },
  {
    "title": "寒雨曲",
    "startSeconds": 1155,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1155",
    "endSeconds": 1341
  },
  {
    "title": "相逢夕陽下",
    "startSeconds": 1341,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1341",
    "endSeconds": 1542
  },
  {
    "title": "萍水相逢的人",
    "startSeconds": 1542,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1542",
    "endSeconds": 1707
  },
  {
    "title": "意難忘",
    "startSeconds": 1707,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1707",
    "endSeconds": 1943
  },
  {
    "title": "秋詞",
    "startSeconds": 1943,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_1943",
    "endSeconds": 2123
  },
  {
    "title": "不了情",
    "startSeconds": 2123,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_2123",
    "endSeconds": 2293
  },
  {
    "title": "愛在夕陽下",
    "startSeconds": 2293,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_2293",
    "endSeconds": 2506
  },
  {
    "title": "除了你",
    "startSeconds": 2506,
    "artist": "豪聲唱片合輯",
    "lang": "國語",
    "videoId": "21f7PU0eQgk",
    "vocalId": "",
    "_cloudId": "chapter_21f7PU0eQgk_2506",
    "endSeconds": 2691
  }
];
  const key=value=>String(value||'').normalize('NFKC').replace(/\s+/g,'');
  function segment(song,videoId=song.videoId){
    const entry=songs.find(s=>s.videoId===videoId&&(s._cloudId===song._cloudId||(key(s.title)===key(song.title)&&key(s.artist)===key(song.artist))));
    return entry?{startSeconds:entry.startSeconds,endSeconds:entry.endSeconds}:null;
  }
  function identity(song){const range=segment(song);return range?song.videoId+':'+range.startSeconds+'-'+range.endSeconds:song.videoId||(song.title+'|'+song.artist);}
  root.KTV_SOURCE_SONGS=songs;root.KTVGetSegment=segment;root.KTVSongIdentity=identity;
  if(typeof module!=='undefined')module.exports={songs,segment,identity};
})(typeof window!=='undefined'?window:globalThis);
