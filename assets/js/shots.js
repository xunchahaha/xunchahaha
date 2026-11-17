// 截图：正文里只放原尺寸局部，点开用 <dialog> 看整张（按原比例，不裁剪）
(function () {
  var dlg = document.getElementById('viewer');
  var img = document.getElementById('viewer-img');
  var title = document.getElementById('viewer-title');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var NAMES = { wuuud: 'wuuud 聊天记录界面（演示数据）', alpha: 'Alpha 聊天界面（演示数据）' };
  var opener = null;

  document.querySelectorAll('.shot-crop').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // 取当前主题下正在显示的那张图
      var shown = Array.prototype.find.call(btn.querySelectorAll('img'), function (i) { return i.offsetParent !== null; });
      if (!shown) return;
      opener = btn;
      img.src = shown.currentSrc || shown.src;
      img.alt = NAMES[btn.getAttribute('data-full')] || '';
      img.className = shown.classList.contains('shot-dim') ? 'shot-dim' : '';
      title.textContent = NAMES[btn.getAttribute('data-full')] || '';
      dlg.showModal();
    });
  });
  // 点遮罩关闭
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { if (opener) opener.focus(); });
})();
