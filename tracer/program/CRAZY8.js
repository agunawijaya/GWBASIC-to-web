/* ===========================================================================
   CRAZY8.js — porting minimalis CRAZY8.BAS sebagai tabel baris.

       1000 REM Author Les Davids

   Crazy Eights lawan komputer. Dua ratus sembilan puluh empat baris.

   YANG PALING LAYAK DILIHAT: KARTU DIGAMBAR DENGAN MENGUBAH SATU KISI
   BERSAMA, BUKAN MEMBUATNYA ULANG.

       3470 IF PASS = 1 THEN 3630     ' bingkainya sudah ada, langsung ke isi
       3480 PASS=1
       3530 FIG$(1,1)=CHR$(201)       ' pojok kiri atas — sekali seumur hidup
       ...
       3660 IF MID$(THE$,1,1)=" " THEN FIG$(2,2)=MID$(THE$,2,1) ...

   `FIG$(5,5)` adalah SATU kisi 5x5 yang dipakai semua kartu bergantian.
   Bingkainya digambar sekali, lalu tiap kartu cuma menimpa empat sel di
   dalamnya. Kartu berikutnya menimpanya lagi.

   Dan cara mengosongkannya adalah lewat pintu yang sama:

       3630 IF THE$="   " THEN ...semua sel jadi spasi... : PASS=0 : RETURN

   `PASS=0` memaksa bingkainya digambar ulang di panggilan berikutnya. Satu
   bendera, dan sebuah kisi yang tahu kapan dirinya perlu dibangun kembali.

   TAPI PINTU ITU TIDAK PERNAH DIKETUK.

       1650 THE$="   ": GOSUB 3370

   Baris 3370 isinya `RETURN`. Yang dimaksud hampir pasti 3460. Jadi
   pengosongan kisinya tidak pernah terjadi, dan `PASS` tidak pernah kembali
   nol sesudah disetel di baris 3480.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` dan `SOUND` diam.
   - `RANDOMIZE` memasang benih tetap; baris 2520-2540 tetap ditelusuri
     supaya terlihat bahwa benihnya dibangun dari menit dan detik.
   - `SWAP` ditulis sebagai tukar biasa.
   - `MID$(A$,n,1)=B$` — MID$ sebagai SASARAN penugasan — ditiru dengan
     menyambung potongan string, karena JavaScript tidak punya padanannya.
   - `WHILE`/`WEND` ditiru sebagai lompatan bersyarat: `WHILE` melompat ke
     baris sesudah `WEND` kalau syaratnya salah, dan `WEND` melompat balik.
   =========================================================================== */

