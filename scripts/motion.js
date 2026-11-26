'use strict';
// Movement stays continuous across path nodes. Animation is driven by distance,
// rather than the global clock, so feet stop when the actor stops.
Diary.Motion = {
 damp:(from,to,rate,dt)=>from+(to-from)*(1-Math.exp(-rate*dt)),
 init(a){for(const [key,value] of Object.entries({vx:0,vy:0,speed:0,pace:0,gait:0,facing:1,idleTime:0,restBlend:0}))if(!Number.isFinite(a[key]))a[key]=value;},
 finish(a,before,dt){
  this.init(a);const dx=a.x-before.x,dy=a.y-before.y,d=Math.hypot(dx,dy);
  a.moving=d>.00001;a.vx=dt?dx/dt:0;a.vy=dt?dy/dt:0;a.pace=this.damp(a.pace,a.moving?Math.min(1,d/Math.max(dt,.001)/2.7):0,12,dt);
  if(a.moving){a.gait+=d*4.6;a.idleTime=0;const screenX=dx-dy,screenY=(dx+dy)*.5;if(Math.abs(screenX)>.0001)a.flip=screenX>0;a.back=screenY<-.001;a.facing=Math.atan2(screenY,screenX);}else a.idleTime+=dt;
  a.restBlend=this.damp(a.restBlend,a.rest?1:0,6,dt);
 },
 follow(world,a,path,dt,maxSpeed){
  this.init(a);const before={x:a.x,y:a.y};
  if(!path.length){a.speed=this.damp(a.speed,0,15,dt);this.finish(a,before,dt);return;}
  while(path.length>1&&Math.hypot(path[0].x-a.x,path[0].y-a.y)<.035)path.shift();
  // Safe line-of-sight lookahead softens turns without crossing solid corners.
  if(path.length>1&&world.clearLine(a,path[1]))path.shift();
  const end=path[path.length-1],remaining=Math.hypot(end.x-a.x,end.y-a.y);
  const desired=Math.min(maxSpeed,Math.sqrt(Math.max(0,remaining)*22));
  a.speed=this.damp(a.speed,desired,14,dt);let budget=a.speed*dt;
  for(let guard=0;guard<8&&path.length&&budget>1e-6;guard++){
   const target=path[0],dx=target.x-a.x,dy=target.y-a.y,d=Math.hypot(dx,dy);
   if(d<.025){path.shift();continue;}
   const step=Math.min(budget,d),x=a.x,y=a.y;world.move(a,dx/d*step,dy/d*step);budget-=step;
   if(Math.hypot(a.x-x,a.y-y)<1e-7){a.speed=0;break;}
   if(d-step<.025)path.shift();
  }
  if(!path.length&&remaining<.07)a.speed=0;
  this.finish(a,before,dt);
 },
 manual(world,a,sx,sy,dt){
  this.init(a);const magnitude=Math.min(1,Math.hypot(sx,sy)),dx=sx+sy,dy=sy-sx,n=Math.hypot(dx,dy)||1;
  const tx=dx/n*3.25*magnitude,ty=dy/n*3.25*magnitude;
  const oldX=a.inputVX||0,oldY=a.inputVY||0,decay=1-Math.exp(-18*dt);
  a.inputVX=this.damp(oldX,tx,18,dt);a.inputVY=this.damp(oldY,ty,18,dt);
  // Integrate the exponential velocity curve, rather than using its end value.
  const before={x:a.x,y:a.y};world.move(a,tx*dt+(oldX-tx)*decay/18,ty*dt+(oldY-ty)*decay/18);this.finish(a,before,dt);
 },
 stop(a){this.init(a);a.vx=a.vy=a.inputVX=a.inputVY=a.speed=0;a.moving=false;}
};
