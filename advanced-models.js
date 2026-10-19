(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AdvancedModels=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TAU=2*Math.PI,C=299792458,H=6.62607015e-34,Q=1.602176634e-19;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function wave(x,t,o={}){const A=o.amplitude??1,L=o.wavelength??4,f=o.frequency??.5,d=o.direction??1,phase=o.phase??0;return A*Math.sin(TAU*(x/L-d*f*t)+phase);}
  function velocity(x,t,o={}){return -(o.direction??1)*TAU*(o.frequency??.5)*(o.amplitude??1)*Math.cos(TAU*(x/(o.wavelength??4)-(o.direction??1)*(o.frequency??.5)*t)+(o.phase??0));}
  function periodicDefaults(mode){return mode==='anatomy'?{amplitude:1,wavelength:4,frequency:.5,labels:true,equilibrium:true}:{amplitude:1,wavelength:4,frequency:.5,x0:3,direction:1,traces:true};}
  const media={air:{name:'空氣（20°C）',speed:343,color:'#82d8d0'},water:{name:'水（20°C）',speed:1482,color:'#67b7e1'},steel:{name:'鋼（縱波代表值）',speed:5960,color:'#c7adff'},vacuum:{name:'真空中的光',speed:C,color:'#ff9ca6'}};
  function speedDefaults(mode){return mode==='same'?{medium:'air',frequency:2,phase:0}:mode==='cross'?{mediumA:'air',mediumB:'water',frequency:2,phase:0}:{speed:12,frequency:2};}
  function relation(v,f){return {v,f,T:1/f,wavelength:v/f};}
  function cross(o){return {a:relation(media[o.mediumA].speed,o.frequency),b:relation(media[o.mediumB].speed,o.frequency)};}
  const bands=[
    {id:'radio',name:'無線電波',min:1e3,max:3e8,color:'#6ab8e6',uses:'廣播、通訊、天文觀測'},
    {id:'microwave',name:'微波',min:3e8,max:3e11,color:'#79d7c8',uses:'Wi‑Fi、雷達、微波爐'},
    {id:'infrared',name:'紅外線',min:3e11,max:4e14,color:'#e8a96c',uses:'遙控器、熱像、加熱'},
    {id:'visible',name:'可見光',min:4e14,max:7.5e14,color:'#f3d66e',uses:'視覺、照明、光纖'},
    {id:'ultraviolet',name:'紫外線',min:7.5e14,max:3e16,color:'#aa8cf2',uses:'消毒、螢光、光化學'},
    {id:'xray',name:'X 射線',min:3e16,max:3e19,color:'#be9ee9',uses:'醫學影像、材料檢查'},
    {id:'gamma',name:'γ 射線',min:3e19,max:1e22,color:'#ef9ebc',uses:'核醫、放射治療、天文'}
  ];
  function bandAt(f){return bands.find(b=>f>=b.min&&f<b.max)||bands.at(-1);}
  function spectrum(logF){const f=10**clamp(logF,3,22),lambda=C/f,joules=H*f;return {f,lambda,joules,eV:joules/Q,band:bandAt(f)};}
  const materials={drywall:{name:'乾牆／石膏板',loss:{wifi24:.34,wifi5:.62,visible:8}},wood:{name:'木門',loss:{wifi24:.43,wifi5:.78,visible:9}},glass:{name:'一般透明玻璃',loss:{wifi24:.18,wifi5:.28,visible:.12}},concrete:{name:'混凝土牆',loss:{wifi24:1.05,wifi5:1.8,visible:10}}};
  function transmission(material,signal,thickness){return Math.exp(-materials[material].loss[signal]*thickness);}
  return {TAU,C,H,Q,clamp,wave,velocity,periodicDefaults,media,speedDefaults,relation,cross,bands,bandAt,spectrum,materials,transmission};
});
