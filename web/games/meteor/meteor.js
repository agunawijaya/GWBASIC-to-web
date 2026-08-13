/* ===========================================================================
   meteor.js — port dari METEOR.BAS (Edward T. Ordman, November 1981;
   terbit di Creative Computing Vol. 8 No. 8, hlm. 178-185).

   ------------------------------------------------------------------------
   SELURUH DUNIANYA ADA DI LAYAR

   Cari larik sasaran di 80 baris program itu. Tidak ada — tidak ada larik apa
   pun. Baloknya cuma aksara yang tercetak, dan SATU-SATUNYA cara program tahu
   ada balok di suatu tempat adalah menanyakannya kembali:

       370 IF SCREEN(Y,X)=219 THEN C2=-1:SOUND 660,2:GOSUB 740   ' meteor
       700 IF SCREEN(HY,HX)=219 THEN SOUND 440,1:C2=10:GOSUB 740 ' pemain
       710 IF SCREEN(HY,HX)=25  THEN SOUND 420,1:C2=2 :GOSUB 740 ' pemain

   Meteornya dan pemainnya memakai pertanyaan yang sama persis. Dan karena
   menggambar sekaligus menyimpan, MENGHAPUS BERARTI MENGHANCURKAN: wajah yang
   melewati balok menimpanya dengan CHR$(2), dan balok itu lenyap dari satu-
   satunya tempat ia pernah ada. Itulah "mengikis" yang jadi aturan mainnya.

   Port ini meniru strukturnya: ada petak 25x80 berisi kode aksara, `set()`
   satu-satunya penulis, `at()` satu-satunya pembaca, dan tabrakan dihitung
   dengan menanyakan petak — bukan dengan daftar objek.

   Dan karena di aslinya `LOCATE:PRINT` adalah SATU tindakan yang sekaligus
   menyimpan dan menggambar, di sini `set()` juga begitu: ia mengubah petak DAN
   memperbarui simpul SVG selnya. Tidak ada langkah "gambar ulang semuanya".

   ------------------------------------------------------------------------
   BENIH ACAK YANG DIADUK SELAMA ANDA BERPIKIR

       150 ... R=523                                     ' benih awal
       160 R$=INKEY$:IF R$="Y" THEN GOSUB 930:GOTO 180
       170 IF R$="N" OR R$=CHR$(13) THEN 180 ELSE R=(R+511)MOD 32003:GOTO 160
       180 RANDOMIZE R

   Selagi menunggu jawaban, program terus memutar benihnya. Yang menentukan
   benih akhirnya adalah BERAPA LAMA PEMAIN BERPIKIR.

   Dihitung, bukan ditaksir: 32003 bilangan prima dan gcd(511,32003)=1, jadi
   orbitnya melingkupi SELURUH 32.003 nilai. Bandingkan dengan pola yang dipakai
   27 dari 35 program berpenyemai di koleksi ini — `RANDOMIZE
   VAL(RIGHT$(TIME$,2))` — yang cuma punya 60.

   ------------------------------------------------------------------------
   KENDALI SELOT, BUKAN TOMBOL DITAHAN

       340 K$=INKEY$:IF K$<>"" THEN H$=K$        ' H$ IS LATCH
       350 IF LEN(H$)>0 THEN GOSUB 570
       590 IF LEN(H$)=1 THEN H$="":RETURN        ' aksara biasa -> berhenti
       630 IF HH=77 THEN HX=HX+1:H$=K$:...       ' panah -> pasang lagi

   Tombol panah menghasilkan DUA aksara (CHR$(0) + kode pindaian), aksara biasa
   satu. Jadi panah memasang ulang selotnya dan wajah terus berjalan; apa pun
   yang lain mengosongkannya dan wajah berhenti. Itu sebabnya petunjuk aslinya
   berbunyi "ANY LETTER (AND SOME OTHER KEYS) WILL STOP CURSOR MOTION".

   Konsekuensinya untuk port: WASD TIDAK BOLEH ditambahkan sebagai arah, karena
   di permainan ini huruf punya tugas — menghentikan. Menambahkannya akan
   menghapus separuh kendalinya.

   Tepinya tidak simetris, dan itu ada di kodenya: kiri/kanan membungkus lalu
   memasang selot lagi (630/650); atas/bawah di baris 1 dan 24 TIDAK memasang
   selot, jadi wajah yang menyentuh tepi atas/bawah berhenti sendiri.

   ------------------------------------------------------------------------
   SATU SEL LAYAR YANG MELAHIRKAN TIGA TAMBALAN

       375 IF Y=24 AND X=80 THEN X=79   ' meteor
       690 IF HX=80 AND HY=24 THEN HY=23 ' wajah
       460 HX=HX-4:IF HX>72 THEN HX=72   ' pesan BANG (8 aksara, jadi <=79)

   Menulis ke sel pojok kanan-bawah memicu gulir di BASIC. Tiga baris dari 80
   ada semata-mata untuk menghindari satu sel itu.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();
  const $ = (id) => document.getElementById(id);
  const db = store('meteor');

  const KOL = 80, BARIS = 25;
  const SEL_W = 10, SEL_H = 16;

  /* Kode aksara CP437, apa adanya dari baris 120 dan 140. */
  const KOSONG = 32;
  const WAJAH = 2;      // M$ = CHR$(2)   ☻
  const PANAH = 25;     // X$ = CHR$(25)  ↓
  const BALOK = 219;    // C$ = CHR$(219) █
  const ARSIR = 178;    // Y  = 178       ▓
  const ARS = String.fromCharCode(ARSIR);

  const NS = 'http://www.w3.org/2000/svg';
  function mkn(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  /* `el.hidden = true` tidak bekerja pada elemen SVG — `hidden` properti IDL
     milik HTMLElement saja. Menyetel ATRIBUT-nya bekerja untuk keduanya.
     (Cacat yang sama pernah membuat dua penampil SERPENT muncul sekaligus.) */
  const sembunyikan = (el, ya) => {
    if (ya) el.setAttribute('hidden', ''); else el.removeAttribute('hidden');
  };

  const bunyi = (f, t) => { if ($('bunyi').checked) audio.sound(f, t); };

  /* --- petak: satu-satunya tempat dunia ini hidup ------------------------- */
  const layar = new Int16Array(KOL * BARIS).fill(KOSONG);
  const simpul = new Array(KOL * BARIS).fill(null);
  let gSel = null;

  const idx = (y, x) => (y - 1) * KOL + (x - 1);
  const luar = (y, x) => y < 1 || y > BARIS || x < 1 || x > KOL;

  /** Padanan `SCREEN(y,x)`. Satu-satunya pembaca. */
  const at = (y, x) => luar(y, x) ? undefined : layar[idx(y, x)];

  /** Padanan `LOCATE y,x : PRINT chr$`. Satu-satunya penulis — dan seperti
      aslinya, ia menyimpan DAN menggambar dalam satu tindakan. */
  function set(y, x, k) {
    if (luar(y, x)) return;
    const i = idx(y, x);
    if (layar[i] === k) return;
    layar[i] = k;
    if (simpul[i]) { simpul[i].remove(); simpul[i] = null; }
    const n = selSvg(y, x, k);
    if (n) { gSel.append(n); simpul[i] = n; }
  }

  /** Padanan `LOCATE y,x: PRINT s$;` */
  function tulis(y, x, s) {
    for (let i = 0; i < s.length; i++) set(y, x + i, s.charCodeAt(i));
  }

  function kosongkan() {
    layar.fill(KOSONG);
    for (let i = 0; i < simpul.length; i++) {
      if (simpul[i]) { simpul[i].remove(); simpul[i] = null; }
    }
  }

  /* --- rupa satu sel ------------------------------------------------------ */
  function selSvg(y, x, k) {
    if (k === KOSONG) return null;
    const px = (x - 1) * SEL_W, py = (y - 1) * SEL_H;
    const cx = px + SEL_W / 2, cy = py + SEL_H / 2;

    if (k === BALOK) {
      const g = mkn('g', { class: 'm-balok' });
      g.append(mkn('rect', { x: px + .4, y: py + .6, width: SEL_W - .8,
                             height: SEL_H - 1.2, rx: 1.6, class: 'm-balok__isi' }));
      g.append(mkn('rect', { x: px + 1.7, y: py + 2, width: SEL_W - 3.4,
                             height: 2.4, rx: 1.2, class: 'm-balok__kilap' }));
      return g;
    }
    if (k === PANAH) {
      return mkn('path', { class: 'm-panah',
        d: 'M' + (cx - 2.6) + ' ' + (cy - 3.2) + ' L' + cx + ' ' + (cy + 3.6) +
           ' L' + (cx + 2.6) + ' ' + (cy - 3.2) });
    }
    if (k === WAJAH) {
      const g = mkn('g', { class: 'm-wajah',
                           transform: 'translate(' + cx + ' ' + cy + ')' });
      g.append(mkn('circle', { class: 'm-wajah__kepala', cx: 0, cy: 0, r: 5.2 }));
      g.append(mkn('circle', { class: 'm-wajah__mata', cx: -1.9, cy: -1.5, r: .95 }));
      g.append(mkn('circle', { class: 'm-wajah__mata', cx: 1.9, cy: -1.5, r: .95 }));
      g.append(mkn('path', { class: 'm-wajah__mulut', d: 'M-2.5 1.3 q2.5 2.5 5 0' }));
      return g;
    }
    /* Sisanya — arsiran ▓ dan huruf "BANG" — digambar sebagai aksara. Perlu
       ada, karena baris 500 memang MENULIS pesan itu ke petak layar, sama
       seperti benda lain. Pesannya bukan lapisan di atas dunia; ia bagian
       dari dunia, dan meteor berikutnya bisa menimpanya. */
    const t = mkn('text', { class: k === ARSIR ? 'm-arsir' : 'm-huruf',
                            x: cx, y: cy, 'text-anchor': 'middle',
                            'dominant-baseline': 'central' });
    t.textContent = String.fromCharCode(k);
    return t;
  }

  /* --- tampilan glif ------------------------------------------------------ */
  function gambarGlif() {
    let s = '';
    for (let y = 1; y <= BARIS; y++) {
      for (let x = 1; x <= KOL; x++) s += String.fromCharCode(layar[idx(y, x)]);
      s += '\n';
    }
    $('glif').textContent = s;
  }

  /* ======================================================================= */

  let acak = rng(1);
  let hx = 1, hy = 1;                         // HX, HY
  let skor = 0;                               // T
  let kesulitan = 5;                          // C
  let selot = null;                           // H$
  let main = false, jeda = false;

  /* Meteor: satu garis dari (X1,1) ke (X2,24), sebaris per langkah simulasi.
     Baris 400-430 adalah penggambar garis DDA klasik. */
  let ms0 = 0, ms = 0, my = 99;

  function meteorBaru() {                     // baris 290
    const x1 = Math.floor(acak.next() * 80 + 1);
    const x2 = Math.floor(acak.next() * 80 + 1);
    ms0 = (x2 - x1) / (24 - 1);               // 400: S0=(X2-X1)/(Y2-Y1)
    ms = x1 - ms0;                            // 400: S=X1-S0
    my = 1;                                   // 410: FOR Y=Y1 TO Y2
    jejakLalu = null;
  }

  /* --- baris 840-920: pasang sasaran dan wajah ---------------------------- */
  function pasangSasaran() {
    /* 860 FOR I=12-C TO 24-C
       870 LOCATE I,15:PRINT C5$;:LOCATE I,35:PRINT C5$;:LOCATE I,55:PRINT C5$;
       C5$ = lima █. Kesulitan TIDAK mengubah kecepatan apa pun — ia menggeser
       ladang baloknya ke ATAS. Lihat panel "Kesulitan yang menggeser". */
    for (let i = 12 - kesulitan; i <= 24 - kesulitan; i++) {
      for (const kol of [15, 35, 55]) {
        for (let k = 0; k < 5; k++) set(i, kol + k, BALOK);
      }
    }
    set(hy, hx, WAJAH);                                          // 900
    barisBantuan('     HIT SPACE BAR TO PAUSE                  ');  // 910
  }

  /* Baris 910 dan 520 sama-sama 45 aksara dari kolom 35 — berhenti tepat di
     kolom 79. Dipotong di sini supaya tetap begitu, karena menulis ke sel
     (25,80) memicu gulir; lihat tambalan ketiga di kepala berkas. */
  function barisBantuan(s) { tulis(25, 35, s.slice(0, 45)); }

  function papanSkor() {                                          // baris 740
    tulis(25, 27, (skor + '        ').slice(0, 7));
    $('s-skor').textContent = skor;
  }

  /* --- baris 570-720: proses permintaan papan ketik ----------------------- */
  const KANAN = 77, KIRI = 75, BAWAH = 80, ATAS = 72;   // kode pindaian asli

  function prosesTombol() {
    if (selot === ' ') { bukaJeda(); return; }                    // 580
    if (typeof selot === 'string') { selot = null; return; }      // 590
    const hh = selot;                                             // 600
    selot = null;
    set(hy, hx, KOSONG);                                          // 600

    if (hh === KANAN) { hx += 1; selot = hh; if (hx > 80) hx = 1; }      // 630
    if (hh === KIRI)  { hx -= 1; selot = hh; if (hx < 1) hx = 80; }      // 650
    if (hh === BAWAH && hy < 24) { hy += 1; selot = hh; }                // 670
    if (hh === ATAS  && hy > 1)  { hy -= 1; selot = hh; }                // 680
    if (hx === 80 && hy === 24) hy = 23;                                 // 690

    const s = at(hy, hx);
    if (s === BALOK) { bunyi(440, 1); skor += 10; papanSkor(); angka(hy, hx, '+10', 'm-plus'); }  // 700
    if (s === PANAH) { bunyi(420, 1); skor += 2;  papanSkor(); angka(hy, hx, '+2',  'm-plus'); }  // 710
    set(hy, hx, WAJAH);                                                  // 720
  }

  /* --- baris 330-430: gambar meteor sambil memeriksa skor & wajah --------- */
  function langkahMeteor() {
    if (my > 24) meteorBaru();                          // 310: GOTO 290

    ms += ms0;                                          // 410
    let x = Math.floor(0.5 + ms);                       // 410: INT(0.5+S)
    const y = my;

    if (y > hy + 1) { my = 99; return; }                // 420: menyerah

    if (selot !== null) prosesTombol();                 // 350

    if (Math.abs(x - hx) < 3 && Math.abs(y - hy) < 2) { // 360
      kena(); return;
    }
    if (at(y, x) === BALOK) {                           // 370
      bunyi(660, 2); skor -= 1; papanSkor();
      angka(y, x, '−1', 'm-minus');
      pecah(y, x);
    }
    if (y === 24 && x === 80) x = 79;                   // 375
    set(y, x, PANAH);                                   // 380
    kepalaMeteor(y, x);
    my += 1;                                            // 430: NEXT Y
  }

  /* --- baris 450-520: kena ------------------------------------------------ */
  function kena() {
    main = false;
    gelung.stop();
    kb.captureScroll(false);
    sembunyikan($('kepala'), true);
    hx = hx - 4;                                        // 460
    if (hx > 72) hx = 72;
    if (hx < 1) hx = 1;                                 // 470
    if (hy === 24) hy = 23;                             // 480
    bunyi(400, 8);                                      // 500
    tulis(hy, hx, ARS + ARS + 'BANG' + ARS + ARS);      // 500: E2$+"BANG"+E2$
    tulis(hy + 1, hx, ARS.repeat(8));                   // 500: E8$
    barisBantuan('    DEL = FINISH,  INS = PLAY AGAIN          ');  // 520
    $('crt').classList.add('m-crt--kena');
    pesan('Tertimpa meteor. Skor akhir ' + skor + '.');
    $('mulai').textContent = 'Main lagi';
    $('mulai').disabled = false;
    $('jeda').disabled = true;
    simpanRekor();
    if (modeGlif) gambarGlif();
  }

  /* --- hiasan: SEMUANYA di atas petak, tak satu pun mengubah aturan ------- */
  let gEfek = null, gKepala = null;
  const EFEK_MAKS = 40;
  function bersihkanEfek() {
    while (gEfek.childElementCount > EFEK_MAKS) gEfek.firstChild.remove();
  }

  let jejakLalu = null;
  function kepalaMeteor(y, x) {
    const cx = (x - .5) * SEL_W, cy = (y - .5) * SEL_H;
    if (jejakLalu) {
      const l = mkn('line', { class: 'm-jejak', x1: jejakLalu.x, y1: jejakLalu.y,
                              x2: cx, y2: cy });
      gEfek.append(l);
      l.addEventListener('animationend', () => l.remove());
    }
    jejakLalu = { x: cx, y: cy };
    const k = $('kepala');
    k.setAttribute('cx', cx); k.setAttribute('cy', cy);
    sembunyikan(k, false);
    bersihkanEfek();
  }

  function pecah(y, x) {
    const c = mkn('circle', { class: 'm-pecah', cx: (x - .5) * SEL_W,
                              cy: (y - .5) * SEL_H, r: 3 });
    gEfek.append(c);
    c.addEventListener('animationend', () => c.remove());
    bersihkanEfek();
  }

  function angka(y, x, teks, kelas) {
    const t = mkn('text', { class: 'm-angka ' + kelas, x: (x - .5) * SEL_W,
                            y: (y - .5) * SEL_H, 'text-anchor': 'middle' });
    t.textContent = teks;
    gEfek.append(t);
    t.addEventListener('animationend', () => t.remove());
    bersihkanEfek();
  }

  const pesan = (t) => { $('pesan').textContent = t || ''; };

  /* --- jeda: baris 760-810 ----------------------------------------------- */
  function bukaJeda() {
    if (!main) return;
    jeda = true;
    gelung.pause(true);
    barisBantuan('KEYS: INS=CONTINUE, DEL=STOP, ENTER=RESTORE  ');   // 760
    $('jeda-panel').hidden = false;
    $('jeda').textContent = 'Lanjut';
    if (modeGlif) gambarGlif();
  }

  function tutupJeda() {
    if (!jeda) return;
    jeda = false;
    $('jeda-panel').hidden = true;
    $('jeda').textContent = 'Jeda';
    barisBantuan('     HIT SPACE BAR TO PAUSE                  ');   // 910
    gelung.pause(false);
  }

  function isiUlang() {                                 // 790: ENTER -> 840
    pasangSasaran();
    papanSkor();
    tutupJeda();
    if (modeGlif) gambarGlif();
  }

  function berhenti() {                                 // 800: DEL -> END
    main = false; jeda = false;
    gelung.stop();
    kb.captureScroll(false);
    sembunyikan($('kepala'), true);
    $('jeda-panel').hidden = true;
    $('jeda').textContent = 'Jeda';
    pesan('Berhenti. Skor ' + skor + '.');
    $('mulai').textContent = 'Mulai';
    $('mulai').disabled = false;
    $('jeda').disabled = true;
    simpanRekor();
  }

  function simpanRekor() {
    if (skor > db.get('rekor', 0)) db.set('rekor', skor);
    $('s-rekor').textContent = db.get('rekor', 0);
  }

  /* --- gelung ------------------------------------------------------------- */
  let hz = 30;
  let gelung = { stop() {}, start() {}, pause() {} };

  function buatGelung() {
    gelung.stop();
    gelung = loop({
      hz: hz,
      update: () => { if (main && !jeda) langkahMeteor(); },
      render: () => { if (modeGlif) gambarGlif(); }
    });
  }

  /* --- mulai -------------------------------------------------------------- */
  function mulai() {
    const benih = benihSekarang();
    acak = rng(benih);
    $('s-benih').textContent = benih;

    kosongkan();
    skor = 0; jeda = false; selot = null; jejakLalu = null;
    sembunyikan($('kepala'), true);
    gEfek.textContent = '';
    $('crt').classList.remove('m-crt--kena');

    kesulitan = +$('kesulitan').value;
    hx = 20 + Math.floor(40 * acak.next() + 1);          // 230: 21..60
    hy = 16 + Math.floor(8 * acak.next() + 1);           // 230: 17..24

    tulis(25, 1, 'METEOR! (CURSORS MOVE ' + String.fromCharCode(WAJAH) + ')');  // 240
    pasangSasaran();                                     // 260
    papanSkor();
    meteorBaru();                                        // 280-290

    main = true;
    pesan('');
    $('mulai').disabled = true;
    $('jeda').disabled = false;
    $('jeda').textContent = 'Jeda';
    kb.captureScroll(true);
    buatGelung();
    gelung.start();
    if (modeGlif) gambarGlif();
  }

  /* Pengaduk benih. Aslinya satu putaran = satu `INKEY$` yang gagal, dalam
     gelung yang membakar CPU (baris 160-170). Di sini satu putaran = satu
     milidetik sejak halaman siap: sumber entropinya sama — berapa lama Anda
     berpikir — tanpa harus memutar prosesor untuk mendapatkannya. */
  const T0 = Date.now();
  const benihSekarang = () => (523 + 511 * (Date.now() - T0)) % 32003;

  /* --- papan ketik -------------------------------------------------------- */
  const PETA = { ArrowRight: KANAN, ArrowLeft: KIRI, ArrowDown: BAWAH, ArrowUp: ATAS };
  /* Tombol pengubah tidak menghasilkan apa pun lewat INKEY$, jadi ia tidak
     boleh ikut menghentikan wajah. */
  const PENGUBAH = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock',
                            'NumLock', 'ScrollLock', 'ContextMenu', 'Dead']);

  kb.on('*', (e) => {
    if (jeda) {                                          // baris 770-810
      if (e.key === 'Enter') isiUlang();
      else if (e.key === 'Insert' || e.key === 'Escape') tutupJeda();
      else if (e.key === 'Delete') berhenti();
      return;
    }
    if (!main) return;
    if (PETA[e.key] !== undefined) { selot = PETA[e.key]; return; }
    if (e.key === ' ') { selot = ' '; return; }
    /* Baris 340: tombol apa pun memasang selot. Yang bukan panah selalu
       berujung di 590 (aksara tunggal) atau di 600 tanpa pemasangan ulang
       (kode pindaian yang tak dikenali) — dua-duanya MENGHENTIKAN. */
    if (!PENGUBAH.has(e.key)) selot = 'stop';
  });

  /* --- tampilan ----------------------------------------------------------- */
  let modeGlif = false;
  function pasangMode() {
    sembunyikan($('svg'), modeGlif);
    $('glif').hidden = !modeGlif;
    $('mode').setAttribute('aria-pressed', String(modeGlif));
    if (modeGlif) gambarGlif();
  }

  /* --- pasang ------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: 'Meteor', source: 'METEOR.BAS · Ordman, Nov 1981 · Creative Computing'
  }));

  const svg = $('svg');
  const defs = mkn('defs');
  [['gbalok', '#8ad7ff', '#1d5a90'], ['gwajah', '#ffe9a8', '#e0a020']]
    .forEach(([id, a, b]) => {
      const g = mkn('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 });
      g.append(mkn('stop', { offset: 0, 'stop-color': a }),
               mkn('stop', { offset: 1, 'stop-color': b }));
      defs.append(g);
    });
  svg.append(defs);
  gSel = mkn('g', { id: 'sel' });
  gEfek = mkn('g', { id: 'efek' });
  gKepala = mkn('g');
  svg.append(gSel, gEfek, gKepala);
  const kep = mkn('circle', { id: 'kepala', class: 'm-kepala', r: 4.4, cx: -99, cy: -99 });
  kep.setAttribute('hidden', '');
  gKepala.append(kep);

  $('mulai').addEventListener('click', mulai);
  $('jeda').addEventListener('click', () => { if (jeda) tutupJeda(); else bukaJeda(); });
  $('mode').addEventListener('click', () => { modeGlif = !modeGlif; pasangMode(); });
  $('j-lanjut').addEventListener('click', tutupJeda);
  $('j-isi').addEventListener('click', isiUlang);
  $('j-stop').addEventListener('click', berhenti);
  $('hz').addEventListener('input', (e) => {
    hz = +e.target.value;
    $('hzv').textContent = hz + '/dtk';
    if (main) { buatGelung(); gelung.start(); if (jeda) gelung.pause(true); }
  });
  $('hzv').textContent = hz + '/dtk';
  $('s-rekor').textContent = db.get('rekor', 0);

  /* Digambar LANGSUNG, bukan lewat rAF: tab tersembunyi tidak menjalankan rAF
     sama sekali, dan halaman akan terlihat kosong saat diuji lewat MCP. */
  tulis(25, 1, 'METEOR! (CURSORS MOVE ' + String.fromCharCode(WAJAH) + ')');
  barisBantuan('     HIT SPACE BAR TO PAUSE                  ');
  pasangMode();
  pesan('Tekan Mulai. Panah menjalankan wajah terus-menerus; tombol apa pun selain panah menghentikannya.');
})();
