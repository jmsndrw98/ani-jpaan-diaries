const assert=require('assert');require('./environment.cjs');
const g=game;let checks=0;const ok=(v,msg)=>{assert(v,msg);checks++;};
const originalNow=Date.now;let epoch=Date.UTC(2026,11,31,15,30,0);Date.now=()=>epoch;
try{
 g.state=Diary.Save.fresh();g.ui.close();g.scene=null;g.environment.update(0,false);
 ok(g.state.environment.clockMode==='philippines','Fresh diaries default to PH real time');
 ok(g.state.environment.hour===23.5,'World lighting follows Manila time, independent of host zone');
 let clocks=Diary.Environment.clockAt(epoch);ok(clocks.ph.time==='11:30 PM'&&clocks.japan.time==='12:30 AM','Japan stays one hour ahead across midnight');
 ok(clocks.ph.date==='31 Dec 2026'&&clocks.japan.date==='01 Jan 2027','Both dates roll correctly across New Year');
 ok(document.getElementById('clock-japan').textContent==='12:30 AM (+1 day)','HUD flags Japan’s next-day date');
 g.environment.update(600,true);ok(g.state.environment.hour===23.5,'Real-time lighting cannot be accelerated by frame delta');
 epoch+=2*3600000;g.environment.update(0,false);ok(g.state.environment.hour===1.5,'Return from a paused or hidden page catches up immediately');
 ok(g.environment.phase.name==='Midnight','PH midnight lighting selects the correct phase');
 g.environment.setHour(14);epoch+=3600000;g.environment.update(30,false);ok(g.state.environment.hour===14&&g.state.environment.clockMode==='manual','Manual preview remains separate from real clocks');
 ok(document.getElementById('clock-ph').textContent==='2:30 AM'&&document.getElementById('clock-japan').textContent==='3:30 AM','Both real clocks keep updating in preview');
 g.ui.climate();document.getElementById('sync-ph-time').onclick();ok(g.state.environment.clockMode==='philippines'&&g.state.environment.hour===2.5,'PH sync control restores real-time lighting');
 const saved=Diary.Save.validate(JSON.parse(JSON.stringify(g.state)));ok(saved.environment.clockMode==='philippines','Clock mode survives save validation');
 delete saved.environment.clockMode;ok(Diary.Save.validate(saved).environment.clockMode==='philippines','Previous diaries migrate to PH sync');
 g.environment.setHour(18);ok(Diary.Save.validate(g.state).environment.clockMode==='manual','Explicit manual previews persist');
 const leap=Diary.Environment.clockAt(Date.UTC(2028,1,29,16,0));ok(leap.ph.time==='12:00 AM'&&leap.ph.date==='01 Mar 2028'&&leap.japan.time==='1:00 AM','Leap-day rollover uses 12:00 AM rather than 12:00 PM');
 const noon=Diary.Environment.clockAt(Date.UTC(2026,10,27,4,0));ok(noon.ph.time==='12:00 PM'&&noon.japan.time==='1:00 PM'&&noon.ph.hour===12,'Noon displays PM while retaining 24-hour lighting calculations');
}finally{Date.now=originalNow;g.ui.close();}
console.log(JSON.stringify({clock_assertions:checks,previous_assertions:617,total:617+checks,scope:'IANA timezone conversion and mocked UI integration; not browser/device certification.'},null,2));
