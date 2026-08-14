/* ===========================================================================
   GERMFOLK.js — porting minimalis GERMFOLK.BAS sebagai tabel baris.

   Sepuluh baris, dan seluruhnya `PLAY`. Tidak ada `PRINT`, tidak ada
   `INPUT`, tidak ada gelung. Layar penelusur tetap kosong dari awal sampai
   akhir, dan yang bergerak cuma sorotan barisnya.

   Yang layak dipelajari ada di dalam tanda kutipnya: `PLAY` bukan perintah
   membunyikan satu nada, melainkan penafsir BAHASA MAKRO kecil. Sembilan
   baris di sini adalah sebuah lagu rakyat Jerman, ditulis dalam bahasa itu.

   Penyimpangan:

   - `PLAY` tidak berbunyi, jadi program ini benar-benar tidak menghasilkan
     apa pun yang bisa dilihat ATAU didengar di penelusur. Untuk mendengarnya
     jalankan `run\GERMFOLK.bat` di DOSBox-X.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Tiap baris menyimpan makronya apa adanya, supaya bisa dibaca di panel
     sumber sambil sorotannya berjalan. */
  var LAGU = [
    [20, 'o2 t200 l8'],
    [30, 'd g a b >c d4 ml e c< '],
    [40, 'mn b p8 a p8 g4 p8 '],
    [50, 'd g a b >c d4 ml'],
    [60, ' e c <b p8 a8 p8 g4 p4'],
    [70, '>d8. c16 <b >d c <b'],
    [80, 'a4 >d8. c16 <b >d c <b a4'],
    [90, 'g a b >c d4 ml e c mn'],
    [100, '<b p8 a p8 g4.']
  ];

  var tabel = [{ baris: 10, jalan: function () { /* REM judul lagu */ } }];
  LAGU.forEach(function (b) {
    tabel.push({ baris: b[0], jalan: function (m) { m.mainkan(b[1]); } });
  });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['GERMFOLK'] = {
    nama: 'GERMFOLK',
    judul: 'A German Folk Tune',
    sumber: 'GERMFOLK',
    berkas: 'run/GERMFOLK.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur GERMFOLK.BAS',
      simpul: [
        { id: 'setel', baris: '20', jenis: 'mulai',
          teks: ['o2 t200 l8 — oktaf, tempo,', 'dan panjang nada dasar'] },
        { id: 'bait1', baris: '30-60',
          teks: ['Bait pertama, dua kali', 'dengan akhiran berbeda'] },
        { id: 'bait2', baris: '70-80',
          teks: ['Bagian tengah:', 'nada bertitik dan seperenambelas'] },
        { id: 'tutup', baris: '90-100', jenis: 'keluar',
          teks: ['Kembali ke bait pertama,', 'lalu berhenti'] }
      ],
      panah: [
        { dari: 'setel', ke: 'bait1' },
        { dari: 'bait1', ke: 'bait2' },
        { dari: 'bait2', ke: 'tutup' }
      ]
    },

    pseudokode: [
      { baris: 20, tingkat: 0, teks: 'setel <b>oktaf 2</b>, <b>tempo 200</b>, panjang nada dasar <b>1/8</b>' },
      { baris: 30, tingkat: 0, teks: 'mainkan bait: <code>d g a b &gt;c d4</code> &mdash; <code>&gt;</code> naik satu oktaf' },
      { baris: 30, tingkat: 1, teks: '<code>ml</code> = <i>music legato</i>, nada disambung' },
      { baris: 40, tingkat: 1, teks: '<code>mn</code> = <i>music normal</i>; <code>p8</code> = diam selama 1/8' },
      { baris: 70, tingkat: 0, teks: '<code>d8.</code> = seperdelapan <b>bertitik</b> (1,5&times;); <code>c16</code> = seperenambelas' },
      { baris: 90, tingkat: 0, teks: 'ulangi bait pertama, lalu tutup dengan <code>g4.</code>' }
    ],

    perintahAsli: 'run\\GERMFOLK.bat',
    catatanAsli: 'Ini satu-satunya cara mendengar berkas ini. Di penelusur ' +
      'ia tidak menghasilkan apa pun yang bisa dilihat atau didengar.',

    penyimpangan: [
      '<b><code>PLAY</code> tidak berbunyi</b>, dan program ini tidak punya ' +
      'keluaran lain. Layarnya tetap kosong dari awal sampai akhir &mdash; ' +
      'bukan cacat porting, melainkan memang begitu programnya.'
    ],

    pelajaran: {
      ringkas: 'Sebuah lagu rakyat Jerman yang seluruhnya ditulis dalam ' +
        'bahasa makro <code>PLAY</code>. Yang layak dipelajari: satu ' +
        'perintah BASIC yang sebenarnya penafsir bahasa lain.',
      pelajari: [
        ['Satu perintah, satu bahasa',
         '<code>PLAY "o2 t200 l8"</code> tidak membunyikan apa pun &mdash; ia ' +
         'menyetel keadaan. Huruf-huruf di dalam tanda kutip adalah bahasa ' +
         'tersendiri: <code>a</code>-<code>g</code> nada, <code>o</code> ' +
         'oktaf, <code>t</code> tempo, <code>l</code> panjang dasar, ' +
         '<code>p</code> diam, <code>&gt;</code> dan <code>&lt;</code> ' +
         'naik/turun oktaf, angka sesudah nada menimpa panjangnya, titik ' +
         'memperpanjang setengah kali.'],
        ['Keadaan yang menempel',
         '<code>l8</code> di baris 20 berlaku untuk <b>seluruh sisa lagu</b>, ' +
         'sampai ada angka yang menimpanya. Begitu juga <code>ml</code> dan ' +
         '<code>mn</code>: sekali disetel, berlaku terus. Itu sebabnya baris ' +
         '30 berakhir dengan <code>ml</code> dan baris 40 dimulai dengan ' +
         '<code>mn</code> &mdash; keduanya menyambung, meski dipisah nomor ' +
         'baris.'],
        ['Notasi yang muat di satu baris',
         'Sepuluh baris BASIC memuat lagu utuh dengan artikulasi, tanda ' +
         'diam, dan perubahan oktaf. Format yang sama masih dipakai hari ini ' +
         'di RTTTL (nada dering ponsel) &mdash; dan alasannya sama: notasi ' +
         'musik yang bisa diketik, dikirim, dan disimpan sebagai teks biasa.']
      ],
      hindari: [
        ['Program tanpa satu pun tanda kehidupan',
         'Tidak ada <code>PRINT</code>, tidak ada judul, tidak ada ' +
         '"tekan tombol apa saja". Kalau pengeras suaranya mati atau ' +
         'volumenya nol, pemakai tidak punya cara apa pun mengetahui bahwa ' +
         'programnya berjalan &mdash; atau bahwa ia sudah selesai.'],
        ['Nomor baris sebagai birama',
         'Pembagian antar-baris di sini mengikuti frasa musiknya, bukan ' +
         'strukturnya. Baris 30 berakhir di tengah frasa (<code>c&lt;</code>) ' +
         'dan baris 40 melanjutkannya. Membaca satu baris saja tidak ' +
         'memberi tahu apa pun.']
      ]
    },

    penjelasan: [
      { judul: 'Perintah BASIC yang sebenarnya bahasa lain',
        isi: [
          'Ada dua perintah di GW-BASIC yang argumennya bukan data melainkan ' +
          '<b>program kecil</b>: <code>PLAY</code> untuk musik dan ' +
          '<code>DRAW</code> untuk gambar. Keduanya menerima string, dan ' +
          'keduanya menafsirkannya huruf demi huruf.',
          'Baris 20 program ini menyetel keadaannya:',
          '<code>PLAY "o2 t200 l8"</code>',
          '&mdash; oktaf 2, tempo 200 ketuk per menit, dan tiap nada tanpa ' +
          'angka berdurasi seperdelapan.',
          'Lalu baris 30 memainkan nadanya:',
          '<code>PLAY "d g a b &gt;c d4 ml e c&lt; "</code>',
          'Dibaca satu per satu: nada D, G, A, B pada oktaf 2; ' +
          '<code>&gt;</code> naik ke oktaf 3 lalu C; D dengan panjang ' +
          '<b>seperempat</b> (angka 4 menimpa <code>l8</code>); ' +
          '<code>ml</code> mengubah artikulasi jadi <i>legato</i>; E, C; lalu ' +
          '<code>&lt;</code> turun lagi.',
          'Yang penting dan mudah terlewat: <b>keadaannya menempel ' +
          'antar-baris</b>. <code>ml</code> di ujung baris 30 masih berlaku ' +
          'waktu baris 40 mulai &mdash; itu sebabnya baris 40 dibuka dengan ' +
          '<code>mn</code> untuk mengembalikannya.',
          'Jadi kesepuluh baris ini bukan sepuluh potongan yang berdiri ' +
          'sendiri, melainkan <b>satu aliran perintah</b> yang kebetulan ' +
          'dipotong-potong supaya muat di layar. Di penelusur itu terlihat ' +
          'sebagai sorotan yang berjalan lurus tanpa satu pun percabangan.'
        ] },
      { judul: 'Kenapa layarnya kosong',
        isi: [
          'Penelusur ini dibangun untuk memperlihatkan <b>apa yang terjadi di ' +
          'layar</b> sambil menunjukkan baris mana yang sedang berjalan. ' +
          'Untuk berkas ini, jawabannya: tidak ada apa-apa.',
          'Seluruh keluaran program ini adalah <b>suara</b>, dan suara adalah ' +
          'satu-satunya hal yang penelusur memutuskan untuk tidak tiru sejak ' +
          'awal &mdash; karena membunyikannya berarti menyalakan pengeras ' +
          'suara tiap kali sebuah baris disorot, termasuk waktu pemakai ' +
          'melangkah maju-mundur di satu baris yang sama.',
          'Yang tersisa untuk dilihat tetap ada, dan justru itu gunanya: ' +
          '<b>panel sumber di kanan</b> memperlihatkan makro musiknya utuh, ' +
          'dan sorotan berjalan dari frasa ke frasa. Untuk berkas ini, ' +
          'panel sumber ADALAH keluarannya.',
          'Kalau Anda ingin mendengarnya, satu perintah di DOSBox-X sudah ' +
          'cukup: <code>run\\GERMFOLK.bat</code>. Sepuluh baris, sekitar dua ' +
          'puluh detik.'
        ] }
    ]
  };
})(window);
