/* ===========================================================================
   BIO.js — porting minimalis BIO.BAS sebagai tabel baris.

   Program kesepuluh, dan yang pertama benar-benar berhitung. Tiga hal di
   dalamnya layak dipelajari:

   1. NOMOR HARI JULIAN. Baris 490-550 mengubah tanggal jadi satu bilangan
      bulat; baris 830-900 mengubahnya kembali. Di antara keduanya, "berapa
      hari dari lahir sampai hari ini" cuma satu pengurangan. Tidak ada
      kalender, tidak ada tahun kabisat yang perlu diurus. Rumus yang sama
      masih dipakai astronomi hari ini.

   2. GRAFIK DENGAN BEDAH STRING. Tidak ada mode grafis dipakai. Tiap baris
      grafik adalah satu string 71 karakter, dan menaruh titik berarti
      MEMBELAH string lalu menyambungnya lagi:
          E = LEFT$(E, W-1) + C + RIGHT$(E, 71-W)
      Layar teks sebagai kanvas.

   3. `RETURN <baris>` DI BARIS 1680. Bukan pulang ke pemanggilnya, melainkan
      melanjutkan di tempat lain — cara jebakan F1 membatalkan penggambaran
      grafik yang sedang berjalan.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `DEFINT`/`DEFDBL`/`DEFSTR` di baris 20 tidak ditiru. Keduanya menyatakan
     tipe variabel menurut huruf awalnya; JavaScript tidak punya padanannya,
     dan seluruh hitungan di sini muat dalam bilangan pecahan ganda yang
     memang dipakai JavaScript.
   - Gelung tunda `FOR A=1 TO 4000:NEXT` di baris 620 habis seketika.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    { baris: 10, jalan: function (m) { m.warna(3, 0); } },
    /* 20 CLEAR 200:DEFINT K,L:DEFDBL B,J,M-Y:DEFSTR C,E,Z */
    { baris: 20, jalan: function (m) { m.v = {}; } },

    trap(30, 1, 1680),
    trap(40, 2, 480), trap(50, 3, 480), trap(60, 4, 480), trap(70, 5, 480),
    trap(80, 6, 480), trap(90, 7, 480), trap(100, 8, 480), trap(110, 9, 480),
    { baris: 120, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 9; m.v.A++) m.jebakan(m.v.A, true);
      } },
    trap(130, 10, 1000),

    { baris: 140, jalan: function (m) {
        m.v.L = 0; m.v.T = 35; m.v.P = Math.PI; m.cls();
      } },
    { baris: 150, bagian: [
        function (m) { m.gosub(1090); },      /* judul + petunjuk */
        function (m) { m.v.XX = 1; m.v.YY = 1; },
        function (m) { m.gosub(1060); }       /* baris bantuan F10 */
      ] },

    /* 160-180 bingkai judul dari balok ganda CP437. */
    { baris: 160, jalan: function (m) {
        m.locate(1, 1);
        m.cetak(m.chr(201) + m.ulang(78, 205) + m.chr(187)); m.barisBaru();
      } },
    { baris: 170, jalan: function (m) {
        m.locate(3, 1);
        m.cetak(m.chr(200) + m.ulang(78, 205) + m.chr(188)); m.barisBaru();
      } },
    { baris: 180, jalan: function (m) {
        m.locate(2, 1);
        m.cetak(m.chr(186));
        m.spc(31);
        m.cetak('B I O R H Y T H M');
        m.spc(30);
        m.cetak(m.chr(186)); m.barisBaru();
      } },

    { baris: 190, jalan: function (m) {
        m.warna(0, 7); m.locate(4, 25);
        m.cetak(' Please Enter Your Birth Date '); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 200, jalan: function (m) { m.locate(6, 30); m.cetak('(m-d-y)'); } },
    { baris: 210, bagian: [
        function (m) { m.gosub(460); },       /* baca tanggal        */
        function (m) { m.gosub(490); }        /* tanggal -> Julian   */
      ] },
    { baris: 220, jalan: function (m) { m.v.JB = m.v.JD; } },
    { baris: 230, jalan: function (m) { m.gosub(560); } },

    { baris: 240, jalan: function (m) {
        m.warna(0, 7); m.locate(4, 20);
        m.cetak(' Please Enter A Start Date For Your Chart ');
      } },
    { baris: 250, jalan: function (m) {
        m.warna(3, 0); m.locate(6, 30, 1); m.cetak('(m-d-y)');
      } },
    { baris: 260, bagian: [
        function (m) { m.gosub(460); },
        function (m) { m.gosub(490); }
      ] },
    { baris: 270, jalan: function (m) { m.v.JC = m.v.JD; } },
    { baris: 280, bagian: [
        function (m) { if (m.v.JC < m.v.JB) m.gosub(600); else m.lompat(290); },
        function (m) { m.lompat(190); }
      ] },
    { baris: 290, jalan: function (m) { m.gosub(630); } },

    /* 300-370 gelung 21 baris grafik. */
    { baris: 300, jalan: function (m) { m.v.N = m.v.JC - m.v.JB; } },
    siklus(310, 23), siklus(320, 28), siklus(330, 33),
    { baris: 340, jalan: function (m) { m.gosub(830); } },   /* Julian -> teks */
    { baris: 350, jalan: function (m) { m.v.E = ' ' + m.v.E; } },
    { baris: 360, jalan: function (m) {
        m.warna(15, 0); m.locate(null, null, 0);
        m.cetak(m.v.C);
        m.warna(3, 0);
        m.cetak(m.v.E);
      } },
    { baris: 370, jalan: function (m) {
        m.v.JC++; m.v.L++;
        if (m.v.L < 21) m.lompat(300);
      } },

    { baris: 380, jalan: function (m) {
        m.locate(24, 16); m.warna(15, 0);
        m.cetak(' Strike Space Bar To Contiue---<F1> To Enter New Dates');
      } },
    { baris: 390, jalan: function (m) { m.warna(3, 0); } },
    { baris: 400, jalan: function (m) {
        m.locate(25, 24); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Program ');
        m.warna(3, 0);
      } },
    { baris: 410, jalan: function (m) { m.jebakan(1, true); } },
    { baris: 420, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(420);
      } },
    { baris: 430, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(430);
        else if (m.v.Z === ' ') m.lompat(450);
      } },
    { baris: 440, jalan: function (m) { m.lompat(430); } },
    { baris: 450, jalan: function (m) {
        m.jebakan(1, false); m.v.L = 0; m.lompat(290);
      } },

    { baris: 460, jalan: function (m) { m.gosub(1340); } },
    { baris: 470, jalan: function (m) { m.v.YEAR = m.v.YEAR + 1900; } },
    /* 480 RETURN — penutup 460-470 SEKALIGUS badan jebakan F2-F9. */
    { baris: 480, jalan: function (m) { m.kembali(); } },

    /* --- 490-550: TANGGAL -> NOMOR HARI JULIAN ----------------------------

       Rumus baku astronomi. Yang perlu diperhatikan bukan angka-angkanya,
       melainkan apa yang dibelinya: sesudah kedua tanggal jadi bilangan
       bulat, "berapa hari di antaranya" cuma satu pengurangan di baris 300.
       Tidak ada tahun kabisat, tidak ada panjang bulan, tidak ada kalender. */
    { baris: 490, jalan: function (m) { m.v.W = fix((m.v.MONTH - 14) / 12); } },
    { baris: 500, jalan: function (m) {
        m.v.JD = Math.floor(1461 * (m.v.YEAR + 4800 + m.v.W) / 4);
      } },
    { baris: 510, jalan: function (m) {
        m.v.B = fix(367 * (m.v.MONTH - 2 - m.v.W * 12) / 12);
      } },
    { baris: 520, jalan: function (m) { m.v.JD = m.v.JD + m.v.B; } },
    { baris: 530, jalan: function (m) {
        m.v.B = Math.floor(Math.floor(3 * (m.v.YEAR + 4900 + m.v.W) / 100) / 4);
      } },
    { baris: 540, jalan: function (m) {
        m.v.JD = m.v.JD + m.v.DAY - 32075 - m.v.B;
      } },
    { baris: 550, jalan: function (m) { m.kembali(); } },

    /* 560-590 hapus tiga baris atas layar. */
    { baris: 560, jalan: function (m) { m.untuk('A', 6, 4, -1, 590); } },
    { baris: 570, jalan: function (m) { m.locate(m.v.A, 1); m.spc(79); } },
    { baris: 580, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 590, jalan: function (m) { m.kembali(); } },

    { baris: 600, jalan: function (m) {
        m.locate(10, 21);
        m.cetak('Start Date Cannot Be Earlier Than Your'); m.barisBaru();
      } },
    { baris: 610, jalan: function (m) {
        m.locate(11, 21);
        m.cetak('     Birth Date. Please Try Again.'); m.barisBaru();
      } },
    { baris: 620, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 4000; m.v.A++) { /* jeda */ }
        m.locate(10, 1); m.spc(79); m.barisBaru(); m.spc(79); m.barisBaru();
        m.lompat(560);
      } },

    /* 630-650 kepala tabel grafik. */
    { baris: 630, jalan: function (m) {
        m.cls(); m.warna(7, 0);
        m.cetak('--DATE--'); m.spc(13);
        m.cetak('D O W N'); m.spc(12);
        m.cetak('CRITICAL'); m.spc(12);
        m.cetak('U P'); m.barisBaru();
      } },
    { baris: 640, jalan: function (m) {
        m.warna(2, 0); m.spc(8); m.cetak(m.ulang(72, 219));
      } },
    { baris: 650, jalan: function (m) { m.kembali(); } },

    /* --- 660-820: SATU TITIK DI GRAFIK -----------------------------------

       Dipanggil tiga kali per hari, sekali untuk tiap siklus. Yang pertama
       (V=23) juga MENYIAPKAN barisnya; dua berikutnya menimpa ke baris yang
       sama. Itu sebabnya urutan 310-320-330 tidak boleh ditukar. */
    { baris: 660, jalan: function (m) {
        m.v.W = Math.floor(m.v.N / m.v.V);
        m.v.R = m.v.N - m.v.W * m.v.V;
      } },
    { baris: 670, jalan: function (m) { if (m.v.V !== 23) m.lompat(710); } },
    /* 680 E=SPACE$(72) — tujuh puluh DUA. Tapi seluruh bedah string sesudah
       ini bekerja dengan lebar tujuh puluh SATU (T+T+1 = 71). Baris 690 di
       bawah yang diam-diam membuang kelebihannya. */
    { baris: 680, jalan: function (m) { m.v.E = ulangSpasi(72); } },
    /* 690 E=LEFT$(E,35)+CHR$(222)+RIGHT$(E,35) — 35+1+35 = 71.
       Dua karakter di tengah hilang, satu penanda masuk; panjangnya berkurang
       satu dan menjadi 71. Cacat panjang di baris 680 tertutup oleh baris
       ini, dan karena tertutup, ia tidak pernah terlihat. */
    { baris: 690, jalan: function (m) {
        var T = m.v.T;
        m.v.E = m.v.E.slice(0, T) + m.chr(222) + m.v.E.slice(m.v.E.length - T);
      } },
    { baris: 700, jalan: function (m) { if (m.v.V === 23) m.v.C = 'P'; } },
    { baris: 710, jalan: function (m) { if (m.v.V === 28) m.v.C = 'E'; } },
    { baris: 720, jalan: function (m) { if (m.v.V === 33) m.v.C = 'I'; } },
    /* 730-740 inilah gelombangnya: sisa hari dibagi panjang siklus jadi sudut,
       lalu SIN memberi simpangan, lalu digeser ke tengah baris. */
    { baris: 730, jalan: function (m) {
        m.v.W = m.v.R / m.v.V;
        m.v.W = m.v.W * 2 * m.v.P;
      } },
    { baris: 740, jalan: function (m) {
        m.v.W = m.v.T * Math.sin(m.v.W);
        m.v.W = m.v.W + m.v.T + 1.5;
      } },
    { baris: 750, jalan: function (m) {
        m.v.W = Math.floor(m.v.W);
        m.v.Z = m.v.E.charAt(m.v.W - 1);
      } },
    /* 760 kalau di kolom itu sudah ada siklus lain, tandanya jadi "&". */
    { baris: 760, jalan: function (m) {
        var z = m.v.Z;
        if (z === 'P' || z === 'E' || z === '&') m.v.C = '&';
      } },
    { baris: 770, jalan: function (m) { if (m.v.W === 1) m.lompat(810); } },
    { baris: 780, jalan: function (m) {
        if (m.v.W === m.v.T + m.v.T + 1) m.lompat(820);
      } },
    /* 790 bedah stringnya: belah di kolom W, sisipkan tandanya, sambung. */
    { baris: 790, jalan: function (m) {
        var W = m.v.W, T = m.v.T, E = m.v.E;
        m.v.E = E.slice(0, W - 1) + m.v.C + E.slice(E.length - (T + T + 1 - W));
        m.kembali();
      } },
    { baris: 800, jalan: function (m) { m.kembali(); } },
    { baris: 810, jalan: function (m) {
        m.v.E = m.v.C + m.v.E.slice(m.v.E.length - (m.v.T + m.v.T));
        m.kembali();
      } },
    { baris: 820, jalan: function (m) {
        m.v.E = m.v.E.slice(0, m.v.T + m.v.T) + m.v.C;
        m.kembali();
      } },

    /* --- 830-990: NOMOR HARI JULIAN -> TANGGAL ---------------------------- */
    { baris: 830, jalan: function (m) {
        m.v.W = m.v.JC + 68569;
        m.v.R = Math.floor(4 * m.v.W / 146097);
      } },
    { baris: 840, jalan: function (m) {
        m.v.W = m.v.W - Math.floor((146097 * m.v.R + 3) / 4);
      } },
    { baris: 850, jalan: function (m) {
        m.v.YEAR = Math.floor(4000 * (m.v.W + 1) / 1461001);
      } },
    { baris: 860, jalan: function (m) {
        m.v.W = m.v.W - Math.floor(1461 * m.v.YEAR / 4) + 31;
      } },
    { baris: 870, jalan: function (m) { m.v.MONTH = Math.floor(80 * m.v.W / 2447); } },
    { baris: 880, jalan: function (m) {
        m.v.DAY = m.v.W - Math.floor(2447 * m.v.MONTH / 80);
      } },
    { baris: 890, jalan: function (m) {
        m.v.W = Math.floor(m.v.MONTH / 11);
        m.v.MONTH = m.v.MONTH + 2 - 12 * m.v.W;
      } },
    { baris: 900, jalan: function (m) {
        m.v.YEAR = 100 * (m.v.R - 49) + m.v.YEAR + m.v.W;
      } },
    /* 910-980 rakit teks "m/dd/yy". STR$ di BASIC selalu memberi satu spasi
       di depan angka positif — itu sebabnya semua MID$ di sini mulai dari
       karakter kedua. */
    { baris: 910, jalan: function (m) {
        m.v.Z = str$(m.v.MONTH); m.v.W = m.v.Z.length - 1;
      } },
    { baris: 920, jalan: function (m) {
        if (m.v.MONTH < 10) { m.v.Z = ' ' + m.v.Z; m.v.W = m.v.W + 1; }
      } },
    { baris: 930, jalan: function (m) {
        m.v.C = m.v.Z.substr(1, m.v.W) + '/';
      } },
    { baris: 940, jalan: function (m) {
        m.v.Z = str$(m.v.DAY); m.v.W = m.v.Z.length - 1;
      } },
    { baris: 950, jalan: function (m) {
        if (m.v.DAY < 10) { m.v.Z = '0' + m.v.Z; m.v.W = m.v.W + 1; }
      } },
    { baris: 960, jalan: function (m) {
        m.v.C = m.v.C + m.v.Z.substr(1, m.v.W) + '/';
      } },
    { baris: 970, jalan: function (m) {
        m.v.Z = str$(m.v.YEAR); m.v.W = m.v.Z.length - 1;
      } },
    { baris: 980, jalan: function (m) {
        m.v.C = m.v.C + m.v.Z.substr(m.v.W - 1, 2);
      } },
    { baris: 990, jalan: function (m) { m.kembali(); } },

    /* 1000-1080 penangan F10. Baris 1050 jatuh ke 1060, yang juga dipanggil
       sebagai subrutin dari baris 150. */
    { baris: 1000, jalan: function (m) {
        m.v.XX = m.barisKursor(); m.v.YY = m.pos();
      } },
    { baris: 1010, jalan: function (m) {
        m.jebakan(10, false);
        m.locate(25, 1); m.spc(78);
      } },
    { baris: 1020, jalan: function (m) {
        m.warna(15, 0); m.locate(25, 21);
        m.cetak('Do You Wish To Leave This Program? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 1030, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1030);
      } },
    { baris: 1040, jalan: function (m) {
        if (m.v.Z === 'Y' || m.v.Z === 'y') m.jalankan('MENU');
      } },
    { baris: 1050, jalan: function (m) {
        if (m.v.Z !== 'N' && m.v.Z !== 'n') m.lompat(1030);
      } },
    { baris: 1060, jalan: function (m) {
        m.locate(25, 1); m.spc(78);
        m.warna(0, 7); m.locate(25, 23);
      } },
    { baris: 1070, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Program ');
        m.v.Z = ''; m.jebakan(10, true); m.warna(3, 0);
      } },
    { baris: 1080, jalan: function (m) {
        m.locate(m.v.XX, m.v.YY); m.kembali();
      } },

    /* 1090-1330 layar judul dan petunjuk. */
    { baris: 1090, jalan: function () { /* 'INSTRUCTIONS */ } },
    { baris: 1100, jalan: function (m) {
        m.cls(); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 1110, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 1120, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 1130, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 33);
        m.cetak('B I O R T H Y M'); m.barisBaru();
      } },
    { baris: 1140, jalan: function (m) {
        m.locate(8, 23);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1150, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1150);
      } },
    { baris: 1160, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') { m.cls(); m.kembali(); }
      } },
    { baris: 1170, jalan: function (m) {
        if (m.v.Z !== 'Y' && m.v.Z !== 'y') m.lompat(1150);
      } },
    { baris: 1180, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 10);
        m.cetak('             P E R S O N A L    B I O R T H Y M '); m.barisBaru();
        m.warna(3, 0);
      } },
    tulis(1190,  5, 22, 'The  Biorhythem theory was originally'),
    tulis(1200,  6, 22, 'developed in  the  19th  century.  It'),
    tulis(1210,  7, 22, 'suggests  that we  are  all  affected'),
    tulis(1220,  8, 22, 'by predictable  and recurring  cycles.'),
    tulis(1230,  9, 22, 'There  are   THREE   distinct  cycles:'),
    tulis(1240, 11, 22, '  <1> The 23 day Physical Rhythm'),
    tulis(1250, 12, 22, '  <2> The 28 day Emotional Rhythm'),
    tulis(1260, 13, 22, '  <3> The 33 day Intellectual Rhythm'),
    tulis(1270, 15, 22, 'First enter your birth date, then the'),
    tulis(1280, 16, 22, 'date that you would like the chart to'),
    tulis(1290, 17, 22, 'begin.'),
    tulis(1300, 19, 22, 'For more information on the Biorhythm'),
    tulis(1310, 20, 22, 'Theory, see page  31  in your manual.'),
    { baris: 1320, jalan: function (m) {
        m.locate(25, 27); m.warna(14, 0);
        m.cetak('Strike Any Key To Continue');
        m.warna(3, 0);
      } },
    { baris: 1330, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1330);
        else { m.cls(); m.kembali(); }
      } },

    /* --- 1340-1670: PENYUNTING TANGGAL BUATAN SENDIRI --------------------

       Tidak ada `INPUT` di sini. Program membaca tombol satu per satu,
       menolak yang bukan angka, menerima titik/garis/spasi sebagai pemisah,
       dan menangani Backspace serta panah kiri sebagai "batalkan semua".
       Tiga puluh baris untuk apa yang `INPUT` lakukan dalam satu — dan
       imbalannya: pemakainya tidak bisa mengetik apa pun yang salah. */
    { baris: 1340, jalan: function (m) {
        m.locate(null, 40); m.spc(39);
        m.locate(null, 40, 1);
      } },
    { baris: 1350, jalan: function (m) { m.v.Z1 = ''; m.v.Z = ''; } },
    { baris: 1360, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1360);
      } },
    { baris: 1370, jalan: function (m) { if (pemisah(m.v.Z)) m.lompat(1430); } },
    { baris: 1380, jalan: function (m) {
        if (m.v.Z === m.chr(8) || kanan1(m.v.Z) === m.chr(75)) {
          m.v.Z1 = ''; m.v.Z = ''; m.lompat(1340);
        }
      } },
    { baris: 1390, jalan: function (m) {
        if (m.v.Z === m.chr(13) || m.v.Z.length > 1) m.lompat(1360);
      } },
    { baris: 1400, jalan: function (m) { if (m.v.Z1.length > 1) m.lompat(1360); } },
    { baris: 1410, jalan: function (m) {
        if (m.v.Z < '0' || m.v.Z > '9') m.lompat(1360);
      } },
    { baris: 1420, jalan: function (m) {
        m.v.Z1 = m.v.Z1 + m.v.Z;
        m.locate(null, 40); m.cetak(m.v.Z1);
        m.lompat(1360);
      } },
    { baris: 1430, jalan: function (m) {
        m.v.MONTH = parseInt(m.v.Z1, 10) || 0;
        if (m.v.MONTH < 1 || m.v.MONTH > 12) m.lompat(1340);
      } },
    { baris: 1440, jalan: function (m) {
        m.v.Z2 = m.v.Z1 + m.v.Z;
        m.locate(null, 40); m.cetak(m.v.Z2);
        m.v.Z1 = ''; m.v.Z = '';
      } },
    { baris: 1450, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1450);
      } },
    { baris: 1460, jalan: function (m) { if (pemisah(m.v.Z)) m.lompat(1530); } },
    { baris: 1470, jalan: function (m) { if (m.v.Z === m.chr(13)) m.lompat(1450); } },
    { baris: 1480, jalan: function (m) {
        if (m.v.Z === m.chr(8) || kanan1(m.v.Z) === m.chr(75)) {
          m.v.Z1 = ''; m.v.Z = ''; m.lompat(1340);
        }
      } },
    /* 1490 IF LEN(Z1)>1 THEN 1360 — melompat ke gelung BULAN, bukan gelung
       hari. Kalau pemakai mengetik tiga angka untuk hari, ia terlempar
       kembali ke pembacaan bulan tanpa layar dibersihkan. Nomor baris yang
       salah ketik, dan hanya terlihat kalau ditelusuri. */
    { baris: 1490, jalan: function (m) { if (m.v.Z1.length > 1) m.lompat(1360); } },
    { baris: 1500, jalan: function (m) { if (m.v.Z.length > 1) m.lompat(1450); } },
    { baris: 1510, jalan: function (m) {
        if (m.v.Z < '0' || m.v.Z > '9') m.lompat(1450);
      } },
    { baris: 1520, jalan: function (m) {
        m.v.Z1 = m.v.Z1 + m.v.Z;
        m.locate(null, m.pos()); m.cetak(m.v.Z);
        m.lompat(1450);
      } },
    { baris: 1530, jalan: function (m) {
        m.v.DAY = parseInt(m.v.Z1, 10) || 0;
        if (m.v.DAY < 1 || m.v.DAY > 31) m.lompat(1340);
      } },
    { baris: 1540, jalan: function (m) {
        m.v.Z2 = m.v.Z2 + m.v.Z1 + m.v.Z;
        m.locate(null, 40); m.cetak(m.v.Z2);
        m.v.Z1 = ''; m.v.Z = '';
      } },
    { baris: 1550, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1550);
      } },
    { baris: 1560, jalan: function (m) { if (pemisah(m.v.Z)) m.lompat(1610); } },
    { baris: 1570, jalan: function (m) {
        if (m.v.Z === m.chr(8) || kanan1(m.v.Z) === m.chr(75)) {
          m.v.Z1 = ''; m.v.Z = ''; m.lompat(1340);
        }
      } },
    { baris: 1580, jalan: function (m) {
        if (m.v.Z === m.chr(13) || m.v.Z.length > 1) m.lompat(1550);
      } },
    { baris: 1590, jalan: function (m) {
        if (m.v.Z < '0' || m.v.Z > '9') m.lompat(1550);
      } },
    { baris: 1600, jalan: function (m) {
        m.v.Z1 = m.v.Z1 + m.v.Z;
        m.locate(null, m.pos()); m.cetak(m.v.Z);
        if (m.v.Z1.length < 2) m.lompat(1550);
      } },
    { baris: 1610, jalan: function (m) { m.v.YEAR = parseInt(m.v.Z1, 10) || 0; } },
    { baris: 1620, jalan: function (m) { m.v.Z2 = m.v.Z2 + m.v.Z1; } },
    { baris: 1630, jalan: function (m) {
        m.locate(null, m.pos() + 5, 1);
        m.warna(15, 0);
        m.cetak('Correct? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 1640, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1640);
      } },
    { baris: 1650, jalan: function (m) {
        if (m.v.Z === 'y' || m.v.Z === 'Y') m.kembali();
      } },
    { baris: 1660, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(1640);
      } },
    { baris: 1670, jalan: function (m) { m.lompat(1340); } },

    /* 1680 RETURN 1690 — bukan pulang ke pemanggilnya.
       Jebakan F1 bisa menyela di tengah penggambaran grafik, dan kembali ke
       sana tidak ada gunanya: pemakainya minta tanggal baru. `RETURN <baris>`
       membuang alamat pulang itu dan melanjutkan di 1690. */
    { baris: 1680, jalan: function (m) { m.kembali(1690); } },
    { baris: 1690, jalan: function (m) {
        m.v.L = 0; m.cls(); m.jebakan(1, false); m.lompat(160);
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function fix(x) { return x < 0 ? Math.ceil(x) : Math.floor(x); }

  /* STR$ di BASIC memberi satu spasi di depan angka positif. */
  function str$(n) { return (n < 0 ? '' : ' ') + String(n); }

  function ulangSpasi(n) {
    var s = '', i;
    for (i = 0; i < n; i++) s += ' ';
    return s;
  }

  function kanan1(s) { return s ? s.charAt(s.length - 1) : ''; }

  function pemisah(z) { return z === '.' || z === '/' || z === '-' || z === ' '; }

  function trap(nomor, tombol, tujuan) {
    return { baris: nomor, jalan: function (m) { m.pasangJebakan(tombol, tujuan); } };
  }

  function siklus(nomor, panjang) {
    return { baris: nomor, bagian: [
      function (m) { m.v.V = panjang; },
      function (m) { m.gosub(660); }
    ] };
  }

  function tulis(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BIO'] = {
    nama: 'BIO',
    judul: 'Personal Biorhythms',
    sumber: 'BIO',
    berkas: 'run/BIO.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BIO.BAS',
      simpul: [
        { id: 'siap', baris: '10-180', jenis: 'mulai',
          teks: ['Pasang jebakan, judul,', 'tawarkan petunjuk'] },
        { id: 'lahir', baris: '190-230', jenis: 'subrutin',
          teks: ['Minta tanggal lahir,', 'ubah jadi nomor hari Julian'] },
        { id: 'mulai2', baris: '240-270', jenis: 'subrutin',
          teks: ['Minta tanggal awal grafik,', 'ubah jadi nomor hari Julian'] },
        { id: 'urut', baris: '280', jenis: 'putusan',
          teks: ['Awal grafik sesudah', 'tanggal lahir?'] },
        { id: 'tolak', baris: '600-620', jenis: 'galat',
          teks: ['"Cannot Be Earlier"', 'tanya ulang'] },
        { id: 'kepala', baris: '630-650',
          teks: ['Gambar kepala tabel', 'DOWN / CRITICAL / UP'] },
        { id: 'hari', baris: '300-370',
          teks: ['Untuk 21 hari:', 'hitung tiga siklus'] },
        { id: 'titik', baris: '660-820', jenis: 'subrutin',
          teks: ['Satu titik: SIN memberi simpangan,', 'bedah string menaruhnya'] },
        { id: 'tanggal', baris: '830-990', jenis: 'subrutin',
          teks: ['Nomor Julian kembali', 'jadi teks m/dd/yy'] },
        { id: 'tunggu', baris: '380-450', jenis: 'putusan',
          teks: ['Spasi: 21 hari berikutnya', 'F1: tanggal baru'] }
      ],
      panah: [
        { dari: 'siap',    ke: 'lahir' },
        { dari: 'lahir',   ke: 'mulai2' },
        { dari: 'mulai2',  ke: 'urut' },
        { dari: 'urut',    ke: 'tolak',  label: 'tidak', jenis: 'galat' },
        { dari: 'tolak',   ke: 'lahir',  label: 'GOTO 190', jenis: 'galat' },
        { dari: 'urut',    ke: 'kepala', label: 'ya' },
        { dari: 'kepala',  ke: 'hari' },
        { dari: 'hari',    ke: 'titik',  label: '3x per hari' },
        { dari: 'titik',   ke: 'hari',   label: 'RETURN' },
        { dari: 'hari',    ke: 'tanggal' },
        { dari: 'tanggal', ke: 'hari',   label: 'RETURN, ulangi 21x' },
        { dari: 'hari',    ke: 'tunggu', label: 'L = 21' },
        { dari: 'tunggu',  ke: 'kepala', label: 'spasi' },
        { dari: 'tunggu',  ke: 'lahir',  label: 'F1: RETURN 1690' }
      ]
    },

    pseudokode: [
      { baris: 30,  tingkat: 0, teks: 'pasang jebakan: F1 tanggal baru, F10 keluar, sisanya mandul' },
      { baris: 140, tingkat: 0, teks: 'T = 35 (setengah lebar grafik), P = pi' },
      { baris: 210, tingkat: 0, teks: 'minta tanggal lahir &rarr; <b>nomor hari Julian</b> JB' },
      { baris: 260, tingkat: 0, teks: 'minta tanggal awal grafik &rarr; nomor hari Julian JC' },
      { baris: 280, tingkat: 0, teks: 'JC lebih awal dari JB? tolak, tanya ulang' },
      { baris: 300, tingkat: 0, teks: '<b>ULANG 21 kali:</b>' },
      { baris: 300, tingkat: 1, teks: 'N = JC &minus; JB &mdash; <b>umur dalam hari, satu pengurangan</b>' },
      { baris: 310, tingkat: 1, teks: 'untuk siklus 23, 28, dan 33 hari:' },
      { baris: 660, tingkat: 2, teks: 'sisa = N mod panjang siklus' },
      { baris: 680, tingkat: 2, teks: 'siklus pertama juga menyiapkan baris grafiknya' },
      { baris: 730, tingkat: 2, teks: 'sisa/panjang &times; 2&pi; = sudut' },
      { baris: 740, tingkat: 2, teks: '35 &times; sin(sudut) + 35 + 1,5 = kolom titiknya' },
      { baris: 760, tingkat: 2, teks: 'sudah ada siklus lain di kolom itu? pakai "&amp;"' },
      { baris: 790, tingkat: 2, teks: '<b>belah string, sisipkan tanda, sambung lagi</b>' },
      { baris: 830, tingkat: 1, teks: 'ubah nomor Julian kembali jadi teks m/dd/yy' },
      { baris: 360, tingkat: 1, teks: 'cetak tanggal lalu barisan grafiknya' },
      { baris: 370, tingkat: 1, teks: 'maju satu hari' },
      { baris: 380, tingkat: 0, teks: 'spasi: 21 hari berikutnya &mdash; F1: <b>RETURN 1690</b>, tanggal baru' }
    ],

    perintahAsli: 'run\\BIO.bat',
    catatanAsli: 'Port lengkapnya ada di web/games/bio/ dengan penjelasan ' +
      'yang jauh lebih dalam soal kedua cacatnya. Yang di sini penelusuran ' +
      'barisnya.',

    penyimpangan: [
      '<b><code>DEFINT</code>, <code>DEFDBL</code>, dan <code>DEFSTR</code> ' +
      'di baris 20 tidak ditiru.</b> Ketiganya menyatakan tipe variabel ' +
      'menurut huruf awalnya — <code>DEFDBL M-Y</code> berarti semua variabel ' +
      'berawalan M sampai Y bertipe pecahan ganda. JavaScript tidak punya ' +
      'padanannya, dan seluruh hitungan di sini muat dalam bilangan pecahan ' +
      'ganda yang memang dipakai JavaScript.',

      '<b>Gelung tunda <code>FOR A=1 TO 4000:NEXT</code> di baris 620 habis ' +
      'seketika</b>, jadi pesan "Cannot Be Earlier" terhapus sebelum sempat ' +
      'terbaca. Pasang titik henti di sana.',

      '<b>Panjang string grafik bisa diperiksa sendiri di penelusur.</b> ' +
      'Baris 680 membuatnya 72 karakter, baris 690 membuatnya 71, dan seluruh ' +
      'bedah string sesudahnya bekerja dengan 71. Itu bukan penyimpangan ' +
      'porting — itu memang yang terjadi di aslinya, dan penelusur cuma ' +
      'membuatnya bisa dilihat.'
    ],

    pelajaran: {
      ringkas: 'Grafik biorhythm tiga siklus, digambar di layar TEKS dengan ' +
        'bedah string. Yang layak dipelajari: nomor hari Julian, dan bagaimana ' +
        'satu cacat bisa menutupi cacat lain sehingga keduanya tak terlihat.',
      pelajari: [
        ['Nomor hari Julian',
         'Baris 490-550 mengubah tanggal jadi satu bilangan bulat; 830-990 ' +
         'mengubahnya kembali. Di antara keduanya, "berapa hari dari lahir ' +
         'sampai hari ini" cuma <b>satu pengurangan</b> (baris 300). Tidak ada ' +
         'tahun kabisat, tidak ada panjang bulan, tidak ada kalender. Ubah ke ' +
         'bentuk yang membuat pertanyaan Anda sepele, lalu ubah kembali.'],
        ['Layar teks sebagai kanvas',
         'Tidak ada mode grafis dipakai. Tiap baris grafik adalah satu string, ' +
         'dan menaruh titik berarti <code>LEFT$ + tanda + RIGHT$</code>. Untuk ' +
         'grafik sederhana, itu jauh lebih cepat daripada mode grafis CGA — ' +
         'dan jalan di komputer yang bahkan tidak punya kartu grafis.'],
        ['Satu subrutin, tiga pemanggilan, satu hasil',
         'Baris 310-330 memanggil rutin yang sama tiga kali dengan V=23, 28, ' +
         'dan 33. Yang pertama menyiapkan barisnya, dua berikutnya menimpa ke ' +
         'baris yang sama. Karena itu urutannya tidak boleh ditukar — dan ' +
         'tidak ada satu pun komentar yang mengatakannya.'],
        ['Penyunting masukan buatan sendiri',
         'Baris 1340-1670 membaca tanggal tombol demi tombol: menolak yang ' +
         'bukan angka, menerima titik/garis/spasi sebagai pemisah, menangani ' +
         'Backspace. Tiga puluh baris untuk apa yang <code>INPUT</code> ' +
         'lakukan dalam satu — dan imbalannya, pemakainya tidak bisa mengetik ' +
         'apa pun yang salah.']
      ],
      hindari: [
        ['Panjang yang tidak konsisten, tertutup oleh perbaikan diam-diam',
         'Baris 680 membuat string 72 karakter. Baris 690 mengambil 35 dari ' +
         'kiri, menyisipkan satu, dan 35 dari kanan — hasilnya <b>71</b>. Dua ' +
         'karakter tengah hilang, dan sejak itu semuanya bekerja dengan 71. ' +
         'Cacat panjangnya nyata, tapi tertutup, dan yang tertutup tidak ' +
         'pernah diperbaiki.'],
        ['Nomor baris tujuan yang salah ketik',
         'Baris 1490 melompat ke 1360 — gelung pembacaan <b>bulan</b> — ' +
         'padahal ia berada di gelung pembacaan <b>hari</b>. Sebelahnya, baris ' +
         '1500, melompat ke 1450 yang benar. Salah ketik satu angka, dan ' +
         'hanya terlihat kalau ditelusuri.'],
        ['Judul yang salah eja, dua kali berbeda',
         'Baris 1130 menulis "B I O R T H Y M", baris 180 menulis ' +
         '"B I O R H Y T H M". Yang pertama salah. Salah eja di layar tidak ' +
         'merusak apa pun — dan justru karena itu ia bertahan empat puluh tahun.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa tanggal diubah jadi satu angka',
        isi: [
          'Pertanyaan yang harus dijawab program ini: <b>sudah berapa hari ' +
          'sejak Anda lahir?</b>',
          'Dijawab langsung dari tanggal, itu pekerjaan berat: hitung tahun ' +
          'penuh, kurangi, tambahkan bulan-bulan dengan panjang berbeda-beda, ' +
          'lalu urus tahun kabisat — termasuk aturan bahwa tahun kelipatan 100 ' +
          'bukan kabisat kecuali kelipatan 400.',
          'Program ini tidak melakukan satu pun dari itu. Ia mengubah kedua ' +
          'tanggal jadi <b>nomor hari Julian</b> — hitungan hari sejak 1 ' +
          'Januari 4713 SM — lalu:',
          '<code>300 N=JC-JB</code>',
          'Satu pengurangan. Seluruh kerumitan kalender sudah diselesaikan ' +
          'sekali di baris 490-550, dan tidak pernah muncul lagi.',
          'Ini pola yang berlaku jauh melampaui tanggal: <b>ubah data ke bentuk ' +
          'yang membuat pertanyaan Anda sepele, kerjakan di sana, lalu ubah ' +
          'kembali.</b> Rumus di baris 490-550 dan 830-900 bukan karangan ' +
          'penulisnya — ia rumus baku astronomi, dan masih dipakai hari ini.'
        ] },
      { judul: 'Menggambar tanpa mode grafis',
        isi: [
          'Layar CGA punya mode grafis 320&times;200. Program ini tidak ' +
          'memakainya sama sekali.',
          'Tiap baris grafik adalah satu <b>string</b> sepanjang 71 karakter. ' +
          'Menaruh titik di kolom W berarti membelah string itu dan ' +
          'menyambungnya lagi dengan tanda di tengah:',
          '<code>790 E=LEFT$(E,W-1)+C+RIGHT$(E,T+T+1-W)</code>',
          'Dan kolomnya sendiri datang dari trigonometri:',
          '<code>730 W=R/V:W=W*2*P</code> &middot; ' +
          '<code>740 W=T*SIN(W):W=W+T+1.5</code>',
          'Sisa hari dibagi panjang siklus memberi posisi dalam satu putaran; ' +
          'dikali 2&pi; jadi sudut; <code>SIN</code> memberi simpangan &minus;1 ' +
          'sampai +1; dikali 35 dan digeser 35 menaruhnya di kolom 1 sampai 71.',
          'Kenapa tidak mode grafis? Karena ini <b>lebih cepat</b>, dan jalan ' +
          'di komputer yang tidak punya kartu grafis sama sekali. Kendala ' +
          'melahirkan teknik, dan tekniknya bertahan lebih lama daripada ' +
          'kendalanya.'
        ] },
      { judul: 'Satu cacat yang menutupi cacat lain',
        isi: [
          'Baris 680 membuat baris grafik sepanjang <b>72</b> karakter:',
          '<code>680 E=SPACE$(72)</code>',
          'Baris 690 menaruh penanda garis tengah:',
          '<code>690 E=LEFT$(E,T)+CHR$(222)+RIGHT$(E,T)</code>',
          'Dengan T=35: 35 karakter dari kiri, satu penanda, 35 dari kanan — ' +
          'totalnya <b>71</b>. Dua karakter di tengah string yang lama hilang ' +
          'tanpa jejak.',
          'Dan 71 itulah angka yang dipakai seluruh sisa program: ' +
          '<code>T+T+1</code> di baris 780 dan 790 sama dengan 71.',
          'Jadi ada dua hal yang tidak cocok — panjang 72 di baris 680, dan ' +
          'lebar 71 di seluruh sisanya — tapi baris 690 <b>diam-diam ' +
          'memperbaikinya</b> setiap kali. Hasilnya benar, jadi tidak ada yang ' +
          'pernah melihat.',
          'Ini bentuk cacat yang paling sulit ditemukan: <b>yang gejalanya ' +
          'ditutupi oleh kode lain.</b> Di penelusur Anda bisa melihatnya ' +
          'langsung — pasang titik henti di baris 690, lalu periksa panjang ' +
          'string sebelum dan sesudahnya.'
        ] },
      { judul: 'RETURN yang tidak pulang',
        isi: [
          '<code>1680 RETURN 1690</code>',
          '<code>RETURN</code> biasanya kembali ke pernyataan sesudah ' +
          '<code>GOSUB</code> yang memanggilnya. Bentuk ini tidak: ia ' +
          '<b>membuang</b> alamat pulang itu dan melanjutkan di baris 1690.',
          'Kenapa perlu? Karena baris 1680 adalah penangan jebakan F1, dan F1 ' +
          'bisa ditekan kapan saja — termasuk di tengah penggambaran grafik. ' +
          'Kembali ke tempat yang disela tidak ada gunanya: pemakainya baru ' +
          'saja minta tanggal baru.',
          'Bentuk ini ada padanannya di bahasa modern, dan namanya beragam: ' +
          '<code>longjmp</code>, pelemparan pengecualian, pembatalan tugas. ' +
          'Semuanya menjawab pertanyaan yang sama: <b>bagaimana meninggalkan ' +
          'pekerjaan yang sedang berjalan tanpa harus membereskannya lapis ' +
          'demi lapis?</b>',
          'Dan semuanya punya bahaya yang sama: apa pun yang seharusnya ' +
          'dibereskan di lapisan yang dilompati, tidak akan dibereskan.'
        ] }
    ]
  };
})(window);
