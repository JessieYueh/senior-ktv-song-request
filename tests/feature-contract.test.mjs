import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html=readFileSync('index.html','utf8');
const cloud=readFileSync('cloud.js','utf8');
const rules=readFileSync('firestore.rules','utf8');
const script=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].filter(m=>!m[1].includes('src=')).map(m=>m[2]);

test('inline scripts parse',()=>{
  assert.ok(script.length>0);
  script.forEach((s,i)=>assert.doesNotThrow(()=>new vm.Script(s,{filename:'index-inline-'+i+'.js'})));
});
test('cloud module parses',()=>{
  // Node vm.Script cannot parse import, so remove only module declarations for syntax checking.
  const stripped=cloud.replace(/^import .*?;\r?\n/gm,'').replace(/\bexport\s+(?=function|const|let|class)/g,'');
  assert.doesNotThrow(()=>new vm.Script(stripped,{filename:'cloud.js'}));
});
const id=(name)=>new RegExp('id="'+name+'"').test(html);
test('phase 1: player preview 25/50/75 and manual lyric decisions',()=>{
  for(const name of ['preview25','preview50','preview75','editorPreview','verifyLyrics'])assert.ok(id(name),name);
  assert.match(html,/function previewVideo\(/);
  assert.match(html,/Math\.floor\(duration\*fraction\)/);
});
test('phase 1: same-title different-video warning',()=>{
  assert.ok(id('quickDuplicate'));
  assert.match(html,/function confirmNewVersion\(/);
  assert.match(html,/if\(!confirmNewVersion\(title,artist,videoId\)\)return/);
});
test('phase 2: audit information retained and reset when video changes',()=>{
  for(const name of ['verifyLyrics','verifyContent','verifyEmbed','verifyNotes'])assert.ok(id(name));
  assert.match(cloud,/prev\?\.verification \|\| verification/);
  assert.match(cloud,/videoChanged/);
  assert.match(cloud,/lyrics:'待驗證',content:'待驗證',embedding:'待驗證'/);
  assert.match(rules,/validVerification\(v\)/);
});
test('phase 2: official duration independent from candidate duration',()=>{
  for(const name of ['referenceDuration','candidateDuration','durationSource','durationWarning'])assert.ok(id(name));
  assert.match(html,/Math\.abs\(Number\(a\)-Number\(b\)\)>15/);
});
test('phase 3: three search presets',()=>{
  assert.ok(id('quickSearchType'));
  for(const type of ['mv','lyrics','full'])assert.match(html,new RegExp('value="'+type+'"'));
  assert.match(html,/function openYouTubeSearch\(/);
});
test('phase 3: admin soft-delete restore is transactional',()=>{
  assert.ok(id('deletedDialog'));assert.ok(id('deletedList'));assert.ok(id('deletedBtn'));
  assert.match(cloud,/async function restoreSong\(/);
  assert.match(cloud,/tx\.update\(ref,\{removed:false/);
  assert.match(rules,/request\.resource\.data\.diff\(resource\.data\)\.affectedKeys\(\)\.hasOnly\(\['removed','updatedAt','updatedBy'\]\)/);
});
test('phase 4: Shorts warnings before adding',()=>{
  assert.ok(id('quickShortsWarning'));
  assert.match(html,/function updateShortsWarning\(/);
  assert.match(html,/isShorts\(\$\('quickVideo'\)\.value\)\&\&!confirm/);
});
test('phase 4: language carried to quick save',()=>{
  assert.ok(id('quickLang'));
  assert.match(html,/lang:\$\('quickLang'\)\.value/);
  assert.match(html,/includes\(category\)\?category:'國語'/);
});
test('CI may not deploy or push production',()=>{
  const workflow=readFileSync('.github/workflows/ktv-acceptance.yml','utf8');
  assert.doesNotMatch(workflow,/firebase deploy|git push|pages: write|contents: write/);
  assert.match(workflow,/emulators:exec/);
});
