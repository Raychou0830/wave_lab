/* Canvas renderers for echo and musical-sound laboratories. */
(function(root){
  'use strict';
  const M=root.EchoMusicModels,TAU=Math.PI*2;
  const C={ink:'#16323c',muted:'#60727a',teal:'#268577',teal2:'#73b9ad',gold:'#e7ad39',red:'#c85b55',paper:'#fbfaf5',line:'#d7ddd9',blue:'#3d7f9a'};
  function begin(ctx){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.fillStyle=C.paper;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.lineCap='round';ctx.lineJoin='round';}
  function text(ctx,s,x,y,size=18,color=C.ink,align='left',weight=500){ctx.fillStyle=color;ctx.font=`${weight>=700?'700':'500'} ${size}px system-ui, "Noto Sans CJK TC", sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);}
  function line(ctx,a,b,color=C.ink,width=2,dash=[]){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
  function arrow(ctx,a,b,color=C.teal,label=''){line(ctx,a,b,color,3);const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]-14*Math.cos(ang-.45),b[1]-14*Math.sin(ang-.45));ctx.lineTo(b[0]-14*Math.cos(ang+.45),b[1]-14*Math.sin(ang+.45));ctx.closePath();ctx.fill();if(label)text(ctx,label,(a[0]+b[0])/2,(a[1]+b[1])/2-20,18,color,'center',700);}
  function dimension(ctx,x1,x2,y,label,color=C.ink){line(ctx,[x1,y],[x2,y],color,2);line(ctx,[x1,y-9],[x1,y+9],color,2);line(ctx,[x2,y-9],[x2,y+9],color,2);text(ctx,label,(x1+x2)/2,y-21,17,color,'center',700);}
  function card(ctx,x,y,w,h,title,value,accent=C.teal){ctx.fillStyle='#fff';ctx.strokeStyle=C.line;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x,y,w,h,10);ctx.fill();ctx.stroke();text(ctx,title,x+16,y+22,16,C.muted,'left',600);text(ctx,value,x+16,y+53,22,accent,'left',750);}
  function shipIcon(ctx,x,y){ctx.fillStyle=C.ink;ctx.beginPath();ctx.moveTo(x-28,y);ctx.lineTo(x+31,y);ctx.lineTo(x+20,y+18);ctx.lineTo(x-18,y+18);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(x-11,y-18,26,18);ctx.fillStyle=C.gold;ctx.fillRect(x+2,y-28,4,10);}
  function soundRing(ctx,x,y,r,alpha=1,direction=1){ctx.strokeStyle=`rgba(231,173,57,${alpha})`;ctx.lineWidth=4;ctx.beginPath();const center=direction>0?0:Math.PI;ctx.arc(x,y,r,center-.65,center+.65);ctx.stroke();}
  function ship(ctx,t,o){
    begin(ctx);const m=M.boat(o.shipSpeed,o.initialDistance||1800,340),local=t%(m.totalTime+1.4),W=ctx.canvas.width;
    const x0=130,wall=875,scale=(wall-x0)/m.initialDistance,receiveX=x0+m.shipTravelTotal*scale,shipX=x0+Math.min(local,m.totalTime)*m.speed*scale;
    ctx.fillStyle='#d7eef0';ctx.fillRect(0,310,W,310);for(let x=-40;x<W;x+=80){ctx.strokeStyle='rgba(38,133,119,.28)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,345);ctx.quadraticCurveTo(x+20,332,x+40,345);ctx.quadraticCurveTo(x+60,358,x+80,345);ctx.stroke();}
    ctx.fillStyle='#7e8b86';ctx.fillRect(wall,80,W-wall,450);ctx.fillStyle='#53635e';ctx.fillRect(wall,80,12,450);text(ctx,'岸壁',932,110,20,C.ink,'center',750);
    line(ctx,[x0,215],[x0,405],C.muted,2,[7,7]);line(ctx,[receiveX,215],[receiveX,465],C.gold,2,[7,7]);text(ctx,'發聲位置',x0,205,16,C.muted,'center',700);text(ctx,'接收位置',receiveX,205,16,C.gold,'center',700);
    shipIcon(ctx,shipX,294);arrow(ctx,[shipX-55,242],[shipX+55,242],C.teal,`船速 ${m.speed.toFixed(0)} m/s`);
    let pulseX=shipX,phase='等待下一次發聲',pulseDirection=1;
    if(local<=m.outboundTime){pulseX=x0+340*local*scale;phase='超音波前往岸壁';}
    else if(local<=m.totalTime){pulseX=wall-340*(local-m.outboundTime)*scale;phase='回聲向左返回移動中的船';pulseDirection=-1;}
    if(local<=m.totalTime){soundRing(ctx,pulseX,286,18+8*Math.sin(local*10),.95,pulseDirection);soundRing(ctx,pulseX,286,34+8*Math.sin(local*10),.45,pulseDirection);}
    dimension(ctx,x0,receiveX,420,`原始位置 → 接收位置：${m.shipTravelTotal.toFixed(1)} m`,C.teal);dimension(ctx,receiveX,wall,480,`接收位置 → 岸邊：${m.distanceAtReception.toFixed(1)} m`,C.gold);
    text(ctx,`到岸 ${m.outboundTime.toFixed(2)} s`,wall-14,535,16,C.muted,'right');text(ctx,`收到回聲 ${m.totalTime.toFixed(2)} s`,receiveX,535,16,C.gold,'center');
    text(ctx,phase,500,54,24,C.ink,'center',750);text(ctx,`動畫 t = ${Math.min(local,m.totalTime).toFixed(2)} s`,500,88,17,C.muted,'center');
    card(ctx,30,108,225,78,'發聲時離岸 D',`${m.initialDistance.toFixed(0)} m`);card(ctx,270,108,225,78,'聲波到岸時間',`${m.outboundTime.toFixed(2)} s`);card(ctx,510,108,220,78,'回聲總時間',`${m.totalTime.toFixed(2)} s`);card(ctx,745,108,225,78,'收到時離岸',`${m.distanceAtReception.toFixed(1)} m`,C.gold);
  }
  function batShape(ctx,x,y,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=C.ink;ctx.beginPath();ctx.moveTo(-4,0);ctx.quadraticCurveTo(-32,-25,-48,-2);ctx.quadraticCurveTo(-27,-5,-18,14);ctx.lineTo(0,5);ctx.lineTo(18,14);ctx.quadraticCurveTo(28,-5,48,-2);ctx.quadraticCurveTo(32,-25,4,0);ctx.closePath();ctx.fill();ctx.restore();}
  function bat(ctx,t,o){
    begin(ctx);const m=M.bat(o.batSpeed,o.distance,310,.3),end=(m.safe?m.actionTime+1.2:m.collisionTime+1),local=t%Math.max(end,1.4),x0=115,wall=875,scale=(wall-x0)/m.distance;
    ctx.fillStyle='#eef0e9';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.fillStyle='#727c77';ctx.fillRect(wall,65,125,480);ctx.fillStyle='#495651';ctx.fillRect(wall,65,12,480);text(ctx,'牆',932,95,22,'#fff','center',750);
    let batX=x0+m.speed*Math.min(local,m.collisionTime)*scale,batY=300,angle=0;
    if(m.safe&&local>m.actionTime){const q=Math.min((local-m.actionTime)/.8,1);batY-=170*q;angle=-.45;batX=x0+m.speed*m.actionTime*scale+70*q;}
    batX=Math.min(batX,wall-8);batShape(ctx,batX,batY,angle);arrow(ctx,[batX-50,225],[batX+55,225],C.teal,`蝙蝠 ${m.speed.toFixed(0)} m/s`);
    let pulseX=null;if(local<=m.echoTime/2)pulseX=x0+310*local*scale;else if(local<=m.echoTime)pulseX=wall-310*(local-m.echoTime/2)*scale;
    if(pulseX!==null){soundRing(ctx,pulseX,300,20,.95);soundRing(ctx,pulseX,300,38,.4);}
    if(!m.safe&&local>=m.collisionTime){ctx.strokeStyle=C.red;ctx.lineWidth=7;for(let a=0;a<TAU;a+=Math.PI/4)line(ctx,[wall-15+Math.cos(a)*15,300+Math.sin(a)*15],[wall-15+Math.cos(a)*48,300+Math.sin(a)*48],C.red,6);text(ctx,'撞上！',wall-85,365,30,C.red,'center',800);}
    let status='回聲尚未返回',accent=C.blue;
    if(local>=m.echoTime&&local<m.actionTime){status=`已聽見回聲，反應中 ${(m.actionTime-local).toFixed(2)} s`;accent=C.gold;}
    if(local>=m.actionTime&&m.safe){status='及時轉向：安全';accent=C.teal;}
    if(!m.safe&&local>=m.collisionTime){status='來不及轉向：撞牆';accent=C.red;}
    text(ctx,status,500,48,25,accent,'center',800);
    line(ctx,[x0,455],[wall,455],C.ink,2);line(ctx,[x0,443],[x0,467],C.ink,2);line(ctx,[wall,443],[wall,467],C.ink,2);text(ctx,`初始距離 ${m.distance.toFixed(1)} m`,500,486,19,C.ink,'center',700);
    card(ctx,45,535,205,65,'回聲返回',`${m.echoTime.toFixed(3)} s`);card(ctx,265,535,205,65,'再反應',`${m.reactionTime.toFixed(1)} s`);card(ctx,485,535,205,65,'撞牆時間',`${m.collisionTime.toFixed(3)} s`);card(ctx,705,535,250,65,'最低安全距離',`${m.minimumDistance.toFixed(2)} m`,m.safe?C.teal:C.red);
  }
  function ring3D(ctx,project,r,kind,alpha){const steps=64;for(let family=0;family<3;family++){ctx.beginPath();for(let i=0;i<=steps;i++){const a=i/steps*TAU;let p;if(family===0)p=project(r*Math.cos(a),r*Math.sin(a),0);else if(family===1)p=project(r*Math.cos(a),0,r*Math.sin(a));else p=project(0,r*Math.cos(a),r*Math.sin(a));if(i)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);}ctx.strokeStyle=kind==='main'?`rgba(38,133,119,${alpha})`:`rgba(231,173,57,${alpha})`;ctx.lineWidth=kind==='main'?2.4:3.4;ctx.stroke();}}
  function patchPoint(project,r,u,v){const y=r*u*.34,z=r*v*.34,x=Math.sqrt(Math.max(.01,r*r-y*y-z*z));return project(x,y,z);}
  function spherePatch(ctx,project,r,divisions){const colors=['rgba(231,173,57,.42)','rgba(38,133,119,.31)'];for(let iy=0;iy<divisions;iy++)for(let iz=0;iz<divisions;iz++){const u0=-1+2*iy/divisions,u1=-1+2*(iy+1)/divisions,v0=-1+2*iz/divisions,v1=-1+2*(iz+1)/divisions,pts=[patchPoint(project,r,u0,v0),patchPoint(project,r,u1,v0),patchPoint(project,r,u1,v1),patchPoint(project,r,u0,v1)];ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=colors[(iy+iz)%2];ctx.fill();ctx.strokeStyle='rgba(22,50,60,.68)';ctx.lineWidth=1.3;ctx.stroke();}return project(r,0,0);}
  function loudness(ctx,t,o){
    begin(ctx);const box={left:80,right:740,top:75,bottom:545},project=root.Wave3D.camera(o.camera,[0,0,0],{x:[-5,5],y:[-5,5],z:[-5,5]},box);const s=M.sphere(o.distance,1);
    for(let k=0;k<4;k++){const r=.55+((t*.48+k*.25)%1)*4.45;ring3D(ctx,project,r,'pulse',.2+.5*(1-r/5));}
    ring3D(ctx,project,o.distance,'main',.9);const center=project(0,0,0),obs=project(o.distance,0,0),outer=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([u,v])=>patchPoint(project,3.6,u,v));outer.forEach(p=>line(ctx,center,p,C.muted,1,[6,7]));const patchCenters=[spherePatch(ctx,project,1.2,1),spherePatch(ctx,project,2.4,2),spherePatch(ctx,project,3.6,3)],labelXs=[245,430,615],labels=['r・I','2r・I/4','3r・I/9'];patchCenters.forEach((p,i)=>{line(ctx,p,[labelXs[i],520],C.muted,1,[5,5]);text(ctx,labels[i],labelXs[i],540,17,i===0?C.gold:C.teal,'center',700);});ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(center[0],center[1],11,0,TAU);ctx.fill();ctx.fillStyle=C.teal;ctx.beginPath();ctx.arc(obs[0],obs[1],10,0,TAU);ctx.fill();line(ctx,center,obs,C.teal,2,[8,7]);
    line(ctx,center,[250,112],C.ink,1,[5,5]);text(ctx,'聲源',250,92,18,C.ink,'center',750);line(ctx,obs,[650,112],C.teal,1,[5,5]);text(ctx,`觀察點 r = ${o.distance.toFixed(1)} m`,650,92,17,C.teal,'center',700);
    text(ctx,'同一份聲功率，分散到愈大的球面',500,35,24,C.ink,'center',750);
    card(ctx,770,105,200,86,'球面面積 4πr²',`${s.area.toFixed(1)} m²`);card(ctx,770,210,200,86,'相對聲強 1/r²',`${(s.relativeIntensity*100).toFixed(1)}%`,C.gold);card(ctx,770,315,200,86,'同一立體角區塊',`面積比 1：4：9`,C.teal);
    text(ctx,'自由場中的點聲源模型',870,455,17,C.muted,'center',650);text(ctx,'聲強 ∝ 1 / r²',870,490,23,C.ink,'center',800);text(ctx,'不是「總能量消失」',870,530,17,C.red,'center',700);
  }
  function axes(ctx,x,y,w,h,xLabel,yLabel){line(ctx,[x,y+h],[x+w,y+h],C.ink,2);line(ctx,[x,y],[x,y+h],C.ink,2);text(ctx,xLabel,x+w,y+h+26,16,C.muted,'right');text(ctx,yLabel,x-8,y-17,16,C.muted,'left');}
  function pitch(ctx,t,o){
    begin(ctx);const f=o.frequency,note=M.nearestNote(f);text(ctx,'頻率愈高，同一段時間內振動次數愈多',500,48,25,C.ink,'center',800);axes(ctx,80,130,840,300,'時間（20 ms）','振幅');
    ctx.beginPath();for(let i=0;i<=840;i++){const sec=i/840*.02,y=280-105*Math.sin(TAU*f*sec);if(i)ctx.lineTo(80+i,y);else ctx.moveTo(80+i,y);}ctx.strokeStyle=C.teal;ctx.lineWidth=4;ctx.stroke();
    card(ctx,105,500,230,80,'目前頻率',`${f.toFixed(2)} Hz`,C.gold);card(ctx,385,500,230,80,'最接近音名',`${note.name} ${note.cents>=0?'+':''}${note.cents.toFixed(0)} cent`);card(ctx,665,500,230,80,'20 ms 內週期數',`${(f*.02).toFixed(2)} 次`);
  }
  function sweep(ctx,t,o){
    begin(ctx);const phase=(t%o.duration)/o.duration,voices=M.shepardVoices(phase),strongest=voices.reduce((a,b)=>a.gain>b.gain?a:b),f=o.sweepType==='shepard'?strongest.frequency:M.sweepFrequency(phase,o.start,o.end);
    text(ctx,o.sweepType==='shepard'?'謝帕德音：多個八度交替淡入、淡出，造成持續上升錯覺':'一般掃頻：到達終點後重新開始',500,47,24,C.ink,'center',800);
    axes(ctx,90,120,820,330,'一輪時間','頻率（對數尺度）');
    const min=80,max=22000,toY=v=>450-Math.log(v/min)/Math.log(max/min)*300;
    [100,500,1500,5000,10000,20000].forEach(v=>{const y=toY(v);line(ctx,[90,y],[910,y],C.line,1,[5,6]);text(ctx,`${v>=1000?v/1000+'k':v} Hz`,78,y,16,C.muted,'right');});
    if(o.sweepType==='shepard')for(let k=0;k<5;k++){ctx.beginPath();for(let i=0;i<=820;i++){const p=i/820,q=(p+k/5)%1,v=220*Math.pow(2,5*q),y=toY(v);if(i)ctx.lineTo(90+i,y);else ctx.moveTo(90+i,y);}ctx.strokeStyle=`rgba(38,133,119,${.25+k*.11})`;ctx.lineWidth=2.6;ctx.stroke();}
    else{ctx.fillStyle='rgba(200,91,85,.07)';ctx.fillRect(90+820*.78,120,820*.22,330);text(ctx,'高頻加速區',900,137,16,C.red,'right',700);ctx.beginPath();for(let i=0;i<=820;i++){const p=i/820,v=M.sweepFrequency(p,o.start,o.end),y=toY(v);if(i)ctx.lineTo(90+i,y);else ctx.moveTo(90+i,y);}ctx.strokeStyle=C.teal;ctx.lineWidth=4;ctx.stroke();}
    const px=90+820*phase,py=toY(Math.min(f,max));ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(px,py,10,0,TAU);ctx.fill();line(ctx,[px,450],[px,py],C.gold,2,[5,5]);
    card(ctx,300,510,400,76,o.sweepType==='shepard'?'此刻最強的頻率分量':'此刻掃頻頻率',`${f.toFixed(1)} Hz`,C.gold);
  }
  function timbre(ctx,t,o){
    begin(ctx);const h=M.HARMONICS[o.instrument]||M.HARMONICS.fork,names={fork:'音叉',flute:'長笛',clarinet:'單簧管',violin:'小提琴',guitar:'吉他'},colors=['#e7ad39','#c85b55','#3d7f9a','#7d68a8','#61a56d','#d17f42','#4d9a96','#a36b7d'],windowSeconds=.014,norm=h.reduce((s,a)=>s+Math.abs(a),0);text(ctx,`${names[o.instrument]}：基頻 ${o.fundamental.toFixed(2)} Hz ＋ 整數倍泛音`,500,36,24,C.ink,'center',800);
    text(ctx,'彩色虛線＝各頻率分量　｜　深青粗實線＝疊合後波形',75,78,18,C.ink,'left',750);text(ctx,`固定時間窗 ${(windowSeconds*1000).toFixed(0)} ms`,940,78,16,C.muted,'right');line(ctx,[75,225],[940,225],C.line,1);
    h.forEach((a,j)=>{ctx.beginPath();for(let i=0;i<=865;i++){const sec=i/865*windowSeconds-t*.00045,phase=TAU*(j+1)*o.fundamental*sec,y=225-92*(a/norm)*Math.sin(phase);if(i)ctx.lineTo(75+i,y);else ctx.moveTo(75+i,y);}ctx.strokeStyle=colors[j%colors.length];ctx.lineWidth=1.7;ctx.setLineDash([7,6]);ctx.stroke();ctx.setLineDash([]);});
    ctx.beginPath();for(let i=0;i<=865;i++){const sec=i/865*windowSeconds-t*.00045,phase=TAU*o.fundamental*sec,y=225-102*M.waveSum(phase,h);if(i)ctx.lineTo(75+i,y);else ctx.moveTo(75+i,y);}ctx.strokeStyle=C.teal;ctx.lineWidth=5;ctx.stroke();
    text(ctx,'基頻提高時，同一時間窗內所有波形都會變密',75,342,17,C.red,'left',750);text(ctx,'頻譜：柱色與上方虛線一一對應',75,375,18,C.ink,'left',750);line(ctx,[75,550],[940,550],C.ink,2);const bw=70,gap=28;h.forEach((a,i)=>{const x=105+i*(bw+gap),height=145*a;ctx.fillStyle=colors[i%colors.length];ctx.fillRect(x,550-height,bw,height);text(ctx,`${(i+1)}f`,x+bw/2,574,16,C.ink,'center',700);text(ctx,`${Math.round((i+1)*o.fundamental)} Hz`,x+bw/2,598,16,C.muted,'center');});
    ctx.strokeStyle=C.gold;ctx.lineWidth=3;ctx.strokeRect(98,550-145*h[0]-7,bw+14,145*h[0]+14);text(ctx,'基頻通常決定音高；最大峰不一定是基頻',940,342,17,C.red,'right',750);
  }
  const api={ship,bat,loudness,pitch,sweep,timbre};root.EchoMusicRenderers=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
