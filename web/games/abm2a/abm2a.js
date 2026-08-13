/* ===========================================================================
   abm2a.js — port dari ABM2A.BAS (Ed Davis, versi 18 Juli 1982).

   ------------------------------------------------------------------------
   ENAM KOTA YANG DIBELA ITU ENAM PABRIK IBM

       1070 PRINT "Your mission is to defend the IBM"
       1080 PRINT "East coast sites from the enemy."
        870 T%(1,I)=48*(I+1)
        980 …PRINT"BTV";…"FSH";…"HPN";…"MAN";…"RAL";…"BOC";

   Enam label itu bukan kota sembarangan — itu situs IBM di pantai timur
   Amerika, berurutan dari utara ke selatan, dan koordinatnya rata 48 piksel:

       x= 48  BTV  Burlington / Essex Junction, Vermont
       x= 96  FSH  East Fishkill, New York
       x=144  HPN  White Plains (Westchester), New York
       x=192  MAN  Manassas, Virginia
       x=240  RAL  Raleigh / Research Triangle Park, N. Carolina
       x=288  BOC  Boca Raton, Florida   <- tempat IBM PC dirancang

   Jadi ini Missile Command yang membela pabrik IBM sendiri, ditulis di disket
   IBM, dan sasaran paling kanan adalah tempat komputer yang menjalankannya
   dilahirkan. Bandingkan dengan ATTACK di koleksi yang sama, yang mengebom
   pabrik Apple.

   ------------------------------------------------------------------------
   HULU LEDAK BESAR MEMBUATNYA MUDAH, DAN ITU DIBAYAR DI SKOR

       230 IF ABS(M(2,I)-DX)<WH%+1 AND ABS(M(3,I)-DY)<WH% THEN …
       250 …SC=SC+(10-WH%)

   Satu angka, WH% (3..9), mengendalikan DUA hal sekaligus: ukuran kotak bunuh
   dan nilai tiap kena. Dihitung:

       WH%  skor  kotak bunuh  luas
        3     7      7 x 5       35
        5     5     11 x 9       99
        9     1     19 x 17     323

   Hulu ledak terbesar memberi luas 9,2 kali lipat dengan imbalan sepertujuh.
   Petunjuknya menyebutnya "9=WOW! (CHICKEN)".

   ------------------------------------------------------------------------
   HANDICAP ITU MELEWATI BINGKAI, BUKAN MENGUBAH KECEPATAN

       260 IF CT%<RS% THEN CT%=CT%+1:GOTO 70

   RS% (0..5) bukan pengali kecepatan — ia mencacah berapa bingkai MASUKAN yang
   lewat sebelum rudal musuh maju satu langkah. RS%=0 berarti musuh maju tiap
   bingkai ("MISSION-IMPOSSIBLE"); RS%=5 berarti tiap enam bingkai ("JUNIOR").

   Dan baris 1470 menguranginya satu tiap kali Anda menang: permainannya naik
   tingkat sendiri sampai mustahil.

   ------------------------------------------------------------------------
   SATU PERSEN YANG HILANG: `FLAG` BUKAN `FLAG%`

       400 FLAG=-1:N=0:PT%=M(1,MIRV%):TT%=PT%+1
       440 IF N<4 THEN FLAG%=-1:GOTO 410

   Baris 400 menyetel `FLAG` — tanpa tanda persen. Di BASIC itu variabel yang
   BERBEDA dari `FLAG%`, dan ia tidak pernah dibaca di mana pun. Yang
   menyelamatkan programnya cuma kebetulan: baris 440 menyetel `FLAG%` yang
   benar saat N<4, jadi sesudah gelung MIRV selesai nilainya sudah -1 dan
   baris 340 tidak mengulanginya.

   ------------------------------------------------------------------------
   `DRAW` DIPAKAI SEBAGAI BAHASA BERSUBRUTIN

       920 CT$ ="U2R4U18R7D8R3D3R3U9R3D7R5D4R3D5R5D2"
       950 PSET(0,180):DRAW "R32;X"+VARPTR$(CT2$)+"R16;X"+VARPTR$(CT$)
       960 DRAW "R16;X"+VARPTR$(CT3$)+"…X"+VARPTR$(CT$)+"…"

   Perintah `X` di dalam makro DRAW MENJALANKAN string lain, dan `VARPTR$`
   memberi alamatnya. Jadi cakrawala kotanya disusun dari TIGA cetakan gedung
   yang dipanggil berulang — pemakaian ulang di dalam bahasa makro, di sebuah
   program 1982.

   FLYS memakai DRAW untuk membuat sprite; ABM2A memakai kemampuan
   memanggilnya.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();
  const $ = (id) => document.getElementById(id);
  const db = store('abm2a');

  /* Layar SCREEN 1: 320x200. viewBox 2x untuk ketajaman garis. */
  const W = 320, H = 200, S = 2;
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const e = document.createElementNS(NS, t);
    if (a) for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };
  const bunyi = (f, t) => { if ($('bunyi').checked) audio.sound(f, t); };

  /* --- sasaran, baris 860-880 & 980 -------------------------------------- */
  const SITUS = [
    { kode: 'BTV', x: 48,  nama: 'Burlington / Essex Junction, Vermont' },
    { kode: 'FSH', x: 96,  nama: 'East Fishkill, New York' },
    { kode: 'HPN', x: 144, nama: 'White Plains (Westchester), New York' },
    { kode: 'MAN', x: 192, nama: 'Manassas, Virginia' },
    { kode: 'RAL', x: 240, nama: 'Raleigh / Research Triangle Park, N. Carolina' },
    { kode: 'BOC', x: 288, nama: 'Boca Raton, Florida — tempat IBM PC dirancang' }
  ];

  /* --- keadaan ------------------------------------------------------------ */
  let hidup = [1, 1, 1, 1, 1, 1];          // T%(0,I)
  let M = [];                              // M(0..6, 0..15)
  let RS = 3, WH = 4, SC = 0, HSC = db.get('rekor', 0);
  let X = 100, SY = 100;                   // bidikan
  let ABM = 0, RR = 0, DX = 0, DY = 0;     // ledakan ABM
  let CT = 0, FLAG = 0, MR = 16;
  let main = false, acak = rng(1), benih = 0;
  let hz = 30;
  let gelung = { start() {}, stop() {} };

  const svg = $('svg');
  let gLangit, gKota, gRudal, gABM, gBidik, gEfek, gTeks;

  (function defs() {
    const d = mkn('defs');
    [['glangit', ['#0a1230', 0], ['#1a2a55', .55], ['#3a2a55', 1]],
     ['gkota', ['#4f6f9a', 0], ['#2a3c58', .6], ['#141d2c', 1]]
    ].forEach(([id, ...st]) => {
      const g = mkn('linearGradient', { id, x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
      st.forEach(([c, o]) => g.append(mkn('stop', { offset: o, 'stop-color': c })));
      d.append(g);
    });
    const f = mkn('filter', { id: 'aglow', x: '-70%', y: '-70%', width: '240%', height: '240%' });
    f.append(mkn('feGaussianBlur', { stdDeviation: 3.5, result: 'b' }));
    const m = mkn('feMerge');
    m.append(mkn('feMergeNode', { in: 'b' }), mkn('feMergeNode', { in: 'SourceGraphic' }));
    f.append(m); d.append(f); svg.append(d);
  })();

  gLangit = mkn('g'); gKota = mkn('g'); gRudal = mkn('g');
  gABM = mkn('g'); gEfek = mkn('g'); gBidik = mkn('g'); gTeks = mkn('g');
  svg.append(gLangit, gKota, gRudal, gABM, gEfek, gBidik, gTeks);

  const BINTANG = (function () {
    const r = rng(70982), b = [];
    for (let i = 0; i < 90; i++)
      b.push({ x: r.next() * W, y: r.next() * 150, s: .4 + r.next() * .9,
               o: .15 + r.next() * .5 });
    return b;
  })();

  /* --- rupa ---------------------------------------------------------------- */
  const DASAR = 185;                 // permukaan tanah, satuan piksel CGA
  const PX = 168, PY = 174;          // sumbu putar meriam; muzzle di (168,160)

  /* --- meriam ABM ---------------------------------------------------------
     Aslinya tidak digambar sama sekali: baris 150 cuma menarik garis dari
     (168,160) ke titik ledakan, dan tidak ada satu pun piksel peluncur di
     layar. Jadi bentuk ini SELURUHNYA tambahan — tapi titik asalnya bukan:
     x=168 diambil dari baris 150 dan tidak boleh bergeser.

     Larasnya mengikuti bidikan. Itu bukan sekadar hiasan: ia memperlihatkan
     lintasan yang memang akan ditempuh baris 150, sebelum tombolnya ditekan. */
  function meriamGambar() {
    const g = mkn('g', { class: 'a-meriam' });

    /* bunker: trapesium dengan pita peringatan */
    g.append(mkn('path', { class: 'a-bunker',
      d: 'M' + (PX - 11) + ' ' + DASAR + ' L' + (PX - 8) + ' ' + (PY + 2) +
         ' L' + (PX + 8) + ' ' + (PY + 2) + ' L' + (PX + 11) + ' ' + DASAR + ' Z' }));
    for (let k = 0; k < 4; k++) {
      g.append(mkn('rect', { class: 'a-pita', x: PX - 8 + k * 4.2, y: DASAR - 4,
                             width: 2.2, height: 3.2 }));
    }

    /* laras, berputar mengikuti bidikan */
    const tx = X + 10, ty = SY + 10;
    const sudut = Math.atan2(tx - PX, -(ty - PY)) * 180 / Math.PI;
    const laras = mkn('g', { transform: 'rotate(' + sudut.toFixed(2) + ' ' + PX + ' ' + PY + ')' });
    laras.append(mkn('rect', { class: 'a-laras', x: PX - 2.4, y: PY - 16,
                               width: 4.8, height: 17, rx: 1.6 }));
    laras.append(mkn('rect', { class: 'a-muzzle', x: PX - 3.2, y: PY - 17.5,
                               width: 6.4, height: 2.6, rx: 1 }));
    if (kilat > 0) {
      laras.append(mkn('path', { class: 'a-kilat',
        d: 'M' + (PX - 4) + ' ' + (PY - 17) + ' L' + PX + ' ' + (PY - 26) +
           ' L' + (PX + 4) + ' ' + (PY - 17) + ' Z' }));
    }
    g.append(laras);

    /* kubah turret di atas sumbu putar, digambar SESUDAH laras supaya
       pangkalnya tertutup rapi di sudut mana pun */
    g.append(mkn('path', { class: 'a-turret',
      d: 'M' + (PX - 7) + ' ' + (PY + 2) + ' A7 7 0 0 1 ' + (PX + 7) + ' ' + (PY + 2) + ' Z' }));
    g.append(mkn('circle', { class: 'a-poros', cx: PX, cy: PY, r: 1.8 }));

    /* piringan radar yang menyapu — satu-satunya bagian yang bergerak sendiri */
    /* Tiang radar ditarik ke dalam (PX+7, jari-jari 3) supaya seluruh DASAR
       meriam berhenti di x=179 — satu satuan sebelum cakrawala MAN yang mulai
       di 180. Versi pertama memakai PX+9 dengan jari-jari 3,4 dan piringannya
       menjorok 0,4 satuan ke atas atap. */
    g.append(mkn('line', { class: 'a-tiang', x1: PX + 7, y1: DASAR, x2: PX + 7, y2: PY - 2 }));
    g.append(mkn('ellipse', { class: 'a-radar', cx: PX + 7, cy: PY - 3.5, rx: 3, ry: 1.4 }));
    return g;
  }

  let kilat = 0;

  function kotaGambar(i, rusak) {
    const px = SITUS[i].x;
    const g = mkn('g', { class: 'a-kota' + (rusak ? ' a-kota--rusak' : '') });
    if (rusak) {
      g.append(mkn('path', { class: 'a-puing',
        d: 'M' + (px - 12) + ' ' + DASAR + ' L' + (px - 8) + ' ' + (DASAR - 9) +
           ' L' + (px - 4) + ' ' + (DASAR - 3) + ' L' + (px + 1) + ' ' + (DASAR - 12) +
           ' L' + (px + 6) + ' ' + (DASAR - 4) + ' L' + (px + 11) + ' ' + DASAR + ' Z' }));
      return g;
    }
    /* Cakrawala: tiga cetakan gedung yang dipakai ulang, meniru cara baris
       950-960 memanggil CT$/CT2$/CT3$ lewat perintah X di makro DRAW.

       Lebarnya dibatasi +-12 dengan alasan yang bisa dihitung, bukan selera:
       peluncur ABM tetap di x=168 (baris 150), dan 168 adalah TITIK TENGAH
       persis antara HPN (144) dan MAN (192). Dengan setengah lebar cakrawala 12
       dan setengah lebar peluncur 11, sisanya sela 2 satuan di kiri dan 1 di
       kanan — cukup supaya tidak ada yang bertumpuk. Versi pertama memakai +-19
       dan peluncurnya menimpa gedung di kedua sisi; dilaporkan pemilik koleksi. */
    const TINGGI = [[26, 38, 22, 30], [20, 34, 44, 28], [32, 18, 40, 24]][i % 3];
    TINGGI.forEach((t, k) => {
      const bx = px - 12 + k * 6;
      g.append(mkn('rect', { class: 'a-gedung', x: bx, y: DASAR - t,
                             width: 5, height: t }));
      for (let jy = DASAR - t + 3; jy < DASAR - 3; jy += 5) {
        g.append(mkn('rect', { class: 'a-jendela', x: bx + 1, y: jy,
                               width: 1.4, height: 2 }));
        g.append(mkn('rect', { class: 'a-jendela', x: bx + 2.8, y: jy,
                               width: 1.4, height: 2 }));
      }
    });
    return g;
  }

  function gambar() {
    gLangit.textContent = '';
    gLangit.append(mkn('rect', { class: 'a-langit', x: 0, y: 0, width: W, height: H }));
    for (const b of BINTANG)
      gLangit.append(mkn('circle', { class: 'a-bintang', cx: b.x, cy: b.y, r: b.s,
                                     opacity: b.o }));
    gLangit.append(mkn('rect', { class: 'a-tanah', x: 0, y: DASAR, width: W, height: H - DASAR }));

    gKota.textContent = '';
    for (let i = 0; i < 6; i++) {
      gKota.append(kotaGambar(i, !hidup[i]));
      const t = mkn('text', { class: 'a-label' + (hidup[i] ? '' : ' a-label--mati'),
                              x: SITUS[i].x, y: DASAR + 10, 'text-anchor': 'middle' });
      t.textContent = SITUS[i].kode;
      gKota.append(t);
    }
    gKota.append(meriamGambar());

    gRudal.textContent = '';
    for (const m of M) {
      if (m.aktif !== 1) continue;
      gRudal.append(mkn('line', { class: 'a-jejak', x1: m.x0, y1: m.y0, x2: m.x, y2: m.y }));
      gRudal.append(mkn('circle', { class: 'a-hulu', cx: m.x, cy: m.y, r: 1.6 }));
    }

    gABM.textContent = '';
    if (ABM) {
      /* Baris 150 menarik garis dari (168,160). Di sini pangkalnya digeser ke
         UJUNG LARAS supaya sambung dengan meriamnya — murni rupa: yang
         menentukan aturan cuma DX,DY, dan itu tidak disentuh. */
      gABM.append(mkn('line', { class: 'a-abm', x1: PX, y1: PY - 17, x2: DX, y2: DY }));
      gABM.append(mkn('circle', { class: 'a-ledak', cx: DX, cy: DY, r: RR }));
    }

    gBidik.textContent = '';
    const b = mkn('g', { class: 'a-bidik' });
    b.append(mkn('circle', { cx: X + 10, cy: SY + 10, r: 5 }));
    b.append(mkn('line', { x1: X, y1: SY + 10, x2: X + 5, y2: SY + 10 }));
    b.append(mkn('line', { x1: X + 15, y1: SY + 10, x2: X + 20, y2: SY + 10 }));
    b.append(mkn('line', { x1: X + 10, y1: SY, x2: X + 10, y2: SY + 5 }));
    b.append(mkn('line', { x1: X + 10, y1: SY + 15, x2: X + 10, y2: SY + 20 }));
    gBidik.append(b);

    /* Baris 1,3 aslinya dipakai untuk pesan; skor dan kota tersisa
       ditampilkan DI DALAM layar sejak versi pertama. */
    gTeks.textContent = '';
    const st = mkn('text', { class: 'a-status', x: 4, y: 10, 'xml:space': 'preserve' });
    st.textContent = 'SCORE ' + SC + '   HI ' + HSC + '   WARHEAD ' + WH +
                     '   SITES ' + hidup.reduce((a, b2) => a + b2, 0) + '/6';
    gTeks.append(st);
    if (pesanBesar) {
      const t = mkn('text', { class: 'a-besar', x: W / 2, y: 92, 'text-anchor': 'middle' });
      t.textContent = pesanBesar;
      gTeks.append(t);
    }
  }

  let pesanBesar = '';
  const pesan = (t) => { $('pesan').textContent = t || ''; };

  function papan() {
    $('s-skor').textContent = SC;
    $('s-rekor').textContent = HSC;
    $('s-situs').textContent = hidup.reduce((a, b) => a + b, 0) + ' / 6';
    $('s-hulu').textContent = WH + ' (skor ' + (10 - WH) + ')';
    $('s-handicap').textContent = RS;
    $('s-sisa').textContent = M.filter(m => m.aktif === 2).length;
    for (let i = 0; i < 6; i++)
      $('kota-' + i).classList.toggle('a-mati', !hidup[i]);
  }

  /* --- baris 660-750: siapkan 12 rudal ------------------------------------ */
  function siapkanRudal() {
    M = [];
    for (let i = 0; i < 16; i++)
      M.push({ aktif: 0, target: 0, x: 0, y: 0, dx: 0, x0: 0, y0: 0 });
    for (let i = 0; i <= 11; i++) {                          // 660-680
      M[i].aktif = 2;
      M[i].x0 = Math.floor(acak.next() * 280) + 20;
      M[i].x = M[i].x0; M[i].y0 = 0; M[i].y = 0;
    }
    for (let i = 0; i <= 11; i++) {                          // 690-720
      const ii = i > 5 ? i - 6 : i;
      M[i].dx = (SITUS[ii].x - M[i].x0) / 160;
      M[i].target = ii;
    }
    M[0].aktif = 1;                                          // 730
    MR = 16;                                                 // 740
  }

  /* --- satu bingkai masukan ------------------------------------------------ */
  function langkah() {
    if (ABM) {                                               // 170-250
      if (kilat > 0) kilat -= 1;
      RR += 1;
      if (RR >= 11) selesaiLedakan();
      gambar();
      return;
    }
    if (CT < RS) { CT += 1; gambar(); return; }              // 260
    CT = 0;
    majuRudal();
    gambar(); papan();
  }

  function selesaiLedakan() {                                // 190-250
    ABM = 0;
    let kena = 0;
    for (let i = 0; i <= 15; i++) {                          // 200-240
      const m = M[i];
      if (m.aktif !== 1) continue;
      if (Math.abs(m.x - DX) < WH + 1 && Math.abs(m.y - DY) < WH) {   // 230
        m.aktif = 0;
        SC += 10 - WH;                                       // 250
        kena += 1;
        letusan(m.x, m.y, '+' + (10 - WH));
      }
    }
    if (kena) audio.play('MBL16O0DCAB', { fresh: true }).catch(() => {});  // 230
    papan();
  }

  function majuRudal() {                                     // 280-390
    let N = 0;
    for (let i = 0; i <= 15; i++) {
      const m = M[i];
      if (m.aktif !== 1) { N += 1; continue; }               // 290
      m.x += m.dx; m.y += 1;                                 // 300
      if (m.y > 159) { hantamKota(i); continue; }            // 310
      if (m.y > 70 && FLAG === 0) {                          // 320
        FLAG = 123; mirv(i); bunyi(50, 2);
      }
    }
    if (MR === 0 && N > 15) return menang();                 // 330

    if (acak.next() < 0.96) return;                          // 350
    for (let i = 1; i <= 11; i++) {                          // 360-390
      if (M[i].aktif === 2) { M[i].aktif = 1; return; }
      if (i === 11) { MR = 0; pesan('ENEMY HAS LAUNCHED ALL MISSLES'); }
    }
  }

  /* --- baris 400-450: MIRV ------------------------------------------------- */
  function mirv(src) {
    let TT = M[src].target + 1;
    for (let n = 1; n <= 4; n++) {
      TT += 1; if (TT > 5) TT -= 6;                          // 410
      const i = n + 11;                                      // 420
      M[i].aktif = 1; M[i].target = TT;
      M[i].x = M[src].x; M[i].y = M[src].y;
      M[i].x0 = M[i].x; M[i].y0 = M[i].y;
      M[i].dx = (SITUS[TT].x - M[i].x0) / 90;                // 430
    }
    FLAG = -1;                                               // 440
  }

  /* --- baris 460-530: rudal meledak di tanah ------------------------------ */
  function hantamKota(i) {
    const m = M[i];
    for (let r = 6; r <= 36; r += 6) bunyi(36 + 3 * r, 1);   // 470-490
    hidup[m.target] = 0;                                     // 500
    m.aktif = 0;                                             // 510
    letusan(m.x, 160, SITUS[m.target].kode + ' HANCUR', true);
    guncang();
    papan();
    if (hidup.every(h => !h)) kalah();                       // 520-540
  }

  /* --- akhir --------------------------------------------------------------- */
  function kalah() {                                         // 550-640
    main = false; gelung.stop(); kb.captureScroll(false);
    if (SC > HSC) { HSC = SC; db.set('rekor', HSC); }
    pesanBesar = 'YOU SHOULD BE DEMOTED!';
    gambar(); papan();
    pesan('Semua situs hancur. Skor ' + SC + '. Rekor hari ini ' + HSC + '.');
    $('mulai').disabled = false; $('mulai').textContent = 'Main lagi';
  }

  function menang() {                                        // 1370-1580
    main = false; gelung.stop(); kb.captureScroll(false);
    const tersisa = hidup.reduce((a, b) => a + b, 0);        // 1380
    SC += 50;                                                // 1440
    if (SC > HSC) { HSC = SC; db.set('rekor', HSC); }
    RS = Math.max(0, RS - 1);                                // 1470
    $('handicap').value = String(RS);
    pesanBesar = 'CONGRATULATIONS!';
    gambar(); papan();
    audio.play('MBCDEFAB', { fresh: true }).catch(() => {}); // 1400
    pesan(tersisa + ' situs IBM bertahan. Skor ' + SC +
          '. Handicap musuh sekarang ' + RS + ' — makin sulit tiap menang.');
    $('mulai').disabled = false; $('mulai').textContent = 'Ronde berikutnya';
  }

  /* --- efek ---------------------------------------------------------------- */
  function letusan(x, y, label, besar) {
    const c = mkn('circle', { class: 'a-letus' + (besar ? ' a-letus--besar' : ''),
                              cx: x, cy: y, r: 3 });
    gEfek.append(c);
    c.addEventListener('animationend', () => c.remove());
    setTimeout(() => c.remove(), 900);
    if (label) {
      const t = mkn('text', { class: 'a-angka', x, y, 'text-anchor': 'middle' });
      t.textContent = label;
      gEfek.append(t);
      t.addEventListener('animationend', () => t.remove());
      setTimeout(() => t.remove(), 1400);
    }
    while (gEfek.childElementCount > 26) gEfek.firstChild.remove();
  }

  let gT = 0;
  function guncang() {
    const el = $('crt');
    el.classList.remove('a-crt--guncang'); void el.offsetWidth;
    el.classList.add('a-crt--guncang');
    clearTimeout(gT);
    gT = setTimeout(() => el.classList.remove('a-crt--guncang'), 400);
  }

  /* --- kendali, baris 1600-1730 -------------------------------------------- */
  function bidik(dx, dy) {
    if (!main) return;
    X = Math.min(298, Math.max(5, X + dx));                  // 1680-1710
    SY = Math.min(150, Math.max(1, SY + dy));                // 1640-1670
    gambar();
  }

  function tembak() {                                        // 1720 -> 130-160
    if (!main || ABM) return;
    DX = X + 10; DY = SY + 10;                               // 150
    ABM = 1; RR = 1; kilat = 3;
    bunyi(400, 1);
    gambar();
  }

  kb.on('*', (e) => {
    if (!main) return;
    const k = e.key;
    if (k === 'ArrowUp') { e.raw.preventDefault(); bidik(0, -10); }        // H
    else if (k === 'ArrowDown') { e.raw.preventDefault(); bidik(0, 10); }  // P
    else if (k === 'ArrowRight') { e.raw.preventDefault(); bidik(10, 0); } // M
    else if (k === 'ArrowLeft') { e.raw.preventDefault(); bidik(-10, 0); } // K
    else if (k === 'Escape' || k === ' ') { e.raw.preventDefault(); tembak(); }
  });

  /* --- mulai ---------------------------------------------------------------- */
  function mulai() {
    RS = +$('handicap').value;
    WH = +$('hulu').value;
    $('hulu').dispatchEvent(new Event('input'));   // keterangan kotak bunuh ikut segar
    benih = new Date().getSeconds();                         // 800
    acak = rng(benih);
    $('s-benih').textContent = benih;

    hidup = [1, 1, 1, 1, 1, 1];
    SC = 0; X = 100; SY = 100; ABM = 0; RR = 0; CT = 0; FLAG = 0;
    pesanBesar = '';
    gEfek.textContent = '';
    siapkanRudal();
    main = true;
    pesan('');
    $('mulai').disabled = true;
    kb.captureScroll(true);
    gelung.stop();
    gelung = loop({ hz, update: () => { if (main) langkah(); } });
    gelung.start();
    gambar(); papan();
  }

  /* --- pasang --------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: 'ABM 2', source: 'ABM2A.BAS · Ed Davis · 18 Juli 1982'
  }));

  $('mulai').addEventListener('click', mulai);
  $('mode').addEventListener('click', () => {});
  [['b-kiri', () => bidik(-10, 0)], ['b-kanan', () => bidik(10, 0)],
   ['b-atas', () => bidik(0, -10)], ['b-bawah', () => bidik(0, 10)],
   ['b-tembak', tembak]].forEach(([id, fn]) => $(id).addEventListener('click', fn));
  $('hz').addEventListener('input', (e) => {
    hz = +e.target.value; $('hzv').textContent = hz + '/dtk';
    if (main) { gelung.stop(); gelung = loop({ hz, update: () => { if (main) langkah(); } }); gelung.start(); }
  });
  $('hulu').addEventListener('input', () => {
    const w = +$('hulu').value;
    $('hulu-info').textContent = 'kotak bunuh ' + (2 * (w + 1) - 1) + '×' + (2 * w - 1) +
                                ' piksel, skor ' + (10 - w) + ' per kena';
  });
  $('hulu').dispatchEvent(new Event('input'));
  $('hzv').textContent = hz + '/dtk';

  /* Daftar situs diisi dari datanya, bukan diketik di HTML. */
  const ul = $('daftar-situs');
  SITUS.forEach((s, i) => {
    const li = ui.el('li', { id: 'kota-' + i });
    li.append(ui.el('b', { class: 'mono', text: s.kode }),
              ui.el('span', { text: ' x=' + s.x + ' — ' + s.nama }));
    ul.append(li);
  });

  siapkanRudal();
  gambar(); papan();
  pesan('Pilih hulu ledak dan handicap, lalu Mulai. Panah menggeser bidikan, Spasi/Esc menembak.');
})();
