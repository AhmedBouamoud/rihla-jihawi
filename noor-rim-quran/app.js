const surahs = [
  {id:'ikhlas', name:'الإخلاص', icon:'🌸', label:'قصيرة ومحبوبة', audio:'112-ikhlas', color:'#f5c6d8', ayahs:[
    {text:'قُلْ هُوَ اللَّهُ أَحَدٌ', words:['قُلْ','هُوَ','اللَّهُ','أَحَدٌ'], nudge:'قُلْ… هُوَ… اللهُ… أَحَدٌ'},
    {text:'اللَّهُ الصَّمَدُ', words:['اللَّهُ','الصَّمَدُ'], nudge:'الصَّمَدُ: الصَّـ / مَـ / دُ'},
    {text:'لَمْ يَلِدْ وَلَمْ يُولَدْ', words:['لَمْ','يَلِدْ','وَلَمْ','يُولَدْ'], nudge:'كلمات قصيرة… نرددها بهدوء.'},
    {text:'وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ', words:['وَلَمْ','يَكُنْ','لَّهُ','كُفُوًا','أَحَدٌ'], nudge:'كُفُوًا… نعيدها معاً يا ريم.'}
  ]},
  {id:'kawthar', name:'الكوثر', icon:'💧', label:'ثلاث آيات فقط', audio:'108-kawthar', color:'#bfefff', ayahs:[
    {text:'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', words:['إِنَّا','أَعْطَيْنَاكَ','الْكَوْثَرَ'], nudge:'أَعْطَيْـ / نَاكَ… الكوثر.'},
    {text:'فَصَلِّ لِرَبِّكَ وَانْحَرْ', words:['فَصَلِّ','لِرَبِّكَ','وَانْحَرْ'], nudge:'فَصَلِّ… لربك… وانحر.'},
    {text:'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', words:['إِنَّ','شَانِئَكَ','هُوَ','الْأَبْتَرُ'], nudge:'نقسمها: شا / نِئَ / كَ.'}
  ]},
  {id:'nas', name:'الناس', icon:'🕊️', label:'سكينة وطمأنينة', audio:'114-nas', color:'#d9f7e8', ayahs:[
    {text:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', words:['قُلْ','أَعُوذُ','بِرَبِّ','النَّاسِ'], nudge:'أَعُوذُ… نمدها بهدوء.'},
    {text:'مَلِكِ النَّاسِ', words:['مَلِكِ','النَّاسِ'], nudge:'كلمتان فقط يا ريم.'},
    {text:'إِلَٰهِ النَّاسِ', words:['إِلَٰهِ','النَّاسِ'], nudge:'إله الناس… صوت هادئ.'},
    {text:'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', words:['مِنْ','شَرِّ','الْوَسْوَاسِ','الْخَنَّاسِ'], nudge:'الوسواس… الخناس.'},
    {text:'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', words:['الَّذِي','يُوَسْوِسُ','فِي','صُدُورِ','النَّاسِ'], nudge:'نقرأ كلمة كلمة.'},
    {text:'مِنَ الْجِنَّةِ وَالنَّاسِ', words:['مِنَ','الْجِنَّةِ','وَالنَّاسِ'], nudge:'آخر آية… أحسنت يا ريم.'}
  ]},
  {id:'falaq', name:'الفلق', icon:'🌅', label:'نور وحماية', audio:'113-falaq', color:'#ffe7b6', ayahs:[
    {text:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', words:['قُلْ','أَعُوذُ','بِرَبِّ','الْفَلَقِ'], nudge:'الفلق… نور الصباح.'},
    {text:'مِنْ شَرِّ مَا خَلَقَ', words:['مِنْ','شَرِّ','مَا','خَلَقَ'], nudge:'أربع كلمات قصيرة.'},
    {text:'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', words:['وَمِنْ','شَرِّ','غَاسِقٍ','إِذَا','وَقَبَ'], nudge:'غاسقٍ… إذا… وقب.'},
    {text:'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', words:['وَمِنْ','شَرِّ','النَّفَّاثَاتِ','فِي','الْعُقَدِ'], nudge:'النَّفَّاثات… نقسمها بهدوء.'},
    {text:'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', words:['وَمِنْ','شَرِّ','حَاسِدٍ','إِذَا','حَسَدَ'], nudge:'آخر آية في سورة الفلق.'}
  ]},
  {id:'fatiha', name:'الفاتحة', icon:'🌙', label:'نأخذها ببطء', audio:'001-fatiha', color:'#e6dbff', ayahs:[
    {text:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', words:['بِسْمِ','اللَّهِ','الرَّحْمَٰنِ','الرَّحِيمِ'], nudge:'بسم الله… بداية النور.'},
    {text:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', words:['الْحَمْدُ','لِلَّهِ','رَبِّ','الْعَالَمِينَ'], nudge:'الحمد لله… بهدوء.'},
    {text:'الرَّحْمَٰنِ الرَّحِيمِ', words:['الرَّحْمَٰنِ','الرَّحِيمِ'], nudge:'كلمتان جميلتان.'},
    {text:'مَالِكِ يَوْمِ الدِّينِ', words:['مَالِكِ','يَوْمِ','الدِّينِ'], nudge:'نردد كلمة كلمة.'},
    {text:'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', words:['إِيَّاكَ','نَعْبُدُ','وَإِيَّاكَ','نَسْتَعِينُ'], nudge:'آية طويلة، نقسمها.'},
    {text:'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', words:['اهْدِنَا','الصِّرَاطَ','الْمُسْتَقِيمَ'], nudge:'اهدنا الصراط المستقيم.'},
    {text:'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', words:['صِرَاطَ','الَّذِينَ','أَنْعَمْتَ','عَلَيْهِمْ','غَيْرِ','الْمَغْضُوبِ','عَلَيْهِمْ','وَلَا','الضَّالِّينَ'], nudge:'نأخذها على مراحل صغيرة يا ريم.'}
  ]},
  {id:'asr', name:'العصر', icon:'⏳', label:'سورة صغيرة عن قيمة الوقت', audio:'103-asr', color:'#ffd9c2', ayahs:[
    {text:'وَالْعَصْرِ', words:['وَالْعَصْرِ'], nudge:'آية واحدة قصيرة… والعصر.'},
    {text:'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', words:['إِنَّ','الْإِنسَانَ','لَفِي','خُسْرٍ'], nudge:'إنّ الإنسان… لفي خسر.'},
    {text:'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', words:['إِلَّا','الَّذِينَ','آمَنُوا','وَعَمِلُوا','الصَّالِحَاتِ','وَتَوَاصَوْا','بِالْحَقِّ','وَتَوَاصَوْا','بِالصَّبْرِ'], nudge:'آية طويلة… نأخذها كلمة كلمة يا ريم.'}
  ]}
];

const GIFTS = [
  {id:'surah-fatiha', stars:0, icon:'🌅', type:'سورة', title:'سورة الفاتحة بالتكرار', note:'هدية البداية: نسمع الفاتحة بهدوء ونردد.', url:'https://www.youtube.com/watch?v=Uufkkk6D2lk'},
  {id:'short-surahs', stars:2, icon:'🌸', type:'سور قصيرة', title:'عشر سور قصيرة للأطفال', note:'بعد نجمتين: باقة قصار السور للحفظ المرحلي.', url:'https://www.youtube.com/watch?v=7CLccP_tElk'},
  {id:'surah-ikhlas', stars:4, icon:'💜', type:'سورة', title:'سورة الإخلاص مع التكرار', note:'هدية سورة الإخلاص: نكررها كزهرة صغيرة.', url:'https://www.youtube.com/watch?v=-RPutM95Q4I'},
  {id:'ya-tayba', stars:6, icon:'🕌', type:'أنشودة', title:'يا طيبة', note:'استراحة روحية قصيرة بعد مجهود جميل.', url:'https://www.youtube.com/watch?v=uD8isx1ALA8'},
  {id:'qamar', stars:8, icon:'🌙', type:'أنشودة', title:'قمر سيدنا النبي', note:'هدية محبوبة لريم بعد 8 نجوم.', url:'https://www.youtube.com/watch?v=QZ9Y0Xar4sg'},
  {id:'short-surahs-playlist', stars:10, icon:'🎧', type:'قائمة', title:'تكرار قصار السور والآيات', note:'هدية المراجعة: قائمة للتكرار الهادئ.', url:'https://www.youtube.com/playlist?list=PLjo03GBjk2H0N3Y_B8MQgpIAgImBidNZq'},
  {id:'tayba-long', stars:12, icon:'🎁', type:'أنشودة', title:'يا طيبة ومجموعة أناشيد', note:'هدية طويلة ليوم الإنجاز الكبير.', url:'https://www.youtube.com/watch?v=Ao6paPBVBHg'},
  {id:'kids-surahs-playlist', stars:14, icon:'📿', type:'قائمة', title:'سور قصيرة للأطفال مع الترديد', note:'مكتبة مراجعة إضافية حين تصبح ريم جاهزة.', url:'https://www.youtube.com/playlist?list=PLs49icgnNB22d4IfrLab__oqgrkiBKePS'}
];

const messages = [
  'ريم، قلبك جميل… نحفظ آية واحدة فقط.',
  'لا استعجال يا ريم، النور يأتي خطوة خطوة.',
  'أبي فخور بك يا ريم… المحاولة وحدها نجمة.',
  'صوتك جميل حين ترددين بهدوء.',
  'اليوم آية، وغداً وردة أخرى في قلبك.',
  'أحسنت يا ريم… القرآن صديقك اللطيف.'
];
const rewards = ['أحسنت يا ريم، قلبك يضيء بالقرآن.', 'نجمة جديدة لبطلتي ريم.', 'قريب جداً يا ريم… نعيدها معاً ونفرح.', 'ما شاء الله، محاولة جميلة.', 'خطوة صغيرة… نور كبير.'];
const $ = (id)=>document.getElementById(id);
const audioPlayer = $('audioPlayer');
const voicePlayer = $('voicePlayer');
const state = {
  surahIndex: Number(localStorage.getItem('rim.surahIndex') || 0),
  ayahIndex: Number(localStorage.getItem('rim.ayahIndex') || 0),
  repeats: 0,
  totalStars: Number(localStorage.getItem('rim.totalStars') || 0),
  repeatGoal: Number(localStorage.getItem('rim.repeatGoal') || 3),
  completed: JSON.parse(localStorage.getItem('rim.completed') || '{}'),
  recorder: null,
  chunks: [],
  recordUrl: '',
  fatherLine: localStorage.getItem('rim.fatherLine') || 'أحسنت يا ريم، أبي فخور بك.',
  onlineAudio: localStorage.getItem('rim.onlineAudio') !== 'off',
  ayahRecorder: null,
  ayahChunks: [],
  encourageRecorder: null,
  encourageChunks: []
};

function persist(){
  localStorage.setItem('rim.surahIndex', state.surahIndex);
  localStorage.setItem('rim.ayahIndex', state.ayahIndex);
  localStorage.setItem('rim.totalStars', state.totalStars);
  localStorage.setItem('rim.repeatGoal', state.repeatGoal);
  localStorage.setItem('rim.completed', JSON.stringify(state.completed));
  localStorage.setItem('rim.fatherLine', state.fatherLine);
  localStorage.setItem('rim.onlineAudio', state.onlineAudio ? 'on' : 'off');
}
function currentSurah(){ return surahs[state.surahIndex] || surahs[0]; }
function currentAyah(){ const s=currentSurah(); return s.ayahs[Math.min(state.ayahIndex, s.ayahs.length-1)]; }
function pad(n){ return String(n).padStart(2,'0'); }
function pad3(n){ return String(n).padStart(3,'0'); }
function ayahVoiceKey(){ return `${currentSurah().id}#${state.ayahIndex}`; }

// ---------- تخزين محلي في المتصفح لصوت الأب (تلاوة + تشجيع) ----------
function openVoiceDB(){
  return new Promise((resolve, reject) => {
    if(!('indexedDB' in window)) { reject(new Error('no-indexeddb')); return; }
    const req = indexedDB.open('noorRimVoices', 2);
    req.onupgradeneeded = () => {
      const db = req.result;
      if(!db.objectStoreNames.contains('ayahVoice')) db.createObjectStore('ayahVoice');
      if(!db.objectStoreNames.contains('encourage')) db.createObjectStore('encourage', {autoIncrement:true});
      if(!db.objectStoreNames.contains('rimRecordings')) db.createObjectStore('rimRecordings', {keyPath:'id'});
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbPut(store, key, value){
  try{
    const db = await openVoiceDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);
      if(os.keyPath !== null) os.put(value); // متجر بمفتاح داخلي (rimRecordings): القيمة تحمل مفتاحها، put يسمح بالتحديث
      else if(key === undefined) os.add(value);
      else os.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }catch(e){ return false; }
}
async function idbGet(store, key){
  try{
    const db = await openVoiceDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });
  }catch(e){ return undefined; }
}
async function idbDelete(store, key){
  try{
    const db = await openVoiceDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }catch(e){ return false; }
}
async function idbGetAll(store){
  try{
    const db = await openVoiceDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }catch(e){ return []; }
}
async function idbClear(store){
  try{
    const db = await openVoiceDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }catch(e){ return false; }
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.target===id));
  if(id==='journeyScreen') renderJourney();
  if(id==='gardenScreen') renderGarden();
  if(id==='giftsScreen') renderGifts();
  window.scrollTo({top:0, behavior:'smooth'});
}
function renderFlowers(){
  $('surahFlowers').innerHTML = surahs.map((s,i)=>`
    <button class="flower" style="--flower:${s.color}" data-i="${i}" type="button">
      ${state.completed[s.id] ? '<span class="done">ختمت ✓</span>' : ''}
      <div class="petal">${s.icon}</div>
      <strong>سورة ${s.name}</strong>
      <span>${s.label}</span>
    </button>`).join('');
  document.querySelectorAll('.flower').forEach(btn=>btn.addEventListener('click',()=>{
    state.surahIndex = Number(btn.dataset.i); state.ayahIndex=0; state.repeats=0; persist(); showScreen('journeyScreen');
  }));
}
function renderJourney(){
  const s=currentSurah(), a=currentAyah();
  $('journeyMode').textContent = state.completed[s.id] ? 'مراجعة سورة محفوظة 🔁' : 'رحلة الحفظ';
  $('surahName').textContent = `سورة ${s.name}`;
  $('totalStars').textContent = state.totalStars;
  $('ayahCount').textContent = `آية ${state.ayahIndex+1} / ${s.ayahs.length}`;
  $('repeatBadge').textContent = `تكرار ${state.repeats} / ${state.repeatGoal}`;
  $('ayahText').textContent = a.text;
  $('nudgeText').textContent = a.nudge || 'اسمعي أولاً يا ريم.';
  $('wordCloud').innerHTML = a.words.map(w=>`<span class="word" tabindex="0" role="button">${w}</span>`).join('');
  document.querySelectorAll('.word').forEach(chip => chip.addEventListener('click', () => playAyah(true)));
  $('pathLine').innerHTML = s.ayahs.map((_,i)=>`<span class="step ${i<state.ayahIndex?'done':''} ${i===state.ayahIndex?'active':''}">${i+1}</span>`).join('');
  $('rewardBanner').hidden = true;
}
function renderGarden(){
  $('bigStars').textContent = `${state.totalStars} ⭐`;
  const badges = surahs.map(s=>`
    <div class="badge-card">${state.completed[s.id]?'🏅':'🌱'} سورة ${s.name}<small>${state.completed[s.id]?'أتمتها ريم':'في انتظار وردة جديدة'}</small>
      ${state.completed[s.id] ? `<button class="cert-btn" data-cert="${s.id}" type="button">🖼️ شهادة ريم</button>` : ''}
    </div>`).join('');
  $('badges').innerHTML = badges;
  document.querySelectorAll('.cert-btn').forEach(btn => btn.addEventListener('click', () => {
    const s = surahs.find(x => x.id === btn.dataset.cert);
    if(s) openCertificate(s);
  }));
}

// ---------- صندوق هدايا ريم: أناشيد وسور على يوتيوب، تُفتح تدريجياً بالنجوم، تحت إشراف الأب ----------
function giftUnlocked(gift){ return state.totalStars >= gift.stars; }
function findGift(id){ return GIFTS.find(g=>g.id===id) || GIFTS[0]; }
function toast(msg){
  const t = $('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>t.classList.remove('show'), 2800);
}
function openGift(gift){
  if(!giftUnlocked(gift)){ toast(`هذه الهدية تفتح عند ${gift.stars} نجوم يا ريم`); return; }
  window.open(gift.url, '_blank', 'noopener,noreferrer');
  toast('فتحت هدية ريم في نافذة جديدة 🎁');
}
function renderGifts(){
  const next = GIFTS.find(g=>!giftUnlocked(g));
  $('giftStarsText').textContent = `${state.totalStars} نجمة`;
  $('giftUnlockText').textContent = next ? `الهدية القادمة: ${next.title} عند ${next.stars} نجوم.` : 'كل الهدايا مفتوحة يا ريم. نراجع ونفرح.';
  $('giftGrid').innerHTML = GIFTS.map(g=>`
    <article class="gift-card ${giftUnlocked(g)?'':'locked'}">
      <div class="gift-icon">${giftUnlocked(g)?g.icon:'🔒'}</div>
      <div>
        <span class="gift-type">${g.type} • ${g.stars} نجوم</span>
        <h3>${g.title}</h3>
        <p>${g.note}</p>
        <button class="${giftUnlocked(g)?'primary':'secondary'}" data-gift="${g.id}" type="button">${giftUnlocked(g)?'افتحي الهدية':'مقفلة الآن'}</button>
      </div>
    </article>`).join('');
  document.querySelectorAll('#giftGrid button[data-gift]').forEach(btn=>btn.addEventListener('click',()=>openGift(findGift(btn.dataset.gift))));
}
function checkNewGift(){
  const gift = GIFTS.find(g=>g.stars===state.totalStars);
  if(gift) setTimeout(()=>toast(`🎁 فتحتِ هدية جديدة: ${gift.title}`), 900);
}
function visualWordPlayback(durationMs){
  const words = [...document.querySelectorAll('.word')];
  words.forEach(w=>w.classList.remove('active'));
  if(!words.length) return;
  const step = Math.max(450, durationMs / words.length);
  words.forEach((w,i)=>setTimeout(()=>{ words.forEach(x=>x.classList.remove('active')); w.classList.add('active'); }, i*step));
  setTimeout(()=>words.forEach(x=>x.classList.remove('active')), words.length*step+400);
}
function audioSrc(){
  const s=currentSurah();
  return `assets/audio/${s.audio}-${pad(state.ayahIndex+1)}.mp3`;
}
function onlineAudioSrc(){
  const s=currentSurah();
  const code = s.audio.split('-')[0];
  return `https://everyayah.com/data/Alafasy_128kbps/${code}${pad3(state.ayahIndex+1)}.mp3`;
}

// ترتيب محاولة تشغيل التلاوة: تسجيل الأب الشخصي لهذه الآية، ثم ملف محلي، ثم تلاوة حقيقية عبر الإنترنت (بدون أي نطق آلي).
async function playAyah(slow=false){
  const rate = slow ? .82 : 1;
  audioPlayer.onerror = null;

  const fatherClip = await idbGet('ayahVoice', ayahVoiceKey());
  if(fatherClip){
    audioPlayer.src = URL.createObjectURL(fatherClip);
    audioPlayer.playbackRate = rate;
    audioPlayer.onloadedmetadata = () => visualWordPlayback(isFinite(audioPlayer.duration) && audioPlayer.duration>0 ? audioPlayer.duration*1000 : 3200);
    visualWordPlayback(3200);
    audioPlayer.play().catch(()=>{});
    return;
  }

  const useOnline = () => {
    if(!state.onlineAudio){
      $('nudgeText').textContent = 'لا يوجد تسجيل بعد لهذه الآية. سجّلي مع أبي، أو فعّلي التلاوة عبر الإنترنت من وضع الأب.';
      return;
    }
    audioPlayer.onerror = () => { $('nudgeText').textContent = 'تعذّر تشغيل الصوت الآن. تحقّقي من الاتصال بالإنترنت.'; };
    audioPlayer.src = onlineAudioSrc();
    audioPlayer.playbackRate = rate;
    audioPlayer.play().catch(()=>{});
  };

  audioPlayer.onerror = useOnline;
  audioPlayer.src = audioSrc();
  audioPlayer.playbackRate = rate;
  audioPlayer.play().catch(useOnline);
  audioPlayer.onloadedmetadata = () => visualWordPlayback(isFinite(audioPlayer.duration) && audioPlayer.duration>0 ? audioPlayer.duration*1000 : 3200);
  visualWordPlayback(3200);
}

// قراءة رسائل التشجيع (وليس آيات القرآن) بصوت المتصفح، لمساعدة ريم على الفهم رغم صعوبة القراءة.
function speak(text){
  if(!text || !('speechSynthesis' in window)) return;
  try{
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const arabicVoice = window.speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith('ar'));
    if(arabicVoice) utter.voice = arabicVoice;
    utter.lang = arabicVoice ? arabicVoice.lang : 'ar';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }catch(e){ /* القراءة الصوتية للواجهة اختيارية */ }
}

function triggerConfetti(){
  const layer = $('confettiLayer');
  if(!layer) return;
  const colors = ['#1f8f72','#e3b84d','#f3adc4','#bfefff','#62c7a0'];
  for(let i=0;i<28;i++){
    const piece = document.createElement('i');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random()*100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = `${1.6 + Math.random()*1.2}s`;
    piece.style.animationDelay = `${Math.random()*0.3}s`;
    layer.appendChild(piece);
    setTimeout(()=>piece.remove(), 3200);
  }
}
function playChime(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99].forEach((freq,i)=>{
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i*0.14);
      gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + i*0.14 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i*0.14 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i*0.14);
      osc.stop(ctx.currentTime + i*0.14 + 0.55);
    });
  }catch(e){ /* النغمة التشجيعية اختيارية */ }
}
function vibrateCelebrate(){
  try{ if(navigator.vibrate) navigator.vibrate([90,50,90,50,140]); }catch(e){}
}
async function playRandomEncouragement(){
  const clips = await idbGetAll('encourage');
  if(!clips.length) return;
  const blob = clips[Math.floor(Math.random()*clips.length)];
  voicePlayer.src = URL.createObjectURL(blob);
  voicePlayer.play().catch(()=>{});
}

