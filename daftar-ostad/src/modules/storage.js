import { state, KEYS } from '../state.js';

// Callbacks set by main.js to avoid circular imports
let _applyPresetFn = null;
let _renderFn = null;

export function initStorage(applyPresetFn, renderFn){
  _applyPresetFn = applyPresetFn;
  _renderFn = renderFn;
}

export function save(){
  localStorage.setItem(KEYS.LS, JSON.stringify(state.data));
}

export function load(){
  try { state.data = JSON.parse(localStorage.getItem(KEYS.LS) || '[]'); }
  catch { state.data = []; }
  if(!state.data.length && _applyPresetFn) _applyPresetFn('3ac_social', false);
}

export function saveMeta(){
  const teacher = document.getElementById('teacher');
  const school  = document.getElementById('school');
  const year    = document.getElementById('year');
  const classe  = document.getElementById('classe');
  const level   = document.getElementById('level');
  const subject = document.getElementById('subject');
  localStorage.setItem(KEYS.LM, JSON.stringify({
    teacher: teacher ? teacher.value : '',
    school:  school  ? school.value  : '',
    year:    year    ? year.value    : '',
    classe:  classe  ? classe.value  : '',
    level:   level   ? level.value   : '',
    subject: subject ? subject.value : '',
    dir:     document.documentElement.dir
  }));
}

export function loadMeta(){
  try {
    const m = JSON.parse(localStorage.getItem(KEYS.LM) || '{}');
    ['teacher','school','year','classe','level','subject'].forEach(k => {
      const el = document.getElementById(k);
      if(m[k] && el) el.value = m[k];
    });
    if(m.dir) document.documentElement.dir = m.dir;
  } catch {}
}

export function saveDocs(){
  localStorage.setItem(KEYS.LD, JSON.stringify(state.docs));
}

export function loadDocs(){
  try { state.docs = JSON.parse(localStorage.getItem(KEYS.LD) || '[]'); }
  catch { state.docs = []; }
}
