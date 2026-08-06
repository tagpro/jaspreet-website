/* jaspreet.info — progressive enhancement only.
   Without this file the page is fully readable: every role card ships open
   and every trace span is a plain anchor to its card. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- theme ---------- */
  // The pre-paint script in <head> has already set data-theme. Here we only
  // wire the control and keep following the OS while the reader has no
  // explicit preference of their own.
  var toggle = document.getElementById('theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function stored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function paintToggle() {
    if (!toggle) return;
    var goingTo = root.dataset.theme === 'dark' ? 'light' : 'dark';
    toggle.textContent = goingTo + ' mode';
    toggle.setAttribute('aria-label', 'Switch to ' + goingTo + ' theme');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* private mode */ }
      paintToggle();
    });
    paintToggle();
  }

  systemDark.addEventListener('change', function (event) {
    if (stored('theme')) return; // reader chose; don't override them
    root.dataset.theme = event.matches ? 'dark' : 'light';
    paintToggle();
  });

  /* ---------- the trace ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('details.role'));

  // Cards ship open so the no-JS page is complete. With JS they collapse to an
  // index: the addressed role if there is one, otherwise the most recent.
  var landed = cards.filter(function (card) { return '#' + card.id === location.hash; })[0];
  var initial = landed || cards[0];
  cards.forEach(function (card) { if (card !== initial) card.removeAttribute('open'); });

  function select(id) {
    document.querySelectorAll('a.t-row[aria-current]').forEach(function (row) {
      row.removeAttribute('aria-current');
    });
    var row = document.querySelector('a.t-row[href="#' + id + '"]');
    if (row) row.setAttribute('aria-current', 'true');
  }

  document.querySelectorAll('a.t-row').forEach(function (row) {
    row.addEventListener('click', function (event) {
      var id = row.getAttribute('href').slice(1);
      var card = document.getElementById(id);
      if (!card || card.tagName !== 'DETAILS') return; // ANU -> #education navigates natively
      event.preventDefault();
      card.open = true;
      select(id);
      card.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
      var summary = card.querySelector('summary');
      if (summary) summary.focus({ preventScroll: true });
      history.replaceState(null, '', '#' + id);
    });
  });

  cards.forEach(function (card) {
    card.addEventListener('toggle', function () {
      if (card.open) select(card.id);
    });
  });

  if (initial) { initial.open = true; select(initial.id); }

  /* ---------- print ---------- */
  // Collapsed <details> print as headings only, which would silently drop most
  // of the CV. Open everything for the print job, then restore.
  var reopen = [];
  window.addEventListener('beforeprint', function () {
    reopen = cards.filter(function (card) { return !card.open; });
    reopen.forEach(function (card) { card.open = true; });
  });
  window.addEventListener('afterprint', function () {
    reopen.forEach(function (card) { card.open = false; });
    reopen = [];
  });
})();
