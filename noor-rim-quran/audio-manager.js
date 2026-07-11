// ---------- AudioManager: نظام مركزي لكل الأصوات التشجيعية/الاحتفالية في نور ريم ----------
// مسؤول فقط عن: اختيار المقطع المناسب لكل مناسبة، ضمان عدم تشغيل أكثر من صوت واحد في اللحظة نفسها،
// احترام كتم الصوت ومستوى الصوت المحفوظين، وحفظ إعدادات الأب. لا يعرف شيئاً عن تلاوة القرآن أو تسجيل
// ريم مباشرة؛ app.js هو من يستدعيه في اللحظة المناسبة ويزوّده بدالة "isBlocked" لمعرفة متى يجب الصمت.
const AudioManager = (function(){
  const CATEGORIES = ['welcome', 'ayah_success', 'stage_complete', 'reward', 'surah_complete', 'retry'];
  const CATEGORY_LABELS = {
    welcome: 'ترحيب عند فتح التطبيق',
    ayah_success: 'نجاح في آية',
    stage_complete: 'إكمال مرحلة (كل آيات السورة)',
    reward: 'نجمة أو هدية جديدة',
    surah_complete: 'ختم سورة كاملة',
    retry: 'تشجيع على إعادة المحاولة'
  };
  const STORAGE_KEY = 'rim.audioManagerSettings';
  const MIN_GAP_MS = 4000; // حد أدنى بين أي صوتين تلقائيين متتاليين مهما كانت فئتهما، لتفادي الإزعاج

  // الأصوات الافتراضية: نفس الملفات الأصلية الموجودة أصلاً في المشروع (لم يُحذف أو يُستبدل أي ملف)،
  // موزَّعة على المناسبات الست حسب خريطة الربط الافتراضية المطلوبة.
  const DEFAULT_TRACKS = [
    {id:'welcome-01', file:'assets/audio/encouragement/encouragement-01.mp3', category:'welcome', displayName:'ترحيب بريم', enabled:true, priority:5, playOnce:false, noImmediateRepeat:true},
    {id:'retry-01', file:'assets/audio/encouragement/encouragement-02.mp3', category:'retry', displayName:'حاولي مرة أخرى', enabled:true, priority:5, playOnce:false, noImmediateRepeat:true},
    {id:'ayah-success-01', file:'assets/audio/encouragement/encouragement-03.mp3', category:'ayah_success', displayName:'أحسنتِ في الآية', enabled:true, priority:5, playOnce:false, noImmediateRepeat:true},
    {id:'stage-complete-01', file:'assets/audio/encouragement/encouragement-04.mp3', category:'stage_complete', displayName:'أتممتِ المرحلة', enabled:true, priority:5, playOnce:false, noImmediateRepeat:true},
    {id:'reward-01', file:'assets/audio/encouragement/encouragement-05.mp3', category:'reward', displayName:'نجمة أو هدية جديدة', enabled:true, priority:5, playOnce:false, noImmediateRepeat:true},
    {id:'surah-complete-01', file:'assets/audio/gifts/rim-try-song.mp3', category:'surah_complete', displayName:'أغنية ختم السورة الكاملة', enabled:true, priority:5, playOnce:false, noImmediateRepeat:false}
  ];

  function defaultSettings(){
    return {soundEnabled:true, volume:1, tracks: DEFAULT_TRACKS.map(t => ({...t, hasPlayed:false, missing:false}))};
  }
  function loadSettings(){
    let saved = {};
    try{ saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }catch(e){ saved = {}; }
    const savedTracks = Array.isArray(saved.tracks) ? saved.tracks : [];
    const tracks = DEFAULT_TRACKS.map(def => {
      const o = savedTracks.find(t => t.id === def.id) || {};
      return {
        ...def,
        enabled: o.enabled !== undefined ? o.enabled : def.enabled,
        displayName: o.displayName || def.displayName,
        category: o.category || def.category,
        priority: o.priority !== undefined ? o.priority : def.priority,
        playOnce: o.playOnce !== undefined ? o.playOnce : def.playOnce,
        noImmediateRepeat: o.noImmediateRepeat !== undefined ? o.noImmediateRepeat : def.noImmediateRepeat,
        hasPlayed: !!o.hasPlayed,
        missing: false
      };
    });
    return {
      soundEnabled: saved.soundEnabled !== undefined ? saved.soundEnabled : true,
      volume: saved.volume !== undefined ? saved.volume : 1,
      tracks
    };
  }

  let settings = loadSettings();
  let player = null;
  let cardEl = null, cardNameEl = null;
  let isBlockedFn = () => false;
  let lastPlayedId = null;
  let lastPlayedAt = 0;

  function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }

  // opts: {player, cardEl, cardNameEl, isBlocked}
  function init(opts){
    player = opts.player;
    cardEl = opts.cardEl || null;
    cardNameEl = opts.cardNameEl || null;
    if(typeof opts.isBlocked === 'function') isBlockedFn = opts.isBlocked;
    player.volume = settings.volume;
  }

  function isSoundEnabled(){ return !!settings.soundEnabled; }
  function setSoundEnabled(v){ settings.soundEnabled = !!v; persist(); }
  function getVolume(){ return settings.volume; }
  function setVolume(v){
    settings.volume = Math.min(1, Math.max(0, v));
    persist();
    if(player) player.volume = settings.volume;
  }

  function getTracks(){ return settings.tracks; }
  function findTrack(id){ return settings.tracks.find(t => t.id === id); }
  function updateTrack(id, patch){
    const t = findTrack(id);
    if(!t) return;
    Object.assign(t, patch);
    persist();
  }
  function resetDefaults(){
    settings = defaultSettings();
    persist();
  }

  async function checkAvailability(){
    for(const t of settings.tracks){
      try{
        const res = await fetch(t.file, {method:'HEAD'});
        t.missing = !res.ok;
      }catch(e){ t.missing = true; }
    }
  }

  function candidatesFor(category){
    return settings.tracks.filter(t => t.category === category && t.enabled && !t.missing && !(t.playOnce && t.hasPlayed));
  }
  // تختار عشوائياً من بين المقاطع المفعّلة الأعلى أولوية لهذه المناسبة، مع تفادي تكرار نفس المقطع فوراً إن وُجد بديل
  function pickTrack(category){
    let candidates = candidatesFor(category);
    if(!candidates.length) return null;
    const withoutLast = candidates.filter(t => !(t.noImmediateRepeat && t.id === lastPlayedId));
    if(withoutLast.length) candidates = withoutLast;
    const topPriority = Math.max(...candidates.map(t => t.priority || 0));
    const top = candidates.filter(t => (t.priority || 0) === topPriority);
    return top[Math.floor(Math.random() * top.length)];
  }

  function hideCard(){ if(cardEl) cardEl.hidden = true; }
  function showCard(track){
    if(!cardEl || !cardNameEl) return;
    cardNameEl.textContent = track.displayName;
    cardEl.hidden = false;
  }

  function stop(){
    if(player){ player.pause(); player.currentTime = 0; }
    hideCard();
  }

  // opts: {preview:false, trackId:null} — المعاينة من لوحة الأب تتجاوز كتم الصوت والحد الأدنى الزمني والحظر
  function play(category, opts={}){
    if(!player) return null;
    if(!opts.preview){
      if(!settings.soundEnabled) return null;
      if(isBlockedFn()) return null;
      if(Date.now() - lastPlayedAt < MIN_GAP_MS) return null;
    }
    const track = opts.trackId ? findTrack(opts.trackId) : pickTrack(category);
    if(!track) return null;
    if(!track.enabled && !opts.preview) return null;

    stop();
    player.src = track.file;
    player.currentTime = 0;
    showCard(track);
    lastPlayedId = track.id;
    lastPlayedAt = Date.now();
    if(track.playOnce && !opts.preview){ track.hasPlayed = true; persist(); }
    player.onended = hideCard;
    const p = player.play();
    if(p && p.catch) p.catch(() => { hideCard(); });
    return p;
  }

  return {
    CATEGORIES, CATEGORY_LABELS,
    init, play, stop,
    isSoundEnabled, setSoundEnabled, getVolume, setVolume,
    getTracks, findTrack, updateTrack, resetDefaults, checkAvailability
  };
})();
