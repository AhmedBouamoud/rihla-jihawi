/* يتطلب أن يكون LESSON_ID معرّفاً قبل تحميل هذا الملف، وlesson-data.js محمّلاً قبله */
const particlesHost = document.querySelector('.particles');
if (particlesHost) {
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (9 + Math.random() * 12) + 's';
    p.style.animationDelay = (-Math.random() * 14) + 's';
    p.style.opacity = .3 + Math.random() * .5;
    particlesHost.appendChild(p);
  }
}

const HISTORY_STORAGE_KEY = 'jihawiHistoryProgress';

function loadHistoryState() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { completedLessons: [], xp: 0 };
}
function saveHistoryState(state) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(state));
}

const historyState = loadHistoryState();
const lesson = LESSONS[LESSON_ID];
const lessonIndex = LESSON_ORDER.indexOf(LESSON_ID);
const nextLessonId = LESSON_ORDER[lessonIndex + 1] || null;
const alreadyDone = historyState.completedLessons.includes(LESSON_ID);

/* ============ عناصر مساعدة ============ */
function shakeElement(el) {
  el.classList.remove('shake-basic');
  void el.offsetWidth;
  el.classList.add('shake-basic');
}
function spawnBurst(originEl, count) {
  count = count || 20;
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'burst-particle';
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 80;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--by', Math.sin(angle) * dist + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 850);
  }
}

/* ============ رسم رأس الدرس والمحتوى ============ */
document.title = lesson.title + ' — محور التاريخ | بوابة الجهوي';
document.getElementById('lessonIcon').textContent = lesson.icon;
document.getElementById('lessonTitle').textContent = lesson.title;
document.getElementById('lessonTeaser').textContent = lesson.teaser;
document.getElementById('lessonDuration').textContent = '⏱️ ' + lesson.duration;
document.getElementById('crumbTitle').textContent = lesson.title;

const sectionsEl = document.getElementById('lessonSections');
lesson.sections.forEach(sec => {
  const div = document.createElement('div');
  div.className = 'lesson-section';
  div.innerHTML = `<h3>${sec.h}</h3>${sec.html}`;
  sectionsEl.appendChild(div);
});

const timelineEl = document.getElementById('lessonTimeline');
lesson.timeline.forEach(pt => {
  const div = document.createElement('div');
  div.className = 'tl-point';
  div.innerHTML = `<b>${pt.y}</b><span>${pt.l}</span>`;
  timelineEl.appendChild(div);
});

const keytermsEl = document.getElementById('lessonKeyterms');
lesson.keyTerms.forEach(k => {
  const div = document.createElement('div');
  div.className = 'keyterm-card';
  div.innerHTML = `<b>${k.term}</b><span>${k.def}</span>`;
  keytermsEl.appendChild(div);
});

/* ============ زر الدرس التالي ============ */
const nextBtn = document.getElementById('nextLessonBtn');
if (nextLessonId) {
  nextBtn.href = '../' + nextLessonId + '/';
  nextBtn.textContent = 'الدرس التالي: ' + LESSONS[nextLessonId].title;
} else {
  nextBtn.href = '../../index.html#history-axis';
  nextBtn.textContent = 'أنهيت كل دروس محور التاريخ 🎉';
}

/* ============ خطوات المسار ============ */
const steps = { content: document.getElementById('step-content'), challenge: document.getElementById('step-challenge'), quiz: document.getElementById('step-quiz'), done: document.getElementById('step-done') };
steps.content.classList.add('done');
function markStep(key) { steps[key].classList.add('done'); steps[key].classList.remove('active'); }
function activateStep(key) { steps[key].classList.add('active'); }
activateStep('challenge');

/* ============ التحدي ============ */
const challengeBody = document.getElementById('challengeBody');
const challengeFeedback = document.getElementById('challengeFeedback');
let challengeSolved = alreadyDone;

function unlockQuiz() {
  if (challengeSolved) return;
  challengeSolved = true;
  markStep('challenge');
  activateStep('quiz');
  document.getElementById('quizLockedMsg').hidden = true;
  document.getElementById('quizCard').hidden = false;
}

