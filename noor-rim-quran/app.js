// ---------- بيانات السور: كل سورة تتكون من آيات (verses)، وكل آية قد تُقسَّم تعليمياً إلى مقاطع (segments) ----------
// المقطع أداة تدريب مؤقتة فقط: لا يُحتسب أبداً كآية مستقلة، ولا يُغيّر ترقيم الآيات أو تقدّم السورة.
const RAW_SURAHS = [
  {surahId:'ikhlas', surahName:'الإخلاص', symbol:'halo', label:'قصيرة ومحبوبة', audioCode:'112-ikhlas', verseTexts:[
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'اللَّهُ الصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ'
  ]},
  {surahId:'kawthar', surahName:'الكوثر', symbol:'droplet', label:'ثلاث آيات فقط', audioCode:'108-kawthar', verseTexts:[
    'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
    'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ'
  ]},
  {surahId:'nas', surahName:'الناس', symbol:'embrace', label:'سكينة وطمأنينة', audioCode:'114-nas', verseTexts:[
    'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    'مَلِكِ النَّاسِ',
    'إِلَٰهِ النَّاسِ',
    'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
    'مِنَ الْجِنَّةِ وَالنَّاسِ'
  ]},
  {surahId:'falaq', surahName:'الفلق', symbol:'sunrise', label:'نور وحماية', audioCode:'113-falaq', verseTexts:[
    'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    'مِنْ شَرِّ مَا خَلَقَ',
    'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
    'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ'
  ]},
  {surahId:'fatiha', surahName:'الفاتحة', symbol:'opening', label:'نأخذها ببطء', audioCode:'001-fatiha', verseTexts:[
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'الرَّحْمَٰنِ الرَّحِيمِ',
    'مَالِكِ يَوْمِ الدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'
  ]},
  {surahId:'asr', surahName:'العصر', symbol:'calmsun', label:'سورة صغيرة عن قيمة الوقت', audioCode:'103-asr', verseTexts:[
    'وَالْعَصْرِ',
    'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
    'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ'
  ]}
];

function pad(n){ return String(n).padStart(2,'0'); }
function pad3(n){ return String(n).padStart(3,'0'); }

// آية من كلمتين أو أقل تُقال دفعة واحدة بلا تقسيم؛ الآيات الأطول تُقسَّم إلى مقاطع من كلمتين لتسهيل الترديد.
function autoSegments(fullText){
  const words = fullText.split(/\s+/).filter(Boolean);
  if(words.length <= 2) return [];
  const groups = [];
  for(let i=0;i<words.length;i+=2) groups.push(words.slice(i,i+2).join(' '));
  return groups;
}
function buildSurahs(raw){
  return raw.map(s => {
    const verses = s.verseTexts.map((fullText, i) => {
      const verseNumber = i+1;
      const verseId = `${s.surahId}-v${verseNumber}`;
      const segmentTexts = autoSegments(fullText);
      const segments = segmentTexts.map((segmentText, si) => ({
        segmentId: `${verseId}-s${si+1}`,
        segmentOrder: si+1,
        segmentText
      }));
      return {
        verseId, surahId: s.surahId, verseNumber, fullText,
        audio: `${s.audioCode}-${pad(verseNumber)}`,
        segments
      };
    });
    return {surahId:s.surahId, surahName:s.surahName, symbol:s.symbol, label:s.label, audioCode:s.audioCode, verses};
  });
}
const surahs = buildSurahs(RAW_SURAHS);

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

const FATHER_SIGNATURE = 'أنا فخور بك يا ريم — بابا';
const messages = [
  'ريم، قلبك جميل… نحفظ آية واحدة فقط.',
  'لا استعجال يا ريم، النور يأتي خطوة خطوة.',
  'أبي فخور بك يا ريم… المحاولة وحدها نجمة.',
  'صوتك جميل حين ترددين بهدوء.',
  'اليوم آية، وغداً وردة أخرى في قلبك.',
  'أحسنت يا ريم… القرآن صديقك اللطيف.'
];
const rewards = ['أحسنت يا ريم، قلبك يضيء بالقرآن.', 'نجمة جديدة لبطلتي ريم.', 'قريب جداً يا ريم… نعيدها معاً ونفرح.', 'ما شاء الله، محاولة جميلة.', 'خطوة صغيرة… نور كبير.'];
const albumEncouragements = ['صوتك جميل يا ريم 🌸', 'كل محاولة منك كنز.', 'نور صوتك يفرحنا.', 'ما شاء الله عليك يا بطلة.'];

const $ = (id)=>document.getElementById(id);
const audioPlayer = $('audioPlayer');
const voicePlayer = $('voicePlayer');

const state = {
  surahIndex: Number(localStorage.getItem('rim.surahIndex') || 0),
  verseIndex: Number(localStorage.getItem('rim.ayahIndex') || 0),
  repeats: 0,
  totalStars: Number(localStorage.getItem('rim.totalStars') || 0),
  repeatGoal: Math.min(5, Math.max(1, Number(localStorage.getItem('rim.repeatGoal') || 3))),
  repeatGapSec: Math.min(8, Math.max(3, Number(localStorage.getItem('rim.repeatGapSec') || 4))),
  autoRepeatEnabled: localStorage.getItem('rim.autoRepeat') !== 'off',
  completed: JSON.parse(localStorage.getItem('rim.completed') || '{}'), // سورة "مكتملة" = سُجّلت السورة كاملة، وليس فقط بلوغ آخر آية
  progress: JSON.parse(localStorage.getItem('rim.progress') || '{}'),
  surahState: JSON.parse(localStorage.getItem('rim.surahState') || '{}'), // {introHeard, versesComplete} لكل سورة
  segmentDone: JSON.parse(localStorage.getItem('rim.segmentDone') || '{}'), // verseId -> true بعد أول تدريب مقاطع
  recorder: null,
  chunks: [],
  recordUrl: '',
  fatherLine: localStorage.getItem('rim.fatherLine') || 'أحسنت يا ريم، أبي فخور بك.',
  onlineAudio: localStorage.getItem('rim.onlineAudio') !== 'off',
  ayahRecorder: null,
  ayahChunks: [],
  encourageRecorder: null,
  encourageChunks: [],
  segRecorder: null,
  segChunks: [],
  segRecordUrl: '',
  surahRecorder: null,
  surahChunks: [],
  surahRecordUrl: '',
  segmentIndex: 0,
  inSegmentMode: false,
  learningStage: 'listen',
  stageToken: 0
};

