/* Chapter 02: deterministic models; distances in m for energy, illustrative for particles. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ClassificationModels=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TAU=2*Math.PI,C=299792458,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function defaults(mode){return mode==='medium'?{material:'air',air:1,temp:20,ice:0,view:'both',action:null,pulse:0}:mode==='direction'?{kind:'both',direction:1,amplitude:1,frequency:.65}:mode==='energy'?{kind:'travel',layout:'overlay',a1:1,a2:1,f1:.75,f2:.75,phase:0,resultOnly:false}: {shape:'pulse',direction:1,amplitude:1,frequency:.55,count:41,ghosts:true,arrows:true};}
  function medium(o){
    const air=clamp(o.air,0,1),T=clamp(o.temp,0,20);
    const phase=o.material==='air'?(air<=0?'vacuum':'air'):o.ice>=1?'ice':o.ice>0?'mixture':'water';
    // UNESCO/Chen–Millero pure-water term, surface-pressure approximation, 0–20°C.
    const water=1402.388+5.03830*T-.0581090*T*T+.00033432*T**3-.00000147797*T**4+.0000000031419*T**5;
    const sound=phase==='vacuum'||phase==='mixture'?null:phase==='air'?343:phase==='ice'?3800:water;
    const n=phase==='vacuum'?1:phase==='air'?1+.00027*air:phase==='ice'?1.31:phase==='mixture'?null:1.333;
    const light=n===null?null:C/n;
    return {phase,sound,light,n,signal:phase==='vacuum'?0:phase==='air'?Math.sqrt(air):1,soundTime:sound===null?null:1/sound,lightTime:light===null?null:1/light};
  }
  function environment(o,dt){
    if(o.action==='pump'){o.air=Math.max(0,o.air-dt*.35);if(o.air<1e-10){o.air=0;o.action=null;}}
    if(o.action==='cool'){
      if(o.temp>0)o.temp=Math.max(0,o.temp-dt*8);
      else if(o.ice<1)o.ice=Math.min(1,o.ice+dt*.5);
      else{o.temp=Math.max(-10,o.temp-dt*5);if(o.temp===-10)o.action=null;}
    }
  }
  function direction(x,t,o,longitudinal){const k=TAU*o.frequency/2.5,w=TAU*o.frequency,p=k*x-o.direction*w*t,a=(longitudinal?.18:.65)*o.amplitude;return {x:x+(longitudinal?a*Math.sin(p):0),y:longitudinal?0:a*Math.sin(p),vx:longitudinal?-o.direction*w*a*Math.cos(p):0,vy:longitudinal?0:-o.direction*w*a*Math.cos(p)};}
  const length=8,speed=2;
  const launched=(s,f)=>s<=0?0:Math.sin(TAU*f*s)*Math.min(1,s*f*2);
  function energy(x,t,o){
    let incident,reflected;
    if(o.kind==='reflection'){
      incident=o.a1*launched(t-x/speed,o.f1);
      reflected=-o.a1*launched(t-(2*length-x)/speed,o.f1);
    }else{
      incident=o.a1*Math.sin(TAU*o.f1*(x/speed-t));
      reflected=o.kind==='custom'?o.a2*Math.sin(TAU*o.f2*(x/speed+t)+o.phase*Math.PI/180):0;
    }
    return {incident,reflected,sum:incident+reflected};
  }
  function standing(o,t){return o.kind==='reflection'?t>=2*length/speed+1/o.f1:o.kind==='custom'&&Math.abs(o.a1-o.a2)<1e-9&&Math.abs(o.f1-o.f2)<1e-9;}
  function nodes(o,t){if(!standing(o,t))return [];const k=TAU*o.f1/speed,shift=o.kind==='reflection'?-k*length:o.phase*Math.PI/360;const result=[];for(let j=-20;j<40;j++){const x=(j*Math.PI-shift)/k;if(x>=-1e-8&&x<=length+1e-8)result.push(clamp(x,0,length));}return result;}
  function particle(x,t,o){
    const d=Number(o.direction),a=o.amplitude;
    if(o.shape==='sine'){const w=TAU*o.frequency,k=w/1.2,p=k*x-d*w*t;return {x,y:a*Math.sin(p),vx:0,vy:-d*w*a*Math.cos(p)};}
    // The pulse wraps only beyond the visible field. Particle identities never wrap.
    const q=((t*1.2+4)%18+18)%18,center=d===1?q-2:12-q,sigma=.7;
    const y=a*Math.exp(-(((x-center)/sigma)**2)/2);
    return {x,y,vx:0,vy:y*(x-center)*d*1.2/(sigma*sigma),center};
  }
  return {TAU,C,defaults,medium,environment,direction,energy,standing,nodes,particle,length,speed};
});
