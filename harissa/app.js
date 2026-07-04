/* =====================================================================
   مساعد الحراسة العامة — مؤسسة الحنان
   ملاحظة بنيوية: كل النصوص العربية مجمّعة داخل الثوابت والقوالب أدناه
   (BUILTIN_TEMPLATES, MESSAGE_TEMPLATES, نصوص الترويسة...) حتى يسهل
   لاحقاً إضافة نسخة فرنسية (STRINGS_FR) دون إعادة هيكلة الكود.
   لا توجد أي قاعدة بيانات خارجية: كل البيانات محفوظة في localStorage.
   ===================================================================== */
(function(){
"use strict";

/* ============================= مفاتيح التخزين ============================= */
const K_AUTH        = 'hg_auth_v1';
const K_PWHASH       = 'hg_pwhash_v1';
const K_PINHASH      = 'hg_pinhash_v1';
const SS_UNLOCKED    = 'hg_session_unlocked'; // sessionStorage: تم التحقق من كلمة المرور الكاملة لهذه الجلسة
const SS_PIN_LOCKED  = 'hg_pin_locked';       // sessionStorage: التطبيق مقفل مؤقتاً وينتظر الرقم السري فقط
const K_SETTINGS     = 'hg_settings_v1';
const K_STUDENTS     = 'hg_students_v1';
const K_TEACHERS     = 'hg_teachers_v1';
const K_ATTENDANCE   = 'hg_attendance_v1';
const K_BEHAVIOR     = 'hg_behavior_v1';
const K_MSGLOG       = 'hg_msglog_v1';
const K_TEMPLATES    = 'hg_templates_v1';
const K_REPORTS      = 'hg_reports_v1';
const K_SEEDED       = 'hg_seeded_v1';

/* ============================= ثوابت نصية عامة ============================= */
const KINGDOM_LINE  = 'المملكة المغربية';
const MINISTRY_LINE = 'وزارة التربية الوطنية والتعليم الأولي والرياضة';

const STATUS_LABELS = { normal:'عادي', tracking:'يحتاج تتبع', urgent:'حالة مستعجلة' };
const JUSTIF_LABELS = { pending:'ينتظر التبرير', justified:'مبرر', unjustified:'غير مبرر' };
const SEVERITY_LABELS = { light:'بسيطة', medium:'متوسطة', urgent:'مستعجلة' };
const FILESTATUS_LABELS = { open:'مفتوح', closed:'مغلق' };
const ATTTYPE_LABELS = { absence:'غياب', tardiness:'تأخر' };
const ACTIONS_LIST = ['تنبيه شفوي','توجيه تربوي','استدعاء ولي الأمر','إحالة على الإدارة','التزام مكتوب','متابعة لاحقة'];

const DEFAULT_SETTINGS = {
  institution:'مؤسسة الحنان', niaba:'', academy:'', year:'', supervisor:'',
  sections:[
    'الأولى إعدادي 1','الأولى إعدادي 2','الثانية إعدادي 1','الثانية إعدادي 2','الثالثة إعدادي 1','الثالثة إعدادي 2',
    'الجذع المشترك 1','الجذع المشترك 2','الأولى بكالوريا 1','الأولى بكالوريا 2','الثانية بكالوريا 1','الثانية بكالوريا 2'
  ],
  caseTypes:['شجار','عدم احترام','تأخر متكرر','غياب متكرر','استعمال الهاتف','إزعاج داخل القسم','مخالفة النظام الداخلي','حالة صحية','حالة اجتماعية/نفسية تحتاج تتبعًا','أخرى'],
  messageTemplates:[
    {key:'absence', title:'إشعار غياب', body:'السيد(ة) ولي أمر التلميذ(ة) {name}، نحيطكم علماً بغياب ابنكم/ابنتكم بقسم {section} بتاريخ {date}. نرجو التواصل مع الإدارة لتبرير الغياب.\nتحياتنا، الحراسة العامة — {institution}.'},
    {key:'tardiness', title:'إشعار تأخر', body:'السيد(ة) ولي أمر التلميذ(ة) {name}، نحيطكم علماً بتأخر ابنكم/ابنتكم عن الحصة بقسم {section} بتاريخ {date}. نرجو الحرص على الالتزام بالتوقيت.\nتحياتنا، الحراسة العامة — {institution}.'},
    {key:'summon', title:'استدعاء ولي أمر', body:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، تدعوكم إدارة {institution} لحضور لقاء بخصوص وضعية ابنكم/ابنتكم بتاريخ {date}. نرجو الحضور في أقرب وقت ممكن.\nتحياتنا، الحراسة العامة.'},
    {key:'behavior', title:'إشعار بسلوك غير مناسب', body:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، نحيطكم علماً بتسجيل ملاحظة سلوكية بتاريخ {date} تتعلق بـ: {caseType}. نرجو التواصل مع الحراسة العامة للمتابعة.\nتحياتنا.'},
    {key:'urgent', title:'طلب حضور عاجل', body:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، نطلب حضوركم العاجل إلى المؤسسة اليوم {date} بخصوص وضعية مستعجلة تخص ابنكم/ابنتكم.\nتحياتنا، الحراسة العامة — {institution}.'},
    {key:'thanks', title:'شكر لولي الأمر على الحضور', body:'السيد(ة) ولي أمر التلميذ(ة) {name}، نشكركم على حضوركم وتعاونكم بتاريخ {date} بخصوص متابعة وضعية ابنكم/ابنتكم.\nتحياتنا، الحراسة العامة — {institution}.'},
    {key:'improvement', title:'إشعار بتحسن سلوك التلميذ', body:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، يسرنا إعلامكم بالتحسن الملحوظ في سلوك ابنكم/ابنتكم خلال الفترة الأخيرة. نشكركم على تعاونكم.\nتحياتنا، الحراسة العامة — {institution}.'}
  ]
};

/* ============================= القوالب الجاهزة (محرك التقارير المرنة) ============================= */
const BUILTIN_TEMPLATES = [
  { id:'ghiyab', builtin:true, category:'الغياب والتأخر', name:'تقرير غياب التلاميذ', fields:[
    {id:'f1', type:'date', label:'اليوم والتاريخ', required:true},
    {id:'f2', type:'text', label:'القسم / الأقسام المعنية', required:false},
    {id:'f3', type:'table', label:'لائحة الغياب', columns:['الاسم الكامل','رقم التسجيل','القسم','مدة الغياب','السبب (إن وجد)']},
    {id:'f4', type:'textarea', label:'ملاحظات عامة', required:false}
  ]},
  { id:'taakhor', builtin:true, category:'الغياب والتأخر', name:'تقرير التأخر عن الحصص', fields:[
    {id:'f1', type:'date', label:'التاريخ', required:true},
    {id:'f2', type:'text', label:'الحصة / التوقيت', required:false},
    {id:'f3', type:'table', label:'لائحة المتأخرين', columns:['الاسم الكامل','القسم','وقت الوصول','المدة المتأخر بها','السبب']},
    {id:'f4', type:'textarea', label:'الإجراء المتخذ', required:false}
  ]},
  { id:'suluk', builtin:true, category:'السلوك والانضباط', name:'تقرير سلوك / مخالفة تلميذ', fields:[
    {id:'f1', type:'date', label:'التاريخ', required:true},
    {id:'f2', type:'text', label:'اسم التلميذ', required:true},
    {id:'f3', type:'text', label:'القسم', required:false},
    {id:'f4', type:'select', label:'نوع المخالفة', options:['خفيفة','متوسطة','جسيمة']},
    {id:'f5', type:'textarea', label:'وصف الواقعة', required:true},
    {id:'f6', type:'textarea', label:'الإجراء المتخذ', required:false},
    {id:'f7', type:'text', label:'الأطراف الحاضرة / الشهود', required:false}
  ]},
  { id:'majlis-indibat', builtin:true, category:'المجالس والمحاضر', name:'محضر مجلس الانضباط', fields:[
    {id:'f1', type:'date', label:'تاريخ الانعقاد', required:true},
    {id:'f2', type:'text', label:'اسم التلميذ المعني', required:true},
    {id:'f3', type:'text', label:'القسم', required:false},
    {id:'f4', type:'textarea', label:'موضوع الانعقاد', required:false},
    {id:'f5', type:'table', label:'أعضاء المجلس الحاضرون', columns:['الاسم','الصفة']},
    {id:'f6', type:'textarea', label:'مداولات المجلس', required:false},
    {id:'f7', type:'textarea', label:'القرار المتخذ', required:true}
  ]},
  { id:'istidaa', builtin:true, category:'المراسلات', name:'استدعاء ولي أمر', fields:[
    {id:'f1', type:'text', label:'اسم ولي الأمر', required:true},
    {id:'f2', type:'text', label:'اسم التلميذ(ة)', required:true},
    {id:'f3', type:'text', label:'القسم', required:false},
    {id:'f4', type:'date', label:'تاريخ الاستدعاء', required:true},
    {id:'f5', type:'time', label:'الساعة', required:false},
    {id:'f6', type:'textarea', label:'موضوع الاستدعاء', required:true}
  ]},
  { id:'haditha', builtin:true, category:'الحوادث والوقائع', name:'تقرير حادثة / واقعة', fields:[
    {id:'f1', type:'date', label:'تاريخ الحادثة', required:true},
    {id:'f2', type:'time', label:'وقت الحادثة', required:false},
    {id:'f3', type:'text', label:'المكان', required:false},
    {id:'f4', type:'textarea', label:'وصف الحادثة', required:true},
    {id:'f5', type:'text', label:'الأطراف المعنية', required:false},
    {id:'f6', type:'textarea', label:'الإجراءات المتخذة', required:false},
    {id:'f7', type:'textarea', label:'توصيات', required:false}
  ]},
  { id:'hirasat-imtihan', builtin:true, category:'الامتحانات', name:'تقرير حراسة الامتحان', fields:[
    {id:'f1', type:'text', label:'المادة الممتحن فيها', required:true},
    {id:'f2', type:'date', label:'التاريخ', required:true},
    {id:'f3', type:'text', label:'التوقيت', required:false},
    {id:'f4', type:'text', label:'رقم القاعة', required:false},
    {id:'f5', type:'number', label:'عدد المسجلين', required:false},
    {id:'f6', type:'number', label:'عدد الحاضرين', required:false},
    {id:'f7', type:'number', label:'عدد الغائبين', required:false},
    {id:'f8', type:'table', label:'حالات الغش أو المخالفات', columns:['اسم التلميذ','رقم الطاولة','نوع المخالفة','الإجراء']},
    {id:'f9', type:'textarea', label:'ملاحظات حول سير الحراسة', required:false}
  ]},
  { id:'rokhsat-khoroj', builtin:true, category:'المراسلات', name:'رخصة خروج / مغادرة', fields:[
    {id:'f1', type:'text', label:'اسم التلميذ(ة)', required:true},
    {id:'f2', type:'text', label:'القسم', required:false},
    {id:'f3', type:'date', label:'التاريخ', required:true},
    {id:'f4', type:'time', label:'وقت الخروج', required:false},
    {id:'f5', type:'textarea', label:'سبب المغادرة', required:true},
    {id:'f6', type:'text', label:'اسم المرافق / ولي الأمر (إن وجد)', required:false}
  ]},
  { id:'istiqbal-wali', builtin:true, category:'المراسلات', name:'محضر استقبال ولي أمر', fields:[
    {id:'f1', type:'date', label:'التاريخ', required:true},
    {id:'f2', type:'time', label:'الساعة', required:false},
    {id:'f3', type:'text', label:'اسم ولي الأمر', required:true},
    {id:'f4', type:'text', label:'اسم التلميذ(ة)', required:true},
    {id:'f5', type:'text', label:'القسم', required:false},
    {id:'f6', type:'textarea', label:'موضوع اللقاء', required:false},
    {id:'f7', type:'textarea', label:'ملخص اللقاء', required:true},
    {id:'f8', type:'textarea', label:'القرار / التوصية', required:false}
  ]},
  { id:'iltizam-wali', builtin:true, category:'المراسلات', name:'التزام ولي أمر', fields:[
    {id:'f1', type:'date', label:'التاريخ', required:true},
    {id:'f2', type:'text', label:'اسم ولي الأمر', required:true},
    {id:'f3', type:'text', label:'اسم التلميذ(ة)', required:true},
    {id:'f4', type:'text', label:'القسم', required:false},
    {id:'f5', type:'textarea', label:'نص الالتزام', required:true},
    {id:'f6', type:'text', label:'مدة المتابعة', required:false}
  ]},
  { id:'bitaqa-tatabbo3', builtin:true, category:'أخرى', name:'بطاقة تتبع تربوي', fields:[
    {id:'f1', type:'text', label:'اسم التلميذ(ة)', required:true},
    {id:'f2', type:'text', label:'القسم', required:false},
    {id:'f3', type:'date', label:'تاريخ فتح البطاقة', required:true},
    {id:'f4', type:'textarea', label:'سبب التتبع', required:true},
    {id:'f5', type:'textarea', label:'الإجراءات المتخذة', required:false},
    {id:'f6', type:'date', label:'تاريخ آخر متابعة', required:false},
    {id:'f7', type:'select', label:'الحالة الحالية', options:['مستمر','تم تجاوزه','محال على جهة مختصة']}
  ]},
  { id:'halat-sulukiya', builtin:true, category:'السلوك والانضباط', name:'تقرير حالة سلوكية (نموذج حر)', fields:[
    {id:'f1', type:'date', label:'التاريخ', required:true},
    {id:'f2', type:'text', label:'اسم التلميذ(ة)', required:true},
    {id:'f3', type:'text', label:'القسم', required:false},
    {id:'f4', type:'text', label:'نوع الحالة', required:false},
    {id:'f5', type:'select', label:'درجة الخطورة', options:['بسيطة','متوسطة','مستعجلة']},
    {id:'f6', type:'textarea', label:'وصف الحالة', required:true},
    {id:'f7', type:'textarea', label:'الإجراء المتخذ', required:false},
    {id:'f8', type:'date', label:'تاريخ المتابعة', required:false}
  ]}
];

/* ============================= أدوات مساعدة عامة ============================= */
function esc(v){
  if(v===undefined || v===null) return '';
  return String(v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function uid(prefix){ return (prefix||'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8); }
function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
function nowHM(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function loadJSON(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch(e){ return fallback; }
}
function saveJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>t.classList.remove('show'), 2400);
}
function waPhone(phone){
  let p = String(phone||'').replace(/\D/g,'');
  if(!p) return '';
  if(p.startsWith('212')) return p;
  if(p.startsWith('0')) return '212' + p.slice(1);
  return '212' + p;
}
function monthKey(dateStr){ return (dateStr||'').slice(0,7); } // YYYY-MM

/* ============================= الحالة العامة ============================= */
const state = {
  settings: loadJSON(K_SETTINGS, DEFAULT_SETTINGS),
  students: loadJSON(K_STUDENTS, []),
  teachers: loadJSON(K_TEACHERS, []),
  attendance: loadJSON(K_ATTENDANCE, []),
  behavior: loadJSON(K_BEHAVIOR, []),
  msglog: loadJSON(K_MSGLOG, []),
  customTemplates: loadJSON(K_TEMPLATES, []),
  reports: loadJSON(K_REPORTS, []),
  currentView: 'view-dashboard',
  currentStudentId: null,
  currentTemplate: null,
  currentReportId: null,
  formValues: {},
  extraFields: [],
  builderFields: [],
  builderEditingId: null,
  pendingMessageContext: null
};
function saveSettings(){ saveJSON(K_SETTINGS, state.settings); }
function saveStudents(){ saveJSON(K_STUDENTS, state.students); }
function saveTeachers(){ saveJSON(K_TEACHERS, state.teachers); }
function saveAttendance(){ saveJSON(K_ATTENDANCE, state.attendance); }
function saveBehavior(){ saveJSON(K_BEHAVIOR, state.behavior); }
function saveMsgLog(){ saveJSON(K_MSGLOG, state.msglog); }
function saveTemplates(){ saveJSON(K_TEMPLATES, state.customTemplates); }
function saveReports(){ saveJSON(K_REPORTS, state.reports); }

function allTemplates(){ return BUILTIN_TEMPLATES.concat(state.customTemplates); }
function findTemplate(id){ return allTemplates().find(t=>t.id===id); }
function studentById(id){ return state.students.find(s=>s.id===id); }
function studentsInSection(section){ return state.students.filter(s=>!section || s.section===section); }

/* ============================= بيانات تجريبية (تُزرع مرة واحدة فقط) ============================= */
function seedDemoData(){
  if(localStorage.getItem(K_SEEDED)) return;
  if(state.students.length>0){ localStorage.setItem(K_SEEDED,'1'); return; }

  const sections = state.settings.sections;
  const names = [
    'أيوب الفاسي','سلمى بنعلي','يوسف الإدريسي','مريم الشرقاوي','أنس بوزيان','خديجة العلوي',
    'عبد الرحمن الحسني','فاطمة الزهراء بناني','سعيد الوردي','إيمان الغازي','محمد أمين الطاهري',
    'نور الهدى الصقلي','حمزة الخياط','سارة المرابط','عثمان الرافعي','لبنى الشرقي','طه الوزاني','رانية الكتاني'
  ];
  const students = names.map((name,i)=>({
    id: uid('stu'),
    fullName: name,
    section: sections[i % sections.length],
    parentPhone: '06' + String(10000000 + Math.floor(Math.random()*89999999)).slice(0,8),
    parentPhone2:'',
    notes:'',
    status:'normal',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }));
  state.students = students;

  const attendance = [];
  const behavior = [];
  const today = new Date();
  function isoDaysAgo(n){ const d=new Date(today); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }

  // غياب وتأخر اليوم
  [students[0], students[3], students[7]].forEach((s,i)=>{
    attendance.push({ id:uid('att'), studentId:s.id, type: i===1?'tardiness':'absence', date:todayISO(), time:nowHM(),
      reason:'', justification:'pending', note:'', createdAt:new Date().toISOString() });
  });
  [students[2], students[5]].forEach(s=>{
    attendance.push({ id:uid('att'), studentId:s.id, type:'tardiness', date:todayISO(), time:'08:15',
      reason:'ازدحام النقل', justification:'justified', note:'', createdAt:new Date().toISOString() });
  });

  // غياب وتأخر متكرر خلال الشهر لتلميذ واحد لإظهار التنبيه والإحصائيات
  for(let i=0;i<4;i++){
    attendance.push({ id:uid('att'), studentId:students[1].id, type:'tardiness', date:isoDaysAgo(3+i*3), time:'08:10',
      reason:'', justification:'unjustified', note:'', createdAt:new Date().toISOString() });
  }
  for(let i=0;i<3;i++){
    attendance.push({ id:uid('att'), studentId:students[9].id, type:'absence', date:isoDaysAgo(5+i*4), time:'',
      reason:'', justification:'pending', note:'', createdAt:new Date().toISOString() });
  }
  students[1].status = 'tracking';
  students[9].status = 'tracking';

  // حالات سلوكية
  behavior.push({ id:uid('beh'), studentId:students[4].id, date:todayISO(), type:'استعمال الهاتف', severity:'light',
    description:'استعمال الهاتف داخل القسم أثناء الحصة.', action:'تنبيه شفوي', followUpDate:'', fileStatus:'closed',
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
  behavior.push({ id:uid('beh'), studentId:students[6].id, date:todayISO(), type:'شجار', severity:'urgent',
    description:'شجار مع تلميذ آخر بالساحة.', action:'إحالة على الإدارة', followUpDate: isoDaysAgo(-2), fileStatus:'open',
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
  behavior.push({ id:uid('beh'), studentId:students[11].id, date:isoDaysAgo(6), type:'حالة اجتماعية/نفسية تحتاج تتبعًا', severity:'medium',
    description:'ملاحظة تراجع في التركيز والمشاركة داخل القسم.', action:'متابعة لاحقة', followUpDate: isoDaysAgo(-4), fileStatus:'open',
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
  students[6].status = 'urgent';
  students[11].status = 'tracking';

  state.attendance = attendance;
  state.behavior = behavior;
  saveStudents(); saveAttendance(); saveBehavior();
  localStorage.setItem(K_SEEDED,'1');
}
// دالة منفصلة عن seedDemoData حتى تُغذّي المستخدمين الحاليين بأساتذة تجريبيين
// (وحدة الأساتذة أُضيفت لاحقاً بعد أن سبق لهم زرع بيانات التلاميذ وضبط علم K_SEEDED)
function seedTeachersIfEmpty(){
  if(state.teachers.length>0) return;
  const teacherSeed = [
    {fullName:'ذ. يوسف العماري', subject:'الرياضيات', sections:'الأولى إعدادي 1، الأولى إعدادي 2'},
    {fullName:'ة. سعاد بنكيران', subject:'اللغة العربية', sections:'الثانية إعدادي 1، الثانية إعدادي 2'},
    {fullName:'ذ. كريم الفيلالي', subject:'الاجتماعيات', sections:'الثالثة إعدادي 1، الثالثة إعدادي 2'},
    {fullName:'ة. حنان الطيبي', subject:'اللغة الفرنسية', sections:'الأولى إعدادي 1، الثانية إعدادي 1'},
    {fullName:'ذ. عمر الشرقاوي', subject:'العلوم الفيزيائية', sections:'الثانية إعدادي 2، الثالثة إعدادي 1'},
    {fullName:'ة. مريم الإدريسي', subject:'التربية الإسلامية', sections:'كل الأقسام'}
  ];
  state.teachers = teacherSeed.map(t=>({
    id: uid('tch'), fullName:t.fullName, subject:t.subject, sections:t.sections,
    phone:'06' + String(10000000 + Math.floor(Math.random()*89999999)).slice(0,8),
    notes:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()
  }));
  saveTeachers();
}
// يضيف مستويات الثانوي التأهيلي لمن سبق أن أعدّ لائحة أقسامه قبل هذا التحديث،
// دون التأثير على أي أقسام خاصة أضافها المستخدم بنفسه (يُضاف الناقص فقط، بشكل آمن للتكرار)
function migrateSecondaryLevels(){
  const required = ['الجذع المشترك 1','الجذع المشترك 2','الأولى بكالوريا 1','الأولى بكالوريا 2','الثانية بكالوريا 1','الثانية بكالوريا 2'];
  const missing = required.filter(s=>!state.settings.sections.includes(s));
  if(missing.length===0) return;
  state.settings.sections = state.settings.sections.concat(missing);
  saveSettings();
}

/* ============================= الحماية: كلمة المرور والرقم السري ============================= */
// تشفير بسيط عبر Web Crypto (SHA-256 + ملح عشوائي) — يمنع الاستعمال العرضي فقط،
// وليس تشفيراً حقيقياً للبيانات نفسها (تبقى البيانات كنص عادي في localStorage).
function randomSalt(){
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function setSecret(key, value){
  const salt = randomSalt();
  const hash = await sha256Hex(salt + ':' + value);
  saveJSON(key, {salt, hash});
}
async function verifySecret(key, value){
  const stored = loadJSON(key, null);
  if(!stored) return false;
  const hash = await sha256Hex(stored.salt + ':' + value);
  return hash === stored.hash;
}
function hasPasswordConfigured(){ return !!loadJSON(K_PWHASH, null); }

/* ============================= بوابة الدخول ============================= */
function showAuthCard(mode){
  document.getElementById('loginGate').classList.remove('hidden');
  document.getElementById('appRoot').classList.add('hidden');
  ['Setup','Login','Pin'].forEach(m=>{
    document.getElementById('authCard'+m).classList.toggle('hidden', m.toLowerCase()!==mode);
  });
}
function initLoginGate(){
  const auth = loadJSON(K_AUTH, null);
  if(!hasPasswordConfigured()){
    if(auth && auth.name) document.getElementById('setupName').value = auth.name;
    showAuthCard('setup');
  } else if(sessionStorage.getItem(SS_UNLOCKED)==='1'){
    if(sessionStorage.getItem(SS_PIN_LOCKED)==='1') showAuthCard('pin');
    else showApp(auth);
  } else {
    showAuthCard('login');
  }

  document.getElementById('btnSetupSave').addEventListener('click', async ()=>{
    const name = document.getElementById('setupName').value.trim() || 'الحارس(ة) العام(ة)';
    const pw = document.getElementById('setupPw').value;
    const pwConfirm = document.getElementById('setupPwConfirm').value;
    const pin = document.getElementById('setupPin').value.trim();
    const pinConfirm = document.getElementById('setupPinConfirm').value.trim();
    const errEl = document.getElementById('setupError');
    errEl.classList.add('hidden');
    if(pw.length < 4){ errEl.textContent = 'كلمة المرور يجب أن تكون 4 أحرف على الأقل'; errEl.classList.remove('hidden'); return; }
    if(pw !== pwConfirm){ errEl.textContent = 'كلمتا المرور غير متطابقتين'; errEl.classList.remove('hidden'); return; }
    if(!/^\d{4,6}$/.test(pin)){ errEl.textContent = 'الرقم السري يجب أن يكون من 4 إلى 6 أرقام'; errEl.classList.remove('hidden'); return; }
    if(pin !== pinConfirm){ errEl.textContent = 'الرقمان السريان غير متطابقين'; errEl.classList.remove('hidden'); return; }
    await setSecret(K_PWHASH, pw);
    await setSecret(K_PINHASH, pin);
    const newAuth = { name, role:'حارس عام', loggedInAt: new Date().toISOString() };
    saveJSON(K_AUTH, newAuth);
    sessionStorage.setItem(SS_UNLOCKED, '1');
    sessionStorage.removeItem(SS_PIN_LOCKED);
    showApp(newAuth);
  });

  document.getElementById('btnLoginSubmit').addEventListener('click', async ()=>{
    const pw = document.getElementById('loginPw').value;
    const errEl = document.getElementById('loginError');
    const ok = await verifySecret(K_PWHASH, pw);
    if(!ok){ errEl.textContent = 'كلمة المرور غير صحيحة'; errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');
    document.getElementById('loginPw').value = '';
    sessionStorage.setItem(SS_UNLOCKED, '1');
    sessionStorage.removeItem(SS_PIN_LOCKED);
    showApp(loadJSON(K_AUTH, {name:'الحارس(ة) العام(ة)', role:'حارس عام'}));
  });
  document.getElementById('loginPw').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('btnLoginSubmit').click(); });

  document.getElementById('btnPinSubmit').addEventListener('click', async ()=>{
    const pin = document.getElementById('pinInput').value;
    const errEl = document.getElementById('pinError');
    const ok = await verifySecret(K_PINHASH, pin);
    if(!ok){ errEl.textContent = 'الرقم السري غير صحيح'; errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');
    document.getElementById('pinInput').value = '';
    sessionStorage.removeItem(SS_PIN_LOCKED);
    showApp(loadJSON(K_AUTH, {name:'الحارس(ة) العام(ة)', role:'حارس عام'}));
  });
  document.getElementById('pinInput').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('btnPinSubmit').click(); });

  document.getElementById('btnLock').addEventListener('click', ()=>{
    sessionStorage.setItem(SS_PIN_LOCKED, '1');
    showAuthCard('pin');
  });
  document.getElementById('btnLogout').addEventListener('click', ()=>{
    if(confirm('هل تريد تسجيل الخروج؟ (البيانات لن تُحذف، وستحتاج كلمة المرور فقط للعودة)')){
      sessionStorage.removeItem(SS_UNLOCKED);
      sessionStorage.removeItem(SS_PIN_LOCKED);
      showAuthCard('login');
    }
  });
}
let appBooted = false;
function showApp(auth){
  document.getElementById('loginGate').classList.add('hidden');
  document.getElementById('appRoot').classList.remove('hidden');
  document.getElementById('userBadge').textContent = '👤 ' + auth.name + ' — ' + auth.role;
  if(!appBooted){
    appBooted = true;
    bootApp();
  } else {
    // العودة من قفل سريع (رقم سري) — نستأنف نفس الشاشة بدل إعادة كل الإعداد
    showView(state.currentView);
  }
}

/* ============================= التنقل بين الشاشات ============================= */
function showView(id){
  document.querySelectorAll('#appRoot > main > .view').forEach(v=>v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  state.currentView = id;
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===id));
  window.scrollTo({top:0, behavior:'instant'});
  if(id==='view-dashboard') renderDashboard();
  if(id==='view-students'){
    document.getElementById('students-detail-view').classList.add('hidden');
    document.getElementById('students-list-view').classList.remove('hidden');
    state.currentStudentId = null;
    renderStudentsTable();
  }
  if(id==='view-teachers') renderTeachersTable();
  if(id==='view-attendance') renderAttendanceView();
  if(id==='view-behavior') renderBehaviorView();
  if(id==='view-messages') renderMessagesView();
  if(id==='view-reports') { showReportsSubview('reports-home-view'); renderHome(); }
  if(id==='view-dailylog') renderDailyLog();
  if(id==='view-stats') renderStats();
  if(id==='view-settings') renderSettingsView();
}
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>showView(btn.dataset.view));
});

/* ============================= البحث الشامل في الرأس ============================= */
function initGlobalSearch(){
  const input = document.getElementById('globalSearch');
  const results = document.getElementById('globalSearchResults');
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q){ results.classList.add('hidden'); results.innerHTML=''; return; }
    const matches = state.students.filter(s=> s.fullName.toLowerCase().includes(q) || s.section.toLowerCase().includes(q)).slice(0,8);
    if(matches.length===0){ results.innerHTML = '<div class="sr-item">لا توجد نتائج</div>'; }
    else {
      results.innerHTML = matches.map(s=>`<div class="sr-item" data-id="${esc(s.id)}">${esc(s.fullName)}<small>${esc(s.section)}</small></div>`).join('');
    }
    results.classList.remove('hidden');
  });
  results.addEventListener('click', e=>{
    const item = e.target.closest('.sr-item[data-id]');
    if(!item) return;
    input.value=''; results.classList.add('hidden');
    showView('view-students');
    openStudentDetail(item.dataset.id);
  });
  document.addEventListener('click', e=>{
    if(!e.target.closest('.header-search')) results.classList.add('hidden');
  });
}

/* ============================= لوحة اليوم (Dashboard) ============================= */
function renderDashboard(){
  document.getElementById('todayDateLabel').textContent = new Date().toLocaleDateString('ar-MA', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  const today = todayISO();
  const absToday = state.attendance.filter(a=>a.date===today && a.type==='absence').length;
  const tardyToday = state.attendance.filter(a=>a.date===today && a.type==='tardiness').length;
  const behToday = state.behavior.filter(b=>b.date===today).length;
  const pendingCases = state.behavior.filter(b=>b.fileStatus==='open').length;
  const msgsToday = state.msglog.filter(m=>m.date===today).length;

  const cards = [
    {n:absToday, l:'الغائبون اليوم', c:'red', i:'📋'},
    {n:tardyToday, l:'المتأخرون اليوم', c:'orange', i:'⏱️'},
    {n:behToday, l:'الحالات السلوكية اليوم', c:'orange', i:'⚖️'},
    {n:pendingCases, l:'حالات تنتظر المتابعة', c:'red', i:'📂'},
    {n:msgsToday, l:'اتصالات اليوم بالآباء', c:'green', i:'✉️'}
  ];
  document.getElementById('statGrid').innerHTML = cards.map(c=>`
    <div class="stat-card ${c.c}">
      <div class="stat-icon">${c.i}</div>
      <div class="stat-num">${c.n}</div>
      <div class="stat-label">${esc(c.l)}</div>
    </div>`).join('');

  // آخر الأحداث اليوم
  const events = [];
  state.attendance.filter(a=>a.date===today).forEach(a=>{
    const s = studentById(a.studentId); if(!s) return;
    events.push({time:a.time||'', tag: a.type==='absence' ? 'غياب':'تأخر', tagClass: a.type==='absence'?'tag-red':'tag-orange',
      text:`${s.fullName} — ${s.section}`});
  });
  state.behavior.filter(b=>b.date===today).forEach(b=>{
    const s = studentById(b.studentId); if(!s) return;
    events.push({time:'', tag:'سلوك', tagClass: b.severity==='urgent'?'tag-red':'tag-orange', text:`${s.fullName} — ${b.type}`});
  });
  state.msglog.filter(m=>m.date===today).forEach(m=>{
    const s = studentById(m.studentId);
    events.push({time:'', tag:'اتصال', tagClass:'tag-green', text:`${s? s.fullName : '—'} — ${m.templateTitle}`});
  });
  const wrap = document.getElementById('dashRecentToday');
  wrap.innerHTML = events.length ? events.map(e=>`
    <div class="recent-item"><span class="tag ${e.tagClass}">${esc(e.tag)}</span><span>${esc(e.text)}</span>${e.time?`<span>${esc(e.time)}</span>`:''}</div>
  `).join('') : `<div class="empty-hint">لا توجد أحداث مسجلة اليوم بعد.</div>`;
}
document.querySelectorAll('.qa-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const qa = btn.dataset.qa;
    if(qa==='attendance') showView('view-attendance');
    else if(qa==='behavior') showView('view-behavior');
    else if(qa==='intervention'){ showView('view-behavior'); document.getElementById('behAction').value='إحالة على الإدارة'; }
    else if(qa==='summon'){ state.pendingMessageContext = {templateKey:'summon'}; showView('view-messages'); }
    else if(qa==='dailyreport'){ generateDailyReport(); }
  });
});

/* ============================= سجل التلاميذ ============================= */
function populateSelectOptions(sel, options, placeholder){
  sel.innerHTML = (placeholder!==undefined ? `<option value="">${esc(placeholder)}</option>` : '') +
    options.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('');
}
function populateSectionFilterSelects(){
  populateSelectOptions(document.getElementById('studentSectionFilter'), state.settings.sections, 'كل الأقسام');
}
function renderStudentsTable(){
  populateSectionFilterSelects();
  const q = (document.getElementById('studentSearch').value||'').trim().toLowerCase();
  const secF = document.getElementById('studentSectionFilter').value;
  const statF = document.getElementById('studentStatusFilter').value;
  const rows = state.students.filter(s=>{
    if(secF && s.section!==secF) return false;
    if(statF && s.status!==statF) return false;
    if(q && !(s.fullName.toLowerCase().includes(q) || s.section.toLowerCase().includes(q))) return false;
    return true;
  });
  const tbody = document.getElementById('studentsTbody');
  if(rows.length===0){ tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">لا يوجد تلاميذ مطابقون.</td></tr>`; return; }
  tbody.innerHTML = rows.map(s=>`
    <tr>
      <td>${esc(s.fullName)}</td>
      <td>${esc(s.section)}</td>
      <td><span class="status-badge status-${s.status}">${esc(STATUS_LABELS[s.status])}</span></td>
      <td>${esc(s.parentPhone||'—')}</td>
      <td>
        <button class="btn btn-primary btn-sm" data-stu-act="open" data-id="${esc(s.id)}">فتح</button>
        <button class="btn btn-light btn-sm" data-stu-act="edit" data-id="${esc(s.id)}">تعديل</button>
        <button class="btn btn-danger btn-sm" data-stu-act="del" data-id="${esc(s.id)}">حذف</button>
      </td>
    </tr>`).join('');
}
document.getElementById('studentSearch').addEventListener('input', renderStudentsTable);
document.getElementById('studentSectionFilter').addEventListener('change', renderStudentsTable);
document.getElementById('studentStatusFilter').addEventListener('change', renderStudentsTable);
document.getElementById('studentsTbody').addEventListener('click', e=>{
  const btn = e.target.closest('button[data-stu-act]'); if(!btn) return;
  const id = btn.dataset.id, act = btn.dataset.stuAct;
  if(act==='open') openStudentDetail(id);
  else if(act==='edit') openStudentForm(studentById(id));
  else if(act==='del'){
    const s = studentById(id);
    if(confirm(`هل تريد حذف التلميذ(ة) "${s.fullName}"؟ سيتم حذف كل السجلات المرتبطة به (الغياب، السلوك، الاتصالات).`)){
      state.students = state.students.filter(x=>x.id!==id);
      state.attendance = state.attendance.filter(x=>x.studentId!==id);
      state.behavior = state.behavior.filter(x=>x.studentId!==id);
      state.msglog = state.msglog.filter(x=>x.studentId!==id);
      saveStudents(); saveAttendance(); saveBehavior(); saveMsgLog();
      renderStudentsTable();
      toast('تم حذف التلميذ وسجلاته');
    }
  }
});
document.getElementById('btnAddStudent').addEventListener('click', ()=>openStudentForm(null));

/* ---- تصدير واستيراد لائحة التلاميذ (CSV) ---- */
function csvEscape(v){
  const s = String(v===undefined||v===null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
}
function parseCSVLine(line){
  // يدعم التبويب (اللصق من Excel) أو الفاصلة اللاتينية "," أو الفاصلة العربية "،"، مع دعم بسيط للحقول المحاطة بعلامات اقتباس
  const delim = line.includes('\t') ? '\t' : (line.includes('،') ? '،' : ',');
  const out = []; let cur = ''; let inQuotes = false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(inQuotes){
      if(ch === '"'){ if(line[i+1] === '"'){ cur += '"'; i++; } else inQuotes = false; }
      else cur += ch;
    } else {
      if(ch === '"') inQuotes = true;
      else if(ch === delim){ out.push(cur); cur=''; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out.map(s=>s.trim());
}
document.getElementById('btnExportStudents').addEventListener('click', ()=>{
  if(state.students.length===0){ toast('لا يوجد تلاميذ لتصديرهم'); return; }
  const header = ['الاسم الكامل','القسم','هاتف ولي الأمر','هاتف ثانٍ','الحالة','ملاحظات'];
  const rows = state.students.map(s=>[s.fullName, s.section, s.parentPhone||'', s.parentPhone2||'', STATUS_LABELS[s.status], s.notes||'']);
  const csv = [header].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'لائحة-التلاميذ-' + todayISO() + '.csv';
  a.click(); URL.revokeObjectURL(a.href);
  toast('تم تصدير اللائحة (' + state.students.length + ' تلميذ)');
});
document.getElementById('btnImportStudents').addEventListener('click', ()=>{
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>⬆️ استيراد لائحة تلاميذ</h3>
      <p class="hint">الصق لائحة من Excel أو اكتبها يدوياً — سطر لكل تلميذ(ة)، بهذا الترتيب:<br>
      <b>الاسم الكامل، القسم، هاتف ولي الأمر، هاتف ثانٍ (اختياري)، ملاحظات (اختياري)</b></p>
      <div class="field-group"><textarea id="importCsvText" rows="8" placeholder="مثال:&#10;أحمد الإدريسي، الأولى إعدادي 1، 0612345678"></textarea></div>
      <div class="field-group">
        <label>أو اختر ملف CSV</label>
        <input type="file" id="importCsvFile" accept=".csv,text/csv">
      </div>
      <div class="modal-actions">
        <button class="btn btn-light" id="importCsvCancel">إلغاء</button>
        <button class="btn btn-primary" id="importCsvOk">استيراد</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#importCsvCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#importCsvFile').addEventListener('change', e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ bg.querySelector('#importCsvText').value = reader.result; };
    reader.readAsText(file);
  });
  bg.querySelector('#importCsvOk').addEventListener('click', ()=>{
    const text = bg.querySelector('#importCsvText').value.trim();
    if(!text){ toast('لا يوجد محتوى للاستيراد'); return; }
    const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    let added = 0, skippedDup = 0, skippedInvalid = 0;
    lines.forEach(line=>{
      const cols = parseCSVLine(line);
      const [fullName, section, parentPhone, parentPhone2, notes] = cols;
      if(!fullName || !section || fullName.includes('الاسم الكامل')){ skippedInvalid++; return; } // يتجاهل الأسطر الناقصة أو سطر العنوان إن أُعيد لصقه
      const dup = state.students.some(s=>s.fullName===fullName && s.section===section);
      if(dup){ skippedDup++; return; }
      state.students.push({
        id: uid('stu'), fullName, section,
        parentPhone: parentPhone||'', parentPhone2: parentPhone2||'', notes: notes||'',
        status:'normal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
      added++;
    });
    saveStudents();
    renderStudentsTable();
    bg.remove();
    toast(`تم استيراد ${added} تلميذ(ة)` + (skippedDup?` — تم تجاهل ${skippedDup} مكرر`:'') + (skippedInvalid?` — ${skippedInvalid} سطر غير صالح`:''));
  });
});

function openStudentForm(student){
  const isEdit = !!student;
  const s = student || {fullName:'', section: state.settings.sections[0]||'', parentPhone:'', parentPhone2:'', notes:'', status:'normal'};
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${isEdit ? '✏️ تعديل بيانات تلميذ' : '➕ إضافة تلميذ جديد'}</h3>
      <div class="field-group"><label>الاسم الكامل <span class="req">*</span></label><input type="text" id="stuName" value="${esc(s.fullName)}"></div>
      <div class="field-group"><label>القسم <span class="req">*</span></label>
        <input type="text" id="stuSection" list="stuSectionList" value="${esc(s.section)}">
        <datalist id="stuSectionList">${state.settings.sections.map(x=>`<option value="${esc(x)}">`).join('')}</datalist>
      </div>
      <div class="field-group"><label>هاتف ولي الأمر</label><input type="text" id="stuPhone1" value="${esc(s.parentPhone)}" placeholder="06XXXXXXXX"></div>
      <div class="field-group"><label>رقم ثانٍ (اختياري)</label><input type="text" id="stuPhone2" value="${esc(s.parentPhone2)}"></div>
      <div class="field-group"><label>ملاحظات خاصة</label><textarea id="stuNotes">${esc(s.notes)}</textarea></div>
      <div class="field-group"><label>الحالة</label>
        <select id="stuStatus">
          <option value="normal" ${s.status==='normal'?'selected':''}>عادي</option>
          <option value="tracking" ${s.status==='tracking'?'selected':''}>يحتاج تتبع</option>
          <option value="urgent" ${s.status==='urgent'?'selected':''}>حالة مستعجلة</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-light" id="stuCancel">إلغاء</button>
        <button class="btn btn-primary" id="stuSave">💾 حفظ</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#stuCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#stuSave').addEventListener('click', ()=>{
    const fullName = bg.querySelector('#stuName').value.trim();
    const section = bg.querySelector('#stuSection').value.trim();
    if(!fullName || !section){ toast('يرجى إدخال الاسم والقسم'); return; }
    const data = {
      fullName, section,
      parentPhone: bg.querySelector('#stuPhone1').value.trim(),
      parentPhone2: bg.querySelector('#stuPhone2').value.trim(),
      notes: bg.querySelector('#stuNotes').value.trim(),
      status: bg.querySelector('#stuStatus').value,
      updatedAt: new Date().toISOString()
    };
    if(isEdit){
      Object.assign(student, data);
    } else {
      state.students.push({ id: uid('stu'), createdAt: new Date().toISOString(), ...data });
    }
    saveStudents();
    bg.remove();
    renderStudentsTable();
    if(isEdit && state.currentStudentId === student.id) openStudentDetail(student.id);
    toast('تم الحفظ');
  });
}

function openStudentDetail(id){
  const s = studentById(id);
  if(!s){ toast('تعذر العثور على التلميذ'); return; }
  state.currentStudentId = id;
  document.getElementById('students-list-view').classList.add('hidden');
  document.getElementById('students-detail-view').classList.remove('hidden');
  document.getElementById('studentDetailName').textContent = s.fullName;
  document.getElementById('sdSection').textContent = s.section;
  document.getElementById('sdStatus').innerHTML = `<span class="status-badge status-${s.status}">${esc(STATUS_LABELS[s.status])}</span>`;
  document.getElementById('sdPhone1').textContent = s.parentPhone || '—';
  document.getElementById('sdPhone2').textContent = s.parentPhone2 || '—';
  document.getElementById('sdNotes').textContent = s.notes || '—';
  renderStudentTabs(id);
}
document.getElementById('btnBackToStudents').addEventListener('click', ()=>{
  document.getElementById('students-detail-view').classList.add('hidden');
  document.getElementById('students-list-view').classList.remove('hidden');
  state.currentStudentId = null;
  renderStudentsTable();
});
document.getElementById('btnEditStudent').addEventListener('click', ()=>openStudentForm(studentById(state.currentStudentId)));
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['attendance','behavior','messages'].forEach(t=>{
      document.getElementById('sdTab'+t[0].toUpperCase()+t.slice(1)).classList.toggle('hidden', t!==btn.dataset.tab);
    });
  });
});
function renderStudentTabs(id){
  const att = state.attendance.filter(a=>a.studentId===id).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('sdTabAttendance').innerHTML = att.length ? `
    <table class="log-table"><thead><tr><th>النوع</th><th>التاريخ</th><th>الساعة</th><th>الوضعية</th><th>السبب</th></tr></thead>
    <tbody>${att.map(a=>`<tr><td>${esc(ATTTYPE_LABELS[a.type])}</td><td>${esc(a.date)}</td><td>${esc(a.time||'—')}</td><td>${esc(JUSTIF_LABELS[a.justification])}</td><td>${esc(a.reason||'—')}</td></tr>`).join('')}</tbody></table>
  ` : `<div class="empty-hint">لا توجد سجلات غياب أو تأخر لهذا التلميذ.</div>`;

  const beh = state.behavior.filter(b=>b.studentId===id).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('sdTabBehavior').innerHTML = beh.length ? `
    <table class="log-table"><thead><tr><th>النوع</th><th>الخطورة</th><th>التاريخ</th><th>الإجراء</th><th>الملف</th></tr></thead>
    <tbody>${beh.map(b=>`<tr><td>${esc(b.type)}</td><td>${esc(SEVERITY_LABELS[b.severity])}</td><td>${esc(b.date)}</td><td>${esc(b.action||'—')}</td><td>${esc(FILESTATUS_LABELS[b.fileStatus])}</td></tr>`).join('')}</tbody></table>
  ` : `<div class="empty-hint">لا توجد حالات سلوكية لهذا التلميذ.</div>`;

  const msgs = state.msglog.filter(m=>m.studentId===id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  document.getElementById('sdTabMessages').innerHTML = msgs.length ? `
    <table class="log-table"><thead><tr><th>القالب</th><th>التاريخ</th></tr></thead>
    <tbody>${msgs.map(m=>`<tr><td>${esc(m.templateTitle)}</td><td>${esc(m.date)}</td></tr>`).join('')}</tbody></table>
  ` : `<div class="empty-hint">لا توجد اتصالات مسجلة لهذا التلميذ.</div>`;
}
document.getElementById('btnStudentReport').addEventListener('click', ()=>generateStudentReport(state.currentStudentId));

/* ============================= لائحة الأساتذة ============================= */
function renderTeachersTable(){
  const q = (document.getElementById('teacherSearch').value||'').trim().toLowerCase();
  const rows = state.teachers.filter(t=>{
    if(!q) return true;
    return t.fullName.toLowerCase().includes(q) || (t.subject||'').toLowerCase().includes(q) || (t.sections||'').toLowerCase().includes(q);
  });
  const tbody = document.getElementById('teachersTbody');
  if(rows.length===0){ tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">لا يوجد أساتذة مطابقون.</td></tr>`; return; }
  tbody.innerHTML = rows.map(t=>`
    <tr>
      <td>${esc(t.fullName)}</td>
      <td>${esc(t.subject||'—')}</td>
      <td>${esc(t.sections||'—')}</td>
      <td>${esc(t.phone||'—')}</td>
      <td>
        <button class="btn btn-light btn-sm" data-tch-act="edit" data-id="${esc(t.id)}">تعديل</button>
        <button class="btn btn-danger btn-sm" data-tch-act="del" data-id="${esc(t.id)}">حذف</button>
      </td>
    </tr>`).join('');
}
document.getElementById('teacherSearch').addEventListener('input', renderTeachersTable);
document.getElementById('teachersTbody').addEventListener('click', e=>{
  const btn = e.target.closest('button[data-tch-act]'); if(!btn) return;
  const id = btn.dataset.id, act = btn.dataset.tchAct;
  const teacher = state.teachers.find(t=>t.id===id);
  if(act==='edit') openTeacherForm(teacher);
  else if(act==='del'){
    if(confirm(`هل تريد حذف الأستاذ(ة) "${teacher.fullName}"؟`)){
      state.teachers = state.teachers.filter(t=>t.id!==id);
      saveTeachers(); renderTeachersTable();
      toast('تم الحذف');
    }
  }
});
document.getElementById('btnAddTeacher').addEventListener('click', ()=>openTeacherForm(null));
function openTeacherForm(teacher){
  const isEdit = !!teacher;
  const t = teacher || {fullName:'', subject:'', sections:'', phone:'', notes:''};
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${isEdit ? '✏️ تعديل بيانات أستاذ(ة)' : '➕ إضافة أستاذ(ة) جديد(ة)'}</h3>
      <div class="field-group"><label>الاسم الكامل <span class="req">*</span></label><input type="text" id="tchName" value="${esc(t.fullName)}"></div>
      <div class="field-group"><label>المادة</label><input type="text" id="tchSubject" value="${esc(t.subject)}"></div>
      <div class="field-group"><label>الأقسام (مفصولة بفاصلة)</label><input type="text" id="tchSections" value="${esc(t.sections)}" placeholder="مثال: الأولى إعدادي 1، الثانية إعدادي 2"></div>
      <div class="field-group"><label>الهاتف</label><input type="text" id="tchPhone" value="${esc(t.phone)}" placeholder="06XXXXXXXX"></div>
      <div class="field-group"><label>ملاحظات</label><textarea id="tchNotes">${esc(t.notes)}</textarea></div>
      <div class="modal-actions">
        <button class="btn btn-light" id="tchCancel">إلغاء</button>
        <button class="btn btn-primary" id="tchSave">💾 حفظ</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#tchCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#tchSave').addEventListener('click', ()=>{
    const fullName = bg.querySelector('#tchName').value.trim();
    if(!fullName){ toast('يرجى إدخال الاسم الكامل'); return; }
    const data = {
      fullName,
      subject: bg.querySelector('#tchSubject').value.trim(),
      sections: bg.querySelector('#tchSections').value.trim(),
      phone: bg.querySelector('#tchPhone').value.trim(),
      notes: bg.querySelector('#tchNotes').value.trim(),
      updatedAt: new Date().toISOString()
    };
    if(isEdit) Object.assign(teacher, data);
    else state.teachers.push({ id: uid('tch'), createdAt: new Date().toISOString(), ...data });
    saveTeachers();
    bg.remove();
    renderTeachersTable();
    toast('تم الحفظ');
  });
}
document.getElementById('btnExportTeachers').addEventListener('click', ()=>{
  if(state.teachers.length===0){ toast('لا يوجد أساتذة لتصديرهم'); return; }
  const header = ['الاسم الكامل','المادة','الأقسام','الهاتف','ملاحظات'];
  const rows = state.teachers.map(t=>[t.fullName, t.subject||'', t.sections||'', t.phone||'', t.notes||'']);
  const csv = [header].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'لائحة-الأساتذة-' + todayISO() + '.csv';
  a.click(); URL.revokeObjectURL(a.href);
  toast('تم تصدير اللائحة (' + state.teachers.length + ' أستاذ/ة)');
});
document.getElementById('btnImportTeachers').addEventListener('click', ()=>{
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>⬆️ استيراد لائحة أساتذة</h3>
      <p class="hint">الصق لائحة من Excel أو اكتبها يدوياً — سطر لكل أستاذ(ة)، بهذا الترتيب:<br>
      <b>الاسم الكامل، المادة، الأقسام، الهاتف (اختياري)، ملاحظات (اختياري)</b></p>
      <div class="field-group"><textarea id="importTchText" rows="8" placeholder="مثال:&#10;ذ. سفيان الحمداوي، الرياضيات، الأولى إعدادي 1"></textarea></div>
      <div class="field-group">
        <label>أو اختر ملف CSV</label>
        <input type="file" id="importTchFile" accept=".csv,text/csv">
      </div>
      <div class="modal-actions">
        <button class="btn btn-light" id="importTchCancel">إلغاء</button>
        <button class="btn btn-primary" id="importTchOk">استيراد</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#importTchCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#importTchFile').addEventListener('change', e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ bg.querySelector('#importTchText').value = reader.result; };
    reader.readAsText(file);
  });
  bg.querySelector('#importTchOk').addEventListener('click', ()=>{
    const text = bg.querySelector('#importTchText').value.trim();
    if(!text){ toast('لا يوجد محتوى للاستيراد'); return; }
    const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    let added = 0, skippedDup = 0, skippedInvalid = 0;
    lines.forEach(line=>{
      const cols = parseCSVLine(line);
      const [fullName, subject, sections, phone, notes] = cols;
      if(!fullName || fullName.includes('الاسم الكامل')){ skippedInvalid++; return; }
      const dup = state.teachers.some(t=>t.fullName===fullName && t.subject===(subject||''));
      if(dup){ skippedDup++; return; }
      state.teachers.push({
        id: uid('tch'), fullName, subject: subject||'', sections: sections||'', phone: phone||'', notes: notes||'',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
      added++;
    });
    saveTeachers();
    renderTeachersTable();
    bg.remove();
    toast(`تم استيراد ${added} أستاذ(ة)` + (skippedDup?` — تم تجاهل ${skippedDup} مكرر`:'') + (skippedInvalid?` — ${skippedInvalid} سطر غير صالح`:''));
  });
});

/* ============================= الغياب والتأخر ============================= */
function renderAttendanceView(){
  populateSelectOptions(document.getElementById('attSection'), state.settings.sections);
  populateAttStudents();
  document.getElementById('attDate').value = todayISO();
  document.getElementById('attTime').value = nowHM();
  document.getElementById('attAlertBox').classList.add('hidden');
  renderAttendanceList();
}
function populateAttStudents(){
  const sec = document.getElementById('attSection').value;
  populateSelectOptions(document.getElementById('attStudent'), studentsInSection(sec).map(s=>s.fullName));
  // نخزن id في dataset عبر value=name، سنبحث بالاسم+القسم عند الحفظ
}
document.getElementById('attSection').addEventListener('change', populateAttStudents);

function currentAttStudent(){
  const sec = document.getElementById('attSection').value;
  const name = document.getElementById('attStudent').value;
  return state.students.find(s=>s.section===sec && s.fullName===name);
}

function renderAttendanceList(){
  const q = (document.getElementById('attListSearch').value||'').trim().toLowerCase();
  const rows = state.attendance.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(a=>{
    const s = studentById(a.studentId);
    if(!s) return false;
    if(q && !(s.fullName.toLowerCase().includes(q) || s.section.toLowerCase().includes(q))) return false;
    return true;
  }).slice(0,40);
  const tbody = document.getElementById('attTbody');
  tbody.innerHTML = rows.length ? rows.map(a=>{
    const s = studentById(a.studentId);
    return `<tr>
      <td>${esc(s.fullName)}</td><td>${esc(s.section)}</td><td>${esc(ATTTYPE_LABELS[a.type])}</td>
      <td>${esc(a.date)}</td><td>${esc(JUSTIF_LABELS[a.justification])}</td>
      <td><button class="btn btn-danger btn-sm" data-att-del="${esc(a.id)}">حذف</button></td>
    </tr>`;
  }).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:16px">لا توجد تسجيلات بعد.</td></tr>`;
}
document.getElementById('attListSearch').addEventListener('input', renderAttendanceList);
document.getElementById('attTbody').addEventListener('click', e=>{
  const btn = e.target.closest('[data-att-del]'); if(!btn) return;
  if(confirm('حذف هذا التسجيل؟')){
    state.attendance = state.attendance.filter(a=>a.id!==btn.dataset.attDel);
    saveAttendance(); renderAttendanceList();
    toast('تم الحذف');
  }
});

function saveAttendanceEntry(){
  const student = currentAttStudent();
  if(!student){ toast('يرجى اختيار القسم والتلميذ(ة)'); return null; }
  const record = {
    id: uid('att'), studentId: student.id,
    type: document.getElementById('attType').value,
    date: document.getElementById('attDate').value || todayISO(),
    time: document.getElementById('attTime').value || '',
    reason: document.getElementById('attReason').value.trim(),
    justification: document.getElementById('attJustification').value,
    note: document.getElementById('attNote').value.trim(),
    createdAt: new Date().toISOString()
  };
  state.attendance.push(record);
  saveAttendance();

  // تنبيه التكرار (أكثر من 3 مرات لنفس النوع)
  const count = state.attendance.filter(a=>a.studentId===student.id && a.type===record.type).length;
  const box = document.getElementById('attAlertBox');
  if(count>=3){
    box.textContent = `⚠️ تنبيه: هذه هي الحالة رقم ${count} من نوع "${ATTTYPE_LABELS[record.type]}" لهذا التلميذ. يُنصح بمتابعة الملف أو التواصل مع ولي الأمر.`;
    box.className = 'alert-box danger';
    box.classList.remove('hidden');
    if(student.status==='normal'){ student.status='tracking'; student.updatedAt=new Date().toISOString(); saveStudents(); }
  } else {
    box.classList.add('hidden');
  }
  renderAttendanceList();
  renderDashboard();
  return record;
}
document.getElementById('btnAttSave').addEventListener('click', ()=>{ if(saveAttendanceEntry()) toast('تم الحفظ'); });
document.getElementById('btnAttAddToDaily').addEventListener('click', ()=>{
  if(saveAttendanceEntry()) toast('تمت الإضافة — سيظهر تلقائياً في تقرير اليوم');
});
document.getElementById('btnAttMessage').addEventListener('click', ()=>{
  const student = currentAttStudent();
  if(!student){ toast('يرجى اختيار القسم والتلميذ(ة)'); return; }
  const type = document.getElementById('attType').value;
  state.pendingMessageContext = { studentId: student.id, templateKey: type==='absence'?'absence':'tardiness' };
  showView('view-messages');
});

/* ============================= السلوك والتدخلات ============================= */
function renderBehaviorView(){
  populateSelectOptions(document.getElementById('behSection'), state.settings.sections);
  populateBehStudents();
  populateSelectOptions(document.getElementById('behType'), state.settings.caseTypes);
  populateSelectOptions(document.getElementById('behAction'), ACTIONS_LIST);
  document.getElementById('behDate').value = todayISO();
  renderBehaviorList();
}
function populateBehStudents(){
  const sec = document.getElementById('behSection').value;
  populateSelectOptions(document.getElementById('behStudent'), studentsInSection(sec).map(s=>s.fullName));
}
document.getElementById('behSection').addEventListener('change', populateBehStudents);
function currentBehStudent(){
  const sec = document.getElementById('behSection').value;
  const name = document.getElementById('behStudent').value;
  return state.students.find(s=>s.section===sec && s.fullName===name);
}
function renderBehaviorList(){
  const q = (document.getElementById('behListSearch').value||'').trim().toLowerCase();
  const fileF = document.getElementById('behFileFilter').value;
  const rows = state.behavior.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(b=>{
    const s = studentById(b.studentId); if(!s) return false;
    if(fileF && b.fileStatus!==fileF) return false;
    if(q && !(s.fullName.toLowerCase().includes(q) || b.type.toLowerCase().includes(q))) return false;
    return true;
  });
  const tbody = document.getElementById('behTbody');
  tbody.innerHTML = rows.length ? rows.map(b=>{
    const s = studentById(b.studentId);
    return `<tr>
      <td>${esc(s.fullName)}</td><td>${esc(b.type)}</td><td>${esc(SEVERITY_LABELS[b.severity])}</td>
      <td>${esc(b.date)}</td><td>${esc(FILESTATUS_LABELS[b.fileStatus])}</td>
      <td>
        <button class="btn btn-light btn-sm" data-beh-toggle="${esc(b.id)}">${b.fileStatus==='open'?'إغلاق الملف':'إعادة الفتح'}</button>
        <button class="btn btn-danger btn-sm" data-beh-del="${esc(b.id)}">حذف</button>
      </td>
    </tr>`;
  }).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:16px">لا توجد حالات مسجلة بعد.</td></tr>`;
}
document.getElementById('behListSearch').addEventListener('input', renderBehaviorList);
document.getElementById('behFileFilter').addEventListener('change', renderBehaviorList);
document.getElementById('behTbody').addEventListener('click', e=>{
  const delBtn = e.target.closest('[data-beh-del]');
  const toggleBtn = e.target.closest('[data-beh-toggle]');
  if(delBtn){
    if(confirm('حذف هذه الحالة؟')){
      state.behavior = state.behavior.filter(b=>b.id!==delBtn.dataset.behDel);
      saveBehavior(); renderBehaviorList();
      toast('تم الحذف');
    }
  } else if(toggleBtn){
    const rec = state.behavior.find(b=>b.id===toggleBtn.dataset.behToggle);
    rec.fileStatus = rec.fileStatus==='open' ? 'closed' : 'open';
    rec.updatedAt = new Date().toISOString();
    saveBehavior(); renderBehaviorList();
    toast('تم تحديث حالة الملف');
  }
});
document.getElementById('btnBehSave').addEventListener('click', ()=>{
  const student = currentBehStudent();
  if(!student){ toast('يرجى اختيار القسم والتلميذ(ة)'); return; }
  const description = document.getElementById('behDescription').value.trim();
  if(!description){ toast('يرجى كتابة وصف الحالة'); return; }
  const record = {
    id: uid('beh'), studentId: student.id,
    date: document.getElementById('behDate').value || todayISO(),
    type: document.getElementById('behType').value,
    severity: document.getElementById('behSeverity').value,
    description,
    action: document.getElementById('behAction').value,
    followUpDate: document.getElementById('behFollowUp').value,
    fileStatus: document.getElementById('behFileStatus').value,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  state.behavior.push(record);
  if(record.severity==='urgent') student.status = 'urgent';
  else if(student.status==='normal') student.status = 'tracking';
  student.updatedAt = new Date().toISOString();
  saveBehavior(); saveStudents();
  renderBehaviorList(); renderDashboard();
  toast('تم الحفظ');
});
document.getElementById('btnBehMessage').addEventListener('click', ()=>{
  const student = currentBehStudent();
  if(!student){ toast('يرجى اختيار القسم والتلميذ(ة)'); return; }
  state.pendingMessageContext = { studentId: student.id, templateKey:'behavior', caseType: document.getElementById('behType').value };
  showView('view-messages');
});

/* ============================= التواصل مع أولياء الأمور ============================= */
function renderMessagesView(){
  populateSelectOptions(document.getElementById('msgTemplate'), state.settings.messageTemplates.map(t=>t.title));
  populateSelectOptions(document.getElementById('msgSection'), state.settings.sections);
  populateMsgStudents();
  const ctx = state.pendingMessageContext;
  if(ctx){
    const tpl = state.settings.messageTemplates.find(t=>t.key===ctx.templateKey);
    if(tpl) document.getElementById('msgTemplate').value = tpl.title;
    if(ctx.studentId){
      const s = studentById(ctx.studentId);
      if(s){
        document.getElementById('msgSection').value = s.section;
        populateMsgStudents();
        document.getElementById('msgStudent').value = s.fullName;
      }
    }
    state._msgCaseType = ctx.caseType || '';
    state.pendingMessageContext = null;
  }
  updateMsgPreview();
  renderMsgLog();
}
function populateMsgStudents(){
  const sec = document.getElementById('msgSection').value;
  populateSelectOptions(document.getElementById('msgStudent'), studentsInSection(sec).map(s=>s.fullName));
}
document.getElementById('msgSection').addEventListener('change', ()=>{ populateMsgStudents(); updateMsgPreview(); });
document.getElementById('msgStudent').addEventListener('change', updateMsgPreview);
document.getElementById('msgTemplate').addEventListener('change', updateMsgPreview);
function currentMsgStudent(){
  const sec = document.getElementById('msgSection').value;
  const name = document.getElementById('msgStudent').value;
  return state.students.find(s=>s.section===sec && s.fullName===name);
}
function updateMsgPreview(){
  const tplTitle = document.getElementById('msgTemplate').value;
  const tpl = state.settings.messageTemplates.find(t=>t.title===tplTitle);
  const student = currentMsgStudent();
  if(!tpl){ document.getElementById('msgPreview').value=''; return; }
  let text = tpl.body;
  text = text.replaceAll('{name}', student ? student.fullName : '—')
             .replaceAll('{section}', student ? student.section : '—')
             .replaceAll('{date}', todayISO())
             .replaceAll('{institution}', state.settings.institution || 'المؤسسة')
             .replaceAll('{caseType}', state._msgCaseType || '—');
  document.getElementById('msgPreview').value = text;
}
document.getElementById('btnMsgWhatsapp').addEventListener('click', ()=>{
  const student = currentMsgStudent();
  if(!student){ toast('يرجى اختيار التلميذ(ة)'); return; }
  const phone = waPhone(student.parentPhone);
  if(!phone){ toast('لا يوجد رقم هاتف مسجل لولي أمر هذا التلميذ'); return; }
  const text = document.getElementById('msgPreview').value;
  const tplTitle = document.getElementById('msgTemplate').value;
  state.msglog.unshift({ id: uid('msg'), studentId: student.id, templateTitle: tplTitle, date: todayISO(), createdAt: new Date().toISOString() });
  saveMsgLog();
  renderMsgLog(); renderDashboard();
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
});
document.getElementById('btnMsgCopy').addEventListener('click', async ()=>{
  const text = document.getElementById('msgPreview').value;
  try{ await navigator.clipboard.writeText(text); toast('تم نسخ النص'); }
  catch(e){ toast('تعذر النسخ التلقائي — انسخ النص يدوياً'); }
});
document.getElementById('btnMsgAI').addEventListener('click', async ()=>{
  const btn = document.getElementById('btnMsgAI');
  const student = currentMsgStudent();
  const draftText = document.getElementById('msgPreview').value.trim();
  if(!draftText){ toast('لا يوجد نص لتحسينه'); return; }
  const originalLabel = btn.textContent;
  btn.disabled = true; btn.textContent = '⏳ جارٍ التحسين...';
  try{
    const resp = await fetch('/.netlify/functions/draft-message', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        draftText,
        studentName: student ? student.fullName : '',
        section: student ? student.section : '',
        caseType: state._msgCaseType || '',
        institution: state.settings.institution
      })
    });
    const data = await resp.json().catch(()=>({}));
    if(!resp.ok || !data.text){ toast(data.error || 'تعذر الاتصال بخدمة الذكاء الاصطناعي'); return; }
    document.getElementById('msgPreview').value = data.text;
    toast('تم تحسين الصياغة — راجع النص قبل الإرسال');
  }catch(e){
    toast('تعذر الاتصال بخدمة الذكاء الاصطناعي — تحقق من الاتصال بالإنترنت');
  }finally{
    btn.disabled = false; btn.textContent = originalLabel;
  }
});
function renderMsgLog(){
  const rows = state.msglog.slice(0,20);
  document.getElementById('msgLogTbody').innerHTML = rows.length ? rows.map(m=>{
    const s = studentById(m.studentId);
    return `<tr><td>${esc(s? s.fullName : '—')}</td><td>${esc(m.templateTitle)}</td><td>${esc(m.date)}</td></tr>`;
  }).join('') : `<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:16px">لا توجد اتصالات مسجلة بعد.</td></tr>`;
}

/* ============================= محرك التقارير المرنة (نماذج قابلة للتخصيص) ============================= */
function showReportsSubview(id){
  document.querySelectorAll('#view-reports > .view, #view-reports > #reports-home-view').forEach(v=>v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
const CATEGORY_ICONS = {
  'الغياب والتأخر':'📋','السلوك والانضباط':'⚖️','الحوادث والوقائع':'🚨','المراسلات':'✉️',
  'المجالس والمحاضر':'🏛️','الامتحانات':'📝','أخرى':'🗂️'
};
function catIcon(c){ return CATEGORY_ICONS[c] || '🗂️'; }

function renderCategoryFilterOptions(){
  const sel = document.getElementById('categoryFilter');
  const cats = [...new Set(allTemplates().map(t=>t.category))];
  sel.innerHTML = '<option value="">كل الفئات</option>' + cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
}
function renderHome(){
  renderCategoryFilterOptions();
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  const catF = document.getElementById('categoryFilter').value;
  const tpls = allTemplates().filter(t=>{
    if(catF && t.category!==catF) return false;
    if(q && !t.name.toLowerCase().includes(q)) return false;
    return true;
  });
  const byCat = {};
  tpls.forEach(t=>{ (byCat[t.category] = byCat[t.category]||[]).push(t); });
  const container = document.getElementById('templatesContainer');
  const cats = Object.keys(byCat);
  if(cats.length===0){ container.innerHTML = `<div class="empty">لا توجد نماذج مطابقة.</div>`; return; }
  container.innerHTML = cats.map(cat=>{
    const cards = byCat[cat].map(t=>{
      const isCustom = !t.builtin;
      return `
      <div class="tpl-card">
        <div class="top"><span class="emoji">${catIcon(t.category)}</span><span class="name">${esc(t.name)}</span>${isCustom?'<span class="badge-custom">مخصص</span>':''}</div>
        <div class="meta">${t.fields.length} حقل/حقول</div>
        <div class="actions">
          <button class="btn btn-primary btn-sm" data-act="open" data-id="${esc(t.id)}">📝 فتح النموذج</button>
          ${isCustom
            ? `<button class="btn btn-light btn-sm" data-act="edit" data-id="${esc(t.id)}">✏️ تعديل</button><button class="btn btn-danger btn-sm" data-act="del" data-id="${esc(t.id)}">🗑️ حذف</button>`
            : `<button class="btn btn-light btn-sm" data-act="dup" data-id="${esc(t.id)}">📄 تكرار وتعديل</button>`}
        </div>
      </div>`;
    }).join('');
    return `<div class="cat-block"><h3>${catIcon(cat)} ${esc(cat)}</h3><div class="cards-grid">${cards}</div></div>`;
  }).join('');
}
document.getElementById('templatesContainer').addEventListener('click', e=>{
  const btn = e.target.closest('button[data-act]'); if(!btn) return;
  const id = btn.dataset.id, act = btn.dataset.act, tpl = findTemplate(id);
  if(!tpl) return;
  if(act==='open') openFillView(tpl, null);
  else if(act==='dup') openBuilder(cloneTemplateForEdit(tpl), true);
  else if(act==='edit') openBuilder(tpl, false);
  else if(act==='del'){
    if(confirm(`هل تريد حذف القالب "${tpl.name}"؟`)){
      state.customTemplates = state.customTemplates.filter(t=>t.id!==id);
      saveTemplates(); renderHome(); toast('تم حذف القالب');
    }
  }
});
document.getElementById('searchInput').addEventListener('input', renderHome);
document.getElementById('categoryFilter').addEventListener('change', renderHome);

function blankRow(columns){ const o={}; columns.forEach(c=>o[c]=''); return o; }
function openFillView(tpl, existingReport){
  state.currentTemplate = tpl;
  state.currentReportId = existingReport ? existingReport.id : null;
  state.formValues = existingReport ? JSON.parse(JSON.stringify(existingReport.values)) : {};
  state.extraFields = existingReport ? JSON.parse(JSON.stringify(existingReport.extraFields||[])) : [];
  tpl.fields.forEach(f=>{
    if(state.formValues[f.id] !== undefined) return;
    if(f.type==='table') state.formValues[f.id] = [blankRow(f.columns)];
    else if(f.type==='date' && !existingReport) state.formValues[f.id] = todayISO();
    else state.formValues[f.id] = '';
  });
  document.getElementById('fillTitle').textContent = tpl.name;
  renderFillForm(); renderExtraFields(); renderDocPreview();
  showReportsSubview('view-fill');
}
function renderFillForm(){
  const tpl = state.currentTemplate;
  document.getElementById('formFields').innerHTML = tpl.fields.map(renderFieldInput).join('');
  tpl.fields.forEach(f=>{
    if(f.type==='table') bindTableEvents(f);
    else {
      const el = document.getElementById('inp_'+f.id); if(!el) return;
      const evt = f.type==='checkbox' ? 'change' : 'input';
      el.addEventListener(evt, ()=>{ state.formValues[f.id] = f.type==='checkbox' ? el.checked : el.value; renderDocPreview(); });
    }
  });
}
function renderFieldInput(f){
  const val = state.formValues[f.id];
  const reqMark = f.required ? '<span class="req">*</span>' : '';
  switch(f.type){
    case 'textarea': return `<div class="field-group"><label>${esc(f.label)} ${reqMark}</label><textarea id="inp_${f.id}">${esc(val)}</textarea></div>`;
    case 'select': return `<div class="field-group"><label>${esc(f.label)} ${reqMark}</label><select id="inp_${f.id}"><option value="">— اختر —</option>${(f.options||[]).map(o=>`<option value="${esc(o)}" ${val===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`;
    case 'checkbox': return `<div class="field-group checkbox-row"><input type="checkbox" id="inp_${f.id}" ${val?'checked':''}><label>${esc(f.label)}</label></div>`;
    case 'table': return `<div class="field-group"><label>${esc(f.label)}</label><table class="dyn-table" id="tbl_${f.id}"><thead><tr>${f.columns.map(c=>`<th>${esc(c)}</th>`).join('')}<th></th></tr></thead><tbody>${renderTableRows(f)}</tbody></table><button type="button" class="btn btn-light btn-sm" style="margin-top:6px" data-add-row="${f.id}">➕ إضافة سطر</button></div>`;
    case 'date': case 'time': case 'number': return `<div class="field-group"><label>${esc(f.label)} ${reqMark}</label><input type="${f.type}" id="inp_${f.id}" value="${esc(val)}"></div>`;
    default: return `<div class="field-group"><label>${esc(f.label)} ${reqMark}</label><input type="text" id="inp_${f.id}" value="${esc(val)}"></div>`;
  }
}
function renderTableRows(f){
  const rows = state.formValues[f.id] || [];
  return rows.map((row,ri)=>`<tr data-row="${ri}">${f.columns.map(c=>`<td><input type="text" data-col="${esc(c)}" value="${esc(row[c]||'')}"></td>`).join('')}<td><button type="button" class="rm-row-btn" data-rm-row="${ri}">حذف</button></td></tr>`).join('');
}
function bindTableEvents(f){
  const tbl = document.getElementById('tbl_'+f.id);
  document.querySelector(`[data-add-row="${f.id}"]`).addEventListener('click', ()=>{
    state.formValues[f.id].push(blankRow(f.columns));
    tbl.querySelector('tbody').innerHTML = renderTableRows(f);
    bindTableRowEvents(f, tbl); renderDocPreview();
  });
  bindTableRowEvents(f, tbl);
}
function bindTableRowEvents(f, tbl){
  tbl.querySelectorAll('input[data-col]').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      const ri = +inp.closest('tr').dataset.row;
      state.formValues[f.id][ri][inp.dataset.col] = inp.value;
      renderDocPreview();
    });
  });
  tbl.querySelectorAll('[data-rm-row]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const ri = +btn.dataset.rmRow;
      state.formValues[f.id].splice(ri,1);
      if(state.formValues[f.id].length===0) state.formValues[f.id].push(blankRow(f.columns));
      tbl.querySelector('tbody').innerHTML = renderTableRows(f);
      bindTableRowEvents(f, tbl); renderDocPreview();
    });
  });
}
function renderExtraFields(){
  const wrap = document.getElementById('extraFieldsList');
  if(state.extraFields.length===0){ wrap.innerHTML = `<div style="color:var(--muted);font-size:.82rem;margin-bottom:8px">لا توجد حقول إضافية.</div>`; return; }
  wrap.innerHTML = state.extraFields.map((ef,i)=>`
    <div class="extra-field-row" data-i="${i}">
      <div class="grow"><label style="font-size:.8rem;font-weight:700">${esc(ef.label)}</label>
      ${ef.type==='textarea' ? `<textarea data-extra-val="${i}">${esc(ef.value)}</textarea>` : `<input type="${ef.type}" data-extra-val="${i}" value="${esc(ef.value)}">`}</div>
      <button type="button" class="rm" data-extra-rm="${i}">🗑️</button>
    </div>`).join('');
  wrap.querySelectorAll('[data-extra-val]').forEach(el=>el.addEventListener('input', ()=>{ state.extraFields[+el.dataset.extraVal].value = el.value; renderDocPreview(); }));
  wrap.querySelectorAll('[data-extra-rm]').forEach(btn=>btn.addEventListener('click', ()=>{ state.extraFields.splice(+btn.dataset.extraRm,1); renderExtraFields(); renderDocPreview(); }));
}
document.getElementById('btnAddExtraField').addEventListener('click', ()=>{
  const label = prompt('عنوان الحقل الإضافي:'); if(!label) return;
  const typeChoice = prompt('نوع الحقل: 1=نص قصير 2=نص طويل 3=رقم 4=تاريخ', '1');
  const type = ({'1':'text','2':'textarea','3':'number','4':'date'})[typeChoice] || 'text';
  state.extraFields.push({id:uid('ex'), label, type, value:''});
  renderExtraFields(); renderDocPreview();
});

function renderLetterheadHead(){
  const s = state.settings;
  return `<div class="doc-head">
    <div class="kingdom">${esc(KINGDOM_LINE)}</div>
    <div class="line">${esc(MINISTRY_LINE)}</div>
    <div class="line">${esc(s.academy || 'الأكاديمية الجهوية')} — ${esc(s.niaba || 'النيابة الإقليمية')}</div>
    <div class="inst">${esc(s.institution || 'مؤسسة الحنان')}</div>
  </div>`;
}
function docSignatureBlock(){
  const s = state.settings;
  return `<div class="doc-sign">
    <div class="box"><div class="cap">الحارس(ة) العام(ة)${s.supervisor?'<br>'+esc(s.supervisor):''}</div><div class="line-blank"></div></div>
    <div class="box"><div class="cap">الإدارة</div><div class="line-blank"></div></div>
  </div>`;
}
function renderFieldPreview(f){
  const val = state.formValues[f.id];
  if(f.type==='table'){
    const rows = (val||[]).filter(r=>f.columns.some(c=>(r[c]||'').trim()!==''));
    if(rows.length===0) return '';
    return `<div class="doc-row"><div class="lbl">${esc(f.label)}</div><table class="doc-table"><thead><tr>${f.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${f.columns.map(c=>`<td>${esc(r[c]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if(f.type==='checkbox') return `<div class="doc-row"><span class="lbl">${esc(f.label)}:</span> ${val?'✅ نعم':'❌ لا'}</div>`;
  if(val===undefined||val===null||String(val).trim()==='') return '';
  return `<div class="doc-row"><div class="lbl">${esc(f.label)}</div><div class="val">${esc(val)}</div></div>`;
}
function renderDocPreview(){
  const tpl = state.currentTemplate, s = state.settings;
  const fieldsHtml = tpl.fields.map(renderFieldPreview).join('');
  const extraHtml = state.extraFields.filter(ef=>String(ef.value).trim()!=='').map(ef=>`<div class="doc-row"><div class="lbl">${esc(ef.label)}</div><div class="val">${esc(ef.value)}</div></div>`).join('');
  document.getElementById('docPreview').innerHTML = `
    ${renderLetterheadHead()}
    <div class="doc-title">${esc(tpl.name)}</div>
    <div class="doc-meta"><span>السنة الدراسية: ${esc(s.year || '—')}</span><span>تاريخ التحرير: ${esc(todayISO())}</span></div>
    ${fieldsHtml}
    ${extraHtml ? `<div class="doc-row"><div class="lbl" style="color:var(--gold)">معلومات إضافية</div></div>${extraHtml}` : ''}
    ${docSignatureBlock()}
  `;
}
document.getElementById('btnBackFromFill').addEventListener('click', ()=>{ showReportsSubview('reports-home-view'); renderHome(); });
document.getElementById('btnClearForm').addEventListener('click', ()=>{
  if(!confirm('تفريغ كل الحقول؟')) return;
  const tpl = state.currentTemplate; state.formValues = {}; state.extraFields = [];
  tpl.fields.forEach(f=>{ state.formValues[f.id] = f.type==='table' ? [blankRow(f.columns)] : ''; });
  renderFillForm(); renderExtraFields(); renderDocPreview();
});
document.getElementById('btnPrintReport').addEventListener('click', ()=>window.print());
document.getElementById('btnSaveReport').addEventListener('click', ()=>{
  const tpl = state.currentTemplate;
  const missing = tpl.fields.filter(f=>f.required && f.type!=='table' && f.type!=='checkbox' && !String(state.formValues[f.id]||'').trim());
  if(missing.length){ toast('يرجى تعبئة: ' + missing.map(f=>f.label).join('، ')); return; }
  const record = {
    id: state.currentReportId || uid('rep'), templateId: tpl.id, templateName: tpl.name, category: tpl.category,
    savedAt: new Date().toISOString(), values: JSON.parse(JSON.stringify(state.formValues)), extraFields: JSON.parse(JSON.stringify(state.extraFields))
  };
  const idx = state.reports.findIndex(r=>r.id===record.id);
  if(idx>=0) state.reports[idx]=record; else state.reports.unshift(record);
  state.currentReportId = record.id;
  saveReports();
  toast('تم حفظ التقرير في السجل');
});

function cloneTemplateForEdit(tpl){
  return { id: uid('tpl'), builtin:false, category: tpl.category, name: tpl.name + ' (نسخة معدّلة)',
    fields: JSON.parse(JSON.stringify(tpl.fields)).map(f=>({...f, id:uid('f')})) };
}
function openBuilder(tpl, isDuplicate){
  state.builderEditingId = (tpl && !isDuplicate && !tpl.builtin) ? tpl.id : null;
  const base = tpl || {name:'', category:'', fields:[]};
  document.getElementById('tplName').value = base.name;
  document.getElementById('tplCategory').value = base.category;
  state.builderFields = JSON.parse(JSON.stringify(base.fields));
  populateCatList(); renderBuilderFields();
  document.getElementById('builderTitle').textContent = state.builderEditingId ? 'تعديل القالب' : 'قالب جديد';
  showReportsSubview('view-builder');
}
function populateCatList(){
  const dl = document.getElementById('catList');
  const cats = [...new Set(allTemplates().map(t=>t.category))];
  dl.innerHTML = cats.map(c=>`<option value="${esc(c)}">`).join('');
}
const FIELD_TYPE_LABELS = { text:'نص قصير', textarea:'نص طويل', date:'تاريخ', time:'وقت', number:'رقم', select:'قائمة اختيار', checkbox:'خانة اختيار', table:'جدول ديناميكي' };
function renderBuilderFields(){
  const wrap = document.getElementById('builderFields');
  if(state.builderFields.length===0){ wrap.innerHTML = `<div class="empty" style="margin-bottom:12px">لا توجد حقول بعد.</div>`; return; }
  wrap.innerHTML = state.builderFields.map((f,i)=>`
    <div class="field-editor" data-i="${i}">
      <div class="row1">
        <input type="text" data-b="label" placeholder="عنوان الحقل" value="${esc(f.label)}">
        <select data-b="type">${Object.entries(FIELD_TYPE_LABELS).map(([v,l])=>`<option value="${v}" ${f.type===v?'selected':''}>${l}</option>`).join('')}</select>
      </div>
      ${f.type==='select' ? `<div class="row2"><textarea data-b="options" placeholder="خيارات القائمة (كل خيار في سطر)">${esc((f.options||[]).join('\n'))}</textarea></div>` : ''}
      ${f.type==='table' ? `<div class="row2"><textarea data-b="columns" placeholder="أعمدة الجدول (كل عمود في سطر)">${esc((f.columns||[]).join('\n'))}</textarea></div>` : ''}
      <div class="row3">
        <label class="req-check"><input type="checkbox" data-b="required" ${f.required?'checked':''}> حقل إلزامي</label>
        <div class="move-btns"><button type="button" data-b="up">⬆️</button><button type="button" data-b="down">⬇️</button><button type="button" data-b="del">🗑️</button></div>
      </div>
    </div>`).join('');
  wrap.querySelectorAll('.field-editor').forEach(box=>{
    const i = +box.dataset.i;
    box.querySelector('[data-b=label]').addEventListener('input', e=>state.builderFields[i].label = e.target.value);
    box.querySelector('[data-b=type]').addEventListener('change', e=>{
      state.builderFields[i].type = e.target.value;
      if(e.target.value==='select' && !state.builderFields[i].options) state.builderFields[i].options=[];
      if(e.target.value==='table' && !state.builderFields[i].columns) state.builderFields[i].columns=['عمود 1','عمود 2'];
      renderBuilderFields();
    });
    const opt = box.querySelector('[data-b=options]'); if(opt) opt.addEventListener('input', e=>{ state.builderFields[i].options = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean); });
    const cols = box.querySelector('[data-b=columns]'); if(cols) cols.addEventListener('input', e=>{ state.builderFields[i].columns = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean); });
    box.querySelector('[data-b=required]').addEventListener('change', e=>state.builderFields[i].required = e.target.checked);
    box.querySelector('[data-b=up]').addEventListener('click', ()=>{ if(i===0) return; [state.builderFields[i-1],state.builderFields[i]]=[state.builderFields[i],state.builderFields[i-1]]; renderBuilderFields(); });
    box.querySelector('[data-b=down]').addEventListener('click', ()=>{ if(i===state.builderFields.length-1) return; [state.builderFields[i+1],state.builderFields[i]]=[state.builderFields[i],state.builderFields[i+1]]; renderBuilderFields(); });
    box.querySelector('[data-b=del]').addEventListener('click', ()=>{ state.builderFields.splice(i,1); renderBuilderFields(); });
  });
}
document.getElementById('btnAddField').addEventListener('click', ()=>{ state.builderFields.push({id:uid('f'), type:'text', label:'', required:false}); renderBuilderFields(); });
document.getElementById('btnNewTpl').addEventListener('click', ()=>openBuilder(null,false));
document.getElementById('btnBackFromBuilder').addEventListener('click', ()=>{ showReportsSubview('reports-home-view'); renderHome(); });
document.getElementById('btnSaveTemplate').addEventListener('click', ()=>{
  const name = document.getElementById('tplName').value.trim();
  const category = document.getElementById('tplCategory').value.trim() || 'أخرى';
  if(!name){ toast('يرجى إدخال اسم النموذج'); return; }
  if(state.builderFields.length===0){ toast('أضف حقلاً واحداً على الأقل'); return; }
  if(state.builderFields.find(f=>!f.label.trim())){ toast('يوجد حقل بدون عنوان'); return; }
  if(state.builderEditingId){
    const idx = state.customTemplates.findIndex(t=>t.id===state.builderEditingId);
    if(idx>=0) state.customTemplates[idx] = {...state.customTemplates[idx], name, category, fields: state.builderFields};
  } else {
    state.customTemplates.push({ id: uid('tpl'), builtin:false, name, category, fields: state.builderFields });
  }
  saveTemplates(); toast('تم حفظ القالب');
  showReportsSubview('reports-home-view'); renderHome();
});

/* ============================= التقارير الذكية (تُولَّد تلقائياً من البيانات) ============================= */
function ensureReportsViewVisible(){
  document.querySelectorAll('#appRoot > main > .view').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-reports').classList.remove('hidden');
  state.currentView = 'view-reports';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view==='view-reports'));
}
function openSmartPrint(title, bodyHtml){
  ensureReportsViewVisible();
  document.getElementById('smartPrintTitle').textContent = title;
  document.getElementById('smartDocPreview').innerHTML = `
    ${renderLetterheadHead()}
    <div class="doc-title">${esc(title)}</div>
    <div class="doc-meta"><span>السنة الدراسية: ${esc(state.settings.year||'—')}</span><span>تاريخ التحرير: ${esc(todayISO())}</span></div>
    ${bodyHtml}
    ${docSignatureBlock()}
  `;
  showReportsSubview('view-smart-print');
}
document.getElementById('btnBackFromSmartPrint').addEventListener('click', ()=>{ showReportsSubview('reports-home-view'); renderHome(); });
document.getElementById('btnPrintSmart').addEventListener('click', ()=>window.print());

function simpleTable(headers, rows){
  if(rows.length===0) return `<div class="empty-hint">لا توجد بيانات لعرضها.</div>`;
  return `<table class="doc-table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function generateDailyReport(){
  const today = todayISO();
  const att = state.attendance.filter(a=>a.date===today);
  const beh = state.behavior.filter(b=>b.date===today);
  const msgs = state.msglog.filter(m=>m.date===today);
  const absences = att.filter(a=>a.type==='absence');
  const tardies = att.filter(a=>a.type==='tardiness');
  const body = `
    <div class="doc-row"><div class="lbl">ملخص عددي</div><div class="val">الغياب: ${absences.length} — التأخر: ${tardies.length} — الحالات السلوكية: ${beh.length} — الاتصالات: ${msgs.length}</div></div>
    <div class="doc-row"><div class="lbl">الغياب</div>${simpleTable(['التلميذ(ة)','القسم','الوضعية'], absences.map(a=>{const s=studentById(a.studentId); return [s?s.fullName:'—', s?s.section:'—', JUSTIF_LABELS[a.justification]];}))}</div>
    <div class="doc-row"><div class="lbl">التأخر</div>${simpleTable(['التلميذ(ة)','القسم','الساعة','الوضعية'], tardies.map(a=>{const s=studentById(a.studentId); return [s?s.fullName:'—', s?s.section:'—', a.time||'—', JUSTIF_LABELS[a.justification]];}))}</div>
    <div class="doc-row"><div class="lbl">السلوك والتدخلات</div>${simpleTable(['التلميذ(ة)','النوع','الخطورة','الإجراء'], beh.map(b=>{const s=studentById(b.studentId); return [s?s.fullName:'—', b.type, SEVERITY_LABELS[b.severity], b.action||'—'];}))}</div>
    <div class="doc-row"><div class="lbl">الاتصالات مع أولياء الأمور</div>${simpleTable(['التلميذ(ة)','القالب'], msgs.map(m=>{const s=studentById(m.studentId); return [s?s.fullName:'—', m.templateTitle];}))}</div>
  `;
  openSmartPrint('تقرير اليوم — ' + today, body);
}
document.getElementById('btnSmartDaily').addEventListener('click', generateDailyReport);
document.getElementById('btnGenerateDailyFromLog').addEventListener('click', generateDailyReport);

function generateStudentReport(studentId){
  const s = studentById(studentId);
  if(!s){ toast('يرجى اختيار تلميذ أولاً'); return; }
  const att = state.attendance.filter(a=>a.studentId===studentId).sort((a,b)=>b.date.localeCompare(a.date));
  const beh = state.behavior.filter(b=>b.studentId===studentId).sort((a,b)=>b.date.localeCompare(a.date));
  const msgs = state.msglog.filter(m=>m.studentId===studentId).sort((a,b)=>b.date.localeCompare(a.date));
  const body = `
    <div class="doc-row"><div class="lbl">بيانات التلميذ(ة)</div><div class="val">الاسم: ${esc(s.fullName)} — القسم: ${esc(s.section)} — الحالة: ${esc(STATUS_LABELS[s.status])} — هاتف ولي الأمر: ${esc(s.parentPhone||'—')}</div></div>
    <div class="doc-row"><div class="lbl">سجل الغياب والتأخر</div>${simpleTable(['النوع','التاريخ','الساعة','الوضعية','السبب'], att.map(a=>[ATTTYPE_LABELS[a.type], a.date, a.time||'—', JUSTIF_LABELS[a.justification], a.reason||'—']))}</div>
    <div class="doc-row"><div class="lbl">سجل السلوك والتدخلات</div>${simpleTable(['النوع','الخطورة','التاريخ','الإجراء','الملف'], beh.map(b=>[b.type, SEVERITY_LABELS[b.severity], b.date, b.action||'—', FILESTATUS_LABELS[b.fileStatus]]))}</div>
    <div class="doc-row"><div class="lbl">سجل الاتصالات</div>${simpleTable(['القالب','التاريخ'], msgs.map(m=>[m.templateTitle, m.date]))}</div>
  `;
  openSmartPrint('تقرير تلميذ — ' + s.fullName, body);
}
document.getElementById('btnSmartStudent').addEventListener('click', ()=>{
  openPickerModal('اختر التلميذ(ة)', state.students.map(s=>({value:s.id, label:`${s.fullName} — ${s.section}`})), (id)=>generateStudentReport(id));
});

function generateSectionReport(section){
  const students = studentsInSection(section);
  const rows = students.map(s=>{
    const absC = state.attendance.filter(a=>a.studentId===s.id && a.type==='absence').length;
    const tardyC = state.attendance.filter(a=>a.studentId===s.id && a.type==='tardiness').length;
    const behC = state.behavior.filter(b=>b.studentId===s.id).length;
    return [s.fullName, absC, tardyC, behC, STATUS_LABELS[s.status]];
  });
  const body = `
    <div class="doc-row"><div class="lbl">القسم</div><div class="val">${esc(section)} — عدد التلاميذ: ${students.length}</div></div>
    <div class="doc-row"><div class="lbl">لائحة التلاميذ</div>${simpleTable(['الاسم الكامل','عدد الغياب','عدد التأخر','عدد الحالات السلوكية','الحالة'], rows)}</div>
  `;
  openSmartPrint('تقرير قسم — ' + section, body);
}
document.getElementById('btnSmartSection').addEventListener('click', ()=>{
  openPickerModal('اختر القسم', state.settings.sections.map(s=>({value:s, label:s})), (sec)=>generateSectionReport(sec));
});

function generateMonthlyAbsenceReport(section){
  const mk = monthKey(todayISO());
  const students = studentsInSection(section);
  const rows = students.map(s=>{
    const absC = state.attendance.filter(a=>a.studentId===s.id && a.type==='absence' && monthKey(a.date)===mk).length;
    const tardyC = state.attendance.filter(a=>a.studentId===s.id && a.type==='tardiness' && monthKey(a.date)===mk).length;
    return [s.fullName, s.section, absC, tardyC];
  }).filter(r=>r[2]>0 || r[3]>0);
  const body = `
    <div class="doc-row"><div class="lbl">الشهر</div><div class="val">${esc(mk)}${section?' — القسم: '+esc(section):' — كل الأقسام'}</div></div>
    <div class="doc-row"><div class="lbl">التلاميذ المسجَّل لهم غياب أو تأخر هذا الشهر</div>${simpleTable(['الاسم الكامل','القسم','عدد أيام الغياب','عدد مرات التأخر'], rows)}</div>
  `;
  openSmartPrint('تقرير غياب شهري — ' + mk, body);
}
document.getElementById('btnSmartMonthlyAbsence').addEventListener('click', ()=>{
  openPickerModal('اختر القسم (أو كل الأقسام)', [{value:'',label:'كل الأقسام'}].concat(state.settings.sections.map(s=>({value:s,label:s}))), (sec)=>generateMonthlyAbsenceReport(sec));
});

function generateRepeatedTardinessReport(){
  const counts = {};
  state.attendance.filter(a=>a.type==='tardiness').forEach(a=>{ counts[a.studentId] = (counts[a.studentId]||0)+1; });
  const rows = Object.entries(counts).filter(([,c])=>c>=3).sort((a,b)=>b[1]-a[1]).map(([id,c])=>{
    const s = studentById(id); return s ? [s.fullName, s.section, c] : null;
  }).filter(Boolean);
  const body = `<div class="doc-row"><div class="lbl">التلاميذ الذين تجاوزوا 3 حالات تأخر</div>${simpleTable(['الاسم الكامل','القسم','عدد مرات التأخر'], rows)}</div>`;
  openSmartPrint('تقرير التأخر المتكرر', body);
}
document.getElementById('btnSmartRepeatedTardiness').addEventListener('click', generateRepeatedTardinessReport);

function openPickerModal(title, options, onConfirm){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal"><h3>${esc(title)}</h3>
    <div class="field-group"><select id="pickerSelect">${options.map(o=>`<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select></div>
    <div class="modal-actions"><button class="btn btn-light" id="pickerCancel">إلغاء</button><button class="btn btn-primary" id="pickerOk">توليد التقرير</button></div>
  </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#pickerCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#pickerOk').addEventListener('click', ()=>{
    const val = bg.querySelector('#pickerSelect').value;
    bg.remove();
    onConfirm(val);
  });
}

/* ============================= سجل اليوم ============================= */
function renderDailyLog(){
  const today = todayISO();
  document.getElementById('dailyLogDate').textContent = today;
  const att = state.attendance.filter(a=>a.date===today);
  document.getElementById('dlAttendance').innerHTML = att.length ? att.map(a=>{
    const s = studentById(a.studentId);
    return `<div class="recent-item"><span class="tag ${a.type==='absence'?'tag-red':'tag-orange'}">${esc(ATTTYPE_LABELS[a.type])}</span><span>${esc(s?s.fullName:'—')} — ${esc(s?s.section:'—')}</span><span>${esc(JUSTIF_LABELS[a.justification])}</span></div>`;
  }).join('') : `<div class="empty-hint">لا توجد حالات غياب أو تأخر اليوم.</div>`;

  const beh = state.behavior.filter(b=>b.date===today);
  document.getElementById('dlBehavior').innerHTML = beh.length ? beh.map(b=>{
    const s = studentById(b.studentId);
    return `<div class="recent-item"><span class="tag ${b.severity==='urgent'?'tag-red':'tag-orange'}">${esc(b.type)}</span><span>${esc(s?s.fullName:'—')}</span><span>${esc(b.action||'—')}</span></div>`;
  }).join('') : `<div class="empty-hint">لا توجد حالات سلوكية اليوم.</div>`;

  const msgs = state.msglog.filter(m=>m.date===today);
  document.getElementById('dlMessages').innerHTML = msgs.length ? msgs.map(m=>{
    const s = studentById(m.studentId);
    return `<div class="recent-item"><span class="tag tag-green">${esc(m.templateTitle)}</span><span>${esc(s?s.fullName:'—')}</span></div>`;
  }).join('') : `<div class="empty-hint">لا توجد اتصالات اليوم.</div>`;

  const open = state.behavior.filter(b=>b.fileStatus==='open');
  document.getElementById('dlOpenFiles').innerHTML = open.length ? open.map(b=>{
    const s = studentById(b.studentId);
    return `<div class="recent-item"><span class="tag tag-red">مفتوح</span><span>${esc(s?s.fullName:'—')} — ${esc(b.type)}</span><span>${esc(b.date)}</span></div>`;
  }).join('') : `<div class="empty-hint">لا توجد ملفات مفتوحة حالياً.</div>`;
}

/* ============================= الإحصائيات ============================= */
function barList(containerId, data){
  const max = Math.max(1, ...data.map(d=>d.v));
  document.getElementById(containerId).innerHTML = data.length ? data.map(d=>`
    <div class="bar-item"><div class="bar-label">${esc(d.k)}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.round(d.v/max*100)}%"></div></div><div class="bar-val">${d.v}</div></div>
  `).join('') : `<div class="empty-hint">لا توجد بيانات كافية بعد.</div>`;
}
function renderStats(){
  const totalStudents = state.students.length;
  const totalAbs = state.attendance.filter(a=>a.type==='absence').length;
  const totalTardy = state.attendance.filter(a=>a.type==='tardiness').length;
  const openCases = state.behavior.filter(b=>b.fileStatus==='open').length;
  const closedCases = state.behavior.filter(b=>b.fileStatus==='closed').length;
  const totalMsgs = state.msglog.length;
  document.getElementById('statsSummaryGrid').innerHTML = [
    {n:totalStudents,l:'عدد التلاميذ',c:'blue',i:'🧑‍🎓'},
    {n:totalAbs,l:'إجمالي الغياب',c:'red',i:'📋'},
    {n:totalTardy,l:'إجمالي التأخر',c:'orange',i:'⏱️'},
    {n:openCases,l:'حالات مفتوحة',c:'red',i:'📂'},
    {n:closedCases,l:'حالات مغلقة',c:'green',i:'✅'},
    {n:totalMsgs,l:'اتصالات بأولياء الأمور',c:'green',i:'✉️'}
  ].map(c=>`<div class="stat-card ${c.c}"><div class="stat-icon">${c.i}</div><div class="stat-num">${c.n}</div><div class="stat-label">${esc(c.l)}</div></div>`).join('');

  barList('statAbsenceBySection', state.settings.sections.map(sec=>({k:sec, v: state.attendance.filter(a=>a.type==='absence' && studentById(a.studentId)?.section===sec).length})));
  barList('statTardyBySection', state.settings.sections.map(sec=>({k:sec, v: state.attendance.filter(a=>a.type==='tardiness' && studentById(a.studentId)?.section===sec).length})));

  const tardyCounts = {}, absCounts = {};
  state.attendance.forEach(a=>{
    const bucket = a.type==='tardiness' ? tardyCounts : absCounts;
    bucket[a.studentId] = (bucket[a.studentId]||0)+1;
  });
  function topList(counts){
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,c])=>{
      const s = studentById(id); return s ? {k:s.fullName, v:c} : null;
    }).filter(Boolean);
  }
  barList('statTopTardy', topList(tardyCounts));
  barList('statTopAbsence', topList(absCounts));
}

/* ============================= الإعدادات ============================= */
function renderSettingsView(){
  const s = state.settings;
  document.getElementById('setInstitution').value = s.institution;
  document.getElementById('setNiaba').value = s.niaba;
  document.getElementById('setAcademy').value = s.academy;
  document.getElementById('setYear').value = s.year;
  document.getElementById('setSupervisor').value = s.supervisor;
  renderChips('settingsSections', s.sections, removeSection);
  renderChips('settingsCaseTypes', s.caseTypes, removeCaseType);
  renderMessageTemplatesSettings();
}
function renderChips(containerId, items, onRemove){
  document.getElementById(containerId).innerHTML = items.map((it,i)=>`<span class="chip">${esc(it)}<button data-i="${i}">×</button></span>`).join('');
  document.getElementById(containerId).querySelectorAll('button').forEach(btn=>btn.addEventListener('click', ()=>onRemove(+btn.dataset.i)));
}
function removeSection(i){ state.settings.sections.splice(i,1); saveSettings(); renderSettingsView(); toast('تم الحذف'); }
function removeCaseType(i){ state.settings.caseTypes.splice(i,1); saveSettings(); renderSettingsView(); toast('تم الحذف'); }
document.getElementById('btnAddSection').addEventListener('click', ()=>{
  const v = document.getElementById('newSectionInput').value.trim();
  if(!v) return;
  state.settings.sections.push(v); saveSettings();
  document.getElementById('newSectionInput').value='';
  renderSettingsView(); toast('تمت الإضافة');
});
document.getElementById('btnAddCaseType').addEventListener('click', ()=>{
  const v = document.getElementById('newCaseTypeInput').value.trim();
  if(!v) return;
  state.settings.caseTypes.push(v); saveSettings();
  document.getElementById('newCaseTypeInput').value='';
  renderSettingsView(); toast('تمت الإضافة');
});
function renderMessageTemplatesSettings(){
  const wrap = document.getElementById('settingsMessageTemplates');
  wrap.innerHTML = state.settings.messageTemplates.map((t,i)=>`
    <div class="field-group">
      <label>${esc(t.title)}</label>
      <textarea data-mt="${i}" rows="3">${esc(t.body)}</textarea>
    </div>`).join('') + `<button class="btn btn-primary btn-sm" id="btnSaveMsgTemplates">💾 حفظ قوالب الرسائل</button>
    <p class="hint">المتغيرات المتاحة: {name} الاسم، {section} القسم، {date} التاريخ، {institution} اسم المؤسسة، {caseType} نوع الحالة.</p>`;
  document.getElementById('btnSaveMsgTemplates').addEventListener('click', ()=>{
    wrap.querySelectorAll('[data-mt]').forEach(ta=>{ state.settings.messageTemplates[+ta.dataset.mt].body = ta.value; });
    saveSettings(); toast('تم حفظ قوالب الرسائل');
  });
}
document.getElementById('btnSaveSettings').addEventListener('click', ()=>{
  state.settings.institution = document.getElementById('setInstitution').value.trim();
  state.settings.niaba = document.getElementById('setNiaba').value.trim();
  state.settings.academy = document.getElementById('setAcademy').value.trim();
  state.settings.year = document.getElementById('setYear').value.trim();
  state.settings.supervisor = document.getElementById('setSupervisor').value.trim();
  saveSettings();
  toast('تم حفظ معلومات المؤسسة');
});

/* ---- تغيير كلمة المرور / الرقم السري (يتطلب التحقق من كلمة المرور الحالية) ---- */
function openSecretChangeModal({title, currentLabel, verifyKey, newLabel, newPattern, patternErr, saveKey, successMsg}){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${esc(title)}</h3>
      <div class="field-group"><label>${esc(currentLabel)} الحالية</label><input type="password" id="scCurrent"></div>
      <div class="field-group"><label>${esc(newLabel)} الجديدة</label><input type="password" id="scNew"></div>
      <div class="field-group"><label>تأكيد ${esc(newLabel)} الجديدة</label><input type="password" id="scNewConfirm"></div>
      <p class="auth-error hidden" id="scError"></p>
      <div class="modal-actions">
        <button class="btn btn-light" id="scCancel">إلغاء</button>
        <button class="btn btn-primary" id="scSave">💾 حفظ</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#scCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#scSave').addEventListener('click', async ()=>{
    const errEl = bg.querySelector('#scError');
    const current = bg.querySelector('#scCurrent').value;
    const okCurrent = await verifySecret(verifyKey, current);
    if(!okCurrent){ errEl.textContent = 'كلمة المرور الحالية غير صحيحة'; errEl.classList.remove('hidden'); return; }
    const val = bg.querySelector('#scNew').value;
    const confirm2 = bg.querySelector('#scNewConfirm').value;
    if(!newPattern.test(val)){ errEl.textContent = patternErr; errEl.classList.remove('hidden'); return; }
    if(val !== confirm2){ errEl.textContent = 'القيمتان غير متطابقتين'; errEl.classList.remove('hidden'); return; }
    await setSecret(saveKey, val);
    bg.remove();
    toast(successMsg);
  });
}
document.getElementById('btnChangePassword').addEventListener('click', ()=>{
  openSecretChangeModal({
    title:'🔑 تغيير كلمة المرور', currentLabel:'كلمة المرور', verifyKey:K_PWHASH,
    newLabel:'كلمة المرور', newPattern:/^.{4,}$/, patternErr:'كلمة المرور يجب أن تكون 4 أحرف على الأقل',
    saveKey:K_PWHASH, successMsg:'تم تغيير كلمة المرور'
  });
});
document.getElementById('btnChangePin').addEventListener('click', ()=>{
  openSecretChangeModal({
    title:'🔢 تغيير الرقم السري', currentLabel:'كلمة المرور', verifyKey:K_PWHASH,
    newLabel:'الرقم السري', newPattern:/^\d{4,6}$/, patternErr:'الرقم السري يجب أن يكون من 4 إلى 6 أرقام',
    saveKey:K_PINHASH, successMsg:'تم تغيير الرقم السري'
  });
});

document.getElementById('btnExportAll').addEventListener('click', ()=>{
  const data = {
    settings: state.settings, students: state.students, teachers: state.teachers, attendance: state.attendance, behavior: state.behavior,
    msglog: state.msglog, customTemplates: state.customTemplates, reports: state.reports, exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'نسخة-احتياطية-حراسة-الحنان-' + todayISO() + '.json';
  a.click(); URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', e=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(data.settings) state.settings = {...state.settings, ...data.settings};
      if(Array.isArray(data.students)) state.students = state.students.concat(data.students);
      if(Array.isArray(data.teachers)) state.teachers = state.teachers.concat(data.teachers);
      if(Array.isArray(data.attendance)) state.attendance = state.attendance.concat(data.attendance);
      if(Array.isArray(data.behavior)) state.behavior = state.behavior.concat(data.behavior);
      if(Array.isArray(data.msglog)) state.msglog = state.msglog.concat(data.msglog);
      if(Array.isArray(data.customTemplates)) state.customTemplates = state.customTemplates.concat(data.customTemplates);
      if(Array.isArray(data.reports)) state.reports = state.reports.concat(data.reports);
      saveSettings(); saveStudents(); saveTeachers(); saveAttendance(); saveBehavior(); saveMsgLog(); saveTemplates(); saveReports();
      renderSettingsView();
      toast('تم الاستيراد بنجاح');
    }catch(err){ toast('ملف غير صالح'); }
    e.target.value = '';
  };
  reader.readAsText(file);
});
document.getElementById('btnWipeData').addEventListener('click', ()=>{
  const phrase = prompt('لتأكيد مسح جميع البيانات نهائياً، اكتب "حذف نهائي" بالضبط:');
  if(phrase !== 'حذف نهائي'){ toast('لم يتم المسح — النص غير مطابق'); return; }
  [K_SETTINGS,K_STUDENTS,K_TEACHERS,K_ATTENDANCE,K_BEHAVIOR,K_MSGLOG,K_TEMPLATES,K_REPORTS,K_SEEDED,K_AUTH,K_PWHASH,K_PINHASH].forEach(k=>localStorage.removeItem(k));
  sessionStorage.removeItem(SS_UNLOCKED); sessionStorage.removeItem(SS_PIN_LOCKED);
  toast('تم مسح جميع البيانات — سيُعاد تحميل الصفحة');
  setTimeout(()=>location.reload(), 900);
});

/* ============================= بدء التشغيل ============================= */
function bootApp(){
  if(!state.settings.year){
    const y = new Date().getFullYear(); const m = new Date().getMonth();
    state.settings.year = (m>=8) ? `${y}-${y+1}` : `${y-1}-${y}`;
    saveSettings();
  }
  seedDemoData();
  seedTeachersIfEmpty();
  migrateSecondaryLevels();
  initGlobalSearch();
  showView('view-dashboard');
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
}

initLoginGate();
})();
