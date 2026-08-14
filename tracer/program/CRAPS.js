/* ===========================================================================
   CRAPS.js — porting minimalis CRAPS.BAS sebagai tabel baris.

   Program keempat belas, dan tempat gagasan dari HANGMAN.BAS mencapai
   bentuk paling murninya:

   SATU STRING YANG MENGGAMBAR SEBUAH DADU.

       1340 A=STRING$(7,29):A3=SPACE$(7):A4=SPACE$(5):A5=SPACE$(3)
       1360 A(1)=A3+CHR$(31)+A+A5+CHR$(254)+A5+CHR$(31)+A+A3

   Dibaca satu per satu: cetak tujuh spasi, TURUN satu baris, MUNDUR tujuh
   kolom, cetak tiga spasi + satu titik + tiga spasi, turun lagi, mundur lagi,
   cetak tujuh spasi. Hasilnya kotak 7x3 dengan satu titik di tengah — mata
   dadu bernilai satu, digambar oleh SATU perintah PRINT.

   Ketujuh muka dadu (A(0) sampai A(6)) dibangun begitu di baris 1350-1410,
   dan penanda titik di baris 1420-1430 memakai cara yang sama. Komentar di
   `web/_shared/svg.js` menyebut berkas ini sebagai contohnya; sekarang bisa
   ditelusuri barisnya.

   Yang juga ditagih: `PRINT USING` — pencetakan berformat, dipakai untuk uang.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` dan `PLAY` tidak berbunyi (termasuk lagu "We're In The Money" di
     baris 610-630 dan bunyi kalah di 690).
   - `COLOR 31` di baris 2520 berarti putih terang BERKEDIP; kedip tidak
     ditiru.
   - Pengacaknya bukan pengacak GW-BASIC, dan benihnya tetap.
   - Kelima gelung tunda habis seketika.
   - `PRINT USING` yang ditiru hanya bentuk `$$#####,.##`; lihat catatan di
     mesin.
   =========================================================================== */

