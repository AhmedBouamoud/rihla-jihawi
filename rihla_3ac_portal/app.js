
const PORTAL_KEY='rihla_3ac_portal_v2';
const LESSON_KEY='capitalisme_3ac_mobile_v1';
const EXAM_KEY='rihla_3ac_exam_selection_v1';

const defaultState={name:'',teacher:'الأستاذ أحمد بوعمود',announcement:'مرحبا بكم في بوابة المراجعة للامتحان المحلي - الثالثة إعدادي. ابدأوا بدرس الرأسمالية، ثم تابعوا باقي الدروس الثمانية عشر.',opened:{capitalisme:true},notes:'',visited:{}};

const subjects={
  history:{title:'التاريخ',icon:'📜',key:'history'},
  geography:{title:'الجغرافيا',icon:'🌍',key:'geography'},
  citizenship:{title:'التربية على المواطنة',icon:'🤝',key:'citizenship'}
};

// خطة الدروس الرسمية للأسدس الأول - الثالثة إعدادي اجتماعيات (الاستعداد للامتحان المحلي)
const LESSONS=[
  {id:'h1',subject:'history',order:1,title:'ازدهار الرأسمالية الأوربية خلال القرن 19م',status:'live',href:'./lessons/capitalisme/index.html',desc:'محطة جاهزة: آلة زمن، مبيانات، أبناك، تركيز رأسمالي، وثائق وشهادة.'},
  {id:'h2',subject:'history',order:2,title:'الإمبريالية وليدة الرأسمالية',status:'live',href:'./lessons/imperialism/index.html',desc:'كيف أدى ازدهار الرأسمالية الأوروبية إلى ظهور التوسع الإمبريالي؟ وما نموذج الجزائر؟'},
  {id:'h3',subject:'history',order:3,title:'الضغط الاستعماري على المغرب',status:'live',href:'./lessons/colonial-pressure/index.html',desc:'من معركة إيسلي ومعاهدة لالة مغنية، إلى فشل الإصلاحات وفرض الحماية سنة 1912م.'},
  {id:'h4',subject:'history',order:4,title:'الحرب العالمية الأولى: الأسباب والنتائج',status:'soon',desc:'أسباب الحرب، أطرافها، وأهم نتائجها السياسية والبشرية.'},
  {id:'h5',subject:'history',order:5,title:'انهيار الإمبراطورية العثمانية والتدخل الاستعماري في المشرق العربي',status:'soon',desc:'أسباب الانهيار، ومظاهر التقاسم الاستعماري للمشرق العربي.'},
  {id:'h6',subject:'history',order:6,title:'أزمة 1929: الأسباب والمظاهر والنتائج',status:'soon',desc:'أسباب الأزمة الاقتصادية العالمية، مظاهرها، وانعكاساتها.'},

  {id:'g1',subject:'geography',order:1,title:'المغرب العربي: عناصر الوحدة والتنوع',status:'soon',desc:'المؤهلات المشتركة وأوجه التنوع الطبيعي والبشري بالمنطقة.'},
  {id:'g2',subject:'geography',order:2,title:'المغرب العربي بين التكامل والتحديات',status:'soon',desc:'مقومات التكامل الاقتصادي والتحديات التي تواجهه.'},
  {id:'g3',subject:'geography',order:3,title:'اتحاد المغرب العربي: خيار استراتيجي للتكتل الإقليمي',status:'soon',desc:'نشأة الاتحاد، أهدافه، ومعيقات تفعيله.'},
  {id:'g4',subject:'geography',order:4,title:'الاتحاد الأوربي: إمكانياته ومكانته الاقتصادية في العالم',status:'soon',desc:'المؤهلات والمكانة الاقتصادية للاتحاد الأوروبي عالمياً.'},
  {id:'g5',subject:'geography',order:5,title:'الاتحاد الأوربي بين الاندماج والمنافسة',status:'soon',desc:'مظاهر الاندماج الداخلي وأوجه التنافس بين دوله.'},
  {id:'g6',subject:'geography',order:6,title:'معيقات التكتلات الجهوية: مقارنة بين الاتحاد الأوربي والمغرب العربي',status:'soon',desc:'مقارنة بين تجربتين في التكتل الإقليمي ومعيقات كل منهما.'},

  {id:'c1',subject:'citizenship',order:1,title:'المشاركة حق وواجب: ننتخب ممثلينا في مجلس المؤسسة',status:'soon',desc:'أهمية المشاركة المدرسية وخطوات انتخاب الممثلين.'},
  {id:'c2',subject:'citizenship',order:2,title:'كيف نعالج مشكلاً اجتماعياً انطلاقاً من أمثلة محلية',status:'soon',desc:'منهجية معالجة مشكل اجتماعي انطلاقاً من الواقع المحلي.'},
  {id:'c3',subject:'citizenship',order:3,title:'مسؤولية الدول والأفراد والجماعات في حل المشاكل الاجتماعية ومسؤوليتنا نحن',status:'soon',desc:'مستويات المسؤولية في معالجة القضايا الاجتماعية.'},
  {id:'c4',subject:'citizenship',order:4,title:'ملف حول مؤسسة محمد الخامس للتضامن',status:'soon',desc:'التعريف بالمؤسسة وأدوارها في التضامن الاجتماعي.'},
  {id:'c5',subject:'citizenship',order:5,title:'تخليق الحياة العامة: المفهوم والآليات، واقتراح خطة لمحاربة الرشوة',status:'soon',desc:'مفهوم التخليق، آلياته، وسبل محاربة الرشوة.'},
  {id:'c6',subject:'citizenship',order:6,title:'إلى أين ألجأ في حالة خرق حق من حقوقي الدستورية أو حقوق غيري؟',status:'soon',desc:'الجهات والآليات الوطنية لحماية الحقوق الدستورية.'}
];

