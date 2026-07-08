/* ===== Mobile nav ===== */
function toggleMobileNav(){
  document.getElementById('navMobile').classList.toggle('open');
}

/* ===== Reveal-on-scroll: checked against final layout position on every
   scroll/resize tick, so it never depends on catching an element mid-motion
   (fast flicks or programmatic jumps can skip past IntersectionObserver
   thresholds). ===== */
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
    if (!ticking){ ticking = true; requestAnimationFrame(revealVisible); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  revealVisible();
})();

/* ===== data/site.json: contact CTAs, hours, rating, address ===== */
function loadSiteData(){
  return fetch('data/site.json').then(r => r.ok ? r.json() : null).catch(() => null);
}

function applySiteData(site){
  if (!site) return;

  document.querySelectorAll('[data-field="hours"]').forEach(el => { el.textContent = site.hours.text; });
  document.querySelectorAll('[data-field="prices"]').forEach(el => { el.textContent = site.prices.text; });
  document.querySelectorAll('[data-field="address"]').forEach(el => { el.textContent = site.address.text; });
  document.querySelectorAll('[data-field="rating"]').forEach(el => {
    el.textContent = `${site.rating.value} / 5 — ${site.rating.count} تقييم`;
  });

  const waNumber = (site.contact.whatsapp || '').replace(/\D/g, '');
  const phoneNumber = (site.contact.phone || '').trim();
  if (waNumber) {
    document.querySelectorAll('.js-wa-link').forEach(a => {
      a.href = 'https://wa.me/' + waNumber;
      a.classList.remove('disabled');
      a.removeAttribute('aria-disabled');
      a.querySelectorAll('[data-wa-label]').forEach(s => s.textContent = 'راسلنا واتساب');
    });
    document.querySelectorAll('.float.wa').forEach(el => el.style.display = 'grid');
  }
  if (phoneNumber) {
    document.querySelectorAll('.js-call-link').forEach(a => {
      a.href = 'tel:' + phoneNumber;
      a.classList.remove('disabled');
      a.removeAttribute('aria-disabled');
    });
  }
  document.querySelectorAll('[data-field="contact-note"]').forEach(el => {
    if (waNumber || phoneNumber) { el.style.display = 'none'; return; }
    el.textContent = site.contact.note;
  });
}

/* ===== Editable menu (data/site.json defaults + localStorage overrides) ===== */
let menuEdit = false;
let menuDefaults = [];

function menuData(){
  const stored = JSON.parse(localStorage.getItem('gph-menu') || 'null');
  if (!stored) return menuDefaults;
  return stored.map((x, i) => ({ icon: menuDefaults[i] ? menuDefaults[i].icon : '🍽️', ...x }));
}
function renderMenu(){
  const list = document.getElementById('menuList');
  if (!list) return;
  const menu = menuData();
  list.innerHTML = menu.map((x, i) => `
    <article class="menu-item">
      <div class="thumb">${x.icon || '🍽️'}</div>
      <div>
        <h4 contenteditable="${menuEdit}" data-i="${i}" data-k="n">${x.n}</h4>
        <p contenteditable="${menuEdit}" data-i="${i}" data-k="d">${x.d}</p>
      </div>
      <div class="price" contenteditable="${menuEdit}" data-i="${i}" data-k="p">${x.p}</div>
    </article>`).join('');
}
function toggleMenuEdit(){
  menuEdit = !menuEdit;
  document.getElementById('menuBox').classList.toggle('edit', menuEdit);
  renderMenu();
}
function saveMenu(){
  const d = menuData();
  document.querySelectorAll('[data-i]').forEach(e => { d[+e.dataset.i][e.dataset.k] = e.innerText.trim(); });
  localStorage.setItem('gph-menu', JSON.stringify(d));
  menuEdit = false;
  document.getElementById('menuBox').classList.remove('edit');
  renderMenu();
  alert('تم حفظ القائمة داخل هذا المتصفح.');
}
function resetMenu(){
  localStorage.removeItem('gph-menu');
  menuEdit = false;
  document.getElementById('menuBox').classList.remove('edit');
  renderMenu();
}

/* ===== Lightbox gallery ===== */
let lbImages = [];
let lbIndex = 0;
function openLightbox(index){
  lbIndex = index;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  updateLightbox();
  lb.classList.add('open');
}
function updateLightbox(){
  const item = lbImages[lbIndex];
  if (!item) return;
  document.getElementById('lbImg').src = item.src;
  document.getElementById('lbImg').alt = item.alt;
  document.getElementById('lbCaption').textContent = item.caption;
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
}
function lbStep(dir){
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  updateLightbox();
}
function initGallery(){
  const tiles = document.querySelectorAll('.tile[data-full]');
  if (!tiles.length) return;
  lbImages = Array.from(tiles).map(t => ({
    src: t.dataset.full,
    alt: t.querySelector('img') ? t.querySelector('img').alt : '',
    caption: t.dataset.caption || ''
  }));
  tiles.forEach((t, i) => t.addEventListener('click', () => openLightbox(i)));
  document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')?.addEventListener('click', () => lbStep(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => lbStep(1));
  document.getElementById('lightbox')?.addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
  });
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  loadSiteData().then(site => {
    if (site && site.menu) menuDefaults = site.menu;
    renderMenu();
    applySiteData(site);
  });
});
