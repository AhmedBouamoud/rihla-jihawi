/* ============ بيانات تعليمية قابلة للتعديل ============ */
const EXPLORATION_DATA = {
  station1: {
    type: 'timeline',
    title: 'صندوق الزمن',
    instructions: 'رتّب الأحداث التالية بحسب تسلسلها الزمني الصحيح، من الأقدم إلى الأحدث.',
    // الترتيب في المصفوفة هو الترتيب الصحيح
    events: [
      { id: 'e1', text: 'فرض الحماية على المغرب' },
      { id: 'e2', text: 'اندلاع المقاومة المسلحة' },
      { id: 'e3', text: 'تقديم وثيقة المطالبة بالاستقلال' },
      { id: 'e4', text: 'عودة محمد الخامس من المنفى' },
      { id: 'e5', text: 'إعلان استقلال المغرب' }
    ],
    reward: { badge: 'مفتاح الزمن', xp: 30, successMessage: 'أحسنت! لقد فتحت مفتاح الزمن.' }
  },
  station2: {
    type: 'dragzone',
    title: 'خريطة الدليل',
    instructions: 'اسحب كل معركة وكل قائد من معارك المقاومة المغربية إلى المنطقة الصحيحة التي وقعت فيها.',
    zones: ['الجنوب', 'الأطلس المتوسط', 'الريف', 'الأطلس الصغير'],
    items: [
      { id: 'i1', text: 'سيدي بوعثمان', zone: 'الجنوب' },
      { id: 'i2', text: 'أحمد الهيبة', zone: 'الجنوب' },
      { id: 'i3', text: 'الهري', zone: 'الأطلس المتوسط' },
      { id: 'i4', text: 'موحا أوحمو الزياني', zone: 'الأطلس المتوسط' },
      { id: 'i5', text: 'أنوال', zone: 'الريف' },
      { id: 'i6', text: 'محمد بن عبد الكريم الخطابي', zone: 'الريف' },
      { id: 'i7', text: 'بوغافر', zone: 'الأطلس الصغير' },
      { id: 'i8', text: 'آيت عطا', zone: 'الأطلس الصغير' }
    ],
    reward: { badge: 'محقق الوثائق', xp: 40, successMessage: 'لقد عثرت على الدليل المخفي.' }
  },
  station3: {
    type: 'dragzone',
    title: 'لغز المفاهيم',
    instructions: 'صنّف كل بطاقة داخل الخانة المناسبة لها.',
    zones: ['التاريخ', 'الجغرافيا', 'المواطنة'],
    items: [
      { id: 'c1', text: 'الاستقلال', zone: 'التاريخ' },
      { id: 'c2', text: 'المقاومة', zone: 'التاريخ' },
      { id: 'c3', text: 'الخريطة', zone: 'الجغرافيا' },
      { id: 'c4', text: 'المبيان', zone: 'الجغرافيا' },
      { id: 'c5', text: 'التراث', zone: 'المواطنة' },
      { id: 'c6', text: 'التنمية المستدامة', zone: 'المواطنة' }
    ],
    reward: { badge: 'نجمة المستكشف', xp: 40, successMessage: 'أصبحت تعرف طريقك بين المفاهيم.' }
  }
};

const IBN_MESSAGES = {
  enter: 'أهلاً أيها الرحالة. في هذه الأراضي لا نحفظ فقط، بل نكتشف ونرتب ونفتح المفاتيح.',
  error: 'اقتربت من الطريق الصحيح. جرّب أن تبحث عن العلاقة بين البطاقات.',
  success: 'أحسنت. كل مفتاح تفتحه يقربك من الجهوي.',
  locked: 'أكمل المحطة السابقة أولاً، ثم تابع طريقك.',
  finish: 'لقد بدأت الرحلة فعلاً. احمل شارتك وعد إلى بوابة الجهوي.'
};

const STATION_ORDER = ['station1', 'station2', 'station3'];
const STORAGE_KEY = 'jihawiExplorationV1';
const CHEST_XP = 150;
const CHEST_BADGE = 'شارة المستكشف';

/* ============ الحالة (localStorage) ============ */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { completedStations: [], badges: [], xp: 0, chestOpened: false };
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
let state = loadState();

