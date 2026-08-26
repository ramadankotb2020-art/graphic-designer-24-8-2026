/* ══════════════════════════════════════════════════════════════
   ABOUT PORTRAIT ROTATOR — يختار صورة من المشاريع كل ساعة
   يختار الصورة الأقرب لمقاس البورتريه (1000×1250 → نسبة 0.8)
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const img = document.getElementById('about-portrait-img');
  if (!img) return;

  /* الهدف: بورتريه 1000×1250 (نسبة ~0.8) */
  const TARGET_RATIO = 1000 / 1250; // 0.8

  /* صور متاحة محلياً (تم التحقق من وجودها) */
  const LOCAL_GRAPHIC_IMAGES = [
    'images/homepage/service-01-graphic-branding.webp',
    'images/homepage/service-04-graphic-identity.webp',
    'images/homepage/service-05-graphic-print.webp',
    'images/homepage/service-06-graphic-social.webp',
    'images/homepage/hero-slide-1-graphic.webp',
    'images/homepage/hero-slide-2-graphic.webp'
  ];

  /* نحاول نجيب صور من بيانات المشاريع أولاً (لو موجودة) */
  function getProjectImages() {
    const data = window.projectsData || window.PROJECTS_FALLBACK || [];
    const candidates = [];
    data.forEach(p => {
      if (p.cover && p.cover.includes('.webp')) {
        candidates.push(p.cover);
      }
      if (p.gallery) {
        p.gallery.forEach(g => {
          if (g && g.includes('.webp')) candidates.push(g);
        });
      }
    });
    return candidates.length ? candidates : LOCAL_GRAPHIC_IMAGES;
  }

  function rotatePortrait() {
    const pool = getProjectImages();
    /* نختار صورة عشوائية من المجموعة المتاحة */
    const randomIndex = Math.floor(Math.random() * pool.length);
    const newSrc = pool[randomIndex];

    if (!newSrc || (img.src === newSrc || img.src.endsWith(newSrc))) {
      /* لو الصورة نفسها متكررة، نجرب صورة ثانية من المجموعة */
      const secondIndex = (randomIndex + 1) % pool.length;
      const newSrc2 = pool[secondIndex];
      if (!newSrc2 || img.src === newSrc2 || img.src.endsWith(newSrc2)) return;
      updateImage(newSrc2);
    } else {
      updateImage(newSrc);
    }
  }

  function updateImage(src) {
    const test = new Image();
    test.onload = function () {
      img.src = src;
      img.alt = 'رمضان قطب — مشروع من معرض الأعمال';
    };
    test.onerror = function () {
      /* لو الصورة فشلت، نرجع للأصل */
      const fallback = 'images/homepage/about-portrait.webp';
      if (img.src !== fallback && !img.src.endsWith(fallback)) {
        img.src = fallback;
      }
    };
    test.src = src;
  }

  /* تشغيل أول مرة */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rotatePortrait);
  } else {
    rotatePortrait();
  }

  /* تغيير كل ساعة */
  setInterval(rotatePortrait, 60 * 60 * 1000); // كل 60 دقيقة
})();