function persist(){
  localStorage.setItem('rim.surahIndex', state.surahIndex);
  localStorage.setItem('rim.ayahIndex', state.verseIndex);
  localStorage.setItem('rim.totalStars', state.totalStars);
  localStorage.setItem('rim.repeatGoal', state.repeatGoal);
  localStorage.setItem('rim.repeatGapSec', state.repeatGapSec);
  localStorage.setItem('rim.autoRepeat', state.autoRepeatEnabled ? 'on' : 'off');
  localStorage.setItem('rim.completed', JSON.stringify(state.completed));
  localStorage.setItem('rim.progress', JSON.stringify(state.progress));
  localStorage.setItem('rim.surahState', JSON.stringify(state.surahState));
  localStorage.setItem('rim.segmentDone', JSON.stringify(state.segmentDone));
  localStorage.setItem('rim.fatherLine', state.fatherLine);
  localStorage.setItem('rim.onlineAudio', state.onlineAudio ? 'on' : 'off');
}
function currentSurah(){ return surahs[state.surahIndex] || surahs[0]; }
function currentVerse(){ const s=currentSurah(); return s.verses[Math.min(state.verseIndex, s.verses.length-1)]; }
function currentSegment(){ const v=currentVerse(); return v.segments[Math.min(state.segmentIndex, v.segments.length-1)]; }
function verseVoiceKey(idx = state.verseIndex){ return `${currentSurah().surahId}#${idx}`; }
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
function formatArabicDate(ts){ return new Date(ts).toLocaleDateString('ar', {year:'numeric', month:'long', day:'numeric'}); }

// ---------- تخزين محلي في المتصفح لصوت الأب (تلاوة + تشجيع) ولتسجيلات ريم — لا تُغيَّر هذه الطبقة ----------
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

// تهجير غير مدمّر: التسجيلات القديمة (قبل هذا التحديث) لم تحمل حقل type، فنُصنّفها "آية" مع وسم legacy، دون حذف أي شيء.
async function migrateLegacyRecordings(){
  if(localStorage.getItem('rim.recordingsMigrated') === 'yes') return;
  const all = await idbGetAll('rimRecordings');
  for(const rec of all){
    if(!rec.type){
      rec.type = 'verse';
      rec.legacy = true;
      await idbPut('rimRecordings', undefined, rec);
    }
  }
  localStorage.setItem('rim.recordingsMigrated', 'yes');
}

// ---------- تنقل الشاشات ----------
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.target===id));
  if(id==='surahPickerScreen') renderSurahCards();
  if(id==='journeyScreen') renderAyahScreen();
  if(id==='gardenScreen') renderGarden();
  if(id==='giftsScreen') renderGifts();
  window.scrollTo({top:0, behavior:'smooth'});
}
function openSurah(i){
  state.surahIndex = i;
  state.verseIndex = Math.min(state.progress[surahs[i].surahId] || 0, surahs[i].verses.length - 1);
  state.repeats = 0;
  state.segmentIndex = 0;
  state.inSegmentMode = false;
  persist();
  showScreen('journeyScreen');
}
function renderSurahCards(){
  $('surahCardsGrid').innerHTML = surahs.map((s,i)=>{
    const done = !!state.completed[s.surahId];
    const prog = Math.min(state.progress[s.surahId] || 0, s.verses.length-1);
    const pct = done ? 100 : Math.round((prog / s.verses.length) * 100);
    return `
    <button class="surah-card" data-i="${i}" type="button">
      <div class="surah-symbol ${s.symbol}" aria-hidden="true"></div>
      <strong>سورة ${s.surahName}</strong>
      <span>${s.verses.length} آيات</span>
      <div class="surah-progress"><i style="width:${pct}%"></i></div>
      ${done ? '<em class="done-tag">✓ ختمت</em>' : ''}
    </button>`;
  }).join('');
  document.querySelectorAll('.surah-card').forEach(btn=>btn.addEventListener('click',()=> openSurah(Number(btn.dataset.i))));
}

// ---------- شاشة الآية: عنصر واحد رئيسي في كل مرحلة ----------
function renderAyahScreen(){
  const s=currentSurah(), v=currentVerse();
  $('journeyMode').textContent = state.completed[s.surahId] ? 'مراجعة سورة محفوظة' : 'رحلة الحفظ';
  $('surahName').textContent = `سورة ${s.surahName}`;
  $('totalStars').textContent = state.totalStars;
  $('ayahCount').textContent = `آية ${state.verseIndex+1} / ${s.verses.length}`;
  $('ayahText').textContent = v.fullText;
  $('ayahText').hidden = false;
  $('segmentText').hidden = true;
  updateSegmentLabel('');
  $('pathLine').innerHTML = s.verses.map((_,i)=>`<span class="step ${i<state.verseIndex?'done':''} ${i===state.verseIndex?'active':''}">${i+1}</span>`).join('');
  $('rewardBanner').hidden = true;
  $('recordJoyCard').hidden = true;
  $('rimRecordPlayer').hidden = true;
  $('recordStatus').hidden = true;
  state.segmentIndex = 0;
  state.inSegmentMode = false;

  const surahProgress = state.surahState[s.surahId] || {};
  if(state.verseIndex === 0 && !surahProgress.introHeard){
    setLearningStage('surah-intro');
  }else{
    setLearningStage('listen');
  }
}

function renderGarden(){
  $('bigStars').textContent = `${state.totalStars} ⭐`;
  const badges = surahs.map(s=>`
    <div class="badge-card">${state.completed[s.surahId]?'✓':'🌱'} سورة ${s.surahName}<small>${state.completed[s.surahId]?'أتمتها ريم':'في انتظار وردة جديدة'}</small>
      ${state.completed[s.surahId] ? `<button class="cert-btn" data-cert="${s.surahId}" type="button">🖼️ شهادة ريم</button>` : ''}
    </div>`).join('');
  $('badges').innerHTML = badges;
  document.querySelectorAll('.cert-btn').forEach(btn => btn.addEventListener('click', () => {
    const s = surahs.find(x => x.surahId === btn.dataset.cert);
    if(s) openCertificate(s);
  }));
}

