/* ===========================================================================
   DREAM.js — porting minimalis DREAM.BAS sebagai tabel baris.

   Delapan belas baris: lima belas mengisi variabel, tiga memainkannya. Dan
   di ketiga baris terakhir itu ada perintah yang membuat berkas ini menarik:

       PLAY "XA$;XB$;XC$;XD$;XA$;XB$;XC$;"

   `X<variabel>$;` adalah perintah "jalankan string ini" DI DALAM bahasa
   makro PLAY. Bukan penggabungan string oleh BASIC — penafsir PLAY sendiri
   yang berhenti, membaca isi variabel itu, memainkannya, lalu kembali.

   Dengan kata lain: bahasa makro musik ini punya SUBRUTIN-nya sendiri. Dan
   begitu ada subrutin, bentuk musik bisa ditulis sebagai struktur:

       A B C D A B C    <- baris 160: bait, diulang dengan akhiran berbeda
       E F G H I J K    <- baris 170: bagian tengah
       L M N O          <- baris 180: penutup

   Lima belas potongan, dipakai sembilan belas kali. Itu penghematan yang
   nyata di mesin yang seluruh programnya harus muat di memori.

   Penyimpangan:

   - `PLAY` tidak berbunyi, jadi tidak ada keluaran sama sekali. Layar
     penelusur tetap kosong; yang bisa dilihat adalah lima belas makro di
     panel sumber, dan urutan pemakaiannya di tiga baris terakhir.
   =========================================================================== */