function renderTimelineChallenge() {
  const data = lesson.challenge;
  const shuffled = [...data.events].sort(() => Math.random() - 0.5);
  challengeBody.innerHTML = `
    <p class="hint">${data.instructions}</p>
    <ul class="tl-list" id="tlList"></ul>
    <div class="challenge-actions"><button class="btn primary" id="tlCheck">تحقق من الترتيب</button></div>
  `;
  const list = document.getElementById('tlList');
  shuffled.forEach(ev => {
    const li = document.createElement('li');
    li.className = 'tl-card';
    li.dataset.id = ev.id;
    li.innerHTML = `<span class="tl-handle">⠿</span><span class="tl-text">${ev.text}</span>
      <span class="tl-arrows"><button type="button" class="tl-up" aria-label="أعلى">▲</button><button type="button" class="tl-down" aria-label="أسفل">▼</button></span>`;
    list.appendChild(li);
    makeSortableCard(li, list);
    li.querySelector('.tl-up').addEventListener('click', () => { const p = li.previousElementSibling; if (p) list.insertBefore(li, p); });
    li.querySelector('.tl-down').addEventListener('click', () => { const n = li.nextElementSibling; if (n) list.insertBefore(n, li); });
  });
  document.getElementById('tlCheck').addEventListener('click', () => {
    const order = [...list.querySelectorAll('.tl-card')].map(c => c.dataset.id);
    const correct = data.events.map(e => e.id);
    const ok = order.every((id, i) => id === correct[i]);
    if (ok) {
      challengeFeedback.textContent = 'أحسنت! الترتيب صحيح.';
      challengeFeedback.classList.add('success');
      spawnBurst(challengeFeedback, 12);
      unlockQuiz();
    } else {
      challengeFeedback.textContent = 'ليس هذا هو الترتيب الصحيح بعد. راجع التواريخ وأعد المحاولة.';
      challengeFeedback.classList.remove('success');
      shakeElement(list);
    }
  });
}

function makeSortableCard(card, list) {
  let pointerId = null, startY = 0;
  card.addEventListener('pointerdown', e => {
    if (e.target.closest('.tl-arrows')) return;
    pointerId = e.pointerId; startY = e.clientY;
    card.setPointerCapture(pointerId); card.classList.add('dragging');
  });
  card.addEventListener('pointermove', e => {
    if (e.pointerId !== pointerId) return;
    const dy = e.clientY - startY;
    card.style.transform = `translateY(${dy}px)`;
    const siblings = [...list.querySelectorAll('.tl-card:not(.dragging)')];
    const cardRect = card.getBoundingClientRect();
    const cardMiddle = cardRect.top + cardRect.height / 2;
    for (const sib of siblings) {
      const sibRect = sib.getBoundingClientRect();
      const sibMiddle = sibRect.top + sibRect.height / 2;
      if (dy > 0 && cardMiddle > sibMiddle) { list.insertBefore(card, sib.nextSibling); startY = e.clientY; card.style.transform = ''; }
      else if (dy < 0 && cardMiddle < sibMiddle) { list.insertBefore(card, sib); startY = e.clientY; card.style.transform = ''; }
    }
  });
  function release(e) { if (e.pointerId !== pointerId) return; card.classList.remove('dragging'); card.style.transform = ''; pointerId = null; }
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
}

function renderDragzoneChallenge() {
  const data = lesson.challenge;
  const shuffled = [...data.items].sort(() => Math.random() - 0.5);
  challengeBody.innerHTML = `
    <p class="hint">${data.instructions}</p>
    <div class="dz-zones" id="dzZones"></div>
    <div class="dz-pool" id="dzPool"></div>
    <div class="challenge-actions"><button class="btn primary" id="dzCheck">تحقق</button></div>
  `;
  const zonesEl = document.getElementById('dzZones');
  data.zones.forEach(zoneName => {
    const zoneEl = document.createElement('div');
    zoneEl.className = 'dz-zone';
    zoneEl.dataset.zone = zoneName;
    zoneEl.innerHTML = `<h4>${zoneName}</h4><div class="dz-zone-body"></div>`;
    zonesEl.appendChild(zoneEl);
  });
  const pool = document.getElementById('dzPool');
  shuffled.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'dz-chip';
    chip.dataset.id = item.id;
    chip.dataset.correctZone = item.zone;
    chip.textContent = item.text;
    pool.appendChild(chip);
    makeDraggableChip(chip, pool);
  });
  document.getElementById('dzCheck').addEventListener('click', () => {
    const poolChips = pool.querySelectorAll('.dz-chip');
    if (poolChips.length > 0) {
      challengeFeedback.textContent = 'ضع كل البطاقات داخل الخانات أولاً.';
      challengeFeedback.classList.remove('success');
      shakeElement(pool);
      return;
    }
    const allChips = zonesEl.querySelectorAll('.dz-chip');
    let allCorrect = true;
    allChips.forEach(chip => {
      const zoneEl = chip.closest('.dz-zone');
      const correct = chip.dataset.correctZone === zoneEl.dataset.zone;
      chip.classList.remove('wrong', 'correct');
      if (correct) chip.classList.add('correct');
      else { allCorrect = false; chip.classList.add('wrong'); setTimeout(() => { pool.appendChild(chip); chip.classList.remove('wrong'); }, 450); }
    });
    if (allCorrect) {
      challengeFeedback.textContent = 'أحسنت! كل بطاقة في مكانها الصحيح.';
      challengeFeedback.classList.add('success');
      spawnBurst(challengeFeedback, 12);
      unlockQuiz();
    } else {
      challengeFeedback.textContent = 'بعض البطاقات ليست في مكانها الصحيح. حاول من جديد.';
      challengeFeedback.classList.remove('success');
    }
  });
}

