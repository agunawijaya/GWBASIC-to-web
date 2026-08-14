/* ===========================================================================
   BUSTEN.js — porting minimalis BUSTEN.BAS sebagai tabel baris.

   Langkah kedua belas dan terakhir: REKAP. Tidak ada akuntansi sama sekali di
   berkas ini — dua layar teks, lalu kembali ke menu.

   Dan di layar pertama itu, penulisnya mengatakan sendiri apa sebenarnya
   seluruh rangkaian dua belas program ini:

       C) We hoped to show you what we are capable of doing
          so that you will use our software in the future.

   Dua belas berkas, sekitar delapan ratus baris, sebuah perusahaan rekaan
   bernama ABC Hardware, neraca yang seimbang sampai sen terakhir — semuanya
   BROSUR PENJUALAN. Tidak ada satu pun angka yang pernah dihitung; lihat
   catatan di BUSTWO.BAS dan BUSNINE.BAS.

   Satu lagi yang layak dilihat: baris terakhir berkasnya berbunyi

       540 RUN"menu

   Tanda kutip penutupnya TIDAK ADA. GW-BASIC menerimanya — string yang
   sampai di ujung baris dianggap tertutup di situ. Toleransi yang membuat
   berkas ini tetap jalan selama empat puluh tahun.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol, karena
     dipasangkan dengan gelung pembuang `IF INKEY$<>""` di baris 50.
   - `LOCATE ,14` (baris tanpa nomor baris layar) berarti "pindah kolom,
     jangan sentuh barisnya" dan ditiru apa adanya.
   =========================================================================== */

