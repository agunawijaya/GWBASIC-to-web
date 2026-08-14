/* ===========================================================================
   YAHTZEE.js — porting minimalis YAHTZEE.BAS sebagai tabel baris.

       1010 ' ORIGINAL BY JL HELMS & MF PEZOK FOR CCII
       1020 ' CORONADO, CA
       1030 ' ADAPTED TO IBM PC BY PATRICK LEABO
       1040 ' TUCSON, AZ
       4700 "27 JUN 79"

   PATRICK LEABO DARI TUCSON JUGA YANG MEMINDAHKAN BLACKJCK.BAS ke PC —
   dan itu pun program CCII, dari Januari 1978. Dua permainan dari klub yang
   sama di Coronado, California, dipindahkan orang yang sama di Arizona.

   YANG PALING LAYAK DILIHAT: EMPAT PULUH BARIS KOMENTAR YANG MENGGAMBAR
   STRUKTUR DATANYA SENDIRI.

       6530 REM  SAMPLE S(Y,X) FOR DICE OF 5,2,4,6,4
       6550 REM  Y/X   0  1  2  3  4  5
       6560 REM  0     4  6  5  2          IN QTY/VALUE SEQUENCE
       6580 REM  2     1  2                1 TWO POSITION 2
       6600 REM  4     2  3  5             2 FOURS POSITIONS 3 AND 5
       6640 REM  +     +  ++++++++++++++++ SECTION FOR POSITION DATA
       6650 REM  +     +------------------ COLUMN INDICATES QTY
       6660 REM  +------------------------ INDEX EQUATES TO DIE VALUE

   Sebuah diagram, dengan contoh yang dikerjakan sampai selesai dan panah
   yang menunjuk tiap bagiannya. Tidak ada program lain di koleksi ini yang
   menjelaskan lariknya sendiri seperti ini.

   Yang digambarkannya memang layak dijelaskan. `S(6,5)` adalah indeks dadu
   yang diurutkan menurut BANYAKNYA:

       S(nilai, 0)     = berapa dadu yang menunjukkan nilai itu
       S(nilai, 1..5)  = di posisi mana saja dadunya
       S(0, urutan)    = nilai dadu, diurutkan dari yang paling banyak

   Sesudah itu, seluruh penilaian jadi mudah. Tiga sama? `S(S(0,0),0)>=3`.
   Full house? Yang terbanyak ada tiga dan yang kedua ada dua. Satu larik,
   dan tiga belas kotak nilai bisa diperiksa tanpa satu pun pengurutan lagi.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` diam. Baris 5600 memakai `PLAY "N=TN(DIE);"` — penyulihan
     variabel di dalam string musik, jadi tiap angka dadu berbunyi berbeda.
   - `RANDOMIZE` memasang benih tetap.
   - `LOAD "MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   - Baris 4750 sudah disunting pemilik koleksi (nomor telepon penulis asli).
   =========================================================================== */

