'use strict';
/* Original, code-authored pixel rigs. All limbs share a stable foot origin.
   These are continuous articulated drawings, not a generated animation atlas. */
Diary.Art = {
 cache:new Map(),
 sprite(index,actor,time,forceRest=false){
  const phase=Math.round((actor.gait||0)%(Math.PI*2)*32/(Math.PI*2)),pace=Math.round((actor.pace||0)*4),rest=Math.round((forceRest?1:actor.restBlend||0)*5),idle=pace?0:Math.round(Math.sin(time*1.8+index)*2),wag=pace?0:Math.round(Math.sin(time*(actor.careAction?10:5))*2);
  const key=[index,phase,pace,rest,idle,wag,actor.flip?1:0,actor.back?1:0,actor.careAction||''].join(':');
  if(this.cache.has(key))return this.cache.get(key);
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.translate(64,108);this.draw(c,index,{...actor,gait:phase/32*Math.PI*2,pace:pace/4,restBlend:rest/5},pace?phase/32*Math.PI*2:time,1,forceRest);
  this.cache.set(key,canvas);if(this.cache.size>300)this.cache.delete(this.cache.keys().next().value);return canvas;
 },
 rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));},
 poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();},
 oval(c,x,y,rx,ry,color){c.fillStyle=color;for(let j=-Math.ceil(ry);j<=Math.ceil(ry);j++){const k=1-j*j/(ry*ry);if(k<=0)continue;const w=Math.sqrt(k)*rx;c.fillRect(Math.round(x-w),Math.round(y+j),Math.max(1,Math.round(w*2)),1);}},
 flower(c,x,y,size=1){const r=(a,b,w,h,col)=>this.rect(c,x+a*size,y+b*size,w*size,h*size,col);r(-2,-5,4,4,'#f6d4d6');r(-5,-2,4,4,'#edabbc');r(1,-2,4,4,'#ffe0df');r(-3,1,3,4,'#e9a4b5');r(0,1,3,4,'#f8c9d0');r(-1,-1,2,2,'#f1d28e');},
 draw(c,index,actor,time=0,scale=1,forceRest=false){
  const pace=actor.pace??(actor.moving?1:0),phase=actor.gait||0,rest=forceRest?1:(actor.restBlend??(actor.rest?1:0));
  const bob=Math.sin(phase*2)*pace*.75+(1-pace)*Math.sin(time*1.8+index)*.3;
  c.save();c.scale(scale,scale);if(actor.flip)c.scale(-1,1);c.translate(0,-bob);
  if(index===0)this.ani(c,phase,pace,rest,!!actor.back,time,actor.careAction);else this.dog(c,index,phase,pace,rest,!!actor.back,time,actor.careAction);
  c.restore();
 },
 ani(c,phase,pace,rest,back,time,care){
  const r=(...a)=>this.rect(c,...a),p=(...a)=>this.poly(c,...a),o=(...a)=>this.oval(c,...a);
  const settle=rest*13,step=Math.sin(phase)*pace*3.2,arm=Math.sin(phase+Math.PI)*pace*2+((care==='pet'||care==='paw')?-7+Math.sin(time*7)*2:0);
  c.save();c.translate(0,settle);
  // Bamboo parasol, sewn panels and radial spokes.
  p([[-33,-65],[-27,-78],[-13,-88],[4,-91],[22,-83],[32,-70],[30,-55],[17,-47],[-3,-46],[-23,-52]],'#9a5266');
  p([[-30,-65],[-24,-77],[-12,-85],[4,-88],[20,-81],[29,-69],[27,-56],[16,-50],[-3,-49],[-21,-54]],'#db92a7');
  p([[-1,-67],[-24,-77],[-12,-85],[4,-88]],'#edb7c1');p([[-1,-67],[20,-81],[29,-69],[27,-56]],'#ebb0bb');p([[-1,-67],[-3,-49],[-21,-54],[-30,-65]],'#edb5bf');
  c.strokeStyle='#a77361';c.lineWidth=1;for(const [x,y]of[[-30,-65],[-24,-77],[-12,-85],[4,-88],[20,-81],[29,-69],[27,-56],[16,-50],[-3,-49],[-21,-54]]){c.beginPath();c.moveTo(-1,-67);c.lineTo(x,y);c.stroke();}
  this.flower(c,-17,-73,.55);this.flower(c,18,-67,.55);this.flower(c,9,-81,.45);r(23,-60,2,34,'#8c674e');r(22,-27,4,3,'#c9a579');
  // Hair silhouette and individual stepped curls.
  p([[-22,-67],[-15,-77],[0,-80],[15,-75],[22,-65],[21,-43],[26,-31],[19,-22],[-19,-24],[-27,-37],[-23,-49]],'#352c32');
  for(let i=0;i<7;i++){const xx=-24+i*7,hh=i%2*3;r(xx,-54+(i%3)*2,7,25+hh,'#44323a');r(xx+1,-49,2,21+hh,'#60434b');}
  const hem=-7-settle-rest*2;
  // Sandals articulate separately, while the robe follows the pelvis.
  for(const side of [-1,1]){const sx=side*6,sy=side*step;r(sx-4,hem+2+sy,9,4,'#f3cfb3');r(sx-5,hem+6+sy,11,3,'#51433d');r(sx-4,hem+5+sy,9,2,'#f5e1c2');r(sx-1,hem+2+sy,2,4,'#b66e7f');}
  p([[-14,-43],[13,-43],[17,-26],[19,hem],[2,hem+3],[-19,hem]],'#b96580');
  p([[-12,-41],[0,-42],[9,-25],[14,hem-1],[1,hem],[-15,hem-1]],'#e29aaa');
  p([[2,-34],[12,-39],[16,hem-2],[7,hem]],'#ce7f99');
  p([[-13,-41],[-21,-38+arm],[-26,-20+arm],[-17,-16+arm],[-10,-29]],'#d98ea5');p([[12,-42],[22,-35-arm],[26,-21-arm],[17,-16-arm],[11,-29]],'#e3a2b2');
  r(-23,-20+arm,7,4,'#efc0a3');r(19,-23-arm,6,5,'#f2c8aa');
  p([[-11,-43],[-3,-48],[10,-40],[4,-31]],'#f3dfc9');p([[-12,-42],[3,-32],[12,-41],[8,-29],[-7,-30]],'#e7a2b1');
  r(-14,-31,29,8,'#795246');r(-13,-30,27,3,'#b08b58');r(-12,-25,25,2,'#dfbb79');r(-2,-31,4,8,'#f1cf87');
  for(const [x,y,s]of[[-9,-18,.45],[8,-12,.5],[-9,-38,.35],[17,-30,.35],[5,-22,.35]])this.flower(c,x,y,s);
  if(back){p([[-10,-28],[-17,-34],[-17,-21],[-6,-24],[-1,-20],[6,-24],[16,-21],[16,-34],[7,-28]],'#d4aa70');r(-3,-29,7,8,'#9c6a54');}
  // Face and glasses are identity anchors at every visible front angle.
  if(!back){o(-1,-60,15,16,'#e9b18f');o(-2,-62,13,13,'#f7cfad');r(-16,-69,7,12,'#382d32');r(8,-72,7,9,'#382d32');p([[-14,-72],[-8,-78],[4,-77],[13,-71],[5,-68],[-3,-72]],'#382d32');
   r(-12,-64,10,9,'#a85675');r(2,-64,10,9,'#a85675');r(-10,-62,6,5,'#f8d8b7');r(4,-62,6,5,'#f8d8b7');r(-2,-61,4,2,'#c77991');r(-8,-61,3,4,'#302e32');r(5,-61,3,4,'#302e32');r(-8,-61,1,1,'#ffffff');r(5,-61,1,1,'#ffffff');r(-11,-54,4,2,'#e99b98');r(7,-54,4,2,'#e99b98');r(-3,-51,7,1,'#a75d69');r(-1,-50,3,1,'#c77a7b');
  }else{for(let i=0;i<5;i++){r(-16+i*7,-70+i%2*4,6,26,'#4b353e');r(-15+i*7,-66+i%2*4,2,17,'#62444c');}}
  this.flower(c,15,-70,.85);this.flower(c,20,-63,.55);r(21,-58,1,12,'#dbb46d');r(20,-47,3,4,'#efc87d');
  c.restore();
 },
 dog(c,index,phase,pace,rest,back,time,care){
  const happy=index===1,r=(...a)=>this.rect(c,...a),p=(...a)=>this.poly(c,...a),o=(...a)=>this.oval(c,...a);
  const fur=happy?'#d6a05f':'#c79662',light=happy?'#f0c58b':'#ebc89a',shadow=happy?'#ad7549':'#a2714e';
  const settle=rest*7,headDip=care==='feed'?Math.sin(time*4)*1.5+4:0;
  c.save();c.translate(0,settle);if(!happy)c.scale(.8,.8);
  // Tail stays attached to the pelvis throughout the gait.
  const wag=Math.sin(time*(care?10:5))*2.2;
  if(happy){p([[18,-27],[28,-34+wag],[37,-34+wag],[33,-28+wag],[41,-27+wag],[33,-19+wag],[22,-19]],shadow);p([[21,-27],[30,-32+wag],[36,-31+wag],[29,-23+wag],[35,-23+wag],[29,-19],[21,-20]],light);}
  else{o(24,-30,11,10,fur);o(26,-32,8,7,light);o(23,-32,5,4,'#a16e4f');r(19,-28,7,7,fur);}
  const leg=(x,offset,far)=>{const swing=Math.sin(phase+offset)*pace*4,lift=Math.max(0,Math.cos(phase+offset))*pace*2+(care==='paw'&&x<0&&!far?10+Math.sin(time*4):0),base=-3-settle;const lx=x+swing;
   p([[x-3,-21],[x+4,-21],[lx+3,base-lift],[lx-4,base-lift]],far?shadow:fur);r(lx-5,base-lift,10,4,far?fur:light);r(lx-5,base+3-lift,10,1,shadow);r(lx-2,base+1-lift,1,2,'#b28a65');};
  leg(-13,Math.PI,true);leg(14,0,true);o(2,-24,24,13,shadow);o(0,-27,23,13,fur);o(-8,-27,10,14,light);
  if(happy){p([[-6,-38],[16,-36],[23,-23],[15,-16],[-3,-18]],'#394b3d');r(0,-34,16,3,'#79945a');r(1,-29,19,3,'#d0ad52');r(3,-24,19,3,'#ba6051');for(let i=0;i<4;i++){r(i*5+1,-34,1,12,'#e7cb6f');r(i*5+2,-21,2,4,'#aa4b49');}p([[-10,-35],[-4,-35],[3,-18],[-3,-16]],'#68554b');r(-6,-28,4,3,'#e9d2a8');}
  else{p([[-10,-38],[14,-37],[22,-25],[16,-16],[-8,-18]],'#55463d');p([[-7,-35],[12,-34],[17,-26],[12,-20],[-6,-22]],'#786048');r(-3,-35,3,17,'#352f2d');r(-5,-29,8,6,'#c6a16a');r(-3,-27,4,2,'#554333');for(const [x,y]of[[9,-30],[13,-25],[-7,-28]])r(x,y,2,2,'#c2a06a');}
  leg(-13,0,false);leg(14,Math.PI,false);
  c.save();c.translate(-17,-34+headDip+Math.sin(phase*2)*pace*.5);
  if(happy){o(0,-8,15,16,shadow);o(-2,-10,13,14,light);o(-13,-6,6,15,fur);r(-16,-8,3,12,shadow);o(11,-5,5,13,fur);}
  else{p([[-14,-14],[-15,-31],[-5,-22],[7,-24],[15,-33],[16,-13]],shadow);p([[-11,-17],[-12,-27],[-4,-20]],'#e9c28f');p([[7,-20],[13,-29],[13,-15]],'#e9c28f');o(0,-10,15,15,fur);p([[-13,-10],[-5,-5],[1,-10],[10,-5],[12,2],[2,8],[-10,4]],light);}
  if(!back){o(-7,0,11,7,'#f3d9ae');r(-17,-3,6,4,'#443c36');r(-7,-12,3,4,'#332e2b');r(5,-12,3,4,'#332e2b');r(-7,-12,1,1,'#fff1cf');r(5,-12,1,1,'#fff1cf');r(-10,4,9,1,'#926448');if(care==='pet'||care==='play'||care==='paw')r(-5,5,4,4,'#d79494');}else{o(1,-8,13,13,fur);r(-6,-15,4,12,light);}
  if(happy){o(0,-24,25,6,'#a97b4c');p([[-23,-25],[-13,-35],[-1,-39],[13,-33],[25,-25]],'#e2bc78');p([[-17,-28],[-10,-34],[-1,-37],[13,-31],[19,-27]],'#f2d49b');for(let i=-18;i<=18;i+=6){p([[0,-38],[i,-25],[i+1,-25]],'#bf985d');}r(-21,-25,43,2,'#f6dcaa');r(-15,-26,5,2,'#be6c52');r(9,-26,5,2,'#be6c52');r(-2,-41,4,4,'#a77947');p([[0,-40],[-10,-45],[-16,-43],[-9,-39],[0,-40]],'#d4ae6e');p([[0,-40],[10,-45],[16,-43],[9,-39]],'#d4ae6e');}
  c.restore();c.restore();
 }
};