/* ============ عناصر DOM ============ */
const xpEl = document.getElementById('expXp');
const badgeCountEl = document.getElementById('expBadgeCount');
const ibnGuideText = document.getElementById('ibnGuideText');
const ibnGuideBubble = document.querySelector('.ibn-guide-bubble');
const stationModal = document.getElementById('stationModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const chestModal = document.getElementById('chestModal');
const chestArt = document.getElementById('chestArt');
const chestNode = document.getElementById('chestNode');
const retryBtn = document.getElementById('retryBtn');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');

/* ============ واجهة عامة ============ */
function say(text, mood) {
  ibnGuideText.textContent = text;
  ibnGuideBubble.classList.remove('pulse');
  void ibnGuideBubble.offsetWidth;
  ibnGuideBubble.classList.add('pulse');
}

function updateHeaderStats() {
  xpEl.textContent = state.xp;
  badgeCountEl.textContent = state.badges.length;
}

function updateProgress() {
  const done = STATION_ORDER.filter(k => state.completedStations.includes(k)).length;
  progressFill.style.width = (done / STATION_ORDER.length * 100) + '%';
  progressLabel.textContent = `${done} / ${STATION_ORDER.length} محطات`;
}

function setNodeBadge(node, kind) {
  const icon = node.querySelector('.node-icon');
  let badge = icon.querySelector('.node-check, .node-lock');
  if (badge) badge.remove();
  if (kind === 'check') {
    badge = document.createElement('span');
    badge.className = 'node-check';
    badge.textContent = '✔';
    icon.appendChild(badge);
  } else if (kind === 'lock') {
    badge = document.createElement('span');
    badge.className = 'node-lock';
    badge.textContent = '🔒';
    icon.appendChild(badge);
  }
}

function isUnlocked(stationKey) {
  const idx = STATION_ORDER.indexOf(stationKey);
  if (idx === 0) return true;
  return state.completedStations.includes(STATION_ORDER[idx - 1]);
}

function updateNodeStates() {
  STATION_ORDER.forEach(key => {
    const node = document.getElementById('node-' + key);
    const completed = state.completedStations.includes(key);
    const unlocked = isUnlocked(key);
    node.classList.toggle('completed', completed);
    node.classList.toggle('locked', !unlocked && !completed);
    node.classList.toggle('unlocked', unlocked && !completed);
    setNodeBadge(node, completed ? 'check' : (!unlocked ? 'lock' : 'none'));
  });
  const allDone = STATION_ORDER.every(k => state.completedStations.includes(k));
  chestNode.classList.toggle('locked', !allDone && !state.chestOpened);
  chestNode.classList.toggle('unlocked', allDone && !state.chestOpened);
  chestNode.classList.toggle('opened', state.chestOpened);
  setNodeBadge(chestNode, state.chestOpened ? 'check' : (!allDone ? 'lock' : 'none'));
  updateProgress();
}

function shakeNode(node) {
  node.classList.remove('shake');
  void node.offsetWidth;
  node.classList.add('shake');
}
function shakeElement(el) {
  el.classList.remove('shake-basic');
  void el.offsetWidth;
  el.classList.add('shake-basic');
}

/* ============ نوافذ منبثقة ============ */
function openModal(overlay) {
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('show'));
}
function closeModal(overlay) {
  overlay.classList.remove('show');
  setTimeout(() => { overlay.hidden = true; }, 250);
}
modalClose.addEventListener('click', () => closeModal(stationModal));
stationModal.addEventListener('click', e => { if (e.target === stationModal) closeModal(stationModal); });
retryBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

