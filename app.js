import { SITE } from './data/site-data.js';

function setAvatar(imgEl) {
  imgEl.src = SITE.avatar;
  imgEl.addEventListener(
    'error',
    () => {
      imgEl.src = SITE.avatarFallback;
    },
    { once: true }
  );
}
setAvatar(document.getElementById('nav-avatar'));
setAvatar(document.getElementById('hero-avatar'));

document.getElementById('hero-status').textContent = SITE.status;
document.getElementById('hero-tagline').textContent = SITE.tagline;
document.getElementById('pr-search-link').href = SITE.links.prSearch;

const metricsWrap = document.getElementById('hero-metrics');
metricsWrap.innerHTML = SITE.metrics
  .map(
    (m, i) => `
      <div class="hm-item">
        <span class="hm-num" data-idx="${i}">0${m.suffix}</span>
        <span class="hm-label">${m.label}</span>
      </div>
    `
  )
  .join('');

(function animateNumbers() {
  const els = metricsWrap.querySelectorAll('.hm-num');
  const dur = 1050;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 4);
    els.forEach((el) => {
      const m = SITE.metrics[Number(el.dataset.idx)];
      el.textContent = `${Math.round(m.target * eased).toLocaleString('en-US')}${m.suffix}`;
    });
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

const barsWrap = document.getElementById('pc-bars');
const chartReadout = document.getElementById('chart-readout');
const maxCommit = Math.max(...SITE.weeklyCommits.map((d) => d.c));

barsWrap.innerHTML = SITE.weeklyCommits
  .map((item, idx) => {
    const ratio = Math.sqrt(item.c / maxCommit);
    const pct = Math.max(10, Math.round(ratio * 100));
    const cls = ['c-bar', item.tag ? 'has-tag' : '', item.peak ? 'is-peak' : '']
      .filter(Boolean)
      .join(' ');
    return `<span class="${cls}" style="--h:${pct}%;--bd:${idx * 10}ms" data-idx="${idx}"></span>`;
  })
  .join('');

barsWrap.addEventListener('mouseover', (e) => {
  const bar = e.target.closest('.c-bar');
  if (!bar) return;
  const d = SITE.weeklyCommits[Number(bar.dataset.idx)];
  chartReadout.textContent = `${d.w} · ${d.c} 次提交${d.tag ? `（${d.tag}）` : ''}`;
});
barsWrap.addEventListener('mouseleave', () => {
  chartReadout.textContent = '5,773 次贡献 · 223 活跃天';
});

const reactions = [
  'git status → clean',
  '2025 SE · Building wuuud',
  'Merged 167 upstream PRs'
];
let reactIdx = 0;
document.getElementById('avatar-trigger').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const pop = document.createElement('div');
  pop.className = 'pop-kaomoji';
  pop.textContent = reactions[reactIdx % reactions.length];
  reactIdx += 1;
  pop.style.left = `${rect.left + rect.width / 2}px`;
  pop.style.top = `${rect.top - 6}px`;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1150);
});

const scrubWrap = document.getElementById('scrub-statement');
scrubWrap.innerHTML = SITE.bridgeLines
  .map((line) => `<p class="scrub-line">${line}</p>`)
  .join('');
const scrubLines = [...scrubWrap.querySelectorAll('.scrub-line')];

const spines = [document.getElementById('spine-1'), document.getElementById('spine-2')];
spines.forEach((path) => {
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  path.dataset.len = String(len);
});

function updateScrollFlow() {
  const vh = window.innerHeight;
  spines.forEach((path) => {
    const r = path.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (vh * 0.78 - r.top) / (r.height + vh * 0.28)));
    path.style.strokeDashoffset = String(Number(path.dataset.len) * (1 - p));
  });

  scrubLines.forEach((el) => {
    const r = el.getBoundingClientRect();
    const lit = Math.max(0.2, Math.min(1, (vh * 0.76 - r.top) / (vh * 0.34)));
    el.style.setProperty('--lit', lit.toFixed(3));
  });

  document.querySelectorAll('.scroll-reveal:not(.is-in)').forEach((el) => {
    if (el.getBoundingClientRect().top < vh * 0.95) {
      el.classList.add('is-in');
    }
  });
}
window.addEventListener('scroll', () => requestAnimationFrame(updateScrollFlow), {
  passive: true
});
updateScrollFlow();

