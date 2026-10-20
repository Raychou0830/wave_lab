/* Canvas renderers for echo and musical-sound laboratories. */
(function(root){
  'use strict';
  const M=root.EchoMusicModels,TAU=Math.PI*2;
  const C={ink:'#16323c',muted:'#60727a',teal:'#268577',teal2:'#73b9ad',gold:'#e7ad39',red:'#c85b55',paper:'#fbfaf5',line:'#d7ddd9',blue:'#3d7f9a'};
  function begin(ctx){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.fillStyle=C.paper;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.lineCap='round';ctx.lineJoin='round';}
  function text(ctx,s,x,y,size=18,color=C.ink,align='left',weight=500){ctx.fillStyle=color;ctx.font=`${weight>=700?'700':'500'} ${size}px system-ui, "Noto Sans CJK TC", sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);}
  function line(ctx,a,b,color=C.ink,width=2,dash=[]){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
  function arrow(ctx,a,b,color=C.teal,label=''){line(ctx,a,b,color,3);const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]-14*Math.cos(ang-.45),b[1]-14*Math.sin(ang-.45));ctx.lineTo(b[0]-14*Math.cos(ang+.45),b[1]-14*Math.sin(ang+.45));ctx.closePath();ctx.fill();if(label)text(ctx,label,(a[0]+b[0])/2,(a[1]+b[1])/2-20,18,color,'center',700);}
  function card(ctx,x,y,w,h,title,value,accent=C.teal){ctx.fillStyle='#fff';ctx.strokeStyle=C.line;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x,y,w,h,10);ctx.fill();ctx.stroke();text(ctx,title,x+16,y+22,16,C.muted,'left',600);text(ctx,value,x+16,y+53,22,accent,'left',750);}
  function shipIcon(ctx,x,y){ctx.fillStyle=C.ink;ctx.beginPath();ctx.moveTo(x-28,y);ctx.lineTo(x+31,y);ctx.lineTo(x+20,y+18);ctx.lineTo(x-18,y+18);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(x-11,y-18,26,18);ctx.fillStyle=C.gold;ctx.fillRect(x+2,y-28,4,10);}
  function soundRing(ctx,x,y,r,alpha=1){ctx.strokeStyle=`rgba(231,173,57,${alpha})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r,-.65,.65);ctx.stroke();}
  function ship(ctx,t,o){
    begin(ctx);const m=M.boat(o.shipSpeed,o.totalTime||10,340),local=t%(m.totalTime+1.4),W=ctx.canvas.width;
    const x0=130,wall=875,scale=(wall-x0)/m.initialDistance,shipX=x0+Math.min(local,m.totalTime)*m.speed*scale;
    ctx.fillStyle='#d7eef0';ctx.fillRect(0,310,W,310);for(let x=-40;x<W;x+=80){ctx.strokeStyle='rgba(38,133,119,.28)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,345);ctx.quadraticCurveTo(x+20,332,x+40,345);ctx.quadraticCurveTo(x+60,358,x+80,345);ctx.stroke();}
    ctx.fillStyle='#7e8b86';ctx.fillRect(wall,80,W-wall,450);ctx.fillStyle='#53635e';ctx.fillRect(wall,80,12,450);text(ctx,'岸壁',932,110,20,C.ink,'center',750);
    shipIcon(ctx,shipX,294);arrow(ctx,[shipX-55,242],[shipX+55,242],C.teal,`船速 ${m.speed.toFixed(0)} m/s`);
    let pulseX=shipX,phase='等待下一次發聲';
    if(local<=m.outboundTime){pulseX=x0+340*local*scale;phase='超音波前往岸壁';}
    else if(local<=m.totalTime){pulseX=wall-340*(local-m.outboundTime)*scale;phase='回聲返回移動中的船';}
    if(local<=m.totalTime){soundRing(ctx,pulseX,286,18+8*Math.sin(local*10),.95);soundRing(ctx,pulseX,286,34+8*Math.sin(local*10),.45);}
    arrow(ctx,[160,520],[835,520],C.ink,'到岸方向');
    const progress=Math.min(local/m.totalTime,1);line(ctx,[145,465],[860,465],C.line,8);line(ctx,[145,465],[145+715*progress,465],C.gold,8);ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(145+715*progress,465,9,0,TAU);ctx.fill();
    text(ctx,'發聲 0 s',145,492,16,C.muted,'center');text(ctx,`岸邊收到 ${m.outboundTime.toFixed(2)} s`,145+715*m.outboundTime/m.totalTime,492,16,C.muted,'center');text(ctx,`船收到 ${m.totalTime.toFixed(1)} s`,860,492,16,C.muted,'center');
    text(ctx,phase,500,54,24,C.ink,'center',750);text(ctx,`動畫 t = ${Math.min(local,m.totalTime).toFixed(2)} s`,500,88,17,C.muted,'center');
    card(ctx,30,118,235,78,'發聲時離岸',`${m.initialDistance.toFixed(0)} m`);card(ctx,280,118,235,78,'聲波到岸時間',`${m.outboundTime.toFixed(2)} s`);card(ctx,530,118,210,78,'此前船行距離',`${m.shipBeforeReflection.toFixed(1)} m`);card(ctx,755,118,215,78,'收到時離岸',`${m.distanceAtReception.toFixed(0)} m`,C.gold);
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
  function loudness(ctx,t,o){
    begin(ctx);const box={left:80,right:740,top:75,bottom:545},project=root.Wave3D.camera(o.camera,[0,0,0],{x:[-5,5],y:[-5,5],z:[-5,5]},box);const s=M.sphere(o.distance,1);
    for(let k=0;k<4;k++){const r=.55+((t*.48+k*.25)%1)*4.45;ring3D(ctx,project,r,'pulse',.2+.5*(1-r/5));}
    ring3D(ctx,project,o.distance,'main',.9);const center=project(0,0,0),obs=project(o.distance,0,0);ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(center[0],center[1],11,0,TAU);ctx.fill();ctx.fillStyle=C.teal;ctx.beginPath();ctx.arc(obs[0],obs[1],10,0,TAU);ctx.fill();line(ctx,center,obs,C.teal,2,[8,7]);
    text(ctx,'聲源',center[0],center[1]-27,18,C.ink,'center',750);text(ctx,`觀察點 r = ${o.distance.toFixed(1)} m`,obs[0],obs[1]-27,17,C.teal,'center',700);
    text(ctx,'同一份聲功率，分散到愈大的球面',500,35,24,C.ink,'center',750);
    card(ctx,770,115,200,86,'球面面積 4πr²',`${s.area.toFixed(1)} m²`);card(ctx,770,220,200,86,'相對聲強 1/r²',`${(s.relativeIntensity*100).toFixed(1)}%`,C.gold);card(ctx,770,325,200,86,'距離加倍時',`聲強變 1/4`,C.teal);
    text(ctx,'自由場中的點聲源模型',870,455,17,C.muted,'center',650);text(ctx,'聲強 ∝ 1 / r²',870,490,23,C.ink,'center',800);text(ctx,'不是「總能量消失」',870,530,17,C.red,'center',700);
  }
  function axes(ctx,x,y,w,h,xLabel,yLabel){line(ctx,[x,y+h],[x+w,y+h],C.ink,2);line(ctx,[x,y],[x,y+h],C.ink,2);text(ctx,xLabel,x+w,y+h+26,16,C.muted,'right');text(ctx,yLabel,x-8,y-17,16,C.muted,'left');}
  function pitch(ctx,t,o){
    begin(ctx);const f=o.frequency,note=M.nearestNote(f);text(ctx,'頻率愈高，同一段時間內振動次數愈多',500,48,25,C.ink,'center',800);axes(ctx,80,130,840,300,'時間（20 ms）','振幅');
    ctx.beginPath();for(let i=0;i<=840;i++){const sec=i/840*.02,y=280-105*Math.sin(TAU*f*sec);if(i)ctx.lineTo(80+i,y);else ctx.moveTo(80+i,y);}ctx.strokeStyle=C.teal;ctx.lineWidth=4;ctx.stroke();
    card(ctx,105,500,230,80,'目前頻率',`${f.toFixed(2)} Hz`,C.gold);card(ctx,385,500,230,80,'最接近音名',`${note.name} ${note.cents>=0?'+':''}${note.cents.toFixed(0)} cent`);card(ctx,665,500,230,80,'20 ms 內週期數',`${(f*.02).toFixed(2)} 次`);
  }
  function sweep(ctx,t,o){
    begin(ctx);const phase=(t%o.duration)/o.duration;let f;if(o.sweepType==='shepard')f=110*Math.pow(2,(phase*4)%1);else f=o.start*Math.pow(o.end/o.start,phase);
    text(ctx,o.sweepType==='shepard'?'謝帕德音：多個八度交替淡入、淡出，造成持續上升錯覺':'一般掃頻：到達終點後重新開始',500,47,24,C.ink,'center',800);
    axes(ctx,90,120,820,330,'一輪時間','頻率（對數尺度）');
    const min=80,max=2400,toY=v=>450-Math.log(v/min)/Math.log(max/min)*300;
    [100,200,400,800,1600].forEach(v=>{const y=toY(v);line(ctx,[90,y],[910,y],C.line,1,[5,6]);text(ctx,`${v} Hz`,78,y,16,C.muted,'right');});
    if(o.sweepType==='shepard')for(let k=0;k<4;k++){ctx.beginPath();for(let i=0;i<=820;i++){const p=i/820,v=110*Math.pow(2,((p*4+k)%4));const y=toY(Math.min(v,max));if(i)ctx.lineTo(90+i,y);else ctx.moveTo(90+i,y);}ctx.strokeStyle=`rgba(38,133,119,${.22+k*.13})`;ctx.lineWidth=3;ctx.stroke();}
    else{ctx.beginPath();for(let i=0;i<=820;i++){const p=i/820,v=o.start*Math.pow(o.end/o.start,p),y=toY(v);if(i)ctx.lineTo(90+i,y);else ctx.moveTo(90+i,y);}ctx.strokeStyle=C.teal;ctx.lineWidth=4;ctx.stroke();}
    const px=90+820*phase,py=toY(Math.min(f,max));ctx.fillStyle=C.gold;ctx.beginPath();ctx.arc(px,py,10,0,TAU);ctx.fill();line(ctx,[px,450],[px,py],C.gold,2,[5,5]);
    card(ctx,330,510,340,76,'此刻主要頻率',`${f.toFixed(1)} Hz`,C.gold);
  }
  function timbre(ctx,t,o){
    begin(ctx);const h=M.HARMONICS[o.instrument]||M.HARMONICS.fork,names={fork:'音叉',flute:'長笛',clarinet:'單簧管',violin:'小提琴'};text(ctx,`${names[o.instrument]}：基頻 ${o.fundamental.toFixed(2)} Hz ＋ 整數倍泛音`,500,42,24,C.ink,'center',800);
    text(ctx,'疊合後的波形',75,92,18,C.ink,'left',750);line(ctx,[75,220],[940,220],C.line,1);ctx.beginPath();for(let i=0;i<=865;i++){const phase=i/865*TAU*3+t*TAU*.25,y=220-95*M.waveSum(phase,h);if(i)ctx.lineTo(75+i,y);else ctx.moveTo(75+i,y);}ctx.strokeStyle=C.teal;ctx.lineWidth=4;ctx.stroke();
    text(ctx,'頻譜：每根柱代表一個頻率成分',75,358,18,C.ink,'left',750);line(ctx,[75,550],[940,550],C.ink,2);const bw=70,gap=28;h.forEach((a,i)=>{const x=105+i*(bw+gap),height=155*a;ctx.fillStyle=i===0?C.gold:C.teal2;ctx.fillRect(x,550-height,bw,height);text(ctx,`${(i+1)}f`,x+bw/2,574,16,C.ink,'center',700);text(ctx,`${Math.round((i+1)*o.fundamental)} Hz`,x+bw/2,598,16,C.muted,'center');});
    ctx.strokeStyle=C.gold;ctx.lineWidth=3;ctx.strokeRect(98,550-155*h[0]-7,bw+14,155*h[0]+14);text(ctx,'基頻通常決定音高；最大峰不一定是基頻',940,335,18,C.red,'right',750);
  }
  const api={ship,bat,loudness,pitch,sweep,timbre};root.EchoMusicRenderers=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
