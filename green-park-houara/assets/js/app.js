
function applyDir(isFr){
  document.body.classList.toggle('fr-mode', isFr);
  document.documentElement.setAttribute('lang', isFr ? 'fr' : 'ar');
  document.documentElement.setAttribute('dir', isFr ? 'ltr' : 'rtl');
}
function toggleLang(){
  const isFr = !document.body.classList.contains('fr-mode');
  applyDir(isFr);
  localStorage.setItem('gph-lang', isFr ? 'fr' : 'ar');
}
applyDir(localStorage.getItem('gph-lang') === 'fr');

function toggleMobileNav(){
  document.getElementById('navMobile').classList.toggle('open');
}

const defaults = [
  {n:'Café Signature', d:'قهوة مختارة لوقفة Green Park', p:'-- DH', icon:'☕'},
  {n:'Thé Marocain', d:'شاي مغربي للجلسات الهادئة', p:'-- DH', icon:'🫖'},
  {n:'Jus Frais', d:'عصائر موسمية منعشة', p:'-- DH', icon:'🥤'},
  {n:'Pâtisserie', d:'حلويات خفيفة مع القهوة', p:'-- DH', icon:'🍰'},
  {n:'Formule Piscine', d:'اقتراح خاص بالمسبح والاستراحة', p:'-- DH', icon:'🏊'},
  {n:'Anniversaire / Mariage', d:'صيغة مناسبة للحفلات والمناسبات', p:'Sur devis', icon:'🎉'}
];

let edit = false;
function data(){
  const stored = JSON.parse(localStorage.getItem('gph-menu') || 'null');
  if (!stored) return defaults;
  return stored.map((x,i)=>({icon: defaults[i] ? defaults[i].icon : '🍽️', ...x}));
}
function render(){
  const menu = data();
  document.getElementById('menuList').innerHTML = menu.map((x,i)=>`
    <article class="menu-item">
      <div class="thumb">${x.icon || '🍽️'}</div>
      <div>
        <h4 contenteditable="${edit}" data-i="${i}" data-k="n">${x.n}</h4>
        <p contenteditable="${edit}" data-i="${i}" data-k="d">${x.d}</p>
      </div>
      <div class="price" contenteditable="${edit}" data-i="${i}" data-k="p">${x.p}</div>
    </article>`).join('');
}
function toggleEdit(){
  edit = !edit;
  document.getElementById('menuBox').classList.toggle('edit', edit);
  render();
}
function saveMenu(){
  const d = data();
  document.querySelectorAll('[data-i]').forEach(e=>{
    d[+e.dataset.i][e.dataset.k] = e.innerText.trim();
  });
  localStorage.setItem('gph-menu', JSON.stringify(d));
  edit = false;
  document.getElementById('menuBox').classList.remove('edit');
  render();
  alert('تم حفظ القائمة داخل المتصفح.');
}
function resetMenu(){
  localStorage.removeItem('gph-menu');
  edit = false;
  document.getElementById('menuBox').classList.remove('edit');
  render();
}
render();

/* Reveal-on-scroll: checked against final layout position on every scroll/resize
   tick, so it never depends on catching an element mid-motion (fast flicks or
   programmatic jumps can skip past IntersectionObserver thresholds). */
(function(){
  let items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;
  let ticking = false;
  function revealVisible(){
    const vh = window.innerHeight;
    items = items.filter(el=>{
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0){
        el.classList.add('in');
        return false;
      }
      return true;
    });
    ticking = false;
    if (!items.length){
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }
  function onScroll(){
    if (!ticking){
      ticking = true;
      requestAnimationFrame(revealVisible);
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  revealVisible();
})();

/* Practical info + WhatsApp/call CTA driven by data/site.json */
(function(){
  fetch('data/site.json').then(r => r.ok ? r.json() : null).then(site=>{
    if (!site) return;

    const hours = document.querySelectorAll('[data-field="hours"]');
    hours.forEach(el=>{
      el.querySelector('.ar').textContent = site.hours.text.ar;
      el.querySelector('.fr').textContent = site.hours.text.fr;
    });
    const prices = document.querySelectorAll('[data-field="prices"]');
    prices.forEach(el=>{
      el.querySelector('.ar').textContent = site.prices.text.ar;
      el.querySelector('.fr').textContent = site.prices.text.fr;
    });

    const waNumber = (site.contact && site.contact.whatsapp || '').replace(/\D/g,'');
    const phoneNumber = (site.contact && site.contact.phone || '').trim();
    if (waNumber){
      document.querySelectorAll('.js-wa-link').forEach(a=>{
        a.href = 'https://wa.me/' + waNumber;
        a.classList.remove('disabled');
        a.removeAttribute('aria-disabled');
      });
      const floatWa = document.getElementById('floatWa');
      if (floatWa) floatWa.style.display = 'grid';
    }
    if (phoneNumber){
      document.querySelectorAll('.js-call-link').forEach(a=>{
        a.href = 'tel:' + phoneNumber;
      });
    }
    document.querySelectorAll('[data-field="contact-note"]').forEach(el=>{
      if (waNumber || phoneNumber){ el.style.display = 'none'; return; }
      el.querySelector('.ar').textContent = site.contact.note.ar;
      el.querySelector('.fr').textContent = site.contact.note.fr;
    });
  }).catch(()=>{ /* site.json optional; page still works without it */ });
})();
