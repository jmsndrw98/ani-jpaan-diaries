const assert=require('assert');
require('./logic.cjs');
global.cancelAnimationFrame=()=>{};
const g=game;let checks=0;
const ok=(value,message)=>{assert(value,message);checks++;};
const reset=(chapter=0)=>{g.ui.close();g.state=Diary.Save.fresh();g.mode='play';g.scene=null;g.enter(chapter);for(let i=0;i<240&&g.loading.active;i++)g.loading.update(1/60);g.play.cancel();g.time=0;};
reset();
// Crossing tile boundaries must not introduce the old one-frame pauses.
const route=g.world.findPath(g.player,{x:9,y:9});let pauses=0;
for(let i=0;i<2000&&route.length;i++){const before={x:g.player.x,y:g.player.y};g.follow(g.player,route,1/60,3.25);if(route.length>1&&Math.hypot(g.player.x-before.x,g.player.y-before.y)<1e-6)pauses++;}
ok(pauses===0,'No stops at intermediate waypoints');
const ends=[];
for(const fps of [30,60,144]){const a={x:11,y:12};for(let i=0;i<fps;i++)Diary.Motion.manual(g.world,a,0,1,1/fps);ends.push(a);}
ok(Math.hypot(ends[0].x-ends[2].x,ends[0].y-ends[2].y)<.05,'Movement remains consistent at 30 and 144 Hz');
reset();g.goToObject('souvenir',true);for(let i=0;i<1800&&!g.ui.modal.open;i++){g.time+=1/60;g.update(1/60);}
ok(g.discovered('souvenir'),'Walking to a selected object opens its interaction on arrival');
reset();
for(const friend of ['happy','toti']){
 const before=g.state.xp;g.care(friend,'play');ok(g.play.care.phase==='aim','Fetch waits for a user-selected throw');g.play.throwTo({x:14,y:15});
 for(let i=0;i<2400&&g.play.care;i++){g.time+=1/60;g.play.update(1/60);}
 ok(g.play.care===null,friend+' retrieves and returns the ball');ok(g.state.xp===before+25,'Fetch rewards completion');
 const same=g.state.xp;g.care(friend,'play');g.play.throwTo({x:14,y:15});for(let i=0;i<2400&&g.play.care;i++){g.time+=1/60;g.play.update(1/60);}ok(g.state.xp===same,'Repeated fetch does not farm XP');
}
reset();g.care('happy','pet');g.play.cancel();ok(g.state.xp===0,'Cancelling care grants no premature reward');
g.player.vx=3;g.player.inputVX=3;g.clearInput();ok(g.player.vx===0&&g.player.inputVX===0,'Blur stops accumulated movement velocity');
// Exercise the actual activity button callbacks using DOM mocks.
const originalQuery=document.querySelectorAll;
const fakeButton=(data)=>({dataset:data,disabled:false,classList:{add(){},remove(){},toggle(){}}});
reset();g.ui.activity();document.getElementById('tea-action').onclick();for(let i=0;i<8;i++)document.getElementById('tea-whisk').onclick();ok(!document.getElementById('tea-action').disabled,'Accessible whisking completes the bowl');document.getElementById('tea-action').onclick();ok(g.discovered('activity'),'Tea saves on pouring');
reset(1);const picnic=[0,1,2].map(i=>fakeButton({picnic:String(i)}));document.querySelectorAll=s=>s==='[data-picnic]'?picnic:[];g.ui.activity();picnic.forEach(b=>b.onclick());ok(!document.getElementById('picnic-share').disabled,'All three picnic items enable sharing');document.getElementById('picnic-share').onclick();ok(g.discovered('activity'),'Picnic saves when shared');
reset(2);document.querySelectorAll=()=>[];g.ui.activity();for(const [id,value] of [['cushion','Moss cotton'],['flower','Cherry blossom'],['lantern','Peach light']])document.getElementById(id).value=value;document.getElementById('decorate-room').onclick();ok(g.state.decoration.join('|')==='Moss cotton|Cherry blossom|Peach light','Room choices persist');ok(g.discovered('activity'),'Room creates an activity memory');
reset(3);const lanterns=[0,1,2].map(i=>fakeButton({lantern:String(i)}));document.querySelectorAll=s=>s==='[data-lantern]'?lanterns:[];g.ui.activity();[0,2,1,0,1].forEach(i=>lanterns[i].onclick());ok(!document.getElementById('keep-melody').disabled,'Lantern melody accepts the complete sequence');document.getElementById('keep-melody').onclick();ok(g.discovered('activity'),'Lantern memory saves');
document.querySelectorAll=originalQuery;
ok(!g.ui.cleanup,'Activity animation loop is disposed when its dialog closes');
console.log(JSON.stringify({polish_assertions:checks,base_assertions:413,total:413+checks,scope:'Logic and mocked DOM callbacks; not browser/device certification.'},null,2));
