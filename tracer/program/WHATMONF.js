/* ===========================================================================
   WHATMONF.js — porting minimalis WHATMONF.BAS sebagai tabel baris.

   Empat baris. Program terpendek di seluruh koleksi, dan ia TIDAK MENCETAK
   APA PUN — tidak ada `PRINT`, tidak ada `CLS`, tidak ada `INPUT`. Layar
   penelusur akan tetap kosong dari awal sampai akhir, dan itu bukan cacat
   porting: memang begitu programnya.

   Lalu apa gunanya? Ia menjawab satu pertanyaan yang di tahun 1982 harus
   dijawab sebelum program apa pun boleh menggambar:

       DI ALAMAT MANA RAM LAYAR MESIN INI?

   Jawabannya cuma dua kemungkinan — &HB000 untuk kartu monokrom, &HB800
   untuk kartu warna — dan cara mengetahuinya adalah membaca satu bita di
   ROM BIOS: alamat &H0040:&H0049, "modus video yang sedang aktif".

   Belasan program di koleksi ini mengulang uji yang sama di tengah kodenya
   sendiri (MAZE.BAS baris 20, SUB.BAS baris 590, WILDCAT.BAS baris 1810,
   STATS.BAS baris 2420). Berkas ini adalah ujinya, berdiri sendiri —
   sepotong pengetahuan yang disimpan supaya bisa disalin.

   Penyimpangan:

   - `PEEK` selalu menjawab 3 (modus teks 80 kolom berwarna), jadi `SCRN`
     selalu berakhir &HB800. Penelusur memang tidak punya kartu monokrom.
   - Tidak ada keluaran layar sama sekali. Yang bisa dilihat cuma sorotan
     baris dan nilai variabelnya.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    /* 10 `DEF SEG=&H0040` — arahkan PEEK berikutnya ke segmen data BIOS.
       Di situlah ROM menyimpan catatan tentang keadaan mesin. */
    { baris: 10, jalan: function () { } },
    /* 20 offset &H49 di segmen itu berisi NOMOR MODUS VIDEO:
         0,1 = teks 40 kolom     2,3 = teks 80 kolom (kartu warna)
         4,5,6 = grafik          7   = teks 80 kolom (kartu monokrom) */
    { baris: 20, jalan: function (m) { m.v.VALUE = 3; } },
    { baris: 30, jalan: function (m) {
        if (m.v.VALUE === 2 || m.v.VALUE === 3) m.v.SCRN = 0xB800;
      } },
    /* 40 dan kalau modusnya 7, alamatnya &HB000.

       Perhatikan urutannya: baris 30 memasang &HB800 untuk modus 2/3, baris
       40 memasang &HB000 untuk modus 7. Komentar di berkas aslinya justru
       menulisnya TERBALIK dari kebiasaan (&HB000 disebut duluan) — dan
       nilainya di sini memang begitu. Modus grafik 4,5,6 tidak diuji sama
       sekali: `SCRN` akan tinggal nol, dan pemanggilnya tidak diberi tahu. */
    { baris: 40, jalan: function (m) {
        if (m.v.VALUE === 7) m.v.SCRN = 0xB000;
      } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['WHATMONF'] = {
    nama: 'WHATMONF',
    judul: 'What Monitor? (uji kartu tampilan)',
    sumber: 'WHATMONF',
    berkas: 'run/WHATMONF.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur WHATMONF.BAS',
      simpul: [
        { id: 'seg', baris: '10', jenis: 'mulai',
          teks: ['Arahkan PEEK ke', 'segmen data BIOS (&H40)'] },
        { id: 'baca', baris: '20',
          teks: ['Baca offset &H49:', 'nomor modus video'] },
        { id: 'warna', baris: '30', jenis: 'putusan',
          teks: ['Modus 2 atau 3?', 'RAM layar di &HB800'] },
        { id: 'mono', baris: '40', jenis: 'putusan',
          teks: ['Modus 7?', 'RAM layar di &HB000'] },
        { id: 'diam', baris: '—', jenis: 'galat',
          teks: ['Modus 4, 5, 6:', 'SCRN tinggal nol, tanpa peringatan'] }
      ],
      panah: [
        { dari: 'seg', ke: 'baca' },
        { dari: 'baca', ke: 'warna' },
        { dari: 'warna', ke: 'mono', label: 'bukan 2/3' },
        { dari: 'mono', ke: 'diam', label: 'bukan 7 juga', jenis: 'galat' }
      ]
    },

    pseudokode: [
      { baris: 10, tingkat: 0, teks: 'arahkan <code>PEEK</code> ke segmen data BIOS (<code>&amp;H0040</code>)' },
      { baris: 20, tingkat: 0, teks: 'baca satu bita di offset <code>&amp;H49</code> &mdash; <b>nomor modus video</b>' },
      { baris: 30, tingkat: 0, teks: 'modus 2 atau 3 (teks 80 kolom, kartu warna) &rarr; RAM layar <code>&amp;HB800</code>' },
      { baris: 40, tingkat: 0, teks: 'modus 7 (kartu monokrom) &rarr; RAM layar <code>&amp;HB000</code>' },
      { baris: 40, tingkat: 1, teks: 'modus lain: <b>tidak diuji</b>, <code>SCRN</code> tinggal nol' }
    ],

    perintahAsli: 'run\\WHATMONF.bat',
    catatanAsli: 'Di DOSBox-X program ini juga tidak menampilkan apa pun; ' +
      'ia selesai seketika dan mengembalikan Anda ke prompt Ok.',

    penyimpangan: [
      '<b><code>PEEK</code> selalu menjawab 3</b> (teks 80 kolom, kartu ' +
      'warna), jadi <code>SCRN</code> selalu berakhir <code>&amp;HB800</code>. ' +
      'Penelusur memang tidak punya kartu monokrom untuk ditemukan.',

      '<b>Tidak ada keluaran layar sama sekali</b>, dan itu bukan cacat ' +
      'porting. Yang bisa dilihat cuma sorotan baris dan nilai variabelnya.'
    ],

    pelajaran: {
      ringkas: 'Empat baris yang menjawab satu pertanyaan: di alamat mana ' +
        'RAM layar mesin ini? Sepotong pengetahuan yang disimpan supaya bisa ' +
        'disalin ke program lain.',
      pelajari: [
        ['Bertanya kepada mesin, bukan menebaknya',
         'Di tahun 1982 tidak ada cara "resmi" menanyakan jenis kartu ' +
         'tampilan. Yang ada: satu bita di <code>&amp;H0040:&amp;H0049</code> ' +
         'yang diisi ROM BIOS saat mesin dinyalakan. Program ini membacanya ' +
         'dan menerjemahkannya jadi alamat.'],
        ['Sepotong kode yang gunanya disalin',
         'Uji yang sama muncul lagi di MAZE.BAS baris 20, SUB.BAS 590, ' +
         'WILDCAT.BAS 1810, dan STATS.BAS 2420 &mdash; masing-masing ditulis ' +
         'ulang di tengah program. Berkas ini adalah <b>versi arsipnya</b>: ' +
         'bukan untuk dijalankan, melainkan untuk dibuka dan disalin.'],
        ['Program yang tidak mencetak apa pun tetap program',
         'Tidak ada <code>PRINT</code>, tidak ada <code>CLS</code>. ' +
         'Seluruh hasilnya adalah <b>satu variabel</b>. Di penelusur itu ' +
         'terlihat jelas: layarnya tetap kosong, dan yang bergerak cuma ' +
         'sorotan barisnya.']
      ],
      hindari: [
        ['Kemungkinan yang tidak diuji dan tidak dikeluhkan',
         'Modus video 4, 5, dan 6 (grafik) tidak cocok dengan dua ' +
         '<code>IF</code> mana pun. <code>SCRN</code> tinggal <b>nol</b>, dan ' +
         'pemanggil yang mempercayainya akan memoke ke alamat 0 &mdash; ' +
         'tabel vektor interupsi. Dua baris lagi (<code>ELSE</code> yang ' +
         'mengeluh) akan menutupnya.'],
        ['Hasil yang cuma ada di dalam variabel',
         'Program ini selesai tanpa memberi tahu siapa pun apa yang ' +
         'ditemukannya. Ia hanya berguna kalau barisnya <b>disalin ke ' +
         'program lain</b> &mdash; dan itu berarti tidak ada satu tempat pun ' +
         'yang bisa diperbaiki kalau ujinya ternyata keliru.']
      ]
    },

    penjelasan: [
      { judul: 'Pertanyaan yang harus dijawab sebelum menggambar apa pun',
        isi: [
          'Beberapa program di koleksi ini menggambar dengan menulis langsung ' +
          'ke RAM layar &mdash; WILDCAT.BAS memoke kisi petanya, MAZE.BAS ' +
          'memoke seluruh dinding tiga dimensinya, SUB.BAS mengembalikan ' +
          'latar di belakang bomnya.',
          'Semuanya perlu tahu satu hal lebih dulu: <b>di alamat mana RAM ' +
          'layarnya</b>. IBM PC punya dua kemungkinan:',
          '<code>&amp;HB000</code> &mdash; kartu monokrom (MDA)<br>' +
          '<code>&amp;HB800</code> &mdash; kartu warna (CGA)',
          'Menebak salah berarti menulis ke memori yang bukan layar. Tidak ' +
          'ada pesan galat; yang terjadi tergantung apa yang kebetulan ada di ' +
          'situ.',
          'Cara mengetahuinya, dan itulah seluruh isi berkas ini:',
          '<code>10 DEF SEG=&amp;H0040</code> &mdash; segmen data BIOS<br>' +
          '<code>20 VALUE=PEEK(&amp;H0049)</code> &mdash; nomor modus video',
          'ROM BIOS menyimpan nomor modus yang sedang aktif di situ, dan ' +
          'memperbaruinya tiap kali <code>SCREEN</code> dipanggil. Modus 7 ' +
          'hanya bisa dicapai kartu monokrom; modus 2 dan 3 hanya kartu ' +
          'warna. Jadi satu bita itu sudah cukup menjawab pertanyaannya.',
          'Bandingkan dengan cara MAZE.BAS menulisnya (baris 20): ' +
          '<code>IF (PEEK(1040) AND 48)=48 THEN ...</code> &mdash; membaca ' +
          'bita <b>lain</b> (1040 = &amp;H410, bita perlengkapan) dan menguji ' +
          'dua bitnya. Dua program, dua bita berbeda, jawaban yang sama.'
        ] },
      { judul: 'Berkas yang gunanya dibaca, bukan dijalankan',
        isi: [
          'Menjalankan WHATMONF.BAS tidak menghasilkan apa-apa yang bisa ' +
          'dilihat. Ia mengisi satu variabel lalu berhenti.',
          'Itu bukan cacat. Berkas ini adalah <b>catatan</b> &mdash; jawaban ' +
          'atas pertanyaan teknis yang disimpan dalam bentuk yang bisa ' +
          'dimuat, dilihat dengan <code>LIST</code>, dan disalin ke program ' +
          'yang sedang ditulis.',
          'Di masa sebelum ada mesin pencari, pustaka daring, atau bahkan ' +
          'cara mudah menyalin-tempel antar-berkas, begitulah pengetahuan ' +
          'teknis disimpan: sebagai program pendek yang tidak dimaksudkan ' +
          'untuk dijalankan.',
          'Di penelusur, berkas ini justru berguna untuk hal lain: ia ' +
          'memperlihatkan bahwa <b>sorotan baris dan layar adalah dua hal ' +
          'terpisah</b>. Empat baris bergerak, layar tidak berubah sama ' +
          'sekali, dan seluruh yang terjadi ada di panel variabel.'
        ] }
    ]
  };
})(window);
