/* ===========================================================================
   MAZE.js — porting minimalis MAZE.BAS sebagai tabel baris.

   Program ketujuh belas: labirin orang-pertama. Anda berdiri DI DALAM labirin
   8x8 dan hanya bisa melihat empat langkah ke depan.

   Dan seluruh gambar tiga dimensinya dibuat dari TIGA aksara saja:

       219  balok penuh
       220  balok bawah   (setengah bawah sel terisi)
       223  balok atas    (setengah atas sel terisi)

   Tidak ada mode grafik. Tidak ada garis. Yang ada cuma layar teks 80x25 dan
   sekitar tiga ratus `POKE` ke alamat yang sudah dihitung sebelumnya.

   Cara kerjanya (baris 450-570):

       ULANG lima kali (L = 0 sampai 4):
         gambar dinding pada JARAK L menurut peta dinding sel ini
         kalau ada dinding di depan, berhenti
         maju satu sel

   Tiap nilai L punya rombongan subrutinnya sendiri, dan tiap subrutin memuat
   alamat-alamat yang sudah dihitung tangan untuk jarak itu. Perspektif yang
   dipahat, bukan dihitung.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Larik dan skalar bernama sama dipisahkan: `A(7,7)` jadi `A_`, `L()` jadi
     `L_`, `B()` jadi `B_`, `Z1()` jadi `Z1_`. Keempatnya punya kembaran
     skalar di program ini.
   - `PEEK`/`DEF SEG` tidak berarti apa-apa; alamat poke selalu dihitung
     relatif terhadap awal RAM layar penelusur.
   - `SOUND` tidak berbunyi, jadi menabrak dinding tidak terdengar — cuma
     terlihat sebagai delapan langkah yang tidak mengubah apa pun.
   - Pengacaknya berbenih tetap, jadi labirin dan titik mulainya selalu sama.
   =========================================================================== */

