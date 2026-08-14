/* ===========================================================================
   DROIDS.js — porting minimalis DROIDS.BAS sebagai tabel baris.

   Seratus delapan puluh tiga baris, International PC Owners (Pittsburgh),
   dengan perbaikan galat oleh John Beck (Melbourne PC-Group) — dua kelompok
   pengguna di dua benua, di satu berkas.

   Empat droid di ladang bijih 15x10. Pemain menyebut huruf droid dan arah;
   droid meluncur LURUS sampai kehabisan bijih, dan tiap petak yang dilewatinya
   jadi satu angka.

   DAN LAGI-LAGI: LAYAR ADALAH PAPANNYA.

       2210 CT = SCREEN(IY(DN)+DY, IX(DN)+DX)

   Tidak ada larik ladang. Bijih (kode 254) digambar sekali di baris 1230,
   dan sesudah itu SATU-SATUNYA catatan tentang apa yang masih ada adalah apa
   yang tertulis di layar. Petak yang sudah dimakan ditandai `CHR$(0)` —
   bukan spasi — supaya bisa dibedakan dari luar papan (spasi, kode 32).

   Program keempat di koleksi ini yang memakai gagasan itu, sesudah
   SERPENT.BAS, BOWLING.BAS, dan METEOR.BAS.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom.
   - `PLAY` diam.
   - Gelung tunda di baris 3010 habis seketika.
   - `RANDOMIZE` memasang benih tetap.
   - `POKE 23,64` di segmen 64 (Caps Lock menyala) tidak ditiru; penelusur
     menerima huruf kecil maupun besar untuk arah, tapi TIDAK untuk huruf
     droid — lihat catatan.
   - `LOAD"MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var PETA = { '░': 176, '┌': 218, '─': 196, '┐': 191, '│': 179,
               '└': 192, '┘': 217, '▄': 220, '█': 219 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  var ORE = 254;
  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function judul(n, isi) {
    return { baris: n, jalan: function (m) {
      m.cetak(keBita(isi)); m.barisBaru();
    } };
  }

  var tabel = [

    { baris: 10, jalan: function (m) { m.cls(); } },
    judul(20, '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░'),
    judul(30, '░┌───────────────────────────────────┐░'),
    judul(40, '░│                                   │░'),
    judul(50, '░│            2043-A.BAS             │░'),
    judul(60, '░│              DROIDS               │░'),
    judul(90, '░│ BROUGHT TO YOU BY THE MEMBERS OF  │░'),
    judul(100, '░│      ▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄      │░'),
    judul(110, '░│        █   █   █ █     █   █      │░'),
    judul(120, '░│        █   █▄▄▄█ █     █   █      │░'),
    judul(130, '░│        █   █     █     █   █      │░'),
    judul(140, '░│      ▄▄█▄▄ █     █▄▄▄▄ █▄▄▄█      │░'),
    judul(150, '░│                                   │░'),
    judul(160, '░│      International PC Owners      │░'),
    judul(170, '░│                                   │░'),
    judul(180, '░│P.O. Box 10426, Pittsburgh PA 15234│░'),
    judul(190, '░│                                   │░'),
    judul(193, '░│   Error correction by JOHN BECK   │░'),
    judul(196, '░│        Melbourne PC-Group         │░'),
    judul(200, '░└───────────────────────────────────┘░'),
    judul(210, '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░'),
    { baris: 220, jalan: function (m) { m.barisBaru(); } },
    cet(230, '       PRESS ANY KEY TO CONTINUE'),
    { baris: 240, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(240);
      } },
    { baris: 250, jalan: function (m) { m.cls(); } },

    rem(1000),
    /* 1010-1030 pintu masuk kedua yang tidak dipakai siapa pun — bentuk yang
       sama persis dengan MORTGAGE.BAS baris 980-1000. */
    { baris: 1010, jalan: function (m) { m.v['SAMPLE$'] = 'NO'; } },
    { baris: 1020, jalan: function (m) { m.lompat(1040); } },
    { baris: 1030, jalan: function (m) { m.v['SAMPLE$'] = 'YES'; } },
    { baris: 1040, jalan: function (m) {
        m.v['BL$'] = '                                       ';
      } },
    /* 1050 `DEF SEG=64:POKE 23,64` — bendera papan tombol BIOS di 0040:0017,
       nilai 64 menyalakan Caps Lock. Perlu, karena baris 2060 membandingkan
       huruf droid dengan `CHR$(65)` sampai `CHR$(68)` — huruf BESAR saja. */
    { baris: 1050, jalan: function () { } },
    { baris: 1060, jalan: function (m) { m.v.ORE = ORE; } },
    { baris: 1070, jalan: function (m) {
        m.dim('PL$()', 4); m.dim('CH()', 4);
        /* IX(), IY(), SC() tidak pernah di-DIM: BASIC melarik-otomatiskannya
           sampai 10. */
        m.dim('IX()', 10); m.dim('IY()', 10); m.dim('SC()', 10);
      } },
    { baris: 1080, jalan: function (m) {
        var C = m.v['CH()'];
        C[1] = 65; C[2] = 66; C[3] = 67; C[4] = 68;
      } },
    { baris: 1090, bagian: [
        function (m) { m.kursor(false); },
        function (m) { m.gosub(1350); }
      ] },
    { baris: 1100, jalan: function (m) { m.gosub(1700); } },
    { baris: 1110, jalan: function (m) { m.gosub(1850); } },
    { baris: 1120, jalan: function (m) { m.v.NP = 1; m.v.NP1 = 0; } },
    /* 1130-1170 GELUNG UTAMA: periksa akhir, ambil langkah, jalankan, giliran
       berikutnya. Empat baris. */
    { baris: 1130, jalan: function (m) { m.gosub(2290); } },
    { baris: 1140, jalan: function (m) { m.gosub(2030); } },
    { baris: 1150, jalan: function (m) { m.gosub(2200); } },
    { baris: 1160, jalan: function (m) {
        m.v.NP1 = (m.v.NP1 + 1) % m.v.NPLAY;
        m.v.NP = m.v.NP1 + 1;
      } },
    { baris: 1170, jalan: function (m) { m.lompat(1130); } },

    /* --- 1180-1240: ladang bijih ------------------------------------------ */
    rem(1180),
    { baris: 1190, jalan: function (m) { m.cls(); m.warna(14, 0); } },
    { baris: 1200, jalan: function (m) { m.v['X$'] = m.chr(m.v.ORE); } },
    { baris: 1210, jalan: function (m) { m.v['X15$'] = m.v['X$']; } },
    { baris: 1220, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 14; m.v.I++) m.v['X15$'] += m.v['X$'];
      } },
    { baris: 1230, jalan: function (m) {
        for (m.v.J = 3; m.v.J <= 12; m.v.J++) {
          m.locate(m.v.J, 5); m.cetak(m.v['X15$']); m.barisBaru();
        }
      } },
    { baris: 1240, jalan: function (m) { m.kembali(); } },

    /* --- 1250-1340: mawar angin ------------------------------------------- */
    rem(1250),
    { baris: 1260, jalan: function (m) { m.v.YC = 8; m.v.XC = 30; } },
    { baris: 1270, jalan: function (m) {
        m.locate(m.v.YC, m.v.XC - 3);
        m.cetak('W' + m.chr(196) + m.chr(196) + m.chr(197) +
                m.chr(196) + m.chr(196) + 'E');
        m.barisBaru();
      } },
    { baris: 1280, jalan: function (m) {
        m.locate(m.v.YC - 3, m.v.XC); m.cetak('N'); m.barisBaru();
      } },
    { baris: 1290, jalan: function (m) {
        m.locate(m.v.YC - 2, m.v.XC - 3);
        m.cetak('NW ' + m.chr(179) + ' NE'); m.barisBaru();
      } },
    { baris: 1300, jalan: function (m) {
        m.locate(m.v.YC + 2, m.v.XC - 3);
        m.cetak('SW ' + m.chr(179) + ' SE'); m.barisBaru();
      } },
    { baris: 1310, jalan: function (m) {
        m.locate(m.v.YC - 1, m.v.XC - 1);
        m.cetak('\\' + m.chr(179) + '/'); m.barisBaru();
      } },
    { baris: 1320, jalan: function (m) {
        m.locate(m.v.YC + 1, m.v.XC - 1);
        m.cetak('/' + m.chr(179) + '\\'); m.barisBaru();
      } },
    { baris: 1330, jalan: function (m) {
        m.locate(m.v.YC + 3, m.v.XC); m.cetak('S'); m.barisBaru();
      } },
    { baris: 1340, jalan: function (m) { m.kembali(); } },

    /* --- 1350-1690: petunjuk ---------------------------------------------- */
    rem(1350),
    { baris: 1360, jalan: function (m) { m.warna(7, 0); m.cls(); } },
    { baris: 1370, jalan: function (m) {
        m.locate(5, 12); m.cetak('WELCOME TO DROIDS'); m.barisBaru();
      } },
    { baris: 1380, jalan: function (m) {
        m.barisBaru();
        m.cetak('   DO YOU WANT INSTRUCTIONS? (Y OR N)'); m.barisBaru();
      } },
    { baris: 1390, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(1390);
      } },
    { baris: 1400, jalan: function (m) {
        if (m.v['RESP$'] === 'N' || m.v['RESP$'] === 'n') m.kembali();
      } },
    { baris: 1410, jalan: function (m) { m.cls(); } },
    { baris: 1420, jalan: function (m) {
        m.barisBaru();
        m.cetak('DROIDS ARE USED TO HUNT FOR MINERALS'); m.barisBaru();
      } },
    cet(1430, 'ON THE PLANET MERCURY.  THE HUMANS ON'),
    cet(1440, 'MERCURY PLAY THIS GAME WITH FOUR DROIDS'),
    cet(1450, 'ON A FIELD WHICH CONTAINS VALUABLE ORE!'),
    { baris: 1460, jalan: function (m) {
        m.barisBaru();
        m.cetak('THE VALUABLE ORE LOOKS LIKE THIS: ');
        m.warna(14, null); m.cetak(m.chr(m.v.ORE)); m.barisBaru();
        m.warna(7, null);
      } },
    { baris: 1470, jalan: function (m) {
        m.barisBaru();
        m.cetak('DO YOU WANT TO SEE THE GAME BOARD (Y/N)?');
      } },
    { baris: 1480, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(1480);
      } },
    { baris: 1490, jalan: function (m) {
        if (m.v['RESP$'] === 'Y' || m.v['RESP$'] === 'y') m.gosub(1180);
      } },
    { baris: 1500, jalan: function (m) {
        var C = m.v['CH()'];
        m.warna(7, null); m.barisBaru();
        m.cetak('THE DROIDS ARE  NAMED ' + m.chr(C[1]) + ', ' + m.chr(C[2]) +
                ', ' + m.chr(C[3]) + ' AND ' + m.chr(C[4]) + '.');
        m.barisBaru();
      } },
    cet(1510, 'GOING IN TURN, THE PLAYERS (UP TO 4)'),
    cet(1520, 'MOVE ANY DROID WHICH CAN COLLECT ORE.'),
    { baris: 1530, jalan: function (m) {
        m.cetak('YOU GET ONE POINT FOR EACH ');
        m.warna(14, null); m.cetak(m.chr(m.v.ORE));
        m.warna(7, null); m.cetak(' (PIECE'); m.barisBaru();
      } },
    cet(1540, 'OF ORE) AND HIGH SCORE WINS.'),
    cet(1550, 'DROIDS GO NORTH, SOUTH, EAST, WEST, OR'),
    cet(1560, 'DIAGONALLY, BUT ONLY IN A STRAIGHT LINE'),
    cet(1570, 'AND ONLY ONTO SQUARES WITH ORE.'),
    { baris: 1580, jalan: function (m) {
        m.barisBaru();
        m.cetak('ANY PLAYER MAY MOVE ANY DROID.'); m.barisBaru();
      } },
    { baris: 1590, jalan: function (m) {
        m.barisBaru();
        m.cetak('PRESS ANY KEY TO CONTINUE.'); m.barisBaru();
      } },
    { baris: 1600, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(1600);
      } },
    { baris: 1610, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1250); }
      ] },
    { baris: 1620, jalan: function (m) {
        m.barisBaru(); m.barisBaru();
        m.cetak('TO MOVE A DROID TYPE ITS SYMBOL AND'); m.barisBaru();
      } },
    cet(1630, 'DIRECTION TO GO (N,NE,E,SE,S,SW,W,NW).'),
    { baris: 1640, jalan: function (m) {
        m.barisBaru();
        m.cetak('THE DROID WILL GO THAT WAY UNTIL IT'); m.barisBaru();
      } },
    cet(1650, 'RUNS OUT OF ORE. '),
    { baris: 1660, jalan: function (m) {
        m.barisBaru();
        m.cetak('YOU GET ONE POINT FOR EACH ');
        m.warna(14, null); m.cetak(m.chr(m.v.ORE));
        m.cetak('.'); m.barisBaru(); m.warna(7, null);
      } },
    { baris: 1670, jalan: function (m) {
        m.barisBaru();
        m.cetak('PRESS ANY KEY TO CONTINUE.'); m.barisBaru();
      } },
    { baris: 1680, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(1680);
      } },
    { baris: 1690, jalan: function (m) { m.kembali(); } },

    /* --- 1700-1840: nama pemain ------------------------------------------- */
    rem(1700),
    { baris: 1710, jalan: function (m) { m.cls(); } },
    cet(1720, 'HOW MANY PLAYERS? (1 TO 4)'),
    { baris: 1730, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(1730);
      } },
    { baris: 1740, jalan: function (m) {
        if (m.v['RESP$'] < '1' || m.v['RESP$'] > '4') {
          m.cetak('PLEASE TYPE 1,2,3, OR 4'); m.barisBaru();
          m.lompat(1730);
        }
      } },
    { baris: 1750, jalan: function (m) {
        m.v.NPLAY = parseInt(m.v['RESP$'], 10);
      } },
    { baris: 1760, jalan: function (m) {
        m.cetak(basic(m.v.NPLAY) + 'PLAYERS, RIGHT? (Y OR N)'); m.barisBaru();
      } },
    { baris: 1770, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(1770);
      } },
    { baris: 1780, jalan: function (m) {
        if (m.v['RESP$'] === 'N' || m.v['RESP$'] === 'n') m.lompat(1720);
      } },
    cet(1790, 'NOW, ENTER THE NAMES OF THE PLAYERS.'),
    { baris: 1800, jalan: function (m) { m.untuk('I', 1, m.v.NPLAY, 1, 1840); } },
    { baris: 1810, bagian: [
        function (m) {
          m.cetak('TYPE THE NAME FOR PLAYER ' + basic(m.v.I) +
                  ' AND PRESS ENTER KEY.');
          m.barisBaru();
        },
        function (m) {
          m.masukan(function (s) { m.v['PL$()'][m.v.I] = s; }, '');
        }
      ] },
    { baris: 1820, jalan: function (m) {
        m.cetak('WELCOME ' + m.v['PL$()'][m.v.I] + '!'); m.barisBaru();
      } },
    { baris: 1830, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1840, jalan: function (m) { m.kembali(); } },

    /* --- 1850-2020: siapkan lapangan -------------------------------------- */
    rem(1850),
    { baris: 1860, jalan: function (m) { m.gosub(1180); } },
    { baris: 1870, jalan: function (m) { m.gosub(1250); } },
    { baris: 1880, jalan: function (m) { m.warna(1, null); } },
    /* 1890 benih dari DETIK lalu MENIT, disambung sebagai TEKS baru diubah
       jadi angka: "SSMM". Cara membangun benih empat digit dari dua medan. */
    { baris: 1890, jalan: function (m) { m.semaiCampur(37); } },
    { baris: 1900, jalan: function (m) { m.untuk('J', 1, 4, 1, 1960); } },
    { baris: 1910, jalan: function (m) {
        m.v['IX()'][m.v.J] = Math.trunc(15 * m.acak()) + 5;
      } },
    { baris: 1920, jalan: function (m) {
        m.v['IY()'][m.v.J] = Math.trunc(10 * m.acak()) + 3;
      } },
    /* 1930 droid tidak boleh menimpa droid lain: petaknya harus masih berisi
       bijih. Pengambilan ulang, lewat layar. */
    { baris: 1930, jalan: function (m) {
        m.v.CHT = m.layarAksara(m.v['IY()'][m.v.J], m.v['IX()'][m.v.J]);
        if (m.v.CHT !== m.v.ORE) m.lompat(1910);
      } },
    { baris: 1940, jalan: function (m) {
        m.locate(m.v['IY()'][m.v.J], m.v['IX()'][m.v.J]);
        m.cetak(m.chr(m.v['CH()'][m.v.J])); m.barisBaru();
      } },
    { baris: 1950, jalan: function (m) { m.lanjutkan('J'); } },
    { baris: 1960, jalan: function (m) { m.warna(7, null); m.locate(14, 5); } },
    cet(1970, "SCORE     PLAYER'S NAME"),
    { baris: 1980, jalan: function (m) { m.untuk('J', 1, m.v.NPLAY, 1, 2020); } },
    { baris: 1990, jalan: function (m) { m.v['SC()'][m.v.J] = 0; } },
    { baris: 2000, jalan: function (m) {
        m.locate(14 + m.v.J, 5);
        m.cetak(basic(m.v['SC()'][m.v.J])); m.tab(19);
        m.cetak(m.v['PL$()'][m.v.J]); m.barisBaru();
      } },
    { baris: 2010, jalan: function (m) { m.lanjutkan('J'); } },
    { baris: 2020, jalan: function (m) { m.kembali(); } },

    /* --- 2030-2190: ambil langkah ----------------------------------------- */
    rem(2030),
    { baris: 2040, jalan: function (m) {
        m.locate(20, 1);
        for (m.v.I = 1; m.v.I <= 3; m.v.I++) {
          m.cetak(m.v['BL$']); m.barisBaru();
        }
      } },
    { baris: 2050, bagian: [
        function (m) {
          m.locate(20, 1);
          m.cetak(m.v['PL$()'][m.v.NP] + ", TYPE A DROID'S SYMBOL ");
          m.barisBaru();
        },
        function (m) { m.masukan('DJ$', 'AND PRESS ENTER '); }
      ] },
    /* 2060 huruf droid dibandingkan dengan CHR$(65..68) — HURUF BESAR saja.
       Itu sebabnya baris 1050 menyalakan Caps Lock. Tanpa itu, mengetik "a"
       tidak dikenali dan pertanyaannya diulang tanpa penjelasan. */
    { baris: 2060, jalan: function (m) {
        var C = m.v['CH()'], d = m.v['DJ$'];
        if (d === m.chr(C[1]) || d === m.chr(C[2]) ||
            d === m.chr(C[3]) || d === m.chr(C[4])) m.lompat(2070);
        else m.lompat(2040);
      } },
    { baris: 2070, bagian: [
        function (m) { m.locate(22, 1); },
        function (m) { m.masukan('DIR$', 'TYPE A DIRECTION AND PRESS ENTER '); }
      ] },
    arah(2080, 'N', -1, 0), arah(2090, 'NE', -1, 1),
    arah(2100, 'E', 0, 1), arah(2110, 'SE', 1, 1),
    arah(2120, 'S', 1, 0), arah(2130, 'SW', 1, -1),
    arah(2140, 'W', 0, -1), arah(2150, 'NW', -1, -1),
    { baris: 2160, jalan: function (m) { m.lompat(2070); } },
    { baris: 2170, jalan: function (m) {
        for (m.v.J = 1; m.v.J <= 4; m.v.J++) {
          if (m.chr(m.v['CH()'][m.v.J]) === m.v['DJ$']) m.v.DN = m.v.J;
        }
      } },
    { baris: 2180, jalan: function () { } },
    { baris: 2190, jalan: function (m) { m.kembali(); } },

    /* --- 2200-2280: droid meluncur --------------------------------------- */
    rem(2200),
    { baris: 2205, jalan: function (m) { m.v.Z = 0; } },
    { baris: 2210, jalan: function (m) {
        m.v.Z = m.v.Z + 1;
        m.v.CT = m.layarAksara(m.v['IY()'][m.v.DN] + m.v.DY,
                               m.v['IX()'][m.v.DN] + m.v.DX);
      } },
    /* 2215 CETAKAN PENGAWAKUTU YANG TERTINGGAL. Kode aksara yang barusan
       dibaca dicetak di baris 1 kolom 20, tiap langkah, selamanya. */
    { baris: 2215, jalan: function (m) {
        m.locate(1, 20); m.cetak(basic(m.v.CT));
      } },
    { baris: 2220, jalan: function (m) { if (m.v.CT === m.v.ORE) m.lompat(2230); } },
    /* 2221-2226 kalau langkah PERTAMA sudah bukan bijih, itu langkah tidak
       sah. Enam baris untuk enam kemungkinan; baris 2229 mengulang keenamnya
       dalam satu baris. */
    tolak(2221, 0), tolak(2222, 32), tolak(2223, 65),
    tolak(2224, 66), tolak(2225, 67), tolak(2226, 68),
    { baris: 2227, jalan: function (m) {
        if (m.v.Z > 1 && m.v.CT === 0) m.kembali();
      } },
    { baris: 2229, jalan: function (m) {
        var c = m.v.CT;
        if (c === 0 || c === 32 || c === 65 || c === 66 || c === 67 || c === 68) {
          m.kembali();
        }
      } },
    /* 2230 jejak yang ditinggalkan droid adalah `CHR$(0)`, bukan spasi —
       supaya bisa dibedakan dari luar papan (spasi, kode 32). */
    { baris: 2230, jalan: function (m) {
        m.locate(m.v['IY()'][m.v.DN], m.v['IX()'][m.v.DN]);
        m.cetak(m.chr(0)); m.barisBaru();
      } },
    { baris: 2240, jalan: function (m) {
        m.v['IY()'][m.v.DN] += m.v.DY;
        m.v['IX()'][m.v.DN] += m.v.DX;
      } },
    { baris: 2250, jalan: function (m) {
        m.v['SC()'][m.v.NP] = m.v['SC()'][m.v.NP] + 1;
        m.locate(14 + m.v.NP, 5);
        m.cetak(basic(m.v['SC()'][m.v.NP]));
      } },
    { baris: 2260, jalan: function (m) {
        m.locate(m.v['IY()'][m.v.DN], m.v['IX()'][m.v.DN]);
        m.warna(1, null); m.cetak(m.chr(m.v['CH()'][m.v.DN]));
        m.barisBaru(); m.warna(7, null);
      } },
    { baris: 2270, jalan: function () { /* PLAY: diam */ } },
    { baris: 2280, jalan: function (m) { m.lompat(2210); } },

    /* --- 2290-2430: periksa akhir permainan ------------------------------- */
    rem(2290),
    { baris: 2300, jalan: function (m) { m.v['STP$'] = 'YES'; } },
    { baris: 2310, jalan: function (m) { m.untuk('J', 1, 4, 1, 2370); } },
    { baris: 2320, jalan: function (m) { m.untuk('JX', -1, 1, 1, 2360); } },
    { baris: 2330, jalan: function (m) { m.untuk('JY', -1, 1, 1, 2360); } },
    /* 2340 delapan tetangga tiap droid diperiksa (termasuk petaknya sendiri).
       Kalau ada satu bijih saja di mana pun, permainan belum selesai. */
    { baris: 2340, jalan: function (m) {
        m.v.CT = m.layarAksara(m.v['IY()'][m.v.J] + m.v.JY,
                               m.v['IX()'][m.v.J] + m.v.JX);
      } },
    { baris: 2350, jalan: function (m) {
        if (m.v.CT === m.v.ORE) m.v['STP$'] = 'NO';
      } },
    { baris: 2360, bagian: [
        function (m) { m.lanjutkan('JY'); },
        function (m) { m.lanjutkan('JX'); },
        function (m) { m.lanjutkan('J'); }
      ] },
    { baris: 2370, jalan: function (m) {
        if (m.v['STP$'] === 'NO') m.kembali();
      } },
    { baris: 2380, jalan: function (m) {
        m.locate(17 + 6, 5); m.cetak('GAME IS OVER'); m.barisBaru();
      } },
    cet(2390, 'PLAY AGAIN? (Y OR N)'),
    { baris: 2400, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(2400);
      } },
    { baris: 2410, jalan: function (m) {
        if (m.v['RESP$'] === 'Y' || m.v['RESP$'] === 'y') m.lompat(1090);
      } },
    { baris: 2420, jalan: function (m) {
        if (m.v['SAMPLE$'] === 'YES') m.rantai('SAMPLES', 1000);
        else m.jalankan('MENU');
      } },
    { baris: 2430, jalan: function (m) { m.lompat(1030); } },

    /* --- 3000-3030: langkah tidak sah ------------------------------------- */
    { baris: 3000, jalan: function (m) {
        m.locate(22, 1);
        m.cetak('            ILLEGAL MOVE             '); m.barisBaru();
      } },
    { baris: 3010, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 2000; m.v.I++) { /* jeda */ }
      } },
    { baris: 3020, jalan: function (m) {
        m.locate(22, 1); m.cetak(m.v['BL$']); m.barisBaru();
      } },
    /* 3030 `GOTO 1130` — MELOMPAT KELUAR dari GOSUB 2200 tanpa RETURN. Tiap
       langkah tidak sah meninggalkan satu alamat pulang di tumpukan. */
    { baris: 3030, jalan: function (m) { m.lompat(1130); } }
  ];

  function arah(n, nama, dy, dx) {
    return { baris: n, jalan: function (m) {
      if (m.v['DIR$'] === nama) {
        m.v.DY = dy; m.v.DX = dx; m.lompat(2170);
      }
    } };
  }
  function tolak(n, kode) {
    return { baris: n, jalan: function (m) {
      if (m.v.Z === 1 && m.v.CT === kode) m.lompat(3000);
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['DROIDS'] = {
    nama: 'DROIDS',
    judul: 'Droids (ladang bijih yang disimpan di layar)',
    sumber: 'DROIDS',
    berkas: 'run/DROIDS.BAS',
    tabel: tabel,
    benih: 41,

    arsitektur: {
      judul: 'Alur DROIDS.BAS',
      simpul: [
        { id: 'judul', baris: '10-250', jenis: 'mulai',
          teks: ['Layar judul IPCO,', 'dengan perbaikan John Beck'] },
        { id: 'siap', baris: '1090-1120',
          teks: ['Petunjuk, jumlah pemain,', 'nama, taruh empat droid'] },
        { id: 'ladang', baris: '1180-1240', jenis: 'subrutin',
          teks: ['Isi 15x10 petak', 'dengan bijih - di LAYAR'] },
        { id: 'akhir', baris: '2290-2430', jenis: 'putusan',
          teks: ['Masih ada bijih di sekitar', 'salah satu droid?'] },
        { id: 'langkah', baris: '2030-2190', jenis: 'subrutin',
          teks: ['Huruf droid dan arah;', 'delapan IF jadi DX,DY'] },
        { id: 'luncur', baris: '2200-2280',
          teks: ['Droid meluncur lurus,', 'BACA LAYAR tiap petak'] },
        { id: 'tolak', baris: '3000-3030', jenis: 'galat',
          teks: ['Langkah pertama bukan bijih:', 'ILLEGAL MOVE, lalu GOTO'] },
        { id: 'usai', baris: '2380-2420', jenis: 'keluar',
          teks: ['GAME IS OVER;', 'main lagi atau menu'] }
      ],
      panah: [
        { dari: 'judul', ke: 'siap' },
        { dari: 'siap', ke: 'ladang' },
        { dari: 'ladang', ke: 'akhir' },
        { dari: 'akhir', ke: 'langkah', label: 'masih ada bijih' },
        { dari: 'langkah', ke: 'luncur' },
        { dari: 'luncur', ke: 'tolak', label: 'petak pertama kosong', jenis: 'galat' },
        { dari: 'tolak', ke: 'akhir', label: 'GOTO 1130' },
        { dari: 'luncur', ke: 'akhir', label: 'giliran berikutnya' },
        { dari: 'akhir', ke: 'usai', label: 'bijih habis' }
      ]
    },

    pseudokode: [
      { baris: 1230, tingkat: 0, teks: 'isi 15&times;10 petak dengan bijih &mdash; <b>langsung ke layar</b>, bukan larik' },
      { baris: 1930, tingkat: 0, teks: 'taruh empat droid di petak yang <b>masih berisi bijih</b> (baca layar)' },
      { baris: 2050, tingkat: 0, teks: 'tanya huruf droid, lalu arah; delapan <code>IF</code> jadi <code>DX,DY</code>' },
      { baris: 2210, tingkat: 0, teks: '<b>ULANG:</b> <code>CT = SCREEN(y+DY, x+DX)</code> &mdash; apa di depan droid?' },
      { baris: 2220, tingkat: 1, teks: 'bijih &rarr; maju, skor +1, dan tinggalkan <code>CHR$(0)</code>' },
      { baris: 2221, tingkat: 1, teks: 'langkah <b>pertama</b> bukan bijih &rarr; ILLEGAL MOVE' },
      { baris: 2227, tingkat: 1, teks: 'langkah <b>berikutnya</b> bukan bijih &rarr; berhenti, giliran selesai' },
      { baris: 2340, tingkat: 0, teks: 'periksa delapan tetangga tiap droid: masih ada bijih di mana pun?' },
      { baris: 2215, tingkat: 0, teks: '&hellip;dan <b>cetakan pengawakutu yang tertinggal</b> di baris 1 kolom 20' }
    ],

    perintahAsli: 'run\\DROIDS.bat',
    catatanAsli: 'Ketik huruf droid (A sampai D, HURUF BESAR) lalu arah ' +
      '(N, NE, E, SE, S, SW, W, NW). Droid meluncur sampai kehabisan bijih.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom.',
      '<b><code>PLAY</code> diam</b>, jadi bunyi tiap petak bijih yang diambil ' +
      'tidak terdengar.',
      '<b>Gelung tunda habis seketika</b> (baris 3010).',
      '<b><code>RANDOMIZE</code> memasang benih tetap.</b>',
      '<b><code>POKE 23,64</code> di segmen 64 tidak ditiru</b> &mdash; ' +
      'alamat 0040:0017, bendera papan tombol BIOS, nilai 64 menyalakan Caps ' +
      'Lock. Akibatnya di penelusur huruf droid <b>harus diketik besar</b>, ' +
      'sedangkan di mesin aslinya Caps Lock mengurusnya.',
      '<b><code>LOAD"MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Ladang bijih yang seluruhnya disimpan di layar, dan droid ' +
        'yang meluncur lurus sampai layar bilang berhenti.',
      pelajari: [
        ['Layar sebagai ladang',
         'Bijih digambar sekali di baris 1230 &mdash; sepuluh baris berisi ' +
         'lima belas <code>CHR$(254)</code> &mdash; dan sesudah itu ' +
         '<b>satu-satunya catatan tentang apa yang masih ada adalah layar ' +
         'itu sendiri</b>. Droid membaca <code>SCREEN(y,x)</code> untuk tahu ' +
         'apakah di depannya masih ada bijih, dan penempatan awal droid pun ' +
         'diperiksa dengan cara yang sama. Program keempat di koleksi ini yang ' +
         'memakai gagasan itu, sesudah SERPENT, BOWLING, dan METEOR.'],
        ['Jejak yang bukan spasi',
         'Baris 2230 menghapus petak yang sudah diambil dengan ' +
         '<code>CHR$(0)</code>, bukan spasi. Alasannya ada di baris 2222: ' +
         'spasi (kode 32) berarti <b>di luar papan</b>. Dua jenis "kosong" ' +
         'yang harus dibedakan, dan yang membedakannya cuma kode aksaranya.'],
        ['Delapan arah dari delapan baris',
         'Baris 2080&ndash;2150 mengubah nama arah jadi sepasang penambahan: ' +
         '<code>"NE"</code> jadi <code>DY=-1:DX=1</code>. Sesudah itu seluruh ' +
         'peluncuran droid cuma <code>y+DY, x+DX</code> berulang &mdash; satu ' +
         'gelung untuk delapan arah.'],
        ['Berhenti sendiri, bukan dihitung',
         'Droid tidak tahu berapa jauh ia akan bergerak. Ia terus maju sampai ' +
         '<code>SCREEN</code> mengembalikan sesuatu yang bukan bijih. ' +
         '<b>Panjang langkah adalah akibat, bukan masukan</b> &mdash; dan itu ' +
         'yang membuat permainannya menarik: pemain harus melihat papan untuk ' +
         'menebak seberapa jauh droidnya akan pergi.'],
        ['Dua kelompok pengguna, dua benua, satu berkas',
         'Layar judulnya menyebut International PC Owners di Pittsburgh, dan ' +
         'baris 193&ndash;196 menambahkan "Error correction by JOHN BECK, ' +
         'Melbourne PC-Group". Perangkat lunak bebas 1982 berpindah lewat pos ' +
         'dan disket, dan tiap tangan yang menyentuhnya menambahkan barisnya ' +
         'sendiri di layar judul.']
      ],
      hindari: [
        ['Cetakan pengawakutu yang tertinggal',
         'Baris 2215: <code>LOCATE 1,20:PRINT CT</code>. Kode aksara yang ' +
         'barusan dibaca dicetak di pojok kiri atas, <b>tiap langkah, ' +
         'selamanya</b>. Tidak ada gunanya bagi pemain, dan tidak ada apa pun ' +
         'yang menandainya sebagai sisa pengawakutuan. Nomor barisnya ' +
         '(2215, di antara 2210 dan 2220) mengatakan sisanya: ia disisipkan ' +
         'belakangan dan tidak pernah dicabut.'],
        ['Melompat keluar dari subrutin',
         'Baris 3030 <code>GOTO 1130</code> keluar dari <code>GOSUB 2200</code> ' +
         'tanpa <code>RETURN</code>. Tiap langkah tidak sah meninggalkan satu ' +
         'alamat pulang di tumpukan. Di GW-BASIC tumpukan itu terbatas, dan ' +
         'permainan yang cukup panjang dengan cukup banyak salah ketik akan ' +
         'berakhir dengan "Out of memory".'],
        ['Enam baris yang diulang dalam satu baris',
         'Baris 2221&ndash;2226 memeriksa enam kode aksara satu per satu. ' +
         'Baris 2229 memeriksa keenamnya lagi dalam satu <code>IF</code>. ' +
         'Yang kedua menangkap kasus yang sama untuk <code>Z&gt;1</code>, tapi ' +
         'susunannya membuat pembaca harus membandingkan tujuh baris untuk ' +
         'memastikan tidak ada yang terlewat.'],
        ['Pintu masuk kedua yang tidak dipakai siapa pun',
         'Baris 1020 melompati baris 1030 (<code>SAMPLE$="YES"</code>), jadi ' +
         '<code>CHAIN "SAMPLES",1000</code> di baris 2420 tidak pernah ' +
         'tercapai. Bentuk yang <b>sama persis</b> ada di MORTGAGE.BAS baris ' +
         '980&ndash;1000 &mdash; dua berkas dari sumber berbeda, satu idiom ' +
         'yang sama.'],
        ['Huruf besar yang dipaksa lewat BIOS',
         'Baris 2060 membandingkan huruf droid dengan <code>CHR$(65)</code> ' +
         'sampai <code>CHR$(68)</code> saja. Yang membuat huruf kecil tetap ' +
         'bekerja bukan program ini, melainkan <code>POKE 23,64</code> di ' +
         'baris 1050 yang menyalakan Caps Lock. <b>Program yang benar karena ' +
         'perangkat kerasnya disetel</b>, bukan karena kodenya menanganinya.']
      ]
    },

    penjelasan: [
      { judul: 'Ladang yang tidak ada di mana pun kecuali di layar',
        isi: [
          'Baris 1230 mengisi ladangnya:',
          '<code>1230 FOR J=3 TO 12:LOCATE J,5:PRINT X15$:NEXT</code>',
          'Sepuluh baris, masing-masing lima belas <code>CHR$(254)</code>. ' +
          'Seratus lima puluh petak bijih.',
          'Dan itu saja. Tidak ada <code>DIM LADANG(15,10)</code>, tidak ada ' +
          'larik apa pun yang menyimpan isi papan. <b>Yang tergambar itulah ' +
          'datanya.</b>',
          'Setiap pertanyaan tentang papan dijawab dengan membacanya kembali:',
          '<code>1930 CHT=SCREEN(IY(J),IX(J)):IF CHT&lt;&gt;ORE THEN 1910</code> ' +
          '&mdash; boleh taruh droid di sini?<br>' +
          '<code>2210 CT=SCREEN(IY(DN)+DY,IX(DN)+DX)</code> &mdash; ada bijih ' +
          'di depan droid?<br>' +
          '<code>2340 CT=SCREEN(IY(J)+JY,IX(J)+JX)</code> &mdash; masih ada ' +
          'bijih di mana pun?',
          'Yang menarik: karena layar cuma menyimpan <b>satu bita per ' +
          'petak</b>, program harus memakai kode aksara sebagai jenis benda. ' +
          '254 bijih, 65&ndash;68 droid, 32 luar papan, dan <b>0</b> untuk ' +
          'petak yang sudah diambil.',
          'Nol itu pilihan yang bagus. Kalau petak yang dimakan dihapus ' +
          'dengan spasi, ia jadi tidak bisa dibedakan dari luar papan &mdash; ' +
          'dan baris 2222 memeriksa keduanya untuk alasan yang berbeda. ' +
          'Dengan <code>CHR$(0)</code>, keduanya sama-sama kosong di mata ' +
          'manusia dan berbeda di mata program.'
        ] },
      { judul: 'Satu baris yang seharusnya dihapus',
        isi: [
          'Baris 2215 berbunyi:',
          '<code>2215 LOCATE 1,20:PRINT CT</code>',
          'Ia mencetak kode aksara yang barusan dibaca dari layar, di pojok ' +
          'kiri atas, tiap langkah droid.',
          'Bagi pemain, angka itu tidak berarti apa-apa. Bagi orang yang ' +
          'sedang mencari tahu kenapa droidnya berhenti di tempat yang salah, ' +
          'ia segalanya &mdash; 254 berarti bijih, 0 berarti sudah diambil, ' +
          '65 berarti droid lain.',
          'Nomor barisnya mengatakan sisanya. Ia <b>2215</b>, di antara 2210 ' +
          'dan 2220 &mdash; disisipkan belakangan, di tengah kode yang sudah ' +
          'jadi, persis seperti orang menyisipkan <code>print()</code> hari ' +
          'ini.',
          'Dan seperti kebanyakan <code>print()</code> semacam itu, ia tidak ' +
          'pernah dicabut.',
          'Yang membuatnya bertahan: <b>ia tidak merusak apa pun</b>. Baris 1 ' +
          'kolom 20 kosong; angkanya muncul dan hilang terlalu cepat untuk ' +
          'terbaca. Program berjalan benar. Satu-satunya yang tersisa adalah ' +
          'kedipan kecil di pojok layar yang tidak ada penjelasannya di mana ' +
          'pun &mdash; dan penelusur ini, empat puluh tahun kemudian, ' +
          'membuatnya berhenti tepat di sana.'
        ] }
    ]
  };
})(window);
