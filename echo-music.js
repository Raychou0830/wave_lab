/* Chapter controller for 06 Echo and 07 Musical sound. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id),M=window.EchoMusicModels||globalThis.EchoMusicModels,R=window.EchoMusicRenderers||globalThis.EchoMusicRenderers,W=window.Wave3D||globalThis.Wave3D;
  const modes={echo:['ship','bat'],music:['loudness','pitch','sweep','timbre']};
  const copy={
    ship:{title:'移動中的船與回聲',tag:'回聲・相對運動',desc:'調整船速。題目固定從發聲到收到回聲共 10 秒，模型會同步改變發聲位置與四個答案。',taskTitle:'把一次往返拆成兩段',tasks:['先找聲波到岸的時刻；這不是 5 秒，因為船正在前進。','比較發聲時與收到時的離岸距離。','把船速調成 20 m/s，核對題目的四個答案。'],principleTitle:'聲波走的總路程要配合移動的船',principle:'<p>若船速為 <em>u</em>、聲速為 <em>c</em>、10 秒後收到回聲，發聲時距離為 <strong>D＝(c＋u)t／2</strong>。去程時間為 D／c，回程終點則是已向岸移動的船。</p>',notes:'<p>採一維、無風、聲速 340 m/s、岸壁完全反射的理想模型。動畫的位置依比例縮放，但時間與計算值一致。</p>'},
    bat:{title:'蝙蝠能及時轉向嗎？',tag:'回聲定位・反應時間',desc:'調整蝙蝠速度和起始牆距。回聲返回後還需 0.3 秒反應；太快或太近就會撞上。',taskTitle:'比較三段時間',tasks:['觀察超音波去程與回程。','回聲返回後，蝙蝠仍直飛 0.3 秒才轉向。','找出剛好安全的臨界距離。'],principleTitle:'聽見回聲不等於立刻轉向',principle:'<p>回聲時間 <strong>tₑ＝2D／(c＋u)</strong>。安全條件是 tₑ＋0.3 秒小於撞牆時間 D／u，因此最低安全距離為 <strong>D<sub>min</sub>＝uτ(c＋u)／(c－u)</strong>。</p>',notes:'<p>題目採聲速 310 m/s、反應時間 0.3 s。臨界值以嚴格安全條件判定；剛好同時到達視為沒有轉向餘裕。</p>'},
    loudness:{title:'聲強為何與距離平方成反比？',tag:'響度・球面擴散',desc:'旋轉三維球面並改變觀察距離，看固定聲功率如何分散到愈來愈大的球面。',taskTitle:'跟著一份能量向外走',tasks:['把觀察距離從 1 m 調成 2 m。','比較球面面積與相對聲強。','右鍵拖曳球面，確認它不是平面圓環。'],principleTitle:'平方反比來自球面面積',principle:'<p>理想點聲源在自由場中向各方向均勻放出固定功率 P。距離 r 的球面面積是 4πr²，所以聲強 <strong>I＝P／(4πr²)</strong>。距離加倍，單位面積分到的功率變成四分之一。</p><p>「響度」是人的主觀感受，還受頻率與聽覺系統影響；平方反比直接描述的是聲強。</p>',notes:'<p>模型忽略反射、吸收、指向性與近場效應，只適合自由場中的理想點聲源。</p>'},
    pitch:{title:'頻率與音調產生器',tag:'音調・頻率',desc:'輸入或拖曳頻率，點選 C、D、E、F、G 音，再用安全音量播放比較音高。',taskTitle:'用眼睛和耳朵一起比較',tasks:['依序播放 C、D、E、F、G。','觀察 20 ms 內的週期數如何增加。','輸入 440 Hz，再比較 G4。'],principleTitle:'頻率是客觀量，音調是知覺',principle:'<p>頻率表示每秒振動次數，單位是 Hz。一般而言頻率愈高，感覺到的音調愈高；但音調仍會受頻譜與聽覺影響。</p>',notes:'<p>聲音只能由使用者按鍵啟動。預設採低音量正弦波；請勿用高音量或長時間聆聽極高頻聲音。</p>'},
    sweep:{title:'不斷上升的聲音',tag:'掃頻・謝帕德音',desc:'比較一般掃頻與「永遠上升」的謝帕德音錯覺。聲音不會自動播放，需按播放聲音。',taskTitle:'真的能無限升高嗎？',tasks:['先聽一般掃頻，注意每輪重置。','切到謝帕德音，留意不同八度的聲音交替淡入與淡出。','暫停動畫後，聲音也會淡出。'],principleTitle:'無限上升是一種聽覺錯覺',principle:'<p>一般掃頻的頻率真的一路升高後重置。謝帕德音則把相隔八度的多個音疊加，讓最高音淡出、最低音淡入；音高類別循環，卻形成持續上升的感覺。</p>',notes:'<p>此互動依照使用者提供影片所描述的持續上升效果，自行建立教學模型，未擷取影片音訊。</p>'},
    timbre:{title:'同音高，為什麼音色不同？',tag:'音色・頻譜疊加',desc:'比較音叉、長笛、單簧管與小提琴。上方是合成波形，下方拆出基頻與泛音。',taskTitle:'不要只看最高的一根柱',tasks:['固定同一基頻，切換四種音色。','比較各樂器泛音的相對強弱。','找出基頻，再判斷聽到的音高。'],principleTitle:'音色來自不同的頻譜與時間包絡',principle:'<p>樂器聲通常不是單一頻率，而是基頻與泛音的疊加。週期性與基頻通常主導音高；<strong>振幅最大的頻譜峰不一定就是基頻</strong>，甚至缺少基頻時，大腦仍可能推知音高。</p>',notes:'<p>這裡用簡化的整數倍泛音合成穩定音，未模擬真實樂器的起音、衰減、噪聲與共鳴峰；它適合比較概念，不是樂器鑑定器。</p>'}
  };
  const defaults=mode=>({
    ship:{shipSpeed:20,totalTime:10},bat:{batSpeed:10,distance:4},
    loudness:{distance:2,camera:W.viewDefault('loudness'),cameraPreset:'iso'},pitch:{frequency:440},
    sweep:{sweepType:'linear',duration:8,start:100,end:2000},timbre:{instrument:'fork',fundamental:M.NOTES.C4}
  }[mode]);
  const state={active:false,chapter:'echo',mode:'ship',t:0,last:null,playing:!window.matchMedia||!window.matchMedia('(prefers-reduced-motion: reduce)').matches,speed:1,options:{}};
  Object.values(modes).flat().forEach(m=>state.options[m]=defaults(m));
  let audioContext=null,audioMode=null,audioNodes=[],audioMaster=null,drag=null;
  function ids(){const p=state.chapter;return {page:$(p+'-page'),title:$(p+'-title'),tag:$(p+'-tag'),desc:$(p+'-description'),panel:$(p+'-panel'),dot:$(p+'-dot'),running:$(p+'-running'),controls:$(p+'-controls'),canvas:$(p+'-canvas'),stage:$(p+'-stage'),hint:$(p+'-pan-hint'),play:$(p+'-play'),step:$(p+'-step'),reset:$(p+'-reset'),speed:$(p+'-speed'),speedOut:$(p+'-speed-out'),time:$(p+'-time'),taskTitle:$(p+'-task-title'),tasks:$(p+'-tasks'),principleTitle:$(p+'-principle-title'),principle:$(p+'-principle'),notes:$(p+'-notes')};}
  function option(){return state.options[state.mode];}
  function buttonGroup(key,items,label){return `<div class="segmented" role="group" aria-label="${label}">${items.map(([v,l])=>`<button data-em-option="${key}" data-value="${v}" aria-pressed="${String(option()[key]===v)}">${l}</button>`).join('')}</div>`;}
  function range(id,label,min,max,step,value,unit){return `<label for="${id}">${label} <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output id="${id}-out">${Number(value).toFixed(step<1?1:0)}${unit}</output></label>`;}
  function cameraControls(){return '<div class="camera-toolbar" role="group" aria-label="三維視角">'+[['iso','立體'],['front','正面'],['side','側面'],['top','俯視'],['reset','重設視角']].map(([v,l])=>`<button data-em-view="${v}">${l}</button>`).join('')+'</div><p class="camera-help">右鍵拖曳旋轉・滾輪縮放・觸控單指拖曳；鍵盤方向鍵旋轉，Home 還原。</p><output id="em-camera-readout" class="camera-readout"></output>'}
  function buildControls(){
    const o=option(),el=ids().controls;let html='';
    if(state.mode==='ship')html=range('em-ship-speed','船速',0,60,1,o.shipSpeed,' m/s')+'<span class="control-note">聲速 340 m/s・總回聲時間 10 s</span>';
    if(state.mode==='bat')html=range('em-bat-speed','蝙蝠速度',1,50,1,o.batSpeed,' m/s')+range('em-bat-distance','初始牆距',.5,30,.1,o.distance,' m')+'<span class="control-note">聲速 310 m/s・反應 0.3 s</span>';
    if(state.mode==='loudness')html=range('em-distance','觀察距離',1,5,.1,o.distance,' m')+cameraControls();
    if(state.mode==='pitch')html=`${range('em-frequency','頻率',50,2000,1,Math.min(o.frequency,2000),' Hz')}<label for="em-frequency-number">直接輸入 <input class="number-input" id="em-frequency-number" type="number" min="20" max="20000" step="0.01" value="${o.frequency.toFixed(2)}"> Hz</label>${buttonGroup('note',Object.keys(M.NOTES).filter(n=>n!=='A4').map(n=>[n,n[0]]),'指定音階')}<button class="tone-button em-audio" data-em-audio>▶ 播放聲音</button>`;
    if(state.mode==='sweep')html=buttonGroup('sweepType',[['linear','一般掃頻'],['shepard','無限上升錯覺']],'掃頻類型')+range('em-duration','每輪長度',3,15,1,o.duration,' s')+'<button class="tone-button em-audio" data-em-audio>▶ 播放聲音</button>';
    if(state.mode==='timbre')html=buttonGroup('instrument',[['fork','音叉'],['flute','長笛'],['clarinet','單簧管'],['violin','小提琴']],'音色')+buttonGroup('timbreNote',[['C4','C4'],['E4','E4'],['G4','G4'],['A4','A4']],'基頻')+'<button class="tone-button em-audio" data-em-audio>▶ 播放聲音</button>';
    el.innerHTML=html;
    el.querySelectorAll('[data-em-option]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.emOption,val=b.dataset.value;if(key==='note'){o.frequency=M.NOTES[val];}else if(key==='timbreNote'){o.fundamental=M.NOTES[val];}else o[key]=val;buildControls();restartAudioIfNeeded();draw();}));
    el.querySelectorAll('[data-em-view]').forEach(b=>b.addEventListener('click',()=>{o.camera=W.preset('loudness',b.dataset.emView);o.cameraPreset=b.dataset.emView==='reset'?'iso':b.dataset.emView;updateCamera();draw();}));
    const listen=(id,fn)=>{const e=$(id);if(e)e.addEventListener('input',x=>{fn(Number(x.target.value));draw();});};
    listen('em-ship-speed',v=>{o.shipSpeed=v;$('em-ship-speed-out').textContent=v.toFixed(0)+' m/s';});
    listen('em-bat-speed',v=>{o.batSpeed=v;$('em-bat-speed-out').textContent=v.toFixed(0)+' m/s';});listen('em-bat-distance',v=>{o.distance=v;$('em-bat-distance-out').textContent=v.toFixed(1)+' m';});
    listen('em-distance',v=>{o.distance=v;$('em-distance-out').textContent=v.toFixed(1)+' m';});
    listen('em-frequency',v=>{o.frequency=v;$('em-frequency-out').textContent=v.toFixed(0)+' Hz';$('em-frequency-number').value=v.toFixed(2);updateAudio();});
    listen('em-frequency-number',v=>{if(!Number.isFinite(v))return;o.frequency=M.clamp(v,20,20000);$('em-frequency').value=Math.min(o.frequency,2000);$('em-frequency-number').value=o.frequency.toFixed(2);$('em-frequency-out').textContent=Math.round(o.frequency)+' Hz';updateAudio();});
    listen('em-duration',v=>{o.duration=v;$('em-duration-out').textContent=v.toFixed(0)+' s';});
    const ab=el.querySelector('[data-em-audio]');if(ab)ab.addEventListener('click',toggleAudio);updateAudioButton();updateCamera();
  }
  function updateCamera(){const e=$('em-camera-readout');if(e){const c=option().camera;e.textContent=`水平 ${Math.round(c.yaw)}° · 仰角 ${Math.round(c.pitch)}° · 縮放 ${Math.round(c.zoom*100)}%`;}}
  function syncPlayback(){const e=ids();e.play.textContent=state.playing?'❚❚ 暫停':'▶ 播放';e.running.textContent=state.playing?'播放中':'已暫停';e.dot.classList.toggle('paused',!state.playing);updateAudio();}
  function draw(){if(!state.active)return;const e=ids(),ctx=e.canvas.getContext('2d');R[state.mode](ctx,state.t,option());e.time.textContent=state.t.toFixed(2);}
  function updateAudioButton(){const b=ids().controls&&ids().controls.querySelector('[data-em-audio]');if(b){b.textContent=audioMode===state.mode?'■ 停止聲音':'▶ 播放聲音';b.setAttribute('aria-pressed',String(audioMode===state.mode));}}
  function stopAudio(){audioNodes.forEach(n=>{try{if(n.stop)n.stop();}catch(e){}try{n.disconnect();}catch(e){}});audioNodes=[];if(audioMaster){try{audioMaster.disconnect();}catch(e){}audioMaster=null;}audioMode=null;if(state.active)updateAudioButton();}
  function makeOsc(f,type='sine',gain=1){const osc=audioContext.createOscillator(),g=audioContext.createGain();osc.type=type;osc.frequency.value=f;g.gain.value=gain;osc.connect(g);g.connect(audioMaster);osc.start();audioNodes.push(osc,g);return {osc,g};}
  async function toggleAudio(){if(audioMode===state.mode){stopAudio();return;}stopAudio();const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;try{if(!audioContext)audioContext=new AC();await audioContext.resume();if(!state.active||!['pitch','sweep','timbre'].includes(state.mode))return;audioMaster=audioContext.createGain();audioMaster.gain.value=0;audioMaster.connect(audioContext.destination);audioMode=state.mode;
      if(state.mode==='pitch')makeOsc(option().frequency,'sine',1);
      if(state.mode==='sweep'){if(option().sweepType==='linear')makeOsc(option().start,'sine',1);else for(let i=0;i<6;i++)makeOsc(55*Math.pow(2,i),'sine',0);}
      if(state.mode==='timbre'){const hs=M.HARMONICS[option().instrument];hs.forEach((a,i)=>makeOsc(option().fundamental*(i+1),'sine',a));}
      updateAudio();updateAudioButton();
    }catch(e){stopAudio();}
  }
  function setParam(param,value,time=.025){if(param.setTargetAtTime)param.setTargetAtTime(value,audioContext.currentTime,time);else param.value=value;}
  function updateAudio(){if(!audioMode||!audioMaster)return;const audible=state.active&&state.playing&&!document.hidden;setParam(audioMaster.gain,audible?.028:0,.03);const oscillators=audioNodes.filter(n=>n.frequency);
    if(audioMode==='pitch'&&oscillators[0])setParam(oscillators[0].frequency,option().frequency);
    if(audioMode==='sweep'){const o=option(),p=(state.t%o.duration)/o.duration;if(o.sweepType==='linear'&&oscillators[0])setParam(oscillators[0].frequency,o.start*Math.pow(o.end/o.start,p),.015);else if(o.sweepType==='shepard'){oscillators.forEach((osc,i)=>{const q=(p*4+i/6)%1,f=110*Math.pow(2,q);setParam(osc.frequency,f,.015);const g=audioNodes.find(n=>n.gain&&n!==audioMaster&&n===audioNodes[audioNodes.indexOf(osc)+1]);if(g)setParam(g.gain,Math.pow(Math.sin(Math.PI*q),2)/3,.02);});}}
  }
  function restartAudioIfNeeded(){if(audioMode){stopAudio();toggleAudio();}}
  function select(chapter,mode){state.active=true;state.chapter=chapter;state.mode=modes[chapter].includes(mode)?mode:modes[chapter][0];state.t=0;state.last=null;stopAudio();const d=copy[state.mode],e=ids();e.title.textContent=d.title;e.tag.textContent=d.tag;e.desc.textContent=d.desc;e.taskTitle.textContent=d.taskTitle;e.tasks.innerHTML=d.tasks.map(x=>`<li>${x}</li>`).join('');e.principleTitle.textContent=d.principleTitle;e.principle.innerHTML=d.principle;e.notes.innerHTML=d.notes;e.canvas.setAttribute('aria-label',d.title+'互動動畫');document.querySelectorAll(`[data-em-chapter="${chapter}"]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.emMode===state.mode)));buildControls();syncPlayback();draw();}
  function activate(chapter,mode){$('echo-page').hidden=chapter!=='echo';$('music-page').hidden=chapter!=='music';select(chapter,mode);}
  function hide(){state.active=false;state.last=null;stopAudio();$('echo-page').hidden=true;$('music-page').hidden=true;}
  function tick(dt){if(state.active&&state.playing&&!document.hidden){state.t+=dt*state.speed;draw();updateAudio();}}
  function bindChapter(chapter){const page=$(chapter+'-page');if(!page)return;page.querySelectorAll('[data-em-chapter]').forEach(b=>b.addEventListener('click',()=>{const hash='#'+chapter+'/'+b.dataset.emMode;if(location.hash===hash)select(chapter,b.dataset.emMode);else location.hash=hash;}));const e=()=>{state.playing=!state.playing;state.last=null;syncPlayback();};$(chapter+'-play').addEventListener('click',e);$(chapter+'-step').addEventListener('click',()=>{state.playing=false;state.t+=1/30;syncPlayback();draw();});$(chapter+'-reset').addEventListener('click',()=>{stopAudio();state.options[state.mode]=defaults(state.mode);state.t=0;state.speed=1;state.playing=false;ids().speed.value=1;ids().speedOut.textContent='1.0×';select(chapter,state.mode);});$(chapter+'-speed').addEventListener('input',x=>{state.speed=Number(x.target.value);$(chapter+'-speed-out').textContent=state.speed.toFixed(1)+'×';});$(chapter+'-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $(chapter+'-panel').requestFullscreen();}catch(err){}});}
  bindChapter('echo');bindChapter('music');
  document.addEventListener('visibilitychange',()=>{state.last=null;updateAudio();});
  window.addEventListener('resize',draw);
  ['echo','music'].forEach(ch=>{const c=$(ch+'-canvas');c.addEventListener('contextmenu',e=>{if(state.active&&state.mode==='loudness')e.preventDefault();});c.addEventListener('pointerdown',e=>{if(!state.active||state.mode!=='loudness'||e.button!==2&&e.pointerType!=='touch')return;e.preventDefault();drag={id:e.pointerId,x:e.clientX,y:e.clientY};try{c.setPointerCapture(e.pointerId);}catch(err){}});c.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;W.rotate(option().camera,e.clientX-drag.x,e.clientY-drag.y);drag.x=e.clientX;drag.y=e.clientY;option().cameraPreset='custom';updateCamera();draw();});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>c.addEventListener(ev,e=>{if(drag&&drag.id===e.pointerId)drag=null;}));c.addEventListener('wheel',e=>{if(!state.active||state.mode!=='loudness')return;e.preventDefault();W.zoom(option().camera,e.deltaY);updateCamera();draw();},{passive:false});c.addEventListener('keydown',e=>{if(!state.active||state.mode!=='loudness')return;const move={ArrowLeft:[-30,0],ArrowRight:[30,0],ArrowUp:[0,30],ArrowDown:[0,-30]}[e.key];if(move){e.preventDefault();W.rotate(option().camera,...move);}else if(e.key==='Home'){e.preventDefault();option().camera=W.viewDefault('loudness');}else return;updateCamera();draw();});});
  const api={activate,hide,tick};window.WaveEchoMusic=api;globalThis.WaveEchoMusic=api;
})();
