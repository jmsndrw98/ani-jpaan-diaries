'use strict';
Diary.Audio = class {
 constructor(game){this.game=game;this.ctx=null;this.settings=null;this.chapter=game?.state.chapter||0;this.player=null;this.activeId=null;this.unlocked=false;this.pending=false;this.generation=0;this.fade=1;this.message='Music starts after Begin or Enable music.';}
 status(text){this.message=text;const el=document.getElementById('bgm-status');if(el)el.textContent=text;}
 createPlayer(){if(this.player)return true;if(typeof window.Audio!=='function'){this.status('Music playback is unavailable in this browser.');return false;}
  this.player=new window.Audio();this.player.loop=true;this.player.preload='metadata';this.player.playsInline=true;this.player.volume=0;
  this.player.addEventListener('error',()=>{this.pending=false;this.status('This audio file could not play. Try another song or browser, then Enable music.');});return true;
 }
 start(settings){this.unlocked=true;try{if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.fx=this.ctx.createGain();this.fx.connect(this.master);this.amb=this.ctx.createGain();this.amb.connect(this.master);const b=this.ctx.createBuffer(1,this.ctx.sampleRate*3,this.ctx.sampleRate),d=b.getChannelData(0);let prev=0;for(let i=0;i<d.length;i++){prev=(prev+(Math.random()*2-1)*.025)/1.025;d[i]=prev*.6;}const source=this.ctx.createBufferSource();source.buffer=b;source.loop=true;const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;source.connect(filter);filter.connect(this.amb);source.start();}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});}catch(e){this.ctx=null;}
  if(this.game&&!this.game.loading?.active)this.chapter=this.game.state.chapter;this.update(settings);
 }
 update(s){this.settings=s;if(this.ctx){this.master.gain.value=s.muted?0:.45;this.fx.gain.value=s.effects;this.amb.gain.value=s.ambience;}if(this.unlocked)this.arrive(this.chapter);}
 arrive(chapter){this.chapter=chapter;if(!this.unlocked||!this.settings)return;const id=this.settings.songs?.[chapter]||Diary.MUSIC_DEFAULTS[chapter];
  if(id==='off'){if(this.player)this.player.pause();this.generation++;this.pending=false;this.activeId='off';this.status('BGM is off for '+Diary.CHAPTERS[chapter].name+'.');return;}
  const track=Diary.MUSIC_TRACKS.find(t=>t.id===id);if(!track||!this.createPlayer())return;
  if(this.activeId!==id){this.player.pause();this.generation++;this.pending=false;this.activeId=id;this.fade=0;this.player.volume=0;this.player.src=track.src;this.player.load();this.status('Loading '+track.title+'…');}
  this.player.muted=!!this.settings.muted;this.player.volume=Math.max(0,Math.min(1,this.settings.music*this.fade));
  if(this.settings.muted||this.settings.music===0){this.player.pause();this.generation++;this.pending=false;this.status('Music muted. Your song choice is saved.');return;}this.tryPlay();
 }
 tryPlay(){if(!this.player||!this.unlocked||this.activeId==='off'||this.pending||!this.player.paused)return;const token=++this.generation;this.pending=true;
  try{const promise=this.player.play();Promise.resolve(promise).then(()=>{if(token!==this.generation)return;this.pending=false;const title=Diary.MUSIC_TRACKS.find(t=>t.id===this.activeId)?.title;this.status('Looping: '+title);}).catch(err=>{if(token!==this.generation)return;this.pending=false;this.status(err?.name==='NotAllowedError'?'Tap Enable music to allow playback.':'Music could not start. Try another song, then Enable music.');});}catch(e){this.pending=false;this.status('Tap Enable music to try playback again.');}
 }
 tone(freq,duration=.6,target='fx',delay=0){if(!this.ctx)return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),gain=this.ctx.createGain();o.type='triangle';o.frequency.value=freq;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.24,t+.025);gain.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(gain);gain.connect(this[target]||this.fx);o.start(t);o.stop(t+duration+.05);}
 chime(){[523.25,659.25,783.99].forEach((n,i)=>this.tone(n,.7,'fx',i*.11));}
 tick(time,chapter,dt=1/60){if(document.hidden||!this.player||this.activeId==='off'||!this.settings)return;this.fade=Math.min(1,this.fade+dt/.8);this.player.volume=Math.max(0,Math.min(1,this.settings.music*this.fade));}
 background(){
  // Native media looping continues even when browsers stop rendering frames.
  // Finish the short fade now so hiding immediately cannot strand music at zero.
  if(this.player&&this.unlocked&&this.activeId!=='off'&&this.settings&&!this.settings.muted&&this.settings.music>0){this.fade=1;this.player.volume=this.settings.music;this.tryPlay();}
  if(this.ctx)this.ctx.suspend().catch(()=>{});
 }
 suspend(){if(this.player)this.player.pause();this.generation++;this.pending=false;if(this.ctx)this.ctx.suspend().catch(()=>{});}
};