// بنك أسئلة للمراجعة الذاتية (أسئلة تدريبية عامة وليست أسئلة الامتحان الرسمية)
const REVIEW_QUESTIONS={
  h1:['عرّف مفهوم الرأسمالية وحدد أهم عوامل ازدهارها بأوروبا خلال القرن 19.','استخرج مظاهر التطور الصناعي والمالي خلال هذه المرحلة.'],
  h2:['بيّن العلاقة بين الرأسمالية والإمبريالية.','اذكر أهم دوافع التوسع الاستعماري الأوروبي.'],
  h3:['حدد أشكال الضغط الاستعماري الذي تعرض له المغرب.','اشرح دور المعاهدات والامتيازات في تسهيل التدخل الأجنبي بالمغرب.'],
  h4:['اذكر أهم أسباب الحرب العالمية الأولى.','حدد أبرز نتائج الحرب العالمية الأولى على الخريطة السياسية لأوروبا.'],
  h5:['اشرح أسباب انهيار الإمبراطورية العثمانية.','بيّن مظاهر التدخل الاستعماري في المشرق العربي بعد الحرب العالمية الأولى.'],
  h6:['اذكر الأسباب المفسرة لأزمة 1929.','حدد أهم مظاهر ونتائج أزمة 1929 على الاقتصاد العالمي.'],
  g1:['حدد عناصر الوحدة بين دول المغرب العربي.','اذكر أهم مظاهر التنوع الطبيعي والبشري بالمنطقة.'],
  g2:['اشرح مقومات التكامل الاقتصادي بين دول المغرب العربي.','حدد أبرز التحديات التي تواجه هذا التكامل.'],
  g3:['متى تأسس اتحاد المغرب العربي، ولماذا يعتبر خياراً استراتيجياً؟','اذكر أهداف الاتحاد وأهم معيقات تفعيله.'],
  g4:['حدد أهم مقومات ومكانة الاتحاد الأوروبي اقتصادياً في العالم.','اذكر أهم القطاعات التي يتفوق فيها الاتحاد الأوروبي.'],
  g5:['بيّن مظاهر الاندماج داخل الاتحاد الأوروبي.','حدد أوجه المنافسة الاقتصادية بين دول الاتحاد.'],
  g6:['قارن بين معيقات التكتل الإقليمي في كل من الاتحاد الأوروبي والمغرب العربي.','اقترح حلولاً لتجاوز معيقات التكتل المغاربي.'],
  c1:['لماذا تعتبر المشاركة في مجلس المؤسسة حقاً وواجباً في نفس الوقت؟','صف خطوات تنظيم انتخاب ممثلي التلاميذ داخل المؤسسة.'],
  c2:['انطلاقاً من مثال محلي، صف خطوات معالجة مشكل اجتماعي.','حدد الفاعلين الذين يمكن إشراكهم في حل هذا المشكل.'],
  c3:['بيّن مسؤولية الدولة تجاه المشاكل الاجتماعية.','ما هي مسؤوليتك الشخصية كتلميذ(ة) تجاه محيطك الاجتماعي؟'],
  c4:['تعرّف على أهداف مؤسسة محمد الخامس للتضامن.','اذكر بعض برامج المؤسسة في مجال التضامن الاجتماعي.'],
  c5:['عرّف مفهوم تخليق الحياة العامة.','اقترح عناصر خطة لمحاربة الرشوة.'],
  c6:['إلى أي جهة يمكن أن ألجأ في حالة خرق حق من حقوقي الدستورية؟','اذكر بعض الآليات الوطنية لحماية حقوق الإنسان بالمغرب.']
};

