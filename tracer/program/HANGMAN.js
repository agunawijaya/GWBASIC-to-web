/* ===========================================================================
   HANGMAN.js — porting minimalis HANGMAN.BAS sebagai tabel baris.

   Program kesebelas. Dua gagasan di dalamnya layak dipelajari, dan keduanya
   soal cara menghindari sepuluh salinan kode:

   1. TANGGA JATUH-KE-BAWAH UNTUK SEPULUH KEADAAN GAMBAR.
      Tiap tebakan salah menambah satu bagian orang-orangan. Cara wajar:
      sepuluh rutin gambar, satu per keadaan. Cara program ini:

          650 ON CHANCE GOTO 760,750,740,730,720,710,700,690,680
          660 GOSUB 1230   ' tiang gantungan
          670 GOSUB 980    ' kaki kiri
          680 GOSUB 970    ' kaki kanan
          ...
          760 GOSUB 810    ' kepala

      Satu tangga, sepuluh pintu masuk. Masuk dari 760 menggambar kepala
      saja; masuk dari 750 menggambar badan LALU kepala; masuk dari 660
      menggambar semuanya. Bagian yang lebih baru selalu di atas, dan
      urutannya terjaga sendiri.

   2. KARAKTER KENDALI KURSOR DI DALAM STRING.
      Baris 1980-2120 membangun string animasi yang berisi CHR$(29) (kursor
      kiri), CHR$(30) (atas), dan CHR$(31) (bawah). Satu PRINT menggambar
      bentuk dua dimensi. Itu prinsip yang sama dengan urutan escape terminal
      yang masih dipakai hari ini.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Kelima baris `PLAY` di 520-540 ("Hail To The Chief") dan 1130-1170
     ("Taps"), serta `SOUND` di 1190, tidak berbunyi.
   - `DEFINT A-T` dan `DEFSTR U,W` tidak ditiru; JavaScript tidak punya
     deklarasi tipe per huruf awal.
   - Pengacaknya bukan pengacak GW-BASIC, dan benihnya tetap.
   - Ketiga gelung tunda (baris 500, 620, 780, 1180) habis seketika.
   =========================================================================== */