// ---------- صندوق نور ريم: أناشيد وسور على يوتيوب، تُفتح تدريجياً بالنجوم، تحت إشراف الأب ----------
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
const GIFT_THUMB_POOL = ['assets/rim-v2/listening.webp', 'assets/rim-v2/prayer-room.webp', 'assets/rim-v2/first-ayah.webp', 'assets/rim-v2/first-voice.webp'];
function renderGifts(){
  const next = GIFTS.find(g=>!giftUnlocked(g));
  $('giftStarsText').textContent = `${state.totalStars} نجمة`;
  $('giftUnlockText').textContent = next ? `الهدية القادمة عند ${next.stars} نجوم.` : 'كل الهدايا مفتوحة يا ريم. نراجع ونفرح.';
  $('giftGrid').innerHTML = GIFTS.map((g,i)=>{
    const unlocked = giftUnlocked(g);
    const icon = unlocked
      ? `<img src="${GIFT_THUMB_POOL[i % GIFT_THUMB_POOL.length]}" alt="" loading="lazy" />`
      : '🔒';
    return `
    <article class="gift-card ${unlocked?'open':'locked'}">
      <div class="gift-icon">${icon}</div>
      <div>
        <span class="gift-type">${g.type} • ${g.stars} نجوم</span>
        <h3>${g.title}</h3>
        <p>${g.note}</p>
        <button class="${unlocked?'primary':'secondary'}" data-gift="${g.id}" type="button">${unlocked?'افتحي الهدية':'مقفلة الآن'}</button>
      </div>
    </article>`;
  }).join('');
  document.querySelectorAll('#giftGrid button[data-gift]').forEach(btn=>btn.addEventListener('click',()=>openGift(findGift(btn.dataset.gift))));
}
function checkNewGift(){
  const gift = GIFTS.find(g=>g.stars===state.totalStars);
  if(!gift) return;
  setTimeout(()=>{
    toast(`🎁 فتحتِ هدية جديدة: ${gift.title}`);
    const card = document.querySelector(`#giftGrid button[data-gift="${gift.id}"]`)?.closest('.gift-card');
    if(card) card.classList.add('just-unlocked');
  }, 900);
}

// ---------- حلّ مصدر تلاوة أي آية: تسجيل الأب، ثم ملف محلي، ثم تلاوة حقيقية عبر الإنترنت. بدون أي نطق آلي مطلقاً ----------
function audioSrc(idx = state.verseIndex){
  const s=currentSurah();
  return `assets/audio/${s.verses[idx].audio}.mp3`;
}
function onlineAudioSrc(idx = state.verseIndex){
  const s=currentSurah();
  const code = s.audioCode.split('-')[0];
  return `https://everyayah.com/data/Alafasy_128kbps/${code}${pad3(idx+1)}.mp3`;
}
async function resolvePlayableAudio(idx){
  const fatherClip = await idbGet('ayahVoice', verseVoiceKey(idx));
  if(fatherClip) return {src: URL.createObjectURL(fatherClip), isBlob:true};
  return {src: audioSrc(idx), fallback: state.onlineAudio ? onlineAudioSrc(idx) : null};
}
function playResolvedAwaitable(resolved, rate){
  return new Promise((resolve) => {
    audioPlayer.onerror = null;
    audioPlayer.onended = null;
    let settled = false;
    const finish = () => { if(!settled){ settled = true; resolve(); } };

    const tryFallback = () => {
      if(!resolved.fallback){ finish(); return; }
      audioPlayer.onerror = finish;
      audioPlayer.onended = finish;
      audioPlayer.src = resolved.fallback;
      audioPlayer.playbackRate = rate;
      audioPlayer.play().catch(finish);
    };

    audioPlayer.onended = finish;
    audioPlayer.onerror = resolved.isBlob ? finish : tryFallback;
    audioPlayer.src = resolved.src;
    audioPlayer.playbackRate = rate;
    audioPlayer.onloadedmetadata = () => visualWordPlayback(isFinite(audioPlayer.duration) && audioPlayer.duration>0 ? audioPlayer.duration*1000 : 3200);
    visualWordPlayback(3200);
    audioPlayer.play().catch(resolved.isBlob ? finish : tryFallback);
    // شبكة الأمان: لا يجب أن تعلق الدورة التلقائية أبداً بلا سبب
    setTimeout(finish, 12000);
  });
}
function visualWordPlayback(){ /* أُبقيت للتوافق مع الاستدعاءات القديمة؛ لا كلمات منفصلة بعد الآن */ }
async function playVerse(slow=false){
  const resolved = await resolvePlayableAudio(state.verseIndex);
  if(!resolved.fallback && !resolved.isBlob){
    if(!state.onlineAudio){
      $('nudgeText') && ($('nudgeText').textContent = 'لا يوجد تسجيل بعد لهذه الآية. سجّلي مع أبي، أو فعّلي التلاوة عبر الإنترنت من وضع الأب.');
    }
  }
  playResolvedAwaitable(resolved, slow ? .82 : 1);
}
async function playVerseAwaitable(idx, slow=false){
  const resolved = await resolvePlayableAudio(idx);
  await playResolvedAwaitable(resolved, slow ? .82 : 1);
}
async function playVerseRangeAwaitable(fromIdx, toIdx){
  for(let i=fromIdx;i<=toIdx;i++){
    await playVerseAwaitable(i, false);
    if(i < toIdx) await sleep(500);
  }
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

// ---------- احتفال هادئ: توهّج ناعم ونغمة واحدة لطيفة، بلا قصاصات ولا اهتزاز ولا ضجيج ----------
function celebrateSoftly(){
  const glow = $('softGlow');
  if(glow){
    glow.classList.remove('pulse');
    void glow.offsetWidth;
    glow.classList.add('pulse');
  }
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 659.25;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.13, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.75);
  }catch(e){ /* النغمة اختيارية */ }
}
async function playRandomEncouragement(){
  const clips = await idbGetAll('encourage');
  if(!clips.length) return;
  const blob = clips[Math.floor(Math.random()*clips.length)];
  voicePlayer.src = URL.createObjectURL(blob);
  voicePlayer.play().catch(()=>{});
}

function setRewardPhoto(src){
  const img = $('rewardPhoto');
  if(img) img.src = src;
}
function giveStar(text, photo){
  state.totalStars += 1;
  state.repeats = 0;
  persist();
  $('totalStars').textContent = state.totalStars;
  $('rewardTitle').textContent = 'أحسنت يا ريم';
  $('rewardText').textContent = text || rewards[Math.floor(Math.random()*rewards.length)];
  setRewardPhoto(photo || 'assets/rim-v2/reward.webp');
  $('rewardBanner').hidden = false;
  celebrateSoftly();
  playRandomEncouragement();
  checkNewGift();
}
// نجمة تُمنح فقط عند تسجيل الآية كاملة (وليس عند تدريب مقطع)
function giveStarForVerse(){
  const firstAyahEver = localStorage.getItem('rim.firstAyahRewardShown') !== 'yes';
  if(firstAyahEver){
    localStorage.setItem('rim.firstAyahRewardShown', 'yes');
    giveStar(`أول آية تحفظينها يا ريم! ${FATHER_SIGNATURE}`, 'assets/rim-v2/first-ayah.webp');
  }else{
    giveStar(state.fatherLine);
  }
}
// الانتقال بين الآيات: عند انتهاء آخر آية، تكون "آيات السورة" قد اكتملت تعليمياً، لكن السورة لا تُحتسب "مكتملة" إلا بعد تسجيلها كاملة
function nextAyah(){
  const s=currentSurah();
  state.progress[s.surahId] = state.verseIndex;
  if(state.verseIndex < s.verses.length-1){
    state.verseIndex++; state.repeats=0; state.segmentIndex=0; state.inSegmentMode=false;
    persist(); renderAyahScreen();
  }else{
    state.surahState[s.surahId] = state.surahState[s.surahId] || {};
    state.surahState[s.surahId].versesComplete = true;
    state.progress[s.surahId] = s.verses.length - 1;
    persist();
    toast(`أتممتِ آيات سورة ${s.surahName} يا ريم، الآن نسجل السورة كاملة 🌸`);
    setLearningStage('surah-record-offer');
  }
}

