import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getFirestore, collection, doc, onSnapshot, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const app = initializeApp({
  apiKey: 'AIzaSyDJ-GH4lePxV_RL-dZ0Dm7HaXwOMq8XHx0',
  authDomain: 'ktvdata-da16f.firebaseapp.com',
  projectId: 'ktvdata-da16f',
  storageBucket: 'ktvdata-da16f.firebasestorage.app',
  messagingSenderId: '305621061136',
  appId: '1:305621061136:web:ca0ace5ad6f12c9c0d0495'
});
const auth = getAuth(app), db = getFirestore(app);
const state = { user: null, admin: false, readReady: false, error: '', authError: '', count: 0, busy: false };
let stopAdmin = null, stopSongs = null;
const emit = () => window.KTV_APP.setCloudState({ ...state });
export function explain(error) {
  const code = error?.code || '';
  if (code.includes('permission-denied')) return '尚未取得雲端權限，請確認 Firestore 規則與管理者名單。';
  if (code.includes('not-found') || code.includes('failed-precondition')) return '請確認已建立 Firestore 的 (default) 資料庫並啟用 API。';
  if (code.includes('unauthorized-domain')) return '請在 Firebase Authentication 加入授權網域 jessieyueh.github.io。';
  if (code.includes('popup-blocked')) return '登入視窗被阻擋，請允許此網站開啟彈出視窗。';
  if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) return '登入已取消。';
  if (code.includes('operation-not-allowed')) return '請在 Firebase Authentication 啟用 Google 登入。';
  if (code.includes('unavailable') || code.includes('network-request-failed')) return '目前無法連線，請確認網路後重試。';
  return error?.message || '雲端操作失敗，請稍後重試。';
}
function watchAdmin(user) {
  stopAdmin?.(); stopAdmin = null;
  state.admin = false; state.authError = '';
  if (user) stopAdmin = onSnapshot(doc(db, 'admins', user.uid), snapshot => {
    state.admin = snapshot.exists() && snapshot.data().enabled === true; state.authError = ''; emit();
  }, error => { state.admin = false; state.authError = explain(error); emit(); });
}
function watchSongs() {
  stopSongs?.();
  state.error = ''; state.readReady = false; emit();
  stopSongs = onSnapshot(collection(db, 'songs'), { includeMetadataChanges: true }, snapshot => {
    // Only show confirmed server data; pending writes are not reported as a completed sync.
    if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
    const songs = snapshot.docs.map(d => ({ ...d.data(), _cloudId: d.id }))
      .filter(s => typeof s.title === 'string' && typeof s.artist === 'string')
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.title.localeCompare(b.title, 'zh-Hant'));
    state.readReady = true; state.count = songs.length; state.error = '';
    window.KTV_APP.setCloudSongs(songs); emit();
  }, error => { state.readReady = false; state.error = explain(error); emit(); });
}
onAuthStateChanged(auth, user => {
  state.user = user ? { uid: user.uid, email: user.email || '', name: user.displayName || '' } : null;
  state.admin = false; state.authError = ''; emit();
  watchAdmin(user);
  // Permission-denied listeners are terminal; reattach after a new sign-in.
  watchSongs();
}, error => { state.authError = explain(error); emit(); });
function requireAdmin() {
  if (!auth.currentUser || !state.admin) throw new Error('請先登入已授權的管理帳號。');
  if (!navigator.onLine || !state.readReady) throw new Error('雲端歌本尚未連線，請稍後重試。');
}
function clean(song) {
  const result = { title: String(song.title || '').trim(), artist: String(song.artist || '未知歌手').trim(), lang: ['台語', '國語', '其他'].includes(song.lang) ? song.lang : '其他', videoId: song.videoId || '', vocalId: song.vocalId || '' };
  if (!result.title || result.title.length > 100 || !result.artist || result.artist.length > 100 || !/^(?:[\w-]{11})?$/.test(result.videoId) || !/^(?:[\w-]{11})?$/.test(result.vocalId)) throw new Error('歌曲資料格式有誤。');
  return result;
}
function idFor(song) {
  return song._cloudId || (song.videoId ? 'yt_' + song.videoId : 'song_' + encodeURIComponent(song.title + '|' + song.artist));
}
async function upsertMany(items, onlyMissing = false) {
  requireAdmin();
  if (state.busy) throw new Error('正在儲存歌曲，請稍候。');
  // One atomic transaction per operation: read all documents before writing.
  // Keep imports bounded and report a useful error rather than partially importing a large list.
  const entries = [...new Map(items.map(item => { const data = clean(item); return [idFor({ ...item, ...data }), data]; })).entries()];
  if (!entries.length) return 0;
  if (entries.length > 100) throw new Error('每次最多匯入 100 首，請分批加入。');
  state.busy = true; emit();
  try {
    const uid = auth.currentUser.uid;
    return await runTransaction(db, async tx => {
      const refs = entries.map(([id]) => doc(db, 'songs', id));
      const snapshots = await Promise.all(refs.map(ref => tx.get(ref)));
      let count = 0;
      entries.forEach(([, data], i) => {
        if (onlyMissing && snapshots[i].exists()) return;
        tx.set(refs[i], {
          ...data,
          order: snapshots[i].exists() ? (snapshots[i].data().order ?? Date.now()) : Date.now() + i,
          createdAt: snapshots[i].exists() ? snapshots[i].data().createdAt : serverTimestamp(),
          createdBy: snapshots[i].exists() ? snapshots[i].data().createdBy : uid,
          updatedAt: serverTimestamp(), updatedBy: uid
        });
        count++;
      });
      return count;
    });
  } finally { state.busy = false; emit(); }
}
window.KTV_CLOUD = {
  login: () => signInWithPopup(auth, new GoogleAuthProvider()),
  logout: () => signOut(auth),
  retry: () => { watchAdmin(auth.currentUser); watchSongs(); },
  upsert: song => upsertMany([song]),
  importSongs: songs => upsertMany(songs, true),
  saveBatch: songs => upsertMany(songs),
  explain
};
emit();
window.addEventListener('online', () => { watchSongs(); });
window.addEventListener('offline', emit);

setTimeout(() => { if (!state.readReady && !state.error) { state.error = '雲端尚未回應，請確認已建立 Firestore 資料庫及發布安全規則，再按重新連線。'; emit(); } }, 15000);
