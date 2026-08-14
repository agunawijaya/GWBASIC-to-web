/* ===========================================================================
   OTHELLO.js — porting minimalis OTHELLO.BAS sebagai tabel baris.

   Program ketiga belas, dan satu-satunya di koleksi ini yang BUKAN tulisan
   Friendlyware. Baris 1000-1026 mengakuinya sendiri:

       1000 REM  OTHELLO -- PET VERSION -- MODIFIED BY PATRICK LEABO
       1025 REM NOT DONE YET BUT HAVE FUN -- PLEASE ADD A GOOD ALGORITHM TO IT

   Port dari BASIC Commodore PET, dimodifikasi seseorang di Tucson, Arizona,
   Maret 1982 — dan dikirim dengan catatan bahwa algoritmanya belum bagus.
   Jejak-jejak PET-nya masih tertinggal di seluruh berkas, dan itu justru yang
   paling menarik untuk ditelusuri.

   Yang ditagih program ini dari mesinnya: `INPUT` — celah besar terakhir.
   Sepanjang dua belas program sebelumnya tidak satu pun memakainya; semuanya
   menulis penyunting masukannya sendiri dari `INKEY$`. OTHELLO memakai
   perintah bawaannya, dan itu masuk akal: ia bukan tulisan tim yang sama.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` dan `BEEP` tidak berbunyi.
   - `COLOR 26,0` berarti sian BERKEDIP (10 + 16); kedipnya tidak ditiru,
     jadi kedipan penanda langkah tidak terlihat.
   - `TI$` di baris 2980 adalah variabel waktu Commodore PET. Di GW-BASIC ia
     variabel string biasa yang tidak pernah diisi, jadi mencetak string
     kosong. Jejak PET yang tidak ikut diterjemahkan.
   - Keempat gelung tunda habis seketika.
   - Pengacaknya bukan pengacak GW-BASIC, dan benihnya tetap.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    rem(1000), rem(1010), rem(1020), rem(1025), rem(1026),

    { baris: 1030, jalan: function (m) { m.warna(7, 0); } },
    /* 1040 E$ = 39 spasi, dipakai sebagai "penghapus baris" sepanjang program. */
    { baris: 1040, jalan: function (m) {
        m.v['E$'] = '';
        for (m.v.I = 1; m.v.I <= 39; m.v.I++) m.v['E$'] += ' ';
      } },
    /* 1050-1060 D$ = CHR$(11) + dua puluh CHR$(10).
       Di Commodore PET, CHR$(11) dan CHR$(10) adalah kendali kursor. Di
       GW-BASIC, CHR$(11) bukan apa-apa dan CHR$(10) adalah pindah baris —
       jadi D$ di sini berarti "turun dua puluh baris". Yang di PET rapi,
       di PC menjadi layar yang tergulung. Jejak port yang tidak selesai. */
    { baris: 1050, jalan: function (m) { m.v['D$'] = m.chr(11); } },
    { baris: 1060, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 20; m.v.I++) m.v['D$'] += m.chr(10);
      } },
    /* 1070 batas pencarian langkah komputer, mulai dari kotak tengah saja
       dan melebar tiap kali ada bidak baru di tepinya (lihat baris 2940). */
    { baris: 1070, jalan: function (m) {
        m.v.XL = 3; m.v.XH = 6; m.v.YL = 3; m.v.YH = 6;
      } },
    /* 1080 A(9,9) — papan 8x8 di dalam kisi 10x10. Baris dan kolom 0 dan 9
       tidak pernah diisi, jadi tetap 0 selamanya: TEPI SENTINEL, sama seperti
       TICTAC.BAS, tapi di sini nilai sentinelnya kebetulan sama dengan
       "kotak kosong". Itu bekerja hanya karena pemeriksaan di baris 2800
       mencari T2 (bidak lawan), bukan mencari "bukan kosong". */
    { baris: 1080, jalan: function (m) {
        m.dim('A_', 9, 9); m.dim('I4', 7); m.dim('J4', 7);
        m.dim('D$_', 2); m.dim('P$_', 2); m.dim('N$_', 2); m.dim('SC', 2);
        m.v.Z0 = 0;
      } },

    { baris: 1090, jalan: function (m) {
        m.cls(); m.locate(1, 20);
        m.cetak('GREETINGS FROM OTHELLO'); m.barisBaru();
      } },
    ajar(1100, 'OTHELLO  IS PLAYED ON AN 8 X 8 BOARD, ROWS NUMBERED', true),
    ajar(1110, '1 TO 8  AND COLUMNS A TO H.   THE INITIAL CONFIGURATION IS'),
    ajar(1120, 'ALL BLANK EXCEPT FOR THE CENTER FOUR SQUARES, TRY TO PLACE'),
    ajar(1130, 'YOUR PIECE SO THAT IT OUTFLANKS YOUR  OPPONENT, CREATING '),
    ajar(1140, 'HORIZONTAL, VERTICAL, OR DIAGONAL RUN OF OPPOSING PIECES,'),
    ajar(1150, 'TURNING THEM INTO YOURS.'),
    { baris: 1160, jalan: function (m) { m.barisBaru(); } },
    { baris: 1170, jalan: function (m) { m.barisBaru(); m.barisBaru(); } },
    ajar(1180, 'EXAMPLE: RED OUTFLANKS BLUE, CAPTURING FOUR BLUE PIECES.'),
    ajar(1190, 'MAKE YOUR MOVE BY ENTERING A NUMBER FOR THE ROW AND A LETTER'),
    ajar(1200, 'FOR THE COLUMN.  '),
    ajar(1210, 'NOTE: YOU MUST CAPTURE AT LEAST ONE OF MY PIECES IN THIS WAY '),
    ajar(1220, 'IF IT IS POSSIBLE.  IF IT IS NOT POSSIBLE, YOU FORFEIT YOUR'),
    ajar(1230, 'MOVE BY ENTERING 0 A FOR YOUR MOVE.'),

    { baris: 1240, bagian: [
        function (m) {
          m.barisBaru();
          m.cetak('HOW MANY PLAYERS (1 OR 2)? ');
        },
        function (m) { m.gosub(3220); },
        function (m) {
          var n = parseInt(m.v['X$'], 10) || 0;
          if (n === 0 || n > 2) m.lompat(1240);
        }
      ] },
    { baris: 1250, jalan: function (m) {
        m.cetak(m.v['X$']); m.barisBaru();
        m.v.NP = parseInt(m.v['X$'], 10) || 0;
        m.barisBaru();
      } },
    { baris: 1260, jalan: function (m) {
        if (m.v.NP === 2) {
          m.cetak('PLAYER #1 GOES FIRST WHEN THE PLAY STARTS'); m.barisBaru();
        }
      } },

    /* 1270-1280 INPUT — satu-satunya pemakaian perintah ini di seluruh
       koleksi. Nama pemain disambung dengan CHR$(2) dan CHR$(1): wajah
       tersenyum putih dan hitam, dipakai sebagai bidak di papan. */
    { baris: 1270, bagian: [
        function (m) { m.bunyi(); },
        function (m) { m.masukan('JAWAB', "ENTER PLAYER 1,S NAME! "); },
        function (m) { m.v['P$_'][1] = m.v.JAWAB + ' ' + m.chr(2); }
      ] },
    { baris: 1280, bagian: [
        function (m) {
          m.bunyi();
          if (m.v.NP !== 2) m.lompat(1290);
        },
        function (m) { m.masukan('JAWAB', "ENTER PLAYER 2'S NAME! "); },
        function (m) { m.v['P$_'][2] = m.v.JAWAB + ' ' + m.chr(1); }
      ] },
    { baris: 1290, jalan: function (m) { if (m.v.NP === 2) m.lompat(1350); } },

    { baris: 1300, jalan: function (m) {
        m.barisBaru(); m.cetak('SHOULD I PLAY MY BEST?');
      } },
    /* 1310-1340 tiga bobot posisi. Kalau pemain menjawab N, ketiganya nol dan
       komputer hanya memilih langkah yang membalik bidak PALING BANYAK —
       strategi paling naif di Othello, dan biasanya kalah. */
    { baris: 1310, jalan: function (m) {
        m.v.S2 = 0; m.v.S4 = 0; m.v.S5 = 0; m.v['P$_'][2] = 'IBM PC';
      } },
    { baris: 1320, bagian: [
        function (m) { m.gosub(3220); },
        function (m) {
          if (m.v['X$'] === 'N') { m.cetak('NO'); m.barisBaru(); m.lompat(1350); }
        }
      ] },
    { baris: 1330, jalan: function (m) { m.cetak('YES'); m.barisBaru(); } },
    /* 1340 bobotnya: +2 untuk tepi, +1 untuk cincin ketiga, MINUS 2 untuk
       cincin kedua — kotak di sebelah sudut memang jebakan di Othello. */
    { baris: 1340, jalan: function (m) { m.v.S2 = 2; m.v.S4 = 1; m.v.S5 = -2; } },

    { baris: 1350, jalan: function (m) { m.v.B = -1; m.v.W = 1; m.v.PT = 0; } },
    { baris: 1360, jalan: function (m) {
        m.v['D$_'][0] = 'RED'; m.v['N$_'][0] = 'RED ';
      } },
    { baris: 1370, jalan: function (m) { m.v['D$_'][1] = 'BLANK'; } },
    { baris: 1380, jalan: function (m) {
        m.v['D$_'][2] = 'BLUE'; m.v['N$_'][2] = 'BLUE';
      } },
    /* 1390-1410 baca delapan arah dari DATA — gagasan yang sama dengan
       TICTAC.BAS, tapi di sini pasangan (baris, kolom) alih-alih satu angka,
       karena papannya diindeks dua dimensi. */
    { baris: 1390, jalan: function (m) { m.untuk('K', 0, 7, 1, 1420); } },
    { baris: 1400, jalan: function (m) {
        m.v.I4[m.v.K] = m.baca(); m.v.J4[m.v.K] = m.baca();
      } },
    { baris: 1410, jalan: function (m) { m.lanjutkan('K'); } },

    { baris: 1420, bagian: [
        function (m) { m.untuk('I', 0, 9, 1, 1450); },
        function (m) { m.untuk('J', 0, 9, 1, 1440); }
      ] },
    { baris: 1430, jalan: function (m) { m.v.A_[m.v.I][m.v.J] = 0; } },
    { baris: 1440, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { m.lanjutkan('I'); }
      ] },
    { baris: 1450, jalan: function (m) {
        m.v.A_[4][4] = m.v.W; m.v.A_[5][5] = m.v.W;
      } },
    { baris: 1460, jalan: function (m) {
        m.v.A_[4][5] = m.v.B; m.v.A_[5][4] = m.v.B;
      } },
    { baris: 1470, jalan: function (m) {
        m.v.SC[1] = 2; m.v.SC[2] = 2; m.v.N1 = 4; m.v.Z = 0;
      } },
    { baris: 1480, jalan: function (m) { m.v.C = m.v.B; m.v.H = m.v.W; } },
    { baris: 1490, jalan: function (m) {
        for (m.v.NN = 1; m.v.NN <= 3000; m.v.NN++) { /* jeda */ }
        m.cls();
      } },
    { baris: 1500, jalan: function (m) { m.gosub(3300); } },
    { baris: 1510, jalan: function (m) { if (m.v.NP === 2) m.lompat(2020); } },
    { baris: 1520, jalan: function (m) {
        m.cetak(m.v['D$'] + 'DO YOU WANT TO GO FIRST ? ');
      } },
    { baris: 1530, bagian: [
        function (m) { m.v.PT = 1; },
        function (m) { m.gosub(3220); },
        function (m) {
          if (m.v['X$'] === 'Y') {
            m.cetak('YES'); m.barisBaru(); m.v.PT = 0; m.lompat(2020);
          }
        }
      ] },
    { baris: 1540, jalan: function (m) {
        m.v.PT = 1;
        m.cetak('NO'); m.barisBaru();
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] + 'OK, I AM THINKING!');
        m.barisBaru();
      } },

    /* --- 1550-2010: LANGKAH KOMPUTER ------------------------------------- */

    rem(1550),
    { baris: 1560, jalan: function (m) { if (m.v.NP === 1) m.lompat(1600); } },
    { baris: 1570, jalan: function (m) {
        if (m.v.PT === 2) { m.v.B1 = -1; m.v.I3 = 0; m.v.J3 = 0;
                            m.v.T1 = m.v.C; m.v.T2 = m.v.H; }
      } },
    { baris: 1580, jalan: function (m) {
        if (m.v.PT === 1) { m.v.B1 = -1; m.v.I3 = 0; m.v.J3 = 0;
                            m.v.T1 = m.v.H; m.v.T2 = m.v.C; }
      } },
    { baris: 1590, jalan: function (m) { m.lompat(2030); } },
    { baris: 1600, jalan: function (m) {
        m.v.PT = m.v.PT + 1; if (m.v.PT > 2) m.v.PT = 1;
      } },
    { baris: 1610, jalan: function (m) {
        m.v.B1 = -1; m.v.I3 = 0; m.v.J3 = 0; m.v.T1 = m.v.C; m.v.T2 = m.v.H;
      } },
    /* 1620 sisir hanya kotak di dalam batas yang melebar sendiri — bukan
       seluruh papan. Penghematan yang berarti di prosesor 4,77 MHz. */
    { baris: 1620, bagian: [
        function (m) { m.untuk('I', m.v.YL, m.v.YH, 1, 1800); },
        function (m) { m.untuk('J', m.v.XL, m.v.XH, 1, 1790); }
      ] },
    { baris: 1630, jalan: function (m) {
        if (m.v.A_[m.v.I][m.v.J] !== 0) m.lompat(1790);
      } },
    { baris: 1640, jalan: function (m) { m.gosub(2740); } },
    { baris: 1650, jalan: function (m) { if (m.v.F1 === m.v.Z0) m.lompat(1790); } },
    { baris: 1660, jalan: function (m) { m.v.U = -1; } },
    { baris: 1670, jalan: function (m) { m.gosub(2780); } },
    { baris: 1680, jalan: function (m) { if (m.v.S1 === m.v.Z0) m.lompat(1790); } },
    bobot(1690, 'I', 1, 8, 'S2'), bobot(1700, 'J', 1, 8, 'S2'),
    bobot(1710, 'I', 2, 7, 'S5'), bobot(1720, 'J', 2, 7, 'S5'),
    bobot(1730, 'I', 3, 6, 'S4'), bobot(1740, 'J', 3, 6, 'S4'),
    { baris: 1750, jalan: function (m) { if (m.v.S1 < m.v.B1) m.lompat(1790); } },
    { baris: 1760, jalan: function (m) { if (m.v.S1 > m.v.B1) m.lompat(1780); } },
    /* 1770 seri nilai? lempar koin. Tanpa ini, komputer selalu memilih kotak
       yang pertama ditemui, dan permainannya jadi bisa dihafal. */
    { baris: 1770, jalan: function (m) { if (m.acak() > 0.5) m.lompat(1790); } },
    { baris: 1780, jalan: function (m) {
        m.v.B1 = m.v.S1; m.v.I3 = m.v.I; m.v.J3 = m.v.J;
      } },
    { baris: 1790, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { m.lanjutkan('I'); }
      ] },

    { baris: 1800, jalan: function (m) { if (m.v.B1 > 0) m.lompat(1880); } },
    { baris: 1810, jalan: function (m) { if (m.v.S5 === 0) m.lompat(1840); } },
    { baris: 1820, jalan: function (m) {
        if (m.v.NP === 1) { m.v.S5 = 0; m.lompat(1610); }
      } },
    { baris: 1830, jalan: function (m) { m.v.S5 = 0; m.lompat(1550); } },
    { baris: 1840, jalan: function (m) {
        m.v.S5 = 0;
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] + 'I HAVE TO FORFEIT MY MOVE');
        m.barisBaru();
      } },
    { baris: 1850, jalan: function (m) { if (m.v.Z === 1) m.lompat(2430); } },
    { baris: 1860, jalan: function (m) { m.v.Z = 1; } },
    { baris: 1870, jalan: function (m) { m.lompat(2020); } },
    { baris: 1880, jalan: function (m) { m.v.Z = 0; } },
    { baris: 1890, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] + 'I WILL MOVE TO ' +
                String(m.v.I3) + ' ' + m.chr(m.v.J3 + 64));
        m.barisBaru();
      } },
    { baris: 1900, jalan: function (m) { m.gosub(3090); } },
    { baris: 1910, jalan: function (m) {
        m.v.I = m.v.I3; m.v.J = m.v.J3; m.v.U = 1;
      } },
    { baris: 1920, jalan: function (m) { m.gosub(2780); } },
    { baris: 1930, jalan: function (m) {
        m.v.SC[m.v.PT] = m.v.SC[m.v.PT] + m.v.S1 + 1;
      } },
    { baris: 1940, jalan: function (m) {
        m.v.OP = m.v.PT + 1; if (m.v.OP === 3) m.v.OP = 1;
      } },
    { baris: 1950, jalan: function (m) {
        m.v.SC[m.v.OP] = m.v.SC[m.v.OP] - m.v.S1;
      } },
    { baris: 1960, jalan: function (m) { m.v.N1 = m.v.N1 + 1; } },
    { baris: 1970, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] + 'THAT GIVES ME ');
      } },
    { baris: 1980, jalan: function (m) { m.cetak(angka(m.v.S1)); } },
    { baris: 1990, jalan: function (m) { m.cetak(' OF YOUR PIECES'); m.barisBaru(); } },
    { baris: 2000, jalan: function (m) { m.gosub(3390); } },
    { baris: 2010, jalan: function (m) {
        if (m.v.SC[m.v.OP] === 0 || m.v.N1 === 64) m.lompat(2430);
      } },

    /* --- 2020-2420: LANGKAH PEMAIN --------------------------------------- */

    { baris: 2020, jalan: function (m) { m.v.T1 = m.v.H; m.v.T2 = m.v.C; } },
    { baris: 2030, jalan: function (m) {
        m.v.PT = m.v.PT + 1; if (m.v.PT > 2) m.v.PT = 1;
      } },
    { baris: 2040, jalan: function (m) {
        if (m.v.PT === 2) { m.v.B1 = -1; m.v.I3 = 0; m.v.J3 = 0;
                            m.v.T1 = m.v.C; m.v.T2 = m.v.H; }
      } },
    { baris: 2050, jalan: function (m) {
        if (m.v.PT === 1) { m.v.B1 = -1; m.v.I3 = 0; m.v.J3 = 0;
                            m.v.T1 = m.v.H; m.v.T2 = m.v.C; }
      } },
    { baris: 2060, jalan: function (m) { m.bunyi(); } },
    { baris: 2070, bagian: [
        function (m) {
          m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] +
                  m.v['P$_'][m.v.PT] + ', INPUT YOUR MOVE ! ');
        },
        function (m) { m.gosub(3020); }
      ] },
    { baris: 2080, jalan: function (m) {
        var I = m.v.I, J = m.v.J;
        if (I < 0 || J < 0 || J > 8 || I > 8) m.lompat(2040);
      } },
    { baris: 2090, jalan: function (m) { if (m.v.I !== 0) m.lompat(2160); } },
    { baris: 2100, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] +
                'ARE YOU FORFEITING YOUR TURN ? ');
      } },
    { baris: 2110, bagian: [
        function (m) { m.gosub(3220); },
        function (m) {
          if (m.v['X$'] !== 'Y') { m.cetak('NO'); m.barisBaru(); m.lompat(2040); }
        }
      ] },
    { baris: 2120, jalan: function (m) { m.cetak('YES'); m.barisBaru(); } },
    { baris: 2130, jalan: function (m) { if (m.v.Z === 1) m.lompat(2430); } },
    /* 2140 Z1=1 — variabel yang diisi di sini dan TIDAK PERNAH DIBACA lagi
       di mana pun. Sisa dari perubahan yang tidak selesai. */
    { baris: 2140, jalan: function (m) { m.v.Z1 = 1; } },
    { baris: 2150, jalan: function (m) { m.lompat(1550); } },
    { baris: 2160, jalan: function (m) {
        if (m.v.A_[m.v.I][m.v.J] === 0) m.lompat(2190);
      } },
    { baris: 2170, jalan: function (m) {
        m.cetak(m.v['D$'] + 'SORRY,SQUARE OCCUPIED; TRY AGAIN'); m.barisBaru();
      } },
    { baris: 2180, jalan: function (m) { m.lompat(2270); } },
    { baris: 2190, jalan: function (m) { m.gosub(2740); } },
    { baris: 2200, jalan: function (m) { if (m.v.F1 === 1) m.lompat(2230); } },
    { baris: 2210, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] +
                'SORRY,NOT NEXT TO MY PIECES; TRY AGAIN'); m.barisBaru();
      } },
    { baris: 2220, jalan: function (m) { m.lompat(2270); } },
    { baris: 2230, jalan: function (m) { m.v.U = -1; } },
    { baris: 2240, jalan: function (m) { m.gosub(2780); } },
    { baris: 2250, jalan: function (m) { if (m.v.S1 > 0) m.lompat(2290); } },
    { baris: 2260, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] +
                "SORRY,DOESN'T FLANK A ROW; TRY AGAIN"); m.barisBaru();
      } },
    { baris: 2270, jalan: function (m) {
        m.cetak(m.v['E$'] + m.v['D$']); m.barisBaru();
        m.bunyi();
        for (m.v.N = 1; m.v.N <= 2000; m.v.N++) { /* jeda */ }
      } },
    { baris: 2280, jalan: function (m) { m.lompat(2040); } },
    { baris: 2290, bagian: [
        function (m) { m.v.Z = 0; },
        function (m) { m.gosub(3150); }
      ] },
    { baris: 2300, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] +
                m.v['P$_'][m.v.PT] + ' THAT GIVES YOU ');
      } },
    { baris: 2310, jalan: function (m) { m.cetak(angka(m.v.S1)); } },
    { baris: 2320, jalan: function (m) {
        m.cetak(' PIECE');
        if (m.v.S1 > 1) m.cetak('S');
      } },
    { baris: 2330, jalan: function (m) {
        m.barisBaru();
        m.cetak(m.v['E$'] + m.v['D$']); m.barisBaru();
      } },
    { baris: 2340, jalan: function (m) { m.v.U = 1; } },
    { baris: 2350, jalan: function (m) { m.gosub(2780); } },
    { baris: 2360, jalan: function (m) {
        m.v.SC[m.v.PT] = m.v.SC[m.v.PT] + m.v.S1 + 1;
      } },
    { baris: 2370, jalan: function (m) {
        m.v.OP = m.v.PT + 1; if (m.v.OP === 3) m.v.OP = 1;
      } },
    { baris: 2380, jalan: function (m) {
        m.v.SC[m.v.OP] = m.v.SC[m.v.OP] - m.v.S1;
      } },
    { baris: 2390, jalan: function (m) { m.v.N1 = m.v.N1 + 1; } },
    { baris: 2400, jalan: function (m) { m.gosub(3390); } },
    { baris: 2410, jalan: function (m) {
        if (m.v.SC[m.v.OP] === 0 || m.v.N1 === 64) m.lompat(2430);
      } },
    { baris: 2420, jalan: function (m) { m.lompat(1550); } },

    /* --- 2430-2730: akhir permainan -------------------------------------- */

    { baris: 2430, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$']); m.barisBaru();
        m.cetak(m.v['E$']); m.barisBaru();
        m.cetak(m.v['E$']); m.barisBaru();
      } },
    { baris: 2440, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + m.v['D$'] + m.v['P$_'][1] +
                '  HAS ' + angka(m.v.SC[1]) + ' PIECES   ');
      } },
    { baris: 2450, jalan: function (m) {
        m.cetak(m.v['P$_'][2] + ' HAS ' + angka(m.v.SC[2]) + ' PIECES');
        m.barisBaru();
      } },
    { baris: 2460, jalan: function (m) {
        if (m.v.SC[1] === m.v.SC[2]) m.lompat(2510);
      } },
    { baris: 2470, jalan: function (m) { if (m.v.NP === 2) m.lompat(2540); } },
    { baris: 2480, jalan: function (m) {
        if (m.v.SC[1] > m.v.SC[2]) m.lompat(2530);
      } },
    { baris: 2490, jalan: function (m) { m.cetak('SORRY, I WON THAT ONE.'); } },
    { baris: 2500, jalan: function (m) { m.lompat(2540); } },
    { baris: 2510, jalan: function (m) { m.cetak('ITS A TIE !!'); } },
    { baris: 2520, jalan: function (m) { m.lompat(2680); } },
    { baris: 2530, jalan: function (m) { m.cetak('YOU WON!!!!!!'); } },
    { baris: 2540, jalan: function (m) { m.v.C1 = m.v.SC[1] - m.v.SC[2]; } },
    { baris: 2550, jalan: function (m) { if (m.v.C1 > 0) m.lompat(2570); } },
    { baris: 2560, jalan: function (m) { m.v.C1 = -m.v.C1; } },
    /* 2570 selisih diskalakan ke papan penuh: seri ketat di papan yang belum
       penuh tetap dihitung "ketat". */
    { baris: 2570, jalan: function (m) { m.v.C1 = (64 * m.v.C1) / m.v.N1; } },
    { baris: 2580, jalan: function (m) { m.cetak('THAT WAS A '); } },
    { baris: 2590, jalan: function (m) { if (m.v.C1 < 11) m.lompat(2670); } },
    { baris: 2600, jalan: function (m) { if (m.v.C1 < 25) m.lompat(2660); } },
    { baris: 2610, jalan: function (m) { if (m.v.C1 < 39) m.lompat(2650); } },
    { baris: 2620, jalan: function (m) { if (m.v.C1 < 53) m.lompat(2640); } },
    nilai(2630, 'PERFECT GAME', 2680), nilai(2640, 'WALKAWAY', 2680),
    nilai(2650, 'FIGHT', 2680), nilai(2660, 'HOT GAME', 2680),
    { baris: 2670, jalan: function (m) { m.cetak('SQUEAKER'); m.barisBaru(); } },
    { baris: 2680, jalan: function (m) { m.barisBaru(); } },
    { baris: 2690, jalan: function (m) {
        m.cetak('DO YOU WANT TO PLAY ANOTHER GAME ? '); m.bunyi();
      } },
    /* 2700 RUN 1040 — jalankan ulang program ini MULAI DARI BARIS 1040,
       melewati layar judul. Variabel tetap dikosongkan. */
    { baris: 2700, bagian: [
        function (m) { m.gosub(3220); },
        function (m) {
          if (m.v['X$'] === 'Y') { m.cetak('YES'); m.jalankan(null, 1040); }
        }
      ] },
    { baris: 2710, jalan: function (m) { m.cetak('NO'); m.barisBaru(); } },
    { baris: 2720, jalan: function (m) {
        m.cetak('THANKS FOR PLAYING.'); m.barisBaru();
      } },
    /* 2730 LOAD"MENU",R — bentuk lama dari RUN "MENU". */
    { baris: 2730, jalan: function (m) { m.jalankan('MENU'); } },

    /* --- 2740-2920: PEMERIKSA TETANGGA DAN PEMBALIK BIDAK ---------------- */

    /* 2740-2760 apakah kotak ini bersebelahan dengan bidak lawan? Kisi 3x3
       di sekelilingnya disisir; tepi sentinel yang menjaga agar A(I-1,J-1)
       di pojok papan tidak menabrak apa pun. */
    { baris: 2740, bagian: [
        function (m) { m.v.F1 = m.v.Z0; },
        function (m) { m.untuk('I1', -1, 1, 1, 2750); },
        function (m) { m.untuk('J1', -1, 1, 1, 2750); },
        function (m) {
          if (m.v.A_[m.v.I + m.v.I1][m.v.J1 + m.v.J] === m.v.T2) m.lompat(2760);
        }
      ] },
    { baris: 2750, bagian: [
        function (m) { m.lanjutkan('J1'); },
        function (m) { m.lanjutkan('I1'); },
        function (m) { m.kembali(); }
      ] },
    { baris: 2760, jalan: function (m) { m.v.F1 = 1; m.kembali(); } },
    rem(2770),

    /* 2780-2920 INTI PERMAINANNYA, dan ia melayani DUA tugas sekaligus:
       kalau U = -1, ia cuma MENGHITUNG berapa bidak yang akan terbalik;
       kalau U = 1, ia benar-benar MEMBALIKNYA. Satu rutin, dua peran, dan
       yang membedakan cuma satu variabel. */
    { baris: 2780, bagian: [
        function (m) { m.v.S1 = m.v.Z0; },
        function (m) { m.untuk('K', 0, 7, 1, 2920); }
      ] },
    { baris: 2790, jalan: function (m) {
        m.v.S3 = m.v.Z0;
        m.v.I5 = m.v.I4[m.v.K]; m.v.J5 = m.v.J4[m.v.K];
        m.v.I6 = m.v.I + m.v.I5; m.v.J6 = m.v.J + m.v.J5;
      } },
    { baris: 2800, jalan: function (m) {
        if (m.v.A_[m.v.I6][m.v.J6] !== m.v.T2) m.lompat(2910);
      } },
    { baris: 2810, jalan: function (m) {
        m.v.S3 = m.v.S3 + 1;
        m.v.I6 = m.v.I6 + m.v.I5; m.v.J6 = m.v.J6 + m.v.J5;
      } },
    { baris: 2820, jalan: function (m) {
        if (m.v.A_[m.v.I6][m.v.J6] === m.v.T1) m.lompat(2850);
      } },
    { baris: 2830, jalan: function (m) {
        if (m.v.A_[m.v.I6][m.v.J6] === m.v.Z0) m.lompat(2910);
      } },
    { baris: 2840, jalan: function (m) { m.lompat(2810); } },
    { baris: 2850, jalan: function (m) { m.v.S1 = m.v.S1 + m.v.S3; } },
    { baris: 2860, jalan: function (m) { if (m.v.U !== 1) m.lompat(2910); } },
    { baris: 2870, jalan: function (m) { m.v.I6 = m.v.I; m.v.J6 = m.v.J; } },
    { baris: 2880, jalan: function (m) { m.untuk('K1', 0, m.v.S3, 1, 2910); } },
    { baris: 2890, jalan: function (m) {
        m.v.A_[m.v.I6][m.v.J6] = m.v.T1;
        m.v.I6 = m.v.I6 + m.v.I5; m.v.J6 = m.v.J6 + m.v.J5;
      } },
    { baris: 2900, jalan: function (m) { m.lanjutkan('K1'); } },
    { baris: 2910, jalan: function (m) { m.lanjutkan('K'); } },
    { baris: 2920, jalan: function (m) { m.kembali(); } },

    /* 2930-2990 lebarkan batas pencarian kalau bidak baru menyentuh tepinya. */
    rem(2930),
    batas(2940, 'I', 'YL', -1, 1), batas(2950, 'I', 'YH', 1, 8),
    batas(2960, 'J', 'XL', -1, 1), batas(2970, 'J', 'XH', 1, 8),
    /* 2980 TI$ adalah jam Commodore PET. Di GW-BASIC ia variabel string biasa
       yang tak pernah diisi, jadi yang tercetak string kosong. */
    { baris: 2980, jalan: function (m) {
        m.locate(1, 1); m.cetak((m.v['TI$'] || '') + '   ');
      } },
    { baris: 2990, jalan: function (m) { m.kembali(); } },

    /* 3000-3080 baca langkah: satu angka untuk baris, satu huruf untuk kolom,
       dalam urutan apa pun. */
    rem(3000),
    { baris: 3010, jalan: function (m) {
        m.cetak(m.v['D$'] + m.v['E$'] + 'BAD MOVE; TRY AGAIN.'); m.barisBaru();
      } },
    { baris: 3020, jalan: function (m) { m.v.I = -1; m.v.J = -1; } },
    { baris: 3030, jalan: function (m) { m.untuk('K', 1, 2, 1, 3080); } },
    { baris: 3040, jalan: function (m) { m.gosub(3220); } },
    { baris: 3050, jalan: function (m) { m.v.G = m.v['X$'].charCodeAt(0); } },
    { baris: 3060, jalan: function (m) {
        if (m.v.G > 47 && m.v.G < 58) { m.v.I = m.v.G - 48; m.cetak(m.v['X$'] + '  '); }
      } },
    { baris: 3070, jalan: function (m) {
        if (m.v.G > 64 && m.v.G < 74) { m.v.J = m.v.G - 64; m.cetak(m.v['X$'] + '  '); }
      } },
    { baris: 3080, bagian: [
        function (m) { m.lanjutkan('K'); },
        function (m) { m.barisBaru(); m.kembali(); }
      ] },

    rem(3090),
    { baris: 3100, jalan: function (m) {
        m.locate(2 * m.v.J3 + 3, 4 * m.v.I3 + 1);
        m.warna(26, 0); m.cetak(m.chr(1)); m.warna(7, 0);
      } },
    { baris: 3110, jalan: function (m) { m.v.I = m.v.I3; m.v.J = m.v.J3; } },
    { baris: 3120, jalan: function (m) { m.gosub(2940); } },
    { baris: 3130, jalan: function (m) {
        for (m.v.NN = 1; m.v.NN <= 1000; m.v.NN++) { /* jeda */ }
      } },
    { baris: 3140, jalan: function (m) { m.kembali(); } },

    rem(3150),
    { baris: 3160, jalan: function (m) { if (m.v.PT === 2) m.v.CC = 0; } },
    { baris: 3170, jalan: function (m) { if (m.v.PT === 1) m.v.CC = 2; } },
    { baris: 3180, jalan: function (m) {
        m.locate(2 * m.v.J + 3, 4 * m.v.I + 1);
        m.warna(26, 0); m.cetak(m.chr(2)); m.warna(7, 0);
      } },
    { baris: 3190, jalan: function (m) { m.gosub(2940); } },
    { baris: 3200, jalan: function (m) {
        for (m.v.NN = 1; m.v.NN <= 500; m.v.NN++) { /* jeda */ }
      } },
    { baris: 3210, jalan: function (m) { m.kembali(); } },

    /* 3220-3240 baca satu tombol. Perhatikan ESC: ia menuju
       CHAIN "B:MENU" — berkas di DRIVE B, yang tidak ada di mesin
       berdisket-satu. Jejak PET lagi, dan cacat yang menunggu. */
    rem(3220),
    { baris: 3230, jalan: function (m) { m.bunyi(); } },
    { baris: 3240, jalan: function (m) {
        m.v['X$'] = m.inkey();
        if (m.v['X$'] === '') m.lompat(3240);
        else if (m.v['X$'] === m.chr(27)) m.rantai('B:MENU', 1000);
        else m.kembali();
      } },

    rem(3250),
    { baris: 3260, jalan: function (m) {
        m.locate(5, 36);
        m.cetak(m.chr(2) + kanan3(m.v.SC[1]) + ' '); m.barisBaru();
        m.locate(19, 36);
        m.cetak(m.chr(1) + kanan3(m.v.SC[2]) + ' ');
        m.locate(1, 1);
      } },
    { baris: 3270, jalan: function (m) { m.kembali(); } },

    rem(3280),
    { baris: 3290, jalan: function () { /* DATA delapan arah */ } },

    /* 3300-3380 gambar papan 8x8 dari balok ganda CP437. */
    rem(3300),
    { baris: 3310, jalan: function (m) {
        m.cls(); m.locate(1, 10);
        m.cetak('O T H E L L O'); m.barisBaru();
      } },
    { baris: 3320, jalan: function (m) {
        m.locate(3, 5);
        m.cetak('1   2   3   4   5   6   7   8'); m.barisBaru();
      } },
    { baris: 3330, jalan: function (m) {
        for (m.v.N = 1; m.v.N <= 8; m.v.N++) {
          m.locate(3 + 2 * m.v.N, 1);
          m.cetak(m.chr(m.v.N + 64)); m.barisBaru();
        }
      } },
    { baris: 3340, bagian: [
        function (m) {
          m.locate(4, 3);
          m.cetak(m.chr(201) + garis(m) + m.chr(187)); m.barisBaru();
        },
        function (m) { m.untuk('N', 1, 13, 2, 3370); }
      ] },
    { baris: 3350, jalan: function (m) {
        m.locate(4 + m.v.N, 3); m.cetak(sel(m)); m.barisBaru();
      } },
    { baris: 3360, bagian: [
        function (m) {
          m.locate(5 + m.v.N, 3);
          m.cetak(m.chr(204) + garis(m) + m.chr(185)); m.barisBaru();
        },
        function (m) { m.lanjutkan('N'); }
      ] },
    { baris: 3370, jalan: function (m) {
        m.locate(4 + m.v.N, 3); m.cetak(sel(m)); m.barisBaru();
      } },
    { baris: 3380, jalan: function (m) {
        m.locate(5 + m.v.N, 3);
        m.cetak(m.chr(200) + garis(m) + m.chr(188)); m.barisBaru();
      } },

    /* 3390-3440 gambar seluruh bidak dari larik papan. FACE = (A+3)/2 memberi
       1 untuk bidak hitam, 1,5 untuk kosong, 2 untuk putih — dan angka 1,5
       yang tidak bulat itulah penanda "kosong". Trik hemat, dan tidak ada
       satu pun komentar yang menjelaskannya. */
    { baris: 3390, bagian: [
        function (m) { m.untuk('I', 1, 8, 1, 3430); },
        function (m) { m.untuk('J', 1, 8, 1, 3420); }
      ] },
    { baris: 3400, jalan: function (m) {
        m.locate(2 * m.v.J + 3, 4 * m.v.I + 1);
        m.v.FACE = (m.v.A_[m.v.I][m.v.J] + 3) / 2;
      } },
    { baris: 3410, jalan: function (m) {
        if (m.v.FACE === 1.5) m.cetak(' '); else m.cetak(m.chr(m.v.FACE));
        m.barisBaru();
      } },
    { baris: 3420, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { m.lanjutkan('I'); }
      ] },
    { baris: 3430, jalan: function (m) { m.gosub(3250); } },
    { baris: 3440, jalan: function (m) { m.kembali(); } },
    /* 3450 GOTO 2730 — baris terakhir, dan TIDAK PERNAH TERCAPAI. Baris 3440
       sudah RETURN lebih dulu, dan tidak ada yang melompat ke sini. */
    { baris: 3450, jalan: function (m) { m.lompat(2730); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () {} }; }
  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }
  function kanan3(n) { return ('  ' + angka(n).trim()).slice(-3); }
  function garis(m) { return m.ulang(31, 205); }
  function sel(m) {
    var s = m.chr(186), i;
    for (i = 0; i < 8; i++) s += '   ' + m.chr(186);
    return s;
  }

  function ajar(nomor, isi, kosongDulu) {
    return { baris: nomor, jalan: function (m) {
      if (kosongDulu) m.barisBaru();
      m.cetak(isi); m.barisBaru();
    } };
  }
  function nilai(nomor, teks, tujuan) {
    return { baris: nomor, jalan: function (m) {
      m.cetak(teks); m.barisBaru(); m.lompat(tujuan);
    } };
  }
  function bobot(nomor, sumbu, a, b, nama) {
    return { baris: nomor, jalan: function (m) {
      var v = m.v[sumbu];
      if (v === a || v === b) m.v.S1 = m.v.S1 + m.v[nama];
    } };
  }
  function batas(nomor, sumbu, nama, arah, batasNilai) {
    return { baris: nomor, jalan: function (m) {
      if (m.v[sumbu] !== m.v[nama]) return;
      m.v[nama] = m.v[nama] + arah;
      if (arah < 0 ? m.v[nama] < batasNilai : m.v[nama] > batasNilai) {
        m.v[nama] = batasNilai;
      }
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['OTHELLO'] = {
    nama: 'OTHELLO',
    judul: 'Othello',
    sumber: 'OTHELLO',
    berkas: 'run/OTHELLO.BAS',
    tabel: tabel,
    data: [0, 1, -1, 1, -1, 0, -1, -1, 0, -1, 1, -1, 1, 0, 1, 1],

    arsitektur: {
      judul: 'Alur OTHELLO.BAS',
      simpul: [
        { id: 'siap', baris: '1030-1340', jenis: 'mulai',
          teks: ['Petunjuk, jumlah pemain,', 'nama, tingkat kesulitan'] },
        { id: 'papan', baris: '1350-1500',
          teks: ['Isi larik arah dari DATA,', 'pasang empat bidak tengah'] },
        { id: 'giliran', baris: '1550-1620', jenis: 'putusan',
          teks: ['Giliran siapa?'] },
        { id: 'cari', baris: '1620-1790',
          teks: ['Sisir kotak dalam batas,', 'nilai tiap langkah yang sah'] },
        { id: 'nilai', baris: '1690-1780',
          teks: ['Tambah bobot posisi:', 'tepi +2, cincin kedua -2'] },
        { id: 'lewat', baris: '1800-1870', jenis: 'galat',
          teks: ['Tidak ada langkah sah:', 'komputer melewatkan giliran'] },
        { id: 'pemain', baris: '2020-2280', jenis: 'subrutin',
          teks: ['Pemain mengetik baris dan kolom,', 'tiga uji keabsahan'] },
        { id: 'balik', baris: '2780-2920', jenis: 'subrutin',
          teks: ['Hitung ATAU balik bidak,', 'tergantung satu variabel U'] },
        { id: 'gambar', baris: '3390-3440', jenis: 'subrutin',
          teks: ['Gambar ulang papan', 'dan kedua skornya'] },
        { id: 'usai', baris: '2430-2730', jenis: 'keluar',
          teks: ['Skor akhir, dan sebutan', 'menurut ketatnya selisih'] }
      ],
      panah: [
        { dari: 'siap',    ke: 'papan' },
        { dari: 'papan',   ke: 'giliran' },
        { dari: 'giliran', ke: 'cari',    label: 'komputer' },
        { dari: 'cari',    ke: 'nilai' },
        { dari: 'nilai',   ke: 'cari',    label: 'kotak berikutnya' },
        { dari: 'cari',    ke: 'lewat',   label: 'tak ada yang sah', jenis: 'galat' },
        { dari: 'lewat',   ke: 'pemain',  label: 'giliran pemain', jenis: 'galat' },
        { dari: 'giliran', ke: 'pemain',  label: 'pemain' },
        { dari: 'pemain',  ke: 'balik' },
        { dari: 'cari',    ke: 'balik',   label: 'langkah dipilih' },
        { dari: 'balik',   ke: 'gambar' },
        { dari: 'gambar',  ke: 'giliran', label: 'lanjut' },
        { dari: 'gambar',  ke: 'usai',    label: 'papan penuh / skor 0' },
        { dari: 'usai',    ke: 'papan',   label: 'RUN 1040' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Satu rutin, dua peran',
        keterangan: 'Subrutin di baris 2780-2920 dipanggil <b>dua kali untuk ' +
          'langkah yang sama</b>. Yang membedakan cuma variabel <code>U</code>: ' +
          'sekali untuk MENGHITUNG berapa bidak akan terbalik (dan menolak ' +
          'langkah yang menghasilkan nol), sekali lagi untuk BENAR-BENAR ' +
          'membaliknya. Menguji dan mengerjakan dengan kode yang sama persis — ' +
          'jadi keduanya tidak mungkin berbeda pendapat.',
        simpul: [
          { id: 'hitung', baris: '2860 (U = -1)', jenis: 'mulai',
            teks: ['Menghitung saja', 'papan tidak berubah'] },
          { id: 'balik', baris: '2870-2900 (U = 1)', jenis: 'keadaan',
            teks: ['Membalik sungguhan', 'papan berubah'] }
        ],
        panah: [
          { dari: 'hitung', ke: 'balik', label: 'langkah sah: panggil lagi dengan U=1' },
          { dari: 'balik', ke: 'hitung', label: 'giliran berikutnya' },
          { dari: 'hitung', ke: 'hitung', label: 'S1=0: langkah ditolak', jenis: 'galat' }
        ]
      }
    ],

    pseudokode: [
      { baris: 1080, tingkat: 0, teks: 'papan 8&times;8 disimpan dalam kisi 10&times;10 &mdash; <b>tepi sentinel</b>' },
      { baris: 1240, tingkat: 0, teks: 'tanya jumlah pemain, lalu <b>INPUT</b> namanya' },
      { baris: 1300, tingkat: 0, teks: 'main sungguhan? kalau tidak, semua bobot posisi jadi nol' },
      { baris: 1390, tingkat: 0, teks: 'baca delapan arah dari DATA sebagai pasangan (baris, kolom)' },
      { baris: 1450, tingkat: 0, teks: 'pasang empat bidak tengah, skor 2&ndash;2' },
      { baris: 1550, tingkat: 0, teks: '<b>GILIRAN KOMPUTER:</b>' },
      { baris: 1620, tingkat: 1, teks: 'sisir hanya kotak di dalam batas yang melebar sendiri' },
      { baris: 1640, tingkat: 2, teks: 'kotak kosong dan bersebelahan dengan bidak lawan?' },
      { baris: 1670, tingkat: 2, teks: 'hitung berapa bidak yang akan terbalik (<code>U = &minus;1</code>)' },
      { baris: 1690, tingkat: 2, teks: 'tambah bobot posisi: tepi +2, cincin kedua <b>&minus;2</b>, ketiga +1' },
      { baris: 1770, tingkat: 2, teks: 'nilai seri? <b>lempar koin</b>' },
      { baris: 1800, tingkat: 1, teks: 'tak ada langkah sah? lewatkan giliran' },
      { baris: 1920, tingkat: 1, teks: 'panggil rutin yang sama lagi dengan <code>U = 1</code> &mdash; balik sungguhan' },
      { baris: 2020, tingkat: 0, teks: '<b>GILIRAN PEMAIN:</b>' },
      { baris: 2070, tingkat: 1, teks: 'minta baris (angka) dan kolom (huruf), urutan bebas' },
      { baris: 2160, tingkat: 1, teks: 'kotak terisi? tolak' },
      { baris: 2200, tingkat: 1, teks: 'tidak bersebelahan dengan bidak lawan? tolak' },
      { baris: 2250, tingkat: 1, teks: 'tidak mengapit satu deret pun? tolak' },
      { baris: 2410, tingkat: 0, teks: 'skor lawan nol atau papan penuh? selesai' },
      { baris: 2570, tingkat: 0, teks: 'selisih diskalakan ke papan penuh, lalu diberi sebutan' }
    ],

    perintahAsli: 'run\\OTHELLO.bat',
    catatanAsli: 'Di DOSBox-X penanda langkah benar-benar berkedip, dan ' +
      'SOUND 3000,2 berbunyi tiap kali menunggu tombol. Tekan ESC di sana ' +
      'untuk melihat sendiri apakah CHAIN "B:MENU" berhasil.',

    penyimpangan: [
      '<b><code>SOUND</code> dan <code>BEEP</code> tidak berbunyi</b>, dan ' +
      '<code>COLOR 26,0</code> (sian + kedip) tidak berkedip. Penanda langkah ' +
      'terakhir karena itu tidak terlihat sebagai kedipan.',

      '<b><code>TI$</code> di baris 2980 mencetak string kosong.</b> Itu ' +
      'variabel jam Commodore PET; di GW-BASIC ia variabel string biasa yang ' +
      'tak pernah diisi. Bukan penyimpangan porting — memang begitu di mesin ' +
      'aslinya juga.',

      '<b><code>D$</code> berperilaku sangat berbeda dari yang dimaksud.</b> ' +
      'Baris 1050-1060 membangunnya dari <code>CHR$(11)</code> dan dua puluh ' +
      '<code>CHR$(10)</code> — kendali kursor Commodore. Di GW-BASIC itu ' +
      'berarti "turun dua puluh baris", jadi tiap kali <code>D$</code> ' +
      'dicetak, layarnya tergulung. Jejak port yang tidak selesai, dan ' +
      'penelusur menirunya apa adanya.',

      '<b>Tekan ESC dan penelusuran berhenti.</b> Baris 3240 menuju ' +
      '<code>CHAIN "B:MENU",1000</code> — berkas di <b>drive B</b>. Di mesin ' +
      'berdisket-satu itu galat 53, dan tidak ada <code>ON ERROR</code> yang ' +
      'menangkapnya. Cacat yang menunggu, dan jejak PET lagi.',

      '<b>Keempat gelung tunda habis seketika</b>, dan pengacaknya berbenih ' +
      'tetap.'
    ],

    pelajaran: {
      ringkas: 'Satu-satunya program di koleksi yang bukan tulisan ' +
        'Friendlyware &mdash; port dari Commodore PET, dan pengarangnya ' +
        'sendiri menulis di baris 1025: "belum selesai, tolong tambahkan ' +
        'algoritma yang bagus".',
      pelajari: [
        ['Satu rutin untuk menguji DAN mengerjakan',
         'Subrutin 2780-2920 dipanggil dua kali untuk langkah yang sama: ' +
         'sekali dengan <code>U = &minus;1</code> untuk <b>menghitung</b> ' +
         'berapa bidak akan terbalik, sekali dengan <code>U = 1</code> untuk ' +
         '<b>membaliknya</b>. Karena kodenya sama persis, uji dan kerja tidak ' +
         'mungkin berbeda pendapat &mdash; masalah yang sering muncul kalau ' +
         'keduanya ditulis terpisah.'],
        ['Batas pencarian yang melebar sendiri',
         'Baris 1620 tidak menyisir seluruh papan, cuma kotak di antara ' +
         '<code>XL..XH</code> dan <code>YL..YH</code>. Batas itu mulai dari ' +
         'empat kotak tengah dan melebar satu langkah tiap kali bidak baru ' +
         'menyentuh tepinya (baris 2940-2970). Di prosesor 4,77 MHz, ' +
         'menyisir 16 kotak alih-alih 64 adalah beda antara langsung dan ' +
         'menunggu.'],
        ['Bobot posisi yang mengajarkan strategi Othello',
         'Baris 1690-1740: tepi <b>+2</b>, cincin ketiga <b>+1</b>, dan ' +
         'cincin kedua <b>&minus;2</b>. Kotak di sebelah sudut memang jebakan ' +
         'terkenal di Othello — mengisinya memberi lawan jalan ke sudut. ' +
         'Enam baris yang memuat seluruh pengetahuan strateginya.'],
        ['Lempar koin saat nilai seri',
         'Baris 1770: kalau dua langkah bernilai sama, pilih acak. Tanpa itu ' +
         'komputer selalu memilih kotak pertama yang ditemuinya, dan ' +
         'permainannya bisa dihafal.']
      ],
      hindari: [
        ['Jejak port yang tidak dibersihkan',
         '<code>D$</code> dibangun dari kendali kursor Commodore yang di PC ' +
         'berarti hal lain; <code>TI$</code> mencetak kosong; ' +
         '<code>CHAIN "B:MENU"</code> menunjuk drive yang tidak ada. ' +
         'Memindahkan program antar-mesin berarti memeriksa <b>tiap</b> ' +
         'asumsi tentang mesinnya, bukan hanya yang membuat program berhenti.'],
        ['Variabel yang diisi dan tidak pernah dibaca',
         '<code>Z1 = 1</code> di baris 2140 tidak pernah muncul lagi di mana ' +
         'pun. Sisa dari perubahan yang tidak selesai — dan pembaca ' +
         'berikutnya akan menghabiskan waktu mencari artinya.'],
        ['Angka pecahan sebagai penanda',
         'Baris 3400: <code>FACE = (A+3)/2</code> memberi 1 untuk hitam, ' +
         '<b>1,5</b> untuk kosong, 2 untuk putih. Angka yang tidak bulat ' +
         'itulah penanda "kosong", dan baris 3410 mengujinya dengan ' +
         '<code>IF FACE = 1.5</code>. Jalan, tapi membandingkan bilangan ' +
         'pecahan dengan tanda sama dengan adalah kebiasaan yang cepat atau ' +
         'lambat menggigit.'],
        ['Baris terakhir yang tidak pernah tercapai',
         '<code>3450 GOTO 2730</code>. Baris 3440 sudah <code>RETURN</code> ' +
         'lebih dulu, dan tidak ada yang melompat ke 3450.']
      ]
    },

    penjelasan: [
      { judul: 'Satu rutin yang menguji dan mengerjakan',
        isi: [
          'Di Othello, sebuah langkah sah hanya kalau ia <b>mengapit</b> ' +
          'setidaknya satu deret bidak lawan. Jadi program harus menjawab dua ' +
          'pertanyaan: "apakah langkah ini sah?" dan "bidak mana saja yang ' +
          'terbalik?"',
          'Naluri pertama: dua rutin. Satu memeriksa, satu mengerjakan.',
          'Masalahnya, keduanya harus <b>sepakat</b>. Kalau pemeriksa bilang ' +
          'sah tapi pengerjanya tidak membalik apa-apa, papannya rusak diam- ' +
          'diam. Dan dua salinan logika yang sama selalu berakhir berbeda.',
          'Program ini memakai <b>satu</b> rutin, dan satu variabel yang ' +
          'memilih perannya:',
          '<code>2860 IF U &lt;&gt; 1 THEN 2910</code>',
          'Dengan <code>U = &minus;1</code> ia melewati baris 2870-2900 dan ' +
          'cuma menjumlahkan. Dengan <code>U = 1</code> ia juga membalik ' +
          'bidaknya. Baris 2230-2240 memanggilnya untuk menguji; baris ' +
          '2340-2350 memanggilnya lagi untuk mengerjakan.',
          'Yang didapat: uji dan kerja <b>tidak mungkin berbeda pendapat</b>, ' +
          'karena keduanya kode yang sama.'
        ] },
      { judul: 'Enam baris yang memuat seluruh strateginya',
        isi: [
          'Bagaimana komputer memilih langkah? Ia menilai tiap langkah yang ' +
          'sah, dan nilainya cuma dua bagian: berapa bidak yang terbalik, ' +
          'ditambah <b>bobot posisi</b>.',
          '<code>1690 IF (I=1) OR (I=8) THEN S1 = S1 + S2</code> &nbsp;(+2)<br>' +
          '<code>1710 IF (I=2) OR (I=7) THEN S1 = S1 + S5</code> &nbsp;(&minus;2)<br>' +
          '<code>1730 IF (I=3) OR (I=6) THEN S1 = S1 + S4</code> &nbsp;(+1)',
          'Tepi papan bernilai <b>positif</b>, cincin ketiga sedikit positif, ' +
          'dan cincin kedua <b>negatif</b>.',
          'Kenapa negatif? Karena kotak di sebelah sudut adalah jebakan paling ' +
          'terkenal di Othello: mengisinya memberi lawan jalan masuk ke sudut, ' +
          'dan sudut tidak pernah bisa direbut kembali.',
          'Seluruh pengetahuan strategi program ini ada di enam baris itu. ' +
          'Dan kalau pemain menjawab "N" pada "should I play my best", ' +
          'ketiganya jadi nol — komputer kembali ke strategi paling naif: ' +
          'ambil yang paling banyak sekarang. Dua tingkat kesulitan dari tiga ' +
          'angka.'
        ] },
      { judul: 'Jejak mesin yang tidak ikut pindah',
        isi: [
          'Program ini lahir di Commodore PET dan dipindahkan ke IBM PC. ' +
          'Sebagian besar berhasil — tapi tiga hal ikut terbawa tanpa ' +
          'diterjemahkan, dan ketiganya terlihat jelas saat ditelusuri.',
          '<b>D$</b> (baris 1050-1060) dibangun dari <code>CHR$(11)</code> dan ' +
          'dua puluh <code>CHR$(10)</code>. Di PET itu perintah kursor: ' +
          '"pulang ke atas, lalu turun dua puluh". Di PC, <code>CHR$(11)</code> ' +
          'bukan apa-apa dan <code>CHR$(10)</code> memindah baris — jadi tiap ' +
          'kali <code>D$</code> dicetak, layarnya <b>tergulung dua puluh ' +
          'baris</b>. Itulah kenapa tampilan program ini terasa berantakan.',
          '<b>TI$</b> (baris 2980) adalah jam PET. Di GW-BASIC ia sekadar ' +
          'variabel string yang tak pernah diisi, jadi mencetak kosong.',
          '<b>CHAIN "B:MENU"</b> (baris 3240) menunjuk berkas di drive B. Di ' +
          'mesin berdisket-satu, menekan ESC berarti galat 53 dan program ' +
          'berhenti.',
          'Pelajarannya: memindahkan program antar-mesin berarti memeriksa ' +
          '<b>tiap</b> asumsi tentang mesinnya — bukan hanya yang membuat ' +
          'program menolak jalan. Yang paling berbahaya justru yang tetap ' +
          'jalan, tapi salah.'
        ] }
    ]
  };
})(window);