function getPortal(){try{return {...defaultState,...(JSON.parse(localStorage.getItem(PORTAL_KEY))||{})}}catch(e){return {...defaultState}}}
function savePortal(s){localStorage.setItem(PORTAL_KEY,JSON.stringify(s))}
function patchPortal(fn){const s=getPortal();fn(s);savePortal(s);renderCommon();return s}
function getLessonState(){try{return JSON.parse(localStorage.getItem(LESSON_KEY))||{}}catch(e){return {}}}
function toast(msg){const t=document.getElementById('toast'); if(!t){alert(msg);return} t.textContent=msg;t.style.display='block';setTimeout(()=>t.style.display='none',2600)}
function setName(){const el=document.getElementById('studentName'); const name=(el?.value||'').trim(); if(!name){toast('اكتب اسم التلميذ أولاً.');return} patchPortal(s=>s.name=name); toast('تم حفظ الاسم داخل البوابة.');}
function resetPortal(){if(confirm('تصفير تقدم البوابة؟ لن يحذف تقدم محطة درس الرأسمالية إلا إذا اخترت ذلك من داخله.')){localStorage.removeItem(PORTAL_KEY);toast('تم تصفير البوابة.');setTimeout(()=>location.reload(),700)}}
function markVisited(id){patchPortal(s=>{s.visited[id]=true})}

function renderCommon(){
  const s=getPortal(), l=getLessonState();
  const name=s.name||l.name||'تلميذ مستكشف';
  document.querySelectorAll('[data-student]').forEach(e=>e.textContent=name);
  document.querySelectorAll('[data-teacher]').forEach(e=>e.textContent=s.teacher||'الأستاذ أحمد بوعمود');
  document.querySelectorAll('[data-announcement]').forEach(e=>e.textContent=s.announcement||defaultState.announcement);
  const score=l.score||0;
  document.querySelectorAll('[data-score]').forEach(e=>e.textContent=score);
  const done=Object.keys(l.completed||{}).length;
  document.querySelectorAll('[data-capitalisme-progress]').forEach(e=>e.textContent=done+'/7');
  document.querySelectorAll('[data-capitalisme-bar]').forEach(e=>e.style.width=Math.min(100,Math.round(done/7*100))+'%');
  const liveCount=LESSONS.filter(x=>x.status==='live').length;
  document.querySelectorAll('[data-open-lessons]').forEach(e=>e.textContent=liveCount);
  document.querySelectorAll('[data-total-lessons]').forEach(e=>e.textContent=LESSONS.length);
}

