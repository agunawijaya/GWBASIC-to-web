/* ===========================================================================
   BUSSIX.js — porting minimalis BUSSIX.BAS sebagai tabel baris.

   Langkah VIII: TIGA LAPORAN KEUANGAN. Laba-rugi, perubahan modal, neraca —
   masing-masing didahului satu layar penjelasan. Enam layar, dan baris 80-130
   menuliskannya sebagai enam baris yang polanya terlihat langsung:

       80  GOSUB 150:GOSUB 280:GOSUB 40                 <- penjelasan
       90  GOSUB 150:GOSUB 230:GOSUB 370:GOSUB 40       <- laporan (pakai bingkai)
       100 GOSUB 150:GOSUB 510:GOSUB 40
       110 GOSUB 150:GOSUB 230:GOSUB 610:GOSUB 40
       120 GOSUB 150:GOSUB 740:GOSUB 40
       130 GOSUB 150:GOSUB 230:GOSUB 830:GOSUB 40

   Bandingkan BUSTHREE.BAS, yang menulis dua puluh GOSUB yang sama dalam SATU
   baris. Di sini satu baris per layar, dan hasilnya jauh lebih terbaca —
   pasangan penjelasan/laporan langsung terlihat berselang-seling.

   Ketiga laporannya menyambung: laba 12.045 - 9.545 = 2.500; modal 14.700 +
   2.500 - 860 = 16.340; neraca 12.490 + 1.695 + 5.655 = 19.840 = 3.500 +
   16.340. Seluruhnya teks harfiah, seperti sebelas berkas lain di rangkaian
   ini.

   Dan di sini ada TIGA tanda kutip yang tidak pernah ditutup — baris 410,
   430, dan 790. GW-BASIC menerimanya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol.
   - Berakhir dengan `RUN"BUSSEVEN"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KANAN_BAWAH = 217, KIRI_BAWAH = 192,
      G_KA = 201, G_D = 205, G_KN = 187, G_T = 186, G_BN = 188, G_BA = 200,
      SB_K = 199, SB_N = 182;

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 1020);
      } },
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 70);
        }
      } },
    { baris: 30, jalan: function (m) { m.lompat(80); } },

    { baris: 40, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 50, jalan: function (m) { if (m.inkey() !== '') m.lompat(40); } },
    { baris: 60, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(60);
      } },
    { baris: 70, jalan: function (m) { m.kembali(); } },

    /* 80-130 naskahnya: enam layar, satu baris per layar. Yang bernomor
       genap (90, 110, 130) memanggil 230 lebih dulu — bingkai besar yang
       cuma dipakai oleh laporan, bukan oleh penjelasannya. */
    layar(80, [150, 280, 40]),
    layar(90, [150, 230, 370, 40]),
    layar(100, [150, 510, 40]),
    layar(110, [150, 230, 610, 40]),
    layar(120, [150, 740, 40]),
    layar(130, [150, 230, 830, 40]),
    { baris: 140, jalan: function (m) { m.jalankan('BUSSEVEN'); } },

    /* --- 150-220: kepala halaman ------------------------------------------ */
    { baris: 150, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
        m.warna(11, 0);
      } },
    { baris: 160, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.J = 20; m.v.J <= 62; m.v.J++) {
            m.locate(m.v.I, m.v.J, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 170, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 180, jalan: function (m) {
        m.locate(2, 19); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 190, jalan: function (m) { m.warna(0, 7); } },
    { baris: 200, jalan: function (m) {
        m.locate(2, 22);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
      } },
    { baris: 210, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 26);
        m.cetak('STEP VIII. FINANCIAL STATEMENTS'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 220, jalan: function (m) { m.kembali(); } },

    /* --- 230-270: bingkai besar, cuma untuk layar laporan ------------------ */
    { baris: 230, jalan: function (m) {
        m.locate(5, 6); m.cetak(m.chr(G_KA));
        for (m.v.I = 7; m.v.I <= 74; m.v.I++) m.cetak(m.chr(G_D));
      } },
    { baris: 240, jalan: function (m) {
        m.locate(5, 75); m.cetak(m.chr(G_KN)); m.barisBaru();
        for (m.v.I = 6; m.v.I <= 23; m.v.I++) {
          m.locate(m.v.I, 75); m.cetak(m.chr(G_T));
        }
      } },
    { baris: 250, jalan: function (m) {
        m.locate(24, 75); m.cetak(m.chr(G_BN));
        for (m.v.I = 74; m.v.I >= 7; m.v.I--) {
          m.locate(24, m.v.I); m.cetak(m.chr(G_D));
        }
      } },
    { baris: 260, jalan: function (m) {
        m.locate(24, 6); m.cetak(m.chr(G_BA)); m.barisBaru();
        for (m.v.I = 23; m.v.I >= 6; m.v.I--) {
          m.locate(m.v.I, 6); m.cetak(m.chr(G_T)); m.barisBaru();
        }
      } },
    { baris: 270, jalan: function (m) { m.kembali(); } },

    /* --- 280-360: penjelasan laba-rugi ------------------------------------ */
    garisJudul(280),
    { baris: 290, jalan: function (m) {
        m.locate(7, 19);
        m.cetak('The purpose of an Income Statement is to reflect');
        m.barisBaru();
      } },
    naskah(300, 15, 'the net income amount for a given accounting period.'),
    naskah(310, 15, 'This is done by simply subtracting the total revenue'),
    naskah(320, 15, 'for the period from the sum of all expenses incurred.'),
    naskah(330, 15, 'The net income determined on the Income Statement is'),
    naskah(340, 15, 'carried over to the Capital Statement.'),
    kaki(350, 17, '***** Strike Any Key For Income Statement *****'),
    { baris: 360, jalan: function (m) { m.kembali(); } },

    /* --- 370-500: laporan laba-rugi --------------------------------------- */
    { baris: 370, jalan: function (m) {
        m.warna(11, 0);
        m.locate(6, 35); m.cetak('ABC Hardware'); m.barisBaru();
        m.locate(7, 33); m.cetak('Income Statement'); m.barisBaru();
      } },
    { baris: 380, jalan: function (m) {
        m.locate(8, 26); m.cetak('For Month Ended June 30 , 1982');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 390, jalan: function (m) { pemisah(m, 9); } },
    di(400, 10, 8, 'Sales . . . . . . . . . . . . . . . . . . . .           $12,045.00'),
    /* 410 TANDA KUTIP PENUTUPNYA TIDAK ADA. GW-BASIC menganggap stringnya
       berakhir di ujung baris. Sama di 430 dan 790. */
    di(410, 12, 8, 'Operating expenses :'),
    di(420, 13, 10, 'Salary expense  . . . . . . . . . . . . . .  $3,500.00'),
    di(430, 14, 10, 'Supplies expense  . . . . . . . . . . . . .  $6,045.00'),
    garis(440, 15, 54, 10, DATAR),
    di(450, 16, 12, 'Total operating expenses  . . . . . . . .            $9,545.00'),
    garis(460, 17, 64, 10, DATAR),
    di(470, 19, 8, 'Net income  . . . . . . . . . . . . . . . . .            $2,500.00'),
    /* 480 garis GANDA di bawah angka terakhir — tanda "ini hasil akhir",
       kebiasaan pembukuan yang lebih tua daripada komputer mana pun. */
    garis(480, 20, 64, 10, G_D),
    kaki(490, 17, '***** Strike Any Key For Capital Statement *****'),
    { baris: 500, jalan: function (m) { m.kembali(); } },

    /* --- 510-600: penjelasan perubahan modal ------------------------------ */
    garisJudul(510),
    { baris: 520, jalan: function (m) {
        m.locate(7, 19);
        m.cetak('The purpose of a Capital Statement is to reflect');
        m.barisBaru();
      } },
    naskah(530, 14, 'the changes in capital of a business entity that have'),
    naskah(540, 14, 'occured during any accounting period. This is done by'),
    naskah(550, 14, 'taking the Beginning Capital,  adding the net income,'),
    naskah(560, 14, 'and subtracting out any withdrawals that have occured'),
    naskah(570, 14, 'resulting in an Ending Capital amount. This amount is'),
    naskah(580, 14, 'carried over to the Balance Sheet.'),
    kaki(590, 17, '***** Strike Any Key For Capital Statement *****'),
    { baris: 600, jalan: function (m) { m.kembali(); } },

    /* --- 610-730: laporan perubahan modal --------------------------------- */
    { baris: 610, jalan: function (m) {
        m.warna(11, 0);
        m.locate(6, 35); m.cetak('ABC Hardware'); m.barisBaru();
        m.locate(7, 33); m.cetak('Capital Statement'); m.barisBaru();
      } },
    { baris: 620, jalan: function (m) {
        m.locate(8, 26); m.cetak('For Month Ended June 30 , 1982');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 630, jalan: function (m) { pemisah(m, 9); } },
    di(640, 10, 8, 'Capital , June 1, 1982  . . . . . . . . . . .           $14,700.00'),
    di(650, 11, 8, 'Net income for the month. . . . . . . . . . .  $2,500.00'),
    di(660, 12, 8, 'Less withdrawals  . . . . . . . . . . . . . .    $860.00'),
    /* 670 `PRINT SPC(50)` menghapus sisa baris LEBIH DULU, baru garisnya
       digambar. Cara menimpa tanpa CLS. */
    { baris: 670, jalan: function (m) {
        m.locate(13, 7); m.spc(50); m.barisBaru();
        m.locate(13, 54);
        for (m.v.I = 1; m.v.I <= 10; m.v.I++) m.cetak(m.chr(DATAR));
      } },
    di(680, 14, 8, 'Increase in capital . . . . . . . . . . . . .            $1,640.00'),
    { baris: 690, jalan: function (m) {
        m.locate(15, 7); m.spc(60); m.barisBaru();
        m.locate(15, 64);
        for (m.v.I = 1; m.v.I <= 10; m.v.I++) m.cetak(m.chr(DATAR));
      } },
    di(700, 16, 8, 'Capital , June 30, 1982 . . . . . . . . . . .           $16,340.00'),
    { baris: 710, jalan: function (m) {
        m.locate(17, 7); m.spc(60); m.barisBaru();
        m.locate(17, 64);
        for (m.v.I = 1; m.v.I <= 10; m.v.I++) m.cetak(m.chr(G_D));
      } },
    kaki(720, 18, '***** Strike Any Key For Balance Sheet *****'),
    { baris: 730, jalan: function (m) { m.kembali(); } },

    /* --- 740-820: penjelasan neraca --------------------------------------- */
    garisJudul(740),
    { baris: 750, jalan: function (m) {
        m.locate(7, 19);
        m.cetak('The purpose of a Balance Sheet is to give a list');
        m.barisBaru();
      } },
    naskah(760, 15, 'of assets , liabilities , and capital for a business'),
    naskah(770, 15, 'entity as of a specific date,  usually at the end of'),
    naskah(780, 15, 'the month. This document will also serve the purpose'),
    naskah(790, 15, 'of insuring that the sum of all liabilities plus the'),
    naskah(800, 15, 'owners capital is equal the sum of all assets.'),
    kaki(810, 18, '***** Strike Any Key For Balance Sheet *****'),
    { baris: 820, jalan: function (m) { m.kembali(); } },

    /* --- 830-1010: neraca ------------------------------------------------- */
    { baris: 830, jalan: function (m) {
        m.warna(11, 0);
        m.locate(6, 35); m.cetak('ABC Hardware'); m.barisBaru();
        m.locate(7, 35); m.cetak('Balance Sheet'); m.barisBaru();
      } },
    { baris: 840, jalan: function (m) {
        m.locate(8, 26); m.cetak('For Month Ended June 30 , 1982');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 850, jalan: function (m) { pemisah(m, 9); } },
    di(860, 10, 20, 'Assets'),
    di(870, 11, 8, 'Current assets:'),
    di(880, 12, 10, 'Cash  . . . . . . . . . . . . . . . . . . . $12,490.00'),
    di(890, 13, 10, 'Accounts receivable . . . . . . . . . . . .  $1,695.00'),
    di(900, 14, 10, 'Supplies  . . . . . . . . . . . . . . . . .  $5,655.00'),
    { baris: 910, jalan: function (m) {
        m.locate(15, 8); m.cetak('Total assets'); m.barisBaru();
        m.locate(15, 54);
        for (m.v.I = 1; m.v.I <= 10; m.v.I++) m.cetak(m.chr(DATAR));
        m.locate(15, 64); m.cetak('$19,840.00'); m.barisBaru();
      } },
    garis(920, 16, 64, 10, G_D),
    di(930, 17, 20, 'Liabilities'),
    di(940, 18, 8, 'Accounts payable  . . . . . . . . . . . . . .  $3,500.00'),
    { baris: 950, jalan: function (m) {
        m.locate(19, 8); m.cetak('Total liabilities'); m.barisBaru();
        m.locate(19, 54);
        for (m.v.I = 1; m.v.I <= 10; m.v.I++) m.cetak(m.chr(DATAR));
        m.locate(19, 64); m.cetak(' $3,500.00'); m.barisBaru();
      } },
    di(960, 20, 20, 'Capital'),
    di(970, 21, 8, 'Homer Jones, capital  . . . . . . . . . . . .           $16,340.00'),
    garis(980, 22, 64, 10, DATAR),
    di(990, 23, 8, 'Total liabilities and capital . . . . . . . .           $19,840.00'),
    kaki(1000, 17, '***** Strike Any Key For Adjusting Entries *****'),
    { baris: 1010, jalan: function (m) { m.kembali(); } },
    { baris: 1020, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function layar(nomor, daftar) {
    return { baris: nomor, bagian: daftar.map(function (n) {
      return function (m) { m.gosub(n); };
    }) };
  }
  function naskah(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function di(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }
  function garis(nomor, b, k, n, kode) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k);
      for (m.v.I = 1; m.v.I <= n; m.v.I++) m.cetak(m.chr(kode));
    } };
  }
  function garisJudul(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.warna(11, 0); m.locate(5, 26, 0);
      m.cetak('-------------------------------'); m.barisBaru();
      m.warna(7, 0);
    } };
  }
  function kaki(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.warna(11, 0); m.locate(25, kolom); m.cetak(isi); m.warna(7, 0);
    } };
  }
  function pemisah(m, b) {
    m.locate(b, 6); m.cetak(m.chr(SB_K));
    for (m.v.I = 7; m.v.I <= 74; m.v.I++) m.cetak(m.chr(DATAR));
    m.cetak(m.chr(SB_N)); m.barisBaru();
  }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSSIX'] = {
    nama: 'BUSSIX',
    judul: 'Business Simulation VIII — tiga laporan keuangan',
    sumber: 'BUSSIX',
    berkas: 'run/BUSSIX.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSSIX.BAS',
      simpul: [
        { id: 'jebak', baris: '10-30', jenis: 'mulai',
          teks: ['F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'naskah', baris: '80-130',
          teks: ['Enam layar,', 'satu baris per layar'] },
        { id: 'kepala', baris: '150-220', jenis: 'subrutin',
          teks: ['Kotak judul,', 'dipanggil enam kali'] },
        { id: 'bingkai', baris: '230-270', jenis: 'subrutin',
          teks: ['Bingkai besar — hanya', 'untuk layar laporan'] },
        { id: 'labarugi', baris: '370-500', jenis: 'subrutin',
          teks: ['Laba-rugi:', '12.045 - 9.545 = 2.500'] },
        { id: 'modal', baris: '610-730', jenis: 'subrutin',
          teks: ['Perubahan modal:', '14.700 + 2.500 - 860 = 16.340'] },
        { id: 'neraca', baris: '830-1010', jenis: 'subrutin',
          teks: ['Neraca:', '19.840 = 3.500 + 16.340'] },
        { id: 'lanjut', baris: '140', jenis: 'keluar',
          teks: ['RUN "BUSSEVEN"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'naskah' },
        { dari: 'naskah', ke: 'kepala', label: 'GOSUB 150, enam kali' },
        { dari: 'naskah', ke: 'bingkai', label: 'GOSUB 230, tiga kali' },
        { dari: 'naskah', ke: 'labarugi' },
        { dari: 'naskah', ke: 'modal' },
        { dari: 'naskah', ke: 'neraca' },
        { dari: 'naskah', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 80, tingkat: 0, teks: 'enam layar, <b>satu baris per layar</b> &mdash; berselang penjelasan/laporan' },
      { baris: 90, tingkat: 1, teks: 'baris laporan memanggil <code>230</code> lebih dulu: bingkai besar' },
      { baris: 370, tingkat: 0, teks: '<b>laba-rugi</b>: penjualan 12.045 &minus; beban 9.545 = <b>2.500</b>' },
      { baris: 610, tingkat: 0, teks: '<b>perubahan modal</b>: 14.700 + 2.500 &minus; 860 prive = <b>16.340</b>' },
      { baris: 670, tingkat: 1, teks: '<code>PRINT SPC(50)</code> menghapus sisa baris dulu, baru garisnya digambar' },
      { baris: 830, tingkat: 0, teks: '<b>neraca</b>: 12.490 + 1.695 + 5.655 = <b>19.840</b> = 3.500 + 16.340' },
      { baris: 480, tingkat: 1, teks: 'garis <b>ganda</b> di bawah angka akhir &mdash; kebiasaan pembukuan, bukan hiasan' },
      { baris: 140, tingkat: 0, teks: '<code>RUN "BUSSEVEN"</code>' }
    ],

    perintahAsli: 'run\\BUSSIX.bat',
    catatanAsli: 'Langkah VIII dari rangkaian BUSONE sampai BUSTEN.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50.',

      '<b>Berakhir dengan <code>RUN"BUSSEVEN"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Tiga laporan keuangan yang saling menyambung, ditulis dengan ' +
        'naskah satu baris per layar &mdash; jauh lebih terbaca daripada ' +
        'baris raksasa di BUSTHREE.',
      pelajari: [
        ['Satu baris per layar',
         'Baris 80&ndash;130 menuliskan enam layar sebagai enam baris. ' +
         'Bandingkan BUSTHREE.BAS, yang memuat dua puluh <code>GOSUB</code> ' +
         'dalam <b>satu</b> baris. Isinya sama-sama daftar pemanggilan, tapi ' +
         'di sini pola penjelasan/laporan yang berselang-seling <b>terlihat ' +
         'langsung</b> &mdash; dan menyisipkan layar baru berarti menambah ' +
         'satu baris, bukan menyunting baris sepanjang dua ratus aksara.'],
        ['Subrutin yang dipanggil hanya oleh sebagian layar',
         '<code>GOSUB 230</code> menggambar bingkai besar, dan cuma muncul di ' +
         'baris 90, 110, 130 &mdash; ketiga layar <b>laporan</b>. Layar ' +
         'penjelasan tidak memakainya. Perbedaan itu terlihat langsung dari ' +
         'bentuk keenam barisnya.'],
        ['Menghapus sebelum menggambar',
         'Baris 670, 690, dan 710 menjalankan <code>PRINT SPC(50)</code> atau ' +
         '<code>SPC(60)</code> lebih dulu, baru menggambar garisnya. Itu ' +
         'membersihkan sisa teks di baris yang sama tanpa perlu ' +
         '<code>CLS</code> &mdash; penting karena layar ini digambar di atas ' +
         'bingkai yang sudah ada.'],
        ['Garis tunggal dan garis ganda punya arti',
         'Baris 440, 460, 680 memakai <code>─</code>; baris 480, 710, 920 ' +
         'memakai <code>═</code>. Itu bukan selera: dalam pembukuan, garis ' +
         'tunggal menandai subtotal dan <b>garis ganda menandai angka ' +
         'akhir</b>. Kebiasaan yang jauh lebih tua daripada komputer mana ' +
         'pun, dan diteruskan apa adanya ke layar CGA.']
      ],
      hindari: [
        ['Tanda kutip yang tidak ditutup',
         'Baris 410, 430, dan 790 berakhir tanpa tanda kutip penutup. ' +
         'GW-BASIC menerimanya &mdash; string yang sampai di ujung baris ' +
         'dianggap tertutup di situ. Tiga kali di satu berkas menunjukkan ' +
         'ini kebiasaan, bukan kecelakaan. (Hal yang sama ada di baris ' +
         'terakhir BUSTEN.BAS.)'],
        ['Angka yang menyambung tanpa penghubung',
         'Laba bersih 2.500 dari laporan pertama muncul lagi di laporan ' +
         'kedua; modal akhir 16.340 dari laporan kedua muncul lagi di laporan ' +
         'ketiga. Ketiganya benar &mdash; dan ketiganya <b>teks harfiah yang ' +
         'diketik terpisah</b>. Mengubah satu tidak mengubah yang lain.'],
        ['Salah eja di layar penjelasan',
         '<code>occured</code> (baris 540), dan <code>is equal the sum</code> ' +
         '(baris 800) yang kehilangan kata "to".']
      ]
    },

    penjelasan: [
      { judul: 'Naskah yang bisa dibaca sebagai daftar acara',
        isi: [
          'Baris 80&ndash;130 adalah seluruh alur programnya:',
          '<code>80&nbsp; GOSUB 150:GOSUB 280:GOSUB 40</code><br>' +
          '<code>90&nbsp; GOSUB 150:GOSUB 230:GOSUB 370:GOSUB 40</code><br>' +
          '<code>100 GOSUB 150:GOSUB 510:GOSUB 40</code><br>' +
          '<code>110 GOSUB 150:GOSUB 230:GOSUB 610:GOSUB 40</code><br>' +
          '<code>120 GOSUB 150:GOSUB 740:GOSUB 40</code><br>' +
          '<code>130 GOSUB 150:GOSUB 230:GOSUB 830:GOSUB 40</code>',
          'Enam baris, dan polanya terlihat tanpa perlu dijelaskan: yang ' +
          'ganjil pendek (penjelasan), yang genap punya satu ' +
          '<code>GOSUB 230</code> tambahan (laporan, pakai bingkai). ' +
          '<code>150</code> di awal tiap baris menggambar kepala; ' +
          '<code>40</code> di akhir menunggu tombol.',
          'Bandingkan dengan BUSTHREE.BAS, yang menulis dua puluh ' +
          '<code>GOSUB</code> yang persis sama gunanya dalam <b>satu baris</b> ' +
          'sepanjang dua ratus aksara. Isinya sama; keterbacaannya tidak.',
          'Yang membuat versi ini lebih baik bukan jumlah barisnya, melainkan ' +
          'bahwa <b>batas antar layar sekarang punya wujud</b>. Di BUSTHREE, ' +
          'nomor 820 muncul lima kali di tengah kerumunan dan tidak ada apa ' +
          'pun yang menandai bahwa di situlah layar baru dimulai. Di sini, ' +
          'yang menandainya adalah ujung baris.'
        ] },
      { judul: 'Tiga laporan yang saling menyambung',
        isi: [
          'Ketiga laporan di berkas ini adalah rantai:',
          '<b>Laba-rugi</b> (370&ndash;500): penjualan 12.045, beban gaji ' +
          '3.500 + beban perlengkapan 6.045 = 9.545. Laba bersih ' +
          '<b>2.500</b>.',
          '<b>Perubahan modal</b> (610&ndash;730): modal awal 14.700, ditambah ' +
          'laba <b>2.500</b>, dikurangi prive 860, jadi kenaikan 1.640 dan ' +
          'modal akhir <b>16.340</b>.',
          '<b>Neraca</b> (830&ndash;1010): aset 12.490 + 1.695 + 5.655 = ' +
          '19.840; kewajiban 3.500 + modal <b>16.340</b> = 19.840.',
          'Tiap laporan memakai hasil laporan sebelumnya, dan yang terakhir ' +
          'menutup dengan dua angka yang harus sama. Itu <b>rantai ' +
          'pemeriksaan</b>: kalau ada satu kesalahan di mana pun sepanjang ' +
          'siklusnya, ia akan muncul sebagai ketidakseimbangan di ujung.',
          'Kecuali di sini. Ketiga laporan itu teks harfiah yang diketik ' +
          'terpisah, dan tidak ada satu pun bagian program yang tahu bahwa ' +
          '2.500 di baris 470 dan 2.500 di baris 650 adalah angka yang sama. ' +
          '<b>Rantainya ada di kepala penulisnya, bukan di programnya.</b>'
        ] }
    ]
  };
})(window);
