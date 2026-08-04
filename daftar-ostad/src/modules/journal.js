import { state, ORD, LET } from '../state.js';
import { uid, esc } from '../utils.js';
import { templateElements, defaultActivities } from '../data/subject-templates.js';
import { PRESETS } from '../data/presets.js';

// --- finders ---
export function findLesson(idv){ for(const u of state.data) for(const l of u.lessons) if(l.id===idv) return {u,l}; return null; }
export function findSession(idv){ for(const u of state.data) for(const l of u.lessons) for(const s of l.sessions) if(s.id===idv) return {u,l,s}; return null; }
export function findEl(idv){ for(const u of state.data) for(const l of u.lessons) for(const s of l.sessions) for(const x of s.elements) if(x.id===idv) return {u,l,s,x}; return null; }

function getSubject(){ const el = document.getElementById('subject'); return el ? el.value : ''; }
function typeLabel(k){ return {normal:'درس عادي',exercise:'تطبيقات / تمارين',support:'دعم ومعالجة',exam:'فرض / تقويم',correction:'تصحيح',project:'مشروع'}[k]||'درس عادي'; }

export function makeSession(label, kind, title){
  const s = getSubject();
  return {
    id: uid(),
    date: '',
    classe: '',
    kind: kind||'normal',
    type: typeLabel(kind||'normal'),
    label: label||'الحصة 1',
    elements: templateElements(title||'درس', s),
    activities: defaultActivities(kind, s),
    component: '',
    concepts: '',
    homework: '',
    note: ''
  };
}

export function addLesson(unitId, saveFn, renderFn){
  const u = state.data.find(x=>x.id===unitId);
  if(!u) return;
  const t = prompt('عنوان الدرس');
  if(!t) return;
  u.lessons.push({ id:uid(), title:t, sessions:[makeSession('الحصة 1','normal',t)] });
  saveFn(); renderFn();
}

export function addSession(lessonId, kind, saveFn, renderFn){
  const f = findLesson(lessonId);
  if(!f) return;
  f.l.sessions.push(makeSession('الحصة '+(f.l.sessions.length+1), kind, f.l.title));
  saveFn(); renderFn();
}

export function copySession(sid, saveFn, renderFn){
  const f = findSession(sid);
  if(!f) return;
  const c = JSON.parse(JSON.stringify(f.s));
  c.id = uid();
  c.date = '';
  c.elements = c.elements.map(x=>({...x, id:uid()}));
  c.label += ' نسخة';
  f.l.sessions.push(c);
  saveFn(); renderFn();
}

export function delSession(sid, saveFn, renderFn){
  const f = findSession(sid);
  if(!f) return;
  if(f.l.sessions.length < 2) return alert('لا يمكن حذف كل الحصص');
  if(confirm('حذف الحصة؟')){
    f.l.sessions = f.l.sessions.filter(x=>x.id!==sid);
    saveFn(); renderFn();
  }
}

export function updS(sid, k, v, isHolidayFn, saveFn, renderFn){
  const f = findSession(sid);
  if(!f) return;
  if(k==='date' && isHolidayFn(v)) alert('هذا التاريخ يوافق عطلة ولن يظهر في الطباعة.');
  f.s[k] = v;
  saveFn(); renderFn();
}

export function updU(unitId, k, v, saveFn, renderFn){
  const u = state.data.find(x=>x.id===unitId);
  if(!u) return;
  u[k] = v;
  saveFn(); renderFn();
}

export function updEl(eid, k, v, saveFn){
  const f = findEl(eid);
  if(!f) return;
  f.x[k] = v;
  saveFn();
}

export function addEl(sid, level, saveFn, renderFn){
  const f = findSession(sid);
  if(!f) return;
  f.s.elements.push({ id:uid(), level, text: level==='major'?'محور جديد':level==='minor'?'عنصر جديد':'تفريع جديد' });
  saveFn(); renderFn();
}

export function delEl(eid, saveFn, renderFn){
  const f = findEl(eid);
  if(!f) return;
  if(f.s.elements.length < 2) return alert('اترك عنصراً واحداً على الأقل');
  f.s.elements = f.s.elements.filter(x=>x.id!==eid);
  saveFn(); renderFn();
}