/* ============ محطة: صندوق الزمن (ترتيب زمني) ============ */
function renderTimeline(stationKey) {
  const data = EXPLORATION_DATA[stationKey];
  const shuffled = [...data.events].sort(() => Math.random() - 0.5);

  modalBody.innerHTML = `
    <h3>${data.title}</h3>
    <p class="modal-instructions">${data.instructions}</p>
    <ul class="tl-list" id="tlList"></ul>
    <div class="modal-actions">
      <button class="btn primary" id="tlCheck">تحقق من الترتيب</button>
    </div>
    <div class="modal-feedback" id="tlFeedback"></div>
  `;

  const list = document.getElementById('tlList');
  shuffled.forEach(ev => {
    const li = document.createElement('li');
    li.className = 'tl-card';
    li.dataset.id = ev.id;
    li.innerHTML = `
      <span class="tl-handle">⠿</span>
      <span class="tl-text">${ev.text}</span>
      <span class="tl-arrows">
        <button type="button" class="tl-up" aria-label="أعلى">▲</button>
        <button type="button" class="tl-down" aria-label="أسفل">▼</button>
      </span>
    `;
    list.appendChild(li);
    makeSortableCard(li, list);
    li.querySelector('.tl-up').addEventListener('click', () => {
      const prev = li.previousElementSibling;
      if (prev) list.insertBefore(li, prev);
    });
    li.querySelector('.tl-down').addEventListener('click', () => {
      const next = li.nextElementSibling;
      if (next) list.insertBefore(next, li);
    });
  });

  document.getElementById('tlCheck').addEventListener('click', () => {
    const order = [...list.querySelectorAll('.tl-card')].map(c => c.dataset.id);
    const correct = data.events.map(e => e.id);
    const isCorrect = order.every((id, i) => id === correct[i]);
    const feedback = document.getElementById('tlFeedback');
    if (isCorrect) {
      feedback.textContent = data.reward.successMessage;
      feedback.classList.add('success');
      completeStation(stationKey, feedback);
    } else {
      feedback.textContent = IBN_MESSAGES.error;
      feedback.classList.remove('success');
      say(IBN_MESSAGES.error);
      shakeElement(list);
    }
  });
}

function makeSortableCard(card, list) {
  let pointerId = null, startY = 0;
  card.addEventListener('pointerdown', e => {
    if (e.target.closest('.tl-arrows')) return;
    pointerId = e.pointerId;
    startY = e.clientY;
    card.setPointerCapture(pointerId);
    card.classList.add('dragging');
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
      if (dy > 0 && cardMiddle > sibMiddle) {
        list.insertBefore(card, sib.nextSibling);
        startY = e.clientY;
        card.style.transform = '';
      } else if (dy < 0 && cardMiddle < sibMiddle) {
        list.insertBefore(card, sib);
        startY = e.clientY;
        card.style.transform = '';
      }
    }
  });
  function release(e) {
    if (e.pointerId !== pointerId) return;
    card.classList.remove('dragging');
    card.style.transform = '';
    pointerId = null;
  }
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
}