// ---------- منهج "المصحف المعلّم": سماع السورة أولاً، ثم استماع متكرر للآية، فتدريب مقاطعها، ثم تسجيلها، ثم ربطها بما سبق ----------
function updateSegmentLabel(text){
  const el = $('segmentLabel');
  if(!el) return;
  el.textContent = text;
  el.hidden = !text;
}
function showSegmentRecordBtn(){ const b=$('segmentRecordBtn'); if(b) b.hidden=false; }
function hideSegmentRecordBtn(){ const b=$('segmentRecordBtn'); if(b) b.hidden=true; }
function enterSegmentMode(){
  state.segmentIndex = 0;
  state.inSegmentMode = true;
  setLearningStage('segment');
}
function setLearningStage(stage){
  state.learningStage = stage;
  const btn = $('recordBtn');
  const help = $('helpToggleBtn');
  btn.disabled = false;
  btn.classList.remove('recording');
  hideSegmentRecordBtn();
  if(stage !== 'segment' && stage !== 'segment-next'){
    $('ayahText').hidden = false;
    $('segmentText').hidden = true;
    updateSegmentLabel('');
  }

  if(stage === 'surah-intro'){
    const s = currentSurah();
    btn.textContent = `🔊 نسمع سورة ${s.surahName} كاملة`;
    btn.onclick = async () => {
      btn.disabled = true;
      await playVerseRangeAwaitable(0, s.verses.length-1);
      btn.disabled = false;
      setLearningStage('surah-intro-done');
    };
  }else if(stage === 'surah-intro-done'){
    btn.textContent = '▶️ نبدأ الآية الأولى';
    btn.onclick = () => {
      const s = currentSurah();
      state.surahState[s.surahId] = state.surahState[s.surahId] || {};
      state.surahState[s.surahId].introHeard = true;
      persist();
      setLearningStage('listen');
    };
  }else if(stage === 'listen'){
    btn.textContent = '🔊 اسمعي يا ريم';
    btn.onclick = runListenCycle;
    if(help) help.hidden = false;
  }else if(stage === 'segment-offer'){
    btn.textContent = '🧩 نقسمها معاً';
    btn.onclick = enterSegmentMode;
  }else if(stage === 'segment'){
    const v = currentVerse(), seg = currentSegment();
    $('ayahText').hidden = true;
    $('segmentText').hidden = false;
    $('segmentText').textContent = seg.segmentText;
    updateSegmentLabel(`المقطع ${seg.segmentOrder} من ${v.segments.length}`);
    showSegmentRecordBtn();
    btn.textContent = '🔊 كرري هذا المقطع';
    btn.onclick = async () => {
      btn.disabled = true;
      await playVerseAwaitable(state.verseIndex, true);
      btn.disabled = false;
      setLearningStage('segment-next');
    };
  }else if(stage === 'segment-next'){
    const v = currentVerse();
    const isLast = state.segmentIndex >= v.segments.length - 1;
    const seg = currentSegment();
    $('ayahText').hidden = true;
    $('segmentText').hidden = false;
    $('segmentText').textContent = seg.segmentText;
    updateSegmentLabel(`المقطع ${seg.segmentOrder} من ${v.segments.length}`);
    showSegmentRecordBtn();
    btn.textContent = isLast ? '✅ نقول الآية كاملة' : '➡️ المقطع التالي';
    btn.onclick = () => {
      if(isLast){
        state.segmentDone[v.verseId] = true;
        state.inSegmentMode = false;
        persist();
        setLearningStage('verse-recap');
      }else{
        state.segmentIndex++;
        setLearningStage('segment');
      }
    };
  }else if(stage === 'verse-recap'){
    btn.textContent = '🔊 نقول الآية كاملة الآن';
    btn.onclick = async () => {
      btn.disabled = true;
      await playVerseAwaitable(state.verseIndex, false);
      btn.disabled = false;
      setLearningStage('record');
    };
  }else if(stage === 'record'){
    btn.textContent = RECORD_BTN_IDLE_LABEL;
    btn.onclick = toggleRecord;
  }else if(stage === 'star'){
    btn.textContent = '⭐ نجمتي';
    btn.onclick = () => { giveStarForVerse(); setLearningStage('next'); };
  }else if(stage === 'next'){
    btn.textContent = '➡️ نكمل؟';
    btn.onclick = goToNextAyahWithLink;
  }else if(stage === 'surah-record-offer'){
    btn.textContent = SURAH_RECORD_IDLE_LABEL;
    btn.onclick = toggleSurahRecord;
  }else if(stage === 'done'){
    btn.textContent = '🌙 سورة أخرى؟';
    btn.onclick = () => showScreen('surahPickerScreen');
  }
}
async function runListenCycle(){
  const myToken = ++state.stageToken;
  const btn = $('recordBtn');
  btn.disabled = true;
  btn.textContent = 'اسمعي يا ريم…';
  const times = state.autoRepeatEnabled ? state.repeatGoal : 1;
  for(let i=0;i<times;i++){
    if(state.stageToken !== myToken) return;
    await playVerseAwaitable(state.verseIndex, false);
    if(state.stageToken !== myToken) return;
    if(i < times-1) await sleep(state.repeatGapSec*1000);
  }
  if(state.stageToken !== myToken) return;
  btn.disabled = false;
  const v = currentVerse();
  if(v.segments.length > 1 && !state.segmentDone[v.verseId]){
    setLearningStage('segment-offer');
  }else{
    setLearningStage('record');
  }
}
async function goToNextAyahWithLink(){
  const myToken = ++state.stageToken;
  const btn = $('recordBtn');
  if(state.verseIndex >= 1){
    btn.disabled = true;
    btn.textContent = state.verseIndex === 1 ? 'نردد الآيتين معاً…' : `نردد الآيات 1 إلى ${state.verseIndex+1}…`;
    await playVerseRangeAwaitable(0, state.verseIndex);
    if(state.stageToken !== myToken) return;
  }
  recordActiveDay();
  nextAyah();
}
function playFullSurah(){
  const s = currentSurah();
  playVerseRangeAwaitable(0, s.verses.length-1);
}

