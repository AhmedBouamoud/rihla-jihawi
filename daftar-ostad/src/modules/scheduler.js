import { state } from '../state.js';
import { isHoliday } from './holidays.js';

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

export function selectedWeekdays(){
  return Array.from(document.querySelectorAll('.wd')).filter(x=>x.checked).map(x=>Number(x.value));
}

export function availableDates(){
  const schStart = document.getElementById('schStart');
  const schEnd   = document.getElementById('schEnd');
  const out = [];
  const start = schStart ? schStart.value : '';
  const end   = schEnd   ? schEnd.value   : '';
  const days  = selectedWeekdays();
  if(!start || !end || !days.length) return out;
  let d = new Date(start+'T00:00:00');
  const last = new Date(end+'T00:00:00');
  let guard = 0;
  while(d <= last && guard < 430){
    const iso = d.toISOString().slice(0,10);
    if(days.includes(d.getDay()) && !isHoliday(iso)) out.push(iso);
    d.setDate(d.getDate()+1);
    guard++;
  }
  return out;
}

export function targetSessions(){
  const schPeriod = document.getElementById('schPeriod');
  const schMode   = document.getElementById('schMode');
  const periodVal = schPeriod ? schPeriod.value : 'all';
  const modeVal   = schMode   ? schMode.value   : 'empty';
  const arr = [];
  state.data
    .filter(u => periodVal==='all' || u.period===periodVal)
    .forEach(u => u.lessons.forEach(l => l.sessions.forEach(s => {
      if(modeVal==='replace' || !s.date) arr.push({u,l,s});
    })));
  return arr;
}

function schedulePreview(apply, saveFn, renderFn){
  const schClass  = document.getElementById('schClass');
  const classeEl  = document.getElementById('classe');
  const schOut    = document.getElementById('schOut');
  const ds = availableDates();
  const ts = targetSessions();
  const cls = (schClass ? schClass.value : '') || (classeEl ? classeEl.value : '');
  const lines = [];
  let i = 0, n = 0;
  for(const item of ts){
    if(i >= ds.length) break;
    lines.push(`${ds[i]} — ${item.l.title} | ${item.s.label}`);
    if(apply){
      item.s.date = ds[i];
      if(cls && !item.s.classe) item.s.classe = cls;
      n++;
    }
    i++;
  }
  if(schOut) schOut.innerHTML =
    `<b>تواريخ متاحة:</b> ${ds.length}<br><b>حصص مستهدفة:</b> ${ts.length}<br>`+
    (ts.length>ds.length ? '<b style="color:#991b1b">تنبيه: التواريخ لا تكفي لكل الحصص.</b>' : '')+
    '<hr>'+(lines.length ? lines.map(x=>`<div>${x}</div>`).join('') : 'لا توجد تواريخ.');
  if(apply){ saveFn(); renderFn(); alert('تم توزيع '+n+' تاريخاً.'); }
}

export function previewSchedule(saveFn, renderFn){ schedulePreview(false, saveFn, renderFn); }
export function applySchedule(saveFn, renderFn){ schedulePreview(true, saveFn, renderFn); }

export function clearDates(saveFn, renderFn){
  const schPeriod = document.getElementById('schPeriod');
  const schOut    = document.getElementById('schOut');
  if(!confirm('مسح كل تواريخ الفترة المحددة؟')) return;
  const periodVal = schPeriod ? schPeriod.value : 'all';
  let n = 0;
  state.data
    .filter(u => periodVal==='all' || u.period===periodVal)
    .forEach(u => u.lessons.forEach(l => l.sessions.forEach(s => { s.date=''; n++; })));
  saveFn(); renderFn();
  if(schOut) schOut.innerHTML = 'تم مسح '+n+' تاريخاً.';
}
