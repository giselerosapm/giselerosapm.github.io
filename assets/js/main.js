/* ============================================================
   main.js — utilidades gerais
   ============================================================ */
(function () {
  'use strict';

  function boot() {
    // Ano no rodapé
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // Marca o item de navegação da página atual
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header__nav a[href]').forEach(function (a) {
      var target = a.getAttribute('href').split('/').pop().split('#')[0];
      if (target && target === here) a.setAttribute('aria-current', 'page');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
