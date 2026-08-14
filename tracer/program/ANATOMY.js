/* ===========================================================================
   ANATOMY.js — porting minimalis ANATOMY.BAS sebagai tabel baris.

   "Anatomy of a Program": sembilan halaman yang MENAMPILKAN KODE SUMBER
   PROGRAM LAIN, satu bagian per halaman, dengan rujukan nomor halaman ke buku
   petunjuk cetak.

   Program yang ditampilkannya adalah MASTER.BAS — Master Mind, yang juga ada
   di koleksi ini. Tapi bukan MASTER.BAS yang sekarang:

       ditampilkan ANATOMY   "you may have 2 of the same number in a series."
       MASTER.BAS baris 310  "you may have TWO of the same number in an answer."

   Nomor barisnya pun berbeda. Yang cocok justru bagian yang paling rumit —
   baris 1010 di tampilan identik dengan baris 1160 di MASTER.BAS, sampai ke
   susunan `AND`-nya. Jadi ini VERSI YANG LEBIH TUA, dinomori ulang dan
   diperhalus kata-katanya belakangan. Program pengajarnya mendokumentasikan
   program yang sudah tidak ada lagi di disketnya.

   Dan seluruh berkas ini pada dasarnya latihan MENGUTIP. Untuk menampilkan
   `PRINT"Hello"`, sebuah program BASIC harus menulis:

       PRINT"PRINT"CHR$(34)"Hello"CHR$(34)

   karena tanda kutip tidak bisa ditaruh di dalam tanda kutip. Enam puluh
   baris berikutnya adalah variasi dari masalah itu.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` dijadikan pembuang penyangga tombol, karena dipasangkan
     dengan gelung pembuang `IF INKEY$<>""`.
   - Berakhir dengan `RUN"intro`, dan penangkap galat di baris 41 dengan
     `RUN"menu` — keduanya tanpa tanda kutip penutup.
   =========================================================================== */

