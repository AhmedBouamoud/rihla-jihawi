// هوية نور ريم — النسخة الثانية: صور واقعية مضغوطة ومحفوظة داخل المشروع بصيغة Base64 نصية.
(async function loadRimV3Visuals(){
  'use strict';
  if(window.__rimV3VisualsLoaded) return;
  window.__rimV3VisualsLoaded = true;

  async function loadData(path){
    const res = await fetch(path, {cache:'force-cache'});
    if(!res.ok) throw new Error(`visual ${res.status}: ${path}`);
    return `data:image/webp;base64,${(await res.text()).trim()}`;
  }
  function setImg(selector, src){
    const el = document.querySelector(selector);
    if(el) el.src = src;
  }

  try{
    const [hero, quranHug, fatherReading] = await Promise.all([
      loadData('assets/rim-v3/hero.b64'),
      loadData('assets/rim-v3/quran-hug.b64'),
      loadData('assets/rim-v3/father-reading.b64')
    ]);

    const source = document.querySelector('.main-frame picture source');
    if(source) source.srcset = hero;
    setImg('.main-frame img', hero);
    setImg('#rewardPhoto', quranHug);
    setImg('.family-card img', fatherReading);
    setImg('#recordingsDialog .album-photo img', quranHug);
    setImg('.follow-up-head img', fatherReading);

    const moments = document.querySelectorAll('.moments-scroll img');
    const pack = [quranHug, hero, fatherReading, quranHug];
    moments.forEach((img, i) => { img.src = pack[i % pack.length]; });
  }catch(err){
    console.warn('Noor Rim v2 visuals fallback:', err);
  }
})();
