import { readFileSync } from 'node:fs';
import { before, after, test } from 'node:test';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

let env;
const now=Timestamp.fromDate(new Date('2026-11-27T00:00:00Z'));
const verification={
  lyrics:'已核對', content:'待驗證', embedding:'待驗證',
  referenceDuration:240, videoDuration:250, durationSource:'官方發行資訊',
  notes:'待實播', checkedAt:now
};
function record(overrides={}){
  return {title:'測試歌曲',artist:'測試歌手',lang:'台語',videoId:'AbCde123456',vocalId:'',
    order:1,createdAt:now,createdBy:'admin1',updatedAt:now,updatedBy:'admin1',...overrides};
}
function context(uid,provider){
  return env.authenticatedContext(uid,{firebase:{sign_in_provider:provider}}).firestore();
}
before(async()=>{
  env=await initializeTestEnvironment({
    projectId:'demo-ktv-ci',
    firestore:{host:'127.0.0.1',port:8088,rules:readFileSync('firestore.rules','utf8')}
  });
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'admins/admin1'),{enabled:true});
    await setDoc(doc(db,'devices/family1'),{label:'客廳',enabled:true,createdAt:now,approvedAt:now});
    await setDoc(doc(db,'devices/disabled1'),{label:'停用',enabled:false,createdAt:now,approvedAt:now});
    await setDoc(doc(db,'songs/restore'),record({removed:true,verification}));
    await setDoc(doc(db,'songs/active'),record({verification}));
    await setDoc(doc(db,'songs/legacy'),record());
  });
});
after(async()=>{await env?.cleanup();});
test('authorized family can read but not write song or audit flags',async()=>{
  const db=context('family1','anonymous');
  await assertSucceeds(getDoc(doc(db,'songs/active')));
  await assertFails(updateDoc(doc(db,'songs/active'),{removed:true,updatedAt:serverTimestamp(),updatedBy:'family1'}));
});
test('unapproved, anonymous and unsigned identities cannot access song records',async()=>{
  await assertFails(getDoc(doc(context('disabled1','anonymous'),'songs/active')));
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(),'songs/active')));
  await assertFails(getDoc(doc(context('other','google.com'),'songs/active')));
});
test('admin can restore only the removed flag plus audit timestamps',async()=>{
  const db=context('admin1','google.com');
  await assertSucceeds(updateDoc(doc(db,'songs/restore'),{removed:false,updatedAt:serverTimestamp(),updatedBy:'admin1'}));
  await assertFails(updateDoc(doc(db,'songs/active'),{removed:'invalid',updatedAt:serverTimestamp(),updatedBy:'admin1'}));
});
test('admin cannot modify song metadata in same transaction as a restore',async()=>{
  const db=context('admin1','google.com');
  await env.withSecurityRulesDisabled(async ctx=>{
    await setDoc(doc(ctx.firestore(),'songs/restore-two'),record({removed:true,verification}));
  });
  await assertFails(updateDoc(doc(db,'songs/restore-two'),{
    removed:false,title:'偷偷修改名稱',updatedAt:serverTimestamp(),updatedBy:'admin1'
  }));
});
test('admin can write valid review metadata but not invalid status',async()=>{
  const db=context('admin1','google.com');
  await assertSucceeds(updateDoc(doc(db,'songs/active'),{verification,updatedAt:serverTimestamp(),updatedBy:'admin1'}));
  await assertFails(updateDoc(doc(db,'songs/active'),{verification:{...verification,lyrics:'自動通過'},updatedAt:serverTimestamp(),updatedBy:'admin1'}));
  await assertFails(updateDoc(doc(db,'songs/active'),{verification:{...verification,referenceDuration:20000},updatedAt:serverTimestamp(),updatedBy:'admin1'}));
});
test('legacy song without verification still permits authenticated admin edits',async()=>{
  const db=context('admin1','google.com');
  await assertSucceeds(updateDoc(doc(db,'songs/legacy'),{title:'測試歌曲新標題',updatedAt:serverTimestamp(),updatedBy:'admin1'}));
});
