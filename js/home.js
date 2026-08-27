/* home.js — hero engine للموقع الجرافيك */
/* السلايدر في index.html مدمج مباشرة — الملف ده بيشتغل بس لو في .hero-media-wrap */
(function(){
  'use strict';
  var heroEl = document.querySelector('.hero-media-wrap');
  if (!heroEl) return; /* index.html الجديد مش عنده hero-media-wrap */
  
  var SLIDES = window.HERO_SLIDES || [];
  if (!SLIDES.length) return;
  
  var cur = 0, timer;
  SLIDES.forEach(function(s){
    var el = document.createElement('div');
    el.className = 'hero-slide' + (SLIDES.indexOf(s) === 0 ? ' active' : '');
    el.style.cssText = 'position:absolute;inset:0;background-size:cover;background-position:center;opacity:' + (SLIDES.indexOf(s) === 0 ? '1' : '0') + ';transition:opacity 1.2s ease';
    if (s.image) el.style.backgroundImage = "url('" + s.image + "')";
    heroEl.insertBefore(el, heroEl.querySelector('.hero-media-overlay'));
  });
})();
