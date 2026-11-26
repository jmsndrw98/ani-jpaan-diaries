const assert=require('assert');
require('./polish.cjs');
const g=game;let checks=0;
function ok(v,message){assert(v,message);checks++;}
function loaded(){let frames=0;while(g.loading.active&&frames++<240)g.loading.update(1/60);ok(!g.loading.active,'Loader finishes without a wall-clock timer');}
g.state=Diary.Save.fresh();g.mode='play';g.scene=null;g.ui.close();
for(let chapter=0;chapter<4;chapter++){
 g.enter(chapter);const x=g.player.x;g.keys.add('d');g.update(1);ok(g.player.x===x,'Loading locks movement');g.keys.clear();loaded();
 ok(g.quests.accept(),'A new request can be accepted');ok(!g.quests.accept(),'Duplicate acceptance cannot reset progress');
 ok(g.world.objects.filter(o=>o.quest).length===3,'Three collectible objects appear');
 for(let i=0;i<3;i++){
  const o=g.world.objects.find(o=>o.quest);ok(g.world.walkable(o.tx,o.ty),'Quest item is on a walkable path');
  g.player.x=12;g.player.y=15;ok(!g.quests.collect(o),'Remote collection is rejected');
  g.quests.guide();for(let t=0;t<2400&&g.world.objects.includes(o);t++){g.time+=1/60;g.update(1/60);}
  ok(!g.world.objects.includes(o),'Guided walking collects the item on arrival');
  ok(!g.quests.collect(o),'Stale item cannot be collected twice');
  const saved=Diary.Save.validate(JSON.parse(JSON.stringify(g.state)));g.state=saved;g.quests.sync();ok(g.quests.progress.collected.length===i+1,'Item progress survives save validation');
 }
 ok(g.quests.ready,'Three items enable delivery');ok(!g.quests.claim(),'Reward requires being at the station');
 g.quests.guide();for(let t=0;t<2400&&!g.ui.modal.open;t++){g.time+=1/60;g.update(1/60);}
 ok(g.ui.modal.open,'Arriving at the station opens delivery');const before=g.state.xp;document.getElementById('request-next').onclick();
 ok(g.quests.progress.claimed&&g.state.xp===before+60,'Delivery callback grants reward');ok(!g.quests.claim()&&g.state.xp===before+60,'Reward cannot repeat');g.ui.close();
 g.enter(chapter);loaded();ok(g.world.objects.every(o=>!o.quest),'Completed items remain gone after revisiting');
}
ok(g.state.entries.length===4&&g.state.xp===240,'All four quests save their stories and rewards');
const old=Diary.Save.fresh();delete old.quests;ok(Object.keys(Diary.Save.validate(old).quests).length===0,'Older saves migrate without losing the journey');
old.quests={kyoto:{collected:[0,0,2,99,'1',-1],claimed:true},evil:{collected:[0,1,2],claimed:true}};
const clean=Diary.Save.validate(old);ok(clean.quests.kyoto.collected.join(',')==='0,2'&&!clean.quests.kyoto.claimed&&!clean.quests.evil,'Malformed quest progress is sanitized');
g.enter(0);g.loading.update(.016);g.enter(1);loaded();ok(g.renderer.terrainWorld===g.world,'Restarted loading prepares the newest destination');
g.intro(true);const first=Diary.trainDistance(0);ok(first===0,'Train starts at rest');
const ends=[];for(const fps of [30,60,144]){let elapsed=0;for(let i=0;i<fps*8;i++)elapsed+=1/fps;ends.push(Diary.trainDistance(elapsed));}
ok(Math.abs(ends[0]-ends[2])<1e-9,'Train distance is refresh-rate independent');
ok(Diary.trainDistance(.1)<.004&&Diary.trainDistance(10)-Diary.trainDistance(9)>.98,'Train eases smoothly to cruising speed');
g.last=0;g.frame(16);const t=g.scene.elapsed;document.getElementById('train-pause').onclick();g.frame(32);ok(g.scene.elapsed===t,'Pause freezes scenery time');document.getElementById('train-pause').onclick();g.frame(48);ok(g.scene.elapsed>t,'Resume continues from the same position');
g.state.settings.motion=false;const still=g.scene.elapsed;g.frame(64);ok(g.scene.elapsed===still,'Reduced motion keeps the scenery still');
g.endScene();g.enter(0);loaded();ok(document.getElementById('loading-progress').value===1,'Progress reaches one only after preparation jobs');
console.log(JSON.stringify({quest_train_loading_assertions:checks,previous_assertions:435,total:435+checks,scope:'Real logic, route traversal, mocked DOM callbacks and native-style Canvas calls; not browser certification.'},null,2));
