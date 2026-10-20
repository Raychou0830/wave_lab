/* Pure physics/audio models for chapters 06–07. */
(function(root){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const NOTES={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00};
  const HARMONICS={
    fork:[1,.035,.012,.006],
    flute:[1,.22,.08,.035,.018,.01],
    clarinet:[1,.055,.46,.035,.25,.025,.13],
    violin:[1,.68,.52,.41,.31,.23,.18,.13]
  };
  function boat(speed,totalTime=10,soundSpeed=340){
    speed=clamp(Number(speed)||0,0,soundSpeed-1);totalTime=Math.max(.1,Number(totalTime)||10);
    const initialDistance=(soundSpeed+speed)*totalTime/2;
    const outboundTime=initialDistance/soundSpeed;
    return {speed,totalTime,soundSpeed,initialDistance,outboundTime,shipBeforeReflection:speed*outboundTime,distanceAtReflection:initialDistance-speed*outboundTime,distanceAtReception:initialDistance-speed*totalTime};
  }
  function bat(speed,distance,soundSpeed=310,reactionTime=.3){
    speed=clamp(Number(speed)||1,.01,soundSpeed-1);distance=Math.max(.01,Number(distance)||1);
    const echoTime=2*distance/(soundSpeed+speed),collisionTime=distance/speed,actionTime=echoTime+reactionTime;
    const minimumDistance=speed*reactionTime*(soundSpeed+speed)/(soundSpeed-speed);
    return {speed,distance,soundSpeed,reactionTime,echoTime,collisionTime,actionTime,minimumDistance,safe:actionTime<collisionTime-1e-9};
  }
  function sphere(distance,power=1){distance=Math.max(.01,Number(distance)||1);return {distance,area:4*Math.PI*distance*distance,intensity:power/(4*Math.PI*distance*distance),relativeIntensity:1/(distance*distance)};}
  function waveSum(phase,harmonics){let y=0,norm=0;harmonics.forEach((a,i)=>{y+=a*Math.sin((i+1)*phase);norm+=Math.abs(a);});return norm?y/norm:0;}
  function nearestNote(f){let best='C4',delta=Infinity;Object.keys(NOTES).forEach(n=>{const d=Math.abs(1200*Math.log2(f/NOTES[n]));if(d<delta){delta=d;best=n;}});return {name:best,cents:1200*Math.log2(f/NOTES[best])};}
  const api={clamp,NOTES,HARMONICS,boat,bat,sphere,waveSum,nearestNote};
  root.EchoMusicModels=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
