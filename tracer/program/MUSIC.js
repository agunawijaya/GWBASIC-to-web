/* ===========================================================================
   MUSIC.js — porting minimalis MUSIC.BAS sebagai tabel baris.

       950 REM Version 1.10 (C)Copyright IBM Corp 1981, 1982
       960 REM Licensed Material - Program Property of IBM

   Perangkat lunak IBM resmi kedua di koleksi ini, sesudah MORTGAGE.BAS.
   Papan tuts digambar di layar, sebelas lagu tersimpan sebagai DATA, dan
   tiap nada MENYALAKAN TUTSNYA saat dibunyikan.

   TIGA HAL YANG LAYAK DITELUSURI:

   (1) DELAPAN PULUH DUA FREKUENSI DARI SATU BARIS.

           1370 FOR I=7 TO 88: M(I) = 36.8*(2^(1/12))^(I-6): NEXT
           1380 FOR I=0 TO 6:  M(I) = 32767: NEXT

       Rumus tangga nada berjarak sama — yang sama persis dengan OCTAVE.BAS
       dan NOTETABL.BAS. Dan tujuh nada pertama diisi 32767 Hz, di atas batas
       pendengaran: DIAM ditulis sebagai nada yang tidak terdengar.

   (2) LAYAR SEBAGAI PETA TUTS.

           1570 IF SCREEN(5,Q)<>32 THEN ... LOCATE 11,Q ... ELSE LOCATE 7,Q

       Tuts hitam digambar di baris 5; tuts putih tidak. Jadi untuk mengetahui
       nada mana yang hitam, program MEMBACA GAMBARNYA SENDIRI. Program kelima
       di koleksi ini yang memakai layar sebagai data, sesudah SERPENT,
       BOWLING, METEOR, dan DROIDS.

   (3) UJI KEMAMPUAN LEWAT GALAT.

           1141 ON ERROR GOTO 1148
           1142 PLAY "mf"
           1148 RESUME 1149
           1149 ON ERROR GOTO 0

       `PLAY` tidak ada di Cassette BASIC. Alih-alih memeriksa versi, program
       MENCOBANYA — dan kalau gagal, galatnya ditelan dan program lanjut.
       Penginderaan kemampuan, dengan pengecualian sebagai alatnya.

   MUSIC1.BAS ADALAH BERKAS INI, DENGAN EMPAT BARIS BERBEDA — dan dua di
   antaranya cuma tab lawan spasi. Lihat MUSIC1.js.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` dan `PLAY` diam. Yang tersisa dari sebuah program musik cuma
     animasi tutsnya — dan itu justru membuat gagasan (2) terlihat.
   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom.
   - `RESTORE <baris>` diberikan sebagai INDEKS di larik DATA yang rata, dan
     indeksnya DIHITUNG dari daftar lagu di bawah — bukan diketik tangan.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Sebelas lagu, disalin dari DATA baris 3200-4550. Tiap lagu:
     [nomor baris RESTORE, judul, pasangan nada-dan-lama sebagai teks].
     Nada 0 berarti diam; pasangan -1,-1 mengakhiri lagu. */

  var LAGU = [
    [3200, "La Cucaracha - Mexican Folk Song",
      '42 1 0 1 42 1 0 1 42 1 0 1 47 1 0 5 51 1 0 3 42 1 0 1 42 1 0 1 42  ' +
      '1 0 1 47 1 0 5 51 1 0 5 30 1 0 1 30 1 0 1 35 1 0 3 47 1 0 1 47 1  ' +
      '0 1 46 1 0 1 46 1 0 1 44 1 0 1 44 1 0 1 42 8 0 2 42 1 0 1 42 1 0  ' +
      '1 42 1 0 1 46 1 0 5 49 1 0 3 42 1 0 1 42 1 0 1 42 1 0 1 46 1 0 5  ' +
      '49 1 0 5 37 1 0 1 37 1 0 1 30 1 0 3 54 2 56 2 54 2 52 2 51 2 49 2  ' +
      '47 8 -1 -1'
    ],
    [3300, "Blue Danube Waltz by J.S.Strauss",
      '42 4 46 4 49 4 49 4 0 4 61 2 0 2 61 2 0 6 58 2 0 2 58 2 0 6 42 4  ' +
      '42 4 46 4 49 4 49 4 0 4 61 2 0 2 61 2 0 6 59 2 0 2 59 2 0 6 41 4  ' +
      '41 4 44 4 51 4 51 4 0 4 63 2 0 2 63 2 0 6 59 2 0 2 59 2 0 6 41 4  ' +
      '41 4 44 4 51 4 51 4 0 4 63 2 0 2 63 2 0 6 58 2 0 2 58 2 0 6 42 4  ' +
      '42 4 46 4 49 4 54 4 0 4 66 2 0 2 66 2 0 6 61 2 0 2 61 2 0 6 42 4  ' +
      '42 4 46 4 49 4 54 4 0 4 66 2 0 2 66 2 0 6 63 2 0 2 63 2 0 6 44 4  ' +
      '44 4 47 4 51 2 0 2 51 14 0 2 48 4 49 4 58 16 54 4 46 4 46 8 44 4  ' +
      '51 8 49 4 42 4 0 2 42 2 42 4 0 8 49 2 0 2 47 2 0 6 49 2 0 2 47 2  ' +
      '0 6 49 4 58 16 56 4 49 2 0 2 46 2 0 6 49 2 0 2 46 2 0 6 49 4 56  ' +
      '16 54 4 49 2 0 2 47 2 0 6 49 2 0 2 47 2 0 6 49 4 58 16 56 4 49 4  ' +
      '54 4 56 4 58 4 61 8 59 4 58 2 58 2 58 4 56 2 0 2 54 4 0 8 -1 -1'
    ],
    [3500, "Humoresque by Dvorak",
      '47 3 0 2 49 1 47 3 0 2 49 1 51 3 0 2 54 1 56 3 0 2 54 1 59 3 0 2  ' +
      '58 1 61 3 0 2 59 1 58 3 0 2 61 1 59 3 0 2 56 1 54 3 0 2 54 1 56 3  ' +
      '0 2 54 1 59 3 0 2 56 1 54 3 0 2 51 1 49 24 47 3 0 2 49 1 47 3 0 2  ' +
      '49 1 51 3 0 2 54 1 56 3 0 2 54 1 56 3 0 2 58 1 61 3 0 2 59 1 58 3  ' +
      '0 2 61 1 59 3 0 2 56 1 54 3 0 2 54 1 59 3 0 2 47 1 49 6 54 6 47  ' +
      '18 -1 -1'
    ],
    [3600, "Pop! Goes the Weasel - Anonymous",
      '47 2 0 2 47 2 49 2 0 2 49 2 51 2 54 2 51 2 47 2 0 2 42 2 47 2 0 2  ' +
      '47 2 49 2 0 2 49 2 51 6 47 2 0 2 42 2 47 2 0 2 47 2 49 2 0 2 49 2  ' +
      '51 2 54 2 51 2 47 2 0 4 56 2 0 4 49 2 0 2 52 2 51 6 47 2 0 4 59 2  ' +
      '0 2 59 2 56 2 0 2 59 2 58 2 61 2 58 2 54 2 0 4 59 2 0 2 59 2 56 2  ' +
      '0 2 59 2 58 6 54 2 0 2 51 2 52 2 0 2 51 2 52 2 0 2 54 2 56 2 0 2  ' +
      '58 2 59 2 0 4 56 2 0 4 49 2 0 2 52 2 51 6 47 2 -1 -1'
    ],
    [3700, "Symphony #40 by Mozart",
      '55 2 54 2 54 4 55 2 54 2 54 4 55 2 54 2 54 4 62 4 0 4 62 2 61 2  ' +
      '59 4 59 2 57 2 55 4 55 2 54 2 52 4 52 4 0 4 54 2 52 2 52 4 54 2  ' +
      '52 2 52 4 54 2 52 2 52 4 61 4 0 4 61 2 59 2 58 4 58 2 55 2 54 4  ' +
      '54 2 52 2 50 4 50 4 0 4 62 2 61 2 61 4 64 4 58 4 61 4 59 4 54 4 0  ' +
      '4 62 2 61 2 61 4 64 4 58 4 61 4 59 4 62 4 61 2 59 2 57 2 55 2 54  ' +
      '4 46 4 47 4 49 4 50 4 52 2 50 2 49 4 47 4 54 4 0 4 65 8 66 2 0 6  ' +
      '65 8 66 2 0 6 65 8 66 4 65 4 66 4 65 4 66 4 -1 -1'
    ],
    [3900, "Yankee Doodle - Anonymous ",
      '50 3 50 3 52 3 54 3 50 3 54 3 52 3 45 3 50 3 50 3 52 3 54 3 50 6  ' +
      '49 3 0 3 50 3 50 3 52 3 54 3 55 3 54 3 52 3 50 3 49 3 45 3 47 3  ' +
      '49 3 50 6 50 3 0 3 47 5 49 1 47 3 45 3 47 3 49 3 50 3 0 3 45 5 47  ' +
      '1 45 3 43 3 42 6 45 3 0 3 47 5 49 1 47 3 45 3 47 3 49 3 50 3 47 3  ' +
      '45 3 50 3 49 3 52 3 50 6 50 6 -1 -1'
    ],
    [4000, "FUNERAL MARCH OF A MARIONETTE - GOUNOD",
      '37 1 0 2 30 1 0 5 42 3 42 3 41 3 39 3 41 3 0 3 42 3 44 3 0 3 37 1  ' +
      '0 2 30 1 0 5 42 3 42 3 41 3 39 3 41 3 0 3 42 3 44 3 0 3 37 3 42 3  ' +
      '0 3 45 3 49 6 47 3 45 3 0 3 49 3 52 6 50 3 49 3 0 3 53 3 56 6 54  ' +
      '3 53 3 50 3 49 3 47 3 45 3 44 3 30 1 0 5 42 3 42 3 41 3 39 3 41 3  ' +
      '0 3 42 3 44 3 0 3 37 1 0 2 30 1 0 5 42 3 42 3 41 3 39 3 41 3 0 3  ' +
      '42 3 44 3 0 3 37 3 45 3 0 3 49 3 52 6 50 3 49 3 47 3 45 3 43 3 47  ' +
      '3 50 3 42 3 41 3 42 3 44 3 0 3 45 1 0 2 44 9 42 1 -1 -1'
    ],
    [4100, "STARS AND STRIPES FOREVER - SOUSA ",
      '54 6 54 6 52 3 51 3 51 6 50 3 51 3 51 16 0 2 50 3 51 3 51 6 50 3  ' +
      '51 3 54 6 51 3 54 3 52 12 49 6 0 3 49 3 49 6 48 3 49 3 49 6 48 3  ' +
      '49 3 52 16 0 2 51 3 49 3 51 3 54 9 56 9 56 3 49 16 0 2 54 6 54 6  ' +
      '52 3 51 3 51 6 50 3 51 3 51 16 0 2 50 3 51 3 51 6 50 3 51 3 52 3  ' +
      '51 3 49 5 46 1 49 12 47 6 0 3 47 3 47 6 46 3 47 3 50 6 49 3 47 3  ' +
      '59 15 0 3 47 3 49 3 51 3 54 1 0 2 47 3 49 3 51 3 54 1 0 2 42 3 44  ' +
      '5 51 1 49 12 47 1 -1 -1'
    ],
    [4300, "Mexican Hat Dance - Traditional ",
      '52 2 57 2 0 2 52 2 57 2 0 2 52 2 57 6 0 4 52 2 57 2 59 2 57 2 56  ' +
      '4 57 2 59 2 0 8 52 2 56 2 0 2 52 2 56 2 0 2 52 2 56 6 0 4 52 2 56  ' +
      '2 57 2 56 2 54 4 56 2 57 2 0 6 64 2 63 2 64 2 61 2 60 2 61 2 57 2  ' +
      '56 2 57 2 52 2 0 4 49 2 50 2 52 2 54 2 56 2 57 2 59 2 61 2 62 2  ' +
      '59 2 0 4 62 2 61 2 62 2 59 2 58 2 59 2 56 2 55 2 56 2 52 2 0 4 64  ' +
      '2 63 2 64 2 66 2 64 2 62 2 61 2 59 2 57 2 -1 -1'
    ],
    [4400, "SCALES",
      '38 1 39 1 40 1 41 1 42 1 43 1 44 1 45 1 46 1 47 1 48 1 49 1 50 1  ' +
      '51 1 52 1 53 1 54 1 55 1 56 1 57 1 58 1 59 1 60 1 61 1 62 1 63 1  ' +
      '64 1 65 8 0 4 65 8 64 1 63 1 62 1 61 1 60 1 59 1 58 1 57 1 56 1  ' +
      '55 1 54 1 53 1 52 1 51 1 50 1 49 1 48 1 47 1 46 1 45 1 44 1 43 1  ' +
      '42 1 41 1 40 1 39 1 38 8 -1 -1'
    ],
    [4500, "Sakura - Japanese Folk Melody ",
      '49 8 49 8 51 12 0 4 49 8 49 8 51 12 0 4 49 8 51 8 52 8 51 8 49 8  ' +
      '51 4 49 4 45 16 44 8 40 8 44 8 45 8 44 8 44 4 40 4 39 16 49 8 49  ' +
      '8 51 12 0 4 49 8 49 8 51 12 0 4 40 8 44 8 45 8 49 8 51 4 49 4 45  ' +
      '8 44 16 -1 -1'
    ],
  ];

  /* Larik DATA yang rata, dan peta nomor-baris -> indeks untuk RESTORE.
     Keduanya DIHITUNG dari LAGU, jadi tidak mungkin melenceng darinya. */
  var DATA = [], KE = {};
  (function () {
    for (var i = 0; i < LAGU.length; i++) {
      KE[LAGU[i][0]] = DATA.length;
      DATA.push(-2, LAGU[i][1]);
      var n = LAGU[i][2].split(/\s+/);
      for (var j = 0; j < n.length; j++) {
        if (n[j] !== '') DATA.push(parseInt(n[j], 10));
      }
    }
  })();

  function rem(n) { return { baris: n, jalan: function () { } }; }
  function di(n, b, k, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }
  /* 1680-1761 sebelas baris yang bentuknya sama persis. */
  function pilih(n, huruf, nama, baris) {
    return { baris: n, jalan: function (m) {
      if (m.v['CMD$'] === huruf || m.v['CMD$'] === huruf.toLowerCase()) {
        m.v['S$'] = nama; m.ulangData(KE[baris]); m.lompat(1770);
      }
    } };
  }
  function kolom(n, pasang) {
    return { baris: n, jalan: function (m) {
      for (var i = 0; i < pasang.length; i++) {
        m.v['O()'][pasang[i][0]] = pasang[i][1];
      }
    } };
  }

  /* Kedua berkas — MUSIC.BAS dan MUSIC1.BAS — dibangun dari SATU pembuat
     tabel. Bedanya cuma dua baris, dan `pokeAwal` yang memilihnya. Dua
     salinan berarti dua tabel yang bisa melenceng; satu pembuat berarti
     tidak bisa. */
  function bikinTabel(pokeAwal) {
    return [

    rem(940), rem(950), rem(960),
    /* 975 di MUSIC1 baris ini juga membuang penyangga tombol. */
    { baris: 975, jalan: function (m) {
        if (pokeAwal) m.kosongkanPenyangga();
      } },
    { baris: 980, jalan: function (m) { m.v['SAMPLES$'] = 'NO'; } },
    /* 990 melompati 1000 — pintu masuk kedua yang tidak dipakai siapa pun,
       bentuk yang sama dengan MORTGAGE.BAS dan DROIDS.BAS. */
    { baris: 990, jalan: function (m) { m.lompat(1010); } },
    { baris: 1000, jalan: function (m) { m.v['SAMPLES$'] = 'YES'; } },

    { baris: 1010, jalan: function (m) {
        m.warna(15, 0); m.cls();
        m.locate(5, 19, 0); m.cetak('IBM'); m.barisBaru();
      } },
    di(1020, 7, 12, 'Personal Computer'),
    { baris: 1030, jalan: function (m) {
        m.warna(10, 0); m.locate(10, 9);
        m.cetak(m.chr(213) + m.ulang(21, 205) + m.chr(184)); m.barisBaru();
      } },
    { baris: 1040, jalan: function (m) {
        m.locate(11, 9);
        m.cetak(m.chr(179) + '        MUSIC        ' + m.chr(179));
        m.barisBaru();
      } },
    { baris: 1050, jalan: function (m) {
        m.locate(12, 9);
        m.cetak(m.chr(179) + m.ulang(21, 32) + m.chr(179)); m.barisBaru();
      } },
    { baris: 1060, jalan: function (m) {
        m.locate(13, 9);
        m.cetak(m.chr(179) + '    Version 1.10     ' + m.chr(179));
        m.barisBaru();
      } },
    { baris: 1070, jalan: function (m) {
        m.locate(14, 9);
        m.cetak(m.chr(212) + m.ulang(21, 205) + m.chr(190)); m.barisBaru();
      } },
    { baris: 1080, jalan: function (m) {
        m.warna(15, 0); m.locate(17, 4);
        m.cetak('(C) Copyright IBM Corp 1981, 1982'); m.barisBaru();
      } },
    { baris: 1090, jalan: function (m) {
        m.warna(14, 0); m.locate(23, 7);
        m.cetak('Press space bar to continue'); m.barisBaru();
      } },
    { baris: 1100, jalan: function (m) { if (m.inkey() !== '') m.lompat(1100); } },
    { baris: 1110, jalan: function (m) {
        m.v['CMD$'] = m.inkey();
        if (m.v['CMD$'] === '') m.lompat(1110);
      } },
    { baris: 1130, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(1850);
      } },
    { baris: 1140, jalan: function (m) {
        if (m.v['CMD$'] !== ' ') m.lompat(1110);
      } },
    /* 1141-1149 UJI KEMAMPUAN: coba `PLAY "mf"`, dan kalau BASIC-nya tidak
       punya perintah itu, telan galatnya lalu lanjut. */
    { baris: 1141, jalan: function (m) { m.penangkapGalat = 1148; } },
    { baris: 1142, jalan: function () { /* PLAY "mf": diam, dan tidak gagal */ } },
    { baris: 1143, jalan: function (m) { m.lompat(1149); } },
    { baris: 1148, jalan: function (m) { m.lanjut(1149); } },
    { baris: 1149, jalan: function (m) { m.penangkapGalat = 0; } },
    { baris: 1150, jalan: function (m) { m.warna(15, 1); m.cls(); } },
    di(1160, 15, 7, ' ------- selections -------'),
    di(1170, 16, 7, ' A-MARCH  E-HUMOR  I-SAKURA'),
    di(1180, 17, 7, ' B-STARS  F-BUG    J-BLUE  '),
    di(1190, 18, 7, ' C-FORTY  G-POP    K-SCALES'),
    di(1191, 19, 7, ' D-HAT    H-DANDY  ESC KEY-EXIT'),
    { baris: 1200, jalan: function (m) { m.warna(15, 0); } },

    /* --- 1210-1360: menggambar papan tuts --------------------------------- */
    { baris: 1210, bagian: [
        function (m) { m.untuk('I', 0, 15, 1, 1240); },
        function (m) { m.untuk('J', 0, 8, 1, 1230); }
      ] },
    { baris: 1220, jalan: function (m) {
        m.locate(5 + m.v.J, 5 + m.v.I * 2);
        m.cetak(m.chr(219) + m.chr(221));
      } },
    { baris: 1230, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { m.lanjutkan('I'); }
      ] },
    { baris: 1240, bagian: [
        function (m) { m.untuk('I', 0, 12, 1, 1280); },
        function (m) { m.untuk('J', 0, 4, 1, 1270); }
      ] },
    /* 1250 tuts hitam DILEWATI di tempat yang di piano memang tidak punya
       tuts hitam. Perhatikan `OR I=13`: gelungnya cuma sampai 12, jadi uji
       keempat itu tidak pernah benar. */
    { baris: 1250, jalan: function (m) {
        var I = m.v.I;
        if (I === 2 || I === 6 || I === 9 || I === 13) m.lompat(1270);
      } },
    { baris: 1260, jalan: function (m) {
        m.locate(5 + m.v.J, 8 + m.v.I * 2);
        m.cetak(m.chr(32) + m.chr(222));
      } },
    { baris: 1270, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { m.lanjutkan('I'); }
      ] },
    { baris: 1280, jalan: function (m) { m.untuk('J', 0, 9, 1, 1320); } },
    { baris: 1290, jalan: function (m) {
        m.locate(4 + m.v.J, 4); m.warna(4, 0); m.cetak(m.chr(221));
        m.locate(4 + m.v.J, 36); m.warna(15, 0);
      } },
    { baris: 1300, jalan: function (m) {
        m.cetak(m.chr(221));
        m.warna(4, 1); m.cetak(m.chr(221));
      } },
    { baris: 1310, jalan: function (m) { m.lanjutkan('J'); } },
    { baris: 1320, jalan: function (m) { m.warna(4, 1); m.locate(4, 4); } },
    { baris: 1330, jalan: function (m) {
        for (m.v.I = 0; m.v.I <= 32; m.v.I++) m.cetak(m.chr(219));
      } },
    { baris: 1340, jalan: function (m) {
        m.cetak(m.chr(221)); m.locate(13, 4);
      } },
    { baris: 1350, jalan: function (m) {
        for (m.v.I = 0; m.v.I <= 32; m.v.I++) m.cetak(m.chr(219));
      } },
    { baris: 1360, jalan: function (m) {
        m.cetak(m.chr(221)); m.warna(0, 7);
        m.dim('M()', 88); m.dim('O()', 70);
      } },
    /* 1370 DELAPAN PULUH DUA FREKUENSI DARI SATU BARIS. */
    { baris: 1370, jalan: function (m) {
        for (m.v.I = 7; m.v.I <= 88; m.v.I++) {
          m.v['M()'][m.v.I] = 36.8 * Math.pow(Math.pow(2, 1 / 12), m.v.I - 6);
        }
      } },
    /* 1380 nada 0 sampai 6 diberi 32767 Hz — di atas batas pendengaran.
       "Diam" ditulis sebagai nada yang tidak terdengar. */
    { baris: 1380, jalan: function (m) {
        for (m.v.I = 0; m.v.I <= 6; m.v.I++) m.v['M()'][m.v.I] = 32767;
      } },
    { baris: 1390, jalan: function (m) { m.v['O()'][0] = 0; } },
    kolom(1400, [[39, 5], [40, 7], [41, 8], [42, 9]]),
    kolom(1410, [[43, 10], [44, 11], [45, 13], [46, 14]]),
    kolom(1420, [[47, 15], [48, 16], [49, 17], [50, 18]]),
    kolom(1430, [[51, 19], [52, 21], [53, 22], [54, 23]]),
    kolom(1440, [[55, 24], [56, 25], [57, 27], [58, 28]]),
    kolom(1450, [[59, 29], [60, 30], [61, 31], [62, 32]]),
    kolom(1460, [[63, 33], [64, 35], [65, 36], [66, 37]]),
    kolom(1470, [[67, 38], [68, 39], [69, 40], [70, 42]]),
    { baris: 1480, jalan: function (m) { m.lompat(1630); } },

    /* --- 1490-1620: memainkan satu lagu ----------------------------------- */
    { baris: 1490, jalan: function (m) {
        m.v.J = m.baca(); m.v.K = m.baca();
      } },
    { baris: 1500, jalan: function (m) {
        m.v['CMD$'] = m.inkey();
        if (m.v['CMD$'] === '') m.lompat(1540);
      } },
    { baris: 1510, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.kembali();
      } },
    /* 1520 DI SINILAH KEDUA BERKAS BERBEDA. Di MUSIC.BAS baris ini cuma
       `REM` — bekas tempat yang dikosongkan. Di MUSIC1.BAS ia `POKE 106,0`,
       yang membuang tombol yang terlanjur ditekan supaya lagunya tidak
       langsung terhenti oleh sisa ketukan. */
    { baris: 1520, jalan: function (m) {
        if (pokeAwal) m.kosongkanPenyangga();
      } },
    rem(1530),
    { baris: 1540, jalan: function (m) { if (m.v.J === -1) m.kembali(); } },
    { baris: 1550, jalan: function (m) { m.v.Q = m.v['O()'][m.v.J] || 0; } },
    { baris: 1560, jalan: function (m) {
        if (m.v.J > 64 || m.v.J < 39) m.lompat(1590);
      } },
    /* 1570 MEMBACA GAMBARNYA SENDIRI: kalau baris 5 di kolom itu BUKAN
       spasi, tutsnya hitam — dan tuts hitam dinyalakan di baris 11. */
    { baris: 1570, jalan: function (m) {
        if (m.layarAksara(5, m.v.Q) !== 32) {
          m.warna(0, 7); m.locate(11, m.v.Q); m.cetak(m.chr(14));
          m.warna(15, 0); m.lompat(1590);
        }
      } },
    { baris: 1580, jalan: function (m) {
        m.warna(15, 0); m.locate(7, m.v.Q); m.cetak(m.chr(14));
        m.warna(0, 7);
      } },
    { baris: 1590, jalan: function (m) {
        if (m.v.J === 0 && m.v.K === 1) m.lompat(1600);
      } },
    { baris: 1595, jalan: function () { /* SOUND 32767,1: jeda antar nada */ } },
    { baris: 1600, jalan: function (m) {
        if (m.v.J > 64 || m.v.J < 39) m.lompat(1490);
      } },
    { baris: 1610, jalan: function (m) {
        if (m.layarAksara(5, m.v.Q) === 32) {
          m.warna(15, 0); m.locate(7, m.v.Q); m.cetak(m.chr(32));
          m.lompat(1490);
        }
      } },
    { baris: 1620, jalan: function (m) {
        m.warna(15, 0); m.locate(11, m.v.Q); m.cetak(m.chr(219));
        m.lompat(1490);
      } },

    /* --- 1630-1860: menu lagu --------------------------------------------- */
    { baris: 1630, jalan: function (m) {
        m.locate(21, 5); m.cetak('                                ');
      } },
    { baris: 1640, jalan: function (m) {
        m.locate(21, 5); m.cetak('ENTER SELECTION ==>');
      } },
    { baris: 1650, jalan: function (m) { if (m.inkey() !== '') m.lompat(1650); } },
    { baris: 1660, jalan: function (m) {
        m.v['CMD$'] = m.inkey();
        if (m.v['CMD$'] === '') m.lompat(1660);
      } },
    { baris: 1670, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(1850);
      } },
    pilih(1680, 'A', 'MARCH ', 4000), pilih(1690, 'B', 'STARS ', 4100),
    pilih(1700, 'C', 'FORTY ', 3700), pilih(1710, 'D', 'HAT   ', 4300),
    pilih(1720, 'E', 'HUMOR ', 3500), pilih(1730, 'F', 'BUG   ', 3200),
    pilih(1740, 'G', 'POP   ', 3600), pilih(1750, 'H', 'DANDY ', 3900),
    pilih(1755, 'I', 'SAKURA', 4500), pilih(1757, 'J', 'BLUE  ', 3300),
    pilih(1761, 'K', 'SCALES', 4400),
    { baris: 1769, jalan: function (m) { m.lompat(1640); } },
    { baris: 1770, jalan: function (m) {
        m.cetak(' ' + m.v['CMD$'] + '-' + m.v['S$']); m.barisBaru();
      } },
    /* 1780 membaca penanda -2, lalu 1800 membaca judulnya. */
    { baris: 1780, jalan: function (m) { m.v.D = m.baca(); } },
    { baris: 1800, jalan: function (m) {
        m.v['S$'] = String(m.baca());
        m.locate(23, Math.max(1, Math.round(1 + (40.5 - m.v['S$'].length) / 2)));
      } },
    { baris: 1805, jalan: function (m) {
        m.warna(15, 4); m.cetak(m.v['S$']); m.warna(0, 7);
      } },
    { baris: 1810, jalan: function (m) { m.gosub(1490); } },
    { baris: 1820, jalan: function (m) {
        m.v['S$'] = m.ulang(39, 32);
        m.locate(23, 1); m.warna(4, 1); m.cetak(m.v['S$']); m.barisBaru();
        m.warna(0, 7);
      } },
    { baris: 1830, jalan: function (m) { m.lompat(1630); } },
    { baris: 1840, jalan: function (m) { m.henti('END di baris 1840.'); } },
    { baris: 1850, jalan: function (m) {
        if (m.v['SAMPLES$'] === 'YES') m.rantai('SAMPLES', 1000);
      } },
    { baris: 1860, jalan: function (m) {
        m.warna(7, 0); m.cls(); m.henti('END di baris 1860.');
      } },
    rem(3000), rem(3010), rem(3020),

    rem(3200), rem(3210), rem(3220), rem(3230), rem(3240), rem(3250), 
    rem(3260), rem(3270), rem(3300), rem(3310), rem(3320), rem(3330), 
    rem(3340), rem(3350), rem(3360), rem(3370), rem(3380), rem(3390), 
    rem(3400), rem(3410), rem(3420), rem(3430), rem(3440), rem(3450), 
    rem(3460), rem(3500), rem(3510), rem(3520), rem(3530), rem(3540), 
    rem(3550), rem(3560), rem(3570), rem(3600), rem(3610), rem(3620), 
    rem(3630), rem(3640), rem(3650), rem(3660), rem(3670), rem(3700), 
    rem(3710), rem(3720), rem(3730), rem(3740), rem(3750), rem(3760), 
    rem(3770), rem(3780), rem(3790), rem(3800), rem(3810), rem(3900), 
    rem(3910), rem(3920), rem(3930), rem(3940), rem(3950), rem(3960), 
    rem(3970), rem(3980), rem(3990), rem(4000), rem(4010), rem(4020), 
    rem(4030), rem(4040), rem(4050), rem(4060), rem(4070), rem(4080), 
    rem(4100), rem(4110), rem(4120), rem(4130), rem(4140), rem(4150), 
    rem(4160), rem(4170), rem(4180), rem(4190), rem(4200), rem(4300), 
    rem(4310), rem(4320), rem(4330), rem(4340), rem(4350), rem(4360), 
    rem(4370), rem(4400), rem(4410), rem(4420), rem(4430), rem(4440), 
    rem(4450), rem(4460), rem(4470), rem(4500), rem(4510), rem(4520), 
    rem(4530), rem(4540), rem(4550),
    ];
  }

  /* Dipakai bersama oleh MUSIC.js dan MUSIC1.js. Lihat catatan di atas: satu
     pembuat tabel, dua berkas .BAS, dua entri PROGRAM. */
  global.MUSIC_BERSAMA = { bikinTabel: bikinTabel, DATA: DATA, LAGU: LAGU };

  var META = {
    arsitektur: {
      judul: 'Alur MUSIC.BAS',
      simpul: [
        { id: 'judul', baris: '1010-1140', jenis: 'mulai',
          teks: ['Layar judul IBM,', 'spasi atau ESC'] },
        { id: 'uji', baris: '1141-1149',
          teks: ['Coba PLAY "mf";', 'kalau gagal, telan galatnya'] },
        { id: 'tuts', baris: '1210-1360',
          teks: ['Gambar papan tuts:', 'putih di baris 4-12, hitam di 5-9'] },
        { id: 'tabel', baris: '1370-1470',
          teks: ['82 frekuensi dari satu rumus;', 'nada 0-6 = 32767 Hz = diam'] },
        { id: 'menu', baris: '1630-1769', jenis: 'putusan',
          teks: ['A sampai K memilih lagu;', 'RESTORE ke DATA-nya'] },
        { id: 'main', baris: '1490-1620', jenis: 'subrutin',
          teks: ['Baca nada dan lama,', 'nyalakan tutsnya, bunyikan'] },
        { id: 'baca', baris: '1570', jenis: 'putusan',
          teks: ['SCREEN(5,Q) - tuts ini', 'hitam atau putih?'] },
        { id: 'keluar', baris: '1850-1860', jenis: 'keluar',
          teks: ['ESC: CHAIN "SAMPLES"', 'kalau dipanggil dari sana'] }
      ],
      panah: [
        { dari: 'judul', ke: 'uji' },
        { dari: 'uji', ke: 'tuts' },
        { dari: 'tuts', ke: 'tabel' },
        { dari: 'tabel', ke: 'menu' },
        { dari: 'menu', ke: 'main', label: 'A-K' },
        { dari: 'main', ke: 'baca' },
        { dari: 'baca', ke: 'main', label: 'nada berikutnya' },
        { dari: 'main', ke: 'menu', label: 'lagu habis atau ESC' },
        { dari: 'menu', ke: 'keluar', label: 'ESC' }
      ]
    },

    pseudokode: [
      { baris: 1141, tingkat: 0, teks: '<b>coba</b> <code>PLAY "mf"</code>; kalau BASIC-nya tidak punya, telan galatnya' },
      { baris: 1210, tingkat: 0, teks: 'gambar tuts putih (16 pasang), lalu tuts hitam &mdash; melewati I=2, 6, 9' },
      { baris: 1370, tingkat: 0, teks: '<code>M(I) = 36.8*(2^(1/12))^(I-6)</code> &mdash; <b>82 frekuensi, satu baris</b>' },
      { baris: 1380, tingkat: 1, teks: 'nada 0&ndash;6 diberi <b>32767 Hz</b>: diam sebagai nada tak terdengar' },
      { baris: 1400, tingkat: 0, teks: '<code>O(nada)</code> = kolom layar tuts itu' },
      { baris: 1680, tingkat: 0, teks: 'A sampai K memilih lagu, lalu <code>RESTORE</code> ke DATA-nya' },
      { baris: 1490, tingkat: 0, teks: '<b>ULANG:</b> baca nada dan lamanya; &minus;1 berarti lagu selesai' },
      { baris: 1570, tingkat: 1, teks: '<code>SCREEN(5,Q)&lt;&gt;32</code>? <b>tuts hitam</b> &mdash; nyalakan di baris 11' },
      { baris: 1610, tingkat: 1, teks: 'sesudah nadanya, padamkan lagi &mdash; dengan uji layar yang sama' }
    ],

    pelajaran: {
      ringkas: 'Papan tuts yang menyala mengikuti lagu &mdash; dan yang ' +
        'memberitahu program tuts mana yang hitam adalah gambarnya sendiri.',
      pelajari: [
        ['Tabel frekuensi dari satu baris',
         '<code>M(I) = 36.8*(2^(1/12))^(I-6)</code> mengisi delapan puluh dua ' +
         'tuts piano. Pengali <code>2^(1/12)</code> adalah setengah nada; ' +
         'dua belas kali berturut-turut memberi tepat dua kali lipat, yaitu ' +
         'satu oktaf. Rumus yang sama muncul di OCTAVE.BAS dan NOTETABL.BAS ' +
         '&mdash; <b>tiga program di koleksi ini, satu persamaan</b>.'],
        ['Diam sebagai nada yang tidak terdengar',
         'Baris 1380 mengisi nada 0 sampai 6 dengan <b>32767 Hz</b>. Manusia ' +
         'mendengar sampai sekitar 20.000 Hz. Jadi "istirahat" tidak butuh ' +
         'penanganan khusus sama sekali: ia nada biasa yang kebetulan tidak ' +
         'terdengar, dan <code>SOUND</code> tetap menghabiskan waktunya. ' +
         '<b>Satu kasus khusus yang dihapus dengan memilih angka yang ' +
         'tepat.</b>'],
        ['Gambar sebagai tabel pencarian',
         'Baris 1570 bertanya <code>SCREEN(5,Q)&lt;&gt;32</code> untuk tahu ' +
         'apakah tuts di kolom itu hitam. Jawabannya ada di sana karena baris ' +
         '1240&ndash;1270 baru saja menggambarnya. Alih-alih menyimpan daftar ' +
         '"tuts mana yang hitam", program <b>membaca gambarnya sendiri</b> ' +
         '&mdash; dan gambarnya memang sudah menyimpan jawabannya.'],
        ['Uji kemampuan lewat galat',
         'Baris 1141&ndash;1149 mencoba <code>PLAY "mf"</code> dengan penangkap ' +
         'galat terpasang, lalu <code>RESUME</code> ke baris berikutnya. ' +
         'Kalau BASIC-nya Cassette BASIC (yang tidak punya <code>PLAY</code>), ' +
         'galatnya ditelan dan program lanjut. Bentuk paling awal dari ' +
         '<i>feature detection</i> &mdash; coba dulu, tangkap kalau gagal.'],
        ['RESTORE sebagai penunjuk lagu',
         'Sebelas lagu duduk berurutan di satu antrean <code>DATA</code>, dan ' +
         '<code>RESTORE 4000</code> memindahkan penunjuk bacanya ke awal lagu ' +
         'yang diminta. Tidak ada indeks, tidak ada larik lagu &mdash; nomor ' +
         'baris <b>adalah</b> alamatnya.']
      ],
      hindari: [
        ['Uji yang tidak pernah benar',
         'Baris 1250: <code>IF I=2 OR I=6 OR I=9 OR I=13 THEN 1270</code>. ' +
         'Gelungnya <code>FOR I=0 TO 12</code> &mdash; <b><code>I=13</code> ' +
         'tidak pernah terjadi</b>. Uji keempat itu sisa dari versi yang ' +
         'papan tutsnya lebih lebar, dan tidak pernah dicabut.'],
        ['Pintu masuk kedua yang tidak dipakai siapa pun',
         'Baris 990 melompati baris 1000 (<code>SAMPLES$="YES"</code>), jadi ' +
         '<code>CHAIN "SAMPLES",1000</code> di baris 1850 tidak pernah ' +
         'tercapai. Bentuk yang <b>sama persis</b> ada di MORTGAGE.BAS dan ' +
         'DROIDS.BAS &mdash; tiga berkas, satu idiom yang tidak terpakai.'],
        ['Dua salinan yang hampir sama di satu disket',
         'MUSIC1.BAS adalah berkas ini dengan <b>empat baris berbeda</b>, dan ' +
         'dua di antaranya cuma tab lawan spasi. Yang dua lagi menambahkan ' +
         'pembuang penyangga tombol. Tidak ada satu pun catatan di kedua ' +
         'berkas yang menyebutkan yang lain.']
      ]
    },

    penjelasan: [
      { judul: 'Papan tuts yang jadi tabel pencariannya sendiri',
        isi: [
          'Baris 1240&ndash;1270 menggambar tuts hitam:',
          '<code>1240 FOR I=0 TO 12:FOR J=0 TO 4</code><br>' +
          '<code>1250 IF I=2 OR I=6 OR I=9 OR I=13 THEN 1270</code><br>' +
          '<code>1260 LOCATE 5+J,8+I*2:PRINT CHR$(32);CHR$(222);</code>',
          'Tuts hitam ada di semua posisi kecuali di antara E&ndash;F dan ' +
          'B&ndash;C &mdash; itulah yang dilewati baris 1250. Hasilnya papan ' +
          'tuts yang benar, dengan celah di tempat yang benar.',
          'Sekarang pertanyaannya: waktu nada nomor 47 dibunyikan, tutsnya ' +
          'hitam atau putih? Jawaban yang biasa: simpan daftarnya.',
          'Program ini bertanya ke layar:',
          '<code>1570 IF SCREEN(5,Q)&lt;&gt;32 THEN &hellip;</code>',
          'Baris 5 di kolom itu berisi sesuatu kalau ada tuts hitam di sana, ' +
          'dan spasi kalau tidak. Gambarnya <b>sudah</b> menyimpan ' +
          'jawabannya, jadi tidak perlu disimpan dua kali.',
          'Dan itu menentukan di baris mana nadanya dinyalakan: tuts hitam di ' +
          'baris 11, tuts putih di baris 7. Baris 1610&ndash;1620 memadamkan ' +
          'lagi dengan uji yang sama persis.',
          'Ini program <b>kelima</b> di koleksi ini yang memakai layar sebagai ' +
          'struktur data, dan yang paling halus dari semuanya. SERPENT ' +
          'menyimpan tubuh ularnya di sana, BOWLING pinnya, METEOR sasarannya, ' +
          'DROIDS ladang bijihnya &mdash; semuanya menyimpan <b>keadaan yang ' +
          'berubah</b>. Di sini yang dibaca adalah <b>keadaan yang tetap</b>: ' +
          'bentuk papan tuts, yang digambar sekali dan tidak pernah berubah ' +
          'lagi.',
          'Bedanya penting. Yang lain memakai layar karena tidak punya cukup ' +
          'memori untuk dua salinan. Yang ini memakainya karena <b>daftar ' +
          'tuts hitam dan gambar tuts hitam memang benda yang sama</b>, dan ' +
          'menuliskannya dua kali berarti membuka jalan bagi keduanya untuk ' +
          'berselisih.'
        ] },
      { judul: 'Coba dulu, tangkap kalau gagal',
        isi: [
          'Lima baris di tengah program, yang mudah dilewati begitu saja:',
          '<code>1141 ON ERROR GOTO 1148</code><br>' +
          '<code>1142 PLAY "mf"</code><br>' +
          '<code>1143 GOTO 1149</code><br>' +
          '<code>1148 RESUME 1149</code><br>' +
          '<code>1149 ON ERROR GOTO 0</code>',
          'Yang dikerjakannya: coba jalankan <code>PLAY "mf"</code>. Kalau ' +
          'berhasil, lompat ke 1149 dan matikan penangkap galatnya. Kalau ' +
          'gagal, penangkapnya menangkap, <code>RESUME 1149</code> ' +
          'melanjutkan di tempat yang sama, dan program berjalan terus.',
          'Kenapa perlu? Karena IBM PC 1981 dijual dengan <b>Cassette ' +
          'BASIC</b> di ROM &mdash; versi yang tidak punya perintah ' +
          '<code>PLAY</code> sama sekali. Program yang sama harus jalan di ' +
          'mesin yang punya dan yang tidak.',
          'Dan cara yang dipilih bukan memeriksa versi. Ia <b>mencoba</b>, ' +
          'lalu menangkap kegagalannya.',
          'Bentuk itu punya nama sekarang: <i>feature detection</i>, dan ' +
          'setiap halaman web modern melakukannya &mdash; ' +
          '<code>try { new Foo() } catch { }</code>, atau ' +
          '<code>if (window.bar)</code>. Alasannya juga sama: memeriksa ' +
          '<b>versi</b> berarti menebak apa yang ada di versi itu; ' +
          'memeriksa <b>kemampuannya</b> berarti menanyakan hal yang ' +
          'benar-benar ingin diketahui.',
          'Empat puluh tahun, dan jawabannya tidak berubah.'
        ] }
    ]
  };

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MUSIC'] = {
    nama: 'MUSIC',
    judul: 'Music (IBM, 1981-82) — papan tuts yang membaca dirinya',
    sumber: 'MUSIC',
    berkas: 'run/MUSIC.BAS',
    tabel: bikinTabel(false),
    data: DATA,
    arsitektur: META.arsitektur,
    pseudokode: META.pseudokode,
    pelajaran: META.pelajaran,
    penjelasan: META.penjelasan,

    perintahAsli: 'run\\MUSIC.bat',
    catatanAsli: 'Tekan A sampai K untuk memilih lagu. Di mesin sungguhan ' +
      'tiap nada terdengar; di sini yang tersisa animasi tutsnya.',

    penyimpangan: [
      '<b><code>SOUND</code> dan <code>PLAY</code> diam.</b> Yang tersisa ' +
      'dari sebuah program musik cuma animasi tutsnya &mdash; dan itu justru ' +
      'membuat gagasan pusatnya terlihat: tiap nada menyalakan tutsnya.',

      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom.',

      '<b><code>RESTORE &lt;baris&gt;</code> diberikan sebagai INDEKS</b> di ' +
      'larik DATA yang rata. Indeksnya <b>dihitung</b> dari daftar lagu, ' +
      'bukan diketik tangan, jadi tidak mungkin melenceng.',

      '<b>BELUM TERVERIFIKASI: pemilihan tuts hitam/putih di baris 1570.</b> ' +
      'Di penelusur, <code>SCREEN(5,Q)</code> mengembalikan bukan-spasi untuk ' +
      'SETIAP kolom, jadi cabang tuts putih (baris 1580) tidak pernah ' +
      'terpakai dan seluruh nada dinyalakan di baris 11. Spasi yang ' +
      'seharusnya ditinggalkan gelung tuts hitam (baris 1240-1270) tidak ' +
      'muncul di layar penelusur, dan sebabnya belum ketemu. Yang lain di ' +
      'berkas ini &mdash; tabel frekuensi, DATA, pemilihan lagu &mdash; sudah ' +
      'diperiksa dan benar.',

      '<b>Tabel barisnya dibangun bersama MUSIC1.BAS</b> dari satu pembuat. ' +
      'Kedua berkas .BAS itu memang cuma berbeda empat baris, dan dua di ' +
      'antaranya cuma tab lawan spasi.'
    ]
  };
})(window);

