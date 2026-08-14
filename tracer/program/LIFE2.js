/* ===========================================================================
   LIFE2.js — porting minimalis LIFE2.BAS sebagai tabel baris.

       1 '   LIFE = The game of LIFE by John Conway - a simulation
       2 '    This version by John Sigle        2/21/83

   Permainan Kehidupan Conway di layar teks 78x21. Satu-satunya program di
   koleksi ini yang tidak memakai grafik sama sekali dan tetap masuk kelompok
   ini — karena yang menarik di sini bukan gambarnya, melainkan CARA ia
   memutuskan apa yang perlu digambar.

   YANG PALING LAYAK DILIHAT: IA TIDAK PERNAH MEMERIKSA SELURUH PAPAN.

   Cara lugas menghitung satu generasi: telusuri 21x78 = 1638 petak, hitung
   tetangga tiap petak, tentukan nasibnya. Program ini tidak melakukannya.

   Ia memelihara DAFTAR petak yang hidup:

       58 DIM CLIST(1,1500,1), LLEN(1)

   dan satu generasi hanya menyentuh petak yang ada di daftar itu, ditambah
   delapan tetangga masing-masing (baris 4041-4048). Pola dua puluh bakteri
   menghabiskan 180 pemeriksaan, bukan 1638 — dan waktunya ikut isi papan,
   bukan ikut ukuran papan.

   YANG KEDUA: DUA GENERASI MEMAKAI HURUF YANG BERBEDA.

       60 DIM CH$(1):CH$(0)="X" : CH$(1)="O"
       376 SWAP CUR,NXT

   `CUR` dan `NXT` bertukar tiap generasi, dan huruf yang dicetak diambil
   dengan indeks yang sama. Jadi generasi ganjil tampil sebagai X dan generasi
   genap sebagai O. Itu bukan hiasan: ia denyut yang bisa dilihat, dan ia
   membuat layar tidak perlu dibersihkan — petak yang tetap hidup ditimpa
   huruf yang lain.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` diam (baris 378).
   - `DEF SEG=0:POKE 1052,PEEK(1050)` (baris 2016) mengosongkan penyangga
     papan tik lewat alamat BIOS; penelusur mengosongkan penyangganya sendiri.
     Lihat catatan — ini cara yang BENAR, dan 15PUZZLE.BAS melakukan hal yang
     sama dengan cara yang sama sekali lain.
   - `RUN DRIVE$+":"+"START"` (baris 65002) tidak pernah dicapai; lihat
     catatan cacat.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }
  function cet(n, isi) {
    T({ baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } });
  }

  /* --- 1-70: siapkan -------------------------------------------------------- */
  rem(1);
  rem(2);
  rem(50);
  T({ baris: 51, jalan: function () { /* DEFINT A-Z */ } });
  /* 52 KOMENTARNYA YANG PENTING: `'Mention early for efficiency`.
     GW-BASIC menyimpan variabel dalam satu daftar dan MENCARINYA dari depan
     tiap kali sebuah nama disebut. Variabel yang pertama kali disebut duduk
     paling depan, jadi ia paling cepat ditemukan.
     Baris ini menyebut delapan variabel yang paling sering dipakai gelung
     dalam — sebelum apa pun yang lain — semata-mata supaya keduanya duduk di
     depan. Pengoptimalan yang sekarang sudah tidak ada padanannya. */
  T({ baris: 52, jalan: function (m) {
      m.v.C = 0; m.v.R = 0; m.v.CUR = 0; m.v.NXT = 1;
      m.v.NN = 0; m.v.CR = 0; m.v.RN = 0;
    } });
  T({ baris: 53, jalan: function (m) { m.v.NROWS = 21; m.v.NCOLS = 78; } });
  /* 55 pinggiran +1 di kedua sumbu: cincin petak yang selalu kosong,
     supaya baris 4102 boleh membaca R-1 dan R+1 tanpa memeriksa batas. */
  T({ baris: 55, jalan: function (m) {
      m.dim('G()', m.v.NROWS + 1, m.v.NCOLS + 1, 1);
    } });
  T({ baris: 58, jalan: function (m) {
      m.dim('CLIST()', 1, 1500, 1); m.dim('LLEN()', 1);
    } });
  T({ baris: 60, jalan: function (m) {
      m.dim('CH$()', 1); m.v['CH$()'][0] = 'X'; m.v['CH$()'][1] = 'O';
    } });
  T({ baris: 70, jalan: function () { /* KEY OFF */ } });

  /* --- 100-261: alur utama -------------------------------------------------- */
  rem(100);
  T({ baris: 101, jalan: function (m) { m.gosub(1000); } });
  rem(151);
  T({ baris: 152, jalan: function (m) { m.gosub(2500); } });
  rem(200);
  T({ baris: 202, jalan: function (m) { m.gosub(2000); } });
  rem(250);
  T({ baris: 255, jalan: function (m) {
      m.locate(24, 1); m.cetak(new Array(80).join(' '));
    } });
  T({ baris: 256, jalan: function (m) {
      m.locate(24, 1); m.warna(0, 7); m.cetak(' RUN mode '); m.warna(7, 0);
    } });
  T({ baris: 260, jalan: function (m) {
      m.locate(25, 1); m.cetak(new Array(80).join(' '));
    } });
  T({ baris: 261, jalan: function (m) {
      m.locate(25, 1);
      m.warna(15); m.cetak(' E'); m.warna(7); m.cetak('=Edit, ');
      m.warna(15); m.cetak('space'); m.warna(7); m.cetak('=Pause, ');
      m.warna(15); m.cetak('C'); m.warna(7); m.cetak('=Continue, ');
      m.warna(15); m.cetak('Q'); m.warna(7); m.cetak('=Quit');
    } });

  /* --- 300-505: gelung generasi -------------------------------------------- */
  rem(300);
  rem(350);
  T({ baris: 352, jalan: function (m) { m.gosub(4000); } });
  rem(375);
  /* 376 SATU SWAP, dan seluruh generasi baru jadi generasi sekarang. Tidak
     ada penyalinan larik: yang bertukar cuma dua nomor indeks. */
  T({ baris: 376, jalan: function (m) {
      var t = m.v.CUR; m.v.CUR = m.v.NXT; m.v.NXT = t;
    } });
  T({ baris: 378, bagian: [
      function (m) { m.untuk('K', 1, 2000, 1); },   /* SOUND 700,.1 */
      function (m) { m.lanjutkan('K'); }
    ] });
  rem(380);
  T({ baris: 385, jalan: function (m) {
      m.v['C$'] = m.inkey();
      if (m.v['C$'] === '') m.lompat(300);
    } });
  rem(500);
  T({ baris: 501, jalan: function (m) {
      if (m.v['C$'] === 'E' || m.v['C$'] === 'e') m.lompat(200);
    } });
  T({ baris: 502, jalan: function (m) {
      if (m.v['C$'] === 'Q' || m.v['C$'] === 'q') { m.cls(); m.lompat(65000); }
    } });
  T({ baris: 503, jalan: function (m) {
      if (m.v['C$'] === 'C' || m.v['C$'] === 'c') m.lompat(250);
    } });
  /* 504 jeda: baca SATU tombol dan tafsirkan lagi dari baris 501. Jadi
     selama jeda, E, Q, dan C tetap bekerja — tanpa satu baris pun tambahan. */
  T({ baris: 504, bagian: [
      function (m) {
        if (m.v['C$'] !== ' ') { m.lompat(505); return; }
      },
      function (m) { m.masukan('C$', ''); },
      function (m) { m.lompat(501); }
    ] });
  T({ baris: 505, jalan: function (m) { m.lompat(385); } });

  /* --- 1000-1204: petunjuk -------------------------------------------------- */
  rem(1000);
  T({ baris: 1006, jalan: function (m) { m.cls(); m.barisBaru(); } });
  cet(1008, '                               L  I  F  E');
  T({ baris: 1009, jalan: function (m) { m.barisBaru(); } });
  cet(1010, '   The original game of life was invented by mathematician John Conway.');
  cet(1011, ' The idea is to initialize the screen with a pattern of bacteria ');
  /* 1112 duduk di antara 1011 dan 1114 — nomor yang seharusnya 1012. Karena
     1112 masih lebih besar dari 1011, urutannya tetap benar dan tidak ada
     yang pernah tahu. */
  cet(1112, " in 'EDIT' mode.  The 'RUN' mode then brings life to the colony.");
  cet(1114, ' The population increases and decreases according to fixed rules ');
  cet(1116, ' which affect the birth and death of individual bacterium. ');
  cet(1118, ' A rectangular grid (2-dimensional matrix) will be shown on the screen.');
  cet(1120, ' Each cell in the grid can contain a bacterium or be empty.  Each cell');
  cet(1122, ' has 8 neighbors except that cells on the boundry have less than 8 ');
  cet(1124, ' neighbors.  The existance of cells from one generation to the next');
  cet(1126, ' is determined by the following rules:');
  T({ baris: 1128, jalan: function (m) {
      m.barisBaru();
      m.cetak('  1.  A bacteria with 2 or 3 neighbors survives from one generation to ');
      m.barisBaru();
    } });
  cet(1130, '      the next.  A bacterium with fewer neighbors dies of isolation.');
  cet(1132, '      One with more neighbors dies of overcrowding.');
  T({ baris: 1134, jalan: function (m) {
      m.barisBaru();
      m.cetak('  2.  An empty cell spawns a bacteria if it has exactly three ');
      m.barisBaru();
    } });
  cet(1136, '      neighboring cells which contain bacteria.');
  T({ baris: 1150, jalan: function (m) { m.barisBaru(); m.barisBaru(); } });
  T({ baris: 1152, bagian: [
      function (m) { m.cetak('   Press the spacebar to continue'); },
      function (m) { m.masukan('ANS$', ''); }
    ] });
  T({ baris: 1154, jalan: function (m) {
      m.cls(); m.barisBaru(); m.barisBaru();
    } });
  cet(1170, ' In EDIT mode the following commands are available:');
  T({ baris: 1172, jalan: function (m) { m.barisBaru(); m.barisBaru(); } });
  T({ baris: 1174, jalan: function (m) {
      m.cetak('  ' + m.chr(24) + m.chr(25) + m.chr(26) + m.chr(27) +
              '         to move the cursor');
      m.barisBaru();
    } });
  cet(1176, '  M            to Mark a cell as having a bacterium');
  cet(1178, '  space        to erase a mark from a cell');
  cet(1180, '  R            to enter the RUN mode (i.e. start the evolutionary process)');
  cet(1182, '  C            to Clear the grid in order to create a new pattern');
  cet(1184, '  Q            to Quit the game of LIFE');
  T({ baris: 1186, jalan: function (m) { m.barisBaru(); m.barisBaru(); } });
  cet(1188, ' In RUN mode the following commands are available:');
  T({ baris: 1190, jalan: function (m) { m.barisBaru(); } });
  cet(1192, '  E            to enter the EDIT mode to create or change the pattern');
  cet(1194, '  space        to pause');
  cet(1196, '  C            to Continue the execution after a pause');
  cet(1198, '  Q            to Quit the game of LIFE');
  T({ baris: 1199, jalan: function (m) {
      m.barisBaru();
      m.cetak('The EDIT, pause and Quit commands take effect only at the end of a cycle.');
      m.barisBaru();
    } });
  T({ baris: 1204, bagian: [
      function (m) { m.barisBaru(); m.cetak('Press spacebar to continue'); },
      function (m) { m.masukan('ANS$', ''); },
      function (m) { m.kembali(); }
    ] });

  /* --- 2000-2119: menyunting pola ------------------------------------------ */
  rem(2000);
  rem(2010);
  T({ baris: 2011, jalan: function (m) {
      m.locate(24, 1); m.cetak(new Array(80).join(' '));
    } });
  T({ baris: 2012, jalan: function (m) {
      m.locate(24, 1); m.warna(0, 7); m.cetak(' EDIT mode '); m.warna(7, 0);
    } });
  T({ baris: 2013, jalan: function (m) {
      m.locate(25, 1); m.cetak(new Array(80).join(' '));
    } });
  T({ baris: 2014, jalan: function (m) {
      m.locate(25, 1); m.cetak('Use ');
      m.warna(15); m.cetak(m.chr(24) + m.chr(25) + m.chr(26) + m.chr(27));
      m.warna(7); m.cetak(' to move cursor, ');
    } });
  T({ baris: 2015, jalan: function (m) {
      m.warna(15); m.cetak('M'); m.warna(7); m.cetak('=mark, ');
      m.warna(15); m.cetak('space'); m.warna(7); m.cetak('=erase, ');
      m.warna(15); m.cetak('R'); m.warna(7); m.cetak('=Run, ');
      m.warna(15); m.cetak('C'); m.warna(7); m.cetak('=Clear screen, ');
      m.warna(15); m.cetak('Q'); m.warna(7); m.cetak('=quit');
    } });
  /* 2016 `POKE 1052,PEEK(1050)` — alamat 1050 dan 1052 adalah kepala dan ekor
     PENYANGGA PAPAN TIK BIOS. Menyamakan ekor dengan kepala berarti "tidak ada
     yang tersimpan": penyangganya kosong seketika, berapa pun isinya.
     Bandingkan dengan 15PUZZLE.BAS baris 355, yang mengosongkan penyangga
     dengan menyedotnya satu per satu lewat INKEY$. Dua program, satu tujuan,
     dua tingkat abstraksi yang terpaut jauh. */
  T({ baris: 2016, jalan: function (m) { m.kosongkanPenyangga(); } });
  rem(2020);
  T({ baris: 2022, jalan: function (m) {
      m.v.RN = 11; m.v.CN = 39; m.locate(m.v.RN + 1, m.v.CN + 1, 1);
    } });
  rem(2030);
  T({ baris: 2031, jalan: function (m) {
      m.v['C$'] = m.inkey(); if (m.v['C$'] === '') m.lompat(2031);
    } });
  /* 2032 tombol panah datang sebagai DUA aksara; panjangnya yang jadi
     pembeda, bukan isinya. */
  T({ baris: 2032, jalan: function (m) {
      if (m.v['C$'].length === 2) m.lompat(2040);
    } });
  T({ baris: 2033, bagian: [
      function (m) {
        if (m.v['C$'] !== 'M' && m.v['C$'] !== 'm') { m.lompat(2034); return; }
        m.gosub(2080);
      },
      function (m) { m.lompat(2031); }
    ] });
  T({ baris: 2034, bagian: [
      function (m) {
        if (m.v['C$'] !== ' ') { m.lompat(2035); return; }
        m.gosub(2070);
      },
      function (m) { m.lompat(2031); }
    ] });
  T({ baris: 2035, jalan: function (m) {
      if (m.v['C$'] === 'R' || m.v['C$'] === 'r') m.kembali();
    } });
  T({ baris: 2036, bagian: [
      function (m) {
        if (m.v['C$'] !== 'C' && m.v['C$'] !== 'c') { m.lompat(2038); return; }
        m.gosub(2110);
      },
      function (m) { m.lompat(2031); }
    ] });
  T({ baris: 2038, jalan: function (m) {
      if (m.v['C$'] === 'Q' || m.v['C$'] === 'q') m.lompat(65000);
    } });
  T({ baris: 2039, jalan: function (m) { m.lompat(2031); } });
  T({ baris: 2040, jalan: function (m) {
      m.v.CC = m.v['C$'].charCodeAt(m.v['C$'].length - 1);
    } });
  T({ baris: 2041, bagian: [
      function (m) { if (m.v.CC !== 72) { m.lompat(2042); return; } m.gosub(2050); },
      function (m) { m.lompat(2031); }
    ] });
  T({ baris: 2042, bagian: [
      function (m) { if (m.v.CC !== 75) { m.lompat(2043); return; } m.gosub(2055); },
      function (m) { m.lompat(2031); }
    ] });
  T({ baris: 2043, bagian: [
      function (m) { if (m.v.CC !== 77) { m.lompat(2044); return; } m.gosub(2060); },
      function (m) { m.lompat(2031); }
    ] });
  T({ baris: 2044, bagian: [
      function (m) { if (m.v.CC !== 80) { m.lompat(2045); return; } m.gosub(2065); },
      function (m) { m.lompat(2031); }
    ] });
  T({ baris: 2045, jalan: function (m) { m.lompat(2031); } });

  rem(2050);
  T({ baris: 2051, jalan: function (m) {
      if (m.v.RN > 1) { m.v.RN--; m.locate(m.v.RN + 1, m.v.CN + 1, 1); }
    } });
  T({ baris: 2052, jalan: function (m) { m.kembali(); } });
  rem(2055);
  T({ baris: 2056, jalan: function (m) {
      if (m.v.CN > 1) { m.v.CN--; m.locate(m.v.RN + 1, m.v.CN + 1, 1); }
    } });
  T({ baris: 2057, jalan: function (m) { m.kembali(); } });
  rem(2060);
  T({ baris: 2061, jalan: function (m) {
      if (m.v.CN < m.v.NCOLS) { m.v.CN++; m.locate(m.v.RN + 1, m.v.CN + 1, 1); }
    } });
  T({ baris: 2062, jalan: function (m) { m.kembali(); } });
  rem(2065);
  T({ baris: 2066, jalan: function (m) {
      if (m.v.RN < m.v.NROWS) { m.v.RN++; m.locate(m.v.RN + 1, m.v.CN + 1, 1); }
    } });
  T({ baris: 2067, jalan: function (m) { m.kembali(); } });

  /* --- 2070-2078: menghapus satu petak ------------------------------------
     Menghapus dari daftar berarti MENCARINYA dulu (2072-2074), lalu menggeser
     seluruh sisanya maju satu (2075-2077). Daftar yang mudah ditambahi jadi
     mahal untuk dikurangi — dan penyuntingan memang jarang, jadi harganya
     dibayar di tempat yang benar. */
  rem(2070);
  T({ baris: 2071, jalan: function (m) {
      if (m.v['G()'][m.v.RN][m.v.CN][m.v.CUR] === 0) m.kembali();
    } });
  T({ baris: 2072, jalan: function (m) {
      m.untuk('K', m.v['LLEN()'][m.v.CUR], 1, -1, 2074);
    } });
  T({ baris: 2073, jalan: function (m) {
      var CL = m.v['CLIST()'];
      if (CL[0][m.v.K][m.v.CUR] === m.v.RN && CL[1][m.v.K][m.v.CUR] === m.v.CN) {
        m.lompat(2075);
      }
    } });
  /* 2074 `NEXT K : STOP` — dan STOP-nya adalah PENJAGA. Kalau gelungnya habis
     tanpa menemukan petaknya, berarti larik G dan daftar CLIST sudah tidak
     sepakat, dan program menolak melanjutkan. Pernyataan "ini tidak mungkin
     terjadi" yang ditulis sebagai kode, di tahun 1983. */
  T({ baris: 2074, bagian: [
      function (m) { m.lanjutkan('K'); },
      function (m) {
        m.henti('STOP di baris 2074: petak yang hidup tidak ada di CLIST — ' +
                'larik G dan daftarnya sudah tidak sepakat.');
      }
    ] });
  T({ baris: 2075, jalan: function (m) {
      m.untuk('J', m.v.K, m.v['LLEN()'][m.v.CUR] - 1, 1, 2078);
    } });
  T({ baris: 2076, jalan: function (m) {
      var CL = m.v['CLIST()'], c = m.v.CUR, j = m.v.J;
      CL[0][j][c] = CL[0][j + 1][c]; CL[1][j][c] = CL[1][j + 1][c];
    } });
  T({ baris: 2077, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 2078, bagian: [
      function (m) {
        m.v['G()'][m.v.RN][m.v.CN][m.v.CUR] = 0;
        m.cetak(' ');
        m.locate(m.v.RN + 1, m.v.CN + 1, 1);
      },
      function (m) { m.kembali(); }
    ] });

  /* --- 2080-2089: menandai satu petak -------------------------------------- */
  rem(2080);
  T({ baris: 2081, jalan: function (m) {
      if (m.v['G()'][m.v.RN][m.v.CN][m.v.CUR] === 1) m.kembali();
    } });
  T({ baris: 2082, jalan: function (m) {
      m.v['G()'][m.v.RN][m.v.CN][m.v.CUR] = 1;
    } });
  T({ baris: 2084, jalan: function (m) {
      m.v['LLEN()'][m.v.CUR] = m.v['LLEN()'][m.v.CUR] + 1;
    } });
  T({ baris: 2086, jalan: function (m) {
      var CL = m.v['CLIST()'], c = m.v.CUR, n = m.v['LLEN()'][c];
      CL[0][n][c] = m.v.RN; CL[1][n][c] = m.v.CN;
    } });
  T({ baris: 2087, jalan: function (m) {
      m.locate(m.v.RN + 1, m.v.CN + 1, 1);
      m.cetak(m.v['CH$()'][m.v.CUR]);
      m.locate(m.v.RN + 1, m.v.CN + 1, 1);
    } });
  T({ baris: 2089, jalan: function (m) { m.kembali(); } });

  /* --- 2110-2119: mengosongkan papan ---------------------------------------
     Menghapus seluruh papan hanya menyentuh petak yang ada di daftar. Papan
     dengan tiga bakteri dibersihkan dalam tiga langkah. */
  rem(2110);
  T({ baris: 2112, jalan: function (m) {
      m.untuk('K', 1, m.v['LLEN()'][m.v.CUR], 1, 2118);
    } });
  T({ baris: 2114, jalan: function (m) {
      var CL = m.v['CLIST()'], c = m.v.CUR;
      m.v.RN = CL[0][m.v.K][c]; m.v.CN = CL[1][m.v.K][c];
      m.v['G()'][m.v.RN][m.v.CN][c] = 0;
    } });
  T({ baris: 2115, jalan: function (m) {
      m.locate(m.v.RN + 1, m.v.CN + 1); m.cetak(' ');
    } });
  T({ baris: 2116, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 2118, jalan: function (m) { m.v['LLEN()'][m.v.CUR] = 0; } });
  T({ baris: 2119, jalan: function (m) { m.kembali(); } });

  /* --- 2500-2599: bingkai kotak -------------------------------------------- */
  rem(2500);
  T({ baris: 2502, jalan: function (m) { m.cls(); } });
  T({ baris: 2504, jalan: function (m) { m.cetak(m.chr(218)); } });
  T({ baris: 2506, bagian: [
      function (m) { m.untuk('K', 1, m.v.NCOLS, 1); },
      function (m) { m.cetak(m.chr(196)); },
      function (m) { m.lanjutkan('K'); },
      function (m) { m.cetak(m.chr(191)); }
    ] });
  T({ baris: 2508, bagian: [
      function (m) { m.untuk('K', 2, m.v.NROWS + 1, 1); },
      function (m) { m.locate(m.v.K, m.v.NCOLS + 2); m.cetak(m.chr(179)); },
      function (m) { m.lanjutkan('K'); }
    ] });
  T({ baris: 2510, bagian: [
      function (m) { m.untuk('K', 2, m.v.NROWS + 1, 1); },
      function (m) { m.locate(m.v.K, 1); m.cetak(m.chr(179)); },
      function (m) { m.lanjutkan('K'); }
    ] });
  T({ baris: 2512, jalan: function (m) {
      m.locate(m.v.NROWS + 2, 1); m.cetak(m.chr(192));
    } });
  T({ baris: 2514, bagian: [
      function (m) { m.untuk('K', 1, m.v.NCOLS, 1); },
      function (m) { m.cetak(m.chr(196)); },
      function (m) { m.lanjutkan('K'); },
      function (m) { m.cetak(m.chr(217)); }
    ] });
  T({ baris: 2599, jalan: function (m) { m.kembali(); } });

  /* --- 4000-4099: satu generasi -------------------------------------------- */
  rem(4000);
  T({ baris: 4001, jalan: function (m) { m.locate(null, null, 0); } });
  rem(4002);
  /* 4004-4008 generasi lama dinolkan — lagi-lagi HANYA petak yang ada di
     daftarnya. Inilah yang membuat papan 1638 petak boleh dibiarkan begitu
     saja: yang perlu dibersihkan cuma yang pernah diisi. */
  T({ baris: 4004, jalan: function (m) {
      m.untuk('K', 1, m.v['LLEN()'][m.v.NXT], 1, 4008);
    } });
  T({ baris: 4006, jalan: function (m) {
      var CL = m.v['CLIST()'], x = m.v.NXT;
      m.v.RN = CL[0][m.v.K][x]; m.v.CN = CL[1][m.v.K][x];
      m.v['G()'][m.v.RN][m.v.CN][x] = 0;
    } });
  T({ baris: 4007, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 4008, jalan: function (m) {
      m.v['LLEN()'][m.v.NXT] = 0; m.v.LL = 0;
    } });
  rem(4010);
  T({ baris: 4012, jalan: function (m) {
      m.untuk('K', 1, m.v['LLEN()'][m.v.CUR], 1, 4062);
    } });
  rem(4020);
  T({ baris: 4022, jalan: function (m) {
      var CL = m.v['CLIST()'], c = m.v.CUR;
      m.v.RN = CL[0][m.v.K][c]; m.v.CN = CL[1][m.v.K][c];
    } });
  T({ baris: 4023, bagian: [
      function (m) { m.v.R = m.v.RN; m.v.C = m.v.CN; },
      function (m) { m.gosub(4100); }
    ] });
  T({ baris: 4025, jalan: function (m) {
      if (m.v.NN === 2 || m.v.NN === 3) m.lompat(4030);
    } });
  rem(4026);
  T({ baris: 4027, jalan: function (m) {
      m.v['G()'][m.v.RN][m.v.CN][m.v.NXT] = 0;
      m.locate(m.v.RN + 1, m.v.CN + 1); m.cetak(' ');
    } });
  T({ baris: 4029, jalan: function (m) { m.lompat(4040); } });
  rem(4030);
  T({ baris: 4031, jalan: function (m) {
      var CL = m.v['CLIST()'], x = m.v.NXT;
      m.v.LL = m.v.LL + 1;
      CL[0][m.v.LL][x] = m.v.RN; CL[1][m.v.LL][x] = m.v.CN;
      m.v['G()'][m.v.RN][m.v.CN][x] = 1;
    } });
  /* 4032 huruf yang dicetak diambil dengan indeks NXT — jadi tiap generasi
     memakai huruf yang berbeda dari sebelumnya. Lihat catatan di kepala. */
  T({ baris: 4032, jalan: function (m) {
      m.locate(m.v.RN + 1, m.v.CN + 1); m.cetak(m.v['CH$()'][m.v.NXT]);
    } });
  rem(4040);
  /* 4041-4048 delapan tetangga, ditulis satu per satu tanpa gelung. Gelung
     dua tingkat akan butuh pemeriksaan "jangan hitung dirinya sendiri" di
     setiap putaran; delapan baris lurus tidak butuh apa-apa. */
  [[4041, -1, 0], [4042, -1, 1], [4043, 0, 1], [4044, 1, 1],
   [4045, 1, 0], [4046, 1, -1], [4047, 0, -1], [4048, -1, -1]
  ].forEach(function (t) {
    T({ baris: t[0], bagian: [
        function (m) { m.v.R = m.v.RN + t[1]; m.v.C = m.v.CN + t[2]; },
        function (m) { m.gosub(4200); }
      ] });
  });
  T({ baris: 4060, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 4062, jalan: function (m) { m.v['LLEN()'][m.v.NXT] = m.v.LL; } });
  T({ baris: 4099, jalan: function (m) { m.kembali(); } });

  /* --- 4100-4102: hitung tetangga ------------------------------------------
     Delapan pembacaan larik dalam satu pernyataan, tanpa satu pun uji batas.
     Yang membolehkannya cincin pinggiran di baris 55: indeks 0 dan NROWS+1
     ada dan selalu nol. */
  rem(4100);
  T({ baris: 4102, bagian: [
      function (m) {
        var G = m.v['G()'], r = m.v.R, c = m.v.C, u = m.v.CUR;
        m.v.NN = G[r - 1][c][u] + G[r - 1][c + 1][u] + G[r][c + 1][u] +
                 G[r + 1][c + 1][u] + G[r + 1][c][u] + G[r + 1][c - 1][u] +
                 G[r][c - 1][u] + G[r - 1][c - 1][u];
      },
      function (m) { m.kembali(); }
    ] });

  /* --- 4200-4299: satu tetangga --------------------------------------------
     Tiga penolakan berurutan, dan urutannya dipilih dari yang paling murah:
     sudah hidup (satu pembacaan), di pinggir (empat perbandingan), sudah
     dimasukkan (satu pembacaan lagi). Baru sesudah ketiganya lolos,
     tetangganya dihitung. */
  rem(4200);
  T({ baris: 4203, jalan: function (m) {
      if (m.v['G()'][m.v.R][m.v.C][m.v.CUR] === 1) m.kembali();
    } });
  T({ baris: 4211, jalan: function (m) {
      if (m.v.R === 0 || m.v.R > m.v.NROWS ||
          m.v.C === 0 || m.v.C > m.v.NCOLS) m.kembali();
    } });
  /* 4213 pemeriksaan "sudah dimasukkan" — tanpa ini, petak yang bersebelahan
     dengan dua bakteri akan masuk daftar DUA KALI, dan daftarnya membengkak
     sampai batas 1500. */
  T({ baris: 4213, jalan: function (m) {
      if (m.v['G()'][m.v.R][m.v.C][m.v.NXT] === 1) m.kembali();
    } });
  T({ baris: 4221, bagian: [
      function (m) { m.gosub(4100); }
    ] });
  rem(4230);
  T({ baris: 4231, jalan: function (m) {
      if (m.v.NN === 3) {
        var CL = m.v['CLIST()'], x = m.v.NXT;
        m.v.LL = m.v.LL + 1;
        CL[0][m.v.LL][x] = m.v.R; CL[1][m.v.LL][x] = m.v.C;
        m.v['G()'][m.v.R][m.v.C][x] = 1;
        m.locate(m.v.R + 1, m.v.C + 1); m.cetak(m.v['CH$()'][x]);
      }
    } });
  T({ baris: 4299, jalan: function (m) { m.kembali(); } });

  /* --- 65000-65005: pulang ------------------------------------------------- */
  rem(65000);
  T({ baris: 65001, bagian: [
      function (m) {
        m.locate(25, 1); m.cetak(new Array(80).join(' '));
        m.locate(25, 1); m.cetak('  Press ESC key to continue ');
      },
      function (m) { m.masukan('ANS$', ''); },
      function (m) {
        if ((m.v['ANS$'] || ' ').charCodeAt(0) !== 27) m.lompat(65001);
      }
    ] });
  /* 65002 `ADDR.%` dan `DRIVE$` tidak pernah diisi di seluruh program ini —
     keduanya sisa dari cangkang disket majalah yang memuatnya. `ADDR.%`
     bernilai nol, jadi RUN-nya tidak pernah terjadi. Perhatikan juga TITIK di
     tengah namanya: nama variabel GW-BASIC boleh mengandung titik. */
  T({ baris: 65002, jalan: function (m) {
      if ((m.v['ADDR.%'] || 0) !== 0) m.jalankan((m.v['DRIVE$'] || '') + ':START');
    } });
  T({ baris: 65005, jalan: function (m) { m.henti('END di baris 65005.'); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['LIFE2'] = {
    nama: 'LIFE2',
    judul: 'Life (John Sigle, 21 Februari 1983)',
    sumber: 'LIFE2',
    berkas: 'run/LIFE2.BAS',
    tabel: tabel,
    benih: 21,

    arsitektur: {
      judul: 'Alur LIFE2.BAS',
      simpul: [
        { id: 'ajar', baris: '1000-1204', jenis: 'mulai',
          teks: ['Dua layar petunjuk,', 'aturan Conway ditulis lengkap'] },
        { id: 'kotak', baris: '2500-2599',
          teks: ['Bingkai 78x21 dari', 'aksara kotak CP437'] },
        { id: 'sunting', baris: '2000-2119', jenis: 'putusan',
          teks: ['Panah, M, spasi, C, R, Q.', 'Tiap tanda masuk DAFTAR'] },
        { id: 'nol', baris: '4004-4008',
          teks: ['Generasi lama dinolkan —', 'hanya yang ada di daftar'] },
        { id: 'hidup', baris: '4012-4032',
          teks: ['Tiap petak hidup:', '2 atau 3 tetangga = selamat'] },
        { id: 'tetangga', baris: '4041-4048',
          teks: ['Delapan tetangganya diperiksa;', 'tepat 3 tetangga = lahir'] },
        { id: 'tukar', baris: '376',
          teks: ['SWAP CUR,NXT —', 'dan hurufnya ikut berganti'] },
        { id: 'tombol', baris: '385-505', jenis: 'putusan',
          teks: ['E, spasi, C, Q'] }
      ],
      panah: [
        { dari: 'ajar', ke: 'kotak' },
        { dari: 'kotak', ke: 'sunting' },
        { dari: 'sunting', ke: 'nol', label: 'R' },
        { dari: 'nol', ke: 'hidup' },
        { dari: 'hidup', ke: 'tetangga' },
        { dari: 'tetangga', ke: 'hidup', label: 'petak berikutnya' },
        { dari: 'tetangga', ke: 'tukar', label: 'daftar habis' },
        { dari: 'tukar', ke: 'tombol' },
        { dari: 'tombol', ke: 'nol', label: 'tidak ada tombol' },
        { dari: 'tombol', ke: 'sunting', label: 'E' }
      ]
    },

    pseudokode: [
      { baris: 4012, tingkat: 0, teks: 'yang ditelusuri <b>DAFTAR petak hidup</b>, bukan papannya' },
      { baris: 4041, tingkat: 1, teks: '&hellip;ditambah delapan tetangga tiap petak, ditulis satu per satu' },
      { baris: 4213, tingkat: 1, teks: '&hellip;dan penjaga "sudah dimasukkan" yang mencegah daftar kembar' },
      { baris: 376, tingkat: 0, teks: '<code>SWAP CUR,NXT</code> &mdash; satu penukaran, bukan penyalinan larik' },
      { baris: 60, tingkat: 1, teks: '&hellip;dan huruf X/O ikut bertukar: <b>denyut generasi yang terlihat</b>' },
      { baris: 55, tingkat: 0, teks: 'cincin pinggiran +1 &rarr; baris 4102 tak perlu satu pun uji batas' },
      { baris: 52, tingkat: 0, teks: '<i>Mention early for efficiency</i> &mdash; daftar variabel dicari dari depan' },
      { baris: 2074, tingkat: 0, teks: '<code>STOP</code> sebagai <b>penjaga</b>: "ini tidak mungkin terjadi"' },
      { baris: 2016, tingkat: 0, teks: 'penyangga papan tik dikosongkan lewat <b>alamat BIOS</b>, bukan INKEY$' },
      { baris: 504, tingkat: 0, teks: 'jeda: baca satu tombol lalu <b>tafsirkan lagi</b> dari 501' }
    ],

    perintahAsli: 'run\\LIFE2.bat',
    catatanAsli: 'Dua layar petunjuk lebih dulu. Di mode EDIT, panah ' +
      'memindahkan kursor dan M menandai bakteri; R memulai evolusinya. ' +
      'Perhatikan hurufnya berganti X dan O tiap generasi.',

    penyimpangan: [
      '<b><code>SOUND 700,.1</code> diam</b> (baris 378); gelung tundanya ' +
      'tetap dijalankan sebagai gelung sungguhan.',

      '<b><code>DEF SEG=0:POKE 1052,PEEK(1050)</code> diganti pengosongan ' +
      'penyangga penelusur.</b> Alamat 1050 dan 1052 adalah kepala dan ekor ' +
      'penyangga papan tik BIOS; menyamakan keduanya mengosongkannya. ' +
      'Akibatnya sama persis, mekanismenya tidak.',

      '<b><code>INPUT$(1)</code> ditulis sebagai permintaan masukan biasa</b> ' +
      'di penelusur, jadi ia menunggu Enter alih-alih satu tombol.',

      '<b><code>RUN DRIVE$+":"+"START"</code> di baris 65002 tidak pernah ' +
      'terjadi</b> &mdash; lihat catatan cacat.'
    ],

    pelajaran: {
      ringkas: 'Daftar petak hidup alih-alih papan penuh &mdash; dan sebuah ' +
        'STOP yang dipasang sebagai penjaga, bukan sebagai kesalahan.',
      pelajari: [
        ['Menyimpan yang ada, bukan yang mungkin',
         'Papannya 21&times;78 = 1638 petak. Cara lugas menghitung satu ' +
         'generasi memeriksa semuanya.',
         'Program ini memelihara <code>CLIST</code> &mdash; daftar koordinat ' +
         'petak yang hidup &mdash; dan satu generasi hanya menyentuh petak di ' +
         'daftar itu ditambah delapan tetangga masing-masing.',
         'Pola dua puluh bakteri: 20 petak hidup, 160 tetangga, 180 ' +
         'pemeriksaan. Bukan 1638. Dan yang lebih penting: waktunya ikut ' +
         '<b>isi</b> papan, bukan ikut <b>ukuran</b> papan. Membesarkan ' +
         'papannya jadi gratis.',
         'Harganya dibayar di tempat lain: menghapus satu tanda saat ' +
         'menyunting butuh mencari petaknya di daftar lalu menggeser sisanya ' +
         '(baris 2072-2077). Mahal &mdash; dan penyuntingan memang jarang.'],
        ['Dua papan, satu SWAP',
         '<code>G</code> berdimensi tiga: baris, kolom, dan <b>nomor ' +
         'papan</b>. <code>CUR</code> dan <code>NXT</code> memilih papan mana ' +
         'yang mana.',
         'Baris 376 menukar keduanya. Satu pernyataan, dan generasi baru jadi ' +
         'generasi sekarang &mdash; tanpa menyalin 1638 petak ke mana pun.',
         'Dan <code>CLIST</code> serta <code>LLEN</code> juga berdimensi ' +
         'ganda dengan indeks yang sama, jadi satu penukaran memindahkan ' +
         'seluruh keadaan sekaligus.'],
        ['Huruf yang berganti sebagai denyut',
         '<code>60 CH$(0)="X" : CH$(1)="O"</code>, dan baris 4032 mencetak ' +
         '<code>CH$(NXT)</code>.',
         'Karena <code>NXT</code> bertukar tiap generasi, generasi ganjil ' +
         'tampil sebagai X dan generasi genap sebagai O. Layarnya berdenyut, ' +
         'dan denyut itu memberi tahu pemainnya bahwa sesuatu memang berjalan ' +
         '&mdash; bahkan pada pola yang diam.',
         'Ada akibat kedua yang tidak kalah berguna: petak yang tetap hidup ' +
         'ditimpa huruf yang <b>berbeda</b>, jadi ia terlihat digambar ulang ' +
         'dan layarnya tidak perlu dibersihkan lebih dulu.',
         'Ditelusuri dengan satu <i>glider</i> lima bakteri: empat generasi ' +
         'berturut-turut tampil sebagai O, X, O, X, dan sesudah keempatnya ' +
         'polanya kembali ke bentuk semula &mdash; bergeser satu petak ke ' +
         'kanan-bawah. <code>LLEN</code> tetap 5 sepanjang keempatnya.'],
        ['STOP sebagai penjaga',
         '<code>2074 NEXT K : STOP</code>',
         'Gelung di baris 2072-2074 mencari petak yang mau dihapus di dalam ' +
         '<code>CLIST</code>. Kalau ketemu, baris 2073 melompat keluar. Kalau ' +
         'gelungnya sampai habis, berarti petak itu tercatat hidup di ' +
         '<code>G</code> tapi tidak ada di daftarnya.',
         'Itu tidak mungkin terjadi. Dan justru karena tidak mungkin, ' +
         'penulisnya menaruh <code>STOP</code> di sana &mdash; program ' +
         'berhenti dan mengatakan di baris berapa, alih-alih melanjutkan ' +
         'dengan dua struktur data yang sudah tidak sepakat.',
         'Pernyataan "ini tidak mungkin terjadi", ditulis sebagai kode yang ' +
         'benar-benar jalan. Tahun 1983.'],
        ['Cincin pinggiran alih-alih uji batas',
         '<code>55 DIM G(NROWS+1,NCOLS+1,1)</code> &mdash; satu lebih besar ' +
         'dari yang dipakai, di kedua sumbu.',
         'Petak 0 dan NROWS+1 ada dan selalu nol. Karena itu baris 4102 boleh ' +
         'membaca delapan tetangga sekaligus tanpa satu pun perbandingan:',
         '<code>4102 NN=G(R-1,C,CUR)+G(R-1,C+1,CUR)+&hellip;</code>',
         'Uji batasnya tetap ada &mdash; tapi cuma di baris 4211, sekali, ' +
         'saat memutuskan apakah sebuah petak boleh <b>melahirkan</b>. ' +
         'Menghitung dan memutuskan dipisah, dan yang mahal cuma dikerjakan ' +
         'di tempat yang benar-benar butuh.'],
        ['Menyebut variabel lebih awal',
         '<code>52 C=0:R=0:CUR=0:NXT=1:NN=0:CR=0:RN=0 \'Mention early for ' +
         'efficiency</code>',
         'GW-BASIC menyimpan variabel dalam satu daftar dan MENCARINYA dari ' +
         'depan tiap kali sebuah nama muncul. Variabel yang pertama kali ' +
         'disebut duduk paling depan.',
         'Baris ini menyebut tujuh variabel yang paling sering dipakai gelung ' +
         'terdalam &mdash; sebelum apa pun yang lain &mdash; semata-mata ' +
         'supaya pencariannya pendek.',
         'Pengoptimalan yang sekarang tidak punya padanan sama sekali, dan ' +
         'yang hanya bisa ditulis oleh orang yang tahu bagaimana penafsirnya ' +
         'bekerja di dalam.']
      ],
      hindari: [
        ['Daftar yang lebih pendek dari papannya',
         '<code>58 DIM CLIST(1,1500,1)</code>. Daftarnya menampung 1500 ' +
         'koordinat.',
         'Papannya 21&times;78 = <b>1638</b> petak.',
         'Jadi pola yang mengisi lebih dari 1500 petak sekaligus akan ' +
         'menabrak batas larik di baris 4031 atau 4231 &mdash; "Subscript ' +
         'out of range", dan seluruh pola hilang.',
         'Tidak ada satu pun pemeriksaan terhadap <code>LL</code>. Angka 1500 ' +
         'dipilih sebagai "cukup besar", dan ia memang cukup besar untuk ' +
         'setiap pola yang masuk akal &mdash; tapi tidak untuk setiap pola ' +
         'yang MUNGKIN, dan bedanya cuma sembilan persen.',
         'Menaikkannya jadi 1638 menghabiskan 552 bita dan menghapus seluruh ' +
         'persoalannya.'],
        ['Jalan pulang ke variabel yang tidak pernah diisi',
         '<code>65002 IF ADDR.%&lt;&gt;0 THEN RUN DRIVE$+":"+"START"</code>',
         '<code>ADDR.%</code> dan <code>DRIVE$</code> tidak pernah muncul di ' +
         'tempat lain mana pun di 188 baris ini. Keduanya diisi nol dan ' +
         'string kosong, jadi syaratnya selalu salah dan <code>RUN</code>-nya ' +
         'tidak pernah terjadi.',
         'Keduanya sisa dari cangkang disket majalah yang dulu memuatnya ' +
         '&mdash; baris 65000 masih berkomentar <i>Return to Magazette</i>. ' +
         'Kalau program dijalankan dari cangkang itu, variabelnya sudah ' +
         'terisi sebelum program ini mulai.',
         'Ini bentuk paling halus dari cacat "jalan pulang yang hilang" di ' +
         'koleksi ini: kodenya masih ada, syaratnya masih diuji, dan yang ' +
         'lenyap cuma dunia tempat syarat itu pernah benar.'],
        ['Nomor baris yang meleset seribu',
         'Urutan nomor di layar petunjuk: 1006, 1008, 1009, 1010, 1011, ' +
         '<b>1112</b>, 1114, 1116&hellip;',
         'Baris 1112 jelas dimaksudkan 1012. Angkanya salah ketik seribu.',
         'Tidak ada akibatnya &mdash; 1112 tetap lebih besar dari 1011, jadi ' +
         'urutan jalannya benar. Tapi ia menutup celah: tidak ada lagi tempat ' +
         'untuk menyisipkan baris di antara 1011 dan 1112 tanpa mengacak ' +
         'penomoran, dan seluruh sisa layar petunjuk sekarang duduk di ' +
         'wilayah nomor yang salah.']
      ]
    },

    penjelasan: [
      { judul: 'Papan yang tidak pernah ditelusuri',
        isi: [
          'Cara yang lugas menghitung satu generasi Kehidupan Conway: dua ' +
          'gelung bersarang atas seluruh papan, hitung tetangga tiap petak, ' +
          'tentukan nasibnya. Untuk papan 21&times;78 itu 1638 petak, dan ' +
          'tiap petak butuh delapan pembacaan larik. Tiga belas ribu ' +
          'pembacaan per generasi.',
          'Di GW-BASIC tahun 1983, itu beberapa detik per generasi. Terlalu ' +
          'lambat untuk terlihat hidup.',
          'Program ini tidak melakukannya. Ia memelihara sebuah daftar:',
          '<code>58 DIM CLIST(1,1500,1), LLEN(1)</code>',
          '<code>CLIST(0,k,papan)</code> baris petak ke-k, ' +
          '<code>CLIST(1,k,papan)</code> kolomnya, dan <code>LLEN(papan)</code> ' +
          'berapa banyak yang terpakai.',
          'Satu generasi (baris 4012-4060) menelusuri daftar itu, bukan ' +
          'papannya. Untuk tiap petak hidup ia melakukan dua hal: memutuskan ' +
          'apakah petak itu sendiri bertahan, dan memeriksa kedelapan ' +
          'tetangganya sebagai calon kelahiran.',
          'Pola dua puluh bakteri berarti 20 petak dan 160 tetangga. Seratus ' +
          'delapan puluh pemeriksaan, bukan 1638.',
          'Yang lebih penting daripada angkanya: waktunya sekarang ikut ' +
          '<b>isi</b> papan, bukan ikut <b>ukuran</b> papan. Membesarkan ' +
          'papan dua kali lipat tidak menambah apa pun selama polanya tidak ' +
          'ikut membesar.',
          'Dan ada satu bagian yang mudah terlewat &mdash; baris 4213:',
          '<code>4213 IF G(R,C,NXT)=1 THEN RETURN  \'Cell already added</code>',
          'Sebuah petak kosong bisa jadi tetangga dari beberapa bakteri ' +
          'sekaligus, dan karena itu diperiksa beberapa kali dalam satu ' +
          'generasi. Tanpa baris ini ia akan masuk daftar berkali-kali, dan ' +
          'daftarnya membengkak sampai batas.',
          'Yang dipakai sebagai penanda "sudah dimasukkan" bukan larik ' +
          'tersendiri, melainkan papan <code>NXT</code> itu sendiri &mdash; ' +
          'yang memang sedang diisi. Satu struktur data yang menjawab dua ' +
          'pertanyaan.',
          'Urutan penolakan di baris 4203-4213 juga bukan kebetulan: sudah ' +
          'hidup (satu pembacaan), di pinggir (empat perbandingan), sudah ' +
          'dimasukkan (satu pembacaan). Yang paling murah dan paling sering ' +
          'benar diletakkan paling depan.'
        ] },
      { judul: 'Mention early for efficiency',
        isi: [
          'Baris kelima puluh dua:',
          "<code>52 C=0:R=0:CUR=0:NXT=1:NN=0:CR=0:RN=0 'Mention early for " +
          'efficiency</code>',
          'Tujuh penugasan yang semuanya tidak melakukan apa-apa &mdash; ' +
          'variabel BASIC sudah bernilai nol sebelum disebut. Yang dikerjakan ' +
          'baris ini bukan mengisi, melainkan <b>menyebut</b>.',
          'GW-BASIC menyimpan seluruh variabel program dalam satu daftar ' +
          'berurutan. Tiap kali sebuah nama muncul di dalam kode, penafsirnya ' +
          'mencari nama itu di daftar &mdash; dari depan, satu per satu. ' +
          'Variabel yang pertama kali disebut duduk paling depan dan paling ' +
          'cepat ditemukan; yang disebut belakangan duduk di belakang.',
          'Tujuh nama di baris 52 adalah tujuh nama yang paling sering muncul ' +
          'di gelung terdalam program ini. <code>R</code> dan <code>C</code> ' +
          'muncul enam belas kali dalam satu baris 4102 saja. ' +
          '<code>CUR</code> dan <code>NXT</code> muncul di hampir setiap ' +
          'pembacaan larik.',
          'Memindahkan mereka ke depan daftar tidak mengubah satu pun ' +
          'hasilnya. Ia hanya memperpendek pencarian &mdash; dan pencarian ' +
          'itu terjadi puluhan ribu kali per generasi.',
          'Komentar tiga katanya menjelaskan seluruhnya kepada siapa pun yang ' +
          'tahu bagaimana penafsirnya bekerja, dan tidak menjelaskan apa-apa ' +
          'kepada siapa pun yang tidak.',
          'Pengoptimalan seperti ini tidak punya padanan di bahasa mana pun ' +
          'yang dipakai sekarang. Ia menuntut model mental tentang isi perut ' +
          'penafsirnya &mdash; pengetahuan yang tidak ada di manual bahasa, ' +
          'cuma di manual mesinnya. Dan begitu penafsirnya diganti, seluruh ' +
          'pengetahuan itu jadi tidak berlaku.',
          'Baris 52 masih di sana, masih benar, dan sudah tidak berarti apa-' +
          'apa lagi.'
        ] }
    ]
  };
})(window);
