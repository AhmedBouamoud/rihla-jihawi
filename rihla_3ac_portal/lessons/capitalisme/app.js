const APP_KEY = 'capitalisme_3ac_mobile_v1';
const DEFAULT_STATE = {
  name: '',
  score: 0,
  unlocked: 1,
  completed: {},
  badges: [],
  answers: {}
};

const STAGES = [
  {id:1,title:'بوابة القرن 19',desc:'مقدمة وسؤال الانطلاق',url:'lesson1.html',icon:'⏳'},
  {id:2,title:'المصانع والمبيانات',desc:'الصناعة، الفحم، الصلب والقطن',url:'graph.html',icon:'🏭'},
  {id:3,title:'الأبناك والشركات',desc:'القروض والأسهم وتمويل المشاريع',url:'banks.html',icon:'🏦'},
  {id:4,title:'لغز التركيز الرأسمالي',desc:'الكارتل، التراست، الهولدينغ',url:'concentration.html',icon:'🧩'},
  {id:5,title:'المدينة الصناعية',desc:'البورجوازية والعمال والتمدين',url:'society.html',icon:'🏙️'},
  {id:6,title:'مختبر الوثائق',desc:'صور ووثائق تاريخية تفاعلية',url:'documents.html',icon:'🔎'},
  {id:7,title:'التحدي النهائي',desc:'اختبار شامل وشهادة الإنجاز',url:'final.html',icon:'🏆'}
];

const BADGE_ICONS = {
  'المؤرخ المبتدئ':'📜',
  'قارئ المبيانات':'📊',
  'ممول المشاريع':'🏦',
  'الخبير الاقتصادي الصغير':'🧠',
  'مستكشف المدينة الصناعية':'🏙️',
  'قارئ الوثائق':'🔎',
  'سيد الرحلة التاريخية':'🏆'
};