(function (global) {
  'use strict';

  var PENUH = 219, BAWAH = 220, ATAS = 223, KISI = 176, GARIS = 205;

  var tabel = [

    { baris: 10, jalan: function (m) { m.warna(3, 0); } },
    /* 20 45056 = &HB000 (monokrom), 47104 = &HB800 (warna). Penelusur selalu
       warna, dan alamat pokenya relatif terhadap awal RAM layar. */
    { baris: 20, jalan: function () { } },
    /* 30 hanya `A(7,7)` yang di-DIM. `B()`, `L()`, dan `Z1()` dibuat BASIC
       sendiri dengan batas 10 begitu disentuh — dan batas 10 itu yang
       menyelamatkan baris 470, yang menulis sampai `L(7)`. */
    { baris: 30, jalan: function (m) {
        m.cls();
        m.dim('A_', 7, 7);
        m.dim('B_', 10); m.dim('L_', 10); m.dim('Z1_$', 10);
        m.v.Z1_ = m.v['Z1_$'];
      } },
    { baris: 40, jalan: function (m) { m.gosub(2790); } },
    trap(50, 1), trap(60, 2), trap(70, 3), trap(80, 4), trap(90, 5),
    trap(100, 6), trap(110, 7), trap(120, 8), trap(130, 9),
    { baris: 140, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) m.jebakan(m.v.A, true);
      } },
    { baris: 150, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 640);
      } },
    { baris: 160, jalan: function (m) { m.gosub(2330); } },
    /* 170 B_(0..3) titik mulai dan pintu keluar, B_(4) arah hadap.
       X,Y = petak yang sedang DICOBA; S,T = petak yang sudah pasti. */
    { baris: 170, jalan: function (m) {
        m.v.X = m.v.B_[0]; m.v.Y = m.v.B_[1];
        m.v.L = 0; m.v.DIR = m.v.B_[4];
      } },
    { baris: 180, bagian: [
        function (m) {
          m.v.S = m.v.X; m.v.T = m.v.Y;
          m.warna(2, 0); m.cls();
        },
        function (m) { m.gosub(450); },
        function (m) { m.v.X = m.v.S; m.v.Y = m.v.T; }
      ] },
    /* 190 dan 200 baris yang persis sama. Yang dipakai cuma 200 — baris 440
       melompat ke sana tiap giliran. Baris 190 jalan sekali, lalu tak pernah
       lagi. */
    petunjuk(190), petunjuk(200),
    { baris: 210, jalan: function (m) {
        m.warna(0, 7); m.locate(25, 24, 0);
        m.cetak(' Strike <F10> Key To Leave This Game '); m.warna(3, 0);
      } },
    { baris: 220, jalan: function (m) { m.v.L = 0; } },
    { baris: 230, jalan: function (m) {
        m.locate(8, 38); m.cetak(m.v.Z1_[m.v.DIR]); m.barisBaru();
      } },
    { baris: 240, jalan: function (m) { if (m.inkey() !== '') m.lompat(240); } },
    { baris: 250, jalan: function (m) {
        m.v.Z = m.inkey(); m.v.Z1 = m.v.Z.substr(1, 1);
      } },
    { baris: 260, jalan: function (m) {
        if (m.v.Z1 === m.chr(72) || m.v.Z === '8') { m.v.M = (m.v.M || 0) + 1; m.lompat(340); }
      } },
    { baris: 270, jalan: function (m) {
        if (m.v.Z1 === m.chr(80) || m.v.Z === '2') { m.v.DIR += 2; m.lompat(310); }
      } },
    { baris: 280, jalan: function (m) {
        if (m.v.Z1 === m.chr(75) || m.v.Z === '4') { m.v.DIR -= 1; m.lompat(310); }
      } },
    { baris: 290, jalan: function (m) {
        if (m.v.Z1 === m.chr(77) || m.v.Z === '6') { m.v.DIR += 1; m.lompat(310); }
      } },
    { baris: 300, jalan: function (m) { m.lompat(250); } },
    { baris: 310, jalan: function (m) { if (m.v.DIR > 4) m.v.DIR -= 4; } },
    { baris: 320, jalan: function (m) { if (m.v.DIR < 1) m.v.DIR += 4; } },
    { baris: 330, jalan: function (m) { m.lompat(430); } },
    { baris: 340, jalan: function (m) { if (m.v.DIR === 1) m.v.X -= 1; } },
    { baris: 350, jalan: function (m) { if (m.v.DIR === 2) m.v.Y += 1; } },
    { baris: 360, jalan: function (m) { if (m.v.DIR === 3) m.v.X += 1; } },
    { baris: 370, jalan: function (m) { if (m.v.DIR === 4) m.v.Y -= 1; } },
    { baris: 380, jalan: function (m) {
        if (m.v.X === m.v.B_[2] && m.v.Y === m.v.B_[3]) m.lompat(580);
      } },
    { baris: 390, jalan: function (m) { m.v.D = m.v.A_[m.v.S][m.v.T]; } },
    { baris: 400, jalan: function (m) {
        var D = m.v.D;
        m.v.L_[1] = D & 8; m.v.L_[2] = D & 4;
        m.v.L_[3] = D & 2; m.v.L_[4] = D & 1;
      } },
    /* 410 menabrak dinding: delapan bunyi, dan gelungnya memakai X — yaitu
       KOORDINAT PEMAIN. Aman cuma karena baris 440 mengembalikannya dari S.
       Satu langkah lupa dan pemainnya terlempar ke petak kedelapan. */
    { baris: 410, jalan: function (m) {
        if (m.v.L_[m.v.DIR]) {
          for (m.v.X = 1; m.v.X <= 8; m.v.X++) {
            m.suara(300, 1); m.suara(32767, 1); m.suara(50, 1);
          }
          m.lompat(440);
        }
      } },
    { baris: 420, jalan: function (m) { m.v.S = m.v.X; m.v.T = m.v.Y; } },
    { baris: 430, bagian: [
        function (m) { m.warna(2, 0); m.cls(); },
        function (m) { m.gosub(450); }
      ] },
    { baris: 440, jalan: function (m) {
        m.v.X = m.v.S; m.v.Y = m.v.T; m.lompat(200);
      } },

    /* --- 450-570: menggambar pemandangan ----------------------------------
       Inilah inti programnya. Berjalan maju dari petak pemain, paling jauh
       lima petak, dan tiap petak menggambar dindingnya pada jarak itu. */
    { baris: 450, jalan: function (m) { m.v.D = m.v.A_[m.v.X][m.v.Y]; } },
    { baris: 460, jalan: function (m) {
        var D = m.v.D;
        m.v.L_[1] = D & 8; m.v.L_[2] = D & 4;
        m.v.L_[3] = D & 2; m.v.L_[4] = D & 1;
      } },
    /* 470 tiga salinan tambahan, dan inilah triknya: dinding kiri adalah
       `L(DIR+3)` dan dinding kanan `L(DIR+1)`. Dengan DIR sampai 4, indeks
       itu bisa mencapai 7 — dan larik yang diperpanjang tiga membuat
       pembungkusannya gratis. TIDAK ADA satu pun MOD di seluruh program. */
    { baris: 470, jalan: function (m) {
        var D = m.v.D;
        m.v.L_[5] = D & 8; m.v.L_[6] = D & 4; m.v.L_[7] = D & 2;
      } },
    /* 480 dan 490 dua rombongan subrutin, satu per tingkat kedalaman:
       yang pertama menggambar pemisah tegak, yang kedua dindingnya. */
    { baris: 480, jalan: function (m) {
        m.gosub([940, 960, 1020, 1060, 1100][m.v.L]);
      } },
    { baris: 490, jalan: function (m) {
        m.gosub([690, 740, 790, 840, 890][m.v.L]);
      } },
    { baris: 500, jalan: function (m) { if (m.v.L_[m.v.DIR]) m.kembali(); } },
    { baris: 510, jalan: function (m) {
        m.v.L = m.v.L + 1;
        if (m.v.L > 4) m.kembali();
      } },
    { baris: 520, jalan: function (m) { if (m.v.DIR === 1) m.v.X -= 1; } },
    { baris: 530, jalan: function (m) { if (m.v.DIR === 2) m.v.Y += 1; } },
    { baris: 540, jalan: function (m) { if (m.v.DIR === 3) m.v.X += 1; } },
    { baris: 550, jalan: function (m) { if (m.v.DIR === 4) m.v.Y -= 1; } },
    /* 560 pandangan yang keluar dari batas labirin = pintu keluar terlihat.
       GOSUB 3020 menggambar kotak EXIT, lalu GOTO 510 menambah kedalaman
       tanpa membaca peta — karena di luar batas memang tidak ada petak. */
    { baris: 560, bagian: [
        function (m) {
          if (m.v.X > 7 || m.v.Y > 7 || m.v.X < 0 || m.v.Y < 0) m.gosub(3020);
        },
        function (m) {
          if (m.v.X > 7 || m.v.Y > 7 || m.v.X < 0 || m.v.Y < 0) m.lompat(510);
        }
      ] },
    { baris: 570, jalan: function (m) { m.lompat(450); } },

    { baris: 580, jalan: function (m) {
        m.cls(); m.locate(10, 25);
        m.cetak('You Made It !!!!   in' + angka(m.v.M || 0) + 'Moves.');
        m.barisBaru();
      } },
    { baris: 590, jalan: function (m) {
        m.warna(15, null); m.locate(12, 23);
        m.cetak('Would You Like To Try Again? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 600, bagian: [
        function (m) { m.gosub(630); },
        function (m) {
          var z = m.v.Z;
          if (z === 'y' || z === 'Y') m.lompat(620);
          else if (z !== 'N' && z !== 'n') m.lompat(600);
        }
      ] },
    { baris: 610, jalan: function (m) { m.jalankan('MENU'); } },
    /* 620 `RESTORE` mengembalikan penunjuk DATA ke awal, lalu GOTO 140 —
       memilih labirin baru tanpa menjalankan ulang programnya. */
    { baris: 620, jalan: function (m) {
        m.ulangData(); m.cls(); m.lompat(140);
      } },
    { baris: 630, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(630); else m.kembali();
      } },
    { baris: 640, jalan: function (m) {
        m.jebakan(10, false);
        m.locate(25, 1); m.spc(79); m.warna(15, 0);
      } },
    { baris: 650, jalan: function (m) {
        m.locate(25, 24);
        m.cetak('Do You Wish To Leave This Game? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 660, bagian: [
        function (m) { m.gosub(630); },
        function (m) {
          var z = m.v.Z;
          if (z === 'y' || z === 'Y') m.lompat(610);
          else if (z !== 'N' && z !== 'n') m.lompat(660);
        }
      ] },
    { baris: 670, jalan: function (m) { m.locate(25, 1); m.spc(79); } },
    { baris: 680, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },

    /* --- 690-930: lima tingkat kedalaman, tiga pertanyaan yang sama --------
       Perhatikan bentuknya. Kelimanya menanyakan hal yang persis sama:
       ada dinding di depan? di kanan? di kiri? Yang berbeda cuma NOMOR
       SUBRUTIN yang dipanggil — karena tiap jarak punya gambarnya sendiri. */
    rem(690),
    { baris: 700, jalan: function (m) { if (m.v.L_[m.v.DIR]) m.gosub(2180); } },
    { baris: 710, jalan: function (m) {
        if (!m.v.L_[m.v.DIR + 1]) m.gosub(1170);
      } },
    { baris: 720, jalan: function (m) {
        if (!m.v.L_[m.v.DIR + 3]) m.gosub(1140);
      } },
    { baris: 730, jalan: function (m) { m.kembali(); } },
    rem(740),
    tingkat(750, 'depan', 2210),
    tingkat(760, 'kanan', 1730, 2020),
    tingkat(770, 'kiri', 1210, 1860),
    { baris: 780, jalan: function (m) { m.kembali(); } },
    rem(790),
    tingkat(800, 'depan', 2260),
    tingkat(810, 'kanan', 1640, 2070),
    tingkat(820, 'kiri', 1340, 1910),
    { baris: 830, jalan: function (m) { m.kembali(); } },
    rem(840),
    tingkat(850, 'depan', 2300),
    tingkat(860, 'kanan', 1590, 2110),
    tingkat(870, 'kiri', 1430, 1950),
    { baris: 880, jalan: function (m) { m.kembali(); } },
    rem(890),
    tingkat(900, 'depan', 1520),
    tingkat(910, 'kanan', 1550, 2150),
    tingkat(920, 'kiri', 1480, 1990),
    { baris: 930, jalan: function (m) { m.kembali(); } },

    /* --- 940-1130: pemisah tegak di tiap jarak ----------------------------
       Langkah 160 bita = satu baris layar penuh. Jadi tiap gelung ini
       menggambar satu garis tegak, satu sel per baris. */
    deret(940, 14, 3534, 160, PENUH),
    deret(950, 142, 3662, 160, PENUH, true),
    poke(960, [[358, BAWAH]]),
    deret(970, 518, 2438, 160, PENUH),
    poke(980, [[2598, ATAS]]),
    poke(990, [[438, BAWAH]]),
    deret(1000, 598, 2518, 160, PENUH),
    poke(1010, [[2678, ATAS]], true),
    deret(1020, 694, 1814, 160, PENUH),
    poke(1030, [[1974, ATAS]]),
    deret(1040, 742, 1862, 160, PENUH),
    poke(1050, [[2022, ATAS]], true),
    deret(1060, 862, 1662, 160, PENUH),
    poke(1070, [[1662, ATAS]]),
    deret(1080, 894, 1534, 160, PENUH),
    poke(1090, [[1694, ATAS]], true),
    poke(1100, [[868, BAWAH]]),
    deret(1110, 1028, 1348, 160, PENUH),
    poke(1120, [[888, BAWAH]]),
    deret(1130, 1048, 1368, 160, PENUH, true),

    /* 1140-1190 lorong terbuka di kiri/kanan pada jarak nol: dinding atas
       dan bawah, tekstur kisi di tepi layar, lalu tanda panah. */
    { baris: 1140, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 14; m.v.A += 2) {
          m.pokeLayar(m.v.A, PENUH); m.pokeLayar(m.v.A + 3520, PENUH);
        }
      } },
    { baris: 1150, jalan: function (m) {
        m.warna(1, 0);
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1); m.cetak(m.ulang(7, KISI)); m.barisBaru();
        }
        m.warna(3, 0);
      } },
    /* 1160 alamat GANJIL adalah bita ATRIBUT, bukan aksara. `POKE A+1,14`
       mewarnai sel itu kuning terang tanpa menyentuh hurufnya. Satu-satunya
       tempat di koleksi ini yang memoke warna langsung. */
    { baris: 1160, jalan: function (m) {
        m.v.A = 1446;
        m.pokeLayar(1446, 60); m.pokeLayar(1447, 14);
        m.pokeLayar(1448, GARIS); m.pokeLayar(1449, 14);
        m.kembali();
      } },
    { baris: 1170, jalan: function (m) {
        for (m.v.A = 144; m.v.A <= 156; m.v.A += 2) {
          m.pokeLayar(m.v.A, PENUH); m.pokeLayar(m.v.A + 3520, PENUH);
        }
      } },
    { baris: 1180, jalan: function (m) {
        m.warna(1, 0);
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 73); m.cetak(m.ulang(7, KISI)); m.barisBaru();
        }
        m.warna(3, 0);
      } },
    { baris: 1190, jalan: function (m) {
        m.v.A = 1588;
        m.pokeLayar(1588, GARIS); m.pokeLayar(1589, 14);
        m.pokeLayar(1590, 62); m.pokeLayar(1591, 14);
        m.kembali();
      } },

    /* --- 1200-2160: dinding miring, satu rombongan per jarak --------------
       Nama-nama di REM-nya: LW = left wall, RW = right wall, LH = left hole,
       RH = right hole, BW = back wall. Angkanya jaraknya. */
    rem(1200),
    poke(1210, [[16, BAWAH]]),
    setA(1220, 176, [ATAS, PENUH, PENUH, PENUH]),
    lanjutA(1230, 8, [BAWAH, BAWAH, BAWAH]),
    setA(1240, 344, [ATAS, ATAS, ATAS, PENUH]),
    lanjutA(1250, 8, [PENUH, PENUH, BAWAH]),
    poke(1260, [[516, ATAS]]),
    poke(1270, [[2594, BAWAH], [2596, PENUH]]),
    setA(1280, 2750, [BAWAH, PENUH, ATAS]),
    setA(1290, 2906, [BAWAH, PENUH, ATAS]),
    setA(1300, 3062, [BAWAH, PENUH, ATAS]),
    setA(1310, 3218, [BAWAH, PENUH, ATAS]),
    poke(1320, [[3376, PENUH], [3378, ATAS]], true),
    rem(1330),
    poke(1340, [[360, BAWAH]]),
    setA(1350, 520, [ATAS, PENUH, PENUH, PENUH]),
    lanjutA(1360, 8, [BAWAH, BAWAH]),
    setA(1370, 688, [ATAS, ATAS, PENUH]),
    setA(1380, 1970, [BAWAH, PENUH, ATAS]),
    setA(1390, 2126, [BAWAH, PENUH, ATAS]),
    setA(1400, 2282, [BAWAH, PENUH, ATAS]),
    setA(1410, 2440, [PENUH, ATAS], true),
    rem(1420),
    setA(1430, 696, [BAWAH, BAWAH]),
    setA(1440, 856, [ATAS, ATAS, ATAS]),
    setA(1450, 1658, [BAWAH, PENUH]),
    setA(1460, 1816, [PENUH, ATAS], true),
    rem(1470),
    setA(1480, 864, [ATAS, BAWAH]),
    poke(1490, [[1346, BAWAH]]),
    setA(1500, 1504, [PENUH, ATAS], true),
    rem(1510),
    deret(1520, 870, 888, 2, BAWAH),
    deret(1530, 1350, 1366, 2, BAWAH, true),
    rem(1540),
    setA(1550, 890, [BAWAH, ATAS]),
    poke(1560, [[1370, BAWAH]]),
    setA(1570, 1530, [ATAS, PENUH], true),
    rem(1580),
    setA(1590, 738, [BAWAH, BAWAH, PENUH]),
    setA(1600, 896, [ATAS, ATAS, ATAS]),
    setA(1610, 1696, [PENUH, BAWAH]),
    setA(1620, 1858, [ATAS, PENUH], true),
    rem(1630),
    poke(1640, [[436, BAWAH]]),
    setA(1650, 586, [BAWAH, BAWAH, PENUH, PENUH, PENUH]),
    lanjutA(1660, 10, [ATAS]),
    setA(1670, 742, [PENUH, PENUH, ATAS, ATAS]),
    setA(1680, 2024, [PENUH, BAWAH]),
    setA(1690, 2186, [ATAS, PENUH, BAWAH]),
    setA(1700, 2350, [ATAS, PENUH, BAWAH]),
    setA(1710, 2514, [ATAS, PENUH], true),
    rem(1720),
    poke(1730, [[140, BAWAH]]),
    setA(1740, 288, [BAWAH, BAWAH, BAWAH, PENUH]),
    lanjutA(1750, 8, [PENUH, PENUH, ATAS]),
    setA(1760, 440, [BAWAH, PENUH, PENUH, PENUH]),
    lanjutA(1770, 8, [ATAS, ATAS, ATAS]),
    poke(1780, [[600, ATAS]]),
    setA(1790, 2680, [PENUH, BAWAH]),
    setA(1800, 2842, [ATAS, PENUH, BAWAH]),
    setA(1810, 3006, [ATAS, PENUH, BAWAH]),
    setA(1820, 3170, [ATAS, PENUH, BAWAH]),
    setA(1830, 3334, [ATAS, PENUH, BAWAH]),
    setA(1840, 3498, [ATAS, PENUH], true),
    rem(1850),
    deret(1860, 336, 356, 2, BAWAH),
    deret(1870, 496, 516, 2, ATAS),
    deret(1880, 2416, 2436, 2, BAWAH),
    deret(1890, 2576, 2596, 2, ATAS, true),
    rem(1900),
    deret(1910, 680, 694, 2, PENUH),
    deret(1920, 1800, 1812, 2, BAWAH),
    deret(1930, 1960, 1972, 2, ATAS, true),
    rem(1940),
    setA(1950, 856, [PENUH, PENUH, PENUH]),
    setA(1960, 1496, [BAWAH, BAWAH, BAWAH]),
    setA(1970, 1656, [ATAS, ATAS, ATAS], true),
    rem(1980),
    setA(1990, 864, [BAWAH, BAWAH]),
    setA(2000, 1344, [BAWAH, BAWAH], true),
    rem(2010),
    deret(2020, 440, 460, 2, BAWAH),
    deret(2030, 600, 620, 2, ATAS),
    deret(2040, 2520, 2540, 2, BAWAH),
    deret(2050, 2680, 2700, 2, ATAS, true),
    rem(2060),
    deret(2070, 744, 758, 2, PENUH),
    deret(2080, 1864, 1876, 2, BAWAH),
    deret(2090, 2024, 2036, 2, ATAS, true),
    rem(2100),
    setA(2110, 896, [PENUH, PENUH, PENUH]),
    setA(2120, 1536, [BAWAH, BAWAH, BAWAH]),
    setA(2130, 1696, [ATAS, ATAS, ATAS], true),
    rem(2140),
    setA(2150, 890, [BAWAH, BAWAH]),
    setA(2160, 1370, [BAWAH, BAWAH], true),
    /* 2170-2320 dinding buntu di depan, satu untuk tiap jarak. Makin jauh,
       makin sempit dan makin pendek — perspektif yang seluruhnya berupa
       angka alamat. */
    rem(2170),
    deret(2180, 16, 142, 2, PENUH),
    deret(2190, 3536, 3662, 2, PENUH, true),
    rem(2200),
    deret(2210, 360, 436, 2, BAWAH),
    deret(2220, 520, 596, 2, ATAS),
    deret(2230, 2440, 2516, 2, BAWAH),
    deret(2240, 2600, 2676, 2, ATAS, true),
    rem(2250),
    deret(2260, 696, 740, 2, PENUH),
    deret(2270, 1816, 1860, 2, BAWAH),
    deret(2280, 1976, 2020, 2, ATAS, true),
    rem(2290),
    deret(2300, 864, 894, 2, PENUH),
    deret(2310, 1504, 1532, 2, BAWAH),
    deret(2320, 1664, 1692, 2, ATAS, true),

    /* --- 2330-2420: memilih labirin dengan cara membacanya lewat ----------- */
    { baris: 2330, jalan: function (m) { m.semai(detik(m) * 100); } },
    { baris: 2340, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 4; m.v.A++) m.v.Z1_[m.v.A] = m.baca();
      } },
    { baris: 2350, jalan: function (m) { m.semai(m.acak() * 500); } },
    { baris: 2360, jalan: function (m) { m.semai(m.acak() * 500); } },
    /* 2370-2400 caranya memilih satu dari lima labirin: BACA berturut-turut
       sebanyak undiannya, dan yang tersisa di larik adalah yang terakhir
       dibaca. Tidak ada penunjuk, tidak ada indeks — cuma membaca lewat. */
    { baris: 2370, jalan: function (m) {
        m.untuk('C', 1, Math.floor(m.acak() * 5) + 1, 1, 2410);
      } },
    { baris: 2380, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 7; m.v.A++) m.v.B_[m.v.A] = m.baca();
      } },
    { baris: 2390, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 7; m.v.A++) {
          for (m.v.B = 0; m.v.B <= 7; m.v.B++) {
            m.v.A_[m.v.A][m.v.B] = m.baca();
          }
        }
      } },
    { baris: 2400, jalan: function (m) { m.lanjutkan('C'); } },
    /* 2410 setengah peluang memakai titik mulai cadangan — B_(5,6,7).
       Satu labirin, dua permainan. */
    { baris: 2410, jalan: function (m) {
        if (m.acak() < 0.5) {
          m.v.B_[0] = m.v.B_[5]; m.v.B_[1] = m.v.B_[6]; m.v.B_[4] = m.v.B_[7];
        }
      } },
    { baris: 2420, jalan: function (m) { m.kembali(); } },
    data(2430),
    rem(2440), data(2450), data(2460), data(2470), data(2480),
    rem(2490), data(2500), data(2510), data(2520), data(2530),
    rem(2540), data(2550), data(2560), data(2570), data(2580),
    rem(2590), data(2600), data(2610), data(2620), data(2630),
    data(2640), data(2650), data(2660), data(2670), data(2680),
    rem(2690), data(2700), data(2710), data(2720), data(2730),
    data(2740), data(2750), data(2760), data(2770), data(2780),

    /* --- 2790-3000: judul dan petunjuk ------------------------------------ */
    { baris: 2790, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, PENUH)); m.barisBaru();
      } },
    { baris: 2800, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1); m.cetak(m.chr(PENUH)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(PENUH)); m.barisBaru();
        }
      } },
    { baris: 2810, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, PENUH));
      } },
    /* 2820 `COLOR 3,O` — huruf O, bukan angka nol. BASIC memperlakukannya
       sebagai variabel angka yang belum pernah diisi, jadi nilainya 0 dan
       hasilnya kebetulan benar. Salah ketik yang tidak pernah ketahuan. */
    { baris: 2820, jalan: function (m) {
        m.locate(3, 30); m.warna(15, 0);
        m.cetak('K I L L E R    M A Z E');
        m.warna(3, m.v.O || 0);
      } },
    { baris: 2830, jalan: function (m) {
        m.warna(15, null); m.locate(11, 24);
        m.cetak(' Would You Like Instructions? <Y/N> '); m.warna(3, 0);
      } },
    { baris: 2840, bagian: [
        function (m) { m.gosub(630); },
        function (m) {
          var z = m.v.Z;
          if (z === 'N' || z === 'n') { m.cls(); m.kembali(); }
          else if (z !== 'Y' && z !== 'y') m.lompat(2840);
        }
      ] },
    ajar(2850,  5, 14, "This is  `KILLER MAZE'.  Play it one time and see why!"),
    ajar(2860,  6, 14, 'You will be placed INSIDE one of four different mazes;'),
    ajar(2870,  7, 14, 'moreover,  you will also encounter different starting'),
    ajar(2880,  8, 14, 'positions within each maze.  The idea is to find your'),
    ajar(2890,  9, 14, 'way to the exit in the fewest possible moves or steps.'),
    ajar(2900, 11, 14, 'Each maze is an 8 by 8 square.  Due to poor visibilty,'),
    ajar(2910, 12, 14, 'you will be able to see at most  4 steps ahead of you.'),
    ajar(2920, 14, 14, 'The  UP ARROW is the only key that will move you.  It'),
    ajar(2930, 15, 14, 'will allow you to take one step FORWARD.  The LEFT AR-'),
    ajar(2940, 16, 14, 'ROW and  RIGHT ARROW will allow you to turn either to'),
    ajar(2950, 17, 14, 'the left or  right.  The DOWN ARROW will allow you to'),
    ajar(2960, 18, 14, 'turn  completly  around.  The mazes come  up randomly'),
    ajar(2970, 19, 14, 'so you may encounter the same maze twice in a row,but'),
    ajar(2980, 20, 14, "don't expect that to help. GOOD LUCK. YOU'LL NEED IT!"),
    { baris: 2990, jalan: function (m) {
        m.locate(25, 28); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue'); m.warna(3, 0);
      } },
    { baris: 3000, bagian: [
        function (m) { m.gosub(630); },
        function (m) { m.cls(); m.kembali(); }
      ] },
    /* 3010 REM-nya menyebut lagu kebangsaan, kodenya menggambar kotak EXIT.
       Sisa dari program lain yang ikut tersalin — lengkap dengan dua salah
       ketik di dalam komentarnya sendiri. */
    rem(3010),
    { baris: 3020, jalan: function (m) {
        m.locate(6, 35);
        m.cetak(m.chr(201) + m.ulang(9, 205) + m.chr(187)); m.barisBaru();
      } },
    { baris: 3030, jalan: function (m) {
        for (m.v.A = 7; m.v.A <= 9; m.v.A++) {
          m.locate(m.v.A, 35); m.cetak(m.chr(186)); m.barisBaru();
          m.locate(m.v.A, 45); m.cetak(m.chr(186)); m.barisBaru();
        }
      } },
    { baris: 3040, jalan: function (m) {
        m.locate(10, 35);
        m.cetak(m.chr(200) + m.ulang(9, 205) + m.chr(188)); m.barisBaru();
      } },
    { baris: 3050, jalan: function (m) {
        m.locate(7, 37); m.warna(28, 0);
        m.cetak('E X I T'); m.barisBaru(); m.warna(3, 0);
        m.kembali();
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }
  function data(nomor) { return { baris: nomor, jalan: function () { } }; }

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }

  function trap(nomor, tombol) {
    return { baris: nomor, jalan: function (m) { m.pasangJebakan(tombol, 730); } };
  }

  function petunjuk(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.locate(24, 30); m.cetak('Use Cursor Arrows To Move');
    } };
  }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  /* `FOR A=dari TO sampai STEP langkah:POKE A,kode:NEXT` — langkah 160 bita
     berarti turun satu baris; langkah 2 berarti geser satu kolom. */
  function deret(nomor, dari, sampai, langkah, kode, pulang) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.A = dari; m.v.A <= sampai; m.v.A += langkah) {
        m.pokeLayar(m.v.A, kode);
      }
      if (pulang) m.kembali();
    } };
  }

  /* `POKE alamat,kode` satu atau beberapa, dengan alamat mutlak. */
  function poke(nomor, pasangan, pulang) {
    return { baris: nomor, jalan: function (m) {
      for (var i = 0; i < pasangan.length; i++) {
        m.pokeLayar(pasangan[i][0], pasangan[i][1]);
      }
      if (pulang) m.kembali();
    } };
  }

  /* `A=alamat:POKE A,k0:POKE A+2,k1:...` — dua bita = satu kolom. */
  function setA(nomor, alamat, kode, pulang) {
    return { baris: nomor, jalan: function (m) {
      m.v.A = alamat;
      for (var i = 0; i < kode.length; i++) m.pokeLayar(alamat + i * 2, kode[i]);
      if (pulang) m.kembali();
    } };
  }

  /* Lanjutan baris sebelumnya: A-nya sudah terisi, tinggal menambah offset. */
  function lanjutA(nomor, mulai, kode) {
    return { baris: nomor, jalan: function (m) {
      for (var i = 0; i < kode.length; i++) {
        m.pokeLayar(m.v.A + mulai + i * 2, kode[i]);
      }
    } };
  }

  /* Satu baris pertanyaan dinding. `sisi` cuma untuk dibaca manusia. */
  function tingkat(nomor, sisi, adaDinding, tanpaDinding) {
    var geser = (sisi === 'kanan') ? 1 : (sisi === 'kiri' ? 3 : 0);
    return { baris: nomor, jalan: function (m) {
      if (m.v.L_[m.v.DIR + geser]) m.gosub(adaDinding);
      else if (tanpaDinding !== undefined) m.gosub(tanpaDinding);
    } };
  }

  /* `RIGHT$(TIME$,2)` — jam yang maju tetap, seperti CRAPS.BAS. */
  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MAZE'] = {
    nama: 'MAZE',
    judul: 'Killer Maze',
    sumber: 'MAZE',
    berkas: 'run/MAZE.BAS',
    tabel: tabel,
    benih: 5,
    data: [
      'NORTH', ' EAST', 'SOUTH', ' WEST',
      /* labirin 1 */
      7, 3, 8, 2, 1, 3, 7, 1,
      11, 12, 9, 10, 8, 12, 11, 12, 9, 2, 4, 9, 6, 3, 12, 5,
      5, 11, 4, 1, 14, 9, 6, 5, 3, 10, 6, 5, 9, 4, 11, 4,
      9, 8, 10, 6, 5, 3, 14, 5, 7, 5, 15, 13, 3, 10, 10, 4,
      11, 0, 12, 1, 10, 12, 13, 5, 11, 6, 5, 7, 11, 2, 2, 6,
      /* labirin 2 */
      0, 7, 8, 0, 3, 6, 6, 1,
      13, 11, 8, 10, 8, 10, 12, 13, 3, 10, 0, 14, 3, 10, 4, 5,
      9, 12, 1, 12, 9, 14, 1, 4, 5, 5, 7, 5, 5, 9, 6, 7,
      1, 0, 10, 0, 4, 1, 10, 12, 7, 7, 13, 5, 5, 3, 12, 7,
      9, 14, 1, 4, 3, 14, 5, 13, 1, 10, 6, 3, 10, 14, 3, 6,
      /* labirin 3 */
      6, 2, 8, 1, 1, 7, 7, 1,
      9, 10, 10, 12, 9, 10, 8, 14, 5, 11, 12, 3, 6, 13, 3, 12,
      3, 10, 2, 12, 13, 3, 10, 4, 11, 12, 9, 6, 3, 10, 12, 5,
      9, 2, 6, 9, 14, 9, 6, 5, 5, 9, 12, 5, 13, 3, 10, 4,
      5, 7, 5, 3, 0, 10, 12, 5, 3, 12, 3, 10, 6, 11, 2, 6,
      /* labirin 4 */
      0, 0, -1, 1, 3, 7, 3, 1,
      13, 3, 10, 10, 10, 8, 10, 14, 3, 8, 10, 12, 13, 3, 10, 12,
      9, 6, 11, 6, 1, 10, 14, 5, 3, 10, 10, 8, 2, 10, 10, 6,
      9, 10, 12, 5, 9, 8, 10, 12, 5, 9, 6, 5, 7, 5, 9, 6,
      5, 1, 10, 0, 10, 2, 2, 12, 3, 2, 14, 7, 11, 10, 10, 6,
      /* labirin 5 */
      0, 3, 0, 8, 3, 7, 3, 1,
      9, 10, 10, 8, 10, 10, 12, 9, 1, 10, 12, 1, 12, 9, 6, 5,
      5, 13, 7, 5, 7, 7, 11, 4, 5, 3, 10, 6, 9, 10, 10, 6,
      1, 10, 10, 10, 6, 9, 10, 12, 5, 9, 12, 11, 12, 3, 8, 6,
      5, 5, 3, 8, 2, 10, 2, 12, 3, 2, 14, 7, 11, 10, 10, 6
    ],

    arsitektur: {
      judul: 'Alur MAZE.BAS',
      simpul: [
        { id: 'siap', baris: '10-160', jenis: 'mulai',
          teks: ['Judul, petunjuk,', 'pilih satu dari lima labirin'] },
        { id: 'gambar', baris: '450-570', jenis: 'subrutin',
          teks: ['Gambar pemandangan:', 'maju sampai lima petak'] },
        { id: 'dinding', baris: '690-2320',
          teks: ['Tiap jarak punya', 'rombongan POKE-nya sendiri'] },
        { id: 'exit', baris: '3020-3050',
          teks: ['Pandangan keluar batas:', 'kotak EXIT tergambar'] },
        { id: 'tunggu', baris: '230-300', jenis: 'putusan',
          teks: ['Tunggu tombol panah'] },
        { id: 'putar', baris: '310-330',
          teks: ['Kiri, kanan, balik:', 'DIR dijaga di 1..4'] },
        { id: 'maju', baris: '340-380',
          teks: ['Panah atas: hitung', 'petak tujuan'] },
        { id: 'tabrak', baris: '390-410', jenis: 'galat',
          teks: ['Ada dinding:', 'delapan bunyi, tidak jadi pindah'] },
        { id: 'menang', baris: '580-620', jenis: 'keluar',
          teks: ['Sampai pintu keluar:', 'cacah langkahnya'] }
      ],
      panah: [
        { dari: 'siap', ke: 'gambar' },
        { dari: 'gambar', ke: 'dinding' },
        { dari: 'dinding', ke: 'gambar', label: 'jarak berikutnya' },
        { dari: 'gambar', ke: 'exit', label: 'lewat batas labirin' },
        { dari: 'exit', ke: 'gambar' },
        { dari: 'gambar', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'putar', label: 'kiri / kanan / bawah' },
        { dari: 'putar', ke: 'gambar' },
        { dari: 'tunggu', ke: 'maju', label: 'panah atas' },
        { dari: 'maju', ke: 'tabrak', label: 'ada dinding', jenis: 'galat' },
        { dari: 'tabrak', ke: 'gambar', jenis: 'galat' },
        { dari: 'maju', ke: 'gambar', label: 'jalan terbuka' },
        { dari: 'maju', ke: 'menang', label: 'petak keluar' }
      ]
    },

    pseudokode: [
      { baris: 2370, tingkat: 0, teks: '<b>pilih labirin dengan cara membacanya lewat</b>: baca 1&ndash;5 blok DATA, pakai yang terakhir' },
      { baris: 2410, tingkat: 0, teks: 'setengah peluang memakai titik mulai cadangan' },
      { baris: 450, tingkat: 0, teks: '<b>GAMBAR PEMANDANGAN</b> &mdash; ulang paling jauh lima petak:' },
      { baris: 460, tingkat: 1, teks: 'ambil peta dinding petak ini: 4 bit, satu per arah mata angin' },
      { baris: 470, tingkat: 1, teks: 'salin tiga bit pertama ke ujung larik &mdash; <b>supaya <code>DIR+3</code> tidak perlu MOD</b>' },
      { baris: 480, tingkat: 1, teks: 'gambar pemisah tegak untuk jarak ini' },
      { baris: 490, tingkat: 1, teks: 'tanya tiga hal: dinding di depan? di kanan? di kiri? &mdash; lalu POKE gambarnya' },
      { baris: 500, tingkat: 1, teks: 'ada dinding di depan? <b>berhenti</b> &mdash; yang di baliknya tak terlihat' },
      { baris: 560, tingkat: 1, teks: 'keluar batas labirin? gambar kotak EXIT' },
      { baris: 230, tingkat: 0, teks: '<b>ULANG:</b> tampilkan arah hadap, tunggu tombol panah' },
      { baris: 270, tingkat: 1, teks: 'kiri / kanan / balik &rarr; ubah <code>DIR</code>, jaga di 1..4' },
      { baris: 340, tingkat: 1, teks: 'panah atas &rarr; hitung petak tujuan di <code>X,Y</code>' },
      { baris: 410, tingkat: 2, teks: 'ada dinding? delapan bunyi, dan <code>X,Y</code> dibatalkan dari <code>S,T</code>' },
      { baris: 420, tingkat: 2, teks: 'jalan terbuka? <code>S,T</code> diperbarui &mdash; langkahnya jadi' }
    ],

    perintahAsli: 'run\\MAZE.bat',
    catatanAsli: 'Di DOSBox-X menabrak dinding berbunyi delapan kali; ' +
      'di penelusur yang terlihat cuma delapan langkah yang tidak mengubah apa pun.',

    penyimpangan: [
      '<b>Empat larik diganti namanya.</b> <code>A(7,7)</code> jadi ' +
      '<code>A_</code>, <code>L()</code> jadi <code>L_</code>, ' +
      '<code>B()</code> jadi <code>B_</code>, <code>Z1()</code> jadi ' +
      '<code>Z1_</code> &mdash; keempatnya punya kembaran skalar di program ' +
      'ini (<code>L</code> kedalaman, <code>A</code> pencacah gelung, ' +
      '<code>B</code> pencacah gelung, <code>Z1</code> tombol yang ditekan).',

      '<b><code>PEEK</code> dan <code>DEF SEG</code> tidak berarti apa-apa.</b> ' +
      'Uji kartu monokrom di baris 20 selalu menjawab kartu warna, jadi alamat ' +
      '<code>POKE</code>-nya selalu relatif terhadap awal RAM layar.',

      '<b><code>SOUND</code> tidak berbunyi</b>, jadi menabrak dinding ' +
      '(baris 410) tidak terdengar. Yang terlihat cuma delapan putaran gelung ' +
      'yang tidak mengubah apa pun di layar.',

      '<b>Pengacaknya berbenih tetap</b>, jadi labirin dan titik mulainya ' +
      'selalu sama tiap penelusuran. <code>RIGHT$(TIME$,2)</code> di baris ' +
      '2330 memakai jam penelusur yang maju tetap.'
    ],

    pelajaran: {
      ringkas: 'Labirin orang-pertama yang seluruh gambar tiga dimensinya ' +
        'dibuat dari tiga aksara balok dan tiga ratus POKE. Yang layak ' +
        'dipelajari: perspektif sebagai tabel alamat, dan larik yang ' +
        'diperpanjang supaya tidak perlu MOD.',
      pelajari: [
        ['Perspektif yang dipahat, bukan dihitung',
         'Tidak ada satu pun perkalian proyeksi di program ini. Ada lima ' +
         'rombongan subrutin &mdash; satu per jarak &mdash; dan tiap rombongan ' +
         'memuat alamat layar yang sudah dihitung tangan. Dinding di jarak 0 ' +
         'setinggi 22 baris; di jarak 4 tinggal beberapa. Yang menyusut ' +
         'bukan angka melainkan <b>daftar alamatnya</b>.'],
        ['Larik yang diperpanjang supaya tidak perlu MOD',
         'Dinding kiri adalah <code>L(DIR+3)</code> dan kanan ' +
         '<code>L(DIR+1)</code>. Dengan <code>DIR</code> sampai 4, indeksnya ' +
         'bisa mencapai 7. Alih-alih menulis modulo di enam belas tempat, ' +
         'baris 470 <b>menyalin tiga elemen pertama ke ujung larik</b>. ' +
         'Pembungkusan yang gratis, dan tidak ada satu pun MOD di seluruh ' +
         'program.'],
        ['Empat bit untuk empat dinding',
         'Tiap petak labirin cuma satu angka 0&ndash;15. Baris 400 ' +
         'membongkarnya: <code>D AND 8</code>, <code>AND 4</code>, ' +
         '<code>AND 2</code>, <code>AND 1</code> &mdash; utara, timur, ' +
         'selatan, barat. Labirin 8&times;8 muat dalam 64 angka, dan ' +
         'kelimanya muat dalam satu blok <code>DATA</code>.'],
        ['Memilih dengan cara membaca lewat',
         'Baris 2370: <code>FOR C=1 TO FIX(RND*5)+1</code>, dan badannya ' +
         'membaca satu labirin utuh tiap putaran. Yang tersisa di larik ' +
         'adalah yang <b>terakhir</b> dibaca. Tidak ada penunjuk, tidak ada ' +
         'indeks &mdash; penunjuk <code>DATA</code> sendiri yang jadi ' +
         'penomornya.'],
        ['Petak yang dicoba versus petak yang pasti',
         '<code>X,Y</code> adalah petak <b>tujuan</b>; <code>S,T</code> petak ' +
         'yang sudah pasti. Baris 340-370 memindahkan X,Y, baris 390-410 ' +
         'mengujinya, dan hanya baris 420 yang menetapkannya. Kalau ada ' +
         'dinding, baris 440 mengembalikan X,Y dari S,T. Pola "coba dulu, ' +
         'baru simpan" yang masih dipakai di mana-mana hari ini.']
      ],
      hindari: [
        ['Memakai koordinat pemain sebagai pencacah gelung',
         'Baris 410: <code>FOR X=1 TO 8:SOUND ...:NEXT X</code>. ' +
         '<code>X</code> di situ adalah <b>koordinat pemain</b>. Aman cuma ' +
         'karena baris 440 mengembalikannya dari <code>S</code>. Satu ' +
         'langkah lupa dan pemainnya terlempar ke petak kedelapan.'],
        ['Baris kembar yang salah satunya mati',
         'Baris 190 dan 200 identik. Baris 440 melompat ke 200, jadi 190 ' +
         'hanya jalan sekali seumur permainan dan tidak berguna sama sekali.'],
        ['Komentar yang menceritakan program lain',
         'Baris 3010: <code>REM******** BATLLE HYMN OF THE REPUPLIC</code> ' +
         '&mdash; dua salah ketik, dan kodenya menggambar kotak "EXIT". Sisa ' +
         'dari program lain yang ikut tersalin.'],
        ['Huruf O yang menyamar jadi angka nol',
         'Baris 2820: <code>COLOR 3,O</code>. Itu huruf O. BASIC ' +
         'memperlakukannya sebagai variabel yang belum diisi, nilainya 0, ' +
         'dan hasilnya <b>kebetulan benar</b>. Salah ketik yang tidak akan ' +
         'pernah ketahuan.']
      ]
    },

    penjelasan: [
      { judul: 'Tiga dimensi dari tiga aksara',
        isi: [
          'Layar teks 80&times;25 tidak bisa menggambar garis. Yang bisa ' +
          'dilakukannya cuma menaruh salah satu dari 256 aksara di salah satu ' +
          'dari 2000 kotak.',
          'Program ini memakai <b>tiga</b> di antaranya:',
          '<code>CHR$(219)</code> balok penuh, <code>CHR$(220)</code> setengah ' +
          'bawah, <code>CHR$(223)</code> setengah atas.',
          'Dengan balok setengah, satu baris teks bisa dipotong jadi dua ' +
          'tingkat &mdash; dan itu cukup untuk membuat garis miring yang ' +
          'meyakinkan. Dinding yang menjauh digambar sebagai tangga: penuh, ' +
          'penuh, setengah-atas, setengah-atas, kosong.',
          'Lihat baris 1220-1250 (dinding kiri di jarak 1):',
          '<code>1220 A=176:POKE A,223:POKE A+2,219:POKE A+4,219:POKE A+6,219</code><br>' +
          '<code>1230 POKE A+8,220:POKE A+10,220:POKE A+12,220</code>',
          'Setengah-atas, tiga penuh, tiga setengah-bawah &mdash; dan itulah ' +
          'satu potong dinding yang menjauh, tujuh kolom.',
          'Semua alamatnya mutlak dan sudah dihitung sebelumnya. Tidak ada ' +
          'proyeksi, tidak ada pembagian jarak. <b>Perspektifnya dipahat.</b>'
        ] },
      { judul: 'Kenapa lariknya tujuh, bukan empat',
        isi: [
          'Peta dinding satu petak cuma empat bit: utara, timur, selatan, ' +
          'barat. Baris 400 membongkarnya ke <code>L(1)</code> sampai ' +
          '<code>L(4)</code>.',
          'Tapi yang ditanyakan penggambar bukan "ada dinding di utara?" ' +
          'melainkan <b>"ada dinding di kiri saya?"</b> &mdash; dan itu ' +
          'bergantung arah hadap:',
          'depan = <code>L(DIR)</code>, kanan = <code>L(DIR+1)</code>, kiri = ' +
          '<code>L(DIR+3)</code>.',
          'Dengan <code>DIR = 4</code> (barat), kiri berarti ' +
          '<code>L(7)</code> &mdash; yang seharusnya <code>L(3)</code>.',
          'Jawaban yang wajar: tulis <code>((DIR+3-1) MOD 4)+1</code>. ' +
          'Jawaban program ini, baris 470:',
          '<code>470 L(5)=D AND 8:L(6)=D AND 4:L(7)=D AND 2</code>',
          '<b>Salin tiga yang pertama ke ujungnya.</b> Sekarang ' +
          '<code>L(5)=L(1)</code>, <code>L(6)=L(2)</code>, ' +
          '<code>L(7)=L(3)</code>, dan pembungkusannya terjadi sendiri.',
          'Harganya tiga elemen larik. Yang dibelinya: enam belas tempat di ' +
          'baris 690-930 yang tidak perlu menulis modulo, di mesin yang ' +
          'setiap operasinya terasa. Dan tidak ada satu pun MOD di seluruh ' +
          'program ini.'
        ] },
      { judul: 'Coba dulu, baru simpan',
        isi: [
          'Ada dua pasang koordinat di program ini, dan bedanya penting:',
          '<code>S,T</code> = petak tempat pemain <b>berada</b>. ' +
          '<code>X,Y</code> = petak yang sedang <b>dipertimbangkan</b>.',
          'Waktu pemain menekan panah atas, baris 340-370 memindahkan ' +
          '<code>X,Y</code> &mdash; belum <code>S,T</code>. Lalu:',
          '<code>390 D=A(S,T)</code> &mdash; baca dinding petak ASAL<br>' +
          '<code>410 IF L(DIR) THEN ... GOTO 440</code> &mdash; ada dinding, ' +
          'batalkan<br>' +
          '<code>420 S=X:T=Y</code> &mdash; tidak ada dinding, langkahnya jadi',
          'Dan baris 440 <code>X=S:Y=T</code> mengembalikan yang dicoba ke ' +
          'yang pasti &mdash; entah langkahnya jadi atau tidak.',
          'Subrutin penggambar juga memakai <code>X,Y</code> sebagai petak ' +
          'berjalannya (baris 520-550), dan itu sebabnya baris 180 dan 430 ' +
          'selalu memulihkannya sesudah menggambar. <b>Satu pasang variabel, ' +
          'dua tugas</b> &mdash; hemat memori, dan setiap pemanggilnya harus ' +
          'ingat memulihkan.',
          'Yang paling rapuh: baris 410 memakai <code>X</code> sebagai ' +
          'pencacah gelung bunyi. Itu berjalan hanya karena baris 440 ' +
          'mengembalikannya.'
        ] }
    ]
  };
})(window);
