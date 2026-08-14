/* ===========================================================================
   WRTSTR.js — porting minimalis WRTSTR.BAS sebagai tabel baris.

   Tujuh belas baris yang tidak mencetak apa pun ke layar. Yang dihasilkannya
   sebuah BERKAS: `STRINGS.FIL`, kosakata untuk ELIZA.BAS.

   Ini pola yang sudah hampir hilang: sebuah program yang gunanya dijalankan
   SEKALI, untuk menyiapkan data bagi program lain. Bukan pemasang, bukan
   pembangun — sekadar "tulis dulu berkasnya, baru jalankan yang aslinya".

   Isinya tiga daftar, dan ketiganya bagian dari mesin percakapan ELIZA:

     22 pasang PENGGANTI KATA — ".", ",", "?" jadi " . "; MOM jadi MOTHER;
        dan yang paling penting, PEMBALIKAN KATA GANTI: I<->YOU, MY<->YOUR,
        MYSELF<->YOURSELF. Itulah yang membuat "I hate my mother" berbalik
        jadi "you hate your mother" di mulut ELIZA.

     27 KATA PENGGANTI TEMA — IS/ARE, SAD/UNHAPPY/DEPRESSED, dan seterusnya.

     44 KATA KUNCI — COMPUTER, DREAM, MOTHER, ALWAYS, WHY, YOU: pemicu yang
        membuat ELIZA memilih pola jawaban tertentu.

   Penyimpangan:

   - Berkasnya ditulis ke disket dalam memori penelusur, bukan ke disk. Bisa
     dibaca lagi oleh ELIZA dalam sesi yang sama; hilang begitu halaman
     disegarkan.
   - Tidak ada keluaran layar sama sekali. Yang bisa dilihat cuma sorotan
     baris dan isi lariknya di panel variabel.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    rem(5),
    { baris: 10, jalan: function (m) {
        if (!m.v.DISKET) m.v.DISKET = {};
        m.v.DISKET['STRINGS.FIL'] = [];
      } },
    { baris: 20, jalan: function (m) {
        m.dim('OW$', 22); m.dim('RW$', 22); m.dim('LO', 22); m.dim('LR', 22);
        m.dim('A$', 20); m.dim('K$', 44); m.dim('B$', 27); m.dim('M$', 20);
      } },
    data(30),
    /* 40 dua puluh dua pasang sekaligus dengan panjangnya. Panjang disimpan
       supaya ELIZA tidak perlu memanggil LEN() ribuan kali saat menyisir
       kalimat. */
    { baris: 40, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 22; m.v.I++) {
          m.v['OW$'][m.v.I] = m.baca();
          m.v['RW$'][m.v.I] = m.baca();
          m.v.LO[m.v.I] = m.v['OW$'][m.v.I].length;
          m.v.LR[m.v.I] = m.v['RW$'][m.v.I].length;
        }
      } },
    /* 50-70 empat pasang pertama adalah TANDA BACA (titik, koma, tanya,
       seru) dan sengaja TIDAK diberi spasi pengapit. Sisanya, dari 5 sampai
       22, dikelilingi spasi supaya penggantiannya hanya mengenai kata utuh:
       " MY " tidak akan cocok dengan "MYSTERY". */
    { baris: 50, bagian: [
        function (m) { m.untuk('I', 5, 22, 1, 80); },
        function (m) {
          m.v['RW$'][m.v.I] = ' ' + m.v['RW$'][m.v.I] + ' ';
          m.v['OW$'][m.v.I] = ' ' + m.v['OW$'][m.v.I] + ' ';
        }
      ] },
    { baris: 60, jalan: function (m) {
        m.v.LO[m.v.I] = m.v.LO[m.v.I] + 2;
        m.v.LR[m.v.I] = m.v.LR[m.v.I] + 2;
      } },
    { baris: 70, jalan: function (m) { m.lanjutkan('I'); } },
    data(80),
    { baris: 90, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 27; m.v.I++) {
          m.v['B$'][m.v.I] = ' ' + m.baca() + ' ';
        }
      } },
    data(100), data(110),
    { baris: 120, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 44; m.v.I++) {
          m.v['K$'][m.v.I] = ' ' + m.baca() + ' ';
        }
      } },
    tulis(130, 22, function (m, i) {
      return [m.v['OW$'][i], m.v['RW$'][i], m.v.LO[i], m.v.LR[i]];
    }),
    tulis(140, 27, function (m, i) { return [m.v['B$'][i]]; }),
    tulis(150, 44, function (m, i) { return [m.v['K$'][i]]; }),
    { baris: 160, jalan: function (m) { m.henti('END di baris 160'); } }
  ];

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }
  function data(nomor) { return { baris: nomor, jalan: function () { } }; }

  function tulis(nomor, cacah, ambil) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= cacah; m.v.I++) {
        ambil(m, m.v.I).forEach(function (x) {
          m.v.DISKET['STRINGS.FIL'].push(x);
        });
      }
    } };
  }

  /* Empat butir yang DIKUTIP di sumbernya (" . ") mempertahankan spasinya;
     sisanya tidak dikutip, dan BASIC membuang spasi di ujung butir DATA yang
     tidak dikutip. Itu sebabnya "   FATHER" di baris 30 jadi "FATHER". */
  var DATA = [
    '.', ' . ', ',', ' . ', '?', ' . ', '!', ' . ',
    'MOM', 'MOTHER', 'DAD', 'FATHER', 'DONT', "DON'T", 'CANT', "CAN'T",
    'WONT', "WON'T", 'DREAMED', 'DREAMT', 'DREAMS', 'DREAM',
    'I', 'YOU', 'YOU', 'I', 'ME', 'YOU', 'MY', '*OUR', 'YOUR', 'MY',
    'MYSELF', '*OURSELF', 'YOURSELF', 'MYSELF', "I'M", "*OU'RE",
    "YOU'RE", "I'M", 'AM', 'ARE', 'WERE', 'WAS',
    'IS', 'ARE', 'ARE', 'WAS', 'MOTHER', 'FATHER', 'SISTER', 'BROTHER',
    'WIFE', 'HUSBAND', 'CHILDREN', 'WANT', 'NEED', 'SAD', 'UNHAPPY',
    'DEPRESSED', 'SICK', 'HAPPY', 'ELATED', 'GLAD', 'BETTER', 'FEEL',
    'THINK', 'BELIEVE', 'WISH', "CAN'T", 'CANNOT',
    'COMPUTER', 'COMPUTERS', 'MACHINE', 'MACHINES', 'NAME', 'ALIKE', 'LIKE',
    'SAME', 'REMEMBER', 'DREAMT', 'DREAM', 'IF', 'EVERYBODY', 'EVERYONE',
    'NOBODY', 'NO ONE', 'WAS', 'YOUR', 'ALWAYS', 'SORRY', 'ARE', 'ARE',
    'BECAUSE', 'CAN', 'CERTAINLY', 'YES', 'DEUTSCH', 'ESPANOL', 'FRANCAIS',
    'ITALIANO', 'HELLO', 'HOW', 'WHAT',
    'WHEN', 'WHO', 'I', "I'M", 'MAYBE', 'PERHAPS', 'MY', 'NO', 'WHY',
    'YOU', "YOU'RE"
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['WRTSTR'] = {
    nama: 'WRTSTR',
    judul: 'Write Strings (penyiap kosakata ELIZA)',
    sumber: 'WRTSTR',
    berkas: 'run/WRTSTR.BAS',
    tabel: tabel,
    data: DATA,

    arsitektur: {
      judul: 'Alur WRTSTR.BAS',
      simpul: [
        { id: 'buka', baris: '10-20', jenis: 'mulai',
          teks: ['Buka STRINGS.FIL untuk ditulis,', 'siapkan delapan larik'] },
        { id: 'ganti', baris: '30-70',
          teks: ['22 pasang pengganti kata,', 'termasuk pembalikan kata ganti'] },
        { id: 'spasi', baris: '50-70',
          teks: ['Kelilingi dengan spasi', 'supaya hanya cocok kata utuh'] },
        { id: 'tema', baris: '80-90',
          teks: ['27 kata pengganti tema'] },
        { id: 'kunci', baris: '100-120',
          teks: ['44 kata kunci pemicu'] },
        { id: 'tulis', baris: '130-160', jenis: 'keluar',
          teks: ['Tulis ketiganya ke berkas,', 'lalu END'] }
      ],
      panah: [
        { dari: 'buka', ke: 'ganti' },
        { dari: 'ganti', ke: 'spasi' },
        { dari: 'spasi', ke: 'tema' },
        { dari: 'tema', ke: 'kunci' },
        { dari: 'kunci', ke: 'tulis' }
      ]
    },

    pseudokode: [
      { baris: 10, tingkat: 0, teks: 'buka <code>STRINGS.FIL</code> untuk ditulis' },
      { baris: 40, tingkat: 0, teks: 'baca 22 pasang <b>kata asli &rarr; kata pengganti</b>, catat panjangnya' },
      { baris: 50, tingkat: 0, teks: 'pasangan 5&ndash;22 dikelilingi spasi &mdash; <b>supaya hanya cocok kata utuh</b>' },
      { baris: 50, tingkat: 1, teks: 'empat pertama tanda baca, sengaja tanpa spasi' },
      { baris: 90, tingkat: 0, teks: 'baca 27 kata pengganti tema (SAD, UNHAPPY, DEPRESSED&hellip;)' },
      { baris: 120, tingkat: 0, teks: 'baca 44 kata kunci pemicu (COMPUTER, DREAM, ALWAYS, WHY&hellip;)' },
      { baris: 130, tingkat: 0, teks: 'tulis ketiga daftar ke berkas, lalu <code>END</code>' }
    ],

    perintahAsli: 'run\\WRTSTR.bat',
    catatanAsli: 'Program ini MENULIS ke disket: ia membuat STRINGS.FIL di ' +
      'folder run/. Jalankan hanya kalau itu memang diinginkan.',

    penyimpangan: [
      '<b>Berkasnya ditulis ke disket dalam memori penelusur</b>, bukan ke ' +
      'disk sungguhan. Bisa dibaca lagi oleh ELIZA dalam sesi yang sama; ' +
      'hilang begitu halaman disegarkan.',

      '<b>Tidak ada keluaran layar sama sekali.</b> Yang bisa dilihat cuma ' +
      'sorotan baris dan isi lariknya di panel variabel.',

      '<b>Spasi di ujung butir <code>DATA</code> yang tidak dikutip dibuang</b>, ' +
      'seperti yang dilakukan GW-BASIC. Empat butir yang dikutip di sumbernya ' +
      '(<code>" . "</code>) mempertahankan spasinya.'
    ],

    pelajaran: {
      ringkas: 'Program yang gunanya dijalankan sekali, untuk menyiapkan ' +
        'berkas bagi program lain. Isinya kosakata ELIZA &mdash; termasuk ' +
        'tabel pembalikan kata ganti yang membuat seluruh triknya bekerja.',
      pelajari: [
        ['Pembalikan kata ganti adalah seluruh trik ELIZA',
         'Delapan pasang di baris 30 melakukannya: I&harr;YOU, ME&harr;YOU, ' +
         'MY&harr;YOUR, MYSELF&harr;YOURSELF, I&rsquo;M&harr;YOU&rsquo;RE, ' +
         'AM&harr;ARE, WERE&harr;WAS. Itulah yang mengubah "I hate my mother" ' +
         'jadi "you hate your mother" &mdash; dan itulah yang membuat ELIZA ' +
         'terdengar seperti mendengarkan. <b>Tidak ada pemahaman di mana pun; ' +
         'yang ada tabel dua kolom.</b>'],
        ['Spasi pengapit sebagai batas kata',
         'Baris 50 mengelilingi tiap kata dengan spasi: <code>" MY "</code>, ' +
         'bukan <code>"MY"</code>. Tanpa itu, mengganti MY jadi YOUR akan ' +
         'mengubah "MYSTERY" jadi "YOURSTERY". Cara paling sederhana ' +
         'membatasi pencocokan ke kata utuh, dan masih dipakai di mana-mana ' +
         'sebelum ada ekspresi reguler.'],
        ['Panjang yang dihitung sekali',
         'Baris 40 menyimpan <code>LEN()</code> tiap kata ke larik ' +
         '<code>LO</code> dan <code>LR</code>. ELIZA menyisir tiap kalimat ' +
         'terhadap 22 kata; menghitung ulang panjangnya tiap kali akan ' +
         'berarti ribuan panggilan yang hasilnya selalu sama.'],
        ['Program penyiap sebagai pola',
         'Data yang besar dan tetap tidak disimpan di dalam program yang ' +
         'memakainya, melainkan ditulis ke berkas oleh program terpisah. ' +
         'Alasannya memori: ELIZA.BAS sudah 514 baris, dan 115 butir DATA ' +
         'lagi tidak akan muat. <b>Batas mesin yang menentukan bentuk ' +
         'programnya</b> &mdash; sama seperti MENU2.BAS.']
      ],
      hindari: [
        ['Bintang yang seharusnya huruf Y',
         'Tiga butir di baris 30 dimulai dengan tanda bintang: ' +
         '<code>*OUR</code>, <code>*OURSELF</code>, <code>*OU\'RE</code>. ' +
         'Ketiganya adalah pengganti untuk MY, MYSELF, dan I&rsquo;M &mdash; ' +
         'dan pasangan kebalikannya (YOUR&rarr;MY, YOURSELF&rarr;MYSELF, ' +
         'YOU&rsquo;RE&rarr;I&rsquo;M) tertulis benar. Kelihatannya <b>Y yang ' +
         'terketik jadi *</b>. Kalau benar, ELIZA akan menjawab "*OUR mother" ' +
         'alih-alih "YOUR mother". <i>Akan diperiksa waktu ELIZA.BAS ' +
         'diport.</i>'],
        ['Berkas keluaran tanpa satu kata penjelasan',
         'Tidak ada <code>PRINT "Menulis STRINGS.FIL..."</code>, tidak ada ' +
         '"selesai". Pemakai yang menjalankannya melihat kursor berkedip lalu ' +
         'prompt <code>Ok</code>, tanpa tahu apakah berhasil.'],
        ['Larik yang di-DIM dan tidak dipakai',
         '<code>A$(20)</code> dan <code>M$(20)</code> di baris 20 tidak ' +
         'muncul lagi di mana pun. Keduanya kemungkinan sisa dari daftar DIM ' +
         'ELIZA.BAS yang ikut tersalin.']
      ]
    },

    penjelasan: [
      { judul: 'Tabel dua kolom yang jadi seluruh ilusi',
        isi: [
          'ELIZA terkenal karena terdengar seperti sedang mendengarkan. ' +
          'Sebagian besar dari kesan itu berasal dari satu hal yang ada di ' +
          'baris 30 berkas ini:',
          '<code>I, YOU, YOU, I, ME, YOU, MY, *OUR, YOUR, MY, ...</code>',
          'Dibaca berpasangan: I&rarr;YOU, YOU&rarr;I, ME&rarr;YOU, ' +
          'MY&rarr;YOUR, YOUR&rarr;MY, dan seterusnya.',
          'Waktu pemakai mengetik <i>"I hate my mother"</i>, ELIZA ' +
          'menjalankan kalimatnya lewat tabel ini dan mendapat <i>"you hate ' +
          'your mother"</i>. Tinggal ditempel ke pola jawaban &mdash; ' +
          '"Why do you say <b>you hate your mother</b>?" &mdash; dan ' +
          'hasilnya terdengar seperti tanggapan yang dipahami.',
          'Tidak ada satu pun bagian dari program yang tahu apa arti "hate" ' +
          'atau "mother". Yang ada dua puluh dua pasang string dan sebuah ' +
          'gelung penukar.',
          'Dua daftar lainnya bekerja dengan cara yang sama sederhananya: ' +
          '<b>27 kata tema</b> memberi ELIZA sinonim untuk memvariasikan ' +
          'jawabannya, dan <b>44 kata kunci</b> adalah pemicu &mdash; kalau ' +
          'kalimat pemakai mengandung "COMPUTER", ELIZA memilih pola jawaban ' +
          'tentang komputer; kalau mengandung "ALWAYS", ia bertanya "can you ' +
          'think of a specific example?".',
          'Seluruh mesin percakapannya, dalam 115 butir <code>DATA</code>.'
        ] },
      { judul: 'Kenapa datanya ada di berkas terpisah',
        isi: [
          'Pertanyaan yang wajar: kenapa 115 kata ini tidak ditaruh saja di ' +
          'dalam ELIZA.BAS?',
          'Jawabannya memori. GW-BASIC memuat seluruh program ke RAM, ' +
          'termasuk seluruh baris <code>DATA</code>-nya. ELIZA.BAS sudah 514 ' +
          'baris; menambahkan lima baris DATA panjang berarti menambah ' +
          'kilobita yang harus ikut dimuat setiap kali.',
          'Dengan memisahkannya, kosakata itu ada di disket sebagai berkas ' +
          'data, dan ELIZA membacanya dengan <code>INPUT#</code> ke larik ' +
          '&mdash; ke tempat yang sama, tapi tanpa ikut memenuhi ruang ' +
          'program.',
          'Harganya: berkasnya <b>harus dibuat lebih dulu</b>. Menjalankan ' +
          'ELIZA.BAS di disket yang belum pernah dijalankan WRTSTR.BAS akan ' +
          'berakhir dengan galat 53, "File not found" &mdash; dan tidak ada ' +
          'satu pun petunjuk di kedua berkas yang menyebutkan urutannya.',
          'Pola ini punya nama sekarang: <i>build step</i>. Yang berbeda cuma ' +
          'bahwa di sini tidak ada yang menjalankannya untuk Anda.'
        ] }
    ]
  };
})(window);
