// طبقة إصلاح مركزة لنور ريم:
// - لا تقسيم للآيات إلى مقاطع أو أجزاء.
// - لا تعليمات صوتية للضغط على الأزرار؛ الحركة وحدها ترشد ريم.
// - الآية تُشغَّل كملف آية كامل، والسورة كملف سورة كامل.
(function rimAudioHotfix(){
  'use strict';
  if(window.__rimAudioHotfixLoaded) return;
  window.__rimAudioHotfixLoaded = true;

  const SEGMENT_STAGES = new Set(['segment-offer', 'segment', 'segment-next', 'verse-recap']);
  const FULL_SURAH_BASE = 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/';

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
  // نتجاوز نظام الشرائح والتوقيتات المعقد لأنه كان سبباً في الصمت أو القطع على بعض الهواتف.
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
