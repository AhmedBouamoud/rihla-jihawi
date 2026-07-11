

let deferredInstallPrompt = null;
function setupInstallPrompt(){
  const banner = document.getElementById('installBanner');
  const installBtn = document.getElementById('installApp');
  const closeBtn = document.getElementById('closeInstall');
  if(!banner || !installBtn) return;

  window.addEventListener('beforeinstallprompt', e=>{
    e.preventDefault();
    deferredInstallPrompt = e;
    banner.classList.add('show');
  });

  installBtn.onclick = async ()=>{
    if(!deferredInstallPrompt){
      toast('افتح قائمة المتصفح ثم اختر: إضافة إلى الشاشة الرئيسية');
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    banner.classList.remove('show');
  };

  if(closeBtn) closeBtn.onclick = ()=>banner.classList.remove('show');
  window.addEventListener('appinstalled', ()=>banner.classList.remove('show'));
}

function setupOnlineStatus(){
  const badge = document.getElementById('offlineBadge');
  if(!badge) return;
  const update = ()=>{
    badge.textContent = navigator.onLine ? 'عُدْنَا إِلَى الاِتِّصَال' : 'أَنْتَ الآنَ دُونَ اِتِّصَال';
    badge.classList.add('show');
    setTimeout(()=>badge.classList.remove('show'), 2200);
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
}

function hardenLocalState(){
  if(!APP.state.completed || typeof APP.state.completed !== 'object'){
    APP.state.completed = {1:false,2:false,3:false,4:false,5:false};
  }
  for(let i=1;i<=5;i++){
    if(typeof APP.state.completed[i] !== 'boolean') APP.state.completed[i] = false;
  }
  saveState();
}


const APP = {
  state: JSON.parse(localStorage.getItem('alamNoonEpicState') || '{}'),
  page: document.body.dataset.page || 'home',
  voiceCaption: null,
  voiceText: null
};

function defaultState(){
  return {
    childName:'بَطَل',
    autoVoice:true,
    voiceRate:0.78,
    unlocked:2, // 1 = station1; value means next unlocked page count; we keep 2 so station1 is accessible
    completed:{1:false,2:false,3:false,4:false,5:false},
    awards:[]
  };
}
APP.state = Object.assign(defaultState(), APP.state);
function saveState(){localStorage.setItem('alamNoonEpicState', JSON.stringify(APP.state));}
function toast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer); t._timer = setTimeout(()=>t.classList.remove('show'),2200);
}
function speak(text){
  APP.lastVoice = text;
  if(APP.voiceText){APP.voiceText.textContent = text;}
  if(APP.voiceCaption){APP.voiceCaption.classList.remove('hidden');}
  if('speechSynthesis' in window){
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang='ar-SA'; u.rate=APP.state.voiceRate; u.pitch=1.02;
    u.onend=()=>setTimeout(()=>APP.voiceCaption && APP.voiceCaption.classList.add('hidden'),600);
    speechSynthesis.speak(u);
  }
}
function repeatVoice(){ if(APP.lastVoice) speak(APP.lastVoice); }
function initVoice(){
  APP.voiceCaption = document.getElementById('voiceCaption');
  APP.voiceText = document.getElementById('voiceText');
  const repeat = document.getElementById('repeatVoice');
  if(repeat) repeat.onclick = repeatVoice;
}
function lockNumberForStation(station){
  // station1 unlocked from start; for others require previous completion
  if(station===1) return false;
  return !APP.state.completed[station-1];
}
function unlock(station){
  APP.state.completed[station] = true;
  APP.state.unlocked = Math.max(APP.state.unlocked, station+1);
  if(!APP.state.awards.includes('station'+station)){ APP.state.awards.push('station'+station); }
  saveState();
}
function setChildNameEverywhere(){
  document.querySelectorAll('[data-child-name]').forEach(el=>el.textContent = APP.state.childName);
}
function pageIntro(){
  const voiceMap = {
    home:'مَرْحَبًا بِكَ فِي عَالَمِ نُون. فِي هَذِهِ اللَّيْلَةِ سَرَقَ ظِلُّ الصَّمْتِ خَمْسَةَ مَفَاتِيحَ مِنْ مَدِينَةِ الأَصْوَات. سَنُعِيدُهَا مَحَطَّةً بَعْدَ مَحَطَّة.',
    station1:'المَحَطَّةُ الأُولَى: سِرُّ المَخْبَزِ الذَّهَبِي. أَعِدْ صَوْتَ م بِاخْتِيَارِ الكَلِمَاتِ الصَّحِيحَة.',
    station2:'المَحَطَّةُ الثَّانِيَة: غَابَةُ البَالُونَاتِ. اِلْتَقِطْ بَالُونَاتِ صَوْتِ ب.',
    station3:'المَحَطَّةُ الثَّالِثَة: جِسْرُ الإِيقَاعِ. اِسْتَمِعْ ثُمَّ أَعِدِ الإِيقَاعَ عَلَى الطُّبُول.',
    station4:'المَحَطَّةُ الرَّابِعَة: كَهْفُ المِرْآةِ البِلَّوْرِيَّةِ. اِرْسُمْ خَيْطَ النُّورِ فَوْقَ المَسَار.',
    station5:'المَحَطَّةُ الخَامِسَة: قَصْرُ النُّجُومِ. أَجِبْ عَنْ أَسْئِلَةِ النِّهَايَةِ لِتُعِيدَ آخِرَ مِفْتَاح.',
    parents:'هَذِهِ لَوْحَةُ الوَالِدَيْن. مِنْ هُنَا يُمْكِنُ مُتَابَعَةُ التَّقَدُّمِ وَإِعَادَةُ الرِّحْلَة.'
  };
  if(APP.state.autoVoice && voiceMap[APP.page]) setTimeout(()=>speak(voiceMap[APP.page]), 400);
}

