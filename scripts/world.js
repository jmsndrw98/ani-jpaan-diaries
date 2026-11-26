'use strict';
Diary.World = class {
 constructor(chapter){this.chapter=chapter;this.size=24;this.objects=Diary.OBJECTS.map(x=>({...x}));this.props=[];this.blocked=new Set();this.build();}
 key(x,y){return Math.round(x)+','+Math.round(y)}
 water(x,y){return this.chapter===1?(x>=20&&y<17):(this.chapter===2?(x>=20||y<2):(y>=22));}
 path(x,y){return Math.abs(x-11)<=1||Math.abs(y-11)<=1||((y===9||y===10)&&x>=7&&x<=18)||((y>=14&&y<=17)&&x>=7&&x<=18)||((x===18||x===19)&&y>=16&&y<=20)||y===12&&x>=3&&x<=10;}
 add(type,x,y,extra={}){this.props.push({type,x,y,...extra});if(extra.block!==false)this.blocked.add(this.key(x,y));}
 build(){
  for(let x=0;x<this.size;x++)for(let y=0;y<this.size;y++)if(this.water(x,y))this.blocked.add(this.key(x,y));
  if(this.chapter===0){this.building(5,5,4,3,'shrine');this.building(16,5,4,3,'tea');this.building(4,15,3,3,'shop');this.add('torii',8,8,{block:false});}
  if(this.chapter===1){this.building(16,5,3,3,'picnic');this.building(4,15,3,3,'shop');for(const [x,y]of[[5,5],[7,5],[6,7]])this.add('deer',x,y);}
  if(this.chapter===2){this.building(5,5,4,3,'view');this.building(16,5,4,3,'ryokan');this.building(4,15,3,3,'shop');}
  if(this.chapter===3){this.building(5,5,4,3,'festival');this.building(16,5,4,3,'festival');this.building(4,15,3,3,'shop');for(let x=7;x<19;x+=3)this.add('lantern',x,10,{block:false});}
  this.building(19,20,3,2,'station');
  this.add('bench',17,15,{block:false});this.add('tree',18,14,{variant:0});this.add('stone',3,12,{block:false});
  if(this.chapter===0||this.chapter===2)for(const [x,y]of[[3,9],[4,9],[3,10],[20,11]])this.add('bamboo',x,y);
  for(let x=1;x<23;x++)for(let y=2;y<22;y++){
   if(this.water(x,y)||this.path(x,y)||this.blocked.has(this.key(x,y)))continue;
   const near=this.objects.some(o=>Math.hypot(x-o.tx,y-o.ty)<2.3||Math.hypot(x-o.x,y-o.y)<2.2);
   if(near)continue;const r=Diary.hash(x,y,this.chapter);
   if(r>.86)this.add('tree',x,y,{variant:Math.floor(r*50)});else if(r<.055)this.add('rock',x,y);else if(r<.20)this.add('flowers',x,y,{block:false});
  }
  for(const [x,y]of[[9,8],[14,8],[8,14],[14,18],[16,18],[5,12]])this.add('lantern',x,y,{block:false});
  for(let x=2;x<20;x+=2){if(!this.blocked.has(this.key(x,21)))this.add('fence',x,21,{block:false});}
  if(this.chapter===1){this.add('bridge',20,17,{block:false});for(let x=19;x<24;x++)for(let y=17;y<20;y++)this.blocked.delete(this.key(x,y));}
  // Keep destinations and the arrival point reachable, independent of decoration.
  for(const o of this.objects)for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)this.blocked.delete(this.key(o.tx+dx,o.ty+dy));
  for(const [x,y]of[[12,15],[13,16],[12,16]])this.blocked.delete(this.key(x,y));
 }
 building(x,y,w,h,kind){this.props.push({type:'building',x,y,w,h,kind});for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)this.blocked.add(this.key(a,b));}
 walkable(x,y){return x>=.5&&y>=.5&&x<23&&y<22&&!this.blocked.has(this.key(x,y));}
 nearest(x,y){x=Math.max(1,Math.min(22,Math.round(x)));y=Math.max(1,Math.min(21,Math.round(y)));if(this.walkable(x,y))return{x,y};for(let r=1;r<7;r++)for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)if(this.walkable(x+dx,y+dy))return{x:x+dx,y:y+dy};return null;}
 findPath(start,end){
  const a=this.nearest(start.x,start.y),b=this.nearest(end.x,end.y);if(!a||!b)return[];const key=p=>p.x+','+p.y;
  const open=[{...a,g:0,f:0}],came=new Map(),score=new Map([[key(a),0]]),closed=new Set();let endKey=null;
  while(open.length){open.sort((a,b)=>a.f-b.f);const p=open.shift(),pk=key(p);if(closed.has(pk))continue;if(p.x===b.x&&p.y===b.y){endKey=pk;break}closed.add(pk);
   for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){
    if(!dx&&!dy)continue;const nx=p.x+dx,ny=p.y+dy;if(!this.walkable(nx,ny)||dx&&dy&&(!this.walkable(p.x+dx,p.y)||!this.walkable(p.x,p.y+dy)))continue;
    const nk=nx+','+ny,g=p.g+(dx&&dy?1.414:1);if(g>=(score.get(nk)??Infinity))continue;
    score.set(nk,g);came.set(nk,pk);open.push({x:nx,y:ny,g,f:g+Math.hypot(b.x-nx,b.y-ny)});
   }
  }
  if(!endKey)return[];const path=[];let k=endKey;while(k!==key(a)){const [x,y]=k.split(',').map(Number);path.unshift({x,y});k=came.get(k);if(!k)return[];}return path;
 }
 move(actor,dx,dy){const pad=.12;if(this.walkable(actor.x+dx+Math.sign(dx)*pad,actor.y))actor.x+=dx;if(this.walkable(actor.x,actor.y+dy+Math.sign(dy)*pad))actor.y+=dy;}
};
