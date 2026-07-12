
/* ============ محرك المؤثرات الصوتية (WebAudio — بلا أي ملفات خارجية) ============ */
const SFX = (()=>{
  let ctx = null;
  function ac(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    ctx = ctx || new AC();
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone({f=440,f2=0,type='sine',dur=.2,peak=.16,at=0}){
    const c = ac(); if(!c) return;
    const t0 = c.currentTime + at;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if(f2) o.frequency.exponentialRampToValueAtTime(f2, t0+dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0+.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    o.connect(g).connect(c.destination);
    o.start(t0); o.stop(t0+dur+.06);
  }
  function noise({dur=.15,peak=.2,at=0,freq=1800}){
    const c = ac(); if(!c) return;
    const t0 = c.currentTime + at;
    const len = Math.max(1, Math.floor(c.sampleRate*dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
    const s = c.createBufferSource(); s.buffer = buf;
    const fl = c.createBiquadFilter(); fl.type='bandpass'; fl.frequency.value=freq; fl.Q.value=.8;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0+.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    s.connect(fl); fl.connect(g); g.connect(c.destination);
    s.start(t0);
  }
  return {
    unlock(){ ac(); },
    tap(){ tone({f:540,dur:.07,peak:.07,type:'triangle'}); },
    good(){ tone({f:660,dur:.13,type:'triangle'}); tone({f:990,dur:.22,at:.09,type:'triangle'}); },
    bad(){ tone({f:210,f2:140,dur:.28,peak:.11}); },
    pop(){ noise({dur:.11,peak:.3,freq:2600}); tone({f:640,f2:1400,dur:.09,peak:.09,type:'square'}); },
    drum(kind){
      if(kind==='م'){ tone({f:150,f2:52,dur:.3,peak:.5}); noise({dur:.03,peak:.1,freq:420}); }
      else { tone({f:290,f2:120,dur:.2,peak:.4,type:'triangle'}); noise({dur:.05,peak:.16,freq:1300}); }
    },
    key(){ [660,880,1174,1568].forEach((f,i)=>tone({f,dur:.18,at:i*.09,type:'triangle',peak:.13})); },
    win(){ [523,659,784,1046,1318].forEach((f,i)=>tone({f,dur:.32,at:i*.12,type:'triangle',peak:.15})); },
    spark(){ tone({f:1400,f2:2500,dur:.11,peak:.06}); }
  };
})();
document.addEventListener('pointerdown', ()=>SFX.unlock(), {once:true, capture:true});

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
    badge.textContent = navigator.onLine ? 'عُدْنَا إِلَى الاِتِّصَال' : 'أَنْتَ الآنَ دُونَ اِتِّصَال';
    badge.classList.add('show');
    setTimeout(()=>badge.classList.remove('show'), 2200);
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
}

function hardenLocalState(){
  if(!APP.state.completed || typeof APP.state.completed !== 'object'){
    APP.state.completed = {1:false,2:false,3:false,4:false,5:false,6:false,7:false};
  }
  for(let i=1;i<=7;i++){
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

/* ============ الصوت المنطوق: صوت الجهاز العربي أولاً، وملفات mp3 المولّدة ضماناً ============ */
let arVoice = null, voicesLoaded = false;
function pickArabicVoice(){
  const vs = speechSynthesis.getVoices();
  if(vs.length) voicesLoaded = true;
  arVoice = vs.find(v=>/^ar[-_]/i.test(v.lang) || v.lang==='ar') || null;
}
if('speechSynthesis' in window){
  pickArabicVoice();
  speechSynthesis.onvoiceschanged = pickArabicVoice;
  // بعض الأجهزة لا تُحمّل قائمة الأصوات أبداً — بعد مهلة نعتبرها محسومة
  setTimeout(()=>{ pickArabicVoice(); voicesLoaded = true; }, 2500);
}
function clipSrc(text, clip){
  if(clip && window.VOICE_FILES && window.VOICE_FILES[clip]) return window.VOICE_FILES[clip];
  if(window.VOICE_MAP && window.VOICE_MAP[text]) return window.VOICE_MAP[text];
  return null;
}
function endSpeech(noon){
  setTimeout(()=>APP.voiceCaption && APP.voiceCaption.classList.add('hidden'),600);
  if(noon) noon.classList.remove('talk');
}
function playClip(src, noon){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  const a = APP.audioEl || (APP.audioEl = new Audio());
  a.onended = ()=>endSpeech(noon);
  a.onerror = ()=>endSpeech(noon);
  a.src = src;
  a.playbackRate = Math.min(1.25, Math.max(.75, APP.state.voiceRate / 0.78));
  a.play().catch(()=>endSpeech(noon));
}
function speak(text, clip){
  APP.lastVoice = text; APP.lastClip = clip;
  if(APP.voiceText){APP.voiceText.textContent = text;}
  if(APP.voiceCaption){APP.voiceCaption.classList.remove('hidden');}
  const noon = document.getElementById('noonBuddy');
  if(noon){ noon.classList.add('talk'); clearTimeout(noon._talkTimer); noon._talkTimer = setTimeout(()=>noon.classList.remove('talk'), Math.min(9000, 380*text.split(' ').length)); }
  if(APP.audioEl){ APP.audioEl.pause(); }
  const hasTTS = 'speechSynthesis' in window;
  const src = clipSrc(text, clip);
  // صوت الجهاز العربي أولاً دائماً؛ والمقاطع المولّدة فقط عند التأكد من غيابه
  // (يمنع خلط صوتين مختلفين عند تأخر تحميل قائمة الأصوات)
  if(src && (!hasTTS || (voicesLoaded && !arVoice))){ playClip(src, noon); return; }
  if(hasTTS){
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang='ar-SA'; u.rate=APP.state.voiceRate; u.pitch=1.02;
    if(arVoice) u.voice = arVoice;
    u.onend = ()=>endSpeech(noon);
    u.onerror = ()=>{ if(src) playClip(src, noon); else endSpeech(noon); };
    speechSynthesis.speak(u);
  }else if(src){
    playClip(src, noon);
  }
}
function repeatVoice(){ if(APP.lastVoice) speak(APP.lastVoice, APP.lastClip); }
function initVoice(){
  APP.voiceCaption = document.getElementById('voiceCaption');
  APP.voiceText = document.getElementById('voiceText');
  const repeat = document.getElementById('repeatVoice');
  if(repeat) repeat.onclick = repeatVoice;
}

/* ============ شخصية «نون» المرافقة (SVG مرسومة بالكود) ============ */
function mountNoon(){
  if(document.getElementById('noonBuddy')) return;
  const wrap = document.createElement('button');
  wrap.id = 'noonBuddy';
  wrap.setAttribute('aria-label','نون — اضغط لإعادة الاستماع');
  wrap.innerHTML = `
  <svg viewBox="0 0 120 120" role="img">
    <circle class="noon-dot" cx="60" cy="24" r="9" fill="#ffd64c" stroke="#b97a1d" stroke-width="3"/>
    <path d="M16 46 C16 92 104 92 104 46 L90 46 C90 76 30 76 30 46 Z"
          fill="#ffd977" stroke="#b97a1d" stroke-width="4" stroke-linejoin="round"/>
    <circle class="noon-eye" cx="46" cy="62" r="4.6" fill="#3a2a12"/>
    <circle class="noon-eye" cx="74" cy="62" r="4.6" fill="#3a2a12"/>
    <path class="noon-mouth" d="M50 71 Q60 79 70 71" fill="none" stroke="#3a2a12" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="38" cy="69" r="4" fill="#ff9d76" opacity=".55"/>
    <circle cx="82" cy="69" r="4" fill="#ff9d76" opacity=".55"/>
  </svg>`;
  wrap.onclick = ()=>{ SFX.tap(); repeatVoice(); };
  document.body.appendChild(wrap);
}

/* ============ سلسلة مفاتيح الطفل — تظهر في أعلى كل صفحة ============ */
function mountKeys(){
  const bar = document.querySelector('.topbar');
  if(!bar || document.getElementById('keyChain')) return;
  const el = document.createElement('span');
  el.id = 'keyChain';
  el.className = 'pill keychain';
  bar.appendChild(el);
  updateKeychain(false);
}
function updateKeychain(bump){
  const el = document.getElementById('keyChain');
  if(!el) return;
  let n = 0; for(let i=1;i<=5;i++) if(APP.state.completed[i]) n++;
  el.innerHTML = '🗝️ <b>'+n+'</b>/5';
  if(bump){ el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
}

/* ============ احتفال النجاح: نجوم متطايرة + قفزة نون + لحن فوز ============ */
function celebrate(count){
  SFX.win();
  const noon = document.getElementById('noonBuddy');
  if(noon){ noon.classList.add('happy'); setTimeout(()=>noon.classList.remove('happy'), 1900); }
  const n = count || 24;
  const icons = ['⭐','✨','🌟','💛','🗝️'];
  for(let i=0;i<n;i++){
    const s = document.createElement('i');
    s.className = 'confetti';
    s.textContent = icons[i % icons.length];
    s.style.left = (4 + Math.random()*92) + '%';
    s.style.fontSize = (14 + Math.random()*20) + 'px';
    s.style.animationDuration = (1.4 + Math.random()*1.3) + 's';
    s.style.animationDelay = (Math.random()*.5) + 's';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 3400);
  }
}

/* انفجار شرارات صغير داخل عنصر (بالونات، رسم، أفران) */
function burst(parent, x, y, icon, count){
  for(let i=0;i<(count||8);i++){
    const p = document.createElement('i');
    p.className = 'spark';
    p.textContent = icon || '✨';
    const a = Math.random()*Math.PI*2, r = 26 + Math.random()*44;
    p.style.setProperty('--dx', Math.cos(a)*r + 'px');
    p.style.setProperty('--dy', Math.sin(a)*r + 'px');
    p.style.left = x + 'px'; p.style.top = y + 'px';
    parent.appendChild(p);
    setTimeout(()=>p.remove(), 700);
  }
}

function lockNumberForStation(station){
  // station1 unlocked from start; for others require previous completion
  if(station===1) return false;
  return !APP.state.completed[station-1];
}
function unlock(station){
  const first = !APP.state.completed[station];
  APP.state.completed[station] = true;
  APP.state.unlocked = Math.max(APP.state.unlocked, station+1);
  if(!APP.state.awards.includes('station'+station)){ APP.state.awards.push('station'+station); }
  saveState();
  if(first){
    SFX.key(); updateKeychain(true);
    toast(station<=5 ? '🗝️ حَصَلْتَ عَلَى المِفْتَاحِ رَقْم '+station+'!' : '✨ تَحَرَّرَتْ رُوحُ حَرْفٍ جَدِيدَة!');
  }
}
function setChildNameEverywhere(){
  document.querySelectorAll('[data-child-name]').forEach(el=>el.textContent = APP.state.childName);
}
function pageIntro(){
  const name = APP.state.childName;
  const voiceMap = {
    home:'مَرْحَبًا يَا '+name+'! أَنَا نُون، صَدِيقُكَ فِي الرِّحْلَة. سَرَقَ ظِلُّ الصَّمْتِ خَمْسَةَ مَفَاتِيحَ مِنْ مَدِينَةِ الأَصْوَات، فَانْطَفَأَتْ أَنْوَارُهَا. هَيَّا نُعِيدُهَا مَعًا، مِفْتَاحًا بَعْدَ مِفْتَاح!',
    station1:'هَذَا مَخْبَزُ العَمِّ مِيم. أَفْرَانُهُ انْطَفَأَتْ لِأَنَّ صَوْتَ "مْ" ضَاع. اِضْغَطْ عَلَى أَيِّ بِطَاقَةٍ لِتَسْمَعَ كَلِمَتَهَا، فَإِنْ بَدَأَتْ بِصَوْتِ "مْ" اضْغَطْهَا مَرَّةً ثَانِيَةً لِتُشْعِلَ فُرْنًا!',
    station2:'وَصَلْنَا غَابَةَ البَالُونَات! البَالُونَاتُ الزَّرْقَاءُ تَحْمِلُ صَوْتَ "بْ". اِلْمِسْهَا لِتُفَرْقِعَهَا، وَاحْذَرِ البَالُونَاتِ البُرْتُقَالِيَّةَ فَهِيَ لِأَصْوَاتٍ أُخْرَى.',
    station3:'هَذَا جِسْرُ الإِيقَاع. اِسْمَعِ الطُّبُولَ جَيِّدًا: مَ... بَ... ثُمَّ أَعِدِ الإِيقَاعَ نَفْسَهُ بِالضَّغْطِ عَلَى الطَّبْلَيْنِ بِالتَّرْتِيب.',
    station4:'هَذَا كَهْفُ المِرْآة، وَهُنَا يَسْكُنُ حَرْفِي أَنَا: حَرْفُ نُون! نْ... مِثْلَ نَجْمَة وَنُور. مَرِّرْ إِصْبَعَكَ فَوْقَ الحَرْفِ الكَبِيرِ لِتَرْسُمَهُ بِخَيْطِ النُّور.',
    station5:'وَصَلْنَا قَصْرَ النُّجُوم، وَهُنَا المِفْتَاحُ الأَخِير! سَأَسْأَلُكَ عَنِ الأَصْوَاتِ الَّتِي تَعَلَّمْنَاهَا. اِضْغَطِ الإِجَابَةَ لِتَسْمَعَهَا، ثُمَّ اضْغَطْهَا ثَانِيَةً لِتَخْتَارَهَا.',
    station6:'وَصَلْنَا نَهْرَ الحُرُوف! حُرُوفٌ صَغِيرَةٌ تَسْبَحُ فِي المَاء. اِنْظُرْ إِلَى الحَرْفِ المَطْلُوبِ فَوْقَ النَّهْر، وَاصْطَدْهُ بِلَمْسِهِ قَبْلَ أَنْ يَهْرُب!',
    station7:'هَذِهِ وَرْشَةُ الكَلِمَات! اِضْغَطِ الحُرُوفَ بِالتَّرْتِيبِ الصَّحِيحِ لِتَطِيرَ إِلَى أَمَاكِنِهَا، فَتَصْنَعَ الآلَةُ كَلِمَةً جَدِيدَة.',
    spirits:'هَذَا أَلْبُومُ أَرْوَاحِ الحُرُوف. كُلَّمَا أَكْمَلْتَ مُهِمَّةً تَحَرَّرَتْ رُوحٌ جَدِيدَة. اِضْغَطْ عَلَى أَيِّ رُوحٍ لِتَسْمَعَهَا.',
    parents:'هَذِهِ لَوْحَةُ الوَالِدَيْن. مِنْ هُنَا يُمْكِنُ مُتَابَعَةُ التَّقَدُّمِ وَإِعَادَةُ الرِّحْلَة.'
  };
  if(APP.state.autoVoice && voiceMap[APP.page]) setTimeout(()=>speak(voiceMap[APP.page], 'intro-'+APP.page), 400);
}

function initHome(){
  const nameInput = document.getElementById('childNameInput');
  if(nameInput){
    nameInput.value = APP.state.childName;
    document.getElementById('saveChildName').onclick = ()=>{
      APP.state.childName = nameInput.value.trim() || 'بَطَل'; saveState(); setChildNameEverywhere(); SFX.good(); toast('تَمَّ حِفْظُ الاسْم');
    };
  }
  const cards = document.querySelectorAll('[data-station-card]');
  cards.forEach(card=>{
    const st = Number(card.dataset.stationCard);
    const locked = lockNumberForStation(st);
    if(locked){
      card.classList.add('locked');
      card.querySelector('.station-action').textContent = '🔒 مُقْفَلَة';
      card.querySelector('.station-action').setAttribute('disabled','disabled');
    }else{
      card.querySelector('.station-action').onclick = ()=>location.href = card.querySelector('.station-action').dataset.href;
    }
    if(APP.state.completed[st]){
      card.classList.add('done');
      const badge = document.createElement('span');
      badge.className = 'pill key-badge';
      badge.textContent = '🗝️ مُكْتَمِلَة';
      card.querySelector('.meta').prepend(badge);
    }
  });
  const startBtn = document.getElementById('startJourney');
  if(startBtn){
    let next = 1;
    for(let i=1;i<=5;i++){ if(!APP.state.completed[i]){ next=i; break; } if(i===5) next=5; }
    startBtn.onclick = ()=> location.href = 'station'+next+'.html';
  }
  const shc = document.getElementById('spiritHomeCount');
  if(shc) shc.textContent = '✨ ' + spiritsFreedCount() + '/8';
  // المدينة تحتفل عند اكتمال الرحلة كلها
  let all = true; for(let i=1;i<=5;i++) if(!APP.state.completed[i]) all = false;
  if(all && !sessionStorage.getItem('alamNoonCityParty')){
    sessionStorage.setItem('alamNoonCityParty','1');
    setTimeout(()=>{ celebrate(34); toast('أَضَأْتَ المَدِينَةَ كُلَّهَا يَا '+APP.state.childName+'! 🌟'); }, 900);
  }
}

/* ============ المحطة 1: اسمع أولاً ثم اختر — وكل إجابة تُشعل فرناً ============ */
function initStation1(){
  let score = 0;
  const target = 3;
  const scoreEl = document.getElementById('scoreStation1');
  const ovens = document.querySelectorAll('.oven');
  let armed = null;
  function disarm(){ if(armed){ armed.classList.remove('armed'); armed = null; } }
  document.querySelectorAll('.choice').forEach(btn=>{
    btn.onclick = ()=>{
      if(btn.dataset.done) return;
      // اللمسة الأولى: اسمع الكلمة فقط
      if(armed !== btn){
        disarm();
        armed = btn; btn.classList.add('armed');
        SFX.tap();
        speak(btn.dataset.word, 'word-'+btn.dataset.slug);
        return;
      }
      // اللمسة الثانية: اختيار
      disarm();
      const good = btn.dataset.good === '1';
      if(good){
        btn.dataset.done = '1';
        btn.classList.add('ok');
        SFX.good();
        const r = btn.getBoundingClientRect(), pr = btn.parentElement.getBoundingClientRect();
        burst(btn.parentElement, r.left - pr.left + r.width/2, r.top - pr.top + r.height/2, '✨', 8);
        score++; scoreEl.textContent = score;
        if(ovens[score-1]){ ovens[score-1].classList.add('lit'); }
        speak('أَحْسَنْتَ! '+btn.dataset.word+' تَبْدَأُ بِصَوْتِ مْ. اِشْتَعَلَ فُرْن!', 'ok1-'+btn.dataset.slug);
        if(score >= target){
          unlock(1);
          document.getElementById('nextStation1').classList.remove('hidden');
          celebrate();
          setTimeout(()=>speak('رَائِع يَا '+APP.state.childName+'! عَادَ صَوْتُ مْ وَاشْتَعَلَتِ الأَفْرَانُ كُلُّهَا. خُذِ المِفْتَاحَ الأَوَّل، وَهَيَّا إِلَى غَابَةِ البَالُونَات!', 'done1'), 700);
        }
      }else{
        btn.classList.add('bad');
        SFX.bad();
        setTimeout(()=>btn.classList.remove('bad'),350);
        speak(btn.dataset.word + ' تَبْدَأُ بِصَوْتٍ آخَر، لَيْسَ مْ. جَرِّبْ غَيْرَهَا!', 'no1-'+btn.dataset.slug);
      }
    };
  });
}

/* ============ المحطة 2: بالونات تتمايل وتنفجر بشرارات وصوت حقيقي ============ */
const LETTER_CLIPS = {'ب':'l-b','بَ':'l-ba','بُ':'l-bu','م':'l-m','س':'l-s','ل':'l-l','مَ':'l-ma'};
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
    const baseX = 8 + Math.random()*(area.clientWidth-82);
    const y0 = 30 + Math.random()*200;
    b.style.left = baseX + 'px';
    b.style.top = y0 + 'px';
    b.onclick = ()=>{
      const bx = b.offsetLeft + 35, by = b.offsetTop + 40;
      b.remove();
      if(good){
        SFX.pop();
        burst(area, bx, by, '✨', 10);
        score++; scoreEl.textContent = score; speak(b.textContent, LETTER_CLIPS[b.textContent]);
        if(score >= needed){
          running=false; unlock(2); document.getElementById('nextStation2').classList.remove('hidden');
          celebrate();
          setTimeout(()=>speak('أَبْلَيْتَ بَلَاءً حَسَنًا! جَمَعْتَ بَالُونَاتِ صَوْتِ بْ كُلَّهَا، وَفُتِحَ جِسْرُ الإِيقَاع.', 'done2'), 700);
        }
      }else{
        SFX.bad();
        burst(area, bx, by, '💨', 5);
        speak('لَيْسَ هَذَا صَوْتَ بْ', 'no2'); toast('اِبْحَثْ عَنِ البَالُونَاتِ الزَّرْقَاء 🎈');
      }
    };
    area.appendChild(b);
    setTimeout(()=>b.remove(), 4200);
    let y = y0;
    let dy = -0.35 - Math.random()*.35;
    const sway = 10 + Math.random()*8, phase = Math.random()*6;
    function step(){
      if(!b.isConnected) return;
      y += dy;
      b.style.top = y+'px';
      b.style.left = (baseX + Math.sin((y0-y)/26 + phase)*sway) + 'px';
      if(y < -95){ b.remove(); return; }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  for(let i=0;i<6;i++) setTimeout(spawn, i*250);
  const inter = setInterval(()=>{ if(!running){ clearInterval(inter); return; } spawn(); }, 800);
}

/* ============ المحطة 3: طبول بصوت حقيقي وموجات اهتزاز ============ */
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
  function thump(btn){
    btn.classList.remove('hit'); void btn.offsetWidth; btn.classList.add('hit');
    setTimeout(()=>btn.classList.remove('hit'), 300);
  }
  function playSeq(){
    if(playing) return;
    idx = 0; playing=true; status.textContent='اِسْتَمِعْ أَوَّلًا...';
    sequence.forEach((label,i)=>{
      setTimeout(()=>{
        highlight(i);
        SFX.drum(label);
        const btn = document.querySelector('.drum[data-hit="'+label+'"]');
        if(btn) thump(btn);
        speak(label==='م'?'مَ':'بَ', label==='م'?'l-ma':'l-ba');
      }, i*900);
    });
    setTimeout(()=>{ playing=false; highlight(-1); status.textContent='الآنَ أَعِدِ الإِيقَاعَ.'; }, sequence.length*900 + 300);
  }
  document.getElementById('replaySequence').onclick = playSeq;
  document.querySelectorAll('.drum').forEach(btn=>{
    btn.onclick = ()=>{
      if(playing){ toast('اِنْتَظِرْ حَتَّى يَنْتَهِي الإِيقَاع'); return; }
      thump(btn);
      const val = btn.dataset.hit;
      SFX.drum(val);
      speak(val==='م'?'مَ':'بَ', val==='م'?'l-ma':'l-ba');
      if(val === sequence[idx]){
        highlight(idx); idx++;
        status.textContent = 'أَحْسَنْتَ! ' + idx + ' / ' + sequence.length;
        if(idx === sequence.length){
          unlock(3);
          document.getElementById('nextStation3').classList.remove('hidden');
          celebrate();
          setTimeout(()=>speak('مُمْتَاز! عَزَفْتَ الإِيقَاعَ صَحِيحًا وَعَبَرْنَا الجِسْر. فُتِحَ كَهْفُ المِرْآة!', 'done3'), 700);
        }
      }else{
        idx = 0; highlight(-1); status.textContent='لَا بَأْسَ. أَعِدِ الإِيقَاع.';
        SFX.bad();
        speak('لَا بَأْسَ. اِسْتَمِعْ ثُمَّ حَاوِلْ مَرَّةً أُخْرَى.', 'no3');
      }
    };
  });
  playSeq();
}

/* ============ المحطة 4: رسم حرف ن بشرارات نور ============ */
function initStation4(){
  const cv = document.getElementById('traceCanvas');
  const ctx = cv.getContext('2d');
  const meter = document.getElementById('traceMeterFill');
  const text = document.getElementById('traceStatus');
  const box = cv.closest('.canvas-box');
  let draw=false, last=null, dist=0, sparkAt=0;
  function drawGuide(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#fffaf0'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.save();
    ctx.strokeStyle='#e6ba6a'; ctx.lineWidth=36; ctx.setLineDash([24,18]); ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.font='bold 500px Tahoma'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.strokeText('ن', cv.width/2, cv.height/2+25);
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(670,210,22,0,Math.PI*2); ctx.fillStyle='#ffd64c'; ctx.shadowColor='#ffc400'; ctx.shadowBlur=20; ctx.fill(); ctx.restore();
    meter.style.width='0%'; text.textContent='اِبْدَأْ مِنَ النُّقْطَةِ المُضِيئَة'; dist=0;
    document.getElementById('nextStation4').classList.add('hidden');
  }
  function pos(e){ const r=cv.getBoundingClientRect(); const br=box.getBoundingClientRect(); return {x:(e.clientX-r.left)*(cv.width/r.width), y:(e.clientY-r.top)*(cv.height/r.height), cx:e.clientX-br.left, cy:e.clientY-br.top}; }
  function start(e){ e.preventDefault(); draw=true; last=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); }
  function move(e){
    if(!draw) return;
    e.preventDefault();
    const p=pos(e); const d=Math.hypot(p.x-last.x,p.y-last.y); if(d<2) return;
    ctx.save(); ctx.setLineDash([]); ctx.strokeStyle='#f2a137'; ctx.lineWidth=36; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.shadowColor='#ffc400'; ctx.shadowBlur=14;
    ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.restore();
    last=p; dist += Math.min(d,65);
    if(dist - sparkAt > 130){ sparkAt = dist; SFX.spark(); burst(box, p.cx, p.cy, '✨', 3); }
    const pct = Math.min(100, Math.round(dist/15));
    meter.style.width = pct+'%';
    text.textContent = pct<70 ? 'وَاصِلِ الرَّسْم' : (pct<100 ? 'قَرِيبٌ جِدًّا' : 'رَائِع! أَكْمَلْتَ الأَثَر');
    if(pct>=100) document.getElementById('nextStation4').classList.remove('hidden');
  }
  function end(){ draw=false; last=null; }
  cv.addEventListener('pointerdown',start,{passive:false});
  cv.addEventListener('pointermove',move,{passive:false});
  cv.addEventListener('pointerup',end,{passive:false});
  cv.addEventListener('pointercancel',end,{passive:false});
  document.getElementById('clearTrace').onclick = ()=>{ SFX.tap(); drawGuide(); };
  document.getElementById('checkTrace').onclick = ()=>{
    if(dist < 950){ speak('رَسْمُكَ جَيِّد. وَاصِلْ فَوْقَ الحَرْفِ قَلِيلًا ثُمَّ تَحَقَّقْ.', 'more4'); return; }
    unlock(4);
    document.getElementById('nextStation4').classList.remove('hidden');
    celebrate();
    setTimeout(()=>speak('أَحْسَنْتَ! رَسَمْتَ حَرْفَ نُون بِخَيْطِ النُّور: نْ... مِثْلَ نَجْمَة. اِنْعَكَسَ النُّورُ وَفُتِحَ قَصْرُ النُّجُوم!', 'done4'), 700);
  };
  drawGuide();
}

/* ============ المحطة 5: اختبار الأصوات — اسمع ثم اختر الصورة ============ */
function initStation5(){
  const data = [
    {q:'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ مْ؟', qc:'q-m', opts:[{e:'🍌',w:'مَوْز',c:'mawz',ok:1},{e:'🚪',w:'بَاب',c:'bab',ok:0}]},
    {q:'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ بْ؟', qc:'q-b', opts:[{e:'🎈',w:'بَالُون',c:'balloon',ok:1},{e:'💧',w:'مَاء',c:'maa',ok:0}]},
    {q:'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ نْ؟', qc:'q-n', opts:[{e:'⭐',w:'نَجْمَة',c:'najma',ok:1},{e:'🍎',w:'تُفَّاحَة',c:'tuffaha',ok:0}]},
    {q:'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ مْ؟', qc:'q-m', opts:[{e:'🥄',w:'مِلْعَقَة',c:'milaaqa',ok:1},{e:'⭐',w:'نَجْمَة',c:'najma',ok:0}]},
    {q:'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ نْ؟', qc:'q-n', opts:[{e:'🔥',w:'نَار',c:'nar',ok:1},{e:'🎈',w:'بَالُون',c:'balloon',ok:0}]},
  ];
  const wrap = document.getElementById('quizWrap');
  const progress = document.getElementById('finalProgress');
  let doneCount = 0;
  const items = data.map((item, i)=>{
    const opts = Math.random() > .5 ? [item.opts[0], item.opts[1]] : [item.opts[1], item.opts[0]];
    const div = document.createElement('div');
    div.className = 'quiz-item' + (i===0 ? '' : ' hidden');
    div.innerHTML = `<div class="quiz-q"><button class="icon-btn quiz-say" aria-label="اسمع السؤال">🔊</button><strong>${i+1}. ${item.q}</strong></div>
      <div class="answer-row">
        ${opts.map(o=>`<button class="answer-btn pic" data-ok="${o.ok}" data-word="${o.w}" data-clip="${o.c}"><span class="emoji">${o.e}</span><b>${o.w}</b></button>`).join('')}
      </div>`;
    div.querySelector('.quiz-say').onclick = ()=>speak(item.q, item.qc);
    let armed = null;
    const buttons = div.querySelectorAll('.answer-btn');
    buttons.forEach(b=>{
      b.onclick = ()=>{
        if(div.dataset.done) return;
        // اللمسة الأولى: اسمع الكلمة
        if(armed !== b){
          buttons.forEach(x=>x.classList.remove('armed'));
          armed = b; b.classList.add('armed');
          SFX.tap();
          speak(b.dataset.word, 'word-'+b.dataset.clip);
          return;
        }
        // اللمسة الثانية: اختيار
        b.classList.remove('armed'); armed = null;
        div.dataset.done='1';
        const good = b.dataset.ok === '1';
        if(good){
          b.classList.add('correct');
          SFX.good();
          speak('إِجَابَةٌ صَحِيحَة! '+b.dataset.word, 'ok5-'+b.dataset.clip);
        }else{
          b.classList.add('bad');
          SFX.bad();
          const right = [...buttons].find(x=>x.dataset.ok==='1');
          right.classList.add('correct');
          speak('لَا بَأْسَ. الإِجَابَةُ الصَّحِيحَةُ هِيَ: '+right.dataset.word, 'fix5-'+right.dataset.clip);
        }
        doneCount++;
        progress.style.width = Math.round(doneCount/data.length*100) + '%';
        const next = items[i+1];
        if(next){
          setTimeout(()=>{ next.classList.remove('hidden'); if(APP.state.autoVoice) speak(data[i+1].q, data[i+1].qc); next.scrollIntoView({behavior:'smooth', block:'center'}); }, 1400);
        }else{
          unlock(5);
          document.getElementById('endingBlock').classList.remove('hidden');
          celebrate(36);
          setTimeout(()=>speak('مَبْرُوك يَا '+APP.state.childName+'! أَعَدْتَ المِفْتَاحَ الأَخِيرَ، وَأَضَأْتَ مَدِينَةَ الأَصْوَاتِ كُلَّهَا!', 'done5'), 800);
          setTimeout(()=>document.getElementById('endingBlock').scrollIntoView({behavior:'smooth'}), 1500);
        }
      };
    });
    wrap.appendChild(div);
    return div;
  });
}

/* ============ المحطة 6: نهر الحروف — اصطياد الحروف السابحة ============ */
function initStation6(){
  const area = document.getElementById('riverArea');
  const targetEl = document.getElementById('riverTarget');
  const caughtEl = document.getElementById('riverCaught');
  const roundsEl = document.getElementById('riverRounds');
  const ROUNDS = [
    {t:'م', clip:'l-m', hunt:'hunt-m'},
    {t:'ب', clip:'l-b', hunt:'hunt-b'},
    {t:'س', clip:'l-s', hunt:'hunt-s'},
  ];
  const POOL = ['م','ب','س','ن','ل','ر'];
  let round = 0, caught = 0, running = true;
  function announce(){
    const r = ROUNDS[round];
    targetEl.textContent = r.t;
    caughtEl.textContent = caught;
    [...roundsEl.children].forEach((d,i)=>d.classList.toggle('on', i<=round));
    speak('اِصْطَدْ ثَلَاثَةَ حُرُوفِ ' + r.t, r.hunt);
  }
  function spawn(){
    if(!running) return;
    const good = Math.random() > .45;
    const r = ROUNDS[round];
    const ch = good ? r.t : POOL.filter(x=>x!==r.t)[Math.floor(Math.random()*5)];
    const f = document.createElement('button');
    f.className = 'drift' + (ch===r.t ? ' good' : '');
    f.textContent = ch;
    const y0 = 14 + Math.random()*62; // نسبة من ارتفاع النهر
    f.style.top = y0 + '%';
    f.style.right = '-70px';
    area.appendChild(f);
    let x = -70; // من اليمين إلى اليسار مع تموّج
    const vx = .8 + Math.random()*.7, amp = 6 + Math.random()*7, ph = Math.random()*6;
    function step(){
      if(!f.isConnected) return;
      x += vx;
      f.style.right = x + 'px';
      f.style.top = (y0 + Math.sin(x/34 + ph)*amp*.6) + '%';
      if(x > area.clientWidth + 40){ f.remove(); return; }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    f.onclick = ()=>{
      const fx = f.offsetLeft + 30, fy = f.offsetTop + 30;
      const isGood = f.textContent === ROUNDS[round].t;
      f.remove();
      if(isGood){
        SFX.pop(); burst(area, fx, fy, '💧', 9);
        speak(ROUNDS[round].t, ROUNDS[round].clip);
        caught++; caughtEl.textContent = caught;
        if(caught >= 3){
          if(round < ROUNDS.length-1){
            round++; caught = 0;
            SFX.good();
            setTimeout(announce, 900);
          }else{
            running = false;
            unlock(6);
            document.getElementById('nextStation6').classList.remove('hidden');
            celebrate();
            setTimeout(()=>speak('مُدْهِش! نَظَّفْتَ النَّهْرَ مِنَ الحُرُوفِ الضَّائِعَة، وَتَحَرَّرَتْ رُوحُ حَرْفِ سِين!', 'done6'), 700);
          }
        }
      }else{
        SFX.bad(); burst(area, fx, fy, '💨', 4);
        speak('لَيْسَ هَذَا هُوَ الحَرْفُ المَطْلُوب', 'no6');
      }
    };
  }
  announce();
  for(let i=0;i<3;i++) setTimeout(spawn, 500 + i*400);
  const inter = setInterval(()=>{ if(!running){ clearInterval(inter); return; } spawn(); }, 950);
}

/* ============ المحطة 7: ورشة الكلمات — تركيب الكلمة حرفاً حرفاً ============ */
function initStation7(){
  const WORDS = [
    {w:'مَوْز', e:'🍌', letters:['م','و','ز'], clip:'made-mawz', ask:'build-mawz'},
    {w:'بَاب', e:'🚪', letters:['ب','ا','ب'], clip:'made-bab',  ask:'build-bab'},
    {w:'نُور', e:'💡', letters:['ن','و','ر'], clip:'made-nur',  ask:'build-nur'},
  ];
  const TILE_CLIPS = {'م':'l-m','و':'l-wa','ز':'l-za','ب':'l-b','ا':'l-aa','ن':'l-na','ر':'l-ra','س':'l-s','ل':'l-l','ت':'l-ta'};
  const DISTRACT = ['س','ل','ت'];
  const slots = document.getElementById('wordSlots');
  const pool = document.getElementById('letterPool');
  const out = document.getElementById('machineOut');
  const doneEl = document.getElementById('wordsDone');
  const roundsEl = document.getElementById('wordRounds');
  let wi = 0, li = 0;
  function setup(){
    const W = WORDS[wi];
    document.getElementById('wordTargetEmoji').textContent = W.e;
    [...roundsEl.children].forEach((d,i)=>d.classList.toggle('on', i<=wi));
    out.classList.add('hidden');
    li = 0;
    slots.innerHTML = '';
    W.letters.forEach(()=>{ const sl=document.createElement('span'); sl.className='slot'; slots.appendChild(sl); });
    const tiles = [...W.letters, DISTRACT[wi % DISTRACT.length], DISTRACT[(wi+1) % DISTRACT.length]];
    tiles.sort(()=>Math.random()-.5);
    pool.innerHTML = '';
    tiles.forEach(ch=>{
      const t = document.createElement('button');
      t.className = 'tile'; t.textContent = ch;
      t.onclick = ()=>{
        if(t.disabled) return;
        SFX.tap();
        speak(ch, TILE_CLIPS[ch]);
        if(ch === W.letters[li]){
          t.disabled = true; t.classList.add('used');
          const sl = slots.children[li];
          sl.textContent = ch; sl.classList.add('filled');
          SFX.good();
          li++;
          if(li === W.letters.length){
            setTimeout(()=>{
              document.getElementById('machineEmoji').textContent = W.e;
              document.getElementById('machineWord').textContent = W.w;
              out.classList.remove('hidden');
              out.classList.remove('made'); void out.offsetWidth; out.classList.add('made');
              SFX.key();
              speak('رَائِع! صَنَعْنَا كَلِمَةَ ' + W.w + '!', W.clip);
              wi++;
              doneEl.textContent = wi;
              if(wi < WORDS.length){
                setTimeout(setup, 2300);
              }else{
                unlock(7);
                document.getElementById('nextStation7').classList.remove('hidden');
                celebrate();
                setTimeout(()=>speak('عَمَلٌ رَائِع! صَنَعْنَا ثَلَاثَ كَلِمَات، وَتَحَرَّرَتْ رُوحَا حَرْفَيْ رَاء وَوَاو!', 'done7'), 1400);
              }
            }, 500);
          }
        }else{
          t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake');
          SFX.bad();
        }
      };
      pool.appendChild(t);
    });
    speak('رَكِّبْ كَلِمَةَ ' + W.w, W.ask);
  }
  setup();
}

/* ============ ألبوم أرواح الحروف — الجمع والمكافأة ============ */
const SPIRITS = [
  {k:'m', img:'spirit-m', name:'رُوحُ مِيم',  clip:'sp-m', line:'أَنَا رُوحُ حَرْفِ مِيم. مْ... مِثْلَ مَوْز وَمَاء وَمِفْتَاح.', need:c=>c[1]},
  {k:'b', img:'spirit-b', name:'رُوحُ بَاء',  clip:'sp-b', line:'أَنَا رُوحُ حَرْفِ بَاء. بْ... مِثْلَ بَاب وَبَالُون.', need:c=>c[2]},
  {k:'n', img:'spirit-n', name:'رُوحُ نُون',  clip:'sp-n', line:'أَنَا رُوحُ حَرْفِ نُون. نْ... مِثْلَ نَجْمَة وَنُور.', need:c=>c[4]},
  {k:'s', img:'spirit-s', name:'رُوحُ سِين',  clip:'sp-s', line:'أَنَا رُوحُ حَرْفِ سِين. سْ... مِثْلَ سَمَكَة وَسَمَاء.', need:c=>c[6]},
  {k:'r', img:'spirit-r', name:'رُوحُ رَاء',  clip:'sp-r', line:'أَنَا رُوحُ حَرْفِ رَاء. رْ... مِثْلَ رُمَّان وَرِيشَة.', need:c=>c[7]},
  {k:'w', img:'spirit-w', name:'رُوحُ وَاو',  clip:'sp-w', line:'أَنَا رُوحُ حَرْفِ وَاو. وْ... مِثْلَ وَرْدَة وَوَلَد.', need:c=>c[7]},
  {k:'d', img:'spirit-d', name:'رُوحٌ نَائِمَة', clip:'sp-locked', line:'أَنَا رُوحٌ نَائِمَة... سَتُوقِظُنِي مُهِمَّاتٌ جَدِيدَةٌ قَرِيبًا!', need:()=>false},
  {k:'f', img:'spirit-f', name:'رُوحٌ نَائِمَة', clip:'sp-locked', line:'أَنَا رُوحٌ نَائِمَة... سَتُوقِظُنِي مُهِمَّاتٌ جَدِيدَةٌ قَرِيبًا!', need:()=>false},
];
function spiritsFreedCount(){
  return SPIRITS.filter(sp=>sp.need(APP.state.completed)).length;
}
function initSpirits(){
  const grid = document.getElementById('spiritGrid');
  document.getElementById('spiritCount').textContent = spiritsFreedCount();
  SPIRITS.forEach(sp=>{
    const free = sp.need(APP.state.completed);
    const card = document.createElement('button');
    card.className = 'spirit-card' + (free ? '' : ' locked');
    card.innerHTML = `<img src="assets/img/${sp.img}.webp" alt="${sp.name}" loading="lazy" decoding="async">
      <b>${free ? sp.name : '🔒 ' + sp.name}</b>`;
    card.onclick = ()=>{
      SFX.tap();
      card.classList.remove('hop'); void card.offsetWidth; card.classList.add('hop');
      speak(sp.line, sp.clip);
    };
    grid.appendChild(card);
  });
}

function initParents(){
  document.getElementById('parentChild').textContent = APP.state.childName;
  document.getElementById('parentProgress').textContent = Object.values(APP.state.completed).filter(Boolean).length + ' / 7';
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
  hardenLocalState(); initVoice(); setChildNameEverywhere(); mountNoon(); mountKeys(); pageIntro(); setupInstallPrompt(); setupOnlineStatus();
  if(APP.page === 'home') initHome();
  if(APP.page === 'station1') initStation1();
  if(APP.page === 'station2') initStation2();
  if(APP.page === 'station3') initStation3();
  if(APP.page === 'station4') initStation4();
  if(APP.page === 'station5') initStation5();
  if(APP.page === 'station6') initStation6();
  if(APP.page === 'station7') initStation7();
  if(APP.page === 'spirits') initSpirits();
  if(APP.page === 'parents') initParents();
  document.querySelectorAll('.ask-voice').forEach(btn=>btn.onclick=()=>repeatVoice());
});