// ---------- متابعة الحضور: أيام متتالية وعودة بعد انقطاع ----------
function todayStr(){ return new Date().toISOString().slice(0,10); }
function recordActiveDay(){
  const today = todayStr();
  const dates = JSON.parse(localStorage.getItem('rim.activeDates') || '[]');
  const last = localStorage.getItem('rim.lastActiveDate');
  if(last && last !== today){
    const gapDays = Math.round((new Date(today) - new Date(last)) / 86400000);
    if(gapDays >= 3 && localStorage.getItem('rim.welcomeBackPending') !== today){
      localStorage.setItem('rim.welcomeBackPending', today);
    }
  }
  if(!dates.includes(today)) dates.push(today);
  while(dates.length > 30) dates.shift();
  localStorage.setItem('rim.activeDates', JSON.stringify(dates));
  localStorage.setItem('rim.lastActiveDate', today);

  const last3 = dates.slice(-3);
  let isStreak3 = last3.length === 3;
  if(isStreak3){
    for(let i=1;i<last3.length;i++){
      if(Math.round((new Date(last3[i]) - new Date(last3[i-1]))/86400000) !== 1) isStreak3 = false;
    }
  }
  if(isStreak3 && localStorage.getItem('rim.streak3Shown') !== 'yes'){
    localStorage.setItem('rim.streak3Shown', 'yes');
    setTimeout(()=>{ setRewardPhoto('assets/rim-v2/special-family.webp'); $('rewardTitle').textContent='🌟 ثلاثة أيام مع القرآن'; $('rewardText').textContent=`ريم واظبت ثلاثة أيام. ${FATHER_SIGNATURE}`; $('rewardBanner').hidden=false; celebrateSoftly(); }, 500);
  }
}
function checkWelcomeBack(){
  const pending = localStorage.getItem('rim.welcomeBackPending');
  if(pending && pending === todayStr()){
    localStorage.removeItem('rim.welcomeBackPending');
    setTimeout(()=> toast(`اشتقنا لك يا ريم 💛 ${FATHER_SIGNATURE}`), 800);
  }
}

const RECORD_BTN_IDLE_LABEL = '🎙️ سجّلي صوتك';
const RECORD_BTN_ACTIVE_LABEL = '⏹️ أوقفي التسجيل';
const MAX_RECORD_MS = 25000; // مدة كافية لآية قصيرة، مناسبة لطفلة ولا تُتعب الانتباه

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
function showRecordJoyCard(){
  $('recordJoyCard').hidden = false;
}
function showFirstRecordingGift(){
  state.totalStars += 1;
  persist();
  $('totalStars').textContent = state.totalStars;
  $('rewardTitle').textContent = '🎁 هدية: أول صوت لريم';
  $('rewardText').textContent = FATHER_SIGNATURE;
  setRewardPhoto('assets/rim-v2/first-voice.webp');
  $('rewardBanner').hidden = false;
  celebrateSoftly();
}

function clearRecordTimer(){
  if(state.recordTimerId){ clearTimeout(state.recordTimerId); state.recordTimerId = null; }
}

// تسجيل الآية كاملة — النواة الأصلية غير مُعدَّلة سوى بإضافة حقل type:'verse' للتصنيف
async function toggleRecord(){
  const btn = $('recordBtn');

  if(state.recorder && state.recorder.state === 'recording'){
    state.recordAutoStopped = false;
    clearRecordTimer();
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
    setRecordStatus('يجب السماح للميكروفون من إعدادات المتصفح حتى تسجل ريم صوتها.');
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
      clearRecordTimer();
      stream.getTracks().forEach(t=>t.stop());
      btn.textContent = RECORD_BTN_IDLE_LABEL;
      btn.classList.remove('recording');
    };

    state.recorder.onstop = async () => {
      console.log('recording stopped');
      clearRecordTimer();
      stream.getTracks().forEach(t=>t.stop());
      btn.textContent = RECORD_BTN_IDLE_LABEL;
      btn.classList.remove('recording');
      $('recordJoyCard').hidden = true;

      const wasAutoStopped = state.recordAutoStopped;
      state.recordAutoStopped = false;
      if(wasAutoStopped) setRecordStatus('انتهى التسجيل يا ريم، نسمع صوتك الآن؟');

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
      if(!wasAutoStopped) setRecordStatus('أحسنتِ يا ريم، هذا صوتك الجميل 🌸');
      showRecordJoyCard();

      const s = currentSurah(), v = currentVerse();
      const rec = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        surahId: s.surahId,
        surahName: s.surahName,
        ayahIndex: state.verseIndex,
        verseNumber: v.verseNumber,
        ayahText: v.fullText,
        createdAt: Date.now(),
        starsAtRecording: state.totalStars,
        audioBlob: blob,
        mimeType: usedMime,
        isBest: false,
        type: 'verse'
      };
      const saved = await idbPut('rimRecordings', undefined, rec);
      console.log('saved to IndexedDB', saved, rec.id);
      refreshRimRecordingsIfOpen();

      if(localStorage.getItem('rim.firstRecordingRewardShown') !== 'yes'){
        localStorage.setItem('rim.firstRecordingRewardShown', 'yes');
        setTimeout(()=>showFirstRecordingGift(), 1200);
      }

      // ننتقل لمرحلة النجمة بعد أن ترى ريم بطاقة الفرح، دون المساس بمنطق التسجيل أعلاه.
      if(state.learningStage === 'record') setLearningStage('star');
    };

    state.recorder.start();
    console.log('recording started', {mimeType: state.recordMime});
    btn.textContent = RECORD_BTN_ACTIVE_LABEL;
    btn.classList.add('recording');
    setRecordStatus('ريم تسجل الآن 🎙️');
    state.recordAutoStopped = false;
    clearRecordTimer();
    state.recordTimerId = setTimeout(() => {
      if(state.recorder && state.recorder.state === 'recording'){
        state.recordAutoStopped = true;
        state.recorder.stop();
      }
    }, MAX_RECORD_MS);
  }catch(e){
    console.log('recording error', e);
    setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
    stream.getTracks().forEach(t=>t.stop());
  }
}

