const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const storeKey = "rihla_ww1_state_v1";
const stamps = ["الأسباب العميقة", "الشرارة", "الأحلاف", "المراحل", "النتائج", "فرساي", "عصبة الأمم", "مخبر المؤرخ", "المغالطات", "الصندوق"];
let soundOn = true;
let state = loadState();
let currentStation = state.currentStation || 0;

const guideLines = [
  "لاحظ قبل أن تجيب.",
  "التاريخ ليس حفظاً فقط... إنه ربط بين السبب والنتيجة.",
  "أحسنت، جمعت قطعة من خريطة الفهم.",
  "انتبه: 1918 غير 1919 في هذا الدرس.",
  "كل وثيقة تسألنا: هل أنا سبب أم مرحلة أم نتيجة؟"
];

const questionBank = [
  {type:"mcq", q:"ما السبب المباشر لاندلاع الحرب العالمية الأولى؟", options:["تأسيس عصبة الأمم", "اغتيال ولي عهد النمسا في سراييفو", "أزمة 1929", "ظهور الاتحاد الأوروبي"], answer:"اغتيال ولي عهد النمسا في سراييفو", explain:"شرارة الحرب كانت اغتيال ولي عهد النمسا بسراييفو يوم 28 يونيو 1914."},
  {type:"mcq", q:"أي مما يلي يعد سبباً غير مباشر للحرب؟", options:["إنشاء عصبة الأمم", "معاهدة فرساي", "التنافس الإمبريالي", "نهاية الحرب سنة 1918"], answer:"التنافس الإمبريالي", explain:"التنافس حول المستعمرات والأسواق كان من أسباب التوتر قبل الحرب."},
  {type:"mcq", q:"ما الدول الأساسية في الوفاق الثلاثي؟", options:["ألمانيا والنمسا-المجر وإيطاليا", "فرنسا وألمانيا وروسيا", "فرنسا وبريطانيا وروسيا", "بريطانيا واليابان وألمانيا"], answer:"فرنسا وبريطانيا وروسيا", explain:"الوفاق الثلاثي ضم فرنسا وبريطانيا وروسيا."},
  {type:"mcq", q:"ما الحدث الذي غيّر ميزان القوى سنة 1917؟", options:["تأسيس الاتحاد الأوروبي", "انسحاب روسيا ودخول الولايات المتحدة الأمريكية", "نهاية الحرب الباردة", "اكتشاف البترول"], answer:"انسحاب روسيا ودخول الولايات المتحدة الأمريكية", explain:"سنة 1917 انسحبت روسيا ودخلت الولايات المتحدة، فمالت الكفة للوفاق."},
  {type:"mcq", q:"ما السنة التي انتهت فيها الحرب عسكرياً؟", options:["1919", "1929", "1918", "1939"], answer:"1918", explain:"انتهت العمليات العسكرية سنة 1918."},
  {type:"mcq", q:"ماذا تمثل سنة 1919 في الدرس؟", options:["بداية الحرب", "اغتيال ولي عهد النمسا", "مؤتمر الصلح ومعاهدة فرساي", "دخول الولايات المتحدة الحرب"], answer:"مؤتمر الصلح ومعاهدة فرساي", explain:"1919 سنة التسوية السياسية بعد الحرب."},
  {type:"mcq", q:"ما هدف إنشاء عصبة الأمم؟", options:["تقسيم إفريقيا", "تشجيع الحرب", "الحفاظ على السلم العالمي", "إنشاء الاتحاد الأوروبي"], answer:"الحفاظ على السلم العالمي", explain:"أُنشئت عصبة الأمم لحل النزاعات سلمياً وتجنب الحروب."},
  {type:"mcq", q:"أي نتيجة اقتصادية خلفتها الحرب؟", options:["اختفاء البطالة نهائياً", "ازدهار جميع الدول الأوروبية", "ارتفاع مديونية الدول الأوروبية", "توقف التنافس الاستعماري كلياً"], answer:"ارتفاع مديونية الدول الأوروبية", explain:"أثقلت نفقات الحرب كاهل الدول الأوروبية بالديون."},
  {type:"tf", q:"اندلعت الحرب العالمية الأولى بسبب سبب مباشر فقط.", answer:false, explain:"هناك أسباب غير مباشرة عديدة، ثم سبب مباشر فجّر الحرب."},
  {type:"tf", q:"اغتيال ولي عهد النمسا كان شرارة اندلاع الحرب.", answer:true, explain:"صحيح، حدث ذلك في سراييفو يوم 28 يونيو 1914."},
  {type:"tf", q:"دخلت الولايات المتحدة الأمريكية الحرب سنة 1917.", answer:true, explain:"دخولها ساعد على رجحان كفة دول الوفاق."},
  {type:"tf", q:"انتهت العمليات العسكرية سنة 1919.", answer:false, explain:"خطأ: انتهت عسكرياً سنة 1918، أما 1919 فهي سنة التسوية السياسية."},
  {type:"tf", q:"أدت الحرب إلى تفكك إمبراطوريات قديمة.", answer:true, explain:"منها النمسا-المجر والإمبراطورية العثمانية."},
  {type:"tf", q:"عصبة الأمم أنشئت قبل الحرب العالمية الأولى.", answer:false, explain:"أُنشئت بعد الحرب ضمن نتائج التسوية السياسية."},
  {type:"mcq", q:"ما العلاقة بين التحالفات العسكرية والحرب؟", options:["جعلت النزاع المحلي قابلاً للاتساع", "أنهت التنافس الاستعماري", "منعت أي مواجهة عسكرية", "كانت نتيجة لأزمة 1929"], answer:"جعلت النزاع المحلي قابلاً للاتساع", explain:"الأحلاف جعلت الدول تدخل الحرب تباعاً إلى جانب حلفائها."},
  {type:"mcq", q:"ما المقصود بالتسابق نحو التسلح؟", options:["التنافس في بناء المدارس", "التنافس في تقوية الجيوش والأسلحة", "تبادل البعثات الثقافية", "إنشاء عصبة الأمم"], answer:"التنافس في تقوية الجيوش والأسلحة", explain:"قبل الحرب سعت الدول إلى تعزيز قوتها العسكرية."},
  {type:"mcq", q:"أي مما يلي نتيجة اجتماعية للحرب؟", options:["انتشار الفقر والبطالة", "اغتيال ولي عهد النمسا", "تكوين الوفاق الثلاثي", "التسابق نحو التسلح"], answer:"انتشار الفقر والبطالة", explain:"أثّر التدهور الاقتصادي على المجتمع ومستوى المعيشة."},
  {type:"mcq", q:"أي مما يلي نتيجة سياسية؟", options:["انخفاض الولادات", "معاهدة فرساي", "ارتفاع نفقات الحرب", "حرب الخنادق"], answer:"معاهدة فرساي", explain:"فرساي جزء من التسوية السياسية بعد الحرب."},
  {type:"tf", q:"التنافس الإمبريالي سبب غير مباشر للحرب العالمية الأولى.", answer:true, explain:"نعم، لأنه زاد التوتر بين القوى الأوروبية قبل 1914."},
  {type:"tf", q:"أزمة 1929 كانت السبب المباشر للحرب العالمية الأولى.", answer:false, explain:"أزمة 1929 جاءت بعد الحرب العالمية الأولى بسنوات."}
];