(function (global) {
  'use strict';

  var POTONGAN = [
    [10, 'A', 'O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G'],
    [20, 'B', 'MLL4A.MNL8AFGAGFMLL2A.MNL8AP8A'],
    [30, 'C', 'MLL4B.MNL8BEFGABO4CO3MLL4FF.MNFL8G'],
    [40, 'D', 'MLL4A.MNL8ADEFGAMLL2B.MNL4B'],
    [50, 'E', 'MLL4A.MNL8AFGABO4CL2D.L8CDCL4MLE.MNEL8CCDC'],
    [60, 'F', 'MLL4E.MNEL8CCDCEO3MLL4BMNBL8O4CDCO3B'],
    [70, 'G', 'MLL4O4D.MNDL8O3AO4CO3BAO4L4MLC.MNL8CO3ABO4CO3BA'],
    [80, 'H', 'MLO4L4C.MNL8CCDEDCEDCECDEFE'],
    [90, 'I', 'MLL2D.MNL8DDEMLL4F.MNL8FEDFED'],
    [100, 'J', 'MLL4F.MNL8FEFEDCO3MLL2B.MNL8BBO4C'],
    [110, 'K', 'MLL4D.MNL8DCO3BO4DCO3BO4MLL4D.MNL8DCDCO3BA'],
    [120, 'L', 'MLL2A-.MNL8A-EFMLL4G.MNL8GEFGFE'],
    [130, 'M', 'MLL2G.MNL8GFGMLL4A.MNL8AFGAGF'],
    [140, 'N', 'MLL2A.MNL8AGAMLL4B.MNL8BEFGABO4CO3MLL4FF.MNFO4L8C'],
    [150, 'O', 'MLL4E.MNL8EP8CDEDCO5MLL2C.L4C.C']
  ];

  var tabel = POTONGAN.map(function (p) {
    return { baris: p[0], jalan: function (m) { m.v[p[1] + '$'] = p[2]; } };
  });

  /* Tiga baris terakhir: bentuk lagunya. `X..$;` di dalam makro berarti
     "mainkan isi variabel itu, lalu lanjutkan di sini". */
  tabel.push(bentuk(160, ['A', 'B', 'C', 'D', 'A', 'B', 'C']));
  tabel.push(bentuk(170, ['E', 'F', 'G', 'H', 'I', 'J', 'K']));
  tabel.push(bentuk(180, ['L', 'M', 'N', 'O']));

  function bentuk(nomor, urutan) {
    return { baris: nomor, jalan: function (m) {
      var s = '', i;
      for (i = 0; i < urutan.length; i++) s += m.v[urutan[i] + '$'];
      m.mainkan(s);
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['DREAM'] = {
    nama: 'DREAM',
    judul: 'Dream (lagu dengan subrutin musik)',
    sumber: 'DREAM',
    berkas: 'run/DREAM.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur DREAM.BAS',
      simpul: [
        { id: 'isi', baris: '10-150', jenis: 'mulai',
          teks: ['Lima belas potongan musik', 'disimpan di A$ sampai O$'] },
        { id: 'bait', baris: '160',
          teks: ['A B C D A B C —', 'bait dengan dua akhiran'] },
        { id: 'tengah', baris: '170',
          teks: ['E F G H I J K —', 'bagian tengah'] },
        { id: 'tutup', baris: '180', jenis: 'keluar',
          teks: ['L M N O —', 'penutup'] }
      ],
      panah: [
        { dari: 'isi', ke: 'bait' },
        { dari: 'bait', ke: 'tengah' },
        { dari: 'tengah', ke: 'tutup' }
      ]
    },

    pseudokode: [
      { baris: 10, tingkat: 0, teks: 'simpan lima belas potongan musik di <code>A$</code> sampai <code>O$</code>' },
      { baris: 160, tingkat: 0, teks: '<code>PLAY "XA$;XB$;XC$;XD$;XA$;XB$;XC$;"</code>' },
      { baris: 160, tingkat: 1, teks: '<code>X&lt;var&gt;$;</code> = <b>"jalankan string itu"</b>, di dalam bahasa PLAY sendiri' },
      { baris: 160, tingkat: 1, teks: 'A B C D <b>A B C</b> &mdash; bait yang diulang dengan akhiran berbeda' },
      { baris: 170, tingkat: 0, teks: 'bagian tengah: tujuh potongan baru' },
      { baris: 180, tingkat: 0, teks: 'penutup: empat potongan' }
    ],

    perintahAsli: 'run\\DREAM.bat',
    catatanAsli: 'Satu-satunya cara mendengarnya. Sekitar satu menit, dan ' +
      'strukturnya terdengar jelas: bait, tengah, penutup.',

    penyimpangan: [
      '<b><code>PLAY</code> tidak berbunyi</b>, dan program ini tidak punya ' +
      'keluaran lain. Layarnya tetap kosong.',

      '<b>Perintah <code>X&lt;var&gt;$;</code> ditiru sebagai penggabungan ' +
      'string biasa.</b> Hasil bunyinya akan sama; bedanya cuma bahwa di ' +
      'GW-BASIC yang sungguhan penafsir PLAY-lah yang melompat ke variabel ' +
      'itu dan kembali, bukan BASIC yang menyambung stringnya lebih dulu.'
    ],

    pelajaran: {
      ringkas: 'Sebuah lagu yang disusun dari lima belas potongan dan ' +
        'dimainkan lewat "subrutin" milik bahasa makro PLAY sendiri.',
      pelajari: [
        ['Bahasa makro yang punya subrutin',
         '<code>X&lt;variabel&gt;$;</code> memberi tahu penafsir PLAY untuk ' +
         'berhenti, memainkan isi variabel itu, lalu kembali dan melanjutkan. ' +
         'Persis <code>GOSUB</code>, tapi di dalam bahasa yang hidup di ' +
         'dalam tanda kutip. <b>Sebuah bahasa kecil yang cukup lengkap untuk ' +
         'punya pemanggilan.</b>'],
        ['Bentuk musik sebagai struktur data',
         'Baris 160 adalah <code>A B C D A B C</code>. Itu bukan sekadar ' +
         'urutan &mdash; itu <b>bentuk lagunya</b>, ditulis sebagai daftar. ' +
         'Mengubah susunan baitnya berarti mengetik ulang tujuh huruf, bukan ' +
         'menyalin ratusan nada.'],
        ['Lima belas potongan, sembilan belas pemakaian',
         'A, B, dan C masing-masing dipakai dua kali. Di mesin yang seluruh ' +
         'programnya harus muat di memori, mengulang <b>nama</b> alih-alih ' +
         'mengulang <b>isinya</b> adalah penghematan yang langsung terasa ' +
         '&mdash; dan alasan yang sama kenapa subrutin ditemukan.'],
        ['Satu huruf per potongan',
         'A$ sampai O$ &mdash; lima belas variabel dengan nama satu huruf. ' +
         'Di sini itu justru <b>tepat</b>: potongannya tidak punya arti ' +
         'sendiri-sendiri, dan yang penting adalah urutannya di baris 160. ' +
         'Bandingkan dengan nama satu huruf di program lain, yang hampir ' +
         'selalu menyembunyikan sesuatu yang punya nama.']
      ],
      hindari: [
        ['Struktur yang tidak dijelaskan satu kata pun',
         'Tidak ada <code>REM</code> di seluruh berkas. Bahwa baris 160 ' +
         'adalah bait, 170 bagian tengah, dan 180 penutup harus disimpulkan ' +
         'sendiri &mdash; atau didengar.'],
        ['Tidak ada tanda kehidupan',
         'Sama seperti GERMFOLK.BAS: tidak ada judul, tidak ada nama lagu, ' +
         'tidak ada "tekan tombol untuk berhenti". Nama berkasnya, ' +
         '<code>DREAM</code>, adalah satu-satunya petunjuk tentang apa yang ' +
         'sedang dimainkan.']
      ]
    },

    penjelasan: [
      { judul: 'Subrutin di dalam tanda kutip',
        isi: [
          'GERMFOLK.BAS memperlihatkan bahwa <code>PLAY</code> menerima ' +
          'bahasa makro. Berkas ini memperlihatkan seberapa jauh bahasa itu ' +
          'sebenarnya sampai.',
          'Lima belas baris pertama tidak memainkan apa pun &mdash; mereka ' +
          'cuma mengisi variabel:',
          '<code>10 A$ = "O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G"</code>',
          'Lalu baris 160:',
          '<code>160 PLAY "XA$;XB$;XC$;XD$;XA$;XB$;XC$;"</code>',
          'Perhatikan: string yang diberikan ke <code>PLAY</code> ' +
          '<b>tidak berisi satu pun nada</b>. Isinya tujuh perintah ' +
          '<code>X</code>, dan tiap <code>X</code> berarti "berhenti di sini, ' +
          'mainkan isi variabel ini, lalu lanjutkan".',
          'Ini bukan penggabungan string oleh BASIC. BASIC menyerahkan string ' +
          'itu apa adanya; <b>penafsir PLAY</b> yang membaca huruf ' +
          '<code>X</code>, mencari variabelnya, dan melompat ke sana. ' +
          'Titik koma adalah penutup namanya.',
          'Artinya bahasa makro musik GW-BASIC punya tiga hal yang biasanya ' +
          'dipakai untuk menyebut sesuatu sebagai "bahasa": keadaan yang ' +
          'menempel (oktaf, tempo, artikulasi), data (nada dan durasi), dan ' +
          '<b>pemanggilan</b>.',
          'Perintah kembarannya ada di <code>DRAW</code>: ' +
          '<code>X&lt;variabel&gt;$;</code> di sana berarti "gambar isi ' +
          'variabel ini". Dua bahasa makro, satu perintah yang sama, dan ' +
          'alasan yang sama.'
        ] },
      { judul: 'Bentuk lagu yang bisa dibaca sekali lihat',
        isi: [
          'Tiga baris terakhir program ini adalah <b>peta seluruh lagunya</b>:',
          '<code>160  A B C D A B C</code><br>' +
          '<code>170  E F G H I J K</code><br>' +
          '<code>180  L M N O</code>',
          'Sembilan belas pemakaian dari lima belas potongan. Yang berulang ' +
          'cuma A, B, dan C &mdash; dan letaknya menceritakan bentuknya: ' +
          'sebuah bait dimainkan, diteruskan dengan potongan D, lalu ' +
          'baitnya diulang dan berhenti di C. Itu bentuk "bait dengan dua ' +
          'akhiran", salah satu yang paling tua di musik rakyat.',
          'Yang layak diperhatikan sebagai <b>pemrograman</b>, bukan musik: ' +
          'informasi tentang struktur dipisahkan sepenuhnya dari isinya. ' +
          'Lima belas baris berisi <i>apa</i>; tiga baris berisi <i>dalam ' +
          'urutan apa</i>.',
          'Mengubah lagunya jadi A B C D A B C <b>D</b> berarti mengetik satu ' +
          'huruf. Kalau nadanya disalin-tempel seperti GERMFOLK.BAS, ' +
          'perubahan yang sama berarti menyalin tiga puluh nada dan berharap ' +
          'tidak ada yang tertinggal.',
          'Di penelusur, kedua lapisan itu terlihat terpisah: lima belas ' +
          'baris pertama berjalan tanpa satu pun bunyi atau perubahan layar ' +
          '&mdash; cuma variabel yang terisi &mdash; lalu tiga baris terakhir ' +
          'memakai semuanya sekaligus.'
        ] }
    ]
  };
})(window);
