/* ===========================================================================
   INTRO.js — porting minimalis INTRO.BAS sebagai tabel baris.

   Program kedua yang ditelusuri, dan ia dipilih karena menuntut tiga hal yang
   MENU.BAS tidak menuntut apa-apa:

     1. Glif CP437. `CHR$(196)` bukan "karakter 196 dalam Unicode", melainkan
        garis mendatar di ROM font kartu CGA. Tanpa tabel pemetaan, kotak di
        baris 60-80 keluar sebagai huruf beraksen acak.
     2. Jebakan tombol fungsi yang BENAR-BENAR menyala. Di MENU.BAS kesepuluh
        jebakannya hanya menuju RETURN; di sini F10 menuju baris 200 yang
        memuat program lain — jadi jebakan itu punya akibat yang terlihat.
     3. `STRING$(n, kode)` dan `SPC(n)` sebagai bagian dari PRINT.

   Aturan penulisannya sama seperti MENU.js: satu entri per nomor baris, urutan
   entri = urutan berkas, tiap penyimpangan diberi alasan tertulis.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `KEY OFF`, `SCREEN 0,0,0`, dan `WIDTH 80` tidak berbuat apa-apa; konsolnya
     memang sudah mode teks 80x25 tanpa baris label tombol fungsi.
     Satu akibat yang perlu disadari: karena `KEY OFF` di aslinya yang
     MEMBEBASKAN baris 25, dan di sini baris 25 memang selalu bebas, hasil
     akhirnya kebetulan sama. Baris 150 tetap bisa menulis di sana.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    /* 10 KEY OFF */
    { baris: 10, jalan: function (m) {
        /* Menyembunyikan baris label tombol fungsi. Di sini baris 25 memang
           tidak pernah dipakai untuk itu, jadi tidak ada yang berubah — tapi
           baris ini yang membuat baris 150 punya tempat menulis. */
      } },

    /* 20  SCREEN 0,0,0:WIDTH 80:CLS:DEF SEG:POKE 106,0 */
    { baris: 20, jalan: function (m) {
        m.warna(7, 0);
        m.cls();
        m.kosongkanPenyangga();
      } },

    /* 30  ON KEY(10) GOSUB 200 */
    { baris: 30, jalan: function (m) { m.pasangJebakan(10, 200); } },

    /* 40  KEY(10) ON
       Memasang penangan dan menyalakannya adalah dua perintah terpisah.
       Di antara baris 30 dan 40 jebakannya sudah punya alamat tapi belum
       aktif — celah yang nyata, walau di sini cuma selebar satu baris. */
    { baris: 40, jalan: function (m) { m.jebakan(10, true); } },

    /* 41 ON ERROR GOTO 200

       Baris ini dan baris 30 menunjuk tempat yang SAMA. Apa pun yang terjadi —
       pemakai menekan F10, atau ada galat tak terduga — hasilnya identik:
       kembali ke menu dengan tenang. Bandingkan MENU.BAS yang menangani ERR=53
       secara khusus lalu melepaskan sisanya. */
    { baris: 41, jalan: function (m) { m.penangkapGalat = 200; } },

    /* 50  COLOR 11,0 */
    { baris: 50, jalan: function (m) { m.warna(11, 0); } },

    /* 60  LOCATE 1,19:PRINT CHR$(218) STRING$(42,196) CHR$(191)
       Sudut kiri-atas, 42 garis mendatar, sudut kanan-atas. */
    { baris: 60, jalan: function (m) {
        m.locate(1, 19);
        m.cetak(m.chr(218) + m.ulang(42, 196) + m.chr(191));
        m.barisBaru();
      } },

    /* 70  LOCATE 3,19: sudut bawah kiri, 42 garis, sudut bawah kanan.
       Perhatikan urutannya: baris 1, lalu baris 3, baru baris 2. Kotaknya
       digambar dari luar ke dalam. */
    { baris: 70, jalan: function (m) {
        m.locate(3, 19);
        m.cetak(m.chr(192) + m.ulang(42, 196) + m.chr(217));
        m.barisBaru();
      } },

    /* 80  LOCATE 2,19:PRINT CHR$(179) SPC(42) CHR$(179)
       SPC(42) mencetak 42 spasi — beda dari TAB(42) yang menuju kolom 42. */
    { baris: 80, jalan: function (m) {
        m.locate(2, 19);
        m.cetak(m.chr(179));
        m.spc(42);
        m.cetak(m.chr(179));
        m.barisBaru();
      } },

    /* 90  COLOR 0,7 */
    { baris: 90, jalan: function (m) { m.warna(0, 7); } },

    /* 100 LOCATE 2,29:PRINT CHR$(255) "F R I E N D L Y W A R E" CHR$(255)
       CHR$(255) di CP437 adalah spasi kosong. Dipakai sebagai bantalan supaya
       blok terbaliknya punya satu kolom lega di kiri dan kanan judul. */
    { baris: 100, jalan: function (m) {
        m.locate(2, 29);
        m.cetak(m.chr(255) + 'F R I E N D L Y W A R E' + m.chr(255));
        m.barisBaru();
      } },

    /* 110 LOCATE 7,26:COLOR 7,0:PRINT"   Introduction To Computers" */
    { baris: 110, jalan: function (m) {
        m.locate(7, 26);
        m.warna(7, 0);
        m.cetak('   Introduction To Computers');
        m.barisBaru();
      } },

    /* 120 LOCATE 11,29:COLOR 0,7:PRINT " 1 ";:COLOR 3,0:PRINT"   Information" */
    { baris: 120, jalan: function (m) {
        m.locate(11, 29);
        m.warna(0, 7); m.cetak(' 1 ');
        m.warna(3, 0); m.cetak('   Information'); m.barisBaru();
      } },

    /* 130 LOCATE 13,29: entri 2. Tanda kutip penutupnya tidak ada di berkas
       aslinya — GW-BASIC memperbolehkan string ditutup oleh ujung baris. */
    { baris: 130, jalan: function (m) {
        m.locate(13, 29);
        m.warna(0, 7); m.cetak(' 2 ');
        m.warna(3, 0); m.cetak('   Anatomy of a Program'); m.barisBaru();
      } },

    /* 135 LOCATE 15,29: entri 3. Nomornya 135, bukan 140 — disisipkan
       belakangan di antara dua baris yang sudah ada. */
    { baris: 135, jalan: function (m) {
        m.locate(15, 29);
        m.warna(0, 7); m.cetak(' 3 ');
        m.warna(3, 0); m.cetak('   Helpful Commands'); m.barisBaru();
      } },

    /* 140 LOCATE 19,14: baris bantuan, sama persis dengan baris 190 MENU.BAS.
       Keduanya lahir dari templat yang sama. */
    { baris: 140, jalan: function (m) {
        m.locate(19, 14);
        m.warna(15, 0); m.cetak('*****');
        m.warna(3, 0);  m.cetak(' Strike Key Corresponding To Program Desired ');
        m.warna(15, 0); m.cetak('*****'); m.barisBaru();
        m.warna(3, 0);
      } },

    /* 150 LOCATE 25,23:COLOR 0,7:PRINT" Strike <F10> To Leave This Program ";
       Titik koma di ujungnya bukan gaya penulisan: tanpa itu, PRINT akan
       menutup baris 25 dan seluruh layar tergulung satu baris ke atas. */
    { baris: 150, jalan: function (m) {
        m.locate(25, 23);
        m.warna(0, 7);
        m.cetak(' Strike <F10> To Leave This Program ');
        m.warna(3, 0);
      } },

    /* 160 RESP$=INKEY$:IF RESP$="" THEN 160 — gelung jajak, sama seperti
       baris 260 MENU.BAS. */
    { baris: 160, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(160);
      } },

    /* 170-185: tiga IF. Ketiga berkas tujuannya ada di run/, tapi ketiganya di
       luar cakupan penelusur ini, jadi memilihnya akan berhenti dengan pesan
       yang menyebut alasannya. */
    { baris: 170, jalan: function (m) { if (m.v['RESP$'] === '1') m.jalankan('HISTORY'); } },
    { baris: 180, jalan: function (m) { if (m.v['RESP$'] === '2') m.jalankan('anatomy'); } },
    { baris: 185, jalan: function (m) { if (m.v['RESP$'] === '3') m.jalankan('HINTS'); } },

    /* 190 GOTO 160 */
    { baris: 190, jalan: function (m) { m.lompat(160); } },

    /* 200 RUN"menu

       Baris ini adalah tujuan DUA jalur sekaligus: jebakan F10 dari baris 30
       (lewat GOSUB) dan penangkap galat dari baris 41. Yang menarik: ia
       dimasuki lewat GOSUB tapi tidak pernah RETURN, karena RUN membuang
       seluruh program berikut tumpukannya. GOSUB yang tidak pernah pulang —
       dan tidak apa-apa, karena tidak ada lagi yang menunggunya. */
    { baris: 200, jalan: function (m) { m.jalankan('menu'); } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['INTRO'] = {
    nama: 'INTRO',
    judul: 'Introduction To Computers',
    sumber: 'INTRO',
    berkas: 'run/INTRO.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur INTRO.BAS',
      simpul: [
        { id: 'siap', baris: '10-20', jenis: 'mulai',
          teks: ['Siapkan layar 80x25', 'buang tombol tertunda'] },
        { id: 'jebak', baris: '30-41',
          teks: ['F10 menuju baris 200', 'SEMUA galat juga ke baris 200'] },
        { id: 'kotak', baris: '50-100',
          teks: ['Gambar kotak dan judul', 'FRIENDLYWARE'] },
        { id: 'daftar', baris: '110-150',
          teks: ['Tulis 3 pilihan', 'dan dua baris bantuan'] },
        { id: 'tunggu', baris: '160', jenis: 'putusan',
          teks: ['Ada tombol ditekan?'] },
        { id: 'cocok', baris: '170-185', jenis: 'putusan',
          teks: ['Tombolnya 1, 2, atau 3?'] },
        { id: 'ulang', baris: '190',
          teks: ['Tombol asing: abaikan'] },
        { id: 'muat', baris: '170-185', jenis: 'keluar',
          teks: ['RUN "HISTORY" / "anatomy" / "HINTS"'] },
        { id: 'keluar', baris: '200', jenis: 'keluar',
          teks: ['RUN "menu"', 'satu pintu keluar untuk semua'] }
      ],
      panah: [
        { dari: 'siap',   ke: 'jebak' },
        { dari: 'jebak',  ke: 'kotak' },
        { dari: 'kotak',  ke: 'daftar' },
        { dari: 'daftar', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'tunggu', label: 'belum' },
        { dari: 'tunggu', ke: 'cocok',  label: 'ya' },
        { dari: 'cocok',  ke: 'ulang',  label: 'tidak' },
        { dari: 'cocok',  ke: 'muat',   label: 'ya' },
        { dari: 'ulang',  ke: 'tunggu', label: 'GOTO 160' },
        { dari: 'jebak',  ke: 'keluar', label: 'F10 / galat', jenis: 'galat' }
      ]
    },

    pseudokode: [
      { baris: 10,  tingkat: 0, teks: 'sembunyikan baris label tombol fungsi' },
      { baris: 20,  tingkat: 0, teks: 'siapkan layar teks 80&times;25, buang tombol yang tertunda' },
      { baris: 30,  tingkat: 0, teks: 'kalau F10 ditekan, <b>panggil baris 200</b>' },
      { baris: 40,  tingkat: 0, teks: 'nyalakan jebakan F10 &mdash; memasang dan menyalakan itu dua hal terpisah' },
      { baris: 41,  tingkat: 0, teks: 'kalau ada galat apa pun, <b>juga lompat ke baris 200</b>' },
      { baris: 60,  tingkat: 0, teks: 'gambar sisi atas kotak: sudut + 42 garis + sudut' },
      { baris: 70,  tingkat: 0, teks: 'gambar sisi bawah kotak' },
      { baris: 80,  tingkat: 0, teks: 'gambar sisi kiri dan kanan &mdash; kotaknya digambar dari luar ke dalam' },
      { baris: 100, tingkat: 0, teks: 'tulis "FRIENDLYWARE" terbalik-warna di dalam kotak' },
      { baris: 110, tingkat: 0, teks: 'tulis "Introduction To Computers"' },
      { baris: 120, tingkat: 0, teks: 'tulis pilihan 1, 2, dan 3' },
      { baris: 150, tingkat: 0, teks: 'tulis "Strike &lt;F10&gt; To Leave" di baris 25 (tanpa turun baris!)' },
      { baris: 160, tingkat: 0, teks: '<b>ULANG selamanya:</b>' },
      { baris: 160, tingkat: 1, teks: 'tombol = tombol yang sedang ditekan' },
      { baris: 160, tingkat: 1, teks: 'kalau kosong, coba lagi dari awal gelung' },
      { baris: 170, tingkat: 1, teks: 'kalau "1": muat program HISTORY' },
      { baris: 180, tingkat: 1, teks: 'kalau "2": muat ANATOMY' },
      { baris: 185, tingkat: 1, teks: 'kalau "3": muat HINTS' },
      { baris: 190, tingkat: 1, teks: 'tombol lain &mdash; abaikan, ulangi gelung' },
      { baris: 200, tingkat: 0, teks: '<b>PINTU KELUAR</b> (dipakai F10 dan semua galat):' },
      { baris: 200, tingkat: 1, teks: 'muat program menu &mdash; tidak pernah kembali ke sini' }
    ],

    penjelasan: [
      { judul: 'Program terpendek adalah pintu masuk terbaik',
        isi: [
          'Dua puluh tiga baris. Baris 10&ndash;90 di program ini <b>identik</b> ' +
          'dengan HEAREYE.BAS &mdash; keduanya lahir dari templat yang sama, ' +
          'disalin lalu diubah bagian tengahnya.',
          'Kalau Anda menghadapi kumpulan program yang ditulis satu tim, ' +
          'carilah yang paling pendek dan pelajari itu lebih dulu. Ia biasanya ' +
          'memperlihatkan kerangka bersamanya tanpa tertutup logika permainan. ' +
          'Sekali mengerti kerangka ini, dua puluh program lain terbaca jauh ' +
          'lebih cepat.'
        ] },
      { judul: 'Dua jalur, satu pintu keluar',
        isi: [
          'Perhatikan peta alur: ada dua panah merah putus-putus yang menuju ' +
          'kotak yang sama. Baris 30 mengarahkan tombol F10 ke baris 200, dan ' +
          'baris 41 mengarahkan <b>semua galat</b> ke baris 200 juga.',
          'Jadi apa pun yang terjadi &mdash; pemakai menekan F10, atau ada cacat ' +
          'tak terduga di baris mana pun &mdash; hasilnya identik: kembali ke ' +
          'menu dengan tenang.',
          'Itu keputusan produk, bukan kemalasan. Program ini dijual ke orang ' +
          'yang baru pertama kali memegang komputer pada 1982. Menampilkan ' +
          '<code>Syntax error in 170</code> lalu meninggalkan mereka di prompt ' +
          '<code>Ok</code> jauh lebih buruk daripada diam-diam kembali ke menu.'
        ] },
      { judul: 'Tapi jangan tiru ini di program Anda sendiri',
        isi: [
          'Menelan semua galat itu anggun bagi pemakai dan <b>buta total bagi ' +
          'pembuatnya</b>. Kalau ada salah ketik di baris 100, program ini akan ' +
          'kembali ke menu seolah tidak terjadi apa-apa &mdash; selamanya, tanpa ' +
          'satu pun catatan.',
          'Bandingkan dengan MENU.BAS di penelusur ini, yang menangani satu ' +
          'galat spesifik lalu melepaskan sisanya. Aturan praktisnya: ' +
          '<b>tangani galat yang Anda antisipasi, dan biarkan yang tidak Anda ' +
          'antisipasi terlihat</b> &mdash; atau setidaknya tercatat di suatu ' +
          'tempat yang Anda baca.'
        ] },
      { judul: 'Memasang dan menyalakan adalah dua hal',
        isi: [
          'Baris 30 (<code>ON KEY(10) GOSUB 200</code>) memberi <i>alamat</i>: ' +
          'kalau F10 ditekan, ke mana harus pergi. Baris 40 ' +
          '(<code>KEY(10) ON</code>) yang <i>menghidupkan</i> jebakannya.',
          'Di antara kedua baris itu ada celah nyata: jebakannya sudah punya ' +
          'alamat tapi belum aktif. Di sini celahnya cuma selebar satu baris, ' +
          'jadi tidak jadi masalah. Tapi pola "daftarkan dulu, aktifkan ' +
          'kemudian" ada di mana-mana &mdash; pendengar kejadian, langganan, ' +
          'sinyal &mdash; dan celah di antaranya adalah tempat cacat berumah.'
        ] }
    ],

    perintahAsli: 'run\\INTRO.bat',
    catatanAsli: 'Program terpendek di rangkaian Friendlyware, dan baris ' +
      '10-90 identik dengan HEAREYE.BAS — keduanya lahir dari templat yang ' +
      'sama. Di DOSBox-X, tekan F10 untuk melihat jalur keluarnya.',

    penyimpangan: [
      '<b>Jebakan F10 dijemput di batas baris, bukan batas pernyataan.</b> ' +
      'GW-BASIC memeriksa jebakan di antara pernyataan; penelusur ini di ' +
      'antara baris. Bedanya terlihat pada baris yang memuat banyak ' +
      'pernyataan: di sana tombol fungsi tertunda sampai barisnya habis.',

      '<b>Ketiga pilihan menu berhenti, bukan berjalan.</b> ' +
      '<code>HISTORY.BAS</code>, <code>ANATOMY.BAS</code>, dan ' +
      '<code>HINTS.BAS</code> ada di <code>run/</code> tapi di luar cakupan ' +
      'penelusur ini. Yang berhenti mengatakan alasannya, bukan diam-diam ' +
      'melanjutkan.',

      '<b><code>KEY OFF</code>, <code>SCREEN 0,0,0</code>, dan ' +
      '<code>WIDTH 80</code> tidak berbuat apa-apa.</b> Konsolnya memang sudah ' +
      'mode teks 80x25 dan tidak pernah menggambar baris label tombol fungsi.',

      '<b>Kedip tidak ditiru</b> (atribut latar 8-15 dilipat ke 0-7). Alasan ' +
      'selera, dinyatakan sebagai selera.'
    ],

    /* Diringkas dari reviews/INTRO.md. */
    pelajaran: {
      ringkas: 'Dua puluh tiga baris — program terpendek di rangkaian ' +
        'Friendlyware, dan justru karena itu tempat terbaik melihat kerangka ' +
        'keluarga ini dalam bentuk telanjang. Tombol keluar dan penangan ' +
        'galat menunjuk baris yang sama.',
      pelajari: [
        ['Rancang penanganan galat sesuai siapa penggunanya',
         'Baris 41 mengarahkan <b>semua</b> galat ke rutin keluar. Untuk ' +
         'produk yang dijual ke pemula itu benar: kembali ke menu dengan ' +
         'tenang jauh lebih baik daripada <code>Syntax error in 170</code> ' +
         'dan prompt <code>Ok</code> yang menakutkan. Untuk perkakas ' +
         'pengembang, sikap MENU.BAS yang benar.'],
        ['Program terpendek dari sebuah keluarga adalah pintu masuknya',
         'Baris 10-90 di sini identik dengan HEAREYE.BAS. Sekali mengerti ' +
         'kerangka ini, dua puluh program lain terbaca lebih cepat.'],
        ['Memasang penangan dan menyalakannya adalah dua hal',
         '<code>ON KEY(10) GOSUB 200</code> memberi alamat; ' +
         '<code>KEY(10) ON</code> yang menghidupkannya. Di antara baris 30 ' +
         'dan 40 jebakannya ada tapi mati.'],
        ['GOSUB tidak selalu pulang',
         'F10 memanggil baris 200 lewat GOSUB, dan baris 200 menjalankan ' +
         '<code>RUN"menu"</code>. Tidak ada RETURN karena tidak ada lagi ' +
         'yang menunggunya — RUN membuang program berikut tumpukannya.']
      ],
      hindari: [
        ['Menelan semua galat tanpa mencatat apa pun',
         '<code>ON ERROR GOTO 200</code> anggun bagi pemakai dan buta total ' +
         'bagi pengembangnya. Kalau baris 100 salah ketik, program ini akan ' +
         'kembali ke menu seolah tidak terjadi apa-apa — selamanya.'],
        ['Nomor baris sisipan sebagai jejak sejarah',
         'Baris 135 duduk di antara 130 dan 140 karena disisipkan belakangan. ' +
         'Tidak salah, tapi setelah beberapa kali begini nomor barisnya ' +
         'berhenti bercerita tentang urutan pengerjaan.']
      ]
    }
  };
})(window);