// ---------- تسجيل مقطع تدريبي قصير (اختياري، لا يُحتسب كآية) — نسخة منفصلة بحالتها الخاصة ولا تمس منطق التسجيل الأصلي ----------
const SEGMENT_RECORD_IDLE_LABEL = '🎙️ سجلي هذا المقطع';
const SEGMENT_RECORD_ACTIVE_LABEL = '⏹️ إيقاف تسجيل المقطع';
const SEGMENT_MAX_RECORD_MS = 15000;

function clearSegRecordTimer(){
  if(state.segRecordTimerId){ clearTimeout(state.segRecordTimerId); state.segRecordTimerId = null; }
}
async function toggleSegmentRecord(){
  const btn = $('segmentRecordBtn');
  if(!btn) return;

  if(state.segRecorder && state.segRecorder.state === 'recording'){
    state.segRecordAutoStopped = false;
    clearSegRecordTimer();
    state.segRecorder.stop();
    return;
  }

  if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || typeof MediaRecorder === 'undefined'){
    setRecordStatus('هذا الهاتف لا يسمح بالتسجيل من المتصفح. جرّب Chrome أو فعّل إذن الميكروفون.');
    return;
  }

  let stream;
  try{
    stream = await navigator.mediaDevices.getUserMedia({audio:true});
  }catch(e){
    setRecordStatus('يجب السماح للميكروفون من إعدادات المتصفح حتى تسجل ريم صوتها.');
    return;
  }

  try{
    const mimeType = pickSupportedMimeType();
    state.segChunks = [];
    state.segRecordMime = mimeType || 'audio/webm';
    state.segRecorder = mimeType ? new MediaRecorder(stream, {mimeType}) : new MediaRecorder(stream);

    state.segRecorder.ondataavailable = e => { if(e.data && e.data.size > 0) state.segChunks.push(e.data); };

    state.segRecorder.onerror = (e) => {
      console.log('segment recording error', e.error || e);
      setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
      clearSegRecordTimer();
      stream.getTracks().forEach(t=>t.stop());
      btn.textContent = SEGMENT_RECORD_IDLE_LABEL;
      btn.classList.remove('recording');
    };

    state.segRecorder.onstop = async () => {
      clearSegRecordTimer();
      stream.getTracks().forEach(t=>t.stop());
      btn.textContent = SEGMENT_RECORD_IDLE_LABEL;
      btn.classList.remove('recording');

      const usedMime = state.segRecorder.mimeType || state.segRecordMime || 'audio/webm';
      const blob = new Blob(state.segChunks, {type: usedMime});
      if(!blob.size){
        setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
        return;
      }
      if(state.segRecordUrl) URL.revokeObjectURL(state.segRecordUrl);
      state.segRecordUrl = URL.createObjectURL(blob);
      setRecordStatus('سمعنا تدريبك على المقطع يا ريم 🌸');

      const s = currentSurah(), v = currentVerse(), seg = currentSegment();
      const rec = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        surahId: s.surahId,
        surahName: s.surahName,
        verseNumber: v.verseNumber,
        segmentOrder: seg.segmentOrder,
        ayahText: seg.segmentText,
        createdAt: Date.now(),
        starsAtRecording: state.totalStars,
        audioBlob: blob,
        mimeType: usedMime,
        isBest: false,
        type: 'segment'
      };
      await idbPut('rimRecordings', undefined, rec);
      refreshRimRecordingsIfOpen();
    };

    state.segRecorder.start();
    btn.textContent = SEGMENT_RECORD_ACTIVE_LABEL;
    btn.classList.add('recording');
    setRecordStatus('ريم تسجل المقطع الآن 🎙️');
    state.segRecordAutoStopped = false;
    clearSegRecordTimer();
    state.segRecordTimerId = setTimeout(() => {
      if(state.segRecorder && state.segRecorder.state === 'recording'){
        state.segRecordAutoStopped = true;
        state.segRecorder.stop();
      }
    }, SEGMENT_MAX_RECORD_MS);
  }catch(e){
    setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
    stream.getTracks().forEach(t=>t.stop());
  }
}

// ---------- تسجيل السورة كاملة بعد إتمام آياتها — نسخة منفصلة بحالتها الخاصة، وهي التي تُحدث "ختم السورة" فعلياً ----------
const SURAH_RECORD_IDLE_LABEL = '🎙️ سجلي السورة كاملة';
const SURAH_RECORD_ACTIVE_LABEL = '⏹️ أوقفي تسجيل السورة';
const SURAH_MAX_RECORD_MS = 90000;