const stations = [
  {
    title:"قبل العاصفة: سؤال الدرس",
    image:"assets/hero_map.svg",
    stamp:"الأسباب العميقة",
    speech:"قبل الحرب، كانت أوروبا مليئة بالتوتر. لنبدأ بالإشكالية.",
    text:`قاد التنافس الإمبريالي العالم نحو حرب عالمية دامت أربع سنوات. في هذه الرحلة سنفهم الأسباب، المراحل، والنتائج. اضغط على المصطلحات لتفتح مفاتيح الدرس.`,
    activity:{type:"terms", terms:[
      {t:"النزعة القومية", d:"شعور جماعة بشرية بالانتماء إلى أمة واحدة ورغبتها في الدفاع عن مصالحها أو الاستقلال."},
      {t:"الإمبريالية", d:"سياسة توسعية تهدف من خلالها الدول القوية إلى السيطرة على مناطق أخرى اقتصادياً وسياسياً."},
      {t:"التحالفات العسكرية", d:"اتفاقات بين دول للدفاع المشترك أو مواجهة خصوم مشتركين."},
      {t:"التسابق نحو التسلح", d:"تنافس الدول في تقوية جيوشها وأسلحتها استعداداً للحرب."}
    ]}
  },
  {
    title:"برميل البارود الأوروبي",
    image:"assets/powder_keg.svg",
    stamp:"الأسباب العميقة",
    speech:"اجمع الأسباب الصحيحة لترى مؤشر التوتر يرتفع.",
    text:`لم تنفجر الحرب من فراغ. تراكمت أسباب غير مباشرة: القومية، التنافس الإمبريالي، التحالفات، والتسلح. أما بعض الأحداث فظهرت بعد الحرب وليست سبباً لها.`,
    activity:{type:"classify", prompt:"ضع كل بطاقة في مكانها الصحيح:", buckets:["سبب غير مباشر", "ليست سبباً مباشراً"], items:[
      {text:"نمو النزعة القومية بأوروبا", bucket:"سبب غير مباشر"},
      {text:"التنافس الإمبريالي حول المستعمرات", bucket:"سبب غير مباشر"},
      {text:"تكوّن التحالفات العسكرية", bucket:"سبب غير مباشر"},
      {text:"التسابق نحو التسلح", bucket:"سبب غير مباشر"},
      {text:"إنشاء عصبة الأمم", bucket:"ليست سبباً مباشراً"},
      {text:"معاهدة فرساي", bucket:"ليست سبباً مباشراً"},
      {text:"مؤتمر الصلح سنة 1919", bucket:"ليست سبباً مباشراً"}
    ], meter:true}
  },
  {
    title:"شرارة سراييفو",
    image:"assets/sarajevo.svg",
    stamp:"الشرارة",
    speech:"أحياناً تكون الشرارة صغيرة، لكنها تجد حولها برميل بارود.",
    text:`السبب المباشر لاندلاع الحرب العالمية الأولى هو اغتيال ولي عهد النمسا أثناء زيارته لسراييفو يوم 28 يونيو 1914.`,
    activity:{type:"mcq", q:"اختر الدليل الذي يمثل السبب المباشر:", options:["الأزمة الاقتصادية 1929", "اغتيال ولي عهد النمسا في سراييفو", "ظهور الاتحاد الأوروبي", "تأسيس عصبة الأمم", "اكتشاف طريق رأس الرجاء الصالح"], answer:"اغتيال ولي عهد النمسا في سراييفو", explain:"صحيح. هذا الحدث كان الشرارة التي فجرت الحرب بعد تراكم الأسباب العميقة."}
  },
  {
    title:"خريطة الأحلاف",
    image:"assets/alliances_map.svg",
    stamp:"الأحلاف",
    speech:"الأحلاف حولت النزاع من أزمة محدودة إلى حرب واسعة.",
    text:`تواجهت مجموعتان رئيسيتان: الوفاق الثلاثي، ويضم فرنسا وبريطانيا وروسيا، ودول المركز التي يمثلها أساساً ألمانيا والنمسا-المجر وحلفاؤهما.`,
    activity:{type:"classify", prompt:"صنّف الدول حسب المعسكر:", buckets:["الوفاق الثلاثي", "دول المركز"], items:[
      {text:"فرنسا", bucket:"الوفاق الثلاثي"}, {text:"بريطانيا/إنجلترا", bucket:"الوفاق الثلاثي"}, {text:"روسيا", bucket:"الوفاق الثلاثي"},
      {text:"ألمانيا", bucket:"دول المركز"}, {text:"النمسا-المجر", bucket:"دول المركز"}
    ], note:"تنبيه تاريخي مبسط: إيطاليا كانت ضمن التحالف الثلاثي قبل الحرب، لكنها غيّرت موقفها خلال الحرب، لذلك نعرضها كتفصيل إضافي لا لتعقيد الدرس."}
  },
  {
    title:"داخل الخنادق: مراحل الحرب",
    image:"assets/timeline_train.svg",
    stamp:"المراحل",
    speech:"رتب الأحداث لتفهم مسار الحرب.",
    text:`مرت الحرب بمرحلتين: 1914–1917 تميزت بتفوق نسبي لدول المركز، و1917–1918 تميزت بانسحاب روسيا ودخول الولايات المتحدة، فمالت الكفة للوفاق.`,
    activity:{type:"sort", prompt:"رتب الأحداث زمنياً:", correct:["اغتيال ولي عهد النمسا في سراييفو", "المرحلة الأولى وتفوق نسبي لدول المركز", "انسحاب روسيا ودخول الولايات المتحدة", "هزيمة ألمانيا سنة 1918", "مؤتمر الصلح ومعاهدة فرساي سنة 1919"]}
  },
  {
    title:"بطاقتان غيّرتا الميزان",
    image:"assets/trench.svg",
    stamp:"المراحل",
    speech:"سنة 1917 محطة مفصلية: انسحاب من جهة ودخول من جهة أخرى.",
    text:`انسحبت روسيا بعد الثورة البلشفية، ودخلت الولايات المتحدة الأمريكية الحرب، فتغير ميزان القوى لصالح دول الوفاق.`,
    activity:{type:"twoCards", cards:[
      {img:"assets/russia_card.svg", q:"ماذا ترتب عن الثورة البلشفية بالنسبة للحرب؟", answer:"انسحاب روسيا", options:["انسحاب روسيا", "بداية الحرب", "إنشاء عصبة الأمم"]},
      {img:"assets/usa_card.svg", q:"ماذا ترتب عن دخول الولايات المتحدة؟", answer:"رجحان كفة الوفاق", options:["رجحان كفة الوفاق", "تأسيس الاتحاد الأوروبي", "تفكك الوفاق"]}
    ]}
  },
  {
    title:"حصيلة حرب مدمرة",
    image:"assets/results_infographic.svg",
    stamp:"النتائج",
    speech:"لا تنظر إلى الخريطة فقط؛ الحرب مست البشر والاقتصاد والمجتمع والسياسة.",
    text:`خلفت الحرب نتائج بشرية واقتصادية واجتماعية وسياسية: قتلى ومعطوبون، ديون وتراجع اقتصادي، فقر وبطالة، وتغيرات سياسية كبرى.`,
    activity:{type:"categorize", prompt:"صنف النتائج حسب نوعها:", categories:["بشرية", "اقتصادية", "اجتماعية", "سياسية"], items:[
      {text:"ارتفاع عدد القتلى والمعطوبين", cat:"بشرية"},
      {text:"انخفاض الولادات وانتشار الشيخوخة", cat:"بشرية"},
      {text:"تراجع اقتصاد الدول المتحاربة", cat:"اقتصادية"},
      {text:"ارتفاع نفقات الحرب والمديونية", cat:"اقتصادية"},
      {text:"استفادة الولايات المتحدة واليابان اقتصادياً", cat:"اقتصادية"},
      {text:"انتشار الفقر والبطالة", cat:"اجتماعية"},
      {text:"عقد مؤتمر الصلح بفرساي سنة 1919", cat:"سياسية"},
      {text:"تفكك الإمبراطوريات القديمة", cat:"سياسية"},
      {text:"إنشاء عصبة الأمم", cat:"سياسية"}
    ]}
  },
  {
    title:"قصر فرساي 1919",
    image:"assets/versailles.svg",
    stamp:"فرساي",
    speech:"تذكّر: هنا نحن في التسوية السياسية، لا في نهاية العمليات العسكرية.",
    text:`عقد مؤتمر الصلح بقصر فرساي سنة 1919 وفرض شروطاً قاسية على الدول المنهزمة، وساهم في تغيير الخريطة السياسية لأوروبا وتفكك إمبراطوريات قديمة.`,
    activity:{type:"mcqMulti", q:"اختر القرارات أو النتائج المرتبطة بمؤتمر الصلح:", correct:["فرض شروط قاسية على الدول المنهزمة", "تغيير الخريطة السياسية لأوروبا", "إضعاف القوة العسكرية للدول المنهزمة", "إنشاء عصبة الأمم"], options:["فرض شروط قاسية على الدول المنهزمة", "تأسيس الاتحاد الأوروبي", "تغيير الخريطة السياسية لأوروبا", "إضعاف القوة العسكرية للدول المنهزمة", "انطلاق أزمة 1929 مباشرة", "إنشاء عصبة الأمم"]}
  },
  {
    title:"عصبة الأمم: حلم السلم",
    image:"assets/league.svg",
    stamp:"عصبة الأمم",
    speech:"بعد الحرب، حاول العالم بناء آلية لتجنب حرب جديدة.",
    text:`عصبة الأمم منظمة دولية أُنشئت بعد الحرب العالمية الأولى بهدف الحفاظ على السلم العالمي وحل النزاعات الدولية بالطرق السلمية.`,
    activity:{type:"mcq", q:"ما مهمة عصبة الأمم الأساسية؟", options:["الحفاظ على السلم وحل الصراعات سلمياً", "تشجيع التسلح", "تقسيم المستعمرات فقط", "إعلان حرب عالمية جديدة"], answer:"الحفاظ على السلم وحل الصراعات سلمياً", explain:"هذا هو الهدف المعلن من إنشائها بعد الحرب."}
  },
  {
    title:"مخبر المؤرخ ومغالطات تاريخية",
    image:"assets/memory_chest.svg",
    stamp:"مخبر المؤرخ",
    speech:"الآن نختبر الفهم العميق: وثيقة، سبب، مرحلة، أم نتيجة؟",
    text:`هذه محطة تثبيت: سنقرأ وثائق قصيرة ونكشف المغالطات الشائعة، لأن التلميذ الممتاز لا يحفظ فقط بل يصحح ويفسر.`,
    activity:{type:"documents"}
  },
  {
    title:"افتح صندوق الذاكرة",
    image:"assets/memory_chest.svg",
    stamp:"الصندوق",
    speech:"حان وقت التحدي النهائي. افتح الصندوق بثماني إجابات صحيحة على الأقل.",
    text:`أجب عن 12 سؤالاً عشوائياً. عند النجاح ستحصل على شهادة تقدير قابلة للطباعة.`,
    activity:{type:"finalQuiz"}
  }
];

