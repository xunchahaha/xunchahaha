// 图片兜底：先试 data-alt-src（jsdelivr 备用地址），再不行：
//   截图位显示一句说明；头像换成「寻」字圆片；项目图标直接去掉（不放字母占位方块）
(function () {
  function fallback(img) {
    var alt = img.getAttribute('data-alt-src');
    if (alt && img.getAttribute('src') !== alt) {
      img.setAttribute('src', alt);
      return;
    }
    var text = img.getAttribute('data-fallback') || '';
    var shot = img.closest('.shot');
    if (shot) {
      shot.remove();
    } else if (img.classList.contains('ava')) {
      var a = document.createElement('span');
      a.className = 'ava';
      a.setAttribute('aria-hidden', 'true');
      a.textContent = text;
      img.replaceWith(a);
    } else {
      img.remove();
    }
  }
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () { fallback(img); });
    // 脚本执行前就已经失败的图片
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('loading') !== 'lazy') fallback(img);
  });
})();
