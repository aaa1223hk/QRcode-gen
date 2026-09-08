/**
 * 共用左側選單 (drawer) — QR / 方印工房 適配版
 * 支援 data-theme（QR）與 body.dark-theme（寶可夢）
 */
(function () {
  'use strict';

  function openDrawer() {
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawer-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openDrawer = openDrawer;
  window.closeDrawer = closeDrawer;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  var THEME_KEY_QR = 'qr-theme';
  var THEME_KEY_POKE = 'pokemon-calc-theme';

  function getCurrentTheme() {
    var dt = document.documentElement.getAttribute('data-theme');
    if (dt === 'dark' || dt === 'light') return dt;
    if (document.body.classList.contains('dark-theme')) return 'dark';
    return 'light';
  }

  function applyTheme(theme) {
    var dark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', dark);
    try {
      localStorage.setItem(THEME_KEY_QR, dark ? 'dark' : 'light');
      localStorage.setItem(THEME_KEY_POKE, dark ? 'dark' : 'light');
    } catch (e) {}

    // drawer 內按鈕
    var btn = document.getElementById('theme-toggle-drawer');
    if (btn) {
      var icon = btn.querySelector('.theme-toggle-icon');
      var text = btn.querySelector('.theme-toggle-text');
      if (icon) icon.textContent = dark ? '☀️' : '🌙';
      if (text) text.textContent = dark ? '淺色模式' : '深色模式';
      btn.setAttribute('aria-label', dark ? '切換淺色模式' : '切換深色模式');
      btn.title = dark ? '切換淺色模式' : '切換深色模式';
    }
    // 同步右上角 theme-btn 圖示（不重新綁定事件，避免 double toggle）
    var topBtn = document.querySelector('.theme-btn');
    if (topBtn) topBtn.textContent = dark ? '☀️' : '🌙';
  }

  // 初始化
  var saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY_QR) || localStorage.getItem(THEME_KEY_POKE);
  } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    applyTheme(getCurrentTheme());
  }

  // 只綁 drawer 內的主題按鈕
  var drawerThemeBtn = document.getElementById('theme-toggle-drawer');
  if (drawerThemeBtn) {
    drawerThemeBtn.addEventListener('click', function () {
      applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  // 標記目前頁面 active（僅相對路徑）
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.drawer-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (!href || href.startsWith('http')) return;
    if (href === path || (path === '' && href.indexOf('index') !== -1)) {
      a.classList.add('active');
    }
  });
})();
