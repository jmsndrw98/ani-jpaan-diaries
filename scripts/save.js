'use strict';
Diary.Save = (()=>{
 const KEY='ani-japan-diaries-v1';
 const fresh=()=>({version:1,started:false,chapter:0,xp:0,completed:[],discoveries:{},inventory:[],photos:[],entries:[],friends:{happy:0,toti:0},ending:false,environment:{clockMode:"philippines",hour:7,weatherTime:0,weather:"auto",running:true},quests:{},decoration:[],settings:{bgmVersion:1,songs:[...Diary.MUSIC_DEFAULTS],music:.4,ambience:.3,effects:.4,muted:false,motion:!matchMedia('(prefers-reduced-motion: reduce)').matches,joystick:matchMedia('(pointer:coarse)').matches,quality:'auto',zoom:1}});
 let available=true;
 function validate(raw){
  if(!raw||raw.version!==1||!Number.isInteger(raw.chapter)||raw.chapter<0||raw.chapter>3||!Number.isFinite(raw.xp)||raw.xp<0||raw.xp>100000)throw Error('This is not a compatible travel diary.');
  const s=fresh();s.started=!!raw.started;s.chapter=raw.chapter;s.xp=raw.xp;s.ending=!!raw.ending;
  for(const k of ['completed','inventory','photos','entries'])if(!Array.isArray(raw[k]))throw Error('The diary is missing '+k+'.');
  s.completed=[...new Set(raw.completed.filter(x=>Number.isInteger(x)&&x>=0&&x<4))];
  s.inventory=raw.inventory.slice(0,30).filter(x=>x&&typeof x.name==='string'&&Number.isInteger(x.chapter)&&x.chapter>=0&&x.chapter<4).map(x=>({name:x.name.slice(0,120),chapter:x.chapter}));
  s.photos=raw.photos.slice(-24).filter(x=>x&&typeof x.data==='string'&&/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(x.data)&&x.data.length<600000&&typeof x.place==='string').map(x=>({data:x.data,place:x.place.slice(0,100),caption:String(x.caption||'A little memory').slice(0,150)}));
  s.entries=raw.entries.slice(0,200).filter(x=>x&&typeof x.title==='string'&&typeof x.text==='string').map(x=>({title:x.title.slice(0,150),text:x.text.slice(0,1500),place:String(x.place||'Japan').slice(0,100)}));
  s.discoveries={};if(raw.discoveries&&typeof raw.discoveries==='object')for(const [k,v] of Object.entries(raw.discoveries)){if(/^(kyoto|nara|hakone|tokyo)\.(landmark|activity|souvenir|photo|rest|secret|pet-happy|pet-toti|feed-happy|feed-toti|play-happy|play-toti|paw-happy|paw-toti)$/.test(k)&&v===true)s.discoveries[k]=true;}
  for(const k of ['happy','toti'])s.friends[k]=Math.max(0,Math.min(100,Number(raw.friends?.[k])||0));
  if(raw.settings){for(const k of ['music','ambience','effects'])s.settings[k]=Math.max(0,Math.min(1,Number(raw.settings[k])||0));for(const k of ['muted','motion','joystick'])if(typeof raw.settings[k]==='boolean')s.settings[k]=raw.settings[k];if(['auto','low','high'].includes(raw.settings.quality))s.settings.quality=raw.settings.quality;s.settings.zoom=Math.max(.65,Math.min(1.6,Number(raw.settings.zoom)||1));}
  if(raw.settings?.bgmVersion!==1)s.settings.music=.4;
  if(Array.isArray(raw.settings?.songs))s.settings.songs=Diary.MUSIC_DEFAULTS.map((fallback,i)=>{const id=raw.settings.songs[i];return id==='off'||Diary.MUSIC_TRACKS.some(t=>t.id===id)?id:fallback;});
  s.decoration=Array.isArray(raw.decoration)?raw.decoration.slice(0,3).map(v=>String(v).slice(0,30)):[];
  for(const id of ['kyoto','nara','hakone','tokyo']){const q=raw.quests?.[id];if(q&&Array.isArray(q.collected)){const collected=[...new Set(q.collected.filter(n=>Number.isInteger(n)&&n>=0&&n<3))];s.quests[id]={collected,claimed:q.claimed===true&&collected.length===3};}}
  if(raw.environment){const e=raw.environment;if(e.clockMode==='manual')s.environment.clockMode='manual';if(Number.isFinite(e.hour)&&e.hour>=0&&e.hour<24)s.environment.hour=e.hour;if(Number.isFinite(e.weatherTime)&&e.weatherTime>=0)s.environment.weatherTime=e.weatherTime%360;if(['auto','clear','cloudy','breeze','rain','mist'].includes(e.weather))s.environment.weather=e.weather;if(typeof e.running==='boolean')s.environment.running=e.running;}
  return s;
 }
 function load(){try{const x=localStorage.getItem(KEY);return x?validate(JSON.parse(x)):fresh()}catch(e){available=false;return fresh()}}
 function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));available=true;return true}catch(e){available=false;return false}}
 function download(s){const blob=new Blob([JSON.stringify(s,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Anis-Travel-Diary.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return {fresh,load,save,validate,download,get available(){return available}};
})();
