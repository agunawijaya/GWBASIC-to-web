/* ===========================================================================
   BUSONE.js — porting minimalis BUSONE.BAS sebagai tabel baris.

   Program kedua belas, dan yang pertama BUKAN permainan. Ia bagian pertama
   dari sepuluh pelajaran akuntansi (BUSONE sampai BUSTEN) — dan yang menarik
   bukan isinya, melainkan bentuknya:

   INI MESIN PRESENTASI YANG DITULIS SEBAGAI KODE LURUS.

   Baris 590-680 adalah sepuluh baris yang hampir identik:

       590 COLOR 15,0:GOSUB 780:GOSUB 50
       600 GOSUB 780:COLOR 15,0:GOSUB 840:GOSUB 50
       610 GOSUB 840:COLOR 15,0:GOSUB 900:GOSUB 50

   Tiap baris: gambar ulang kotak SEBELUMNYA dengan warna biasa, gambar kotak
   BERIKUTNYA dengan putih terang, lalu tunggu tombol. Hasilnya sorotan yang
   berjalan maju melewati diagram alur akuntansi, satu kotak per tombol.

   Tidak ada variabel keadaan. Tidak ada nomor langkah. Tidak ada gelung. Tiap
   baris cukup menyebut dua nomor subrutin, dan urutannya sendiri yang menjadi
   naskahnya. Satu baris per slide.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `KEY OFF` tidak berbuat apa-apa.
   - Program ini berakhir dengan `RUN"BUSTWO"`, dan BUSTWO belum punya tabel
     baris di penelusur. Penelusuran berhenti di sana dan mengatakannya.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    { baris: 10, jalan: function (m) { m.jebakan(10, true); } },
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 80);
        }
      } },
    { baris: 30, jalan: function (m) { m.pasangJebakan(10, 1380); } },
    { baris: 40, jalan: function (m) { m.lompat(90); } },

    /* 50-80 subrutin "tunggu satu tombol", dengan dua tahap pembuangan —
       pola yang sama dengan CHECK.BAS baris 40-70. */
    { baris: 50, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 60, jalan: function (m) { if (m.inkey() !== '') m.lompat(50); } },
    { baris: 70, jalan: function (m) {
        m.v['R$'] = m.inkey();
        if (m.v['R$'] === '') m.lompat(70);
      } },
    /* 80 RETURN — penutup 50-70 SEKALIGUS badan jebakan F1-F9. */
    { baris: 80, jalan: function (m) { m.kembali(); } },

    /* 90-170 bingkai ganda mengelilingi layar judul, digambar sisi demi sisi
       searah jarum jam. Delapan baris untuk sesuatu yang bisa ditulis dengan
       dua STRING$ — bandingkan INTRO.BAS. */
    { baris: 90, jalan: function (m) { m.cls(); m.warna(3, 0); } },
    { baris: 100, jalan: function (m) {
        m.locate(1, 1, 0); m.cetak(m.chr(201)); m.barisBaru();
      } },
    { baris: 110, jalan: function (m) {
        for (m.v.I = 2; m.v.I <= 79; m.v.I++) {
          m.locate(1, m.v.I); m.cetak(m.chr(205)); m.barisBaru();
        }
      } },
    { baris: 120, jalan: function (m) {
        m.locate(1, 80); m.cetak(m.chr(187)); m.barisBaru();
      } },
    { baris: 130, jalan: function (m) {
        for (m.v.I = 2; m.v.I <= 10; m.v.I++) {
          m.locate(m.v.I, 80); m.cetak(m.chr(186)); m.barisBaru();
        }
      } },
    { baris: 140, jalan: function (m) {
        m.locate(11, 80); m.cetak(m.chr(188)); m.barisBaru();
      } },
    { baris: 150, jalan: function (m) {
        for (m.v.I = 79; m.v.I >= 2; m.v.I--) {
          m.locate(11, m.v.I); m.cetak(m.chr(205)); m.barisBaru();
        }
      } },
    { baris: 160, jalan: function (m) {
        m.locate(11, 1); m.cetak(m.chr(200)); m.barisBaru();
      } },
    { baris: 170, jalan: function (m) {
        for (m.v.I = 10; m.v.I >= 2; m.v.I--) {
          m.locate(m.v.I, 1); m.cetak(m.chr(186)); m.barisBaru();
        }
      } },

    { baris: 180, jalan: function (m) {
        m.warna(0, 7); m.locate(4, 20);
        m.cetak(' B U S I N E S S     S I M U L A T I O N '); m.barisBaru();
        m.warna(7, 0);
      } },
    tulis(190, 6, 18, 'A WALK THROUGH THE AUTOMATED ACCOUNTING WORLD'),
    tulis(200, 8, 22, '-- Another product of FriendlyWare --'),
    { baris: 210, jalan: function (m) {
        m.warna(11, 0); m.locate(22, 22);
        m.cetak('***** Strike Any Key To Continue *****'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 220, jalan: function (m) { m.gosub(50); } },
    { baris: 230, jalan: function (m) { m.gosub(700); } },

    /* 240-340 paragraf pembuka. Baris 240 memakai LOCATE; sisanya cuma
       PRINT TAB(7) berturut-turut, jadi barisnya mengalir sendiri ke bawah. */
    { baris: 240, jalan: function (m) {
        m.locate(7, 11);
        m.cetak('The purpose of this system is to show you how easily you can keep');
        m.barisBaru();
      } },
    tab(250, 7, 'your books with  an Automated Accounting  System. By automating  your'),
    tab(260, 7, 'current bookkeeping procedures, you can save a great deal of time and'),
    tab(270, 7, 'decrease your probability of an error. You will be able to accurately'),
    tab(280, 7, 'determine your financial position at the push of a button.'),
    tab(290, 11, 'During the next few minutes  we will show you the chain of events'),
    tab(300, 7, 'which follow a simple transaction. This will include the actual start'),
    tab(310, 7, 'of the transaction to the Post Closing Trial Balance. We will explain'),
    tab(320, 7, 'each step as we lead you through this simulation. Please keep in mind'),
    tab(330, 7, 'that the business and all  transactions you will be  shown are purely'),
    tab(340, 7, 'fictional.'),

    { baris: 350, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 22);
        m.cetak('***** Strike Any Key To Continue *****'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 360, jalan: function (m) { m.gosub(50); } },
    { baris: 370, jalan: function (m) { m.gosub(700); } },

    /* 380-520 daftar dua belas langkah, dua kolom. */
    { baris: 380, jalan: function (m) {
        m.locate(5, 14);
        m.cetak('Below is a list of the steps we will take to show you how');
        m.barisBaru();
      } },
    tab(390, 9, 'easily an automated accounting system can be to implement. You'),
    tab(400, 9, 'will receive an explanation and an example for each step.'),
    langkah(410, 10,  5, 'I.  ', ' FLOW OF ACCOUNTING CYCLE'),
    langkah(420, 12,  5, 'II. ', ' SET UP CHART OF ACCOUNTS'),
    langkah(430, 14,  5, 'III.', ' TRANSACTION OCCURS'),
    langkah(440, 16,  5, 'IV. ', ' POSTING TO JOURNAL'),
    langkah(450, 18,  5, 'V.  ', ' POSTING TO LEDGER'),
    langkah(460, 20,  5, 'VI. ', ' TRIAL BALANCE'),
    langkah(470, 10, 47, 'VII. ', ' WORKSHEET PREPARED'),
    langkah(480, 12, 47, 'VIII.', ' FINANCIAL STATEMENTS'),
    langkah(490, 14, 47, 'IX.  ', ' ADJUSTING ENTRIES'),
    langkah(500, 16, 47, 'X.   ', ' CLOSING ENTRIES'),
    langkah(510, 18, 47, 'XI.  ', ' POST CLOSING TRIAL BALANCE'),
    langkah(520, 20, 47, 'XII. ', ' RECAP AND OVERVIEW'),
    { baris: 530, jalan: function (m) {
        m.warna(11, 0); m.locate(24, 23);
        m.cetak('***** Strike Any Key To Start *****');
        m.warna(7, 0);
      } },
    { baris: 540, jalan: function (m) { m.gosub(50); } },
    { baris: 550, jalan: function (m) { m.gosub(700); } },

    { baris: 560, jalan: function (m) {
        m.warna(15, 0); m.locate(4, 25);
        m.cetak('STEP I. FLOW OF ACCOUNTING CYCLE'); m.barisBaru();
      } },
    { baris: 570, jalan: function (m) {
        m.tab(25); m.cetak('--------------------------------'); m.barisBaru();
        m.warna(7, null);
      } },
    { baris: 580, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 22);
        m.cetak('***** Strike Any Key To Continue *****'); m.barisBaru();
        m.warna(7, 0);
      } },

    /* --- 590-680: NASKAH PRESENTASINYA -----------------------------------

       Sepuluh baris, sepuluh slide. Tiap baris:
         1. gambar ulang kotak SEBELUMNYA dengan warna biasa (meredupkannya)
         2. gambar kotak BERIKUTNYA dengan putih terang (menyorotinya)
         3. tunggu tombol

       Sorotan berjalan maju, dan tidak ada satu pun variabel yang mengingat
       "sekarang di langkah berapa". Urutan barisnya yang menjadi naskahnya. */
    { baris: 590, bagian: [
        function (m) { m.warna(15, 0); },
        function (m) { m.gosub(780); },
        function (m) { m.gosub(50); }
      ] },
    slide(600, 780, 840), slide(610, 840, 900), slide(620, 900, 960),
    slide(630, 960, 1020), slide(640, 1020, 1080), slide(650, 1080, 1140),
    slide(660, 1140, 1200), slide(670, 1200, 1260), slide(680, 1260, 1320),
    { baris: 690, jalan: function (m) { m.jalankan('BUSTWO'); } },

    /* 700-770 kepala halaman, dipanggil tiap kali layar berganti. */
    { baris: 700, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
      } },
    { baris: 710, jalan: function (m) { m.warna(11, 0); } },
    { baris: 720, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.J = 20; m.v.J <= 62; m.v.J++) {
            m.locate(m.v.I, m.v.J); m.cetak(m.chr(196)); m.barisBaru();
          }
        }
      } },
    { baris: 730, jalan: function (m) {
        m.locate(1, 19); m.cetak(m.chr(218)); m.barisBaru();
        m.locate(1, 63); m.cetak(m.chr(191)); m.barisBaru();
        m.locate(3, 63); m.cetak(m.chr(217)); m.barisBaru();
        m.locate(3, 19); m.cetak(m.chr(192)); m.barisBaru();
      } },
    { baris: 740, jalan: function (m) {
        m.locate(2, 19); m.cetak(m.chr(179)); m.spc(43); m.cetak(m.chr(179));
        m.barisBaru();
      } },
    { baris: 750, jalan: function (m) { m.warna(0, 7); } },
    { baris: 760, jalan: function (m) {
        m.locate(2, 22);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 770, jalan: function (m) { m.kembali(); } },

    /* 780-1370 sepuluh kotak diagram alur. Bentuknya sama persis; yang
       berbeda cuma koordinat dan tulisannya. Enam baris per kotak, enam
       puluh baris untuk sepuluh kotak — dan tidak satu pun subrutin bersama.
       Bandingkan tangga gambar di HANGMAN.BAS. */
    panah(780, 7, 1, '>'),
    kotakAtas(790, 6, 5, 18, 19),
    kotakAtas(800, 9, 5, 18, 19),
    isiKotak(810, 7, 5, ' SET UP CHART'),
    isiKotak(820, 8, 5, ' OF ACCOUNTS '),
    { baris: 830, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    panah(840, 7, 21, '>'),
    kotakAtas(850, 6, 25, 38, 39),
    kotakAtas(860, 9, 25, 38, 39),
    isiKotak(870, 7, 25, ' TRANSCATION '),
    isiKotak(880, 8, 25, '   OCCURS    '),
    { baris: 890, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    panah(900, 7, 41, '>'),
    kotakAtas(910, 6, 45, 58, 59),
    kotakAtas(920, 9, 45, 58, 59),
    isiKotak(930, 7, 45, '  POSTED TO  '),
    isiKotak(940, 8, 45, '   JOURNAL   '),
    { baris: 950, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    panah(960, 7, 61, '>'),
    kotakAtas(970, 6, 65, 78, 79),
    kotakAtas(980, 9, 65, 78, 79),
    isiKotak(990, 7, 65, '  POSTED TO  '),
    isiKotak(1000, 8, 65, '   LEDGERS   '),
    { baris: 1010, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    { baris: 1020, jalan: function (m) {
        m.locate(10, 72); m.cetak(m.chr(179)); m.barisBaru();
        m.locate(11, 72); m.cetak('V'); m.barisBaru();
      } },
    kotakBalik(1030, 12, 79, 66, 65),
    kotakBalik(1040, 15, 79, 66, 65),
    isiKotak(1050, 13, 65, '    TRIAL    '),
    isiKotak(1060, 14, 65, '   BALANCE   '),
    { baris: 1070, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    panahKiri(1080, 13, 61),
    kotakBalik(1090, 12, 59, 46, 45),
    kotakBalik(1100, 15, 59, 46, 45),
    isiKotak(1110, 13, 45, '  WORKSHEET  '),
    isiKotak(1120, 14, 45, '   PREPARED  '),
    { baris: 1130, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    panahKiri(1140, 13, 41),
    kotakBalik(1150, 12, 39, 26, 25),
    kotakBalik(1160, 15, 39, 26, 25),
    isiKotak(1170, 13, 25, '  FINANCIAL  '),
    isiKotak(1180, 14, 25, ' STATEMENTS  '),
    { baris: 1190, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    panahKiri(1200, 13, 21),
    kotakBalik(1210, 12, 19, 6, 5),
    kotakBalik(1220, 15, 19, 6, 5),
    isiKotak(1230, 13, 5, '  ADJUSTING  '),
    isiKotak(1240, 14, 5, '   ENTRIES   '),
    { baris: 1250, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    { baris: 1260, jalan: function (m) {
        m.locate(16, 12); m.cetak(m.chr(179)); m.barisBaru();
        m.locate(17, 12); m.cetak('V'); m.barisBaru();
      } },
    kotakAtas(1270, 18, 5, 18, 19),
    kotakAtas(1280, 21, 5, 18, 19),
    isiKotak(1290, 19, 5, '   CLOSING   '),
    isiKotak(1300, 20, 5, '   ENTRIES   '),
    { baris: 1310, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    panah(1320, 19, 21, '>'),
    kotakAtas(1330, 18, 25, 38, 39),
    kotakAtas(1340, 21, 25, 38, 39),
    isiKotak(1350, 19, 25, ' POST CLOSING'),
    isiKotak(1360, 20, 25, 'TRIAL BALANCE'),
    { baris: 1370, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    { baris: 1380, jalan: function (m) { m.jalankan('menu'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function tulis(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  /* PRINT TAB(n)"..." — mengalir ke baris berikutnya sendiri. */
  function tab(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  function langkah(nomor, baris, kolom, angka, judul) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.warna(11, nomor === 410 ? 0 : null);
      m.cetak(angka);
      m.warna(7, nomor === 410 ? 0 : null);
      m.cetak(judul); m.barisBaru();
    } };
  }

  /* Satu slide: redupkan kotak sebelumnya, sorot kotak berikutnya, tunggu. */
  function slide(nomor, sebelum, berikut) {
    return { baris: nomor, bagian: [
      function (m) { m.gosub(sebelum); },
      function (m) { m.warna(15, 0); },
      function (m) { m.gosub(berikut); },
      function (m) { m.gosub(50); }
    ] };
  }

  function panah(nomor, baris, kolom) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak(m.chr(196) + m.chr(196) + '>'); m.barisBaru();
    } };
  }

  function panahKiri(nomor, baris, kolom) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak('<' + m.chr(196) + m.chr(196)); m.barisBaru();
    } };
  }

  /* Sisi mendatar kotak, digambar kiri ke kanan. */
  function kotakAtas(nomor, baris, kiri, kananIsi, kanan) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kiri); m.cetak(m.chr(201)); m.barisBaru();
      for (m.v.J = kiri + 1; m.v.J <= kananIsi; m.v.J++) {
        m.locate(baris, m.v.J); m.cetak(m.chr(205)); m.barisBaru();
      }
      m.locate(baris, kanan); m.cetak(m.chr(187)); m.barisBaru();
    } };
  }

  /* Sisi mendatar kotak, digambar kanan ke kiri. */
  function kotakBalik(nomor, baris, kanan, kiriIsi, kiri) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kanan); m.cetak(m.chr(201)); m.barisBaru();
      for (m.v.J = kanan - 1; m.v.J >= kiriIsi; m.v.J--) {
        m.locate(baris, m.v.J); m.cetak(m.chr(205)); m.barisBaru();
      }
      m.locate(baris, kiri); m.cetak(m.chr(187)); m.barisBaru();
    } };
  }

  function isiKotak(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak(m.chr(186) + isi + m.chr(186)); m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSONE'] = {
    nama: 'BUSONE',
    judul: 'Business Simulation 1',
    sumber: 'BUSONE',
    berkas: 'run/BUSONE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSONE.BAS',
      simpul: [
        { id: 'siap', baris: '10-40', jenis: 'mulai',
          teks: ['Pasang jebakan F1-F10', 'lalu lompati subrutin tunggu'] },
        { id: 'judul', baris: '90-220',
          teks: ['Bingkai ganda, judul,', 'tunggu tombol'] },
        { id: 'kata', baris: '230-360',
          teks: ['Satu layar paragraf', 'tentang akuntansi otomatis'] },
        { id: 'daftar', baris: '370-540',
          teks: ['Daftar dua belas langkah,', 'dua kolom'] },
        { id: 'naskah', baris: '590-680', jenis: 'putusan',
          teks: ['Sepuluh slide:', 'satu baris per slide'] },
        { id: 'kotak', baris: '780-1370', jenis: 'subrutin',
          teks: ['Sepuluh kotak diagram alur,', 'enam baris masing-masing'] },
        { id: 'tunggu', baris: '50-80', jenis: 'subrutin',
          teks: ['Tunggu satu tombol', '(dua tahap pembuangan)'] },
        { id: 'lanjut', baris: '690', jenis: 'keluar',
          teks: ['RUN "BUSTWO"', 'pelajaran berikutnya'] }
      ],
      panah: [
        { dari: 'siap',   ke: 'judul',  label: 'GOTO 90' },
        { dari: 'judul',  ke: 'kata' },
        { dari: 'kata',   ke: 'daftar' },
        { dari: 'daftar', ke: 'naskah' },
        { dari: 'naskah', ke: 'kotak',  label: '2x per slide' },
        { dari: 'kotak',  ke: 'naskah', label: 'RETURN' },
        { dari: 'naskah', ke: 'tunggu', label: 'GOSUB 50' },
        { dari: 'tunggu', ke: 'naskah', label: 'RETURN' },
        { dari: 'naskah', ke: 'lanjut', label: 'sepuluh slide habis' }
      ]
    },

    pseudokode: [
      { baris: 10,  tingkat: 0, teks: 'pasang jebakan: F10 kembali ke menu, F1&ndash;F9 mandul' },
      { baris: 40,  tingkat: 0, teks: 'lompati subrutin tunggu-tombol yang duduk di depan alur' },
      { baris: 90,  tingkat: 0, teks: 'gambar bingkai ganda sisi demi sisi, searah jarum jam' },
      { baris: 220, tingkat: 0, teks: 'tunggu tombol' },
      { baris: 240, tingkat: 0, teks: 'satu layar paragraf tentang akuntansi otomatis' },
      { baris: 410, tingkat: 0, teks: 'daftar dua belas langkah dalam dua kolom' },
      { baris: 560, tingkat: 0, teks: 'judul "STEP I. FLOW OF ACCOUNTING CYCLE"' },
      { baris: 590, tingkat: 0, teks: '<b>SEPULUH SLIDE, SATU BARIS MASING-MASING:</b>' },
      { baris: 590, tingkat: 1, teks: 'slide 1: sorot kotak pertama, tunggu tombol' },
      { baris: 600, tingkat: 1, teks: 'slide 2: <b>redupkan kotak 1</b>, sorot kotak 2, tunggu' },
      { baris: 610, tingkat: 1, teks: 'slide 3: redupkan kotak 2, sorot kotak 3, tunggu' },
      { baris: 680, tingkat: 1, teks: '&hellip; sampai slide 10' },
      { baris: 690, tingkat: 0, teks: 'muat BUSTWO &mdash; pelajaran berikutnya' }
    ],

    perintahAsli: 'run\\BUSONE.bat',
    catatanAsli: 'Bagian pertama dari sepuluh (BUSONE sampai BUSTEN). ' +
      'Masing-masing memuat yang berikutnya lewat RUN, jadi kesepuluhnya ' +
      'adalah satu presentasi panjang yang dipecah karena keterbatasan memori.',

    penyimpangan: [
      '<b>Berakhir dengan <code>RUN"BUSTWO"</code>, dan BUSTWO belum punya ' +
      'tabel baris di penelusur ini.</b> Penelusuran berhenti di sana dan ' +
      'mengatakannya — bukan diam-diam melanjutkan.',

      '<b><code>KEY OFF</code> tidak berbuat apa-apa</b>; konsol ini memang ' +
      'tidak pernah menggambar baris label tombol fungsi.'
    ],

    pelajaran: {
      ringkas: 'Bukan permainan, melainkan presentasi &mdash; dan bentuknya ' +
        'yang layak dipelajari: sepuluh slide ditulis sebagai sepuluh baris, ' +
        'tanpa satu pun variabel keadaan.',
      pelajari: [
        ['Naskah sebagai kode lurus',
         'Baris 590-680 adalah sepuluh baris yang hampir identik, dan tiap ' +
         'baris <b>adalah</b> satu slide: redupkan yang sebelumnya, sorot yang ' +
         'berikutnya, tunggu tombol. Tidak ada nomor langkah, tidak ada gelung, ' +
         'tidak ada larik urutan. <b>Urutan barisnya yang menjadi naskahnya.</b>'],
        ['Sorotan lewat gambar ulang',
         'Menyoroti kotak tidak dilakukan dengan mengubah atributnya, ' +
         'melainkan dengan <b>menggambarnya ulang</b> dalam warna lain. Untuk ' +
         'layar teks yang tidak punya konsep "objek", itu satu-satunya cara — ' +
         'dan kebetulan juga cara yang paling sederhana untuk dinalar: yang ' +
         'terlihat selalu hasil gambar terakhir.'],
        ['Program yang memuat program berikutnya',
         'Baris 690 <code>RUN"BUSTWO"</code>. Sepuluh berkas BUSONE sampai ' +
         'BUSTEN adalah satu presentasi yang dipecah, karena satu program ' +
         'BASIC tidak muat di memori. Nenek moyang pemuatan bertahap: ' +
         'muat bagian yang dibutuhkan, buang yang sudah lewat.']
      ],
      hindari: [
        ['Sepuluh kotak, enam puluh baris, nol subrutin bersama',
         'Baris 780-1370 menggambar sepuluh kotak yang bentuknya sama persis; ' +
         'yang berbeda cuma koordinat dan tulisannya. Satu subrutin bersama ' +
         'dengan empat parameter akan menggantikan seluruhnya. Bandingkan ' +
         'tangga gambar HANGMAN.BAS, yang justru menghindari pengulangan ' +
         'semacam ini.'],
        ['Delapan baris untuk satu bingkai',
         'Baris 100-170 menggambar bingkai layar sisi demi sisi searah jarum ' +
         'jam. INTRO.BAS mengerjakan hal yang sama dengan dua ' +
         '<code>STRING$</code>.'],
        ['Salah eja yang ikut tercetak',
         'Baris 870 menulis "TRANSCATION", bukan "TRANSACTION". Salah eja di ' +
         'dalam kotak diagram alur produk akuntansi &mdash; dan bertahan empat ' +
         'puluh tahun karena tidak ada yang merusak apa pun.']
      ]
    },

    penjelasan: [
      { judul: 'Sepuluh slide, sepuluh baris, nol variabel',
        isi: [
          'Bagaimana membuat presentasi yang membuka satu kotak per tombol?',
          'Naluri modern: simpan nomor langkah di sebuah variabel, buat gelung, ' +
          'dan sebuah tabel berisi apa yang harus digambar di tiap langkah.',
          'Program ini tidak melakukan satu pun dari itu:',
          '<code>590 COLOR 15,0:GOSUB 780:GOSUB 50</code><br>' +
          '<code>600 GOSUB 780:COLOR 15,0:GOSUB 840:GOSUB 50</code><br>' +
          '<code>610 GOSUB 840:COLOR 15,0:GOSUB 900:GOSUB 50</code>',
          'Tiap baris menyebut <b>dua nomor subrutin</b>: yang sebelumnya ' +
          '(digambar ulang dengan warna biasa, jadi meredup) dan yang ' +
          'berikutnya (digambar dengan putih terang, jadi menyorot). Lalu ' +
          'tunggu tombol.',
          'Tidak ada variabel yang mengingat "sekarang slide berapa". ' +
          '<b>Penunjuk barisnya sendiri yang menjadi penanda langkah.</b>',
          'Apakah ini bagus? Untuk sepuluh slide yang tidak pernah berubah — ' +
          'ya. Ia tidak bisa salah urutan, tidak bisa kehilangan keadaan, dan ' +
          'dibaca dari atas ke bawah persis seperti naskahnya. Untuk seratus ' +
          'slide yang isinya datang dari berkas — tentu tidak.',
          'Pelajarannya bukan "tiru ini", melainkan: <b>jumlah yang tetap dan ' +
          'kecil kadang lebih jujur ditulis sebagai daftar daripada sebagai ' +
          'gelung.</b>'
        ] },
      { judul: 'Menyorot tanpa objek',
        isi: [
          'Di antarmuka modern, menyoroti sesuatu berarti mengubah sifat ' +
          'sebuah objek: warnanya, kelasnya, gayanya. Objeknya tetap ada, dan ' +
          'sistem yang menggambar ulang.',
          'Layar teks CGA tidak punya objek. Yang ada cuma dua ribu sel, dan ' +
          'apa pun yang tertulis di sana adalah hasil gambar terakhir.',
          'Jadi "menyorot kotak" berarti <b>menggambar kotak itu lagi, dalam ' +
          'warna lain</b>. Dan "meredupkan" berarti menggambarnya sekali lagi, ' +
          'dalam warna biasa.',
          'Kelihatan boros — tiap kotak digambar dua kali seumur presentasi. ' +
          'Tapi ia punya sifat yang berharga: <b>tidak ada keadaan tersembunyi ' +
          'yang bisa keliru.</b> Yang terlihat di layar selalu persis hasil ' +
          'perintah gambar terakhir, dan tidak ada daftar "apa yang sedang ' +
          'tersorot" yang harus dijaga tetap benar.',
          'Kerangka antarmuka modern kembali ke gagasan yang sama, dengan ' +
          'nama yang lebih mentereng: gambar ulang dari keadaan, jangan tambal ' +
          'selisihnya.'
        ] },
      { judul: 'Sepuluh berkas untuk satu presentasi',
        isi: [
          'Baris terakhir program ini: <code>690 RUN"BUSTWO"</code>.',
          'BUSONE sampai BUSTEN adalah <b>satu</b> presentasi akuntansi yang ' +
          'dipecah jadi sepuluh berkas. Tiap berkas memuat yang berikutnya, ' +
          'dan program yang lama hilang dari memori.',
          'Kenapa dipecah? Karena satu program BASIC harus muat seluruhnya di ' +
          'memori, dan memori itu 64 KB dibagi bersama penafsirnya, layarnya, ' +
          'dan sistem operasinya.',
          'Yang hilang saat berpindah: seluruh variabel. Jadi tiap berkas ' +
          'harus berdiri sendiri — tidak ada yang bisa dititipkan dari BUSONE ' +
          'ke BUSTWO kecuali lewat berkas di disket.',
          'Ini nenek moyang langsung dari pemuatan bertahap yang dipakai ' +
          'aplikasi web hari ini: muat bagian yang dibutuhkan sekarang, buang ' +
          'yang sudah lewat. Kendalanya berubah dari 64 KB jadi kecepatan ' +
          'jaringan, tapi bentuk penyelesaiannya sama.'
        ] }
    ]
  };
})(window);
