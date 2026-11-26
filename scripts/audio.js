'use strict';
Diary.Audio = class {
 constructor(){this.ctx=null;this.next=0;this.note=0;this.settings=null;}
 start(settings){this.settings=settings;try{if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.music=this.ctx.createGain();this.music.connect(this.master);this.fx=this.ctx.createGain();this.fx.connect(this.master);this.amb=this.ctx.createGain();this.amb.connect(this.master);const b=this.ctx.createBuffer(1,this.ctx.sampleRate*3,this.ctx.sampleRate);const d=b.getChannelData(0);let prev=0;for(let i=0;i<d.length;i++){prev=(prev+(Math.random()*2-1)*.025)/1.025;d[i]=prev*.6}const s=this.ctx.createBufferSource();s.buffer=b;s.loop=true;const f=this.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=650;s.connect(f);f.connect(this.amb);s.start();}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});this.update(settings)}catch(e){this.ctx=null}}
 update(s){this.settings=s;if(!this.ctx)return;this.master.gain.value=s.muted?0:.45;this.music.gain.value=s.music;this.fx.gain.value=s.effects;this.amb.gain.value=s.ambience;}
 tone(freq,duration=.6,target='fx',delay=0){if(!this.ctx)return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=target==='music'?'sine':'triangle';o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.24,t+.025);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(this[target]);o.start(t);o.stop(t+duration+.05);}
 chime(){[523.25,659.25,783.99].forEach((n,i)=>this.tone(n,.7,'fx',i*.11));}
 tick(time,chapter){if(!this.ctx||document.hidden)return;if(time>this.next){const notes=[261.63,329.63,392,440,392,329.63,293.66,261.63,0,392,329.63,0];const n=notes[this.note++%notes.length];if(n)this.tone(n*(chapter===3?.75:1),2.8,'music');this.next=time+1.1;}}
 suspend(){if(this.ctx)this.ctx.suspend().catch(()=>{});}
};
