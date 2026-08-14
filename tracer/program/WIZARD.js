/* ===========================================================================
   WIZARD.js — porting minimalis WIZARD.BAS sebagai tabel baris.

       1050 REM * WIZARD'S CASTLE GAME FROM JULY/AUGUST 1980        *
       1060 REM * ISSUE OF RECREATIONAL COMPUTING MAGAZINE          *
       1070 REM * WRITTEN FOR EXIDY SORCERER BY JOSEPH R. POWER     *
       1080 REM * MODIFIED FOR HEATH MICROSOFT BASIC BY J.F.STETSON *

   Sembilan ratus empat puluh empat baris — program terpanjang di koleksi
   ini. Terbit di majalah Recreational Computing Juli/Agustus 1980, ditulis
   untuk Exidy Sorcerer, dipindahkan ke Heath, lalu ke IBM PC, lalu disebar
   klub International PC Owners di Pittsburgh dengan nama berkas 2039-A.BAS.

   DAN INI INDUKNYA TEM-INS.BAS. Delapan harta yang didokumentasikan
   "Temple of Loth" — Ruby Red, Pale Pearl, Opal Eye, Green Gem, Blue Flame,
   Norn Stone, Palantir, Silmaril — adalah delapan harta yang SAMA di baris
   9520-9540 berkas ini. Koleksi ini menyimpan permainan aslinya, dan
   petunjuk sebuah turunan yang permainannya sendiri sudah hilang.

   YANG PALING LAYAK DILIHAT: LIMA FUNGSI SATU BARIS YANG MENGGANTIKAN
   SELURUH TATA RUANGNYA.

       1140 DEF FNA(Q)=1+INT(RND(1)*Q)          ' undian 1..Q
       1150 DEF FNB(Q)=Q+8*((Q=9)-(Q=0))        ' peta melingkar
       1160 DEF FNC(Q)=-Q*(Q<19)-18*(Q>18)      ' batas atas 18
       1170 DEF FND(Q)=64*(Q-1)+8*(X-1)+Y       ' 8x8x8 jadi satu larik
       1180 DEF FNE(Q)=Q+100*(Q>99)             ' buka ruangan tersembunyi

   `FNB` mengurus peta yang tepinya bersambung: kalau Q jadi 9 ia kembali ke
   1, kalau jadi 0 ia melompat ke 8. Perbandingan di BASIC bernilai -1, jadi
   `8*((Q=9)-(Q=0))` menghasilkan -8, 0, atau +8 — dan satu ungkapan
   mengurus kedua tepi.

   `FND` meratakan kastil delapan tingkat kali delapan kali delapan jadi
   larik 512. Parameternya cuma tingkat; X dan Y dibaca dari variabel
   BERSAMA — jadi ia sebenarnya makro, bukan fungsi.

   `FNE` mencabut angka 100 yang menandai "ruangan ini belum pernah
   dilihat". Tiap ruangan disimpan sebagai isinya ditambah seratus, dan
   melihatnya berarti mengurangi seratus itu.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `RANDOMIZE` tidak dipanggil sama sekali di berkas aslinya; penelusur
     memasang benih tetap.
   - `CHAIN "SAMPLES",1000` di baris 10180 tidak bisa dijalankan, dan
     memang tidak pernah dicapai. Lihat catatan cacat.
   - `PRINT CHR$(27);"E"` di baris 3590 adalah perintah bersihkan-layar
     terminal Heath; di sini diperlakukan sebagai CLS.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Perbandingan BASIC bernilai -1 (benar) atau 0 (salah); seluruh
     aritmetika di berkas ini bergantung padanya. */
  function b(uji) { return uji ? -1 : 0; }
  function bas(n) {
    if (n === undefined || n === null) n = 0;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }
  function LEFT(s, n) { return (s || '').slice(0, Math.max(0, n)); }
  function RIGHT(s, n) { return n <= 0 ? '' : (s || '').slice(-n); }
  function MID(s, i, n) {
    s = s || '';
    if (i < 1) i = 1;
    return n === undefined ? s.slice(i - 1) : s.substr(i - 1, n);
  }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function ke(n, tujuan) {
    return { baris: n, jalan: function (m) { m.lompat(tujuan); } };
  }
  function pulang(n) {
    return { baris: n, jalan: function (m) { m.kembali(); } };
  }

  var tabel = [];
  function T(x) { if (x) tabel.push(x); return x; }

  /* Kelima fungsi satu baris. Lihat catatan di kepala berkas. */
  function FNA(m, q) { return 1 + Math.trunc(m.acak() * q); }
  function FNB(q) { return q + 8 * (b(q === 9) - b(q === 0)); }
  function FNC(q) { return -q * b(q < 19) - 18 * b(q > 18); }
  function FND(m, q) { return 64 * (q - 1) + 8 * (m.v.X - 1) + m.v.Y; }
  function FNE(q) { return q + 100 * b(q > 99); }
  function L(m, q) { return m.v['L()'][FND(m, q)]; }
  function setL(m, q, nilai) { m.v['L()'][FND(m, q)] = nilai; }

  /* --- 10-250: layar judul klub IPCO ----------------------------------- */
  var PETA = { '░': 176, '┌': 218, '─': 196, '┐': 191, '│': 179,
               '└': 192, '┘': 217, '▄': 220, '█': 219 };
  function kotak(s) {
    var k = '', i;
    for (i = 0; i < s.length; i++) {
      k += PETA[s.charAt(i)] !== undefined
        ? String.fromCharCode(PETA[s.charAt(i)]) : s.charAt(i);
    }
    return k;
  }
  T({ baris: 10, jalan: function (m) { m.cls(); } });
  [[20,'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░'],
   [30,'░┌───────────────────────────────────┐░'],
   [40,'░│                                   │░'],
   [50,'░│            2039-A.BAS             │░'],
   [60,"░│        THE WIZARD'S CASTLE        │░"],
   [70,'░│                                   │░'],
   [80,'░│                                   │░'],
   [90,'░│ BROUGHT TO YOU BY THE MEMBERS OF  │░'],
   [100,'░│      ▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄      │░'],
   [110,'░│        █   █   █ █     █   █      │░'],
   [120,'░│        █   █▄▄▄█ █     █   █      │░'],
   [130,'░│        █   █     █     █   █      │░'],
   [140,'░│      ▄▄█▄▄ █     █▄▄▄▄ █▄▄▄█      │░'],
   [150,'░│                                   │░'],
   [160,'░│      International PC Owners      │░'],
   [170,'░│                                   │░'],
   [180,'░│P.O. Box 10426, Pittsburgh PA 15234│░'],
   [190,'░│                                   │░'],
   [200,'░└───────────────────────────────────┘░'],
   [210,'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░']].forEach(function (a) {
    T(cet(a[0], kotak(a[1])));
  });
  T({ baris: 220, jalan: function (m) { m.barisBaru(); } });
  T(cet(230, '       PRESS ANY KEY TO CONTINUE'));
  T({ baris: 240, jalan: function (m) {
      m.v['A$'] = m.inkey();
      if (m.v['A$'] === '') m.lompat(240);
    } });
  T({ baris: 250, jalan: function (m) { m.cls(); } });

  /* --- 1000-1200: penyiapan -------------------------------------------- */
  /* 1000-1010 PINTU MASUK KEDUA YANG TIDAK DIPAKAI SIAPA PUN. Baris 1000
     menyetel SAMP$="NO" lalu melompati baris 1010, yang menyetelnya "YES".
     Satu-satunya cara mencapai 1010 adalah `RUN 1010` dari luar — dan
     baris 10180 di ujung berkas memakainya untuk memutuskan apakah
     programnya pulang ke SAMPLES. Idiom yang sama dengan MORTGAGE.BAS,
     DROIDS.BAS, dan MUSIC.BAS. Empat kali di satu koleksi. */
  T({ baris: 1000, jalan: function (m) {
      m.v['SAMP$'] = 'NO'; m.lompat(1020);
    } });
  T({ baris: 1010, jalan: function (m) { m.v['SAMP$'] = 'YES'; } });
  T({ baris: 1020, jalan: function (m) { m.cls(); } });
  [1030, 1040, 1050, 1060, 1070, 1080, 1090, 1100].forEach(function (n) {
    T(rem(n));
  });
  T({ baris: 1110, jalan: function () { /* DEFINT A-Z */ } });
  T({ baris: 1120, jalan: function (m) {
      m.dim('C$()', 34); m.dim('I$()', 34); m.dim('R$()', 4);
      m.dim('W$()', 8); m.dim('E$()', 8);
    } });
  T({ baris: 1130, jalan: function (m) {
      m.dim('L()', 512); m.dim('C()', 3, 4); m.dim('T()', 8);
      m.dim('O()', 3); m.dim('R()', 3);
    } });
  [1140, 1150, 1160, 1170, 1180].forEach(function (n) { T(rem(n)); });
  T({ baris: 1190, jalan: function (m) {
      m.v['Y$'] = '** PLEASE ANSWER YES OR NO';
    } });
  T({ baris: 1200, jalan: function (m) { m.v.NG = 0; } });

  /* --- 1210-1390: mengisi kastil --------------------------------------- */
  T(rem(1210)); T(rem(1220)); T(rem(1230));
  T({ baris: 1240, jalan: function (m) { m.v.NG = m.v.NG + 1; } });
  T({ baris: 1250, jalan: function (m) { m.v.Q = m.acak(); } });
  T({ baris: 1260, jalan: function (m) { m.ulangData(0); } });
  T({ baris: 1270, jalan: function (m) { m.untuk('Q', 1, 34, 1, 1300); } });
  /* 1280 DUA DAFTAR DIBACA BERSELANG-SELING: nama panjang ruangan dan
     lambang satu aksaranya, dari DATA yang sama. */
  T({ baris: 1280, jalan: function (m) {
      m.v['C$()'][m.v.Q] = m.baca();
      m.v['I$()'][m.v.Q] = m.baca();
    } });
  T({ baris: 1290, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1300, jalan: function (m) { m.untuk('Q', 1, 512, 1, 1330); } });
  /* 1310 SELURUH KASTIL DIISI 101: isi 1 (ruangan kosong) ditambah 100
     (belum pernah dilihat). */
  T({ baris: 1310, jalan: function (m) { m.v['L()'][m.v.Q] = 101; } });
  T({ baris: 1320, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1330, jalan: function (m) { m.untuk('Q', 1, 8, 1, 1360); } });
  /* 1340 `W$` MENAMPUNG SENJATA DAN BAJU ZIRAH SEKALIGUS — 1 sampai 4
     senjata, 5 sampai 8 baju. Dan `E$` di lajur yang sama menyimpan
     nama MAKANAN, dibaca dari DATA yang sama pula. */
  T({ baris: 1340, jalan: function (m) {
      m.v['W$()'][m.v.Q] = m.baca();
      m.v['E$()'][m.v.Q] = m.baca();
    } });
  T({ baris: 1350, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1360, jalan: function (m) { m.untuk('Q', 1, 4, 1, 1390); } });
  T({ baris: 1370, jalan: function (m) { m.v['R$()'][m.v.Q] = m.baca(); } });
  T({ baris: 1380, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1390, jalan: function (m) { if (m.v.NG > 1) m.lompat(1520); } });
  T({ baris: 1400, jalan: function (m) { m.gosub(9770); } });
  T({ baris: 1410, jalan: function (m) {
      m.tab(16); m.cetak("* * * THE WIZARD'S CASTLE * * *"); m.barisBaru();
    } });
  T({ baris: 1420, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 1430, jalan: function (m) { m.gosub(9770); } });
  T(cet(1440, "MANY CYCLES AGO, IN THE KINGDOM OF N'DIC, THE GNOMIC"));
  T(cet(1450, 'WIZARD ZOT FORGED HIS GREAT *ORB OF POWER*. HE SOON'));
  T(cet(1460, 'VANISHED, LEAVING BEHIND HIS VAST SUBTERRANEAN CASTLE'));
  T(cet(1470, 'FILLED WITH ESURIENT MONSTERS, FABULOUS TREASURES, AND'));
  T(cet(1480, 'THE INCREDIBLE *ORB OF ZOT*. FROM THAT TIME HENCE, MANY'));
  T(cet(1490, "A BOLD YOUTH HAS VENTURED INTO THE WIZARD'S CASTLE. AS"));
  T(cet(1500, 'OF NOW, *NONE* HAS EVER EMERGED VICTORIOUSLY! BEWARE!!'));
  T({ baris: 1510, jalan: function (m) { m.barisBaru(); } });

  /* --- 1520-2030: menaburkan isi kastil -------------------------------- */
  T({ baris: 1520, jalan: function (m) { m.v.X = 1; m.v.Y = 4; } });
  T({ baris: 1530, jalan: function (m) { setL(m, 1, 2); } });
  T({ baris: 1540, jalan: function (m) { m.untuk('Z', 1, 7, 1, 1610); } });
  T({ baris: 1550, jalan: function (m) { m.untuk('Q1', 1, 2, 1, 1600); } });
  T({ baris: 1560, jalan: function (m) { m.v.Q = 104; } });
  T({ baris: 1570, jalan: function (m) { m.gosub(9590); } });
  /* 1580 tiap lubang turun DIPASANGKAN dengan tangga naik satu tingkat di
     bawahnya — di petak yang sama, karena X dan Y masih berisi tempat yang
     baru saja dipilih subrutin 9590. */
  T({ baris: 1580, jalan: function (m) { setL(m, m.v.Z + 1, 103); } });
  T({ baris: 1590, jalan: function (m) { m.lanjutkan('Q1'); } });
  T({ baris: 1600, jalan: function (m) { m.lanjutkan('Z'); } });
  T({ baris: 1610, jalan: function (m) { m.untuk('Z', 1, 8, 1, 1730); } });
  T({ baris: 1620, jalan: function (m) { m.untuk('Q', 113, 124, 1, 1650); } });
  T({ baris: 1630, jalan: function (m) { m.gosub(9590); } });
  T({ baris: 1640, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1650, jalan: function (m) { m.untuk('Q1', 1, 3, 1, 1720); } });
  T({ baris: 1660, jalan: function (m) { m.untuk('Q', 105, 112, 1, 1690); } });
  T({ baris: 1670, jalan: function (m) { m.gosub(9590); } });
  T({ baris: 1680, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1690, jalan: function (m) { m.v.Q = 125; } });
  T({ baris: 1700, jalan: function (m) { m.gosub(9590); } });
  T({ baris: 1710, jalan: function (m) { m.lanjutkan('Q1'); } });
  T({ baris: 1720, jalan: function (m) { m.lanjutkan('Z'); } });
  T({ baris: 1730, jalan: function (m) { m.untuk('Q', 126, 133, 1, 1770); } });
  T({ baris: 1740, jalan: function (m) { m.v.Z = FNA(m, 8); } });
  T({ baris: 1750, jalan: function (m) { m.gosub(9590); } });
  T({ baris: 1760, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1770, jalan: function (m) { m.v.Q = 101; } });
  /* 1780-1850 TIGA KUTUKAN ditaruh di ruangan yang tampak KOSONG — isinya
     tetap 101, dan yang mencatat tempatnya cuma larik `C(3,4)`. Pemain
     tidak pernah melihat apa pun di sana. */
  T({ baris: 1780, jalan: function (m) { m.untuk('A', 1, 3, 1, 1860); } });
  T({ baris: 1790, jalan: function (m) { m.v.Z = FNA(m, 8); } });
  T({ baris: 1800, jalan: function (m) { m.gosub(9590); } });
  T({ baris: 1810, jalan: function (m) { m.v['C()'][m.v.A][1] = m.v.X; } });
  T({ baris: 1820, jalan: function (m) { m.v['C()'][m.v.A][2] = m.v.Y; } });
  T({ baris: 1830, jalan: function (m) { m.v['C()'][m.v.A][3] = m.v.Z; } });
  T({ baris: 1840, jalan: function (m) { m.v['C()'][m.v.A][4] = 0; } });
  T({ baris: 1850, jalan: function (m) { m.lanjutkan('A'); } });
  T({ baris: 1860, jalan: function (m) { m.v.RC = 0; } });
  T({ baris: 1870, jalan: function (m) { m.v.ST = 2; } });
  T({ baris: 1880, jalan: function (m) { m.v.DX = 14; } });
  T({ baris: 1890, jalan: function (m) { m.v['R$()'][3] = 'MAN'; } });
  /* 1900-1950 RUNESTAFF disembunyikan DI DALAM salah satu monster: yang
     dicatat cuma tempatnya, dan membunuh monster di petak itu yang
     memunculkannya (baris 7810). */
  T({ baris: 1900, jalan: function (m) { m.v.Q = 112 + FNA(m, 12); } });
  T({ baris: 1910, jalan: function (m) { m.v.Z = FNA(m, 8); } });
  T({ baris: 1920, jalan: function (m) { m.gosub(9590); } });
  T({ baris: 1930, jalan: function (m) { m.v['R()'][1] = m.v.X; } });
  T({ baris: 1940, jalan: function (m) { m.v['R()'][2] = m.v.Y; } });
  T({ baris: 1950, jalan: function (m) { m.v['R()'][3] = m.v.Z; } });
  /* 1960-2010 ORB OF ZOT bersembunyi sebagai WARP biasa (isi 109). */
  T({ baris: 1960, jalan: function (m) { m.v.Q = 109; } });
  T({ baris: 1970, jalan: function (m) { m.v.Z = FNA(m, 8); } });
  T({ baris: 1980, jalan: function (m) { m.gosub(9590); } });
  T({ baris: 1990, jalan: function (m) { m.v['O()'][1] = m.v.X; } });
  T({ baris: 2000, jalan: function (m) { m.v['O()'][2] = m.v.Y; } });
  T({ baris: 2010, jalan: function (m) { m.v['O()'][3] = m.v.Z; } });
  T({ baris: 2020, jalan: function (m) {
      m.v.BF = 0; m.v.OT = 8; m.v.AV = 0; m.v.HT = 0;
      m.v.T = 1; m.v.VF = 0; m.v.LF = 0;
    } });
  T({ baris: 2030, jalan: function (m) {
      m.v.TC = 0; m.v.GP = 60; m.v.RF = 0; m.v.OF = 0;
      m.v.BL = 0; m.v.IQ = 8; m.v.SX = 0;
    } });
  T({ baris: 2040, jalan: function (m) { m.untuk('Q', 1, 8, 1, 2070); } });
  T({ baris: 2050, jalan: function (m) { m.v['T()'][m.v.Q] = 0; } });
  T({ baris: 2060, jalan: function (m) { m.lanjutkan('Q'); } });

  /* --- 2070-2880: membuat tokoh ---------------------------------------- */
  T({ baris: 2070, jalan: function (m) { m.bunyi(); } });
  T(cet(2080, 'ALL RIGHT, BOLD ONE.'));
  T(cet(2090, 'YOU MAY BE AN ELF, DWARF, MAN, OR HOBBIT.'));
  T({ baris: 2100, jalan: function (m) { m.gosub(9830); } });
  T({ baris: 2110, jalan: function (m) { m.untuk('Q', 1, 4, 1, 2140); } });
  /* 2120 BANGSA MENUKAR KEKUATAN DENGAN KETANGKASAN: makin besar nomor
     bangsanya, makin kuat dan makin kaku. Hobbit paling lincah, Kurcaci
     paling kuat. */
  T({ baris: 2120, jalan: function (m) {
      if (LEFT(m.v['R$()'][m.v.Q], 1) === m.v['O$']) {
        m.v.RC = m.v.Q;
        m.v.ST = m.v.ST + 2 * m.v.Q;
        m.v.DX = m.v.DX - 2 * m.v.Q;
      }
    } });
  T({ baris: 2130, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 2140, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2150, jalan: function (m) {
      m.v.OT = m.v.OT + 4 * b(m.v.RC === 1);
    } });
  /* 2160 begitu bangsanya dipilih, entri ketiga diganti dari "MAN" jadi
     "HUMAN" — jadi pemain yang memilih Man disapa "HUMAN" seterusnya. */
  T({ baris: 2160, jalan: function (m) {
      if (m.v.RC > 0) { m.v['R$()'][3] = 'HUMAN'; m.lompat(2190); }
    } });
  T(cet(2170, '** THAT WAS INCORRECT. PLEASE TYPE E, D, M, OR H.'));
  T(ke(2180, 2090));
  T({ baris: 2190, jalan: function (m) { m.cetak('WHICH SEX TO YOU PREFER'); } });
  T({ baris: 2200, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 2210, jalan: function (m) {
      if (m.v['O$'] === 'M') { m.v.SX = 1; m.lompat(2250); }
    } });
  T({ baris: 2220, jalan: function (m) {
      if (m.v['O$'] === 'F') m.lompat(2250);
    } });
  T({ baris: 2230, jalan: function (m) {
      m.cetak('** CUTE ' + ras(m) + ', REAL CUTE. TRY M OR F.'); m.barisBaru();
    } });
  T(ke(2240, 2190));
  T({ baris: 2250, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2260, jalan: function (m) {
      m.cetak('OK, ' + ras(m) + ', YOU HAVE THE FOLLOWING ATTRIBUTES :');
      m.barisBaru();
    } });
  T({ baris: 2270, jalan: function (m) {
      m.cetak('STRENGTH =' + bas(m.v.ST) + ' INTELLIGENCE =' + bas(m.v.IQ) +
              ' DEXTERITY =' + bas(m.v.DX)); m.barisBaru();
    } });
  T({ baris: 2280, jalan: function (m) {
      m.cetak('AND' + bas(m.v.OT) + 'OTHER POINTS TO ALLOCATE AS YOU WISH.');
      m.barisBaru();
    } });
  T({ baris: 2290, jalan: function (m) { m.barisBaru(); } });
  T(bagi(2300, 2310, 2320, 'STRENGTH', 'ST'));
  T({ baris: 2330, jalan: function (m) { if (m.v.OT === 0) m.lompat(2410); } });
  T(bagi(2340, 2350, 2360, 'INTELLIGENCE', 'IQ'));
  T({ baris: 2370, jalan: function (m) { if (m.v.OT === 0) m.lompat(2410); } });
  T(bagi(2380, 2390, 2400, 'DEXTERITY', 'DX'));
  T({ baris: 2410, jalan: function (m) {
      m.cetak('OK, ' + ras(m) + ", YOU HAVE 60 GOLD PIECES (GP'S).");
      m.barisBaru();
    } });
  T({ baris: 2420, jalan: function (m) { m.v['Z$'] = 'ARMOR'; } });
  T({ baris: 2430, jalan: function (m) { m.gosub(10130); } });
  T({ baris: 2440, jalan: function (m) {
      m.v.AV = 0; m.v.WV = 0; m.v.FL = 0; m.v.WC = 0;
    } });
  T(cet(2450, 'PLATE<30> CHAINMAIL<20> LEATHER<10> NOTHING<0>'));
  T({ baris: 2460, jalan: function (m) { m.gosub(9830); } });
  T({ baris: 2470, jalan: function (m) {
      if (m.v['O$'] === 'N') m.lompat(2530);
    } });
  /* 2480 tiga pilihan jadi satu ungkapan: hanya satu perbandingan yang
     benar, dan nilainya -1, jadi tanda minus di depannya membalikkannya. */
  T({ baris: 2480, jalan: function (m) {
      m.v.AV = -3 * b(m.v['O$'] === 'P') - 2 * b(m.v['O$'] === 'C') -
               b(m.v['O$'] === 'L');
    } });
  T({ baris: 2490, jalan: function (m) { if (m.v.AV > 0) m.lompat(2530); } });
  T({ baris: 2500, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2510, jalan: function (m) {
      m.cetak('** ARE YOU A ' + ras(m) + ' OR ' +
              m.v['C$()'][FNA(m, 12) + 12] + '?'); m.barisBaru();
    } });
  T(ke(2520, 2420));
  T({ baris: 2530, jalan: function (m) {
      m.v.AH = m.v.AV * 7; m.v.GP = m.v.GP - m.v.AV * 10;
    } });
  T({ baris: 2540, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2550, jalan: function (m) {
      m.cetak('OK, BOLD ' + ras(m) + ', YOU HAVE' + bas(m.v.GP) +
              "GP'S LEFT."); m.barisBaru();
    } });
  T({ baris: 2560, jalan: function (m) { m.v['Z$'] = 'WEAPONS'; } });
  T({ baris: 2570, jalan: function (m) { m.gosub(10130); } });
  T(cet(2580, 'SWORD<30> MACE<20> DAGGER<10> NOTHING<0>'));
  T({ baris: 2590, jalan: function (m) { m.gosub(9830); } });
  T({ baris: 2600, jalan: function (m) {
      if (m.v['O$'] === 'N') m.lompat(2660);
    } });
  T({ baris: 2610, jalan: function (m) {
      m.v.WV = -3 * b(m.v['O$'] === 'S') - 2 * b(m.v['O$'] === 'M') -
               b(m.v['O$'] === 'D');
    } });
  T({ baris: 2620, jalan: function (m) { if (m.v.WV > 0) m.lompat(2660); } });
  T({ baris: 2630, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2640, jalan: function (m) {
      m.cetak('** IS YOUR IQ REALLY' + bas(m.v.IQ) + '?'); m.barisBaru();
    } });
  T(ke(2650, 2560));
  T({ baris: 2660, jalan: function (m) { m.v.GP = m.v.GP - m.v.WV * 10; } });
  T({ baris: 2670, jalan: function (m) { if (m.v.GP < 20) m.lompat(2730); } });
  T({ baris: 2680, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2690, jalan: function (m) {
      m.cetak("DO YOU WANT TO BUY A LAMP FOR 20 GP'S");
    } });
  T({ baris: 2700, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 2710, jalan: function (m) {
      if (m.v['O$'] === 'Y') {
        m.v.LF = 1; m.v.GP = m.v.GP - 20; m.lompat(2730);
      }
    } });
  T({ baris: 2720, jalan: function (m) {
      if (m.v['O$'] !== 'N') {
        m.barisBaru(); m.cetak(m.v['Y$']); m.barisBaru(); m.barisBaru();
        m.lompat(2690);
      }
    } });
  T({ baris: 2730, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2740, jalan: function (m) {
      if (m.v.GP < 1) { m.v.Q = 0; m.lompat(2850); }
    } });
  T({ baris: 2750, jalan: function (m) {
      m.cetak('OK, ' + ras(m) + ', YOU HAVE' + bas(m.v.GP) +
              'GOLD PIECES LEFT.'); m.barisBaru();
    } });
  T({ baris: 2760, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2770, jalan: function (m) {
      m.masukan('O$', 'FLARES COST 1 GP EACH. HOW MANY DO YOU WANT? ');
    } });
  T({ baris: 2780, jalan: function (m) {
      m.v.Q = parseInt(m.v['O$'], 10) || 0;
    } });
  T({ baris: 2790, jalan: function (m) { m.barisBaru(); } });
  /* 2800 `ASC(O$)=48` — menerima "0" secara terpisah, karena `VAL` juga
     memberi nol untuk masukan yang bukan angka sama sekali. */
  T({ baris: 2800, jalan: function (m) {
      if (m.v.Q > 0 || (m.v['O$'] || ' ').charCodeAt(0) === 48) m.lompat(2840);
    } });
  T(cet(2810, "** IF YOU DON'T WANT ANY, JUST TYPE 0 (ZERO)."));
  T({ baris: 2820, jalan: function (m) { m.barisBaru(); } });
  T(ke(2830, 2770));
  T({ baris: 2840, jalan: function (m) {
      if (m.v.Q > m.v.GP) {
        m.cetak('** YOU CAN ONLY AFFORD' + bas(m.v.GP) + '.'); m.barisBaru();
        m.barisBaru(); m.lompat(2770);
      }
    } });
  T({ baris: 2850, jalan: function (m) {
      m.v.FL = m.v.FL + m.v.Q; m.v.GP = m.v.GP - m.v.Q;
    } });
  T({ baris: 2860, jalan: function (m) { m.v.X = 1; m.v.Y = 4; m.v.Z = 1; } });
  T({ baris: 2870, jalan: function (m) {
      m.cetak('OK, ' + ras(m) + ', YOU ARE NOW ENTERING THE CASTLE!');
      m.barisBaru();
    } });
  T(ke(2880, 5920));

  /* --- 2890-3440: gelung utama, kutukan, dan bisikan kastil ------------ */
  T(rem(2890)); T(rem(2900)); T(rem(2910));
  T({ baris: 2920, jalan: function (m) { m.v.T = m.v.T + 1; } });
  T({ baris: 2930, jalan: function (m) {
      if (m.v.RF + m.v.OF > 0) m.lompat(3060);
    } });
  /* 2940-2960 TIGA KUTUKAN, dan tiap harta yang cocok menangkalnya:
     lesu memakan satu giliran, lintah menyedot emas, dan lupa mengacak
     ingatan peta. Yang membandingkan cuma `C(n,4) > T(n)`. */
  T({ baris: 2940, jalan: function (m) {
      if (m.v['C()'][1][4] > m.v['T()'][1]) m.v.T = m.v.T + 1;
    } });
  T({ baris: 2950, jalan: function (m) {
      if (m.v['C()'][2][4] > m.v['T()'][3]) m.v.GP = m.v.GP - FNA(m, 5);
    } });
  T({ baris: 2960, jalan: function (m) { if (m.v.GP < 0) m.v.GP = 0; } });
  T({ baris: 2970, jalan: function (m) {
      if (m.v['C()'][3][4] <= m.v['T()'][5]) m.lompat(3060);
    } });
  T({ baris: 2980, jalan: function (m) {
      m.v.A = m.v.X; m.v.B = m.v.Y; m.v.C = m.v.Z;
    } });
  T({ baris: 2990, jalan: function (m) {
      m.v.X = FNA(m, 8); m.v.Y = FNA(m, 8); m.v.Z = FNA(m, 8);
    } });
  /* 3000 KUTUKAN LUPA: satu ruangan acak dikembalikan ke keadaan "belum
     pernah dilihat" tiap giliran. Petanya perlahan jadi tanda tanya lagi. */
  T({ baris: 3000, jalan: function (m) {
      setL(m, m.v.Z, FNE(L(m, m.v.Z)) + 100);
    } });
  T({ baris: 3010, jalan: function (m) {
      m.v.X = m.v.A; m.v.Y = m.v.B; m.v.Z = m.v.C;
    } });
  T({ baris: 3020, jalan: function (m) {
      if (L(m, m.v.Z) !== 1) m.lompat(3060);
    } });
  T({ baris: 3030, jalan: function (m) { m.untuk('Q', 1, 3, 1, 3060); } });
  /* 3040 kutukan menempel begitu pemain berdiri tepat di petaknya —
     ketiga perbandingan dikalikan, jadi hasilnya 1 hanya kalau semuanya
     benar. */
  T({ baris: 3040, jalan: function (m) {
      var C = m.v['C()'][m.v.Q];
      m.v['C()'][m.v.Q][4] =
        -b(C[1] === m.v.X) * b(C[2] === m.v.Y) * b(C[3] === m.v.Z);
    } });
  T({ baris: 3050, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 3060, jalan: function (m) { if (FNA(m, 5) > 1) m.lompat(3350); } });
  T({ baris: 3070, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3080, jalan: function (m) { m.cetak('YOU '); } });
  /* 3090-3110 KEBUTAAN MENGGESER DAFTAR BISIKAN: `Q=FNA(7)+BL`, jadi
     pemain buta tidak pernah "melihat kelelawar" — ia mendapat pesan yang
     bergeser satu, dan yang meluap dipatok jadi nomor empat. */
  T({ baris: 3090, jalan: function (m) { m.v.Q = FNA(m, 7) + m.v.BL; } });
  T({ baris: 3100, jalan: function (m) { if (m.v.Q > 7) m.v.Q = 4; } });
  T({ baris: 3110, bagian: [
      function (m) {
        var d = [3270, 3150, 3250, 3130, 3290, 3310, 3330];
        m._ke = d[m.v.Q - 1];
        if (!m._ke) m.lompat(3120);
      },
      function (m) { m.gosub(m._ke); }
    ] });
  T(ke(3120, 3350));
  T(bisik(3130, 'STEPPED ON A FROG!')); T(pulang(3140));
  T({ baris: 3150, jalan: function (m) { m.cetak('HEAR '); } });
  T({ baris: 3160, jalan: function (m) {
      var d = [3170, 3190, 3210, 3230][FNA(m, 4) - 1];
      if (d) m.lompat(d);
    } });
  T(bisik(3170, 'A SCREAM!')); T(pulang(3180));
  T(bisik(3190, 'FOOTSTEPS!')); T(pulang(3200));
  T(bisik(3210, 'A WUMPUS!')); T(pulang(3220));
  T(bisik(3230, 'THUNDER!')); T(pulang(3240));
  T(bisik(3250, 'SNEEZED!')); T(pulang(3260));
  T(bisik(3270, 'SEE A BAT FLY BY!')); T(pulang(3280));
  T({ baris: 3290, jalan: function (m) {
      m.cetak('SMELL ' + m.v['C$()'][12 + FNA(m, 13)] + ' FRYING!');
      m.barisBaru();
    } });
  T(pulang(3300));
  T(bisik(3310, "FEEL LIKE YOU'RE BEING WATCHED!")); T(pulang(3320));
  T(bisik(3330, 'HEAR FAINT RUSTLING NOISES!')); T(pulang(3340));
  /* 3350-3420 harta yang menyembuhkan: `BL+T(4)=2` berarti buta DAN
     punya Opal Eye. Dua bendera dijumlahkan, bukan diperiksa satu-satu. */
  T({ baris: 3350, jalan: function (m) {
      if (m.v.BL + m.v['T()'][4] !== 2) m.lompat(3390);
    } });
  T({ baris: 3360, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3370, jalan: function (m) {
      m.cetak(m.v['C$()'][29] + ' CURES YOUR BLINDNESS!'); m.barisBaru();
    } });
  T({ baris: 3380, jalan: function (m) { m.v.BL = 0; } });
  T({ baris: 3390, jalan: function (m) {
      if (m.v.BF + m.v['T()'][6] !== 2) m.lompat(3430);
    } });
  T({ baris: 3400, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3410, jalan: function (m) {
      m.cetak(m.v['C$()'][31] + ' DISSOLVES THE BOOK!'); m.barisBaru();
    } });
  T({ baris: 3420, jalan: function (m) { m.v.BF = 0; } });
  T({ baris: 3430, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3440, jalan: function (m) {
      m.masukan('O$', 'ENTER YOUR COMMAND : ');
    } });

  /* --- 3450-3880: pemilah perintah ------------------------------------- */
  T({ baris: 3450, jalan: function (m) {
      if (LEFT(m.v['O$'], 2) === 'DR') m.lompat(4760);
    } });
  T({ baris: 3460, jalan: function (m) { m.v['O$'] = LEFT(m.v['O$'], 1); } });
  T(perintah(3470, 'N', 3890));
  T({ baris: 3480, jalan: function (m) {
      var o = m.v['O$'];
      if (o === 'S' || o === 'W' || o === 'E') m.lompat(3900);
    } });
  T(perintah(3490, 'U', 3950));
  T(perintah(3500, 'D', 3980));
  T(perintah(3510, 'M', 4030));
  /* 3520-3550 `ON BL+1 GOTO a,b` — kebutaan dipakai LANGSUNG sebagai
     indeks cabang: melek ke perintahnya, buta ke pesan penolakan. */
  T(butaKe(3520, 'F', 4260, 4030));
  T(butaKe(3530, 'L', 4520, 4030));
  T(perintah(3540, 'O', 4950));
  T(butaKe(3550, 'G', 5390, 4030));
  T({ baris: 3560, jalan: function (m) {
      if (m.v['O$'] === 'T') {
        m.barisBaru();
        m.lompat([5650, 5690][m.v.RF] || 5650);
      }
    } });
  T(perintah(3570, 'Q', 5800));
  T({ baris: 3580, jalan: function (m) {
      if (m.v['O$'] !== 'H') m.lompat(3860);
    } });
  T({ baris: 3590, jalan: function (m) { m.cls(); } });
  T(cet(3600, "*** WIZARD'S CASTLE COMMAND AND INFORMATION SUMMARY ***"));
  T({ baris: 3610, jalan: function (m) { m.barisBaru(); } });
  T(cet(3620, 'THE FOLLOWING COMMANDS ARE AVAILABLE :'));
  T({ baris: 3630, jalan: function (m) { m.barisBaru(); } });
  T(cet(3640, 'H/ELP     N/ORTH    S/OUTH    E/AST     W/EST     U/P'));
  T(cet(3650, 'D/OWN     DR/INK    M/AP      F/LARE    L/AMP     O/PEN'));
  T(cet(3660, 'G/AZE     T/ELEPORT Q/UIT'));
  T({ baris: 3670, jalan: function (m) { m.barisBaru(); } });
  T(cet(3680, 'THE CONTENTS OF ROOMS ARE AS FOLLOWS :'));
  T({ baris: 3690, jalan: function (m) { m.barisBaru(); } });
  T(cet(3700, '. = EMPTY ROOM      B = BOOK            C = CHEST'));
  T(cet(3710, 'D = STAIRS DOWN     E = ENTRANCE/EXIT   F = FLARES'));
  T(cet(3720, 'G = GOLD PIECES     M = MONSTER         O = CRYSTAL ORB'));
  T(cet(3730, 'P = MAGIC POOL      S = SINKHOLE        T = TREASURE'));
  T(cet(3740, 'U = STAIRS UP       V = VENDOR          W = WARP/ORB'));
  T({ baris: 3750, jalan: function (m) { m.barisBaru(); } });
  T(cet(3760, 'THE BENEFITS OF HAVING TREASURES ARE :'));
  T({ baris: 3770, jalan: function (m) { m.barisBaru(); } });
  T(cet(3780, 'RUBY RED - AVOID LETHARGY     PALE PEARL - AVOID LEECH'));
  T(cet(3790, 'GREEN GEM - AVOID FORGETTING  OPAL EYE - CURES BLINDNESS'));
  T(cet(3800, 'BLUE FLAME - DISSOLVES BOOKS  NORN STONE - NO BENEFIT'));
  T(cet(3810, 'PALANTIR - NO BENEFIT         SILMARIL - NO BENEFIT'));
  T({ baris: 3820, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3830, jalan: function (m) {
      m.cetak('PRESS RETURN WHEN READY TO RESUME, ' + ras(m) + '.');
    } });
  T({ baris: 3840, jalan: function (m) { m.masukan('O$', ''); } });
  T(ke(3850, 2920));
  T({ baris: 3860, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3870, jalan: function (m) {
      m.cetak('** SILLY ' + ras(m) + ", THAT WASN'T A VALID COMMAND!");
      m.barisBaru();
    } });
  T(ke(3880, 2920));

  /* --- 3890-4030: bergerak --------------------------------------------- */
  /* 3890 keluar dari kastil hanya bisa lewat pintu masuk, ke UTARA. */
  T({ baris: 3890, jalan: function (m) {
      if (L(m, m.v.Z) === 2) m.lompat(8960);
    } });
  T({ baris: 3900, jalan: function (m) {
      m.v.X = m.v.X + b(m.v['O$'] === 'N') * -1 - b(m.v['O$'] === 'S') * -1;
    } });
  T({ baris: 3910, jalan: function (m) {
      m.v.Y = m.v.Y + b(m.v['O$'] === 'W') * -1 - b(m.v['O$'] === 'E') * -1;
    } });
  T({ baris: 3920, jalan: function (m) { m.v.X = FNB(m.v.X); } });
  T({ baris: 3930, jalan: function (m) { m.v.Y = FNB(m.v.Y); } });
  T(ke(3940, 5920));
  T({ baris: 3950, jalan: function (m) {
      if (L(m, m.v.Z) === 3) { m.v.Z = m.v.Z - 1; m.lompat(5920); }
    } });
  T({ baris: 3960, jalan: function (m) { m.v['Z$'] = 'UP'; } });
  T(ke(3970, 4000));
  T({ baris: 3980, jalan: function (m) { m.v['Z$'] = 'DOWN'; } });
  T({ baris: 3990, jalan: function (m) {
      if (L(m, m.v.Z) === 4) { m.v.Z = m.v.Z + 1; m.lompat(5920); }
    } });
  T({ baris: 4000, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4010, jalan: function (m) {
      m.cetak('** THERE ARE NO STAIRS GOING ' + m.v['Z$'] + ' FROM HERE!');
      m.barisBaru();
    } });
  T(ke(4020, 2920));
  T({ baris: 4030, jalan: function (m) { if (m.v.BL !== 1) m.lompat(4100); } });
  T({ baris: 4040, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4050, jalan: function (m) {
      m.cetak("** YOU CAN'T SEE ANYTHING, YOU DUMB " + ras(m) + '!');
      m.barisBaru();
    } });
  T(ke(4060, 2920));

  /* --- 4070-4250: peta ------------------------------------------------- */
  T(rem(4070)); T(rem(4080)); T(rem(4090));
  T({ baris: 4100, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4110, jalan: function (m) { m.v.A = m.v.X; m.v.B = m.v.Y; } });
  T({ baris: 4120, jalan: function (m) { m.untuk('X', 1, 8, 1, 4220); } });
  T({ baris: 4130, jalan: function (m) { m.untuk('Y', 1, 8, 1, 4180); } });
  T({ baris: 4140, jalan: function (m) { m.v.Q = L(m, m.v.Z); } });
  /* 4150 PERINTAH MAP MEMBUKA SELURUH TINGKAT. Angka 100 yang menandai
     "belum pernah dilihat" dicabut begitu saja, jadi peta menampilkan
     semua ruangan — termasuk yang belum pernah didatangi.
     Dan komentar di ujung barisnya menyimpan cara memperbaikinya:
     `' LET Q=34 TO HIDE ROOMS`. Entri ke-34 di daftar isi ruangan adalah
     tanda tanya (baris 9550). Perbaikannya ditulis, tapi tidak dipasang. */
  T({ baris: 4150, jalan: function (m) {
      if (m.v.Q > 99) m.v.Q = m.v.Q - 100;
    } });
  T({ baris: 4160, jalan: function (m) {
      if (m.v.X === m.v.A && m.v.Y === m.v.B) {
        m.cetak('<' + m.v['I$()'][m.v.Q] + '>  '); m.lompat(4180);
      }
    } });
  T({ baris: 4170, jalan: function (m) {
      m.cetak(' ' + m.v['I$()'][m.v.Q] + '   ');
    } });
  T({ baris: 4180, jalan: function (m) { m.lanjutkan('Y'); } });
  T({ baris: 4190, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4200, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4210, jalan: function (m) { m.lanjutkan('X'); } });
  T({ baris: 4220, jalan: function (m) { m.v.X = m.v.A; m.v.Y = m.v.B; } });
  T(ke(4230, 4470));
  /* 4240-4250 TIDAK BISA DICAPAI: baris 4230 melompatinya tanpa syarat. */
  T({ baris: 4240, jalan: function (m) {
      m.cetak(') LEVEL' + bas(m.v.Z)); m.barisBaru();
    } });
  T(ke(4250, 2920));

  /* --- 4260-4480: suar ------------------------------------------------- */
  T({ baris: 4260, jalan: function (m) { if (m.v.FL !== 0) m.lompat(4320); } });
  T(cet(4270, "** HEY, BRIGHT ONE, YOU'RE OUT OF FLARES!"));
  T(ke(4280, 2920));
  /* 4290 komentar yang RUSAK di berkasnya sendiri: tertulis
     "DISeADJACENT ROOM CONTENTS WITH FLARE" — beberapa aksara "PLAY "
     hilang di suatu tempat dalam rantai penyalinannya. */
  T(rem(4290)); T(rem(4300)); T(rem(4310));
  T({ baris: 4320, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4330, jalan: function (m) { m.v.FL = m.v.FL - 1; } });
  T({ baris: 4340, jalan: function (m) { m.v.A = m.v.X; m.v.B = m.v.Y; } });
  T({ baris: 4350, jalan: function (m) {
      m.untuk('Q1', m.v.A - 1, m.v.A + 1, 1, 4460);
    } });
  T({ baris: 4360, jalan: function (m) { m.v.X = FNB(m.v.Q1); } });
  T({ baris: 4370, jalan: function (m) {
      m.untuk('Q2', m.v.B - 1, m.v.B + 1, 1, 4430);
    } });
  T({ baris: 4380, jalan: function (m) { m.v.Y = FNB(m.v.Q2); } });
  /* 4390-4400 suar TIDAK cuma menampilkan — ia MENCATAT ruangan sebagai
     sudah dilihat, jadi kutukan lupa punya sesuatu untuk dilupakan. */
  T({ baris: 4390, jalan: function (m) { m.v.Q = FNE(L(m, m.v.Z)); } });
  T({ baris: 4400, jalan: function (m) { setL(m, m.v.Z, m.v.Q); } });
  T({ baris: 4410, jalan: function (m) {
      m.cetak(' ' + m.v['I$()'][m.v.Q] + '   ');
    } });
  T({ baris: 4420, jalan: function (m) { m.lanjutkan('Q2'); } });
  T({ baris: 4430, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4440, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4450, jalan: function (m) { m.lanjutkan('Q1'); } });
  T({ baris: 4460, jalan: function (m) { m.v.X = m.v.A; m.v.Y = m.v.B; } });
  T({ baris: 4470, jalan: function (m) { m.gosub(10160); } });
  T(ke(4480, 2920));

  /* --- 4490-4720: lampu ------------------------------------------------ */
  T(rem(4490)); T(rem(4500)); T(rem(4510));
  T({ baris: 4520, jalan: function (m) { if (m.v.LF !== 0) m.lompat(4560); } });
  T({ baris: 4530, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4540, jalan: function (m) {
      m.cetak("** YOU DON'T HAVE A LAMP, " + ras(m) + '!'); m.barisBaru();
    } });
  T(ke(4550, 2920));
  T({ baris: 4560, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4570, jalan: function (m) {
      m.cetak('WHERE DO YOU WANT TO SHINE THE LAMP (N,S,E,W)');
    } });
  T({ baris: 4580, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 4590, jalan: function (m) { m.v.A = m.v.X; m.v.B = m.v.Y; } });
  T({ baris: 4600, jalan: function (m) {
      m.v.X = FNB(m.v.X - b(m.v['O$'] === 'N') + b(m.v['O$'] === 'S'));
    } });
  T({ baris: 4610, jalan: function (m) {
      m.v.Y = FNB(m.v.Y - b(m.v['O$'] === 'W') + b(m.v['O$'] === 'E'));
    } });
  /* 4620 arah yang salah ketahuan karena posisinya TIDAK BERUBAH: selisih
     kedua sumbu dijumlahkan, dan nol berarti tidak ke mana-mana. */
  T({ baris: 4620, jalan: function (m) {
      if (m.v.A - m.v.X + m.v.B - m.v.Y !== 0) m.lompat(4660);
    } });
  T({ baris: 4630, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4640, jalan: function (m) {
      m.cetak("** THAT'S NOT A DIRECTION, " + ras(m) + '!'); m.barisBaru();
    } });
  T(ke(4650, 2920));
  T({ baris: 4660, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4670, jalan: function (m) {
      m.cetak('THE LAMP SHINES INTO (' + bas(m.v.X) + ',' + bas(m.v.Y) +
              ') LEVEL' + bas(m.v.Z) + '.'); m.barisBaru();
    } });
  T({ baris: 4680, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4690, jalan: function (m) { setL(m, m.v.Z, FNE(L(m, m.v.Z))); } });
  T({ baris: 4700, jalan: function (m) {
      m.cetak('THERE YOU WILL FIND ' + m.v['C$()'][L(m, m.v.Z)] + '.');
      m.barisBaru();
    } });
  T({ baris: 4710, jalan: function (m) { m.v.X = m.v.A; m.v.Y = m.v.B; } });
  T(ke(4720, 2920));

  /* --- 4730-4940: kolam ajaib ------------------------------------------ */
  T(rem(4730)); T(rem(4740)); T(rem(4750));
  T({ baris: 4760, jalan: function (m) { if (L(m, m.v.Z) === 5) m.lompat(4800); } });
  T({ baris: 4770, jalan: function (m) { m.barisBaru(); } });
  T(cet(4780, '** IF YOU WANT A DRINK, FIND A POOL!'));
  T(ke(4790, 2920));
  T({ baris: 4800, jalan: function (m) { m.v.Q = FNA(m, 8); } });
  T({ baris: 4810, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4820, jalan: function (m) { m.cetak('YOU TAKE A DRINK AND '); } });
  T({ baris: 4830, jalan: function (m) { if (m.v.Q < 7) m.cetak('FEEL '); } });
  T({ baris: 4840, jalan: function (m) {
      var d = [4850, 4860, 4870, 4880, 4890, 4900, 4910, 4930][m.v.Q - 1];
      if (d) m.lompat(d);
    } });
  T(kolamNaik(4850, 'ST', 'STRONGER.')); T(kolamTurun(4860, 'ST', 'WEAKER.'));
  T(kolamNaik(4870, 'IQ', 'SMARTER.')); T(kolamTurun(4880, 'IQ', 'DUMBER.'));
  T(kolamNaik(4890, 'DX', 'NIMBLER.')); T(kolamTurun(4900, 'DX', 'CLUMSIER.'));
  T({ baris: 4910, jalan: function (m) {
      m.v.Q = FNA(m, 4);
      if (m.v.Q === m.v.RC) m.lompat(4910);
    } });
  T({ baris: 4920, jalan: function (m) {
      m.v.RC = m.v.Q;
      m.cetak('BECOME A ' + ras(m) + '.'); m.barisBaru(); m.lompat(2920);
    } });
  T({ baris: 4930, jalan: function (m) {
      m.v.SX = 1 - m.v.SX;
      m.cetak('TURN INTO A ');
      if (m.v.SX === 0) m.cetak('FE');
    } });
  T({ baris: 4940, jalan: function (m) {
      m.cetak('MALE ' + ras(m) + '!'); m.barisBaru(); m.lompat(2920);
    } });

  /* --- 4950-5380: peti dan buku ---------------------------------------- */
  T({ baris: 4950, jalan: function (m) { if (L(m, m.v.Z) !== 6) m.lompat(4990); } });
  T({ baris: 4960, jalan: function (m) { m.barisBaru(); } });
  T(cet(4970, 'YOU OPEN THE CHEST AND'));
  T(ke(4980, 5250));
  T({ baris: 4990, jalan: function (m) { if (L(m, m.v.Z) !== 12) m.lompat(5030); } });
  T({ baris: 5000, jalan: function (m) { m.barisBaru(); } });
  T(cet(5010, 'YOU OPEN THE BOOK AND'));
  T(ke(5020, 5060));
  T({ baris: 5030, jalan: function (m) { m.barisBaru(); } });
  T(cet(5040, '** THE ONLY THING OPENED WAS YOUR BIG MOUTH!'));
  T(ke(5050, 2920));
  T({ baris: 5060, jalan: function (m) {
      var d = [5070, 5100, 5120, 5140, 5170, 5200][FNA(m, 6) - 1];
      if (d) m.lompat(d);
    } });
  T({ baris: 5070, jalan: function (m) {
      m.cetak('FLASH! OH NO! YOU ARE NOW A BLIND ' + ras(m) + '!');
      m.barisBaru();
    } });
  T({ baris: 5080, jalan: function (m) { m.v.BL = 1; } });
  T(ke(5090, 5230));
  T(cet(5100, "IT'S ANOTHER VOLUME OF ZOT'S POETRY! - YECH!!"));
  T(ke(5110, 5230));
  T({ baris: 5120, jalan: function (m) {
      m.cetak("IT'S AN OLD COPY OF PLAY" + m.v['R$()'][FNA(m, 4)] + '!');
      m.barisBaru();
    } });
  T(ke(5130, 5230));
  T(cet(5140, "IT'S A MANUAL OF DEXTERITY!"));
  T({ baris: 5150, jalan: function (m) { m.v.DX = 18; } });
  T(ke(5160, 5230));
  T(cet(5170, "IT'S A MANUAL OF STRENGTH!"));
  T({ baris: 5180, jalan: function (m) { m.v.ST = 18; } });
  T(ke(5190, 5230));
  T(cet(5200, 'THE BOOK STICKS TO YOUR HANDS -'));
  T(cet(5210, 'NOW YOU ARE UNABLE TO DRAW YOUR WEAPON!'));
  T({ baris: 5220, jalan: function (m) { m.v.BF = 1; } });
  T({ baris: 5230, jalan: function (m) { setL(m, m.v.Z, 1); } });
  T(ke(5240, 2920));
  /* 5250 peti: satu dari empat meledak, DUA dari empat memberi emas —
     sasaran kedua dan keempat sama-sama 5300. */
  T({ baris: 5250, jalan: function (m) {
      var d = [5260, 5300, 5340, 5300][FNA(m, 4) - 1];
      if (d) m.lompat(d);
    } });
  T(cet(5260, 'KABOOM! IT EXPLODES!!'));
  T({ baris: 5270, jalan: function (m) { m.v.Q = FNA(m, 6); } });
  T({ baris: 5280, jalan: function (m) { m.gosub(8740); } });
  T(mati(5290, 'ST', 5230));
  T({ baris: 5300, jalan: function (m) { m.v.Q = FNA(m, 1000); } });
  T({ baris: 5310, jalan: function (m) {
      m.cetak('FIND' + bas(m.v.Q) + 'GOLD PIECES!'); m.barisBaru();
    } });
  T({ baris: 5320, jalan: function (m) { m.v.GP = m.v.GP + m.v.Q; } });
  T(ke(5330, 5230));
  T(cet(5340, 'GAS!! YOU STAGGER FROM THE ROOM!'));
  T({ baris: 5350, jalan: function (m) { setL(m, m.v.Z, 1); } });
  T({ baris: 5360, jalan: function (m) { m.v.T = m.v.T + 20; } });
  T({ baris: 5370, jalan: function (m) {
      m.v['O$'] = MID('NSEW', FNA(m, 4), 1);
    } });
  T(ke(5380, 3900));

  /* --- 5390-5640: bola kristal ----------------------------------------- */
  T({ baris: 5390, jalan: function (m) { if (L(m, m.v.Z) === 11) m.lompat(5430); } });
  T({ baris: 5400, jalan: function (m) { m.barisBaru(); } });
  T(cet(5410, "** IT'S HARD TO GAZE WITHOUT AN ORB!"));
  T(ke(5420, 2920));
  T({ baris: 5430, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5440, jalan: function (m) { m.cetak('YOU SEE '); } });
  T({ baris: 5450, jalan: function (m) {
      var d = [5460, 5480, 5500, 5520, 5590, 5630][FNA(m, 6) - 1];
      if (d) m.lompat(d);
    } });
  T(cet(5460, 'YOURSELF IN A BLOODY HEAP!'));
  T({ baris: 5470, jalan: function (m) {
      m.v.ST = m.v.ST - FNA(m, 2);
      m.lompat([2920, 8840][1 - b(m.v.ST < 1) - 1] || 2920);
    } });
  T({ baris: 5480, jalan: function (m) {
      m.cetak('YOURSELF DRINKING FROM A POOL AND BECOMING ' +
              m.v['C$()'][12 + FNA(m, 13)] + '!'); m.barisBaru();
    } });
  T(ke(5490, 2920));
  T({ baris: 5500, jalan: function (m) {
      m.cetak(m.v['C$()'][12 + FNA(m, 13)] + ' GAZING BACK AT YOU!');
      m.barisBaru();
    } });
  T(ke(5510, 2920));
  T({ baris: 5520, jalan: function (m) {
      m.v.A = m.v.X; m.v.B = m.v.Y; m.v.C = m.v.Z;
    } });
  T({ baris: 5530, jalan: function (m) {
      m.v.X = FNA(m, 8); m.v.Y = FNA(m, 8); m.v.Z = FNA(m, 8);
    } });
  T({ baris: 5540, jalan: function (m) { m.v.Q = FNE(L(m, m.v.Z)); } });
  T({ baris: 5550, jalan: function (m) { setL(m, m.v.Z, m.v.Q); } });
  T({ baris: 5560, jalan: function (m) {
      m.cetak(m.v['C$()'][m.v.Q] + ' AT (' + bas(m.v.X) + ',' + bas(m.v.Y) +
              ') LEVEL' + bas(m.v.Z) + '.'); m.barisBaru();
    } });
  T({ baris: 5570, jalan: function (m) {
      m.v.X = m.v.A; m.v.Y = m.v.B; m.v.Z = m.v.C;
    } });
  T(ke(5580, 2920));
  T({ baris: 5590, jalan: function (m) {
      m.v.A = FNA(m, 8); m.v.B = FNA(m, 8); m.v.C = FNA(m, 8);
    } });
  /* 5600 BOLA KRISTAL BERBOHONG SETENGAH WAKTU: hanya kalau undiannya di
     bawah empat dari delapan, tempat Orb yang sebenarnya diberikan. */
  T({ baris: 5600, jalan: function (m) {
      if (FNA(m, 8) < 4) {
        m.v.A = m.v['O()'][1]; m.v.B = m.v['O()'][2]; m.v.C = m.v['O()'][3];
      }
    } });
  T({ baris: 5610, jalan: function (m) {
      m.cetak('***THE ORB OF ZOT*** AT (' + bas(m.v.A) + ',' + bas(m.v.B) +
              ') LEVEL' + bas(m.v.C) + '!'); m.barisBaru();
    } });
  T(ke(5620, 2920));
  T(cet(5630, 'A SOAP OPERA RERUN!'));
  T(ke(5640, 2920));

  /* --- 5650-5880: teleportasi dan menyerah ----------------------------- */
  T({ baris: 5650, jalan: function (m) { if (m.v.RF !== 0) m.lompat(5690); } });
  T({ baris: 5660, jalan: function (m) { m.barisBaru(); } });
  T(cet(5670, "** YOU CAN'T TELEPORT WITHOUT THE RUNESTAFF!"));
  T(ke(5680, 2920));
  T(koord(5690, 5700, 5710, 'X-COORDINATE', 'X'));
  T(koord(5720, 5730, 5740, 'Y-COORDINATE', 'Y'));
  T(koord(5750, 5760, 5770, 'Z-COORDINATE', 'Z'));
  T({ baris: 5780, jalan: function (m) { m.v['O$'] = 'T'; } });
  T(ke(5790, 5920));
  T({ baris: 5800, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5810, jalan: function (m) {
      m.cetak('DO YOU REALLY WANT TO QUIT NOW');
    } });
  T({ baris: 5820, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 5830, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5840, jalan: function (m) { if (m.v['O$'] === 'Y') m.lompat(5870); } });
  T(cet(5850, "** THEN DON'T SAY THAT YOU DO!"));
  T(ke(5860, 2920));
  T({ baris: 5870, jalan: function (m) { m.barisBaru(); } });
  T(ke(5880, 9080));

  /* --- 5890-6170: masuk ruangan ---------------------------------------- */
  T(rem(5890)); T(rem(5900)); T(rem(5910));
  T({ baris: 5920, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5930, bagian: [
      function (m) { if (m.v.BL !== 0) m.lompat(5940); },
      function (m) { m.gosub(10160); },
      function (m) { m.barisBaru(); }
    ] });
  T({ baris: 5940, jalan: function (m) {
      m.cetak('STRENGTH =' + bas(m.v.ST) + ' INTELLIGENCE =' + bas(m.v.IQ) +
              ' DEXTERITY =' + bas(m.v.DX)); m.barisBaru();
    } });
  T({ baris: 5950, jalan: function (m) {
      m.cetak('TREASURES =' + bas(m.v.TC) + ' FLARES =' + bas(m.v.FL) +
              ' GOLD PIECES =' + bas(m.v.GP)); m.barisBaru();
    } });
  /* 5960 SATU LARIK, DUA DAFTAR: `W$(WV+1)` nama senjata, `W$(AV+5)` nama
     baju zirah. Keempat senjata di 1-4, keempat baju di 5-8. */
  T({ baris: 5960, jalan: function (m) {
      m.cetak('WEAPON = ' + m.v['W$()'][m.v.WV + 1] + '  ARMOR = ' +
              m.v['W$()'][m.v.AV + 5]);
    } });
  T({ baris: 5970, jalan: function (m) {
      if (m.v.LF === 1) m.cetak('  AND A LAMP');
    } });
  T({ baris: 5980, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5990, jalan: function (m) { m.v.WC = 0; } });
  T({ baris: 6000, jalan: function (m) { m.v.Q = FNE(L(m, m.v.Z)); } });
  T({ baris: 6010, jalan: function (m) { setL(m, m.v.Z, m.v.Q); } });
  T({ baris: 6020, jalan: function (m) { m.v['Z$'] = 'YOU NOW HAVE'; } });
  T({ baris: 6030, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6040, jalan: function (m) {
      m.cetak('HERE YOU FIND ' + m.v['C$()'][m.v.Q] + '.'); m.barisBaru();
    } });
  T({ baris: 6050, jalan: function (m) {
      if (m.v.Q < 7 || m.v.Q === 11 || m.v.Q === 12) m.lompat(2920);
    } });
  T({ baris: 6060, jalan: function (m) {
      if (m.v.Q === 7) {
        m.v.GP = m.v.GP + FNA(m, 10);
        m.cetak(m.v['Z$'] + bas(m.v.GP) + '.'); m.barisBaru();
        m.lompat(5230);
      }
    } });
  T({ baris: 6070, jalan: function (m) {
      if (m.v.Q === 8) {
        m.v.FL = m.v.FL + FNA(m, 5);
        m.cetak(m.v['Z$'] + bas(m.v.FL) + '.'); m.barisBaru();
        m.lompat(5230);
      }
    } });
  T({ baris: 6080, jalan: function (m) { if (m.v.Q > 9) m.lompat(6110); } });
  /* 6090 RUANGAN ORB OF ZOT MENYAMAR JADI WARP. Berjalan masuk membuat
     pemain terlempar satu petak lagi (3900); hanya teleportasi — yang
     menyetel O$="T" — yang membawanya ke 9370 dan memberikan Orb-nya. */
  T({ baris: 6090, jalan: function (m) {
      if (m.v['O()'][1] === m.v.X && m.v['O()'][2] === m.v.Y &&
          m.v['O()'][3] === m.v.Z) {
        m.lompat(m.v['O$'] === 'T' ? 9370 : 3900);
      }
    } });
  T({ baris: 6100, jalan: function (m) {
      m.v.X = FNA(m, 8); m.v.Y = FNA(m, 8); m.v.Z = FNA(m, 8);
      m.lompat(5920);
    } });
  T({ baris: 6110, jalan: function (m) {
      if (m.v.Q === 10) { m.v.Z = FNB(m.v.Z + 1); m.lompat(5920); }
    } });
  T({ baris: 6120, jalan: function (m) {
      if (m.v.Q <= 25 || m.v.Q >= 34) m.lompat(6180);
    } });
  T({ baris: 6130, jalan: function (m) { m.barisBaru(); } });
  T(cet(6140, "IT'S NOW YOURS!"));
  T({ baris: 6150, jalan: function (m) { m.v['T()'][m.v.Q - 25] = 1; } });
  T({ baris: 6160, jalan: function (m) { m.v.TC = m.v.TC + 1; } });
  T(ke(6170, 5230));

  /* --- 6180-7380: pedagang --------------------------------------------- */
  T({ baris: 6180, jalan: function (m) { m.v.A = L(m, m.v.Z) - 12; } });
  T({ baris: 6190, jalan: function (m) { m.v.WC = 0; } });
  T({ baris: 6200, jalan: function (m) {
      if (m.v.A < 13 || m.v.VF === 1) m.lompat(7390);
    } });
  T({ baris: 6210, jalan: function (m) { m.barisBaru(); } });
  T(cet(6220, 'YOU MAY TRADE WITH, ATTACK, OR IGNORE THE VENDOR.'));
  T({ baris: 6230, jalan: function (m) { m.gosub(9830); } });
  T({ baris: 6240, jalan: function (m) { if (m.v['O$'] === 'I') m.lompat(2920); } });
  T({ baris: 6250, jalan: function (m) { if (m.v['O$'] !== 'A') m.lompat(6300); } });
  T({ baris: 6260, jalan: function (m) { m.v.VF = 1; } });
  T({ baris: 6270, jalan: function (m) { m.barisBaru(); } });
  T(cet(6280, "YOU'LL BE SORRY THAT YOU DID THAT!"));
  T(ke(6290, 7390));
  T({ baris: 6300, jalan: function (m) { if (m.v['O$'] === 'T') m.lompat(6340); } });
  T({ baris: 6310, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6320, jalan: function (m) {
      m.cetak('** NICE SHOT, ' + ras(m) + '!'); m.barisBaru();
    } });
  T(ke(6330, 6210));
  T({ baris: 6340, jalan: function (m) { m.untuk('Q', 1, 8, 1, 6430); } });
  /* 6350 harga naik menurut NOMOR hartanya: harta kedelapan bisa laku
     sampai dua belas ribu keping, yang pertama paling sedikit. */
  T({ baris: 6350, jalan: function (m) { m.v.A = FNA(m, m.v.Q * 1500); } });
  T({ baris: 6360, jalan: function (m) {
      if (m.v['T()'][m.v.Q] === 0) m.lompat(6420);
    } });
  T({ baris: 6370, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6380, jalan: function (m) {
      m.cetak('DO YOU WANT TO SELL ' + m.v['C$()'][m.v.Q + 25] + ' FOR' +
              bas(m.v.A) + "GP'S");
    } });
  T({ baris: 6390, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 6400, jalan: function (m) {
      if (m.v['O$'] === 'Y') {
        m.v.TC = m.v.TC - 1; m.v['T()'][m.v.Q] = 0;
        m.v.GP = m.v.GP + m.v.A; m.lompat(6420);
      }
    } });
  T({ baris: 6410, jalan: function (m) {
      if (m.v['O$'] !== 'N') {
        m.cetak(m.v['Y$']); m.barisBaru(); m.lompat(6370);
      }
    } });
  T({ baris: 6420, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 6430, jalan: function (m) { if (m.v.GP >= 1000) m.lompat(6470); } });
  T({ baris: 6440, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6450, jalan: function (m) {
      m.cetak("YOU'RE TOO POOR TO TRADE, " + ras(m) + '.'); m.barisBaru();
    } });
  T(ke(6460, 2920));
  T({ baris: 6470, jalan: function (m) { if (m.v.GP < 1250) m.lompat(6970); } });
  T({ baris: 6480, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6490, jalan: function (m) {
      m.cetak('OK, ' + ras(m) + ', YOU HAVE' + bas(m.v.GP) + "GP'S AND " +
              m.v['W$()'][m.v.AV + 5] + ' ARMOR.'); m.barisBaru();
    } });
  T({ baris: 6500, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6510, jalan: function (m) { m.v['Z$'] = 'ARMOR'; } });
  T({ baris: 6520, jalan: function (m) { m.gosub(10130); } });
  T({ baris: 6530, jalan: function (m) { m.cetak('NOTHING<0> LEATHER<1250> '); } });
  T({ baris: 6540, jalan: function (m) {
      if (m.v.GP > 1499) m.cetak('CHAINMAIL<1500> ');
    } });
  T({ baris: 6550, jalan: function (m) {
      if (m.v.GP > 1999) m.cetak('PLATE<2000>');
    } });
  T({ baris: 6560, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6570, jalan: function (m) { m.gosub(9830); } });
  T({ baris: 6580, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6590, jalan: function (m) { if (m.v['O$'] === 'N') m.lompat(6720); } });
  T(beli(6600, 'L', 1250, 'AV', 1, 'AH', 7, 6720));
  T({ baris: 6610, jalan: function (m) {
      if (m.v['O$'] !== 'C' || m.v.GP >= 1500) m.lompat(6640);
    } });
  T(cet(6620, "** YOU HAVEN'T GOT THAT MUCH CASH ON HAND!"));
  T(ke(6630, 6500));
  T(beli(6640, 'C', 1500, 'AV', 2, 'AH', 14, 6720));
  T({ baris: 6650, jalan: function (m) {
      if (m.v['O$'] !== 'P' || m.v.GP >= 2000) m.lompat(6680);
    } });
  T(cet(6660, "** YOU CAN'T AFFORD PLATE ARMOR!"));
  T(ke(6670, 6500));
  T(beli(6680, 'P', 2000, 'AV', 3, 'AH', 21, 6720));
  T({ baris: 6690, jalan: function (m) { m.barisBaru(); } });
  T(cet(6700, "** DON'T BE SILLY. CHOOSE A SELECTION."));
  T(ke(6710, 6560));
  T({ baris: 6720, jalan: function (m) { if (m.v.GP < 1250) m.lompat(6970); } });
  T({ baris: 6730, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6740, jalan: function (m) {
      m.cetak('YOU HAVE' + bas(m.v.GP) + "GP'S LEFT WITH " +
              m.v['W$()'][m.v.WV + 1] + ' IN HAND.'); m.barisBaru();
    } });
  T({ baris: 6750, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6760, jalan: function (m) { m.v['Z$'] = 'WEAPON'; } });
  T({ baris: 6770, jalan: function (m) { m.gosub(10130); } });
  T({ baris: 6780, jalan: function (m) { m.cetak('NOTHING<0> DAGGER<1250> '); } });
  T({ baris: 6790, jalan: function (m) {
      if (m.v.GP > 1499) m.cetak('MACE<1500> ');
    } });
  T({ baris: 6800, jalan: function (m) {
      if (m.v.GP > 1999) m.cetak('SWORD<2000>');
    } });
  T({ baris: 6810, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6820, jalan: function (m) { m.gosub(9830); } });
  T({ baris: 6830, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6840, jalan: function (m) { if (m.v['O$'] === 'N') m.lompat(6970); } });
  T(beli(6850, 'D', 1250, 'WV', 1, null, 0, 6970));
  T({ baris: 6860, jalan: function (m) {
      if (m.v['O$'] !== 'M' || m.v.GP >= 1500) m.lompat(6890);
    } });
  T(cet(6870, "** SORRY SIR, I'M AFRAID I DON'T GIVE CREDIT!"));
  T(ke(6880, 6750));
  T(beli(6890, 'M', 1500, 'WV', 2, null, 0, 6970));
  T({ baris: 6900, jalan: function (m) {
      if (m.v['O$'] !== 'S' || m.v.GP >= 2000) m.lompat(6940);
    } });
  T({ baris: 6910, jalan: function (m) {
      m.cetak('** YOUR DUNGEON EXPRESS CARD - ');
    } });
  T(cet(6920, 'YOU LEFT HOME WITHOUT IT!'));
  T(ke(6930, 6750));
  T(beli(6940, 'S', 2000, 'WV', 3, null, 0, 6970));
  T(cet(6950, '** TRY CHOOSING A SELECTION!'));
  T(ke(6960, 6810));
  T(ramuan(6970, 6980, 6990, 7000, 7010, 7020, 7030, 7040, 7050, 7060,
           'STRENGTH', 'ST', 6970));
  T(ramuan(7070, 7080, 7090, 7100, 7110, 7120, 7130, 7140, 7150, 7160,
           'INTELLIGENCE', 'IQ', 7070));
  T(ramuan(7170, 7180, 7190, 7200, 7210, 7220, 7230, 7240, 7250, 7260,
           'DEXTERITY', 'DX', 7170));
  T({ baris: 7270, jalan: function (m) {
      if (m.v.GP < 1000 || m.v.LF === 1) m.lompat(2920);
    } });
  T({ baris: 7280, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7290, jalan: function (m) {
      m.cetak("DO YOU WANT TO BUY A LAMP FOR 1000 GP'S");
    } });
  T({ baris: 7300, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 7310, jalan: function (m) { if (m.v['O$'] !== 'Y') m.lompat(7370); } });
  T({ baris: 7320, jalan: function (m) { m.v.GP = m.v.GP - 1000; } });
  T({ baris: 7330, jalan: function (m) { m.v.LF = 1; } });
  T({ baris: 7340, jalan: function (m) { m.barisBaru(); } });
  T(cet(7350, "IT'S GUARANTEED TO OUTLIVE YOU!"));
  T(ke(7360, 2920));
  T({ baris: 7370, jalan: function (m) {
      if (m.v['O$'] !== 'N') {
        m.cetak(m.v['Y$']); m.barisBaru(); m.lompat(7280);
      }
    } });
  T(ke(7380, 2920));

  /* --- 7390-8830: pertarungan ------------------------------------------ */
  /* 7390 kekuatan monster dihitung dari NOMORNYA: makin jauh di daftar,
     makin besar pukulannya dan makin banyak nyawanya. */
  T({ baris: 7390, jalan: function (m) {
      m.v.Q1 = 1 + Math.trunc(m.v.A / 2);
      m.v.Q2 = m.v.A + 2; m.v.Q3 = 1;
    } });
  /* 7400 tiga hal sekaligus membuat pemain kehilangan giliran pertama:
     kutukan lesu, kebutaan, atau ketangkasan yang kalah undian. */
  T({ baris: 7400, jalan: function (m) {
      if (m.v['C()'][1][4] > m.v['T()'][1] || m.v.BL === 1 ||
          m.v.DX < FNA(m, 9) + FNA(m, 9)) m.lompat(8420);
    } });
  T({ baris: 7410, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7420, jalan: function (m) {
      m.cetak("YOU'RE FACING " + m.v['C$()'][m.v.A + 12] + '!'); m.barisBaru();
    } });
  T({ baris: 7430, jalan: function (m) { m.barisBaru(); } });
  T(cet(7440, 'YOU MAY ATTACK OR RETREAT.'));
  T({ baris: 7450, jalan: function (m) {
      if (m.v.Q3 === 1) {
        m.cetak('YOU CAN ALSO ATTEMPT A BRIBE.'); m.barisBaru();
      }
    } });
  T({ baris: 7460, jalan: function (m) {
      if (m.v.IQ > 14) {
        m.cetak('YOU CAN ALSO CAST A SPELL.'); m.barisBaru();
      }
    } });
  T({ baris: 7470, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7480, jalan: function (m) {
      m.cetak('YOUR STRENGTH IS' + bas(m.v.ST) + 'AND YOUR DEXTERITY IS' +
              bas(m.v.DX) + '.'); m.barisBaru();
    } });
  T({ baris: 7490, jalan: function (m) { m.gosub(9830); } });
  T({ baris: 7500, jalan: function (m) { if (m.v['O$'] !== 'A') m.lompat(7910); } });
  T({ baris: 7510, jalan: function (m) { if (m.v.WV !== 0) m.lompat(7550); } });
  T({ baris: 7520, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7530, jalan: function (m) {
      m.cetak('** POUNDING ON ' + m.v['C$()'][m.v.A + 12] + " WON'T HURT IT!");
      m.barisBaru();
    } });
  T(ke(7540, 8420));
  T({ baris: 7550, jalan: function (m) { if (m.v.BF !== 1) m.lompat(7590); } });
  T({ baris: 7560, jalan: function (m) { m.barisBaru(); } });
  T(cet(7570, "** YOU CAN'T BEAT IT TO DEATH WITH A BOOK!"));
  T(ke(7580, 8420));
  T({ baris: 7590, jalan: function (m) {
      if (m.v.DX >= FNA(m, 20) + 3 * m.v.BL) m.lompat(7630);
    } });
  T({ baris: 7600, jalan: function (m) { m.barisBaru(); } });
  T(cet(7610, 'YOU MISSED, TOO BAD!'));
  T(ke(7620, 8420));
  /* 7630-7640 MEMBUANG KATA SANDANG: dua aksara pertama dipotong, lalu
     kalau yang tersisa masih diawali spasi ("AN ORC" jadi " ORC"), spasi
     itu dibuang juga. Satu aturan untuk "A" dan "AN" sekaligus. */
  T(potongSandang(7630)); T(potongSandang2(7640));
  T({ baris: 7650, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7660, jalan: function (m) {
      m.cetak('YOU HIT THE EVIL ' + m.v['Z$'] + '!'); m.barisBaru();
    } });
  T({ baris: 7670, jalan: function (m) { m.v.Q2 = m.v.Q2 - m.v.WV; } });
  T({ baris: 7680, jalan: function (m) {
      if (m.v.A !== 9 && m.v.A !== 12) m.lompat(7730);
    } });
  /* 7690 gargoyle dan naga bisa MEMATAHKAN senjata — satu dari delapan. */
  T({ baris: 7690, jalan: function (m) {
      if (FNA(m, 8) !== 1) m.lompat(7730);
    } });
  T({ baris: 7700, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7710, jalan: function (m) {
      m.cetak('OH NO! YOUR ' + m.v['W$()'][m.v.WV + 1] + ' BROKE!');
      m.barisBaru();
    } });
  T({ baris: 7720, jalan: function (m) { m.v.WV = 0; } });
  T({ baris: 7730, jalan: function (m) { if (m.v.Q2 > 0) m.lompat(8420); } });
  T({ baris: 7740, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7750, jalan: function (m) { m.v.MC = (m.v.MC || 0) - 1; } });
  T({ baris: 7760, jalan: function (m) {
      m.cetak(m.v['C$()'][m.v.A + 12] + ' LIES DEAD AT YOUR FEET!');
      m.barisBaru();
    } });
  /* 7770-7800 MONSTERNYA JADI MAKAN SIANG. `E$()` menyimpan delapan nama
     hidangan, dan namanya disambung ke nama monster: "AN ORC BURGER". */
  T({ baris: 7770, jalan: function (m) {
      if ((m.v.H || 0) > m.v.T - 60) m.lompat(7810);
    } });
  T({ baris: 7780, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7790, jalan: function (m) {
      m.cetak('YOU SPEND AN HOUR EATING ' + m.v['C$()'][m.v.A + 12] +
              m.v['E$()'][FNA(m, 8)] + '.'); m.barisBaru();
    } });
  T({ baris: 7800, jalan: function (m) { m.v.H = m.v.T; } });
  T({ baris: 7810, jalan: function (m) {
      if (m.v.X !== m.v['R()'][1] || m.v.Y !== m.v['R()'][2] ||
          m.v.Z !== m.v['R()'][3]) {
        m.lompat(m.v.A === 13 ? 9630 : 7860);
      }
    } });
  T({ baris: 7820, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7830, jalan: function (m) {
      m.cetak("GREAT ZOT! YOU'VE FOUND THE RUNESTAFF!"); m.bunyi();
      m.barisBaru();
    } });
  T({ baris: 7840, jalan: function (m) { m.v['R()'][1] = 0; } });
  T({ baris: 7850, jalan: function (m) { m.v.RF = 1; } });
  T({ baris: 7860, jalan: function (m) { m.v.Q = FNA(m, 1000); } });
  T({ baris: 7870, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7880, jalan: function (m) {
      m.cetak('YOU NOW GET HIS HOARD OF' + bas(m.v.Q) + "GP'S");
      m.barisBaru();
    } });
  T({ baris: 7890, jalan: function (m) { m.v.GP = m.v.GP + m.v.Q; } });
  T(ke(7900, 5230));
  T({ baris: 7910, jalan: function (m) { if (m.v['O$'] === 'R') m.lompat(8420); } });
  T({ baris: 7920, jalan: function (m) { if (m.v['O$'] !== 'C') m.lompat(8210); } });
  T({ baris: 7930, jalan: function (m) {
      if (m.v.IQ >= 15 || m.v.Q3 <= 1) m.lompat(7970);
    } });
  T({ baris: 7940, jalan: function (m) { m.barisBaru(); } });
  T(cet(7950, "** YOU CAN'T CAST A SPELL NOW!"));
  T(ke(7960, 7410));
  T({ baris: 7970, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7980, jalan: function (m) {
      m.cetak('WHICH SPELL (WEB, FIREBALL, DEATHSPELL)');
    } });
  T({ baris: 7990, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 8000, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8010, jalan: function (m) { if (m.v['O$'] !== 'W') m.lompat(8050); } });
  T({ baris: 8020, jalan: function (m) { m.v.ST = m.v.ST - 1; } });
  T({ baris: 8030, jalan: function (m) { m.v.WC = FNA(m, 8) + 1; } });
  T(mati(8040, 'ST', 8420));
  T({ baris: 8050, jalan: function (m) { if (m.v['O$'] !== 'F') m.lompat(8140); } });
  T({ baris: 8060, jalan: function (m) { m.v.Q = FNA(m, 7) + FNA(m, 7); } });
  T({ baris: 8070, jalan: function (m) { m.v.ST = m.v.ST - 1; } });
  T({ baris: 8080, jalan: function (m) { m.v.IQ = m.v.IQ - 1; } });
  T({ baris: 8090, jalan: function (m) {
      if (m.v.IQ < 1 || m.v.ST < 1) m.lompat(8840);
    } });
  T({ baris: 8100, jalan: function (m) {
      m.cetak('IT DOES' + bas(m.v.Q) + 'POINTS WORTH OF DAMAGE.');
      m.barisBaru();
    } });
  T({ baris: 8110, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8120, jalan: function (m) { m.v.Q2 = m.v.Q2 - m.v.Q; } });
  T(ke(8130, 7730));
  T({ baris: 8140, jalan: function (m) { if (m.v['O$'] === 'D') m.lompat(8180); } });
  T({ baris: 8150, jalan: function (m) { m.barisBaru(); } });
  T(cet(8160, '** TRY ONE OF THE OPTIONS GIVEN.'));
  T(ke(8170, 7410));
  T({ baris: 8180, jalan: function (m) { m.cetak('DEATH . . . '); } });
  /* 8190 MANTRA MAUT ADALAH TARUHAN: kecerdasan pemain diadu dengan
     lima belas ditambah undian empat. Kalah berarti mati seketika. */
  T({ baris: 8190, jalan: function (m) {
      if (m.v.IQ < FNA(m, 4) + 15) {
        m.cetak('YOURS!'); m.barisBaru(); m.v.IQ = 0; m.lompat(8840);
      }
    } });
  T({ baris: 8200, jalan: function (m) {
      m.cetak('HIS!'); m.barisBaru(); m.v.Q2 = 0; m.lompat(7740);
    } });
  T({ baris: 8210, jalan: function (m) {
      if (m.v['O$'] === 'B' && m.v.Q3 <= 1) m.lompat(8250);
    } });
  T({ baris: 8220, jalan: function (m) { m.barisBaru(); } });
  T(cet(8230, '** CHOOSE ONE OF THE OPTIONS LISTED.'));
  T(ke(8240, 7410));
  T({ baris: 8250, jalan: function (m) { if (m.v.TC !== 0) m.lompat(8290); } });
  T({ baris: 8260, jalan: function (m) { m.barisBaru(); } });
  T(cet(8270, 'ALL I WANT IS YOUR LIFE!'));
  T(ke(8280, 8420));
  T({ baris: 8290, jalan: function (m) { m.v.Q = FNA(m, 8); } });
  T({ baris: 8300, jalan: function (m) {
      if (m.v['T()'][m.v.Q] === 0) m.lompat(8290);
    } });
  T({ baris: 8310, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8320, jalan: function (m) {
      m.cetak('I WANT ' + m.v['C$()'][m.v.Q + 25] +
              '. WILL YOU GIVE IT TO ME');
    } });
  T({ baris: 8330, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 8340, jalan: function (m) { if (m.v['O$'] === 'N') m.lompat(8420); } });
  T({ baris: 8350, jalan: function (m) {
      if (m.v['O$'] !== 'Y') {
        m.cetak(m.v['Y$']); m.barisBaru(); m.lompat(8310);
      }
    } });
  T({ baris: 8360, jalan: function (m) { m.v['T()'][m.v.Q] = 0; } });
  T({ baris: 8370, jalan: function (m) { m.v.TC = m.v.TC - 1; } });
  T({ baris: 8380, jalan: function (m) { m.barisBaru(); } });
  T(cet(8390, "OK, JUST DON'T TELL ANYONE ELSE."));
  /* 8400 MENYUAP PEDAGANG MEMULIHKAN PERDAGANGAN: `VF+(L=25)` menambah
     minus satu, jadi bendera permusuhan turun kembali ke nol. */
  T({ baris: 8400, jalan: function (m) {
      m.v.VF = m.v.VF + b(L(m, m.v.Z) === 25);
    } });
  T(ke(8410, 2920));
  T({ baris: 8420, jalan: function (m) { m.v.Q3 = 2; } });
  T({ baris: 8430, jalan: function (m) { if (m.v.WC <= 0) m.lompat(8460); } });
  T({ baris: 8440, jalan: function (m) { m.v.WC = m.v.WC - 1; } });
  T({ baris: 8450, jalan: function (m) {
      if (m.v.WC === 0) {
        m.barisBaru(); m.cetak('THE WEB JUST BROKE!'); m.barisBaru();
      }
    } });
  T(potongSandang(8460)); T(potongSandang2(8470));
  T({ baris: 8480, jalan: function (m) { if (m.v.WC <= 0) m.lompat(8520); } });
  T({ baris: 8490, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8500, jalan: function (m) {
      m.cetak('THE ' + m.v['Z$'] + " IS STUCK AND CAN'T ATTACK NOW!");
      m.barisBaru();
    } });
  T(ke(8510, 8630));
  T({ baris: 8520, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8530, jalan: function (m) {
      m.cetak('THE ' + m.v['Z$'] + ' ATTACKS!'); m.barisBaru();
    } });
  T({ baris: 8540, jalan: function (m) {
      if (m.v.DX < FNA(m, 7) + FNA(m, 7) + FNA(m, 7) + 3 * m.v.BL) {
        m.lompat(8580);
      }
    } });
  T({ baris: 8550, jalan: function (m) { m.barisBaru(); } });
  T(cet(8560, 'WHAT LUCK, HE MISSED YOU!'));
  T(ke(8570, 8630));
  T({ baris: 8580, jalan: function (m) { m.barisBaru(); } });
  T(cet(8590, 'OUCH! HE HIT YOU!'));
  T({ baris: 8600, jalan: function (m) { m.v.Q = m.v.Q1; } });
  T({ baris: 8610, jalan: function (m) { m.gosub(8740); } });
  T({ baris: 8620, jalan: function (m) { if (m.v.ST < 1) m.lompat(8840); } });
  T({ baris: 8630, jalan: function (m) { if (m.v['O$'] !== 'R') m.lompat(7410); } });
  T({ baris: 8640, jalan: function (m) { m.barisBaru(); } });
  T(cet(8650, 'YOU HAVE ESCAPED!'));
  T({ baris: 8660, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8670, jalan: function (m) {
      m.cetak('DO YOU WANT TO GO NORTH, SOUTH, EAST, OR WEST');
    } });
  T({ baris: 8680, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 8690, jalan: function (m) {
      var o = m.v['O$'];
      if (o === 'N' || o === 'S' || o === 'E' || o === 'W') m.lompat(3900);
    } });
  T({ baris: 8700, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8710, jalan: function (m) {
      m.cetak("** DON'T PRESS YOUR LUCK, " + ras(m) + '!'); m.barisBaru();
    } });
  T({ baris: 8720, jalan: function (m) { m.barisBaru(); } });
  T(ke(8730, 8670));
  /* 8740-8830 BAJU ZIRAH MENYERAP, LALU RUSAK. `AH` adalah sisa daya
     tahannya; sekali habis, seluruh perlindungan hilang sekaligus. */
  T({ baris: 8740, jalan: function (m) { if (m.v.AV === 0) m.lompat(8820); } });
  T({ baris: 8750, jalan: function (m) { m.v.Q = m.v.Q - m.v.AV; } });
  T({ baris: 8760, jalan: function (m) { m.v.AH = m.v.AH - m.v.AV; } });
  T({ baris: 8770, jalan: function (m) {
      if (m.v.Q < 0) { m.v.AH = m.v.AH - m.v.Q; m.v.Q = 0; }
    } });
  T({ baris: 8780, jalan: function (m) { if (m.v.AH >= 0) m.lompat(8820); } });
  T({ baris: 8790, jalan: function (m) { m.v.AH = 0; m.v.AV = 0; } });
  T({ baris: 8800, jalan: function (m) { m.barisBaru(); } });
  T(cet(8810, 'YOUR ARMOR HAS BEEN DESTROYED . . . GOOD LUCK!'));
  T({ baris: 8820, jalan: function (m) { m.v.ST = m.v.ST - m.v.Q; } });
  T(pulang(8830));

  /* --- 8840-9460: akhir permainan -------------------------------------- */
  T({ baris: 8840, jalan: function (m) { m.bunyi(); m.barisBaru(); } });
  T({ baris: 8850, jalan: function (m) { m.gosub(9770); } });
  T({ baris: 8860, jalan: function (m) {
      m.cetak('A NOBLE EFFORT, OH FORMERLY LIVING ' + ras(m) + '!');
      m.barisBaru();
    } });
  T({ baris: 8870, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8880, jalan: function (m) { m.cetak('YOU DIED DUE TO LACK OF '); } });
  T(sebab(8890, 'ST', 'STRENGTH.'));
  T(sebab(8900, 'IQ', 'INTELLIGENCE.'));
  T(sebab(8910, 'DX', 'DEXTERITY.'));
  T({ baris: 8920, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8930, jalan: function (m) { m.v.Q3 = 1; } });
  T(cet(8940, 'AT THE TIME YOU DIED, YOU HAD :'));
  T(ke(8950, 9130));
  T({ baris: 8960, jalan: function (m) { m.v.Q3 = 0; } });
  T({ baris: 8970, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8980, jalan: function (m) { m.cetak('YOU LEFT THE CASTLE WITH'); } });
  T({ baris: 8990, jalan: function (m) { if (m.v.OF === 0) m.cetak('OUT'); } });
  T({ baris: 9000, jalan: function (m) {
      m.cetak(' THE ORB OF ZOT.'); m.barisBaru();
    } });
  T({ baris: 9010, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9020, jalan: function (m) { if (m.v.OF === 0) m.lompat(9080); } });
  T({ baris: 9030, jalan: function (m) { m.barisBaru(); } });
  T(cet(9040, 'AN INCREDIBLY GLORIOUS VICTORY!!'));
  T({ baris: 9050, jalan: function (m) { m.barisBaru(); } });
  T(cet(9060, 'IN ADDITION, YOU GOT OUT WITH THE FOLLOWING :'));
  T(ke(9070, 9120));
  T({ baris: 9080, jalan: function (m) { m.barisBaru(); } });
  T(cet(9090, 'A LESS THAN AWE-INSPIRING DEFEAT.'));
  T({ baris: 9100, jalan: function (m) { m.barisBaru(); } });
  T(cet(9110, 'WHEN YOU LEFT THE CASTLE, YOU HAD :'));
  T({ baris: 9120, jalan: function (m) {
      if (m.v.Q3 === 0) { m.cetak('YOUR MISERABLE LIFE!'); m.barisBaru(); }
    } });
  T({ baris: 9130, jalan: function (m) { m.untuk('Q', 1, 8, 1, 9160); } });
  T({ baris: 9140, jalan: function (m) {
      if (m.v['T()'][m.v.Q] === 1) {
        m.cetak(m.v['C$()'][m.v.Q + 25]); m.barisBaru();
      }
    } });
  T({ baris: 9150, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 9160, jalan: function (m) {
      m.cetak(m.v['W$()'][m.v.WV + 1] + ' AND ' + m.v['W$()'][m.v.AV + 5]);
    } });
  T({ baris: 9170, jalan: function (m) {
      if (m.v.LF === 1) m.cetak(' AND A LAMP');
    } });
  T({ baris: 9180, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9190, jalan: function (m) {
      m.cetak('YOU ALSO HAD' + bas(m.v.FL) + 'FLARES AND' + bas(m.v.GP) +
              'GOLD PIECES'); m.barisBaru();
    } });
  T({ baris: 9200, jalan: function (m) {
      if (m.v.RF === 1) { m.cetak('AND THE RUNESTAFF'); m.barisBaru(); }
    } });
  T({ baris: 9210, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9220, jalan: function (m) {
      m.cetak('AND IT TOOK YOU' + bas(m.v.T) + 'TURNS!'); m.barisBaru();
    } });
  T({ baris: 9230, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9240, jalan: function (m) {
      m.cetak('ARE YOU FOOLISH ENOUGH TO WANT TO PLAY AGAIN');
    } });
  T({ baris: 9250, jalan: function (m) { m.gosub(9850); } });
  T({ baris: 9260, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9270, jalan: function (m) { if (m.v['O$'] !== 'Y') m.lompat(9330); } });
  T({ baris: 9280, jalan: function (m) {
      m.cetak('SOME ' + ras(m) + 'S NEVER LEARN!'); m.barisBaru();
    } });
  T({ baris: 9290, jalan: function (m) { m.barisBaru(); } });
  T(cet(9300, 'PLEASE BE PATIENT WHILE THE CASTLE IS RESTOCKED.'));
  T({ baris: 9310, jalan: function (m) { m.barisBaru(); } });
  T(ke(9320, 1240));
  T({ baris: 9330, jalan: function (m) {
      if (m.v['O$'] !== 'N') {
        m.cetak(m.v['Y$']); m.barisBaru(); m.lompat(9240);
      }
    } });
  T({ baris: 9340, jalan: function (m) {
      m.cetak('MAYBE DUMB ' + ras(m) + ' IS NOT SO DUMB AFTER ALL!');
      m.barisBaru();
    } });
  T({ baris: 9350, jalan: function (m) { m.barisBaru(); } });
  T(ke(9360, 10180));
  T({ baris: 9370, jalan: function (m) { m.barisBaru(); } });
  T(cet(9380, 'GREAT UNMITIGATED ZOT!'));
  T({ baris: 9390, jalan: function (m) { m.barisBaru(); } });
  T(cet(9400, 'YOU JUST FOUND ***THE ORB OF ZOT***!'));
  T({ baris: 9410, jalan: function (m) { m.barisBaru(); } });
  T(cet(9420, 'THE RUNESTAFF HAS DISAPPEARED!'));
  T({ baris: 9430, jalan: function (m) { m.v.RF = 0; } });
  T({ baris: 9440, jalan: function (m) { m.v.OF = 1; } });
  T({ baris: 9450, jalan: function (m) { m.v['O()'][1] = 0; } });
  T(ke(9460, 5230));

  /* --- 9470-9580: DATA --------------------------------------------------
     Baris-baris ini tidak melakukan apa-apa saat dijalankan, dan itu memang
     benar: BASIC mengumpulkan seluruh DATA saat program DIMUAT. Itu sebabnya
     baris 1280 di awal program bisa membaca DATA yang tertulis delapan ribu
     nomor baris di bawahnya. */
  T(rem(9470));
  T(rem(9480));
  T(rem(9490));
  T(rem(9500));
  T(rem(9510));
  T(rem(9520));
  T(rem(9530));
  T(rem(9540));
  /* 9550 entri ke-34 adalah "X" dengan lambang tanda tanya — ruangan yang
     belum pernah dilihat. Dipakai kalau perbaikan di baris 4150 dipasang. */
  T(rem(9550));
  T(rem(9560));
  T(rem(9570));
  T(rem(9580));

  /* --- 9590-10180: subrutin -------------------------------------------- */
  /* 9590-9620 MENCARI PETAK KOSONG DENGAN MENCOBA: undi X dan Y sampai
     ketemu ruangan yang masih 101. */
  T({ baris: 9590, jalan: function (m) {
      m.v.X = FNA(m, 8); m.v.Y = FNA(m, 8);
    } });
  T({ baris: 9600, jalan: function (m) {
      if (L(m, m.v.Z) !== 101) m.lompat(9590);
    } });
  T({ baris: 9610, jalan: function (m) { setL(m, m.v.Z, m.v.Q); } });
  T(pulang(9620));
  T({ baris: 9630, jalan: function (m) { m.barisBaru(); } });
  T(cet(9640, 'YOU GET ALL HIS WARES :'));
  T(cet(9650, 'PLATE ARMOR'));
  T({ baris: 9660, jalan: function (m) { m.v.AV = 3; m.v.AH = 21; } });
  T(cet(9670, 'A SWORD'));
  T({ baris: 9680, jalan: function (m) { m.v.WV = 3; } });
  T(cet(9690, 'A STRENGTH POTION'));
  T({ baris: 9700, jalan: function (m) { m.v.ST = FNC(m.v.ST + FNA(m, 6)); } });
  T(cet(9710, 'AN INTELLIGENCE POTION'));
  T({ baris: 9720, jalan: function (m) { m.v.IQ = FNC(m.v.IQ + FNA(m, 6)); } });
  T(cet(9730, 'A DEXTERITY POTION'));
  T({ baris: 9740, jalan: function (m) { m.v.DX = FNC(m.v.DX + FNA(m, 6)); } });
  T({ baris: 9750, jalan: function (m) {
      if (m.v.LF === 0) { m.cetak('A LAMP'); m.barisBaru(); m.v.LF = 1; }
    } });
  T(ke(9760, 7860));
  T({ baris: 9770, jalan: function (m) { m.untuk('Q', 1, 64, 1, 9800); } });
  T({ baris: 9780, jalan: function (m) { m.cetak('*'); } });
  T({ baris: 9790, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 9800, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9810, jalan: function (m) { m.barisBaru(); } });
  T(pulang(9820));
  T({ baris: 9830, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9840, jalan: function (m) { m.cetak('YOUR CHOICE'); } });
  T({ baris: 9850, jalan: function (m) { m.masukan('O$', '? '); } });
  T({ baris: 9860, jalan: function (m) { m.v['O$'] = LEFT(m.v['O$'], 1); } });
  T(pulang(9870));
  T({ baris: 9880, jalan: function (m) {
      m.cetak('HOW MANY POINTS DO YOU WISH TO ADD TO YOUR ' + m.v['Z$']);
    } });
  T({ baris: 9890, jalan: function (m) { m.masukan('O$', '? '); } });
  T({ baris: 9900, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9910, jalan: function (m) {
      m.v.Q = parseInt(m.v['O$'], 10) || 0;
    } });
  /* 9920 masukan yang bukan angka dibedakan dari nol dengan memeriksa
     aksara pertamanya: hanya "0" yang benar-benar berarti nol. */
  T({ baris: 9920, jalan: function (m) {
      if (m.v.Q === 0 && (m.v['O$'] || ' ').charCodeAt(0) !== 48) m.v.Q = -1;
    } });
  T({ baris: 9930, jalan: function (m) {
      if (m.v.Q < 0 || m.v.Q > m.v.OT || m.v.Q !== Math.trunc(m.v.Q)) {
        m.cetak('** '); m.lompat(9880);
      }
    } });
  T({ baris: 9940, jalan: function (m) { m.v.OT = m.v.OT - m.v.Q; } });
  T(pulang(9950));
  /* 9960-9980 subrutin yang TIDAK DIPANGGIL DARI MANA PUN. Pembaca angka
     yang digantikan 9990-10060, dan ditinggal utuh di tempatnya. */
  T({ baris: 9960, jalan: function (m) { m.masukan('O$', '? '); } });
  T({ baris: 9970, jalan: function (m) {
      m.v.Q = Math.trunc(parseFloat(m.v['O$']) || 0);
    } });
  T(pulang(9980));
  T({ baris: 9990, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10000, jalan: function (m) { m.cetak(m.v['Z$']); } });
  T({ baris: 10010, jalan: function (m) { m.masukan('O$', '? '); } });
  T({ baris: 10020, jalan: function (m) {
      m.v.Q = Math.trunc(parseFloat(m.v['O$']) || 0);
    } });
  T({ baris: 10030, jalan: function (m) {
      if (m.v.Q > 0 && m.v.Q < 9) m.kembali();
    } });
  T({ baris: 10040, jalan: function (m) { m.barisBaru(); } });
  T(cet(10050, '** TRY A NUMBER FROM 1 TO 8.'));
  T(ke(10060, 9990));
  T({ baris: 10070, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10080, jalan: function (m) {
      m.cetak('DO YOU WANT TO BUY A POTION OF ' + m.v['Z$'] + " FOR 1000 GP'S");
    } });
  T(ke(10090, 9850));
  T({ baris: 10100, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10110, jalan: function (m) {
      m.cetak('YOUR ' + m.v['Z$'] + ' IS NOW' + bas(m.v.Q) + '.');
      m.barisBaru();
    } });
  T(pulang(10120));
  T({ baris: 10130, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10140, jalan: function (m) {
      m.cetak('THESE ARE THE TYPES OF ' + m.v['Z$'] + ' YOU CAN BUY :');
      m.barisBaru();
    } });
  T(pulang(10150));
  T({ baris: 10160, jalan: function (m) {
      m.cetak('YOU ARE AT (' + bas(m.v.X) + ',' + bas(m.v.Y) + ') LEVEL' +
              bas(m.v.Z) + '.'); m.barisBaru();
    } });
  T(pulang(10170));
  /* 10180 `SAMP$` hanya bisa bernilai "YES" kalau program dimasuki lewat
     baris 1010 — dan tidak ada satu pun jalan ke sana. Jadi cabang
     `CHAIN "SAMPLES"` tidak pernah diambil. */
  T({ baris: 10180, jalan: function (m) {
      if (m.v['SAMP$'] === 'YES') m.rantai('SAMPLES', 1000); else m.henti();
    } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  /* --- pembantu -------------------------------------------------------- */
  function ras(m) { return m.v['R$()'][m.v.RC] || ''; }
  function bisik(n, teks) {
    return { baris: n, jalan: function (m) { m.cetak(teks); m.barisBaru(); } };
  }
  function perintah(n, huruf, tujuan) {
    return { baris: n, jalan: function (m) {
      if (m.v['O$'] === huruf) m.lompat(tujuan);
    } };
  }
  function butaKe(n, huruf, melek, buta) {
    return { baris: n, jalan: function (m) {
      if (m.v['O$'] === huruf) m.lompat([melek, buta][m.v.BL] || melek);
    } };
  }
  function bagi(n1, n2, n3, nama, sifat) {
    T({ baris: n1, jalan: function (m) { m.v['Z$'] = nama; } });
    T({ baris: n2, jalan: function (m) { m.gosub(9880); } });
    return { baris: n3, jalan: function (m) {
      m.v[sifat] = m.v[sifat] + m.v.Q;
    } };
  }
  function kolamNaik(n, sifat, teks) {
    return { baris: n, jalan: function (m) {
      m.v[sifat] = FNC(m.v[sifat] + FNA(m, 3));
      m.cetak(teks); m.barisBaru(); m.lompat(2920);
    } };
  }
  function kolamTurun(n, sifat, teks) {
    return { baris: n, jalan: function (m) {
      m.v[sifat] = m.v[sifat] - FNA(m, 3);
      m.cetak(teks); m.barisBaru();
      m.lompat(m.v[sifat] < 1 ? 8840 : 2920);
    } };
  }
  /* `ON (1-(X<1)) GOTO a,b` — perbandingan bernilai -1, jadi indeksnya
     jadi 2 saat mati dan 1 saat masih hidup. Dipakai delapan kali. */
  function mati(n, sifat, lanjut) {
    return { baris: n, jalan: function (m) {
      m.lompat(m.v[sifat] < 1 ? 8840 : lanjut);
    } };
  }
  function sebab(n, sifat, teks) {
    return { baris: n, jalan: function (m) {
      if (m.v[sifat] < 1) { m.cetak(teks); m.barisBaru(); }
    } };
  }
  function potongSandang(n) {
    return { baris: n, jalan: function (m) {
      var nm = m.v['C$()'][m.v.A + 12] || '';
      m.v['Z$'] = RIGHT(nm, nm.length - 2);
    } };
  }
  function potongSandang2(n) {
    return { baris: n, jalan: function (m) {
      if (LEFT(m.v['Z$'], 1) === ' ') m.v['Z$'] = MID(m.v['Z$'], 2);
    } };
  }
  function koord(n1, n2, n3, nama, sumbu) {
    T({ baris: n1, jalan: function (m) { m.v['Z$'] = nama; } });
    T({ baris: n2, jalan: function (m) { m.gosub(9990); } });
    return { baris: n3, jalan: function (m) { m.v[sumbu] = m.v.Q; } };
  }
  function beli(n, huruf, harga, sifat, nilai, tahan, nilaiTahan, tujuan) {
    return { baris: n, jalan: function (m) {
      if (m.v['O$'] === huruf) {
        m.v.GP = m.v.GP - harga;
        m.v[sifat] = nilai;
        if (tahan) m.v[tahan] = nilaiTahan;
        m.lompat(tujuan);
      }
    } };
  }
  function ramuan(nCek, nZ, nGos, nUji, nBayar, nNaik, nQ, nGos2, nUlang,
                  nTolak, nama, sifat, kembaliKe) {
    T({ baris: nCek, jalan: function (m) {
        if (m.v.GP < 1000) m.lompat(2920);
      } });
    T({ baris: nZ, jalan: function (m) { m.v['Z$'] = nama; } });
    T({ baris: nGos, jalan: function (m) { m.gosub(10070); } });
    T({ baris: nUji, jalan: function (m) {
        if (m.v['O$'] !== 'Y') m.lompat(nTolak);
      } });
    T({ baris: nBayar, jalan: function (m) { m.v.GP = m.v.GP - 1000; } });
    T({ baris: nNaik, jalan: function (m) {
        m.v[sifat] = FNC(m.v[sifat] + FNA(m, 6));
      } });
    T({ baris: nQ, jalan: function (m) { m.v.Q = m.v[sifat]; } });
    T({ baris: nGos2, jalan: function (m) { m.gosub(10100); } });
    T({ baris: nUlang, jalan: function (m) { m.lompat(kembaliKe); } });
    return { baris: nTolak, jalan: function (m) {
      if (m.v['O$'] !== 'N') {
        m.cetak(m.v['Y$']); m.barisBaru(); m.lompat(nZ);
      }
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['WIZARD'] = {
    nama: 'WIZARD',
    judul: "The Wizard's Castle (Joseph R. Power, 1980) — induk Temple of Loth",
    sumber: 'WIZARD',
    berkas: 'run/WIZARD.BAS',
    tabel: tabel,
    data: ["AN EMPTY ROOM", ".", "THE ENTRANCE", "E", "STAIRS GOING UP", "U", "STAIRS GOING DOWN", "D", "A POOL", "P", "A CHEST", "C", "GOLD PIECES", "G", "FLARES", "F", "A WARP", "W", "A SINKHOLE", "S", "A CRYSTAL ORB", "O", "A BOOK", "B", "A KOBOLD", "M", "AN ORC", "M", "A WOLF", "M", "A GOBLIN", "M", "AN OGRE", "M", "A TROLL", "M", "A BEAR", "M", "A MINOTAUR", "M", "A GARGOYLE", "M", "A CHIMERA", "M", "A BALROG", "M", "A DRAGON", "M", "A VENDOR", "V", "THE RUBY RED", "T", "THE NORN STONE", "T", "THE PALE PEARL", "T", "THE OPAL EYE", "T", "THE GREEN GEM", "T", "THE BLUE FLAME", "T", "THE PALANTIR", "T", "THE SILMARIL", "T", "X", "?", "NO WEAPON", " SANDWICH", "DAGGER", " STEW", "MACE", " SOUP", "SWORD", " BURGER", "NO ARMOR", " ROAST", "LEATHER", " FILET", "CHAINMAIL", " TACO", "PLATE", " PIE", "HOBBIT", "ELF", "MAN", "DWARF"],
    benih: 113,

    arsitektur: {
      judul: 'Alur WIZARD.BAS',
      simpul: [
        { id: 'judul', baris: '10-250', jenis: 'mulai',
          teks: ['Layar klub IPCO,', 'Pittsburgh'] },
        { id: 'isi', baris: '1520-2030',
          teks: ['512 ruangan diisi:', 'tangga, monster, harta, kutukan'] },
        { id: 'tokoh', baris: '2070-2880', jenis: 'putusan',
          teks: ['Bangsa menukar kekuatan', 'dengan ketangkasan'] },
        { id: 'gelung', baris: '2920-3440',
          teks: ['Kutukan bekerja,', 'lalu kastil berbisik'] },
        { id: 'perintah', baris: '3450-3880', jenis: 'putusan',
          teks: ['Lima belas perintah;', 'buta jadi indeks cabang'] },
        { id: 'ruangan', baris: '5920-6170',
          teks: ['Isi ruangan dibuka', 'dengan mengurangi 100'] },
        { id: 'pedagang', baris: '6180-7380',
          teks: ['Jual harta, beli zirah,', 'senjata, dan ramuan'] },
        { id: 'tarung', baris: '7390-8830',
          teks: ['Serang, kabur, suap,', 'atau tiga mantra'] },
        { id: 'orb', baris: '9370-9460',
          teks: ['Orb of Zot menyamar', 'jadi warp biasa'] },
        { id: 'akhir', baris: '8840-9360', jenis: 'keluar',
          teks: ['Mati, atau keluar lewat', 'pintu masuk ke utara'] }
      ],
      panah: [
        { dari: 'judul', ke: 'isi' },
        { dari: 'isi', ke: 'tokoh' },
        { dari: 'tokoh', ke: 'gelung' },
        { dari: 'gelung', ke: 'perintah' },
        { dari: 'perintah', ke: 'ruangan', label: 'bergerak' },
        { dari: 'ruangan', ke: 'pedagang', label: 'ketemu pedagang' },
        { dari: 'ruangan', ke: 'tarung', label: 'ketemu monster' },
        { dari: 'pedagang', ke: 'tarung', label: 'diserang' },
        { dari: 'tarung', ke: 'gelung' },
        { dari: 'ruangan', ke: 'orb', label: 'teleport ke warp Orb' },
        { dari: 'tarung', ke: 'akhir', label: 'nilai jatuh ke nol', jenis: 'galat' },
        { dari: 'perintah', ke: 'akhir', label: 'utara dari pintu masuk' }
      ]
    },

    pseudokode: [
      { baris: 1170, tingkat: 0, teks: '<code>FND(Q)=64*(Q-1)+8*(X-1)+Y</code> &mdash; 8&times;8&times;8 jadi <b>satu larik 512</b>' },
      { baris: 1150, tingkat: 0, teks: '<code>FNB(Q)=Q+8*((Q=9)-(Q=0))</code> &mdash; <b>peta melingkar</b>, kedua tepi sekaligus' },
      { baris: 1180, tingkat: 0, teks: '<code>FNE(Q)=Q+100*(Q&gt;99)</code> &mdash; ruangan disimpan sebagai isi <b>+100</b> sampai dilihat' },
      { baris: 1310, tingkat: 1, teks: 'seluruh kastil diisi <code>101</code>: kosong, dan belum pernah dilihat' },
      { baris: 4150, tingkat: 0, teks: 'perintah MAP <b>membuka seluruh tingkat</b> &mdash; dan komentarnya menyimpan perbaikannya' },
      { baris: 6090, tingkat: 0, teks: 'Orb of Zot <b>menyamar jadi warp</b>; hanya teleportasi yang bisa masuk' },
      { baris: 1900, tingkat: 0, teks: 'Runestaff disembunyikan <b>di dalam</b> salah satu monster' },
      { baris: 3000, tingkat: 0, teks: 'kutukan lupa mengembalikan satu ruangan acak ke keadaan <b>belum dilihat</b>' },
      { baris: 5960, tingkat: 0, teks: '<code>W$(WV+1)</code> senjata, <code>W$(AV+5)</code> zirah &mdash; <b>satu larik, dua daftar</b>' },
      { baris: 7790, tingkat: 0, teks: 'monster yang mati jadi <b>makan siang</b>: namanya disambung ke nama hidangan' },
      { baris: 1000, tingkat: 0, teks: 'pintu masuk kedua yang <b>tidak dipakai siapa pun</b> &mdash; keempat kalinya di koleksi ini' }
    ],

    perintahAsli: 'run\\WIZARD.bat',
    catatanAsli: 'H untuk daftar perintah. N/S/E/W bergerak, U/D naik-turun ' +
      'tangga, DR minum dari kolam, M peta, F suar, L lampu, O buka, ' +
      'G tatap bola, T teleport (butuh Runestaff), Q menyerah.',

    penyimpangan: [
      '<b><code>RANDOMIZE</code> tidak dipanggil sama sekali</b> di berkas ' +
      'aslinya &mdash; baris 1250 cuma memanggil <code>RND(1)</code> tanpa ' +
      'menyemai. Penelusur memasang benih tetap.',

      '<b><code>PRINT CHR$(27);"E"</code> di baris 3590</b> adalah perintah ' +
      'bersihkan-layar terminal Heath, sisa dari pemindahan sebelumnya. Di ' +
      'sini diperlakukan sebagai <code>CLS</code>.',

      '<b><code>CHAIN "SAMPLES",1000</code> di baris 10180 tidak bisa ' +
      'dijalankan</b> &mdash; dan memang tidak pernah dicapai; lihat catatan ' +
      'cacat.',

      '<b>Kelima <code>DEF FN</code> ditulis sebagai fungsi JavaScript</b>; ' +
      'baris 1140-1180 tetap ada di tabel.'
    ],

    pelajaran: {
      ringkas: 'Kastil delapan tingkat, tiga kutukan, dan Orb yang menyamar ' +
        'jadi warp &mdash; semuanya dibangun dari lima fungsi satu baris dan ' +
        'satu larik 512 unsur.',
      pelajari: [
        ['Lima fungsi yang menggantikan seluruh tata ruangnya',
         'Baris 1140 sampai 1180 mendefinisikan lima fungsi, dan kelimanya ' +
         'mengurus hal yang berbeda: undian, peta melingkar, batas atas, ' +
         'pengalamatan tiga dimensi, dan penanda "sudah dilihat".',
         'Yang paling padat <code>FNB(Q)=Q+8*((Q=9)-(Q=0))</code>. Perbandingan ' +
         'bernilai &minus;1 saat benar, jadi ungkapan dalam kurung menghasilkan ' +
         '&minus;1, 0, atau +1 &mdash; dan dikali delapan ia jadi &minus;8, 0, ' +
         'atau +8. <b>Satu baris yang mengurus kedua tepi peta sekaligus</b>, ' +
         'tanpa satu pun <code>IF</code>.'],
        ['Ruangan yang menyimpan isinya dan pengetahuannya sekaligus',
         'Tiap ruangan disimpan sebagai <b>isinya ditambah seratus</b> selama ' +
         'belum pernah dilihat. Baris 1310 mengisi seluruh kastil dengan 101 ' +
         '&mdash; ruangan kosong yang belum diketahui.',
         'Melihat sebuah ruangan berarti mengurangi seratus (<code>FNE</code>). ' +
         'Dan kutukan lupa (baris 3000) menambahkannya kembali ke satu ruangan ' +
         'acak tiap giliran, jadi peta pemain perlahan berbalik jadi tanda ' +
         'tanya lagi.',
         'Satu bilangan membawa dua hal: apa isinya, dan apakah pemain sudah ' +
         'tahu.'],
        ['Barang yang disembunyikan di dalam barang lain',
         '<b>Runestaff</b> tidak punya ruangan sendiri. Baris 1900-1950 ' +
         'menaruh sebuah monster acak, lalu mencatat tempatnya di ' +
         '<code>R(3)</code>. Membunuh monster di petak itu yang memunculkannya ' +
         '(baris 7810).',
         '<b>Orb of Zot</b> disimpan sebagai warp biasa &mdash; isi 109, sama ' +
         'seperti warp lain. Baris 6090 membedakannya: berjalan masuk membuat ' +
         'pemain terlempar satu petak lagi, dan hanya <b>teleportasi</b> ' +
         '&mdash; yang menyetel <code>O$="T"</code> &mdash; yang membawanya ke ' +
         'ruangan itu betulan.',
         'Dan <b>ketiga kutukan</b> ditaruh di ruangan yang isinya tetap ' +
         '"kosong". Tidak ada apa pun yang terlihat di sana, selamanya.'],
        ['Satu larik yang menampung dua daftar',
         '<code>W$(8)</code> berisi empat nama senjata di posisi 1-4 dan empat ' +
         'nama baju zirah di posisi 5-8. Baris 5960 membacanya dengan ' +
         '<code>W$(WV+1)</code> dan <code>W$(AV+5)</code> &mdash; dua penunjuk ' +
         'ke satu larik, berselisih empat.',
         'Dan <code>E$(8)</code> dibaca dari <code>DATA</code> yang <b>sama ' +
         'persis</b>, berselang-seling: "NO WEAPON" lalu " SANDWICH", "DAGGER" ' +
         'lalu " STEW". Dua daftar yang tidak berhubungan sama sekali, ' +
         'disimpan bergantian dalam satu deret.'],
        ['Kebutaan sebagai indeks cabang',
         'Baris 3520: <code>IF O$="F" THEN ON BL+1 GOTO 4260,4030</code>. ' +
         'Bendera buta bernilai 0 atau 1, jadi <code>BL+1</code> jadi 1 atau 2 ' +
         '&mdash; langsung dipakai memilih antara menjalankan perintah dan ' +
         'menolaknya.',
         'Tiga perintah memakai pola ini. Tidak ada <code>IF BL=1</code> di ' +
         'mana pun.'],
        ['Monster yang jadi makan siang',
         'Baris 7790: <code>PRINT "YOU SPEND AN HOUR EATING ";C$(A+12);' +
         'E$(FNA(8));"."</code> &mdash; nama monster disambung dengan nama ' +
         'hidangan acak. "AN ORC BURGER". "A BALROG TACO".',
         'Dan syaratnya (<code>H &gt; T-60</code>) memastikan itu cuma terjadi ' +
         'kalau sudah enam puluh giliran sejak makan terakhir. Sebuah sistem ' +
         'kelaparan, dibangun dari satu pengurangan.']
      ],
      hindari: [
        ['Perintah MAP yang membuka seluruh peta',
         'Baris 4150: <code>IF Q &gt; 99 THEN Q=Q-100 \' LET Q=34 TO HIDE ' +
         'ROOMS</code>.',
         'Angka seratus yang menandai "belum pernah dilihat" dicabut begitu ' +
         'saja sebelum digambar. Jadi perintah MAP menampilkan <b>seluruh ' +
         'isi tingkat itu</b> &mdash; monster, harta, tangga, semuanya &mdash; ' +
         'termasuk ruangan yang belum pernah didatangi pemain.',
         'Dan perbaikannya ada di baris yang sama, sebagai komentar. Entri ' +
         'ke-34 di daftar isi ruangan (baris 9550) memang tanda tanya, ' +
         'disiapkan justru untuk ini.',
         'Seluruh sistem "ruangan tersembunyi" &mdash; angka +100, fungsi ' +
         '<code>FNE</code>, kutukan lupa, suar yang mencatat &mdash; dibangun ' +
         'dengan hati-hati, lalu <b>dilewati oleh satu perintah</b> yang ' +
         'saklarnya ditinggalkan dalam keadaan terbuka.'],
        ['Pintu masuk kedua yang tidak dipakai siapa pun',
         'Baris 1000 menyetel <code>SAMP$="NO"</code> lalu melompati baris ' +
         '1010, yang menyetelnya <code>"YES"</code>. Satu-satunya cara ' +
         'mencapai 1010 adalah <code>RUN 1010</code> dari luar.',
         'Dan baris 10180 memakainya: <code>IF SAMP$="YES" THEN CHAIN ' +
         '"SAMPLES",1000 ELSE END</code>. Cabang itu tidak pernah diambil.',
         'Ini <b>keempat kalinya</b> idiom yang sama muncul di koleksi ini ' +
         '&mdash; sesudah MORTGAGE.BAS, DROIDS.BAS, dan MUSIC.BAS. Empat ' +
         'program, empat penulis berbeda, satu kebiasaan menyiapkan pintu ' +
         'belakang yang tidak pernah dipakai.'],
        ['Dua baris yang dilompati tanpa syarat',
         'Baris 4230 berbunyi <code>GOTO 4470</code>, dan tepat di bawahnya ' +
         'baris 4240 mencetak <code>") LEVEL";Z</code> lalu 4250 kembali ke ' +
         'gelung utama.',
         'Keduanya tidak pernah dicapai. Melihat isinya, keduanya sisa dari ' +
         'versi lama yang mencetak nomor tingkat di ujung peta &mdash; ' +
         'pekerjaan yang sekarang diambil alih subrutin 10160.'],
        ['Subrutin yang tidak dipanggil dari mana pun',
         'Baris 9960-9980 adalah pembaca angka lengkap: <code>INPUT O$</code>, ' +
         '<code>Q=INT(VAL(O$))</code>, <code>RETURN</code>. Tidak ada satu ' +
         '<code>GOSUB 9960</code> pun di seluruh berkas.',
         'Penggantinya ada tepat di bawahnya, di 9990-10060, dengan tambahan ' +
         'pemeriksaan rentang 1 sampai 8. Yang lama ditinggalkan utuh di ' +
         'tempatnya.'],
        ['Komentar yang rusak di berkasnya sendiri',
         'Baris 4290: <code>REM DISeADJACENT ROOM CONTENTS WITH FLARE</code>. ' +
         'Yang dimaksud jelas "DISPLAY ADJACENT" &mdash; tujuh aksara hilang ' +
         'dan satu huruf kecil tersisa di tengahnya.',
         'Berkas ini sudah melewati Exidy Sorcerer, Heath, dan IBM PC. Satu ' +
         'aksara yang tercecer di salah satu perpindahan itu, dan tidak ada ' +
         'yang pernah memperbaikinya karena komentar tidak dijalankan.'],
        ['Salah eja di pertanyaan pertama',
         'Baris 2190: <i>"WHICH SEX TO YOU PREFER"</i> &mdash; "TO" untuk ' +
         '"DO". Pertanyaan kedua yang dilihat setiap pemain, di program yang ' +
         'terbit di majalah nasional.']
      ]
    },

    penjelasan: [
      { judul: 'Induk yang selamat, dan turunan yang hilang',
        isi: [
          'Koleksi ini menyimpan sebuah permainan bernama "Temple of Loth" ' +
          'dalam dua berkas: <a href="tem-ins.html">TEM-INS.BAS</a> yang ' +
          'berisi petunjuknya, dan TEMPLE.BAS (1.187 baris) yang berisi ' +
          'permainannya. Keduanya saling memanggil dengan <code>CHAIN</code>.',
          'Yang tidak dijelaskan keduanya: dari mana Temple of Loth berasal. ' +
          'Berkas ini menjawabnya.',
          'Delapan harta yang didaftar TEM-INS di baris 1820-1890 &mdash; ' +
          '<i>The Ruby Red, The Pale Pearl, The Opal Eye, The Green Gem, The ' +
          'Blue Flame, The Norn Stone, The Palantir, The Silmaril</i> &mdash; ' +
          'adalah delapan harta yang sama persis di baris 9520-9540 berkas ' +
          'ini, dengan urutan yang sama.',
          'Tiga kutukannya sama: lesu, lintah, dan lupa. Kolam ajaib yang bisa ' +
          'mengubah bangsa pemain sama. Bola kristal yang berbohong setengah ' +
          'waktu sama. Dan yang paling menentukan: <b>Amulet of Chaos</b> di ' +
          'Temple of Loth berperilaku persis seperti <b>Orb of Zot</b> di sini ' +
          '&mdash; menyamar jadi warp, dan hanya bisa dimasuki dengan ' +
          'teleportasi memakai Runestaff.',
          'Jadi Temple of Loth adalah tulisan ulang Wizard\'s Castle, dengan ' +
          'nama-nama yang diganti. Dan yang selamat sampai ke disket ini: ' +
          '<b>permainan aslinya</b>, plus <b>petunjuk turunannya</b>.',
          'Wizard\'s Castle sendiri punya silsilah yang panjang. Ia terbit di ' +
          'Recreational Computing edisi Juli/Agustus 1980, ditulis Joseph R. ' +
          'Power untuk Exidy Sorcerer &mdash; komputer rumah yang programnya ' +
          'dijual dalam kartrid berbentuk kaset. J.F. Stetson memindahkannya ' +
          'ke Heath Microsoft BASIC. Seseorang lagi memindahkannya ke IBM PC. ' +
          'Dan klub International PC Owners di Pittsburgh menyebarkannya ' +
          'dengan nomor katalog 2039-A.',
          'Empat mesin, empat orang, dan satu baris yang masih menyimpan bekas ' +
          'perjalanannya: baris 3590, <code>PRINT CHR$(27);"E"</code> ' +
          '&mdash; perintah bersihkan-layar untuk terminal Heath, di program ' +
          'yang sudah tidak pernah melihat terminal Heath lagi.'
        ] },
      { judul: 'Sistem yang dibangun rapi, lalu dilewati satu baris',
        isi: [
          'Wizard\'s Castle menyimpan seluruh kastilnya &mdash; delapan ' +
          'tingkat, delapan kali delapan ruangan &mdash; dalam satu larik ' +
          '<code>L(512)</code>. Dan tiap unsurnya membawa <b>dua</b> ' +
          'keterangan sekaligus.',
          'Isi ruangan disimpan sebagai angka 1 sampai 34. Kalau pemain belum ' +
          'pernah melihatnya, angkanya <b>ditambah seratus</b>.',
          '<code>1310 L(Q)=101</code>',
          'Seratus satu: ruangan kosong (1) yang belum diketahui (+100).',
          'Membukanya cuma satu fungsi:',
          '<code>1180 DEF FNE(Q)=Q+100*(Q&gt;99)</code>',
          'Dan seluruh permainan dibangun di atas pembedaan itu. Melangkah ke ' +
          'sebuah ruangan membukanya (baris 6000). Menyalakan suar membuka ' +
          'sembilan sekaligus <b>dan mencatatnya</b> (4390-4400). Menyorotkan ' +
          'lampu membuka satu (4690). Menatap bola kristal membuka satu yang ' +
          'acak (5540-5550).',
          'Bahkan kutukan lupa dibangun untuk membalikkannya:',
          '<code>3000 L(FND(Z))=FNE(L(FND(Z)))+100</code>',
          'Satu ruangan acak dikembalikan ke keadaan tidak diketahui, tiap ' +
          'giliran. Peta pemain perlahan berbalik jadi tanda tanya lagi ' +
          '&mdash; dan Green Gem menangkalnya.',
          'Enam mekanisme, semuanya bergantung pada satu angka seratus. ' +
          'Rancangan yang matang.',
          'Lalu baris 4150:',
          '<code>4150 IF Q &gt; 99 THEN Q=Q-100 \' LET Q=34 TO HIDE ROOMS</code>',
          'Perintah MAP mencabut angka seratus itu <b>tanpa syarat</b>, ' +
          'sebelum menggambar. Jadi peta menampilkan seluruh isi tingkat: ' +
          'setiap monster, setiap harta, setiap tangga &mdash; termasuk yang ' +
          'belum pernah didatangi.',
          'Enam mekanisme itu tetap berjalan. Suar tetap mencatat, lampu tetap ' +
          'membuka, kutukan lupa tetap melupakan. Tapi tidak ada gunanya, ' +
          'karena satu perintah menampilkan semuanya kapan saja.',
          'Dan yang membuat ini bukan sekadar cacat: <b>perbaikannya ada di ' +
          'baris yang sama</b>. Komentar <code>\' LET Q=34 TO HIDE ROOMS</code> ' +
          'menyebutkan persis apa yang harus diubah, dan entri ke-34 di daftar ' +
          'isi ruangan &mdash; <code>DATA X,"?"</code> di baris 9550 &mdash; ' +
          'memang disiapkan untuk itu dan tidak dipakai untuk apa pun lain.',
          'Terukur di penelusur: ruangan (1,1,1) tersimpan sebagai ' +
          '<b>116</b> &mdash; monster (16) yang belum pernah didatangi (+100). ' +
          'Sesudah baris 4150, <code>Q</code> bernilai 16 dan petanya ' +
          'mencetak "M". Isinya tetap tertandai belum dilihat di ' +
          '<code>L()</code>; yang bocor cuma tampilannya.',
          'Seseorang membangun sistemnya, membangun saklarnya, menulis cara ' +
          'memakainya, dan meninggalkan saklarnya terbuka.'
        ] }
    ]
  };
})(window);