(function (global) {
  'use strict';

  function bas(n) {
    if (n === undefined || n === null) n = 0;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }
  function fmt3(n) {
    var s = String(Math.round(n || 0));
    return s.length >= 3 ? s : ' '.repeat(3 - s.length) + s;
  }
  var PETA = { '╒': 213, '═': 205, '╤': 209, '╕': 184, '│': 179,
               '╞': 198, '╪': 216, '╡': 181, '╘': 212, '╧': 207, '╛': 190 };
  function kotak(s) {
    var k = '', i;
    for (i = 0; i < s.length; i++) {
      k += PETA[s.charAt(i)] !== undefined
        ? String.fromCharCode(PETA[s.charAt(i)]) : s.charAt(i);
    }
    return k;
  }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }

  var tabel = [];
  function T(x) { if (x) tabel.push(x); return x; }

  /* --- 1000-1310: penyiapan -------------------------------------------- */
  [1000, 1010, 1020, 1030, 1040, 1050].forEach(function (n) { T(rem(n)); });
  T({ baris: 1060, jalan: function () { /* DEFINT A-Z */ } });
  T({ baris: 1070, jalan: function (m) {
      m.dim('C()', 5); m.dim('K()', 18, 7); m.dim('F()', 5); m.dim('A$()', 7);
    } });
  T({ baris: 1080, jalan: function (m) {
      m.dim('S()', 6, 5); m.dim('M()', 13); m.dim('TN()', 6); m.dim('DU()', 6);
      m.warna(7, 0);
    } });
  /* 1090 `RESTORE 1150` menunjuk sebuah baris DATA yang duduk DI TENGAH
     alur utama, di antara dua GOSUB. DATA memang dilewati saat dijalankan,
     jadi tidak ada yang rusak — tapi tempatnya tidak biasa. */
  T({ baris: 1090, jalan: function (m) {
      m.ulangData(0);
      for (m.v.N = 1; m.v.N <= 6; m.v.N++) m.v['TN()'][m.v.N] = m.baca();
    } });
  T(rem(1100));
  T({ baris: 1110, jalan: function (m) { m.gosub(5110); } });
  T({ baris: 1120, jalan: function (m) {
      m.v.C1 = 39; m.v.C2 = 63; m.v.C3 = 33; m.v.C4 = 56;
    } });
  /* 1130 memanggil 4680 — dan baris 4680 isinya `RETURN`. Layar sambutan
     penulis aslinya (4690-4770) tidak pernah dijalankan. Lihat catatan. */
  T({ baris: 1130, jalan: function (m) { m.gosub(4680); } });
  T({ baris: 1140, bagian: [
      function (m) { m.cls(); },
      function (m) { m.gosub(4450); }
    ] });
  T({ baris: 1150, jalan: function (m) { m.data([49, 51, 53, 54, 56, 61]); } });
  T({ baris: 1160, jalan: function (m) { m.gosub(6820); } });
  T({ baris: 1170, jalan: function (m) { m.semaiCampur(109); } });
  T({ baris: 1180, jalan: function (m) { m.locate(25, 1); } });
  T({ baris: 1190, bagian: [
      function (m) { m.cetak('HOW MANY PLAYERS?  '); },
      function (m) { m.gosub(2110); }
    ] });
  T({ baris: 1200, bagian: [
      function (m) { m.gosub(7100); },
      function (m) { m.v.N = (m.v['KB$'] || ' ').charCodeAt(0) - 48; }
    ] });
  /* 1210 satu sampai LIMA pemain — padahal petunjuk di baris 4500 berjanji
     "FROM 1 TO 7 PLAYERS MAY PLAY AT THE SAME TIME". */
  T({ baris: 1210, jalan: function (m) {
      if (m.v.N < 1 || m.v.N > 5) m.lompat(1180);
    } });
  T({ baris: 1220, bagian: [
      function (m) { if (!(m.v.N < 5)) m.lompat(1230); },
      function (m) { m.gosub(6020); }
    ] });
  T({ baris: 1230, bagian: [
      function (m) { if (m.v.CC !== 1) m.lompat(1240); },
      function (m) { m.gosub(5500); }
    ] });
  T({ baris: 1240, jalan: function (m) { m.untuk('A', 1, m.v.N, 1, 1300); } });
  T({ baris: 1250, jalan: function (m) {
      m.locate(25, 1); m.cetak(' '.repeat(70)); m.locate(25, 1);
    } });
  T({ baris: 1260, jalan: function (m) {
      m.cetak('PLAYER NUMBER' + bas(m.v.A) + 'NAME PLEASE  ');
    } });
  T({ baris: 1270, bagian: [
      function (m) { m.gosub(2110); },
      function (m) {
        var a = m.v.A;
        m.masukan(function (v) { m.v['A$()'][a] = v; }, '');
      },
      function (m) {
        if (m.v['A$()'][m.v.A] === '') { m.bunyi(); m.lompat(1250); }
      }
    ] });
  T({ baris: 1280, jalan: function (m) {
      m.v['A$()'][m.v.A] = (m.v['A$()'][m.v.A] || '').slice(0, 9);
    } });
  T({ baris: 1290, jalan: function (m) { m.lanjutkan('A'); } });
  T({ baris: 1300, jalan: function (m) {
      if (m.v.CC === 1) { m.v.N = m.v.N + 1; m.v['A$()'][m.v.N] = 'IBM PC'; }
    } });
  T({ baris: 1310, jalan: function (m) { m.locate(23, 1); } });
  T({ baris: 1320, jalan: function (m) { m.v.A = 0; } });

  /* --- 1330-1530: giliran dan lemparan pertama ------------------------- */
  T(rem(1330)); T(rem(1340)); T(rem(1350));
  T({ baris: 1360, jalan: function (m) {
      m.v.A = m.v.A + 1;
      if (m.v.A > m.v.N) m.v.A = 1;
    } });
  T({ baris: 1370, bagian: [
      function (m) { m.v.H = 0; },
      function (m) { m.gosub(5360); }
    ] });
  T({ baris: 1380, jalan: function (m) { if (m.v.A === 0) m.lompat(4780); } });
  T({ baris: 1390, jalan: function (m) {
      if (m.v['K()'][18][m.v.A] === 2) m.lompat(1360);
    } });
  T({ baris: 1400, jalan: function (m) {
      m.locate(23, 1); m.cetak(' '.repeat(60));
    } });
  T({ baris: 1410, jalan: function (m) {
      m.locate(23, 4 * (m.v.A - 1) + 14);
    } });
  T({ baris: 1420, jalan: function (m) { m.cetak(m.v['A$()'][m.v.A] || ''); } });
  T(rem(1430)); T(rem(1440)); T(rem(1450));
  T({ baris: 1460, jalan: function (m) { m.v.H = m.v.H + 1; m.v.MR = 0; } });
  T({ baris: 1470, jalan: function (m) { m.untuk('B', 1, 5, 1, 1530); } });
  T({ baris: 1480, jalan: function (m) {
      m.v.J = m.v.B - 1;
      m.v['C()'][m.v.B] = Math.trunc(6 * m.acak() + 1);
    } });
  T({ baris: 1490, jalan: function (m) {
      m.v.DIE = m.v['C()'][m.v.B]; m.v['F()'][m.v.B] = 0;
    } });
  T({ baris: 1500, jalan: function (m) { m.gosub(5270); } });
  T({ baris: 1510, jalan: function (m) { m.gosub(5550); } });
  T({ baris: 1520, jalan: function (m) { m.lanjutkan('B'); } });
  /* 1530 `A*CC=N` — satu perkalian yang berarti "sekarang giliran komputer".
     `CC` bernilai 1 kalau komputer ikut bermain, dan komputer selalu pemain
     terakhir. Kalau CC=0, hasilnya nol dan tidak pernah sama dengan N. */
  T({ baris: 1530, jalan: function (m) {
      if (m.v.A * (m.v.CC || 0) === m.v.N) m.lompat(2160);
    } });

  /* --- 1540-1950: pemain memilih dadu yang dilempar ulang -------------- */
  T(rem(1540)); T(rem(1550)); T(rem(1560));
  T({ baris: 1570, jalan: function (m) { m.gosub(7080); } });
  T({ baris: 1580, jalan: function (m) { if (m.v.H > 2) m.lompat(1960); } });
  T({ baris: 1590, bagian: [
      function (m) {
        m.kosongkanPenyangga();
        m.cetak(' HOW MANY DICE TO ROLL AGAIN? ');
      },
      function (m) { m.gosub(2100); },
      function (m) { m.gosub(7100); },
      function (m) {
        m.v['F$'] = m.v['KB$']; m.cetak(m.v['F$']);
        m.v.F = m.v['F$'].charCodeAt(0) - 48;
      }
    ] });
  /* 1600 `F=-1` hanya mungkin kalau yang ditekan aksara 47, yaitu "/".
     Itulah pintu pemeriksa yang dijelaskan komentar 6710-6760. */
  T({ baris: 1600, bagian: [
      function (m) { if (m.v.F !== -1) m.lompat(1610); },
      function (m) { m.gosub(7080); }
    ] });
  T({ baris: 1610, jalan: function (m) {
      if (m.v.F < 0 || m.v.F > 5) m.lompat(1570);
    } });
  T({ baris: 1620, jalan: function (m) { if (m.v.F === 0) m.lompat(1960); } });
  T({ baris: 1630, jalan: function (m) { if (m.v.F === 5) m.lompat(1430); } });
  T(rem(1640)); T(rem(1650)); T(rem(1660));
  T({ baris: 1670, jalan: function (m) { m.v.H = m.v.H + 1; } });
  T({ baris: 1680, jalan: function (m) { m.gosub(7080); } });
  T({ baris: 1690, jalan: function (m) {
      for (m.v.NN = 1; m.v.NN <= 4; m.v.NN++) m.v['F()'][m.v.NN] = 0;
    } });
  T({ baris: 1700, jalan: function (m) { if (m.v.F > 1) m.lompat(1720); } });
  T({ baris: 1710, jalan: function (m) {
      m.cetak(' ROLL WHICH' + bas(m.v.F) + 'DIE AGAIN?  '); m.lompat(1730);
    } });
  T({ baris: 1720, jalan: function (m) {
      m.cetak(' ROLL WHICH' + bas(m.v.F) + 'DICE AGAIN   ');
    } });
  T({ baris: 1730, bagian: [
      function (m) { m.gosub(2110); },
      function (m) { m.untuk('ND', 1, m.v.F, 1, 1770); }
    ] });
  T({ baris: 1740, bagian: [
      function (m) { m.gosub(7100); },
      function (m) {
        m.v['F$'] = m.v['KB$'];
        m.v['F()'][m.v.ND] = m.v['F$'].charCodeAt(0) - 48;
      },
      function (m) { m.gosub(2140); },
      function (m) {
        if (m.v['F()'][m.v.ND] === 0 && m.v.ND === 1) {
          m.v.ND = m.v.F; m.lompat(1760);
        }
      }
    ] });
  T({ baris: 1750, jalan: function (m) {
      var f = m.v['F()'][m.v.ND];
      if (f < 1 || f > 5) m.lompat(1740);
    } });
  T({ baris: 1760, bagian: [
      function (m) { m.cetak(bas(m.v['F()'][m.v.ND])); },
      function (m) { m.lanjutkan('ND'); }
    ] });
  T({ baris: 1770, jalan: function (m) { m.v.X = 2; m.v.XF = 0; } });
  T({ baris: 1780, jalan: function (m) { m.untuk('J', 1, m.v.F, 1, 1820); } });
  T({ baris: 1790, jalan: function (m) { if (m.v.F === 1) m.lompat(1810); } });
  /* 1800 dua dadu yang sama disebut dua kali menyetel `X=1`, dan baris 1830
     memakai `ON X GOTO` untuk mengulangi pertanyaannya. */
  T({ baris: 1800, jalan: function (m) {
      if (m.v['F()'][m.v.J] === m.v['F()'][m.v.J + 1]) m.v.X = 1;
    } });
  T({ baris: 1810, jalan: function (m) {
      if (m.v['F()'][1] === 0) m.v.XF = 1;
    } });
  T({ baris: 1820, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) {
        if (m.v.XF === 1) { m.v.H = m.v.H - 1; m.lompat(1570); }
      }
    ] });
  T({ baris: 1830, jalan: function (m) {
      var ke = [1680, 1840][m.v.X - 1];
      if (ke) m.lompat(ke);
    } });
  T(rem(1840)); T(rem(1850)); T(rem(1860));
  T({ baris: 1870, jalan: function (m) { m.untuk('B', 1, 4, 1, 1950); } });
  T({ baris: 1880, jalan: function (m) {
      if (m.v['F()'][m.v.B] === 0) m.lompat(1940);
    } });
  T({ baris: 1890, jalan: function (m) {
      m.v['C()'][m.v['F()'][m.v.B]] = Math.trunc(6 * m.acak() + 1);
    } });
  T({ baris: 1900, jalan: function (m) {
      m.v.DIE = m.v['C()'][m.v['F()'][m.v.B]];
      m.v.J = m.v['F()'][m.v.B] - 1;
    } });
  T({ baris: 1910, jalan: function (m) { m.gosub(5270); } });
  T({ baris: 1920, jalan: function (m) { m.gosub(5550); } });
  T({ baris: 1930, jalan: function (m) { m.v['F()'][m.v.B] = 0; } });
  T({ baris: 1940, jalan: function (m) { m.lanjutkan('B'); } });
  T({ baris: 1950, jalan: function (m) { m.lompat(1540); } });

  /* --- 1960-2150: memilih kotak nilai, dan tiga bunyi ------------------ */
  T(rem(1960)); T(rem(1970)); T(rem(1980));
  T({ baris: 1990, jalan: function (m) { m.gosub(7080); } });
  /* 2000 kotak 10 sampai 13 diketik dengan huruf A sampai D — `I-7`
     menggeser kode ASCII huruf besar ke angka lanjutannya. */
  T({ baris: 2000, bagian: [
      function (m) { m.cetak(' PLAY BOARD NUMBER?  '); },
      function (m) { m.gosub(2100); },
      function (m) { m.gosub(7100); },
      function (m) {
        m.v['I$'] = m.v['KB$'];
        m.v.I = m.v['I$'].charCodeAt(0) - 48;
        if (m.v.I > 9) m.v.I = m.v.I - 7;
      }
    ] });
  T({ baris: 2010, bagian: [
      function (m) { m.gosub(2140); },
      function (m) {
        if (m.v.I > 9) { m.cetak(m.chr(m.v.I + 55)); m.lompat(2030); }
      }
    ] });
  T({ baris: 2020, jalan: function (m) { m.cetak(bas(m.v.I)); } });
  T({ baris: 2030, jalan: function (m) {
      if (m.v.I < 1 || m.v.I > 13) m.lompat(1990);
    } });
  /* 2040 kotak Yahtzee boleh diisi BERKALI-KALI: yang lain ditolak begitu
     sudah terisi, tapi kotak 12 diperiksa dengan `> -1` — artinya masih
     boleh selama belum ditandai batal. */
  T({ baris: 2040, jalan: function (m) {
      if (m.v.I === 12 && m.v['K()'][12][m.v.A] > -1) m.lompat(2160);
    } });
  T({ baris: 2050, jalan: function (m) {
      if (m.v['K()'][m.v.I][m.v.A] === 0) m.lompat(2160);
    } });
  T({ baris: 2060, jalan: function (m) { m.locate(24, 1); m.bunyi(); } });
  T({ baris: 2070, jalan: function (m) {
      m.cetak('NO - NO - DUMMY - - TRY AGAIN');
      m.locate(24, 1); m.cetak(' '.repeat(60));
    } });
  T({ baris: 2080, jalan: function (m) {
      m.locate(25, 1); m.cetak(' '.repeat(60)); m.locate(25, 1);
    } });
  T({ baris: 2090, jalan: function (m) { m.lompat(2000); } });
  T(rem(2100));
  T({ baris: 2110, jalan: function (m) { m.kembali(); } });
  T(rem(2120));
  T({ baris: 2130, jalan: function (m) { m.kembali(); } });
  T(rem(2140));
  T({ baris: 2150, jalan: function (m) { m.kembali(); } });

  /* --- 2160-2380: MEMBANGUN INDEKS DADU S() ---------------------------- */
  T(rem(2160)); T(rem(2170)); T(rem(2180)); T(rem(2190));
  T({ baris: 2200, jalan: function (m) { m.untuk('M', 0, 6, 1, 2250); } });
  T({ baris: 2210, jalan: function (m) { m.untuk('K', 0, 5, 1, 2240); } });
  T({ baris: 2220, jalan: function (m) { m.v['S()'][m.v.M][m.v.K] = 0; } });
  T({ baris: 2230, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 2240, jalan: function (m) { m.lanjutkan('M'); } });
  T({ baris: 2250, jalan: function (m) { m.untuk('J', 1, 5, 1, 2290); } });
  /* 2260-2270 tiap dadu menaikkan cacah nilainya, DAN mencatat posisinya —
     dua keterangan dalam satu larik. */
  T({ baris: 2260, jalan: function (m) {
      m.v.X = m.v['C()'][m.v.J];
      m.v['S()'][m.v.X][0] = m.v['S()'][m.v.X][0] + 1;
    } });
  T({ baris: 2270, jalan: function (m) {
      m.v.P = m.v['S()'][m.v.X][0];
      m.v['S()'][m.v.X][m.v.P] = m.v.J;
    } });
  T({ baris: 2280, jalan: function (m) { m.lanjutkan('J'); } });
  T(rem(2290)); T(rem(2300)); T(rem(2310));
  T({ baris: 2320, jalan: function (m) { m.v.X = 0; } });
  /* 2330-2380 PENGURUTAN TANPA MEMBANDINGKAN APA PUN: gelung luar berjalan
     dari cacah lima turun ke satu, gelung dalam dari nilai enam turun ke
     satu. Yang cacahnya cocok dituliskan berurutan ke `S(0,x)`.
     Pengurutan dengan menyapu, bukan dengan menukar. */
  T({ baris: 2330, jalan: function (m) { m.untuk('J', 5, 1, -1, 2390); } });
  T({ baris: 2340, jalan: function (m) { m.untuk('M', 6, 1, -1, 2380); } });
  T({ baris: 2350, jalan: function (m) {
      if (m.v['S()'][m.v.M][0] !== m.v.J) m.lompat(2370);
    } });
  T({ baris: 2360, jalan: function (m) {
      m.v['S()'][0][m.v.X] = m.v.M; m.v.X = m.v.X + 1;
    } });
  T({ baris: 2370, jalan: function (m) { m.lanjutkan('M'); } });
  T({ baris: 2380, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 2390, jalan: function (m) {
      if (m.v.A * (m.v.CC || 0) === m.v.N) m.lompat(2760);
    } });

  /* --- 2400-2750: menilai kotak yang dipilih pemain -------------------- */
  T({ baris: 2400, jalan: function (m) { if (m.v.I > 6) m.lompat(2480); } });
  T(rem(2410)); T(rem(2420)); T(rem(2430));
  T({ baris: 2440, jalan: function (m) { m.gosub(6110); } });
  T({ baris: 2450, jalan: function (m) { if (m.v.X === -1) m.lompat(2740); } });
  T({ baris: 2460, jalan: function (m) {
      m.v['K()'][m.v.I][m.v.A] =
        m.v.I * m.v['S()'][m.v['S()'][0][m.v.X]][0];
    } });
  T({ baris: 2470, jalan: function (m) { m.lompat(4000); } });
  T(rem(2480)); T(rem(2490)); T(rem(2500));
  T({ baris: 2510, jalan: function (m) {
      var ke = [2520, 2540, 2560, 2580, 2630, 2670, 2700][m.v.I - 7];
      if (ke) m.lompat(ke);
    } });
  T(cek(2520, function (m) { return puncak(m) < 3; }, 2740));
  T({ baris: 2530, bagian: [
      function (m) { m.gosub(6190); },
      function (m) { m.lompat(4000); }
    ] });
  T(cek(2540, function (m) { return puncak(m) < 4; }, 2740));
  T({ baris: 2550, bagian: [
      function (m) { m.gosub(6190); },
      function (m) { m.lompat(4000); }
    ] });
  T(cek(2560, function (m) {
      return puncak(m) !== 3 || kedua(m) !== 2;
    }, 2740));
  T({ baris: 2570, jalan: function (m) {
      m.v['K()'][9][m.v.A] = 25; m.lompat(4000);
    } });
  T(runtun(2580, 1, 4, 2620)); T(runtun(2590, 2, 5, 2620));
  T(runtun(2600, 3, 6, 2620));
  T({ baris: 2610, jalan: function (m) { m.lompat(2740); } });
  T({ baris: 2620, jalan: function (m) {
      m.v['K()'][10][m.v.A] = 30; m.lompat(4000);
    } });
  /* 2630-2640 `AND` DI BASIC ADALAH OPERASI BIT, bukan "dan" logika. Yang
     tertulis `S(1,0)AND S(2,0)AND...AND S(5,0)=1` berarti: cacah keempat
     dadu pertama di-AND-kan sebagai BILANGAN, lalu hasilnya di-AND dengan
     benar-salah `S(5,0)=1`. Kebetulan itu memberi jawaban yang tepat —
     lihat catatan cacat. */
  T(besar(2630, 1, 5, 2660)); T(besar(2640, 2, 6, 2660));
  T({ baris: 2650, jalan: function (m) { m.lompat(2740); } });
  T({ baris: 2660, jalan: function (m) {
      m.v['K()'][11][m.v.A] = 40; m.lompat(4000);
    } });
  T(cek(2670, function (m) { return puncak(m) !== 5; }, 2740));
  T({ baris: 2680, jalan: function (m) {
      if (m.v['K()'][12][m.v.A] === 0) {
        m.v['K()'][12][m.v.A] = 50; m.lompat(4000);
      }
    } });
  T({ baris: 2690, jalan: function (m) {
      m.v['K()'][12][m.v.A] = m.v['K()'][12][m.v.A] + 100; m.lompat(4000);
    } });
  T({ baris: 2700, bagian: [
      function (m) { m.gosub(6190); },
      function (m) { m.lompat(4000); }
    ] });
  T(rem(2710)); T(rem(2720)); T(rem(2730));
  T({ baris: 2740, jalan: function (m) { m.v['K()'][m.v.I][m.v.A] = -1; } });
  T({ baris: 2750, jalan: function (m) { m.lompat(4000); } });

  /* --- 2760-3990: kecerdasan komputer ---------------------------------- */
  T(rem(2760)); T(rem(2770)); T(rem(2780));
  T({ baris: 2790, jalan: function (m) { m.v.I = 12; } });
  T({ baris: 2800, jalan: function (m) {
      if (puncak(m) === 5 && m.v['K()'][12][m.v.A] === 0) {
        m.v['K()'][12][m.v.A] = 50; m.lompat(4000);
      }
    } });
  T({ baris: 2810, jalan: function (m) {
      if (puncak(m) === 5 && m.v['K()'][12][m.v.A] > 0) {
        m.v['K()'][12][m.v.A] += 100; m.lompat(4000);
      }
    } });
  T({ baris: 2820, jalan: function (m) { m.v.I = 8; } });
  T({ baris: 2830, bagian: [
      function (m) {
        if (!(puncak(m) === 4 && m.v['K()'][8][m.v.A] === 0)) m.lompat(2840);
      },
      function (m) { m.gosub(6190); },
      function (m) { m.lompat(4000); }
    ] });
  T({ baris: 2840, jalan: function (m) { m.v.I = 9; } });
  T({ baris: 2850, jalan: function (m) {
      if (puncak(m) === 3 && kedua(m) === 2 && m.v['K()'][9][m.v.A] === 0) {
        m.v['K()'][9][m.v.A] = 25; m.lompat(4000);
      }
    } });
  T({ baris: 2860, jalan: function (m) {
      if (m.v['K()'][11][m.v.A] !== 0) m.lompat(2920);
    } });
  T({ baris: 2870, jalan: function (m) { m.v.I = 11; } });
  T(besar(2880, 1, 5, 2910)); T(besar(2890, 2, 6, 2910));
  T({ baris: 2900, jalan: function (m) { m.lompat(2920); } });
  T({ baris: 2910, jalan: function (m) {
      m.v['K()'][11][m.v.A] = 40; m.lompat(4000);
    } });
  T({ baris: 2920, jalan: function (m) {
      if (m.v['K()'][10][m.v.A] !== 0) m.lompat(2990);
    } });
  T({ baris: 2930, jalan: function (m) { m.v.I = 10; } });
  T(runtun(2940, 1, 4, 2980)); T(runtun(2950, 2, 5, 2980));
  T(runtun(2960, 3, 6, 2980));
  T({ baris: 2970, jalan: function (m) { m.lompat(2990); } });
  T({ baris: 2980, jalan: function (m) {
      m.v['K()'][10][m.v.A] = 30; m.lompat(4000);
    } });
  /* 2990 sebelum lemparan ketiga, komputer TIDAK mengisi kotak atas —
     ia menyimpan gilirannya untuk mencoba kombinasi yang lebih besar. */
  T({ baris: 2990, jalan: function (m) { if (m.v.H < 3) m.lompat(3160); } });
  T(atas(3000, 3010, 6)); T(atas(3020, 3030, 5));
  T(atas(3040, 3050, 4)); T(atas(3060, 3070, 3));
  T({ baris: 3080, jalan: function (m) { m.v.I = 7; } });
  T({ baris: 3090, bagian: [
      function (m) {
        if (!(puncak(m) > 2 && m.v['K()'][7][m.v.A] === 0)) m.lompat(3100);
      },
      function (m) { m.gosub(6190); },
      function (m) { m.lompat(4000); }
    ] });
  T(atas(3100, 3110, 2)); T(atas(3120, 3130, 1));
  T({ baris: 3140, jalan: function (m) {
      m.v.I = 13;
      if (m.v['K()'][13][m.v.A] !== 0) m.lompat(3160);
    } });
  T({ baris: 3150, bagian: [
      function (m) {
        var t = 0;
        for (var k = 1; k <= 5; k++) t += m.v['C()'][k];
        if (!(t > 19)) m.lompat(3160);
      },
      function (m) { m.gosub(6190); },
      function (m) { m.lompat(4000); }
    ] });
  T(rem(3160)); T(rem(3170)); T(rem(3180)); T(rem(3190));
  T({ baris: 3200, jalan: function (m) { m.untuk('B', 1, 5, 1, 3230); } });
  T({ baris: 3210, jalan: function (m) { m.v['F()'][m.v.B] = 0; } });
  T({ baris: 3220, jalan: function (m) { m.lanjutkan('B'); } });
  T(rem(3230)); T(rem(3240)); T(rem(3250)); T(rem(3260));
  T({ baris: 3270, jalan: function (m) {
      m.v.H = m.v.H + 1;
      if (m.v.H > 3) m.lompat(3860);
    } });
  /* 3280-3300 DAFTAR PRIORITAS BERPUTAR: `M(13)` berisi urutan kotak yang
     dikejar komputer, dan `MR` berputar sampai ketemu yang belum terisi. */
  T({ baris: 3280, jalan: function (m) {
      m.v.I = m.v['M()'][m.v.MR];
      if (m.v.I !== 0) m.lompat(3310);
    } });
  T({ baris: 3290, jalan: function (m) {
      m.v.MR = m.v.MR + 1;
      if (m.v.MR > 13) m.v.MR = 1;
    } });
  T({ baris: 3300, jalan: function (m) { m.lompat(3280); } });
  T({ baris: 3310, jalan: function (m) {
      if (m.v.I === 12 && m.v['K()'][12][m.v.A] > -1) m.lompat(3350);
    } });
  T({ baris: 3320, jalan: function (m) {
      if (m.v['K()'][m.v.I][m.v.A] !== 0) m.lompat(3290);
    } });
  T({ baris: 3330, jalan: function (m) { if (m.v.I === 9) m.lompat(3460); } });
  T({ baris: 3340, jalan: function (m) {
      if (m.v.I === 10 || m.v.I === 11) m.lompat(3580);
    } });
  T(rem(3350)); T(rem(3360)); T(rem(3370)); T(rem(3380));
  T({ baris: 3390, jalan: function (m) { m.v.M = 0; m.v.J = 1; } });
  T({ baris: 3400, jalan: function (m) {
      m.v.M = m.v.M + 1;
      if (m.v.M > 4) m.lompat(3740);
    } });
  T({ baris: 3410, jalan: function (m) {
      m.v.K = m.v['S()'][0][m.v.M];
      if (m.v.K === 0) m.lompat(3740);
    } });
  T({ baris: 3420, jalan: function (m) {
      m.untuk('L', 1, m.v['S()'][m.v.K][0], 1, 3450);
    } });
  T({ baris: 3430, jalan: function (m) {
      m.v['F()'][m.v.J] = m.v['S()'][m.v.K][m.v.L]; m.v.J = m.v.J + 1;
    } });
  T({ baris: 3440, jalan: function (m) { m.lanjutkan('L'); } });
  T({ baris: 3450, jalan: function (m) { m.lompat(3400); } });
  T(rem(3460)); T(rem(3470)); T(rem(3480)); T(rem(3490));
  T({ baris: 3500, jalan: function (m) { m.v.M = 0; m.v.J = 1; } });
  T({ baris: 3510, jalan: function (m) {
      m.v.M = m.v.M + 1;
      if (m.v.M > 4) m.lompat(3740);
    } });
  T({ baris: 3520, jalan: function (m) {
      m.v.K = m.v['S()'][0][m.v.M];
      if (m.v.K === 0) m.lompat(3740);
    } });
  T({ baris: 3530, jalan: function (m) { if (m.v.K > 1) m.lompat(3510); } });
  T({ baris: 3540, jalan: function (m) {
      m.untuk('L', 1, m.v['S()'][m.v.K][0], 1, 3570);
    } });
  T({ baris: 3550, jalan: function (m) {
      m.v['F()'][m.v.J] = m.v['S()'][m.v.K][m.v.L]; m.v.J = m.v.J + 1;
    } });
  T({ baris: 3560, jalan: function (m) { m.lanjutkan('L'); } });
  T({ baris: 3570, jalan: function (m) { m.lompat(3510); } });
  T(rem(3580)); T(rem(3590)); T(rem(3600)); T(rem(3610));
  T({ baris: 3620, jalan: function (m) { m.v.M = 0; m.v.J = 1; } });
  T({ baris: 3630, jalan: function (m) {
      m.v.M = m.v.M + 1;
      if (m.v.M > 4) m.lompat(3700);
    } });
  T({ baris: 3640, jalan: function (m) {
      m.v.K = m.v['S()'][0][m.v.M];
      if (m.v.K === 0) m.lompat(3700);
    } });
  T({ baris: 3650, jalan: function (m) {
      if (m.v['S()'][m.v.K][0] === 1) m.lompat(3630);
    } });
  T({ baris: 3660, jalan: function (m) {
      m.untuk('L', 1, m.v['S()'][m.v.K][0], 1, 3690);
    } });
  T({ baris: 3670, jalan: function (m) {
      m.v['F()'][m.v.J] = m.v['S()'][m.v.K][m.v.L]; m.v.J = m.v.J + 1;
    } });
  T({ baris: 3680, jalan: function (m) { m.lanjutkan('L'); } });
  T({ baris: 3690, jalan: function (m) { m.lompat(3630); } });
  /* 3700-3730 kalau tidak ada dadu yang perlu dibuang untuk mengejar
     runtun, komputer membuang dadu pertama atau kelima — undian, karena
     runtun bisa tumbuh ke dua arah. */
  T({ baris: 3700, jalan: function (m) {
      if (m.v['F()'][1] !== 0) m.lompat(3740);
    } });
  T({ baris: 3710, jalan: function (m) {
      m.v.L = Math.trunc(2 * m.acak() + 1);
    } });
  T({ baris: 3720, jalan: function (m) { m.v['F()'][1] = 5; } });
  T({ baris: 3730, jalan: function (m) { if (m.v.L === 1) m.v['F()'][1] = 1; } });
  T(rem(3740)); T(rem(3750)); T(rem(3760));
  T({ baris: 3770, jalan: function (m) { m.untuk('B', 1, 4, 1, 3850); } });
  T({ baris: 3780, jalan: function (m) {
      if (m.v['F()'][m.v.B] < 1) m.lompat(3830);
    } });
  T({ baris: 3790, jalan: function (m) {
      m.v['C()'][m.v['F()'][m.v.B]] = Math.trunc(6 * m.acak() + 1);
    } });
  T({ baris: 3800, jalan: function (m) {
      m.v.DIE = m.v['C()'][m.v['F()'][m.v.B]];
      m.v.J = m.v['F()'][m.v.B] - 1;
    } });
  T({ baris: 3810, jalan: function (m) { m.gosub(5270); } });
  T({ baris: 3820, jalan: function (m) { m.gosub(5550); } });
  T({ baris: 3830, jalan: function (m) { m.v['F()'][m.v.B] = 0; } });
  T({ baris: 3840, jalan: function (m) { m.lanjutkan('B'); } });
  T({ baris: 3850, jalan: function (m) { m.lompat(2160); } });
  T(rem(3860)); T(rem(3870)); T(rem(3880));
  T({ baris: 3890, jalan: function (m) {
      m.v.MR = m.v.MR + 1;
      if (m.v.MR > 13) m.v.MR = 1;
    } });
  T({ baris: 3900, jalan: function (m) {
      m.v.I = m.v['M()'][m.v.MR];
      if (m.v.I === 0) m.lompat(3890);
    } });
  T({ baris: 3910, jalan: function (m) {
      if (m.v['K()'][m.v.I][m.v.A] !== 0) m.lompat(3890);
    } });
  T({ baris: 3920, jalan: function (m) { if (m.v.I > 6) m.lompat(3980); } });
  T({ baris: 3930, jalan: function (m) { m.gosub(6110); } });
  T({ baris: 3940, jalan: function (m) { if (m.v.X === -1) m.lompat(3990); } });
  T({ baris: 3950, jalan: function (m) {
      if (m.v['K()'][m.v.I][m.v.A] !== 0) m.lompat(3890);
    } });
  T({ baris: 3960, jalan: function (m) {
      m.v['K()'][m.v.I][m.v.A] = m.v['S()'][m.v.I][0] * m.v.I;
    } });
  T({ baris: 3970, jalan: function (m) {
      if (m.v['K()'][m.v.I][m.v.A] !== 0) m.lompat(4000);
    } });
  T({ baris: 3980, bagian: [
      function (m) {
        if (!(m.v.I === 13 && m.v['K()'][13][m.v.A] === 0)) m.lompat(3990);
      },
      function (m) { m.gosub(6190); }
    ] });
  T({ baris: 3990, jalan: function (m) {
      if (m.v['K()'][m.v.I][m.v.A] === 0) m.v['K()'][m.v.I][m.v.A] = -1;
    } });

  /* --- 4000-4440: menghitung dan mencetak papan ------------------------ */
  T(rem(4000)); T(rem(4010)); T(rem(4020));
  T({ baris: 4030, jalan: function (m) { m.untuk('J', 14, 17, 1, 4060); } });
  T({ baris: 4040, jalan: function (m) { m.v['K()'][m.v.J][m.v.A] = 0; } });
  T({ baris: 4050, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 4060, jalan: function (m) { m.untuk('J', 1, 6, 1, 4100); } });
  T({ baris: 4070, jalan: function (m) {
      if (m.v['K()'][m.v.J][m.v.A] < 0) m.lompat(4090);
    } });
  T({ baris: 4080, jalan: function (m) {
      m.v['K()'][15][m.v.A] += m.v['K()'][m.v.J][m.v.A];
    } });
  T({ baris: 4090, jalan: function (m) { m.lanjutkan('J'); } });
  /* 4100 bonus 35 kalau bagian atas lewat 62 — aturan Yahtzee yang benar. */
  T({ baris: 4100, jalan: function (m) {
      if (m.v['K()'][15][m.v.A] > 62) m.v['K()'][14][m.v.A] = 35;
    } });
  T({ baris: 4110, jalan: function (m) { m.untuk('J', 7, 13, 1, 4150); } });
  T({ baris: 4120, jalan: function (m) {
      if (m.v['K()'][m.v.J][m.v.A] < 0) m.lompat(4140);
    } });
  T({ baris: 4130, jalan: function (m) {
      m.v['K()'][16][m.v.A] += m.v['K()'][m.v.J][m.v.A];
    } });
  T({ baris: 4140, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 4150, jalan: function (m) {
      m.v['K()'][17][m.v.A] = m.v['K()'][14][m.v.A] +
        m.v['K()'][15][m.v.A] + m.v['K()'][16][m.v.A];
    } });
  T(rem(4160)); T(rem(4170)); T(rem(4180));
  T({ baris: 4190, jalan: function (m) { m.gosub(2130); } });
  T({ baris: 4200, jalan: function (m) { m.warna(15, 0); } });
  T({ baris: 4210, jalan: function (m) { m.untuk('J', 1, 6, 1, 4260); } });
  T(skor(4220, 4230, 4240, 4250, function (m) { return m.v.J + 1; }));
  T({ baris: 4260, jalan: function (m) { m.untuk('J', 7, 13, 1, 4310); } });
  T(skor(4270, 4280, 4290, 4300, function (m) { return m.v.J + 4; }));
  T(total(4310, 9, 15)); T(total(4320, 19, 16));
  T(total(4330, 20, 14)); T(total(4340, 21, 17));
  T({ baris: 4350, jalan: function (m) { m.warna(7, 0); } });
  T({ baris: 4360, jalan: function (m) {
      if (m.v.A * (m.v.CC || 0) !== m.v.N) m.lompat(1330);
    } });
  T(rem(4370)); T(rem(4380)); T(rem(4390));
  /* 4400-4430 kotak yang baru saja terisi DICORET dari daftar prioritas
     komputer — kecuali kotak Yahtzee, yang boleh diisi berulang. */
  T({ baris: 4400, jalan: function (m) { m.untuk('B', 1, 13, 1, 4440); } });
  T({ baris: 4410, jalan: function (m) {
      if (m.v['M()'][m.v.B] === 12) m.lompat(4430);
    } });
  T({ baris: 4420, jalan: function (m) {
      if (m.v['M()'][m.v.B] === m.v.I) m.v['M()'][m.v.B] = 0;
    } });
  T({ baris: 4430, jalan: function (m) { m.lanjutkan('B'); } });
  T({ baris: 4440, jalan: function (m) { m.lompat(1330); } });

  /* --- 4450-4770: petunjuk, dan layar sambutan yang dimatikan ---------- */
  T(rem(4450)); T(rem(4460)); T(rem(4470));
  T(cet(4480, '            Y A H T Z E E '));
  T(cet(4490, 'THIS IS THE GAME OF YAHTZEE - '));
  T(cet(4500, 'FROM 1 TO 7 PLAYERS MAY PLAY AT THE SAME TIME'));
  T(cet(4510, 'WITH EACH PLAYERS CURRENT STATUS SHOWN ON THE'));
  T(cet(4520, 'PLAYING BOARD, INCLUDING TOTAL SCORES'));
  T(cet(4530, ''));
  T(cet(4540, 'THE ONLY DIFFERENCE BETWEEN THIS GAME AND THE'));
  T(cet(4550, 'POPULAR HOME GAME IS THAT YOU MAY GET MULTIPLE'));
  T(cet(4560, 'YAHTZEES HERE ..... THE FIRST YAHTZEE SCORES'));
  T(cet(4570, '50 POINTS, AND EACH ADDITIONAL ONE WILL YIELD'));
  T(cet(4580, 'A BONUS OF 100 POINTS (IF THE YAHTZEE IS PUT'));
  T(cet(4590, 'INTO THE YAHTZEE BLOCK)..... IN ADDITION YOU'));
  T(cet(4600, 'WILL BE GIVEN AN EXTRA TURN AT THE END OF'));
  T({ baris: 4610, jalan: function (m) {
      m.cetak('THE GAME'); m.barisBaru(); m.barisBaru(); m.barisBaru();
    } });
  T(cet(4620, 'THE WINNER WILL BE ANNOUNCED AT THE END OF'));
  T(cet(4630, 'THE GAME - - BUT I WOULDNT ADVISE ANYONE'));
  T(cet(4640, 'TO BE LAST.......'));
  T({ baris: 4650, jalan: function (m) { m.barisBaru(); m.barisBaru(); } });
  T({ baris: 4660, bagian: [
      function (m) { m.gosub(2110); },
      function (m) { m.masukan('Y$', 'HIT RETURN TO CONTINUE  ? '); },
      function (m) { m.bunyi(); }
    ] });
  T({ baris: 4670, jalan: function (m) { m.kembali(); } });
  /* 4680 SEBUAH `RETURN` YANG BERDIRI SENDIRI, TEPAT DI DEPAN LAYAR
     SAMBUTAN. Baris 1130 memanggil ke sini, dan pulang seketika — jadi
     baris 4690 sampai 4770, yang menyebut nama J.L. Helms dan M.F. Pezok
     serta tanggal 27 Juni 1979, tidak pernah tampil di layar siapa pun. */
  T({ baris: 4680, jalan: function (m) { m.kembali(); } });
  T(pet(4690, 10, 10, 'YATZEE.BAS     VER 3.2'));
  T(pet(4700, 12, 10, '27 JUN 79'));
  T(pet(4710, 14, 10, 'DEVELOPED BY'));
  T(pet(4720, 15, 13, 'J.L. HELMS    &    M.F. PEZOK'));
  /* 4730 `LOCATE,16,13` — koma pertama mengosongkan argumen BARIS, jadi
     yang disetel kolom 16 dan kursor 13. Salah ketik yang tidak pernah
     ketahuan karena barisnya tidak pernah dijalankan. */
  T({ baris: 4730, jalan: function (m) {
      m.locate(null, 16); m.cetak('1009 LEYTE RD / 1321 SAIPAN RD');
      m.barisBaru();
    } });
  T(pet(4740, 17, 17, 'CORONADO,  CA.  92118'));
  T(pet(4750, 18, 15, '   [disunting UU PDP]    '));
  T({ baris: 4760, jalan: function (m) { m.cetak(m.chr(11)); } });
  T({ baris: 4770, jalan: function (m) { m.kembali(); } });

  /* --- 4780-5260: mengurutkan pemenang --------------------------------- */
  T(rem(4780)); T(rem(4790)); T(rem(4800));
  T({ baris: 4810, jalan: function (m) {
      m.v.X = 2;
      if (m.v.N === 1) m.lompat(4890);
    } });
  T({ baris: 4820, jalan: function (m) { m.untuk('J', 1, m.v.N - 1, 1, 4880); } });
  T({ baris: 4830, jalan: function (m) {
      if (m.v['K()'][17][m.v.J] > m.v['K()'][17][m.v.J + 1]) m.lompat(4870);
    } });
  T({ baris: 4840, jalan: function (m) {
      var K = m.v['K()'][17], j = m.v.J;
      m.v.K = K[j]; K[j] = K[j + 1]; K[j + 1] = m.v.K;
    } });
  T({ baris: 4850, jalan: function (m) {
      var A = m.v['A$()'], j = m.v.J;
      m.v['A$'] = A[j]; A[j] = A[j + 1]; A[j + 1] = m.v['A$'];
    } });
  T({ baris: 4860, jalan: function (m) { m.v.X = 1; } });
  T({ baris: 4870, jalan: function (m) { m.lanjutkan('J'); } });
  /* 4880 `ON X GOTO 4780,4890` — sasaran pertama adalah sebuah REM, jadi
     yang terjadi ia jatuh ke 4790, 4800, lalu 4810: gelembungnya diulang
     dari awal selama masih ada yang ditukar. */
  T({ baris: 4880, jalan: function (m) {
      var ke = [4780, 4890][m.v.X - 1];
      if (ke) m.lompat(ke);
    } });
  T(rem(4890)); T(rem(4900)); T(rem(4910));
  T({ baris: 4920, jalan: function (m) { m.ulangData(6); } });
  T({ baris: 4930, jalan: function (m) { m.untuk('J', 1, m.v.N, 1, 5010); } });
  T({ baris: 4940, jalan: function (m) {
      m.locate(25, 1); m.cetak(' '.repeat(60));
    } });
  /* 4950 pemain TERAKHIR — kalau ada lebih dari satu — dapat sebutan
     tersendiri: "DEAD LAST". */
  T({ baris: 4950, jalan: function (m) {
      if (m.v.J > 1 && m.v.J === m.v.N) m.ulangData(12);
    } });
  T({ baris: 4960, jalan: function (m) {
      m.locate(25, 1); m.v['A$'] = m.baca();
    } });
  T({ baris: 4970, jalan: function (m) {
      m.cetak(m.v['A$'] + '     ' + (m.v['A$()'][m.v.J] || '') + ' ');
    } });
  T({ baris: 4980, jalan: function (m) {
      m.v.TT = 500 * (m.v.N - m.v.J + 1);
      if (m.v.TT < 1500) m.v.TT = 1500;
    } });
  T({ baris: 4990, jalan: function (m) {
      for (m.v.T = 1; m.v.T <= m.v.TT; m.v.T++) { /* jeda */ }
    } });
  T({ baris: 5000, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 5010, jalan: function (m) {
      m.locate(25, 1); m.cetak(' '.repeat(60));
    } });
  T({ baris: 5020, jalan: function (m) {
      m.locate(24, 1); m.cetak('+++   END OF GAME   +++');
    } });
  T({ baris: 5030, jalan: function (m) {
      for (m.v.T = 1; m.v.T <= 2000; m.v.T++) { /* jeda */ }
    } });
  T(rem(5040));
  T({ baris: 5050, bagian: [
      function (m) { m.gosub(2110); },
      function (m) { m.locate(25, 1); m.cetak('PLAY AGAIN?  Y/N  '); }
    ] });
  T({ baris: 5060, jalan: function (m) {
      m.v['Y$'] = m.inkey();
      if (m.v['Y$'] === '') m.lompat(5060);
    } });
  T({ baris: 5070, bagian: [
      function (m) {
        if (m.v['Y$'] !== 'Y' && m.v['Y$'] !== 'y') m.lompat(5080);
      },
      function (m) { m.gosub(5110); },
      function (m) { m.lompat(1110); }
    ] });
  T({ baris: 5080, jalan: function (m) {
      if (m.v['Y$'] === 'N' || m.v['Y$'] === 'n') { m.bunyi(); m.lompat(5100); }
    } });
  T({ baris: 5090, jalan: function (m) { m.lompat(5060); } });
  T({ baris: 5100, jalan: function (m) { m.jalankan('MENU'); } });
  T(rem(5110)); T(rem(5120)); T(rem(5130));
  T({ baris: 5140, jalan: function (m) { m.untuk('K', 1, 7, 1, 5200); } });
  T({ baris: 5150, jalan: function (m) { m.untuk('J', 1, 18, 1, 5180); } });
  T({ baris: 5160, jalan: function (m) { m.v['K()'][m.v.J][m.v.K] = 0; } });
  T({ baris: 5170, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 5180, jalan: function (m) { m.v['A$()'][m.v.K] = ''; } });
  T({ baris: 5190, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 5200, jalan: function (m) { m.cls(); } });
  T({ baris: 5210, jalan: function (m) { m.kembali(); } });
  T({ baris: 5220, jalan: function (m) { m.data(['+++   THE WINNER   +++']); } });
  T({ baris: 5230, jalan: function (m) {
      m.data([' SECOND PLACE', ' THIRD PLACE ']);
    } });
  T({ baris: 5240, jalan: function (m) {
      m.data([' FOURTH PLACE ', ' FIFTH PLACE ']);
    } });
  T({ baris: 5250, jalan: function (m) { m.data([' SIXTH PLACE ']); } });
  T({ baris: 5260, jalan: function (m) { m.data([' DEAD LAST ']); } });

  /* --- 5270-6010: menggambar dadu -------------------------------------- */
  T(rem(5270)); T(rem(5280)); T(rem(5290));
  T({ baris: 5300, jalan: function (m) { m.warna(0, 7); } });
  T(hapus(5310, 1)); T(hapus(5320, 2)); T(hapus(5330, 3));
  T({ baris: 5340, jalan: function (m) { m.warna(7, 0); } });
  T({ baris: 5350, jalan: function (m) { m.kembali(); } });
  T(rem(5360)); T(rem(5370)); T(rem(5380));
  T({ baris: 5390, jalan: function (m) { m.v.X = 0; } });
  T({ baris: 5400, jalan: function (m) { m.untuk('J', 1, m.v.N, 1, 5480); } });
  T({ baris: 5410, jalan: function (m) { m.v.Y = 2; } });
  T({ baris: 5420, jalan: function (m) { m.untuk('K', 1, 13, 1, 5450); } });
  T({ baris: 5430, jalan: function (m) {
      if (m.v['K()'][m.v.K][m.v.J] === 0) m.v.Y = 1;
    } });
  T({ baris: 5440, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 5450, jalan: function (m) { m.v['K()'][18][m.v.J] = m.v.Y; } });
  T({ baris: 5460, jalan: function (m) { if (m.v.Y === 2) m.v.X = m.v.X + 1; } });
  T({ baris: 5470, jalan: function (m) { m.lanjutkan('J'); } });
  /* 5480 `IF X= > N` — tanda bandingnya ditulis terbalik, sama seperti
     ATTACK.BAS baris 1514. GW-BASIC menerimanya. */
  T({ baris: 5480, jalan: function (m) { if (m.v.X >= m.v.N) m.v.A = 0; } });
  T({ baris: 5490, jalan: function (m) { m.kembali(); } });
  T(rem(5500)); T(rem(5510)); T(rem(5520));
  T({ baris: 5530, jalan: function (m) { m.gosub(6780); } });
  T({ baris: 5540, jalan: function (m) { m.kembali(); } });
  T(rem(5550)); T(rem(5560)); T(rem(5570));
  T({ baris: 5580, jalan: function (m) { m.warna(0, 7); m.kursor(0); } });
  T(rem(5590));
  /* 5600 `PLAY "L32T200N=TN(DIE);"` — tanda sama dengan dan titik koma di
     dalam string musik MENYULIH ISI VARIABEL. Jadi tiap angka dadu
     berbunyi nada yang berbeda, diambil dari DATA di baris 1150. */
  T({ baris: 5600, jalan: function () { } });
  T({ baris: 5610, jalan: function (m) {
      var ke = [5950, 5890, 5830, 5770, 5710, 5650][m.v.DIE - 1];
      if (ke) m.lompat(ke);
    } });
  /* Enam wajah dadu, tiga baris masing-masing, tujuh aksara per baris.
     Tanda "@" mewakili CHR$(2) — lambang wajah tersenyum CP437 yang dipakai
     sebagai mata dadu. Aksara kendali tidak ditulis langsung di berkas ini. */
  var MUKA = {
    5650: [' @ @ @ ', '       ', ' @ @ @ '],   /* enam  */
    5710: [' @   @ ', '   @   ', ' @   @ '],   /* lima  */
    5770: [' @   @ ', '      ',  ' @   @ '],   /* empat */
    5830: [' @     ', '   @   ', '     @ '],   /* tiga  */
    5890: [' @     ', '       ', '     @ '],   /* dua   */
    5950: ['       ', '   @   ', '       ']    /* satu  */
  };
  [[5620,5630,5640,5650,5660,5670], [5680,5690,5700,5710,5720,5730],
   [5740,5750,5760,5770,5780,5790], [5800,5810,5820,5830,5840,5850],
   [5860,5870,5880,5890,5900,5910], [5920,5930,5940,5950,5960,5970]]
    .forEach(function (b) {
      T(rem(b[0])); T(rem(b[1])); T(rem(b[2]));
      var muka = MUKA[b[3]];
      T(muka3(b[3], 1, muka[0]));
      T(muka3(b[4], 2, muka[1]));
      T(muka3(b[5], 3, muka[2], true));
    });
  T(rem(5980));
  T({ baris: 5990, jalan: function (m) { m.warna(7, 0); } });
  T({ baris: 6000, jalan: function (m) { m.locate(1, 1); } });
  T({ baris: 6010, jalan: function (m) { m.kembali(); } });

  /* --- 6020-6250: pilihan lawan komputer, dan dua pembantu ------------- */
  T(rem(6020)); T(rem(6030)); T(rem(6040));
  T({ baris: 6050, jalan: function (m) { m.locate(25, 1); } });
  T({ baris: 6060, bagian: [
      function (m) { m.cetak('DO YOU WISH TO PLAY AGAINST ME?  Y/N  '); },
      function (m) { m.gosub(2110); }
    ] });
  T({ baris: 6070, jalan: function (m) {
      m.v['Y$'] = m.inkey();
      if (m.v['Y$'] === '') m.lompat(6070); else m.bunyi();
    } });
  T({ baris: 6080, jalan: function (m) {
      if (m.v['Y$'] === 'N' || m.v['Y$'] === 'n') { m.v.CC = 0; m.kembali(); }
    } });
  T({ baris: 6090, jalan: function (m) {
      if (m.v['Y$'] === 'Y' || m.v['Y$'] === 'y') { m.v.CC = 1; m.kembali(); }
    } });
  T({ baris: 6100, jalan: function (m) { m.lompat(6050); } });
  T(rem(6110)); T(rem(6120)); T(rem(6130));
  T({ baris: 6140, jalan: function (m) { m.v.X = -1; } });
  T({ baris: 6150, jalan: function (m) { m.untuk('J', 0, 4, 1, 6180); } });
  T({ baris: 6160, jalan: function (m) {
      if (m.v['S()'][0][m.v.J] === m.v.I) m.v.X = m.v.J;
    } });
  T({ baris: 6170, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 6180, jalan: function (m) { m.kembali(); } });
  T(rem(6190)); T(rem(6200)); T(rem(6210));
  T({ baris: 6220, jalan: function (m) { m.untuk('J', 1, 5, 1, 6250); } });
  T({ baris: 6230, jalan: function (m) {
      m.v['K()'][m.v.I][m.v.A] += m.v['C()'][m.v.J];
    } });
  T({ baris: 6240, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 6250, jalan: function (m) { m.kembali(); } });

  /* --- 6260-6770: EMPAT PULUH BARIS DOKUMENTASI STRUKTUR DATA ---------- */
  for (var n = 6260; n <= 6770; n += 10) T(rem(n));

  /* --- 6780-6810: daftar prioritas komputer ---------------------------- */
  T(rem(6780));
  T({ baris: 6790, jalan: function (m) { m.ulangData(19); } });
  /* 6800 URUTAN YANG DIKEJAR KOMPUTER: runtun besar dulu, lalu full house,
     Yahtzee, empat sama — baru kotak atas, dan "chance" paling akhir. */
  T({ baris: 6800, jalan: function (m) {
      m.data([11, 9, 12, 8, 1, 2, 3, 4, 5, 6, 10, 7, 13]);
    } });
  T({ baris: 6810, jalan: function (m) {
      for (m.v.Y = 1; m.v.Y <= 13; m.v.Y++) m.v['M()'][m.v.Y] = m.baca();
      m.kembali();
    } });

  /* --- 6820-7110: papan nilai dan pembaca tombol ----------------------- */
  T(rem(6820));
  T({ baris: 6830, jalan: function (m) { m.cls(); } });
  T(cet(6840, kotak('             ╒═══╤═══╤═══╤═══╤═══╤═══╕')));
  [['ACES........1','1'],['TWOS........2','2'],['THREES......3','3'],
   ['FOURS.......4','4'],['FIVES.......5','5'],['SIXES.......6','6']]
    .forEach(function (b, i) {
      T(cet(6850 + i * 10, b[0] + kotak('│...│...│...│...│...│...│') + b[1]));
    });
  T(cet(6910, kotak('             ╞═══╪═══╪═══╪═══╪═══╪═══╡')));
  T(cet(6920, 'TOTAL UPPER..' + kotak('│...│...│...│...│...│...│')));
  T(cet(6930, kotak('             ╞═══╪═══╪═══╪═══╪═══╪═══╡')));
  [['3 OF A KIND.7','7'],['4 OF A KIND.8','8'],['FULL HOUSE..9','9'],
   ['SM STRAIGHT.A','A'],['LG STRAIGHT.B','B'],['YATZEE......C','C'],
   ['CHANCE......D','D']].forEach(function (b, i) {
      T(cet(6940 + i * 10, b[0] + kotak('│...│...│...│...│...│...│') + b[1]));
    });
  T(cet(7010, kotak('             ╞═══╪═══╪═══╪═══╪═══╪═══╡')));
  T(cet(7020, 'TOTAL LOWER..' + kotak('│...│...│...│...│...│...│')));
  T(cet(7030, 'TOP BONUS....' + kotak('│...│...│...│...│...│...│')));
  T(cet(7040, 'GRAND TOTAL..' + kotak('│...│...│...│...│...│...│')));
  T(cet(7050, kotak('             ╘═══╧═══╧═══╧═══╧═══╧═══╛')));
  T({ baris: 7060, jalan: function (m) {
      for (m.v.N = 1; m.v.N <= 5; m.v.N++) {
        m.locate(m.v.N * 4 - 2, 46); m.cetak(bas(m.v.N));
      }
    } });
  T({ baris: 7070, jalan: function (m) { m.kembali(); } });
  T({ baris: 7080, jalan: function (m) {
      m.locate(25, 1); m.cetak(' '.repeat(70)); m.locate(25, 1); m.kembali();
    } });
  T(rem(7090));
  /* 7100 `WHILE+ KB$=""` — tanda tambah nyasar yang sama persis dengan
     CRAZY8.BAS baris 1570, program yang penulisnya lain sama sekali.
     Dua berkas, dua penulis, satu kebiasaan mengetik yang sama. */
  T({ baris: 7100, jalan: function (m) {
      m.v['KB$'] = m.inkey();
      if (m.v['KB$'] === '') m.lompat(7100);
    } });
  T({ baris: 7110, jalan: function (m) {
      if (m.v['KB$'] === m.chr(27)) m.lompat(5100); else m.kembali();
    } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  /* --- pembantu -------------------------------------------------------- */
  function puncak(m) { return m.v['S()'][m.v['S()'][0][0]][0]; }
  function kedua(m) { return m.v['S()'][m.v['S()'][0][1]][0]; }
  function pet(n, baris, kolom, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function cek(n, uji, ke) {
    return { baris: n, jalan: function (m) { if (uji(m)) m.lompat(ke); } };
  }
  function runtun(n, a, b, ke) {
    return { baris: n, jalan: function (m) {
      var ok = true;
      for (var i = a; i <= b; i++) if (!(m.v['S()'][i][0] > 0)) ok = false;
      if (ok) m.lompat(ke);
    } };
  }
  /* `S(a,0) AND S(a+1,0) AND ... AND S(b,0)=1` — AND-nya operasi BIT, dan
     `=` mengikat lebih kuat, jadi suku terakhir bernilai -1 atau 0. */
  function besar(n, a, b, ke) {
    return { baris: n, jalan: function (m) {
      var h = m.v['S()'][a][0];
      for (var i = a + 1; i < b; i++) h = h & m.v['S()'][i][0];
      h = h & (m.v['S()'][b][0] === 1 ? -1 : 0);
      if (h) m.lompat(ke);
    } };
  }
  function atas(n1, n2, muka) {
    T({ baris: n1, jalan: function (m) { m.v.I = muka; } });
    return { baris: n2, jalan: function (m) {
      if (m.v['S()'][muka][0] > 2 && m.v['K()'][muka][m.v.A] === 0) {
        m.v['K()'][muka][m.v.A] = muka * m.v['S()'][muka][0];
        m.lompat(4000);
      }
    } };
  }
  function skor(n1, n2, n3, n4, barisLayar) {
    T({ baris: n1, jalan: function (m) {
        if (m.v['K()'][m.v.J][m.v.A] < 0) {
          m.locate(barisLayar(m), 4 * (m.v.A - 1) + 15);
          m.cetak('  0'); m.lompat(n3 + 10);
        }
      } });
    T({ baris: n2, jalan: function (m) {
        if (m.v['K()'][m.v.J][m.v.A] < 1) m.lompat(n3 + 10);
      } });
    T({ baris: n3, jalan: function (m) {
        m.locate(barisLayar(m), 4 * (m.v.A - 1) + 15);
        m.cetak(fmt3(m.v['K()'][m.v.J][m.v.A]));
      } });
    return { baris: n4, jalan: function (m) { m.lanjutkan('J'); } };
  }
  function total(n, barisLayar, kolomK) {
    return { baris: n, jalan: function (m) {
      m.locate(barisLayar, 4 * (m.v.A - 1) + 15);
      m.cetak(fmt3(m.v['K()'][kolomK][m.v.A])); m.barisBaru();
    } };
  }
  function hapus(n, ofs) {
    return { baris: n, jalan: function (m) {
      m.locate(4 * m.v.J + ofs, 50); m.cetak('       ');
    } };
  }
  function muka3(n, ofs, pola, akhir) {
    return { baris: n, jalan: function (m) {
      m.locate(4 * m.v.J + ofs, 50);
      m.cetak(pola.split('@').join(m.chr(2)));
      if (akhir) m.lompat(5980);
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['YAHTZEE'] = {
    nama: 'YAHTZEE',
    judul: 'Yahtzee (CCII 1979; dipindahkan Patrick Leabo ke PC)',
    sumber: 'YAHTZEE',
    berkas: 'run/YAHTZEE.BAS',
    tabel: tabel,
    data: [49, 51, 53, 54, 56, 61,
           '+++   THE WINNER   +++', ' SECOND PLACE', ' THIRD PLACE ',
           ' FOURTH PLACE ', ' FIFTH PLACE ', ' SIXTH PLACE ', ' DEAD LAST ',
           11, 9, 12, 8, 1, 2, 3, 4, 5, 6, 10, 7, 13],
    benih: 109,

    arsitektur: {
      judul: 'Alur YAHTZEE.BAS',
      simpul: [
        { id: 'siap', baris: '1060-1310', jenis: 'mulai',
          teks: ['Papan digambar; jumlah pemain', 'dan pilihan lawan komputer'] },
        { id: 'lempar', baris: '1460-1530',
          teks: ['Lima dadu diundi', 'dan digambar satu per satu'] },
        { id: 'indeks', baris: '2200-2380', jenis: 'subrutin',
          teks: ['S() dibangun: cacah, posisi,', 'lalu diurutkan menurut cacah'] },
        { id: 'pilihUlang', baris: '1570-1950', jenis: 'putusan',
          teks: ['Berapa dadu, lalu', 'yang mana saja'] },
        { id: 'nilai', baris: '2400-2750',
          teks: ['Tiga belas kotak,', 'semuanya dibaca dari S()'] },
        { id: 'komputer', baris: '2760-3990',
          teks: ['Daftar prioritas M(13);', 'kotak atas ditahan sampai lemparan 3'] },
        { id: 'papan', baris: '4000-4350',
          teks: ['Jumlah atas, bonus 35,', 'jumlah bawah, total'] },
        { id: 'menang', baris: '4780-5030', jenis: 'keluar',
          teks: ['Gelembung menurut total;', 'yang terakhir "DEAD LAST"'] }
      ],
      panah: [
        { dari: 'siap', ke: 'lempar' },
        { dari: 'lempar', ke: 'pilihUlang' },
        { dari: 'pilihUlang', ke: 'lempar', label: 'lempar lagi' },
        { dari: 'pilihUlang', ke: 'indeks', label: 'cukup' },
        { dari: 'lempar', ke: 'komputer', label: 'giliran IBM PC' },
        { dari: 'indeks', ke: 'nilai' },
        { dari: 'komputer', ke: 'indeks' },
        { dari: 'nilai', ke: 'papan' },
        { dari: 'komputer', ke: 'papan' },
        { dari: 'papan', ke: 'lempar', label: 'giliran berikutnya' },
        { dari: 'papan', ke: 'menang', label: '13 kotak penuh' }
      ]
    },

    pseudokode: [
      { baris: 2260, tingkat: 0, teks: '<code>S(nilai,0)</code> = <b>berapa dadu</b> yang menunjukkan nilai itu' },
      { baris: 2270, tingkat: 1, teks: '<code>S(nilai,1..5)</code> = <b>di posisi mana</b> saja dadunya' },
      { baris: 2330, tingkat: 0, teks: 'urut dengan <b>menyapu</b>: cacah 5 turun ke 1, nilai 6 turun ke 1' },
      { baris: 2360, tingkat: 1, teks: '&hellip;hasilnya <code>S(0,0)</code> = nilai yang paling banyak muncul' },
      { baris: 2520, tingkat: 0, teks: 'tiga sama? cukup <code>S(S(0,0),0) &gt;= 3</code>' },
      { baris: 2560, tingkat: 0, teks: 'full house? yang terbanyak tiga <b>dan</b> yang kedua dua' },
      { baris: 6530, tingkat: 0, teks: 'dan seluruhnya <b>digambar di komentar</b>, dengan contoh yang dikerjakan' },
      { baris: 6800, tingkat: 0, teks: 'prioritas komputer: runtun besar, full house, Yahtzee, empat sama&hellip;' },
      { baris: 2990, tingkat: 1, teks: '&hellip;dan kotak atas <b>ditahan</b> sampai lemparan ketiga' },
      { baris: 4680, tingkat: 0, teks: 'sebuah <code>RETURN</code> tunggal <b>mematikan layar nama penulis aslinya</b>' },
      { baris: 5600, tingkat: 0, teks: '<code>PLAY "N=TN(DIE);"</code> &mdash; variabel disulih <b>di dalam string musik</b>' }
    ],

    perintahAsli: 'run\\YAHTZEE.bat',
    catatanAsli: 'Satu sampai lima pemain, dan bisa melawan komputer. Kotak ' +
      '1-9 diketik dengan angka, kotak 10-13 dengan huruf A sampai D. ' +
      'Ketik "/" sebagai jumlah dadu untuk masuk ke bagian pemeriksa yang ' +
      'dijelaskan komentar 6710-6760.',

    penyimpangan: [
      '<b><code>PLAY</code> diam.</b> Baris 5600 memakai ' +
      '<code>PLAY "L32T200N=TN(DIE);"</code> &mdash; tanda sama dengan dan ' +
      'titik koma di dalam string musik <b>menyulih isi variabel</b>, jadi ' +
      'tiap angka dadu berbunyi nada yang berbeda.',

      '<b><code>RANDOMIZE</code> memasang benih tetap.</b>',

      '<b><code>LOAD "MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code>.</b>',

      '<b>Semua <code>DATA</code> dimuat di awal</b>, seperti yang dilakukan ' +
      'BASIC sungguhan &mdash; itu sebabnya baris 1090 bisa membaca DATA di ' +
      'baris 1150 yang belum dilewatinya.',

      '<b>Baris 4750 sudah disunting pemilik koleksi</b> (nomor telepon ' +
      'penulis aslinya di Coronado).'
    ],

    pelajaran: {
      ringkas: 'Satu larik yang mengindeks dadu menurut banyaknya, dan empat ' +
        'puluh baris komentar yang menggambar larik itu lengkap dengan contoh ' +
        '&mdash; satu-satunya program di koleksi ini yang menjelaskan ' +
        'struktur datanya sendiri.',
      pelajari: [
        ['Satu indeks yang membuat tiga belas aturan jadi mudah',
         'Yahtzee punya tiga belas cara menilai lima dadu, dan hampir semuanya ' +
         'butuh pertanyaan "berapa banyak dadu yang sama". Program ini ' +
         'menjawabnya sekali, di baris 2200-2380, lalu semua aturan tinggal ' +
         'membacanya.',
         '<code>S(nilai,0)</code> menghitung berapa dadu yang menunjukkan ' +
         'nilai itu. <code>S(nilai,1..5)</code> mencatat di posisi mana saja. ' +
         'Dan <code>S(0,urutan)</code> menyimpan nilai-nilai itu ' +
         '<b>diurutkan dari yang paling banyak</b>.',
         'Sesudah itu: tiga sama jadi <code>S(S(0,0),0)&gt;=3</code>. Full ' +
         'house jadi "yang terbanyak ada tiga dan yang kedua ada dua". Empat ' +
         'sama jadi satu perbandingan. Tiga belas aturan, satu larik.'],
        ['Mengurutkan dengan menyapu, bukan menukar',
         'Baris 2330-2380 tidak membandingkan apa pun. Gelung luarnya berjalan ' +
         'dari cacah lima turun ke satu; gelung dalamnya dari nilai enam turun ' +
         'ke satu. Yang cacahnya cocok dituliskan berurutan.',
         'Karena cacah dadu hanya bisa 1 sampai 5 dan nilainya 1 sampai 6, ' +
         'seluruh pengurutan selesai dalam tiga puluh langkah tetap &mdash; ' +
         'tanpa tukar, tanpa perbandingan, dan tanpa kemungkinan salah urut.'],
        ['Komputer yang menahan kotak mudah',
         'Baris 2990: <code>IF H&lt;3 THEN 3160</code>. Sebelum lemparan ' +
         'ketiga, komputer <b>menolak</b> mengisi kotak atas &mdash; ia ' +
         'menyimpan gilirannya untuk mencoba kombinasi besar dulu.',
         'Dan daftar prioritasnya (baris 6800) mengejar runtun besar, full ' +
         'house, Yahtzee, dan empat sama sebelum menyentuh angka satu sampai ' +
         'enam. "Chance" &mdash; yang selalu bisa diisi &mdash; ditaruh paling ' +
         'akhir.',
         'Baris 4400-4430 mencoret kotak yang sudah terisi dari daftar itu, ' +
         'kecuali kotak Yahtzee yang memang boleh diisi berulang.'],
        ['Variabel yang disulih di dalam string musik',
         '<code>5600 PLAY "L32T200N=TN(DIE);"</code>. Tanda sama dengan diikuti ' +
         'nama variabel dan titik koma adalah sintaks GW-BASIC untuk ' +
         '<b>menyisipkan nilai variabel</b> ke dalam string musik yang sedang ' +
         'dimainkan.',
         'Enam nada disimpan di <code>TN(6)</code> dari DATA baris 1150, dan ' +
         'tiap dadu berbunyi menurut angkanya. Pemainnya bisa mendengar ' +
         'lemparannya sebelum melihatnya.'],
        ['Satu perkalian yang berarti "giliran komputer"',
         '<code>IF A*CC=N THEN</code> muncul tiga kali. <code>CC</code> ' +
         'bernilai satu kalau komputer ikut bermain, dan komputer selalu ' +
         'pemain terakhir &mdash; jadi <code>A*CC=N</code> hanya benar kalau ' +
         'sekarang gilirannya.',
         'Dan kalau komputer tidak ikut, <code>CC=0</code> membuat ruas kiri ' +
         'selalu nol, yang tidak akan pernah sama dengan jumlah pemain. Satu ' +
         'ungkapan yang mengurus keberadaan <b>dan</b> giliran sekaligus.']
      ],
      hindari: [
        ['RETURN yang mematikan nama penulis aslinya',
         'Baris 1130 memanggil <code>GOSUB 4680</code>. Dan baris 4680 ' +
         'berbunyi: <code>RETURN</code>.',
         'Tepat di bawahnya, baris 4690 sampai 4770, ada layar sambutan yang ' +
         'lengkap: <i>"YATZEE.BAS VER 3.2 / 27 JUN 79 / DEVELOPED BY J.L. ' +
         'HELMS &amp; M.F. PEZOK / CORONADO, CA."</i>',
         'Layar itu <b>tidak pernah tampil</b>. Terukur di penelusur: baris ' +
         '4680 memang dijalankan, dan dari sembilan baris 4690&ndash;4770 ' +
         '<b>tidak satu pun</b> pernah tersentuh sepanjang permainan. Yang ' +
         'membacanya cuma orang yang membuka sumbernya.',
         'Kita tidak tahu kenapa &mdash; mungkin disengaja, mungkin sisa ' +
         'penyuntingan. Yang bisa dikatakan dari kodenya: nama pemindahnya ' +
         'ada di komentar baris 1030 dan tidak pernah tampil juga, sementara ' +
         'nama penulis aslinya ada di kode yang dimatikan. Keduanya sama-sama ' +
         'tidak terlihat pemainnya.',
         'Dan salah ketik di baris 4730 &mdash; <code>LOCATE,16,13</code>, ' +
         'dengan koma yang mengosongkan argumen pertama &mdash; membuktikan ' +
         'barisnya memang tidak pernah dijalankan siapa pun.'],
        ['AND yang bekerja karena kebetulan',
         'Baris 2630: <code>IF S(1,0)AND S(2,0)AND S(3,0)AND S(4,0)AND ' +
         'S(5,0)= 1 THEN</code>.',
         'Di BASIC, <code>AND</code> adalah operasi <b>bit</b>, dan ' +
         '<code>=</code> mengikat lebih kuat. Jadi yang dihitung: cacah dadu ' +
         '1 sampai 4 di-AND-kan sebagai bilangan, lalu hasilnya di-AND dengan ' +
         '&minus;1 atau 0 dari perbandingan <code>S(5,0)=1</code>.',
         'Hasilnya <b>kebetulan benar</b>: untuk lima dadu, satu-satunya cara ' +
         'keempat cacah itu bukan nol sambil cacah kelima tepat satu adalah ' +
         'runtun 1-2-3-4-5. Tapi alasannya sama sekali tidak terbaca dari ' +
         'barisnya, dan menambah satu dadu akan meruntuhkannya.',
         'Bandingkan dengan baris 2580 di atasnya, yang menguji hal serupa ' +
         'dengan <code>&gt;0</code> di tiap suku &mdash; jelas, dan tidak ' +
         'bergantung pada apa pun.'],
        ['Petunjuk yang menjanjikan lebih dari kodenya',
         'Baris 4500: <i>"FROM 1 TO 7 PLAYERS MAY PLAY AT THE SAME TIME"</i>. ' +
         'Baris 1210: <code>IF N&lt;1 OR N&gt;5 THEN 1180</code>. <b>Lima</b>, ' +
         'bukan tujuh.',
         'Baris 4600: <i>"IN ADDITION YOU WILL BE GIVEN AN EXTRA TURN AT THE ' +
         'END OF THE GAME"</i> untuk Yahtzee kedua. Tidak ada satu baris pun ' +
         'di berkas ini yang menambah giliran &mdash; yang ada cuma tambahan ' +
         '100 angka di baris 2690.',
         'Lariknya memang di-DIM untuk tujuh (<code>K(18,7)</code>, ' +
         '<code>A$(7)</code>), jadi janjinya bukan mengada-ada. Sesuatu ' +
         'dikurangi, dan petunjuknya tidak ikut diperbarui.'],
        ['Tanda banding yang ditulis terbalik',
         'Baris 5480: <code>IF X= &gt; N THEN A= 0</code>. Yang benar ' +
         '<code>&gt;=</code>. Persis kesalahan yang sama dengan ATTACK.BAS ' +
         'baris 1514 &mdash; dan GW-BASIC menerima keduanya tanpa bersuara.'],
        ['Plus yang tidak menambah apa-apa, di dua program sekaligus',
         'Baris 7100: <code>WHILE+ KB$=""</code>. Tanda tambah nyasar yang ' +
         'sama persis muncul di CRAZY8.BAS baris 1570, 2570, dan 2900 &mdash; ' +
         'program yang penulisnya lain sama sekali.',
         'Dua berkas, dua penulis, satu kebiasaan mengetik yang sama. ' +
         'Kemungkinan besar keduanya pernah lewat di alat yang sama, atau ' +
         'menyalin pola itu dari sumber yang sama.'],
        ['Baris DATA di tengah jalur utama',
         'Baris 1150 &mdash; <code>DATA 49,51,53,54,56,61</code> &mdash; duduk ' +
         'di antara <code>GOSUB 4450</code> dan <code>GOSUB 6820</code>, di ' +
         'tengah alur yang berjalan.',
         'Tidak ada yang rusak, karena BASIC melewati baris DATA saat ' +
         'menjalankan. Tapi siapa pun yang membaca alurnya harus tahu itu ' +
         'lebih dulu, dan tidak ada <code>REM</code> yang menyebutkannya.']
      ]
    },

    penjelasan: [
      { judul: 'Empat puluh baris komentar yang menggambar sebuah larik',
        isi: [
          'Di antara baris 6260 dan 6770, program ini berhenti melakukan apa ' +
          'pun dan mulai <b>menjelaskan dirinya sendiri</b>.',
          'Pertama daftar semua lariknya, satu per satu, dengan arti tiap ' +
          'kolom dan tiap baris:',
          '<code>6300 REM  K(18,7)  SCOREBOARD</code><br>' +
          '<code>6310 REM           COLUMNS 1-13 BOARD NUMBER</code><br>' +
          '<code>6320 REM           COLUMN    14 BONUS UPPER</code><br>' +
          '<code>6330 REM           COLUMN    15 TOTAL UPPER</code>',
          'Lalu &mdash; dan ini bagian yang tidak ada duanya di koleksi ini ' +
          '&mdash; sebuah <b>contoh yang dikerjakan sampai selesai</b>, ' +
          'lengkap dengan diagram:',
          '<code>6530 REM  SAMPLE S(Y,X) FOR DICE OF 5,2,4,6,4</code><br>' +
          '<code>6550 REM  Y/X   0  1  2  3  4  5</code><br>' +
          '<code>6560 REM  0     4  6  5  2          IN QTY/VALUE SEQUENCE</code><br>' +
          '<code>6570 REM  1                         NO DIE=1</code><br>' +
          '<code>6580 REM  2     1  2                1 TWO POSITION 2</code><br>' +
          '<code>6600 REM  4     2  3  5             2 FOURS POSITIONS 3 AND 5</code>',
          'Dan tiga baris terakhir menarik panah ke bagian-bagiannya:',
          '<code>6640 REM  +     +  ++++++++++++++++ SECTION FOR POSITION DATA</code><br>' +
          '<code>6650 REM  +     +------------------ COLUMN INDICATES QTY</code><br>' +
          '<code>6660 REM  +------------------------ INDEX EQUATES TO DIE VALUE</code>',
          'Dengan lemparan 5,2,4,6,4: ada dua angka empat, dan sisanya satu ' +
          'masing-masing. Jadi <code>S(0,·)</code> berisi 4, 6, 5, 2 &mdash; ' +
          'empat lebih dulu karena paling banyak, lalu sisanya dari nilai ' +
          'tertinggi. <code>S(4,·)</code> berisi 2 (banyaknya), lalu 3 dan 5 ' +
          '(posisinya di antara kelima dadu).',
          'Kenapa ini penting?',
          'Karena tanpa penjelasan itu, baris seperti ini tidak bisa dibaca ' +
          'siapa pun:',
          '<code>2560 IF S(S(0,0),0)&lt;&gt;3 OR S(S(0,1),0)&lt;&gt;2 THEN 2740</code>',
          'Dengan penjelasan itu, ia terbaca sebagai satu kalimat: <i>"kalau ' +
          'nilai yang paling banyak muncul tidak muncul tiga kali, atau nilai ' +
          'kedua terbanyak tidak muncul dua kali, ini bukan full house."</i>',
          'Enam puluh sembilan program lain di koleksi ini memakai larik yang ' +
          'sama rumitnya. Tidak satu pun menjelaskannya. Berkas ini menyediakan ' +
          'empat puluh baris &mdash; hampir tujuh persen dari seluruh ' +
          'programnya &mdash; untuk sesuatu yang tidak dijalankan mesin sama ' +
          'sekali.',
          'Di mesin 64K, empat puluh baris komentar adalah ruang yang nyata. ' +
          'Seseorang memutuskan itu sepadan.'
        ] },
      { judul: 'Coronado, 1979 — Tucson, sekitar 1982',
        isi: [
          'Empat baris komentar pertama menyimpan seluruh riwayat berkas ini:',
          '<code>1010 \' ORIGINAL BY JL HELMS &amp; MF PEZOK FOR CCII</code><br>' +
          '<code>1020 \' CORONADO, CA</code><br>' +
          '<code>1030 \' ADAPTED TO IBM PC BY PATRICK LEABO</code><br>' +
          '<code>1040 \' TUCSON, AZ</code>',
          'Dan nama Patrick Leabo dari Tucson muncul lagi di koleksi ini ' +
          '&mdash; di <a href="blackjck.html">BLACKJCK.BAS</a>, baris 1010: ' +
          '<i>"ADAPTED TO PC BY PATRICK LEABO--TUCSON"</i>. Program itu pun ' +
          'karya CCII, dari Januari 1978.',
          'Jadi paling tidak dua permainan dari klub komputer di Coronado, ' +
          'California, ditulis pada akhir 1970-an, dipindahkan ke IBM PC oleh ' +
          'orang yang sama di Arizona beberapa tahun kemudian, dan sampai ke ' +
          'disket yang sama.',
          'Bekas dua zaman itu terlihat, seperti di STARTREK.BAS. Yang lama: ' +
          'larik terkemas, penomoran baris kelipatan sepuluh, dan blok ' +
          'dokumentasi empat puluh baris. Yang baru: <code>PLAY</code> dengan ' +
          'penyulihan variabel, <code>COLOR</code>, dan aksara kotak CP437 ' +
          'untuk papan nilainya.',
          'Dan satu bekas lagi, yang paling sunyi. Baris 4680:',
          '<code>4680 RETURN</code>',
          'Satu kata, berdiri sendiri, tepat di depan layar yang menyebutkan ' +
          'J.L. Helms, M.F. Pezok, Coronado, dan tanggal 27 Juni 1979.',
          'Layar itu masih ada di berkasnya, utuh, delapan baris. Tapi ' +
          'panggilan di baris 1130 mendarat di <code>RETURN</code> itu dan ' +
          'langsung pulang.',
          'Empat puluh tahun kemudian, satu-satunya cara membaca nama mereka ' +
          'adalah membuka sumbernya &mdash; atau menelusurinya baris demi ' +
          'baris, seperti halaman ini.'
        ] }
    ]
  };
})(window);
