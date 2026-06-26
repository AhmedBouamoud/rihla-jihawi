import { state, ORD, LET } from '../state.js';
import { esc } from '../utils.js';
import { isHoliday } from './holidays.js';
import { findLesson } from './journal.js';

export function lab(level, c){
  if(level==='major'){ c.m++; c.n=0; c.l=0; return ORD[c.m-1]||c.m+'-'; }
  if(level==='minor'){ c.n++; c.l=0; return c.n+'-'; }
  c.l++;
  return LET[c.l-1]||c.l+'-';
}

function getMeta(id){ const el=document.getElementById(id); return el?el.value:''; }

function coverPage(){
  return `<div class="cover-page">
    <div class="cover-logo">دفتر الأستاذ الذكي V5</div>
    <div class="cover-title">دفتر النصوص</div>
    <table class="cover-table">
      <tr><td class="cover-label">الأستاذ(ة)</td><td class="cover-val">${esc(getMeta('teacher'))}</td></tr>
      <tr><td class="cover-label">المؤسسة</td><td class="cover-val">${esc(getMeta('school'))}</td></tr>
      <tr><td class="cover-label">الموسم الدراسي</td><td class="cover-val">${esc(getMeta('year'))}</td></tr>
      <tr><td class="cover-label">المادة</td><td class="cover-val">${esc(getMeta('subject'))}</td></tr>
      <tr><td class="cover-label">المستوى</td><td class="cover-val">${esc(getMeta('level'))}</td></tr>
      <tr><td class="cover-label">القسم</td><td class="cover-val">${esc(getMeta('classe')||'حسب الجدول')}</td></tr>
    </table>
  </div>`;
}

export function buildSingle(lid){
  const classeEl = document.getElementById('classe');
  const subjectEl = document.getElementById('subject');
  const singlePrint = document.getElementById('singlePrint');
  const f = findLesson(lid);
  if(!f || !singlePrint) return;
  let trs = '';
  f.l.sessions.filter(s => !isHoliday(s.date)).forEach(s => {
    const c = {m:0, n:0, l:0};
    const es = s.elements.map(x =>
      `<div style="${x.level==='major'?'font-weight:bold;margin-top:3px':x.level==='minor'?'margin-right:12px':'margin-right:26px'}">${esc(lab(x.level,c))} ${esc(x.text)}</div>`
    ).join('');
    trs += `<tr><td>${esc(s.date)}</td><td>${esc(s.classe||(classeEl?classeEl.value:''))}</td><td>${esc(s.label)}</td><td>${esc(s.type)}</td><td>${es}</td><td>${esc(s.activities)}</td><td>${esc(s.homework)}</td><td>${esc(s.note)}</td></tr>`;
  });
  singlePrint.innerHTML =
    coverPage() +
    `<div class="panel"><h2>${esc(f.l.title)}</h2><p>${esc(f.u.period)} | ${esc(f.u.title)} | ${esc(subjectEl?subjectEl.value:'')}</p><table><thead><tr><th>التاريخ</th><th>القسم</th><th>الحصة</th><th>النوع</th><th>العناصر</th><th>الأنشطة</th><th>العمل</th><th>ملاحظات</th></tr></thead><tbody>${trs||'<tr><td colspan="8">لا توجد حصص قابلة للطباعة.</td></tr>'}</tbody></table></div>`;
}

export function printOne(headerFn){
  const oneSelect = document.getElementById('oneSelect');
  document.body.classList.add('single-mode');
  buildSingle(oneSelect ? oneSelect.value : '');
  headerFn();
  setTimeout(()=>print(), 80);
}

export function printAll(headerFn){
  document.body.classList.remove('single-mode');
  const cover = document.getElementById('printCover');
  if(cover) cover.innerHTML = coverPage();
  headerFn();
  setTimeout(()=>print(), 60);
}
