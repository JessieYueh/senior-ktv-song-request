(function(root) {
  const collator = new Intl.Collator('zh-Hant-TW-u-co-stroke', { numeric: true, sensitivity: 'base' });
  function sortSongs(songs, field = 'title', direction = 'asc') {
    const key = field === 'artist' ? 'artist' : 'title';
    const secondary = key === 'title' ? 'artist' : 'title';
    const sign = direction === 'desc' ? -1 : 1;
    return [...songs].sort((a, b) => sign * (
      collator.compare(a[key] || '', b[key] || '') ||
      collator.compare(a[secondary] || '', b[secondary] || '') ||
      collator.compare(a.videoId || '', b.videoId || '')
    ));
  }
  root.KTVSortSongs = sortSongs;
  if (typeof module !== 'undefined') module.exports = sortSongs;
})(typeof window !== 'undefined' ? window : globalThis);
