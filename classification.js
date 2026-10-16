var WaveClassification=(function(){
  'use strict';
  const M=ClassificationModels,$=id=>document.getElementById(id),modes=['medium','direction','energy','particles'];
  const state={active:false,mode:'medium',t:0,speed:1,playing:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,options:Object.fromEntries(modes.map(m=>[m,M.defaults(m)])),records:{}};
  const content={
    medium:{title:'傳播需要介質嗎？',tag:'力學波／非力學波',description:'把雷射筆與鬧鐘放入密閉容器，換成空氣、水、冰或真空。觀察訊號能否抵達，也比較通過同一段距離的時間。',legend:[['cyan','聲音：力學波'],['red','雷射光：非力學波']],task:'四種環境，都能收到嗎？',steps:['先在空氣中按「同時發出訊號」，比較聲音和光抵達的時間。','抽成真空，再發出訊號：鬧鐘仍在振動，但接收端收到聲音了嗎？','改裝水，再降溫結冰；把每種穩定狀態加入觀察紀錄，比較速率。'],principle:'聲音需要介質，光不需要',text:'<p><strong>力學波（亦稱機械波）</strong>需要介質的相互作用來傳遞擾動，例如聲波、彈簧波。<strong>非力學波</strong>不需物質介質，例如光與其他電磁波，也包括重力波。</p><p>聲音可以在氣體、液體與固體中傳播。本例的聲速為冰 ＞ 水 ＞ 空氣，但不能推論所有固體都比所有液體快。光可在真空傳播，在本例的水與冰中比真空慢。</p>',notes:'<p>容器內使用理想化、可在各介質正常運作的鬧鐘、雷射與偵測器；忽略外壁、支架和電線的傳聲，未模擬真實裝置進水或結冰後故障。容器理想化為可微調容積，忽略凝固膨脹造成的壓力改變；水與冰的速率採近大氣壓條件。動畫沒有播放聲音，以視覺化的接收訊號呈現；接收器不等同人在水或冰中的耳朵。</p><p>聲音、光使用同一傳播慢動作比例：1 動畫秒＝1 毫秒；1 m 光行時間只有數奈秒，因此在第一個非零影格就已抵達，不另把光刻意放慢。抽氣、降溫與相變的操作時間另為示意，不代表真實熱力學速率。各物件大小、分子數、聲壓與振幅皆不按實際比例。</p><p>空氣固定 20°C，以理想氣體近似，減壓主要讓可傳遞的訊號變弱；在連續介質適用範圍內，聲速不隨密度簡單降到零。極稀薄氣體的聲學偏離未納入；100% 真空沒有聲速，而非聲速為 0。圖示訊號強度只作定性比較。</p><p>水的數值以 UNESCO / Chen–Millero 純水、近表面壓力項估算（0–20°C）。冰的縱向聲速採代表值約 3,800 m/s，未建模其溫度、晶向與壓力依賴。凝固中為水、冰混合，沒有指定單一均勻速率；凝固完成才恢復測量。</p><p>光速使用 c/n，c＝299,792,458 m/s。可見光代表折射率：空氣 1.00027、水 1.333、冰 1.31；不含波長、溫度、色散、吸收及界面折射。光行時間亦採此近似，未區分群速度與相速度。</p>'},
    direction:{title:'怎麼振，往哪裡傳？',tag:'縱波／橫波',description:'同時比較兩排質點：青色箭頭表示能量傳播方向，金色雙箭頭表示質點的振動軸。切換傳播方向，再盯著同一個金色點。',legend:[['cyan','能量傳播方向'],['gold','質點與振動軸']],task:'兩支箭頭的夾角是多少？',steps:['比較橫波的上下振動與向右傳播：兩個方向相互垂直。','比較縱波的左右振動與向右傳播：兩個方向互相平行。','把傳播方向改成向左，觀察分類會不會改變。'],principle:'依振動方向與傳播方向的關係分類',text:'<p><strong>橫波：</strong>質點（或場）的振動方向垂直於傳播方向，例如繩上的橫波、真空中的電磁平面波。電磁波振動的是電場與磁場，不是空氣質點。</p><p><strong>縱波：</strong>質點的振動方向平行於傳播方向，例如空氣中的聲波、彈簧壓縮波。改變向左或向右傳播，不會改變平行或垂直的關係。</p><p>這個分類角度與「是否需要介質」不同；力學波可以是橫波，也可以是縱波。表面水波的質點通常同時有水平與垂直運動，不是這兩個純模型的簡單等同。</p>',notes:'<p>兩列使用同一示意波速 2.5、同一頻率，方便比較方向，並非真實材料的橫、縱波速相等。位移在局部平衡位置附近，沒有隨波整體流動；縱波位移受限，確保相鄰質點不穿越。金色雙箭頭表示振動的軸，並非此刻的速度方向；此刻速度可到下一組「每個質點怎麼動」觀察。</p>'},
    energy:{title:'前進、反射，再疊加',tag:'行進波／駐波',description:'先看行進波不斷前進，再加入固定牆。分開觀察入射、反射與合成波，或按「只看疊加結果」看哪些位置一直不動。',legend:[['cyan','入射／右行波'],['red','反射／左行波'],['purple','合成波'],['gold','波節']],task:'駐波是怎麼形成的？',steps:['先選「無限前進」，觀察波峰持續穿過觀察窗。','選「碰牆反射」，從 0 秒看入射波到牆後，反相的反射波逐漸返回。','按「跳到穩定駐波」，再按「只看疊加結果」；觀察金色波節是否移動。','到「兩個獨立波源」，把兩個波的頻率或振幅調成不同，觀察是否仍為純駐波。'],principle:'等頻率、等振幅、反向傳播',text:'<p>在同一直線上，兩個等頻率、等振幅、反向傳播的相干簡諧波疊加，可形成<strong>駐波</strong>。有些位置始終不動，稱為<strong>波節</strong>；相鄰波節距離為半個波長。波節之間振幅最大的地方是波腹。</p><p>固定端必須維持位移為零，所以反射波在牆面相對入射波<strong>反相</strong>。同一介質、靜止牆面反射不會自行改變頻率。因此不同頻率或振幅的操作放在「兩個獨立波源」，不把它當成牆面的反射。</p><p>理想純駐波的時間平均淨能量傳輸為零；兩個組成行進波仍分別向相反方向傳能。振幅不同時一般仍有淨傳能；頻率不同時通常不會留下固定的波節。</p>',notes:'<p>採一維、線性、無阻尼弦波模型；示意長度 L＝8 m、波速 v＝2 m/s。反射模式由左端持續送出正弦波，使用半週期的啟動包絡；反射波等到入射擾動走到固定牆，再沿路返回。只計一次右牆反射，不另外模擬左端反射或有限弦的共振累積；左端是理想主動波源。</p><p>反射公式：y入＝A g(t−x/v)，y反＝−A g[t−(2L−x)/v]；g(s) 在 s≤0 為 0，啟動後漸為 sin(2πfs)。在 x＝L，兩式逐時相消。待啟動前緣完全離開後，才標出穩態波節。</p><p>自由疊加：y₁＝A₁ sin[2πf₁(x/v−t)]，y₂＝A₂ sin[2πf₂(x/v＋t)＋φ]。相同 f、A 時為純駐波；相位差改變波節位置，不破壞純駐波。示意頻率與振幅均可讀為歸一化實驗參數。三列使用相同位移比例；只看結果時會放大圖形，並非物理振幅增加。</p>'},
    particles:{title:'每個質點怎麼動？',tag:'波形前進，質點局部振動',description:'沿用參考圖的波包與速度箭頭。藍色曲線向前移動，紅箭頭顯示每個質點當下向上或向下的速度；金色 A 點始終保有同一個水平位置。',legend:[['cyan','目前波形與質點'],['red','質點瞬時速度'],['gold','固定追蹤 A 點'],['rest','前後各 0.20 秒輪廓']],task:'波向右走，質點也向右走嗎？',steps:['暫停動畫，看波峰前方與後方的紅箭頭，有沒有不同？','逐格播放，跟著 A 點看它升起、到頂端、再回到平衡位置。','改成向左傳播；相同形狀的波包通過時，質點的上下速度如何改變？','切換週期波，觀察多個波峰持續通過，但各質點的水平位置仍保持不變。'],principle:'波形傳播速度，不等於質點速度',text:'<p>這是一個<strong>橫波</strong>示意：波形與能量沿水平方向傳遞；質點只沿垂直方向振動。紅箭頭畫的是瞬時速度，不是位移，也不是能量方向。</p><p>對向右傳播的波 y＝F(x−vt)，質點速度 ∂y/∂t＝−v ∂y/∂x；改成向左傳播時符號相反。因此，同一時刻的波形斜率與傳播方向，可以幫助判斷質點向上或向下。</p>',notes:'<p>波包使用高斯形 y＝A exp[−(x−x中心)²/(2σ²)]，σ＝0.7，波形以 1.2 示意單位/s 等速前進。所有質點的水平平衡位置固定，不以粒子沿曲線滑動來假裝傳播。脈衝完全離開觀察窗後，會在窗外重新進入，非牆面反射。</p><p>灰色虛線為 t−0.20 s 與 t＋0.20 s 的波形輪廓，非額外的波源，也不加入疊加。紅箭頭依解析時間導數決定方向與相對長度，過長會截短；零速度時省略。波包波峰的質點此刻速度為零，但不表示整個波包停下。參考圖僅作構圖參考，動畫由程式重繪。</p>'}
  };
  const canvas=$('cls-canvas'),ctx=canvas.getContext('2d');
  if(!ctx){$('cls-fallback').hidden=false;return {activate(){},hide(){},tick(){},resize(){}};}
  const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=1000*dpr;canvas.height=620*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const options=()=>state.options[state.mode];
  function segment(key,items,label){return `<div class="segmented cls-segment" role="group" aria-label="${label}">${items.map(([v,l])=>`<button data-cls-option="${key}" data-value="${v}" aria-pressed="${String(options()[key])===String(v)}">${l}</button>`).join('')}</div>`;}
  function slider(key,label,min,max,step,suffix=''){return `<label class="cls-slider" for="cls-${key}"><span>${label}</span><input data-cls-slider="${key}" id="cls-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${options()[key]}"><output id="cls-out-${key}" for="cls-${key}">${Number(options()[key]).toFixed(step<1?2:0)}${suffix}</output></label>`;}
  function action(key,label,extra=''){return `<button class="cls-action" data-cls-action="${key}" ${extra}>${label}</button>`;}
  function controls(){
    const o=options();let html='';
    if(state.mode==='medium'){
      html=segment('view',[['both','一起比較'],['sound','力學波：聲波'],['light','非力學波：光']],'顯示的波')+'<div class="cls-control-line">'+action('air','裝入空氣（20°C）')+action('water','裝入水（20°C）')+'</div>';
      if(o.material==='air')html+=`<label class="cls-slider" for="cls-pressure"><span>氣壓比例（20°C）</span><input id="cls-pressure" type="range" min="0" max="100" step="1" value="${Math.round(o.air*100)}"><output id="cls-pressure-out">${Math.round(o.air*100)}%</output></label><div class="cls-control-line">${action('pump','抽成真空')}${action('restore','補回空氣')}</div>`;
      else html+='<div class="cls-control-line">'+action('cool','降溫並結冰')+action('thaw','恢復為水（20°C）')+'</div><p class="cls-control-note">降溫過程：20°C 水 → 0°C 凝固 → −10°C 冰。操作時間為示意。</p>';
      html+='<div class="cls-control-line">'+action('pulse','同時發出訊號')+action('record','加入觀察紀錄')+'</div><p class="cls-control-note">傳播慢動作：1 動畫秒＝1 毫秒，聲音與光共用比例。光通常在第一個影格就抵達。</p>';
    }
    if(state.mode==='direction')html=segment('kind',[['both','並排比較'],['transverse','橫波'],['longitudinal','縱波']],'振動方式')+segment('direction',[[1,'向右傳播 →'],[-1,'← 向左傳播']],'傳播方向')+slider('amplitude','位移幅度',.3,1.4,.1)+slider('frequency','示意頻率（Hz）',.35,1,.05);
    if(state.mode==='energy'){
      html=segment('kind',[['travel','無限前進'],['reflection','碰牆反射'],['custom','兩個獨立波源']],'能量傳播模型');
      if(o.kind!=='travel')html+=segment('layout',[['overlay','同圖疊加'],['rows','分三列比較']],'組成波比較方式');
      html+='<div class="cls-control-line">'+slider('a1',o.kind==='custom'?'右行波振幅':'入射波振幅',.2,1.4,.1)+slider('f1',o.kind==='custom'?'右行波頻率（Hz）':'入射波頻率（Hz）',.25,1.25,.05)+'</div>';
      if(o.kind==='custom')html+='<div class="cls-control-line">'+slider('a2','左行波振幅',.2,1.4,.1)+slider('f2','左行波頻率（Hz）',.25,1.25,.05)+slider('phase','左行波相位（°）',0,360,15)+'</div><div class="cls-control-line">'+action('match','兩波設為等振幅、等頻率')+'</div>';
      if(o.kind!=='travel')html+='<div class="cls-control-line">'+action('result',o.resultOnly?'分開看組成波':'只看疊加結果',`aria-pressed="${o.resultOnly}"`)+(o.kind==='reflection'?action('steady','跳到穩定駐波'):'')+'</div>';
      html+='<p class="cls-control-note">示意波速固定 2 m/s；觀察範圍 0–8 m。頻率改變時，波長跟著改變。</p>';
    }
    if(state.mode==='particles')html=segment('shape',[['pulse','單一波包'],['sine','週期波']],'波形')+segment('direction',[[1,'向右傳播 →'],[-1,'← 向左傳播']],'傳播方向')+slider('amplitude','位移幅度',.3,1.4,.1)+(o.shape==='sine'?slider('frequency','示意頻率（Hz）',.25,1,.05):'')+segment('count',[[21,'21 個點'],[41,'41 個點'],[61,'61 個點']],'質點數量')+`<label><input id="cls-ghosts" type="checkbox" ${o.ghosts?'checked':''}> 前後輪廓</label><label><input id="cls-arrows" type="checkbox" ${o.arrows?'checked':''}> 瞬時速度箭頭</label>`;
    $('cls-controls').innerHTML=html;
    $('cls-controls').querySelectorAll('[data-cls-option]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.clsOption;o[key]=['direction','count'].includes(key)?Number(b.dataset.value):b.dataset.value;if(['kind','direction','shape'].includes(key))state.t=0;controls();draw();}));
    $('cls-controls').querySelectorAll('[data-cls-slider]').forEach(e=>e.addEventListener('input',()=>{const key=e.dataset.clsSlider;o[key]=Number(e.value);$('cls-out-'+key).textContent=Number(e.value).toFixed(key==='phase'?0:2);if(state.mode==='energy')state.t=0;draw();}));
    $('cls-controls').querySelectorAll('[data-cls-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.clsAction)));
    if($('cls-pressure'))$('cls-pressure').addEventListener('input',e=>{o.air=Number(e.target.value)/100;o.action=null;o.pulse=state.t;$('cls-pressure-out').textContent=Math.round(o.air*100)+'%';draw();});
    for(const key of ['ghosts','arrows'])if($('cls-'+key))$('cls-'+key).addEventListener('change',e=>{o[key]=e.target.checked;draw();});
  }
  function act(key){
    const o=options();
    if(key==='air'||key==='restore'){o.material='air';o.air=1;o.temp=20;o.ice=0;o.action=null;o.pulse=state.t;}
    if(key==='water'||key==='thaw'){o.material='water';o.temp=20;o.ice=0;o.action=null;o.pulse=state.t;}
    if(key==='pump'){o.action='pump';state.playing=true;}
    if(key==='cool'){o.action='cool';state.playing=true;}
    if(key==='pulse'){o.pulse=state.t;state.playing=true;}
    if(key==='record'){const m=M.medium(o);if(m.phase!=='mixture'){state.records[m.phase]={...m,temp:o.temp,air:o.air};renderRecords();$('cls-announcement').textContent='已記錄'+phaseName(m.phase)+'的測量結果。';}}
    if(key==='result')o.resultOnly=!o.resultOnly;
    if(key==='steady'){state.t=2*M.length/M.speed+2/o.f1;state.playing=false;}
    if(key==='match'){o.a2=o.a1;o.f2=o.f1;state.t=0;}
    controls();sync();draw();
  }
  const phaseName=p=>({air:'空氣',water:'水',ice:'冰',vacuum:'真空',mixture:'水與冰共存'}[p]);
  const soundValue=m=>m.phase==='vacuum'?'不傳播（無聲速）':m.phase==='mixture'?'凝固中，暫不指定':`約 ${Math.round(m.sound).toLocaleString()} m/s`;
  const lightValue=m=>m.light===null?'凝固中，暫不指定':`約 ${(m.light/1e6).toFixed(1)} × 10⁶ m/s`;
  const timeValue=s=>s===null?'—':s<1e-6?`${(s*1e9).toFixed(2)} ns`:`${(s*1e3).toFixed(3)} ms`;
  const card=(label,value)=>`<div><span>${label}</span><strong>${value}</strong></div>`;
  function readouts(){
    const o=options();let html='';
    if(state.mode==='medium'){
      const m=M.medium(o),elapsed=Math.max(0,state.t-o.pulse)*.001,mixture=m.phase==='mixture';
      html=card('目前環境',`${phaseName(m.phase)} · ${o.temp.toFixed(0)}°C`)+card(o.material==='air'?'氣壓比例':'凝固比例',o.material==='air'?`${Math.round(o.air*100)}%（1 atm 為 100%）`:`${Math.round(o.ice*100)}%`)+card('聲音傳播速率',soundValue(m))+card('可見光傳播速率',lightValue(m))+card('聲音通過 1 m',timeValue(m.soundTime))+card('光通過 1 m',timeValue(m.lightTime));
      $('cls-status-text').textContent=mixture?'水、冰共存，待凝固完成再測量。':`傳播經過 ${(elapsed*1e3).toFixed(2)} ms · 聲音${m.sound===null?'無法傳播':elapsed>=m.soundTime?'已抵達':'尚未抵達'} · 光${elapsed>=m.lightTime?'已抵達':'尚未抵達'}。`;
      $('cls-controls').querySelectorAll('[data-cls-action]').forEach(b=>{b.disabled=(['pulse','record'].includes(b.dataset.clsAction)&&(mixture||o.action!==null))||(b.dataset.clsAction==='pump'&&(o.action!==null||o.air===0))||(b.dataset.clsAction==='cool'&&(o.action!==null||o.temp<=-10));});
      if($('cls-pressure')){$('cls-pressure').value=Math.round(o.air*100);$('cls-pressure-out').textContent=Math.round(o.air*100)+'%';}
    }
    if(state.mode==='direction'){html=card('分類依據','振動方向與傳播方向的關係')+card('橫波','垂直 ⊥')+card('縱波','平行 ∥');$('cls-status-text').textContent='振動方向看金色雙箭頭，能量方向看青色單箭頭。改變傳播方向不會改變分類。';}
    if(state.mode==='energy'){
      const standing=M.standing(o,state.t),n=M.nodes(o,state.t);
      html=card('目前情形',o.kind==='travel'?'行進波':standing?'純駐波':o.kind==='reflection'?'反射建立中':'一般疊加')+card('右行波波長',`${(M.speed/o.f1).toFixed(2)} m`)+card(o.kind==='custom'?'左行波波長':'固定端',o.kind==='custom'?`${(M.speed/o.f2).toFixed(2)} m`:o.kind==='reflection'?'x＝8 m，位移為 0':'沒有牆面');
      $('cls-status-text').textContent=standing?`波節 x＝${n.map(x=>x.toFixed(2)).join('、')} m；固定位置不隨時間前進。`:o.kind==='reflection'?'牆面反射波與入射波等頻率、等振幅；反射要等波到達牆後才開始。':o.kind==='custom'?'試著讓兩波等頻率、等振幅；相位只改變波節的位置。':'波峰穿越觀察窗，質點並未隨波峰一路前進。';
    }
    if(state.mode==='particles'){const p=M.particle(5,state.t,o);html=card('A 點水平位置','x＝5.00（固定）')+card('A 點垂直位移',p.y.toFixed(3))+card('A 點瞬時速度',Math.abs(p.vy)<.005?'約 0':`${p.vy>0?'向上':'向下'} ${Math.abs(p.vy).toFixed(3)}`);$('cls-status-text').textContent='位置、速度皆採示意單位。逐格觀察：波前進時，A 點的水平位置一直不變。';}
    const box=$('cls-readouts');if(box.innerHTML!==html)box.innerHTML=html;
  }
  function renderRecords(){
    $('cls-record-body').innerHTML=['air','water','ice','vacuum'].map(p=>{const r=state.records[p];return `<tr><th scope="row">${phaseName(p)}</th><td>${r?(p==='air'?`20°C，${Math.round(r.air*100)}%`:`${Math.round(r.temp)}°C`):'尚未記錄'}</td><td>${r?soundValue(r):'—'}</td><td>${r?lightValue(r):'—'}</td></tr>`;}).join('');
  }
  function draw(){if(!state.active)return;ctx.displayScale=Math.min(1,(canvas.getBoundingClientRect().width||1000)/1000);ClassificationRenderers[state.mode](ctx,state.t,options());$('cls-time').textContent=state.t.toFixed(2);readouts();}
  function sync(){$('cls-play').textContent=state.playing?'❚❚ 暫停':'▶ 播放';$('cls-play').setAttribute('aria-label',state.playing?'暫停分類動畫':'播放分類動畫');$('cls-running').textContent=state.playing?'播放中':'已暫停';$('cls-dot').classList.toggle('paused',!state.playing);}
  function activate(mode){
    const target=modes.includes(mode)?mode:'medium',changed=target!==state.mode;state.mode=target;state.active=true;if(changed){state.t=0;if(target==='medium')options().pulse=0;}
    const d=content[target];$('cls-title').textContent=d.title;$('cls-tag').textContent=d.tag;$('cls-description').textContent=d.description;canvas.setAttribute('aria-label',d.title+'。'+d.description);
    document.querySelectorAll('[data-cls-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.clsMode===target)));
    $('cls-legend').innerHTML=d.legend.map(([color,label])=>`<span><i class="${color}"></i>${label}</span>`).join('');
    $('cls-task-title').textContent=d.task;$('cls-tasks').innerHTML=d.steps.map(s=>`<li>${s}</li>`).join('');$('cls-principle-title').textContent=d.principle;$('cls-principle').innerHTML=d.text;$('cls-notes').innerHTML=d.notes;$('cls-records').hidden=target!=='medium';$('cls-announcement').textContent='';
    controls();sync();resize();renderRecords();
  }
  function tick(dt){if(!state.active||!state.playing||document.hidden)return;const delta=dt*state.speed;state.t+=delta;if(state.mode==='medium'){const o=options(),moving=o.action!==null;if(moving){M.environment(o,delta);o.pulse=state.t;}else if(state.t-o.pulse>5)o.pulse=state.t;}draw();}
  function resize(){if(!state.active)return;draw();$('cls-pan-hint').hidden=canvas.getBoundingClientRect().width<=$('cls-stage').clientWidth+2;}
  document.querySelectorAll('[data-cls-mode]').forEach(b=>b.addEventListener('click',()=>{const route='#types/'+b.dataset.clsMode;if(location.hash===route)activate(b.dataset.clsMode);else location.hash=route;}));
  $('cls-play').addEventListener('click',()=>{state.playing=!state.playing;sync();});
  $('cls-step').addEventListener('click',()=>{state.playing=false;state.t+=1/30;if(state.mode==='medium'&&options().action){M.environment(options(),1/30);options().pulse=state.t;}sync();draw();});
  $('cls-reset').addEventListener('click',()=>{state.options[state.mode]=M.defaults(state.mode);state.t=0;state.speed=1;state.playing=false;$('cls-speed').value=1;$('cls-speed-out').textContent='1.0×';controls();sync();draw();});
  $('cls-speed').addEventListener('input',e=>{state.speed=Number(e.target.value);$('cls-speed-out').textContent=state.speed.toFixed(1)+'×';});
  $('cls-clear-records').addEventListener('click',()=>{state.records={};renderRecords();$('cls-announcement').textContent='已清除觀察紀錄。';});
  $('cls-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('cls-panel').requestFullscreen();}catch(e){$('cls-fullscreen').title='此瀏覽器無法開啟全螢幕';}});
  window.addEventListener('resize',resize);document.addEventListener('fullscreenchange',resize);
  if(window.ResizeObserver){new window.ResizeObserver(resize).observe(canvas);}
  return {activate,hide(){state.active=false;},tick,resize};
})();
