import { uid } from '../utils.js';

export function isMath(s){ return /رياض|math/i.test(s) }
export function isSocial(s){ return /اجتماع|تاريخ|جغراف/i.test(s) }
export function isPC(s){ return /فيزياء|كيمياء|phys|chim/i.test(s) }
export function isSVT(s){ return /الحياة|الأرض|svt/i.test(s) }
export function isLang(s){ return /عربية|français|french|english|لغة/i.test(s) }
export function isIslamic(s){ return /إسلام|اسلام/i.test(s) }
export function isPhilosophy(s){ return /فلسف/i.test(s) }

export function subjectCategories(s){
  if(isMath(s)) return ['تمارين','فرض','تصحيح','بطاقة دعم','قاعدة/خاصية'];
  if(isSocial(s)) return ['خريطة','وثيقة تاريخية','خطاطة','مصطلحات','تواريخ','وضعية إدماجية'];
  if(isPC(s)) return ['تجربة','رسم تجريبي','قانون','تمارين','احتياطات السلامة'];
  if(isSVT(s)) return ['وثيقة علمية','رسم تخطيطي','تجربة','خلاصة','تمارين'];
  if(isLang(s)) return ['نص','درس لغوي','إنتاج كتابي','شبكة تقويم','فرض'];
  if(isIslamic(s)) return ['نص شرعي','مدخل','قيمة','نشاط','تقويم'];
  if(isPhilosophy(s)) return ['نص فلسفي','مفهوم','إشكالية','حجاج','تقويم'];
  return ['فرض','تصحيح','تمارين','جذاذة','رابط'];
}

export function templateElements(title, s){
  if(isMath(s)) return [
    {level:'major', text:'أهداف الحصة ومكتسباتها'},
    {level:'minor', text:'تحديد المفهوم أو التقنية المرتبطة بدرس: '+title},
    {level:'major', text:'بناء القاعدة أو الخاصية'},
    {level:'minor', text:'تقديم تعريف/خاصية مع مثال موجه.'},
    {level:'letter', text:'إنجاز تطبيقات وتمارين تدريجية.'}
  ].map(x=>({...x, id:uid()}));
  if(isSocial(s)) return [
    {level:'major', text:'تحديد موضوع الدرس ومفاهيمه'},
    {level:'minor', text:'قراءة العنوان والوثائق وتحديد الإطار الزمني/المجالي.'},
    {level:'major', text:'تحليل الوثائق والمعطيات'},
    {level:'minor', text:'استخراج الأسباب أو المظاهر أو النتائج.'},
    {level:'letter', text:'بناء تركيب وتقويم مرحلي.'}
  ].map(x=>({...x, id:uid()}));
  if(isPC(s)) return [
    {level:'major', text:'الوضعية التجريبية وإشكال الحصة'},
    {level:'minor', text:'تقديم التجربة أو الوضعية المشكلة.'},
    {level:'major', text:'الملاحظة والاستنتاج'},
    {level:'minor', text:'صياغة القانون أو الخلاصة العلمية.'},
    {level:'letter', text:'تطبيق مع احترام احتياطات السلامة.'}
  ].map(x=>({...x, id:uid()}));
  if(isSVT(s)) return [
    {level:'major', text:'وضعية مشكلة وملاحظة علمية'},
    {level:'minor', text:'استثمار وثائق أو رسوم أو معطيات.'},
    {level:'major', text:'التفسير وبناء الخلاصة'},
    {level:'minor', text:'ربط المعطيات بالمفهوم العلمي.'},
    {level:'letter', text:'تقويم أو رسم تخطيطي.'}
  ].map(x=>({...x, id:uid()}));
  if(isLang(s)) return [
    {level:'major', text:'قراءة وفهم النص/الموضوع'},
    {level:'minor', text:'استخراج الفكرة العامة والمعجم أو الظاهرة.'},
    {level:'major', text:'اللغة والإنتاج'},
    {level:'minor', text:'بناء القاعدة أو المهارة التعبيرية.'},
    {level:'letter', text:'إنجاز إنتاج كتابي أو تقويم قصير.'}
  ].map(x=>({...x, id:uid()}));
  if(isIslamic(s)) return [
    {level:'major', text:'النص الشرعي والمضامين'},
    {level:'minor', text:'قراءة النص واستخراج المعاني الأساسية.'},
    {level:'major', text:'القيم والامتدادات السلوكية'},
    {level:'minor', text:'ربط الدرس بالحياة اليومية.'},
    {level:'letter', text:'تقويم ودعم التعلمات.'}
  ].map(x=>({...x, id:uid()}));
  if(isPhilosophy(s)) return [
    {level:'major', text:'الإشكالية والمفهوم'},
    {level:'minor', text:'تحديد الإشكالية وصياغة الأسئلة الفلسفية.'},
    {level:'major', text:'تحليل النص وبناء الحجاج'},
    {level:'minor', text:'استثمار النصوص الفلسفية وتقييم المواقف.'},
    {level:'letter', text:'تركيب وتقويم نقدي.'}
  ].map(x=>({...x, id:uid()}));
  return [
    {id:uid(), level:'major', text:'أهداف الحصة'},
    {id:uid(), level:'minor', text:'بناء التعلمات حول: '+title},
    {id:uid(), level:'letter', text:'نشاط تطبيقي وتقويم.'}
  ];
}

export function defaultActivities(kind, s){
  if(isMath(s)) return 'أمثلة موجهة، تمارين تدريجية، تصحيح جماعي.';
  if(isSocial(s)) return 'وثائق، خريطة/نص/جدول، أسئلة موجهة، تركيب.';
  if(isPC(s)) return 'تجربة أو محاكاة، أدوات مخبرية، احتياطات السلامة، تطبيق.';
  if(isSVT(s)) return 'وثائق علمية، رسم تخطيطي، ملاحظة وتفسير.';
  if(isLang(s)) return 'قراءة، فهم، قاعدة لغوية أو إنتاج كتابي.';
  return 'أنشطة ووسائل مناسبة للمادة.';
}
