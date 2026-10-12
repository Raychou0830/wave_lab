(function (root) {
  'use strict';
  const M = root.WaveModels;
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
    ctx.font = `${size}px ${font}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(str, x, y); ctx.textAlign = 'left';
  }
  function arrow(ctx, x1, y1, x2, y2, color = C.aqua, width = 1.6) {
    if (Math.hypot(x2-x1,y2-y1) < .4) return;
    line(ctx, [[x1,y1],[x2,y2]], color, width);
    const a = Math.atan2(y2-y1,x2-x1), l = 7;
    line(ctx, [[x2-l*Math.cos(a-.45),y2-l*Math.sin(a-.45)],[x2,y2],[x2-l*Math.cos(a+.45),y2-l*Math.sin(a+.45)]],color,width);
  }
  function base(ctx, w, h) {ctx.clearRect(0,0,w,h);ctx.fillStyle=C.bg;ctx.fillRect(0,0,w,h);}
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
    text(ctx,'A 點軌跡（放大）',center[0]+101,center[1]-10,13,C.gold);text(ctx,shallow?'水平幅度 > 垂直幅度':'水平幅度 = 垂直幅度',center[0]+101,center[1]+14,11,C.muted);
    text(ctx,'金色點標記介質質點；觀察它是否一直向右走。',645,462,11,C.muted,'center');
  }
  function waterSurface(ctx,t,o,shallow){
    text(ctx,'水面斜視 · 同一個質點同時前後與上下移動',52,47,15);propagation(ctx,660,55,210);
    const p=projection(-.32,.62,68,470,240),point=(x,z,tt=t)=>{const m=M.water(x+5,0,tt,o.amplitude,shallow);return p(m.x-5,m.y,z);};
    for(let j=8;j>=0;j--){const z=-2.5+j*.625;path(ctx,x=>point(x,z),-5,5,90,'#50afb06b',1.4);}
    for(let i=0;i<=40;i++){const x=-5+i*.25;path(ctx,z=>point(x,z),-2.5,2.5,15,'#4d93974a',1);for(let j=0;j<=8;j++){const z=-2.5+j*.625;if(o.equilibrium)dot(ctx,...p(x,0,z),1,C.rest);dot(ctx,...point(x,z),2.7,C.aqua);}}
    for(const [x,z,label] of [[-2.6,-1.25,'A'],[.4,0,'B'],[3,1.25,'C']]){if(o.trails)path(ctx,tt=>point(x,z,tt),t-M.TAU/M.waterOmega,t,120,C.gold,1.5);marker(ctx,point(x,z),label,p(x,0,z),o.equilibrium);}
    const r=p(-4,-.8,2.9),end=p(-2,-.8,2.9);arrow(ctx,...r,...end,C.aqua);text(ctx,'波向前，質點繞平衡位置運動',500,446,13,C.muted,'center');text(ctx,'斜視投影會把圓形畫成橢圓；切回剖面可判讀真實軌跡。',500,472,11,C.muted,'center');
  }
  function sound(ctx,t,o){
    base(ctx,1000,500);propagation(ctx,320,54,370,'聲波傳播 → 空氣的疏密變化');
    const x0=170,scale=74,ymid=240,fx=o.frequency;
    // Pressure bands use the derivative of particle displacement, not its phase.
    for(let i=0;i<170;i++){const x=i/170*8.3,p=M.longitudinal(x,t,o.amplitude,fx);ctx.fillStyle=`rgba(94,203,196,${.035+.15*Math.max(0,p.pressure)})`;ctx.fillRect(x0+x*scale,150,5,178);}
    for(let j=0;j<7;j++)for(let i=0;i<=36;i++){const x=i/36*8.3,y=165+j*25,p=M.longitudinal(x,t,o.amplitude,fx);if(o.equilibrium)dot(ctx,x0+x*scale,y,1.6,C.rest);dot(ctx,x0+p.x*scale,y,3.2,C.aqua);}
    const sx=99+M.longitudinal(0,t,o.amplitude,fx).ux*scale;
    ctx.fillStyle='#2b4855';ctx.fillRect(38,186,35,108);ctx.beginPath();ctx.moveTo(73,186);ctx.lineTo(sx,162);ctx.lineTo(sx,318);ctx.lineTo(73,294);ctx.closePath();ctx.fill();line(ctx,[[sx,160],[sx,320]],C.purple,5);
    text(ctx,'發聲體',68,356,13,C.purple,'center');text(ctx,'前後振動',68,377,11,C.muted,'center');arrow(ctx,48,335,108,335,C.purple);
    const mx=4.1,p=M.longitudinal(mx,t,o.amplitude,fx),mp=[x0+p.x*scale,ymid-25],rest=[x0+mx*scale,ymid-25];
    if(o.trails)line(ctx,[[rest[0]-.17*o.amplitude*scale,rest[1]],[rest[0]+.17*o.amplitude*scale,rest[1]]],C.gold,2);
    marker(ctx,mp,'A',rest,o.equilibrium);
    // Ear canal and a schematically pressure-driven membrane.
    const pressure=M.longitudinal(8.3,t,o.amplitude,fx).pressure;
    line(ctx,[[817,172],[858,200],[888,200]],'#a4c5ce',3);line(ctx,[[817,320],[858,280],[888,280]],'#a4c5ce',3);
    const ex=889+pressure*15;
    path(ctx,s=>[889+(ex-889)*Math.sin(Math.PI*s),196+88*s],0,1,40,C.red,4);
    text(ctx,'耳膜',890,348,13,C.red,'center');text(ctx,'受壓力變化驅動',890,370,11,C.muted,'center');
    arrow(ctx,920,240,967,240,C.red);text(ctx,'內耳',943,215,11,C.muted,'center');
    const k=M.TAU*fx/3.6;
    for(const [target,name] of [[Math.PI/2,'密（壓力較高）'],[Math.PI*1.5,'疏（壓力較低）']]){let x=((target+M.TAU*fx*t)/k)%(M.TAU/k);while(x<1)x+=M.TAU/k;if(x<7.8){text(ctx,name,x0+x*scale,125,11,name.startsWith('密')?C.aqua:C.muted,'center');line(ctx,[[x0+x*scale,132],[x0+x*scale,149]],C.rest,1);}}
    text(ctx,'空氣質點的振動方向',500,385,13,C.gold,'center');arrow(ctx,419,403,581,403,C.gold);arrow(ctx,581,403,419,403,C.gold);
    text(ctx,'發聲體 → 空氣壓力變化 → 耳膜／聽小骨 → 內耳 → 聽神經 → 大腦',500,468,13,C.text,'center');
  }
  function em(ctx,t,o){
    base(ctx,1000,500);text(ctx,'E ⟂ B ⟂ 傳播方向',50,46,16);text(ctx,'場強以各自最大值正規化',50,69,11,C.muted);
    const yaw=o.angle*Math.PI/180,proj=projection(yaw,.42,94,125,271);
    const axis=x=>proj(x,0,0);line(ctx,[axis(0),axis(8.1)],C.rest,1.5,[4,4]);
    const end=axis(8.6);arrow(ctx,...axis(7.5),...end,C.aqua,2);text(ctx,'傳播 x',end[0]-35,end[1]+28,13,C.aqua);
    const curve=(which,x)=>{const field=M.em(x,t,o.amplitude);return which==='e'?proj(x,field.e[1],0):proj(x,0,field.b[2]);};
    for(const [field,show,color] of [['b',o.showB,C.aqua],['e',o.showE,C.red]])if(show){ctx.beginPath();ctx.moveTo(...axis(0));for(let i=0;i<=180;i++)ctx.lineTo(...curve(field,i/180*8));ctx.lineTo(...axis(8));ctx.closePath();ctx.fillStyle=field==='e'?'#ff8b9a13':'#69d9d013';ctx.fill();path(ctx,x=>curve(field,x),0,8,180,color,2.3);for(let i=0;i<=24;i++)arrow(ctx,...axis(i/3),...curve(field,i/3),color,1.1);}
    const x=3.7,field=M.em(x,t,o.amplitude),p0=axis(x);
    if(o.equilibrium)dot(ctx,...p0,4,C.gold,true);
    if(o.showE){arrow(ctx,...p0,...curve('e',x),C.red,3);dot(ctx,...curve('e',x),5,C.red);text(ctx,'E',curve('e',x)[0]+10,curve('e',x)[1]-5,15,C.red);}
    if(o.showB){arrow(ctx,...p0,...curve('b',x),C.aqua,3);dot(ctx,...curve('b',x),5,C.aqua);text(ctx,'B',curve('b',x)[0]+10,curve('b',x)[1]+18,15,C.aqua);}
    if(o.trails){if(o.showE)line(ctx,[proj(x,-o.amplitude,0),proj(x,o.amplitude,0)],'#ff8b9a55',1,[3,5]);if(o.showB)line(ctx,[proj(x,0,-o.amplitude),proj(x,0,o.amplitude)],'#69d9d055',1,[3,5]);}
    const tri=projection(-.35,.42,53,108,410),zero=tri(0,0,0);arrow(ctx,...zero,...tri(1.1,0,0),C.gold);arrow(ctx,...zero,...tri(0,1.1,0),C.red);arrow(ctx,...zero,...tri(0,0,1.1),C.aqua);text(ctx,'x',...tri(1.35,0,0),12,C.gold);text(ctx,'E / y',...tri(0,1.35,0),12,C.red);text(ctx,'B / z',...tri(0,0,1.35),12,C.aqua);
    // Field value display makes the coupling visible without implying alternating creation.
    const gaugeX=696;for(const [v,y,col,label] of [[field.e[1],403,C.red,'E / E₀'],[field.b[2],443,C.aqua,'B / B₀']]){line(ctx,[[gaugeX,y],[gaugeX+180,y]],C.rest,2);dot(ctx,gaugeX+90+v/o.amplitude*80,y,5,col);text(ctx,label,gaugeX-70,y+5,12,col);}
    text(ctx,'同一位置：E 與 B 同步振盪',480,469,12,C.muted,'center');
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
  function seismic(ctx,type,t,o){
    base(ctx,480,310);const proj=projection(-.43,.42,37,75,157);
    const pos=(x,d,z,tt=t)=>{const m=M.seismic(type,x,d,z,tt,o.amplitude);return proj(m.x,m.y,m.z);};
    const maxDepth=2.0;
    for(let row=4;row>=0;row--){const d=row*maxDepth/4;for(let j=0;j<3;j++){const z=-.8+j*.8;path(ctx,x=>pos(x,d,z),0,8,64,row===0?'#75c8c678':'#78b5c035',1);}}
    for(let i=0;i<=24;i++){const x=i/3;for(let j=0;j<3;j++){const z=-.8+j*.8;path(ctx,d=>pos(x,d,z),0,maxDepth,16,C.grid,1);for(let row=0;row<=4;row++){const d=row*maxDepth/4;if(o.equilibrium)dot(ctx,...proj(x,-d,z),1,C.rest);dot(ctx,...pos(x,d,z),row===0?2.6:2,row===0?C.aqua:'#579ba6');}}}
    const mx=4.0,mz=.8,rest=proj(mx,0,mz),p=pos(mx,0,mz);
    if(o.trails)path(ctx,tt=>pos(mx,0,mz,tt),t-M.TAU/2.4,t,90,C.gold,1.7);marker(ctx,p,'A',rest,o.equilibrium);
    arrow(ctx,295,37,419,37,C.aqua,1.5);text(ctx,'傳播方向',295,22,11,C.aqua);
    const label={p:'前後壓縮 / 伸長',s:'上下剪切（SV）',rayleigh:'近地表逆行橢圓',love:'水平左右剪切'}[type];text(ctx,label,240,283,12,C.gold,'center');
    const axes=projection(-.43,.42,24,397,237),zero=axes(0,0,0);for(const [v,label,col] of [[[1,0,0],'x',C.aqua],[[0,1,0],'上',C.muted],[[0,0,1],'水平',C.gold]]){arrow(ctx,...zero,...axes(...v),col,1.2);const p=axes(...v);text(ctx,label,p[0]+3,p[1],9,col);}
  }
  function gravity(ctx,t,o){
    base(ctx,1000,500);text(ctx,'雙星繞行',56,45,15);text(ctx,'遠處的自由質點環',610,45,15);text(ctx,'垂直於波傳播方向的截面',610,69,11,C.muted);
    const cx=264,cy=256,omega=M.orbitalOmega;
    // Concentric arcs encode propagating phase only; they are not a material sheet.
    const period=Math.PI/omega;
    ctx.save();ctx.beginPath();ctx.rect(25,85,456,352);ctx.clip();
    for(let n=0;n<6;n++){const age=((t%period)+n*period),r=75+age*22;if(r>300)continue;ctx.strokeStyle=`rgba(105,217,208,${Math.max(.035,.24-r*.00065)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,0,M.TAU);ctx.stroke();}
    ctx.restore();
    if(o.equilibrium){ctx.beginPath();ctx.arc(cx,cy,62,0,M.TAU);ctx.strokeStyle=C.rest;ctx.setLineDash([4,5]);ctx.stroke();ctx.setLineDash([]);}
    if(o.trails)path(ctx,a=>[cx+62*Math.cos(a),cy-62*Math.sin(a)],0,M.TAU,120,'#f3c56766',1);
    const stars=M.binary(t);stars.forEach((s,i)=>{const x=cx+s.x*62,y=cy-s.y*62,g=ctx.createRadialGradient(x,y,2,x,y,28);g.addColorStop(0,i?'#ffbc8080':'#a8e9ff90');g.addColorStop(1,'#10263200');ctx.fillStyle=g;ctx.fillRect(x-28,y-28,56,56);dot(ctx,x,y,11,i?'#ffc88f':'#bdeaff');text(ctx,`星 ${i+1}`,x+18,y-14,12,i?'#ffd6a5':'#bdeaff');});
    dot(ctx,cx,cy,3,C.rest);text(ctx,'共同質心',cx,cy+20,10,C.muted,'center');
    arrow(ctx,433,251,549,251,C.aqua,2);text(ctx,'以光速傳播',488,229,11,C.aqua,'center');text(ctx,'波前示意',264,410,11,C.muted,'center');
    const ox=771,oy=257,r=113,polar=o.polarization;
    const transform=(x,y,tt=t)=>{const p=M.detector(x,y,tt,o.amplitude,polar);return [ox+p.x,oy-p.y];};
    for(let i=-3;i<=3;i++){line(ctx,[transform(-152,i*46),transform(152,i*46)],'#69d9d023',1);line(ctx,[transform(i*46,-152),transform(i*46,152)],'#69d9d023',1);}
    if(o.equilibrium)path(ctx,a=>[ox+r*Math.cos(a),oy-r*Math.sin(a)],0,M.TAU,180,C.rest,1,[4,5]);
    path(ctx,a=>transform(r*Math.cos(a),r*Math.sin(a)),0,M.TAU,180,C.aqua,1.6);
    for(let i=0;i<24;i++){const a=i/24*M.TAU,x=r*Math.cos(a),y=r*Math.sin(a);if(o.equilibrium)dot(ctx,ox+x,oy-y,2.5,C.rest,true);if(o.trails && i%6===0)path(ctx,tt=>transform(x,y,tt),t-Math.PI/omega,t,80,'#f3c56780',1.3);dot(ctx,...transform(x,y),i%6===0?6:3.6,i%6===0?C.gold:C.aqua);}
    text(ctx,polar==='plus'?'+ 偏振：水平與垂直交替伸縮':'× 偏振：伸縮軸旋轉 45°',771,431,12,C.gold,'center');
    text(ctx,'f重力波 = 2 f繞行（圓形雙星近似）',264,456,13,C.text,'center');text(ctx,'伸縮幅度大幅誇張；網格表示距離變化',771,459,11,C.muted,'center');
    text(ctx,'⊙ 波朝向觀察者',925,101,10,C.aqua,'right');
  }
  root.WaveRenderers={water,sound,em,spring,seismic,gravity,colors:C};
})(typeof globalThis !== 'undefined' ? globalThis : window);
