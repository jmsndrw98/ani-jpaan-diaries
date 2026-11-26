const assert=require('assert');require('./clocks.cjs');
const g=game;let checks=0;const ok=(v,msg)=>{assert(v,msg);checks++;};
class MediaMock{
 constructor(){this.paused=true;this.volume=1;this.muted=false;this.currentTime=0;this.loads=0;this.plays=0;this.events={};}
 addEventListener(name,fn){this.events[name]=fn;}
 load(){this.loads++;this.currentTime=0;}
 pause(){this.paused=true;}
 play(){this.plays++;if(this.rejectNext){this.rejectNext=false;return Promise.reject({name:'NotAllowedError'});}this.paused=false;return Promise.resolve();}
}
const originalAudio=global.Audio,originalQuery=document.querySelectorAll;
global.Audio=MediaMock;
(async()=>{
 g.ui.close();g.state=Diary.Save.fresh();g.mode='play';g.scene=null;g.loading.finish();g.audio=new Diary.Audio(g);const a=g.audio,s=g.state.settings;
 a.arrive(0);ok(!a.player,'No unsolicited audio before a gesture');a.start(s);await Promise.resolve();
 ok(a.activeId==='kawaranai'&&a.player.loop,'Kyoto song starts with native looping');a.tick(1,0,1);ok(a.player.volume===.4,'BGM settles at requested 40 percent');
 a.player.currentTime=42;const loads=a.player.loads;a.start(s);await Promise.resolve();ok(a.player.loads===loads&&a.player.currentTime===42,'Repeated clicks do not restart a song');
 for(let chapter=1;chapter<4;chapter++){g.state.chapter=chapter;a.arrive(chapter);await Promise.resolve();ok(a.activeId===Diary.MUSIC_DEFAULTS[chapter]&&!a.player.paused,'Arrival starts assigned song in chapter '+chapter);}
 ok(a.player.currentTime===0,'Changing tracks starts the new song from its beginning');
 s.songs[2]='secret-base';const oldLoads=a.player.loads;a.update(s);ok(a.player.loads===oldLoads,'Editing a different place leaves current song running');
 s.songs[3]='sparkle';a.update(s);await Promise.resolve();ok(a.activeId==='sparkle','Changing the current place switches immediately');
 a.tick(2,3,1);s.muted=true;a.update(s);ok(a.player.muted&&a.player.paused,'Mute stops audible BGM');s.muted=false;a.update(s);await Promise.resolve();ok(!a.player.muted&&!a.player.paused,'Unmute resumes the song');
 s.music=0;a.update(s);ok(a.player.paused&&a.player.volume===0,'Zero volume pauses playback');s.music=.4;a.update(s);await Promise.resolve();
 a.player.currentTime=22;document.hidden=true;a.background();ok(!a.player.paused,'Hiding the page keeps music playing');document.hidden=false;a.start(s);await Promise.resolve();ok(!a.player.paused&&a.player.currentTime===22,'Returning does not restart background music');
 s.songs[3]='off';a.update(s);ok(a.player.paused&&a.activeId==='off','Per-place Off option stops music');
 s.songs[3]='grand-escape';a.player.rejectNext=true;a.update(s);await Promise.resolve();await Promise.resolve();ok(a.message.includes('Enable music'),'Blocked autoplay gives an actionable retry message');const attempts=a.player.plays;for(let i=0;i<100;i++)a.tick(i,3,.016);ok(a.player.plays===attempts,'Blocked playback is not retried every frame');a.start(s);await Promise.resolve();ok(!a.player.paused&&a.message.includes('Grand Escape'),'Enable gesture retries successfully');
 const saved=Diary.Save.validate(JSON.parse(JSON.stringify(g.state)));ok(saved.settings.music===.4&&saved.settings.songs[2]==='secret-base','BGM volume and assignments round-trip through save');delete saved.settings.bgmVersion;saved.settings.music=.22;ok(Diary.Save.validate(saved).settings.music===.4,'Old diaries migrate once to 40 percent');saved.settings.bgmVersion=1;saved.settings.music=.15;saved.settings.songs=['bad','off','sparkle',null];const safe=Diary.Save.validate(saved);ok(safe.settings.music===.15&&safe.settings.songs.join(',')==='kawaranai,off,sparkle,grand-escape','New volume preferences persist and invalid songs are sanitized');
 const selects=Diary.CHAPTERS.map((ch,i)=>({dataset:{songPlace:String(i)},value:''}));document.querySelectorAll=q=>q==='[data-song-place]'?selects:[];g.ui.settings();selects[3].value='kawaranai';selects[3].onchange();await Promise.resolve();ok(a.activeId==='kawaranai'&&s.songs[3]==='kawaranai','Settings dropdown dispatches the current place choice');document.getElementById('default-music').onclick();await Promise.resolve();ok(s.music===.4&&s.songs.join(',')===Diary.MUSIC_DEFAULTS.join(','),'Reset restores all assignments and 40 percent');
 g.state.chapter=1;g.loading.start('Arriving');for(let i=0;i<240&&g.loading.active;i++)g.loading.update(1/60);await Promise.resolve();ok(a.activeId==='secret-base','Destination loading completion triggers its music');
 a.fade=0;a.player.volume=0;document.hidden=true;a.background();ok(!a.player.paused&&a.player.volume===s.music,'Immediate backgrounding finishes the fade without animation frames');s.muted=true;a.update(s);a.background();ok(a.player.paused&&a.player.muted,'Background playback respects mute');s.muted=false;s.songs[g.state.chapter]='off';a.update(s);a.background();ok(a.player.paused&&a.activeId==='off','Background playback respects the place Off setting');document.hidden=false;
 console.log(JSON.stringify({music_assertions:checks,previous_assertions:633,total:633+checks,scope:'Mocked HTML audio behavior and real settings/save wiring; audible playback and codec support require a browser.'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{global.Audio=originalAudio;document.querySelectorAll=originalQuery;});
