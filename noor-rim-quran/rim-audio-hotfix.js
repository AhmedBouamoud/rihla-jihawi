// طبقة إصلاح مركزة لنور ريم:
// - لا تقسيم للآيات إلى مقاطع أو أجزاء.
// - لا تعليمات صوتية للضغط على الأزرار؛ الحركة وحدها ترشد ريم.
// - الآية تُشغَّل كملف آية كامل، والسورة كملف سورة كامل.
// - المستوى الثاني يضيف سوراً جديدة من دون تغيير السور الست الأصلية أو فهارسها المحفوظة.
// - شاشة اختيار السور تبقى متوازنة: الحديقة الأولى ثم الحديقة الجديدة، داخل الشاشة نفسها.
(function rimAudioHotfix(){
  'use strict';
  if(window.__rimAudioHotfixLoaded) return;
  window.__rimAudioHotfixLoaded = true;

  const SEGMENT_STAGES = new Set(['segment-offer', 'segment', 'segment-next', 'verse-recap']);
  const FULL_SURAH_BASE = 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/';
  const ORIGINAL_SURAHS_COUNT = 6;

  // المستوى الثاني: نضيفه دائماً في نهاية القائمة حتى تبقى فهارس وتقدم السور الأصلية بلا تغيير.
  // لا تدخل البسملة ضمن عداد الآيات.
  const LEVEL_TWO_SURAHS = [
    {surahId:'nasr', surahName:'النصر', symbol:'calmsun', label:'ثلاث آيات قصيرة', audioCode:'110-nasr', verseTexts:[
      'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
      'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
      'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا'
    ]},
    {surahId:'quraysh', surahName:'قريش', symbol:'opening', label:'أربع آيات هادئة', audioCode:'106-quraysh', verseTexts:[
      'لِإِيلَافِ قُرَيْشٍ',
      'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
      'فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ',
      'الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ'
    ]},
    {surahId:'masad', surahName:'المسد', symbol:'halo', label:'خمس آيات', audioCode:'111-masad', verseTexts:[
      'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
      'مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ',
      'سَيَصْلَى نَارًا ذَاتَ لَهَبٍ',
      'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ',
      'فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ'
    ]},
    {surahId:'fil', surahName:'الفيل', symbol:'sunrise', label:'خمس آيات', audioCode:'105-fil', verseTexts:[
      'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
      'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ',
      'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
      'تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ',
      'فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ'
    ]},
    {surahId:'maun', surahName:'الماعون', symbol:'droplet', label:'سبع آيات', audioCode:'107-maun', verseTexts:[
      'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ',
      'فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
      'وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ',
      'فَوَيْلٌ لِلْمُصَلِّينَ',
      'الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ',
      'الَّذِينَ هُمْ يُرَاءُونَ',
      'وَيَمْنَعُونَ الْمَاعُونَ'
    ]},
    {surahId:'kafirun', surahName:'الكافرون', symbol:'embrace', label:'ست آيات', audioCode:'109-kafirun', verseTexts:[
      'قُلْ يَا أَيُّهَا الْكَافِرُونَ',
      'لَا أَعْبُدُ مَا تَعْبُدُونَ',
      'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ',
      'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ',
      'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ',
      'لَكُمْ دِينُكُمْ وَلِيَ دِينِ'
    ]}
  ];

  function addLevelTwoSurahs(){
    if(typeof surahs === 'undefined' || typeof buildSurahs !== 'function') return;
    const existing = new Set(surahs.map(s => s.surahId));
    const additions = buildSurahs(LEVEL_TWO_SURAHS.filter(s => !existing.has(s.surahId)));
    if(!additions.length) return;

    surahs.push(...additions);

    // نحافظ على تقرير الصوت الداخلي متوافقاً مع السور المضافة من دون تغيير محرك الصوت نفسه.
    if(typeof QURAN_AUDIO_MAP !== 'undefined' && Array.isArray(QURAN_AUDIO_MAP)){
      QURAN_AUDIO_MAP.push(...additions.map(s => ({
        surahId: s.surahId,
        fullAudio: typeof localFullSurahSrc === 'function' ? localFullSurahSrc(s) : `assets/audio/full/${s.audioCode}.mp3`,
        ayahs: s.verses.map((v, i) => ({
          number: v.verseNumber,
          audio: typeof localAyahSrc === 'function' ? localAyahSrc(s, i) : `assets/audio/${v.audio}.mp3`,
          onlineAudio: typeof onlineAyahSrc === 'function' ? onlineAyahSrc(s, i) : `https://everyayah.com/data/Alafasy_128kbps/${String(parseInt(s.audioCode, 10)).padStart(3,'0')}${String(i + 1).padStart(3,'0')}.mp3`,
          fatherVoiceKey: typeof fatherVoiceKey === 'function' ? fatherVoiceKey(s, i) : `${s.surahId}:${i + 1}`,
          segments: []
        }))
      })));
    }
  }

  addLevelTwoSurahs();

  // تنظيم السور إلى مستويين من دون شاشة أو زر جديد؛ الشبكة تبقى عمودين كما في النسخة الأصلية.
  function installBalancedSurahPicker(){
    const style = document.createElement('style');
    style.id = 'rim-v2-level-style';
    style.textContent = `
      .surah-cards.surah-levels{display:block}
      .surah-level-block + .surah-level-block{margin-top:18px}
      .surah-level-title{display:flex;align-items:center;gap:9px;margin:2px 2px 10px}
      .surah-level-title span{background:#fff;border:1px solid var(--stroke);border-radius:999px;padding:5px 10px;color:var(--sage-deep);font-size:12px;font-weight:1000;white-space:nowrap}
      .surah-level-title::after{content:"";height:1px;background:var(--stroke);flex:1}
      .surah-level-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    `;
    if(!document.getElementById(style.id)) document.head.appendChild(style);

    window.renderSurahCards = function(){
      const root = document.getElementById('surahCardsGrid');
      if(!root || typeof surahs === 'undefined' || typeof state === 'undefined') return;

      const card = (s, i) => {
        const done = !!state.completed[s.surahId];
        const prog = Math.min(state.progress[s.surahId] || 0, s.verses.length - 1);
        const pct = done ? 100 : Math.round((prog / s.verses.length) * 100);
        return `
          <button class="surah-card" data-i="${i}" type="button">
            <div class="surah-symbol ${s.symbol}" aria-hidden="true"></div>
            <strong>سورة ${s.surahName}</strong>
            <span>${s.verses.length} آيات</span>
            <div class="surah-progress"><i style="width:${pct}%"></i></div>
            ${done ? '<em class="done-tag">✓ ختمت</em>' : ''}
          </button>`;
      };

      const first = surahs.slice(0, ORIGINAL_SURAHS_COUNT).map((s, i) => card(s, i)).join('');
      const second = surahs.slice(ORIGINAL_SURAHS_COUNT).map((s, i) => card(s, i + ORIGINAL_SURAHS_COUNT)).join('');
      root.classList.add('surah-levels');
      root.innerHTML = `
        <section class="surah-level-block" aria-label="الحديقة الأولى">
          <div class="surah-level-title"><span>🌱 الحديقة الأولى</span></div>
          <div class="surah-level-grid">${first}</div>
        </section>
        <section class="surah-level-block" aria-label="الحديقة الجديدة">
          <div class="surah-level-title"><span>🌸 الحديقة الجديدة</span></div>
          <div class="surah-level-grid">${second}</div>
        </section>`;

      root.querySelectorAll('.surah-card').forEach(btn => btn.addEventListener('click', () => openSurah(Number(btn.dataset.i))));
    };

    window.renderSurahCards();
    if(typeof renderGarden === 'function') renderGarden();
  }

  installBalancedSurahPicker();

  function fullSurahUrl(surah){
    const chapter = String(parseInt(surah.audioCode, 10)).padStart(3, '0');
    return `${FULL_SURAH_BASE}${chapter}.mp3`;
  }

  // 1) إلغاء المقاطع نهائياً من مسار التعلم، مع إبقاء الواجهة العامة كما هي.
  const originalSetLearningStage = window.setLearningStage;
  if(typeof originalSetLearningStage === 'function'){
    window.setLearningStage = function(stage){
      return originalSetLearningStage.call(this, SEGMENT_STAGES.has(stage) ? 'record' : stage);
    };
  }

  window.enterSegmentMode = function(){
    if(typeof window.setLearningStage === 'function') window.setLearningStage('record');
  };
  window.verseSegmentFilesExist = async function(){ return false; };
  window.verseSegmentsPlayable = async function(){ return false; };
  window.playSegmentAwaitable = async function(){ return false; };

  // 2) إلغاء أوامر الضغط الصوتية فقط. أصوات النجاح والتشجيع تبقى كما هي.
  window.playGuidance = async function(){ return false; };

  // 3) الآية الكاملة: تسجيل الأب إن وُجد، وإلا ملف الآية الحقيقي مباشرة.
  window.resolvePlayableAudio = async function(surah, verseIndex){
    try{
      if(typeof window.idbGet === 'function' && typeof window.fatherVoiceKey === 'function'){
        const fatherClip = await window.idbGet('ayahVoice', window.fatherVoiceKey(surah, verseIndex));
        if(fatherClip) return {src: URL.createObjectURL(fatherClip), isBlob: true};
      }
    }catch(e){ /* ننتقل إلى التلاوة الحقيقية */ }

    if(typeof window.onlineAyahSrc === 'function'){
      return {src: window.onlineAyahSrc(surah, verseIndex), isBlob: false};
    }
    return {src: `https://everyayah.com/data/Alafasy_128kbps/${String(parseInt(surah.audioCode, 10)).padStart(3,'0')}${String(verseIndex + 1).padStart(3,'0')}.mp3`, isBlob: false};
  };

  // 4) السورة الكاملة: ملف واحد متصل للسورة، لا تجميع آيات ولا فواصل مصطنعة.
  window.playFullSurahAwaitable = async function(surah){
    if(typeof window.playFileAwaitable !== 'function') return;
    await window.playFileAwaitable(fullSurahUrl(surah), {});
  };

  // تبقى عناصر المقاطع موجودة تقنياً حتى لا يتعطل المحرك القديم، لكنها مخفية دائماً ولا تدخل المسار.
  const segmentRecordBtn = document.getElementById('segmentRecordBtn');
  const segmentLabel = document.getElementById('segmentLabel');
  const segmentText = document.getElementById('segmentText');
  if(segmentRecordBtn){ segmentRecordBtn.hidden = true; segmentRecordBtn.setAttribute('aria-hidden', 'true'); }
  if(segmentLabel){ segmentLabel.hidden = true; segmentLabel.setAttribute('aria-hidden', 'true'); }
  if(segmentText){ segmentText.hidden = true; segmentText.setAttribute('aria-hidden', 'true'); }
  document.querySelectorAll('[data-filter="segment"]').forEach(el => el.remove());

  // إن كانت جلسة قديمة محفوظة داخل مرحلة مقطع، نخرج منها فوراً إلى تسجيل الآية كاملة.
  setTimeout(() => {
    const mainBtn = document.getElementById('recordBtn');
    const label = mainBtn ? mainBtn.textContent : '';
    if(/مقطع|جزء|نقسمها/.test(label) && typeof window.setLearningStage === 'function'){
      window.setLearningStage('record');
    }
  }, 0);
})();
