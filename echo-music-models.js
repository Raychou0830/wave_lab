/* Pure physics/audio models for chapters 06–07. */
(function(root){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const NOTES={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00};
  const HARMONICS={
    fork:[1,.035,.012,.006],
    flute:[1,.22,.08,.035,.018,.01],
    clarinet:[1,.055,.46,.035,.25,.025,.13],
    violin:[1,.68,.52,.41,.31,.23,.18,.13],
    guitar:[1,.62,.43,.31,.22,.16,.11,.08]
  };
  function boat(speed,initialDistance=1800,soundSpeed=340){
    speed=clamp(Number(speed)||0,0,soundSpeed-1);initialDistance=Math.max(1,Number(initialDistance)||1800);
    const outboundTime=initialDistance/soundSpeed,totalTime=2*initialDistance/(soundSpeed+speed),shipTravelTotal=speed*totalTime;
    return {speed,totalTime,soundSpeed,initialDistance,outboundTime,shipBeforeReflection:speed*outboundTime,shipTravelTotal,distanceAtReflection:initialDistance-speed*outboundTime,distanceAtReception:initialDistance-shipTravelTotal};
  }
  function bat(speed,distance,soundSpeed=310,reactionTime=.3){
    speed=clamp(Number(speed)||1,.01,soundSpeed-1);distance=Math.max(.01,Number(distance)||1);
    const echoTime=2*distance/(soundSpeed+speed),collisionTime=distance/speed,actionTime=echoTime+reactionTime;
    const minimumDistance=speed*reactionTime*(soundSpeed+speed)/(soundSpeed-speed);
    return {speed,distance,soundSpeed,reactionTime,echoTime,collisionTime,actionTime,minimumDistance,safe:actionTime<collisionTime-1e-9};
  }
  function sphere(distance,power=1){distance=Math.max(.01,Number(distance)||1);return {distance,area:4*Math.PI*distance*distance,intensity:power/(4*Math.PI*distance*distance),relativeIntensity:1/(distance*distance)};}
  function sweepFrequency(phase,start=100,end=20000,knee=1500,slowShare=.78){phase=((Number(phase)||0)%1+1)%1;start=Math.max(20,start);end=Math.max(start,end);knee=clamp(knee,start,end);if(phase<=slowShare)return start*Math.pow(knee/start,phase/slowShare);const q=(phase-slowShare)/(1-slowShare);return knee*Math.pow(end/knee,q);}
  function shepardVoices(phase,count=5,low=220,octaves=5){const center=low*Math.pow(2,octaves/2),sigma=1.15;return Array.from({length:count},(_,i)=>{const q=((phase+i/count)%1+1)%1,f=low*Math.pow(2,octaves*q),d=Math.log2(f/center),gain=Math.exp(-.5*(d/sigma)**2);return {frequency:f,gain,q};});}
  function waveSum(phase,harmonics){let y=0,norm=0;harmonics.forEach((a,i)=>{y+=a*Math.sin((i+1)*phase);norm+=Math.abs(a);});return norm?y/norm:0;}
  function nearestNote(f){let best='C4',delta=Infinity;Object.keys(NOTES).forEach(n=>{const d=Math.abs(1200*Math.log2(f/NOTES[n]));if(d<delta){delta=d;best=n;}});return {name:best,cents:1200*Math.log2(f/NOTES[best])};}
  const api={clamp,NOTES,HARMONICS,boat,bat,sphere,sweepFrequency,shepardVoices,waveSum,nearestNote};
  root.EchoMusicModels=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
