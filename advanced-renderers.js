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
    clear(c);const med=M.media[o.medium],fHz=o.frequency*1000,r=M.relation(med.speed,fHz),slow=.001,field=12,loop=field/(med.speed*slow),local=t%loop,tPhysical=local*slow,crest=M.slowDistance(o.medium,local,slow);
    text(c,`${med.name}：介質固定，所以波速固定`,65,40,23);text(c,`實際聲速約 ${med.speed.toLocaleString()} m/s`,65,77,18,P.muted);
    const base=310,scale=90,px=x=>70+x/field*860,fn=x=>Math.cos(M.TAU*(x/r.wavelength-fHz*tPhysical));line(c,65,base,935,base,P.line,1,[6,7]);curve(c,fn,0,field,70,930,base,scale,med.color,3);
    dot(c,px(crest),base-scale,10,P.gold);line(c,px(crest),base-scale-28,px(crest),458,P.gold,1,[5,6]);text(c,'追蹤波峰',px(crest),base-scale-48,18,P.gold,'center');
    if(r.wavelength<=field){const x1=90,x2=x1+r.wavelength/field*860;measure(c,x1,145,x2,145,`λ＝${r.wavelength.toFixed(3)} m`,med.color);}else text(c,`λ＝${r.wavelength.toFixed(2)} m（大於目前 12 m 視窗）`,90,145,19,med.color);
    line(c,70,480,930,480,P.text,2);for(let x=0;x<=field;x++){const q=px(x);line(c,q,480,q,490,P.text,1);text(c,String(x),q,514,16,P.muted,'center');}text(c,'位置（m）',930,548,18,P.muted,'right');
    text(c,`同一慢動作比例：1 動畫秒＝1 ms｜波峰自 0 m 已走 ${crest.toFixed(2)} m`,70,570,19,P.cyan);
    text(c,`f＝${(r.f/1000).toFixed(2)} kHz　T＝${(r.T*1000).toFixed(2)} ms　λ＝${r.wavelength.toFixed(3)} m　v＝${r.v.toLocaleString()} m/s`,930,607,19,P.gold,'right');
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
  function calculator(c,t,o){
    clear(c);const speed=Number.isFinite(o.speed)?o.speed:12,frequency=Number.isFinite(o.frequency)?o.frequency:2,r=M.relation(speed,frequency),base=305,field=24,visualL=r.wavelength;line(c,70,base,930,base,P.line,1,[6,7]);curve(c,x=>Math.sin(M.TAU*(x/visualL-frequency*t)),0,field,70,930,base,100,P.cyan,4);
    text(c,'自由計算器：任選波速與頻率',65,48,23);text(c,'固定 0～24 m 空間尺；波形依設定的 v 與 f 向右傳播。',65,83,18,P.muted);if(visualL<=field)measure(c,100,145,100+visualL/field*860,145,`λ＝${visualL.toFixed(2)} m`);else text(c,`λ＝${visualL.toFixed(2)} m（超出觀察窗）`,100,145,19,P.purple);
    for(let x=0;x<=field;x+=2){const q=70+x/field*860;line(c,q,415,q,425,P.text);text(c,String(x),q,450,16,P.muted,'center');}text(c,'位置 x（m）',930,475,16,P.muted,'right');
    text(c,'v',245,490,27,P.cyan,'center');text(c,'＝',310,490,27);text(c,'f',390,490,27,P.gold,'center');text(c,'×',455,490,27);text(c,'λ',550,490,27,P.purple,'center');
    text(c,`${r.v.toFixed(2)} m/s`,245,545,20,P.cyan,'center');text(c,`${r.f.toFixed(2)} Hz`,390,545,20,P.gold,'center');text(c,`${r.wavelength.toFixed(2)} m`,550,545,20,P.purple,'center');text(c,`T＝${r.T.toFixed(3)} s`,780,520,21,P.text,'center');
  }
  function powerLabel(c,e,x,y,color=P.muted,align='center'){const scale=Math.min(1,c.displayScale||1),baseSize=Math.max(18,16/scale),expSize=Math.max(16,16/scale),font=s=>`${s}px system-ui,"Noto Sans CJK TC",sans-serif`;c.font=font(baseSize);const bw=c.measureText('10').width;c.font=font(expSize);const exponent=String(e).replace('-','−'),ew=c.measureText(exponent).width,total=bw+ew,start=align==='center'?x-total/2:align==='right'?x-total:x;c.fillStyle=color;c.textAlign='left';c.textBaseline='middle';c.font=font(baseSize);c.fillText('10',start,y+3);c.font=font(expSize);c.fillText(exponent,start+bw,y-6);}
  function visibleGradient(c,x,y,w,h){const g=c.createLinearGradient(x,0,x+w,0);[['#ef3030',0],['#ff9c35',.18],['#e6ea24',.32],['#24d65b',.48],['#00a9d6',.67],['#304cff',.82],['#8b0fff',1]].forEach(([color,stop])=>g.addColorStop(stop,color));c.fillStyle=g;c.fillRect(x,y,w,h);}
  function wavelengthColor(nm){if(nm<450)return '#8b5cff';if(nm<495)return '#3f73ff';if(nm<570)return '#35d7a0';if(nm<590)return '#d9dc37';if(nm<620)return '#ffad43';return '#ff625d';}
  function spectrum(c,t,o){
    clear(c);const logF=Number.isFinite(o.logF)?o.logF:14.7,s=M.spectrum(logF),xFor=f=>70+(Math.log10(f)-3)/19*860,xForL=l=>xFor(M.C/l),barY=122,barH=82;
    text(c,'頻率 f（Hz）向右增加 →',70,38,19,P.muted);arrow(c,70,64,930,64,P.cyan);
    for(let e=3;e<=21;e+=3){const px=xFor(10**e);line(c,px,100,px,barY,P.text,1);powerLabel(c,e,px,88);}
    const grays=['#314854','#3b505a','#455861','#52636a','#455861','#3b505a','#314854'];
    M.bands.forEach((b,i)=>{const a=xFor(b.min),z=xFor(Math.min(b.max,1e22));if(b.id==='visible')visibleGradient(c,a,barY,Math.max(4,z-a),barH);else{c.fillStyle=grays[i];c.fillRect(a,barY,Math.max(3,z-a),barH);}if(b.id!=='visible')text(c,b.name,(a+z)/2,barY+barH/2,16,P.text,'center');});
    const vis=M.bands.find(b=>b.id==='visible'),vx1=xFor(vis.min),vx2=xFor(vis.max);
    text(c,'可見光',vx1-8,barY+barH+35,16,P.text,'right');line(c,vx1,barY+barH,vx1,282,P.text,1,[5,5]);line(c,vx2,barY+barH,vx2,282,P.text,1,[5,5]);
    for(let e=-13;e<=5;e+=3){const px=xForL(10**e);if(px<65||px>935)continue;line(c,px,barY+barH,px,barY+barH+18,P.text,1);powerLabel(c,e,px,barY+barH+42);}
    text(c,'← 波長 λ（m）向左增加',930,276,18,P.muted,'right');
    const cx=xFor(s.f);line(c,cx,104,cx,286,P.gold,3);dot(c,cx,barY,7,P.gold);text(c,'目前選擇',cx,108,16,P.gold,'center');
    line(c,vx1,282,180,350,P.muted,1,[6,6]);line(c,vx2,282,820,350,P.muted,1,[6,6]);text(c,'把極窄的可見光區段展開',500,330,18,P.text,'center');visibleGradient(c,180,355,640,76);
    const marks=[[750,'紅'],[620,'橙'],[590,'黃'],[570,'綠'],[495,'藍綠'],[450,'藍'],[380,'紫']];marks.forEach(([nm,label])=>{const x=180+(750-nm)/(750-380)*640;line(c,x,431,x,444,P.text,1);text(c,String(nm),x,462,16,P.muted,'center');if([750,590,570,450,380].includes(nm))text(c,label,x,492,16,P.text,'center');});text(c,'波長（nm）',820,330,16,P.muted,'right');
    const selectedColor=s.band.id==='visible'?wavelengthColor(s.lambda*1e9):P.text;text(c,s.band.name,70,535,28,selectedColor);text(c,s.band.uses,70,574,18,P.text);text(c,'所有非可見光波段以灰階表示；真空中皆滿足 c＝fλ。',930,548,17,P.gold,'right');text(c,'拖曳上方頻率滑桿，觀察選取線與可見光展開區。',930,587,17,P.muted,'right');
  }
  function walls(c,t,o){
    clear(c);const material=M.materials[o.material]?o.material:'drywall',thickness=Number.isFinite(o.thickness)?o.thickness:1,mat=M.materials[material],signals=[['wifi24','2.4 GHz','λ 約 12.5 cm',P.cyan],['wifi5','5 GHz','λ 約 6.0 cm',P.gold]],wallW=52+thickness*50,wallL=500-wallW/2,wallR=500+wallW/2;
    text(c,`${mat.name}・厚度層級 ${thickness.toFixed(1)}×`,55,35,22);text(c,'① 穿過牆體：比較材料造成的相對能量損耗',55,76,19,P.text);
    c.fillStyle='#7b8f99';c.fillRect(wallL,98,wallW,220);for(let i=0;i<6;i++)line(c,wallL,112+i*42,wallR,96+i*42,'#a9bbc3',2);text(c,`圖示牆厚 ${wallW.toFixed(0)} px`,500,302,16,P.text,'center');
    signals.forEach(([id,label,wavelength,color],i)=>{const y=158+i*105,tr=M.transmission(material,id,thickness);rect(c,65,y-25,76,50,'#243f4c','#8ba8b4');text(c,'路由器',103,y,16,color,'center');line(c,141,y,wallL,y,color,8);line(c,wallR,y,870,y,alpha(color,.18+.82*tr),2+6*tr);rect(c,870,y-28,62,56,'#243f4c','#8ba8b4');dot(c,901,y,8+10*tr,color);text(c,`${label}　${wavelength}`,265,y-30,18,color,'center');text(c,`牆後相對強度 ${Math.round(tr*100)}%（示意）`,715,y+28,17,color,'center');for(let j=0;j<3;j++){const p=(t*.3+j/3)%1,x=141+p*760;if(x<wallL||x>wallR)dot(c,x,y,6,x<wallL?color:alpha(color,.2+.8*tr));}});
    line(c,55,332,945,332,P.line,1);text(c,'② 繞過牆角：2.4 GHz 轉入幾何陰影區的範圍較廣',55,360,19,P.text);
    const corner={x:505,y:410},router=[145,495],phone=[885,495];
    c.fillStyle='rgba(5,20,28,.22)';c.beginPath();c.moveTo(540,410);c.lineTo(945,535);c.lineTo(945,604);c.lineTo(540,565);c.closePath();c.fill();text(c,'幾何陰影區',788,582,16,P.muted,'center');
    c.save();c.fillStyle=alpha(P.cyan,.10);c.beginPath();c.moveTo(corner.x,corner.y);c.arc(corner.x,corner.y,430,-.08*Math.PI,.30*Math.PI);c.closePath();c.fill();c.fillStyle=alpha(P.gold,.10);c.beginPath();c.moveTo(corner.x,corner.y+8);c.arc(corner.x,corner.y+8,430,.02*Math.PI,.16*Math.PI);c.closePath();c.fill();c.restore();
    c.fillStyle='#7b8f99';c.fillRect(470,410,70,160);for(let i=0;i<5;i++)line(c,470,422+i*34,540,410+i*34,'#a9bbc3',2);text(c,'牆角',505,594,16,P.muted,'center');
    rect(c,82,469,92,52,'#243f4c','#8ba8b4');text(c,'路由器',128,495,16,P.text,'center');rect(c,844,469,82,52,'#243f4c','#8ba8b4');text(c,'手機',885,495,16,P.text,'center');line(c,174,495,470,495,P.muted,1,[5,6]);line(c,540,495,844,495,P.muted,1,[5,6]);
    line(c,174,495,corner.x,corner.y,P.cyan,3);line(c,174,505,corner.x,corner.y+8,P.gold,2,[7,6]);line(c,corner.x,corner.y,phone[0],phone[1],alpha(P.cyan,.9),3);line(c,corner.x,corner.y+8,phone[0],phone[1]+18,alpha(P.gold,.58),2,[7,6]);
    for(let j=0;j<5;j++){const r24=28+((t*42+j*78)%390);arc(c,corner.x,corner.y,r24,-.08,.30,P.cyan,2,Math.max(0,.9-r24/520));const r5=22+((t*42+j*58)%290);arc(c,corner.x,corner.y+8,r5,.02,.16,P.gold,1.7,Math.max(0,.78-r5/420));}
    const q=(t*.20)%1;pathDot(c,[[174,495],[corner.x,corner.y],phone],q,7,P.cyan);pathDot(c,[[174,505],[corner.x,corner.y+8],[phone[0],phone[1]+18]],q,6,alpha(P.gold,.78));text(c,'2.4 GHz：較廣的繞射扇形',575,397,17,P.cyan);text(c,'5 GHz：較窄的繞射扇形',945,429,17,P.gold,'right');
    text(c,'材料損耗、繞射與反射／多路徑共同決定室內涵蓋。',945,610,16,P.muted,'right');
  }
  function rect(c,x,y,w,h,fill,stroke){c.fillStyle=fill;c.fillRect(x,y,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.strokeRect(x,y,w,h);}}
  function arc(c,x,y,r,a0,a1,color,width=2,opacity=1){c.save();c.globalAlpha=opacity;c.beginPath();c.arc(x,y,r,a0*Math.PI,a1*Math.PI);c.strokeStyle=color;c.lineWidth=width;c.stroke();c.restore();}
  function pathDot(c,points,p,r,color){const lengths=[],total=points.slice(1).reduce((sum,point,i)=>{const d=Math.hypot(point[0]-points[i][0],point[1]-points[i][1]);lengths.push(d);return sum+d;},0);let target=p*total;for(let i=0;i<lengths.length;i++){if(target<=lengths[i]){const q=target/lengths[i],a=points[i],b=points[i+1];dot(c,a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q,r,color);return;}target-=lengths[i];}}
  function alpha(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},${a})`;}
  return {anatomy,graphs,same:sameMedium,cross:crossMedia,calculator,spectrum,walls};
})();
