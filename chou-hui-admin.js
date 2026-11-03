// Standalone manager: no background imports or vocal/source-pack updates.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getFirestore,doc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
const app=initializeApp({apiKey:'AIzaSyDJ-GH4lePxV_RL-dZ0Dm7HaXwOMq8XHx0',authDomain:'ktvdata-da16f.firebaseapp.com',projectId:'ktvdata-da16f',appId:'1:305621061136:web:ca0ace5ad6f12c9c0d0495'});
const auth=getAuth(app),db=getFirestore(app), $=id=>document.getElementById(id);
const base='https://firestore.googleapis.com/v1/projects/ktvdata-da16f/databases/(default)', prefix='projects/ktvdata-da16f/databases/(default)/documents/';
let admin=false,busy=false,remote=[],results=(KTV_CHOU_HUI.verified?.()||[]).map(e=>({title:e.title,videoId:e.videoId,ok:true,seconds:e.durationSeconds,reason:e.evidence,checkedAt:e.checkedAt,verificationReference:e.verificationReference}));
let report={startedAt:new Date().toISOString(),origin:location.origin,results:[],committed:0,confirmed:0};
const norm=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
const log=t=>{$('log').textContent+=t+'\n';};
function controls(){ $('verify').disabled=!admin||busy;$('import').disabled=!admin||busy||!results.some(r=>r.ok);$('refresh').disabled=busy;$('login').disabled=busy; }
async function api(path,body,method='POST'){
 if(!auth.currentUser)throw Error('請登入管理帳號');
 const token=await auth.currentUser.getIdToken();
 const response=await fetch(base+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const data=await response.json();if(!response.ok)throw Error(path+' HTTP '+response.status+': '+(data.error?.message||data.find?.(r=>r.error)?.error?.message||JSON.stringify(data).slice(0,500)));return data;
}
function decode(d){const f=d.fields||{};return {_cloudId:d.name.slice(prefix.length+'songs/'.length),title:f.title?.stringValue||'',artist:f.artist?.stringValue||'',videoId:f.videoId?.stringValue||'',vocalId:f.vocalId?.stringValue||''};}
async function readSongs(transaction){const rows=await api('/documents:runQuery',{structuredQuery:{from:[{collectionId:'songs'}]},...(transaction?{transaction}:{})});return rows.filter(r=>r.document).map(r=>decode(r.document));}
function duplicate(e,songs){return songs.some(s=>s.videoId===e.videoId||s.vocalId===e.videoId||(norm(s.title)===norm(e.title)&&norm(s.artist).includes('周蕙')));}
async function refresh(){remote=await readSongs();$('status').textContent='已讀取伺服器歌單 '+remote.length+' 首；周蕙 '+remote.filter(s=>norm(s.artist).includes('周蕙')).length+' 首。';}
async function guarded(fn){if(busy)return;busy=true;controls();try{await fn();}catch(e){log('未完成：'+e.message);}finally{busy=false;controls();}}
$('login').onclick=()=>guarded(()=>signInWithPopup(auth,new GoogleAuthProvider()));
$('refresh').onclick=()=>guarded(refresh);
onAuthStateChanged(auth,async user=>{admin=false;controls();if(!user||user.isAnonymous){$('status').textContent='請使用已授權的 Google 管理帳號登入。';return;}try{const d=await api('/documents/admins/'+user.uid,null,'GET');admin=d.fields?.enabled?.booleanValue===true;if(!admin)throw Error('此帳號尚未獲管理授權');await refresh();}catch(e){$('status').textContent=e.message;}controls();});
$('verify').onclick=()=>guarded(async()=>{
 const candidates=KTV_CHOU_HUI.entries.filter(e=>e.videoId&&e.channel&&['official_channel','official_title','official_audio'].includes(e.sourceEvidence)&&e.expectedDurationSeconds>0);
 const selected=$('scope').value==='one'?candidates.slice(0,1):$('scope').value==='pending'?candidates.filter(e=>!results.some(r=>r.ok&&r.videoId===e.videoId)):candidates;
 report.results=results;
 log('開始驗證 '+selected.length+' 首；目前不寫入 Firestore。');
 for(let i=0;i<selected.length;i++){
  const entry=selected[i];
  $('status').textContent='正在驗證 '+(i+1)+'／'+selected.length+'：'+entry.title;
  const [r]=await KTV_VERIFY_CHOU_HUI.run([entry],$('player'),log);
  results=results.filter(previous=>previous.videoId!==entry.videoId);results.push({...r,source:entry.source,channel:entry.channel,expectedDurationSeconds:entry.expectedDurationSeconds,checkedAt:new Date().toISOString()});report.results=results;
 }
 $('status').textContent='檢查完成：'+results.filter(r=>r.ok).length+' 首通過；'+results.filter(r=>!r.ok).length+' 首未通過。尚未匯入。';
});
$('import').onclick=()=>guarded(async()=>{
 if(!admin)throw Error('請先登入已授權管理帳號');
 const eligible=KTV_CHOU_HUI.entries.filter(e=>results.some(r=>r.ok&&r.videoId===e.videoId&&r.title===e.title&&r.seconds>0));
 if(!eligible.length)throw Error('沒有完成實播驗證的歌曲');
 let committed=false;
 try{
  const all=await readSongs();
  const candidates=eligible.filter(e=>!duplicate(e,all));
  if(candidates.length>100)throw Error('每次最多新增 100 首');
  if(!candidates.length){log('已驗證歌曲皆已存在，新增 0 首。');return;}
  const uid=auth.currentUser.uid;
  // Re-read every observed existing document plus every target atomically.
  // This handles changes to legacy IDs, edits, collisions and retries. Every
  // target must be absent in the transaction; existing songs are never written.
  const ids=[...new Set([...all.map(s=>s._cloudId),...candidates.map(e=>'yt_'+e.videoId)])];
  const missing=await runTransaction(db,async tx=>{
   const refs=ids.map(id=>doc(db,'songs',id)),snapshots=await Promise.all(refs.map(ref=>tx.get(ref)));
   const current=snapshots.flatMap((snapshot,i)=>snapshot.exists()?[{...snapshot.data(),_cloudId:ids[i]}]:[]),selected=[];
   for(const e of candidates){if(!current.some(s=>s._cloudId==='yt_'+e.videoId)&&!duplicate(e,[...current,...selected]))selected.push(e);}
   selected.forEach((e,i)=>tx.set(doc(db,'songs','yt_'+e.videoId),{title:e.title,artist:e.artist,lang:e.lang,videoId:e.videoId,vocalId:e.vocalId||'',order:Date.now()+i,createdAt:serverTimestamp(),createdBy:uid,updatedAt:serverTimestamp(),updatedBy:uid}));
   return selected;
  });
  committed=true;report.committed+=missing.length;
  const after=await readSongs();const confirmed=missing.filter(e=>after.some(s=>s._cloudId==='yt_'+e.videoId&&s.title===e.title&&s.artist===e.artist&&s.videoId===e.videoId)).length;
  report.confirmed+=confirmed;report.skippedExisting=eligible.length-missing.length;report.completedAt=new Date().toISOString();remote=after;
  $('status').textContent='本次交易成功新增 '+missing.length+' 首；伺服器回讀確認 '+confirmed+' 首；略過既有 '+(eligible.length-missing.length)+' 首。';log($('status').textContent);
 }catch(e){if(committed)log('交易已提交，伺服器回讀未完成；請先重新讀取歌單，勿將此情況視為零寫入。');throw e;}
});
$('report').onclick=()=>{const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='chou-hui-verification-2026-11-03.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