(function (global) {
  'use strict';

  var DETIK_TETAP = 7;

  var KATA = ('BUG,PRINTER,GAME,ELBOW,PIZZA,BUDGET,CRY,THING,FEIGN,CARD,TALK,' +
    'EXAMPLE,TENSION,CALCULATOR,SHOE,TABLE,STEREO,BICYCLE,GUESS,BLENDER,FAULT,' +
    'DIRTY,LOUDSPEAKER,CHICKEN,DANGEROUS,DIFFERENT,SCIENTIST,KIDNEY,SELF,' +
    'MAHOGANY,UGLY,FRIENDLYWARE,PROGRAM,OPERA,MUSIC,REPLICA,COMPUTER,BABOON,' +
    'CHIMPANZEE,CHAIR,HORSE,FELLOW,AUTOMOBILE,KIDNAP,LAMP,LIGHT,FREEZER,FRY,' +
    'SKATE,ERRONEOUSLY,SEQUENCE,AFTER,HIGHWAY,POLICE,ART,CRIED,FLY,AIRPLANE,' +
    'SAILBOAT,HOUSE,DRIVEWAY,FENCE,HOTEL,MOTEL,SWIM,OCEAN,LAKE,DRIVE,ICE,SNOW,' +
    'CATCH,FALL,WALL,FLOOR,ESCAPE,QUE,CHECK,FILE,JUMP,CEMENT,ASPHALT,BRICK,' +
    'MAILBOX,TRUCK,THUNDER,LIGHTNING,RAIN,ADVENTURE,BUS,TOWER,SKYSCRAPER,LAWN,' +
    'ELEPHANT,CIRCUS,SCARY,KILLED,BABY,PUPPIES,CHURCH,STORE,STREET').split(',');

  var tabel = [

    { baris: 1, jalan: function () { /* 'update 2/1/83 */ } },
    { baris: 10, jalan: function (m) { m.locate(null, null, 0); m.warna(3, 0); } },
    { baris: 110, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 790); m.jebakan(m.v.A, true);
        }
      } },
    { baris: 120, jalan: function (m) { m.jebakan(10, true); m.kosongkanPenyangga(); } },
    { baris: 130, jalan: function (m) { m.pasangJebakan(10, 1600); } },
    { baris: 140, jalan: function () { /* DEFINT A-T */ } },
    { baris: 150, jalan: function (m) {
        m.dim('WORD_', 100); m.dim('A_', 100); m.dim('USED', 27);
        m.dim('X$', 10); m.dim('X1$', 10); m.dim('Y$', 10); m.dim('Y1$', 10);
        m.semai(DETIK_TETAP);
      } },
    { baris: 160, jalan: function (m) { m.gosub(1980); } },
    /* 170-190 baca 101 kata dari DATA. */
    { baris: 170, jalan: function (m) { m.untuk('B', 0, 100, 1, 200); } },
    { baris: 180, jalan: function (m) { m.v.WORD_[m.v.B] = m.baca(); } },
    { baris: 190, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 200, jalan: function (m) { m.gosub(1320); } },

    { baris: 210, jalan: function (m) {
        m.cls(); m.locate(1, 33);
        m.cetak('H A N G M A N'); m.barisBaru();
      } },
    { baris: 220, jalan: function (m) {
        for (m.v.C = 1; m.v.C <= 27; m.v.C++) m.v.USED[m.v.C] = '';
      } },
    { baris: 230, jalan: function (m) { m.v.A = (m.v.A || 0) + 1; } },
    { baris: 240, jalan: function (m) { m.v.CHANCE = 0; } },
    /* 250 RANDOMIZE di dalam gelung undian lagi — pola yang sama dengan
       MASTER.BAS, dan sama-sama tidak menambah keacakan apa pun. */
    { baris: 250, jalan: function (m) { m.semai(DETIK_TETAP); } },
    { baris: 260, jalan: function (m) {
        m.v.B = Math.floor(m.acak() * 100);
        m.v.A_[m.v.A] = m.v.B;
      } },
    /* 270 tolak kata yang sudah pernah dipakai — undi ulang sampai baru. */
    { baris: 270, bagian: [
        function (m) { m.untuk('C', 0, m.v.A - 1, 1, 280); },
        function (m) {
          if (m.v.A_[m.v.C] === m.v.B) m.lompat(260); else m.lanjutkan('C');
        }
      ] },
    { baris: 280, jalan: function (m) {
        m.v.L = m.v.WORD_[m.v.B].length;
        m.v.WORD = ulangSpasi(m.v.L);
        m.v.WH1 = ulangSpasi(m.v.L);
        m.v.X = 1;
      } },
    /* 290 tampilkan kata: huruf yang sudah ketemu, "-" untuk yang belum. */
    { baris: 290, bagian: [
        function (m) { m.locate(10, 30); },
        function (m) { m.untuk('C', 1, m.v.L, 1, 310); },
        function (m) {
          var ch = m.v.WORD.charAt(m.v.C - 1);
          m.cetak(ch === ' ' ? '- ' : ch + ' ');
        }
      ] },
    { baris: 300, jalan: function (m) { m.lanjutkan('C'); } },
    { baris: 310, bagian: [
        function (m) { m.v.XLIN = m.barisKursor(); m.v.YPOS = m.pos(); },
        function (m) { m.gosub(1650); }
      ] },
    { baris: 320, jalan: function (m) { m.warna(0, 7); } },
    { baris: 330, jalan: function (m) {
        m.locate(4, 23);
        m.cetak(' These Are The Letters You Have Used '); m.barisBaru();
      } },
    { baris: 340, jalan: function (m) { m.warna(3, 0); } },
    { baris: 350, jalan: function (m) {
        m.locate(6, 25);
        for (m.v.C = 1; m.v.C <= m.v.X; m.v.C++) m.cetak(m.v.USED[m.v.C] + ' ');
      } },
    { baris: 360, jalan: function (m) {
        m.locate(8, 30); m.cetak('This Is Your Word:'); m.barisBaru();
      } },
    { baris: 370, bagian: [
        function (m) {
          m.warna(15, 0); m.locate(12, 28, 1);
          m.cetak('Please Guess A Letter');
          m.warna(3, 0);
        },
        function (m) { m.gosub(1550); }
      ] },
    { baris: 380, jalan: function (m) {
        if (m.v.W >= 'A' && m.v.W <= 'Z') m.lompat(390); else m.lompat(610);
      } },
    /* 390 tolak huruf yang sudah pernah ditebak. */
    { baris: 390, bagian: [
        function (m) { m.untuk('G', 1, m.v.X, 1, 400); },
        function (m) {
          if (m.v.W === m.v.USED[m.v.G]) m.lompat(630); else m.lanjutkan('G');
        }
      ] },
    { baris: 400, jalan: function (m) { m.locate(10, 28, 0); } },
    { baris: 410, jalan: function (m) { m.v.FLAG = 0; } },
    /* 420 cari huruf tebakan di seluruh kata. Perhatikan
       `MID$(WORD,G,1)=...` — MID$ di sisi KIRI penugasan mengganti satu
       karakter di tempatnya, tanpa membongkar seluruh stringnya. */
    { baris: 420, bagian: [
        function (m) { m.untuk('G', 1, m.v.L, 1, 440); },
        function (m) {
          var asli = m.v.WORD_[m.v.B];
          if (m.v.W !== asli.charAt(m.v.G - 1)) return;
          m.v.FLAG = 1;
          m.locate(10, 28 + 2 * m.v.G);
          m.cetak(asli.charAt(m.v.G - 1));
          m.v.WORD = gantiMid(m.v.WORD, m.v.G, asli.charAt(m.v.G - 1));
          if (m.v.WORD === asli) m.lompat(520);
        }
      ] },
    { baris: 430, jalan: function (m) { m.lanjutkan('G'); } },
    { baris: 440, bagian: [
        function (m) {
          m.v.USED[m.v.X] = m.v.W;
          m.v.X = m.v.X + 1;
          if (m.v.FLAG === 0) m.gosub(640); else m.lompat(290);
        },
        function (m) { if (m.v.CHANCE === 10) m.lompat(560); else m.lompat(290); }
      ] },

    /* 450-500 tebakan kata utuh. */
    { baris: 450, jalan: function (m) {
        m.v.FLAG = 0;
        m.locate(12, 1); m.spc(79); m.barisBaru();
        m.warna(15, 0);
      } },
    { baris: 455, jalan: function (m) {
        m.locate(24, 20);
        m.cetak('Enter Your Guess And Then Strike Enter Key');
      } },
    { baris: 460, bagian: [
        function (m) {
          m.warna(31, 0); m.locate(21, 20, 1);
          m.cetak('What Do You Think The Word Is? ');
          m.warna(7, 0);
        },
        function (m) { m.gosub(2130); }
      ] },
    { baris: 470, jalan: function (m) { m.v.WH = m.v.WA; } },
    { baris: 480, jalan: function (m) {
        m.warna(3, 0);
        if (m.v.WH === m.v.WORD_[m.v.B]) m.lompat(520);
      } },
    { baris: 490, jalan: function (m) {
        m.locate(24, 1); m.spc(79);
        m.locate(22, 30); m.cetak('Nice Try. But No Cigar !!'); m.barisBaru();
      } },
    { baris: 500, jalan: function (m) {
        m.locate(21, 1); m.cetak(m.ulang(80, 32));
        for (m.v.G = 1; m.v.G <= 2000; m.v.G++) { /* jeda */ }
        m.locate(22, 1); m.cetak(m.ulang(80, 32));
        m.lompat(290);
      } },

    { baris: 510, jalan: function () { /* REM******* HAIL TO THE CHIEF */ } },
    lagu(520, 'T140MNMB'),
    lagu(530, 'MB O2 G4. A4 B8 O3 C4.O2 B4 A8 G4 A8 G4 E8 D4. C4.'),
    lagu(540, 'MB O2 G4. A4 B8 O3 C4.O2 B4 A8 G4 A8 G4 E8 D4. C4.'),
    { baris: 550, bagian: [
        function (m) { m.gosub(1690); },
        function (m) {
          m.locate(23, 19);
          m.cetak(' You Guessed It !!!!     In' + angka(m.v.X - 1) + 'Tries');
          m.barisBaru();
        }
      ] },
    { baris: 560, jalan: function (m) { m.warna(0, 7); } },
    { baris: 570, jalan: function (m) {
        m.locate(25, 20);
        m.cetak(' Would You Like To Try Another Word? <Y/N> ');
      } },
    { baris: 580, jalan: function (m) { m.warna(3, 0); } },
    { baris: 590, bagian: [
        function (m) { m.gosub(1550); },
        function (m) {
          if (m.v.W === 'Y') m.lompat(210);
          else if (m.v.W !== 'N') m.lompat(590);
        }
      ] },
    { baris: 600, jalan: function (m) {
        m.cls(); m.locate(10, 22);
        m.cetak('Thank You For Playing H A N G M A N'); m.barisBaru();
        m.lompat(1680);
      } },

    { baris: 610, jalan: function (m) {
        m.locate(12, 23); m.cetak('Invalid REPLY. Please Try Again.');
      } },
    { baris: 620, jalan: function (m) {
        for (m.v.G = 1; m.v.G <= 4500; m.v.G++) { /* jeda */ }
        m.locate(12, 1); m.spc(70); m.barisBaru();
        m.lompat(370);
      } },
    { baris: 630, jalan: function (m) {
        m.locate(12, 16);
        m.cetak('You Already Used That Letter. Please Try Again.'); m.barisBaru();
        m.lompat(620);
      } },

    /* --- 640-790: TANGGA GAMBAR ------------------------------------------

       Inilah bagian yang layak dipelajari. Baris 650 memilih PINTU MASUK ke
       tangga; sisanya jatuh ke bawah sampai baris 760. Makin banyak tebakan
       salah, makin tinggi pintu masuknya, makin banyak bagian yang digambar.
       Sepuluh keadaan gambar tanpa sepuluh rutin gambar. */
    { baris: 640, jalan: function (m) {
        m.v.CHANCE = m.v.CHANCE + 1;
        m.cls(); m.warna(15, 0);
      } },
    { baris: 650, jalan: function (m) {
        var tujuan = [760, 750, 740, 730, 720, 710, 700, 690, 680];
        var t = tujuan[m.v.CHANCE - 1];
        if (t) m.lompat(t);          /* CHANCE 10 jatuh ke 660: semuanya */
      } },
    bagian(660, 1230),   /* tiang gantungan */
    bagian(670, 980),    /* kaki kiri       */
    bagian(680, 970),    /* kaki kanan      */
    bagian(690, 1090),   /* tangan kanan    */
    bagian(700, 1080),   /* tangan kiri     */
    bagian(710, 1040),   /* lengan kanan    */
    bagian(720, 1000),   /* lengan kiri     */
    bagian(730, 960),    /* tungkai kanan   */
    bagian(740, 950),    /* tungkai kiri    */
    bagian(750, 880),    /* badan           */
    { baris: 760, bagian: [
        function (m) { m.gosub(810); },   /* kepala */
        function (m) { m.warna(3, 0); }
      ] },
    { baris: 770, bagian: [
        function (m) { if (m.v.CHANCE === 10) m.gosub(1100); }
      ] },
    { baris: 780, jalan: function (m) {
        for (m.v.C = 1; m.v.C <= 3500; m.v.C++) { /* jeda */ }
        if (m.v.CHANCE < 10) m.cls();
      } },
    /* 790 RETURN — penutup tangga gambar SEKALIGUS badan jebakan F1-F9. */
    { baris: 790, jalan: function (m) { m.kembali(); } },

    /* 800-930 bagian-bagian tubuh. */
    { baris: 800, jalan: function () { /* REM**** HEAD **** */ } },
    { baris: 810, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 35);
        m.cetak(m.chr(218) + m.ulang(5, 196) + m.chr(191)); m.barisBaru();
      } },
    { baris: 820, jalan: function (m) {
        m.locate(4, 35);
        m.cetak(m.chr(179) + ' ' + m.chr(1) + ' ' + m.chr(1) + ' ' + m.chr(179));
        m.barisBaru();
      } },
    { baris: 830, jalan: function (m) {
        m.locate(5, 35);
        m.cetak(m.chr(179) + '  ' + m.chr(179) + '  ' + m.chr(179)); m.barisBaru();
      } },
    { baris: 840, jalan: function (m) {
        m.locate(6, 35);
        m.cetak(m.chr(179) + ' ' + m.ulang(3, 196) + ' ' + m.chr(179)); m.barisBaru();
      } },
    { baris: 850, jalan: function (m) {
        m.locate(7, 35);
        m.cetak(m.chr(192) + m.ulang(5, 196) + m.chr(217)); m.barisBaru();
      } },
    { baris: 860, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    { baris: 870, jalan: function () { /* REM**** UPPER TORSO **** */ } },
    { baris: 880, jalan: function (m) {
        m.warna(2, 0); m.locate(8, 33);
        m.cetak(m.ulang(11, 176)); m.barisBaru();
      } },
    { baris: 890, jalan: function (m) {
        m.locate(9, 32); m.cetak(m.ulang(13, 176)); m.barisBaru();
      } },
    { baris: 900, jalan: function (m) {
        for (m.v.C = 10; m.v.C <= 13; m.v.C++) {
          m.locate(m.v.C, 35); m.cetak(m.ulang(7, 176)); m.barisBaru();
        }
      } },
    { baris: 910, jalan: function (m) {
        m.locate(14, 35); m.cetak(m.ulang(7, 176)); m.barisBaru();
      } },
    { baris: 920, jalan: function (m) {
        m.locate(15, 36); m.cetak(m.ulang(5, 176)); m.barisBaru();
      } },
    { baris: 930, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    { baris: 940, jalan: function () { /* REM**** LEGS **** */ } },
    kaki(950, 36), kaki(960, 39),
    telapak(970, 39), telapak(980, 34),

    { baris: 990, jalan: function () { /* REM**** ARMS **** */ } },
    { baris: 1000, jalan: function (m) {
        m.warna(14, 0); m.locate(10, 31); m.cetak(m.ulang(2, 176)); m.barisBaru();
      } },
    { baris: 1010, jalan: function (m) {
        m.locate(11, 30); m.cetak(m.ulang(2, 176)); m.barisBaru();
      } },
    { baris: 1020, jalan: function (m) {
        m.locate(12, 29); m.cetak(m.ulang(2, 176)); m.barisBaru();
      } },
    { baris: 1030, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 1040, jalan: function (m) {
        m.warna(14, 0); m.locate(10, 44); m.cetak(m.ulang(2, 176)); m.barisBaru();
      } },
    { baris: 1050, jalan: function (m) {
        m.locate(11, 45); m.cetak(m.ulang(2, 176)); m.barisBaru();
      } },
    { baris: 1060, jalan: function (m) {
        m.locate(12, 46); m.cetak(m.ulang(2, 176)); m.barisBaru();
      } },
    { baris: 1070, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    tangan(1080, 13, 28), tangan(1090, 13, 46),

    { baris: 1100, jalan: function (m) {
        m.locate(2, 38); m.cetak(m.chr(179)); m.barisBaru();
      } },
    { baris: 1110, jalan: function (m) {
        m.locate(3, 38); m.cetak(m.chr(179)); m.barisBaru();
      } },
    { baris: 1120, jalan: function () { /* REM****** TAPS */ } },
    lagu(1130, 'T120MNMB'),
    lagu(1140, 'O3L8C.L16C L2F.L8C.L16F'),
    lagu(1150, 'L2A.L8C.L16F L4A L8C. L16F L4A L8C. L16F L2A.'),
    lagu(1160, 'O3 L8F.L16A ML O4L2C MN O3L4AL4FL2C.'),
    lagu(1170, 'O3L8C.L16C ML L1F MN L4F'),
    { baris: 1180, jalan: function (m) {
        for (m.v.C = 1; m.v.C <= 1200; m.v.C++) { /* jeda */ }
      } },
    { baris: 1190, jalan: function (m) {
        for (m.v.C = 50; m.v.C <= 200; m.v.C++) m.suara(m.v.C, 0.0001);
        m.suara(m.v.C, 0);
      } },
    { baris: 1200, jalan: function (m) { m.locate(21, 31); m.spc(20); m.barisBaru(); } },
    { baris: 1210, jalan: function (m) { m.kembali(); } },

    /* 1220-1280 tiang gantungan. */
    { baris: 1220, jalan: function () { /* REM**** GALLOWS **** */ } },
    { baris: 1230, jalan: function (m) {
        m.locate(1, 15); m.cetak(m.ulang(25, 178)); m.barisBaru();
      } },
    { baris: 1240, jalan: function (m) {
        m.locate(2, 15); m.cetak(m.ulang(5, 178)); m.barisBaru();
      } },
    { baris: 1250, jalan: function (m) {
        for (m.v.C = 3; m.v.C <= 20; m.v.C++) {
          m.locate(m.v.C, 15); m.cetak(m.ulang(4, 178)); m.barisBaru();
        }
      } },
    { baris: 1260, jalan: function (m) {
        m.locate(21, 5); m.cetak(m.ulang(40, 178)); m.barisBaru();
      } },
    { baris: 1270, jalan: function (m) { m.untuk('C', 22, 23, 1, 1280); } },
    { baris: 1280, bagian: [
        function (m) {
          m.locate(m.v.C, 5);
          m.cetak(m.ulang(4, 178)); m.spc(15); m.cetak(m.ulang(4, 178));
          m.barisBaru();
          m.lanjutkan('C');
        },
        function (m) { m.warna(3, 0); m.kembali(); }
      ] },

    { baris: 1290, jalan: function () { /* DATA kata 1-34 */ } },
    { baris: 1300, jalan: function () { /* DATA kata 35-67 */ } },
    { baris: 1310, jalan: function () { /* DATA kata 68-101 */ } },

    /* 1320-1540 layar judul dan petunjuk. */
    { baris: 1320, jalan: function (m) { m.cls(); m.warna(15, 0); } },
    { baris: 1330, jalan: function (m) {
        m.locate(1, 1);
        m.cetak(m.chr(201) + m.ulang(78, 205) + m.chr(187)); m.barisBaru();
      } },
    { baris: 1340, jalan: function (m) { m.untuk('A', 2, 22, 1, 1370); } },
    { baris: 1350, jalan: function (m) {
        m.locate(m.v.A, 1);  m.cetak(m.chr(186));
        m.locate(m.v.A, 80); m.cetak(m.chr(186));
      } },
    { baris: 1360, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 1370, jalan: function (m) {
        m.locate(23, 1);
        m.cetak(m.chr(200) + m.ulang(78, 205) + m.chr(188));
      } },
    { baris: 1380, jalan: function (m) {
        m.locate(2, 34); m.cetak('H A N G M A N'); m.barisBaru();
      } },
    { baris: 1390, jalan: function (m) {
        m.locate(9, 24);
        m.cetak('Would You Like Instructions? <Y/N>  '); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1400, bagian: [
        function (m) { m.gosub(1550); },
        function (m) {
          var w = m.v.W;
          if (w === 'N' || w === 'n') m.kembali();
          else if (w !== 'Y' && w !== 'y') m.lompat(1400);
        }
      ] },

    ajar(1410,  4, 17, 'In this game of HANGMAN I will select a secret'),
    ajar(1420,  5, 17, 'word. It is your problem to guess this word in'),
    ajar(1430,  6, 17, 'TEN tries or less. You do this by guessing one'),
    ajar(1440,  7, 17, 'letter at a time. If the letter that you guess'),
    ajar(1450,  8, 17, 'is in the word,  I will put it in the position'),
    ajar(1460,  9, 17, 'that it belongs,  and allow you to guess  what'),
    ajar(1470, 10, 17, 'the secret word is. If the letter you guess is'),
    ajar(1480, 11, 17, 'not part of the secret  word,  another part of'),
    ajar(1490, 12, 17, 'the man will be added. You will have ten wrong'),
    ajar(1500, 13, 17, 'guesses  before  your man is hung.  If you are'),
    ajar(1510, 14, 17, 'able to guess the secret word, the man gets to'),
    ajar(1520, 15, 17, 'go free! Its up to you.'),
    ajar(1530, 18, 29, 'GOOD LUCK AND HAVE FUN'),
    { baris: 1540, jalan: function (m) {
        m.warna(15, 0); m.locate(25, 27);
        m.cetak('Strike Any Key To Continue');
        m.warna(3, 0);
      } },

    /* 1550-1590 baca satu huruf, ubah huruf kecil jadi besar.
       Perhatikan 1550: `IF W<>"" THEN 1550` — mengeringkan penyangga dulu. */
    { baris: 1550, jalan: function (m) {
        m.v.W = m.inkey();
        if (m.v.W !== '') m.lompat(1550);
      } },
    { baris: 1560, jalan: function (m) {
        m.v.W = m.inkey();
        if (m.v.W === '') m.lompat(1560);
      } },
    { baris: 1570, jalan: function (m) {
        if (m.v.W < 'a' || m.v.W > 'z') m.lompat(1590);
      } },
    { baris: 1580, jalan: function (m) {
        m.v.W = String.fromCharCode(m.v.W.charCodeAt(0) - 32);
      } },
    { baris: 1590, jalan: function (m) { m.kembali(); } },

    /* 1600-1660 penangan F10. */
    { baris: 1600, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XLIN = m.barisKursor(); m.v.YPOS = m.pos();
      } },
    { baris: 1610, jalan: function (m) { m.locate(25, 1); m.spc(79); } },
    { baris: 1620, jalan: function (m) {
        m.locate(25, 23); m.warna(15, 0);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 1630, bagian: [
        function (m) { m.gosub(1550); },
        function (m) { if (m.v.W !== 'N') m.lompat(1670); }
      ] },
    { baris: 1640, jalan: function (m) {
        m.v.W = '';
        if (m.inkey() !== '') m.lompat(1640);
      } },
    { baris: 1650, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 25); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(3, 0);
      } },
    { baris: 1660, jalan: function (m) {
        m.locate(m.v.XLIN, m.v.YPOS); m.jebakan(10, true); m.kembali();
      } },
    { baris: 1670, jalan: function (m) { if (m.v.W !== 'Y') m.lompat(1620); } },
    { baris: 1680, jalan: function (m) { m.jalankan('MENU'); } },

    /* 1690-1970 orang-orangan yang dibebaskan, lalu melambai.
       Gelung 1810-1970 mencetak string berisi karakter kendali kursor —
       lihat catatan di kepala berkas. */
    { baris: 1690, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1980); }
      ] },
    panggil(1700, 980), panggil(1710, 970), panggil(1720, 1090),
    panggil(1730, 1080), panggil(1740, 1040), panggil(1750, 1000),
    panggil(1760, 960), panggil(1770, 950), panggil(1780, 880),
    panggil(1790, 810),
    { baris: 1800, jalan: function (m) {
        m.warna(15, 0); m.locate(6, 35, 0);
        m.cetak(m.chr(179) + ' \\=/ ' + m.chr(179)); m.barisBaru();
        m.warna(6, 0);
      } },
    { baris: 1810, jalan: function (m) { m.untuk('A', 1, 12, 1, 1970); } },
    lambai(1820, 9, 45, 'X$', 0),  lambai(1830, 9, 32, 'X1$', 0),
    lambai(1840, 9, 45, 'X$', 1),  lambai(1850, 9, 32, 'X1$', 1),
    lambai(1860, 9, 45, 'Y$', 1),  lambai(1870, 9, 32, 'Y1$', 1),
    lambai(1880, 9, 45, 'X$', 2),  lambai(1890, 9, 32, 'X1$', 2),
    lambai(1900, 9, 45, 'Y$', 2),  lambai(1910, 9, 32, 'Y1$', 2),
    lambai(1920, 9, 45, 'X$', 1),  lambai(1930, 9, 32, 'X1$', 1),
    lambai(1940, 9, 45, 'Y$', 1),  lambai(1950, 9, 32, 'Y1$', 1),
    { baris: 1960, bagian: [
        function (m) { m.gosub(1000); },
        function (m) { m.gosub(1040); },
        function (m) { m.gosub(1080); },
        function (m) { m.gosub(1090); }
      ] },
    { baris: 1970, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.locate(null, null, 1); m.kembali(); }
      ] },

    /* 1980-2120 bangun string animasi. CHR$(29) mundur satu kolom,
       CHR$(30) naik satu baris, CHR$(31) turun satu baris. */
    { baris: 1980, jalan: function (m) { m.v['X$'][1] = m.ulang(12, 176); } },
    { baris: 1990, jalan: function (m) { m.v['Y$'][1] = ulangSpasi(12); } },
    { baris: 2000, jalan: function (m) {
        m.v['X1$'][1] = m.ulang(12, 29) +
          m.chr(176) + m.chr(176) + m.chr(219) + m.chr(177) + m.ulang(8, 176);
      } },
    { baris: 2010, jalan: function (m) {
        m.v['Y1$'][1] = m.ulang(12, 29) + ulangSpasi(12);
      } },
    { baris: 2020, jalan: function (m) { m.v.W = m.chr(30) + m.chr(29); } },
    { baris: 2030, jalan: function (m) {
        var W = m.v.W, b = m.chr(176);
        m.v['X$'][2] = b + W + b + b + W + b + b + W + b + b + W +
          m.chr(29) + b + b + b;
      } },
    { baris: 2040, jalan: function (m) {
        var W = m.v.W;
        m.v['Y$'][2] = ' ' + W + '  ' + W + '  ' + W + '  ' + W +
          m.chr(29) + '   ';
      } },
    { baris: 2050, jalan: function (m) { m.v.W = m.chr(30) + m.ulang(3, 29); } },
    { baris: 2060, jalan: function (m) {
        var W = m.v.W, b = m.chr(176);
        m.v['X1$'][2] = m.chr(29) + b + W + ' ' + b + b + W + b + b + W +
          b + b + W + b + b + b;
      } },
    { baris: 2070, jalan: function (m) {
        var W = m.v.W;
        m.v['Y1$'][2] = m.chr(29) + ' ' + W + '   ' + W + '  ' + W + '  ' + W +
          m.chr(29) + '    ';
      } },
    { baris: 2080, jalan: function (m) { m.v.W = m.chr(31) + m.chr(29); } },
    { baris: 2090, jalan: function (m) {
        var W = m.v.W;
        m.v['X$'][0] = W + '  ' + W + '  ' + W + '  ' + W + m.chr(29) + '   ';
      } },
    { baris: 2100, jalan: function (m) {
        m.v.W = m.chr(31) + m.ulang(4, 29) + '    ';
      } },
    { baris: 2110, jalan: function (m) {
        var W = m.v.W;
        m.v['X1$'][0] = m.chr(28) + W + W + W + m.chr(29) + W;
      } },
    { baris: 2120, jalan: function (m) { m.kembali(); } },

    /* 2130-2240 penyunting tebakan kata, dengan Backspace yang bekerja.
       CHR$(29)+" "+CHR$(29) di baris 2240 adalah cara menghapus satu
       karakter: mundur, timpa spasi, mundur lagi. */
    { baris: 2130, jalan: function (m) { m.v.WH = ''; } },
    { baris: 2140, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(2130);
      } },
    { baris: 2150, jalan: function (m) {
        m.v.WI = m.inkey();
        if (m.v.WI === '') m.lompat(2150);
      } },
    { baris: 2160, jalan: function (m) {
        if (m.v.WI === m.chr(13)) {
          var n = m.v.WORD_[m.v.B].length;
          m.v.WA = (m.v.WH + ulangSpasi(n)).slice(0, n);   /* LSET */
          m.kembali();
        }
      } },
    { baris: 2170, jalan: function (m) { if (m.v.WI === m.chr(8)) m.lompat(2230); } },
    { baris: 2180, jalan: function (m) {
        if (m.v.WI.length > 1) {
          if (m.v.WI.charAt(m.v.WI.length - 1) === m.chr(75)) m.lompat(2230);
          else m.lompat(2150);
        }
      } },
    { baris: 2190, jalan: function (m) {
        if (m.v.WH.length > m.v.WORD_[m.v.B].length) m.lompat(2150);
      } },
    { baris: 2200, jalan: function (m) {
        if (m.v.WI < 'a' || m.v.WI > 'z') m.lompat(2220);
      } },
    { baris: 2210, jalan: function (m) {
        m.v.WI = String.fromCharCode(m.v.WI.charCodeAt(0) - 32);
      } },
    { baris: 2220, jalan: function (m) {
        m.v.WH = m.v.WH + m.v.WI;
        m.cetak(m.v.WI);
        m.lompat(2150);
      } },
    { baris: 2230, jalan: function (m) { if (m.v.WH.length < 1) m.lompat(2150); } },
    { baris: 2240, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.WH = m.v.WH.slice(0, m.v.WH.length - 1);
        m.lompat(2150);
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }
  function ulangSpasi(n) { var s = '', i; for (i = 0; i < n; i++) s += ' '; return s; }

  /* MID$(A$,n,1) = B$ — mengganti satu karakter di tempatnya. */
  function gantiMid(s, n, ch) {
    return s.slice(0, n - 1) + ch + s.slice(n);
  }

  function bagian(nomor, tujuan) {
    return { baris: nomor, jalan: function (m) { m.gosub(tujuan); } };
  }
  function panggil(nomor, tujuan) {
    return { baris: nomor, jalan: function (m) { m.gosub(tujuan); } };
  }
  function lagu(nomor, makro) {
    return { baris: nomor, jalan: function (m) { m.mainkan(makro); } };
  }
  function kaki(nomor, kolom) {
    return { baris: nomor, jalan: function (m) {
      m.warna(5, 0);
      for (m.v.C = 16; m.v.C <= 19; m.v.C++) {
        m.locate(m.v.C, kolom); m.cetak(m.ulang(2, 219)); m.barisBaru();
      }
      m.kembali();
    } };
  }
  function telapak(nomor, kolom) {
    return { baris: nomor, jalan: function (m) {
      m.warna(4, 0); m.locate(20, kolom); m.cetak(m.ulang(4, 176));
      m.barisBaru(); m.warna(3, 0); m.kembali();
    } };
  }
  function tangan(nomor, baris, kolom) {
    return { baris: nomor, jalan: function (m) {
      m.warna(7, 0); m.locate(baris, kolom); m.cetak(m.ulang(3, 176));
      m.barisBaru(); m.warna(3, 0); m.kembali();
    } };
  }
  function ajar(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function lambai(nomor, baris, kolom, larik, indeks) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak(m.v[larik][indeks] || '');
      m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['HANGMAN'] = {
    nama: 'HANGMAN',
    judul: 'Hangman',
    sumber: 'HANGMAN',
    berkas: 'run/HANGMAN.BAS',
    tabel: tabel,
    data: KATA,

    arsitektur: {
      judul: 'Alur HANGMAN.BAS',
      simpul: [
        { id: 'siap', baris: '10-200', jenis: 'mulai',
          teks: ['Baca 101 kata dari DATA,', 'tawarkan petunjuk'] },
        { id: 'pilih', baris: '210-280',
          teks: ['Undi kata baru,', 'tolak yang sudah pernah dipakai'] },
        { id: 'tampil', baris: '290-370',
          teks: ['Tampilkan huruf yang ketemu', 'dan "-" untuk yang belum'] },
        { id: 'huruf', baris: '380-390', jenis: 'putusan',
          teks: ['Huruf sah? sudah pernah dipakai?'] },
        { id: 'cari', baris: '400-430', jenis: 'putusan',
          teks: ['Hurufnya ada di kata itu?'] },
        { id: 'salah', baris: '640-790', jenis: 'subrutin',
          teks: ['Tangga gambar:', 'tambah satu bagian orang'] },
        { id: 'habis', baris: '440', jenis: 'putusan',
          teks: ['Sudah sepuluh kali salah?'] },
        { id: 'tebakKata', baris: '450-500', jenis: 'subrutin',
          teks: ['Tebak kata utuhnya,', 'dengan Backspace yang bekerja'] },
        { id: 'menang', baris: '520-550', jenis: 'keluar',
          teks: ['Lagu, orangnya dibebaskan', 'dan melambai'] },
        { id: 'kalah', baris: '1100-1210', jenis: 'galat',
          teks: ['Tali dipasang, "Taps",', 'lalu tawaran main lagi'] }
      ],
      panah: [
        { dari: 'siap',    ke: 'pilih' },
        { dari: 'pilih',   ke: 'tampil' },
        { dari: 'tampil',  ke: 'huruf' },
        { dari: 'huruf',   ke: 'tampil', label: 'tidak sah / sudah dipakai' },
        { dari: 'huruf',   ke: 'cari',   label: 'sah' },
        { dari: 'cari',    ke: 'tebakKata', label: 'ada' },
        { dari: 'cari',    ke: 'salah',  label: 'tidak ada' },
        { dari: 'salah',   ke: 'habis',  label: 'RETURN' },
        { dari: 'habis',   ke: 'tampil', label: 'belum' },
        { dari: 'habis',   ke: 'kalah',  label: 'ya', jenis: 'galat' },
        { dari: 'tebakKata', ke: 'menang', label: 'benar' },
        { dari: 'tebakKata', ke: 'tampil', label: 'salah' },
        { dari: 'menang',  ke: 'pilih',  label: 'main lagi' },
        { dari: 'kalah',   ke: 'pilih',  label: 'main lagi', jenis: 'galat' }
      ]
    },

    pseudokode: [
      { baris: 170, tingkat: 0, teks: 'baca 101 kata dari DATA ke dalam larik' },
      { baris: 230, tingkat: 0, teks: '<b>ULANG tiap permainan:</b>' },
      { baris: 260, tingkat: 1, teks: 'undi nomor kata; kalau sudah pernah dipakai, undi lagi' },
      { baris: 280, tingkat: 1, teks: 'siapkan tampilan sepanjang katanya, semuanya kosong' },
      { baris: 290, tingkat: 1, teks: 'tampilkan huruf yang ketemu, "&minus;" untuk yang belum' },
      { baris: 370, tingkat: 1, teks: 'minta satu huruf' },
      { baris: 380, tingkat: 1, teks: 'bukan A&ndash;Z? tolak' },
      { baris: 390, tingkat: 1, teks: 'sudah pernah dipakai? tolak' },
      { baris: 420, tingkat: 1, teks: 'cari huruf itu di seluruh kata:' },
      { baris: 420, tingkat: 2, teks: 'ketemu &rarr; cetak di posisinya, <b>ganti satu karakter di tampilan</b>' },
      { baris: 420, tingkat: 2, teks: 'tampilan sudah sama dengan kata aslinya? <b>menang</b>' },
      { baris: 440, tingkat: 1, teks: 'tidak ketemu satu pun? tambah satu bagian orang-orangan' },
      { baris: 650, tingkat: 2, teks: '<b>pilih pintu masuk tangga</b> menurut jumlah salah' },
      { baris: 660, tingkat: 2, teks: 'sisanya jatuh ke bawah: makin tinggi masuknya, makin banyak digambar' },
      { baris: 440, tingkat: 1, teks: 'sudah sepuluh kali salah? kalah' },
      { baris: 460, tingkat: 1, teks: 'huruf ketemu &rarr; tawarkan menebak kata utuhnya' },
      { baris: 520, tingkat: 0, teks: '<b>MENANG:</b> lagu, orangnya dibebaskan dan melambai' },
      { baris: 1100, tingkat: 0, teks: '<b>KALAH:</b> tali dipasang, "Taps" dimainkan' }
    ],

    perintahAsli: 'run\\HANGMAN.bat',
    catatanAsli: 'Di DOSBox-X, "Hail To The Chief" berbunyi saat menang dan ' +
      '"Taps" saat kalah — dan orang-orangannya benar-benar melambai, karena ' +
      'animasinya bersandar pada kecepatan pencetakan layar.',

    penyimpangan: [
      '<b>Kedua lagunya tidak berbunyi</b> ("Hail To The Chief" di baris ' +
      '520-540, "Taps" di 1130-1170), dan <code>SOUND</code> di baris 1190 ' +
      'juga diam. Ketiganya makro <code>PLAY</code> lengkap.',

      '<b>Animasi melambai berjalan seketika.</b> Baris 1810-1970 mencetak ' +
      'dua belas kali berturut-turut, dan di mesin aslinya kecepatan ' +
      'pencetakan layar yang menjadi pengatur temponya. Di sini tiap ' +
      'pencetakan seketika, jadi yang terlihat cuma bingkai terakhirnya. ' +
      'Turunkan laju penelusuran untuk melihat tiap bingkainya.',

      '<b>Pengacaknya bukan pengacak GW-BASIC, dan benihnya tetap</b>, jadi ' +
      'kata yang diundi selalu sama pada permainan pertama.',

      '<b>Keempat gelung tunda habis seketika</b> (baris 500, 620, 780, 1180).',

      '<b>Larik <code>WORD()</code> dan <code>A()</code> ditulis ' +
      '<code>WORD_</code> dan <code>A_</code> di dalam mesin</b>, karena BASIC ' +
      'membedakan variabel <code>WORD</code> dari larik <code>WORD()</code> ' +
      'dan program ini memakai keduanya.'
    ],

    pelajaran: {
      ringkas: 'Hangman 101 kata. Yang layak dipelajari bukan permainannya, ' +
        'melainkan dua cara menghindari sepuluh salinan kode.',
      pelajari: [
        ['Tangga jatuh-ke-bawah untuk sepuluh keadaan gambar',
         'Tiap tebakan salah menambah satu bagian orang-orangan. Cara wajar: ' +
         'sepuluh rutin gambar. Cara program ini: <b>satu tangga dengan ' +
         'sepuluh pintu masuk</b>. <code>ON CHANCE GOTO 760,750,…,680</code> ' +
         'memilih pintunya; sisanya jatuh ke bawah. Masuk dari 760 menggambar ' +
         'kepala saja; masuk dari 660 menggambar semuanya. Urutan lapisannya ' +
         'terjaga sendiri karena urutan barisnya.'],
        ['Karakter kendali kursor di dalam string',
         'Baris 1980-2120 membangun string yang berisi <code>CHR$(29)</code> ' +
         '(kursor kiri), <code>CHR$(30)</code> (atas), dan <code>CHR$(31)</code> ' +
         '(bawah). Satu <code>PRINT</code> menggambar bentuk <b>dua dimensi</b>. ' +
         'Itu prinsip yang sama dengan urutan escape terminal — ' +
         '<code>\\033[2J</code> dan kawan-kawannya — yang masih dipakai tiap ' +
         'kali sebuah program menggambar bilah kemajuan.'],
        ['<code>MID$</code> di sisi kiri penugasan',
         '<code>MID$(WORD,G,1)=MID$(WORD(B),G,1)</code> mengganti satu ' +
         'karakter <b>di tempatnya</b>. Tanpa itu, memperbarui tampilan berarti ' +
         'membongkar dan merangkai ulang seluruh string tiap kali. BASIC punya ' +
         'ini pada 1983; banyak bahasa modern justru tidak, karena stringnya ' +
         'tidak boleh diubah.'],
        ['Menghapus satu karakter dengan tiga karakter',
         'Baris 2240: <code>PRINT CHR$(29)" "CHR$(29)</code> — mundur, timpa ' +
         'dengan spasi, mundur lagi. Itulah Backspace, ditulis tangan. ' +
         'Terminal modern melakukan hal yang persis sama.']
      ],
      hindari: [
        ['<code>RANDOMIZE</code> di dalam gelung, sekali lagi',
         'Baris 250 menyemai ulang sebelum tiap undian kata, dari detik jam ' +
         'yang sama. Kesalahan yang sama dengan MASTER.BAS, dan BOGGY.BAS di ' +
         'koleksi yang sama melakukannya dengan benar.'],
        ['Gelung tunda sebagai pengatur tempo animasi',
         'Animasi melambai di baris 1810-1970 bersandar pada kecepatan ' +
         'pencetakan layar. Di mesin yang lebih cepat, ia lewat begitu saja. ' +
         'Tempo yang bersandar pada kecepatan perangkat keras adalah tempo ' +
         'yang akan rusak.'],
        ['Nilai batas yang ditulis dua kali',
         'Sepuluh kesempatan salah tertulis sebagai <code>CHANCE=10</code> di ' +
         'baris 440 dan 770, dan sebagai sembilan tujuan di baris 650. Ubah ' +
         'jumlahnya, dan tiga tempat harus disunting bersama.']
      ]
    },

    penjelasan: [
      { judul: 'Sepuluh gambar dari satu tangga',
        isi: [
          'Orang-orangan hangman punya sepuluh keadaan: tiang saja, tiang + ' +
          'kepala, tiang + kepala + badan, dan seterusnya. Bagaimana ' +
          'menggambarnya tanpa menulis sepuluh rutin?',
          '<code>650 ON CHANCE GOTO 760,750,740,730,720,710,700,690,680</code>',
          'Baris 650 memilih <b>pintu masuk</b>. Baris 660 sampai 760 adalah ' +
          'tangga <code>GOSUB</code> yang jatuh ke bawah tanpa satu pun ' +
          '<code>GOTO</code> di antaranya:',
          '<code>660 GOSUB 1230</code> tiang &middot; <code>670</code> kaki ' +
          'kiri &middot; <code>680</code> kaki kanan &middot; … &middot; ' +
          '<code>760 GOSUB 810</code> kepala',
          'Tebakan salah pertama masuk dari 760: <b>kepala saja</b>. Yang ' +
          'kedua masuk dari 750: badan, lalu jatuh ke 760 dan menggambar ' +
          'kepala juga. Yang kesepuluh tidak cocok dengan satu pun tujuan, ' +
          'jadi jatuh dari 660: <b>semuanya</b>.',
          'Yang didapat: sepuluh keadaan, satu tangga, dan <b>urutan lapisan ' +
          'yang terjaga sendiri</b> — bagian yang digambar belakangan selalu ' +
          'di atas, karena urutan barisnya yang mengaturnya.'
        ] },
      { judul: 'Satu PRINT yang menggambar dua dimensi',
        isi: [
          'Baris 2030 membangun string seperti ini:',
          '<code>X$(2)=CHR$(176)+W+CHR$(176)+CHR$(176)+W+…</code> ' +
          'dengan <code>W=CHR$(30)+CHR$(29)</code>',
          '<code>CHR$(30)</code> memindahkan kursor <b>naik</b> satu baris; ' +
          '<code>CHR$(29)</code> memindahkannya <b>mundur</b> satu kolom. ' +
          'Keduanya tidak menggambar apa pun — ia perintah, bukan gambar.',
          'Jadi satu <code>PRINT</code> bisa: cetak sebuah blok, naik, mundur, ' +
          'cetak lagi, naik, mundur, cetak lagi. Hasilnya bentuk <b>dua ' +
          'dimensi</b> dari satu perintah tunggal — lengan yang melambai, ' +
          'digambar sekali kirim.',
          'Kenapa repot? Karena mengirim satu string panjang ke layar jauh ' +
          'lebih cepat daripada belasan <code>LOCATE</code> dan ' +
          '<code>PRINT</code> terpisah. Di komputer 4,77 MHz, itu bedanya ' +
          'animasi yang mulus dan animasi yang tersendat.',
          'Prinsipnya masih hidup: tiap kali sebuah program menggambar bilah ' +
          'kemajuan di terminal Anda, ia mengirim urutan escape yang ' +
          'mengerjakan hal yang sama.'
        ] },
      { judul: 'Kenapa MID$ di sisi kiri itu istimewa',
        isi: [
          '<code>420 … MID$(WORD,G,1)=MID$(WORD(B),G,1)</code>',
          'Di sisi <b>kanan</b>, <code>MID$</code> mengambil potongan string. ' +
          'Di sisi <b>kiri</b>, ia <b>mengganti</b> potongan itu di tempatnya, ' +
          'tanpa membuat string baru.',
          'Tanpa itu, memperbarui tampilan berarti: ambil bagian sebelum, ' +
          'ambil bagian sesudah, sambung dengan huruf baru di tengah — tiga ' +
          'operasi dan satu string baru, tiap kali.',
          'Menariknya, banyak bahasa modern justru <b>tidak punya</b> ini: ' +
          'string di JavaScript, Java, Python, dan C# tidak bisa diubah isinya. ' +
          'Yang tersedia hanya membuat string baru — persis cara yang dihindari ' +
          'BASIC di sini.',
          'Alasannya bukan kemunduran: string yang tidak bisa diubah lebih aman ' +
          'dipakai bersama-sama dan lebih mudah dinalar. Tapi di komputer ' +
          'dengan 64 KB memori, membuat string baru untuk tiap huruf yang ' +
          'ditebak adalah kemewahan yang tidak ada.'
        ] }
    ]
  };
})(window);
