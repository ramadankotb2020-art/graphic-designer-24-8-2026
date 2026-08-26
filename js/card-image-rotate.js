/* ══════════════════════════════════════════════════════════════
   CARD IMAGE ROTATOR — أنيميشن جميل + كل دقيقتين
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* كل كارت يتغير لوحده كل دقيقتين — خفيف على الجهاز */
  function rotateCards() {
    document.querySelectorAll('.project-card .project-img[data-images]').forEach((img, index) => {
      const raw = img.getAttribute('data-images');
      if (!raw) return;
      const images = raw.split(',').filter(Boolean);
      if (images.length < 2) return;

      const current = img.src;
      let next = images.find(s => !current.endsWith(s) && s !== current);
      if (!next) next = images[(images.indexOf(images.find(s => current.endsWith(s) || s === current)) + 1) % images.length] || images[0];
      if (!next || next === current) return;

      /* أنيميشن جميل: fade + scale خفيف */
      img.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      img.style.opacity = '0.3';
      img.style.transform = 'scale(0.97)';

      setTimeout(() => {
        img.src = next;
        img.alt = img.alt || 'مشروع من معرض الأعمال';
        img.style.transform = 'scale(1.03)';
        img.style.opacity = '0.8';
        setTimeout(() => {
          img.style.transform = 'scale(1)';
          img.style.opacity = '1';
        }, 250);
      }, 500);
    });
  }

  /* كل دقيقتين (120 ثانية) — العميل مش بيفضل كتير */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      rotateCards();
      setInterval(rotateCards, 120000); // 2 دقائق
    });
  } else {
    rotateCards();
    setInterval(rotateCards, 120000); // 2 دقائق
  }

  document.addEventListener('rk:projects-rendered', () => {
    rotateCards();
  });
})();
