const fs=require('fs');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,getDocs,collection,updateDoc,deleteDoc,serverTimestamp,Timestamp,deleteField}=require('firebase/firestore');
(async()=>{
 const env=await initializeTestEnvironment({projectId:'demo-family-ktv',firestore:{host:'127.0.0.1',port:8088,rules:fs.readFileSync(require('path').join(__dirname,'../firestore.rules'),'utf8')}});
 let checks=0;const allow=async p=>{await assertSucceeds(p);checks++;};const deny=async p=>{await assertFails(p);checks++;};
 try{
 await env.clearFirestore();await env.withSecurityRulesDisabled(async c=>{const db=c.firestore();await setDoc(doc(db,'admins','owner'),{enabled:true});await setDoc(doc(db,'songs','sample'),{title:'家後',artist:'江蕙',lang:'台語',videoId:'W35whQb6wE4',vocalId:'',order:1,createdAt:Timestamp.now(),createdBy:'owner',updatedAt:Timestamp.now(),updatedBy:'owner'});});
 const anon=uid=>env.authenticatedContext(uid,{firebase:{sign_in_provider:'anonymous'}}).firestore();
 const a=anon('deviceA'),b=anon('deviceB');const owner=env.authenticatedContext('owner',{firebase:{sign_in_provider:'google.com'}}).firestore();const stranger=env.authenticatedContext('stranger',{firebase:{sign_in_provider:'google.com'}}).firestore();const out=env.unauthenticatedContext().firestore();
 const data=()=>({label:'客廳平板',enabled:false,createdAt:serverTimestamp(),approvedAt:null});
 await deny(getDocs(collection(out,'songs')));await deny(getDocs(collection(a,'songs')));
 await deny(getDocs(collection(out,'devices')));await deny(getDocs(collection(a,'devices')));
 await deny(setDoc(doc(a,'devices','deviceA'),{...data(),enabled:true}));
 await deny(setDoc(doc(a,'devices','deviceB'),data()));await deny(setDoc(doc(stranger,'devices','stranger'),data()));
 await deny(setDoc(doc(a,'devices','deviceA'),{...data(),email:'private@example.test'}));
 await deny(setDoc(doc(a,'devices','deviceA'),{...data(),label:'a'.repeat(41)}));
 await deny(setDoc(doc(a,'devices','deviceA'),{...data(),createdAt:Timestamp.fromMillis(1)}));
 await allow(setDoc(doc(a,'devices','deviceA'),data()));await allow(getDoc(doc(a,'devices','deviceA')));
 await deny(getDoc(doc(b,'devices','deviceA')));await deny(updateDoc(doc(a,'devices','deviceA'),{enabled:true,approvedAt:serverTimestamp()}));await deny(updateDoc(doc(a,'devices','deviceA'),{label:'另一台'}));
 await deny(setDoc(doc(a,'admins','deviceA'),{enabled:true}));await deny(updateDoc(doc(owner,'admins','owner'),{enabled:false}));
 await allow(getDocs(collection(owner,'devices')));await allow(getDocs(collection(owner,'songs')));
 await deny(updateDoc(doc(owner,'devices','deviceA'),{enabled:true}));
 await allow(updateDoc(doc(owner,'devices','deviceA'),{enabled:true,approvedAt:serverTimestamp()}));
 await allow(getDocs(collection(a,'songs')));await deny(getDocs(collection(b,'songs')));await deny(updateDoc(doc(a,'songs','sample'),{title:'被修改'}));
 await deny(updateDoc(doc(owner,'devices','deviceA'),{label:'a'.repeat(41),approvedAt:serverTimestamp()}));
 await deny(updateDoc(doc(owner,'devices','deviceA'),{enabled:'true',approvedAt:serverTimestamp()}));
 await deny(updateDoc(doc(owner,'devices','deviceA'),{createdAt:serverTimestamp(),approvedAt:serverTimestamp()}));
 await deny(updateDoc(doc(owner,'devices','deviceA'),{email:'x',approvedAt:serverTimestamp()}));
 await deny(updateDoc(doc(owner,'devices','deviceA'),{label:deleteField(),approvedAt:serverTimestamp()}));
 await allow(updateDoc(doc(owner,'devices','deviceA'),{enabled:false}));await deny(getDocs(collection(a,'songs')));
 await deny(deleteDoc(doc(a,'devices','deviceA')));await deny(setDoc(doc(a,'devices','deviceA'),data()));
 await deny(getDoc(doc(stranger,'admins','owner')));await deny(getDocs(collection(owner,'admins')));await deny(getDoc(doc(out,'unexpected','path')));
 console.log('PASS '+checks+' adversarial rules checks');
 }finally{await env.cleanup();}
})().catch(e=>{console.error(e);process.exitCode=1;});
