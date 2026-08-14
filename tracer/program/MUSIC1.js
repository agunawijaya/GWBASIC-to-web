/* ===========================================================================
   MUSIC1.js — porting minimalis MUSIC1.BAS sebagai tabel baris.

   MUSIC1.BAS ADALAH MUSIC.BAS. Dua ratus sepuluh baris, dan hanya EMPAT yang
   berbeda:

       baris  MUSIC.BAS                    MUSIC1.BAS
       ----   --------------------------   --------------------------
        975   DEF SEG                      DEF SEG: POKE 106,0
       1520   REM                          POKE 106,0
       1540   IF J = -1<TAB>THEN RETURN    IF J = -1<SPASI><SPASI>THEN RETURN
       3700   <TAB>DATA -2,"Symphony..."   <SPASI x4>DATA -2,"Symphony..."

   Dua yang terakhir cuma TAB LAWAN SPASI — tidak mengubah apa pun yang
   dijalankan, tapi mengatakan sesuatu: kedua berkas ini pernah lewat di
   penyunting yang berbeda.

   Dua yang pertama adalah PERBAIKANNYA. `POKE 106,0` membuang tombol yang
   terlanjur tertekan. Tanpa itu, satu ketukan nyasar sebelum lagu dimulai
   akan langsung menghentikannya lewat baris 1500.

   DAN BARIS 1520 DI MUSIC.BAS ADALAH BEKAS LUKANYA. Ia berbunyi `REM` —
   sebuah baris kosong bernomor, tepat di tempat pokenya berada di MUSIC1.
   Entah pokenya dicabut dari sini, atau tempatnya disiapkan lalu tidak
   pernah diisi. Yang pasti: satu dari dua berkas ini tahu sesuatu yang tidak
   diketahui yang lain, dan tidak ada satu pun catatan di keduanya yang
   menyebutkannya.

   TABELNYA DIBANGUN OLEH PEMBUAT YANG SAMA. Lihat `bikinTabel` di MUSIC.js:
   satu deklarasi, dua berkas. Menuliskannya dua kali berarti dua tabel yang
   bisa melenceng — persis cacat yang sedang didokumentasikan halaman ini.

   Penyimpangan: sama dengan MUSIC.js.
   =========================================================================== */

