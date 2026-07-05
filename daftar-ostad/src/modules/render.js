import { state, ORD, LET } from '../state.js';
import { esc } from '../utils.js';
import { subjectCategories, isMath, isSocial, isPC, isSVT, isLang, isIslamic, isPhilosophy } from '../data/subject-templates.js';
import { PRESETS } from '../data/presets.js';
import { isHoliday } from './holidays.js';

// ---- helpers ----
export function lab(level, c){
  if(level==='major'){ c.m++; c.n=0; c.l=0; return ORD[c.m-1]||c.m+'-'; }
  if(level==='minor'){ c.n++; c.l=0; return c.n+'-'; }
  c.l++;
  return LET[c.l-1]||c.l+'-';
}

export function tab(t){
  document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));
  const el = document.getElementById('tab-'+t);
  if(el) el.classList.remove('hidden');
}

export function stats(){
  const classeEl = document.getElementById('classe');
  let u=state.data.length, l=0, s=0, el=0, scheduled=0;
  state.data.forEach(a=>a.lessons.forEach(b=>{ l++; b.sessions.forEach(c=>{ s++; el+=c.elements.length; if(c.date) scheduled++; }); }));
  const stU=document.getElementById('stU'); if(stU) stU.textContent=u;
  const stL=document.getElementById('stL'); if(stL) stL.textContent=l;
  const stS=document.getElementById('stS'); if(stS) stS.textContent=s;
  const stE=document.getElementById('stE'); if(stE) stE.textContent=el;
  const stD=document.getElementById('stD'); if(stD) stD.textContent=state.docs.length;
  const stC=document.getElementById('stC'); if(stC) stC.textContent=classeEl?classeEl.value||'—':'—';
  const pct = s>0 ? Math.round(scheduled/s*100) : 0;
  const bar = document.getElementById('progressBar');
  const pctEl = document.getElementById('progressPct');
  if(bar) bar.style.width = pct+'%';
  if(pctEl) pctEl.textContent = pct+'% موزّع زمنياً ('+scheduled+'/'+s+')';
}

export function header(){
  const printHeader = document.getElementById('printHeader');
  const schoolEl  = document.getElementById('school');
  const teacherEl = document.getElementById('teacher');
  const levelEl   = document.getElementById('level');
  const subjectEl = document.getElementById('subject');
  const classeEl  = document.getElementById('classe');
  if(printHeader) printHeader.innerHTML =
    `<strong>دفتر النصوص</strong> | ${esc(schoolEl?schoolEl.value:'')} | ${esc(teacherEl?teacherEl.value:'')} | ${esc(levelEl?levelEl.value:'')} | ${esc(subjectEl?subjectEl.value:'')} | القسم: ${esc(classeEl&&classeEl.value?classeEl.value:'حسب الجدول')} | ${esc(document.getElementById('year')?document.getElementById('year').value:'')}`;
}

export function fillSelectors(){
  const oneSelect   = document.getElementById('oneSelect');
  const smartLesson = document.getElementById('smartLesson');
  let opts = '';
  state.data.forEach(u => u.lessons.forEach(l =>
    opts += `<option value="${l.id}">${esc(l.title)} | ${esc(u.title)}</option>`
  ));
  if(oneSelect)   oneSelect.innerHTML   = opts;
  if(smartLesson) smartLesson.innerHTML = opts;
}

export function periodOptions(){
  const schPeriod = document.getElementById('schPeriod');
  if(!schPeriod) return;
  const ps = [...new Set(state.data.map(u=>u.period))];
  schPeriod.innerHTML = '<option value="all">كل الفترات</option>'+ps.map(p=>`<option>${esc(p)}</option>`).join('');
}

export function renderElements(s){
  const c = {m:0, n:0, l:0};
  return `<div class="els">`+
    s.elements.map(x =>
      `<div class="el ${x.level}"><div class="lab">${esc(lab(x.level,c))}</div><div><textarea class="screen" oninput="updEl('${x.id}','text',this.value)">${esc(x.text)}</textarea><span class="print-value">${esc(x.text)}</span></div><div class="screen-only"><select onchange="updEl('${x.id}','level',this.value)"><option value="major" ${x.level==='major'?'selected':''}>كبير</option><option value="minor" ${x.level==='minor'?'selected':''}>فرعي</option><option value="letter" ${x.level==='letter'?'selected':''}>تفريع</option></select><button class="small r" onclick="delEl('${x.id}')">حذف</button></div></div>`
    ).join('')+
    `<div class="actions screen-only"><button class="small t" onclick="addEl('${s.id}','major')">+ محور</button><button class="small b" onclick="addEl('${s.id}','minor')">+ عنصر</button><button class="small g" onclick="addEl('${s.id}','letter')">+ تفريع</button></div></div>`;
}

