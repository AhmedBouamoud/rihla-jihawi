import { state } from '../state.js';
import { uid, esc } from '../utils.js';
import { subjectCategories } from '../data/subject-templates.js';
import { saveDocs } from './storage.js';

export function fillDocCats(){
  const subjectEl  = document.getElementById('subject');
  const docCat     = document.getElementById('docCat');
  const docFilter  = document.getElementById('docFilter');
  const s = subjectEl ? subjectEl.value : '';
  const cats = subjectCategories(s);
  if(docCat) docCat.innerHTML = cats.map(c=>`<option>${esc(c)}</option>`).join('');
  if(docFilter) docFilter.innerHTML =
    '<option value="all">كل الأصناف</option>'+
    cats.concat([...new Set(state.docs.map(d=>d.cat))].filter(c=>!cats.includes(c)))
      .map(c=>`<option>${esc(c)}</option>`).join('');
}

export function addDoc(){
  const docTitle = document.getElementById('docTitle');
  const docCat   = document.getElementById('docCat');
  const docLink  = document.getElementById('docLink');
  const docTags  = document.getElementById('docTags');
  const subject  = document.getElementById('subject');
  const level    = document.getElementById('level');
  if(!docTitle || !docTitle.value.trim()) return alert('أدخل عنوان الوثيقة');
  state.docs.push({
    id:      uid(),
    title:   docTitle.value,
    cat:     docCat   ? docCat.value   : '',
    link:    docLink  ? docLink.value  : '',
    tags:    docTags  ? docTags.value  : '',
    subject: subject  ? subject.value  : '',
    level:   level    ? level.value    : '',
    date:    new Date().toISOString().slice(0,10)
  });
  if(docTitle) docTitle.value = '';
  if(docLink)  docLink.value  = '';
  if(docTags)  docTags.value  = '';
  saveDocs();
  if(typeof window.stats === 'function') window.stats();
  renderDocs();
}

export function renderDocs(){
  const docSearch = document.getElementById('docSearch');
  const docFilter = document.getElementById('docFilter');
  const docList   = document.getElementById('docList');
  const q = docSearch ? docSearch.value.trim() : '';
  const f = docFilter ? docFilter.value : 'all';
  const arr = state.docs.filter(d =>
    (f==='all' || d.cat===f) &&
    (!q || (d.title+d.cat+d.tags+d.link).includes(q))
  );
  if(docList) docList.innerHTML = arr.map(d =>
    `<div class="library-item"><b>${esc(d.title)}</b> <span class="badge">${esc(d.cat)}</span><span class="badge">${esc(d.subject)}</span><div class="muted">${esc(d.link)}</div><div>${(d.tags||'').split(',').filter(Boolean).map(t=>`<span class="badge">${esc(t.trim())}</span>`).join('')}</div><button class="small r" onclick="window._delDoc('${d.id}')">حذف</button></div>`
  ).join('') || '<div class="muted">لا توجد وثائق.</div>';
}

export function delDoc(docId){
  state.docs = state.docs.filter(x=>x.id!==docId);
  saveDocs();
  if(typeof window.stats === 'function') window.stats();
  renderDocs();
}
