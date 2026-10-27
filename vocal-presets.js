/* Original vocal recordings matched to the current shared songbook.
   Existing manually configured vocal videos always take precedence. */
(function(root) {
  const recordings = [
    {title:'月亮代表我的心',artist:'鄧麗君',vocalId:'eOtATMfvfg8'},
    {title:'甜蜜蜜',artist:'鄧麗君',vocalId:'KrAc3uKfgQs'},
    {title:'我只在乎你',artist:'鄧麗君',vocalId:'h1OsMaBU7XA'},
    {title:'愛拼才會贏',artist:'葉啟田',vocalId:'Pf3Ecmnonik'},
    {title:'家後',artist:'江蕙',vocalId:'SnEko_SIf3U'},
    {title:'酒後的心聲',artist:'江蕙',vocalId:'pVdygD_9YLQ'},
    {title:'甲你攬牢牢',artist:'江蕙',vocalId:'YthAURjCwy4'},
    {title:'一支小雨傘',artist:'洪榮宏',vocalId:'7VC0iwOK7Ho'},
    {title:'舊情綿綿',artist:'洪榮宏',vocalId:'4GHr2K6w_bE'},
    {title:'一剪梅',artist:'費玉清',vocalId:'e9U249EPq_M'},
    {title:'千里之外',artist:'費玉清／周杰倫',vocalId:'ocDo3ySyHSI'},
    {title:'歡喜就好',artist:'陳雷',vocalId:'ahVGWxLe-Hw'},
    {title:'酒醉的蝴蝶',artist:'崔偉立',vocalId:'Ibb2owxqqw4'}
  ];
  const normalize = value => String(value || '').normalize('NFKC').replace(/\s+/g,'');
  function lookup(song) {
    if (/^[\w-]{11}$/.test(song.vocalId || '')) return song.vocalId;
    return recordings.find(r => normalize(r.title) === normalize(song.title) && normalize(r.artist) === normalize(song.artist))?.vocalId || '';
  }
  root.KTV_VOCALS = recordings;
  root.KTVGetVocal = lookup;
  if (typeof module !== 'undefined') module.exports = {recordings,lookup};
})(typeof window !== 'undefined' ? window : globalThis);
