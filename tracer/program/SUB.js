/* ===========================================================================
   SUB.js — porting minimalis SUB.BAS sebagai tabel baris.

   Program kedelapan belas: berburu kapal selam. Layarnya dibagi tiga tingkat
   kedalaman, tiap tingkat 24 petak berhuruf A sampai X, dan kapal selamnya
   menempati TIGA petak bersebelahan di salah satu tingkat.

   Dua hal yang membuatnya layak ditelusuri:

   (1) BOM LAUTNYA TERBANG MELENGKUNG — dan lengkungannya dihitung dengan
       kosinus (baris 780). Tiap petak punya sudut lemparnya sendiri, dibaca
       dari dua puluh empat angka di baris 2020-2030.

   (2) BOMNYA TIDAK MERUSAK GAMBAR YANG DILEWATINYA. Sebelum menggambar,
       baris 800 MEMBACA apa yang ada di situ dengan `SCREEN()`; sesudah
       lewat, baris 820 memokenya kembali. Trik "simpan-di-bawah" — nenek
       moyang setiap sprite yang pernah ditulis.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `A(71)` jadi `A_` dan `B(23)` jadi `B_`: keduanya punya kembaran skalar.
   - `PEEK`/`DEF SEG` tidak berarti apa-apa; alamat poke relatif terhadap
     awal RAM layar.
   - `PLAY` dan `SOUND` diam, jadi "Anchors Aweigh" (baris 2050) dan "Taps"
     (2640) tidak terdengar.
   - Atribut 132 di baris 630 berarti merah BERKEDIP; kedipnya tidak ditiru,
     jadi petak yang kena tampil merah biasa.
   - Pengacaknya berbenih tetap, jadi letak kapal selamnya selalu sama.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    { baris: 10, jalan: function (m) { m.warna(3, 0); m.locate(null, null, 0); } },
    { baris: 20, jalan: function (m) { m.lompat(150); } },
    trap(30, 1), trap(40, 2), trap(50, 3), trap(60, 4), trap(70, 5),
    trap(80, 6), trap(90, 7), trap(100, 8), trap(110, 9),
    { baris: 120, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) m.jebakan(m.v.A, true);
      } },
    { baris: 130, jalan: function (m) { m.pasangJebakan(10, 2960); } },
    { baris: 140, jalan: function (m) { m.kembali(); } },
    { baris: 150, bagian: [
        function (m) { m.gosub(30); },     /* pasang jebakan tombol */
        function (m) { m.gosub(2590); },   /* DIM dan isi larik     */
        function (m) { m.gosub(2080); },   /* nama dan petunjuk     */
        function (m) { m.gosub(2050); },   /* lagu Anchors Aweigh   */
        function (m) { m.gosub(430); }     /* sembunyikan kapal     */
      ] },
    { baris: 160, jalan: function (m) { m.v.JAM = 23; m.semai(detik(m)); } },
    { baris: 170, jalan: function (m) {
        m.semai(detik(m) * m.acak() * m.acak() * m.acak());
      } },
    { baris: 180, bagian: [
        function (m) { m.gosub(930); },    /* gambar peta laut      */
        function (m) { m.gosub(580); }     /* tulis huruf petaknya  */
      ] },
    { baris: 190, bagian: [
        function (m) { m.gosub(300); },    /* tanya tingkat + petak */
        function (m) { m.gosub(710); },    /* terbangkan bomnya     */
        function (m) { m.v.SHOTS = (m.v.SHOTS || 0) + 1; }
      ] },
    /* 200-220 tiga uji berturut-turut, satu per petak kapal selam. Petak
       yang kena diganti 15 (aksara matahari) dan nomornya dijadikan 99
       supaya tidak bisa kena dua kali. */
    kena(200, 1), kena(210, 2),
    { baris: 220, jalan: function (m) {
        if (m.v.DROP === m.v.SUB[3]) {
          m.v.A_[m.v.DROP] = 15; m.v.SUB[3] = 99;
        } else {
          m.v.A_[m.v.DROP] = 0;
        }
      } },
    /* 230 uji menang yang ditulis dengan cara paling hemat: SUB(1)=SUB(2)
       cuma bisa benar kalau keduanya sudah 99. Jadi satu perbandingan
       menggantikan dua. */
    { baris: 230, bagian: [
        function (m) {
          if (m.v.SUB[1] === m.v.SUB[2] && m.v.SUB[3] === 99) m.gosub(2710);
        },
        function (m) {
          if (m.v.SUB[1] === m.v.SUB[2] && m.v.SUB[3] === 99) m.lompat(2770);
        }
      ] },
    { baris: 240, bagian: [
        function (m) { m.gosub(580); },
        function (m) {
          m.v.TRY = (m.v.TRY || 0) + 1;
          if (m.v.SHOTS < 3) m.lompat(190);
        }
      ] },
    { baris: 250, bagian: [
        function (m) { m.v.SHOTS = 0; },
        function (m) { m.gosub(1360); }    /* gambar kapal selam    */
      ] },
    { baris: 260, bagian: [
        function (m) { m.v.MISS = Math.floor(m.acak() * 2); },
        function (m) { m.gosub(2360); }    /* torpedo musuh         */
      ] },
    { baris: 270, jalan: function (m) {
        if (m.v.MISS) m.lompat(290); else m.v.HIT = (m.v.HIT || 0) + 1;
      } },
    { baris: 280, bagian: [
        function (m) { if (m.v.HIT === 3) m.gosub(2640); },
        function (m) { if (m.v.HIT === 3) m.lompat(2770); }
      ] },
    { baris: 290, jalan: function (m) { m.lompat(180); } },

    /* --- 300-410: tanya tingkat lalu petak --------------------------------- */
    rem(300),
    { baris: 310, jalan: function (m) {
        m.locate(24, 1); m.spc(78);
        m.locate(24, 10); m.warna(15, 0);
      } },
    { baris: 320, jalan: function (m) {
        m.cetak('Choose a Level 1, 2, or 3 and Strike Corresponding Key');
      } },
    { baris: 330, bagian: [
        function (m) { m.gosub(390); },
        function (m) {
          if (m.v.Z > '0' && m.v.Z < '4') {
            m.v.A = 24 * (parseInt(m.v.Z, 10) - 1);
            m.v.AA = parseInt(m.v.Z, 10);
          } else m.lompat(330);
        }
      ] },
    { baris: 340, jalan: function (m) {
        m.locate(24, 1); m.spc(78);
        m.locate(24, 10); m.warna(15, 0);
      } },
    { baris: 350, jalan: function (m) {
        m.cetak('Choose a Quadrant A Thru X and Strike Corresponding Key');
      } },
    { baris: 360, bagian: [
        function (m) { m.gosub(390); },
        function (m) { if (m.v.Z >= 'A' && m.v.Z < 'Y') m.lompat(380); }
      ] },
    { baris: 370, jalan: function (m) {
        if (m.v.Z >= 'a' && m.v.Z < 'y') {
          m.v.Z = m.chr(m.v.Z.charCodeAt(0) - 32);
        } else m.lompat(360);
      } },
    /* 380 DROP = tingkat*24 + huruf. Satu angka 0..71 yang memuat tingkat
       DAN petaknya sekaligus — dan itu sebabnya larik A() panjangnya 72. */
    { baris: 380, jalan: function (m) {
        m.v.DROP = m.v.A + m.v.Z.charCodeAt(0) - 65;
        m.kembali();
      } },
    { baris: 390, jalan: function () { /* POKE 106,0 — lihat catatan DRAW */ } },
    { baris: 400, jalan: function (m) { if (m.inkey() !== '') m.lompat(400); } },
    { baris: 410, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(410); else m.kembali();
      } },

    /* --- 420-560: menyembunyikan kapal selam ------------------------------- */
    rem(420),
    /* 430 gelung "mengaduk" pengacak: memanggil RND ratusan kali cuma untuk
       memajukan deretnya. Cara lama membuat hasilnya terasa acak. */
    { baris: 430, jalan: function (m) {
        var n = detik(m) * 10;
        for (m.v.A = 1; m.v.A <= n; m.v.A++) m.v.B = m.acak();
      } },
    /* 440 petak awalnya harus di tengah papan (kolom 1-4 atau 7-10 dari
       enam), supaya ketiga petak kapalnya pasti muat ke segala arah. */
    { baris: 440, jalan: function (m) {
        m.v.A = Math.floor(m.acak() * 24);
        var A = m.v.A;
        if ((A > 6 && A < 11) || (A > 12 && A < 17)) m.lompat(450);
        else m.lompat(430);
      } },
    { baris: 450, jalan: function (m) {
        m.v.A = m.v.A + Math.floor(m.acak() * 3) * 24;
      } },
    { baris: 460, jalan: function (m) { m.semai(detik(m) * m.acak() * 50); } },
    /* 470 delapan arah, tapi daftarnya cuma tujuh: `ON n GOTO` dengan n=0
       jatuh ke baris berikutnya, dan baris 480 itulah arah kedelapan.
       Pola yang sama dengan daftar barang di CRAPS.BAS. */
    { baris: 470, jalan: function (m) {
        var t = [490, 500, 510, 520, 530, 540, 550][Math.floor(m.acak() * 8) - 1];
        if (t) m.lompat(t);
      } },
    arah(480, 1), arah(490, 7), arah(500, 6), arah(510, 5),
    arah(520, -1), arah(530, -7), arah(540, -6),
    { baris: 550, jalan: function (m) {
        m.v.B = m.v.A - 5; m.v.C = m.v.A + 5;
      } },
    { baris: 560, jalan: function (m) {
        m.v.SUB[1] = m.v.A; m.v.SUB[2] = m.v.B; m.v.SUB[3] = m.v.C;
        m.kembali();
      } },

    /* --- 580-700: menulis huruf petak ke RAM layar ------------------------- */
    rem(570),
    { baris: 580, jalan: function () { } },
    { baris: 590, jalan: function () { } },
    huruf(600, 0, 1314, 1414),
    huruf(610, 24, 2114, 2214),
    { baris: 620, bagian: [
        function (m) { m.v.B = 48; m.untuk('A', 2914, 3014, 20, 680); },
        function (m) { m.gosub(630); },
        function (m) { m.lanjutkan('A'); },
        function (m) { m.lompat(680); }
      ] },
    /* 630-660 empat baris petak sekaligus: jarak 156 bita = satu baris layar
       kurang dua kolom... sebenarnya 156 = 160 - 4, jadi tiap baris petak
       turun satu baris layar dan mundur dua kolom. Kalau petaknya kena
       (nilainya 15), atribut 132 dipoke juga: merah berkedip. */
    petak(630, 0, 0),
    petak(640, 156, 6),
    petak(650, 312, 12),
    petak(660, 468, 18),
    { baris: 670, jalan: function (m) { m.v.B = m.v.B + 1; m.kembali(); } },
    { baris: 680, jalan: function (m) {
        m.warna(0, 15); m.locate(10, 72);
        m.cetak(' LEVEL 1 '); m.barisBaru();
      } },
    { baris: 690, jalan: function (m) {
        m.locate(15, 72); m.cetak(' LEVEL 2 '); m.barisBaru();
        m.locate(20, 72); m.cetak(' LEVEL 3 '); m.barisBaru();
        m.warna(15, 0);
      } },
    { baris: 700, jalan: function (m) { m.kembali(); } },

    /* --- 710-910: bom laut yang terbang melengkung ------------------------- */
    rem(710),
    { baris: 720, jalan: function () { } },
    { baris: 730, jalan: function () { } },
    /* 740 B = sudut lempar untuk petak ini, dibaca dari dua puluh empat
       angka di baris 2020-2030. Petak di kiri layar dapat angka negatif
       (bom melengkung ke kiri), yang di kanan positif. */
    { baris: 740, jalan: function (m) {
        m.v.X = 1; m.v.Y = 42;
        m.v.B = m.v.B_[Math.abs(m.v.A - m.v.DROP)];
      } },
    { baris: 750, jalan: function (m) { m.v.C = 42; m.v.L = 1; } },
    { baris: 760, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 5; m.v.A++) {
          for (m.v.E = 1000; m.v.E >= 50; m.v.E -= 50) m.suara(m.v.E, 0.0001);
        }
      } },
    { baris: 770, jalan: function (m) { m.untuk('E', 1.5, 4.76, 0.25, 840); } },
    /* 780 inilah lengkungannya: kosinus dari 1,5 sampai 4,76 radian
       menggambar setengah gelombang — naik lalu turun. Amplitudonya
       (3 + |B|) membuat petak yang jauh dilempar lebih tinggi. */
    { baris: 780, jalan: function (m) {
        m.v.L = Math.cos(m.v.E) * (3 + Math.abs(m.v.B)) + 6;
        m.locate(bulat(m.v.L), bulat(m.v.C));
      } },
    { baris: 790, jalan: function (m) {
        m.v.X = m.barisKursor(); m.v.Y = m.pos();
      } },
    /* 800 SIMPAN-DI-BAWAH: baca aksara dan warna yang sudah ada di situ. */
    { baris: 800, jalan: function (m) {
        m.v.V = m.layarAksara(m.v.X, m.v.Y);
        m.v.W = m.layarAtribut(m.v.X, m.v.Y);
      } },
    { baris: 810, jalan: function (m) {
        m.cetak(m.chr(15));
        for (m.v.D = 1; m.v.D <= 20 * m.v.B; m.v.D++) { /* jeda */ }
      } },
    /* 820 dan dikembalikan lagi. Rumus alamatnya: (baris-1)*160 + kolom*2,
       kurang 2 untuk bita aksara dan kurang 1 untuk bita warnanya. */
    { baris: 820, jalan: function (m) {
        var dasar = (m.v.X - 1) * 160 + m.v.Y * 2;
        m.pokeLayar(dasar - 1, m.v.W);
        m.pokeLayar(dasar - 2, m.v.V);
      } },
    { baris: 830, jalan: function (m) { m.v.C = m.v.C + m.v.B; } },
    { baris: 840, bagian: [
        function (m) { m.lanjutkan('E'); },
        function (m) { m.suara(50, 0); m.v.C = m.v.C - m.v.B; }
      ] },
    /* 850 batas gelungnya memakai L — nilai yang baru saja diubah di baris
       yang sama. Makin dalam tingkatnya (AA) dan makin bawah petaknya
       (DROP/6), makin jauh bomnya tenggelam. */
    { baris: 850, jalan: function (m) {
        m.v.L = m.v.L + 2;
        m.untuk('L', m.v.L, m.v.AA * 2 + Math.trunc(m.v.DROP / 6) + m.v.L - m.v.AA + 2, 1, 900);
      } },
    { baris: 860, jalan: function (m) {
        m.locate(bulat(m.v.L), bulat(m.v.C));
        m.v.X = m.barisKursor(); m.v.Y = m.pos();
      } },
    { baris: 870, jalan: function (m) {
        m.v.V = m.layarAksara(m.v.X, m.v.Y);
        m.v.W = m.layarAtribut(m.v.X, m.v.Y);
      } },
    { baris: 880, jalan: function (m) {
        m.cetak(m.chr(157));
        for (m.v.D = 1; m.v.D <= 200; m.v.D++) { /* jeda */ }
      } },
    { baris: 890, jalan: function (m) {
        var dasar = (m.v.X - 1) * 160 + m.v.Y * 2;
        m.pokeLayar(dasar - 1, m.v.W);
        m.pokeLayar(dasar - 2, m.v.V);
      } },
    { baris: 900, bagian: [
        function (m) { m.lanjutkan('L'); },
        function (m) { m.cetak(m.chr(29) + m.chr(219)); m.barisBaru(); }
      ] },
    { baris: 910, jalan: function (m) {
        for (m.v.X = 20; m.v.X <= 500; m.v.X += 10) m.suara(m.v.X * 2 + 22, 0.0001);
        m.suara(m.v.X, 0);
        m.kembali();
      } },

    /* --- 930-1340: peta laut ---------------------------------------------- */
    rem(920),
    { baris: 930, jalan: function () { } },
    { baris: 940, jalan: function () { } },
    { baris: 950, jalan: function (m) { m.warna(15, 0); m.cls(); } },
    { baris: 960, jalan: function (m) {
        m.pokeLayar(76, 215);
        m.v.A = 88;
        m.pokeLayar(88, 176); m.pokeLayar(90, 176); m.pokeLayar(92, 176);
      } },
    poke(970, [[236, 215], [248, 215], [256, 219], [260, 219]]),
    deretPoke(980, 394, 400, 2, [[0, 178]]),
    poke(990, [[408, 215], [416, 219], [420, 219], [532, 196], [534, 220]]),
    { baris: 1000, jalan: function (m) {
        m.pokeLayar(536, 220);
        for (m.v.A = 550; m.v.A <= 562; m.v.A += 2) m.pokeLayar(m.v.A, 219);
      } },
    poke(1010, [[568, 215], [576, 219], [580, 219], [592, 220], [594, 220]]),
    poke(1020, [[596, 196], [674, 213]]),
    setPoke(1030, 688, [[0, 174], [2, 205], [4, 219], [6, 219]]),
    lanjutPoke(1040, [[8, 219], [10, 219]]),
    setPoke(1050, 710, [[0, 219], [2, 176], [4, 176], [6, 219]]),
    setPoke(1060, 718, [[0, 176], [2, 176], [4, 219], [6, 176]]),
    lanjutPoke(1070, [[8, 176], [10, 219]]),
    deretPoke(1080, 730, 740, 2, [[0, 176]]),
    { baris: 1090, jalan: function (m) {
        m.pokeLayar(742, 219);
        for (m.v.A = 750; m.v.A <= 756; m.v.A += 2) m.pokeLayar(m.v.A, 219);
      } },
    poke(1100, [[758, 205], [760, 175], [778, 210]]),
    poke(1110, [[834, 223], [836, 219], [838, 219]]),
    deretPoke(1120, 840, 932, 4, [[0, 177], [2, 177]]),
    poke(1130, [[936, 219], [938, 219]]),
    deretPoke(1140, 986, 996, 2, [[0, 95]]),
    poke(1150, [[998, 223], [1096, 223]]),
    deretPoke(1160, 1000, 1092, 4, [[0, 219], [2, 219]]),
    /* 1170 kerusakan kapal sendiri, digambar sebagai kejatuhan: HIT=0 lompat
       ke 1200 (mulus), HIT=1 ke 1190 (satu tanda), HIT=2 ke 1180 (dua). */
    { baris: 1170, jalan: function (m) {
        var t = [1180, 1190, 1200][3 - (m.v.HIT || 0) - 1];
        if (t) m.lompat(t);
      } },
    rusak(1180, 7, 35), rusak(1190, 7, 45),
    { baris: 1200, jalan: function (m) {
        for (m.v.A = 1098; m.v.A <= 1110; m.v.A += 2) {
          m.pokeLayar(m.v.A, 95); m.pokeLayar(m.v.A + 2, 95);
        }
        m.pokeLayar(1112, 95);
      } },
    poke(1210, [[1144, 47], [1272, 47]]),
    poke(1220, [[1300, 47], [1428, 47], [1456, 47], [1584, 47], [1612, 47]]),
    poke(1230, [[1740, 47], [1768, 47], [1896, 47], [1924, 47]]),
    deretPoke(1240, 1898, 1912, 4, [[0, 95], [2, 95]]),
    deretPoke(1250, 1926, 2050, 4, [[0, 95], [2, 95]]),
    poke(1260, [[2052, 47], [2072, 47], [2100, 47], [2228, 47], [2256, 47]]),
    poke(1270, [[2384, 47], [2412, 47], [2540, 47], [2568, 47]]),
    poke(1280, [[2696, 47], [2724, 47], [2852, 47], [2872, 47]]),
    deretPoke(1290, 2698, 2712, 4, [[0, 95], [2, 95]]),
    { baris: 1300, jalan: function (m) {
        for (m.v.A = 2726; m.v.A <= 2848; m.v.A += 4) {
          m.pokeLayar(m.v.A, 95); m.pokeLayar(m.v.A + 2, 95);
        }
        m.pokeLayar(2850, 95);
      } },
    poke(1310, [[2900, 47], [3028, 47], [3056, 47], [3184, 47], [3212, 47]]),
    poke(1320, [[3340, 47], [3368, 47], [3496, 47], [3524, 47]]),
    { baris: 1330, jalan: function (m) {
        for (m.v.A = 3526; m.v.A <= 3650; m.v.A += 4) {
          m.pokeLayar(m.v.A, 95); m.pokeLayar(m.v.A + 2, 95);
        }
        m.pokeLayar(3652, 47);
      } },
    /* 1340 memanggil 3020 — yaitu EKOR penangan tombol F10. Bilah status di
       baris 25 digambar ulang dengan memanggil separuh penangan jebakan.
       Satu subrutin, dua pintu masuk. */
    { baris: 1340, bagian: [
        function (m) { m.gosub(3020); },
        function (m) { m.kembali(); }
      ] },

    /* --- 1360-2010: gambar kapal selam (layar kedua) ----------------------- */
    rem(1350),
    { baris: 1360, jalan: function () { } },
    { baris: 1370, jalan: function () { } },
    { baris: 1380, jalan: function (m) { m.warna(15, 0); m.cls(); } },
    deretPoke(1390, 0, 158, 2, [[0, 176], [2, 176]]),
    poke(1400, [[210, 196], [238, 179], [318, 176], [320, 176]]),
    poke(1410, [[362, 52], [364, 48]]),
    poke(1420, [[368, 196], [370, 196], [398, 179], [478, 176]]),
    poke(1430, [[480, 176], [530, 196], [542, 203], [558, 179]]),
    poke(1440, [[638, 176], [640, 176], [682, 51], [684, 48]]),
    poke(1450, [[688, 196], [690, 196], [702, 215], [716, 176]]),
    poke(1460, [[718, 176], [720, 176], [798, 176], [800, 176]]),
    poke(1470, [[850, 196], [862, 215], [876, 215], [878, 179]]),
    poke(1480, [[958, 176], [960, 176], [1002, 50], [1004, 48]]),
    poke(1490, [[1008, 196], [1010, 196], [1022, 215], [1036, 215]]),
    poke(1500, [[1038, 179], [1044, 219], [1046, 219], [1050, 219], [1052, 219]]),
    poke(1510, [[1118, 176], [1120, 176], [1170, 196]]),
    deretPoke(1520, 1180, 1188, 2, [[0, 178]]),
    poke(1530, [[1196, 215], [1198, 179], [1204, 219], [1206, 219], [1210, 219]]),
    poke(1540, [[1212, 219], [1278, 176], [1280, 176], [1314, 196], [1316, 220]]),
    poke(1550, [[1318, 220], [1322, 49], [1324, 48], [1328, 196], [1330, 196]]),
    deretPoke(1560, 1338, 1350, 2, [[0, 219]]),
    poke(1570, [[1356, 215], [1358, 179], [1364, 219], [1366, 219], [1370, 219]]),
    poke(1580, [[1372, 219], [1394, 220], [1396, 220], [1398, 196], [1438, 176]]),
    poke(1590, [[1440, 176], [1456, 213], [1470, 174], [1472, 205]]),
    deretPoke(1600, 1474, 1480, 2, [[0, 219]]),
    poke(1610, [[1490, 219], [1492, 176], [1494, 176], [1496, 176], [1498, 219]]),
    poke(1620, [[1500, 176], [1502, 176], [1504, 219], [1506, 176], [1508, 176]]),
    poke(1630, [[1510, 219], [1512, 176], [1514, 176], [1516, 219]]),
    deretPoke(1640, 1518, 1534, 2, [[0, 176]]),
    { baris: 1650, jalan: function (m) {
        m.pokeLayar(1536, 219);
        for (m.v.A = 1552; m.v.A <= 1558; m.v.A += 2) m.pokeLayar(m.v.A, 219);
      } },
    poke(1660, [[1560, 205], [1562, 175], [1576, 210], [1598, 176], [1600, 176]]),
    poke(1670, [[1616, 223], [1618, 223], [1620, 219], [1622, 219]]),
    deretPoke(1680, 1624, 1732, 4, [[0, 177], [2, 177]]),
    poke(1690, [[1734, 219], [1736, 219], [1758, 176], [1760, 176]]),
    { baris: 1700, jalan: function (m) {
        for (m.v.A = 1762; m.v.A <= 1780; m.v.A += 2) m.pokeLayar(m.v.A, 196);
        m.pokeLayar(1782, 223);
      } },
    deretPoke(1710, 1784, 1888, 4, [[0, 219], [2, 219]]),
    poke(1720, [[1892, 223], [1894, 223]]),
    { baris: 1730, jalan: function (m) {
        for (m.v.A = 1896; m.v.A <= 1916; m.v.A += 2) m.pokeLayar(m.v.A, 196);
        m.pokeLayar(1918, 176);
      } },
    poke(1740, [[1920, 176], [1960, 45], [1962, 49], [1964, 48], [1968, 196]]),
    poke(1750, [[1970, 196], [1998, 179]]),
    poke(1760, [[2078, 176], [2080, 176], [2130, 196], [2158, 179], [2238, 176]]),
    poke(1770, [[2240, 176], [2280, 45], [2282, 50]]),
    poke(1780, [[2284, 48], [2288, 196], [2290, 196], [2318, 179]]),
    poke(1790, [[2398, 176], [2400, 176], [2450, 196], [2478, 179], [2558, 176]]),
    poke(1800, [[2560, 176], [2562, 179], [2566, 197], [2570, 179], [2574, 197]]),
    poke(1810, [[2578, 179], [2582, 197], [2586, 179], [2590, 197], [2594, 179]]),
    poke(1820, [[2598, 197], [2602, 179], [2606, 197], [2608, 196], [2610, 197]]),
    poke(1830, [[2614, 197], [2618, 179], [2622, 197], [2626, 179], [2630, 197]]),
    poke(1840, [[2634, 179], [2638, 197], [2642, 179], [2646, 197], [2650, 179]]),
    poke(1850, [[2654, 197], [2658, 179], [2662, 197], [2666, 179], [2670, 197]]),
    poke(1860, [[2674, 179], [2678, 197], [2682, 179], [2686, 197], [2690, 179]]),
    poke(1870, [[2694, 197], [2698, 179], [2702, 197], [2706, 179], [2710, 197]]),
    poke(1880, [[2714, 179], [2718, 176], [2720, 176], [2770, 196], [2798, 179]]),
    poke(1890, [[2726, 49], [2734, 50], [2742, 51], [2750, 52], [2758, 53]]),
    poke(1900, [[2766, 54], [2774, 55], [2782, 56], [2790, 57]]),
    poke(1910, [[2804, 45], [2806, 57], [2812, 45]]),
    poke(1920, [[2814, 56], [2820, 45], [2822, 55], [2828, 45], [2830, 54]]),
    poke(1930, [[2836, 45], [2838, 53], [2844, 45], [2846, 52], [2852, 45]]),
    poke(1940, [[2854, 51], [2860, 45], [2862, 50], [2868, 45], [2870, 49]]),
    poke(1950, [[2878, 176], [2880, 176], [2920, 45], [2922, 51], [2924, 48]]),
    poke(1960, [[2928, 196], [2930, 196], [2958, 179], [3038, 176], [3040, 176]]),
    poke(1970, [[3090, 196], [3118, 179], [3198, 176], [3200, 176], [3240, 45]]),
    poke(1980, [[3242, 52], [3244, 48], [3248, 196], [3250, 196], [3278, 179]]),
    poke(1990, [[3358, 176], [3360, 176], [3408, 196], [3410, 196], [3438, 179]]),
    { baris: 2000, jalan: function (m) {
        for (m.v.A = 3518; m.v.A <= 3676; m.v.A += 4) {
          m.pokeLayar(m.v.A, 176); m.pokeLayar(m.v.A + 2, 176);
        }
        m.pokeLayar(3678, 176);
      } },
    { baris: 2010, jalan: function (m) { m.kembali(); } },

    data(2020), data(2030),
    rem(2040),
    lagu(2050), lagu(2060),
    { baris: 2070, jalan: function (m) { m.kembali(); } },

    /* --- 2080-2340: nama pemain dan petunjuk ------------------------------- */
    { baris: 2080, jalan: function (m) {
        m.cls(); m.warna(15, 0); m.locate(6, 15);
        m.cetak('(Enter Your Name And Then Strike The Enter Key)');
        m.barisBaru();
      } },
    { baris: 2090, jalan: function (m) {
        m.locate(4, 20); m.cetak('What Is Your First Name Captain? ');
      } },
    { baris: 2100, bagian: [
        function (m) { m.gosub(3070); },
        function (m) { m.v['CAPT$'] = m.v.ZA; m.warna(3, 0); }
      ] },
    { baris: 2110, jalan: function (m) {
        if (m.v['CAPT$'].length < 2) m.v['CAPT$'] = '';
      } },
    { baris: 2120, jalan: function (m) {
        m.cls(); m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 2130, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1); m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 2140, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 2150, jalan: function (m) {
        m.warna(15, 0); m.locate(4, 30);
        m.cetak('S E A   B A T T L E'); m.barisBaru();
      } },
    { baris: 2160, jalan: function (m) {
        m.locate(10, 25);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 2170, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2170);
      } },
    { baris: 2180, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') m.kembali();
      } },
    { baris: 2190, jalan: function (m) {
        if (m.v.Z !== 'Y' && m.v.Z !== 'y') m.lompat(2170);
      } },
    ajar(2200,  6, 11, "You're the C.O. on a destroyer.  You've played cat and mouse"),
    ajar(2210,  7, 11, "with the enemy sub for two days now.  It's time to do battle."),
    ajar(2220,  8, 10, ''),
    ajar(2230,  9, 11, "He's somewhere in the depths below.   To fire a depth charge,"),
    ajar(2240, 10, 11, 'first select a level  1,  2, or  3; then select the quadrant'),
    ajar(2250, 11, 11, 'A  thru  X.  If your depth charge damages the sub, the space'),
    ajar(2260, 12, 11, 'will be replaced with a  flashing  star.   Remember, the sub'),
    ajar(2270, 13, 11, 'is THREE quadrants in length.  It can be alligned diagonally,'),
    ajar(2280, 14, 11, 'horizontally,  or  vertically.  The sub will be on one level.'),
    ajar(2290, 16, 11, 'It takes three  hits to sink either ship.  You will be given'),
    ajar(2300, 17, 11, 'three depth charges for each  torpedo  fired  by  your enemy.'),
    ajar(2310, 19, 11, 'Your ability to find and destroy the sub will determine your'),
    ajar(2320, 20, 11, 'next  assignment,  an  aircraft  carrier or a  garbage barge.'),
    { baris: 2330, jalan: function (m) {
        m.locate(25, 27); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue'); m.warna(3, 0);
      } },
    { baris: 2340, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2340); else m.kembali();
      } },

    /* --- 2360-2580: torpedo musuh ----------------------------------------- */
    rem(2350),
    { baris: 2360, jalan: function (m) {
        var t = [2370, 2380, 2390][3 - (m.v.HIT || 0) - 1];
        if (t) m.lompat(t);
      } },
    rusak(2370, 12, 35), rusak(2380, 12, 42),
    rem(2390),
    { baris: 2400, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 3; m.v.A++) {
          for (m.v.E = 820; m.v.E <= 1000; m.v.E += 1.5) m.suara(m.v.E, 0.1);
          m.suara(50, 0);
        }
      } },
    { baris: 2410, jalan: function (m) { m.untuk('A', 22, 13, -1, 2460); } },
    { baris: 2420, jalan: function (m) {
        m.locate(m.v.A, 39); m.cetak(m.chr(221)); m.barisBaru();
      } },
    { baris: 2430, jalan: function (m) {
        for (m.v.B = 1; m.v.B <= 300; m.v.B++) { /* jeda */ }
      } },
    { baris: 2440, jalan: function (m) {
        m.locate(m.v.A, 39); m.cetak(' '); m.barisBaru();
      } },
    { baris: 2450, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2460, jalan: function (m) { m.locate(25, 25); } },
    { baris: 2470, jalan: function (m) {
        if (m.v.MISS) {
          m.cetak('Torpedo Missed Captain ' + m.v['CAPT$']);
          m.lompat(2580);
        }
      } },
    { baris: 2480, jalan: function (m) {
        m.cetak('A Torpedo Broadside Captain ' + m.v['CAPT$']);
      } },
    { baris: 2490, jalan: function () { } },
    { baris: 2500, jalan: function () { } },
    { baris: 2510, jalan: function (m) {
        m.v.E = 248; m.v.A = 1674;
        m.pokeLayar(1674 - 162, 248); m.pokeLayar(1674 - 150, 248);
        for (m.v.A1 = 1; m.v.A1 <= 100; m.v.A1++) { /* jeda */ }
      } },
    ledak(2520, [-10, -328]), ledak(2530, [0]), ledak(2540, [12]),
    ledak(2550, [-4]), ledak(2560, [8]),
    { baris: 2570, jalan: function (m) {
        m.pokeLayar(m.v.A - 168, m.v.E); m.pokeLayar(m.v.A - 484, m.v.E);
        for (m.v.A1 = 1; m.v.A1 <= 100; m.v.A1++) { /* jeda */ }
      } },
    { baris: 2580, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 3000; m.v.A++) { /* jeda */ }
        m.kembali();
      } },

    /* --- 2590-2620: larik dan isinya --------------------------------------- */
    { baris: 2590, jalan: function (m) {
        m.dim('A_', 71); m.dim('B_', 23); m.dim('SUB', 3);
      } },
    /* 2600 tiga tingkat berbagi huruf yang sama: A(0..23) diisi kode ASCII
       'A'..'X', lalu disalin apa adanya ke A(24..47) dan A(48..71). Satu
       larik 72 petak, tiga tingkat, dan nomor petaknya sendiri yang memuat
       tingkatnya. */
    { baris: 2600, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 23; m.v.A++) {
          m.v.A_[m.v.A] = m.v.A + 65;
          m.v.A_[m.v.A + 24] = m.v.A_[m.v.A];
          m.v.A_[m.v.A + 48] = m.v.A_[m.v.A];
        }
      } },
    { baris: 2610, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 23; m.v.A++) m.v.B_[m.v.A] = m.baca();
      } },
    { baris: 2620, jalan: function (m) { m.kembali(); } },

    rem(2630),
    lagu(2640), lagu(2650), lagu(2660), lagu(2670), lagu(2680),
    { baris: 2690, jalan: function (m) { m.kembali(); } },
    rem(2700),
    lagu(2710), lagu(2720), lagu(2730), lagu(2740), lagu(2750),
    { baris: 2760, jalan: function (m) { m.kembali(); } },

    /* --- 2770-2950: akhir permainan --------------------------------------- */
    { baris: 2770, jalan: function (m) { m.cls(); m.warna(15, 0); } },
    { baris: 2780, jalan: function (m) { if (m.v.HIT === 3) m.lompat(2830); } },
    { baris: 2790, jalan: function (m) {
        m.locate(10, 30);
        m.cetak('Congratulations Captain ' + m.v['CAPT$']); m.barisBaru();
      } },
    ajar(2800, 12, 30, "You've Accomplished Your Mission"),
    { baris: 2810, jalan: function (m) {
        m.locate(13, 30);
        m.cetak('And Used Only' + angka(m.v.TRY || 0) + 'Depth Charges');
        m.barisBaru();
      } },
    { baris: 2820, jalan: function (m) {
        m.locate(14, 30);
        m.cetak('Your Promotion Is On The Way!!!!'); m.barisBaru();
        m.lompat(2870);
      } },
    { baris: 2830, jalan: function (m) {
        m.locate(10, 28);
        m.cetak('We Are Very Sorry Captain ' + m.v['CAPT$']); m.barisBaru();
      } },
    ajar(2840, 12, 28, 'Your Ship Was Lost  And Crew Killed!'),
    ajar(2850, 13, 28, 'You Should Be  Court-Marshalled For   '),
    ajar(2860, 14, 28, 'Your Poor Judgement And Performance'),
    { baris: 2870, jalan: function (m) {
        m.locate(16, 28);
        m.cetak('Would You Like To Play Again? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 2880, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2880);
      } },
    { baris: 2890, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') m.jalankan('MENU');
      } },
    { baris: 2900, jalan: function (m) {
        if (m.v.Z !== 'Y' && m.v.Z !== 'y') m.lompat(2880);
      } },
    { baris: 2910, bagian: [
        function (m) { m.v = {}; m.v.JAM = 23; },
        function (m) { m.gosub(30); },
        function (m) { m.gosub(2590); }
      ] },
    /* 2919 nomor baris yang ganjil sendiri — disisipkan belakangan di antara
       2910 dan 2920, dan menyalin baris 2080 kata demi kata. */
    { baris: 2919, jalan: function (m) {
        m.cls(); m.warna(15, 0); m.locate(6, 15);
        m.cetak('(Enter Your Name And Then Strike The Enter Key)');
        m.barisBaru();
      } },
    { baris: 2920, jalan: function (m) {
        m.locate(4, 20); m.cetak('What Is Your First Name Captain? ');
      } },
    { baris: 2930, bagian: [
        function (m) { m.gosub(3070); },
        function (m) { m.v['CAPT$'] = m.v.ZA; m.warna(3, 0); }
      ] },
    { baris: 2940, jalan: function (m) {
        if (m.v['CAPT$'].length < 2) m.v['CAPT$'] = '';
      } },
    { baris: 2950, bagian: [
        function (m) { m.gosub(430); },
        function (m) { m.lompat(160); }
      ] },

    /* --- 2960-3060: F10, dan ekornya yang dipakai ulang -------------------- */
    { baris: 2960, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XX = m.barisKursor(); m.v.YY = m.pos();
        m.locate(25, 1); m.spc(78);
      } },
    { baris: 2970, jalan: function (m) {
        m.locate(25, 20);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
      } },
    { baris: 2980, jalan: function (m) { if (m.inkey() !== '') m.lompat(2980); } },
    { baris: 2990, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2990);
      } },
    { baris: 3000, jalan: function (m) {
        if (m.v.Z === 'Y' || m.v.Z === 'y') m.jalankan('MENU');
      } },
    { baris: 3010, jalan: function (m) {
        if (m.v.Z !== 'N' && m.v.Z !== 'n') m.lompat(2990);
      } },
    { baris: 3020, jalan: function (m) {
        m.locate(25, 1); m.spc(78);
        m.locate(25, 22); m.warna(0, 15);
      } },
    { baris: 3030, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Game '); m.warna(3, 0);
      } },
    /* 3040 `IF XX=<1` — tanda kurang-atau-sama ditulis terbalik. GW-BASIC
       menerima keduanya, jadi tidak pernah ketahuan. */
    { baris: 3040, jalan: function (m) {
        if ((m.v.XX || 0) <= 1 || (m.v.YY || 0) < 1) m.lompat(3060);
      } },
    { baris: 3050, jalan: function (m) { m.locate(m.v.XX, m.v.YY); } },
    { baris: 3060, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },

    /* --- 3070-3160: penyunting nama, sama persis dengan DRAW.BAS ----------- */
    { baris: 3070, jalan: function (m) {
        m.v.ZH = '';
        if (m.inkey() !== '') m.lompat(3070);
      } },
    { baris: 3080, jalan: function (m) {
        m.v.ZI = m.inkey();
        if (m.v.ZI === '') m.lompat(3080);
      } },
    { baris: 3090, jalan: function (m) {
        if (m.v.ZI === m.chr(13)) {
          m.v.ZA = ((m.v.ZH || '') + '        ').slice(0, 8);
          m.kembali();
        }
      } },
    { baris: 3100, jalan: function (m) {
        if (m.v.ZI === m.chr(8)) m.lompat(3160);
      } },
    { baris: 3110, jalan: function (m) {
        if (m.v.ZI.length > 1) {
          m.lompat(m.v.ZI.slice(-1) === m.chr(75) ? 3160 : 3080);
        }
      } },
    { baris: 3120, jalan: function (m) {
        if ((m.v.ZH || '').length > 7) m.lompat(3080);
      } },
    { baris: 3130, jalan: function (m) {
        if (m.v.ZI < 'a' || m.v.ZI > 'z') m.lompat(3150);
      } },
    { baris: 3140, jalan: function (m) {
        m.v.ZI = m.chr(m.v.ZI.charCodeAt(0) - 32);
      } },
    { baris: 3150, jalan: function (m) {
        m.v.ZH = (m.v.ZH || '') + m.v.ZI; m.cetak(m.v.ZI); m.lompat(3080);
      } },
    /* 3160 tidak menguji panjangnya lebih dulu — DRAW.BAS punya baris 1870
       untuk itu, di sini tidak ada. Menekan Backspace di awal membuat
       namanya jadi string kosong yang dipotong sampai -1 aksara; BASIC
       melempar galat 5. */
    { baris: 3160, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        var s = m.v.ZH || '';
        if (s.length < 1) { m.galat(5, 'Illegal function call'); return; }
        m.v.ZH = s.slice(0, s.length - 1);
        m.lompat(3080);
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }
  function data(nomor) { return { baris: nomor, jalan: function () { } }; }
  function lagu(nomor) { return { baris: nomor, jalan: function (m) { m.mainkan(''); } }; }

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }
  function bulat(n) { return Math.max(1, Math.min(25, Math.round(n))); }

  function trap(nomor, tombol) {
    return { baris: nomor, jalan: function (m) { m.pasangJebakan(tombol, 2010); } };
  }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function kena(nomor, n) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.DROP === m.v.SUB[n]) {
        m.v.A_[m.v.DROP] = 15; m.v.SUB[n] = 99; m.lompat(230);
      }
    } };
  }

  /* Satu arah kapal selam: petak kedua dan ketiga digeser +d dan -d. */
  function arah(nomor, d) {
    return { baris: nomor, jalan: function (m) {
      m.v.B = m.v.A + d; m.v.C = m.v.A - d; m.lompat(560);
    } };
  }

  function huruf(nomor, awal, dari, sampai) {
    return { baris: nomor, bagian: [
      function (m) { m.v.B = awal; m.untuk('A', dari, sampai, 20, nomor + 10); },
      function (m) { m.gosub(630); },
      function (m) { m.lanjutkan('A'); }
    ] };
  }

  /* Satu baris petak: aksaranya dipoke, dan kalau nilainya 15 (kena) bita
     atributnya ikut dipoke jadi 132 — merah berkedip. */
  function petak(nomor, geser, tambah) {
    return { baris: nomor, jalan: function (m) {
      var nilai = m.v.A_[m.v.B + tambah];
      m.pokeLayar(m.v.A + geser, nilai);
      if (nilai === 15) m.pokeLayar(m.v.A + geser + 1, 132);
    } };
  }

  function rusak(nomor, b, k) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(m.ulang(3, 220)); m.barisBaru();
    } };
  }

  function ledak(nomor, geser) {
    return { baris: nomor, jalan: function (m) {
      m.suara(50, 0.001);
      for (var i = 0; i < geser.length; i++) {
        m.pokeLayar(m.v.A + geser[i], m.v.E);
      }
      m.suara(50, 0);
      for (m.v.A1 = 1; m.v.A1 <= 100; m.v.A1++) { /* jeda */ }
    } };
  }

  function poke(nomor, pasangan, pulang) {
    return { baris: nomor, jalan: function (m) {
      for (var i = 0; i < pasangan.length; i++) {
        m.pokeLayar(pasangan[i][0], pasangan[i][1]);
      }
      if (pulang) m.kembali();
    } };
  }

  function setPoke(nomor, dasar, pasangan, pulang) {
    return { baris: nomor, jalan: function (m) {
      m.v.A = dasar;
      for (var i = 0; i < pasangan.length; i++) {
        m.pokeLayar(dasar + pasangan[i][0], pasangan[i][1]);
      }
      if (pulang) m.kembali();
    } };
  }

  function lanjutPoke(nomor, pasangan, pulang) {
    return { baris: nomor, jalan: function (m) {
      for (var i = 0; i < pasangan.length; i++) {
        m.pokeLayar(m.v.A + pasangan[i][0], pasangan[i][1]);
      }
      if (pulang) m.kembali();
    } };
  }

  function deretPoke(nomor, dari, sampai, langkah, pasangan, pulang) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.A = dari; m.v.A <= sampai; m.v.A += langkah) {
        for (var i = 0; i < pasangan.length; i++) {
          m.pokeLayar(m.v.A + pasangan[i][0], pasangan[i][1]);
        }
      }
      if (pulang) m.kembali();
    } };
  }

  /* `RIGHT$(TIME$,2)` — jam yang maju tetap, seperti CRAPS.BAS. */
  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['SUB'] = {
    nama: 'SUB',
    judul: 'Sea Battle',
    sumber: 'SUB',
    berkas: 'run/SUB.BAS',
    tabel: tabel,
    benih: 11,
    /* Dua puluh empat sudut lempar, satu per petak. Yang negatif melengkung
       ke kiri, yang positif ke kanan, dan yang besar terbang lebih tinggi. */
    data: [
      -1.85, -1.1, -0.3, 0.45, 1.2, 2, -2.00, -1.2, -0.5, 0.3, 1.1, 1.85,
      -2.15, -1.4, -0.6, 0.15, 0.9, 1.7, -2.3, -1.55, -0.8, 0, 0.8, 1.55
    ],

    arsitektur: {
      judul: 'Alur SUB.BAS',
      simpul: [
        { id: 'siap', baris: '150-170', jenis: 'mulai',
          teks: ['Nama kapten, petunjuk,', 'lagu Anchors Aweigh'] },
        { id: 'sembunyi', baris: '430-560',
          teks: ['Taruh kapal selam:', 'satu petak + satu dari delapan arah'] },
        { id: 'peta', baris: '930-1340',
          teks: ['Gambar peta laut', 'dan huruf tiap petak'] },
        { id: 'tanya', baris: '300-410', jenis: 'putusan',
          teks: ['Tingkat 1-3,', 'lalu petak A-X'] },
        { id: 'bom', baris: '710-910',
          teks: ['Bom melengkung dengan COS,', 'lalu tenggelam'] },
        { id: 'uji', baris: '200-230', jenis: 'putusan',
          teks: ['Kena salah satu dari', 'tiga petak kapal selam?'] },
        { id: 'menang', baris: '2710-2760', jenis: 'keluar',
          teks: ['Ketiganya kena:', 'Battle Hymn of the Republic'] },
        { id: 'torpedo', baris: '2360-2580', jenis: 'galat',
          teks: ['Tiap tiga bom, musuh', 'menembak balik'] },
        { id: 'kalah', baris: '2640-2690', jenis: 'galat',
          teks: ['Tiga kali kena:', 'lagu Taps'] }
      ],
      panah: [
        { dari: 'siap', ke: 'sembunyi' },
        { dari: 'sembunyi', ke: 'peta' },
        { dari: 'peta', ke: 'tanya' },
        { dari: 'tanya', ke: 'bom' },
        { dari: 'bom', ke: 'uji' },
        { dari: 'uji', ke: 'menang', label: 'ketiganya kena' },
        { dari: 'uji', ke: 'tanya', label: 'bom ke-2 dan ke-3' },
        { dari: 'uji', ke: 'torpedo', label: 'sesudah tiga bom' },
        { dari: 'torpedo', ke: 'kalah', label: 'kena tiga kali', jenis: 'galat' },
        { dari: 'torpedo', ke: 'peta', label: 'ronde berikutnya', jenis: 'galat' }
      ]
    },

    pseudokode: [
      { baris: 2600, tingkat: 0, teks: 'satu larik 72 petak = <b>3 tingkat &times; 24 petak</b>, huruf A&ndash;X berulang' },
      { baris: 2610, tingkat: 0, teks: 'baca 24 sudut lempar dari DATA &mdash; satu per petak' },
      { baris: 440, tingkat: 0, teks: 'taruh kapal selam di petak <b>tengah</b> papan (supaya ketiga petaknya muat)' },
      { baris: 470, tingkat: 0, teks: 'undi satu dari <b>delapan</b> arah &mdash; mendatar, tegak, atau diagonal' },
      { baris: 180, tingkat: 0, teks: '<b>ULANG:</b> gambar peta, lalu tiga bom' },
      { baris: 330, tingkat: 1, teks: 'tanya tingkat 1&ndash;3 dan petak A&ndash;X' },
      { baris: 380, tingkat: 1, teks: '<code>DROP = tingkat&times;24 + huruf</code> &mdash; <b>satu angka memuat keduanya</b>' },
      { baris: 780, tingkat: 1, teks: 'terbangkan bom: <code>COS(sudut) &times; (3+|lempar|) + 6</code>' },
      { baris: 800, tingkat: 2, teks: '<b>baca dulu</b> apa yang ada di layar situ&hellip;' },
      { baris: 820, tingkat: 2, teks: '&hellip;lalu <b>kembalikan</b> sesudah bomnya lewat' },
      { baris: 200, tingkat: 1, teks: 'kena? tandai petaknya 15 dan nomornya jadi 99' },
      { baris: 230, tingkat: 1, teks: '<code>SUB(1)=SUB(2)</code> cuma benar kalau <b>keduanya sudah 99</b>' },
      { baris: 260, tingkat: 1, teks: 'sesudah tiga bom: musuh menembak, lempar koin meleset atau kena' },
      { baris: 280, tingkat: 1, teks: 'tiga kali kena &rarr; kapal tenggelam' }
    ],

    perintahAsli: 'run\\SUB.bat',
    catatanAsli: 'Di DOSBox-X program ini bernyanyi tiga kali: Anchors Aweigh ' +
      'saat mulai, Taps kalau kalah, dan Battle Hymn of the Republic kalau menang.',

    penyimpangan: [
      '<b><code>A(71)</code> jadi <code>A_</code> dan <code>B(23)</code> jadi ' +
      '<code>B_</code></b>: keduanya punya kembaran skalar (<code>A</code> ' +
      'pencacah gelung sekaligus nomor tingkat, <code>B</code> pencacah ' +
      'sekaligus sudut lempar).',

      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Tiga lagu utuh ' +
      'tidak terdengar: "Anchors Aweigh" (2050), "Taps" (2640), dan "Battle ' +
      'Hymn of the Republic" (2710) &mdash; yang terakhir REM-nya salah ketik ' +
      'jadi "REPUPLIC", persis seperti di MAZE.BAS.',

      '<b>Atribut 132 tidak berkedip.</b> Petak yang kena seharusnya bintang ' +
      'merah <b>berkedip</b> (baris 630); di penelusur merahnya tetap.',

      '<b><code>PEEK</code> dan <code>DEF SEG</code> tidak berarti apa-apa</b>, ' +
      'jadi alamat <code>POKE</code>-nya selalu relatif terhadap awal RAM layar.',

      '<b>Batas gelung di baris 850 memakai <code>L</code> yang baru saja ' +
      'diubah.</b> <code>FOR L=L+2 TO ...L...</code>: apakah batasnya dihitung ' +
      'dengan L lama atau L baru menentukan bomnya tenggelam dua atau empat ' +
      'baris. Penelusur memakai L yang <b>baru</b>. Belum diperiksa di ' +
      'GW-BASIC sungguhan.',

      '<b>Pengacaknya berbenih tetap</b>, jadi letak kapal selamnya selalu ' +
      'sama tiap penelusuran.'
    ],

    pelajaran: {
      ringkas: 'Berburu kapal selam. Yang layak dipelajari: bom yang terbang ' +
        'melengkung dengan kosinus, dan trik "simpan-di-bawah" yang membuat ' +
        'bomnya tidak merusak gambar yang dilewatinya.',
      pelajari: [
        ['Simpan-di-bawah: nenek moyang setiap sprite',
         'Sebelum menggambar bom di suatu tempat, baris 800 <b>membaca</b> ' +
         'apa yang sudah ada di situ dengan <code>SCREEN(x,y)</code> dan ' +
         '<code>SCREEN(x,y,1)</code> &mdash; aksaranya dan warnanya. Sesudah ' +
         'bomnya lewat, baris 820 memoke keduanya kembali. Latar belakangnya ' +
         'utuh tanpa perlu digambar ulang, dan itulah cara semua sprite ' +
         'bekerja sebelum ada perangkat keras yang mengerjakannya.'],
        ['Lengkungan dari satu kosinus',
         'Baris 780: <code>L=COS(E)*(3+ABS(B))+6</code> dengan <code>E</code> ' +
         'dari 1,5 sampai 4,76 radian &mdash; setengah gelombang kosinus, naik ' +
         'lalu turun. Amplitudonya <code>3+|B|</code>, dan <code>B</code> ' +
         'diambil dari tabel sudut per petak. <b>Petak yang jauh dilempar ' +
         'lebih tinggi</b>, tanpa satu pun rumus fisika.'],
        ['Satu angka yang memuat dua hal',
         '<code>DROP = tingkat&times;24 + huruf</code>, jadi 0..71. Larik ' +
         '<code>A()</code> panjangnya 72 dan tiap petak di seluruh tiga ' +
         'tingkat punya satu nomor sendiri. Tidak perlu larik dua dimensi, ' +
         'dan tidak perlu membawa nomor tingkat ke mana-mana.'],
        ['Satu perbandingan menggantikan dua',
         'Baris 230: <code>IF SUB(1)=SUB(2) AND SUB(3)=99</code>. Petak yang ' +
         'kena diberi nilai 99, dan dua petak berbeda tidak mungkin sama ' +
         '&mdash; kecuali kalau <b>keduanya sudah 99</b>. Jadi satu ' +
         'perbandingan sudah cukup menguji dua petak sekaligus.'],
        ['Memanggil separuh penangan jebakan',
         'Baris 1340 <code>GOSUB 3020</code>. Baris 3020 ada di tengah ' +
         'penangan tombol F10 &mdash; bagian yang menggambar ulang bilah ' +
         'status. Satu subrutin, dua pintu masuk: satu lewat jebakan, satu ' +
         'lewat GOSUB langsung ke ekornya.']
      ],
      hindari: [
        ['Backspace yang tidak menguji panjang',
         'Baris 3160 memotong <code>ZH</code> satu aksara tanpa memastikan ' +
         'ada isinya. DRAW.BAS punya baris 1870 untuk itu; di sini tidak ada. ' +
         'Menekan Backspace sebelum mengetik apa pun berarti ' +
         '<code>LEFT$("",-1)</code> &mdash; galat 5. <b>Kode yang sama, ' +
         'disalin, dengan satu barisnya hilang.</b>'],
        ['Baris yang disisipkan dengan nomor ganjil',
         '<code>2919</code>, di antara 2910 dan 2920 &mdash; tanda perbaikan ' +
         'yang ditempel belakangan. Isinya salinan kata-demi-kata baris 2080.'],
        ['Tanda banding yang ditulis terbalik',
         'Baris 3040: <code>IF XX=&lt;1</code>. GW-BASIC menerima ' +
         '<code>=&lt;</code> sama seperti <code>&lt;=</code>, jadi tidak ' +
         'pernah ketahuan.'],
        ['Gelung yang batasnya memakai variabelnya sendiri',
         'Baris 850: <code>FOR L=L+2 TO AA*2+FIX(DROP/6)+L-AA+2</code>. ' +
         'Apakah <code>L</code> di batasnya yang lama atau yang baru ' +
         'bergantung pada urutan penilaian penafsirnya &mdash; dan itu ' +
         'menentukan bomnya tenggelam dua atau empat baris.'],
        ['Salah ketik yang menular',
         '<code>REM******* BATTLE HYMN OF THE REPUPLIC</code> di baris 2700 ' +
         '&mdash; salah ketik yang sama persis muncul lagi di MAZE.BAS baris ' +
         '3010. Berkas disalin, komentarnya ikut.']
      ]
    },

    penjelasan: [
      { judul: 'Menggambar di atas gambar tanpa merusaknya',
        isi: [
          'Bom lautnya terbang melintasi peta &mdash; laut, kapal, garis ' +
          'petak, huruf. Kalau ia sekadar mencetak dirinya lalu mencetak ' +
          'spasi, jejaknya akan berupa lubang-lubang kosong di gambar.',
          'Yang dilakukannya, baris 800:',
          '<code>800 V=SCREEN(X,Y):W=SCREEN(X,Y,1)</code>',
          '<code>SCREEN(x,y)</code> membaca <b>kode aksara</b> yang ada di ' +
          'kotak itu; dengan argumen ketiga 1, ia membaca <b>bita ' +
          'atributnya</b> &mdash; warna depan dan latar. Dua angka, dan itulah ' +
          'seluruh isi kotak tersebut.',
          'Lalu bomnya dicetak, dan sesudahnya, baris 820:',
          '<code>820 POKE (X-1)*160+Y*2-1,W:POKE (X-1)*160+Y*2-2,V</code>',
          'Dikembalikan persis seperti semula. Perhatikan rumus alamatnya: ' +
          'satu baris layar 160 bita, satu kolom 2 bita, dan ' +
          '<code>-2</code> untuk bita aksara, <code>-1</code> untuk bita ' +
          'warnanya.',
          'Teknik ini punya nama: <b>simpan-di-bawah</b>. Ia dipakai di setiap ' +
          'permainan yang punya benda bergerak, sebelum perangkat keras ' +
          'mengambil alih pekerjaannya.'
        ] },
      { judul: 'Bom yang tahu ke mana ia dilempar',
        isi: [
          'Bomnya tidak jatuh lurus. Ia melengkung, dan lengkungannya ' +
          'berbeda-beda tergantung petak mana yang dituju.',
          'Seluruh mekanismenya tiga baris:',
          '<code>740 B=B(ABS(A-DROP))</code> &mdash; ambil sudut lempar ' +
          'petak itu<br>' +
          '<code>770 FOR E=1.5 TO 4.76 STEP 0.25</code><br>' +
          '<code>780 L=COS(E)*(3+ABS(B))+6</code>',
          'Kosinus dari 1,5 sampai 4,76 radian melewati satu setengah ' +
          'gelombang: mulai hampir nol, turun ke &minus;1, naik lagi. ' +
          'Dikalikan amplitudo dan digeser 6, hasilnya <b>lintasan lempar</b> ' +
          'dalam nomor baris layar.',
          'Sementara itu baris 830 menggeser kolomnya: <code>C=C+B</code>. ' +
          'Jadi <code>B</code> mengerjakan dua hal sekaligus &mdash; ' +
          '<b>seberapa jauh mendatar</b> dan <b>seberapa tinggi</b>.',
          'Dan angka-angkanya sendiri, di baris 2020-2030, disusun rapi: enam ' +
          'angka per baris petak, dari &minus;1,85 (jauh di kiri) sampai +2 ' +
          '(jauh di kanan), dan makin bawah barisnya makin besar rentangnya. ' +
          'Dua puluh empat angka yang menggantikan seluruh perhitungan ' +
          'lintasan.'
        ] },
      { judul: 'Satu larik untuk tiga tingkat',
        isi: [
          'Papan permainannya tiga tingkat, tiap tingkat 24 petak berhuruf A ' +
          'sampai X. Cara wajar: larik dua dimensi <code>A(3,24)</code>.',
          'Yang dipakai: <b>satu</b> larik 72 petak.',
          '<code>2600 FOR A=0 TO 23:A(A)=A+65:A(A+24)=A(A):A(A+48)=A(A):NEXT</code>',
          'Kode ASCII "A" sampai "X" diisi tiga kali berturut-turut. Dan ' +
          'nomor petaknya:',
          '<code>380 DROP=A+ASC(Z)-65</code> dengan <code>A=24*(tingkat-1)</code>',
          'Jadi <code>DROP</code> 0..23 tingkat satu, 24..47 tingkat dua, ' +
          '48..71 tingkat tiga. <b>Satu angka yang memuat tingkat dan ' +
          'petaknya sekaligus.</b>',
          'Keuntungannya terlihat di baris 200-220: menguji apakah bom kena ' +
          'kapal selam cukup satu perbandingan angka, tanpa perlu ' +
          'membandingkan tingkat dan petak terpisah. Dan menyembunyikan ' +
          'kapalnya (baris 450) cukup <code>A=A+FIX(RND*3)*24</code> &mdash; ' +
          'geser satu tingkat penuh dengan satu penjumlahan.',
          'Harganya: kalau kapalnya diletakkan di tepi papan, arah yang salah ' +
          'akan membuatnya "membungkus" ke tingkat sebelah tanpa ada yang ' +
          'mengeluh. Itu sebabnya baris 440 memaksa petak awalnya berada di ' +
          'tengah &mdash; bukan karena aturan permainan, melainkan karena ' +
          'bentuk lariknya.'
        ] }
    ]
  };
})(window);