(function (global) {
  'use strict';

  var Q = '"';                 /* CHR$(34) — satu-satunya cara mengutip */

  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  /* `PAGE$` dirakit dari kode aksara satu per satu, bukan ditulis sebagai
     string biasa. Di berkas yang isinya penuh tanda kutip, menghindari tanda
     kutip lagi mungkin terasa lebih aman. */
  function halaman(n, teks) {
    return { baris: n, bagian: [
      function (m) { m.v['PAGE$'] = teks; },
      function (m) { m.gosub(1510); }
    ] };
  }

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.warna(3, 0); m.pasangJebakan(10, 40);
      } },
    { baris: 20, jalan: function (m) {
        m.pasangJebakan(1, 1570); m.penangkapGalat = 41;
      } },
    { baris: 30, jalan: function (m) { m.jebakan(10, true); m.lompat(50); } },
    { baris: 40, jalan: function (m) { m.jalankan('INTRO'); } },
    { baris: 41, jalan: function (m) { m.jalankan('MENU'); } },

    /* 50-140 sembilan halaman, dan pola tiap barisnya sama persis:
       bersihkan, gambar kepala, tampilkan halaman, tunggu tombol, dan kalau
       F1 ditekan mundur ke baris SEBELUMNYA. Naskah sebagai daftar. */
    lembar(50, 180, 40), lembar(60, 340, 50), lembar(70, 430, 60),
    lembar(80, 600, 70), lembar(90, 720, 80), lembar(100, 880, 90),
    lembar(110, 990, 100), lembar(120, 1170, 110), lembar(130, 1280, 120),
    { baris: 140, jalan: function (m) { m.lompat(40); } },

    /* 150-170 tunggu satu tombol, dengan F1 dinyalakan hanya di sini —
       persis pola HINTS.BAS. */
    { baris: 150, jalan: function (m) {
        m.v.BACKFLAG = 0; m.jebakan(1, true);
        m.warna(15, 0); m.locate(24, 12, 0);
        m.cetak('Strike Any Key To Continue  Strike <F1> For Previous Page');
        m.warna(3, 0);
      } },
    { baris: 160, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(160);
      } },
    { baris: 170, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(170); else m.kembali();
      } },

    /* --- halaman 1: sambutan Master Mind ---------------------------------- */
    cet(180, '170 LOCATE 5,20,0:PRINT' + Q + 'Welcome to Master Mind. The object of this game is' + Q),
    cet(190, '180 LOCATE 6,15:PRINT' + Q + 'to correctly guess a series of from 3 to 6 numbers.' + Q),
    cet(200, '190 LOCATE 7,15:PRINT' + Q + 'Each number is randomly generated and the possibility' + Q),
    cet(210, '200 LOCATE 8,15:PRINT' + Q + 'exists that you may have 2 of the same number in a' + Q),
    cet(220, '210 LOCATE 9,15:PRINT' + Q + 'series.' + Q),
    cet(230, '220 LOCATE 11,20:PRINT' + Q + 'You will be given from 9 to 15 guesses to accomplish' + Q),
    cet(240, '230 LOCATE 12,15:PRINT' + Q + 'this task, depending upon the length of the series.' + Q),
    cet(250, '240 LOCATE 13,15:PRINT' + Q + 'After each guess you will be told the number of cor-' + Q),
    cet(260, '250 LOCATE 14,15:PRINT' + Q + 'rect digits, along with how many are in the right po-'),
    cet(270, '260 LOCATE 15,15:PRINT' + Q + 'sition. Use these clues to guess the correct series.' + Q),
    cet(280, '270 LOCATE 25,27:COLOR 15,0:PRINT' + Q + 'PRESS ANY KEY TO CONTINUE' + Q + ';:COLOR 7'),
    cet(290, '280 IF INKEY$<>' + Q + Q + ' THEN 280'),
    cet(300, '290 RESP$=INKEY$:IF RESP$=' + Q + Q + ' THEN 290'),
    cet(310, '300 CLS'),
    halaman(320, ' 11 & 12 '),
    { baris: 330, jalan: function (m) { m.kembali(); } },

    /* --- halaman 2: memilih tingkat --------------------------------------- */
    cet(340, '310 DIM GUESS(6):DIM ANSWER(6):COLOR 15,0'),
    cet(350, '320 LOCATE 8,32,0:PRINT ' + Q + 'WELCOME TO MASTER MIND' + Q),
    cet(360, '330 LOCATE 9,20,0:PRINT' + Q + 'TO CHOOSE A LEVEL ENTER THE LETTER NEXT TO IT' + Q),
    cet(370, '340 LOCATE 11,29,0:PRINT ' + Q + 'A)  SERIES OF 3 NUMBERS' + Q),
    cet(380, '350 LOCATE 12,29,0:PRINT ' + Q + 'B)  SERIES OF 4 NUMBERS' + Q),
    cet(390, '360 LOCATE 13,29,0:PRINT ' + Q + 'C)  SERIES OF 5 NUMBERS' + Q),
    cet(400, '370 LOCATE 14,29,0:PRINT ' + Q + 'D)  SERIES OF 6 NUMBERS' + Q + ':COLOR 3,0'),
    halaman(410, ' 12 & 13 '),
    { baris: 420, jalan: function (m) { m.kembali(); } },

    /* --- halaman 3: menggambar bingkai searah jarum jam -------------------- */
    cet(430, '379 LOCATE 6,17:PRINT CHR$(201)'),
    cet(440, '380 FOR A=18 TO 66'),
    cet(450, '390     LOCATE 6,A,0:PRINT CHR$(205)'),
    cet(460, '400 NEXT'),
    cet(470, '410 FOR B=7 TO 15'),
    cet(480, '420     LOCATE B,67,0:PRINT CHR$(186)'),
    cet(490, '430 NEXT'),
    cet(500, '431 LOCATE 16,67:PRINT CHR$(188)'),
    cet(510, '440 FOR C=66 TO 18 STEP -1'),
    cet(520, '450     LOCATE 16,C,0:PRINT CHR$(205)'),
    cet(530, '460 NEXT'),
    cet(540, '461 LOCATE 16,17:PRINT CHR$(200)'),
    cet(550, '470 FOR D=15 TO 7 STEP -1'),
    cet(560, '480     LOCATE D,17,0:PRINT CHR$(186)'),
    cet(570, '490 NEXT'),
    halaman(580, ' 13 & 14 '),
    { baris: 590, jalan: function (m) { m.kembali(); } },

    /* --- halaman 4: memilih tingkat dan mengundi jawabannya ---------------- */
    cet(600, '500 RESP$=INKEY$:IF RESP$=' + Q + Q + ' THEN 500'),
    cet(610, '510 IF RESP$=' + Q + 'A' + Q + ' OR RESP$=' + Q + 'a' + Q + '     THEN DIGITS=3:STARTANS=36:STARTGES=8:BOTROW=15:GOTO 560'),
    cet(620, '520 IF RESP$=' + Q + 'B' + Q + ' OR RESP$=' + Q + 'b' + Q + '     THEN DIGITS=4:STARTANS=34:STARTGES=6:BOTROW=15:GOTO 560'),
    cet(630, '530 IF RESP$=' + Q + 'C' + Q + ' OR RESP$=' + Q + 'c' + Q + '     THEN DIGITS=5:STARTANS=32:STARTGES=4:BOTROW=18:GOTO 560'),
    cet(640, '540 IF RESP$=' + Q + 'D' + Q + ' OR RESP$=' + Q + 'd' + Q + '     THEN DIGITS=6:STARTANS=30:STARTGES=2:BOTROW=21:GOTO 560'),
    cet(650, '550 GOTO 500'),
    cet(660, '560 FOR SUB=1 TO DIGITS'),
    cet(670, '570 RANDOMIZE(VAL(RIGHT$(TIME$,2))):ANSWER(SUB)=FIX(RND(SUB)*10)'),
    cet(680, '580 NEXT SUB'),
    cet(690, '590 CLS'),
    halaman(700, ' 14 '),
    { baris: 710, jalan: function (m) { m.kembali(); } },

    /* --- halaman 5: kepala papan ------------------------------------------ */
    cet(720, '600 XX=1:YY=1:GOSUB 1230'),
    cet(730, '610 LOCATE 1,34,0:PRINT' + Q + 'SECRET NUMBERS' + Q),
    cet(740, '620 LOCATE 2,30,0:PRINT' + Q + '----------------------' + Q),
    cet(750, '630 BEGINANS=STARTANS'),
    cet(760, '640 FOR M=1 TO DIGITS'),
    cet(770, '650     LOCATE 3,BEGINANS,0:PRINT CHR$(219) CHR$(219)'),
    cet(780, '660     BEGINANS=BEGINANS+4'),
    cet(790, '670 NEXT'),
    cet(800, '680 COLOR 15,0:LOCATE 5,4,0:PRINT' + Q + 'ENTER YOUR GUESSES' + Q + ':COLOR 3,0'),
    cet(810, '690 LOCATE 6,2,0:PRINT' + Q + '----------------------' + Q),
    cet(820, '700 LOCATE 5,28,0:PRINT' + Q + 'CORRECT NUMBERS' + Q),
    cet(830, '710 LOCATE 6,28,0:PRINT' + Q + '---------------' + Q),
    cet(840, '720 LOCATE 5,49,0:PRINT' + Q + 'CORRECT NUMBERS/RIGHT POSITION' + Q),
    cet(850, '730 LOCATE 6,49,0:PRINT' + Q + '------------------------------' + Q),
    halaman(860, ' 14 & 15 '),
    { baris: 870, jalan: function (m) { m.kembali(); } },

    /* --- halaman 6: kotak tebakan kosong ---------------------------------- */
    cet(880, '740 FOR ROW=7 TO BOTROW'),
    cet(890, '750     BEGINGES=STARTGES'),
    cet(900, '760     FOR Q=1 TO DIGITS'),
    cet(910, '770         LOCATE ROW,BEGINGES,0:PRINT CHR$(220) CHR$(220)'),
    cet(920, '780         BEGINGES=BEGINGES+4'),
    cet(930, '790     NEXT Q'),
    cet(940, '800     LOCATE ROW,35,0:PRINT CHR$(220) CHR$(220)'),
    cet(950, '810     LOCATE ROW,63,0:PRINT CHR$(220) CHR$(220)'),
    cet(960, '820 NEXT ROW'),
    halaman(970, ' 15 '),
    { baris: 980, jalan: function (m) { m.kembali(); } },

    /* --- halaman 7: membaca tebakan, menghitung yang TEPAT ---------------- */
    cet(990, '830 FOR ROW=7 TO BOTROW'),
    cet(1000, '840     BEGINGES=STARTGES:HITS=0:GUESSES=0'),
    cet(1010, '850     DIM HITS$(10,6):DIM MISSES$(10,6)'),
    cet(1020, '860     FOR SUB=1 TO DIGITS'),
    cet(1030, '870         LOCATE ROW,BEGINGES,0'),
    cet(1040, '880         DEF SEG:POKE 106,0:IF INKEY$<>' + Q + Q + ' THEN 880'),
    cet(1050, '890         TRY$=INKEY$:IF TRY$=' + Q + Q + ' OR TRY$<' + Q + '0' + Q + ' OR TRY$>' + Q + '9' + Q + ' THEN 890'),
    cet(1060, '900         GUESS(SUB)=VAL(TRY$)'),
    cet(1070, '910         LOCATE ROW,BEGINGES-1,0:PRINT CHR$(255) GUESS(SUB)'),
    cet(1080, '920         BEGINGES=BEGINGES+4'),
    cet(1090, '930     NEXT SUB'),
    cet(1100, '940     FOR X=1 TO DIGITS'),
    cet(1110, '950         FOR Y=1 TO DIGITS'),
    cet(1120, '960          IF GUESS(X)=ANSWER(Y) AND X=Y AND HITS$(GUESS(X),X)<>' + Q + '*' + Q + '             THEN GUESSES=GUESSES+1:HITS=HITS+1:HITS$(GUESS(X),X)=' + Q + '*' + Q + '             :MISSES$(GUESS(X),X)=' + Q + '*' + Q + ': GOTO 980'),
    cet(1130, '970         NEXT Y'),
    cet(1140, '980     NEXT X'),
    /* 1150 `PAGE=15` — VARIABEL ANGKA, sementara baris 1510 mencetak
       `PAGE$` yang bertipe string. Jadi nilai 15 itu tidak pernah dipakai,
       dan kakinya menampilkan apa pun yang tersisa di `PAGE$`.

       Yang membuatnya tidak terlihat: halaman sebelumnya (baris 970) sudah
       menyetel `PAGE$=" 15 "`. Jadi angka yang muncul KEBETULAN BENAR.
       Cacatnya laten — ia baru terlihat kalau rujukan halaman 6 berubah. */
    { baris: 1150, bagian: [
        function (m) { m.v.PAGE = 15; },
        function (m) { m.gosub(1510); }
      ] },
    { baris: 1160, jalan: function (m) { m.kembali(); } },

    /* --- halaman 8: menghitung yang BENAR TAPI SALAH TEMPAT ---------------- */
    cet(1170, '990     FOR X=1 TO DIGITS'),
    cet(1180, '1000         FOR Y=1 TO DIGITS'),
    cet(1190, '1010             IF GUESS(X)=ANSWER(Y) AND HITS$(GUESS(X),X)=' + Q + Q + '                 AND MISSES$(GUESS(X),X)=' + Q + Q + ' AND X<>Y AND MISSES$(GUESS(X),Y)'),
    cet(1200, '                 =' + Q + Q + ' AND HITS$(GUESS(X),Y)=' + Q + Q + '                 THEN GUESSES=GUESSES+1:MISSES$(GUESS(X),X)=' + Q + '*' + Q + '                 :MISSES$(GUESS(X),Y)=' + Q + '*' + Q + ': GOTO 1030'),
    cet(1210, '1020         NEXT Y'),
    cet(1220, '1030     NEXT X'),
    cet(1230, '1040     LOCATE ROW,34,0:PRINT CHR$(255) GUESSES CHR$(255)'),
    cet(1240, '1050     LOCATE ROW,62,0:PRINT CHR$(255) HITS CHR$(255)'),
    cet(1250, '1060     ERASE MISSES$: ERASE HITS$'),
    /* 1260 kesalahan yang sama dengan baris 1150, dan tertutupi dengan cara
       yang sama. */
    { baris: 1260, bagian: [
        function (m) { m.v.PAGE = 15; },
        function (m) { m.gosub(1510); }
      ] },
    { baris: 1270, jalan: function (m) { m.kembali(); } },

    /* --- halaman 9: menang, kalah, dan jebakan F10 ------------------------ */
    cet(1280, '1070     IF HITS=DIGITS THEN GOSUB 20:GOSUB 1280:LOCATE 22,21:PRINT' + Q),
    cet(1290, '          !!!  C O N G R A G U L A T I O N S  !!!' + Q + ':GOTO 1110'),
    cet(1300, '1080 NEXT ROW'),
    cet(1310, '1090 GOSUB 20'),
    cet(1320, '1100 GOSUB 1265:LOCATE 22,23,0:PRINT' + Q + '!!!  S O R R Y , Y O U   L O S T  !!!' + Q),
    cet(1330, '1110 LOCATE 23,25,O:PRINT' + Q + 'DO YOU WISH TO PLAY AGAIN?  <Y/N>' + Q),
    cet(1340, '1120 IF INKEY$<>' + Q + Q + ' THEN 1120'),
    cet(1350, '1130 RESP$=INKEY$:IF RESP$=' + Q + Q + ' THEN 1130'),
    cet(1360, '1140 IF RESP$=' + Q + 'Y' + Q + ' OR RESP$=' + Q + 'y' + Q + ' THEN CLS:GOTO 320'),
    cet(1370, '1150 IF RESP$<>' + Q + 'N' + Q + ' AND RESP$<>' + Q + 'n' + Q + ' THEN 1130'),
    cet(1380, '1160 RUN' + Q + 'MENU'),
    cet(1390, '1170 KEY(10) OFF:XX=CSRLIN:YY=POS(0):LOCATE 25,1:PRINT SPC(79);:LOCATE 25,25'),
    cet(1400, '1180 COLOR 15:PRINT ' + Q + 'DO YOU WISH TO LEAVE THIS GAME <Y/N>' + Q + ';:COLOR 7'),
    cet(1410, '1190 IF INKEY$<>' + Q + Q + ' THEN 1190'),
    cet(1420, '1200 R$=INKEY$:IF R$=' + Q + Q + ' THEN 1200'),
    cet(1430, '1210 IF R$=' + Q + 'Y' + Q + ' OR R$=' + Q + 'y' + Q + ' THEN 1160'),
    cet(1440, '1220 IF R$<>' + Q + 'N' + Q + ' AND R$<>' + Q + 'n' + Q + ' THEN 1200'),
    cet(1450, '1230 LOCATE 25,1:PRINT SPC(79);:LOCATE 25,25:COLOR 0,7'),
    cet(1460, '1240 PRINT ' + Q + ' STRIKE <F10> TO LEAVE THIS GAME ' + Q + ';:COLOR 7,0:LOCATE XX,YY'),
    cet(1470, '1250 KEY(10) ON:DEF SEG:POKE 106,0:RETURN'),
    cet(1480, '1260 END'),
    /* 1490 di sini `PAGE$` diisi dengan benar, sebagai string biasa. */
    halaman(1490, ' 15 '),
    { baris: 1500, jalan: function (m) { m.kembali(); } },

    /* --- 1510-1560: kaki dan kepala halaman ------------------------------- */
    { baris: 1510, jalan: function (m) {
        m.locate(23, 17);
        m.cetak('Screen corresponds to page' + (m.v['PAGE$'] || '') +
                'in your manual');
      } },
    { baris: 1520, jalan: function (m) {
        m.locate(25, 23); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Program ');
        m.warna(3, 0);
      } },
    { baris: 1530, jalan: function (m) { m.kembali(); } },
    { baris: 1540, jalan: function (m) {
        m.locate(1, 28); m.warna(0, 7);
        m.cetak(' Anatomy of a Program '); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1550, jalan: function (m) { m.barisBaru(); } },
    { baris: 1560, jalan: function (m) { m.kembali(); } },

    /* 1570-1580 `RETURN <baris>` yang sama dengan HINTS.BAS: membuang alamat
       pulang jebakan F1 supaya penungguan di baris 170 keluar lebih awal. */
    { baris: 1570, jalan: function (m) {
        m.jebakan(1, false); m.v.BACKFLAG = 1;
        m.kembali(1580);
      } },
    { baris: 1580, jalan: function (m) { m.kembali(); } }
  ];

  function lembar(nomor, isi, mundur) {
    return { baris: nomor, bagian: [
      function (m) { m.cls(); },
      function (m) { m.gosub(1540); },
      function (m) { m.gosub(isi); },
      function (m) { m.gosub(150); },
      function (m) { if (m.v.BACKFLAG) m.lompat(mundur); }
    ] };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['ANATOMY'] = {
    nama: 'ANATOMY',
    judul: 'Anatomy of a Program (kode MASTER.BAS, dibedah)',
    sumber: 'ANATOMY',
    berkas: 'run/ANATOMY.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur ANATOMY.BAS',
      simpul: [
        { id: 'pasang', baris: '10-30', jenis: 'mulai',
          teks: ['F10 ke intro, F1 mundur,', 'ON ERROR ke menu'] },
        { id: 'naskah', baris: '50-140',
          teks: ['Sembilan halaman,', 'satu baris per halaman'] },
        { id: 'kepala', baris: '1540-1560', jenis: 'subrutin',
          teks: ['Judul "Anatomy of a Program"'] },
        { id: 'isi', baris: '180-1500', jenis: 'subrutin',
          teks: ['Cetak kode MASTER.BAS,', 'CHR$(34) untuk tiap kutip'] },
        { id: 'kaki', baris: '1510-1530', jenis: 'subrutin',
          teks: ['Rujukan halaman buku,', 'dan bilah F10'] },
        { id: 'tunggu', baris: '150-170', jenis: 'subrutin',
          teks: ['Nyalakan F1,', 'tunggu satu tombol'] },
        { id: 'f1', baris: '1570-1580', jenis: 'putusan',
          teks: ['F1: BACKFLAG=1,', 'RETURN 1580 - keluar lebih awal'] },
        { id: 'keluar', baris: '40-41', jenis: 'keluar',
          teks: ['RUN "intro";', 'galat apa pun ke menu'] }
      ],
      panah: [
        { dari: 'pasang', ke: 'naskah' },
        { dari: 'naskah', ke: 'kepala' },
        { dari: 'naskah', ke: 'isi' },
        { dari: 'isi', ke: 'kaki' },
        { dari: 'naskah', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'f1', label: 'F1 ditekan' },
        { dari: 'f1', ke: 'naskah', label: 'mundur satu halaman' },
        { dari: 'naskah', ke: 'keluar', label: 'halaman terakhir / F10' }
      ]
    },

    pseudokode: [
      { baris: 50, tingkat: 0, teks: 'sembilan halaman, <b>satu baris per halaman</b>: bersih, kepala, isi, tunggu, mundur?' },
      { baris: 180, tingkat: 0, teks: 'tiap halaman mencetak potongan <b>kode sumber MASTER.BAS</b>' },
      { baris: 180, tingkat: 1, teks: '<code>CHR$(34)</code> dipakai tiap kali kode yang dikutip punya tanda kutip' },
      { baris: 320, tingkat: 1, teks: '<code>PAGE$</code> dirakit dari <code>CHR$</code> satu per satu &mdash; " 11 &amp; 12 "' },
      { baris: 1150, tingkat: 1, teks: '&hellip;tapi di sini yang diisi <code>PAGE</code> (angka), bukan <code>PAGE$</code>' },
      { baris: 1510, tingkat: 1, teks: 'kaki halaman mencetak <code>PAGE$</code> &mdash; jadi nomornya <b>basi</b>' },
      { baris: 150, tingkat: 0, teks: 'nyalakan F1, tunggu tombol' },
      { baris: 1570, tingkat: 1, teks: 'F1: <code>RETURN 1580</code> &mdash; trik yang sama dengan HINTS.BAS' }
    ],

    perintahAsli: 'run\\ANATOMY.bat',
    catatanAsli: 'Sembilan halaman. Tombol apa saja maju, F1 mundur, F10 ' +
      'keluar. Bandingkan isinya dengan MASTER.BAS di penelusur ini &mdash; ' +
      'nomor barisnya sudah berbeda.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 160), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris yang sama.',

      '<b>Berakhir dengan <code>RUN"intro</code></b>, dan penangkap galat di ' +
      'baris 41 dengan <code>RUN"menu</code> &mdash; keduanya tanpa tanda ' +
      'kutip penutup.'
    ],

    pelajaran: {
      ringkas: 'Program yang menampilkan kode program lain &mdash; dan ' +
        'karenanya harus menyelesaikan masalah mengutip tanda kutip, enam ' +
        'puluh baris berturut-turut.',
      pelajari: [
        ['Mengutip tanda kutip',
         'Untuk menampilkan <code>PRINT"Hello"</code>, sebuah program BASIC ' +
         'harus menulis <code>PRINT"PRINT"CHR$(34)"Hello"CHR$(34)</code>. ' +
         'Tidak ada aksara pelolos di BASIC &mdash; tidak ada ' +
         '<code>\\"</code>, tidak ada kutip ganda. Yang ada ' +
         '<code>CHR$(34)</code>, dan string harus <b>dipatahkan</b> tiap kali ' +
         'butuh satu. Enam puluh baris berikutnya adalah variasi dari masalah ' +
         'itu, dan hasilnya bacaan yang bagus tentang kenapa bahasa modern ' +
         'punya aksara pelolos.'],
        ['Naskah sebagai daftar satu baris per halaman',
         'Baris 50&ndash;140: sembilan baris, dan tiap baris menyebut isi ' +
         'halamannya, tempat kembali kalau F1 ditekan, dan tidak ada yang ' +
         'lain. Bentuk yang sama dengan BUSSIX.BAS &mdash; dan sama ' +
         'terbacanya.'],
        ['RETURN ke tempat lain, lagi',
         'Baris 1570: <code>KEY(1) OFF:BACKFLAG=1:RETURN 1580</code>. Trik ' +
         'yang persis sama dengan HINTS.BAS: alamat pulang jebakan dibuang, ' +
         'dan <code>RETURN</code> di 1580 pulang dari <code>GOSUB 150</code>. ' +
         'Dua program di koleksi ini memakai pola yang sama untuk hal yang ' +
         'sama &mdash; membatalkan penungguan tombol dari dalam jebakan.'],
        ['Dokumentasi yang berjalan',
         'Kaki tiap halaman menyebut nomor halaman di buku petunjuk cetak: ' +
         '<i>"Screen corresponds to page 11 &amp; 12 in your manual"</i>. ' +
         'Perangkat lunak 1982 datang dengan buku, dan program ini ' +
         '<b>jembatannya</b> &mdash; layar dan kertas dirujuk silang, satu ' +
         'arah.']
      ],
      hindari: [
        ['Dokumentasi yang mendokumentasikan versi lain',
         'Kode yang ditampilkan bukan MASTER.BAS yang ada di disket ini. ' +
         'Nomor barisnya berbeda, dan kata-katanya sudah diperhalus: ' +
         '<i>"2 of the same number in a series"</i> di sini, ' +
         '<i>"TWO of the same number in an answer"</i> di MASTER.BAS baris ' +
         '310. Yang cocok justru bagian paling rumitnya &mdash; baris 1010 di ' +
         'sini identik dengan baris 1160 di MASTER.BAS. Jadi ini <b>versi ' +
         'yang lebih tua</b>, dan program pengajarnya tidak ikut diperbarui.'],
        ['Satu huruf dolar yang hilang',
         'Baris 1150 dan 1260 menulis <code>PAGE=15</code>. Baris 1510 ' +
         'mencetak <code>PAGE$</code>. Keduanya variabel <b>berbeda</b>, jadi ' +
         'nilai 15 itu tidak pernah dipakai &mdash; kaki halaman 7 dan 8 ' +
         'menampilkan apa pun yang tersisa di <code>PAGE$</code>. ' +
         'Terverifikasi di penelusur: keduanya menampilkan <b>"15"</b>, dan ' +
         'itu <b>kebetulan benar</b>, karena halaman 6 sudah menyetel ' +
         '<code>PAGE$=" 15 "</code>. Cacatnya <b>laten</b>: ia baru terlihat ' +
         'kalau rujukan halaman 6 berubah. Tidak ada galat &mdash; BASIC ' +
         'dengan senang hati membuat variabel baru.'],
        ['String yang dirakit dari kode aksara',
         'Baris 320: <code>PAGE$=CHR$(32)+CHR$(49)+CHR$(49)+CHR$(32)+' +
         'CHR$(38)+&hellip;</code> &mdash; delapan pemanggilan untuk menulis ' +
         '<code>" 11 &amp; 12 "</code>. Baris 1490 menulis string yang sama ' +
         'dengan cara biasa. Di berkas yang isinya penuh tanda kutip, ' +
         'menghindari tanda kutip lagi mungkin terasa lebih aman &mdash; tapi ' +
         'hasilnya baris yang tidak bisa dibaca siapa pun.'],
        ['Salah ketik yang ikut dipamerkan',
         'Baris 1290 menampilkan <code>C O N G R A G U L A T I O N S</code>. ' +
         'Salah ketik itu ada di program aslinya, dan program pengajar ini ' +
         'menyalinnya apa adanya ke sembilan halaman bahan ajar.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa CHR$(34) ada di mana-mana',
        isi: [
          'Berkas ini menampilkan kode sumber. Dan kode sumber BASIC penuh ' +
          'tanda kutip.',
          'Masalahnya: di BASIC, string dibatasi tanda kutip, dan <b>tidak ada ' +
          'cara menaruh tanda kutip di dalamnya</b>. Tidak ada ' +
          '<code>\\"</code> seperti di C, tidak ada <code>""</code> seperti di ' +
          'Pascal. Tidak ada apa pun.',
          'Yang ada satu jalan: patahkan stringnya, sisipkan ' +
          '<code>CHR$(34)</code>, sambung lagi.',
          'Jadi untuk menampilkan satu baris seperti ini:',
          '<code>170 LOCATE 5,20,0:PRINT"Welcome to Master Mind."</code>',
          'program ini harus menulis:',
          '<code>180 PRINT"170 LOCATE 5,20,0:PRINT"CHR$(34)"Welcome to Master ' +
          'Mind."CHR$(34)"</code>',
          'Perhatikan juga tanda kutip di ujungnya yang tidak pernah ditutup ' +
          '&mdash; kebiasaan yang sama dengan BUSSIX.BAS dan HINTS.BAS.',
          'Enam puluh baris berikutnya adalah variasi dari masalah yang sama. ' +
          'Dan itu membuat berkas ini bacaan yang tidak sengaja bagus tentang ' +
          '<b>kenapa bahasa modern punya aksara pelolos</b> &mdash; bukan ' +
          'karena elegan, melainkan karena tanpanya, menulis program yang ' +
          'menulis program jadi latihan menyambung tali.'
        ] },
      { judul: 'Bahan ajar yang mengajarkan versi yang salah',
        isi: [
          'Program yang dibedah di sini adalah MASTER.BAS, Master Mind, yang ' +
          'juga ada di koleksi ini dan sudah punya halamannya sendiri di ' +
          'penelusur.',
          'Tapi bukan MASTER.BAS yang ada di disket. Bandingkan:',
          '<code>ANATOMY&nbsp; &nbsp;"you may have 2 of the same number in a ' +
          'series."</code><br>' +
          '<code>MASTER 310 "you may have TWO of the same number in an ' +
          'answer."</code>',
          'Nomor barisnya juga tidak cocok. Yang ditampilkan ANATOMY sebagai ' +
          'baris 170 adalah layar sambutan; di MASTER.BAS, baris 170 adalah ' +
          '<code>KEY OFF:SCREEN 0,0,0</code>.',
          'Yang cocok justru bagian yang paling sulit ditulis ulang: baris ' +
          '1010 di tampilan &mdash; syarat "benar tapi salah tempat" dengan ' +
          'lima <code>AND</code> berturut-turut &mdash; identik dengan baris ' +
          '1160 di MASTER.BAS, sampai ke urutan pemeriksaannya.',
          'Jadi ceritanya jelas: MASTER.BAS <b>dinomori ulang dan diperhalus ' +
          'kata-katanya</b> sesudah bahan ajar ini dibuat, dan bahan ajarnya ' +
          'tidak ikut diperbarui.',
          'Ini jenis kerusakan yang paling sulit ditemukan, karena tidak ada ' +
          'satu pun bagian yang salah <b>sendirian</b>. MASTER.BAS benar. ' +
          'ANATOMY.BAS berjalan sempurna. Yang salah cuma hubungan di antara ' +
          'keduanya &mdash; dan tidak ada apa pun di kedua berkas yang ' +
          'menyebutkan bahwa hubungan itu ada.'
        ] }
    ]
  };
})(window);
