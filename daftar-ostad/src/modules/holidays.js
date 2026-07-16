import { state, KEYS } from '../state.js';
import { uid, esc } from '../utils.js';

export function addDay(d){
  const x = new Date(d+'T00:00:00');
  x.setDate(x.getDate()+1);
  return x.toISOString().slice(0,10);
}

export function isHoliday(d){ return d && state.holidays[d]; }

// --- migration from the old free-text holidays box (pre-structured-table) ---
function parseLegacyDate(s){
  let m = s.match(/(20\d{2})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
  if(m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
  m = s.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](20\d{2})/);
  if(m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  return '';
}

function migrateLegacyText(text){
  const periods = [];
  (text||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(line => {
    const parts = line.split(/\s*(?:إلى|الى|to|->|→|\.\.)\s*/);
    const a = parseLegacyDate(parts[0]), b = parts[1] ? parseLegacyDate(parts[1]) : '';
    const label = line.replace(/(20\d{2}[-\/.]\d{1,2}[-\/.]\d{1,2}|\d{1,2}[-\/.]\d{1,2}[-\/.]20\d{2}|إلى|الى|to|->|→|\.\.)/g,'').replace(/[-–—:]/g,' ').trim() || 'عطلة';
    if(a) periods.push({ id: uid(), label, start: a, end: b || a });
  });
  return periods;
}

function rebuildHolidayMap(){
  state.holidays = {};
  state.holidayPeriods.forEach(p => {
    if(!p.start) return;
    const end = p.end || p.start;
    let cur = p.start, guard = 0;
    while(cur && cur <= end && guard < 200){
      state.holidays[cur] = p.label || 'عطلة';
      cur = addDay(cur);
      guard++;
    }
  });
}

function persistHolidays(){
  rebuildHolidayMap();
  localStorage.setItem(KEYS.LH, JSON.stringify({ periods: state.holidayPeriods, holidays: state.holidays }));
}

export function loadHolidays(){
  state.holidayPeriods = [];
  state.holidays = {};
  try {
    const h = JSON.parse(localStorage.getItem(KEYS.LH) || '{}');
    if(Array.isArray(h.periods)){
      state.holidayPeriods = h.periods;
      state.holidays = h.holidays || {};
    } else if(h.text){
      // one-time migration from the old free-text format
      state.holidayPeriods = migrateLegacyText(h.text);
      persistHolidays();
    }
  } catch { /* keep defaults */ }
  renderHolidays();
}

export function renderHolidays(){
  const list = document.getElementById('holidayList');
  if(!list) return;
  list.innerHTML = state.holidayPeriods.length
    ? state.holidayPeriods.map(p =>
        `<div class="library-item"><b>${esc(p.label)}</b> <span class="badge">${esc(p.start)} → ${esc(p.end)}</span><button class="small r" onclick="window._delHoliday('${p.id}')">حذف</button></div>`
      ).join('')
    : '<div class="muted">لا توجد عطل مضافة بعد لهذا الموسم.</div>';
}

export function addHolidayPeriod(){
  const labelEl = document.getElementById('holLabel');
  const startEl = document.getElementById('holStart');
  const endEl   = document.getElementById('holEnd');
  const start = startEl ? startEl.value : '';
  if(!start){ alert('أدخل تاريخ البداية على الأقل.'); return; }
  const end = (endEl && endEl.value) || start;
  if(end < start){ alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية أو مساوياً له.'); return; }
  state.holidayPeriods.push({
    id: uid(),
    label: (labelEl && labelEl.value.trim()) || 'عطلة',
    start, end
  });
  persistHolidays();
  renderHolidays();
  scanHolidays();
  if(labelEl) labelEl.value = '';
  if(startEl) startEl.value = '';
  if(endEl)   endEl.value   = '';
}

export function delHolidayPeriod(id){
  state.holidayPeriods = state.holidayPeriods.filter(p => p.id !== id);
  persistHolidays();
  renderHolidays();
  scanHolidays();
}

export function scanHolidays(){
  const holOut = document.getElementById('holOut');
  if(!holOut) return;
  const found = [];
  state.data.forEach(u => u.lessons.forEach(l => l.sessions.forEach(s => {
    if(isHoliday(s.date)) found.push(`${s.date} — ${state.holidays[s.date]} | ${l.title} | ${s.label}`);
  })));
  holOut.innerHTML = found.length
    ? found.map(x=>`<div>${x}</div>`).join('<hr>')
    : 'لا توجد حصص موافقة للعطل.';
}

export function clearHolidaySessionDates(saveFn, renderFn){
  let n = 0;
  state.data.forEach(u => u.lessons.forEach(l => l.sessions.forEach(s => {
    if(isHoliday(s.date)){ s.date = ''; n++; }
  })));
  saveFn();
  renderFn();
  scanHolidays();
  alert('تم مسح '+n+' تاريخ عطلة من الحصص.');
}
