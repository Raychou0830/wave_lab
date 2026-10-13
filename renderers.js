(function (root) {
  'use strict';
  const M = root.WaveModels;
  const D = root.Wave3D;
  const C = { bg: '#102632', grid: '#b5d4dd18', rest: '#a6bdc83d', aqua: '#69d9d0', gold: '#f3c567', text: '#d2e8ed', muted: '#9bb7c4', red: '#ff8b9a', purple: '#c8b1f1' };
  const font = '"Noto Sans CJK TC", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  function line(ctx, points, color = C.aqua, width = 1.5, dash = []) {
    if (!points.length) return;
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.moveTo(...points[0]); for (let i = 1; i < points.length; i++) ctx.lineTo(...points[i]);
    ctx.stroke(); ctx.setLineDash([]);
  }
  function dot(ctx, x, y, r = 3, color = C.aqua, hollow = false) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, M.TAU);
    if (hollow) {ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();}
    else {ctx.fillStyle = color; ctx.fill();}
  }
  function text(ctx, str, x, y, size = 13, color = C.text, align = 'left') {
    // Compensate for the CSS scaling of the bitmap, so labels stay >= 16 CSS px.
    const cssScale = ctx.displayScale || 1;
    const actualSize = Math.max(size, 16 / cssScale);
    ctx.font = `${actualSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const w = ctx.logicalWidth || 1000, h = ctx.logicalHeight || 500, margin = 12;
    const maxWidth = w - margin * 2, rows = [];
    let row = '';
    for (const char of str) {
      if (row && ctx.measureText(row + char).width > maxWidth) { rows.push(row); row = char; }
      else row += char;
    }
    if (row) rows.push(row);
    const widest = Math.max(...rows.map(r => ctx.measureText(r).width), 0);
    const left = align === 'center' ? widest / 2 : align === 'right' ? widest : 0;
    const right = align === 'center' ? widest / 2 : align === 'right' ? 0 : widest;
    const px = Math.max(margin + left, Math.min(w - margin - right, x));
    const lineHeight = actualSize * 1.3;
    const py = Math.max(margin + actualSize, Math.min(h - margin - (rows.length - 1) * lineHeight, y));
    rows.forEach((r,i) => ctx.fillText(r, px, py + i * lineHeight));
    ctx.textAlign = 'left';
  }
  function arrow(ctx, x1, y1, x2, y2, color = C.aqua, width = 1.6) {
    if (Math.hypot(x2-x1,y2-y1) < .4) return;
    line(ctx, [[x1,y1],[x2,y2]], color, width);
    const a = Math.atan2(y2-y1,x2-x1), l = 7;
    line(ctx, [[x2-l*Math.cos(a-.45),y2-l*Math.sin(a-.45)],[x2,y2],[x2-l*Math.cos(a+.45),y2-l*Math.sin(a+.45)]],color,width);
  }
  function base(ctx, w, h) {ctx.logicalWidth=w;ctx.logicalHeight=h;ctx.clearRect(0,0,w,h);ctx.fillStyle=C.bg;ctx.fillRect(0,0,w,h);}
  function propagation(ctx, x = 650, y = 44, length = 230, label = '擾動傳播方向') {arrow(ctx,x,y,x+length,y);text(ctx,label,x,y-12,12,C.aqua);}
  function projection(yaw = -.35, pitch = .36, scale = 70, cx = 500, cy = 280) {
    return (x,y,z) => [cx + scale*(x*Math.cos(yaw)+z*Math.sin(yaw)), cy + scale*(-y*Math.cos(pitch)+Math.sin(pitch)*(-x*Math.sin(yaw)+z*Math.cos(yaw)))];
  }
  function path(ctx, fn, from, to, n, color, width, dash = []) {
    const points = [];for(let i=0;i<=n;i++)points.push(fn(from+(to-from)*i/n));line(ctx,points,color,width,dash);
  }
  function marker(ctx, p, label, rest, showRest) {
    if(showRest && rest){dot(ctx,...rest,4.5,C.rest,true);line(ctx,[rest,p],C.rest,1,[3,4]);}
    dot(ctx,...p,7,C.gold);dot(ctx,...p,10,'#f3c56745',true);text(ctx,label,p[0]+13,p[1]-9,13,C.gold);
  }
  function water(ctx, t, o) {
    base(ctx,1000,500);
    const shallow = o.waterDepth === 'shallow', surface = o.waterView === 'surface';
    if(surface) {waterSurface(ctx,t,o,shallow);return;}
    const scale=85, left=66, top=shallow?238:187, maxD=shallow?.75:3;
    const pos=(x,d,tt=t)=>{const p=M.water(x,d,tt,o.amplitude,shallow);return [left+p.x*scale,top-p.y*scale];};
    propagation(ctx,610,54,235);
    text(ctx,shallow?'有限水深 · 橢圓軌跡':'深水近似 · 圓形軌跡',66,55,15);
    line(ctx,[[left,top],[left+10.2*scale,top]],C.rest,1,[4,5]);text(ctx,'靜止水面',left,top-47,11,C.muted);
    if(shallow){line(ctx,[[left,top+maxD*scale],[left+10.2*scale,top+maxD*scale]],'#78939b',3);text(ctx,'池底：垂直位移為 0',left,top+maxD*scale+27,12,C.muted);}
    ctx.beginPath();for(let i=0;i<=210;i++){const p=pos(i/210*10.2,0);i?ctx.lineTo(...p):ctx.moveTo(...p);}ctx.lineTo(left+10.2*scale,top+maxD*scale);ctx.lineTo(left,top+maxD*scale);ctx.closePath();
    const fill=ctx.createLinearGradient(0,top-30,0,top+maxD*scale);fill.addColorStop(0,'#45bebf23');fill.addColorStop(1,'#45bebf02');ctx.fillStyle=fill;ctx.fill();
    for(let r=0;r<=9;r++){const d=maxD*r/9;for(let i=0;i<=42;i++){const x=i/42*10.2,p=pos(x,d);if(o.equilibrium)dot(ctx,left+x*scale,top+d*scale,1.3,C.rest);dot(ctx,...p,2.5,r===0?'#a0e8de':'#5aadb4');}}
    path(ctx,x=>pos(x,0),0,10.2,220,C.aqua,2);
    const markers=[{x:3.35,d:0,label:'A'},{x:5.85,d:shallow?.38:.65,label:'B'},{x:8.1,d:shallow?.68:1.35,label:'C'}];
    for(const m of markers){if(o.trails)path(ctx,q=>pos(m.x,m.d,q),t-M.TAU/M.waterOmega,t,120,'#f3c56799',1.4);marker(ctx,pos(m.x,m.d),m.label,[left+m.x*scale,top+m.d*scale],o.equilibrium);}
    // Same x/y scale in the inset: a deep-water circle stays a circle.
    ctx.fillStyle='#102632f5';ctx.fillRect(117,331,474,164);
    line(ctx,[[117,332],[590,332]],C.grid,1);
    const center=[228,413], orbit=M.waterOrbit(0,o.amplitude,shallow), mag=215;
    if(o.equilibrium)dot(ctx,...center,3,C.rest,true);
    if(o.trails)path(ctx,a=>[center[0]-orbit.ax*mag*Math.sin(a),center[1]-orbit.ay*mag*Math.cos(a)],0,M.TAU,120,C.gold,1.4,[4,4]);
    const phase=M.waterK*markers[0].x-M.waterOmega*t;
    dot(ctx,center[0]-orbit.ax*mag*Math.sin(phase),center[1]-orbit.ay*mag*Math.cos(phase),7,C.gold);
    text(ctx,'A 點軌跡（放大）',center[0]+101,395,13,C.gold);text(ctx,shallow?'水平幅度 > 垂直幅度':'水平幅度 = 垂直幅度',center[0]+101,431,11,C.muted);
    text(ctx,'金色點標記介質質點；觀察它是否一直向右走。',645,473,11,C.muted,'center');
  }
  function waterSurface(ctx,t,o,shallow){
    text(ctx,'水面斜視 · 同一個質點同時前後與上下移動',52,47,15);propagation(ctx,660,55,210);
    const p=projection(-.32,.62,68,470,240),point=(x,z,tt=t)=>{const m=M.water(x+5,0,tt,o.amplitude,shallow);return p(m.x-5,m.y,z);};
    for(let j=8;j>=0;j--){const z=-2.5+j*.625;path(ctx,x=>point(x,z),-5,5,90,'#50afb06b',1.4);}
    for(let i=0;i<=40;i++){const x=-5+i*.25;path(ctx,z=>point(x,z),-2.5,2.5,15,'#4d93974a',1);for(let j=0;j<=8;j++){const z=-2.5+j*.625;if(o.equilibrium)dot(ctx,...p(x,0,z),1,C.rest);dot(ctx,...point(x,z),2.7,C.aqua);}}
    for(const [x,z,label] of [[-2.6,-1.25,'A'],[.4,0,'B'],[3,1.25,'C']]){if(o.trails)path(ctx,tt=>point(x,z,tt),t-M.TAU/M.waterOmega,t,120,C.gold,1.5);marker(ctx,point(x,z),label,p(x,0,z),o.equilibrium);}
    const r=p(-4,-.8,2.9),end=p(-2,-.8,2.9);arrow(ctx,...r,...end,C.aqua);text(ctx,'波向前，質點繞平衡位置運動',500,446,13,C.muted,'center');text(ctx,'斜視投影會把圓形畫成橢圓；切回剖面可判讀真實軌跡。',500,486,11,C.muted,'center');
  }
  function sound(ctx,t,o){
    base(ctx,1000,500);propagation(ctx,320,54,370,'聲波傳播 → 空氣的疏密變化');
    const x0=170,scale=74,ymid=240,fx=o.frequency;
    // Pressure bands use the derivative of particle displacement, not its phase.
    for(let i=0;i<170;i++){const x=i/170*8.3,p=M.longitudinal(x,t,o.amplitude,fx);ctx.fillStyle=`rgba(94,203,196,${.035+.15*Math.max(0,p.pressure)})`;ctx.fillRect(x0+x*scale,150,5,178);}
    for(let j=0;j<7;j++)for(let i=0;i<=36;i++){const x=i/36*8.3,y=165+j*25,p=M.longitudinal(x,t,o.amplitude,fx);if(o.equilibrium)dot(ctx,x0+x*scale,y,1.6,C.rest);dot(ctx,x0+p.x*scale,y,3.2,C.aqua);}
    const sx=99+M.longitudinal(0,t,o.amplitude,fx).ux*scale;
    ctx.fillStyle='#2b4855';ctx.fillRect(38,186,35,108);ctx.beginPath();ctx.moveTo(73,186);ctx.lineTo(sx,162);ctx.lineTo(sx,318);ctx.lineTo(73,294);ctx.closePath();ctx.fill();line(ctx,[[sx,160],[sx,320]],C.purple,5);
    text(ctx,'發聲體',68,356,13,C.purple,'center');text(ctx,'前後振動',68,393,11,C.muted,'center');arrow(ctx,48,335,108,335,C.purple);
    const mx=4.1,p=M.longitudinal(mx,t,o.amplitude,fx),mp=[x0+p.x*scale,ymid-25],rest=[x0+mx*scale,ymid-25];
    if(o.trails)line(ctx,[[rest[0]-.17*o.amplitude*scale,rest[1]],[rest[0]+.17*o.amplitude*scale,rest[1]]],C.gold,2);
    marker(ctx,mp,'A',rest,o.equilibrium);
    // Ear canal and a schematically pressure-driven membrane.
    const pressure=M.longitudinal(8.3,t,o.amplitude,fx).pressure;
    line(ctx,[[817,172],[858,200],[888,200]],'#a4c5ce',3);line(ctx,[[817,320],[858,280],[888,280]],'#a4c5ce',3);
    const ex=889+pressure*15;
    path(ctx,s=>[889+(ex-889)*Math.sin(Math.PI*s),196+88*s],0,1,40,C.red,4);
    text(ctx,'耳膜',890,348,13,C.red,'center');text(ctx,'受壓力變化驅動',890,386,11,C.muted,'center');
    arrow(ctx,920,240,967,240,C.red);text(ctx,'內耳',943,215,11,C.muted,'center');
    const k=M.TAU*fx/3.6;
    for(const [target,name] of [[Math.PI/2,'密（壓力較高）'],[Math.PI*1.5,'疏（壓力較低）']]){let x=((target+M.TAU*fx*t)/k)%(M.TAU/k);while(x<1)x+=M.TAU/k;if(x<7.8){text(ctx,name,x0+x*scale,125,11,name.startsWith('密')?C.aqua:C.muted,'center');line(ctx,[[x0+x*scale,132],[x0+x*scale,149]],C.rest,1);}}
    text(ctx,'空氣質點的振動方向',500,385,13,C.gold,'center');arrow(ctx,419,403,581,403,C.gold);arrow(ctx,581,403,419,403,C.gold);
    text(ctx,'發聲體 → 空氣壓力變化 → 耳膜／聽小骨 → 內耳 → 聽神經 → 大腦',500,468,13,C.text,'center');
  }
  function spring(ctx,t,o){
    base(ctx,1000,500);const longitudinal=o.springType==='longitudinal',scale=98,left=102,mid=258;
    text(ctx,longitudinal?'縱波 · 振動方向平行於傳播方向':'橫波 · 振動方向垂直於傳播方向',53,49,15);propagation(ctx,653,58,235);
    const point=(x,tt=t)=>{const p=M.spring(x,tt,o.amplitude,o.springType,o.frequency);return [left+p.x*scale,mid-p.y*scale];};
    if(o.equilibrium)line(ctx,[[left-20,mid],[left+8*scale+20,mid]],C.rest,1,[5,5]);
    path(ctx,s=>{const x=8*s,p=point(x),a=s*M.TAU*43;return [p[0]+4*Math.cos(a),p[1]+15*Math.sin(a)];},0,1,1500,C.aqua,2.1);
    const source=point(0);ctx.fillStyle='#405365';ctx.fillRect(source[0]-19,source[1]-24,18,48);dot(ctx,source[0]-10,source[1]-32,8,C.purple);text(ctx,'振動源',88,360,12,C.purple,'center');
    for(const [x,label] of [[2,'A'],[4,'B'],[6,'C']]){const rest=[left+x*scale,mid],max=longitudinal?.17*o.amplitude*scale:.6*o.amplitude*scale;if(o.trails)line(ctx,longitudinal?[[rest[0]-max,mid],[rest[0]+max,mid]]:[[rest[0],mid-max],[rest[0],mid+max]],C.gold,1.5,[4,4]);marker(ctx,point(x),label,rest,o.equilibrium);}
    const a=longitudinal?[435,415,570,415]:[500,367,500,446];arrow(ctx,...a,C.gold);arrow(ctx,a[2],a[3],a[0],a[1],C.gold);text(ctx,longitudinal?'前後振動 ↔':'上下振動 ↕',595,415,13,C.gold);
    text(ctx,longitudinal?'看線圈的疏密向右傳；再看 A 點前後往返。':'看波峰向右傳；再看 A 點上下往返。',500,479,12,C.muted,'center');
  }
  function gravityDetector(ctx,t,o){
    base(ctx,1000,500);text(ctx,'雙星繞行',56,45,15);text(ctx,'遠處的自由質點環',610,45,15);text(ctx,'垂直於波傳播方向的截面',610,85,11,C.muted);
    const cx=264,cy=256,omega=M.orbitalOmega;
    // Concentric arcs encode propagating phase only; they are not a material sheet.
    const period=Math.PI/omega;
    ctx.save();ctx.beginPath();ctx.rect(25,85,456,352);ctx.clip();
    for(let n=0;n<6;n++){const age=((t%period)+n*period),r=75+age*22;if(r>300)continue;ctx.strokeStyle=`rgba(105,217,208,${Math.max(.035,.24-r*.00065)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,0,M.TAU);ctx.stroke();}
    ctx.restore();
    if(o.equilibrium){ctx.beginPath();ctx.arc(cx,cy,62,0,M.TAU);ctx.strokeStyle=C.rest;ctx.setLineDash([4,5]);ctx.stroke();ctx.setLineDash([]);}
    if(o.trails)path(ctx,a=>[cx+62*Math.cos(a),cy-62*Math.sin(a)],0,M.TAU,120,'#f3c56766',1);
    const stars=M.binary(t);stars.forEach((s,i)=>{const x=cx+s.x*62,y=cy-s.y*62,g=ctx.createRadialGradient(x,y,2,x,y,28);g.addColorStop(0,i?'#ffbc8080':'#a8e9ff90');g.addColorStop(1,'#10263200');ctx.fillStyle=g;ctx.fillRect(x-28,y-28,56,56);dot(ctx,x,y,11,i?'#ffc88f':'#bdeaff');text(ctx,`星 ${i+1}`,x+18,y-14,12,i?'#ffd6a5':'#bdeaff');});
    dot(ctx,cx,cy,3,C.rest);text(ctx,'共同質心',cx,cy+102,10,C.muted,'center');
    arrow(ctx,433,251,549,251,C.aqua,2);text(ctx,'以光速傳播',488,229,11,C.aqua,'center');text(ctx,'波前示意',264,410,11,C.muted,'center');
    const ox=771,oy=257,r=113,polar=o.polarization;
    const transform=(x,y,tt=t)=>{const p=M.detector(x,y,tt,o.amplitude,polar);return [ox+p.x,oy-p.y];};
    for(let i=-3;i<=3;i++){line(ctx,[transform(-152,i*46),transform(152,i*46)],'#69d9d023',1);line(ctx,[transform(i*46,-152),transform(i*46,152)],'#69d9d023',1);}
    if(o.equilibrium)path(ctx,a=>[ox+r*Math.cos(a),oy-r*Math.sin(a)],0,M.TAU,180,C.rest,1,[4,5]);
    path(ctx,a=>transform(r*Math.cos(a),r*Math.sin(a)),0,M.TAU,180,C.aqua,1.6);
    for(let i=0;i<24;i++){const a=i/24*M.TAU,x=r*Math.cos(a),y=r*Math.sin(a);if(o.equilibrium)dot(ctx,ox+x,oy-y,2.5,C.rest,true);if(o.trails && i%6===0)path(ctx,tt=>transform(x,y,tt),t-Math.PI/omega,t,80,'#f3c56780',1.3);dot(ctx,...transform(x,y),i%6===0?6:3.6,i%6===0?C.gold:C.aqua);}
    text(ctx,polar==='plus'?'+ 偏振：水平與垂直交替伸縮':'× 偏振：伸縮軸旋轉 45°',771,431,12,C.gold,'center');
    text(ctx,'f重力波 = 2 f繞行（圓形雙星近似）',264,477,13,C.text,'center');text(ctx,'伸縮幅度大幅誇張；網格表示距離變化',771,477,11,C.muted,'center');
  }
  function compass(ctx,proj,x,y){
    if((ctx.displayScale||1)<.6)return;
    for(const [v,name,color] of [[[1,0,0],'x',C.gold],[[0,1,0],'y',C.red],[[0,0,1],'z',C.aqua]]){
      const dir=proj.direction(...v),end=[x+dir[0]*52,y+dir[1]*52];
      if(Math.hypot(...dir)<.15){dot(ctx,x,y,5,color,true);text(ctx,name+(proj.facing(...v)>=0?' ⊙':' ⊗'),x+12,y+5,16,color);}
      else{arrow(ctx,x,y,...end,color,1.5);text(ctx,name,end[0]+6,end[1]+5,16,color);}
    }
  }
  function em(ctx,t,o){
    base(ctx,1000,600);
    const max=Math.max(o.amplitude*1.1,1.25),view=o.camera||D.viewDefault('em');
    const p=D.camera(view,[4,0,0],{x:[-.65,9],y:[-max,max],z:[-max,max]},{left:55,right:945,top:110,bottom:450});
    text(ctx,'E ⟂ B ⟂ x',50,55,20);
    const axis=x=>p(x,0,0),curve=(key,x)=>{const m=M.em(x,t,o.amplitude);return key==='e'?p(x,m.e[1],0):p(x,0,m.b[2]);};
    const patches=[];
    for(const [key,show] of [['b',o.showB],['e',o.showE]])if(show){
      for(let i=0;i<100;i++){const x=i*.08,pts=[axis(x),curve(key,x),curve(key,x+.08),axis(x+.08)];patches.push(D.item(pts,key==='e'?'#ff8b9a21':'#69d9d021',null));}
    }
    D.paint(ctx,patches);
    line(ctx,[axis(0),axis(8.2)],C.rest,1.5,[4,5]);
    arrow(ctx,...axis(7.5).slice(0,2),...axis(9).slice(0,2),C.gold,2.5);
    const end=axis(9),toward=Math.hypot(...p.direction(1,0,0))<.15;
    if(toward)dot(ctx,end[0],end[1],7,C.gold,true);
    const labelScale=ctx.displayScale||1;
    text(ctx,(toward?(p.facing(1,0,0)>=0?'⊙ ':'⊗ '):'')+'傳播 x',end[0]+Math.max(12,25/labelScale),end[1]+26,16,C.gold);
    for(const [key,show,color] of [['b',o.showB,C.aqua],['e',o.showE,C.red]])if(show){
      path(ctx,x=>curve(key,x).slice(0,2),0,8,180,color,2.7);
      for(let i=0;i<=24;i++)arrow(ctx,...axis(i/3).slice(0,2),...curve(key,i/3).slice(0,2),color,1.3);
    }
    const x=3.7,here=axis(x),field=M.em(x,t,o.amplitude);
    if(o.equilibrium)dot(ctx,here[0],here[1],5,C.gold,true);
    for(const [key,show,color,label] of [['e',o.showE,C.red,'E'],['b',o.showB,C.aqua,'B']])if(show){
      const tip=curve(key,x);arrow(ctx,here[0],here[1],tip[0],tip[1],color,3.2);dot(ctx,tip[0],tip[1],5,color);
      text(ctx,label,tip[0]+14,tip[1]+(key==='e'?-Math.max(13,20/labelScale):Math.max(28,32/labelScale)),18,color);
      if(o.trails){const points=key==='e'?[p(x,-o.amplitude,0),p(x,o.amplitude,0)]:[p(x,0,-o.amplitude),p(x,0,o.amplitude)];line(ctx,points.map(q=>q.slice(0,2)),color+'66',1,[3,5]);}
    }
    compass(ctx,p,112,525);
    text(ctx,`E / E₀ = ${(field.e[1]/o.amplitude).toFixed(2)}     B / B₀ = ${(field.b[2]/o.amplitude).toFixed(2)}`,540,555,16,C.muted,'center');
  }
  function seismic(ctx,type,t,o){
    base(ctx,480,310);
    const p=D.camera(o.camera||D.viewDefault('seismic'),[4,-1,0],{x:[-.6,8.6],y:[-2.7,1.1],z:[-1.6,1.6]},{left:20,right:460,top:44,bottom:245});
    const pos=(x,d,z,tt=t)=>{const m=M.seismic(type,x,d,z,tt,o.amplitude);return p(m.x,m.y,m.z);};
    const lines=[],dots=[];
    for(let row=0;row<=4;row++)for(let j=0;j<3;j++){
      const depth=row*.5,z=-.8+j*.8;
      for(let i=0;i<32;i++)lines.push(D.item([pos(i/4,depth,z),pos((i+1)/4,depth,z)],null,row===0?'#75c8c699':'#78b5c048',1));
      for(let i=0;i<=24;i++){
        const x=i/3,q=pos(x,depth,z);
        if(o.equilibrium){const rest=p(x,-depth,z);dots.push({depth:rest[2],draw:c=>dot(c,rest[0],rest[1],1,C.rest)});}
        dots.push({depth:q[2],draw:c=>dot(c,q[0],q[1],row===0?2.7:2,row===0?C.aqua:'#579ba6')});
      }
    }
    for(let i=0;i<=24;i++)for(let j=0;j<3;j++)for(let row=0;row<4;row++)lines.push(D.item([pos(i/3,row*.5,-.8+j*.8),pos(i/3,(row+1)*.5,-.8+j*.8)],null,C.grid,.8));
    D.paint(ctx,lines);D.paint(ctx,dots);
    const a=pos(4,0,.8),rest=p(4,0,.8);
    if(o.trails)path(ctx,tt=>pos(4,0,.8,tt).slice(0,2),t-M.TAU/2.4,t,90,C.gold,1.8);
    marker(ctx,a.slice(0,2),'A',rest.slice(0,2),o.equilibrium);
    const begin=p(0,.95,1.25),end=p(8,.95,1.25);arrow(ctx,begin[0],begin[1],end[0],end[1],C.gold,1.7);
    const aligned=Math.hypot(...p.direction(1,0,0))<.15;
    if(aligned)dot(ctx,end[0],end[1],6,C.gold,true);
    text(ctx,(aligned?(p.facing(1,0,0)>=0?'⊙ ':'⊗ '):'')+'傳播 x',240,30,16,C.gold,'center');
    text(ctx,{p:'前後壓縮 / 伸長',s:'上下剪切（SV）',rayleigh:'近地表逆行橢圓',love:'水平左右剪切'}[type],240,287,16,C.gold,'center');
  }
  function gravityHeight(x,z,t,o){
    const stars=M.binary(t),r=Math.hypot(x,z);
    let well=0;
    for(const s of stars)well-=.62/Math.sqrt((x-.82*s.x)**2+(z-.82*s.y)**2+.16);
    const ripple=.38*o.amplitude*(1-Math.exp(-r*r*.6))*Math.cos(2.75*r-2*M.orbitalOmega*t)/Math.sqrt(1+.14*r);
    return well+ripple;
  }
  function gravity(ctx,t,o){
    if(o.gravityView==='detector'){gravityDetector(ctx,t,o);return;}
    base(ctx,1000,600);
    text(ctx,'時空網格（概念示意）',50,52,20);
    const size=34,step=12/size,grid=[],items=[];
    const envelope=[];
    // A phase-independent envelope follows the sheet, rather than an empty cube.
    for(let j=0;j<=size;j++)for(let i=0;i<=size;i++){
      const x=-6+i*step,z=-6+j*step,r=Math.hypot(x,z),wave=.38*o.amplitude;
      const low=Math.max(-2.6,-1.24/Math.sqrt(Math.max(0,r-.82)**2+.16)-wave);
      const high=-1.24/Math.sqrt((r+.82)**2+.16)+wave+.25;
      envelope.push([x,low,z],[x,high,z]);
    }
    for(const x of [-1,1])for(const z of [-1,1])envelope.push([x,.5,z]);
    const p=D.camera(o.camera||D.viewDefault('gravity'),[0,-.7,0],{x:[-6,6],y:[-2.8,.8],z:[-6,6]},{left:40,right:960,top:85,bottom:530},envelope);
    for(let j=0;j<=size;j++){
      const row=[];for(let i=0;i<=size;i++){const x=-6+i*step,z=-6+j*step,h=gravityHeight(x,z,t,o);row.push({p:p(x,h,z),h});}grid.push(row);
    }
    for(let j=0;j<size;j++)for(let i=0;i<size;i++){
      const a=grid[j][i],b=grid[j][i+1],c=grid[j+1][i+1],d=grid[j+1][i];
      const r=Math.hypot(-6+(i+.5)*step,-6+(j+.5)*step),crest=(1+Math.cos(2.75*r-2*M.orbitalOmega*t))*.5;
      const light=D.clamp(.22+.63*crest+(a.h-c.h)*.25,.15,1),blue=Math.round(35+light*60),green=Math.round(24+light*36),red=Math.round(18+light*22);
      items.push(D.item([a.p,b.p,c.p,d.p],`rgb(${red},${green},${blue})`,'#a4b8de65',.6));
    }
    const stars=M.binary(t);
    stars.forEach((s,i)=>{
      const point=p(.82*s.x,.18,.82*s.y),radius=15*(p.scale/32);
      items.push({depth:point[2],draw:c=>{
        const black=o.binaryType!=='neutron',r=Math.max(6,radius);
        const gradient=c.createRadialGradient(point[0]-r*.3,point[1]-r*.3,r*.05,point[0],point[1],r);
        gradient.addColorStop(0,black?'#171d2b':i?'#fff7df':'#e5f9ff');gradient.addColorStop(.55,black?'#05070c':i?'#ffd7a0':'#9ddfff');gradient.addColorStop(1,black?'#000107':'#557db5');
        c.beginPath();c.arc(point[0],point[1],r,0,M.TAU);c.fillStyle=gradient;c.fill();c.strokeStyle=black?'#7a8dad':'#dbeeff';c.lineWidth=1;c.stroke();
      }});
    });
    D.paint(ctx,items);
    if(o.equilibrium)path(ctx,a=>p(.82*Math.cos(a),.18,.82*Math.sin(a)).slice(0,2),0,M.TAU,100,'#d5deedaa',1,[4,4]);
    if(o.trails)for(const [angle,color] of [[0,'#bdc6de77'],[Math.PI,'#bdc6de44']])path(ctx,a=>p(.82*Math.cos(a+angle),.18,.82*Math.sin(a+angle)).slice(0,2),M.orbitalOmega*t-1.6,M.orbitalOmega*t,50,color,1.5);
    for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
      const start=[2.5*Math.cos(a),2.5*Math.sin(a)],finish=[5.35*Math.cos(a),5.35*Math.sin(a)];
      const q=p(start[0],gravityHeight(...start,t,o)+.18,start[1]),r=p(finish[0],gravityHeight(...finish,t,o)+.18,finish[1]);arrow(ctx,q[0],q[1],r[0],r[1],'#e3ebffdd',2.5);
    }
    const near=p(0,.32,0);text(ctx,o.binaryType==='neutron'?'雙中子星':'雙黑洞',near[0]+25,near[1]-25,18,C.text);
    text(ctx,'起伏與凹陷為示意；可切換「距離伸縮」觀察重力波效應。',500,561,16,C.muted,'center');
  }
  root.WaveRenderers={water,sound,em,spring,seismic,gravity,gravityHeight,colors:C};
})(typeof globalThis !== 'undefined' ? globalThis : window);
