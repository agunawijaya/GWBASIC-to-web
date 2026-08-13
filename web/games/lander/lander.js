/* ===========================================================================
   lander.js — port LANDER.BAS (IBM, 8 Maret 1982, "VERSION 1.0")

   Tiga hal yang membentuk seluruh berkas ini:

   1. Pesawatnya TIDAK diputar saat berjalan. Aslinya punya 39 sprite jadi
      (13 sudut x 3 tingkat semburan) yang di-BLOAD dari LANDER.BIN. Sudutnya
      pun tidak rata: 0,15,30,45,60,90,180,270,285,300,315,330,345.
      Daftar itu dibaca dari berkasnya, bukan diketik ulang -- lihat
      lander-data.js.

   2. Fisikanya memakai 3.14, bukan pi. Selisihnya kecil tapi nyata: pada
      "180 derajat" masih ada dorongan menyamping sebesar T x 0,0016.
      Dipertahankan apa adanya.

   3. Musiknya adalah jamnya. Baris 510 mengantre DUA nada Blue Danube tiap
      bingkai; antrean SOUND di GW-BASIC dalamnya 32 nada, jadi sesudah 16
      bingkai BASIC hanya boleh melangkah secepat waltz-nya. Lihat panel.
   =========================================================================== */
(function () {
  'use strict';

  const D = window.RETRO.LANDER;
  const el = window.RETRO.ui.el;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('lander');
  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };

  const SVGNS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(SVGNS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };

  /* --- tetapan yang datang dari berkas, bukan dari kepala saya ------------ */
  const MX = D.MX, MY = D.MY, NANG = D.NANG, ANG = D.ANG;
  const LP = 80;                 // baris 1780: DIM LX(LP) dengan LP=80
  const PI314 = 3.14;            // baris 790, apa adanya
  const ADLAND = 100;            // baris 2290
  const PUSAT = 10;              // baris 1230: EX=10+X, EY=Y+10

  /* ======================================================================
     Bagian 1 — keadaan
     ====================================================================== */
  let X = 0, Y = 0, SX = 0, SY = 0, T = 10, TILT = 1;
  let F = 4000, F0 = 4000, S = 0, GRAV = 10, BOT = 0;
  let LX = [], LY = [], LAX = [], LAY = [];
  let advan = 0, hidup = false, selesai = false;
  let rekor = 152, inisial = 'You';       // dari run/LANDER.SCR
  let benih = 7, gauge = 1, mode1982 = false, musik = true;
  let bingkai = 0, catatanBahanBakar = false;

  /* ======================================================================
     Bagian 2 — RND
     Baris 220: A=RND(100*-VAL(RIGHT$(TIME$,2))). Argumen negatif menyetel
     ulang benih GW-BASIC, dan yang dipakai cuma DETIK jam -- 0..59.
     Jadi seumur hidupnya program ini hanya punya 60 medan. (Dan pada detik
     "00" argumennya 0, yang di GW-BASIC berarti "ulangi angka terakhir",
     alias tidak menyetel ulang sama sekali.)
     Angka acaknya sendiri BUKAN angka GW-BASIC: saya tidak menirukan LCG-nya,
     hanya strukturnya -- satu benih bulat 0..59 menentukan seluruh medan.
     ====================================================================== */
  let rnd = acak(1);
  const setBenih = (b) => { benih = ((b % 60) + 60) % 60; rnd = acak(benih + 1); };

  /* ======================================================================
     Bagian 3 — medan
     Baris 370..430. LY dan BOT keduanya DEFINT (baris 1680/1780), jadi
     dibulatkan, bukan dipotong.
     ====================================================================== */
  function bikinMedan() {
    BOT = Math.round(30 + 260 * rnd());
    LX = [0, 0]; LY = [0, 40];
    for (let i = 2; i <= LP; i++) {
      LX[i] = Math.round(i * 319 / LP);
      let y = 40 + (194 - 40) *
        Math.abs(Math.cos(PI314 * (1 + S / 600) * (LX[i] - BOT - 15) / 400));
      y = y + Math.sqrt(y) * (0.5 - rnd());
      if (LX[i] > BOT && LX[i] < BOT + 30) y = 198;
      if (y > 198) y = 198;
      LY[i] = Math.round(y);
    }
  }

  /* Medan Advanced Lander: baris 1790..1840. Dihitung SEKALI, di awal program,
     SEBELUM baris 220 menyetel ulang benih -- jadi di aslinya medan ini sama
     persis untuk semua orang, selamanya. Di sini pun: benih tetap. */
  function bikinMedanLanjut() {
    const r = acak(1982);
    LAX = [0, 0]; LAY = [0, 0];
    for (let i = 2; i <= LP; i++) {
      LAX[i] = Math.round(i * 319 / LP);
      let y = 194 * Math.abs(Math.cos(PI314 * (LAX[i] - 224 - 15) / 400));
      y = y + Math.sqrt(y) * (0.5 - r());
      if (LAX[i] > 224 && LAX[i] < 224 + 30) y = 198;
      if (y > 198) y = 198;
      LAY[i] = Math.round(y);
    }
  }

  /* ======================================================================
     Bagian 4 — SVG
     Semua koordinat di bawah ini piksel CGA 320x200 apa adanya. Satu-satunya
     penyesuaian ada di <g scale(1 1.2)>: piksel CGA di monitor 4:3 memang
     1,2 kali lebih tinggi daripada lebar, dan tanpa itu modulnya tampak gepeng.
     ====================================================================== */
  const svg = document.getElementById('svg');
  const gDunia = mkn('g', { transform: 'scale(1 1.2)' });
  svg.append(gDunia);

  const defs = mkn('defs', {});
  gDunia.append(defs);
  const gLangit = mkn('g', {}), gTanah = mkn('g', {}), gTitik = mkn('g', {});
  const gKapal = mkn('g', {}), gEfek = mkn('g', {}), gPanel = mkn('g', {});
  [gLangit, gTanah, gTitik, gKapal, gEfek, gPanel].forEach(g => gDunia.append(g));

  /* --- gradien & bintang -------------------------------------------------- */
  (function siapkanLangit() {
    const gr = mkn('linearGradient', { id: 'l-langit', x1: '0', y1: '0', x2: '0', y2: '1' });
    [['0%', '#05070f'], ['55%', '#0a1024'], ['100%', '#141b33']].forEach(([o, c]) =>
      gr.append(mkn('stop', { offset: o, 'stop-color': c })));
    defs.append(gr);
    const gt = mkn('linearGradient', { id: 'l-tanah', x1: '0', y1: '0', x2: '0', y2: '1' });
    [['0%', '#6f6a5e'], ['35%', '#4a463d'], ['100%', '#232019']].forEach(([o, c]) =>
      gt.append(mkn('stop', { offset: o, 'stop-color': c })));
    defs.append(gt);
    const fl = mkn('radialGradient', { id: 'l-api' });
    [['0%', '#fffbe6'], ['35%', '#ffd166'], ['70%', '#ff7a2f'], ['100%', 'rgba(255,60,0,0)']]
      .forEach(([o, c]) => fl.append(mkn('stop', { offset: o, 'stop-color': c })));
    defs.append(fl);

    /* Bumi: laut, sisi malam, dan selubung udara. */
    const laut = mkn('radialGradient', { id: 'l-laut', cx: '35%', cy: '30%', r: '78%' });
    [['0%', '#8fd0ff'], ['38%', '#3f86d8'], ['78%', '#1d4f92'], ['100%', '#123a6b']]
      .forEach(([o, c]) => laut.append(mkn('stop', { offset: o, 'stop-color': c })));
    defs.append(laut);

    /* Sisi malam. Versi pertama memakai radialGradient berpusat di kanan-bawah
       dengan tepi gelap -- yang justru menggelapkan SELURUH keliling dan
       membiarkan kanan-bawah terang: terminatornya terbalik. Yang benar
       gradien LURUS dari kiri-atas (kena matahari) ke kanan-bawah (malam),
       searah dengan sorotan di gradien lautnya. */
    const malam = mkn('linearGradient', { id: 'l-malam',
      x1: '15%', y1: '10%', x2: '92%', y2: '95%' });
    [['30%', 'rgba(2,6,16,0)'], ['62%', 'rgba(2,6,16,.30)'],
     ['100%', 'rgba(2,6,16,.78)']]
      .forEach(([o, c]) => malam.append(mkn('stop', { offset: o, 'stop-color': c })));
    defs.append(malam);

    const udara = mkn('radialGradient', { id: 'l-udara' });
    [['62%', 'rgba(120,200,255,0)'], ['82%', 'rgba(120,200,255,.30)'],
     ['100%', 'rgba(120,200,255,0)']]
      .forEach(([o, c]) => udara.append(mkn('stop', { offset: o, 'stop-color': c })));
    defs.append(udara);

    const klip = mkn('clipPath', { id: 'l-bumiKlip' });
    klip.append(mkn('circle', { cx: 0, cy: 0, r: 13 }));
    defs.append(klip);

    gLangit.append(mkn('rect', { class: 'l-latar', x: 0, y: 0, width: 320, height: 200 }));

    /* Bintang tetap: benih tetap, jadi tidak berkedip-kedip pindah tiap ronde. */
    const r = acak(1982);
    for (let i = 0; i < 90; i++) {
      const b = mkn('circle', {
        class: 'l-bintang', cx: (r() * 320).toFixed(1), cy: (r() * 150).toFixed(1),
        r: (0.3 + r() * 0.7).toFixed(2)
      });
      b.style.setProperty('--d', (r() * 4).toFixed(2) + 's');
      gLangit.append(b);
    }
    /* Bumi.

       Ia berada di dalam `gDunia`, yang diberi `scale(1 1.2)` untuk meniru
       piksel CGA yang tidak persegi (baris 109). Lingkaran biasa di dalamnya
       keluar LONJONG -- r=12 tergambar 12 x 14,4. Peregangan itu benar untuk
       sprite 1982, karena sprite memang digambar untuk piksel tak persegi.
       Tapi bola langit BUKAN sprite: ia benda bulat, dan bulat di monitor
       mana pun. Jadi kelompok ini membatalkan peregangan itu untuk dirinya
       sendiri -- skala 1/1,2 pada sumbu tegak, di sekitar pusatnya -- lalu
       menggambar anak-anaknya dalam koordinat yang berpusat di (0,0). */
    const RB = 13;
    const bumi = mkn('g', { class: 'l-bumi',
      transform: 'translate(158 27) scale(1 ' + (1 / 1.2).toFixed(6) + ')' });

    bumi.append(mkn('circle', { class: 'l-bumiUdara', cx: 0, cy: 0, r: RB * 1.5 }));
    bumi.append(mkn('circle', { class: 'l-bumiLaut', cx: 0, cy: 0, r: RB }));

    /* Daratan dan awan dipotong lingkaran yang sama, jadi tidak mungkin
       menjulur keluar bola berapa pun bentuknya. */
    const kulit = mkn('g', { 'clip-path': 'url(#l-bumiKlip)' });
    kulit.append(mkn('path', { class: 'l-bumiDarat',
      d: 'M-11 -5 q3 -4 7 -3 q3 0 3 3 q2 1 1 4 q-3 3 -6 2 q-2 3 -5 1 q-3 -3 0 -7 z' }));
    kulit.append(mkn('path', { class: 'l-bumiDarat',
      d: 'M0 3 q4 -2 7 1 q3 1 2 4 q-2 4 -6 4 q-4 0 -5 -4 q-1 -4 2 -5 z' }));
    kulit.append(mkn('path', { class: 'l-bumiDarat',
      d: 'M4 -10 q5 -1 7 2 q-1 3 -5 3 q-4 0 -4 -3 q0 -2 2 -2 z' }));
    kulit.append(mkn('path', { class: 'l-bumiDarat l-bumiDarat--tipis',
      d: 'M-8 8 q3 -1 5 1 q1 3 -2 4 q-3 0 -4 -2 q-1 -2 1 -3 z' }));
    /* Tudung es. Kecil dan menempel di kutub: pada layar sungguhan bolanya
       hanya 57 piksel, dan tudung besar terbaca sebagai noda kelabu, bukan
       sebagai es. */
    kulit.append(mkn('ellipse', { class: 'l-bumiEs', cx: -1, cy: -12.8, rx: 5, ry: 1.8 }));
    kulit.append(mkn('ellipse', { class: 'l-bumiEs', cx: 1, cy: 13, rx: 4.2, ry: 1.5 }));
    /* Dua sapuan awan, tipis. */
    kulit.append(mkn('path', { class: 'l-bumiAwan',
      d: 'M-12 -2 q6 -2.5 11 -0.5 q4 1.5 10 0' }));
    kulit.append(mkn('path', { class: 'l-bumiAwan l-bumiAwan--samar',
      d: 'M-10 5.5 q7 -2 13 0.5' }));
    bumi.append(kulit);

    /* Sisi malam: satu lapis gelap yang menebal ke kanan-bawah. Tanpa ini
       bolanya terbaca sebagai cakram, bukan bola. */
    bumi.append(mkn('circle', { class: 'l-bumiMalam', cx: 0, cy: 0, r: RB }));
    bumi.append(mkn('circle', { class: 'l-bumiTepi', cx: 0, cy: 0, r: RB }));
    gLangit.append(bumi);
  })();

  /* --- sprite 1982 --------------------------------------------------------
     39 sprite 21x21 dua bit per piksel. Tiap sprite dibangun SEKALI jadi satu
     <g> di dalam <defs>, lalu dipanggil dengan satu <use>. Membangun ulang
     ~50 <rect> tiap bingkai akan membuat DOM-nya bekerja sia-sia. */
  const WARNA = [null, '#55ff55', '#ff5555', '#ffff55'];   // palet CGA 0, latar hitam
  (function siapkanSprite() {
    for (const nama in D.SPR) {
      const s = D.SPR[nama];
      const g = mkn('g', { id: 'spr-' + nama });
      for (let y = 0; y < 21; y++) {
        let x = 0;
        while (x < 21) {
          const v = s.charCodeAt(y * 21 + x) - 48;
          let n = 1;
          while (x + n < 21 && s.charCodeAt(y * 21 + x + n) - 48 === v) n++;
          if (v) g.append(mkn('rect', { x: x, y: y, width: n, height: 1, fill: WARNA[v] }));
          x += n;
        }
      }
      defs.append(g);
    }
  })();

  /* Baris 2350/2370: ON INT(1.8+T/10) GOSUB 2390(M), 2530(R), 2670(RR).
     T=0..1 -> modul, 2..11 -> semburan kecil, 12..19 -> semburan besar. */
  const namaSprite = (t, tilt) => {
    const k = Math.floor(1.8 + t / 10);
    return (k >= 3 ? 'RR' : k === 2 ? 'R' : 'M') + tilt;
  };

  /* ======================================================================
     Bagian 5 — modul bulan versi vektor
     Bukan sprite yang diperbesar: digambar ulang, tapi proporsinya diambil
     dari sprite M1 supaya keduanya bisa ditumpuk. Badan = kolom 6..14,
     baris 4..10; kaki mendarat = baris 14; nosel = kolom 10.
     Titik putarnya (10,10) -- angka yang sama yang dipakai baris 1230 untuk
     memusatkan ledakan.
     ====================================================================== */
  function modulVektor(t) {
    const g = mkn('g', { class: 'l-modul' });

    if (t > 0) {                                   // semburan digambar dulu (di belakang)
      const p = Math.min(1, t / 19);
      const pjg = 3 + 11 * p, leb = 1.4 + 1.6 * p;
      const api = mkn('g', { class: 'l-api' });
      api.append(mkn('ellipse', {
        class: 'l-apiLuar', cx: 0, cy: 4 + pjg / 2, rx: leb * 1.9, ry: pjg / 2 + 1
      }));
      api.append(mkn('path', {
        class: 'l-apiInti',
        d: 'M' + (-leb) + ' 4 L' + leb + ' 4 L0 ' + (4 + pjg) + ' Z'
      }));
      api.style.setProperty('--nyala', (0.5 + 0.5 * p).toFixed(2));
      g.append(api);
    }

    /* kaki: dari pangkal badan ke bantalan di baris 14 (y = +4) */
    [-1, 1].forEach(s => {
      g.append(mkn('path', {
        class: 'l-kaki',
        d: 'M' + (2.2 * s) + ' 0.6 L' + (4.4 * s) + ' 4 M' + (1.2 * s) + ' 1.4 L' + (4.4 * s) + ' 4'
      }));
      g.append(mkn('rect', { class: 'l-bantalan', x: (s > 0 ? 2.4 : -6.4), y: 3.6, width: 4, height: 1.2, rx: .5 }));
    });

    /* tingkat turun (descent stage): segi delapan berlapis foil */
    g.append(mkn('path', {
      class: 'l-turun',
      d: 'M-4 -2.2 L-2.6 -3.4 L2.6 -3.4 L4 -2.2 L4 0 L2.6 1.2 L-2.6 1.2 L-4 0 Z'
    }));
    g.append(mkn('path', { class: 'l-foil', d: 'M-3.4 -2.6 L-3.4 0.6 M-1.6 -3.2 L-1.6 1 M0.2 -3.2 L0.2 1 M2 -3.2 L2 1 M3.4 -2.6 L3.4 0.6' }));

    /* tingkat naik (ascent stage) + jendela segitiga khas LM */
    g.append(mkn('path', {
      class: 'l-naik',
      d: 'M-3 -3.4 L-3 -6.2 L-1.8 -7.4 L1.8 -7.4 L3 -6.2 L3 -3.4 Z'
    }));
    g.append(mkn('path', { class: 'l-kaca', d: 'M-2.6 -4.2 L-2.6 -5.5 L-1.2 -5.1 L-1.2 -4.2 Z' }));
    g.append(mkn('path', { class: 'l-kaca', d: 'M2.6 -4.2 L2.6 -5.5 L1.2 -5.1 L1.2 -4.2 Z' }));
    g.append(mkn('circle', { class: 'l-palka', cx: 0, cy: -4.7, r: .85 }));

    /* antena pengarah + dua pendorong RCS -- baris 2..3 dan kolom 6/14 di M1 */
    g.append(mkn('line', { class: 'l-antena', x1: 0, y1: -7.4, x2: 0, y2: -9 }));
    g.append(mkn('circle', { class: 'l-antenaBola', cx: 0, cy: -9.4, r: .9 }));
    [-1, 1].forEach(s => g.append(mkn('rect', {
      class: 'l-rcs', x: (s > 0 ? 3 : -4.2), y: -6.4, width: 1.2, height: 1.6
    })));

    /* nosel */
    g.append(mkn('path', { class: 'l-nosel', d: 'M-1 1 L1 1 L1.7 4 L-1.7 4 Z' }));
    return g;
  }

  /* ======================================================================
     Bagian 6 — menggambar
     ====================================================================== */
  function gambarTanah() {
    gTanah.textContent = '';
    gTitik.textContent = '';
    const pakaiLAX = advan === 1;
    const ax = pakaiLAX ? LAX : LX, ay = pakaiLAX ? LAY : LY;
    let d = 'M0 200 L0 ' + ay[1];
    for (let i = 2; i <= LP; i++) d += ' L' + ax[i] + ' ' + ay[i];
    d += ' L' + ax[LP] + ' 200 Z';
    gTanah.append(mkn('path', { class: 'l-tanah', d: d }));

    let g = 'M0 ' + ay[1];
    for (let i = 2; i <= LP; i++) g += ' L' + ax[i] + ' ' + ay[i];
    gTanah.append(mkn('path', { class: 'l-garisTanah', d: g }));

    /* baris 440: LINE (BOT+5,193)-(BOT+25,199),2,BF -- landasannya merah. */
    gTanah.append(mkn('rect', { class: 'l-landasan', x: BOT + 5, y: 193, width: 20, height: 7 }));
    gTanah.append(mkn('rect', { class: 'l-landasanKilau', x: BOT + 5, y: 193, width: 20, height: 1.4 }));

    /* baris 450: tujuh titik merah -- gerbang ke Advanced Lander. */
    if (S > ADLAND && advan === 0) {
      for (let i = 0; i <= 6; i++)
        gTitik.append(mkn('circle', { class: 'l-titik', cx: BOT + i * 5, cy: 180, r: 1.1 }));
    }

    if (advan === 1) gambarKota();
  }

  /* Baris 2910..3000: menara peluncur, gedung, hanggar, logo IBM. */
  function gambarKota() {
    const k = mkn('g', { class: 'l-kota' });
    k.append(mkn('rect', { x: 120, y: 160, width: 25, height: 40, class: 'l-menara' }));
    for (let i = 0; i <= 2; i++)
      k.append(mkn('rect', { x: 125, y: 165 + 10 * i, width: 15, height: 4, class: 'l-menaraGaris' }));
    k.append(mkn('rect', { x: 20, y: 130, width: 100, height: 70, class: 'l-gedung' }));
    k.append(mkn('rect', { x: 35, y: 110, width: 70, height: 20, class: 'l-papan' }));
    for (let i = 0; i <= 5; i++) for (let j = 0; j <= 2; j++)
      k.append(mkn('rect', { x: 30 + 14 * i, y: 140 + j * 14, width: 10, height: 10, class: 'l-jendela' }));
    k.append(mkn('rect', { x: 65, y: 185, width: 10, height: 15, class: 'l-pintu' }));
    k.append(mkn('rect', { x: 146, y: 175, width: 59, height: 25, class: 'l-hanggar' }));
    for (let i = 0; i <= 4; i++)
      k.append(mkn('rect', { x: 150 + 10 * i, y: 178, width: 8, height: 13, class: 'l-jendela' }));
    /* Logo IBM: 38 garis mendatar, x dari DATA 1900 berpasangan, y dari 1910.
       Perhatikan baris 1890: FOR I=0 TO 75 STEP 2: READ IBMY(I): IBMY(I+1)=IBMY(I).
       Jadi DATA 1910 hanya berisi 38 angka dan mengisi indeks GENAP saja --
       IBMY(2k) adalah angka ke-k. Karena itu di sini indeksnya i/2, bukan i. */
    for (let i = 0; i <= 75; i += 2)
      k.append(mkn('line', {
        class: 'l-ibm', x1: 40 + 2 * D.IBMX[i], y1: 113 + 2 * D.IBMY[i / 2],
        x2: 40 + 2 * D.IBMX[i + 1], y2: 113 + 2 * D.IBMY[i / 2]
      }));
    gTanah.append(k);
  }

  function gambarKapal() {
    gKapal.textContent = '';
    if (mode1982) {
      const u = mkn('use', { x: X, y: Y });
      u.setAttribute('href', '#spr-' + namaSprite(T, TILT || 1));
      gKapal.append(u);
      return;
    }
    const g = modulVektor(T);
    g.setAttribute('transform',
      'translate(' + (X + PUSAT) + ' ' + (Y + PUSAT) + ') rotate(' + ANG[(TILT || 1) - 1] + ')');
    gKapal.append(g);
  }

  /* Alat ukur di DALAM layar, persis di tempat aslinya (x 241..319, y 0..40).
     GAUGE=1 -> angka (baris 250-260); GAUGE=0 -> tiga bilah (290-320). */
  function gambarPanel() {
    gPanel.textContent = '';
    if (gauge === 1) {
      const baris = [
        [' SCORE=' + S, 28], [' FALL=' + Math.floor(-SY), 29],
        ['THRUST=' + Math.floor(T), 28], ['FUEL=' + Math.floor(F), 30]
      ];
      baris.forEach(([s, kol], i) => {
        const t = mkn('text', {
          class: 'l-teks', x: (kol - 1) * 8, y: i * 8 + 6.4, 'xml:space': 'preserve'
        });
        t.textContent = s;
        gPanel.append(t);
      });
      return;
    }
    const kolom = [
      { x: 241, w: 17, huruf: 'FUEL', nilai: Math.round(40 - 40 * F / F0) },
      { x: 273, w: 17, huruf: 'FALL', nilai: batas(Math.floor(5 + SY / (2.8 + (S > ADLAND ? 1 : 0)))) },
      { x: 304, w: 16, huruf: 'POWER', nilai: Math.round(40 - 40 * T / 19) }
    ];
    kolom.forEach((k, i) => {
      gPanel.append(mkn('rect', { class: 'l-ukurLatar', x: k.x, y: 0, width: k.w, height: 41 }));
      const isi = 41 - k.nilai;
      gPanel.append(mkn('rect', {
        class: 'l-ukurIsi l-ukurIsi--' + i, x: k.x, y: k.nilai, width: k.w, height: Math.max(0, isi)
      }));
      gPanel.append(mkn('rect', { class: 'l-ukurJarum', x: k.x, y: k.nilai - .5, width: k.w, height: 1.4 }));
      const t = mkn('text', { class: 'l-ukurNama', x: k.x + k.w / 2, y: 48 });
      t.textContent = k.huruf;
      gPanel.append(t);
    });
  }
  const batas = (v) => v < 0 ? 0 : v > 40 ? 40 : v;

  /* Baris 1230..1250: ledakan digambar dari 11 pasang (lebar, tinggi). */
  function ledakan() {
    let EX = 10 + X - (X < 11 ? -10 : 0), EY = Y + 10 - (Y < 11 ? -10 : 0);
    EX = EX + (EX > 309 ? -10 : 0); EY = EY + (EY > 189 ? -5 : 0);
    const g = mkn('g', { class: 'l-ledak' });
    D.EXPL.forEach(([a, b], i) => {
      g.append(mkn('line', { x1: EX - a, y1: EY - b, x2: EX + a, y2: EY + b / 2, style: '--i:' + i }));
      g.append(mkn('line', { x1: EX + a, y1: EY - b, x2: EX - a, y2: EY + b / 2, style: '--i:' + i }));
    });
    gEfek.append(g);
    setTimeout(() => g.remove(), 1400);
  }

  /* ======================================================================
     Bagian 7 — fisika, baris 790..860 apa adanya
     ====================================================================== */
  function majuFisika() {
    const a = ANG[(TILT || 1) - 1];
    SY = SY + GRAV - T * Math.cos(PI314 * a / 180);
    SX = 0.9 * SX + T * Math.sin(PI314 * a / 180);      // 0,9 = hambatan udara
    if (SY < -10) SY = -10;
    X = X + SX * 0.05;
    Y = Y + SY * 0.05;
    if (Y < 0) Y = 0;
    if (Y + MY > 199) Y = 199 - MY;
    if (X < 0) X = 0;
    if (X + MX > 319) X = 319 - MX;
    if (F === 0) { T = 0; return; }
    F = F - T;
    if (F < 0) {
      F = 0; T = 0;
      if (!catatanBahanBakar) { catatanBahanBakar = true; pesan('OUT OF FUEL', 'l-pesan--awas'); alarm(); }
    }
  }

  /* Baris 920..960 */
  function ujiTabrakan() {
    const ay = advan === 1 ? LAY : LY;
    if (Y > 198 - MY && BOT < 5 + X && BOT + 30 > X + MX - 5) return 'nilai';
    if (Y > 198 - MY) return 'hancur';
    for (let i = 1 + X / 4; i <= (X + MX) / 4 - 1; i++) {
      const k = Math.round(i);
      if (k >= 1 && k <= LP && (Y + MY - 6) > ay[k]) return 'hancur';
    }
    if (S < ADLAND || advan === 1) return null;
    if (Y > 185 - MY && BOT < 5 + X && BOT + 30 > X + MX - 5 && SY < 10) return 'lanjut';
    return null;
  }

  /* Baris 1120..1200 */
  function nilaiPendaratan() {
    if (SY > 15 - 6 * advan) return { jenis: 'cepat', pesan: 'ALMOST A GOOD LANDING BUT MUCH TOO FAST' };
    if (TILT !== 1) return { jenis: 'miring', pesan: 'GOOD LANDING, BUT PLEASE LAND ON 2 FEET!' };
    return { jenis: 'sempurna', pesan: 'PERFECT  LANDING !!' };
  }

  /* ======================================================================
     Bagian 8 — bunyi
     ====================================================================== */
  let waltz = null;
  function mainkanWaltz() {
    hentikanWaltz();
    if (!musik || !hidup) return;
    let i = 0;
    const langkah = () => {
      if (!hidup || !musik) return;
      const [f, d] = D.TUNE[i % 150];
      if (f < 20000) audio.sound(f, d);
      i++;
      waltz = setTimeout(langkah, d / 18.2 * 1000);
    };
    langkah();
  }
  const hentikanWaltz = () => { if (waltz) clearTimeout(waltz); waltz = null; };

  /* Baris 1290: "Stars and Stripes", potongan C..D. */
  function mainkanKemenangan(a, b) {
    if (!musik) return;
    let i = a, t = 0;
    for (; i <= b && i <= 82; i++) {
      const [f, d] = D.TUNE1[i - 1];
      if (f < 20000) setTimeout(() => audio.sound(f, d / 2), t);
      t += d / 2 / 18.2 * 1000;
    }
  }

  /* Baris 880 dan 1220: FOR K=1000 TO 2000 STEP 20: SOUND K,0.182 */
  function sirene(kali) {
    if (!musik) return;
    let t = 0;
    for (let j = 0; j < kali; j++)
      for (let k = 1000; k <= 2000; k += 20) {
        const f = k;
        setTimeout(() => audio.sound(f, 0.182), t);
        t += 10;
      }
  }
  const alarm = () => sirene(2);

  /* ======================================================================
     Bagian 9 — putaran permainan
     ====================================================================== */
  let jam = null, hz = 6;

  function ronde() {
    /* Baris 200..220 */
    F = 4000 * (1 - S / 1000); if (F < 1500) F = 1500;
    F0 = F; T = 10; SX = 30; SY = 0;
    GRAV = 10 + S / 100; if (GRAV > 15) GRAV = 15;
    X = 0; Y = 0; TILT = 1;
    advan = 0; selesai = false; bingkai = 0; catatanBahanBakar = false;
    setBenih(benih);
    bikinMedan();
    gambarTanah(); gambarKapal(); gambarPanel();
    pesan('');
    hidup = true;
    mainkanWaltz();
    perbaruiHud();
    if (!jam) mulaiJam(); else { jam.stop(); mulaiJam(); }
  }

  function masukLanjut() {
    /* Baris 3010, dengan satu perbaikan yang dijelaskan di dokumen:
       aslinya TILT=0, dan ANG(0) tidak pernah diisi. */
    advan = 1;
    X = 90; Y = 30; F = F + 1000; F0 = F; T = 11; TILT = 1; SY = 13;
    BOT = 224;
    gambarTanah(); gambarKapal(); gambarPanel();
    pesan('ADVANCED LANDER — LANDING FALL LESS THAN 10', 'l-pesan--baik');
    audio.beep();
  }

  function mulaiJam() {
    jam = window.RETRO.loop({
      hz: hz,
      update: () => {
        if (!hidup) return;
        bingkai++;
        majuFisika();
        const hasil = ujiTabrakan();
        if (hasil === 'lanjut') { masukLanjut(); return; }
        if (hasil === 'hancur') { akhiri(null); return; }
        if (hasil === 'nilai') { akhiri(nilaiPendaratan()); return; }
        gambarKapal(); gambarPanel(); perbaruiHud();
      }
    });
    jam.start();
  }

  function akhiri(hasil) {
    hidup = false; selesai = true;
    hentikanWaltz();
    if (jam) jam.stop();
    T = 0; gambarKapal(); gambarPanel();

    if (!hasil) {                                   // baris 1020
      ledakan(); sirene(3); S = Math.floor(S * 0.7);
      pesan('CRASH !!!  CRASH !!!  CRASH !!!  — YOU NEED MORE PRACTISE !!', 'l-pesan--awas');
      goyang();
    } else if (hasil.jenis === 'sempurna') {         // baris 1140
      const tambah = Math.floor(F / 30);
      S = S + tambah;
      mainkanKemenangan(1, 50);
      pesan(hasil.pesan + '  +' + tambah + ' (INT(FUEL/30))', 'l-pesan--baik');
      if (S > rekor) { rekor = S; inisial = 'You'; simpanRekor(); }
    } else if (hasil.jenis === 'cepat') {            // baris 1190
      sirene(3); S = Math.floor(S * 0.7);
      /* Baris 1190 mencetak 15-5*ADVAN, tapi baris 1120 menguji 15-6*ADVAN.
         Di ronde biasa keduanya 15; di Advanced Lander 10 lawan 9. Selisih
         itu baru ditampilkan kalau memang ada. */
      const ditulis = 15 - 5 * advan, diuji = 15 - 6 * advan;
      pesan(hasil.pesan + ' — MUST BE LESS THAN ' + ditulis +
            (ditulis === diuji ? '' : ' (yang diuji sebenarnya ' + diuji + ')'),
            'l-pesan--awas');
      goyang();
    } else {                                          // baris 1200
      sirene(3); S = Math.floor(S * 0.7);
      pesan(hasil.pesan, 'l-pesan--awas');
      goyang();
    }
    perbaruiHud();
    tombolLanjut(true);
  }

  function goyang() {
    const c = document.getElementById('crt');
    c.classList.remove('l-crt--guncang'); void c.offsetWidth;
    c.classList.add('l-crt--guncang');
  }

  /* ======================================================================
     Bagian 10 — kendali
     Baris 640-660: SATU tombol per bingkai, dan hanya empat panah.
     Baris 640 berbunyi
         IF (K$="")THEN RETURN:IF (F=0)THEN RETURN
     -- di BASIC semua yang ada sesudah THEN ikut ke dalam THEN, jadi penjaga
     kedua itu MATI: tanpa bahan bakar pun pesawat masih bisa dimiringkan.
     Dipertahankan, karena itu yang benar-benar dijalankan.
     ====================================================================== */
  function kendali(k) {
    if (!hidup) return;
    if (k === 'H') { T = T + 1; if (T > 19) T = 19; }
    else if (k === 'P') { T = T - 1; if (T < 0) T = 0; }
    else if (k === 'M') { TILT = TILT + 1; if (TILT > NANG) TILT = 1; }
    else if (k === 'K') { TILT = TILT - 1; if (TILT < 1) TILT = NANG; }
    if (F === 0) T = 0;                             // baris 850
    gambarKapal(); gambarPanel(); perbaruiHud();
  }

  document.addEventListener('keydown', (e) => {
    const p = { ArrowUp: 'H', ArrowDown: 'P', ArrowRight: 'M', ArrowLeft: 'K' }[e.key];
    if (p) { e.preventDefault(); kendali(p); }
  });

  /* ======================================================================
     Bagian 11 — antarmuka
     ====================================================================== */
  const q = (id) => document.getElementById(id);

  function pesan(s, kelas) {
    const p = q('pesan');
    p.className = 'l-pesan' + (kelas ? ' ' + kelas : '');
    p.textContent = s || '';
  }

  function perbaruiHud() {
    q('s-skor').textContent = S;
    q('s-rekor').textContent = rekor + ' (' + inisial + ')';
    q('s-fall').textContent = Math.floor(-SY);
    q('s-thrust').textContent = Math.floor(T);
    q('s-fuel').textContent = Math.floor(F);
    q('s-grav').textContent = GRAV.toFixed(2);
    q('s-tilt').textContent = ANG[(TILT || 1) - 1] + '° (' + (TILT || 1) + '/13)';
    q('s-bingkai').textContent = bingkai;
    q('s-benih').textContent = benih;
    const b = q('bar-fuel');
    b.style.width = Math.max(0, Math.min(100, 100 * F / F0)).toFixed(1) + '%';
    b.classList.toggle('l-habis', F <= 0);
    q('bar-thrust').style.width = (100 * T / 19).toFixed(1) + '%';
    q('t-lanjut').hidden = !(advan === 1);
  }

  const tombolLanjut = (tampak) => {
    q('mulai').hidden = tampak; q('ulang').hidden = !tampak;
  };

  function simpanRekor() {
    try { store.set('lander.rekor', { s: rekor, i: inisial }); } catch (e) { /* file:// */ }
  }
  (function muatRekor() {
    try {
      const v = store.get('lander.rekor');
      if (v && v.s > rekor) { rekor = v.s; inisial = v.i || 'You'; }
    } catch (e) { /* biarkan 152/You dari run/LANDER.SCR */ }
  })();

  /* --- pasang -------------------------------------------------------------- */
  q('topbar-host').append(window.RETRO.ui.topbar({
    title: 'Lunar Lander', source: 'LANDER.BAS · 8 Mar 1982 · VERSION 1.0'
  }));

  /* --- tombol -------------------------------------------------------------- */
  q('mulai').addEventListener('click', () => { tombolLanjut(false); ronde(); });
  q('ulang').addEventListener('click', () => { tombolLanjut(false); ronde(); });
  q('reset').addEventListener('click', () => {
    S = 0; tombolLanjut(false); ronde();
  });

  q('mode').addEventListener('click', (e) => {
    mode1982 = !mode1982;
    e.currentTarget.setAttribute('aria-pressed', String(mode1982));
    e.currentTarget.textContent = mode1982 ? 'Mode modern' : 'Mode 1982';
    document.getElementById('crt').classList.toggle('l-crt--1982', mode1982);
    gambarKapal();
  });

  q('gauge').addEventListener('click', (e) => {
    gauge = gauge === 1 ? 0 : 1;
    e.currentTarget.textContent = gauge === 1 ? 'Alat ukur: DIGITAL' : 'Alat ukur: ANALOG';
    gambarPanel();
  });

  q('bunyi').addEventListener('change', (e) => {
    musik = e.currentTarget.checked;
    if (musik && hidup) mainkanWaltz(); else hentikanWaltz();
  });

  q('hz').addEventListener('input', (e) => {
    hz = Number(e.currentTarget.value);
    q('hzv').textContent = hz + ' /detik';
    if (jam && hidup) { jam.stop(); mulaiJam(); }
  });

  q('waltz').addEventListener('click', () => {
    q('hz').value = 2; hz = 2;
    q('hzv').textContent = '2 /detik (jam waltz ≈ 2,32)';
    if (jam && hidup) { jam.stop(); mulaiJam(); }
  });

  q('benih').addEventListener('change', (e) => {
    setBenih(parseInt(e.currentTarget.value, 10) || 0);
    e.currentTarget.value = benih;
    /* Kalau tidak sedang terbang, medannya langsung digambar ulang supaya
       "benih yang sama = medan yang sama" bisa dilihat, bukan cuma dibaca. */
    if (!hidup) { bikinMedan(); gambarTanah(); gambarKapal(); }
    perbaruiHud();
  });

  document.querySelectorAll('[data-tombol]').forEach(b =>
    b.addEventListener('click', () => kendali(b.dataset.tombol)));

  /* --- angka yang dihitung halaman ini dari datanya sendiri ---------------- */
  (function isiBukti() {
    const tik = D.TUNE.reduce((a, n) => a + n[1], 0);
    q('b-nada').textContent = D.TUNE.length;
    q('b-tik').textContent = tik;
    q('b-detik').textContent = (tik / 18.2).toFixed(2).replace('.', ',');
    q('b-fps').textContent = (D.TUNE.length / 2 * 18.2 / tik).toFixed(2).replace('.', ',');
    q('b-sprite').textContent = Object.keys(D.SPR).length;
    q('b-sudut').textContent = ANG.join(', ');
    q('b-piksel').textContent = (() => {
      let n = 0;
      for (const k in D.SPR) for (const c of D.SPR[k]) if (c !== '0') n++;
      return n;
    })();
    /* Baris kaki modul di sprite M1 = baris terisi paling bawah. Baris 940
       menguji Y+MY-6; kalau angkanya sama, dua berkas yang berbeda setuju. */
    const m1 = D.SPR.M1;
    let barisKaki = -1;
    for (let y = 20; y >= 0; y--)
      if (/[^0]/.test(m1.slice(y * 21, y * 21 + 21))) { barisKaki = y; break; }
    q('b-kaki').textContent = barisKaki;
    q('b-rumus').textContent = MY - 6;
  })();

  /* --- siap ---------------------------------------------------------------- */
  bikinMedanLanjut();
  setBenih(benih);
  bikinMedan();
  gambarTanah(); gambarKapal(); gambarPanel(); perbaruiHud();
})();
