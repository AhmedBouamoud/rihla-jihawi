import { state } from './state.js';
import { uid, esc } from './utils.js';

// data
import { PRESETS } from './data/presets.js';

// storage
import { initStorage, save, load, saveMeta, loadMeta, saveDocs, loadDocs } from './modules/storage.js';

// holidays
import { saveHolidays, loadHolidays, isHoliday, scanHolidays, clearHolidaySessionDates } from './modules/holidays.js';

// render
import { tab, stats, header, fillSelectors, periodOptions, render, renderElements, renderPresets, renderSubjectMap, filters, init as renderInit } from './modules/render.js';

// journal
import {
  findLesson, findSession, findEl,
  makeSession, addLesson, addSession, copySession, delSession,
  updS, updEl, addEl, delEl,
  applyPreset as applyPresetFn,
  previewSmart, applySmart
} from './modules/journal.js';

// scheduler
import { previewSchedule, applySchedule, clearDates } from './modules/scheduler.js';

// documents
import { fillDocCats, addDoc, renderDocs, delDoc } from './modules/documents.js';

// export
import { downloadBackup, importBackupFile, downloadJournalCSV, downloadDocsCSV, downloadReportHTML } from './modules/export.js';

// print
import { printOne as printOneFn, printAll as printAllFn } from './modules/print.js';

// ---- sidebar & greeting helpers ----
function updateSidebar(){
  const t  = document.getElementById('teacher');
  const s  = document.getElementById('school');
  const st = document.getElementById('sideTeacher');
  const ss = document.getElementById('sideSchool');
  const sa = document.getElementById('sideAvatar');
  if(st && t) st.textContent = t.value || 'الأستاذ';
  if(ss && s) ss.textContent = s.value || 'المؤسسة';
  if(sa && t) sa.textContent = (t.value||'أ')[0];
}

function updateGreeting(){
  const h = new Date().getHours();
  const gr = h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور';
  const name = document.getElementById('teacher')?.value || '';
  const el   = document.getElementById('greetingText');
  if(el) el.textContent = name ? `${gr}، ${name}` : `${gr} بك في دفترك`;
}

function updateCurriculumGuard(){
  const el = document.getElementById('curriculumGuard');
  if(!el) return;
  if(!state.data.length){
    el.innerHTML = '<p class="guard-empty">اختر مقررًا من تبويب المقررات لعرض تقدم التغطية.</p>';
    return;
  }
  el.innerHTML = state.data.map(u => {
    const total     = u.lessons.reduce((a,l)=>a+l.sessions.length,0);
    const scheduled = u.lessons.reduce((a,l)=>a+l.sessions.filter(s=>s.date).length,0);
    const pct = total ? Math.round(scheduled/total*100) : 0;
    return `<div class="guard-unit">
      <div class="guard-hdr"><span>${esc(u.title)}</span><span class="guard-pct">${pct}%</span></div>
      <div class="guard-track"><div class="guard-fill" style="width:${pct}%"></div></div>
      <div class="guard-detail">${scheduled}/${total} حصة موزّعة &nbsp;·&nbsp; ${u.lessons.length} درس</div>
    </div>`;
  }).join('');
}

function switchTab(name, btn){
  tab(name);
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
  const target = btn || document.querySelector(`.nav-item[data-tab="${name}"]`);
  if(target) target.classList.add('active');
  if(window.innerWidth <= 768) closeSidebar();
  if(name==='home'){ updateGreeting(); updateCurriculumGuard(); }
}

