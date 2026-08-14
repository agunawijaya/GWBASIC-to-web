/* ===========================================================================
   TICTAC.js — porting minimalis TICTAC.BAS sebagai tabel baris.

   Program keenam, dan lawan komputer yang pertama. Dua hal di dalamnya layak
   dipelajari jauh melampaui permainannya sendiri:

   1. PAPAN BERTEPI SENTINEL. Papan 3x3 disimpan bukan sebagai 9 kotak,
      melainkan sebagai larik 25 kotak berbentuk kisi 5x5, dengan seluruh
      tepinya diisi angka 3:

              0  1  2  3  4          3  3  3  3  3
              5  6  7  8  9          3  .  .  .  3
             10 11 12 13 14    -->   3  .  .  .  3
             15 16 17 18 19          3  .  .  .  3
             20 21 22 23 24          3  3  3  3  3

      Sembilan kotak main ada di 6,7,8 / 11,12,13 / 16,17,18. Karena tepinya
      berisi 3 — angka yang tidak pernah dipakai pemain mana pun — pemeriksaan
      "tiga berderet" bisa melangkah ke segala arah tanpa pernah menanyakan
      "apakah saya sudah di pinggir?". Tepinya yang menjawab.

   2. ARAH SEBAGAI ANGKA. `DATA 1,6,5,4,-1,-6,-5,-4` adalah delapan arah mata
      angin di kisi selebar lima: +1 kanan, +5 bawah, +6 bawah-kanan, +4
      bawah-kiri, dan empat kebalikannya. Bergerak satu langkah ke arah mana
      pun = satu penjumlahan.

   Keduanya masih dipakai hari ini, di papan catur sampai pencari jalan.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` di baris 1410 tidak berbunyi (fanfare kemenangan komputer).
   - `COLOR 31` dan `COLOR 15` (tanpa warna latar) berarti kedip / putih
     terang; kedipnya tidak ditiru.
   - Gelung tunda `FOR A=1 TO 2000:NEXT` di baris 250 habis seketika.
   - `KEY OFF`, `SCREEN 0,0,0`, `WIDTH 80`, `DEFSTR Z` tidak berbuat apa-apa.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    /* 10 siapkan layar, pasang jebakan F10. */
    { baris: 10, jalan: function (m) {
        m.warna(7, 0);
        m.cls();
        m.jebakan(10, true);
        m.pasangJebakan(10, 1420);
      } },

    /* 110 sembilan jebakan mandul, menuju RETURN di baris 480. */
    { baris: 110, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 480);
          m.jebakan(m.v.A, true);
        }
      } },

    /* 120 DIM A(9),B(9),C(24),D(7),E(18)
         A() kotak nomor 1-9  -> indeks di C()
         B() kotak nomor 1-9  -> kolom layar (1, 2, atau 3)
         C() papan 5x5 bertepi sentinel — lihat catatan di kepala berkas
         D() delapan arah mata angin sebagai angka
         E() indeks di C()    -> kotak nomor 1-9 (kebalikan A)
       T() ditambahkan sendiri di baris 800; BASIC membuat larik 0-10 tanpa
       DIM kalau indeksnya tidak lebih dari sepuluh. */
    { baris: 120, jalan: function (m) {
        /* A_, B_, dan T_ memakai garis bawah karena BASIC membedakan variabel
           `A` dari larik `A()` — dan program ini memakai KEDUANYA sekaligus.
           JavaScript tidak punya pembedaan itu, jadi lariknya diberi nama
           lain. Nomor barisnya tidak berubah; hanya namanya di dalam mesin. */
        m.dim('A_', 9); m.dim('B_', 9); m.dim('C', 24);
        m.dim('D', 7);  m.dim('E', 18); m.dim('T_', 10);
      } },

    /* 130 GOSUB 720:GOSUB 570 — siapkan larik, lalu layar judul. */
    { baris: 130, bagian: [
        function (m) { m.gosub(720); },
        function (m) { m.gosub(570); }
      ] },

    /* 140 GOSUB 180 — "Anda duluan?" */
    { baris: 140, jalan: function (m) { m.gosub(180); } },

    /* 150 ON T(T) GOSUB 220,860

       Gelung utama permainannya, dan seluruhnya satu baris. T() adalah
       pengalih: T(1)=2 dan T(2)=1. Jadi kalau giliran barusan milik pemain
       (T=1), T(T) bernilai 2 dan yang dipanggil target KEDUA — rutin komputer.
       Giliran berikutnya sebaliknya. Larik dua unsur sebagai saklar. */
    { baris: 150, jalan: function (m) {
        var pilih = m.v.T_[m.v.T];
        if (pilih === 1) m.gosub(220);
        else if (pilih === 2) m.gosub(860);
      } },

    /* 160 FOR A=6 TO 18:IF C(A)<>0 THEN NEXT:GOSUB 1350:GOTO 140

       Baris paling licin di program ini. Bacalah begini: telusuri seluruh
       kotak; SELAMA kotaknya terisi, lanjutkan gelung. Kalau gelungnya habis
       tanpa pernah menemukan kotak kosong, papannya penuh — umumkan seri.
       Kalau ada kotak kosong, `IF` bernilai salah, SISA BARIS DILEWATI, dan
       alur jatuh ke baris 170.

       Jadi satu baris ini adalah "kalau papan penuh, seri" — dan tidak ada
       satu pun kata di dalamnya yang mengatakan itu. */
    { baris: 160, bagian: [
        function (m) { m.untuk('A', 6, 18, 1); },
        function (m) {
          if (m.v.C[m.v.A] !== 0) m.lanjutkan('A');
          else m.lompat(170);         /* kotak kosong: sisa baris dilewati */
        },
        function (m) { m.gosub(1350); },
        function (m) { m.lompat(140); }
      ] },

    /* 170 IF W<>1 THEN 150 ELSE GOSUB 1350:GOTO 140 */
    { baris: 170, bagian: [
        function (m) { if (m.v.W !== 1) m.lompat(150); else m.gosub(1350); },
        function (m) { m.lompat(140); }
      ] },

    /* 180-210 tanya siapa duluan. */
    { baris: 180, jalan: function (m) { m.locate(22, 26); m.warna(15, 0); } },
    { baris: 190, jalan: function (m) {
        m.cetak('Do You Wish To Go First? <Y/N>         '); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 200, jalan: function (m) { m.gosub(280); } },
    { baris: 210, jalan: function (m) {
        var z = m.v.Z;
        if (z === 'Y' || z === 'y') m.lompat(220);
        else if (z === 'N' || z === 'n') m.lompat(860);
        else m.lompat(200);
      } },

    /* 220-270 giliran pemain. */
    { baris: 220, jalan: function (m) {
        m.locate(22, 1); m.spc(79); m.barisBaru();
        m.warna(15, 0);
        m.locate(22, 27);
        m.cetak('Please Enter Square Number'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 230, bagian: [
        function (m) { m.gosub(280); },
        function (m) { if (m.v.Z > '0' && m.v.Z <= '9') m.lompat(260); }
      ] },
    { baris: 240, jalan: function (m) {
        m.locate(23, 25);
        m.cetak('Invalid Move. Please Try Again.'); m.barisBaru();
      } },
    /* 250 jeda ~1 detik lalu hapus pesannya; di sini habis seketika. */
    { baris: 250, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 2000; m.v.A++) { /* jeda */ }
        m.locate(23, 25); m.spc(49); m.barisBaru();
      } },
    { baris: 251, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(251); else m.lompat(220);
      } },
    /* 260 N=VAL(Z):IF C(A(N))>0 THEN 240 — kotak nomor jadi indeks papan. */
    { baris: 260, jalan: function (m) {
        m.v.N = parseInt(m.v.Z, 10) || 0;
        if (m.v.C[m.v.A_[m.v.N]] > 0) m.lompat(240);
      } },
    { baris: 270, jalan: function (m) { m.v.T = 1; m.lompat(290); } },

    /* 280 subrutin "tunggu satu tombol". */
    { baris: 280, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(280); else m.kembali();
      } },

    /* 290-320 letakkan bidak.
       290 baris layar dari nomor kotak: 6*INT(N/3+0,9)-2 memberi 4, 10, 16.
       300 kolom layar: 9 + kolom*14 memberi 23, 37, 51.
       Perhatikan A dan B di sini BUKAN pencacah gelung, padahal huruf yang
       sama dipakai sebagai pencacah di belasan tempat lain. */
    { baris: 290, jalan: function (m) {
        m.v.A = 6 * Math.floor(m.v.N / 3 + 0.9) - 2;
      } },
    { baris: 300, jalan: function (m) { m.v.B = 9 + m.v.B_[m.v.N] * 14; } },
    /* 310 C(A(N))=T — catat pemilik kotaknya di papan. */
    { baris: 310, jalan: function (m) { m.v.C[m.v.A_[m.v.N]] = m.v.T; } },
    { baris: 320, jalan: function (m) {
        if (m.v.T === 1) m.lompat(490); else if (m.v.T === 2) m.lompat(530);
      } },

    /* 330-480 gambar papan. Dimasuki lewat GOTO dari baris 620 dan 710, dan
       RETURN di baris 480 yang menutup GOSUB 570 dari baris 130. Melompat
       keluar sebuah subrutin ke blok lain yang berakhir RETURN — sah di
       BASIC, dan mustahil dibaca tanpa menelusurinya. */
    { baris: 330, jalan: function (m) { m.cls(); } },
    { baris: 340, jalan: function (m) { m.untuk('A', 3, 19, 1, 380); } },
    /* 350 menulis ulang judul pada SETIAP putaran — tujuh belas kali untuk
       sesuatu yang tidak berubah. */
    { baris: 350, jalan: function (m) {
        m.locate(1, 35); m.warna(15, 0);
        m.cetak('TIC TAC TOE'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 360, jalan: function (m) {
        m.locate(m.v.A, 19); m.cetak(m.chr(219)); m.barisBaru();
        m.locate(m.v.A, 32); m.cetak(m.ulang(2, 219)); m.barisBaru();
        m.locate(m.v.A, 46); m.cetak(m.ulang(2, 219)); m.barisBaru();
        m.locate(m.v.A, 60); m.cetak(m.chr(219)); m.barisBaru();
      } },
    { baris: 370, jalan: function (m) { m.lanjutkan('A'); } },
    garisPapan(380, 2), garisPapan(390, 8), garisPapan(400, 14), garisPapan(410, 20),

    /* 420-460 tulis angka 1-9 di tiap kotak. */
    { baris: 420, bagian: [
        function (m) { m.v.B = 0; },
        function (m) { m.untuk('A', 1, 3, 1, 470); }
      ] },
    nomorKotak(430, 25, 0),
    nomorKotak(440, 39, 1),
    nomorKotak(450, 53, 2),
    { baris: 460, jalan: function (m) { m.v.B += 2; m.lanjutkan('A'); } },

    { baris: 470, jalan: function (m) {
        m.locate(25, 24); m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(3, 0);
      } },
    /* 480 RETURN — penutup blok papan SEKALIGUS badan jebakan F1-F9. */
    { baris: 480, jalan: function (m) { m.kembali(); } },

    /* 490-520 gambar X (merah, balok penuh). */
    { baris: 490, jalan: function (m) {
        m.warna(12, 0); m.locate(m.v.A, m.v.B);
        m.cetak(m.chr(219) + m.chr(219) + '  ' + m.chr(219) + m.chr(219));
        m.barisBaru();
      } },
    bidak(500, 1, ' ' + b(219, 4) + ' '),
    bidak(510, 2, b(219, 2) + '  ' + b(219, 2)),
    { baris: 520, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    /* 530-560 gambar O (hijau, balok arsir). */
    { baris: 530, jalan: function (m) {
        m.warna(10, 0); m.locate(m.v.A, m.v.B);
        m.cetak(b(178, 6)); m.barisBaru();
      } },
    bidak(540, 1, b(178, 2) + '  ' + b(178, 2)),
    bidak(550, 2, b(178, 6)),
    { baris: 560, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    /* 570-710 layar judul dan petunjuk. */
    { baris: 570, jalan: function (m) {
        m.cls(); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 580, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219));
        }
      } },
    { baris: 590, jalan: function (m) { m.cetak(m.ulang(80, 219)); } },
    { baris: 600, jalan: function (m) {
        m.locate(4, 23); m.warna(15, 0);
        m.cetak('       T I C - T A C - T O E'); m.barisBaru();
      } },
    { baris: 610, jalan: function (m) {
        m.locate(8, 23);
        m.cetak('Would You Like Instructions? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 620, bagian: [
        function (m) { m.gosub(280); },
        function (m) {
          var z = m.v.Z;
          if (z === 'N' || z === 'n') m.lompat(330);
          else if (z !== 'Y' && z !== 'y') m.lompat(620);
        }
      ] },

    petunjuk(630,  6, 21, 'I will play you a game of  TIC-TAC-TOE.'),
    petunjuk(640,  7, 21, "In this game I will always be ` O 'and"),
    petunjuk(650,  8, 21, "you will always be ` X '. You may tell"),
    petunjuk(660,  9, 21, 'me  if you would  like to go  first or'),
    petunjuk(670, 10, 21, "second;  however,  it  doesn't  matter"),
    petunjuk(680, 11, 21, 'because  I  can  not  be  defeated !!!'),
    petunjuk(690, 14, 27, "GOOD LUCK. YOU'LL NEED IT !!"),

    { baris: 700, jalan: function (m) {
        m.locate(25, 28); m.warna(15, null);
        m.cetak('Strike Any Key To Continue');
        m.warna(3, 0);
      } },
    { baris: 710, bagian: [
        function (m) { m.gosub(280); },
        function (m) { m.lompat(330); }
      ] },

    /* --- 720-840: menyiapkan larik ---------------------------------------- */

    /* 720 FOR A=0 TO 6 STEP 3:FOR B=1 TO 3:B(A+B)=B:NEXT B,A
       `NEXT B,A` menutup DUA gelung dengan satu pernyataan. B(n) = kolom
       kotak nomor n: 1,2,3, 1,2,3, 1,2,3. */
    { baris: 720, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 6; m.v.A += 3) {
          for (m.v.B = 1; m.v.B <= 3; m.v.B++) m.v.B_[m.v.A + m.v.B] = m.v.B;
        }
      } },
    { baris: 730, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 24; m.v.A++) m.v.C[m.v.A] = 0;
      } },

    /* 740-760 INILAH tepi sentinelnya. Empat kali putaran mengisi angka 3 ke
       enam belas kotak pinggir: 0-5, 9, 10, 14, 15, 19-24. Yang tersisa
       bernilai 0 persis sembilan kotak main. Sesudah ini, pemeriksaan tiga
       berderet boleh melangkah ke arah mana pun tanpa memeriksa tepi. */
    { baris: 740, jalan: function (m) { m.untuk('A', 1, 4, 1, 770); } },
    { baris: 750, jalan: function (m) {
        var A = m.v.A;
        m.v.C[A - 1] = 3;
        m.v.C[A * 5] = 3;
        m.v.C[A * 5 - 1] = 3;
        m.v.C[A + 20] = 3;
      } },
    { baris: 760, jalan: function (m) { m.lanjutkan('A'); } },

    { baris: 770, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 7; m.v.A++) m.v.D[m.v.A] = m.baca();
      } },
    { baris: 780, jalan: function (m) {
        for (m.v.A = 6; m.v.A <= 18; m.v.A++) m.v.E[m.v.A] = m.baca();
      } },
    { baris: 790, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) m.v.A_[m.v.A] = m.baca();
      } },
    /* 800 T(1)=2:T(2)=1 — saklar giliran. */
    { baris: 800, jalan: function (m) { m.v.T_[1] = 2; m.v.T_[2] = 1; } },

    { baris: 810, jalan: function () { /* DATA 1,6,5,4,-1,-6,-5,-4 (arah) */ } },
    { baris: 820, jalan: function () { /* DATA 1,2,3,0,0,4,5,6,0,0,7,8,9 (E) */ } },
    { baris: 830, jalan: function () { /* DATA 6,7,8,11,12,13,16,17,18 (A) */ } },
    { baris: 840, jalan: function (m) { m.kembali(); } },
    { baris: 850, jalan: function () { /* REM * COMPUTER MOVE EVALUATION * */ } },

    /* --- 860-1340: otak komputer ------------------------------------------

       Tangga prioritas, dan urutannya yang membuat program ini tak
       terkalahkan:
         860-930   bisa MENANG sekarang?      (dua milik sendiri + satu kosong)
         940-1010  harus MENGHADANG?          (dua milik lawan + satu kosong)
         1020      ambil tengah
         1050-1240 tujuh pola sudut yang dihafal
         1250-1300 sudut mana pun, lalu kotak mana pun

       Dua gelung pertama bentuknya sama persis dan bedanya cuma angka 2
       versus 1. Itu tabel yang menyamar jadi dua salinan kode. */

    { baris: 860, jalan: function (m) { m.untuk('A', 6, 18, 1, 940); } },
    { baris: 870, jalan: function (m) { if (m.v.C[m.v.A] !== 2) m.lompat(930); } },
    { baris: 880, jalan: function (m) { m.untuk('B', 0, 7, 1, 930); } },
    { baris: 890, jalan: function (m) {
        var jauh = m.v.A + 2 * m.v.D[m.v.B];
        if (jauh < 6 || jauh > 18) m.lompat(920);
      } },
    { baris: 900, jalan: function (m) {
        var d = m.v.D[m.v.B];
        if (m.v.C[m.v.A + d] === 2 && m.v.C[m.v.A + d * 2] === 0) {
          m.v.N = m.v.A + d * 2; m.v.W = 1; m.lompat(1040);
        }
      } },
    { baris: 910, jalan: function (m) {
        var d = m.v.D[m.v.B];
        if (m.v.C[m.v.A + d] === 0 && m.v.C[m.v.A + d * 2] === 2) {
          m.v.N = m.v.A + d; m.v.W = 1; m.lompat(1040);
        }
      } },
    { baris: 920, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 930, jalan: function (m) { m.lanjutkan('A'); } },

    { baris: 940, jalan: function (m) { m.untuk('A', 6, 18, 1, 1020); } },
    { baris: 950, jalan: function (m) { if (m.v.C[m.v.A] !== 1) m.lompat(1010); } },
    { baris: 960, jalan: function (m) { m.untuk('B', 0, 7, 1, 1010); } },
    { baris: 970, jalan: function (m) {
        var jauh = m.v.A + 2 * m.v.D[m.v.B];
        if (jauh < 6 || jauh > 18) m.lompat(1000);
      } },
    { baris: 980, jalan: function (m) {
        var d = m.v.D[m.v.B];
        if (m.v.C[m.v.A + d] === 1 && m.v.C[m.v.A + d * 2] === 0) {
          m.v.N = m.v.A + d * 2; m.lompat(1040);
        }
      } },
    { baris: 990, jalan: function (m) {
        var d = m.v.D[m.v.B];
        if (m.v.C[m.v.A + d] === 0 && m.v.C[m.v.A + d * 2] === 1) {
          m.v.N = m.v.A + d; m.lompat(1040);
        }
      } },
    { baris: 1000, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 1010, jalan: function (m) { m.lanjutkan('A'); } },

    { baris: 1020, jalan: function (m) {
        if (m.v.C[12] === 0) { m.v.N = 12; m.lompat(1040); }
      } },
    { baris: 1030, jalan: function (m) { m.lompat(1050); } },
    /* 1040 N=E(N):T=2:GOTO 290 — indeks papan kembali jadi nomor kotak. */
    { baris: 1040, jalan: function (m) {
        m.v.N = m.v.E[m.v.N]; m.v.T = 2; m.lompat(290);
      } },

    pola(1050,  6, 1, 1100),
    pola(1060, 13, 1, 1080),
    kosong(1070, 8, 1040),
    pola(1080, 17, 1, 1100),
    kosong(1090, 16, 1040),
    pola(1100,  8, 1, 1150),
    pola(1110, 11, 1, 1130),
    kosong(1120, 6, 1040),
    pola(1130, 17, 1, 1150),
    kosong(1140, 18, 1040),
    pola(1150, 16, 1, 1200),
    pola(1160,  7, 1, 1180),
    kosong(1170, 6, 1040),
    pola(1180, 13, 1, 1200),
    kosong(1190, 18, 1040),
    pola(1200, 18, 1, 1250),
    /* 1210 IF C(11)<>1 THEN 1230 ELSE IF C(6)=2 THEN 1240 */
    { baris: 1210, jalan: function (m) {
        if (m.v.C[11] !== 1) m.lompat(1230);
        else if (m.v.C[6] === 2) m.lompat(1240);
      } },
    kosong(1220, 16, 1040),
    /* 1230 IF C(7)<>1 THEN 1250 ELSE IF C(6)=2 THEN IF C(16)=0 THEN N=16:GOTO 1040 */
    { baris: 1230, jalan: function (m) {
        if (m.v.C[7] !== 1) { m.lompat(1250); return; }
        if (m.v.C[6] === 2 && m.v.C[16] === 0) { m.v.N = 16; m.lompat(1040); }
      } },
    kosong(1240, 8, 1040),

    /* 1250 dua diagonal silang — jebakan klasik. Jawabannya: ambil sisi,
       bukan sudut. M=7 membuat gelung di 1310 mulai dari kotak sisi. */
    { baris: 1250, jalan: function (m) {
        var C = m.v.C;
        if ((C[6] === 1 && C[18] === 1) || (C[8] === 1 && C[16] === 1)) {
          m.v.M = 7; m.lompat(1310);
        }
      } },
    { baris: 1260, jalan: function (m) {
        var C = m.v.C;
        if (C[17] === 1 && C[13] === 1 && C[18] === 0) { m.v.N = 18; m.lompat(1040); }
      } },
    { baris: 1270, jalan: function (m) { m.untuk('A', 6, 18, 2, 1300); } },
    { baris: 1280, jalan: function (m) {
        if (m.v.C[m.v.A] === 0) { m.v.N = m.v.A; m.lompat(1040); }
      } },
    { baris: 1290, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 1300, jalan: function (m) { m.v.M = 6; } },
    { baris: 1310, jalan: function (m) { m.untuk('A', m.v.M, 18, 1, 1340); } },
    { baris: 1320, jalan: function (m) {
        if (m.v.C[m.v.A] === 0) { m.v.N = m.v.A; m.lompat(1040); }
      } },
    { baris: 1330, jalan: function (m) { m.lanjutkan('A'); } },
    /* 1340 RUN — tidak ada kotak kosong sama sekali. Menjalankan ulang seluruh
       program adalah jaring pengaman yang kasar, dan seharusnya tak terjangkau
       karena baris 160 sudah memeriksa papan penuh lebih dulu. */
    { baris: 1340, jalan: function (m) { m.jalankan(); } },

    /* --- 1350-1410: akhir permainan --------------------------------------- */

    { baris: 1350, jalan: function (m) { m.locate(22, 10); m.spc(69); m.barisBaru(); } },
    { baris: 1360, jalan: function (m) {
        m.locate(22, 35); m.warna(31, null);
        if (m.v.W === 1) { m.cetak('I Win !!!!'); m.lompat(1410); }
      } },
    { baris: 1370, jalan: function (m) {
        m.locate(22, 36); m.cetak('Tie Game'); m.barisBaru();
      } },
    { baris: 1380, jalan: function (m) {
        m.locate(23, 23); m.warna(15, 0);
        m.cetak('Would You Like To Play Again? <Y/N>');
        m.warna(3, 0);
      } },
    /* 1390 GOSUB 280:IF Z="Y" THEN RESTORE:W=0:GOSUB 330:GOTO 720 ELSE ... */
    { baris: 1390, bagian: [
        function (m) { m.gosub(280); },
        function (m) {
          var z = m.v.Z;
          if (z === 'Y' || z === 'y') { m.ulangData(); m.v.W = 0; m.gosub(330); }
          else if (z !== 'N' && z !== 'n') m.lompat(1390);
          else m.lompat(1400);
        },
        function (m) { m.lompat(720); }
      ] },
    { baris: 1400, jalan: function (m) { m.cls(); m.jalankan('menu'); } },
    /* 1410 fanfare kemenangan: lima pasang nada tinggi-rendah. Diam di sini. */
    { baris: 1410, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 5; m.v.A++) { m.suara(500, 1); m.suara(100, 1); }
        m.lompat(1380);
      } },

    /* --- 1420-1490: penangan F10 ------------------------------------------ */

    { baris: 1420, jalan: function (m) { m.jebakan(10, false); m.locate(25, 22); } },
    { baris: 1430, jalan: function (m) {
        m.warna(14, 0);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 1440, jalan: function (m) { m.gosub(280); } },
    { baris: 1450, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') m.lompat(1470);
      } },
    { baris: 1460, jalan: function (m) {
        if (m.v.Z !== 'Y' && m.v.Z !== 'y') m.lompat(1440); else m.lompat(1400);
      } },
    { baris: 1470, jalan: function (m) {
        m.locate(25, 1); m.spc(78); m.warna(0, 7);
      } },
    { baris: 1480, jalan: function (m) {
        m.locate(25, 24);
        m.cetak(' Strike <F10> To Leave This Game ');
      } },
    { baris: 1490, jalan: function (m) {
        m.v.Z = ''; m.warna(3, 0); m.jebakan(10, true); m.kembali();
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function b(kode, n) {
    var s = '', i;
    for (i = 0; i < n; i++) s += String.fromCharCode(kode);
    return s;
  }

  function garisPapan(nomor, baris) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 19);
      m.cetak(m.ulang(42, 219));
      m.barisBaru();
    } };
  }

  function nomorKotak(nomor, kolom, tambah) {
    return { baris: nomor, jalan: function (m) {
      m.locate(6 * m.v.A - 1, kolom);
      m.cetak(' ' + (m.v.B + tambah + m.v.A) + ' ');
      m.barisBaru();
    } };
  }

  function bidak(nomor, turun, gambar) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.A + turun, m.v.B);
      m.cetak(gambar);
      m.barisBaru();
    } };
  }

  function petunjuk(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom);
      m.cetak(isi);
      m.barisBaru();
    } };
  }

  /* `IF C(x)<>nilai THEN lompat` — bentuk yang berulang belasan kali di
     tangga pola sudut 1050-1240. */
  function pola(nomor, kotak, nilai, tujuan) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.C[kotak] !== nilai) m.lompat(tujuan);
    } };
  }

  /* `IF C(x)=0 THEN N=x:GOTO 1040` */
  function kosong(nomor, kotak, tujuan) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.C[kotak] === 0) { m.v.N = kotak; m.lompat(tujuan); }
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['TICTAC'] = {
    nama: 'TICTAC',
    judul: 'Tic Tac Toe',
    sumber: 'TICTAC',
    berkas: 'run/TICTAC.BAS',
    tabel: tabel,
    data: [1, 6, 5, 4, -1, -6, -5, -4,
           1, 2, 3, 0, 0, 4, 5, 6, 0, 0, 7, 8, 9,
           6, 7, 8, 11, 12, 13, 16, 17, 18],

    arsitektur: {
      judul: 'Alur TICTAC.BAS',
      simpul: [
        { id: 'siap', baris: '10-130', jenis: 'mulai',
          teks: ['Siapkan larik dan papan bertepi,', 'tawarkan petunjuk'] },
        { id: 'papan', baris: '330-480', jenis: 'subrutin',
          teks: ['Gambar kisi dan nomor kotak'] },
        { id: 'siapa', baris: '140-210', jenis: 'putusan',
          teks: ['Anda duluan?'] },
        { id: 'giliran', baris: '150', jenis: 'putusan',
          teks: ['Giliran siapa sekarang?', 'ON T(T) GOSUB'] },
        { id: 'pemain', baris: '220-270', jenis: 'subrutin',
          teks: ['Pemain mengetik nomor kotak', 'tolak kalau sudah terisi'] },
        { id: 'komputer', baris: '860-1340', jenis: 'subrutin',
          teks: ['Komputer memilih langkah', 'lewat tangga prioritas'] },
        { id: 'taruh', baris: '290-560',
          teks: ['Hitung posisi layar,', 'gambar X atau O'] },
        { id: 'penuh', baris: '160-170', jenis: 'putusan',
          teks: ['Papan penuh, atau', 'komputer sudah menang?'] },
        { id: 'akhir', baris: '1350-1410', jenis: 'keluar',
          teks: ['"I Win" atau "Tie Game",', 'lalu main lagi?'] }
      ],
      panah: [
        { dari: 'siap',    ke: 'papan',   label: 'GOTO 330' },
        { dari: 'papan',   ke: 'siapa',   label: 'RETURN' },
        { dari: 'siapa',   ke: 'giliran' },
        { dari: 'giliran', ke: 'pemain',  label: 'pemain' },
        { dari: 'giliran', ke: 'komputer', label: 'komputer' },
        { dari: 'pemain',  ke: 'taruh' },
        { dari: 'komputer', ke: 'taruh' },
        { dari: 'taruh',   ke: 'penuh',   label: 'RETURN' },
        { dari: 'penuh',   ke: 'giliran', label: 'belum selesai' },
        { dari: 'penuh',   ke: 'akhir',   label: 'selesai' },
        { dari: 'akhir',   ke: 'siap',    label: 'main lagi' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Giliran, dan saklar yang membaliknya',
        keterangan: 'Larik dua unsur <code>T(1)=2, T(2)=1</code> dipakai ' +
          'sebagai saklar. Baris 150 berbunyi <code>ON T(T) GOSUB 220,860</code>: ' +
          'giliran berikutnya selalu kebalikan yang barusan. Satu larik dua ' +
          'unsur menggantikan seluruh <code>IF</code> pergantian giliran.',
        simpul: [
          { id: 'pemain', baris: '150 → 220', jenis: 'mulai',
            teks: ['Giliran pemain', 'T = 1'] },
          { id: 'komputer', baris: '150 → 860', jenis: 'keadaan',
            teks: ['Giliran komputer', 'T = 2'] },
          { id: 'usai', baris: '1350', jenis: 'keluar',
            teks: ['Permainan selesai'] }
        ],
        panah: [
          { dari: 'pemain', ke: 'komputer', label: 'T(1) = 2 (baris 270, 800)' },
          { dari: 'komputer', ke: 'pemain', label: 'T(2) = 1 (baris 1040, 800)' },
          { dari: 'komputer', ke: 'usai', label: 'W = 1: komputer menang' },
          { dari: 'pemain', ke: 'usai', label: 'papan penuh: seri (160)' }
        ]
      },
      {
        judul: 'Tangga prioritas otak komputer',
        keterangan: 'Urutan inilah yang membuat komputer tak terkalahkan. ' +
          'Tiap anak tangga hanya dicoba kalau yang di atasnya gagal — dan ' +
          'yang paling atas selalu "menang sekarang kalau bisa".',
        simpul: [
          { id: 'menang', baris: '860-930', jenis: 'putusan',
            teks: ['Punya dua berderet', 'dan kotak ketiga kosong?'] },
          { id: 'hadang', baris: '940-1010', jenis: 'putusan',
            teks: ['Lawan punya dua berderet', 'dan kotak ketiga kosong?'] },
          { id: 'tengah', baris: '1020', jenis: 'putusan',
            teks: ['Kotak tengah masih kosong?'] },
          { id: 'hafal', baris: '1050-1260', jenis: 'putusan',
            teks: ['Cocok salah satu dari', 'tujuh pola sudut yang dihafal?'] },
          { id: 'sudut', baris: '1270-1290', jenis: 'putusan',
            teks: ['Ada sudut kosong?'] },
          { id: 'apapun', baris: '1300-1330',
            teks: ['Ambil kotak kosong pertama'] },
          { id: 'jalan', baris: '1040', jenis: 'keluar',
            teks: ['Langkah dipilih:', 'N = E(N), giliran berbalik'] }
        ],
        panah: [
          { dari: 'menang', ke: 'hadang', label: 'tidak' },
          { dari: 'hadang', ke: 'tengah', label: 'tidak' },
          { dari: 'tengah', ke: 'hafal',  label: 'tidak' },
          { dari: 'hafal',  ke: 'sudut',  label: 'tidak' },
          { dari: 'sudut',  ke: 'apapun', label: 'tidak' },
          { dari: 'apapun', ke: 'jalan' },
          { dari: 'menang', ke: 'jalan',  label: 'ya, W=1' },
          { dari: 'hadang', ke: 'jalan',  label: 'ya' },
          { dari: 'tengah', ke: 'jalan',  label: 'ya' },
          { dari: 'hafal',  ke: 'jalan',  label: 'ya' },
          { dari: 'sudut',  ke: 'jalan',  label: 'ya' }
        ]
      }
    ],

    pseudokode: [
      { baris: 120, tingkat: 0, teks: 'siapkan lima larik: papan, peta nomor&harr;indeks, arah, kolom' },
      { baris: 740, tingkat: 0, teks: '<b>isi seluruh tepi papan dengan angka 3</b> &mdash; lihat penjelasan' },
      { baris: 130, tingkat: 0, teks: 'tampilkan judul, tawarkan petunjuk, gambar kisi' },
      { baris: 180, tingkat: 0, teks: 'tanya: Anda duluan?' },
      { baris: 150, tingkat: 0, teks: '<b>ULANG:</b>' },
      { baris: 150, tingkat: 1, teks: 'panggil rutin giliran berikutnya &mdash; saklar <code>T()</code> yang memilih' },
      { baris: 220, tingkat: 2, teks: '<b>giliran pemain:</b> minta nomor kotak, tolak kalau sudah terisi' },
      { baris: 860, tingkat: 2, teks: '<b>giliran komputer:</b> turuni tangga prioritas' },
      { baris: 860, tingkat: 3, teks: 'bisa menang sekarang? ambil kotak itu, tandai <code>W=1</code>' },
      { baris: 940, tingkat: 3, teks: 'lawan bisa menang? hadang' },
      { baris: 1020, tingkat: 3, teks: 'tengah kosong? ambil' },
      { baris: 1050, tingkat: 3, teks: 'cocok salah satu dari tujuh pola sudut yang dihafal? ikuti' },
      { baris: 1270, tingkat: 3, teks: 'ada sudut kosong? ambil' },
      { baris: 1310, tingkat: 3, teks: 'kalau tidak: kotak kosong pertama' },
      { baris: 290, tingkat: 1, teks: 'hitung baris dan kolom layar dari nomor kotak' },
      { baris: 310, tingkat: 1, teks: 'catat pemiliknya di papan' },
      { baris: 320, tingkat: 1, teks: 'gambar X (merah) atau O (hijau)' },
      { baris: 160, tingkat: 1, teks: 'semua kotak terisi? <b>seri</b>' },
      { baris: 170, tingkat: 1, teks: 'komputer barusan menang? <b>umumkan</b>' },
      { baris: 1350, tingkat: 0, teks: '<b>SELESAI:</b> "I Win !!!!" atau "Tie Game"' },
      { baris: 1390, tingkat: 1, teks: 'main lagi? kembalikan penunjuk DATA, kosongkan papan, ulangi' },
      { baris: 1400, tingkat: 1, teks: 'tidak: kembali ke menu' }
    ],

    perintahAsli: 'run\\TICTAC.bat',
    catatanAsli: 'Di DOSBox-X fanfare kemenangan komputer benar-benar ' +
      'berbunyi &mdash; lima pasang nada tinggi-rendah &mdash; dan tulisan ' +
      '"I Win !!!!" berkedip.',

    penyimpangan: [
      '<b>Fanfare kemenangan tidak berbunyi</b> (baris 1410: lima pasang ' +
      '<code>SOUND 500,1</code> dan <code>SOUND 100,1</code>), dan tulisan ' +
      '"I Win !!!!" tidak berkedip (<code>COLOR 31</code> = putih terang + ' +
      'kedip). Keduanya alasan yang sama: penelusur ini tidak bersuara, dan ' +
      'kedip di halaman web mengganggu.',

      '<b>Jeda satu detik sesudah "Invalid Move" habis seketika</b> (baris ' +
      '250). Pasang titik henti di sana untuk membacanya.',

      '<b><code>DEFSTR Z</code> tidak ditiru.</b> Di BASIC ia menyatakan ' +
      'semua variabel berawalan Z bertipe teks; JavaScript tidak punya ' +
      'padanannya, dan tidak ada perilaku yang bergantung padanya.',

      '<b>Larik <code>A()</code> dan <code>B()</code> ditulis sebagai ' +
      '<code>A_</code> dan <code>B_</code> di dalam mesin.</b> BASIC ' +
      'membedakan variabel <code>A</code> dari larik <code>A()</code>; ' +
      'JavaScript tidak, dan program ini memakai keduanya sekaligus. ' +
      'Perbedaannya hanya nama di dalam porting; nomor barisnya tetap sama.'
    ],

    pelajaran: {
      ringkas: 'Lawan komputer yang pertama, dan ia benar-benar tak ' +
        'terkalahkan. Dua gagasan di dalamnya jauh lebih berharga daripada ' +
        'permainannya: papan bertepi sentinel, dan arah sebagai angka.',
      pelajari: [
        ['Papan bertepi sentinel',
         'Papan 3&times;3 disimpan sebagai kisi 5&times;5 (larik 25 kotak) ' +
         'dengan seluruh tepinya diisi angka 3 &mdash; angka yang tidak pernah ' +
         'dipakai pemain mana pun. Akibatnya pemeriksaan "tiga berderet" bisa ' +
         'melangkah ke segala arah <b>tanpa pernah menanyakan apakah sudah di ' +
         'pinggir</b>. Tepinya yang menjawab. Pola ini masih dipakai di mesin ' +
         'catur dan pencari jalan sampai hari ini.'],
        ['Arah sebagai angka',
         '<code>DATA 1,6,5,4,-1,-6,-5,-4</code> adalah delapan arah mata angin ' +
         'di kisi selebar lima. Bergerak satu langkah ke arah mana pun jadi ' +
         'satu penjumlahan, dan "periksa kedelapan arah" jadi gelung delapan ' +
         'putaran. Bandingkan dengan menulis delapan blok <code>IF</code> ' +
         'terpisah untuk atas, bawah, kiri, kanan, dan empat diagonal.'],
        ['Larik dua unsur sebagai saklar',
         '<code>T(1)=2 : T(2)=1</code>, lalu <code>ON T(T) GOSUB 220,860</code>. ' +
         'Giliran berikutnya selalu kebalikan yang barusan, tanpa satu pun ' +
         '<code>IF</code>. Tabel kecil menggantikan percabangan &mdash; sama ' +
         'seperti 21 <code>IF</code> di MENU.BAS yang sebenarnya sebuah tabel, ' +
         'tapi kali ini penulisnya sadar.'],
        ['Urutan prioritas adalah keseluruhan kecerdasannya',
         'Otak komputer tidak menelusuri pohon langkah. Ia cuma tangga: menang ' +
         'kalau bisa, hadang kalau harus, ambil tengah, ikuti pola hafalan, ' +
         'ambil sudut, ambil apa saja. Untuk permainan sekecil ini, urutan ' +
         'yang benar sudah cukup untuk tak terkalahkan.']
      ],
      hindari: [
        ['Satu huruf, dua pekerjaan',
         '<code>A</code> adalah pencacah gelung di belasan tempat, tapi di ' +
         'baris 290 ia mendadak jadi <b>baris layar</b>. <code>B</code> sama: ' +
         'pencacah, lalu kolom layar, lalu larik <code>B()</code>. Menelusuri ' +
         'program ini berarti terus-menerus bertanya "A yang mana ini?".'],
        ['Menggambar ulang yang tidak berubah',
         'Baris 350 menulis judul "TIC TAC TOE" di dalam gelung baris 340, ' +
         'jadi ia ditulis tujuh belas kali padahal tidak pernah berubah. ' +
         'Tidak terlihat karena hasilnya sama &mdash; dan itulah yang membuat ' +
         'kesalahan semacam ini bertahan lama.'],
        ['Tujuh pola sudut yang dihafal',
         'Baris 1050-1240 adalah dua puluh baris <code>IF</code> bersarang ' +
         'yang mengeja posisi papan satu per satu. Tidak ada satu pun ' +
         'komentar yang mengatakan pola apa yang sedang dikenali. Itu ' +
         'pengetahuan yang hilang begitu penulisnya lupa.'],
        ['<code>RUN</code> sebagai jaring pengaman',
         'Baris 1340 menjalankan ulang seluruh program kalau tidak ada kotak ' +
         'kosong yang ditemukan. Seharusnya tak terjangkau, karena baris 160 ' +
         'sudah memeriksa papan penuh lebih dulu. "Seharusnya tak terjangkau" ' +
         'yang tidak berbunyi apa-apa saat terjangkau adalah cacat yang ' +
         'menunggu.']
      ]
    },

    penjelasan: [
      { judul: 'Papan yang lebih besar dari papannya',
        isi: [
          'Cara paling wajar menyimpan papan tic-tac-toe adalah sembilan ' +
          'kotak. Program ini memakai <b>dua puluh lima</b>, dan itu bukan ' +
          'pemborosan &mdash; itu keputusan yang membuat sisanya sederhana.',
          'Kotak-kotaknya disusun sebagai kisi 5&times;5. Sembilan kotak main ' +
          'ada di tengah (indeks 6,7,8 / 11,12,13 / 16,17,18), dan enam belas ' +
          'kotak di sekelilingnya diisi angka <b>3</b> oleh baris 740-760 — ' +
          'angka yang tidak akan pernah jadi milik pemain (1) atau komputer (2).',
          'Sekarang lihat apa yang bisa dilakukan pemeriksa kemenangan di baris ' +
          '900: <code>IF C(A+D(B))=2 AND C(A+D(B)*2)=0</code>. Ia melangkah ' +
          'dua kotak ke suatu arah <b>tanpa pernah memeriksa apakah sudah ' +
          'keluar papan</b>. Kalau langkahnya jatuh di tepi, yang ditemukan ' +
          'angka 3, dan perbandingannya gagal dengan sendirinya.',
          'Tanpa tepi sentinel, tiap pemeriksaan butuh empat perbandingan ' +
          'tambahan (masih di dalam baris? masih di dalam kolom?) dikalikan ' +
          'delapan arah dikalikan sembilan kotak. Dengan tepi sentinel: nol.'
        ] },
      { judul: 'Delapan arah, delapan angka',
        isi: [
          'Di kisi selebar lima, bergerak satu kotak ke kanan berarti indeks ' +
          '+1. Ke bawah: +5. Ke bawah-kanan: +6. Ke bawah-kiri: +4. Dan empat ' +
          'kebalikannya negatifnya.',
          'Itulah isi <code>DATA 1,6,5,4,-1,-6,-5,-4</code> di baris 810. ' +
          'Delapan arah mata angin, sebagai delapan angka.',
          'Akibatnya "periksa kedelapan arah dari kotak A" jadi:',
          '<code>FOR B=0 TO 7 : … C(A+D(B)) … : NEXT</code>',
          'Bandingkan dengan delapan blok <code>IF</code> yang masing-masing ' +
          'menghitung tetangganya sendiri. Yang satu bisa diubah dengan ' +
          'menyunting satu baris DATA; yang lain harus disunting delapan kali ' +
          'dan salah satunya pasti terlewat.'
        ] },
      { judul: 'Baris 160, dan kalimat yang tidak tertulis',
        isi: [
          '<code>160 FOR A=6 TO 18:IF C(A)&lt;&gt;0 THEN NEXT:GOSUB 1350:GOTO 140</code>',
          'Baris ini berarti "kalau papan penuh, umumkan seri" — dan tidak ' +
          'satu pun kata di dalamnya mengatakan itu.',
          'Cara kerjanya bersandar pada aturan BASIC yang jarang disadari: ' +
          '<b>semua yang sesudah <code>THEN</code> hanya jalan kalau syaratnya ' +
          'benar</b>. Jadi selama kotaknya terisi, yang dijalankan cuma ' +
          '<code>NEXT</code> — gelung berputar. Begitu ketemu kotak kosong, ' +
          'syaratnya salah, <b>seluruh sisa baris dilewati</b>, dan alur jatuh ' +
          'ke baris 170. Kalau gelungnya habis tanpa pernah menemukan kotak ' +
          'kosong, barulah <code>GOSUB 1350</code> tercapai.',
          'Telusuri baris ini langkah demi langkah di penelusur dengan laju 2 ' +
          'baris/detik. Penunjuknya akan bolak-balik di dalam baris 160 ' +
          '(bagian 0 dan 1) selama papannya masih ada kotak kosong.'
        ] },
      { judul: 'Kenapa komputernya tak terkalahkan',
        isi: [
          'Ia tidak pintar. Ia tidak menelusuri kemungkinan langkah, tidak ' +
          'menilai posisi, tidak punya kedalaman pencarian. Ia cuma <b>tangga ' +
          'prioritas</b> yang urutannya benar:',
          '1. Menang sekarang kalau bisa. 2. Hadang kalau lawan bisa menang. ' +
          '3. Ambil tengah. 4. Ikuti salah satu dari tujuh pola sudut yang ' +
          'dihafal. 5. Ambil sudut mana pun. 6. Ambil kotak mana pun.',
          'Untuk tic-tac-toe, urutan itu cukup. Permainannya memang cukup ' +
          'kecil sehingga seluruh strategi optimalnya muat dalam enam aturan.',
          'Pelajarannya bukan "tangga prioritas selalu cukup" &mdash; untuk ' +
          'catur jelas tidak. Pelajarannya: <b>sebelum membangun mesin ' +
          'pencari, periksa dulu apakah masalahnya cukup kecil untuk ' +
          'diselesaikan dengan urutan aturan.</b> Sering kali iya, dan hasilnya ' +
          'seratus kali lebih mudah dibaca.'
        ] }
    ]
  };
})(window);
