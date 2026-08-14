/* ===========================================================================
   BACKGAM.js — porting minimalis BACKGAM.BAS sebagai tabel baris.

   Backgammon dua pemain, dengan petunjuk tambahan dari John Beck (Melbourne
   PC-Group). Seratus enam puluh satu baris.

   GAGASAN PUSATNYA: SATU LARIK, DUA PEMAIN, DIBEDAKAN TANDANYA.

       A(1) sampai A(24)   titik-titik papan
       A(0)  dan  A(25)    bar (petak buangan) masing-masing pemain

   Isinya BILANGAN BERTANDA. Positif berarti bidak pemain 1, negatif bidak
   pemain 2, dan besarnya berapa banyak. Jadi:

       A(X) < -1      titik itu DIBLOKIR untuk pemain 1
       A(T) = -1      di sana ada BLOT — bidak tunggal yang bisa dipukul
       A(0) = A(0)+1  bidak yang dipukul masuk ke bar

   Satu larik, satu operator perbandingan, dan seluruh aturan blok/blot
   selesai. Bandingkan MAXIT1.BAS, yang memakai tanda untuk membedakan dua
   nilai ajaib — di sini tanda membedakan dua PEMAIN.

   Dan kedua pemain bergerak ke arah BERLAWANAN: yang satu 24 ke 1, yang lain
   1 ke 24. Itu sebabnya baris 2770-3070 dan 3080-3420 hampir kembar, dengan
   setiap perbandingan dibalik.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` diam.
   - Gelung tunda di baris 59950 habis seketika.
   - `COLOR 25` (baris 3580) adalah 9 + 16, yaitu biru terang BERKEDIP;
     konsol penelusur tidak berkedip.
   - `LOAD "MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var PETA = { '║': 186, '═': 205, '╔': 201, '╗': 187, '╚': 200, '╝': 188,
               '╠': 204, '╣': 185, '╦': 203, '╩': 202, '╬': 206, '▀': 223 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  var P1 = keBita('▀▀▀'), P2 = keBita('▀ ▀');
  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function tab(n, kol, isi) {
    return { baris: n, jalan: function (m) {
      m.tab(kol); m.cetak(isi); m.barisBaru();
    } };
  }

  var tabel = [

    { baris: 2430, jalan: function (m) {
        /* `A$()` tidak pernah di-DIM: BASIC melarik-otomatiskannya sampai 10
           saat baris 2440 mengisinya. Dua yang dipakai. */
        m.dim('A$()', 10);
        m.cls(); m.warna(0, 7); m.locate(1, 30);
        m.jebakan(10, true); m.pasangJebakan(10, 5000);
        m.cetak(' B A C K G A M M O N '); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 2435, jalan: function (m) {
        m.locate(12, 12);
        m.cetak('If you want instruction press ENTER else press SPACE BAR');
      } },
    { baris: 2436, jalan: function (m) {
        m.v['I$'] = m.inkey();
        if (m.v['I$'] === '') m.lompat(2436);
      } },
    { baris: 2437, jalan: function (m) {
        if (m.v['I$'] === m.chr(13)) m.lompat(3600);
      } },
    { baris: 2438, jalan: function (m) {
        if (m.v['I$'] === ' ') m.lompat(2440);
      } },
    { baris: 2439, jalan: function (m) { m.lompat(2436); } },
    { baris: 2440, bagian: [
        function (m) { m.cls(); m.untuk('X', 1, 2, 1, 2450); },
        function (m) {
          m.locate(12, 1); m.spc(79); m.barisBaru();
          m.locate(12, 1);
          m.cetak('Enter the name of player #' + basic(m.v.X));
        },
        function (m) {
          m.masukan(function (s) { m.v['A$()'][m.v.X] = s; }, ' - ');
        }
      ] },
    { baris: 2442, jalan: function (m) {
        if (m.v['A$()'][m.v.X].length > 15) {
          m.cetak('Name too long, use a max of 15 characters'); m.barisBaru();
          m.lompat(2440);
        }
      } },
    { baris: 2444, jalan: function (m) { m.lanjutkan('X'); } },
    /* 2450 `DEFINT A,D-J,L-M,S-U,X-Z` — dan `A$()` tetap string karena
       tanda dolarnya. Larik papannya `A(25)`. */
    { baris: 2450, jalan: function (m) { m.dim('A()', 25); } },
    { baris: 2460, jalan: function (m) {
        m.locate(12, 1); m.spc(79); m.barisBaru();
        m.locate(5, 10); m.cetak('Your pips look like this:'); m.barisBaru();
      } },
    { baris: 2462, jalan: function (m) {
        m.locate(7, 30); m.cetak(m.v['A$()'][1]); m.tab(45);
        m.cetak(' - ' + P1); m.barisBaru();
        m.locate(9, 30); m.cetak(m.v['A$()'][2]); m.tab(45);
        m.cetak(' - ' + P2); m.barisBaru();
      } },
    { baris: 2470, bagian: [
        function (m) {
          m.locate(25, 1); m.cetak('Press any key to continue');
        },
        function (m) { m.gosub(59990); }
      ] },
    { baris: 2480, jalan: function (m) {
        for (m.v.X = 0; m.v.X <= 25; m.v.X++) m.v['A()'][m.v.X] = 0;
      } },
    /* 2482 SUSUNAN AWAL BACKGAMMON, dalam satu baris. Positif = pemain 1,
       negatif = pemain 2. Jumlah mutlaknya 15 di tiap sisi. */
    { baris: 2482, jalan: function (m) {
        var A = m.v['A()'];
        A[24] = 2; A[19] = -5; A[17] = -3; A[13] = 5;
        A[12] = -5; A[8] = 3; A[6] = 5; A[1] = -2;
      } },
    { baris: 2500, bagian: [
        function (m) { m.gosub(2590); },
        function (m) {
          m.v.W = 0;
          if (Math.trunc(m.acak() * 2 + 1) === 2) m.v.W = 1;
        }
      ] },
    { baris: 2510, jalan: function (m) {
        m.locate(25, 1); m.spc(79); m.barisBaru();
        m.locate(25, 1); m.cetak(m.v['A$()'][m.v.W + 1]);
      } },
    { baris: 2520, jalan: function (m) {
        m.warna(15, null); m.cetak('   1');
        m.warna(7, null); m.cetak('=ROLL DICE, ');
        m.warna(15, null); m.cetak('2');
        m.warna(7, null); m.cetak('=REDRAW BOARD, ');
        m.warna(15, null); m.cetak('3');
        m.warna(7, null); m.cetak('=NEW GAME');
      } },
    { baris: 2530, bagian: [
        function (m) { m.gosub(59990); },
        function (m) {
          if ('123'.indexOf(m.v['IKEY$']) < 0) m.lompat(2530);
          else m.v.X = parseInt(m.v['IKEY$'], 10);
        }
      ] },
    { baris: 2540, jalan: function (m) {
        var ke = [2560, 2550, 2480][m.v.X - 1];
        if (ke) m.lompat(ke); else m.lompat(2510);
      } },
    { baris: 2550, bagian: [
        function (m) { m.gosub(2590); },
        function (m) { m.lompat(2510); }
      ] },
    /* 2560 dua dadu. `D` adalah CACAH LANGKAH: dua biasanya, empat kalau
       dobel. Dan `SWAP L,M` membuat L selalu yang lebih besar. */
    { baris: 2560, jalan: function (m) {
        m.v.L = Math.trunc(m.acak() * 6 + 1);
        m.v.M = Math.trunc(m.acak() * 6 + 1);
        m.v.D = 2;
        if (m.v.L === m.v.M) m.v.D = 4;
        else if (m.v.L < m.v.M) { var t = m.v.L; m.v.L = m.v.M; m.v.M = t; }
      } },
    { baris: 2570, jalan: function (m) {
        m.lompat(m.v.W + 1 === 1 ? 2770 : 3080);
      } },
    { baris: 2580, bagian: [
        function (m) {
          m.locate(25, 1); m.spc(79); m.barisBaru();
          m.locate(25, 1); m.cetak('INVALID MOVE');
          m.v.TIMEOUT = 6;
        },
        function (m) { m.gosub(59950); },
        function (m) { m.kembali(); }
      ] },

    /* --- 2590-2765: menggambar papan -------------------------------------- */
    { baris: 2590, jalan: function (m) {
        m.cls();
        for (m.v.X = 20; m.v.X <= 70; m.v.X += 4) {
          for (m.v.Y = 3; m.v.Y <= 19; m.v.Y++) {
            m.locate(m.v.Y, m.v.X); m.cetak(keBita('║'));
          }
        }
      } },
    papan(2600, 2, '╔═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╗'),
    papan(2610, 20, '╚═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╝'),
    papan(2620, 11, '╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣'),
    /* 2630 nomor titik dicetak DUA KALI: 24..13 di atas, dan 25 dikurangi
       nomor itu di bawah. Satu gelung, dua deret. */
    { baris: 2630, jalan: function (m) {
        m.v.Y = 24;
        for (m.v.X = 21; m.v.X <= 65; m.v.X += 4) {
          m.locate(1, m.v.X); m.cetak(basic(m.v.Y));
          m.v.Y1 = 25 - m.v.Y;
          m.locate(21, m.v.X); m.cetak(basic(m.v.Y1));
          m.v.Y = m.v.Y - 1;
        }
      } },
    { baris: 2640, jalan: function (m) {
        m.locate(11, 5); m.cetak('ON BAR');
        m.locate(10, 6); m.cetak(P2);
        m.locate(12, 6); m.cetak(P1);
      } },
    { baris: 2645, jalan: function (m) {
        m.v.N1 = 7 - Math.trunc(m.v['A$()'][1].length / 2);
        m.v.N2 = 7 - Math.trunc(m.v['A$()'][2].length / 2);
      } },
    { baris: 2650, jalan: function (m) {
        m.locate(9, 6); m.cetak(basic(m.v['A()'][0]));
        m.locate(13, 6); m.cetak(basic(m.v['A()'][25]));
        m.locate(8, Math.max(1, m.v.N2)); m.cetak(m.v['A$()'][2]);
        m.locate(14, Math.max(1, m.v.N1)); m.cetak(m.v['A$()'][1]);
      } },
    { baris: 2660, jalan: function (m) { m.untuk('X', 24, 13, -1, 2720); } },
    { baris: 2670, jalan: function (m) {
        if (m.v['A()'][m.v.X] === 0) { m.lompat(2710); return; }
        m.v.U = m.v['A()'][m.v.X] < 0 ? 2 : 1;
      } },
    { baris: 2680, bagian: [
        function (m) {
          m.untuk('Z', 1, Math.abs(m.v['A()'][m.v.X]), 1, 2710);
        },
        function (m) { m.v.S = 3 + m.v.Z - 1; }
      ] },
    { baris: 2690, jalan: function (m) {
        m.v.Y = (24 - m.v.X) * 4 + 21;
        m.locate(m.v.S, m.v.Y);
        m.cetak(m.v.U === 1 ? P1 : P2);
      } },
    { baris: 2700, jalan: function (m) { m.lanjutkan('Z'); } },
    { baris: 2710, jalan: function (m) { m.lanjutkan('X'); } },
    { baris: 2720, bagian: [
        function (m) { m.untuk('X', 1, 12, 1, 2770); },
        function (m) { if (m.v['A()'][m.v.X] === 0) m.lompat(2765); }
      ] },
    { baris: 2730, jalan: function (m) {
        m.v.U = m.v['A()'][m.v.X] < 0 ? 2 : 1;
      } },
    { baris: 2740, bagian: [
        function (m) {
          m.untuk('Z', 1, Math.abs(m.v['A()'][m.v.X]), 1, 2765);
        },
        function (m) { m.v.S = 20 - m.v.Z; }
      ] },
    { baris: 2750, jalan: function (m) {
        m.v.Y = (m.v.X - 1) * 4 + 21;
        m.locate(m.v.S, m.v.Y);
        m.cetak(m.v.U === 1 ? P1 : P2);
      } },
    { baris: 2760, jalan: function (m) { m.lanjutkan('Z'); } },
    { baris: 2765, bagian: [
        function (m) { m.lanjutkan('X'); },
        function (m) { m.kembali(); }
      ] },

    /* --- 2770-3070: giliran pemain 1 (bergerak 24 -> 1) -------------------- */
    { baris: 2770, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 1);
        m.cetak(m.v['A$()'][1] + ', your roll is  ');
        m.warna(15, null); m.cetak(basic(m.v.L)); m.warna(7, null);
      } },
    { baris: 2780, jalan: function (m) {
        m.v.J = 25;
        if (m.v.D > 1) {
          m.warna(15, null); m.cetak(basic(m.v.M)); m.warna(7, null);
        }
      } },
    /* 2790 bidak di bar TIDAK BISA masuk kalau kedua titik tujuannya
       diblokir. `A(x) < -1` berarti dua bidak lawan atau lebih. */
    { baris: 2790, jalan: function (m) {
        var A = m.v['A()'];
        if (A[25] > 0 && A[25 - m.v.L] < -1 && A[25 - m.v.M] < -1) m.lompat(3070);
      } },
    { baris: 2800, jalan: function (m) {
        if (m.v['A()'][m.v.J] < 1) { m.v.J = m.v.J - 1; m.lompat(2800); }
      } },
    /* 2810-2840 mencari apakah ADA langkah sah sama sekali. Kalau tidak,
       giliran hangus. */
    { baris: 2810, bagian: [
        function (m) { m.v.E = 0; m.untuk('X', m.v.L + 1, 25, 1, 2820); },
        function (m) {
          var A = m.v['A()'];
          if (A[m.v.X] > 0 && A[m.v.X - m.v.L] > -2) m.v.E = 1;
        }
      ] },
    { baris: 2820, bagian: [
        function (m) { m.lanjutkan('X'); },
        function (m) { m.untuk('X', m.v.M + 1, 25, 1, 2830); },
        function (m) {
          var A = m.v['A()'];
          if (A[m.v.X] > 0 && A[m.v.X - m.v.M] > -2) m.v.E = 1;
        }
      ] },
    { baris: 2830, bagian: [
        function (m) { m.lanjutkan('X'); },
        function (m) {
          if (m.v.E === 1) m.lompat(2850);
          else if (m.v.J > 6) m.lompat(3070);
        }
      ] },
    { baris: 2840, jalan: function (m) {
        var A = m.v['A()'];
        if (A[m.v.M] < 1 && A[m.v.L] < 1 && m.v.J > m.v.L) m.lompat(3070);
      } },
    { baris: 2850, jalan: function (m) {
        if (m.v['A()'][25] > 0) {
          m.v.F = 25; m.locate(25, 40); m.warna(15, null);
          m.cetak('FROM BAR '); m.warna(7, null);
          m.lompat(2880);
        }
      } },
    { baris: 2860, bagian: [
        function (m) { m.locate(25, 40); m.warna(15, null); },
        function (m) { m.masukan('IN$', 'FROM-- '); },
        function (m) {
          m.warna(7, null);
          m.v.F = Math.round(parseFloat(m.v['IN$']) || 0);
          if (m.v.F < 1 || m.v.F > 24) m.lompat(2940);
        }
      ] },
    { baris: 2870, jalan: function (m) {
        if (m.v['A()'][m.v.F] < 1) m.lompat(2940);
      } },
    { baris: 2880, bagian: [
        function (m) { m.locate(25, 60); m.warna(15, null); },
        function (m) { m.masukan('IN$', 'TO-- '); },
        function (m) {
          m.warna(7, null);
          m.v.T = Math.round(parseFloat(m.v['IN$']) || 0);
        }
      ] },
    /* 2890 `99` berarti "keluarkan dari papan" — dijelaskan di petunjuk
       baris 3790. */
    { baris: 2890, jalan: function (m) { if (m.v.T === 99) m.lompat(3020); } },
    { baris: 2900, jalan: function (m) {
        if (m.v.T < 1 || m.v.T > 24) m.lompat(2940);
      } },
    { baris: 2910, jalan: function (m) {
        if (m.v['A()'][m.v.T] < -1) m.lompat(2940);
      } },
    /* 2920-2930 dadu yang dipakai DIBUANG dengan menyalin yang lain ke
       atasnya. Sesudah dua langkah, keduanya sama dan `D` sudah nol. */
    { baris: 2920, jalan: function (m) {
        if (m.v.F - m.v.T === m.v.L) { m.v.L = m.v.M; m.lompat(2950); }
      } },
    { baris: 2930, jalan: function (m) {
        if (m.v.F - m.v.T === m.v.M) { m.v.M = m.v.L; m.lompat(2950); }
      } },
    { baris: 2940, bagian: [
        function (m) { m.gosub(2580); },
        function (m) { m.lompat(2770); }
      ] },
    /* 2950 MEMUKUL: kalau di tujuan cuma ada SATU bidak lawan (nilai -1),
       ia dikirim ke bar. */
    { baris: 2950, jalan: function (m) {
        var A = m.v['A()'];
        A[m.v.F] = A[m.v.F] - 1;
        if (A[m.v.T] === -1) { A[0] = A[0] + 1; A[m.v.T] = 0; }
      } },
    { baris: 2960, jalan: function (m) {
        m.v['A()'][m.v.T] = m.v['A()'][m.v.T] + 1;
      } },
    { baris: 2970, bagian: [
        function (m) { m.gosub(3430); },
        function (m) { m.v.D = m.v.D - 1; m.v.E = 0; m.untuk('X', 1, 25, 1, 2990); }
      ] },
    { baris: 2980, jalan: function (m) {
        if (m.v['A()'][m.v.X] < 1) m.v.E = m.v.E + 1;
      } },
    { baris: 2990, bagian: [
        function (m) { m.lanjutkan('X'); },
        function (m) { if (m.v.E === 25) m.lompat(3580); }
      ] },
    { baris: 3000, jalan: function (m) {
        if (m.v.D === 0) { m.v.W = 1; m.lompat(2510); }
      } },
    { baris: 3010, jalan: function (m) { m.lompat(2770); } },
    { baris: 3020, jalan: function (m) { if (m.v.J > 6) m.lompat(2940); } },
    { baris: 3030, jalan: function (m) {
        if (m.v.F === m.v.M || (m.v.M > m.v.J && m.v.F === m.v.J)) {
          m.v.M = m.v.L; m.lompat(3060);
        }
      } },
    { baris: 3040, jalan: function (m) {
        if (m.v.F === m.v.L || (m.v.L > m.v.J && m.v.F === m.v.J)) {
          m.v.L = m.v.M; m.lompat(3060);
        }
      } },
    { baris: 3050, jalan: function (m) { m.lompat(2940); } },
    { baris: 3060, jalan: function (m) {
        m.v['A()'][m.v.F] = m.v['A()'][m.v.F] - 1; m.lompat(2970);
      } },
    { baris: 3070, bagian: [
        function (m) { m.v.TIMEOUT = 3; },
        function (m) { m.gosub(59950); },
        function (m) {
          m.locate(25, 1); m.spc(79);
          m.locate(25, 1); m.cetak("You can't move!");
          m.v.W = Math.abs(m.v.W - 1);
          m.v.TIMEOUT = 6;
        },
        function (m) { m.gosub(59950); },
        function (m) { m.locate(25, 1); m.spc(79); m.lompat(2510); }
      ] },

    /* --- 3080-3420: giliran pemain 2 (bergerak 1 -> 24) -------------------- *
       Kembar dengan 2770-3070, dengan SETIAP perbandingan dibalik: `>` jadi
       `<`, `+L` jadi `-L`, bar-nya A(0) bukan A(25).                        */
    { baris: 3080, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 1);
        m.cetak(m.v['A$()'][2] + ', your roll is  ');
        m.warna(15, null); m.cetak(basic(m.v.L)); m.warna(7, null);
      } },
    { baris: 3090, jalan: function (m) {
        if (m.v.D > 1) {
          m.warna(15, null); m.cetak(basic(m.v.M)); m.warna(7, null);
        }
      } },
    { baris: 3100, jalan: function (m) { m.v.J = 0; } },
    { baris: 3110, jalan: function (m) {
        var A = m.v['A()'];
        if (A[0] > 0 && A[m.v.L] > 1 && A[m.v.M] > 1) m.lompat(3070);
      } },
    { baris: 3120, jalan: function (m) {
        var A = m.v['A()'];
        if (A[0] < 1 && A[m.v.J] >= 0) { m.v.J = m.v.J + 1; m.lompat(3120); }
      } },
    { baris: 3130, jalan: function (m) {
        var A = m.v['A()'];
        m.v.E = 0;
        if (A[0] > 0 && A[m.v.L] < 2) m.v.E = 1;
      } },
    { baris: 3140, jalan: function (m) {
        var A = m.v['A()'];
        if (A[0] > 0 && A[m.v.M] < 2) m.v.E = 1;
      } },
    { baris: 3150, bagian: [
        function (m) { m.untuk('X', 1, 24 - m.v.L, 1, 3160); },
        function (m) {
          var A = m.v['A()'];
          if (A[m.v.X] < 0 && A[m.v.X + m.v.L] < 2) m.v.E = 1;
        }
      ] },
    { baris: 3160, bagian: [
        function (m) { m.lanjutkan('X'); },
        function (m) { m.untuk('X', 1, 24 - m.v.M, 1, 3170); },
        function (m) {
          var A = m.v['A()'];
          if (A[m.v.X] < 0 && A[m.v.X + m.v.M] < 2) m.v.E = 1;
        }
      ] },
    { baris: 3170, bagian: [
        function (m) { m.lanjutkan('X'); },
        function (m) { if (m.v.E === 1) m.lompat(3200); }
      ] },
    { baris: 3180, jalan: function (m) { if (m.v.J < 19) m.lompat(3070); } },
    { baris: 3190, jalan: function (m) {
        var A = m.v['A()'];
        if (A[25 - m.v.M] > -1 && A[25 - m.v.L] > -1 && m.v.J < 25 - m.v.L) {
          m.lompat(3070);
        }
      } },
    { baris: 3200, jalan: function (m) {
        if (m.v['A()'][0] > 0) {
          m.v.F = 0; m.locate(25, 40); m.warna(15, null);
          m.cetak('FROM BAR '); m.warna(7, null);
          m.lompat(3240);
        }
      } },
    { baris: 3210, bagian: [
        function (m) { m.locate(25, 40); m.warna(15, null); },
        function (m) { m.masukan('IN$', 'FROM-- '); },
        function (m) {
          m.warna(7, null);
          m.v.F = Math.round(parseFloat(m.v['IN$']) || 0);
        }
      ] },
    { baris: 3220, jalan: function (m) {
        if (m.v.F < 1 || m.v.F > 24) m.lompat(3290);
      } },
    { baris: 3230, jalan: function (m) {
        if (m.v['A()'][m.v.F] > -1) m.lompat(3290);
      } },
    { baris: 3240, bagian: [
        function (m) { m.locate(25, 60); m.warna(15, null); },
        function (m) { m.masukan('IN$', 'TO-- '); },
        function (m) {
          m.warna(7, null);
          m.v.T = Math.round(parseFloat(m.v['IN$']) || 0);
          if (m.v.T === 99) m.lompat(3380);
        }
      ] },
    { baris: 3250, jalan: function (m) {
        if (m.v.T < 1 || m.v.T > 24) m.lompat(3290);
      } },
    { baris: 3260, jalan: function (m) {
        if (m.v['A()'][m.v.T] > 1) m.lompat(3290);
      } },
    { baris: 3270, jalan: function (m) {
        if (m.v.T - m.v.F === m.v.L) { m.v.L = m.v.M; m.lompat(3300); }
      } },
    { baris: 3280, jalan: function (m) {
        if (m.v.T - m.v.F === m.v.M) { m.v.M = m.v.L; m.lompat(3300); }
      } },
    { baris: 3290, bagian: [
        function (m) { m.gosub(2580); },
        function (m) { m.lompat(3080); }
      ] },
    /* 3300 `A(0)=A(0)-2` — bar pemain 2 dikurangi DUA, lalu baris 3310
       menambahkannya satu lagi. Bersih hasilnya minus satu. Cara yang
       berbelit untuk sesuatu yang bisa ditulis langsung. */
    { baris: 3300, jalan: function (m) {
        if (m.v.F === 0) m.v['A()'][0] = m.v['A()'][0] - 2;
      } },
    { baris: 3310, jalan: function (m) {
        var A = m.v['A()'];
        A[m.v.F] = A[m.v.F] + 1;
        if (A[m.v.T] === 1) { A[25] = A[25] + 1; A[m.v.T] = 0; }
      } },
    { baris: 3320, jalan: function (m) {
        m.v['A()'][m.v.T] = m.v['A()'][m.v.T] - 1;
      } },
    { baris: 3330, bagian: [
        function (m) { m.gosub(3430); },
        function (m) { m.v.D = m.v.D - 1; m.v.E = 0; m.untuk('X', 1, 25, 1, 3350); }
      ] },
    { baris: 3340, jalan: function (m) {
        if (m.v['A()'][m.v.X] > -1) m.v.E = m.v.E + 1;
      } },
    { baris: 3350, bagian: [
        function (m) { m.lanjutkan('X'); },
        function (m) { if (m.v.E === 25) m.lompat(3590); }
      ] },
    { baris: 3360, jalan: function (m) {
        if (m.v.D === 0) { m.v.W = 0; m.lompat(2510); }
      } },
    { baris: 3370, jalan: function (m) { m.lompat(3080); } },
    { baris: 3380, jalan: function (m) { if (m.v.J < 19) m.lompat(3290); } },
    { baris: 3390, jalan: function (m) {
        if (m.v.F === 25 - m.v.M || (m.v.J > 25 - m.v.M && m.v.F === m.v.J)) {
          m.v.M = m.v.L; m.lompat(3420);
        }
      } },
    { baris: 3400, jalan: function (m) {
        if (m.v.F === 25 - m.v.L || (m.v.J > 25 - m.v.L && m.v.F === m.v.J)) {
          m.v.L = m.v.M; m.lompat(3420);
        }
      } },
    { baris: 3410, jalan: function (m) { m.lompat(3290); } },
    { baris: 3420, jalan: function (m) {
        m.v['A()'][m.v.F] = m.v['A()'][m.v.F] + 1; m.lompat(3330);
      } },

    /* --- 3430-3570: gambar ulang HANYA dua petak yang berubah -------------- */
    { baris: 3430, bagian: [
        function (m) {
          m.locate(9, 6); m.cetak(basic(m.v['A()'][0]));
          m.locate(13, 6); m.cetak(basic(m.v['A()'][25]));
          if (m.v.F === 0 || m.v.F === 25) m.lompat(3450);
        }
      ] },
    { baris: 3440, bagian: [
        function (m) { m.v.H = m.v.F; },
        function (m) { m.gosub(3460); },
        function (m) { if (m.v.T === 99) m.kembali(); }
      ] },
    { baris: 3450, bagian: [
        function (m) { m.v.H = m.v.T; },
        function (m) { m.gosub(3460); },
        function (m) { m.kembali(); }
      ] },
    { baris: 3460, jalan: function (m) {
        m.v.U = m.v['A()'][m.v.H] < 0 ? 2 : 1;
      } },
    { baris: 3470, jalan: function (m) {
        m.v.P = m.v['A()'][m.v.H];
        if (m.v.P > 8) m.v.P = 8;
      } },
    { baris: 3480, jalan: function (m) { if (m.v.H <= 12) m.lompat(3510); } },
    { baris: 3490, jalan: function (m) {
        m.v.X = (24 - m.v.H) * 4 + 21;
        m.v.G = (m.v.H === m.v.F) ? 1 : 0;
      } },
    { baris: 3500, jalan: function (m) {
        m.v.Y = 2 + Math.abs(m.v.P) + m.v.G; m.lompat(3540);
      } },
    { baris: 3510, jalan: function (m) {
        m.v.X = (m.v.H - 1) * 4 + 21;
        m.v.G = (m.v.H === m.v.F) ? 1 : 0;
      } },
    { baris: 3520, jalan: function (m) {
        m.v.Y = 20 - Math.abs(m.v.P) - m.v.G;
      } },
    { baris: 3540, jalan: function (m) {
        m.locate(Math.max(1, m.v.Y), m.v.X); m.cetak('   ');
      } },
    { baris: 3550, jalan: function (m) { if (m.v.H !== m.v.T) m.kembali(); } },
    { baris: 3560, jalan: function (m) {
        m.locate(Math.max(1, m.v.Y), m.v.X);
        m.cetak(m.v.U === 1 ? P1 : P2);
      } },
    { baris: 3570, jalan: function (m) { m.kembali(); } },
    { baris: 3580, bagian: [
        function (m) {
          m.locate(25, 1); m.spc(79);
          m.warna(25, null); m.locate(25, 1);
          m.cetak(m.v['A$()'][1] + ' WINS');
          m.v.TIMEOUT = 6;
        },
        function (m) { m.gosub(59950); },
        function (m) { m.warna(7, null); m.lompat(5000); }
      ] },
    { baris: 3590, bagian: [
        function (m) {
          m.locate(25, 1); m.spc(79);
          m.warna(25, null); m.locate(25, 1);
          m.cetak(m.v['A$()'][2] + ' WINS');
          m.v.TIMEOUT = 6;
        },
        function (m) { m.gosub(59950); },
        function (m) { m.warna(7, null); m.lompat(5000); }
      ] },

    /* --- 3600-3830: petunjuk, oleh John Beck ------------------------------ */
    rem(3600), rem(3601), rem(3602), rem(3603), rem(3604),
    { baris: 3605, jalan: function (m) {
        m.cls(); m.locate(1, 30); m.cetak('HOW TO PLAY'); m.barisBaru();
      } },
    { baris: 3610, jalan: function (m) {
        m.barisBaru(); m.tab(25); m.cetak('Each player has 15 MEN');
        m.barisBaru();
      } },
    tab(3620, 5, 'The ' + P1 + ' Men move from 24 to 1 & the ' + P2 + ' MEN move from 1 to 24.'),
    { baris: 3640, jalan: function (m) {
        m.barisBaru(); m.tab(5);
        m.cetak('Each player moves his MEN according to the throw of the dice.');
        m.barisBaru();
      } },
    tab(3650, 5, 'One MAN can be moved for both numbers, or if a double is thrown,'),
    tab(3660, 5, 'for all four. Alternatively a different MAN can be moved for each.'),
    { baris: 3670, jalan: function (m) {
        m.barisBaru(); m.tab(5);
        m.cetak('A POINT (the numbered rectangle) with 2 or more MEN is BLOCKED');
        m.barisBaru();
      } },
    tab(3680, 5, 'to an opponent, although it may jumped. When a player cannot move'),
    tab(3690, 5, 'because of BLOCKED POINTS he loses the move.'),
    { baris: 3700, jalan: function (m) {
        m.barisBaru(); m.tab(5);
        m.cetak('A single MAN on a POINT is a BLOT, and an opponent with the');
        m.barisBaru();
      } },
    tab(3710, 5, 'throw may (not compulsorary) play a MAN to the BLOT, in which'),
    tab(3720, 5, 'case the MAN resident on the BLOT goes to the BAR. A player with'),
    tab(3730, 5, 'a MAN on the BAR must re-enter the board and travel in the correct'),
    tab(3740, 5, 'direction before moving any other MAN.'),
    { baris: 3750, jalan: function (m) {
        m.barisBaru(); m.tab(5);
        m.cetak('When either player succeeds in moving all his MEN within 6 points');
        m.barisBaru();
      } },
    tab(3760, 5, 'of his end of the board he can move a MAN or THROW OFF the board.'),
    tab(3780, 5, 'When a number is cast higher than any POINT covered on the board,'),
    tab(3790, 5, 'any of the Men can be THROWN to 99.'),
    { baris: 3800, jalan: function (m) {
        m.locate(25, 15); m.cetak('Press the SPACE BAR to continue');
      } },
    { baris: 3810, jalan: function (m) {
        m.v['C$'] = m.inkey();
        if (m.v['C$'] === '') m.lompat(3810);
      } },
    { baris: 3820, jalan: function (m) {
        if (m.v['C$'] === ' ') m.lompat(2440);
      } },
    { baris: 3830, jalan: function (m) { m.lompat(3810); } },

    /* --- 5000-5040: main lagi --------------------------------------------- */
    { baris: 5000, jalan: function (m) {
        m.tab(15);
        m.cetak('Press Y to play again, or Space bar for menu'); m.barisBaru();
      } },
    { baris: 5010, jalan: function (m) {
        m.v['R$'] = m.inkey();
        if (m.v['R$'] === '') m.lompat(5010);
      } },
    { baris: 5020, jalan: function (m) {
        if (m.v['R$'] === 'Y' || m.v['R$'] === 'y') m.jalankan('BACKGAM');
      } },
    { baris: 5030, jalan: function (m) {
        if (m.v['R$'] === ' ') m.jalankan('MENU');
      } },
    { baris: 5040, jalan: function (m) { m.lompat(5010); } },
    /* 59950 gelung tunda yang MENGABAIKAN `TIMEOUT`. Empat tempat menyetel
       variabel itu ke 3 atau 6 lebih dulu, dan tidak satu pun berpengaruh:
       gelungnya selalu 1000 putaran. */
    { baris: 59950, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 1000; m.v.I++) { /* jeda */ }
        m.kembali();
      } },
    rem(59980),
    /* 59990 memasang ULANG jebakan F10 tiap kali menunggu tombol — perlu,
       karena jebakan yang penangannya tidak pernah RETURN akan mati. */
    { baris: 59990, jalan: function (m) {
        m.pasangJebakan(10, 5000);
        m.v['IKEY$'] = m.inkey();
        if (m.v['IKEY$'] === '') m.lompat(59990); else m.kembali();
      } }
  ];

  function papan(n, b, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(b, 20); m.cetak(keBita(isi));
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BACKGAM'] = {
    nama: 'BACKGAM',
    judul: 'Backgammon (satu larik bertanda untuk dua pemain)',
    sumber: 'BACKGAM',
    berkas: 'run/BACKGAM.BAS',
    tabel: tabel,
    benih: 31,

    arsitektur: {
      judul: 'Alur BACKGAM.BAS',
      simpul: [
        { id: 'nama', baris: '2430-2470', jenis: 'mulai',
          teks: ['Petunjuk?', 'lalu nama dua pemain'] },
        { id: 'susun', baris: '2480-2500',
          teks: ['Susunan awal 15 lawan 15;', 'undi siapa duluan'] },
        { id: 'gambar', baris: '2590-2765', jenis: 'subrutin',
          teks: ['Gambar papan penuh:', 'positif vs negatif'] },
        { id: 'pilih', baris: '2510-2560', jenis: 'putusan',
          teks: ['1 kocok dadu, 2 gambar ulang,', '3 permainan baru'] },
        { id: 'main1', baris: '2770-3070',
          teks: ['Pemain 1: 24 ke 1', 'bar di A(25)'] },
        { id: 'main2', baris: '3080-3420',
          teks: ['Pemain 2: 1 ke 24', 'bar di A(0) - semua dibalik'] },
        { id: 'petak', baris: '3430-3570', jenis: 'subrutin',
          teks: ['Gambar ulang HANYA', 'dua petak yang berubah'] },
        { id: 'buntu', baris: '3070', jenis: 'galat',
          teks: ['Tidak ada langkah sah:', 'giliran hangus'] },
        { id: 'menang', baris: '3580-3590', jenis: 'keluar',
          teks: ['Semua bidak keluar;', 'main lagi atau menu'] }
      ],
      panah: [
        { dari: 'nama', ke: 'susun' },
        { dari: 'susun', ke: 'gambar' },
        { dari: 'gambar', ke: 'pilih' },
        { dari: 'pilih', ke: 'main1', label: 'W=0' },
        { dari: 'pilih', ke: 'main2', label: 'W=1' },
        { dari: 'main1', ke: 'petak' },
        { dari: 'main2', ke: 'petak' },
        { dari: 'main1', ke: 'buntu', label: 'terkunci', jenis: 'galat' },
        { dari: 'main2', ke: 'buntu', jenis: 'galat' },
        { dari: 'buntu', ke: 'pilih', label: 'giliran pindah' },
        { dari: 'petak', ke: 'pilih', label: 'dua langkah habis' },
        { dari: 'main1', ke: 'menang' },
        { dari: 'main2', ke: 'menang' }
      ]
    },

    pseudokode: [
      { baris: 2482, tingkat: 0, teks: 'susunan awal: <b>positif</b> bidak pemain 1, <b>negatif</b> pemain 2' },
      { baris: 2560, tingkat: 0, teks: 'kocok dua dadu; dobel &rarr; <code>D=4</code>, dan <code>SWAP</code> membuat L yang besar' },
      { baris: 2790, tingkat: 0, teks: '<code>A(x) &lt; -1</code> &mdash; titik <b>diblokir</b> untuk pemain 1' },
      { baris: 2810, tingkat: 0, teks: 'sisir seluruh papan: <b>ada langkah sah?</b> kalau tidak, giliran hangus' },
      { baris: 2920, tingkat: 0, teks: 'dadu yang dipakai <b>dibuang</b> dengan menyalin yang lain ke atasnya' },
      { baris: 2950, tingkat: 0, teks: '<code>A(T) = -1</code> &rarr; <b>BLOT</b>: bidak lawan dikirim ke bar' },
      { baris: 2980, tingkat: 0, teks: 'menang kalau semua 25 petak sudah bukan milik lawan' },
      { baris: 3080, tingkat: 0, teks: 'giliran pemain 2 &mdash; <b>kembar, dengan setiap perbandingan dibalik</b>' },
      { baris: 3430, tingkat: 0, teks: 'gambar ulang <b>hanya dua petak</b>, bukan seluruh papan' }
    ],

    perintahAsli: 'run\\BACKGAM.bat',
    catatanAsli: 'Dua pemain bergantian di satu papan tombol. Ketik nomor ' +
      'titik asal lalu tujuan; 99 untuk mengeluarkan bidak dari papan.',

    penyimpangan: [
      '<b><code>PLAY</code> diam.</b>',
      '<b>Gelung tunda di baris 59950 habis seketika.</b>',
      '<b><code>COLOR 25</code> (baris 3580) adalah 9 + 16</b> &mdash; biru ' +
      'terang <b>berkedip</b>. Konsol penelusur tidak berkedip, jadi ' +
      'pengumuman pemenang tampil diam.',
      '<b><code>LOAD "MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Satu larik bertanda menyimpan papan backgammon untuk dua ' +
        'pemain sekaligus &mdash; dan seluruh aturan blok, blot, dan bar jadi ' +
        'soal perbandingan.',
      pelajari: [
        ['Tanda membedakan dua pemain',
         '<code>A(1)</code> sampai <code>A(24)</code> menyimpan isi tiap ' +
         'titik sebagai <b>bilangan bertanda</b>: positif berarti bidak ' +
         'pemain 1, negatif pemain 2, besarnya berapa banyak. Akibatnya ' +
         'seluruh aturan jadi perbandingan sederhana: <code>A(x) &lt; -1</code> ' +
         'berarti diblokir, <code>A(T) = -1</code> berarti ada blot yang bisa ' +
         'dipukul. Satu larik, dua pemain, nol percabangan.'],
        ['Dua ujung larik sebagai bar',
         '<code>A(0)</code> dan <code>A(25)</code> bukan titik papan &mdash; ' +
         'keduanya <b>bar</b>, tempat bidak yang dipukul menunggu. Karena ' +
         'pemain bergerak ke arah berlawanan, masing-masing punya ujungnya ' +
         'sendiri, dan gelung <code>FOR X=1 TO 24</code> otomatis melewatinya.'],
        ['Dadu yang dipakai dibuang dengan menyalin',
         'Baris 2920&ndash;2930: kalau langkahnya sejauh <code>L</code>, maka ' +
         '<code>L=M</code>. Kalau sejauh <code>M</code>, maka <code>M=L</code>. ' +
         'Sesudah satu langkah, kedua variabel berisi dadu yang tersisa; ' +
         'sesudah dua, keduanya sama dan <code>D</code> sudah nol. ' +
         '<b>Membuang tanpa menghapus.</b>'],
        ['Gambar ulang hanya yang berubah',
         'Subrutin 3430&ndash;3570 menggambar ulang <b>dua petak</b> &mdash; ' +
         'asal dan tujuan &mdash; bukan seluruh papan. Di layar 4,77 MHz, ' +
         'menggambar 24 titik memakan waktu yang terasa; menggambar dua tidak. ' +
         'Dan tombol "2 = REDRAW BOARD" ada justru untuk saat penggambaran ' +
         'sebagian itu meleset.'],
        ['Sisir dulu, baru tanya',
         'Baris 2810&ndash;2840 menyisir seluruh papan untuk mencari apakah ' +
         '<b>ada</b> langkah sah, sebelum pemain diminta memasukkan apa pun. ' +
         'Kalau tidak ada, gilirannya hangus dengan pesan "You can\'t move!". ' +
         'Bandingkan HIQUE2.BAS, yang tidak pernah memeriksa ini.']
      ],
      hindari: [
        ['Dua giliran yang hampir kembar',
         'Baris 2770&ndash;3070 dan 3080&ndash;3420 melakukan hal yang sama ' +
         'untuk dua pemain, dengan setiap perbandingan dibalik. <b>Tiga puluh ' +
         'lima baris, dua kali</b>. Karena arah dan tandanya berlawanan, ' +
         'menyatukannya butuh variabel arah &mdash; dan penulisnya memilih ' +
         'menyalin. Akibatnya setiap perbaikan harus dikerjakan dua kali, dan ' +
         'tidak ada apa pun yang memaksa keduanya tetap sejalan.'],
        ['Variabel jeda yang tidak pernah dipakai',
         'Empat tempat menyetel <code>TIMEOUT=3</code> atau ' +
         '<code>TIMEOUT=6</code> sebelum <code>GOSUB 59950</code>. Baris 59950 ' +
         'berbunyi <code>FOR I=1 TO 1000:NEXT:RETURN</code> &mdash; ' +
         '<b><code>TIMEOUT</code> tidak muncul di sana sama sekali</b>. Semua ' +
         'jeda sama panjang, dan empat penugasan itu tidak berarti apa-apa.'],
        ['Pengurangan dua lalu penambahan satu',
         'Baris 3300: <code>IF F=0 THEN A(0)=A(0)-2</code>, lalu baris 3310 ' +
         'menambahkan satu ke <code>A(F)</code> yang sama. Hasil bersihnya ' +
         'minus satu &mdash; ditulis sebagai dua langkah yang saling ' +
         'menghapus sebagian.'],
        ['Nomor baris yang mulai dari 2430',
         'Dua ribu empat ratus dua puluh sembilan nomor pertama tidak pernah ' +
         'ada. Bersama SERPENT.BAS (mulai 500) dan ZAP\'EM.BAS (mulai 230), ' +
         'ini berkas ketiga yang penomorannya dimulai jauh dari nol tanpa ' +
         'penjelasan.'],
        ['Salah eja di petunjuk',
         '<code>compulsorary</code> (baris 3710), dan ' +
         '<code>it may jumped</code> (3680) yang kehilangan kata "be".']
      ]
    },

    penjelasan: [
      { judul: 'Satu larik, dua pemain, dibedakan tandanya',
        isi: [
          'Papan backgammon punya 24 titik, dan tiap titik bisa berisi bidak ' +
          'salah satu pemain &mdash; tidak pernah keduanya.',
          'Cara biasa menyimpannya: dua larik, satu per pemain. Atau satu ' +
          'larik pasangan (pemilik, jumlah).',
          'Program ini memakai <b>satu larik bilangan bertanda</b>:',
          '<code>2482 A(24)=2:A(19)=-5:A(17)=-3:A(13)=5:A(12)=-5:A(8)=3:' +
          'A(6)=5:A(1)=-2</code>',
          'Positif berarti bidak pemain 1, negatif pemain 2, besarnya berapa ' +
          'banyak. Jumlah mutlaknya lima belas di tiap sisi &mdash; susunan ' +
          'awal backgammon yang benar, dalam satu baris.',
          'Yang membuat pilihan ini menang: <b>seluruh aturannya jadi ' +
          'perbandingan</b>.',
          '<code>A(x) &lt; -1</code> &mdash; ada dua bidak lawan atau lebih, ' +
          'titik itu diblokir untuk pemain 1.<br>' +
          '<code>A(T) = -1</code> &mdash; ada tepat satu bidak lawan, itu ' +
          '<i>blot</i> yang bisa dipukul.<br>' +
          '<code>A(T) &gt; 1</code> &mdash; kebalikannya, dari sudut pandang ' +
          'pemain 2.',
          'Tidak ada satu pun <code>IF pemilik = ...</code> di seluruh ' +
          'program. Kepemilikan dan jumlah disimpan di satu bilangan, dan ' +
          'operator perbandingan yang membacanya.',
          'Dan dua ujung lariknya &mdash; <code>A(0)</code> dan ' +
          '<code>A(25)</code> &mdash; bukan titik papan sama sekali; keduanya ' +
          '<b>bar</b>, tempat bidak yang dipukul menunggu. Karena kedua ' +
          'pemain bergerak ke arah berlawanan, masing-masing punya ujungnya ' +
          'sendiri, dan setiap gelung yang menulis <code>FOR X=1 TO 24</code> ' +
          'otomatis melewatinya.'
        ] },
      { judul: 'Harga dari dua arah yang berlawanan',
        isi: [
          'Pemain 1 bergerak dari titik 24 ke titik 1. Pemain 2 dari 1 ke 24. ' +
          'Itu aturan backgammon, dan itu yang membuat separuh berkas ini ' +
          'kembar.',
          'Baris 2770&ndash;3070 adalah giliran pemain 1. Baris ' +
          '3080&ndash;3420 giliran pemain 2. Keduanya melakukan hal yang sama ' +
          'persis &mdash; periksa bar, cari langkah sah, tanya asal dan ' +
          'tujuan, pukul kalau ada blot, buang dadu &mdash; dengan <b>setiap ' +
          'perbandingan dibalik</b>:',
          '<code>2790 IF A(25)&gt;0 AND A(25-L)&lt;-1 AND A(25-M)&lt;-1</code><br>' +
          '<code>3110 IF A(0)&gt;0 AND A(L)&gt;1 AND A(M)&gt;1</code>',
          'Tiga puluh lima baris, dua kali. Setiap perbaikan di satu sisi ' +
          'harus dikerjakan lagi di sisi lain, dan tidak ada apa pun yang ' +
          'memaksa keduanya tetap sejalan.',
          'Menyatukannya sebenarnya bisa: tambahkan variabel arah ' +
          '(<code>+1</code> atau <code>&minus;1</code>), tanda pemain, dan ' +
          'nomor bar. Semua perbandingan lalu dikalikan tanda itu.',
          'Yang membuat penulisnya memilih menyalin mungkin sederhana: di ' +
          'BASIC tanpa fungsi berparameter, "tambahkan variabel arah" berarti ' +
          'menyetel empat variabel global sebelum tiap pemanggilan, dan ' +
          'membacanya kembali sesudahnya. Salinannya lebih panjang, tapi tiap ' +
          'barisnya bisa dibaca sendirian.',
          '<b>Duplikasi bukan selalu kemalasan; kadang ia harga dari bahasa ' +
          'yang tidak punya cara lain.</b>'
        ] }
    ]
  };
})(window);
