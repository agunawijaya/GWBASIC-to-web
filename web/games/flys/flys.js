/* ===========================================================================
   flys.js — port dari FLYS.BAS (1985), permainan "ikuti lalatnya".

   ------------------------------------------------------------------------
   SPRITE YANG DIGAMBAR OLEH KODE, LALU DIPOTRET

   Tidak ada bitmap di berkas ini. Lalatnya digambar dengan bahasa makro DRAW —
   sebuah bahasa penyu yang tertanam di BASIC — lalu dipotret ke larik:

       200 BODY$="c1u5be1d6r1u6bf1d5"
       210 URWING$="c3bu3br1e3r1g3r1e3"
       …
       250 DRAW BODY$+URWING$+ULWING$      ' lalat pertama
       260 DRAW "bd20br6"                  ' turun 20, geser 6
       270 DRAW BODY$+DRWING$+DLWING$      ' lalat kedua
       280 GET (131,91)-(152,103),FLY0
       290 GET (151,91)-(172,103),FLY1
       300 GET (151,105)-(172,117),FLY2

   Port ini MENJALANKAN string itu, bukan menggambar ulang lalatnya dengan
   tangan. Ada penafsir DRAW di bawah, hasilnya dirasterkan jadi piksel, lalu
   ketiga persegi GET diambil dari peta piksel yang sama — persis urutan
   aslinya. Lalat yang Anda lihat memang lalat 1985 itu.

   ------------------------------------------------------------------------
   FLY0 BUKAN FASE KEPAKAN — IA PENGHAPUS

   Menjalankan makronya menjawab sesuatu yang tidak bisa dijawab dengan
   membacanya. Pena berhenti di kotak x 154..169, y 94..114; total 100 piksel.
   Ketiga persegi GET lalu diperiksa:

       FLY0  GET(131,91)-(152,103)  ->   0 piksel     <-- KOSONG
       FLY1  GET(151,91)-(172,103)  ->  50 piksel     sayap atas
       FLY2  GET(151,105)-(172,117) ->  50 piksel     sayap bawah

   FLY0 tidak memotret apa pun. Ia persegi kosong, dan gunanya di baris 630:
   `PUT …,FLY0,PSET` MENGHAPUS lalatnya. Jadi kepakannya dua fase, bukan tiga —
   dan lalatnya sudah hilang sebelum pemukulnya turun. Itu yang membuat
   permainan ini permainan ingatan.

   ------------------------------------------------------------------------
   UKURAN LARIKNYA DIHITUNG, BUKAN DITEBAK

       130 DIM FLY0(21),FLY1(21),FLY2(21)
       140 DIM SWAT(714)

   Ukuran larik GET di GW-BASIC = 4 + INT((lebar*bit_per_piksel+7)/8) * tinggi.
   SCREEN 1 memakai 2 bit per piksel:

       lalat  22x13 -> 4 + INT((22*2+7)/8)*13  =    82 bita   DIM 21 x4 =   84
       swat   76x150-> 4 + INT((76*2+7)/8)*150 = 2.854 bita   DIM 714 x4 = 2.856

   Keduanya **minimum yang muat**, dengan sisa dua bita — dan sisa dua bita itu
   dipaksa oleh pembulatan ke kelipatan empat, bukan dipilih. Angka 21 dan 714
   tidak mungkin ditebak.

   ------------------------------------------------------------------------
   DELAY MENGHITUNG PEKERJAAN, DAN ITU MERATAKAN KURVANYA

       570 WHILE+ BUZZ < DELAY
       580 PUT(74*FLY,67),FLY1,PSET
       590 PUT(74*FLY,67),FLY2,PSET
       600 BUZZ=BUZZ+99
       610 WEND

   Lama satu hinggapan = ceil(DELAY/99) pasang PUT. Bukan waktu — CACAH KERJA.
   DELAY dikali 0,7370001 tiap berhasil dan 1,47 tiap gagal (dibatasi 3000).

   Akibatnya bisa dihitung: DELAY jatuh di bawah 99 pada bunuh ke-12, dan sejak
   itu ceil(DELAY/99) = 1 SELAMANYA. Padahal menang butuh 31. Dua puluh bunuh
   terakhir tingkat kesulitannya identik — kurvanya rata, dan sebabnya bukan
   rancangan melainkan karena 99 adalah kuantum terkecil yang bisa dihitung.

   Port ini mempertahankan cacahnya persis dan memberinya satuan waktu lewat
   penggeser "PUT per detik", supaya rata itu bisa DILIHAT, bukan disembunyikan.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();
  const $ = (id) => document.getElementById(id);
  const db = store('flys');
  const acak = rng(Date.now() & 0xffff);

  /* SCREEN 1, COLOR 0,1 -> palet 1: sian / magenta / putih di atas hitam. */
  const CGA = ['#000000', '#55ffff', '#ff55ff', '#ffffff'];
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const e = document.createElementNS(NS, t);
    if (a) for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };

  /* --- penafsir makro DRAW ------------------------------------------------
     Cukup untuk FLYS: c, u/d/l/r/e/f/g/h, awalan b, dan m dengan tanda. */
  const ARAH = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0],
                 e: [1, -1], f: [1, 1], g: [-1, 1], h: [-1, -1] };

  function bresenham(x0, y0, x1, y1, c, px) {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, x = x0, y = y0;
    for (;;) {
      px.set(x + ',' + y, c);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx) { err += dx; y += sy; }
    }
  }

  function draw(s, st, px) {
    s = s.toLowerCase().replace(/\s/g, '');
    let i = 0;
    while (i < s.length) {
      let buta = false;
      if (s[i] === 'b') { buta = true; i += 1; }
      const c = s[i]; i += 1;
      let j = i;
      while (j < s.length && (/[0-9]/.test(s[j]) || s[j] === '+' || s[j] === '-' ||
                              (c === 'm' && s[j] === ','))) j += 1;
      const arg = s.slice(i, j); i = j;
      if (c === 'c') { st.c = parseInt(arg, 10); continue; }
      let nx, ny;
      if (c === 'm') {
        const m = arg.match(/^([+-]?\d+),([+-]?\d+)$/);
        const dx = +m[1], dy = +m[2];
        const relatif = /^[+-]/.test(m[1]);
        nx = relatif ? st.x + dx : dx;
        ny = relatif ? st.y + dy : dy;
      } else {
        const n = arg === '' ? 1 : parseInt(arg, 10);
        nx = st.x + ARAH[c][0] * n;
        ny = st.y + ARAH[c][1] * n;
      }
      if (!buta) bresenham(st.x, st.y, nx, ny, st.c, px);
      st.x = nx; st.y = ny;
    }
  }

  /* --- baris 200-300: bangun lalatnya ------------------------------------- */
  const BODY   = 'c1u5be1d6r1u6bf1d5';
  const URWING = 'c3bu3br1e3r1g3r1e3';
  const ULWING = 'bg3bl7h3l1f3l1h3';
  const DRWING = 'c3br6h3l1f3l1h3';
  const DLWING = 'bl5g3l1e3l1g3';

  /** Padanan `GET (x1,y1)-(x2,y2), larik`. */
  function ambil(px, x1, y1, x2, y2) {
    const p = [];
    px.forEach((c, k) => {
      const koma = k.indexOf(',');
      const x = +k.slice(0, koma), y = +k.slice(koma + 1);
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) p.push({ x: x - x1, y: y - y1, c });
    });
    return { w: x2 - x1 + 1, h: y2 - y1 + 1, piksel: p };
  }

  const petaLalat = new Map();
  (function () {
    const st = { x: 160, y: 100, c: 3 };            // pena di tengah sesudah CLS
    draw(BODY + URWING + ULWING, st, petaLalat);    // 250
    draw('bd20br6', st, petaLalat);                 // 260
    draw(BODY + DRWING + DLWING, st, petaLalat);    // 270
  })();
  const SPR = {
    FLY0: ambil(petaLalat, 131, 91, 152, 103),      // 280
    FLY1: ambil(petaLalat, 151, 91, 172, 103),      // 290
    FLY2: ambil(petaLalat, 151, 105, 172, 117)      // 300
  };

  /* --- baris 320-430: bangun pemukulnya -----------------------------------
     Semuanya LINE…BF kecuali baris 380-410, yang menggambar 30 bentuk "V"
     pada Y berurutan. Ketiga puluh bentuk itu tidak dirasterkan satu per satu:
     karena tiap V punya kemiringan tepat 1 lalu datar lalu -1, gabungannya
     bisa dinyatakan per KOLOM sebagai dua jalur tegak — 152 persegi, bukan
     4.500 piksel. Hasil rasternya identik. */
  function bangunPemukul() {
    const kotak = [];
    kotak.push({ x: 0, y: 0, w: 76, h: 86, c: 3 });                    // 330
    for (let X = 5; X <= 65; X += 10)                                   // 340-370
      for (let Y = 55; Y <= 125; Y += 10)
        kotak.push({ x: X, y: Y - 50, w: 6, h: 6, c: 0 });
    const f = (x) => (x <= 25 ? x : (x <= 50 ? 25 : 75 - x));
    for (let x = 0; x <= 75; x++) {                                     // 380-410
      kotak.push({ x, y: 106 + f(x) - 50, w: 1, h: 5, c: 3 });          // Y=106..110
      kotak.push({ x, y: 111 + f(x) - 50, w: 1, h: 25, c: 0 });         // Y=111..135
    }
    kotak.push({ x: 30, y: 86, w: 16, h: 64, c: 1 });                   // 420
    return { w: 76, h: 150, kotak };
  }
  const PEMUKUL = bangunPemukul();

  /* --- layar 320x200 ------------------------------------------------------ */
  const svg = $('svg');
  const gLatar = mkn('g'), gPad = mkn('g'), gHias = mkn('g'),
        gLalat = mkn('g'), gPemukul = mkn('g'), gPilih = mkn('g'),
        gCoret = mkn('g'), gTeks = mkn('g');

  /* --- rupa modern: SATU lapis filter, nol piksel yang berubah -------------
     Seluruh hiasan di bawah ini bekerja DI ATAS piksel yang dihasilkan makro
     DRAW 1985; tidak satu pun mengubah isi sprite, posisi sel, atau aturan
     main. Tombol "Mode 1985" mematikannya seluruhnya — dan kalau kedua mode
     pernah memperlihatkan lalat yang berbeda bentuknya, yang salah hiasannya. */
  (function defs() {
    const d = mkn('defs');
    const f = mkn('filter', { id: 'fosfor', x: '-40%', y: '-40%',
                              width: '180%', height: '180%' });
    f.append(mkn('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 1.6, result: 'b' }));
    const m = mkn('feMerge');
    m.append(mkn('feMergeNode', { in: 'b' }), mkn('feMergeNode', { in: 'b' }),
             mkn('feMergeNode', { in: 'SourceGraphic' }));
    f.append(m);
    d.append(f);

    /* Latar arena: gradien lembut supaya bidang hitam 290x170 tidak terbaca
       sebagai lubang. Warnanya tetap di keluarga CGA — biru tua, bukan warna
       baru. */
    const g = mkn('radialGradient', { id: 'garena', cx: '50%', cy: '38%', r: '75%' });
    g.append(mkn('stop', { offset: 0, 'stop-color': '#12213d' }),
             mkn('stop', { offset: .55, 'stop-color': '#070d1c' }),
             mkn('stop', { offset: 1, 'stop-color': '#02040a' }));
    d.append(g);

    /* Gradien untuk lalat & pemukul yang digambar sendiri (lihat §7b dokumen).
       Warna di sini SENGAJA di luar palet CGA — ini gambar baru, bukan tiruan
       piksel 1985, dan menyamarkannya jadi empat warna justru akan membuatnya
       tampak seperti sprite asli yang cacat. */
    const grad = [
      ['gmata',  'r', ['#ff8a5c', 0], ['#d8341f', .55], ['#6e1109', 1]],
      ['gdada',  'l', ['#7e8899', 0], ['#39404f', .55], ['#1b2029', 1]],
      /* Perut lalat rumah kelabu-zaitun kusam, bukan kuning. Versi pertama
         memakai kuning-amber dan terbaca sebagai LEBAH — rupa yang salah
         menjanjikan hewan yang salah. */
      ['gperut', 'l', ['#8f8768', 0], ['#4d472f', .5], ['#231f14', 1]],
      ['gsayap', 'l', ['#eafaff', 0], ['#a9d8ee', .45], ['#6fa8c8', 1]],
      ['gpad',   'l', ['#ff7a5e', 0], ['#e8402f', .5], ['#93150f', 1]],
      ['ggagang','l', ['#5a6478', 0], ['#2b313d', .45], ['#12151c', 1]]
    ];
    grad.forEach(([id, jenis, ...stops]) => {
      const el = jenis === 'r'
        ? mkn('radialGradient', { id, cx: '35%', cy: '30%', r: '78%' })
        : mkn('linearGradient', { id, x1: '10%', y1: '0%', x2: '90%', y2: '100%' });
      stops.forEach(([c, o]) => el.append(mkn('stop', { offset: o, 'stop-color': c })));
      d.append(el);
    });

    const bay = mkn('filter', { id: 'bayangJatuh', x: '-30%', y: '-30%',
                                width: '180%', height: '180%' });
    bay.append(mkn('feDropShadow', { dx: 0, dy: 2.5, stdDeviation: 2,
                                     'flood-color': '#000', 'flood-opacity': .55 }));
    d.append(bay);
    svg.append(d);
  })();

  svg.append(gLatar, gPad, gHias, gLalat, gPemukul, gPilih, gCoret, gTeks);
  gLalat.setAttribute('class', 'f-lapis');
  gPemukul.setAttribute('class', 'f-lapis');
  gCoret.setAttribute('class', 'f-lapis');

  const kotakSvg = (x, y, w, h, c) =>
    mkn('rect', { x, y, width: w, height: h, fill: CGA[c],
                  'shape-rendering': 'crispEdges' });

  function bingkai() {                                   // baris 460-480
    gLatar.textContent = '';
    gLatar.append(kotakSvg(0, 0, 320, 200, 2));          // 470
    gLatar.append(kotakSvg(9, 9, 302, 182, 3));          // 480
    gLatar.append(kotakSvg(15, 15, 290, 170, 0));        // 490/510
    /* Hiasan: lapisan gradien DI ATAS bidang hitam baris 510, seukuran persis
       dan tidak sepiksel pun di luarnya. */
    gLatar.append(mkn('rect', { class: 'f-arena', x: 15, y: 15,
                                width: 290, height: 170 }));
    gPad.textContent = '';
    /* Tiga bantalan pendaratan. Aslinya tidak ada apa-apa di sini; ini
       tambahan yang menunjukkan LETAK ketiga tempat — bukan tempat mana yang
       sedang dipakai, jadi ia tidak memberi tahu apa pun yang disembunyikan
       baris 630. */
    for (let i = 1; i <= 3; i++) {
      gPad.append(mkn('rect', { class: 'f-pad', x: 74 * i - 3, y: 64,
                                width: 28, height: 19, rx: 4 }));
    }
  }
  const bersihkanArena = () => {                          // 510
    gLalat.textContent = ''; gPemukul.textContent = '';
    gCoret.textContent = ''; gTeks.textContent = ''; gHias.textContent = '';
    gPilih.textContent = '';
    bingkai();
  };

  /* --- memilih pemukul langsung di layar ----------------------------------
     Aslinya jawabannya hanya bisa lewat papan ketik:

         770 K$=INKEY$
         790 IF K$<>"1" AND K$<>"2" AND K$<>"3" THEN 770

     Permintaan pemilik koleksi: pemukulnya bisa diklik langsung. Ditambahkan
     sebagai bidang klik seukuran persis kotak `PUT` masing-masing pemukul —
     (87*SWIPE-51, 35) selebar 76 setinggi 150 — jadi yang bisa diklik benar-
     benar pemukulnya, bukan kira-kira daerahnya. Tuts 1/2/3 tetap jalan,
     karena itu yang tertulis di layar oleh baris 760. */
  function pasangPilihan() {
    gPilih.textContent = '';
    for (let i = 1; i <= 3; i++) {
      const x = 87 * i - 51;
      const g = mkn('g', { class: 'f-pilih', tabindex: '0', role: 'button',
                           'aria-label': 'Pilih pemukul ' + i });
      g.append(mkn('rect', { class: 'f-pilih__kilau', x, y: 35, width: 76, height: 150, rx: 12 }));
      g.append(mkn('rect', { class: 'f-pilih__garis', x: x + 1, y: 36, width: 74, height: 148, rx: 11 }));
      const b = mkn('g', { class: 'f-pilih__no' });
      b.append(mkn('circle', { cx: x + 38, cy: 167, r: 10 }));
      const t = mkn('text', { x: x + 38, y: 167, 'text-anchor': 'middle',
                              'dominant-baseline': 'central' });
      t.textContent = i;
      b.append(t);
      g.append(b);
      g.addEventListener('click', () => jawab(i));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jawab(i); }
      });
      gPilih.append(g);
    }
  }

  /** Padanan `PUT (x,y), sprite, PSET`: seluruh persegi ditimpa, termasuk
      piksel kosongnya — itulah sebabnya FLY0 menghapus. Dipakai Mode 1985. */
  function taruh(g, spr, x, y) {
    g.textContent = '';
    g.append(kotakSvg(x, y, spr.w, spr.h, 0));
    for (const p of spr.piksel) g.append(kotakSvg(x + p.x, y + p.y, 1, 1, p.c));
  }

  /* =======================================================================
     LALAT DAN PEMUKUL YANG DIGAMBAR SENDIRI

     Atas permintaan pemilik koleksi. Ini GAMBAR BARU, bukan turunan sprite
     1985 — dan itu perlu dinyatakan terang-terangan, karena di tempat lain
     koleksi ini justru berkeras menurunkan bentuk dari datanya.

     Yang menjaga temuannya tetap utuh ada dua:
       - panel bukti di halaman tetap menjalankan makro DRAW aslinya dan
         mencacah pikselnya (100 / 0 / 50 / 50) — itu tidak disentuh;
       - tombol "Mode 1985" mengembalikan permainannya ke sprite piksel asli,
         jadi keduanya ada di port yang sama, satu tombol jaraknya.

     Kotak yang dipakai tetap 22x13 pada (74*FLY, 67), sama persis dengan
     `GET`-nya, supaya letak dan ukurannya tidak berubah sedikit pun.
     ======================================================================= */
  const svgn = (t, a) => mkn(t, a);

  /** Satu sayap, digambar sebagai kurva berurat. `sisi` -1 kiri, +1 kanan. */
  function sayapLalat(sisi, angkat) {
    const g = mkn('g', { class: 'f-sayap' });
    const s = sisi;
    const d = angkat
      /* sayap terangkat & tersapu ke belakang */
      ? 'M' + (11 + s * 1.4) + ' 5.9 C' + (11 + s * 4.6) + ' 4.1,' +
        (11 + s * 8.2) + ' 1.4,' + (11 + s * 9.0) + ' 0.1 C' +
        (11 + s * 9.4) + ' -0.6,' + (11 + s * 8.0) + ' -0.7,' +
        (11 + s * 6.6) + ' 0.5 C' + (11 + s * 4.2) + ' 2.4,' +
        (11 + s * 2.2) + ' 4.4,' + (11 + s * 1.7) + ' 6.5 Z'
      /* sayap terkembang penuh ke samping-belakang */
      : 'M' + (11 + s * 1.4) + ' 5.8 C' + (11 + s * 5.2) + ' 5.2,' +
        (11 + s * 9.6) + ' 7.0,' + (11 + s * 10.6) + ' 9.9 C' +
        (11 + s * 10.9) + ' 10.8,' + (11 + s * 9.4) + ' 11.2,' +
        (11 + s * 7.6) + ' 10.5 C' + (11 + s * 4.8) + ' 9.4,' +
        (11 + s * 2.3) + ' 7.7,' + (11 + s * 1.7) + ' 6.4 Z';
    g.append(mkn('path', { class: 'f-sayap__bilah', d }));
    /* Urat sayap: tiga garis halus yang mengikuti arah bilahnya. */
    const urat = angkat
      ? ['M' + (11 + s * 1.9) + ' 5.4 C' + (11 + s * 4.4) + ' 3.4,' + (11 + s * 7.0) + ' 1.4,' + (11 + s * 8.4) + ' 0.4',
         'M' + (11 + s * 2.1) + ' 6.2 C' + (11 + s * 4.6) + ' 4.6,' + (11 + s * 6.8) + ' 2.6,' + (11 + s * 7.8) + ' 1.4']
      : ['M' + (11 + s * 2.0) + ' 6.0 C' + (11 + s * 5.2) + ' 6.2,' + (11 + s * 8.6) + ' 7.8,' + (11 + s * 9.9) + ' 9.9',
         'M' + (11 + s * 2.2) + ' 6.8 C' + (11 + s * 5.0) + ' 7.4,' + (11 + s * 7.6) + ' 8.8,' + (11 + s * 8.8) + ' 10.2'];
    urat.forEach(d2 => g.append(mkn('path', { class: 'f-sayap__urat', d: d2 })));
    return g;
  }

  /** Lalat rumah dilihat dari atas: mata majemuk, dada bergaris, perut
      berpita, enam kaki, dua sayap. Kotaknya 22x13 seperti sprite aslinya. */
  function lalatGambar(angkat) {
    const g = mkn('g', { class: 'f-lalat' });

    g.append(sayapLalat(-1, angkat), sayapLalat(1, angkat));

    /* enam kaki, tiga per sisi */
    const kaki = [
      [8.9, 6.0, 6.4, 5.9, 4.9, 7.6, 4.4, 9.6],
      [8.9, 7.3, 6.5, 7.9, 5.2, 9.9, 5.1, 11.9],
      [9.4, 8.5, 8.2, 10.0, 7.5, 11.5, 7.7, 13.0]
    ];
    [-1, 1].forEach(s => kaki.forEach(k => {
      g.append(mkn('path', { class: 'f-kaki',
        d: 'M' + (11 + s * (11 - k[0])) + ' ' + k[1] +
           ' C' + (11 + s * (11 - k[2])) + ' ' + k[3] +
           ',' + (11 + s * (11 - k[4])) + ' ' + k[5] +
           ',' + (11 + s * (11 - k[6])) + ' ' + k[7] }));
    }));

    /* perut: melebar sedikit lalu meruncing panjang */
    g.append(mkn('path', { class: 'f-perut',
      d: 'M8.6 8.5 C8.1 10.5,9.2 13.3,11 13.3 C12.8 13.3,13.9 10.5,13.4 8.5 Z' }));
    [[9.9, 2.45], [11.1, 2.05], [12.2, 1.45]].forEach(([y, w]) =>
      g.append(mkn('path', { class: 'f-pita',
        d: 'M' + (11 - w) + ' ' + y + ' Q11 ' + (y + .75) + ' ' + (11 + w) + ' ' + y })));
    g.append(mkn('line', { class: 'f-jahit', x1: 11, y1: 8.7, x2: 11, y2: 12.9 }));

    /* dada + empat garis khas lalat rumah */
    g.append(mkn('ellipse', { class: 'f-dada', cx: 11, cy: 6.9, rx: 2.8, ry: 3.0 }));
    [-1.5, -0.5, 0.5, 1.5].forEach(dx => g.append(mkn('line', { class: 'f-garis',
      x1: 11 + dx, y1: 4.5, x2: 11 + dx * 1.25, y2: 9.3 })));
    g.append(mkn('ellipse', { class: 'f-kilap', cx: 10.1, cy: 5.7, rx: 1.1, ry: 1.4 }));

    /* mata majemuk — hampir bersentuhan, seperti lalat jantan */
    [-1, 1].forEach(s => {
      g.append(mkn('ellipse', { class: 'f-mata', cx: 11 + s * 1.95, cy: 3.3,
                                rx: 2.05, ry: 2.35 }));
      g.append(mkn('ellipse', { class: 'f-mata__kilat', cx: 11 + s * 2.55, cy: 2.4,
                                rx: .62, ry: .78 }));
    });
    g.append(mkn('path', { class: 'f-muka',
      d: 'M9.8 3.0 Q11 5.6 12.2 3.0 Q11 4.0 9.8 3.0 Z' }));

    return g;
  }

  /** Pemukul lalat: kepala jaring berlubang, leher, gagang bergerigi.
      Kotaknya 76x150 seperti `SWAT`, dan jumlah lubangnya 7x8 = 56 —
      cacah yang sama dengan gelung baris 340-370 aslinya. */
  function pemukulGambar() {
    const g = mkn('g', { class: 'f-pemukul' });
    g.append(mkn('rect', { class: 'f-pad-luar', x: 2, y: 2, width: 72, height: 78, rx: 13 }));
    g.append(mkn('rect', { class: 'f-pad-dalam', x: 6.5, y: 6.5, width: 63, height: 69, rx: 9 }));
    for (let i = 0; i < 7; i++) {                    // 7 kolom, seperti X=5..65 STEP 10
      for (let j = 0; j < 8; j++) {                  // 8 baris, seperti Y=55..125 STEP 10
        g.append(mkn('circle', { class: 'f-lubang',
                                 cx: 11.5 + i * 8.5, cy: 12 + j * 8.6, r: 2.7 }));
      }
    }
    g.append(mkn('path', { class: 'f-pad-kilau',
      d: 'M9 24 C9 13,17 6.5,29 6.5 C20 10,13.5 16,12.5 26 Z' }));
    g.append(mkn('path', { class: 'f-leher', d: 'M31 78 L45 78 L43.5 92 L32.5 92 Z' }));
    g.append(mkn('rect', { class: 'f-gagang', x: 32.5, y: 88, width: 11, height: 62, rx: 5 }));
    g.append(mkn('rect', { class: 'f-gagang__kilau', x: 34.6, y: 92, width: 2.2,
                           height: 52, rx: 1.1 }));
    for (let k = 0; k < 4; k++) {
      g.append(mkn('rect', { class: 'f-gerigi', x: 32.5, y: 116 + k * 7.5,
                             width: 11, height: 3, rx: 1.5 }));
    }
    return g;
  }

  /* Hiasan lalat: bayangan, gema sayap, dan goyang seperempat piksel. Gema
     sayapnya digambar dari SPRITE YANG SATU LAGI — jadi ia bukan karangan,
     melainkan bingkai kepakan sebelumnya yang belum pudar. */
  /** Satu tempat yang memutuskan lalatnya digambar bagaimana. `angkat` fase
      sayap; `hapus` berarti baris 630 — sprite kosong yang menghapus. */
  function tampilkanLalat(x, y, angkat, hapus) {
    gHias.textContent = '';
    gLalat.removeAttribute('transform');
    if (hapus) {                                   // 630: PUT …,FLY0,PSET
      if (mode1985) { taruh(gLalat, SPR.FLY0, x, y); return; }
      gLalat.textContent = '';
      return;
    }
    if (mode1985) {                                // 580/590 dengan sprite asli
      taruh(gLalat, angkat ? SPR.FLY1 : SPR.FLY2, x, y);
      return;
    }
    gLalat.textContent = '';
    const g = lalatGambar(angkat);
    g.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
    gLalat.append(g);
    /* Goyang dengung: setengah satuan naik-turun mengikuti fase sayap. Murni
       rupa — tidak ada sel yang berubah, dan ia berhenti pada saat yang sama
       dengan penghapusnya. */
    gLalat.setAttribute('transform', 'translate(0 ' + (angkat ? -0.6 : 0.6) + ')');
    gHias.append(mkn('ellipse', { class: 'f-bayang', cx: x + 11, cy: y + 14, rx: 9, ry: 2.4 }));
    /* Gema sayap: fase kepakan yang satu lagi, samar. Bentuknya milik
       penggambar yang sama, jadi ia tidak pernah menyimpang dari lalatnya. */
    const gema = lalatGambar(!angkat);
    gema.setAttribute('class', 'f-lalat f-gema');
    gema.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
    gHias.append(gema);
  }

  function taruhPemukul(swipe, diam) {                    // 690
    const x = 87 * swipe - 51;
    const g = mkn('g', { class: diam ? '' : 'f-swat' });
    if (mode1985) {
      for (const k of PEMUKUL.kotak) g.append(kotakSvg(x + k.x, 35 + k.y, k.w, k.h, k.c));
      gPemukul.append(g);
      return;
    }
    const p = pemukulGambar();
    p.setAttribute('transform', 'translate(' + x + ' 35)');
    g.append(p);
    gPemukul.append(g);
    if (diam) return;
    /* Debu benturan: enam serpihan yang memudar. Murni hiasan. */
    for (let i = 0; i < 6; i++) {
      const c = mkn('circle', { class: 'f-debu', cx: x + 8 + acak.next() * 60,
                                cy: 180 + acak.next() * 4, r: 1 + acak.next() * 1.6 });
      c.style.animationDelay = (0.18 + i * 0.02) + 's';
      gPemukul.append(c);
      c.addEventListener('animationend', () => c.remove());
    }
    guncang();
  }

  let guncangT = 0;
  function guncang() {
    if (mode1985) return;
    const el = $('crt');
    el.classList.remove('f-crt--guncang');
    void el.offsetWidth;                       // paksa mulai ulang animasinya
    el.classList.add('f-crt--guncang');
    clearTimeout(guncangT);
    guncangT = setTimeout(() => el.classList.remove('f-crt--guncang'), 320);
  }

  /* LOCATE di SCREEN 1: 25 baris x 40 kolom, sel aksara 8x8 piksel. */
  function teks(baris, kolom, s, c) {
    const t = mkn('text', { x: (kolom - 1) * 8, y: (baris - 1) * 8 + 7,
                            fill: CGA[c === undefined ? 3 : c],
                            'font-family': 'var(--font-mono, monospace)',
                            'font-size': 8, 'xml:space': 'preserve' });
    t.textContent = s;
    gTeks.append(t);
    return t;
  }

  /* ======================================================================= */

  let delay = 3000, rank = 0, speed = 0, rekor = db.get('rekor', 0);
  let lalat = 1, hop = 0, hopMaks = 0, rep = 0, repMaks = 0, sayap = 0;
  let swipe = 0, tebakan = 0, coretI = 0, coretX = 0, coretY = 0;
  let fase = 'diam';
  let mode1985 = false;
  let gelung = { start() {}, stop() {}, pause() {} };
  let hz = 60;

  const bunyi = (f, t) => { if ($('bunyi').checked) audio.sound(f, t); };

  function papan() {
    const kepak = Math.max(1, Math.ceil(delay / 99));
    $('s-speed').textContent = Math.round(speed);
    $('s-rekor').textContent = Math.round(rekor);
    $('s-delay').textContent = delay.toFixed(2);
    $('s-ulang').textContent = kepak;
    $('s-rank').textContent = ['—', 'Senior De-Bugger', 'Professional'][rank] || '—';
    /* Bilah SPEED: 0..9999 dengan ambang 8000 dan 9000 ditandai di CSS. */
    $('bar-isi').style.width = Math.min(100, speed / 9999 * 100) + '%';
    tandaiKurva();
  }

  /* --- grafik kurva: temuan §4 dibuat bisa dilihat sambil bermain ---------
     Titik-titiknya DIHITUNG dari rumus yang sama dengan permainannya, bukan
     diketik: DELAY(s) = 3000 x 0,7370001^s dan kepak = ceil(DELAY/99). Jadi
     kalau salah satu angka di kode diubah, grafiknya ikut berubah. */
  const KURVA = (function () {
    const t = []; let d = 3000;
    for (let s = 0; s <= 31; s++) { t.push({ s, d, kepak: Math.max(1, Math.ceil(d / 99)) }); d *= 0.7370001; }
    return t;
  })();

  (function gambarKurva() {
    const g = $('kurva');
    if (!g) return;
    const W = 300, H = 90, maks = KURVA[0].kepak;      // 31
    const px = (s) => 8 + s / 31 * (W - 16);
    const py = (k) => H - 12 - (k / maks) * (H - 24);
    let d = '';
    KURVA.forEach((p, i) => {
      d += (i ? ' L' : 'M') + px(p.s) + ' ' + py(p.kepak) +
           ' L' + px(Math.min(31, p.s + 1)) + ' ' + py(p.kepak);
    });
    g.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    g.append(mkn('path', { class: 'f-k-garis', d }));
    /* Garis tegak di bunuh ke-12: titik tempat ceil(DELAY/99) terkunci di 1. */
    g.append(mkn('line', { class: 'f-k-rata', x1: px(12), y1: 8, x2: px(12), y2: H - 12 }));
    g.append(mkn('rect', { class: 'f-k-datar', x: px(12), y: py(1) - 3,
                           width: px(31) - px(12), height: 6 }));
    [[0, '31 kepak'], [12, 'bunuh 12'], [31, 'menang']].forEach(([s, t]) => {
      const e = mkn('text', { class: 'f-k-teks', x: px(s), y: H - 2,
                              'text-anchor': s === 0 ? 'start' : (s === 31 ? 'end' : 'middle') });
      e.textContent = t; g.append(e);
    });
    g.append(mkn('circle', { id: 'k-titik', class: 'f-k-titik', cx: px(0), cy: py(31), r: 3.4 }));
    g._px = px; g._py = py;
  })();

  function tandaiKurva() {
    const g = $('kurva'), t = $('k-titik');
    if (!g || !t) return;
    let s = 0;
    while (s < 31 && KURVA[s + 1].d > delay - 0.0001) s += 1;
    t.setAttribute('cx', g._px(s));
    t.setAttribute('cy', g._py(Math.max(1, Math.ceil(delay / 99))));
  }

  const pesan = (t) => { $('pesan').textContent = t || ''; };

  /* --- baris 1490-1590: hitung skor dan pangkat --------------------------- */
  function hitungSkor() {
    speed = (3000 - delay) * 10 / 3;                      // 1490
    if (speed < 0) speed = 0;                             // 1500
    if (speed > rekor) { rekor = speed; db.set('rekor', rekor); }   // 1530
    if (speed > 8000 && rank < 1) rank = 11;              // 1560
    if (speed > 9000 && rank < 2) rank = 12;              // 1570
    if (speed > 9999) rank = 99;                          // 1580
    papan();
  }

  /* --- baris 510-640: lalat berikutnya ------------------------------------ */
  function rondeLalat() {
    bersihkanArena();
    hopMaks = Math.floor(7 + 5 * acak.next());            // 520: FOR I=1 TO 7+5*RND
    hop = 0;
    pilihLalat();
    fase = 'lalat';
    pesan('Ikuti lalatnya. Ia menghilang sebelum pemukulnya turun.');
  }

  function pilihLalat() {
    lalat = Math.floor(3 * acak.next() + 1);              // 530
    rep = 0; sayap = 0;
    repMaks = Math.max(1, Math.ceil(delay / 99));         // 570-610
    /* 560 `SOUND 63+7*RND,999` = dengung 55 detik, dihentikan baris 620 dengan
       `SOUND 47,0`. Di sini panjangnya langsung dihitung sepanjang hinggapan
       ini — hasilnya sama, tanpa perlu antrean bunyi yang harus dibuang. */
    bunyi(63 + 7 * acak.next(), repMaks * 2 / hz * 18.2); // 560
  }

  /* --- satu langkah simulasi = SATU `PUT` --------------------------------- */
  function langkah() {
    if (fase === 'lalat') {
      if (sayap === 0) {                                                        // 580
        tampilkanLalat(74 * lalat, 67, true, false);
        sayap = 1;
      } else {                                                                  // 590
        tampilkanLalat(74 * lalat, 67, false, false);
        sayap = 0; rep += 1;
      }
      if (rep >= repMaks) {
        /* 630: MENGHAPUS. Hiasannya dibuang di panggilan yang SAMA — kalau
           bayangan atau gema sayap tertinggal satu bingkai saja, ia akan
           membocorkan tempat terakhir lalatnya, hal yang justru disembunyikan
           baris 630, dan seluruh permainannya bergantung pada itu. */
        tampilkanLalat(74 * lalat, 67, false, true);
        hop += 1;
        if (hop >= hopMaks) { fase = 'pemukul'; swipe = 0; }
        else pilihLalat();
      }
      return;
    }

    if (fase === 'pemukul') {                             // 670-700
      swipe += 1;
      bunyi(999, 1);                                      // 680
      taruhPemukul(swipe);
      if (swipe >= 3) {
        fase = 'tanya';
        gelung.stop();
        teks(1, 12, 'Press ESC to end');                  // 745
        teks(3, 7, 'Check which swatter (1,2,3) ?');      // 750/760
        pesan('Pemukul mana? Tekan 1, 2, atau 3.');
        pasangPilihan();
        $('hint').hidden = false;
      }
      return;
    }

    if (fase === 'coret') {                               // 900-990
      const I = coretI;
      if (I > 40) { selesaiCoret(); return; }
      const freq = 99 * Math.pow(Math.sin(2.1 - I / 17), 3) + 678;   // 910
      bunyi(freq, 2);                                                // 930
      if (I % 3 === 0) { coretX = 74 * tebakan + 9; coretY = 67; }   // 940
      const clr = Math.floor(3 * acak.next() + 1);                   // 950
      const dx = Math.floor(9 * acak.next() - 4);                    // 960
      const dy = Math.floor(9 * acak.next() - 4);                    // 970
      const px = new Map();
      bresenham(coretX, coretY, coretX + dx, coretY + dy, clr, px);  // 980
      px.forEach((c, k) => {
        const koma = k.indexOf(',');
        gCoret.append(kotakSvg(+k.slice(0, koma), +k.slice(koma + 1), 1, 1, c));
      });
      /* Hiasan: satu goresan bercahaya menutupi ruas yang BARU saja digambar
         baris 980, memakai titik ujung yang sama. Ia memudar sendiri; piksel
         CGA di bawahnya tetap tinggal, persis seperti aslinya. */
      if (!mode1985) {
        const l = mkn('line', { class: 'f-gores', x1: coretX, y1: coretY,
                                x2: coretX + dx, y2: coretY + dy,
                                stroke: CGA[clr] });
        gCoret.append(l);
        l.addEventListener('animationend', () => l.remove());
        if (I === 0) {
          const r = mkn('circle', { class: 'f-letup', cx: coretX, cy: coretY, r: 3 });
          gCoret.append(r);
          r.addEventListener('animationend', () => r.remove());
          guncang();
        }
      }
      coretX += dx; coretY += dy;
      coretI += 1;
      return;
    }

    if (fase === 'kabur') {                               // 1330-1360
      if (sayap === 0) { taruh(gLalat, SPR.FLY1, 74 * lalat, 67); sayap = 1; }
      else { taruh(gLalat, SPR.FLY2, 74 * lalat, 67); sayap = 0; rep += 1; }
      if (rep >= 100) { selesaiKabur(); }                 // 1330: FOR I=1 TO 100
      return;
    }
  }

  /* --- baris 800-820: jawaban -------------------------------------------- */
  function jawab(g) {
    if (fase !== 'tanya') return;
    tebakan = g;
    gPilih.textContent = '';
    $('hint').hidden = true;
    gTeks.textContent = '';
    /* 810: LINE (87*GUESS-51,35)-(87*GUESS+24,184),0,BF — pemukul terpilih
       diangkat. Yang terlihat di baliknya: tidak ada apa-apa, karena baris 630
       sudah menghapus lalatnya. */
    gPemukul.append(kotakSvg(87 * g - 51, 35, 76, 150, 0));
    if (g !== lalat) return meleset();                    // 820
    return kena();
  }

  /* --- baris 850-1230: kena ---------------------------------------------- */
  function kena() {
    delay = 0.7370001 * delay;                            // 850
    hitungSkor();                                         // 860
    teks(3, 7, 'GOT IT !!!');                             // 880
    pesan('Kena.');
    fase = 'coret'; coretI = 0;
    gelung.start();
  }

  async function selesaiCoret() {
    fase = 'jeda';
    gelung.stop();
    gLalat.textContent = ''; gCoret.textContent = ''; gTeks.textContent = '';
    bersihkanArena();

    if (rank === 99) return menang();                     // 1010
    if (rank === 11) {                                    // 1020-1090
      rank = 1;
      teks(12, 4, "YOU JUST MADE 'SENIOR DE-BUGGER'!!!");
      papan();
      /* Baris 1090 dimulai dengan MF — music FOREGROUND, yang MEMBLOKIR di
         GW-BASIC. Jadi lagunya bukan hiasan: ia satu-satunya alasan pesan di
         atas sempat terbaca, karena baris 1180 langsung menghapusnya. */
      await laguTahan('MF O3 T200 L5 MS cde.cffcd.cde.cffcd...', 2500);
    } else if (rank === 12) {                             // 1100-1170
      rank = 2;
      teks(12, 4, 'WOW! What a professional! Buzz on!');
      papan();
      await laguTahan('MF O3 T200 L5 MS ccg.ccg.efgedccffcd...', 2500);
    }
    bersihkanArena();                                     // 1180
    teks(12, 4, 'Oh oh! Here comes a faster fly ...');     // 1200
    await RETRO.wait(1100);                                // 1210: FOR I=1 TO 999
    rondeLalat();                                          // 1230
    gelung.start();
  }

  /* --- baris 1260-1460: meleset ------------------------------------------ */
  function meleset() {
    delay = 1.47 * delay;                                 // 1260
    if (delay > 3000) delay = 3000;                       // 1270
    hitungSkor();                                         // 1280
    gPemukul.append(kotakSvg(87 * lalat - 51, 35, 76, 150, 0));   // 1290
    teks(3, 7, 'Whoops, it got away.');                   // 1310
    bunyi(57, 47);                                        // 1320
    pesan('Lolos.');
    fase = 'kabur'; rep = 0; sayap = 0;
    gelung.start();
  }

  async function selesaiKabur() {
    fase = 'jeda';
    gelung.stop();
    bersihkanArena();
    /* 1420-1430: pangkat DITURUNKAN kalau kecepatannya jatuh di bawah ambang.
       Satu-satunya tempat pangkat bisa turun. */
    if (speed < 9000) rank = 1;                           // 1420
    if (speed < 8000) rank = 0;                           // 1430
    papan();
    teks(12, 7, delay === 3000 ? 'Here comes another one ...'      // 1390
                               : 'Here comes a slower fly ...');   // 1400
    await RETRO.wait(1100);                                // 1440
    rondeLalat();                                          // 1460
    gelung.start();
  }

  /* --- baris 1620-1700: menang ------------------------------------------- */
  async function menang() {
    fase = 'menang';
    gelung.stop();
    bersihkanArena();
    teks(10, 5, 'YOU DID IT!!! NO BUGS LEFT!!!');         // 1630
    teks(12, 5, 'Welcome to the S.W.A.T. team !');        // 1650
    pesan('Tiga puluh satu lalat. Selesai.');
    $('mulai').disabled = false;
    $('mulai').textContent = 'Main lagi';
    /* 1660-1700 aslinya gelung TANPA UJUNG: lagunya diulang selamanya sambil
       COLOR BGD,PLT mengacak warna latar. Tidak ada jalan keluar selain
       mematikan komputer. Di sini diputar sekali. */
    await laguTahan('T169 L9 MS abcdefgacegecacgfedfdfdgdccedabbcaegfc', 2500);
  }

  /* Menahan pesan selama lagunya berbunyi — padanan `MF` yang memblokir.
     Dua pengaman: kalau bunyi dimatikan, pesannya tetap ditahan `minMs`
     (pesan yang hanya terbaca saat bunyi menyala akan jadi penyimpangan yang
     tidak diminta siapa pun), dan ada batas atas 8 detik supaya alur permainan
     tidak pernah tergantung pada janji audio yang tak kunjung selesai —
     misalnya saat konteks audio ditangguhkan peramban. */
  function laguTahan(makro, minMs) {
    const p = $('bunyi').checked
      ? Promise.resolve(audio.play(makro, { fresh: true })).catch(() => {})
      : Promise.resolve();
    return Promise.race([
      Promise.all([p, RETRO.wait(minMs)]),
      RETRO.wait(8000)
    ]);
  }

  /* --- kendali ------------------------------------------------------------ */
  function buatGelung() {
    gelung.stop();
    gelung = loop({ hz: hz, update: langkah });
  }

  function mulai() {
    delay = 3000; rank = 0; speed = 0;
    fase = 'jeda';
    papan();
    $('mulai').disabled = true;
    $('mulai').textContent = 'Mulai';
    kb.captureScroll(true);
    buatGelung();
    rondeLalat();
    gelung.start();
  }

  function berhenti() {
    fase = 'diam';
    gelung.stop();
    kb.captureScroll(false);
    gPilih.textContent = '';
    $('hint').hidden = true;
    $('mulai').disabled = false;
    pesan('Berhenti. SPEED terakhir ' + Math.round(speed) + '.');
  }

  kb.on('*', (e) => {
    if (fase === 'tanya') {
      if (e.key === '1' || e.key === '2' || e.key === '3') jawab(+e.key);   // 790
      else if (e.key === 'Escape') berhenti();                              // 785
    }
  });

  /* --- pasang ------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: 'Flys', source: "FLYS.BAS · 1985 · sprite dari makro DRAW"
  }));

  $('mulai').addEventListener('click', mulai);
  $('stop').addEventListener('click', berhenti);
  $('mode').addEventListener('click', () => {
    mode1985 = !mode1985;
    $('crt').classList.toggle('f-crt--1985', mode1985);
    $('mode').setAttribute('aria-pressed', String(mode1985));
    $('mode').textContent = mode1985 ? 'Mode modern' : 'Mode 1985';
    /* Hiasan dimatikan di JS, bukan cuma disembunyikan di CSS — supaya tidak
       ada elemen yang tetap dibuat lalu ditutupi. */
    if (mode1985) gHias.textContent = '';
    bingkai();
    /* Pemukul yang SUDAH turun digambar ulang dalam rupa mode yang baru —
       tanpa animasi hantaman dan tanpa bunyi, karena ia tidak sedang jatuh
       lagi. Lalatnya tidak perlu: ia digambar ulang tiap langkah. */
    if (swipe > 0 && (fase === 'tanya' || fase === 'pemukul')) {
      gPemukul.textContent = '';
      for (let i = 1; i <= swipe; i++) taruhPemukul(i, true);
      if (fase !== 'pemukul' && tebakan) {
        gPemukul.append(kotakSvg(87 * tebakan - 51, 35, 76, 150, 0));
      }
    }
  });
  $('hz').addEventListener('input', (e) => {
    hz = +e.target.value;
    $('hzv').textContent = hz + ' PUT/dtk';
    if (fase !== 'diam' && fase !== 'tanya') { buatGelung(); gelung.start(); }
  });
  $('hzv').textContent = hz + ' PUT/dtk';

  /* Bukti yang ditampilkan di halaman — dihitung dari sprite yang baru saja
     dibangun, bukan diketik. */
  $('b-total').textContent = petaLalat.size;
  $('b-fly0').textContent = SPR.FLY0.piksel.length;
  $('b-fly1').textContent = SPR.FLY1.piksel.length;
  $('b-fly2').textContent = SPR.FLY2.piksel.length;
  const xs = [], ys = [];
  petaLalat.forEach((c, k) => {
    const koma = k.indexOf(',');
    xs.push(+k.slice(0, koma)); ys.push(+k.slice(koma + 1));
  });
  $('b-kotak').textContent = Math.min(...xs) + '..' + Math.max(...xs) + ' × ' +
                             Math.min(...ys) + '..' + Math.max(...ys);

  /* Contoh sprite digambar langsung, bukan lewat rAF: tab tersembunyi tidak
     menjalankan rAF sama sekali. */
  (function contoh() {
    [['c-fly1', SPR.FLY1], ['c-fly2', SPR.FLY2], ['c-fly0', SPR.FLY0]]
      .forEach(([id, spr]) => {
        const s = $(id);
        s.setAttribute('viewBox', '0 0 ' + spr.w + ' ' + spr.h);
        s.append(kotakSvg(0, 0, spr.w, spr.h, 0));
        for (const p of spr.piksel) s.append(kotakSvg(p.x, p.y, 1, 1, p.c));
      });
    const sp = $('c-swat');
    sp.setAttribute('viewBox', '0 0 76 150');
    for (const k of PEMUKUL.kotak) sp.append(kotakSvg(k.x, k.y, k.w, k.h, k.c));
  })();

  bingkai();
  papan();
  pesan('Tekan Mulai. Lalatnya hinggap 7–11 kali, lalu tiga pemukul turun.');
})();
