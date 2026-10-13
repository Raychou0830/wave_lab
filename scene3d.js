/* Dependency-free 3D camera and depth-sorted geometry for offline teaching. */
(function(root){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function viewDefault(mode){
    return {yaw:mode==='gravity'?-35:-32,pitch:mode==='gravity'?46:24,zoom:.9};
  }
  function preset(mode,name){
    if(name==='front')return {yaw:0,pitch:0,zoom:.9};
    if(name==='side')return {yaw:90,pitch:0,zoom:.9};
    if(name==='top')return {yaw:0,pitch:80,zoom:.9};
    return viewDefault(mode);
  }
  function rotate(view,dx,dy){view.yaw=((view.yaw+dx*.35+180)%360+360)%360-180;view.pitch=clamp(view.pitch+dy*.3,-80,80);}
  function zoom(view,delta){view.zoom=clamp(view.zoom*Math.exp(-delta*.001),.5,1);}
  function camera(view,center,bounds,box,envelope=null){
    const yaw=view.yaw*Math.PI/180,pitch=view.pitch*Math.PI/180;
    const right=[Math.cos(yaw),0,-Math.sin(yaw)];
    const up=[-Math.sin(yaw)*Math.sin(pitch),Math.cos(pitch),-Math.cos(yaw)*Math.sin(pitch)];
    const toward=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)];
    let radius=0;
    for(const x of bounds.x)for(const y of bounds.y)for(const z of bounds.z)radius=Math.max(radius,Math.hypot(x-center[0],y-center[1],z-center[2]));
    const distance=radius*3.4;
    const raw=(x,y,z)=>{
      const p=[x-center[0],y-center[1],z-center[2]];
      const dot=v=>v[0]*p[0]+v[1]*p[1]+v[2]*p[2];
      const depth=distance-dot(toward),perspective=distance/depth;
      return [dot(right)*perspective,-dot(up)*perspective,depth];
    };
    const corners=[];
    if(envelope)for(const point of envelope)corners.push(raw(...point));
    else for(const x of bounds.x)for(const y of bounds.y)for(const z of bounds.z)corners.push(raw(x,y,z));
    const xs=corners.map(p=>p[0]),ys=corners.map(p=>p[1]);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const scale=Math.min((box.right-box.left)/Math.max(maxX-minX,.01),(box.bottom-box.top)/Math.max(maxY-minY,.01))*clamp(view.zoom,.5,1);
    const cx=(box.left+box.right)/2,cy=(box.top+box.bottom)/2;
    const project=(x,y,z)=>{const p=raw(x,y,z);return [cx+(p[0]-(minX+maxX)/2)*scale,cy+(p[1]-(minY+maxY)/2)*scale,p[2]];};
    project.direction=(x,y,z)=>[x*right[0]+y*right[1]+z*right[2],-(x*up[0]+y*up[1]+z*up[2])];
    project.facing=(x,y,z)=>x*toward[0]+y*toward[1]+z*toward[2];
    project.scale=scale;
    return project;
  }
  function polygon(ctx,points,fill,stroke=null,width=.6){
    ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
  }
  function paint(ctx,items){
    items.sort((a,b)=>b.depth-a.depth);
    for(const item of items){
      if(item.draw)item.draw(ctx);
      else if(item.points.length>=3)polygon(ctx,item.points,item.fill,item.stroke,item.width);
      else{ctx.beginPath();ctx.moveTo(item.points[0][0],item.points[0][1]);ctx.lineTo(item.points[1][0],item.points[1][1]);ctx.strokeStyle=item.stroke;ctx.lineWidth=item.width||1;ctx.stroke();}
    }
  }
  function item(points,fill,stroke,width){return {points,fill,stroke,width,depth:points.reduce((s,p)=>s+p[2],0)/points.length};}
  const api={viewDefault,preset,rotate,zoom,camera,paint,item,clamp};root.Wave3D=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
