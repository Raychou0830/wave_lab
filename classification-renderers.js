var ClassificationRenderers=(function(){
  'use strict';
  const M=ClassificationModels,P={ink:'#102632',text:'#d9e9ef',muted:'#9db5bf',cyan:'#69d9d0',gold:'#f3c567',red:'#ff9ca6',purple:'#c8adff',line:'#385361'};
  function text(c,s,x,y,size=19,color=P.text,align='left'){c.font=`${Math.max(size,16/Math.min(1,c.displayScale||1))}px system-ui,"Noto Sans CJK TC",sans-serif`;c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);}
  function line(c,x,y,xx,yy,color=P.line,width=1,dash=[]){c.beginPath();c.setLineDash(dash);c.moveTo(x,y);c.lineTo(xx,yy);c.strokeStyle=color;c.lineWidth=width;c.stroke();c.setLineDash([]);}
  function arrow(c,x,y,xx,yy,color=P.cyan,double=false){if(Math.hypot(xx-x,yy-y)<1)return;line(c,x,y,xx,yy,color,2.5);const a=Math.atan2(yy-y,xx-x);function tip(px,py,b){c.beginPath();c.moveTo(px,py);c.lineTo(px-10*Math.cos(b-.45),py-10*Math.sin(b-.45));c.lineTo(px-10*Math.cos(b+.45),py-10*Math.sin(b+.45));c.closePath();c.fillStyle=color;c.fill();}tip(xx,yy,a);if(double)tip(x,y,a+Math.PI);}
  function dot(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,M.TAU);c.fillStyle=color;c.fill();}
  function rect(c,x,y,w,h,fill,stroke){c.fillStyle=fill;c.fillRect(x,y,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.strokeRect(x,y,w,h);}}
  function clear(c){c.clearRect(0,0,1000,620);rect(c,0,0,1000,620,P.ink);}
  function curve(c,fn,base,scale,color,width=3,dash=[]){c.beginPath();for(let i=0;i<=500;i++){const x=i/500*8,px=90+x*100,py=base-fn(x)*scale;if(i)c.lineTo(px,py);else c.moveTo(px,py);}c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
  function medium(c,t,o){
    clear(c);const m=M.medium(o),isSound=o.view!=='light',isLight=o.view!=='sound',elapsed=Math.max(0,t-o.pulse)*.001;
    const names={air:'空氣',water:'水',ice:'冰',vacuum:'真空',mixture:'水與冰共存'};
    text(c,`密閉容器 · ${names[m.phase]}`,70,38,22);text(c,'聲源與偵測器都在容器內',70,73,18,P.muted);
    const fills={air:'#18313e',water:'#173f53',ice:'#36586a',vacuum:'#11222f',mixture:'#284c60'};
    rect(c,55,108,890,385,fills[m.phase],'#75909e');
    if(m.phase==='ice'||m.phase==='mixture')for(let i=0;i<11;i++)line(c,70+i*80,110,100+i*80,490,'#779ca94d',1);
    const density=m.phase==='vacuum'?0:m.phase==='air'?Math.ceil(72*o.air):100;
    for(let i=0;i<density;i++){let x=80+((i*137)%820);const y=125+((i*97)%345);if(isSound&&m.sound!==null){const rel=x-(205+elapsed*m.sound*595);x+=5*Math.sin(rel/15)*Math.exp(-(rel*rel)/3600)*m.signal;}dot(c,x,y,2,m.phase==='ice'?'#b3d2df':'#7b9fa571');}
    // The ideal clock continues to move even without a transmission medium.
    c.save();c.translate(2*Math.sin(t*30),0);rect(c,80,195,105,98,'#d7e4e5');dot(c,132,243,34,'#193b48');line(c,132,243,132+21*Math.sin(t*8),243-21*Math.cos(t*8),P.gold,3);dot(c,106,190,15,P.gold);dot(c,158,190,15,P.gold);c.restore();
    text(c,'鬧鐘',132,322,20,P.gold,'center');rect(c,82,380,120,32,'#456270');rect(c,181,383,20,26,P.red);text(c,'雷射筆',140,448,20,P.red,'center');
    rect(c,815,185,65,100,'#243f4c','#98b5be');text(c,'聲音',848,313,18,P.text,'center');rect(c,815,361,65,70,'#243f4c','#98b5be');text(c,'光',848,457,18,P.text,'center');
    if(isSound&&m.sound!==null){const fraction=elapsed*m.sound;if(fraction<1){const x=205+fraction*595;line(c,x,160,x,335,`rgba(105,217,208,${m.signal})`,7);for(let j=1;j<4;j++)line(c,x-j*15,175,x-j*15,320,`rgba(105,217,208,${(.4-j*.08)*m.signal})`,3);}if(fraction>=1){dot(c,848,236,15,`rgba(105,217,208,${m.signal})`);text(c,m.signal<.7?'微弱訊號':'已接收',660,187,19,P.cyan);}}
    if(isSound&&m.phase==='vacuum')text(c,'沒有介質，聲音無法傳播',490,246,22,P.gold,'center');
    if(m.phase==='mixture')text(c,'凝固中：暫停測量單一介質的速率',500,250,21,P.gold,'center');
    if(isLight&&m.light!==null){line(c,202,396,815,396,P.red,3,[8,7]);if(elapsed*m.light>=1){dot(c,848,396,13,P.red);text(c,'已接收',660,352,19,P.red);}}
    arrow(c,205,534,815,534);text(c,'聲源 → 偵測器：1 m',510,567,20,P.cyan,'center');
    text(c,'光路虛線為輔助線；真空中從側面看不到懸空光束。',70,603,18,P.muted);
  }
  function direction(c,t,o){
    clear(c);const kinds=o.kind==='both'?['transverse','longitudinal']:[o.kind];
    for(let row=0;row<kinds.length;row++){
      const longitudinal=kinds[row]==='longitudinal',top=kinds.length===1?50:row*290+20,base=top+155;
      text(c,longitudinal?'縱波：兩個方向平行':'橫波：兩個方向垂直',65,top+18,23,P.text);
      if(o.direction===1)arrow(c,650,top+56,885,top+56,P.cyan);else arrow(c,885,top+56,650,top+56,P.cyan);
      text(c,'能量傳播方向',770,top+90,18,P.cyan,'center');line(c,90,base,900,base,P.line,1,[5,7]);
      for(let j=0;j<45;j++){const x=j*8/44,p=M.direction(x,t,o,longitudinal);const px=95+p.x*96,py=base-p.y*73;if(j===22){line(c,95+x*96,base,px,py,P.gold,2);dot(c,px,py,9,P.gold);}else dot(c,px,py,4.5,P.cyan);}
      const mark=M.direction(4,t,o,longitudinal),mx=95+mark.x*96,my=base-mark.y*73;
      if(longitudinal)arrow(c,mx-48,base+45,mx+48,base+45,P.gold,true);else arrow(c,930,base-50,930,base+50,P.gold,true);
      text(c,'質點振動方向',460,top+247,19,P.gold,'center');
      if(kinds.length===1)text(c,longitudinal?'壓縮與疏鬆向前傳；每個質點只在原位附近左右振動。':'波形向前傳；每個質點只在原位附近上下振動。',70,440,21,P.muted);
    }
    if(kinds.length===1)text(c,'金色點是同一個質點；方向箭頭表示振動軸。',70,550,20,P.gold);
  }
  function energy(c,t,o){
    clear(c);const reflection=o.kind==='reflection',custom=o.kind==='custom',only=o.resultOnly||o.kind==='travel';
    const names=reflection?['入射波 →','← 反射波（反相）','疊加結果']:['右行波 →','← 左行波','疊加結果'];
    const colors=[P.cyan,P.red,o.kind==='travel'?P.cyan:P.purple],overlay=!only&&o.layout==='overlay';const rows=only?[2]:[0,1,2];
    rows.forEach((index,row)=>{
      const base=only||overlay?310:145+row*172,scale=only||overlay?80:24;
      text(c,o.kind==='travel'?'行進波 →':names[index],overlay?72+row*300:72,only||overlay?45:base-93,22,colors[index]);
      line(c,90,base,890,base,P.line,1,[5,7]);
      const field=x=>{const p=M.energy(x,t,o);return index===0?p.incident:index===1?p.reflected:p.sum;};
      curve(c,field,base,scale,colors[index],index===2?3.5:2.2,overlay&&index!==2?[7,5]:[]);
      if(index===2&&M.standing(o,t)){for(const x of M.nodes(o,t)){dot(c,90+100*x,base,5,P.gold);}}
      if(reflection){line(c,890,base-(only||overlay?220:74),890,base+(only||overlay?220:74),'#adc0c7',4);for(let j=-3;j<=3;j++)line(c,890,base+j*20,908,base+j*20-15,'#7897a5');}
      if(!only&&!overlay&&row<2)line(c,60,base+72,940,base+72,'#ffffff12');
    });
    if(overlay||only){for(let x=0;x<=8;x+=2)text(c,String(x),90+x*100,548,18,P.muted,'center');text(c,'m',960,548,18,P.muted,'right');if(overlay)text(c,'同一位置：青色位移 ＋ 紅色位移 ＝ 紫色合成位移',70,88,18,P.muted);}
    if(reflection){text(c,'固定牆',940,36,18,P.muted,'right');if(!M.standing(o,t))text(c,t<4?'波尚未抵達牆面':'反射正在展開；稍後形成穩定波節',500,584,20,P.gold,'center');else text(c,'金色點：波節，位置固定且位移始終為 0',500,584,20,P.gold,'center');}
    else if(custom)text(c,M.standing(o,t)?'等振幅、等頻率、反向傳播 → 理想駐波':'振幅或頻率不同 → 一般疊加，非純駐波',500,584,20,P.gold,'center');
    else{text(c,'波形持續穿過觀察窗，沒有牆面或回捲箭頭。',70,555,20,P.muted);arrow(c,650,115,880,115);}
  }
  function particles(c,t,o){
    clear(c);text(c,'每個藍點代表同一個質點',65,45,23,P.text);
    if(Number(o.direction)===1)arrow(c,650,90,895,90);else arrow(c,895,90,650,90);
    text(c,'波與能量的傳播方向',770,133,19,P.cyan,'center');
    const base=345,scale=100,px=x=>75+x*85;
    line(c,75,base,925,base,P.line,1,[5,6]);
    function profile(time,color,dash){c.beginPath();for(let j=0;j<=500;j++){const x=j/50,p=M.particle(x,time,o);if(j)c.lineTo(px(x),base-scale*p.y);else c.moveTo(px(x),base-scale*p.y);}c.strokeStyle=color;c.lineWidth=2;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
    if(o.ghosts){profile(t-.20,'#8da5af',[5,7]);profile(t+.20,'#8da5af',[5,7]);}profile(t,P.cyan,[]);
    const n=Number(o.count);for(let j=0;j<n;j++){const x=10*j/(n-1),p=M.particle(x,t,o),y=base-scale*p.y;line(c,px(x),base,px(x),y,'#45626d',1,[3,7]);if(o.arrows&&Math.abs(p.vy)>.02){const len=Math.min(44,Math.abs(p.vy)*30);arrow(c,px(x),y,px(x),y-Math.sign(p.vy)*len,P.red);}dot(c,px(x),y,j===(n-1)/2?8:4.5,j===(n-1)/2?P.gold:P.cyan);}
    const p=M.particle(5,t,o);line(c,px(5),186,px(5),440,'#f3c56766',1,[5,8]);text(c,'A',px(5),473,23,P.gold,'center');
    text(c,'紅箭頭：此刻的質點速度（向上／向下）',65,535,20,P.red);
    text(c,'金色 A 點的水平位置固定；零速度時不畫紅箭頭。',65,578,19,P.gold);
  }
  return {medium,direction,energy,particles};
})();