(function (global) {
  'use strict';

  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  /* MID$ sebagai sasaran penugasan: timpa satu aksara tanpa mengubah
     panjangnya. */
  function timpa(s, ke, isi) {
    return s.slice(0, ke - 1) + isi.charAt(0) + s.slice(ke);
  }

  var tabel = [

    rem(1000),
    { baris: 1010, jalan: function (m) {
        m.dim('SUIT$()', 4); m.dim('CARD$()', 52); m.dim('DECK$()', 52);
      } },
    { baris: 1020, jalan: function (m) { m.dim('FIG$()', 5, 5); } },
    { baris: 1030, jalan: function () { /* DEFINT A-Z */ } },
    { baris: 1040, jalan: function (m) {
        m.dim('DECK()', 52); m.dim('PHAND$()', 26); m.dim('CHAND$()', 26);
      } },
    { baris: 1050, jalan: function (m) {
        m.dim('TEST()', 52); m.dim('OLDHAND$()', 25);
      } },
    { baris: 1060, jalan: function (m) { m.warna(0, 2); m.cls(); } },
    { baris: 1070, jalan: function () { } },
    { baris: 1080, jalan: function (m) { m.locate(2, 9); } },
    cet(1090, 'C R A Z Y   E I G H T S'),
    { baris: 1100, jalan: function (m) {
        m.dim('VALUE$()', 13); m.dim('VALUE()', 13);
      } },
    { baris: 1110, jalan: function (m) { m.locate(4, 1); } },
    cet(1120, 'The objective of the game is to get rid'),
    cet(1130, 'of all your cards by placing them on'),
    cet(1140, 'the discard pile.'),
    cet(1150, 'You can play a card if you have the '),
    cet(1160, 'same suit, the same number (in which'),
    cet(1170, 'case the suit changes), or at any time'),
    cet(1180, 'you can play an eight. If you play an'),
    cet(1190, 'eight you will be prompted for new suit (h,c,s,d).'),
    cet(1200, 'If you cannot go, hit the space bar.'),
    cet(1210, 'You will then be dealt a new card.'),
    { baris: 1220, jalan: function (m) { m.barisBaru(); } },
    cet(1230, 'Game will end at 100 points.'),
    cet(1240, 'The winner receives points from the'),
    cet(1250, 'losers hand. Points are equal to '),
    cet(1260, 'face value. Face cards are 10 each,'),
    cet(1270, 'aces are worth 15.'),
    { baris: 1280, bagian: [
        function (m) { m.locate(22, 15); },
        function (m) { m.masukan('N$', 'NAME '); }
      ] },
    { baris: 1290, jalan: function (m) { m.cls(); m.locate(2, 9); } },
    { baris: 1300, jalan: function (m) {
        m.data(['A', '2', '3', '4', '5', '6', '7']);
      } },
    { baris: 1310, jalan: function (m) {
        m.data(['8', '9', '0', 'J', 'Q', 'K']);
      } },
    /* 1320 As bernilai LIMA BELAS — bukan sebelas, bukan satu. Aturan rumah
       yang dipasang penulisnya sendiri, dan disebutkan di baris 1270. */
    { baris: 1320, jalan: function (m) {
        m.data([15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]);
      } },
    { baris: 1330, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 13; m.v.I++) {
          m.v['VALUE$()'][m.v.I] = m.baca();
        }
      } },
    { baris: 1340, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 13; m.v.I++) {
          m.v['VALUE()'][m.v.I] = m.baca();
        }
      } },
    cet(1350, 'C R A Z Y   E I G H T S'),
    { baris: 1360, jalan: function (m) {
        m.locate(5, 2); m.cetak('SCORE'); m.barisBaru();
      } },
    { baris: 1370, jalan: function (m) {
        m.locate(6, 4);
        m.cetak('COMPUTER' + basic(m.v.CSCORE || 0)); m.barisBaru();
      } },
    { baris: 1380, jalan: function (m) {
        m.locate(7, 4);
        m.cetak((m.v['N$'] || '') + basic(m.v.PSCORE || 0)); m.barisBaru();
      } },
    { baris: 1390, jalan: function (m) { m.untuk('I', 1, 40, 1, 1420); } },
    { baris: 1400, jalan: function (m) {
        m.locate(9, m.v.I); m.cetak(m.chr(205)); m.barisBaru();
      } },
    { baris: 1410, jalan: function (m) { m.lanjutkan('I'); } },
    rem(1420),
    { baris: 1430, jalan: function (m) { m.gosub(2500); } },
    rem(1440),
    /* 1450 PUTIH DI ATAS PUTIH — tulisan jadi tak terlihat selama pembagian
       kartu, supaya tidak ada yang mengintip. */
    { baris: 1450, jalan: function (m) { m.warna(7, 7); } },
    { baris: 1460, jalan: function (m) { m.untuk('I', 1, 8, 1, 1510); } },
    { baris: 1470, jalan: function (m) { m.v.J = 1 + (m.v.I - 1) * 2; } },
    { baris: 1480, jalan: function (m) {
        m.v['PHAND$()'][m.v.I] = m.v['DECK$()'][m.v.J];
      } },
    { baris: 1490, jalan: function (m) {
        m.v['CHAND$()'][m.v.I] = m.v['DECK$()'][m.v.J + 1];
      } },
    { baris: 1500, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1510, jalan: function (m) { m.v.NEXTCARD = 18; } },
    { baris: 1520, jalan: function (m) { m.v['UPCARD$'] = m.v['DECK$()'][17]; } },
    { baris: 1530, jalan: function (m) { m.v.PCARDS = 8; } },
    { baris: 1540, jalan: function (m) { m.v.CCARDS = 8; } },
    rem(1550),
    /* 1560-1640 GELEMBUNG YANG MENGURUT MENURUT LAMBANG SAJA — `MID$(x,3)`
       adalah aksara ketiga dan seterusnya, dan kartu cuma tiga aksara. Jadi
       kartu berkelompok menurut lambangnya, tapi tidak urut di dalamnya. */
    { baris: 1560, jalan: function (m) { m.v.SORTTEST = 1; } },
    /* 1570 `WHILE+ SORTTEST` — tanda tambah di depan pencacahnya. Plus uner
       yang tidak mengubah apa pun. Muncul tiga kali di berkas ini. */
    { baris: 1570, jalan: function (m) { if (!m.v.SORTTEST) m.lompat(1650); } },
    { baris: 1580, jalan: function (m) { m.v.SORTTEST = 0; } },
    { baris: 1590, jalan: function (m) { m.untuk('I', 1, m.v.PCARDS - 1, 1, 1640); } },
    { baris: 1600, jalan: function (m) {
        m.v['CHAR1$'] = (m.v['PHAND$()'][m.v.I] || '   ').slice(2);
      } },
    { baris: 1610, jalan: function (m) {
        m.v['CHAR2$'] = (m.v['PHAND$()'][m.v.I + 1] || '   ').slice(2);
      } },
    { baris: 1620, jalan: function (m) {
        if (m.v['CHAR1$'] > m.v['CHAR2$']) {
          var t = m.v['PHAND$()'][m.v.I];
          m.v['PHAND$()'][m.v.I] = m.v['PHAND$()'][m.v.I + 1];
          m.v['PHAND$()'][m.v.I + 1] = t;
          m.v.SORTTEST = 1;
        }
      } },
    { baris: 1630, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1640, jalan: function (m) { m.lompat(1570); } },
    /* 1650 PANGGILAN YANG TIDAK MELAKUKAN APA-APA. Baris 3370 isinya
       `RETURN`. Yang dimaksud hampir pasti 3460 — pembuat gambar kartu, yang
       kalau diberi "   " akan mengosongkan kisinya dan menyetel PASS=0.
       Lihat catatan cacat. */
    { baris: 1650, bagian: [
        function (m) { m.v['THE$'] = '   '; },
        function (m) { m.gosub(3370); }
      ] },
    { baris: 1660, bagian: [
        function (m) { m.v['THE$'] = m.v['UPCARD$']; },
        function (m) { m.gosub(3460); }
      ] },
    { baris: 1670, bagian: [
        function (m) { m.v.ROW = 4; m.v.COL = 19; },
        function (m) { m.gosub(3380); }
      ] },
    { baris: 1680, jalan: function (m) { m.v.ROW = 10; } },
    { baris: 1690, jalan: function (m) { m.untuk('I', 1, 6, 1, 1780); } },
    /* 1700 gelung tampilan sengaja jalan SATU LEBIH dari jumlah kartu —
       petak yang baru saja kosong itulah yang perlu dihapus. */
    { baris: 1700, jalan: function (m) {
        if (m.v.I > m.v.PCARDS + 1) m.lompat(1750);
      } },
    /* 1710 SINGGAHAN GAMBAR: kartu yang tidak berubah tidak digambar ulang.
       `OLDHAND$()` menyimpan apa yang sudah ada di layar. */
    { baris: 1710, jalan: function (m) {
        if (m.v['PHAND$()'][m.v.I] === m.v['OLDHAND$()'][m.v.I]) m.lompat(1770);
      } },
    { baris: 1720, jalan: function (m) {
        m.v['OLDHAND$()'][m.v.I] = m.v['PHAND$()'][m.v.I];
      } },
    { baris: 1730, bagian: [
        function (m) { m.v['THE$'] = m.v['PHAND$()'][m.v.I] || '   '; },
        function (m) { m.gosub(3460); }
      ] },
    { baris: 1740, bagian: [
        function (m) { m.v.COL = 1 + 6 * (m.v.I - 1); },
        function (m) { m.gosub(3380); }
      ] },
    { baris: 1750, jalan: function (m) { m.locate(15, 2 + (m.v.I - 1) * 6); } },
    { baris: 1760, jalan: function (m) {
        if (m.v.I <= m.v.PCARDS) m.cetak(basic(m.v.I)); else m.cetak('  ');
        m.barisBaru();
      } },
    { baris: 1770, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1780, jalan: function (m) { m.v.ROW = 17; } },
    { baris: 1790, jalan: function (m) { m.untuk('I', 7, m.v.PCARDS + 1, 1, 1960); } },
    { baris: 1800, jalan: function (m) { m.v.J = m.v.I - 6; } },
    { baris: 1810, jalan: function (m) {
        if (m.v['PHAND$()'][m.v.I] === m.v['OLDHAND$()'][m.v.I]) m.lompat(1950);
      } },
    { baris: 1820, jalan: function (m) {
        m.v['OLDHAND$()'][m.v.I] = m.v['PHAND$()'][m.v.I];
      } },
    { baris: 1830, bagian: [
        function (m) { m.v['THE$'] = m.v['PHAND$()'][m.v.I] || '   '; },
        function (m) { m.gosub(3460); }
      ] },
    { baris: 1840, bagian: [
        function (m) { m.v.COL = 1 + 6 * (m.v.J - 1); },
        function (m) { m.gosub(3380); }
      ] },
    { baris: 1850, jalan: function (m) { m.locate(22, 2 + (m.v.I - 7) * 6); } },
    { baris: 1860, jalan: function (m) {
        if (m.v.I === m.v.PCARDS + 1) {
          m.cetak('  '); m.barisBaru(); m.lompat(1950);
        }
      } },
    { baris: 1870, jalan: function (m) {
        if (m.v.I < 10) { m.cetak(basic(m.v.I)); m.barisBaru(); }
      } },
    /* 1880-1940 kartu kesepuluh ke atas diberi HURUF, karena angka dua digit
       tidak muat di jarak enam kolom antar kartu. */
    label(1880, 10, ' A'), label(1890, 11, ' B'), label(1900, 12, ' C'),
    label(1910, 13, ' D'), label(1920, 14, ' E'), label(1930, 15, ' F'),
    label(1940, 16, ' G'),
    { baris: 1950, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1960, jalan: function (m) {
        m.locate(23, 20); m.cetak('ENTER YOUR PLAY'); m.barisBaru();
      } },
    { baris: 1970, jalan: function (m) {
        m.v['IN$'] = m.inkey();
        if (m.v['IN$'] === '') m.lompat(1970);
      } },
    { baris: 1980, jalan: function (m) {
        m.locate(7, 29); m.cetak('           '); m.barisBaru();
      } },
    { baris: 1990, jalan: function (m) {
        m.locate(23, 20); m.cetak('THINKING       '); m.barisBaru();
      } },
    { baris: 2000, jalan: function (m) { if (m.v['IN$'] !== ' ') m.lompat(2080); } },
    /* 2010 spasi kedua berturut-turut berarti "menyerah giliran" — `TAKE`
       mengingat bahwa kartu sudah diambil sekali. */
    { baris: 2010, jalan: function (m) { if (m.v.TAKE === 1) m.lompat(2420); } },
    { baris: 2020, jalan: function (m) { m.v.PCARDS = m.v.PCARDS + 1; } },
    { baris: 2030, jalan: function (m) { if (m.v.NEXTCARD === 53) m.lompat(3850); } },
    { baris: 2040, jalan: function (m) {
        m.v['PHAND$()'][m.v.PCARDS] = m.v['DECK$()'][m.v.NEXTCARD];
      } },
    { baris: 2050, jalan: function (m) { m.v.NEXTCARD = m.v.NEXTCARD + 1; } },
    { baris: 2060, jalan: function (m) { m.v.TAKE = 1; } },
    { baris: 2070, jalan: function (m) { m.lompat(1560); } },
    { baris: 2080, jalan: function (m) { if (m.v['IN$'] > '9') m.lompat(2110); } },
    { baris: 2090, jalan: function (m) { m.v.IN = parseInt(m.v['IN$'], 10) || 0; } },
    { baris: 2100, jalan: function (m) { m.lompat(2210); } },
    huruf(2110, 'a', 10), huruf(2120, 'b', 11), huruf(2130, 'c', 12),
    huruf(2140, 'd', 13), huruf(2150, 'e', 14),
    /* 2160 SALINAN BARIS DI ATASNYA yang hurufnya lupa diganti jadi "f".
       Akibatnya bukan cuma kartu ke-15 kehilangan tombol — baris ini
       MENIMPA baris 2150, jadi menekan "e" memilih kartu ke-15, bukan
       ke-14. Terukur di penelusur: "e" memberi IN=15.
       Kartu ke-14 dan ke-16 sama sekali tidak punya tombol. */
    huruf(2160, 'e', 15),
    /* 2170 dan penjaganya cuma menerima a sampai e, jadi "f" dan "g" yang
       ditulis baris 1930 dan 1940 di layar ditolak mentah-mentah. */
    { baris: 2170, jalan: function (m) {
        if (m.v['IN$'] < 'a' || m.v['IN$'] > 'e') m.lompat(2180);
        else m.lompat(2210);
      } },
    { baris: 2180, jalan: function (m) { m.locate(23, 20); } },
    { baris: 2190, jalan: function (m) {
        m.cetak('WRONG CARD'); m.barisBaru();
      } },
    { baris: 2200, jalan: function (m) { m.lompat(1960); } },
    { baris: 2210, jalan: function (m) {
        m.v['IN$'] = m.v['PHAND$()'][m.v.IN] || '   ';
      } },
    { baris: 2220, jalan: function (m) {
        if (m.v['IN$'].charAt(1) === '8') m.lompat(2280);
      } },
    { baris: 2230, jalan: function (m) {
        if (m.v['IN$'].slice(0, 2) === m.v['UPCARD$'].slice(0, 2)) m.lompat(2370);
      } },
    { baris: 2240, jalan: function (m) {
        if (m.v['IN$'].charAt(2) === m.v['UPCARD$'].charAt(2)) m.lompat(2370);
      } },
    { baris: 2250, jalan: function (m) { m.locate(23, 20); } },
    { baris: 2260, jalan: function (m) { m.cetak('WRONG CARD'); m.barisBaru(); } },
    { baris: 2270, jalan: function (m) { m.lompat(1960); } },
    { baris: 2280, jalan: function (m) {
        m.locate(23, 20); m.cetak('WHAT SUIT?'); m.barisBaru();
      } },
    { baris: 2290, jalan: function (m) {
        m.v['S$'] = m.inkey();
        if (m.v['S$'] === '') m.lompat(2290);
      } },
    lambang(2300, 'c'), lambang(2310, 'd'), lambang(2320, 'h'), lambang(2330, 's'),
    { baris: 2340, jalan: function (m) { m.lompat(2290); } },
    rem(2350),
    /* 2360 MID$ SEBAGAI SASARAN PENUGASAN: lambang kartu delapan ditimpa di
       tempat, tanpa membangun ulang stringnya. */
    { baris: 2360, jalan: function (m) {
        m.v['IN$'] = timpa(m.v['IN$'], 3, m.v['S$']);
      } },
    { baris: 2370, jalan: function (m) { m.v.TAKE = 0; } },
    { baris: 2380, jalan: function (m) { m.v['UPCARD$'] = m.v['IN$']; } },
    { baris: 2390, jalan: function (m) { if (m.v.IN === m.v.PCARDS) m.lompat(2410); } },
    /* 2400 KARTU TERAKHIR PINDAH KE LUBANGNYA — tidak ada penggeseran larik.
       Urutan tangan jadi kacau, tapi baris 1560 mengurutkannya lagi. */
    { baris: 2400, jalan: function (m) {
        m.v['PHAND$()'][m.v.IN] = m.v['PHAND$()'][m.v.PCARDS];
      } },
    { baris: 2410, jalan: function (m) { m.v.PCARDS = m.v.PCARDS - 1; } },
    { baris: 2420, jalan: function (m) {
        m.v['PHAND$()'][m.v.PCARDS + 1] = '   ';
      } },
    { baris: 2430, jalan: function (m) { if (m.v.PCARDS === 0) m.lompat(3730); } },
    { baris: 2440, jalan: function (m) { m.v.TAKE = 0; } },
    { baris: 2450, jalan: function (m) { m.gosub(2860); } },
    { baris: 2460, jalan: function (m) { if (m.v.CCARDS === 0) m.lompat(3730); } },
    { baris: 2470, jalan: function (m) { m.v.TAKE = 0; } },
    { baris: 2480, jalan: function (m) { m.lompat(1550); } },

    /* --- 2500-2850: mengocok --------------------------------------------- */
    rem(2500),
    { baris: 2510, jalan: function (m) {
        m.locate(6, 29); m.cetak('NEW GAME'); m.barisBaru();
      } },
    { baris: 2520, jalan: function (m) { m.v['TIM$'] = '43'; } },
    { baris: 2530, jalan: function (m) { m.v['TIM$'] = m.v['TIM$'] + '07'; } },
    { baris: 2540, jalan: function (m) { m.v.SEED = parseInt(m.v['TIM$'], 10); } },
    { baris: 2550, jalan: function (m) { m.semai(m.v.SEED); } },
    { baris: 2560, jalan: function (m) { m.v.COUNT = 1; } },
    { baris: 2570, jalan: function (m) { if (!(m.v.COUNT < 53)) m.lompat(2660); } },
    /* 2580-2610 PENGOCOKAN DENGAN MENOLAK: ambil bilangan acak, buang kalau
       di luar 1-52 atau sudah pernah keluar. Kartu terakhir butuh puluhan
       lemparan sebelum kena — tapi hasilnya betul-betul seragam. */
    { baris: 2580, jalan: function (m) { m.v.NUMBR = Math.trunc(100 * m.acak()); } },
    { baris: 2590, jalan: function (m) { if (m.v.NUMBR > 52) m.lompat(2580); } },
    { baris: 2600, jalan: function (m) { if (m.v.NUMBR === 0) m.lompat(2580); } },
    { baris: 2610, jalan: function (m) {
        if (m.v['TEST()'][m.v.NUMBR] === 1) m.lompat(2580);
      } },
    { baris: 2620, jalan: function (m) { m.v['TEST()'][m.v.NUMBR] = 1; } },
    { baris: 2630, jalan: function (m) {
        m.v['DECK()'][m.v.COUNT] = m.v.NUMBR;
      } },
    { baris: 2640, jalan: function (m) { m.v.COUNT = m.v.COUNT + 1; } },
    { baris: 2650, jalan: function (m) { m.lompat(2570); } },
    /* 2660 NAMA KARTU DIBANGUN SEKALI SAJA. Kalau skornya sudah tidak nol,
       ini bukan permainan pertama — dan DATA-nya sudah habis dibaca. */
    { baris: 2660, jalan: function (m) {
        if ((m.v.PSCORE || 0) !== 0 || (m.v.CSCORE || 0) !== 0) m.lompat(2810);
      } },
    { baris: 2670, jalan: function (m) { m.data(['c', 'd', 'h', 's']); } },
    { baris: 2680, jalan: function (m) { m.untuk('I', 1, 4, 1, 2710); } },
    { baris: 2690, jalan: function (m) {
        m.v['SUIT$()'][m.v.I] = m.baca();
      } },
    { baris: 2700, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 2710, jalan: function (m) {
        m.data([' A', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7']);
      } },
    { baris: 2720, jalan: function (m) {
        m.data([' 8', ' 9', '10', ' J', ' Q', ' K']);
      } },
    { baris: 2730, jalan: function (m) { m.untuk('I', 1, 4, 1, 2810); } },
    { baris: 2740, jalan: function (m) { m.untuk('J', 1, 13, 1, 2790); } },
    { baris: 2750, jalan: function (m) { m.v.N = m.v.J + (m.v.I - 1) * 13; } },
    { baris: 2760, jalan: function (m) {
        m.v['CARD$()'][m.v.N] = m.baca();
      } },
    { baris: 2770, jalan: function (m) {
        m.v['CARD$()'][m.v.N] = m.v['CARD$()'][m.v.N] + m.v['SUIT$()'][m.v.I];
      } },
    { baris: 2780, jalan: function (m) { m.lanjutkan('J'); } },
    /* 2790 `RESTORE 2710` — tiga belas nama pangkat dibaca ULANG untuk tiap
       lambang. Tiga belas DATA melayani lima puluh dua kartu.
       Penelusur menyimpan seluruh DATA sebagai satu larik datar, jadi yang
       diberikan INDEKS, bukan nomor baris. Hitungannya: baris 1300 mengisi
       indeks 0-6, 1310 mengisi 7-12, 1320 mengisi 13-25, 2670 mengisi 26-29,
       dan baris 2710 mulai di INDEKS 30. */
    { baris: 2790, jalan: function (m) { m.ulangData(30); } },
    { baris: 2800, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 2810, jalan: function (m) { m.untuk('I', 1, 52, 1, 2850); } },
    { baris: 2820, jalan: function (m) {
        m.v['DECK$()'][m.v.I] = m.v['CARD$()'][m.v['DECK()'][m.v.I]];
      } },
    { baris: 2830, jalan: function () { /* PLAY: bunyi kartu dikocok */ } },
    { baris: 2840, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 2850, jalan: function (m) { m.kembali(); } },

    /* --- 2860-3370: giliran komputer ------------------------------------- */
    rem(2860), rem(2870),
    { baris: 2880, jalan: function (m) { m.v.TAKE = 0; } },
    { baris: 2890, jalan: function (m) { m.v.SORTTEST = 1; } },
    { baris: 2900, jalan: function (m) { if (!m.v.SORTTEST) m.lompat(2980); } },
    { baris: 2910, jalan: function (m) { m.v.SORTTEST = 0; } },
    { baris: 2920, jalan: function (m) { m.untuk('I', 1, m.v.CCARDS - 1, 1, 2970); } },
    { baris: 2930, jalan: function (m) {
        m.v['CHAR1$'] = (m.v['CHAND$()'][m.v.I] || '   ').slice(2);
      } },
    { baris: 2940, jalan: function (m) {
        m.v['CHAR2$'] = (m.v['CHAND$()'][m.v.I + 1] || '   ').slice(2);
      } },
    { baris: 2950, jalan: function (m) {
        if (m.v['CHAR1$'] > m.v['CHAR2$']) {
          var t = m.v['CHAND$()'][m.v.I];
          m.v['CHAND$()'][m.v.I] = m.v['CHAND$()'][m.v.I + 1];
          m.v['CHAND$()'][m.v.I + 1] = t;
          m.v.SORTTEST = 1;
        }
      } },
    { baris: 2960, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 2970, jalan: function (m) { m.lompat(2900); } },
    /* 2980-3130 SELURUH KECERDASAN KOMPUTER: cocokkan lambang dulu, lalu
       angka, lalu baru buang delapan. Tiga gelung, dan tidak ada yang lain.
       Delapan disimpan untuk terakhir karena ia kartu paling berharga. */
    rem(2980),
    { baris: 2990, jalan: function (m) { m.untuk('IN', 1, m.v.CCARDS, 1, 3040); } },
    { baris: 3000, jalan: function (m) { m.v['S$'] = m.v['UPCARD$'].charAt(2); } },
    { baris: 3010, jalan: function (m) {
        m.v['T$'] = (m.v['CHAND$()'][m.v.IN] || '   ').charAt(2);
      } },
    { baris: 3020, jalan: function (m) {
        if (m.v['S$'] === m.v['T$'] &&
            (m.v['CHAND$()'][m.v.IN] || '   ').charAt(1) !== '8') m.lompat(3320);
      } },
    { baris: 3030, jalan: function (m) { m.lanjutkan('IN'); } },
    rem(3040),
    { baris: 3050, jalan: function (m) { m.untuk('IN', 1, m.v.CCARDS, 1, 3100); } },
    { baris: 3060, jalan: function (m) { m.v['S$'] = m.v['UPCARD$'].slice(0, 2); } },
    { baris: 3070, jalan: function (m) {
        m.v['T$'] = (m.v['CHAND$()'][m.v.IN] || '   ').slice(0, 2);
      } },
    { baris: 3080, jalan: function (m) {
        if (m.v['S$'] === m.v['T$']) m.lompat(3320);
      } },
    { baris: 3090, jalan: function (m) { m.lanjutkan('IN'); } },
    rem(3100),
    { baris: 3110, jalan: function (m) { m.untuk('IN', 1, m.v.CCARDS, 1, 3140); } },
    { baris: 3120, jalan: function (m) {
        if ((m.v['CHAND$()'][m.v.IN] || '   ').charAt(1) === '8') m.lompat(3240);
      } },
    { baris: 3130, jalan: function (m) { m.lanjutkan('IN'); } },
    rem(3140),
    { baris: 3150, jalan: function (m) {
        if (m.v.TAKE === 1) { m.v.TAKE = 0; m.kembali(); }
      } },
    { baris: 3160, jalan: function (m) { m.v.TAKE = 1; } },
    { baris: 3170, jalan: function (m) { m.v.CCARDS = m.v.CCARDS + 1; } },
    { baris: 3180, jalan: function (m) {
        m.v['CHAND$()'][m.v.CCARDS] = m.v['DECK$()'][m.v.NEXTCARD];
      } },
    { baris: 3190, jalan: function (m) { m.v.NEXTCARD = m.v.NEXTCARD + 1; } },
    { baris: 3200, jalan: function (m) {
        m.locate(6, 29); m.cetak('CARDS ' + basic(m.v.CCARDS)); m.barisBaru();
      } },
    { baris: 3210, jalan: function (m) {
        m.locate(7, 29); m.cetak('TOOK CARD'); m.barisBaru();
      } },
    { baris: 3220, jalan: function (m) { if (m.v.NEXTCARD === 53) m.lompat(3850); } },
    { baris: 3230, jalan: function (m) { m.lompat(2890); } },
    rem(3240),
    /* 3250 KOMPUTER MEMILIH LAMBANG SESUDAH MEMBUANG DELAPAN — dan yang
       dipilih lambang kartu PERTAMA lainnya, bukan lambang yang paling
       banyak dipegangnya. Tangannya sudah urut menurut lambang, jadi
       "yang pertama" belum tentu "yang terbanyak". */
    { baris: 3250, jalan: function (m) {
        m.v['S$'] = (m.v.IN === 1)
          ? (m.v['CHAND$()'][2] || '   ').charAt(2)
          : (m.v['CHAND$()'][1] || '   ').charAt(2);
      } },
    { baris: 3260, jalan: function (m) {
        m.v['CHAND$()'][m.v.IN] = timpa(m.v['CHAND$()'][m.v.IN], 3, m.v['S$']);
      } },
    { baris: 3270, jalan: function (m) { m.locate(7, 29); } },
    sebut(3280, 'c', 'CLUBS    '), sebut(3290, 'd', 'DIAMONDS '),
    sebut(3300, 'h', 'HEARTS   '), sebut(3310, 's', 'SPADES   '),
    { baris: 3320, jalan: function (m) {
        m.v['UPCARD$'] = m.v['CHAND$()'][m.v.IN];
      } },
    { baris: 3330, jalan: function (m) {
        if (m.v.IN !== m.v.CCARDS) {
          m.v['CHAND$()'][m.v.IN] = m.v['CHAND$()'][m.v.CCARDS];
        }
      } },
    { baris: 3340, jalan: function (m) { m.v.CCARDS = m.v.CCARDS - 1; } },
    { baris: 3350, jalan: function (m) {
        m.locate(6, 29); m.cetak('CARDS ' + basic(m.v.CCARDS)); m.barisBaru();
      } },
    { baris: 3360, jalan: function (m) {
        if (m.v.CCARDS === 1) {
          m.locate(7, 29); m.cetak('LAST CARD'); m.barisBaru();
        }
      } },
    { baris: 3370, jalan: function (m) { m.kembali(); } },

    /* --- 3380-3450: mencetak kisi 5x5 ke layar --------------------------- */
    rem(3380),
    { baris: 3390, jalan: function (m) { m.untuk('SI', 1, 5, 1, 3440); } },
    { baris: 3400, jalan: function (m) { m.untuk('SJ', 1, 5, 1, 3430); } },
    { baris: 3410, jalan: function (m) {
        m.locate(m.v.ROW + m.v.SI - 1, m.v.COL + m.v.SJ - 1);
      } },
    { baris: 3420, jalan: function (m) {
        m.cetak((m.v['FIG$()'][m.v.SI] || [])[m.v.SJ] || ' '); m.barisBaru();
      } },
    { baris: 3430, bagian: [
        function (m) { m.lanjutkan('SJ'); },
        function (m) { m.lanjutkan('SI'); }
      ] },
    { baris: 3440, jalan: function (m) { m.warna(0, 2); } },
    { baris: 3450, jalan: function (m) { m.kembali(); } },

    /* --- 3460-3720: membangun gambar kartu di kisi bersama --------------- */
    rem(3460),
    /* 3470 KALAU BINGKAINYA SUDAH ADA, LANGSUNG KE ISINYA. Inilah inti
       berkas ini: satu kisi dipakai bergantian oleh semua kartu. */
    { baris: 3470, jalan: function (m) { if (m.v.PASS === 1) m.lompat(3630); } },
    { baris: 3480, jalan: function (m) { m.v.PASS = 1; } },
    sel(3490, 2, 4, ' '), sel(3500, 3, 4, ' '), sel(3510, 3, 2, ' '),
    sel(3520, 4, 2, ' '),
    selK(3530, 1, 1, 201), selK(3540, 1, 5, 187),
    selK(3550, 5, 1, 200), selK(3560, 5, 5, 188),
    { baris: 3570, jalan: function (m) { m.untuk('SI', 1, 3, 1, 3630); } },
    { baris: 3580, jalan: function (m) { m.v['FIG$()'][1][m.v.SI + 1] = m.chr(205); } },
    { baris: 3590, jalan: function (m) { m.v['FIG$()'][5][m.v.SI + 1] = m.chr(205); } },
    { baris: 3600, jalan: function (m) { m.v['FIG$()'][m.v.SI + 1][1] = m.chr(186); } },
    { baris: 3610, jalan: function (m) { m.v['FIG$()'][m.v.SI + 1][5] = m.chr(186); } },
    { baris: 3620, jalan: function (m) { m.lanjutkan('SI'); } },
    /* 3630 KARTU KOSONG MENGOSONGKAN KISINYA DAN MENYETEL `PASS=0` — memaksa
       bingkainya dibangun ulang nanti. Pintu masuk ini tidak pernah dipakai;
       lihat baris 1650. */
    { baris: 3630, jalan: function (m) {
        if (m.v['THE$'] === '   ') {
          for (var si = 1; si <= 5; si++) {
            for (var sj = 1; sj <= 5; sj++) m.v['FIG$()'][si][sj] = ' ';
          }
          m.warna(7, 2); m.v.PASS = 0; m.kembali();
        }
      } },
    { baris: 3640, jalan: function (m) {
        m.warna(7, 2); m.v['FIG$()'][2][3] = ' ';
      } },
    sel(3650, 4, 3, ' '),
    /* 3660 ANGKA SEPULUH ADALAH SATU-SATUNYA YANG DUA DIGIT, jadi ia satu
       satunya yang memakai dua sel di tiap pojok. */
    { baris: 3660, jalan: function (m) {
        var F = m.v['FIG$()'];
        if (m.v['THE$'].charAt(0) === ' ') {
          F[2][2] = m.v['THE$'].charAt(1); F[4][4] = F[2][2];
        } else {
          F[2][2] = '1'; F[2][3] = '0'; F[4][3] = '1'; F[4][4] = '0';
        }
      } },
    { baris: 3670, jalan: function (m) { m.v['S$'] = m.v['THE$'].charAt(2); } },
    /* 3680-3710 wajik dan hati MERAH, keriting dan sekop hitam — dan
       warnanya disetel di sini, bukan waktu kartunya dicetak. */
    warnaLambang(3680, 'd', 4, 4, 7), warnaLambang(3690, 'c', 5, 0, 7),
    warnaLambang(3700, 'h', 3, 4, 7), warnaLambang(3710, 's', 6, 0, 7),
    { baris: 3720, jalan: function (m) { m.kembali(); } },

    /* --- 3730-3940: menghitung skor dan mengulang ------------------------ */
    { baris: 3730, jalan: function (m) { m.locate(7, 29); } },
    { baris: 3740, jalan: function (m) {
        m.cetak(m.v.PCARDS === 0 ? '!!YOU WIN' : '!! I WIN '); m.barisBaru();
      } },
    { baris: 3750, jalan: function (m) { m.untuk('SI', 1, m.v.PCARDS, 1, 3800); } },
    { baris: 3760, jalan: function (m) {
        m.v['SPHAND$'] = (m.v['SPHAND$'] || '') + m.v['PHAND$()'][m.v.SI];
      } },
    { baris: 3770, jalan: function (m) { m.untuk('SJ', 1, 13, 1, 3790); } },
    /* 3780 PANGKAT DICOCOKKAN LEWAT SATU AKSARA. "10" ketemu VALUE$(10)="0"
       karena aksara keduanya memang "0". Kebetulan yang menyelamatkan. */
    { baris: 3780, jalan: function (m) {
        if ((m.v['PHAND$()'][m.v.SI] || '   ').charAt(1) ===
            (m.v['VALUE$()'][m.v.SJ] || '').charAt(0)) {
          m.v.CSCORE = (m.v.CSCORE || 0) + m.v['VALUE()'][m.v.SJ];
        }
      } },
    { baris: 3790, bagian: [
        function (m) { m.lanjutkan('SJ'); },
        function (m) { m.lanjutkan('SI'); }
      ] },
    { baris: 3800, jalan: function (m) { m.untuk('SI', 1, m.v.CCARDS, 1, 3850); } },
    { baris: 3810, jalan: function (m) {
        m.v['SCHAND$'] = (m.v['SCHAND$'] || '') + m.v['CHAND$()'][m.v.SI];
      } },
    { baris: 3820, jalan: function (m) { m.untuk('SJ', 1, 13, 1, 3840); } },
    { baris: 3830, jalan: function (m) {
        if ((m.v['CHAND$()'][m.v.SI] || '   ').charAt(1) ===
            (m.v['VALUE$()'][m.v.SJ] || '').charAt(0)) {
          m.v.PSCORE = (m.v.PSCORE || 0) + m.v['VALUE()'][m.v.SJ];
        }
      } },
    { baris: 3840, bagian: [
        function (m) { m.lanjutkan('SJ'); },
        function (m) { m.lanjutkan('SI'); }
      ] },
    /* 3850 DUA PINTU MASUK KE SATU BARIS. Dari 3840 ia lanjutan penghitungan
       skor. Dari 2030 dan 3220 — waktu dek habis — ia melompati SELURUH
       penghitungan, jadi tidak ada yang dapat angka dan tangannya diulang. */
    { baris: 3850, jalan: function (m) { m.untuk('SI', 1, 52, 1, 3880); } },
    { baris: 3860, jalan: function (m) { m.v['TEST()'][m.v.SI] = 0; } },
    { baris: 3870, jalan: function (m) { m.lanjutkan('SI'); } },
    { baris: 3880, jalan: function (m) {
        if ((m.v.PSCORE || 0) < 100 && (m.v.CSCORE || 0) < 100) m.lompat(1360);
      } },
    { baris: 3890, jalan: function (m) {
        m.locate(6, 4); m.cetak('COMPUTER' + basic(m.v.CSCORE || 0));
        m.barisBaru();
      } },
    { baris: 3900, jalan: function (m) {
        m.locate(7, 4);
        m.cetak((m.v['N$'] || '') + basic(m.v.PSCORE || 0)); m.barisBaru();
      } },
    cet(3910, 'thank you'),
    { baris: 3920, jalan: function (m) {
        m.locate(24, 20, 0); m.cetak('WANT ANOTHER GAME? ');
      } },
    { baris: 3930, jalan: function (m) {
        m.v['KY$'] = m.inkey();
        if (m.v['KY$'] === '') m.lompat(3930);
      } },
    { baris: 3940, jalan: function (m) {
        if (m.v['KY$'] === 'y' || m.v['KY$'] === 'Y') m.jalankan('CRAZY8');
        else { m.cls(); m.henti(); }
      } }
  ];

  function label(n, ke, teks) {
    return { baris: n, jalan: function (m) {
      if (m.v.I === ke) { m.cetak(teks); m.barisBaru(); }
    } };
  }
  function huruf(n, h, nilai) {
    return { baris: n, jalan: function (m) {
      if (m.v['IN$'] === h) m.v.IN = nilai;
    } };
  }
  function lambang(n, h) {
    return { baris: n, jalan: function (m) {
      if (m.v['S$'] === h) m.lompat(2350);
    } };
  }
  function sebut(n, h, teks) {
    return { baris: n, jalan: function (m) {
      if (m.v['S$'] === h) { m.cetak(teks); m.barisBaru(); }
    } };
  }
  function sel(n, si, sj, isi) {
    return { baris: n, jalan: function (m) { m.v['FIG$()'][si][sj] = isi; } };
  }
  function selK(n, si, sj, kode) {
    return { baris: n, jalan: function (m) {
      m.v['FIG$()'][si][sj] = m.chr(kode);
    } };
  }
  function warnaLambang(n, h, kode, depan, latar) {
    return { baris: n, jalan: function (m) {
      if (m.v['S$'] === h) {
        m.v['FIG$()'][3][3] = m.chr(kode); m.warna(depan, latar);
      }
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['CRAZY8'] = {
    nama: 'CRAZY8',
    judul: 'Crazy Eights (Les Davids)',
    sumber: 'CRAZY8',
    berkas: 'run/CRAZY8.BAS',
    tabel: tabel,
    benih: 73,

    arsitektur: {
      judul: 'Alur CRAZY8.BAS',
      simpul: [
        { id: 'siap', baris: '1000-1290', jenis: 'mulai',
          teks: ['Petunjuk, lalu tanya nama'] },
        { id: 'kocok', baris: '2500-2850', jenis: 'subrutin',
          teks: ['Ambil nomor acak, tolak', 'yang sudah pernah keluar'] },
        { id: 'bagi', baris: '1450-1540',
          teks: ['Delapan kartu tiap pihak,', 'diambil selang-seling'] },
        { id: 'urut', baris: '1560-1640',
          teks: ['Gelembung, menurut', 'LAMBANG saja'] },
        { id: 'gambar', baris: '3460-3720', jenis: 'subrutin',
          teks: ['Satu kisi 5x5 bersama;', 'bingkai digambar sekali'] },
        { id: 'main', baris: '1960-2480', jenis: 'putusan',
          teks: ['1-9 dan a-e memilih kartu;', 'spasi = ambil kartu'] },
        { id: 'komputer', baris: '2860-3370', jenis: 'subrutin',
          teks: ['Lambang dulu, lalu angka,', 'delapan paling akhir'] },
        { id: 'skor', baris: '3730-3880', jenis: 'keluar',
          teks: ['Nilai tangan yang kalah', 'jadi angka yang menang'] }
      ],
      panah: [
        { dari: 'siap', ke: 'kocok' },
        { dari: 'kocok', ke: 'bagi' },
        { dari: 'bagi', ke: 'urut' },
        { dari: 'urut', ke: 'gambar' },
        { dari: 'gambar', ke: 'main' },
        { dari: 'main', ke: 'komputer' },
        { dari: 'komputer', ke: 'urut', label: 'giliran berikutnya' },
        { dari: 'main', ke: 'skor', label: 'kartu habis' },
        { dari: 'komputer', ke: 'skor', label: 'kartu habis' },
        { dari: 'skor', ke: 'kocok', label: 'skor masih di bawah 100' }
      ]
    },

    pseudokode: [
      { baris: 3470, tingkat: 0, teks: '<code>IF PASS=1 THEN 3630</code> &mdash; <b>bingkai kartu digambar sekali seumur hidup</b>' },
      { baris: 3630, tingkat: 1, teks: 'kartu kosong mengosongkan kisinya dan menyetel <code>PASS=0</code>&hellip;' },
      { baris: 1650, tingkat: 2, teks: '&hellip;tapi <code>GOSUB 3370</code> mendarat di sebuah <code>RETURN</code>. <b>Pintu itu tak pernah diketuk</b>' },
      { baris: 1710, tingkat: 0, teks: 'kartu yang tidak berubah <b>tidak digambar ulang</b> &mdash; singgahan lewat <code>OLDHAND$()</code>' },
      { baris: 2580, tingkat: 0, teks: 'kocok dengan <b>menolak</b>: ambil acak, buang yang di luar 1&ndash;52 atau sudah keluar' },
      { baris: 2360, tingkat: 0, teks: '<code>MID$(IN$,3,1)=&hellip;</code> &mdash; MID$ sebagai <b>sasaran</b>, mengganti lambang di tempat' },
      { baris: 2400, tingkat: 0, teks: 'kartu terakhir pindah ke lubangnya; tidak ada larik yang digeser' },
      { baris: 2990, tingkat: 0, teks: 'komputer: lambang dulu&hellip;' },
      { baris: 3050, tingkat: 1, teks: '&hellip;lalu angka&hellip;' },
      { baris: 3110, tingkat: 2, teks: '&hellip;dan <b>delapan paling akhir</b>, karena ia kartu paling berharga' },
      { baris: 2160, tingkat: 0, teks: 'salinan yang lupa diganti: <code>"e"</code> memilih kartu <b>15</b>, bukan 14' },
      { baris: 2170, tingkat: 1, teks: 'dan penjaganya menolak <code>"f"</code>&mdash;<code>"g"</code>: <b>kartu 14 dan 16 tak punya tombol</b>' }
    ],

    perintahAsli: 'run\\CRAZY8.bat',
    catatanAsli: 'Tekan 1-9 atau a-e untuk memainkan kartu, spasi untuk ' +
      'mengambil kartu baru. Kalau memainkan delapan, tekan h, c, s, atau d ' +
      'untuk lambang berikutnya.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Baris 2830 ' +
      'membunyikan satu nada per kartu selama pengocokan &mdash; lima puluh ' +
      'dua kali.',

      '<b><code>RANDOMIZE</code> memasang benih tetap.</b> Baris 2520-2540 ' +
      'tetap ditelusuri supaya terlihat bahwa benihnya dibangun dari menit ' +
      'dan detik jam sistem.',

      '<b><code>SWAP</code> ditulis sebagai tukar biasa</b> lewat variabel ' +
      'sementara.',

      '<b><code>MID$(A$,n,1)=B$</code> ditiru dengan menyambung potongan ' +
      'string.</b> Di BASIC ini pernyataan tersendiri &mdash; MID$ sebagai ' +
      '<b>sasaran</b> penugasan, yang menimpa aksara tanpa mengubah panjang ' +
      'stringnya. JavaScript tidak punya padanannya.',

      '<b><code>WHILE</code>/<code>WEND</code> ditiru sebagai lompatan ' +
      'bersyarat</b>: <code>WHILE</code> melompat ke baris sesudah ' +
      '<code>WEND</code> kalau syaratnya salah, dan <code>WEND</code> ' +
      'melompat balik. Alurnya sama persis.'
    ],

    pelajaran: {
      ringkas: 'Kartu digambar dengan mengubah satu kisi 5&times;5 yang ' +
        'dipakai bergantian &mdash; dan pintu untuk mengosongkannya tidak ' +
        'pernah diketuk siapa pun.',
      pelajari: [
        ['Satu kisi untuk lima puluh dua kartu',
         '<code>FIG$(5,5)</code> adalah <b>satu</b> kisi lima kali lima. ' +
         'Bingkainya &mdash; empat pojok, empat sisi &mdash; digambar sekali, ' +
         'lalu <code>PASS=1</code> menandainya sudah ada. Kartu berikutnya ' +
         'melompati seluruh bagian itu dan cuma menimpa empat sel di dalamnya: ' +
         'pangkat di dua pojok, lambang di tengah.',
         'Dua puluh lima sel untuk lima puluh dua kartu, dan yang berubah ' +
         'cuma empat.'],
        ['Menggambar ulang hanya yang berubah',
         '<code>OLDHAND$()</code> menyimpan apa yang sudah ada di layar. ' +
         'Baris 1710 dan 1810 membandingkannya dengan tangan sekarang, dan ' +
         'kartu yang sama <b>dilewati</b>. Di layar teks 1983 yang menggambar ' +
         'satu kartu dengan dua puluh lima <code>LOCATE</code>, itu selisih ' +
         'yang terasa.'],
        ['Gelung yang sengaja jalan satu lebih',
         'Baris 1700 dan 1790 memakai <code>PCARDS+1</code> sebagai batas. ' +
         'Kartu ke-<i>n</i>+1 tidak ada &mdash; dan itulah maksudnya: petak ' +
         'yang baru saja dikosongkan harus <b>dihapus dari layar</b>. Batas ' +
         'yang kelebihan satu, disengaja, dan tepat.'],
        ['MID$ di sebelah kiri tanda sama dengan',
         'Baris 2360: <code>MID$(IN$,3,1)=MID$(S$,1,1)</code>. Di BASIC, ' +
         '<code>MID$</code> bisa jadi <b>sasaran</b> penugasan &mdash; ia ' +
         'menimpa aksara di tempatnya tanpa mengubah panjang string. Itu cara ' +
         'mengganti lambang sebuah kartu delapan tanpa membangun ulang ' +
         'stringnya, dan bahasa modern jarang punya padanannya.'],
        ['Menghapus dari tengah tanpa menggeser',
         'Baris 2400: kartu <b>terakhir</b> dipindah ke lubang yang ' +
         'ditinggalkan kartu yang baru dimainkan, lalu jumlahnya dikurangi. ' +
         'Urutannya jadi kacau &mdash; tapi baris 1560 mengurutkannya lagi ' +
         'sebelum digambar, jadi tidak ada yang tahu.']
      ],
      hindari: [
        ['Pintu yang tidak pernah diketuk',
         'Baris 3630 punya jalur khusus: kalau kartunya <code>"   "</code>, ' +
         'seluruh kisi dikosongkan dan <code>PASS</code> dikembalikan ke nol, ' +
         'supaya bingkainya dibangun ulang nanti. Jalur itu masuk akal dan ' +
         'ditulis dengan hati-hati.',
         'Satu-satunya tempat yang mencoba memakainya adalah baris 1650: ' +
         '<code>THE$="   ": GOSUB 3370</code>. Tapi baris <b>3370</b> isinya ' +
         '<code>RETURN</code>. Yang dimaksud <b>3460</b>.',
         'Jadi baris 1650 memanggil sesuatu, kembali seketika, dan tidak ' +
         'melakukan apa pun. Kesalahan satu digit, dan sebuah cabang yang ' +
         'ditulis lengkap jadi tidak pernah dijalankan sekali pun.'],
        ['Baris yang disalin tanpa diperbaiki',
         'Baris 2150: <code>IF IN$="e" THEN IN=14</code>. Baris 2160: ' +
         '<code>IF IN$="e" THEN IN=15</code>. Hurufnya lupa diganti jadi ' +
         '"f".',
         'Akibatnya lebih dalam daripada kelihatannya. Keduanya menguji huruf ' +
         'yang <b>sama</b>, dan yang belakangan menang &mdash; jadi menekan ' +
         '"e" memilih kartu ke-<b>15</b>, bukan ke-14. Terukur di penelusur: ' +
         '<code>IN=15</code>.',
         'Lalu baris 2170 menutup sisanya: <code>IF IN$&lt;"a" OR ' +
         'IN$&gt;"e"</code> menolak "f" dan "g" mentah-mentah, walaupun baris ' +
         '1930 dan 1940 dengan rapi mencetak "F" dan "G" di bawah kartu ke-15 ' +
         'dan ke-16.',
         'Hasil akhirnya: dari tujuh kartu yang bisa dipegang di baris kedua, ' +
         '<b>kartu ke-14 dan ke-16 tidak punya tombol sama sekali</b>, dan ' +
         'tombol yang seharusnya milik kartu ke-14 menunjuk ke kartu ke-15. ' +
         'Satu huruf yang lupa diganti, tiga kartu yang terpengaruh.'],
        ['Plus yang tidak menambah apa-apa',
         '<code>WHILE+ SORTTEST</code> di baris 1570, 2570, dan 2900. Tanda ' +
         'tambah di depan sebuah variabel adalah plus uner yang sah dan tidak ' +
         'berarti apa-apa. Tiga kali, konsisten &mdash; jadi bukan salah ketik ' +
         'sekali, melainkan kebiasaan.'],
        ['Kecerdasan yang memilih lambang secara asal',
         'Baris 3250: sesudah membuang delapan, komputer memilih lambang dari ' +
         'kartu <b>pertama</b> lainnya di tangannya. Tangannya sudah diurutkan ' +
         'menurut lambang, jadi "yang pertama" adalah lambang yang paling ' +
         'kecil menurut abjad &mdash; bukan yang paling banyak dipegangnya. ' +
         'Menghitung mana yang terbanyak butuh satu gelung tambahan, dan ' +
         'gelung itu tidak ada.'],
        ['Satu baris, dua arti',
         'Baris 3850 dimasuki dari dua arah. Dari 3840 ia lanjutan wajar ' +
         'penghitungan skor. Dari 2030 dan 3220 &mdash; saat dek habis &mdash; ' +
         'ia <b>melompati seluruh penghitungan</b>, jadi tidak ada yang dapat ' +
         'angka dan tangannya diulang diam-diam. Dua makna yang berbeda di ' +
         'satu nomor baris, dan tidak ada <code>REM</code> yang menyebutkannya.']
      ]
    },

    penjelasan: [
      { judul: 'Kisi yang dipakai bergantian',
        isi: [
          'Sebuah kartu di layar ini berukuran lima kali lima aksara, dengan ' +
          'bingkai ganda CP437 di pinggirnya, pangkat di dua pojok, dan ' +
          'lambang di tengah.',
          'Cara yang biasa: bangun stringnya tiap kali sebuah kartu perlu ' +
          'digambar. Yang dilakukan berkas ini lain &mdash; ada <b>satu</b> ' +
          'kisi, <code>FIG$(5,5)</code>, dan semua kartu memakainya bergantian.',
          '<code>3470 IF PASS = 1 THEN 3630</code>',
          'Kalau bingkainya sudah pernah digambar, seluruh bagian 3480-3620 ' +
          'dilewati. Yang tersisa cuma menimpa empat sel: <code>FIG$(2,2)</code> ' +
          'dan <code>FIG$(4,4)</code> untuk pangkatnya, <code>FIG$(3,3)</code> ' +
          'untuk lambangnya.',
          'Dua puluh lima sel, dan yang berubah antar kartu cuma empat.',
          'Yang lebih rapi lagi, ada jalan pulang. Baris 3630:',
          '<code>IF THE$="   " THEN &hellip;semua jadi spasi&hellip; : PASS=0 : RETURN</code>',
          'Memberi kartu kosong bukan cuma mengosongkan kisinya &mdash; ia ' +
          'juga <b>mencabut</b> tanda bahwa bingkainya sudah ada. Panggilan ' +
          'berikutnya akan membangunnya dari awal.',
          'Satu bendera, dan sebuah struktur yang tahu kapan dirinya perlu ' +
          'dibangun kembali. Untuk BASIC 1983, itu rancangan yang matang.',
          'Dan tidak ada yang pernah memakainya.'
        ] },
      { judul: 'Kesalahan satu digit',
        isi: [
          'Satu-satunya tempat di seluruh berkas yang mencoba mengosongkan ' +
          'kisi kartu adalah baris 1650:',
          '<code>1650 THE$="   ": GOSUB 3370</code>',
          'Dan baris 3370 berbunyi:',
          '<code>3370 RETURN</code>',
          'Itu <code>RETURN</code> milik subrutin komputer yang berakhir di ' +
          'atasnya. Pembuat gambar kartu mulai di <b>3460</b>.',
          'Jadi baris 1650 menyetel <code>THE$</code>, memanggil sebuah ' +
          'subrutin, dan subrutin itu langsung pulang. Tidak ada yang ' +
          'dikosongkan. <code>PASS</code> tidak pernah kembali nol sesudah ' +
          'disetel satu di baris 3480.',
          'Apa akibatnya? Hampir tidak ada &mdash; dan itulah yang membuat ' +
          'cacat ini bertahan. Bingkai kartunya memang tidak perlu digambar ' +
          'ulang; ia sama untuk semua kartu. Jalur pengosongan itu ada untuk ' +
          'kerapian, bukan untuk kebenaran.',
          'Yang hilang cuma satu hal: waktu tumpukan buangan kosong, ' +
          '<code>UPCARD$</code> tetap menampilkan kartu lama, karena tidak ada ' +
          'yang menghapusnya.',
          'Dan begitulah cacat semacam ini hidup. Bukan karena tidak ada yang ' +
          'menguji, tapi karena <b>akibatnya lebih kecil daripada ambang ' +
          'perhatian siapa pun</b>. Kode yang ditulis dengan hati-hati, ' +
          'dipanggil ke alamat yang meleset sepuluh nomor baris, dan berjalan ' +
          'bertahun-tahun tanpa ada yang tahu.'
        ] }
    ]
  };
})(window);
