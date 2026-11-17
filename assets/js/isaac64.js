// ISAAC-64 伪随机数发生器（Bob Jenkins 的 isaac64.c 移植），用 BigInt 做 64 位运算
// 只给页首签名的解密演示用：生成密钥流，和明文逐字节 XOR
(function (global) {
  var M = (1n << 64n) - 1n;
  var GOLDEN = 0x9e3779b97f4a7c13n;

  function Isaac64(seed) {
    var mm = new Array(256).fill(0n);
    var rsl = new Array(256).fill(0n);
    (seed || []).forEach(function (v, i) { if (i < 256) rsl[i] = BigInt.asUintN(64, BigInt(v)); });
    var aa = 0n, bb = 0n, cc = 0n;
    var a = GOLDEN, b = GOLDEN, c = GOLDEN, d = GOLDEN, e = GOLDEN, f = GOLDEN, g = GOLDEN, h = GOLDEN;

    function mix() {
      a = (a - e) & M; f ^= h >> 9n;  h = (h + a) & M;
      b = (b - f) & M; g ^= (a << 9n) & M;  a = (a + b) & M;
      c = (c - g) & M; h ^= b >> 23n; b = (b + c) & M;
      d = (d - h) & M; a ^= (c << 15n) & M; c = (c + d) & M;
      e = (e - a) & M; b ^= d >> 14n; d = (d + e) & M;
      f = (f - b) & M; c ^= (e << 20n) & M; e = (e + f) & M;
      g = (g - c) & M; d ^= f >> 17n; f = (f + g) & M;
      h = (h - d) & M; e ^= (g << 14n) & M; g = (g + h) & M;
    }

    // randinit(flag = TRUE)：先用种子，再用 mm 自身各搅一遍
    for (var i = 0; i < 4; i++) mix();
    [rsl, mm].forEach(function (src) {
      for (var j = 0; j < 256; j += 8) {
        a = (a + src[j]) & M;     b = (b + src[j + 1]) & M;
        c = (c + src[j + 2]) & M; d = (d + src[j + 3]) & M;
        e = (e + src[j + 4]) & M; f = (f + src[j + 5]) & M;
        g = (g + src[j + 6]) & M; h = (h + src[j + 7]) & M;
        mix();
        mm[j] = a; mm[j + 1] = b; mm[j + 2] = c; mm[j + 3] = d;
        mm[j + 4] = e; mm[j + 5] = f; mm[j + 6] = g; mm[j + 7] = h;
      }
    });

    function ind(x) { return mm[Number((x >> 3n) & 255n)]; }

    // isaac64()：生成下一批 256 个 64 位结果
    function generate() {
      var A = aa;
      cc = (cc + 1n) & M;
      var B = (bb + cc) & M;
      function step(k, m, m2) {
        var x = mm[m];
        var mx;
        if (k === 0) mx = (~(A ^ ((A << 21n) & M))) & M;
        else if (k === 1) mx = A ^ (A >> 5n);
        else if (k === 2) mx = A ^ ((A << 12n) & M);
        else mx = A ^ (A >> 33n);
        A = (mx + mm[m2]) & M;
        var y = (ind(x) + A + B) & M;
        mm[m] = y;
        B = (ind(y >> 8n) + x) & M;
        rsl[m] = B;
      }
      var m, m2, k;
      for (m = 0, m2 = 128; m < 128;) { for (k = 0; k < 4; k++) step(k, m++, m2++); }
      for (m = 128, m2 = 0; m < 256;) { for (k = 0; k < 4; k++) step(k, m++, m2++); }
      bb = B; aa = A;
    }

    generate();
    var cnt = 256;
    // 和 C 版一样，从结果数组的末尾往前取
    this.next = function () {
      if (cnt === 0) { generate(); cnt = 256; }
      return rsl[--cnt];
    };
  }

  // 取 n 个字节的密钥流：每个 64 位结果按小端拆成 8 个字节
  Isaac64.prototype.bytes = function (n) {
    var out = new Uint8Array(n);
    var v = 0n;
    for (var i = 0; i < n; i++) {
      if (i % 8 === 0) v = this.next();
      out[i] = Number((v >> BigInt((i % 8) * 8)) & 255n);
    }
    return out;
  };

  global.Isaac64 = Isaac64;
})(window);
