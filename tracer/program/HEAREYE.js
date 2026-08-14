/* ===========================================================================
   HEAREYE.js — porting minimalis HEAREYE.BAS sebagai tabel baris.

   Program kelima. Baris 10-90 di sini IDENTIK dengan INTRO.BAS — keduanya
   lahir dari templat yang sama, disalin lalu diubah bagian tengahnya. Jadi
   separuh kerangkanya sudah terbukti sejak program kedua, dan yang benar-benar
   baru cuma dua subrutinnya.

   Yang ditagih program ini dari mesinnya ternyata sedikit: `SOUND` dan `PLAY`,
   dan keduanya diam. Yang menarik justru sebaliknya — ia memperlihatkan bahwa
   sesudah empat program, kerangka koleksi ini sudah tertiru cukup lengkap.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND I,J` tidak berbunyi. Ini penyimpangan TERBESAR di penelusur sejauh
     ini: seluruh tes pendengaran adalah nada yang naik dari 100 Hz ke 30.000
     Hz, dan tanpa nada itu tidak ada yang bisa didengar untuk diuji. Yang
     tersisa tetap mengajar — lihat catatan di baris 950.
   - `PLAY "MF"` (mainkan nada di latar depan) tidak berbuat apa-apa.
   - `KEY OFF`, `SCREEN 0,0,0`, `WIDTH 80` tidak berbuat apa-apa.
   - Kedip tidak ditiru; program ini tidak memakainya.
   =========================================================================== */

