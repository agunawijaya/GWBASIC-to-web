/* ===========================================================================
   STATS.js — porting minimalis STATS.BAS sebagai tabel baris.

   Program kedua puluh empat: "Biorhythm Sports Predicting". Dua regu sepak
   bola Amerika, dua puluh dua pemain masing-masing, tanggal lahir semuanya —
   dan sebuah ramalan siapa yang akan menang.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) FUNGSI BUATAN SENDIRI. Baris 220:
           DEF FNX(V) = FIX(DIFF-(INT(DIFF/V))*V)+1
       Itu "sisa bagi", ditulis tangan karena `MOD` tidak dipakai — dan
       dipanggil tiga kali dengan tiga panjang daur: 23, 28, 33 hari.

   (2) DUA TABEL YANG DIBACA DENGAN GELUNG YANG SAMA. Baris 2870-2910 membaca
       84 angka DUA KALI: putaran pertama nilai poinnya, putaran kedua nomor
       nama fasenya. Satu gelung, dua arti, dibedakan cuma oleh indeks ketiga.

   (3) BOBOT POSISI YANG MENENTUKAN SEGALANYA. Baris 3080: quarterback 5,
       halfback 3, penjaga garis 1. Seluruh "kecerdasan" ramalannya ada di
       dua puluh dua angka itu.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Empat larik diganti namanya karena punya kembaran skalar: `Z()` jadi
     `Z_`, `ZZ()` jadi `ZZ_`, `AVG!()` jadi `AVG_`, `TEAMNAME$()` jadi
     `TEAMNAME_`.
   - Disketnya ada di memori penelusur saja; regu yang disimpan hilang begitu
     halaman disegarkan. Seperti DRAW.BAS.
   - Uji disket data di baris 30-140 dijawab seperti DRAW.BAS: panggilan
     pertama menemukan MENU.BAS, panggilan kedua tidak.
   - `COLOR 31` di baris 120 tidak berkedip.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.penangkapGalat = 4030;
        m.pasangJebakan(10, 4490); m.jebakan(10, true);
      } },
    { baris: 20, jalan: function (m) { m.cls(); m.warna(7, 0); } },
    { baris: 30, jalan: function (m) { m.locate(10, 35); ujiDisket(m); } },
    { baris: 40, jalan: function (m) { if (m.v.F) m.lompat(150); } },
    ajar(50, 5, 22, 'You Must Use A Data  Diskette With This'),
    ajar(60, 6, 22, 'Program. Insert A Formated Diskette And'),
    ajar(70, 7, 22, '      Strike Any Key To Continue'),
    { baris: 80, jalan: function (m) {
        m.locate(25, 25); m.warna(0, 7);
        m.cetak(' Strike <F10> To Return To Menu '); m.warna(7, 0);
      } },
    { baris: 90, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(90);
      } },
    { baris: 100, jalan: function (m) { m.locate(10, 35); ujiDisket(m); } },
    { baris: 110, jalan: function (m) { if (m.v.F) m.lompat(140); } },
    { baris: 120, jalan: function (m) {
        m.cls(); m.locate(5, 26); m.warna(31, 0);
        m.cetak('You MUST Use A Data Diskette'); m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 130, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 3000; m.v.A++) { /* jeda */ }
        m.lompat(20);
      } },
    /* 140 program ini pun menyalin dirinya ke disket data, sama seperti
       DRAW.BAS baris 190. */
    { baris: 140, jalan: function () { } },
    { baris: 150, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 8; m.v.A++) {
          m.pasangJebakan(m.v.A, 920); m.jebakan(m.v.A, true);
        }
      } },
    { baris: 160, jalan: function (m) { m.pasangJebakan(9, 4010); } },
    { baris: 170, jalan: function (m) { m.pasangJebakan(10, 3130); } },
    { baris: 180, jalan: function (m) { m.warna(3, 0); } },
    { baris: 190, jalan: function () { /* DEFDBL J,G,V,W,X */ } },
    { baris: 200, jalan: function () { /* DEFINT A-C */ } },
    { baris: 210, jalan: function () { /* DEFSTR Z */ } },
    /* 220 fungsi buatan sendiri: sisa bagi, plus satu. Dipakai tiga kali di
       baris 1620/1640/1660 dengan tiga panjang daur biorhythm. */
    { baris: 220, jalan: function () { } },
    { baris: 230, jalan: function (m) {
        m.dim('Z_$', 22, 10, 1); m.dim('D', 2, 33, 1);
        m.dim('AVG_', 21); m.dim('VALUE', 21); m.dim('TEAMNAME_$', 30);
        /* Larik yang tidak pernah di-DIM; BASIC membuatnya berbatas 10. */
        m.dim('TEAM$', 10); m.dim('ZZ_$', 10); m.dim('TURN', 10);
        m.dim('OF', 10); m.dim('DF', 10); m.dim('TEAMAVG', 10);
        m.v.Z_ = m.v['Z_$']; m.v.ZZ_ = m.v['ZZ_$'];
        m.v.TEAMNAME_ = m.v['TEAMNAME_$'];
        m.v.T = 0; m.v.K9 = 0; m.v.FFF = 0;
      } },
    { baris: 240, jalan: function (m) {
        if (!m.v.DISKET) m.v.DISKET = { 'NAME.FLE': [] };
        m.tutup();
      } },
    { baris: 250, jalan: function (m) { m.cls(); m.v.XX = 12; m.v.YYY = 54; } },
    { baris: 260, bagian: [
        function (m) { m.gosub(2870); },   /* baca tabel biorhythm */
        function (m) { m.gosub(1780); }    /* judul + petunjuk     */
      ] },

    /* --- 270-500: menu utama ---------------------------------------------- */
    { baris: 270, jalan: function (m) {
        m.warna(3, 0); m.cls(); m.locate(1, 20);
        m.cetak(m.ulang(41, 219)); m.barisBaru();
      } },
    { baris: 280, jalan: function (m) {
        m.locate(2, 20); m.cetak(m.ulang(2, 219));
        m.tab(35); m.cetak('SPORTS MENU');
        m.locate(null, 59); m.cetak(m.ulang(2, 219)); m.barisBaru();
      } },
    { baris: 290, jalan: function (m) {
        m.locate(3, 20); m.cetak(m.ulang(41, 219)); m.barisBaru();
      } },
    { baris: 300, jalan: function (m) {
        for (m.v.A = 4; m.v.A <= 12; m.v.A++) {
          m.locate(m.v.A, 20); m.cetak(m.ulang(2, 219)); m.barisBaru();
          m.locate(m.v.A, 59); m.cetak(m.ulang(2, 219)); m.barisBaru();
        }
      } },
    { baris: 310, jalan: function (m) {
        m.locate(13, 20); m.cetak(m.ulang(41, 219)); m.barisBaru();
      } },
    pilihan(320, 5, 'A', ') Enter A Team Roster.'),
    pilihan(330, null, 'B', ') Evaluate Both Teams.'),
    pilihan(340, null, 'C', ') Change Birth Date(s)'),
    pilihan(350, null, 'D', ') Save A Team To Diskette.'),
    pilihan(360, null, 'E', ') Load Team From Diskette.'),
    pilihan(370, null, 'F', ') Erase Team Off Diskette.'),
    { baris: 380, jalan: function (m) {
        m.locate(12, 26, 1);
        m.cetak('What is your option? <A-F>'); m.barisBaru();
      } },
    { baris: 390, jalan: function (m) {
        m.locate(12, 54);
        m.v.XX = m.barisKursor(); m.v.YYY = m.pos();
      } },
    { baris: 400, jalan: function (m) { m.gosub(3190); } },
    { baris: 410, jalan: function () { } },
    { baris: 420, jalan: function (m) { if (m.inkey() !== '') m.lompat(420); } },
    { baris: 430, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(430);
      } },
    menu(440, 'A', [750, 930]),
    menu(450, 'B', [850, 1480, 2680, 2090]),
    menu(460, 'C', [510]),
    menu(470, 'D', [3210]),
    menu(480, 'E', [3460]),
    menu(490, 'F', [3710]),
    { baris: 500, jalan: function (m) { m.lompat(420); } },

    /* --- 510-740: ubah tanggal lahir -------------------------------------- */
    { baris: 510, jalan: function (m) {
        if (m.v['TEAM$'][0] !== '' || m.v['TEAM$'][1] !== '') m.lompat(560);
      } },
    { baris: 520, jalan: function (m) { m.locate(20, 25); m.warna(15, 0); } },
    { baris: 530, jalan: function (m) {
        m.cetak('You Must First Create Team'); m.barisBaru();
      } },
    ajar(540, 21, 20, 'Rosters Or Load Teams From Diskette'),
    { baris: 550, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10000; m.v.A++) { /* jeda */ }
        m.kembali();
      } },
    { baris: 560, jalan: function (m) {
        m.cls();
        if (m.v['TEAM$'][0] !== '' && m.v['TEAM$'][1] !== '') m.lompat(590);
      } },
    { baris: 570, jalan: function (m) {
        if (m.v['TEAM$'][0] !== '') { m.v.T = 0; m.lompat(650); }
      } },
    { baris: 580, jalan: function (m) {
        if (m.v['TEAM$'][1] !== '') { m.v.T = 1; m.lompat(650); }
      } },
    { baris: 590, jalan: function (m) {
        m.cls(); m.locate(null, 20);
        m.cetak('Which Roster Do You Wish To Update?'); m.barisBaru();
      } },
    { baris: 600, jalan: function (m) {
        m.locate(null, 20);
        m.cetak(m.v['TEAM$'][0] + ' or ' + m.v['TEAM$'][1] + '? ');
      } },
    { baris: 610, jalan: function (m) { m.gosub(4330); } },
    { baris: 620, jalan: function (m) {
        if (m.v.ZA === m.v['TEAM$'][0]) { m.v.T = 0; m.lompat(650); }
      } },
    { baris: 630, jalan: function (m) {
        if (m.v.ZA === m.v['TEAM$'][1]) { m.v.T = 1; m.lompat(650); }
      } },
    { baris: 640, jalan: function (m) { m.lompat(590); } },
    { baris: 650, jalan: function (m) { m.cls(); } },
    { baris: 660, jalan: function (m) {
        m.cetak('Position: '); m.tab(30); m.cetak('Birth Date');
        m.tab(60); m.cetak('Team ' + m.v['TEAM$'][m.v.T]); m.barisBaru();
      } },
    { baris: 670, jalan: function (m) { m.untuk('A', 0, 21, 1, 750); } },
    { baris: 680, jalan: function (m) {
        m.locate(null, 1); m.cetak(m.v.Z_[m.v.A][0][m.v.T]);
        m.locate(null, 30); m.cetak(m.v.Z_[m.v.A][1][m.v.T]);
      } },
    { baris: 690, jalan: function (m) {
        m.v.XX = m.barisKursor(); m.v.YYY = m.pos();
      } },
    { baris: 700, jalan: function (m) {
        m.locate(null, 60); m.warna(15, 0);
        m.cetak('Correct? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 710, bagian: [
        function (m) { m.gosub(1430); },
        function (m) {
          if (m.v.Z1 === '1') {
            m.locate(null, 60); m.spc(19); m.lompat(740);
          }
        }
      ] },
    { baris: 720, bagian: [
        function (m) {
          m.locate(m.v.XX, 30); m.cetak('Birth Date :(m-d-y) ');
        },
        function (m) { m.gosub(1040); }
      ] },
    { baris: 730, jalan: function (m) { m.v.Z_[m.v.A][1][m.v.T] = m.v.Z2; } },
    { baris: 740, bagian: [
        function (m) { m.barisBaru(); },
        function (m) { m.lanjutkan('A'); },
        function (m) { m.kembali(); }
      ] },

    /* --- 750-920: nama regu ----------------------------------------------- */
    { baris: 750, jalan: function (m) { m.cls(); } },
    { baris: 760, jalan: function (m) {
        m.locate(4, 20); m.cetak('Enter Name Of Team ');
      } },
    { baris: 770, bagian: [
        function (m) { m.gosub(4330); },
        function (m) { if (m.v.ZA !== '        ') m.lompat(800); }
      ] },
    ajar(780, 10, 20, 'You Must Enter A Team Name'),
    /* 790 `RETURN 270` — pulang bukan ke pemanggilnya melainkan ke menu. */
    { baris: 790, jalan: function (m) {
        for (m.v.SLO = 1; m.v.SLO <= 3000; m.v.SLO++) { /* jeda */ }
        m.kembali(270);
      } },
    { baris: 800, jalan: function (m) {
        if (m.v['TEAM$'][0] !== '' && m.v['TEAM$'][1] === '') {
          m.v['TEAM$'][1] = m.v.ZA; m.v.T = 1; m.lompat(840);
        }
      } },
    { baris: 810, jalan: function (m) {
        if (m.v['TEAM$'][1] !== '' && m.v['TEAM$'][0] === '') {
          m.v['TEAM$'][0] = m.v.ZA; m.v.T = 0; m.lompat(840);
        }
      } },
    { baris: 820, jalan: function (m) {
        m.locate(6, 20);
        m.cetak('Are They The Home or Visiting Team? <H/V>');
      } },
    { baris: 830, bagian: [
        function (m) { m.gosub(3950); },
        function (m) { m.v['TEAM$'][m.v.T] = m.v.ZA; }
      ] },
    { baris: 840, jalan: function (m) { m.kembali(); } },
    { baris: 850, jalan: function (m) {
        if (m.v['TEAM$'][0] !== '' && m.v['TEAM$'][1] !== '') m.lompat(900);
      } },
    { baris: 860, jalan: function (m) { m.locate(20, 25); m.warna(15, 0); } },
    { baris: 870, jalan: function (m) {
        m.cetak('You Must First Create Team'); m.barisBaru();
      } },
    ajar(880, 21, 23, 'Rosters Or Load Teams From Diskette'),
    { baris: 890, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10000; m.v.A++) { /* jeda */ }
        m.warna(3, 0); m.kembali(270);
      } },
    { baris: 900, jalan: function (m) {
        m.cls(); m.locate(8, 15);
        m.cetak('What Is Date Of Game :(m-d-y)? ');
      } },
    { baris: 910, bagian: [
        function (m) { m.gosub(1040); },
        function (m) { m.v['GAME$'] = m.v.Z2; m.cls(); }
      ] },
    /* 920 penutup 850 SEKALIGUS badan jebakan F1-F8. */
    { baris: 920, jalan: function (m) { m.kembali(); } },

    /* --- 930-1030: mengisi 22 tanggal lahir ------------------------------- */
    { baris: 930, jalan: function (m) {
        m.v.A = 0; m.v.Z1 = ''; m.cls();
        m.cetak('Team  ' + m.v['TEAM$'][m.v.T]); m.barisBaru();
      } },
    { baris: 940, bagian: [
        function (m) { m.v.XX = m.barisKursor(); m.v.YYY = m.pos(); },
        function (m) { m.gosub(3190); }
      ] },
    { baris: 950, jalan: function (m) { m.locate(2, null); m.warna(3, 0); } },
    { baris: 960, jalan: function (m) { if (m.v.A >= 22) m.lompat(1030); } },
    { baris: 970, jalan: function (m) {
        m.locate(null, 1);
        m.cetak('Position: ' + m.v.Z_[m.v.A][0][m.v.T]);
      } },
    { baris: 980, jalan: function (m) {
        m.locate(null, 30, 1); m.cetak('Birth Date:? (m-d-y) ');
      } },
    { baris: 990, jalan: function (m) { m.gosub(1040); } },
    { baris: 1000, jalan: function (m) { m.v.Z_[m.v.A][1][m.v.T] = m.v.Z2; } },
    { baris: 1010, jalan: function (m) { m.v.A = m.v.A + 1; m.barisBaru(); } },
    { baris: 1020, jalan: function (m) { m.lompat(960); } },
    { baris: 1030, jalan: function (m) { m.kembali(); } },

    /* --- 1040-1470: penyunting tanggal, bagian demi bagian ----------------
       Tiga blok yang bentuknya sama: kumpulkan angka, uji rentangnya,
       tambahkan garis miring, ulangi. Bulan diuji 1-12, hari 1-31, tahun
       1-99 — dan tidak ada yang menguji apakah harinya ada di bulan itu. */
    { baris: 1040, jalan: function (m) { if (m.inkey() !== '') m.lompat(1040); } },
    { baris: 1050, jalan: function (m) {
        m.v.Z = ''; m.v.Z1 = '';
        m.locate(null, 53); m.spc(25); m.locate(null, 53);
      } },
    bacaTombol(1060, 1060),
    { baris: 1070, jalan: function (m) { if (m.v.Z === m.chr(8)) m.lompat(1050); } },
    panah(1080, 1050, 1060),
    pemisah(1090, 1140),
    { baris: 1100, jalan: function (m) { if (m.v.Z === m.chr(13)) m.lompat(1060); } },
    angkaSaja(1110, 1060),
    { baris: 1120, jalan: function (m) { if (m.v.Z1.length > 1) m.lompat(1060); } },
    { baris: 1130, jalan: function (m) {
        m.v.Z1 = m.v.Z1 + m.v.Z;
        m.locate(null, 53); m.cetak(m.v.Z1); m.lompat(1060);
      } },
    { baris: 1140, jalan: function (m) {
        m.v.MM = nilai(m.v.Z1);
        if (m.v.MM < 1 || m.v.MM > 12) m.lompat(1050);
      } },
    { baris: 1150, jalan: function (m) {
        if (m.v.Z1.length !== 2) m.v.Z1 = ' ' + m.v.Z1;
      } },
    { baris: 1160, jalan: function (m) {
        m.v.Z2 = m.v.Z1 + '/'; m.v.Z1 = '';
        m.locate(null, 53); m.cetak(m.v.Z2);
      } },
    bacaTombol(1170, 1170),
    { baris: 1180, jalan: function (m) { if (m.v.Z === m.chr(8)) m.lompat(1050); } },
    panah(1190, 1050, 1170),
    pemisah(1200, 1250),
    { baris: 1210, jalan: function (m) { if (m.v.Z === m.chr(13)) m.lompat(1170); } },
    angkaSaja(1220, 1170),
    { baris: 1230, jalan: function (m) { if (m.v.Z1.length > 1) m.lompat(1170); } },
    { baris: 1240, jalan: function (m) {
        m.v.Z1 = m.v.Z1 + m.v.Z;
        m.locate(null, m.pos()); m.cetak(m.v.Z); m.lompat(1170);
      } },
    { baris: 1250, jalan: function (m) {
        m.v.DD = nilai(m.v.Z1);
        if (m.v.DD < 1 || m.v.DD > 31) m.lompat(1050);
      } },
    { baris: 1260, jalan: function (m) {
        if (m.v.Z1.length !== 2) m.v.Z1 = ' ' + m.v.Z1;
      } },
    { baris: 1270, jalan: function (m) {
        m.v.Z2 = m.v.Z2 + m.v.Z1 + '/'; m.v.Z1 = '';
        m.locate(null, 53); m.cetak(m.v.Z2);
      } },
    bacaTombol(1280, 1280),
    { baris: 1290, jalan: function (m) { if (m.v.Z === m.chr(8)) m.lompat(1050); } },
    { baris: 1300, jalan: function (m) {
        if (m.v.Z.length > 1 && m.v.Z.slice(-1) === m.chr(75)) m.lompat(1280);
      } },
    { baris: 1310, jalan: function (m) {
        if (m.v.Z < '0' || m.v.Z > '9' || m.v.Z === m.chr(13)) m.lompat(1280);
      } },
    { baris: 1320, jalan: function (m) {
        m.v.Z1 = m.v.Z;
        m.locate(null, m.pos()); m.cetak(m.v.Z);
      } },
    { baris: 1330, jalan: function (m) { m.v.Z = m.inkey(); } },
    { baris: 1340, jalan: function (m) {
        if (m.v.Z === '' || m.v.Z === m.chr(13) || m.v.Z === m.chr(8)) m.lompat(1330);
      } },
    { baris: 1350, jalan: function (m) {
        if (m.v.Z.length > 1 && m.v.Z.slice(-1) === m.chr(75)) m.lompat(1330);
      } },
    { baris: 1360, jalan: function (m) {
        if (m.v.Z < '0' || m.v.Z > '9') m.lompat(1330);
      } },
    { baris: 1370, jalan: function (m) { m.v.Z1 = m.v.Z1 + m.v.Z; } },
    { baris: 1380, jalan: function (m) {
        m.v.YY = nilai(m.v.Z1);
        if (m.v.YY < 1 || m.v.YY > 99) m.lompat(1050);
      } },
    { baris: 1390, jalan: function (m) {
        m.v.Z2 = m.v.Z2 + m.v.Z1;
        m.locate(null, 53); m.cetak(m.v.Z2);
      } },
    { baris: 1400, jalan: function (m) {
        m.locate(null, 62); m.warna(15, null);
        m.cetak('Correct? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 1410, bagian: [
        function (m) { m.gosub(1430); },
        function (m) { if (m.v.Z1 !== '1') m.lompat(1050); }
      ] },
    { baris: 1420, jalan: function (m) {
        m.locate(null, 62); m.spc(16); m.kembali();
      } },
    { baris: 1430, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1430);
      } },
    { baris: 1440, jalan: function (m) { m.v.Z1 = ''; } },
    { baris: 1450, jalan: function (m) {
        if (m.v.Z === 'Y' || m.v.Z === 'y') { m.v.Z1 = '1'; m.lompat(1470); }
      } },
    { baris: 1460, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(1430);
      } },
    { baris: 1470, jalan: function (m) { m.cetak(m.v.Z); m.kembali(); } },

    /* --- 1480-1770: biorhythm setiap pemain ------------------------------- */
    { baris: 1480, jalan: function (m) {
        m.locate(10, 30, 1); m.cetak('ONE MOMENT PLEASE'); m.barisBaru();
      } },
    { baris: 1490, jalan: function (m) {
        m.v.MONTH = nilai(m.v['GAME$'].substr(0, 2));
      } },
    { baris: 1500, jalan: function (m) {
        m.v.DAY = nilai(m.v['GAME$'].substr(3, 2));
      } },
    { baris: 1510, jalan: function (m) {
        m.v.YEAR = 1900 + nilai(m.v['GAME$'].substr(6, 2));
      } },
    { baris: 1520, jalan: function (m) { m.gosub(1710); } },
    { baris: 1530, jalan: function (m) { m.v.GAME = m.v.JD; } },
    { baris: 1540, jalan: function (m) { m.untuk('T', 0, 1, 1, 1700); } },
    { baris: 1550, jalan: function (m) { m.untuk('B', 0, 21, 1, 1690); } },
    { baris: 1560, jalan: function (m) {
        if (m.v.Z_[m.v.B][1][m.v.T] === '') m.lompat(1680);
      } },
    { baris: 1570, jalan: function (m) {
        m.v.MONTH = nilai(m.v.Z_[m.v.B][1][m.v.T].substr(0, 2));
      } },
    { baris: 1580, jalan: function (m) {
        m.v.DAY = nilai(m.v.Z_[m.v.B][1][m.v.T].substr(3, 2));
      } },
    { baris: 1590, jalan: function (m) {
        m.v.YEAR = 1900 + nilai(m.v.Z_[m.v.B][1][m.v.T].substr(6, 2));
      } },
    { baris: 1600, jalan: function (m) { m.gosub(1710); } },
    { baris: 1610, jalan: function (m) { m.v.DIFF = m.v.GAME - m.v.JD; } },
    fnx(1620, 23), simpanDaur(1630, 2, 3, 0),
    fnx(1640, 28), simpanDaur(1650, 4, 5, 1),
    fnx(1660, 33), simpanDaur(1670, 6, 7, 2),
    { baris: 1680, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 1690, jalan: function (m) { m.lanjutkan('T'); } },
    { baris: 1700, jalan: function (m) { m.kembali(); } },
    /* 1710-1770 hari Julian, rumus yang sama persis dengan BIO.BAS. */
    { baris: 1710, jalan: function (m) {
        m.v.W = Math.trunc((m.v.MONTH - 14) / 12);
      } },
    { baris: 1720, jalan: function (m) {
        m.v.JD = Math.floor(1461 * (m.v.YEAR + 4800 + m.v.W) / 4);
      } },
    { baris: 1730, jalan: function (m) {
        m.v.X = Math.trunc(367 * (m.v.MONTH - 2 - m.v.W * 12) / 12);
      } },
    { baris: 1740, jalan: function (m) { m.v.JD = m.v.JD + m.v.X; } },
    { baris: 1750, jalan: function (m) {
        m.v.X = Math.floor(Math.floor(3 * (m.v.YEAR + 4900 + m.v.W) / 100) / 4);
      } },
    { baris: 1760, jalan: function (m) {
        m.v.JD = m.v.JD + m.v.DAY - 32075 - m.v.X;
      } },
    { baris: 1770, jalan: function (m) { m.kembali(); } },

    /* --- 1780-2080: judul dan petunjuk ------------------------------------ */
    { baris: 1780, jalan: function (m) {
        m.cls(); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 1790, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1); m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 1800, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 1810, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 15);
        m.cetak('B I O R H Y T H M   S P O R T S   P R E D I C T I N G');
        m.barisBaru();
      } },
    { baris: 1820, jalan: function (m) { m.locate(6, 23); } },
    { baris: 1830, jalan: function (m) {
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1840, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1840);
      } },
    { baris: 1850, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') m.kembali();
      } },
    { baris: 1860, jalan: function (m) {
        if (m.v.Z !== 'Y' && m.v.Z !== 'y') m.lompat(1840);
      } },
    ajar(1870,  4,  6, '   This program combines the number crunching ability of your PC, the'),
    ajar(1880,  5,  6, 'biorhythm theory, and an assortment of other weights and measures, to'),
    ajar(1890,  6,  6, 'predict which of two teams should be  dominant in any particular game'),
    ajar(1900,  7,  6, 'on any given Sunday (for more info about the Biorhythm Theory in gen-'),
    ajar(1910,  8,  6, 'eral, please refer to your FriendlyWare manual on page number 31).'),
    ajar(1920,  9,  6, '       Predictions are generated by first calculating each individual'),
    ajar(1930, 10,  6, "player's biorhythm chart,  and then mixing those results for each"),
    ajar(1940, 11,  6, 'unit (offense and defense) to come up with a team average.  The aver-'),
    ajar(1950, 12,  6, 'age also includes variables for  key positions,  skill positions, etc.'),
    ajar(1960, 13,  6, "   A team's offense is compared to the other team's defense and vice-"),
    ajar(1970, 14,  6, 'versa to produce the overall prediction.   The results should tell if'),
    ajar(1980, 15,  6, 'one team is more likely to perform close to its potential on game day.'),
    ajar(1990, 16,  6, '  Remember  though,  that a weak team  playing at its  high may still'),
    ajar(2000, 17,  6, 'not be as strong  as a great team that is a little down.  That is why'),
    ajar(2010, 18,  6, 'YOUR  OWN  evaluation  and  analysis is necessary to use this program.'),
    ajar(2020, 19,  6, "In other words, we are providing you with a `TOOL',  not a  `LABORER'."),
    ajar(2030, 20,  6, '  Once you have entered the players birth dates for a particular team,'),
    ajar(2040, 21,  6, 'it is possible to  save this  information  onto another diskette  for'),
    ajar(2050, 22,  6, 'future use. You will also have the ability to update your information.'),
    { baris: 2060, jalan: function (m) {
        m.locate(25, 28); m.warna(15, null);
        m.cetak('Strike Any Key To Continue'); m.warna(3, 0);
      } },
    { baris: 2070, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2070); else m.kembali();
      } },
    { baris: 2080, jalan: function (m) { m.kembali(); } },

    /* --- 2090-2390: tabel hasil ------------------------------------------- */
    { baris: 2090, jalan: function (m) { m.v.A = 0; m.v.FFF = 0; } },
    { baris: 2100, jalan: function (m) { m.gosub(2400); } },
    { baris: 2110, jalan: function (m) { m.v.C = 5; } },
    { baris: 2120, jalan: function (m) { m.untuk('B', 0, 21, 1, 2300); } },
    { baris: 2130, jalan: function (m) { m.locate(m.v.C, 2); m.warna(15, 0); } },
    { baris: 2140, jalan: function (m) {
        m.cetak(medan(m.v.Z_[m.v.B][0][m.v.A], 13));
      } },
    { baris: 2150, jalan: function (m) {
        m.locate(null, 17); m.cetak(m.v.Z_[m.v.B][1][m.v.A]);
      } },
    fase(2160, 27, 0, 2),
    poin(2170, 34, 3),
    fase(2180, 40, 1, 4),
    poin(2190, 47, 5),
    fase(2200, 53, 2, 6),
    poin(2210, 60, 7),
    { baris: 2220, jalan: function (m) {
        m.locate(null, 66);
        m.cetakFormat('##.#', nilai(m.v.Z_[m.v.B][9][m.v.A]));
      } },
    { baris: 2230, jalan: function (m) {
        m.locate(null, 74);
        m.cetakFormat('##.##', nilai(m.v.Z_[m.v.B][8][m.v.A]));
      } },
    { baris: 2240, jalan: function (m) { m.warna(2, 0); } },
    { baris: 2250, jalan: function (m) {
        m.v.C = m.v.C + 1;
        m.lompat(m.v.B === 10 ? 2260 : 2290);
      } },
    { baris: 2260, jalan: function (m) {
        if (m.v.FFF) { m.warna(6, 0); m.locate(18, 44); } else m.locate(18, 5);
      } },
    { baris: 2270, jalan: function (m) {
        m.cetak(medan(m.v['TEAM$'][m.v.A], 8));
        m.cetak(' Offensive Average Is ');
        m.cetakFormat('###.##', m.v.OF[m.v.A]);
      } },
    { baris: 2280, bagian: [
        function (m) { m.v.A = m.v.TURN[m.v.A]; },
        function (m) { m.gosub(2350); }
      ] },
    { baris: 2290, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 2300, jalan: function (m) {
        if (m.v.FFF) { m.warna(6, 0); m.locate(19, 44); } else m.locate(19, 5);
      } },
    { baris: 2310, jalan: function (m) {
        m.cetak(medan(m.v['TEAM$'][m.v.A], 8));
        m.cetak(' Defensive Average Is ');
        m.cetakFormat('###.##', m.v.DF[m.v.A]);
      } },
    { baris: 2320, bagian: [
        function (m) { m.gosub(2350); },
        function (m) { m.v.FFF = 1; if (m.v.A) m.lompat(2110); }
      ] },
    total(2330, 21, 0), total(2340, 22, 1),
    { baris: 2350, jalan: function (m) {
        m.warna(15, 0); m.v.C = 5; m.locate(25, 29);
        m.cetak('Strike Any Key To Continue');
      } },
    { baris: 2360, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2360);
      } },
    { baris: 2370, jalan: function (m) { m.locate(25, 20); m.spc(40); } },
    { baris: 2380, jalan: function (m) { m.locate(24, 1); m.spc(60); } },
    { baris: 2390, jalan: function (m) { m.kembali(); } },

    /* --- 2400-2670: kerangka tabel, separuh PRINT separuh POKE ----------- */
    { baris: 2400, jalan: function (m) { m.warna(4, 0); m.cls(); } },
    { baris: 2410, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 205)); m.barisBaru();
      } },
    { baris: 2420, jalan: function () { } },
    pokeKisi(2430, [[0, 201], [30, 203], [48, 203], [74, 203]]),
    pokeKisi(2440, [[100, 203], [126, 203], [158, 187]]),
    { baris: 2450, jalan: function (m) {
        m.locate(2, 1);
        m.cetak(m.chr(186) + '    PLAYER    ' + m.chr(186));
      } },
    { baris: 2460, jalan: function (m) {
        m.cetak('  BIRTH ' + m.chr(186) + '  PHYSICAL  ' + m.chr(186) +
                '  EMOTIONAL ' + m.chr(186));
      } },
    { baris: 2470, jalan: function (m) {
        m.cetak('INTELLECTUAL' + m.chr(186) + '    TOTALS     ' + m.chr(186));
        m.barisBaru();
      } },
    { baris: 2480, jalan: function (m) {
        m.locate(3, 1); m.cetak(m.chr(186) + '   POSITION   ');
      } },
    { baris: 2490, jalan: function (m) {
        m.cetak(m.chr(186) + '  DATE  ' + m.chr(186) + 'CYCLE   PTS.' +
                m.chr(186) + 'CYC');
      } },
    { baris: 2500, jalan: function (m) {
        m.cetak('LE   PTS.' + m.chr(186) + 'CYCLE   PTS.' + m.chr(186) +
                '  PTS.    AVG. ' + m.chr(186));
        m.barisBaru();
      } },
    { baris: 2510, jalan: function (m) {
        m.locate(4, 1); m.cetak(m.ulang(80, 205)); m.barisBaru();
      } },
    pokeDasar(2520, 480, [[0, 204], [30, 206], [48, 206]]),
    pokeDasar(2530, 542, [[0, 209], [12, 206], [26, 209]]),
    pokeDasar(2540, 580, [[0, 206], [14, 209], [26, 206]]),
    pokeDasar(2550, 620, [[0, 209], [18, 185]]),
    { baris: 2560, jalan: function (m) { m.untuk('E', 640, 2240, 160, 2620); } },
    { baris: 2570, jalan: function (m) {
        m.v.G = m.v.E;
        m.pokeLayar(m.v.G, 186); m.pokeLayar(m.v.G + 30, 186);
        m.pokeLayar(m.v.G + 48, 186);
      } },
    { baris: 2580, jalan: function (m) {
        m.v.G = m.v.G + 62;
        m.pokeLayar(m.v.G, 179); m.pokeLayar(m.v.G + 12, 186);
      } },
    { baris: 2590, jalan: function (m) {
        m.v.G = m.v.G + 26;
        m.pokeLayar(m.v.G, 179); m.pokeLayar(m.v.G + 12, 186);
        m.pokeLayar(m.v.G + 26, 179);
      } },
    { baris: 2600, jalan: function (m) {
        m.v.G = m.v.G + 38;
        m.pokeLayar(m.v.G, 186); m.pokeLayar(m.v.G + 14, 179);
        m.pokeLayar(m.v.G + 32, 186);
      } },
    { baris: 2610, jalan: function (m) { m.lanjutkan('E'); } },
    { baris: 2620, jalan: function (m) {
        m.locate(16, 1); m.cetak(m.ulang(80, 205)); m.barisBaru();
      } },
    pokeDasar(2630, 2400, [[0, 200], [30, 202], [48, 202]]),
    pokeDasar(2640, 2462, [[0, 207], [12, 202], [26, 207]]),
    pokeDasar(2650, 2500, [[0, 202], [14, 207], [26, 202]]),
    pokeDasar(2660, 2540, [[0, 207], [18, 188]]),
    { baris: 2670, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    /* --- 2680-2860: rata-rata regu ---------------------------------------- */
    { baris: 2680, jalan: function (m) {
        m.v.AVG_[0] = 0; m.v.AVG_[1] = 0;
        m.v.OF[0] = 0; m.v.DF[0] = 0; m.v.OF[1] = 0; m.v.DF[1] = 0;
        m.v.TEAMAVG[0] = 0; m.v.TEAMAVG[1] = 0;
      } },
    { baris: 2690, jalan: function (m) { m.untuk('A', 0, 1, 1, 2860); } },
    { baris: 2700, jalan: function (m) { m.untuk('B', 0, 21, 1, 2830); } },
    /* 2710-2750 pembagi yang menyusut: tiap daur yang nilainya nol tidak
       ikut dihitung. Pemain tanpa tanggal lahir dapat rata-rata nol, bukan
       nol dibagi nol. */
    { baris: 2710, jalan: function (m) { m.v.DD = 3; } },
    tot(2720, 3, 'TOT1'), tot(2730, 5, 'TOT2'), tot(2740, 7, 'TOT3'),
    { baris: 2750, jalan: function (m) {
        if (m.v.DD === 0) { m.v.AVG = 0; m.lompat(2790); }
      } },
    { baris: 2760, jalan: function (m) {
        m.v.AVG = (m.v.TOT1 + m.v.TOT2 + m.v.TOT3) / m.v.DD;
      } },
    /* 2770 DI SINILAH bobot posisinya dipakai: rata-rata biorhythm dikalikan
       nilai posisi. Quarterback (5) menyumbang lima kali lipat penjaga garis
       (1). Seluruh "kecerdasan" ramalannya ada di baris ini. */
    { baris: 2770, jalan: function (m) {
        m.v.AVG = m.v.AVG * m.v.VALUE[m.v.B];
      } },
    { baris: 2780, jalan: function (m) {
        m.v.AVG_[m.v.A] = m.v.AVG_[m.v.A] + m.v.AVG;
      } },
    { baris: 2790, jalan: function (m) {
        m.v.Z_[m.v.B][8][m.v.A] = teks(m.v.AVG);
      } },
    { baris: 2800, jalan: function (m) {
        m.v.Z_[m.v.B][9][m.v.A] = teks(m.v.TOT1 + m.v.TOT2 + m.v.TOT3);
      } },
    { baris: 2810, jalan: function (m) {
        if (m.v.B < 11) m.v.OF[m.v.A] = m.v.OF[m.v.A] + m.v.AVG;
        else m.v.DF[m.v.A] = m.v.DF[m.v.A] + m.v.AVG;
      } },
    { baris: 2820, jalan: function (m) { m.lanjutkan('B'); } },
    /* 2830 SEPULUH ANGKA HADIAH untuk tuan rumah. Tidak ada satu kata pun di
       layar petunjuk yang menyebutkannya. */
    { baris: 2830, jalan: function (m) {
        if (m.v.A === 0) m.v.AVG_[m.v.A] = m.v.AVG_[m.v.A] + 10;
      } },
    { baris: 2840, jalan: function (m) {
        m.v.TEAMAVG[m.v.A] = m.v.AVG_[m.v.A] / 22;
        m.v.DF[m.v.A] = m.v.DF[m.v.A] / 11;
        m.v.OF[m.v.A] = m.v.OF[m.v.A] / 11;
      } },
    { baris: 2850, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2860, jalan: function (m) { m.kembali(); } },

    /* --- 2870-3000: dua tabel dari satu gelung ---------------------------- */
    { baris: 2870, jalan: function (m) { m.untuk('B', 0, 1, 1, 2920); } },
    { baris: 2880, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 23; m.v.A++) m.v.D[0][m.v.A][m.v.B] = m.baca();
      } },
    { baris: 2890, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 28; m.v.A++) m.v.D[1][m.v.A][m.v.B] = m.baca();
      } },
    { baris: 2900, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 33; m.v.A++) m.v.D[2][m.v.A][m.v.B] = m.baca();
      } },
    { baris: 2910, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 2920, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 21; m.v.A++) m.v.VALUE[m.v.A] = m.baca();
      } },
    /* 2930 `RESTORE 3090` memindahkan penunjuk DATA ke baris 3090 — awal
       daftar nama posisi. Di larik datar penelusur itu indeks 190: 84 angka
       putaran pertama, 84 putaran kedua, lalu 22 bobot posisi. */
    { baris: 2930, jalan: function (m) {
        m.ulangData(190);
        m.dim('Z_$', 22, 10, 1); m.v.Z_ = m.v['Z_$'];
      } },
    { baris: 2940, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 21; m.v.A++) {
          m.v.Z_[m.v.A][0][0] = m.baca();
          m.v.Z_[m.v.A][0][1] = m.v.Z_[m.v.A][0][0];
        }
      } },
    fasenama(2950, 0, 'crit'), fasenama(2960, 1, 'low '),
    fasenama(2970, 2, 'avg '), fasenama(2980, 3, 'high'),
    /* 2990 tabel lawan yang sama dengan MATCH.BAS: T(1)=0, T(0)=1. */
    { baris: 2990, jalan: function (m) { m.v.TURN[1] = 0; m.v.TURN[0] = 1; } },
    { baris: 3000, jalan: function (m) { m.kembali(); } },
    data(3010), data(3020), data(3030), data(3040), data(3050), data(3060),
    data(3070), data(3080), data(3090), data(3100), data(3110), data(3120),

    /* --- 3130-3200: F10 dan bilah status ---------------------------------- */
    { baris: 3130, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XX = m.barisKursor(); m.v.YYY = m.pos();
        m.locate(25, 1); m.spc(79); m.warna(15, null);
      } },
    { baris: 3140, jalan: function (m) {
        m.locate(25, 20);
        m.cetak('Do You Wish To Leave This Program? <Y/N>'); m.warna(3, 0);
      } },
    /* 3150 `IF ... THEN 3150:Z3=Z1` — apa pun sesudah THEN <nomor> di baris
       yang sama TIDAK PERNAH dijalankan. Jadi Z3 tidak pernah diisi di sini,
       dan baris 3200 memulihkan Z1 dari Z3 yang kosong. */
    { baris: 3150, jalan: function (m) { if (m.inkey() !== '') m.lompat(3150); } },
    { baris: 3160, jalan: function (m) { m.gosub(1430); } },
    { baris: 3170, jalan: function (m) {
        if (m.v.Z1 === '1') m.jalankan('MENU');
      } },
    { baris: 3180, jalan: function (m) { m.locate(25, 1); m.spc(79); } },
    { baris: 3190, jalan: function (m) {
        m.locate(25, 24); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave Program '); m.warna(3, 0);
      } },
    { baris: 3200, jalan: function (m) {
        m.locate(m.v.XX, m.v.YYY); m.jebakan(10, true);
        m.v.Z = ''; m.v.Z1 = m.v.Z3 || '';
        m.kembali();
      } },

    /* --- 3210-3450: simpan regu ke disket --------------------------------- */
    { baris: 3210, jalan: function (m) {
        if (m.v['TEAM$'][0] !== '' || m.v['TEAM$'][1] !== '') m.lompat(3250);
      } },
    { baris: 3220, jalan: function (m) { m.locate(20, 15, 0); m.warna(15, 0); } },
    { baris: 3230, jalan: function (m) {
        m.cetak('You Must Create Team Rosters Before You Can Save Them.');
        m.barisBaru();
      } },
    { baris: 3240, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 7000; m.v.A++) { /* jeda */ }
        m.warna(3, 0); m.kembali();
      } },
    { baris: 3250, jalan: function (m) {
        m.cls(); m.locate(2, 20);
        m.cetak('Which Team Do You Wish To Save?');
      } },
    { baris: 3260, jalan: function (m) { m.gosub(3980); } },
    { baris: 3270, jalan: function (m) {
        m.locate(3, 25);
        m.cetak(m.v['TEAM$'][0] + ' or ' + m.v['TEAM$'][1]); m.barisBaru();
      } },
    { baris: 3280, bagian: [
        function (m) { m.v.K9 = 0; m.locate(5, 30); },
        function (m) { m.gosub(4330); },
        function (m) { m.v.Z = m.v.ZA; }
      ] },
    { baris: 3290, jalan: function (m) {
        if (m.v.Z === m.v['TEAM$'][0]) { m.v.B = 0; m.lompat(3340); }
      } },
    { baris: 3300, jalan: function (m) {
        if (m.v.Z === m.v['TEAM$'][1]) { m.v.B = 1; m.lompat(3340); }
      } },
    { baris: 3310, jalan: function (m) { if (m.v.K9) m.lompat(3450); } },
    ajar(3320, 12, 20, 'Invalid Name, Please Try Again.'),
    { baris: 3330, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 2000; m.v.A++) { /* jeda */ }
        m.locate(12, 1); m.spc(79); m.barisBaru(); m.lompat(3250);
      } },
    { baris: 3340, jalan: function (m) { m.v.Z = m.v.Z + '.STS'; } },
    { baris: 3350, jalan: function (m) { m.v.FP = 0; } },
    { baris: 3360, jalan: function (m) {
        if (m.v.FP >= m.v.DISKET['NAME.FLE'].length) m.lompat(3390);
      } },
    { baris: 3370, jalan: function (m) {
        m.v.TEAMNAME = m.v.DISKET['NAME.FLE'][m.v.FP++];
      } },
    { baris: 3380, jalan: function (m) {
        m.lompat(m.v.TEAMNAME === m.v.Z ? 3410 : 3360);
      } },
    { baris: 3390, jalan: function (m) { if (m.v.K9) m.lompat(3450); } },
    { baris: 3400, jalan: function (m) { m.v.DISKET['NAME.FLE'].push(m.v.Z); } },
    { baris: 3410, jalan: function (m) {
        if (m.v.K9) { m.lompat(3450); return; }
        m.v.DISKET[m.v.Z] = [];
      } },
    { baris: 3420, jalan: function (m) { m.untuk('A', 0, 11, 11, 3450); } },
    { baris: 3430, jalan: function (m) {
        for (var i = 0; i <= 10; i++) {
          m.v.DISKET[m.v.Z].push(m.v.Z_[m.v.A + i][1][m.v.B]);
        }
      } },
    { baris: 3440, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 3450, jalan: function (m) { m.tutup(); m.kembali(); } },

    /* --- 3460-3700: muat regu dari disket --------------------------------- */
    { baris: 3460, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(3980); },
        function (m) { m.v.K9 = 0; }
      ] },
    { baris: 3470, jalan: function (m) {
        if (m.v.K9) m.lompat(3450); else m.v.FP = 0;
      } },
    { baris: 3480, jalan: function (m) {
        if (m.v.FP >= m.v.DISKET['NAME.FLE'].length) m.lompat(3510);
      } },
    { baris: 3490, jalan: function (m) {
        m.v.TEAMNAME = m.v.DISKET['NAME.FLE'][m.v.FP++];
      } },
    { baris: 3500, jalan: function (m) {
        m.locate(null, m.pos() + 12);
        m.cetak(m.v.TEAMNAME.slice(0, 8)); m.lompat(3480);
      } },
    { baris: 3510, jalan: function (m) {
        m.locate(20, 20); m.cetak('Which Team Do You Wish To Load?');
      } },
    { baris: 3520, bagian: [
        function (m) { m.v.K9 = 0; },
        function (m) { m.gosub(4330); },
        function (m) { m.v.Z = m.v.ZA; }
      ] },
    { baris: 3530, jalan: function (m) {
        if (m.v.K9) m.lompat(3450); else m.v.FP = 0;
      } },
    { baris: 3540, jalan: function (m) {
        if (m.v.FP >= m.v.DISKET['NAME.FLE'].length) m.lompat(3580);
      } },
    { baris: 3550, jalan: function (m) {
        m.v.TEAMNAME = m.v.DISKET['NAME.FLE'][m.v.FP++];
      } },
    { baris: 3560, jalan: function (m) {
        if (m.v.Z === m.v.TEAMNAME.slice(0, 8)) m.lompat(3610);
      } },
    { baris: 3570, jalan: function (m) { m.lompat(3540); } },
    { baris: 3580, jalan: function (m) {
        m.locate(20, 1); m.spc(79); m.barisBaru(); m.locate(20, 20);
      } },
    { baris: 3590, jalan: function (m) {
        m.cetak('Invalid Team Name, Please Try Again.'); m.barisBaru();
      } },
    { baris: 3600, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 2000; m.v.A++) { /* jeda */ }
        m.locate(20, 20); m.spc(79); m.barisBaru(); m.lompat(3510);
      } },
    { baris: 3610, jalan: function (m) {
        m.locate(20, 1); m.spc(78); m.barisBaru(); m.locate(20, 20);
      } },
    { baris: 3620, jalan: function (m) { m.v.K9 = 0; } },
    { baris: 3630, jalan: function (m) {
        if (m.v['TEAM$'][0] !== '' && m.v['TEAM$'][1] === '') {
          m.v['TEAM$'][1] = m.v.TEAMNAME.slice(0, 8); m.v.T = 1; m.lompat(3670);
        }
      } },
    { baris: 3640, jalan: function (m) {
        if (m.v['TEAM$'][1] !== '' && m.v['TEAM$'][0] === '') {
          m.v['TEAM$'][0] = m.v.TEAMNAME.slice(0, 8); m.v.T = 0; m.lompat(3670);
        }
      } },
    { baris: 3650, jalan: function (m) {
        m.cetak('Home Team or Visiting Team? <H/V>'); m.barisBaru();
      } },
    { baris: 3660, bagian: [
        function (m) { m.v.K9 = 0; },
        function (m) { m.gosub(3950); },
        function (m) { m.v['TEAM$'][m.v.T] = m.v.TEAMNAME.slice(0, 8); }
      ] },
    { baris: 3670, jalan: function (m) {
        if (m.v.K9) { m.lompat(3450); return; }
        var isi = m.v.DISKET[m.v.TEAMNAME];
        if (!isi) { m.galat(53, 'File not found: ' + m.v.TEAMNAME); return; }
        m.v.FP = 0;
      } },
    { baris: 3680, jalan: function (m) { m.untuk('A', 0, 11, 11, 3700); } },
    { baris: 3690, jalan: function (m) {
        for (var i = 0; i <= 10; i++) {
          m.v.Z_[m.v.A + i][1][m.v.T] = m.v.DISKET[m.v.TEAMNAME][m.v.FP++] || '';
        }
      } },
    { baris: 3700, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.tutup(); m.kembali(); }
      ] },

    /* --- 3710-3940: hapus regu -------------------------------------------- */
    { baris: 3710, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(3980); }
      ] },
    { baris: 3720, jalan: function (m) {
        m.v.K9 = 0; m.v.A = 0; m.v.FP = 0;
      } },
    { baris: 3730, jalan: function (m) {
        m.dim('TEAMNAME_$', 30); m.v.TEAMNAME_ = m.v['TEAMNAME_$'];
      } },
    { baris: 3740, jalan: function (m) {
        if (m.v.FP >= m.v.DISKET['NAME.FLE'].length) m.lompat(3780);
      } },
    { baris: 3750, jalan: function (m) { m.v.A = m.v.A + 1; } },
    { baris: 3760, jalan: function (m) {
        m.v.TEAMNAME_[m.v.A] = m.v.DISKET['NAME.FLE'][m.v.FP++];
      } },
    { baris: 3770, jalan: function (m) {
        m.locate(null, m.pos() + 12);
        m.cetak(m.v.TEAMNAME_[m.v.A].slice(0, 8)); m.lompat(3740);
      } },
    { baris: 3780, jalan: function (m) {
        m.locate(20, 20); m.cetak('Which Team Do You Wish To Erase?');
      } },
    { baris: 3790, jalan: function (m) { m.v.K9 = 0; } },
    { baris: 3800, bagian: [
        function (m) { m.gosub(4330); },
        function (m) { m.v.Z1 = m.v.ZA + '.STS'; }
      ] },
    { baris: 3810, jalan: function (m) { if (m.v.K9) m.lompat(3450); } },
    { baris: 3820, jalan: function (m) { m.untuk('B', 1, m.v.A, 1, 3850); } },
    { baris: 3830, jalan: function (m) {
        if (m.v.Z1 === m.v.TEAMNAME_[m.v.B]) m.lompat(3880);
      } },
    { baris: 3840, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 3850, jalan: function (m) {
        m.locate(20, 1); m.spc(79); m.barisBaru(); m.locate(20, 20);
      } },
    { baris: 3860, jalan: function (m) {
        m.cetak('Invalid File Name, Please Try Again.'); m.barisBaru();
      } },
    { baris: 3870, jalan: function (m) {
        for (m.v.B = 1; m.v.B <= 2000; m.v.B++) { /* jeda */ }
        m.locate(20, 1); m.spc(79); m.barisBaru(); m.lompat(3780);
      } },
    { baris: 3880, jalan: function (m) {
        delete m.v.DISKET[m.v.TEAMNAME_[m.v.B]];
      } },
    { baris: 3890, jalan: function (m) { m.v.TEAMNAME_[m.v.B] = ''; } },
    { baris: 3900, jalan: function (m) { m.v.A = 0; } },
    { baris: 3910, jalan: function (m) { m.v.DISKET['NAME.FLE'] = []; } },
    { baris: 3920, jalan: function (m) { m.untuk('A', 1, 30, 1, 3940); } },
    { baris: 3930, jalan: function (m) {
        if (m.v.TEAMNAME_[m.v.A] !== '') {
          m.v.DISKET['NAME.FLE'].push(m.v.TEAMNAME_[m.v.A]);
        }
      } },
    { baris: 3940, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.tutup(); m.kembali(); }
      ] },

    { baris: 3950, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3950);
      } },
    { baris: 3960, jalan: function (m) {
        if (m.v.Z === 'H' || m.v.Z === 'h') { m.v.T = 0; m.kembali(); }
      } },
    { baris: 3970, jalan: function (m) {
        if (m.v.Z === 'V' || m.v.Z === 'v') { m.v.T = 1; m.kembali(); }
        else m.lompat(3950);
      } },
    { baris: 3980, jalan: function (m) {
        m.jebakan(9, true); m.locate(24, 20); m.warna(0, 3);
      } },
    { baris: 3990, jalan: function (m) {
        m.cetak(' Strike <F9> To Return To Sports Menu '); m.warna(3, 0);
      } },
    /* 4000 `GOTO 3180` — masuk ke tengah rutin bilah status, lalu
       RETURN-nya di baris 3200 memulangkan alur ke pemanggil 3980. */
    { baris: 4000, jalan: function (m) {
        m.v.XX = 1; m.v.YYY = 1; m.lompat(3180);
      } },
    /* 4010 jebakan F9: `RETURN 4020` — pulang ke baris tertentu, bukan ke
       tempat jebakannya terpicu. Itu yang membatalkan operasi disket yang
       sedang berjalan. */
    { baris: 4010, jalan: function (m) { m.jebakan(9, false); m.kembali(4020); } },
    { baris: 4020, jalan: function (m) { m.v.K9 = 1; m.tutup(); m.kembali(); } },

    /* --- 4030-4320: satu penangan galat untuk sebelas keadaan ------------- */
    { baris: 4030, jalan: function (m) {
        m.v.XX = m.barisKursor(); m.v.YYY = m.pos();
        m.locate(22, 1, 0); m.spc(79); m.warna(14, 0);
      } },
    /* 4040 `IF ERR=53 AND ERL=3670 OR ERL=3880` — DAN diproses sebelum ATAU,
       jadi syaratnya sebenarnya "(ERR=53 dan ERL=3670) atau ERL=3880". Galat
       APA PUN di baris 3880 masuk ke sini. */
    { baris: 4040, jalan: function (m) {
        if ((m.err === 53 && m.erl === 3670) || m.erl === 3880) m.lompat(4180);
      } },
    galatKe(4050, 61, 4200), galatKe(4060, 67, 4210),
    galatKe(4070, 70, 4220), galatKe(4080, 71, 4230),
    galatKe(4090, 72, 4240),
    { baris: 4100, jalan: function (m) {
        if (m.err === 53 && m.erl === 3170) m.lompat(4160);
      } },
    { baris: 4110, jalan: function (m) {
        if (m.err === 53 && (m.erl === 30 || m.erl === 100)) {
          m.v.F = 1;
          m.lanjut(m.erl === 30 ? 40 : 110);
        }
      } },
    galatKe(4120, 53, 4190), galatKe(4130, 52, 4170),
    { baris: 4140, jalan: function (m) { m.penangkapGalat = 0; } },
    { baris: 4150, jalan: function (m) { m.henti('END di baris 4150'); } },
    pesanGalat(4160, 21, 22, 'Insert A FriendlyWare Diskette And', 4260),
    pesanGalat(4170, 21, 35, 'Bad File Name. ', 4260),
    pesanGalat(4180, 21, 22, 'Insert Diskette With Team File And', 4260),
    pesanGalat(4190, 21, 23, 'Insert Diskette With NAME.FLE And', 4260),
    pesanGalat(4200, 21, 34, 'Diskette Is Full.', 4250),
    pesanGalat(4210, 21, 27, 'Diskette Has Too Many Files.', 4250),
    pesanGalat(4220, 21, 27, 'Diskette Is Write Protected.', 4250),
    pesanGalat(4230, 21, 20, 'Disk Cover Is Open. Close Cover And', 4260),
    pesanGalat(4240, 21, 29, 'Diskette Read Error.', 4250),
    ajar(4250, 22, 27, 'Insert New Diskette And'),
    ajar(4260, 23, 26, 'Strike Any Key To Continue'),
    { baris: 4270, jalan: function () { } },
    { baris: 4280, jalan: function (m) { if (m.inkey() !== '') m.lompat(4280); } },
    { baris: 4290, jalan: function (m) {
        m.v.ZZ = m.inkey();
        if (m.v.ZZ === '') m.lompat(4290);
      } },
    { baris: 4300, jalan: function (m) {
        for (m.v.AC = 21; m.v.AC <= 23; m.v.AC++) {
          m.locate(m.v.AC, 1); m.spc(79);
        }
      } },
    { baris: 4310, jalan: function (m) { if (m.erl === 3410) m.lanjut(3450); } },
    { baris: 4320, jalan: function (m) {
        m.locate(m.v.XX, m.v.YYY, 1); m.warna(3, 0); m.lanjut();
      } },

    /* --- 4330-4480: penyunting nama, dengan MID$ sebagai sasaran ---------- */
    { baris: 4330, jalan: function (m) { if (m.inkey() !== '') m.lompat(4330); } },
    { baris: 4340, jalan: function (m) {
        m.v.ZH = ''; m.v.ZI = ''; m.v.ZA = '';
        m.locate(null, m.pos() + 1);
      } },
    { baris: 4350, jalan: function (m) {
        m.v.ZI = m.inkey();
        if (m.v.ZI === '') m.lompat(4350);
      } },
    { baris: 4360, jalan: function (m) {
        if (m.v.ZI === m.chr(13)) {
          m.v.ZA = (m.v.ZH + '        ').slice(0, 8);
          m.lompat(4450);
        }
      } },
    { baris: 4370, jalan: function (m) { if (m.v.ZI === m.chr(8)) m.lompat(4430); } },
    { baris: 4380, jalan: function (m) {
        if (m.v.ZI.length > 1) {
          m.lompat(m.v.ZI.slice(-1) === m.chr(75) ? 4430 : 4350);
        }
      } },
    { baris: 4390, jalan: function (m) { if (m.v.ZH.length > 7) m.lompat(4350); } },
    { baris: 4400, jalan: function (m) {
        if (m.v.ZI < 'a' || m.v.ZI > 'z') m.lompat(4420);
      } },
    { baris: 4410, jalan: function (m) {
        m.v.ZI = m.chr(m.v.ZI.charCodeAt(0) - 32);
      } },
    { baris: 4420, jalan: function (m) {
        m.v.ZH = m.v.ZH + m.v.ZI; m.cetak(m.v.ZI); m.lompat(4350);
      } },
    { baris: 4430, jalan: function (m) { if (m.v.ZH.length < 1) m.lompat(4350); } },
    { baris: 4440, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.ZH = m.v.ZH.slice(0, m.v.ZH.length - 1);
        m.lompat(4350);
      } },
    /* 4450-4480 huruf kecil dinaikkan LAGI, padahal baris 4410 sudah
       melakukannya untuk tiap tombol. Pengaman berlapis untuk keadaan yang
       tidak mungkin terjadi. */
    { baris: 4450, jalan: function (m) { m.untuk('A', 1, 8, 1, 4480); } },
    { baris: 4460, jalan: function (m) {
        var c = m.v.ZA.charAt(m.v.A - 1);
        if (c < 'a' || c > 'z') m.lompat(4480);
      } },
    { baris: 4470, jalan: function (m) {
        var i = m.v.A - 1, c = m.v.ZA.charAt(i);
        m.v.ZA = m.v.ZA.slice(0, i) + m.chr(c.charCodeAt(0) - 32) +
                 m.v.ZA.slice(i + 1);
      } },
    { baris: 4480, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.kembali(); }
      ] },
    { baris: 4490, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function data(nomor) { return { baris: nomor, jalan: function () { } }; }
  function nilai(z) { return parseFloat(z) || 0; }
  function teks(n) { return (n < 0 ? '' : ' ') + String(Math.round(n * 1e6) / 1e6); }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function pilihan(nomor, b, huruf, isi) {
    return { baris: nomor, jalan: function (m) {
      if (b !== null) m.locate(b, 26); else m.locate(null, 26);
      m.warna(15, null); m.cetak(huruf);
      m.warna(3, null); m.cetak(isi); m.barisBaru();
    } };
  }

  /* Satu baris menu. Syaratnya dinilai SEKALI di penggal pertama: subrutin
     yang dipanggil sesudahnya menimpa `Z` dengan tombol yang dibacanya
     sendiri, jadi menguji ulang di tiap penggal akan gagal. */
  function menu(nomor, huruf, tujuan) {
    var ya = false;
    var bagian = [function (m) {
      ya = (m.v.Z === huruf || m.v.Z === huruf.toLowerCase());
      if (ya) m.gosub(tujuan[0]);
    }];
    for (var i = 1; i < tujuan.length; i++) {
      bagian.push((function (t) {
        return function (m) { if (ya) m.gosub(t); };
      })(tujuan[i]));
    }
    bagian.push(function (m) { if (ya) m.lompat(270); });
    return { baris: nomor, bagian: bagian };
  }

  function bacaTombol(nomor, ulang) {
    return { baris: nomor, jalan: function (m) {
      m.v.Z = m.inkey();
      if (m.v.Z === '') m.lompat(ulang);
    } };
  }

  function panah(nomor, keKiri, keUlang) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.Z.length > 1) {
        m.lompat(m.v.Z.slice(-1) === m.chr(75) ? keKiri : keUlang);
      }
    } };
  }

  /* Empat aksara berbeda diterima sebagai pemisah tanggal: titik, spasi,
     garis miring, dan tanda hubung. */
  function pemisah(nomor, tujuan) {
    return { baris: nomor, jalan: function (m) {
      var z = m.v.Z;
      if (z === '.' || z === ' ' || z === '/' || z === '-') m.lompat(tujuan);
    } };
  }

  function angkaSaja(nomor, ulang) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.Z < '0' || m.v.Z > '9') m.lompat(ulang);
    } };
  }

  /* `W=FNX(v)` — fungsi buatan sendiri di baris 220, yaitu sisa bagi plus
     satu. Dipanggil tiga kali dengan tiga panjang daur. */
  function fnx(nomor, panjang) {
    return { baris: nomor, jalan: function (m) {
      m.v.W = Math.trunc(m.v.DIFF - Math.floor(m.v.DIFF / panjang) * panjang) + 1;
    } };
  }

  /* Hari keberapa dalam daurnya disimpan, lalu poinnya dicari di tabel D. */
  function simpanDaur(nomor, kolomFase, kolomPoin, indeks) {
    return { baris: nomor, jalan: function (m) {
      m.v.Z_[m.v.B][kolomFase][m.v.T] = teks(m.v.W);
      m.v.Z_[m.v.B][kolomPoin][m.v.T] = teks(m.v.D[indeks][m.v.W][0]);
    } };
  }

  function fase(nomor, kolom, indeks, sumber) {
    return { baris: nomor, jalan: function (m) {
      m.locate(null, kolom);
      m.cetak(m.v.ZZ_[m.v.D[indeks][nilai(m.v.Z_[m.v.B][sumber][m.v.A])][1]] || '');
    } };
  }

  function poin(nomor, kolom, sumber) {
    return { baris: nomor, jalan: function (m) {
      m.locate(null, kolom);
      m.cetakFormat('#.#', nilai(m.v.Z_[m.v.B][sumber][m.v.A]));
    } };
  }

  function total(nomor, baris, regu) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 26); m.cetak(medan(m.v['TEAM$'][regu], 8));
      m.cetak(' Team Evaluation Is');
      m.cetakFormat(' ####.##', m.v.TEAMAVG[regu] * 100);
      m.barisBaru();
    } };
  }

  function tot(nomor, sumber, nama) {
    return { baris: nomor, jalan: function (m) {
      m.v[nama] = nilai(m.v.Z_[m.v.B][sumber][m.v.A]);
      if (m.v[nama] === 0) m.v.DD = m.v.DD - 1;
    } };
  }

  function fasenama(nomor, n, nama) {
    return { baris: nomor, jalan: function (m) { m.v.ZZ_[n] = nama; } };
  }

  function pokeKisi(nomor, pasangan) {
    return { baris: nomor, jalan: function (m) {
      for (var i = 0; i < pasangan.length; i++) {
        m.pokeLayar(pasangan[i][0], pasangan[i][1]);
      }
    } };
  }

  function pokeDasar(nomor, dasar, pasangan) {
    return { baris: nomor, jalan: function (m) {
      m.v.E = dasar;
      for (var i = 0; i < pasangan.length; i++) {
        m.pokeLayar(dasar + pasangan[i][0], pasangan[i][1]);
      }
    } };
  }

  function galatKe(nomor, kode, tujuan) {
    return { baris: nomor, jalan: function (m) {
      if (m.err === kode) m.lompat(tujuan);
    } };
  }

  function pesanGalat(nomor, b, k, isi, tujuan) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru(); m.lompat(tujuan);
    } };
  }

  /* `PRINT USING "\    \"` — medan string berlebar tetap. */
  function medan(s, lebar) {
    s = String(s === undefined ? '' : s);
    while (s.length < lebar) s += ' ';
    return s.slice(0, lebar);
  }

  /* `FILES "menu.bas"` — sama seperti DRAW.BAS: panggilan pertama menemukan
     berkasnya (disket program), panggilan kedua tidak (pemakai menukar ke
     disket data). */
  function ujiDisket(m) {
    m.v.TUKAR = (m.v.TUKAR || 0) + 1;
    if (m.v.TUKAR > 1) m.galat(53, 'File not found: MENU.BAS');
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['STATS'] = {
    nama: 'STATS',
    judul: 'Biorhythm Sports Predicting',
    sumber: 'STATS',
    berkas: 'run/STATS.BAS',
    tabel: tabel,
    data: [
      /* D(0,*,0) daur fisik 23 hari — poin */
      2, 3, 4.5, 6, 7.5, 7.5, 7.5, 6, 4.5, 3, 2, 0, 1, 2, 3, 4, 5, 5, 5, 4, 3, 2, 0,
      /* D(1,*,0) daur emosi 28 hari */
      2, 2, 3, 4.5, 4.5, 6, 7.5, 7.5, 7.5, 6, 4.5, 4.5, 3, 2, 0, 1, 2, 3, 3, 4, 5, 5, 5, 4, 3, 2, 1, 0,
      /* D(2,*,0) daur nalar 33 hari */
      2, 2, 3, 3, 4.5, 4.5, 6, 7.5, 7.5, 7.5, 6, 4.5, 4.5, 3, 3, 2, 0, 1, 2, 2, 3, 3, 4, 5, 5, 5, 4, 3,
      /* 3040: lima angka sisa daur nalar */
      3, 4, 4, 1, 0,
      /* D(0..2,*,1) nomor nama fase: 0 crit, 1 low, 2 avg, 3 high */
      1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 0, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 0,
      1, 1, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 0,
      1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 1, 0,
      /* VALUE(0..21) bobot posisi */
      5, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 1, 1, 1, 1, 3,
      /* 3090-3120 nama posisi */
      'QUARTERBACK', 'HALFBACK', 'FULLBACK', 'WIDE RECIEVER', 'TIGHT END', 'SPLIT END',
      'CENTER', 'R.TACKLE', 'R.GUARD', 'L.TACKLE', 'L.GUARD',
      'M.LINEBACKER', 'R.LINEBACKER', 'L.LINEBACKER', 'LINEBACK/LINE', 'R.CORNERBACK',
      'L.CORNERBACK', 'DEF.LINEMAN', 'DEF.LINEMAN', 'DEF.LINEMAN', 'STRONG SAFETY', 'FREE SAFETY'
    ],

    arsitektur: {
      judul: 'Alur STATS.BAS',
      simpul: [
        { id: 'disket', baris: '30-140', jenis: 'putusan',
          teks: ['Uji disket data:', 'MENU.BAS ketemu = SALAH'] },
        { id: 'tabel', baris: '2870-3000',
          teks: ['Baca 84 angka DUA KALI:', 'poin, lalu nama fase'] },
        { id: 'menu', baris: '270-500', jenis: 'putusan',
          teks: ['Enam pilihan: isi, nilai,', 'ubah, simpan, muat, hapus'] },
        { id: 'roster', baris: '750-1030',
          teks: ['Nama regu, lalu 22', 'tanggal lahir'] },
        { id: 'tanggal', baris: '1040-1470', jenis: 'subrutin',
          teks: ['Penyunting tanggal:', 'bulan, hari, tahun'] },
        { id: 'julian', baris: '1480-1770',
          teks: ['Hari Julian, lalu tiga daur:', '23, 28, dan 33 hari'] },
        { id: 'bobot', baris: '2680-2860',
          teks: ['Kalikan bobot posisi,', 'jumlahkan per unit'] },
        { id: 'hasil', baris: '2090-2670',
          teks: ['Tabel per pemain,', 'rata-rata serang dan tahan'] },
        { id: 'berkas', baris: '3210-3940', jenis: 'subrutin',
          teks: ['Simpan, muat, hapus regu', 'lewat NAME.FLE'] },
        { id: 'galat', baris: '4030-4320', jenis: 'galat',
          teks: ['Sebelas keadaan disket,', 'satu penangan'] }
      ],
      panah: [
        { dari: 'disket', ke: 'tabel' },
        { dari: 'tabel', ke: 'menu' },
        { dari: 'menu', ke: 'roster', label: 'A' },
        { dari: 'roster', ke: 'tanggal' },
        { dari: 'tanggal', ke: 'roster', label: 'pemain berikutnya' },
        { dari: 'roster', ke: 'menu' },
        { dari: 'menu', ke: 'julian', label: 'B' },
        { dari: 'julian', ke: 'bobot' },
        { dari: 'bobot', ke: 'hasil' },
        { dari: 'hasil', ke: 'menu' },
        { dari: 'menu', ke: 'berkas', label: 'D / E / F' },
        { dari: 'berkas', ke: 'galat', label: 'disket bermasalah', jenis: 'galat' },
        { dari: 'galat', ke: 'berkas', label: 'RESUME', jenis: 'galat' },
        { dari: 'berkas', ke: 'menu' }
      ]
    },

    pseudokode: [
      { baris: 2880, tingkat: 0, teks: 'baca tabel daur <b>dua kali</b>: putaran 1 poinnya, putaran 2 nomor nama fasenya' },
      { baris: 2920, tingkat: 0, teks: 'baca 22 <b>bobot posisi</b>: quarterback 5, penjaga garis 1' },
      { baris: 270, tingkat: 0, teks: '<b>ULANG:</b> menu enam pilihan' },
      { baris: 930, tingkat: 1, teks: 'A: nama regu, lalu 22 tanggal lahir' },
      { baris: 1710, tingkat: 1, teks: 'B: ubah tiap tanggal jadi <b>hari Julian</b>' },
      { baris: 1610, tingkat: 2, teks: '<code>DIFF</code> = selisih hari sampai hari pertandingan' },
      { baris: 1620, tingkat: 2, teks: '<code>FNX(23)</code>, <code>FNX(28)</code>, <code>FNX(33)</code> &mdash; hari keberapa dalam tiap daur' },
      { baris: 2760, tingkat: 2, teks: 'rata-rata tiga daur; <b>daur yang nol tidak ikut membagi</b>' },
      { baris: 2770, tingkat: 2, teks: '&times; bobot posisinya' },
      { baris: 2810, tingkat: 2, teks: 'pemain 0&ndash;10 masuk serangan, 11&ndash;21 masuk pertahanan' },
      { baris: 2830, tingkat: 2, teks: '<b>tuan rumah dapat tambahan 10</b> &mdash; tidak disebut di petunjuk mana pun' },
      { baris: 2090, tingkat: 1, teks: 'tabel hasil: fase, poin, dan rata-rata tiap pemain' },
      { baris: 3210, tingkat: 1, teks: 'D/E/F: simpan, muat, hapus regu lewat <code>NAME.FLE</code>' }
    ],

    perintahAsli: 'run\\STATS.bat',
    catatanAsli: 'Program ini menulis ke disket. Di DOSBox-X ia akan membuat ' +
      'NAME.FLE dan berkas .STS di folder run/ &mdash; jalankan hanya kalau ' +
      'itu memang diinginkan.',

    penyimpangan: [
      '<b>Empat larik diganti namanya</b> karena punya kembaran skalar: ' +
      '<code>Z()</code> jadi <code>Z_</code>, <code>ZZ()</code> jadi ' +
      '<code>ZZ_</code>, <code>AVG!()</code> jadi <code>AVG_</code>, ' +
      '<code>TEAMNAME$()</code> jadi <code>TEAMNAME_</code>.',

      '<b>Disketnya cuma ada di memori.</b> Regu yang disimpan bisa dimuat ' +
      'lagi dalam sesi yang sama, tapi hilang begitu halaman disegarkan. ' +
      'Sama seperti DRAW.BAS.',

      '<b>Uji disket data di baris 30-140 dijawab seperti DRAW.BAS:</b> ' +
      'panggilan pertama menemukan MENU.BAS, panggilan kedua tidak &mdash; ' +
      'seolah pemakainya benar-benar menukar disket.',

      '<b><code>COLOR 31</code> di baris 120 tidak berkedip.</b>',

      '<b>Gelung tunda habis seketika</b>, termasuk yang 10.000 putaran di ' +
      'baris 550 dan 890.'
    ],

    pelajaran: {
      ringkas: 'Meramal pertandingan dari tanggal lahir dua puluh dua pemain. ' +
        'Yang layak dipelajari: fungsi buatan sendiri, dua tabel yang dibaca ' +
        'dengan satu gelung, dan bobot posisi yang menentukan segalanya.',
      pelajari: [
        ['Fungsi buatan sendiri',
         'Baris 220: <code>DEF FNX(V)=FIX(DIFF-(INT(DIFF/V))*V)+1</code>. Itu ' +
         '"sisa bagi", ditulis tangan &mdash; dan dipanggil tiga kali dengan ' +
         'tiga panjang daur berbeda (23, 28, 33). <code>DEF FN</code> adalah ' +
         'satu-satunya cara BASIC lama membuat fungsi, dan program ini ' +
         'satu-satunya di koleksi yang memakainya.'],
        ['Dua tabel dari satu gelung',
         'Baris 2870-2910 membaca 84 angka <b>dua kali</b> &mdash; ' +
         '<code>FOR B=0 TO 1</code> di luar. Putaran pertama mengisi ' +
         '<code>D(daur, hari, 0)</code> dengan <b>poinnya</b>; putaran kedua ' +
         'mengisi <code>D(daur, hari, 1)</code> dengan <b>nomor nama ' +
         'fasenya</b> (crit, low, avg, high). Satu gelung, dua arti, ' +
         'dibedakan cuma oleh indeks ketiga.'],
        ['Pembagi yang menyusut',
         'Baris 2710-2760: <code>DD</code> mulai dari 3, dan tiap daur yang ' +
         'nilainya nol menguranginya. Pemain tanpa tanggal lahir dapat ' +
         'rata-rata nol, bukan <b>nol dibagi nol</b>. Penjagaan pembagian ' +
         'yang ditulis sebagai pencacah, bukan sebagai <code>IF</code>.'],
        ['Nomor pemain sebagai unit',
         'Baris 2810: <code>IF B&lt;11 THEN OF(A)=... ELSE DF(A)=...</code>. ' +
         'Pemain 0-10 adalah serangan, 11-21 pertahanan &mdash; dan itu ' +
         'ditentukan sepenuhnya oleh <b>urutan nama posisi di DATA</b> baris ' +
         '3090-3120. Menukar urutannya akan menukar unitnya.'],
        ['RETURN ke tempat lain untuk membatalkan',
         'Baris 4010: jebakan F9 melakukan <code>RETURN 4020</code> &mdash; ' +
         'pulang ke baris tertentu, bukan ke tempat jebakannya terpicu. Baris ' +
         '4020 memasang <code>K9=1</code>, dan tiap langkah operasi disket ' +
         'memeriksanya. Cara membatalkan operasi panjang di bahasa yang tidak ' +
         'punya pengecualian.']
      ],
      hindari: [
        ['DAN dan ATAU tanpa tanda kurung',
         'Baris 4040: <code>IF ERR=53 AND ERL=3670 OR ERL=3880</code>. ' +
         '<code>AND</code> lebih erat daripada <code>OR</code>, jadi ' +
         'syaratnya sebenarnya <b>"(ERR=53 dan ERL=3670) atau ERL=3880"</b> ' +
         '&mdash; galat <b>apa pun</b> di baris 3880 masuk ke sini.'],
        ['Kode sesudah THEN nomor-baris',
         'Baris 3150: <code>IF INKEY$&lt;&gt;"" THEN 3150:Z3=Z1</code>. Apa ' +
         'pun sesudah <code>THEN &lt;nomor&gt;</code> tidak pernah ' +
         'dijalankan. Jadi <code>Z3</code> tidak pernah diisi, dan baris 3200 ' +
         'memulihkan <code>Z1</code> dari sesuatu yang kosong.'],
        ['Pengaman berlapis untuk keadaan yang mustahil',
         'Baris 4400-4410 menaikkan tiap huruf kecil <b>saat diketik</b>. ' +
         'Baris 4450-4480 menaikkannya <b>lagi</b> sesudah selesai. Yang ' +
         'kedua tidak mungkin menemukan apa pun untuk dinaikkan.'],
        ['Tanggal yang tidak diperiksa kewajarannya',
         'Bulan diuji 1-12 (baris 1140), hari 1-31 (1250), tahun 1-99 (1380). ' +
         'Tidak ada yang menguji apakah harinya <b>ada</b> di bulan itu &mdash; ' +
         '31 Februari diterima, dan hari Juliannya dihitung tanpa mengeluh.'],
        ['Bonus tersembunyi',
         'Baris 2830 menambahkan <b>10</b> ke rata-rata tuan rumah. Tidak ada ' +
         'satu kata pun di layar petunjuk yang menyebutkannya, dan hasilnya ' +
         'terlihat seolah perhitungan biorhythm yang menentukan.']
      ]
    },

    penjelasan: [
      { judul: 'Satu fungsi, tiga daur',
        isi: [
          'Teori biorhythm mengandaikan tiga daur yang mulai bersamaan di hari ' +
          'kelahiran: fisik 23 hari, emosi 28 hari, nalar 33 hari.',
          'Yang perlu dihitung: hari keberapa dalam daur itu seseorang berada ' +
          'pada hari pertandingan. Itu sisa bagi &mdash; dan BASIC lama tidak ' +
          'punya <code>MOD</code> yang enak dipakai untuk bilangan besar.',
          'Baris 220:',
          '<code>DEF FNX(V) = FIX(DIFF-(INT(DIFF/V))*V)+1</code>',
          '<code>DIFF</code> adalah selisih hari; <code>V</code> panjang ' +
          'daurnya. Bagi, buang pecahannya, kalikan kembali, kurangkan &mdash; ' +
          'sisanya. Tambah satu supaya jadi 1 sampai V, bukan 0 sampai V-1, ' +
          'karena lariknya diindeks dari 1.',
          'Lalu baris 1620-1670 memanggilnya tiga kali:',
          '<code>W=FNX(23)</code> &hellip; <code>W=FNX(28)</code> &hellip; ' +
          '<code>W=FNX(33)</code>',
          '<code>DEF FN</code> adalah satu-satunya cara membuat fungsi di ' +
          'BASIC lama: satu baris, satu ungkapan, dan ia mengambil variabel ' +
          'global (<code>DIFF</code>) langsung dari sekitarnya. Ini ' +
          '<b>satu-satunya program di koleksi ini yang memakainya.</b>'
        ] },
      { judul: 'Dua tabel yang dibaca dengan gelung yang sama',
        isi: [
          'Tiap hari dalam daur perlu dua hal: <b>berapa poinnya</b> dan ' +
          '<b>apa nama fasenya</b> (crit, low, avg, high).',
          'Cara program ini menyimpannya, baris 2870-2910:',
          '<code>FOR B=0 TO 1</code><br>' +
          '<code>&nbsp;FOR A=1 TO 23:READ D(0,A,B):NEXT</code><br>' +
          '<code>&nbsp;FOR A=1 TO 28:READ D(1,A,B):NEXT</code><br>' +
          '<code>&nbsp;FOR A=1 TO 33:READ D(2,A,B):NEXT</code><br>' +
          '<code>NEXT</code>',
          'Gelung yang persis sama, dijalankan dua kali. Putaran pertama ' +
          '(<code>B=0</code>) membaca DATA baris 3010-3040 &mdash; angka ' +
          'poinnya, 0 sampai 7,5. Putaran kedua (<code>B=1</code>) membaca ' +
          'DATA baris 3050-3070 &mdash; angka 0 sampai 3, nomor nama fasenya.',
          '<b>Indeks ketiga lariknya yang membedakan arti.</b> ' +
          '<code>D(0,W,0)</code> adalah poin daur fisik di hari ke-W; ' +
          '<code>D(0,W,1)</code> adalah nomor nama fasenya.',
          'Dan baris 2160 memakai keduanya sekaligus: ' +
          '<code>ZZ(D(0,VAL(Z(B,2,A)),1))</code> &mdash; ambil nomor hari dari ' +
          'Z, cari nomor fasenya di D, lalu cari namanya di ZZ. Tiga tingkat ' +
          'pencarian tabel dalam satu ungkapan.',
          'Harganya jelas: baris itu hampir mustahil dibaca. Untungnya juga ' +
          'jelas: menambah tabel keempat berarti menambah satu putaran gelung, ' +
          'bukan menulis ulang kodenya.'
        ] },
      { judul: 'Dua puluh dua angka yang jadi seluruh ramalannya',
        isi: [
          'Sesudah biorhythm tiap pemain dihitung, apa yang membuat satu regu ' +
          'lebih baik dari yang lain?',
          'Baris 2770:',
          '<code>AVG! = AVG! * VALUE(B)</code>',
          'Rata-rata biorhythm pemain dikalikan <b>bobot posisinya</b>. Dan ' +
          'bobotnya, dari DATA baris 3080:',
          '<code>5,3,2,2,2,2,1,1,1,1,1,4,2,2,2,2,2,1,1,1,1,3</code>',
          'Quarterback <b>5</b>. Halfback 3. Middle linebacker <b>4</b>. Free ' +
          'safety 3. Dan sebelas pemain garis &mdash; center, tackle, guard, ' +
          'defensive lineman &mdash; semuanya <b>1</b>.',
          'Jadi biorhythm quarterback yang sedang buruk menyeret nilai regunya ' +
          'lima kali lebih jauh daripada biorhythm penjaga garis. Seluruh ' +
          '"kecerdasan" ramalannya ada di dua puluh dua angka itu, dan ' +
          'mengubah pendapatnya tentang sepak bola berarti mengetik ulang satu ' +
          'baris DATA.',
          'Ada satu angka lagi yang tidak masuk hitungan biorhythm sama ' +
          'sekali, baris 2830:',
          '<code>IF A=0 THEN AVG!(A)=AVG!(A)+10</code>',
          'Regu nomor 0 adalah tuan rumah, dan ia dapat tambahan sepuluh. ' +
          '<b>Keuntungan bermain di kandang</b> &mdash; masuk akal sebagai ' +
          'model, tapi tidak disebut di satu kata pun layar petunjuk, dan ' +
          'hasilnya di layar tampil seolah seluruhnya perhitungan biorhythm.'
        ] }
    ]
  };
})(window);
