import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
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
const state = { user: null, admin: false, readReady: false, error: '', authError: '', count: 0, busy: false, vocalCount: 0, vocalMissing: 0, vocalSync: '', packCount: 0, packSync: '', access: false, device: null, devices: [], deviceError: '', authReady: false };
let stopAdmin = null, stopSongs = null, stopDevice = null, stopDeviceList = null, authEpoch = 0, songsEpoch = 0, latestSongs = [], vocalBackfillAttempted = false, sourceImportAttempted = false;
const emit = () => {window.KTV_APP.setCloudState({ ...state });if(window.KTVGetVocal)Promise.resolve().then(maybeFillVocals);if(window.KTV_SOURCE_SONGS)Promise.resolve().then(maybeImportSourcePack);};
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
function clearSongs(){
  ++songsEpoch;stopSongs?.();stopSongs=null;latestSongs=[];state.count=0;state.readReady=false;
  window.KTV_APP.setCloudSongs([]);
}
function reconcileAccess(){
  const allowed=state.admin||state.device?.enabled===true;
  if(allowed!==state.access){state.access=allowed;if(allowed)watchSongs();else clearSongs();}
  emit();
}
function watchIdentity(user){
  stopAdmin?.();stopDevice?.();stopDeviceList?.();stopAdmin=stopDevice=stopDeviceList=null;
  const epoch=++authEpoch;
  state.admin=false;state.device=null;state.devices=[];state.access=false;state.deviceError='';clearSongs();
  if(!user){emit();return;}
  if(!user.isAnonymous)stopAdmin=onSnapshot(doc(db,'admins',user.uid),snapshot=>{
    if(epoch!==authEpoch)return;
    state.admin=snapshot.exists()&&snapshot.data().enabled===true;
    state.authError='';
    stopDeviceList?.();stopDeviceList=null;state.devices=[];
    if(state.admin)stopDeviceList=onSnapshot(collection(db,'devices'),{includeMetadataChanges:true},snapshot=>{
      if(epoch!==authEpoch||!state.admin||snapshot.metadata.fromCache||snapshot.metadata.hasPendingWrites)return;
      state.devices=snapshot.docs.map(d=>({_id:d.id,label:d.data().label,enabled:d.data().enabled}));state.deviceError='';emit();
    },error=>{if(epoch!==authEpoch)return;state.devices=[];state.deviceError='裝置名單尚未啟用：'+explain(error);emit();});
    reconcileAccess();
  },error=>{if(epoch!==authEpoch)return;state.admin=false;state.authError=explain(error);reconcileAccess();});
  if(user.isAnonymous)stopDevice=onSnapshot(doc(db,'devices',user.uid),{includeMetadataChanges:true},snapshot=>{
    if(epoch!==authEpoch||snapshot.metadata.fromCache||snapshot.metadata.hasPendingWrites)return;
    state.device=snapshot.exists()?{label:snapshot.data().label,enabled:snapshot.data().enabled}:null;
    state.deviceError='';reconcileAccess();
  },error=>{if(epoch!==authEpoch)return;state.device=null;state.deviceError=explain(error);reconcileAccess();});
  emit();
}
function watchSongs() {
  if(!state.access)return;
  const epoch=++songsEpoch;
  stopSongs?.();
  state.error = ''; state.readReady = false; emit();
  stopSongs = onSnapshot(collection(db, 'songs'), { includeMetadataChanges: true }, snapshot => {
    // Only show confirmed server data; pending writes are not reported as a completed sync.
    if (epoch!==songsEpoch||!state.access||snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
    const songs = snapshot.docs.map(d => ({ ...d.data(), _cloudId: d.id }))
      .filter(s => typeof s.title === 'string' && typeof s.artist === 'string')
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.title.localeCompare(b.title, 'zh-Hant'));
    latestSongs=songs;state.packCount=(window.KTV_SOURCE_SONGS||[]).filter(p=>songs.some(s=>s._cloudId===p._cloudId&&s.videoId!=='21f7PU0eQgk')).length;state.vocalCount=songs.filter(s=>/^[\w-]{11}$/.test(s.vocalId||'')).length;state.vocalMissing=songs.filter(s=>!s.vocalId&&window.KTVGetVocal?.(s)).length;
    state.readReady = true; state.count = songs.length; state.error = '';
    window.KTV_APP.setCloudSongs(songs); emit();
  }, error => { if(epoch!==songsEpoch)return;state.access=false;clearSongs();state.error=explain(error);emit(); });
}
onAuthStateChanged(auth,user=>{
  // Never copy Google email, name or photo into song or device documents.
  state.user=user?{uid:user.uid,anonymous:user.isAnonymous===true}:null;
  state.authReady=true;state.authError='';state.error='';vocalBackfillAttempted=false;sourceImportAttempted=false;
  watchIdentity(user);
},error=>{state.authReady=true;state.authError=explain(error);emit();});
async function requestDevice(label){
  label=String(label||'').trim();
  if(!label||label.length>40)throw new Error('請填寫 1 到 40 字的裝置暱稱，例如客廳平板。');
  if(auth.currentUser&&!auth.currentUser.isAnonymous)throw new Error('管理者請使用自己的裝置；家人裝置請先登出 Google，再申請授權。');
  try{
    const user=auth.currentUser||(await signInAnonymously(auth)).user;
    await runTransaction(db,async tx=>{const ref=doc(db,'devices',user.uid);const snap=await tx.get(ref);if(!snap.exists())tx.set(ref,{label,enabled:false,createdAt:serverTimestamp(),approvedAt:null});});
  }catch(error){if(error.code?.includes('operation-not-allowed'))throw new Error('裝置授權尚未啟用，請管理者先在 Firebase 啟用匿名登入。');throw error;}
}
async function setDeviceEnabled(uid,enabled){
  requireAdmin();
  if(typeof uid!=='string'||typeof enabled!=='boolean')throw new Error('裝置資料不正確。');
  await runTransaction(db,async tx=>{const ref=doc(db,'devices',uid);const snap=await tx.get(ref);if(!snap.exists())throw new Error('此裝置不存在。');tx.update(ref,{enabled,approvedAt:enabled?serverTimestamp():snap.data().approvedAt});});
}
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
async function fillVocals() {
  requireAdmin();
  if(state.busy)throw new Error('正在儲存歌曲，請稍候。');
  const ids=latestSongs.filter(s=>!s.vocalId&&window.KTVGetVocal?.(s)).map(s=>s._cloudId);
  if(!ids.length)return 0;
  state.busy=true;state.vocalSync='正在將原唱設定補寫到雲端…';emit();
  try {
    const uid=auth.currentUser.uid;
    const count=await runTransaction(db,async tx=>{
      const refs=ids.map(id=>doc(db,'songs',id));
      const snapshots=await Promise.all(refs.map(ref=>tx.get(ref)));
      let count=0;
      snapshots.forEach((snapshot,i)=>{
        if(!snapshot.exists())return;
        const song=snapshot.data();
        if(song.vocalId)return;
        const vocalId=window.KTVGetVocal?.(song);
        if(!/^[\w-]{11}$/.test(vocalId||''))return;
        tx.update(refs[i],{vocalId,updatedAt:serverTimestamp(),updatedBy:uid});count++;
      });
      return count;
    });
    state.vocalSync='原唱設定已補寫到雲端：'+count+' 首。';return count;
  } catch(error) {
    state.vocalSync='原唱尚未寫入雲端：'+explain(error);throw error;
  } finally {state.busy=false;emit();}
}
async function maybeFillVocals(){
  if(vocalBackfillAttempted||!state.admin||!state.readReady||state.busy)return;
  vocalBackfillAttempted=true;
  if(state.vocalMissing)try{await fillVocals();}catch{ /* Status is shown in the cloud songbook; retry remains available. */ }
}
async function importSourcePack(){
  requireAdmin();
  if(state.busy)throw new Error('正在儲存歌曲，請稍候。');
  sourceImportAttempted=true;
  const pack=window.KTV_SOURCE_SONGS||[];
  state.busy=true;state.packSync='正在更新 14 首獨立伴唱影片…';emit();
  try{
    const uid=auth.currentUser.uid;
    const count=await runTransaction(db,async tx=>{
      const refs=pack.map(s=>doc(db,'songs',s._cloudId));
      const snapshots=await Promise.all(refs.map(ref=>tx.get(ref)));
      let count=0;
      snapshots.forEach((snapshot,i)=>{
        if(!snapshot.exists()){
          tx.set(refs[i],{...clean(pack[i]),order:Date.now()+i,createdAt:serverTimestamp(),createdBy:uid,updatedAt:serverTimestamp(),updatedBy:uid});count++;return;
        }
        const song={...snapshot.data(),_cloudId:pack[i]._cloudId};
        const next=window.KTVSourceReplacement?.(song);
        if(!next)return;
        const patch={videoId:next.videoId,updatedAt:serverTimestamp(),updatedBy:uid};
        if(song.artist==='豪聲唱片合輯')patch.artist=next.artist;
        tx.update(refs[i],patch);count++;
      });return count;
    });
    state.packSync='獨立伴唱影片已更新到雲端：'+count+' 首。';return count;
  }catch(error){state.packSync='獨立影片尚未寫入雲端：'+explain(error);throw error;}
  finally{state.busy=false;emit();}
}

async function maybeImportSourcePack(){
  if(sourceImportAttempted||!state.admin||!state.readReady||state.busy)return;
  try{await importSourcePack();}catch{ /* The retry button remains available. */ }
}
window.KTV_CLOUD = {
  roomContext:()=>({db,auth,allowed:()=>state.access}),
  login: () => signInWithPopup(auth, new GoogleAuthProvider()),
  logout: () => signOut(auth),
  retry: () => { watchIdentity(auth.currentUser); },
  requestDevice,
  setDeviceEnabled,
  upsert: song => upsertMany([song]),
  importSongs: songs => upsertMany(songs, true),
  saveBatch: songs => upsertMany(songs),
  fillVocals,
  importSourcePack,
  explain
};
emit();
window.addEventListener('online', () => { watchSongs(); });
window.addEventListener('offline', emit);

setTimeout(() => { if (state.access && !state.readReady && !state.error) { state.error = '雲端尚未回應，請確認已建立 Firestore 資料庫及發布安全規則，再按重新連線。'; emit(); } }, 15000);
