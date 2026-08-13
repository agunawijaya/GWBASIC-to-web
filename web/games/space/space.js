/* ===========================================================================
   space.js — port dari SPACE.BAS (IBM Corp, 1981-82, R. Heiney & M. Hallerman).

   Lima puluh tujuh baris, dan NOL GOSUB — semuanya alur lurus dengan 15 GOTO.
   Empat puluh lima barisnya kerangka IBM yang sama dengan PIECHART; yang
   benar-benar khas program ini cuma SEBELAS BARIS terakhir.

   ------------------------------------------------------------------------
   SATU BARIS YANG MEMUAT SELURUH SISTEM GRAFIS CGA

       1430 CLS:CIRCLE(160,100),30,1,,,0.45:PAINT(160,100),1,1:
            DRAW"bm160,100e30bm160,100h30":LINE (130,100)-(190,100),2:
            GET(130,70)-(190,130),I

   Dibaca berurutan:

     CIRCLE(160,100),30,1,,,0.45   lingkaran jari-jari 30 — tapi parameter
                                   terakhir adalah RASIO ASPEK, jadi yang
                                   tergambar elips pipih 0,45
     PAINT(160,100),1,1            isi dari titik tengah sampai ketemu batas
     DRAW"bm160,100e30bm..h30"     dua garis diagonal; `bm` = pindah tanpa
                                   menggambar
     LINE (130,100)-(190,100),2    garis mendatar
     GET(130,70)-(190,130),I       POTRET seluruh hasilnya ke larik I(800)

   Lima perintah grafis berbeda, satu baris, dan hasilnya sebuah sprite.

   ------------------------------------------------------------------------
   XOR: MENGGAMBAR DAN MENGHAPUS DENGAN PERINTAH YANG SAMA

       1480 K1=RND*259:K2=RND*138:PUT(K1,K2),I,XOR:
            FOR I1=1 TO 150:NEXT:PUT(K1,K2),I,XOR:NEXT

   `PUT ... XOR` menggambar sprite dengan meng-XOR-kan bitnya ke layar.
   Mengulanginya di tempat yang SAMA mengembalikan layar persis seperti
   semula — karena a XOR b XOR b = a.

   Jadi satu perintah melayani dua pekerjaan yang berlawanan, dan latar
   belakangnya tidak perlu disimpan sama sekali. Itulah cara menggerakkan
   benda di layar sebelum ada buffer ganda: gambar, tunggu, gambar lagi.

   Harganya terlihat: sprite yang di-XOR di atas latar berwarna TIDAK memakai
   warnanya sendiri — ia memakai warna hasil XOR. Baris 1440 sengaja membagi
   layar jadi tiga pita warna, dan sprite yang sama tampak berbeda di tiap
   pita. Itu bukan cacat; itu peragaan.

   ------------------------------------------------------------------------
   RASIO ASPEK, UNTUK KEDUA KALINYA DI KOLEKSI

   PIECHART memakai 5/6 supaya lingkarannya TERLIHAT bulat. SPACE memakai
   0,45 supaya elipsnya terlihat PIPIH — sengaja, untuk membuat sesuatu yang
   mirip stasiun ruang angkasa.

   Angka yang sama jenisnya, dua maksud yang berlawanan. Dan di layar
   berpiksel persegi, keduanya harus diperlakukan berbeda: 5/6 dibuang
   (lihat piechart.md §3), 0,45 DIPERTAHANKAN — karena yang satu koreksi
   perangkat keras, yang lain keputusan rupa.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const db = store('space');
  const NS = 'http://www.w3.org/2000/svg';

  const W = 320, H = 200;                       // SCREEN 1
  /* Baris 1440: tiga pita, warna 0, 2, 3 — dan pita keempat (x>300) dibiarkan
     kosong, karena LINE hanya menggambar sampai 300. */
  const PITA = [
    { x: 0, w: 101, c: '#000000', n: '0 — hitam' },
    { x: 101, w: 100, c: '#ff55ff', n: '2 — magenta' },
    { x: 201, w: 100, c: '#ffffff', n: '3 — putih' },
    { x: 301, w: 19, c: '#000000', n: 'sisa layar' }
  ];
  const SPRITE = '#55ffff';                     // warna 1 — sian

  let jalan = false, timer = 0, xorMode = true;

  function papan() {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 's-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'layar demo SPACE');
    PITA.forEach(p => {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', p.x); r.setAttribute('y', 0);
      r.setAttribute('width', p.w); r.setAttribute('height', H);
      r.setAttribute('fill', p.c);
      svg.append(r);
    });
    return svg;
  }

  /* Sprite baris 1430, digambar ulang sebagai grup SVG. Ukurannya sama:
     elips jari-jari 30 dengan rasio 0,45, dua diagonal, satu garis mendatar. */
  function sprite() {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 's-sprite');
    const mk = (t, a) => {
      const n = document.createElementNS(NS, t);
      for (const k in a) n.setAttribute(k, a[k]);
      g.append(n); return n;
    };
    /* CIRCLE …,30,1,,,0.45 lalu PAINT dari pusat: elips terisi warna 1. */
    mk('ellipse', { cx: 0, cy: 0, rx: 30, ry: 30 * 0.45, fill: SPRITE });
    /* DRAW "e30" = diagonal kanan-atas; "h30" = diagonal kiri-atas. */
    mk('line', { x1: 0, y1: 0, x2: 21, y2: -21, stroke: SPRITE, 'stroke-width': 1 });
    mk('line', { x1: 0, y1: 0, x2: -21, y2: -21, stroke: SPRITE, 'stroke-width': 1 });
    /* LINE (130,100)-(190,100),2 — mendatar, warna 2. */
    mk('line', { x1: -30, y1: 0, x2: 30, y2: 0, stroke: '#ff55ff', 'stroke-width': 1 });
    return g;
  }

  function langkah() {
    if (!jalan) return;
    /* Baris 1480: K1=RND*259, K2=RND*138 — sudut kiri atas sprite 61x61,
       jadi batasnya 320-61=259 dan 200-61=138. Angkanya bukan sembarang:
       ia lebar layar dikurangi lebar sprite, dihitung tangan. */
    const k1 = Math.random() * 259, k2 = Math.random() * 138;
    const s = sprite();
    s.setAttribute('transform', 'translate(' + (k1 + 30) + ',' + (k2 + 30) + ')');
    if (xorMode) s.setAttribute('class', 's-sprite s-sprite--xor');
    $('layar').append(s);

    /* Baris 1470: PLAY "mbl64t255o=j;cc#dd#eff#gg#aa#b" — tangga kromatik
       penuh di oktaf j, dua kali, sebelum tiap kemunculan sprite. */
    if ($('bunyi').checked) {
      const okt = 2 + Math.floor(Math.random() * 5);
      audio.play('MB L64 T255 O' + okt + ' c c# d d# e f f# g g# a a# b',
                 { fresh: true });
    }

    /* FOR I1=1 TO 150:NEXT — jeda kosong, lalu PUT XOR kedua menghapusnya. */
    setTimeout(() => { s.remove(); }, 420);
    timer = setTimeout(langkah, 620);
  }

  function mulai() {
    jalan = !jalan;
    $('go').textContent = jalan ? 'Stop' : 'Jalankan';
    if (jalan) langkah(); else { clearTimeout(timer); bersih(); }
  }

  function bersih() {
    $('layar').querySelectorAll('.s-sprite').forEach(e => e.remove());
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'IBM Space',
    source: 'SPACE.BAS · R. Heiney & M. Hallerman · IBM Corp · 1981-82',
    backHref: '../../index.html'
  }));

  $('layar').append(papan());

  /* Contoh diam sprite-nya, supaya bentuknya bisa dilihat tanpa menunggu. */
  const contoh = sprite();
  contoh.setAttribute('transform', 'translate(60,40) scale(1.6)');
  $('contoh').append(document.createElementNS(NS, 'svg'));
  const sc = $('contoh').firstChild;
  sc.setAttribute('viewBox', '0 0 120 80');
  sc.setAttribute('class', 's-contoh');
  const bg = document.createElementNS(NS, 'rect');
  bg.setAttribute('width', 120); bg.setAttribute('height', 80);
  bg.setAttribute('fill', '#000');
  sc.append(bg, contoh);

  $('go').addEventListener('click', mulai);
  $('xor').addEventListener('click', () => {
    xorMode = !xorMode;
    $('xor').setAttribute('aria-pressed', String(xorMode));
    $('xor').textContent = xorMode ? 'XOR: nyala' : 'XOR: mati';
    db.set('xor', xorMode);
    bersih();
  });

  /* Peraga XOR: a XOR b XOR b = a, ditunjukkan sebagai bit. */
  function bitDemo() {
    const a = 0b1011, b = 0b0110;
    const bin = (v) => v.toString(2).padStart(4, '0');
    $('bits').innerHTML =
      'latar &nbsp; <b>' + bin(a) + '</b><br>' +
      'sprite &nbsp;<b>' + bin(b) + '</b><br>' +
      'XOR &nbsp;&nbsp;&nbsp;<b class="s-hi">' + bin(a ^ b) + '</b> &larr; tergambar<br>' +
      'XOR lagi <b class="s-hi">' + bin(a ^ b ^ b) + '</b> &larr; latar kembali utuh';
  }

  xorMode = db.get('xor', true);
  $('xor').setAttribute('aria-pressed', String(xorMode));
  $('xor').textContent = xorMode ? 'XOR: nyala' : 'XOR: mati';
  bitDemo();
})();
