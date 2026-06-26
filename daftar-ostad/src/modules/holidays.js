import { state, KEYS } from '../state.js';

export function parseDate(s){
  let m = s.match(/(20\d{2})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
  if(m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
  m = s.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](20\d{2})/);
  if(m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  return '';
}

export function addDay(d){
  const x = new Date(d+'T00:00:00');
  x.setDate(x.getDate()+1);
  return x.toISOString().slice(0,10);
}

export function isHoliday(d){ return d && state.holidays[d]; }

export function saveHolidays(){
  const holText = document.getElementById('holText');
  state.holidays = {};
  (holText ? holText.value : '').split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(line => {
    const parts = line.split(/\s*(?:إلى|الى|to|->|→|\.\.)\s*/);
    const a = parseDate(parts[0]), b = parts[1] ? parseDate(parts[1]) : '';
    const label = line.replace(/(20\d{2}[-\/.]\d{1,2}[-\/.]\d{1,2}|\d{1,2}[-\/.]\d{1,2}[-\/.]20\d{2}|إلى|الى|to|->|→|\.\.)/g,'').replace(/[-–—:]/g,' ').trim() || 'عطلة';
    if(a){
      let cur = a, guard = 0;
      while(cur && (cur <= (b||a)) && guard < 140){
        state.holidays[cur] = label;
        cur = addDay(cur);
        guard++;
      }
    }
  });
  localStorage.setItem(KEYS.LH, JSON.stringify({ text: holText ? holText.value : '', holidays: state.holidays }));
  scanHolidays();
}

export function loadHolidays(){
  try {
    const h = JSON.parse(localStorage.getItem(KEYS.LH) || '{}');
    state.holidays = h.holidays || {};
    const holText = document.getElementById('holText');
    if(holText) holText.value = h.text || '';
  } catch { state.holidays = {}; }
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
