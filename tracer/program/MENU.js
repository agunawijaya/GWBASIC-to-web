/* ===========================================================================
   MENU.js — porting minimalis MENU.BAS sebagai tabel baris.

   Aturan berkas ini, dan seluruh berkas sejenisnya:

   1. Satu entri per nomor baris di berkas .BAS. Tidak digabung, tidak dipecah.
   2. Urutan entri = urutan di berkas. Jatuh ke bawah harus benar sendirinya.
   3. Isi `jalan` menempuh langkah yang sama dengan pernyataan aslinya, dalam
      urutan yang sama. Kalau baris aslinya memanggil COLOR lalu PRINT lalu
      TAB, di sini juga begitu — supaya yang terlihat di layar saat baris itu
      disorot benar-benar akibat baris itu.
   4. Penyimpangan dari aslinya ditulis sebagai komentar di entri yang
      bersangkutan, dengan alasannya. Kalau alasannya selera, ditulis selera.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `CLEAR ,36000` (mengatur ruang string) tidak berbuat apa-apa di sini.
     JavaScript tidak punya batas ruang string yang perlu diatur.
   - `KEY OFF` tidak berbuat apa-apa: konsol ini tidak punya baris ke-25 berisi
     label tombol fungsi untuk disembunyikan.
   - `SCREEN 0,0,0` dan `WIDTH 80` tidak berbuat apa-apa: konsolnya memang
     sudah mode teks 80x25, satu-satunya mode yang ada.
   - `ON KEY(n)` dipasang dan menyala. Bedanya dengan aslinya hanya waktu
     penjemputan: penelusur memeriksa jebakan di batas baris, GW-BASIC di batas
     pernyataan.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    /* 10 CLEAR ,36000:KEY OFF:SCREEN 0,0,0:CLS:WIDTH 80:ON ERROR GOTO 520 */
    { baris: 10, jalan: function (m) {
        /* CLEAR juga mengosongkan semua variabel — di sini tidak ada yang
           perlu dikosongkan karena baris ini yang pertama jalan. */
        m.v = {};
        m.warna(7, 0);
        m.cls();
        m.penangkapGalat = 520;
      } },

    /* 20 GOSUB 500 */
    { baris: 20, jalan: function (m) { m.gosub(500); } },

    /* 70  CLS:DEF SEG:POKE 106,0 */
    { baris: 70, jalan: function (m) {
        m.cls();
        m.kosongkanPenyangga();
      } },

    /* 80  COLOR 3,0:LOCATE ,,0
       LOCATE tanpa dua argumen pertama = jangan pindahkan kursor, cuma
       matikan tampilannya. */
    { baris: 80, jalan: function (m) {
        m.warna(3, 0);
        m.locate(null, null, 0);
      } },

    /* 140 LOCATE 2,18:PRINT"Menu #1 - Programs Available On This Diskette" */
    { baris: 140, jalan: function (m) {
        m.locate(2, 18);
        m.cetak('Menu #1 - Programs Available On This Diskette');
        m.barisBaru();
      } },

    /* 150 LOCATE 4,5:COLOR 0,7:PRINT" A ";:COLOR 3,0:PRINT" Wildcatter"TAB(31);
           :COLOR 0,7:PRINT" H ";:COLOR 3,0:PRINT" Dominoes   "TAB(57);
           :COLOR 0,7:PRINT" O ";:COLOR 3,0:PRINT" You Draw It       "

       Tujuh baris berikutnya berbentuk sama persis: satu baris layar memuat
       tiga entri menu. `COLOR 0,7` membuat huruf pilihannya jadi blok terbalik
       (hitam di atas kelabu); `TAB(31)` dan `TAB(57)` yang menjajarkan
       kolomnya. Titik koma di ujung PRINT menahan kursor di tempat; PRINT
       terakhir tanpa titik koma yang menutup barisnya. */
    { baris: 150, jalan: function (m) {
        m.locate(4, 5);
        m.warna(0, 7); m.cetak(' A ');
        m.warna(3, 0); m.cetak(' Wildcatter'); m.tab(31);
        m.warna(0, 7); m.cetak(' H ');
        m.warna(3, 0); m.cetak(' Dominoes   '); m.tab(57);
        m.warna(0, 7); m.cetak(' O ');
        m.warna(3, 0); m.cetak(' You Draw It       '); m.barisBaru();
      } },

    /* 160 LOCATE 7,5: B Othello / I PC Golf / P Towers Of Atlantis */
    { baris: 160, jalan: function (m) {
        m.locate(7, 5);
        m.warna(0, 7); m.cetak(' B ');
        m.warna(3, 0); m.cetak(' Othello'); m.tab(31);
        m.warna(0, 7); m.cetak(' I ');
        m.warna(3, 0); m.cetak(' PC Golf  '); m.tab(57);
        m.warna(0, 7); m.cetak(' P ');
        m.warna(3, 0); m.cetak(' Towers Of Atlantis'); m.barisBaru();
      } },

    /* 170 LOCATE 10,5: C Peg Leap / J Head Coach / Q Personal Biorhythms */
    { baris: 170, jalan: function (m) {
        m.locate(10, 5);
        m.warna(0, 7); m.cetak(' C ');
        m.warna(3, 0); m.cetak(' Peg Leap '); m.tab(31);
        m.warna(0, 7); m.cetak(' J ');
        m.warna(3, 0); m.cetak(' Head Coach'); m.tab(57);
        m.warna(0, 7); m.cetak(' Q ');
        m.warna(3, 0); m.cetak(' Personal Biorhythms'); m.barisBaru();
      } },

    /* 180 LOCATE 13,5: D Blackjack / K Match / R Sports Predicting */
    { baris: 180, jalan: function (m) {
        m.locate(13, 5);
        m.warna(0, 7); m.cetak(' D ');
        m.warna(3, 0); m.cetak(' Blackjack'); m.tab(31);
        m.warna(0, 7); m.cetak(' K ');
        m.warna(3, 0); m.cetak(' Match        '); m.tab(57);
        m.warna(0, 7); m.cetak(' R ');
        m.warna(3, 0); m.cetak(' Sports Predicting'); m.barisBaru();
      } },

    /* 181 LOCATE 16,5: E Mastermind / L Nevada Dice / S Killer Maze */
    { baris: 181, jalan: function (m) {
        m.locate(16, 5);
        m.warna(0, 7); m.cetak(' E ');
        m.warna(3, 0); m.cetak(' Mastermind'); m.tab(31);
        m.warna(0, 7); m.cetak(' L ');
        m.warna(3, 0); m.cetak(' Nevada Dice  '); m.tab(57);
        m.warna(0, 7); m.cetak(' S ');
        m.warna(3, 0); m.cetak(' Killer Maze'); m.barisBaru();
      } },

    /* 182 LOCATE 19,5: F Sea Battle / M Eye & Hearing Test / T Boggy Marsh */
    { baris: 182, jalan: function (m) {
        m.locate(19, 5);
        m.warna(0, 7); m.cetak(' F ');
        m.warna(3, 0); m.cetak(' Sea Battle'); m.tab(31);
        m.warna(0, 7); m.cetak(' M ');
        m.warna(3, 0); m.cetak(' Eye & Hearing Test'); m.tab(57);
        m.warna(0, 7); m.cetak(' T ');
        m.warna(3, 0); m.cetak(' Boggy Marsh'); m.barisBaru();
      } },

    /* 183 LOCATE 22,5: G Hangman / N Tic Tac Toe / U Menu #2
       Perhatikan PRINT " U " di aslinya punya spasi tambahan sebelum tanda
       kutip — itu spasi pemisah milik BASIC, bukan bagian teksnya, jadi tidak
       ikut dicetak. */
    { baris: 183, jalan: function (m) {
        m.locate(22, 5);
        m.warna(0, 7); m.cetak(' G ');
        m.warna(3, 0); m.cetak(' Hangman'); m.tab(31);
        m.warna(0, 7); m.cetak(' N ');
        m.warna(3, 0); m.cetak(' Tic Tac Toe '); m.tab(57);
        m.warna(0, 7); m.cetak(' U ');
        m.warna(3, 0); m.cetak(' Menu #2'); m.barisBaru();
      } },

    /* 190 LOCATE 24,14:COLOR 15,0:PRINT"*****";:COLOR 3,0:
           PRINT" Strike Key Corresponding To Program Desired ";:
           COLOR 15,0:PRINT"*****":COLOR 3,0 */
    { baris: 190, jalan: function (m) {
        m.locate(24, 14);
        m.warna(15, 0); m.cetak('*****');
        m.warna(3, 0);  m.cetak(' Strike Key Corresponding To Program Desired ');
        m.warna(15, 0); m.cetak('*****'); m.barisBaru();
        m.warna(3, 0);
      } },

    /* 250 POKE 106,0
       Membuang tombol yang terlanjur ditekan selama menu digambar, supaya
       pilihan lama tidak ikut terbaca sebagai pilihan baru. */
    { baris: 250, jalan: function (m) { m.kosongkanPenyangga(); } },

    /* 260 R$=INKEY$:IF R$="" THEN 260

       Inilah gelung jajak. INKEY$ tidak pernah menunggu: ia mengembalikan
       tombol yang tersedia, atau string kosong kalau tidak ada. Kalau kosong,
       baris ini melompat ke dirinya sendiri dan mencobanya lagi — ribuan kali
       per detik di mesin aslinya.

       Penyimpangan: di sini gelungnya berputar secepat laju penelusuran, bukan
       secepat prosesor. Setelah beberapa putaran kosong penelusur menandainya
       "menunggu tombol" dan berhenti membakar langkah. Yang disorot tetap
       baris 260, karena di situlah program memang berada. */
    { baris: 260, jalan: function (m) {
        m.v['R$'] = m.inkey();
        if (m.v['R$'] === '') m.lompat(260);
      } },

    /* 270-383: dua puluh satu IF berturut-turut. Ini tabel tombol -> nama
       berkas yang ditulis sebagai rantai IF, karena BASIC tidak punya larik
       berindeks string. Tiap RUN memuat program lain dan membuang seluruh
       variabel — termasuk R$ yang baru saja dibaca. */
    { baris: 270, jalan: function (m) { if (cocok(m, 'A')) m.jalankan('WILDCAT'); } },
    { baris: 280, jalan: function (m) { if (cocok(m, 'B')) m.jalankan('OTHELLO'); } },
    { baris: 290, jalan: function (m) { if (cocok(m, 'C')) m.jalankan('PEGLEAP'); } },
    { baris: 300, jalan: function (m) { if (cocok(m, 'D')) m.jalankan('21'); } },
    { baris: 301, jalan: function (m) { if (cocok(m, 'E')) m.jalankan('MASTER'); } },
    { baris: 302, jalan: function (m) { if (cocok(m, 'F')) m.jalankan('SUB'); } },
    { baris: 303, jalan: function (m) { if (cocok(m, 'G')) m.jalankan('HANGMAN'); } },
    { baris: 310, jalan: function (m) { if (cocok(m, 'H')) m.jalankan('DOMINOES'); } },
    { baris: 320, jalan: function (m) { if (cocok(m, 'I')) m.jalankan('GOLF'); } },
    { baris: 330, jalan: function (m) { if (cocok(m, 'J')) m.jalankan('FOOTBALL'); } },
    { baris: 340, jalan: function (m) { if (cocok(m, 'K')) m.jalankan('MATCH'); } },
    { baris: 341, jalan: function (m) { if (cocok(m, 'L')) m.jalankan('CRAPS'); } },
    { baris: 342, jalan: function (m) { if (cocok(m, 'M')) m.jalankan('HEAREYE'); } },
    /* 343 menulis nama berkasnya huruf kecil: RUN"tictac". DOS tidak peduli
       besar-kecil huruf, jadi ini jalan — dan memperlihatkan bahwa penulisnya
       mengetik menu ini tanpa aturan yang ketat. */
    { baris: 343, jalan: function (m) { if (cocok(m, 'N')) m.jalankan('tictac'); } },
    { baris: 350, jalan: function (m) { if (cocok(m, 'O')) m.jalankan('DRAW'); } },
    { baris: 360, jalan: function (m) { if (cocok(m, 'P')) m.jalankan('TOWERS'); } },
    { baris: 370, jalan: function (m) { if (cocok(m, 'Q')) m.jalankan('BIO'); } },
    { baris: 380, jalan: function (m) { if (cocok(m, 'R')) m.jalankan('STATS'); } },
    { baris: 381, jalan: function (m) { if (cocok(m, 'S')) m.jalankan('MAZE'); } },
    { baris: 382, jalan: function (m) { if (cocok(m, 'T')) m.jalankan('BOGGY'); } },
    { baris: 383, jalan: function (m) { if (cocok(m, 'U')) m.jalankan('MENU2'); } },

    /* 390 GOTO 260
       Tombol yang tidak dikenali sampai di sini dan dibuang tanpa suara.
       Gelung utamanya: 260 -> 383 -> 260. */
    { baris: 390, jalan: function (m) { m.lompat(260); } },

    /* 500 FOR A=1 TO 10:ON KEY(A) GOSUB 510:KEY(A) ON:NEXT

       Seluruh gelung FOR muat dalam satu baris, jadi satu langkah penelusuran
       menjalankan kesepuluh putarannya. Bukan penyederhanaan: penyorotan
       memang per baris, dan baris ini memang satu baris. */
    { baris: 500, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) {
          m.pasangJebakan(m.v.A, 510);   /* ON KEY(A) GOSUB 510 */
          m.jebakan(m.v.A, true);        /* KEY(A) ON              */
        }
        /* A tertinggal bernilai 11 sesudah gelungnya habis, seperti di BASIC. */
      } },

    /* 510 RETURN

       Baris ini bekerja rangkap: ia penutup GOSUB 500 dari baris 20, sekaligus
       badan lengkap penangan ON KEY yang baru saja dipasang. Menekan F1..F10
       memanggilnya dan langsung kembali — jebakan yang sengaja dibuat tidak
       berbuat apa-apa, supaya tombol fungsi tidak mengacaukan menu. */
    { baris: 510, jalan: function (m) { m.kembali(); } },

    /* 520 IF ERR=53 THEN RUN"menu
       Galat 53 = File not found. Kalau pemakai memilih program yang tidak ada
       di disket, menu memuat ulang dirinya sendiri alih-alih mati.
       Perhatikan tanda kutip penutupnya memang tidak ada di berkas aslinya —
       GW-BASIC memperbolehkan string yang ditutup oleh ujung baris. */
    { baris: 520, jalan: function (m) { if (m.err === 53) m.jalankan('menu'); } },

    /* 530 ON ERROR GOTO 0
       Mematikan penangkap. Sesudah ini galat apa pun kembali menghentikan
       program dengan pesan — hanya kasus yang memang diantisipasi yang
       ditangani, sisanya tetap terlihat. */
    { baris: 530, jalan: function (m) { m.penangkapGalat = 0; } }
  ];

  /* Rantai IF di 270-383 selalu berbentuk `R$="X" OR R$="x"`. Ditulis sekali
     di sini supaya dua puluh satu barisnya tetap sependek aslinya dan
     perbedaan di antara mereka — huruf dan nama berkas — jadi kelihatan. */
  function cocok(m, huruf) {
    var r = m.v['R$'];
    return r === huruf || r === huruf.toLowerCase();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MENU'] = {
    nama: 'MENU',
    judul: 'Menu #1',
    sumber: 'MENU',
    berkas: 'run/MENU.BAS',
    tabel: tabel,

    /* Peta alur. Dari data ini dihasilkan DUA gambar: SVG di halaman dan
       sumber Mermaid di docs/menu.md. Satu sumber, jadi keduanya tidak
       mungkin bercerita hal yang berbeda. */
    arsitektur: {
      judul: 'Alur MENU.BAS',
      simpul: [
        { id: 'siap', baris: '10', jenis: 'mulai',
          teks: ['Siapkan layar 80x25', 'arahkan galat ke baris 520'] },
        { id: 'pasang', baris: '20 → 500-510', jenis: 'subrutin',
          teks: ['Pasang jebakan F1-F10', '(semuanya menuju RETURN)'] },
        { id: 'bersih', baris: '70-80',
          teks: ['Bersihkan layar, warna sian', 'sembunyikan kursor'] },
        { id: 'gambar', baris: '140-190',
          teks: ['Gambar 21 entri menu', 'dan baris bantuannya'] },
        { id: 'buang', baris: '250',
          teks: ['Buang tombol yang terlanjur', 'ditekan saat menggambar'] },
        { id: 'tunggu', baris: '260', jenis: 'putusan',
          teks: ['Ada tombol ditekan?'] },
        { id: 'cocok', baris: '270-383', jenis: 'putusan',
          teks: ['Tombolnya cocok dengan', 'salah satu dari 21 entri?'] },
        { id: 'ulang', baris: '390',
          teks: ['Tombol asing: abaikan'] },
        { id: 'muat', baris: '270-383', jenis: 'keluar',
          teks: ['RUN "nama"', 'variabel hilang, program berganti'] },
        { id: 'galat', baris: '520-530', jenis: 'galat',
          teks: ['Berkas tidak ada (ERR 53)?', 'muat ulang menu ini sendiri'] }
      ],
      panah: [
        { dari: 'siap',   ke: 'pasang', label: 'GOSUB 500' },
        { dari: 'pasang', ke: 'bersih', label: 'RETURN' },
        { dari: 'bersih', ke: 'gambar' },
        { dari: 'gambar', ke: 'buang' },
        { dari: 'buang',  ke: 'tunggu' },
        { dari: 'tunggu', ke: 'tunggu', label: 'belum' },
        { dari: 'tunggu', ke: 'cocok',  label: 'ya' },
        { dari: 'cocok',  ke: 'ulang',  label: 'tidak' },
        { dari: 'cocok',  ke: 'muat',   label: 'ya' },
        { dari: 'ulang',  ke: 'tunggu', label: 'GOTO 260' },
        { dari: 'muat',   ke: 'galat',  label: 'berkas hilang', jenis: 'galat' },
        { dari: 'galat',  ke: 'siap',   label: 'RUN "menu"', jenis: 'galat' }
      ]
    },

    pseudokode: [
      { baris: 10,  tingkat: 0, teks: 'siapkan layar teks 80&times;25, warnanya kelabu di atas hitam' },
      { baris: 10,  tingkat: 0, teks: 'kalau nanti ada galat, <b>lompat ke baris 520</b>' },
      { baris: 20,  tingkat: 0, teks: 'panggil subrutin pemasang jebakan tombol fungsi' },
      { baris: 500, tingkat: 1, teks: 'untuk n dari 1 sampai 10:' },
      { baris: 500, tingkat: 2, teks: 'kalau tombol F<i>n</i> ditekan, panggil baris 510' },
      { baris: 510, tingkat: 1, teks: 'baris 510 isinya cuma <b>pulang</b> &mdash; jebakan yang sengaja mandul' },
      { baris: 70,  tingkat: 0, teks: 'bersihkan layar, buang tombol yang tertunda' },
      { baris: 80,  tingkat: 0, teks: 'warna sian, sembunyikan kursor' },
      { baris: 140, tingkat: 0, teks: 'tulis judul di baris 2' },
      { baris: 150, tingkat: 0, teks: 'untuk tiap dari 7 baris menu:' },
      { baris: 150, tingkat: 1, teks: 'tulis 3 entri &mdash; hurufnya terbalik-warna, namanya sian' },
      { baris: 190, tingkat: 0, teks: 'tulis baris bantuan di baris 24' },
      { baris: 250, tingkat: 0, teks: 'buang tombol yang terlanjur ditekan selama menggambar' },
      { baris: 260, tingkat: 0, teks: '<b>ULANG selamanya:</b>' },
      { baris: 260, tingkat: 1, teks: 'tombol = tombol yang sedang ditekan (kosong kalau tidak ada)' },
      { baris: 260, tingkat: 1, teks: 'kalau kosong, <b>coba lagi dari awal gelung</b>' },
      { baris: 270, tingkat: 1, teks: 'kalau tombol = "A" atau "a": <b>muat program WILDCAT</b>, berhenti di sini' },
      { baris: 280, tingkat: 1, teks: 'kalau tombol = "B" atau "b": muat OTHELLO' },
      { baris: 383, tingkat: 1, teks: '&hellip; dan seterusnya, 21 kali sampai "U" untuk MENU2' },
      { baris: 390, tingkat: 1, teks: 'tombol tidak dikenal &mdash; abaikan, ulangi gelung' },
      { baris: 520, tingkat: 0, teks: '<b>KALAU ADA GALAT</b> (dari mana pun):' },
      { baris: 520, tingkat: 1, teks: 'kalau galatnya 53 (berkas tidak ada): <b>muat ulang menu ini sendiri</b>' },
      { baris: 530, tingkat: 1, teks: 'galat lain: matikan penangkap, biarkan terlihat' }
    ],

    penjelasan: [
      { judul: 'Dua bagian, itu saja',
        isi: [
          'Program sepanjang apa pun biasanya bisa diringkas jadi beberapa ' +
          'kalimat. Yang ini cuma dua: <b>menggambar menu</b> (baris 140&ndash;190), ' +
          'lalu <b>menunggu tombol dan memuat program yang sesuai</b> (baris ' +
          '260&ndash;390). Sisanya persiapan dan penanganan galat.',
          'Kalau Anda baru mulai membaca program orang lain, carilah dua hal ' +
          'ini dulu: mana bagian yang <i>menyiapkan</i>, dan mana bagian yang ' +
          '<i>berulang</i>. Di peta alur di samping, bagian yang berulang ' +
          'terlihat sebagai panah yang kembali ke atas.'
        ] },
      { judul: 'Kenapa gelungnya melompat ke dirinya sendiri',
        isi: [
          'Baris 260 berbunyi <code>R$=INKEY$:IF R$="" THEN 260</code>. ' +
          'Perintah <code>INKEY$</code> menanyakan "ada tombol yang sedang ' +
          'ditekan?" dan langsung menjawab &mdash; ia <b>tidak pernah menunggu</b>. ' +
          'Kalau jawabannya kosong, baris itu menyuruh dirinya sendiri dicoba ' +
          'lagi.',
          'Di BASIC, "menunggu" bukan satu perintah. Ia gelung yang Anda tulis ' +
          'sendiri. Bahasa modern menyembunyikan gelung ini di dalam ' +
          '<code>input()</code> atau <code>await</code>, tapi di lapisan paling ' +
          'bawah ia tetap ada &mdash; program tetap harus bertanya berulang kali.',
          'Turunkan laju penelusuran ke 1 baris/detik dan tekan Jalan: Anda ' +
          'akan melihat sorotan berdiam di baris 260, berputar di tempat, ' +
          'sampai Anda menekan tombol.'
        ] },
      { judul: 'Dua puluh satu IF yang sebenarnya sebuah tabel',
        isi: [
          'Baris 270&ndash;383 adalah dua puluh satu <code>IF</code> yang bentuknya ' +
          'sama persis; yang berbeda cuma hurufnya dan nama berkasnya. Itu ' +
          'ciri khas <b>tabel yang menyamar jadi percabangan</b>.',
          'BASIC 1982 tidak punya kamus atau larik berindeks teks, jadi rantai ' +
          '<code>IF</code> memang jalan yang tersedia. Dalam bahasa sekarang ' +
          'Anda akan menulisnya sebagai satu kamus: ' +
          '<code>{"A": "WILDCAT", "B": "OTHELLO", ...}</code> lalu satu baris ' +
          'pencarian. Dua puluh satu baris jadi tiga.',
          'Latihan mengenali pola ini berguna seumur hidup: begitu Anda melihat ' +
          'beberapa cabang yang bentuknya identik dan isinya cuma beda nilai, ' +
          'yang Anda lihat adalah data yang tertulis sebagai kode.'
        ] },
      { judul: 'Menangani satu galat, melepaskan sisanya',
        isi: [
          'Baris 520 hanya mengurus galat nomor 53 &mdash; "berkas tidak ' +
          'ditemukan" &mdash; dengan memuat ulang menu. Lalu baris 530 mematikan ' +
          'penangkapnya, sehingga galat jenis lain kembali terlihat.',
          'Itu urutan yang benar, dan lebih sering salah daripada benar di ' +
          'program pemula. Menangkap <i>semua</i> galat memang membuat program ' +
          'tidak pernah mati &mdash; tapi juga membuat Anda buta terhadap cacat ' +
          'yang belum Anda ketahui. Bandingkan dengan INTRO.BAS di penelusur ' +
          'ini, yang mengarahkan semua galat ke satu pintu keluar.'
        ] }
    ],

    perintahAsli: 'run\\MENU.bat',
    catatanAsli: 'Berkas .bat itu memanggil DOSBox-X dengan profil ' +
      'dosbox-games.conf (IBM PC, CGA, 4,77 MHz), memasang run\\ sebagai ' +
      'drive C:, lalu menjalankan GW MENU.BAS. Bandingkan kecepatan gelung ' +
      'INKEY$-nya: di sana ribuan putaran per detik, di sini sepelan yang ' +
      'Anda pilih.',

    /* Ditampilkan di halaman, bukan disimpan di komentar saja. Setiap kali
       yang dijalankan berbeda dari aslinya, pembacanya berhak tahu di mana. */
    penyimpangan: [
      '<b>Gelung INKEY$ berputar sepelan penelusurannya.</b> Baris 260 di ' +
      'mesin aslinya menjajak papan ketik ribuan kali per detik. Di sini ia ' +
      'berputar secepat laju yang Anda pilih, lalu penelusur menandainya ' +
      '"tunggu" dan berhenti membakar langkah. Yang disorot tetap baris 260, ' +
      'karena di situlah program memang berada.',

      '<b><code>CLEAR ,36000</code>, <code>KEY OFF</code>, ' +
      '<code>SCREEN 0,0,0</code>, dan <code>WIDTH 80</code> tidak berbuat ' +
      'apa-apa.</b> Keempatnya mengatur hal yang di sini tidak ada: ruang ' +
      'string yang tak terbatas, baris label tombol fungsi yang tak pernah ' +
      'digambar, dan satu-satunya mode layar yang tersedia.',

      '<b>Jebakan <code>ON KEY(1..10)</code> menyala dan bisa dicoba:</b> ' +
      'tekan F1 sampai F10, penunjuk melompat ke baris 510 lalu langsung ' +
      'pulang. Jebakan yang sengaja tidak berbuat apa-apa, supaya tombol ' +
      'fungsi tidak mengacaukan menu. Bedanya dengan aslinya cuma waktu ' +
      'penjemputannya: di sini di batas baris penelusuran, di sana di batas ' +
      'pernyataan.',

      '<b>Kedip tidak ditiru.</b> Atribut latar 8-15 dilipat ke 0-7. Tidak ' +
      'satu pun program dalam cakupan memakainya, dan kedip di halaman web ' +
      'mengganggu — ini alasan selera, dinyatakan sebagai selera.',

      '<b>Tombolnya benar-benar membawa ke programnya</b>, tapi lewat dua ' +
      'jalan berbeda. Program yang sudah punya tabel baris ' +
      '(<code>INTRO</code>, <code>CHECK</code>, <code>TOWERS</code>) ' +
      'ditelusuri di halaman ini juga. Sisanya membuka <b>port lengkapnya</b> ' +
      'di <code>web/games/</code> — bukan penelusuran baris, melainkan ' +
      'permainannya yang sudah jadi. Sama seperti <code>RUN</code> yang asli, ' +
      'tidak ada jalan kembali kecuali lewat pintu yang disediakan program baru itu.'
    ],

    /* Kotak penjelasan di bawah layar. Tetap — satu teks untuk seluruh
       program, tidak berubah mengikuti baris yang disorot. Isinya diringkas
       dari reviews/MENU.md, bagian "Yang bisa dipelajari" dan "Yang jangan
       ditiru". */
    pelajaran: {
      ringkas: 'Empat puluh satu baris, dan berkas paling penting di seluruh ' +
        'disket. Isinya cuma dua hal: menggambar menu, lalu memetakan tombol ' +
        'ke nama berkas.',
      pelajari: [
        ['Tangani galat yang spesifik, lalu lepaskan sisanya',
         'Baris 520 hanya menangani ERR=53 (berkas tidak ada) dengan memuat ' +
         'ulang menu; baris 530 mematikan penangkapnya. Galat lain tetap ' +
         'terlihat. Menelan semua galat adalah cara paling rapi untuk ' +
         'menyembunyikan cacat dari diri sendiri.'],
        ['INKEY$ tidak menunggu',
         'Baris 260 membaca tombol dan melompat ke dirinya sendiri kalau ' +
         'belum ada. Menunggu di BASIC bukan satu perintah, melainkan gelung ' +
         'yang Anda tulis sendiri.'],
        ['Baca menunya lebih dulu',
         'Kalau ingin memahami sebuah koleksi program, menu adalah petanya: ' +
         'nama berkas, urutan, dan apa yang penulisnya anggap satu keluarga.'],
        ['RUN membuang semua variabel',
         'Tiap RUN di baris 270-383 memuat program lain dari nol. Tidak ada ' +
         'yang bisa dititipkan lewat variabel — kalau perlu, harus lewat ' +
         'berkas. Layarnya justru tidak dibersihkan.']
      ],
      hindari: [
        ['Dua puluh satu IF sebagai pengganti tabel',
         'Baris 270-383 adalah tabel tombol->berkas yang menyamar jadi ' +
         'percabangan. Di sini masih bisa dimengerti — orang non-pemrogram ' +
         'bisa menyuntingnya — tapi kenali bentuknya: begitu barisnya ' +
         'bertambah, DATA+READ jauh lebih murah.'],
        ['POKE ke alamat ajaib',
         'POKE 106,0 mengosongkan penyangga papan ketik dengan menulis ' +
         'langsung ke perut penafsirnya. Jalan di GW-BASIC, dan hanya di sana.']
      ]
    }
  };
})(window);
