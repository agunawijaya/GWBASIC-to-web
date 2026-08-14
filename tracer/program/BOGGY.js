/* ===========================================================================
   BOGGY.js — porting minimalis BOGGY.BAS sebagai tabel baris.

   Program kedelapan. Petak 10x10, tiga monster tersembunyi, sepuluh tebakan —
   dan setiap tebakan dijawab dengan ARAH, bukan "panas/dingin". Nenek moyang
   permainan tebak-koordinat.

   Dua hal yang layak diperhatikan:

   1. BARIS 370 MEMERIKSA TABRAKAN, LALU MENGULANG SELURUHNYA. Kalau dua
      monster mendarat di petak yang sama, program tidak menggeser salah
      satunya — ia melempar ketiganya dan mengundi ulang dari awal. Kasar,
      tapi benar, dan tiga baris lebih pendek daripada memperbaiki satu.
      Bandingkan MASTER.BAS yang tidak memeriksa apa pun.

   2. `LOCATE I,J,O` — argumen ketiganya huruf O, bukan angka nol. Di BASIC
      itu variabel numerik yang belum pernah diisi, jadi nilainya 0 — yang
      kebetulan berarti "sembunyikan kursor", persis yang dimaksud penulisnya.
      Salah ketik yang jalan. Ada di baris 270, 400, 480, dan 600.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Kelima baris `PLAY` di 800-840 (lagu kalah, "Taps") dan 1060-1090 (lagu
     menang, "Rule Britannia") tidak berbunyi. Keduanya makro musik lengkap,
     bukan REM kosong seperti di MASTER.BAS — jadi yang hilang di sini nyata.
   - Pengacaknya bukan pengacak GW-BASIC, dan benihnya tetap, supaya tiap
     penelusuran bisa diulang persis.
   - `COLOR 20,0` berarti merah BERKEDIP (4 + 16); kedipnya tidak ditiru.
   =========================================================================== */