(function (global) {
  'use strict';

  var UANG = '$$#####,.##';

  /* `RIGHT$(TIME$,2)` — dua digit detik dari jam DOS. Penelusur tidak punya
     jam, dan memakai angka tetap ternyata membekukan dadunya: baris 1290
     menyemai ulang di TIAP putaran gelung kocokan, jadi dengan benih tetap
     keenam kocokan — dan setiap lemparan berikutnya — keluar angka yang sama
     persis. Maka jam ditiru sebagai jam yang MAJU: mulai dari 23 dan bertambah
     tujuh detik tiap kali dibaca, berputar di 60. Tetap bisa diulang, tapi
     tidak beku. */
  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  var tabel = [

    trap(10, 1), trap(20, 2), trap(30, 3), trap(40, 4), trap(50, 5),
    trap(60, 6), trap(70, 7), trap(80, 8), trap(90, 9),
    { baris: 100, jalan: function (m) {
        for (m.v.A_ = 1; m.v.A_ <= 9; m.v.A_++) m.jebakan(m.v.A_, true);
      } },
    { baris: 110, jalan: function (m) { m.warna(3, 0); m.locate(null, null, 0); } },
    /* 120 DEFSTR A — semua variabel berawalan A bertipe teks.
       H dan H1 adalah uang dalam DUA satuan: H keping ratusan, H1 keping
       ribuan. Baris 2230-2240 yang menjaga H tetap di 0..10. */
    { baris: 120, jalan: function (m) {
        m.cls(); m.dim('A', 6); m.v.H = 10; m.v.H1 = 1;
        m.v.JAM = 23; m.semai(m.v.JAM);
      } },
    { baris: 130, jalan: function (m) { m.jebakan(10, true); m.pasangJebakan(10, 2100); } },
    { baris: 140, bagian: [
        function (m) { m.gosub(1450); },   /* judul + petunjuk  */
        function (m) { m.gosub(1340); },   /* bangun muka dadu  */
        function (m) { m.gosub(850); }     /* gambar meja       */
      ] },
    { baris: 150, bagian: [
        function (m) { m.gosub(2150); },
        function (m) { m.gosub(2230); }
      ] },
    { baris: 160, jalan: function (m) { if (m.v.H < 1) m.gosub(1830); } },
    { baris: 170, jalan: function (m) {
        if (m.v.H + m.v.H1 * 10 > 100) m.lompat(2510);
      } },
    { baris: 180, bagian: [
        function (m) { m.gosub(310); },    /* taruhan          */
        function (m) { m.gosub(1210); },   /* kocok dadu       */
        function (m) { m.gosub(830); }
      ] },
    /* 190-200 lemparan pertama: 7 atau 11 menang, 2/3/12 kalah — kecuali
       kalau bertaruh DON'T PASS, yang membalik keduanya. Satu variabel P
       membalik seluruh aturan menang-kalah. */
    { baris: 190, jalan: function (m) {
        m.v.K = Math.floor(m.v.C + m.v.D);
        if (m.v.K === 7 || m.v.K === 11) m.lompat(m.v.P === 0 ? 580 : 680);
      } },
    { baris: 200, jalan: function (m) {
        var K = m.v.K;
        if (K === 2 || K === 3 || K === 12) m.lompat(m.v.P === 0 ? 680 : 580);
      } },
    { baris: 210, jalan: function (m) {
        m.locate(2, 29);
        m.cetak('   THE POINT IS' + angka(m.v.K) + '    '); m.barisBaru();
      } },
    { baris: 220, jalan: function (m) { m.v.J = 7; } },
    { baris: 230, jalan: function (m) { if (m.inkey() !== '') m.lompat(230); } },
    { baris: 240, jalan: function (m) {
        m.v['J$'] = m.inkey();
        if (m.v['J$'] === '') m.lompat(240);
      } },
    { baris: 250, jalan: function (m) {
        m.locate(3, m.v.J * 4 + 10); m.cetak(m.v.A2);
      } },
    { baris: 260, jalan: function (m) { m.gosub(1210); } },
    { baris: 270, jalan: function (m) {
        m.v.J = Math.floor(m.v.C + m.v.D);
        m.warna(15, null);
        m.locate(3, m.v.J * 4 + 10); m.cetak(m.v.A1);
        m.warna(3, 0);
      } },
    { baris: 280, jalan: function (m) {
        if (m.v.J === m.v.K) m.lompat(m.v.P === 1 ? 720 : 660);
      } },
    { baris: 290, jalan: function (m) {
        if (m.v.J === 7) m.lompat(m.v.P === 0 ? 720 : 660);
      } },
    { baris: 300, jalan: function (m) { m.lompat(230); } },

    /* 310-570 minta taruhan. */
    { baris: 310, jalan: function (m) { m.locate(21, 24); m.spc(35); m.barisBaru(); } },
    { baris: 320, jalan: function (m) { m.locate(21, 24); m.warna(15, null); } },
    { baris: 330, jalan: function (m) {
        m.cetak("Bet on `PASS' or `DON'T PASS' <P/D>?");
        m.warna(3, 0);
      } },
    { baris: 340, jalan: function (m) { if (m.inkey() !== '') m.lompat(340); } },
    { baris: 350, jalan: function (m) {
        m.v['J$'] = m.inkey();
        if (m.v['J$'] === '') m.lompat(350);
      } },
    { baris: 360, jalan: function (m) {
        var j = m.v['J$'];
        if (j === 'P' || j === 'p') { m.v.P = 0; m.lompat(400); }
      } },
    { baris: 370, jalan: function (m) {
        var j = m.v['J$'];
        if (j === 'D' || j === 'd') { m.v.P = 1; m.lompat(400); }
      } },
    { baris: 380, jalan: function (m) {
        m.locate(23, 21);
        m.cetak("Strike <P> For PASS or <D> For DON'T PASS");
      } },
    { baris: 390, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 2000; m.v.F++) { /* jeda */ }
        m.locate(23, 20); m.spc(42); m.barisBaru();
        m.lompat(350);
      } },
    { baris: 400, jalan: function (m) { m.warna(15, null); } },
    { baris: 410, jalan: function (m) {
        if (m.v.P) {
          m.locate(13, 60); m.cetak('**'); m.barisBaru();
          m.locate(13, 32); m.cetak('  ');
          m.lompat(430);
        }
      } },
    { baris: 420, jalan: function (m) {
        m.locate(13, 32); m.cetak('**'); m.barisBaru();
        m.locate(13, 60); m.cetak('  '); m.barisBaru();
      } },
    { baris: 430, jalan: function (m) {
        m.warna(3, 0);
        m.locate(20, 1); m.spc(62); m.barisBaru();
        m.locate(21, 1); m.spc(64); m.barisBaru();
      } },
    { baris: 440, jalan: function (m) {
        m.locate(21, 30); m.cetak('Place Your Bets Please'); m.barisBaru();
      } },
    { baris: 450, jalan: function (m) { m.gosub(1720); } },
    { baris: 460, jalan: function (m) { if (m.v.G > 0) m.lompat(490); } },
    { baris: 470, jalan: function (m) {
        m.locate(23, 23); m.cetak('Please Bet An Amount Greater Than Zero');
      } },
    { baris: 480, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 4000; m.v.F++) { /* jeda */ }
        m.locate(23, 23); m.spc(40); m.barisBaru();
        m.lompat(450);
      } },
    { baris: 490, jalan: function (m) {
        if (m.v.G <= m.v.H + m.v.H1 * 10) m.lompat(520);
      } },
    { baris: 500, jalan: function (m) {
        m.locate(23, 15);
        m.cetak("Hey, I Ain't Stupid! You Don't Have That Much."); m.barisBaru();
      } },
    { baris: 510, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 2500; m.v.F++) { /* jeda */ }
        m.locate(23, 15); m.spc(45); m.barisBaru();
        m.lompat(450);
      } },
    { baris: 520, jalan: function (m) { m.locate(21, 1); m.spc(62); m.barisBaru(); } },
    { baris: 530, bagian: [
        function (m) { m.v.H = m.v.H - m.v.G; },
        function (m) { m.gosub(2230); },
        function (m) { m.locate(10, 69); m.warna(15, null); }
      ] },
    /* 540 PRINT USING "$$#####,.##" — uang dicetak berformat. */
    { baris: 540, jalan: function (m) {
        m.cetakFormat(UANG, m.v.H * 100 + m.v.H1 * 1000);
        m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 550, jalan: function (m) {
        m.locate(2, 29); m.cetak('***** COMING OUT *****'); m.barisBaru();
      } },
    { baris: 560, bagian: [
        function (m) {
          m.locate(22, 10); m.spc(50); m.barisBaru();
          m.locate(15, 8 + m.v.P * 20 + 9);
        },
        function (m) { m.gosub(2310); }
      ] },
    { baris: 570, jalan: function (m) { m.kembali(); } },

    /* 580-740 menang dan kalah. */
    { baris: 580, jalan: function (m) {
        m.locate(23, 10); m.spc(50); m.barisBaru();
        m.locate(23, 37); m.cetak('YOU WIN');
      } },
    { baris: 590, jalan: function (m) { m.v.H = m.v.H + 2 * m.v.G; } },
    { baris: 600, jalan: function () { /* REM WERE IN THE MONEY */ } },
    lagu(610, 'MN T120'),
    lagu(620, 'O3 P8 O2E8 O2G8. O2E16 F8 G4.'),
    { baris: 630, jalan: function () { /* baris PLAY yang dimatikan */ } },
    { baris: 640, jalan: function (m) { m.v.G = m.v.G * 2; } },
    { baris: 650, jalan: function (m) { m.lompat(700); } },
    { baris: 660, jalan: function (m) {
        m.locate(23, 10); m.spc(50); m.barisBaru();
        m.locate(23, 37); m.cetak('You Win!');
      } },
    { baris: 670, jalan: function (m) { m.lompat(590); } },
    { baris: 680, jalan: function (m) {
        m.locate(23, 10); m.spc(50); m.barisBaru();
        m.locate(23, 32); m.cetak('Sorry, You Lose.'); m.barisBaru();
      } },
    { baris: 690, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 8; m.v.F++) {
          m.suara(50, 1); m.suara(37, 1); m.suara(40, 1);
        }
      } },
    { baris: 700, jalan: function (m) { m.gosub(2200); } },
    { baris: 710, jalan: function (m) { m.lompat(740); } },
    { baris: 720, jalan: function (m) {
        m.locate(23, 10); m.spc(50); m.barisBaru();
        m.locate(23, 32); m.cetak('Sorry, You Lose.'); m.barisBaru();
      } },
    { baris: 730, jalan: function (m) { m.lompat(690); } },
    { baris: 740, jalan: function (m) {
        m.locate(10, 69); m.warna(15, null);
        m.cetakFormat(UANG, m.v.H * 100 + m.v.H1 * 1000); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 750, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 1000; m.v.F++) { /* jeda */ }
      } },
    { baris: 760, jalan: function (m) { m.locate(2, 29); m.spc(25); m.barisBaru(); } },
    { baris: 770, jalan: function (m) {
        m.locate(3, m.v.K * 4 + 10); m.cetak(m.v.A2);
      } },
    { baris: 780, jalan: function (m) {
        m.locate(3, (m.v.C + m.v.D) * 4 + 10); m.cetak(m.v.A2);
      } },
    bersih(790, 15), bersih(800, 22), bersih(810, 23),
    { baris: 820, jalan: function (m) { m.lompat(160); } },
    { baris: 830, jalan: function (m) {
        m.locate(3, (m.v.C + m.v.D) * 4 + 10); m.cetak(m.v.A1);
      } },
    /* 840 RETURN — penutup 830 SEKALIGUS badan jebakan F1-F9. */
    { baris: 840, jalan: function (m) { m.kembali(); } },

    /* 850-1180 gambar meja judi. */
    { baris: 850, jalan: function (m) {
        m.locate(1, 15);
        m.cetak(m.chr(201) + m.ulang(50, 205) + m.chr(187)); m.barisBaru();
      } },
    { baris: 860, jalan: function (m) { m.untuk('B', 2, 13, 1, 890); } },
    { baris: 870, jalan: function (m) {
        m.locate(m.v.B, 15); m.cetak(m.chr(186)); m.barisBaru();
        m.locate(m.v.B, 66); m.cetak(m.chr(186)); m.barisBaru();
      } },
    { baris: 880, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 890, jalan: function (m) { m.locate(12, 15); } },
    { baris: 900, jalan: function (m) {
        m.cetak(m.chr(204) + m.ulang(24, 205) + m.chr(203) +
                m.ulang(25, 205) + m.chr(185)); m.barisBaru();
      } },
    { baris: 910, jalan: function (m) { m.locate(14, 15); } },
    { baris: 920, jalan: function (m) {
        m.cetak(m.chr(200) + m.ulang(24, 205) + m.chr(202) +
                m.ulang(25, 205) + m.chr(188)); m.barisBaru();
      } },
    { baris: 930, jalan: function (m) {
        m.locate(13, 40); m.cetak(m.chr(186)); m.barisBaru();
      } },
    { baris: 940, jalan: function (m) {
        m.locate(13, 16); m.cetak('         PASS'); m.barisBaru();
        m.locate(13, 41); m.cetak("       DON'T PASS"); m.barisBaru();
      } },
    { baris: 950, jalan: function (m) {
        m.locate(10, 69); m.warna(15, null);
        m.cetakFormat(UANG, m.v.H * 100 + m.v.H1 * 1000); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 960, jalan: function (m) {
        m.locate(4, 16);
        m.cetak('    2   3   4   5   6   7   8   9  10  11  12'); m.barisBaru();
      } },
    kotakAtas(970, 6, 31), kotakAtas(980, 6, 41),
    sisi(990, 7, 31, 39), sisi(1000, 7, 41, 49),
    sisi(1010, 8, 31, 39), sisi(1020, 8, 41, 49),
    sisi(1030, 9, 31, 39), sisi(1040, 9, 41, 49),
    kotakBawah(1050, 10, 31), kotakBawah(1060, 10, 41),
    { baris: 1070, jalan: function (m) {
        m.locate(7, 68); m.cetak(m.ulang(13, 178)); m.barisBaru();
      } },
    { baris: 1080, jalan: function (m) {
        m.locate(8, 68); m.cetak(m.chr(178) + ' YOU  HAVE'); m.barisBaru();
        m.locate(8, 80); m.cetak(m.chr(178));
      } },
    { baris: 1090, jalan: function (m) {
        m.locate(8, 69); m.warna(15, 0);
        m.cetak(' YOU  HAVE '); m.warna(3, 0);
      } },
    tepi(1100, 9), tepi(1110, 10),
    { baris: 1120, jalan: function (m) {
        m.locate(11, 68); m.cetak(m.ulang(13, 178)); m.barisBaru();
      } },
    { baris: 1130, jalan: function (m) {
        m.locate(7, 1); m.warna(15, null);
        m.cetak(m.ulang(13, 176)); m.barisBaru();
      } },
    papan(1140, 8, 'N E V A D A'),
    papan(1150, 9, '           '),
    papan(1160, 10, '  D I C E  '),
    { baris: 1170, jalan: function (m) {
        m.locate(11, 1); m.cetak(m.ulang(13, 176)); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1180, jalan: function (m) { m.kembali(); } },

    /* 1190-1330 kocok dadu enam kali, dengan bunyi tiap kocokan. */
    { baris: 1190, jalan: function (m) { m.locate(7, 32); m.cetak(m.v.A[0]); } },
    { baris: 1200, jalan: function (m) { m.locate(7, 42); m.cetak(m.v.A[0]); } },
    { baris: 1210, jalan: function (m) { m.warna(15, null); } },
    { baris: 1220, jalan: function (m) { m.untuk('B', 1, 6, 1, 1320); } },
    { baris: 1230, jalan: function (m) { m.suara(137, 0.01); } },
    { baris: 1240, jalan: function (m) {
        m.locate(7, 32);
        m.v.C = Math.floor(m.acak() * 6) + 1;
        m.cetak(m.v.A[m.v.C]); m.barisBaru();
      } },
    { baris: 1250, jalan: function (m) { m.suara(37, 0); } },
    /* 1260 dan 1290 menyemai ulang DI DALAM gelung kocokan — pola yang sama
       dengan MASTER.BAS dan HANGMAN.BAS. Di sini benihnya bahkan dikalikan
       RND, yang berarti benihnya sendiri sudah acak; menyemai ulang dengan
       angka acak tidak menambah keacakan, cuma membuang deret yang sedang
       berjalan.

       Akibat sampingannya baru terlihat waktu diuji: kalau `TIME$` diganti
       angka TETAP, dadunya membeku sepenuhnya. Lihat catatan `detik()` di
       atas. */
    { baris: 1260, jalan: function (m) { m.semai(detik(m) * m.acak()); } },
    { baris: 1270, jalan: function (m) {
        m.locate(7, 42);
        m.v.D = Math.floor(m.acak() * 6) + 1;
        m.cetak(m.v.A[m.v.D]); m.barisBaru();
      } },
    { baris: 1280, jalan: function (m) { m.suara(137, 0.01); } },
    { baris: 1290, jalan: function (m) { m.semai(detik(m)); } },
    { baris: 1300, jalan: function (m) { m.suara(37, 0); } },
    { baris: 1310, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 1320, jalan: function (m) { m.warna(3, 0); } },
    { baris: 1330, jalan: function (m) { m.kembali(); } },

    /* --- 1340-1440: TUJUH MUKA DADU, MASING-MASING SATU STRING ---------- */

    { baris: 1340, jalan: function (m) {
        m.v.A_S = m.ulang(7, 29);        /* tujuh kali kursor-kiri */
        m.v.A3 = spasi(7); m.v.A4 = spasi(5); m.v.A5 = spasi(3);
      } },
    muka(1350, 0), muka(1360, 1), muka(1370, 2), muka(1380, 3),
    muka(1390, 4), muka(1400, 5), muka(1410, 6),
    /* 1420 penanda titik: kotak kecil 4x3, juga dari satu string. */
    { baris: 1420, jalan: function (m) {
        m.v.A1 = m.chr(201) + m.ulang(2, 205) + m.chr(187) +
                 m.chr(31) + m.ulang(4, 29) +
                 m.chr(186) + m.ulang(2, 28) + m.chr(186) +
                 m.chr(31) + m.ulang(4, 29) +
                 m.chr(200) + m.ulang(2, 205) + m.chr(188);
      } },
    { baris: 1430, jalan: function (m) {
        m.v.A2 = '    ' + m.chr(31) + m.ulang(4, 29) +
                 ' ' + m.ulang(2, 28) + ' ' +
                 m.chr(31) + m.ulang(4, 29) + '    ';
      } },
    { baris: 1440, jalan: function (m) { m.kembali(); } },

    /* 1450-1710 layar judul dan petunjuk. */
    { baris: 1450, jalan: function (m) { m.cls(); } },
    { baris: 1460, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 1470, bagian: [
        function (m) { m.untuk('B', 2, 22, 1, 1490); },
        function (m) {
          m.locate(m.v.B, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.B, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      ] },
    { baris: 1480, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 1490, jalan: function (m) {
        m.locate(m.v.B, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 1500, jalan: function (m) {
        m.locate(4, 30); m.warna(15, 0);
        m.cetak('N E V A D A   D I C E'); m.barisBaru();
      } },
    { baris: 1510, jalan: function (m) {
        m.locate(10, 24); m.warna(15, null);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1520, jalan: function (m) {
        m.v.A_STR = m.inkey();
        var a = m.v.A_STR;
        if (a === 'N' || a === 'n') { m.cls(); m.kembali(); }
        else if (a !== 'Y' && a !== 'y') m.lompat(1520);
      } },
    { baris: 1530, jalan: function (m) {
        m.locate(2, 30); m.warna(15, 0);
        m.cetak('N E V A D A   D I C E     '); m.barisBaru();
        m.warna(3, 0);
      } },
    ajar(1540,  4, 10, "Friendlyware's NEVADA  DICE differs from the CASINO-STYLE game"),
    ajar(1550,  5, 10, 'in TWO ways: there  are  no  sidebets (hardways,fieldbets,etc)'),
    ajar(1560,  6, 10, "              AND WE CAN'T TAKE ANY OF YOUR CASH"),
    ajar(1570,  8, 10, 'The  object  is  to  accumulate  money  by  throwing  as many'),
    ajar(1580,  9, 10, "`PASSES' as  you can. A `PASS'  is a  winning  roll. A  `ROLL'"),
    ajar(1590, 10, 10, 'can be  and  usually is,  more  than  one  roll  of the  dice.'),
    ajar(1600, 12, 10, 'On your  first throw one of three things can happen: 1) You'),
    ajar(1610, 13, 10, "will throw a `NATURAL'  7  or  11  YOU WIN, 2) You will throw"),
    ajar(1620, 14, 10, "2, 3, 12,  YOU  LOSE  or    3) You will establish your `POINT'"),
    ajar(1630, 15, 10, 'by  throwing a  4, 5, 6, 8, 9  or 10. ( 7 and 11 are  winners'),
    ajar(1640, 16, 10, 'and  2, 3, and  12  are  losers  on  the  FIRST  throw  only).'),
    { baris: 1650, jalan: function (m) {
        m.locate(18, 10);
        m.cetak("You're a  winner if you  throw  your  POINT  again ");
      } },
    { baris: 1660, jalan: function (m) {
        m.warna(1, null); m.cetak('before');
        m.warna(3, 0); m.cetak(' you'); m.barisBaru();
      } },
    ajar(1670, 19, 10, 'throw a 7. You lose if you roll a 7 before rolling your POINT.'),
    ajar(1680, 20, 10, 'You may also bet  AGAINST  the dice or DON\'T PASS. This means'),
    ajar(1690, 21, 10, 'you  WIN  your bet if the  DICE LOSE and LOSE if the DICE WIN.'),
    { baris: 1700, jalan: function (m) {
        m.locate(25, 27); m.warna(15, null);
        m.cetak('Strike Any Key To Continue');
        m.warna(3, 0);
      } },
    { baris: 1710, jalan: function (m) {
        m.v.A_STR = m.inkey();
        if (m.v.A_STR !== '') { m.cls(); m.kembali(); } else m.lompat(1710);
      } },

    /* 1720-1820 penyunting jumlah taruhan, tombol demi tombol lagi.
       Spasi mengakhiri masukan — bukan Enter. Baris 1760 justru MENOLAK
       Enter, dan tidak ada satu pun petunjuk di layar yang mengatakannya. */
    { baris: 1720, jalan: function (m) {
        m.locate(22, 1); m.spc(62); m.barisBaru();
        m.locate(22, 26); m.warna(15, null);
      } },
    { baris: 1730, jalan: function (m) {
        m.cetak('How Many Chips?   From 1 To' + angka(m.v.H + m.v.H1 * 10));
        m.warna(3, 0);
      } },
    { baris: 1740, jalan: function (m) { m.v.A0 = spasi(7); } },
    { baris: 1750, jalan: function (m) {
        m.v.A_STR = m.inkey();
        if (m.v.A_STR === '') m.lompat(1750);
        else if (m.v.A_STR === ' ') {
          m.v.G = parseInt(m.v.A0, 10) || 0;
          m.kembali();
        }
      } },
    { baris: 1760, jalan: function (m) {
        if (m.v.A_STR === m.chr(13)) m.lompat(1750);
      } },
    { baris: 1770, jalan: function (m) {
        if (m.v.A0.length > 10) { m.v.G = 0; m.kembali(); }
      } },
    { baris: 1780, jalan: function (m) { m.warna(15, null); m.locate(23, 30); } },
    { baris: 1790, jalan: function (m) {
        m.cetak('Press Space Bar To Roll'); m.barisBaru();
        m.locate(22, 51 + m.v.A0.length); m.warna(3, 0);
      } },
    { baris: 1800, jalan: function (m) {
        if (m.v.A_STR === m.chr(8) ||
            m.v.A_STR.charAt(1) === m.chr(75)) m.lompat(1820);
      } },
    { baris: 1810, jalan: function (m) {
        m.v.A0 = m.v.A0 + m.v.A_STR;
        m.cetak(m.v.A_STR);
        m.lompat(1750);
      } },
    { baris: 1820, jalan: function (m) {
        m.cetak(m.chr(29) + m.chr(32) + m.chr(29));
        m.v.A0 = m.v.A0.slice(0, m.v.A0.length - 1);
        m.lompat(1750);
      } },

    /* 1830-2090 kehabisan uang: tawaran menjual barang. */
    { baris: 1830, jalan: function (m) {
        m.warna(15, null); m.locate(22, 26);
        m.cetak("You Don't Have Any More Money."); m.barisBaru();
      } },
    { baris: 1840, jalan: function (m) {
        m.locate(23, 24); m.cetak('Would You Like To Sell Your');
      } },
    /* 1850 ON XXX-1 GOTO ... — daftar barang berputar. Perhatikan urutan
       nilainya: rumah dihargai 500 dolar, papan luncur juga 500, sementara
       perahu 2000. Lelucon yang seluruhnya ada di tabel angka. */
    { baris: 1850, jalan: function (m) {
        m.v.XXX = (m.v.XXX || 0) + 1;
        var tujuan = [1880, 1890, 1900, 1910, 1920, 1930, 1940];
        var t = tujuan[m.v.XXX - 2];
        if (t) m.lompat(t);
      } },
    { baris: 1860, jalan: function (m) { if (m.v.XXX > 7) m.v.XXX = 0; } },
    barang(1870, ' Car?', 20), barang(1880, ' Boat?', 20),
    barang(1890, ' Computer?', 20), barang(1900, ' Motorcycle?', 18),
    barang(1910, ' Stereo?', 12), barang(1920, ' Golf Clubs?', 6),
    barang(1930, ' House?', 5), barang(1940, ' Skate Board?', 5),
    { baris: 1950, jalan: function (m) { m.cetak(' <Y/N>'); m.warna(3, 0); } },
    { baris: 1960, jalan: function (m) { m.v.A_STR = m.inkey(); } },
    { baris: 1970, jalan: function (m) {
        var a = m.v.A_STR;
        if (a === 'Y' || a === 'y') m.lompat(1990);
      } },
    { baris: 1980, jalan: function (m) {
        var a = m.v.A_STR;
        if (a !== 'n' && a !== 'N') m.lompat(1960); else m.lompat(2050);
      } },
    { baris: 1990, jalan: function (m) { m.v.H1 = 0; m.v.H = m.v.VV; } },
    { baris: 2000, jalan: function (m) {
        if (m.v.H > 9) { m.v.H1 = m.v.H1 + 1; m.v.H = m.v.H - 10; m.lompat(2000); }
      } },
    { baris: 2010, jalan: function (m) {
        m.locate(22, 15);
        m.cetak("          OK. I'll give you $" + angka(m.v.VV * 100) +
                'for it.      '); m.barisBaru();
      } },
    { baris: 2020, jalan: function (m) { m.locate(23, 1); m.spc(79); } },
    { baris: 2030, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 2500; m.v.F++) { /* jeda */ }
        m.locate(22, 10); m.spc(50); m.barisBaru();
        m.locate(23, 10); m.spc(54); m.barisBaru();
      } },
    { baris: 2040, jalan: function (m) {
        m.locate(10, 69); m.warna(15, null);
        m.cetakFormat(UANG, m.v.H * 100 + m.v.H1 * 1000); m.barisBaru();
        m.lompat(2230);
      } },
    { baris: 2050, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 3500; m.v.F++) { /* jeda */ }
        m.cls(); m.locate(12, 20); m.warna(15, null);
      } },
    { baris: 2060, jalan: function (m) {
        m.cetak('Would You Like To Play Again? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 2070, jalan: function (m) {
        m.v.A_STR = m.inkey();
        if (m.v.A_STR === '') m.lompat(2070);
      } },
    { baris: 2080, jalan: function (m) {
        var a = m.v.A_STR;
        if (a === 'Y' || a === 'y') m.jalankan();
      } },
    { baris: 2090, jalan: function (m) {
        var a = m.v.A_STR;
        if (a === 'N' || a === 'n') m.lompat(2190); else m.lompat(2070);
      } },

    /* 2100-2180 penangan F10. Baris 2140 jatuh ke 2150, yang juga dipanggil
       sebagai subrutin dari baris 150. */
    { baris: 2100, jalan: function (m) { m.jebakan(10, false); m.warna(15, null); } },
    { baris: 2110, jalan: function (m) {
        m.locate(25, 23);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
      } },
    { baris: 2120, jalan: function (m) {
        m.v.A_STR = m.inkey();
        if (m.v.A_STR === '') m.lompat(2120);
      } },
    { baris: 2130, jalan: function (m) {
        var a = m.v.A_STR;
        if (a === 'Y' || a === 'y') m.lompat(2190);
        else if (a !== 'N' && a !== 'n') m.lompat(2120);
      } },
    { baris: 2140, jalan: function (m) { m.locate(25, 1); m.spc(60); } },
    { baris: 2150, jalan: function (m) {
        m.locate(25, 25); m.warna(0, 15);
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(3, 0);
      } },
    { baris: 2160, jalan: function (m) {
        m.locate(25, 68); m.cetak("100's 1000's");
      } },
    { baris: 2170, jalan: function (m) {
        m.locate(23, 35); m.spc(10);
        m.locate(23, 35); m.v.A0 = ''; m.v.A_STR = '';
      } },
    { baris: 2180, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },
    { baris: 2190, jalan: function (m) { m.rantai('MENU'); } },

    bersih(2200, 16), bersih(2210, 17), bersih(2220, 18),

    /* 2230-2240 normalisasi uang: pindahkan antara keping ratusan dan ribuan
       sampai H ada di 0..10. Gelung yang ditulis sebagai GOTO ke dirinya
       sendiri, bukan sebagai WHILE. */
    { baris: 2230, jalan: function (m) {
        m.warna(3, 0);
        if (m.v.H < 1 && m.v.H1 > 0) {
          m.v.H1 = m.v.H1 - 1; m.v.H = m.v.H + 10; m.lompat(2230);
        }
      } },
    { baris: 2240, jalan: function (m) {
        if (m.v.H > 10) { m.v.H1 = m.v.H1 + 1; m.v.H = m.v.H - 10; m.lompat(2240); }
      } },
    { baris: 2250, jalan: function (m) { m.warna(15, null); } },
    { baris: 2260, jalan: function (m) {
        for (m.v.F = 13; m.v.F <= 23; m.v.F++) {
          m.locate(m.v.F, 68); m.spc(11); m.barisBaru();
        }
      } },
    { baris: 2270, jalan: function (m) {
        for (m.v.F = 23; m.v.F >= 24 - m.v.H; m.v.F--) {
          m.locate(m.v.F, 68); m.cetak(m.ulang(3, 223));
        }
      } },
    { baris: 2280, jalan: function (m) {
        m.v.HH = m.v.H1 > 12 ? 12 : m.v.H1;
      } },
    { baris: 2290, jalan: function (m) {
        for (m.v.F = 23; m.v.F >= 24 - m.v.HH; m.v.F--) {
          m.locate(m.v.F, 74); m.cetak(m.ulang(5, 223));
        }
      } },
    { baris: 2300, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    /* 2310-2500 tumpukan keping taruhan di meja. */
    { baris: 2310, jalan: function (m) { m.v.G1 = m.v.G; m.v.G2 = 0; } },
    { baris: 2320, jalan: function (m) {
        if (m.v.G1 > 9) { m.v.G2 = m.v.G2 + 1; m.v.G1 = m.v.G1 - 10; m.lompat(2320); }
      } },
    { baris: 2330, jalan: function (m) { m.v.F2 = 14 + m.v.P * 25; } },
    { baris: 2340, jalan: function (m) { m.v.F = 0; } },
    { baris: 2350, jalan: function (m) { if (m.v.F === m.v.G2) m.lompat(2420); } },
    { baris: 2360, jalan: function (m) { m.untuk('F1', 18, 16, -1, 2400); } },
    { baris: 2370, jalan: function (m) {
        if (m.v.F === m.v.G2) m.lompat(2420); else m.v.F = m.v.F + 1;
      } },
    { baris: 2380, jalan: function (m) {
        m.locate(m.v.F1, 5 + m.v.F2); m.cetak(m.ulang(5, 223));
      } },
    { baris: 2390, jalan: function (m) { m.lanjutkan('F1'); } },
    { baris: 2400, jalan: function (m) { m.v.F2 = m.v.F2 + 6; } },
    { baris: 2410, jalan: function (m) { m.lompat(2350); } },
    { baris: 2420, jalan: function (m) { m.v.F2 = m.v.F2 + 6; } },
    { baris: 2430, jalan: function (m) { m.v.F = 0; } },
    { baris: 2440, jalan: function (m) { if (m.v.F === m.v.G1) m.kembali(); } },
    { baris: 2450, jalan: function (m) { m.untuk('F1', 18, 16, -1, 2490); } },
    { baris: 2460, jalan: function (m) {
        if (m.v.F === m.v.G1) m.lompat(2490); else m.v.F = m.v.F + 1;
      } },
    { baris: 2470, jalan: function (m) {
        m.locate(m.v.F1, 5 + m.v.F2); m.cetak(m.ulang(3, 223));
      } },
    { baris: 2480, jalan: function (m) { m.lanjutkan('F1'); } },
    { baris: 2490, jalan: function (m) { m.v.F2 = m.v.F2 + 4; } },
    { baris: 2500, jalan: function (m) { m.lompat(2440); } },

    /* 2510-2540 menang total: uang lebih dari seratus keping. */
    { baris: 2510, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 5; m.v.F++) {
          m.suara(500, 1); m.suara(200, 1); m.suara(150, 1);
        }
      } },
    { baris: 2520, jalan: function (m) {
        m.cls(); m.locate(10, 26); m.warna(31, null);
        m.cetak('YOU BROKE THE BANK !!!!!!!'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 2530, jalan: function (m) {
        for (m.v.F = 1; m.v.F <= 10; m.v.F++) {
          m.suara(500, 1); m.suara(200, 1); m.suara(150, 1);
        }
      } },
    { baris: 2540, jalan: function (m) { m.lompat(2050); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }
  function spasi(n) { var s = '', i; for (i = 0; i < n; i++) s += ' '; return s; }

  function trap(nomor, tombol) {
    return { baris: nomor, jalan: function (m) { m.pasangJebakan(tombol, 840); } };
  }
  function lagu(nomor, makro) {
    return { baris: nomor, jalan: function (m) { m.mainkan(makro); } };
  }
  function bersih(nomor, baris) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 10); m.spc(50); m.barisBaru();
    } };
  }
  function ajar(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function kotakAtas(nomor, baris, kolom) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak(m.chr(218) + m.ulang(7, 196) + m.chr(191)); m.barisBaru();
    } };
  }
  function kotakBawah(nomor, baris, kolom) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak(m.chr(192) + m.ulang(7, 196) + m.chr(217)); m.barisBaru();
    } };
  }
  function sisi(nomor, baris, kiri, kanan) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kiri);  m.cetak(m.chr(179)); m.barisBaru();
      m.locate(baris, kanan); m.cetak(m.chr(179)); m.barisBaru();
    } };
  }
  function tepi(nomor, baris) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 68); m.cetak(m.chr(178)); m.barisBaru();
      m.locate(baris, 80); m.cetak(m.chr(178)); m.barisBaru();
    } };
  }
  function papan(nomor, baris, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 1);
      m.cetak(m.chr(176) + isi + m.chr(176)); m.barisBaru();
    } };
  }
  function barang(nomor, nama, nilai) {
    return { baris: nomor, jalan: function (m) {
      m.cetak(nama); m.v.VV = nilai; m.lompat(1950);
    } };
  }

  /* Satu muka dadu, dibangun persis seperti aslinya: tiga baris teks yang
     disambung dengan kursor-turun dan tujuh kursor-kiri. */
  function muka(nomor, n) {
    return { baris: nomor, jalan: function (m) {
      var A = m.v.A_S, A3 = m.v.A3, A4 = m.v.A4, A5 = m.v.A5;
      var turun = m.chr(31), pip = m.chr(254);
      var dua = ' ' + pip + A5 + pip;              /* dua titik sebaris */
      var s;
      if (n === 0)      s = A3 + turun + A + A3 + turun + A + A3;
      else if (n === 1) s = A3 + turun + A + A5 + pip + A5 + turun + A + A3;
      else if (n === 2) s = ' ' + pip + A4 + turun + A + A3 + turun + A + A4 + pip;
      else if (n === 3) s = ' ' + pip + A4 + turun + A + A5 + pip + A5 + turun + A + A4 + pip;
      else if (n === 4) s = dua + ' ' + turun + A + A3 + turun + A + dua;
      else if (n === 5) s = dua + ' ' + turun + A + A5 + pip + A5 + turun + A + dua;
      else              s = dua + ' ' + turun + A + dua + ' ' + turun + A + dua;
      m.v.A[n] = s;
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['CRAPS'] = {
    nama: 'CRAPS',
    judul: 'Nevada Dice',
    sumber: 'CRAPS',
    berkas: 'run/CRAPS.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur CRAPS.BAS',
      simpul: [
        { id: 'siap', baris: '10-150', jenis: 'mulai',
          teks: ['Petunjuk, bangun muka dadu,', 'gambar meja judi'] },
        { id: 'bangkrut', baris: '1830-2090', jenis: 'galat',
          teks: ['Kehabisan uang:', 'tawaran menjual barang'] },
        { id: 'taruhan', baris: '310-570', jenis: 'subrutin',
          teks: ['PASS atau DON\'T PASS,', 'lalu berapa keping'] },
        { id: 'kocok', baris: '1210-1330', jenis: 'subrutin',
          teks: ['Kocok dadu enam kali,', 'muka dadu dari satu string'] },
        { id: 'pertama', baris: '190-200', jenis: 'putusan',
          teks: ['7/11 menang, 2/3/12 kalah', '— kecuali kalau DON\'T PASS'] },
        { id: 'titik', baris: '210-300',
          teks: ['Angka lain jadi POINT;', 'lempar terus sampai POINT atau 7'] },
        { id: 'menang', baris: '580-670', jenis: 'keluar',
          teks: ['Taruhan dikembalikan dua kali,', 'lagu "We\'re In The Money"'] },
        { id: 'kalah', baris: '680-730', jenis: 'galat',
          teks: ['Taruhan hilang,', 'tiga nada rendah'] },
        { id: 'bank', baris: '2510-2540', jenis: 'keluar',
          teks: ['Lebih dari 100 keping:', '"YOU BROKE THE BANK"'] }
      ],
      panah: [
        { dari: 'siap',     ke: 'bangkrut', label: 'uang habis', jenis: 'galat' },
        { dari: 'bangkrut', ke: 'taruhan',  label: 'jual barang', jenis: 'galat' },
        { dari: 'siap',     ke: 'taruhan' },
        { dari: 'taruhan',  ke: 'kocok' },
        { dari: 'kocok',    ke: 'pertama' },
        { dari: 'pertama',  ke: 'menang',  label: '7 / 11' },
        { dari: 'pertama',  ke: 'kalah',   label: '2 / 3 / 12', jenis: 'galat' },
        { dari: 'pertama',  ke: 'titik',   label: 'angka lain' },
        { dari: 'titik',    ke: 'kocok',   label: 'lempar lagi' },
        { dari: 'titik',    ke: 'menang',  label: 'POINT keluar' },
        { dari: 'titik',    ke: 'kalah',   label: '7 keluar', jenis: 'galat' },
        { dari: 'menang',   ke: 'bank',    label: 'lebih 100 keping' },
        { dari: 'menang',   ke: 'taruhan', label: 'ronde berikutnya' },
        { dari: 'kalah',    ke: 'taruhan', label: 'ronde berikutnya', jenis: 'galat' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Dua fase, dan satu angka yang berpindah arti',
        keterangan: 'Craps punya dua fase, dan <b>angka dadu yang sama berarti ' +
          'terbalik di keduanya</b>: 7 menang di fase pertama, 7 kalah di fase ' +
          'kedua. Peta alur tidak bisa menunjukkan itu, karena yang berubah ' +
          'bukan jalurnya melainkan <b>artinya</b>. Yang membedakan cuma satu ' +
          'hal: apakah <code>K</code> sudah terisi.',
        simpul: [
          { id: 'keluar', baris: '190-200', jenis: 'mulai',
            teks: ['COMING OUT', '7 dan 11 menang, 2/3/12 kalah'] },
          { id: 'poin', baris: '210-300', jenis: 'keadaan',
            /* Tanpa <b> di sini: label diagram keadaan Mermaid tidak
               menafsirkan HTML, jadi tandanya akan tercetak apa adanya. */
            teks: ['THE POINT IS K', '7 sekarang kalah, K menang'] }
        ],
        panah: [
          { dari: 'keluar', ke: 'poin', label: '4/5/6/8/9/10 (210)' },
          { dari: 'poin', ke: 'keluar', label: 'K keluar lagi: menang (280)' },
          { dari: 'poin', ke: 'keluar', label: '7 keluar: kalah (290)',
            jenis: 'galat' },
          { dari: 'poin', ke: 'poin', label: 'angka lain: lempar lagi (300)' },
          { dari: 'keluar', ke: 'keluar', label: '7/11 atau 2/3/12: selesai seketika' }
        ]
      }
    ],

    pseudokode: [
      { baris: 120, tingkat: 0, teks: 'uang disimpan dalam <b>dua satuan</b>: H keping ratusan, H1 keping ribuan' },
      { baris: 1340, tingkat: 0, teks: '<b>bangun tujuh muka dadu, masing-masing SATU string</b>' },
      { baris: 1360, tingkat: 1, teks: 'spasi, <b>turun</b>, <b>mundur tujuh</b>, titik, turun, mundur, spasi' },
      { baris: 850, tingkat: 0, teks: 'gambar meja judi, papan angka 2&ndash;12, dan tumpukan keping' },
      { baris: 160, tingkat: 0, teks: '<b>ULANG tiap ronde:</b>' },
      { baris: 160, tingkat: 1, teks: 'uang habis? tawarkan menjual barang' },
      { baris: 170, tingkat: 1, teks: 'lebih dari 100 keping? <b>bank pecah</b>, permainan selesai' },
      { baris: 310, tingkat: 1, teks: 'PASS atau DON&rsquo;T PASS? lalu berapa keping' },
      { baris: 1210, tingkat: 1, teks: 'kocok dadu enam kali, tiap kocokan digambar dan berbunyi' },
      { baris: 190, tingkat: 1, teks: 'lemparan pertama: 7 atau 11 menang&hellip;' },
      { baris: 200, tingkat: 1, teks: '&hellip;2, 3, atau 12 kalah &mdash; <b>keduanya terbalik kalau DON&rsquo;T PASS</b>' },
      { baris: 210, tingkat: 1, teks: 'angka lain jadi POINT' },
      { baris: 230, tingkat: 2, teks: 'lempar terus: POINT lagi menang, 7 kalah' },
      { baris: 580, tingkat: 1, teks: 'menang: taruhan kembali dua kali lipat, lagu berbunyi' },
      { baris: 680, tingkat: 1, teks: 'kalah: taruhan hilang, tiga nada rendah' }
    ],

    perintahAsli: 'run\\CRAPS.bat',
    catatanAsli: 'Di DOSBox-X kocokan dadunya berbunyi enam kali, dan lagu ' +
      '"We\'re In The Money" benar-benar dimainkan saat menang.',

    penyimpangan: [
      '<b><code>SOUND</code> dan <code>PLAY</code> tidak berbunyi</b> — ' +
      'termasuk enam bunyi kocokan dadu, lagu "We\'re In The Money" saat ' +
      'menang, dan tiga nada rendah saat kalah.',

      '<b><code>PRINT USING</code> yang ditiru hanya bentuk ' +
      '<code>$$#####,.##</code>.</b> Bentuk lain (<code>**</code>, ' +
      '<code>^^^^</code>, medan string) belum ada di mesin; kalau nanti ada ' +
      'program yang memakainya, hasilnya akan salah dan penelusuran <b>tidak</b> ' +
      'berhenti.',

      '<b><code>COLOR 31</code> di baris 2520 tidak berkedip.</b> ' +
      '"YOU BROKE THE BANK" seharusnya berkedip putih terang.',

      '<b><code>TIME$</code> ditiru sebagai jam yang maju tujuh detik tiap ' +
      'kali dibaca.</b> Penelusur tidak punya jam. Memakai satu angka tetap ' +
      'sudah dicoba dan hasilnya <b>dadu yang beku</b> — karena baris 1290 ' +
      'menyemai ulang di tiap putaran gelung kocokan, benih tetap membuat ' +
      'keenam kocokan dan semua lemparan berikutnya keluar angka yang sama ' +
      'persis. Jam yang maju menjaga dua hal sekaligus: dadunya berubah, dan ' +
      'penelusurannya tetap bisa diulang persis.',

      '<b>Kelima gelung tunda habis seketika</b>, jadi pesan kesalahan taruhan ' +
      'terhapus sebelum sempat terbaca. Pasang titik henti di baris 390, 480, ' +
      'atau 510.'
    ],

    pelajaran: {
      ringkas: 'Dadu Nevada. Yang layak dipelajari: tujuh muka dadu yang ' +
        'masing-masing digambar oleh SATU perintah PRINT, dan satu variabel ' +
        'yang membalik seluruh aturan menang-kalah.',
      pelajari: [
        ['Satu string yang menggambar dua dimensi',
         'Baris 1350-1410 membangun tujuh muka dadu. Tiap muka adalah satu ' +
         'string berisi spasi, titik (<code>CHR$(254)</code>), dan <b>perintah ' +
         'kursor</b>: <code>CHR$(31)</code> turun, <code>CHR$(29)</code> ' +
         'mundur. Satu <code>PRINT</code> menggambar kotak 7&times;3 lengkap. ' +
         'Ini bentuk paling murni dari gagasan yang juga dipakai HANGMAN.BAS, ' +
         'dan nenek moyang langsung urutan escape terminal.'],
        ['Satu variabel yang membalik seluruh aturan',
         'Bertaruh DON&rsquo;T PASS berarti menang kalau dadu kalah. Program ' +
         'ini tidak menulis dua set aturan &mdash; ia menulis satu, lalu ' +
         'memakai <code>P</code> untuk memilih tujuan lompatannya: ' +
         '<code>IF P=0 THEN 580 ELSE 680</code>. Dua permainan dari satu kode.'],
        ['Uang dalam dua satuan',
         '<code>H</code> menghitung keping ratusan, <code>H1</code> keping ' +
         'ribuan, dan baris 2230-2240 menjaga <code>H</code> tetap di 0..10 ' +
         'dengan menukar keping bolak-balik. Alasannya bukan matematika ' +
         'melainkan <b>gambar</b>: dua tumpukan keping di layar, dan tiap ' +
         'tumpukan perlu tingginya sendiri.'],
        ['Nilai barang yang seluruhnya lelucon',
         'Baris 1870-1940: perahu 2000 dolar, komputer 2000, sepeda motor ' +
         '1800&hellip; <b>rumah 500</b>, dan papan luncur juga 500. Seluruh ' +
         'humornya ada di tabel angka, bukan di teksnya.']
      ],
      hindari: [
        ['Menyemai ulang di tengah gelung kocokan',
         'Baris 1260 dan 1290 memanggil <code>RANDOMIZE</code> di dalam gelung ' +
         'enam kocokan. Baris 1260 bahkan menyemai dengan angka yang <b>sudah ' +
         'acak</b> (<code>RIGHT$(TIME$,2)*RND</code>) — yang berarti membuang ' +
         'deret yang sedang berjalan untuk memulai deret baru yang tidak lebih ' +
         'baik. Kesalahan yang sama dengan MASTER.BAS dan HANGMAN.BAS.'],
        ['Spasi sebagai tombol "selesai", dan Enter yang ditolak',
         'Baris 1750 mengakhiri masukan taruhan kalau tombolnya <b>spasi</b>; ' +
         'baris 1760 justru <b>menolak</b> Enter. Layar cuma mengatakan "Press ' +
         'Space Bar To Roll" setelah angka pertama diketik — sebelum itu, ' +
         'pemain tidak diberi tahu apa pun.'],
        ['Gelung yang ditulis sebagai lompatan ke diri sendiri',
         'Baris 2230 dan 2240 menormalkan uang dengan <code>GOTO</code> ke ' +
         'nomor barisnya sendiri. Itu <code>WHILE</code> yang menyamar, dan ' +
         'GW-BASIC punya <code>WHILE</code>/<code>WEND</code> sejak awal.']
      ]
    },

    penjelasan: [
      { judul: 'Satu PRINT, satu dadu',
        isi: [
          'Bagaimana menggambar dadu 7&times;3 di layar teks? Cara wajar: tiga ' +
          '<code>LOCATE</code> dan tiga <code>PRINT</code>.',
          'Program ini memakai <b>satu</b> <code>PRINT</code>. Rahasianya ada ' +
          'di baris 1340:',
          '<code>A = STRING$(7,29)</code> &mdash; tujuh kali "kursor mundur".',
          'Lalu muka dadu bernilai satu (baris 1360):',
          '<code>A(1) = A3 + CHR$(31) + A + A5 + CHR$(254) + A5 + CHR$(31) + A + A3</code>',
          'Dibaca satu per satu: <b>cetak tujuh spasi</b> (baris pertama), ' +
          '<b>turun</b> satu baris, <b>mundur tujuh</b> kolom — sekarang kursor ' +
          'tepat di bawah awal tadi — <b>cetak tiga spasi, satu titik, tiga ' +
          'spasi</b> (baris kedua), turun, mundur, <b>cetak tujuh spasi</b> ' +
          '(baris ketiga).',
          'Kenapa repot? Karena di prosesor 4,77 MHz, mengirim satu string ' +
          'panjang jauh lebih cepat daripada tiga <code>LOCATE</code> terpisah ' +
          '— dan dadu ini dikocok <b>enam kali</b> tiap lemparan, dua dadu ' +
          'sekaligus. Dua belas gambar per lemparan; setiap penghematan terasa.',
          'Komentar di <code>web/_shared/svg.js</code> menyebut berkas ini ' +
          'sebagai contoh teknik tersebut. Sekarang barisnya bisa ditelusuri.'
        ] },
      { judul: 'Dua permainan dari satu kode',
        isi: [
          'Di craps, Anda bisa bertaruh <b>untuk</b> dadu (PASS) atau ' +
          '<b>melawan</b> dadu (DON&rsquo;T PASS). Aturan menang-kalahnya ' +
          'terbalik sepenuhnya.',
          'Program ini tidak menulis dua set aturan. Ia menulis satu, dan ' +
          'memakai satu variabel untuk memilih ke mana melompat:',
          '<code>190 IF K=7 OR K=11 THEN IF P=0 THEN 580 ELSE 680</code>',
          '<code>200 IF K=2 OR K=3 OR K=12 THEN IF P=0 THEN 680 ELSE 580</code>',
          'Baris 580 adalah "menang", 680 adalah "kalah". Dengan ' +
          '<code>P = 0</code> (PASS), 7 dan 11 menuju menang. Dengan ' +
          '<code>P = 1</code>, keduanya menuju kalah — dan 2, 3, 12 sebaliknya.',
          'Pola yang sama muncul lagi di baris 280 dan 290 untuk fase POINT. ' +
          'Empat baris, dua permainan.',
          'Ini kerabat dekat dari <code>U</code> di OTHELLO.BAS (satu rutin, ' +
          'dua peran) dan <code>HOLD</code> di TOWERS.BAS (satu tombol, dua ' +
          'arti). Pola yang sama, tiga bentuk: <b>satu nilai yang mengubah arti ' +
          'kode yang sama.</b>'
        ] },
      { judul: 'Kenapa uangnya disimpan dalam dua angka',
        isi: [
          'Uang pemain disimpan sebagai dua variabel: <code>H</code> keping ' +
          'ratusan dan <code>H1</code> keping ribuan. Baris 2230-2240 terus ' +
          'menukar di antara keduanya supaya <code>H</code> tetap di 0 sampai 10.',
          'Kenapa tidak satu angka saja? Karena yang dibutuhkan bukan ' +
          'angkanya, melainkan <b>gambarnya</b>: baris 2260-2290 menggambar ' +
          'dua tumpukan keping di sisi kanan layar, satu untuk ratusan dan satu ' +
          'untuk ribuan. Tinggi tiap tumpukan <b>adalah</b> nilai variabelnya.',
          'Jadi bentuk datanya dipilih mengikuti bentuk tampilannya. Itu ' +
          'kebalikan dari nasihat biasa — biasanya data dulu, tampilan ' +
          'menyusul — dan di sini ia dibayar dengan baris 2230-2240 yang ' +
          'harus terus-menerus merapikan.',
          'Perhatikan juga bahwa jumlah yang dicetak (<code>H*100 + ' +
          'H1*1000</code>) dihitung ulang di <b>empat</b> tempat berbeda: ' +
          'baris 540, 740, 950, dan 2040. Satu rumus, empat salinan.'
        ] }
    ]
  };
})(window);
