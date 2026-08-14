/* ===========================================================================
   HIQUE2.js — porting minimalis HIQUE2.BAS sebagai tabel baris.

   Seratus empat puluh dua baris, Wes Meier. Teka-teki Hi-Q: 33 lubang
   berbentuk salib, 32 pasak, satu lubang kosong di tengah. Lompati pasak
   untuk membuangnya; sisakan sesedikit mungkin.

   DAN GAGASAN PUSATNYA ADALAH MENGUBAH SALIB JADI KISI.

   Papannya tidak beraturan: barisnya selebar 3, 3, 7, 7, 7, 3, 3. Menguji
   "apakah dua lubang bertetangga" di bentuk seperti itu biasanya butuh tabel
   ketetanggaan. Program ini tidak punya satu pun.

   Yang ada baris 109-118: tiap nomor lubang DIGESER supaya jatuh di tempatnya
   pada KISI 7x7 yang teratur —

       lubang 1-3   ->  n - 6      (baris paling atas)
       lubang 4-6   ->  n - 2
       lubang 7-27  ->  n          (tiga baris lebar, sudah 7 apart)
       lubang 28-30 ->  n + 2
       lubang 31-33 ->  n + 6

   Sesudah itu seluruh aturan lompatan muat di satu baris:

       119 IF ABS(MT-MF)<>2 AND ABS(MT-MF)<>14 THEN <tolak>

   Dua berarti mendatar, empat belas berarti menegak (dua baris kisi selebar
   tujuh). Dan pasak yang dilompati ada tepat di tengahnya: (MF+MT)/2, digeser
   balik oleh baris 121-124.

   Satu tabel ketetanggaan 33x4 diganti sembilan baris aritmetika.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - PENA CAHAYA tidak ada. `PEN ON`, `ON PEN GOSUB`, dan `PEN(8)/PEN(9)`
     tidak ditiru; `USE.PEN` selalu berakhir nol, jadi yang berjalan selalu
     jalur papan tombol. Subrutin pena di baris 63-74 tetap ada di tabel dan
     bisa dibaca, tapi tidak pernah dipanggil.
   - `SOUND` dan `PLAY` diam.
   - `COLOR 20` dan `COLOR 22` memakai atribut KEDIP (4+16 dan 6+16); konsol
     penelusur tidak berkedip.
   - `POKE &H417,96` (Caps Lock + Num Lock menyala) tidak ditiru.
   =========================================================================== */