function saveTeacherSettings(){const teacher=document.getElementById('teacherName')?.value.trim();const announcement=document.getElementById('announcement')?.value.trim();const notes=document.getElementById('teacherNotes')?.value.trim();patchPortal(s=>{if(teacher)s.teacher=teacher;if(announcement)s.announcement=announcement;s.notes=notes||''});toast('تم حفظ إعدادات البوابة محلياً على هذا الهاتف.');}
function fillTeacher(){const s=getPortal(); if(document.getElementById('teacherName'))document.getElementById('teacherName').value=s.teacher||''; if(document.getElementById('announcement'))document.getElementById('announcement').value=s.announcement||''; if(document.getElementById('teacherNotes'))document.getElementById('teacherNotes').value=s.notes||'';}

function filterLessons(q, tag){
  q=(q||'').toLowerCase().trim();
  document.querySelectorAll('[data-lesson]').forEach(card=>{
    const hay=(card.textContent||'').toLowerCase();
    const okQ=!q||hay.includes(q);
    const okT=!tag||card.dataset.subject===tag||card.dataset.status===tag;
    card.style.display=(okQ&&okT)?'grid':'none'
  });
  const any=[...document.querySelectorAll('[data-lesson]')].some(c=>c.style.display!=='none');
  const empty=document.querySelector('.empty'); if(empty)empty.style.display=any?'none':'block';
}
function setupFilters(){
  const search=document.getElementById('lessonSearch');
  if(search)search.addEventListener('input',()=>filterLessons(search.value,document.querySelector('.chip.active')?.dataset.filter||''));
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
    filterLessons(search?.value||'',c.dataset.filter||'')
  }))
}
function soon(title){toast('محطة "'+title+'" مهيأة داخل البوابة وسنضيف نشاطها التفاعلي لاحقاً.');}