function getPortalName(){
  try{ return JSON.parse(localStorage.getItem('rihla_3ac_portal_v2') || '{}').name || ''; }catch(e){ return ''; }
}
function getState(){
  let s;
  try{
    s={...DEFAULT_STATE, ...(JSON.parse(localStorage.getItem(APP_KEY)) || {})};
  }catch(e){ s={...DEFAULT_STATE}; }
  if(!s.name) s.name=getPortalName();
  return s;
}
function saveState(state){ localStorage.setItem(APP_KEY, JSON.stringify(state)); }
function updateState(mutator){ const s=getState(); mutator(s); saveState(s); return s; }
function addScore(points){
  return updateState(s=>{ s.score = Math.max(0, (s.score||0)+points); });
}
function addBadge(name){
  return updateState(s=>{ if(!s.badges.includes(name)) s.badges.push(name); });
}
function completeLevel(level, nextUrl, badge, points=20){
  const s = getState();
  if(!s.completed[level]){
    s.completed[level]=true;
    s.score=(s.score||0)+points;
    if(badge && !s.badges.includes(badge)) s.badges.push(badge);
  }
  if(level >= s.unlocked) s.unlocked = Math.min(7, level+1);
  saveState(s);
  renderHeader();
  toast(`رائع! ربحت ${points} نقطة ${badge ? 'ووسام: '+badge : ''}`);
  setTimeout(()=>{ location.href = nextUrl || 'map.html'; }, 950);
}
function unlockAll(){
  updateState(s=>{ s.unlocked=7; });
  toast('تم فتح جميع المراحل للتجربة الصفية.');
  setTimeout(()=>location.reload(),600);
}
function resetApp(){
  if(confirm('هل تريد تصفير التقدم والنقاط؟')){
    localStorage.removeItem(APP_KEY);
    toast('تم تصفير تقدم المحطة.');
    setTimeout(()=>location.href='index.html',700);
  }
}
function saveNameAndStart(){
  const input = document.getElementById('studentName');
  const name = (input?.value || '').trim();
  if(!name){ toast('اكتب اسمك أولاً حتى تظهر الشهادة باسمك.'); return; }
  updateState(s=>{ s.name=name; });
  location.href='map.html';
}
function renderHeader(){
  const s=getState();
  document.querySelectorAll('[data-name]').forEach(el=> el.textContent = s.name || 'تلميذ مستكشف');
  document.querySelectorAll('[data-score]').forEach(el=> el.textContent = s.score || 0);
  document.querySelectorAll('[data-level]').forEach(el=> el.textContent = s.unlocked || 1);
  const progress = document.querySelector('[data-progress]');
  if(progress){
    const done = Object.keys(s.completed||{}).length;
    progress.style.width = Math.round(done/7*100)+'%';
  }
  renderBadges();
}
function renderBadges(){
  const s=getState();
  document.querySelectorAll('[data-badges]').forEach(box=>{
    if(!s.badges.length){ box.innerHTML='<span class="mini">لم تحصل على أوسمة بعد. ابدأ الرحلة!</span>'; return; }
    box.innerHTML=s.badges.map(b=>`<span class="badge">${BADGE_ICONS[b]||'⭐'} ${b}</span>`).join('');
  });
}
function renderStageMap(){
  const box=document.getElementById('stageMap');
  if(!box) return;
  const s=getState();
  box.innerHTML = `
    <svg class="path-svg" viewBox="0 0 900 620" preserveAspectRatio="none" aria-hidden="true">
      <path d="M720 55 C260 70 700 165 190 195 C730 245 205 330 685 380 C260 420 690 500 230 560" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" stroke-dasharray="22 20"/>
    </svg>
    ${STAGES.map((st,idx)=>{
      const locked = st.id > s.unlocked;
      const done = !!s.completed[st.id];
      return `<article class="stage-node s${st.id} ${locked?'locked':''} ${done?'done':''}">
        <div class="num">${done?'✓':st.id}</div>
        <h3>${st.icon} ${st.title}</h3>
        <p>${st.desc}</p>
        <button class="go" ${locked?'disabled':''} onclick="location.href='${locked?'#':st.url}'">${locked?'مغلق':'ادخل المرحلة'}</button>
      </article>`;
    }).join('')}
  `;
}
function toast(msg){
  let t=document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.remove('show'),2600);
}
function openModal(title, content){
  const modal = document.getElementById('modal') || createModal();
  modal.querySelector('[data-modal-title]').innerHTML = title;
  modal.querySelector('[data-modal-content]').innerHTML = content;
  modal.classList.add('show');
}
function closeModal(){ const modal=document.getElementById('modal'); if(modal) modal.classList.remove('show'); }
function createModal(){
  const m=document.createElement('div'); m.id='modal'; m.className='modal';
  m.innerHTML=`<div class="modal-card"><div class="modal-head"><h3 data-modal-title></h3><button class="close" onclick="closeModal()">×</button></div><div class="divider"></div><div data-modal-content></div></div>`;
  m.addEventListener('click',e=>{ if(e.target===m) closeModal(); });
  document.body.appendChild(m); return m;
}
function guardLevel(level){
  const s=getState();
  if(level > s.unlocked){
    toast('هذه المرحلة لم تفتح بعد. ارجع إلى الخريطة وأكمل المرحلة السابقة.');
    setTimeout(()=>location.href='map.html',900);
  }
}
function markOption(btn, isCorrect){
  const parent=btn.closest('.quiz-box,.question-card');
  parent.querySelectorAll('.option').forEach(o=>o.disabled=true);
  btn.classList.add(isCorrect?'correct':'wrong');
  if(!isCorrect){
    const c=parent.querySelector('[data-correct="true"]');
    if(c) c.classList.add('correct');
  }
}
function tinyQuiz(containerId, questions, successMessage){
  const el=document.getElementById(containerId); if(!el) return;
  let index=0, right=0;
  function draw(){
    const q=questions[index];
    el.innerHTML=`<h3>${q.q}</h3>${q.options.map((o,i)=>`<button class="option" data-correct="${i===q.a}" onclick="answerTiny(${i})"><span>${String.fromCharCode(65+i)}</span><b>${o}</b></button>`).join('')}<p class="mini">السؤال ${index+1} من ${questions.length}</p>`;
  }
  window.answerTiny=function(i){
    const q=questions[index];
    const ok=i===q.a; if(ok) right++;
    const btn=el.querySelectorAll('.option')[i]; markOption(btn,ok);
    setTimeout(()=>{
      index++;
      if(index<questions.length) draw();
      else el.innerHTML=`<h3>${right>=Math.ceil(questions.length*.6)?'أحسنت!':'حاول مرة أخرى'}</h3><p>نتيجتك: ${right}/${questions.length}</p><p>${successMessage||''}</p>`;
    },750);
  };
  draw();
}
function boot(){ renderHeader(); renderStageMap(); createModal(); }
document.addEventListener('DOMContentLoaded', boot);
