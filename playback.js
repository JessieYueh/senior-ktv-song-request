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
      this.embedHost='https://www.youtube.com';this.startupTimer=null;this.fallbackUsed=false;
      this.desiredPaused=false;this.videoId = ''; this.title = ''; this.range = null; this.hasPlayed = false; this.finished = false;
    }
    matches(player) {
      try { return player === this.player && new URL(player.getVideoUrl()).searchParams.get('v') === this.videoId; }
      catch { return false; }
    }
    async play(videoId, title, range = null) {
      const version = ++this.version;
      this.watchStartup(version);
      this.videoId = videoId; this.title = title; this.range = range; this.hasPlayed = false; this.finished = false;
      if (this.ready && this.player) {
        this.setTitle(); this.loadCurrent(); return;
      }
      if (this.player) return; // onReady will load the latest requested song.
      this.container.textContent = '正在準備播放器…';
      try {
        const YT = await loadAPI();
        if (version !== this.version) return;
        const mount = ++this.mount;
        const host = document.createElement('div'); this.container.replaceChildren(host);
        this.player = new YT.Player(host, {
          host: this.embedHost, width: '100%', height: '100%',
          videoId: this.videoId,
          playerVars: { autoplay: 1, playsinline: 1, origin: location.origin, rel: 0, ...(this.range?{start:this.range.startSeconds,end:this.range.endSeconds}:{}) },
          events: {
            onReady: event => {
              if (mount !== this.mount) return;
              this.player = event.target; this.ready = true; this.setTitle();
              this.loadCurrent();this.callbacks.onReady?.();
            },
            onStateChange: event => {
              if (mount !== this.mount || !this.matches(event.target)) return;
              if (event.data === YT.PlayerState.PLAYING) {
                if(this.desiredPaused){event.target.pauseVideo();return;}
                clearTimeout(this.startupTimer);this.hasPlayed = true; this.callbacks.onPlaying?.();
              }
              if (event.data === YT.PlayerState.ENDED && this.hasPlayed && !this.finished) {
                // Mark before advancing: duplicate/stale ENDED events cannot skip a song.
                this.finished = true; this.hasPlayed = false; this.callbacks.onEnded?.();
              }
            },
            onError: event => {
              if (mount !== this.mount) return;
              clearTimeout(this.startupTimer);
              const code=Number(event.data),reason=({2:'影片網址無效',5:'此瀏覽器無法載入影片',100:'影片已刪除或不公開',101:'影片未開放網站內播放',150:'影片未開放網站內播放',153:'YouTube 未收到網站來源識別'})[code]||'影片載入失敗';
              this.callbacks.onError?.(reason+'（YouTube '+code+'）。');
            },
            onAutoplayBlocked: () => { if (mount === this.mount) this.callbacks.onBlocked?.(); }
          }
        });
        this.setTitle();
      } catch(error) {
        if (version === this.version) this.callbacks.onError?.(error.message);
      }
    }
    watchStartup(version) {
      clearTimeout(this.startupTimer);
      this.startupTimer=setTimeout(()=>{if(version!==this.version||this.hasPlayed||this.desiredPaused)return;if((!this.ready||this.player?.getPlayerState?.()===3)&&!this.fallbackUsed){const id=this.videoId,title=this.title,range=this.range,paused=this.desiredPaused;this.fallbackUsed=true;this.useAlternateHost();this.callbacks.onConnecting?.();this.play(id,title,range);this.setPaused(paused);}else if(!this.ready)this.callbacks.onError?.('目前無法連上 YouTube，請確認此裝置能開啟 YouTube。');else this.callbacks.onBlocked?.();},15000);
      this.startupTimer?.unref?.();
    }
    useAlternateHost(){this.stop();this.embedHost=this.embedHost==='https://www.youtube.com'?'https://www.youtube-nocookie.com':'https://www.youtube.com';}
    loadCurrent() {
      if(this.range)this.player.loadVideoById({videoId:this.videoId,startSeconds:this.range.startSeconds,endSeconds:this.range.endSeconds});
      else this.player.loadVideoById(this.videoId);
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
    setPaused(value){this.desiredPaused=!!value;if(this.ready){if(value)this.player?.pauseVideo();else this.player?.playVideo();}}
    resume() { this.setPaused(false); }
    stop() {
      clearTimeout(this.startupTimer);this.desiredPaused=false;++this.version; ++this.mount;
      const old = this.player;
      this.player = null; this.ready = false; this.videoId = ''; this.range = null; this.hasPlayed = false; this.finished = true;
      old?.destroy();
    }
  }
  root.KTVPlayback = Playback;
  if (typeof module !== 'undefined') module.exports = Playback;
})(typeof window !== 'undefined' ? window : globalThis);