function giveStar(text){
  state.totalStars += 1;
  state.repeats = 0;
  persist();
  $('totalStars').textContent = state.totalStars;
  $('rewardTitle').textContent = 'أحسنت يا ريم';
  $('rewardText').textContent = text || rewards[Math.floor(Math.random()*rewards.length)];
  $('rewardBanner').hidden = false;
  triggerConfetti();
  playChime();
  vibrateCelebrate();
  playRandomEncouragement();
  checkNewGift();
}
function rimTurn(){
  state.repeats += 1;
  if(state.repeats >= state.repeatGoal) giveStar(state.fatherLine);
  else $('nudgeText').textContent = `دور ريم الآن… محاولة ${state.repeats} من ${state.repeatGoal}.`;
  persist(); renderJourney();
  if(state.repeats===0) $('rewardBanner').hidden = false;
}
function nextAyah(){
  const s=currentSurah();
  if(state.ayahIndex < s.ayahs.length-1){ state.ayahIndex++; state.repeats=0; persist(); renderJourney(); }
  else {
    const firstTime = !state.completed[s.id];
    state.completed[s.id]=true; giveStar(`أتممتِ سورة ${s.name} يا ريم… هدية جميلة لقلبك.`); persist(); renderFlowers(); renderGarden();
    if(firstTime) setTimeout(()=>openCertificate(s), 1400);
  }
}
const RECORD_BTN_IDLE_LABEL = '🎙️ سجلي صوتك يا ريم';
const RECORD_BTN_ACTIVE_LABEL = '⏹️ أوقفي التسجيل';

