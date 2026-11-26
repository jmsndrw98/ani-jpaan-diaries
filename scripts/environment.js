'use strict';
Diary.Environment = class {
 static phases=[{name:'Midnight',hour:0},{name:'Morning',hour:6},{name:'Day',hour:10},{name:'Afternoon',hour:14},{name:'Evening',hour:18},{name:'Night',hour:21}];
 static weather=['clear','cloudy','breeze','rain','mist'];
 static profiles=[['clear','breeze','cloudy','rain'],['mist','clear','breeze','rain'],['rain','mist','cloudy','clear'],['clear','cloudy','rain','breeze']];
 static formatTime(hour,minute=0){return `${hour%12||12}:${String(minute).padStart(2,'0')} ${hour>=12?'PM':'AM'}`;}
 static clockAt(epoch=Date.now()){
  this.formatters??=Object.fromEntries([['ph','Asia/Manila'],['japan','Asia/Tokyo']].map(([key,timeZone])=>[key,new Intl.DateTimeFormat('en-GB',{timeZone,hourCycle:'h23',hour:'2-digit',minute:'2-digit',second:'2-digit',day:'2-digit',month:'short',year:'numeric'})]));
  return Object.fromEntries(Object.entries(this.formatters).map(([key,formatter])=>{const p=Object.fromEntries(formatter.formatToParts(epoch).map(p=>[p.type,p.value]));return[key,{hour:Number(p.hour)+Number(p.minute)/60+Number(p.second)/3600,time:this.formatTime(Number(p.hour),Number(p.minute)),date:p.day+' '+p.month+' '+p.year}];}));
 }
 constructor(game){this.g=game;this.saveElapsed=0;this.visual=null;this.lastLabel='';this.update(0,false);}
 get state(){return this.g.state.environment;}
 get phase(){const h=this.state.hour;return Diary.Environment.phases.filter(p=>p.hour<=h).at(-1);}
 get weather(){return this.state.weather==='auto'?Diary.Environment.profiles[this.g.state.chapter][Math.floor(this.state.weatherTime/90)%4]:this.state.weather;}
 label(){return `${this.state.clockMode==='philippines'?'':'Preview · '}${this.phase.name} · ${this.weather[0].toUpperCase()+this.weather.slice(1)}`;}
 setHour(hour){if(!Number.isFinite(hour)||hour<0||hour>=24)return;this.state.clockMode='manual';this.state.hour=hour;this.state.running=false;this.g.persist();this.update(0,false);}
 syncRealTime(){this.state.clockMode='philippines';this.state.running=true;this.update(0,false);this.g.persist();}
 setWeather(weather){if(!['auto',...Diary.Environment.weather].includes(weather))return;this.state.weather=weather;this.g.persist();this.update(0,false);}
 toggle(){if(this.state.clockMode==='philippines'){this.state.clockMode='manual';this.state.running=true;}else this.state.running=!this.state.running;this.g.persist();}
 target(){const h=this.state.hour;
  // Interpolate lighting around the clock, including midnight wrap, without re-baking terrain.
  const keys=[{h:0,d:.43,w:0,sky:[46,62,86]},{h:5,d:.3,w:.05,sky:[104,117,140]},{h:7,d:.03,w:.09,sky:[223,199,170]},{h:10,d:0,w:0,sky:[205,226,217]},{h:14,d:0,w:.02,sky:[217,228,211]},{h:17,d:.07,w:.13,sky:[225,192,158]},{h:19,d:.25,w:.1,sky:[146,132,153]},{h:21,d:.4,w:0,sky:[68,81,110]},{h:24,d:.43,w:0,sky:[46,62,86]}];
  const b=keys.find(k=>k.h>h)||keys.at(-1),a=keys[keys.indexOf(b)-1],raw=(h-a.h)/(b.h-a.h),t=raw*raw*(3-2*raw),mix=(x,y)=>x+(y-x)*t;
  return{dark:mix(a.d,b.d),warm:mix(a.w,b.w),sky:a.sky.map((x,i)=>mix(x,b.sky[i])),rain:this.weather==='rain'?1:0,mist:this.weather==='mist'?1:0,cloud:this.weather==='cloudy'||this.weather==='rain'?1:0,breeze:this.weather==='breeze'?1:0};
 }
 update(dt,advance=true){const s=this.state,second=Math.floor(Date.now()/1000);if(second!==this.clockSecond||!this.clocks){this.clockSecond=second;this.clocks=Diary.Environment.clockAt(second*1000);}
  const clocks=this.clocks,nextDay=clocks.ph.date!==clocks.japan.date?' (+1 day)':'';
  for(const [id,text] of [['clock-ph',clocks.ph.time],['clock-japan',clocks.japan.time+nextDay],['climate-dialog-ph',clocks.ph.time+' · '+clocks.ph.date],['climate-dialog-japan',clocks.japan.time+' · '+clocks.japan.date]]){const el=document.getElementById(id);if(el&&el.textContent!==text)el.textContent=text;}
  if(s.clockMode==='philippines')s.hour=clocks.ph.hour;
  if(advance&&s.running){if(s.clockMode==='manual')s.hour=(s.hour+dt/30)%24;s.weatherTime=(s.weatherTime+dt)%360;this.saveElapsed+=dt;if(this.saveElapsed>=20){this.saveElapsed=0;this.g.persist();}}
  const target=this.target();if(!this.visual)this.visual=target;else{const blend=1-Math.exp(-dt/2);for(const k of ['dark','warm','rain','mist','cloud','breeze'])this.visual[k]+=(target[k]-this.visual[k])*blend;this.visual.sky=this.visual.sky.map((v,i)=>v+(target.sky[i]-v)*blend);}
  const label=this.label();if(label!==this.lastLabel){document.getElementById('climate-label').textContent=label;this.lastLabel=label;}
 }
 skyColor(){return `rgb(${this.visual.sky.map(Math.round).join(',')})`;}
 drawSky(renderer,time){const c=renderer.ctx,w=renderer.w,h=renderer.h,v=this.visual,t=this.g.state.settings.motion?time:0;c.save();
  if(v.dark>.2){c.fillStyle='#f8e9b9';c.globalAlpha=Math.min(1,(v.dark-.2)*4);for(let i=0;i<24;i++){const x=Diary.hash(i,81)*w,y=Diary.hash(i,83)*h*.45;c.fillRect(x,y,2,2);}renderer.oval(w*.82,h*.15,15,15,'#f3e8cc');}else{c.globalAlpha=.6;renderer.oval(w*.82,h*.15,22,22,'#f8e2af');}
  c.globalAlpha=.12+v.cloud*.4;for(let i=0;i<4;i++){const x=((i*w/3-t*(4+v.breeze*7)+w+150)%(w+300))-150,y=h*(.09+i%2*.1);renderer.oval(x,y,56,10,'#edf0e4');renderer.oval(x+30,y-9,32,16,'#edf0e4');renderer.oval(x-22,y-5,28,13,'#edf0e4');}c.restore();
 }
 draw(renderer,time,particles=true,train=false){const c=renderer.ctx,w=renderer.w,h=renderer.h,v=this.visual,g=this.g,motion=g.state.settings.motion;
  c.save();c.fillStyle=`rgba(21,33,65,${v.dark})`;c.fillRect(0,0,w,h);c.fillStyle=`rgba(242,160,95,${v.warm})`;c.fillRect(0,0,w,h);c.fillStyle=`rgba(79,101,117,${v.cloud*.12})`;c.fillRect(0,0,w,h);
  if(v.mist>.01){const fog=c.createLinearGradient(0,0,0,h);fog.addColorStop(0,`rgba(222,233,222,${v.mist*.1})`);fog.addColorStop(.65,`rgba(222,233,222,${v.mist*.24})`);fog.addColorStop(1,'rgba(222,233,222,0)');c.fillStyle=fog;c.fillRect(0,0,w,h);}
  if(!train&&v.dark>.05){for(const p of g.world.props)if(p.type==='lantern'||p.type==='building'){const q=renderer.screen(p.x,p.y,p.type==='lantern'?20:22);if(q.x< -50||q.x>w+50||q.y< -50||q.y>h+50)continue;const glow=c.createRadialGradient(q.x,q.y,2,q.x,q.y,45);glow.addColorStop(0,`rgba(255,207,121,${v.dark*.58})`);glow.addColorStop(1,'rgba(255,207,121,0)');c.fillStyle=glow;c.fillRect(q.x-45,q.y-45,90,90);}}
  if(particles&&motion){const n=g.state.settings.quality==='low'?16:38;
   if(v.rain>.01){c.strokeStyle=`rgba(225,238,244,${v.rain*.5})`;c.lineWidth=1;for(let i=0;i<n;i++){const x=(Diary.hash(i,8)*w+time*31)%(w+20),y=(Diary.hash(i,10)*h+time*240)%(h+20);c.beginPath();c.moveTo(x,y);c.lineTo(x-4,y+13);c.stroke();}}
   if(v.breeze>.01){c.fillStyle=g.state.chapter===0?'#f8c9d6':'#c1d09b';c.globalAlpha=v.breeze*.65;for(let i=0;i<n/2;i++){const x=(Diary.hash(i,5)*w+time*26)%(w+20),y=(Diary.hash(i,4)*h+time*8+Math.sin(time+i)*12)%(h+20);c.fillRect(x,y,3,2);}}
  }c.restore();
 }
};
