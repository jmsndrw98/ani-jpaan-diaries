'use strict';
// Optional errands never gate the main journey. All rewards are claimed once.
Diary.QUESTS = [
 {id:'kyoto',title:'The postcards in the wind',giver:'The station attendant',text:'A gust scattered three illustrated postcards on the path. Could you bring them back before we put out the mail?',items:['Shrine postcard','Tea-shop postcard','Sakura postcard'],spots:[[11,6],[16,11],[9,15]],reward:'Kyoto postcard set',ending:'The attendant slides the postcards into their envelopes and gives Ani a spare set. Happy gets a very grateful scratch behind the ears.'},
 {id:'nara',title:'A field guide for a friend',giver:'The forest guide',text:'Three pages slipped out of my field notebook. Please look along the walking paths; there is no need to disturb the deer.',items:['Oak-leaf sketch','River sketch','Wildflower sketch'],spots:[[7,11],[12,7],[15,16]],reward:'Pocket field guide',ending:'The sketches are back in order. The guide binds a little copy for Ani, with a drawing of Toti on the last page.'},
 {id:'hakone',title:'Letters from the mountain',giver:'The ryokan keeper',text:'Our weather sketches blew out of their folder on the way to the station. Will you find the three sheets and leave them at the ticket desk?',items:['Cloud sketch','Rain sketch','Sunset sketch'],spots:[[10,10],[12,18],[18,16]],reward:'Mountain weather booklet',ending:'The keeper dries the pages beside the stove. A small booklet of mountain skies is waiting for Ani at the station.'},
 {id:'tokyo',title:'Three wishes before the lights',giver:'The lantern maker',text:'Three wish cards came loose from tonight’s display. Bring them to the station so I can tie them back onto the lanterns.',items:['A wish for home','A wish for friendship','A wish for adventure'],spots:[[8,11],[12,6],[17,16]],reward:'Three-wish bookmark',ending:'The cards find their lanterns. The maker knots a bookmark from the leftover ribbon: one strand for each of our three travelers.'}
];
Diary.Quests = class {
 constructor(game){this.g=game;}
 get definition(){return Diary.QUESTS[this.g.state.chapter];}
 get progress(){return this.g.state.quests[this.definition.id];}
 get ready(){return this.progress?.collected.length===3&&!this.progress.claimed;}
 sync(){const g=this.g,q=this.definition,p=this.progress;g.world.objects=g.world.objects.filter(o=>!o.quest);if(!p||p.claimed)return;
  q.spots.forEach(([x,y],i)=>{if(!p.collected.includes(i))g.world.objects.push({id:'parcel-'+i,quest:true,item:i,x,y,tx:x,ty:y,label:q.items[i]});});
 }
 accept(){if(this.progress)return false;this.g.state.quests[this.definition.id]={collected:[],claimed:false};this.sync();this.g.persist();this.g.ui.hud();return true;}
 collect(o){const g=this.g,p=this.progress;if(!p||p.claimed||!o.quest||!g.world.objects.includes(o)||Math.hypot(g.player.x-o.tx,g.player.y-o.ty)>2.2||p.collected.includes(o.item))return false;
  p.collected.push(o.item);this.sync();g.persist();g.ui.hud();g.audio.chime();g.toast(this.ready?'All three found. Return them at the station.':o.label+' safely tucked away · '+p.collected.length+'/3');return true;
 }
 claim(){const g=this.g,station=g.world.objects.find(o=>o.id==='station');if(!this.ready||Math.hypot(g.player.x-station.tx,g.player.y-station.ty)>2.2)return false;
  const q=this.definition;this.progress.claimed=true;g.state.xp+=60;g.state.entries.push({title:q.reward,text:q.ending,place:g.chapter.name});this.sync();g.persist();g.ui.hud();g.audio.chime();g.toast(q.reward+' collected · +60 XP');return true;
 }
 guide(){const g=this.g;if(!this.progress)this.accept();const target=this.ready?'station':g.world.objects.find(o=>o.quest)?.id;if(target)g.guideTo(target);}
};
