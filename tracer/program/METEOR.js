/* ===========================================================================
   METEOR.js — porting minimalis METEOR.BAS sebagai tabel baris.

   Delapan puluh baris, dan satu-satunya program di koleksi ini yang menyebut
   sumbernya sendiri di baris pertama:

       99 ' Source: Creative Computing, Vol. 8, No. 8, pp. 178-185
      110 REM BY EDWARD T. ORDMAN   NOVEMBER 1981

   Permainan arkade grafik-aksara: meteor jatuh sebagai garis miring dari
   baris 1 ke baris 24, dan pemain menggerakkan wajah ☻ dengan tombol panah
   untuk menghapus blok █ sebelum tertimpa.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) BENIH ACAK DARI KELAMBATAN MANUSIA. Baris 160-170 berputar menunggu
       jawaban Y/N, dan tiap putaran menaikkan `R`:

           170 IF R$="N" ... ELSE R=(R+511) MOD 32003:GOTO 160

       Makin lama pemain berpikir, makin jauh `R` berjalan. Waktu tombolnya
       akhirnya ditekan, angka itu jadi benih. Sumber keacakan yang jujur di
       mesin yang tidak punya jam beresolusi tinggi.

   (2) GARIS MIRING TANPA PERKALIAN BERULANG. Baris 400-430 menghitung
       kemiringan sekali, lalu MENAMBAHKANNYA tiap baris:

           400 S0=(X2-X1)/(Y2-Y1) : S=X1-S0
           410 FOR Y=Y1 TO Y2 : S=S+S0 : X=INT(0.5+S)

       Dan `INT(0.5+S)` adalah pembulatan ke bilangan terdekat, ditulis
       sebelum ada fungsi untuk itu.

   (3) LAYAR SEBAGAI SATU-SATUNYA CATATAN, LAGI. Tidak ada larik blok.
       `SCREEN(Y,X)=219` menanyakan langsung ke layar apakah di situ ada
       sasaran — baik untuk meteor (baris 370) maupun untuk pemain (700).

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` diam.
   - Tombol panah, Ins, dan Del datang sebagai dua bita `CHR$(0)+kode`,
     persis seperti aslinya. Di penelusur keempatnya ditekan lewat papan
     tombol biasa.
   - `LOAD "MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   - `RANDOMIZE R` memasang benih tetap di penelusur, jadi jalur meteornya
     bisa diulang persis.
   =========================================================================== */

