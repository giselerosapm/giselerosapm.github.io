/* ============================================================
   reveal.js — revelação no scroll, barra de progresso,
   contador de slide e inversão do header sobre seção escura
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Revelação ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 4) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- 2. Progresso ---------- */
  function initProgress() {
    var bar = document.querySelector('.progress__bar');
    if (!bar) return;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = Math.max(0, Math.min(100, p)) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 3. Contador de slide ---------- */
  function initSlideIndex() {
    var box = document.querySelector('.slide-index');
    if (!box) return;
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
    if (!slides.length) { box.remove(); return; }
    var total = slides.length;
    var pad = function (n) { return String(n).padStart(2, '0'); };

    function update() {
      var mid = window.scrollY + window.innerHeight * 0.4;
      var idx = 0;
      for (var i = 0; i < total; i++) {
        if (slides[i].offsetTop <= mid) idx = i;
      }
      box.innerHTML = '<b>' + pad(idx + 1) + '</b> / ' + pad(total);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 4. Header e contador sobre seção escura ---------- */
  function initTheming() {
    var header = document.querySelector('.header');
    var index = document.querySelector('.slide-index');
    if (!header) return;
    var darks = Array.prototype.slice.call(document.querySelectorAll('.section--dark, .footer'));

    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 24);

      var probe = window.scrollY + header.offsetHeight * 0.6;
      var overHeader = darks.some(function (s) {
        var top = s.offsetTop, bot = top + s.offsetHeight;
        return probe >= top && probe < bot;
      });
      header.classList.toggle('is-over-dark', overHeader);

      if (index) {
        var probe2 = window.scrollY + window.innerHeight - 40;
        var overIndex = darks.some(function (s) {
          var top = s.offsetTop, bot = top + s.offsetHeight;
          return probe2 >= top && probe2 < bot;
        });
        index.classList.toggle('is-over-dark', overIndex);
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function boot() {
    initReveal();
    initProgress();
    initSlideIndex();
    initTheming();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
