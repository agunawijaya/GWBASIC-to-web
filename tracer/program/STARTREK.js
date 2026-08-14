/* ===========================================================================
   STARTREK.js — porting minimalis STARTREK.BAS sebagai tabel baris.

       570 REM ****  Original program in Creative Computing
       580 REM ****  Basic Computer Games by Dave Ahl.
       590 REM ****  Modifications by Bob Fritz and Sharon Fritz
       600 REM **** for the IBM Personal Computer, October-November 1981

   Program Star Trek yang asli terbit di Creative Computing awal 1970-an dan
   masuk buku "BASIC Computer Games" karya David Ahl — buku permainan komputer
   terlaris pertama di dunia. Berkas ini pemindahannya ke IBM PC, sepuluh
   tahun kemudian, oleh Bob Fritz di San Diego.

   DUA GAGASAN PENYIMPANAN YANG LAYAK DILIHAT:

   (1) KUADRAN ADALAH SEBUAH STRING SEPANJANG 192 AKSARA.

       1410 Q$=Z$+Z$+Z$+Z$+Z$+Z$+Z$+LEFT$(Z$,17)
       4830 S8=INT(Z2-0.5)*3+INT(Z1-0.5)*24+1
       4870 Q$=LEFT$(Q$,S8-1)+A$+RIGHT$(Q$,190-S8)
       5000 IF MID$(Q$,S8,3)<>A$ THEN RETURN

       Delapan kali delapan petak, tiga aksara per petak. Menaruh sesuatu
       berarti MEMOTONG string dan menyambungnya kembali; memeriksa isinya
       berarti membandingkan tiga aksara. Tidak ada larik dua dimensi.

       Dan gambarnya langsung jadi datanya: kapal Enterprise adalah
       CHR$(204)+CHR$(144)+CHR$(185), Klingon "+"+CHR$(2)+"+", pangkalan
       CHR$(174)+CHR$(127)+CHR$(175). Yang tampak di layar itulah yang
       tersimpan di memori.

   (2) GALAKSI ADALAH 64 BILANGAN BULAT YANG DIKEMAS.

       1150 G(I,J)=K3*100+B3*10+FNR(1)
       1340 K3=INT(G(Q1,Q2)*0.01):B3=INT(G(Q1,Q2)*0.1)-10*K3
       1350 S3=G(Q1,Q2)-100*K3-10*B3

       Ratusan = jumlah Klingon, puluhan = jumlah pangkalan, satuan = jumlah
       bintang. Satu angka per kuadran, dan pemulungannya cuma dua pembagian.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` diam; keempat subrutin bunyi (5290-5570) tetap ditelusuri.
   - `KEY n,"..."` memprogram tombol fungsi supaya MENGETIK perintah.
     Penelusur tidak punya tombol lunak; ketik perintahnya langsung.
   - `RANDOMIZE` memasang benih tetap.
   - `INP(1)` di baris 1260 membaca gerbang I/O nomor 1 — di PC itu bagian
     pengendali DMA, bukan papan tombol. Lihat catatan cacat.
   - `LOAD "MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   - Baris 620 sudah disunting pemilik koleksi (nomor telepon penulis).
   =========================================================================== */