export function render(){
  const bodyRows = document.getElementById('bodyRows');
  if(!bodyRows) return;
  let h = '';
  for(const u of state.data){
    h += `<tr class="unit"><td colspan="12">${esc(u.period)} | ${esc(u.title)} <span class="screen-only"><button class="small b" onclick="addLesson('${u.id}')">+ درس</button></span></td></tr>`;
    for(const l of u.lessons){
      h += `<tr class="lesson"><td colspan="12">${esc(l.title)} <span class="actions screen-only"><button class="small b" onclick="addSession('${l.id}','normal')">+ درس</button><button class="small y" onclick="addSession('${l.id}','exercise')">+ تطبيق</button><button class="small g" onclick="addSession('${l.id}','support')">+ دعم</button><button class="small r" onclick="addSession('${l.id}','exam')">+ فرض</button><button class="small gray" onclick="addSession('${l.id}','correction')">+ تصحيح</button></span></td></tr>`;
      for(const s of l.sessions){
        const hol = isHoliday(s.date);
        h += `<tr class="${hol?'holiday':''}"><td><input class="screen" type="date" value="${esc(s.date)}" onchange="updS('${s.id}','date',this.value)"><span class="print-value">${esc(s.date)}</span>${hol?`<div class="holiday-badge screen-only">عطلة: ${esc(hol)}</div>`:''}</td><td><input class="screen" value="${esc(s.classe)}" oninput="updS('${s.id}','classe',this.value)"><span class="print-value">${esc(s.classe)}</span></td><td>${esc(u.title)}</td><td>${esc(u.period)}</td><td>${esc(l.title)}</td><td><input class="screen" value="${esc(s.label)}" oninput="updS('${s.id}','label',this.value)"><span class="print-value">${esc(s.label)}</span></td><td><span class="pill ${s.kind}">${esc(s.type)}</span></td><td>${renderElements(s)}</td><td><textarea class="screen" oninput="updS('${s.id}','activities',this.value)">${esc(s.activities)}</textarea><span class="print-value">${esc(s.activities)}</span></td><td><textarea class="screen" oninput="updS('${s.id}','homework',this.value)">${esc(s.homework)}</textarea><span class="print-value">${esc(s.homework)}</span></td><td><textarea class="screen" oninput="updS('${s.id}','note',this.value)">${esc(s.note)}</textarea><span class="print-value">${esc(s.note)}</span></td><td class="screen-only"><button class="small gray" onclick="copySession('${s.id}')">نسخ</button><button class="small r" onclick="delSession('${s.id}')">حذف</button></td></tr>`;
      }
    }
  }
  bodyRows.innerHTML = h;
  stats();
  fillSelectors();
  periodOptions();
  header();
  if(typeof window.updateCurriculumGuard === 'function') window.updateCurriculumGuard();
}

export function renderPresets(){
  const cycleFilter   = document.getElementById('cycleFilter');
  const subFilter     = document.getElementById('subFilter');
  const presetSearch  = document.getElementById('presetSearch');
  const presetGrid    = document.getElementById('presetGrid');
  if(!presetGrid) return;
  const c = cycleFilter ? cycleFilter.value : 'all';
  const s = subFilter   ? subFilter.value   : 'all';
  const q = presetSearch ? presetSearch.value.trim() : '';
  const arr = PRESETS.filter(p =>
    (c==='all' || p.cycle===c) &&
    (s==='all' || p.subject===s) &&
    (!q || (p.cycle+p.level+p.subject+p.description).includes(q))
  );
  presetGrid.innerHTML = arr.map(p =>
    `<div class="card preset-card"><h3>${esc(p.subject)} <span class="pill ${p.status==='موثق'?'normal':'exam'}" style="font-size:0.7em">${esc(p.status||'')}</span></h3><div class="muted">${esc(p.cycle)} | ${esc(p.level)}</div><p class="muted">${esc(p.description)}</p><div>${p.units.map(u=>`<span class="badge">${esc(u.title)}: ${u.lessons.length}</span>`).join('')}</div><div class="actions" style="margin-top:8px"><button class="g" onclick="applyPreset('${p.id}',false)">اعتماد</button><button class="b" onclick="applyPreset('${p.id}',true)">إضافة</button></div></div>`
  ).join('') || '<div class="card">لا توجد نتائج.</div>';
}

export function renderSubjectMap(){
  const subjectEl  = document.getElementById('subject');
  const subjectMap = document.getElementById('subjectMap');
  if(!subjectMap) return;
  const s = subjectEl ? subjectEl.value : '';
  const cats = subjectCategories(s);
  const method =
    isMath(s)        ? 'تعريف → خاصية → مثال → تطبيق → تمارين' :
    isSocial(s)      ? 'وثيقة → مفهوم → تحليل → تركيب → تقويم' :
    isPC(s)          ? 'تجربة → ملاحظة → استنتاج → قانون → تطبيق' :
    isSVT(s)         ? 'ملاحظة → وثيقة → تفسير → خلاصة → رسم' :
    isLang(s)        ? 'قراءة → فهم → لغة → إنتاج → تقويم' :
    isIslamic(s)     ? 'نص شرعي → مضامين → قيم → امتداد سلوكي' :
    isPhilosophy(s)  ? 'إشكالية → نص → تحليل → حجاج → تركيب نقدي' :
                       'أهداف → أنشطة → تقويم';
  // update card title dynamically
  const card = subjectMap.closest('.home-card');
  if(card){ const h3=card.querySelector('h3'); if(h3) h3.textContent = s ? `مخطط المادة: ${s}` : 'مخطط المادة الحالي'; }
  subjectMap.innerHTML =
    `<p class="muted" style="margin-bottom:10px"><strong>بنية الحصة المقترحة:</strong><br>${esc(method)}</p><p>${cats.map(c=>`<span class="badge">${esc(c)}</span>`).join('')}</p>`;
}

export function filters(){
  const cycleFilter = document.getElementById('cycleFilter');
  const subFilter   = document.getElementById('subFilter');
  if(cycleFilter) cycleFilter.innerHTML =
    '<option value="all">كل الأسلاك</option>'+
    [...new Set(PRESETS.map(p=>p.cycle))].map(x=>`<option>${esc(x)}</option>`).join('');
  if(subFilter) subFilter.innerHTML =
    '<option value="all">كل المواد</option>'+
    [...new Set(PRESETS.map(p=>p.subject))].map(x=>`<option>${esc(x)}</option>`).join('');
  renderPresets();
}

export function init(){
  filters();
}
