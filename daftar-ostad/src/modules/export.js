import { state, KEYS } from '../state.js';
import { esc } from '../utils.js';
import { isHoliday } from './holidays.js';
import { loadMeta } from './storage.js';
import { coverPage } from './print.js';

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

export function exportDaftarToWord(headerFn){
  const table = document.getElementById('journalTableWrap');
  if(!table){ console.error('Target printable element not found'); return; }
  headerFn();
  const printHeader = document.getElementById('printHeader');
  const classeEl = document.getElementById('classe');
  const filename = 'دفتر_النصوص_الذكي' + (classeEl && classeEl.value.trim() ? '_' + classeEl.value.trim() : '');

  const htmlDocument = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'>
    <head>
      <meta charset='utf-8'>
      <title>دفتر النصوص</title>
      <style>
        body{font-family:'Arial','Traditional Arabic',sans-serif;direction:rtl;text-align:right;padding:20px;color:#1a202c}
        .cover-page{text-align:center;padding:40px 20px;page-break-after:always}
        .cover-logo{font-size:12px;color:#888;margin-bottom:40px}
        .cover-title{font-size:28px;font-weight:900;color:#1b3535;border-bottom:3px solid #1b3535;padding-bottom:12px;margin-bottom:28px}
        .cover-table{width:100%;border-collapse:collapse;margin-top:20px}
        .cover-table td{border:1px solid #ccc;padding:10px 14px;font-size:14px}
        .cover-label{font-weight:800;background:#e6f7f5;color:#1b3535;width:35%}
        .print-header{font-weight:bold;font-size:13px;margin-bottom:14px;border:1px solid #aaa;padding:8px;text-align:center}
        table{border-collapse:collapse;width:100%;direction:rtl;margin-top:12px}
        th,td{border:1px solid #4a4a4a;padding:8px;text-align:right;font-size:12px;vertical-align:top}
        th{background-color:#1b3535;color:#ffffff;font-weight:bold}
        tr.unit td{background:#1b3535!important;color:#fff!important;font-weight:bold}
        tr.lesson td{background:#f0faf8!important}
        tr.holiday{display:none!important}
        .pill{border:1px solid #777;padding:2px 6px;border-radius:10px;font-size:11px}
        .print-value{display:block!important;white-space:pre-wrap}
        .screen,.screen-only{display:none!important}
      </style>
    </head>
    <body>
      ${coverPage()}
      ${printHeader ? printHeader.outerHTML : ''}
      ${table.outerHTML}
    </body>
    </html>
  `;

  const blob = new Blob(['﻿', htmlDocument], { type: 'application/msword;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);
  downloadLink.href = downloadUrl;
  downloadLink.download = `${filename}.doc`;
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
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
