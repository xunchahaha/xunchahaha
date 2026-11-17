// 主题切换 + 顶栏吸附描边
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-btn');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // 当前实际生效的是不是深色
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return !!(mq && mq.matches);
  }
  function sync() {
    if (!btn) return;
    btn.setAttribute('aria-label', isDark() ? '切换到浅色模式' : '切换到深色模式');
    btn.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('xuncha-theme', next); } catch (e) {}
      sync();
      document.dispatchEvent(new CustomEvent('themechange'));
    });
  }
  if (mq && mq.addEventListener) mq.addEventListener('change', sync);
  sync();

  // 顶栏滚动后出现底部分隔线
  var bar = document.querySelector('.topbar');
  function onScroll() { if (bar) bar.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