function exportPlan(){
  const content=`مشروع بوابة الاستعداد للامتحان المحلي - الثالثة إعدادي (الأسدس الأول)\n\nالأستاذ: ${getPortal().teacher}\n\nعدد الدروس: 18 درساً (6 تاريخ + 6 جغرافيا + 6 تربية على المواطنة).\n\nالمحطة الجاهزة الآن: ازدهار الرأسمالية الأوربية خلال القرن 19م.\n\nملاحظات الأستاذ:\n${getPortal().notes||'لا توجد ملاحظات بعد.'}`;
  const blob=new Blob([content],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='rihla-3ac-plan.txt';a.click();URL.revokeObjectURL(a.href)
}

// ---- نسخة العمل دون إنترنت (خاصة بالأستاذ فقط) ----
const OFFLINE_CACHE='rihla-3ac-portal-v5';
const OFFLINE_ASSETS=['./','./index.html','./history.html','./geography.html','./citizenship.html','./local-exam.html','./teacher.html','./style.css','./app.js','./manifest.webmanifest','./icon.svg',
'./lessons/capitalisme/index.html','./lessons/capitalisme/map.html','./lessons/capitalisme/lesson1.html','./lessons/capitalisme/graph.html','./lessons/capitalisme/banks.html','./lessons/capitalisme/concentration.html','./lessons/capitalisme/society.html','./lessons/capitalisme/documents.html','./lessons/capitalisme/final.html','./lessons/capitalisme/certificate.html','./lessons/capitalisme/report.html','./lessons/capitalisme/style.css','./lessons/capitalisme/app.js',
'./lessons/imperialism/index.html','./lessons/imperialism/images/01-hero-capitalism-to-imperialism.webp','./lessons/imperialism/images/02-industrial-port-19c.webp','./lessons/imperialism/images/03-mediterranean-route-france-algeria.webp','./lessons/imperialism/images/04-french-landing-algeria-1830.webp','./lessons/imperialism/images/05-colony-types-visual-comparison.webp','./lessons/imperialism/images/06-colonial-policy-effects-algeria.webp','./lessons/imperialism/images/extra/07-factory-and-export-detail.webp','./lessons/imperialism/images/extra/08-map-focus-mediterranean-algeria.webp','./lessons/imperialism/images/extra/09-confiscated-land-and-policy-detail.webp','./lessons/imperialism/images/extra/10-colony-types-three-panels.webp','./lessons/imperialism/images/extra/11-soldiers-and-occupation-scene.webp',
'./lessons/colonial-pressure/index.html','./lessons/colonial-pressure/images/clean_timeline.svg','./lessons/colonial-pressure/images/clean_flowchart_to_protectorate.svg','./lessons/colonial-pressure/images/clean_concept_cards.svg','./lessons/colonial-pressure/images/clean_journey_map.svg','./lessons/colonial-pressure/images/poster-overview.webp','./lessons/colonial-pressure/images/journey-map.webp','./lessons/colonial-pressure/images/pressure-map.webp','./lessons/colonial-pressure/images/pressure-reform-comparison.webp','./lessons/colonial-pressure/images/flow-to-protectorate.webp','./lessons/colonial-pressure/images/timeline-full.webp'];
async function prepareOfflineCopy(){
  if(!('caches' in window)){toast('هذا المتصفح لا يدعم العمل دون إنترنت.');return}
  toast('جارٍ تجهيز نسخة العمل دون إنترنت...');
  try{
    const cache=await caches.open(OFFLINE_CACHE);
    await cache.addAll(OFFLINE_ASSETS);
    toast('تم تجهيز نسخة العمل دون إنترنت على هذا الجهاز.');
  }catch(e){
    toast('تعذر تجهيز النسخة. تأكد من الاتصال بالإنترنت مرة واحدة ثم أعد المحاولة.');
  }
}

// ---- منشئ الاختبار المحلي ----
function getExamSelection(){try{return JSON.parse(localStorage.getItem(EXAM_KEY))||[]}catch(e){return []}}
function saveExamSelection(ids){localStorage.setItem(EXAM_KEY,JSON.stringify(ids))}
function setupExamBuilder(){
  const list=document.getElementById('examList');
  if(!list)return;
  const saved=getExamSelection();
  list.querySelectorAll('input[type=checkbox][data-lesson-id]').forEach(cb=>{
    if(saved.includes(cb.dataset.lessonId))cb.checked=true;
  });
  document.getElementById('examSelectAll')?.addEventListener('click',()=>{
    list.querySelectorAll('input[type=checkbox][data-lesson-id]').forEach(cb=>cb.checked=true);
  });
  document.getElementById('examClearAll')?.addEventListener('click',()=>{
    list.querySelectorAll('input[type=checkbox][data-lesson-id]').forEach(cb=>cb.checked=false);
  });
  document.getElementById('examGenerate')?.addEventListener('click',generateExam);
}
function generateExam(){
  const list=document.getElementById('examList');
  const ids=[...list.querySelectorAll('input[type=checkbox][data-lesson-id]:checked')].map(cb=>cb.dataset.lessonId);
  if(!ids.length){toast('اختر درساً واحداً على الأقل لإنشاء الاختبار.');return}
  saveExamSelection(ids);
  const out=document.getElementById('examOutput');
  const chosen=LESSONS.filter(x=>ids.includes(x.id));
  let html='<h2>ورقة مراجعة الاختبار المحلي</h2><p class="mini">أسئلة تدريبية للمراجعة الذاتية - وليست أسئلة الاختبار الرسمي.</p>';
  chosen.forEach((lsn,i)=>{
    const qs=REVIEW_QUESTIONS[lsn.id]||[];
    html+=`<div class="exam-item"><div class="exam-item-head"><span class="subj-tag subj-${lsn.subject}">${subjects[lsn.subject].icon} ${subjects[lsn.subject].title}</span><strong>${i+1}. ${lsn.title}</strong></div><ol>`;
    qs.forEach(q=>html+=`<li>${q}</li>`);
    html+='</ol></div>';
  });
  out.innerHTML=html;
  out.style.display='block';
  out.scrollIntoView({behavior:'smooth',block:'start'});
  toast('تم إنشاء ورقة المراجعة. يمكنك طباعتها الآن.');
}

document.addEventListener('DOMContentLoaded',()=>{renderCommon();fillTeacher();setupFilters();setupExamBuilder();});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
