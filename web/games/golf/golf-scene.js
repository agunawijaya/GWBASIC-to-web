/* ===========================================================================
   golf-scene.js — lapisan penyajian untuk GOLF.BAS

   Berkas ini TIDAK PUNYA ATURAN. Ia menerima angka yang sudah diputuskan
   golf.js (DIST, OF, nomor tongkat, medan pendaratan) dan menggambarkannya:
   seorang pemain mengayun, bola terpukul, melambung, mendarat, memantul,
   menggelinding. Kalau berkas ini dihapus, permainannya tetap berjalan utuh.

   Dua aturan yang dibawa dari TRUCKER dan berlaku juga di sini:

   1. HIASAN TIDAK PERNAH MENGAMBIL DARI ACAK PERMAINAN. Modul ini punya
      aliran `RETRO.rng` sendiri. Kalau ia meminjam `rnd` milik golf.js,
      maka jumlah pohon yang digambar akan menggeser hasil pukulan.

   2. TIDAK ADA KEADAAN YANG BERUBAH TANPA GAMBAR. Bola yang tiba-tiba
      pindah 200 yard adalah persis keluhan yang membuat berkas ini ada.

   ---------------------------------------------------------------------------
   FISIKA

   Aslinya tidak punya fisika sama sekali: baris 530 menghasilkan SATU angka,
   jarak total, dan tidak pernah menyebut tinggi, waktu, atau sudut. Jadi
   lintasannya harus dibangun -- dan dibangun supaya CONTOH-nya benar, bukan
   asal melengkung. Empat besaran diturunkan dari nomor tongkat F, yaitu
   nomor yang sama yang masuk ke rumus baris 530:

     loft        = 9 + 2,5 F          derajat
     sudut luncur= 0,85 x loft        bola meluncur lebih rendah dari loft
     apeks/carry = 0,095 + 0,0085 F   makin loncong makin tinggi
     gelinding   = 0,19 - 0,012 F     driver lari jauh, wedge berhenti

   Angkanya dipilih supaya cocok dengan tongkat sungguhan:

     tongkat   F      loft    padanan nyata      apeks     nyata
     Wood 1    1      11,5    driver 10,5        26 yd     ~30 yd
     Wood 3    3      16,5    3-wood 15          ~24 yd    ~25 yd
     Iron 6   10,5    35,3    6-iron 30-34       30 yd     ~28 yd
     PW       15      46,5    PW 46              24 yd     ~28 yd

   Lintasannya BUKAN parabola. Parabola yang lewat (carry, apeks) selalu
   meluncur terlalu curam dan mendarat terlalu landai; bola golf sungguhan
   berangkat landai, mengambang di puncak, lalu jatuh curam karena gaya
   angkat. Maka dipakai kubik

       y(u) = c1 u + c2 u^2 + c3 u^3,   u = 0..1 sepanjang carry

   dengan c1 dikunci oleh sudut luncur, c3 dikunci oleh syarat y(1) = 0,
   dan c2 dicari dengan bagi-dua sampai puncaknya persis setinggi apeks.
   Hasilnya sudut jatuh ikut terkunci: |y'(1)| = 2c1 + c2.

     driver  luncur 11 derajat -> jatuh 37 derajat   (nyata ~38)
     wedge   luncur 40 derajat -> jatuh 44 derajat   (nyata ~50)

   Waktu terbang memakai rumus lambungan, t = sqrt(8h/g) dengan
   g = 32,17 ft/s^2 = 10,72 yard/s^2 -- driver apeks 26 yard menggantung
   4,4 detik. Di layar diputar 0,62 kali kecepatan nyata supaya satu pukulan
   tidak memakan lima detik; angka detik yang ditampilkan tetap yang nyata.
   =========================================================================== */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const txt = (a, s) => { const n = mkn('text', a); n.textContent = s; return n; };

  const W = 820, H = 260, GND = 206, X0 = 70;
  const G_YD = 10.72;          /* 32,17 ft/s^2 dinyatakan dalam yard/s^2 */
  const LAJU = 0.62;           /* pemutaran layar terhadap waktu nyata   */

  /* ======================================================================
     Bagian 1 — fisika
     ====================================================================== */
  const loft = (F) => 9 + F * 2.5;
  const sudutLuncur = (F) => Math.max(6, Math.min(48, loft(F) * 0.85));
  const rasioApeks = (F) => 0.095 + F * 0.0085;
  const rasioGelinding = (F) => Math.max(0.01, 0.19 - F * 0.012);

  /* Sudut jatuh bola golf sungguhan kira-kira 30 + 0,55 x sudut luncur:
     driver 11 -> 36, mid-iron 30 -> 46, wedge 40 -> 52. Cocok dengan data
     lacak-bola yang diterbitkan, dan monoton seperti seharusnya. */
  const sudutJatuh = (naik) => Math.min(58, 30 + 0.55 * naik);

  /* Kuartik yang lewat (0,0) dan (1,0), berangkat pada sudut luncur yang
     diminta, MENDARAT pada sudut jatuh yang diminta, dan puncaknya tepat
     setinggi `h`.

       y(u) = c1 u + c2 u^2 + c3 u^3 + c4 u^4

     c1 dikunci sudut luncur. Dua syarat ujung, y(1)=0 dan y'(1)=-m1,
     menyisakan satu derajat kebebasan; ambil c4 = t sebagai parameter bebas
     dan keduanya terselesaikan:

       c2 = m1 - 2 c1 + t     c3 = c1 - m1 - 2 t     c4 = t

     t dicari dengan bagi-dua, dan bagi-dua SAH di sini karena
     dy/dt = u^2 (1-u)^2 yang tidak pernah negatif -- jadi puncaknya naik
     monoton terhadap t. Itu bukan kebetulan yang menyenangkan, itu yang
     membuat pencariannya boleh dipercaya. */
  function lintasan(R, h, derajat) {
    const turun = sudutJatuh(derajat);
    const c1 = Math.tan(derajat * Math.PI / 180) * R;
    const m1 = Math.tan(turun * Math.PI / 180) * R;
    const koef = (t) => [m1 - 2 * c1 + t, c1 - m1 - 2 * t, t];
    const nilai = (u, k) =>
      c1 * u + k[0] * u * u + k[1] * u * u * u + k[2] * u * u * u * u;
    const puncak = (t) => {
      const k = koef(t);
      let best = 0;
      for (let i = 1; i < 160; i++) { const y = nilai(i / 160, k); if (y > best) best = y; }
      return best;
    };
    let lo = -40 * c1 - 4000, hi = 40 * c1 + 4000;
    for (let i = 0; i < 60; i++) {
      const m = (lo + hi) / 2;
      if (puncak(m) < h) lo = m; else hi = m;
    }
    const k = koef((lo + hi) / 2);
    return { y: (u) => Math.max(0, nilai(u, k)), naik: derajat, turun: turun };
  }

  /* Semua yang perlu diketahui tentang satu pukulan, dari DIST dan F saja. */
  function hitungPukulan(DIST, F) {
    const total = Math.max(1, DIST);
    const gel = total * rasioGelinding(F);
    const carry = Math.max(1, total - gel);
    const apeks = Math.max(1.5, carry * rasioApeks(F));
    const lint = lintasan(carry, apeks, sudutLuncur(F));
    return {
      total: total, carry: carry, gelinding: total - carry, apeks: apeks,
      detik: 0.864 * Math.sqrt(apeks),
      loft: loft(F), naik: lint.naik, turun: lint.turun, y: lint.y
    };
  }

  /* ======================================================================
     Bagian 2 — kerangka gambar
     ====================================================================== */
  /* Urutan lapisan = urutan kedalaman. Satu hal yang TIDAK boleh tunduk
     pada aturan itu: bendera. Ia sasaran seluruh permainan, jadi ia
     digambar SESUDAH pohon dan tidak pernah tertimbun -- pelajaran yang
     dibayar di TRUCKER ketika truk penyalip hilang di balik papan nama.
     Sebagai gantinya pohon dilarang tumbuh di sekitar green (lihat
     `tanamPohon`), supaya pengecualian ini tidak terlihat curang. */
  const LAPIS = ['langit', 'surya', 'bukit', 'pohonJauh', 'tanah', 'rumput',
                 'pohonDekat', 'green', 'tik', 'pemain', 'jejak', 'bola', 'teks'];
  let svg = null, L = {}, acak = null;
  let benda = [];            /* pohon & semak, posisinya dalam yard dari tee */
  let f0 = 0, span = 320;    /* jendela tampilan: [f0, f0+span] yard         */
  let pinDi = 400;           /* posisi bendera, yard dari tee                */
  let bolaDi = 0;            /* posisi bola sekarang, yard dari tee          */
  let bolaSebelum = 0;       /* posisi sebelum pukulan terakhir              */
  let hidup = false, lewati = null;
  let diGreen = false;       /* satuan sumbu: kaki, bukan yard             */

  const px = (yd) => X0 + (yd - f0) * ((W - 34 - X0) / span);
  const pyt = (tinggiYd) => GND - tinggiYd * ((W - 34 - X0) / span) * vExag;
  let vExag = 1;

  function bangun(el) {
    svg = el;
    svg.textContent = '';
    L = {};
    LAPIS.forEach(n => { const g = mkn('g', { 'data-l': n }); L[n] = g; svg.append(g); });
    svg.addEventListener('click', () => { if (lewati) lewati(); });
  }

  /* ======================================================================
     Bagian 3 — latar
     ====================================================================== */
  function latar() {
    L.langit.textContent = ''; L.surya.textContent = '';
    L.bukit.textContent = ''; L.tanah.textContent = ''; L.rumput.textContent = '';
    L.langit.append(mkn('rect', { class: 'e-langit', x: 0, y: 0, width: W, height: GND }));
    L.surya.append(mkn('circle', { class: 'e-surya', cx: W - 96, cy: 40, r: 17 }));
    /* bukit jauh: diam total, ia yang membuat gerak di depan terasa */
    let d = 'M0 ' + (GND - 26);
    for (let x = 0; x <= W; x += 82) {
      const t = 26 + 20 * Math.sin(x * 0.017) + 12 * Math.sin(x * 0.041);
      d += ' Q' + (x + 41) + ' ' + (GND - t - 16) + ' ' + (x + 82) + ' ' + (GND - t);
    }
    L.bukit.append(mkn('path', { class: 'e-bukit', d: d + ' L' + W + ' ' + GND + ' L0 ' + GND + ' Z' }));
    L.tanah.append(mkn('rect', { class: 'e-tanah', x: 0, y: GND, width: W, height: H - GND }));
    L.rumput.append(mkn('rect', { class: 'e-rumput', x: 0, y: GND - 7, width: W, height: 9 }));
  }

  /* Pohon dan semak sepanjang lubang. Posisinya DALAM YARD, jadi kalau bola
     maju 200 yard pemandangannya ikut lewat -- bukan digambar ulang acak. */
  function tanamPohon(panjangLubang) {
    benda = [];
    let y = -30;
    while (y < panjangLubang + 140) {
      y += 9 + acak.next() * 26;
      /* Semua undian diambil DULU, keputusan menyusul. Kalau urutannya
         dibalik, melewatkan satu pohon akan menggeser semua pohon
         berikutnya -- dan pemandangan lubang berubah hanya karena
         bendera kebetulan berdiri di tempat lain. */
      const jenis = acak.next();
      const jauh = acak.next() < 0.45;
      const tinggi = 5 + acak.next() * 7;
      if (Math.abs(y - panjangLubang) < 16) continue;   // green tidak berpohon
      benda.push({
        yd: y, jauh: jauh, tinggi: tinggi,
        jenis: jenis < 0.34 ? 'cemara' : jenis < 0.8 ? 'rindang' : 'semak'
      });
    }
  }

  function gambarPohon() {
    L.pohonJauh.textContent = ''; L.pohonDekat.textContent = '';
    const skala = (W - 34 - X0) / span;
    benda.forEach(b => {
      const x = px(b.yd);
      if (x < -60 || x > W + 60) return;
      /* Yang "jauh" berdiri di garis bukit dan lebih kecil; yang "dekat"
         berdiri di garis rumput. Kedalaman = urutan lapisan, seperti di
         TRUCKER: yang lebih dekat digambar belakangan. */
      const kecil = b.jauh ? 0.42 : 1;
      /* Batas atas wajib: pada bingkai rapat (10 yard) satu pohon 10 yard
         akan setinggi 500 piksel dan menelan seluruh gambar. */
      const h = Math.min(126, b.tinggi * skala * vExag * kecil);
      const dasar = b.jauh ? GND - 16 : GND - 2;
      const g = mkn('g', {});
      if (b.jenis === 'semak') {
        g.append(mkn('ellipse', { class: 'e-semak', cx: x, cy: dasar - h * 0.22,
          rx: Math.max(3, h * 0.45), ry: Math.max(2, h * 0.26) }));
      } else if (b.jenis === 'cemara') {
        g.append(mkn('rect', { class: 'e-batang', x: x - Math.max(1, h * 0.05),
          y: dasar - h * 0.3, width: Math.max(2, h * 0.1), height: h * 0.3 }));
        g.append(mkn('path', { class: 'e-daunGelap',
          d: 'M' + x + ' ' + (dasar - h) + ' L' + (x + h * 0.34) + ' ' + (dasar - h * 0.26) +
             ' L' + (x - h * 0.34) + ' ' + (dasar - h * 0.26) + ' Z' }));
      } else {
        g.append(mkn('rect', { class: 'e-batang', x: x - Math.max(1, h * 0.055),
          y: dasar - h * 0.42, width: Math.max(2, h * 0.11), height: h * 0.42 }));
        g.append(mkn('ellipse', { class: 'e-daun', cx: x, cy: dasar - h * 0.66,
          rx: h * 0.38, ry: h * 0.34 }));
        g.append(mkn('ellipse', { class: 'e-daun2', cx: x - h * 0.16, cy: dasar - h * 0.78,
          rx: h * 0.24, ry: h * 0.2 }));
      }
      (b.jauh ? L.pohonJauh : L.pohonDekat).append(g);
    });
  }

  /* Pemandangan skala PUTTING. Penggambar dunia tidak bisa dipakai di sini:
     pada 23 kaki, satu piksel bernilai dua sentimeter, sehingga pohon
     setinggi 10 yard menjadi 500 piksel dan green selebar 40 yard menjadi
     setrip selebar layar. Jadi di jarak ini yang digambar hanya yang
     benar-benar ada di depan mata: permukaan green, lubangnya, tiangnya,
     dan barisan pohon di kejauhan dengan ukuran TETAP -- karena benda jauh
     memang tidak membesar waktu Anda merapat ke bola. */
  const UFUK = 132;
  function latarGreen() {
    ['langit', 'surya', 'bukit', 'pohonJauh', 'tanah', 'rumput',
     'pohonDekat', 'green'].forEach(k => { L[k].textContent = ''; });
    L.langit.append(mkn('rect', { class: 'e-langit', x: 0, y: 0, width: W, height: UFUK }));
    L.surya.append(mkn('circle', { class: 'e-surya', cx: W - 96, cy: 34, r: 15 }));
    let d = 'M0 ' + UFUK;
    for (let x = 0; x <= W; x += 74)
      d += ' Q' + (x + 37) + ' ' + (UFUK - 20 - 9 * Math.sin(x * 0.03)) +
           ' ' + (x + 74) + ' ' + UFUK;
    L.bukit.append(mkn('path', { class: 'e-bukit', d: d + ' L' + W + ' ' + UFUK + ' L0 ' + UFUK + ' Z' }));
    for (let x = 6; x < W; x += 39) {
      const h = 15 + ((x * 37) % 11);
      L.pohonJauh.append(mkn('path', { class: 'e-daunGelap',
        d: 'M' + x + ' ' + (UFUK - h) + ' L' + (x + 7) + ' ' + UFUK +
           ' L' + (x - 7) + ' ' + UFUK + ' Z' }));
    }
    /* Permukaan green: melengkung sedikit supaya terbaca sebagai bidang,
       bukan sebagai dinding. */
    L.tanah.append(mkn('rect', { class: 'e-permukaan', x: 0, y: UFUK, width: W, height: H - UFUK }));
    L.rumput.append(mkn('ellipse', { class: 'e-permukaanTepi', cx: W / 2, cy: UFUK + 96,
      rx: W * 0.78, ry: 96 }));
    /* Lubang golf lebarnya 4,25 inci = 0,118 yard. Pada skala ini ia memang
       sekecil itu, dan justru itu yang membuat jaraknya terasa. */
    const skala = (W - 34 - X0) / span;
    const x = px(pinDi), r = Math.max(3.5, 0.118 * skala);
    L.green.append(mkn('ellipse', { class: 'e-lubangGolf', cx: x, cy: GND, rx: r, ry: r * 0.42 }));
    L.green.append(mkn('line', { class: 'e-tiang', x1: x, y1: GND, x2: x, y2: GND - 78 }));
    L.green.append(mkn('path', { class: 'e-bendera',
      d: 'M' + x + ' ' + (GND - 78) + ' L' + (x + 26) + ' ' + (GND - 71) +
         ' L' + x + ' ' + (GND - 64) + ' Z' }));
  }

  function gambarGreen() {
    L.green.textContent = '';
    const x = px(pinDi);
    if (x < -80 || x > W + 120) return;
    const skala = (W - 34 - X0) / span;
    /* Green sungguhan lebarnya sekitar 40 yard, jadi jari-jarinya 20 yard --
       dan ia harus MENGECIL kalau jauh. Batas bawah 9 px yang dulu ada di
       sini membuatnya menggelembung di lubang panjang, sehingga bola yang
       masih 8 yard dari pin tergambar seperti sudah di atas green. */
    const rx = Math.max(2, 20 * skala);
    L.green.append(mkn('ellipse', { class: 'e-green', cx: x, cy: GND - 2, rx: rx, ry: 5 }));
    L.green.append(mkn('line', { class: 'e-tiang', x1: x, y1: GND - 3, x2: x, y2: GND - 47 }));
    L.green.append(mkn('path', { class: 'e-bendera',
      d: 'M' + x + ' ' + (GND - 47) + ' L' + (x + 22) + ' ' + (GND - 41) +
         ' L' + x + ' ' + (GND - 35) + ' Z' }));
  }

  /* Penanda jarak 50 yard, dengan angkanya. Inilah yang membuat lambungan
     bisa DIBACA, bukan sekadar dilihat. */
  function gambarTik() {
    L.tik.textContent = '';
    /* Di atas green satuannya KAKI, sama seperti yang dipakai permainan
       sejak baris 760 -- kalau sumbunya tetap yard, seluruh bingkai putting
       hanya berisi angka nol. */
    const kaki = diGreen || span < 14;
    const langkah = kaki ? (span < 5 ? 1 : 2)
      : span > 420 ? 100 : span > 180 ? 50 : span > 80 ? 20 : 10;
    /* Diukur dari BOLA, bukan dari tepi bingkai. Sesudah kamera merapat,
       tepi kiri berada beberapa langkah di belakang bola, dan sumbu yang
       menghitung dari sana akan menuliskan angka yang tidak sama dengan
       angka di papan -- persis jenis ketidakcocokan yang membuat seluruh
       gambar ini tidak bisa dipercaya. */
    const mulai = Math.ceil((f0 - bolaDi) / langkah) * langkah + bolaDi;
    for (let y = mulai; y <= f0 + span; y += langkah) {
      if (Math.abs(y - bolaDi) < langkah * 0.5) continue;
      const x = px(y);
      L.tik.append(mkn('line', { class: 'e-tik', x1: x, y1: GND + 2, x2: x, y2: GND + 9 }));
      L.tik.append(txt({ class: 'e-tikTeks', x: x, y: GND + 22 },
        Math.round((y - bolaDi) * (kaki ? 3 : 1))));
    }
    L.tik.append(txt({ class: 'e-sumbu', x: 8, y: GND + 22 },
      kaki ? 'KAKI DARI BOLA' : 'YARD DARI BOLA'));
    if (vExag > 1.04)
      L.tik.append(txt({ class: 'e-sumbu e-sumbu--kanan', x: W - 8, y: GND + 22 },
        'TINGGI DILEBIHKAN ×' + vExag.toFixed(1)));
  }

  /* ======================================================================
     Bagian 4 — pemain
     Titik putar bahu ada di (2,2) dalam koordinat lokal; badan berputar di
     pinggul (2,26). Rotasi ditulis sebagai ATRIBUT transform lewat JS, dan
     tidak pernah lewat CSS -- properti CSS `transform` menimpa atributnya,
     dan itu jebakan yang sudah memakan korban sekali di TRUCKER.
     ====================================================================== */
  let gPemain = null, gAtas = null, gLengan = null, gBayang = null;

  function bikinPemain() {
    L.pemain.textContent = '';
    gPemain = mkn('g', {});
    /* kaki: tetap, tidak ikut berputar */
    const kaki = mkn('g', {});
    kaki.append(mkn('path', { class: 'e-celana', d: 'M-5 24 L9 24 L13 50 L6 50 L2 34 L-3 50 L-10 50 Z' }));
    kaki.append(mkn('path', { class: 'e-sepatu', d: 'M5 50 L15 50 L17 55 L5 55 Z' }));
    kaki.append(mkn('path', { class: 'e-sepatu', d: 'M-11 50 L-1 50 L-1 55 L-14 55 Z' }));
    gPemain.append(kaki);

    gAtas = mkn('g', {});
    gAtas.append(mkn('path', { class: 'e-baju', d: 'M-7 -2 L9 -2 L10 26 L-5 26 Z' }));
    gAtas.append(mkn('path', { class: 'e-bajuBayang', d: 'M4 -2 L9 -2 L10 26 L4 26 Z' }));
    gAtas.append(mkn('line', { class: 'e-leher', x1: 2, y1: -3, x2: 2, y2: -8 }));
    gAtas.append(mkn('circle', { class: 'e-kepala', cx: 2, cy: -15, r: 8 }));
    gAtas.append(mkn('path', { class: 'e-topi', d: 'M-6 -18 A8 8 0 0 1 10 -18 L10 -16 L-6 -16 Z' }));
    gAtas.append(mkn('path', { class: 'e-topi', d: 'M9 -18 L20 -16 L20 -13 L9 -14 Z' }));

    gLengan = mkn('g', {});
    gLengan.append(mkn('line', { class: 'e-lengan', x1: 2, y1: 2, x2: 6, y2: 22 }));
    gLengan.append(mkn('line', { class: 'e-lengan2', x1: 2, y1: 2, x2: 4, y2: 22 }));
    gLengan.append(mkn('circle', { class: 'e-tangan', cx: 5, cy: 23, r: 3 }));
    gLengan.append(mkn('line', { class: 'e-shaft', x1: 5, y1: 23, x2: 16, y2: 52 }));
    gLengan.append(mkn('path', { class: 'e-kepalaStik', d: 'M16 52 L25 51 L26 56 L15 56 Z' }));
    gAtas.append(gLengan);
    gPemain.append(gAtas);
    L.pemain.append(gPemain);

    gBayang = mkn('ellipse', { class: 'e-bayang', cx: 0, cy: 0, rx: 18, ry: 4 });
    L.pemain.insertBefore(gBayang, gPemain);
    taruhPemain(0, 0);
  }

  let pemainTerakhir = [0, 0];
  function taruhPemain(sudutStik, sudutBadan) {
    if (!gPemain) return;
    pemainTerakhir = [sudutStik, sudutBadan];
    const x = px(bolaDi) - 14, y = GND - 55;
    gPemain.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y + ')');
    gBayang.setAttribute('cx', (x + 2).toFixed(2));
    gBayang.setAttribute('cy', GND);
    gAtas.setAttribute('transform', 'rotate(' + sudutBadan.toFixed(2) + ' 2 26)');
    gLengan.setAttribute('transform', 'rotate(' + sudutStik.toFixed(2) + ' 2 2)');
  }

  /* ======================================================================
     Bagian 5 — bola dan jejaknya
     ====================================================================== */
  let elBola = null, elJejak = null, elJejakLuar = null, elLabel = null, jejak = [];

  function bikinBola() {
    L.jejak.textContent = ''; L.bola.textContent = ''; L.teks.textContent = '';
    /* Jejak digambar DUA KALI: garis putih tebal di bawah, garis gelap tipis
       di atasnya. Satu warna saja tidak bisa menang di dua latar sekaligus --
       langit terang di atas, rumput gelap di bawah -- dan jejak yang hilang
       separuh jalan justru menyembunyikan bagian yang paling ingin dilihat. */
    elJejakLuar = mkn('polyline', { class: 'e-jejakLuar', points: '' });
    elJejak = mkn('polyline', { class: 'e-jejak', points: '' });
    L.jejak.append(elJejakLuar); L.jejak.append(elJejak);
    elBola = mkn('circle', { class: 'e-bola', cx: px(bolaDi), cy: GND - 4, r: 4.2 });
    L.bola.append(elBola);
    elLabel = txt({ class: 'e-labelBola', x: px(bolaDi), y: GND - 16 }, '');
    L.teks.append(elLabel);
    jejak = [];
  }

  /* Jejak disimpan dalam KOORDINAT DUNIA, bukan piksel. Kalau disimpan
     sebagai piksel, ia akan tertinggal di tempat lamanya begitu bingkai
     digeser atau diperbesar -- dan garis lambungan yang tidak lagi lewat
     bolanya sendiri lebih membingungkan daripada tidak ada garis. */
  let bolaTerakhir = [0, 0, ''];

  function gambarJejak() {
    const p = jejak.map(t => px(t[0]).toFixed(1) + ',' +
      (t[1] > 0 ? pyt(t[1]) : GND - 4).toFixed(1)).join(' ');
    elJejak.setAttribute('points', p);
    elJejakLuar.setAttribute('points', p);
  }

  function taruhBola(yd, tinggiYd, label, tanpaJejak) {
    bolaTerakhir = [yd, tinggiYd, label || ''];
    const x = px(yd), y = tinggiYd > 0 ? pyt(tinggiYd) : GND - 4;
    elBola.setAttribute('cx', x.toFixed(2));
    elBola.setAttribute('cy', y.toFixed(2));
    /* Di green, bola berhenti tepat di kaki pemain; label di atasnya akan
       jatuh persis di celananya. Jadi di sana label digeser ke kanan bola,
       ke arah lubang, tempat mata pemain memang sedang menuju. */
    const lx = diGreen ? x + 46 : x;
    elLabel.setAttribute('x', Math.max(44, Math.min(W - 44, lx)).toFixed(2));
    elLabel.setAttribute('y', (y - (diGreen ? 4 : 13)).toFixed(2));
    elLabel.textContent = label || '';
    if (!tanpaJejak) {
      jejak.push([yd, tinggiYd]);
      if (jejak.length > 460) jejak.shift();
    }
    gambarJejak();
  }

  /* Kartu hasil di pojok: apeks, carry, gelinding, sudut. Angka yang tidak
     pernah ada di aslinya, tapi tanpanya lambungan cuma hiasan. */
  function kartu(p, sisa) {
    const g = mkn('g', {});
    const baris = [
      ['CARRY', Math.round(p.carry) + ' yd'],
      ['ROLL', Math.round(p.gelinding) + ' yd'],
      ['APEX', Math.round(p.apeks) + ' yd'],
      ['LAUNCH / DESCENT', Math.round(p.naik) + '° / ' + Math.round(p.turun) + '°']
    ];
    /* Sisa ke pin ditaruh DI SINI, bukan di label bola: label bola ikut
       bergerak dan kalimat sepanjang ini akan keluar dari tepi gambar. */
    if (sisa != null) baris.push(['SISA KE PIN', Math.round(sisa) + ' yd']);
    g.append(mkn('rect', { class: 'e-kartu', x: 12, y: 12, width: 186,
      height: 16 * baris.length + 10, rx: 8 }));
    baris.forEach((b, i) => {
      g.append(txt({ class: 'e-kartuK', x: 22, y: 30 + i * 16 }, b[0]));
      g.append(txt({ class: 'e-kartuV', x: 190, y: 30 + i * 16 }, b[1]));
    });
    L.teks.append(g);
  }

  /* ======================================================================
     Bagian 6 — mesin waktu
     ====================================================================== */
  function animasi(durasi, langkah) {
    return new Promise(resolve => {
      let t0 = null, batal = false;
      const selesai = () => {
        if (batal) return;
        batal = true; lewati = null; langkah(1); resolve();
      };
      lewati = selesai;
      const bingkai = (ts) => {
        if (batal) return;
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / (durasi * 1000));
        langkah(p);
        if (p < 1) requestAnimationFrame(bingkai); else selesai();
      };
      requestAnimationFrame(bingkai);
    });
  }
  const mulus = (p) => p * p * (3 - 2 * p);

  /* ======================================================================
     Bagian 7 — antarmuka yang dipakai golf.js
     ====================================================================== */
  function gambarUlang() {
    latar(); gambarPohon(); gambarGreen(); gambarTik();
    taruhPemain(pemainTerakhir[0], pemainTerakhir[1]);
    taruhBola(bolaTerakhir[0], bolaTerakhir[1], bolaTerakhir[2], true);
  }

  /* Sesudah bola berhenti, kamera merapat ke sisa jarak yang SEBENARNYA.
     Inilah jawaban atas "bolanya kelihatan sudah di green tapi kok masih
     disuruh pilih tongkat": pada bingkai 500 yard, sisa 8 yard memang tak
     terbedakan dari nol. Bendera ikut berpindah karena sisa jarak permainan
     adalah sisi miring -- akar(melenceng^2 + sisa lurus^2) -- sedangkan
     tampilan ini memandang lurus sepanjang garis bola-ke-pin. Yang bergerak
     kameranya, bukan tiangnya, dan karena itu geraknya dianimasikan, tidak
     dipotong. */
  async function rapatKe(sisa) {
    const f0a = f0, spanA = span, vA = vExag, pinA = pinDi;
    const spanB = Math.max(7, sisa * 1.35);
    const f0b = bolaDi - spanB * 0.14;
    const pinB = bolaDi + Math.max(0.5, sisa);
    await animasi(0.6, (t) => {
      const e = mulus(t);
      f0 = f0a + (f0b - f0a) * e;
      span = spanA + (spanB - spanA) * e;
      vExag = vA + (1 - vA) * e;
      pinDi = pinA + (pinB - pinA) * e;
      gambarUlang();
    });
    jejak = [];                       /* lambungan sudah selesai diceritakan */
    gambarUlang();
  }

  const api = {
    aktif: () => hidup,

    /** Dipanggil sekali per ronde: aliran acak sendiri, terpisah dari permainan. */
    benih(b) { acak = window.RETRO.rng((Number(b) || 0) * 7919 + 104729); },

    pasang(el) { bangun(el); },

    /** Lubang baru: tanam pohon, taruh bendera, pemain berdiri di tee. */
    lubangBaru(panjang) {
      if (!svg) return;
      if (!acak) api.benih(1);
      bolaDi = 0; pinDi = panjang;
      tanamPohon(panjang);
      api.diam(panjang);
    },

    /** Gambar keadaan diam: pemain di posisi bola, bendera di sisa jarak. */
    diam(sisa, sudahDipukul) {
      if (!svg) return;
      diGreen = false;
      pinDi = bolaDi + Math.max(1, sisa);
      span = Math.max(46, Math.max(1, sisa) * 1.14);
      f0 = bolaDi;
      vExag = 1;
      latar(); gambarPohon(); gambarGreen(); gambarTik();
      bikinPemain(); bikinBola();
      taruhPemain(0, 0);
      taruhBola(bolaDi, 0, sudahDipukul ? '' : 'BOLA');
    },

    /**
     * Satu pukulan penuh.
     * @param o {dist, F, sisaSebelum, medan, air, label}
     * @returns Promise
     */
    async pukul(o) {
      if (!svg) return null;
      const p = hitungPukulan(o.dist, o.F);
      diGreen = false;
      /* Bendera dipatok ulang dari sisa jarak yang dilaporkan permainan,
         supaya gambar dan angka di papan selalu bercerita hal yang sama. */
      pinDi = bolaDi + Math.max(1, o.sisaSebelum);
      bolaSebelum = bolaDi;
      /* Bingkai dikunci SEBELUM bola bergerak, jadi tidak ada perubahan
         skala di tengah lambungan. Kalau pukulannya melewati bendera,
         bingkainya dilebarkan sekarang, selagi bola masih diam. */
      span = Math.max(46, Math.max(o.sisaSebelum, p.total) * 1.14);
      f0 = bolaDi;
      const skalaH = (W - 34 - X0) / span;
      /* Tinggi dilebihkan hanya sebanyak yang perlu supaya puncaknya
         terbaca, dan faktornya ditulis di layar. */
      vExag = Math.max(1, Math.min(5, 112 / Math.max(6, p.apeks * skalaH)));
      vExag = Math.round(vExag * 10) / 10;
      latar(); gambarPohon(); gambarGreen(); gambarTik();
      bikinPemain(); bikinBola();
      hidup = true;

      /* --- ayunan ------------------------------------------------------ */
      /* Tanda rotasi. Di SVG sumbu-y menunjuk ke BAWAH, jadi rotate() dengan
         sudut positif terlihat SEARAH jarum jam di layar. Kepala stik saat
         siap ada di kanan-bawah bahu, di lokal (16, 52); untuk terangkat ke
         belakang ia harus menempuh kanan-bawah -> bawah -> kiri -> kiri-atas,
         yaitu searah jarum jam, yaitu sudut POSITIF.

           sudut   kepala stik (lokal)   di layar
             0      ( 16,  52)           di bola
           + 90     (-52,  16)           mendatar ke belakang
           +190     (-25, -48)           puncak ayunan mundur
           -165     ( -2, -54)           akhir gerak lanjut, di atas bahu

         Versi pertama memakai -192 dan +168, jadi stiknya menyapu ke DEPAN
         lebih dulu lalu berputar balik -- ayunan yang terbalik. */
      const ATAS = 190, AKHIR = -168;
      await animasi(0.72, (t) => {                 /* mundur, melambat di atas */
        const e = 1 - Math.pow(1 - t, 2.2);
        taruhPemain(ATAS * e, -9 * e);
        taruhBola(bolaDi, 0, '');
      });
      await animasi(0.12, () => {});               /* diam sesaat di puncak    */
      await animasi(0.19, (t) => {                 /* turun, makin cepat       */
        const e = t * t;
        taruhPemain(ATAS * (1 - e), -9 * (1 - e) + 4 * e);
        taruhBola(bolaDi, 0, '');
      });
      if (o.bunyi) try { window.RETRO.audio.sound(150, 0.9); } catch (e) {}

      /* --- lambungan, bersamaan dengan gerak lanjut ---------------------- */
      jejak = [];
      const tTerbang = Math.max(0.5, p.detik * LAJU);
      let tLanjut = 0;
      await animasi(tTerbang, (t) => {
        /* gerak lanjut selesai dalam 0,5 detik pertama penerbangan */
        tLanjut = Math.min(1, t * tTerbang / 0.5);
        taruhPemain(AKHIR * mulus(tLanjut), 4 + 8 * mulus(tLanjut));
        /* u maju lebih cepat di awal: hambatan udara memperlambat bola */
        const u = 1 - Math.pow(1 - t, 1.18);
        const yd = bolaDi + p.carry * u;
        taruhBola(yd, p.y(u), Math.round(yd - bolaDi) + ' yd');
      });

      /* --- pendaratan ---------------------------------------------------- */
      if (o.air) {
        cipratan(bolaDi + p.carry);
        if (o.bunyi) try { window.RETRO.audio.sound(90, 3); } catch (e) {}
        await animasi(0.55, () => {});
      } else {
        if (o.bunyi) try { window.RETRO.audio.sound(230, 0.7); } catch (e) {}
        const dari = bolaDi + p.carry, gel = p.gelinding;
        /* dua pantulan lalu menggelinding; wedge hampir tidak bergerak */
        const tahap = [
          { bagi: 0.46, tinggi: p.apeks * 0.10, dur: 0.34 },
          { bagi: 0.26, tinggi: p.apeks * 0.035, dur: 0.24 },
          { bagi: 0.28, tinggi: 0, dur: 0.42 }
        ];
        let jalan = 0;
        for (const s of tahap) {
          const a = dari + gel * jalan, b = dari + gel * (jalan + s.bagi);
          jalan += s.bagi;
          await animasi(Math.max(0.12, s.dur * Math.min(1, gel / 12 + 0.25)), (t) => {
            const yd = a + (b - a) * (s.tinggi ? t : 1 - Math.pow(1 - t, 2));
            taruhBola(yd, s.tinggi * Math.sin(Math.PI * t), '');
          });
        }
      }
      bolaDi += o.air ? p.carry : p.total;
      taruhBola(bolaDi, 0, o.medan ? o.medan.toUpperCase() : '');
      kartu(p, o.sisaSesudah);
      /* Merapat ke sisa jarak sebenarnya supaya angka dan gambar sepakat. */
      if (!o.air && o.sisaSesudah != null && o.sisaSesudah > 0.5) await rapatKe(o.sisaSesudah);
      hidup = false; lewati = null;
      return p;
    },

    /** Bola masuk air / OB: baris 1420 memukul dari tempat yang sama lagi. */
    kembali(sisa) {
      bolaDi = bolaSebelum;
      api.diam(sisa, true);
    },

    /** Bola sampai di green: kamera merapat lagi, sekarang dalam KAKI.
        Perjalanannya jadi satu perbesaran menerus dari 500 yard ke 10 kaki,
        dan tidak ada lagi titik di mana pemain harus menebak apakah ia
        sudah sampai. */
    green(kaki) {
      if (!svg) return;
      diGreen = true;
      const yd = Math.max(1, kaki) / 3;
      pinDi = bolaDi + yd;
      span = Math.max(3, yd * 1.9);
      f0 = bolaDi - span * 0.12;
      vExag = 1;
      jejak = [];
      latarGreen(); gambarTik();
      bikinPemain(); bikinBola();
      taruhPemain(0, 0);
      taruhBola(bolaDi, 0, Math.round(kaki) + ' FT', true);
      L.teks.append(txt({ class: 'e-tutup', x: W / 2, y: 34 }, 'ON THE GREEN'));
    },

    /** Bola bergulir di green. `kaki` bertanda: minus = sudah melewati lubang. */
    puttKe(kaki) {
      if (!svg || !elBola) return;
      taruhBola(pinDi - kaki / 3, 0, Math.abs(Math.round(kaki)) + ' FT', true);
    },

    /** Dipakai golf.js untuk menganimasikan putt di peta green. */
    gerak(durasi, langkah) { return animasi(durasi, langkah); },

    fisika: hitungPukulan
  };

  function cipratan(yd) {
    const x = px(yd), g = mkn('g', {});
    for (let i = 0; i < 7; i++) {
      const a = -0.35 - i * 0.35;
      g.append(mkn('line', { class: 'e-cipratan', x1: x, y1: GND - 4,
        x2: x + Math.cos(a) * (10 + i * 2.5), y2: GND - 4 + Math.sin(a) * (14 + i * 2) }));
    }
    g.append(mkn('ellipse', { class: 'e-cipratanDasar', cx: x, cy: GND - 2, rx: 15, ry: 4 }));
    L.teks.append(g);
  }

  window.RETRO = window.RETRO || {};
  window.RETRO.GOLFSCENE = api;
})();