function makeDraggableChip(chip, pool) {
  chip.addEventListener('pointerdown', e => {
    e.preventDefault();
    const rect = chip.getBoundingClientRect();
    const offsetX = e.clientX - rect.left, offsetY = e.clientY - rect.top;
    chip.setPointerCapture(e.pointerId);
    chip.classList.add('dragging');
    chip.style.position = 'fixed'; chip.style.width = rect.width + 'px';
    chip.style.left = rect.left + 'px'; chip.style.top = rect.top + 'px'; chip.style.zIndex = 1500;
    chip.style.pointerEvents = 'none';
    function move(ev) { chip.style.left = (ev.clientX - offsetX) + 'px'; chip.style.top = (ev.clientY - offsetY) + 'px'; }
    function up(ev) {
      chip.removeEventListener('pointermove', move); chip.removeEventListener('pointerup', up); chip.removeEventListener('pointercancel', up);
      chip.classList.remove('dragging');
      chip.style.position = ''; chip.style.left = ''; chip.style.top = ''; chip.style.width = ''; chip.style.zIndex = ''; chip.style.pointerEvents = '';
      const dropEl = document.elementFromPoint(ev.clientX, ev.clientY);
      const zoneEl = dropEl && dropEl.closest('.dz-zone');
      if (zoneEl) zoneEl.querySelector('.dz-zone-body').appendChild(chip);
      else pool.appendChild(chip);
    }
    chip.addEventListener('pointermove', move);
    chip.addEventListener('pointerup', up);
    chip.addEventListener('pointercancel', up);
  });
}

if (lesson.challenge.type === 'timeline') renderTimelineChallenge();
else renderDragzoneChallenge();

if (alreadyDone) unlockQuiz();

/* ============ الاختبار ============ */
const quizBody = document.getElementById('quizBody');
let answeredCount = 0;
lesson.quiz.forEach((q, qi) => {
  const div = document.createElement('div');
  div.className = 'quiz-q';
  div.innerHTML = `<p class="qtext">${qi + 1}. ${q.q}</p><div class="quiz-opts"></div><p class="quiz-explain" id="explain-${qi}">${q.e}</p>`;
  const optsEl = div.querySelector('.quiz-opts');
  q.o.forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (div.dataset.answered) return;
      div.dataset.answered = '1';
      answeredCount++;
      [...optsEl.children].forEach((b, i) => {
        b.classList.add('selected');
        if (i === q.c) b.classList.add('correct');
        else if (i === oi) b.classList.add('incorrect');
      });
      document.getElementById('explain-' + qi).classList.add('show');
      if (answeredCount === lesson.quiz.length) {
        document.getElementById('quizFinishBtn').hidden = false;
      }
    });
    optsEl.appendChild(btn);
  });
  quizBody.appendChild(div);
});

document.getElementById('quizFinishBtn').addEventListener('click', () => {
  markStep('quiz');
  activateStep('done');
  document.getElementById('quizCard').hidden = true;
  showCompletion();
});

/* ============ شاشة الإنجاز ============ */
function showCompletion() {
  const completionCard = document.getElementById('completionCard');
  completionCard.hidden = false;
  if (!alreadyDone && !historyState.completedLessons.includes(LESSON_ID)) {
    historyState.completedLessons.push(LESSON_ID);
    historyState.xp += lesson.xp;
    saveHistoryState(historyState);
  }
  document.getElementById('completionBadgeName').textContent = lesson.badge;
  document.getElementById('completionXp').textContent = '+' + lesson.xp + ' XP';
  const badgeEl = document.getElementById('completionBadge');
  badgeEl.classList.add('pop');
  spawnBurst(badgeEl, 22);
  completionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