function initHome(){
  const nameInput = document.getElementById('childNameInput');
  if(nameInput){
    nameInput.value = APP.state.childName;
    document.getElementById('saveChildName').onclick = ()=>{
      APP.state.childName = nameInput.value.trim() || 'بَطَل'; saveState(); setChildNameEverywhere(); toast('تَمَّ حِفْظُ الاسْم');
    };
  }
  const cards = document.querySelectorAll('[data-station-card]');
  cards.forEach(card=>{
    const st = Number(card.dataset.stationCard);
    const locked = lockNumberForStation(st);
    if(locked){
      card.classList.add('locked');
      card.querySelector('.station-action').textContent = 'مُقْفَلَة';
      card.querySelector('.station-action').setAttribute('disabled','disabled');
    }else{
      card.querySelector('.station-action').onclick = ()=>location.href = card.querySelector('.station-action').dataset.href;
    }
    if(APP.state.completed[st]){
      const badge = document.createElement('span');
      badge.className = 'pill';
      badge.textContent = '✓ مُكْتَمِلَة';
      card.querySelector('.meta').prepend(badge);
    }
  });
  const startBtn = document.getElementById('startJourney');
  if(startBtn){
    let next = 1;
    for(let i=1;i<=5;i++){ if(!APP.state.completed[i]){ next=i; break; } if(i===5) next=5; }
    startBtn.onclick = ()=> location.href = 'station'+next+'.html';
  }
}

function initStation1(){
  let score = 0;
  const target = 3;
  const scoreEl = document.getElementById('scoreStation1');
  document.querySelectorAll('.choice').forEach(btn=>{
    btn.onclick = ()=>{
      if(btn.dataset.done) return;
      const good = btn.dataset.good === '1';
      if(good){
        btn.dataset.done = '1';
        btn.classList.add('ok');
        score++; scoreEl.textContent = score;
        speak('أَحْسَنْتَ. '+btn.dataset.word);
        if(score >= target){
          unlock(1);
          document.getElementById('nextStation1').classList.remove('hidden');
          speak('رَائِع. عَادَ صَوْتُ م إِلَى المَخْبَز. تَمَّ فَتْحُ غَابَةِ البَالُونَات.');
        }
      }else{
        btn.classList.add('bad');
        setTimeout(()=>btn.classList.remove('bad'),350);
        speak(btn.dataset.word + ' لا تَبْدَأُ بِصَوْتِ م');
      }
    };
  });
}

