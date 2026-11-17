// 联系方式旁边的复制按钮：复制的内容和页面上显示的一致
(function () {
  var status = document.getElementById('copy-status');
  var original = status ? status.textContent : '';
  var timer = null;

  // 优先用 Clipboard API，不行就退回到 execCommand
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  document.querySelectorAll('.copy[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      copyText(text).then(function () {
        b.classList.add('is-done');
        if (status) status.textContent = '已复制 ' + text;
      }, function () {
        if (status) status.textContent = '复制失败，请手动选中 ' + text;
      });
      clearTimeout(timer);
      timer = setTimeout(function () {
        document.querySelectorAll('.copy.is-done').forEach(function (x) { x.classList.remove('is-done'); });
        if (status) status.textContent = original;
      }, 2000);
    });
  });
})();
