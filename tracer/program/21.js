/* ===========================================================================
   21.js — porting minimalis 21.BAS sebagai tabel baris.

   Program kesembilan belas: Blackjack. Kartu digambar sebagai kotak 11x7 dan
   isinya dibaca dari tabel — lima baris teks untuk tiap nilai kartu.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) KARTU TERTUTUP ADALAH KARTU NOMOR NOL. Baris 160 menyimpan nomor kartu
       bandar di `HOLD`, lalu MENGISI `CD` DENGAN NOL. Karena `LIN$(*,0)` berisi
       "XXXXXXXXX", kartunya tergambar tertutup. Dan waktu tiba saatnya
       membuka, baris 560 cukup `SWAP CD,HOLD` — kartunya digambar ulang di
       tempat yang sama, kali ini terbuka. Tidak ada bendera "tertutup" di
       mana pun.

   (2) MENGOCOK DENGAN MENOLAK. Baris 2130-2150 melempar tempat acak di dek,
       dan kalau tempat itu sudah terisi, melempar lagi. Sederhana, benar, dan
       makin lambat menjelang akhir.

   (3) BARIS 2700-2890 TIDAK PERNAH DIPANGGIL SIAPA PUN. Isinya penggambar
       tumpukan keping taruhan — disalin utuh dari CRAPS.BAS, lengkap dengan
       variabel `P` yang di program ini tidak pernah ada.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `HOLD` adalah skalar DAN larik di program ini. Lariknya jadi `HOLD_`.
   - `SOUND` diam, jadi bunyi kartu dibagikan (baris 2310) tidak terdengar.
   - `COLOR 31` di baris 3350 tidak berkedip.
   - Pengacaknya berbenih tetap, jadi urutan kartunya selalu sama.
   - Kelima gelung tunda habis seketika.
   =========================================================================== */

