/* ===========================================================================
   MAXIT1.js — porting minimalis MAXIT1.BAS sebagai tabel baris.

       1000 '   MAXIT  FROM PET
       1010 '   ADAPTED TO IPM PC BY PATRICK LEABO
       1020 '   3-20-82              TUCSON ARIZONA

   Papan 8x8 berisi angka -9 sampai 15. Pemain pertama bergerak MENDATAR,
   pemain kedua MENEGAK, dan tiap langkah mengambil angka di petak tujuan.
   Petak yang ditinggalkan hilang selamanya. Yang mengumpulkan angka terbesar
   menang.

   Berkas ini menyimpan JEJAK ASAL-USULNYA di tiga tempat, dan ketiganya
   tertinggal karena tidak pernah dijalankan:

       1000  '   MAXIT  FROM PET
       2350  PLOT 8:END              <- `PLOT` bukan perintah GW-BASIC
       2360  REM  OTHER OTHELLO BOARD

   `PLOT` adalah perintah Commodore PET. Ia ada di baris 2350, tepat sesudah
   `RETURN` di baris 2340 — jadi tidak pernah tercapai, tidak pernah menimbulkan
   galat, dan tidak pernah terhapus. Fosil.

   DAN SATU HURUF MEMATIKAN OTAK KOMPUTERNYA.

       2080 IF A2<>C2 THEN PK=BD(A1,A2):IF PK<>-100 AND PK>MX THEN MX=PK:SV=A

   `SV=A` — seharusnya `SV=A2`. `A` tidak pernah diberi nilai di mana pun,
   jadi `SV` selalu NOL. Baris 2130 lalu memakainya untuk melihat ke depan:
   `PQ=BD(A2,SV)` — dan selalu melihat kolom nol, bukan kolom terbaik yang
   barusan ditemukan. Seluruh telaah dua langkah komputer memeriksa kolom yang
   salah.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom.
   - `PLAY` dan `BEEP` diam. Tiga tempat memakai penyisipan variabel ke dalam
     string makronya (`N=NT(NT);`, `N=N;`) — bahasa di dalam bahasa.
   - Gelung tunda `FOR DL=1 TO 1500` (jeda "berpikir" komputer) habis
     seketika.
   - `RANDOMIZE VAL(RIGHT$(TIME$,2))` memasang benih tetap.
   - `RUN "b:???0??"` di baris 1505 tidak bisa dijalankan; lihat catatan.
   =========================================================================== */