(function (global) {
  'use strict';

  var B = global.MUSIC_BERSAMA;
  var induk = global.PROGRAM['MUSIC'];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MUSIC1'] = {
    nama: 'MUSIC1',
    judul: 'Music1 (MUSIC.BAS, dengan penyangga tombol dibuang)',
    sumber: 'MUSIC1',
    berkas: 'run/MUSIC1.BAS',
    /* `true` = varian dengan POKE 106,0 di baris 975 dan 1520. */
    tabel: B.bikinTabel(true),
    data: B.DATA,

    arsitektur: {
      judul: 'Alur MUSIC1.BAS (sama dengan MUSIC.BAS)',
      simpul: [
        { id: 'judul', baris: '1010-1140', jenis: 'mulai',
          teks: ['Layar judul IBM,', 'spasi atau ESC'] },
        { id: 'buang1', baris: '975',
          teks: ['POKE 106,0 - buang tombol', 'yang terlanjur tertekan'] },
        { id: 'uji', baris: '1141-1149',
          teks: ['Coba PLAY "mf";', 'kalau gagal, telan galatnya'] },
        { id: 'tuts', baris: '1210-1470',
          teks: ['Gambar papan tuts,', 'lalu 82 frekuensi'] },
        { id: 'menu', baris: '1630-1769', jenis: 'putusan',
          teks: ['A sampai K memilih lagu;', 'RESTORE ke DATA-nya'] },
        { id: 'main', baris: '1490-1620', jenis: 'subrutin',
          teks: ['Baca nada, nyalakan tuts;', 'ESC menghentikan'] },
        { id: 'buang2', baris: '1520',
          teks: ['POKE 106,0 - DI SINI', 'MUSIC.BAS cuma punya REM'] },
        { id: 'keluar', baris: '1850-1860', jenis: 'keluar',
          teks: ['ESC: CHAIN "SAMPLES"', 'kalau dipanggil dari sana'] }
      ],
      panah: [
        { dari: 'judul', ke: 'buang1' },
        { dari: 'buang1', ke: 'uji' },
        { dari: 'uji', ke: 'tuts' },
        { dari: 'tuts', ke: 'menu' },
        { dari: 'menu', ke: 'main', label: 'A-K' },
        { dari: 'main', ke: 'buang2' },
        { dari: 'buang2', ke: 'main', label: 'nada berikutnya' },
        { dari: 'main', ke: 'menu', label: 'lagu habis atau ESC' },
        { dari: 'menu', ke: 'keluar', label: 'ESC' }
      ]
    },

    pseudokode: [
      { baris: 975, tingkat: 0, teks: '<code>POKE 106,0</code> &mdash; <b>buang tombol yang terlanjur tertekan</b>' },
      { baris: 1520, tingkat: 0, teks: '&hellip;dan sekali lagi di tiap nada. <b>Di MUSIC.BAS baris ini cuma <code>REM</code></b>' },
      { baris: 1500, tingkat: 1, teks: 'tanpa pembuangan itu, satu ketukan nyasar menghentikan lagunya di sini' },
      { baris: 1370, tingkat: 0, teks: '82 frekuensi dari satu rumus &mdash; sama seperti MUSIC.BAS' },
      { baris: 1570, tingkat: 0, teks: '<code>SCREEN(5,Q)</code> menentukan tuts hitam atau putih' },
      { baris: 1680, tingkat: 0, teks: 'sebelas lagu, dipilih dengan <code>RESTORE</code>' }
    ],

    perintahAsli: 'run\\MUSIC1.bat',
    catatanAsli: 'Jalankan berdampingan dengan MUSIC.BAS: keduanya terlihat ' +
      'dan terdengar sama persis. Bedanya baru terasa kalau ada tombol yang ' +
      'tertekan sebelum lagunya mulai.',

    penyimpangan: [
      '<b>Sama dengan MUSIC.js</b> &mdash; <code>SOUND</code> dan ' +
      '<code>PLAY</code> diam, <code>WIDTH 40</code> tidak ditiru, dan ' +
      '<code>RESTORE</code> memakai indeks yang dihitung.',

      '<b>Tabel barisnya dibangun oleh pembuat yang sama dengan MUSIC.js.</b> ' +
      'Itu keputusan yang disengaja: dua salinan tabel bisa melenceng, dan ' +
      'melencengnya dua salinan justru cacat yang sedang didokumentasikan ' +
      'halaman ini.',

      '<b>Perbedaan tab lawan spasi di baris 1540 dan 3700 tidak terlihat</b> ' +
      'di penelusur, karena yang dijalankan tabel baris, bukan teksnya. ' +
      'Bandingkan sendiri di panel kanan kedua program.'
    ],

    pelajaran: {
      ringkas: 'Dua berkas yang sama di satu disket, berbeda empat baris ' +
        '&mdash; dua perbaikan, dan dua tab yang jadi spasi.',
      pelajari: [
        ['Membuang tombol yang terlanjur tertekan',
         '<code>POKE 106,0</code> menulis nol ke cacah tombol tertunda milik ' +
         'penafsir BASIC sendiri. Gunanya di sini jelas: baris 1500 membaca ' +
         '<code>INKEY$</code> tiap nada, dan ESC menghentikan lagu. Tanpa ' +
         'pembuangan, satu ketukan nyasar yang tersisa dari menu akan ' +
         'langsung membatalkan lagu yang baru saja dipilih.'],
        ['Bekas luka yang tertinggal sebagai REM',
         'Di MUSIC.BAS, baris 1520 berbunyi <code>REM</code> saja &mdash; ' +
         'sebuah baris bernomor tanpa isi, tepat di tempat pokenya berada di ' +
         'MUSIC1.BAS. Baris kosong seperti itu jarang diketik dengan sengaja. ' +
         'Ia biasanya <b>bekas sesuatu</b>: entah yang dicabut, entah tempat ' +
         'yang disiapkan dan tidak pernah diisi.'],
        ['Tab lawan spasi sebagai sidik jari',
         'Baris 1540 dan 3700 berbeda <b>hanya</b> pada tab lawan spasi. ' +
         'Tidak ada bedanya bagi penafsir. Tapi ia mengatakan bahwa kedua ' +
         'berkas pernah lewat di alat yang berbeda &mdash; satu yang menyimpan ' +
         'tab, satu yang membentangkannya. Sidik jari yang tidak sengaja ' +
         'ditinggalkan.']
      ],
      hindari: [
        ['Dua salinan tanpa satu pun catatan',
         'Tidak ada <code>REM</code> di kedua berkas yang menyebutkan yang ' +
         'lain. Tidak ada nomor versi yang berbeda &mdash; keduanya menulis ' +
         '"Version 1.10". Siapa pun yang membuka disket ini menemukan dua ' +
         'berkas bernama hampir sama, isinya hampir sama, dan <b>tidak ada ' +
         'cara mengetahui mana yang lebih baru</b> selain membandingkannya ' +
         'baris demi baris.'],
        ['Perbaikan yang tidak dicatat sebagai perbaikan',
         'Penambahan <code>POKE 106,0</code> memperbaiki cacat yang nyata. ' +
         'Kalau ia ditulis dengan satu <code>REM</code> di sebelahnya &mdash; ' +
         '<i>"buang sisa ketukan supaya lagu tidak langsung berhenti"</i> ' +
         '&mdash; berkas ini akan menjelaskan dirinya sendiri. Tanpa itu, ' +
         'satu-satunya cara memahaminya adalah menemukan berkas yang lain, ' +
         'membandingkannya, dan menebak.']
      ]
    },

    penjelasan: [
      { judul: 'Empat baris, dan dua di antaranya tidak berarti apa-apa',
        isi: [
          'Membandingkan MUSIC.BAS dan MUSIC1.BAS baris demi baris memberi ' +
          'tepat empat perbedaan dari dua ratus sepuluh baris:',
          '<code>&nbsp;975&nbsp; DEF SEG</code> &nbsp;&rarr;&nbsp; ' +
          '<code>DEF SEG: POKE 106,0</code><br>' +
          '<code>1520&nbsp; REM</code> &nbsp;&rarr;&nbsp; ' +
          '<code>POKE 106,0</code><br>' +
          '<code>1540&nbsp; IF J = -1&lt;tab&gt;THEN RETURN</code> ' +
          '&nbsp;&rarr;&nbsp; <code>IF J = -1&lt;dua spasi&gt;THEN RETURN</code><br>' +
          '<code>3700&nbsp; &lt;tab&gt;DATA &hellip;</code> &nbsp;&rarr;&nbsp; ' +
          '<code>&lt;empat spasi&gt;DATA &hellip;</code>',
          'Dua yang terakhir <b>tidak mengubah apa pun</b>. Penafsir BASIC ' +
          'memperlakukan tab dan spasi sama saja di luar tanda kutip.',
          'Tapi keduanya tetap bercerita. Sebuah tab yang berubah jadi spasi ' +
          'berarti berkasnya pernah dibuka oleh alat yang membentangkan tab ' +
          '&mdash; penyunting lain, alat pemindah, atau <code>LIST</code> ke ' +
          'berkas dari mesin yang setelannya berbeda.',
          'Dua yang pertama adalah perubahan yang sebenarnya, dan keduanya ' +
          'hal yang sama: membuang tombol yang terlanjur tertekan.',
          'Yang paling menarik justru <b>baris 1520 di MUSIC.BAS</b>. Ia ' +
          'berbunyi <code>REM</code> &mdash; baris bernomor tanpa isi apa pun, ' +
          'tepat di tempat pokenya berada di berkas satunya.',
          'Baris seperti itu jarang diketik dengan sengaja. Yang lebih masuk ' +
          'akal: pokenya pernah ada di sana lalu dicabut, atau tempatnya ' +
          'disiapkan untuk sesuatu yang belum ditulis. Dua-duanya berarti hal ' +
          'yang sama bagi pembaca hari ini &mdash; <b>di sinilah sesuatu ' +
          'pernah terjadi</b>.',
          'Dan tidak ada satu pun kata di kedua berkas yang mengatakan yang ' +
          'mana lebih dulu.'
        ] }
    ]
  };
})(window);
