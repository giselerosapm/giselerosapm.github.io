/* ============================================================
   i18n — o português vive no HTML, o inglês vem de content/en.json
   Uso no markup:
     <h2 data-i18n="home.hero.titulo">Texto em português</h2>
     <p  data-i18n="chave" data-i18n-html>Aceita <em>tags</em> simples</p>
     <a  data-i18n-attr="aria-label:home.nav.contato" ...>
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'gr-lang';
  var dict = null;          // traduções carregadas
  var missing = [];         // chaves sem tradução, avisadas de uma vez
  var current = 'pt';

  // Caminho base do site, derivado do <script src> — funciona na raiz e em /cases/
  function basePath() {
    var s = document.currentScript || document.querySelector('script[src*="i18n.js"]');
    if (!s) return '';
    return s.src.replace(/assets\/js\/i18n\.js.*$/, '');
  }
  var BASE = basePath();

  // Guarda o texto original (PT) na primeira troca
  function snapshot(el, prop) {
    var key = '_pt_' + prop;
    if (el[key] === undefined) el[key] = prop === 'html' ? el.innerHTML : el.textContent;
    return el[key];
  }

  function applyNode(el, lang) {
    var key = el.getAttribute('data-i18n');
    if (!key) return;
    var isHtml = el.hasAttribute('data-i18n-html');
    var prop = isHtml ? 'html' : 'text';
    var pt = snapshot(el, prop);

    if (lang === 'pt') {
      if (isHtml) el.innerHTML = pt; else el.textContent = pt;
      return;
    }
    var val = dict && dict[key];
    if (val === undefined) {
      if (missing.indexOf(key) < 0) missing.push(key);
      return;                       // mantém o português como fallback
    }
    if (isHtml) el.innerHTML = val; else el.textContent = val;
  }

  function applyAttrs(el, lang) {
    var spec = el.getAttribute('data-i18n-attr');
    if (!spec) return;
    spec.split(',').forEach(function (pair) {
      var parts = pair.split(':');
      var attr = (parts[0] || '').trim();
      var key = (parts[1] || '').trim();
      if (!attr || !key) return;
      var store = '_pt_attr_' + attr;
      if (el[store] === undefined) el[store] = el.getAttribute(attr) || '';
      if (lang === 'pt') { el.setAttribute(attr, el[store]); return; }
      var val = dict && dict[key];
      if (val === undefined) { if (missing.indexOf(key) < 0) missing.push(key); return; }
      el.setAttribute(attr, val);
    });
  }

  function render(lang, skipNodes) {
    if (!skipNodes) {
      document.querySelectorAll('[data-i18n]').forEach(function (el) { applyNode(el, lang); });
      document.querySelectorAll('[data-i18n-attr]').forEach(function (el) { applyAttrs(el, lang); });
    }
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      var on = b.dataset.lang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    current = lang;
    if (lang !== 'pt' && missing.length) {
      console.warn('[i18n] ' + missing.length + ' chave(s) sem tradução; ficaram em português:', missing.join(', '));
      missing = [];
    }
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function setLang(lang) {
    if (lang === current && (lang === 'pt' || dict)) { render(lang); return; }
    if (lang === 'pt') { render('pt'); return; }
    if (dict) { render('en'); return; }

    fetch(BASE + 'content/en.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (json) { dict = json; render('en'); })
      .catch(function (err) {
        console.error('[i18n] não consegui carregar en.json —', err.message,
                      '(rodando via file://? use um servidor local)');
      });
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
    // No boot em PT não tocamos no DOM: o português já está no HTML e
    // reescrever textContent apagaria markup interno.
    if (saved === 'en') setLang('en'); else render('pt', true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  window.GRi18n = { set: setLang, get: function () { return current; } };
})();
