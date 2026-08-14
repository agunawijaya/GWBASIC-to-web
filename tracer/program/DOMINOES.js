/* ===========================================================================
   DOMINOES.js — porting minimalis DOMINOES.BAS sebagai tabel baris.

   Program kedua puluh tiga: domino "Five-Up" dengan satu spinner. Papan
   berbentuk salib — spinner di tengah, empat lengan ke kiri, kanan, atas, dan
   bawah — dan angka hanya didapat kalau jumlah SELURUH ujung terbuka habis
   dibagi lima.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) MATA DADU DIGAMBAR DENGAN TITIK DAN TITIK DUA. Baris 2130:
       "   ", " . ", ". .", "...", ": :", ":.:", ":::" — tiga aksara yang
       memuat tujuh nilai, karena ":" sudah dua titik bertumpuk.

   (2) SELURUH PAPAN CUMA LIMA STRING. `TBL$(0..3)` empat lengan, `TBL$(4)`
       spinner-nya. Tiap string dua aksara. Dua puluh delapan kartu domino,
       papan salib, dan seluruh keadaan permainannya muat dalam sepuluh huruf.

   (3) OTAK KOMPUTERNYA MENCOBA SEMUA LANGKAH LALU MEMBATALKANNYA. Baris
       1150-1230: simpan papan, taruh kartunya, hitung nilainya, KEMBALIKAN
       papan. Yang diingat cuma langkah terbaik. Pola coba-dan-batalkan,
       ditulis dengan dua gelung penyalin larik.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` tidak ada di program ini sama sekali.
   - Pengacaknya berbenih tetap, jadi susunan kartunya selalu sama.
   - `COLOR 26` dan `COLOR 28` (baris 620 dan 160) berarti berkedip; kedipnya
     tidak ditiru, jadi penunjuk pilihannya tampil diam.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    { baris: 10, jalan: function (m) { m.warna(3, 0); } },
    { baris: 20, jalan: function (m) {
        m.v.YSCR = 0; m.v.MYSCR = 0; m.v.XLIN = 1; m.v.XPOS = 1;
        m.pasangJebakan(10, 3280); m.jebakan(10, true);
        m.v.JAM = 23;
        /* BASIC memberi nol pada tiap variabel angka sebelum dipakai. */
        m.v.PLAYED = 0; m.v.NOPLAY = 0; m.v.PLNO = 0; m.v.CONO = 0;
        m.v.HOLDY = 0; m.v.INVD = 0; m.v.EMPT = 0; m.v.PL1 = 0;
        m.v.FSTTME = 0; m.v.NOSPR = 0; m.v.ONEROW = 0; m.v.PLA = 0;
        m.v.DD = 0; m.v.DRH = 0; m.v.GAME = 0;
      } },
    { baris: 30, bagian: [
        function (m) { m.gosub(3010); },   /* judul + petunjuk */
        function (m) { m.gosub(3430); },   /* pilih target skor */
        function (m) { m.gosub(2120); }    /* kocok dan bagikan */
      ] },
    { baris: 40, bagian: [
        function (m) { m.v.XLIN = 1; m.v.XPOS = 1; },
        function (m) { m.gosub(3330); },
        function (m) { m.v.FSTTME = 1; m.v.NOSPR = 1; m.v.PLAYED = 1; }
      ] },
    { baris: 50, bagian: [
        function (m) { m.v.PL1 = 1; },
        function (m) { m.gosub(2680); },   /* gambar tangan pemain */
        function (m) { m.gosub(570); },    /* pilih kartu          */
        function (m) { m.gosub(140); },    /* pilih arah           */
        function (m) { m.gosub(260); }     /* coba taruh           */
      ] },
    { baris: 60, bagian: [
        function (m) { if (m.v.INVD) m.gosub(2050); else m.v.NOPLAY = 0; },
        function (m) { if (m.v.INVD) m.lompat(50); }
      ] },
    { baris: 70, bagian: [
        function (m) { m.gosub(1240); },
        function (m) { m.gosub(1550); },
        function (m) {
          m.v.YSCR = m.v.YSCR + m.v.HOLDY; m.v.PL1 = 0;
          if (m.v.PLNO === 0) m.lompat(3590);
        }
      ] },
    { baris: 80, bagian: [
        function (m) { m.gosub(3800); },
        function (m) {
          m.locate(3, 1); m.cetak('One Moment Please'); m.barisBaru();
          m.cetak('I am Thinking'); m.barisBaru();
        }
      ] },
    { baris: 90, bagian: [
        function (m) { m.gosub(750); },
        function (m) { if (m.v.INVD) m.gosub(1320); },
        function (m) { if (m.v.INVD && m.v.EMPT) m.gosub(3530); },
        function (m) { if (m.v.INVD && m.v.EMPT) m.lompat(50); }
      ] },
    { baris: 100, jalan: function (m) {
        if (m.v.INVD) {
          m.v.CONO = m.v.CONO + 1;
          m.v['MY$'][m.v.CONO] = m.v['NEXTBN$'];
          m.lompat(90);
        } else m.v.NOPLAY = 0;
      } },
    { baris: 110, bagian: [
        function (m) { m.gosub(1280); },
        function (m) { m.gosub(1550); },
        function (m) {
          m.v.MYSCR = m.v.MYSCR + m.v.HOLDY;
          if (m.v.CONO === 0) m.lompat(3590);
        }
      ] },
    { baris: 120, jalan: function (m) {
        m.warna(4, 0); m.locate(1, 66);
        m.cetak('Dominoes Played'); m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 130, bagian: [
        function (m) {
          m.locate(4, 1);
          for (m.v.A = 1; m.v.A <= m.v.CONO; m.v.A++) {
            m.cetak(m.ulang(2, 220)); m.barisBaru();
          }
        },
        function (m) { m.gosub(3800); },
        function (m) { m.lompat(50); }
      ] },

    /* --- 140-250: memilih arah dengan penunjuk yang menimpa layar --------- */
    { baris: 140, jalan: function (m) {
        m.v.DLN = 15; m.v.DOM = 40; m.v.DD = 2;
        if (m.v.FSTTME) m.kembali();
      } },
    { baris: 150, jalan: function (m) { if (m.inkey() !== '') m.lompat(150); } },
    /* 160 SIMPAN-DI-BAWAH lagi: aksara yang akan ditimpa dibaca dengan
       SCREEN(), penunjuknya dicetak di atasnya, dan baris 230 memulihkannya.
       Sama seperti bom di SUB.BAS. */
    { baris: 160, jalan: function (m) {
        m.locate(m.v.DLN, m.v.DOM, 0);
        m.v.SAVE1 = m.layarAksara(m.v.DLN, m.v.DOM);
        m.warna(28, null); m.cetak(m.chr(1)); m.warna(6, null);
      } },
    { baris: 170, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(170);
      } },
    { baris: 180, jalan: function (m) {
        m.v.Z1 = (m.v.Z.length > 1) ? m.v.Z.slice(-1) : '';
      } },
    arah(190, '8', 'H', 5, 40, 0),
    arah(200, '6', 'M', 10, 55, 1),
    arah(210, '2', 'P', 15, 40, 2),
    arah(220, '4', 'K', 10, 25, 3),
    { baris: 230, jalan: function (m) {
        m.locate(m.barisKursor(), m.pos() - 1);
        m.cetak(m.chr(m.v.SAVE1));
      } },
    { baris: 240, jalan: function (m) {
        if (m.v.Z !== m.chr(13)) m.lompat(160);
      } },
    { baris: 250, jalan: function (m) {
        m.locate(m.barisKursor(), m.pos() - 1);
        m.cetak(m.chr(m.v.SAVE1));
        m.kembali();
      } },

    /* --- 260-560: apakah langkah pemain sah? ------------------------------ */
    { baris: 260, jalan: function (m) { m.v.INVD = 0; m.v.OS = 0; m.v.IS = 0; } },
    { baris: 270, jalan: function (m) { if (m.v.FSTTME) m.lompat(560); } },
    { baris: 280, jalan: function (m) {
        if (m.v['TBL$'][m.v.DD] === '  ') m.lompat(360);
      } },
    { baris: 290, jalan: function (m) {
        m.v.ZL = m.v['TBL$'][m.v.DD].charAt(0);
        m.v.ZLP = m.v['YOU$'][m.v.PLA].charAt(0);
        m.v.ZRP = m.v['YOU$'][m.v.PLA].slice(-1);
      } },
    { baris: 300, jalan: function (m) {
        if (m.v.ZL === m.v.ZLP) { m.v.IS = 1; m.lompat(330); }
      } },
    { baris: 310, jalan: function (m) {
        if (m.v.ZL === m.v.ZRP) { m.v.OS = 1; m.lompat(330); }
      } },
    { baris: 320, jalan: function (m) { m.v.INVD = 1; m.kembali(); } },
    { baris: 330, jalan: function (m) { m.v.INVD = 0; } },
    { baris: 340, jalan: function (m) {
        if (m.v.OS) { m.v['TBL$'][m.v.DD] = m.v.ZLP + m.v.ZRP; m.lompat(470); }
      } },
    { baris: 350, jalan: function (m) {
        if (m.v.IS) { m.v['TBL$'][m.v.DD] = m.v.ZRP + m.v.ZLP; m.lompat(470); }
      } },
    { baris: 360, jalan: function (m) {
        m.v.ZL = m.v['TBL$'][4].charAt(0);
        m.v.ZR = m.v['TBL$'][4].slice(-1);
      } },
    { baris: 370, jalan: function (m) {
        m.v.ZLP = m.v['YOU$'][m.v.PLA].charAt(0);
        m.v.ZRP = m.v['YOU$'][m.v.PLA].slice(-1);
      } },
    { baris: 380, jalan: function (m) { if (m.v.ZL === m.v.ZR) m.lompat(440); } },
    cocokArah(390, 0, 'ZL', 'ZLP', 'IS'),
    cocokArah(400, 0, 'ZL', 'ZRP', 'OS'),
    cocokArah(410, 2, 'ZR', 'ZLP', 'IS'),
    cocokArah(420, 2, 'ZR', 'ZRP', 'OS'),
    { baris: 430, jalan: function (m) { m.lompat(320); } },
    { baris: 440, jalan: function (m) {
        if (m.v.ZL === m.v.ZLP) { m.v.IS = 1; m.lompat(490); }
      } },
    { baris: 450, jalan: function (m) {
        if (m.v.ZL === m.v.ZRP) { m.v.OS = 1; m.lompat(490); }
      } },
    { baris: 460, jalan: function (m) { m.lompat(320); } },
    { baris: 470, jalan: function (m) { m.v['CUR$'] = m.v['TBL$'][m.v.DD]; } },
    { baris: 480, bagian: [
        function (m) { m.gosub(2330); },
        function (m) { m.v.PLNO = m.v.PLNO - 1; m.kembali(); }
      ] },
    /* 490 memakai `A` — pencacah gelung yang sudah selesai jauh sebelumnya.
       Nilainya apa pun yang tertinggal, dan syaratnya jadi tidak bisa
       diramalkan. Salah satu bug tertua dalam BASIC: variabel bersama. */
    { baris: 490, jalan: function (m) {
        if (m.v['TBL$'][4].charAt(0) !== m.v['TBL$'][m.v.A].slice(-1)) m.lompat(540);
      } },
    ganti(500, 1, 2, 1, 2), ganti(510, 3, 2, 3, 2),
    ganti(520, 1, 0, 1, 0), ganti(530, 3, 0, 3, 0, true),
    { baris: 540, jalan: function (m) {
        if (m.v.OS) {
          m.v['TBL$'][m.v.DD] = m.v['YOU$'][m.v.PLA]; m.lompat(470);
        }
      } },
    { baris: 550, jalan: function (m) {
        if (m.v.IS) {
          m.v['TBL$'][m.v.DD] = m.v.ZRP + m.v.ZLP; m.lompat(470);
        }
      } },
    { baris: 560, jalan: function (m) {
        m.v['TBL$'][4] = m.v['YOU$'][m.v.PLA];
        m.v['CUR$'] = m.v['TBL$'][4];
        m.lompat(480);
      } },

    /* --- 570-740: memilih kartu dari tangan ------------------------------- */
    { baris: 570, jalan: function (m) { m.gosub(1760); } },
    { baris: 580, jalan: function (m) {
        m.v.PLA = Math.floor(m.v.PLNO / 2 + 0.5); m.v.DLN = 19;
      } },
    { baris: 590, jalan: function (m) {
        m.v.DOM = (m.v.PLNO & 1) ? 40 : 35;
      } },
    { baris: 600, jalan: function (m) {
        if (m.v.PLNO > 8) { m.v.DOM = 35; m.v.PLA = 4; }
      } },
    { baris: 610, jalan: function (m) { if (m.inkey() !== '') m.lompat(610); } },
    { baris: 620, jalan: function (m) {
        m.locate(m.v.DLN, m.v.DOM, 0);
        m.v.SAVE1 = m.layarAksara(m.v.DLN, m.v.DOM);
        m.warna(26, null); m.cetak(m.chr(1)); m.warna(14, null);
      } },
    { baris: 630, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(630);
      } },
    { baris: 640, jalan: function (m) {
        m.v.Z1 = (m.v.Z.length > 1) ? m.v.Z.slice(-1) : '';
      } },
    { baris: 650, jalan: function (m) {
        if (m.v.Z === '4' || m.v.Z1 === 'K') {
          m.v.DOM = m.v.DOM - 10; m.v.PLA = m.v.PLA - 1; m.lompat(690);
        }
      } },
    { baris: 660, jalan: function (m) {
        if (m.v.Z === '6' || m.v.Z1 === 'M') {
          m.v.DOM = m.v.DOM + 10; m.v.PLA = m.v.PLA + 1; m.lompat(690);
        }
      } },
    { baris: 670, jalan: function (m) {
        if (m.v.Z !== m.chr(13)) m.lompat(630);
      } },
    { baris: 680, jalan: function (m) {
        m.locate(m.barisKursor(), m.pos() - 1);
        m.cetak(m.chr(m.v.SAVE1));
        m.kembali();
      } },
    { baris: 690, jalan: function (m) {
        if (m.v.PLA === 0) { m.v.PLA = 1; m.v.DOM = m.v.DOM + 10; m.lompat(740); }
      } },
    { baris: 700, jalan: function (m) {
        if (m.v.PLA > m.v.PLNO) {
          m.v.PLA = m.v.PLNO; m.v.DOM = m.v.DOM - 10; m.lompat(740);
        }
      } },
    { baris: 710, jalan: function (m) { if (m.v.ONEROW) m.lompat(740); } },
    { baris: 720, jalan: function (m) {
        if (m.v.DOM > 80) { m.v.DOM = m.v.DOM - 80; m.v.DLN = m.v.DLN + 3; m.lompat(740); }
      } },
    { baris: 730, jalan: function (m) {
        if (m.v.DOM < 0) { m.v.DOM = m.v.DOM + 80; m.v.DLN = m.v.DLN - 3; m.lompat(740); }
      } },
    { baris: 740, jalan: function (m) {
        m.locate(m.barisKursor(), m.pos() - 1);
        m.cetak(m.chr(m.v.SAVE1));
        m.lompat(620);
      } },

    /* --- 750-1230: otak komputer ------------------------------------------
       Dua gelung bersarang mencoba TIAP kartu di TIAP arah. Tiap kemungkinan
       yang sah dinilai lewat GOSUB 1150, yang menaruh kartunya, menghitung
       skornya, lalu MENGEMBALIKAN papan seperti semula. */
    { baris: 750, jalan: function (m) {
        m.v.IS = 0; m.v.OS = 0; m.v.INVD = 0; m.v.PLFG = 0;
        m.v.HOLD = 0; m.v.HH1 = 0; m.v.HH2 = 0;
      } },
    { baris: 760, jalan: function (m) { m.untuk('DD', 3, 0, -1, 970); } },
    { baris: 770, jalan: function (m) { m.untuk('PLA', 1, m.v.CONO, 1, 960); } },
    { baris: 780, jalan: function (m) {
        m.v.ZLM = m.v['TBL$'][4].charAt(0);
        m.v.ZRM = m.v['TBL$'][4].slice(-1);
      } },
    { baris: 790, jalan: function (m) {
        m.v.ZL = m.v['TBL$'][m.v.DD].charAt(0);
        m.v.ZLP = m.v['MY$'][m.v.PLA].charAt(0);
        m.v.ZRP = m.v['MY$'][m.v.PLA].slice(-1);
      } },
    { baris: 800, jalan: function (m) {
        if (m.v['TBL$'][m.v.DD] === '  ') m.lompat(830);
      } },
    uji(810, 'ZL', 'ZRP', null, 'OS'),
    { baris: 820, bagian: [
        function (m) {
          m.v.__ = (m.v.ZL === m.v.ZLP);
          if (m.v.__) { m.v.IS = 1; m.gosub(1150); }
        },
        function (m) { m.lompat(960); }
      ] },
    { baris: 830, jalan: function (m) { if (m.v.ZLM !== m.v.ZRM) m.lompat(920); } },
    uji(840, 'ZLM', 'ZRP', 0, 'OS'),
    uji(850, 'ZLM', 'ZLP', 0, 'IS'),
    uji(860, 'ZLM', 'ZRP', 2, 'OS'),
    uji(870, 'ZLM', 'ZLP', 2, 'IS'),
    uji(880, 'ZLM', 'ZLP', 1, 'IS'),
    uji(890, 'ZLM', 'ZRP', 1, 'OS'),
    uji(900, 'ZLM', 'ZLP', 3, 'IS'),
    { baris: 910, bagian: [
        function (m) {
          m.v.__ = (m.v.ZLM === m.v.ZRP && m.v.DD === 3);
          if (m.v.__) { m.v.OS = 1; m.gosub(1150); }
        },
        function (m) { m.lompat(960); }
      ] },
    uji(920, 'ZLM', 'ZLP', 0, 'IS'),
    uji(930, 'ZLM', 'ZRP', 0, 'OS'),
    uji(940, 'ZRM', 'ZLP', 2, 'IS'),
    uji(950, 'ZRM', 'ZRP', 2, 'OS'),
    { baris: 960, jalan: function (m) { m.lanjutkan('PLA'); } },
    { baris: 970, jalan: function (m) { m.lanjutkan('DD'); } },
    { baris: 980, jalan: function (m) {
        if (m.v['TBL$'][4].charAt(0) !== m.v['TBL$'][4].slice(-1)) m.lompat(1010);
      } },
    { baris: 990, jalan: function (m) {
        if (m.v['TBL$'][1] === '  ' && m.v['TBL$'][2] === '  ' && m.v.HH1) {
          m.v.HH2 = 2; m.lompat(1010);
        }
      } },
    { baris: 1000, jalan: function (m) {
        if (m.v['TBL$'][1] === '  ' && m.v['TBL$'][2] === '  ' && m.v.PLFG) {
          m.v.DRH = 2; m.lompat(1010);
        }
      } },
    { baris: 1010, jalan: function (m) {
        if (m.v.HH1) { m.v.PLA = m.v.HH1; m.v.DRH = m.v.HH2; m.lompat(1040); }
      } },
    { baris: 1020, jalan: function (m) {
        if (m.v.PLFG) { m.v.PLA = m.v.PLFG; m.lompat(1040); }
      } },
    { baris: 1030, jalan: function (m) { m.v.INVD = 1; m.kembali(); } },
    { baris: 1040, jalan: function (m) {
        m.v.ZLP1 = m.v['MY$'][m.v.PLA].charAt(0);
        m.v.ZRP1 = m.v['MY$'][m.v.PLA].slice(-1);
      } },
    { baris: 1050, jalan: function (m) {
        if (m.v['TBL$'][m.v.DRH] !== '  ') m.lompat(1090);
      } },
    { baris: 1060, jalan: function (m) {
        m.v.ZL1 = m.v['TBL$'][4].charAt(0);
        m.v.ZR1 = m.v['TBL$'][4].slice(-1);
      } },
    { baris: 1070, jalan: function (m) {
        if (m.v.ZL1 === m.v.ZR1) m.lompat(1100);
      } },
    { baris: 1080, jalan: function (m) {
        if (m.v.DRH === 2) { var t = m.v.ZL1; m.v.ZL1 = m.v.ZR1; m.v.ZR1 = t; }
        m.lompat(1100);
      } },
    { baris: 1090, jalan: function (m) {
        m.v.ZL1 = m.v['TBL$'][m.v.DRH].charAt(0);
        m.v.ZR1 = m.v['TBL$'][m.v.DRH].slice(-1);
      } },
    { baris: 1100, jalan: function (m) {
        if (m.v.ZL1 === m.v.ZLP1) { m.v.IS = 1; m.v.OS = 0; m.lompat(1120); }
      } },
    { baris: 1110, jalan: function (m) {
        if (m.v.ZL1 === m.v.ZRP1) { m.v.OS = 1; m.v.IS = 0; m.lompat(1120); }
      } },
    { baris: 1120, jalan: function (m) {
        if (m.v.IS) {
          m.v['TBL$'][m.v.DRH] = m.v.ZRP1 + m.v.ZLP1;
          m.v['CUR$'] = m.v['TBL$'][m.v.DRH];
          m.lompat(1140);
        }
      } },
    { baris: 1130, jalan: function (m) {
        if (m.v.OS) {
          m.v['TBL$'][m.v.DRH] = m.v.ZLP1 + m.v.ZRP1;
          m.v['CUR$'] = m.v['TBL$'][m.v.DRH];
        }
      } },
    { baris: 1140, bagian: [
        function (m) { m.gosub(2330); },
        function (m) {
          m.locate(1, 1); m.v.CONO = m.v.CONO - 1; m.kembali();
        }
      ] },

    /* 1150-1230 COBA-DAN-BATALKAN: papan disalin, kartunya ditaruh, skornya
       dihitung, lalu papan dikembalikan dari salinannya. Yang tersimpan cuma
       nomor kartu dan arah terbaiknya (HH1, HH2). */
    { baris: 1150, jalan: function (m) { m.v.PLFG = m.v.PLA; m.v.DRH = m.v.DD; } },
    { baris: 1160, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 4; m.v.A++) {
          m.v['SAV$'][m.v.A] = m.v['TBL$'][m.v.A];
        }
      } },
    { baris: 1170, jalan: function (m) {
        m.v.ZLP2 = m.v['MY$'][m.v.PLA].charAt(0);
        m.v.ZRP2 = m.v['MY$'][m.v.PLA].slice(-1);
      } },
    { baris: 1180, jalan: function (m) {
        if (m.v.IS) m.v['TBL$'][m.v.DD] = m.v.ZRP2 + m.v.ZLP2;
      } },
    { baris: 1190, jalan: function (m) {
        if (m.v.OS) m.v['TBL$'][m.v.DD] = m.v.ZLP2 + m.v.ZRP2;
      } },
    { baris: 1200, jalan: function (m) { m.gosub(1550); } },
    { baris: 1210, jalan: function (m) {
        if (m.v.HOLDY && m.v.HOLD <= m.v.HOLDY) m.v.HOLD = m.v.HOLDY;
        else m.lompat(1230);
      } },
    { baris: 1220, jalan: function (m) { m.v.HH1 = m.v.PLA; m.v.HH2 = m.v.DD; } },
    { baris: 1230, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 4; m.v.A++) {
          m.v['TBL$'][m.v.A] = m.v['SAV$'][m.v.A];
        }
        m.kembali();
      } },

    /* 1240-1310 membuang kartu dari tangan: geser sisanya satu ke kiri. */
    { baris: 1240, jalan: function (m) { m.untuk('A', 1, m.v.PLNO, 1, 1270); } },
    { baris: 1250, jalan: function (m) { if (m.v.A < m.v.PLA) m.lompat(1270); } },
    { baris: 1260, jalan: function (m) {
        m.v['YOU$'][m.v.A] = m.v['YOU$'][m.v.A + 1] || '  ';
      } },
    { baris: 1270, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.kembali(); }
      ] },
    { baris: 1280, jalan: function (m) { m.untuk('A', 1, m.v.CONO, 1, 1310); } },
    { baris: 1290, jalan: function (m) { if (m.v.A < m.v.PLA) m.lompat(1310); } },
    { baris: 1300, jalan: function (m) {
        m.v['MY$'][m.v.A] = m.v['MY$'][m.v.A + 1] || '  ';
      } },
    { baris: 1310, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.kembali(); }
      ] },
    { baris: 1320, jalan: function (m) {
        if (m.v.BNPTR === 29) { m.v.EMPT = 1; m.kembali(); }
      } },
    { baris: 1330, jalan: function (m) {
        m.v['NEXTBN$'] = m.v['BONE$'][m.v.BNPTR];
        m.v.BNPTR = m.v.BNPTR + 1;
        m.kembali();
      } },

    /* --- 1340-1540: memindahkan spinner ke kartu ganda pertama ------------ */
    { baris: 1340, jalan: function (m) {
        if (m.v.NOSPR) m.lompat(1350); else m.kembali();
      } },
    { baris: 1350, jalan: function (m) {
        if (m.v['TBL$'][4].charAt(0) === m.v['TBL$'][4].slice(-1)) m.lompat(1540);
      } },
    { baris: 1360, jalan: function (m) { m.untuk('A', 0, 3, 1, 1400); } },
    { baris: 1370, jalan: function (m) {
        m.v.ZL = m.v['TBL$'][m.v.A].charAt(0);
        m.v.ZR = m.v['TBL$'][m.v.A].slice(-1);
      } },
    { baris: 1380, jalan: function (m) {
        if (m.v['TBL$'][m.v.A] === '  ') m.lompat(1400);
      } },
    { baris: 1390, jalan: function (m) { if (m.v.ZL === m.v.ZR) m.lompat(1410); } },
    { baris: 1400, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.kembali(); }
      ] },
    { baris: 1410, jalan: function (m) { if (m.v.A !== 0) m.lompat(1450); } },
    { baris: 1420, jalan: function (m) {
        if (m.v['TBL$'][2] !== '  ') {
          m.v['TBL$'][4] = m.v['TBL$'][0]; m.v['TBL$'][0] = '  ';
          m.lompat(1550);
        }
      } },
    { baris: 1430, jalan: function (m) { tukar(m, 2, 4); tukar(m, 0, 4); } },
    { baris: 1440, jalan: function (m) {
        m.v['TBL$'][2] = m.v['TBL$'][2].slice(-1) + m.v['TBL$'][2].charAt(0);
        m.lompat(1550);
      } },
    { baris: 1450, jalan: function (m) { if (m.v.A !== 1) m.lompat(1480); } },
    { baris: 1460, jalan: function (m) {
        if (m.v['TBL$'][3] !== '  ') {
          m.v['TBL$'][4] = m.v['TBL$'][1]; m.v['TBL$'][1] = '  ';
          m.lompat(1550);
        }
      } },
    { baris: 1470, jalan: function (m) {
        tukar(m, 3, 4); tukar(m, 1, 4); m.lompat(1550);
      } },
    { baris: 1480, jalan: function (m) { if (m.v.A !== 2) m.lompat(1510); } },
    { baris: 1490, jalan: function (m) {
        if (m.v['TBL$'][0] !== '  ') {
          m.v['TBL$'][4] = m.v['TBL$'][2]; m.v['TBL$'][2] = '  ';
          m.lompat(1550);
        }
      } },
    { baris: 1500, jalan: function (m) {
        tukar(m, 0, 4); tukar(m, 2, 4); m.lompat(1550);
      } },
    { baris: 1510, jalan: function (m) { if (m.v.A !== 3) m.kembali(); } },
    { baris: 1520, jalan: function (m) {
        if (m.v['TBL$'][1] === '  ') {
          tukar(m, 1, 4); tukar(m, 3, 4); m.lompat(1550);
        }
      } },
    { baris: 1530, jalan: function (m) {
        m.v['TBL$'][4] = m.v['TBL$'][3]; m.v['TBL$'][3] = '  ';
      } },
    { baris: 1540, jalan: function (m) { m.v.NOSPR = 0; m.kembali(); } },

    /* --- 1550-1750: menghitung angka ------------------------------------- */
    { baris: 1550, jalan: function (m) {
        m.v.HOLDY = 0; m.v.FLAG1 = 0; m.v.PTOT = 0;
      } },
    { baris: 1560, jalan: function (m) {
        m.v.PLM = nilai(m.v['TBL$'][4].charAt(0));
        m.v.PRM = nilai(m.v['TBL$'][4].slice(-1));
      } },
    { baris: 1570, jalan: function (m) { if (m.v.FSTTME) m.lompat(1740); } },
    { baris: 1580, jalan: function (m) { m.untuk('A', 0, 3, 1, 1720); } },
    { baris: 1590, jalan: function (m) {
        m.v.PL = nilai(m.v['TBL$'][m.v.A].charAt(0));
        m.v.PR = nilai(m.v['TBL$'][m.v.A].slice(-1));
      } },
    { baris: 1600, jalan: function (m) {
        if (m.v['TBL$'][m.v.A] === '  ') m.lompat(1630);
      } },
    { baris: 1610, jalan: function (m) {
        m.v.PTOT = m.v.PTOT + m.v.PL;
        if (m.v.PL === m.v.PR) m.v.PTOT = m.v.PTOT + m.v.PR;
      } },
    { baris: 1620, jalan: function (m) { m.lompat(1710); } },
    { baris: 1630, jalan: function (m) { if (m.v.PLM !== m.v.PRM) m.lompat(1690); } },
    { baris: 1640, jalan: function (m) { if (m.v.FLAG1) m.lompat(1710); } },
    { baris: 1650, jalan: function (m) {
        if (m.v.A === 0 || m.v.A === 2) {
          m.v.PTOT = m.v.PTOT + m.v.PRM + m.v.PLM; m.lompat(1680);
        }
      } },
    { baris: 1660, jalan: function (m) {
        if (m.v['TBL$'][1] === '  ') m.v.PTOT = m.v.PTOT + m.v.PLM;
      } },
    { baris: 1670, jalan: function (m) {
        if (m.v['TBL$'][3] === '  ') m.v.PTOT = m.v.PTOT + m.v.PLM;
      } },
    { baris: 1680, jalan: function (m) { m.v.FLAG1 = 1; m.lompat(1710); } },
    { baris: 1690, jalan: function (m) {
        if (m.v.A === 0) { m.v.PTOT = m.v.PTOT + m.v.PLM; m.lompat(1710); }
      } },
    { baris: 1700, jalan: function (m) {
        if (m.v.A === 2) { m.v.PTOT = m.v.PTOT + m.v.PRM; m.lompat(1710); }
      } },
    { baris: 1710, jalan: function (m) { m.lanjutkan('A'); } },
    /* 1720 "habis dibagi lima" ditulis sebagai perbandingan antara pembagian
       PECAHAN dan pembagian BULAT. Kalau keduanya sama, tidak ada sisa. */
    { baris: 1720, jalan: function (m) {
        if (m.v.PTOT / 5 === Math.trunc(m.v.PTOT / 5)) m.lompat(1730);
        else m.kembali();
      } },
    { baris: 1730, jalan: function (m) { m.v.HOLDY = m.v.PTOT; m.kembali(); } },
    { baris: 1740, jalan: function (m) {
        m.v.A = m.v.PLM + m.v.PRM;
        m.v.HOLDY = (m.v.A / 5 === Math.trunc(m.v.A / 5)) ? m.v.A : 0;
      } },
    { baris: 1750, jalan: function (m) { m.v.FSTTME = 0; m.kembali(); } },

    /* --- 1760-2040: adakah langkah untuk pemain? -------------------------- */
    { baris: 1760, jalan: function (m) { if (m.v.FSTTME) m.kembali(); } },
    { baris: 1770, jalan: function (m) { m.v.C = 0; } },
    { baris: 1780, jalan: function (m) { m.untuk('A', 0, 3, 1, 1860); } },
    { baris: 1790, jalan: function (m) {
        if (m.v['TBL$'][m.v.A] === '  ') m.lompat(1850);
        else m.v.C = m.v.C + 1;
      } },
    { baris: 1800, jalan: function (m) { m.v.ZL = m.v['TBL$'][m.v.A].charAt(0); } },
    { baris: 1810, jalan: function (m) { m.untuk('B', 1, m.v.PLNO, 1, 1850); } },
    { baris: 1820, jalan: function (m) {
        m.v.ZLP = m.v['YOU$'][m.v.B].charAt(0);
        m.v.ZRP = m.v['YOU$'][m.v.B].slice(-1);
      } },
    { baris: 1830, jalan: function (m) {
        if (m.v.ZL === m.v.ZLP || m.v.ZL === m.v.ZRP) m.lompat(2040);
      } },
    { baris: 1840, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 1850, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 1860, jalan: function (m) { if (m.v.C < 4) m.lompat(1900); } },
    { baris: 1870, bagian: [
        function (m) { m.gosub(1320); },
        function (m) { if (m.v.EMPT) m.gosub(3530); },
        function (m) { if (m.v.EMPT) m.kembali(); }
      ] },
    { baris: 1880, jalan: function (m) {
        m.v.PLNO = m.v.PLNO + 1;
        m.v['YOU$'][m.v.PLNO] = m.v['NEXTBN$'];
      } },
    { baris: 1890, bagian: [
        function (m) { m.gosub(2680); },
        function (m) { m.lompat(1770); }
      ] },
    { baris: 1900, jalan: function (m) {
        m.v.ZL = m.v['TBL$'][4].charAt(0);
        m.v.ZR = m.v['TBL$'][4].slice(-1);
      } },
    { baris: 1910, jalan: function (m) { if (m.v.ZL === m.v.ZR) m.lompat(1970); } },
    { baris: 1920, jalan: function (m) { m.untuk('A', 1, m.v.PLNO, 1, 1960); } },
    { baris: 1930, jalan: function (m) {
        m.v.ZLP = m.v['YOU$'][m.v.A].charAt(0);
        m.v.ZRP = m.v['YOU$'][m.v.A].slice(-1);
      } },
    { baris: 1940, jalan: function (m) {
        if (m.v['TBL$'][0] === '  ' &&
            (m.v.ZL === m.v.ZLP || m.v.ZL === m.v.ZRP)) m.lompat(2040);
      } },
    { baris: 1950, jalan: function (m) {
        if (m.v['TBL$'][2] === '  ' &&
            (m.v.ZR === m.v.ZLP || m.v.ZR === m.v.ZRP)) m.lompat(2040);
      } },
    { baris: 1960, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.lompat(1870); }
      ] },
    { baris: 1970, jalan: function (m) { m.untuk('B', 0, 3, 1, 2030); } },
    { baris: 1980, jalan: function (m) {
        if (m.v['TBL$'][m.v.B] !== '  ') m.lompat(2030);
      } },
    { baris: 1990, jalan: function (m) { m.untuk('A', 1, m.v.PLNO, 1, 2030); } },
    { baris: 2000, jalan: function (m) {
        m.v.ZLP = m.v['YOU$'][m.v.A].charAt(0);
        m.v.ZRP = m.v['YOU$'][m.v.A].slice(-1);
      } },
    { baris: 2010, jalan: function (m) {
        if (m.v.ZL === m.v.ZLP || m.v.ZL === m.v.ZRP) m.lompat(2040);
      } },
    { baris: 2020, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2030, bagian: [
        function (m) { m.lanjutkan('B'); },
        function (m) { m.lompat(1870); }
      ] },
    { baris: 2040, jalan: function (m) { m.kembali(); } },
    { baris: 2050, jalan: function (m) {
        m.locate(25, 1); m.spc(79); m.locate(25, 20);
      } },
    { baris: 2060, jalan: function (m) {
        m.cetak('Invalid Move. Please Try Again.');
        m.v.INVD = 0; m.lompat(2070);
      } },
    { baris: 2070, jalan: function (m) { if (m.inkey() !== '') m.lompat(2070); } },
    { baris: 2080, jalan: function (m) { m.untuk('XX', 1, 1000, 1, 2110); } },
    { baris: 2090, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z !== '') m.lompat(2110);
      } },
    { baris: 2100, jalan: function (m) { m.lanjutkan('XX'); } },
    { baris: 2110, jalan: function (m) {
        m.locate(25, 1); m.spc(79); m.kembali();
      } },

    /* --- 2120-2320: kartu domino dan pengocokan --------------------------- */
    { baris: 2120, jalan: function (m) {
        m.dim('DT$', 6);
        for (m.v.A = 0; m.v.A <= 6; m.v.A++) m.v['DT$'][m.v.A] = m.baca();
      } },
    data(2130),
    { baris: 2140, jalan: function (m) { m.semaiCampur(detik(m)); } },
    { baris: 2150, jalan: function (m) {
        m.dim('PLD$', 28); m.dim('BONE$', 28);
        m.dim('MY$', 16); m.dim('YOU$', 16);
        m.dim('TBL$', 4); m.dim('SAV$', 4);
        m.v.C = 0; m.v.B = -1;
      } },
    /* 2160-2200 membuat dua puluh delapan kartu tanpa satu pun larik bantu:
       B naik sampai 6, lalu dipatok ke C dan C naik. Itu menghasilkan
       00,10,20,...,60, lalu 11,21,...,61, lalu 22,... — tepat separuh atas
       tabel 7x7. */
    { baris: 2160, jalan: function (m) { m.untuk('A', 1, 28, 1, 2210); } },
    { baris: 2170, jalan: function (m) { m.v.B = m.v.B + 1; } },
    { baris: 2180, jalan: function (m) {
        m.v['BONE$'][m.v.A] = String(m.v.B).slice(-1) + String(m.v.C).slice(-1);
      } },
    { baris: 2190, jalan: function (m) {
        if (m.v.B === 6) { m.v.B = m.v.C; m.v.C = m.v.C + 1; }
      } },
    { baris: 2200, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2210, jalan: function (m) { m.untuk('A', 1, 28, 1, 2250); } },
    { baris: 2220, jalan: function (m) {
        m.v.B = Math.floor(m.acak() * 28) + 1;
        m.v.C = Math.floor(m.acak() * 28) + 1;
        if (m.v.B === m.v.C) m.lompat(2220);
      } },
    { baris: 2230, jalan: function (m) {
        var t = m.v['BONE$'][m.v.B];
        m.v['BONE$'][m.v.B] = m.v['BONE$'][m.v.C];
        m.v['BONE$'][m.v.C] = t;
      } },
    { baris: 2240, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2250, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 4; m.v.A++) m.v['TBL$'][m.v.A] = '  ';
      } },
    { baris: 2260, jalan: function (m) { m.v.B = 0; } },
    { baris: 2270, jalan: function (m) { m.untuk('A', 1, 13, 2, 2320); } },
    { baris: 2280, jalan: function (m) { m.v.B = m.v.B + 1; } },
    { baris: 2290, jalan: function (m) {
        m.v['YOU$'][m.v.B] = m.v['BONE$'][m.v.A];
      } },
    { baris: 2300, jalan: function (m) {
        m.v['MY$'][m.v.B] = m.v['BONE$'][m.v.A + 1];
      } },
    { baris: 2310, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.v.PLNO = 7; m.v.CONO = 7; m.v.BNPTR = 15; }
      ] },
    { baris: 2320, jalan: function (m) { m.kembali(); } },

    /* --- 2330-2670: menggambar papan salib ------------------------------- */
    { baris: 2330, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1340); },
        function (m) { m.gosub(3330); },
        function (m) {
          m.v['CUR$'] = m.v['CUR$'].charAt(0) + ':' + m.v['CUR$'].slice(-1);
        }
      ] },
    { baris: 2340, jalan: function (m) {
        m.v['PLD$'][m.v.PLAYED] = m.v['CUR$'];
      } },
    { baris: 2350, jalan: function (m) { m.v.PLAYED = m.v.PLAYED + 1; } },
    { baris: 2360, jalan: function (m) { m.untuk('SLOC', 0, 3, 1, 2410); } },
    { baris: 2370, jalan: function (m) {
        if (m.v['TBL$'][m.v.SLOC] === '  ') m.lompat(2400);
      } },
    { baris: 2380, jalan: function (m) {
        m.v.ZL = m.v['TBL$'][m.v.SLOC].charAt(0);
        m.v.ZR = m.v['TBL$'][m.v.SLOC].slice(-1);
      } },
    { baris: 2390, jalan: function (m) {
        if (m.v.ZL !== m.v.ZR) m.gosub(2500); else m.gosub(2440);
      } },
    { baris: 2400, jalan: function (m) { m.lanjutkan('SLOC'); } },
    { baris: 2410, jalan: function (m) {
        m.v.ZL = m.v['TBL$'][4].charAt(0);
        m.v.ZR = m.v['TBL$'][4].slice(-1);
      } },
    { baris: 2420, jalan: function (m) {
        if (m.v.ZL === m.v.ZR) m.gosub(2490); else m.gosub(2550);
      } },
    { baris: 2430, jalan: function (m) { m.kembali(); } },
    { baris: 2440, bagian: [
        function (m) {
          var t = [2450, 2470, 2480, 2460, 2490][m.v.SLOC];
          if (t) m.gosub(t);
        },
        function (m) { m.kembali(); }
      ] },
    tegakAtau(2450, 6, 36, 'datar', 'ZL', 'ZR'),
    tegakAtau(2460, 8, 28, 'tegak', 'ZL', 'ZR'),
    tegakAtau(2470, 8, 50, 'tegak', 'ZL', 'ZR'),
    tegakAtau(2480, 12, 36, 'datar', 'ZL', 'ZR'),
    tegakAtau(2490, 9, 36, 'datar', 'ZL', 'ZR'),
    { baris: 2500, bagian: [
        function (m) {
          var t = [2510, 2530, 2540, 2520, 2550][m.v.SLOC];
          if (t) m.gosub(t);
        },
        function (m) { m.kembali(); }
      ] },
    tegakAtau(2510, 3, 38, 'tegak', 'ZR', 'ZL'),
    tegakAtau(2520, 9, 26, 'datar', 'ZR', 'ZL'),
    tegakAtau(2530, 9, 46, 'datar', 'ZL', 'ZR'),
    tegakAtau(2540, 13, 38, 'tegak', 'ZL', 'ZR'),
    tegakAtau(2550, 8, 38, 'tegak', 'ZR', 'ZL'),
    { baris: 2560, jalan: function (m) {
        m.warna(6, 0); m.locate(m.v.SLN, m.v.HS);
        m.cetak(m.chr(218) + m.ulang(3, 196) + m.chr(191)); m.barisBaru();
      } },
    kotakBaris(2570, 1, 179, 179),
    { baris: 2580, jalan: function (m) {
        m.locate(m.v.SLN + 2, m.v.HS);
        m.cetak(m.chr(195) + m.ulang(3, 196) + m.chr(180)); m.barisBaru();
      } },
    kotakBaris(2590, 3, 179, 179),
    { baris: 2600, jalan: function (m) {
        m.locate(m.v.SLN + 4, m.v.HS);
        m.cetak(m.chr(192) + m.ulang(3, 196) + m.chr(217)); m.barisBaru();
        m.warna(15, 0);
      } },
    { baris: 2610, jalan: function (m) {
        m.locate(m.v.SLN + 1, m.v.HS + 1);
        m.cetak(m.v['DT$'][m.v.BOT]); m.barisBaru();
      } },
    { baris: 2620, jalan: function (m) {
        m.locate(m.v.SLN + 3, m.v.HS + 1);
        m.cetak(m.v['DT$'][m.v.TOP]); m.barisBaru();
        m.warna(7, 0); m.kembali();
      } },
    { baris: 2630, jalan: function (m) {
        m.warna(6, 0); m.locate(m.v.SLN, m.v.HS);
        m.cetak(m.chr(218) + m.ulang(3, 196) + m.chr(194) +
                m.ulang(3, 196) + m.chr(191)); m.barisBaru();
      } },
    { baris: 2640, jalan: function (m) {
        m.locate(m.v.SLN + 1, m.v.HS);
        m.cetak(m.chr(179) + '   ' + m.chr(179) + '   ' + m.chr(179));
        m.barisBaru();
      } },
    { baris: 2650, jalan: function (m) {
        m.locate(m.v.SLN + 2, m.v.HS);
        m.cetak(m.chr(192) + m.ulang(3, 196) + m.chr(193) +
                m.ulang(3, 196) + m.chr(217)); m.barisBaru();
        m.warna(15, 0);
      } },
    { baris: 2660, jalan: function (m) {
        m.locate(m.v.SLN + 1, m.v.HS + 1);
        m.cetak(m.v['DT$'][m.v.RHT]); m.barisBaru();
      } },
    { baris: 2670, jalan: function (m) {
        m.locate(m.v.SLN + 1, m.v.HS + 5);
        m.cetak(m.v['DT$'][m.v.LFT]); m.barisBaru();
        m.warna(7, 0); m.kembali();
      } },

    /* --- 2680-3000: tangan pemain di kaki layar --------------------------- */
    { baris: 2680, jalan: function (m) { m.v.ONEROW = 1; } },
    { baris: 2690, jalan: function (m) { m.locate(null, null, 0); } },
    { baris: 2700, jalan: function (m) { m.v.SLN = 19; } },
    { baris: 2710, jalan: function (m) {
        m.v.HS = Math.trunc((80 - 10 * m.v.PLNO) / 2) + 1;
      } },
    { baris: 2720, jalan: function (m) { if (m.v.HS < 1) m.v.HS = 1; } },
    { baris: 2730, jalan: function (m) { m.untuk('I', m.v.SLN, 6 + m.v.SLN - 1, 1, 2760); } },
    { baris: 2740, jalan: function (m) { m.locate(m.v.I, 1); m.spc(79); } },
    { baris: 2750, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 2760, bagian: [
        function (m) { m.untuk('A', 1, m.v.PLNO, 1, 2830); },
        function (m) { m.warna(14, 0); }
      ] },
    { baris: 2770, jalan: function (m) {
        m.locate(m.v.SLN, m.v.HS);
        m.cetak(m.chr(218) + m.ulang(3, 196) + m.chr(194) +
                m.ulang(3, 196) + m.chr(191));
      } },
    { baris: 2780, jalan: function (m) {
        m.locate(m.v.SLN + 1, m.v.HS);
        m.cetak(m.chr(179) + '   ' + m.chr(179) + '   ' + m.chr(179));
      } },
    { baris: 2790, jalan: function (m) {
        m.locate(m.v.SLN + 2, m.v.HS);
        m.cetak(m.chr(192) + m.ulang(3, 196) + m.chr(193) +
                m.ulang(3, 196) + m.chr(217));
      } },
    { baris: 2800, jalan: function (m) { m.v.HS = m.v.HS + 10; } },
    { baris: 2810, jalan: function (m) {
        if (m.v.HS > 80) { m.v.SLN = m.v.SLN + 3; m.v.HS = 1; m.v.ONEROW = 0; }
      } },
    { baris: 2820, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2830, jalan: function (m) { m.v.SLN = 19; } },
    { baris: 2840, jalan: function (m) {
        m.v.HS = Math.trunc((80 - 10 * m.v.PLNO) / 2) + 2;
      } },
    { baris: 2850, jalan: function (m) { if (m.v.HS < 1) m.v.HS = 2; } },
    { baris: 2860, bagian: [
        function (m) { m.untuk('A', 1, m.v.PLNO, 1, 2930); },
        function (m) { m.warna(15, 0); }
      ] },
    { baris: 2870, jalan: function (m) {
        var n = nilai(m.v['YOU$'][m.v.A].charAt(0));
        m.gosub([2940, 2950, 2960, 2970, 2980, 2990, 3000][n]);
      } },
    { baris: 2880, jalan: function (m) { m.v.HS = m.v.HS + 4; } },
    { baris: 2890, jalan: function (m) {
        var n = nilai(m.v['YOU$'][m.v.A].slice(-1));
        m.gosub([2940, 2950, 2960, 2970, 2980, 2990, 3000][n]);
      } },
    { baris: 2900, jalan: function (m) { m.v.HS = m.v.HS + 6; } },
    { baris: 2910, jalan: function (m) {
        if (m.v.HS > 80) { m.v.SLN = m.v.SLN + 3; m.v.HS = 2; }
      } },
    { baris: 2920, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2930, jalan: function (m) { m.warna(7, 0); m.kembali(); } },
    /* 2940-3000 tujuh subrutin yang isinya sama persis kecuali satu angka.
       Sebuah larik yang diindeks langsung sudah cukup; ini `ON n GOSUB` yang
       ditulis karena ada. */
    mata(2940, 0), mata(2950, 1), mata(2960, 2), mata(2970, 3),
    mata(2980, 4), mata(2990, 5), mata(3000, 6),

    /* --- 3010-3270: judul dan petunjuk ------------------------------------ */
    { baris: 3010, bagian: [
        function (m) { m.cls(); m.warna(6, 0); },
        function (m) { m.gosub(3410); }
      ] },
    { baris: 3020, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 3030, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1); m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 3040, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 3050, jalan: function (m) {
        m.locate(3, 33); m.warna(11, 0);
        m.cetak('D O M I N O E S'); m.barisBaru();
      } },
    { baris: 3060, jalan: function (m) {
        m.warna(15, 0); m.locate(8, 25);
        m.cetak('Would You Like instructions? <Y/N>'); m.barisBaru();
      } },
    { baris: 3070, bagian: [
        function (m) { m.gosub(3360); },
        function (m) {
          if (m.v.Z === 'N') { m.cls(); m.kembali(); }
          else if (m.v.Z !== 'Y') m.lompat(3070);
        }
      ] },
    { baris: 3080, jalan: function (m) {
        m.warna(3, 0); m.locate(4, 19);
        m.cetak('This is single spinner Dominoes,  that is you'); m.barisBaru();
      } },
    ajar(3090,  5, 19, 'can only play in any direction off  the first'),
    ajar(3100,  6, 19, 'spinner or double dominoe (1:1,2:2,3:3, etc).'),
    ajar(3110,  7, 19, 'The object of the game  is to score points in'),
    ajar(3120,  8, 19, "multiples of  `5'  by adding the total of all"),
    ajar(3130,  9, 19, 'open ends of the playing board. You can score'),
    ajar(3140, 10, 19, 'points  only  if the game board total is five'),
    ajar(3150, 11, 19, 'or a multiple of five. You may start each new'),
    ajar(3160, 12, 19, 'hand  by playing  the  first dominoe.  If the'),
    ajar(3170, 13, 19, 'total of both ends equals  five  or  ten, you'),
    ajar(3180, 14, 19, 'score that number of points.  From that point'),
    ajar(3190, 15, 19, 'on,  you and the computer build onto the ends'),
    ajar(3200, 16, 19, 'trying to  score  points.   If no dominoe end'),
    ajar(3210, 17, 19, 'in your hand matches an open end on the board,'),
    ajar(3220, 18, 19, 'the computer will draw from the boneyard.  If'),
    ajar(3230, 19, 19, 'the boneyard is  empty,  the other player may'),
    ajar(3240, 20, 19, 'play again.  Use the Cursor Arrows and  Enter'),
    ajar(3250, 21, 19, 'Key to select and play your dominoes.'),
    { baris: 3260, jalan: function (m) {
        m.locate(25, 25); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue');
      } },
    { baris: 3270, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3270); else { m.cls(); m.kembali(); }
      } },

    /* --- 3280-3420: F10 dan bilah status ---------------------------------- */
    { baris: 3280, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos();
        m.locate(25, 1); m.spc(79);
      } },
    { baris: 3290, jalan: function (m) {
        m.locate(25, 21);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
      } },
    { baris: 3300, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3300);
      } },
    { baris: 3310, jalan: function (m) {
        if (m.v.Z === 'y' || m.v.Z === 'Y') m.jalankan('MENU');
      } },
    { baris: 3320, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(3300);
      } },
    { baris: 3330, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 24); m.warna(0, 7);
      } },
    { baris: 3340, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(7, 0); m.locate(m.v.XLIN, m.v.XPOS, 0);
      } },
    { baris: 3350, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },
    { baris: 3360, jalan: function (m) { if (m.inkey() !== '') m.lompat(3360); } },
    { baris: 3370, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3370);
      } },
    { baris: 3380, jalan: function (m) {
        if (m.v.Z < 'a' || m.v.Z > 'z') m.lompat(3400);
      } },
    { baris: 3390, jalan: function (m) {
        m.v.Z = m.chr(m.v.Z.charCodeAt(0) - 32);
      } },
    { baris: 3400, jalan: function (m) { m.kembali(); } },
    { baris: 3410, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 3420); m.jebakan(m.v.A, true);
        }
      } },
    { baris: 3420, jalan: function (m) { m.kembali(); } },

    /* --- 3430-3520: pilih target skor ------------------------------------- */
    { baris: 3430, jalan: function (m) { m.cls(); } },
    pilihan(3440, 6, ' A ', ' Play To 100 Points'),
    pilihan(3450, 8, ' B ', ' Play To 250 Points'),
    pilihan(3460, 10, ' C ', ' Play To 500 Points'),
    { baris: 3470, jalan: function (m) {
        m.warna(3, 0); m.locate(4, 25);
        m.cetak('Please Choose A Game <A> <B> or <C>'); m.barisBaru();
      } },
    { baris: 3480, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3480);
      } },
    target(3490, 'A', 100), target(3500, 'B', 250),
    { baris: 3510, jalan: function (m) {
        if (m.v.Z === 'C' || m.v.Z === 'c') { m.v.GAME = 500; m.lompat(3520); }
        else m.lompat(3480);
      } },
    { baris: 3520, jalan: function (m) { m.cls(); m.kembali(); } },

    /* --- 3530-3580: tak ada langkah -------------------------------------- */
    { baris: 3530, jalan: function (m) {
        m.v.NOPLAY = m.v.NOPLAY + 1;
        if (m.v.NOPLAY === 2) m.lompat(3590);
      } },
    { baris: 3540, jalan: function (m) { m.locate(4, 1); m.warna(15, 0); } },
    { baris: 3550, jalan: function (m) {
        m.cetak('The Bone Yard Is Empty'); m.barisBaru();
        if (m.v.PL1) m.lompat(3570);
      } },
    { baris: 3560, jalan: function (m) {
        m.cetak('And I Have No Play'); m.barisBaru();
        m.cetak('I Lose My Turn'); m.barisBaru();
        m.lompat(3580);
      } },
    { baris: 3570, jalan: function (m) {
        m.cetak('Sorry, You Have No Play'); m.barisBaru();
        m.cetak('So You Lose Your Turn'); m.barisBaru();
        m.lompat(3580);
      } },
    { baris: 3580, jalan: function (m) {
        for (m.v.AI = 1; m.v.AI <= 3500; m.v.AI++) { /* jeda */ }
        m.kembali();
      } },

    /* --- 3590-3790: akhir ronde ------------------------------------------- */
    /* 3620 sisa kartu lawan dibulatkan ke kelipatan lima TERDEKAT: bagi lima,
       kalikan lima, dan kalau sisanya lebih dari dua, tambahkan lima. */
    { baris: 3590, jalan: function (m) {
        m.v.TOT = 0;
        if (m.v.PLNO) { if (m.v.CONO) m.lompat(3600); else m.lompat(3640); }
      } },
    { baris: 3600, jalan: function (m) { m.untuk('A', 1, m.v.CONO, 1, 3620); } },
    { baris: 3610, jalan: function (m) {
        m.v.TOT = m.v.TOT + nilai(m.v['MY$'][m.v.A].charAt(0)) +
                  nilai(m.v['MY$'][m.v.A].slice(-1));
      } },
    { baris: 3620, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) {
          m.v.REMA = m.v.TOT % 5;
          m.v.TOT = Math.trunc(m.v.TOT / 5) * 5;
          if (m.v.REMA > 2) m.v.TOT = m.v.TOT + 5;
        }
      ] },
    { baris: 3630, jalan: function (m) {
        m.v.YSCR = m.v.YSCR + m.v.TOT;
        m.lompat(m.v.PLNO ? 3640 : 3680);
      } },
    { baris: 3640, bagian: [
        function (m) { m.v.TOT = 0; },
        function (m) { m.untuk('A', 1, m.v.PLNO, 1, 3660); }
      ] },
    { baris: 3650, jalan: function (m) {
        m.v.TOT = m.v.TOT + nilai(m.v['YOU$'][m.v.A].charAt(0)) +
                  nilai(m.v['YOU$'][m.v.A].slice(-1));
      } },
    { baris: 3660, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) {
          m.v.REMA = m.v.TOT % 5;
          m.v.TOT = Math.trunc(m.v.TOT / 5) * 5;
          if (m.v.REMA > 2) m.v.TOT = m.v.TOT + 5;
        }
      ] },
    { baris: 3670, jalan: function (m) { m.v.MYSCR = m.v.MYSCR + m.v.TOT; } },
    { baris: 3680, jalan: function (m) {
        m.cls(); m.locate(4, 29);
        m.cetak('Your Total Score Is' + angka(m.v.YSCR)); m.barisBaru();
      } },
    { baris: 3690, jalan: function (m) {
        m.locate(5, 30);
        m.cetak('My Total Score Is' + angka(m.v.MYSCR)); m.barisBaru();
        if (m.v.MYSCR >= m.v.GAME && m.v.MYSCR === m.v.YSCR) m.lompat(3770);
      } },
    { baris: 3700, jalan: function (m) {
        if (m.v.YSCR >= m.v.GAME) m.lompat(m.v.YSCR > m.v.MYSCR ? 3750 : 3760);
      } },
    { baris: 3710, jalan: function (m) {
        if (m.v.MYSCR >= m.v.GAME) m.lompat(m.v.YSCR < m.v.MYSCR ? 3760 : 3750);
      } },
    ajar(3720, 7, 28, 'One Moment Please, While'),
    ajar(3730, 8, 28, 'I Reshuffle The BoneYard'),
    { baris: 3740, bagian: [
        function (m) { m.v.C = 0; m.v.B = -1; },
        function (m) { m.gosub(2160); },
        function (m) {
          for (m.v.A = 1; m.v.A <= 4000; m.v.A++) { /* jeda */ }
          m.cls(); m.lompat(40);
        }
      ] },
    { baris: 3750, jalan: function (m) {
        m.locate(6, 36); m.cetak('You Win'); m.barisBaru(); m.lompat(3780);
      } },
    { baris: 3760, jalan: function (m) {
        m.locate(6, 37); m.cetak('I Win'); m.barisBaru(); m.lompat(3780);
      } },
    ajar(3770, 6, 31, 'The Game Is A Tie'),
    ajar(3780, 10, 23, 'Would You Like To Play Again? <Y/N>'),
    { baris: 3790, bagian: [
        function (m) { m.gosub(3360); },
        function (m) {
          if (m.v.Z === 'Y') m.jalankan();
          else if (m.v.Z === 'N') m.jalankan('MENU');
          else m.lompat(3790);
        }
      ] },

    /* --- 3800-3870: papan skor dan riwayat kartu -------------------------- */
    { baris: 3800, jalan: function (m) {
        m.warna(4, 0); m.locate(1, 66);
        m.cetak('Dominoes Played'); m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 3810, jalan: function (m) { m.untuk('A', 0, m.v.PLAYED - 1, 1, 3850); } },
    { baris: 3820, jalan: function (m) {
        if (m.v.A < 17) {
          m.locate(m.v.A + 2, 71); m.cetak(m.v['PLD$'][m.v.A] || '');
        }
      } },
    { baris: 3830, jalan: function (m) {
        if (m.v.A > 16) {
          m.locate(m.v.A - 14, 76); m.cetak(m.v['PLD$'][m.v.A] || '');
        }
      } },
    { baris: 3840, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 3850, jalan: function (m) {
        m.locate(2, 1); m.cetak('Your Score Is' + angka(m.v.YSCR));
        m.warna(7, 0);
      } },
    { baris: 3860, jalan: function (m) {
        m.warna(2, 0); m.locate(1, 1);
        m.cetak('My Score Is' + angka(m.v.MYSCR));
      } },
    { baris: 3870, jalan: function (m) { m.kembali(); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function data(nomor) { return { baris: nomor, jalan: function () { } }; }
  function nilai(z) { return parseInt(z, 10) || 0; }
  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function arah(nomor, angkaT, panah, dln, dom, dd) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.Z === angkaT || m.v.Z1 === panah) {
        m.v.DLN = dln; m.v.DOM = dom; m.v.DD = dd;
      }
    } };
  }

  function cocokArah(nomor, dd, sisi, punya, bendera) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.DD === dd && m.v[sisi] === m.v[punya]) {
        m.v[bendera] = 1; m.lompat(490);
      }
    } };
  }

  function ganti(nomor, a, b, dd, jadi, tanpaLompat) {
    return { baris: nomor, jalan: function (m) {
      if (m.v['TBL$'][a] === '  ' && m.v['TBL$'][b] === '  ' && m.v.DD === dd) {
        m.v.DD = jadi;
        if (!tanpaLompat) m.lompat(540);
      }
    } };
  }

  function uji(nomor, kiri, kanan, dd, bendera) {
    return { baris: nomor, bagian: [
      function (m) {
        m.v.__ = (m.v[kiri] === m.v[kanan]) && (dd === null || m.v.DD === dd);
        if (m.v.__) { m.v[bendera] = 1; m.gosub(1150); }
      },
      function (m) { if (m.v.__) m.lompat(960); }
    ] };
  }

  function tukar(m, a, b) {
    var t = m.v['TBL$'][a];
    m.v['TBL$'][a] = m.v['TBL$'][b];
    m.v['TBL$'][b] = t;
  }

  /* Satu kartu di papan: tegak (2560) atau mendatar (2630). */
  function tegakAtau(nomor, sln, hs, bentuk, satu, dua) {
    return { baris: nomor, bagian: [
      function (m) {
        m.v.SLN = sln; m.v.HS = hs;
        if (bentuk === 'tegak') {
          m.v.TOP = nilai(m.v[satu]); m.v.BOT = nilai(m.v[dua]);
        } else {
          m.v.LFT = nilai(m.v[satu]); m.v.RHT = nilai(m.v[dua]);
        }
      },
      function (m) { m.gosub(bentuk === 'tegak' ? 2560 : 2630); },
      function (m) { m.kembali(); }
    ] };
  }

  function kotakBaris(nomor, geser, kiri, kanan) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.SLN + geser, m.v.HS);
      m.cetak(m.chr(kiri) + '   ' + m.chr(kanan)); m.barisBaru();
    } };
  }

  function mata(nomor, n) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.SLN + 1, m.v.HS);
      m.cetak(m.v['DT$'][n]); m.barisBaru();
      m.kembali();
    } };
  }

  function pilihan(nomor, b, kode, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, 30); m.warna(0, 7); m.cetak(kode);
      m.warna(3, 0); m.cetak(isi); m.barisBaru();
    } };
  }

  function target(nomor, huruf, poin) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.Z === huruf || m.v.Z === huruf.toLowerCase()) {
        m.v.GAME = poin; m.lompat(3520);
      }
    } };
  }

  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['DOMINOES'] = {
    nama: 'DOMINOES',
    judul: 'Dominoes (Five-Up)',
    sumber: 'DOMINOES',
    berkas: 'run/DOMINOES.BAS',
    tabel: tabel,
    benih: 17,
    /* Tujuh pola mata, masing-masing tiga aksara. Titik dan titik dua itu
       ASCII biasa; yang di tengah CHR$(249). */
    data: [
      '   ',
      ' ' + String.fromCharCode(249) + ' ',
      '. ' + String.fromCharCode(249),
      '.' + String.fromCharCode(249) + '.',
      ': :',
      ':' + String.fromCharCode(249) + ':',
      ':::'
    ],

    arsitektur: {
      judul: 'Alur DOMINOES.BAS',
      simpul: [
        { id: 'siap', baris: '3010-3520', jenis: 'mulai',
          teks: ['Petunjuk, pilih target skor,', 'kocok 28 kartu, bagi 7-7'] },
        { id: 'adakah', baris: '1760-2040', jenis: 'putusan',
          teks: ['Pemain punya langkah?', 'Kalau tidak: tarik dari boneyard'] },
        { id: 'pilihKartu', baris: '570-740',
          teks: ['Panah kiri/kanan memilih kartu', 'di tangan'] },
        { id: 'pilihArah', baris: '140-250',
          teks: ['Panah memilih salah satu', 'dari empat lengan salib'] },
        { id: 'sah', baris: '260-560', jenis: 'putusan',
          teks: ['Ujungnya cocok?', 'Kalau tidak: coba lagi'] },
        { id: 'skor', baris: '1550-1750',
          teks: ['Jumlahkan semua ujung terbuka;', 'kelipatan lima = angka'] },
        { id: 'otak', baris: '750-1230', jenis: 'subrutin',
          teks: ['Coba tiap kartu di tiap arah,', 'batalkan, simpan yang terbaik'] },
        { id: 'gambar', baris: '2330-2670',
          teks: ['Gambar ulang papan salib', 'dan riwayat kartu'] },
        { id: 'ronde', baris: '3590-3740',
          teks: ['Tangan habis: sisa kartu lawan', 'jadi angka, dibulatkan ke 5'] },
        { id: 'usai', baris: '3750-3790', jenis: 'keluar',
          teks: ['Target tercapai:', 'menang, kalah, atau seri'] }
      ],
      panah: [
        { dari: 'siap', ke: 'adakah' },
        { dari: 'adakah', ke: 'pilihKartu' },
        { dari: 'pilihKartu', ke: 'pilihArah' },
        { dari: 'pilihArah', ke: 'sah' },
        { dari: 'sah', ke: 'pilihKartu', label: 'tidak cocok', jenis: 'galat' },
        { dari: 'sah', ke: 'gambar' },
        { dari: 'gambar', ke: 'skor' },
        { dari: 'skor', ke: 'otak' },
        { dari: 'otak', ke: 'gambar', label: 'komputer menaruh' },
        { dari: 'otak', ke: 'adakah', label: 'giliran berikutnya' },
        { dari: 'skor', ke: 'ronde', label: 'tangan habis' },
        { dari: 'ronde', ke: 'siap', label: 'kocok ulang' },
        { dari: 'ronde', ke: 'usai', label: 'target tercapai' }
      ]
    },

    pseudokode: [
      { baris: 2160, tingkat: 0, teks: 'bangun 28 kartu <b>tanpa larik bantu</b>: B naik ke 6, lalu dipatok ke C dan C naik' },
      { baris: 2210, tingkat: 0, teks: 'kocok: tukar dua kartu acak, 28 kali' },
      { baris: 2270, tingkat: 0, teks: 'bagi selang-seling: ganjil untuk pemain, genap untuk komputer' },
      { baris: 1760, tingkat: 0, teks: '<b>ULANG:</b> pemain punya langkah? kalau tidak, tarik dari boneyard' },
      { baris: 570, tingkat: 1, teks: 'panah kiri/kanan memilih kartu; Enter memilih' },
      { baris: 140, tingkat: 1, teks: 'panah memilih lengan: atas, kanan, bawah, kiri' },
      { baris: 260, tingkat: 1, teks: 'ujungnya cocok? kalau tidak, "Invalid Move"' },
      { baris: 1340, tingkat: 1, teks: 'kartu ganda pertama <b>menjadi spinner</b> &mdash; papan berputar mengelilinginya' },
      { baris: 1550, tingkat: 1, teks: 'jumlahkan semua ujung terbuka; <b>habis dibagi lima?</b> itu angkanya' },
      { baris: 760, tingkat: 1, teks: '<b>otak komputer:</b> untuk tiap arah, untuk tiap kartu&hellip;' },
      { baris: 1150, tingkat: 2, teks: 'salin papan, taruh kartunya, hitung skornya, <b>kembalikan papan</b>' },
      { baris: 1210, tingkat: 2, teks: 'lebih baik dari yang tersimpan? ingat kartu dan arahnya' },
      { baris: 3590, tingkat: 1, teks: 'tangan habis: sisa kartu lawan jadi angka, dibulatkan ke kelipatan 5' }
    ],

    perintahAsli: 'run\\DOMINOES.bat',
    catatanAsli: 'Di DOSBox-X penunjuk pilihan berkedip (COLOR 26 dan 28); ' +
      'di penelusur ia tampil diam.',

    penyimpangan: [
      '<b><code>COLOR 26</code> dan <code>COLOR 28</code> tidak berkedip.</b> ' +
      'Penunjuk pilihan kartu dan arah seharusnya berkedip.',

      '<b>Pengacaknya berbenih tetap</b>, jadi susunan kartunya selalu sama. ' +
      'Baris 2140 memakai <code>m.semaiCampur</code> seperti MATCH.BAS, karena ' +
      'ia menyemai ulang dari jam yang sama.',

      '<b>Gelung tunda habis seketika</b> (baris 2080 dan 3580).',

      '<b>Baris 490 dibiarkan apa adanya</b>, termasuk pemakaian ' +
      '<code>A</code> yang nilainya tertinggal dari gelung lain. Di penelusur ' +
      'hasilnya bergantung pada nilai <code>A</code> yang sama seperti di ' +
      'GW-BASIC, jadi cacatnya ikut terbawa &mdash; itu memang maksudnya.'
    ],

    pelajaran: {
      ringkas: 'Domino Five-Up dengan spinner. Yang layak dipelajari: mata ' +
        'dadu dari titik dan titik dua, papan yang seluruhnya lima string, ' +
        'dan otak komputer yang mencoba lalu membatalkan.',
      pelajari: [
        ['Tujuh nilai dalam tiga aksara',
         'Baris 2130: <code>"   "</code>, <code>" . "</code>, ' +
         '<code>". ."</code>, <code>"..."</code>, <code>": :"</code>, ' +
         '<code>":.:"</code>, <code>":::"</code>. Kuncinya: titik dua sudah ' +
         '<b>dua titik bertumpuk</b>. Jadi tiga kolom aksara bisa memuat nol ' +
         'sampai enam mata tanpa mode grafik dan tanpa aksara khusus.'],
        ['Seluruh papan dalam lima string',
         '<code>TBL$(4)</code> spinner, <code>TBL$(0..3)</code> empat ' +
         'lengannya. Tiap string dua aksara. Papan salib, dua puluh delapan ' +
         'kartu, dan seluruh keadaan permainan muat dalam sepuluh huruf ' +
         '&mdash; dan menaruh kartu berarti mengganti satu string.'],
        ['Coba, nilai, batalkan',
         'Baris 1150-1230 adalah pola yang masih dipakai di setiap mesin ' +
         'catur: salin keadaan, kerjakan langkahnya, nilai hasilnya, ' +
         '<b>kembalikan keadaan</b>. Yang tersimpan cuma nomor langkah ' +
         'terbaiknya. Di sini salinannya cuma lima string, jadi ' +
         'membatalkannya dua gelung pendek.'],
        ['Habis dibagi lima, tanpa MOD',
         'Baris 1720: <code>IF PTOT/5=PTOT\\5</code>. Pembagian pecahan sama ' +
         'dengan pembagian bulat hanya kalau tidak ada sisa. Idiom yang lebih ' +
         'tua daripada <code>MOD</code> di BASIC &mdash; dan program ini ' +
         'memakai <code>MOD</code> juga, di baris 3620.'],
        ['Membuat 28 kartu tanpa larik bantu',
         'Baris 2160-2200: <code>B</code> naik sampai 6, lalu dipatok ke ' +
         '<code>C</code> dan <code>C</code> naik. Hasilnya 00,10,&hellip;,60, ' +
         'lalu 11,21,&hellip;,61, lalu 22,&hellip; &mdash; tepat separuh atas ' +
         'tabel 7&times;7, yang memang isi satu set domino.']
      ],
      hindari: [
        ['Memakai variabel yang nilainya tertinggal',
         'Baris 490: <code>IF LEFT$(TBL$(4),1)&lt;&gt;RIGHT$(TBL$(A),1)</code>. ' +
         '<code>A</code> di situ tidak diisi di mana pun sebelumnya di jalur ' +
         'ini &mdash; nilainya apa pun yang tertinggal dari gelung terakhir ' +
         'yang memakainya. Syaratnya jadi tidak bisa diramalkan, dan tidak ' +
         'ada pesan galat yang menandainya.'],
        ['Tujuh subrutin yang isinya sama',
         'Baris 2940-3000: tujuh baris <code>LOCATE SLN+1,HS:PRINT ' +
         'DT$(n):RETURN</code>, berbeda cuma di angkanya. Sebuah larik yang ' +
         'diindeks langsung sudah cukup &mdash; dan lariknya <b>sudah ada</b>, ' +
         'namanya <code>DT$</code>.'],
        ['Tanda kutip yang hilang di RUN',
         'Baris 3310 menulis <code>RUN"menu</code> tanpa penutup; baris 3790 ' +
         'menulis <code>RUN"menu"</code> dengan penutup. Keduanya bekerja di ' +
         'GW-BASIC, dan keduanya ada di program yang sama.'],
        ['Rombongan IF yang panjangnya enam belas baris',
         'Baris 840-950: enam belas syarat yang semuanya berbentuk ' +
         '<code>IF Zx=Zy AND DD=n THEN ... GOSUB 1150:GOTO 960</code>. Yang ' +
         'membedakannya cuma tiga hal, dan ketiganya bisa jadi tabel.']
      ]
    },

    penjelasan: [
      { judul: 'Mata dadu dari titik dan titik dua',
        isi: [
          'Kartu domino perlu menampilkan nol sampai enam mata di ruang yang ' +
          'sangat sempit. Program ini memakai <b>tiga aksara</b>, dan ' +
          'triknya ada di baris 2130:',
          '<code>DATA "   "," . ",". .","...",": :",":.:",":::"</code>',
          '(Aksara tengahnya sebenarnya <code>CHR$(249)</code>, titik kecil ' +
          'di tengah sel &mdash; bukan titik biasa.)',
          'Kuncinya: <b>titik dua adalah dua titik bertumpuk</b>. Jadi:',
          'nol mata = tiga spasi. Satu = satu titik di tengah. Dua = titik di ' +
          'kiri dan kanan. Tiga = titik-titik-titik. Empat = dua titik dua. ' +
          'Lima = dua titik dua dengan satu di tengah. Enam = tiga titik dua.',
          'Tidak ada mode grafik, tidak ada aksara khusus CP437, dan tidak ada ' +
          'yang perlu digambar per piksel. Tujuh nilai, tiga kolom, aksara ' +
          'yang ada di setiap papan ketik.',
          'Dan karena polanya disimpan sebagai <b>string</b> di ' +
          '<code>DT$()</code>, menggambar satu sisi kartu cuma satu ' +
          '<code>PRINT DT$(n)</code>.'
        ] },
      { judul: 'Coba, nilai, batalkan',
        isi: [
          'Komputer perlu memilih langkah terbaik dari tujuh kartu di ' +
          'tangannya dikali empat arah. Cara menilainya: taruh kartunya, ' +
          'hitung skornya, lalu <b>batalkan</b>.',
          'Baris 1150-1230:',
          '<code>1160 FOR A=0 TO 4:SAV$(A)=TBL$(A):NEXT</code> &mdash; salin ' +
          'papan<br>' +
          '<code>1180 IF IS THEN TBL$(DD)=ZRP2+ZLP2</code> &mdash; taruh<br>' +
          '<code>1200 GOSUB 1550</code> &mdash; hitung skornya<br>' +
          '<code>1210 IF HOLDY AND HOLD&lt;=HOLDY THEN HOLD=HOLDY</code> ' +
          '&mdash; lebih baik?<br>' +
          '<code>1220 HH1=PLA:HH2=DD</code> &mdash; ingat kartu dan arahnya<br>' +
          '<code>1230 FOR A=0 TO 4:TBL$(A)=SAV$(A):NEXT</code> &mdash; ' +
          '<b>kembalikan</b>',
          'Ini pola yang masih dipakai di setiap mesin catur, dan di setiap ' +
          'pemecah teka-teki: <b>make move &mdash; evaluate &mdash; unmake ' +
          'move</b>.',
          'Yang membuatnya murah di sini: keadaan permainannya cuma lima ' +
          'string dua aksara. Menyalin dan mengembalikannya dua gelung lima ' +
          'putaran. Kalau papannya disimpan sebagai gambar layar, ' +
          'membatalkan langkah akan jauh lebih mahal daripada mengerjakannya.',
          'Dan perhatikan yang <b>tidak</b> dilakukannya: tidak ada pencarian ' +
          'ke depan. Komputer menilai satu langkah, bukan akibatnya. Itu ' +
          'sebabnya ia bisa memberi pemain umpan bagus tanpa sadar &mdash; ' +
          'dan sebabnya seluruh otaknya muat dalam delapan puluh baris.'
        ] },
      { judul: 'Spinner yang pindah sendiri',
        isi: [
          'Di domino Five-Up, kartu <b>ganda</b> pertama menjadi "spinner" ' +
          '&mdash; titik pusat yang boleh dibangun ke empat arah. Masalahnya: ' +
          'kartu pertama yang dimainkan belum tentu ganda.',
          'Baris 1340-1540 menyelesaikannya dengan cara yang tidak biasa: ' +
          'begitu kartu ganda muncul di salah satu lengan, papannya ' +
          '<b>disusun ulang</b> supaya kartu itu yang jadi pusat.',
          '<code>1430 SWAP TBL$(2),TBL$(4):SWAP TBL$(0),TBL$(4)</code>',
          'Dua <code>SWAP</code> berurutan yang memutar tiga string. Kartu ' +
          'yang tadinya di lengan kiri jadi pusat, yang tadinya pusat jadi ' +
          'lengan kanan.',
          'Dan baris 1440 membalik salah satunya:',
          '<code>TBL$(2)=RIGHT$(TBL$(2),1)+LEFT$(TBL$(2),1)</code>',
          '&mdash; karena kartu yang berpindah lengan juga berganti arah ' +
          'hadap.',
          '<code>NOSPR</code> (baris 1340 dan 1540) memastikan ini hanya ' +
          'terjadi <b>sekali</b>: begitu spinner-nya ada, ia tidak pindah ' +
          'lagi.',
          'Yang membuat ini mungkin: papannya bukan gambar melainkan lima ' +
          'string. Menyusun ulang papan berarti menukar string, dan baris ' +
          '2330 menggambar ulang seluruhnya dari nol setiap kali. ' +
          '<b>Memisahkan keadaan dari tampilannya membuat operasi yang ' +
          'terdengar rumit jadi tiga baris.</b>'
        ] }
    ]
  };
})(window);
