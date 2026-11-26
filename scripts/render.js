'use strict';
Diary.Renderer = class {
 constructor(canvas,game){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.game=game;this.w=innerWidth;this.h=innerHeight;this.camera={x:0,y:360};this.scale=1;this.atlas=new Image();this.atlas.onload=()=>this.ready=true;this.atlas.onerror=()=>{this.assetError=true;game.toast('Character art could not load. Keep the assets folder beside index.html.')};this.atlas.src=Diary.CHARACTER_ATLAS||'assets/characters-clean.png';this.resize();}
 resize(){this.w=this.canvas.clientWidth||innerWidth;this.h=this.canvas.clientHeight||innerHeight;const s=this.game.state.settings;this.ratio=(s.quality==='low'?.7:Math.min(devicePixelRatio||1,s.quality==='high'?2:1.5));this.canvas.width=Math.round(this.w*this.ratio);this.canvas.height=Math.round(this.h*this.ratio);this.ctx.imageSmoothingEnabled=false;this.scale=(this.w<540?.94:this.w<850?1.03:1.15)*s.zoom;}
 project(x,y,z=0){return{x:(x-y)*29,y:(x+y)*14.5-z};}
 screen(x,y,z=0){const p=this.project(x,y,z);return{x:Math.round((p.x-this.camera.x)*this.scale+this.w/2),y:Math.round((p.y-this.camera.y)*this.scale+this.h*.52)};}
 unproject(sx,sy){const x=(sx-this.w/2)/this.scale+this.camera.x,y=(sy-this.h*.52)/this.scale+this.camera.y;return{x:(x/29+y/14.5)/2,y:(y/14.5-x/29)/2};}
 poly(points,color,stroke){const c=this.ctx;c.fillStyle=color;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.6;c.stroke();}}
 rect(x,y,w,h,color){this.ctx.fillStyle=color;this.ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
 diamond(x,y,w,h,color){this.poly([[x,y-h],[x+w,y],[x,y+h],[x-w,y]],color);}
 cube(x,y,w,d,h,top,left,right){this.poly([[x-w,y-d],[x,y-2*d],[x+w,y-d],[x,y]],top);this.poly([[x-w,y-d],[x,y],[x,y+h],[x-w,y-d+h]],left);this.poly([[x,y],[x+w,y-d],[x+w,y-d+h],[x,y+h]],right||left);}
 voxel(x,y,w,h,col,side){this.rect(x,y,w,h,col);this.rect(x+w-3,y+3,3,h-3,side||col);this.rect(x+2,y,w-4,2,'#ffffff18');}
 tree(p,time){const s=this.game.chapter,seed=p.variant||1;const c=this.ctx;const {x,y}=this.project(p.x,p.y);const sway=this.game.state.settings.motion?Math.round(Math.sin(time*.7+seed)*1.5):0;this.diamond(x,y+2,34,12,'#516c4230');
  for(let j=0;j<8;j++)this.voxel(x-6+(j%2),y-10-j*7,12,9,j%2?'#836047':'#926e50','#684f3c');
  this.poly([[x-3,y-45],[x-25,y-65],[x-21,y-70],[x+3,y-51]],'#86664b');
  if(s.tree==='sakura'){
   const palette=['#cc8c9c','#e6acb8','#efbdc5','#f5cbd0','#f8d6d5'];
   for(let j=0;j<25;j++){const r=Diary.hash(j,seed,7),xx=x+(r-.5)*75+sway,yy=y-60+(Diary.hash(j,seed,8)-.5)*39;const sz=13+Math.floor(Diary.hash(j,seed,9)*13);this.voxel(xx-sz/2,yy-sz/2,sz,sz*.7,palette[j%5],'#c98e9c');}
   for(let j=0;j<9;j++)this.rect(x-31+Diary.hash(j,seed,12)*60+sway,y-80+Diary.hash(j,seed,13)*37,4,3,'#ffe7df');
  }else{
   const cols=s.tree==='pine'?['#416b5b','#527c65','#648773']:['#567b4e','#6c9158','#7f9d60'];
   for(let j=0;j<4;j++){const yy=y-37-j*14,w=35-j*6;this.poly([[x-w+sway,yy],[x-8+sway,yy-24],[x+sway,yy-32],[x+13+sway,yy-20],[x+w+sway,yy],[x+10+sway,yy+8],[x-w+sway,yy+4]],cols[j%3]);for(let z=0;z<6;z++)this.rect(x-w+Diary.hash(z,j,seed)*w*2+sway,yy-6,6,3,'#b1be772b');}
  }
 }
 building(p,time){const {x,y}=this.project(p.x+p.w/2,p.y+p.h/2);const w=p.w*23,d=p.h*12;const kind=p.kind,c=this.ctx;
  this.diamond(x,y+8,w+10,d+10,'#415c3824');
  if(kind==='picnic'){this.diamond(x,y,w,d,'#bb7d6b');for(let i=-2;i<=2;i++)this.poly([[x+i*15-25,y-14],[x+i*15,y-27],[x+i*15+35,y-9],[x+i*15+10,y+4]],'#e8c8a0');this.cube(x-14,y-2,13,7,8,'#ddd0a9','#ad8a65','#8b7155');this.cup(x+20,y-1,time);return;}
  if(kind==='view'){this.cube(x,y-5,w,d,10,'#b7bcb0','#8d9c8c','#758a7c');for(let i=-2;i<=2;i++){this.rect(x+i*25,y-38,4,28,'#b6aa88');this.rect(x+i*25,y-38,25,4,'#d5c8a5');}this.voxel(x-10,y-48,20,27,'#b18e65','#8e7356');this.rect(x-7,y-44,14,3,'#e6d5ad');return;}
  const shrine=kind==='shrine',station=kind==='station',festival=kind==='festival';const h=station?38:festival?32:57;
  this.cube(x,y-h,w,d,h,'#d3b887','#bda47a','#987954');
  // Timber framing and shoji windows follow both visible faces.
  for(let i=0;i<4;i++){const xx=x-w+i*w/4,yy=y-h-d+i*d/4;this.rect(xx,yy,5,h,'#725641');this.poly([[xx+7,yy+10],[xx+w/4-3,yy+10+d/4],[xx+w/4-3,yy+35+d/4],[xx+7,yy+35]],'#e4d4b0');for(let k=1;k<3;k++)this.rect(xx+7,yy+12+k*7,w/4-10,2,'#8e795d');}
  for(let i=0;i<4;i++){const xx=x+i*w/4,yy=y-h-i*d/4;this.rect(xx,yy,5,h,'#6e533e');if(i<3)this.poly([[xx+7,yy+12],[xx+w/4-3,yy+12-d/4],[xx+w/4-3,yy+36-d/4],[xx+7,yy+36]],this.game.world.chapter===3?'#efc584':'#d9c49a');}
  this.cube(x,y-4,w+3,d+2,7,'#a28d6b','#8b7353','#6e5b43');
  const roof=shrine?['#638379','#405e58','#304b48']:festival?['#b65b56','#934a45','#78483c']:['#667c72','#4b625b','#3e524c'];
  this.poly([[x-w-13,y-h-d+4],[x-12,y-h-d*2-28],[x+w+13,y-h-d+2],[x+8,y-h+9]],roof[0]);this.poly([[x-12,y-h-d*2-28],[x+w+13,y-h-d+2],[x+w+13,y-h-d+12],[x-12,y-h-d*2-18]],roof[1]);this.poly([[x-w-13,y-h-d+4],[x+8,y-h+9],[x+8,y-h+18],[x-w-13,y-h-d+13]],roof[2]);
  for(let j=1;j<8;j++){const q=j/8;this.poly([[x-w-13+q*(w+1),y-h-d+4-q*(d+32)],[x+8+q*(w+5),y-h+9-q*(d+7)],[x+8+q*(w+5),y-h+11-q*(d+7)],[x-w-13+q*(w+1),y-h-d+6-q*(d+32)]],'#bdc8a538');}
  if(shrine){this.rect(x-4,y-h-d*2-33,9,8,'#d1c39c');this.rect(x-23,y-32,45,5,'#a75240');this.rect(x-2,y-50,3,22,'#d2b883');}
  if(!station){this.lantern(x-w+12,y-h+12,time,true);this.lantern(x+w-10,y-h+12-d,time,true);}
  if(kind==='tea'||kind==='ryokan'||kind==='shop'){this.poly([[x-5,y-h+20],[x+w-6,y-h-d+20],[x+w-6,y-h-d+38],[x-5,y-h+38]],kind==='shop'?'#b37d72':'#718763');for(let i=0;i<3;i++)this.rect(x+10+i*18,y-h+23-i*5,2,15,'#ddd3aa');}
  if(festival){this.rect(x-30,y-25,60,8,'#e1c69a');for(let i=0;i<5;i++){this.rect(x-25+i*12,y-31,7,6,i%2?'#d8ae70':'#d78768');this.rect(x-23+i*12,y-35,2,7,'#98744d');}this.rect(x-16,y-h-5,31,18,'#eed7ad');c.fillStyle='#8a5747';c.font='7px Verdana';c.textAlign='center';c.fillText('DANGO',x,y-h+6);}
  if(station){this.rect(x-26,y-32,53,14,'#e5d9b8');c.fillStyle='#58694e';c.font='8px Verdana';c.textAlign='center';c.fillText('STATION',x,y-22);for(let i=-2;i<3;i++){this.rect(x+i*18,y+15,7,12,'#8a7761');}this.rect(x-65,y+22,130,3,'#67776b');}
 }
 cup(x,y,time){this.rect(x-7,y-7,15,8,'#edf0cf');this.rect(x-5,y,11,3,'#c3c8aa');this.rect(x-6,y-9,12,3,'#7e985c');if(this.game.state.settings.motion){for(let i=0;i<3;i++){this.ctx.globalAlpha=.2;this.rect(x+Math.sin(time*2+i)*3,y-15-((time*8+i*8)%24),3,7,'#ffffff');}this.ctx.globalAlpha=1;}}
 lantern(x,y,time,hanging=false){if(!hanging){this.rect(x-2,y-34,4,36,'#827159');this.rect(x-9,y-36,18,4,'#6d7059');}const yy=y-(hanging?0:32);if(this.game.world.chapter===3){this.ctx.globalAlpha=.09;this.diamond(x,yy+9,25,25,'#ffe3a0');this.ctx.globalAlpha=1;}this.voxel(x-7,yy,14,16,'#e8b67d','#bf8d62');this.rect(x-5,yy+2,10,12,'#f5d8a0');this.rect(x-1,yy+3,2,10,'#c98d64');this.rect(x-6,yy+16,12,3,'#8f704e');}
 prop(p,time){const {x,y}=this.project(p.x,p.y);switch(p.type){
  case'tree':return this.tree(p,time);
  case'building':return this.building(p,time);
  case'lantern':return this.lantern(x,y,time);
  case'bamboo':{const sway=this.game.state.settings.motion?Math.sin(time*.8+p.x)*2:0;for(let i=0;i<4;i++){const xx=x+i*6-10+sway,hh=40+i%2*13;this.rect(xx,y-hh,4,hh,'#6f8e56');for(let j=0;j<4;j++){this.rect(xx,y-j*12,4,2,'#bec38b');this.poly([[xx,y-j*12],[xx-10,y-j*12-10],[xx-3,y-j*12-9]],'#7f9b5f');this.poly([[xx+3,y-j*12-5],[xx+15,y-j*12-14],[xx+11,y-j*12-6]],'#90aa6e');}}break;}
  case'torii':this.rect(x-43,y-68,8,65,'#a4513c');this.rect(x+34,y-68,8,65,'#af5942');this.rect(x-48,y-65,97,8,'#c66c4b');this.rect(x-55,y-80,110,9,'#b36148');this.rect(x-60,y-84,120,5,'#4d5d4b');this.rect(x-2,y-73,5,17,'#c99264');break;
  case'bench':this.cube(x,y-12,29,10,9,'#c59c6f','#93724e','#7b6145');this.rect(x-22,y-8,5,13,'#816848');this.rect(x+19,y-8,5,13,'#816848');this.cup(x+9,y-19,time);break;
  case'flowers':for(let i=0;i<5;i++){const xx=x+(Diary.hash(i,p.x,p.y)-.5)*23,yy=y+(Diary.hash(i,p.y,p.x)-.5)*12;this.rect(xx,yy-4,2,6,'#6e8e51');this.rect(xx-2,yy-5,5,3,['#f0d7c4','#dfacb2','#d2d89b'][i%3]);}break;
  case'rock':case'stone':this.cube(x,y-9,13,7,11,'#bdc1aa','#939d89','#7f907e');this.cube(x-2,y-15,7,4,7,'#cbd0b7','#a4af98','#889d88');if(p.type==='stone')this.rect(x-1,y-19,4,3,'#d8b87a');break;
  case'fence':this.rect(x-23,y-15,3,17,'#b0a07c');this.rect(x+22,y-15,3,17,'#b0a07c');this.rect(x-23,y-12,48,3,'#c6b38a');this.rect(x-23,y-5,48,3,'#b7a17a');break;
  case'deer':this.diamond(x,y,15,6,'#56744c22');this.voxel(x-14,y-22,26,15,'#b79568','#94754f');this.voxel(x+5,y-36,13,17,'#c7a573','#96794e');this.rect(x+15,y-31,3,3,'#414838');this.rect(x+4,y-43,4,8,'#b59468');this.rect(x+13,y-42,4,7,'#b59468');for(const dx of [-11,7])this.rect(x+dx,y-8,4,10,'#8e7656');for(let i=0;i<4;i++)this.rect(x-10+i*5,y-18+i%2*4,2,2,'#f1dcb1');break;
  case'bridge':this.cube(x+15,y+2,76,24,5,'#b99d74','#8e7859','#8b7354');for(let i=-2;i<3;i++)this.rect(x+i*25,y-18,4,21,'#8c795b');this.rect(x-56,y-18,115,4,'#c0a37a');break;
 }}
 character(actor,index,time,forceRest=false){if(!this.ready)return;const {x,y}=this.project(actor.x,actor.y);const moving=actor.moving;let row=forceRest||actor.rest?3:actor.back?1:0;if(moving&&Math.sin(time*10)>0&&!actor.back)row=2;const cw=this.atlas.width/3,ch=this.atlas.height/4;const size=index===0?95:index===1?86:72;const bob=moving&&this.game.state.settings.motion?Math.abs(Math.sin(time*10))*2:0;const c=this.ctx;this.diamond(x,y+1,index===0?18:20,7,'#364e3733');c.save();c.translate(Math.round(x),Math.round(y-bob));if(actor.flip)c.scale(-1,1);c.drawImage(this.atlas,index*cw,row*ch,cw,ch,-size/2,-size*.96,size,size);c.restore();
  if(actor.heart>time){c.fillStyle='#bd7185';c.font='16px Georgia';c.textAlign='center';c.fillText('♥',x,y-size-9-(time%1)*8);}
 }
 label(x,y,text,done=false){const c=this.ctx;const p=this.project(x,y,12);c.font='10px Verdana';c.textAlign='center';const width=c.measureText(text).width+18;c.fillStyle=done?'#f8f6e7dd':'#fff7e8f0';c.fillRect(p.x-width/2,p.y-21,width,19);c.strokeStyle='#7e927c40';c.strokeRect(p.x-width/2,p.y-21,width,19);c.fillStyle=done?'#78906a':'#53644a';c.fillText(text,p.x,p.y-8);}
 frame(time,dt){const c=this.ctx,g=this.game,s=g.chapter;this.ctx.setTransform(this.ratio,0,0,this.ratio,0,0);const grad=c.createLinearGradient(0,0,0,this.h);grad.addColorStop(0,s.sky[0]);grad.addColorStop(1,s.sky[1]);c.fillStyle=grad;c.fillRect(0,0,this.w,this.h);
  if(g.scene?.train){this.train(g.state.settings.motion?time:0);return;}
  const p=this.project(g.player.x,g.player.y);let tx=p.x,ty=p.y-30;if(g.mode==='title'){tx=-155;ty=335;}const lerp=g.state.settings.motion?Math.min(1,dt*4):1;this.camera.x+=(tx-this.camera.x)*lerp;this.camera.y+=(ty-this.camera.y)*lerp;
  // Low, layered silhouettes beyond the floating landscape.
  for(let i=0;i<7;i++){const xx=i*this.w/5-150;if(g.world.chapter===3){const hh=80+Diary.hash(i,8)*90;this.rect(xx,this.h*.4-hh,105,hh,'#465d7055');for(let a=0;a<5;a++)for(let b=0;b<7;b++)if(Diary.hash(a,b,i)>.4)this.rect(xx+10+a*18,this.h*.4-hh+10+b*20,5,7,'#e1c99a33');}else{this.poly([[xx,this.h*.45],[xx+170,this.h*.13+(i%3)*30],[xx+420,this.h*.45]],i%2?'#7e9d8d36':'#8aaa9330');}}
  c.save();c.translate(Math.round(this.w/2-this.camera.x*this.scale),Math.round(this.h*.52-this.camera.y*this.scale));c.scale(this.scale,this.scale);c.imageSmoothingEnabled=false;
  const world=g.world;
  for(let y=0;y<24;y++)for(let x=0;x<24;x++){
   const p=this.project(x,y);if((p.x-this.camera.x)*this.scale+this.w/2< -90||(p.x-this.camera.x)*this.scale+this.w/2>this.w+90)continue;
   if(world.water(x,y)){this.diamond(p.x,p.y,29.5,15,s.water);const v=Diary.hash(x,y,12);if(v>.45){const offset=g.state.settings.motion?Math.sin(time*.8+x+y)*3:0;this.rect(p.x-9+offset,p.y,18,1,'#d6e6cf55');this.rect(p.x-2-offset,p.y+5,9,1,'#d6e6cf33');}}
   else{const path=world.path(x,y);this.diamond(p.x,p.y,29.5,15,path?(Diary.hash(x,y)>.5?'#d9c9a5':'#dfcfad'):s.ground[Math.floor(Diary.hash(x,y,1)*3)]);if(path){this.poly([[p.x-24,p.y],[p.x,p.y-12],[p.x+23,p.y],[p.x,p.y+12]],'#e8dbbb33');if(Diary.hash(x,y,3)>.6)this.rect(p.x-9,p.y,12,1,'#a9a38144');}else{for(let k=0;k<3;k++){this.rect(p.x+(Diary.hash(x,y,k+5)-.5)*32,p.y+(Diary.hash(x,y,k+9)-.5)*12,3,2,'#6f94512a');}}}
   if(y===23)this.poly([[p.x-29,p.y],[p.x,p.y+14.5],[p.x,p.y+30],[p.x-29,p.y+15]],'#75845f');if(x===23)this.poly([[p.x,p.y+14.5],[p.x+29,p.y],[p.x+29,p.y+15],[p.x,p.y+30]],'#647851');
  }
  if(g.route.length){const dest=g.route[g.route.length-1],q=this.project(dest.x,dest.y);c.strokeStyle='#fff9d9';c.lineWidth=1.6;c.beginPath();c.ellipse(q.x,q.y,13,6,0,0,Math.PI*2);c.stroke();}
  const things=world.props.map(v=>({depth:v.type==='building'?v.x+v.y+(v.w+v.h)/2:v.x+v.y,prop:v}));[g.player,...g.companions].forEach((a,i)=>things.push({depth:a.x+a.y+.1,actor:a,index:i}));things.sort((a,b)=>a.depth-b.depth);
  if(world.chapter===3){const a=this.project(7,10,65),b=this.project(18,10,65);c.strokeStyle='#6e695b';c.lineWidth=1;c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2+24,b.x,b.y);c.stroke();for(let j=0;j<=8;j++){const f=j/8;this.lantern(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f+Math.sin(f*Math.PI)*12,time,true);}}
  for(const item of things){if(item.prop)this.prop(item.prop,time);else this.character(item.actor,item.index,time,g.scene?.rest);}
  if(g.mode==='play'&&!g.scene){for(const o of world.objects){if(o.id==='secret'&&!g.discovered('secret')&&Math.hypot(g.player.x-o.tx,g.player.y-o.ty)>4)continue;const distance=Math.hypot(g.player.x-o.tx,g.player.y-o.ty);if(distance<4.5||g.guide===o.id){const text=o.id==='station'?'Train station':o.id==='landmark'?s.landmark:o.id==='activity'?s.activityTitle:o.id==='souvenir'?'Keepsakes':o.id==='rest'?'Rest awhile':'Something little…';this.label(o.tx,o.ty,text,g.discovered(o.id));}}}
  if(g.state.decoration.length&&world.chapter===2){const p=this.project(16,9);this.cube(p.x,p.y-3,14,7,4,'#bc8d99','#9d7484','#93677a');this.lantern(p.x+28,p.y,time,true);}
  c.restore();
  this.weather(time);
  if(world.chapter===3){c.fillStyle='#31426313';c.fillRect(0,0,this.w,this.h);}
  if(g.scene?.rest){c.fillStyle='#d78e5630';c.fillRect(0,0,this.w,this.h);}
 }
 weather(time){if(!this.game.state.settings.motion)return;const c=this.ctx,s=this.game.world.chapter,rain=s===2&&!this.game.discovered('rest');const count=this.game.state.settings.quality==='low'?14:40;
  for(let i=0;i<count;i++){const x=(Diary.hash(i,8)*this.w+time*(rain?22:8)+Math.sin(time*.4+i)*18)%(this.w+20),y=(Diary.hash(i,10)*this.h+time*(rain?250:15))%(this.h+20);c.globalAlpha=rain?.25:.5;if(rain){c.strokeStyle='#e6f2ef';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x-3,y+12);c.stroke();}else if(s===0||s===3){this.rect(x,y,4,2,s===3?'#ffdf9c':'#f7d0d3');this.rect(x+1,y+2,2,2,'#fae2d7');}else if(s===1){this.rect(x,y,3,2,'#dbe1a3');}}c.globalAlpha=1;
 }
 train(time){const c=this.ctx,w=this.w,h=this.h;this.rect(0,0,w,h,'#bdcbbb');this.rect(0,0,w,h*.4,'#e6d6b4');this.rect(w*.75,h*.15,55,55,'#f8dfab');for(let i=0;i<5;i++){const x=((i*340-time*7)%(w+450))-100;this.poly([[x,h*.6],[x+180,h*.23+i%2*25],[x+430,h*.6]],i%2?'#8fa99a':'#9bb5a2');}this.rect(0,h*.54,w,h*.2,'#9fb383');for(let i=0;i<9;i++){const x=((i*220-time*80)%(w+250)+w+250)%(w+250)-100;this.rect(x,h*.51,8,80,'#7e8e65');this.rect(x-25,h*.49,62,27,'#aac08a');}
  this.rect(0,h*.13,w,18,'#685d4d');this.rect(0,h*.71,w,26,'#79654e');this.rect(0,h*.74,w,h*.26,'#bb9670');for(let i=0;i<4;i++){const x=i*w/3;this.rect(x-7,h*.13,15,h*.59,'#88745a');this.rect(x-4,h*.13,4,h*.59,'#c2ab85');}this.rect(0,h*.82,w,12,'#725c49');this.rect(0,h*.85,w,h*.15,'#715c4c');const scale=Math.min(1.8,w/420);c.save();c.translate(w/2,h*.82);c.scale(scale,scale);this.rect(-150,-20,300,15,'#b27e6c');this.rect(-150,-12,300,19,'#936b58');if(this.ready){const cw=this.atlas.width/3,ch=this.atlas.height/4;[0,1,2].forEach((i)=>{const size=i===0?118:i===1?100:85;c.drawImage(this.atlas,i*cw,3*ch,cw,ch,-145+i*100,-size-9,size,size);});}this.rect(-21,-35,42,22,'#e8d9ae');this.rect(-1,-35,2,23,'#a79068');this.rect(-17,-31,12,1,'#ac9e7e');c.restore();}
};

