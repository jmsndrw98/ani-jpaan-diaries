const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').resolve(__dirname,'..');
const elements=new Map();
const context2d=new Proxy({measureText:t=>({width:t.length*6}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),getImageData:()=>({data:[]})},{get:(t,k)=>k in t?t[k]:()=>{}});
function el(id){if(!elements.has(id))elements.set(id,{id,open:false,value:'',textContent:'',innerHTML:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},clientWidth:1366,clientHeight:768,width:1366,height:768,addEventListener(){},getContext:()=>context2d,focus(){},showModal(){this.open=true},close(){this.open=false},getBoundingClientRect:()=>({left:0,top:0,width:1366,height:768}),toDataURL:()=> 'data:image/jpeg;base64,dGVzdA==',click(){},firstElementChild:{style:{}}});return elements.get(id)}
const storage=new Map();
Object.assign(global,{window:global,innerWidth:1366,innerHeight:768,devicePixelRatio:1,matchMedia:()=>({matches:false}),document:{hidden:false,getElementById:el,querySelector:el,querySelectorAll:()=>[],addEventListener(){},createElement:tag=>el('created-'+tag),documentElement:el('root')},addEventListener(){},requestAnimationFrame(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},Image:class{width=1086;height=1448},performance:{now:()=>0}});
for(const f of ['scripts/data.js','scripts/save.js','scripts/world.js','scripts/motion.js','scripts/art.js','scripts/play.js','scripts/audio.js','scripts/environment.js','scripts/renderer.js','scripts/activities.js','scripts/quests.js','scripts/loading.js','scripts/ui.js','game.js'])vm.runInThisContext(fs.readFileSync(root+'/'+f,'utf8'),{filename:f});
function finishLoading(){for(let i=0;i<240&&game.loading.active;i++)game.loading.update(1/60);assert(!game.loading.active,'Loading completes');}
finishLoading();
let checks=0;function ok(v,message){assert(v,message);checks++;}
for(let i=0;i<4;i++){
 const w=new Diary.World(i);for(const a of [{x:12,y:15},...w.objects.map(o=>({x:o.tx,y:o.ty}))])for(const b of w.objects){const path=w.findPath(a,{x:b.tx,y:b.ty});ok(path.length>0||a.x===b.tx&&a.y===b.ty,`Chapter ${i}: route ${JSON.stringify(a)} to ${b.id}`);ok(path.every(p=>w.walkable(p.x,p.y)),'Path remains walkable');}
 const actor={x:5,y:4};w.move(actor,0,1);if(i!==1)ok(actor.y===4,'Buildings block entry');
}
const g=game;g.startPlay();ok(g.state.started,'Start game');g.intro();g.endScene();finishLoading();ok(g.scene===null&&g.mode==='play','Skip intro returns to play');
for(let i=0;i<4;i++){
 ok(g.unlocked(i),'Chapter unlocked sequentially');if(i){g.travel(i);ok(g.scene.train,'Travel starts train scene');g.endScene();finishLoading();ok(g.state.chapter===i,'Travel changes chapter');}
 const before=g.state.xp;g.discover('landmark','Landmark','A moment');g.discover('landmark','Landmark','A moment');ok(g.state.xp===before+20,'Discovery XP cannot repeat');
 for(const id of ['activity','souvenir'])g.discover(id,id,'A little story');g.photo();ok(g.state.photos.length===i+1,'Actual capture stored');g.rest();g.endScene();finishLoading();ok(g.state.completed.includes(i),'Chapter completes');ok(g.state.inventory.length===i+1,'One keepsake per chapter');g.ui.close();
 for(const friend of ['happy','toti']){const xp=g.state.xp;for(let j=0;j<2;j++){g.care(friend,'feed');for(let t=0;t<600&&g.play.care;t++){g.time+=.016;g.play.update(.016);}}ok(g.state.xp===xp+10,'Companion XP cannot repeat');}
 g.discover('secret','Hidden thing','A secret');g.ui.close();
}
g.ending();g.endScene();finishLoading();ok(g.state.ending&&g.state.completed.length===4,'Ending unlocks free travel');g.ui.close();
const saved=Diary.Save.validate(JSON.parse(JSON.stringify(g.state)));ok(saved.photos.length===4&&saved.entries.length>20&&saved.completed.length===4,'Save preserves journey and photos');Diary.Save.save(saved);ok(Diary.Save.load().xp===saved.xp,'Local save round trip');
let rejected=false;try{Diary.Save.validate({version:8})}catch(e){rejected=true}ok(rejected,'Malformed import rejected');
const injected=structuredClone(saved);injected.discoveries.__proto__={polluted:true};injected.photos.push({place:'bad',data:'javascript:alert(1)'});const safe=Diary.Save.validate(injected);ok(safe.photos.length===4,'Non-image photo payload removed');
g.enter(0);finishLoading();g.guideTo('landmark');for(let i=0;i<1000;i++)g.follow(g.player,g.route,.016,3.1);ok(Math.hypot(g.player.x-9,g.player.y-9)<.15,'Walking follows A* route to arrival');
g.keys.add('w');g.clearInput();ok(g.keys.size===0,'Blur clears held input');
for(let i=0;i<4;i++){g.enter(i);finishLoading();for(const o of g.world.objects){g.guideTo(o.id);for(let n=0;n<1600&&g.route.length;n++)g.follow(g.player,g.route,.016,3.1);ok(Math.hypot(g.player.x-o.tx,g.player.y-o.ty)<.15,`Walking reaches ${i}/${o.id}`);}}
for(const [w,h]of[[360,800],[390,844],[768,1024],[1024,768],[1366,768],[1920,1080]]){g.canvas.clientWidth=w;g.canvas.clientHeight=h;g.renderer.resize();const p=g.renderer.screen(12,15),q=g.renderer.unproject(p.x,p.y);ok(Math.hypot(q.x-12,q.y-15)<.05,'Projection survives resize '+w+'x'+h);g.renderer.frame(1,.016);}
localStorage.setItem=()=>{throw Error('Quota')};ok(!Diary.Save.save(g.state),'Storage failures handled');
console.log(JSON.stringify({passed:checks,chapters:g.state.completed.length,xp:g.state.xp,photos:g.state.photos.length,entries:g.state.entries.length,notes:'Node VM logic harness with DOM/canvas mocks, not a browser compatibility test.'},null,2));
