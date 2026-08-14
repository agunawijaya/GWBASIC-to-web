/* ===========================================================================
   BATSHIP.js — porting minimalis BATSHIP.BAS sebagai tabel baris.

       1010 REM PUBLIC DOMAIN SOFTWARE
       1030 REM WRITTEN BY G.S. ALBERTS
       1050 REM IBM BURLINGTON, VERMONT ... DEPT KO2 BLDG 965-2
       1060 REM LAST REVISED 7-27-82

   Kapal Perang lawan komputer: enam kapal disembunyikan di petak 10x10, dan
   pemain menembak tiga kali tiap giliran sampai semuanya tenggelam.

   YANG PALING LAYAK DILIHAT: ATURAN "KAPAL TIDAK BOLEH BERSENTUHAN"
   DIWUJUDKAN SEBAGAI DAFTAR PETAK TERLARANG.

       5100 FOR I=1 TO ZZZ
       5110 J=(((I-1)*9)+1)
       5120 XED(J)=X(I):YED(J)=Y(I)+1
       ...
       5200 XED(J+8)=X(I):YED(J+8)=Y(I)

   Untuk tiap petak yang sudah dipakai kapal, SEMBILAN petak dicatat: petak
   itu sendiri dan delapan tetangganya. Lalu kapal berikutnya diperiksa
   dengan membandingkan tiap petaknya ke seluruh daftar itu:

       5300 FOR I=1 TO 9*ZZZ
       5310   FOR J=ZZZ+1 TO ZZZZ+ZZZ
       5320     IF X(J)=XED(I) AND Y(J)=YED(I) THEN FLIP=1

   Tidak ada perhitungan ketetanggaan saat menguji. Yang terlarang sudah
   DIBUAT dulu, satu per satu, dan pengujiannya cuma pencarian.

   Dua puluh dua petak kapal kali sembilan = 198 entri, dan lariknya di-DIM
   lima ratus.

   DAN `ON Z GOTO` DENGAN NOL YANG SENGAJA JATUH.

       3050 ON Z GOTO 3130,3200,3270

   `Z` bernilai 0 sampai 3, tapi sasarannya cuma tiga. Di BASIC, `ON 0 GOTO`
   TIDAK melompat ke mana-mana — ia jatuh ke baris berikutnya. Jadi arah ke-0
   (utara) adalah baris di bawahnya, dan tiga arah lain jadi sasaran. Empat
   cabang dari tiga alamat.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` dan `PLAY` diam.
   - `RANDOMIZE` memasang benih tetap; baris 1170-1200 tetap ditelusuri
     supaya terlihat bagaimana benihnya diaduk dari jam.
   - `CHAIN "MENU",1000` dan `LOAD "MENU",R` sama-sama diperlakukan sebagai
     `RUN "MENU"`. Kedua bentuk itu dipakai di berkas yang sama.
   - Baris 1040 dan 1050 sudah disunting pemilik koleksi (alamat rumah dan
     nomor telepon penulis).
   =========================================================================== */