function initStation2(){
  let score=0, running=true;
  const area = document.getElementById('balloonArea');
  const scoreEl = document.getElementById('scoreStation2');
  const needed = 5;
  function spawn(){
    if(!running) return;
    const good = Math.random() > .42;
    const labelsGood = ['ب','بَ','بُ'];
    const labelsBad = ['م','س','ل'];
    const b = document.createElement('button');
    b.className = 'balloon ' + (good?'good':'bad');
    b.textContent = (good?labelsGood:labelsBad)[Math.floor(Math.random()*(good?labelsGood.length:labelsBad.length))];
    b.style.left = (8 + Math.random()*(area.clientWidth-78)) + 'px';
    b.style.top = (8 + Math.random()*220) + 'px';
    b.onclick = ()=>{
      b.remove();
      if(good){
        score++; scoreEl.textContent = score; speak(b.textContent);
        if(score >= needed){
          running=false; unlock(2); document.getElementById('nextStation2').classList.remove('hidden');
          speak('أَبْلَيْتَ بَلاءً حَسَنًا. فُتِحَ جِسْرُ الإِيقَاع.');
        }
      }else{ speak('لَيْسَ هَذَا صَوْتَ ب'); toast('اِبْحَثْ عَنْ ب');}
    };
    area.appendChild(b);
    const life = setTimeout(()=>b.remove(), 3800);
    let y = parseFloat(b.style.top);
    let dy = -0.35 - Math.random()*.35;
    function step(){
      if(!b.isConnected) return;
      y += dy; b.style.top = y+'px';
      if(y < -95){ b.remove(); return; }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  for(let i=0;i<6;i++) setTimeout(spawn, i*250);
  const inter = setInterval(()=>{ if(!running){ clearInterval(inter); return; } spawn(); }, 800);
}

function initStation3(){
  const sequence = ['م','ب','م','ب'];
  const seqWrap = document.getElementById('sequenceLights');
  seqWrap.innerHTML = '';
  sequence.forEach((_,i)=>{ const dot=document.createElement('i'); dot.textContent=i+1; seqWrap.appendChild(dot); });
  const status = document.getElementById('rhythmStatus');
  let idx = 0, playing=false;
  function highlight(i){
    [...seqWrap.children].forEach(el=>el.classList.remove('on'));
    if(i>=0 && seqWrap.children[i]) seqWrap.children[i].classList.add('on');
  }
  function playSeq(){
    if(playing) return;
    idx = 0; playing=true; status.textContent='اِسْتَمِعْ أَوَّلًا...';
    sequence.forEach((label,i)=>{
      setTimeout(()=>{ highlight(i); speak(label==='م'?'مَ':'بَ'); }, i*900);
    });
    setTimeout(()=>{ playing=false; highlight(-1); status.textContent='الآنَ أَعِدِ الإِيقَاعَ.'; }, sequence.length*900 + 300);
  }
  document.getElementById('replaySequence').onclick = playSeq;
  document.querySelectorAll('.drum').forEach(btn=>{
    btn.onclick = ()=>{
      if(playing){ toast('اِنْتَظِرْ حَتَّى يَنْتَهِي الإِيقَاع'); return; }
      btn.classList.add('hit'); setTimeout(()=>btn.classList.remove('hit'),150);
      const val = btn.dataset.hit;
      speak(val==='م'?'مَ':'بَ');
      if(val === sequence[idx]){
        highlight(idx); idx++;
        status.textContent = 'أَحْسَنْتَ! ' + idx + ' / ' + sequence.length;
        if(idx === sequence.length){
          unlock(3);
          document.getElementById('nextStation3').classList.remove('hidden');
          speak('مُمْتَاز. تَجَاوَزْتَ جِسْرَ الإِيقَاع، وَفُتِحَ كَهْفُ المِرْآة.');
        }
      }else{
        idx = 0; highlight(-1); status.textContent='لَا بَأْسَ. أَعِدِ الإِيقَاع.';
        speak('لَا بَأْسَ. اِسْتَمِعْ ثُمَّ حَاوِلْ مَرَّةً أُخْرَى.');
      }
    };
  });
  playSeq();
}

function initStation4(){
  const cv = document.getElementById('traceCanvas');
  const ctx = cv.getContext('2d');
  const meter = document.getElementById('traceMeterFill');
  const text = document.getElementById('traceStatus');
  let draw=false, last=null, dist=0;
  function drawGuide(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#fffaf0'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.save();
    ctx.strokeStyle='#e6ba6a'; ctx.lineWidth=36; ctx.setLineDash([24,18]); ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.font='bold 500px Tahoma'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.strokeText('ن', cv.width/2, cv.height/2+25);
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(670,210,22,0,Math.PI*2); ctx.fillStyle='#ffd64c'; ctx.shadowColor='#ffc400'; ctx.shadowBlur=20; ctx.fill(); ctx.restore();
    meter.style.width='0%'; text.textContent='اِبْدَأْ مِنَ النُّقْطَةِ المُضِيئَة'; dist=0;
    document.getElementById('nextStation4').classList.add('hidden');
  }
  function pos(e){ const r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)*(cv.width/r.width), y:(e.clientY-r.top)*(cv.height/r.height)}; }
  function start(e){ e.preventDefault(); draw=true; last=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); }
  function move(e){
    if(!draw) return;
    e.preventDefault();
    const p=pos(e); const d=Math.hypot(p.x-last.x,p.y-last.y); if(d<2) return;
    ctx.save(); ctx.setLineDash([]); ctx.strokeStyle='#f2a137'; ctx.lineWidth=36; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.restore();
    last=p; dist += Math.min(d,65);
    const pct = Math.min(100, Math.round(dist/15));
    meter.style.width = pct+'%';
    text.textContent = pct<70 ? 'وَاصِلِ الرَّسْم' : (pct<100 ? 'قَرِيبٌ جِدًّا' : 'رَائِع! أَكْمَلْتَ الأَثَر');
    if(pct>=100) document.getElementById('nextStation4').classList.remove('hidden');
  }
  function end(){ draw=false; last=null; }
  cv.addEventListener('pointerdown',start,{passive:false});
  cv.addEventListener('pointermove',move,{passive:false});
  cv.addEventListener('pointerup',end,{passive:false});
  cv.addEventListener('pointercancel',end,{passive:false});
  document.getElementById('clearTrace').onclick = drawGuide;
  document.getElementById('checkTrace').onclick = ()=>{
    if(dist < 950){ speak('رَسْمُكَ جَيِّد. واصِلْ قَلِيلًا ثُمَّ تَحَقَّقْ.'); return; }
    unlock(4);
    document.getElementById('nextStation4').classList.remove('hidden');
    speak('أَحْسَنْتَ. اِنْعَكَسَ النُّورُ فِي المِرْآة، وَفُتِحَ قَصْرُ النُّجُوم.');
  };
  drawGuide();
}

