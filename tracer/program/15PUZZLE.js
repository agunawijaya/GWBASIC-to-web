/* ===========================================================================
   15PUZZLE.js — porting minimalis 15PUZZLE.BAS sebagai tabel baris.

       100 REM                 The 15 Puzzle
       101 REM                         by Dale Dewey
       102 REM                            7284 High View Trail
       103 REM                            Victor, New York  14564
       104 REM                 Copyright, 1982

   Permainan geser ubin lima belas, di layar grafik CGA. Seratus tujuh belas
   baris, dan alamat penulisnya lengkap dengan kode posnya.

   YANG PALING LAYAK DILIHAT: ANGKANYA ADALAH TEMBOK.

   Tiap ubin digambar dengan tiga pernyataan, dan urutannya yang penting:

       1160 PAINT (45+32*X0,37+24*Y0),0,3      hapus: cat seluruh petak jadi 0
       1180 PRINT USING "##";N0                cetak angkanya (warna 3)
       1190 PAINT (45+32*X0,37+24*Y0),C0,3     isi lagi, BATAS warna 3

   Cat yang terakhir mengalir dari tengah petak dan berhenti di warna 3. Yang
   berwarna 3 di dalam petak itu cuma satu hal: CORETAN ANGKANYA. Jadi catnya
   mengalir MENGELILINGI angka, dan angka itu selamat.

   Angka yang barusan dicetak dipakai sebagai dinding penahan cat. Tidak ada
   satu pun baris yang menyimpan bentuk angkanya, tidak ada topeng, tidak ada
   penyalinan. Cukup dicetak lebih dulu, lalu dicat mengitarinya.

   DAN SETENGAH TEKA-TEKINYA TIDAK BISA DISELESAIKAN.

   Baris 990-1060 mengocok enam belas angka dengan cara paling jujur: ambil
   acak, tolak kalau sudah terpakai, ulangi. Hasilnya permutasi acak yang
   benar-benar seragam — dan di situlah masalahnya. Hanya SEPARUH permutasi
   papan lima belas yang bisa dikembalikan ke urutan. Program ini tidak pernah
   memeriksanya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` dan `SOUND` diam.
   - `PEEK(&H410)` (baris 210) menguji adakah kartu warna; penelusur selalu
     menjawab "ada", jadi baris 220-280 tidak pernah dicapai.
   - `ON ERROR GOTO 130` + `PLAY "mf"` (baris 110-130) menguji adakah BASICA.
     Penelusur selalu lulus, jadi baris 140-190 juga tidak pernah dicapai.
   - `RANDOMIZE VAL(RIGHT$(TIME$,2))` diganti benih tetap, supaya kocokan
     yang sama bisa ditelusuri dua kali.
   - `DEF SEG: POKE &H4E,n` ditiru sungguhan sebagai warna huruf — lihat
     catatan di `mesin/penjalan.js`.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }
  /* `DEFINT I-N`: I sampai N bulat. Yang kena di sini I, J, N0, MOVE — dan
     penugasan ke sana membulatkan. */
  function set(m, nama, nilai) { m.v[nama] = Math.round(nilai); }

  /* --- 100-105: judul dan alamat penulisnya -------------------------------- */
  [100, 101, 102, 103, 104, 105].forEach(rem);

  /* --- 110-190: adakah BASICA? --------------------------------------------
     `PLAY "mf"` cuma dipakai sebagai UMPAN: kalau penafsirnya BASIC biasa,
     pernyataan itu melempar galat 73 ("Advanced Feature") dan penangkap di
     baris 130 menangkapnya. Cara menguji kemampuan tanpa bertanya. */
  T({ baris: 110, jalan: function (m) { m.penangkapGalat = 130; } });
  T({ baris: 120, jalan: function (m) { m.penangkapGalat = 0; m.lompat(200); } });
  T({ baris: 130, jalan: function (m) {
      if (m.err !== 73) m.lanjut(200);
    } });
  T({ baris: 140, jalan: function (m) { m.cls(); m.locate(3, 1); } });
  T({ baris: 150, jalan: function (m) {
      m.cetak("You're NOT using BASICA!"); m.barisBaru();
    } });
  T({ baris: 160, jalan: function (m) {
      m.cetak('This program uses advanced features.'); m.barisBaru();
    } });
  T({ baris: 170, jalan: function (m) {
      m.cetak('PRESS any key to continue.'); m.barisBaru();
    } });
  T({ baris: 180, jalan: function (m) { if (m.inkey() === '') m.lompat(180); } });
  T({ baris: 190, jalan: function (m) { m.lanjut(650); } });

  /* --- 200-280: adakah kartu warna? --------------------------------------- */
  T({ baris: 200, jalan: function () { /* DEF SEG=0 */ } });
  T({ baris: 210, jalan: function (m) { m.lompat(290); } });
  T({ baris: 220, jalan: function (m) { m.cls(); m.locate(3, 1); } });
  T({ baris: 230, jalan: function (m) {
      m.cetak("You're NOT using the COLOR/GRAPHICS Monitor Adapter!");
      m.barisBaru();
    } });
  T({ baris: 240, jalan: function (m) {
      m.cetak('This program uses graphics and requires that adapter.');
      m.barisBaru();
    } });
  T({ baris: 250, jalan: function (m) {
      m.cetak('PRESS any key to continue.'); m.barisBaru();
    } });
  T({ baris: 260, jalan: function () { /* DEF SEG */ } });
  T({ baris: 270, jalan: function (m) { if (m.inkey() === '') m.lompat(270); } });
  T({ baris: 280, jalan: function (m) { m.lompat(650); } });

  /* --- 290-330: siapkan papan ---------------------------------------------
     `ST(16)` daftar kocokan, `S(5,5)` papan. Papannya cuma dipakai 1..4 di
     kedua sumbu; baris dan kolom nol serta lima ada karena DIM memberi batas
     ATAS, dan penulisnya memilih lebih daripada kurang. */
  T({ baris: 290, jalan: function () { /* DEFINT I-N */ } });
  T({ baris: 300, jalan: function (m) { m.dim('ST()', 16); m.dim('S()', 5, 5); } });
  T({ baris: 310, jalan: function (m) {
      m.cls(); m.layar(1); m.warna(0, 1);
    } });
  T({ baris: 320, jalan: function (m) {
      m.locate(1, 14); m.cetak('The 15 Puzzle');
    } });
  T({ baris: 330, jalan: function (m) { m.gosub(680); } });
  T({ baris: 340, jalan: function (m) { set(m, 'MOVE', 0); } });

  /* --- 345-430: satu tombol ----------------------------------------------- */
  T({ baris: 345, jalan: function (m) {
      m.locate(23, 13);
      m.cetak('Move =>> ' + m.chr(27) + m.chr(24) + m.chr(25) + m.chr(26));
    } });
  T({ baris: 350, jalan: function (m) {
      m.v['ANS$'] = m.inkey();
      if (m.v['ANS$'] === '') m.lompat(350);
    } });
  /* 355 `WHILE+ INKEY$<>"":WEND` — dengan tanda TAMBAH nyasar sesudah WHILE.
     GW-BASIC menerimanya sebagai plus uner dan tidak berkata apa-apa. Gunanya
     mengosongkan penyangga tombol: apa pun yang tertumpuk selama gambar
     terakhir dibuang, jadi ubin tidak melesat beberapa langkah sekaligus. */
  T({ baris: 355, jalan: function (m) { while (m.inkey() !== '') { /* buang */ } } });
  /* 360 ELSE-nya menempel pada IF yang KEDUA, bukan yang pertama. Jadi
     tombol biasa selain Q pergi ke 430 (pesan "Illegal Move"), sedangkan
     tombol panah — yang panjangnya DUA aksara — jatuh lewat ke baris 370. */
  T({ baris: 360, jalan: function (m) {
      if (m.v['ANS$'].length === 1) {
        if (m.v['ANS$'] === 'Q' || m.v['ANS$'] === 'q') m.lompat(630);
        else m.lompat(430);
      }
    } });
  T({ baris: 370, jalan: function (m) {
      set(m, 'Q', m.v['ANS$'].charCodeAt(m.v['ANS$'].length - 1));
    } });
  /* 390-420 XZ,YZ adalah letak petak KOSONG. Menekan panah atas memindahkan
     ubin di ATAS kekosongan turun ke sana — jadi yang bergerak berlawanan
     dengan arah tombolnya, dan itu memang yang terasa benar. */
  T({ baris: 390, jalan: function (m) {
      if (m.v.Q === 72 && m.v.YZ > 1) {
        set(m, 'X0', m.v.XZ); set(m, 'Y0', m.v.YZ - 1); m.lompat(440);
      }
    } });
  T({ baris: 400, jalan: function (m) {
      if (m.v.Q === 75 && m.v.XZ > 1) {
        set(m, 'X0', m.v.XZ - 1); set(m, 'Y0', m.v.YZ); m.lompat(440);
      }
    } });
  T({ baris: 410, jalan: function (m) {
      if (m.v.Q === 77 && m.v.XZ < 4) {
        set(m, 'X0', m.v.XZ + 1); set(m, 'Y0', m.v.YZ); m.lompat(440);
      }
    } });
  T({ baris: 420, jalan: function (m) {
      if (m.v.Q === 80 && m.v.YZ < 4) {
        set(m, 'X0', m.v.XZ); set(m, 'Y0', m.v.YZ + 1); m.lompat(440);
      }
    } });
  T({ baris: 430, bagian: [
      function (m) { m.gosub(610); },
      function (m) { m.lompat(350); }
    ] });

  /* --- 440-530: pindahkan ubin --------------------------------------------
     Dua kali GOSUB 1150 dengan `C0` yang berbeda: sekali menggambar petak
     ASAL sebagai kekosongan (warna 0), sekali menggambar petak TUJUAN sebagai
     ubin (warna 2). Satu subrutin, dipakai untuk dua hal yang berlawanan. */
  T({ baris: 440, jalan: function (m) { set(m, 'MOVE', m.v.MOVE + 1); } });
  T({ baris: 450, jalan: function (m) {
      var S = m.v['S()'];
      var t = S[m.v.Y0][m.v.X0];
      S[m.v.Y0][m.v.X0] = S[m.v.YZ][m.v.XZ];
      S[m.v.YZ][m.v.XZ] = t;
    } });
  T({ baris: 460, jalan: function (m) {
      set(m, 'N0', m.v['S()'][m.v.Y0][m.v.X0]); set(m, 'C0', 0);
    } });
  T({ baris: 470, jalan: function (m) { m.gosub(1150); } });
  /* 480 SWAP dipakai untuk menukar PENUNJUK, bukan isi papan: sesudah baris
     ini, (Y0,X0) menunjuk petak yang tadinya kosong dan (YZ,XZ) menunjuk
     kekosongan yang baru. */
  T({ baris: 480, jalan: function (m) {
      var t;
      t = m.v.Y0; m.v.Y0 = m.v.YZ; m.v.YZ = t;
      t = m.v.X0; m.v.X0 = m.v.XZ; m.v.XZ = t;
    } });
  T({ baris: 490, jalan: function (m) {
      set(m, 'N0', m.v['S()'][m.v.Y0][m.v.X0]); set(m, 'C0', 2);
    } });
  T({ baris: 500, jalan: function (m) { m.gosub(1150); } });
  T({ baris: 510, jalan: function (m) {
      m.locate(5, 14); m.cetakFormat('Move ####', m.v.MOVE);
    } });
  T({ baris: 520, jalan: function (m) { m.gosub(560); } });
  T({ baris: 530, jalan: function (m) { if (m.v.WIN !== 1) m.lompat(350); } });
  T({ baris: 540, jalan: function (m) {
      m.locate(23, 12); m.cetak('You have WON!');
    } });
  T({ baris: 550, jalan: function (m) { m.lompat(630); } });

  /* --- 560-620: sudah menang? ---------------------------------------------
     Dua gelung bersarang yang KELUAR LEWAT RETURN, bukan lewat NEXT. Tiap
     kali dipanggil, keduanya meninggalkan bingkai gelung menggantung — dan
     yang menyelamatkannya aturan GW-BASIC: `FOR` dengan nama yang sama
     membuang bingkai lama. Tanpa aturan itu tumpukannya bertambah tiap
     langkah dan program mati sesudah beberapa puluh gerakan. */
  T({ baris: 560, jalan: function (m) { m.untuk('I', 1, 4, 1, 610); } });
  T({ baris: 570, jalan: function (m) { m.untuk('J', 1, 4, 1, 600); } });
  /* 580 begitu sampai di petak kanan-bawah, semuanya sudah benar — jadi tidak
     perlu memeriksa apakah petak itu kosong. Ia PASTI kosong: lima belas
     angka lain sudah ada di tempatnya masing-masing. */
  T({ baris: 580, jalan: function (m) {
      if (m.v.I === 4 && m.v.J === 4) { m.v.WIN = 1; m.kembali(); }
    } });
  T({ baris: 590, jalan: function (m) {
      if (m.v['S()'][m.v.I][m.v.J] !== m.v.J + (m.v.I - 1) * 4) {
        m.v.WIN = 0; m.kembali();
      }
    } });
  T({ baris: 600, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) { m.lanjutkan('I'); }
    ] });
  /* 610 jatuh dari 600 TIDAK PERNAH terjadi — gelung di 560-600 selalu keluar
     lewat RETURN. Baris ini hanya dicapai lewat `GOSUB 610` di baris 430. */
  T({ baris: 610, bagian: [
      function (m) { m.locate(24, 13); m.cetak('Illegal Move!!'); },
      function (m) { m.untuk('I', 1, 2000, 1); },
      function (m) { m.lanjutkan('I'); },
      function (m) { m.locate(24, 13); m.cetak('              '); }
    ] });
  T({ baris: 620, jalan: function (m) { m.kembali(); } });

  /* --- 630-670: sekali lagi? ---------------------------------------------- */
  T({ baris: 630, bagian: [
      function (m) {
        m.locate(25, 1); m.cetak('Would you like another puzzle? ');
      },
      function (m) { m.masukan('ANS$', ''); }
    ] });
  T({ baris: 640, jalan: function (m) {
      if (m.v['ANS$'] === 'Y' || m.v['ANS$'] === 'y') m.lompat(310);
    } });
  T({ baris: 650, jalan: function (m) { m.penangkapGalat = 670; } });
  /* 660 `END 'RUN "MENU"` — jalan pulang ke menu disunting jadi komentar,
     sama seperti belasan program lain di koleksi ini. */
  T({ baris: 660, jalan: function (m) { m.henti('END di baris 660 — jalan ke MENU sudah jadi komentar.'); } });
  T({ baris: 670, jalan: function (m) {
      m.layar(0); m.warna(7, 0); m.penangkapGalat = 0; m.henti('END di baris 670.');
    } });

  /* --- 680-970: menggambar layar ------------------------------------------ */
  rem(680);
  /* 690-700 dua kotak padat, 710-730 tiga bingkai. Warna yang dilewati
     (`LINE (224,24)-(319,167),,B`) berarti "pakai warna yang sedang berlaku"
     — dan itu 3, warna cerah palet 1. */
  T({ baris: 690, jalan: function (m) { m.garis(0, 25, 50, 44, 1, 'BF'); } });
  T({ baris: 700, jalan: function (m) { m.garis(0, 162, 50, 181, 1, 'BF'); } });
  T({ baris: 710, jalan: function (m) { m.garis(224, 24, 319, 167, null, 'B'); } });
  T({ baris: 720, jalan: function (m) { m.garis(66, 50, 205, 157, null, 'B'); } });
  T({ baris: 730, jalan: function (m) { m.garis(71, 55, 200, 152, null, 'B'); } });
  /* 740 cat DI ANTARA dua bingkai: titik (70,54) ada di sela antara bingkai
     luar 720 dan bingkai dalam 730. Batasnya warna 3, jadi catnya terkurung
     di lorong selebar lima piksel itu dan membentuk pigura. */
  T({ baris: 740, jalan: function (m) { m.cat(70, 54, 3, 3); } });
  T({ baris: 750, bagian: [
      function (m) { m.untuk('I', 1, 3, 1, 760); },
      function (m) {
        m.garis(71 + 32 * m.v.I, 55, 71 + 32 * m.v.I, 152);
        m.garis(71, 55 + 24 * m.v.I, 200, 55 + 24 * m.v.I);
      },
      function (m) { m.lanjutkan('I'); }
    ] });
  /* 760-780 dua belas elips sepusat dengan aspek 2,5 — jadi jangkung, bukan
     bulat. Yang pertama berjari-jari NOL: satu titik. */
  T({ baris: 760, jalan: function (m) { m.untuk('I', 0, 55, 5, 790); } });
  T({ baris: 770, jalan: function (m) {
      m.lingkaran(25, 103, m.v.I, 1, null, null, 2.5);
    } });
  T({ baris: 780, jalan: function (m) { m.lanjutkan('I'); } });
  /* 790 warna huruf diubah lewat POKE, karena di mode grafik tidak ada
     pernyataan BASIC yang bisa melakukannya. Lihat catatan di kepala berkas. */
  T({ baris: 790, jalan: function (m) { m.warnaTeks(1); } });
  [['This  is a', 5], ['computer  ', 6], ['version of', 7], ['   the    ', 8],
   ['15-PUZZLE.', 9], ['The object', 11], ['is to move', 12],
   ['the blocks', 13], ['to  form a', 14], ['pattern of', 15],
   ['1-4,  5-8,', 16], ['9-12,  and', 17], ['13-15 with', 18],
   ['one  empty', 19], ['space!!   ', 20]
  ].forEach(function (p, i) {
    /* Tiap baris teksnya dipanjangkan dengan spasi sampai sepuluh aksara,
       supaya rata kanan-kirinya tanpa satu pun perhitungan. */
    var nomor = 800 + i * 10;
    T({ baris: nomor, jalan: function (m) {
        m.locate(p[1], 30); m.cetak(p[0]); m.barisBaru();
      } });
  });
  T({ baris: 950, jalan: function (m) {
      m.locate(25, 12); m.cetak("ENTER `Q' to quit");
    } });
  T({ baris: 960, jalan: function (m) { m.warnaTeks(3); } });
  T({ baris: 970, jalan: function () { /* PLAY "mbt160" */ } });

  /* --- 980-1140: kocok, lalu gambar --------------------------------------- */
  T({ baris: 980, jalan: function () { /* RANDOMIZE VAL(RIGHT$(TIME$,2)) */ } });
  T({ baris: 990, jalan: function (m) { m.untuk('I', 1, 16, 1, 1070); } });
  /* 1000 ambil acak, 1020-1040 tolak kalau sudah terpakai, 1030 kembali ke
     1000. Kocokan tolak-ulang: jujur dan seragam, dan makin lambat makin ke
     belakang — angka terakhir rata-rata butuh enam belas percobaan. */
  T({ baris: 1000, jalan: function (m) {
      m.v['ST()'][m.v.I] = Math.floor(m.acak() * 16) + 1;
    } });
  T({ baris: 1010, jalan: function (m) { if (m.v.I === 1) m.lompat(1060); } });
  T({ baris: 1020, jalan: function (m) { m.untuk('J', 1, m.v.I - 1, 1, 1050); } });
  T({ baris: 1030, jalan: function (m) {
      if (m.v['ST()'][m.v.I] === m.v['ST()'][m.v.J]) m.lompat(1000);
    } });
  T({ baris: 1040, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 1050, jalan: function () { /* SOUND ST(I)*100,0.75 */ } });
  T({ baris: 1060, jalan: function (m) { m.lanjutkan('I'); } });
  /* 1070-1130 daftar kocokan dituang ke papan MENURUT KOLOM: `ST(I+J*4)`
     berjalan menurun dulu, baru ke kanan. Karena daftarnya acak, arah
     penuangan tidak mengubah apa pun — tapi ia menjelaskan kenapa indeksnya
     terbalik dibanding gelungnya. */
  T({ baris: 1070, jalan: function (m) { m.untuk('I', 1, 4, 1, 1140); } });
  T({ baris: 1080, jalan: function (m) { m.untuk('J', 0, 3, 1, 1130); } });
  T({ baris: 1090, jalan: function (m) {
      set(m, 'X0', m.v.J + 1); set(m, 'Y0', m.v.I);
      m.v['S()'][m.v.Y0][m.v.X0] = m.v['ST()'][m.v.I + m.v.J * 4];
    } });
  /* 1100 angka 16 adalah KEKOSONGAN. Ia diubah jadi nol dan letaknya
     diingat — satu-satunya keadaan papan yang disimpan di luar larik. */
  T({ baris: 1100, jalan: function (m) {
      if (m.v['S()'][m.v.Y0][m.v.X0] === 16) {
        m.v['S()'][m.v.Y0][m.v.X0] = 0; set(m, 'C0', 0);
        set(m, 'YZ', m.v.Y0); set(m, 'XZ', m.v.X0);
      } else set(m, 'C0', 2);
    } });
  T({ baris: 1110, jalan: function (m) {
      set(m, 'N0', m.v['S()'][m.v.Y0][m.v.X0]);
    } });
  T({ baris: 1120, jalan: function (m) { m.gosub(1150); } });
  T({ baris: 1130, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) { m.lanjutkan('I'); }
    ] });
  T({ baris: 1140, jalan: function (m) { m.kembali(); } });

  /* --- 1150-1200: satu petak ---------------------------------------------- */
  rem(1150);
  /* 1160 hapus dulu: cat SELURUH petak dengan warna 0. */
  T({ baris: 1160, jalan: function (m) {
      m.cat(45 + 32 * m.v.X0, 37 + 24 * m.v.Y0, 0, 3);
    } });
  T({ baris: 1170, jalan: function (m) {
      m.locate(6 + m.v.Y0 * 3, 7 + m.v.X0 * 4);
    } });
  /* 1180 `"  "` lalu DUA kali CHR$(29) — cetak dua spasi, mundur dua. Itu
     cara menghapus dua aksara tanpa memindahkan kursor. */
  T({ baris: 1180, bagian: [
      function (m) { m.cetak('  ' + m.chr(29) + m.chr(29)); },
      function (m) {
        if (m.v.N0 !== 0) m.cetakFormat('##', m.v.N0);   /* PLAY "L16ac" */
      }
    ] });
  /* 1190 DAN INILAH BARISNYA. Cat mengalir dari tengah petak dan berhenti di
     warna 3. Yang berwarna 3 di dalam petak cuma coretan angka yang baru
     saja dicetak — jadi catnya mengitarinya, dan angkanya selamat. */
  T({ baris: 1190, jalan: function (m) {
      m.cat(45 + 32 * m.v.X0, 37 + 24 * m.v.Y0, m.v.C0, 3);
    } });
  T({ baris: 1200, jalan: function (m) { m.kembali(); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['15PUZZLE'] = {
    nama: '15PUZZLE',
    judul: 'The 15 Puzzle (Dale Dewey, 1982)',
    sumber: '15PUZZLE',
    berkas: 'run/15PUZZLE.BAS',
    tabel: tabel,
    benih: 15,

    arsitektur: {
      judul: 'Alur 15PUZZLE.BAS',
      simpul: [
        { id: 'uji', baris: '110-280', jenis: 'mulai',
          teks: ['PLAY sebagai umpan galat,', 'lalu PEEK kartu warna'] },
        { id: 'gambar', baris: '680-970',
          teks: ['Bingkai, pigura, elips,', 'papan petunjuk'] },
        { id: 'kocok', baris: '990-1060',
          teks: ['Enam belas angka,', 'tolak-ulang sampai unik'] },
        { id: 'tuang', baris: '1070-1130',
          teks: ['Dituang ke papan menurut kolom;', '16 jadi kekosongan'] },
        { id: 'tombol', baris: '345-430', jenis: 'putusan',
          teks: ['Satu tombol; panah dua aksara', 'jatuh lewat ke 370'] },
        { id: 'geser', baris: '440-500',
          teks: ['Tukar isi, gambar dua petak', 'dengan subrutin yang sama'] },
        { id: 'petak', baris: '1150-1200',
          teks: ['Hapus, cetak angka,', 'CAT MENGITARI angkanya'] },
        { id: 'menang', baris: '560-600', jenis: 'putusan',
          teks: ['Periksa 1..15 berurutan;', 'sampai (4,4) berarti menang'] },
        { id: 'usai', baris: '630-670', jenis: 'keluar',
          teks: ['Sekali lagi? Y ulangi'] }
      ],
      panah: [
        { dari: 'uji', ke: 'gambar' },
        { dari: 'gambar', ke: 'kocok' },
        { dari: 'kocok', ke: 'tuang' },
        { dari: 'tuang', ke: 'petak' },
        { dari: 'petak', ke: 'tombol' },
        { dari: 'tombol', ke: 'geser', label: 'panah sah' },
        { dari: 'tombol', ke: 'tombol', label: 'lainnya: Illegal Move' },
        { dari: 'geser', ke: 'petak' },
        { dari: 'geser', ke: 'menang' },
        { dari: 'menang', ke: 'tombol', label: 'belum' },
        { dari: 'menang', ke: 'usai', label: 'WIN=1' }
      ]
    },

    pseudokode: [
      { baris: 1190, tingkat: 0, teks: 'cat berhenti di warna 3 &rarr; <b>angka yang baru dicetak jadi tembok</b>' },
      { baris: 1160, tingkat: 1, teks: '&hellip;didahului cat warna 0 yang menghapus seluruh petak' },
      { baris: 990, tingkat: 0, teks: 'kocokan tolak-ulang: <b>seragam</b>, dan karena itu separuhnya mustahil' },
      { baris: 580, tingkat: 0, teks: 'sampai petak (4,4) berarti menang &mdash; kekosongannya tidak perlu diperiksa' },
      { baris: 590, tingkat: 1, teks: '<code>RETURN</code> dari dalam dua gelung; bingkainya ditinggalkan menggantung' },
      { baris: 360, tingkat: 0, teks: '<code>ELSE</code> menempel pada IF yang <b>kedua</b>; panah lolos ke 370' },
      { baris: 790, tingkat: 0, teks: '<code>POKE &amp;H4E</code> &mdash; satu-satunya cara mewarnai huruf di mode grafik' },
      { baris: 355, tingkat: 0, teks: '<code>WHILE+</code> dengan plus nyasar; penyangga tombol dikosongkan' },
      { baris: 1100, tingkat: 0, teks: 'angka <b>16</b> adalah kekosongan; letaknya disimpan di <code>XZ,YZ</code>' }
    ],

    perintahAsli: 'run\\15PUZZLE.bat',
    catatanAsli: 'Empat tombol panah menggeser ubin ke dalam petak kosong. ' +
      'Q berhenti. Perhatikan bahwa angka pada ubin tetap utuh setiap kali ' +
      'warnanya berubah &mdash; dan bahwa teka-tekinya belum tentu bisa ' +
      'diselesaikan.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Baris 120 ' +
      'memakai <code>PLAY "mf"</code> bukan untuk bunyi melainkan sebagai ' +
      'umpan galat; di penelusur ia selalu lulus, jadi baris 140-190 tidak ' +
      'pernah dicapai.',

      '<b><code>PEEK(&amp;H410)</code> selalu menjawab "ada kartu warna"</b>, ' +
      'jadi baris 220-280 juga tidak pernah dicapai.',

      '<b><code>RANDOMIZE VAL(RIGHT$(TIME$,2))</code> diganti benih tetap</b>, ' +
      'supaya kocokan yang sama bisa ditelusuri dua kali.',

      '<b><code>DEF SEG: POKE &amp;H4E,n</code> ditiru sungguhan</b> sebagai ' +
      'warna huruf, karena itu memang artinya dan tanpa itu papan ' +
      'petunjuknya kehilangan warnanya. Lihat <code>warnaTeks</code> di ' +
      '<code>mesin/penjalan.js</code>.'
    ],

    pelajaran: {
      ringkas: 'Angka yang baru dicetak dipakai sebagai dinding penahan cat ' +
        '&mdash; dan pengocok yang terlalu jujur membuat separuh teka-tekinya ' +
        'mustahil diselesaikan.',
      pelajari: [
        ['Cetak dulu, cat kemudian',
         'Subrutin 1150-1200 menggambar satu petak dengan tiga pernyataan, ' +
         'dan urutannya yang membuatnya bekerja: <code>PAINT</code> warna 0 ' +
         'menghapus petak, <code>PRINT USING "##"</code> mencetak angkanya ' +
         'dengan warna 3, lalu <code>PAINT</code> warna <code>C0</code> ' +
         'dengan <b>batas 3</b>.',
         'Cat yang terakhir mengalir dari tengah petak dan berhenti begitu ' +
         'menemui warna 3. Yang berwarna 3 di dalam petak itu cuma coretan ' +
         'angkanya. Jadi catnya mengalir mengitari angka, dan angkanya ' +
         'selamat.',
         'Tidak ada topeng, tidak ada penyalinan, tidak ada larik yang ' +
         'menyimpan bentuk angka. Sifat "berhenti di warna tertentu" milik ' +
         '<code>PAINT</code> dipakai untuk sesuatu yang bukan bidang ' +
         'tertutup.'],
        ['Satu subrutin untuk dua hal yang berlawanan',
         'Baris 460-500 memanggil subrutin yang sama dua kali: sekali dengan ' +
         '<code>C0=0</code> untuk menggambar petak asal sebagai kekosongan, ' +
         'sekali dengan <code>C0=2</code> untuk menggambar petak tujuan ' +
         'sebagai ubin.',
         'Di antara keduanya, <code>SWAP Y0,YZ: SWAP X0,XZ</code> menukar ' +
         '<b>penunjuknya</b>, bukan isi papan. Isi papan sudah ditukar di ' +
         'baris 450.',
         'Menggambar dan menghapus jadi pernyataan yang sama dengan argumen ' +
         'berbeda &mdash; sebelas baris untuk seluruh animasi geseran.'],
        ['Menguji kemampuan dengan mencoba memakainya',
         'Baris 110-130 tidak menanyakan versi penafsirnya. Ia memasang ' +
         'penangkap galat, lalu <b>mencoba</b> <code>PLAY "mf"</code> ' +
         '&mdash; pernyataan yang hanya ada di BASICA. Kalau galat 73 ' +
         'datang, penafsirnya BASIC biasa.',
         'Dan kalau galat lain yang datang, baris 130 melanjutkannya ke 200 ' +
         'seolah tidak terjadi apa-apa. Uji kemampuan yang tidak salah ' +
         'menuduh.']
      ],
      hindari: [
        ['Pengocok yang terlalu jujur',
         'Baris 990-1060 menghasilkan permutasi acak enam belas angka yang ' +
         'benar-benar seragam. Itu terdengar seperti yang diinginkan.',
         'Tapi papan lima belas hanya bisa dikembalikan ke urutan dari ' +
         '<b>separuh</b> permutasinya. Separuh yang lain terkurung di kelas ' +
         'paritas yang berbeda, dan tidak ada urutan geseran mana pun yang ' +
         'menyeberang.',
         'Jadi kira-kira setengah teka-teki yang dibagikan program ini ' +
         'MUSTAHIL diselesaikan, dan pemainnya tidak pernah diberi tahu. Ia ' +
         'akan menggeser sampai bosan, lalu menyalahkan dirinya.',
         'Tambalannya sepele: hitung paritas permutasinya, dan kalau ganjil, ' +
         'tukar dua ubin sembarang. Tiga baris. Yang mahal bukan ' +
         'perbaikannya, melainkan MENYADARI bahwa "acak seragam" dan "acak ' +
         'yang sah" adalah dua hal yang berbeda.'],
        ['ELSE yang menempel pada IF yang salah dibaca',
         '<code>360 IF LEN(ANS$)=1 THEN IF ANS$="Q" OR ANS$="q" THEN 630 ' +
         'ELSE 430</code>',
         'Dibaca sekilas, <code>ELSE 430</code> seperti pasangan ' +
         '<code>IF LEN(ANS$)=1</code>. Sebenarnya ia milik IF yang kedua. ' +
         'Kebetulan itulah yang dimaui &mdash; tombol panah panjangnya dua ' +
         'aksara dan harus jatuh lewat ke baris 370.',
         'Tapi kebenarannya bergantung pada aturan penguraian yang tidak ' +
         'terlihat di barisnya. Satu tanda kurung, atau memecahnya jadi dua ' +
         'baris, akan menghilangkan seluruh keraguan.'],
        ['RETURN dari dalam dua gelung, tiap gerakan',
         'Subrutin 560-600 selalu keluar lewat <code>RETURN</code> di baris ' +
         '580 atau 590, tidak pernah lewat <code>NEXT</code>. Tiap panggilan ' +
         'meninggalkan dua bingkai gelung menggantung di tumpukan ' +
         'penafsirnya.',
         'Yang menyelamatkannya aturan GW-BASIC: <code>FOR</code> dengan ' +
         'nama variabel yang sama membuang bingkai lama. Karena panggilan ' +
         'berikutnya juga memakai I dan J, tumpukannya tidak pernah tumbuh.',
         'Program ini benar &mdash; tapi kebenarannya dititipkan pada ' +
         'perilaku pembersihan penafsir, bukan pada strukturnya sendiri.'],
        ['Baris 610 yang punya dua tuan',
         'Baris 610 mencetak "Illegal Move!!" dan ia BUKAN bagian dari ' +
         'subrutin pemeriksa kemenangan di atasnya &mdash; meski ia berada ' +
         'tepat sesudah <code>NEXT J: NEXT I</code> dan berbagi ' +
         '<code>RETURN</code> di baris 620 dengannya.',
         'Kalau gelung 560-600 sampai habis, alurnya jatuh ke 610 dan ' +
         'mencetak "Illegal Move!!" pada saat pemain baru saja menang. Itu ' +
         'tidak terjadi &mdash; baris 580 selalu memotong lebih dulu &mdash; ' +
         'tapi yang mencegahnya sebuah kebetulan aritmetika, bukan sebuah ' +
         'batas.']
      ]
    },

    penjelasan: [
      { judul: 'Angka sebagai tembok',
        isi: [
          'Subrutin di baris 1150 dipanggil setiap kali sebuah petak berubah. ' +
          'Isinya lima pernyataan, dan tiga di antaranya bekerja sama dengan ' +
          'cara yang tidak biasa:',
          '<code>1160 PAINT (45+32*X0,37+24*Y0),0,3</code>',
          '<code>1180 PRINT "  ";CHR$(29);CHR$(29);: IF N0<>0 THEN PRINT ' +
          'USING "##";N0;</code>',
          '<code>1190 PAINT (45+32*X0,37+24*Y0),C0,3</code>',
          'Baris 1160 mengecat seluruh isi petak dengan warna 0. Batasnya ' +
          'warna 3 &mdash; garis-garis kisi yang digambar baris 750. Sesudah ' +
          'ini petaknya kosong melompong.',
          'Baris 1180 mencetak angkanya. Warna hurufnya 3, dipasang baris 960 ' +
          'lewat <code>POKE &amp;H4E,3</code>. Jadi sekarang di dalam petak ' +
          'ada coretan berwarna 3 berbentuk angka.',
          'Dan baris 1190 mengecat lagi &mdash; kali ini dengan warna ubin ' +
          'yang sebenarnya, batas tetap 3.',
          'Cat mengalir dari tengah petak ke segala arah dan berhenti di ' +
          'warna 3. Ia berhenti di garis kisi, tentu saja. Tapi ia juga ' +
          'berhenti di <b>coretan angkanya</b>, karena angka itu juga ' +
          'berwarna 3.',
          'Hasilnya: seluruh petak jadi warna ubin, kecuali coretan angka ' +
          'yang tetap berwarna 3.',
          'Bisa dihitung. Ubin kiri-atas berisi angka 4 mengisi 713 piksel; ' +
          'sesudah cat yang kedua, 684 di antaranya berwarna ubin dan ' +
          '<b>29 tetap berwarna 3</b> &mdash; tepat coretan angkanya. Dan ' +
          'tidak satu piksel pun di luar petak ikut berubah warna: catnya ' +
          'tidak bocor.',
          'Tidak ada topeng yang disimpan. Tidak ada penyalinan. Tidak ada ' +
          'larik berisi bentuk angka. Angkanya dicetak lebih dulu, lalu cat ' +
          'disuruh mengitarinya &mdash; dan yang mengitarinya bukan ' +
          'perhitungan apa pun, melainkan sifat "berhenti di warna tertentu" ' +
          'yang sudah dimiliki <code>PAINT</code>.',
          'Yang membuatnya pantas dicatat: <code>PAINT</code> dibuat untuk ' +
          'mengisi bidang tertutup, dan di sini ia dipakai untuk hal yang ' +
          'sama sekali lain &mdash; mempertahankan bentuk yang sudah ada. ' +
          'Alat yang sama, dibaca dari sisi yang berlawanan.'
        ] },
      { judul: 'Separuh teka-tekinya mustahil',
        isi: [
          'Baris 990 sampai 1060 mengocok enam belas angka:',
          '<code>1000  ST(I)=INT(RND*16)+1</code>',
          '<code>1020  FOR J=1 TO I-1</code>',
          '<code>1030   IF ST(I)=ST(J) THEN 1000</code>',
          '<code>1040  NEXT J</code>',
          'Ambil angka acak; kalau sudah terpakai, ambil lagi. Sederhana, ' +
          'benar, dan menghasilkan permutasi yang benar-benar seragam ' +
          '&mdash; tiap susunan dari 16! kemungkinan punya peluang yang ' +
          'persis sama.',
          'Itu justru cacatnya.',
          'Geseran di papan lima belas hanya bisa menghasilkan susunan yang ' +
          'satu <b>kelas paritas</b> dengan susunan awalnya. Setiap geseran ' +
          'menukar kekosongan dengan satu ubin &mdash; sebuah transposisi ' +
          '&mdash; dan sekaligus memindahkan kekosongan satu petak. Kedua ' +
          'perubahan itu terikat, dan hasilnya sebuah besaran yang tidak ' +
          'pernah berubah sepanjang permainan.',
          'Separuh dari 16! susunan punya nilai besaran itu yang benar. ' +
          'Separuh lagi tidak, dan tidak ada urutan geseran mana pun ' +
          '&mdash; sepanjang apa pun &mdash; yang bisa menyeberang.',
          'Program ini mengambil dari 16! itu tanpa memilah. Jadi kira-kira ' +
          'setiap teka-teki kedua yang ia bagikan mustahil diselesaikan.',
          'Dihitung di penelusur atas seratus dua puluh benih yang berbeda: ' +
          '<b>54 dari 120</b> susunan awalnya berada di kelas paritas yang ' +
          'salah. Empat puluh lima persen, dan yang sebenarnya lima puluh.',
          'Dan pemainnya tidak pernah diberi tahu. Layar tidak berubah, ' +
          'tampilannya sama, "Move ####" tetap bertambah. Yang membedakan ' +
          'cuma bahwa "You have WON!" tidak akan pernah muncul.',
          'Perbaikannya tiga baris: hitung paritas susunannya, dan kalau ' +
          'salah, tukar dua ubin sembarang. Yang mahal bukan menuliskannya, ' +
          'melainkan menyadari bahwa <b>acak seragam</b> dan <b>acak yang ' +
          'sah</b> adalah dua hal berbeda &mdash; dan bahwa pengocok yang ' +
          'lebih jujur di sini justru yang lebih salah.'
        ] }
    ]
  };
})(window);