(function (global) {
  'use strict';

  function bas(n) {
    if (n === undefined || n === null) n = 0;
    var s = (n === Math.trunc(n)) ? String(Math.abs(n))
                                  : String(Math.abs(n));
    return (n < 0 ? '-' : ' ') + s + ' ';
  }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function pet(n, baris, kolom, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  var tabel = [];
  function T(x) { if (x) tabel.push(x); return x; }

  /* --- 1000-1240: pembuka ---------------------------------------------- */
  [1000, 1010, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090].forEach(function (n) {
    T(rem(n));
  });
  T({ baris: 1100, jalan: function (m) {
      m.dim('X()', 25); m.dim('Y()', 25);
      m.dim('S$()', 100, 3); m.dim('YY$()', 100, 3);
      m.dim('XX()', 100, 3); m.dim('YY()', 100, 3);
    } });
  /* 1110-1120 `XED`/`YED` menampung daftar petak terlarang: 22 petak kapal
     kali sembilan = 198 entri, di-DIM lima ratus.
     `A()` dan `B()` di baris 1120 HANYA dipakai oleh lima baris debug yang
     sudah dikomentari di 5230-5270. Seribu unsur larik yang disediakan
     untuk kode yang dimatikan. */
  T({ baris: 1110, jalan: function (m) {
      m.dim('XED()', 500); m.dim('YED()', 500);
    } });
  T({ baris: 1120, jalan: function (m) {
      m.dim('A()', 500); m.dim('B()', 500);
    } });
  T({ baris: 1130, jalan: function (m) { m.cls(); } });
  T(pet(1140, 10, 30, 'B A T T L E S H I P'));
  T(pet(1150, 12, 30, 'BY G.S. ALBERTS'));
  T(rem(1160));
  /* 1170-1200 BENIH DARI JAM, diaduk dengan dua lipatan yang aneh: jam di
     atas 16 dikurangi 12, lalu yang masih di atas 8 dijadikan `8-H` —
     bilangan NEGATIF. Hasilnya dikalikan menit dan detik. */
  T({ baris: 1170, jalan: function (m) {
      m.v.H = 1 + 10; m.v.M = 1 + 43; m.v.S = 1 + 7;
    } });
  T({ baris: 1180, jalan: function (m) { if (m.v.H > 16) m.v.H = m.v.H - 12; } });
  T({ baris: 1190, jalan: function (m) { if (m.v.H > 8) m.v.H = 8 - m.v.H; } });
  T({ baris: 1200, jalan: function (m) {
      m.v.N = m.v.H * m.v.M * m.v.S; m.semai(Math.abs(m.v.N));
    } });
  T({ baris: 1210, bagian: [
      function (m) { m.locate(24, 30); },
      function (m) { m.masukan('ANS$', 'DO YOU NEED INSTRUCTION? (Y/N)? '); }
    ] });
  T(ya(1220, 'Y', 1250)); T(ya(1230, 'y', 1250));
  T({ baris: 1240, jalan: function (m) { m.lompat(1510); } });

  /* --- 1250-1500: petunjuk --------------------------------------------- */
  T(rem(1250));
  T({ baris: 1260, jalan: function (m) {
      m.cls();
      m.cetak('THE COMPUTER WILL HIDE SIX SHIPS ON A 10 X 10 GRID.  THE SHIPS CAN NOT ');
      m.barisBaru();
    } });
  T(cet(1270, 'TOUCH EACH OTHER OR OVERLAP.  IT WILL BE YOUR JOB, USING SALVOS OF THREE '));
  T(cet(1280, 'SHOTS EACH TURN, TO SINK ALL OF THE SHIPS IN THE MINIMUM NUMBER OF TURNS.'));
  T({ baris: 1290, jalan: function (m) {
      m.barisBaru();
      m.cetak('YOU WILL BE ASKED TO INPUT YOUR SHOTS USING THE CO-ORDINATE SYSTEM');
      m.barisBaru();
    } });
  T(cet(1300, 'SHOWN ON THE PLAYING BOARD i.e. A1, OR B3, OR H9, etc.'));
  T(cet(1310, ''));
  T(cet(1320, 'YOU HAVE TO PUT A SHELL INTO EACH GRID SQUARE CONTAINING A PART OF THE SHIP'));
  T(cet(1330, 'TO SINK THAT SHIP.  THEREFORE IT TAKES 7 HITS TO SINK THE AIRCRAFT CARRIER'));
  T(cet(1340, '5 TO SINK THE BATTLESHIP, 4 TO SINK THE CRUISER, ETC.'));
  T({ baris: 1350, jalan: function (m) { m.barisBaru(); m.barisBaru(); } });
  T(cet(1360, 'THE COMPUTER WILL RECORD YOUR SHOTS ON THE PLAYING BOARD BY THE TURN'));
  T(cet(1370, 'NUMBER OF THAT SHOT.  AFTER THE THREE SHOTS OF THE SALVO IT WILL ALSO'));
  T(cet(1380, 'PRINT ANY HITS ON THE SHIP SCORECARD TO THE RIGHT OF THE BOARD - AGAIN'));
  T(cet(1390, 'USING THE TURN NUMBER WHEN THAT SHIP WAS HIT.'));
  /* 1400-1420 PROGRAM YANG MENGAKUI PENDEKATANNYA SENDIRI: kartu skor
     menandai kapal yang kena, bukan bagian mana yang kena. */
  T({ baris: 1400, jalan: function (m) {
      m.barisBaru();
      m.cetak('HOWEVER THE PLACE WHERE THE SHOT IS RECORDED ON THE SCORECARD');
      m.barisBaru();
    } });
  T(cet(1410, 'WILL NOT NECESSARILY BE THE PART OF THE SHIP HIT.  IS IS USED ONLY'));
  T(cet(1420, 'TO GIVE YOU A RECORD OF WHICH SHIPS YOU HIT ON WHICH TURNS.'));
  T({ baris: 1430, jalan: function (m) { m.barisBaru(); m.barisBaru(); } });
  T({ baris: 1440, jalan: function (m) {
      m.masukan('ANS$',
        'DO YOU WANT TO SEE THE PLAYING BOARD AND SHIPS USED BEFORE STARTING? ');
    } });
  T(ya(1450, 'N', 1510)); T(ya(1460, 'n', 1510));
  T(rem(1470));
  T({ baris: 1480, jalan: function (m) { m.gosub(1700); } });
  T({ baris: 1490, bagian: [
      function (m) { m.locate(24, 1); },
      function (m) { m.masukan('X$', 'PRESS ENTER TO CONTINUE? '); }
    ] });
  T({ baris: 1500, jalan: function (m) { m.lompat(1510); } });

  /* --- 1510-1690: gelung permainan ------------------------------------- */
  T(rem(1510));
  T({ baris: 1520, jalan: function (m) { m.cls(); } });
  T({ baris: 1530, bagian: [
      function (m) { m.locate(10, 30); },
      function (m) { m.masukan('ANS$', 'ARE YOU READY TO GO? '); }
    ] });
  /* 1540-1550 keluar lewat `CHAIN "MENU",1000`; baris 1690 keluar lewat
     `LOAD "MENU",R`. Dua cara berbeda meninggalkan program yang sama. */
  T(keluar(1540, 'N')); T(keluar(1550, 'n'));
  T({ baris: 1560, jalan: function (m) { m.gosub(6400); } });
  T({ baris: 1570, jalan: function (m) { m.gosub(1700); } });
  T({ baris: 1580, jalan: function (m) { m.gosub(2850); } });
  T({ baris: 1590, jalan: function (m) { m.v.TURN = 1; } });
  T({ baris: 1600, jalan: function (m) { m.gosub(5360); } });
  /* 1610 dua puluh dua petak kapal; kalau semuanya kena, permainan selesai. */
  T({ baris: 1610, jalan: function (m) {
      var t = (m.v.HAC || 0) + (m.v.HB || 0) + (m.v.HC || 0) +
              (m.v.HD || 0) + (m.v.HS || 0) + (m.v.HPT || 0);
      if (t === 22) m.lompat(1650);
    } });
  T({ baris: 1620, jalan: function (m) { m.v.TURN = m.v.TURN + 1; } });
  T({ baris: 1630, jalan: function (m) { m.gosub(5360); } });
  T({ baris: 1640, jalan: function (m) { m.lompat(1610); } });
  T({ baris: 1650, jalan: function (m) { m.gosub(6400); } });
  /* 1660 tulisannya berbunyi "SHOTS", tapi `TURN` menghitung GILIRAN — dan
     tiap giliran berisi tiga tembakan. Angkanya sepertiga dari yang
     dikatakannya. */
  T({ baris: 1660, jalan: function (m) {
      m.warna(0, 7); m.locate(23, 1);
      m.cetak('OK---------SO YOU FINALLY DID IT IN ' + bas(m.v.TURN) +
              'SHOTS          '); m.barisBaru();
    } });
  T({ baris: 1670, jalan: function (m) { m.gosub(6420); } });
  T({ baris: 1680, jalan: function (m) { m.warna(7, 0); } });
  T({ baris: 1690, jalan: function (m) { m.jalankan('MENU'); } });

  /* --- 1700-2840: menggambar papan dan kartu skor ---------------------- */
  T({ baris: 1700, jalan: function (m) { m.cls(); } });
  T(gelung(1710, 'J', 2, 22, 2, 1770));
  T(gelung(1720, 'I', 1, 52, 1, 1760));
  T({ baris: 1730, jalan: function (m) { m.locate(m.v.J, m.v.I); } });
  T({ baris: 1740, jalan: function (m) { m.cetak(m.chr(220)); } });
  T(lanjut(1750, 'I')); T(lanjut(1760, 'J'));
  T(gelung(1770, 'J', 1, 22, 1, 1830));
  T(gelung(1780, 'I', 3, 53, 5, 1820));
  T({ baris: 1790, jalan: function (m) { m.locate(m.v.J, m.v.I); } });
  T({ baris: 1800, jalan: function (m) { m.cetak(m.chr(219)); } });
  T(lanjut(1810, 'I')); T(lanjut(1820, 'J'));
  T({ baris: 1830, jalan: function (m) { m.v.I = 0; } });
  T(gelung(1840, 'J', 4, 49, 5, 1890));
  T({ baris: 1850, jalan: function (m) { m.locate(1, m.v.J); } });
  T({ baris: 1860, jalan: function (m) { m.cetak(bas(m.v.I)); } });
  T({ baris: 1870, jalan: function (m) { m.v.I = m.v.I + 1; } });
  T(lanjut(1880, 'J'));
  T({ baris: 1890, jalan: function (m) { m.locate(3, 1); } });
  T({ baris: 1900, jalan: function (m) { m.cetak('A'); m.barisBaru(); } });
  ['B','C','D','E','F','G','H','I','J'].forEach(function (h, i) {
    T(pet(1910 + i * 10, 5 + i * 2, 1, h));
  });
  /* 2000-2830 kartu skor di sebelah kanan: enam kotak kapal, digambar
     dengan gelung bersarang dan aksara blok. Kotak kapal induk berbentuk
     SALIB, sesuai bentuk kapalnya sendiri di papan. */
  T(gelung(2000, 'J', 55, 80, 1, 2060));
  T(gelung(2010, 'I', 3, 5, 2, 2050));
  T(taruh(2020)); T(blok(2030, 220));
  T(lanjut(2040, 'I')); T(lanjut(2050, 'J'));
  T(gelung(2060, 'J', 55, 60, 1, 2120));
  T(gelung(2070, 'I', 1, 7, 2, 2110));
  T(taruh(2080)); T(blok(2090, 220));
  T(lanjut(2100, 'I')); T(lanjut(2110, 'J'));
  T(gelung(2120, 'I', 55, 60, 5, 2180));
  T(gelung(2130, 'J', 2, 7, 1, 2170));
  T(taruhJI(2140)); T(blok(2150, 219));
  T(lanjut(2160, 'J')); T(lanjut(2170, 'I'));
  T(gelung(2180, 'I', 65, 80, 5, 2240));
  T(gelung(2190, 'J', 4, 5, 1, 2230));
  T(taruhJI(2200)); T(blok(2210, 219));
  T(lanjut(2220, 'J')); T(lanjut(2230, 'I'));
  T(pet(2240, 2, 63, 'AIRCRAFT CARRIER'));
  T(gelung(2250, 'I', 55, 80, 1, 2310));
  T(gelung(2260, 'J', 9, 11, 2, 2300));
  T(taruhJI(2270)); T(blok(2280, 220));
  T(lanjut(2290, 'J')); T(lanjut(2300, 'I'));
  T(gelung(2310, 'J', 55, 80, 5, 2370));
  T(gelung(2320, 'I', 10, 11, 1, 2360));
  T(taruh(2330)); T(blok(2340, 219));
  T(lanjut(2350, 'I')); T(lanjut(2360, 'J'));
  T(pet(2370, 8, 66, 'BATTLESHIP'));
  T(gelung(2380, 'J', 55, 75, 1, 2440));
  T(gelung(2390, 'I', 13, 15, 2, 2430));
  T(taruh(2400)); T(blok(2410, 220));
  T(lanjut(2420, 'I')); T(lanjut(2430, 'J'));
  T(gelung(2440, 'I', 14, 15, 1, 2500));
  T(gelung(2450, 'J', 55, 75, 5, 2490));
  T(taruh(2460)); T(blok(2470, 219));
  T(lanjut(2480, 'J')); T(lanjut(2490, 'I'));
  T(pet(2500, 12, 60, 'CRUISER'));
  T(gelung(2510, 'J', 55, 70, 1, 2570));
  T(gelung(2520, 'I', 17, 19, 2, 2560));
  T(taruh(2530)); T(blok(2540, 220));
  T(lanjut(2550, 'I')); T(lanjut(2560, 'J'));
  T(pet(2570, 16, 55, 'DESTROYER'));
  T(gelung(2580, 'J', 55, 70, 5, 2640));
  T(gelung(2590, 'I', 18, 19, 1, 2630));
  T(taruh(2600)); T(blok(2610, 219));
  T(lanjut(2620, 'I')); T(lanjut(2630, 'J'));
  T({ baris: 2640, jalan: function (m) {
      m.locate(20, 57); m.cetak('SUB');
    } });
  T(gelung(2650, 'I', 21, 23, 2, 2710));
  T(gelung(2660, 'J', 55, 65, 1, 2700));
  T(taruh(2670)); T(blok(2680, 220));
  T(lanjut(2690, 'J')); T(lanjut(2700, 'I'));
  T({ baris: 2710, jalan: function (m) {
      m.locate(20, 72); m.cetak('P.T.');
    } });
  T(gelung(2720, 'J', 70, 75, 1, 2780));
  T(gelung(2730, 'I', 21, 23, 2, 2770));
  T(taruh(2740)); T(blok(2750, 220));
  T(lanjut(2760, 'I')); T(lanjut(2770, 'J'));
  T(gelung(2780, 'J', 22, 23, 1, 2840));
  T(gelung(2790, 'I', 55, 75, 5, 2830));
  T(taruhJI(2800)); T(blok(2810, 219));
  T(lanjut(2820, 'I')); T(lanjut(2830, 'J'));
  T({ baris: 2840, jalan: function (m) { m.kembali(); } });

  /* --- 2850-3360: menyembunyikan kapal induk --------------------------- */
  T(rem(2850)); T(rem(2860));
  T({ baris: 2870, jalan: function (m) { m.warna(28, 0); } });
  T({ baris: 2880, jalan: function (m) { m.locate(23, 1); } });
  T(cet(2890, 'THE SYSTEM IS WORKING ON THE AIRCRAFT CARRIER.'));
  T({ baris: 2900, jalan: function (m) { m.warna(7, 0); } });
  /* 2910 `E` menentukan UJUNG MANA kapal induk yang bersalib — kapal ini
     satu-satunya yang bentuknya bukan garis lurus. */
  T({ baris: 2910, jalan: function (m) {
      m.v.X = Math.trunc(10 * m.acak());
      m.v.Y = Math.trunc(10 * m.acak());
      m.v.Z = Math.trunc(4 * m.acak());
      m.v.E = Math.trunc(2 * m.acak()) + 1;
    } });
  T(rem(2920));
  /* 2930-3040 dua belas penolakan berturut-turut: yang enam pertama menjaga
     panjang kapalnya muat, yang enam berikutnya menjaga salibnya muat. */
  T(tolak(2930, function (m) { return m.v.Y < 4 && m.v.Z === 0; }, 2910));
  T(tolak(2940, function (m) { return m.v.X > 5 && m.v.Z === 1; }, 2910));
  T(tolak(2950, function (m) { return m.v.Y > 5 && m.v.Z === 2; }, 2910));
  T(tolak(2960, function (m) { return m.v.X < 4 && m.v.Z === 3; }, 2910));
  T(tolak(2970, function (m) { return m.v.Z === 0 && m.v.X === 0; }, 2910));
  T(tolak(2980, function (m) { return m.v.Z === 0 && m.v.X === 9; }, 2910));
  T(tolak(2990, function (m) { return m.v.Z === 1 && m.v.Y === 0; }, 2910));
  T(tolak(3000, function (m) { return m.v.Z === 1 && m.v.Y === 9; }, 2910));
  T(tolak(3010, function (m) { return m.v.Z === 2 && m.v.X === 0; }, 2910));
  T(tolak(3020, function (m) { return m.v.Z === 2 && m.v.X === 9; }, 2910));
  T(tolak(3030, function (m) { return m.v.Z === 3 && m.v.Y === 0; }, 2910));
  T(tolak(3040, function (m) { return m.v.Z === 3 && m.v.Y === 9; }, 2910));
  /* 3050 `ON Z GOTO` DENGAN TIGA SASARAN UNTUK EMPAT NILAI. `Z=0` tidak
     melompat sama sekali dan jatuh ke baris berikutnya — arah utara. */
  T({ baris: 3050, jalan: function (m) {
      var ke = [3130, 3200, 3270][m.v.Z - 1];
      if (ke) m.lompat(ke);
    } });
  T(rem(3060));
  T({ baris: 3070, jalan: function (m) {
      var Y = m.v['Y()'];
      Y[1] = m.v.Y; Y[2] = m.v.Y - 1; Y[3] = m.v.Y - 2;
      Y[4] = m.v.Y - 3; Y[5] = m.v.Y - 4;
    } });
  T({ baris: 3080, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 5; m.v.I++) m.v['X()'][m.v.I] = m.v.X;
    } });
  T({ baris: 3090, jalan: function (m) {
      m.v['X()'][6] = m.v.X + 1; m.v['X()'][7] = m.v.X - 1;
    } });
  T(salib(3100, 1, 'Y()', function (m) { return m.v.Y; }));
  T(salib(3110, 2, 'Y()', function (m) { return m.v['Y()'][5]; }));
  T({ baris: 3120, jalan: function (m) { m.lompat(3340); } });
  T(rem(3130));
  T({ baris: 3140, jalan: function (m) {
      var X = m.v['X()'];
      X[1] = m.v.X; X[2] = m.v.X + 1; X[3] = m.v.X + 2;
      X[4] = m.v.X + 3; X[5] = m.v.X + 4;
    } });
  T({ baris: 3150, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 5; m.v.I++) m.v['Y()'][m.v.I] = m.v.Y;
    } });
  T({ baris: 3160, jalan: function (m) {
      m.v['Y()'][6] = m.v.Y + 1; m.v['Y()'][7] = m.v.Y - 1;
    } });
  T(salib(3170, 1, 'X()', function (m) { return m.v.X; }));
  T(salib(3180, 2, 'X()', function (m) { return m.v['X()'][5]; }));
  T({ baris: 3190, jalan: function (m) { m.lompat(3340); } });
  T(rem(3200));
  T({ baris: 3210, jalan: function (m) {
      var Y = m.v['Y()'];
      Y[1] = m.v.Y; Y[2] = m.v.Y + 1; Y[3] = m.v.Y + 2;
      Y[4] = m.v.Y + 3; Y[5] = m.v.Y + 4;
    } });
  T({ baris: 3220, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 5; m.v.I++) m.v['X()'][m.v.I] = m.v.X;
    } });
  T({ baris: 3230, jalan: function (m) {
      m.v['X()'][6] = m.v.X + 1; m.v['X()'][7] = m.v.X - 1;
    } });
  T(salib(3240, 2, 'Y()', function (m) { return m.v['Y()'][5]; }));
  T(salib(3250, 1, 'Y()', function (m) { return m.v.Y; }));
  T({ baris: 3260, jalan: function (m) { m.lompat(3340); } });
  T(rem(3270));
  T({ baris: 3280, jalan: function (m) {
      var X = m.v['X()'];
      X[1] = m.v.X; X[2] = m.v.X - 1; X[3] = m.v.X - 2;
      X[4] = m.v.X - 3; X[5] = m.v.X - 4;
    } });
  T({ baris: 3290, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 5; m.v.I++) m.v['Y()'][m.v.I] = m.v.Y;
    } });
  T({ baris: 3300, jalan: function (m) {
      m.v['Y()'][6] = m.v.Y + 1; m.v['Y()'][7] = m.v.Y - 1;
    } });
  T(salib(3310, 1, 'X()', function (m) { return m.v.X; }));
  T(salib(3320, 2, 'X()', function (m) { return m.v['X()'][5]; }));
  T({ baris: 3330, jalan: function (m) { m.lompat(3340); } });
  T(rem(3340));
  T({ baris: 3350, jalan: function (m) { m.v.ZZZ = 7; } });
  T({ baris: 3360, jalan: function (m) { m.gosub(5090); } });

  /* --- 3370-5080: lima kapal sisanya ----------------------------------- */
  T(rem(3370));
  T(kabar(3380, 3390, 3400, 'NOW IT IS THE BATTLESHIP WE ARE WORKING ON.     '));
  T({ baris: 3410, jalan: function (m) {
      m.v.X = Math.trunc(10 * m.acak());
      m.v.Y = Math.trunc(10 * m.acak());
      m.v.Z = Math.trunc(4 * m.acak());
    } });
  T(rem(3420));
  T({ baris: 3430, jalan: function (m) { m.v.FLIP = 0; } });
  T(tolak(3440, function (m) { return m.v.Z === 0 && m.v.Y < 4; }, 3410));
  T(tolak(3450, function (m) { return m.v.Z === 1 && m.v.X > 5; }, 3410));
  T(tolak(3460, function (m) { return m.v.Z === 2 && m.v.Y > 5; }, 3410));
  T(tolak(3470, function (m) { return m.v.Z === 3 && m.v.X < 4; }, 3410));
  T({ baris: 3480, jalan: function (m) {
      var ke = [3560, 3620, 3680][m.v.Z - 1];
      if (ke) m.lompat(ke);
    } });
  T(rem(3490));
  T(isiSama(3500, 3510, 3520, 8, 12, 'X()', function (m) { return m.v.X; }));
  T({ baris: 3530, jalan: function (m) {
      var Y = m.v['Y()'];
      for (var i = 0; i < 5; i++) Y[8 + i] = m.v.Y - i;
    } });
  T({ baris: 3540, jalan: function (m) { m.lompat(3720); } });
  T(rem(3550));
  T(isiSama(3560, 3570, 3580, 8, 12, 'Y()', function (m) { return m.v.Y; }));
  T({ baris: 3590, jalan: function (m) {
      var X = m.v['X()'];
      for (var i = 0; i < 5; i++) X[8 + i] = m.v.X + i;
    } });
  T({ baris: 3600, jalan: function (m) { m.lompat(3720); } });
  T(rem(3610));
  T(isiSama(3620, 3630, 3640, 8, 12, 'X()', function (m) { return m.v.X; }));
  T({ baris: 3650, jalan: function (m) {
      var Y = m.v['Y()'];
      for (var i = 0; i < 5; i++) Y[8 + i] = m.v.Y + i;
    } });
  T({ baris: 3660, jalan: function (m) { m.lompat(3720); } });
  T(rem(3670));
  T(isiSama(3680, 3690, 3700, 8, 12, 'Y()', function (m) { return m.v.Y; }));
  T({ baris: 3710, jalan: function (m) {
      var X = m.v['X()'];
      for (var i = 0; i < 5; i++) X[8 + i] = m.v.X - i;
    } });
  T(rem(3720));
  T(periksa(3730, 3740, 3750, 3760, 3770, 5, 3410));
  T(rem(3780));
  T(kabar(3790, 3810, 3820, 'WE ARE GETTING CLOSE---ITS CRUISER TIME!      ', 3800));
  T({ baris: 3830, jalan: function (m) {
      m.v.X = Math.trunc(10 * m.acak());
      m.v.Y = Math.trunc(10 * m.acak());
      m.v.Z = Math.trunc(4 * m.acak());
    } });
  T({ baris: 3840, jalan: function (m) { m.v.FLIP = 0; } });
  T(tolak(3850, function (m) { return m.v.Z === 0 && m.v.Y < 3; }, 3830));
  T(tolak(3860, function (m) { return m.v.Z === 1 && m.v.X > 6; }, 3830));
  T(tolak(3870, function (m) { return m.v.Z === 2 && m.v.Y > 6; }, 3830));
  T(tolak(3880, function (m) { return m.v.Z === 3 && m.v.X < 3; }, 3830));
  T({ baris: 3890, jalan: function (m) {
      var ke = [3960, 4020, 4080][m.v.Z - 1];
      if (ke) m.lompat(ke);
    } });
  /* Empat arah kapal penjelajah dan kapal perusak. Tiap blok berbentuk
     sama: REM, FOR, isi, NEXT, deret koordinat, lalu GOTO ke pemeriksa. */
  arah(3900, 3910, 3920, 3930, 3940, 3950, 13, 16, 'X()', 'X', 'Y()', 'Y', -1, 4, 4140);
  arah(3960, 3970, 3980, 3990, 4000, 4010, 13, 16, 'Y()', 'Y', 'X()', 'X', +1, 4, 4140);
  arah(4020, 4030, 4040, 4050, 4060, 4070, 13, 16, 'X()', 'X', 'Y()', 'Y', +1, 4, 4140);
  arah(4080, 4090, 4100, 4110, 4120, 4130, 13, 16, 'Y()', 'Y', 'X()', 'X', -1, 4, 4140);
  T(rem(4140));
  T(periksa(4150, 4160, 4170, 4180, 4190, 4, 3830));
  T(rem(4200));
  T(kabar(4210, 4230, 4240, 'D E S T R O Y E R   T I M E                ', 4220));
  T({ baris: 4250, jalan: function (m) {
      m.v.X = Math.trunc(10 * m.acak());
      m.v.Y = Math.trunc(10 * m.acak());
      m.v.Z = Math.trunc(4 * m.acak());
    } });
  T({ baris: 4260, jalan: function (m) { m.v.FLIP = 0; } });
  T(tolak(4270, function (m) { return m.v.Z === 0 && m.v.Y < 2; }, 4250));
  T(tolak(4280, function (m) { return m.v.Z === 1 && m.v.X > 7; }, 4250));
  T(tolak(4290, function (m) { return m.v.Z === 2 && m.v.Y > 7; }, 4250));
  T(tolak(4300, function (m) { return m.v.Z === 3 && m.v.X < 2; }, 4250));
  T({ baris: 4310, jalan: function (m) {
      var ke = [4380, 4440, 4500][m.v.Z - 1];
      if (ke) m.lompat(ke);
    } });
  arah(4320, 4330, 4340, 4350, 4360, 4370, 17, 19, 'X()', 'X', 'Y()', 'Y', -1, 3, 4550);
  arah(4380, 4390, 4400, 4410, 4420, 4430, 17, 19, 'Y()', 'Y', 'X()', 'X', +1, 3, 4550);
  arah(4440, 4450, 4460, 4470, 4480, 4490, 17, 19, 'X()', 'X', 'Y()', 'Y', +1, 3, 4550);
  arah(4500, 4510, 4520, 4530, 4540, null, 17, 19, 'Y()', 'Y', 'X()', 'X', -1, 3, 4550);
  T(rem(4550));
  T(periksa(4560, 4570, 4580, 4590, 4600, 3, 4250));
  T(rem(4610));
  T(kabar(4620, 4640, 4650, 'NEXT TO THE LAST ONE NOW -- SUB TIME....    ', 4630));
  T({ baris: 4660, jalan: function (m) {
      m.v.X = Math.trunc(10 * m.acak());
      m.v.Y = Math.trunc(10 * m.acak());
      m.v.Z = Math.trunc(4 * m.acak());
    } });
  T({ baris: 4670, jalan: function (m) { m.v.FLIP = 0; } });
  T(tolak(4680, function (m) { return m.v.Z === 0 && m.v.Y < 1; }, 4660));
  T(tolak(4690, function (m) { return m.v.Z === 1 && m.v.X > 8; }, 4660));
  T(tolak(4700, function (m) { return m.v.Z === 2 && m.v.Y > 8; }, 4660));
  T(tolak(4710, function (m) { return m.v.Z === 3 && m.v.X < 1; }, 4660));
  T({ baris: 4720, jalan: function (m) {
      var ke = [4770, 4810, 4850][m.v.Z - 1];
      if (ke) m.lompat(ke);
    } });
  T(rem(4730));
  T(dua(4740, 'X()', 20, 21, function (m) { return [m.v.X, m.v.X]; }));
  T(dua(4750, 'Y()', 20, 21, function (m) { return [m.v.Y, m.v.Y - 1]; }));
  T({ baris: 4760, jalan: function (m) { m.lompat(4880); } });
  T(rem(4770));
  T(dua(4780, 'Y()', 20, 21, function (m) { return [m.v.Y, m.v.Y]; }));
  T(dua(4790, 'X()', 20, 21, function (m) { return [m.v.X, m.v.X + 1]; }));
  T({ baris: 4800, jalan: function (m) { m.lompat(4880); } });
  T(rem(4810));
  T(dua(4820, 'Y()', 20, 21, function (m) { return [m.v.Y, m.v.Y + 1]; }));
  T(dua(4830, 'X()', 20, 21, function (m) { return [m.v.X, m.v.X]; }));
  T({ baris: 4840, jalan: function (m) { m.lompat(4880); } });
  T(rem(4850));
  T(dua(4860, 'Y()', 20, 21, function (m) { return [m.v.Y, m.v.Y]; }));
  T(dua(4870, 'X()', 20, 21, function (m) { return [m.v.X, m.v.X - 1]; }));
  T(rem(4880));
  T(periksa(4890, 4900, 4910, 4920, 4930, 2, 4660));
  T(rem(4940));
  T(kabar(4950, 4970, 4980, 'NOW THE LAST AND EASIEST -- THE P.T BOAT', 4960));
  T({ baris: 4990, jalan: function (m) {
      m.v['X()'][22] = Math.trunc(10 * m.acak());
      m.v['Y()'][22] = Math.trunc(10 * m.acak());
    } });
  T({ baris: 5000, jalan: function (m) { m.v.ZZZZ = 1; } });
  T({ baris: 5010, jalan: function (m) { m.v.FLIP = 0; } });
  T({ baris: 5020, jalan: function (m) { m.gosub(5290); } });
  T({ baris: 5030, jalan: function (m) { if (m.v.FLIP === 1) m.lompat(4990); } });
  T({ baris: 5040, jalan: function (m) { m.v.ZZZ = m.v.ZZZ + m.v.ZZZZ; } });
  T({ baris: 5050, jalan: function (m) { m.gosub(5090); } });
  T({ baris: 5060, jalan: function (m) { m.locate(23, 1); } });
  T(cet(5070, '                                               '));
  T({ baris: 5080, jalan: function (m) { m.kembali(); } });

  /* --- 5090-5350: daftar petak terlarang, dan pengujiannya ------------- */
  T(rem(5090));
  /* 5100-5210 TIAP PETAK KAPAL MELAHIRKAN SEMBILAN ENTRI: dirinya sendiri
     dan delapan tetangganya. Sesudah keenam kapal, daftarnya 198 entri —
     dengan banyak sekali pengulangan, dan itu tidak apa-apa. */
  T(gelung(5100, 'I', 1, function (m) { return m.v.ZZZ; }, 1, 5220));
  T({ baris: 5110, jalan: function (m) { m.v.J = (m.v.I - 1) * 9 + 1; } });
  T(larang(5120, 0, 0, +1)); T(larang(5130, 1, 0, -1));
  T(larang(5140, 2, -1, 0)); T(larang(5150, 3, +1, 0));
  T(larang(5160, 4, +1, +1)); T(larang(5170, 5, -1, -1));
  T(larang(5180, 6, +1, -1)); T(larang(5190, 7, -1, +1));
  T(larang(5200, 8, 0, 0));
  T(lanjut(5210, 'I'));
  /* 5220-5270 LIMA BARIS PENGUJI YANG DIKIRIM DALAM KEADAAN MATI. Kalau
     REM-nya dibuang, tiap petak terlarang digambar dengan huruf X di layar
     — dan pemrogramnya bisa melihat sendiri apakah aturannya bekerja.
     Larik `A(500)` dan `B(500)` di baris 1120 ada HANYA untuk lima baris
     ini. Seribu unsur, disediakan untuk kode yang dimatikan. */
  [5220, 5230, 5240, 5250, 5260, 5270].forEach(function (n) { T(rem(n)); });
  T({ baris: 5280, jalan: function (m) { m.kembali(); } });
  T(rem(5290));
  T(gelung(5300, 'I', 1, function (m) { return 9 * m.v.ZZZ; }, 1, 5350));
  T(gelung(5310, 'J', function (m) { return m.v.ZZZ + 1; },
           function (m) { return m.v.ZZZZ + m.v.ZZZ; }, 1, 5340));
  T({ baris: 5320, jalan: function (m) {
      if (m.v['X()'][m.v.J] === m.v['XED()'][m.v.I] &&
          m.v['Y()'][m.v.J] === m.v['YED()'][m.v.I]) m.v.FLIP = 1;
    } });
  T(lanjut(5330, 'J')); T(lanjut(5340, 'I'));
  T({ baris: 5350, jalan: function (m) { m.kembali(); } });

  /* --- 5360-6030: menerima tiga tembakan ------------------------------- */
  T(rem(5360));
  T(gelung(5370, 'J', 1, 3, 1, 5870));
  T({ baris: 5380, jalan: function (m) { m.locate(23, 1); } });
  T(cet(5390, '                                                      '));
  T({ baris: 5400, jalan: function (m) { m.locate(23, 1); } });
  T({ baris: 5410, jalan: function (m) {
      m.cetak('                                                       ' +
              m.ulang(10, 220));
    } });
  /* 5420 lima `CHR$(0)` dicetak ke layar. Bita nol tidak punya bentuk;
     yang tampak cuma kolom yang terlewati. */
  T({ baris: 5420, jalan: function (m) {
      m.cetak(m.ulang(5, 0) + m.ulang(5, 220));
      [55, 60, 65, 70, 75].forEach(function (k) {
        m.locate(23, k); m.cetak(m.chr(219));
      });
    } });
  T({ baris: 5430, bagian: [
      function (m) {
        m.locate(23, 1);
        m.cetak('SHOT #' + bas(m.v.J) + ' FOR TURN #' + bas(m.v.TURN) +
                '-FORMAT C8 OR G2 ETC.');
      },
      function (m) {
        var t = m.v.TURN, jj = m.v.J;
        m.masukan(function (nilai) {
          m.v['S$()'][t] = m.v['S$()'][t] || [];
          m.v['S$()'][t][jj] = nilai;
        }, '? ');
      }
    ] });
  T(cet(5440, '                                                       '));
  T({ baris: 5450, jalan: function (m) {
      if (sTembak(m).length !== 2) {
        m.locate(24, 1); m.cetak('ILLEGAL INPUT'); m.lompat(5380);
      }
    } });
  T({ baris: 5460, jalan: function (m) {
      m.v['YY$()'][m.v.TURN][m.v.J] = sTembak(m).charAt(0);
    } });
  /* 5470-5660 SEPULUH HURUF, DUA PULUH BARIS. Besar dan kecil ditulis
     terpisah, satu baris masing-masing — tidak ada pengubahan huruf. */
  'ABCDEFGHIJ'.split('').forEach(function (h, i) {
    T(huruf(5470 + i * 20, h, i));
    T(huruf(5480 + i * 20, h.toLowerCase(), i));
  });
  T({ baris: 5670, jalan: function (m) { m.locate(24, 1); } });
  T({ baris: 5680, jalan: function (m) { m.locate(24, 1); } });
  T({ baris: 5690, jalan: function (m) {
      m.cetak('ILLEGAL INPUT'); m.lompat(5380);
    } });
  T({ baris: 5700, jalan: function (m) {
      m.v['XX()'][m.v.TURN][m.v.J] =
        parseInt(sTembak(m).slice(-1), 10) || 0;
    } });
  T({ baris: 5710, jalan: function (m) {
      m.v['X$'] = sTembak(m).slice(-1);
      var c = m.v['X$'].charCodeAt(0);
      if (c < 48 || c > 57) {
        m.locate(24, 1); m.cetak('ILLEGAL INPUT'); m.lompat(5380);
      }
    } });
  T({ baris: 5720, jalan: function (m) {
      var x = m.v['XX()'][m.v.TURN][m.v.J];
      if (x < 0 || x > 9) {
        m.locate(24, 1); m.cetak('ILLEGAL INPUT '); m.lompat(5380);
      }
    } });
  T(rem(5730));
  T({ baris: 5740, jalan: function (m) { m.v.FLIP = 0; } });
  T(gelung(5750, 'K', 1, function (m) { return m.v.TURN; }, 1, 5810));
  T(gelung(5760, 'L', 1, 3, 1, 5800));
  T({ baris: 5770, jalan: function (m) {
      if (m.v.TURN === m.v.K && m.v.L === m.v.J) m.lompat(5790);
    } });
  /* 5780 PEMBANDINGNYA STRING MENTAH: "A1" dan "a1" dianggap dua tembakan
     yang berbeda, walaupun keduanya menunjuk petak yang sama. */
  T({ baris: 5780, jalan: function (m) {
      if (sTembak(m) === (m.v['S$()'][m.v.K] || [])[m.v.L]) m.v.FLIP = 1;
    } });
  T(lanjut(5790, 'L')); T(lanjut(5800, 'K'));
  T({ baris: 5810, jalan: function (m) {
      if (m.v.FLIP === 1) {
        m.locate(24, 1);
        m.cetak('YOU USED THAT ONE BEFORE - TRY AGAIN'); m.lompat(5380);
      }
    } });
  T({ baris: 5820, jalan: function () { /* SOUND: desing peluru */ } });
  T({ baris: 5830, jalan: function (m) {
      m.v.A = m.v['YY()'][m.v.TURN][m.v.J] * 2 + 3;
      m.v.B = m.v['XX()'][m.v.TURN][m.v.J] * 5 + 4;
    } });
  T({ baris: 5840, jalan: function (m) { m.locate(m.v.A, m.v.B); } });
  T({ baris: 5850, jalan: function (m) { m.cetak(bas(m.v.TURN)); } });
  T(lanjut(5860, 'J'));
  T({ baris: 5870, jalan: function (m) { m.warna(0, 7); } });
  T({ baris: 5880, jalan: function (m) {
      m.locate(23, 1);
      m.cetak('NOW CALCULATING THE RESULTS OF YOUR SHOTS-SEE ABOVE');
    } });
  T({ baris: 5890, jalan: function (m) { m.warna(7, 0); } });
  T(gelung(5900, 'J', 1, 3, 1, 6030));
  T(gelung(5910, 'K', 1, 22, 1, 6020));
  T({ baris: 5920, jalan: function (m) { m.v.FLIP = 0; } });
  T({ baris: 5930, jalan: function (m) {
      if (m.v['XX()'][m.v.TURN][m.v.J] === m.v['X()'][m.v.K] &&
          m.v['YY()'][m.v.TURN][m.v.J] === m.v['Y()'][m.v.K]) m.v.FLIP = 1;
    } });
  /* 5940-5990 SATU RENTANG INDEKS PER KAPAL: 1-7 induk, 8-12 kapal perang,
     13-16 penjelajah, 17-19 perusak, 20-21 kapal selam, 22 kapal PT. */
  T(kena(5940, function (m) { return m.v.K < 8; }, 'HAC', 1));
  T(kena(5950, function (m) { return m.v.K < 13 && m.v.K > 7; }, 'HB', 2));
  T(kena(5960, function (m) { return m.v.K < 17 && m.v.K > 12; }, 'HC', 3));
  T(kena(5970, function (m) { return m.v.K > 16 && m.v.K < 20; }, 'HD', 4));
  T(kena(5980, function (m) { return m.v.K > 19 && m.v.K < 22; }, 'HS', 5));
  T(kena(5990, function (m) { return m.v.K > 21; }, 'HPT', 6));
  T({ baris: 6000, jalan: function (m) { if (m.v.FLIP === 1) m.gosub(6050); } });
  T(lanjut(6010, 'K')); T(lanjut(6020, 'J'));
  T({ baris: 6030, jalan: function (m) { m.kembali(); } });

  /* --- 6040-6430: kartu skor dan bunyi --------------------------------- */
  T(rem(6040));
  T({ baris: 6050, jalan: function (m) {
      var ke = [6060, 6150, 6220, 6280, 6330, 6370][m.v.DD - 1];
      if (ke) m.lompat(ke);
    } });
  T(rem(6060));
  T({ baris: 6070, jalan: function (m) {
      var ke = [6080, 6090, 6100, 6110, 6120, 6130, 6140][m.v.HAC - 1];
      if (ke) m.lompat(ke);
    } });
  [[6080,4,56],[6090,4,61],[6100,4,66],[6110,4,71],[6120,4,76],
   [6130,2,56],[6140,6,56]].forEach(function (a) { T(catat(a[0], a[1], a[2])); });
  T(rem(6150));
  T({ baris: 6160, jalan: function (m) {
      var ke = [6170, 6180, 6190, 6200, 6210][m.v.HB - 1];
      if (ke) m.lompat(ke);
    } });
  [[6170,10,56],[6180,10,61],[6190,10,66],[6200,10,71],[6210,10,76]]
    .forEach(function (a) { T(catat(a[0], a[1], a[2])); });
  T(rem(6220));
  T({ baris: 6230, jalan: function (m) {
      var ke = [6240, 6250, 6260, 6270][m.v.HC - 1];
      if (ke) m.lompat(ke);
    } });
  [[6240,14,56],[6250,14,61],[6260,14,66],[6270,14,71]]
    .forEach(function (a) { T(catat(a[0], a[1], a[2])); });
  T(rem(6280));
  T({ baris: 6290, jalan: function (m) {
      var ke = [6300, 6310, 6320][m.v.HD - 1];
      if (ke) m.lompat(ke);
    } });
  [[6300,18,56],[6310,18,61],[6320,18,66]]
    .forEach(function (a) { T(catat(a[0], a[1], a[2])); });
  T(rem(6330));
  T({ baris: 6340, jalan: function (m) {
      var ke = [6350, 6360][m.v.HS - 1];
      if (ke) m.lompat(ke);
    } });
  T(catat(6350, 22, 56)); T(catat(6360, 22, 61));
  T(rem(6370));
  T({ baris: 6380, jalan: function (m) {
      m.locate(22, 71); m.cetak(bas(m.v.TURN)); m.barisBaru();
    } });
  T({ baris: 6390, jalan: function (m) { m.kembali(); } });
  T({ baris: 6400, jalan: function () { /* PLAY: terompet serbu */ } });
  T({ baris: 6410, jalan: function (m) { m.kembali(); } });
  T({ baris: 6420, jalan: function () { /* PLAY: terompet berkabung */ } });
  T({ baris: 6430, jalan: function (m) { m.kembali(); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  /* --- pembantu -------------------------------------------------------- */
  function sTembak(m) {
    return (m.v['S$()'][m.v.TURN] || [])[m.v.J] || '';
  }
  function ya(n, h, ke) {
    return { baris: n, jalan: function (m) {
      if ((m.v['ANS$'] || '').charAt(0) === h) m.lompat(ke);
    } };
  }
  function keluar(n, h) {
    return { baris: n, jalan: function (m) {
      if ((m.v['ANS$'] || '').charAt(0) === h) m.jalankan('MENU');
    } };
  }
  function nilai(m, x) { return typeof x === 'function' ? x(m) : x; }
  function gelung(n, v, a, b, l, lewat) {
    return { baris: n, jalan: function (m) {
      m.untuk(v, nilai(m, a), nilai(m, b), l, lewat);
    } };
  }
  function lanjut(n, v) {
    return { baris: n, jalan: function (m) { m.lanjutkan(v); } };
  }
  function taruh(n) {
    return { baris: n, jalan: function (m) { m.locate(m.v.I, m.v.J); } };
  }
  function taruhJI(n) {
    return { baris: n, jalan: function (m) { m.locate(m.v.J, m.v.I); } };
  }
  function blok(n, kode) {
    return { baris: n, jalan: function (m) {
      m.cetak(m.chr(kode)); m.barisBaru();
    } };
  }
  function tolak(n, uji, ke) {
    return { baris: n, jalan: function (m) { if (uji(m)) m.lompat(ke); } };
  }
  function salib(n, e, larik, isi) {
    return { baris: n, jalan: function (m) {
      if (m.v.E === e) {
        m.v[larik][6] = isi(m); m.v[larik][7] = isi(m);
      }
    } };
  }
  function kabar(n1, n2, n3, teks, nWarna) {
    T({ baris: n1, jalan: function (m) { m.warna(28, 0); } });
    if (nWarna) T({ baris: nWarna, jalan: function (m) { m.locate(23, 1); } });
    T({ baris: n2, jalan: function (m) {
        if (!nWarna) m.locate(23, 1);
        m.cetak(teks); m.barisBaru();
      } });
    return { baris: n3, jalan: function (m) { m.warna(7, 0); } };
  }
  /* Satu blok arah kapal: REM, FOR, isi, NEXT, deret koordinat, GOTO. */
  function arah(nRem, nFor, nIsi, nNext, nDeret, nGoto,
                a, b, larikTetap, sumberTetap, larikGerak, sumberGerak,
                langkah, jml, tujuan) {
    T(rem(nRem));
    T(gelung(nFor, 'I', a, b, 1, nNext + 1));
    T({ baris: nIsi, jalan: function (m) {
        m.v[larikTetap][m.v.I] = m.v[sumberTetap];
      } });
    T(lanjut(nNext, 'I'));
    T({ baris: nDeret, jalan: function (m) {
        for (var i = 0; i < jml; i++) {
          m.v[larikGerak][a + i] = m.v[sumberGerak] + langkah * i;
        }
      } });
    if (nGoto !== null) {
      T({ baris: nGoto, jalan: function (m) { m.lompat(tujuan); } });
    }
  }
  function isiSama(n1, n2, n3, a, b, larik, isi) {
    T(gelung(n1, 'I', a, b, 1, n3 + 1));
    T({ baris: n2, jalan: function (m) { m.v[larik][m.v.I] = isi(m); } });
    return lanjut(n3, 'I');
  }
  function dua(n, larik, a, b, isi) {
    return { baris: n, jalan: function (m) {
      var d = isi(m); m.v[larik][a] = d[0]; m.v[larik][b] = d[1];
    } };
  }
  function periksa(n1, n2, n3, n4, n5, jml, ulang) {
    T({ baris: n1, jalan: function (m) { m.v.ZZZZ = jml; } });
    T({ baris: n2, jalan: function (m) { m.gosub(5290); } });
    T({ baris: n3, jalan: function (m) {
        if (m.v.FLIP === 1) m.lompat(ulang);
      } });
    T({ baris: n4, jalan: function (m) { m.v.ZZZ = m.v.ZZZ + m.v.ZZZZ; } });
    return { baris: n5, jalan: function (m) { m.gosub(5090); } };
  }
  function larang(n, ofs, dx, dy) {
    return { baris: n, jalan: function (m) {
      m.v['XED()'][m.v.J + ofs] = m.v['X()'][m.v.I] + dx;
      m.v['YED()'][m.v.J + ofs] = m.v['Y()'][m.v.I] + dy;
    } };
  }
  function huruf(n, h, nilaiY) {
    return { baris: n, jalan: function (m) {
      if (m.v['YY$()'][m.v.TURN][m.v.J] === h) {
        m.v['YY()'][m.v.TURN][m.v.J] = nilaiY; m.lompat(5700);
      }
    } };
  }
  function kena(n, uji, cacah, dd) {
    return { baris: n, jalan: function (m) {
      if (m.v.FLIP === 1 && uji(m)) {
        m.v[cacah] = (m.v[cacah] || 0) + 1; m.v.DD = dd;
      }
    } };
  }
  function catat(n, baris, kolom) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(bas(m.v.TURN)); m.barisBaru();
      m.kembali();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BATSHIP'] = {
    nama: 'BATSHIP',
    judul: 'Battleship (G.S. Alberts, IBM Burlington, 27 Juli 1982)',
    sumber: 'BATSHIP',
    berkas: 'run/BATSHIP.BAS',
    tabel: tabel,
    benih: 107,

    arsitektur: {
      judul: 'Alur BATSHIP.BAS',
      simpul: [
        { id: 'siap', baris: '1100-1240', jenis: 'mulai',
          teks: ['Larik disiapkan;', 'benih diaduk dari jam'] },
        { id: 'papan', baris: '1700-2840', jenis: 'subrutin',
          teks: ['Petak 10x10 dan kartu skor', 'dari aksara blok'] },
        { id: 'sembunyi', baris: '2850-5080',
          teks: ['Enam kapal, arah acak,', 'ditolak sampai muat'] },
        { id: 'terlarang', baris: '5090-5210', jenis: 'subrutin',
          teks: ['Tiap petak kapal melahirkan', 'SEMBILAN petak terlarang'] },
        { id: 'uji', baris: '5290-5350', jenis: 'subrutin',
          teks: ['Kapal baru dibandingkan', 'ke seluruh daftar itu'] },
        { id: 'tembak', baris: '5360-5860', jenis: 'putusan',
          teks: ['Tiga tembakan per giliran;', 'format A1 sampai J9'] },
        { id: 'hitung', baris: '5900-6030',
          teks: ['Tiap tembakan diadu ke', '22 petak kapal'] },
        { id: 'skor', baris: '6050-6390',
          teks: ['Nomor giliran ditulis di', 'kartu skor kapalnya'] },
        { id: 'akhir', baris: '1650-1690', jenis: 'keluar',
          teks: ['22 kena = selesai'] }
      ],
      panah: [
        { dari: 'siap', ke: 'papan' },
        { dari: 'papan', ke: 'sembunyi' },
        { dari: 'sembunyi', ke: 'terlarang' },
        { dari: 'terlarang', ke: 'uji' },
        { dari: 'uji', ke: 'sembunyi', label: 'bersentuhan, ulangi' },
        { dari: 'sembunyi', ke: 'tembak', label: 'enam kapal siap' },
        { dari: 'tembak', ke: 'hitung' },
        { dari: 'hitung', ke: 'skor', label: 'kena' },
        { dari: 'skor', ke: 'tembak', label: 'giliran berikutnya' },
        { dari: 'hitung', ke: 'akhir', label: '22 petak kena' }
      ]
    },

    pseudokode: [
      { baris: 5100, tingkat: 0, teks: 'tiap petak kapal melahirkan <b>sembilan</b> entri terlarang: dirinya dan delapan tetangganya' },
      { baris: 5300, tingkat: 1, teks: 'kapal berikutnya dibandingkan ke <b>seluruh daftar</b> &mdash; pengujiannya cuma pencarian' },
      { baris: 1110, tingkat: 1, teks: '22 petak &times; 9 = 198 entri; lariknya di-DIM <b>lima ratus</b>' },
      { baris: 3050, tingkat: 0, teks: '<code>ON Z GOTO</code> tiga sasaran untuk <b>empat</b> nilai &mdash; <code>Z=0</code> sengaja jatuh' },
      { baris: 2910, tingkat: 0, teks: '<code>E</code> memilih <b>ujung mana</b> kapal induk yang bersalib' },
      { baris: 5230, tingkat: 0, teks: 'lima baris <b>penguji</b> yang dikirim dalam keadaan dimatikan dengan REM' },
      { baris: 1120, tingkat: 1, teks: '&hellip;dan <code>A(500)</code>, <code>B(500)</code> ada <b>hanya untuk kelimanya</b>' },
      { baris: 5780, tingkat: 0, teks: 'tembakan berulang diperiksa dengan banding <b>string mentah</b>: "A1" &ne; "a1"' },
      { baris: 1400, tingkat: 0, teks: 'petunjuknya <b>mengakui</b> bahwa kartu skor tidak menandai bagian yang kena' },
      { baris: 1660, tingkat: 0, teks: 'pesan kemenangan bilang "SHOTS" padahal <code>TURN</code> menghitung <b>giliran</b>' }
    ],

    perintahAsli: 'run\\BATSHIP.bat',
    catatanAsli: 'Ketik koordinat seperti A1, C8, atau G2 — satu huruf dan ' +
      'satu angka. Tiga tembakan tiap giliran, dan enam kapal harus ' +
      'ditenggelamkan seluruhnya (22 petak).',

    penyimpangan: [
      '<b><code>SOUND</code> dan <code>PLAY</code> diam.</b> Baris 5820 ' +
      'menyapu 2000 sampai 80 Hz tiap tembakan; 6400 dan 6420 memainkan ' +
      'terompet serbu dan terompet berkabung.',

      '<b><code>RANDOMIZE</code> memasang benih tetap.</b> Baris 1170-1200 ' +
      'tetap ditelusuri supaya terlihat bagaimana benihnya diaduk dari jam ' +
      '&mdash; termasuk lipatan <code>H=8-H</code> yang menghasilkan bilangan ' +
      'negatif.',

      '<b><code>CHAIN "MENU",1000</code> (baris 1540-1550) dan ' +
      '<code>LOAD "MENU",R</code> (baris 1690) sama-sama diperlakukan sebagai ' +
      '<code>RUN "MENU"</code>.</b> Dua cara berbeda meninggalkan program ' +
      'yang sama, di berkas yang sama.',

      '<b>Baris 1040 dan 1050 sudah disunting pemilik koleksi</b> &mdash; ' +
      'alamat rumah dan nomor telepon dalam kantor IBM Burlington.'
    ],

    pelajaran: {
      ringkas: 'Aturan "kapal tidak boleh bersentuhan" diwujudkan dengan ' +
        'membuat daftar setiap petak terlarang lebih dulu &mdash; dan lima ' +
        'baris pengujinya dikirim bersama programnya, dimatikan dengan REM.',
      pelajari: [
        ['Aturan yang diwujudkan, bukan dihitung',
         'Aturan permainannya: kapal tidak boleh bersentuhan, bahkan di ' +
         'sudutnya. Cara yang wajar mengujinya: untuk tiap petak kapal baru, ' +
         'periksa apakah salah satu dari delapan tetangganya sudah dipakai.',
         'Program ini membalik arahnya. Begitu sebuah kapal ditempatkan, baris ' +
         '5100-5210 <b>menuliskan</b> sembilan petak terlarang untuk tiap ' +
         'petaknya &mdash; dirinya sendiri dan kedelapan tetangganya &mdash; ' +
         'ke dalam <code>XED()</code> dan <code>YED()</code>.',
         'Pengujian kapal berikutnya (5290-5350) lalu tidak menghitung apa ' +
         'pun. Ia cuma bertanya: apakah petak ini ada di daftar?',
         'Daftarnya penuh pengulangan &mdash; petak yang bertetangga dengan ' +
         'dua bagian kapal tercatat dua kali. Itu tidak apa-apa, karena ' +
         'pencariannya cuma perlu tahu "ada atau tidak". Ruang ditukar dengan ' +
         'kesederhanaan, dan yang ditukarkan cuma 198 pasang angka.'],
        ['Nol yang sengaja tidak melompat',
         '<code>3050 ON Z GOTO 3130,3200,3270</code> &mdash; tiga sasaran, ' +
         'padahal <code>Z</code> bernilai 0 sampai 3.',
         'Di BASIC, <code>ON 0 GOTO</code> tidak melompat ke mana-mana; ia ' +
         'jatuh ke baris berikutnya. Jadi arah ke-0 adalah baris di bawahnya, ' +
         'dan tiga arah lain jadi sasaran daftar. <b>Empat cabang dari tiga ' +
         'alamat</b>, dan pola yang sama dipakai empat kali di berkas ini.'],
        ['Penguji yang ikut dikirim, dimatikan',
         'Baris 5220 berbunyi: <i>"DELETE REM FROM THE NEXT 5 LINES FOR DEBUG ' +
         '- CHECK THE PLACEMENT OF THE SHIPS IS CORRECTLY DONE"</i>.',
         'Kelima baris di bawahnya menggambar huruf X di setiap petak ' +
         'terlarang. Membuang lima <code>REM</code> mengubah program permainan ' +
         'jadi alat pemeriksa aturannya sendiri.',
         'Itu cara membangun yang layak ditiru: alat penguji <b>tinggal di ' +
         'dalam</b> yang diujinya, dan menyalakannya cuma butuh sebuah ' +
         'penyunting teks.'],
        ['Satu kapal yang bukan garis lurus',
         'Kapal induk memakai tujuh petak: lima berjajar, dan dua tegak lurus ' +
         'di salah satu ujungnya. Variabel <code>E</code> memilih ujung yang ' +
         'mana.',
         'Itu sebabnya penolakannya paling banyak &mdash; dua belas baris ' +
         '(2930-3040), enam untuk memastikan badannya muat dan enam lagi ' +
         'untuk salibnya. Kapal lain cukup empat.'],
        ['Rentang indeks sebagai identitas kapal',
         '<code>X(1..7)</code> kapal induk, <code>X(8..12)</code> kapal ' +
         'perang, dan seterusnya sampai <code>X(22)</code> kapal PT. Tidak ada ' +
         'larik "kapal ini milik siapa" &mdash; yang menentukan cuma ' +
         '<b>di mana indeksnya jatuh</b>.',
         'Baris 5940-5990 membaca itu kembali dengan enam perbandingan ' +
         'rentang. Dua puluh dua petak, enam kapal, dan satu larik datar.']
      ],
      hindari: [
        ['Seribu unsur larik untuk kode yang dimatikan',
         'Baris 1120: <code>DIM A(500),B(500)</code>. Kedua larik itu dipakai ' +
         '<b>hanya</b> di baris 5240-5260 &mdash; yang seluruhnya ' +
         '<code>REM</code>.',
         'Di mesin 64K, dua larik lima ratus unsur presisi tunggal memakan ' +
         'empat ribu bita. Empat ribu bita yang disediakan untuk lima baris ' +
         'yang tidak pernah dijalankan siapa pun.',
         'Menyimpan penguji di dalam program itu ide bagus. Menyimpan ' +
         '<code>DIM</code>-nya di luar bagian yang dikomentari bukan.'],
        ['Sepuluh huruf, dua puluh baris',
         'Baris 5470-5660 menerjemahkan huruf baris jadi angka. Besar dan ' +
         'kecil ditulis <b>terpisah</b>: <code>IF YY$="A" THEN 0</code>, lalu ' +
         '<code>IF YY$="a" THEN 0</code>, dua puluh kali.',
         'Satu baris pengubah huruf &mdash; seperti yang dipakai ELIZA.BAS di ' +
         'koleksi yang sama, <code>CHR$(ASC(x) OR &amp;H20)</code> &mdash; akan ' +
         'menghapus separuhnya.'],
        ['Dan akibatnya: tembakan yang sama bisa dipakai dua kali',
         'Baris 5780 memeriksa pengulangan dengan membandingkan ' +
         '<b>string mentah</b>: <code>IF S$(TURN,J)=S$(K,L) THEN FLIP=1</code>.',
         'Karena hurufnya tidak pernah diseragamkan, <code>"A1"</code> dan ' +
         '<code>"a1"</code> adalah dua string yang berbeda &mdash; padahal ' +
         'baris 5470 dan 5480 sudah menerjemahkan keduanya ke petak yang sama.',
         'Terukur di penelusur: menembak <code>A1</code> lalu <code>a1</code> ' +
         'menghasilkan dua petak yang <b>sama persis</b> (1,0), penjaga ' +
         'ulangan di baris 5810 tidak berbunyi, dan permainan langsung ' +
         'meminta tembakan ketiga. Satu tembakan habis tanpa peringatan.'],
        ['Pesan kemenangan yang salah satuan',
         'Baris 1660: <i>"SO YOU FINALLY DID IT IN ";TURN;"SHOTS"</i>. Tapi ' +
         '<code>TURN</code> menghitung <b>giliran</b>, dan tiap giliran berisi ' +
         'tiga tembakan.',
         'Pemain yang menang dalam 12 giliran diberitahu "12 shots" &mdash; ' +
         'padahal ia menembak 36 kali.'],
        ['Kartu skor yang mengakui dirinya kira-kira',
         'Baris 1400-1420 di bagian petunjuk: <i>"HOWEVER THE PLACE WHERE THE ' +
         'SHOT IS RECORDED ON THE SCORECARD WILL NOT NECESSARILY BE THE PART ' +
         'OF THE SHIP HIT."</i>',
         'Sebabnya ada di baris 6070: <code>ON HAC GOTO ...</code> memakai ' +
         '<b>jumlah</b> kena, bukan petak mana yang kena. Kena pertama selalu ' +
         'ditandai di kotak pertama, apa pun bagian kapal yang sebenarnya ' +
         'tertembak.',
         'Yang menarik bukan cacatnya &mdash; melainkan bahwa penulisnya ' +
         'memilih <b>menuliskannya di petunjuk</b> alih-alih memperbaikinya. ' +
         'Sebuah keterbatasan yang didokumentasikan adalah keterbatasan, ' +
         'bukan cacat.'],
        ['Dua cara meninggalkan satu program',
         'Baris 1540-1550 memakai <code>CHAIN "MENU",1000</code>; baris 1690 ' +
         'memakai <code>LOAD "MENU",R</code>. Keduanya menuju berkas yang ' +
         'sama, dengan dua perintah yang berbeda perilakunya soal variabel ' +
         'bersama &mdash; dan tidak ada alasan yang terlihat kenapa.'],
        ['Salah eja yang tidak ada yang memperbaiki',
         '<code>CRUSIER</code> (baris 3960 dan 4080), <code>IS IS USED</code> ' +
         '(1410), <code>AND EASY JOB</code> untuk "an easy job" (4940), dan ' +
         '<code>P.T BOAT</code> yang kehilangan satu titik (4970).']
      ]
    },

    penjelasan: [
      { judul: 'Membuat yang terlarang, bukan menghitungnya',
        isi: [
          'Aturan Kapal Perang versi ini lebih ketat daripada versi papan ' +
          'biasa: kapal tidak boleh <b>bersentuhan</b>, bahkan di sudut. ' +
          'Baris 1260-1270 mengatakannya di depan.',
          'Cara yang wajar memeriksanya: untuk tiap petak kapal baru, ' +
          'bandingkan dengan setiap petak kapal lama, dan hitung apakah ' +
          'jaraknya kurang dari dua di kedua sumbu. Itu perhitungan ' +
          'ketetanggaan, dikerjakan saat menguji.',
          'Program ini melakukan yang sebaliknya. Begitu sebuah kapal ' +
          'ditempatkan, ia <b>menuliskan seluruh larangannya</b>:',
          '<code>5110 J=(((I-1)*9)+1)</code><br>' +
          '<code>5120 XED(J)=X(I):YED(J)=Y(I)+1</code><br>' +
          '<code>5130 XED(J+1)=X(I):YED(J+1)=Y(I)-1</code><br>' +
          '<code>&hellip;</code><br>' +
          '<code>5200 XED(J+8)=X(I):YED(J+8)=Y(I)</code>',
          'Sembilan entri per petak kapal: delapan tetangganya, dan dirinya ' +
          'sendiri. Sesudah keenam kapal, daftarnya berisi 198 pasang ' +
          'koordinat.',
          'Dan pengujiannya (5290-5350) jadi sesederhana mungkin:',
          '<code>5320 IF X(J)=XED(I) AND Y(J)=YED(I) THEN FLIP=1</code>',
          'Tidak ada pengurangan, tidak ada nilai mutlak, tidak ada ' +
          'perbandingan jarak. Cuma "apakah pasangan ini ada di daftar".',
          'Daftarnya boros. Sebuah petak yang bertetangga dengan dua bagian ' +
          'kapal yang sama akan tercatat dua kali; petak yang di dalam badan ' +
          'kapal tercatat berkali-kali. Tidak ada usaha membuang duplikat.',
          'Dan justru itu yang membuatnya bekerja. Membuang duplikat berarti ' +
          'mencari dulu sebelum menyisipkan &mdash; pekerjaan yang lebih besar ' +
          'daripada yang dihematnya. Larik lima ratus unsur di mesin 64K ' +
          'adalah harga yang murah untuk sebuah pengujian yang tidak bisa ' +
          'salah hitung.',
          'Ini pola yang sama dengan tabel pencarian melawan rumus: yang satu ' +
          'menghabiskan ruang supaya tidak perlu berpikir, yang lain berpikir ' +
          'supaya tidak perlu ruang. Di sini pilihannya jatuh ke ruang, dan ' +
          'alasannya terbaca dari kodenya sendiri.'
        ] },
      { judul: 'Lima baris yang dikirim dalam keadaan mati',
        isi: [
          'Di tengah subrutin pembuat daftar terlarang, ada catatan ini:',
          '<code>5220 REM DELETE REM FROM THE NEXT 5 LINES FOR DEBUG - CHECK ' +
          'THE PLACEMENT OF THE SHIPS IS CORRECTLY DONE WITHOUT TOUCHING OR ' +
          'OVERLAP</code>',
          'Dan kelima barisnya:',
          '<code>5230 REM FOR I=1 TO 9*ZZZ</code><br>' +
          '<code>5240 REM A(I)=((YED(I)*2)+3):B(I)=((XED(I)*5)+6)</code><br>' +
          '<code>5250 REM LOCATE A(I),B(I)</code><br>' +
          '<code>5260 REM PRINT "X"</code><br>' +
          '<code>5270 REM NEXT</code>',
          'Membuang lima kata <code>REM</code> mengubah permainan ini jadi ' +
          '<b>alat pemeriksa aturannya sendiri</b>: setiap petak terlarang ' +
          'digambar dengan huruf X di papan, dan siapa pun bisa melihat ' +
          'apakah kapalnya benar-benar tidak bersentuhan.',
          'Ini bentuk paling awal dari sesuatu yang sekarang kita sebut ' +
          '<i>debug flag</i> atau <i>feature toggle</i> &mdash; dan ' +
          'mekanismenya cuma sebuah penyunting teks.',
          'Yang membuatnya lebih baik daripada sekadar membuang kodenya: ' +
          'pemeriksanya <b>ikut dikirim</b>. Siapa pun yang menerima disket ' +
          'ini, sepuluh atau empat puluh tahun kemudian, bisa menyalakannya ' +
          'tanpa menulis apa pun.',
          'Dan yang membuatnya lebih buruk daripada seharusnya ada di baris ' +
          '1120:',
          '<code>1120 DIM A(500),B(500)</code>',
          'Kedua larik itu <b>tidak dipakai di mana pun</b> selain lima baris ' +
          'yang mati itu. Tapi <code>DIM</code>-nya ada di luar, hidup, dan ' +
          'dijalankan setiap kali program dimulai.',
          'Di mesin 64K, seribu unsur presisi tunggal adalah empat ribu bita ' +
          '&mdash; enam persen dari seluruh ruang kerja &mdash; disediakan ' +
          'untuk kode yang tidak pernah berjalan.',
          'Penguji yang tinggal di dalam kodenya adalah ide bagus. Biayanya ' +
          'yang tinggal di luar saklarnya bukan.'
        ] }
    ]
  };
})(window);