(function (global) {
  'use strict';

  var UANG = '$$#,###.##';

  var tabel = [

    { baris: 10, jalan: function (m) { m.locate(null, null, 0); } },
    { baris: 20, bagian: [
        function (m) {
          for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
            m.pasangJebakan(m.v.A, 30); m.jebakan(m.v.A, true);
          }
        },
        function (m) { m.lompat(40); }
      ] },
    { baris: 30, jalan: function (m) { m.kembali(); } },
    { baris: 40, jalan: function (m) { m.pasangJebakan(10, 2900); m.jebakan(10, true); } },
    { baris: 50, jalan: function (m) {
        m.dim('DK', 52); m.dim('CDSU', 52); m.dim('LIN$', 5, 13);
        /* Larik yang tidak pernah di-DIM: BASIC membuatnya sendiri
           berbatas 10 begitu disentuh. */
        m.dim('SU$', 10); m.dim('CP', 10); m.dim('PYR', 10); m.dim('HOLD_', 10);
      } },
    { baris: 60, bagian: [
        function (m) { m.v.XX = 1; m.v.YY = 1; },
        function (m) { m.gosub(2430); },   /* baca gambar kartu */
        function (m) { m.gosub(3000); }    /* judul + petunjuk  */
      ] },
    { baris: 70, bagian: [
        function (m) { m.gosub(2070); },   /* kocok dek         */
        function (m) { m.v['M$'] = UANG; m.v.CSH = 2000; }
      ] },
    { baris: 80, jalan: function (m) {
        if (m.v.CSH <= 0 && m.v.PS !== 1) m.lompat(3300);
      } },
    { baris: 90, jalan: function (m) { if (m.v.CSH > 10000) m.lompat(3340); } },
    { baris: 100, bagian: [
        function (m) { m.gosub(2690); },   /* bersihkan meja    */
        function (m) { m.gosub(3260); },   /* tulis uang        */
        function (m) { m.gosub(2940); },   /* bilah F10         */
        function (m) { m.v.TS = 0; m.v.HOLD = 0; },
        function (m) { m.gosub(2620); }    /* tumpukan keping   */
      ] },
    { baris: 110, jalan: function (m) {
        m.locate(24, 1); m.spc(66); m.locate(24, 20);
      } },
    { baris: 120, jalan: function (m) {
        m.locate(23, 1); m.spc(62); m.barisBaru();
      } },
    /* 130 "push" ronde lalu berarti taruhannya tidak ditarik: langsung
       lanjut tanpa bertanya lagi. */
    { baris: 130, jalan: function (m) {
        if (m.v.PS) {
          m.v.PS = 0;
          m.locate(23, 33); m.cetak('The Bet Stands');
          m.warna(15, 0); m.locate(6, 69); m.cetakFormat(UANG, m.v.BT * 100);
          m.warna(3, 0); m.lompat(150);
        }
      } },
    { baris: 140, jalan: function (m) { m.gosub(1050); } },
    /* 150 dek dikocok ulang sesudah 40 kartu — dua belas kartu terakhir
       tidak pernah dipakai. */
    { baris: 150, bagian: [
        function (m) { m.v.CD = m.v.CD + 1; },
        function (m) { if (m.v.CD > 40) m.gosub(2070); },
        function (m) { if (m.v.CD > 40) m.lompat(150); }
      ] },
    /* 160 KARTU TERTUTUP: nomor kartunya disimpan di HOLD, lalu CD diisi
       NOL. LIN$(*,0) berisi "XXXXXXXXX" — jadi yang tergambar punggung
       kartunya. Tidak ada bendera "tertutup" di mana pun. */
    { baris: 160, bagian: [
        function (m) {
          m.v.A = 1; m.v.B = 1; m.v.CP[1] = m.v.DK[m.v.CD];
          m.v.HOLD = m.v.CD; m.v.CD = 0;
        },
        function (m) { m.gosub(2220); },
        function (m) { m.v.CD = m.v.HOLD; }
      ] },
    bagi(170, 8, 1, 'PYR', 1),
    bagi(180, 1, 12, 'CP', 2),
    bagi(190, 8, 12, 'PYR', 2),
    sepuluh(200, 'PYR', 1), sepuluh(210, 'CP', 1), sepuluh(220, 'CP', 2),
    { baris: 230, jalan: function (m) {
        if (m.v.CP[1] === 10 && m.v.CP[2] === 1) { m.v.BJK1 = 1; m.lompat(710); }
      } },
    { baris: 240, jalan: function (m) {
        if (m.v.CP[2] === 10 && m.v.CP[1] === 1) { m.v.BJK1 = 1; m.lompat(710); }
      } },
    sepuluh(250, 'PYR', 2),
    { baris: 260, jalan: function (m) {
        if (m.v.PYR[1] !== m.v.PYR[2] || m.v.SPF1) m.lompat(300);
      } },
    { baris: 270, jalan: function (m) {
        m.warna(15, 0); m.locate(24, 22);
        m.cetak('Do You Wish To Split Your Hand? <Y/N>');
      } },
    { baris: 280, bagian: [
        function (m) { m.warna(3, 0); m.gosub(1870); },
        function (m) { if (m.v.NO) m.lompat(300); }
      ] },
    { baris: 290, bagian: [
        function (m) { m.gosub(1420); },
        function (m) { m.lompat(m.v.NSP ? 300 : 190); }
      ] },
    { baris: 300, bagian: [
        function (m) { m.v.NSP = 0; },
        function (m) { m.gosub(2000); },
        function (m) { if (m.v.PS) m.lompat(710); }
      ] },
    { baris: 310, jalan: function (m) { if (m.v.BJK1) m.lompat(710); } },
    { baris: 320, jalan: function (m) { if (m.v.BJK2) m.lompat(710); } },
    { baris: 330, jalan: function (m) { m.gosub(1300); } },
    { baris: 340, jalan: function (m) {
        m.locate(24, 1); m.spc(62); m.warna(15, 0);
      } },
    { baris: 350, jalan: function (m) {
        m.locate(24, 19);
        m.cetak('     Hit, Stand Or Double Down? <H/S/D>     ');
      } },
    { baris: 360, bagian: [
        function (m) { m.warna(3, 0); m.gosub(1930); },
        function (m) { if (m.v.HIT) m.lompat(500); }
      ] },
    { baris: 370, jalan: function (m) { if (m.v.STD) m.lompat(550); } },
    kondisi(380,
      function (m) { return m.v.CSH - m.v.BT * 100 >= 0; },
      [function (m) { m.v.CSH = m.v.CSH - m.v.BT * 100; m.v.BT = m.v.BT * 2; },
       function (m) { m.gosub(3280); },
       function (m) { m.lompat(420); }]),
    { baris: 390, jalan: function (m) {
        m.locate(24, 1); m.spc(62);
        m.locate(24, 20); m.warna(15, 0);
      } },
    { baris: 400, jalan: function (m) {
        m.cetak("You Don't Have Enough Money To Double Down");
      } },
    { baris: 410, jalan: function (m) {
        for (m.v.D = 1; m.v.D <= 4000; m.v.D++) { /* jeda */ }
        m.lompat(460);
      } },
    { baris: 420, jalan: function (m) {
        m.v.A = 8; m.v.TS = 1; m.v.B = 12 + m.v.TS * 11; m.v.CD = m.v.CD + 1;
        m.locate(6, 69); m.warna(15, 0);
        m.cetakFormat(UANG, m.v.BT * 100); m.warna(3, 0);
        m.v.PYR[m.v.TS + 2] = m.v.DK[m.v.CD];
      } },
    { baris: 430, bagian: [
        function (m) { m.gosub(2220); },
        function (m) { m.gosub(1300); }
      ] },
    { baris: 440, jalan: function (m) { if (m.v.PYRBTD) m.lompat(710); } },
    { baris: 450, jalan: function (m) { m.lompat(550); } },
    { baris: 460, jalan: function (m) {
        m.locate(24, 1); m.spc(79); m.warna(15, 0);
      } },
    { baris: 470, jalan: function (m) {
        m.locate(24, 20);
        m.cetak('You Have' + angka(m.v.PYRHD) + 'Showing.  Hit Or Stand? <H/S>');
      } },
    { baris: 480, bagian: [
        function (m) { m.gosub(1930); },
        function (m) { if (m.v.HIT) m.lompat(500); }
      ] },
    { baris: 490, jalan: function (m) { m.lompat(m.v.STD ? 550 : 480); } },
    { baris: 500, jalan: function (m) {
        m.v.TS = m.v.TS + 1; m.v.CD = m.v.CD + 1;
        m.v.B = 12 + m.v.TS * 11;
        m.v.PYR[m.v.TS + 2] = m.v.DK[m.v.CD];
      } },
    { baris: 510, bagian: [
        function (m) { m.gosub(2220); },
        function (m) { m.gosub(1300); }
      ] },
    { baris: 520, jalan: function (m) { if (m.v.PYRHD === 21) m.lompat(550); } },
    { baris: 530, jalan: function (m) { if (m.v.PYRBTD) m.lompat(710); } },
    { baris: 540, jalan: function (m) { m.lompat(460); } },

    /* --- 550-700: giliran bandar ------------------------------------------ */
    { baris: 550, jalan: function (m) { m.v.TS = 0; } },
    buka(560),
    { baris: 570, jalan: function (m) { m.v.CPHD = 0; } },
    { baris: 580, jalan: function (m) { m.untuk('C', 1, m.v.TS + 2, 1, 620); } },
    { baris: 590, jalan: function (m) {
        if (m.v.CP[m.v.C] > 9) m.v.CP[m.v.C] = 10;
      } },
    { baris: 600, jalan: function (m) { m.v.CPHD = m.v.CPHD + m.v.CP[m.v.C]; } },
    { baris: 610, jalan: function (m) { m.lanjutkan('C'); } },
    /* 620-660 As dihitung sebelas kalau muat. Perhatikan bahwa gelungnya
       jalan SESUDAH semua kartu dijumlah sebagai satu — jadi tiap As
       ditawari kenaikan sepuluh, satu per satu. */
    { baris: 620, jalan: function (m) { m.untuk('C', 1, m.v.TS + 2, 1, 670); } },
    { baris: 630, jalan: function (m) {
        if (m.v.CP[m.v.C] !== 1) m.lompat(660);
      } },
    { baris: 640, jalan: function (m) {
        if (m.v.CPHD + 10 === 21) { m.v.CPHD = m.v.CPHD + 10; m.lompat(710); }
      } },
    { baris: 650, jalan: function (m) {
        if (m.v.CPHD + 10 < 21) m.v.CPHD = m.v.CPHD + 10;
      } },
    { baris: 660, jalan: function (m) { m.lanjutkan('C'); } },
    /* 670 aturan bandar seluruhnya satu baris: ambil kartu sampai 17. */
    { baris: 670, jalan: function (m) { if (m.v.CPHD > 16) m.lompat(720); } },
    { baris: 680, jalan: function (m) {
        for (m.v.QQ = 1; m.v.QQ <= 1500; m.v.QQ++) { /* jeda */ }
      } },
    { baris: 690, jalan: function (m) {
        m.v.TS = m.v.TS + 1; m.v.CD = m.v.CD + 1;
        m.v.CP[m.v.TS + 2] = m.v.DK[m.v.CD];
        m.v.A = 1; m.v.B = 12 + m.v.TS * 11;
      } },
    { baris: 700, bagian: [
        function (m) { m.gosub(2220); },
        function (m) { m.lompat(570); }
      ] },
    buka(710),

    /* --- 720-1040: siapa menang ------------------------------------------- */
    { baris: 720, jalan: function (m) { if (m.v.PS) m.lompat(800); } },
    { baris: 730, jalan: function (m) { if (m.v.BJK1) m.lompat(830); } },
    { baris: 740, jalan: function (m) { if (m.v.BJK2) m.lompat(850); } },
    { baris: 750, jalan: function (m) { if (m.v.PYRBTD) m.lompat(880); } },
    { baris: 760, jalan: function (m) { if (m.v.CPHD > 21) m.lompat(900); } },
    { baris: 770, jalan: function (m) { if (m.v.CPHD === m.v.PYRHD) m.lompat(800); } },
    { baris: 780, jalan: function (m) { if (m.v.CPHD > m.v.PYRHD) m.lompat(930); } },
    { baris: 790, jalan: function (m) { m.lompat(950); } },
    { baris: 800, jalan: function (m) { m.v.PS = 1; } },
    sapu(810, 31), { baris: 820, jalan: function (m) {
        m.cetak('Push To Next Hand!'); m.lompat(980);
      } },
    sapu(830, 25), { baris: 840, jalan: function (m) {
        m.cetak('Dealer Has Blackjack!  You Lose.'); m.lompat(980);
      } },
    sapu(850, 22), { baris: 860, jalan: function (m) {
        m.cetak('You Have Blackjack! Dealer Pays Double.');
      } },
    { baris: 870, bagian: [
        function (m) { m.v.CSH = m.v.CSH + m.v.BT * 300; },
        function (m) { m.gosub(3280); },
        function (m) { m.lompat(980); }
      ] },
    sapu(880, 29), { baris: 890, jalan: function (m) {
        m.cetak('You Busted! Dealer Wins.'); m.lompat(980);
      } },
    sapu(900, 30), { baris: 910, jalan: function (m) {
        m.cetak('Dealer Busted! You Win.');
      } },
    { baris: 920, bagian: [
        function (m) { m.v.CSH = m.v.CSH + m.v.BT * 200; },
        function (m) { m.gosub(3280); },
        function (m) { m.lompat(980); }
      ] },
    sapu(930, 21), { baris: 940, jalan: function (m) {
        m.cetak('Dealer Has' + angka(m.v.CPHD) + '. You Have' +
                angka(m.v.PYRHD) + '. Dealer Wins');
        m.lompat(980);
      } },
    sapu(950, 23), { baris: 960, jalan: function (m) {
        m.cetak('Dealer Has' + angka(m.v.CPHD) + '. You Have' +
                angka(m.v.PYRHD) + '. You Win.');
      } },
    { baris: 970, bagian: [
        function (m) { m.v.CSH = m.v.CSH + m.v.BT * 200; },
        function (m) { m.gosub(3280); }
      ] },
    { baris: 980, jalan: function (m) { m.locate(24, 1); m.spc(66); } },
    { baris: 990, jalan: function (m) {
        m.warna(15, 0); m.locate(24, 27);
        m.cetak(' Strike Any Key To Continue ');
      } },
    { baris: 1000, jalan: function (m) {
        if (m.inkey() === '') { m.lompat(1000); return; }
        m.locate(6, 69); m.warna(15, 0); m.cetakFormat(UANG, 0);
        m.locate(7, 68); m.spc(11); m.barisBaru();
        m.locate(8, 69); m.spc(11); m.barisBaru();
        m.locate(24, 1); m.spc(62); m.warna(3, 0);
      } },
    /* 1010-1020 tangan hasil split diproses BELAKANGAN: SPF menandai bahwa
       masih ada satu tangan lagi, dan PYRHD2 menyimpan nilainya. */
    { baris: 1010, jalan: function (m) {
        m.v.SPF1 = 0;
        if (m.v.SPF && m.v.PYRBTD) {
          m.v.SPF = 0; m.v.PYRHD = m.v.PYRHD2; m.v.PYRBTD = 0;
          m.lompat(570);
        }
      } },
    { baris: 1020, jalan: function (m) {
        m.v.SPF1 = 0;
        if (m.v.SPF) { m.v.SPF = 0; m.v.PYRHD = m.v.PYRHD2; m.lompat(760); }
      } },
    { baris: 1030, jalan: function (m) {
        m.locate(6, 69); m.warna(15, 0); m.cetakFormat(UANG, 0);
        m.locate(24, 1); m.spc(62); m.warna(3, 0);
      } },
    { baris: 1040, jalan: function (m) { m.lompat(80); } },

    /* --- 1050-1290: taruhan ------------------------------------------------ */
    { baris: 1050, jalan: function (m) {
        m.locate(23, 1); m.spc(66);
        m.locate(24, 1); m.spc(66);
      } },
    { baris: 1060, jalan: function (m) {
        m.warna(15, 0); m.locate(23, 22);
        m.cetak('Place Your Bet Please. How Many Chips,');
      } },
    { baris: 1070, jalan: function (m) {
        m.locate(24, 22);
        m.cetak('From 1 to' + angka(m.v.CSH / 100) +
                '?  Then Strike Enter Key.  ');
        m.warna(3, 0);
      } },
    { baris: 1080, jalan: function (m) { m.v.Z = ''; m.v.ZH = ''; } },
    { baris: 1090, jalan: function (m) { if (m.inkey() !== '') m.lompat(1090); } },
    { baris: 1100, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1100);
      } },
    { baris: 1110, jalan: function (m) {
        if (m.v.Z !== m.chr(8) && m.v.Z.slice(-1) !== m.chr(75)) m.lompat(1140);
      } },
    { baris: 1120, jalan: function (m) { if (m.v.ZH === '') m.lompat(1100); } },
    { baris: 1130, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.ZH = m.v.ZH.slice(0, m.v.ZH.length - 1);
        m.lompat(1100);
      } },
    { baris: 1140, jalan: function (m) { if (m.v.Z === m.chr(13)) m.lompat(1180); } },
    { baris: 1150, jalan: function (m) {
        if (m.v.Z < '0' || m.v.Z > '9') m.lompat(1100);
      } },
    { baris: 1160, jalan: function (m) { if (m.v.ZH.length > 3) m.lompat(1100); } },
    { baris: 1170, jalan: function (m) {
        m.v.ZH = m.v.ZH + m.v.Z; m.cetak(m.v.Z); m.lompat(1100);
      } },
    { baris: 1180, jalan: function (m) { m.v.BT = parseInt(m.v.ZH, 10) || 0; } },
    { baris: 1190, jalan: function (m) {
        m.warna(15, 0); m.locate(5, 69); m.cetak('The Bet Is'); m.barisBaru();
      } },
    { baris: 1200, jalan: function (m) {
        m.locate(6, 69); m.cetakFormat(UANG, m.v.BT * 100);
        m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 1210, jalan: function (m) { m.locate(23, 1); m.spc(66); } },
    { baris: 1220, jalan: function (m) { if (m.v.BT < 1) m.lompat(1270); } },
    kondisi(1230,
      function (m) { return m.v.BT <= m.v.CSH / 100; },
      [function (m) { m.v.CSH = m.v.CSH - m.v.BT * 100; },
       function (m) { m.gosub(3280); },
       function (m) { m.lompat(2620); }]),
    { baris: 1240, jalan: function (m) {
        m.locate(23, 1); m.spc(66);
        m.locate(24, 1); m.spc(66); m.locate(24, 20);
      } },
    { baris: 1250, jalan: function (m) {
        m.cetak("You Don't Have That Many Chips. Please Try Again.");
      } },
    { baris: 1260, jalan: function (m) {
        for (m.v.D = 1; m.v.D <= 3000; m.v.D++) { /* jeda */ }
        m.locate(24, 1); m.spc(79); m.lompat(1050);
      } },
    { baris: 1270, jalan: function (m) {
        m.locate(23, 1); m.spc(66);
        m.locate(24, 1); m.spc(66); m.locate(24, 20);
      } },
    { baris: 1280, jalan: function (m) {
        m.cetak('Please Bet An Amount Greater Than Zero.');
      } },
    { baris: 1290, jalan: function (m) { m.lompat(1260); } },

    /* --- 1300-1410: nilai tangan pemain ------------------------------------ */
    { baris: 1300, jalan: function (m) { m.v.PYRHD = 0; m.v.PYRBTD = 0; } },
    { baris: 1310, jalan: function (m) { m.untuk('C', 1, m.v.TS + 2, 1, 1350); } },
    { baris: 1320, jalan: function (m) {
        if (m.v.PYR[m.v.C] > 9) m.v.PYR[m.v.C] = 10;
      } },
    { baris: 1330, jalan: function (m) { m.v.PYRHD = m.v.PYRHD + m.v.PYR[m.v.C]; } },
    { baris: 1340, jalan: function (m) { m.lanjutkan('C'); } },
    { baris: 1350, jalan: function (m) {
        if (m.v.PYRHD > 21) { m.v.PYRBTD = 1; m.kembali(); }
      } },
    { baris: 1360, jalan: function (m) { m.untuk('C', 1, m.v.TS + 2, 1, 1410); } },
    { baris: 1370, jalan: function (m) {
        if (m.v.PYR[m.v.C] !== 1) m.lompat(1400);
      } },
    { baris: 1380, jalan: function (m) {
        if (m.v.PYRHD + 10 === 21) { m.v.PYRHD = 21; m.kembali(); }
      } },
    { baris: 1390, jalan: function (m) {
        if (m.v.PYRHD + 10 < 21) m.v.PYRHD = m.v.PYRHD + 10;
      } },
    { baris: 1400, jalan: function (m) { m.lanjutkan('C'); } },
    { baris: 1410, jalan: function (m) { m.kembali(); } },

    /* --- 1420-1860: memecah tangan ---------------------------------------- */
    { baris: 1420, jalan: function (m) {
        if (m.v.CSH - m.v.BT * 100 >= 0) m.lompat(1460);
      } },
    { baris: 1430, jalan: function (m) {
        m.locate(24, 1); m.spc(79); m.locate(24, 20);
      } },
    { baris: 1440, jalan: function (m) {
        m.cetak("You Don't Have Enough Money To Split Your Hand.");
      } },
    { baris: 1450, jalan: function (m) {
        m.v.NSP = 1;
        for (m.v.F = 1; m.v.F <= 3000; m.v.F++) { /* jeda */ }
        m.locate(24, 1); m.spc(79); m.kembali();
      } },
    /* 1460 SWAP menaruh kartu pertama di tempat parkir HOLD(1), lalu tangan
       barunya dimulai dari kartu kedua. Baris 1810 menukarnya kembali. */
    { baris: 1460, jalan: function (m) {
        m.v.SPF1 = 1;
        var t = m.v.PYR[1]; m.v.PYR[1] = m.v.HOLD_[1]; m.v.HOLD_[1] = t;
        m.v.PYR[1] = m.v.PYR[2];
      } },
    { baris: 1470, jalan: function (m) {
        m.warna(15, 0); m.locate(7, 68); m.cetak('Bottom Hand'); m.barisBaru();
        m.locate(8, 69); m.cetakFormat(UANG, m.v.BT * 100); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1480, jalan: function (m) {
        for (m.v.D = 8; m.v.D <= 15; m.v.D++) {
          m.locate(m.v.D, 12); m.spc(11);
        }
      } },
    { baris: 1490, bagian: [
        function (m) { m.v.CSH = m.v.CSH - m.v.BT * 100; },
        function (m) { m.gosub(3280); }
      ] },
    { baris: 1500, bagian: [
        function (m) { m.v.A = 15; m.v.B = 1; },
        function (m) { m.gosub(2220); }
      ] },
    { baris: 1510, bagian: [
        function (m) {
          m.v.CD = m.v.CD + 1; m.v.B = 12; m.v.PYR[2] = m.v.DK[m.v.CD];
        },
        function (m) { m.gosub(2220); }
      ] },
    { baris: 1520, bagian: [
        function (m) { m.gosub(2000); },
        function (m) { if (m.v.BJK2) m.lompat(1750); }
      ] },
    { baris: 1530, bagian: [
        function (m) { m.gosub(1300); },
        function (m) { m.v.TS = 0; }
      ] },
    { baris: 1540, jalan: function (m) {
        m.locate(24, 1); m.spc(79); m.warna(15, 0);
      } },
    { baris: 1550, jalan: function (m) {
        m.locate(24, 23); m.cetak('Hit,Stand, Or Double Down? <H/S/D>');
      } },
    { baris: 1560, bagian: [
        function (m) { m.gosub(1930); },
        function (m) { if (m.v.HIT) m.lompat(1670); }
      ] },
    { baris: 1570, jalan: function (m) { if (m.v.STD) m.lompat(1740); } },
    { baris: 1580, jalan: function (m) {
        if (m.v.CSH - m.v.BT * 100 >= 0) m.lompat(1620);
      } },
    { baris: 1590, jalan: function (m) {
        m.locate(24, 1); m.spc(79); m.locate(24, 20);
      } },
    { baris: 1600, jalan: function (m) {
        m.cetak("You Don't Have Enough Money To Double Down");
      } },
    { baris: 1610, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 3000; m.v.F++) { /* jeda */ }
        m.lompat(1710);
      } },
    { baris: 1620, bagian: [
        function (m) {
          m.v.CSH = m.v.CSH - m.v.BT * 100; m.v.BT2 = m.v.BT * 2;
          m.locate(8, 69); m.warna(15, 0);
          m.cetakFormat(UANG, m.v.BT2 * 100); m.barisBaru(); m.warna(3, 0);
        },
        function (m) { m.gosub(3280); }
      ] },
    { baris: 1630, jalan: function (m) {
        m.v.A = 15; m.v.TS = 1; m.v.B = 12 + m.v.TS * 11;
        m.v.CD = m.v.CD + 1; m.v.PYR[m.v.TS + 2] = m.v.DK[m.v.CD];
      } },
    { baris: 1640, bagian: [
        function (m) { m.gosub(2220); },
        function (m) { m.gosub(1300); }
      ] },
    { baris: 1650, jalan: function (m) { if (m.v.PYRBTD) m.lompat(1780); } },
    { baris: 1660, jalan: function (m) { m.lompat(1800); } },
    { baris: 1670, jalan: function (m) {
        m.v.TS = m.v.TS + 1; m.v.CD = m.v.CD + 1;
        m.v.B = 12 + m.v.TS * 11; m.v.PYR[m.v.TS + 2] = m.v.DK[m.v.CD];
      } },
    { baris: 1680, bagian: [
        function (m) { m.gosub(2220); },
        function (m) { m.gosub(1300); }
      ] },
    { baris: 1690, jalan: function (m) { if (m.v.PYRHD === 21) m.lompat(1800); } },
    { baris: 1700, jalan: function (m) { if (m.v.PYRBTD) m.lompat(1780); } },
    { baris: 1710, jalan: function (m) {
        m.locate(24, 1); m.spc(79); m.warna(15, 0);
      } },
    { baris: 1720, jalan: function (m) {
        m.locate(24, 20);
        m.cetak('You Have' + angka(m.v.PYRHD) + 'Showing. Hit Or Stand? <H/S>');
      } },
    { baris: 1730, bagian: [
        function (m) { m.gosub(1930); },
        function (m) { if (m.v.HIT) m.lompat(1670); }
      ] },
    { baris: 1740, jalan: function (m) { m.lompat(m.v.STD ? 1800 : 1730); } },
    sapu(1750, 20), { baris: 1760, jalan: function (m) {
        m.cetak('You Have Blackjack! Dealer Pays Double.');
      } },
    { baris: 1770, bagian: [
        function (m) { m.v.CSH = m.v.CSH + m.v.BT * 300; },
        function (m) { m.gosub(3280); },
        function (m) { m.lompat(1810); }
      ] },
    sapu(1780, 20), { baris: 1790, jalan: function (m) {
        m.cetak('You Busted! Dealer Wins.'); m.lompat(1810);
      } },
    { baris: 1800, jalan: function (m) { m.v.SPF = 1; } },
    { baris: 1810, jalan: function (m) {
        var t = m.v.PYR[1]; m.v.PYR[1] = m.v.HOLD_[1]; m.v.HOLD_[1] = t;
        m.v.TS = 0;
      } },
    { baris: 1820, jalan: function (m) { m.v.PYRHD2 = m.v.PYRHD; } },
    { baris: 1830, jalan: function (m) { m.locate(24, 1); m.spc(79); } },
    { baris: 1840, jalan: function (m) {
        m.warna(15, 0); m.locate(24, 27);
        m.cetak(' Strike Any Key To Continue '); m.warna(3, 0);
      } },
    { baris: 1850, jalan: function (m) {
        m.locate(23, 1); m.spc(66); m.barisBaru();
      } },
    { baris: 1860, jalan: function (m) {
        if (m.inkey() === '') { m.lompat(1860); return; }
        m.locate(24, 1); m.spc(62); m.kembali();
      } },

    /* --- 1870-1990: dua penanya tombol ------------------------------------ */
    { baris: 1870, jalan: function () { } },
    { baris: 1880, jalan: function (m) { if (m.inkey() !== '') m.lompat(1880); } },
    { baris: 1890, jalan: function (m) { m.v.Z = m.inkey(); } },
    { baris: 1900, jalan: function (m) {
        if (m.v.Z === 'Y' || m.v.Z === 'y') {
          m.v.YES = 1; m.v.NO = 0; m.kembali();
        }
      } },
    { baris: 1910, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') {
          m.v.YES = 0; m.v.NO = 1; m.kembali();
        }
      } },
    { baris: 1920, jalan: function (m) { m.lompat(1890); } },
    { baris: 1930, jalan: function (m) { if (m.inkey() !== '') m.lompat(1930); } },
    { baris: 1940, jalan: function (m) { m.v.HIT = 0; m.v.STD = 0; } },
    { baris: 1950, jalan: function (m) { m.v.Z = m.inkey(); } },
    { baris: 1960, jalan: function (m) {
        if (m.v.Z === 'H' || m.v.Z === 'h') { m.v.HIT = 1; m.kembali(); }
      } },
    { baris: 1970, jalan: function (m) {
        if (m.v.Z === 'S' || m.v.Z === 's') { m.v.STD = 1; m.kembali(); }
      } },
    { baris: 1980, jalan: function (m) {
        if (m.v.Z === 'D' || m.v.Z === 'd') m.kembali();
      } },
    /* 1990 kembali ke 1940, BUKAN 1950 — jadi HIT dan STD dinolkan lagi tiap
       tombol salah. Kebetulan tidak berbahaya, tapi satu baris terlalu jauh. */
    { baris: 1990, jalan: function (m) { m.lompat(1940); } },

    { baris: 2000, jalan: function (m) {
        m.v.BJK1 = 0; m.v.BJK2 = 0; m.v.PS = 0;
      } },
    bjk(2010, 'CP', 1, 1), bjk(2020, 'CP', 2, 1),
    bjk(2030, 'PYR', 1, 2), bjk(2040, 'PYR', 2, 2),
    { baris: 2050, jalan: function (m) {
        if (m.v.BJK1 && m.v.BJK2) m.v.PS = 1;
      } },
    { baris: 2060, jalan: function (m) { m.kembali(); } },

    /* --- 2070-2210: mengocok dengan menolak -------------------------------- */
    { baris: 2070, jalan: function (m) {
        m.locate(2, 28); m.cetak('One Moment Please While'); m.barisBaru();
      } },
    { baris: 2080, jalan: function (m) {
        m.locate(3, 30); m.cetak('I Shuffle The Deck'); m.barisBaru();
      } },
    { baris: 2090, jalan: function (m) { m.dim('DK', 52); } },
    { baris: 2100, jalan: function (m) { m.untuk('A', 1, 13, 1, 2190); } },
    { baris: 2110, jalan: function (m) {
        m.semai(detik(m) * m.acak() * m.acak());
      } },
    { baris: 2120, jalan: function (m) { m.untuk('C', 1, 4, 1, 2180); } },
    { baris: 2130, jalan: function (m) { m.v.B = Math.floor(m.acak() * 52) + 1; } },
    /* 2140 ABC dihitung dan tidak pernah dibaca siapa pun. Barangkali sisa
       usaha "mengaduk" pengacak; hasilnya cuma memanggil RND lima kali. */
    { baris: 2140, jalan: function (m) {
        m.v.ABC = m.acak() * m.acak() * m.acak() * m.acak() * m.acak() *
                  ((m.v.ABC || 0) + 2);
      } },
    { baris: 2150, jalan: function (m) {
        if (m.v.DK[m.v.B] !== 0) m.lompat(2130);
      } },
    { baris: 2160, jalan: function (m) {
        m.v.DK[m.v.B] = m.v.A; m.v.CDSU[m.v.B] = m.v.C;
      } },
    { baris: 2170, jalan: function (m) { m.lanjutkan('C'); } },
    { baris: 2180, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2190, jalan: function (m) {
        m.locate(2, 1); m.spc(66); m.barisBaru();
      } },
    { baris: 2200, jalan: function (m) {
        m.locate(3, 1); m.spc(66); m.barisBaru();
      } },
    { baris: 2210, jalan: function (m) { m.v.CD = 0; m.kembali(); } },

    /* --- 2220-2420: menggambar satu kartu ---------------------------------- */
    { baris: 2220, jalan: function (m) { m.warna(3, 0); } },
    tepi(2230, 0, 201, 187), kosong(2240, 1), kosong(2250, 2), kosong(2260, 3),
    kosong(2270, 4), kosong(2280, 5), tepi(2290, 6, 200, 188),
    { baris: 2300, jalan: function (m) { m.warna(6, 0); } },
    { baris: 2310, jalan: function (m) { m.suara(25000, 0.01); m.suara(37, 0); } },
    isi(2320, 1, 1), isi(2330, 2, 2),
    { baris: 2340, jalan: function (m) {
        if (m.v.DK[m.v.CD] !== 1) m.lompat(2360);
      } },
    /* 2350 As digambar lain sendiri: satu lambang besar di tengah, bukan
       baris dari tabel. */
    { baris: 2350, jalan: function (m) {
        m.locate(m.v.A + 3, m.v.B + 5);
        m.cetak(m.v['SU$'][m.v.CDSU[m.v.CD]]);
        m.lompat(2370);
      } },
    isi(2360, 3, 3), isi(2370, 4, 4), isi(2380, 5, 5),
    lambang(2390, 2, 1), lambang(2400, 4, 9),
    { baris: 2410, jalan: function (m) { m.warna(3, 0); } },
    { baris: 2420, jalan: function (m) { m.kembali(); } },

    { baris: 2430, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 13; m.v.A++) {
          for (m.v.B = 1; m.v.B <= 5; m.v.B++) {
            m.v['LIN$'][m.v.B][m.v.A] = m.baca();
          }
        }
      } },
    { baris: 2440, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 4; m.v.A++) m.v['SU$'][m.v.A] = m.baca();
      } },
    { baris: 2450, jalan: function (m) { m.v.HOLD = 0; } },
    { baris: 2460, jalan: function (m) { m.kembali(); } },
    data(2470), data(2480), data(2490), data(2500), data(2510), data(2520),
    data(2530), data(2540), data(2550), data(2560), data(2570), data(2580),
    data(2590), data(2600), data(2610),

    /* --- 2620-2690: tumpukan keping di tepi kanan -------------------------- */
    { baris: 2620, jalan: function (m) {
        m.warna(10, null); m.v.H = m.v.CSH / 100; m.v.H1 = 0;
      } },
    { baris: 2630, jalan: function (m) {
        if (m.v.H > 10) { m.v.H1 = m.v.H1 + 1; m.v.H = m.v.H - 10; m.lompat(2630); }
      } },
    { baris: 2640, jalan: function (m) {
        for (m.v.F = 13; m.v.F <= 23; m.v.F++) {
          m.locate(m.v.F, 68); m.spc(11); m.barisBaru();
        }
      } },
    { baris: 2650, jalan: function (m) {
        for (m.v.F = 23; m.v.F >= 24 - m.v.H; m.v.F--) {
          m.locate(m.v.F, 68); m.cetak(m.ulang(3, 223));
        }
      } },
    { baris: 2660, jalan: function (m) {
        m.warna(12, null);
        m.v.HH = m.v.H1 > 10 ? 10 : m.v.H1;
      } },
    { baris: 2670, jalan: function (m) {
        for (m.v.F = 23; m.v.F >= 24 - m.v.HH; m.v.F--) {
          m.locate(m.v.F, 74); m.cetak(m.ulang(5, 223));
        }
      } },
    { baris: 2680, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 2690, jalan: function (m) {
        for (m.v.D = 1; m.v.D <= 22; m.v.D++) {
          m.locate(m.v.D, 1); m.cetak(m.ulang(66, 32)); m.barisBaru();
        }
        m.kembali();
      } },

    /* --- 2700-2890: KODE MATI ---------------------------------------------
       Tidak ada satu pun GOSUB atau GOTO ke 2700 di seluruh program. Isinya
       penggambar tumpukan keping taruhan, disalin utuh dari CRAPS.BAS baris
       2310-2500 — lengkap dengan variabel `P` yang di sini tidak pernah ada
       nilainya. Tersalin, lalu terlupa. */
    { baris: 2700, jalan: function (m) { m.v.G1 = m.v.BT; m.v.G2 = 0; } },
    { baris: 2710, jalan: function (m) {
        if (m.v.G1 > 9) { m.v.G2 = m.v.G2 + 1; m.v.G1 = m.v.G1 - 10; m.lompat(2710); }
      } },
    { baris: 2720, jalan: function (m) { m.v.F2 = 14 + (m.v.P || 0) * 25; } },
    { baris: 2730, jalan: function (m) { m.v.F = 0; } },
    { baris: 2740, jalan: function (m) { if (m.v.F === m.v.G2) m.lompat(2810); } },
    { baris: 2750, jalan: function (m) { m.untuk('F1', 18, 16, -1, 2790); } },
    { baris: 2760, jalan: function (m) {
        if (m.v.F === m.v.G2) m.lompat(2810); else m.v.F = m.v.F + 1;
      } },
    { baris: 2770, jalan: function (m) {
        m.locate(m.v.F1, 5 + m.v.F2); m.cetak(m.ulang(5, 223));
      } },
    { baris: 2780, jalan: function (m) { m.lanjutkan('F1'); } },
    { baris: 2790, jalan: function (m) { m.v.F2 = m.v.F2 + 6; } },
    { baris: 2800, jalan: function (m) { m.lompat(2740); } },
    { baris: 2810, jalan: function (m) { m.v.F2 = m.v.F2 + 6; } },
    { baris: 2820, jalan: function (m) { m.v.F = 0; } },
    { baris: 2830, jalan: function (m) { if (m.v.F === m.v.G1) m.kembali(); } },
    { baris: 2840, jalan: function (m) { m.untuk('F1', 18, 16, -1, 2880); } },
    { baris: 2850, jalan: function (m) {
        if (m.v.F === m.v.G1) m.lompat(2880); else m.v.F = m.v.F + 1;
      } },
    { baris: 2860, jalan: function (m) {
        m.locate(m.v.F1, 5 + m.v.F2); m.cetak(m.ulang(3, 223));
      } },
    { baris: 2870, jalan: function (m) { m.lanjutkan('F1'); } },
    { baris: 2880, jalan: function (m) { m.v.F2 = m.v.F2 + 4; } },
    { baris: 2890, jalan: function (m) { m.lompat(2830); } },

    /* --- 2900-2990: F10 ---------------------------------------------------- */
    { baris: 2900, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XX = m.barisKursor(); m.v.YY = m.pos();
        m.locate(25, 1); m.spc(79);
      } },
    { baris: 2910, jalan: function (m) {
        m.warna(15, 0); m.locate(25, 22);
        m.cetak('Do You Wish To Leave This Game? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 2920, jalan: function (m) { m.gosub(1870); } },
    { baris: 2930, jalan: function (m) { if (m.v.YES) m.lompat(2990); } },
    { baris: 2940, jalan: function (m) { m.locate(25, 1); m.spc(60); } },
    { baris: 2950, jalan: function (m) {
        m.locate(25, 24); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Game '); m.warna(3, 0);
      } },
    { baris: 2960, jalan: function (m) {
        m.locate(25, 67); m.cetak(" 100's 1000's");
      } },
    { baris: 2970, jalan: function (m) {
        m.locate(m.v.XX, m.v.YY, 0); m.v.Z = '';
      } },
    { baris: 2980, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },
    { baris: 2990, jalan: function (m) { m.jalankan('MENU'); } },

    /* --- 3000-3250: judul dan petunjuk ------------------------------------- */
    { baris: 3000, jalan: function (m) { m.cls(); m.warna(6, 0); } },
    { baris: 3010, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 3020, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1); m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 3030, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 3040, jalan: function (m) {
        m.locate(3, 19); m.warna(11, 0);
        m.cetak('F R I E N D L Y W A R E   B L A C K J A C K'); m.barisBaru();
      } },
    { baris: 3050, jalan: function (m) {
        m.warna(15, 0); m.locate(8, 23);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
      } },
    { baris: 3060, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3060);
      } },
    { baris: 3070, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') { m.cls(); m.kembali(); }
      } },
    { baris: 3080, jalan: function (m) {
        if (m.v.Z !== 'Y' && m.v.Z !== 'y') m.lompat(3060);
      } },
    { baris: 3090, jalan: function (m) {
        m.warna(7, 0); m.locate(6, 20);
        m.cetak('In the game of Blackjack, a standard deck'); m.barisBaru();
      } },
    ajar(3100,  7, 20, 'of cards is used.   The computer (dealer)'),
    ajar(3110,  8, 20, 'will deal  two  cards face up to you  and'),
    ajar(3120,  9, 20, 'two cards to himself, one face up and the'),
    ajar(3130, 10, 20, 'other face down.'),
    ajar(3140, 11, 20, 'The object is to come as close to twenty-'),
    ajar(3150, 12, 20, "one  (21)  as possible without  `busting'"),
    ajar(3160, 13, 20, 'by going over twenty-one. Aces can count'),
    ajar(3170, 14, 20, 'as one or eleven,face cards are ten, and'),
    ajar(3180, 15, 20, 'all other cards are face value.  You may'),
    ajar(3190, 16, 20, 'take a HIT (another card to better  your'),
    ajar(3200, 17, 20, 'hand), STAND  (play the cards you have),'),
    ajar(3210, 18, 20, 'or DOUBLE DOWN (double your bet and take'),
    ajar(3220, 19, 20, 'one card immediatly after the deal). All'),
    ajar(3230, 20, 20, 'ties are pushes.'),
    { baris: 3240, jalan: function (m) {
        m.locate(25, 27); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue');
      } },
    { baris: 3250, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3250); else { m.cls(); m.kembali(); }
      } },
    { baris: 3260, jalan: function (m) { m.warna(15, 0); } },
    { baris: 3270, jalan: function (m) {
        m.locate(2, 71); m.cetak('You Have');
      } },
    { baris: 3280, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 69); m.cetakFormat(UANG, m.v.CSH);
        m.barisBaru();
      } },
    { baris: 3290, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 3300, jalan: function (m) { m.cls(); } },
    ajar(3310, 5, 23, 'You Have Lost  All  Of  Your Money!'),
    { baris: 3320, jalan: function (m) {
        m.locate(7, 23); m.cetak('Would You Like To Play Again? <Y/N>');
      } },
    { baris: 3330, bagian: [
        function (m) { m.gosub(1870); },
        function (m) { if (m.v.NO) m.jalankan('MENU'); else m.lompat(70); }
      ] },
    { baris: 3340, jalan: function (m) { m.cls(); } },
    { baris: 3350, jalan: function (m) {
        m.locate(5, 29); m.warna(31, 0);
        m.cetak('You Broke The Bank !!!'); m.barisBaru(); m.warna(3, 0);
        for (m.v.F = 1; m.v.F <= 20; m.v.F++) {
          m.suara(500, 1); m.suara(200, 1); m.suara(150, 1);
        }
      } },
    { baris: 3360, jalan: function (m) { m.lompat(3320); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function data(nomor) { return { baris: nomor, jalan: function () { } }; }
  function angka(n) {
    var b = Math.round(n * 100) / 100;
    return (b < 0 ? '' : ' ') + String(b) + ' ';
  }

  function ajar(nomor, b, k, isiTeks) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isiTeks); m.barisBaru();
    } };
  }

  function sapu(nomor, kol) {
    return { baris: nomor, jalan: function (m) {
      m.locate(23, 1); m.spc(66); m.locate(23, kol);
    } };
  }

  function bagi(nomor, a, b, tangan, n) {
    return { baris: nomor, bagian: [
      function (m) {
        m.v.A = a; m.v.B = b; m.v.CD = m.v.CD + 1;
        m.v[tangan][n] = m.v.DK[m.v.CD];
      },
      function (m) { m.gosub(2220); }
    ] };
  }

  /* Kartu bergambar dihitung sepuluh. Perhatikan bahwa nilainya DIUBAH di
     lariknya, bukan sekadar dibaca — jadi J, Q, K jadi 10 selamanya. */
  function sepuluh(nomor, tangan, n) {
    return { baris: nomor, jalan: function (m) {
      if (m.v[tangan][n] > 9) m.v[tangan][n] = 10;
    } };
  }

  function bjk(nomor, tangan, n, bendera) {
    return { baris: nomor, jalan: function (m) {
      var cocok = (n === 1)
        ? (m.v[tangan][1] === 1 && m.v[tangan][2] > 9)
        : (m.v[tangan][1] > 9 && m.v[tangan][2] === 1);
      if (cocok) m.v['BJK' + bendera] = 1;
    } };
  }

  /* `IF <syarat> THEN a:b:c` yang penggalnya banyak: syaratnya dinilai
     SEKALI di penggal pertama, karena penggal-penggal berikutnya bisa
     mengubah nilai yang diujinya. */
  function kondisi(nomor, uji, fns) {
    var ya = false;
    var bagian = [function (m) { ya = !!uji(m); if (ya) fns[0](m); }];
    for (var i = 1; i < fns.length; i++) {
      bagian.push((function (f) {
        return function (m) { if (ya) f(m); };
      })(fns[i]));
    }
    return { baris: nomor, bagian: bagian };
  }

  /* `SWAP CD,HOLD` — kartu bandar dibuka dengan menukar nomornya kembali,
     lalu digambar ulang di tempat yang sama. */
  function buka(nomor) {
    return { baris: nomor, bagian: [
      function (m) {
        m.v.A = 1;
        var t = m.v.CD; m.v.CD = m.v.HOLD; m.v.HOLD = t;
        m.v.B = 1;
      },
      function (m) { m.gosub(2220); },
      function (m) { var t = m.v.HOLD; m.v.HOLD = m.v.CD; m.v.CD = t; }
    ] };
  }

  function tepi(nomor, geser, kiri, kanan) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.A + geser, m.v.B);
      m.cetak(m.chr(kiri) + m.ulang(9, 205) + m.chr(kanan));
    } };
  }

  function kosong(nomor, geser) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.A + geser, m.v.B);
      m.cetak(m.chr(186) + '         ' + m.chr(186));
    } };
  }

  function isi(nomor, geser, baris) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.A + geser, m.v.B + 1);
      m.cetak(m.v['LIN$'][baris][m.v.DK[m.v.CD]]);
    } };
  }

  function lambang(nomor, geserBaris, geserKolom) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.A + geserBaris, m.v.B + geserKolom);
      m.cetak(m.v['SU$'][m.v.CDSU[m.v.CD]]);
    } };
  }

  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  /* Lima baris gambar untuk tiap nilai kartu, 0 sampai 13. Nilai 0 adalah
     PUNGGUNG kartu — dan itulah yang membuat kartu tertutup bekerja. Titik
     kartunya CHR$(220) dan CHR$(223), lambang sukunya CHR$(3..6). */
  var b = String.fromCharCode(220), t = String.fromCharCode(223);
  function baris5(a1, a2, a3, a4, a5) { return [a1, a2, a3, a4, a5]; }

  var GAMBAR = [].concat(
    baris5('XXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXXX'),
    baris5('A        ', '         ', '         ', '         ', '        A'),
    baris5('2   ' + b + '    ', '         ', '         ', '         ', '    ' + b + '   2'),
    baris5('3   ' + b + '    ', '         ', '    ' + b + '    ', '         ', '    ' + b + '   3'),
    baris5('4 ' + b + '   ' + b + '  ', '         ', '         ', '         ', '  ' + b + '   ' + b + ' 4'),
    baris5('5 ' + b + '   ' + b + '  ', '         ', '    ' + b + '    ', '         ', '  ' + b + '   ' + b + ' 5'),
    baris5('6 ' + b + '   ' + b + '  ', '         ', '  ' + b + '   ' + b + '  ', '         ', '  ' + b + '   ' + b + ' 6'),
    baris5('7 ' + b + '   ' + b + '  ', '    ' + b + '    ', '  ' + b + '   ' + b + '  ', '         ', '  ' + b + '   ' + b + ' 7'),
    baris5('8 ' + b + '   ' + b + '  ', '    ' + b + '    ', '  ' + b + '   ' + b + '  ', '    ' + b + '    ', '  ' + b + '   ' + b + ' 8'),
    baris5('9 ' + b + '   ' + b + '  ', '  ' + b + '   ' + b + '  ', '    ' + b + '    ', '  ' + b + '   ' + b + '  ', '  ' + b + '   ' + b + ' 9'),
    baris5('10' + b + '   ' + b + '  ', '  ' + b + ' ' + t + ' ' + b + '  ', '         ', '  ' + b + '   ' + b + '  ', '  ' + b + ' ' + t + ' ' + b + '10'),
    baris5('J        ', '         ', '         ', '         ', '        J'),
    baris5('Q        ', '         ', '         ', '         ', '        Q'),
    baris5('K        ', '         ', '         ', '         ', '        K'),
    [String.fromCharCode(3), String.fromCharCode(4),
     String.fromCharCode(5), String.fromCharCode(6)]
  );

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['21'] = {
    nama: '21',
    judul: 'Friendlyware Blackjack',
    sumber: '21',
    berkas: 'run/21.BAS',
    tabel: tabel,
    benih: 3,
    data: GAMBAR,

    arsitektur: {
      judul: 'Alur 21.BAS',
      simpul: [
        { id: 'siap', baris: '50-70', jenis: 'mulai',
          teks: ['Baca gambar kartu dari DATA,', 'petunjuk, modal $2.000'] },
        { id: 'kocok', baris: '2070-2210', jenis: 'subrutin',
          teks: ['Kocok dek dengan menolak:', 'lempar tempat, ulang kalau terisi'] },
        { id: 'taruh', baris: '1050-1290',
          teks: ['Taruhan, tombol demi tombol'] },
        { id: 'bagi', baris: '150-250',
          teks: ['Empat kartu; yang pertama', 'bandar digambar TERTUTUP'] },
        { id: 'pecah', baris: '1420-1860', jenis: 'subrutin',
          teks: ['Dua kartu sama:', 'tangan boleh dipecah'] },
        { id: 'main', baris: '340-540', jenis: 'putusan',
          teks: ['Hit, Stand,', 'atau Double Down'] },
        { id: 'bandar', baris: '550-700',
          teks: ['Kartu bandar dibuka,', 'ambil sampai 17'] },
        { id: 'nilai', baris: '1300-1410',
          teks: ['Hitung tangan;', 'As jadi 11 kalau muat'] },
        { id: 'putus', baris: '720-970', jenis: 'putusan',
          teks: ['Bandingkan, bayar,', 'atau tarik taruhannya'] },
        { id: 'habis', baris: '3300-3360', jenis: 'keluar',
          teks: ['Modal habis, atau', 'lebih dari $10.000'] }
      ],
      panah: [
        { dari: 'siap', ke: 'kocok' },
        { dari: 'kocok', ke: 'taruh' },
        { dari: 'taruh', ke: 'bagi' },
        { dari: 'bagi', ke: 'pecah', label: 'dua kartu sama' },
        { dari: 'pecah', ke: 'bagi', label: 'tangan kedua' },
        { dari: 'bagi', ke: 'main' },
        { dari: 'main', ke: 'nilai' },
        { dari: 'nilai', ke: 'main', label: 'ambil kartu lagi' },
        { dari: 'main', ke: 'bandar', label: 'berhenti' },
        { dari: 'bandar', ke: 'putus' },
        { dari: 'putus', ke: 'taruh', label: 'ronde berikutnya' },
        { dari: 'putus', ke: 'kocok', label: 'sudah 40 kartu' },
        { dari: 'putus', ke: 'habis', label: 'modal habis / bank pecah' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Kartu bandar: tertutup dan terbuka',
        keterangan: 'Tidak ada bendera "tertutup" di program ini. Yang ada ' +
          'cuma nomor kartu yang dititipkan ke <code>HOLD</code> sementara ' +
          '<code>CD</code> diisi nol &mdash; dan gambar kartu nomor nol ' +
          'kebetulan adalah punggung kartu.',
        simpul: [
          { id: 'tutup', baris: '160', jenis: 'mulai',
            teks: ['CD = 0, HOLD = nomor asli', 'LIN$(*,0) = punggung kartu'] },
          { id: 'buka', baris: '560 / 710', jenis: 'keadaan',
            teks: ['SWAP CD,HOLD', 'kartu digambar ulang, terbuka'] }
        ],
        panah: [
          { dari: 'tutup', ke: 'buka', label: 'giliran bandar (560)' },
          { dari: 'buka', ke: 'tutup', label: 'SWAP kembali, ronde baru' },
          { dari: 'tutup', ke: 'tutup', label: 'pemain masih bermain' }
        ]
      }
    ],

    pseudokode: [
      { baris: 2430, tingkat: 0, teks: 'baca 14&times;5 baris gambar kartu dari DATA &mdash; <b>nomor 0 adalah punggungnya</b>' },
      { baris: 2100, tingkat: 0, teks: '<b>kocok:</b> untuk tiap nilai dan tiap suku&hellip;' },
      { baris: 2130, tingkat: 1, teks: 'lempar tempat acak di dek; <b>kalau sudah terisi, lempar lagi</b>' },
      { baris: 80, tingkat: 0, teks: '<b>ULANG sampai modal habis atau lebih dari $10.000:</b>' },
      { baris: 1050, tingkat: 1, teks: 'minta taruhan, tombol demi tombol' },
      { baris: 160, tingkat: 1, teks: 'kartu pertama bandar: <b>simpan nomornya di HOLD, isi CD dengan 0</b>' },
      { baris: 260, tingkat: 1, teks: 'dua kartu pemain sama? tawarkan memecah tangan' },
      { baris: 350, tingkat: 1, teks: 'Hit, Stand, atau Double Down' },
      { baris: 1300, tingkat: 2, teks: 'hitung tangan; <b>tiap As ditawari +10, satu per satu</b>' },
      { baris: 560, tingkat: 1, teks: '<code>SWAP CD,HOLD</code> &mdash; kartu bandar digambar ulang, terbuka' },
      { baris: 670, tingkat: 1, teks: 'aturan bandar seluruhnya satu baris: <b>ambil kartu sampai 17</b>' },
      { baris: 720, tingkat: 1, teks: 'bandingkan; blackjack dibayar dua kali, seri jadi push' }
    ],

    perintahAsli: 'run\\21.bat',
    catatanAsli: 'Di DOSBox-X tiap kartu yang dibagikan berbunyi klik pendek ' +
      '(baris 2310), dan "You Broke The Bank" berkedip.',

    penyimpangan: [
      '<b><code>HOLD</code> adalah skalar DAN larik di program ini.</b> ' +
      'Skalarnya menyimpan nomor kartu tertutup (baris 160); lariknya jadi ' +
      'tempat parkir kartu waktu tangan dipecah (baris 1460). Di penelusur ' +
      'lariknya bernama <code>HOLD_</code>.',

      '<b><code>SOUND</code> diam</b>, jadi klik tiap kartu dibagikan tidak ' +
      'terdengar, dan <b><code>COLOR 31</code> di baris 3350 tidak ' +
      'berkedip.</b>',

      '<b>Pengacaknya berbenih tetap</b>, jadi urutan kartunya selalu sama ' +
      'tiap penelusuran. Itu justru berguna: strategi yang sama bisa diulang ' +
      'dan dibandingkan.',

      '<b>Kelima gelung tunda habis seketika</b>, termasuk jeda 1500 putaran ' +
      'sebelum bandar mengambil kartu (baris 680) yang di aslinya membuat ' +
      'permainannya terasa berdebar.'
    ],

    pelajaran: {
      ringkas: 'Blackjack. Yang layak dipelajari: kartu tertutup yang ' +
        'sebenarnya cuma "kartu nomor nol", dan pengocokan yang bekerja ' +
        'dengan menolak.',
      pelajari: [
        ['Kartu tertutup adalah kartu nomor nol',
         'Baris 160 menyimpan nomor kartu bandar di <code>HOLD</code>, lalu ' +
         'mengisi <code>CD</code> dengan <b>nol</b>. Penggambar kartu tidak ' +
         'tahu apa-apa soal "tertutup" &mdash; ia cuma membaca ' +
         '<code>LIN$(*,0)</code>, yang isinya "XXXXXXXXX". Dan membuka ' +
         'kartunya cukup <code>SWAP CD,HOLD</code> lalu gambar ulang. ' +
         '<b>Satu keadaan yang tidak butuh bendera.</b>'],
        ['Mengocok dengan menolak',
         'Baris 2130-2150: lempar tempat acak di dek; kalau sudah terisi, ' +
         'lempar lagi. Benar, sepuluh kata, dan tidak butuh larik bantu. ' +
         'Harganya: makin penuh deknya makin sering menolak &mdash; kartu ' +
         'terakhir rata-rata perlu 52 lemparan. Untuk 52 kartu itu tidak ' +
         'terasa; untuk 52.000 akan terasa sekali.'],
        ['As yang ditawari sebelas satu per satu',
         'Baris 1360-1400: semua kartu dijumlah dulu sebagai satu, lalu tiap ' +
         'As ditawari kenaikan sepuluh &mdash; diterima kalau masih muat. ' +
         'Dua As jadi 1+11, tiga As jadi 1+1+11. <b>Aturan yang rumit ' +
         'diucapkan sebagai gelung sederhana.</b>'],
        ['Aturan bandar dalam satu baris',
         '<code>670 IF CPHD>16 THEN 720</code>. Itulah seluruh kecerdasan ' +
         'bandarnya: ambil kartu sampai 17. Bukan penyederhanaan program ini ' +
         '&mdash; memang begitu aturan kasino.']
      ],
      hindari: [
        ['Kode mati yang ikut tersalin dari program lain',
         'Baris 2700-2890 tidak pernah dipanggil siapa pun. Isinya penggambar ' +
         'tumpukan keping taruhan, disalin utuh dari CRAPS.BAS baris 2310-2500 ' +
         '&mdash; lengkap dengan variabel <code>P</code> yang di sini tidak ' +
         'pernah ada nilainya. <b>Seratus sembilan puluh baris yang tidak ' +
         'melakukan apa pun.</b>'],
        ['Perhitungan yang hasilnya tidak pernah dibaca',
         'Baris 2140: <code>ABC=RND*RND*RND*RND*RND*(ABC+2)</code>. ' +
         '<code>ABC</code> tidak muncul di tempat lain mana pun. Yang ' +
         'sebenarnya terjadi cuma lima panggilan <code>RND</code> yang ' +
         'memajukan deret acaknya.'],
        ['Nilai kartu yang diubah di tempatnya',
         'Baris 200-250 dan 590 menulis <code>PYR(1)=10</code> untuk J, Q, K. ' +
         'Nilai aslinya hilang selamanya, jadi kartu bergambar tidak bisa ' +
         'lagi dibedakan sesudahnya. Kebetulan tidak ada yang ' +
         'membutuhkannya &mdash; kecuali penggambar kartu, yang memakai ' +
         '<code>DK(CD)</code> dan bukan lariknya.'],
        ['Melompat satu baris terlalu jauh',
         'Baris 1990 kembali ke <b>1940</b>, bukan 1950 &mdash; jadi ' +
         '<code>HIT</code> dan <code>STD</code> dinolkan ulang tiap tombol ' +
         'salah ditekan. Tidak berbahaya di sini, tapi persis begitulah cara ' +
         'gelung yang benar berubah jadi gelung yang salah.']
      ]
    },

    penjelasan: [
      { judul: 'Kartu tertutup yang tidak butuh bendera',
        isi: [
          'Di blackjack, kartu pertama bandar dibagikan tertutup. Cara wajar ' +
          'memprogramnya: satu bendera <code>tertutup</code>, dan penggambar ' +
          'kartu yang memeriksanya.',
          'Program ini tidak punya bendera itu. Lihat baris 160:',
          '<code>160 A=1:B=1:CP(1)=DK(CD):HOLD=CD:CD=0:GOSUB 2220:CD=HOLD</code>',
          'Nilai kartunya disimpan ke <code>CP(1)</code> seperti biasa. Lalu ' +
          'nomor urutnya dititipkan ke <code>HOLD</code>, dan <code>CD</code> ' +
          '&mdash; penunjuk kartu yang dipakai penggambar &mdash; diisi ' +
          '<b>nol</b>.',
          'Penggambar di baris 2320 membaca <code>LIN$(1,DK(CD))</code>. ' +
          'Dengan <code>CD=0</code>, <code>DK(0)</code> juga nol, dan baris ' +
          'DATA pertama (2470) berisi lima baris "XXXXXXXXX". Punggung kartu.',
          'Waktu tiba saatnya membuka, baris 560:',
          '<code>560 A=1:SWAP CD,HOLD:B=1:GOSUB 2220:SWAP HOLD,CD</code>',
          'Nomornya ditukar kembali, kartunya digambar ulang <b>di tempat ' +
          'yang sama</b>, dan ditukar lagi. Satu perintah, dan kartunya ' +
          'terbuka.',
          'Ini pola yang layak diingat: <b>keadaan yang diwakili oleh nilai ' +
          'data, bukan oleh bendera terpisah</b>. Tidak ada yang bisa lupa ' +
          'memeriksa benderanya, karena benderanya tidak ada.'
        ] },
      { judul: 'Mengocok dengan menolak',
        isi: [
          'Cara mengocok dek di program ini, baris 2100-2180:',
          '<code>FOR A=1 TO 13</code> &mdash; tiap nilai kartu<br>' +
          '<code>&nbsp;FOR C=1 TO 4</code> &mdash; tiap suku<br>' +
          '<code>&nbsp;&nbsp;B=FIX(RND*52)+1</code> &mdash; lempar tempat<br>' +
          '<code>&nbsp;&nbsp;IF DK(B)&lt;&gt;0 THEN 2130</code> &mdash; ' +
          'terisi? lempar lagi<br>' +
          '<code>&nbsp;&nbsp;DK(B)=A:CDSU(B)=C</code>',
          'Namanya <b>penolakan</b>: coba, dan kalau hasilnya tidak boleh, ' +
          'coba lagi. Benar &mdash; tiap susunan dek punya peluang yang sama ' +
          '&mdash; dan seluruhnya lima baris tanpa larik bantu.',
          'Harganya terlihat menjelang akhir. Waktu tinggal satu tempat ' +
          'kosong, tiap lemparan cuma punya peluang 1 dari 52 mengenainya, ' +
          'jadi rata-rata perlu 52 lemparan untuk kartu terakhir. Seluruh dek ' +
          'butuh sekitar 236 lemparan alih-alih 52.',
          'Untuk 52 kartu, itu tidak terasa. Untuk lima puluh ribu, program ' +
          'ini akan tampak menggantung. Algoritma yang benar dan algoritma ' +
          'yang <b>terus</b> benar waktu dibesarkan adalah dua hal berbeda.',
          'Cara yang tidak menolak &mdash; kocokan Fisher-Yates &mdash; ' +
          'menukar tiap kartu dengan kartu acak di depannya, sekali jalan, ' +
          '52 langkah tepat. Sama benarnya, dan tidak pernah melambat.'
        ] },
      { judul: 'Seratus sembilan puluh baris yang tidak melakukan apa pun',
        isi: [
          'Baris 2700 sampai 2890 memuat satu subrutin lengkap: penggambar ' +
          'tumpukan keping taruhan di meja.',
          'Tidak ada satu pun <code>GOSUB 2700</code> atau <code>GOTO 2700</code> ' +
          'di seluruh program. Baris 2690 berakhir dengan <code>RETURN</code>, ' +
          'dan tidak ada yang jatuh ke sana.',
          'Dari mana asalnya? Bandingkan dengan CRAPS.BAS baris 2310-2500 ' +
          '&mdash; sama persis, termasuk nama variabelnya. Dan salah satu ' +
          'variabel itu, <code>P</code>, di CRAPS.BAS berarti "bertaruh PASS ' +
          'atau DON&rsquo;T PASS". Di sini <code>P</code> tidak pernah diisi ' +
          'sama sekali; nilainya nol selamanya.',
          'Jadi ceritanya jelas: penulisnya menyalin blok kode yang berguna ' +
          'dari permainan sebelumnya, lalu memutuskan memakai cara lain ' +
          '(baris 2620-2680, yang menggambar tumpukan di tepi kanan) &mdash; ' +
          'dan lupa membuang yang lama.',
          'Kode mati begini tidak membuat program salah. Yang dirusaknya ' +
          'kepercayaan: pembaca berikutnya harus membaca seluruh 190 baris ' +
          'itu untuk tahu bahwa ia tidak perlu membacanya. Dan di penelusur, ' +
          'sorotannya tidak akan pernah sekali pun menyentuh baris-baris itu ' +
          '&mdash; itulah caranya terlihat.'
        ] }
    ]
  };
})(window);