(function (global) {
  'use strict';

  /* --- bagan mata ----------------------------------------------------------

     Empat belas baris di 430-630 adalah gambar, bukan tulisan: huruf E dan C
     yang dibangun dari balok CP437 (219 penuh, 220 separuh bawah, 223 separuh
     atas, 221 dan 222 separuh kiri/kanan). Menyalinnya dengan tangan hampir
     pasti meleset satu-dua kolom, dan satu kolom meleset merusak barisnya.

     Maka isinya disalin apa adanya dari run/HEAREYE.BAS sebagai daftar kode
     bita yang diringkas: "32*12" berarti dua belas spasi, "219*9" berarti
     sembilan balok penuh. Berkas ini tetap ASCII murni dan bisa diperiksa
     ulang terhadap sumbernya kapan saja. */

  var BAGAN = {
    430: '32*12 255 222 219*9 32*5 222 219*8 221 32*5 219*9 221 32*5 219*2 221 222 219*2 32 219*2 221',
    440: '32*13 222 219*2 220*7 32*5 222 219*2 32 219*2 32 219*2 221 32*5 220*7 219*2 221 32*5 219*2 221 222 219*2 32 219*2 221',
    450: '32 50 48 47 53 48 32*7 222 219*2 223*7 32*5 222 219*2 32 219*2 32 219*2 221 32*5 223*7 219*2 221 32*5 219*2 221 222 219*2 32 219*2 221',
    460: '32*13 222 219*9 32*5 222 219*2 32 219*2 32 219*2 221 32*5 219*9 221 32*5 219*9 221',
    490: '32*16 219 223*4 32*6 223*4 219 32*6 219 32 219 32 219 32*6 219 223 219 223 219 32*6 219 223*4',
    500: '32 50 48 47 52 48 32*10 219 223*4 32*6 223*4 219 32*6 219 32 219 32 219 32*6 219 32 219 32 219 32*6 219 223*4',
    510: '32*13 255 32*2 223*5 32*6 223*5 32*6 223*5 32*6 223 32 223 32 223 32*6 223*5',
    530: '32*19 219 223*3 32*4 219 223*2 219 32*4 219 32*2 219 32*4 219 223*2 219 32*4 223*3 219 32*4 219 32*2 219',
    540: '32 50 48 47 51 48 32*13 219 220*3 32*4 219 32*2 219 32*4 219 220*2 219 32*4 219 32*2 219 32*4 220*3 219 32*4 219 220*2 219',
    560: '32*22 220*3 32*4 220*3 32*4 220 32 220 32*4 220*3 32*4 220*3 32*4 220 32 220',
    570: '32 50 48 47 50 48 32*16 219 32 219 32*4 219 220*2 32*4 219 220 219 32*4 219 32 219 32*4 220*2 219 32*4 219 220 219',
    590: '32 50 48 47 49 53 32*16 222 220 221 32*2 222 223 221 32*2 222 223 221 32*2 222 220 221 32*2 222 223 221 32*2 222 220 221 32*2 222 223 221 32*2 222 220 221',
    610: '32 50 48 47 49 48 32*18 85 32*2 239 32*2 239 32*2 85 32*2 85 32*2 239 32*2 85 32*2 239 32*2 239 32*2 85 32*2 239 32*2 85 32*2',
    630: '32 50 48 47 53 32*21 110 32 117 32 110 32 117 32 110 32 110 32 117 32 110 32 117 32 117 32 110 32 110 32 117 32 117 32 110 32 110 32*3'
  };

  function bentang(padat) {
    var keluar = '', potong = padat.split(' '), i, p, kode, n;
    for (i = 0; i < potong.length; i++) {
      p = potong[i].split('*');
      kode = parseInt(p[0], 10);
      n = p.length > 1 ? parseInt(p[1], 10) : 1;
      while (n-- > 0) keluar += String.fromCharCode(kode);
    }
    return keluar;
  }

  /* Satu baris bagan: PRINT lalu turun baris. */
  function barisBagan(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.cetak(bentang(BAGAN[nomor]));
      m.barisBaru();
    } };
  }

  /* PRINT sendirian = satu baris kosong. */
  function barisKosong(nomor) {
    return { baris: nomor, jalan: function (m) { m.barisBaru(); } };
  }

  /* Baris teks penjelasan: LOCATE lalu PRINT. */
  function teks(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak(isi);
      m.barisBaru();
    } };
  }

  var tabel = [

    /* --- 10-90: kerangka yang identik dengan INTRO.BAS --------------------- */

    { baris: 10, jalan: function () { /* KEY OFF */ } },
    { baris: 20, jalan: function (m) {
        m.warna(7, 0);
        m.cls();
        m.kosongkanPenyangga();
      } },
    { baris: 30, jalan: function (m) { m.pasangJebakan(10, 200); } },
    { baris: 40, jalan: function (m) { m.jebakan(10, true); } },

    /* 50 GOSUB 1080:DEF SEG:POKE 106,0:COLOR 11,0
       GOSUB meninggalkan baris di tengah, jadi baris ini berbagian.
       Perhatikan bedanya dengan INTRO.BAS: di sana baris 41 memasang
       ON ERROR yang menelan semua galat. Di sini TIDAK ADA ON ERROR sama
       sekali — dua program dari templat yang sama, dua sikap berbeda. */
    { baris: 50, bagian: [
        function (m) { m.gosub(1080); },
        function (m) { m.kosongkanPenyangga(); m.warna(11, 0); }
      ] },

    { baris: 60, jalan: function (m) {
        m.locate(1, 19);
        m.cetak(m.chr(218) + m.ulang(42, 196) + m.chr(191));
        m.barisBaru();
      } },
    { baris: 70, jalan: function (m) {
        m.locate(3, 19);
        m.cetak(m.chr(192) + m.ulang(42, 196) + m.chr(217));
        m.barisBaru();
      } },
    { baris: 80, jalan: function (m) {
        m.locate(2, 19);
        m.cetak(m.chr(179));
        m.spc(42);
        m.cetak(m.chr(179));
        m.barisBaru();
      } },
    { baris: 90, jalan: function (m) { m.warna(0, 7); } },

    /* --- 100-150: menu dua pilihan ---------------------------------------- */

    { baris: 100, jalan: function (m) {
        m.locate(2, 29);
        m.cetak(m.chr(255) + 'F R I E N D L Y W A R E' + m.chr(255));
        m.barisBaru();
      } },
    { baris: 110, jalan: function (m) {
        m.locate(7, 28); m.warna(7, 0);
        m.cetak('   Hearing And Eye Test'); m.barisBaru();
      } },
    { baris: 120, jalan: function (m) {
        m.locate(11, 32);
        m.warna(0, 7); m.cetak(' 1 ');
        m.warna(3, 0); m.cetak('   Hearing Test'); m.barisBaru();
      } },
    { baris: 130, jalan: function (m) {
        m.locate(13, 32);
        m.warna(0, 7); m.cetak(' 2 ');
        m.warna(3, 0); m.cetak('   Eye Test'); m.barisBaru();
      } },
    { baris: 140, jalan: function (m) {
        m.locate(19, 13);
        m.warna(15, 0); m.cetak('*****');
        m.warna(3, 0);  m.cetak(' Strike Key Corresponding To Function Desired ');
        m.warna(15, 0); m.cetak('*****'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 150, jalan: function (m) {
        m.locate(25, 23);
        m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Program ');
        m.warna(3, 0);
      } },

    /* 160 gelung jajak, sama seperti 260 di MENU.BAS. */
    { baris: 160, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(160);
      } },

    /* 170 IF RESP$="2" THEN GOSUB 210:GOTO 10

       Semua yang sesudah THEN milik THEN — termasuk GOTO 10. Jadi kalau
       pilihannya "2": panggil tes mata, dan sesudah pulang, MULAI PROGRAM INI
       DARI BARIS 10 LAGI. Bukan kembali ke gelung menu, melainkan menggambar
       ulang seluruh layar dari nol. Itu cara termurah membersihkan sisa layar
       tes yang baru saja jalan.

       Kalau pilihannya bukan "2", seluruh baris dilewati — dan itulah yang
       ditulis sebagai `m.lompat(180)`. */
    { baris: 170, bagian: [
        function (m) { if (m.v['RESP$'] === '2') m.gosub(210); else m.lompat(180); },
        function (m) { m.lompat(10); }
      ] },
    { baris: 180, bagian: [
        function (m) { if (m.v['RESP$'] === '1') m.gosub(700); else m.lompat(190); },
        function (m) { m.lompat(10); }
      ] },
    { baris: 190, jalan: function (m) { m.lompat(160); } },

    /* 200 RUN"menu — badan jebakan F10. */
    { baris: 200, jalan: function (m) { m.jalankan('menu'); } },

    /* --- 210-690: tes mata ------------------------------------------------ */

    { baris: 210, jalan: function () { /* REM *** BEGIN EYE CHART */ } },
    { baris: 220, jalan: function (m) {
        m.cls();
        m.cetak(m.ulang(80, 219));
        m.barisBaru();
      } },
    { baris: 230, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 240, jalan: function (m) {
        m.locate(23, 1);
        m.cetak(m.ulang(80, 219));
      } },
    { baris: 250, jalan: function (m) { m.warna(15, 0); } },
    { baris: 260, jalan: function (m) {
        m.locate(3, 32);
        m.cetak('HOME VISION TEST'); m.barisBaru();
        m.warna(3, 0);
      } },

    teks(270,  5, 15, 'This test is not a replacement for  regular visits'),
    teks(280,  6, 15, 'to your doctor. Only he can conduct a complete and'),
    teks(290,  7, 15, 'thorough examination.'),
    teks(300,  9, 15, 'To  test your vision,  stand back 20 feet from the'),
    teks(310, 10, 15, 'screen.  Place a hand  over  one  eye and  without'),
    teks(320, 11, 15, 'squinting, see if you can tell in which  direction'),
    teks(330, 12, 15, 'the character arms are pointing.'),
    teks(340, 14, 15, 'At 20 feet,  a person with normal vision should be'),
    teks(350, 15, 15, "able to correctly `read' the line marked 20/20."),
    teks(360, 17, 15, 'Repeat  the test  for your  other eye  and then on'),
    teks(370, 18, 15, 'both eyes at once.'),

    { baris: 380, jalan: function (m) {
        m.locate(25, 27); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue');
      } },
    { baris: 390, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(390);
      } },

    /* 400 COLOR 0,7 lalu 410 CLS — urutannya yang penting. CLS mengisi seluruh
       layar dengan warna latar yang SEDANG berlaku, jadi baganya nanti hitam
       di atas kelabu, bukan sebaliknya. Membalik kedua baris ini akan
       menghasilkan layar hitam. */
    { baris: 400, jalan: function (m) { m.warna(0, 7); } },
    { baris: 410, jalan: function (m) { m.cls(); } },

    barisKosong(420),
    barisBagan(430), barisBagan(440), barisBagan(450), barisBagan(460),
    barisKosong(470), barisKosong(480),
    barisBagan(490), barisBagan(500), barisBagan(510),
    barisKosong(520),
    barisBagan(530), barisBagan(540),
    barisKosong(550),
    barisBagan(560), barisBagan(570),
    barisKosong(580),
    barisBagan(590),
    barisKosong(600),
    barisBagan(610),
    barisKosong(620),
    barisBagan(630),
    barisKosong(640),

    { baris: 650, jalan: function (m) {
        m.locate(24, 23);
        m.cetak('*** Strike Any Key To Return To Menu ***');
      } },
    { baris: 660, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(660);
      } },
    { baris: 670, jalan: function (m) { m.warna(7, 0); m.cls(); } },
    /* Tidak ada baris 680. */
    { baris: 690, jalan: function (m) { m.kembali(); } },

    /* --- 700-1070: tes pendengaran ---------------------------------------- */

    { baris: 700, jalan: function (m) {
        m.cls();
        m.cetak(m.ulang(80, 219));
        m.barisBaru();
      } },
    { baris: 710, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 720, jalan: function (m) {
        m.locate(23, 1);
        m.cetak(m.ulang(80, 219));
      } },
    { baris: 730, jalan: function (m) {
        m.warna(15, 0);
        m.locate(3, 32);
        m.cetak('HOME HEARING TEST'); m.barisBaru();
        m.warna(3, 0);
      } },

    teks(740,  5, 15, 'This test is not a replacement for  regular visits'),
    teks(750,  6, 15, 'to your doctor. Only he can conduct a complete and'),
    teks(760,  7, 15, 'thorough examination.'),
    teks(770,  9, 15, 'To  test your hearing, strike any key to begin the'),
    teks(780, 10, 15, 'tone. When you can no longer hear the tone,  again'),
    teks(790, 11, 15, 'strike any key.'),
    teks(800, 13, 15, 'In  our testing  here at home,  we have found that'),
    teks(810, 14, 15, 'most people will lose the tone near  15,000 cycles'),
    teks(820, 15, 15, 'per second. The circuitry within the IBM P C  will'),
    teks(830, 16, 15, 'handle 32,000 cycles per second, but we had no way'),
    teks(840, 17, 15, 'to evaluate the capacity of the speaker.'),

    { baris: 850, jalan: function (m) {
        m.locate(25, 27); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue');
      } },
    { baris: 860, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(860);
      } },

    /* 870 CLS:PLAY "MF" — "MF" = Music Foreground: nada dimainkan sampai
       selesai sebelum program lanjut. Kebalikannya "MB" (background) yang
       membiarkan program jalan terus sementara nadanya berbunyi. */
    { baris: 870, jalan: function (m) { m.cls(); m.mainkan('MF'); } },

    /* 880 J=1 — lama tiap nada, dalam satuan detak jam (1/18,2 detik). */
    { baris: 880, jalan: function (m) { m.v.J = 1; } },
    { baris: 890, jalan: function (m) { m.warna(3, 0); } },
    { baris: 900, jalan: function (m) {
        m.locate(10, 25);
        m.cetak('This Test Is Designed For Home Use Only.');
      } },
    { baris: 910, jalan: function (m) {
        m.warna(15, 0);
        m.locate(12, 20);
        m.cetak('      *** Strike Any Key To Start Test ***');
      } },
    { baris: 920, jalan: function (m) {
        m.v['B$'] = m.inkey();
        if (m.v['B$'] === '') m.lompat(920);
      } },
    { baris: 930, jalan: function (m) {
        m.locate(12, 20);
        m.cetak('*** Strike Any Key When Pitch Cannot Be Heard ***');
      } },
    { baris: 940, jalan: function (m) { m.kosongkanPenyangga(); } },

    /* 950 FOR I=100 TO 30000 STEP 100

       Inilah tes pendengarannya, dan seluruhnya gelung tiga baris:
       naikkan nada, periksa tombol, ulangi. Yang diukur bukan waktu melainkan
       NILAI I saat gelungnya ditinggalkan — dan nilai itu masih ada sesudah
       gelung berakhir, karena variabel gelung di BASIC tidak dibuang.

       Di penelusur tidak ada nada yang terdengar, jadi tesnya kehilangan
       artinya. Kerangkanya tidak: 300 putaran, satu jajak per putaran, dan
       satu variabel yang bertahan hidup untuk menjadi jawabannya. */
    { baris: 950, jalan: function (m) { m.untuk('I', 100, 30000, 100, 1000); } },
    { baris: 960, jalan: function (m) { m.suara(m.v.I, m.v.J); } },
    /* 970 sesudah 14.000 Hz tiap nada ditahan sepuluh kali lebih lama —
       memberi telinga waktu lebih di daerah yang paling menentukan. */
    { baris: 970, jalan: function (m) { if (m.v.I === 14000) m.v.J = 10; } },
    { baris: 980, jalan: function (m) {
        m.v['B$'] = m.inkey();
        if (m.v['B$'] !== '') m.lompat(1000);
      } },
    { baris: 990, jalan: function (m) { m.lanjutkan('I'); } },

    { baris: 1000, jalan: function () { /* REM STOP TEST */ } },
    { baris: 1010, jalan: function (m) { m.warna(3, 0); } },
    { baris: 1020, jalan: function (m) { m.locate(12, 1); m.spc(79); } },
    /* 1030 PRINT "...At"; I ;"Cycles..." — I dicetak dengan bantalan spasi di
       kedua sisinya, seperti semua angka di BASIC. */
    { baris: 1030, jalan: function (m) {
        m.locate(14, 20, 0);
        m.cetak('     Key Was Struck At' + angka(m.v.I) + 'Cycles Per Second     ');
      } },
    { baris: 1040, jalan: function (m) { m.warna(15, 0); } },
    { baris: 1050, jalan: function (m) {
        m.locate(25, 25);
        m.cetak('*** Strike Any Key To Return To Menu ***');
      } },
    { baris: 1060, jalan: function (m) {
        m.v['B$'] = m.inkey();
        if (m.v['B$'] === '') m.lompat(1060);
      } },
    { baris: 1070, jalan: function (m) { m.kembali(); } },

    /* --- 1080-1180: sembilan jebakan mandul -------------------------------

       Sembilan baris terpisah yang isinya sama persis, lalu satu gelung untuk
       menyalakannya. MENU.BAS dan CHECK.BAS mengerjakan hal yang sama dalam
       SATU baris (`FOR A=1 TO 9:ON KEY(A) GOSUB ...:KEY(A) ON:NEXT`).
       Sembilan baris versus satu, hasil sama — penulis yang berbeda. */
    jebakan(1080, 1), jebakan(1090, 2), jebakan(1100, 3),
    jebakan(1110, 4), jebakan(1120, 5), jebakan(1130, 6),
    jebakan(1140, 7), jebakan(1150, 8), jebakan(1160, 9),

    { baris: 1170, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) m.jebakan(m.v.A, true);
      } },

    /* 1180 RETURN — penutup GOSUB 1080 dari baris 50, SEKALIGUS badan jebakan
       F1-F9. Pola yang sama persis dengan baris 510 MENU.BAS dan 70 CHECK.BAS:
       satu RETURN yang bekerja rangkap. */
    { baris: 1180, jalan: function (m) { m.kembali(); } }
  ];

  function jebakan(nomor, tombol) {
    return { baris: nomor, jalan: function (m) { m.pasangJebakan(tombol, 1180); } };
  }

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['HEAREYE'] = {
    nama: 'HEAREYE',
    judul: 'Hearing And Eye Test',
    sumber: 'HEAREYE',
    berkas: 'run/HEAREYE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur HEAREYE.BAS',
      simpul: [
        { id: 'siap', baris: '10-50', jenis: 'mulai',
          teks: ['Siapkan layar, pasang jebakan', 'F10 keluar, F1-F9 mandul'] },
        { id: 'menu', baris: '60-150',
          teks: ['Gambar kotak judul', 'dan dua pilihan'] },
        { id: 'tunggu', baris: '160', jenis: 'putusan',
          teks: ['Ada tombol ditekan?'] },
        { id: 'pilih', baris: '170-190', jenis: 'putusan',
          teks: ['Tombolnya 1 atau 2?'] },
        { id: 'mata', baris: '210-690', jenis: 'subrutin',
          teks: ['Tes mata: penjelasan,', 'lalu bagan enam baris'] },
        { id: 'dengar', baris: '700-1070', jenis: 'subrutin',
          teks: ['Tes pendengaran: penjelasan,', 'lalu nada naik 100-30.000 Hz'] },
        { id: 'keluar', baris: '200', jenis: 'keluar',
          teks: ['RUN "menu"', 'hanya lewat F10'] }
      ],
      panah: [
        { dari: 'siap',   ke: 'menu' },
        { dari: 'menu',   ke: 'tunggu' },
        { dari: 'tunggu', ke: 'tunggu', label: 'belum' },
        { dari: 'tunggu', ke: 'pilih',  label: 'ya' },
        { dari: 'pilih',  ke: 'tunggu', label: 'bukan 1/2' },
        { dari: 'pilih',  ke: 'mata',   label: '2' },
        { dari: 'pilih',  ke: 'dengar', label: '1' },
        { dari: 'mata',   ke: 'siap',   label: 'GOTO 10' },
        { dari: 'dengar', ke: 'siap',   label: 'GOTO 10' },
        { dari: 'siap',   ke: 'keluar', label: 'F10' }
      ]
    },

    pseudokode: [
      { baris: 10,  tingkat: 0, teks: 'siapkan layar, buang tombol yang tertunda' },
      { baris: 30,  tingkat: 0, teks: 'kalau F10 ditekan, panggil baris 200 (kembali ke menu)' },
      { baris: 50,  tingkat: 0, teks: 'pasang jebakan F1&ndash;F9 &mdash; semuanya cuma <b>pulang</b>' },
      { baris: 60,  tingkat: 0, teks: 'gambar kotak dan judul FRIENDLYWARE' },
      { baris: 120, tingkat: 0, teks: 'tulis pilihan 1 (tes pendengaran) dan 2 (tes mata)' },
      { baris: 160, tingkat: 0, teks: '<b>ULANG selamanya:</b>' },
      { baris: 160, tingkat: 1, teks: 'tunggu satu tombol' },
      { baris: 170, tingkat: 1, teks: 'kalau "2": <b>jalankan tes mata</b>, lalu <b>ulangi program dari baris 10</b>' },
      { baris: 180, tingkat: 1, teks: 'kalau "1": jalankan tes pendengaran, lalu ulangi dari baris 10' },
      { baris: 190, tingkat: 1, teks: 'tombol lain: abaikan' },

      { baris: 210, tingkat: 0, teks: '<b>TES MATA</b> (baris 210&ndash;690):' },
      { baris: 220, tingkat: 1, teks: 'gambar bingkai balok penuh di sekeliling layar' },
      { baris: 270, tingkat: 1, teks: 'tulis penjelasan: berdiri 20 kaki, tutup satu mata' },
      { baris: 390, tingkat: 1, teks: 'tunggu satu tombol' },
      { baris: 400, tingkat: 1, teks: 'ganti warna jadi hitam-di-atas-kelabu, <b>lalu</b> bersihkan layar' },
      { baris: 430, tingkat: 1, teks: 'cetak 14 baris bagan: huruf E dan C dari balok CP437' },
      { baris: 650, tingkat: 1, teks: 'tunggu tombol, kembalikan warna, pulang' },

      { baris: 700, tingkat: 0, teks: '<b>TES PENDENGARAN</b> (baris 700&ndash;1070):' },
      { baris: 730, tingkat: 1, teks: 'tulis penjelasan: tekan tombol saat nada tak terdengar lagi' },
      { baris: 880, tingkat: 1, teks: 'lama tiap nada = 1 detak jam' },
      { baris: 920, tingkat: 1, teks: 'tunggu tombol mulai' },
      { baris: 950, tingkat: 1, teks: '<b>untuk frekuensi dari 100 sampai 30.000, naik 100:</b>' },
      { baris: 960, tingkat: 2, teks: 'bunyikan nada pada frekuensi itu' },
      { baris: 970, tingkat: 2, teks: 'lewat 14.000 Hz, tahan tiap nada 10&times; lebih lama' },
      { baris: 980, tingkat: 2, teks: 'ada tombol ditekan? <b>keluar dari gelung</b>' },
      { baris: 1030, tingkat: 1, teks: 'tampilkan <b>nilai frekuensi terakhir</b> &mdash; variabel gelung masih hidup' },
      { baris: 1060, tingkat: 1, teks: 'tunggu tombol, pulang' }
    ],

    perintahAsli: 'run\\HEAREYE.bat',
    catatanAsli: 'Di DOSBox-X tes pendengarannya benar-benar berbunyi, dan ' +
      'itulah satu-satunya cara program ini masuk akal. Bagan matanya pun ' +
      'baru berukuran benar di layar CGA sungguhan yang ditonton dari jarak ' +
      'enam meter.',

    penyimpangan: [
      '<b><code>SOUND</code> tidak berbunyi &mdash; dan ini penyimpangan ' +
      'terbesar sejauh ini.</b> Seluruh tes pendengaran adalah nada yang naik ' +
      'dari 100 Hz ke 30.000 Hz; tanpa nada itu tidak ada yang bisa didengar ' +
      'untuk diuji. Yang masih bisa ditelusuri adalah kerangkanya: 300 ' +
      'putaran, satu jajak papan ketik per putaran, dan satu variabel gelung ' +
      'yang bertahan hidup untuk menjadi jawabannya.',

      '<b>Bagan matanya tidak berukuran benar.</b> Ia dirancang untuk layar ' +
      'CGA 25 baris yang ditonton dari jarak enam meter. Di jendela peramban ' +
      'ukurannya bergantung tetapan pembaca, jadi angka 20/20 di sana tidak ' +
      'berarti apa-apa di sini. Bentuknya tetap disalin persis.',

      '<b>Isi bagan disalin sebagai kode bita, bukan diketik ulang.</b> ' +
      'Empat belas barisnya gambar yang dibangun dari balok CP437; satu kolom ' +
      'meleset merusak barisnya. Di berkas port isinya tersimpan sebagai ' +
      'daftar kode yang diringkas (<code>219*9</code> = sembilan balok penuh), ' +
      'diambil langsung dari <code>run/HEAREYE.BAS</code>.',

      '<b><code>PLAY "MF"</code> tidak berbuat apa-apa.</b> Perintah itu ' +
      'mengatur agar nada dimainkan sampai selesai sebelum program lanjut. ' +
      'Tanpa suara, tidak ada yang perlu diatur.'
    ],

    pelajaran: {
      ringkas: 'Tes mata dan tes pendengaran dalam satu program 117 baris. ' +
        'Baris 10-90 identik dengan INTRO.BAS &mdash; ini kembarannya, dari ' +
        'templat yang sama, dengan isi tengah yang berbeda.',
      pelajari: [
        ['Variabel gelung tetap hidup sesudah gelungnya berakhir',
         'Seluruh tes pendengaran mengukur satu hal: pada frekuensi berapa ' +
         'pemakai menekan tombol. Jawabannya tidak disimpan ke variabel lain ' +
         '&mdash; ia <b>adalah</b> variabel gelung <code>I</code>, yang masih ' +
         'ada saat baris 1030 mencetaknya. Cara paling murah menyimpan hasil: ' +
         'jangan menyimpannya.'],
        ['Urutan COLOR dan CLS menentukan warna seluruh layar',
         'Baris 400 mengganti warna, baris 410 baru membersihkan. ' +
         '<code>CLS</code> mengisi layar dengan warna latar yang sedang ' +
         'berlaku, jadi baganya keluar hitam di atas kelabu. Membalik kedua ' +
         'baris itu menghasilkan layar hitam dan bagan yang nyaris tak ' +
         'terlihat.'],
        ['Menggambar ulang dari nol lebih murah daripada membersihkan',
         'Sesudah tes selesai, baris 170 dan 180 tidak kembali ke gelung menu ' +
         '&mdash; keduanya <code>GOTO 10</code>, mengulang seluruh program. ' +
         'Tidak ada daftar "apa saja yang perlu dibersihkan" untuk dijaga ' +
         'tetap benar. Pola yang sama dipakai kerangka antarmuka modern.'],
        ['Templat yang disalin terlihat dari kerangkanya',
         'Baris 10-90 di sini sama persis dengan INTRO.BAS. Sekali Anda ' +
         'mengenali kerangka bersama sebuah koleksi, program berikutnya cuma ' +
         'perlu dibaca bagian tengahnya.']
      ],
      hindari: [
        ['Sembilan baris untuk pekerjaan satu baris',
         'Baris 1080-1160 adalah sembilan <code>ON KEY(n) GOSUB 1180</code> ' +
         'yang identik. MENU.BAS mengerjakannya dengan satu gelung. Sekali ' +
         'lagi: dua penulis dalam satu produk.'],
        ['Angka ajaib tanpa nama',
         '<code>IF I=14000 THEN J=10</code> di baris 970. Kenapa 14.000? ' +
         'Kenapa 10? Penjelasannya ada di layar (baris 810 menyebut 15.000 Hz), ' +
         'tapi tidak di kodenya. Enam bulan kemudian angka itu tidak bisa ' +
         'diubah dengan percaya diri oleh siapa pun.'],
        ['Tes kesehatan tanpa kalibrasi',
         'Bagan mata mengandaikan ukuran layar tertentu dan jarak enam meter; ' +
         'tes pendengaran mengandaikan pengeras suara yang responsnya rata. ' +
         'Baris 830 mengakuinya sendiri: "kami tidak punya cara mengukur ' +
         'kemampuan pengeras suaranya". Jujur, dan justru karena itu jangan ' +
         'ditiru diam-diam.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa program ini cukup dengan satu diagram',
        isi: [
          'Empat program sebelumnya masing-masing dapat satu peta alur; ' +
          'TOWERS dapat tambahan peta keadaan karena satu variabel di sana ' +
          'mengubah arti tombol yang sama. Program ini <b>tidak</b> dapat ' +
          'tambahan, dan itu keputusan, bukan kelalaian.',
          'Jenis diagram mengikuti bentuk programnya. HEAREYE tidak punya ' +
          'keadaan yang berganti-ganti, tidak punya beberapa peran pemakai, ' +
          'dan subrutinnya tidak saling memanggil bolak-balik. Ia menu dengan ' +
          'dua cabang lurus. Menambahkan diagram keadaan untuk program yang ' +
          'tidak punya keadaan bukan kelengkapan &mdash; itu hiasan yang ' +
          'menyiratkan kerumitan yang tidak ada.'
        ] },
      { judul: 'Satu variabel yang menjadi jawaban',
        isi: [
          'Perhatikan apa yang <b>tidak</b> dilakukan tes pendengaran. Ia ' +
          'tidak menyimpan frekuensi ke variabel hasil, tidak mencatat waktu, ' +
          'tidak menghitung apa pun sesudahnya.',
          '<code>950 FOR I=100 TO 30000 STEP 100</code> menaikkan ' +
          '<code>I</code>; <code>980</code> keluar dari gelung begitu ada ' +
          'tombol; <code>1030</code> mencetak <code>I</code>. Jawabannya ' +
          '<b>adalah</b> variabel gelungnya.',
          'Itu jalan karena di BASIC — dan di sebagian besar bahasa turunan C ' +
          '— variabel gelung tidak dibuang saat gelungnya berakhir. Di ' +
          'Python, JavaScript dengan <code>var</code>, dan C juga begitu. ' +
          'Yang berbeda: JavaScript dengan <code>let</code> dan Rust ' +
          'membuangnya, dan di sana pola ini tidak akan jalan.',
          'Bukan berarti pola ini selalu bagus. Ia menyandarkan hasil pada ' +
          'detail bahasa yang tidak terlihat di baris mana pun. Tapi ' +
          'mengenalinya membuat Anda paham kenapa kode lama sering terlihat ' +
          '"kurang satu langkah".'
        ] },
      { judul: 'Kembaran INTRO.BAS',
        isi: [
          'Buka INTRO.BAS di penelusur ini dan bandingkan baris 10 sampai 90. ' +
          'Sama persis, karakter demi karakter: siapkan layar, pasang jebakan ' +
          'F10, gambar kotak dari <code>CHR$(218)</code> dan ' +
          '<code>STRING$(42,196)</code>, tulis FRIENDLYWARE terbalik-warna.',
          'Satu perbedaan yang layak diperhatikan: INTRO.BAS punya ' +
          '<code>41 ON ERROR GOTO 200</code> yang menelan semua galat. ' +
          'HEAREYE <b>tidak punya penangkap galat sama sekali</b>. Dua program ' +
          'dari templat yang sama, dua sikap berbeda terhadap kegagalan — dan ' +
          'kemungkinan besar bukan karena diputuskan, melainkan karena baris ' +
          'itu ikut tersalin di satu tempat dan tidak di tempat lain.',
          'Kalau Anda pernah menyalin berkas kerangka lalu mengubahnya, Anda ' +
          'sudah membuat perbedaan seperti ini. Itu sebabnya kerangka lebih ' +
          'baik dipanggil daripada disalin.'
        ] },
      { judul: 'Kenapa layarnya kelabu',
        isi: [
          'Dua baris berurutan, dan urutannya menentukan seluruh tampilan:',
          '<code>400 COLOR 0,7</code> lalu <code>410 CLS</code>',
          '<code>CLS</code> tidak sekadar menghapus. Ia mengisi kedua ribu sel ' +
          'layar dengan spasi <b>berwarna latar yang sedang berlaku</b>. Jadi ' +
          'sesudah <code>COLOR 0,7</code> (hitam di atas kelabu), seluruh ' +
          'layar menjadi kelabu — dan bagan yang dicetak sesudahnya keluar ' +
          'hitam di atasnya, seperti bagan mata sungguhan di klinik.',
          'Balik urutannya dan Anda dapat layar hitam dengan bagan yang nyaris ' +
          'tak terlihat. Perbedaan sebesar itu, dari menukar dua baris.'
        ] }
    ]
  };
})(window);
