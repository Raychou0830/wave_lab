(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const modes = ['water','sound','em','spring','seismic','gravity'];
  const data = {
    water: {
      en:'WATER WAVES',title:'水波',tag:'機械波・表面波',description:'波峰向前移動，水卻在原位附近運動。用 A、B、C 三個點，找出水中質點的軌跡。',
      observation:'盯著金色點，不只看波峰',steps:['選「深水近似」與「水中剖面」，看 A 點繞著平衡位置運動。','暫停後逐格播放，追蹤 A、B、C；比較不同深度的運動幅度。','切換「有限水深」，觀察橢圓軌跡；池底的質點還會上下動嗎？'],
      principle:'能量向前，質點局部繞行',text:'<p>表面水波的質點同時有<strong>水平與垂直位移</strong>。小振幅深水模型中，兩方向的振幅相等、相位相差四分之一週期，形成近似圓形軌道。</p><p>越深，運動越弱；淺水中軌跡較扁，接近池底時以水平往返為主。真實水波還可能有微小的淨漂移。</p>',
      question:'深水模型的 A 點會怎麼移動？',choices:['繞平衡位置運動','一路跟著波峰向右移動'],correct:0,feedback:'觀察完整一圈：A 點回到原來位置附近，向右傳播的是擾動。',
      notes:'<p>採用小振幅 Airy 波的質點軌道：深水振幅隨深度 d 以 exp(−kd) 衰減；淺水使用有限水深的 cosh / sinh 振幅分布，池底垂直位移為零。未加入二階 Stokes 漂移、破波、黏滯與表面張力。</p><p class="formula">uₓ = −aₓ sin(kx − ωt)，uᵧ = aᵧ cos(kx − ωt)<br>深水：aₓ = aᵧ = A e<sup>−kd</sup><br>有限水深：aₓ = A cosh[k(h−d)] / sinh(kh)，aᵧ = A sinh[k(h−d)] / sinh(kh)</p><p>此處「深水／淺水」用來比較軌道形狀；兩者以同一動畫節奏播放，並未計算色散關係 ω² = gk tanh(kh) 所決定的真實波速差異。水面斜視採立體投影，因此投影上的橢圓不等於原軌道必為橢圓。</p>'
    },
    sound:{
      en:'SOUND WAVES',title:'聲波',tag:'機械波・空氣中的縱波',description:'發聲體來回振動，造成空氣壓力與疏密變化；變化傳到耳膜，再由內耳轉換為神經訊號。',
      observation:'密的區域向前走，空氣點呢？',steps:['看左側發聲體來回振動，找出空氣中的「密」與「疏」。','盯著 A 點：它是前後往返，還是一路跑進耳朵？','觀察右側耳膜，再調整幅度與示意頻率，比較壓力變化。'],
      principle:'聲音的旅程，從振動開始',text:'<p>發聲體推擠與放鬆鄰近空氣，形成交替的<strong>壓縮與疏張</strong>。在空氣中，質點前後振動的方向與聲波傳播方向平行，所以是縱波。</p><p>耳膜受到壓力變化而振動；振動經聽小骨傳至內耳，毛細胞把刺激轉為神經訊號，大腦才形成聽覺。聲波需要介質，無法在真空中傳播。</p>',
      question:'傳到耳朵的主要是什麼？',choices:['從發聲體一路飛來的同一群空氣','空氣壓力與疏密變化'],correct:1,feedback:'空氣質點主要在局部前後振動；壓力變化向外傳播，耳膜受到這個變化而振動。',
      notes:'<p>用一維簡諧位移 u = A cos(kx − ωt) 畫出空氣質點；壓力擾動取正比於 −∂u/∂x，因此壓力與位移相差四分之一週期。疏密背景與標籤均由同一壓力模型計算，未另畫一條「上下起伏的空氣」。</p><p>空氣熱運動、反射、球面擴散與耳道共振未納入。耳膜為受壓力驅動的簡化位移示意，並非完整耳膜振動方程，也未描繪內耳構造。</p><p>示意頻率滑桿保留同一模型波速，因此頻率增加時波長縮短。可選的聆聽音為 220 × 示意頻率 / 0.65 Hz；動畫經放慢，與實際音訊不採同一時間比例。以動畫暫停或切換分頁時，示範音會停止。</p>'
    },
    em:{
      en:'ELECTROMAGNETIC WAVES',title:'電磁波',tag:'無需物質介質・橫波',description:'電場與磁場耦合，形成向前傳播的電磁波。轉動視角，觀察三個方向在空間中的關係。',
      observation:'三個方向，彼此垂直',steps:['紅色代表電場 E，青色代表磁場 B，箭頭指向傳播方向 x。','單獨顯示 E 或 B，再同時顯示；按住右鍵拖曳旋轉，或用正面、側面、俯視按鈕比較。','盯著粗箭頭與下方場值：同一位置的 E、B 是否同時達到零或極值？'],
      principle:'變化的場，彼此耦合',text:'<p>時間變化的磁場與電場有耦合關係，遵循 Maxwell 方程。在此線偏振平面波中，<strong>E ⟂ B</strong>，而且兩者都垂直於傳播方向。</p><p>兩場同相位振盪，能量沿 E × B 的方向傳播。畫面的兩條曲線表示各位置的場強；電磁波也能在真空中傳播。</p>',
      question:'此平面電磁波的 E、B 與傳播方向，有何關係？',choices:['E 與 B 平行，且沿傳播方向','三個方向彼此垂直'],correct:1,feedback:'在線偏振、真空平面波模型中，E ⟂ B，且 E、B 都垂直於傳播方向；兩場同相位。',
      notes:'<p>採真空中的線偏振平面波：E 沿 y 軸、B 沿 z 軸、傳播沿 +x 軸；兩者採相同相位，保證 E × B 沿 +x。畫面把 E 與 B 各自正規化後繪製，不能把圖上的相同長度理解成它們的 SI 數值相等；實際振幅滿足 E₀ = cB₀。</p><p>圖中箭頭表示某處的場向量，軌跡虛線表示場向量端點的振盪範圍，不是物質質點的路徑。立體投影在螢幕上未必呈 90°，可用座標軸與視角控制辨識空間的垂直關係。</p><p class="formula">E(x,t) = E₀ sin(kx−ωt) ŷ<br>B(x,t) = B₀ sin(kx−ωt) ẑ，E₀ = cB₀</p>'
    },
    spring:{
      en:'SPRING WAVES',title:'彈簧波',tag:'機械波・可橫可縱',description:'同一條彈簧，改變振動方向，就能展示橫波或縱波。比較波形前進與線圈運動的方向。',
      observation:'換個振動方向，會發生什麼？',steps:['選橫波：看 A 點上下動，波峰往右移。','選縱波：看 A 點前後動，線圈的疏密區往右移。','暫停並逐格，比較「質點振動方向」與「波傳播方向」。'],
      principle:'分類的關鍵，是方向',text:'<p><strong>橫波：</strong>介質振動方向與傳播方向垂直。<br><strong>縱波：</strong>介質振動方向與傳播方向平行。</p><p>彈簧線圈把擾動傳給相鄰線圈，各處依序振動。觀察金色標記，可以看出線圈沒有跟著波形一路向右移。</p>',
      question:'彈簧波向右傳、線圈上下振動，這是什麼波？',choices:['橫波','縱波'],correct:0,feedback:'線圈上下振動，與向右傳播的方向垂直，因此是橫波。',
      notes:'<p>把彈簧中心線視為一維連續介質，預設穩定行進簡諧波，不計算真實彈簧的彈性、線圈碰撞、邊界反射或有限長度共振。線圈的螺旋外觀只是幾何繪圖，金色點標記中心線上固定的介質位置。</p><p>縱波位移幅度受限制，確保所有可選頻率和幅度下，相鄰質點不互相穿越。橫波與縱波分開採示意幅度；兩模式使用相同示意波速，不代表真實彈簧的兩種波速相等。</p>'
    },
    seismic:{
      en:'SEISMIC WAVES',title:'地震波',tag:'體波 + 表面波',description:'同步比較 P、S、雷利與洛弗波。從正面、側面或俯視觀察金色 A 點；右鍵拖曳任一圖，四個視角會同步旋轉。',
      observation:'四個 A 點，畫出四種軌跡',steps:['看 P 波沿傳播方向壓縮、伸長；看 S 波垂直於傳播方向振動。','看雷利波的 A 點，在近地表作垂直平面內的逆行橢圓運動。','用俯視看洛弗波的水平剪切，再切到正面比較雷利波的上下與水平運動。'],
      principle:'體波走內部，表面波沿地表',text:'<p><strong>P 波：</strong>縱波，可通過固體、液體與氣體。<strong>S 波：</strong>剪切橫波，在一般流體中不能傳播。</p><p><strong>雷利波：</strong>近地表的質點具有水平與垂直分量，常見逆行橢圓軌跡。<strong>洛弗波：</strong>在分層介質中形成水平剪切，振動垂直於傳播方向。表面波的運動通常集中在地表附近。</p>',
      question:'哪一種表面波只有水平剪切，沒有上下位移？',choices:['雷利波 Rayleigh','洛弗波 Love'],correct:1,feedback:'洛弗波在水平面內左右剪切，且垂直於傳播方向；雷利波則同時具有垂直與水平分量。',
      notes:'<p>四圖共用同一動畫時間與頻率，並以示意波速區分 P、S、Love、Rayleigh。實際速度取決於介質彈性、密度與分層，不能由本圖讀取真實速率，也不能把此處 Love 比 Rayleigh 快的設定套用到所有地質結構。</p><p>S 波展示 SV（垂直偏振剪切波）；另有 SH（水平偏振）仍屬 S 波。洛弗波是受層狀結構導引的 SH 型表面波，不能只憑「水平振動」就把任何 S 波當成洛弗波。</p><p>Rayleigh 採近地表逆行橢圓與指數衰減的定性模型，沒有求解完整彈性半空間場；實際橢圓形狀與旋向可能隨深度和分層改變。Love 採水平位移隨深度衰減的定性模型，未計算導波色散。</p>'
    },
    gravity:{
      en:'GRAVITATIONAL WAVES',title:'重力波',tag:'時空擾動・無需物質介質',description:'用雙黑洞或雙中子星，觀察起伏的時空網格與向外傳播的波紋；切換到「距離伸縮」，看波通過時自由質點之間的距離變化。',
      observation:'從雙星繞行，看見交替伸縮',steps:['在「時空網格」中看雙黑洞繞行，按住右鍵拖曳，從斜視或俯視觀察外擴波紋。','切換「距離伸縮」：右側為垂直於傳播方向的自由質點環，看兩方向交替伸縮。','切換 +／× 偏振：伸縮軸轉了多少？繞行一圈，質點環經過幾個伸縮週期？'],
      principle:'改變的是時空中的距離',text:'<p>具有加速度且質量分布的四極矩隨時間改變的系統，可以發出重力波。緻密雙星（如雙中子星）是重要來源；重力波以<strong>光速</strong>傳播。</p><p>波通過時，垂直於傳播方向的自由質點距離交替伸長與縮短。圓形雙星的主要重力波頻率約為繞行頻率的兩倍。這裡的重力波是時空擾動；水面「重力波」則指以重力為恢復力的水波。</p>',
      question:'「距離伸縮」模式中，右側質點環的變形代表什麼？',choices:['自由質點之間的距離交替伸縮','星體吹出的空氣讓質點移動'],correct:0,feedback:'重力波造成可測量的相對距離變化，不需空氣或水作為介質。伸縮示意圖的幅度已大幅誇張。',
      notes:'<p>時空網格模式仿照常見的重力波概念圖：以三維網格高度示意引力凹陷，以外擴環形起伏表示傳播。這是視覺類比，並非完整廣義相對論模擬；重力波不是真實薄膜的上下運動，也不具有圖中這種固定高度。球體可選雙黑洞或雙中子星，網格未計算真實黑洞時空、三維四極輻射角分布或事件視界。</p><p>「距離伸縮」左圖採等質量、圓形、固定半徑的雙星軌道。一般雙星也會輻射重力波，但緻密雙星更適合此教學示意；未模擬軌道衰減、螺旋內落或合併。外擴圓弧只示意波前相位，不代表真實三維輻射的強度或角分布。</p><p>右圖是遠處、垂直於傳播方向的自由試驗質點環。使用小應變近似：+ 偏振取 x′ ≈ x(1+h/2)，y′ ≈ y(1−h/2)；× 偏振取 x′ ≈ x+hy/2，y′ ≈ y+hx/2。網格表示相對距離的變化，不是時空裡的實體薄膜。</p><p>採 h ∝ sin[2Ω(t−延遲)] 展示重力波頻率為 2 倍繞行頻率。切換兩種偏振是分別觀察兩個基底，不表示任何視角下的雙星只產生單一偏振。圖上應變極度放大，不能用來推算真實恆星質量、距離或 LIGO 訊號。</p>'
    }
  };
  const planned = {
    echo:{title:'回聲',outline:['聲音的反射','往返路徑與距離計算','回聲形成的時間差與實際應用']},
    music:{title:'樂音三要素：響度、音色、音調',outline:['響度與振幅／強度','音調與頻率','音色、波形與泛音']}
  };
  const defaults = mode => ({amplitude:1,trails:true,equilibrium:true,waterDepth:'deep',waterView:'section',frequency:.65,springType:'transverse',showE:true,showB:true,polarization:'plus',gravityView:'spacetime',binaryType:'blackhole',camera:Wave3D.viewDefault(mode),cameraPreset:'iso'});
  const state={mode:'water',chapter:'intro',t:0,speed:1,playing:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,options:Object.fromEntries(modes.map(m=>[m,defaults(m)])),last:null};
  const canvas=$('main-canvas'),seismicCanvases=[...document.querySelectorAll('[data-seismic]')];
  const contexts=new Map();
  function prepare(c,w,h){const dpr=Math.min(window.devicePixelRatio||1,2);c.width=w*dpr;c.height=h*dpr;c._logicalHeight=h;const ctx=c.getContext('2d');if(!ctx)return false;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.logicalWidth=w;ctx.logicalHeight=h;ctx.displayScale=1;contexts.set(c,ctx);return true;}
  if(!prepare(canvas,1000,500)){$('canvas-fallback').hidden=false;return;}
  seismicCanvases.forEach(c=>prepare(c,480,310));
  let drag=null;
  function is3D(){return state.mode==='em'||state.mode==='seismic'||state.mode==='gravity'&&options().gravityView==='spacetime';}
  function cancelDrag(){if(!drag)return;const c=drag.canvas,id=drag.id;drag=null;c.classList.remove('is-orbiting');try{if(c.hasPointerCapture(id))c.releasePointerCapture(id);}catch(e){}}
  function configureStage(){
    const height=is3D()&&state.mode!=='seismic'?600:500;
    if(canvas._logicalHeight!==height)prepare(canvas,1000,height);
    canvas.style.aspectRatio='1000 / '+height;
    const mesh=state.mode==='gravity'&&options().gravityView==='spacetime';
    $('trails-label').textContent=mesh?'顯示繞行軌跡':state.mode==='em'?'顯示場向量範圍':'顯示運動軌跡';
    $('equilibrium-label').textContent=mesh?'顯示完整軌道':state.mode==='em'?'顯示參考位置':'顯示平衡位置';
    for(const c of [canvas,...seismicCanvases]){
      const interactive=is3D()&&(c===canvas?state.mode!=='seismic':state.mode==='seismic');
      c.classList.toggle('interactive-3d',interactive);c.setAttribute('tabindex',interactive?'0':'-1');
      if(interactive)c.setAttribute('aria-describedby','camera-help');else c.removeAttribute('aria-describedby');
    }
  }
  function updateCanvasMetrics(){
    for(const [c,ctx] of contexts){const width=c.getBoundingClientRect().width;if(width>0)ctx.displayScale=width/ctx.logicalWidth;}
    const container=$('single-stage');
    $('canvas-pan-hint').hidden=is3D()|| (state.mode==='seismic'
      ? !seismicCanvases.some(c=>c.getBoundingClientRect().width>c.parentElement.clientWidth+2)
      : canvas.getBoundingClientRect().width<=container.clientWidth+2);
  }
  function options(){return state.options[state.mode];}
  function draw(){const o=options();if(state.mode==='seismic')seismicCanvases.forEach(c=>WaveRenderers.seismic(contexts.get(c),c.dataset.seismic,state.t,o));else WaveRenderers[state.mode](contexts.get(canvas),state.t,o);$('time-output').textContent=state.t.toFixed(2);}
  function segment(key,items){return `<div class="segmented" role="group" aria-label="${{waterView:'水波視角',waterDepth:'水深模型',springType:'彈簧振動方式',polarization:'重力波偏振',gravityView:'重力波觀看方式',binaryType:'雙星系統'}[key]}">${items.map(([v,l])=>`<button data-option="${key}" data-value="${v}" aria-pressed="${options()[key]===v}">${l}</button>`).join('')}</div>`;}
  function cameraControls(){return '<div class="camera-toolbar" role="group" aria-label="三維視角">'+[['iso','立體'],['front','正面'],['side','側面'],['top','俯視'],['reset','重設視角']].map(([v,l])=>`<button data-view="${v}" aria-pressed="${options().cameraPreset===v}">${l}</button>`).join('')+'</div><p id="camera-help" class="camera-help">右鍵拖曳旋轉・滾輪縮放・觸控單指拖曳；鍵盤方向鍵旋轉，Home 還原。'+(state.mode==='seismic'?'四圖視角同步。':'')+'</p><output id="camera-readout" class="camera-readout"></output>';}
  function updateCameraReadout(){if(!$('camera-readout'))return;const c=options().camera;$('camera-readout').textContent=`水平 ${Math.round(c.yaw)}° · 仰角 ${Math.round(c.pitch)}° · 縮放 ${Math.round(c.zoom*100)}%`;$('context-controls').querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===options().cameraPreset)));}
  function buildControls(){
    const o=options();let html='';
    if(state.mode==='water')html=segment('waterView',[['section','水中剖面'],['surface','水面斜視']])+segment('waterDepth',[['deep','深水近似'],['shallow','有限水深']]);
    if(state.mode==='sound'||state.mode==='spring'){
      html=state.mode==='spring'?segment('springType',[['transverse','橫波'],['longitudinal','縱波']]):'<span class="control-note">發聲體 → 空氣 → 耳膜</span>';
      html+=`<label for="frequency">示意頻率 <input id="frequency" type="range" min="0.35" max="1.1" step="0.05" value="${o.frequency}"><output id="frequency-output">${o.frequency.toFixed(2)} Hz</output></label>`;
      if(state.mode==='sound')html+='<button id="tone" class="tone-button" aria-pressed="false">♫ 聆聽示範音</button>';
    }
    if(state.mode==='em')html=`<label><input id="show-e" type="checkbox" ${o.showE?'checked':''}> 電場 E</label><label><input id="show-b" type="checkbox" ${o.showB?'checked':''}> 磁場 B</label>`;
    if(state.mode==='seismic')html='<span class="control-note">四圖同步播放 · 金色 A 點為固定介質質點</span><span class="control-note">速率與位移皆為示意</span>';
    if(state.mode==='gravity')html=segment('gravityView',[['spacetime','時空網格'],['detector','距離伸縮']])+(o.gravityView==='spacetime'?segment('binaryType',[['blackhole','雙黑洞'],['neutron','雙中子星']])+'<span class="control-note">網格高度與環形波紋為概念示意</span>':segment('polarization',[['plus','+ 偏振'],['cross','× 偏振']])+'<span class="control-note">⊙ 右圖的波朝向觀察者</span>');
    if(is3D())html+=cameraControls();
    $('context-controls').innerHTML=html;
    $('context-controls').querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>{cancelDrag();o[btn.dataset.option]=btn.dataset.value;buildControls();configureStage();updateCanvasMetrics();setLegend();draw();}));
    $('context-controls').querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{cancelDrag();o.camera=Wave3D.preset(state.mode,btn.dataset.view);o.cameraPreset=btn.dataset.view==='reset'?'iso':btn.dataset.view;updateCameraReadout();draw();}));
    updateCameraReadout();
    if($('frequency'))$('frequency').addEventListener('input',e=>{o.frequency=Number(e.target.value);$('frequency-output').textContent=o.frequency.toFixed(2)+' Hz';updateTone();draw();});
    if($('show-e'))$('show-e').addEventListener('change',e=>{o.showE=e.target.checked;draw();});
    if($('show-b'))$('show-b').addEventListener('change',e=>{o.showB=e.target.checked;draw();});
    if($('tone'))$('tone').addEventListener('click',toggleTone);
  }
  function setLegend(){const map={water:[['','水中質點'],['gold','追蹤 A／B／C'],['rest','平衡位置']],sound:[['','空氣質點'],['gold','追蹤 A'],['red','耳膜']],em:[['red','電場 E'],['','磁場 B'],['gold','傳播 x']],spring:[['','彈簧線圈'],['gold','追蹤 A／B／C'],['rest','平衡位置']],seismic:[['','岩石質點'],['gold','追蹤 A'],['rest','平衡位置']],gravity:[['','自由試驗質點'],['gold','追蹤質點'],['rest','無波時位置']]};if(state.mode==='gravity'&&options().gravityView==='spacetime')map.gravity=[['','三維時空網格（概念示意）'],['gold','向外傳播方向'],['rest',options().binaryType==='neutron'?'雙中子星':'雙黑洞']];$('legend').innerHTML=map[state.mode].map(([c,l])=>`<span><i class="${c}"></i>${l}</span>`).join('');}
  function buildQuestion(d){$('question-text').textContent=d.question;$('question-feedback').textContent='';$('question-choices').innerHTML=d.choices.map((c,i)=>`<button data-choice="${i}">${c}</button>`).join('');$('question-choices').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{$('question-choices').querySelectorAll('button').forEach(b=>b.classList.remove('correct','incorrect'));const correct=Number(btn.dataset.choice)===d.correct;btn.classList.add(correct?'correct':'incorrect');$('question-feedback').textContent=(correct?'答對了。':'再觀察看看。')+d.feedback;}));}
  let contentReady=false;
  function selectMode(mode){
    contentReady=true;
    cancelDrag();
    stopTone();state.mode=mode;state.t=0;state.last=null;
    const d=data[mode],n=modes.indexOf(mode)+1,o=options();
    $('mode-kicker').textContent=`0${n} / ${d.en}`;$('mode-title').textContent=d.title;$('mode-tag').textContent=d.tag;$('mode-description').textContent=d.description;
    canvas.setAttribute('aria-label',`${d.title}互動動畫。${d.description}`);
    $('observation-title').textContent=d.observation;$('observation-steps').innerHTML=d.steps.map(s=>`<li>${s}</li>`).join('');$('principle-title').textContent=d.principle;$('principle-text').innerHTML=d.text;$('model-notes').innerHTML=d.notes;
    $('amplitude-label').textContent=mode==='em'?'場振幅':mode==='gravity'?'伸縮幅度':'振動幅度';$('amplitude').value=o.amplitude;$('amplitude-output').textContent=o.amplitude.toFixed(1)+'×';$('trails').checked=o.trails;$('equilibrium').checked=o.equilibrium;
    document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
    $('single-stage').hidden=mode==='seismic';$('seismic-stage').hidden=mode!=='seismic';$('reference-details').hidden=mode!=='water';
    if(mode!=='water'){$('reference-details').open=false;unloadReferences();}
    $('progress-label').textContent=`探索 0${n} / 06`;$('next-wave').textContent=mode==='gravity'?'回到水波 ↺':`下一個實驗：${data[modes[n]].title} →`;
    buildControls();setLegend();buildQuestion(d);syncPlayback();configureStage();updateCanvasMetrics();draw();
  }
  function route(){
    const parts=location.hash.slice(1).split('/'),chapter=parts[0]||'intro';
    WaveClassification.hide();WaveAdvanced.hide();$('classification-page').hidden=chapter!=='types';
    for(const name of ['periodic','speed','spectrum'])$(name+'-page').hidden=chapter!==name;
    if(chapter==='types'){cancelDrag();stopTone();unloadReferences();$('reference-details').open=false;state.chapter='types';$('intro-page').hidden=true;$('planned-page').hidden=true;WaveClassification.activate(parts[1]);}
    else if(['periodic','speed','spectrum'].includes(chapter)){cancelDrag();stopTone();unloadReferences();$('reference-details').open=false;state.chapter=chapter;$('intro-page').hidden=true;$('planned-page').hidden=true;WaveAdvanced.activate(chapter,parts[1]);}
    else if(planned[chapter]){cancelDrag();stopTone();unloadReferences();$('reference-details').open=false;state.chapter=chapter;$('intro-page').hidden=true;$('planned-page').hidden=false;$('planned-title').textContent=planned[chapter].title;$('planned-outline').innerHTML=planned[chapter].outline.map(s=>`<li>${s}</li>`).join('');}
    else if(chapter==='experiment'){state.chapter='intro';$('intro-page').hidden=false;$('planned-page').hidden=true;if(!contentReady)selectMode(state.mode);}
    else{state.chapter='intro';$('intro-page').hidden=false;$('planned-page').hidden=true;selectMode(modes.includes(parts[1])?parts[1]:'water');}
    document.querySelectorAll('[data-chapter]').forEach(a=>{if(a.dataset.chapter===state.chapter)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    $('chapter-number').textContent=String(['intro','types','periodic','speed','spectrum','echo','music'].indexOf(state.chapter)+1).padStart(2,'0')+' / 07';
  }
  function syncPlayback(){
    $('play').textContent=state.playing?'❚❚ 暫停':'▶ 播放';$('play').setAttribute('aria-label',state.playing?'暫停動畫':'播放動畫');$('running-label').textContent=state.playing?'播放中':'已暫停';$('status-dot').classList.toggle('paused',!state.playing);updateTone();
  }
  $('play').addEventListener('click',()=>{state.playing=!state.playing;state.last=null;syncPlayback();});
  $('step').addEventListener('click',()=>{state.playing=false;state.t+=1/30;state.last=null;syncPlayback();draw();});
  $('reset').addEventListener('click',()=>{cancelDrag();stopTone();state.options[state.mode]=defaults(state.mode);state.t=0;state.speed=1;state.playing=false;$('speed').value=1;$('speed-output').textContent='1.0×';selectMode(state.mode);});
  $('speed').addEventListener('input',e=>{state.speed=Number(e.target.value);$('speed-output').textContent=state.speed.toFixed(1)+'×';});
  $('amplitude').addEventListener('input',e=>{options().amplitude=Number(e.target.value);$('amplitude-output').textContent=options().amplitude.toFixed(1)+'×';updateTone();draw();});
  $('trails').addEventListener('change',e=>{options().trails=e.target.checked;draw();});
  $('equilibrium').addEventListener('change',e=>{options().equilibrium=e.target.checked;draw();});
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{const next='#intro/'+b.dataset.mode;if(location.hash===next)selectMode(b.dataset.mode);else location.hash=next;}));
  $('next-wave').addEventListener('click',()=>{location.hash='#intro/'+modes[(modes.indexOf(state.mode)+1)%modes.length];$('experiment').scrollIntoView({behavior:'auto',block:'start'});});
  async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await $('lab-panel').requestFullscreen();}catch(e){$('fullscreen').title='此瀏覽器無法開啟全螢幕';}}
  if($('lab-panel').requestFullscreen)$('fullscreen').addEventListener('click',toggleFullscreen);else{$('fullscreen').disabled=true;$('fullscreen').title='此瀏覽器不支援全螢幕';}
  document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'⛶ 退出':'⛶';$('fullscreen').style.width=document.fullscreenElement?'auto':'44px';updateCanvasMetrics();draw();});
  function unloadReferences(){['ref-water','ref-surface'].forEach(id=>$(id).removeAttribute('src'));}
  $('reference-details').addEventListener('toggle',()=>{if($('reference-details').open)['ref-water','ref-surface'].forEach(id=>$(id).src=$(id).dataset.src);else unloadReferences();});
  let audioContext=null,oscillator=null,gain=null,toneEnabled=false,audioRequest=0;
  function stopTone(){audioRequest++;toneEnabled=false;if(oscillator){try{oscillator.stop();}catch(e){}oscillator.disconnect();oscillator=null;}if(gain){gain.disconnect();gain=null;}if($('tone')){$('tone').textContent='♫ 聆聽示範音';$('tone').setAttribute('aria-pressed','false');}}
  function updateTone(){if(!toneEnabled||!gain||!oscillator)return;const frequency=220*state.options.sound.frequency/.65;oscillator.frequency.setTargetAtTime(frequency,audioContext.currentTime,.025);gain.gain.setTargetAtTime(state.playing&&!document.hidden&&state.chapter==='intro'?.025*state.options.sound.amplitude:0,audioContext.currentTime,.025);if($('tone')){$('tone').textContent=`♫ 關閉示範音 (${Math.round(frequency)} Hz)`;$('tone').setAttribute('aria-pressed','true');}}
  async function toggleTone(){
    if(toneEnabled){stopTone();return;}
    const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor){$('tone').textContent='此瀏覽器不支援音訊';return;}
    const modeAtStart=state.mode;
    const request=++audioRequest,button=$('tone');button.disabled=true;
    try{if(!audioContext)audioContext=new AudioCtor();await audioContext.resume();if(request!==audioRequest||state.mode!==modeAtStart||state.chapter!=='intro')return;oscillator=audioContext.createOscillator();gain=audioContext.createGain();gain.gain.value=0;oscillator.type='sine';oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();toneEnabled=true;updateTone();}catch(e){stopTone();if($('tone'))$('tone').textContent='音訊無法啟用';}finally{button.disabled=false;}
  }
  window.addEventListener('hashchange',route);
  window.addEventListener('resize',()=>{updateCanvasMetrics();draw();});
  if(window.ResizeObserver){const observer=new window.ResizeObserver(()=>{updateCanvasMetrics();draw();});contexts.forEach((ctx,c)=>observer.observe(c));}
  document.addEventListener('visibilitychange',()=>{state.last=null;updateTone();});
  for(const c of [canvas,...seismicCanvases]){
    const allowed=()=>state.chapter==='intro'&&is3D()&&(c===canvas?state.mode!=='seismic':state.mode==='seismic');
    c.addEventListener('contextmenu',e=>{if(allowed())e.preventDefault();});
    c.addEventListener('pointerdown',e=>{
      if(!allowed()||e.button!==2&&e.pointerType!=='touch')return;
      e.preventDefault();cancelDrag();drag={canvas:c,id:e.pointerId,x:e.clientX,y:e.clientY,mode:state.mode};c.classList.add('is-orbiting');
      try{c.setPointerCapture(e.pointerId);}catch(err){}
    });
    c.addEventListener('pointermove',e=>{
      if(!drag||drag.canvas!==c||drag.id!==e.pointerId||drag.mode!==state.mode)return;
      Wave3D.rotate(options().camera,e.clientX-drag.x,e.clientY-drag.y);drag.x=e.clientX;drag.y=e.clientY;options().cameraPreset='custom';updateCameraReadout();draw();
    });
    for(const type of ['pointerup','pointercancel','lostpointercapture'])c.addEventListener(type,e=>{if(drag&&drag.canvas===c&&drag.id===e.pointerId)cancelDrag();});
    c.addEventListener('wheel',e=>{if(!allowed())return;e.preventDefault();Wave3D.zoom(options().camera,e.deltaY);updateCameraReadout();draw();},{passive:false});
    c.addEventListener('keydown',e=>{
      if(!allowed())return;const moves={ArrowLeft:[-30,0],ArrowRight:[30,0],ArrowUp:[0,30],ArrowDown:[0,-30]};
      if(moves[e.key]){e.preventDefault();Wave3D.rotate(options().camera,...moves[e.key]);options().cameraPreset='custom';}
      else if(e.key==='Home'){e.preventDefault();options().camera=Wave3D.viewDefault(state.mode);options().cameraPreset='iso';}
      else if(e.key==='+'||e.key==='='){e.preventDefault();Wave3D.zoom(options().camera,-80);}
      else if(e.key==='-'){e.preventDefault();Wave3D.zoom(options().camera,80);}else return;
      updateCameraReadout();draw();
    });
  }
  function frame(timestamp){if(state.last===null)state.last=timestamp;const dt=Math.min(Math.max((timestamp-state.last)/1000,0),.05);state.last=timestamp;if(state.playing&&state.chapter==='intro'&&!document.hidden){state.t+=dt*state.speed;draw();}WaveClassification.tick(dt);WaveAdvanced.tick(dt);window.requestAnimationFrame(frame);}
  route();window.requestAnimationFrame(frame);
})();