(function (global) {
  'use strict';

  var PETA = { '╒': 213, '═': 205, '╤': 209, '╕': 184, '│': 179,
               '╞': 198, '╪': 216, '╡': 181, '╘': 212, '╧': 207, '╛': 190 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  function str(n) { return (n < 0 ? '-' : ' ') + Math.abs(n); }
  function basic(n) { return str(n) + ' '; }

  var tabel = [

    rem(1000), rem(1010), rem(1020), rem(1030),
    { baris: 1090, jalan: function (m) { m.warna(5, 8); } },
    /* 1100 `DEFINT A-Z` — SEMUA variabel bulat. Dan delapan angka DATA di
       baris yang sama: nada untuk bunyi pembagian kartu. */
    { baris: 1100, jalan: function () { } },
    { baris: 1110, jalan: function (m) { m.semaiCampur(7); } },
    { baris: 1120, jalan: function (m) {
        m.dim('NT()', 7);
        for (m.v.N = 0; m.v.N <= 7; m.v.N++) m.v['NT()'][m.v.N] = m.baca();
      } },
    { baris: 1140, jalan: function (m) { m.dim('BD()', 7, 7); m.dim('AV()', 64); } },
    { baris: 1150, jalan: function (m) {
        m.cls(); m.locate(3, 10); m.warna(3, 4);
        m.cetak(' THE GAME OF MAXIT '); m.barisBaru();
        m.warna(5, 8);
      } },
    { baris: 1160, bagian: [
        function (m) { m.cetak('Do you want instructions ? '); },
        function (m) {
          m.v['KS$'] = m.inkey();
          if (m.v['KS$'] === '') m.tunggu();
        },
        function (m) { m.barisBaru(); }
      ] },
    { baris: 1170, jalan: function (m) {
        if (m.v['KS$'] === 'Y' || m.v['KS$'] === 'y') m.gosub(2210);
      } },
    { baris: 1180, bagian: [
        function (m) { m.barisBaru(); m.cetak('1 or 2 players ?'); },
        function (m) {
          m.v['KS$'] = m.inkey();
          if (m.v['KS$'] === '') m.tunggu();
        }
      ] },
    { baris: 1190, jalan: function (m) {
        m.cetak(m.v['KS$']); m.barisBaru();
        m.v.NP = parseInt(m.v['KS$'], 10) || 0;
        m.barisBaru();
      } },
    { baris: 1200, jalan: function (m) { if (m.v.NP === 1) m.lompat(1240); } },
    { baris: 1210, jalan: function (m) { if (m.v.NP !== 2) m.lompat(1180); } },
    { baris: 1220, bagian: [
        function (m) { m.masukan('P1$', 'What is your name #1? '); },
        function (m) {
          m.v['P1$'] = m.v['P1$'].slice(0, 7); m.bunyi(); m.barisBaru();
        }
      ] },
    { baris: 1230, bagian: [
        function (m) { m.barisBaru(); },
        function (m) { m.masukan('P2$', 'What is your name #2? '); },
        function (m) {
          m.v['P2$'] = m.v['P2$'].slice(0, 7); m.bunyi(); m.barisBaru();
          m.lompat(1250);
        }
      ] },
    { baris: 1240, bagian: [
        function (m) { m.v['P2$'] = 'IBM PC'; },
        function (m) { m.masukan('P1$', 'What is your name ? '); },
        function (m) {
          m.bunyi(); m.barisBaru();
          m.v['P1$'] = m.v['P1$'].slice(0, 7);
        }
      ] },
    { baris: 1250, bagian: [
        function (m) {
          m.cls(); m.locate(2, 15); m.warna(3, 4);
          m.cetak(' M A X I T '); m.barisBaru(); m.warna(5, 8);
        },
        function (m) { m.gosub(2360); }
      ] },
    { baris: 1260, jalan: function (m) { m.semaiCampur(11); m.v.MD = 1; } },

    /* --- 1270-1340: MEMBAGIKAN 64 ANGKA KE 64 PETAK ----------------------- *
       Larik AV berisi petak yang MASIH TERSEDIA. Tiap putaran mengambil satu
       secara acak, lalu MENGGESER sisanya menutupi lubangnya. Pengambilan
       tanpa pengembalian, ditulis dengan penggeseran alih-alih penukaran.    */
    { baris: 1270, jalan: function (m) {
        for (m.v.K = 1; m.v.K <= 64; m.v.K++) m.v['AV()'][m.v.K] = m.v.K;
      } },
    { baris: 1280, bagian: [
        function (m) { m.untuk('K', 64, 1, -1, 1350); },
        function (m) { m.v.PC = m.baca(); }
      ] },
    { baris: 1290, jalan: function (m) {
        m.v.P1 = 1 + Math.trunc(m.v.K * m.acak());
      } },
    { baris: 1300, jalan: function (m) { m.v.J = m.v['AV()'][m.v.P1] - 1; } },
    { baris: 1310, jalan: function (m) {
        if (m.v.P1 < m.v.K) {
          for (m.v.I = m.v.P1; m.v.I <= m.v.K - 1; m.v.I++) {
            m.v['AV()'][m.v.I] = m.v['AV()'][m.v.I + 1];
          }
        }
      } },
    /* 1320 nomor petak 0..63 dipecah jadi baris dan kolom dengan bagi-delapan
       dan sisanya. Kisi dua dimensi disimpan sebagai satu urutan. */
    { baris: 1320, jalan: function (m) {
        m.v.I = Math.trunc(m.v.J / 8);
        m.v.J = m.v.J - 8 * m.v.I;
      } },
    { baris: 1330, bagian: [
        function (m) { m.v['BD()'][m.v.I][m.v.J] = m.v.PC; },
        function (m) { m.gosub(1540); },
        function (m) { m.v.NT = m.v.J; },
        function (m) { m.gosub(1980); }
      ] },
    /* 1340 `RESTORE 1350` mengembalikan penunjuk DATA ke awal angka papan —
       dan itu WAJIB, karena baris 1490 boleh mengulang permainan dan baris
       1280 akan membaca keenam puluh empat angka itu lagi. */
    { baris: 1340, bagian: [
        function (m) { m.lanjutkan('K'); },
        function (m) { m.ulangData(8); m.v.NT = 7; },
        function (m) { m.gosub(1980); },
        function (m) { m.gosub(1980); },
        function (m) { m.gosub(1980); }
      ] },
    rem(1350), rem(1360), rem(1370), rem(1380), rem(1390), rem(1400), rem(1410),

    /* --- 1420-1530: giliran dan akhir ------------------------------------- */
    { baris: 1420, bagian: [
        function (m) { m.v.S1 = 0; m.v.S2 = 0; },
        function (m) { m.gosub(2000); }
      ] },
    rem(1430),
    { baris: 1440, bagian: [
        function (m) { m.v.PL = 1; },
        function (m) { m.gosub(1630); },
        function (m) { if (m.v.FL === 0) m.lompat(1470); }
      ] },
    rem(1450),
    { baris: 1460, bagian: [
        function (m) { m.v.PL = 2; },
        function (m) { m.gosub(1630); },
        function (m) { if (m.v.FL !== 0) m.lompat(1430); }
      ] },
    /* 1470 `ON 2+SGN(S2-S1) GOSUB ...` — tiga cabang dari satu tanda. */
    { baris: 1470, bagian: [
        function (m) {
          m.locate(22, 1); m.cetak(m.ulang(39, 32));
          m.locate(22, 1);
        },
        function (m) {
          var d = m.v.S2 - m.v.S1;
          var sgn = d > 0 ? 1 : (d < 0 ? -1 : 0);
          m.gosub([1510, 1520, 1530][2 + sgn - 1]);
        }
      ] },
    { baris: 1480, bagian: [
        function (m) {
          m.kosongkanPenyangga();
          m.locate(23, 1); m.cetak(m.ulang(39, 32));
          m.locate(23, 1); m.cetak('Do you want to play again ?');
          m.v['C$'] = '';
        },
        function (m) {
          m.v['C$'] = m.inkey();
          if (m.v['C$'] === '') m.tunggu();
        },
        function (m) { m.cetak(m.v['C$']); m.barisBaru(); }
      ] },
    { baris: 1490, jalan: function (m) {
        if (m.v['C$'] === 'Y' || m.v['C$'] === 'y') m.lompat(1250);
      } },
    { baris: 1500, jalan: function (m) { m.cls(); } },
    /* 1505 `RUN "b:???0??"` — nama berkas berisi tanda tanya. `RUN` tidak
       menerima pola nama; di GW-BASIC ini galat "Bad file name". Jadi
       menjawab "tidak" pada tawaran main lagi TIDAK kembali ke mana-mana —
       ia menabrak galat. Lihat catatan. */
    { baris: 1505, jalan: function (m) {
        m.galat(64, 'Bad file name: b:???0??');
      } },
    { baris: 1510, jalan: function (m) {
        m.cetak(m.v['P1$'] + ' won by ' + str(m.v.S1 - m.v.S2) + ' POINTS');
        m.barisBaru(); m.barisBaru(); m.kembali();
      } },
    { baris: 1520, jalan: function (m) {
        m.cetak("It's a tie !!                   ");
        m.barisBaru(); m.kembali();
      } },
    { baris: 1530, jalan: function (m) {
        m.cetak(m.v['P2$'] + ' won by ' + str(m.v.S2 - m.v.S1) + ' POINTS ');
        m.barisBaru(); m.barisBaru(); m.kembali();
      } },

    /* --- 1540-1620: gambar satu petak ------------------------------------- */
    rem(1540),
    { baris: 1550, jalan: function (m) { m.v.PC = m.v['BD()'][m.v.I][m.v.J]; } },
    { baris: 1560, jalan: function (m) {
        m.locate(m.v.I * 2 + 5, m.v.J * 4 + 5);
      } },
    { baris: 1570, jalan: function (m) {
        if (m.v.MD === 2) { m.warna(3, 4); m.lompat(1590); }
      } },
    { baris: 1580, jalan: function (m) { m.warna(7, 0); } },
    /* 1590 nilai 100 adalah PENANDA, bukan angka: di situlah pemain berada,
       dan letaknya disimpan di C1,C2. */
    { baris: 1590, jalan: function (m) {
        if (m.v.PC === 100) {
          m.cetak('**'); m.barisBaru();
          m.v.C1 = m.v.I; m.v.C2 = m.v.J;
          m.lompat(1620);
        }
      } },
    /* 1600 nilai -100 berarti petak sudah diambil dan kosong selamanya. */
    { baris: 1600, jalan: function (m) {
        if (m.v.PC === -100) { m.cetak('  '); m.barisBaru(); m.lompat(1620); }
      } },
    { baris: 1610, jalan: function (m) {
        m.cetak(('  ' + str(m.v.PC)).slice(-2)); m.barisBaru();
      } },
    { baris: 1620, jalan: function (m) { m.warna(5, 8); m.kembali(); } },

    /* --- 1630-1690: giliran siapa, dan apakah masih ada langkah ------------ *
       Pemain 1 hanya boleh bergerak di BARIS penanda, pemain 2 hanya di
       KOLOM-nya. Jumlah seluruh nilai di jalur itu ditambah 600 dipakai
       sebagai uji "masih ada yang bisa diambil": kalau semuanya sudah -100,
       jumlahnya tepat nol.                                                   */
    { baris: 1630, jalan: function (m) { if (m.v.PL === 2) m.lompat(1670); } },
    { baris: 1640, jalan: function (m) {
        m.v.FL = 600;
        for (m.v.J = 0; m.v.J <= 7; m.v.J++) {
          m.v.FL = m.v.FL + m.v['BD()'][m.v.C1][m.v.J];
        }
      } },
    { baris: 1650, jalan: function (m) { if (m.v.FL === 0) m.kembali(); } },
    { baris: 1660, bagian: [
        function (m) {
          m.v['NM$'] = m.v['P1$']; m.v.DX = 1; m.v.DY = 0;
        },
        function (m) { m.gosub(1700); },
        function (m) { m.kembali(); }
      ] },
    { baris: 1670, jalan: function (m) {
        m.v.FL = 600;
        for (m.v.I = 0; m.v.I <= 7; m.v.I++) {
          m.v.FL = m.v.FL + m.v['BD()'][m.v.I][m.v.C2];
        }
      } },
    { baris: 1680, jalan: function (m) { if (m.v.FL === 0) m.kembali(); } },
    { baris: 1690, bagian: [
        function (m) {
          m.v['NM$'] = m.v['P2$']; m.v.DX = 0; m.v.DY = 1;
        },
        function (m) { m.gosub(1700); },
        function (m) { m.kembali(); }
      ] },

    /* --- 1700-1870: memilih petak dengan spasi dan Enter ------------------ */
    { baris: 1700, jalan: function (m) {
        m.v.Y = m.v.C1; m.v.X = m.v.C2; m.v.FX = 1;
      } },
    { baris: 1705, jalan: function (m) { if (m.v.PL === 2) m.warna(3, 4); } },
    { baris: 1710, jalan: function (m) {
        if (m.v.NP === 2 || m.v.PL === 1) m.lompat(1730);
      } },
    { baris: 1720, bagian: [
        function (m) { m.barisBaru(); },
        function (m) { m.gosub(1970); },
        function (m) {
          m.cetak(m.v['NM$'] + "'S TURN.         "); m.barisBaru();
        },
        function (m) { m.gosub(2060); },
        function (m) { m.lompat(1880); }
      ] },
    { baris: 1730, bagian: [
        function (m) { m.gosub(1970); },
        function (m) { m.lompat(m.v.FX === 1 ? 1740 : 1750); }
      ] },
    { baris: 1740, bagian: [
        function (m) { m.barisBaru(); },
        function (m) { m.gosub(1970); },
        function (m) {
          m.cetak(m.v['NM$'] + ', YOUR TURN.     '); m.barisBaru();
          m.barisBaru(); m.lompat(1760);
        }
      ] },
    { baris: 1750, jalan: function (m) {
        m.cetak('                    '); m.barisBaru(); m.barisBaru();
      } },
    { baris: 1760, jalan: function () { /* PLAY: diam */ } },
    { baris: 1770, jalan: function (m) {
        m.v['C$'] = m.inkey();
        if (m.v['C$'] === '') m.lompat(1770);
        else m.v.KS = m.v['C$'].charCodeAt(0);
      } },
    { baris: 1775, jalan: function (m) {
        if (m.v['C$'] === m.chr(27)) m.lompat(1500);
      } },
    { baris: 1780, jalan: function (m) {
        if (m.v['C$'] !== ' ') m.lompat(1860);
      } },
    { baris: 1790, jalan: function (m) { m.v.OX = m.v.X; m.v.OY = m.v.Y; } },
    /* 1800-1810 SPASI menggeser penunjuk satu petak sepanjang jalur pemain,
       dan membungkusnya di ujung. `DX`/`DY` menentukan arahnya. */
    { baris: 1800, jalan: function (m) {
        m.v.Y = m.v.Y + m.v.DY; if (m.v.Y > 7) m.v.Y = 0;
      } },
    { baris: 1810, jalan: function (m) {
        m.v.X = m.v.X + m.v.DX; if (m.v.X > 7) m.v.X = 0;
      } },
    /* 1820 petak yang berisi penanda (100) atau sudah diambil (-100)
       dilewati. `ABS` menangkap keduanya sekaligus. */
    { baris: 1820, jalan: function (m) {
        m.v.PT = m.v['BD()'][m.v.Y][m.v.X];
        if (Math.abs(m.v.PT) === 100) m.lompat(1800);
      } },
    { baris: 1830, bagian: [
        function (m) { m.v.MD = 1; m.v.I = m.v.OY; m.v.J = m.v.OX; },
        function (m) { m.gosub(1540); }
      ] },
    { baris: 1840, bagian: [
        function (m) { m.v.MD = 2; m.v.I = m.v.Y; m.v.J = m.v.X; },
        function (m) { m.gosub(1540); }
      ] },
    { baris: 1850, jalan: function (m) { m.lompat(1770); } },
    { baris: 1860, jalan: function (m) {
        if (m.v['C$'] !== m.chr(13)) m.lompat(1770);
      } },
    { baris: 1870, jalan: function (m) {
        if (Math.abs(m.v['BD()'][m.v.Y][m.v.X]) === 100) m.lompat(1770);
      } },

    /* --- 1880-1960: ambil angkanya ---------------------------------------- */
    rem(1880), rem(1890),
    { baris: 1900, bagian: [
        function (m) {
          if (!(m.v.NP === 1 && m.v.PL === 2)) return;
          m.v.MD = 2; m.v.I = m.v.Y; m.v.J = m.v.X;
        },
        function (m) {
          if (!(m.v.NP === 1 && m.v.PL === 2)) return;
          m.gosub(1540);
        },
        function (m) {
          if (!(m.v.NP === 1 && m.v.PL === 2)) return;
          for (m.v.DL = 1; m.v.DL <= 1500; m.v.DL++) { /* jeda "berpikir" */ }
        }
      ] },
    /* 1905 petak ASAL ditandai -100: hilang selamanya. Itulah yang membuat
       papan menyusut dan permainan pasti berakhir. */
    { baris: 1905, bagian: [
        function (m) { m.gosub(1990); },
        function (m) {
          m.v.MD = 1; m.v.I = m.v.C1; m.v.J = m.v.C2;
          m.v['BD()'][m.v.I][m.v.J] = -100;
        },
        function (m) { m.gosub(1540); }
      ] },
    { baris: 1910, bagian: [
        function (m) {
          m.v.I = m.v.Y; m.v.J = m.v.X;
          m.v.PT = m.v['BD()'][m.v.I][m.v.J];
          m.v['BD()'][m.v.I][m.v.J] = 100;
        },
        function (m) { m.gosub(1540); }
      ] },
    { baris: 1920, jalan: function (m) {
        if (m.v.PL === 1) m.v.S1 = m.v.S1 + m.v.PT;
      } },
    { baris: 1930, jalan: function (m) {
        if (m.v.PL === 2) m.v.S2 = m.v.S2 + m.v.PT;
      } },
    { baris: 1940, jalan: function (m) { m.gosub(1970); } },
    { baris: 1950, jalan: function (m) {
        m.locate(22, 25);
        m.cetak('LAST TAKEN:' + basic(m.v.PT) + ' ');
      } },
    { baris: 1960, bagian: [
        function (m) { m.gosub(2000); },
        function (m) { m.kembali(); }
      ] },
    { baris: 1970, jalan: function (m) { m.locate(22, 1); m.kembali(); } },
    /* 1980 `PLAY "MNMFL64N=NT(NT);"` — nilai UNSUR LARIK disisipkan ke dalam
       string makronya. Perhatikan `NT` di sini dua benda: larik nada dan
       skalar pemilihnya. */
    { baris: 1980, jalan: function (m) { m.kembali(); } },
    { baris: 1990, jalan: function (m) {
        for (m.v.N = 49; m.v.N <= 70; m.v.N++) { /* PLAY: diam */ }
        m.kembali();
      } },
    { baris: 2000, bagian: [
        function (m) { m.gosub(1970); },
        function (m) { }
      ] },
    { baris: 2010, jalan: function (m) {
        m.locate(21, 1);
        m.v['ME$'] = m.v['P1$'] + "'S SCORE=" + str(m.v.S1) + '  ' +
                     m.v['P2$'] + "'S SCORE=" + str(m.v.S2) + '       ';
        m.v['ME$'] = m.v['ME$'].slice(0, 40);
        m.cetak(m.v['ME$']); m.barisBaru();
        m.kembali();
      } },
    /* 2020-2050 subrutin kosong: sebuah REM dan sebuah RETURN. Sisa dari
       versi yang instruksinya digambar di layar terpisah. */
    rem(2020),
    { baris: 2050, jalan: function (m) { m.kembali(); } },

    /* --- 2059-2200: otak komputer ----------------------------------------- *
       Telaah dua langkah: untuk tiap petak di kolom penanda, hitung
       "keuntungan saya dikurangi keuntungan lawan sesudahnya". Yang terbaik
       dipilih. Baris 2080 merusaknya — lihat catatan.                        */
    rem(2059),
    { baris: 2060, jalan: function (m) {
        m.v.MT = -100; m.v.GG = -1;
        m.untuk('A1', 0, 7, 1, 2200);
        m.v.PC = m.v['BD()'][m.v.A1][m.v.C2];
        if (Math.abs(m.v.PC) === 100) m.lompat(2200);
      } },
    { baris: 2070, bagian: [
        function (m) { m.v.MX = -100; },
        function (m) { m.untuk('A2', 0, 7, 1, 2100); }
      ] },
    /* 2080 `SV=A` — SEHARUSNYA `SV=A2`. `A` tidak pernah diberi nilai, jadi
       SV selalu nol, dan telaah di baris 2130 selalu memeriksa kolom nol. */
    { baris: 2080, jalan: function (m) {
        if (m.v.A2 !== m.v.C2) {
          m.v.PK = m.v['BD()'][m.v.A1][m.v.A2];
          if (m.v.PK !== -100 && m.v.PK > m.v.MX) {
            m.v.MX = m.v.PK;
            m.v.SV = m.v.A || 0;          /* <- seharusnya m.v.A2 */
          }
        }
      } },
    { baris: 2090, jalan: function (m) { m.lanjutkan('A2'); } },
    { baris: 2100, jalan: function (m) { if (m.v.MX !== -100) m.lompat(2120); } },
    { baris: 2110, jalan: function (m) {
        if (m.v.PC > m.v.MT) { m.v.MT = m.v.PC; m.v.GG = m.v.A1; }
        m.lompat(2200);
      } },
    { baris: 2120, jalan: function (m) { if (m.v.GG < 0) m.v.GG = m.v.A1; } },
    { baris: 2130, bagian: [
        function (m) { m.untuk('A2', 0, 7, 1, 2200); },
        function (m) {
          m.v.PQ = m.v['BD()'][m.v.A2][m.v.SV || 0];
          if (m.v.PQ === -100 || m.v.A2 === m.v.A1) m.lompat(2190);
        }
      ] },
    { baris: 2140, bagian: [
        function (m) { m.v.MY = -100; },
        function (m) { m.untuk('A3', 0, 7, 1, 2170); },
        function (m) {
          m.v.PW = m.v['BD()'][m.v.A2][m.v.A3];
          if (m.v.A3 === m.v.SV) m.lompat(2160);
        }
      ] },
    { baris: 2150, jalan: function (m) {
        if (Math.abs(m.v.PW) !== 100 && m.v.PW > m.v.MY) m.v.MY = m.v.PW;
      } },
    { baris: 2160, jalan: function (m) { m.lanjutkan('A3'); } },
    { baris: 2170, jalan: function (m) { if (m.v.MY === -100) m.v.MY = 0; } },
    /* 2180 inti penilaiannya: nilai yang saya ambil, dikurangi nilai terbaik
       yang jadi terbuka untuk lawan, ditambah nilai lawan berikutnya,
       dikurangi lagi. Dua langkah ke depan, dalam satu baris. */
    { baris: 2180, jalan: function (m) {
        m.v.DT = m.v.PC - m.v.MX + m.v.PQ - m.v.MY;
        if (m.v.DT > m.v.MT) { m.v.MT = m.v.DT; m.v.GG = m.v.A1; }
      } },
    { baris: 2190, jalan: function (m) { m.lanjutkan('A2'); } },
    { baris: 2200, bagian: [
        function (m) { m.lanjutkan('A1'); },
        function (m) { m.v.Y = m.v.GG; m.kembali(); }
      ] },

    /* --- 2210-2350: petunjuk ---------------------------------------------- */
    { baris: 2210, jalan: function (m) {
        m.locate(1, 15); m.warna(3, 4);
        m.cetak(' M A X I T '); m.barisBaru();
        m.warna(5, 8); m.barisBaru();
      } },
    cet(2220, 'The object of MAXIT is to get as many'),
    cet(2230, 'points as possible. Two players can'),
    cet(2240, 'play against each other, or one against'),
    { baris: 2250, jalan: function (m) {
        m.cetak('the computer.'); m.barisBaru();
        m.barisBaru(); m.barisBaru();
      } },
    cet(2260, 'You get points by moving a marker '),
    cet(2270, '            **'),
    cet(2280, 'to a space with a number in it. The'),
    cet(2290, 'first player always moves horizontally'),
    cet(2300, 'and the second moves vertically.  You'),
    cet(2310, 'indicate the place you want to move to'),
    cet(2320, 'by using the space bar to position'),
    cet(2330, 'yourself, and then push return to take'),
    { baris: 2340, jalan: function (m) {
        m.cetak('that piece.'); m.barisBaru(); m.kembali();
      } },
    /* 2350 `PLOT 8:END` — `PLOT` bukan perintah GW-BASIC sama sekali; ia
       perintah Commodore PET. Baris ini tidak pernah tercapai karena 2340
       sudah RETURN, jadi ia tidak pernah menimbulkan galat dan tidak pernah
       terhapus. Fosil paling jelas dari asal-usul program ini. */
    { baris: 2350, jalan: function (m) {
        m.henti('PLOT 8:END — baris ini tidak pernah tercapai di aslinya.');
      } },

    /* --- 2360-2450: papan ------------------------------------------------- */
    /* 2360 `REM OTHER OTHELLO BOARD` — jejak kedua: penggambar papan ini
       diambil dari program Othello. */
    rem(2360), rem(2370),
    { baris: 2380, jalan: function (m) {
        m.v['TOP$'] = keBita('╒═══╤═══╤═══╤═══╤═══╤═══╤═══╤═══╕');
      } },
    { baris: 2382, jalan: function (m) {
        m.v['MD1$'] = keBita('│   │   │   │   │   │   │   │   │');
      } },
    { baris: 2384, jalan: function (m) {
        m.v['MD2$'] = keBita('╞═══╪═══╪═══╪═══╪═══╪═══╪═══╪═══╡');
      } },
    { baris: 2386, jalan: function (m) {
        m.v['BOT$'] = keBita('╘═══╧═══╧═══╧═══╧═══╧═══╧═══╧═══╛');
      } },
    { baris: 2390, jalan: function (m) {
        m.locate(4, 4); m.cetak(m.v['TOP$']); m.barisBaru();
      } },
    { baris: 2400, jalan: function (m) {
        for (m.v.Y = 5; m.v.Y <= 17; m.v.Y += 2) {
          m.locate(m.v.Y, 4); m.cetak(m.v['MD1$']); m.barisBaru();
          m.locate(m.v.Y + 1, 4); m.cetak(m.v['MD2$']); m.barisBaru();
        }
      } },
    { baris: 2410, jalan: function (m) {
        m.locate(19, 4); m.cetak(m.v['MD1$']); m.barisBaru();
        m.locate(20, 4); m.cetak(m.v['BOT$']); m.barisBaru();
      } },
    { baris: 2440, jalan: function (m) { m.gosub(2020); } },
    { baris: 2450, jalan: function (m) { m.kembali(); } },
    /* 3000 subrutin pembaca tombol yang tidak pernah dipanggil dari mana
       pun. */
    { baris: 3000, jalan: function (m) {
        m.v['KS$'] = m.inkey();
        if (m.v['KS$'] === '') m.lompat(3000);
        else { m.v.KS = m.v['KS$'].charCodeAt(0); m.kembali(); }
      } }
  ];

  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MAXIT1'] = {
    nama: 'MAXIT1',
    judul: 'Maxit (dari PET, dengan fosilnya)',
    sumber: 'MAXIT1',
    berkas: 'run/MAXIT1.BAS',
    tabel: tabel,
    benih: 29,
    data: [
      49, 51, 53, 54, 56, 58, 60, 61,
      15, 10, 9, 9, 8, 8, 7, 7, 7, 6, 6, 6,
      5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3,
      2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1,
      -2, -2, -2, -2, -3, -3, -3,
      -4, -4, -4, -5, -5, -6, -6,
      -7, -9, 100
    ],

    arsitektur: {
      judul: 'Alur MAXIT1.BAS',
      simpul: [
        { id: 'siap', baris: '1150-1250', jenis: 'mulai',
          teks: ['Petunjuk, satu atau dua', 'pemain, nama'] },
        { id: 'bagi', baris: '1270-1340',
          teks: ['Bagikan 64 angka ke 64 petak', 'tanpa pengembalian'] },
        { id: 'gilir1', baris: '1440', jenis: 'putusan',
          teks: ['Pemain 1: bergerak', 'MENDATAR di barisnya'] },
        { id: 'gilir2', baris: '1460', jenis: 'putusan',
          teks: ['Pemain 2: bergerak', 'MENEGAK di kolomnya'] },
        { id: 'pilih', baris: '1700-1870',
          teks: ['Spasi menggeser penunjuk,', 'Enter mengambil'] },
        { id: 'otak', baris: '2060-2200', jenis: 'subrutin',
          teks: ['Komputer: telaah dua langkah', '(dan SV=A yang merusaknya)'] },
        { id: 'ambil', baris: '1900-1960',
          teks: ['Petak asal jadi -100,', 'tujuan jadi penanda, skor naik'] },
        { id: 'buntu', baris: '1640-1680', jenis: 'putusan',
          teks: ['Jumlah jalur + 600 = 0?', 'Berarti tidak ada langkah'] },
        { id: 'usai', baris: '1470-1505', jenis: 'keluar',
          teks: ['Siapa menang; main lagi?', 'kalau tidak: RUN pola nama'] }
      ],
      panah: [
        { dari: 'siap', ke: 'bagi' },
        { dari: 'bagi', ke: 'gilir1' },
        { dari: 'gilir1', ke: 'buntu' },
        { dari: 'buntu', ke: 'pilih', label: 'masih ada' },
        { dari: 'pilih', ke: 'ambil' },
        { dari: 'gilir1', ke: 'otak', label: 'satu pemain, giliran komputer' },
        { dari: 'otak', ke: 'ambil' },
        { dari: 'ambil', ke: 'gilir2' },
        { dari: 'gilir2', ke: 'gilir1' },
        { dari: 'buntu', ke: 'usai', label: 'jalur habis' }
      ]
    },

    pseudokode: [
      { baris: 1270, tingkat: 0, teks: '<code>AV(K)=K</code> &mdash; daftar 64 petak yang <b>masih tersedia</b>' },
      { baris: 1290, tingkat: 1, teks: 'ambil satu acak, lalu <b>geser sisanya menutupi lubangnya</b>' },
      { baris: 1320, tingkat: 1, teks: 'nomor petak 0&ndash;63 dipecah: <code>I=INT(J/8)</code>, <code>J=J-8*I</code>' },
      { baris: 1640, tingkat: 0, teks: 'jumlah jalur + 600 = 0? berarti semuanya sudah &minus;100 &rarr; <b>habis</b>' },
      { baris: 1800, tingkat: 0, teks: 'spasi menggeser penunjuk sepanjang <code>DX</code>/<code>DY</code>, membungkus di ujung' },
      { baris: 1820, tingkat: 1, teks: '<code>ABS(PT)=100</code> melewati penanda <b>dan</b> petak yang sudah diambil' },
      { baris: 1905, tingkat: 0, teks: 'petak asal jadi <b>&minus;100</b> &mdash; hilang selamanya; papan menyusut' },
      { baris: 2060, tingkat: 0, teks: 'komputer: telaah dua langkah &mdash; <code>DT = PC-MX + PQ-MY</code>' },
      { baris: 2080, tingkat: 1, teks: '&hellip;tapi <code>SV=A</code> seharusnya <code>SV=A2</code>' },
      { baris: 1470, tingkat: 0, teks: '<code>ON 2+SGN(S2-S1) GOSUB</code> &mdash; tiga cabang dari satu tanda' }
    ],

    perintahAsli: 'run\\MAXIT1.bat',
    catatanAsli: 'Spasi menggeser penunjuk, Enter mengambil. Esc keluar ' +
      '&mdash; dan di GW-BASIC sungguhan, keluar berakhir dengan galat "Bad ' +
      'file name" dari baris 1505.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom.',

      '<b><code>PLAY</code> dan <code>BEEP</code> diam.</b> Tiga tempat ' +
      'memakai penyisipan nilai ke dalam string makronya &mdash; ' +
      '<code>N=NT(NT);</code> di baris 1980 bahkan menyisipkan <b>unsur ' +
      'larik</b>.',

      '<b>Gelung tunda habis seketika</b>, jadi jeda "berpikir" komputer di ' +
      'baris 1900 tidak terasa.',

      '<b><code>RANDOMIZE VAL(RIGHT$(TIME$,2))</code> memasang benih tetap.</b>',

      '<b><code>RUN "b:???0??"</code> di baris 1505 tidak bisa dijalankan.</b> ' +
      'Nama berkas berisi tanda tanya, dan <code>RUN</code> tidak menerima ' +
      'pola nama. Di penelusur baris itu memicu galat 64 (<i>Bad file name</i>) ' +
      '&mdash; sama seperti yang akan terjadi di GW-BASIC.',

      '<b>Baris 2350 (<code>PLOT 8:END</code>) tidak pernah tercapai</b> di ' +
      'aslinya, dan di sini ia menghentikan penelusuran dengan pesan yang ' +
      'mengatakannya.'
    ],

    pelajaran: {
      ringkas: 'Papan 8&times;8 tempat satu pemain bergerak mendatar dan satu ' +
        'menegak &mdash; dengan tiga fosil dari versi Commodore PET-nya, dan ' +
        'satu huruf yang mematikan otak komputernya.',
      pelajari: [
        ['Membagikan tanpa pengembalian',
         'Baris 1270&ndash;1310: larik <code>AV</code> berisi petak yang masih ' +
         'tersedia. Tiap putaran mengambil satu secara acak, lalu ' +
         '<b>menggeser sisanya menutupi lubangnya</b>. Hasilnya pembagian 64 ' +
         'angka ke 64 petak tanpa satu pun bentrok, tanpa perlu memeriksa ' +
         '"sudah dipakai belum". Gagasan yang sama dengan pengocokan ' +
         'Fisher&ndash;Yates &mdash; ditulis dengan penggeseran alih-alih ' +
         'penukaran.'],
        ['Satu angka jadi dua koordinat',
         'Baris 1320: <code>I=INT(J/8):J=J-8*I</code>. Nomor petak 0&ndash;63 ' +
         'dipecah jadi baris dan kolom dengan bagi-delapan dan sisanya. ' +
         'Menyimpan kisi dua dimensi sebagai satu urutan, lalu ' +
         'mengembalikannya saat perlu &mdash; bentuk yang sama dipakai setiap ' +
         'kali sebuah gambar disimpan sebagai deretan piksel.'],
        ['Uji "sudah habis" dengan penjumlahan',
         'Baris 1640: <code>FL=600:FOR J=0 TO 7:FL=FL+BD(C1,J):NEXT</code>. ' +
         'Petak yang sudah diambil bernilai &minus;100; kalau kedelapannya ' +
         'sudah diambil, jumlahnya &minus;800, ditambah 600&hellip; ' +
         'Sebenarnya penanda bernilai +100 juga ikut, jadi &minus;700+100+600 ' +
         '= 0 <b>tepat</b> saat jalurnya habis. Satu penjumlahan menggantikan ' +
         'delapan pemeriksaan.'],
        ['Dua nilai ajaib yang dibedakan tandanya',
         '<code>+100</code> adalah penanda pemain; <code>&minus;100</code> ' +
         'adalah petak yang sudah diambil. Baris 1820 melewati keduanya ' +
         'dengan satu uji: <code>ABS(PT)=100</code>. Tanda dipakai sebagai ' +
         'informasi tambahan pada satu bilangan.'],
        ['Tiga cabang dari satu tanda',
         'Baris 1470: <code>ON 2+SGN(S2-S1) GOSUB 1510,1520,1530</code>. ' +
         '<code>SGN</code> memberi &minus;1, 0, atau 1; ditambah dua jadi 1, ' +
         '2, 3 &mdash; tepat indeks yang dibutuhkan <code>ON&hellip;GOSUB</code>. ' +
         'Menang, seri, kalah, tanpa satu pun <code>IF</code>.']
      ],
      hindari: [
        ['Satu huruf yang mematikan telaah komputer',
         'Baris 2080 berakhir dengan <code>SV=A</code>. Seharusnya ' +
         '<code>SV=A2</code> &mdash; kolom terbaik yang barusan ditemukan. ' +
         'Variabel <code>A</code> tidak pernah diberi nilai di mana pun, jadi ' +
         '<code>SV</code> <b>selalu nol</b>. Baris 2130 lalu memakainya untuk ' +
         'melihat ke depan: <code>PQ=BD(A2,SV)</code>, dan selalu memeriksa ' +
         'kolom nol. Seluruh telaah dua langkah itu menilai papan yang salah ' +
         '&mdash; tanpa satu pun galat, tanpa satu pun tanda.'],
        ['Perintah dari bahasa lain yang tertinggal',
         'Baris 2350: <code>PLOT 8:END</code>. <code>PLOT</code> bukan ' +
         'perintah GW-BASIC; ia perintah Commodore PET. Baris itu berada ' +
         'tepat sesudah <code>RETURN</code> di 2340, jadi <b>tidak pernah ' +
         'tercapai</b> &mdash; dan karena tidak pernah tercapai, ia tidak ' +
         'pernah menimbulkan galat dan tidak pernah terhapus. Kode mati tidak ' +
         'cuma menumpuk; ia menyembunyikan kesalahan yang akan langsung ' +
         'ketahuan kalau kodenya hidup.'],
        ['Nama berkas yang tidak mungkin',
         'Baris 1505: <code>RUN "b:???0??"</code>. Tanda tanya adalah pola ' +
         'nama berkas DOS, dan <code>RUN</code> tidak menerimanya. Menjawab ' +
         '"tidak" pada tawaran main lagi <b>tidak kembali ke mana-mana</b> ' +
         '&mdash; ia menabrak "Bad file name". Kemungkinan besar tempat ' +
         'penampung yang lupa diisi.'],
        ['Judul yang tertinggal',
         'Baris 2360 <code>REM OTHER OTHELLO BOARD</code>. Penggambar papan ' +
         'ini diambil dari program Othello, dan komentarnya ikut terbawa. ' +
         'Bersama baris 1000 ("FROM PET") dan 2350, ada <b>tiga</b> jejak ' +
         'asal-usul di satu berkas.'],
        ['Subrutin kosong dan subrutin yatim',
         'Baris 2020&ndash;2050 cuma sebuah <code>REM</code> dan sebuah ' +
         '<code>RETURN</code> &mdash; tapi tetap dipanggil dari baris 2440. ' +
         'Dan baris 3000 adalah subrutin pembaca tombol yang <b>tidak pernah ' +
         'dipanggil dari mana pun</b>.']
      ]
    },

    penjelasan: [
      { judul: 'Satu huruf, dan komputernya berhenti berpikir',
        isi: [
          'Otak komputernya (baris 2060&ndash;2200) sebenarnya lumayan: ia ' +
          'melakukan <b>telaah dua langkah</b>. Untuk tiap petak yang bisa ' +
          'diambilnya, ia menghitung',
          '<code>2180 DT = PC - MX + PQ - MY</code>',
          '&mdash; nilai yang ia ambil (<code>PC</code>), dikurangi nilai ' +
          'terbaik yang jadi terbuka untuk lawan (<code>MX</code>), ditambah ' +
          'nilai yang bisa ia ambil sesudah itu (<code>PQ</code>), dikurangi ' +
          'lagi jawaban lawan (<code>MY</code>). Minimaks dua tingkat, dalam ' +
          'satu baris.',
          'Yang membuatnya tidak bekerja ada di baris 2080:',
          '<code>2080 IF A2&lt;&gt;C2 THEN PK=BD(A1,A2):IF PK&lt;&gt;-100 AND ' +
          'PK&gt;MX THEN MX=PK:SV=A</code>',
          'Gelung itu mencari kolom dengan nilai tertinggi di baris ' +
          '<code>A1</code>, dan menyimpannya di <code>MX</code>. Kolomnya ' +
          'sendiri seharusnya disimpan di <code>SV</code> supaya baris 2130 ' +
          'bisa melihat ke sana.',
          'Tapi yang ditulis <code>SV=A</code>, bukan <code>SV=A2</code>. Dan ' +
          '<code>A</code> tidak pernah diberi nilai di seluruh program &mdash; ' +
          'karena <code>DEFINT A-Z</code>, nilainya <b>nol</b>.',
          'Jadi <code>SV</code> selalu nol, dan baris 2130 selalu memeriksa ' +
          'kolom nol:',
          '<code>2130 FOR A2=0 TO 7:PQ=BD(A2,SV)</code>',
          'Langkah kedua yang ditelaah bukan langkah yang akan diambil ' +
          'komputer; ia langkah di kolom paling kiri, apa pun keadaannya.',
          'Yang membuat cacat ini bertahan: <b>komputernya tetap bermain</b>. ' +
          'Ia tetap memilih sesuatu, tetap kadang menang, dan tidak pernah ' +
          'melakukan hal yang jelas-jelas bodoh &mdash; karena bagian pertama ' +
          'penilaiannya (<code>PC - MX</code>) masih benar. Yang hilang cuma ' +
          'ketajaman, dan ketajaman tidak punya pesan galat.'
        ] },
      { judul: 'Tiga fosil dalam satu berkas',
        isi: [
          'Baris pertamanya jujur: <code>MAXIT FROM PET</code>. Program ini ' +
          'porting dari Commodore PET, dikerjakan Patrick Leabo di Tucson, ' +
          '20 Maret 1982.',
          'Dua jejak lain tertinggal di tempat yang tidak pernah dijalankan.',
          '<b>Baris 2350: <code>PLOT 8:END</code></b>. <code>PLOT</code> tidak ' +
          'ada di GW-BASIC. Ia perintah grafik PET. Kalau baris itu pernah ' +
          'dijalankan sekali saja, GW-BASIC akan langsung berhenti dengan ' +
          '"Syntax error" dan penulisnya akan menghapusnya.',
          'Ia tidak pernah dijalankan, karena baris 2340 &mdash; baris ' +
          'terakhir subrutin petunjuk &mdash; sudah <code>RETURN</code> lebih ' +
          'dulu. Jadi ia bertahan empat puluh tahun.',
          '<b>Baris 2360: <code>REM OTHER OTHELLO BOARD</code></b>. Penggambar ' +
          'papan 8&times;8 di bawahnya diambil dari program Othello &mdash; ' +
          'dan koleksi ini memang punya OTHELLO.BAS. Komentarnya ikut terbawa ' +
          'waktu kodenya disalin.',
          'Ada satu pelajaran yang tidak menyenangkan di sini: <b>kode mati ' +
          'tidak cuma menumpuk, ia menyembunyikan</b>. Baris 2350 adalah ' +
          'kesalahan sintaks yang jelas, di bahasa yang salah, dan tidak ada ' +
          'satu pun alat yang akan menemukannya &mdash; karena satu-satunya ' +
          'alat yang memeriksa sintaks BASIC adalah penafsirnya sendiri, dan ' +
          'penafsir cuma memeriksa baris yang benar-benar ia jalankan.'
        ] }
    ]
  };
})(window);
