'use strict';
Diary.Renderer = class {
 constructor(canvas,game){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.game=game;this.camera={x:0,y:360};this.scale=1;this.cache=new Map();this.ready=true;this.resize();this.scale=this.targetScale;}
 resize(){this.w=this.canvas.clientWidth||innerWidth;this.h=this.canvas.clientHeight||innerHeight;const quality=this.game.state.settings.quality;this.ratio=Math.min(devicePixelRatio||1,quality==='low'?1:2);this.canvas.width=Math.round(this.w*this.ratio);this.canvas.height=Math.round(this.h*this.ratio);this.setZoom();}
 setZoom(){this.targetScale=(this.w<540?1.12:this.w<850?1.22:1.4)*this.game.state.settings.zoom;}
 project(x,y,z=0){return{x:(x-y)*29,y:(x+y)*14.5-z};}
 screen(x,y,z=0){const p=this.project(x,y,z);return{x:(p.x-this.camera.x)*this.scale+this.w/2,y:(p.y-this.camera.y)*this.scale+this.h*.55};}
 unproject(sx,sy){const x=(sx-this.w/2)/this.scale+this.camera.x,y=(sy-this.h*.55)/this.scale+this.camera.y;return{x:(x/29+y/14.5)/2,y:(y/14.5-x/29)/2};}
 rect(x,y,w,h,color){Diary.Art.rect(this.ctx,x,y,w,h,color);}
 poly(points,color){Diary.Art.poly(this.ctx,points,color);}
 oval(x,y,rx,ry,color){Diary.Art.oval(this.ctx,x,y,rx,ry,color);}
 diamond(x,y,w,h,color){this.poly([[x,y-h],[x+w,y],[x,y+h],[x-w,y]],color);}
 line(points,color,width=1){const c=this.ctx;c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
 flower(x,y,size=1){Diary.Art.flower(this.ctx,x,y,size);}
 palette(){return [
  {grass:'#9fb28a',edge:'#6c8867',path:'#d1c4aa',stone:'#c1bdab',sky:'#dce4d5',water:'#789e9b',roof:['#556f68','#60796f','#6c8376'],leaves:['#ba7890','#d99bad','#eab4c0','#f4ced2']},
  {grass:'#8ba67b',edge:'#5b7c5c',path:'#bdba99',stone:'#afbaa2',sky:'#d4dfd1',water:'#719c9b',roof:['#596c5a','#708068','#849276'],leaves:['#436b53','#5e8360','#7a9a6b','#a0b380']},
  {grass:'#91a99b',edge:'#5f8178',path:'#bec7ba',stone:'#afbcb5',sky:'#c6d8d7',water:'#7196a4',roof:['#4d656a','#607b7d','#77908b'],leaves:['#365e53','#4f7965','#709278','#93ac8d']},
  {grass:'#6f8179',edge:'#4b625d',path:'#a8a99c',stone:'#87978e',sky:'#697d8e',water:'#567887',roof:['#704d54','#99646b','#bb8183'],leaves:['#916879','#b78c9a','#d2a6ae','#e8c1c0']}
 ][this.game.state.chapter];}
 terrain(){const w=this.game.world;if(this.terrainWorld===w)return;this.terrainWorld=w;this.cache.clear();const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1040;const previous=this.ctx;this.ctx=canvas.getContext('2d');this.ctx.translate(800,110);const pal=this.palette();
  // Layered soil, riverbank and moss form a complete little island.
  this.poly([[-696,348],[0,0],[696,348],[0,696]],pal.edge);this.poly([[-696,348],[0,696],[0,718],[-696,370]],'#60765b');this.poly([[0,696],[696,348],[696,370],[0,718]],'#506b55');
  for(let y=0;y<24;y++)for(let x=0;x<24;x++){
   const p=this.project(x,y);if(w.water(x,y)){this.diamond(p.x,p.y,29.5,15,pal.water);continue;}
   const hash=Diary.hash(x,y,2),path=w.path(x,y);this.diamond(p.x,p.y,29.5,15,pal.grass);
   // Subtle turf changes, without a checkerboard over every tile.
   if(hash>.68)this.diamond(p.x,p.y,29,14.5,'#e3e8b20b');if(hash<.2)this.diamond(p.x,p.y,29,14.5,'#345c340a');
   if(path){this.diamond(p.x,p.y,29.5,15,pal.path);for(let i=0;i<2;i++){const sx=p.x+(i?13:-13),sy=p.y+(i?5:-5);this.poly([[sx-12,sy],[sx,sy-6],[sx+12,sy],[sx,sy+6]],i%2?'#f2ead622':'#fbf5e922');this.line([[sx-11,sy],[sx,sy+5],[sx+11,sy]],'#767c631b');}}
   else{for(let k=0;k<4;k++){const sx=p.x+(Diary.hash(x,y,k+3)-.5)*39,sy=p.y+(Diary.hash(x,y,k+8)-.5)*15;this.rect(sx,sy,2,2,'#c5d1a339');if(k%2)this.rect(sx+2,sy-2,1,3,'#426c3a24');}}
   if(!path&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>w.water(x+dx,y+dy))){this.diamond(p.x,p.y,26,12,'#d4cdb05e');for(let i=0;i<3;i++)this.oval(p.x-16+i*14,p.y+i%2*4,7,3,pal.stone);}
  }
  // Fallen petals and moss stay attached to the ground as the camera moves.
  for(let i=0;i<130;i++){const x=1+Diary.hash(i,14)*21,y=2+Diary.hash(i,15)*20;if(w.water(Math.round(x),Math.round(y)))continue;const p=this.project(x,y);if(w.chapter===0||w.chapter===3){this.rect(p.x,p.y,2,1,'#ecc5c6');this.rect(p.x+1,p.y-1,1,1,'#f5d6cf');}}
  this.ctx=previous;this.ground=canvas;
 }
 blob(x,y,rx,ry,color){for(let j=-Math.ceil(ry);j<=Math.ceil(ry);j+=3){const q=1-j*j/(ry*ry);if(q>0){const extent=Math.round(Math.sqrt(q)*rx/3)*3;this.rect(x-extent,y+j,extent*2,3,color);}}}
 treeArt(p){const pal=this.palette(),s=p.variant%3||0,green=this.game.state.chapter===1||this.game.state.chapter===2;this.oval(9,3,39,13,'#294c3e22');
  this.poly([[-6,0],[-8,-39],[-3,-67],[5,-68],[7,-37],[8,0]],'#765a48');this.rect(-4,-54,3,51,'#aa8663');this.rect(4,-41,3,37,'#5f5042');this.poly([[-3,-35],[-23,-56],[-25,-68],[-21,-68],[-18,-57],[2,-44]],'#88684e');this.poly([[4,-40],[24,-62],[29,-59],[10,-34]],'#88684e');
  if(this.game.state.chapter===2){for(let i=0;i<4;i++){const y=-30-i*17,w=38-i*7;this.poly([[-w,y],[-w+7,y-4],[-w+7,y-10],[-w+15,y-10],[-6,y-32],[0,y-39],[9,y-29],[w-12,y-13],[w-5,y-9],[w-5,y-4],[w,y],[12,y+6],[-12,y+6]],pal.leaves[i%2]);this.poly([[-w+8,y-7],[-4,y-30],[0,y-34],[3,y-25],[-12,y-8]],pal.leaves[2]);for(let j=0;j<5;j++)this.rect(-w+12+j*8,y-5+j%2*2,6,2,'#93ac8d60');}return;}
  const clusters=green?[[-25,-58,22,15],[22,-62,24,17],[-4,-79,29,20],[0,-54,25,14]]:[[-30,-63,23,17],[23,-67,27,18],[-9,-86,27,18],[9,-48,21,13],[-6,-67,32,21]];
  for(let i=0;i<clusters.length;i++){const [x,y,rx,ry]=clusters[i];this.blob(x+s*2,y,rx,ry,pal.leaves[0]);this.blob(x-2,y-3,rx-2,ry-3,pal.leaves[1]);this.blob(x-5,y-7,rx-6,ry-7,pal.leaves[2]);for(let j=0;j<9;j++){const xx=x+(Diary.hash(i,j,s)-.5)*rx*1.5,yy=y-4+(Diary.hash(j,i,8)-.5)*ry;this.rect(xx,yy,3,2,pal.leaves[j%3+1]);if(!green&&j%3===0)this.rect(xx+1,yy-1,1,1,'#ffe4db');}}
 }
 buildingArt(p){const c=this.ctx,pal=this.palette(),w=p.w,h=p.h,kind=p.kind;const point=(x,y,z=0)=>{const q=this.project(x,y,z);return[q.x,q.y]};
  if(kind==='picnic'){this.diamond(0,0,70,32,'#805f5140');this.diamond(0,-2,62,28,'#ba7e73');for(let i=-2;i<=2;i++)this.poly([[i*13-29,-12],[i*13, -26],[i*13+29,-12],[i*13,2]],'#e4c6a3');this.rect(-18,-16,22,11,'#7d6652');this.rect(-16,-15,18,4,'#e5cda2');this.rect(-15,-10,7,4,'#f2e5c6');this.rect(-5,-10,6,4,'#8fa96e');this.cupArt(24,-2);return;}
  if(kind==='view'){this.diamond(0,4,100,45,'#46685a20');this.poly([[-80,-4],[-2,-44],[80,-4],[2,37]],'#abb7a8');this.poly([[-80,-4],[2,37],[2,44],[-80,3]],'#788d81');for(let i=-3;i<=3;i++){this.rect(i*22,-26+i*3,4,24,'#977f5e');if(i<3)this.line([[i*22,-26+i*3],[(i+1)*22,-23+i*3]],'#c5ae84',4);}this.rect(-8,-29,16,21,'#6d7c6d');this.rect(-14,-32,28,8,'#bac2af');return;}
  const roofHeight=kind==='festival'?42:kind==='station'?48:60;
  const A=point(-w/2,-h/2),B=point(w/2,-h/2),C=point(w/2,h/2),D=point(-w/2,h/2);
  this.oval(9,15,w*24,18,'#294c3e22');
  this.poly([A,B,C,D],'#c5b69a');
  const wall=(start,end,color)=>{const top=roofHeight;this.poly([[start[0],start[1]-top],[end[0],end[1]-top],end,start],color);for(let j=0;j<=4;j++){const t=j/4,x=start[0]+(end[0]-start[0])*t,y=start[1]+(end[1]-start[1])*t;this.rect(x-2,y-top,4,top,'#755d4a');if(j<4){const u=(j+.12)/4,v=(j+.88)/4,x1=start[0]+(end[0]-start[0])*u,y1=start[1]+(end[1]-start[1])*u,x2=start[0]+(end[0]-start[0])*v,y2=start[1]+(end[1]-start[1])*v;
    this.poly([[x1,y1-top+11],[x2,y2-top+11],[x2,y2-13],[x1,y1-13]],this.game.state.chapter===3?'#e7bb7b':'#e7d9b8');for(let k=0;k<3;k++){const v=.25*(k+1),xx=x1+(x2-x1)*v,yy=y1+(y2-y1)*v;this.rect(xx,yy-top+12,1,top-26,'#a48b69');}for(let k=20;k<top-13;k+=9)this.line([[x1,y1-top+k],[x2,y2-top+k]],'#aa9271',1);
   }}this.line([[start[0],start[1]-7],[end[0],end[1]-7]],'#8e7556',4);this.line([start,end],'#624f40',5);};
  wall(D,C,kind==='shrine'?'#bc7660':'#bba381');wall(C,B,kind==='shrine'?'#a86351':'#9d876b');
  const ea=point(-w/2-.35,-h/2-.3,roofHeight),eb=point(w/2+.35,-h/2-.3,roofHeight),ec=point(w/2+.35,h/2+.3,roofHeight),ed=point(-w/2-.35,h/2+.3,roofHeight),rb=point(0,-h/2-.3,roofHeight+28),rf=point(0,h/2+.3,roofHeight+28);
  const roofFace=(a,b,d,e,shade)=>{this.poly([a,b,d,e],shade);for(let row=0;row<7;row++)for(let col=0;col<9;col++){
   const pointAt=(u,v)=>[a[0]*(1-u)*(1-v)+b[0]*u*(1-v)+d[0]*u*v+e[0]*(1-u)*v,a[1]*(1-u)*(1-v)+b[1]*u*(1-v)+d[1]*u*v+e[1]*(1-u)*v];
   const u=col/9,v=row/7,u2=(col+.97)/9,v2=(row+.84)/7;this.poly([pointAt(u,v),pointAt(u2,v),pointAt(u2,v2),pointAt(u,v2)],pal.roof[Diary.hash(row,col,3)>.89?2:row<2?1:0]);
  }};
  roofFace(ea,rb,rf,ed,pal.roof[0]);roofFace(rb,eb,ec,rf,pal.roof[0]);this.line([ea,ed,rf,ec,eb],pal.roof[0],4);this.line([rb,rf],'#9fa99a',3);this.line([[rf[0]-3,rf[1]-3],[rf[0]+3,rf[1]+3]],'#cad0ba',2);
  if(kind==='tea'||kind==='shop'||kind==='ryokan'){const y=C[1]-roofHeight+16;this.poly([[C[0]+3,y],[B[0]-4,B[1]-roofHeight+16],[B[0]-4,B[1]-roofHeight+35],[C[0]+3,y+19]],kind==='shop'?'#a87778':'#627d69');for(let i=1;i<4;i++){const t=i/4;this.line([[C[0]+(B[0]-C[0])*t,C[1]+(B[1]-C[1])*t-roofHeight+17],[C[0]+(B[0]-C[0])*t,C[1]+(B[1]-C[1])*t-roofHeight+34]],'#b8bba0',1);}}
  if(kind==='festival'){const y=C[1]-13;this.poly([[D[0]+5,D[1]-13],[C[0]-5,y],[C[0]-5,y+8],[D[0]+5,D[1]-5]],'#dbc297');for(let j=0;j<5;j++){const x=D[0]+18+j*15,yy=D[1]-17+j*7;this.rect(x,yy,2,10,'#7b6249');for(let n=0;n<3;n++)this.oval(x+1,yy+n*3,3,2,['#edc8bf','#ead9ac','#a8b886'][n]);}}
  if(kind==='shrine'){this.rect(C[0]-5,C[1]-roofHeight+6,3,28,'#d1b77e');this.oval(C[0]-4,C[1]-roofHeight+34,5,4,'#b8915c');}
  if(kind==='station'){const x=(D[0]+C[0])/2,y=(D[1]+C[1])/2-roofHeight+10;this.rect(x-26,y,52,13,'#eee0bd');c.fillStyle='#526958';c.font='7px monospace';c.textAlign='center';c.fillText('STATION',x,y+9);}
  this.lanternArt(D[0]+4,D[1]-roofHeight+17,true);this.lanternArt(B[0]-4,B[1]-roofHeight+17,true);
 }
 cupArt(x,y){this.oval(x,y,10,4,'#5c70542c');this.rect(x-6,y-8,12,7,'#d6dfbf');this.rect(x-4,y-1,8,2,'#abb699');this.oval(x,y-8,6,2,'#f0e8ce');this.oval(x,y-8,4,1,'#86a35f');}
 lanternArt(x=0,y=0,hanging=false){if(!hanging){this.rect(x-2,y-32,4,31,'#7e745d');this.rect(x-10,y-38,20,4,'#657363');}const yy=y-(hanging?0:34);this.oval(x,yy+9,8,11,'#ac865e');this.oval(x,yy+8,7,9,'#e9bd7f');this.rect(x-3,yy,6,15,'#f5d99f');this.rect(x,yy,1,16,'#c09565');this.rect(x-5,yy-3,10,3,'#72624d');this.rect(x-5,yy+17,10,2,'#72624d');}
 propArt(p){const c=this.ctx,pal=this.palette();switch(p.type){
  case'tree':this.treeArt(p);break;
  case'building':this.buildingArt(p);break;
  case'lantern':this.lanternArt();break;
  case'torii':this.oval(2,0,50,9,'#3b574321');this.rect(-39,-76,8,77,'#a15849');this.rect(32,-76,8,77,'#a15849');this.rect(-37,-73,3,72,'#c47a60');this.rect(34,-73,3,72,'#c47a60');this.rect(-44,-64,88,7,'#b76b53');this.poly([[-54,-86],[-47,-81],[44,-81],[54,-86],[51,-77],[39,-74],[-39,-74],[-51,-78]],'#5b6251');this.rect(-45,-77,89,6,'#b46b52');this.rect(-6,-73,13,17,'#c69c61');this.rect(-3,-69,7,9,'#7c6550');this.rect(-42,-3,14,5,'#9b9f87');this.rect(29,-3,14,5,'#9b9f87');break;
  case'bench':this.oval(4,4,31,8,'#3b574322');this.poly([[-28,-13],[2,-27],[32,-13],[2,2]],'#b89c71');this.line([[-28,-12],[2,3],[32,-12]],'#886d4e',4);this.rect(-21,-9,4,14,'#745c46');this.rect(24,-10,4,14,'#745c46');for(let i=0;i<3;i++)this.line([[-24+i*8,-13-i*4],[2+i*8,0-i*4]],'#d2b78c',1);this.cupArt(8,-17);break;
  case'flowers':for(let i=0;i<6;i++){const x=(Diary.hash(i,3,p.variant||p.x)-.5)*31,y=(Diary.hash(i,8)-.5)*12;this.rect(x,y-5,1,7,'#647e4f');this.rect(x-2,y-2,2,1,'#7c925a');this.flower(x,y-6,.35);}break;
  case'rock':case'stone':this.oval(3,3,19,6,'#365b4220');this.poly([[-16,-6],[-9,-16],[6,-18],[17,-8],[12,0],[-12,1]],'#8d9f91');this.poly([[-15,-7],[-8,-15],[5,-16],[10,-8],[-2,-3]],'#b8c3af');this.rect(-6,-12,7,2,'#ced3bd');this.rect(6,-1,6,2,'#77916b');if(p.type==='stone'){this.rect(-5,-25,10,10,'#b7bda6');this.poly([[-11,-25],[0,-31],[11,-25]],'#889b89');this.rect(-2,-23,4,5,'#e4cd90');}break;
  case'bamboo':for(let i=0;i<4;i++){const x=i*7-12,h=48+i%2*17;this.rect(x,-h,4,h,'#738b5a');this.rect(x,-h,1,h,'#9eb47b');for(let j=0;j<5;j++){this.rect(x,-j*12,4,1,'#c1c997');this.poly([[x,-j*12],[x-14,-j*12-11],[x-5,-j*12-10]],'#77966a');this.poly([[x+3,-j*12-5],[x+18,-j*12-14],[x+8,-j*12-4]],'#92aa79');}}break;
  case'fence':this.rect(-23,-17,4,21,'#a6916e');this.rect(21,-17,4,21,'#a6916e');this.rect(-24,-14,50,4,'#c1aa81');this.rect(-24,-6,50,3,'#b29a75');this.rect(-22,-16,2,18,'#dac29a');break;
  case'deer':this.oval(0,1,23,6,'#365b4220');this.oval(0,-24,23,11,'#ab8864');this.oval(-3,-27,19,8,'#c3a17b');for(const x of [-14,12]){this.rect(x,-17,4,18,'#967451');this.rect(x-1,0,6,2,'#5d5647');}this.poly([[-17,-26],[-15,-44],[-7,-45],[-7,-23]],'#b9956a');this.oval(-14,-45,11,7,'#caaa7e');this.poly([[-22,-47],[-26,-56],[-17,-50]],'#b39169');this.poly([[-9,-48],[-3,-55],[-3,-47]],'#b39169');this.rect(-21,-46,2,3,'#3e4138');this.rect(-25,-43,4,3,'#575041');for(let i=0;i<6;i++)this.rect(-8+i*4,-29+i%2*5,2,2,'#e7cfac');break;
  case'bridge':this.poly([[-85,-7],[-12,-43],[85,5],[12,42]],'#ae9270');for(let i=0;i<12;i++)this.line([[-82+i*8,-7+i*4],[-9+i*8,-42+i*4]],'#d0b48b',2);for(const i of [-2,-1,0,1,2]){this.rect(i*28,-19+i*5,4,23,'#8b7359');}this.line([[-60,-30],[0,-18],[60,-8]],'#c2a57e',4);break;
 }}
 anchor(p){return p.type==='building'?this.project(p.x+(p.w-1)/2,p.y+(p.h-1)/2):this.project(p.x,p.y);}
 prop(p,time){const q=this.anchor(p),g=this.game,c=this.ctx,screenX=(q.x-this.camera.x)*this.scale+this.w/2,screenY=(q.y-this.camera.y)*this.scale+this.h*.55;
  const [width,height,anchorY]=({building:[320,240,175],tree:[128,128,114],lantern:[32,64,57],bamboo:[62,96,88],torii:[120,108,100],bench:[80,56,47],flowers:[52,38,27],rock:[48,40,32],stone:[48,52,44],deer:[80,80,71],fence:[62,34,27],bridge:[192,112,57]})[p.type]||[160,160,120];
  if(screenX+width/2*this.scale<0||screenX-width/2*this.scale>this.w||screenY+(height-anchorY)*this.scale<0||screenY-anchorY*this.scale>this.h)return;
  const key=[p.type,p.kind,p.w,p.h,(p.variant||0)%3,this.game.state.chapter].join(':');let sprite=this.cache.get(key);if(!sprite){sprite=document.createElement('canvas');sprite.width=width;sprite.height=height;const previous=this.ctx;this.ctx=sprite.getContext('2d');this.ctx.translate(width/2,anchorY);this.propArt(p);this.ctx=previous;this.cache.set(key,sprite);}const player=this.project(g.player.x,g.player.y);let alpha=1;
  if((p.type==='tree'||p.type==='building')&&player.y<q.y+4&&player.y>q.y-(p.type==='tree'?82:150)&&Math.abs(player.x-q.x)<(p.type==='tree'?38:75))alpha=.55;
  c.save();c.globalAlpha=alpha;c.translate(q.x,q.y);if(g.state.settings.motion&&(p.type==='tree'||p.type==='bamboo'))c.transform(1,0,Math.sin(time*.65+p.x)*.008,1,0,0);c.drawImage(sprite,-width/2,-anchorY);c.restore();
 }
 character(a,index,time,rest=false){const c=this.ctx,p=this.project(a.x,a.y);this.oval(p.x,p.y+2,index?21:15,index?6:5,'#294b3d30');const sprite=Diary.Art.sprite(index,a,this.game.state.settings.motion?time:0,rest);c.drawImage(sprite,p.x-64,p.y-108);if(index&&!this.cleanCapture&&(this.game.play.hover===a.name||a.waiting)){c.font='10px Verdana';c.textAlign='center';const label=(index===1?'Happy':'Toti')+(a.waiting?' · staying':'');const width=c.measureText(label).width+14;this.rect(p.x-width/2,p.y-76,width,17,'#fff5e5');c.fillStyle='#405440';c.fillText(label,p.x,p.y-64);}}
 marker(o,time){if(o.quest){this.parcel(o,time);return;}const g=this.game,c=this.ctx,d=Math.hypot(g.player.x-o.tx,g.player.y-o.ty);if(o.id==='secret'&&!g.discovered('secret')&&d>4)return;const q=this.project(o.tx,o.ty,14),hover=g.play?.hover===o.id,active=hover||g.guide===o.id,done=g.discovered(o.id);c.save();c.globalAlpha=active?1:done?.45:.8;this.oval(q.x,q.y,10,10,active?'#fcf1d7':'#fbf4e6');this.oval(q.x,q.y,8,8,done?'#7e9971':'#ad7c7b');c.strokeStyle='#fff5df';c.lineWidth=1.5;c.beginPath();if(done){c.moveTo(q.x-4,q.y);c.lineTo(q.x-1,q.y+3);c.lineTo(q.x+4,q.y-3);}else{c.moveTo(q.x-3,q.y);c.lineTo(q.x+3,q.y);c.moveTo(q.x,q.y-3);c.lineTo(q.x,q.y+3);}c.stroke();c.restore();
  if(hover||g.guide===o.id&&d<5){const s=g.chapter,text=({landmark:s.landmark,activity:s.activityTitle,souvenir:'Keepsake shop',rest:'A quiet moment',secret:'Toti found something',station:'Train station'})[o.id];c.font='10px Verdana';const width=c.measureText(text).width+16;this.rect(q.x-width/2,q.y-31,width,17,'#fffaeeef');c.fillStyle='#4c5d4d';c.textAlign='center';c.fillText(text,q.x,q.y-19);}
 }
 effects(time){const play=this.game.play;if(!play)return;const c=this.ctx;
  for(const e of play.effects){const age=time-e.born;if(age<0)continue;const t=age/e.life,p=this.project(e.x,e.y);c.save();c.globalAlpha=(1-t)*.6;if(e.type==='ripple'){c.strokeStyle='#fff9df';c.lineWidth=1;c.beginPath();c.ellipse(p.x,p.y,8+t*15,4+t*7,0,0,Math.PI*2);c.stroke();}if(e.type==='step'){this.oval(p.x-3,p.y,2,1,'#697860');this.oval(p.x+4,p.y+3,2,1,'#697860');}if(e.type==='petal'){this.rect(p.x+Math.sin(t*6+e.seed)*12+t*20,p.y-65+t*63,3,2,this.game.state.chapter===0||this.game.state.chapter===3?'#f7cbd3':'#a5bc7a');}if(e.type==='heart'){const x=p.x,y=p.y-48-t*22;this.poly([[x,y+5],[x-5,y],[x-5,y-3],[x-2,y-5],[x,y-3],[x+2,y-5],[x+5,y-3],[x+5,y]],'#d891a4');}c.restore();}
  const b=play.ball;if(b){let x=b.x,y=b.y,z=0;if(b.phase==='air'){const t=Math.min(1,b.t/.6);x=b.from.x+(b.x-b.from.x)*t;y=b.from.y+(b.y-b.from.y)*t;z=Math.sin(t*Math.PI)*32;}if(b.phase==='carried'){const a=this.game.companions[play.care.friend==='happy'?0:1];x=a.x;y=a.y;z=20;}const p=this.project(x,y,z);this.oval(p.x,p.y+z,5,2,'#415f4433');this.oval(p.x,p.y-4,5,5,'#bd7687');this.rect(p.x-3,p.y-7,3,2,'#f5bec9');}
  if(play.care?.action==='feed'&&play.care.phase==='care'){const a=this.game.companions[play.care.friend==='happy'?0:1],p=this.project(a.x,a.y);this.oval(p.x-22,p.y-3,10,4,'#b5b4a2');this.oval(p.x-22,p.y-5,9,3,'#dfe1cb');this.oval(p.x-22,p.y-5,7,2,'#90b7b7');}
 }
 frame(time,dt){const c=this.ctx,g=this.game,pal=this.palette();c.setTransform(this.ratio,0,0,this.ratio,0,0);c.imageSmoothingEnabled=false;const sky=c.createLinearGradient(0,0,0,this.h);sky.addColorStop(0,g.environment.skyColor());sky.addColorStop(1,g.environment.skyColor());c.fillStyle=sky;c.fillRect(0,0,this.w,this.h);if(g.scene?.train){this.train(g.state.settings.motion?(g.scene.elapsed||0):0);g.environment.draw(this,time,false,true);return;}
  g.environment.drawSky(this,time);this.scale=Diary.Motion.damp(this.scale,this.targetScale,g.state.settings.motion?9:100,dt||.016);const target=this.project(g.player.x,g.player.y),look=g.player.moving?this.project((g.player.vx||0)*.14,(g.player.vy||0)*.14):{x:0,y:0};let tx=target.x+look.x,ty=target.y-15+look.y;if(g.mode==='title'){tx=-170;ty=310;}const follow=g.state.settings.motion?1-Math.exp(-dt*5):1;this.camera.x+=(tx-this.camera.x)*follow;this.camera.y+=(ty-this.camera.y)*follow;
  this.terrain();
  // Distant silhouettes are quieter than the playable foreground.
  for(let i=0;i<6;i++){const x=i*this.w/4-180;if(g.state.chapter===3){this.rect(x,this.h*.3,90,180,'#526c7b20');for(let j=0;j<4;j++)this.rect(x+12+j*19,this.h*.33,4,6,'#e5c38f33');}else this.poly([[x,this.h*.58],[x+65,this.h*.37],[x+110,this.h*.34],[x+167,this.h*.21],[x+224,this.h*.31],[x+280,this.h*.34],[x+360,this.h*.58]],'#668d7d18');}
  c.save();c.translate(this.w/2-this.camera.x*this.scale,this.h*.55-this.camera.y*this.scale);c.scale(this.scale,this.scale);c.imageSmoothingEnabled=false;c.drawImage(this.ground,-800,-110);
  // Ripples are world anchored, avoiding screen-space sliding water.
  for(let y=0;y<24;y++)for(let x=0;x<24;x++)if(g.world.water(x,y)&&Diary.hash(x,y)>.45){const p=this.project(x,y),offset=g.state.settings.motion?Math.sin(time*.8+x+y)*3:0;this.rect(p.x-9+offset,p.y,17,1,'#d7e5d83b');this.rect(p.x-offset,p.y+5,10,1,'#d7e5d824');}
  if(g.route.length&&!this.cleanCapture){const points=[this.project(g.player.x,g.player.y),...g.route.map(p=>this.project(p.x,p.y))];c.setLineDash([2,6]);this.line(points.map(p=>[p.x,p.y]),'#fcf4d7aa',1);c.setLineDash([]);}
  if(g.state.chapter===3)for(const p of g.world.props)if(p.type==='lantern'){const q=this.project(p.x,p.y);this.oval(q.x,q.y,43,19,'#ffe2a00d');this.oval(q.x,q.y,29,13,'#ffe2a010');this.oval(q.x,q.y,17,8,'#ffe2a015');}
  const things=g.world.props.map(p=>({depth:this.anchor(p).y,prop:p}));[g.player,...g.companions].forEach((a,i)=>things.push({depth:this.project(a.x,a.y).y+1,actor:a,index:i}));things.sort((a,b)=>a.depth-b.depth);
  for(const item of things){if(item.prop)this.prop(item.prop,time);else this.character(item.actor,item.index,time,!!g.scene?.rest);}
  if(g.state.chapter===3){const a=this.project(8,10,62),b=this.project(17,10,62);this.line([[a.x,a.y],[(a.x+b.x)/2,(a.y+b.y)/2+12],[b.x,b.y]],'#6c6b5d',1);for(let j=0;j<=8;j++){const t=j/8;this.lanternArt(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t+Math.sin(t*Math.PI)*12,true);}}
  this.effects(time);
  if(g.state.decoration.length&&g.state.chapter===2){const p=this.project(16,9);this.diamond(p.x,p.y,18,8,g.state.decoration[0]==='Moss cotton'?'#81956b':'#b88a99');this.flower(p.x+12,p.y-13,g.state.decoration[1]==='Cherry blossom'?.6:.8);this.lanternArt(p.x+29,p.y-20,true);}
  if(g.mode==='play'&&!g.scene&&!this.cleanCapture)for(const o of g.world.objects)this.marker(o,time);
  c.restore();g.environment.draw(this,time,!this.cleanCapture);
  if(g.scene?.rest){c.fillStyle='#d49c6020';c.fillRect(0,0,this.w,this.h);}
 }
 parcel(o,time){const g=this.game,c=this.ctx,q=this.project(o.tx,o.ty),active=g.guide===o.id||g.play.hover===o.id;
  this.oval(q.x,q.y+2,14,5,'#36554430');this.rect(q.x-10,q.y-14,20,14,'#806750');this.rect(q.x-9,q.y-15,18,12,'#fff2ca');this.poly([[q.x-9,q.y-15],[q.x,q.y-9],[q.x+9,q.y-15]],'#dbbd91');this.rect(q.x-2,q.y-10,4,4,'#b97680');
  if(active){c.strokeStyle='#fff7d8';c.lineWidth=1.5;c.strokeRect(q.x-14,q.y-20,28,23);c.font='10px Verdana';const width=c.measureText(o.label).width+16;this.rect(q.x-width/2,q.y-43,width,18,'#fffaee');c.fillStyle='#4c5d4d';c.textAlign='center';c.fillText(o.label,q.x,q.y-30);}
 }
 train(time){const c=this.ctx,w=this.w,h=this.h*(this.h<500?.78:this.w<this.h?.8:.93);
  // Analytic integral of an exponential speed ramp: identical at every refresh rate.
  const distance=Diary.trainDistance(time),windowTop=h*.16,windowBottom=h*.66;
  const night=this.game.environment.visual.dark>.25;
  const sky=c.createLinearGradient(0,windowTop,0,windowBottom);sky.addColorStop(0,night?'#637c8c':'#e7d8b9');sky.addColorStop(1,night?'#b8aaa1':'#d4dfca');
  this.rect(0,0,w,this.h,'#d6c5a6');c.fillStyle=sky;c.fillRect(0,windowTop,w,windowBottom-windowTop);
  this.oval(w*.78,h*.28,24,24,night?'#f1e6c7':'#f5e5bb');
  c.save();c.beginPath();c.rect(0,windowTop,w,windowBottom-windowTop);c.clip();
  // Repeat by a fixed tile span, not viewport width; resize cannot change velocity.
  const layer=(spacing,speed,draw)=>{const offset=(distance*speed)%spacing;for(let n=-2;n<=Math.ceil(w/spacing)+2;n++){c.save();c.translate(n*spacing-offset,0);draw(n);c.restore();}};
  layer(360,11,()=>{this.poly([[-30,h*.61],[50,h*.44],[112,h*.32],[155,h*.38],[223,h*.51],[285,h*.43],[370,h*.62]],night?'#7d9197':'#a3b9a8');this.poly([[91,h*.36],[112,h*.32],[139,h*.36],[121,h*.355],[111,h*.37]],'#dce4d3');});
  layer(240,27,()=>{this.poly([[-15,h*.66],[0,h*.55],[65,h*.5],[132,h*.53],[185,h*.48],[260,h*.62]],'#8da786');this.rect(0,h*.61,240,h*.05,'#a4b487');this.rect(20,h*.58,33,20,'#d9c6a4');this.poly([[15,h*.58],[35,h*.55],[58,h*.58]],'#6c7d70');});
  this.rect(0,h*.64,w,h*.03,'#9eaa7e');
  layer(185,72,()=>{this.rect(24,h*.56,5,h*.1,'#7b8060');this.oval(26,h*.55,24,17,'#6f8f70');this.oval(16,h*.54,16,13,'#8ca780');this.rect(0,h*.65,185,2,'#c7bc94');});
  // Window reflections stay attached to the carriage.
  for(let x=0;x<w;x+=Math.max(180,w/3)){this.poly([[x+24,windowTop],[x+52,windowTop],[x+125,windowBottom],[x+99,windowBottom]],'#fff7df1c');}
  c.restore();
  this.rect(0,h*.10,w,h*.06,'#756a54');this.rect(0,h*.15,w,5,'#bca789');this.rect(0,h*.66,w,14,'#756a54');this.rect(0,h*.68,w,h*.32,'#b7a183');
  const panels=Math.max(2,Math.ceil(w/420));for(let i=0;i<=panels;i++){const x=i*w/panels;this.rect(x-7,h*.15,14,h*.52,'#8a7b62');this.rect(x-4,h*.15,3,h*.52,'#d6c2a1');}
  for(let i=0;i<4;i++)this.rect(0,h*.71+i*12,w,1,'#d1b995');this.rect(0,h*.91,w,this.h-h*.91,'#726857');
  // The carriage stays steady. Only restrained secondary character motion remains.
  const scale=Math.min(2.4,w/330,h/270);c.save();c.translate(w/2,h*.73);c.scale(scale,scale);
  this.rect(-142,-5,284,18,'#7b8b73');this.rect(-142,-5,284,4,'#a4b094');this.rect(-134,13,8,20,'#7b6a54');this.rect(126,13,8,20,'#7b6a54');
  for(let i=0;i<3;i++){c.save();c.translate(-86+i*84,0);c.drawImage(Diary.Art.sprite(i,{restBlend:1},time*.6,true),-64,-108);c.restore();}
  this.poly([[-72,-17],[-50,-19],[-30,-13],[-48,-10]],'#f5e6c4');this.line([[-50,-19],[-48,-10]],'#b99c70',1);c.restore();
 }

};
Diary.trainDistance = time => { const t=Math.max(0,time); return t-1.8*(1-Math.exp(-t/1.8)); };