function initStation5(){
  const data = [
    {q:'أَيُّ كَلِمَةٍ تَبْدَأُ بِصَوْتِ م؟', a1:'مَوْز', a2:'بَاب', ok:1},
    {q:'أَيُّ حَرْفٍ كُنَّا نَلْتَقِطُهُ فِي غَابَةِ البَالُونَات؟', a1:'ب', a2:'س', ok:1},
    {q:'عَلَى جِسْرِ الإِيقَاعِ، هَلْ نُصْغِي أَوَّلًا أَمْ نَضْغَطُ بِسُرْعَة؟', a1:'نُصْغِي أَوَّلًا', a2:'نَضْغَطُ بِسُرْعَة', ok:1},
    {q:'فِي كَهْفِ المِرْآةِ، مَاذَا كُنَّا نَرْسُم؟', a1:'خَيْطَ النُّور', a2:'سُلَّمًا', ok:1},
    {q:'مَا اِسْمُ المَكَانِ الأَخِيرِ؟', a1:'قَصْرُ النُّجُوم', a2:'سُوقُ الأَلْوَان', ok:1},
  ];
  const wrap = document.getElementById('quizWrap');
  const progress = document.getElementById('finalProgress');
  let correct = 0;
  data.forEach((item, i)=>{
    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.innerHTML = `<strong>${i+1}. ${item.q}</strong>
      <div class="answer-row">
        <button class="answer-btn">${item.a1}</button>
        <button class="answer-btn">${item.a2}</button>
      </div>`;
    const buttons = div.querySelectorAll('.answer-btn');
    buttons.forEach((b, idx)=>{
      b.onclick = ()=>{
        if(div.dataset.done) return;
        div.dataset.done='1';
        if(idx+1 === item.ok){
          b.classList.add('correct');
          correct++; progress.style.width = Math.round(correct/data.length*100) + '%';
          speak('إِجَابَةٌ صَحِيحَة');
        }else{
          b.classList.add('bad');
          buttons[item.ok-1].classList.add('correct');
          speak('لَا بَأْسَ. هَذِهِ هِيَ الإِجَابَةُ الصَّحِيحَة.');
        }
        if([...wrap.children].every(x=>x.dataset.done==='1')){
          unlock(5);
          document.getElementById('endingBlock').classList.remove('hidden');
          speak('مَبْرُوك! أَعَدْتَ المِفْتَاحَ الأَخِيرَ، وَأَضَأْتَ مَدِينَةَ الأَصْوَاتِ كُلَّهَا.');
        }
      };
    });
    wrap.appendChild(div);
  });
}

function initParents(){
  document.getElementById('parentChild').textContent = APP.state.childName;
  document.getElementById('parentProgress').textContent = Object.values(APP.state.completed).filter(Boolean).length + ' / 5';
  document.getElementById('voiceRate').value = APP.state.voiceRate;
  document.getElementById('autoVoice').checked = APP.state.autoVoice;
  document.getElementById('voiceRate').oninput = e=>{ APP.state.voiceRate = Number(e.target.value); saveState(); };
  document.getElementById('autoVoice').onchange = e=>{ APP.state.autoVoice = e.target.checked; saveState(); };
  document.getElementById('resetJourney').onclick = ()=>{
    if(confirm('هل تريد إعادة الرحلة من البداية؟')){
      APP.state = defaultState(); saveState(); location.href='index.html';
    }
  };
}

document.addEventListener('DOMContentLoaded', ()=>{
  hardenLocalState(); initVoice(); setChildNameEverywhere(); pageIntro(); setupInstallPrompt(); setupOnlineStatus();
  if(APP.page === 'home') initHome();
  if(APP.page === 'station1') initStation1();
  if(APP.page === 'station2') initStation2();
  if(APP.page === 'station3') initStation3();
  if(APP.page === 'station4') initStation4();
  if(APP.page === 'station5') initStation5();
  if(APP.page === 'parents') initParents();
  document.querySelectorAll('.ask-voice').forEach(btn=>btn.onclick=()=>repeatVoice());
});
