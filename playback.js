/* YouTube IFrame API adapter: reuse one player for consecutive queued songs. */
(function(root) {
  let apiPromise;
  function loadAPI() {
    if (root.YT?.Player) return Promise.resolve(root.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const previous = root.onYouTubeIframeAPIReady;
      let timer;
      const fail = () => { clearTimeout(timer); apiPromise = null; reject(new Error('YouTube 播放器載入失敗，請確認網路後按「播放」。')); };
      root.onYouTubeIframeAPIReady = () => {
        clearTimeout(timer);
        resolve(root.YT);
        if (typeof previous === 'function') previous();
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true; script.onerror = fail;
      timer = setTimeout(fail, 20000);
      document.head.append(script);
    });
    return apiPromise;
  }
  class Playback {
    constructor(container, callbacks = {}) {
      this.container = container; this.callbacks = callbacks;
      this.player = null; this.ready = false; this.version = 0; this.mount = 0;
      this.videoId = ''; this.title = ''; this.hasPlayed = false; this.finished = false;
    }
    matches(player) {
      try { return player === this.player && new URL(player.getVideoUrl()).searchParams.get('v') === this.videoId; }
      catch { return false; }
    }
    async play(videoId, title) {
      const version = ++this.version;
      this.videoId = videoId; this.title = title; this.hasPlayed = false; this.finished = false;
      if (this.ready && this.player) {
        this.setTitle(); this.player.loadVideoById(videoId); return;
      }
      if (this.player) return; // onReady will load the latest requested song.
      this.container.textContent = '正在準備播放器…';
      try {
        const YT = await loadAPI();
        if (version !== this.version) return;
        const mount = ++this.mount;
        const host = document.createElement('div'); this.container.replaceChildren(host);
        this.player = new YT.Player(host, {
          host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%',
          videoId: this.videoId,
          playerVars: { autoplay: 1, playsinline: 1, origin: location.origin, rel: 0 },
          events: {
            onReady: event => {
              if (mount !== this.mount) return;
              this.player = event.target; this.ready = true; this.setTitle();
              event.target.loadVideoById(this.videoId);
            },
            onStateChange: event => {
              if (mount !== this.mount || !this.matches(event.target)) return;
              if (event.data === YT.PlayerState.PLAYING) {
                this.hasPlayed = true; this.callbacks.onPlaying?.();
              }
              if (event.data === YT.PlayerState.ENDED && this.hasPlayed && !this.finished) {
                // Mark before advancing: duplicate/stale ENDED events cannot skip a song.
                this.finished = true; this.hasPlayed = false; this.callbacks.onEnded?.();
              }
            },
            onError: event => {
              if (mount !== this.mount || !this.matches(event.target)) return;
              this.callbacks.onError?.('這部影片無法在此播放，可在 YouTube 開啟，或按「下一首」。');
            },
            onAutoplayBlocked: () => { if (mount === this.mount) this.callbacks.onBlocked?.(); }
          }
        });
        this.setTitle();
      } catch(error) {
        if (version === this.version) this.callbacks.onError?.(error.message);
      }
    }
    setTitle() {
      const iframe = this.player?.getIframe?.();
      if (iframe) {
        iframe.title = this.title + ' YouTube 播放器';
        iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
      }
    }
    toggle() {
      if (!this.ready || !this.player) return false;
      if (this.player.getPlayerState() === root.YT.PlayerState.PLAYING) this.player.pauseVideo();
      else this.player.playVideo();
      return true;
    }
    resume() { if (this.ready) this.player?.playVideo(); }
    stop() {
      ++this.version; ++this.mount;
      const old = this.player;
      this.player = null; this.ready = false; this.videoId = ''; this.hasPlayed = false; this.finished = true;
      old?.destroy();
    }
  }
  root.KTVPlayback = Playback;
  if (typeof module !== 'undefined') module.exports = Playback;
})(typeof window !== 'undefined' ? window : globalThis);
