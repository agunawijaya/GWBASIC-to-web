/* ===========================================================================
   MASTER.js — porting minimalis MASTER.BAS sebagai tabel baris.

   Program ketujuh, dan yang pertama memakai kebetulan: `RND` dan `RANDOMIZE`.

   Tiga hal di dalamnya layak diperhatikan, dan ketiganya soal keputusan
   perancangan — bukan soal permainannya:

   1. BENIHNYA CUMA ENAM PULUH KEMUNGKINAN. Baris 720 menyemai pengacak dari
      `VAL(RIGHT$(TIME$,2))` — dua digit terakhir jam dinding, yaitu detik.
      Nol sampai lima puluh sembilan. Seluruh permainan berangkat dari salah
      satu dari enam puluh titik awal.

   2. `RANDOMIZE` ADA DI DALAM GELUNG. Baris 710-730 menyemai ulang sebelum
      SETIAP angka rahasia, dari detik yang sama, karena gelungnya habis dalam
      sepersekian milidetik. Menyemai ulang dengan benih yang sama bukan cara
      menambah keacakan; kalaupun tidak merusak, ia tidak berbuat apa-apa.

   3. `RND(SUB)` TERLIHAT BERMAKNA PADAHAL BUKAN. Di GW-BASIC, argumen positif
      apa pun berperilaku sama dengan `RND` tanpa argumen. Menuliskan pencacah
      gelung di sana membuat pembacanya mengira tiap angka diambil dari deret
      yang berbeda. Tidak.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Pengacaknya BUKAN pengacak GW-BASIC. Penelusur memakai pengacak bersama
     repositori dengan benih tetap, supaya menjalankan program yang sama dua
     kali memberi angka rahasia yang sama — kalau tidak, tidak ada percobaan
     yang bisa diulang. Nilai `TIME$` pun diganti angka tetap.
   - `PLAY` di baris 1420 dan 1440 (lagu kalah dan lagu menang) memang sudah
     kosong di berkas aslinya: keduanya cuma REM lalu RETURN.
   - `KEY OFF`, `SCREEN 0,0,0`, `WIDTH 80` tidak berbuat apa-apa.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Detik jam dinding yang dipakai sebagai benih. Di mesin aslinya angka ini
     berubah tiap detik; di sini tetap, supaya penelusurannya bisa diulang. */
  var DETIK_TETAP = 42;

  var tabel = [

    /* 100 sepuluh jebakan mandul menuju RETURN di baris 160. */
    { baris: 100, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) {
          m.pasangJebakan(m.v.A, 160);
          m.jebakan(m.v.A, true);
        }
      } },
    { baris: 110, jalan: function (m) { m.lompat(170); } },

    /* 120-150 subrutin "buka rahasia": tulis angka jawabannya di baris 3.
       Diletakkan di DEPAN alur utama, jadi baris 110 harus melompatinya. */
    { baris: 120, jalan: function (m) { m.untuk('SUB', 1, m.v.DIGITS, 1, 160); } },
    { baris: 130, jalan: function (m) {
        m.locate(3, m.v.STARTANS - 1, 0);
        m.cetak(m.chr(255) + angka(m.v.ANSWER[m.v.SUB]));
        m.barisBaru();
      } },
    { baris: 140, jalan: function (m) { m.v.STARTANS += 4; } },
    { baris: 150, jalan: function (m) { m.lanjutkan('SUB'); } },
    /* 160 RETURN — penutup subrutin 120-150 SEKALIGUS badan jebakan F1-F10.
       Pola yang sama untuk ketujuh kalinya di koleksi ini. */
    { baris: 160, jalan: function (m) { m.kembali(); } },

    /* 170-230 layar judul. */
    { baris: 170, jalan: function (m) {
        m.warna(3, 0);
        m.pasangJebakan(10, 1320);
      } },
    { baris: 180, jalan: function (m) { m.cls(); m.kosongkanPenyangga(); } },
    { baris: 190, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 200, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 210, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 220, jalan: function (m) {
        m.locate(5, 30); m.warna(15, 0);
        m.cetak('M A S T E R    M I N D'); m.barisBaru();
      } },
    { baris: 230, jalan: function (m) {
        m.warna(15, 0); m.locate(11, 25);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 240, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(240);
      } },
    { baris: 250, jalan: function (m) {
        var r = m.v['RESP$'];
        if (r === 'N' || r === 'n') m.lompat(410);
      } },
    { baris: 260, jalan: function (m) {
        var r = m.v['RESP$'];
        if (r !== 'Y' && r !== 'y') m.lompat(240);
      } },
    { baris: 270, jalan: function (m) { m.warna(3, 0); } },

    teks(280,  8, 15, 'Welcome to Master  Mind.  The object of this  game is'),
    teks(290,  9, 15, 'to correctly guess a series of from  3  to  6 numbers.'),
    teks(300, 10, 15, 'Each number is randomly generated and the possibility'),
    teks(310, 11, 15, 'exists that you may have TWO of the same number in an'),
    teks(320, 12, 15, "answer. An example of this would be `3 3 9' or `6 3 6'"),
    teks(330, 13, 15, 'You will have between 9 and 15 guesses to  accomplish'),
    teks(340, 14, 15, 'this task,  depending upon the  length of the  series.'),
    teks(350, 15, 15, 'After each guess, you will be told the number of cor-'),
    teks(360, 16, 15, 'rect digits, along with how many are in the right po-'),
    teks(370, 17, 15, 'sition. Use these  clues  to guess the correct series.'),

    { baris: 380, jalan: function (m) {
        m.locate(25, 20); m.warna(15, 0);
        m.cetak('       Strike Any Key To Continue       ');
        m.warna(3, 0);
      } },
    { baris: 390, jalan: function (m) { if (m.inkey() !== '') m.lompat(390); } },
    { baris: 400, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(400);
      } },

    /* 410-480 pemilihan tingkat kesulitan. */
    { baris: 410, jalan: function (m) { m.cls(); } },
    { baris: 420, jalan: function (m) {
        m.dim('GUESS', 6); m.dim('ANSWER', 6); m.warna(15, 0);
      } },
    { baris: 430, jalan: function (m) {
        m.locate(8, 32, 0); m.cetak('WELCOME TO MASTER MIND'); m.barisBaru();
      } },
    { baris: 440, jalan: function (m) {
        m.locate(9, 20, 0);
        m.cetak('To Choose a Level Enter The LETTER Next To It'); m.barisBaru();
      } },
    tingkat(450, 11, 'A)  SERIES OF 3 NUMBERS'),
    tingkat(460, 12, 'B)  SERIES OF 4 NUMBERS'),
    tingkat(470, 13, 'C)  SERIES OF 5 NUMBERS'),
    { baris: 480, jalan: function (m) {
        m.locate(14, 29, 0); m.cetak('D)  SERIES OF 6 NUMBERS'); m.barisBaru();
        m.warna(3, 0);
      } },

    /* 490-640 bingkai kotak ganda, digambar satu karakter demi satu karakter
       dari empat sisi. Empat gelung terpisah untuk sesuatu yang bisa ditulis
       dengan dua STRING$ — lihat INTRO.BAS yang mengerjakannya begitu. */
    { baris: 490, jalan: function (m) { m.locate(6, 17); m.cetak(m.chr(201)); m.barisBaru(); } },
    { baris: 500, jalan: function (m) { m.untuk('A', 18, 66, 1, 530); } },
    { baris: 510, jalan: function (m) {
        m.locate(6, m.v.A, 0); m.cetak(m.chr(205)); m.barisBaru();
      } },
    { baris: 520, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 530, jalan: function (m) { m.locate(6, 67); m.cetak(m.chr(187)); m.barisBaru(); } },
    { baris: 540, jalan: function (m) { m.untuk('B', 7, 15, 1, 570); } },
    { baris: 550, jalan: function (m) {
        m.locate(m.v.B, 67, 0); m.cetak(m.chr(186)); m.barisBaru();
      } },
    { baris: 560, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 570, jalan: function (m) { m.locate(16, 67); m.cetak(m.chr(188)); m.barisBaru(); } },
    { baris: 580, jalan: function (m) { m.untuk('C', 66, 18, -1, 610); } },
    { baris: 590, jalan: function (m) {
        m.locate(16, m.v.C, 0); m.cetak(m.chr(205)); m.barisBaru();
      } },
    { baris: 600, jalan: function (m) { m.lanjutkan('C'); } },
    { baris: 610, jalan: function (m) { m.locate(16, 17); m.cetak(m.chr(200)); m.barisBaru(); } },
    { baris: 620, jalan: function (m) { m.untuk('D', 15, 7, -1, 650); } },
    { baris: 630, jalan: function (m) {
        m.locate(m.v.D, 17, 0); m.cetak(m.chr(186)); m.barisBaru();
      } },
    { baris: 640, jalan: function (m) { m.lanjutkan('D'); } },

    { baris: 650, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(650);
      } },
    pilihTingkat(660, 'A', 3, 36, 8, 15),
    pilihTingkat(670, 'B', 4, 34, 6, 15),
    pilihTingkat(680, 'C', 5, 32, 4, 18),
    pilihTingkat(690, 'D', 6, 30, 2, 21),
    { baris: 700, jalan: function (m) { m.lompat(650); } },

    /* 710-730 MEMBANGKITKAN ANGKA RAHASIA — dan tiga keputusan yang layak
       dipertanyakan sekaligus. Lihat catatan panjang di kepala berkas. */
    { baris: 710, jalan: function (m) { m.untuk('SUB', 1, m.v.DIGITS, 1, 740); } },
    { baris: 720, jalan: function (m) {
        /* RANDOMIZE(VAL(RIGHT$(TIME$,2))) — dua digit terakhir jam dinding.
           Di penelusur, "jam"-nya angka tetap supaya bisa diulang. */
        m.semai(DETIK_TETAP);
        /* FIX(RND(SUB)*10) — FIX memotong ke arah nol, jadi 0..9.
           Argumen SUB tidak berpengaruh apa pun di GW-BASIC. */
        m.v.ANSWER[m.v.SUB] = Math.floor(m.acak() * 10);
      } },
    { baris: 730, jalan: function (m) { m.lanjutkan('SUB'); } },

    /* 740-880 gambar papan permainan. */
    { baris: 740, jalan: function (m) { m.cls(); } },
    { baris: 750, bagian: [
        function (m) { m.v.XX = 1; m.v.YY = 1; },
        function (m) { m.gosub(1380); }
      ] },
    { baris: 760, jalan: function (m) {
        m.locate(1, 34, 0); m.cetak('SECRET NUMBERS'); m.barisBaru();
      } },
    { baris: 770, jalan: function (m) {
        m.locate(2, 30, 0); m.cetak('----------------------'); m.barisBaru();
      } },
    { baris: 780, jalan: function (m) { m.v.BEGINANS = m.v.STARTANS; } },
    { baris: 790, jalan: function (m) { m.untuk('M', 1, m.v.DIGITS, 1, 830); } },
    { baris: 800, jalan: function (m) {
        m.locate(3, m.v.BEGINANS, 0);
        m.cetak(m.chr(219) + m.chr(219)); m.barisBaru();
      } },
    { baris: 810, jalan: function (m) { m.v.BEGINANS += 4; } },
    { baris: 820, jalan: function (m) { m.lanjutkan('M'); } },

    { baris: 830, jalan: function (m) {
        m.warna(15, 0); m.locate(5, 4, 0);
        m.cetak('ENTER YOUR GUESSES'); m.barisBaru();
        m.warna(3, 0);
      } },
    judul(840,  6,  2, '----------------------'),
    judul(850,  5, 28, 'CORRECT NUMBERS'),
    judul(860,  6, 28, '---------------'),
    judul(870,  5, 48, 'CORRECT NUMBERS IN RIGHT POSITION'),
    judul(880,  6, 48, '---------------------------------'),

    /* 890-970 gambar kotak tebakan kosong, satu baris per kesempatan. */
    { baris: 890, jalan: function (m) { m.untuk('ROW', 7, m.v.BOTROW, 1, 980); } },
    { baris: 900, jalan: function (m) { m.v.BEGINGES = m.v.STARTGES; } },
    { baris: 910, jalan: function (m) { m.untuk('Q', 1, m.v.DIGITS, 1, 950); } },
    { baris: 920, jalan: function (m) {
        m.locate(m.v.ROW, m.v.BEGINGES, 0);
        m.cetak(m.chr(220) + m.chr(220)); m.barisBaru();
      } },
    { baris: 930, jalan: function (m) { m.v.BEGINGES += 4; } },
    { baris: 940, jalan: function (m) { m.lanjutkan('Q'); } },
    { baris: 950, jalan: function (m) {
        m.locate(m.v.ROW, 35, 0);
        m.cetak(m.chr(220) + m.chr(220)); m.barisBaru();
      } },
    { baris: 960, jalan: function (m) {
        m.locate(m.v.ROW, 63, 0);
        m.cetak(m.chr(220) + m.chr(220)); m.barisBaru();
      } },
    { baris: 970, jalan: function (m) { m.lanjutkan('ROW'); } },

    /* --- 980-1230: gelung permainan --------------------------------------- */

    { baris: 980, jalan: function (m) { m.untuk('ROW', 7, m.v.BOTROW, 1, 1240); } },
    { baris: 990, jalan: function (m) {
        m.v.BEGINGES = m.v.STARTGES; m.v.HITS = 0; m.v.GUESSES = 0;
      } },
    /* 1000 DIM di dalam gelung, dipasangkan dengan ERASE di baris 1210.
       Membuat ulang larik tiap putaran adalah cara BASIC mengosongkannya —
       tidak ada perintah "kosongkan". */
    { baris: 1000, jalan: function (m) {
        m.dim('HITS$', 10, 6); m.dim('MISSES$', 10, 6);
      } },

    { baris: 1010, jalan: function (m) { m.untuk('SUB', 1, m.v.DIGITS, 1, 1090); } },
    { baris: 1020, jalan: function (m) { m.locate(m.v.ROW, m.v.BEGINGES, 0); } },
    { baris: 1030, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(1030);
      } },
    { baris: 1040, jalan: function (m) {
        m.v['TRY$'] = m.inkey();
        var t = m.v['TRY$'];
        if (t === '' || t < '0' || t > '9') m.lompat(1040);
      } },
    { baris: 1050, jalan: function (m) {
        m.v.GUESS[m.v.SUB] = parseInt(m.v['TRY$'], 10);
      } },
    { baris: 1060, jalan: function (m) {
        m.locate(m.v.ROW, m.v.BEGINGES - 1, 0);
        m.cetak(m.chr(255) + angka(m.v.GUESS[m.v.SUB])); m.barisBaru();
      } },
    { baris: 1070, jalan: function (m) { m.v.BEGINGES += 4; } },
    { baris: 1080, jalan: function (m) { m.lanjutkan('SUB'); } },

    /* 1090-1130 hitung yang BENAR DAN DI TEMPATNYA. */
    { baris: 1090, jalan: function (m) { m.untuk('X', 1, m.v.DIGITS, 1, 1140); } },
    { baris: 1100, jalan: function (m) { m.untuk('Y', 1, m.v.DIGITS, 1, 1130); } },
    { baris: 1110, jalan: function (m) {
        var g = m.v.GUESS[m.v.X];
        if (g === m.v.ANSWER[m.v.Y] && m.v.X === m.v.Y &&
            m.v['HITS$'][g][m.v.X] !== '*') {
          m.v.GUESSES++; m.v.HITS++;
          m.v['HITS$'][g][m.v.X] = '*';
          m.v['MISSES$'][g][m.v.X] = '*';
          m.lompat(1130);
        }
      } },
    { baris: 1120, jalan: function (m) { m.lanjutkan('Y'); } },
    { baris: 1130, jalan: function (m) { m.lanjutkan('X'); } },

    /* 1140-1180 hitung yang BENAR TAPI SALAH TEMPAT.

       Baris 1160 adalah kondisi paling rumit di seluruh koleksi: enam suku
       di-AND dalam satu baris 234 kolom. Yang sedang dipecahkan masalah nyata
       — satu angka tidak boleh dihitung dua kali — dan penandanya dua larik
       TEKS berisi "" atau "*", karena BASIC tidak punya tipe boolean.

       Yang salah bukan pilihan tipenya, melainkan enam kondisi tanpa nama.
       Beri nama pada bagiannya dan barisnya menciut jadi satu kalimat. */
    { baris: 1140, jalan: function (m) { m.untuk('X', 1, m.v.DIGITS, 1, 1190); } },
    { baris: 1150, jalan: function (m) { m.untuk('Y', 1, m.v.DIGITS, 1, 1180); } },
    { baris: 1160, jalan: function (m) {
        var X = m.v.X, Y = m.v.Y, g = m.v.GUESS[X];
        var H = m.v['HITS$'], S = m.v['MISSES$'];
        var cocok  = (g === m.v.ANSWER[Y]);
        var bebasX = (H[g][X] === '' && S[g][X] === '');
        var bebasY = (H[g][Y] === '' && S[g][Y] === '');
        if (cocok && bebasX && X !== Y && bebasY) {
          m.v.GUESSES++;
          S[g][X] = '*';
          S[g][Y] = '*';
          m.lompat(1180);
        }
      } },
    { baris: 1170, jalan: function (m) { m.lanjutkan('Y'); } },
    { baris: 1180, jalan: function (m) { m.lanjutkan('X'); } },

    { baris: 1190, jalan: function (m) {
        m.locate(m.v.ROW, 34, 0);
        m.cetak(m.chr(255) + angka(m.v.GUESSES) + m.chr(255)); m.barisBaru();
      } },
    { baris: 1200, jalan: function (m) {
        m.locate(m.v.ROW, 62, 0);
        m.cetak(m.chr(255) + angka(m.v.HITS) + m.chr(255)); m.barisBaru();
      } },
    /* 1210 ERASE membuang lariknya sama sekali, supaya DIM di baris 1000
       boleh membuatnya lagi tahun depan— eh, putaran berikutnya. */
    { baris: 1210, jalan: function (m) {
        delete m.v['MISSES$']; delete m.v['HITS$'];
      } },
    { baris: 1220, bagian: [
        function (m) { if (m.v.HITS === m.v.DIGITS) m.gosub(120); else m.lompat(1230); },
        function (m) { m.gosub(1440); },
        function (m) {
          m.locate(22, 22);
          m.cetak('!!!  C O N G R A T U L A T I O N S  !!!'); m.barisBaru();
          m.lompat(1260);
        }
      ] },
    { baris: 1230, jalan: function (m) { m.lanjutkan('ROW'); } },

    /* 1240-1310 kalah, lalu tawaran main lagi. */
    { baris: 1240, jalan: function (m) { m.gosub(120); } },
    { baris: 1250, bagian: [
        function (m) { m.gosub(1420); },
        function (m) {
          m.locate(22, 23, 0);
          m.cetak('!!!  S O R R Y , Y O U   L O S T  !!!'); m.barisBaru();
        }
      ] },
    { baris: 1260, jalan: function (m) {
        m.locate(23, 24, 0);
        m.cetak('Would You Like To Play Again?  <Y/N>'); m.barisBaru();
      } },
    { baris: 1270, jalan: function (m) { if (m.inkey() !== '') m.lompat(1270); } },
    { baris: 1280, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(1280);
      } },
    { baris: 1290, jalan: function (m) {
        var r = m.v['RESP$'];
        if (r === 'Y' || r === 'y') { m.cls(); m.lompat(430); }
      } },
    { baris: 1300, jalan: function (m) {
        var r = m.v['RESP$'];
        if (r !== 'N' && r !== 'n') m.lompat(1280);
      } },
    { baris: 1310, jalan: function (m) { m.jalankan('MENU'); } },

    /* 1320-1400 penangan F10. Perhatikan baris 1370: kalau jawabannya "N",
       alurnya JATUH ke baris 1380 — yang juga dipanggil sebagai subrutin dari
       baris 750. Satu blok, dua cara masuk. */
    { baris: 1320, bagian: [
        function (m) {
          m.jebakan(10, false);
          m.v.XX = m.barisKursor();
          m.v.YY = m.pos();
          m.locate(25, 1); m.spc(79);
          m.locate(25, 23);
        }
      ] },
    { baris: 1330, jalan: function (m) {
        m.warna(15, 0);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 1340, jalan: function (m) { if (m.inkey() !== '') m.lompat(1340); } },
    { baris: 1350, jalan: function (m) {
        m.v['R$'] = m.inkey();
        if (m.v['R$'] === '') m.lompat(1350);
      } },
    { baris: 1360, jalan: function (m) {
        var r = m.v['R$'];
        if (r === 'Y' || r === 'y') m.lompat(1310);
      } },
    { baris: 1370, jalan: function (m) {
        var r = m.v['R$'];
        if (r !== 'N' && r !== 'n') m.lompat(1350);
      } },
    { baris: 1380, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 25); m.warna(0, 7);
      } },
    { baris: 1390, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(3, 0);
        m.locate(m.v.XX, m.v.YY);
      } },
    { baris: 1400, jalan: function (m) {
        m.jebakan(10, true); m.kosongkanPenyangga(); m.kembali();
      } },

    /* 1410-1460 dua lagu yang tidak pernah ditulis. Baris 1420 dan 1440 cuma
       REM, lalu RETURN. Rencana yang tertinggal di dalam berkas — dan lebih
       jujur daripada menghapusnya diam-diam. */
    { baris: 1410, jalan: function (m) { m.lompat(1460); } },
    { baris: 1420, jalan: function () { /* REM LOSE SONG */ } },
    { baris: 1430, jalan: function (m) { m.kembali(); } },
    { baris: 1440, jalan: function () { /* REM WIN SONG */ } },
    { baris: 1450, jalan: function (m) { m.kembali(); } },
    { baris: 1460, jalan: function (m) { m.henti('END di baris 1460.'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }

  function teks(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  function judul(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom, 0); m.cetak(isi); m.barisBaru();
    } };
  }

  function tingkat(nomor, baris, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 29, 0); m.cetak(isi); m.barisBaru();
    } };
  }

  /* Keempat tingkat kesulitan cuma berbeda empat angka: berapa digit, dan di
     kolom/baris mana papannya digambar. Itu tabel yang ditulis sebagai empat
     baris IF — pola yang sama dengan 21 IF di MENU.BAS. */
  function pilihTingkat(nomor, huruf, digits, startans, startges, botrow) {
    return { baris: nomor, jalan: function (m) {
      var r = m.v['RESP$'];
      if (r === huruf || r === huruf.toLowerCase()) {
        m.v.DIGITS = digits;
        m.v.STARTANS = startans;
        m.v.STARTGES = startges;
        m.v.BOTROW = botrow;
        m.lompat(710);
      }
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MASTER'] = {
    nama: 'MASTER',
    judul: 'Master Mind',
    sumber: 'MASTER',
    berkas: 'run/MASTER.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur MASTER.BAS',
      simpul: [
        { id: 'siap', baris: '100-180', jenis: 'mulai',
          teks: ['Pasang jebakan, gambar bingkai,', 'tawarkan petunjuk'] },
        { id: 'tingkat', baris: '410-700', jenis: 'putusan',
          teks: ['Pilih tingkat A-D:', '3, 4, 5, atau 6 angka'] },
        { id: 'rahasia', baris: '710-730',
          teks: ['Bangkitkan angka rahasia', 'dari detik jam dinding'] },
        { id: 'papan', baris: '740-970',
          teks: ['Gambar papan: satu baris', 'per kesempatan menebak'] },
        { id: 'tebak', baris: '1010-1080', jenis: 'subrutin',
          teks: ['Pemain mengetik n angka', 'satu per satu'] },
        { id: 'nilai1', baris: '1090-1130',
          teks: ['Hitung yang benar', 'DAN di tempatnya'] },
        { id: 'nilai2', baris: '1140-1180',
          teks: ['Hitung yang benar tapi', 'salah tempat (tanpa dobel)'] },
        { id: 'lapor', baris: '1190-1210',
          teks: ['Tulis kedua angka,', 'buang penanda'] },
        { id: 'menang', baris: '1220', jenis: 'putusan',
          teks: ['Semua benar di tempatnya?'] },
        { id: 'habis', baris: '1230-1250', jenis: 'putusan',
          teks: ['Masih ada kesempatan?'] },
        { id: 'usai', baris: '1260-1310', jenis: 'keluar',
          teks: ['Buka rahasianya,', 'lalu main lagi?'] }
      ],
      panah: [
        { dari: 'siap',    ke: 'tingkat' },
        { dari: 'tingkat', ke: 'rahasia' },
        { dari: 'rahasia', ke: 'papan' },
        { dari: 'papan',   ke: 'tebak' },
        { dari: 'tebak',   ke: 'nilai1' },
        { dari: 'nilai1',  ke: 'nilai2' },
        { dari: 'nilai2',  ke: 'lapor' },
        { dari: 'lapor',   ke: 'menang' },
        { dari: 'menang',  ke: 'habis',  label: 'belum' },
        { dari: 'habis',   ke: 'tebak',  label: 'masih ada' },
        { dari: 'menang',  ke: 'usai',   label: 'ya' },
        { dari: 'habis',   ke: 'usai',   label: 'habis' },
        { dari: 'usai',    ke: 'tingkat', label: 'main lagi' }
      ]
    },

    pseudokode: [
      { baris: 100, tingkat: 0, teks: 'pasang jebakan F1&ndash;F10; F10 keluar, sisanya mandul' },
      { baris: 190, tingkat: 0, teks: 'gambar bingkai balok, tawarkan petunjuk' },
      { baris: 450, tingkat: 0, teks: 'tanya tingkat: A=3, B=4, C=5, D=6 angka' },
      { baris: 660, tingkat: 0, teks: 'simpan berapa angka, dan di kolom mana papannya digambar' },
      { baris: 710, tingkat: 0, teks: '<b>untuk tiap angka rahasia:</b>' },
      { baris: 720, tingkat: 1, teks: 'semai pengacak dari <b>detik jam dinding</b> &mdash; 60 kemungkinan' },
      { baris: 720, tingkat: 1, teks: 'ambil satu angka acak 0&ndash;9' },
      { baris: 740, tingkat: 0, teks: 'gambar papan: satu baris per kesempatan menebak' },
      { baris: 980, tingkat: 0, teks: '<b>untuk tiap baris kesempatan:</b>' },
      { baris: 1000, tingkat: 1, teks: 'buat dua larik penanda, kosong' },
      { baris: 1010, tingkat: 1, teks: 'minta n angka tebakan, satu per satu' },
      { baris: 1090, tingkat: 1, teks: '<b>putaran pertama:</b> hitung yang benar <b>dan</b> di tempatnya' },
      { baris: 1110, tingkat: 2, teks: 'tandai angkanya terpakai di kedua larik penanda' },
      { baris: 1140, tingkat: 1, teks: '<b>putaran kedua:</b> hitung yang benar tapi salah tempat' },
      { baris: 1160, tingkat: 2, teks: 'hanya kalau kedua selnya <b>masih bebas</b> &mdash; supaya tidak dihitung dua kali' },
      { baris: 1190, tingkat: 1, teks: 'tulis kedua angka di kolom kanan' },
      { baris: 1210, tingkat: 1, teks: 'buang larik penanda &mdash; putaran berikutnya membuatnya lagi' },
      { baris: 1220, tingkat: 1, teks: 'semua benar di tempatnya? <b>menang</b>, buka rahasianya' },
      { baris: 1240, tingkat: 0, teks: 'kesempatan habis: buka rahasianya, umumkan kalah' },
      { baris: 1260, tingkat: 0, teks: 'main lagi? kembali ke pilihan tingkat, atau kembali ke menu' }
    ],

    perintahAsli: 'run\\MASTER.bat',
    catatanAsli: 'Di DOSBox-X angka rahasianya benar-benar berubah tiap kali ' +
      'dimainkan &mdash; tapi hanya enam puluh kemungkinan titik awal, karena ' +
      'benihnya detik jam dinding.',

    penyimpangan: [
      '<b>Pengacaknya bukan pengacak GW-BASIC, dan benihnya tetap.</b> ' +
      'Penelusur memakai pengacak bersama repositori dengan benih tetap ' +
      '(detik jam dinding diganti angka 42), supaya menjalankan program yang ' +
      'sama dua kali memberi angka rahasia yang sama. Tanpa itu tidak ada ' +
      'percobaan yang bisa diulang, dan titik henti kehilangan gunanya. ' +
      'Urutan angkanya karena itu berbeda dari mesin 1982 — yang ditiru ' +
      'perilakunya, bukan angkanya.',

      '<b>Di penelusur ini, ketiga angka rahasianya selalu SAMA</b> ' +
      '(6&nbsp;6&nbsp;6 dengan benih bawaan). Itu akibat langsung dari ' +
      '<code>RANDOMIZE</code> yang ada di dalam gelung: menyemai ulang dengan ' +
      'benih yang sama, lalu mengambil angka pertama, memberi angka pertama ' +
      'yang sama. <b>Apakah GW-BASIC asli berperilaku begitu juga, belum ' +
      'diperiksa</b> &mdash; sebagian BASIC Microsoft hanya menimpa sebagian ' +
      'keadaan pengacaknya saat <code>RANDOMIZE</code>, sehingga deretnya ' +
      'tetap maju. Cara menyelesaikannya satu perintah: jalankan ' +
      '<code>run\\MASTER.bat</code> di DOSBox-X, pilih tingkat A, kalah tiga ' +
      'kali, dan lihat angka rahasia yang dibuka.',

      '<b><code>PLAY</code> untuk lagu menang dan kalah tidak hilang &mdash; ' +
      'ia memang tidak pernah ditulis.</b> Baris 1420 dan 1440 di berkas ' +
      'aslinya cuma <code>REM LOSE SONG</code> dan <code>REM WIN SONG</code>, ' +
      'lalu <code>RETURN</code>. Rencana yang tertinggal di dalam berkas.',

      '<b>Baris 1160 ditulis ulang dengan nama.</b> Enam kondisi di-AND di ' +
      'aslinya dipecah jadi tiga variabel bernama (<code>cocok</code>, ' +
      '<code>bebasX</code>, <code>bebasY</code>) di dalam porting. Perilakunya ' +
      'sama persis; yang berubah cuma keterbacaannya — dan itu justru contoh ' +
      'perbaikan yang disarankan analisisnya sendiri.',

      '<b><code>ERASE</code> ditiru sebagai membuang larik.</b> Di BASIC ' +
      '<code>ERASE</code> benar-benar melepas memorinya, dan <code>DIM</code> ' +
      'di baris 1000 membuatnya lagi tiap putaran. Itu cara BASIC ' +
      'mengosongkan larik: tidak ada perintah "kosongkan".'
    ],

    pelajaran: {
      ringkas: 'Mastermind: tebak deret 3&ndash;6 angka. Logika intinya ada ' +
        'di dua putaran penilaian, dan kesulitannya cuma satu &mdash; jangan ' +
        'menghitung satu angka dua kali.',
      pelajari: [
        ['Dua putaran, bukan satu',
         'Menilai tebakan Mastermind tidak bisa dilakukan sekali jalan. ' +
         'Putaran pertama (1090-1130) menghitung yang <b>benar dan di ' +
         'tempatnya</b>; putaran kedua (1140-1180) baru menghitung yang benar ' +
         'tapi salah tempat. Urutannya wajib: kalau dibalik, angka yang ' +
         'sebenarnya di tempatnya bisa terlanjur terpakai sebagai "salah ' +
         'tempat".'],
        ['Larik teks sebagai larik boolean',
         '<code>HITS$</code> dan <code>MISSES$</code> isinya cuma <code>""</code> ' +
         'atau <code>"*"</code>. Boros, tapi <code>HITS$(...)=""</code> ' +
         'terbaca sebagai "belum ditandai" jauh lebih jelas daripada ' +
         '<code>H(...)=0</code>. Kalau bahasanya tidak punya boolean, pilih ' +
         'bentuk yang terbaca.'],
        ['Empat tingkat kesulitan sebagai empat angka',
         'Baris 660-690 tidak mengubah logika apa pun &mdash; keempatnya cuma ' +
         'mengisi empat variabel: berapa angka, dan di kolom mana papannya ' +
         'digambar. Seluruh sisa program membaca variabel itu. Itu cara paling ' +
         'murah membuat satu kode melayani empat permainan.']
      ],
      hindari: [
        ['Enam kondisi di-AND dalam satu baris 234 kolom',
         'Baris 1160 aslinya. Yang dipecahkan masalah nyata, tapi tidak ada ' +
         'satu pun nama yang menjelaskan sukunya. Beri nama pada bagiannya — ' +
         '<code>bebasX = (HITS$(..)="" AND MISSES$(..)="")</code> — dan ' +
         'barisnya menciut jadi satu kalimat yang bisa dibaca.'],
        ['Menyemai pengacak di dalam gelung',
         'Baris 720 memanggil <code>RANDOMIZE</code> sebelum <b>setiap</b> ' +
         'angka rahasia, dari detik jam yang sama karena gelungnya habis dalam ' +
         'sepersekian milidetik. Menyemai ulang dengan benih yang sama bukan ' +
         'cara menambah keacakan. Semai <b>sekali</b>, di luar gelung.'],
        ['Benih yang cuma punya enam puluh kemungkinan',
         '<code>VAL(RIGHT$(TIME$,2))</code> adalah detik jam dinding: 0 sampai ' +
         '59. Seluruh permainan berangkat dari salah satu dari enam puluh ' +
         'titik awal. Untuk permainan tebak-tebakan itu tidak berbahaya, tapi ' +
         'pola pikir yang sama pada kata sandi atau kunci adalah lubang.'],
        ['Argumen yang terlihat bermakna padahal bukan',
         '<code>RND(SUB)</code> membuat pembacanya mengira tiap angka diambil ' +
         'dari deret yang berbeda. Di GW-BASIC, argumen positif apa pun ' +
         'berperilaku sama dengan <code>RND</code> polos. Menulis sesuatu yang ' +
         'menyiratkan arti yang tidak ada lebih buruk daripada tidak menulis ' +
         'apa-apa.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa penilaiannya butuh dua putaran',
        isi: [
          'Bayangkan rahasianya <code>3 3 9</code> dan tebakan Anda ' +
          '<code>3 9 3</code>. Berapa yang benar? Berapa yang di tempatnya?',
          'Yang di tempatnya: satu (angka 3 pertama). Yang benar tapi salah ' +
          'tempat: dua (3 dan 9 sisanya). Total benar: tiga.',
          'Kesulitannya: angka 3 muncul dua kali di rahasia dan dua kali di ' +
          'tebakan. Kalau dihitung sembarangan, 3 yang sudah dipakai sebagai ' +
          '"di tempatnya" bisa dihitung lagi sebagai "salah tempat" — dan ' +
          'pemainnya diberi petunjuk yang salah.',
          'Solusinya: <b>dua putaran, dan penanda.</b> Putaran pertama ' +
          'mengambil semua yang di tempatnya dan <b>menandai</b> angkanya ' +
          'terpakai. Putaran kedua hanya boleh memakai yang belum ditandai. ' +
          'Urutan ini wajib — kalau dibalik, putaran "salah tempat" akan ' +
          'mencuri angka yang seharusnya jadi "di tempatnya".'
        ] },
      { judul: 'Enam puluh kemungkinan',
        isi: [
          '<code>720 RANDOMIZE(VAL(RIGHT$(TIME$,2)))</code>',
          '<code>TIME$</code> berbentuk <code>"14:32:07"</code>. ' +
          '<code>RIGHT$(...,2)</code> mengambil dua karakter terakhir: ' +
          '<code>"07"</code>. <code>VAL</code> menjadikannya angka 7.',
          'Jadi benih pengacaknya adalah <b>detik jam dinding</b>: nol sampai ' +
          'lima puluh sembilan. Seluruh permainan berangkat dari salah satu ' +
          'dari enam puluh titik awal.',
          'Untuk permainan tebak angka, itu tidak berbahaya — pemainnya toh ' +
          'tidak tahu jam berapa program menyemai. Tapi pola pikirnya persis ' +
          'sama dengan yang melahirkan lubang keamanan sungguhan: benih yang ' +
          'bisa ditebak karena diambil dari sesuatu yang bisa diamati. Kalau ' +
          'yang dibangkitkan bukan angka rahasia permainan melainkan kata ' +
          'sandi sementara, enam puluh kemungkinan bisa dicoba semua dalam ' +
          'sekejap.'
        ] },
      { judul: 'Kenapa penelusur ini memakai benih tetap',
        isi: [
          'Kalau angka rahasianya berubah tiap kali halaman dimuat, tidak ada ' +
          'satu pun percobaan yang bisa diulang. Anda memasang titik henti di ' +
          'baris 1160, menelusuri sampai ke sana, lalu memuat ulang — dan ' +
          'angkanya sudah lain.',
          'Maka penelusur menyemai dengan angka tetap (42, menggantikan detik ' +
          'jam dinding). Menjalankan MASTER dua kali selalu memberi rahasia ' +
          'yang sama. Yang ditiru <b>perilakunya</b>: bahwa program menyemai ' +
          'dari sesuatu, dan bahwa penyemaian itu ada di dalam gelung.',
          'Ini pilihan yang sama dengan yang diambil semua penguji perangkat ' +
          'lunak yang serius: <b>keacakan yang bisa diulang</b>. Kalau uji ' +
          'Anda memakai pengacak, semailah dari angka yang tercatat — supaya ' +
          'kegagalan yang muncul sekali bisa dimunculkan lagi.'
        ] },
      { judul: 'Larik yang dibuang lalu dibuat lagi',
        isi: [
          'Baris 1000 <code>DIM</code> dua larik penanda; baris 1210 ' +
          '<code>ERASE</code> keduanya. Keduanya ada <b>di dalam</b> gelung ' +
          'baris kesempatan, jadi tiap tebakan membuat larik baru lalu ' +
          'membuangnya.',
          'Kenapa tidak sekadar mengosongkannya? Karena BASIC tidak punya ' +
          'perintah "kosongkan larik". Membuang lalu membuat lagi adalah cara ' +
          'yang tersedia — dan kebetulan juga cara yang paling jelas ' +
          'maksudnya: setiap tebakan dinilai dari nol.',
          'Di bahasa modern padanannya membuat objek baru alih-alih menambal ' +
          'yang lama. Sering kali itu memang lebih benar, bukan cuma lebih ' +
          'mudah.'
        ] }
    ]
  };
})(window);
