const surahs = [
  {
    id: 'fatiha', name: 'الفاتحة', label: 'أم الكتاب', audioPrefix: '001-fatiha',
    ayahs: [
      { text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', words: ['بِسْمِ','اللَّهِ','الرَّحْمَٰنِ','الرَّحِيمِ'], help: 'بِسْمِ / اللهِ / الرَّحْـ / مَـٰـنِ / الرَّحِيمِ' },
      { text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', words: ['الْحَمْدُ','لِلَّهِ','رَبِّ','الْعَالَمِينَ'], help: 'الْحَمْدُ… بهدوء، ثم لِلَّهِ' },
      { text: 'الرَّحْمَٰنِ الرَّحِيمِ', words: ['الرَّحْمَٰنِ','الرَّحِيمِ'], help: 'الرَّحْـ / مَـٰـنِ… الرَّحِيمِ' },
      { text: 'مَالِكِ يَوْمِ الدِّينِ', words: ['مَالِكِ','يَوْمِ','الدِّينِ'], help: 'مَا / لِكِ… يَوْمِ… الدِّينِ' },
      { text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', words: ['إِيَّاكَ','نَعْبُدُ','وَإِيَّاكَ','نَسْتَعِينُ'], help: 'إِيَّا / كَ… نَعْـ / بُدُ' },
      { text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', words: ['اهْدِنَا','الصِّرَاطَ','الْمُسْتَقِيمَ'], help: 'اهْدِ / نَا… الصِّـ / رَاطَ' },
      { text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', words: ['صِرَاطَ','الَّذِينَ','أَنْعَمْتَ','عَلَيْهِمْ','غَيْرِ','الْمَغْضُوبِ','عَلَيْهِمْ','وَلَا','الضَّالِّينَ'], help: 'نقسمها كلمات صغيرة… كلمة كلمة يا ريم' }
    ]
  },
  {
    id: 'ikhlas', name: 'الإخلاص', label: 'قصيرة ومحبوبة', audioPrefix: '112-ikhlas',
    ayahs: [
      { text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', words: ['قُلْ','هُوَ','اللَّهُ','أَحَدٌ'], help: 'قُلْ… هُوَ… اللهُ… أَحَدٌ' },
      { text: 'اللَّهُ الصَّمَدُ', words: ['اللَّهُ','الصَّمَدُ'], help: 'الصَّـ / مَـ / دُ' },
      { text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', words: ['لَمْ','يَلِدْ','وَلَمْ','يُولَدْ'], help: 'لَمْ… يَلِدْ… وَلَمْ… يُولَدْ' },
      { text: 'وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ', words: ['وَلَمْ','يَكُنْ','لَّهُ','كُفُوًا','أَحَدٌ'], help: 'كُـ / فُـ / وًا… أَحَدٌ' }
    ]
  },
  {
    id: 'falaq', name: 'الفلق', label: 'حفظ وحماية', audioPrefix: '113-falaq',
    ayahs: [
      { text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', words: ['قُلْ','أَعُوذُ','بِرَبِّ','الْفَلَقِ'], help: 'أَعُوذُ… بِرَبِّ… الْفَلَقِ' },
      { text: 'مِنْ شَرِّ مَا خَلَقَ', words: ['مِنْ','شَرِّ','مَا','خَلَقَ'], help: 'مِنْ… شَرِّ… مَا… خَلَقَ' },
      { text: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', words: ['وَمِنْ','شَرِّ','غَاسِقٍ','إِذَا','وَقَبَ'], help: 'غَا / سِقٍ… إِذَا… وَقَبَ' },
      { text: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', words: ['وَمِنْ','شَرِّ','النَّفَّاثَاتِ','فِي','الْعُقَدِ'], help: 'النَّفَّا / ثَاتِ… الْعُقَدِ' },
      { text: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', words: ['وَمِنْ','شَرِّ','حَاسِدٍ','إِذَا','حَسَدَ'], help: 'حَا / سِدٍ… إِذَا… حَسَدَ' }
    ]
  },
  {
    id: 'nas', name: 'الناس', label: 'سكينة وطمأنينة', audioPrefix: '114-nas',
    ayahs: [
      { text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', words: ['قُلْ','أَعُوذُ','بِرَبِّ','النَّاسِ'], help: 'أَعُوذُ… بِرَبِّ… النَّاسِ' },
      { text: 'مَلِكِ النَّاسِ', words: ['مَلِكِ','النَّاسِ'], help: 'مَلِكِ… النَّاسِ' },
      { text: 'إِلَٰهِ النَّاسِ', words: ['إِلَٰهِ','النَّاسِ'], help: 'إِلَـٰـهِ… النَّاسِ' },
      { text: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', words: ['مِنْ','شَرِّ','الْوَسْوَاسِ','الْخَنَّاسِ'], help: 'الْوَسْـ / وَاسِ… الْخَنَّاسِ' },
      { text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', words: ['الَّذِي','يُوَسْوِسُ','فِي','صُدُورِ','النَّاسِ'], help: 'يُوَسْـ / وِسُ… صُدُورِ' },
      { text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', words: ['مِنَ','الْجِنَّةِ','وَالنَّاسِ'], help: 'الْجِنَّةِ… وَالنَّاسِ' }
    ]
  },
  {
    id: 'kawthar', name: 'الكوثر', label: 'ثلاث آيات', audioPrefix: '108-kawthar',
    ayahs: [
      { text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', words: ['إِنَّا','أَعْطَيْنَاكَ','الْكَوْثَرَ'], help: 'إِنَّا… أَعْطَيْـ / نَاكَ… الْكَوْثَرَ' },
      { text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', words: ['فَصَلِّ','لِرَبِّكَ','وَانْحَرْ'], help: 'فَصَلِّ… لِرَبِّكَ… وَانْحَرْ' },
      { text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', words: ['إِنَّ','شَانِئَكَ','هُوَ','الْأَبْتَرُ'], help: 'شَا / نِئَ / كَ… الْأَبْتَرُ' }
    ]
  }
];

const $ = (id) => document.getElementById(id);
const state = {
  surahIndex: 1,
  ayahIndex: 0,
  stars: Number(localStorage.getItem('rimStars') || 0),
  repeatGoal: Number(localStorage.getItem('repeatGoal') || 3),
  repeatCount: 0,
  mode: 'حفظ',
  mediaRecorder: null,
  chunks: [],
  recordUrl: null,
};

const audioPlayer = $('audioPlayer');

function saveProgress() {
  const done = JSON.parse(localStorage.getItem('surahDone') || '{}');
  localStorage.setItem('rimStars', String(state.stars));
  localStorage.setItem('surahDone', JSON.stringify(done));
}

function markSurahDone(id) {
  const done = JSON.parse(localStorage.getItem('surahDone') || '{}');
  done[id] = true;
  localStorage.setItem('surahDone', JSON.stringify(done));
}

function renderSurahs() {
  const done = JSON.parse(localStorage.getItem('surahDone') || '{}');
  $('surahGrid').innerHTML = surahs.map((s, i) => `
    <button class="surah-card" type="button" data-index="${i}">
      <b>سورة ${s.name}</b>
      <span>${s.label}</span>
      <div class="progress-dots">${s.ayahs.map((_, n) => `<i class="dot ${done[s.id] ? 'done' : ''}"></i>`).join('')}</div>
    </button>
  `).join('');
  document.querySelectorAll('.surah-card').forEach(btn => btn.addEventListener('click', () => openSurah(Number(btn.dataset.index), 'حفظ')));
}

function openSurah(index, mode='حفظ') {
  state.surahIndex = index;
  state.ayahIndex = 0;
  state.repeatCount = 0;
  state.mode = mode;
  $('homeView').hidden = true;
  $('learnView').hidden = false;
  $('modeBadge').textContent = mode === 'استماع' ? 'أسمع فقط' : 'وضع الحفظ';
  renderAyah();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAyah() {
  const surah = surahs[state.surahIndex];
  const ayah = surah.ayahs[state.ayahIndex];
  $('surahTitle').textContent = `سورة ${surah.name}`;
  $('ayahCounter').textContent = `آية ${state.ayahIndex + 1} / ${surah.ayahs.length}`;
  $('starCounter').textContent = `⭐ ${state.stars}`;
  $('ayahText').textContent = ayah.text;
  $('wordRow').innerHTML = ayah.words.map((w, i) => `<span class="word-chip" data-word="${i}">${w}</span>`).join('');
  $('pronunciationHelp').textContent = `مساعدة نطق: ${ayah.help}`;
  $('rewardCard').hidden = true;
}

function audioPath() {
  const surah = surahs[state.surahIndex];
  const n = String(state.ayahIndex + 1).padStart(2, '0');
  return `assets/audio/${surah.audioPrefix}-${n}.mp3`;
}

function highlightWords(duration = 2200) {
  const chips = [...document.querySelectorAll('.word-chip')];
  chips.forEach(c => c.classList.remove('active'));
  if (!chips.length) return;
  const step = Math.max(550, duration / chips.length);
  chips.forEach((chip, i) => setTimeout(() => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  }, i * step));
  setTimeout(() => chips.forEach(c => c.classList.remove('active')), step * chips.length + 500);
}

function showReward(title, text) {
  $('rewardTitle').textContent = title;
  $('rewardText').textContent = text;
  $('rewardCard').hidden = false;
}

function playAyah() {
  const src = audioPath();
  audioPlayer.src = src;
  audioPlayer.playbackRate = $('slowMode').checked ? 0.86 : 1;
  highlightWords(3500);
  audioPlayer.play().catch(() => {
    showReward('الصوت غير مضاف بعد', 'ضع ملف التلاوة في assets/audio، وسيشتغل الزر تلقائياً. إلى ذلك الحين نستعمل الكلمات والتكرار مع أبي.');
  });
}

function repeatAyah() {
  state.repeatCount += 1;
  playAyah();
  if (state.repeatCount >= state.repeatGoal) {
    state.stars += 1;
    saveProgress();
    $('starCounter').textContent = `⭐ ${state.stars}`;
    showReward('أحسنت يا ريم ⭐', 'سمعتِ الآية عدة مرات. الآن دور ريم بهدوء.');
    state.repeatCount = 0;
  }
}

function nextAyah() {
  const surah = surahs[state.surahIndex];
  if (state.ayahIndex < surah.ayahs.length - 1) {
    state.ayahIndex += 1;
    state.repeatCount = 0;
    renderAyah();
  } else {
    state.stars += 3;
    markSurahDone(surah.id);
    saveProgress();
    renderSurahs();
    showReward(`ما شاء الله يا ريم`, `أتممتِ سورة ${surah.name}. نراجعها غداً بهدوء وفرح.`);
    $('starCounter').textContent = `⭐ ${state.stars}`;
  }
}

async function toggleRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    state.mediaRecorder.stop();
    $('recordBtn').classList.remove('recording');
    $('recordBtn').textContent = '● تسجيل';
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.chunks = [];
    state.mediaRecorder = new MediaRecorder(stream);
    state.mediaRecorder.ondataavailable = e => state.chunks.push(e.data);
    state.mediaRecorder.onstop = () => {
      const blob = new Blob(state.chunks, { type: 'audio/webm' });
      if (state.recordUrl) URL.revokeObjectURL(state.recordUrl);
      state.recordUrl = URL.createObjectURL(blob);
      $('playRecordBtn').disabled = false;
      showReward('سمعنا صوت ريم', 'قريب جداً يا ريم… نعيدها معاً بهدوء وحب.');
      stream.getTracks().forEach(t => t.stop());
    };
    state.mediaRecorder.start();
    $('recordBtn').classList.add('recording');
    $('recordBtn').textContent = 'إيقاف التسجيل';
  } catch (e) {
    showReward('الميكروفون يحتاج إذناً', 'اسمح للتطبيق باستعمال الميكروفون حتى نسجل صوت ريم.');
  }
}

function playRecording() {
  if (!state.recordUrl) return;
  const a = new Audio(state.recordUrl);
  a.play();
}

$('startBtn').addEventListener('click', () => openSurah(1, 'حفظ'));
$('listenBtn').addEventListener('click', () => openSurah(state.surahIndex, 'استماع'));
$('backHomeBtn').addEventListener('click', () => { $('learnView').hidden = true; $('homeView').hidden = false; });
$('playAyahBtn').addEventListener('click', playAyah);
$('repeatBtn').addEventListener('click', repeatAyah);
$('rimTurnBtn').addEventListener('click', () => showReward('دور ريم الآن 🎤', 'نسمع من ريم بهدوء. كلمة كلمة… آية آية.'));
$('nextAyahBtn').addEventListener('click', nextAyah);
$('recordBtn').addEventListener('click', toggleRecording);
$('playRecordBtn').addEventListener('click', playRecording);
$('parentBtn').addEventListener('click', () => $('parentPanel').hidden = false);
$('closeParentBtn').addEventListener('click', () => $('parentPanel').hidden = true);
$('repeatSelect').value = String(state.repeatGoal);
$('repeatSelect').addEventListener('change', e => { state.repeatGoal = Number(e.target.value); localStorage.setItem('repeatGoal', e.target.value); });
$('resetBtn').addEventListener('click', () => {
  if (!confirm('هل تريد إعادة تقدم ريم من البداية؟')) return;
  localStorage.removeItem('rimStars');
  localStorage.removeItem('surahDone');
  state.stars = 0;
  renderSurahs();
  renderAyah();
});

renderSurahs();
renderAyah();
