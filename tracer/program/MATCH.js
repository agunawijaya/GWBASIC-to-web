/* ===========================================================================
   MATCH.js — porting minimalis MATCH.BAS sebagai tabel baris.

   Program kedua puluh dua: permainan ingatan berhadiah. Papan 8x5 berisi dua
   puluh hadiah yang masing-masing disembunyikan DUA kali; pemain membuka dua
   petak dan berharap cocok.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) LAWAN ADALAH PENCARIAN TABEL. Baris 1220: `T(0)=1:T(1)=0`. Sesudah itu
       "giliran lawan" ditulis `T(T)` di seluruh program — tidak ada satu pun
       `IF` yang menanyakan siapa yang sedang bermain.

   (2) SATU TANDA KUTIP YANG MENGUBAH KODE JADI TEKS. Baris 1600 punya kutip
       pembuka yang tidak pernah ditutup, jadi separuh barisnya — termasuk
       `GOTO 1520` — tercetak ke layar alih-alih dijalankan.

   (3) ANGKA RAHASIANYA 10 SAMPAI 98, TAPI YANG DIMINTA 11 SAMPAI 99. Baris
       270 membuat `FIX(RND*89)+10`; baris 3320 meminta "<11 to 99>". Menebak
       99 tidak akan pernah benar, dan 10 tidak pernah ditawarkan.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Larik yang punya kembaran skalar diganti namanya: `A(20)` jadi `A_`,
     `B(40)` jadi `B_`, `T(1)` jadi `T_`.
   - `SOUND` diam.
   - Pengacaknya berbenih tetap, jadi susunan papannya selalu sama.
   =========================================================================== */

