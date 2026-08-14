/* ===========================================================================
   BLACKJCK.js — porting minimalis BLACKJCK.BAS sebagai tabel baris.

       1000 REM  ** CCII BLACKJACK - JAN 3,78 - JESSEN **
       1010 REM ADAPTED TO PC BY PATRICK LEABO--TUCSON

   Tiga Januari 1978. IBM PC belum ada — ia baru keluar Agustus 1981. Program
   ini ditulis untuk mesin lain, entah apa, lalu dipindahkan orang kedua ke
   PC beberapa tahun kemudian. Dua nama, dua zaman, satu berkas.

   YANG PALING LAYAK DILIHAT: GAMBAR PIP DIBANGUN DENGAN JATUH-TEMBUS.

       2350 ON Q(X) GOTO 2540,2530,2520,2510,2490,2470,2460,2450,2440,...
       2440 T$(7)=U$:T$(27)=U$:GOTO 2460     ' sembilan
       2460 T$(17)=U$                        ' tujuh: tambah satu di tengah
       2470 T$(6)=U$:T$(8)=U$:T$(16)=U$:...  ' enam: pola dasar

   Sembilan tidak digambar dari nol. Ia dua pip tambahan, lalu MELOMPAT ke
   tujuh — yang menambah satu pip di tengah, lalu JATUH ke enam yang
   menggambar pola dasarnya. Tiap pangkat didefinisikan sebagai selisih dari
   pangkat di bawahnya.

   Kartunya sendiri adalah larik 35 string: sebuah kisi 5x7 yang diratakan,
   dicetak baris demi baris di 2670.

   DAN DUA BLACKJACK DI SATU KOLEKSI, DUA CARA MELACAK AS:
   BJ.BAS menyimpan sebelasnya DI DALAM angka totalnya (lihat halaman BJ).
   Berkas ini memakai penghitung terpisah `E(P)`, dan menurunkannya satu per
   satu dengan tiga baris yang sama, disalin di tiga tempat.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` diam; F10 tetap menyalakan dan mematikan bendera `SND`.
   - `POKE` ke `&HB000` (memori layar MONOKROM, bukan CGA) tidak ditiru;
     dua aksara pojok kanan bawah digambar langsung. Lihat catatan baris 3480.
   - `RANDOMIZE` memasang benih tetap.
   - Gelung tunda di 3610 habis seketika.
   - `LOAD "MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var PETA = { '╒': 213, '═': 205, '╤': 209, '╕': 184, '│': 179, '╘': 212,
               '╧': 207, '╞': 198, '╡': 181, '╬': 206 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  /* Baris 3120-3210: sebelas ejekan bandar, semuanya berujung ke 2990. */
  function ejek(n, teks) {
    return { baris: n, jalan: function (m) {
      m.cetak(teks); m.barisBaru(); m.lompat(2990);
    } };
  }
  /* Menaruh pip di kisi 5x7 yang diratakan. */
  function pip(n, tempat, lanjut) {
    return { baris: n, jalan: function (m) {
      for (var i = 0; i < tempat.length; i++) {
        m.v['T$()'][tempat[i]] = m.v['U$'];
      }
      if (lanjut) m.lompat(lanjut);
    } };
  }

  var tabel = [

    rem(1000), rem(1010), rem(1015),
    { baris: 1020, jalan: function (m) {
        m.warna(7, 0); m.cls(); m.kursor(0);
      } },
    /* 1025 F10 menyalakan dan mematikan bunyi — jebakan yang tetap aktif
       sepanjang permainan. */
    { baris: 1025, jalan: function (m) {
        m.v.SND = 1;
        m.pasangJebakan('kunci', 10, 3800);
      } },
    { baris: 1030, jalan: function (m) { m.semaiCampur(61); } },
    { baris: 1040, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(3440); },
        function (m) { m.v.Z7 = m.acak(); },
        function (m) { m.gosub(3250); },
        function (m) { m.v.Y = 1; m.warna(7, 0); }
      ] },
    { baris: 1050, jalan: function (m) {
        m.locate(7, 7); m.cetak('WELCOME TO...'); m.cetak('BLACKJACK!');
        m.barisBaru();
      } },
    /* 1060 `N` dan `X` diacak lalu tidak pernah dipakai lagi. Sisa dari
       versi 1978, kemungkinan besar. */
    { baris: 1060, jalan: function (m) {
        m.v.K = 0; m.v.W1 = 0; m.v.R = m.acak();
        m.v.N = Math.trunc(1945 * m.acak() + 1);
        m.v.X = Math.trunc(10 * m.acak());
      } },
    { baris: 1070, jalan: function (m) {
        m.dim('D()', 52); m.dim('E()', 5); m.dim('V()', 5); m.dim('T()', 5);
        m.dim('W()', 5); m.dim('T$()', 34); m.dim('Q()', 52);
      } },
    { baris: 1080, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 52; m.v.A++) m.v['D()'][m.v.A] = 0;
      } },
    /* 1090 nomor kartu 1..52 dipetakan ke pangkat 1..13, empat kali. Sisa
       bagi tidak dipakai — gelung bersarang yang menuliskannya langsung. */
    { baris: 1090, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 39; m.v.A += 13) {
          for (m.v.C = 1; m.v.C <= 13; m.v.C++) {
            m.v['Q()'][m.v.A + m.v.C] = m.v.C;
          }
        }
      } },
    /* 1100 `K` naik tiap tangan; ia menandai kartu yang SUDAH keluar di
       `D()`. Pengocokan cukup dengan menaikkan K, bukan mengacak larik. */
    { baris: 1100, jalan: function (m) {
        m.v.K = m.v.K + 1;
        for (m.v.P = 1; m.v.P <= 5; m.v.P++) {
          m.v['E()'][m.v.P] = 0; m.v['V()'][m.v.P] = 0; m.v['T()'][m.v.P] = 0;
        }
        m.v['V()'][3] = 1;
      } },
    { baris: 1110, bagian: [
        function (m) { m.locate(9, 2); },
        function (m) { m.gosub(3580); }
      ] },
    { baris: 1120, jalan: function (m) {
        m.locate(23, 54); m.cetak(m.ulang(26, 32)); m.barisBaru();
      } },
    { baris: 1130, jalan: function (m) {
        m.locate(21, 54); m.cetak(m.ulang(26, 32)); m.barisBaru();
      } },
    { baris: 1140, jalan: function (m) {
        m.locate(9, 3); m.cetak(m.ulang(50, 32)); m.barisBaru();
      } },
    { baris: 1150, bagian: [
        function (m) {
          m.locate(21, 54);
          if (m.v.W1 !== 0) m.lompat(1160);
        },
        function (m) { m.gosub(3110); }
      ] },
    { baris: 1160, bagian: [
        function (m) { if (!(m.v.W1 > 0)) m.lompat(1170); },
        function (m) { m.gosub(3090); }
      ] },
    { baris: 1170, bagian: [
        function (m) { if (!(m.v.W1 < 0)) m.lompat(1180); },
        function (m) { m.gosub(3100); }
      ] },
    { baris: 1180, bagian: [
        function (m) { m.gosub(3640); },
        function (m) {
          m.locate(22, 55); m.cetak('WAGER $                  ');
          m.barisBaru();
        }
      ] },
    { baris: 1190, bagian: [
        function (m) { m.locate(22, 62); },
        function (m) { m.masukan('W$', ''); },
        function (m) { m.v.P = 1; }
      ] },
    { baris: 1200, jalan: function (m) {
        if (m.v['W$'] === 'END' || m.v['W$'] === 'end') m.jalankan('MENU');
      } },
    { baris: 1210, jalan: function (m) {
        m.v.W = parseFloat(m.v['W$']) || 0; m.locate(1, 1);
      } },
    /* 1220 `THEN 1240:REM` — sebuah REM kosong menempel di ujung baris. */
    { baris: 1220, jalan: function (m) { if (m.v.W <= 500) m.lompat(1240); } },
    { baris: 1230, bagian: [
        function (m) {
          m.locate(23, 55); m.cetak('HOUSE LIMIT IS $500');
        },
        function (m) { m.gosub(3610); },
        function (m) { m.lompat(1110); }
      ] },
    { baris: 1240, jalan: function (m) { if (m.v.W > 0) m.lompat(1260); } },
    { baris: 1250, bagian: [
        function (m) { m.locate(23, 58); m.cetak('BE SERIOUS'); },
        function (m) { m.gosub(3220); },
        function (m) { m.lompat(1110); }
      ] },
    { baris: 1260, jalan: function (m) { if (m.v.W < 1) m.lompat(1290); } },
    { baris: 1270, jalan: function (m) { m.v.HP = (m.v.HP || 0) + 1; } },
    { baris: 1280, jalan: function (m) { m.lompat(1320); } },
    { baris: 1290, jalan: function (m) { m.locate(23, 58); } },
    { baris: 1300, jalan: function (m) { m.cetak('CHEAPSKATE'); } },
    { baris: 1310, bagian: [
        function (m) { m.gosub(3610); },
        function (m) { m.lompat(1110); }
      ] },
    /* 1320-1350 TARUHAN MENGADUK PENGACAK. Makin besar taruhan, makin banyak
       RND yang dibuang sebelum kartu dibagi — jadi hasilnya tidak bisa
       ditebak dari tangan sebelumnya. Di atas 250 dibagi sepuluh supaya tidak
       kelamaan. */
    { baris: 1320, jalan: function (m) { m.v.Q3 = m.v.W; } },
    { baris: 1330, jalan: function (m) { if (m.v.Q3 < 250) m.lompat(1350); } },
    { baris: 1340, jalan: function (m) { m.v.Q3 = Math.trunc(m.v.Q3 / 10); } },
    { baris: 1350, jalan: function (m) {
        for (m.v.A4 = 1; m.v.A4 <= m.v.Q3; m.v.A4++) m.v.X = m.acak();
        m.v['W()'][2] = m.v.W; m.v['W()'][3] = m.v.W;
        m.lompat(1380);
      } },
    /* 1360-1370 TIDAK BISA DICAPAI DARI MANA PUN. Baris 1350 berakhir dengan
       GOTO 1380, dan tidak ada satu pun lompatan ke 1360 atau 1370. Dua baris
       yang tidak akan pernah dijalankan sekali pun. */
    { baris: 1360, jalan: function (m) {
        m.v.TE = 0; m.v.NT = 0;
        m.locate(9, 14); m.cetak('*I AM RESHUFFLING*'); m.barisBaru();
        m.gosub(3220);
      } },
    { baris: 1370, bagian: [
        function (m) {
          m.locate(9, 2); m.cetak('HOUSE LIMIT IS $500'); m.barisBaru();
        },
        function (m) { m.gosub(3610); },
        function (m) { m.lompat(1110); }
      ] },
    { baris: 1380, bagian: [
        function (m) { m.v['E()'][5] = 1; },
        function (m) { m.gosub(3510); },
        function (m) { m.gosub(2090); },
        function (m) { if (m.v['E()'][1] === 0) m.lompat(1400); }
      ] },
    { baris: 1390, jalan: function (m) { m.v['V()'][4] = 1; } },
    { baris: 1400, bagian: [
        function (m) { m.v['V()'][5] = 1; m.v['E()'][5] = 2; },
        function (m) { m.gosub(3510); },
        function (m) { m.gosub(2090); },
        function (m) { m.v.M = m.v.X; m.v.P = 3; m.v['V()'][3] = 1; }
      ] },
    { baris: 1410, bagian: [
        function (m) { m.gosub(3510); },
        function (m) { m.gosub(2090); },
        function (m) { m.v.G = m.v.X; }
      ] },
    { baris: 1420, jalan: function (m) { m.gosub(3690); } },
    { baris: 1430, jalan: function (m) { m.v['V()'][3] = m.v['V()'][3] + 1; } },
    { baris: 1440, bagian: [
        function (m) { m.gosub(3510); },
        function (m) { m.gosub(2090); },
        function (m) { if (m.v['V()'][2] > 0) m.lompat(1670); }
      ] },
    { baris: 1450, jalan: function (m) { m.v.S = m.v.X; } },
    { baris: 1460, jalan: function (m) { if (m.v['V()'][3] > 2) m.lompat(1670); } },
    { baris: 1470, jalan: function (m) {
        if (m.v['T()'][m.v.P] < 21) m.lompat(1570);
      } },
    { baris: 1480, jalan: function (m) {
        if (m.v['E()'][m.v.P] < 2) m.lompat(1500);
      } },
    /* 1490 TURUNKAN SATU AS dari sebelas jadi satu. Tiga baris yang sama
       persis disalin ke 1690 dan 3040. */
    { baris: 1490, jalan: function (m) {
        m.v['E()'][m.v.P] = m.v['E()'][m.v.P] - 1;
        m.v['T()'][m.v.P] = m.v['T()'][m.v.P] - 10;
        m.lompat(1570);
      } },
    { baris: 1500, jalan: function (m) {
        m.locate(m.v.Y9 + 2, m.v.X9 + 8); m.cetak('*BLACKJACK*'); m.barisBaru();
      } },
    /* 1510 bandar yang mencela dirinya sendiri waktu pemain menang. */
    { baris: 1510, jalan: function (m) {
        m.locate(9, 10); m.cetak('I DEALT WRONG AGAIN!'); m.barisBaru();
      } },
    { baris: 1520, bagian: [
        function (m) {
          m.v['E()'][5] = 2; m.v.P = 1; m.v.X9 = 8; m.v.Y9 = 3; m.v.X = m.v.M;
        },
        function (m) { m.gosub(2280); }
      ] },
    { baris: 1530, jalan: function (m) { if (m.v['V()'][3] < 5) m.lompat(1550); } },
    { baris: 1540, jalan: function (m) {
        m.v.W1 = m.v.W1 + 2 * m.v.W; m.lompat(1560);
      } },
    { baris: 1550, jalan: function (m) { m.v.W1 = m.v.W1 + 1.5 * m.v.W; } },
    { baris: 1560, jalan: function (m) { m.lompat(3000); } },
    { baris: 1570, jalan: function (m) { if (m.v['V()'][4] === 0) m.lompat(1670); } },
    { baris: 1580, jalan: function (m) {
        m.locate(9, 15); m.spc(22); m.cetak(''); m.barisBaru();
      } },
    { baris: 1590, bagian: [
        function (m) { m.locate(9, 15); },
        function (m) { m.gosub(3640); },
        function (m) {
          m.cetak('INSURANCE '); m.warna(31, 0); m.cetak('?'); m.warna(7, 0);
        },
        function (m) { m.gosub(3660); },
        function (m) { m.barisBaru(); }
      ] },
    { baris: 1600, jalan: function (m) {
        m.locate(9, 3); m.cetak(m.ulang(50, 32)); m.barisBaru();
      } },
    { baris: 1610, jalan: function (m) {
        m.v['KS$'] = (m.v['I$'] || '').charAt(0);
        if (m.v['KS$'] !== 'Y' && m.v['KS$'] !== 'y') m.lompat(1670);
      } },
    { baris: 1620, jalan: function (m) { if (m.v['T()'][1] < 21) m.lompat(1650); } },
    /* 1630 asuransi menang: pemain dibayar `W`, tapi tulisannya bilang
       `W/2`. Lihat catatan cacat. */
    { baris: 1630, jalan: function (m) { m.v.W1 = m.v.W1 + m.v.W; m.barisBaru(); } },
    { baris: 1640, jalan: function (m) {
        m.locate(9, 8);
        m.cetak('YOU WIN $' + basic(m.v.W / 2) + ' ON INSURANCE');
        m.barisBaru(); m.lompat(1670);
      } },
    { baris: 1650, jalan: function (m) {
        m.v.W1 = m.v.W1 - m.v.W / 2; m.barisBaru();
      } },
    { baris: 1660, jalan: function (m) {
        m.locate(9, 8);
        m.cetak('YOU LOST $' + basic(m.v.W / 2) + ' ON INSURANCE');
        m.barisBaru();
      } },
    { baris: 1670, jalan: function (m) { if (m.v['T()'][1] < 21) m.lompat(1720); } },
    { baris: 1680, jalan: function (m) { if (m.v['E()'][1] < 2) m.lompat(1700); } },
    { baris: 1690, jalan: function (m) {
        m.v['E()'][1] = m.v['E()'][1] - 1;
        m.v['T()'][1] = m.v['T()'][1] - 10;
        m.lompat(1720);
      } },
    { baris: 1700, jalan: function (m) {
        m.locate(9, 22); m.cetak('**I HAVE BLACKJACK**'); m.barisBaru();
      } },
    { baris: 1710, bagian: [
        function (m) {
          m.v.X9 = 8; m.v.Y9 = 3; m.v['E()'][5] = 2; m.v.P = 1; m.v.X = m.v.M;
        },
        function (m) { m.gosub(2280); },
        function (m) { m.v.P = 3; m.lompat(2910); }
      ] },
    { baris: 1720, jalan: function (m) {
        if (m.v['T()'][m.v.P] <= 21) m.lompat(1780);
      } },
    { baris: 1730, jalan: function (m) {
        if (m.v['E()'][m.v.P] > 0) m.lompat(1770);
      } },
    { baris: 1740, jalan: function (m) {
        m.locate(9, 16); m.cetak('**YOU BUST**'); m.barisBaru();
      } },
    /* 1750 EJEKAN BANDAR DIPILIH DARI SISA BAGI LIMA total bust pemain.
       `C1` hanya disetel DI SINI — jadi kalau pemain tidak pernah bust,
       nilai yang dibaca baris 2860 dan 2930 adalah sisa tangan sebelumnya. */
    { baris: 1750, bagian: [
        function (m) { m.gosub(3560); },
        function (m) {
          var t = m.v['T()'][m.v.P];
          m.v.C1 = t - 5 * Math.trunc(t / 5);
          if (m.v['V()'][2] === 1) m.lompat(1990);
        }
      ] },
    { baris: 1760, jalan: function (m) { m.lompat(2690); } },
    { baris: 1770, jalan: function (m) {
        m.v['E()'][m.v.P] = m.v['E()'][m.v.P] - 1;
        m.v['T()'][m.v.P] = m.v['T()'][m.v.P] - 10;
      } },
    { baris: 1780, jalan: function (m) { if (m.v['V()'][1] === 2) m.lompat(1750); } },
    { baris: 1790, jalan: function (m) { if (m.v['V()'][3] > 4) m.lompat(1810); } },
    { baris: 1800, jalan: function (m) { m.lompat(1820); } },
    /* 1810 LIMA KARTU TANPA BUST = menang otomatis. Aturan lama yang jarang
       dipakai kasino sekarang. */
    { baris: 1810, jalan: function (m) {
        if (m.v['T()'][m.v.P] < 21) m.lompat(3230);
      } },
    { baris: 1820, bagian: [
        function (m) { m.locate(m.v.Y9 + 2, m.v.X9 + 8); },
        function (m) { m.gosub(3640); },
        function (m) { m.warna(31, 0); m.cetak('PLAY '); m.warna(7, 0); },
        function (m) { m.gosub(3660); }
      ] },
    { baris: 1830, jalan: function (m) { m.v['V()'][1] = 0; } },
    pilih(1840, ['H', 'h'], 1), pilih(1850, ['D', 'd'], 2),
    pilih(1860, ['S', 's'], 3),
    { baris: 1865, jalan: function (m) {
        if (m.v['KS$'] !== '0') { m.bunyi(); m.lompat(1820); }
      } },
    { baris: 1870, jalan: function (m) {
        m.locate(m.v.Y9 + 2, m.v.X9 + 8); m.cetak('      '); m.barisBaru();
      } },
    { baris: 1880, jalan: function (m) { if (m.v['V()'][1] < 3) m.lompat(2030); } },
    { baris: 1890, jalan: function (m) { if (m.v['V()'][2] > 0) m.lompat(2020); } },
    { baris: 1900, jalan: function (m) { if (m.v['V()'][3] > 2) m.lompat(2020); } },
    { baris: 1910, jalan: function (m) {
        if (m.v['Q()'][m.v.G] === m.v['Q()'][m.v.S]) m.lompat(1940);
      } },
    { baris: 1920, bagian: [
        function (m) {
          m.locate(9, 22); m.cetak("THAT'S NO PAIR"); m.barisBaru();
        },
        function (m) { m.gosub(3610); }
      ] },
    { baris: 1930, jalan: function (m) {
        m.locate(9, 22); m.cetak('                        '); m.barisBaru();
        m.lompat(1820);
      } },
    { baris: 1940, jalan: function (m) {
        m.v['V()'][2] = 1;
        if (m.v['Q()'][m.v.G] < 1) m.lompat(1960);
      } },
    { baris: 1950, jalan: function (m) { m.v['V()'][1] = 0; } },
    { baris: 1960, bagian: [
        function (m) {
          m.v['T()'][3] = 0; m.v['T()'][2] = 0; m.v.P = 2;
          m.v.X9 = 2; m.v.Y9 = 19;
        },
        function (m) { m.gosub(3550); }
      ] },
    { baris: 1970, bagian: [
        function (m) { m.v.X = m.v.S; },
        function (m) { m.gosub(2280); },
        function (m) { m.gosub(1980); },
        function (m) { m.v.P = 3; m.v['W()'][3] = m.v.W; m.v.X = m.v.G; },
        function (m) { m.gosub(1980); },
        function (m) { m.lompat(1440); }
      ] },
    { baris: 1980, bagian: [
        function (m) { m.gosub(2230); },
        function (m) {
          m.v['V()'][3] = 2; m.v['T()'][m.v.P] = m.v.C; m.kembali();
        }
      ] },
    { baris: 1990, jalan: function (m) {
        m.v.P = 2; m.v['V()'][2] = 2; m.v['V()'][3] = 2;
        if (m.v['Q()'][m.v.G] < 1) m.lompat(2010);
      } },
    { baris: 2000, jalan: function (m) { m.v['V()'][1] = 0; } },
    { baris: 2010, jalan: function (m) { m.lompat(1440); } },
    { baris: 2020, bagian: [
        function (m) {
          m.locate(9, 22); m.cetak('NO SPLITS NOW     '); m.barisBaru();
        },
        function (m) { m.gosub(3610); },
        function (m) {
          m.locate(9, 22); m.cetak('               '); m.barisBaru();
          m.lompat(1820);
        }
      ] },
    { baris: 2030, jalan: function (m) { if (m.v['V()'][1] < 2) m.lompat(2070); } },
    { baris: 2040, jalan: function (m) { if (m.v['V()'][3] === 2) m.lompat(2060); } },
    { baris: 2050, bagian: [
        function (m) {
          m.locate(9, 22); m.cetak('TOO LATE TO DOUBLE'); m.barisBaru();
        },
        function (m) { m.gosub(3610); },
        function (m) {
          m.locate(9, 22); m.cetak('                      '); m.barisBaru();
          m.lompat(1820);
        }
      ] },
    { baris: 2060, jalan: function (m) {
        m.v['W()'][m.v.P] = 2 * m.v['W()'][m.v.P];
      } },
    { baris: 2070, jalan: function (m) { if (m.v['V()'][1] > 0) m.lompat(1430); } },
    { baris: 2080, jalan: function (m) { m.lompat(1750); } },

    /* --- 2090-2270: ambil kartu, tandai terpakai, hitung nilainya --------- */
    { baris: 2090, bagian: [
        function (m) { m.gosub(2120); },
        function (m) {
          m.v['T()'][m.v.P] = m.v['T()'][m.v.P] + m.v.C;
          if (m.v['V()'][5] === 0) m.lompat(2110);
        }
      ] },
    { baris: 2100, jalan: function (m) { m.v['V()'][5] = 0; m.kembali(); } },
    { baris: 2110, bagian: [
        function (m) { m.gosub(2280); },
        function (m) { m.kembali(); }
      ] },
    /* 2120-2220 KARTU DIAMBIL DENGAN COBA-COBA: pilih nomor acak, kalau
       sudah terpakai coba lagi. `R` menghitung kegagalan berturut-turut —
       lima puluh gagal berarti deknya hampir habis, dan waktunya mengocok. */
    { baris: 2120, jalan: function (m) { if (m.v.R >= 50) m.lompat(2170); } },
    { baris: 2130, jalan: function (m) {
        m.v.X = Math.trunc(53 * m.acak());
      } },
    { baris: 2140, jalan: function (m) { if (m.v.X === 0) m.lompat(2130); } },
    { baris: 2150, jalan: function (m) {
        if (m.v['D()'][m.v.X] === 0) m.lompat(2210);
      } },
    { baris: 2160, jalan: function (m) {
        m.v.R = m.v.R + 1;
        if (m.v.R < 50) m.lompat(2120);
      } },
    /* 2170-2190 mengocok = MENGOSONGKAN penanda, kecuali kartu yang keluar
       di tangan ini (`D(A)=K`). Tidak ada larik yang diaduk. */
    { baris: 2170, bagian: [
        function (m) { m.untuk('A', 1, 52, 1, 2200); },
        function (m) {
          if (m.v['D()'][m.v.A] === m.v.K) m.lompat(2190);
        }
      ] },
    { baris: 2180, jalan: function (m) { m.v['D()'][m.v.A] = 0; } },
    { baris: 2190, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2200, bagian: [
        function (m) {
          m.v.TE = 0; m.v.NT = 0; m.v.R = 0;
          m.locate(9, 18); m.cetak('*I RESHUFFLED*'); m.barisBaru();
        },
        function (m) { m.gosub(3610); },
        function (m) {
          m.locate(9, 18); m.cetak('                 '); m.barisBaru();
          m.lompat(2120);
        }
      ] },
    { baris: 2210, jalan: function (m) { m.v.R = 0; } },
    { baris: 2220, jalan: function (m) { m.v['D()'][m.v.X] = m.v.K; } },
    { baris: 2230, jalan: function (m) {
        if (m.v['Q()'][m.v.X] > 1) m.lompat(2250);
      } },
    /* 2240 As selalu dihitung SEBELAS dulu, dan `E(P)` mencatat berapa
       banyak yang masih bisa diturunkan. */
    { baris: 2240, jalan: function (m) {
        m.v.C = 11;
        m.v['E()'][m.v.P] = m.v['E()'][m.v.P] + 1;
        m.kembali();
      } },
    { baris: 2250, jalan: function (m) {
        if (m.v['Q()'][m.v.X] > 10) m.lompat(2270);
      } },
    { baris: 2260, jalan: function (m) { m.v.C = m.v['Q()'][m.v.X]; m.kembali(); } },
    { baris: 2270, jalan: function (m) { m.v.C = 10; m.kembali(); } },
    /* 2280 subrutin yang isinya cuma memanggil subrutin lain lalu pulang. */
    { baris: 2280, bagian: [
        function (m) { m.gosub(2290); },
        function (m) { m.kembali(); }
      ] },

    /* --- 2290-2680: menggambar satu kartu -------------------------------- */
    { baris: 2290, jalan: function (m) {
        for (m.v.I = 0; m.v.I <= 34; m.v.I++) m.v['T$()'][m.v.I] = ' ';
      } },
    /* 2300-2330 lambang dipilih dari SELANG nomor kartu: 1-13 sekop,
       14-26 wajik, 27-39 hati, 40-52 keriting. */
    { baris: 2300, jalan: function (m) {
        if (m.v.X > 39) { m.v['U$'] = m.chr(5); m.lompat(2340); }
      } },
    { baris: 2310, jalan: function (m) {
        if (m.v.X > 26) { m.v['U$'] = m.chr(3); m.lompat(2340); }
      } },
    { baris: 2320, jalan: function (m) {
        if (m.v.X > 13) { m.v['U$'] = m.chr(4); m.lompat(2340); }
      } },
    { baris: 2330, jalan: function (m) { m.v['U$'] = m.chr(6); } },
    { baris: 2340, jalan: function (m) { m.warna(0, 7); } },
    /* 2350 DUA BELAS SASARAN UNTUK TIGA BELAS PANGKAT. Q=13 (King) tidak
       punya entri, jadi ia JATUH ke baris 2360 di bawahnya. Baris berikutnya
       adalah cabang default yang tidak pernah ditulis sebagai cabang. */
    { baris: 2350, jalan: function (m) {
        var ke = [2540, 2530, 2520, 2510, 2490, 2470, 2460, 2450, 2440,
                  2420, 2380, 2370][m.v['Q()'][m.v.X] - 1];
        if (ke) m.lompat(ke);
      } },
    { baris: 2360, jalan: function (m) { m.v['T$()'][17] = 'K'; m.lompat(2390); } },
    { baris: 2370, jalan: function (m) { m.v['T$()'][17] = 'Q'; m.lompat(2390); } },
    { baris: 2380, jalan: function (m) { m.v['T$()'][17] = 'J'; } },
    pip(2390, [8, 7, 6, 11, 16]),
    pip(2400, [21, 26, 27, 28, 23]),
    pip(2410, [18, 13], 2550),
    /* 2420 SEPULUH = enam pip, lalu MELOMPAT ke empat. Lihat catatan kepala. */
    pip(2420, [6, 8, 16, 18, 26]),
    pip(2430, [28], 2510),
    /* 2440 SEMBILAN = dua pip, lalu tujuh (yang sendirinya enam + satu). */
    pip(2440, [7, 27], 2460),
    /* 2450 DELAPAN = dua pip, lalu enam. */
    pip(2450, [12, 22], 2470),
    /* 2460 TUJUH = satu pip di tengah, lalu JATUH ke enam di bawahnya. */
    pip(2460, [17]),
    pip(2470, [6, 8, 16, 18, 26]),
    pip(2480, [28], 2550),
    pip(2490, [6, 8, 17, 26, 28]),
    { baris: 2500, jalan: function (m) { m.lompat(2550); } },
    pip(2510, [11, 13, 21, 23], 2550),
    pip(2520, [7, 17, 27], 2550),
    pip(2530, [12, 22], 2550),
    pip(2540, [17]),
    { baris: 2550, jalan: function (m) {
        var q = m.v['Q()'][m.v.X];
        if (q > 1 && q < 11) m.v['T$'] = String(q).slice(-1);
      } },
    huruf(2560, 11, 'J'), huruf(2570, 12, 'Q'),
    huruf(2580, 13, 'K'), huruf(2590, 1, 'A'),
    /* 2600 `T$=T$` — MENUGASKAN SEBUAH VARIABEL KE DIRINYA SENDIRI, dengan
       syarat yang persis memilih wajik dan hati: nomor 14 sampai 39. Itu
       kartu MERAH. Yang tersisa di sini adalah kerangka sebuah baris pewarna
       yang isinya sudah dicabut. */
    { baris: 2600, jalan: function (m) {
        if (m.v.X > 13 && m.v.X < 40) m.v['T$'] = m.v['T$'];
      } },
    { baris: 2610, jalan: function (m) {
        if (m.v['Q()'][m.v.X] !== 10) m.lompat(2640);
      } },
    /* 2620-2630 sepuluh butuh DUA aksara di pojok, jadi ia satu-satunya
       pangkat yang memakai T$(1) dan T$(33). */
    { baris: 2620, jalan: function (m) {
        m.v['T$'] = m.v['U$'].charAt(0);
        m.v['M$'] = '0'; m.v['N$'] = '1';
      } },
    { baris: 2630, jalan: function (m) {
        m.v['T$()'][0] = m.v['N$']; m.v['T$()'][1] = m.v['M$'];
        m.v['T$()'][33] = m.v['T$()'][0]; m.v['T$()'][34] = m.v['T$()'][1];
        m.lompat(2650);
      } },
    { baris: 2640, jalan: function (m) {
        m.v['T$()'][0] = m.v['T$']; m.v['T$()'][34] = m.v['T$'];
      } },
    /* 2650 `REM GOSUB 64000` — panggilan ke nomor baris yang TIDAK ADA di
       berkas ini, sudah dijadikan komentar. Sisa dari versi 1978, waktu ada
       sesuatu di 64000 yang tidak ikut pindah ke PC. */
    { baris: 2650, jalan: function (m) {
        m.v.Z9 = m.v.Y9 + 5; m.v.X1 = m.v.X9; m.v.Y1 = m.v.Y9;
      } },
    { baris: 2660, jalan: function (m) {
        m.v.NT = (m.v.NT || 0) + 1;
        if (m.v['Q()'][m.v.X] > 9) m.v.TE = (m.v.TE || 0) + 1;
      } },
    /* 2670 KISI 5x7 YANG DIRATAKAN dicetak terbalik: I turun dari 30 ke 0,
       dan barisnya Z9-I/5 — jadi indeks besar ada di ATAS. */
    { baris: 2670, jalan: function (m) {
        for (m.v.I = 0; m.v.I <= 30; m.v.I += 5) {
          m.locate(m.v.Z9 - m.v.I / 5, m.v.X9 + 2);
          for (m.v.J = 0; m.v.J <= 4; m.v.J++) {
            m.cetak(m.v['T$()'][m.v.I + m.v.J] || ' ');
          }
        }
      } },
    { baris: 2680, jalan: function (m) { m.warna(7, 0); m.kembali(); } },

    /* --- 2690-3050: giliran bandar dan pembayaran ------------------------- */
    { baris: 2690, bagian: [
        function (m) {
          m.v.P = 3; m.v.X = m.v.M; m.v.X9 = 8; m.v.Y9 = 3;
        },
        function (m) { m.gosub(2290); }
      ] },
    { baris: 2700, jalan: function (m) { if (m.v['T()'][3] < 22) m.lompat(2730); } },
    /* 2710-2720 dua baris yang berujung ke tempat yang SAMA. Percabangan
       yang tidak bercabang. */
    { baris: 2710, jalan: function (m) {
        if (m.v['V()'][2] === 0) m.lompat(2910);
      } },
    { baris: 2720, jalan: function (m) { m.lompat(2910); } },
    { baris: 2730, jalan: function (m) { m.v.P = 1; } },
    { baris: 2740, jalan: function (m) { if (m.v['T()'][1] < 17) m.lompat(3020); } },
    { baris: 2750, jalan: function (m) { if (m.v['T()'][1] > 17) m.lompat(2770); } },
    /* 2760 BANDAR MENARIK DI SOFT 17 — tujuh belas dengan As dihitung
       sebelas. Aturan yang menguntungkan rumah, dan di sini cuma satu baris. */
    { baris: 2760, jalan: function (m) { if (m.v['E()'][1] > 0) m.lompat(3020); } },
    { baris: 2770, jalan: function (m) { if (m.v['T()'][1] > 21) m.lompat(3030); } },
    { baris: 2780, jalan: function (m) { m.v.P = 3; } },
    { baris: 2790, jalan: function (m) {
        m.locate(5, m.v.X9 + 7); m.cetak('TOTAL'); m.barisBaru();
        m.locate(7, m.v.X9 + 7); m.cetak(basic(m.v['T()'][1]));
      } },
    { baris: 2800, jalan: function (m) { if (m.v['T()'][m.v.P] > 21) m.lompat(2840); } },
    { baris: 2810, jalan: function (m) { if (m.v['T()'][1] > 21) m.lompat(2840); } },
    { baris: 2820, jalan: function (m) {
        if (m.v['T()'][1] > m.v['T()'][m.v.P]) m.lompat(2910);
      } },
    { baris: 2830, jalan: function (m) {
        if (m.v['T()'][1] === m.v['T()'][m.v.P]) m.lompat(2980);
      } },
    { baris: 2840, jalan: function (m) {
        m.v.W1 = m.v.W1 + m.v['W()'][m.v.P];
        m.barisBaru(); m.locate(9, 2);
      } },
    { baris: 2850, jalan: function (m) {
        for (m.v.J = 1; m.v.J <= 50; m.v.J++) m.cetak(' ');
        m.barisBaru(); m.locate(9, 12);
      } },
    tangga(2860, 3, 3120), tangga(2870, 2, 3130), tangga(2880, 1, 3140),
    tangga(2890, 0, 3150),
    { baris: 2900, jalan: function (m) { m.lompat(3160); } },
    { baris: 2910, jalan: function (m) {
        m.v.W1 = m.v.W1 - m.v['W()'][m.v.P];
        m.barisBaru(); m.locate(9, 2);
      } },
    { baris: 2920, jalan: function (m) {
        for (m.v.J = 1; m.v.J <= 50; m.v.J++) m.cetak(' ');
        m.barisBaru(); m.locate(9, 12);
      } },
    tangga(2930, 3, 3170), tangga(2940, 2, 3180), tangga(2950, 1, 3190),
    tangga(2960, 0, 3200),
    { baris: 2970, jalan: function (m) { m.lompat(3210); } },
    { baris: 2980, jalan: function (m) {
        m.locate(9, 24); m.cetak('WE PUSH'); m.barisBaru();
      } },
    { baris: 2990, jalan: function (m) { if (m.v['V()'][2] > 0) m.lompat(3010); } },
    { baris: 3000, bagian: [
        function (m) { m.gosub(3060); },
        function (m) { m.gosub(3610); },
        function (m) { m.lompat(1100); }
      ] },
    { baris: 3010, jalan: function (m) {
        m.v.P = 3; m.v['V()'][2] = 0; m.lompat(2800);
      } },
    { baris: 3020, bagian: [
        function (m) { m.v['E()'][5] = m.v['E()'][5] + 1; m.v.P = 1; },
        function (m) { m.gosub(3510); },
        function (m) { m.gosub(2090); },
        function (m) { m.lompat(2730); }
      ] },
    { baris: 3030, jalan: function (m) { if (m.v['E()'][1] === 0) m.lompat(3050); } },
    { baris: 3040, jalan: function (m) {
        m.v['E()'][1] = m.v['E()'][1] - 1;
        m.v['T()'][1] = m.v['T()'][1] - 10;
        m.lompat(2730);
      } },
    { baris: 3050, jalan: function (m) {
        m.locate(6, m.v.X9 + 13); m.cetak('*I BUST*'); m.barisBaru();
        m.lompat(2780);
      } },
    { baris: 3060, jalan: function (m) { m.locate(9, 25); m.kembali(); } },
    /* 3070-3080 TIDAK BISA DICAPAI: baris 1150-1170 memanggil 3090, 3100,
       dan 3110 langsung, tidak pernah 3070. Dua baris pemilah yang sudah
       digantikan tiga IF di tempat pemanggilnya. */
    { baris: 3070, jalan: function (m) { if (m.v.W1 < 0) m.lompat(3100); } },
    { baris: 3080, jalan: function (m) { if (m.v.W1 === 0) m.lompat(3110); } },
    { baris: 3090, jalan: function (m) {
        m.cetak("YOU'RE AHEAD $" + basic(m.v.W1)); m.kembali();
      } },
    { baris: 3100, jalan: function (m) {
        m.cetak("YOU'RE BEHIND $" + basic(-m.v.W1)); m.kembali();
      } },
    { baris: 3110, jalan: function (m) {
        m.cetak("YOU'RE EVEN           "); m.kembali();
      } },
    ejek(3120, 'I MUST HAVE DEALT WRONG'),
    ejek(3130, "YOU'RE LUCKY AGAIN"),
    ejek(3140, 'YOU MUST HAVE BEEN PEEKING'),
    ejek(3150, 'I COULD LOSE MY JOB THIS WAY'),
    ejek(3160, 'THE CARDS HAVE TURNED AGAINST ME'),
    ejek(3170, '*THE BOTTOM OF THE DECK STRIKES AGAIN*'),
    ejek(3180, 'A VICTORY FOR US GOOD GUYS'),
    ejek(3190, "YOU CAN'T BEAT SKILL"),
    ejek(3200, "YOU CAN'T WIN THEM ALL"),
    ejek(3210, 'THANKS!'),
    { baris: 3220, jalan: function (m) {
        for (m.v.M9 = 1; m.v.M9 <= 52; m.v.M9++) m.v['D()'][m.v.M9] = 0;
        m.v.R = 0; m.kembali();
      } },
    { baris: 3230, jalan: function (m) {
        m.locate(9, 12); m.cetak('*YOU WIN WITH 5 CARDS*'); m.barisBaru();
        m.barisBaru(); m.lompat(1520);
      } },

    /* --- 3240-3420: panel petunjuk di sebelah kanan ----------------------- */
    rem(3240),
    { baris: 3250, jalan: function (m) { m.warna(0, 7); } },
    { baris: 3260, jalan: function (m) {
        for (m.v.N = 2; m.v.N <= 18; m.v.N++) {
          m.locate(m.v.N, 54); m.cetak(m.ulang(26, 32)); m.barisBaru();
        }
      } },
    pet(3270, 2, 58, 'IBM PC BLACKJACK'),
    pet(3280, 3, 60, '************'),
    pet(3290, 4, 55, 'FOLLOW ALL BETS WITH'),
    pet(3300, 5, 60, 'RETURN KEY'),
    pet(3310, 7, 55, 'RESPONSES:'),
    { baris: 3320, jalan: function (m) {
        m.locate(8, 57); m.cetak('<CR> = STAND'); m.barisBaru();
        m.locate(9, 60); m.cetak('H = HIT'); m.barisBaru();
      } },
    { baris: 3330, jalan: function (m) {
        m.locate(10, 60); m.cetak('D = DOUBLE DOWN'); m.barisBaru();
        m.locate(11, 60); m.cetak('S = SPLIT PAIR'); m.barisBaru();
      } },
    pet(3340, 12, 58, 'INSURANCE:'),
    { baris: 3350, jalan: function (m) {
        m.locate(13, 60); m.cetak('N = NO'); m.barisBaru();
        m.locate(14, 60); m.cetak('Y = YES'); m.barisBaru();
      } },
    pet(3360, 15, 63, 'RULES:'),
    pet(3370, 16, 54, 'HOUSE LIMIT IS $500.00'),
    pet(3380, 17, 54, 'BLACKJACK PAYS 1.5 TO 1'),
    { baris: 3390, jalan: function (m) {
        m.locate(18, 54); m.cetak('BET END TO QUIT'); m.warna(7, 0);
      } },
    /* 3400 GELUNG YANG BATASNYA MEMAKAI PENCACAHNYA SENDIRI:
       `FOR YP=1 TO YP+LEN(ME$)`. Lihat catatan cacat. */
    { baris: 3400, jalan: function (m) {
        m.v['ME$'] = 'HOUSE';
        m.v.YP = 1;
        var batas = m.v.YP + m.v['ME$'].length;
        for (; m.v.YP <= batas; m.v.YP++) {
          m.locate(m.v.YP + 1, 2);
          m.cetak(m.v['ME$'].charAt(m.v.YP - 1) || ' '); m.barisBaru();
        }
      } },
    { baris: 3410, jalan: function (m) {
        m.v['ME$'] = 'PLAYER';
        m.v.YP = 1;
        var batas = m.v.YP + m.v['ME$'].length;
        for (; m.v.YP <= batas; m.v.YP++) {
          m.locate(m.v.YP + 9, 2);
          m.cetak(m.v['ME$'].charAt(m.v.YP - 1) || ' '); m.barisBaru();
        }
      } },
    { baris: 3420, jalan: function (m) { m.kembali(); } },

    /* --- 3430-3500: menggambar meja -------------------------------------- */
    rem(3430),
    { baris: 3440, jalan: function (m) {
        m.locate(1, 1);
        m.cetak(keBita('╒') + m.ulang(51, 205) + keBita('╤') +
                m.ulang(26, 205) + keBita('╕'));
      } },
    { baris: 3450, jalan: function (m) {
        m.locate(2, 1);
        for (m.v.N = 1; m.v.N <= 22; m.v.N++) {
          m.cetak(keBita('│')); m.tab(53); m.cetak(keBita('│'));
          m.tab(80); m.cetak(keBita('│'));
        }
      } },
    { baris: 3460, jalan: function (m) {
        m.locate(24, 1); m.cetak(keBita('│'));
        m.locate(24, 53); m.cetak(keBita('│'));
      } },
    { baris: 3470, jalan: function (m) {
        m.locate(25, 1);
        m.cetak(keBita('╘') + m.ulang(51, 205) + keBita('╧') + m.ulang(26, 205));
      } },
    /* 3480 DUA AKSARA YANG TIDAK BISA DICETAK. Sel 3998 dan 3838 di memori
       layar adalah pojok kanan bawah baris 25 dan 24 — dan MENCETAK di sana
       akan MENGGULIRKAN layar. Satu-satunya cara mengisinya adalah menulis
       langsung ke memorinya.
       Yang menarik: alamatnya &HB000 — memori layar MONOKROM (MDA), bukan
       &HB800 milik CGA. Di mesin CGA, kedua poke ini tidak terlihat sama
       sekali, dan pojok mejanya tetap bolong. */
    { baris: 3480, jalan: function (m) {
        m.pokeLayar(25, 80, 190); m.pokeLayar(24, 80, 179);
      } },
    { baris: 3490, jalan: function (m) {
        m.locate(19, 53);
        m.cetak(keBita('╞') + m.ulang(26, 205) + keBita('╡'));
      } },
    { baris: 3500, jalan: function (m) { m.locate(1, 1); m.kembali(); } },

    /* --- 3510-3730: tempat kartu, jeda, tombol, punggung kartu ------------ */
    { baris: 3510, jalan: function (m) {
        var ke = [3520, 3530, 3540][m.v.P - 1];
        if (ke) m.lompat(ke);
      } },
    { baris: 3520, jalan: function (m) {
        m.v.X9 = Math.trunc(2 + m.v['E()'][5] * 6 - 6); m.v.Y9 = 3;
        m.lompat(3550);
      } },
    { baris: 3530, jalan: function (m) {
        m.v.X9 = Math.trunc(2 + m.v['V()'][3] * 6 - 6); m.v.Y9 = 19;
        m.lompat(3550);
      } },
    { baris: 3540, jalan: function (m) {
        m.v.X9 = Math.trunc(2 + m.v['V()'][3] * 6 - 6); m.v.Y9 = 11;
      } },
    { baris: 3550, jalan: function (m) { m.kembali(); } },
    { baris: 3560, jalan: function (m) {
        m.locate(m.v.Y9 + 0, m.v.X9 + 7); m.cetak('TOTAL');
      } },
    { baris: 3570, jalan: function (m) {
        m.locate(m.v.Y9 + 3, m.v.X9 + 7);
        m.cetak(basic(m.v['T()'][m.v.P])); m.kembali();
      } },
    { baris: 3580, jalan: function (m) {
        for (m.v.N = 1; m.v.N <= 7; m.v.N++) {
          m.locate(m.v.N + 1, 3); m.cetak(m.ulang(50, 32)); m.barisBaru();
        }
      } },
    { baris: 3590, jalan: function (m) {
        for (m.v.N = 0; m.v.N <= 15; m.v.N++) {
          m.locate(m.v.N + 9, 3); m.cetak(m.ulang(50, 32));
        }
      } },
    { baris: 3600, jalan: function (m) { m.kembali(); } },
    { baris: 3610, jalan: function (m) {
        for (m.v.P1 = 1; m.v.P1 <= 1000; m.v.P1++) { /* jeda */ }
        m.kembali();
      } },
    rem(3620),
    { baris: 3630, jalan: function () { /* PLAY "L64T200N46" — plink */ } },
    { baris: 3635, jalan: function (m) { m.kembali(); } },
    rem(3640),
    { baris: 3650, jalan: function () { /* PLAY "L64T200N70" — plonk */ } },
    { baris: 3655, jalan: function (m) { m.kembali(); } },
    rem(3660),
    /* 3670 ENTER dikembalikan sebagai "0" — dan baris 1865 memakai "0" itu
       sebagai penanda "berdiri". Tombol yang tidak punya huruf diberi huruf. */
    { baris: 3670, jalan: function (m) {
        m.v['I$'] = m.inkey();
        if (m.v['I$'] === '') m.lompat(3670);
        else if (m.v['I$'] === m.chr(13)) { m.v['I$'] = '0'; m.kembali(); }
      } },
    { baris: 3680, jalan: function (m) { m.kembali(); } },
    rem(3690),
    { baris: 3700, jalan: function (m) {
        m.warna(0, 7); m.v['CB$'] = keBita('╬╬╬╬╬');
      } },
    { baris: 3710, jalan: function (m) { m.gosub(3620); } },
    { baris: 3720, jalan: function (m) { m.v.X1 = 10; m.v.Y1 = 1; } },
    { baris: 3730, jalan: function (m) {
        for (m.v.NN = 7; m.v.NN >= 1; m.v.NN--) {
          m.locate(m.v.Y1 + m.v.NN, m.v.X1);
          m.cetak(m.v['CB$']); m.barisBaru();
        }
        m.warna(7, 0); m.kembali();
      } },
    rem(3800),
    { baris: 3810, jalan: function (m) {
        m.v.SND = (m.v.SND === 1) ? 0 : 1;
      } },
    { baris: 3820, jalan: function (m) { m.kembali(); } }
  ];

  function pilih(n, huruf, kode) {
    return { baris: n, jalan: function (m) {
      if (n === 1840) m.v['KS$'] = (m.v['I$'] || '').charAt(0);
      if (huruf.indexOf(m.v['KS$']) >= 0) {
        m.v['V()'][1] = kode; m.lompat(1870);
      }
    } };
  }
  function huruf(n, q, h) {
    return { baris: n, jalan: function (m) {
      if (m.v['Q()'][m.v.X] === q) m.v['T$'] = h;
    } };
  }
  function tangga(n, ambang, ke) {
    return { baris: n, jalan: function (m) {
      if ((m.v.C1 || 0) > ambang) m.lompat(ke);
    } };
  }
  function pet(n, baris, kolom, teks) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(teks); m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BLACKJCK'] = {
    nama: 'BLACKJCK',
    judul: 'Blackjack (CCII, 3 Januari 1978 — dipindahkan ke PC)',
    sumber: 'BLACKJCK',
    berkas: 'run/BLACKJCK.BAS',
    tabel: tabel,
    benih: 67,

    arsitektur: {
      judul: 'Alur BLACKJCK.BAS',
      simpul: [
        { id: 'meja', baris: '3440-3500', jenis: 'mulai',
          teks: ['Gambar meja;', 'dua sel pojok di-POKE'] },
        { id: 'panel', baris: '3250-3420', jenis: 'subrutin',
          teks: ['Panel aturan di kanan;', 'HOUSE dan PLAYER menurun'] },
        { id: 'taruh', baris: '1180-1350', jenis: 'putusan',
          teks: ['Taruhan maks $500;', 'besarnya MENGADUK pengacak'] },
        { id: 'bagi', baris: '1380-1420',
          teks: ['Dua kartu tiap pihak;', 'punggung kartu bandar'] },
        { id: 'ambil', baris: '2120-2220', jenis: 'subrutin',
          teks: ['Coba nomor acak sampai', 'dapat yang belum terpakai'] },
        { id: 'gambar', baris: '2290-2680', jenis: 'subrutin',
          teks: ['Kisi 5x7 diratakan;', 'pip dibangun JATUH-TEMBUS'] },
        { id: 'main', baris: '1820-2080', jenis: 'putusan',
          teks: ['H hit, D double, S split,', 'Enter berdiri'] },
        { id: 'bandar', baris: '2730-3050',
          teks: ['Menarik sampai 17,', 'dan juga di soft 17'] },
        { id: 'bayar', baris: '2840-3210', jenis: 'keluar',
          teks: ['Sepuluh ejekan, dipilih', 'dari total bust mod 5'] }
      ],
      panah: [
        { dari: 'meja', ke: 'panel' },
        { dari: 'panel', ke: 'taruh' },
        { dari: 'taruh', ke: 'bagi' },
        { dari: 'bagi', ke: 'ambil' },
        { dari: 'ambil', ke: 'gambar' },
        { dari: 'gambar', ke: 'main' },
        { dari: 'main', ke: 'ambil', label: 'hit' },
        { dari: 'main', ke: 'bandar', label: 'berdiri' },
        { dari: 'main', ke: 'bayar', label: 'bust', jenis: 'galat' },
        { dari: 'bandar', ke: 'bayar' },
        { dari: 'bayar', ke: 'taruh', label: 'tangan berikutnya' }
      ]
    },

    pseudokode: [
      { baris: 2350, tingkat: 0, teks: '<code>ON Q(X) GOTO</code> &mdash; dua belas sasaran untuk <b>tiga belas</b> pangkat' },
      { baris: 2440, tingkat: 1, teks: 'sembilan = dua pip, lalu <b>lompat ke tujuh</b>' },
      { baris: 2460, tingkat: 2, teks: 'tujuh = satu pip di tengah, lalu <b>jatuh ke enam</b>' },
      { baris: 2470, tingkat: 3, teks: 'enam = pola dasarnya' },
      { baris: 2670, tingkat: 0, teks: 'kisi 5&times;7 yang diratakan dicetak <b>terbalik</b>: indeks besar di atas' },
      { baris: 1350, tingkat: 0, teks: 'besar taruhan menentukan <b>berapa RND dibuang</b> sebelum kartu dibagi' },
      { baris: 2170, tingkat: 0, teks: 'mengocok = <b>mengosongkan penanda</b>, bukan mengaduk larik' },
      { baris: 2240, tingkat: 0, teks: 'As selalu 11 dulu; <code>E(P)</code> mencatat berapa yang bisa diturunkan' },
      { baris: 2760, tingkat: 0, teks: 'bandar menarik juga di <b>soft 17</b> &mdash; satu baris, menguntungkan rumah' },
      { baris: 1750, tingkat: 0, teks: '<code>C1 = T(P) MOD 5</code> memilih ejekan bandar &mdash; <b>hanya disetel saat pemain bust</b>' },
      { baris: 3480, tingkat: 0, teks: '<code>POKE</code> dua sel pojok yang <b>tidak bisa dicetak</b> tanpa menggulirkan layar' }
    ],

    perintahAsli: 'run\\BLACKJCK.bat',
    catatanAsli: 'H ambil kartu, D double down, S split, Enter berdiri. ' +
      'F10 mematikan bunyi. Ketik END sebagai taruhan untuk keluar.',

    penyimpangan: [
      '<b><code>PLAY</code> diam</b>, tapi F10 tetap membalik bendera ' +
      '<code>SND</code> lewat jebakan di baris 3800 &mdash; jadi alurnya tetap ' +
      'bisa ditelusuri.',

      '<b><code>POKE</code> ke <code>&amp;HB000</code> tidak ditiru.</b> Itu ' +
      'memori layar <b>monokrom</b> (MDA), bukan <code>&amp;HB800</code> milik ' +
      'CGA. Penelusur menulis dua aksara itu ke konsolnya langsung. Di mesin ' +
      'CGA sungguhan, kedua poke ini <b>tidak terlihat sama sekali</b>.',

      '<b><code>RANDOMIZE</code> memasang benih tetap</b>, jadi urutan kartunya ' +
      'sama tiap kali dijalankan.',

      '<b>Gelung tunda di 3610 habis seketika.</b>',

      '<b><code>LOAD "MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code>.</b> <code>COMMON MENU</code> di baris 1030 ' +
      'tidak ditiru &mdash; penelusur tidak mewariskan variabel antarprogram.'
    ],

    pelajaran: {
      ringkas: 'Blackjack 1978 yang dipindahkan orang lain ke PC &mdash; dan ' +
        'gambar pip kartunya dibangun dengan jatuh-tembus, tiap pangkat ' +
        'didefinisikan sebagai selisih dari pangkat di bawahnya.',
      pelajari: [
        ['Pip yang dibangun dengan jatuh-tembus',
         'Kartu sembilan tidak digambar dari nol. Baris 2440 menaruh dua pip, ' +
         'lalu <code>GOTO 2460</code> &mdash; kartu <b>tujuh</b>, yang menaruh ' +
         'satu pip di tengah lalu <b>jatuh</b> ke 2470, kartu <b>enam</b>, ' +
         'yang menggambar enam pip dasarnya.',
         'Jadi 9 = 2 + 7, dan 7 = 1 + 6. Delapan melompat langsung ke enam ' +
         '(8 = 2 + 6); sepuluh melompat ke empat (10 = 6 + 4). <b>Tiap ' +
         'pangkat didefinisikan sebagai selisihnya dari pangkat lain</b>, dan ' +
         'urutan barisnya yang menyimpan hubungan itu.',
         'Hasilnya: dua belas gambar kartu dalam sembilan baris.'],
        ['Mengocok tanpa mengaduk apa pun',
         '<code>D(A)</code> menyimpan <b>nomor tangan</b> saat kartu itu ' +
         'keluar, bukan sekadar "sudah terpakai". Mengocok (baris 2170-2190) ' +
         'cukup mengosongkan semua penanda <b>kecuali</b> yang bernilai ' +
         '<code>K</code> &mdash; tangan yang sedang berjalan. Kartu yang sudah ' +
         'di meja tetap tidak bisa keluar dua kali, dan tidak ada satu pun ' +
         'larik yang diaduk.'],
        ['Taruhan yang mengaduk pengacak',
         'Baris 1350: <code>FOR A4=1 TO Q3:X=RND(1):NEXT</code>, dengan ' +
         '<code>Q3</code> adalah besar taruhan. Makin besar taruhan, makin ' +
         'banyak bilangan acak yang <b>dibuang</b> sebelum kartu dibagi. ' +
         'Pemain sendiri yang mengaduk deknya, tanpa tahu, lewat angka yang ' +
         'ia ketik.'],
        ['Aksara yang tidak bisa dicetak',
         'Sel terakhir layar teks tidak bisa diisi dengan <code>PRINT</code>: ' +
         'menulis di sana memicu penggulungan. Baris 3480 mengisinya dengan ' +
         '<code>POKE</code> langsung ke memori layar &mdash; satu-satunya cara ' +
         'menutup pojok kanan bawah bingkai.'],
        ['Dua blackjack, dua cara melacak As',
         'Berkas ini memakai penghitung terpisah <code>E(P)</code>: tiap As ' +
         'dihitung sebelas dulu, dan diturunkan satu per satu saat bust ' +
         'mengancam. <a href="bj.html">BJ.BAS</a> di koleksi yang sama ' +
         'menyimpan sebelasnya <b>di dalam</b> angka totalnya. Dua program, ' +
         'satu masalah, dua jawaban yang sama benarnya &mdash; dan yang satu ' +
         'butuh tiga baris disalin tiga kali, yang lain satu baris ' +
         '<code>DEF FN</code>.']
      ],
      hindari: [
        ['Gelung yang batasnya memakai pencacahnya sendiri',
         'Baris 3400: <code>FOR YP=1 TO YP+LEN(ME$)</code>. Batasnya dihitung ' +
         'dari <code>YP</code> &mdash; variabel yang baru saja diberi nilai ' +
         'awal oleh <code>FOR</code> itu sendiri. Kebetulan hasilnya masuk ' +
         'akal, tapi maknanya bergantung pada urutan yang tidak jelas dari ' +
         'membacanya. Baris 3410 mengulang pola yang sama, dan di sana ' +
         'batasnya kelebihan satu &mdash; ia mencetak satu aksara kosong ' +
         'setelah "PLAYER".'],
        ['Penugasan ke diri sendiri, bekas baris yang dicabut',
         'Baris 2600: <code>IF X&gt;13 AND X&lt;40 THEN T$=T$</code>. Syaratnya ' +
         'memilih tepat wajik dan hati &mdash; <b>kartu merah</b>. Yang ' +
         'tersisa adalah kerangka sebuah baris pewarna yang isinya sudah ' +
         'dicabut, dan syaratnya ditinggal berdiri sendiri.'],
        ['Empat baris yang tidak bisa dicapai',
         'Baris <b>1360</b> dan <b>1370</b>: baris 1350 berakhir dengan ' +
         '<code>GOTO 1380</code>, dan tidak ada satu pun lompatan ke keduanya. ' +
         'Baris <b>3070</b> dan <b>3080</b>: pemanggilnya (1150-1170) sudah ' +
         'memilih sendiri antara 3090, 3100, dan 3110. Empat baris yang tidak ' +
         'akan pernah dijalankan sekali pun.'],
        ['Kepribadian yang bergantung nilai basi',
         '<code>C1</code> hanya disetel di baris 1750 &mdash; <b>saat pemain ' +
         'bust</b>. Tapi baris 2860-2890 dan 2930-2960 membacanya di ' +
         '<b>setiap</b> pembayaran. Tangan yang dimenangkan tanpa bust akan ' +
         'memilih ejekan berdasarkan sisa tangan sebelumnya, atau nol di awal ' +
         'permainan.'],
        ['Bayaran asuransi yang tidak cocok dengan tulisannya',
         'Baris 1630 menambah <code>W</code> ke saldo, lalu baris 1640 ' +
         'menulis <i>"YOU WIN $";W/2</i>. Yang bertambah dua kali lipat dari ' +
         'yang dikatakan.'],
        ['Panggilan ke baris yang tidak ada',
         'Baris 2650 berisi <code>REM GOSUB 64000:GOSUB 3000</code> &mdash; ' +
         'sudah dijadikan komentar, dan 64000 memang tidak ada di berkas ini. ' +
         'Sisa dari versi 1978, waktu ada sesuatu di sana yang tidak ikut ' +
         'pindah ke PC.']
      ]
    },

    penjelasan: [
      { judul: 'Kartu yang menggambar dirinya dari kartu lain',
        isi: [
          'Sebuah kartu di layar ini adalah kisi lima kolom kali tujuh baris, ' +
          'disimpan sebagai <b>larik 35 string</b> yang diratakan &mdash; ' +
          'indeks 17 adalah tengahnya, 6 dan 8 pojok atas, 26 dan 28 pojok ' +
          'bawah.',
          'Cara yang biasa: tulis dua belas blok, satu per pangkat, masing ' +
          'masing menaruh pipnya sendiri. Yang dilakukan program ini lain:',
          '<code>2440 T$(7)=U$:T$(27)=U$:GOTO 2460</code> &nbsp; &larr; sembilan<br>' +
          '<code>2460 T$(17)=U$</code> &nbsp; &larr; tujuh, lalu <b>jatuh</b><br>' +
          '<code>2470 T$(6)=U$:T$(8)=U$:T$(16)=U$:&hellip;</code> &nbsp; &larr; enam',
          'Sembilan menaruh dua pip lalu <b>melompat ke tujuh</b>. Tujuh ' +
          'menaruh satu pip di tengah lalu <b>jatuh</b> ke enam. Enam ' +
          'menggambar pola dasarnya dan selesai.',
          'Delapan (2450) melompat langsung ke enam. Sepuluh (2420) menggambar ' +
          'enam pip lalu melompat ke <b>empat</b> di 2510. Tiga, dua, dan As ' +
          'berdiri sendiri.',
          'Yang tersimpan bukan gambarnya, melainkan <b>hubungan antar ' +
          'gambar</b> &mdash; dan yang menyimpannya adalah urutan nomor baris ' +
          'dan letak <code>GOTO</code>-nya.',
          'Itu juga kelemahannya. Mengubah pola enam mengubah tujuh, delapan, ' +
          'dan sembilan sekaligus. Menyisipkan satu baris di antara 2460 dan ' +
          '2470 memutus tujuh dari enam tanpa peringatan apa pun. Struktur ' +
          'yang cerdas, disimpan di tempat yang tidak bisa memeriksanya.'
        ] },
      { judul: 'Empat tahun sebelum mesinnya ada',
        isi: [
          'Dua baris pertama berkas ini:',
          '<code>1000 REM ** CCII BLACKJACK - JAN 3,78 - JESSEN **</code><br>' +
          '<code>1010 REM ADAPTED TO PC BY PATRICK LEABO--TUCSON</code>',
          'Tiga Januari 1978. IBM PC baru diumumkan Agustus 1981 &mdash; ' +
          '<b>tiga setengah tahun kemudian</b>. Program ini ditulis untuk ' +
          'mesin lain, dan orang kedua memindahkannya.',
          'Bekas pemindahan itu masih terlihat di beberapa tempat.',
          '<code>REM GOSUB 64000</code> di baris 2650 memanggil nomor baris ' +
          'yang tidak ada di berkas ini &mdash; sesuatu di mesin asal yang ' +
          'tidak ikut pindah, dan panggilannya dijadikan komentar alih-alih ' +
          'dihapus.',
          'Baris 1060 mengacak <code>N</code> dan <code>X</code>, lalu ' +
          'keduanya tidak pernah dibaca lagi.',
          'Dan baris 3480 memoke ke <code>&amp;HB000</code> &mdash; memori ' +
          'layar <b>monokrom</b>. Yang memindahkan program ini punya kartu ' +
          'MDA, bukan CGA. Di mesin CGA, pojok kanan bawah bingkainya tetap ' +
          'bolong, dan tidak ada yang tahu kenapa.',
          'Berkas ini menyimpan jejak dua mesin sekaligus: yang tidak ' +
          'dikenalnya lagi, dan yang baru saja dikenalnya.'
        ] }
    ]
  };
})(window);