(function (global) {
  'use strict';

  var DETIK_TETAP = 17;

  var tabel = [

    { baris: 10, jalan: function (m) { m.warna(3, 0); m.cls(); } },
    { baris: 110, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 950);
          m.jebakan(m.v.A, true);
        }
      } },
    { baris: 120, jalan: function (m) { m.pasangJebakan(10, 960); } },

    /* 130-150 bingkai balok. */
    { baris: 130, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 140, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 150, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 160, jalan: function (m) {
        m.locate(4, 30); m.warna(15, 0);
        m.cetak('B O G G Y   M A R S H'); m.barisBaru();
      } },
    { baris: 170, jalan: function (m) {
        m.locate(8, 23);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 180, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(180);
      } },
    { baris: 190, jalan: function (m) {
        var a = m.v['A$'];
        if (a === 'N' || a === 'n') m.lompat(290);
      } },
    { baris: 200, jalan: function (m) {
        var a = m.v['A$'];
        if (a !== 'Y' && a !== 'y') m.lompat(180);
      } },

    teks(210,  8, 15, 'Welcome to  Boggy  Marsh.  In this simple adventure you'),
    teks(220,  9, 15, 'will be trying to locate the  monsters of  Boggy  Marsh.'),
    teks(230, 10, 15, 'For this task you will be given  10  guesses. To locate'),
    teks(240, 11, 15, 'the monster simply key in the  row and column of square'),
    teks(250, 12, 15, 'you beleive him to be in. After each guess, I will tell'),
    teks(260, 13, 15, 'you in which  direction you need to go to find each one.'),

    { baris: 270, jalan: function (m) {
        m.warna(15, 0);
        m.locate(25, 27, 0);      /* argumen ketiga di aslinya huruf O = 0 */
        m.cetak(' Strike Any Key To Continue ');
        m.warna(3, 0);
      } },
    { baris: 280, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(280);
      } },

    /* 290-300 siapkan permainan. */
    { baris: 290, jalan: function (m) {
        m.cls();
        m.dim('R', 3); m.dim('C', 3);
        m.v.NUMFOUND = 0; m.v.HIT = 0;
      } },
    { baris: 300, bagian: [
        function (m) { m.v.XX = 1; m.v.YY = 1; },
        function (m) { m.gosub(1020); }
      ] },

    /* 310-370 sembunyikan tiga monster.
       Benihnya sama-sama detik jam dinding seperti MASTER.BAS, TAPI di sini
       RANDOMIZE ada DI LUAR gelung — disemai sekali, lalu enam angka diambil
       berturut-turut. Itu yang benar. */
    { baris: 310, jalan: function (m) { m.semai(DETIK_TETAP); } },
    { baris: 320, jalan: function (m) { m.untuk('I', 1, 3, 1, 370); } },
    { baris: 330, jalan: function (m) { m.v.R[m.v.I] = Math.floor(m.acak() * 10); } },
    { baris: 340, jalan: function (m) { m.v.J = m.v.I + 3; } },
    { baris: 350, jalan: function (m) { m.v.C[m.v.I] = Math.floor(m.acak() * 10); } },
    { baris: 360, jalan: function (m) { m.lanjutkan('I'); } },

    /* 370 kalau ada dua monster di petak yang sama, UNDI ULANG SEMUANYA.
       Tidak menggeser salah satunya, tidak menambal — lempar dan ulang.
       Tiga baris lebih pendek daripada memperbaiki satu, dan tidak mungkin
       salah. */
    { baris: 370, jalan: function (m) {
        var R = m.v.R, C = m.v.C;
        if ((R[1] === R[2] && C[1] === C[2]) ||
            (R[2] === R[3] && C[2] === C[3]) ||
            (R[3] === R[1] && C[3] === C[1])) m.lompat(310);
      } },
    /* 380 baris cetak-pengintip yang dimatikan jadi komentar. Jejak orang
       yang pernah harus melihat isi lariknya untuk mencari cacat — dan
       membiarkannya di sana, mati, kalau-kalau perlu lagi. */
    { baris: 380, jalan: function () { /* 'PRINT R(1) C(1) R(2) C(2) R(3) C(3) */ } },

    /* 390-410 gambar petak 10x10.
       Dua FOR di baris 390, dua NEXT di baris 410. NEXT yang pertama menutup
       gelung J dan kembali ke baris 400; yang kedua menutup gelung I dan
       kembali ke `FOR J` di TENGAH baris 390. Itulah kenapa kedua baris ini
       ditulis berbagian. */
    { baris: 390, bagian: [
        function (m) { m.untuk('I', 3, 21, 2, 420); },
        function (m) { m.untuk('J', 33, 80, 5, 410); }
      ] },
    { baris: 400, jalan: function (m) {
        m.locate(m.v.I, m.v.J, 0);
        m.cetak(m.ulang(3, 219)); m.barisBaru();
      } },
    { baris: 410, bagian: [
        function (m) { m.lanjutkan(); },   /* tutup J */
        function (m) { m.lanjutkan(); }    /* tutup I */
      ] },

    { baris: 420, jalan: function (m) {
        m.locate(1, 33);
        m.cetak(' 0    1    2    3    4    5    6    7    8    9'); m.barisBaru();
      } },
    { baris: 430, jalan: function (m) {
        m.warna(15, 0);
        m.locate(1, 28); m.cetak('Col' + m.chr(26)); m.barisBaru();
        m.locate(2, 24); m.cetak('Row'); m.barisBaru();
        m.locate(3, 25); m.cetak(m.chr(25)); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 440, jalan: function (m) {
        m.v.J = -1;
        for (m.v.I = 3; m.v.I <= 21; m.v.I += 2) {
          m.v.J++;
          m.locate(m.v.I, 28, 0);
          m.cetak(angka(m.v.J)); m.barisBaru();
        }
      } },
    { baris: 450, jalan: function (m) {
        m.warna(15, 0);
        m.locate(6, 2, 0);
        m.cetak('Your Guess Please'); m.barisBaru();
        m.cetak(' -----------------'); m.barisBaru();
        m.cetak(' Row      Col    '); m.barisBaru();
        m.warna(3, 0);
      } },

    /* --- 460-780: gelung sepuluh tebakan ---------------------------------- */

    { baris: 460, jalan: function (m) { m.untuk('GUESS', 1, 10, 1, 790); } },
    { baris: 470, jalan: function (m) {
        m.locate(3, 2, 0);
        m.cetak('Guesses Used' + angka(m.v.GUESS - 1)); m.barisBaru();
      } },
    { baris: 480, jalan: function (m) {
        m.locate(8, 6, 0);  m.cetak(' '); m.barisBaru();
        m.locate(8, 15, 0); m.cetak(' '); m.barisBaru();
      } },
    { baris: 490, jalan: function (m) { m.locate(8, 6, 1); } },
    { baris: 500, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(500);
      } },
    { baris: 510, jalan: function (m) {
        m.v['A$'] = m.inkey();
        var a = m.v['A$'];
        if (a === '' || a < '0' || a > '9') m.lompat(510);
      } },
    { baris: 520, jalan: function (m) { m.v.ROW = parseInt(m.v['A$'], 10); } },
    { baris: 530, jalan: function (m) {
        m.locate(8, 5, 0); m.cetak(angka(m.v.ROW)); m.barisBaru();
      } },
    { baris: 540, jalan: function (m) { m.locate(8, 15, 1); } },
    { baris: 550, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(550);
      } },
    { baris: 560, jalan: function (m) {
        m.v['A$'] = m.inkey();
        var a = m.v['A$'];
        if (a === '' || a < '0' || a > '9') m.lompat(560);
      } },
    { baris: 570, jalan: function (m) { m.v.COL = parseInt(m.v['A$'], 10); } },
    { baris: 580, jalan: function (m) {
        m.locate(8, 14, 0); m.cetak(angka(m.v.COL)); m.barisBaru();
      } },

    /* PR adalah baris layar tempat jawaban berikutnya ditulis. Ia dinaikkan
       satu tiap monster, jadi ketiga jawabannya tersusun ke bawah. */
    { baris: 590, jalan: function (m) { m.v.PR = 10; } },
    { baris: 600, jalan: function (m) {
        m.locate(11, 1, 0);
        m.spc(24); m.barisBaru();
        m.spc(24); m.barisBaru();
        m.spc(24); m.barisBaru();
      } },

    { baris: 610, jalan: function (m) { m.untuk('I', 1, 3, 1, 760); } },
    { baris: 620, jalan: function (m) { m.locate(m.v.PR + 1, 1, 0); } },
    /* 630 monster yang sudah mati ditandai R(I)=99 — nilai di luar jangkauan
       dipakai sebagai penanda, karena tidak ada tipe "kosong". */
    { baris: 630, jalan: function (m) {
        if (m.v.R[m.v.I] === 99) {
          m.cetak("You've Killed Number" + angka(m.v.I)); m.barisBaru();
          m.v.PR++;
          m.lompat(750);
        }
      } },
    /* 640 tepat sasaran. Satu baris, sebelas pernyataan, satu GOSUB di
       tengahnya — jadi berbagian. */
    { baris: 640, bagian: [
        function (m) {
          if (!(m.v.ROW === m.v.R[m.v.I] && m.v.COL === m.v.C[m.v.I])) {
            m.lompat(650); return;
          }
          m.cetak('You Just Killed Number' + angka(m.v.I)); m.barisBaru();
          m.gosub(920);
        },
        function (m) {
          m.locate(m.v.ERSROW, m.v.ERSCOL, 0);
          m.warna(20, 0);
          m.cetak(m.chr(26) + m.chr(2) + m.chr(27));
          m.barisBaru();
          m.warna(3, 0);
          m.v.NUMFOUND++;
          m.v.R[m.v.I] = 99;
          m.v.PR++;
          m.v.HIT = 1;
          m.lompat(750);
        }
      ] },
    { baris: 650, jalan: function (m) { m.cetak('GO '); } },

    /* 660-730 delapan arah, satu baris per arah. Bandingkan TICTAC.BAS yang
       menyimpan kedelapan arah sebagai delapan angka di satu DATA. Di sini
       arahnya tertulis sebagai delapan perbandingan terpisah — lebih mudah
       dibaca sekilas, lebih sulit diubah. */
    arah(660, 'East',      function (m,R,C) { return m.v.ROW === R && m.v.COL <  C; }),
    arah(670, 'West',      function (m,R,C) { return m.v.ROW === R && m.v.COL >  C; }),
    arah(680, 'South',     function (m,R,C) { return m.v.COL === C && m.v.ROW <  R; }),
    arah(690, 'North',     function (m,R,C) { return m.v.COL === C && m.v.ROW >  R; }),
    arah(700, 'Southeast', function (m,R,C) { return m.v.ROW <  R && m.v.COL <  C; }),
    arah(710, 'Southwest', function (m,R,C) { return m.v.ROW <  R && m.v.COL >  C; }),
    arah(720, 'Northeast', function (m,R,C) { return m.v.ROW >  R && m.v.COL <  C; }),
    arah(730, 'Northwest', function (m,R,C) { return m.v.ROW >  R && m.v.COL >  C; }),

    { baris: 740, jalan: function (m) { m.v.PR++; } },
    { baris: 750, jalan: function (m) { m.lanjutkan('I'); } },

    /* 760 kalau tebakannya meleset, hapus juga petaknya — supaya pemain
       melihat ke mana saja ia sudah menembak. */
    { baris: 760, jalan: function (m) {
        if (m.v.HIT === 0) m.gosub(920); else m.v.HIT = 0;
      } },
    { baris: 770, bagian: [
        function (m) { if (m.v.NUMFOUND === 3) m.gosub(1050); else m.lompat(780); },
        function (m) {
          m.cls();
          m.locate(5, 27, 0);
          m.cetak('Congratulations, You Win'); m.barisBaru();
          m.tab(30);
          m.cetak('In Only' + angka(m.v.GUESS) + 'Guesses'); m.barisBaru();
          m.lompat(860);
        }
      ] },
    { baris: 780, jalan: function (m) { m.lanjutkan('GUESS'); } },

    /* 790-850 kalah. Lima baris PLAY yang isinya lagu "Taps" lengkap —
       bukan REM kosong seperti lagu di MASTER.BAS. Di penelusur ini keduanya
       sama-sama diam, tapi yang hilang di sini nyata. */
    { baris: 790, jalan: function () { /* REM******* TAPS */ } },
    lagu(800, 'T140MNMB'),
    lagu(810, 'O3L8C.L16C L2F.L8C.L16F'),
    lagu(820, 'L2A.L8C.L16F L4A L8C. L16F L4A L8C. L16F L2A.'),
    lagu(830, 'O3 L8F.L16A ML O4L2C MN O3L4AL4FL2C.'),
    lagu(840, 'O3L8C.L16C ML L1F MN L4F'),
    { baris: 850, jalan: function (m) {
        m.cls();
        m.locate(5, 33, 0);
        m.cetak('Sorry, You Lost'); m.barisBaru();
      } },

    { baris: 860, jalan: function (m) {
        m.locate(9, 24, 0);
        m.cetak('Would You Like To Play Again? <Y/N>'); m.barisBaru();
      } },
    { baris: 870, jalan: function (m) { if (m.inkey() !== '') m.lompat(870); } },
    { baris: 880, jalan: function (m) {
        m.v['ANS$'] = m.inkey();
        if (m.v['ANS$'] === '') m.lompat(880);
      } },
    { baris: 890, jalan: function (m) {
        var a = m.v['ANS$'];
        if (a === 'Y' || a === 'y') {
          delete m.v.R; delete m.v.C;        /* ERASE R,C */
          m.lompat(290);
        }
      } },
    { baris: 900, jalan: function (m) {
        var a = m.v['ANS$'];
        if (a !== 'N' && a !== 'n') m.lompat(880);
      } },
    { baris: 910, jalan: function (m) { m.cls(); m.jalankan('MENU'); } },

    /* 920-950 hapus petak yang barusan ditebak. Rumusnya menerjemahkan
       koordinat permainan jadi koordinat layar: baris*2+3, kolom*5+33. */
    { baris: 920, jalan: function (m) { m.v.ERSROW = m.v.ROW * 2 + 3; } },
    { baris: 930, jalan: function (m) { m.v.ERSCOL = m.v.COL * 5 + 33; } },
    { baris: 940, jalan: function (m) {
        m.locate(m.v.ERSROW, m.v.ERSCOL, 0);
        m.cetak(m.chr(255) + m.chr(255) + m.chr(255)); m.barisBaru();
      } },
    /* 950 RETURN — penutup subrutin 920-940 SEKALIGUS badan jebakan F1-F9. */
    { baris: 950, jalan: function (m) { m.kembali(); } },

    /* 960-1040 penangan F10. Baris 1010 jatuh ke 1020, yang juga dipanggil
       sebagai subrutin dari baris 300 — satu blok, dua cara masuk. */
    { baris: 960, jalan: function (m) {
        m.v.XX = m.barisKursor(); m.v.YY = m.pos();
      } },
    { baris: 970, jalan: function (m) {
        m.jebakan(10, false);
        m.locate(25, 1); m.spc(79);
        m.warna(15, 0);
        m.locate(25, 25);
      } },
    { baris: 980, jalan: function (m) {
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 990, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(990);
      } },
    { baris: 1000, jalan: function (m) {
        var a = m.v['A$'];
        if (a === 'Y' || a === 'y') m.lompat(910);
      } },
    { baris: 1010, jalan: function (m) {
        var a = m.v['A$'];
        if (a !== 'N' && a !== 'n') m.lompat(990);
      } },
    { baris: 1020, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.warna(0, 7);
        m.locate(25, 27);
      } },
    { baris: 1030, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(3, 0);
        m.locate(m.v.XX, m.v.YY);
      } },
    { baris: 1040, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },

    /* 1050-1100 lagu menang, "Rule Britannia". */
    { baris: 1050, jalan: function () { /* REM*** HAIL BRITANIA */ } },
    lagu(1060, 'T100MNMB'),
    lagu(1070, 'MLO2L4E MN L8E MN L8E L8F L8F P8'),
    lagu(1080, 'L8EL8F.L16EL8DL8C O1L4BL4G O2L4GL8FL8DL16EL16DL16EL16F'),
    lagu(1090, 'L8EL8CL8FL32FL32EL32DL32C O1L8B. O2L16CL4C'),
    { baris: 1100, jalan: function (m) { m.kembali(); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }

  function teks(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  function arah(nomor, nama, uji) {
    return { baris: nomor, jalan: function (m) {
      if (uji(m, m.v.R[m.v.I], m.v.C[m.v.I])) {
        m.cetak(nama + ' For No' + angka(m.v.I));
        m.barisBaru();
        m.lompat(740);
      }
    } };
  }

  function lagu(nomor, makro) {
    return { baris: nomor, jalan: function (m) { m.mainkan(makro); } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BOGGY'] = {
    nama: 'BOGGY',
    judul: 'Boggy Marsh',
    sumber: 'BOGGY',
    berkas: 'run/BOGGY.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BOGGY.BAS',
      simpul: [
        { id: 'siap', baris: '10-280', jenis: 'mulai',
          teks: ['Bingkai, judul,', 'tawarkan petunjuk'] },
        { id: 'sembunyi', baris: '310-360',
          teks: ['Undi posisi tiga monster', 'di petak 10x10'] },
        { id: 'tabrak', baris: '370', jenis: 'putusan',
          teks: ['Ada dua monster', 'di petak yang sama?'] },
        { id: 'petak', baris: '390-450',
          teks: ['Gambar petak 10x10', 'dan nomor baris/kolomnya'] },
        { id: 'tebak', baris: '460-580', jenis: 'subrutin',
          teks: ['Minta baris lalu kolom,', 'satu angka masing-masing'] },
        { id: 'jawab', baris: '610-750',
          teks: ['Untuk tiap monster:', 'sebutkan arahnya'] },
        { id: 'hapus', baris: '760-920', jenis: 'subrutin',
          teks: ['Hapus petak yang ditembak', 'supaya jejaknya terlihat'] },
        { id: 'menang', baris: '770', jenis: 'putusan',
          teks: ['Ketiganya sudah mati?'] },
        { id: 'habis', baris: '780', jenis: 'putusan',
          teks: ['Masih ada tebakan?'] },
        { id: 'usai', baris: '790-910', jenis: 'keluar',
          teks: ['Lagu menang atau kalah,', 'lalu main lagi?'] }
      ],
      panah: [
        { dari: 'siap',     ke: 'sembunyi' },
        { dari: 'sembunyi', ke: 'tabrak' },
        { dari: 'tabrak',   ke: 'sembunyi', label: 'ya: undi ulang SEMUA' },
        { dari: 'tabrak',   ke: 'petak',    label: 'tidak' },
        { dari: 'petak',    ke: 'tebak' },
        { dari: 'tebak',    ke: 'jawab' },
        { dari: 'jawab',    ke: 'hapus' },
        { dari: 'hapus',    ke: 'menang' },
        { dari: 'menang',   ke: 'habis',  label: 'belum' },
        { dari: 'habis',    ke: 'tebak',  label: 'masih ada' },
        { dari: 'menang',   ke: 'usai',   label: 'ya' },
        { dari: 'habis',    ke: 'usai',   label: 'habis' },
        { dari: 'usai',     ke: 'sembunyi', label: 'main lagi' }
      ]
    },

    pseudokode: [
      { baris: 110, tingkat: 0, teks: 'pasang jebakan F1&ndash;F10, gambar bingkai dan judul' },
      { baris: 310, tingkat: 0, teks: '<b>semai pengacak SEKALI</b>, di luar gelung' },
      { baris: 320, tingkat: 0, teks: 'untuk tiap dari tiga monster: undi baris dan kolomnya (0&ndash;9)' },
      { baris: 370, tingkat: 0, teks: 'ada dua monster di petak sama? <b>buang semuanya, undi ulang</b>' },
      { baris: 390, tingkat: 0, teks: 'gambar petak 10&times;10 dan nomor baris/kolomnya' },
      { baris: 460, tingkat: 0, teks: '<b>untuk sepuluh tebakan:</b>' },
      { baris: 510, tingkat: 1, teks: 'minta satu angka untuk baris' },
      { baris: 560, tingkat: 1, teks: 'minta satu angka untuk kolom' },
      { baris: 610, tingkat: 1, teks: 'untuk tiap monster:' },
      { baris: 630, tingkat: 2, teks: 'sudah mati (ditandai 99)? bilang begitu' },
      { baris: 640, tingkat: 2, teks: 'tepat sasaran? tandai mati, gambar penanda berkedip' },
      { baris: 660, tingkat: 2, teks: 'meleset? sebutkan <b>arahnya</b> &mdash; delapan kemungkinan' },
      { baris: 760, tingkat: 1, teks: 'meleset semua? hapus juga petak yang barusan ditembak' },
      { baris: 770, tingkat: 1, teks: 'ketiganya mati? <b>menang</b>, mainkan lagu, umumkan' },
      { baris: 800, tingkat: 0, teks: 'tebakan habis: mainkan "Taps", umumkan kalah' },
      { baris: 860, tingkat: 0, teks: 'main lagi? buang larik, undi ulang &mdash; atau kembali ke menu' }
    ],

    perintahAsli: 'run\\BOGGY.bat',
    catatanAsli: 'Di DOSBox-X kedua lagunya benar-benar berbunyi: "Taps" ' +
      'kalau kalah, "Rule Britannia" kalau menang. Keduanya makro PLAY ' +
      'lengkap, bukan REM kosong &mdash; jadi yang hilang di penelusur ini nyata.',

    penyimpangan: [
      '<b>Kedua lagunya tidak berbunyi.</b> Baris 800-840 memainkan "Taps" ' +
      'saat kalah dan 1060-1090 memainkan "Rule Britannia" saat menang. ' +
      'Keduanya makro <code>PLAY</code> lengkap dengan tempo, oktaf, dan ' +
      'panjang not &mdash; bukan REM kosong seperti lagu yang tak pernah ' +
      'ditulis di MASTER.BAS. Yang hilang di sini nyata.',

      '<b>Pengacaknya bukan pengacak GW-BASIC, dan benihnya tetap,</b> supaya ' +
      'tiap penelusuran bisa diulang persis. Posisi monsternya karena itu ' +
      'selalu sama.',

      '<b><code>COLOR 20,0</code> tidak berkedip.</b> Warna 20 berarti merah + ' +
      'kedip (4 + 16). Penanda monster mati di baris 640 seharusnya berkedip ' +
      'merah; di sini merah diam.',

      '<b><code>LOCATE r,c,O</code> ditulis sebagai <code>0</code>.</b> ' +
      'Argumen ketiga di baris 270, 400, 480, dan 600 aslinya huruf <b>O</b>, ' +
      'bukan angka nol &mdash; variabel numerik yang tak pernah diisi, jadi ' +
      'bernilai 0, yang kebetulan berarti "sembunyikan kursor". Salah ketik ' +
      'yang jalan.'
    ],

    pelajaran: {
      ringkas: 'Petak 10&times;10, tiga monster tersembunyi, sepuluh tebakan. ' +
        'Tiap tebakan dijawab dengan <b>arah</b>, bukan panas/dingin &mdash; ' +
        'dan itu yang membuatnya bisa diselesaikan dengan berpikir.',
      pelajari: [
        ['Undi ulang lebih murah daripada menambal',
         'Baris 370 memeriksa apakah dua monster mendarat di petak yang sama. ' +
         'Kalau ya, ia tidak menggeser salah satunya &mdash; ia membuang ' +
         'ketiganya dan mengundi ulang dari awal. Tiga baris lebih pendek ' +
         'daripada memperbaiki satu, dan <b>tidak mungkin melahirkan tabrakan ' +
         'baru</b>. Bandingkan MASTER.BAS, yang tidak memeriksa apa pun.'],
        ['Menyemai sekali, di luar gelung',
         'Baris 310 memanggil <code>RANDOMIZE</code> <b>sebelum</b> gelung ' +
         'undian, bukan di dalamnya. MASTER.BAS melakukan kebalikannya. Dua ' +
         'program dari koleksi yang sama, dan yang satu benar.'],
        ['Nilai di luar jangkauan sebagai penanda',
         '<code>R(I)=99</code> menandai monster yang sudah mati. Baris dan ' +
         'kolom hanya 0&ndash;9, jadi 99 tidak mungkin bentrok. Cara lama ' +
         'menyatakan "kosong" ketika bahasanya tidak punya nilai kosong &mdash; ' +
         'dan cara yang masih sering dipakai, kadang dengan akibat buruk.']
      ],
      hindari: [
        ['Delapan arah sebagai delapan baris IF',
         'Baris 660-730 mengeja kedelapan arah satu per satu. TICTAC.BAS ' +
         'menyimpan hal yang sama sebagai delapan angka di satu ' +
         '<code>DATA</code>. Yang di sini lebih mudah dibaca sekilas, tapi ' +
         'mengubah aturannya berarti menyunting delapan tempat.'],
        ['Satu baris, sebelas pernyataan',
         'Baris 640 mencetak, memanggil subrutin, memindah kursor, mengganti ' +
         'warna, mencetak lagi, mengganti warna lagi, menaikkan dua pencacah, ' +
         'menandai monster mati, dan melompat. Semuanya benar; tak satu pun ' +
         'terbaca.'],
        ['Baris pengintip yang ditinggal mati',
         'Baris 380 adalah <code>PRINT</code> yang membuka posisi ketiga ' +
         'monster, dimatikan jadi komentar. Berguna saat mencari cacat, tapi ' +
         'membiarkannya di sana berarti siapa pun yang membuka berkas ini ' +
         'bisa curang &mdash; dan enam bulan lagi tidak ada yang ingat kenapa ' +
         'ia ada.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa "undi ulang" lebih baik daripada "geser"',
        isi: [
          'Tiga monster diundi ke petak 10&times;10. Kadang dua mendarat di ' +
          'petak yang sama. Apa yang harus dilakukan?',
          'Naluri pertama: geser salah satunya ke petak sebelah. Masalahnya, ' +
          'petak sebelah bisa saja sudah ditempati monster ketiga &mdash; jadi ' +
          'Anda perlu memeriksa lagi, dan menggeser lagi, dan memeriksa lagi.',
          'Baris 370 memilih jalan lain: <b>buang semuanya, undi ulang dari ' +
          'nol.</b>',
          '<code>370 IF (R(1)=R(2) AND C(1)=C(2)) OR … THEN 310</code>',
          'Lebih boros? Secara teori ya — bisa mengulang berkali-kali. Dalam ' +
          'praktik, peluang tabrakan di petak 100 kotak dengan tiga monster ' +
          'kecil sekali, jadi ia hampir tak pernah mengulang lebih dari sekali.',
          'Yang didapat sebagai gantinya: <b>kode yang tidak mungkin salah.</b> ' +
          'Tidak ada kasus tepi, tidak ada urutan yang harus benar. Pola ini ' +
          'punya nama di dunia nyata: <i>rejection sampling</i>, dan ia dipakai ' +
          'dari pembangkit bilangan acak sampai simulasi fisika.'
        ] },
      { judul: 'Dua program, satu kesalahan, satu tidak',
        isi: [
          'Bandingkan cara BOGGY dan MASTER menyemai pengacaknya:',
          '<b>BOGGY:</b> <code>310 RANDOMIZE(…)</code> lalu ' +
          '<code>320 FOR I=1 TO 3</code> — semai sekali, ambil enam angka.',
          '<b>MASTER:</b> <code>710 FOR SUB=1 TO DIGITS</code> lalu ' +
          '<code>720 RANDOMIZE(…):ANSWER(SUB)=…</code> — semai ulang sebelum ' +
          '<i>setiap</i> angka.',
          'Keduanya dari koleksi yang sama, keduanya memakai benih yang sama ' +
          '(detik jam dinding), dan yang satu benar. Menyemai adalah tindakan ' +
          '<b>sekali</b>: ia menetapkan titik awal deret. Mengulanginya di ' +
          'dalam gelung, dengan benih yang sama, sama saja dengan meminta ' +
          'angka pertama berulang kali.',
          'Aturan praktisnya sederhana: <b>semai di tempat paling luar yang ' +
          'masuk akal, dan hanya sekali.</b>'
        ] },
      { judul: 'Arah, bukan panas-dingin',
        isi: [
          'Permainan tebak-koordinat paling sederhana menjawab "lebih dekat" ' +
          'atau "lebih jauh". Program ini menjawab <b>arah</b>: North, ' +
          'Southeast, West, dan seterusnya.',
          'Bedanya besar. "Lebih dekat" memberi satu bit informasi per ' +
          'tebakan; arah memberi cukup untuk mempersempit dua sumbu sekaligus. ' +
          'Dengan sepuluh tebakan untuk tiga monster di petak seratus kotak, ' +
          'permainannya <b>bisa</b> dimenangkan dengan berpikir — dan itulah ' +
          'yang membuatnya permainan, bukan undian.',
          'Kalau Anda merancang permainan tebak-tebakan, pertanyaan pertamanya ' +
          'selalu: berapa banyak informasi yang diberikan tiap jawaban, dan ' +
          'apakah cukup untuk menang dengan jumlah kesempatan yang Anda beri?'
        ] },
      { judul: 'Dua NEXT yang berbagi satu baris',
        isi: [
          '<code>390 FOR I=3 TO 21 STEP 2:FOR J=33 TO 80 STEP 5</code>',
          '<code>400   LOCATE I,J,O:PRINT CHR$(219) CHR$(219) CHR$(219)</code>',
          '<code>410 NEXT:NEXT</code>',
          'Dua gelung dibuka di satu baris dan ditutup di satu baris. ' +
          '<code>NEXT</code> yang pertama menutup gelung <b>J</b> dan kembali ' +
          'ke baris 400. Yang kedua menutup gelung <b>I</b> dan kembali ke ' +
          '<code>FOR J</code> — yang ada di <b>tengah baris 390</b>.',
          'Di penelusur, kedua baris itu ditulis "berbagian", dan alamat ' +
          'pulang tiap gelung membawa nomor bagiannya. Telusuri dengan laju 4 ' +
          'baris/detik dan perhatikan sorotan: ia bolak-balik antara 390, 400, ' +
          'dan 410 — dan sesekali kembali ke 390 untuk memulai baris petak ' +
          'berikutnya.'
        ] }
    ]
  };
})(window);