function clearSurahRecordTimer(){
  if(state.surahRecordTimerId){ clearTimeout(state.surahRecordTimerId); state.surahRecordTimerId = null; }
}
async function toggleSurahRecord(){
  const btn = $('recordBtn');

  if(state.surahRecorder && state.surahRecorder.state === 'recording'){
    state.surahRecordAutoStopped = false;
    clearSurahRecordTimer();
    state.surahRecorder.stop();
    return;
  }

  if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || typeof MediaRecorder === 'undefined'){
    setRecordStatus('هذا الهاتف لا يسمح بالتسجيل من المتصفح. جرّب Chrome أو فعّل إذن الميكروفون.');
    return;
  }

  let stream;
  try{
    stream = await navigator.mediaDevices.getUserMedia({audio:true});
  }catch(e){
    setRecordStatus('يجب السماح للميكروفون من إعدادات المتصفح حتى تسجل ريم صوتها.');
    return;
  }

  try{
    const mimeType = pickSupportedMimeType();
    state.surahChunks = [];
    state.surahRecordMime = mimeType || 'audio/webm';
    state.surahRecorder = mimeType ? new MediaRecorder(stream, {mimeType}) : new MediaRecorder(stream);

    state.surahRecorder.ondataavailable = e => { if(e.data && e.data.size > 0) state.surahChunks.push(e.data); };

    state.surahRecorder.onerror = (e) => {
      console.log('surah recording error', e.error || e);
      setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
      clearSurahRecordTimer();
      stream.getTracks().forEach(t=>t.stop());
      btn.textContent = SURAH_RECORD_IDLE_LABEL;
      btn.classList.remove('recording');
    };

    state.surahRecorder.onstop = async () => {
      clearSurahRecordTimer();
      stream.getTracks().forEach(t=>t.stop());
      btn.classList.remove('recording');

      const wasAutoStopped = state.surahRecordAutoStopped;
      state.surahRecordAutoStopped = false;
      if(wasAutoStopped) setRecordStatus('انتهى تسجيل السورة يا ريم، أحسنتِ 🌸');

      const usedMime = state.surahRecorder.mimeType || state.surahRecordMime || 'audio/webm';
      const blob = new Blob(state.surahChunks, {type: usedMime});

      if(!blob.size){
        setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
        btn.textContent = SURAH_RECORD_IDLE_LABEL;
        return;
      }

      if(state.surahRecordUrl) URL.revokeObjectURL(state.surahRecordUrl);
      state.surahRecordUrl = URL.createObjectURL(blob);
      showRimRecordingPlayer(state.surahRecordUrl);
      if(!wasAutoStopped) setRecordStatus('أحسنتِ يا ريم، سجلتِ السورة كاملة 🌸');

      const s = currentSurah();
      const rec = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        surahId: s.surahId,
        surahName: s.surahName,
        createdAt: Date.now(),
        starsAtRecording: state.totalStars,
        audioBlob: blob,
        mimeType: usedMime,
        isBest: false,
        type: 'surah',
        totalVerses: s.verses.length
      };
      await idbPut('rimRecordings', undefined, rec);
      refreshRimRecordingsIfOpen();

      const firstTimeThisSurah = !state.completed[s.surahId];
      state.completed[s.surahId] = true;
      persist();

      if(firstTimeThisSurah){
        giveStar(`أتممتِ سورة ${s.surahName} يا ريم… هدية جميلة لقلبك.`, 'assets/rim-v2/surah-complete.webp');
        const firstSurahEver = localStorage.getItem('rim.firstSurahRewardShown') !== 'yes';
        if(firstSurahEver){
          localStorage.setItem('rim.firstSurahRewardShown', 'yes');
          setTimeout(()=>{ setRewardPhoto('assets/rim-v2/surah-complete.webp'); $('rewardTitle').textContent='🌙 أول سورة كاملة لريم'; $('rewardText').textContent=FATHER_SIGNATURE; $('rewardBanner').hidden=false; celebrateSoftly(); }, 900);
        }
        setTimeout(()=>openCertificate(s), 1600);
      }else{
        toast('أحسنتِ يا ريم، سجلتِ السورة كاملة مرة أخرى 🌸');
      }
      setLearningStage('done');
    };

    state.surahRecorder.start();
    btn.textContent = SURAH_RECORD_ACTIVE_LABEL;
    btn.classList.add('recording');
    setRecordStatus('ريم تسجل السورة كاملة الآن 🎙️');
    state.surahRecordAutoStopped = false;
    clearSurahRecordTimer();
    state.surahRecordTimerId = setTimeout(() => {
      if(state.surahRecorder && state.surahRecorder.state === 'recording'){
        state.surahRecordAutoStopped = true;
        state.surahRecorder.stop();
      }
    }, SURAH_MAX_RECORD_MS);
  }catch(e){
    setRecordStatus('لم نستطع التسجيل الآن. جرّب إعادة فتح الصفحة أو استعمال Chrome.');
    stream.getTracks().forEach(t=>t.stop());
  }
}

