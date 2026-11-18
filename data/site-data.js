const IMG_BASE = './assets/img';

export const SITE = {
  name: 'xuncha',
  zhName: '寻茶',
  handle: '@xunchahaha',
  status: '2025 级软工本科在读 · 正在做 wuuud',
  tagline: '拆开没文档的黑盒协议，做成几千人顺手在用的软件。',
  avatar: `${IMG_BASE}/avatar.jpg`,
  avatarFallback: 'https://github.com/xunchahaha.png?size=240',
  links: {
    github: 'https://github.com/xunchahaha',
    telegram: 'https://t.me/xunchahaha',
    telegramHandle: '@xunchahaha',
    email: 'xunchahaha31@gmail.com',
    wuuud: 'https://wuuud.com',
    prSearch:
      'https://github.com/search?q=is%3Apr+author%3Axunchahaha+-user%3Axunchahaha&type=pullrequests'
  },
  metrics: [
    { target: 5773, suffix: '', label: '过去一年代码提交' },
    { target: 167, suffix: '', label: '合入外部仓库 PR' },
    { target: 16, suffix: 'k+', label: '独立与合作产品用户' }
  ],
  weeklyCommits: [
    { w: '25.11 W4', c: 39 },
    { w: '25.12 W1', c: 28, tag: '加入 WeFlow' },
    { w: '25.12 W2', c: 34 },
    { w: '25.12 W3', c: 16 },
    { w: '25.12 W4', c: 12 },
    { w: '26.01 W1', c: 21 },
    { w: '26.01 W2', c: 71 },
    { w: '26.01 W3', c: 50 },
    { w: '26.01 W4', c: 20 },
    { w: '26.02 W1', c: 34 },
    { w: '26.02 W2', c: 98 },
    { w: '26.02 W3', c: 107 },
    { w: '26.02 W4', c: 9 },
    { w: '26.03 W1', c: 48, tag: '教务助手上线' },
    { w: '26.03 W2', c: 42 },
    { w: '26.03 W3', c: 36 },
    { w: '26.03 W4', c: 31 },
    { w: '26.04 W1', c: 102, tag: '津彩导览' },
    { w: '26.04 W2', c: 23 },
    { w: '26.04 W3', c: 25 },
    { w: '26.04 W4', c: 35 },
    { w: '26.05 W1', c: 29 },
    { w: '26.05 W2', c: 37 },
    { w: '26.05 W3', c: 12 },
    { w: '26.05 W4', c: 10 },
    { w: '26.06 W1', c: 19 },
    { w: '26.06 W2', c: 8 },
    { w: '26.06 W3', c: 13 },
    { w: '26.06 W4', c: 10 },
    { w: '26.07 W1', c: 10 },
    { w: '26.07 W2', c: 6 },
    { w: '26.07 W3', c: 10 },
    { w: '26.07 W4', c: 10 },
    { w: '26.08 W1', c: 16 },
    { w: '26.08 W2', c: 10 },
    { w: '26.08 W3', c: 8 },
    { w: '26.08 W4', c: 14, tag: '途排智策' },
    { w: '26.09 W1', c: 65 },
    { w: '26.09 W2', c: 173 },
    { w: '26.09 W3', c: 104 },
    { w: '26.09 W4', c: 416 },
    { w: '26.09 W5', c: 340 },
    { w: '26.10 W1', c: 66 },
    { w: '26.10 W2', c: 220 },
    { w: '26.10 W3', c: 664, peak: true, tag: '单日峰值 357 · Alpha 发布' },
    { w: '26.10 W4', c: 815, peak: true, tag: '连续 22 天冲刺' },
    { w: '26.10 W5', c: 487 },
    { w: '26.11 W1', c: 415 },
    { w: '26.11 W2', c: 38 },
    { w: '26.11 W3', c: 144, tag: '加入 wuuud' },
    { w: '26.11 W4', c: 125 }
  ],
  bridgeLines: [
    '从抓包反汇编一行未知的私有字节，',
    '到桌面端毫秒级翻找十万条聊天记录，',
    '再到用数学规划排好整座教学楼的课表。'
  ],
  works: [
    {
      id: 'wuuud',
      stageType: 'shot-wuuud',
      title: 'wuuud',
      oneLiner: '微信 4.x 桌面聊天记录检索、导出与年度总结',
      stat: '690+ 用户 · 140 DAU',
      href: 'https://wuuud.com',
      repo: 'https://github.com/Wuuud-ai/Wuuud',
      shot: `${IMG_BASE}/wuuud-light.jpg`,
      shotDark: `${IMG_BASE}/wuuud-dark.jpg`
    },
    {
      id: 'weflow',
      stageType: 'weflow-pipeline',
      title: 'WeFlow',
      oneLiner: '主要维护者 · 攻克朋友圈实况媒体流密码解密与 7 路导出',
      stat: '16,000 ★ · 93 PRs',
      href: 'https://github.com/hicccc77/WeFlow',
      logo: `${IMG_BASE}/weflow.png`
    },
    {
      id: 'tupai',
      stageType: 'cpsat-console',
      title: '途排智策',
      oneLiner: 'SSE 流式规则解析 + OR-Tools CP-SAT 排课调课，同步飞书多维表格',
      stat: '飞书 AI 大赛上线',
      href: 'https://github.com/xunchahaha/tupai-zhice'
    },
    {
      id: 'jiaowu',
      stageType: 'jiaowu-phone',
      title: '校园教务助手',
      oneLiner: '独立逆向 MD5 签名与会话链路，教务宕机无感回退本地隔离缓存',
      stat: '4,189 用户 · 1,900 日活',
      href: 'https://github.com/xunchahaha/jiaowuteset',
      logo: `${IMG_BASE}/jiaowu.png`
    },
    {
      id: 'alpha',
      stageType: 'shot-alpha',
      title: 'Alpha 客户端',
      oneLiner: '单月连发 5 版的本地聊天分析工具（现已并入 wuuud）',
      stat: '11,207 下载 · 347 ★',
      href: 'https://github.com/xunchahaha/alpha-releases',
      shot: `${IMG_BASE}/alpha-chat.jpg`
    },
    {
      id: 'minobl',
      stageType: 'minobl-term',
      title: 'mi_nobl_root',
      oneLiner: '小米免解锁 BL 动态修补 kallsyms 加载 KernelSU LKM + LSPosed',
      stat: '443 ★ · 90 Forks',
      href: 'https://github.com/xunchahaha/mi_nobl_root'
    }
  ],
  marqueeRow1: [
    { text: 'hicccc77/WeFlow · 93 PRs Merged', url: 'https://github.com/hicccc77/WeFlow' },
    { text: 'ycccccccy/echotrace · 3.9k★ · 78 Commits', url: 'https://github.com/ycccccccy/echotrace' },
    { text: 'woof · PyQt6 + Whisper 本地 CUDA 实时字幕', url: 'https://github.com/xunchahaha/woof' },
    { text: 'OpenWrt-Network-Watchdog · 断网重连与校园网认证', url: 'https://github.com/xunchahaha/OpenWrt-Network-Watchdog' },
    { text: 'xunchahaha/jiaowuteset · 教务小程序开源', url: 'https://github.com/xunchahaha/jiaowuteset' }
  ],
  marqueeRow2: [
    { text: 'ChatLab · 聊天记录通用交换格式 PR' },
    { text: 'open-design · 上游开源贡献' },
    { text: 'chaoxing-work-export · 修带图导出缩放与答案遗漏' },
    { text: '全国大学生数学建模竞赛 · 省一等奖' },
    { text: 'Python × Gaussian · 自动化跑完 511 个量子化学计算作业' },
    { text: '亚太地区大学生数模竞赛 · 队长兼论文主稿' }
  ],
  craftCards: [
    {
      no: '01',
      title: '主力技术栈',
      body: 'TypeScript · Electron · React · Python · FastAPI · OR-Tools · Flutter / 小程序'
    },
    {
      no: '02',
      title: '工程习惯',
      body: '重度用 AI 辅助提速，但每一处 Diff 必读、日志必查、64 位大整数与边界必跑实测。'
    },
    {
      no: '03',
      title: '竞赛与科研',
      body: '全国数模省一等奖、亚太数模队长；课题组编写 Python 管线批处理 107 个分子、511 个 Gaussian 作业。'
    }
  ]
};