export function applyPreset(pid, append, saveFn, renderFn, tabFn){
  const p = PRESETS.find(x=>x.id===pid);
  if(!p) return;
  document.documentElement.dir = p.dir || 'rtl';
  const levelEl   = document.getElementById('level');
  const subjectEl = document.getElementById('subject');
  if(levelEl)   levelEl.value   = p.level;
  if(subjectEl) subjectEl.value = p.subject;
  const units = p.units.map(u => ({
    id: uid(),
    period: u.period,
    title: u.title,
    weeks: u.weeksHint || '',
    lessons: u.lessons.map(l => ({
      id: uid(),
      title: l,
      sessions: Array.from({length: p.sessions||1}, (_,i) => makeSession('الحصة '+(i+1), i?'exercise':'normal', l))
    }))
  }));
  state.data = append ? state.data.concat(units) : units;
  saveFn(); renderFn(); tabFn('journal');
}

// --- Smart assistant ---
function getSubjectForSmart(){
  const el = document.getElementById('subject');
  return el ? el.value : '';
}

function splitClean(t){
  return (t||'').replaceAll('•','\n').replace(/[؛;]/g,'\n')
    .split(/\n+|(?<=\.)\s+|(?<=؟)\s+/)
    .map(x=>x.replace(/^[-–—*0-9٠-٩\.\)\( ]+/,'').trim())
    .filter(Boolean);
}

function smartAnalyze(t){
  const s = getSubjectForSmart();
  let lines = splitClean(t);
  if(!lines.length) lines = ['تحديد أهداف الحصة','بناء التعلمات الأساسية','إنجاز نشاط تطبيقي','تقويم وخلاصة'];
  const { isMath, isSocial, isPC, isLang } = {
    isMath:   /رياض|math/i.test(s),
    isSocial: /اجتماع|تاريخ|جغراف/i.test(s),
    isPC:     /فيزياء|كيمياء|phys|chim/i.test(s),
    isLang:   /عربية|français|french|english|لغة/i.test(s)
  };
  const axes = isMath    ? ['تعريف وخاصية','أمثلة وتطبيقات','تمارين وتقويم']
             : isSocial  ? ['قراءة الوثائق والمفاهيم','تحليل المعطيات','تركيب وتقويم']
             : isPC      ? ['تجربة وملاحظة','استنتاج وقانون','تطبيق وسلامة']
             : isLang    ? ['قراءة وفهم','لغة وإنتاج','تقويم']
             :             ['بناء التعلمات','تطبيقات','تقويم'];
  const out = [];
  lines.forEach((x,i) => {
    if(i%3===0) out.push({ id:uid(), level:'major', text: axes[Math.floor(i/3)]||'محور إضافي' });
    out.push({ id:uid(), level: i%3===0?'minor':'letter', text: x });
  });
  return out;
}

function splitPlan(elems, n){
  n = Number(n)||2;
  const g = [], cur = [];
  elems.forEach(x => { if(x.level==='major' && cur.length){ g.push([...cur]); cur.length=0; } cur.push(x); });
  if(cur.length) g.push(cur);
  const b = Array.from({length:n}, ()=>[]);
  g.forEach((x,i) => b[Math.min(n-1,Math.floor(i*n/g.length))].push(...x));
  return b.map((x,i) => x.length ? x : [
    {id:uid(), level:'major', text: i===n-1?'تقويم وخلاصة':'أنشطة تطبيقية'},
    {id:uid(), level:'minor', text: 'استثمار التعلمات.'}
  ]);
}

export function previewSmart(){
  const smartText  = document.getElementById('smartText');
  const smartCount = document.getElementById('smartCount');
  const smartOut   = document.getElementById('smartOut');
  state.lastPlan = splitPlan(smartAnalyze(smartText ? smartText.value : ''), smartCount ? smartCount.value : 2);
  if(smartOut) smartOut.innerHTML = state.lastPlan.map((p,i) =>
    `<b>الحصة ${i+1}</b><br>`+p.map(x=>esc(x.text)).join('<br>')
  ).join('<hr>');
}

export function applySmart(saveFn, renderFn){
  const smartLesson = document.getElementById('smartLesson');
  const classeEl    = document.getElementById('classe');
  if(!state.lastPlan.length) previewSmart();
  const f = findLesson(smartLesson ? smartLesson.value : '');
  if(!f) return;
  while(f.l.sessions.length < state.lastPlan.length)
    f.l.sessions.push(makeSession('الحصة '+(f.l.sessions.length+1),'exercise',f.l.title));
  f.l.sessions.slice(0, state.lastPlan.length).forEach((s,i) => {
    s.label = 'الحصة '+(i+1);
    s.elements = state.lastPlan[i].map(x=>({ id:uid(), level:x.level, text:x.text }));
    if(classeEl && classeEl.value && !s.classe) s.classe = classeEl.value;
  });
  saveFn(); renderFn();
  alert('تم تطبيق التقسيم حسب المادة.');
}
