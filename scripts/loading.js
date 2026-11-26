'use strict';
Diary.Loading = class {
 constructor(game){this.g=game;this.active=false;this.jobs=[];}
 start(title){const g=this.g;this.active=true;this.elapsed=0;this.minimumDisplay=2.2;this.reveal=0;this.waitFrame=true;this.completed=0;
  this.jobs=[{label:'Unfolding the scenery',run:()=>g.renderer.terrain()}];
  ['Ani','Happy','Toti'].forEach((name,index)=>{for(let batch=0;batch<4;batch++)this.jobs.push({label:name+' is getting ready',face:index,run:()=>{for(let n=0;n<8;n++)Diary.Art.sprite(index,{pace:1,gait:(batch*8+n)/32*Math.PI*2},0,false);}});});
  for(let i=0;i<g.world.props.length;i+=6){const props=g.world.props.slice(i,i+6);this.jobs.push({label:'Preparing the places around us',run:()=>props.forEach(p=>g.renderer.prop(p,0))});}
  this.total=this.jobs.length;const box=document.getElementById('loading-screen');box.classList.remove('hidden','revealing');document.getElementById('loading-title').textContent=title;document.getElementById('loading-progress').value=0;document.getElementById('loading-status').textContent='Opening the travel diary';for(const child of document.getElementById('app').children||[])if(child!==box)child.inert=true;g.clearInput();
 }
 update(dt){if(!this.active)return;this.elapsed+=dt;
  document.querySelectorAll('.loading-face').forEach((face,i)=>face.classList.toggle('preparing',i===Math.min(2,Math.floor(this.elapsed/.7))));
  if(this.waitFrame){this.waitFrame=false;return;}
  if(this.jobs.length){const job=this.jobs.shift();job.run();this.completed++;document.getElementById('loading-status').textContent=job.label;document.getElementById('loading-progress').value=this.completed/this.total;return;}
  document.getElementById('loading-status').textContent='Everyone is ready';
  if(this.elapsed<this.minimumDisplay)return;
  if(!this.reveal){document.getElementById('loading-status').textContent='Everyone is ready';document.getElementById('loading-screen').classList.add('revealing');}
  this.reveal+=dt;if(this.reveal>=(this.g.state.settings.motion?.32:0))this.finish();
 }
 finish(){this.active=false;this.jobs=[];document.getElementById('loading-screen').classList.add('hidden');for(const child of document.getElementById('app').children||[])child.inert=false;if(this.g.mode==='play'){this.g.audio.arrive(this.g.state.chapter);this.g.canvas.focus();}else if(this.g.mode==='title')document.getElementById('begin').focus();}
};