(function (global) {
  'use strict';

  var PTR = '$$##,###.##';

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.warna(3, 0); m.locate(1, 1, 0);
      } },
    { baris: 110, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 410); m.jebakan(m.v.A, true);
        }
      } },
    { baris: 120, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 3580);
        m.v.XLIN = 1; m.v.XPOS = 1;
      } },
    { baris: 130, jalan: function (m) {
        m.dim('A_', 20); m.dim('B_', 40); m.dim('PV$', 40);
        m.dim('PZ$', 81); m.dim('VL', 81); m.dim('TBL', 1, 50);
        m.dim('PL$', 1); m.dim('T_', 1); m.dim('MATCH', 1);
        m.dim('KEEP', 1, 21);
        /* Q() tidak pernah di-DIM; BASIC membuatnya berbatas 10. */
        m.dim('Q', 10);
        m.v.PV = m.v['PV$']; m.v.PZ = m.v['PZ$']; m.v.PL = m.v['PL$'];
        m.v.JAM = 23;
        /* BASIC memberi nol pada tiap variabel angka sebelum dipakai. Yang
           satu ini penting: `T` adalah nomor pemain, dan baris 720 sudah
           membacanya sebelum ada yang mengisinya. */
        m.v.T = 0; m.v.FLAG = 0; m.v.HOLD = 0; m.v.D = 0;
      } },
    { baris: 140, jalan: function (m) { m.v.PTR = PTR; } },
    { baris: 150, jalan: function (m) { m.gosub(1140); } },
    { baris: 160, jalan: function (m) { m.gosub(420); } },
    { baris: 170, bagian: [
        function (m) { m.warna(3, 0); },
        function (m) { m.gosub(630); }
      ] },
    { baris: 180, bagian: [
        function (m) { if (m.v.FLAG === 2) m.gosub(1750); },
        function (m) { if (m.v.FLAG === 2) m.lompat(1360); }
      ] },
    { baris: 190, jalan: function (m) { if (m.v.FLAG === 1) m.lompat(1940); } },
    { baris: 200, jalan: function (m) { m.lompat(170); } },

    /* --- 210-410: menyusun papan ------------------------------------------ */
    { baris: 210, jalan: function (m) { m.untuk('A', 1, 20, 1, 290); } },
    { baris: 220, jalan: function (m) { m.semaiCampur(detik(m)); } },
    /* 230 `DEFINT A-C` di baris 130 membuat A(), B(), dan C bilangan bulat —
       dan penugasan ke variabel bulat di BASIC MEMBULATKAN, bukan memotong.
       Jadi `RND*80` menghasilkan 0 sampai 80, bukan 0 sampai 79. Itu penting:
       tanpa pembulatan, hadiah ke-80 tidak akan pernah muncul, dan (lihat
       baris 310) papan ini tidak akan pernah selesai terisi. */
    { baris: 230, jalan: function (m) {
        m.v.A_[m.v.A] = Math.round(m.acak() * 80);
        if (m.v.A_[m.v.A] === 0) m.lompat(230);
      } },
    /* 240-260 menolak hadiah yang sudah terpilih — dan caranya keras:
       B=A menghentikan gelung dalam, lalu A=A-1 memaksa gelung luar
       mengulang nomor yang sama. Mengubah kedua pencacah dari dalam. */
    { baris: 240, jalan: function (m) { m.untuk('B', 1, m.v.A - 1, 1, 270); } },
    { baris: 250, jalan: function (m) {
        if (m.v.A_[m.v.B] === m.v.A_[m.v.A]) { m.v.B = m.v.A; m.v.A = m.v.A - 1; }
      } },
    { baris: 260, jalan: function (m) { m.lanjutkan('B'); } },
    /* 270 angka rahasianya dibuat DI DALAM gelung dua puluh putaran — jadi
       diundi dua puluh kali dan yang terakhir yang berlaku. */
    { baris: 270, jalan: function (m) { m.v.SC = Math.floor(m.acak() * 89) + 10; } },
    { baris: 280, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 290, jalan: function (m) { m.v.B_[0] = 1; } },
    { baris: 300, jalan: function (m) { m.untuk('A', 1, 20, 1, 370); } },
    /* 310 dan 340 juga membulatkan, jadi `C` bernilai 0 sampai 40. Petak 0
       sudah diblokir baris 290 (`B(0)=1`), jadi yang tersisa tepat 40 petak
       untuk 40 penempatan. Kalau pembulatannya dipotong jadi 0..39, petaknya
       tinggal 39 dan gelung penolakan ini berputar SELAMANYA. Satu keputusan
       tentang pembulatan yang menahan seluruh program. */
    { baris: 310, jalan: function (m) { m.v.C = Math.round(m.acak() * 40); } },
    { baris: 320, jalan: function (m) { m.semaiCampur(detik(m)); } },
    { baris: 330, jalan: function (m) {
        if (m.v.B_[m.v.C] === 0) m.v.B_[m.v.C] = m.v.A_[m.v.A];
        else m.lompat(310);
      } },
    { baris: 340, jalan: function (m) { m.v.C = Math.round(m.acak() * 40); } },
    { baris: 350, jalan: function (m) {
        if (m.v.B_[m.v.C] === 0) m.v.B_[m.v.C] = m.v.A_[m.v.A];
        else m.lompat(340);
      } },
    { baris: 360, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 370, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 40; m.v.A++) m.v.PV[m.v.A] = m.baca();
      } },
    { baris: 380, jalan: function (m) { m.untuk('A', 1, 80, 1, 410); } },
    { baris: 390, jalan: function (m) {
        m.v.PZ[m.v.A] = m.baca(); m.v.VL[m.v.A] = m.baca();
      } },
    { baris: 400, jalan: function (m) { m.lanjutkan('A'); } },
    /* 410 penutup subrutin 210 SEKALIGUS badan jebakan F1-F9. */
    { baris: 410, jalan: function (m) { m.kembali(); } },

    /* --- 420-620: kisi papan ---------------------------------------------- */
    { baris: 420, jalan: function (m) {
        m.cls(); m.warna(4, 0); m.locate(1, 3);
        m.cetak(m.chr(201)); m.barisBaru();
      } },
    { baris: 430, jalan: function (m) { m.untuk('A', 4, 74, 15, 450); } },
    { baris: 440, jalan: function (m) {
        m.locate(1, m.v.A);
        m.cetak(m.ulang(14, 205) + m.chr(203)); m.barisBaru();
      } },
    { baris: 450, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.locate(1, 78); m.cetak(m.chr(187)); m.barisBaru(); }
      ] },
    { baris: 460, jalan: function (m) { m.untuk('A', 2, 15, 2, 540); } },
    { baris: 470, jalan: function (m) { m.untuk('B', 3, 74, 15, 490); } },
    { baris: 480, jalan: function (m) {
        m.locate(m.v.A, m.v.B); m.cetak(m.chr(186));
      } },
    { baris: 490, bagian: [
        function (m) { m.lanjutkan('B'); },
        function (m) {
          m.locate(m.v.A, 78); m.cetak(m.chr(186)); m.barisBaru();
          m.locate(m.v.A + 1, 3);
          m.cetak(m.chr(204) + m.ulang(15, 205)); m.barisBaru();
        }
      ] },
    { baris: 500, jalan: function (m) { m.untuk('B', 18, 74, 15, 530); } },
    { baris: 510, jalan: function (m) {
        m.locate(m.v.A + 1, m.v.B);
        m.cetak(m.chr(206) + m.ulang(15, 205)); m.barisBaru();
      } },
    { baris: 520, bagian: [
        function (m) { m.lanjutkan('B'); },
        function (m) {
          m.locate(m.v.A + 1, 78); m.cetak(m.chr(185)); m.barisBaru();
        }
      ] },
    { baris: 530, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 540, jalan: function (m) { m.untuk('B', 3, 74, 15, 570); } },
    { baris: 550, jalan: function (m) {
        m.locate(16, m.v.B); m.cetak(m.chr(186));
      } },
    /* 560 memakai A sesudah gelungnya selesai — nilainya 16, jadi baris
       yang digambar ulang adalah baris 17, dan sebentar lagi ditimpa. */
    { baris: 560, bagian: [
        function (m) { m.lanjutkan('B'); },
        function (m) {
          m.locate(16, 78); m.cetak(m.chr(186)); m.barisBaru();
          m.locate(m.v.A + 1, 3);
          m.cetak(m.chr(204) + m.ulang(15, 205)); m.barisBaru();
        }
      ] },
    { baris: 570, jalan: function (m) {
        m.locate(17, 3); m.cetak(m.chr(200)); m.barisBaru();
      } },
    { baris: 580, jalan: function (m) { m.untuk('A', 4, 74, 15, 600); } },
    { baris: 590, jalan: function (m) {
        m.locate(17, m.v.A);
        m.cetak(m.ulang(14, 205) + m.chr(202)); m.barisBaru();
      } },
    { baris: 600, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.locate(17, 78); m.cetak(m.chr(188)); m.barisBaru(); }
      ] },
    { baris: 610, jalan: function (m) {
        m.locate(25, 25); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Game '); m.warna(3, 0);
      } },
    { baris: 620, jalan: function (m) { m.kembali(); } },

    /* --- 630-910: satu giliran -------------------------------------------- */
    { baris: 630, jalan: function (m) { m.v.C = 0; } },
    { baris: 640, jalan: function (m) { m.untuk('A', 2, 17, 2, 700); } },
    { baris: 650, jalan: function (m) { m.untuk('B', 2, 74, 15, 690); } },
    { baris: 660, jalan: function (m) {
        m.v.C = m.v.C + 1;
        if (m.v.B_[m.v.C] === 0) {
          m.locate(m.v.A, m.v.B + 2); m.spc(14); m.barisBaru();
          m.lompat(680);
        }
      } },
    { baris: 670, jalan: function (m) {
        m.locate(m.v.A, m.v.B + 2); m.warna(0, 7);
        m.cetak('      ' + m.v.PV[m.v.C] + '      '); m.warna(3, 0);
      } },
    { baris: 680, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 690, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 700, jalan: function (m) {
        for (m.v.X = 20; m.v.X <= 23; m.v.X++) {
          m.locate(m.v.X, 1); m.spc(79);
        }
      } },
    { baris: 710, jalan: function (m) { m.v.HOLD = 0; } },
    { baris: 720, jalan: function (m) {
        m.warna(15, 0); m.locate(20, 23);
        m.cetak(m.v.PL[m.v.T] + ',  What Is Your FIRST Choice?    ');
      } },
    { baris: 730, bagian: [
        function (m) { m.gosub(920); },
        function (m) { if (m.v.A === 0) m.gosub(990); else m.lompat(720); },
        function (m) { m.gosub(1110); }
      ] },
    { baris: 740, jalan: function (m) { m.v.HOLD = m.v.GS; } },
    { baris: 750, jalan: function (m) {
        m.locate(20, 1); m.spc(79); m.barisBaru();
      } },
    { baris: 760, jalan: function (m) {
        m.warna(15, 0); m.locate(20, 23);
        m.cetak(m.v.PL[m.v.T] + ',  What Is Your SECOND Choice?   ');
      } },
    { baris: 770, bagian: [
        function (m) { m.gosub(920); },
        function (m) { if (m.v.A === 0) m.gosub(990); else m.lompat(760); }
      ] },
    /* 780 kartu liar: kalau petak PERTAMA yang liar, tukar keduanya supaya
       aturan di bawah selalu memeriksa petak kedua saja. Satu SWAP yang
       menghemat separuh percabangannya. */
    { baris: 780, jalan: function (m) {
        if (m.v.VL[m.v.B_[m.v.HOLD]] === -3) {
          var t = m.v.HOLD; m.v.HOLD = m.v.GS; m.v.GS = t;
          m.lompat(830);
        }
      } },
    { baris: 790, jalan: function (m) {
        if (m.v.VL[m.v.B_[m.v.GS]] === -3) m.lompat(830);
      } },
    { baris: 800, jalan: function (m) {
        if (m.v.B_[m.v.GS] === m.v.B_[m.v.HOLD]) m.lompat(830);
      } },
    { baris: 810, jalan: function (m) {
        m.locate(20, 23);
        m.cetak('      SORRY ' + m.v.PL[m.v.T] +
                ', But No Match                ');
      } },
    { baris: 820, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 1500; m.v.X++) { /* jeda */ }
        m.v.T = m.v.T_[m.v.T];
        m.kembali();
      } },
    { baris: 830, jalan: function (m) {
        if (m.v.VL[m.v.B_[m.v.HOLD]] === -2) m.lompat(1540);
      } },
    { baris: 840, jalan: function (m) {
        if (m.v.VL[m.v.B_[m.v.HOLD]] === -1) m.lompat(1420);
      } },
    { baris: 850, jalan: function (m) {
        m.v.TBL[m.v.T][m.v.Q[m.v.T]] = m.v.B_[m.v.HOLD];
      } },
    { baris: 860, jalan: function (m) {
        m.v.B_[m.v.GS] = 0; m.v.B_[m.v.HOLD] = 0;
      } },
    { baris: 870, jalan: function (m) {
        m.locate(20, 22); m.cetak('        ALLRIGHT, A Match !!');
        m.spc(25); m.barisBaru();
      } },
    { baris: 880, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 6; m.v.A++) { m.suara(2000, 1); m.suara(1000, 1); }
      } },
    { baris: 890, jalan: function (m) {
        m.v.D = 0; m.v.Q[m.v.T] = m.v.Q[m.v.T] + 1;
      } },
    { baris: 900, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= m.v.Q[m.v.T]; m.v.A++) {
          m.v.D = m.v.D + m.v.VL[m.v.TBL[m.v.T][m.v.A]];
        }
      } },
    { baris: 910, bagian: [
        function (m) { m.gosub(3320); },
        function (m) { m.lompat(2470); }
      ] },

    /* --- 920-1130: membaca satu petak ------------------------------------- */
    { baris: 920, jalan: function (m) { m.v.GS = 0; } },
    { baris: 930, jalan: function (m) { m.gosub(3380); } },
    /* 940 mencari label petak di larik. Perhatikan cara keluarnya: `A=0`
       tanpa menutup gelungnya, lalu jatuh ke baris berikutnya. Bingkai FOR
       tertinggal terbuka — di GW-BASIC itu tumpukan yang perlahan penuh. */
    { baris: 940, jalan: function (m) {
        var i;
        for (i = 1; i <= 40; i++) {
          if (m.v.P1 === m.v.PV[i]) { m.v.GS = i; m.v.A = 0; return; }
        }
        m.v.A = 41;
        m.lompat(970);
      } },
    { baris: 950, jalan: function (m) { if (m.v.GS === m.v.HOLD) m.lompat(970); } },
    { baris: 960, jalan: function (m) { if (m.v.B_[m.v.GS] !== 0) m.kembali(); } },
    { baris: 970, jalan: function (m) {
        m.locate(20, 23);
        m.cetak('Invalid Choice. Please Try Again ' + m.v.PL[m.v.T]);
        m.spc(4); m.barisBaru();
      } },
    { baris: 980, bagian: [
        function (m) { m.gosub(1850); },
        function (m) {
          m.locate(20, 10); m.spc(60); m.barisBaru(); m.kembali();
        }
      ] },
    { baris: 990, jalan: function (m) {
        m.v.RW = (Math.trunc((m.v.GS - 1) / 5) + 1) * 2;
      } },
    /* 1000-1070 delapan baris yang mengerjakan satu pembagian. Kolomnya
       sebenarnya `((GS-1) MOD 5)`, tapi ditulis sebagai tangga IF menurun. */
    { baris: 1000, jalan: function (m) { m.v.XX = 36; } },
    ambang(1010, 36, 31), ambang(1020, 31, 26), ambang(1030, 26, 21),
    ambang(1040, 21, 16), ambang(1050, 16, 11), ambang(1060, 11, 6),
    ambang(1070, 6, 1),
    { baris: 1080, jalan: function (m) { m.v.COL = (m.v.GS - m.v.XX) * 15; } },
    { baris: 1090, jalan: function (m) {
        m.warna(11, 0); m.locate(m.v.RW, m.v.COL + 4);
        m.cetak(m.v.PZ[m.v.B_[m.v.GS]]); m.warna(3, 0);
      } },
    { baris: 1100, jalan: function (m) { m.kembali(); } },
    { baris: 1110, jalan: function (m) {
        if (m.v.VL[m.v.B_[m.v.GS]] < 0) m.lompat(1130);
      } },
    { baris: 1120, jalan: function (m) {
        m.locate(22, 25); m.cetak('        Worth ');
        m.cetakFormat(PTR, m.v.VL[m.v.B_[m.v.GS]]); m.barisBaru();
      } },
    { baris: 1130, jalan: function (m) { m.kembali(); } },

    /* --- 1140-1270: judul, nama pemain ------------------------------------ */
    { baris: 1140, jalan: function (m) {
        m.cls(); m.warna(15, 0); m.locate(2, 27);
        m.cetak('        M A T C H'); m.barisBaru();
      } },
    { baris: 1150, jalan: function (m) {
        m.locate(6, 23);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1160, bagian: [
        function (m) { m.gosub(1270); },
        function (m) {
          if (m.v.Z === 'Y' || m.v.Z === 'y') m.gosub(2030);
        },
        function (m) {
          if (m.v.Z === 'Y' || m.v.Z === 'y') m.lompat(1180);
        }
      ] },
    { baris: 1170, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(1160);
      } },
    ajar(1180, 10, 25, 'And Then Strike Enter Key'),
    { baris: 1185, jalan: function (m) {
        m.locate(6, 20);
        m.cetak('Player #1, Please Enter Your First Name ');
      } },
    { baris: 1190, bagian: [
        function (m) { m.gosub(3670); },
        function (m) { m.v.PL[1] = m.v.ZA; }
      ] },
    { baris: 1200, jalan: function (m) {
        m.locate(8, 20);
        m.cetak('Player #2, Please Enter Your First Name ');
      } },
    { baris: 1210, bagian: [
        function (m) { m.gosub(3670); },
        function (m) { m.v.PL[0] = m.v.ZA; }
      ] },
    /* 1220 DUA ANGKA YANG MENGGANTIKAN SELURUH PERCABANGAN GILIRAN.
       Sesudah baris ini, "lawan" ditulis T(T) di mana pun. */
    { baris: 1220, jalan: function (m) { m.v.T_[0] = 1; m.v.T_[1] = 0; } },
    ajar(1230, 10, 20, 'One Moment While I Generate A Game Board'),
    { baris: 1240, jalan: function (m) { m.gosub(210); } },
    { baris: 1250, jalan: function (m) { m.kembali(); } },
    { baris: 1260, jalan: function (m) {
        m.locate(25, 27); m.warna(14, 0);
        m.cetak('Strike Any Key To Continue'); m.warna(3, 0);
      } },
    { baris: 1270, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1270); else m.kembali();
      } },

    /* --- 1280-1350: masih ada pasangan tersisa? --------------------------- */
    { baris: 1280, jalan: function (m) { m.untuk('A', 1, 39, 1, 1340); } },
    { baris: 1290, jalan: function (m) { if (m.v.B_[m.v.A] === 0) m.lompat(1330); } },
    { baris: 1300, jalan: function (m) { m.untuk('B', m.v.A + 1, 40, 1, 1330); } },
    { baris: 1310, jalan: function (m) {
        if (m.v.B_[m.v.A] === m.v.B_[m.v.B]) m.lompat(1350);
      } },
    { baris: 1320, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 1330, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 1340, jalan: function (m) { m.v.FLAG = 1; } },
    { baris: 1350, jalan: function (m) { m.kembali(); } },

    /* --- 1360-1410: daftar hadiah pemenang -------------------------------- */
    { baris: 1360, jalan: function (m) {
        m.cls(); m.locate(1, 25);
        m.cetak(m.v.PL[m.v.T] + ' These Are Your Prizes'); m.barisBaru();
      } },
    { baris: 1370, jalan: function (m) { m.gosub(1640); } },
    { baris: 1380, jalan: function (m) {
        m.locate(m.v.C + 1, 43); m.cetak(m.ulang(12, 196)); m.barisBaru();
      } },
    { baris: 1390, jalan: function (m) {
        m.locate(m.v.C + 2, 20); m.cetak('Grand Total Of'); m.barisBaru();
        m.locate(m.v.C + 2, 44); m.cetakFormat(PTR, m.v.D); m.barisBaru();
      } },
    ajar(1400, 23, 25, 'Strike Any Key To Continue'),
    { baris: 1410, bagian: [
        function (m) { m.gosub(1270); },
        function (m) { m.lompat(1860); }
      ] },

    /* --- 1420-1530: TAKE ONE ---------------------------------------------- */
    { baris: 1420, jalan: function (m) {
        m.v.B_[m.v.GS] = 0; m.v.B_[m.v.HOLD] = 0;
      } },
    { baris: 1430, jalan: function (m) {
        if (m.v.Q[m.v.T_[m.v.T]] === 0) {
          m.locate(23, 23);
          m.cetak(m.v.PL[m.v.T_[m.v.T]] + ' Has No Prizes To Take ');
          m.barisBaru();
          m.lompat(900);
        }
      } },
    { baris: 1440, bagian: [
        function (m) { m.gosub(1850); },
        function (m) { m.cls(); }
      ] },
    { baris: 1450, bagian: [
        function (m) { m.v.T = m.v.T_[m.v.T]; },
        function (m) { m.gosub(1640); },
        function (m) { m.v.T = m.v.T_[m.v.T]; }
      ] },
    ajar(1460, 21, 23, '       Which Price Would You Like'),
    { baris: 1470, jalan: function (m) {
        m.locate(22, 35); m.cetak('To Take, ' + m.v.PL[m.v.T]);
      } },
    { baris: 1480, bagian: [
        function (m) { m.gosub(3510); },
        function (m) { m.v.B = parseInt(m.v.Z, 10) || 0; }
      ] },
    { baris: 1490, jalan: function (m) {
        if (m.v.B < 0 || m.v.B > m.v.Q[m.v.T_[m.v.T]] - 1) {
          m.locate(23, 30);
          m.cetak('Please Try Again ' + m.v.PL[m.v.T] + '    '); m.barisBaru();
          for (m.v.X = 1; m.v.X <= 2000; m.v.X++) { /* jeda */ }
          m.locate(23, 10); m.spc(60); m.barisBaru();
          m.lompat(1480);
        }
      } },
    { baris: 1500, jalan: function (m) {
        m.locate(22, 1); m.spc(79);
        m.locate(24, 1); m.spc(79);
      } },
    { baris: 1510, jalan: function (m) {
        m.v.TBL[m.v.T][m.v.Q[m.v.T]] = m.v.TBL[m.v.T_[m.v.T]][m.v.B];
      } },
    { baris: 1520, jalan: function (m) {
        m.v.TBL[m.v.T_[m.v.T]][m.v.B] = 0;
        m.v.Q[m.v.T] = m.v.Q[m.v.T] + 1;
      } },
    { baris: 1530, jalan: function (m) { m.lompat(1620); } },

    /* --- 1540-1630: LOSE ONE ---------------------------------------------- */
    { baris: 1540, jalan: function (m) {
        m.v.B_[m.v.GS] = 0; m.v.B_[m.v.HOLD] = 0;
      } },
    { baris: 1550, jalan: function (m) {
        if (m.v.Q[m.v.T] === 0) {
          m.locate(23, 32);
          m.cetak(m.v.PL[m.v.T] + ' Has No Prizes To Lose '); m.barisBaru();
          m.lompat(900);
        }
      } },
    { baris: 1560, bagian: [
        function (m) { m.gosub(1850); },
        function (m) { m.cls(); },
        function (m) { m.gosub(1640); }
      ] },
    ajar(1570, 21, 30, 'Which Prize Would You Like'),
    { baris: 1580, jalan: function (m) {
        m.locate(22, 35); m.cetak('To Lose, ' + m.v.PL[m.v.T]);
      } },
    { baris: 1590, bagian: [
        function (m) { m.gosub(3510); },
        function (m) { m.v.B = parseInt(m.v.Z, 10) || 0; }
      ] },
    /* 1600 SATU TANDA KUTIP YANG TIDAK PERNAH DITUTUP. Sesudah nama pemain,
       kutip pembuka membuat SISA BARISNYA jadi teks — termasuk `GOTO 1520`.
       Jadi pilihan yang tidak sah di sini mencetak potongan kode ke layar,
       lalu jatuh ke baris 1610 seolah pilihannya sah. */
    { baris: 1600, jalan: function (m) {
        if (m.v.B < 0 || m.v.B > m.v.Q[m.v.T] - 1) {
          m.locate(22, 23);
          m.cetak('    Please Try Again ' + m.v.PL[m.v.T] +
                  ':FOR X=1 TO 2000:NEXT:LOCATE 22,10:PRINT SPC(60):GOTO 1520');
          m.barisBaru();
        }
      } },
    { baris: 1610, jalan: function (m) {
        m.v.TBL[m.v.T_[m.v.T]][m.v.Q[m.v.T_[m.v.T]]] = m.v.TBL[m.v.T][m.v.B];
        m.v.TBL[m.v.T][m.v.B] = 0;
        m.v.Q[m.v.T_[m.v.T]] = m.v.Q[m.v.T_[m.v.T]] + 1;
      } },
    { baris: 1620, jalan: function (m) {
        m.v.B_[m.v.GS] = 0; m.v.B_[m.v.HOLD] = 0;
      } },
    { baris: 1630, bagian: [
        function (m) { m.gosub(3320); },
        function (m) { m.lompat(420); }
      ] },

    /* --- 1640-1740: daftar hadiah ----------------------------------------- */
    ajar(1640, 2, 20, 'Prize                         Value'),
    { baris: 1650, jalan: function (m) {
        m.locate(3, 20); m.cetak(m.ulang(35, 196)); m.barisBaru();
        m.v.C = 4; m.v.D = 0;
      } },
    { baris: 1660, jalan: function (m) { m.untuk('A', 0, m.v.Q[m.v.T] - 1, 1, 1740); } },
    { baris: 1670, jalan: function (m) { m.v.C = m.v.C + 1; } },
    { baris: 1680, jalan: function (m) { m.v['A$'] = spasi(18); } },
    { baris: 1690, jalan: function (m) {
        m.v['A$'] = (m.v.PZ[m.v.TBL[m.v.T][m.v.A]] + spasi(18)).slice(0, 18);
      } },
    { baris: 1700, jalan: function (m) {
        m.locate(m.v.C, 23); m.cetak(angka(m.v.A)); m.cetak(m.v['A$']);
      } },
    { baris: 1710, jalan: function (m) {
        m.cetakFormat(PTR, m.v.VL[m.v.TBL[m.v.T][m.v.A]]); m.barisBaru();
      } },
    { baris: 1720, jalan: function (m) {
        m.v.D = m.v.D + m.v.VL[m.v.TBL[m.v.T][m.v.A]];
      } },
    { baris: 1730, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 1740, jalan: function (m) { m.kembali(); } },

    /* --- 1750-1840: buka seluruh papan sesudah menang --------------------- */
    { baris: 1750, jalan: function (m) { m.v.C = 0; } },
    { baris: 1760, jalan: function (m) { m.untuk('A', 2, 17, 2, 1820); } },
    { baris: 1770, jalan: function (m) { m.untuk('B', 0, 72, 15, 1810); } },
    { baris: 1780, jalan: function (m) {
        m.v.C = m.v.C + 1;
        if (m.v.B_[m.v.C] === 0) m.lompat(1800);
      } },
    { baris: 1790, jalan: function (m) {
        m.locate(m.v.A, m.v.B + 4);
        m.cetak(m.v.PZ[m.v.B_[m.v.C]]); m.barisBaru();
      } },
    { baris: 1800, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 1810, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 1820, jalan: function (m) { m.locate(23, 1); m.spc(79); } },
    ajar(1830, 23, 24, 'Strike Any Key To See Your Prizes'),
    { baris: 1840, jalan: function (m) { m.lompat(1270); } },
    { baris: 1850, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 1500; m.v.A++) { /* jeda */ }
        m.kembali();
      } },

    /* --- 1860-2020: skor dan papan baru ----------------------------------- */
    { baris: 1860, bagian: [
        function (m) { m.gosub(1850); },
        function (m) { m.cls(); }
      ] },
    { baris: 1870, jalan: function (m) {
        m.v.MATCH[m.v.T] = m.v.MATCH[m.v.T] + 1;
      } },
    ajar(1880, 1, 35, 'The Score Is'),
    { baris: 1890, jalan: function (m) {
        m.locate(2, 25);
        m.cetak(m.v.PL[0] + ' Has Won' + angka(m.v.MATCH[0])); m.barisBaru();
      } },
    { baris: 1900, jalan: function (m) {
        m.locate(3, 25);
        m.cetak(m.v.PL[1] + ' Has Won' + angka(m.v.MATCH[1])); m.barisBaru();
      } },
    { baris: 1910, jalan: function (m) { m.locate(8, 35); m.warna(14, 0); } },
    juara(1920, 0), juara(1930, 1),
    { baris: 1940, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 40; m.v.A++) m.v.B_[m.v.A] = 0;
      } },
    { baris: 1950, jalan: function (m) { m.untuk('A', 0, m.v.Q[m.v.T] - 1, 1, 1970); } },
    { baris: 1960, jalan: function (m) {
        m.v.KEEP[m.v.T][m.v.A + 1] = m.v.TBL[m.v.T][m.v.A];
        m.v.TBL[m.v.T][m.v.A] = 0;
      } },
    { baris: 1970, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.v.KEEP[m.v.T][0] = m.v.Q[m.v.T] - 1; }
      ] },
    { baris: 1980, jalan: function (m) {
        m.v.Q[m.v.T] = 0; m.v.Q[m.v.T_[m.v.T]] = 0;
      } },
    { baris: 1990, jalan: function (m) { m.v.TBL[m.v.T_[m.v.T]][0] = 0; } },
    { baris: 2000, jalan: function (m) { m.v.FLAG = 0; } },
    ajar(2010, 23, 20, 'One Moment While I Generate A New Game Board'),
    { baris: 2020, bagian: [
        function (m) { m.ulangData(); },
        function (m) { m.gosub(210); },
        function (m) { m.gosub(1850); },
        function (m) { m.lompat(160); }
      ] },

    /* --- 2030-2230: petunjuk ---------------------------------------------- */
    { baris: 2030, jalan: function (m) { m.cls(); } },
    { baris: 2040, jalan: function (m) { m.untuk('A', 1, 23, 1, 2070); } },
    { baris: 2050, jalan: function (m) {
        m.locate(m.v.A, 1); m.cetak(m.chr(186));
        m.locate(m.v.A, 80); m.cetak(m.chr(186));
      } },
    { baris: 2060, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2070, jalan: function (m) {
        m.locate(1, 1);
        m.cetak(m.chr(201) + m.ulang(78, 205) + m.chr(187));
      } },
    { baris: 2080, jalan: function (m) {
        m.locate(23, 1);
        m.cetak(m.chr(200) + m.ulang(78, 205) + m.chr(188));
      } },
    { baris: 2090, jalan: function (m) {
        m.locate(3, 35); m.warna(15, 0); m.cetak('M A T C H'); m.barisBaru();
        m.warna(3, 0);
      } },
    ajar(2100,  5, 19, 'In this game, you will try to  match  prizes'),
    ajar(2110,  6, 19, 'on the game board before your  opponent does.'),
    ajar(2120,  8, 19, 'When you match a prize, you will be asked to'),
    ajar(2130,  9, 19, 'guess a number between 10 AND 99.'),
    ajar(2140, 10, 19, 'If you guess the secret number then You will'),
    ajar(2150, 11, 19, 'win the match.'),
    ajar(2160, 12, 19, 'I will tell you if you are to HIGH or to LOW.'),
    ajar(2170, 13, 19, 'You must win 2 matches to win the game.'),
    ajar(2180, 15, 19, 'If you do not guess the secret number before'),
    ajar(2190, 16, 19, 'all  possible  matches  have  been made then'),
    ajar(2200, 17, 19, 'the match  continues with a new  game  board'),
    ajar(2210, 18, 19, 'and a new secret number.'),
    ajar(2220, 20, 35, 'GOOD LUCK !!!'),
    { baris: 2230, bagian: [
        function (m) { m.gosub(1260); },
        function (m) { m.cls(); m.kembali(); }
      ] },

    /* --- 2240-2460: akhir permainan --------------------------------------- */
    { baris: 2240, bagian: [
        function (m) { m.gosub(2470); },
        function (m) { m.cls(); m.warna(3, 0); },
        function (m) { m.gosub(2360); }
      ] },
    { baris: 2250, jalan: function (m) { m.untuk('A', 0, m.v.KEEP[m.v.T][0], 1, 2280); } },
    { baris: 2260, jalan: function (m) {
        m.v.TBL[m.v.T][m.v.A] = m.v.KEEP[m.v.T][m.v.A + 1];
      } },
    { baris: 2270, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2280, jalan: function (m) { m.v.Q[m.v.T] = m.v.KEEP[m.v.T][0] + 1; } },
    { baris: 2290, jalan: function (m) { m.gosub(2380); } },
    { baris: 2300, jalan: function (m) {
        m.locate(m.v.C + 2, 48); m.cetak(m.ulang(12, 196)); m.barisBaru();
      } },
    { baris: 2310, jalan: function (m) {
        m.locate(m.v.C + 3, 25); m.cetak('Grand Total Of'); m.barisBaru();
        m.locate(m.v.C + 3, 48); m.cetakFormat(PTR, m.v.D); m.barisBaru();
      } },
    { baris: 2320, jalan: function (m) {
        m.locate(23, 25); m.cetak('Would You Like To Play Again? <Y/N>');
      } },
    { baris: 2330, bagian: [
        function (m) { m.gosub(1270); },
        function (m) {
          var z = m.v.Z;
          if (z === 'Y' || z === 'y') m.jalankan();
          else if (z !== 'N' && z !== 'n') m.lompat(2330);
        }
      ] },
    { baris: 2340, jalan: function (m) {
        m.cls(); m.locate(12, 25);
        m.cetak('Thank You For Playing Match'); m.barisBaru();
      } },
    { baris: 2350, jalan: function (m) { m.jalankan('MENU'); } },
    ajar(2360, 2, 25, 'Prize                         Value'),
    { baris: 2370, jalan: function (m) {
        m.locate(3, 25); m.cetak(m.ulang(35, 196)); m.barisBaru();
        m.v.C = 4; m.v.D = 0;
      } },
    { baris: 2380, jalan: function (m) { m.untuk('A', 0, m.v.Q[m.v.T] - 1, 1, 2460); } },
    { baris: 2390, jalan: function (m) { m.v.C = m.v.C + 1; } },
    { baris: 2400, jalan: function (m) { m.v['A$'] = spasi(23); } },
    { baris: 2410, jalan: function (m) {
        m.v['A$'] = (m.v.PZ[m.v.TBL[m.v.T][m.v.A]] + spasi(23)).slice(0, 23);
      } },
    { baris: 2420, jalan: function (m) {
        m.locate(m.v.C, 25); m.cetak(m.v['A$']);
      } },
    { baris: 2430, jalan: function (m) {
        m.cetakFormat(PTR, m.v.VL[m.v.TBL[m.v.T][m.v.A]]); m.barisBaru();
      } },
    { baris: 2440, jalan: function (m) {
        m.v.D = m.v.D + m.v.VL[m.v.TBL[m.v.T][m.v.A]];
      } },
    { baris: 2450, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2460, jalan: function (m) { m.kembali(); } },
    { baris: 2470, jalan: function () { /* REM kosong */ } },
    { baris: 2480, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 2000; m.v.X++) { /* jeda */ }
        m.kembali();
      } },
    data(2490), data(2500), data(2520), data(2530), data(2540), data(2550),
    data(2560), data(2570), data(2580), data(2590), data(2600), data(2610),
    data(2620), data(2630), data(2640), data(2650), data(2660), data(2670),
    data(2680), data(2690), data(2700), data(2710), data(2720), data(2730),
    data(2740), data(2750), data(2760), data(2770), data(2780), data(2790),
    data(2800), data(2810), data(2820), data(2830), data(2840), data(2850),
    data(2860), data(2870), data(2880), data(2890), data(2900), data(2910),
    data(2920), data(2930), data(2940), data(2950), data(2960), data(2970),
    data(2980), data(2990), data(3000), data(3010), data(3020), data(3030),
    data(3040), data(3050), data(3060), data(3070), data(3080), data(3090),
    data(3100), data(3110), data(3120), data(3130), data(3140), data(3150),
    data(3160), data(3170), data(3180), data(3190), data(3200), data(3210),
    data(3220), data(3230), data(3240), data(3250), data(3260), data(3270),
    data(3280), data(3290), data(3300), data(3310),

    /* --- 3320-3370: tebak angka rahasia ----------------------------------- */
    /* Perhatikan rentang yang diminta: 11 sampai 99. Yang dibuat baris 270:
       FIX(RND*89)+10, yaitu 10 sampai 98. Dua ujungnya sama-sama meleset. */
    { baris: 3320, jalan: function (m) {
        m.locate(22, 3); m.cetak(m.v.PL[m.v.T] + ', For ');
        m.cetakFormat(PTR, m.v.D);
        m.cetak(' In Prizes, Guess My Secret Number <11 to 99>');
      } },
    { baris: 3330, jalan: function (m) { m.gosub(3380); } },
    { baris: 3340, jalan: function (m) {
        if (m.v.GS === m.v.SC) {
          m.cetak('Congradulations ' + m.v.PL[m.v.T] + ' You WIN !!!');
          m.barisBaru();
          m.v.FLAG = 2;
          for (m.v.X = 1; m.v.X <= 5; m.v.X++) {
            m.suara(500, 1); m.suara(200, 1); m.suara(100, 2);
          }
        }
      } },
    { baris: 3350, jalan: function (m) {
        if (m.v.GS < m.v.SC) {
          m.cetak('   Sorry, Too Low. But Still Your Turn.'); m.barisBaru();
          m.suara(37, 15);
        }
      } },
    { baris: 3360, jalan: function (m) {
        if (m.v.GS > m.v.SC) {
          m.cetak('   Sorry, Too High. But Still Your Turn.'); m.barisBaru();
          m.suara(2000, 15);
        }
      } },
    { baris: 3370, bagian: [
        function (m) { m.gosub(1280); },
        function (m) { m.gosub(1850); },
        function (m) { m.kembali(); }
      ] },

    /* --- 3380-3500: membaca dua aksara ------------------------------------ */
    { baris: 3380, jalan: function (m) { if (m.inkey() !== '') m.lompat(3380); } },
    { baris: 3390, jalan: function (m) { m.v.P1 = ''; } },
    { baris: 3400, jalan: function (m) {
        m.v.P = m.inkey();
        if (m.v.P === m.chr(13) || m.v.P === '') m.lompat(3400);
      } },
    { baris: 3410, jalan: function (m) { if (m.v.P === m.chr(8)) m.lompat(3470); } },
    { baris: 3420, jalan: function (m) {
        if (m.v.P.length > 1) {
          m.lompat(m.v.P.slice(-1) === m.chr(75) ? 3450 : 3400);
        }
      } },
    { baris: 3430, jalan: function (m) {
        if (m.v.P < 'a' || m.v.P > 'z') m.lompat(3450);
      } },
    { baris: 3440, jalan: function (m) {
        m.v.P = m.chr(m.v.P.charCodeAt(0) - 32);
      } },
    { baris: 3450, jalan: function (m) {
        m.v.P1 = m.v.P1 + m.v.P; m.cetak(m.v.P);
        if (m.v.P1.length < 2) m.lompat(3400);
      } },
    { baris: 3460, jalan: function (m) {
        m.v.GS = parseInt(m.v.P1, 10) || 0; m.lompat(3490);
      } },
    { baris: 3470, jalan: function (m) {
        if (m.v.P1.length === 0) m.lompat(3400);
      } },
    { baris: 3480, jalan: function (m) {
        m.cetak(m.chr(29) + m.chr(32) + m.chr(29));
        m.v.P1 = m.v.P1.slice(0, m.v.P1.length - 1);
        m.lompat(3400);
      } },
    { baris: 3490, jalan: function (m) { m.locate(23, 20, 0); } },
    { baris: 3500, jalan: function (m) { m.kembali(); } },
    /* 3510-3570 penanya nomor hadiah. Backspace dan Enter sama-sama DITOLAK
       lalu menunggu lagi, jadi satu-satunya jalan keluar adalah menekan
       aksara apa pun — termasuk huruf, yang VAL()-nya nol. */
    { baris: 3510, jalan: function (m) { m.v.Z1 = ''; } },
    { baris: 3520, jalan: function (m) {
        m.locate(23, 30); m.cetak('Enter Choice Number ');
      } },
    { baris: 3530, jalan: function (m) { if (m.inkey() !== '') m.lompat(3530); } },
    { baris: 3540, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3540);
      } },
    { baris: 3550, jalan: function (m) { if (m.v.Z === m.chr(13)) m.lompat(3540); } },
    { baris: 3560, jalan: function (m) { if (m.v.Z === m.chr(8)) m.lompat(3540); } },
    { baris: 3570, jalan: function (m) { m.cetak(m.v.Z); m.kembali(); } },

    /* --- 3580-3660: F10 ---------------------------------------------------- */
    { baris: 3580, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos();
      } },
    { baris: 3590, jalan: function (m) {
        m.locate(25, 22); m.warna(15, 0);
        m.cetak('Do You Wish To Leave This Game? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 3600, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3600);
      } },
    { baris: 3610, jalan: function (m) {
        if (m.v.Z === 'Y' || m.v.Z === 'y') m.jalankan('MENU');
      } },
    { baris: 3620, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') m.lompat(3640);
      } },
    { baris: 3630, jalan: function (m) { m.lompat(3600); } },
    { baris: 3640, jalan: function (m) { m.locate(25, 1); m.spc(78); } },
    { baris: 3650, jalan: function (m) {
        m.locate(25, 25); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Game '); m.warna(3, 0);
      } },
    { baris: 3660, jalan: function (m) {
        m.locate(m.v.XLIN, m.v.XPOS); m.jebakan(10, true); m.kembali();
      } },

    /* --- 3670-3780: penyunting nama --------------------------------------- */
    { baris: 3670, jalan: function (m) { m.v.ZH = ''; } },
    { baris: 3680, jalan: function (m) { if (m.inkey() !== '') m.lompat(3680); } },
    { baris: 3690, jalan: function (m) {
        m.v.ZI = m.inkey();
        if (m.v.ZI === '') m.lompat(3690);
      } },
    { baris: 3700, jalan: function (m) {
        if (m.v.ZI === m.chr(13)) {
          m.v.ZA = ((m.v.ZH || '') + spasi(8)).slice(0, 8);
          m.kembali();
        }
      } },
    { baris: 3710, jalan: function (m) { if (m.v.ZI === m.chr(8)) m.lompat(3770); } },
    { baris: 3720, jalan: function (m) {
        if (m.v.ZI.length > 1) {
          m.lompat(m.v.ZI.slice(-1) === m.chr(75) ? 3770 : 3680);
        }
      } },
    { baris: 3730, jalan: function (m) {
        if ((m.v.ZH || '').length > 7) m.lompat(3690);
      } },
    { baris: 3740, jalan: function (m) {
        if (m.v.ZI < 'a' || m.v.ZI > 'z') m.lompat(3760);
      } },
    { baris: 3750, jalan: function (m) {
        m.v.ZI = m.chr(m.v.ZI.charCodeAt(0) - 32);
      } },
    { baris: 3760, jalan: function (m) {
        m.v.ZH = (m.v.ZH || '') + m.v.ZI; m.cetak(m.v.ZI); m.lompat(3690);
      } },
    { baris: 3770, jalan: function (m) {
        if ((m.v.ZH || '').length < 1) m.lompat(3690);
      } },
    { baris: 3780, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.ZH = m.v.ZH.slice(0, m.v.ZH.length - 1);
        m.lompat(3690);
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function data(nomor) { return { baris: nomor, jalan: function () { } }; }
  function spasi(n) { var s = '', i; for (i = 0; i < n; i++) s += ' '; return s; }
  function angka(n) {
    var b = Math.round(n * 100) / 100;
    return (b < 0 ? '' : ' ') + String(b) + ' ';
  }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function ambang(nomor, batas, jadi) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.GS < batas) m.v.XX = jadi;
    } };
  }

  function juara(nomor, siapa) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.MATCH[siapa] === 2) {
        m.cetak(m.v.PL[siapa] + ' Wins !!!!'); m.barisBaru();
        m.lompat(2240);
      }
    } };
  }

  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  /* Empat puluh label petak, lalu delapan puluh pasangan nama-harga. */
  var DATA = [
    'A1', 'B1', 'C1', 'D1', 'E1', 'A2', 'B2', 'C2', 'D2', 'E2',
    'A3', 'B3', 'C3', 'D3', 'E3', 'A4', 'B4', 'C4', 'D4', 'E4',
    'A5', 'B5', 'C5', 'D5', 'E5', 'A6', 'B6', 'C6', 'D6', 'E6',
    'A7', 'B7', 'C7', 'D7', 'E7', 'A8', 'B8', 'C8', 'D8', 'E8',
    '   COLOR TV   ', 650, '  WINNABAGO   ', 13540,
    ' SWISS  WATCH ', 250, '  $5000 CASH  ', 5000,
    '   $1 CASH    ', 1, '   IBM P.C.   ', 2300,
    ' FRIENDLYWARE ', 49.95, 'TRIP TO MEXICO', 3000,
    'TRIP TO  JAPAN', 6000, '  MINK  COAT  ', 2300,
    '10 SPEED  BIKE', 135, 'BOX OF BANANAS', 5,
    '  SPEED BOAT  ', 14000, '  NEW  TIRES  ', 150,
    ' DISNEY  TRIP ', 3000, '  SNOWMOBILE  ', 3200,
    'MINOLTA CAMERA', 550, '   BETAMAX    ', 1150,
    'SEWING MACHINE', 250, '  BRASS  BED  ', 800,
    '  JACUZZI SPA ', 4300, '  DISHWASHER  ', 320,
    '    WASHER    ', 340, '    DRYER     ', 320,
    '   TAKE ONE   ', -1, '   LOSE ONE   ', -2,
    '  WILD  CARD  ', -3, '   B&W  T-V   ', 95,
    '  VOLKSWAGEN  ', 5500, ' APPLE  CIDER ', 3.98,
    ' JUG OF  MILK ', 2.05, '  LAWN MOWER  ', 230,
    '  $500  CASH  ', 500, '  DISK DRIVE  ', 350,
    'ENCYCLOPEDIAS ', 650, '   USED CAR   ', 20,
    '    TOUPEE    ', 29, '  BLOND  WIG  ', 50,
    'CASSETTE  TAPE', 65, '    STEREO    ', 1000,
    ' TURKEY  FARM ', 1200, '  GOLD RING   ', 300,
    ' DIAMOND RING ', 2300, '  TIRED OVEN  ', 25,
    '  PATIO  SET  ', 490, ' BEDROOM  SET ', 900,
    '  SAIL  BOAT  ', 6000, '  BRICK HOME  ', 55000,
    ' MOBILE  HOME ', 21000, 'SHRIMP  DINNER', 25,
    '  SURF BOARD  ', 250, '  GOLF CLUBS  ', 550,
    'SWIMMING  POOL', 10000, '  BRIEF CASE  ', 65,
    ' NEW WARDROBE ', 800, ' SILK  SHEETS ', 125,
    '  WATER  BED  ', 450, '  WATER SKIS  ', 120,
    'OUNCE OF  GOLD', 500, ' BAR OF  SOAP ', 0.25,
    ' PET SQURRIEL ', 75, ' OCEAN CRUISE ', 5400,
    ' ROLEX CAMERA ', 90, 'SNORKEL & FINS', 65,
    'LEATHER WALLET', 10, 'MX-80  PRINTER', 550,
    'BYTE  MAGAZINE', 3, ' MOTOR  CYCLE ', 3000,
    '  MINI  BIKE  ', 150, '    MOPED     ', 450,
    ' SILVER  BOWL ', 250, '  TV  DINNER  ', 1,
    ' FROZEN PIZZA ', 2, ' AM-FM  RADIO ', 25,
    '   CB-RADIO   ', 140, ' TAMPA NUGGET ', 0.75,
    '   BED LAMP   ', 15, ' 6 PACK/COORS ', 3.15,
    '   SWING SET  ', 230, '   SKILL SAW  ', 55
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MATCH'] = {
    nama: 'MATCH',
    judul: 'Match',
    sumber: 'MATCH',
    berkas: 'run/MATCH.BAS',
    tabel: tabel,
    benih: 13,
    data: DATA,

    arsitektur: {
      judul: 'Alur MATCH.BAS',
      simpul: [
        { id: 'siap', baris: '1140-1250', jenis: 'mulai',
          teks: ['Petunjuk, dua nama pemain,', 'T(0)=1 dan T(1)=0'] },
        { id: 'papan', baris: '210-410',
          teks: ['20 hadiah dari 80,', 'tiap hadiah ditaruh dua kali'] },
        { id: 'pilih', baris: '720-770', jenis: 'putusan',
          teks: ['Pemain menyebut dua petak', 'lewat labelnya (A1..E8)'] },
        { id: 'cocok', baris: '780-800', jenis: 'putusan',
          teks: ['Cocok? Kartu liar', 'cocok dengan apa pun'] },
        { id: 'ambil', baris: '1420-1530', jenis: 'subrutin',
          teks: ['TAKE ONE: rampas', 'satu hadiah lawan'] },
        { id: 'buang', baris: '1540-1630', jenis: 'subrutin',
          teks: ['LOSE ONE: serahkan', 'satu hadiah sendiri'] },
        { id: 'tebak', baris: '3320-3370',
          teks: ['Tebak angka rahasia;', 'terlalu tinggi atau rendah'] },
        { id: 'habis', baris: '1280-1350', jenis: 'putusan',
          teks: ['Masih ada pasangan?'] },
        { id: 'ronde', baris: '1860-2020',
          teks: ['Menang satu ronde:', 'hadiah disimpan, papan baru'] },
        { id: 'usai', baris: '2240-2350', jenis: 'keluar',
          teks: ['Dua ronde:', 'daftar hadiah pemenang'] }
      ],
      panah: [
        { dari: 'siap', ke: 'papan' },
        { dari: 'papan', ke: 'pilih' },
        { dari: 'pilih', ke: 'cocok' },
        { dari: 'cocok', ke: 'pilih', label: 'tidak cocok, ganti giliran' },
        { dari: 'cocok', ke: 'ambil', label: 'TAKE ONE' },
        { dari: 'cocok', ke: 'buang', label: 'LOSE ONE' },
        { dari: 'ambil', ke: 'tebak' },
        { dari: 'buang', ke: 'tebak' },
        { dari: 'cocok', ke: 'tebak', label: 'hadiah biasa' },
        { dari: 'tebak', ke: 'habis', label: 'tebakan salah' },
        { dari: 'habis', ke: 'pilih', label: 'masih ada pasangan' },
        { dari: 'habis', ke: 'papan', label: 'papan habis: papan baru' },
        { dari: 'tebak', ke: 'ronde', label: 'tebakan benar' },
        { dari: 'ronde', ke: 'papan', label: 'ronde berikutnya' },
        { dari: 'ronde', ke: 'usai', label: 'menang dua ronde' }
      ]
    },

    pseudokode: [
      { baris: 1220, tingkat: 0, teks: '<code>T(0)=1 : T(1)=0</code> &mdash; <b>dua angka yang menggantikan seluruh percabangan giliran</b>' },
      { baris: 210, tingkat: 0, teks: 'undi 20 hadiah dari 80, tolak yang sudah terpilih' },
      { baris: 270, tingkat: 1, teks: 'angka rahasia = <code>FIX(RND*89)+10</code> &rarr; <b>10 sampai 98</b>' },
      { baris: 300, tingkat: 0, teks: 'taruh tiap hadiah <b>dua kali</b> di petak kosong acak' },
      { baris: 720, tingkat: 0, teks: '<b>ULANG:</b> pemain menyebut dua petak lewat labelnya' },
      { baris: 780, tingkat: 1, teks: 'kartu liar? <code>SWAP</code> supaya syarat di bawah cukup memeriksa satu sisi' },
      { baris: 800, tingkat: 1, teks: 'isinya sama? cocok' },
      { baris: 840, tingkat: 2, teks: 'TAKE ONE / LOSE ONE: satu hadiah berpindah tangan' },
      { baris: 3320, tingkat: 2, teks: 'tebak angka rahasia &mdash; <b>diminta 11 sampai 99</b>' },
      { baris: 820, tingkat: 1, teks: 'tidak cocok? <code>T = T(T)</code> &mdash; giliran lawan' },
      { baris: 1280, tingkat: 1, teks: 'tidak ada pasangan tersisa? papan baru, angka rahasia baru' },
      { baris: 1920, tingkat: 0, teks: 'menang dua ronde &rarr; permainan selesai' }
    ],

    perintahAsli: 'run\\MATCH.bat',
    catatanAsli: 'Di DOSBox-X tiap pasangan yang cocok berbunyi enam kali ' +
      'naik-turun, dan tebakan terlalu rendah berbunyi 37 Hz &mdash; nada ' +
      'paling rendah yang bisa dibuat pengeras suara PC.',

    penyimpangan: [
      '<b>Tiga larik diganti namanya:</b> <code>A(20)</code> jadi ' +
      '<code>A_</code>, <code>B(40)</code> jadi <code>B_</code>, ' +
      '<code>T(1)</code> jadi <code>T_</code>. Ketiganya punya kembaran ' +
      'skalar &mdash; dan <code>T</code> yang paling penting: skalarnya ' +
      'adalah giliran, lariknya adalah tabel lawan.',

      '<b><code>SOUND</code> diam.</b>',

      '<b>Pengacaknya berbenih tetap</b>, jadi susunan papan dan angka ' +
      'rahasianya selalu sama tiap penelusuran.',

      '<b>Baris 940 ditulis ulang sebagai gelung JavaScript biasa.</b> ' +
      'Aslinya keluar dari <code>FOR</code> dengan <code>A=0</code> tanpa ' +
      'menutup gelungnya &mdash; yang di GW-BASIC meninggalkan bingkai ' +
      '<code>FOR</code> terbuka di tumpukan. Penelusur tidak meniru ' +
      'kebocoran itu; yang ditiru cuma hasilnya.'
    ],

    pelajaran: {
      ringkas: 'Permainan ingatan berhadiah. Yang layak dipelajari: lawan ' +
        'sebagai pencarian tabel, dan satu tanda kutip yang mengubah kode ' +
        'jadi teks.',
      pelajari: [
        ['Lawan adalah pencarian tabel',
         'Baris 1220: <code>T(0)=1:T(1)=0</code>. Sesudah itu, "pemain lain" ' +
         'ditulis <code>T(T)</code> di mana pun &mdash; dan ganti giliran ' +
         'cukup <code>T=T(T)</code>. <b>Tidak ada satu pun <code>IF</code> ' +
         'yang menanyakan siapa yang sedang bermain</b> di seluruh program. ' +
         'Dua angka menggantikan puluhan percabangan.'],
        ['SWAP yang menghemat separuh percabangan',
         'Kartu liar bisa berada di petak pertama atau kedua. Alih-alih ' +
         'menulis dua rangkaian syarat, baris 780 <code>SWAP HOLD,GS</code> ' +
         'kalau yang liar ada di depan &mdash; sesudah itu aturan di bawahnya ' +
         'cukup memeriksa satu sisi saja.'],
        ['Menandai petak kosong dengan nol',
         'Petak yang sudah terbuka diberi nilai 0, dan <code>PZ(0)</code> ' +
         'kebetulan string kosong. Jadi menggambar ulang papan tidak perlu ' +
         'tahu apa-apa soal "sudah dibuka" &mdash; sama seperti kartu nomor ' +
         'nol di 21.BAS.'],
        ['Hadiah yang disimpan antar-ronde',
         'Baris 1950-1970 memindahkan hadiah pemenang dari ' +
         '<code>TBL()</code> ke <code>KEEP()</code> sebelum papan dikosongkan, ' +
         'dan baris 2250-2280 mengembalikannya di akhir permainan. Satu larik ' +
         'untuk yang berjalan, satu untuk yang disimpan.']
      ],
      hindari: [
        ['Satu tanda kutip yang mengubah kode jadi teks',
         'Baris 1600: <code>PRINT"    Please Try Again "PL(T)":FOR X=1 TO ' +
         '2000:NEXT:...:GOTO 1520</code>. Kutip sesudah <code>PL(T)</code> ' +
         'membuka string yang <b>tidak pernah ditutup</b>, jadi sisa barisnya ' +
         '&mdash; termasuk <code>GOTO 1520</code> &mdash; tercetak ke layar ' +
         'alih-alih dijalankan. Pilihan yang tidak sah lolos begitu saja.'],
        ['Rentang yang tidak cocok dengan yang diminta',
         'Baris 270 membuat angka <b>10 sampai 98</b>; baris 3320 meminta ' +
         '"<b>11 to 99</b>". Menebak 99 tidak akan pernah benar, dan 10 tidak ' +
         'pernah ditawarkan. Dua ujung, dua kesalahan pagar-tiang.'],
        ['Angka rahasia yang diundi dua puluh kali',
         'Baris 270 ada <b>di dalam</b> gelung dua puluh putaran yang memilih ' +
         'hadiah. Sembilan belas undian pertama dibuang; yang terakhir yang ' +
         'berlaku. Tidak salah, cuma sembilan belas kali lebih banyak dari ' +
         'yang perlu.'],
        ['Keluar dari FOR tanpa menutupnya',
         'Baris 940: <code>IF P1=PV(A) THEN GS=A:A=0 ELSE NEXT</code>. ' +
         'Cabang yang berhasil tidak pernah menjalankan <code>NEXT</code>, ' +
         'jadi bingkai <code>FOR</code>-nya tertinggal di tumpukan. Tiap ' +
         'tebakan yang benar menyisakan satu.'],
        ['Mengubah kedua pencacah gelung dari dalam',
         'Baris 250: <code>IF A(B)=A(A) THEN B=A:A=A-1</code>. Satu baris ' +
         'yang menghentikan gelung dalam DAN memundurkan gelung luar. ' +
         'Bekerja, dan mustahil dibaca sekali lewat.']
      ]
    },

    penjelasan: [
      { judul: 'Dua angka yang menggantikan seluruh percabangan giliran',
        isi: [
          'Permainan dua pemain selalu punya masalah yang sama: di mana pun ' +
          'kode menyebut "pemain ini", ia juga perlu menyebut "pemain itu".',
          'Cara biasa: <code>IF T=0 THEN ... ELSE ...</code> di setiap tempat.',
          'Cara program ini, baris 1220:',
          '<code>1220 T(0)=1:T(1)=0</code>',
          'Sebuah larik dua elemen yang isinya "lawan dari 0 adalah 1" dan ' +
          '"lawan dari 1 adalah 0". Sesudah itu:',
          '<code>T(T)</code> berarti "pemain lain", di mana pun.<br>' +
          '<code>T=T(T)</code> berarti "ganti giliran".',
          'Lihat baris 1610, yang memindahkan hadiah ke lawan:',
          '<code>TBL(T(T),Q(T(T)))=TBL(T,B)</code>',
          'Tidak ada <code>IF</code>. Tidak ada nama pemain. Cuma indeks yang ' +
          'menunjuk ke tempat yang benar.',
          'Ini pola <b>tabel pencarian menggantikan percabangan</b> &mdash; ' +
          'sama seperti tabel hasil di FOOTBALL.BAS dan tabel potongan garis ' +
          'di DRAW.BAS, tapi dipakai untuk sesuatu yang jauh lebih kecil: ' +
          'satu bit.',
          'Harganya: <code>T</code> skalar dan <code>T()</code> larik adalah ' +
          'dua benda berbeda dengan nama yang sama. BASIC membedakannya, ' +
          'pembaca manusia belum tentu.'
        ] },
      { judul: 'Satu tanda kutip yang mengubah kode jadi teks',
        isi: [
          'Baris 1600, apa adanya:',
          '<code>1600 IF B&lt;0 OR B&gt;Q(T)-1 THEN LOCATE 22,23:PRINT"    ' +
          'Please Try Again "PL(T)":FOR X=1 TO 2000:NEXT:LOCATE 22,10:PRINT ' +
          'SPC(60):GOTO 1520</code>',
          'Hitung tanda kutipnya. Ada empat: pembuka dan penutup untuk ' +
          '"    Please Try Again ", lalu <b>satu lagi</b> sesudah ' +
          '<code>PL(T)</code> &mdash; dan tidak ada yang menutupnya.',
          'BASIC membaca kutip itu sebagai awal string baru, dan string di ' +
          'BASIC boleh berakhir di ujung baris. Jadi seluruh sisanya, ' +
          '<code>:FOR X=1 TO 2000:NEXT:LOCATE 22,10:PRINT SPC(60):GOTO 1520</code>, ' +
          'menjadi <b>teks yang dicetak ke layar</b>.',
          'Bandingkan dengan baris 1490, yang mengerjakan hal yang sama untuk ' +
          '"TAKE ONE" &mdash; di situ kutipnya benar, dan barisnya bekerja.',
          'Akibatnya: kalau pemain memasukkan nomor hadiah yang tidak sah di ' +
          'layar "LOSE ONE", program mencetak sepotong kode BASIC ke layar, ' +
          'lalu <b>jatuh ke baris 1610</b> dan memindahkan hadiah nomor itu ' +
          'juga &mdash; padahal nomornya di luar rentang.',
          'Yang membuat cacat ini bertahan: ia hanya muncul kalau pemain ' +
          'salah ketik, di salah satu dari dua kartu istimewa, yang ' +
          'kemungkinan munculnya kecil. Diuji sekali dengan masukan yang ' +
          'benar, semuanya tampak beres.',
          'Di penelusur, baris 1600 ditulis apa adanya &mdash; termasuk ' +
          'teksnya. Pasang titik henti di situ dan masukkan nomor yang salah ' +
          'untuk melihatnya.'
        ] },
      { judul: 'Delapan baris untuk satu pembagian',
        isi: [
          'Petak papan bernomor 1 sampai 40, dan harus diterjemahkan ke baris ' +
          'dan kolom layar. Barisnya, baris 990:',
          '<code>990 RW=(INT((GS-1)/5)+1)*2</code>',
          'Rapi. Kolomnya, baris 1000-1080:',
          '<code>1000 XX=36</code><br>' +
          '<code>1010 IF GS&lt;36 THEN XX=31</code><br>' +
          '<code>1020 IF GS&lt;31 THEN XX=26</code><br>' +
          '&hellip; enam baris lagi &hellip;<br>' +
          '<code>1080 COL=(GS-XX)*15</code>',
          'Delapan baris yang mengerjakan apa yang bisa ditulis ' +
          '<code>COL=((GS-1) MOD 5)*15</code>.',
          'Kenapa? Barangkali karena penulisnya tidak tahu <code>MOD</code>, ' +
          'atau karena tangga <code>IF</code> terasa lebih bisa dipercaya. ' +
          'Yang jelas: <b>rumus barisnya dan rumus kolomnya ditulis dengan ' +
          'dua gaya yang sama sekali berbeda</b>, padahal keduanya menjawab ' +
          'pertanyaan yang sama.',
          'Bahwa keduanya benar tidak membuatnya setara. Yang satu bisa ' +
          'dibaca sekali lewat; yang satu lagi harus ditelusuri delapan kali ' +
          'untuk dipercaya. Di penelusur, itu benar-benar delapan langkah.'
        ] }
    ]
  };
})(window);
