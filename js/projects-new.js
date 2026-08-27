'use strict';

/* ── fallback ── */
if (typeof projectsData === 'undefined' && typeof PROJECTS_FALLBACK !== 'undefined') {
  window.projectsData = PROJECTS_FALLBACK;
} else if (typeof projectsData !== 'undefined') {
  window.projectsData = projectsData;
}

/* ── render projects ── */
function renderProjects(filter, containerAttr) {
  const container = document.querySelector(containerAttr);
  if (!container) return;

  const discipline = container.getAttribute('data-work-grid');
  let filtered = window.projectsData || [];

  if (discipline) {
    filtered = filtered.filter(p => p.discipline === discipline);
  }

  if (filter && filter !== 'all') {
    filtered = filtered.filter(p =>
      (p.category || '').toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (!filtered.length) {
    container.innerHTML = '<p style="color:rgba(255,255,255,.35);text-align:center;padding:64px 0;font-size:15px;grid-column:1/-1;">لا توجد مشاريع في هذا التصنيف حتى الآن.</p>';
    return;
  }

  container.innerHTML = filtered.map((p, i) => {
    const imgHTML = p.cover
      ? `<img src="${p.cover}" alt="${p.title}" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async">`
      : `<div style="width:100%;height:100%;background:#1a1a1a;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.2);font-size:32px;">🎨</div>`;

    return `
    <a href="project.html?id=${encodeURIComponent(p.id)}"
       class="proj-card reveal"
       style="animation-delay:${(i % 6) * 60}ms">
      <div class="proj-media">
        ${imgHTML}
        ${p.category ? `<span class="proj-badge">${p.category}</span>` : ''}
        <span class="proj-cta">عرض المشروع ←</span>
      </div>
      <div class="proj-info">
        ${p.category ? `<p>${p.category}</p>` : ''}
        <h3>${p.title}</h3>
      </div>
    </a>`;
  }).join('');

  /* re-trigger reveal */
  requestAnimationFrame(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    container.querySelectorAll('.reveal:not(.vis)').forEach(el => obs.observe(el));
  });

  document.dispatchEvent(new CustomEvent('rk:projects-rendered', { bubbles: true }));
}

/* ── filter bar ── */
function buildFilterBar() {
  document.querySelectorAll('[data-filter-bar]').forEach(bar => {
    /* find the closest grid */
    const grid = bar.closest('section, div')?.querySelector('[data-work-grid]')
               || document.querySelector('[data-work-grid]');
    const disc = grid?.getAttribute('data-work-grid');

    const projects = (window.projectsData || []).filter(p => disc ? p.discipline === disc : true);
    const cats = [...new Set(projects.map(p => p.category).filter(Boolean))];
    const items = ['الكل', ...cats];

    bar.innerHTML = items.map((item, i) => `
      <button class="${i === 0 ? 'on' : ''}" data-filter="${i === 0 ? 'all' : item}">
        ${item}
      </button>
    `).join('');

    bar.addEventListener('click', e => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      bar.querySelectorAll('button').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const val = btn.getAttribute('data-filter');
      const attr = disc ? `[data-work-grid="${disc}"]` : '[data-work-grid]';
      renderProjects(val === 'all' ? null : val, attr);
    });
  });
}

/* ── init ── */
renderProjects(null, '[data-work-grid="graphic"]');
buildFilterBar();

/* ── project detail page ── */
(function renderProjectDetail() {
  const page = document.querySelector('[data-project-page]');
  if (!page) return;
  const id = new URLSearchParams(window.location.search).get('id');
  const project = (window.projectsData || []).find(p => String(p.id) === String(id));
  if (!project) return;
  document.title = `${project.title} — رمضان قطب | RK Graphic Studio`;
  const set = (sel, val, html) => { const el = page.querySelector(sel); if (el) html ? el.innerHTML = val : el.textContent = val; };
  set('[data-p-eyebrow]', project.category || 'جرافيك');
  set('[data-p-title]', project.title || '');
  set('[data-p-desc]', project.description || '');
  const metaEl = page.querySelector('[data-p-meta]');
  if (metaEl) {
    const items = [['التصنيف', project.category], ['الموقع', project.location], ['السنة', project.year]].filter(([, v]) => v);
    metaEl.innerHTML = items.map(([l, v]) => `<div><div style="color:var(--gold);font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">${l}</div><div style="color:#fff;font-weight:700;font-size:16px">${v}</div></div>`).join('');
  }
  const coverEl = page.querySelector('[data-p-cover]');
  if (coverEl && project.cover) coverEl.innerHTML = `<img src="${project.cover}" alt="${project.title}" style="width:100%;display:block;max-height:70vh;object-fit:cover;border-radius:12px">`;
  set('[data-p-idea]', project.idea || project.description || '', false);
  const galleryEl = page.querySelector('[data-p-gallery]');
  if (galleryEl && project.gallery?.length) {
    galleryEl.style.cssText = 'columns:2;column-gap:14px;';
    galleryEl.innerHTML = project.gallery.map((src, i) => `
      <div style="break-inside:avoid;margin-bottom:14px;overflow:hidden;border-radius:10px;border:1px solid rgba(197,160,89,.15);cursor:zoom-in" onclick="__lb(${i})">
        <img src="${src}" alt="${project.title} ${i+1}" loading="${i<4?'eager':'lazy'}" style="width:100%;height:auto;display:block;transition:transform .5s" onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'">
      </div>`).join('');
    const imgs = project.gallery;
    let lbI = 0;
    window.__lb = i => {
      lbI = i;
      let lb = document.getElementById('__lb');
      if (!lb) {
        lb = document.createElement('div');
        lb.id = '__lb';
        lb.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.97);align-items:center;justify-content:center;flex-direction:column;gap:16px';
        lb.innerHTML = `<img id="__lbimg" style="max-width:92vw;max-height:85vh;object-fit:contain;border-radius:8px"><div id="__lbc" style="color:rgba(255,255,255,.4);font-size:13px"></div>`;
        lb.onclick = e => { if (e.target===lb){ lb.style.display='none'; document.body.style.overflow=''; } };
        document.body.appendChild(lb);
        document.addEventListener('keydown', e => { if (!lb || lb.style.display==='none') return; if (e.key==='Escape'){lb.style.display='none';document.body.style.overflow='';} if (e.key==='ArrowRight') nav(-1); if (e.key==='ArrowLeft') nav(1); });
      }
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      document.getElementById('__lbimg').src = imgs[lbI];
      document.getElementById('__lbc').textContent = `${lbI+1} / ${imgs.length}`;
    };
    const nav = d => { lbI = (lbI+d+imgs.length)%imgs.length; document.getElementById('__lbimg').src = imgs[lbI]; document.getElementById('__lbc').textContent = `${lbI+1} / ${imgs.length}`; };
  }
})();