function setRecordStatus(msg){
  const el = $('recordStatus');
  el.textContent = msg;
  el.hidden = false;
}
function pickSupportedMimeType(){
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  if(typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
  for(const type of candidates){
    if(MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}
function showRimRecordingPlayer(url){
  const player = $('rimRecordPlayer');
  player.src = url;
  player.hidden = false;
  $('playRecordBtn').disabled = false;
}

async function toggleRecord(){
  const btn = $('recordBtn');

  if(state.recorder && state.recorder.state === 'recording'){
    state.recorder.stop();
    return;
  }

  if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || typeof MediaRecorder === 'undefined'){
    console.log('recording not supported on this browser');
    setRecordStatus('هذا الهاتف لا يسمح بالتسجيل من المتصفح. جرّب Chrome أو فعّل إذن الميكروفون.');
    return;
  }

  let stream;
  try{
    stream = await navigator.mediaDevices.getUserMedia({audio:true});
  }catch(e){
    console.log('recording permission denied', e);
    setRecordStatus('يجب السماح للميكروفون حتى نسجل صوت ريم.');
    return;
  }

  try{
    const mimeType = pickSupportedMimeType();
    state.chunks = [];
    state.recordMime = mimeType || 'audio/webm';
    state.recorder = mimeType ? new MediaRecorder(stream, {mimeType}) : new MediaRecorder(stream);

    state.recorder.ondataavailable = e => { if(e.data && e.data.size > 0) state.chunks.push(e.data); };

    state.recorder.onerror = (e) => {
      console.log('recording error', e.error || e);
      setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
      stream.getTracks().forEach(t=>t.stop());
      btn.textContent = RECORD_BTN_IDLE_LABEL;
      btn.classList.remove('recording');
    };

    state.recorder.onstop = async () => {
      console.log('recording stopped');
      stream.getTracks().forEach(t=>t.stop());
      btn.textContent = RECORD_BTN_IDLE_LABEL;
      btn.classList.remove('recording');

      const usedMime = state.recorder.mimeType || state.recordMime || 'audio/webm';
      const blob = new Blob(state.chunks, {type: usedMime});
      console.log('blob size', blob.size);

      if(!blob.size){
        setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
        return;
      }

      if(state.recordUrl) URL.revokeObjectURL(state.recordUrl);
      state.recordUrl = URL.createObjectURL(blob);
      showRimRecordingPlayer(state.recordUrl);
      setRecordStatus('أحسنتِ يا ريم، هذا صوتك الجميل 🌸');

      const s = currentSurah(), a = currentAyah();
      const rec = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        surahId: s.id,
        surahName: s.name,
        ayahIndex: state.ayahIndex,
        ayahText: a.text,
        createdAt: Date.now(),
        audioBlob: blob,
        mimeType: usedMime,
        isBest: false
      };
      const saved = await idbPut('rimRecordings', undefined, rec);
      console.log('saved to IndexedDB', saved, rec.id);
      refreshRimRecordingsIfOpen();
    };

    state.recorder.start();
    console.log('recording started', {mimeType: state.recordMime});
    btn.textContent = RECORD_BTN_ACTIVE_LABEL;
    btn.classList.add('recording');
    setRecordStatus('ريم تسجل الآن 🎙️');
  }catch(e){
    console.log('recording error', e);
    setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
    stream.getTracks().forEach(t=>t.stop());
  }
}

// ---------- شاشة "تسجيلات ريم": استعراض/تشغيل/حذف/تمييز أفضل قراءة ----------
async function renderRimRecordings(){
  const recordings = await idbGetAll('rimRecordings');
  recordings.sort((a,b)=> b.createdAt - a.createdAt);
  console.log('loaded recordings count', recordings.length);

  $('recordingsEmpty').hidden = recordings.length > 0;
  $('recordingsList').innerHTML = recordings.map(r => `
    <div class="recording-item" data-id="${r.id}">
      <div class="rec-info">
        سورة ${r.surahName} • آية ${r.ayahIndex + 1}
        <small>${new Date(r.createdAt).toLocaleDateString('ar', {year:'numeric', month:'long', day:'numeric'})}</small>
      </div>
      <div class="rec-actions">
        <button class="play-rec" data-id="${r.id}" type="button">▶ تشغيل</button>
        <button class="best ${r.isBest ? 'active' : ''}" data-id="${r.id}" type="button">${r.isBest ? '⭐ الأفضل' : '☆ أفضل قراءة'}</button>
        <button class="danger del-rec" data-id="${r.id}" type="button">🗑️ حذف</button>
      </div>
    </div>`).join('');

  document.querySelectorAll('#recordingsList .play-rec').forEach(btn => btn.addEventListener('click', async () => {
    const rec = await idbGet('rimRecordings', btn.dataset.id);
    if(!rec) return;
    const player = $('recordingsPlayer');
    if(player.dataset.blobUrl) URL.revokeObjectURL(player.dataset.blobUrl);
    const url = URL.createObjectURL(rec.audioBlob);
    player.dataset.blobUrl = url;
    player.src = url;
    player.hidden = false;
    player.play().catch(()=>{});
  }));
  document.querySelectorAll('#recordingsList .best').forEach(btn => btn.addEventListener('click', async () => {
    const rec = await idbGet('rimRecordings', btn.dataset.id);
    if(!rec) return;
    rec.isBest = !rec.isBest;
    await idbPut('rimRecordings', undefined, rec);
    renderRimRecordings();
  }));
  document.querySelectorAll('#recordingsList .del-rec').forEach(btn => btn.addEventListener('click', async () => {
    if(!confirm('هل تريد فعلاً حذف هذا التسجيل؟')) return;
    await idbDelete('rimRecordings', btn.dataset.id);
    console.log('recording deleted', btn.dataset.id);
    renderRimRecordings();
  }));
}
function refreshRimRecordingsIfOpen(){
  if($('recordingsDialog').open) renderRimRecordings();
}

// ---------- استوديو صوت الأب: تلاوة شخصية للآية + عبارات تشجيع ----------
async function refreshVoiceStudio(){
  const clip = await idbGet('ayahVoice', ayahVoiceKey());
  $('ayahVoiceStatus').textContent = clip ? 'تم تسجيل تلاوتك لهذه الآية ✓' : 'لا يوجد تسجيل بعد لهذه الآية';
  $('playAyahVoiceBtn').disabled = !clip;
  $('clearAyahVoiceBtn').disabled = !clip;
  const clips = await idbGetAll('encourage');
  $('encourageCountLabel').textContent = `${clips.length} عبارة مسجلة`;
}
async function toggleAyahRecord(){
  const btn = $('recordAyahBtn');
  if(state.ayahRecorder && state.ayahRecorder.state==='recording'){
    state.ayahRecorder.stop(); btn.textContent='● سجّل تلاوتي لهذه الآية'; btn.classList.remove('recording'); return;
  }
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    state.ayahChunks = [];
    state.ayahRecorder = new MediaRecorder(stream);
    state.ayahRecorder.ondataavailable = e => state.ayahChunks.push(e.data);
    state.ayahRecorder.onstop = async () => {
      stream.getTracks().forEach(t=>t.stop());
      const blob = new Blob(state.ayahChunks, {type:'audio/webm'});
      await idbPut('ayahVoice', ayahVoiceKey(), blob);
      refreshVoiceStudio();
    };
    state.ayahRecorder.start(); btn.textContent='إيقاف التسجيل'; btn.classList.add('recording');
  }catch(e){ $('ayahVoiceStatus').textContent = 'يحتاج إذن الميكروفون من المتصفح.'; }
}
async function playAyahVoice(){
  const clip = await idbGet('ayahVoice', ayahVoiceKey());
  if(clip){ voicePlayer.src = URL.createObjectURL(clip); voicePlayer.play().catch(()=>{}); }
}
async function clearAyahVoice(){
  await idbDelete('ayahVoice', ayahVoiceKey());
  refreshVoiceStudio();
}
async function toggleEncourageRecord(){
  const btn = $('recordEncourageBtn');
  if(state.encourageRecorder && state.encourageRecorder.state==='recording'){
    state.encourageRecorder.stop(); btn.textContent='● سجّل عبارة تشجيع جديدة'; btn.classList.remove('recording'); return;
  }
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    state.encourageChunks = [];
    state.encourageRecorder = new MediaRecorder(stream);
    state.encourageRecorder.ondataavailable = e => state.encourageChunks.push(e.data);
    state.encourageRecorder.onstop = async () => {
      stream.getTracks().forEach(t=>t.stop());
      const blob = new Blob(state.encourageChunks, {type:'audio/webm'});
      await idbPut('encourage', undefined, blob);
      refreshVoiceStudio();
    };
    state.encourageRecorder.start(); btn.textContent='إيقاف التسجيل'; btn.classList.add('recording');
  }catch(e){ $('encourageCountLabel').textContent = 'يحتاج إذن الميكروفون من المتصفح.'; }
}
async function clearEncouragements(){
  if(!confirm('هل تريد فعلاً مسح كل عبارات التشجيع المسجلة؟')) return;
  await idbClear('encourage');
  refreshVoiceStudio();
}

