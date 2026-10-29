const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
test('OST import uses existing admin API; only server snapshot populates catalog and revocation clears it',async()=>{
  const elements=new Map();
  function element(){return {value:'',hidden:false,children:[],classList:{remove(){},toggle(){}},append(...items){this.children.push(...items);},replaceChildren(...items){this.children=[...items];},addEventListener(name,fn){this[name]=fn;},showModal(){this.open=true;},close(){this.open=false;},setAttribute(){}};}
  const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
  const imports=[];const window={};
  const ctx={window,console,document:{getElementById:get,createElement:element,querySelectorAll:()=>[],body:element()},location:{search:''},localStorage:{getItem:()=>null},navigator:{onLine:true},URL,URLSearchParams,setTimeout:()=>1,clearTimeout(){},KTVPlayback:class{stop(){}},KTVSortSongs:s=>s,KTVStrokeCount:()=>0};
  const root=path.join(__dirname,'..');vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'ost-2026.js'),'utf8'),ctx);ctx.KTVOST2026=window.KTVOST2026;
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  vm.runInContext([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],ctx);
  const state={admin:true,access:true,readReady:true,authReady:true,user:{uid:'manager'},devices:[],busy:false,count:0};
  window.KTV_APP.setCloudState(state);
  const chip=get('filters').children.find(e=>e.textContent==='2026 陸劇 OST');assert.ok(chip);chip.click();
  assert.equal(get('importOST').hidden,false);assert.equal(get('songList').children.some(e=>e.className==='song'),false);
  window.KTV_CLOUD={importSongs:async items=>{imports.push(items);return items.length;}};
  await get('importOST').onclick();assert.equal(imports[0][0].videoId,'PJQGy005Ylg');
  assert.equal(get('songList').children.some(e=>e.className==='song'),false,'no optimistic cloud catalog');
  window.KTV_APP.setCloudSongs([{...imports[0][0],_cloudId:'yt_PJQGy005Ylg'}]);
  assert.equal(get('songList').children.filter(e=>e.className==='song').length,1);assert.equal(get('importOST').hidden,true);
  window.KTV_APP.setCloudSongs([]);window.KTV_APP.setCloudState({...state,admin:false,access:false,user:null});
  assert.equal(get('ktvMain').hidden,true);assert.equal(get('importOST').hidden,true);
});