/* ============ محطة: سحب إلى خانات (خريطة الدليل / لغز المفاهيم) ============ */
function renderDragzone(stationKey) {
  const data = EXPLORATION_DATA[stationKey];
  const shuffled = [...data.items].sort(() => Math.random() - 0.5);

  modalBody.innerHTML = `
    <h3>${data.title}</h3>
    <p class="modal-instructions">${data.instructions}</p>
    <div class="dz-zones" id="dzZones"></div>
    <div class="dz-pool" id="dzPool"></div>
    <div class="modal-actions">
      <button class="btn primary" id="dzCheck">تحقق</button>
    </div>
    <div class="modal-feedback" id="dzFeedback"></div>
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
    const feedback = document.getElementById('dzFeedback');
    const poolChips = pool.querySelectorAll('.dz-chip');
    if (poolChips.length > 0) {
      feedback.textContent = 'ضع كل البطاقات داخل الخانات أولاً.';
      feedback.classList.remove('success');
      say(IBN_MESSAGES.error);
      shakeElement(pool);
      return;
    }
    const allChips = zonesEl.querySelectorAll('.dz-chip');
    let allCorrect = true;
    allChips.forEach(chip => {
      const zoneEl = chip.closest('.dz-zone');
      const correct = chip.dataset.correctZone === zoneEl.dataset.zone;
      chip.classList.remove('wrong', 'correct');
      if (correct) {
        chip.classList.add('correct');
      } else {
        allCorrect = false;
        chip.classList.add('wrong');
        setTimeout(() => { pool.appendChild(chip); chip.classList.remove('wrong'); }, 450);
      }
    });
    if (allCorrect) {
      feedback.textContent = data.reward.successMessage;
      feedback.classList.add('success');
      completeStation(stationKey, feedback);
    } else {
      feedback.textContent = IBN_MESSAGES.error;
      feedback.classList.remove('success');
      say(IBN_MESSAGES.error);
    }
  });
}

function makeDraggableChip(chip, pool) {
  chip.addEventListener('pointerdown', e => {
    e.preventDefault();
    const rect = chip.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    chip.setPointerCapture(e.pointerId);
    chip.classList.add('dragging');
    chip.style.position = 'fixed';
    chip.style.width = rect.width + 'px';
    chip.style.left = rect.left + 'px';
    chip.style.top = rect.top + 'px';
    chip.style.zIndex = 1500;

    function move(ev) {
      chip.style.left = (ev.clientX - offsetX) + 'px';
      chip.style.top = (ev.clientY - offsetY) + 'px';
    }
    function up(ev) {
      chip.removeEventListener('pointermove', move);
      chip.removeEventListener('pointerup', up);
      chip.removeEventListener('pointercancel', up);
      chip.classList.remove('dragging');
      chip.style.position = '';
      chip.style.left = '';
      chip.style.top = '';
      chip.style.width = '';
      chip.style.zIndex = '';
      const dropEl = document.elementFromPoint(ev.clientX, ev.clientY);
      const zoneEl = dropEl && dropEl.closest('.dz-zone');
      if (zoneEl) {
        zoneEl.querySelector('.dz-zone-body').appendChild(chip);
      } else {
        pool.appendChild(chip);
      }
    }
    chip.addEventListener('pointermove', move);
    chip.addEventListener('pointerup', up);
    chip.addEventListener('pointercancel', up);
  });
}

/* ============ إتمام محطة ============ */
function completeStation(stationKey, feedbackEl) {
  say(IBN_MESSAGES.success);
  const node = document.getElementById('node-' + stationKey);
  node.classList.add('gold-flash');
  spawnBurst(feedbackEl, 14);
  const modalCard = document.getElementById('modalCard');
  modalCard.classList.remove('success-glow');
  void modalCard.offsetWidth;
  modalCard.classList.add('success-glow');

  if (!state.completedStations.includes(stationKey)) {
    const reward = EXPLORATION_DATA[stationKey].reward;
    state.completedStations.push(stationKey);
    state.xp += reward.xp;
    if (!state.badges.includes(reward.badge)) state.badges.push(reward.badge);
    saveState();
    updateHeaderStats();
  }
  updateNodeStates();

  const allDone = STATION_ORDER.every(k => state.completedStations.includes(k));
  setTimeout(() => {
    closeModal(stationModal);
    if (allDone) say(IBN_MESSAGES.finish);
  }, 1400);
}

/* ============ فتح المحطات ============ */
STATION_ORDER.forEach(key => {
  const node = document.getElementById('node-' + key);
  node.addEventListener('click', () => {
    if (!isUnlocked(key)) {
      shakeNode(node);
      say(IBN_MESSAGES.locked);
      return;
    }
    say(IBN_MESSAGES.enter);
    const data = EXPLORATION_DATA[key];
    if (data.type === 'timeline') renderTimeline(key);
    else renderDragzone(key);
    openModal(stationModal);
  });
});

/* ============ صندوق المكافأة ============ */
function spawnBurst(originEl, count) {
  count = count || 22;
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'burst-particle';
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 90;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--by', Math.sin(angle) * dist + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 850);
  }
}

chestNode.addEventListener('click', () => {
  const allDone = STATION_ORDER.every(k => state.completedStations.includes(k));
  if (!allDone) {
    shakeNode(chestNode);
    say('أكمل المحطات الثلاث أولاً، ثم عد لتفتح الصندوق.');
    return;
  }
  if (!state.chestOpened) {
    state.chestOpened = true;
    state.xp += CHEST_XP;
    if (!state.badges.includes(CHEST_BADGE)) state.badges.push(CHEST_BADGE);
    saveState();
    updateHeaderStats();
    updateNodeStates();
  }
  spawnBurst(chestNode);
  chestArt.classList.remove('pop');
  void chestArt.offsetWidth;
  chestArt.classList.add('pop');
  say(IBN_MESSAGES.finish);
  openModal(chestModal);
});

/* ============ بدء التشغيل ============ */
updateHeaderStats();
updateNodeStates();
say(IBN_MESSAGES.enter);