function renderStageMarkup(w) {
  if (w.stageType === 'shot-wuuud' || w.stageType === 'shot-alpha') {
    const isWuuud = w.stageType === 'shot-wuuud';
    const hasDark = Boolean(w.shotDark);
    return `
      <div class="stage-studio ${isWuuud ? 'bg-sage' : 'bg-slate'}" data-zoom="${w.shot}" data-zoom-dark="${w.shotDark || ''}" data-title="${w.title} 界面预览（演示数据）">
        <div class="studio-win ${hasDark ? 'shot-has-dark' : ''}">
          <div class="win-bar">
            <span class="win-dots"><i></i><i></i><i></i></span>
            <span>${isWuuud ? 'wuuud — WeChat 4.x Desktop' : 'Alpha v0.3.5'}</span>
          </div>
          <div class="win-body">
            <img class="shot-light-img" src="${w.shot}" alt="${w.title}" loading="lazy" />
            ${hasDark ? `<img class="shot-dark-img" src="${w.shotDark}" alt="${w.title}" loading="lazy" />` : ''}
          </div>
        </div>
      </div>
    `;
  }

  if (w.stageType === 'weflow-pipeline') {
    return `
      <div class="stage-studio stage-dark">
        <div class="studio-win dark-win">
          <div class="win-bar">
            <span class="win-dots"><i></i><i></i><i></i></span>
            <span>WeFlow — Moments Media Decrypter</span>
          </div>
          <div class="wf-body">
            <div class="wf-col">
              <span class="wf-tag">CDN CIPHER</span>
              <div class="wf-hex">90 48 2d ae<br/>c5 f5 f6 f1<br/>3e ca 74 ee</div>
            </div>
            <div class="wf-mid">
              <div class="wf-flow-line"></div>
              <span class="wf-chip">ISAAC-64 ⊕ WASM</span>
              <div class="wf-flow-line"></div>
            </div>
            <div class="wf-out-list">
              <div class="wf-out-item"><span>Live Photo 实况</span><b>✓</b></div>
              <div class="wf-out-item"><span>SNS 高清视频</span><b>✓</b></div>
              <div class="wf-out-item"><span>JSON / HTML 等 7 路</span><b>✓</b></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (w.stageType === 'cpsat-console') {
    return `
      <div class="stage-studio bg-sand stage-cpsat-wrap" id="cpsat-stage" title="点击演示冲突消解求解">
        <div class="studio-win">
          <div class="win-bar">
            <span class="win-dots"><i></i><i></i><i></i></span>
            <span>tupai-zhice — FastAPI + React + CP-SAT</span>
          </div>
          <div class="cpsat-win-body">
            <div class="cpsat-status-row">
              <span>SSE 规则解析 → 最小改动调课</span>
              <span class="cpsat-pill" id="cpsat-badge">0 硬冲突 ✓ 已同步飞书</span>
            </div>
            <div class="tt-grid">
              ${'<div class="tt-cell"></div>'.repeat(12)}
              <div class="tt-block b-1">离散数学</div>
              <div class="tt-block b-2">编译原理</div>
              <div class="tt-block b-3">算法设计</div>
              <div class="tt-block b-4">操作系统</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (w.stageType === 'jiaowu-phone') {
    return `
      <div class="stage-studio bg-sky">
        <div class="miniapp-phone">
          <div class="mp-topbar">
            <span class="mp-title">
              <img src="${w.logo}" alt="" />
              <span>教务助手</span>
            </span>
            <span class="mp-capsule">离线缓存已就绪</span>
          </div>
          <div class="mp-schedule-card">
            <div class="mp-course-main">
              <strong>MD5 请求签名 · Token 会话</strong>
              <span>账号与业务隔离缓存，教务拥堵自动回退</span>
            </div>
            <span class="mp-time-badge">200 OK</span>
          </div>
          <div class="mp-grid">
            <div class="mp-tile">课表<small>云提醒</small></div>
            <div class="mp-tile">成绩<small>绩点</small></div>
            <div class="mp-tile">考试<small>日程</small></div>
            <div class="mp-tile">空教室<small>实时</small></div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="stage-studio stage-dark">
      <div class="studio-win dark-win">
        <div class="win-bar">
          <span class="win-dots"><i></i><i></i><i></i></span>
          <span>mi_nobl_root — HyperOS 3.0 / Linux 6.6</span>
        </div>
        <div class="term-body">
          <div><span class="t-prompt">$</span> ./ksu_step1.sh <span class="t-dim"># IMQSNative entry</span></div>
          <div class="t-dim">[+] resolving /proc/kallsyms KASLR offset...</div>
          <div><span class="t-prompt">$</span> insmod kernelsu.ko <span class="t-ok">v3.1.0 LKM loaded</span></div>
          <div><span class="t-ok">[✓] ZygiskSU + LSPosed active (Bootloader Locked)</span> <span class="t-cursor"></span></div>
        </div>
      </div>
    </div>
  `;
}

const worksGrid = document.getElementById('works-grid');
worksGrid.innerHTML = SITE.works
  .map((w, idx) => {
    const titleHtml = w.href
      ? `<a href="${w.href}" target="_blank" rel="noopener">${w.title} ↗</a>`
      : w.title;

    return `
      <article class="work-item scroll-reveal" style="--sd: ${(idx % 2) * 70}ms">
        <div class="work-stage">${renderStageMarkup(w)}</div>
        <div class="work-meta">
          <div class="work-title-row">
            <h3>${titleHtml}</h3>
            <span class="work-stat">${w.stat}</span>
          </div>
          <p class="work-desc">${w.oneLiner}</p>
        </div>
      </article>
    `;
  })
  .join('');

const cpsatStage = document.getElementById('cpsat-stage');
const cpsatBadge = document.getElementById('cpsat-badge');
function triggerCpsatSolve() {
  if (!cpsatStage) return;
  cpsatStage.classList.add('is-conflict');
  cpsatBadge.textContent = '检测到 2 处排课冲突…';
  setTimeout(() => {
    cpsatStage.classList.remove('is-conflict');
    cpsatBadge.textContent = '0 硬冲突 ✓ 已同步飞书';
  }, 1150);
}
if (cpsatStage) {
  cpsatStage.addEventListener('click', triggerCpsatSolve);
  setInterval(triggerCpsatSolve, 4800);
}

function fillMarquee(el, items) {
  const repeated = [...items, ...items, ...items];
  el.innerHTML = repeated
    .map((item) =>
      item.url
        ? `<a class="mq-pill" href="${item.url}" target="_blank" rel="noopener">${item.text} ↗</a>`
        : `<span class="mq-pill">${item.text}</span>`
    )
    .join('');
}
fillMarquee(document.getElementById('marquee-1'), SITE.marqueeRow1);
fillMarquee(document.getElementById('marquee-2'), SITE.marqueeRow2);

document.getElementById('craft-cards').innerHTML = SITE.craftCards
  .map(
    (c, idx) => `
      <article class="craft-card scroll-reveal" style="--sd: ${idx * 70}ms">
        <div class="c-no">${c.no}</div>
        <h3>${c.title}</h3>
        <p>${c.body}</p>
      </article>
    `
  )
  .join('');

const contactPills = document.getElementById('contact-pills');
contactPills.innerHTML = `
  <a class="mag-btn is-primary" href="${SITE.links.github}" target="_blank" rel="noopener">GitHub @xunchahaha ↗</a>
  <button type="button" class="mag-btn" data-copy="${SITE.links.telegramHandle}">Telegram ${SITE.links.telegramHandle}</button>
  <button type="button" class="mag-btn" data-copy="${SITE.links.email}">${SITE.links.email}</button>
`;

const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1900);
}

contactPills.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const text = btn.dataset.copy;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  showToast(`已复制：${text}`);
});

document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const dialog = document.getElementById('shot-dialog');
const dialogImg = document.getElementById('dialog-img');
const dialogTitle = document.getElementById('dialog-title');
document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

worksGrid.addEventListener('click', (e) => {
  const zoom = e.target.closest('[data-zoom]');
  if (!zoom) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  dialogTitle.textContent = zoom.dataset.title;
  dialogImg.src = isDark && zoom.dataset.zoomDark ? zoom.dataset.zoomDark : zoom.dataset.zoom;
  dialog.showModal();
});

document.getElementById('theme-btn').addEventListener('click', () => {
  const root = document.documentElement;
  root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.02, rootMargin: '0px 0px 48px 0px' }
);
document.querySelectorAll('.scroll-reveal').forEach((el) => io.observe(el));
