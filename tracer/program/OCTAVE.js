/* ===========================================================================
   OCTAVE.js — porting minimalis OCTAVE.BAS sebagai tabel baris.

   Enam baris, dan salah satunya membuat program ini TIDAK PERNAH BERHENTI.

   Isinya rumus tangga nada bertemperamen sama — cara menghitung frekuensi
   nada mana pun dari satu nada acuan:

       frekuensi = 440 * 2 ^ (oktaf + (nada - 10) / 12)

   440 Hz adalah A di atas C tengah. Tiap naik satu nada berarti mengalikan
   dengan akar dua belas dari dua. Itulah seluruh teori musik Barat sejak
   abad ke-18, dalam satu baris BASIC.

   Tapi baris 60 melompat ke baris 30 — dan baris 30 tidak pernah mengubah
   `octave` maupun `note`. Jadi frekuensinya dihitung ulang terus dengan
   nilai yang sama, selamanya.

   Penyimpangan:

   - `SOUND` dan `PLAY` tidak berbunyi, jadi tidak ada keluaran sama sekali.
   - Gelung 30-60 tidak pernah selesai. Di penelusur ia akan terus berputar
     sampai dihentikan; pasang titik henti di baris 30 dan perhatikan `freq`
     yang tidak pernah berubah.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.v.OCTAVE = -2; m.v.NOTE = 1; m.v.LENGTH = 1;
      } },
    { baris: 20, jalan: function (m) { m.mainkan('o0 t255'); } },
    /* 30 rumus tangga nada bertemperamen sama. Nada 10 adalah A, dan
       (10-10)/12 = 0, jadi dengan oktaf 0 hasilnya tepat 440 Hz. */
    { baris: 30, jalan: function (m) {
        m.v.FREQ = 440 * Math.pow(2, m.v.OCTAVE + (m.v.NOTE - 10) / 12);
      } },
    { baris: 40, jalan: function (m) { m.suara(m.v.FREQ, m.v.LENGTH); } },
    { baris: 50, jalan: function (m) { m.mainkan('c'); } },
    /* 60 kembali ke 30 — tanpa satu pun baris yang menaikkan `note` atau
       `octave`. Gelung yang tidak pernah maju dan tidak pernah selesai. */
    { baris: 60, jalan: function (m) { m.lompat(30); } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['OCTAVE'] = {
    nama: 'OCTAVE',
    judul: 'Octave (rumus frekuensi nada)',
    sumber: 'OCTAVE',
    berkas: 'run/OCTAVE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur OCTAVE.BAS',
      simpul: [
        { id: 'awal', baris: '10-20', jenis: 'mulai',
          teks: ['oktaf -2, nada 1,', 'panjang 1'] },
        { id: 'hitung', baris: '30',
          teks: ['freq = 440 * 2 ^', '(oktaf + (nada-10)/12)'] },
        { id: 'bunyi', baris: '40-50',
          teks: ['SOUND frekuensinya,', 'lalu PLAY "c"'] },
        { id: 'putar', baris: '60', jenis: 'galat',
          teks: ['Kembali ke 30 —', 'tanpa mengubah apa pun'] }
      ],
      panah: [
        { dari: 'awal', ke: 'hitung' },
        { dari: 'hitung', ke: 'bunyi' },
        { dari: 'bunyi', ke: 'putar' },
        { dari: 'putar', ke: 'hitung', label: 'selamanya', jenis: 'galat' }
      ]
    },

    pseudokode: [
      { baris: 10, tingkat: 0, teks: 'oktaf = &minus;2, nada = 1, panjang = 1' },
      { baris: 30, tingkat: 0, teks: '<code>freq = 440 &times; 2 ^ (oktaf + (nada &minus; 10) / 12)</code>' },
      { baris: 30, tingkat: 1, teks: '440 Hz = nada A; tiap nada naik = &times; akar dua belas dari dua' },
      { baris: 40, tingkat: 0, teks: 'bunyikan frekuensinya' },
      { baris: 60, tingkat: 0, teks: '<b>kembali ke baris 30 &mdash; tanpa menaikkan nada atau oktaf</b>' }
    ],

    perintahAsli: 'run\\OCTAVE.bat',
    catatanAsli: 'Di DOSBox-X program ini membunyikan satu nada yang sama ' +
      'berulang-ulang sampai dihentikan dengan Ctrl-Break.',

    penyimpangan: [
      '<b><code>SOUND</code> dan <code>PLAY</code> tidak berbunyi</b>, dan ' +
      'program ini tidak punya keluaran lain. Layarnya tetap kosong.',

      '<b>Gelung 30&ndash;60 tidak pernah selesai.</b> Di penelusur ia terus ' +
      'berputar sampai dihentikan. Pasang titik henti di baris 30 dan ' +
      'perhatikan <code>FREQ</code> yang tidak pernah berubah.'
    ],

    pelajaran: {
      ringkas: 'Rumus tangga nada bertemperamen sama dalam satu baris ' +
        '&mdash; dan sebuah gelung yang lupa menaikkan pencacahnya.',
      pelajari: [
        ['Seluruh tangga nada dalam satu rumus',
         '<code>440 * 2 ^ (octave + (note - 10) / 12)</code>. Naik satu ' +
         'oktaf berarti menggandakan frekuensi; satu oktaf punya dua belas ' +
         'nada; jadi satu nada naik = mengalikan dengan <b>akar dua belas ' +
         'dari dua</b> (sekitar 1,0595). Itulah temperamen sama, sistem yang ' +
         'dipakai hampir seluruh musik Barat sejak abad ke-18 &mdash; dan ' +
         'seluruhnya muat dalam satu ungkapan.'],
        ['Kenapa 440 dan kenapa dikurangi 10',
         '440 Hz adalah A di atas C tengah, acuan penyeteman internasional. ' +
         'Nada dinomori 1 sampai 12 mulai dari C, jadi A adalah nomor 10 ' +
         '&mdash; dan <code>(10-10)/12 = 0</code> membuat rumusnya menghasilkan ' +
         'tepat 440 waktu oktafnya nol. <b>Konstanta di dalam rumus dipilih ' +
         'supaya kasus acuannya jadi sederhana.</b>'],
        ['Program sebagai catatan rumus',
         'Sama seperti WHATMONF.BAS, berkas ini lebih berguna dibaca ' +
         'daripada dijalankan. Yang disimpan bukan programnya melainkan ' +
         '<b>baris 30</b>.']
      ],
      hindari: [
        ['Gelung yang tidak pernah maju',
         'Baris 60 kembali ke 30, dan tidak ada satu baris pun di antaranya ' +
         'yang mengubah <code>note</code> atau <code>octave</code>. Yang ' +
         'jelas dimaksudkan &mdash; menaikkan nada satu per satu untuk ' +
         'memperdengarkan tangga nadanya &mdash; tidak pernah ditulis.'],
        ['Tidak ada jalan keluar',
         'Tidak ada <code>INKEY$</code>, tidak ada batas pencacah, tidak ada ' +
         '<code>END</code>. Satu-satunya cara menghentikannya adalah ' +
         'Ctrl-Break.'],
        ['Variabel yang disetel dan tidak berguna',
         '<code>PLAY "o0 t255"</code> di baris 20 menyetel oktaf dan tempo ' +
         'untuk <code>PLAY</code>, tapi baris 40 memakai <code>SOUND</code> ' +
         'yang tidak peduli pada keduanya. Dan <code>PLAY "c"</code> di baris ' +
         '50 membunyikan nada yang sama sekali tidak berhubungan dengan ' +
         '<code>freq</code> yang baru saja dihitung.']
      ]
    },

    penjelasan: [
      { judul: 'Satu baris yang memuat seluruh tangga nada',
        isi: [
          'Baris 30 adalah alasan berkas ini ada:',
          '<code>freq = 440 * (2 ^ (octave + (note - 10) / 12))</code>',
          'Dua kenyataan fisika dan satu kesepakatan manusia, digabung:',
          '<b>Naik satu oktaf = frekuensi berlipat dua.</b> Itu fisika: ' +
          'senar setengah panjang bergetar dua kali lebih cepat, dan telinga ' +
          'mendengar keduanya sebagai "nada yang sama".',
          '<b>Satu oktaf dibagi dua belas.</b> Itu kesepakatan &mdash; ' +
          'temperamen sama, kompromi yang membuat semua tangga nada ' +
          'sama-sama sedikit sumbang tapi bisa dimainkan di alat yang sama.',
          'Gabungannya: satu nada naik berarti mengalikan dengan ' +
          '<code>2^(1/12)</code>, kira-kira 1,059463. Dua belas kali ' +
          'mengalikannya menghasilkan tepat 2.',
          '<b>440 Hz sebagai jangkar.</b> Itu kesepakatan internasional untuk ' +
          'nada A. Dan <code>(note-10)</code> memilih A sebagai titik nol, ' +
          'karena A adalah nada kesepuluh kalau dihitung dari C.',
          'Ada satu hal yang mudah terlewat waktu membaca rumus ini: ' +
          '<code>octave</code> tidak dikalikan apa pun. Ia langsung ' +
          'ditambahkan ke eksponen &mdash; karena naik satu oktaf memang ' +
          'berarti menambah <b>satu</b> ke eksponen dua. Bilangan pecahan ' +
          '<code>(note-10)/12</code> mengurus sisanya.',
          'Baris 180 NOTETABL.BAS memakai rumus yang persis sama untuk ' +
          'mencetak tabel frekuensi delapan oktaf ke printer. Dua berkas, ' +
          'satu rumus &mdash; dan yang satu lagi benar-benar memakainya.'
        ] },
      { judul: 'Gelung yang lupa maju',
        isi: [
          'Baris 60: <code>GOTO 30</code>.',
          'Yang jelas dimaksudkan: mainkan nada 1, lalu nada 2, lalu 3, sampai ' +
          '12, lalu naik oktaf. Memperdengarkan tangga nada yang barusan ' +
          'dihitung.',
          'Yang tertulis: hitung ulang frekuensi yang sama, bunyikan lagi, ' +
          'ulangi. Selamanya.',
          'Satu baris yang hilang &mdash; <code>note = note + 1</code>, dengan ' +
          'penjagaan supaya berpindah oktaf sesudah dua belas &mdash; dan ' +
          'program ini akan mengerjakan apa yang namanya janjikan.',
          'Di penelusur cacat ini terlihat dengan cara yang tidak mungkin ' +
          'terlihat di mesin sungguhan. Di DOSBox-X yang terdengar cuma ' +
          '"nada yang sama terus"; bisa saja itu memang maunya. Di sini, ' +
          'panel variabel memperlihatkan <code>NOTE</code> tetap 1 dan ' +
          '<code>FREQ</code> tetap di angka yang sama ronde demi ronde. ' +
          '<b>Gelung yang tidak maju terlihat sebagai angka yang tidak ' +
          'berubah.</b>'
        ] }
    ]
  };
})(window);
