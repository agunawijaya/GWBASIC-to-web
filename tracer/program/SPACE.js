/* ===========================================================================
   SPACE.js — porting minimalis SPACE.BAS sebagai tabel baris.

       940 REM The IBM Personal Computer Space
       950 REM Version 1.10 (C)Copyright IBM Corp 1981, 1982
       960 REM Licensed Material - Program Property of IBM
       970 REM Author - R. Heiney & M. Hallerman

   Program contoh resmi IBM. Lima puluh tujuh baris — dan HANYA DELAPAN di
   antaranya yang benar-benar programnya. Sisanya, baris 940 sampai 1299,
   adalah kerangka bersama yang dipakai seluruh disket contoh IBM.

   SEBERAPA BERSAMA? Dibandingkan baris demi baris dengan PIECHART.BAS:
   44 baris ada di keduanya, dan 42 di antaranya IDENTIK AKSARA DEMI AKSARA.
   Yang berbeda cuma dua: nomor 940 (judul di REM) dan nomor 1040 (judul di
   dalam kotak). Karena itu kerangkanya ditulis SEKALI di berkas ini, dan
   PIECHART.js memakainya — persis alasan yang sama dengan MUSIC/MUSIC1.

   Yang delapan baris itu (1400-1500) mengerjakan seluruh permainannya:

       1430 CIRCLE(160,100),30,1,,,0.45 : PAINT(160,100),1,1
            DRAW"bm160,100e30bm160,100h30" : LINE (130,100)-(190,100),2
            GET(130,70)-(190,130),I

   Satu baris membangun piring terbang — elips gepeng, diisi, dua sinar
   diagonal, satu garis mendatar — lalu MENGAMBILNYA sebagai sprite 61x61.
   Sesudah itu gambar aslinya tidak dipakai lagi; ia cuma cetakan.

       1480 PUT(K1,K2),I,XOR : FOR I1=1 TO 150:NEXT : PUT(K1,K2),I,XOR

   Dan menghapusnya cukup menggambarnya lagi di tempat yang sama. Itu satu-
   satunya alasan XOR jadi aksi bawaan PUT di BASIC.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` diam. Baris 1470 memakai `o=j;` — penyulihan variabel di dalam
     string musik, sama seperti YAHTZEE.BAS baris 5600.
   - `PEEK(&H410)` (baris 1170) membaca kata perlengkapan BIOS untuk menguji
     adakah kartu warna. Penelusur selalu menjawab "ada".
   - `RANDOMIZE` tidak dipanggil; penelusur memasang benih tetap.
   - `CHAIN "samples",1000` tidak bisa dijalankan — lihat catatan cacat.
   =========================================================================== */