(function (global) {
  'use strict';

  var BLOK = 219, KIRI = 29, BAWAH = 31, ATAS = 30,
      DATAR = 196, KA = 218, KN = 191, BA = 192, BN = 217;

  function ul(kode, n) {
    var s = String.fromCharCode(kode), k = '', i;
    for (i = 0; i < n; i++) k += s;
    return k;
  }
  function c(k) { return String.fromCharCode(k); }
  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }

  var tabel = [

    rem(1), rem(2), rem(3), rem(4), rem(5), rem(6), rem(7),
    { baris: 8, jalan: function (m) {
        m.kursor(false); m.warna(7, 9); m.cls();
      } },
    /* 9 `DEFINT B-Z:DEFSTR A` — semua huruf kecuali A bertipe bulat, dan A
       (termasuk A(), AB, AX) bertipe string. */
    { baris: 9, jalan: function (m) {
        m.dim('P()', 33); m.dim('L()', 33); m.dim('T()', 33); m.dim('L2T()', 33);
        /* `A()` tidak ada di DIM-nya: BASIC melarik-otomatiskannya sampai 10
           saat baris 15 mengisinya. Delapan yang dipakai. */
        m.dim('A()', 10);
      } },
    { baris: 10, jalan: function () { } },
    /* 11-13 GAMBAR PASAK DAN LUBANG, ditulis sebagai satu string berisi kode
       GERAK KURSOR. 29 kiri, 30 atas, 31 bawah. Jadi satu `PRINT A;`
       menggambar kotak 4x2 — dua baris sekaligus, dari satu string. */
    { baris: 11, jalan: function (m) {
        m.v.A = ul(BLOK, 4) + ul(KIRI, 4) + c(BAWAH) + ul(BLOK, 4) + c(ATAS) + '  ';
      } },
    { baris: 12, jalan: function (m) {
        m.v.AB = c(KA) + ul(DATAR, 2) + c(KN) + ul(KIRI, 4) + c(BAWAH);
      } },
    { baris: 13, jalan: function (m) {
        m.v.AB += c(BA) + ul(DATAR, 2) + c(BN) + c(ATAS) + '  ';
      } },
    { baris: 14, jalan: function (m) { m.v.MOVE = 0; m.v.PEGS = 32; } },
    nomor(15, '       1  2  3'),
    nomor(16, '       4  5  6'),
    nomor(17, ' 7  8  9 10 11 12 13'),
    nomor(18, '14 15 16 17 18 19 20'),
    nomor(19, '21 22 23 24 25 26 27'),
    nomor(20, '      28 29 30'),
    nomor(21, '      31 32 33'),
    nomor(22, '  Board Numbering'),
    /* 23 `FULL=-1:EMPTY=NOT FULL` — benar dan salah sebagai nilai, dan
       `NOT -1` memberi 0. Sesudah ini `IF P(X)=FULL` terbaca seperti
       kalimat. */
    { baris: 23, jalan: function (m) { m.v.FULL = -1; m.v.EMPTY = 0; } },
    { baris: 24, bagian: [
        function (m) { m.gosub(25); },
        function (m) { m.lompat(26); }
      ] },
    { baris: 25, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 33; m.v.X++) m.v['P()'][m.v.X] = m.v.FULL;
        m.v['P()'][17] = m.v.EMPTY;
        m.kembali();
      } },
    rem(26), rem(27), rem(28), rem(29),
    { baris: 30, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 33; m.v.X++) m.v['L()'][m.v.X] = m.baca();
      } },
    /* 31 `L2T(X)=L(X)^2-T(X)` — baris dan kolom dijadikan SATU angka, supaya
       pencocokan pena cahaya cukup satu perbandingan. Sebuah fungsi
       pemasangan, ditulis tanpa menyebut namanya. */
    { baris: 31, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 33; m.v.X++) {
          m.v['T()'][m.v.X] = m.baca();
          m.v['L2T()'][m.v.X] =
            m.v['L()'][m.v.X] * m.v['L()'][m.v.X] - m.v['T()'][m.v.X];
        }
      } },
    { baris: 32, jalan: function () { /* PEN ON: tidak ada pena cahaya */ } },
    { baris: 33, jalan: function () { /* ON PEN GOSUB 63 */ } },
    { baris: 34, jalan: function (m) { m.v['USE.PEN'] = -1; } },
    { baris: 35, jalan: function (m) {
        m.tab(30); m.warna(20, 7); m.cetak(' *** HIQUE *** '); m.barisBaru();
        m.warna(7, 9); m.barisBaru();
      } },
    cet(36, 'HIQUE is a puzzle that has 32 pegs or blocks arranged in a cross shape with the'),
    cet(37, 'center position of the cross empty. Your task is to is to remove as many pegs'),
    cet(38, 'as you can. A fantastic solution is one that has only one peg remaining.'),
    cet(39, 'The PERFECT game ends with the one peg remaining in the center position!'),
    cet(40, ''),
    cet(41, 'Rules:'),
    cet(42, '     - Pegs are removed ONLY when they are JUMPED by another peg.'),
    cet(43, '     - You may jump ONLY One peg at a time.'),
    cet(44, '     - You may jump ONLY vertically or horizontally...NOT diagonally.'),
    cet(45, '     - You may jump ONLY into an EMPTY space.'),
    cet(46, ''),
    cet(47, "Don't worry about making a mistake, HIQUE won't let you!"),
    { baris: 48, jalan: function (m) {
        m.barisBaru();
        m.cetak('Now, press any key to start the puzzle or, if you have a light pen,');
        m.barisBaru();
      } },
    { baris: 49, jalan: function (m) {
        m.cetak('touch the screen........');
        m.warna(20, 7); m.cetak('   GOOD LUCK !!   ');
      } },
    { baris: 50, jalan: function (m) { m.v.PENFLAG = -1; } },
    { baris: 51, jalan: function (m) {
        m.v.AX = m.inkey();
        if (m.v.AX === '') m.lompat(51);
      } },
    /* 52 menekan tombol MEMATIKAN pena. Di mesin sungguhan, menyentuh layar
       lebih dulu akan membuat `USE.PEN` tetap -1 dan seluruh permainan
       dikemudikan pena. Di penelusur, jalur itu tidak pernah diambil. */
    { baris: 52, jalan: function (m) { m.v['USE.PEN'] = 0; } },
    { baris: 53, jalan: function (m) { m.lompat(75); } },

    /* --- 54-62: menggambar salibnya --------------------------------------- */
    rem(54),
    { baris: 55, jalan: function (m) { m.untuk('X', 1, 33, 1, 59); } },
    { baris: 56, jalan: function (m) {
        m.locate(m.v['L()'][m.v.X], m.v['T()'][m.v.X]);
      } },
    { baris: 57, jalan: function (m) {
        m.cetak(m.v['P()'][m.v.X] === m.v.FULL ? m.v.A : m.v.AB);
      } },
    { baris: 58, jalan: function (m) { m.lanjutkan('X'); } },
    { baris: 59, jalan: function (m) { if (m.v['USE.PEN']) m.kembali(); } },
    { baris: 60, jalan: function (m) { m.locate(1, 1); } },
    { baris: 61, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 8; m.v.X++) {
          m.cetak(m.v['A()'][m.v.X]); m.barisBaru();
        }
      } },
    { baris: 62, jalan: function (m) { m.kembali(); } },

    /* --- 63-74: subrutin pena cahaya -------------------------------------- *
       Tidak pernah dipanggil di penelusur, tapi tetap layak dibaca: ia
       mencari lubang mana yang disentuh dengan mencocokkan BARIS dulu, lalu
       KOLOM, lalu memakai angka gabungan L^2-T sebagai kunci terakhir.      */
    rem(63),
    { baris: 64, jalan: function (m) {
        if (m.v.PENFLAG) { m.v.PENFLAG = 0; m.kembali(75); }
      } },
    { baris: 65, jalan: function (m) { /* PEN(8)=24: mulai ulang */ } },
    { baris: 66, jalan: function (m) { m.v.L = 0; } },
    { baris: 67, jalan: function (m) { if (m.v.L === 0) m.kembali(); } },
    { baris: 68, jalan: function (m) { m.v.T = 0; } },
    { baris: 69, jalan: function () { } },
    { baris: 70, jalan: function (m) { if (m.v.T === 0) m.kembali(); } },
    { baris: 71, jalan: function (m) {
        m.v.L2T = m.v.L * m.v.L - m.v.T;
      } },
    { baris: 72, jalan: function () { } },
    { baris: 73, jalan: function () { } },
    { baris: 74, jalan: function (m) { m.kembali(); } },

    /* --- 75-108: satu giliran --------------------------------------------- */
    { baris: 75, bagian: [
        function (m) { m.warna(7, 9); m.cls(); },
        function (m) { m.gosub(55); }
      ] },
    { baris: 76, jalan: function (m) {
        if (m.v['USE.PEN']) m.lompat(77); else m.lompat(80);
      } },
    { baris: 77, jalan: function (m) { m.locate(24, 20); m.warna(4, 7); } },
    { baris: 78, jalan: function (m) {
        m.cetak('     Touch This Area To Re-Start       ');
      } },
    { baris: 79, jalan: function (m) { m.lompat(81); } },
    { baris: 80, jalan: function (m) {
        m.locate(24, 32); m.cetak('Enter 99 to Re-Start');
      } },
    { baris: 81, jalan: function (m) { m.locate(16, 50); m.warna(4, 7); } },
    { baris: 82, jalan: function (m) { m.v.MOVE = m.v.MOVE + 1; } },
    { baris: 83, jalan: function (m) {
        m.cetak(' Move #' + basic(m.v.MOVE));
      } },
    { baris: 84, jalan: function (m) {
        m.locate(17, 50);
        m.cetak(' Pegs Remaining =' + basic(m.v.PEGS));
      } },
    { baris: 85, jalan: function (m) { m.warna(6, 1); } },
    { baris: 86, jalan: function (m) {
        m.locate(22, 32); m.cetak(m.ulang(25, 32));
      } },
    { baris: 87, jalan: function (m) {
        m.locate(22, 32); m.cetak('Move from ');
      } },
    { baris: 88, jalan: function (m) {
        if (!m.v['USE.PEN']) m.lompat(92);
      } },
    { baris: 89, jalan: function (m) {
        m.cetak('(Touch Pen)'); m.v['PEN.MOVE'] = 0;
      } },
    /* 90 gelung tunggu yang HANYA bisa diakhiri jebakan pena. Tanpa pena, ia
       tidak pernah selesai — dan itulah kenapa baris 88 harus melompatinya. */
    { baris: 90, jalan: function (m) {
        if (m.v['PEN.MOVE'] === 0) m.lompat(90);
      } },
    { baris: 91, jalan: function (m) {
        m.v['MOVE.FROM'] = m.v['PEN.MOVE']; m.lompat(95);
      } },
    { baris: 92, bagian: [
        function (m) {
          m.masukan(function (s) {
            m.v['MOVE.FROM'] = Math.round(parseFloat(s) || 0);
          }, '? ');
        },
        function (m) { if (m.v['MOVE.FROM'] !== 99) m.lompat(95); }
      ] },
    { baris: 93, bagian: [
        function (m) { m.v.MOVE = 0; m.v.PEGS = 32; },
        function (m) { m.gosub(25); },
        function (m) { m.lompat(75); }
      ] },
    /* 94 satu-satunya penolakan: bunyi, lalu tanya lagi. Delapan tempat
       berbeda melompat ke sini. */
    { baris: 94, jalan: function (m) { m.lompat(86); } },
    { baris: 95, jalan: function (m) {
        if (m.v['MOVE.FROM'] < 1 || m.v['MOVE.FROM'] > 33) m.lompat(94);
      } },
    { baris: 96, jalan: function (m) {
        if (m.v['P()'][m.v['MOVE.FROM']] === m.v.EMPTY) m.lompat(94);
      } },
    { baris: 97, jalan: function (m) {
        m.warna(22, null);
        m.locate(m.v['L()'][m.v['MOVE.FROM']], m.v['T()'][m.v['MOVE.FROM']]);
        m.cetak(m.v.A);
        m.warna(6, null);
      } },
    { baris: 98, jalan: function (m) {
        m.locate(22, 32); m.cetak(m.ulang(25, 32));
      } },
    { baris: 99, jalan: function (m) {
        m.locate(22, 32); m.cetak('Move to ');
      } },
    { baris: 100, jalan: function (m) {
        if (!m.v['USE.PEN']) m.lompat(104);
      } },
    { baris: 101, jalan: function (m) {
        m.cetak('(Touch Pen)'); m.v['PEN.MOVE'] = 0;
      } },
    { baris: 102, jalan: function (m) {
        if (m.v['PEN.MOVE'] === 0) m.lompat(102);
      } },
    { baris: 103, jalan: function (m) {
        m.v['MOVE.TO'] = m.v['PEN.MOVE']; m.lompat(105);
      } },
    { baris: 104, bagian: [
        function (m) {
          m.masukan(function (s) {
            m.v['MOVE.TO'] = Math.round(parseFloat(s) || 0);
          }, '? ');
        },
        function (m) { if (m.v['MOVE.TO'] === 99) m.lompat(93); }
      ] },
    { baris: 105, jalan: function (m) {
        if (m.v['MOVE.TO'] >= 1 && m.v['MOVE.TO'] <= 33) m.lompat(108);
      } },
    { baris: 106, jalan: function (m) {
        m.warna(6, null);
        m.locate(m.v['L()'][m.v['MOVE.FROM']], m.v['T()'][m.v['MOVE.FROM']]);
        m.cetak(m.v.A);
      } },
    { baris: 107, jalan: function (m) { m.lompat(94); } },
    { baris: 108, jalan: function (m) {
        if (m.v['P()'][m.v['MOVE.TO']] === m.v.FULL) m.lompat(106);
      } },

    /* --- 109-125: SALIB DIUBAH JADI KISI ---------------------------------- */
    geser(109, 'MOVE.FROM', 'MF', function (n) { return n < 4; }, -6, 114),
    geser(110, 'MOVE.FROM', 'MF', function (n) { return n < 7; }, -2, 114),
    geser(111, 'MOVE.FROM', 'MF', function (n) { return n > 30; }, 6, 114),
    geser(112, 'MOVE.FROM', 'MF', function (n) { return n > 27; }, 2, 114),
    { baris: 113, jalan: function (m) { m.v.MF = m.v['MOVE.FROM']; } },
    geser(114, 'MOVE.TO', 'MT', function (n) { return n < 4; }, -6, 119),
    geser(115, 'MOVE.TO', 'MT', function (n) { return n < 7; }, -2, 119),
    geser(116, 'MOVE.TO', 'MT', function (n) { return n > 30; }, 6, 119),
    geser(117, 'MOVE.TO', 'MT', function (n) { return n > 27; }, 2, 119),
    { baris: 118, jalan: function (m) { m.v.MT = m.v['MOVE.TO']; } },
    /* 119 SELURUH ATURAN LOMPATAN. Dua = mendatar, empat belas = menegak
       (dua baris kisi selebar tujuh). Selain itu ditolak. */
    { baris: 119, jalan: function (m) {
        var d = Math.abs(m.v.MT - m.v.MF);
        if (d !== 2 && d !== 14) m.lompat(106);
      } },
    { baris: 120, jalan: function (m) { m.v.OP = (m.v.MF + m.v.MT) / 2; } },
    /* 121-124 pasak yang dilompati ada tepat di TENGAH keduanya di kisi;
       sekarang digeser BALIK ke penomoran salib. */
    balik(121, function (n) { return n < 2; }, 6, 125),
    balik(122, function (n) { return n < 7; }, 2, 125),
    balik(123, function (n) { return n > 32; }, -6, 125),
    balik(124, function (n) { return n > 27; }, -2, 0),
    { baris: 125, jalan: function (m) {
        if (m.v['P()'][m.v.OP] === m.v.EMPTY) m.lompat(106);
      } },

    /* --- 126-133: lakukan lompatannya ------------------------------------- */
    { baris: 126, jalan: function (m) {
        m.v['P()'][m.v['MOVE.FROM']] = m.v.EMPTY;
      } },
    { baris: 127, jalan: function (m) { m.v['P()'][m.v.OP] = m.v.EMPTY; } },
    { baris: 128, jalan: function (m) {
        m.v['P()'][m.v['MOVE.TO']] = m.v.FULL;
      } },
    { baris: 129, jalan: function (m) { m.v.PEGS = m.v.PEGS - 1; } },
    { baris: 130, jalan: function (m) {
        m.locate(m.v['L()'][m.v['MOVE.FROM']], m.v['T()'][m.v['MOVE.FROM']]);
        m.cetak(m.v.AB);
      } },
    { baris: 131, jalan: function (m) {
        m.locate(m.v['L()'][m.v.OP], m.v['T()'][m.v.OP]); m.cetak(m.v.AB);
      } },
    { baris: 132, jalan: function (m) {
        m.locate(m.v['L()'][m.v['MOVE.TO']], m.v['T()'][m.v['MOVE.TO']]);
        m.cetak(m.v.A);
      } },
    /* 133 satu-satunya syarat selesai: SATU pasak tersisa. Tidak ada
       pemeriksaan "sudah tidak ada langkah yang sah" di mana pun. */
    { baris: 133, jalan: function (m) { if (m.v.PEGS > 1) m.lompat(81); } },

    /* --- 134-142: menang -------------------------------------------------- */
    { baris: 134, jalan: function (m) {
        m.locate(22, 30); m.cetak(m.ulang(25, 32));
      } },
    { baris: 135, jalan: function (m) { m.locate(22, 26); m.warna(20, 7); } },
    { baris: 136, jalan: function (m) {
        m.cetak(' **** You DID it !!! **** ');
      } },
    { baris: 137, jalan: function (m) {
        if (m.v['P()'][17] === m.v.EMPTY) m.lompat(139);
      } },
    { baris: 138, jalan: function (m) {
        m.locate(23, 24); m.cetak(' **** A PERFECT Game !!! **** ');
      } },
    { baris: 139, jalan: function (m) { m.warna(6, 1); } },
    /* 140 `PLAY"MBT255L48N=Y;"` — `N=Y;` menyisipkan NILAI variabel Y ke
       dalam string makronya. Bahasa di dalam bahasa, sama seperti di
       DREAM.BAS dan GERMFOLK.BAS. */
    { baris: 140, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 3; m.v.X++) {
          for (m.v.Y = 20; m.v.Y <= 70; m.v.Y++) { /* PLAY: diam */ }
        }
      } },
    { baris: 141, jalan: function (m) { m.locate(23, 1); } },
    { baris: 142, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function nomor(n, isi) {
    return { baris: n, jalan: function (m) { m.v['A()'][n - 14] = isi; } };
  }
  function geser(n, dari, ke, uji, delta, lompat) {
    return { baris: n, jalan: function (m) {
      if (!uji(m.v[dari])) return;
      m.v[ke] = m.v[dari] + delta;
      m.lompat(lompat);
    } };
  }
  function balik(n, uji, delta, lompat) {
    return { baris: n, jalan: function (m) {
      if (!uji(m.v.OP)) return;
      m.v.OP = m.v.OP + delta;
      if (lompat) m.lompat(lompat);
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['HIQUE2'] = {
    nama: 'HIQUE2',
    judul: 'Hique (Hi-Q: salib yang diubah jadi kisi)',
    sumber: 'HIQUE2',
    berkas: 'run/HIQUE2.BAS',
    tabel: tabel,
    data: [
      1, 1, 1, 4, 4, 4, 7, 7, 7, 7, 7, 7, 7, 10, 10, 10, 10, 10, 10, 10,
      13, 13, 13, 13, 13, 13, 13, 16, 16, 16, 19, 19, 19,
      32, 38, 44, 32, 38, 44, 20, 26, 32, 38, 44, 50, 56, 20, 26, 32, 38, 44,
      50, 56, 20, 26, 32, 38, 44, 50, 56, 32, 38, 44, 32, 38, 44
    ],

    arsitektur: {
      judul: 'Alur HIQUE2.BAS',
      simpul: [
        { id: 'siap', baris: '8-31', jenis: 'mulai',
          teks: ['Bangun gambar pasak,', 'baca peta letak 33 lubang'] },
        { id: 'aturan', baris: '35-51',
          teks: ['Aturan permainan,', 'tunggu tombol atau pena'] },
        { id: 'gambar', baris: '54-62', jenis: 'subrutin',
          teks: ['Gambar salib:', 'pasak penuh atau lubang kosong'] },
        { id: 'dari', baris: '81-97', jenis: 'putusan',
          teks: ['Pasak mana yang', 'mau dilompatkan?'] },
        { id: 'ke', baris: '98-108', jenis: 'putusan',
          teks: ['Ke lubang mana?', 'harus kosong'] },
        { id: 'kisi', baris: '109-125',
          teks: ['Geser ke kisi 7x7,', 'uji jarak 2 atau 14'] },
        { id: 'lompat', baris: '126-132',
          teks: ['Asal kosong, yang dilompati', 'hilang, tujuan terisi'] },
        { id: 'tolak', baris: '94, 106', jenis: 'galat',
          teks: ['Bunyi, gambar ulang,', 'tanya lagi'] },
        { id: 'menang', baris: '133-142', jenis: 'keluar',
          teks: ['Satu pasak tersisa;', 'di tengah = sempurna'] },
        { id: 'pena', baris: '63-74', jenis: 'subrutin',
          teks: ['Pena cahaya:', 'tidak ada di penelusur'] }
      ],
      panah: [
        { dari: 'siap', ke: 'aturan' },
        { dari: 'aturan', ke: 'gambar' },
        { dari: 'gambar', ke: 'dari' },
        { dari: 'dari', ke: 'ke' },
        { dari: 'ke', ke: 'kisi' },
        { dari: 'kisi', ke: 'lompat', label: 'sah' },
        { dari: 'kisi', ke: 'tolak', label: 'tidak sah', jenis: 'galat' },
        { dari: 'tolak', ke: 'dari' },
        { dari: 'lompat', ke: 'dari', label: 'masih > 1 pasak' },
        { dari: 'lompat', ke: 'menang', label: 'tinggal satu' },
        { dari: 'aturan', ke: 'pena', label: 'kalau ada pena cahaya' }
      ]
    },

    pseudokode: [
      { baris: 11, tingkat: 0, teks: 'bangun gambar pasak dari <b>kode gerak kursor</b> &mdash; satu <code>PRINT</code> menggambar kotak 4&times;2' },
      { baris: 23, tingkat: 0, teks: '<code>FULL=-1 : EMPTY=NOT FULL</code> &mdash; benar dan salah sebagai nilai' },
      { baris: 31, tingkat: 0, teks: '<code>L2T(X)=L(X)^2-T(X)</code> &mdash; baris dan kolom jadi <b>satu angka</b>' },
      { baris: 92, tingkat: 0, teks: 'tanya lubang asal, lalu lubang tujuan (99 = mulai ulang)' },
      { baris: 109, tingkat: 0, teks: '<b>geser tiap nomor ke kisi 7&times;7</b>: &minus;6, &minus;2, 0, +2, +6' },
      { baris: 119, tingkat: 1, teks: '<code>ABS(MT-MF)</code> harus <b>2</b> (mendatar) atau <b>14</b> (menegak)' },
      { baris: 120, tingkat: 1, teks: 'pasak yang dilompati = <code>(MF+MT)/2</code>, lalu digeser <b>balik</b>' },
      { baris: 126, tingkat: 0, teks: 'asal kosong, yang dilompati hilang, tujuan terisi; <code>PEGS</code> turun' },
      { baris: 133, tingkat: 0, teks: 'selesai <b>hanya</b> kalau tinggal satu pasak &mdash; tidak ada uji "buntu"' }
    ],

    perintahAsli: 'run\\HIQUE2.bat',
    catatanAsli: 'Ketik nomor lubang asal lalu nomor lubang tujuan; 99 untuk ' +
      'mulai ulang. Di mesin ber-pena cahaya, seluruh permainan bisa ' +
      'dimainkan dengan menyentuh layar.',

    penyimpangan: [
      '<b>Pena cahaya tidak ada.</b> <code>PEN ON</code>, ' +
      '<code>ON PEN GOSUB</code>, dan <code>PEN(8)/PEN(9)</code> tidak ditiru; ' +
      '<code>USE.PEN</code> selalu berakhir nol, jadi yang berjalan selalu ' +
      'jalur papan tombol. Baris 63&ndash;74 tetap ada di tabel supaya ' +
      'cakupannya utuh, tapi <b>isinya kerangka kosong</b>: tanpa perangkat ' +
      'kerasnya, tidak ada yang bisa ditiru. Bacalah kodenya di panel kanan ' +
      '&mdash; itulah tempat gagasan <code>L^2-T</code> dipakai.',

      '<b><code>SOUND</code> dan <code>PLAY</code> diam.</b>',

      '<b><code>COLOR 20</code> dan <code>COLOR 22</code> memakai atribut ' +
      'KEDIP</b> (4+16 dan 6+16); konsol penelusur tidak berkedip. Pasak yang ' +
      'sedang dipilih (baris 97) seharusnya berkedip.',

      '<b><code>POKE &amp;H417,96</code> tidak ditiru</b> &mdash; alamat ' +
      'bendera papan tombol BIOS, 96 menyalakan Caps Lock dan Num Lock.'
    ],

    pelajaran: {
      ringkas: 'Papan salib tak beraturan diubah jadi kisi teratur dengan ' +
        'sembilan baris aritmetika, dan seluruh aturan lompatannya jadi muat ' +
        'di satu baris.',
      pelajari: [
        ['Mengubah bentuk yang sulit jadi bentuk yang mudah',
         'Papan Hi-Q berbentuk salib: barisnya selebar 3, 3, 7, 7, 7, 3, 3. ' +
         'Menguji ketetanggaan di bentuk seperti itu biasanya butuh tabel ' +
         '33&times;4. Program ini <b>menggeser</b> tiap nomor lubang ke ' +
         'tempatnya di kisi 7&times;7 yang teratur &mdash; lima baris ' +
         '<code>IF</code> &mdash; dan sesudah itu ketetanggaan cuma soal ' +
         'selisih: 2 mendatar, 14 menegak. <b>Masalahnya tidak dipecahkan; ' +
         'ia dipindahkan ke ruang tempat ia sudah terpecahkan.</b>'],
        ['Pasak yang dilompati ada di tengah, secara harfiah',
         'Begitu kedua lubang berada di kisi teratur, pasak yang dilompati ' +
         'ada tepat di <code>(MF+MT)/2</code>. Tidak perlu dicari, tidak perlu ' +
         'ditabelkan. Baris 121&ndash;124 tinggal menggesernya <b>balik</b> ke ' +
         'penomoran salib.'],
        ['Dua koordinat jadi satu angka',
         'Baris 31: <code>L2T(X)=L(X)^2-T(X)</code>. Baris dikuadratkan lalu ' +
         'dikurangi kolom &mdash; menghasilkan satu bilangan yang unik untuk ' +
         'tiap lubang. Dipakai pena cahaya di baris 71&ndash;73 supaya ' +
         'pencarian lubang yang disentuh cukup satu perbandingan, bukan dua. ' +
         'Sebuah <i>fungsi pemasangan</i>, ditulis tanpa menyebut namanya.'],
        ['Gambar dua dimensi dari satu string',
         'Baris 11: empat blok, empat kali kursor-kiri, kursor-bawah, empat ' +
         'blok, kursor-atas. Satu <code>PRINT A;</code> menggambar kotak ' +
         '4&times;2 <b>dan mengembalikan kursornya</b>, siap untuk lubang ' +
         'berikutnya. Bentuk yang sama dipakai BOWLING.BAS untuk rak pinnya.'],
        ['Benar dan salah sebagai nilai',
         '<code>FULL=-1:EMPTY=NOT FULL</code>. Karena perbandingan di BASIC ' +
         'menghasilkan &minus;1 dan 0, kedua tetapan itu bisa dipakai ' +
         'langsung: <code>IF P(X)=FULL</code>, dan juga <code>IF USE.PEN</code> ' +
         'tanpa perbandingan sama sekali.'],
        ['Nama variabel bertitik',
         '<code>MOVE.FROM</code>, <code>MOVE.TO</code>, <code>USE.PEN</code>, ' +
         '<code>PEN.MOVE</code>. GW-BASIC mengizinkan titik di nama variabel, ' +
         'dan penulisnya memakainya sebagai pemisah kata &mdash; empat puluh ' +
         'tahun sebelum <code>snake_case</code> jadi kebiasaan.']
      ],
      hindari: [
        ['Tidak ada uji buntu',
         'Baris 133 mengakhiri permainan <b>hanya</b> kalau tinggal satu ' +
         'pasak. Di Hi-Q, sebagian besar permainan berakhir <b>buntu</b> ' +
         '&mdash; masih ada lima atau enam pasak, dan tidak ada satu pun ' +
         'lompatan yang sah. Program ini akan terus bertanya "Move from", dan ' +
         'menolak setiap jawaban, tanpa pernah mengatakan bahwa permainannya ' +
         'sudah selesai. Pemain harus menyimpulkannya sendiri, lalu mengetik ' +
         '99.'],
        ['Penolakan tanpa alasan',
         'Delapan tempat berbeda melompat ke baris 94, yang cuma membunyikan ' +
         'nada dan bertanya lagi. Lubang di luar papan, lubang kosong, ' +
         'lompatan diagonal, jarak yang salah, tidak ada pasak yang ' +
         'dilompati &mdash; semuanya terdengar sama. <b>"HIQUE won\'t let you ' +
         'make a mistake" benar, tapi ia juga tidak akan memberi tahu ' +
         'mistake-nya apa.</b>'],
        ['Salah ketik di layar aturan',
         'Baris 37: <i>"Your task is to is to remove as many pegs"</i>. Dua ' +
         'kali "is to".'],
        ['Gelung tunggu yang bergantung pada perangkat keras',
         'Baris 90 dan 102: <code>IF PEN.MOVE=0 THEN 90</code>. Variabel itu ' +
         'hanya diubah oleh jebakan pena cahaya. Di mesin tanpa pena, ' +
         'gelungnya tidak akan pernah selesai &mdash; yang menyelamatkannya ' +
         'cuma baris 88 dan 100 yang melompatinya. Satu bendera salah, dan ' +
         'programnya menggantung tanpa pesan.']
      ]
    },

    penjelasan: [
      { judul: 'Salib yang diubah jadi kisi',
        isi: [
          'Papan Hi-Q berbentuk salib. Tiga puluh tiga lubang, dan barisnya ' +
          'selebar 3, 3, 7, 7, 7, 3, 3. Dinomori berurutan dari kiri atas:',
          '<code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp; 2&nbsp; 3<br>' +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4&nbsp; 5&nbsp; 6<br>' +
          '&nbsp;7&nbsp; 8&nbsp; 9 10 11 12 13<br>' +
          '14 15 16 17 18 19 20<br>' +
          '21 22 23 24 25 26 27<br>' +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28 29 30<br>' +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31 32 33</code>',
          'Pertanyaannya: apakah lubang 5 dan lubang 17 cukup dekat untuk ' +
          'lompatan? Di penomoran ini, selisihnya 12. Dan lubang 8 ke 22 ' +
          'selisihnya 14. Keduanya lompatan menegak yang sah, tapi angkanya ' +
          'berbeda &mdash; karena baris atasnya cuma selebar tiga.',
          'Cara biasa: buat tabel ketetanggaan. Tiga puluh tiga baris, empat ' +
          'kolom, dan setiap angkanya harus dimasukkan dengan benar.',
          'Cara program ini: <b>geser nomornya supaya papannya jadi teratur</b>.',
          '<code>109 IF MOVE.FROM&lt;4 THEN MF=MOVE.FROM-6</code><br>' +
          '<code>110 IF MOVE.FROM&lt;7 THEN MF=MOVE.FROM-2</code><br>' +
          '<code>111 IF MOVE.FROM&gt;30 THEN MF=MOVE.FROM+6</code><br>' +
          '<code>112 IF MOVE.FROM&gt;27 THEN MF=MOVE.FROM+2</code><br>' +
          '<code>113 MF=MOVE.FROM</code>',
          'Sesudah pergeseran itu, lubang 1 jadi &minus;5, lubang 5 jadi 3, ' +
          'lubang 17 tetap 17, lubang 32 jadi 38. Dan sekarang <b>setiap ' +
          'baris berjarak tepat tujuh</b>, seolah papannya persegi 7&times;7 ' +
          'dan lubang yang tidak ada cuma tidak dipakai.',
          'Maka seluruh aturan lompatan muat di satu baris:',
          '<code>119 IF ABS(MT-MF)&lt;&gt;2 AND ABS(MT-MF)&lt;&gt;14 THEN &lt;tolak&gt;</code>',
          'Dua berarti dua kolom (mendatar). Empat belas berarti dua baris ' +
          '(menegak). Diagonal otomatis tertolak karena selisihnya tidak ' +
          'pernah 2 maupun 14.',
          'Dan pasak yang dilompati? Tepat di tengah: <code>(MF+MT)/2</code>. ' +
          'Baris 121&ndash;124 menggesernya balik ke penomoran salib, dan ' +
          'selesai.',
          '<b>Masalahnya tidak dipecahkan &mdash; ia dipindahkan ke ruang ' +
          'tempat ia sudah terpecahkan.</b> Sembilan baris aritmetika ' +
          'menggantikan sebuah tabel yang harus diketik, diperiksa, dan ' +
          'dijaga.'
        ] },
      { judul: 'Permainan yang tidak tahu kapan ia berakhir',
        isi: [
          'Baris 133 satu-satunya jalan keluar:',
          '<code>133 IF PEGS&gt;1 THEN 81</code>',
          'Selama masih ada lebih dari satu pasak, kembali bertanya. Selesai ' +
          'kalau tinggal satu.',
          'Tapi di Hi-Q, <b>sebagian besar permainan tidak berakhir dengan ' +
          'satu pasak</b>. Yang jauh lebih sering: tersisa empat, lima, atau ' +
          'enam pasak yang berjauhan, dan tidak ada satu pun lompatan yang ' +
          'sah.',
          'Program ini tidak tahu keadaan itu ada. Ia akan terus bertanya ' +
          '"Move from", menolak setiap jawaban dengan bunyi yang sama, dan ' +
          'menunggu selamanya.',
          'Yang menarik: <b>uji buntunya tidak sulit ditulis</b>. Program ' +
          'sudah punya seluruh bahannya &mdash; untuk tiap pasak, coba empat ' +
          'arah, pakai baris 119 yang sudah ada. Dua gelung bersarang, sekitar ' +
          'delapan baris.',
          'Yang membuatnya tidak ditulis mungkin sederhana: penulisnya tahu ' +
          'kapan permainannya buntu, karena ia bermain sambil melihat papan. ' +
          'Pemakainya juga. Kebutuhan itu baru terasa kalau ada yang bertanya ' +
          '"kenapa programnya tidak mengatakan apa-apa?".',
          'Dan itu jenis lubang yang paling sering ada di program permainan: ' +
          'bukan aturan yang salah, melainkan <b>keadaan akhir yang tidak ' +
          'terpikirkan</b>.'
        ] }
    ]
  };
})(window);