(function (global) {
  'use strict';

  var WAJAH = 2, BLOK = 219, PANAH_BAWAH = 25, ARSIR = 178;

  function ul(kode, n) {
    var s = String.fromCharCode(kode), k = '', i;
    for (i = 0; i < n; i++) k += s;
    return k;
  }

  var tabel = [

    { baris: 99, jalan: function () { } },
    { baris: 100, jalan: function () { } },
    { baris: 110, jalan: function () { } },
    { baris: 120, jalan: function (m) {
        m.v['M$'] = m.chr(WAJAH);
        m.v['C$'] = m.chr(BLOK);
        m.v['X$'] = m.chr(PANAH_BAWAH);
      } },
    { baris: 130, jalan: function (m) {
        m.v['C5$'] = ul(BLOK, 5);
        m.v['H$'] = ''; m.v.T = 0;
      } },
    { baris: 140, jalan: function (m) {
        m.v.Y = ARSIR;
        m.v['E2$'] = ul(ARSIR, 2);
        m.v['E5$'] = ul(ARSIR, 5);
        m.v['E8$'] = ul(ARSIR, 8);
      } },
    { baris: 150, jalan: function (m) {
        m.cls();
        m.cetak('DO YOU WANT DIRECTIONS (Y/N)?'); m.barisBaru();
        m.v.R = 523;
      } },
    { baris: 160, bagian: [
        function (m) { m.v['R$'] = m.inkey(); },
        function (m) {
          if (m.v['R$'] === 'Y' || m.v['R$'] === 'y') m.gosub(930);
          else return;
        },
        function (m) { m.lompat(180); }
      ] },
    /* 170 BENIH DARI KELAMBATAN MENJAWAB. Tiap putaran menunggu menaikkan R
       sebesar 511, dibungkus modulo 32003 (bilangan prima). Waktu tombolnya
       ditekan, R sudah berjalan sejauh lamanya pemain berpikir. */
    { baris: 170, jalan: function (m) {
        var r = m.v['R$'];
        if (r === 'N' || r === 'n' || r === m.chr(13)) { m.lompat(180); return; }
        m.v.R = (m.v.R + 511) % 32003;
        m.lompat(160);
      } },
    { baris: 180, jalan: function (m) { m.semaiCampur(m.v.R); } },
    { baris: 190, jalan: function (m) { m.cetak('HOW HARD (1-9)?'); } },
    /* 200 `ASC(R$+" ")` — spasi disambung supaya ASC tidak pernah kena string
       kosong. Satu aksara yang menggantikan sebuah pemeriksaan. */
    { baris: 200, jalan: function (m) {
        m.v['R$'] = m.inkey();
        m.v.C = (m.v['R$'] + ' ').charCodeAt(0);
        if (m.v.C > 48 && m.v.C < 58) { m.v.C = m.v.C - 48; m.lompat(230); }
      } },
    { baris: 210, jalan: function (m) {
        if (m.v.C === 13) m.v.C = 5; else m.lompat(200);
      } },
    { baris: 230, jalan: function (m) {
        m.v.HX = 20 + Math.trunc(40 * m.acak() + 1);
        m.v.HY = 16 + Math.trunc(8 * m.acak() + 1);
      } },
    { baris: 240, jalan: function (m) {
        m.cls(); m.locate(25, 1);
        m.cetak('METEOR! (CURSORS MOVE ' + m.v['M$'] + ')');
      } },
    { baris: 260, jalan: function (m) { m.gosub(840); } },
    { baris: 280, jalan: function (m) { m.v.Y1 = 1; m.v.Y2 = 24; } },
    /* 290 tiap meteor jatuh dari kolom acak di atas ke kolom acak di bawah. */
    { baris: 290, jalan: function (m) {
        m.v.X1 = Math.trunc(m.acak() * 80 + 1);
        m.v.X2 = Math.trunc(m.acak() * 80 + 1);
      } },
    { baris: 310, bagian: [
        function (m) { m.gosub(390); },
        function (m) { m.lompat(290); }
      ] },

    /* --- 330-380: gambar satu titik meteor, sambil memeriksa --------------- */
    { baris: 330, jalan: function () { } },
    /* 340 `H$` adalah KAIT: tombol panah yang terakhir ditekan disimpan, dan
       wajahnya terus bergerak ke arah itu sampai tombol lain menekannya. */
    { baris: 340, jalan: function (m) {
        m.v['K$'] = m.inkey();
        if (m.v['K$'] !== '') m.v['H$'] = m.v['K$'];
      } },
    { baris: 350, jalan: function (m) {
        if (m.v['H$'].length > 0) m.gosub(570);
      } },
    { baris: 360, jalan: function (m) {
        if (Math.abs(m.v.X - m.v.HX) < 3 && Math.abs(m.v.Y - m.v.HY) < 2) {
          m.lompat(450);
        }
      } },
    /* 370 meteor mengenai blok: nilai pemain BERKURANG satu. */
    { baris: 370, jalan: function (m) {
        if (m.layarAksara(m.v.Y, m.v.X) === BLOK) {
          m.v.C2 = -1; m.gosub(740);
        }
      } },
    /* 375 menulis di baris 24 kolom 80 membuat layar tergulung — sudut yang
       harus dihindari di setiap program layar teks 1982. */
    { baris: 375, jalan: function (m) {
        if (m.v.Y === 24 && m.v.X === 80) m.v.X = 79;
      } },
    { baris: 380, jalan: function (m) {
        m.locate(m.v.Y, m.v.X); m.cetak(m.v['X$']);
        m.kembali();
      } },

    /* --- 390-430: garis miring dengan penambahan, bukan perkalian --------- */
    { baris: 390, jalan: function () { } },
    { baris: 400, jalan: function (m) {
        m.v.S0 = (m.v.X2 - m.v.X1) / (m.v.Y2 - m.v.Y1);
        m.v.S = m.v.X1 - m.v.S0;
      } },
    /* 410 `INT(0.5+S)` — pembulatan ke bilangan terdekat, ditulis sebelum ada
       fungsi untuk itu. */
    { baris: 410, bagian: [
        function (m) { m.untuk('Y', m.v.Y1, m.v.Y2, 1, 430); },
        function (m) {
          m.v.S = m.v.S + m.v.S0;
          m.v.X = Math.floor(0.5 + m.v.S);
        }
      ] },
    /* 420 meteornya berhenti begitu lewat di bawah pemain — tidak ada gunanya
       menggambar sisanya. */
    { baris: 420, jalan: function (m) {
        if (m.v.Y > m.v.HY + 1) m.kembali();
      } },
    { baris: 430, bagian: [
        function (m) { m.gosub(330); },
        function (m) { m.lanjutkan('Y'); },
        function (m) { m.kembali(); }
      ] },

    /* --- 450-560: kena ---------------------------------------------------- */
    { baris: 450, jalan: function () { } },
    { baris: 460, jalan: function (m) {
        m.v.HX = m.v.HX - 4;
        if (m.v.HX > 72) m.v.HX = 72;
      } },
    { baris: 470, jalan: function (m) { if (m.v.HX < 1) m.v.HX = 1; } },
    { baris: 480, jalan: function (m) { if (m.v.HY === 24) m.v.HY = 23; } },
    { baris: 500, jalan: function (m) {
        m.locate(m.v.HY, m.v.HX);
        m.cetak(m.v['E2$'] + 'BANG' + m.v['E2$']);
        m.locate(m.v.HY + 1, m.v.HX);
        m.cetak(m.v['E8$']);
      } },
    { baris: 520, jalan: function (m) {
        m.locate(25, 35);
        m.cetak('    DEL = FINISH,  INS = PLAY AGAIN          ');
      } },
    { baris: 530, jalan: function (m) {
        m.v['H$'] = m.inkey();
        if (m.v['H$'] === '') m.tunggu();
      } },
    /* 540-550 Del dan Ins datang sebagai DUA bita: CHR$(0) lalu kodenya. */
    { baris: 540, jalan: function (m) {
        if (m.v['H$'] === m.chr(0) + m.chr(83)) { m.cls(); m.jalankan('MENU'); }
      } },
    { baris: 550, jalan: function (m) {
        if (m.v['H$'] === m.chr(0) + m.chr(82)) { m.cls(); m.jalankan('METEOR'); }
      } },
    { baris: 560, jalan: function (m) { m.lompat(530); } },

    /* --- 570-720: memproses tombol --------------------------------------- */
    { baris: 570, jalan: function () { } },
    { baris: 580, jalan: function (m) {
        if (m.v['H$'] === m.chr(32)) m.lompat(760);
      } },
    /* 590 tombol biasa (satu bita) MENGHENTIKAN gerakan: kaitnya dikosongkan.
       Itu sebabnya naskah petunjuk berkata "any letter will stop cursor
       motion". */
    { baris: 590, jalan: function (m) {
        if (m.v['H$'].length === 1) { m.v['H$'] = ''; m.kembali(); }
      } },
    { baris: 600, jalan: function (m) {
        m.v.HH = m.v['H$'].charCodeAt(m.v['H$'].length - 1);
        m.v['K$'] = m.v['H$']; m.v['H$'] = '';
        m.locate(m.v.HY, m.v.HX); m.cetak(' ');
      } },
    panah(630, 77, 'HX', 1, function (m) { if (m.v.HX > 80) m.v.HX = 1; }),
    panah(650, 75, 'HX', -1, function (m) { if (m.v.HX < 1) m.v.HX = 80; }),
    { baris: 670, jalan: function (m) {
        if (m.v.HH === 80 && m.v.HY < 24) {
          m.v.HY = m.v.HY + 1; m.v['H$'] = m.v['K$'];
        }
      } },
    { baris: 680, jalan: function (m) {
        if (m.v.HH === 72 && m.v.HY > 1) {
          m.v.HY = m.v.HY - 1; m.v['H$'] = m.v['K$'];
        }
      } },
    { baris: 690, jalan: function (m) {
        if (m.v.HX === 80 && m.v.HY === 24) m.v.HY = 23;
      } },
    /* 700-710 pemain menghapus apa yang dilewatinya: blok 10 angka, jejak
       meteor 2 angka. */
    { baris: 700, jalan: function (m) {
        if (m.layarAksara(m.v.HY, m.v.HX) === BLOK) {
          m.v.C2 = 10; m.gosub(740);
        }
      } },
    { baris: 710, jalan: function (m) {
        if (m.layarAksara(m.v.HY, m.v.HX) === PANAH_BAWAH) {
          m.v.C2 = 2; m.gosub(740);
        }
      } },
    { baris: 720, jalan: function (m) {
        m.locate(m.v.HY, m.v.HX); m.cetak(m.v['M$']);
        m.kembali();
      } },
    { baris: 740, jalan: function (m) {
        m.v.T = m.v.T + m.v.C2;
        m.locate(25, 27); m.cetak(' ' + m.v.T + ' ');
        m.kembali();
      } },

    /* --- 760-810: jeda ---------------------------------------------------- */
    { baris: 760, jalan: function (m) {
        m.locate(25, 35);
        m.cetak('KEYS: INS=CONTINUE, DEL=STOP, ENTER=RESTORE  ');
      } },
    { baris: 770, bagian: [
        function (m) {
          m.v['H$'] = m.inkey();
          if (m.v['H$'] === '') m.tunggu();
        },
        function (m) {
          if (m.v['H$'] === m.chr(0) + m.chr(82)) m.lompat(910);
        }
      ] },
    /* 790 Enter MENGGAMBAR ULANG seluruh sasaran — itulah "restore" yang
       disebut naskah petunjuk. Harganya: nol. */
    { baris: 790, jalan: function (m) {
        if (m.v['H$'] === m.chr(13)) m.lompat(840);
      } },
    { baris: 800, jalan: function (m) {
        if (m.v['H$'] === m.chr(0) + m.chr(83)) {
          m.cls(); m.henti('DEL: permainan dihentikan (END).');
        }
      } },
    { baris: 810, jalan: function (m) { m.lompat(770); } },

    /* --- 840-920: pasang sasaran ------------------------------------------ */
    { baris: 840, jalan: function () { } },
    /* 860 TINGKAT KESULITAN mengubah tinggi tumpukan sasaran: makin besar C,
       makin ke atas ia dimulai, makin jauh dari pemain. */
    { baris: 860, jalan: function (m) { m.untuk('I', 12 - m.v.C, 24 - m.v.C, 1, 900); } },
    { baris: 870, jalan: function (m) {
        m.locate(m.v.I, 15); m.cetak(m.v['C5$']);
        m.locate(m.v.I, 35); m.cetak(m.v['C5$']);
        m.locate(m.v.I, 55); m.cetak(m.v['C5$']);
      } },
    { baris: 900, bagian: [
        function (m) { m.lanjutkan('I'); },
        function (m) { m.locate(m.v.HY, m.v.HX); m.cetak(m.v['M$']); }
      ] },
    { baris: 910, jalan: function (m) {
        m.locate(25, 35);
        m.cetak('     HIT SPACE BAR TO PAUSE                  ');
      } },
    { baris: 920, jalan: function (m) { m.kembali(); } },

    /* --- 930-1060: petunjuk ----------------------------------------------- */
    { baris: 930, jalan: function () { } },
    { baris: 940, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.tab(35); m.cetak('METEOR'); m.barisBaru();
        m.barisBaru(); m.barisBaru();
      } },
    cetak(950, 'A SIMPLE ARCADE GAME USING CHARACTER GRAPHICS.'),
    { baris: 960, jalan: function (m) {
        m.barisBaru();
        m.cetak('THE CURSOR CONTROL KEYS START THE ' + m.v['M$'] + ' SYMBOL MOVING.');
        m.barisBaru();
      } },
    cetak(970, 'THE SPACE BAR STOPS ALL ACTION TEMPORARILY, AND ALLOWS ', true),
    cetak(975, 'RESTORING TARGETS.'),
    cetak(980, 'ANY LETTER (AND SOME OTHER KEYS) WILL STOP CURSOR MOTION.'),
    { baris: 990, jalan: function (m) {
        m.barisBaru();
        m.cetak('SEE IF YOU CAN ERASE THE SOLID BLOCKS BEFORE A FALLING ');
      } },
    cetak(995, 'METEOR HITS YOU.'),
    { baris: 1000, jalan: function (m) {
        m.cetak('EACH ' + m.v['C$'] + ' YOU ERASE SCORES 10 POINTS, EACH ' +
                m.v['X$'] + ' 2 POINTS.');
        m.barisBaru();
      } },
    { baris: 1010, jalan: function (m) {
        m.cetak('YOU LOSE 1 POINT FOR EACH ' + m.v['C$'] + ' A METEOR HITS.');
        m.barisBaru();
      } },
    { baris: 1020, jalan: function (m) {
        m.barisBaru();
        m.cetak('TO HIT YOU A METEOR NEEDS TO GET WITHIN THE SHADED AREA:');
        m.barisBaru();
      } },
    { baris: 1030, jalan: function (m) {
        m.barisBaru();
        m.tab(37); m.cetak(m.v['E5$']); m.barisBaru();
        m.tab(37); m.cetak(m.v['E2$'] + m.v['M$'] + m.v['E2$']); m.barisBaru();
      } },
    { baris: 1050, jalan: function (m) {
        m.tab(37); m.cetak(m.v['E5$']); m.barisBaru();
        m.barisBaru(); m.barisBaru();
      } },
    { baris: 1060, jalan: function (m) {
        m.cetak('SOME EXTRA INSTRUCTIONS WILL BE ON THE BOTTOM LINE');
        m.barisBaru(); m.barisBaru();
        m.kembali();
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function cetak(nomor, isi, gantung) {
    return { baris: nomor, jalan: function (m) {
      m.cetak(isi);
      if (!gantung) m.barisBaru();
    } };
  }
  /* 630 dan 650 berbentuk sama: kalau kodenya cocok, geser satu kolom,
     PASANG ULANG kaitnya supaya geraknya berlanjut, lalu bungkus di tepi. */
  function panah(nomor, kode, nama, delta, bungkus) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.HH !== kode) return;
      m.v[nama] = m.v[nama] + delta;
      m.v['H$'] = m.v['K$'];
      bungkus(m);
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['METEOR'] = {
    nama: 'METEOR',
    judul: 'Meteor (Creative Computing, 1981)',
    sumber: 'METEOR',
    berkas: 'run/METEOR.BAS',
    tabel: tabel,
    benih: 3,

    arsitektur: {
      judul: 'Alur METEOR.BAS',
      simpul: [
        { id: 'benih', baris: '150-180', jenis: 'mulai',
          teks: ['Tanya petunjuk;', 'lamanya menjawab jadi benih'] },
        { id: 'sulit', baris: '190-230', jenis: 'putusan',
          teks: ['Tingkat 1-9;', 'Enter berarti 5'] },
        { id: 'pasang', baris: '840-920', jenis: 'subrutin',
          teks: ['Tiga tumpukan blok', 'dan wajah pemain'] },
        { id: 'jatuh', baris: '280-310',
          teks: ['Meteor baru: kolom acak', 'di atas dan di bawah'] },
        { id: 'garis', baris: '390-430', jenis: 'subrutin',
          teks: ['Turuni garisnya,', 'kemiringan ditambahkan'] },
        { id: 'titik', baris: '330-380', jenis: 'subrutin',
          teks: ['Satu titik: baca tombol,', 'BACA LAYAR, gambar'] },
        { id: 'tombol', baris: '570-720', jenis: 'subrutin',
          teks: ['Kait arah; hapus blok', 'yang dilewati wajah'] },
        { id: 'jeda', baris: '760-810',
          teks: ['Spasi: berhenti.', 'Enter: pasang ulang sasaran'] },
        { id: 'kena', baris: '450-560', jenis: 'galat',
          teks: ['BANG. Ins main lagi,', 'Del kembali ke menu'] }
      ],
      panah: [
        { dari: 'benih', ke: 'sulit' },
        { dari: 'sulit', ke: 'pasang' },
        { dari: 'pasang', ke: 'jatuh' },
        { dari: 'jatuh', ke: 'garis' },
        { dari: 'garis', ke: 'titik' },
        { dari: 'titik', ke: 'tombol', label: 'ada kait arah' },
        { dari: 'tombol', ke: 'jeda', label: 'spasi' },
        { dari: 'jeda', ke: 'pasang', label: 'Enter: sasaran dipulihkan' },
        { dari: 'titik', ke: 'kena', label: 'meteor dekat wajah', jenis: 'galat' },
        { dari: 'garis', ke: 'jatuh', label: 'sampai bawah' },
        { dari: 'kena', ke: 'benih', label: 'Ins' }
      ]
    },

    pseudokode: [
      { baris: 160, tingkat: 0, teks: '<b>ULANG</b> sambil menunggu Y/N: <code>R = (R + 511) MOD 32003</code>' },
      { baris: 180, tingkat: 1, teks: '&hellip;lalu <code>RANDOMIZE R</code> &mdash; <b>lamanya berpikir jadi benih</b>' },
      { baris: 200, tingkat: 0, teks: '<code>ASC(R$+" ")</code> &mdash; spasi disambung supaya <code>ASC</code> tak kena string kosong' },
      { baris: 860, tingkat: 0, teks: 'pasang tiga tumpukan blok; tingginya bergantung tingkat kesulitan' },
      { baris: 400, tingkat: 0, teks: '<b>ULANG SELAMANYA:</b> meteor baru, kemiringan dihitung <b>sekali</b>' },
      { baris: 410, tingkat: 1, teks: 'tiap baris: <code>S = S + S0</code>, <code>X = INT(0.5+S)</code> &mdash; pembulatan' },
      { baris: 340, tingkat: 2, teks: 'baca tombol; <code>H$</code> adalah <b>kait</b> &mdash; arah bertahan sampai diganti' },
      { baris: 360, tingkat: 2, teks: 'meteor dalam jarak 3&times;2 dari wajah &rarr; <b>BANG</b>' },
      { baris: 370, tingkat: 2, teks: '<code>SCREEN(Y,X)=219</code>? blok tertimpa, nilai <b>&minus;1</b>' },
      { baris: 700, tingkat: 2, teks: 'wajah melewati blok &rarr; <b>+10</b>; melewati jejak meteor &rarr; <b>+2</b>' }
    ],

    perintahAsli: 'run\\METEOR.bat',
    catatanAsli: 'Dari Creative Computing Vol. 8 No. 8 (1981), oleh Edward T. ' +
      'Ordman. Kemudikan dengan tombol panah; spasi menjeda; Enter saat jeda ' +
      'memulihkan sasaran; Del berhenti.',

    penyimpangan: [
      '<b><code>SOUND</code> diam.</b>',

      '<b>Tombol panah, Ins, dan Del datang sebagai dua bita</b> ' +
      '<code>CHR$(0)+kode</code>, persis seperti aslinya &mdash; itulah yang ' +
      'diperiksa baris 540, 550, dan 600.',

      '<b><code>LOAD "MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code></b>: muat lalu jalankan.',

      '<b><code>RANDOMIZE R</code> memasang benih tetap</b> di penelusur, ' +
      'jadi jalur meteornya bisa diulang persis. Di GW-BASIC benihnya ' +
      'sungguh-sungguh bergantung pada lamanya pemain menjawab.'
    ],

    pelajaran: {
      ringkas: 'Permainan arkade grafik-aksara 1981 yang mengambil benih ' +
        'acaknya dari kelambatan manusia, dan menggambar garis miring dengan ' +
        'penambahan berulang.',
      pelajari: [
        ['Keacakan dari kelambatan manusia',
         'Baris 160&ndash;170 berputar menunggu jawaban Y/N, dan tiap putaran ' +
         'menaikkan <code>R</code> sebesar 511 dengan modulo 32003 &mdash; ' +
         'keduanya bilangan yang dipilih supaya urutannya lama berulang. ' +
         'Waktu tombolnya akhirnya ditekan, <code>R</code> sudah berjalan ' +
         'sejauh lamanya pemain berpikir. <b>Sumber keacakan yang jujur di ' +
         'mesin tanpa jam beresolusi tinggi</b> &mdash; dan prinsip yang sama ' +
         'masih dipakai hari ini, dengan gerakan tetikus dan ketukan papan ' +
         'tombol sebagai sumber entropi.'],
        ['Garis miring tanpa perkalian berulang',
         'Baris 400 menghitung kemiringan <b>sekali</b>: ' +
         '<code>S0=(X2-X1)/(Y2-Y1)</code>. Lalu baris 410 cuma ' +
         '<b>menambahkannya</b> tiap baris. Tidak ada perkalian di dalam ' +
         'gelung sama sekali. Di mesin 1981 yang perkaliannya lambat, itu ' +
         'perbedaan antara mulus dan tersendat &mdash; dan gagasan yang sama ' +
         'ada di jantung algoritma garis Bresenham.'],
        ['Membulatkan sebelum ada fungsinya',
         '<code>X=INT(0.5+S)</code>. <code>INT</code> membuang pecahan ke ' +
         'bawah; menambah setengah lebih dulu membuatnya <b>membulat ke ' +
         'bilangan terdekat</b>. Idiom yang dipakai di setiap bahasa yang ' +
         'belum punya <code>ROUND</code>.'],
        ['Kait arah',
         '<code>H$</code> menyimpan tombol panah terakhir, dan wajahnya terus ' +
         'bergerak ke arah itu tiap titik meteor digambar &mdash; sampai ' +
         'tombol lain menekannya. Baris 590 mengosongkan kait kalau yang ' +
         'ditekan tombol biasa (satu bita), dan itulah kenapa naskah ' +
         'petunjuknya berkata "any letter will stop cursor motion". ' +
         '<b>Gerak terus-menerus dari masukan sesaat</b>, dengan satu ' +
         'variabel.'],
        ['Menyebut sumbernya sendiri',
         'Baris 99 dan 110 menulis majalah, jilid, nomor, halaman, penulis, ' +
         'dan tanggalnya. Satu-satunya berkas di koleksi ini yang melakukannya ' +
         '&mdash; dan alasannya jelas: program ini <b>diketik ulang dari ' +
         'majalah</b>, dan orang yang mengetiknya mencatat dari mana asalnya.']
      ],
      hindari: [
        ['Menulis di sudut kanan bawah',
         'Baris 375 <code>IF Y=24 AND X=80 THEN X=79</code>. Mencetak di ' +
         'petak terakhir layar teks membuat seluruh layar tergulung satu ' +
         'baris &mdash; dan permainan ini menggambar di seluruh layar, jadi ' +
         'satu meteor yang kebetulan lewat di situ akan mengacaukan ' +
         'semuanya. Perbaikannya satu baris, dan letaknya harus persis ' +
         'sebelum pencetakan.'],
        ['Pemulihan sasaran yang gratis',
         'Baris 790: menekan Enter saat jeda melompat ke 840, yang menggambar ' +
         '<b>seluruh sasaran kembali</b>. Tidak ada harganya, tidak ada ' +
         'batasnya, dan skor yang sudah didapat tetap. Menekan spasi lalu ' +
         'Enter berulang-ulang adalah cara mendapat angka tanpa batas.'],
        ['Nilai yang tidak pernah dibersihkan tampilannya',
         'Baris 740 mencetak <code>T</code> di baris 25 tanpa menghapus ' +
         'angka sebelumnya. Waktu nilainya turun dari 100 ke 99, yang terlihat ' +
         '"99" dengan sisa "0" di belakangnya. Di penelusur ini spasi ' +
         'penjepit ditambahkan supaya terbaca.'],
        ['Nomor baris yang bolong-bolong',
         '220, 250, 270, 300, 320, 440, 490, 510, 600&ndash;620, 640, 660, ' +
         '730, 750, 780, 820&ndash;830 tidak ada. Sebagian sisa penyuntingan, ' +
         'sebagian ruang yang sengaja dikosongkan &mdash; dan tidak ada cara ' +
         'membedakan keduanya.']
      ]
    },

    penjelasan: [
      { judul: 'Keacakan yang diambil dari orang yang bermain',
        isi: [
          'Komputer 1981 punya masalah yang sekarang mudah dilupakan: ' +
          '<b>tidak ada sumber keacakan sama sekali</b>. Menjalankan program ' +
          'yang sama dua kali memberi urutan <code>RND</code> yang sama persis, ' +
          'karena benihnya tetap.',
          'Cara biasa mengatasinya: <code>RANDOMIZE TIMER</code>. Tapi ' +
          '<code>TIMER</code> di PC awal berdetak 18,2 kali per detik &mdash; ' +
          'cukup kasar, dan tidak semua BASIC punya.',
          'Program ini memakai cara lain, dan lebih indah:',
          '<code>160 R$=INKEY$:IF R$="Y" THEN &hellip;</code><br>' +
          '<code>170 IF R$="N" &hellip; ELSE R=(R+511)MOD 32003:GOTO 160</code>',
          'Gelung itu berputar secepat mesinnya bisa, menaikkan <code>R</code> ' +
          'sebesar 511 tiap kali, dibungkus modulo 32003. Keduanya bilangan ' +
          'prima, jadi urutannya baru berulang setelah puluhan ribu putaran.',
          'Waktu pemain akhirnya menekan Y atau N, <code>R</code> sudah ' +
          'berjalan sejauh <b>lamanya orang itu berpikir</b> &mdash; sesuatu ' +
          'yang tidak bisa diulang, tidak bisa diramalkan, dan berbeda tiap ' +
          'kali program dijalankan.',
          'Prinsip yang sama masih dipakai hari ini. Sistem operasi modern ' +
          'mengumpulkan entropi dari waktu antar ketukan papan tombol, gerakan ' +
          'tetikus, dan kelambatan cakram &mdash; karena <b>satu-satunya hal ' +
          'yang benar-benar tak terduga di sebuah mesin deterministik adalah ' +
          'dunia di luarnya</b>.'
        ] },
      { judul: 'Menggambar garis dengan penambahan',
        isi: [
          'Meteor jatuh sebagai garis miring dari sebuah titik acak di baris 1 ' +
          'ke titik acak lain di baris 24. Cara paling langsung menghitung ' +
          'kolomnya: untuk tiap baris <code>Y</code>, kolom = ' +
          '<code>X1 + (X2-X1)*(Y-Y1)/(Y2-Y1)</code>. Itu satu perkalian dan ' +
          'satu pembagian per baris.',
          'Program ini melakukannya sekali:',
          '<code>400 S0=(X2-X1)/(Y2-Y1) : S=X1-S0</code><br>' +
          '<code>410 FOR Y=Y1 TO Y2 : S=S+S0 : X=INT(0.5+S)</code>',
          'Kemiringan <code>S0</code> dihitung <b>satu kali</b>. Di dalam ' +
          'gelung tinggal penambahan. Dan <code>S=X1-S0</code> di awal adalah ' +
          'penyetelan supaya penambahan pertama tepat mengembalikannya ke ' +
          '<code>X1</code>.',
          'Di mesin 8088 tanpa perangkat keras pecahan, penambahan jauh lebih ' +
          'murah daripada perkalian. Gagasan yang sama &mdash; ganti perkalian ' +
          'berulang dengan penambahan berjalan &mdash; adalah inti algoritma ' +
          'garis Bresenham, dan masih ada di setiap perenderan grafik hari ' +
          'ini.',
          'Yang tersisa cuma pembulatan: <code>INT(0.5+S)</code>. ' +
          '<code>INT</code> membuang pecahan ke bawah, jadi menambah setengah ' +
          'lebih dulu membuatnya membulat ke bilangan terdekat. Empat aksara ' +
          'yang menggantikan sebuah fungsi yang belum ada.'
        ] }
    ]
  };
})(window);
