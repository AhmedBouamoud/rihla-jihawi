const particles = document.querySelector('.particles');
for(let i=0;i<42;i++){
  const p=document.createElement('span');
  p.className='particle';
  p.style.left=Math.random()*100+'%';
  p.style.animationDuration=(9+Math.random()*12)+'s';
  p.style.animationDelay=(-Math.random()*14)+'s';
  p.style.opacity=.35+Math.random()*.5;
  particles.appendChild(p);
}
const opening=document.getElementById('opening');
const skip=document.getElementById('skipIntro');
skip.addEventListener('click',()=>{opening.style.display='none';skip.style.display='none'});
setTimeout(()=>{skip.style.display='none'},3900);

const ibnText=document.getElementById('ibnText');
const tips=[
  'الرحالة لا يبدأ بكل الطرق دفعة واحدة. اختر بوابة واحدة اليوم، وأتقنها جيداً.',
  'إذا وجدت وثيقة صعبة، ابحث أولاً عن العنوان والمصدر والتاريخ. هذه مفاتيح الطريق.',
  'لا تحفظ التاريخ كأرقام متفرقة؛ اربط السنة بالحدث والسبب والنتيجة.',
  'في الجغرافيا، الخريطة لا تُنظر فقط… تُقرأ: عنوان، مفتاح، اتجاه، ومجال.',
  'عند الخطأ لا تتوقف؛ كل عثرة تكشف لك موضعاً يحتاج إلى مراجعة.'
];
document.getElementById('ibnTip').addEventListener('click',()=>{
  ibnText.textContent=tips[Math.floor(Math.random()*tips.length)];
});
document.querySelectorAll('.gate').forEach(g=>{
  g.addEventListener('click',()=>{
    document.querySelectorAll('.gate').forEach(x=>x.classList.remove('active'));
    g.classList.add('active');
    ibnText.textContent=g.dataset.message;
    document.getElementById('ibnBox').scrollIntoView({behavior:'smooth',block:'center'});
  });
});
const missions=[
  'خريطة الذاكرة ضاعت! رتّب 5 أحداث من تاريخ المغرب وافتح صندوق الزمن.',
  'مهمة الرحالة العاجلة: استخرج الدليل المخفي من وثيقة تاريخية واربح شارة المحقق.',
  'بوابة الجغرافيا تنتظر: ضع 4 مؤشرات في مكانها الصحيح وافتح مفتاح الخريطة.',
  'تحدي اليوم: ابنِ مبياناً بسيطاً ثم اقرأ منه خلاصة واحدة دقيقة.',
  'قاعة الحسم تناديك: جرّب سؤالاً جهوياً واحداً مع توقيت قصير.'
];
document.getElementById('newMission').addEventListener('click',()=>{
  document.getElementById('dailyText').textContent=missions[Math.floor(Math.random()*missions.length)];
});