// ---------- ألبوم صوت ريم: استعراض/تشغيل/حذف/تمييز أفضل قراءة، مع تصنيف حسب نوع التسجيل ----------
let recordingsFilter = 'all';
function typeLabel(type){
  if(type==='segment') return 'تدريب على مقطع';
  if(type==='surah') return 'تسجيل السورة كاملة';
  return 'تسجيل آية كاملة';
}
function filteredRecordings(all){
  if(recordingsFilter === 'all') return all;
  return all.filter(r => (r.type || 'verse') === recordingsFilter);
}
function recordingBadges(r, all){
  const badges = [];
  const sameSurah = all.filter(x=>x.surahId===r.surahId);
  if(all.length && r.id === all[all.length-1].id) badges.push('أول محاولة');
  if(r.isBest) badges.push('صوت جميل');
  if(sameSurah.length >= 3) badges.push('تقدم رائع');
  return badges;
}
async function renderRimRecordings(){
  const all = await idbGetAll('rimRecordings');
  all.sort((a,b)=> b.createdAt - a.createdAt);
  const recordings = filteredRecordings(all);
  console.log('loaded recordings count', all.length, 'shown', recordings.length);

  $('recordingsEmpty').hidden = recordings.length > 0;
  $('recordingsList').innerHTML = recordings.map((r,i) => {
    const badges = recordingBadges(r, all);
    const phrase = albumEncouragements[i % albumEncouragements.length];
    const type = r.type || 'verse';
    const verseNum = r.verseNumber || (r.ayahIndex!=null ? r.ayahIndex+1 : '؟');
    const title = type==='surah'
      ? `🎧 سورة ${r.surahName} كاملة`
      : type==='segment'
        ? `🧩 سورة ${r.surahName} — مقطع من الآية ${verseNum}`
        : `🎙️ سورة ${r.surahName} — الآية ${verseNum}`;
    const sub = type==='surah'
      ? `${r.totalVerses || ''} آيات مسجّلة معاً`.trim()
      : (r.ayahText || '').slice(0, 40) + ((r.ayahText||'').length>40?'…':'');
    return `
    <div class="recording-item" data-id="${r.id}">
      <div class="rec-info">
        <span class="rec-type-badge rec-type-${type}">${typeLabel(type)}</span>
        <b>${title}</b>
        <p class="rec-ayah">${sub}</p>
        <small>${formatArabicDate(r.createdAt)}</small>
        <div class="rec-badges">${badges.map(b=>`<span class="rec-badge">${b}</span>`).join('')}</div>
        <p class="rec-phrase">${phrase}</p>
      </div>
      <div class="rec-actions">
        <button class="play-rec" data-id="${r.id}" type="button">▶ تشغيل</button>
        <button class="danger del-rec" data-id="${r.id}" type="button">🗑️ حذف</button>
        <button class="best ${r.isBest ? 'active' : ''}" data-id="${r.id}" type="button" title="أفضل قراءة">${r.isBest ? '⭐' : '☆'}</button>
      </div>
    </div>`;
  }).join('');

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
async function openRimAlbum(){
  await renderRimRecordings();
  $('recordingsDialog').showModal();
}

// ---------- لوحة الأب: متابعة صوت ريم ----------
async function renderVoiceFollowUp(){
  const recordings = await idbGetAll('rimRecordings');
  recordings.sort((a,b)=> b.createdAt - a.createdAt);
  $('followUpCount').textContent = String(recordings.length);
  const last = recordings[0];
  if(!last){
    $('followUpLast').textContent = 'لا يوجد بعد';
  }else if(last.type === 'surah'){
    $('followUpLast').textContent = `سورة ${last.surahName} كاملة (${formatArabicDate(last.createdAt)})`;
  }else{
    const verseNum = last.verseNumber || (last.ayahIndex!=null ? last.ayahIndex+1 : '؟');
    $('followUpLast').textContent = `سورة ${last.surahName} — آية ${verseNum} (${formatArabicDate(last.createdAt)})`;
  }
  const s = currentSurah();
  $('followUpSurah').textContent = `سورة ${s.surahName}`;
  $('followUpAyah').textContent = `آية ${state.verseIndex+1} / ${s.verses.length}`;
}

// ---------- استوديو صوت الأب: تلاوة شخصية للآية + عبارات تشجيع — لا تُغيَّر هذه الطبقة ----------
async function refreshVoiceStudio(){
  const clip = await idbGet('ayahVoice', verseVoiceKey());
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
      await idbPut('ayahVoice', verseVoiceKey(), blob);
      refreshVoiceStudio();
    };
    state.ayahRecorder.start(); btn.textContent='إيقاف التسجيل'; btn.classList.add('recording');
  }catch(e){ $('ayahVoiceStatus').textContent = 'يحتاج إذن الميكروفون من المتصفح.'; }
}
async function playAyahVoice(){
  const clip = await idbGet('ayahVoice', verseVoiceKey());
  if(clip){ voicePlayer.src = URL.createObjectURL(clip); voicePlayer.play().catch(()=>{}); }
}
async function clearAyahVoice(){
  await idbDelete('ayahVoice', verseVoiceKey());
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

// ---------- شهادة إنجاز قابلة للحفظ والمشاركة، تُرسم عند تسجيل كل سورة كاملة ----------
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
  grad.addColorStop(0, '#fdf8f0'); grad.addColorStop(1, '#eef6f8');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#d9b877'; ctx.lineWidth = 14; ctx.strokeRect(28, 28, W-56, H-56);
  ctx.strokeStyle = '#9cc7da'; ctx.lineWidth = 4; ctx.strokeRect(48, 48, W-96, H-96);

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
  ctx.fillStyle = '#5a8ba0';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText('شهادة إنجاز', W/2, 610);
  ctx.fillStyle = '#3a3229';
  ctx.font = 'bold 76px sans-serif';
  ctx.fillText('ريم', W/2, 715);
  ctx.font = '38px sans-serif';
  ctx.fillStyle = '#6b6156';
  ctx.fillText(`أتمّت بفضل الله حفظ سورة ${surahObj.surahName}`, W/2, 800);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#8a8074';
  const dateStr = new Date().toLocaleDateString('ar', {year:'numeric', month:'long', day:'numeric'});
  ctx.fillText(dateStr, W/2, 855);
  ctx.font = '58px sans-serif';
  ctx.fillText('⭐ ⭐ ⭐', W/2, 960);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#b48a3f';
  ctx.fillText(`مجموع نجوم ريم: ${state.totalStars}`, W/2, 1015);
  ctx.font = '26px sans-serif';
  ctx.fillStyle = '#8a8074';
  ctx.fillText(FATHER_SIGNATURE, W/2, H-90);
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

// ---------- المساعدة الاختيارية: سماع ببطء + سماع السورة كاملة + ألبوم صوت ريم ----------
function toggleHelp(){
  const panel = $('helpPanel');
  panel.hidden = !panel.hidden;
}

function init(){
  renderSurahCards(); renderGarden();
  checkWelcomeBack();
  migrateLegacyRecordings();
  $('startJourneyBtn').onclick=()=> showScreen('surahPickerScreen');
  $('shortcutListen').onclick=()=> { showScreen('journeyScreen'); setTimeout(()=>playVerse(false),300); };
  $('shortcutMemorize').onclick=()=> showScreen('surahPickerScreen');
  $('shortcutGifts').onclick=()=> showScreen('giftsScreen');
  $('homeBtn').onclick=()=> showScreen('homeScreen');
  $('backBtn').onclick=()=> showScreen('surahPickerScreen');
  $('backToHomeFromPicker').onclick=()=> showScreen('homeScreen');

  $('recordBtn').onclick=toggleRecord; // القيمة الابتدائية؛ setLearningStage تُعيد ضبطها حسب المرحلة
  $('segmentRecordBtn').onclick=toggleSegmentRecord;
  $('playRecordBtn').onclick=()=>{ if(state.recordUrl) new Audio(state.recordUrl).play(); };
  $('openRimRecordingsBtn').onclick=openRimAlbum;
  $('closeRecordingsBtn').onclick=()=> $('recordingsDialog').close();
  $('joyPlayBtn').onclick=()=>{ if(state.recordUrl) new Audio(state.recordUrl).play(); };
  $('joyRetryBtn').onclick=()=>{ $('recordJoyCard').hidden = true; toggleRecord(); };
  $('speakRewardBtn').onclick=()=> speak($('rewardText').textContent);

  document.querySelectorAll('#recordingsFilters .filter-btn').forEach(b=>{
    b.addEventListener('click', () => {
      recordingsFilter = b.dataset.filter;
      document.querySelectorAll('#recordingsFilters .filter-btn').forEach(x=>x.classList.toggle('active', x===b));
      renderRimRecordings();
    });
  });

  $('helpToggleBtn').onclick=toggleHelp;
  $('helpSlowBtn').onclick=()=> playVerse(true);
  $('helpFullSurahBtn').onclick=()=> playFullSurah();

  document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>showScreen(b.dataset.target));

  $('parentBtn').onclick=()=>{
    $('repeatSelect').value=state.repeatGoal;
    $('gapSelect').value=state.repeatGapSec;
    $('autoRepeatToggle').checked = state.autoRepeatEnabled;
    $('fatherLine').value=state.fatherLine;
    $('onlineAudio').checked = state.onlineAudio;
    refreshVoiceStudio();
    renderVoiceFollowUp();
    $('parentDialog').showModal();
  };
  $('saveParent').onclick=()=>{
    state.repeatGoal=Number($('repeatSelect').value);
    state.repeatGapSec=Number($('gapSelect').value);
    state.autoRepeatEnabled=$('autoRepeatToggle').checked;
    state.fatherLine=$('fatherLine').value.trim() || state.fatherLine;
    state.onlineAudio=$('onlineAudio').checked;
    persist();
    $('parentDialog').close();
  };
  $('resetProgress').onclick=()=>{ if(confirm('هل تريد فعلاً إعادة النجوم والتقدم؟')){ state.totalStars=0; state.completed={}; state.progress={}; state.surahState={}; state.segmentDone={}; state.verseIndex=0; state.repeats=0; persist(); renderSurahCards(); renderGarden(); }};
  $('openAlbumFromParent').onclick=()=>{ $('parentDialog').close(); openRimAlbum(); };
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