(function (global) {
  'use strict';

  function bas(n) {
    if (n === undefined || n === null) n = 0;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }

  /* --- kerangka contoh IBM, baris 940-1299 --------------------------------
     Dipakai apa adanya oleh SPACE dan PIECHART. `judul` adalah satu-satunya
     hal yang berbeda di antara keduanya (baris 940 dan 1040), dan `namaRem`
     ada karena SPACE punya satu baris tambahan di 970. */
  function kerangka(judul, namaRem, baris970) {
    var T = [];
    T.push(rem(940));                    /* REM The IBM Personal Computer ... */
    T.push(rem(950));
    T.push(rem(960));
    if (baris970) T.push(rem(970));      /* hanya SPACE: nama penulisnya */
    T.push({ baris: 975, jalan: function () { } });
    /* 980-1000 PINTU MASUK KEDUA YANG TIDAK DIPAKAI SIAPA PUN — dan di sini
       ketahuan dari mana idiomnya berasal. Ia ada di KERANGKA CONTOH IBM,
       jadi setiap program yang menyalin kerangka ini ikut membawanya. */
    T.push({ baris: 980, jalan: function (m) { m.v['SAMPLES$'] = 'NO'; } });
    T.push({ baris: 990, jalan: function (m) { m.lompat(1010); } });
    T.push({ baris: 1000, jalan: function (m) { m.v['SAMPLES$'] = 'YES'; } });
    T.push({ baris: 1010, jalan: function (m) {
        m.layar(0); m.warna(15, 0, 0); m.cls();
        m.locate(5, 19); m.cetak('IBM'); m.barisBaru();
      } });
    T.push({ baris: 1020, jalan: function (m) {
        m.locate(7, 12, 0); m.cetak('Personal Computer'); m.barisBaru();
      } });
    T.push({ baris: 1030, jalan: function (m) {
        m.warna(10, 0); m.locate(10, 9, 0);
        m.cetak(m.chr(213) + m.ulang(21, 205) + m.chr(184)); m.barisBaru();
      } });
    T.push({ baris: 1040, jalan: function (m) {
        m.locate(11, 9, 0);
        m.cetak(m.chr(179) + judul + m.chr(179)); m.barisBaru();
      } });
    T.push({ baris: 1050, jalan: function (m) {
        m.locate(12, 9, 0);
        m.cetak(m.chr(179) + m.ulang(21, 32) + m.chr(179)); m.barisBaru();
      } });
    T.push({ baris: 1060, jalan: function (m) {
        m.locate(13, 9, 0);
        m.cetak(m.chr(179) + '    Version 1.10     ' + m.chr(179));
        m.barisBaru();
      } });
    T.push({ baris: 1070, jalan: function (m) {
        m.locate(14, 9, 0);
        m.cetak(m.chr(212) + m.ulang(21, 205) + m.chr(190)); m.barisBaru();
      } });
    T.push({ baris: 1080, jalan: function (m) {
        m.warna(15, 0); m.locate(17, 4, 0);
        m.cetak('(C) Copyright IBM Corp 1981, 1982'); m.barisBaru();
      } });
    T.push({ baris: 1090, jalan: function (m) {
        m.warna(14, 0); m.locate(23, 7, 0);
        m.cetak('Press space bar to continue'); m.barisBaru();
      } });
    T.push({ baris: 1100, jalan: function (m) {
        if (m.inkey() !== '') m.lompat(1100);
      } });
    T.push({ baris: 1110, jalan: function (m) { m.v['CMD$'] = m.inkey(); } });
    T.push({ baris: 1120, jalan: function (m) {
        if (m.v['CMD$'] === '') m.lompat(1110);
      } });
    T.push({ baris: 1130, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(1298);
      } });
    T.push({ baris: 1140, jalan: function (m) {
        if (m.v['CMD$'] === ' ') m.lompat(1160);
      } });
    T.push({ baris: 1150, jalan: function (m) { m.lompat(1110); } });
    T.push({ baris: 1160, jalan: function () { } });
    /* 1170 KATA PERLENGKAPAN BIOS di 0040:0010. Dua bitnya menyimpan jenis
       layar saat menyala: 30h berarti monokrom. Kalau BUKAN 30h, kartunya
       kartu warna dan programnya boleh jalan. Uji perangkat keras dalam satu
       PEEK, sebelum ada satu pun cara resmi menanyakannya. */
    T.push({ baris: 1170, jalan: function (m) { m.lompat(1291); } });
    T.push({ baris: 1180, jalan: function (m) {
        m.cls(); m.locate(3, 1);
      } });
    T.push(cet(1190, 'HOLD IT!'));
    T.push(cet(1200, "YOU'RE NOT USING THE COLOR/GRAPHICS MONITOR ADAPTER!"));
    T.push(cet(1210, 'THIS PROGRAM USES GRAPHICS AND REQUIRES THAT ADAPTER.'));
    T.push(cet(1220, 'PRESS THE SPACE BAR TO CONTINUE.'));
    T.push({ baris: 1230, jalan: function () { } });
    T.push({ baris: 1240, jalan: function (m) {
        if (m.inkey() !== '') m.lompat(1240);
      } });
    T.push({ baris: 1250, jalan: function (m) { m.v['CMD$'] = m.inkey(); } });
    T.push({ baris: 1260, jalan: function (m) {
        if (m.v['CMD$'] === '') m.lompat(1250);
      } });
    T.push({ baris: 1270, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(1298);
      } });
    T.push({ baris: 1280, jalan: function (m) {
        if (m.v['CMD$'] === ' ') m.lompat(1298);
      } });
    T.push({ baris: 1290, jalan: function (m) { m.lompat(1250); } });
    T.push({ baris: 1291, jalan: function () { } });
    /* 1292-1296 MENGUJI KEMAMPUAN DENGAN MEMBUATNYA GAGAL. `PLAY "p16"`
       adalah jeda seperenam belas ketuk — tidak terdengar, tidak mengubah
       apa pun. Gunanya cuma satu: kalau penafsirnya Cassette BASIC yang
       tidak punya PLAY, baris itu melempar galat, dan penangannya
       memberitahu pemakainya memakai BASICA. Idiom yang sama dengan
       MUSIC.BAS baris 1141. */
    T.push({ baris: 1292, jalan: function (m) { m.pasangJebakan('galat', 1295); } });
    T.push({ baris: 1293, jalan: function () { /* PLAY "p16" — uji saja */ } });
    T.push({ baris: 1294, jalan: function (m) { m.lompat(1300); } });
    T.push({ baris: 1295, jalan: function (m) { m.warna(31, 0, 0); } });
    T.push({ baris: 1296, jalan: function (m) {
        m.cetak("THIS PROGRAM REQUIRES ADVANCED BASIC -- USE COMMAND 'BASICA'");
        m.barisBaru(); m.warna(15, 0, 0);
        for (m.v.I = 1; m.v.I <= 9000; m.v.I++) { /* jeda */ }
        m.lanjut(1298);
      } });
    T.push({ baris: 1298, jalan: function () { } });
    /* 1299 `SAMPLES$` cuma bisa "YES" kalau program dimasuki lewat baris
       1000 — dan tidak ada jalan ke sana. Cabang CHAIN itu mati. */
    T.push({ baris: 1299, jalan: function (m) {
        m.layar(0);
        if (m.v['SAMPLES$'] === 'YES') m.rantai('samples', 1000);
        else { m.warna(7, 0, 0); m.cls(); m.henti(); }
      } });
    return T;
  }

  var tabel = kerangka('       SPACE         ', 'Space', true);

  /* --- 1300-1500: programnya sendiri, delapan baris ---------------------- */
  tabel.push(rem(1300));
  tabel.push({ baris: 1400, jalan: function () { } });
  /* 1410 `DIM I(800)` — dan `I` juga dipakai sebagai pencacah gelung di
     baris 1470. Di BASIC keduanya variabel yang BERBEDA: `I` skalar dan
     `I()` larik. Tabrakan nama yang sama dengan BOWLING.BAS. */
  tabel.push({ baris: 1410, jalan: function (m) { m.dim('I()', 800); } });
  /* `DEFINT I-N` di baris yang sama membuat I, J, K, L, M, N BULAT — dan
     penugasan ke variabel bulat MEMBULATKAN nilainya. Yang kena di sini
     `K1` dan `K2` (baris 1480): koordinat piringnya selalu bilangan bulat,
     jadi kedua PUT XOR mendarat di piksel yang sama persis dan benar-benar
     saling meniadakan. Kalau dibiarkan pecahan, hapusnya meleset dan
     piringnya meninggalkan jejak. */
  function set(m, nama, nilai) { m.v[nama] = Math.round(nilai); }
  tabel.push({ baris: 1420, jalan: function (m) {
      m.layar(1); m.warna(8, 0);
    } });
  /* 1430 SELURUH PIRING TERBANG DALAM SATU BARIS, lalu diambil jadi sprite:
       CIRCLE ...,0.45   elips gepeng (aspek 0,45 memipihkannya)
       PAINT             diisi warna 1
       DRAW "e30" "h30"  dua sinar diagonal dari pusatnya
       LINE              satu garis mendatar
       GET               cetakan 61x61 disimpan ke larik I() */
  tabel.push({ baris: 1430, bagian: [
      function (m) { m.cls(); },
      function (m) { m.lingkaran(160, 100, 30, 1, null, null, 0.45); },
      function (m) { m.cat(160, 100, 1, 1); },
      function (m) { m.gambar('bm160,100e30bm160,100h30'); },
      function (m) { m.garis(130, 100, 190, 100, 2); },
      function (m) { m.v['I()'] = m.ambil(130, 70, 190, 130); }
    ] });
  /* 1440 tiga jalur warna menutupi seluruh layar — dan menimpa gambar
     aslinya. Sesudah baris ini yang tersisa cuma cetakannya di larik. */
  tabel.push({ baris: 1440, bagian: [
      function (m) { m.garis(0, 0, 100, 199, 0, 'BF'); },
      function (m) { m.garis(101, 0, 200, 199, 2, 'BF'); },
      function (m) { m.garis(201, 0, 300, 199, 3, 'BF'); }
    ] });
  tabel.push({ baris: 1450, jalan: function (m) {
      m.locate(23, 2); m.cetak('Press ESC ');
    } });
  tabel.push({ baris: 1460, jalan: function (m) {
      m.locate(24, 2); m.cetak('to exit');
    } });
  /* 1470 `o=j;` di dalam string PLAY menyulih isi variabel J sebagai nomor
     oktafnya — jadi tangga nadanya naik satu oktaf tiap putaran luar. */
  tabel.push({ baris: 1470, bagian: [
      function (m) { m.untuk('J', 2, 6, 1, 1490); },
      function (m) { m.untuk('I', 1, 2, 1, 1480); },
      function (m) { /* PLAY: tangga nada kromatis di oktaf J */ },
      function (m) { m.lanjutkan('I'); }
    ] });
  /* 1480 GAMBAR, TUNGGU, GAMBAR LAGI. Dua PUT XOR di tempat yang sama
     saling meniadakan, jadi piringnya berkedip tanpa perlu menyimpan apa
     yang ada di bawahnya. */
  tabel.push({ baris: 1480, bagian: [
      function (m) {
        set(m, 'K1', m.acak() * 259); set(m, 'K2', m.acak() * 138);
      },
      function (m) { m.taruh(m.v.K1, m.v.K2, m.v['I()'], 'XOR'); },
      /* Gelung jeda kosong `FOR I1=1 TO 150:NEXT` ditulis sebagai gelung
         SUNGGUHAN, bukan gelung JavaScript. Bedanya menentukan: gelung
         JavaScript selesai di dalam satu langkah penelusuran, jadi kedua
         PUT terjadi bersamaan dan piringnya tidak pernah sempat terlihat.
         Sebagai gelung sungguhan, ia 150 langkah — dan selama itu piringnya
         ada di layar, persis seperti di mesin aslinya. */
      function (m) { m.untuk('I1', 1, 150, 1); },
      function (m) { m.lanjutkan('I1'); },
      function (m) { m.taruh(m.v.K1, m.v.K2, m.v['I()'], 'XOR'); },
      function (m) { m.lanjutkan('J'); }
    ] });
  tabel.push({ baris: 1490, jalan: function (m) {
      m.v['A$'] = m.inkey();
      if (m.v['A$'] === m.chr(27)) m.lompat(1298);
    } });
  tabel.push({ baris: 1500, jalan: function (m) {
      if (m.v['A$'] !== '') m.lompat(1490); else m.lompat(1470);
    } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  /* Kerangka contoh IBM diekspor supaya PIECHART.js memakai yang SAMA.
     Menuliskannya dua kali berarti dua salinan yang bisa melenceng — persis
     cacat yang sedang didokumentasikan halaman ini. */
  global.CONTOH_IBM = { kerangka: kerangka, rem: rem, cet: cet, bas: bas };

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['SPACE'] = {
    nama: 'SPACE',
    judul: 'Space (contoh IBM, R. Heiney & M. Hallerman, 1982)',
    sumber: 'SPACE',
    berkas: 'run/SPACE.BAS',
    tabel: tabel,
    benih: 127,

    arsitektur: {
      judul: 'Alur SPACE.BAS',
      simpul: [
        { id: 'judul', baris: '1010-1150', jenis: 'mulai',
          teks: ['Layar judul IBM 40 kolom;', 'spasi atau ESC'] },
        { id: 'uji', baris: '1160-1296', jenis: 'putusan',
          teks: ['PEEK kata BIOS: ada kartu warna?', 'PLAY "p16": ada BASICA?'] },
        { id: 'bikin', baris: '1420-1430',
          teks: ['SCREEN 1; piring terbang', 'digambar lalu DIAMBIL'] },
        { id: 'latar', baris: '1440-1460',
          teks: ['Tiga jalur warna menimpa', 'gambar aslinya'] },
        { id: 'gelung', baris: '1470-1500',
          teks: ['PUT XOR, tunggu, PUT XOR;', 'tempat acak tiap putaran'] },
        { id: 'keluar', baris: '1298-1299', jenis: 'keluar',
          teks: ['ESC: kembali ke SCREEN 0'] }
      ],
      panah: [
        { dari: 'judul', ke: 'uji' },
        { dari: 'uji', ke: 'bikin', label: 'lolos' },
        { dari: 'uji', ke: 'keluar', label: 'tanpa kartu warna', jenis: 'galat' },
        { dari: 'bikin', ke: 'latar' },
        { dari: 'latar', ke: 'gelung' },
        { dari: 'gelung', ke: 'gelung', label: 'putaran berikutnya' },
        { dari: 'gelung', ke: 'keluar', label: 'ESC' }
      ]
    },

    pseudokode: [
      { baris: 1430, tingkat: 0, teks: 'satu baris: <b>gambar piring terbang, lalu AMBIL jadi sprite</b>' },
      { baris: 1430, tingkat: 1, teks: '<code>CIRCLE ...,0.45</code> &mdash; aspek 0,45 memipihkan lingkarannya jadi elips' },
      { baris: 1440, tingkat: 0, teks: 'tiga jalur warna <b>menimpa gambar aslinya</b>; yang tersisa cuma cetakannya' },
      { baris: 1480, tingkat: 0, teks: '<code>PUT XOR</code>, tunggu, <code>PUT XOR</code> lagi &rarr; <b>hapus tanpa menyimpan latar</b>' },
      { baris: 1410, tingkat: 0, teks: '<code>I</code> skalar dan <code>I()</code> larik dipakai <b>bersamaan</b>' },
      { baris: 1470, tingkat: 0, teks: '<code>PLAY "o=j;"</code> &mdash; nomor oktaf <b>disulih dari variabel</b>' },
      { baris: 1170, tingkat: 0, teks: '<code>PEEK(&amp;H410)</code> &mdash; uji kartu warna dari <b>kata perlengkapan BIOS</b>' },
      { baris: 1293, tingkat: 0, teks: '<code>PLAY "p16"</code> &mdash; jeda tak terdengar, dipakai <b>menguji adanya BASICA</b>' },
      { baris: 980, tingkat: 0, teks: 'pintu masuk kedua yang mati &mdash; dan di sini ketahuan ia <b>bagian kerangka IBM</b>' }
    ],

    perintahAsli: 'run\\SPACE.bat',
    catatanAsli: 'Tekan spasi di layar judul, lalu ESC untuk keluar. ' +
      'Piring terbangnya muncul di tempat acak dan hilang lagi, berulang ' +
      'sambil memainkan tangga nada yang naik satu oktaf tiap putaran.',

    penyimpangan: [
      '<b><code>PLAY</code> diam.</b> Baris 1470 memakai <code>o=j;</code> ' +
      '&mdash; penyulihan variabel di dalam string musik, sama seperti ' +
      'YAHTZEE.BAS baris 5600.',

      '<b><code>PEEK(&amp;H410)</code> tidak ditiru.</b> Baris 1170 membaca ' +
      'kata perlengkapan BIOS untuk menguji adakah kartu warna; penelusur ' +
      'selalu menjawab "ada" dan melompat ke 1291.',

      '<b><code>RANDOMIZE</code> tidak dipanggil sama sekali</b> di berkas ' +
      'aslinya; penelusur memasang benih tetap.',

      '<b>Gelung tunda di baris 1296 dan 1480 habis seketika</b>, jadi ' +
      'piringnya berkedip secepat langkah penelusur.',

      '<b><code>CHAIN "samples",1000</code> tidak bisa dijalankan</b> ' +
      '&mdash; dan memang tidak pernah dicapai; lihat catatan cacat.'
    ],

    pelajaran: {
      ringkas: 'Delapan baris program, di dalam enam puluh baris kerangka ' +
        'contoh IBM &mdash; dan salah satu baris itu membangun sebuah sprite ' +
        'lalu membuang gambar aslinya.',
      pelajari: [
        ['Menggambar sekali, lalu menyimpan cetakannya',
         'Baris 1430 menggambar piring terbang dengan empat perintah berbeda ' +
         '&mdash; elips, isian, dua sinar, satu garis &mdash; lalu ' +
         '<code>GET(130,70)-(190,130),I</code> menyalin seluruh petak 61&times;61 ' +
         'itu ke dalam larik.',
         'Baris berikutnya <b>menimpa gambar aslinya</b> dengan tiga jalur ' +
         'warna. Piring yang asli hilang; yang dipakai seterusnya cuma ' +
         'cetakannya.',
         'Itu pola yang masih dipakai hari ini: bangun aset sekali di awal, ' +
         'lalu tampilkan salinannya berkali-kali. Bedanya, di sini "aset"-nya ' +
         'dibuat oleh program itu sendiri, saat berjalan, di layar yang sama ' +
         'yang nanti dipakai menampilkannya.'],
        ['XOR: menghapus dengan menggambar ulang',
         '<code>PUT(K1,K2),I,XOR</code> dua kali di tempat yang sama ' +
         'mengembalikan layar persis seperti semula &mdash; karena ' +
         '<code>a XOR b XOR b = a</code>.',
         'Akibatnya program tidak perlu menyimpan apa yang ada di bawah ' +
         'spritenya. Di mesin dengan memori 64K dan layar 16K, itu bukan ' +
         'penghematan kecil.'],
        ['Aspek yang memipihkan lingkaran',
         '<code>CIRCLE(160,100),30,1,,,0.45</code>. Argumen terakhir adalah ' +
         'perbandingan tinggi terhadap lebar. Nilai bawaannya 5/6 &mdash; yang ' +
         'membuat lingkaran terlihat bulat di layar yang pikselnya tidak ' +
         'persegi. Nilai 0,45 memipihkannya jadi elips, dan itulah bentuk ' +
         'piring terbangnya.',
         'Satu angka, dan sebuah perintah lingkaran jadi perintah elips.'],
        ['Menguji kemampuan dengan sengaja membuatnya gagal',
         'Baris 1293 memainkan <code>PLAY "p16"</code> &mdash; jeda ' +
         'seperenam belas ketuk. Tidak terdengar, tidak mengubah apa pun.',
         'Gunanya cuma satu: kalau penafsirnya Cassette BASIC yang tidak ' +
         'punya <code>PLAY</code>, baris itu melempar galat, dan ' +
         '<code>ON ERROR GOTO 1295</code> menangkapnya untuk memberi tahu ' +
         'pemakainya memakai BASICA.',
         'Pengujian kemampuan sebelum ada satu pun cara resmi menanyakannya ' +
         '&mdash; dan idiom yang sama dipakai MUSIC.BAS di koleksi ini.']
      ],
      hindari: [
        ['Enam puluh baris kerangka untuk delapan baris program',
         'Dari 57 baris berkas ini, <b>44 di antaranya kerangka</b> yang juga ' +
         'ada di PIECHART.BAS &mdash; dan 42 dari 44 itu identik aksara demi ' +
         'aksara. Yang berbeda cuma judulnya.',
         'Kerangkanya sendiri masuk akal: layar judul, uji perangkat keras, ' +
         'uji penafsir, jalan keluar yang rapi. Yang jadi masalah adalah ' +
         '<b>cara ia dipakai ulang</b> &mdash; disalin, bukan dipanggil. ' +
         'Memperbaiki satu baris di dalamnya berarti memperbaikinya di setiap ' +
         'berkas contoh di disket itu, satu per satu.'],
        ['Pintu masuk kedua yang mati, disebarkan lewat kerangka',
         'Baris 980-1000: <code>SAMPLES$="NO":GOTO 1010</code> lalu baris 1000 ' +
         'yang menyetelnya <code>"YES"</code>. Satu-satunya cara mencapainya ' +
         'adalah <code>RUN 1000</code> dari luar, dan tidak ada yang ' +
         'melakukannya.',
         'Idiom ini sudah muncul empat kali sebelumnya di koleksi ini ' +
         '&mdash; MORTGAGE, DROIDS, MUSIC, WIZARD. Di sini akhirnya ketahuan ' +
         'dari mana: <b>ia bagian dari kerangka contoh IBM</b>, dan setiap ' +
         'program yang menyalin kerangkanya ikut membawanya.'],
        ['Nama yang dipakai dua kali',
         'Baris 1410 <code>DIM I(800)</code>, baris 1470 ' +
         '<code>FOR I=1 TO 2</code>. Di BASIC keduanya variabel berbeda ' +
         '&mdash; <code>I</code> skalar, <code>I()</code> larik &mdash; jadi ' +
         'programnya benar. Tapi pembacanya harus tahu aturan itu untuk ' +
         'yakin. Tabrakan nama yang sama dengan BOWLING.BAS.'],
        ['Larik delapan ratus unsur untuk sprite 61x61',
         '<code>DIM I(800)</code>. Sebuah petak 61&times;61 di SCREEN 1 butuh ' +
         '61&times;61&times;2 bit = 930 bita, ditambah empat bita kepala. ' +
         'Larik 800 unsur presisi tunggal menyediakan 3.200 bita &mdash; ' +
         'cukup, tapi angkanya jelas ditebak, bukan dihitung.']
      ]
    },

    penjelasan: [
      { judul: 'Satu baris yang membangun sebuah benda',
        isi: [
          'Baris 1430 adalah seluruh bagian menarik dari program ini:',
          '<code>1430 CLS:CIRCLE(160,100),30,1,,,0.45:PAINT(160,100),1,1:' +
          'DRAW"bm160,100e30bm160,100h30":LINE (130,100)-(190,100),2:' +
          'GET(130,70)-(190,130),I</code>',
          'Dibaca satu per satu:',
          '<code>CIRCLE(160,100),30,1,,,0.45</code> menggambar elips. Argumen ' +
          'terakhir aspeknya &mdash; 0,45 berarti tingginya kurang dari ' +
          'separuh lebarnya. Itu badan piringnya.',
          '<code>PAINT(160,100),1,1</code> mengisinya. Warna isi dan warna ' +
          'batas sama-sama 1, dan itu cara BASIC berhenti tepat di garis ' +
          'elipsnya.',
          '<code>DRAW"bm160,100e30bm160,100h30"</code> &mdash; ' +
          '<code>bm</code> pindah tanpa menggambar ke pusatnya, ' +
          '<code>e30</code> menarik garis 30 satuan ke kanan atas, lalu ' +
          '<code>bm</code> kembali ke pusat dan <code>h30</code> ke kiri atas. ' +
          'Dua sinar.',
          '<code>LINE (130,100)-(190,100),2</code> satu garis mendatar ' +
          'melintasi badannya.',
          'Dan yang terakhir:',
          '<code>GET(130,70)-(190,130),I</code>',
          'Petak 61&times;61 di sekeliling gambar itu <b>disalin ke dalam ' +
          'larik</b>. Sesudah baris ini, piring terbangnya ada di dua tempat: ' +
          'di layar, dan di memori.',
          'Baris berikutnya menghapus yang di layar &mdash; tiga jalur warna ' +
          'menutupi seluruh 320&times;200. Yang tersisa cuma yang di memori.',
          'Cara berpikirnya masih dipakai. Yang berubah cuma tempat asetnya ' +
          'dibuat: hari ini di penyunting gambar, di sini <b>di layar yang ' +
          'sama yang nanti dipakai menampilkannya</b>.'
        ] },
      { judul: 'Dari mana idiom pintu belakang itu berasal',
        isi: [
          'Empat kali sebelumnya di koleksi ini muncul bentuk yang sama ' +
          'persis, di program yang penulisnya berbeda-beda:',
          '<code>980 SAMPLES$="NO"</code><br>' +
          '<code>990 GOTO 1010</code><br>' +
          '<code>1000 SAMPLES$="YES"</code>',
          'Baris 1000 tidak bisa dicapai dari mana pun. Satu-satunya cara ' +
          'menjalankannya adalah mengetik <code>RUN 1000</code> di prompt ' +
          'BASIC &mdash; dan yang melakukannya cuma satu program: ' +
          'SAMPLES.BAS, menu disket contoh IBM, yang memanggil tiap ' +
          'program contoh lewat baris keduanya supaya program itu tahu harus ' +
          'kembali ke menu.',
          'Di MORTGAGE, DROIDS, MUSIC, dan WIZARD, saya cuma bisa mencatat ' +
          'bahwa idiomnya berulang. Di sini sebabnya terbaca: <b>ia bagian ' +
          'dari kerangka contoh IBM</b>, dan kerangkanya disalin.',
          'Perbandingan baris demi baris antara SPACE.BAS dan PIECHART.BAS ' +
          'memberi angkanya: dari 44 baris yang ada di keduanya, <b>42 ' +
          'identik aksara demi aksara</b>. Yang berbeda cuma nomor 940 (judul ' +
          'di dalam REM) dan nomor 1040 (judul di dalam kotak).',
          'Jadi yang sebenarnya disebar bukan cacatnya, melainkan seluruh ' +
          'kerangkanya &mdash; layar judul, uji kartu warna, uji BASICA, dan ' +
          'jalan keluar. Cacatnya cuma ikut menumpang, dan bertahan di setiap ' +
          'salinan karena tidak pernah mengganggu siapa pun.',
          'Itu cara sebuah kebiasaan menyebar tanpa ada yang memutuskannya.'
        ] }
    ]
  };
})(window);