function loadState(){
  try { return JSON.parse(localStorage.getItem(storeKey)) || {done:{}, currentStation:0, lastScore:0}; }
  catch { return {done:{}, currentStation:0, lastScore:0}; }
}
function saveState(){ localStorage.setItem(storeKey, JSON.stringify(state)); }
function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m])); }
function sound(type="ok"){
  if(!soundOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if(!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  const map = {ok:[540,720,.09], bad:[180,100,.14], move:[330,520,.1], open:[220,440,.24], stamp:[700,900,.12]};
  const [a,b,d] = map[type] || map.ok;
  osc.frequency.setValueAtTime(a, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(b, ctx.currentTime+d);
  gain.gain.setValueAtTime(.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.18, ctx.currentTime+.02);
  gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime+d);
  osc.start(); osc.stop(ctx.currentTime+d+.03);
}
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }
function page(id){ $$(".page").forEach(p=>p.classList.remove("active-page")); $(id).classList.add("active-page"); }
function openModal(id){ $("#"+id).classList.add("show"); $("#"+id).setAttribute("aria-hidden","false"); }
function closeModal(id){ $("#"+id).classList.remove("show"); $("#"+id).setAttribute("aria-hidden","true"); }
function markDone(stationIndex){
  const st = stations[stationIndex];
  state.done[stationIndex] = true;
  state.currentStation = Math.max(state.currentStation || 0, stationIndex);
  saveState();
  updateProgress();
  sound("stamp");
}
function updateProgress(){
  const doneCount = Object.keys(state.done || {}).filter(k => state.done[k]).length;
  const pct = Math.round((doneCount / stations.length) * 100);
  $("#progressFill").style.width = pct + "%";
  $("#progressText").textContent = pct + "%";
  $("#teacherDone") && ($("#teacherDone").textContent = doneCount);
  renderStamps();
}
function renderStamps(){
  const board = $("#stampBoard");
  board.innerHTML = stamps.slice(0,10).map((s, i)=>{
    const done = Object.keys(state.done||{}).some(k => stations[k] && stations[k].stamp === s && state.done[k]);
    return `<div class="stamp ${done?'done':''}">${done?'✅ ':''}${s}</div>`;
  }).join("");
}
function guide(msg){ $("#guideSpeech").textContent = msg || guideLines[Math.floor(Math.random()*guideLines.length)]; }

function renderStation(){
  const st = stations[currentStation];
  state.currentStation = currentStation; saveState();
  $("#stationCounter").textContent = `المحطة ${currentStation+1} / ${stations.length}`;
  guide(st.speech);
  const done = !!state.done[currentStation];
  $("#stationContent").innerHTML = `
    <div class="station-grid">
      <div class="station-visual"><img src="${st.image}" alt="${escapeHtml(st.title)}"></div>
      <div class="station-info">
        <span class="lesson-chip">${done ? '✅ محطة منجزة' : '🎯 مهمة جديدة'}</span>
        <h2>${st.title}</h2>
        <p>${st.text}</p>
        <div class="mission-box">
          <div class="mission-title">🧭 مهمة التعلم باللعب</div>
          <div id="activityRoot"></div>
        </div>
        <div class="station-footer">
          <button class="secondary-btn" id="stationReportBtn" type="button">📄 افتح تقرير الدرس</button>
          <button class="primary-btn" id="completeStationBtn" type="button">اختم المحطة يدوياً</button>
        </div>
      </div>
    </div>`;
  $("#stationReportBtn").onclick = () => openModal("reportModal");
  $("#completeStationBtn").onclick = () => { markDone(currentStation); toast("تم ختم المحطة في جواز الرحلة"); renderStation(); };
  renderActivity(st.activity, $("#activityRoot"));
  updateProgress();
}

function renderActivity(activity, root){
  if(activity.type === "terms") return renderTerms(activity, root);
  if(activity.type === "classify") return renderClassify(activity, root);
  if(activity.type === "mcq") return renderMCQ(activity, root);
  if(activity.type === "sort") return renderSort(activity, root);
  if(activity.type === "categorize") return renderCategorize(activity, root);
  if(activity.type === "twoCards") return renderTwoCards(activity, root);
  if(activity.type === "mcqMulti") return renderMulti(activity, root);
  if(activity.type === "documents") return renderDocuments(root);
  if(activity.type === "finalQuiz") return renderFinalQuiz(root);
}
function completeWithMessage(msg){ markDone(currentStation); toast(msg || "أحسنت! ختم جديد في جواز الرحلة"); guide("أحسنت، جمعت قطعة من خريطة الفهم."); }
function renderTerms(activity, root){
  root.innerHTML = `<div class="terms-grid">${activity.terms.map((x,i)=>`<button class="term-card" data-i="${i}" type="button"><h4>${x.t}</h4><p class="hidden">${x.d}</p></button>`).join("")}</div><div class="feedback">افتح المصطلحات الأربعة لتبدأ الرحلة.</div>`;
  const opened = new Set();
  $$(".term-card", root).forEach(btn=>{
    btn.onclick=()=>{
      btn.querySelector("p").classList.remove("hidden");
      btn.classList.add("correct");
      opened.add(btn.dataset.i); sound("ok");
      if(opened.size===activity.terms.length){ completeWithMessage("فتحت مفاتيح الدرس الأربعة"); }
    };
  });
}
function renderMCQ(activity, root){
  const opts = shuffle(activity.options);
  root.innerHTML = `<p class="mission-prompt">${activity.q}</p><div class="choice-grid">${opts.map(o=>`<button class="choice" type="button">${o}</button>`).join("")}</div><div class="feedback" id="fb">اختر جواباً.</div>`;
  $$(".choice", root).forEach(btn=>{
    btn.onclick=()=>{
      const good = btn.textContent === activity.answer;
      btn.classList.add(good?"correct":"wrong");
      $("#fb").textContent = good ? activity.explain : "ليست هذه الإجابة. تذكّر السبب أو النتيجة المرتبطة بالمحطة.";
      $("#fb").className = "feedback " + (good?"good":"bad");
      sound(good?"ok":"bad");
      if(good){ $$(".choice", root).forEach(b=>b.disabled=true); completeWithMessage("إجابة صحيحة: ختم جديد"); }
    };
  });
}
function renderClassify(activity, root){
  const id = "c" + Math.random().toString(36).slice(2);
  let currentItem = 0, correct = 0;
  const items = shuffle(activity.items);
  root.innerHTML = `<p>${activity.prompt}</p>${activity.note?`<p class="badge-note">${activity.note}</p>`:""}${activity.meter?'<div class="meter"><span id="meterFill"></span></div>':''}<div class="classify-board">${activity.buckets.map(b=>`<div class="bucket"><h4>${b}</h4><div class="bucket-items" data-bucket="${b}"></div></div>`).join("")}</div><div id="${id}" class="feedback">ابدأ بالبطاقة الأولى.</div><div class="cards-grid" id="classifyCards"></div>`;
  const cards = $("#classifyCards");
  function show(){
    if(currentItem >= items.length){
      const pass = correct === items.length;
      $("#"+id).textContent = pass ? "رائع! صنفت كل البطاقات بنجاح." : `انتهى النشاط. الصحيح: ${correct}/${items.length}. أعد المحاولة لتحصل على الختم.`;
      $("#"+id).className = "feedback " + (pass?"good":"bad");
      if(pass) completeWithMessage("صنفت البطاقات بدقة");
      else {
        const retry = document.createElement("button"); retry.className="secondary-btn"; retry.textContent="إعادة المحاولة"; retry.onclick=()=>renderClassify(activity, root); cards.appendChild(retry);
      }
      return;
    }
    const it = items[currentItem];
    cards.innerHTML = `<div class="mini-card"><strong>${it.text}</strong><div class="category-picker">${activity.buckets.map(b=>`<button type="button" data-b="${b}">${b}</button>`).join("")}</div></div>`;
    $$("[data-b]", cards).forEach(b=>b.onclick=()=>{
      const good = b.dataset.b === it.bucket;
      const target = root.querySelector(`[data-bucket="${CSS.escape(b.dataset.b)}"]`);
      const pill = document.createElement("div");
      pill.className = "category-card " + (good?"correct":"wrong"); pill.textContent = it.text;
      target.appendChild(pill);
      if(good) correct++;
      currentItem++;
      if(activity.meter) $("#meterFill").style.width = Math.round((correct/activity.items.length)*100)+"%";
      $("#"+id).textContent = good ? "اختيار موفق." : `تصحيح: هذه البطاقة تنتمي إلى: ${it.bucket}`;
      $("#"+id).className = "feedback " + (good?"good":"bad");
      sound(good?"ok":"bad");
      show();
    });
  }
  show();
}
function renderSort(activity, root){
  let arr = shuffle(activity.correct);
  root.innerHTML = `<p>${activity.prompt}</p><div class="sort-list" id="sortList"></div><div class="station-footer"><button class="primary-btn" id="checkSort" type="button">تحقق من الترتيب</button><button class="secondary-btn" id="resetSort" type="button">خلط جديد</button></div><div class="feedback" id="sortFb">استعمل السهمين لتحريك الحدث.</div>`;
  const list = $("#sortList");
  function draw(){
    list.innerHTML = arr.map((x,i)=>`<div class="sort-item"><span>${i+1}. ${x}</span><span class="sort-controls"><button type="button" data-up="${i}">↑</button><button type="button" data-down="${i}">↓</button></span></div>`).join("");
    $$('[data-up]', list).forEach(b=>b.onclick=()=>{const i=+b.dataset.up;if(i>0){[arr[i-1],arr[i]]=[arr[i],arr[i-1]];sound('move');draw();}});
    $$('[data-down]', list).forEach(b=>b.onclick=()=>{const i=+b.dataset.down;if(i<arr.length-1){[arr[i+1],arr[i]]=[arr[i],arr[i+1]];sound('move');draw();}});
  }
  draw();
  $("#resetSort").onclick=()=>{arr=shuffle(activity.correct);draw();};
  $("#checkSort").onclick=()=>{
    const good = arr.every((x,i)=>x===activity.correct[i]);
    $("#sortFb").textContent = good ? "ترتيب ممتاز. 1918 نهاية الحرب عسكرياً، و1919 سنة الصلح." : "ما زال الترتيب يحتاج مراجعة. ابدأ بالشرارة ثم المراحل ثم التسوية.";
    $("#sortFb").className = "feedback " + (good?"good":"bad");
    sound(good?"ok":"bad");
    if(good) completeWithMessage("رتبت الزمن التاريخي بنجاح");
  };
}
function renderCategorize(activity, root){
  let idx=0, correct=0; const items=shuffle(activity.items);
  root.innerHTML = `<p>${activity.prompt}</p><div class="classify-board">${activity.categories.map(c=>`<div class="bucket"><h4>${c}</h4><div class="bucket-items" data-cat="${c}"></div></div>`).join("")}</div><div class="cards-grid" id="catCard"></div><div class="feedback" id="catFb">صنف النتيجة الحالية.</div>`;
  const card = $("#catCard");
  function show(){
    if(idx>=items.length){
      const pass = correct >= Math.ceil(items.length*.8);
      $("#catFb").textContent = pass ? `أحسنت! نتيجتك ${correct}/${items.length}.` : `نتيجتك ${correct}/${items.length}. حاول مرة أخرى.`;
      $("#catFb").className = "feedback " + (pass?"good":"bad");
      if(pass) completeWithMessage("فهمت نتائج الحرب وصنفتها");
      else { card.innerHTML = `<button class="secondary-btn" type="button" id="retryCat">إعادة المحاولة</button>`; $("#retryCat").onclick=()=>renderCategorize(activity,root); }
      return;
    }
    const it=items[idx];
    card.innerHTML = `<div class="mini-card"><strong>${it.text}</strong><div class="category-picker">${activity.categories.map(c=>`<button type="button" data-cat-choice="${c}">${c}</button>`).join("")}</div></div>`;
    $$('[data-cat-choice]', card).forEach(b=>b.onclick=()=>{
      const good=b.dataset.catChoice===it.cat;
      const target=root.querySelector(`[data-cat="${CSS.escape(b.dataset.catChoice)}"]`);
      const pill=document.createElement('div'); pill.className="category-card "+(good?'correct':'wrong'); pill.textContent=it.text; target.appendChild(pill);
      if(good) correct++;
      idx++;
      $("#catFb").textContent = good ? "تصنيف صحيح." : `التصنيف الأدق: ${it.cat}`;
      $("#catFb").className = "feedback " + (good?"good":"bad"); sound(good?"ok":"bad"); show();
    });
  }
  show();
}
function renderTwoCards(activity, root){
  let solved=0;
  root.innerHTML = `<div class="cards-grid">${activity.cards.map((c,i)=>`<div class="mini-card"><img src="${c.img}" alt="بطاقة" style="border-radius:14px;margin-bottom:10px"><strong>${c.q}</strong><div class="choice-grid">${shuffle(c.options).map(o=>`<button class="choice" data-card="${i}" type="button">${o}</button>`).join("")}</div></div>`).join("")}</div><div class="feedback" id="twoFb">أجب عن البطاقتين.</div>`;
  const doneCards=new Set();
  $$(".choice", root).forEach(btn=>{
    btn.onclick=()=>{
      const c=activity.cards[+btn.dataset.card]; const good=btn.textContent===c.answer;
      btn.classList.add(good?"correct":"wrong"); sound(good?"ok":"bad");
      if(good && !doneCards.has(btn.dataset.card)){ doneCards.add(btn.dataset.card); solved++; }
      $("#twoFb").textContent = good ? "صحيح." : "راجع أثر سنة 1917 على ميزان القوى.";
      $("#twoFb").className = "feedback " + (good?"good":"bad");
      if(solved===activity.cards.length) completeWithMessage("فهمت منعطف سنة 1917");
    };
  });
}
function renderMulti(activity, root){
  const selected = new Set();
  root.innerHTML = `<p>${activity.q}</p><div class="choice-grid">${shuffle(activity.options).map(o=>`<button class="choice" data-opt="${o}" type="button">${o}</button>`).join("")}</div><div class="station-footer"><button class="primary-btn" id="checkMulti" type="button">تحقق</button></div><div class="feedback" id="multiFb">اختر كل الأجوبة الصحيحة.</div>`;
  $$(".choice", root).forEach(b=>b.onclick=()=>{ b.classList.toggle("correct"); if(selected.has(b.dataset.opt)) selected.delete(b.dataset.opt); else selected.add(b.dataset.opt); sound("move"); });
  $("#checkMulti").onclick=()=>{
    const corr = new Set(activity.correct);
    const good = selected.size === corr.size && [...selected].every(x=>corr.has(x));
    $$(".choice", root).forEach(b=>{ if(corr.has(b.dataset.opt)) b.classList.add("correct"); else if(selected.has(b.dataset.opt)) b.classList.add("wrong"); });
    $("#multiFb").textContent = good ? "اختيارات دقيقة. هذه من أهم نتائج وتسويات 1919." : "راجع: ليست كل الأحداث مرتبطة مباشرة بمؤتمر الصلح.";
    $("#multiFb").className = "feedback " + (good?"good":"bad"); sound(good?"ok":"bad"); if(good) completeWithMessage("فهمت تسوية فرساي");
  };
}
function renderDocuments(root){
  const docs = [
    {title:"وثيقة 1", text:"تصاعد التنافس بين الدول الأوروبية حول المستعمرات والأسواق.", answer:"سبب"},
    {title:"وثيقة 2", text:"ظهور تحالفات عسكرية جعلت كل دولة تستند إلى حلفائها.", answer:"سبب"},
    {title:"وثيقة 3", text:"انسحاب روسيا ودخول الولايات المتحدة سنة 1917.", answer:"مرحلة"},
    {title:"وثيقة 4", text:"فرض شروط قاسية على الدول المنهزمة بعد مؤتمر الصلح.", answer:"نتيجة"}
  ];
  const myths = [
    {bad:"الحرب العالمية الأولى انتهت سياسياً وعسكرياً سنة 1919.", fix:"انتهت عسكرياً سنة 1918، أما 1919 فهي سنة مؤتمر الصلح ومعاهدة فرساي."},
    {bad:"عصبة الأمم كانت سبباً في اندلاع الحرب.", fix:"عصبة الأمم نتيجة سياسية للحرب."},
    {bad:"أزمة 1929 سبب مباشر للحرب العالمية الأولى.", fix:"أزمة 1929 جاءت بعد الحرب العالمية الأولى."},
    {bad:"السبب المباشر هو التنافس الإمبريالي.", fix:"التنافس الإمبريالي سبب غير مباشر، أما السبب المباشر فهو اغتيال ولي عهد النمسا في سراييفو."}
  ];
  let docOk=0, mythOpen=0;
  root.innerHTML = `<h3>أولاً: مخبر الوثائق</h3><div class="doc-cards">${docs.map((d,i)=>`<div class="doc-card"><h4>${d.title}</h4><p>${d.text}</p><div class="category-picker">${["سبب","مرحلة","نتيجة"].map(c=>`<button type="button" data-doc="${i}" data-answer="${c}">${c}</button>`).join("")}</div></div>`).join("")}</div><div class="feedback" id="docFb">حدد طبيعة كل وثيقة.</div><h3>ثانياً: مغالطات تاريخية</h3><div class="doc-cards">${myths.map((m,i)=>`<div class="doc-card"><h4>مغالطة ${i+1}</h4><p>${m.bad}</p><button class="secondary-btn" type="button" data-myth="${i}">اكشف التصحيح</button><div class="fix-box hidden" id="myth-${i}">${m.fix}</div></div>`).join("")}</div>`;
  const solvedDocs = new Set();
  $$('[data-doc]', root).forEach(b=>b.onclick=()=>{
    const d=docs[+b.dataset.doc]; const good=b.dataset.answer===d.answer;
    b.classList.add(good?'correct':'wrong'); sound(good?'ok':'bad');
    if(good && !solvedDocs.has(b.dataset.doc)){ solvedDocs.add(b.dataset.doc); docOk++; }
    $("#docFb").textContent = good ? "تحليل وثيقة صحيح." : `الأدق: ${d.answer}`;
    $("#docFb").className = "feedback " + (good?'good':'bad');
    if(docOk===docs.length && mythOpen===myths.length) completeWithMessage("أصبحت مؤرخاً صغيراً: تحلل وتصحح");
  });
  const openedMyths = new Set();
  $$('[data-myth]', root).forEach(b=>b.onclick=()=>{
    const i=b.dataset.myth; $(`#myth-${i}`).classList.remove('hidden'); sound('move');
    if(!openedMyths.has(i)){ openedMyths.add(i); mythOpen++; }
    if(docOk===docs.length && mythOpen===myths.length) completeWithMessage("أصبحت مؤرخاً صغيراً: تحلل وتصحح");
  });
}
function renderFinalQuiz(root){
  let quiz = shuffle(questionBank).slice(0,12);
  let idx=0, score=0;
  root.innerHTML = `<div class="final-quiz-card"><h3>تحدي صندوق الذاكرة</h3><p>أجب عن 12 سؤالاً. النجاح من 8/12.</p><div id="quizBox"></div></div>`;
  const box = $("#quizBox");
  function showQ(){
    if(idx>=quiz.length){
      state.lastScore = score; saveState(); updateTeacherStats();
      const pass = score>=8;
      box.innerHTML = `<div class="final-score">${score}/12</div><p>${pass?'ممتاز! فتحت صندوق الذاكرة.':'نتيجة قريبة. أعد المحاولة لتفتح الصندوق.'}</p><div class="station-footer" style="justify-content:center">${pass?'<button class="primary-btn" id="certBtn" type="button">🎓 عرض الشهادة</button>':''}<button class="secondary-btn" id="retryFinal" type="button">إعادة التحدي</button></div>`;
      if(pass){ completeWithMessage("فتحت صندوق الذاكرة وحصلت على الشهادة"); launchConfetti(); sound('open'); $("#certBtn").onclick=()=>openModal('certificateModal'); }
      $("#retryFinal").onclick=()=>renderFinalQuiz(root);
      return;
    }
    const q = quiz[idx];
    if(q.type === "mcq"){
      box.innerHTML = `<p class="badge-note">سؤال ${idx+1}/12</p><h3>${q.q}</h3><div class="choice-grid">${shuffle(q.options).map(o=>`<button class="choice" type="button">${o}</button>`).join("")}</div><div class="feedback" id="qFb">اختر الجواب.</div>`;
      $$(".choice", box).forEach(b=>b.onclick=()=>answer(b.textContent===q.answer,q.explain));
    } else {
      box.innerHTML = `<p class="badge-note">سؤال ${idx+1}/12</p><h3>${q.q}</h3><div class="choice-grid"><button class="choice" type="button" data-v="true">صحيح</button><button class="choice" type="button" data-v="false">خطأ</button></div><div class="feedback" id="qFb">اختر الجواب.</div>`;
      $$(".choice", box).forEach(b=>b.onclick=()=>answer((b.dataset.v==='true')===q.answer,q.explain));
    }
  }
  function answer(good, exp){
    if(good) score++;
    $("#qFb").textContent = (good?"صحيح. ":"خطأ. ") + exp;
    $("#qFb").className = "feedback " + (good?'good':'bad');
    sound(good?'ok':'bad');
    $$(".choice", box).forEach(b=>b.disabled=true);
    setTimeout(()=>{idx++; showQ();}, 900);
  }
  showQ();
}
function launchConfetti(){
  const c=document.createElement('div'); c.className='confetti';
  for(let i=0;i<80;i++){ const p=document.createElement('i'); p.style.left=Math.random()*100+'vw'; p.style.animationDelay=Math.random()*1+'s'; p.style.background=["#d6a83e","#fff0a5","#2b7bbb","#c83232"][Math.floor(Math.random()*4)]; c.appendChild(p); }
  document.body.appendChild(c); setTimeout(()=>c.remove(),3600);
}
function renderMapPieces(){
  const pieceNames = ["قطعة الأسباب العميقة","قطعة الشرارة","قطعة الأحلاف","قطعة المراحل","قطعة النتائج","قطعة فرساي وعصبة الأمم"];
  const doneByStamp = (name) => Object.keys(state.done||{}).some(k=>state.done[k] && stations[k] && stations[k].stamp.includes(name));
  const done = [doneByStamp("الأسباب"),doneByStamp("الشرارة"),doneByStamp("الأحلاف"),doneByStamp("المراحل"),doneByStamp("النتائج"),doneByStamp("فرساي") || doneByStamp("عصبة")];
  $("#mapPieces").innerHTML = pieceNames.map((p,i)=>`<div class="piece ${done[i]?'done':''}">${done[i]?'✅ ':''}${p}</div>`).join('');
  $("#mapMessage").textContent = done.every(Boolean) ? "الآن فهمتَ كيف تحولت أزمة أوروبية إلى حرب عالمية." : "واصل الرحلة لتكتمل الخريطة.";
}
function updateTeacherStats(){
  const qCount = questionBank.length;
  $("#teacherQCount") && ($("#teacherQCount").textContent = qCount);
  $("#teacherScore") && ($("#teacherScore").textContent = state.lastScore || 0);
  $("#teacherDone") && ($("#teacherDone").textContent = Object.keys(state.done||{}).length);
}
function renderQuestionList(){
  $("#questionList").innerHTML = questionBank.map((q,i)=>`<details><summary>سؤال ${i+1}: ${escapeHtml(q.q)}</summary><p><strong>النوع:</strong> ${q.type}</p><p><strong>الجواب:</strong> ${q.type==='tf' ? (q.answer?'صحيح':'خطأ') : escapeHtml(q.answer)}</p><p>${escapeHtml(q.explain)}</p></details>`).join('');
}
function resetAll(){
  state = {done:{}, currentStation:0, lastScore:0}; currentStation=0; saveState(); updateProgress(); renderStation(); toast("تمت إعادة البداية");
}
function printReport(){ openModal('reportModal'); setTimeout(()=>window.print(),200); }
function printCertificate(){ openModal('certificateModal'); setTimeout(()=>window.print(),200); }

function prefillName(){
  try{
    const portal = JSON.parse(localStorage.getItem('rihla_3ac_portal_v2') || '{}');
    if(portal.name){ $("#studentName").value = portal.name; $("#certName").textContent = portal.name; }
  }catch(e){}
}
function init(){
  renderStamps(); updateProgress(); updateTeacherStats(); prefillName();
  $("#startJourneyBtn").onclick = ()=>{ currentStation=0; page('#journey'); renderStation(); sound('move'); };
  $("#resumeBtn").onclick = ()=>{ currentStation=state.currentStation || 0; page('#journey'); renderStation(); sound('move'); };
  $("#prevStationBtn").onclick = ()=>{ currentStation=Math.max(0,currentStation-1); renderStation(); sound('move'); };
  $("#nextStationBtn").onclick = ()=>{ currentStation=Math.min(stations.length-1,currentStation+1); renderStation(); sound('move'); };
  $("#resetBtn").onclick = resetAll;
  $("#mapBtn").onclick = ()=>{ renderMapPieces(); openModal('mapModal'); };
  $("#openReportBtn").onclick = ()=>openModal('reportModal');
  $("#printReportBtn").onclick = ()=>window.print();
  $("#openTeacherBtn").onclick = ()=>openModal('teacherModal');
  $("#teacherLoginBtn").onclick = ()=>{
    if($("#teacherPassword").value === "1234"){
      $("#teacherLogin").classList.add('hidden'); $("#teacherPanel").classList.remove('hidden'); updateTeacherStats(); renderQuestionList(); sound('ok');
    } else { toast("كلمة المرور غير صحيحة"); sound('bad'); }
  };
  $("#teacherPrintBtn").onclick = printReport;
  $("#teacherResetBtn").onclick = resetAll;
  $("#printCertificateBtn").onclick = ()=>window.print();
  $("#studentName").addEventListener('input', e=> { $("#certName").textContent = e.target.value.trim() || "........................"; });
  $("#soundToggle").onclick = ()=>{ soundOn=!soundOn; $("#soundToggle").textContent = soundOn?'🔊 الصوت':'🔇 صامت'; toast(soundOn?'تم تشغيل الصوت':'تم كتم الصوت'); };
  $$('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
  $$('.modal').forEach(m=>m.addEventListener('click', e=>{ if(e.target===m) closeModal(m.id); }));
}
init();
