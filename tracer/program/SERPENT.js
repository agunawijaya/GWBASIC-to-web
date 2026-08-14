/* ===========================================================================
   SERPENT.js — porting minimalis SERPENT.BAS sebagai tabel baris.

   Enam puluh empat baris: permainan ular. Dan gagasan pusatnya adalah salah
   satu yang paling berani di seluruh koleksi ini.

   TIDAK ADA LARIK YANG MENYIMPAN TUBUH ULARNYA.

   Tidak ada `DIM BODY(200)`, tidak ada antrean, tidak ada penunjuk kepala dan
   ekor. Yang ada cuma dua pasang koordinat — (HX,HY) kepala dan (EX,EY) ekor
   — dan LAYAR ITU SENDIRI sebagai penyimpan keadaan.

   Caranya: tubuh ular digambar dengan aksara kotak yang MENGANDUNG ARAH.

       ─ │   badan lurus
       ┌ ┐ └ ┘   badan yang berbelok

   Kepala menggambar aksara yang sesuai arah geraknya. Waktu ekor tiba di
   petak itu, ia MEMBACA aksaranya kembali dengan `SCREEN(EY,EX)` dan dari
   bentuknya menyimpulkan harus belok ke mana:

       700  IF S=179 THEN EY=EY+Y2 ELSE IF S=196 THEN EX=EX+X2
       710  IF S=191 THEN IF X2=1 THEN X2=0:Y2=1 ...

   Layarnya bukan keluaran. Layarnya adalah STRUKTUR DATANYA. Tabrakan pun
   diperiksa begitu (baris 630): baca aksara di depan kepala, dan kalau
   kodenya jatuh di rentang aksara kotak, ular menabrak sesuatu.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom. Ini
     penyimpangan TERBESAR di berkas ini: lapangan permainan aslinya 40x25,
     dan di sini ia terlihat memenuhi separuh kiri layar. Batas geraknya
     tetap 40 kolom karena diperiksa program sendiri di baris 620.
   - `SOUND` dan `BEEP` diam. `COLOR ,,n` (warna bingkai layar) tidak ada
     padanannya dan diabaikan.
   - `INPUT$(1)` di baris 520 ditiru dengan penungguan satu tombol.
   - `LOAD"MENU",R` di baris 520 diperlakukan sama seperti `RUN"MENU"`.
   - Gelung tunda `FOR W=1 TO 2500:NEXT` habis seketika, jadi jeda kematian
     di baris 920 tidak terasa.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Aksara kotak sebagai BITA CP437 — di sini kodenya bukan hiasan melainkan
     DATA, jadi angkanya diberi nama. */
  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KIRI_BAWAH = 192, KANAN_BAWAH = 217,
      BLOK = 219, MAKANAN = 148, PEMBURU = 162,
      /* 28 BUKAN gambar: mencetaknya memindahkan kursor SATU KE KANAN. Jadi
         `STRING$(9,28)` di baris 950 tidak mengisi apa-apa — ia melompati
         sembilan kolom dan meninggalkannya kosong. Itu sebabnya bagian dalam
         rintangan bukan penghalang, dan uji tabrakan di baris 630 (kode
         179-218) memang tidak perlu menyebutnya. */
      LOMPAT_KANAN = 28,
      SILANG = 197;

  var tabel = [

    /* --- 10-160: layar judul ---------------------------------------------- */
    { baris: 10, jalan: function (m) {
        m.warna(15, 0); m.cls();
        m.locate(5, 19); m.cetak('IBM'); m.barisBaru();
      } },
    { baris: 20, jalan: function (m) {
        m.locate(7, 8, 0); m.cetak('General  utility  programs'); m.barisBaru();
      } },
    { baris: 30, jalan: function (m) {
        m.warna(9, 0); m.locate(10, 9, 0);
        m.cetak(m.chr(213) + m.ulang(21, 205) + m.chr(184)); m.barisBaru();
      } },
    { baris: 40, jalan: function (m) {
        m.locate(11, 9, 0);
        m.cetak(m.chr(TEGAK) + '       SERPENT       ' + m.chr(TEGAK));
        m.barisBaru();
      } },
    { baris: 50, jalan: function (m) {
        m.locate(12, 9, 0);
        m.cetak(m.chr(TEGAK) + m.ulang(21, 32) + m.chr(TEGAK));
        m.barisBaru();
      } },
    { baris: 60, jalan: function (m) {
        m.warna(9, 0); m.locate(13, 9, 0);
        m.cetak(m.chr(TEGAK) + '     Version  00     ' + m.chr(TEGAK));
        m.barisBaru();
      } },
    { baris: 70, jalan: function (m) { m.bunyi(); } },
    { baris: 80, jalan: function (m) {
        m.locate(14, 9, 0);
        m.cetak(m.chr(212) + m.ulang(21, 205) + m.chr(190)); m.barisBaru();
      } },
    { baris: 90, jalan: function (m) {
        m.warna(15, 0); m.locate(17, 7, 0);
        m.cetak('OCTOBER 06 1982   USR-5-5-K '); m.barisBaru();
      } },
    { baris: 100, jalan: function (m) {
        m.warna(9, 0); m.locate(23, 6, 0);
        m.cetak('Press space bar to continue...'); m.barisBaru();
      } },
    { baris: 110, jalan: function (m) { if (m.inkey() !== '') m.lompat(110); } },
    { baris: 120, jalan: function (m) { m.v['CMD$'] = m.inkey(); } },
    { baris: 130, jalan: function (m) { if (m.v['CMD$'] === '') m.lompat(120); } },
    { baris: 140, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(160);
      } },
    { baris: 150, jalan: function (m) {
        if (m.v['CMD$'] !== ' ') m.lompat(120);
      } },
    /* 160 REM TRANSFER COMMAND — dan di sinilah nomor barisnya melompat dari
       160 ke 500. Tiga ratus empat puluh nomor kosong: ruang yang disediakan
       untuk "perintah pindah" yang tidak pernah ditulis. */
    { baris: 160, jalan: function () { } },

    /* --- 500-530: siapkan permainan --------------------------------------- */
    /* `POKE 1047,32` di segmen 0 mematikan bendera papan tombol (Caps/Num
       Lock) — supaya angka arahnya terbaca sebagai angka. */
    { baris: 500, jalan: function (m) { m.warna(1, 0); } },
    /* DL = jumlah rintangan, L = panjang ular, SL = sisa nyawa, P = jumlah
       pemburu. Keempatnya disetel SEKALI di sini, di luar gelung ulang. */
    { baris: 510, jalan: function (m) {
        m.v.DL = 0; m.v.L = 10; m.v.SL = 3; m.v.P = 0;
      } },
    { baris: 520, bagian: [
        function (m) {
          m.cls(); m.locate(13, 3);
          m.cetak('press a key to start or ESC to end');
        },
        /* `INPUT$(1)` menunggu SATU tombol. Penantiannya harus di tempat —
           kalau ia melompat ke awal baris 520, `CLS` di penggal pertama ikut
           jalan lagi tiap langkah. */
        function (m) {
          m.v['A$'] = m.inkey();
          if (m.v['A$'] === '') m.tunggu();
        },
        function (m) {
          if (m.v['A$'] === m.chr(27)) { m.cls(); m.jalankan('MENU'); }
        }
      ] },
    /* 530 satu baris, delapan belas penugasan. Seluruh keadaan awal satu
       nyawa: arah kepala, arah ekor, posisi keduanya, cacah apel, panjang
       tersisa, dan dua pemburu lengkap dengan arah geraknya. */
    { baris: 530, jalan: function (m) {
        m.v.X1 = 1; m.v.Y1 = 0; m.v.HX = 1; m.v.HY = 1;
        m.v.Y2 = 0; m.v.X2 = 1; m.v.EX = 1; m.v.EY = 1;
        m.v.AP = 0; m.v.LE = m.v.L;
        if (!m.v.PX) { m.dim('PX', 8); m.dim('PY', 8); m.dim('PX1', 8); m.dim('PY1', 8); }
        m.v.PX[1] = 2; m.v.PY[1] = 24; m.v.PX1[1] = 1; m.v.PY1[1] = -1;
        m.v.PX[2] = 39; m.v.PY[2] = 24; m.v.PX1[2] = -1; m.v.PY1[2] = -1;
      } },

    /* --- 540-560: gambar lapangan ----------------------------------------- */
    { baris: 540, bagian: [
        function (m) {
          m.cls();
          m.v.PS = 1 / (m.v.DL + 1) * 40;
        },
        function (m) { m.untuk('R', 1, m.v.DL, 1, 550); },
        function (m) { m.gosub(950); },
        function (m) { m.lanjutkan('R'); }
      ] },
    { baris: 550, jalan: function (m) {
        for (m.v.R = 1; m.v.R <= 40; m.v.R++) {
          m.locate(25, m.v.R); m.cetak(m.chr(BLOK));
        }
      } },
    /* 560 lima apel ditaruh acak. TIDAK ADA pemeriksaan apakah tempatnya
       sudah terisi — apel bisa jatuh persis di atas ular atau rintangan. */
    { baris: 560, jalan: function (m) {
        m.warna(4, null);
        for (m.v.R = 1; m.v.R <= 5; m.v.R++) {
          m.locate(Math.trunc(m.acak() * 22 + 2), Math.trunc(m.acak() * 39 + 1));
          m.cetak(m.chr(MAKANAN));
        }
      } },

    /* --- 570-610: baca tombol, belokkan kepala ---------------------------- */
    /* `A=VAL(INKEY$)` — arahnya diketik sebagai ANGKA: 8 atas, 2 bawah,
       4 kiri, 6 kanan. Tata letaknya persis papan angka di kanan papan
       tombol, dan itu sebabnya baris 500 mematikan Num Lock. */
    { baris: 570, jalan: function (m) {
        m.v.A = parseInt(m.inkey(), 10) || 0;
        m.warna(1, null);
        m.locate(m.v.HY, m.v.HX);
        m.cetak(m.chr(m.v.Y1 === 0 ? DATAR : TEGAK));
      } },
    belok(580, 4, 'X1', -1, KANAN_BAWAH, KANAN_ATAS, 'Y1'),
    belok(590, 6, 'X1', 1, KIRI_BAWAH, KIRI_ATAS, 'Y1'),
    belok(600, 2, 'Y1', 1, KANAN_ATAS, KIRI_ATAS, 'X1'),
    belok(610, 8, 'Y1', -1, KANAN_BAWAH, KIRI_BAWAH, 'X1'),

    /* --- 620-660: majukan kepala, periksa apa yang ditabraknya ------------- */
    { baris: 620, jalan: function (m) {
        m.v.HX += m.v.X1; m.v.HY += m.v.Y1;
        if (m.v.HX < 1 || m.v.HX > 40 || m.v.HY < 1 || m.v.HY > 24) m.lompat(860);
      } },
    /* 630 SELURUH pemeriksaan tabrakan, dalam satu baris. Baca aksara di
       petak yang baru dimasuki kepala; kalau kodenya 179..218 — yaitu
       rentang aksara kotak — berarti badan sendiri atau dinding rintangan. */
    { baris: 630, jalan: function (m) {
        m.v.S = m.layarAksara(m.v.HY, m.v.HX);
        if ((m.v.S < 219 && m.v.S > 178) || m.v.S === 235) m.lompat(860);
      } },
    /* 640 apel dimakan: skor naik, ular memanjang, dan tiap lima apel
       rintangannya bertambah — sampai lima, lalu diganti seorang pemburu. */
    { baris: 640, bagian: [
        function (m) {
          if (m.v.S !== MAKANAN) { m.lompat(650); return; }
          m.v.SC = (m.v.SC || 0) + 10;
          m.locate(25, 20 - String(' ' + m.v.SC + ' ').length / 2);
          m.cetak(' ' + m.v.SC + ' ');
          m.v.L = m.v.L + 1;
          m.v.AP = m.v.AP + 1;
        },
        function (m) {
          if (m.v.AP < 5) { m.lompat(750); return; }
          for (m.v.R = 1; m.v.R <= 10; m.v.R++) m.v['A$'] = m.inkey();
          m.v.DL = m.v.DL + 1;
          if (m.v.DL === 5) { m.v.DL = 0; m.v.P = m.v.P + 1; }
          m.lompat(530);
        }
      ] },
    { baris: 650, jalan: function (m) { if (m.v.S === PEMBURU) m.lompat(860); } },
    /* 660 aksara di sini TEGAK LURUS terhadap arah geraknya — kebalikan dari
       yang digambar baris 570. Itu KEPALANYA: sebuah coretan melintang yang
       terlihat menonjol dari badan. Satu langkah kemudian baris 570
       menimpanya dengan aksara badan yang benar, dan barulah ekor bisa
       membacanya sebagai jalur. */
    { baris: 660, jalan: function (m) {
        m.locate(m.v.HY, m.v.HX);
        m.cetak(m.chr(m.v.Y1 === 0 ? TEGAK : DATAR));
      } },
    /* 670 selama ularnya belum sepanjang L, ekornya tidak bergerak — itulah
       cara ular memanjang. */
    { baris: 670, jalan: function (m) {
        if (m.v.LE > 1) { m.v.LE = m.v.LE - 1; m.lompat(750); }
      } },
    { baris: 680, jalan: function () { } },

    /* --- 690-740: EKOR MEMBACA LAYAR -------------------------------------- */
    /* Inti seluruh programnya. Ekor tidak tahu ke mana ular pernah pergi. Ia
       membaca aksara di petaknya sendiri, dan dari BENTUK aksara itu
       menyimpulkan belokannya. Layar sebagai struktur data. */
    { baris: 690, jalan: function (m) {
        m.v.S = m.layarAksara(m.v.EY, m.v.EX);
        m.locate(m.v.EY, m.v.EX); m.cetak(' ');
      } },
    { baris: 700, jalan: function (m) {
        if (m.v.S === TEGAK) m.v.EY += m.v.Y2;
        else if (m.v.S === DATAR) m.v.EX += m.v.X2;
      } },
    ekorBelok(710, KANAN_ATAS, 'X2', 1, 0, 1, 'Y2', -1, 0, -1),
    ekorBelok(720, KIRI_BAWAH, 'X2', -1, 0, -1, 'Y2', 1, 0, 1),
    ekorBelok(730, KANAN_BAWAH, 'X2', 1, 0, -1, 'Y2', 1, 0, -1),
    ekorBelok(740, KIRI_ATAS, 'X2', -1, 0, 1, 'Y2', -1, 0, 1),

    /* --- 750-820: pemburu yang memantul ----------------------------------- */
    { baris: 750, bagian: [
        function (m) { m.warna(9, null); },
        function (m) { m.untuk('PL', 1, m.v.P, 1, 830); }
      ] },
    { baris: 760, jalan: function (m) {
        var i = m.v.PL;
        m.locate(m.v.PY[i], m.v.PX[i]); m.cetak(' ');
        m.v.PX[i] += m.v.PX1[i]; m.v.PY[i] += m.v.PY1[i];
      } },
    { baris: 770, jalan: function (m) {
        var i = m.v.PL;
        if (m.v.PX[i] < 2 || m.v.PX[i] > 39) {
          m.v.PX1[i] = -m.v.PX1[i]; m.lompat(820);
        }
      } },
    { baris: 780, jalan: function (m) {
        var i = m.v.PL;
        if (m.v.PY[i] < 2 || m.v.PY[i] > 24) {
          m.v.PY1[i] = -m.v.PY1[i]; m.lompat(820);
        }
      } },
    /* 790-800 pemburu pun memantul dengan MEMBACA LAYAR, bukan dengan
       daftar rintangan. */
    { baris: 790, jalan: function (m) {
        var i = m.v.PL;
        m.v.S1 = m.layarAksara(m.v.PY[i] + m.v.PY1[i], m.v.PX[i]);
        m.v.S2 = m.layarAksara(m.v.PY[i], m.v.PX[i] + m.v.PX1[i]);
        if (m.v.S1 < 219 && m.v.S1 > 178) m.v.PY1[i] = -m.v.PY1[i];
      } },
    { baris: 800, jalan: function (m) {
        if (m.v.S2 < 219 && m.v.S2 > 178) m.v.PX1[m.v.PL] = -m.v.PX1[m.v.PL];
      } },
    { baris: 810, jalan: function (m) {
        m.locate(m.v.PY[m.v.PL], m.v.PX[m.v.PL]); m.cetak(m.chr(PEMBURU));
      } },
    { baris: 820, jalan: function (m) { m.lanjutkan('PL'); } },
    { baris: 830, jalan: function () { } },
    { baris: 840, jalan: function (m) { m.lompat(570); } },
    { baris: 850, jalan: function () { } },

    /* --- 860-930: mati ---------------------------------------------------- */
    { baris: 860, jalan: function (m) {
        for (m.v.R = 1000; m.v.R >= 400; m.v.R -= 50) { /* SOUND: diam */ }
        for (m.v.R = 1; m.v.R <= 10; m.v.R++) m.v['A$'] = m.inkey();
      } },
    { baris: 870, jalan: function (m) {
        m.v.SL = m.v.SL - 1;
        if (m.v.SL > 0) m.lompat(530);
      } },
    /* 880-920 nisan: sebuah garis tegak digambar dari atas ke bawah lalu
       dihapus lagi, diiringi nada yang menurun. */
    { baris: 880, bagian: [
        function (m) {
          m.warna(4, null); m.cls();
          m.v.EX = 20; m.v.HX = 20; m.v.S = 2550;
        },
        function (m) { m.untuk('HY', 1, 25, 1, 900); }
      ] },
    { baris: 890, jalan: function (m) {
        m.locate(m.v.HY, m.v.HX); m.cetak(m.chr(DATAR));
        m.v.S = m.v.S - 50;
        m.locate(m.v.HY, m.v.HX); m.cetak(m.chr(TEGAK));
      } },
    { baris: 900, bagian: [
        function (m) { m.lanjutkan('HY'); },
        function (m) { m.untuk('EY', 1, 25, 1, 920); }
      ] },
    { baris: 910, bagian: [
        function (m) {
          m.locate(m.v.EY, m.v.EX); m.cetak(' ');
          m.v.S = m.v.S - 25;
        },
        function (m) { m.lanjutkan('EY'); }
      ] },
    { baris: 920, jalan: function (m) {
        for (m.v.W = 1; m.v.W <= 2500; m.v.W++) { /* jeda */ }
      } },
    /* 930 kembali ke 500 — dan baris 510 MENYETEL ULANG DL, L, SL, dan P.
       Jadi seluruh kemajuan hilang, dan permainan ini tidak punya cara
       menyimpan skor tertinggi maupun tingkat kesulitan yang tercapai. */
    { baris: 930, jalan: function (m) { m.lompat(500); } },
    { baris: 940, jalan: function () { } },

    /* --- 950-970: satu rintangan ------------------------------------------ */
    { baris: 950, jalan: function (m) {
        for (m.v.LP = 5; m.v.LP <= 19; m.v.LP++) {
          m.locate(m.v.LP, Math.round(m.v.PS));
          m.cetak(m.chr(TEGAK) + m.ulang(9, LOMPAT_KANAN) + m.chr(TEGAK));
        }
      } },
    { baris: 960, jalan: function (m) {
        m.locate(12, Math.round(m.v.PS));
        m.cetak(m.chr(SILANG) + m.ulang(9, DATAR) + m.chr(SILANG));
      } },
    { baris: 970, jalan: function (m) {
        m.v.PS = m.v.PS + 5; m.kembali();
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  /* 580-610 keempatnya berbentuk sama: kalau tombolnya ditekan DAN arahnya
     bukan kebalikan arah sekarang, belokkan — dan gambar aksara SIKU yang
     mencatat belokan itu di layar, supaya ekornya bisa membacanya nanti. */
  function belok(nomor, tombol, sumbu, nilai, sikuA, sikuB, lawan) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.A !== tombol || m.v[sumbu] === nilai) return;
      m.v[sumbu] = nilai;
      m.locate(m.v.HY, m.v.HX);
      if (m.v[lawan] === 1) {
        m.cetak(m.chr(sikuA)); m.v[lawan] = 0;
      } else {
        m.cetak(m.chr(sikuB)); m.v[lawan] = 0; m.lompat(620);
      }
    } };
  }

  /* 710-740 keempatnya: kalau aksara di bawah ekor sebuah siku, arah ekor
     dibelokkan sesuai bentuknya. Dua kemungkinan per siku, karena ular bisa
     melewatinya dari dua arah. */
  function ekorBelok(nomor, siku, sA, ujiA, jadiA, jadiB, sB, ujiB, jadiC, jadiD) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.S !== siku) return;
      if (m.v[sA] === ujiA) {
        m.v[sA] = jadiA; m.v[sB] = jadiB; m.v.EY += m.v.Y2;
      } else if (m.v[sB] === ujiB) {
        m.v[sB] = jadiC; m.v[sA] = jadiD; m.v.EX += m.v.X2;
      }
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['SERPENT'] = {
    nama: 'SERPENT',
    judul: 'Serpent (ular yang keadaannya disimpan di layar)',
    sumber: 'SERPENT',
    berkas: 'run/SERPENT.BAS',
    tabel: tabel,
    benih: 11,

    arsitektur: {
      judul: 'Alur SERPENT.BAS',
      simpul: [
        { id: 'judul', baris: '10-160', jenis: 'mulai',
          teks: ['Layar judul IBM,', 'tunggu spasi atau ESC'] },
        { id: 'siap', baris: '500-530',
          teks: ['Setel nyawa, panjang,', 'rintangan, dua pemburu'] },
        { id: 'lapang', baris: '540-560',
          teks: ['Gambar rintangan,', 'dinding, lima apel'] },
        { id: 'arah', baris: '570-610', jenis: 'putusan',
          teks: ['Baca angka arah,', 'gambar siku kalau berbelok'] },
        { id: 'maju', baris: '620-630', jenis: 'putusan',
          teks: ['Majukan kepala,', 'BACA LAYAR: menabrak?'] },
        { id: 'apel', baris: '640',
          teks: ['Apel: skor +10,', 'ular memanjang'] },
        { id: 'ekor', baris: '690-740',
          teks: ['Ekor MEMBACA aksara', 'di petaknya, lalu belok'] },
        { id: 'buru', baris: '750-820',
          teks: ['Pemburu memantul,', 'juga dengan membaca layar'] },
        { id: 'mati', baris: '860-930', jenis: 'galat',
          teks: ['Nyawa berkurang;', 'habis: nisan, lalu ULANG SEMUA'] }
      ],
      panah: [
        { dari: 'judul', ke: 'siap' },
        { dari: 'siap', ke: 'lapang' },
        { dari: 'lapang', ke: 'arah' },
        { dari: 'arah', ke: 'maju' },
        { dari: 'maju', ke: 'mati', label: 'menabrak', jenis: 'galat' },
        { dari: 'maju', ke: 'apel', label: 'petak kosong / apel' },
        { dari: 'apel', ke: 'ekor', label: 'sudah cukup panjang' },
        { dari: 'apel', ke: 'lapang', label: 'lima apel: naik tingkat' },
        { dari: 'ekor', ke: 'buru' },
        { dari: 'buru', ke: 'arah' },
        { dari: 'mati', ke: 'lapang', label: 'masih ada nyawa' },
        { dari: 'mati', ke: 'siap', label: 'nyawa habis' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Keadaan satu petak tubuh ular',
        keterangan: 'Aksara di layar bukan <i>gambar</i> tubuhnya &mdash; ' +
          'aksara <b>itulah</b> tubuhnya. Bentuknya menyimpan arah, dan ekor ' +
          'membacanya kembali beberapa langkah kemudian. Satu petak melewati ' +
          'keadaan-keadaan ini tanpa satu pun variabel yang mencatatnya.',
        simpul: [
          { id: 'kosong', baris: '690', jenis: 'mulai',
            teks: ['Kosong', '(spasi)'] },
          { id: 'lurus', baris: '570', jenis: 'keadaan',
            teks: ['Badan lurus', '─ 196  atau  │ 179'] },
          { id: 'siku', baris: '580-610', jenis: 'keadaan',
            teks: ['Badan berbelok', '┌ ┐ └ ┘  218 191 192 217'] },
          { id: 'tabrak', baris: '630', jenis: 'galat',
            teks: ['Kepala masuk lagi:', 'kode 179-218 = mati'] }
        ],
        panah: [
          { dari: 'kosong', ke: 'lurus', label: 'kepala lewat lurus' },
          { dari: 'kosong', ke: 'siku', label: 'kepala berbelok di sini' },
          { dari: 'lurus', ke: 'kosong', label: 'ekor baca 179/196: maju lurus, hapus' },
          { dari: 'siku', ke: 'kosong', label: 'ekor baca siku: BELOK, hapus' },
          { dari: 'lurus', ke: 'tabrak' },
          { dari: 'siku', ke: 'tabrak' }
        ]
      }
    ],

    pseudokode: [
      { baris: 530, tingkat: 0, teks: 'kepala di (1,1) menuju kanan; ekor di (1,1) juga' },
      { baris: 570, tingkat: 0, teks: '<b>ULANG:</b> <code>A = VAL(INKEY$)</code> &mdash; 8 atas, 2 bawah, 4 kiri, 6 kanan' },
      { baris: 580, tingkat: 1, teks: 'kalau berbelok: gambar <b>aksara siku</b> yang mencatat belokannya' },
      { baris: 620, tingkat: 1, teks: 'majukan kepala; keluar lapangan &rarr; mati' },
      { baris: 630, tingkat: 1, teks: '<code>S = SCREEN(HY,HX)</code> &mdash; <b>baca layar</b>; kode 179&ndash;218 berarti menabrak' },
      { baris: 640, tingkat: 1, teks: 'kode 148 = apel: skor +10, <code>L</code> naik satu' },
      { baris: 660, tingkat: 1, teks: 'gambar badan: <code>│</code> kalau bergerak mendatar, <code>─</code> kalau menegak' },
      { baris: 670, tingkat: 1, teks: 'belum sepanjang <code>L</code>? ekor diam &mdash; <b>itulah cara ular memanjang</b>' },
      { baris: 690, tingkat: 1, teks: 'ekor <b>membaca aksara di petaknya sendiri</b>, hapus, lalu&hellip;' },
      { baris: 710, tingkat: 2, teks: '&hellip;dari <b>bentuk</b> aksaranya, simpulkan harus belok ke mana' },
      { baris: 750, tingkat: 1, teks: 'pemburu bergerak; memantul kalau layar di depannya berisi aksara kotak' }
    ],

    perintahAsli: 'run\\SERPENT.bat',
    catatanAsli: 'Di DOSBox-X lapangannya 40 kolom penuh layar, ada bunyi, ' +
      'dan arah dikemudikan dengan angka 8/2/4/6 di papan angka.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru.</b> Ini penyimpangan terbesar ' +
      'di berkas ini: lapangan aslinya 40&times;25 memenuhi layar, di sini ia ' +
      'menempati separuh kiri konsol 80 kolom. Batas geraknya tetap 40 kolom ' +
      'karena diperiksa program sendiri di baris 620, jadi permainannya ' +
      'berjalan benar &mdash; cuma terlihat sempit.',

      '<b><code>SOUND</code> dan <code>BEEP</code> diam</b>, jadi nada ' +
      'menurun saat mati dan bunyi saat memakan apel tidak terdengar.',

      '<b><code>COLOR ,,n</code> tidak ada padanannya.</b> Argumen ketiga ' +
      '<code>COLOR</code> di layar teks mengatur warna BINGKAI di luar ' +
      'daerah 80&times;25 &mdash; sesuatu yang cuma ada di perangkat keras ' +
      'CGA. Baris 860 memakainya untuk mengedipkan bingkai saat ular mati.',

      '<b><code>INPUT$(1)</code> ditiru dengan penungguan satu tombol</b> ' +
      '(baris 520), dan <b><code>LOAD"MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN"MENU"</code></b> &mdash; keduanya memuat lalu menjalankan.',

      '<b>Gelung tunda habis seketika</b>, jadi jeda sesudah nisan di baris ' +
      '920 tidak terasa.',

      '<b><code>LOCATE</code> penelusur menjepit nilainya ke dalam layar</b>, ' +
      'sedangkan GW-BASIC melempar galat "Illegal function call" untuk ' +
      '<code>LOCATE 0,0</code>. Bedanya terasa persis di satu tempat: ' +
      'pemburu ketiga (lihat "Yang jangan ditiru"). Di GW-BASIC permainannya ' +
      'berhenti dengan galat; di sini ia berjalan terus dengan pemburu yang ' +
      'diam di pojok.',

      '<b><code>POKE 1047,32</code> tidak ditiru.</b> Alamat itu menyimpan ' +
      'bendera papan tombol BIOS; menulis 32 ke sana mematikan Caps Lock, ' +
      'Num Lock, dan Scroll Lock sekaligus &mdash; supaya tombol angka arahnya ' +
      'terbaca sebagai angka. Penelusur tidak punya bendera itu.'
    ],

    pelajaran: {
      ringkas: 'Ular yang tidak menyimpan tubuhnya di larik mana pun. Layar ' +
        'itu sendiri strukturnya, dan bentuk aksara kotak menyimpan arah.',
      pelajari: [
        ['Layar sebagai struktur data',
         'Tidak ada larik tubuh ular di seluruh program. Yang ada dua pasang ' +
         'koordinat &mdash; kepala dan ekor &mdash; dan <code>SCREEN(y,x)</code> ' +
         'yang membaca kembali apa yang tercetak. <b>Yang terlihat dan yang ' +
         'diketahui program adalah hal yang sama persis</b>, jadi keduanya ' +
         'tidak mungkin tidak sinkron. Harganya: layar tidak bisa dipakai ' +
         'untuk apa pun yang lain, dan permainan ini tidak bisa dipindah ke ' +
         'jenis tampilan lain tanpa ditulis ulang.'],
        ['Bentuk aksara yang menyimpan arah',
         'Kepala menggambar <code>─</code> atau <code>│</code> waktu lurus, ' +
         'dan <code>┌ ┐ └ ┘</code> waktu berbelok. Waktu ekor sampai di petak ' +
         'itu, ia membaca aksaranya dan tahu harus belok ke mana. ' +
         '<b>Datanya adalah gambarnya.</b> Gagasan yang sama dipakai peta ' +
         'labirin di MAZE.BAS, tapi di sana petanya tidak berubah; di sini ' +
         'ia ditulis dan dihapus setiap langkah.'],
        ['Memanjang tanpa menyisipkan apa pun',
         'Baris 670: selama <code>LE</code> masih lebih dari satu, ekornya ' +
         'tidak dijalankan sama sekali &mdash; cuma dikurangi. Ular memanjang ' +
         'karena <b>kepalanya jalan dan ekornya belum mulai</b>. Tidak ada ' +
         'antrean yang perlu disisipi, tidak ada penggeseran larik.'],
        ['Rentang kode sebagai uji tabrakan',
         'Baris 630 memeriksa <code>S&lt;219 AND S&gt;178</code>. Semua aksara ' +
         'kotak CP437 berada di rentang itu, dan tidak ada yang lain. Jadi ' +
         'satu perbandingan rentang menggantikan seluruh daftar "apa saja ' +
         'yang padat" &mdash; karena tata letak tabel aksaranya sendiri sudah ' +
         'mengelompokkannya.']
      ],
      hindari: [
        ['Apel yang bisa jatuh di atas ular',
         'Baris 560 menaruh lima apel di tempat acak <b>tanpa memeriksa</b> ' +
         'apakah petaknya kosong. Apel bisa mendarat di atas tubuh ular, di ' +
         'atas rintangan, atau di atas apel lain &mdash; dan yang tertimpa ' +
         'hilang begitu saja. Menambah satu <code>IF SCREEN(y,x)&lt;&gt;32 ' +
         'THEN ulangi</code> sudah cukup.'],
        ['Semua kemajuan hilang saat nyawa habis',
         'Baris 930 kembali ke 500, dan baris 510 menyetel ulang ' +
         '<code>DL</code>, <code>L</code>, <code>SL</code>, dan <code>P</code>. ' +
         'Tingkat kesulitan yang sudah dicapai, panjang ular, jumlah pemburu ' +
         '&mdash; semuanya kembali ke awal. Dan <code>SC</code>, skornya, ' +
         '<b>tidak</b> disetel ulang, jadi skor lama ikut terbawa ke permainan ' +
         'baru.'],
        ['Pemburu ketiga yang tidak pernah ditaruh di mana pun',
         'Baris 530 menyiapkan posisi dan arah untuk <b>dua</b> pemburu: ' +
         '<code>PX(1),PY(1)</code> dan <code>PX(2),PY(2)</code>. Tapi ' +
         '<code>P</code> bertambah satu setiap dua puluh lima apel dan tidak ' +
         'punya batas atas. Begitu <code>P</code> mencapai <b>3</b>, gelung di ' +
         'baris 750 membaca <code>PX(3)</code> dan <code>PY(3)</code> yang ' +
         'nilainya <b>nol</b> &mdash; lalu baris 760 menjalankan ' +
         '<code>LOCATE 0,0</code>, yang di GW-BASIC adalah galat ' +
         '"Illegal function call" dan <b>menghentikan permainan</b>. ' +
         'Arahnya pun nol, jadi pemburu itu tidak akan bergerak sama sekali ' +
         'seandainya tidak menabrak galat lebih dulu.'],
        ['Rentang nomor baris yang dipesan lalu dilupakan',
         'Baris 160 berbunyi <code>REM TRANSFER COMMAND</code> dan nomor ' +
         'berikutnya adalah 500. Tiga ratus empat puluh nomor kosong, ' +
         'disediakan untuk sesuatu yang tidak pernah ditulis.'],
        ['Satu baris, delapan belas penugasan',
         'Baris 530 menyetel seluruh keadaan awal satu nyawa dalam satu baris. ' +
         'Ia benar, tapi untuk mengetahui apa yang disetel ulang saat mati ' +
         'dan apa yang tidak, satu-satunya cara adalah membaca baris sepanjang ' +
         'dua ratus aksara itu sampai habis.']
      ]
    },

    penjelasan: [
      { judul: 'Ular tanpa larik',
        isi: [
          'Cara biasa menulis permainan ular: simpan tubuhnya sebagai antrean ' +
          'koordinat. Tiap langkah, tambahkan petak baru di depan dan buang ' +
          'satu di belakang. Untuk menggambar, jalani antreannya.',
          'SERPENT.BAS tidak melakukan satu pun dari itu. Yang disimpannya ' +
          'cuma empat angka: <code>HX,HY</code> kepala dan <code>EX,EY</code> ' +
          'ekor. Tubuhnya <b>ada di layar</b>, dan tidak ada salinannya di ' +
          'mana pun.',
          'Yang membuatnya bisa bekerja: aksara kotak CP437 <b>menyimpan ' +
          'arah</b>. Waktu kepala berjalan lurus mendatar ia menggambar ' +
          '<code>│</code>; menegak, <code>─</code>. Waktu berbelok, ia ' +
          'menggambar siku yang sesuai: <code>┌</code>, <code>┐</code>, ' +
          '<code>└</code>, atau <code>┘</code>.',
          'Beberapa langkah kemudian, ekor tiba di petak itu. Baris 690 ' +
          'membacanya kembali:',
          '<code>690 S=SCREEN(EY,EX):LOCATE EY,EX:PRINT " ";</code>',
          'Lalu baris 700&ndash;740 menerjemahkan bentuknya jadi arah. Kalau ' +
          '<code>│</code>, teruskan menegak. Kalau <code>┐</code> dan ekornya ' +
          'sedang ke kanan, belok ke bawah. Dan seterusnya, delapan ' +
          'kemungkinan untuk empat siku &mdash; karena tiap siku bisa dilewati ' +
          'dari dua arah.',
          'Hasilnya ekor yang menyusuri jalur yang persis sama dengan yang ' +
          'pernah ditempuh kepalanya, <b>tanpa ada yang mengingat jalur itu</b>.'
        ] },
      { judul: 'Kenapa ini indah, dan kenapa tidak akan ditulis lagi',
        isi: [
          'Keunggulannya nyata. Tidak ada larik yang bisa kepenuhan. Tidak ada ' +
          'kemungkinan gambar dan data berbeda &mdash; keduanya benda yang ' +
          'sama. Tabrakan cuma satu pembacaan. Dan seluruhnya muat di memori ' +
          'yang, pada 1982, diukur dalam kilobita.',
          'Kelemahannya sama nyatanya. Layar tidak bisa dipakai untuk apa pun ' +
          'yang lain &mdash; papan skor di baris 640 harus ditaruh di baris ' +
          '25, di luar lapangan, karena satu aksara nyasar di dalam lapangan ' +
          'akan dibaca sebagai tubuh ular. Warna tidak boleh membedakan apa ' +
          'pun, karena yang dibaca cuma kode aksaranya. Dan permainan ini ' +
          'tidak bisa dipindah ke tampilan grafik sama sekali tanpa ditulis ' +
          'ulang dari nol.',
          'Yang hilang bukan cuma kelenturan, melainkan <b>batas</b>. Di sini ' +
          'tidak ada garis pemisah antara "keadaan permainan" dan "tampilan ' +
          'permainan" &mdash; dan justru batas itulah yang membuat sebuah ' +
          'program bisa diuji, dipindah, dan diubah tanpa dipahami seluruhnya ' +
          'lebih dulu.',
          'Tapi ada satu hal yang layak dibawa pulang. Di sini, keadaan yang ' +
          'ditampilkan dan keadaan yang dipakai berpikir <b>tidak mungkin ' +
          'berselisih</b>, karena ia satu benda. Setiap kali sebuah antarmuka ' +
          'modern memperlihatkan angka yang berbeda dari angka yang sebenarnya ' +
          'dipakai, yang hilang adalah jaminan yang program 1982 ini dapatkan ' +
          'secara gratis.'
        ] }
    ]
  };
})(window);
