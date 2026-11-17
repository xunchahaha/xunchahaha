// 首屏贡献图：按周聚合的柱子（手机上也能一屏放下全年）
// 数据来自 assets/data/contributions.json，格式 {total, days:[["YYYY-MM-DD", n], ...]}，第一天是周日
// 编码：柱高 = 这一周的贡献数；琥珀色那一截 = 全年最忙的一天在这一周里占的部分；
//       版本标在横轴上（和月份同一行），不画穿过柱子的竖线；最长连续区间用柱子上方的括线表示
(function () {
  var SVGNS = 'http://www.w3.org/2000/svg';
  var plot = document.getElementById('graph-plot');
  var svg = document.getElementById('graph-svg');
  var tagsBox = document.getElementById('graph-tags');
  var read = document.getElementById('graph-read');
  var graph = document.getElementById('graph');
  if (!plot || !svg) return;

  var TAGS = [
    { v: 'v2025.12', d: '2025-12-01', href: '#v2025-12' },
    { v: 'v2026.03', d: '2026-03-01', href: '#v2026-03' },
    { v: 'v2026.04', d: '2026-04-01', href: '#v2026-04' },
    { v: 'v2026.08', d: '2026-08-01', href: '#v2026-08' },
    { v: 'v2026.10', d: '2026-10-01', href: '#v2026-10' },
    { v: 'v2026.11', d: '2026-11-01', href: '#v2026-11' }
  ];
  var STREAK = ['2026-10-04', '2026-10-25'];
  var WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var MONTH_ROW = 26;   // 横轴下面留给月份和版本的高度

  // 柱子不做入场动画：首屏唯一的动作留给签名解密

  var days = [], index = {}, weeks = [], wmax = 1, peakDay = null;
  var step = 1, active = -1, drawnOnce = false;
  var defaultText = read ? read.innerHTML : '';

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmt(n) { return n.toLocaleString('en-US'); }
  function cn(d, withYear) {
    var p = d.split('-');
    return (withYear ? p[0] + ' 年 ' : '') + (+p[1]) + ' 月 ' + (+p[2]) + ' 日';
  }
  // 某一天在横轴上的位置（连续值，单位 px）
  function dayX(i) { return (i + 0.5) / 7 * step; }

  function draw() {
    var W = plot.clientWidth;
    var H = plot.clientHeight;
    if (!W || !weeks.length) return;
    var narrow = W < 640;
    var base = H - MONTH_ROW;
    var top = 32;                       // 上方留给「连续 22 天」括线
    var range = base - top;
    step = W / weeks.length;
    var bw = Math.max(3, step * (narrow ? 0.7 : 0.62));
    function y(v) { return base - v / wmax * range; }

    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var s0 = index[STREAK[0]], s1 = index[STREAK[1]];

    // 柱子
    var g = el('g', {}, svg);
    weeks.forEach(function (w, wi) {
      var x = wi * step + (step - bw) / 2;
      if (!w.total) {
        el('rect', { class: 'b0', x: x, y: base - 1.5, width: bw, height: 1.5 }, g);
        return;
      }
      var h = Math.max(2, base - y(w.total));
      var r = el('rect', { class: 'b', x: x, y: base - h, width: bw, height: h, rx: Math.min(1.5, bw / 2) }, g);
      r.setAttribute('data-w', wi);
      if (s0 != null && w.end >= s0 && w.start <= s1) r.classList.add('in-streak');
      // 全年最忙的一天：在它所在那一周的柱子底部画出它占的那一截
      if (peakDay && peakDay.week === wi) {
        var ph = base - y(peakDay.count);
        var pr = el('rect', { class: 'peak-seg', x: x, y: base - ph, width: bw, height: ph, rx: Math.min(1.5, bw / 2) }, g);
        // 标注放在柱子左上方的空白里，和琥珀色那一截同色
        var ly = Math.max(top + 30, base - h + 8);
        var lx = x - 6;
        var t1 = el('text', { class: 'peak-l', x: lx - 2, y: ly, 'text-anchor': 'end' }, svg);
        t1.textContent = String(peakDay.count);
        var t2 = el('text', { class: 'peak-l2', x: lx - 2, y: ly + 16, 'text-anchor': 'end' }, svg);
        t2.textContent = cn(peakDay.date);
      }
    });

    el('line', { class: 'axis', x1: 0, x2: W, y1: base + .5, y2: base + .5 }, svg);

    // 月份：有版本的月份交给下面的版本标签，宽屏才画其它月份
    var tagDays = {};
    TAGS.forEach(function (t) { tagDays[t.d] = true; });
    days.forEach(function (d, i) {
      if (d[0].slice(8) !== '01' || tagDays[d[0]]) return;
      if (narrow) return;    // 窄屏只留版本标签，避免和月份挤在一起
      var m = +d[0].slice(5, 7);
      var t = el('text', { class: 'mon', x: dayX(i), y: base + 18, 'text-anchor': 'middle' }, svg);
      t.textContent = m === 1 ? d[0].slice(0, 4) : m + ' 月';
    });

    // 最长连续区间：柱子上方一条括线
    if (s0 != null && s1 != null) {
      var bx1 = s0 / 7 * step, bx2 = (s1 + 1) / 7 * step, by = top - 10;
      el('path', { class: 'streak-br', d: 'M' + bx1 + ' ' + (by + 5) + 'V' + by + 'H' + bx2 + 'V' + (by + 5) }, svg);
      var cx = Math.min(Math.max((bx1 + bx2) / 2, 36), W - 36);
      var sl = el('text', { class: 'streak-l', x: cx, y: by - 6, 'text-anchor': 'middle' }, svg);
      sl.textContent = '连续 22 天';
    }

    placeTags(W, base);
    drawnOnce = true;
    if (active >= 0) highlight(active);
  }

  // 版本标签：横轴下方，宽屏一行；窄屏放不下时错到第二行
  function placeTags(W, base) {
    tagsBox.innerHTML = '';
    tagsBox.style.top = (base + 4) + 'px';
    var rows = [[], []];
    var ROW_TOP = [2, 20];
    var used = 0;
    TAGS.forEach(function (t) {
      var i = index[t.d];
      if (i == null) return;
      var x = dayX(i);
      var a = document.createElement('a');
      a.className = 'graph-tag';
      a.href = t.href;
      a.textContent = t.v;
      a.setAttribute('aria-label', t.v + ' 的更新说明');
      tagsBox.appendChild(a);
      var w = a.offsetWidth;
      var left = Math.min(Math.max(x, w / 2), W - w / 2);
      function hits(r) { return rows[r].some(function (p) { return left - w / 2 < p[1] + 8 && left + w / 2 > p[0] - 8; }); }
      var row = hits(0) ? 1 : 0;
      rows[row].push([left - w / 2, left + w / 2]);
      used = Math.max(used, row);
      a.style.left = left + 'px';
      a.style.top = ROW_TOP[row] + 'px';
      a.style.setProperty('--stem', (ROW_TOP[row] + 2) + 'px');
      a.style.setProperty('--dx', (x - left) + 'px');
    });
    graph.style.paddingBottom = used ? '20px' : '0px';
  }

  function highlight(wi) {
    var prev = svg.querySelector('.b.on');
    if (prev) prev.classList.remove('on');
    var bar = svg.querySelector('.b[data-w="' + wi + '"]');
    if (bar) bar.classList.add('on');
  }

  function show(wi) {
    if (wi < 0 || wi >= weeks.length) return;
    active = wi;
    highlight(wi);
    var w = weeks[wi];
    var a = days[w.start][0], b = days[w.end][0];
    var cross = a.slice(0, 4) !== b.slice(0, 4);
    var range = cn(a, cross) + ' – ' + (a.slice(0, 7) === b.slice(0, 7) ? (+b.slice(8)) + ' 日' : cn(b, cross));
    var txt = range + '　<b>' + fmt(w.total) + '</b>';
    if (read) read.innerHTML = txt;
  }
  function reset() {
    active = -1;
    highlight(-1);
    if (read) read.innerHTML = defaultText;
  }

  plot.addEventListener('pointermove', function (e) {
    var r = plot.getBoundingClientRect();
    show(Math.min(weeks.length - 1, Math.max(0, Math.floor((e.clientX - r.left) / step))));
  });
  plot.addEventListener('pointerleave', function () { if (document.activeElement !== plot) reset(); });
  plot.addEventListener('focus', function () { show(active >= 0 ? active : (peakDay ? peakDay.week : weeks.length - 1)); });
  plot.addEventListener('blur', reset);
  plot.addEventListener('keydown', function (e) {
    var i = active < 0 ? weeks.length - 1 : active;
    if (e.key === 'ArrowLeft') i -= 1;
    else if (e.key === 'ArrowRight') i += 1;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = weeks.length - 1;
    else if (e.key === 'Escape') { plot.blur(); return; }
    else return;
    e.preventDefault();
    show(Math.min(weeks.length - 1, Math.max(0, i)));
  });

  fetch('assets/data/contributions.json', { cache: 'force-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      days = data.days || [];
      days.forEach(function (d, i) { index[d[0]] = i; });
      for (var s = 0; s < days.length; s += 7) {
        var w = { start: s, end: Math.min(days.length - 1, s + 6), total: 0, maxAt: s };
        for (var i = w.start; i <= w.end; i++) {
          w.total += days[i][1];
          if (days[i][1] > days[w.maxAt][1]) w.maxAt = i;
        }
        weeks.push(w);
        if (w.total > wmax) wmax = w.total;
      }
      days.forEach(function (d, i) {
        if (!peakDay || d[1] > peakDay.count) peakDay = { date: d[0], count: d[1], week: Math.floor(i / 7) };
      });
      draw();
      var lastW = plot.clientWidth;
      if (window.ResizeObserver) {
        new ResizeObserver(function () {
          if (plot.clientWidth !== lastW) { lastW = plot.clientWidth; draw(); }
        }).observe(plot);
      }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placeTags(plot.clientWidth, plot.clientHeight - MONTH_ROW); });
    })
    .catch(function () { graph.hidden = true; });
})();
