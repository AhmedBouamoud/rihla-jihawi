import { state, KEYS } from '../state.js';
import { esc } from '../utils.js';
import { isHoliday } from './holidays.js';
import { loadMeta } from './storage.js';

function download(name, text, type='text/plain'){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text],{type}));
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadBackup(){
  download(
    'daftar-ostad-v4-backup.json',
    JSON.stringify({
      meta:     JSON.parse(localStorage.getItem(KEYS.LM)||'{}'),
      data:     state.data,
      holidays: JSON.parse(localStorage.getItem(KEYS.LH)||'{}'),
      docs:     state.docs
    }, null, 2),
    'application/json'
  );
}

export function importBackupFile(file, renderFn, renderDocsFn){
  if(!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const p = JSON.parse(r.result);
      state.data = p.data || state.data;
      if(p.meta) localStorage.setItem(KEYS.LM, JSON.stringify(p.meta));
      if(p.holidays) localStorage.setItem(KEYS.LH, JSON.stringify(p.holidays));
      state.docs = p.docs || state.docs;
      localStorage.setItem(KEYS.LD, JSON.stringify(state.docs));
      localStorage.setItem(KEYS.LS, JSON.stringify(state.data));
      loadMeta();
      // reload holidays inline
      const { loadHolidays } = window._holidaysModule || {};
      if(loadHolidays) loadHolidays();
      renderFn();
      renderDocsFn();
      alert('تم الاستيراد.');
    } catch { alert('ملف غير صالح'); }
  };
  r.readAsText(file);
}

export function rows(){
  const arr = [];
  const classeEl = document.getElementById('classe');
  const classeVal = classeEl ? classeEl.value : '';
  state.data.forEach(u => u.lessons.forEach(l => l.sessions.forEach(s => {
    if(!isHoliday(s.date)) arr.push([
      s.date, s.classe||classeVal, u.title, u.period,
      l.title, s.label, s.type,
      s.elements.map(x=>x.text).join(' | '),
      s.activities, s.homework, s.note
    ]);
  })));
  return arr;
}

function csv(arr){
  return arr.map(r => r.map(x=>`"${String(x??'').replaceAll('"','""')}"`).join(',')).join('\n');
}

export function downloadJournalCSV(){
  download('daftar-journal.csv',
    csv([['date','class','unit','period','lesson','session','type','elements','activities','homework','note'],...rows()]),
    'text/csv'
  );
}

export function downloadDocsCSV(){
  download('daftar-docs.csv',
    csv([['title','category','subject','level','tags','link','date'],
         ...state.docs.map(d=>[d.title,d.cat,d.subject,d.level,d.tags,d.link,d.date])]),
    'text/csv'
  );
}

export function downloadReportHTML(){
  const schoolEl  = document.getElementById('school');
  const teacherEl = document.getElementById('teacher');
  const subjectEl = document.getElementById('subject');
  const levelEl   = document.getElementById('level');
  const body = rows().map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
  download(
    'daftar-report.html',
    `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>تقرير دفتر النصوص</title><style>body{font-family:Tahoma}table{width:100%;border-collapse:collapse}td,th{border:1px solid #999;padding:5px;font-size:12px}th{background:#1e3a8a;color:white}</style><h1>تقرير دفتر النصوص</h1><p>${esc(schoolEl?schoolEl.value:'')} | ${esc(teacherEl?teacherEl.value:'')} | ${esc(subjectEl?subjectEl.value:'')} | ${esc(levelEl?levelEl.value:'')}</p><table><thead><tr><th>التاريخ</th><th>القسم</th><th>الوحدة</th><th>الفترة</th><th>الدرس</th><th>الحصة</th><th>النوع</th><th>العناصر</th><th>الأنشطة</th><th>العمل</th><th>ملاحظات</th></tr></thead><tbody>${body}</tbody></table></html>`,
    'text/html'
  );
}