function openSidebar(){
  document.getElementById('mainSidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('open');
}
function closeSidebar(){
  document.getElementById('mainSidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}

// ---- dark mode ----
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('daftar_theme', theme);
  const isDark = theme === 'dark';
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const btn   = document.getElementById('themeToggle');
  if(icon)  icon.textContent  = isDark ? '☀️' : '🌙';
  if(label) label.textContent = isDark ? 'الوضع النهاري' : 'الوضع الليلي';
  if(btn)   btn.classList.toggle('active', isDark);
}
function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ---- wire callbacks ----
// storage needs applyPreset and render callbacks after initial load
initStorage(
  (pid, append) => applyPreset(pid, append),
  () => render()
);

// expose holidays module for importBackupFile
window._holidaysModule = { loadHolidays };

// expose delDoc for inline onclick in renderDocs
window._delDoc = (id) => delDoc(id);

// ---- public API wired to window ----

function applyPreset(pid, append=false){
  applyPresetFn(pid, append, () => { save(); saveMeta(); }, render, tab);
}

function _updS(sid, k, v){ updS(sid, k, v, isHoliday, save, render); }
function _updEl(eid, k, v){ updEl(eid, k, v, save); }
function _addEl(sid, level){ addEl(sid, level, save, render); }
function _delEl(eid){ delEl(eid, save, render); }
function _addLesson(uid){ addLesson(uid, save, render); }
function _addSession(lid, kind){ addSession(lid, kind, save, render); }
function _copySession(sid){ copySession(sid, save, render); }
function _delSession(sid){ delSession(sid, save, render); }
function _previewSchedule(){ previewSchedule(save, render); }
function _applySchedule(){ applySchedule(save, render); }
function _clearDates(){ clearDates(save, render); }
function _clearHolidaySessionDates(){ clearHolidaySessionDates(save, render); }
function _applySmart(){ applySmart(save, render); }
function _importBackupFile(file){ importBackupFile(file, render, renderDocs); }
function _printOne(){ printOneFn(header); }
function _printAll(){ printAllFn(header); }

function _saveMeta(){
  saveMeta();
  header();
  renderSubjectMap();
  fillDocCats();
  updateGreeting();
  updateSidebar();
}

// ---- expose all to window ----
Object.assign(window, {
  // navigation
  tab,
  // meta
  saveMeta:            _saveMeta,
  // presets
  applyPreset,
  renderPresets,
  renderSubjectMap,
  // journal / table
  updS:                _updS,
  updEl:               _updEl,
  addEl:               _addEl,
  delEl:               _delEl,
  addLesson:           _addLesson,
  addSession:          _addSession,
  copySession:         _copySession,
  delSession:          _delSession,
  // smart assistant
  previewSmart,
  applySmart:          _applySmart,
  // schedule
  previewSchedule:     _previewSchedule,
  applySchedule:       _applySchedule,
  clearDates:          _clearDates,
  // holidays
  saveHolidays,
  scanHolidays,
  clearHolidaySessionDates: _clearHolidaySessionDates,
  // docs
  addDoc,
  renderDocs,
  fillDocCats,
  // export
  downloadBackup,
  importBackupFile:    _importBackupFile,
  downloadJournalCSV,
  downloadDocsCSV,
  downloadReportHTML,
  // print
  printOne:            _printOne,
  printAll:            _printAll,
  // stats
  stats,
  // sidebar / UI
  switchTab,
  openSidebar,
  closeSidebar,
  updateSidebar,
  updateGreeting,
  updateCurriculumGuard,
  // theme
  toggleTheme,
  applyTheme,
});

// ---- init ----
function boot(){
  renderInit();   // fills preset filters
  loadMeta();
  loadHolidays();
  loadDocs();
  fillDocCats();
  load();         // loads data, calls applyPreset if empty
  render();
  renderDocs();
  renderSubjectMap();
  switchTab('home', null);
  updateSidebar();
  updateGreeting();
  updateCurriculumGuard();
  // sync toggle button state with already-applied theme (set by inline script in <head>)
  applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
}

// print events
window.addEventListener('beforeprint', () => {
  const classeEl = document.getElementById('classe');
  if(classeEl && classeEl.value){
    state.data.forEach(u => u.lessons.forEach(l => l.sessions.forEach(s => {
      if(!s.classe) s.classe = classeEl.value;
    })));
  }
  save();
  header();
});
window.addEventListener('afterprint', () => document.body.classList.remove('single-mode'));

// service worker
if('serviceWorker' in navigator){
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

boot();
