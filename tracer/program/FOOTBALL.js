/* ===========================================================================
   FOOTBALL.js — porting minimalis FOOTBALL.BAS sebagai tabel baris.

   Program kedua puluh: "Head Coach". Sepak bola Amerika, satu lapangan teks,
   dan seluruh hasil permainannya diambil dari SATU tabel 10x5.

   Yang membuatnya layak ditelusuri: tabel itu punya CACAT INDEKS yang tidak
   pernah ketahuan selama empat puluh tahun.

       590  FOR I=1 TO 10:FOR J=1 TO 5:READ YRD(I,J):NEXT J,I
       1790 RW=FIX(R)                      ' R = RND*10, jadi RW = 0..9

   Tabelnya diisi baris 1 sampai 10. Yang dibaca baris 0 sampai 9. Akibatnya:

     - Baris ke-10 tabel TIDAK PERNAH DIPAKAI.
     - Baris ke-0 tidak pernah diisi, jadi isinya nol semua — dan satu dari
       sepuluh permainan SELALU menghasilkan tepat nol yard, apa pun taktik
       yang dipilih kedua belah pihak.

   Cacat itu tidak membuat program berhenti, tidak memberi pesan galat, dan
   bahkan terasa masuk akal waktu dimainkan ("kadang-kadang memang mentok").

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `YRD()` jadi `YRD_` (tidak ada kembaran skalar, tapi dijaga seragam
     dengan port lain? tidak — di sini namanya tetap `YRD`).
   - `PLAY` dan `SOUND` diam. Program ini punya EMPAT lagu utuh, termasuk
     satu sepanjang dua belas baris di 3190-3300.
   - `COLOR 31` di baris 3450 ("Two Minute Warning") tidak berkedip.
   - Pengacaknya berbenih tetap; `RIGHT$(TIME$,2)` di baris 1750 memakai jam
     penelusur yang maju tetap.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    rem(10),
    { baris: 20, jalan: function (m) {
        m.pasangJebakan(10, 3040); m.jebakan(10, true);
      } },
    { baris: 30, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 1800); m.jebakan(m.v.A, true);
        }
      } },
    { baris: 40, jalan: function (m) { m.warna(3, 0); m.cls(); } },
    { baris: 50, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 60, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1); m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 70, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 80, jalan: function (m) {
        m.warna(15, 0); m.locate(2, 30);
        m.cetak('H E A D   C O A C H'); m.barisBaru();
      } },
    { baris: 90, jalan: function (m) {
        m.locate(5, 22, 0);
        m.cetak('Would You Like Instructions ? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 100, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(100);
      } },
    { baris: 110, jalan: function (m) {
        if (m.v['RESP$'] === 'n' || m.v['RESP$'] === 'N') m.lompat(340);
      } },
    ajar(120,  3, 26, 'Welcome to the FRIENDLY BOWL'),
    ajar(130,  4, 26, '----------------------------'),
    ajar(140,  5, 13, 'You are about to match wits against the I.B.M. Personnal'),
    ajar(150,  6, 11, 'Computer in a game of Football. You will be playing  N F L'),
    ajar(160,  7, 11, 'standard rules for the most part. One of the major changes'),
    ajar(170,  8, 11, 'in the rules we will play by is that a quarter is composed'),
    ajar(180,  9, 11, 'of  30  plays as opposed to  15  minutes.   The Two Minute'),
    ajar(190, 10, 11, 'Warning will be given after  24  plays.'),
    ajar(200, 11, 13, 'At the beginning of the game,you will have the option of'),
    ajar(210, 12, 11, 'kicking or receiving.  If you opt to receive,  you will be'),
    ajar(220, 13, 11, 'given the ball on the 20 yard line. During the 1st and 3rd'),
    ajar(230, 14, 11, 'quarters, you will be moving form left to right and in the'),
    ajar(240, 15, 11, '2nd  and  4th quarters, just the opposite.  You may choose'),
    ajar(250, 16, 11, '1  of  7 different offensive plays. You may punt or try to'),
    ajar(260, 17, 11, 'kick a  field  goal on any down,  but take some advice and'),
    ajar(270, 18, 11, 'do not try from more than  45  yards  out.  If you fail to'),
    ajar(280, 19, 11, 'get a first down,  I will take possesion of the ball.  You'),
    ajar(290, 20, 11, 'may now select any  1  of  5 defensives to try and keep me'),
    ajar(300, 21, 11, 'from scoring.'),
    { baris: 310, jalan: function (m) {
        m.warna(15, 0); m.locate(25, 28, 0);
        m.cetak('Strike Any Key To Continue'); m.warna(3, 0);
      } },
    { baris: 320, jalan: function (m) { if (m.inkey() !== '') m.lompat(320); } },
    { baris: 330, jalan: function (m) {
        m.v['YES$'] = m.inkey();
        if (m.v['YES$'] === '') m.lompat(330);
      } },
    { baris: 340, bagian: [
        function (m) { m.cls(); m.v.XX = 1; m.v.YY = 1; },
        function (m) { m.gosub(3100); }
      ] },
    /* 350-360 dua penanda bola: CHR$(16) segitiga KANAN untuk tim yang
       menyerang ke kanan, CHR$(17) segitiga KIRI untuk yang sebaliknya. */
    { baris: 350, jalan: function (m) { m.v['C$'] = m.chr(16); } },
    { baris: 360, jalan: function (m) {
        m.v.VSR = 0; m.v.HSR = 0; m.v.DN = 1; m.v.YDS = 10;
        m.v.QTR = 1; m.v.PLS = 0;
        m.v['M$'] = m.chr(17); m.v['Y$'] = m.chr(16);
        m.v.JAM = 23;
        m.dim('YRD', 10, 5);
      } },
    { baris: 370, jalan: function (m) { m.warna(15, 0); } },
    /* 380-410 bingkai papan skor, digambar berkeliling: atas ke kanan,
       kanan ke bawah, bawah ke kiri, kiri ke atas. */
    { baris: 380, jalan: function (m) {
        for (m.v.J = 26; m.v.J <= 55; m.v.J++) {
          m.locate(1, m.v.J); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 390, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 8; m.v.I++) {
          m.locate(m.v.I, 54); m.cetak(m.ulang(2, 219)); m.barisBaru();
        }
      } },
    { baris: 400, jalan: function (m) {
        for (m.v.J = 55; m.v.J >= 26; m.v.J--) {
          m.locate(8, m.v.J); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 410, jalan: function (m) {
        for (m.v.I = 8; m.v.I >= 1; m.v.I--) {
          m.locate(m.v.I, 26); m.cetak(m.ulang(2, 219)); m.barisBaru();
        }
      } },
    { baris: 420, jalan: function (m) { m.warna(3, 0); } },
    ajar(430, 3, 30, 'HOME     QTR  VISITORS'),
    { baris: 440, jalan: function (m) {
        m.locate(4, 30); m.cetak(angka(m.v.HSR));
        m.tab(39); m.cetak(angka(m.v.QTR));
        m.tab(46); m.cetak(angka(m.v.VSR)); m.barisBaru();
      } },
    { baris: 450, jalan: function (m) {
        m.locate(6, 30); m.cetak('DOWN'); m.barisBaru();
        m.locate(6, 38); m.cetak('YARDS TO GO'); m.barisBaru();
      } },
    { baris: 460, jalan: function (m) {
        m.locate(6, 34); m.cetak(angka(m.v.DN)); m.barisBaru();
      } },
    { baris: 470, jalan: function (m) {
        m.locate(6, 49); m.cetak(angka(m.v.YDS)); m.barisBaru();
      } },
    { baris: 480, jalan: function (m) { m.warna(2, 0); } },
    { baris: 490, jalan: function (m) {
        for (m.v.J = 11; m.v.J <= 69; m.v.J++) {
          m.locate(12, m.v.J); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 500, jalan: function (m) {
        for (m.v.I = 13; m.v.I <= 22; m.v.I++) {
          for (m.v.J = 65; m.v.J <= 69; m.v.J++) {
            m.locate(m.v.I, m.v.J); m.cetak(m.chr(176)); m.barisBaru();
          }
        }
      } },
    { baris: 510, jalan: function (m) {
        for (m.v.J = 69; m.v.J >= 11; m.v.J--) {
          m.locate(23, m.v.J); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 520, jalan: function (m) {
        for (m.v.I = 22; m.v.I >= 13; m.v.I--) {
          for (m.v.J = 11; m.v.J <= 15; m.v.J++) {
            m.locate(m.v.I, m.v.J); m.cetak(m.chr(176)); m.barisBaru();
          }
        }
      } },
    { baris: 530, jalan: function (m) { m.warna(7, 0); } },
    { baris: 540, jalan: function (m) { m.gosub(3420); } },
    { baris: 550, jalan: function (m) {
        for (m.v.I = 13; m.v.I <= 22; m.v.I++) {
          for (m.v.J = 20; m.v.J <= 60; m.v.J += 5) {
            m.locate(m.v.I, m.v.J); m.cetak(m.chr(221)); m.barisBaru();
          }
        }
      } },
    { baris: 560, jalan: function (m) { m.warna(7, 0); } },
    { baris: 570, jalan: function (m) {
        m.locate(11, 16);
        m.cetak('0   10   20   30   40   50   40   30   20   10  0');
        m.barisBaru();
      } },
    { baris: 580, jalan: function (m) { m.warna(7, 0); } },
    /* 590 tabel hasil 10x5 dibaca dari DATA. Perhatikan batasnya: 1 sampai
       10. Baris 1790 nanti mengundi 0 sampai 9. */
    { baris: 590, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 10; m.v.I++) {
          for (m.v.J = 1; m.v.J <= 5; m.v.J++) {
            m.v.YRD[m.v.I][m.v.J] = m.baca();
          }
        }
      } },
    { baris: 600, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 1); m.cetak('Would You Like To');
        m.locate(4, 1); m.cetak('Kick Or Receive? <K/R>'); m.warna(3, 0);
      } },
    { baris: 610, jalan: function (m) { if (m.inkey() !== '') m.lompat(610); } },
    { baris: 620, jalan: function (m) {
        m.v['KR$'] = m.inkey();
        if (m.v['KR$'] === '') m.lompat(620);
      } },
    { baris: 630, jalan: function (m) {
        if (m.v['KR$'] === 'R' || m.v['KR$'] === 'r') m.lompat(660);
      } },
    { baris: 640, jalan: function (m) {
        if (m.v['KR$'] === 'K' || m.v['KR$'] === 'k') m.lompat(660);
      } },
    { baris: 650, jalan: function (m) { m.lompat(620); } },
    { baris: 660, jalan: function (m) { m.v['HOLD$'] = m.v['KR$']; } },
    { baris: 670, jalan: function (m) {
        for (m.v.AA = 500; m.v.AA >= 150; m.v.AA -= 5) m.suara(m.v.AA, 1);
        m.suara(m.v.AA, 0);
      } },
    { baris: 680, jalan: function (m) {
        if (m.v['KR$'] === 'K' || m.v['KR$'] === 'k') {
          m.v.OPS = 55; m.v.NPS = 55; m.lompat(720);
        }
      } },
    { baris: 690, jalan: function (m) {
        if (m.v['KR$'] === 'R' || m.v['KR$'] === 'r') {
          m.v.OPS = 25; m.v.NPS = 25; m.lompat(1190);
        }
      } },
    { baris: 700, jalan: function (m) { m.lompat(620); } },
    { baris: 710, jalan: function (m) { m.henti('END di baris 710'); } },

    /* --- 720-1180: giliran bertahan (komputer menyerang) ------------------- */
    { baris: 720, jalan: function (m) {
        m.locate(3, 60); m.cetak("    It's My Ball     "); m.barisBaru();
        m.locate(4, 60); m.cetak('On The'); m.barisBaru();
      } },
    { baris: 730, bagian: [
        function (m) { m.gosub(2780); },
        function (m) {
          m.warna(15, 0); m.locate(4, 66); m.cetak(angka(m.v.YLN));
          m.barisBaru();
        }
      ] },
    { baris: 740, jalan: function (m) {
        m.warna(3, 0); m.locate(4, 70); m.cetak('Yard Line '); m.barisBaru();
      } },
    { baris: 750, jalan: function (m) {
        m.warna(15, 0);
        m.locate(6, 60); m.cetak('Select A Defensive '); m.barisBaru();
        m.locate(7, 60); m.cetak('Formation By Entering'); m.barisBaru();
        m.locate(8, 60); m.cetak('A Number From 1 To 5'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 760, jalan: function (m) {
        m.warna(15, 0); m.locate(2, 31);
        m.cetak(m.chr(174) + m.chr(175) + '                 '); m.barisBaru();
      } },
    { baris: 770, jalan: function (m) { m.gosub(1810); } },
    { baris: 780, jalan: function (m) { m.v.DN = 1; m.v.YDS = 10; } },
    { baris: 790, jalan: function (m) {
        m.warna(14, 0);
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.locate(17, m.v.NPS); m.cetak(m.v['M$']); m.barisBaru();
        }
      } },
    { baris: 800, jalan: function (m) {
        if (m.v.QTR === 2 || m.v.QTR === 4) {
          m.locate(17, m.v.NPS); m.cetak(m.v['Y$']); m.barisBaru();
        }
      } },
    { baris: 810, jalan: function (m) {
        m.warna(15, 0);
        m.locate(6, 34); m.cetak(angka(m.v.DN));
        m.locate(6, 49); m.cetak(angka(m.v.YDS)); m.warna(3, 0);
      } },
    { baris: 820, bagian: [
        function (m) { m.gosub(2780); },
        function (m) {
          m.warna(15, 0); m.locate(4, 66); m.cetak(angka(m.v.YLN));
          m.warna(3, 0);
        }
      ] },
    { baris: 830, jalan: function (m) { if (m.inkey() !== '') m.lompat(830); } },
    { baris: 840, jalan: function (m) {
        m.v['P$'] = m.inkey();
        if (m.v['P$'] === '') m.lompat(840);
      } },
    { baris: 850, jalan: function (m) {
        if (m.v['P$'] < '0' || m.v['P$'] > '5') m.lompat(840);
      } },
    { baris: 860, jalan: function (m) {
        m.locate(10, 26); m.spc(46); m.barisBaru();
      } },
    { baris: 870, jalan: function (m) { m.v.POSI = parseInt(m.v['P$'], 10) || 0; } },
    { baris: 880, jalan: function (m) { m.gosub(1750); } },
    { baris: 890, jalan: function (m) { m.warna(7, 0); } },
    tandaLapangan(900),
    { baris: 910, jalan: function (m) { m.warna(3, 0); } },
    { baris: 920, jalan: function (m) { m.v.PLS = m.v.PLS + 1; } },
    { baris: 930, jalan: function (m) {
        if (m.v.PLS === 25 && (m.v.QTR === 2 || m.v.QTR === 4)) m.gosub(3450);
      } },
    { baris: 940, jalan: function (m) {
        if (m.v.PLS > 30 && m.v.QTR === 4) m.lompat(2920);
      } },
    kondisi(950, function (m) { return m.v.PLS > 30 && m.v.QTR === 2; },
      [function (m) { m.gosub(2870); }, function (m) { m.lompat(670); }]),
    kondisi(960, function (m) { return m.v.PLS > 30; },
      [function (m) { m.gosub(2900); }, function (m) { m.lompat(790); }]),
    kondisi(970, function (m) {
        return m.v.DN > 3 && m.v.NPS < 35 && (m.v.QTR === 1 || m.v.QTR === 3);
      }, [function (m) { m.gosub(2620); }, function (m) { m.lompat(1190); }]),
    kondisi(980, function (m) {
        return m.v.DN > 3 && m.v.NPS > 45 && (m.v.QTR === 2 || m.v.QTR === 4);
      }, [function (m) { m.gosub(2620); }, function (m) { m.lompat(1190); }]),
    kondisi(990, function (m) { return m.v.DN > 3; },
      [function (m) { m.gosub(2370); }, function (m) { m.lompat(1190); }]),
    { baris: 1000, jalan: function (m) {
        var y = hasil(m);
        m.v.DELAY = (y === 0 || y === 98 || y < 10) ? 20 : 40;
      } },
    { baris: 1010, jalan: function (m) {
        m.warna(15, 0);
        for (m.v.HOLD = 1; m.v.HOLD <= m.v.DELAY; m.v.HOLD++) {
          m.suara(50, 0.5);
          m.locate(10, 33); m.cetak('PLAY IN PROGRESS');
          m.locate(10, 33); m.cetak('                ');
          m.suara(50, 0);
        }
        m.warna(3, 0);
      } },
    kondisi(1020, function (m) { return hasil(m) === 99; },
      [function (m) { m.gosub(1970); }, function (m) { m.lompat(1190); }]),
    kondisi(1030, function (m) { return hasil(m) === 98; },
      [function (m) { m.gosub(2170); }, function (m) { m.lompat(1190); }]),
    kondisi(1040, function (m) { return hasil(m) === 100; },
      [function (m) { m.gosub(2250); }, function (m) { m.lompat(1190); }]),
    { baris: 1050, jalan: function (m) { m.v.YDS = m.v.YDS - hasil(m); } },
    { baris: 1060, jalan: function (m) {
        if (m.v.YDS <= 0) { m.v.DN = 1; m.v.YDS = 10; } else m.v.DN = m.v.DN + 1;
      } },
    { baris: 1070, jalan: function (m) {
        m.v.NPS = (m.v.QTR === 1 || m.v.QTR === 3)
          ? m.v.OPS - hasil(m) / 2 : m.v.OPS + hasil(m) / 2;
      } },
    kondisi(1080, function (m) {
        return m.v.NPS < 16 && (m.v.QTR === 1 || m.v.QTR === 3);
      }, [function (m) { m.gosub(2250); }, function (m) { m.lompat(1190); }]),
    kondisi(1090, function (m) {
        return m.v.NPS < 16 && (m.v.QTR === 2 || m.v.QTR === 4);
      }, [function (m) { m.gosub(2200); }, function (m) { m.lompat(1190); }]),
    kondisi(1100, function (m) {
        return m.v.NPS > 64 && (m.v.QTR === 2 || m.v.QTR === 4);
      }, [function (m) { m.gosub(2250); }, function (m) { m.lompat(1190); }]),
    kondisi(1110, function (m) {
        return m.v.NPS > 64 && (m.v.QTR === 1 || m.v.QTR === 3);
      }, [function (m) { m.gosub(2200); }, function (m) { m.lompat(1190); }]),
    { baris: 1120, jalan: function (m) { m.v.OPS = m.v.NPS; } },
    { baris: 1130, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) m.v['C$'] = m.v['M$'];
      } },
    { baris: 1140, jalan: function (m) {
        if (m.v.QTR === 2 || m.v.QTR === 4) m.v['C$'] = m.v['Y$'];
      } },
    { baris: 1150, jalan: function (m) { if (hasil(m) === 0) m.gosub(2810); } },
    { baris: 1160, jalan: function (m) { if (hasil(m) > 0) m.gosub(2830); } },
    { baris: 1170, jalan: function (m) { if (hasil(m) < 0) m.gosub(2850); } },
    { baris: 1180, jalan: function (m) { m.lompat(790); } },

    /* --- 1190-1650: giliran menyerang -------------------------------------- */
    { baris: 1190, bagian: [
        function (m) { m.gosub(2780); },
        function (m) {
          m.locate(3, 60); m.cetak("  It's Your Ball"); m.barisBaru();
          m.locate(4, 60); m.cetak('On The'); m.barisBaru();
        }
      ] },
    { baris: 1200, jalan: function (m) {
        m.warna(15, 0); m.locate(4, 66); m.cetak(angka(m.v.YLN)); m.barisBaru();
      } },
    { baris: 1210, jalan: function (m) {
        m.warna(3, 0); m.locate(4, 70); m.cetak('Yard Line '); m.barisBaru();
      } },
    { baris: 1220, jalan: function (m) {
        m.warna(15, 0);
        m.locate(6, 60); m.cetak('Select An Offensive'); m.barisBaru();
        m.locate(7, 60); m.cetak('Play By Entering A   '); m.barisBaru();
        m.locate(8, 60); m.cetak('Number From 1 To 7  '); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1230, jalan: function (m) {
        m.warna(15, 0); m.locate(2, 31);
        m.cetak('                ' + m.chr(174) + m.chr(175)); m.barisBaru();
      } },
    { baris: 1240, jalan: function (m) { m.gosub(1660); } },
    { baris: 1250, jalan: function (m) { m.v.DN = 1; m.v.YDS = 10; } },
    { baris: 1260, jalan: function (m) {
        m.warna(14, 0);
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.locate(17, m.v.NPS); m.cetak(m.v['Y$']); m.barisBaru();
        }
      } },
    { baris: 1270, jalan: function (m) {
        if (m.v.QTR === 2 || m.v.QTR === 4) {
          m.locate(17, m.v.NPS); m.cetak(m.v['M$']); m.barisBaru();
        }
      } },
    { baris: 1280, jalan: function (m) {
        m.warna(15, 0);
        m.locate(6, 34); m.cetak(angka(m.v.DN));
        m.locate(6, 49); m.cetak(angka(m.v.YDS));
      } },
    { baris: 1290, bagian: [
        function (m) { m.gosub(2780); },
        function (m) {
          m.locate(4, 66); m.cetak(angka(m.v.YLN)); m.warna(3, 0);
        }
      ] },
    { baris: 1300, jalan: function (m) { if (m.inkey() !== '') m.lompat(1300); } },
    { baris: 1310, jalan: function (m) {
        m.v['P$'] = m.inkey();
        if (m.v['P$'] === '') m.lompat(1310);
      } },
    { baris: 1320, jalan: function (m) {
        if (m.v['P$'] < '0' || m.v['P$'] > '7') m.lompat(1310);
      } },
    { baris: 1330, jalan: function (m) {
        m.locate(10, 26); m.spc(46); m.barisBaru();
      } },
    { baris: 1340, jalan: function (m) { m.v.POSI = parseInt(m.v['P$'], 10) || 0; } },
    { baris: 1350, jalan: function (m) { m.gosub(1750); } },
    { baris: 1360, jalan: function (m) { m.warna(7, 0); } },
    tandaLapangan(1370),
    { baris: 1380, jalan: function (m) { m.warna(3, 0); } },
    { baris: 1390, jalan: function (m) { m.v.PLS = m.v.PLS + 1; } },
    { baris: 1400, jalan: function (m) {
        if (m.v.PLS === 25 && (m.v.QTR === 2 || m.v.QTR === 4)) m.gosub(3450);
      } },
    { baris: 1410, jalan: function (m) {
        if (m.v.PLS > 30 && m.v.QTR === 4) m.lompat(2920);
      } },
    kondisi(1420, function (m) { return m.v.PLS > 30 && m.v.QTR === 2; },
      [function (m) { m.gosub(2870); }, function (m) { m.lompat(670); }]),
    kondisi(1430, function (m) { return m.v.PLS > 30; },
      [function (m) { m.gosub(2900); }, function (m) { m.lompat(1260); }]),
    kondisi(1440, function (m) { return m.v.POSI === 7; },
      [function (m) { m.gosub(2300); }, function (m) { m.lompat(720); }]),
    kondisi(1450, function (m) { return m.v.POSI === 6; },
      [function (m) { m.gosub(2440); }, function (m) { m.lompat(720); }]),
    { baris: 1460, jalan: function (m) {
        var y = hasil(m);
        m.v.DELAY = (y === 0 || y === 98 || y < 10) ? 20 : 40;
      } },
    { baris: 1470, jalan: function (m) {
        m.warna(15, 0);
        for (m.v.HOLD = 1; m.v.HOLD <= m.v.DELAY; m.v.HOLD++) {
          m.suara(50, 0.5);
          m.locate(10, 33); m.cetak('PLAY IN PROGRESS');
          m.locate(10, 33); m.cetak('                 ');
          m.suara(50, 0);
        }
        m.warna(3, 0);
      } },
    kondisi(1480, function (m) { return hasil(m) === 99; },
      [function (m) { m.gosub(1900); }, function (m) { m.lompat(720); }]),
    kondisi(1490, function (m) { return hasil(m) === 98; },
      [function (m) { m.gosub(2040); }, function (m) { m.lompat(720); }]),
    kondisi(1500, function (m) { return hasil(m) === 100; },
      [function (m) { m.gosub(2120); }, function (m) { m.lompat(720); }]),
    { baris: 1510, jalan: function (m) { m.v.YDS = m.v.YDS - hasil(m); } },
    { baris: 1520, jalan: function (m) {
        if (m.v.YDS <= 0) { m.v.DN = 1; m.v.YDS = 10; } else m.v.DN = m.v.DN + 1;
      } },
    { baris: 1530, jalan: function (m) {
        m.v.NPS = (m.v.QTR === 1 || m.v.QTR === 3)
          ? m.v.OPS + hasil(m) / 2 : m.v.OPS - hasil(m) / 2;
      } },
    kondisi(1540, function (m) {
        return (m.v.QTR === 1 || m.v.QTR === 3) && m.v.NPS > 64;
      }, [function (m) { m.gosub(2120); }, function (m) { m.lompat(720); }]),
    kondisi(1550, function (m) {
        return (m.v.QTR === 2 || m.v.QTR === 4) && m.v.NPS > 64;
      }, [function (m) { m.gosub(2070); }, function (m) { m.lompat(720); }]),
    kondisi(1560, function (m) {
        return (m.v.QTR === 2 || m.v.QTR === 4) && m.v.NPS < 16;
      }, [function (m) { m.gosub(2120); }, function (m) { m.lompat(720); }]),
    kondisi(1570, function (m) {
        return (m.v.QTR === 1 || m.v.QTR === 3) && m.v.NPS < 16;
      }, [function (m) { m.gosub(2070); }, function (m) { m.lompat(720); }]),
    balik(1580, true), balik(1590, false),
    { baris: 1600, jalan: function (m) { m.v.OPS = m.v.NPS; } },
    { baris: 1610, jalan: function (m) {
        m.v['C$'] = (m.v.QTR === 1 || m.v.QTR === 3) ? m.v['Y$'] : m.v['M$'];
      } },
    { baris: 1620, jalan: function (m) { if (hasil(m) === 0) m.gosub(2810); } },
    { baris: 1630, jalan: function (m) { if (hasil(m) > 0) m.gosub(2830); } },
    { baris: 1640, jalan: function (m) { if (hasil(m) < 0) m.gosub(2850); } },
    { baris: 1650, jalan: function (m) { m.lompat(1260); } },

    /* --- 1660-1740 dan 1810-1890: dua daftar taktik ------------------------ */
    { baris: 1660, jalan: function (m) {
        m.locate(1, 2); m.cetak('    OFFENSIVE PLAY    '); m.barisBaru();
        m.cetak('     SELECTION(1-7)     '); m.barisBaru();
        m.cetak('   ------------------'); m.barisBaru();
      } },
    daftar(1670, '   1 = Line Plunge    '),
    daftar(1680, '   2 = End Run        '),
    daftar(1690, '   3 = Screen Pass    '),
    daftar(1700, '   4 = Short Pass      '),
    daftar(1710, '   5 = Long Bomb       '),
    daftar(1720, '   6 = Field Goal      '),
    daftar(1730, '   7 = Punt            '),
    { baris: 1740, jalan: function (m) { m.kembali(); } },

    /* --- 1750-1800: satu lemparan dadu untuk seluruh hasil permainan ------- */
    { baris: 1750, jalan: function (m) { m.v['S$'] = String(detik(m)); } },
    { baris: 1760, jalan: function (m) { m.v.N = parseInt(m.v['S$'], 10) || 0; } },
    { baris: 1770, jalan: function (m) { m.semai(m.v.N); } },
    { baris: 1780, jalan: function (m) { m.v.R = m.acak() * 10; } },
    /* 1790 RW = 0 sampai 9. Tabelnya diisi 1 sampai 10. Lihat kepala berkas. */
    { baris: 1790, jalan: function (m) { m.v.RW = Math.floor(m.v.R); } },
    { baris: 1800, jalan: function (m) { m.kembali(); } },
    { baris: 1810, jalan: function (m) {
        m.locate(1, 2); m.cetak('DEFENSIVE FORMATIONS'); m.barisBaru();
        m.cetak('    SELECTION(1-5) '); m.barisBaru();
        m.cetak(' --------------------'); m.barisBaru();
      } },
    daftar(1820, '   1 = Goal Line      '),
    daftar(1830, '   2 = Short Run      '),
    daftar(1840, '   3 = Long Run       '),
    daftar(1850, '   4 = Short Pass     '),
    daftar(1860, '   5 = Long Pass      '),
    daftar(1870, '                        '),
    daftar(1880, '                        '),
    { baris: 1890, jalan: function (m) { m.kembali(); } },

    /* --- 1900-2290: sepuluh kejadian khusus -------------------------------- */
    kabar(1900, 10, 30, '!!!! I Intercepted !!!!'),
    { baris: 1910, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = m.v.OPS + 5; m.v['C$'] = m.v['M$'];
        }
      } },
    { baris: 1920, jalan: function (m) {
        if (m.v.QTR === 2 || m.v.QTR === 4) {
          m.v.NPS = m.v.OPS - 5; m.v['C$'] = m.v['Y$'];
        }
      } },
    jepit(1930, true, '>', 64, 55), jepit(1940, false, '<', 16, 25),
    { baris: 1950, jalan: function (m) { m.v.OPS = m.v.NPS; } },
    { baris: 1960, jalan: function (m) { m.kembali(); } },
    kabar(1970, 10, 30, '!!! You Intercepted !!!'),
    { baris: 1980, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = m.v.OPS - 5; m.v['C$'] = m.v['Y$'];
        }
      } },
    { baris: 1990, jalan: function (m) {
        if (m.v.QTR === 2 || m.v.QTR === 4) {
          m.v.NPS = m.v.OPS + 5; m.v['C$'] = m.v['M$'];
        }
      } },
    jepit(2000, true, '<', 16, 25), jepit(2010, false, '>', 64, 55),
    { baris: 2020, jalan: function (m) { m.v.OPS = m.v.NPS; } },
    { baris: 2030, jalan: function (m) { m.kembali(); } },
    kabar(2040, 10, 27, '!!!! Sorry, You Fumbled !!!!'),
    { baris: 2050, jalan: function (m) {
        m.v['C$'] = (m.v.QTR === 1 || m.v.QTR === 3) ? m.v['M$'] : m.v['Y$'];
      } },
    { baris: 2060, jalan: function (m) { m.kembali(); } },
    kabar(2070, 10, 30, '!!!!   Safety    !!!!'),
    { baris: 2080, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = 55; m.v.OPS = 55; m.v['C$'] = m.v['M$'];
        } else {
          m.v.NPS = 25; m.v.OPS = 25; m.v['C$'] = m.v['Y$'];
        }
      } },
    { baris: 2090, jalan: function (m) { m.v.HSR = m.v.HSR + 2; } },
    skor(2100, 4, 30, 'HSR'),
    { baris: 2110, jalan: function (m) { m.kembali(); } },
    { baris: 2120, bagian: [
        function (m) {
          m.locate(10, 30); m.cetak('!!!!  TOUCHDOWN  !!!!'); m.barisBaru();
          m.v.DN = 1; m.v.YDS = 10;
        },
        function (m) { m.gosub(3130); }
      ] },
    { baris: 2130, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = 55; m.v.OPS = 55; m.v['C$'] = m.v['M$'];
        } else {
          m.v.NPS = 25; m.v.OPS = 25; m.v['C$'] = m.v['Y$'];
        }
      } },
    { baris: 2140, jalan: function (m) { m.v.VSR = m.v.VSR + 7; } },
    skor(2150, 4, 47, 'VSR'),
    { baris: 2160, jalan: function (m) { m.kembali(); } },
    kabar(2170, 10, 28, '!!!! Oops , I Fumbled !!!!'),
    { baris: 2180, jalan: function (m) {
        m.v['C$'] = (m.v.QTR === 1 || m.v.QTR === 3) ? m.v['Y$'] : m.v['M$'];
      } },
    { baris: 2190, jalan: function (m) { m.kembali(); } },
    kabar(2200, 10, 30, '!!!!   Safety    !!!!'),
    { baris: 2210, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = 25; m.v.OPS = 25; m.v['C$'] = m.v['Y$'];
        } else {
          m.v.NPS = 55; m.v.OPS = 55; m.v['C$'] = m.v['M$'];
        }
      } },
    { baris: 2220, jalan: function (m) { m.v.VSR = m.v.VSR + 2; } },
    skor(2230, 4, 47, 'VSR'),
    { baris: 2240, jalan: function (m) { m.kembali(); } },
    kabar(2250, 10, 30, '!!!!  TOUCHDOWN  !!!!'),
    { baris: 2260, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = 25; m.v.OPS = 25; m.v['C$'] = m.v['Y$'];
        } else {
          m.v.NPS = 55; m.v.OPS = 55; m.v['C$'] = m.v['M$'];
        }
      } },
    { baris: 2270, jalan: function (m) { m.v.HSR = m.v.HSR + 7; } },
    skor(2280, 4, 30, 'HSR'),
    { baris: 2290, jalan: function (m) { m.kembali(); } },

    /* --- 2300-2430: dua tendangan lepas ------------------------------------ */
    peluit(2300),
    kabar(2310, 10, 30, '!!!!  Good Punt  !!!!'),
    { baris: 2320, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = m.v.OPS + 20; m.v['C$'] = m.v['M$'];
        } else {
          m.v.NPS = m.v.OPS - 20; m.v['C$'] = m.v['Y$'];
        }
      } },
    jepit(2330, true, '>', 64, 55), jepit(2340, false, '<', 16, 25),
    { baris: 2350, jalan: function (m) { m.v.OPS = m.v.NPS; } },
    { baris: 2360, jalan: function (m) { m.kembali(); } },
    peluit(2370),
    kabar(2380, 10, 30, '!!!!  Good Punt  !!!!'),
    { baris: 2390, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) {
          m.v.NPS = m.v.OPS - 20; m.v['C$'] = m.v['Y$'];
        } else {
          m.v.NPS = m.v.OPS + 20; m.v['C$'] = m.v['M$'];
        }
      } },
    jepit(2400, true, '<', 16, 25), jepit(2410, false, '>', 64, 55),
    { baris: 2420, jalan: function (m) { m.v.OPS = m.v.NPS; } },
    { baris: 2430, jalan: function (m) { m.kembali(); } },

    /* --- 2440-2770: tendangan gawang, dua kali empat baris yang mirip ------ */
    { baris: 2440, jalan: function (m) {
        if (m.v.QTR === 2 || m.v.QTR === 4) m.lompat(2520);
      } },
    gawang(2450, '>', 25, 9, 'VSR', 'M$', 2590),
    gawang(2460, '>', 30, 7, 'VSR', 'M$', 2590),
    gawang(2470, '>', 35, 5, 'VSR', 'M$', 2590),
    gawang(2480, '>', 38, 4, 'VSR', 'M$', 2590),
    kabar(2490, 10, 26, '!!!!  Field Goal Try Wide  !!!!'),
    { baris: 2500, jalan: function (m) {
        if (m.v.NPS > 55) { m.v.NPS = 55; m.v.OPS = 55; }
      } },
    { baris: 2510, jalan: function (m) { m.lompat(2610); } },
    gawang(2520, '<', 25, 9, 'VSR', 'Y$', 2590),
    gawang(2530, '<', 30, 7, 'VSR', 'Y$', 2590),
    /* 2540 memakai tanda LEBIH BESAR di tengah rombongan yang semuanya
       lebih kecil. Salah ketik yang membuat syarat ini hampir tak pernah
       benar di paruh kedua. */
    gawang(2540, '>', 35, 5, 'VSR', 'Y$', 2590),
    gawang(2550, '<', 38, 4, 'VSR', 'Y$', 2590),
    kabar(2560, 10, 26, '!!!!  Field Goal Try Wide  !!!!'),
    { baris: 2570, jalan: function (m) {
        if (m.v.NPS < 25) { m.v.NPS = 25; m.v.OPS = 25; }
      } },
    { baris: 2580, jalan: function (m) { m.lompat(2610); } },
    { baris: 2590, bagian: [
        function (m) { m.gosub(3130); },
        function (m) {
          m.locate(4, 47); m.cetak(angka(m.v.VSR)); m.barisBaru();
        }
      ] },
    { baris: 2600, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) { m.v.NPS = 55; m.v.OPS = 55; }
        else { m.v.NPS = 25; m.v.OPS = 25; }
      } },
    { baris: 2610, jalan: function (m) { m.kembali(); } },
    { baris: 2620, jalan: function (m) {
        if (m.v.QTR === 2 || m.v.QTR === 4) m.lompat(2690);
      } },
    gawang(2630, '<', 25, 9, 'HSR', 'Y$', 2750),
    gawang(2640, '<', 30, 7, 'HSR', 'Y$', 2750),
    gawang(2650, '<', 35, 5, 'HSR', 'Y$', 2750),
    kabar(2660, 10, 26, '!!!!  Field Goal Try Wide  !!!!'),
    { baris: 2670, jalan: function (m) {
        if (m.v.NPS < 25) { m.v.NPS = 25; m.v.OPS = 25; }
      } },
    { baris: 2680, jalan: function (m) { m.lompat(2770); } },
    gawang(2690, '>', 55, 9, 'HSR', 'M$', 2750),
    gawang(2700, '>', 50, 7, 'HSR', 'M$', 2750),
    gawang(2710, '<', 45, 5, 'HSR', 'M$', 2750),
    kabar(2720, 10, 26, '!!!!  Field Goal Try Wide  !!!!'),
    { baris: 2730, jalan: function (m) {
        if (m.v.NPS > 55) { m.v.NPS = 55; m.v.OPS = 55; }
      } },
    { baris: 2740, jalan: function (m) { m.lompat(2770); } },
    skor(2750, 4, 30, 'HSR'),
    { baris: 2760, jalan: function (m) {
        if (m.v.QTR === 1 || m.v.QTR === 3) { m.v.NPS = 25; m.v.OPS = 25; }
        else { m.v.NPS = 55; m.v.OPS = 55; }
      } },
    { baris: 2770, jalan: function (m) { m.kembali(); } },

    /* 2780-2800 kolom layar diubah jadi garis yard. Satu rumus, dan
       pantulannya di baris 2790 yang membuat 60 jadi 40. */
    { baris: 2780, jalan: function (m) { m.v.YLN = (m.v.NPS - 15) * 2; } },
    { baris: 2790, jalan: function (m) {
        if (m.v.YLN > 50) m.v.YLN = 100 - m.v.YLN;
      } },
    { baris: 2800, jalan: function (m) { m.kembali(); } },
    { baris: 2810, jalan: function (m) {
        m.locate(10, 32);
        m.cetak((m.v.POSI === 1 || m.v.POSI === 2)
          ? 'No Gain On The Play' : '  Incomplete Pass');
        m.barisBaru();
      } },
    { baris: 2820, jalan: function (m) { m.kembali(); } },
    { baris: 2830, jalan: function (m) {
        m.locate(10, 27);
        m.cetak((m.v.POSI === 1 || m.v.POSI === 2)
          ? '   Gain Of' + angka(hasil(m)) + 'On The Play'
          : 'Pass Completed For' + angka(hasil(m)) + 'Yards');
        m.barisBaru();
      } },
    { baris: 2840, jalan: function (m) { m.kembali(); } },
    { baris: 2850, jalan: function (m) {
        m.locate(10, 27);
        m.cetak((m.v.POSI === 1 || m.v.POSI === 2)
          ? '   Loss Of' + angka(Math.abs(hasil(m))) + 'On The Play'
          : 'Quarterback Sacked:Loss Of' + angka(Math.abs(hasil(m))));
        m.barisBaru();
      } },
    { baris: 2860, jalan: function (m) { m.kembali(); } },
    { baris: 2870, bagian: [
        function (m) {
          m.v.QTR = m.v.QTR + 1; m.v.PLS = 1;
          m.locate(9, 32); m.cetak('                   '); m.barisBaru();
          m.locate(3, 60); m.cetak('End Of The Half '); m.barisBaru();
          m.locate(4, 60); m.spc(19); m.barisBaru();
          m.locate(4, 39); m.cetak(angka(m.v.QTR)); m.barisBaru();
        },
        function (m) { m.gosub(3190); }
      ] },
    { baris: 2880, jalan: function (m) {
        m.v['KR$'] = (m.v['HOLD$'] === 'K' || m.v['HOLD$'] === 'k') ? 'R' : 'K';
      } },
    { baris: 2890, jalan: function (m) { m.kembali(); } },
    { baris: 2900, bagian: [
        function (m) {
          m.v.QTR = m.v.QTR + 1; m.v.PLS = 0;
          m.locate(3, 60); m.cetak('End Of The Quarter'); m.barisBaru();
          m.locate(4, 39); m.cetak(angka(m.v.QTR)); m.barisBaru();
        },
        function (m) { m.gosub(3340); },
        function (m) { m.v.NPS = 80 - m.v.OPS; m.v.OPS = m.v.NPS; }
      ] },
    { baris: 2910, jalan: function (m) { m.kembali(); } },
    { baris: 2920, jalan: function (m) { m.cls(); } },
    ajar(2930, 4, 28, 'Time Is Up; The Game Is Over'),
    { baris: 2940, jalan: function (m) {
        if (m.v.HSR > m.v.VSR) {
          m.locate(7, 28);
          m.cetak('You Lost By A Score Of' + angka(m.v.HSR) + 'To' + angka(m.v.VSR));
          m.barisBaru();
          m.locate(8, 31); m.cetak('Better Luck Next Time'); m.barisBaru();
        }
      } },
    { baris: 2950, jalan: function (m) {
        if (m.v.VSR > m.v.HSR) {
          m.locate(7, 28);
          m.cetak('You Won By A Score Of' + angka(m.v.VSR) + 'To' + angka(m.v.HSR));
          m.barisBaru();
          m.locate(8, 31); m.cetak('Congratulations  !!!!'); m.barisBaru();
        }
      } },
    { baris: 2960, jalan: function (m) {
        m.warna(15, 0); m.locate(10, 25);
        m.cetak('Would You Like To Play Again? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 2970, jalan: function (m) { if (m.inkey() !== '') m.lompat(2970); } },
    { baris: 2980, jalan: function (m) {
        m.v['ANS$'] = m.inkey();
        if (m.v['ANS$'] === '') m.lompat(2980);
      } },
    { baris: 2990, jalan: function (m) {
        if (m.v['ANS$'] === 'y' || m.v['ANS$'] === 'Y') {
          m.ulangData(); m.lompat(340);
        }
      } },
    { baris: 3000, jalan: function (m) {
        if (m.v['ANS$'] !== 'n' && m.v['ANS$'] !== 'N') m.lompat(2980);
      } },
    { baris: 3010, jalan: function (m) { m.cls(); m.jalankan('MENU'); } },
    data(3020), data(3030),

    /* --- 3040-3120: F10 ---------------------------------------------------- */
    { baris: 3040, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XX = m.barisKursor(); m.v.YY = m.pos();
        m.locate(25, 1); m.spc(79); m.locate(25, 20);
      } },
    { baris: 3050, jalan: function (m) {
        m.warna(15, 0);
        m.cetak('Do You Wish To Leave This Game? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 3060, jalan: function (m) { if (m.inkey() !== '') m.lompat(3060); } },
    { baris: 3070, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(3070);
      } },
    { baris: 3080, jalan: function (m) {
        if (m.v['A$'] === 'Y' || m.v['A$'] === 'y') m.lompat(3010);
      } },
    { baris: 3090, jalan: function (m) {
        if (m.v['A$'] !== 'N' && m.v['A$'] !== 'n') m.lompat(3070);
      } },
    { baris: 3100, jalan: function (m) {
        m.locate(25, 1); m.spc(79); m.locate(25, 25); m.warna(0, 7);
      } },
    { baris: 3110, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(3, 0); m.locate(m.v.XX, m.v.YY);
      } },
    { baris: 3120, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },

    /* --- 3130-3440: empat lagu ---------------------------------------------
       3130-3170 lagu gol, 3190-3300 lagu turun minum (dua belas baris!),
       3340-3400 lagu ganti babak, 3420-3430 lagu pembuka. */
    lagu(3130), lagu(3140), lagu(3150), lagu(3160), lagu(3170),
    { baris: 3180, jalan: function (m) { m.kembali(); } },
    lagu(3190), lagu(3200), lagu(3210), lagu(3220), lagu(3230), lagu(3240),
    lagu(3250), lagu(3260), lagu(3270), lagu(3280), lagu(3290), lagu(3300),
    { baris: 3310, jalan: function (m) { m.kembali(); } },
    /* 3320 dan 3330 dua RETURN telanjang yang tidak pernah dituju siapa pun. */
    { baris: 3320, jalan: function (m) { m.kembali(); } },
    { baris: 3330, jalan: function (m) { m.kembali(); } },
    lagu(3340), lagu(3350),
    sirene(3360, 450, 300), lagu(3370),
    sirene(3380, 475, 325), lagu(3390),
    sirene(3400, 500, 350),
    { baris: 3410, jalan: function (m) { m.kembali(); } },
    lagu(3420), lagu(3430),
    { baris: 3440, jalan: function (m) { m.kembali(); } },
    { baris: 3450, jalan: function (m) {
        m.locate(9, 32); m.warna(31, 0);
        m.cetak('Two Minute Warning'); m.bunyi(); m.warna(3, 0);
        m.kembali();
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }
  function data(nomor) { return { baris: nomor, jalan: function () { } }; }
  function lagu(nomor) { return { baris: nomor, jalan: function (m) { m.mainkan(''); } }; }

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }

  /* Hasil satu permainan, dibaca dari tabel. DI SINILAH cacat indeksnya
     terlihat: RW bisa 0, dan baris 0 tabel tidak pernah diisi. */
  function hasil(m) { return m.v.YRD[m.v.RW][m.v.POSI]; }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function daftar(nomor, isi) {
    return { baris: nomor, jalan: function (m) {
      m.cetak(isi); m.barisBaru();
    } };
  }

  function kabar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
      m.v.DN = 1; m.v.YDS = 10;
    } };
  }

  function skor(nomor, b, k, nama) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(angka(m.v[nama])); m.barisBaru();
    } };
  }

  function peluit(nomor) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.AA = 500; m.v.AA >= 150; m.v.AA -= 5) m.suara(m.v.AA, 1);
      m.suara(m.v.AA, 0);
    } };
  }

  function sirene(nomor, dari, sampai) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.I = dari; m.v.I >= sampai; m.v.I -= 10) m.suara(m.v.I, 0.3);
      m.suara(32600, 5);
    } };
  }

  /* Sesudah bola pindah, tanda lapangan di bawahnya dipulihkan: garis lima
     yard kalau kolomnya kelipatan lima, kalau tidak titik biasa. */
  function tandaLapangan(nomor) {
    return { baris: nomor, jalan: function (m) {
      var lima = [20, 25, 30, 35, 40, 45, 50, 55, 60].indexOf(m.v.OPS) >= 0;
      m.locate(17, m.v.OPS);
      m.cetak(m.chr(lima ? 221 : 160)); m.barisBaru();
    } };
  }

  function jepit(nomor, ganjil, tanda, batas, jadi) {
    return { baris: nomor, jalan: function (m) {
      var babak = ganjil ? (m.v.QTR === 1 || m.v.QTR === 3)
                         : (m.v.QTR === 2 || m.v.QTR === 4);
      var lewat = (tanda === '>') ? m.v.NPS > batas : m.v.NPS < batas;
      if (babak && lewat) m.v.NPS = jadi;
    } };
  }

  function balik(nomor, ganjil) {
    return { baris: nomor, jalan: function (m) {
      var babak = ganjil ? (m.v.QTR === 1 || m.v.QTR === 3)
                         : (m.v.QTR === 2 || m.v.QTR === 4);
      if (m.v.DN > 4 && babak) {
        m.locate(10, 27); m.cetak('Ball Turned Over On 4th Down'); m.barisBaru();
        m.bunyi();
        m.v.DN = 1; m.v.YDS = 10;
        m.v['C$'] = ganjil ? m.v['M$'] : m.v['Y$'];
        m.v.OPS = m.v.NPS;
        m.lompat(720);
      }
    } };
  }

  function gawang(nomor, tanda, batas, batasRW, skorNama, penanda, tujuan) {
    return { baris: nomor, jalan: function (m) {
      var lewat = (tanda === '>') ? m.v.NPS > batas : m.v.NPS < batas;
      if (lewat && m.v.RW < batasRW) {
        m.locate(10, 26);
        m.cetak('!!!!  Field Goal Was Good  !!!!'); m.barisBaru();
        m.v.DN = 1; m.v.YDS = 10;
        m.v[skorNama] = m.v[skorNama] + 3;
        m.v['C$'] = m.v[penanda];
        m.lompat(tujuan);
      }
    } };
  }

  function kondisi(nomor, uji, fns) {
    var ya = false;
    var bagian = [function (m) { ya = !!uji(m); if (ya) fns[0](m); }];
    for (var i = 1; i < fns.length; i++) {
      bagian.push((function (f) {
        return function (m) { if (ya) f(m); };
      })(fns[i]));
    }
    return { baris: nomor, bagian: bagian };
  }

  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['FOOTBALL'] = {
    nama: 'FOOTBALL',
    judul: 'Head Coach',
    sumber: 'FOOTBALL',
    berkas: 'run/FOOTBALL.BAS',
    tabel: tabel,
    /* Baris 3020 dibaca; baris 3030 tidak pernah tersentuh. Keduanya sama
       persis kecuali angka kedelapan (0 versus 6). */
    data: [
      0, 2, 14, 10, 0, 2, 98, 0, 8, 40, 8, 4, 8, 4, 99, -2, -4, 0, 99, 0,
      6, 10, 0, 6, 50, 0, 6, 12, 0, 0, 4, -2, -8, 18, 0, 0, 16, -2, 0, 99,
      14, 30, 6, 0, 0, 2, 0, 4, 2, 0,
      0, 2, 14, 10, 0, 2, 98, 6, 8, 40, 8, 4, 8, 4, 99, -2, -4, 0, 99, 0,
      6, 10, 0, 6, 50, 0, 6, 12, 0, 0, 4, -2, -8, 18, 0, 0, 16, -2, 0, 99,
      14, 30, 6, 0, 0, 2, 0, 4, 2, 0
    ],

    arsitektur: {
      judul: 'Alur FOOTBALL.BAS',
      simpul: [
        { id: 'siap', baris: '20-590', jenis: 'mulai',
          teks: ['Petunjuk, gambar lapangan,', 'baca tabel hasil 10x5'] },
        { id: 'undi', baris: '600-700', jenis: 'putusan',
          teks: ['Menendang atau menerima?'] },
        { id: 'serang', baris: '1190-1650', jenis: 'putusan',
          teks: ['Pemain memilih 1 dari 7 taktik'] },
        { id: 'tahan', baris: '720-1180', jenis: 'putusan',
          teks: ['Pemain memilih 1 dari 5 formasi', 'bertahan'] },
        { id: 'dadu', baris: '1750-1800',
          teks: ['Satu lemparan: RW = 0..9', 'lalu baca YRD(RW, taktik)'] },
        { id: 'khusus', baris: '1900-2290',
          teks: ['99 = intersep, 98 = fumble,', '100 = touchdown'] },
        { id: 'tendang', baris: '2300-2770', jenis: 'subrutin',
          teks: ['Punt dan tendangan gawang;', 'jarak menentukan peluangnya'] },
        { id: 'babak', baris: '2870-2910',
          teks: ['30 permainan per kuarter,', 'lapangan dibalik'] },
        { id: 'usai', baris: '2920-3010', jenis: 'keluar',
          teks: ['Kuarter keempat habis:', 'skor akhir'] }
      ],
      panah: [
        { dari: 'siap', ke: 'undi' },
        { dari: 'undi', ke: 'serang', label: 'terima' },
        { dari: 'undi', ke: 'tahan', label: 'tendang' },
        { dari: 'serang', ke: 'dadu' },
        { dari: 'tahan', ke: 'dadu' },
        { dari: 'dadu', ke: 'khusus', label: '98 / 99 / 100' },
        { dari: 'dadu', ke: 'serang', label: 'yard biasa' },
        { dari: 'serang', ke: 'tendang', label: 'taktik 6 atau 7' },
        { dari: 'tahan', ke: 'tendang', label: 'down ke-4' },
        { dari: 'khusus', ke: 'tahan', label: 'bola pindah' },
        { dari: 'tendang', ke: 'tahan' },
        { dari: 'serang', ke: 'babak', label: 'permainan ke-31' },
        { dari: 'babak', ke: 'serang' },
        { dari: 'babak', ke: 'usai', label: 'kuarter 4 habis' }
      ]
    },

    pseudokode: [
      { baris: 590, tingkat: 0, teks: 'baca tabel hasil <code>YRD(<b>1..10</b>, 1..5)</code> dari DATA' },
      { baris: 600, tingkat: 0, teks: 'undi: menendang atau menerima?' },
      { baris: 790, tingkat: 0, teks: '<b>ULANG sampai kuarter keempat habis:</b>' },
      { baris: 840, tingkat: 1, teks: 'pemain memilih taktik (1&ndash;7 menyerang, 1&ndash;5 bertahan)' },
      { baris: 1790, tingkat: 1, teks: '<code>RW = FIX(RND*10)</code> &mdash; <b>0 sampai 9</b>' },
      { baris: 1000, tingkat: 1, teks: 'hasilnya = <code>YRD(RW, taktik)</code>; <b>RW=0 selalu memberi nol</b>' },
      { baris: 1480, tingkat: 2, teks: '99 = intersep, 98 = fumble, 100 = touchdown' },
      { baris: 1510, tingkat: 2, teks: 'selain itu: yard dikurangi, posisi digeser <b>separuh</b> yard' },
      { baris: 1520, tingkat: 2, teks: 'sampai 10 yard? down kembali ke 1' },
      { baris: 1580, tingkat: 2, teks: 'down ke-5? bola pindah' },
      { baris: 1440, tingkat: 1, teks: 'taktik 6 = tendangan gawang, 7 = punt' },
      { baris: 2900, tingkat: 1, teks: '31 permainan = kuarter berikutnya, <b>lapangan dibalik</b> (<code>NPS=80-OPS</code>)' }
    ],

    perintahAsli: 'run\\FOOTBALL.bat',
    catatanAsli: 'Program ini punya EMPAT lagu, termasuk satu sepanjang dua ' +
      'belas baris PLAY di baris 3190-3300 yang diputar tiap turun minum. ' +
      'Di penelusur semuanya diam.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Empat lagu ' +
      'lengkap tidak terdengar: lagu pembuka (3420), lagu gol (3130), lagu ' +
      'ganti kuarter (3340), dan lagu turun minum sepanjang dua belas baris ' +
      '(3190-3300).',

      '<b><code>COLOR 31</code> di baris 3450 tidak berkedip.</b> ' +
      '"Two Minute Warning" seharusnya berkedip putih terang.',

      '<b>Pengacaknya berbenih tetap.</b> <code>RIGHT$(TIME$,2)</code> di ' +
      'baris 1750 memakai jam penelusur yang maju tujuh detik tiap dibaca, ' +
      'seperti CRAPS.BAS &mdash; kalau angkanya tetap, seluruh permainan akan ' +
      'menghasilkan yard yang sama persis berulang-ulang.',

      '<b>Gelung "PLAY IN PROGRESS" habis seketika.</b> Di aslinya ia berkedip ' +
      '20 atau 40 kali sambil berbunyi; di penelusur ia lewat dalam satu ' +
      'langkah.'
    ],

    pelajaran: {
      ringkas: 'Sepak bola Amerika. Yang layak dipelajari: seluruh hasil ' +
        'permainan diambil dari satu tabel 10x5 &mdash; dan tabel itu punya ' +
        'cacat indeks yang tidak pernah ketahuan.',
      pelajari: [
        ['Satu tabel yang jadi seluruh permainan',
         'Tidak ada simulasi, tidak ada pemain, tidak ada bola. Yang ada ' +
         '<code>YRD(baris, taktik)</code>: satu lemparan dadu memilih ' +
         'barisnya, taktik pemain memilih kolomnya, dan angka di ' +
         'persimpangannya adalah hasilnya. Angka istimewa jadi kejadian ' +
         'istimewa: 98 fumble, 99 intersep, 100 touchdown.'],
        ['Kolom layar sebagai koordinat permainan',
         'Posisi bola disimpan sebagai <b>nomor kolom layar</b> (16 sampai ' +
         '64), bukan sebagai yard. Baris 2780 menerjemahkannya waktu perlu ' +
         'ditampilkan: <code>YLN=(NPS-15)*2</code>, dan kalau lewat 50 ' +
         'dipantulkan jadi <code>100-YLN</code> &mdash; karena garis yard ' +
         'memang dihitung dari gawang terdekat.'],
        ['Membalik lapangan dengan satu pengurangan',
         'Baris 2900: <code>NPS=80-OPS</code>. Tengah lapangan ada di kolom ' +
         '40, jadi mencerminkan posisi cukup dikurangkan dari 80. Ganti ' +
         'kuarter, arah serangan terbalik, dan tidak ada yang perlu digambar ' +
         'ulang.'],
        ['Menyembuhkan lapangan sesudah bola lewat',
         'Baris 900 dan 1370 mengembalikan tanda lapangan di bawah posisi ' +
         'lama: garis lima yard kalau kolomnya kelipatan lima, titik biasa ' +
         'kalau bukan. Kerabat sederhana dari trik "simpan-di-bawah" di ' +
         'SUB.BAS &mdash; di sini yang disimpan bukan isi layar melainkan ' +
         'ATURAN cara menggambarnya kembali.']
      ],
      hindari: [
        ['Larik yang diisi dari 1 tapi dibaca dari 0',
         'Baris 590 mengisi <code>YRD(1..10, *)</code>. Baris 1790 ' +
         'menghasilkan <code>RW = 0..9</code>. Akibatnya <b>baris ke-10 tidak ' +
         'pernah dipakai</b>, dan <b>baris ke-0 &mdash; yang isinya nol semua ' +
         '&mdash; dipakai satu kali dari sepuluh</b>. Satu dari sepuluh ' +
         'permainan selalu menghasilkan tepat nol yard, apa pun taktiknya. ' +
         'Tidak ada pesan galat, dan waktu dimainkan rasanya masuk akal.'],
        ['Data yang tidak pernah dibaca',
         'Baris 3030 memuat lima puluh angka. Baris 590 cuma membaca lima ' +
         'puluh yang pertama, yaitu seluruh isi baris 3020. Jadi <b>baris ' +
         '3030 tidak pernah tersentuh</b> &mdash; dan bedanya dengan 3020 ' +
         'cuma satu angka: yang kedelapan, 0 versus 6.'],
        ['Satu tanda banding yang terbalik di tengah rombongan',
         'Baris 2520-2550 empat baris yang polanya sama, semuanya memakai ' +
         '<code>NPS&lt;</code> &mdash; kecuali baris 2540 yang menulis ' +
         '<code>NPS&gt;35</code>. Di paruh kedua, syarat itu hampir tak pernah ' +
         'benar. Rombongan baris yang mirip persis adalah tempat paling mudah ' +
         'untuk menyembunyikan satu yang tidak.'],
        ['Sisa yang tidak pernah dituju',
         'Baris 3320 dan 3330 dua <code>RETURN</code> telanjang yang tidak ' +
         'ada satu pun <code>GOSUB</code>-nya. Dan baris 710 <code>END</code> ' +
         'yang tidak mungkin tercapai.']
      ]
    },

    penjelasan: [
      { judul: 'Seluruh permainan dalam satu tabel',
        isi: [
          'Program ini tidak menyimulasikan apa pun. Tidak ada pemain, tidak ' +
          'ada bola, tidak ada fisika.',
          'Yang ada satu tabel lima puluh angka, dan tiga baris kode:',
          '<code>1780 R=RND*10</code><br>' +
          '<code>1790 RW=FIX(R)</code><br>' +
          '<code>1050 YDS=YDS-YRD(RW,POSI)</code>',
          'Satu lemparan dadu memilih <b>baris</b>, taktik pemain memilih ' +
          '<b>kolom</b>, dan angka di persimpangannya adalah hasil ' +
          'permainannya dalam yard.',
          'Yang membuatnya lebih dari sekadar tabel: tiga angka diberi arti ' +
          'khusus. <b>98</b> berarti fumble, <b>99</b> intersep, <b>100</b> ' +
          'touchdown. Baris 1480-1500 memeriksanya sebelum angkanya ' +
          'diperlakukan sebagai yard.',
          'Konsekuensinya menarik: taktik "Long Bomb" (kolom 5) punya dua ' +
          'nilai 99 dan satu 50 di tabelnya &mdash; sering intersep, sesekali ' +
          'lima puluh yard. Itulah keseimbangan permainannya, dan seluruhnya ' +
          'ada di dalam angka.'
        ] },
      { judul: 'Cacat yang tidak pernah ketahuan',
        isi: [
          'Baris 590 mengisi tabelnya:',
          '<code>590 FOR I=1 TO 10:FOR J=1 TO 5:READ YRD(I,J):NEXT J,I</code>',
          'Baris 1790 memilih barisnya:',
          '<code>1790 RW=FIX(R)</code> &nbsp; dengan <code>R = RND*10</code>',
          '<code>RND</code> menghasilkan angka dari 0 sampai (hampir) 1, jadi ' +
          '<code>RND*10</code> adalah 0 sampai 9,999 dan <code>FIX</code>-nya ' +
          '<b>0 sampai 9</b>.',
          'Tabelnya diisi baris <b>1 sampai 10</b>. Yang dibaca baris <b>0 ' +
          'sampai 9</b>. Dua akibatnya:',
          '<b>Baris ke-10 tabel tidak pernah dipakai.</b> Lima angka di ujung ' +
          'DATA &mdash; 2, 0, 4, 2, 0 &mdash; tidak pernah muncul di layar.',
          '<b>Baris ke-0 tidak pernah diisi.</b> BASIC menyiapkan lariknya ' +
          'dengan nol, dan tidak ada yang menggantinya. Jadi satu dari ' +
          'sepuluh permainan menghasilkan tepat <b>nol yard</b>, apa pun ' +
          'taktik yang dipilih kedua belah pihak.',
          'Kenapa tidak pernah ketahuan? Karena hasilnya <b>masuk akal</b>. ' +
          'Nol yard adalah hasil yang wajar di sepak bola; pemain akan ' +
          'menganggapnya pertahanan yang bagus. Cacat yang menghasilkan ' +
          'keluaran yang mustahil akan langsung terlihat; cacat yang ' +
          'menghasilkan keluaran yang <b>wajar</b> bisa bertahan empat puluh ' +
          'tahun.',
          'Di penelusur, ini bisa dilihat langsung: pasang titik henti di ' +
          'baris 1790 dan perhatikan <code>RW</code>. Waktu nilainya 0, ' +
          'baris 1050 akan mengurangi yard dengan nol.'
        ] },
      { judul: 'Kolom layar yang jadi koordinat permainan',
        isi: [
          'Di mana bolanya? Program ini menjawabnya dengan <b>nomor kolom ' +
          'layar</b>: <code>OPS</code> dan <code>NPS</code> bernilai 16 ' +
          'sampai 64, dan itu langsung dipakai di <code>LOCATE 17,NPS</code>.',
          'Tidak ada terjemahan dari "yard" ke "kolom" karena tidak ada yang ' +
          'namanya yard di dalam program. Yang ada cuma kolom.',
          'Terjemahan baru terjadi waktu angkanya perlu <b>ditampilkan</b>:',
          '<code>2780 YLN=(NPS-15)*2</code><br>' +
          '<code>2790 IF YLN>50 THEN YLN=100-YLN</code>',
          'Kolom 16 jadi yard 2, kolom 40 jadi yard 50, kolom 64 jadi yard 98 ' +
          '&mdash; yang lalu dipantulkan jadi 2. Karena garis yard di sepak ' +
          'bola memang dihitung dari gawang <b>terdekat</b>: 20 di kiri dan 20 ' +
          'di kanan sama-sama "garis 20".',
          'Dan karena posisinya cuma satu angka, membalik lapangan di ganti ' +
          'kuarter cukup satu pengurangan (baris 2900):',
          '<code>NPS=80-OPS</code>',
          'Tengah lapangan di kolom 40, jadi mencerminkan posisi berarti ' +
          'mengurangkannya dari 80. <b>Memilih satuan yang tepat membuat ' +
          'operasi yang sulit jadi satu baris.</b>',
          'Harganya: yard bergerak setengah kolom (<code>YRD/2</code> di ' +
          'baris 1530), jadi permainan satu yard tidak menggeser bola sama ' +
          'sekali di layar &mdash; dan posisi bola diam-diam menyimpan ' +
          'setengahan yang tidak pernah terlihat.'
        ] }
    ]
  };
})(window);