(function (global) {
  'use strict';

  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KANAN_BAWAH = 217, KIRI_BAWAH = 192;

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 540);
      } },
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 70);
        }
      } },
    { baris: 30, jalan: function (m) { m.lompat(80); } },

    { baris: 40, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 50, jalan: function (m) { if (m.inkey() !== '') m.lompat(40); } },
    { baris: 60, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(60);
      } },
    { baris: 70, jalan: function (m) { m.kembali(); } },

    { baris: 80, bagian: [
        function (m) { m.gosub(90); },
        function (m) { m.lompat(180); }
      ] },

    /* --- 90-170: kepala halaman ------------------------------------------- */
    { baris: 90, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
        m.warna(11, 0);
      } },
    { baris: 100, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.J = 20; m.v.J <= 62; m.v.J++) {
            m.locate(m.v.I, m.v.J, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 110, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 120, jalan: function (m) {
        m.locate(2, 19, 0); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 130, jalan: function (m) { m.warna(0, 7); } },
    { baris: 140, jalan: function (m) {
        m.locate(2, 22, 0);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
      } },
    { baris: 150, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 28, 0);
        m.cetak('STEP XII. SIMULATION RECAP'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 160, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 28, 0);
        m.cetak('--------------------------'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 170, jalan: function (m) { m.kembali(); } },

    /* --- 180-370: layar pertama — tiga hal yang ingin dicapai -------------- */
    { baris: 180, jalan: function (m) {
        m.locate(7, 14);
        m.cetak("      Now that wasn't so bad was it? We sincerely hope");
        m.barisBaru();
      } },
    naskah(190, 14, 'that you have found this simulation both enjoyable and'),
    naskah(200, 14, 'educational.  Keep in mind that everything you saw was'),
    naskah(210, 14, 'a scaled down version of the activity of any business.'),
    naskah(220, 14, '      In our decision to present this demonstration we'),
    naskah(230, 14, 'felt like there were 3 tasks we hoped to accomplish;'),
    { baris: 240, jalan: function (m) { m.barisBaru(); } },
    butir(250, ' A) ', 'We wanted to demonstrate the efficiency and power'),
    sambung(260, 'that an automated accounting system is capable of.'),
    { baris: 270, jalan: function (m) { m.barisBaru(); } },
    butir(280, ' B) ', 'We tried to make it clear that while the IBM P.C.'),
    sambung(290, 'is relatively compact and inexpensive, it is able'),
    sambung(300, 'to perform a variety of complex functions.'),
    { baris: 310, jalan: function (m) { m.barisBaru(); } },
    /* 320-330 KALIMAT INI yang menjelaskan seluruh dua belas berkasnya. */
    butir(320, ' C) ', 'We hoped to show you what we are capable of doing'),
    sambung(330, 'so that you will use our software in the future.'),
    { baris: 340, jalan: function (m) { m.warna(11, 0); } },
    { baris: 350, jalan: function (m) {
        m.locate(25, 22);
        m.cetak('***** Strike Any Key To Continue *****');
      } },
    { baris: 360, jalan: function (m) { m.warna(7, 0); } },
    { baris: 370, bagian: [
        function (m) { m.gosub(40); },
        function (m) { m.gosub(90); }
      ] },

    /* --- 380-530: layar kedua — penutup ----------------------------------- */
    { baris: 380, jalan: function (m) {
        m.locate(7, 14);
        m.cetak('      We presented this simulation to you in the hopes');
        m.barisBaru();
      } },
    naskah(390, 14, 'that you would learn a little about computers and auto-'),
    naskah(400, 14, 'mation. The steps that we led you through are the same'),
    /* 410 "11 steps" — padahal rangkaiannya dua belas berkas. Langkah XII di
       berkas ini memang bukan langkah akuntansi, melainkan penutup. */
    naskah(410, 14, '11 steps any major corporation must take.             '),
    naskah(420, 14, '      From the taking  place of the transaction itself'),
    naskah(430, 14, 'to the Post-closing Trial Balance, we explained enough'),
    naskah(440, 14, 'about each procedure to  allow a person with a minimal'),
    naskah(450, 14, 'amount of accounting knowledge to follow the flow of a'),
    naskah(460, 14, 'business.'),
    naskah(470, 14, '      It has been a pleasure  sharing our knowledge of'),
    naskah(480, 14, 'automated accounting with you,  and you may anticipate'),
    naskah(490, 14, 'hearing from us in the future.'),
    { baris: 500, jalan: function (m) { m.warna(11, 0); } },
    { baris: 510, jalan: function (m) {
        m.locate(25, 18);
        m.cetak('***** Strike Any Key To Return To The Menu *****');
      } },
    { baris: 520, jalan: function (m) { m.warna(7, 0); } },
    { baris: 530, jalan: function (m) { m.gosub(40); } },
    /* 540 `RUN"menu` — tanda kutip penutupnya tidak ada, dan GW-BASIC
       menerimanya. Baris ini juga badan jebakan F10. */
    { baris: 540, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function naskah(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  /* `COLOR 11,0:LOCATE ,14:PRINT" A) ";:COLOR 7,0:PRINT"..."` — huruf
     penomorannya diberi warna lain, teksnya tidak. */
  function butir(nomor, tanda, isi) {
    return { baris: nomor, jalan: function (m) {
      m.warna(11, 0); m.locate(null, 14); m.cetak(tanda);
      m.warna(7, 0); m.cetak(isi); m.barisBaru();
    } };
  }
  function sambung(nomor, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(null, 18); m.cetak(isi); m.barisBaru();
    } };
  }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSTEN'] = {
    nama: 'BUSTEN',
    judul: 'Business Simulation XII — rekap (dan brosurnya)',
    sumber: 'BUSTEN',
    berkas: 'run/BUSTEN.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSTEN.BAS',
      simpul: [
        { id: 'jebak', baris: '10-30', jenis: 'mulai',
          teks: ['F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'kepala', baris: '90-170', jenis: 'subrutin',
          teks: ['Kotak judul', 'STEP XII'] },
        { id: 'satu', baris: '180-360',
          teks: ['Tiga hal yang', 'ingin dicapai penulisnya'] },
        { id: 'tunggu', baris: '40-70', jenis: 'subrutin',
          teks: ['Buang penyangga,', 'tunggu satu tombol'] },
        { id: 'dua', baris: '380-520',
          teks: ['Penutup:', 'sampai jumpa lagi'] },
        { id: 'menu', baris: '540', jenis: 'keluar',
          teks: ['RUN "menu"', 'tanpa kutip penutup'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'kepala' },
        { dari: 'kepala', ke: 'satu' },
        { dari: 'satu', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'kepala', label: 'digambar ulang' },
        { dari: 'kepala', ke: 'dua' },
        { dari: 'dua', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'menu' }
      ]
    },

    pseudokode: [
      { baris: 20, tingkat: 0, teks: 'jebak F1&ndash;F9 ke sebuah <code>RETURN</code> &mdash; <b>cara mematikan tombol</b>' },
      { baris: 90, tingkat: 0, teks: 'gambar kotak judul: <code>STEP XII. SIMULATION RECAP</code>' },
      { baris: 180, tingkat: 0, teks: 'layar 1: tiga hal yang ingin dicapai penulisnya' },
      { baris: 320, tingkat: 1, teks: '<b>C) supaya Anda memakai perangkat lunak kami di kemudian hari</b>' },
      { baris: 370, tingkat: 0, teks: 'tunggu tombol, gambar ulang kepala' },
      { baris: 380, tingkat: 0, teks: 'layar 2: penutup &mdash; "11 steps", padahal berkasnya dua belas' },
      { baris: 540, tingkat: 0, teks: '<code>RUN"menu</code> &mdash; <b>tanpa tanda kutip penutup</b>' }
    ],

    perintahAsli: 'run\\BUSTEN.bat',
    catatanAsli: 'Berkas terakhir rangkaian BUSONE sampai BUSTEN. Menjalankan ' +
      'BUSONE akan sampai ke sini sendiri lewat sepuluh RUN berturut-turut.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50.',

      '<b><code>LOCATE ,14</code> ditiru apa adanya</b>: pindah kolom, jangan ' +
      'sentuh barisnya. Dipakai di baris 250, 280, dan 320 supaya huruf ' +
      'penomorannya sejajar tanpa perlu tahu sedang di baris berapa.'
    ],

    pelajaran: {
      ringkas: 'Layar penutup yang mengakui bahwa dua belas program ' +
        'sebelumnya adalah brosur penjualan &mdash; dan sebuah tanda kutip ' +
        'yang tidak pernah ditutup.',
      pelajari: [
        ['LOCATE tanpa nomor baris',
         '<code>LOCATE ,14</code> mengubah kolom tanpa menyentuh barisnya. ' +
         'Dipakai untuk menyejajarkan huruf A), B), C) di kolom 14 tanpa ' +
         'perlu menghitung sudah sampai baris berapa. Argumen yang dilewati ' +
         'artinya "jangan diubah" &mdash; berlaku untuk ketiga argumennya.'],
        ['Kutip yang tidak perlu ditutup di ujung baris',
         'Baris 540 berbunyi <code>RUN"menu</code>. GW-BASIC menganggap ' +
         'string yang sampai di ujung baris tertutup di situ. Toleransi kecil ' +
         'yang membuat berkas ini tetap jalan selama empat puluh tahun ' +
         '&mdash; dan yang akan ditolak mentah-mentah oleh hampir setiap ' +
         'bahasa sesudahnya.']
      ],
      hindari: [
        ['Angka yang tidak cocok dengan berkasnya',
         'Baris 410 menyebut <b>"11 steps"</b>, sementara rangkaiannya dua ' +
         'belas berkas dan berkas ini sendiri diberi judul <b>STEP XII</b>. ' +
         'Sebelas memang benar untuk langkah akuntansinya &mdash; yang ' +
         'kedua belas ini penutup, bukan langkah &mdash; tapi tidak ada apa ' +
         'pun di layar yang menjelaskan itu.'],
        ['Spasi pengisi di ujung teks',
         'Baris 410 berakhir dengan tiga belas spasi di dalam tanda kutipnya. ' +
         'Gunanya menghapus sisa teks lama di baris itu &mdash; cara yang ' +
         'bekerja, sampai teks yang mau dihapus lebih panjang daripada ' +
         'spasinya.']
      ]
    },

    penjelasan: [
      { judul: 'Baris yang menjelaskan seluruh rangkaiannya',
        isi: [
          'Sesudah dua belas berkas, sekitar delapan ratus baris, sebuah ' +
          'perusahaan rekaan bernama ABC Hardware, dan neraca yang seimbang ' +
          'sampai sen terakhir, baris 320&ndash;330 mengatakan apa maksud ' +
          'semuanya:',
          '<code>C) We hoped to show you what we are capable of doing<br>' +
          '&nbsp;&nbsp;&nbsp;so that you will use our software in the future.</code>',
          'Ini brosur penjualan. Dan begitu disebut, semuanya masuk akal: ' +
          'kenapa tidak ada satu pun angka yang dihitung (lihat BUSTWO dan ' +
          'BUSNINE), kenapa tidak ada masukan pemakai selain "tekan tombol", ' +
          'kenapa tiap layar berakhir dengan ajakan menekan tombol berikutnya.',
          'Yang layak diingat: pada 1982, <b>satu-satunya cara memperlihatkan ' +
          'apa yang bisa dilakukan sebuah komputer adalah menulis program yang ' +
          'berpura-pura melakukannya</b>. Tidak ada tangkapan layar untuk ' +
          'dibagikan, tidak ada video, tidak ada versi percobaan yang bisa ' +
          'diunduh. Yang ada disket, dan orang yang duduk di depan mesinnya.',
          'Jadi mereka menulis dua belas program yang berjalan seperti ' +
          'perangkat lunak akuntansi, menjumlahkan angkanya sendiri lebih dulu ' +
          'supaya meyakinkan, dan menaruh nomor telepon mereka di layar ' +
          'terakhir dengan cara yang paling sopan yang bisa dibayangkan: ' +
          '"you may anticipate hearing from us in the future".'
        ] }
    ]
  };
})(window);