(function (global) {
  'use strict';

  function INSTR(a, b, c) {
    if (c === undefined) { c = b; b = a; a = 1; }
    if (a < 1) a = 1;
    return b.indexOf(c, a - 1) + 1;
  }
  function MID(s, i, n) {
    if (i < 1) i = 1;
    return n === undefined ? s.slice(i - 1) : s.substr(i - 1, n);
  }
  function LEFT(s, n) { return s.slice(0, Math.max(0, n)); }
  function RIGHT(s, n) { return n <= 0 ? '' : s.slice(-n); }
  /* PRINT sebuah angka di BASIC: spasi di depan kalau positif, dan satu
     spasi di belakang. */
  function bas(n) {
    if (n === undefined || n === null) n = 0;
    var s;
    if (n === Math.trunc(n)) s = String(Math.abs(n));
    else s = String(Math.abs(Math.round(n * 1e6) / 1e6));
    return (n < 0 ? '-' : ' ') + s + ' ';
  }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }

  var tabel = [];
  function T(x) { if (x) tabel.push(x); return x; }
  function nama(n, teks) {
    return { baris: n, jalan: function (m) { m.v['G2$'] = teks; m.lompat(5230); } };
  }

  /* --- 500-800: layar judul -------------------------------------------- */
  T({ baris: 500, jalan: function (m) { m.cls(); } });
  T({ baris: 510, jalan: function () { } });
  [520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630].forEach(function (n) {
    T(rem(n));
  });
  T({ baris: 640, jalan: function (m) {
      for (var i = 0; i < 11; i++) m.barisBaru();
    } });
  T({ baris: 650, jalan: function (m) {
      m.v['E1$'] = '                                    ,------';
      m.v['E7$'] = "------,";
    } });
  T({ baris: 660, jalan: function (m) {
      m.v['E2$'] = "                    ,-------------   '---  ------'";
    } });
  T({ baris: 670, jalan: function (m) {
      m.v['E3$'] = "                     ,-------- --'      / /";
    } });
  T({ baris: 680, jalan: function (m) {
      m.v['E4$'] = "                        ,---' '-------/ /--,";
    } });
  T({ baris: 690, jalan: function (m) {
      m.v['E5$'] = "                          '----------------'";
      m.barisBaru();
    } });
  T({ baris: 700, jalan: function (m) {
      m.v['E6$'] = '                   THE USS ENTERPRISE --- NCC-1701';
    } });
  /* 710 CHR$(15) adalah lambang matahari — dipakai jadi piringan pemindai
     kapal di gambar judul, DAN jadi bintang di dalam kuadran (baris 1500). */
  T({ baris: 710, jalan: function (m) { m.v['E8$'] = m.chr(15); } });
  T({ baris: 720, jalan: function (m) {
      m.cetak(m.v['E1$']); m.warna(23, 0); m.cetak(m.v['E8$']);
      m.warna(7, 0); m.cetak(m.v['E7$']); m.barisBaru();
    } });
  T(gambar(730, 'E2$')); T(gambar(740, 'E3$'));
  T(gambar(750, 'E4$')); T(gambar(760, 'E5$'));
  T({ baris: 770, jalan: function (m) { m.barisBaru(); } });
  T(gambar(780, 'E6$'));
  T({ baris: 790, jalan: function (m) {
      for (var i = 0; i < 7; i++) m.barisBaru();
    } });
  T({ baris: 800, jalan: function () { /* CLEAR 600 — ruang string */ } });
  T({ baris: 810, jalan: function (m) { m.semaiCampur(101); } });
  T({ baris: 820, jalan: function (m) { m.v['Z$'] = ' '.repeat(25); } });
  T({ baris: 830, bagian: [
      function (m) { m.gosub(840); },
      function (m) { m.lompat(960); }
    ] });

  /* --- 840-950: tombol fungsi jadi makro perintah ----------------------- */
  T(rem(840));
  /* 850-940 SEMBILAN PERINTAH DIPASANG DI TOMBOL FUNGSI, lengkap dengan
     Enter di ujungnya. Menekan F1 sama dengan mengetik "NAV" lalu Enter.
     Baris 3570-3660 mengembalikannya ke bawaan BASIC saat keluar. */
  [[850,1,'NAV'],[860,2,'SRS'],[870,3,'LRS'],[880,4,'PHASERS'],
   [890,5,'TORPEDO'],[900,6,'SHIELDS'],[910,7,'DAMAGE REPORT'],
   [920,8,'COMPUTER'],[930,9,'RESIGN'],[940,10,'']].forEach(function (k) {
    T({ baris: k[0], jalan: function () { } });
  });
  T({ baris: 950, jalan: function (m) { m.kembali(); } });

  /* --- 960-1260: menyiapkan galaksi ------------------------------------ */
  T({ baris: 960, jalan: function (m) {
      m.dim('G()', 8, 8); m.dim('C()', 9, 2); m.dim('K()', 3, 3);
      m.dim('N()', 3); m.dim('Z()', 8, 8); m.dim('D()', 8);
    } });
  T({ baris: 970, jalan: function (m) {
      m.v.T = Math.trunc(m.acak() * 20 + 20) * 100;
      m.v.T0 = m.v.T;
      m.v.T9 = 25 + Math.trunc(m.acak() * 10);
      m.v.D0 = 0; m.v.E = 3000; m.v.E0 = m.v.E;
    } });
  T({ baris: 980, jalan: function (m) {
      m.v.P = 10; m.v.P0 = m.v.P; m.v.S9 = 200; m.v.S = 0;
      m.v.B9 = 0; m.v.K9 = 0; m.v['X$'] = ''; m.v['X0$'] = ' is ';
    } });
  /* 990 `DEF FND(D)` — jarak Enterprise ke Klingon ke-I. Parameternya `D`
     TIDAK PERNAH DIPAKAI; yang dibaca adalah `I` global. Sebuah fungsi yang
     sebenarnya makro atas variabel bersama, dipanggil `FND(0)` dan `FND(1)`
     dengan hasil yang sama. */
  T({ baris: 990, jalan: function () { } });
  T({ baris: 1000, jalan: function () { } });
  T(rem(1010));
  T({ baris: 1020, jalan: function (m) {
      m.v.Q1 = FNR(m); m.v.Q2 = FNR(m); m.v.S1 = FNR(m); m.v.S2 = FNR(m);
    } });
  T({ baris: 1030, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 9; m.v.I++) {
        m.v['C()'][m.v.I][1] = 0; m.v['C()'][m.v.I][2] = 0;
      }
    } });
  /* 1040-1050 sembilan arah kompas sebagai pasangan langkah. Arah 1 ke
     kanan, lalu berputar berlawanan jarum jam; arah 9 sama dengan arah 1,
     supaya arah pecahan seperti 8,5 bisa diinterpolasi di baris 2080. */
  T({ baris: 1040, jalan: function (m) {
      var C = m.v['C()'];
      C[3][1] = -1; C[2][1] = -1; C[4][1] = -1; C[4][2] = -1;
      C[5][2] = -1; C[6][2] = -1;
    } });
  T({ baris: 1050, jalan: function (m) {
      var C = m.v['C()'];
      C[1][2] = 1; C[2][2] = 1; C[6][1] = 1; C[7][1] = 1;
      C[8][1] = 1; C[8][2] = 1; C[9][2] = 1;
    } });
  T({ baris: 1060, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 8; m.v.I++) m.v['D()'][m.v.I] = 0;
    } });
  T({ baris: 1070, jalan: function (m) {
      m.v['A1$'] = 'NAVSRSLRSPHATORSHIDAMCOMRES';
    } });
  T(rem(1080)); T(rem(1090));
  T({ baris: 1100, bagian: [
      function (m) { m.untuk('I', 1, 8, 1, 1160); },
      function (m) { m.untuk('J', 1, 8, 1, 1160); },
      function (m) {
        m.v.K3 = 0; m.v['Z()'][m.v.I][m.v.J] = 0; m.v.R1 = m.acak();
      }
    ] });
  T(klingon(1110, 0.9799999, 3));
  T(klingon(1120, 0.95, 2));
  T({ baris: 1130, jalan: function (m) {
      if (m.v.R1 > 0.8) { m.v.K3 = 1; m.v.K9 = m.v.K9 + 1; }
    } });
  T({ baris: 1140, jalan: function (m) {
      m.v.B3 = 0;
      if (m.acak() > 0.96) { m.v.B3 = 1; m.v.B9 = m.v.B9 + 1; }
    } });
  /* 1150 SATU ANGKA PER KUADRAN: ratusan Klingon, puluhan pangkalan,
     satuan bintang. */
  T({ baris: 1150, bagian: [
      function (m) {
        m.v['G()'][m.v.I][m.v.J] = m.v.K3 * 100 + m.v.B3 * 10 + FNR(m);
      },
      function (m) { m.lanjutkan('J'); },
      function (m) { m.lanjutkan('I'); },
      function (m) { if (m.v.K9 > m.v.T9) m.v.T9 = m.v.K9 + 1; }
    ] });
  T({ baris: 1160, jalan: function (m) { if (m.v.B9 !== 0) m.lompat(1190); } });
  /* 1170-1180 KALAU GALAKSI TERLANJUR TANPA PANGKALAN, satu dipasang di
     kuadran tempat Enterprise berada — lalu kapalnya DIPINDAH ke tempat
     acak yang lain. Perbaikan yang tidak menguntungkan pemainnya. */
  T({ baris: 1170, jalan: function (m) {
      if (m.v['G()'][m.v.Q1][m.v.Q2] < 200) {
        m.v['G()'][m.v.Q1][m.v.Q2] += 100; m.v.K9 = m.v.K9 + 1;
      }
    } });
  T({ baris: 1180, jalan: function (m) {
      m.v.B9 = 1;
      m.v['G()'][m.v.Q1][m.v.Q2] += 10;
      m.v.Q1 = FNR(m); m.v.Q2 = FNR(m);
    } });
  T({ baris: 1190, jalan: function (m) {
      m.v.K7 = m.v.K9;
      if (m.v.B9 !== 1) { m.v['X$'] = 's'; m.v['X0$'] = ' are '; }
    } });
  T(cet(1200, '      Your orders are as follows: '));
  T({ baris: 1210, jalan: function (m) {
      m.cetak('      Destroy the' + bas(m.v.K9) +
              'Klingon warships which have invaded'); m.barisBaru();
    } });
  T(cet(1220, '    the galaxy before they can attack Federation headquarters'));
  T({ baris: 1230, jalan: function (m) {
      m.cetak('    on stardate' + bas(m.v.T0 + m.v.T9) +
              '  this gives you' + bas(m.v.T9) + 'days.  there' + m.v['X0$']);
      m.barisBaru();
    } });
  T({ baris: 1240, jalan: function (m) {
      m.cetak('  ' + bas(m.v.B9) + 'starbase' + m.v['X$'] +
              ' in the galaxy for resupplying your ship'); m.barisBaru();
    } });
  /* 1250 ajakannya sendiri SUDAH DIKOMENTARI dengan petik tunggal — penulis
     pemindahannya tahu jedanya tidak bekerja, membuang tulisannya, dan
     meninggalkan gelungnya. */
  T({ baris: 1250, jalan: function (m) { m.barisBaru(); m.barisBaru(); } });
  /* 1260 `INP(1)` MEMBACA GERBANG I/O NOMOR SATU. Di IBM PC itu bagian
     pengendali DMA, bukan papan tombol — sisa dari mesin lain tempat
     program ini pernah hidup. Nilainya hampir tidak pernah 13, jadi
     gelungnya lewat begitu saja dan tidak ada yang menunggu. */
  T({ baris: 1260, jalan: function (m) { m.v.I = m.acak(); } });

  /* --- 1270-1510: masuk kuadran baru ----------------------------------- */
  T(rem(1270));
  T({ baris: 1280, jalan: function (m) {
      m.v.Z4 = m.v.Q1; m.v.Z5 = m.v.Q2;
      m.v.K3 = 0; m.v.B3 = 0; m.v.S3 = 0; m.v.G5 = 0;
      m.v.D4 = 0.5 * m.acak();
      m.v['Z()'][m.v.Q1][m.v.Q2] = m.v['G()'][m.v.Q1][m.v.Q2];
    } });
  T({ baris: 1290, jalan: function (m) {
      if (m.v.Q1 < 1 || m.v.Q1 > 8 || m.v.Q2 < 1 || m.v.Q2 > 8) m.lompat(1410);
    } });
  T({ baris: 1300, bagian: [
      function (m) { m.gosub(5040); },
      function (m) { m.barisBaru(); if (m.v.T0 !== m.v.T) m.lompat(1330); }
    ] });
  T(cet(1310, 'Your mission begins with your starship located'));
  T({ baris: 1320, jalan: function (m) {
      m.cetak("in the galactic quadrant, '" + m.v['G2$'] + "'.");
      m.barisBaru(); m.lompat(1340);
    } });
  T({ baris: 1330, jalan: function (m) {
      m.cetak('Now entering ' + m.v['G2$'] + ' quadrant. . .'); m.barisBaru();
    } });
  /* 1340-1350 MEMBONGKAR ANGKA KUADRAN kembali jadi tiga bilangan. */
  T({ baris: 1340, jalan: function (m) {
      m.barisBaru();
      var g = m.v['G()'][m.v.Q1][m.v.Q2];
      m.v.K3 = Math.trunc(g * 0.01);
      m.v.B3 = Math.trunc(g * 0.1) - 10 * m.v.K3;
    } });
  T({ baris: 1350, jalan: function (m) {
      var g = m.v['G()'][m.v.Q1][m.v.Q2];
      m.v.S3 = g - 100 * m.v.K3 - 10 * m.v.B3;
      if (m.v.K3 === 0) m.lompat(1400);
    } });
  T({ baris: 1360, jalan: function (m) { m.cetak('COMBAT AREA!! Condition'); } });
  T({ baris: 1370, jalan: function (m) {
      m.warna(16, 7); m.cetak(' RED '); m.warna(7, 0); m.barisBaru();
    } });
  T({ baris: 1380, bagian: [
      function (m) { m.warna(7, 0); },
      function (m) { m.gosub(5290); },
      function (m) { if (m.v.S > 200) m.lompat(1400); }
    ] });
  T({ baris: 1390, jalan: function (m) {
      m.warna(31, 0); m.cetak('    SHIELDS DANGEROUSLY LOW');
      m.warna(7, 0); m.spc(53); m.barisBaru();
    } });
  T({ baris: 1400, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 3; m.v.I++) {
        m.v['K()'][m.v.I][1] = 0; m.v['K()'][m.v.I][2] = 0;
      }
    } });
  /* 1410 KUADRAN DIBANGUN SEBAGAI STRING: tujuh kali 25 spasi ditambah 17
     lagi — 192 aksara, tepat 64 petak kali tiga. */
  T({ baris: 1410, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 3; m.v.I++) m.v['K()'][m.v.I][3] = 0;
      var Z = m.v['Z$'];
      m.v['Q$'] = Z + Z + Z + Z + Z + Z + Z + LEFT(Z, 17);
    } });
  T(rem(1420)); T(rem(1430));
  T({ baris: 1440, bagian: [
      function (m) {
        m.v['A$'] = m.chr(204) + m.chr(144) + m.chr(185);
        m.v.Z1 = m.v.S1; m.v.Z2 = m.v.S2;
      },
      function (m) { m.gosub(4830); },
      function (m) { if (m.v.K3 < 1) m.lompat(1470); }
    ] });
  T({ baris: 1450, bagian: [
      function (m) { m.untuk('I', 1, m.v.K3, 1, 1470); },
      function (m) { m.gosub(4800); },
      function (m) {
        m.v['A$'] = '+' + m.chr(2) + '+';
        m.v.Z1 = m.v.R1; m.v.Z2 = m.v.R2;
      }
    ] });
  T({ baris: 1460, bagian: [
      function (m) { m.gosub(4830); },
      function (m) {
        m.v['K()'][m.v.I][1] = m.v.R1;
        m.v['K()'][m.v.I][2] = m.v.R2;
        m.v['K()'][m.v.I][3] = m.v.S9 * (0.5 + m.acak());
      },
      function (m) { m.lanjutkan('I'); }
    ] });
  T({ baris: 1470, jalan: function (m) { if (m.v.B3 < 1) m.lompat(1500); } });
  T({ baris: 1480, bagian: [
      function (m) { m.gosub(4800); },
      function (m) {
        m.v['A$'] = m.chr(174) + m.chr(127) + m.chr(175);
        m.v.Z1 = m.v.R1; m.v.B4 = m.v.R1;
        m.v.Z2 = m.v.R2; m.v.B5 = m.v.R2;
      }
    ] });
  T({ baris: 1490, jalan: function (m) { m.gosub(4830); } });
  T({ baris: 1500, bagian: [
      function (m) { m.untuk('I', 1, m.v.S3, 1, 1510); },
      function (m) { m.gosub(4800); },
      function (m) {
        m.v['A$'] = ' ' + m.chr(15) + ' ';
        m.v.Z1 = m.v.R1; m.v.Z2 = m.v.R2;
      },
      function (m) { m.gosub(4830); },
      function (m) { m.lanjutkan('I'); }
    ] });
  T({ baris: 1510, jalan: function (m) { m.gosub(3720); } });

  /* --- 1520-1700: menerima perintah ------------------------------------ */
  T({ baris: 1520, jalan: function (m) {
      if (m.v.S + m.v.E > 10) {
        if (m.v.E > 10 || m.v['D()'][7] === 0) m.lompat(1580);
      }
    } });
  T({ baris: 1530, bagian: [
      function (m) {
        m.warna(16, 7); m.cetak('*** FATAL ERROR ***'); m.warna(7, 0);
      },
      function (m) { m.gosub(5290); }
    ] });
  T(cet(1540, "You've just stranded your ship in ")),
  T({ baris: 1550, jalan: function (m) {
      m.cetak('space'); m.barisBaru();
      m.cetak('You have insufficient maneuvering energy,');
    } });
  T({ baris: 1560, jalan: function (m) {
      m.cetak(' and shield control'); m.barisBaru();
      m.cetak('is presently incapable of cross');
    } });
  T({ baris: 1570, jalan: function (m) {
      m.cetak('-circuiting to engine room!!'); m.barisBaru();
      m.lompat(3480);
    } });
  T({ baris: 1580, jalan: function (m) { m.masukan('A$', 'command? '); } });
  T({ baris: 1590, bagian: [
      function (m) { m.untuk('I', 1, 9, 1, 1610); },
      function (m) {
        if (LEFT(m.v['A$'], 3) !== MID(m.v['A1$'], 3 * m.v.I - 2, 3)) {
          m.lompat(1610);
        }
      }
    ] });
  T({ baris: 1600, jalan: function (m) {
      var ke = [1720, 1510, 2440, 2530, 2750, 3090, 3180, 3980, 3510][m.v.I - 1];
      if (ke) m.lompat(ke);
    } });
  T({ baris: 1610, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) {
        m.cetak('Enter one of the following:'); m.barisBaru();
      }
    ] });
  T(cet(1620, '  NAV   (to set course)'));
  T(cet(1630, '  SRS   (for short range sensor scan)'));
  T(cet(1640, '  LRS   (for long range sensor scan)'));
  T(cet(1650, '  PHA   (to fire phasers)'));
  T(cet(1660, '  TOR   (to fire photon torpedoes)'));
  T(cet(1670, '  SHI   (to raise or lower shields)'));
  T(cet(1680, '  DAM   (for damage control reports)'));
  T(cet(1690, '  COM   (to call on library-computer)'));
  T({ baris: 1700, jalan: function (m) {
      m.cetak('  RES   (to resign your command)'); m.barisBaru();
      m.barisBaru(); m.lompat(1520);
    } });

  /* --- 1710-2420: navigasi --------------------------------------------- */
  T(rem(1710));
  T({ baris: 1720, bagian: [
      function (m) { m.masukan('C1', 'Course (1-9)? '); },
      function (m) { if (m.v.C1 === 9) m.v.C1 = 1; }
    ] });
  T({ baris: 1730, jalan: function (m) {
      if (m.v.C1 >= 1 && m.v.C1 < 9) m.lompat(1750);
    } });
  T({ baris: 1740, jalan: function (m) {
      m.cetak("   Lt. Sulu reports,  'Incorrect course data, sir!'");
      m.barisBaru(); m.lompat(1520);
    } });
  T({ baris: 1750, jalan: function (m) {
      m.v['X$'] = '8';
      if (m.v['D()'][1] < 0) m.v['X$'] = '0.2';
    } });
  T({ baris: 1760, bagian: [
      function (m) { m.cetak('Warp factor(0-' + m.v['X$'] + ')'); },
      function (m) { m.masukan('W1', '? '); },
      function (m) {
        if (m.v['D()'][1] < 0 && m.v.W1 > 0.2) m.lompat(1810);
      }
    ] });
  T({ baris: 1770, jalan: function (m) {
      if (m.v.W1 > 0 && m.v.W1 < 8) m.lompat(1820);
    } });
  T({ baris: 1780, jalan: function (m) { if (m.v.W1 === 0) m.lompat(1520); } });
  T({ baris: 1790, jalan: function (m) {
      m.cetak("   Chief Engineer Scott reports 'The engines won't take");
    } });
  T({ baris: 1800, jalan: function (m) {
      m.cetak(' warp ' + bas(m.v.W1) + '!'); m.barisBaru(); m.lompat(1520);
    } });
  T({ baris: 1810, jalan: function (m) {
      m.cetak('Warp engines are damaged.  Maximum speed = warp 0.2');
      m.barisBaru(); m.lompat(1520);
    } });
  T({ baris: 1820, jalan: function (m) {
      m.v.N = Math.trunc(m.v.W1 * 8 + 0.5);
      if (m.v.E - m.v.N >= 0) m.lompat(1900);
    } });
  T(cet(1830, "Engineering reports   'Insufficient energy available"));
  T({ baris: 1840, jalan: function (m) {
      m.cetak('                       for maneuvering at warp' +
              bas(m.v.W1) + "!'"); m.barisBaru();
    } });
  T({ baris: 1850, jalan: function (m) {
      if (m.v.S < m.v.N - m.v.E || m.v['D()'][7] < 0) m.lompat(1520);
    } });
  T({ baris: 1860, jalan: function (m) {
      m.cetak('Deflector control room acknowledges' + bas(m.v.S) +
              'units of energy'); m.barisBaru();
    } });
  T(cet(1870, '                         presently deployed to shields.'));
  T({ baris: 1880, jalan: function (m) { m.lompat(1520); } });
  T(rem(1890));
  /* 1900-1930 KLINGON PINDAH TEMPAT setiap kali Enterprise bergerak — dan
     yang menghapus jejaknya adalah menulis tiga spasi ke stringnya. */
  T({ baris: 1900, bagian: [
      function (m) { m.untuk('I', 1, m.v.K3, 1, 1930); },
      function (m) { if (m.v['K()'][m.v.I][3] === 0) m.lompat(1930); }
    ] });
  T({ baris: 1910, bagian: [
      function (m) {
        m.v['A$'] = '   ';
        m.v.Z1 = m.v['K()'][m.v.I][1]; m.v.Z2 = m.v['K()'][m.v.I][2];
      },
      function (m) { m.gosub(4830); },
      function (m) { m.gosub(4800); }
    ] });
  T({ baris: 1920, bagian: [
      function (m) {
        m.v['K()'][m.v.I][1] = m.v.Z1; m.v['K()'][m.v.I][2] = m.v.Z2;
        m.v['A$'] = '+' + m.chr(2) + '+';
      },
      function (m) { m.gosub(4830); }
    ] });
  T({ baris: 1930, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { m.gosub(4810); },
      function (m) {
        m.v.D1 = 0; m.v.D6 = m.v.W1;
        if (m.v.W1 >= 1) m.v.D6 = 1;
      }
    ] });
  /* 1940-1990 KERUSAKAN PULIH SENDIRI seiring waktu terbang. Nilai negatif
     di `D(I)` berarti rusak; tiap gerakan menambahnya sedikit. */
  T({ baris: 1940, bagian: [
      function (m) { m.untuk('I', 1, 8, 1, 1990); },
      function (m) { if (m.v['D()'][m.v.I] >= 0) m.lompat(1990); }
    ] });
  T({ baris: 1950, jalan: function (m) {
      m.v['D()'][m.v.I] += m.v.D6;
      if (m.v['D()'][m.v.I] > -0.1 && m.v['D()'][m.v.I] < 0) {
        m.v['D()'][m.v.I] = -0.1; m.lompat(1990);
      }
    } });
  T({ baris: 1960, jalan: function (m) {
      if (m.v['D()'][m.v.I] < 0) m.lompat(1990);
    } });
  T({ baris: 1970, jalan: function (m) {
      if (m.v.D1 !== 1) {
        m.v.D1 = 1; m.cetak('DAMAGE CONTROL REPORT:   ');
      }
    } });
  T({ baris: 1980, bagian: [
      function (m) { m.tab(8); m.v.R1 = m.v.I; },
      function (m) { m.gosub(4890); },
      function (m) {
        m.cetak(m.v['G2$'] + ' Repair completed.'); m.barisBaru();
      }
    ] });
  T({ baris: 1990, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { if (m.acak() > 0.2) m.lompat(2070); }
    ] });
  T({ baris: 2000, jalan: function (m) {
      m.v.R1 = FNR(m);
      if (m.acak() >= 0.6) m.lompat(2040);
    } });
  T({ baris: 2010, jalan: function (m) { if (m.v.K3 === 0) m.lompat(2070); } });
  T({ baris: 2020, jalan: function (m) {
      m.v['D()'][m.v.R1] -= (m.acak() * 5 + 1);
      m.cetak('DAMAGE CONTROL REPORT:   ');
    } });
  T({ baris: 2030, bagian: [
      function (m) { m.gosub(4890); },
      function (m) {
        m.cetak(m.v['G2$'] + ' damaged'); m.barisBaru(); m.barisBaru();
        m.lompat(2070);
      }
    ] });
  T({ baris: 2040, jalan: function (m) {
      m.v['D()'][m.v.R1] += m.acak() * 3 + 1;
      m.cetak('DAMAGE CONTROL REPORT:   ');
    } });
  T({ baris: 2050, bagian: [
      function (m) { m.gosub(4890); },
      function (m) {
        m.cetak(m.v['G2$'] + ' State of repair improved');
        m.barisBaru(); m.barisBaru();
      }
    ] });
  T(rem(2060));
  T({ baris: 2070, bagian: [
      function (m) {
        m.v['A$'] = '   ';
        m.v.Z1 = Math.trunc(m.v.S1); m.v.Z2 = Math.trunc(m.v.S2);
      },
      function (m) { m.gosub(4830); }
    ] });
  /* 2080-2090 ARAH PECAHAN DIINTERPOLASI antara dua arah kompas. Arah 2,5
     berarti setengah jalan antara arah 2 dan arah 3. */
  T({ baris: 2080, jalan: function (m) {
      var C = m.v['C()'], c = m.v.C1;
      m.v.X1 = C[Math.trunc(c)][1] +
        (C[Math.trunc(c) + 1][1] - C[Math.trunc(c)][1]) * (c - Math.trunc(c));
      m.v.X = m.v.S1; m.v.Y = m.v.S2;
    } });
  T({ baris: 2090, jalan: function (m) {
      var C = m.v['C()'], c = m.v.C1;
      m.v.X2 = C[Math.trunc(c)][2] +
        (C[Math.trunc(c) + 1][2] - C[Math.trunc(c)][2]) * (c - Math.trunc(c));
      m.v.Q4 = m.v.Q1; m.v.Q5 = m.v.Q2;
    } });
  T({ baris: 2100, bagian: [
      function (m) { m.untuk('I', 1, m.v.N, 1, 2140); },
      function (m) {
        m.v.S1 += m.v.X1; m.v.S2 += m.v.X2;
        if (m.v.S1 < 1 || m.v.S1 >= 9 || m.v.S2 < 1 || m.v.S2 >= 9) {
          m.lompat(2220);
        }
      }
    ] });
  /* 2110 TABRAKAN DIPERIKSA DENGAN MEMBACA STRINGNYA: kalau tiga aksara di
     petak tujuan bukan spasi, ada sesuatu di sana. */
  T({ baris: 2110, jalan: function (m) {
      m.v.S8 = Math.trunc(m.v.S1) * 24 + Math.trunc(m.v.S2) * 3 - 26;
      if (MID(m.v['Q$'], m.v.S8, 2) === '  ') m.lompat(2140);
    } });
  T({ baris: 2120, jalan: function (m) {
      m.v.S1 = Math.trunc(m.v.S1 - m.v.X1);
      m.v.S2 = Math.trunc(m.v.S2 - m.v.X2);
      m.cetak('Warp engines shut down at ');
    } });
  T({ baris: 2130, jalan: function (m) {
      m.cetak('sector' + bas(m.v.S1) + ',' + bas(m.v.S2) +
              'due to bad navigation.'); m.barisBaru();
      m.lompat(2150);
    } });
  T({ baris: 2140, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) {
        m.v.S1 = Math.trunc(m.v.S1); m.v.S2 = Math.trunc(m.v.S2);
      }
    ] });
  T({ baris: 2150, jalan: function (m) {
      m.v['A$'] = m.chr(204) + m.chr(144) + m.chr(185);
    } });
  T({ baris: 2160, bagian: [
      function (m) {
        m.v.Z1 = Math.trunc(m.v.S1); m.v.Z2 = Math.trunc(m.v.S2);
      },
      function (m) { m.gosub(4830); },
      function (m) { m.gosub(2390); },
      function (m) { m.v.T8 = 1; }
    ] });
  T({ baris: 2170, jalan: function (m) {
      if (m.v.W1 < 1) m.v.T8 = 0.1 * Math.trunc(10 * m.v.W1);
    } });
  T({ baris: 2180, jalan: function (m) {
      m.v.T += m.v.T8;
      if (m.v.T > m.v.T0 + m.v.T9) m.lompat(3480);
    } });
  T(rem(2190));
  T({ baris: 2200, jalan: function (m) { m.lompat(1510); } });
  T(rem(2210));
  T({ baris: 2220, jalan: function (m) {
      m.v.X = 8 * m.v.Q1 + m.v.X + m.v.N * m.v.X1;
      m.v.Y = 8 * m.v.Q2 + m.v.Y + m.v.N * m.v.X2;
      m.v.Q1 = Math.trunc(m.v.X / 8); m.v.Q2 = Math.trunc(m.v.Y / 8);
      m.v.S1 = Math.trunc(m.v.X - m.v.Q1 * 8);
    } });
  T({ baris: 2230, jalan: function (m) {
      m.v.S2 = Math.trunc(m.v.Y - m.v.Q2 * 8);
      if (m.v.S1 === 0) { m.v.Q1 = m.v.Q1 - 1; m.v.S1 = 8; }
    } });
  T({ baris: 2240, jalan: function (m) {
      if (m.v.S2 === 0) { m.v.Q2 = m.v.Q2 - 1; m.v.S2 = 8; }
    } });
  T({ baris: 2250, jalan: function (m) {
      m.v.X5 = 0;
      if (m.v.Q1 < 1) { m.v.X5 = 1; m.v.Q1 = 1; m.v.S1 = 1; }
    } });
  T(tepi(2260, function (m) { return m.v.Q1 > 8; }, 'Q1', 8, 'S1', 8));
  T(tepi(2270, function (m) { return m.v.Q2 < 1; }, 'Q2', 1, 'S2', 1));
  T(tepi(2280, function (m) { return m.v.Q2 > 8; }, 'Q2', 8, 'S2', 8));
  T({ baris: 2290, jalan: function (m) { if (m.v.X5 === 0) m.lompat(2360); } });
  T(cet(2300, 'Lt. Uhura reports message from Starfleet Command:'));
  T(cet(2310, "  'Permission to attempt crossing of galactic perimeter"));
  T(cet(2320, "  is hereby *DENIED*.  Shut down your engines.'"));
  T(cet(2330, "Chief Engineer Scott reports 'Warp engines shut down"));
  T({ baris: 2340, jalan: function (m) {
      m.cetak('  at sector' + bas(m.v.S1) + ',' + bas(m.v.S2) +
              'of quadrant' + bas(m.v.Q1) + ',' + bas(m.v.Q2) + ".'");
      m.barisBaru();
    } });
  T({ baris: 2350, jalan: function (m) { if (m.v.T > m.v.T0) m.lompat(3480); } });
  T({ baris: 2360, jalan: function (m) {
      if (8 * m.v.Q1 + m.v.Q2 === 8 * m.v.Q4 + m.v.Q5) m.lompat(2150);
    } });
  T({ baris: 2370, bagian: [
      function (m) { m.v.T = m.v.T + 1; },
      function (m) { m.gosub(2390); },
      function (m) { m.lompat(1280); }
    ] });
  T(rem(2380));
  T({ baris: 2390, jalan: function (m) {
      m.v.E = m.v.E - m.v.N - 10;
      if (m.v.E > 0) m.kembali();
    } });
  T(cet(2400, 'Shield control supplies energy to complete the maneuver.'));
  T({ baris: 2410, jalan: function (m) {
      m.v.S = m.v.S + m.v.E; m.v.E = 0;
      if (m.v.S <= 0) m.v.S = 0;
    } });
  T({ baris: 2420, jalan: function (m) { m.kembali(); } });

  /* --- 2430-2510: pemindai jarak jauh ---------------------------------- */
  T(rem(2430));
  T({ baris: 2440, jalan: function (m) {
      if (m.v['D()'][3] < 0) {
        m.cetak('Long Range Sensors are inoperable'); m.barisBaru();
        m.lompat(1520);
      }
    } });
  T({ baris: 2450, jalan: function (m) {
      m.cetak('Long Range Scan for quadrant' + bas(m.v.Q1) + ',' + bas(m.v.Q2));
      m.barisBaru();
    } });
  T({ baris: 2460, jalan: function (m) {
      m.v['O1$'] = '-------------------';
      m.cetak(m.v['O1$']); m.barisBaru();
    } });
  T({ baris: 2470, bagian: [
      function (m) { m.untuk('I', m.v.Q1 - 1, m.v.Q1 + 1, 1, 2520); },
      function (m) {
        m.v['N()'][1] = -1; m.v['N()'][2] = -2; m.v['N()'][3] = -3;
      },
      function (m) { m.untuk('J', m.v.Q2 - 1, m.v.Q2 + 1, 1, 2490); }
    ] });
  /* 2480 pemindaian jarak jauh juga MENGISI PETA INGATAN `Z()` — itulah
     yang nanti ditampilkan perintah GAL RCD. */
  T({ baris: 2480, jalan: function (m) {
      var i = m.v.I, j = m.v.J;
      if (i > 0 && i < 9 && j > 0 && j < 9) {
        m.v['N()'][j - m.v.Q2 + 2] = m.v['G()'][i][j];
        m.v['Z()'][i][j] = m.v['G()'][i][j];
      }
    } });
  T({ baris: 2490, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) { m.untuk('L', 1, 3, 1, 2510); },
      function (m) {
        m.cetak(': ');
        if (m.v['N()'][m.v.L] < 0) { m.cetak('*** '); m.lompat(2510); }
      }
    ] });
  T({ baris: 2500, jalan: function (m) {
      m.cetak(RIGHT(bas(m.v['N()'][m.v.L] + 1000).trim(), 3) + ' ');
    } });
  T({ baris: 2510, bagian: [
      function (m) { m.lanjutkan('L'); },
      function (m) {
        m.cetak(':'); m.barisBaru();
        m.cetak(m.v['O1$']); m.barisBaru();
      },
      function (m) { m.lanjutkan('I'); },
      function (m) { m.lompat(1520); }
    ] });

  /* --- 2520-2730: fáser ------------------------------------------------ */
  T(rem(2520));
  T({ baris: 2530, jalan: function (m) {
      if (m.v['D()'][4] < 0) {
        m.cetak('Phasers Inoperative'); m.barisBaru(); m.lompat(1520);
      }
    } });
  T({ baris: 2540, jalan: function (m) { if (m.v.K3 > 0) m.lompat(2570); } });
  T(cet(2550, "Science Officer Spock reports  'Sensors show no enemy ships"));
  T({ baris: 2560, jalan: function (m) {
      m.cetak("                                in this quadrant'");
      m.barisBaru(); m.lompat(1520);
    } });
  T({ baris: 2570, jalan: function (m) {
      if (m.v['D()'][8] < 0) {
        m.cetak('Computer failure hampers accuracy'); m.barisBaru();
      }
    } });
  /* 2580 KUTIP YANG TIDAK DITUTUP, dan sisa barisnya ikut jadi isi string:
     yang tercetak "Phasers locked on target;  :;". */
  T(cet(2580, 'Phasers locked on target;  :;'));
  T({ baris: 2590, jalan: function (m) {
      m.cetak('Energy available = ' + bas(m.v.E) + 'units'); m.barisBaru();
    } });
  T({ baris: 2600, bagian: [
      function (m) { m.masukan('X', 'Numbers of units to fire? '); },
      function (m) { if (m.v.X <= 0) m.lompat(1520); }
    ] });
  T({ baris: 2610, jalan: function (m) {
      if (m.v.E - m.v.X < 0) m.lompat(2590);
    } });
  T({ baris: 2620, bagian: [
      function (m) { m.v.E = m.v.E - m.v.X; },
      function (m) { m.gosub(5420); },
      function (m) { if (m.v['D()'][7] < 0) m.v.X = m.v.X * m.acak(); }
    ] });
  /* 2630 daya dibagi RATA ke semua Klingon di kuadran — menembak satu per
     satu tidak mungkin. */
  T({ baris: 2630, bagian: [
      function (m) { m.v.H1 = Math.trunc(m.v.X / m.v.K3); },
      function (m) { m.untuk('I', 1, 3, 1, 2740); },
      function (m) { if (m.v['K()'][m.v.I][3] <= 0) m.lompat(2730); }
    ] });
  T({ baris: 2640, jalan: function (m) {
      m.v.H = Math.trunc((m.v.H1 / FND(m)) * (m.acak() + 2));
      if (m.v.H > 0.15 * m.v['K()'][m.v.I][3]) m.lompat(2660);
    } });
  T({ baris: 2650, jalan: function (m) {
      m.cetak('Sensors show no damage to enemy at ' +
              bas(m.v['K()'][m.v.I][1]) + ',' + bas(m.v['K()'][m.v.I][2]));
      m.barisBaru(); m.lompat(2730);
    } });
  T({ baris: 2660, jalan: function (m) {
      m.v['K()'][m.v.I][3] -= m.v.H;
      m.cetak(bas(m.v.H) + 'Unit hit on Klingon at sector' +
              bas(m.v['K()'][m.v.I][1]) + ',');
    } });
  T({ baris: 2670, jalan: function (m) {
      m.cetak(bas(m.v['K()'][m.v.I][2])); m.barisBaru();
      if (m.v['K()'][m.v.I][3] > 0) m.lompat(2700);
    } });
  T({ baris: 2680, jalan: function (m) {
      m.warna(16, 7); m.cetak('**** KLINGON DESTROYED ****');
      m.warna(7, 0); m.spc(53); m.barisBaru();
    } });
  T({ baris: 2690, jalan: function (m) { m.lompat(2710); } });
  T({ baris: 2700, jalan: function (m) {
      m.cetak('   (Sensors show' + bas(m.v['K()'][m.v.I][3]) +
              'units remaining)'); m.barisBaru(); m.lompat(2730);
    } });
  T({ baris: 2710, bagian: [
      function (m) {
        m.v.K3 -= 1; m.v.K9 -= 1;
        m.v.Z1 = m.v['K()'][m.v.I][1]; m.v.Z2 = m.v['K()'][m.v.I][2];
        m.v['A$'] = '   ';
      },
      function (m) { m.gosub(4830); }
    ] });
  T({ baris: 2720, jalan: function (m) {
      m.v['K()'][m.v.I][3] = 0;
      m.v['G()'][m.v.Q1][m.v.Q2] -= 100;
      m.v['Z()'][m.v.Q1][m.v.Q2] = m.v['G()'][m.v.Q1][m.v.Q2];
      if (m.v.K9 <= 0) m.lompat(3680);
    } });
  T({ baris: 2730, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { m.gosub(3350); },
      function (m) { m.lompat(1520); }
    ] });

  /* --- 2740-3070: torpedo ---------------------------------------------- */
  T(rem(2740));
  T({ baris: 2750, jalan: function (m) {
      if (m.v.P <= 0) {
        m.cetak('All photon torpedoes expended'); m.barisBaru();
        m.lompat(1520);
      }
    } });
  T({ baris: 2760, jalan: function (m) {
      if (m.v['D()'][5] < 0) {
        m.cetak('Photon tubes are not operational'); m.barisBaru();
        m.lompat(1520);
      }
    } });
  T({ baris: 2770, bagian: [
      function (m) { m.masukan('C1', 'Photon torpedo course (1-9)? '); },
      function (m) { if (m.v.C1 === 9) m.v.C1 = 1; }
    ] });
  T({ baris: 2780, jalan: function (m) {
      if (m.v.C1 >= 1 && m.v.C1 < 9) m.lompat(2810);
    } });
  T(cet(2790, "Ensign Chekov reports,  'Incorrect course data, sir!'"));
  T({ baris: 2800, jalan: function (m) { m.lompat(1520); } });
  T({ baris: 2810, jalan: function (m) {
      var C = m.v['C()'], c = m.v.C1;
      m.v.X1 = C[Math.trunc(c)][1] +
        (C[Math.trunc(c) + 1][1] - C[Math.trunc(c)][1]) * (c - Math.trunc(c));
      m.v.E = m.v.E - 2; m.v.P = m.v.P - 1;
    } });
  T({ baris: 2820, bagian: [
      function (m) {
        var C = m.v['C()'], c = m.v.C1;
        m.v.X2 = C[Math.trunc(c)][2] +
          (C[Math.trunc(c) + 1][2] - C[Math.trunc(c)][2]) * (c - Math.trunc(c));
        m.v.X = m.v.S1; m.v.Y = m.v.S2;
      },
      function (m) { m.gosub(5360); }
    ] });
  T(cet(2830, 'Torpedo track:'));
  T({ baris: 2840, jalan: function (m) {
      m.v.X += m.v.X1; m.v.Y += m.v.X2;
      m.v.X3 = Math.trunc(m.v.X + 0.5); m.v.Y3 = Math.trunc(m.v.Y + 0.5);
    } });
  T({ baris: 2850, jalan: function (m) {
      if (m.v.X3 < 1 || m.v.X3 > 8 || m.v.Y3 < 1 || m.v.Y3 > 8) m.lompat(3070);
    } });
  T({ baris: 2860, bagian: [
      function (m) {
        m.cetak('              ' + bas(m.v.X3) + ',' + bas(m.v.Y3));
        m.barisBaru();
        m.v['A$'] = '   '; m.v.Z1 = m.v.X; m.v.Z2 = m.v.Y;
      },
      function (m) { m.gosub(4990); }
    ] });
  T({ baris: 2870, jalan: function (m) { if (m.v.Z3 !== 0) m.lompat(2840); } });
  T({ baris: 2880, bagian: [
      function (m) {
        m.v['A$'] = '+' + m.chr(2) + '+';
        m.v.Z1 = m.v.X; m.v.Z2 = m.v.Y;
      },
      function (m) { m.gosub(4990); },
      function (m) { if (m.v.Z3 === 0) m.lompat(2940); }
    ] });
  T({ baris: 2890, jalan: function (m) {
      m.warna(16, 7); m.cetak('**** KLINGON DESTROYED ****');
      m.warna(7, 0); m.spc(53); m.barisBaru();
    } });
  T({ baris: 2900, jalan: function (m) {
      m.v.K3 -= 1; m.v.K9 -= 1;
      if (m.v.K9 <= 0) m.lompat(3680);
    } });
  T({ baris: 2910, bagian: [
      function (m) { m.untuk('I', 1, 3, 1, 2920); },
      function (m) {
        if (m.v.X3 === m.v['K()'][m.v.I][1] &&
            m.v.Y3 === m.v['K()'][m.v.I][2]) m.lompat(2930);
      }
    ] });
  T({ baris: 2920, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { m.v.I = 3; }
    ] });
  T({ baris: 2930, jalan: function (m) {
      m.v['K()'][m.v.I][3] = 0; m.lompat(3050);
    } });
  T({ baris: 2940, bagian: [
      function (m) {
        m.v['A$'] = ' ' + m.chr(15) + ' ';
        m.v.Z1 = m.v.X; m.v.Z2 = m.v.Y;
      },
      function (m) { m.gosub(4990); },
      function (m) { if (m.v.Z3 === 0) m.lompat(2960); }
    ] });
  T({ baris: 2950, bagian: [
      function (m) {
        m.cetak('Star at' + bas(m.v.X3) + ',' + bas(m.v.Y3) +
                'absorbed torpedo energy.'); m.barisBaru();
      },
      function (m) { m.gosub(3350); },
      function (m) { m.lompat(1520); }
    ] });
  T({ baris: 2960, bagian: [
      function (m) {
        m.v['A$'] = m.chr(174) + m.chr(127) + m.chr(175);
        m.v.Z1 = m.v.X; m.v.Z2 = m.v.Y;
      },
      function (m) { m.gosub(4990); },
      function (m) { if (m.v.Z3 === 0) m.lompat(2770); }
    ] });
  T({ baris: 2970, jalan: function (m) {
      m.warna(16, 7); m.cetak('*** STARBASE DESTROYED ***');
      m.warna(7, 0); m.spc(54); m.barisBaru();
    } });
  T({ baris: 2980, jalan: function (m) {
      m.v.B3 -= 1; m.v.B9 -= 1;
    } });
  T({ baris: 2990, jalan: function (m) {
      if (m.v.B9 > 0 || m.v.K9 > m.v.T - m.v.T0 - m.v.T9) m.lompat(3030);
    } });
  T({ baris: 3000, jalan: function (m) {
      m.cetak('THAT DOES IT, CAPTAIN!!  You are hereby relieved of command');
      m.spc(21); m.barisBaru();
    } });
  T(cet(3010, 'and sentenced to 99 stardates of hard labor on CYGNUS 12!!'));
  T({ baris: 3020, jalan: function (m) { m.lompat(3510); } });
  T(cet(3030, 'Starfleet reviewing your record to consider'));
  T({ baris: 3040, jalan: function (m) {
      m.cetak('court martial!'); m.barisBaru(); m.v.D0 = 0;
    } });
  T({ baris: 3050, bagian: [
      function (m) {
        m.v.Z1 = m.v.X; m.v.Z2 = m.v.Y; m.v['A$'] = '   ';
      },
      function (m) { m.gosub(4830); }
    ] });
  T({ baris: 3060, bagian: [
      function (m) {
        var g = m.v.K3 * 100 + m.v.B3 * 10 + m.v.S3;
        m.v['G()'][m.v.Q1][m.v.Q2] = g;
        m.v['Z()'][m.v.Q1][m.v.Q2] = g;
      },
      function (m) { m.gosub(3350); },
      function (m) { m.lompat(1520); }
    ] });
  T({ baris: 3070, bagian: [
      function (m) { m.cetak('Torpedo missed'); m.barisBaru(); },
      function (m) { m.gosub(3350); },
      function (m) { m.lompat(1520); }
    ] });

  /* --- 3080-3160: perisai ---------------------------------------------- */
  T(rem(3080));
  T({ baris: 3090, jalan: function (m) {
      if (m.v['D()'][7] < 0) {
        m.cetak('Shield control inoperable'); m.barisBaru(); m.lompat(1520);
      }
    } });
  T({ baris: 3100, bagian: [
      function (m) {
        m.cetak('Energy available = ' + bas(m.v.E + m.v.S)); m.barisBaru();
      },
      function (m) { m.masukan('X', 'Number of units to shields? '); }
    ] });
  T({ baris: 3110, jalan: function (m) {
      if (m.v.X < 0 || m.v.S === m.v.X) {
        m.cetak('<shields unchanged>'); m.barisBaru(); m.lompat(1520);
      }
    } });
  T({ baris: 3120, jalan: function (m) {
      if (m.v.X < m.v.E + m.v.S) m.lompat(3150);
    } });
  T(cet(3130, "Shield Control reports  'This is not the federation treasury.'"));
  /* 3140 KUTIP PENUTUPNYA HILANG. Yang seharusnya dua pernyataan —
     mencetak lalu melompat ke 1990 — jadi SATU string:
     `"<shields unchanged>:goto 1990`. Lompatannya tidak pernah terjadi,
     dan alirannya jatuh ke baris 3150 yang MENYETEL perisainya juga.
     Permintaan yang baru saja ditolak tetap dikabulkan. */
  T(cet(3140, '<shields unchanged>:goto 1990'));
  T({ baris: 3150, jalan: function (m) {
      m.v.E = m.v.E + m.v.S - m.v.X; m.v.S = m.v.X;
      m.cetak('Deflector Control Room report:'); m.barisBaru();
    } });
  T({ baris: 3160, jalan: function (m) {
      m.cetak("  'Shields now at" + bas(Math.trunc(m.v.S)) +
              "units per your command.'"); m.barisBaru(); m.lompat(1520);
    } });

  /* --- 3170-3330: laporan kerusakan ------------------------------------ */
  T(rem(3170));
  T({ baris: 3180, jalan: function (m) {
      if (m.v['D()'][6] >= 0) m.lompat(3290);
    } });
  T({ baris: 3190, jalan: function (m) {
      m.cetak('Damage control report not available'); m.barisBaru();
      if (m.v.D0 === 0) m.lompat(1520);
    } });
  T({ baris: 3200, jalan: function (m) {
      m.v.D3 = 0;
      for (m.v.I = 1; m.v.I <= 8; m.v.I++) {
        if (m.v['D()'][m.v.I] < 0) m.v.D3 = m.v.D3 + 1;
      }
    } });
  T({ baris: 3210, jalan: function (m) { if (m.v.D3 === 0) m.lompat(1520); } });
  T({ baris: 3220, jalan: function (m) {
      m.barisBaru();
      m.v.D3 = m.v.D3 + m.v.D4;
      if (m.v.D3 >= 1) m.v.D3 = 0.9;
    } });
  T(cet(3230, 'Technicians standing by to effect repairs to your ship;'));
  T({ baris: 3240, jalan: function (m) {
      m.cetak('estimated time to repair:' +
              bas(0.01 * Math.trunc(100 * m.v.D3)) + 'stardates');
      m.barisBaru();
    } });
  T({ baris: 3250, jalan: function (m) {
      m.masukan('A$', 'Will you authorize the repair order (Y/N)? ');
    } });
  T({ baris: 3260, jalan: function (m) {
      if (m.v['A$'] !== 'y' && m.v['A$'] !== 'Y') m.lompat(1520);
    } });
  T({ baris: 3270, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 8; m.v.I++) {
        if (m.v['D()'][m.v.I] < 0) m.v['D()'][m.v.I] = 0;
      }
    } });
  T({ baris: 3280, jalan: function (m) { m.v.T = m.v.T + m.v.D3 + 0.1; } });
  T({ baris: 3290, bagian: [
      function (m) {
        m.barisBaru();
        m.cetak('Device            state of repair'); m.barisBaru();
        m.untuk('R1', 1, 8, 1, 3330);
      },
      function (m) { m.gosub(4890); }
    ] });
  T({ baris: 3300, jalan: function (m) {
      m.cetak(m.v['G2$']);
      m.v['GG2$'] = LEFT(m.v['Z$'], 25 - m.v['G2$'].length);
      m.cetak(m.v['GG2$']);
    } });
  T({ baris: 3310, jalan: function (m) {
      m.v.GG2 = Math.trunc(m.v['D()'][m.v.R1] * 100) * 0.01;
      m.cetak(bas(m.v.GG2)); m.barisBaru();
    } });
  T({ baris: 3320, bagian: [
      function (m) { m.lanjutkan('R1'); },
      function (m) { m.barisBaru(); if (m.v.D0 !== 0) m.lompat(3200); }
    ] });
  T({ baris: 3330, jalan: function (m) { m.lompat(1520); } });

  /* --- 3340-3460: Klingon menembak ------------------------------------- */
  T(rem(3340));
  T({ baris: 3350, jalan: function (m) { if (m.v.K3 <= 0) m.kembali(); } });
  T({ baris: 3360, jalan: function (m) {
      if (m.v.D0 !== 0) {
        m.cetak('Starbase shields protect the ENTERPRISE'); m.barisBaru();
        m.kembali();
      }
    } });
  T({ baris: 3370, bagian: [
      function (m) { m.untuk('I', 1, 3, 1, 3470); },
      function (m) { if (m.v['K()'][m.v.I][3] <= 0) m.lompat(3460); }
    ] });
  /* 3380 KEKUATAN KLINGON MENYUSUT SENDIRI setiap kali ia menembak —
     `K(I,3)/(3+RND(0))`. Menembak melelahkannya. */
  T({ baris: 3380, jalan: function (m) {
      m.v.H = Math.trunc((m.v['K()'][m.v.I][3] / FND(m)) * (2 + m.acak()));
      m.v.S = m.v.S - m.v.H;
      m.v['K()'][m.v.I][3] = m.v['K()'][m.v.I][3] / (3 + m.acak());
    } });
  T({ baris: 3390, jalan: function (m) {
      m.warna(16, 7); m.cetak('ENTERPRISE HIT!');
      m.warna(7, 0); m.spc(65); m.barisBaru();
    } });
  T({ baris: 3400, bagian: [
      function (m) { m.gosub(5480); },
      function (m) {
        m.cetak(bas(m.v.H) + 'Unit hit on ENTERPRISE from sector' +
                bas(m.v['K()'][m.v.I][1]) + ',' + bas(m.v['K()'][m.v.I][2]));
        m.barisBaru();
      }
    ] });
  T({ baris: 3410, jalan: function (m) { if (m.v.S <= 0) m.lompat(3490); } });
  T({ baris: 3420, jalan: function (m) {
      m.cetak('      <shields down to' + bas(m.v.S) + 'units>'); m.barisBaru();
      if (m.v.H < 20) m.lompat(3460);
    } });
  T({ baris: 3430, jalan: function (m) {
      if (m.acak() > 0.6 || m.v.H / m.v.S <= 0.02) m.lompat(3460);
    } });
  T({ baris: 3440, bagian: [
      function (m) {
        m.v.R1 = FNR(m);
        m.v['D()'][m.v.R1] -= m.v.H / m.v.S + 0.5 * m.acak();
      },
      function (m) { m.gosub(4890); }
    ] });
  T({ baris: 3450, jalan: function (m) {
      m.cetak("Damage control reports  '" + m.v['G2$'] +
              " damaged by the hit'"); m.barisBaru();
    } });
  T({ baris: 3460, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { m.kembali(); }
    ] });

  /* --- 3470-3700: akhir permainan -------------------------------------- */
  T(rem(3470));
  T({ baris: 3480, jalan: function (m) {
      m.cetak('It is stardate' + bas(m.v.T)); m.barisBaru(); m.lompat(3510);
    } });
  T({ baris: 3490, jalan: function (m) {
      m.barisBaru();
      m.cetak('the ENTERPRISE has been destroyed.  The Federation ');
    } });
  T({ baris: 3500, jalan: function (m) {
      m.cetak('will be conquered'); m.barisBaru(); m.lompat(3480);
    } });
  T({ baris: 3510, jalan: function (m) {
      m.cetak('There were' + bas(m.v.K9) + 'Klingon battle cruisers left at');
      m.barisBaru();
    } });
  T(cet(3520, 'the end of your mission'));
  T({ baris: 3530, jalan: function (m) {
      m.barisBaru(); m.barisBaru();
      if (m.v.B9 === 0) m.lompat(3670);
    } });
  T(cet(3540, 'The Federation is in need of a new starship commander'));
  T(cet(3550, 'for a similar mission -- if there is a volunteer,'));
  T({ baris: 3560, bagian: [
      function (m) {
        m.masukan('A$', "let him or her step forward and enter 'aye'? ");
      },
      function (m) { if (m.v['A$'] === 'aye') m.lompat(520); }
    ] });
  /* 3570-3660 TOMBOL FUNGSI DIKEMBALIKAN ke bawaan BASIC sebelum keluar.
     Program yang meminjam sesuatu dan mengembalikannya. */
  [3570, 3580, 3590, 3600, 3610, 3620, 3630, 3640, 3650, 3660].forEach(function (n) {
    T({ baris: n, jalan: function () { } });
  });
  T({ baris: 3670, jalan: function (m) { m.jalankan('MENU'); } });
  T(cet(3680, 'Congratulations, Captain! the last Klingon battle cruiser'));
  T({ baris: 3690, jalan: function (m) {
      m.cetak('menacing the Federation has been destroyed.'); m.barisBaru();
      m.barisBaru();
    } });
  /* 3700 NILAI EFISIENSI: Klingon yang dibunuh dibagi hari yang terpakai,
     dikuadratkan, dikali seribu. Cepat jauh lebih berharga daripada banyak. */
  T({ baris: 3700, jalan: function (m) {
      var e = 1000 * Math.pow(m.v.K7 / (m.v.T - m.v.T0), 2);
      m.cetak('Your efficiency rating is' + bas(e)); m.barisBaru();
      m.lompat(3530);
    } });

  /* --- 3710-3970: pemindai jarak dekat --------------------------------- */
  T(rem(3710));
  T({ baris: 3720, bagian: [
      function (m) { m.untuk('I', m.v.S1 - 1, m.v.S1 + 1, 1, 3790); },
      function (m) { m.untuk('J', m.v.S2 - 1, m.v.S2 + 1, 1, 3760); }
    ] });
  T({ baris: 3730, jalan: function (m) {
      var i = Math.trunc(m.v.I + 0.5), j = Math.trunc(m.v.J + 0.5);
      if (i < 1 || i > 8 || j < 1 || j > 8) m.lompat(3760);
    } });
  T({ baris: 3740, jalan: function (m) {
      m.v['A$'] = m.chr(174) + m.chr(127) + m.chr(175);
    } });
  T({ baris: 3750, bagian: [
      function (m) { m.v.Z1 = m.v.I; m.v.Z2 = m.v.J; },
      function (m) { m.gosub(4990); },
      function (m) { if (m.v.Z3 === 1) m.lompat(3770); }
    ] });
  T({ baris: 3760, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) { m.lanjutkan('I'); },
      function (m) { m.v.D0 = 0; m.lompat(3790); }
    ] });
  T({ baris: 3770, jalan: function (m) {
      m.v.D0 = 1; m.v['CC$'] = 'docked';
      m.v.E = m.v.E0; m.v.P = m.v.P0;
    } });
  T({ baris: 3780, jalan: function (m) {
      m.cetak('Shields dropped for docking purposes'); m.barisBaru();
      m.v.S = 0; m.lompat(3810);
    } });
  T({ baris: 3790, jalan: function (m) {
      if (m.v.K3 > 0) { m.v['C$'] = '*red*'; m.lompat(3810); }
    } });
  T({ baris: 3800, jalan: function (m) {
      m.v['C$'] = 'GREEN';
      if (m.v.E < m.v.E0 * 0.1) m.v['C$'] = 'YELLOW';
    } });
  T({ baris: 3810, jalan: function (m) {
      if (m.v['D()'][2] >= 0) m.lompat(3830);
    } });
  T({ baris: 3820, jalan: function (m) {
      m.barisBaru();
      m.cetak('*** Short Range Sensors are out ***'); m.barisBaru();
      m.barisBaru(); m.kembali();
    } });
  T({ baris: 3830, bagian: [
      function (m) {
        m.v['O1$'] = '---------------------------------';
        m.cetak(m.v['O1$']); m.barisBaru();
        m.untuk('I', 1, 8, 1, 3970);
      }
    ] });
  T({ baris: 3840, jalan: function (m) {
      m.untuk('J', (m.v.I - 1) * 24 + 1, (m.v.I - 1) * 24 + 22, 3, 3870);
    } });
  /* 3850 petak kosong DITAMPILKAN sebagai titik tengah, tapi di dalam
     stringnya ia tetap tiga spasi — gambar dan data berbeda hanya di sini. */
  T({ baris: 3850, jalan: function (m) {
      m.v['QQ$'] = MID(m.v['Q$'], m.v.J, 3);
      if (m.v['QQ$'] === '   ') m.v['QQ$'] = ' ' + m.chr(250) + ' ';
    } });
  T({ baris: 3860, bagian: [
      function (m) { m.cetak(' ' + m.v['QQ$']); },
      function (m) { m.lanjutkan('J'); }
    ] });
  T({ baris: 3870, jalan: function (m) {
      var ke = [3880, 3900, 3910, 3920, 3930, 3940, 3950, 3960][m.v.I - 1];
      if (ke) m.lompat(ke);
    } });
  T({ baris: 3880, jalan: function (m) { m.cetak('        Stardate          '); } });
  T({ baris: 3890, jalan: function (m) {
      m.v.TT = Math.trunc(m.v.T * 10) * 0.1;
      m.cetak(bas(m.v.TT)); m.barisBaru(); m.lompat(3970);
    } });
  T(panel(3900, '        Condition          ', function (m) { return m.v['C$']; }));
  T(panel(3910, '        Quadrant          ', function (m) {
      return bas(m.v.Q1) + ',' + bas(m.v.Q2);
    }));
  T(panel(3920, '        Sector            ', function (m) {
      return bas(m.v.S1) + ',' + bas(m.v.S2);
    }));
  T(panel(3930, '        Photon torpedoes  ', function (m) {
      return bas(Math.trunc(m.v.P));
    }));
  T(panel(3940, '        Total energy      ', function (m) {
      return bas(Math.trunc(m.v.E + m.v.S));
    }));
  T(panel(3950, '        Shields           ', function (m) {
      return bas(Math.trunc(m.v.S));
    }));
  T({ baris: 3960, jalan: function (m) {
      m.cetak('        Klingons remaining' + bas(Math.trunc(m.v.K9)));
      m.barisBaru();
    } });
  T({ baris: 3970, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) {
        m.cetak(m.v['O1$']); m.barisBaru(); m.kembali();
      }
    ] });

  /* --- 3980-4780: komputer perpustakaan -------------------------------- */
  T(rem(3980));
  T({ baris: 3990, jalan: function (m) {
      m.v['CM1$'] = 'GALSTATORBASDIRREG';
    } });
  T({ baris: 4000, jalan: function (m) {
      if (m.v['D()'][8] < 0) {
        m.cetak('Computer Disabled'); m.barisBaru(); m.lompat(1520);
      }
    } });
  [4010, 4020, 4030, 4040, 4050, 4060, 4070].forEach(function (n) {
    T({ baris: n, jalan: function () { } });
  });
  T({ baris: 4080, bagian: [
      function (m) { m.masukan('CM$', 'Computer active and awaiting command? '); },
      function (m) { m.v.H8 = 1; }
    ] });
  T({ baris: 4090, jalan: function (m) { m.untuk('K', 1, 6, 1, 4130); } });
  T({ baris: 4100, jalan: function (m) {
      if (LEFT(m.v['CM$'], 3) !== MID(m.v['CM1$'], 3 * m.v.K - 2, 3)) {
        m.lompat(4120);
      }
    } });
  T({ baris: 4110, jalan: function (m) {
      var ke = [4230, 4400, 4490, 4750, 4550, 4210][m.v.K - 1];
      if (ke) m.lompat(ke);
    } });
  T({ baris: 4120, jalan: function (m) { m.lanjutkan('K'); } });
  T(cet(4130, 'Functions available from library-computer:'));
  T(cet(4140, '   KEY 1= Cumulative galactic record'));
  T(cet(4150, '   KEY 2 = Status report'));
  T(cet(4160, '   KEY 3 = Photon torpedo data'));
  T(cet(4170, '   KEY 4 = Starbase nav data'));
  T(cet(4180, '   KEY 5 = Direction/distance calculator'));
  T({ baris: 4190, jalan: function (m) {
      m.cetak("   KEY 6 = Galaxy 'region name' map"); m.barisBaru();
      m.barisBaru(); m.lompat(4080);
    } });
  T(rem(4200));
  T({ baris: 4210, bagian: [
      function (m) { m.gosub(840); },
      function (m) {
        m.v.H8 = 0; m.v.G5 = 1;
        m.cetak('                        the galaxy'); m.barisBaru();
        m.lompat(4290);
      }
    ] });
  T(rem(4220));
  /* 4230-4240 PILIHAN CETAK KE KERTAS SUDAH DIKOMENTARI, lengkap dengan
     dua POKE dan `NULL 1` yang mengatur pencetaknya. Fitur yang dicabut
     tanpa dihapus. */
  T(rem(4230)); T(rem(4240));
  T({ baris: 4250, jalan: function (m) { m.gosub(840); } });
  T({ baris: 4260, jalan: function (m) {
      m.barisBaru(); m.cetak('            ');
    } });
  T({ baris: 4270, jalan: function (m) {
      m.cetak('Computer record of galaxy for quadrant' +
              bas(m.v.Q1) + ',' + bas(m.v.Q2)); m.barisBaru();
    } });
  T({ baris: 4280, jalan: function (m) { m.barisBaru(); } });
  T(cet(4290, '       1     2     3     4     5      6    7      8'));
  T({ baris: 4300, jalan: function (m) {
      m.v['O1$'] = '     ----- ----- ----- ----- ----- ------ ----- -----';
    } });
  T({ baris: 4310, bagian: [
      function (m) {
        m.cetak(m.v['O1$']); m.barisBaru();
        m.untuk('I', 1, 8, 1, 4380);
      },
      function (m) {
        m.cetak(bas(m.v.I));
        if (m.v.H8 === 0) m.lompat(4350);
      }
    ] });
  T({ baris: 4320, bagian: [
      function (m) { m.untuk('J', 1, 8, 1, 4340); },
      function (m) {
        m.cetak('   ');
        if (m.v['Z()'][m.v.I][m.v.J] === 0) {
          m.cetak('***'); m.lompat(4340);
        }
      }
    ] });
  T({ baris: 4330, jalan: function (m) {
      m.cetak(RIGHT(String(m.v['Z()'][m.v.I][m.v.J] + 1000), 3));
    } });
  T({ baris: 4340, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) { m.lompat(4370); }
    ] });
  T({ baris: 4350, bagian: [
      function (m) { m.v.Z4 = m.v.I; m.v.Z5 = 1; },
      function (m) { m.gosub(5040); },
      function (m) {
        m.v.J0 = Math.trunc(15 - 0.5 * m.v['G2$'].length);
        m.tab(m.v.J0); m.cetak(m.v['G2$']);
      }
    ] });
  T({ baris: 4360, bagian: [
      function (m) { m.v.Z5 = 5; },
      function (m) { m.gosub(5040); },
      function (m) {
        m.v.J0 = Math.trunc(39 - 0.5 * m.v['G2$'].length);
        m.tab(m.v.J0); m.cetak(m.v['G2$']);
      }
    ] });
  T({ baris: 4370, bagian: [
      function (m) {
        m.barisBaru(); m.cetak(m.v['O1$']); m.barisBaru();
      },
      function (m) { m.lanjutkan('I'); },
      function (m) { m.barisBaru(); }
    ] });
  T({ baris: 4380, jalan: function (m) { m.lompat(1520); } });
  T(rem(4390));
  T({ baris: 4400, bagian: [
      function (m) { m.gosub(840); },
      function (m) {
        m.cetak('   Status Report:'); m.barisBaru();
        m.v['X$'] = '';
        if (m.v.K9 > 1) m.v['X$'] = 's';
      }
    ] });
  T({ baris: 4410, jalan: function (m) {
      m.cetak('Klingon' + m.v['X$'] + ' left: ' + bas(m.v.K9)); m.barisBaru();
    } });
  T({ baris: 4420, jalan: function (m) {
      m.cetak('Mission must be completed in' +
              bas(0.1 * Math.trunc((m.v.T0 + m.v.T9 - m.v.T) * 10)) +
              'stardates'); m.barisBaru();
    } });
  T({ baris: 4430, jalan: function (m) {
      m.v['X$'] = 's';
      if (m.v.B9 < 2) {
        m.v['X$'] = '';
        if (m.v.B9 < 1) m.lompat(4460);
      }
    } });
  T({ baris: 4440, jalan: function (m) {
      m.cetak('The federation is maintaining' + bas(m.v.B9) +
              'starbase' + m.v['X$'] + 'in the galaxy'); m.barisBaru();
    } });
  T({ baris: 4450, jalan: function (m) { m.lompat(3180); } });
  T(cet(4460, 'Your stupidity has left you on your own in'));
  T({ baris: 4470, jalan: function (m) {
      m.cetak('    the galaxy -- you have no starbases left!');
      m.barisBaru(); m.lompat(3180);
    } });
  T(rem(4480));
  T({ baris: 4490, bagian: [
      function (m) { m.gosub(840); },
      function (m) { if (m.v.K3 <= 0) m.lompat(2550); }
    ] });
  T({ baris: 4500, jalan: function (m) {
      m.v['X$'] = '';
      if (m.v.K3 > 1) m.v['X$'] = 's';
    } });
  T({ baris: 4510, jalan: function (m) {
      m.cetak('From ENTERPRISE to Klingon battle cruiser' + m.v['X$']);
      m.barisBaru();
    } });
  T({ baris: 4520, bagian: [
      function (m) { m.v.H8 = 0; m.untuk('I', 1, 3, 1, 4740); },
      function (m) { if (m.v['K()'][m.v.I][3] <= 0) m.lompat(4740); }
    ] });
  T({ baris: 4530, jalan: function (m) {
      m.v.W1 = m.v['K()'][m.v.I][1]; m.v.X = m.v['K()'][m.v.I][2];
    } });
  T({ baris: 4540, jalan: function (m) {
      m.v.C1 = m.v.S1; m.v.A = m.v.S2; m.lompat(4590);
    } });
  T({ baris: 4550, bagian: [
      function (m) { m.gosub(840); },
      function (m) {
        m.cetak('Direction/Distance Calculator:'); m.barisBaru();
      }
    ] });
  T({ baris: 4560, jalan: function (m) {
      m.cetak('You are at quadrant ' + bas(m.v.Q1) + ',' + bas(m.v.Q2) +
              ' sector ' + bas(m.v.S1) + ',' + bas(m.v.S2)); m.barisBaru();
    } });
  T({ baris: 4570, bagian: [
      function (m) { m.cetak('Please enter'); m.barisBaru(); },
      function (m) { m.masukan('C1', ' initial coordinates (x,y)? '); },
      function (m) { m.masukan('A', '? '); }
    ] });
  T({ baris: 4580, bagian: [
      function (m) { m.masukan('W1', ' Final coordinates (x,y)? '); },
      function (m) { m.masukan('X', '? '); }
    ] });
  T({ baris: 4590, jalan: function (m) {
      m.v.X = m.v.X - m.v.A; m.v.A = m.v.C1 - m.v.W1;
      if (m.v.X < 0) m.lompat(4670);
    } });
  T({ baris: 4600, jalan: function (m) { if (m.v.A < 0) m.lompat(4690); } });
  T({ baris: 4610, jalan: function (m) { if (m.v.X > 0) m.lompat(4630); } });
  T({ baris: 4620, jalan: function (m) {
      if (m.v.A === 0) { m.v.C1 = 5; m.lompat(4640); }
    } });
  T({ baris: 4630, jalan: function (m) { m.v.C1 = 1; } });
  T({ baris: 4640, jalan: function (m) {
      if (Math.abs(m.v.A) <= Math.abs(m.v.X)) m.lompat(4660);
    } });
  T({ baris: 4650, jalan: function (m) {
      var a = Math.abs(m.v.A), x = Math.abs(m.v.X);
      m.cetak('Direction =' + bas(m.v.C1 + ((a - x) + a) / a));
      m.barisBaru(); m.lompat(4730);
    } });
  T({ baris: 4660, jalan: function (m) {
      m.cetak('Direction =' + bas(m.v.C1 + Math.abs(m.v.A) / Math.abs(m.v.X)));
      m.barisBaru(); m.lompat(4730);
    } });
  T({ baris: 4670, jalan: function (m) {
      if (m.v.A > 0) { m.v.C1 = 3; m.lompat(4700); }
    } });
  T({ baris: 4680, jalan: function (m) {
      if (m.v.X !== 0) { m.v.C1 = 5; m.lompat(4640); }
    } });
  T({ baris: 4690, jalan: function (m) { m.v.C1 = 7; } });
  T({ baris: 4700, jalan: function (m) {
      if (Math.abs(m.v.A) >= Math.abs(m.v.X)) m.lompat(4720);
    } });
  T({ baris: 4710, jalan: function (m) {
      var a = Math.abs(m.v.A), x = Math.abs(m.v.X);
      m.cetak('Direction =' + bas(m.v.C1 + ((x - a) + x) / x));
      m.barisBaru(); m.lompat(4730);
    } });
  T({ baris: 4720, jalan: function (m) {
      m.cetak('Direction =');
      m.v.CC1 = m.v.C1 + Math.abs(m.v.X) / Math.abs(m.v.A);
      m.cetak(bas(m.v.CC1)); m.barisBaru();
    } });
  T({ baris: 4730, jalan: function (m) {
      m.cetak('Distance =' +
              bas(Math.sqrt(m.v.X * m.v.X + m.v.A * m.v.A))); m.barisBaru();
      if (m.v.H8 === 1) m.lompat(1520);
    } });
  T({ baris: 4740, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { m.lompat(1520); }
    ] });
  T({ baris: 4750, bagian: [
      function (m) { m.gosub(840); },
      function (m) {
        if (m.v.B3 !== 0) {
          m.cetak('From ENTERPRISE to Starbase:'); m.barisBaru();
          m.v.W1 = m.v.B4; m.v.X = m.v.B5;
        }
      }
    ] });
  /* 4760 melompat ke 4540 tanpa syarat — jadi kalau tidak ada pangkalan di
     kuadran ini, W1 dan X tetap nilai LAMA, dan baris 4770-4780 yang
     seharusnya memberitahukannya TIDAK PERNAH DICAPAI. */
  T({ baris: 4760, jalan: function (m) { m.lompat(4540); } });
  T({ baris: 4770, jalan: function (m) {
      m.cetak("Mr. Spock reports, 'Sensors show no starbases in this");
    } });
  T({ baris: 4780, jalan: function (m) {
      m.cetak("quadrant.'"); m.barisBaru(); m.lompat(1520);
    } });

  /* --- 4790-5010: petak kosong, sisip, banding ------------------------- */
  T(rem(4790));
  T({ baris: 4800, bagian: [
      function (m) {
        m.v.R1 = FNR(m); m.v.R2 = FNR(m);
        m.v['A$'] = '   '; m.v.Z1 = m.v.R1; m.v.Z2 = m.v.R2;
      },
      function (m) { m.gosub(4990); },
      function (m) { if (m.v.Z3 === 0) m.lompat(4800); }
    ] });
  T({ baris: 4810, jalan: function (m) { m.kembali(); } });
  T(rem(4820));
  /* 4830 RUMUS ALAMAT: tiga aksara per petak mendatar, dua puluh empat per
     baris. Inilah pengganti larik dua dimensinya. */
  T({ baris: 4830, jalan: function (m) {
      m.v.S8 = Math.trunc(m.v.Z2 - 0.5) * 3 +
               Math.trunc(m.v.Z1 - 0.5) * 24 + 1;
    } });
  T({ baris: 4840, jalan: function (m) {
      if (m.v['A$'].length !== 3) {
        m.cetak('ERROR'); m.barisBaru(); m.henti();
      }
    } });
  T({ baris: 4850, jalan: function (m) {
      if (m.v.S8 === 1) {
        m.v['Q$'] = m.v['A$'] + RIGHT(m.v['Q$'], 189); m.kembali();
      }
    } });
  T({ baris: 4860, jalan: function (m) {
      if (m.v.S8 === 190) {
        m.v['Q$'] = LEFT(m.v['Q$'], 189) + m.v['A$']; m.kembali();
      }
    } });
  T({ baris: 4870, jalan: function (m) {
      m.v['Q$'] = LEFT(m.v['Q$'], m.v.S8 - 1) + m.v['A$'] +
                  RIGHT(m.v['Q$'], 190 - m.v.S8);
      m.kembali();
    } });
  T(rem(4880));
  T({ baris: 4890, jalan: function (m) {
      var ke = [4900, 4910, 4920, 4930, 4940, 4950, 4960, 4970][m.v.R1 - 1];
      if (ke) m.lompat(ke);
    } });
  T(alat(4900, 'Warp Engines')); T(alat(4910, 'Short Range Sensors'));
  T(alat(4920, 'Long Range Sensors')); T(alat(4930, 'Phaser Control'));
  T(alat(4940, 'Photon Tubes')); T(alat(4950, 'Damage Control'));
  T(alat(4960, 'Shield Control')); T(alat(4970, 'Library-Computer'));
  T(rem(4980));
  T({ baris: 4990, jalan: function (m) {
      m.v.Z1 = Math.trunc(m.v.Z1 + 0.5);
      m.v.Z2 = Math.trunc(m.v.Z2 + 0.5);
      m.v.S8 = (m.v.Z2 - 1) * 3 + (m.v.Z1 - 1) * 24 + 1;
      m.v.Z3 = 0;
    } });
  T({ baris: 5000, jalan: function (m) {
      if (MID(m.v['Q$'], m.v.S8, 3) !== m.v['A$']) m.kembali();
    } });
  T({ baris: 5010, jalan: function (m) { m.v.Z3 = 1; m.kembali(); } });

  /* --- 5020-5280: nama kuadran ----------------------------------------- */
  T(rem(5020)); T(rem(5030));
  /* 5040 `IF Z5<+4` — tanda tambah nyasar di depan angkanya. GW-BASIC
     membacanya sebagai plus uner, jadi artinya tetap `< 4`. */
  T({ baris: 5040, jalan: function (m) {
      if (m.v.Z5 < 4) {
        var ke = [5060, 5070, 5080, 5090, 5100, 5110, 5120, 5130][m.v.Z4 - 1];
        if (ke) m.lompat(ke);
      }
    } });
  T({ baris: 5050, jalan: function (m) { m.lompat(5140); } });
  T(nama(5060, 'Antares')); T(nama(5070, 'Rigel')); T(nama(5080, 'Procyon'));
  T(nama(5090, 'Vega')); T(nama(5100, 'Canopus')); T(nama(5110, 'Altair'));
  T(nama(5120, 'Sagittarius')); T(nama(5130, 'Pollux'));
  /* 5140 SASARAN KELIMA DAN KEEMPAT SAMA-SAMA 5180. Akibatnya kuadran
     kolom 5 diberi nama "Betelgeuse", dan baris 5190 — "Aldebaran" —
     tidak pernah dijalankan sekali pun. Satu nama bintang yang hilang dari
     galaksinya sendiri. */
  T({ baris: 5140, jalan: function (m) {
      var ke = [5150, 5160, 5170, 5180, 5180, 5200, 5210, 5220][m.v.Z4 - 1];
      if (ke) m.lompat(ke);
    } });
  T(nama(5150, 'Sirius')); T(nama(5160, 'Deneb')); T(nama(5170, 'Capella'));
  T(nama(5180, 'Betelgeuse')); T(nama(5190, 'Aldebaran'));
  T(nama(5200, 'Regulus')); T(nama(5210, 'Arcturus'));
  T({ baris: 5220, jalan: function (m) { m.v['G2$'] = 'Spica'; } });
  T({ baris: 5230, jalan: function (m) {
      if (m.v.G5 !== 1) {
        var ke = [5250, 5260, 5270, 5280, 5250, 5260, 5270, 5280][m.v.Z5 - 1];
        if (ke) m.lompat(ke);
      }
    } });
  T({ baris: 5240, jalan: function (m) { m.kembali(); } });
  T(angka(5250, ' i')); T(angka(5260, ' ii'));
  T(angka(5270, ' iii')); T(angka(5280, ' iv'));

  /* --- 5290-5570: empat subrutin bunyi --------------------------------- */
  T(rem(5290));
  T({ baris: 5300, jalan: function (m) { m.untuk('J', 1, 4, 1, 5350); } });
  T({ baris: 5310, jalan: function (m) { m.untuk('K', 1000, 2000, 20, 5340); } });
  T({ baris: 5320, jalan: function () { } });
  T({ baris: 5330, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 5340, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 5350, jalan: function (m) { m.kembali(); } });
  T(rem(5360));
  T({ baris: 5370, jalan: function (m) { m.untuk('J', 1500, 100, -20, 5410); } });
  T({ baris: 5380, jalan: function () { } });
  T({ baris: 5390, jalan: function () { } });
  T({ baris: 5400, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 5410, jalan: function (m) { m.kembali(); } });
  T(rem(5420));
  T({ baris: 5430, jalan: function (m) { m.untuk('J', 1, 40, 1, 5470); } });
  T({ baris: 5440, jalan: function () { } });
  T({ baris: 5450, jalan: function () { } });
  T({ baris: 5460, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 5470, jalan: function (m) { m.kembali(); } });
  T(rem(5480));
  T({ baris: 5490, jalan: function (m) { m.untuk('SI', 1, 3, 1, 5570); } });
  T({ baris: 5500, jalan: function (m) { m.untuk('J', 800, 1500, 20, 5520); } });
  T({ baris: 5510, jalan: function () { } });
  T({ baris: 5520, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 5530, jalan: function (m) { m.untuk('K', 1500, 800, -20, 5550); } });
  T({ baris: 5540, jalan: function () { } });
  T({ baris: 5550, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 5560, jalan: function (m) { m.lanjutkan('SI'); } });
  T({ baris: 5570, jalan: function (m) { m.kembali(); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  /* --- pembantu -------------------------------------------------------- */
  function FNR(m) { return Math.trunc(m.acak() * 7.98 + 1.01); }
  function FND(m) {
    var K = m.v['K()'], i = m.v.I;
    return Math.sqrt(Math.pow(K[i][1] - m.v.S1, 2) +
                     Math.pow(K[i][2] - m.v.S2, 2));
  }
  function gambar(n, v) {
    return { baris: n, jalan: function (m) {
      m.cetak(m.v[v]); m.barisBaru();
    } };
  }
  function klingon(n, ambang, jml) {
    return { baris: n, jalan: function (m) {
      if (m.v.R1 > ambang) {
        m.v.K3 = jml; m.v.K9 = m.v.K9 + jml; m.lompat(1140);
      }
    } };
  }
  function tepi(n, uji, q, qn, s, sn) {
    return { baris: n, jalan: function (m) {
      if (uji(m)) { m.v.X5 = 1; m.v[q] = qn; m.v[s] = sn; }
    } };
  }
  function panel(n, label, isi) {
    return { baris: n, jalan: function (m) {
      m.cetak(label + isi(m)); m.barisBaru(); m.lompat(3970);
    } };
  }
  function alat(n, teks) {
    return { baris: n, jalan: function (m) {
      m.v['G2$'] = teks; m.kembali();
    } };
  }
  function angka(n, akhiran) {
    return { baris: n, jalan: function (m) {
      m.v['G2$'] = m.v['G2$'] + akhiran; m.kembali();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['STARTREK'] = {
    nama: 'STARTREK',
    judul: 'Star Trek (Dave Ahl; dipindahkan Bob Fritz, Oktober 1981)',
    sumber: 'STARTREK',
    berkas: 'run/STARTREK.BAS',
    tabel: tabel,
    benih: 103,

    arsitektur: {
      judul: 'Alur STARTREK.BAS',
      simpul: [
        { id: 'judul', baris: '500-830', jenis: 'mulai',
          teks: ['Gambar Enterprise,', 'lalu pasang tombol fungsi'] },
        { id: 'galaksi', baris: '1100-1190',
          teks: ['64 kuadran, satu angka', 'per kuadran'] },
        { id: 'kuadran', baris: '1280-1510',
          teks: ['Bongkar angkanya,', 'bangun string 192 aksara'] },
        { id: 'perintah', baris: '1520-1610', jenis: 'putusan',
          teks: ['Sembilan perintah,', 'dicocokkan dari satu string'] },
        { id: 'nav', baris: '1720-2420',
          teks: ['Arah pecahan diinterpolasi;', 'Klingon ikut pindah'] },
        { id: 'tembak', baris: '2530-3070',
          teks: ['Fáser dibagi rata;', 'torpedo menyusuri petak'] },
        { id: 'string', baris: '4830-5010', jenis: 'subrutin',
          teks: ['Sisip dan banding tiga aksara', 'di dalam Q$'] },
        { id: 'balas', baris: '3350-3460',
          teks: ['Klingon menembak, dan', 'tenaganya ikut susut'] },
        { id: 'akhir', baris: '3480-3700', jenis: 'keluar',
          teks: ['Nilai efisiensi =', '(Klingon/hari) dikuadratkan'] }
      ],
      panah: [
        { dari: 'judul', ke: 'galaksi' },
        { dari: 'galaksi', ke: 'kuadran' },
        { dari: 'kuadran', ke: 'perintah' },
        { dari: 'perintah', ke: 'nav', label: 'NAV' },
        { dari: 'perintah', ke: 'tembak', label: 'PHA / TOR' },
        { dari: 'nav', ke: 'string' },
        { dari: 'tembak', ke: 'string' },
        { dari: 'string', ke: 'balas' },
        { dari: 'balas', ke: 'perintah' },
        { dari: 'nav', ke: 'kuadran', label: 'ganti kuadran' },
        { dari: 'balas', ke: 'akhir', label: 'perisai habis', jenis: 'galat' },
        { dari: 'tembak', ke: 'akhir', label: 'Klingon habis' }
      ]
    },

    pseudokode: [
      { baris: 1410, tingkat: 0, teks: '<code>Q$</code> = <b>192 aksara</b> &mdash; 8&times;8 petak, tiga aksara tiap petak' },
      { baris: 4830, tingkat: 1, teks: '<code>S8 = (kolom-1)*3 + (baris-1)*24 + 1</code> &mdash; pengganti larik dua dimensi' },
      { baris: 4870, tingkat: 1, teks: 'menaruh sesuatu = <b>memotong dan menyambung</b> stringnya' },
      { baris: 5000, tingkat: 1, teks: 'memeriksa isinya = membandingkan <b>tiga aksara</b>' },
      { baris: 1150, tingkat: 0, teks: 'galaksi = 64 angka: <b>ratusan Klingon, puluhan pangkalan, satuan bintang</b>' },
      { baris: 2080, tingkat: 0, teks: 'arah pecahan <b>diinterpolasi</b> antara dua arah kompas' },
      { baris: 990, tingkat: 0, teks: '<code>DEF FND(D)</code> &mdash; parameternya <b>tidak pernah dipakai</b>; ia makro atas <code>I</code>' },
      { baris: 3380, tingkat: 0, teks: 'Klingon <b>melemah setiap kali menembak</b>: <code>K(I,3)/(3+RND(0))</code>' },
      { baris: 3140, tingkat: 0, teks: 'kutip penutup hilang &rarr; <code>:goto 1990</code> jadi <b>isi string</b>, bukan perintah' },
      { baris: 5140, tingkat: 0, teks: 'sasaran ke-4 dan ke-5 sama &rarr; <b>"Aldebaran" tidak pernah dipakai</b>' },
      { baris: 3700, tingkat: 0, teks: 'nilai akhir = <code>1000&times;(Klingon/hari)&sup2;</code> &mdash; kecepatan dikuadratkan' }
    ],

    perintahAsli: 'run\\STARTREK.bat',
    catatanAsli: 'Ketik NAV, SRS, LRS, PHA, TOR, SHI, DAM, COM, atau RES. ' +
      'Di mesin aslinya F1 sampai F9 mengetikkan kesembilan perintah itu ' +
      'lengkap dengan Enter.',

    penyimpangan: [
      '<b><code>SOUND</code> diam.</b> Keempat subrutin bunyi (5290-5570) ' +
      'tetap ditelusuri &mdash; siaga merah, torpedo, fáser, dan alarm.',

      '<b><code>KEY n,"..."</code> tidak ditiru.</b> Perintah itu memprogram ' +
      'tombol fungsi supaya <b>mengetik</b> nama perintah lengkap dengan ' +
      'Enter. Di penelusur, ketik perintahnya langsung.',

      '<b><code>RANDOMIZE</code> memasang benih tetap.</b>',

      '<b><code>INP(1)</code> di baris 1260 tidak ditiru.</b> Ia membaca ' +
      'gerbang I/O nomor satu &mdash; di IBM PC itu bagian pengendali DMA, ' +
      'bukan papan tombol. Lihat catatan cacat.',

      '<b><code>DEF FND</code> dan <code>DEF FNR</code> ditulis sebagai ' +
      'fungsi JavaScript</b>; barisnya (990 dan 1000) tetap ada di tabel.',

      '<b><code>LOAD "MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code>.</b>',

      '<b>Baris 620 sudah disunting pemilik koleksi</b> (nomor telepon ' +
      'penulis pemindahannya).'
    ],

    pelajaran: {
      ringkas: 'Peta kuadran disimpan sebagai string 192 aksara dan seluruh ' +
        'galaksi sebagai 64 angka yang dikemas &mdash; dua cara menghemat ' +
        'memori yang keduanya menjadikan gambar layar sebagai datanya sendiri.',
      pelajari: [
        ['Peta yang gambarnya sekaligus datanya',
         'Kuadran 8&times;8 disimpan sebagai <b>satu string 192 aksara</b>, ' +
         'tiga aksara per petak. Dan ketiga aksara itu adalah <b>gambar yang ' +
         'muncul di layar</b>: Enterprise <code>CHR$(204)+CHR$(144)+CHR$(185)</code>, ' +
         'Klingon <code>"+"+CHR$(2)+"+"</code>, pangkalan ' +
         '<code>CHR$(174)+CHR$(127)+CHR$(175)</code>.',
         'Memeriksa apakah sebuah petak berisi Klingon berarti ' +
         '<b>membandingkan gambarnya</b> (baris 5000). Menghapus sesuatu ' +
         'berarti menulis tiga spasi. Pemindai jarak dekat (3840-3860) tidak ' +
         'menerjemahkan apa pun &mdash; ia mencetak stringnya langsung.',
         'Satu struktur untuk dua keperluan, dan tidak ada langkah ' +
         'penerjemahan di antaranya.'],
        ['Alamat sebagai rumus, bukan larik',
         '<code>S8 = (Z2-1)*3 + (Z1-1)*24 + 1</code>. Tiga aksara per petak ' +
         'mendatar, dua puluh empat per baris. Itu persis perhitungan yang ' +
         'dilakukan penafsir untuk larik dua dimensi &mdash; ditulis tangan, ' +
         'sekali, dan dipakai di lima tempat.',
         'Untungnya nyata di mesin 1970-an: sebuah string 192 bita memakan ' +
         '192 bita. Larik <code>A$(8,8)</code> memakan 64 penunjuk ditambah ' +
         'isinya.'],
        ['Tiga angka dalam satu bilangan',
         '<code>G(I,J) = K3*100 + B3*10 + bintang</code>. Ratusan menghitung ' +
         'Klingon, puluhan pangkalan, satuan bintang. Membongkarnya cuma dua ' +
         'baris (1340-1350).',
         'Dan pemindai jarak jauh menampilkannya <b>tanpa membongkar sama ' +
         'sekali</b> (baris 2500): angka tiga digit itu sendiri yang dicetak, ' +
         'dan kaptennya membacanya sebagai "2 Klingon, 1 pangkalan, 5 ' +
         'bintang". Penyandiannya jadi antarmukanya.'],
        ['Arah pecahan yang diinterpolasi',
         'Sembilan arah kompas disimpan sebagai pasangan langkah di ' +
         '<code>C(9,2)</code>, dan arah ke-9 sengaja sama dengan arah ke-1. ' +
         'Baris 2080 memakai itu:',
         '<code>X1 = C(C1,1) + (C(C1+1,1)-C(C1,1)) * (C1-INT(C1))</code>',
         'Arah 2,5 berarti tepat setengah jalan antara arah 2 dan 3. Delapan ' +
         'arah jadi tak terhingga banyaknya, dengan satu interpolasi lurus ' +
         '&mdash; dan entri ke-9 yang mengulang entri ke-1 itulah yang membuat ' +
         'arah 8,5 tidak keluar dari lariknya.'],
        ['Musuh yang melemah karena menembak',
         'Baris 3380: <code>K(I,3) = K(I,3)/(3+RND(0))</code>. Setiap kali ' +
         'sebuah Klingon menembak, kekuatannya sendiri dibagi tiga atau empat.',
         'Jadi pertempuran panjang otomatis menguntungkan pemain, tanpa satu ' +
         'baris pun yang mengurus "keseimbangan". Aturannya ada di dalam ' +
         'aksinya.'],
        ['Meminjam tombol fungsi, lalu mengembalikannya',
         'Baris 850-940 memprogram F1 sampai F9 jadi makro perintah lengkap ' +
         'dengan Enter. Baris 4010-4070 <b>memprogramnya ulang</b> untuk ' +
         'submenu komputer. Dan baris 3570-3660 mengembalikan kesepuluh ' +
         'tombol ke bawaan BASIC &mdash; LIST, RUN, LOAD" &mdash; sebelum ' +
         'keluar ke menu.',
         'Program yang tahu bahwa ia sedang meminjam sesuatu milik bersama.']
      ],
      hindari: [
        ['Kutip penutup yang hilang, dan permintaan yang tetap dikabulkan',
         'Baris 3140 di sumbernya berbunyi:',
         '<code>3140 PRINT"&lt;shields unchanged&gt;:goto 1990</code>',
         'Kutip penutupnya tidak ada, jadi <code>:goto 1990</code> ikut jadi ' +
         '<b>isi string</b>. Lompatannya tidak pernah terjadi.',
         'Akibatnya: baris 3130 mencetak <i>"This is not the federation ' +
         'treasury"</i>, baris 3140 mencetak teks yang aneh, lalu alirannya ' +
         '<b>jatuh ke baris 3150</b> &mdash; yang menyetel perisainya juga.',
         'Terukur di penelusur: dengan tenaga awal 3.000 dan perisai 0, ' +
         'meminta <b>99.999</b> unit perisai melewati jalur ' +
         '3100&rarr;3110&rarr;3120&rarr;3130&rarr;3140&rarr;3150&rarr;3160 ' +
         'dan berakhir dengan <code>S=99999</code> serta ' +
         '<code>E=&minus;96999</code>.',
         'Penolakannya dicetak, lalu diabaikan.'],
        ['Satu nama bintang yang hilang dari galaksinya',
         'Baris 5140: <code>ON Z4 GOTO 5150,5160,5170,5180,5180,5200,5210,5220</code>. ' +
         'Sasaran keempat dan kelima <b>sama-sama 5180</b>.',
         'Jadi kuadran kolom lima diberi nama "Betelgeuse", sama seperti ' +
         'kolom empat &mdash; dan baris 5190, "Aldebaran", tidak pernah ' +
         'dijalankan sekali pun.',
         'Terukur di penelusur: menyapu seluruh 64 kuadran menghasilkan ' +
         '<b>lima belas</b> nama berbeda, bukan enam belas. Sebuah nama ' +
         'bintang yang ada di sumbernya, ditulis dengan rapi, dan tidak ' +
         'pernah muncul di layar siapa pun.'],
        ['Jeda yang membaca gerbang yang salah',
         'Baris 1260: <code>I=RND(1):IF INP(1)=13 THEN 1260</code>. ' +
         '<code>INP(1)</code> membaca gerbang I/O nomor satu &mdash; di IBM PC ' +
         'itu bagian pengendali DMA, bukan papan tombol.',
         'Yang lebih menarik: baris 1250 di atasnya berbunyi ' +
         '<code>PRINT:PRINT \' "hit any key except return when ready"</code> ' +
         '&mdash; <b>ajakannya sendiri sudah dikomentari</b>. Penulis ' +
         'pemindahannya tahu jedanya tidak bekerja di PC, membuang ' +
         'tulisannya, dan meninggalkan gelungnya berjalan tanpa guna.'],
        ['Fungsi yang parameternya tidak pernah dipakai',
         '<code>DEF FND(D)=SQR((K(I,1)-S1)^2+(K(I,2)-S2)^2)</code>. Yang ' +
         'dibaca adalah <code>I</code>, <code>S1</code>, dan <code>S2</code> ' +
         '&mdash; semuanya variabel bersama. <code>D</code> tidak muncul di ' +
         'ruas kanan sama sekali.',
         'Ia dipanggil <code>FND(0)</code> di baris 2640 dan ' +
         '<code>FND(1)</code> di baris 3380, dan kedua panggilan itu ' +
         'menghitung hal yang persis sama. Sebuah "fungsi" yang sebenarnya ' +
         'makro, dan pemanggilnya diam-diam menyandarkan diri pada nilai ' +
         '<code>I</code> yang sedang berlaku.'],
        ['Pesan yang tidak bisa dicapai',
         'Baris 4750 memeriksa <code>IF B3&lt;&gt;0</code> sebelum menyiapkan ' +
         'koordinat pangkalan &mdash; tapi baris 4760 melompat ke 4540 ' +
         '<b>tanpa syarat</b>. Baris 4770-4780, yang berbunyi <i>"Sensors ' +
         'show no starbases in this quadrant"</i>, tidak pernah dicapai.',
         'Kalau tidak ada pangkalan di kuadran itu, kalkulatornya diam-diam ' +
         'memakai koordinat lama dari perhitungan sebelumnya.'],
        ['Kutip yang tersesat di tengah kalimat',
         'Baris 2580: <code>PRINT"Phasers locked on target;  :;</code>. ' +
         'Yang tercetak di layar termasuk <code>:;</code> di ujungnya. Salah ' +
         'ketik yang tidak menghentikan apa pun, dan karena itu bertahan.'],
        ['Fitur pencetak yang dicabut tanpa dihapus',
         'Baris 4230-4240 berisi tawaran mencetak peta ke kertas, lengkap ' +
         'dengan <code>POKE 1229,2:POKE 1237,3:NULL 1</code> &mdash; semuanya ' +
         'dikomentari dengan petik tunggal. Begitu juga bagian pemulihnya di ' +
         'baris 4370.',
         'Tiga baris yang menyimpan cara sebuah program BASIC 1981 berbicara ' +
         'dengan pencetak, disimpan sebagai komentar, dan tidak pernah ' +
         'dinyalakan lagi.']
      ]
    },

    penjelasan: [
      { judul: 'Delapan kali delapan, dalam satu string',
        isi: [
          'Kuadran tempat Enterprise berada adalah petak 8&times;8. Cara yang ' +
          'wajar menyimpannya hari ini: larik dua dimensi.',
          'Program ini menyimpannya sebagai <b>satu string</b>:',
          '<code>1410 Q$=Z$+Z$+Z$+Z$+Z$+Z$+Z$+LEFT$(Z$,17)</code>',
          '<code>Z$</code> adalah dua puluh lima spasi. Tujuh kali dua puluh ' +
          'lima ditambah tujuh belas sama dengan <b>192</b> &mdash; enam puluh ' +
          'empat petak, tiga aksara masing-masing.',
          'Alamatnya dihitung dengan rumus:',
          '<code>4830 S8=INT(Z2-0.5)*3+INT(Z1-0.5)*24+1</code>',
          'Tiga aksara ke kanan per petak, dua puluh empat ke bawah per baris. ' +
          'Itu persis perhitungan yang biasanya dikerjakan penafsir di balik ' +
          'layar untuk sebuah larik &mdash; di sini ditulis tangan.',
          'Menaruh sesuatu berarti membelah stringnya:',
          '<code>4870 Q$=LEFT$(Q$,S8-1)+A$+RIGHT$(Q$,190-S8)</code>',
          'Dan memeriksa isinya berarti membandingkan tiga aksara:',
          '<code>5000 IF MID$(Q$,S8,3)&lt;&gt;A$ THEN RETURN</code>',
          'Yang membuat rancangan ini lebih dari sekadar hemat: <b>ketiga ' +
          'aksara itu adalah gambarnya</b>. Enterprise disimpan sebagai ' +
          'gambar Enterprise. Klingon sebagai gambar Klingon. Pemindai jarak ' +
          'dekat di baris 3840-3860 tidak menerjemahkan apa-apa &mdash; ia ' +
          'memotong stringnya jadi delapan baris dan mencetaknya.',
          'Tidak ada tabel yang memetakan "isi petak" ke "aksara di layar", ' +
          'karena keduanya benda yang sama.',
          'Satu-satunya tempat keduanya berbeda ada di baris 3850: petak ' +
          'kosong yang di dalam string berupa tiga spasi <b>ditampilkan</b> ' +
          'sebagai titik tengah <code>CHR$(250)</code>. Satu pengecualian, ' +
          'satu baris, dan sisanya identik.',
          'Harganya juga jelas. Sebuah petak tidak bisa menyimpan apa pun yang ' +
          'tidak punya gambar &mdash; tidak ada tempat untuk "Klingon dengan ' +
          'kekuatan 137", jadi kekuatannya harus disimpan terpisah di ' +
          '<code>K(3,3)</code>, dan kedua struktur itu harus dijaga tetap ' +
          'sejalan dengan tangan. Baris 2710 dan 2720 melakukan itu: hapus ' +
          'dari string, nolkan di larik, kurangi angka galaksinya. Tiga ' +
          'tempat, satu peristiwa.'
        ] },
      { judul: 'Sepuluh tahun antara dua mesin',
        isi: [
          'Star Trek yang asli ditulis Mike Mayfield sekitar 1971 dan ' +
          'menyebar lewat "BASIC Computer Games" karya David Ahl &mdash; buku ' +
          'permainan komputer pertama yang terjual sejuta eksemplar. Program ' +
          'itu lahir di mesin yang memorinya diukur kilobita.',
          'Berkas ini pemindahannya ke IBM PC pada Oktober&ndash;November 1981, ' +
          'dua bulan sesudah PC-nya sendiri dijual. Dan bekas dua zaman itu ' +
          'terlihat berdampingan.',
          'Yang <b>lama</b>: kuadran sebagai string, galaksi sebagai angka ' +
          'terkemas, <code>DEF FND</code> yang membaca variabel bersama. ' +
          'Semuanya cara berpikir orang yang menghitung bita.',
          'Yang <b>baru</b>: <code>COLOR 16,7</code> untuk teks berkedip, ' +
          '<code>SOUND</code> untuk siaga merah, dan sembilan perintah yang ' +
          'dipasang di tombol fungsi &mdash; ketiganya hal yang tidak ada di ' +
          'mesin asalnya.',
          'Dan bekas yang paling jelas ada di baris 1260:',
          '<code>1260 I=RND(1):IF INP(1)=13 THEN 1260</code>',
          '<code>INP(1)</code> membaca gerbang perangkat keras nomor satu. Di ' +
          'mesin tempat baris ini ditulis, itu mungkin papan tombolnya. Di IBM ' +
          'PC, itu pengendali DMA.',
          'Yang menarik: baris 1250 di atasnya sudah <b>dikomentari</b>. ' +
          'Tulisan <i>"hit any key except return when ready to accept ' +
          'command"</i> masih ada di sumbernya, dimatikan dengan satu petik ' +
          'tunggal.',
          'Jadi Bob Fritz tahu. Ia menemukan bahwa jedanya tidak bekerja, ' +
          'membuang ajakannya supaya pemain tidak menunggu sia-sia, dan ' +
          'meninggalkan gelungnya berjalan &mdash; karena mencabutnya berarti ' +
          'menyentuh sesuatu yang tidak ia tulis, dan yang tidak mengganggu ' +
          'siapa pun.',
          'Itu keputusan yang dikenali siapa pun yang pernah memindahkan kode ' +
          'orang lain.'
        ] }
    ]
  };
})(window);
