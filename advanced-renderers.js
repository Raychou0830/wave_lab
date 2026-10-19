var AdvancedRenderers=(function(){
  'use strict';const M=AdvancedModels,P={bg:'#102632',text:'#d9e9ef',muted:'#9db5bf',cyan:'#69d9d0',gold:'#f3c567',red:'#ff9ca6',purple:'#c8adff',line:'#385361'};
  function text(c,s,x,y,size=19,color=P.text,align='left'){c.font=`${Math.max(size,16/Math.min(1,c.displayScale||1))}px system-ui,"Noto Sans CJK TC",sans-serif`;c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);}
  function line(c,x,y,xx,yy,color=P.line,width=1,dash=[]){c.beginPath();c.setLineDash(dash);c.moveTo(x,y);c.lineTo(xx,yy);c.strokeStyle=color;c.lineWidth=width;c.stroke();c.setLineDash([]);}
  function arrow(c,x,y,xx,yy,color=P.cyan,double=false){line(c,x,y,xx,yy,color,2.5);const a=Math.atan2(yy-y,xx-x),tip=(px,py,b)=>{c.beginPath();c.moveTo(px,py);c.lineTo(px-10*Math.cos(b-.45),py-10*Math.sin(b-.45));c.lineTo(px-10*Math.cos(b+.45),py-10*Math.sin(b+.45));c.closePath();c.fillStyle=color;c.fill();};tip(xx,yy,a);if(double)tip(x,y,a+Math.PI);}
  function dot(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,M.TAU);c.fillStyle=color;c.fill();}
  function clear(c){c.clearRect(0,0,1000,620);c.fillStyle=P.bg;c.fillRect(0,0,1000,620);}
  function curve(c,fn,x0,x1,px0,px1,base,scale,color=P.cyan,width=3,dash=[]){c.beginPath();for(let i=0;i<=500;i++){const x=x0+(x1-x0)*i/500,y=base-scale*fn(x),px=px0+(px1-px0)*i/500;if(i)c.lineTo(px,y);else c.moveTo(px,y);}c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
  function measure(c,x,y,xx,yy,label,color=P.gold){arrow(c,x,y,xx,yy,color,true);text(c,label,(x+xx)/2,(y+yy)/2-20,20,color,'center');}
  function anatomy(c,t,o){
    clear(c);const base=315,scale=105,px=x=>80+x*105,fn=x=>M.wave(x,t,o);text(c,'一張空間快照：同一時刻，各位置的位移',65,42,22);line(c,70,base,940,base,P.line,2,[7,7]);
    curve(c,fn,0,8,80,920,base,scale,P.cyan,4);for(let x=0;x<=8;x+=.25)dot(c,px(x),base-scale*fn(x),3.5,P.cyan);
    const L=o.wavelength,A=o.amplitude,phase=o.frequency*t,crest=((L/4+phase*L)%L+L)%L;
    const features=[];for(let k=-2;k<5;k++){const cr=crest+k*L,tr=cr+L/2;if(cr>=0&&cr<=8)features.push([cr,'波峰']);if(tr>=0&&tr<=8)features.push([tr,'波谷']);}
    if(o.labels)for(const [x,l] of features){const y=base-scale*fn(x);dot(c,px(x),y,8,l==='波峰'?P.gold:P.red);text(c,l,px(x),y+(l==='波峰'?-30:30),18,l==='波峰'?P.gold:P.red,'center');}
    if(o.equilibrium){for(let k=-4;k<12;k++){const x=(phase*L+k*L/2);if(x>=0&&x<=8){dot(c,px(x),base,6,P.purple);}}text(c,'紫色點：平衡位置（位移為 0）',920,70,18,P.purple,'right');}
    const mStart=crest<1?crest+L:crest,mEnd=mStart+L;if(mEnd<=8)measure(c,px(mStart),120,px(mEnd),120,`波長 λ＝${L.toFixed(1)} m`);
    measure(c,850,base,850,base-scale*A,`振幅 A＝${A.toFixed(1)} m`,P.gold);
    text(c,'波峰到相鄰波峰、波谷到相鄰波谷，或同相位點到下一個同相位點，都是一個波長。',65,525,18,P.muted);
    text(c,`平衡→峰→平衡→谷→平衡的鉛直變化量合計 4A；波長仍是水平距離。`,65,574,19,P.gold);
  }
  function graphs(c,t,o){
    clear(c);const left={x:65,w:410,base:275},right={x:555,w:380,base:275},scale=95,T=1/o.frequency;
    text(c,'x–y 圖：固定此刻，查看各位置',65,38,21);text(c,'y–t 圖：固定 A 點，查看不同時刻',555,38,21);
    line(c,left.x,left.base,left.x+left.w,left.base,P.line,2);line(c,right.x,right.base,right.x+right.w,right.base,P.line,2);
    text(c,'x',left.x+left.w+12,left.base,18,P.muted);text(c,'y',left.x-15,90,18,P.muted);text(c,'t',right.x+right.w+12,right.base,18,P.muted);text(c,'y',right.x-15,90,18,P.muted);
    curve(c,x=>M.wave(x,t,o),0,8,left.x,left.x+left.w,left.base,scale,P.cyan,3.5);
    const ax=left.x+o.x0/8*left.w,ay=left.base-scale*M.wave(o.x0,t,o);line(c,ax,85,ax,430,P.gold,1,[5,7]);dot(c,ax,ay,9,P.gold);text(c,'A',ax,ay-27,21,P.gold,'center');
    const windowT=2*T,start=t-windowT*.72,end=start+windowT;curve(c,tt=>M.wave(o.x0,tt,o),start,end,right.x,right.x+right.w,right.base,scale,P.purple,3.5);
    const nowx=right.x+(t-start)/(end-start)*right.w,nowy=right.base-scale*M.wave(o.x0,t,o);line(c,nowx,85,nowx,430,P.gold,1,[5,7]);dot(c,nowx,nowy,9,P.gold);text(c,'現在',nowx,455,18,P.gold,'center');
    measure(c,left.x+20,495,left.x+20+o.wavelength/8*left.w,495,`λ＝${o.wavelength.toFixed(2)} m`,P.cyan);
    measure(c,right.x+25,495,right.x+25+T/(end-start)*right.w,495,`T＝${T.toFixed(2)} s`,P.purple);
    text(c,`A 點 x＝${o.x0.toFixed(1)} m｜此刻位移 y＝${M.wave(o.x0,t,o).toFixed(2)} m｜頻率 f＝${o.frequency.toFixed(2)} Hz`,500,568,19,P.text,'center');
  }
  function sameMedium(c,t,o){
    clear(c);const med=M.media[o.medium],r=M.relation(med.speed,o.frequency),displayV=3,displayL=displayV/o.frequency;
    text(c,`${med.name}：介質固定，所以波速固定`,65,40,23);text(c,`實際聲速約 ${med.speed.toLocaleString()} m/s`,65,77,18,P.muted);
    const base=310,scale=100,fn=x=>Math.sin(M.TAU*(x/displayL-o.frequency*t));line(c,65,base,935,base,P.line,1,[6,7]);curve(c,fn,0,12,70,930,base,scale,med.color,4);
    const first=(o.frequency*t*displayL)%displayL;for(let x=first;x<12;x+=displayL)dot(c,70+x/12*860,base,5,P.gold);
    const x1=110,x2=x1+displayL/12*860;measure(c,x1,145,x2,145,`波長 λ ∝ 1/f`);
    arrow(c,650,515,900,515,P.cyan);text(c,'波形傳播方向',775,552,18,P.cyan,'center');
    text(c,`f＝${r.f.toFixed(2)} Hz　T＝${r.T.toFixed(3)} s　λ＝${r.wavelength.toFixed(1)} m　v＝fλ＝${r.v.toLocaleString()} m/s`,500,592,20,P.gold,'center');
  }
  function crossMedia(c,t,o){
    clear(c);const r=M.cross(o),A=M.media[o.mediumA],B=M.media[o.mediumB],split=500,base=310,scale=90,visualScale=Math.max(r.a.wavelength,r.b.wavelength)*1.15;
    c.fillStyle='#173340';c.fillRect(55,100,445,390);c.fillStyle='#1a4051';c.fillRect(500,100,445,390);line(c,split,100,split,490,'#d8e8ee',3);
    text(c,A.name,275,62,21,A.color,'center');text(c,B.name,725,62,21,B.color,'center');text(c,'介面',500,520,18,P.muted,'center');
    const kA=M.TAU*visualScale/r.a.wavelength,kB=M.TAU*visualScale/r.b.wavelength,w=M.TAU*o.frequency;
    curve(c,x=>Math.sin(kA*x-w*t),0,1,70,500,base,scale,A.color,4);curve(c,x=>Math.sin(kB*x-w*t),0,1,500,930,base,scale,B.color,4);
    dot(c,500,base-scale*Math.sin(-w*t),8,P.gold);measure(c,95,145,95+430*(A.speed/o.frequency)/visualScale,145,`λ₁＝${r.a.wavelength.toFixed(1)} m`,A.color);measure(c,535,145,535+430*(B.speed/o.frequency)/visualScale,145,`λ₂＝${r.b.wavelength.toFixed(1)} m`,B.color);
    text(c,`頻率跨越介面保持 ${o.frequency.toFixed(2)} Hz；週期保持 ${(1/o.frequency).toFixed(3)} s`,500,565,20,P.gold,'center');
  }
  function calculator(c,o){
    clear(c);const speed=Number.isFinite(o.speed)?o.speed:12,frequency=Number.isFinite(o.frequency)?o.frequency:2,r=M.relation(speed,frequency),base=305,visualV=3,visualL=visualV/frequency;line(c,70,base,930,base,P.line,1,[6,7]);curve(c,x=>Math.sin(M.TAU*(x/visualL)),0,12,70,930,base,100,P.cyan,4);
    text(c,'自由計算器：任選波速與頻率',65,48,23);text(c,'圖形保持在觀察窗內；下方數值才是設定的物理量。',65,83,18,P.muted);measure(c,100,145,100+visualL/12*860,145,'一個波長 λ');
    text(c,'v',245,490,27,P.cyan,'center');text(c,'＝',310,490,27);text(c,'f',390,490,27,P.gold,'center');text(c,'×',455,490,27);text(c,'λ',550,490,27,P.purple,'center');
    text(c,`${r.v.toFixed(2)} m/s`,245,545,20,P.cyan,'center');text(c,`${r.f.toFixed(2)} Hz`,390,545,20,P.gold,'center');text(c,`${r.wavelength.toFixed(2)} m`,550,545,20,P.purple,'center');text(c,`T＝${r.T.toFixed(3)} s`,780,520,21,P.text,'center');
  }
  function fmt(v,unit){const e=Math.floor(Math.log10(Math.abs(v)));return e>=4||e<=-3?`${(v/10**e).toFixed(2)} × 10^${String(e).replace('-','−')} ${unit}`:`${v.toPrecision(4)} ${unit}`;}
  function spectrum(c,o){
    clear(c);const logF=Number.isFinite(o.logF)?o.logF:14.7,s=M.spectrum(logF),xFor=f=>70+(Math.log10(f)-3)/19*860;
    text(c,'低頻率・長波長',70,45,19,P.muted);text(c,'高頻率・短波長・高單一光子能量',930,45,19,P.muted,'right');arrow(c,70,80,930,80,P.cyan);
    for(const b of M.bands){const a=xFor(b.min),z=xFor(Math.min(b.max,1e22));c.fillStyle=b.color;c.globalAlpha=.82;c.fillRect(a,145,Math.max(3,z-a),90);c.globalAlpha=1;const y=b.id==='visible'?258:b.id==='ultraviolet'?292:268;text(c,b.id==='visible'?'可見':b.name,(a+z)/2,y,16,b.color,'center');}
    const cx=xFor(s.f);line(c,cx,105,cx,335,P.gold,4);dot(c,cx,145,8,P.gold);text(c,'目前選擇',cx,116,18,P.gold,'center');
    for(let e=3;e<=22;e++){const px=xFor(10**e);line(c,px,235,px,244,P.text,1);if(e%2===1)text(c,`10^${e}`,px,323,16,P.muted,'center');}
    text(c,'頻率（Hz，對數刻度）',500,358,18,P.muted,'center');
    text(c,s.band.name,70,408,30,s.band.color);text(c,s.band.uses,70,450,19,P.text);text(c,`頻率　${fmt(s.f,'Hz')}`,70,505,20);text(c,`波長　${fmt(s.lambda,'m')}`,510,505,20);text(c,`光子能量　${fmt(s.eV,'eV')}`,70,558,20);text(c,'所有電磁波在真空中的速率皆為 c',930,600,18,P.gold,'right');
  }
  function walls(c,o){
    clear(c);const material=M.materials[o.material]?o.material:'drywall',thickness=Number.isFinite(o.thickness)?o.thickness:1,mat=M.materials[material],signals=[['wifi24','2.4 GHz Wi‑Fi','#69d9d0'],['wifi5','5 GHz Wi‑Fi','#f3c567'],['visible','可見光（約 550 nm）','#ff9ca6']];
    text(c,`${mat.name}：厚度層級 ${thickness.toFixed(1)}×`,65,45,23);text(c,'光源／路由器',125,560,18,P.muted,'center');text(c,'接收器',870,560,18,P.muted,'center');
    c.fillStyle='#7b8f99';c.fillRect(455,95,90,410);for(let i=0;i<6;i++)line(c,455,110+i*67,545,90+i*67,'#a9bbc3',2);
    signals.forEach(([id,label,color],i)=>{const y=165+i*135,tr=M.transmission(material,id,thickness),end=455+390*tr;rect(c,75,y-29,90,58,'#243f4c','#8ba8b4');text(c,i<2?'Wi‑Fi':'燈',120,y,19,color,'center');line(c,165,y,455,y,color,9);line(c,545,y,end,y,color,9);rect(c,845,y-35,70,70,'#243f4c','#8ba8b4');dot(c,880,y,10+12*tr,color);text(c,label,280,y-32,18,color,'center');text(c,`${Math.round(tr*100)}%（示意）`,700,y+32,18,color,'center');});
    text(c,'牆後強度採教學用相對衰減，不是建築材料的實測百分比。',65,600,18,P.muted);
  }
  function rect(c,x,y,w,h,fill,stroke){c.fillStyle=fill;c.fillRect(x,y,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.strokeRect(x,y,w,h);}}
  return {anatomy,graphs,same:sameMedium,cross:crossMedia,calculator,spectrum,walls};
})();