// ---------- شهادة إنجاز قابلة للحفظ والمشاركة، تُرسم عند إتمام كل سورة ----------
function loadImage(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
async function drawCertificate(surahObj){
  const canvas = $('certificateCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#fff7ed'); grad.addColorStop(1, '#effdf5');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#e3b84d'; ctx.lineWidth = 14; ctx.strokeRect(28, 28, W-56, H-56);
  ctx.strokeStyle = '#1f8f72'; ctx.lineWidth = 4; ctx.strokeRect(48, 48, W-96, H-96);

  try{
    const img = await loadImage('assets/rim/rim-reward.jpg');
    ctx.save();
    ctx.beginPath();
    ctx.arc(W/2, 330, 190, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    const scale = Math.max(380/img.width, 380/img.height);
    const iw = img.width*scale, ih = img.height*scale;
    ctx.drawImage(img, W/2-iw/2, 330-ih/2, iw, ih);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(W/2, 330, 190, 0, Math.PI*2);
    ctx.lineWidth = 10; ctx.strokeStyle = '#fff'; ctx.stroke();
  }catch(e){ /* لا بأس إن لم تتوفر الصورة بعد */ }

  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1f8f72';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText('🌙 شهادة إنجاز 🌙', W/2, 610);
  ctx.fillStyle = '#0f2a22';
  ctx.font = 'bold 76px sans-serif';
  ctx.fillText('ريم', W/2, 715);
  ctx.font = '38px sans-serif';
  ctx.fillStyle = '#276751';
  ctx.fillText(`أتمّت بفضل الله حفظ سورة ${surahObj.name}`, W/2, 800);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#6d7c75';
  const dateStr = new Date().toLocaleDateString('ar', {year:'numeric', month:'long', day:'numeric'});
  ctx.fillText(dateStr, W/2, 855);
  ctx.font = '58px sans-serif';
  ctx.fillText('⭐ ⭐ ⭐', W/2, 960);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#9a6e12';
  ctx.fillText(`مجموع نجوم ريم: ${state.totalStars}`, W/2, 1015);
  ctx.font = '26px sans-serif';
  ctx.fillStyle = '#6d7c75';
  ctx.fillText('هدية بابا أحمد لريم — بحب لا ينتهي 💛', W/2, H-90);
}
async function openCertificate(surahObj){
  await drawCertificate(surahObj);
  $('certificateDialog').showModal();
}
function downloadCertificate(){
  const canvas = $('certificateCanvas');
  canvas.toBlob(blob => {
    if(!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `شهادة-ريم-${Date.now()}.png`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 4000);
  }, 'image/png');
}

function init(){
  renderFlowers(); renderJourney(); renderGarden();
  $('dailyMessage').textContent = messages[new Date().getDate()%messages.length];
  $('newMessageBtn').onclick=()=> $('dailyMessage').textContent = messages[Math.floor(Math.random()*messages.length)];
  $('startJourneyBtn').onclick=()=> showScreen('journeyScreen');
  $('quickListenBtn').onclick=()=> { showScreen('journeyScreen'); setTimeout(()=>playAyah(false),300); };
  $('homeBtn').onclick=()=> showScreen('homeScreen');
  $('backBtn').onclick=()=> showScreen('homeScreen');
  $('playAyahBtn').onclick=()=>playAyah(false);
  $('playSlowBtn').onclick=()=>playAyah(true);
  $('rimTurnBtn').onclick=rimTurn;
  $('nextBtn').onclick=nextAyah;
  $('recordBtn').onclick=toggleRecord;
  $('playRecordBtn').onclick=()=>{ if(state.recordUrl) new Audio(state.recordUrl).play(); };
  $('openRimRecordingsBtn').onclick=()=>{ renderRimRecordings(); $('recordingsDialog').showModal(); };
  $('closeRecordingsBtn').onclick=()=> $('recordingsDialog').close();
  $('speakNudgeBtn').onclick=()=> speak($('nudgeText').textContent);
  $('speakRewardBtn').onclick=()=> speak($('rewardText').textContent);
  document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>showScreen(b.dataset.target));
  $('parentBtn').onclick=()=>{
    $('repeatSelect').value=state.repeatGoal;
    $('fatherLine').value=state.fatherLine;
    $('onlineAudio').checked = state.onlineAudio;
    refreshVoiceStudio();
    $('parentDialog').showModal();
  };
  $('saveParent').onclick=()=>{
    state.repeatGoal=Number($('repeatSelect').value);
    state.fatherLine=$('fatherLine').value.trim() || state.fatherLine;
    state.onlineAudio=$('onlineAudio').checked;
    persist(); renderJourney(); $('parentDialog').close();
  };
  $('resetProgress').onclick=()=>{ if(confirm('هل تريد فعلاً إعادة النجوم والتقدم؟')){ state.totalStars=0; state.completed={}; state.ayahIndex=0; state.repeats=0; persist(); renderFlowers(); renderJourney(); renderGarden(); }};
  $('recordAyahBtn').onclick=toggleAyahRecord;
  $('playAyahVoiceBtn').onclick=playAyahVoice;
  $('clearAyahVoiceBtn').onclick=clearAyahVoice;
  $('recordEncourageBtn').onclick=toggleEncourageRecord;
  $('clearEncourageBtn').onclick=clearEncouragements;
  $('closeCertificateBtn').onclick=()=> $('certificateDialog').close();
  $('downloadCertificateBtn').onclick=downloadCertificate;
  if('serviceWorker' in navigator){
    // نضمن أن أي تحديث جديد للتطبيق (بعد إصلاح أو تطوير) يصل فعلياً لهاتف ريم بدل البقاء عالقاً في نسخة مخزَّنة قديمة.
    let reloadedOnce = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if(reloadedOnce) return;
      reloadedOnce = true;
      window.location.reload();
    });
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.update().catch(()=>{});
    }).catch(()=>{});
  }
}
init();
