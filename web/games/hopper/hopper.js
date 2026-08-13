/* ===========================================================================
   hopper.js — port dari HOPPER.EXE (penulis tidak diketahui, ≤1991).

   Basisnya `decompile/HOPPER/hopper-run.bas` — 394 baris hasil rekompilasi,
   berjalan sampai GAME OVER, NOL panggilan runtime tak tertangani.

   ------------------------------------------------------------------------
   TEMUAN 1 — PROGRAM BASIC YANG MENYUNTIKKAN ASSEMBLY KE DIRINYA SENDIRI

   Tiga belas pernyataan `DATA` berisi 232 angka. Program membacanya dengan
   `READ`, mem-`POKE` satu per satu ke memori bebas yang dihitungnya sendiri,
   lalu memanggilnya:

       550  DEF SEG : F4! = INT(CSNG(PEEK(779)*256 + PEEK(778) + 514) * .0625)
       590  READ F6! : POKE CINT(F3!), (CINT(F6!)) AND 255
       8580 DEF SEG = CINT(F4!) : CALL I1%

   Ketiga belas `DATA` itu cocok PERSIS dengan teksnya di segmen data biner,
   dan bytenya dibongkar menjadi penggulung layar CGA yang sah: `std` untuk
   salinan mundur, dan `mul bx` dengan 0x1E0 = 480 = enam baris x 80 bita.

   Dijalankan langsung di emulator, ia menggeser jalur **8 piksel mendatar**.
   Kadensinya sekali per bingkai, tepat sesudah `PUT` menggambar kataknya.

   Kenapa serumit itu? Karena BASIC tidak bisa menggulung sebagian layar. Satu
   `PUT` per kendaraan sudah lambat; menggulung sebelas jalur tiap bingkai
   mustahil. Jadi penulisnya menulis assembly, mengubahnya jadi angka desimal,
   dan menempelkannya sebagai `DATA`.

   ------------------------------------------------------------------------
   TEMUAN 2 — TABEL KECEPATAN SEBELAS JALUR, TERBACA UTUH

   Di dalam 232 bita itu, offset 5..15 bukan kode melainkan parameter:

       [1, -1, 2, -1, 2, 0, 1, -1, 2, -2, -1]

   Sebelas jalur, arah berselang-seling, satuannya BITA layar (satu bita =
   empat piksel). Yang keenam **nol** — jalur diam. Itu median strip Frogger,
   dan ia terbaca dari data, bukan dari melihat layar.

   ------------------------------------------------------------------------
   TEMUAN 3 — MAKRO DRAW-NYA ASLI, TAPI BUKAN ASET YANG DIPAKAI

   Enam string `DRAW` byte-identik dengan deskriptor di biner:

       S4$ = "C3F3DFD2GDGL2H2UE2G3HBD2D0GBU2LHU2E4RE"        katak
       S5$ = "C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF2"        batang kayu

   `DRAW` bahasa makro penggerak pena GW-BASIC, dan penafsirnya ada di berkas
   ini — tapi ia TIDAK dipakai menggambar apa pun di layar.

   Versi pertama memakainya, dan hasilnya buruk. Makro-makro itu sprite CGA
   seukuran 11x10 PIKSEL; ditumpangkan sebagai garis tipis di atas kotak, yang
   keluar coretan, bukan gambar. Dilaporkan pemilik proyek, dan benar.

   Jadi seluruh rupa di halaman ini digambar ulang — bentuk vektor yang dirancang
   untuk ukuran layar ini. Penafsirnya tetap dijalankan untuk MELAPORKAN angka di
   panel (21 ruas, kotak 11x10), karena angka itu harus hasil penafsiran, bukan
   angka yang saya ketik. Temuan bahwa string-stringnya byte-identik dengan biner
   tetap berdiri; yang berubah cuma bahwa ia tidak lagi jadi aset.

   ------------------------------------------------------------------------
   TEMUAN 4 — LOGIKANYA TIDAK PERNAH MEMBACA LAYAR

   Diukur dengan kait pada tiap pembacaan memori dari B800 selama 150 juta
   instruksi: **21.873 pembacaan total, NOL dari kode pengguna**. Berbeda dari
   PAC-GAL, yang seluruh deteksi tabrakannya bersandar pada `SCREEN()`.

   Artinya penggulung itu memindahkan piksel dan tidak lebih; keadaan permainan
   hidup di variabel. Jadi menggantinya dengan animasi di port ini TIDAK
   mengubah aturan apa pun — dan itu perlu diukur dulu sebelum boleh dilakukan.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, loop, rng } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const db = store('hopper');
  const D = window.RETRO.HOPPER;

  // =========================================================================
  // Penafsir makro DRAW GW-BASIC
  // =========================================================================
  /* Delapan arah, dan itu yang membuat DRAW ringkas: diagonal punya hurufnya
     sendiri, jadi bentuk miring tidak perlu dua perintah. */
  const LANGKAH = {
    U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0],
    E: [1, -1], F: [1, 1], G: [-1, 1], H: [-1, -1]
  };

  /* Mengembalikan { d, warna, kotak } — `d` sebuah atribut path SVG.

     `B` awalan "pindah tanpa menggambar"; ia yang membuat satu string bisa
     memuat beberapa goresan terpisah. Karena itu hasilnya bukan satu garis
     melainkan rentetan sub-jalur, dan tiap `B` memulai `M` yang baru. */
  function tafsirDraw(makro) {
    let x = 0, y = 0, warna = 1;
    let d = '', pena = false;
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    const catat = () => {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    };
    let i = 0;
    const s = makro.toUpperCase();
    while (i < s.length) {
      let buta = false;
      if (s[i] === 'B') { buta = true; i++; }
      if (s[i] === 'N') { i++; }              // gambar lalu kembali (tak dipakai di sini)
      const c = s[i++];
      if (c === undefined) break;
      let n = '';
      while (i < s.length && s[i] >= '0' && s[i] <= '9') n += s[i++];
      const k = n === '' ? 1 : parseInt(n, 10);

      if (c === 'C') { warna = k; continue; }
      if (c === 'S' || c === 'A' || c === 'T') continue;   // skala/sudut: tak dipakai
      const arah = LANGKAH[c];
      if (!arah) continue;
      // `L0`, `R0` dan kawan-kawan muncul di string asli. Panjang nol berarti
      // "tandai titik ini" -- di CGA ia menyalakan satu piksel.
      const dx = arah[0] * k, dy = arah[1] * k;
      if (buta) {
        x += dx; y += dy; pena = false;
      } else {
        if (!pena) { d += 'M' + x + ' ' + y + ' '; pena = true; }
        x += dx; y += dy;
        d += 'L' + x + ' ' + y + ' ';
      }
      catat();
    }
    return { d: d.trim(), warna, kotak: { minX, maxX, minY, maxY } };
  }

  // =========================================================================
  // Dunia
  // =========================================================================
  const LEBAR = 320, TINGGI = 200;      // resolusi CGA mode 4
  const JALUR = D.kecepatan;            // sebelas jalur, dari tabel penggulung
  const NJ = JALUR.length;              // 11
  const TJ = 13;                        // tinggi jalur, piksel
  const Y0 = 34;                        // baris pertama jalur
  const Y_RUMAH = Y0 - 16;              // slot tujuan di atas
  const Y_MULAI = Y0 + NJ * TJ + 6;     // baris awal katak
  const KOL = 16;                       // langkah katak mendatar
  const MEDIAN = JALUR.indexOf(0);      // jalur diam = median strip

  const SLOT = [1, 4, 7, 10, 13];       // lima rumah, dalam satuan kolom

  /* Enam warna kendaraan. Jumlahnya bukan enam karena bagus di mata melainkan
     karena harus LEBIH BANYAK dari kendaraan terpadat di satu jalur (4), supaya
     pemilihan tanpa ulang di bawah selalu punya sisa. */
  const WARNA = ['#d9483f', '#e0a02c', '#8c5bd6', '#2f9bd8', '#3fae72', '#d8607f'];

  /* --- level ---------------------------------------------------------------
     Yang ADA di biner: satu dial kesulitan yang ditanya di awal, dua sumbu --

         1360 PRINT USING "Enter Skill Level (1-4) [#]: " ... INPUT F21!
              PRINT USING "Enter Speed (1-500)  [####]: " ... INPUT F22!

     Jadi kesulitan memang punya sumbu KECEPATAN di aslinya, bawaannya 100 dan
     batas atasnya 500. Yang TIDAK ada buktinya: naik level otomatis sesudah
     kelima rumah terisi. Aslinya berhenti dengan GAME OVER, dan angka 1-4 itu
     dipilih pemain, bukan dinaikkan program.

     Maka bagian ini REKONSTRUKSI, dan cara paling jujur menyusunnya adalah
     berjalan di sumbu yang aslinya sudah punya, bukan mengarang sumbu baru:
     kelipatan lajunya berhenti di 5,0 karena 500/100 itulah langit-langit dial
     aslinya. Yang saya tambahkan cuma "siapa yang memutar dialnya". */
  const LAJU_MAKS = 500 / 100;          // langit-langit dial aslinya
  const LAJU_NAIK = 0.18;               // per level, rekonstruksi
  const WAKTU_AWAL = 90, WAKTU_MIN = 45, WAKTU_TURUN = 5;

  let katak, isiJalur, skor, nyawa, waktu, mainLoop, acak, sampai;
  let level, waktuAwal;

  /* Fase permainan. Sebelumnya cuma ada "main" dan "selesai", dan itulah sebab
     kelima rumah terisi terasa seperti program menggantung: tidak ada keadaan
     untuk "sedang menampilkan sesuatu, permainan belum lanjut". */
  const FASE = { MAIN: 'main', GEPENG: 'gepeng', NYEMPLUNG: 'nyemplung',
                 TUNTAS: 'tuntas', USAI: 'usai' };
  let fase, faseT, faseData;

  function mulaiFase(f, data) { fase = f; faseT = 0; faseData = data || null; }

  function bangunJalur() {
    const laju = Math.min(LAJU_MAKS, 1 + LAJU_NAIK * (level - 1));
    isiJalur = JALUR.map((v, i) => {
      // Sungai di ATAS median, jalan di bawah. Panjang benda berbeda supaya
      // jalur terbaca berbeda tanpa keterangan.
      const sungai = i < MEDIAN;
      const n = 3 + (i % 2);
      const panjang = sungai ? 56 + (i % 3) * 16 : (i % 3 === 0 ? 40 : 22);
      const benda = [];
      /* Warna dipilih PER KENDARAAN, bukan per jalur. Caranya kocok daftar
         warna lalu ambil n pertama: karena n paling banyak 4 dan warnanya 6,
         tidak akan ada dua kendaraan sewarna di satu jalur -- termasuk pasangan
         pertama-terakhir, yang bersebelahan setelah membungkus di tepi layar.
         Memilih acak satu per satu tidak menjamin itu. */
      const warna = acak.shuffle(WARNA.map((_, w) => w));
      for (let k = 0; k < n; k++)
        benda.push({ x: (k * LEBAR / n + i * 23 + acak.int(19)) % LEBAR, w: panjang,
                     warna: warna[k] });
      // bita -> piksel, dibagi enam bingkai, lalu dikali laju level
      return { sungai, benda, v: v * 4 / 6 * laju };
    });
    return laju;
  }

  function reset(penuh) {
    if (penuh) {
      skor = 0; nyawa = 4; level = 1; sampai = new Set();
      acak = rng(Date.now() & 0xffff);
      bangunJalur();
    }
    waktuAwal = Math.max(WAKTU_MIN, WAKTU_AWAL - WAKTU_TURUN * (level - 1));
    katak = { x: LEBAR / 2 - KOL / 2, y: Y_MULAI, diBenda: null };
    waktu = waktuAwal;
    mulaiFase(FASE.MAIN);
  }

  // =========================================================================
  // Gambar — rupa sendiri, BUKAN aset aslinya
  // =========================================================================
  /* Versi pertama menafsirkan makro `DRAW` aslinya dan menggambar hasilnya
     langsung ke layar. Itu ide yang menarik dan hasilnya buruk: makro-makro itu
     dirancang sebagai sprite CGA seukuran 11x10 PIKSEL, dan menumpangkannya
     sebagai garis tipis di atas kotak menghasilkan coretan, bukan gambar.
     Dilaporkan pemilik proyek, dan benar.

     Jadi seluruh rupa di sini digambar ulang: bentuk vektor yang dirancang untuk
     dilihat pada ukuran layar ini. Makro `DRAW` aslinya tetap didokumentasikan di
     panel kanan sebagai TEMUAN -- ia tetap byte-identik dengan biner -- tapi ia
     tidak lagi dipakai menggambar apa pun.

     Prinsip 2 `_teknik-svg.md` dipakai penuh: tiap bentuk didefinisikan SEKALI
     di <defs> dalam kotak yang bulat, lalu dipanggil <use> dengan translate dan
     scale. Satu definisi katak dipakai satu kali, satu definisi mobil dipakai
     lima belas kali. */
  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function siapkanBentuk(defs) {
    // --- air bergelombang, sebagai pola ---------------------------------
    const pola = el('pattern', {
      id: 'h-air', width: 24, height: 13, patternUnits: 'userSpaceOnUse'
    });
    pola.append(el('rect', { width: 24, height: 13, fill: '#12496e' }));
    pola.append(el('path', {
      d: 'M0 4 q6 -3 12 0 t12 0 M0 9 q6 -3 12 0 t12 0',
      fill: 'none', stroke: '#1b6390', 'stroke-width': 1
    }));
    defs.append(pola);

    // --- KATAK, dilihat dari atas ---------------------------------------
    /* Digambar menghadap ATAS (arah lompat maju), lalu diputar di tempat
       pemakaian. Kotak kerjanya -8..8 supaya titik putarnya di tengah badan. */
    const katak = el('g', { id: 'b-katak' });
    // kaki belakang
    katak.append(el('path', {
      d: 'M-5 3 q-4 1 -5 5 q3 1 5 -1 M5 3 q4 1 5 5 q-3 1 -5 -1',
      fill: '#3aa14a', stroke: '#1f6b2c', 'stroke-width': .7
    }));
    // kaki depan
    katak.append(el('path', {
      d: 'M-5 -3 q-4 -1 -5 -4 q3 -1 5 1 M5 -3 q4 -1 5 -4 q-3 -1 -5 1',
      fill: '#3aa14a', stroke: '#1f6b2c', 'stroke-width': .7
    }));
    // badan
    katak.append(el('ellipse', {
      cx: 0, cy: 1, rx: 5.2, ry: 6, fill: '#4cc95c', stroke: '#1f6b2c',
      'stroke-width': .8
    }));
    // punggung lebih terang
    katak.append(el('ellipse', { cx: 0, cy: 2, rx: 3, ry: 3.6, fill: '#63e070' }));
    // kepala
    katak.append(el('ellipse', { cx: 0, cy: -4.4, rx: 4.2, ry: 3, fill: '#4cc95c',
      stroke: '#1f6b2c', 'stroke-width': .8 }));
    // mata menonjol, ciri paling khas katak dari atas
    [-2.2, 2.2].forEach(dx => {
      katak.append(el('circle', { cx: dx, cy: -5.8, r: 1.9, fill: '#eaffe9',
        stroke: '#1f6b2c', 'stroke-width': .6 }));
      katak.append(el('circle', { cx: dx, cy: -5.8, r: .9, fill: '#12220f' }));
    });
    defs.append(katak);

    // --- KATAK GEPENG, sesudah terlindas ---------------------------------
    /* Bukan katak yang dipipihkan lewat `scale`. Dicoba dulu begitu dan hasilnya
       salah: memipihkan bentuk utuh membuat matanya jadi dua garis rapi, padahal
       justru mata yang harus BERUBAH -- itu satu-satunya isyarat "mati", bukan
       sekadar "pendek". Jadi bentuknya sendiri, dengan cipratan tak beraturan
       dan mata silang. Peralihannya lintas-pudar, lihat `gambarGepeng`. */
    const gepeng = el('g', { id: 'b-gepeng' });
    gepeng.append(el('path', {                       // cipratan, sengaja tak simetris
      d: 'M-11 1 q-1.5 -3 1.5 -3.2 q2 -2.4 5 -1.4 q1.6 -2.2 4 -1 q3.4 -1.6 5.6 .8'
       + ' q3.4 -.4 3.2 2 q2.6 1 1 2.6 q-2 2 -5.4 1.4 q-3 1.6 -6 .4'
       + ' q-3.6 1.2 -6 -.6 q-2.6 .2 -3 -1 z',
      fill: '#3f9c4c', stroke: '#1f6b2c', 'stroke-width': .7
    }));
    gepeng.append(el('path', {                       // anggota badan yang terjulur
      d: 'M-9 0 l-3.6 2.2 M8.6 -.6 l3.8 1.8 M-4 2 l-1.4 3 M4.6 1.6 l1.6 3',
      stroke: '#2b7c39', 'stroke-width': 1.3, 'stroke-linecap': 'round'
    }));
    [-3.4, 2.6].forEach(dx => {                      // mata silang
      gepeng.append(el('circle', { cx: dx, cy: -1.4, r: 1.7, fill: '#eaffe9' }));
      gepeng.append(el('path', {
        d: 'M' + (dx - 1) + ' -2.4 l2 2 M' + (dx + 1) + ' -2.4 l-2 2',
        stroke: '#12220f', 'stroke-width': .8, 'stroke-linecap': 'round'
      }));
    });
    defs.append(gepeng);

    /* Katak yang tenggelam dilihat DARI ATAS PERMUKAAN: airnya menyaring warna
       dan mengaburkan tepinya. Satu filter murah mengerjakan keduanya sekaligus
       -- dikaburkan, lalu digeser warnanya lewat matriks.

       Angkanya sudah sekali direvisi. Versi pertama MENGGELAPKAN (.45/.70/1.1
       tanpa angkat kecerahan) supaya "terasa" di bawah air; hasilnya hijau tua di
       atas biru tua, dan pada tangkapan bingkai kataknya praktis hilang. Padahal
       yang diminta justru MELIHAT ia terbawa arus. Jadi matriksnya sekarang
       mengangkat, bukan menenggelamkan: hijaunya dinaikkan dan biru ditambah,
       hasilnya hijau-toska terang yang menonjol di atas air. */
    const kabur = el('filter', {
      id: 'h-tenggelam', x: '-60%', y: '-60%', width: '220%', height: '220%'
    });
    kabur.append(el('feGaussianBlur', { stdDeviation: .45 }));
    kabur.append(el('feColorMatrix', { type: 'matrix', values:
      '.55 0 0 0 .02  0 .95 0 0 .08  0 .18 1 0 .16  0 0 0 1 0' }));
    defs.append(kabur);

    // --- BATANG KAYU -----------------------------------------------------
    /* Panjangnya berubah-ubah, jadi bentuknya dibangun dari tiga bagian yang
       bisa diregangkan: dua tutup ujung dan satu badan. Meregangkan seluruh
       bentuk akan memipihkan lingkaran ujungnya jadi elips aneh. */
    const kayu = el('g', { id: 'b-kayu' });
    kayu.append(el('rect', { x: 0, y: -4.5, width: 100, height: 9, rx: 2,
      fill: '#7d5230' }));
    kayu.append(el('path', { d: 'M4 -2 H96 M4 1.6 H96', stroke: '#9a6a41',
      'stroke-width': 1, fill: 'none', 'stroke-linecap': 'round' }));
    defs.append(kayu);

    const tutup = el('g', { id: 'b-tutup' });
    tutup.append(el('ellipse', { cx: 0, cy: 0, rx: 2.6, ry: 4.5, fill: '#5e3d24' }));
    tutup.append(el('ellipse', { cx: 0, cy: 0, rx: 1.3, ry: 2.4, fill: '#8a5c36' }));
    defs.append(tutup);

    // --- KENDARAAN --------------------------------------------------------
    /* Dua bentuk: mobil pendek dan truk panjang. Keduanya digambar menghadap
       KANAN dan dicerminkan lewat scale(-1,1) untuk jalur yang berlawanan --
       satu definisi, dua arah. */
    const mobil = el('g', { id: 'b-mobil' });
    mobil.append(el('rect', { x: 1, y: -5.6, width: 4, height: 11.2, rx: 1, fill: '#111' }));
    mobil.append(el('rect', { x: 15, y: -5.6, width: 4, height: 11.2, rx: 1, fill: '#111' }));
    mobil.append(el('rect', { x: 0, y: -4.6, width: 22, height: 9.2, rx: 2.6,
      fill: 'currentColor' }));
    mobil.append(el('path', { d: 'M12 -3.4 h5 l2.4 3.4 l-2.4 3.4 h-5 z',
      fill: '#cfe8ff', opacity: .9 }));
    mobil.append(el('rect', { x: 3, y: -3.2, width: 6, height: 6.4, rx: 1.2,
      fill: '#000', opacity: .18 }));
    mobil.append(el('circle', { cx: 21, cy: 0, r: 1.1, fill: '#ffe9a8' }));
    defs.append(mobil);

    const truk = el('g', { id: 'b-truk' });
    truk.append(el('rect', { x: 2, y: -5.8, width: 4, height: 11.6, rx: 1, fill: '#111' }));
    truk.append(el('rect', { x: 22, y: -5.8, width: 4, height: 11.6, rx: 1, fill: '#111' }));
    truk.append(el('rect', { x: 32, y: -5.8, width: 4, height: 11.6, rx: 1, fill: '#111' }));
    truk.append(el('rect', { x: 0, y: -4.8, width: 30, height: 9.6, rx: 1.6,
      fill: '#d8d2c4' }));                       // bak
    truk.append(el('path', { d: 'M2 -3.4 h26 M2 3.4 h26', stroke: '#b3ac9c',
      'stroke-width': .8, fill: 'none' }));
    /* Lis warna sepanjang bak. Tanpa ini warna truk cuma tampak di kabin yang
       selebar 11 -- terlalu kecil untuk terbaca sebagai "truk yang berbeda". */
    truk.append(el('rect', { x: 0, y: -1.6, width: 30, height: 3.2,
      fill: 'currentColor' }));
    truk.append(el('rect', { x: 29, y: -4.8, width: 11, height: 9.6, rx: 2,
      fill: 'currentColor' }));                  // kabin
    truk.append(el('path', { d: 'M33 -3.2 h4 l2.4 3.2 l-2.4 3.2 h-4 z',
      fill: '#cfe8ff', opacity: .9 }));
    defs.append(truk);

    // --- TERATAI (slot rumah terisi) -------------------------------------
    const teratai = el('g', { id: 'b-teratai' });
    teratai.append(el('path', {
      d: 'M0 -7 A7 7 0 1 1 -1.6 -6.8 L0 0 Z', fill: '#2f8f4e', transform: 'rotate(90)'
    }));
    teratai.append(el('circle', { cx: 0, cy: 0, r: 7, fill: '#37a85c' }));
    teratai.append(el('path', { d: 'M0 0 L0 -7 M0 0 L6 3 M0 0 L-6 3',
      stroke: '#2a7a45', 'stroke-width': .8 }));
    defs.append(teratai);
  }

  let lapis;

  function gambar() {
    while (lapis.firstChild) lapis.firstChild.remove();

    // --- latar: tepian, sungai, median, jalan ---------------------------
    lapis.append(el('rect', { x: 0, y: 0, width: LEBAR, height: TINGGI, fill: '#0b1220' }));

    // tepian atas (di belakang slot rumah)
    lapis.append(el('rect', { x: 0, y: 0, width: LEBAR, height: Y_RUMAH + 14,
      fill: '#1d4a2c' }));

    isiJalur.forEach((j, i) => {
      const y = Y0 + i * TJ;
      if (i === MEDIAN) {
        lapis.append(el('rect', { x: 0, y, width: LEBAR, height: TJ, fill: '#2b6b3c' }));
        // rumput: titik-titik pendek, cukup untuk membedakan dari air/aspal
        for (let x = 3; x < LEBAR; x += 9)
          lapis.append(el('path', {
            d: 'M' + x + ' ' + (y + TJ - 2) + ' l1.6 -3.4 M' + (x + 3) + ' '
              + (y + TJ - 2) + ' l-1.4 -2.8',
            stroke: '#3f8f52', 'stroke-width': .9, fill: 'none'
          }));
        return;
      }
      if (j.sungai) {
        lapis.append(el('rect', { x: 0, y, width: LEBAR, height: TJ, fill: 'url(#h-air)' }));
      } else {
        lapis.append(el('rect', { x: 0, y, width: LEBAR, height: TJ, fill: '#26262c' }));
        // garis putus-putus di tengah jalur
        lapis.append(el('path', {
          d: 'M0 ' + (y + TJ / 2) + ' H' + LEBAR,
          stroke: '#5a5a62', 'stroke-width': .8, 'stroke-dasharray': '6 7', fill: 'none'
        }));
      }
    });

    // tepian bawah, tempat katak mulai
    lapis.append(el('rect', { x: 0, y: Y0 + NJ * TJ, width: LEBAR,
      height: TINGGI - (Y0 + NJ * TJ), fill: '#1d4a2c' }));

    // --- slot rumah ------------------------------------------------------
    SLOT.forEach((c, i) => {
      const x = c * 20 + 6, w = 28;
      lapis.append(el('rect', { x, y: Y_RUMAH, width: w, height: 15, rx: 3,
        fill: '#0d2a17', stroke: '#4fbf7d', 'stroke-width': 1 }));
      if (sampai.has(i))
        lapis.append(el('use', { href: '#b-teratai', x: x + w / 2, y: Y_RUMAH + 7.5,
          transform: 'translate(0,0) scale(1)' }));
    });

    // --- benda di jalur --------------------------------------------------
    isiJalur.forEach((j, i) => {
      if (i === MEDIAN) return;
      const yc = Y0 + i * TJ + TJ / 2;
      j.benda.forEach(b => {
        if (j.sungai) {
          const g = el('g', { transform: 'translate(' + b.x + ',' + yc + ')' });
          g.append(el('use', { href: '#b-kayu',
            transform: 'scale(' + (b.w / 100) + ',1)' }));
          g.append(el('use', { href: '#b-tutup', x: 1.5, y: 0 }));
          g.append(el('use', { href: '#b-tutup', x: b.w - 1.5, y: 0 }));
          lapis.append(g);
        } else {
          const panjang = b.w >= 40 ? 40 : 22;
          const bentuk = b.w >= 40 ? '#b-truk' : '#b-mobil';
          const kanan = j.v > 0;
          const g = el('g', {
            class: 'h-kendaraan', style: 'color:' + WARNA[b.warna],
            transform: 'translate(' + (b.x + (kanan ? 0 : panjang)) + ',' + yc + ')'
              + (kanan ? '' : ' scale(-1,1)')
          });
          g.append(el('use', { href: bentuk }));
          lapis.append(g);
        }
      });
    });

    // --- katak, atau animasi matinya --------------------------------------
    if (fase === FASE.GEPENG) gambarGepeng();
    else if (fase === FASE.NYEMPLUNG) gambarNyemplung();
    else gambarKatak(katak.x, katak.y, 1, 1, 1);
  }

  const jepit = (t) => Math.max(0, Math.min(1, t));

  /* `katak.y` adalah TITIK TENGAH kataknya, bukan tepi atasnya.
     Versi sebelumnya menggambar di `y + 6`, seolah y itu tepi atas. Akibatnya
     kataknya turun 6 piksel dari sebelas tinggi jalur -- hampir setengah jalur --
     dan duduk di perbatasan, bukan di dalam jalurnya. Tabrakan tetap benar
     (logikanya memakai `y`, bukan gambarnya), tapi yang DILIHAT pemain tidak
     cocok dengan yang dihitung: mobil membunuh saat tampak belum menyentuh.
     Cacat ini sudah ada sejak versi pertama dan baru ketahuan setelah bingkainya
     dipotong rapat dan benar-benar dilihat. */
  function gambarKatak(x, y, sx, sy, alpha) {
    const g = el('g', {
      class: 'h-katak', opacity: alpha,
      transform: 'translate(' + (x + KOL / 2) + ',' + y + ') '
        + 'scale(' + (1.05 * sx) + ',' + (1.05 * sy) + ')'
    });
    g.append(el('use', { href: '#b-katak' }));
    lapis.append(g);
  }

  // =========================================================================
  // Animasi mati
  // =========================================================================
  /* Dua sebab kematian, dua animasi, dan itu bukan hiasan: di Frogger air dan
     jalan MEMBUNUH DENGAN CARA BERBEDA, dan kalau keduanya cuma "katak hilang,
     katak muncul lagi", pemain kehilangan satu-satunya umpan balik yang
     memberitahu KESALAHAN MANA yang barusan ia buat. */
  const T_GEPENG = 1.15;                // pipih, lalu diam sebentar
  const T_PIPIH  = 0.18;                // lama proses memipihnya saja
  const T_HANYUT = 2.8;                 // batas atas; biasanya keluar layar duluan
  const T_CIPRAT = 0.55;                // riak cipratan
  const T_TUNTAS = 2.2;                 // spanduk level tuntas

  function gambarGepeng() {
    const t = jepit(faseT / T_PIPIH);
    // Bekas ban muncul bersamaan dengan pipihnya, jadi sebabnya terbaca.
    lapis.append(el('rect', {
      x: faseData.x - 3, y: faseData.y - 3, width: KOL + 6, height: 7, rx: 3,
      fill: '#000', opacity: .32 * t
    }));
    /* Lintas-pudar, bukan pergantian mendadak: pada t=1 katak utuh sudah
       selebar dan setipis cipratannya, jadi sambungannya tidak terlihat. */
    if (t < 1) gambarKatak(faseData.x, faseData.y, 1 + 0.7 * t, 1 - 0.78 * t, 1 - t);
    const g = el('g', {
      opacity: t,
      transform: 'translate(' + (faseData.x + KOL / 2) + ',' + (faseData.y + 1) + ')'
    });
    g.append(el('use', { href: '#b-gepeng' }));
    lapis.append(g);
  }

  function gambarNyemplung() {
    const xc = faseData.x + KOL / 2, yc = faseData.y;

    // Pusaran yang ikut hanyut bersama kataknya: dua busur berputar. Ini yang
    // menjaga mata tetap menemukannya setelah ia mengecil dan mengabur.
    if (faseT > 0.25) {
      const p = faseT * 3.4 * faseData.arah;
      lapis.append(el('path', {
        d: 'M-8 0 a8 4.5 0 0 1 16 0 M8 1.4 a8 4.5 0 0 1 -16 0',
        fill: 'none', stroke: '#bfe6ff', 'stroke-width': .9,
        'stroke-linecap': 'round', opacity: .5,
        transform: 'translate(' + xc + ',' + yc + ') rotate(' + (p * 57.3 % 360) + ')'
      }));
    }

    // Katak: tenggelam sambil berputar pelan, lalu terseret arus.
    const tenggelam = jepit(faseT / 0.5);
    const g = el('g', {
      opacity: 1 - 0.22 * tenggelam,
      transform: 'translate(' + xc + ',' + (yc + 2 * tenggelam) + ') '
        + 'rotate(' + (faseData.arah * 90 * jepit(faseT / 1.2)) + ') '
        + 'scale(' + (1.05 * (1 - 0.25 * tenggelam)) + ')'
    });
    /* Dipasang bersyarat, TIDAK lewat `el()`: atribut `filter` bernilai "null"
       adalah rujukan yang tidak sah, dan SVG menjawab rujukan filter tak sah
       dengan tidak menggambar elemennya sama sekali -- kataknya akan lenyap,
       bukan sekadar tak berfilter. */
    if (tenggelam > 0.35) g.setAttribute('filter', 'url(#h-tenggelam)');
    g.append(el('use', { href: '#b-katak' }));
    lapis.append(g);

    // Riak: dua lingkaran, yang kedua tertunda, di TITIK MASUK -- bukan di posisi
    // katak sekarang, karena riak tinggal di tempat sedang kataknya hanyut.
    [0, 0.16].forEach(tunda => {
      const u = jepit((faseT - tunda) / T_CIPRAT);
      if (u <= 0 || u >= 1) return;
      lapis.append(el('ellipse', {
        cx: faseData.x0 + KOL / 2, cy: yc, rx: 4 + 26 * u, ry: 2 + 9 * u,
        fill: 'none', stroke: '#cfeaff', 'stroke-width': 1.4 * (1 - u),
        opacity: 0.85 * (1 - u)
      }));
    });

    // Gelembung: tiga, berbeda fase, naik dari katak yang sudah di bawah.
    if (faseT > 0.4) {
      [[0, 3.1], [1.4, 2.2], [-1.8, 4.0]].forEach(([dx, laju], k) => {
        const u = ((faseT - 0.4) * laju + k * 0.37) % 1;
        lapis.append(el('circle', {
          cx: xc + dx + Math.sin(u * 6.3 + k) * 1.4, cy: yc - u * 7,
          r: 1.8 * (1 - u * 0.55), fill: '#eaf7ff', opacity: 0.8 * (1 - u)
        }));
      });
    }
  }

  /* Menulis ke elemen yang MUNGKIN tidak ada. Terdengar berlebihan, dan tidak:
     satu `$('s-level')` yang null pernah melempar dari sini, penangan kliknya
     berhenti sebelum `mainLoop.start()`, dan permainannya tidak pernah mulai --
     sementara kataknya tetap bisa melompat karena `lompat()` menggambar sendiri.
     Yang terlihat: seluruh dunia diam. Panel angka tidak boleh punya kuasa
     sebesar itu atas gelung permainan. */
  function tulis(id, nilai) { const e = $(id); if (e) e.textContent = nilai; }

  function segarkan() {
    const laju = Math.min(LAJU_MAKS, 1 + LAJU_NAIK * (level - 1));
    tulis('s-skor', skor);
    tulis('s-nyawa', '●'.repeat(Math.max(0, nyawa)) || '—');
    tulis('s-waktu', Math.ceil(Math.max(0, waktu)));
    tulis('s-rumah', sampai.size + ' / 5');
    tulis('s-level', level + ' · ×' + laju.toFixed(2).replace('.', ','));
    tulis('s-jalur', JALUR.join(' '));
  }

  // =========================================================================
  // Gelung
  // =========================================================================
  let akum = 0;

  function update(dt) {
    if (fase === FASE.USAI) return;
    akum += dt;

    /* Jalur tetap bergulir SELAMA animasi mati juga. Kalau ikut dibekukan,
       jeda itu terbaca sebagai program menggantung -- persis keluhan yang
       membuat bagian ini ditulis. Dunia yang jalan terus memberitahu pemain
       bahwa yang berhenti cuma dia. */
    isiJalur.forEach(j => {
      if (!j.v) return;
      j.benda.forEach(b => {
        b.x += j.v * dt * 30;
        if (b.x > LEBAR) b.x = -b.w;
        if (b.x < -b.w) b.x = LEBAR;
      });
    });

    if (fase === FASE.MAIN) jalanMain(dt);
    else majuFase(dt);

    if (akum > 0.05) { akum = 0; gambar(); segarkan(); }
  }

  function jalanMain(dt) {
    waktu -= dt;
    if (waktu <= 0) return mati('Waktu habis', diAir(katak.y) ? FASE.NYEMPLUNG : FASE.GEPENG);

    // Katak ikut hanyut kalau sedang di atas batang kayu.
    const ij = jalurDi(katak.y);
    if (ij >= 0 && isiJalur[ij].sungai) {
      const b = bendaDi(ij, katak.x);
      if (b) { katak.x += isiJalur[ij].v * dt * 30; }
      else return mati('Tenggelam', FASE.NYEMPLUNG);
      if (katak.x < -KOL || katak.x > LEBAR) return mati('Hanyut keluar', FASE.NYEMPLUNG);
    } else if (ij >= 0 && ij !== MEDIAN) {
      if (bendaDi(ij, katak.x)) return mati('Tertabrak', FASE.GEPENG);
    }
  }

  function majuFase(dt) {
    faseT += dt;

    if (fase === FASE.GEPENG) {
      if (faseT >= T_GEPENG) lanjutSesudahMati();

    } else if (fase === FASE.NYEMPLUNG) {
      /* Hanyut yang MEMPERCEPAT. Mengikuti kecepatan jalurnya apa adanya secara
         fisika lebih benar, tapi jalur terpelan cuma 20 px/detik: dari tengah
         layar butuh delapan detik untuk keluar, dan delapan detik menunggu
         bukan animasi melainkan hukuman. Jadi arusnya digambarkan menyeret --
         mulai selambat jalurnya, lalu menderas. */
      faseData.x += faseData.arah * (24 + 150 * jepit(faseT / 2.2)) * dt;
      const keluar = faseData.x < -KOL * 2 || faseData.x > LEBAR + KOL;
      if ((faseT > 0.6 && keluar) || faseT >= T_HANYUT) lanjutSesudahMati();

    } else if (fase === FASE.TUNTAS) {
      if (faseT >= T_TUNTAS) naikLevel();
    }
  }

  function lanjutSesudahMati() {
    if (faseData.habis) return usai('GAME OVER — ' + faseData.sebab);
    reset(false);
  }

  const diAir = (y) => {
    const i = jalurDi(y);
    return i >= 0 && isiJalur[i].sungai;
  };

  const jalurDi = (y) => {
    const i = Math.round((y - Y0) / TJ);
    return (i >= 0 && i < NJ && Math.abs(Y0 + i * TJ - y) < TJ * 0.7) ? i : -1;
  };

  function bendaDi(i, x) {
    return isiJalur[i].benda.find(b => x + KOL * 0.7 > b.x && x + KOL * 0.3 < b.x + b.w) || null;
  }

  function mati(sebab, cara) {
    nyawa--;
    audio.play(cara === FASE.NYEMPLUNG ? 'mbl16t200o3cro2bro2g' : 'mbl8t255o3gedco2g');
    ui.toast(sebab);
    const ij = jalurDi(katak.y);
    mulaiFase(cara, {
      sebab,
      x: katak.x, x0: katak.x, y: katak.y,
      // Arah hanyut = arah arus jalurnya. Di jalur diam atau di luar sungai,
      // dipakai arah mana saja yang tidak nol supaya kataknya tetap keluar layar.
      arah: (ij >= 0 && isiJalur[ij].v) ? Math.sign(isiJalur[ij].v) : 1,
      habis: nyawa <= 0
    });
    gambar(); segarkan();
  }

  function usai(pesan) {
    mulaiFase(FASE.USAI);
    mainLoop.stop();
    $('go').textContent = 'Main lagi';
    ui.toast(pesan);
    pesanLayar('GAME OVER', pesan.replace('GAME OVER — ', '') + ' · skor ' + skor,
               'Tekan Main lagi');
    catatSkor(skor);
  }

  // =========================================================================
  // Level
  // =========================================================================
  function tuntasLevel() {
    /* Bonus dihitung DI SINI dan ditunjukkan di spanduk. Menambahkannya diam-diam
       ke skor sambil layar berganti membuat angkanya seperti melompat sendiri. */
    const bonus = 200 + Math.round(waktu) * 10;
    skor += bonus;
    audio.play('mbt180o2l8cego3cl4e');
    mulaiFase(FASE.TUNTAS, { bonus });
    pesanLayar('JALUR TUNTAS', 'Level ' + level + ' · kelima rumah terisi',
               'Bonus +' + bonus + ' · lanjut ke level ' + (level + 1));
    gambar(); segarkan();
  }

  function naikLevel() {
    level++;
    sampai = new Set();
    const laju = bangunJalur();
    reset(false);
    pesanLayar(null);
    ui.toast('Level ' + level + ' — laju ×' + laju.toFixed(2).replace('.', ','));
    gambar(); segarkan();
  }

  function pesanLayar(judul, baris, kaki) {
    const p = $('pesan');
    if (!p) return;                       // alasan sama dengan `tulis` di atas
    if (!judul) { p.hidden = true; p.innerHTML = ''; return; }
    p.hidden = false;
    p.innerHTML = '<strong class="h-pesan__judul"></strong>'
                + '<span class="h-pesan__baris"></span>'
                + '<span class="h-pesan__kaki"></span>';
    p.querySelector('.h-pesan__judul').textContent = judul;
    p.querySelector('.h-pesan__baris').textContent = baris || '';
    p.querySelector('.h-pesan__kaki').textContent = kaki || '';
  }

  function lompat(dx, dy) {
    if (fase !== FASE.MAIN) return;
    const nx = Math.max(0, Math.min(LEBAR - KOL, katak.x + dx * KOL));
    const ny = katak.y + dy * TJ;
    if (ny > Y_MULAI) return;
    katak.x = nx; katak.y = ny;
    if (dy < 0) { skor += 10; audio.sound(880, 1); }

    if (katak.y <= Y_RUMAH + 12) {
      const i = SLOT.findIndex(c => Math.abs(c * 20 + 20 - (katak.x + KOL / 2)) < 16);
      if (i >= 0 && !sampai.has(i)) {
        sampai.add(i); skor += 50 + Math.round(waktu);
        audio.play('mbt190o2l8ccego4c');
        if (sampai.size === 5) return tuntasLevel();
        reset(false);
      } else {
        return mati('Bukan rumah kosong', FASE.GEPENG);
      }
    }
    gambar(); segarkan();
  }

  // =========================================================================
  // Papan skor — berkas 1991 sebagai nilai awal
  // =========================================================================
  /* `run/HOPPER.SCO` yang ditulis program ASLINYA pada 2 Agustus 1991 (UTC)
     masih terbaca, dan rekonstruksi .bas-nya membacanya lalu menulisnya kembali
     dengan ISI yang identik bita demi bita. Sepuluh pasang itu dipakai di sini
     sebagai isi awal papan skor -- bukan hiasan, melainkan data yang selamat. */
  const SKOR_1991 = [
    [14190, 'dik'], [13550, 'dik'], [13470, ''], [640, 'dik'], [280, ''],
    [180, 'dik'], [0, ''], [0, ''], [0, ''], [0, '']
  ];

  function papanSkor() { return db.get('papan', SKOR_1991); }

  function catatSkor(n) {
    if (!n) return;
    const p = papanSkor().slice();
    p.push([n, 'ANDA']);
    p.sort((a, b) => b[0] - a[0]);
    db.set('papan', p.slice(0, 10));
    gambarPapan();
  }

  function gambarPapan() {
    const t = $('papan');
    t.innerHTML = '';
    papanSkor().forEach(([n, nm], i) => {
      const tr = document.createElement('tr');
      if (nm === 'ANDA') tr.className = 'is-anda';
      tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + n + '</td><td>'
        + (nm || '<span class="faint">(kosong)</span>') + '</td>';
      t.append(tr);
    });
  }

  // =========================================================================
  // Pemasangan
  // =========================================================================
  $('topbar-host').append(ui.topbar({
    title: 'Hopper',
    source: 'HOPPER.EXE · penulis tidak diketahui · ≤1991 · dibongkar dari EXE',
    backHref: '../../index.html'
  }));

  const svg = el('svg', {
    viewBox: '0 0 ' + LEBAR + ' ' + TINGGI, class: 'h-svg',
    role: 'img', 'aria-label': 'Layar Hopper, sebelas jalur'
  });
  const defs = el('defs', {});
  svg.append(defs);
  siapkanBentuk(defs);
  lapis = el('g', {});
  svg.append(lapis);
  $('layar').append(svg);

  mainLoop = loop({ update, hz: 60 });

  const TOMBOL = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
  };
  /* Gelung DINYALAKAN LEBIH DULU, baru sisanya. Urutannya sengaja dibalik dari
     versi sebelumnya, yang menggambar dan menyegarkan panel dulu: apa pun yang
     gagal di antaranya membuat `start()` tidak pernah tercapai, dan kegagalan
     sekecil apa pun jadi berakibat sebesar "permainan tidak jalan sama sekali". */
  function mulai() {
    reset(true);
    mainLoop.start();
    pesanLayar(null);
    $('go').textContent = 'Berjalan';
    gambar(); segarkan();
  }

  window.addEventListener('keydown', (e) => {
    // Spanduk "jalur tuntas" boleh dilewati: menunggu dua detik penuh setiap
    // level jadi menjengkelkan begitu pemain sudah tahu apa isinya.
    if (fase === FASE.TUNTAS) { e.preventDefault(); return naikLevel(); }
    const t = TOMBOL[e.key];
    if (!t) return;
    e.preventDefault();
    /* Selama gelungnya belum jalan, kataknya TETAP bisa melompat sedangkan
       dunianya diam -- keadaan yang terbaca sebagai "kendaraannya macet", bukan
       sebagai "belum dimulai". Jadi tombol panah pertama sekalian memulai. */
    if (!mainLoop.running) return mulai();
    lompat(t[0], t[1]);
  });

  $('go').addEventListener('click', mulai);

  // Panel: makro DRAW dan hasil tafsirnya, supaya bahasanya bisa dilihat.
  /* Makro DRAW tidak lagi menggambar apa pun di layar -- rupanya digambar
     ulang. Tapi tafsirnya tetap dijalankan di sini, karena panelnya melaporkan
     angka HASIL PENAFSIRAN, bukan angka yang saya ketik. */
  const contoh = tafsirDraw(D.draw['S4$']);
  $('d-makro').textContent = D.draw['S4$'];
  $('d-ruas').textContent = (contoh.d.match(/L/g) || []).length;
  $('d-kotak').textContent = (contoh.kotak.maxX - contoh.kotak.minX) + ' × '
    + (contoh.kotak.maxY - contoh.kotak.minY);
  $('d-warna').textContent = contoh.warna;
  $('d-jalur').textContent = JALUR.join(', ');
  $('d-median').textContent = (MEDIAN + 1);

  reset(true);
  gambar(); segarkan(); gambarPapan();
})();
