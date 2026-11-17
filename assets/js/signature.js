// 页首签名：UTF-8 字节先用 ISAAC-64 密钥流加密，滑块控制已经 XOR 回来的字节数
(function () {
  var box = document.getElementById('sig-bytes');
  var range = document.getElementById('sig-range');
  if (!box || !range || !window.Isaac64 || typeof BigInt === 'undefined' || !window.TextEncoder) return;

  var LINES = ['流水不争先', '争的是滔滔不绝'];
  // 种子：「xuncha」六个字母的 ASCII，拼成一个整数 0x78756e636861
  var rng = new Isaac64([BigInt('0x78756e636861')]);
  var enc = new TextEncoder();

  var slots = [];      // 每个字一个槽：{ el, ch, hx, from, plain[], cipher[] }
  var offset = 0;
  var allPlain = [];
  LINES.forEach(function (line) {
    var row = document.createElement('div');
    row.className = 'sig-line';
    Array.from(line).forEach(function (chr) {
      var bytes = Array.from(enc.encode(chr));
      var s = { from: offset, plain: bytes };
      offset += bytes.length;
      allPlain = allPlain.concat(bytes);
      s.el = document.createElement('span');
      s.el.className = 'slot is-locked';
      s.ch = document.createElement('span');
      s.ch.className = 'ch';
      s.ch.textContent = chr;
      s.hx = document.createElement('span');
      s.hx.className = 'hx';
      s.el.appendChild(s.ch);
      s.el.appendChild(s.hx);
      row.appendChild(s.el);
      slots.push(s);
    });
    box.appendChild(row);
  });

  var total = allPlain.length;
  var ks = rng.bytes(total);
  slots.forEach(function (s) {
    s.cipher = s.plain.map(function (b, i) { return b ^ ks[s.from + i]; });
  });
  range.max = String(total);
  box.closest('.sig').classList.add('is-live');

  function hex(b) { return (b < 16 ? '0' : '') + b.toString(16); }

  function render(k) {
    slots.forEach(function (s) {
      var html = '';
      var open = 0;
      s.plain.forEach(function (b, i) {
        var done = s.from + i < k;
        if (done) open++;
        html += '<i' + (done ? '' : ' class="c"') + '>' + hex(done ? b : s.cipher[i]) + '</i>';
      });
      s.hx.innerHTML = html;
      s.el.classList.toggle('is-locked', open < s.plain.length);
    });
    range.style.setProperty('--p', (k / total * 100) + '%');
    range.setAttribute('aria-valuetext', k === total ? '全部解开：流水不争先 争的是滔滔不绝' : '已 XOR ' + k + ' 个字节，共 ' + total + ' 个');
  }

  var timer = 0;
  range.addEventListener('input', function () {
    clearTimeout(timer);
    render(+range.value);
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { if (new URLSearchParams(location.search).get('motion') === 'off') reduce = true; } catch (e) {}

  if (reduce) {
    range.value = String(total);
    render(total);
    return;
  }
  // 页面加载后自动解一遍：这是首屏唯一的「自己动」的地方。每 40ms 多 XOR 一个字节
  range.value = '0';
  render(0);
  function tick() {
    var k = +range.value + 1;
    range.value = String(k);
    render(k);
    if (k < total) timer = setTimeout(tick, 40);
  }
  timer = setTimeout(tick, 600);
})();
