/* ===========================================================================
   NOTETABL.js — porting minimalis NOTETABL.BAS sebagai tabel baris.

   Dua puluh enam baris yang mencetak tabel delapan oktaf ke PRINTER: nomor
   nada, namanya, frekuensinya dalam hertz, dan satu kolom terakhir yang jadi
   alasan berkas ini ada:

       180 pitch = CINT(125000 / freq)

   Itu bukan angka musik. Itu angka PERANGKAT KERAS — bilangan pembagi yang
   harus dimasukkan ke pencacah waktu 8253 supaya pengeras suara PC berbunyi
   pada frekuensi itu. Cip pencacahnya berdetak 1,193 MHz; membaginya dengan
   angka ini menghasilkan nadanya.

   Jadi tabel ini adalah JEMBATAN: dari "nada A oktaf 4" ke "angka yang
   dipoke ke port 42h". Sembilan puluh enam baris terjemahan, dicetak sekali,
   lalu ditempel di dinding.

   OCTAVE.BAS menyimpan rumus frekuensinya. Berkas ini yang benar-benar
   MEMAKAINYA — dan menambahkan satu langkah lagi sesudahnya.

   Penyimpangan:

   - `LPRINT` menulis ke printer, dan penelusur tidak punya printer. Seluruh
     keluarannya dibelokkan ke LAYAR. Tanpa itu berkas ini tidak akan
     memperlihatkan apa pun sama sekali.
   - Layar 80x25 cuma memuat 25 baris; tabel ini 8 oktaf x 17 baris. Yang
     terlihat adalah bagian yang tergulung terakhir. Pasang titik henti di
     baris 170 untuk melihatnya satu nada per langkah.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    /* 10 `OPTION BASE 1` — indeks larik mulai dari 1, bukan 0. Perintah yang
       jarang dipakai, dan di sini tidak berpengaruh apa-apa: lariknya memang
       cuma diisi 1 sampai 12. */
    { baris: 10, jalan: function () { } },
    { baris: 20, jalan: function (m) { m.cls(); } },
    { baris: 30, jalan: function (m) {
        m.v.NOTENO = 1; m.dim('NOTENAME$', 12);
      } },
    { baris: 40, jalan: function (m) { m.untuk('COUNT', 1, 12, 1, 70); } },
    { baris: 50, jalan: function (m) {
        m.v['NOTE$'] = m.baca();
        m.v['NOTENAME$'][m.v.COUNT] = m.v['NOTE$'];
      } },
    { baris: 60, jalan: function (m) { m.lanjutkan('COUNT'); } },
    /* 70 delapan oktaf: -3 sampai 4. Oktaf 0 di sini adalah oktaf C tengah
       (261,6 Hz), karena rumus baris 170 memakai A 440 Hz sebagai jangkar. */
    { baris: 70, jalan: function (m) { m.untuk('OCT', -3, 4, 1, 250); } },
    /* 80-150 `LPRINT` tanpa argumen berarti "baris baru"; titik koma di
       ujung berarti "jangan tutup barisnya". Baris 90 mencetak 79 tanda
       hubung tanpa penutup, dan baris 100 yang menutupnya. */
    { baris: 80, jalan: function (m) { m.barisBaru(); m.barisBaru(); } },
    { baris: 90, jalan: function (m) { m.cetakPrinter(ulang('-', 79)); } },
    { baris: 100, jalan: function (m) { m.barisBaru(); m.tab(30); } },
    /* 110 angka dalam kurung adalah `oct + 2`. Kalau yang dimaksud nomor
       oktaf untuk perintah PLAY, angkanya meleset satu: PLAY menyebut oktaf
       C tengah sebagai 3, sedangkan penomoran program ini menyebutnya 0 —
       jadi seharusnya `oct + 3`. Belum diperiksa di GW-BASIC sungguhan. */
    { baris: 110, jalan: function (m) {
        m.cetakPrinter('OCTAVE ' + angka(m.v.OCT) + '(' +
                       angka(m.v.OCT + 2) + ')');
        m.barisBaru();
      } },
    { baris: 120, jalan: function (m) { m.cetakPrinter(ulang('-', 79)); } },
    { baris: 130, jalan: function (m) {
        m.cetakPrinter('NOTE NUMBER       NOTE          ');
      } },
    { baris: 140, jalan: function (m) {
        m.cetakPrinter('FREQUENCY IN Htz    PITCH NUMBER'); m.barisBaru();
      } },
    { baris: 150, jalan: function (m) { m.barisBaru(); } },
    { baris: 160, jalan: function (m) { m.untuk('NOTE', 1, 12, 1, 240); } },
    /* 170 rumus yang sama persis dengan OCTAVE.BAS baris 30 — tapi di sini
       `note` dan `oct` benar-benar berjalan lewat dua gelung bersarang. */
    { baris: 170, jalan: function (m) {
        m.v.FREQ = 440 * Math.pow(2, m.v.OCT + (m.v.NOTE - 10) / 12);
      } },
    /* 180 dan inilah langkah tambahannya: frekuensi jadi PEMBAGI PENCACAH.
       1.193.180 Hz dibagi 9,5 kira-kira 125.000 — dan itulah satuan yang
       dipakai GW-BASIC untuk perintah SOUND. */
    { baris: 180, jalan: function (m) {
        m.v.PITCH = cint(125000 / m.v.FREQ);
      } },
    { baris: 190, jalan: function (m) {
        m.tab(3); m.cetakPrinter(angka(m.v.NOTENO));
      } },
    { baris: 200, jalan: function (m) {
        m.tab(19);
        m.cetakPrinter(m.v['NOTENAME$'][m.v.NOTE] + angka(m.v.OCT));
      } },
    { baris: 210, jalan: function (m) {
        m.tab(35); m.cetakPrinter(angka(m.v.FREQ));
      } },
    { baris: 220, jalan: function (m) {
        m.tab(57); m.cetakPrinter(angka(m.v.PITCH)); m.barisBaru();
      } },
    { baris: 230, jalan: function (m) { m.v.NOTENO = m.v.NOTENO + 1; } },
    { baris: 240, jalan: function (m) { m.lanjutkan('NOTE'); } },
    { baris: 250, jalan: function (m) { m.lanjutkan('OCT'); } },
    { baris: 260, jalan: function () { /* DATA nama kedua belas nada */ } }
  ];

  function ulang(s, n) { var k = '', i; for (i = 0; i < n; i++) k += s; return k; }

  /* Angka BASIC dicetak dengan spasi di depan (tempat tanda minus) dan satu
     spasi di belakang. Pecahan dipendekkan ke enam angka berarti, seperti
     presisi tunggal GW-BASIC. */
  function angka(n) {
    var b = Number(n);
    var s = (Math.abs(b) >= 1e6 || (b !== 0 && Math.abs(b) < 1e-4))
      ? b.toExponential(5) : String(Math.round(b * 1e6) / 1e6);
    if (s.indexOf('.') >= 0) s = s.replace(/(\.\d{0,5})\d*$/, '$1').replace(/\.?0+$/, '');
    return (b < 0 ? '' : ' ') + s + ' ';
  }

  /* CINT membulatkan ke bilangan bulat terdekat, setengah menjauh dari nol. */
  function cint(x) {
    return x < 0 ? -Math.round(-x) : Math.round(x);
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['NOTETABL'] = {
    nama: 'NOTETABL',
    judul: 'Note Table (tabel nada, frekuensi, dan pembagi pencacah)',
    sumber: 'NOTETABL',
    berkas: 'run/NOTETABL.BAS',
    tabel: tabel,
    data: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],

    arsitektur: {
      judul: 'Alur NOTETABL.BAS',
      simpul: [
        { id: 'nama', baris: '30-60', jenis: 'mulai',
          teks: ['Baca dua belas nama nada', 'dari DATA'] },
        { id: 'oktaf', baris: '70', jenis: 'putusan',
          teks: ['Delapan oktaf: -3 sampai 4'] },
        { id: 'kepala', baris: '80-150',
          teks: ['Cetak kepala tabel', 'ke printer'] },
        { id: 'nada', baris: '160', jenis: 'putusan',
          teks: ['Dua belas nada per oktaf'] },
        { id: 'hitung', baris: '170-180',
          teks: ['Frekuensi dari rumus,', 'lalu pembagi pencacah'] },
        { id: 'baris', baris: '190-230',
          teks: ['Cetak satu baris:', 'nomor, nama, Hz, pembagi'] }
      ],
      panah: [
        { dari: 'nama', ke: 'oktaf' },
        { dari: 'oktaf', ke: 'kepala' },
        { dari: 'kepala', ke: 'nada' },
        { dari: 'nada', ke: 'hitung' },
        { dari: 'hitung', ke: 'baris' },
        { dari: 'baris', ke: 'nada', label: 'nada berikutnya' },
        { dari: 'nada', ke: 'oktaf', label: 'oktaf berikutnya' }
      ]
    },

    pseudokode: [
      { baris: 30, tingkat: 0, teks: 'baca dua belas nama nada: C, C#, D, &hellip;, B' },
      { baris: 70, tingkat: 0, teks: '<b>ULANG delapan oktaf</b> (&minus;3 sampai 4):' },
      { baris: 80, tingkat: 1, teks: 'cetak kepala tabel ke <b>printer</b>' },
      { baris: 160, tingkat: 1, teks: '<b>ULANG dua belas nada:</b>' },
      { baris: 170, tingkat: 2, teks: '<code>freq = 440 &times; 2 ^ (oktaf + (nada&minus;10)/12)</code>' },
      { baris: 180, tingkat: 2, teks: '<code>pitch = CINT(125000 / freq)</code> &mdash; <b>pembagi pencacah 8253</b>' },
      { baris: 190, tingkat: 2, teks: 'cetak satu baris: nomor, nama+oktaf, hertz, pembagi' }
    ],

    perintahAsli: 'run\\NOTETABL.bat',
    catatanAsli: 'Program ini mencetak ke PRINTER. Di DOSBox-X tanpa printer ' +
      'terpasang ia akan menggantung atau melempar galat "Device fault" — ' +
      'jalankan hanya kalau printernya benar-benar ada.',

    penyimpangan: [
      '<b><code>LPRINT</code> dibelokkan ke layar.</b> Penelusur tidak punya ' +
      'printer, dan tanpa pembelokan ini berkas tersebut tidak akan ' +
      'memperlihatkan apa pun sama sekali. Ini penyimpangan yang paling besar ' +
      'di berkas ini: yang Anda lihat di layar, di aslinya keluar di kertas.',

      '<b>Layar 80&times;25 tidak muat.</b> Tabelnya delapan oktaf dikali ' +
      'tujuh belas baris; yang terlihat cuma bagian yang tergulung terakhir. ' +
      'Pasang titik henti di baris 170 untuk melihatnya satu nada per langkah.',

      '<b><code>OPTION BASE 1</code> tidak ditiru.</b> Larik penelusur tetap ' +
      'mulai dari 0; di program ini tidak berpengaruh karena lariknya memang ' +
      'cuma diisi 1 sampai 12.'
    ],

    pelajaran: {
      ringkas: 'Tabel yang menerjemahkan nada musik jadi angka perangkat ' +
        'keras. Yang layak dipelajari: kenapa 125000, dan apa gunanya sebuah ' +
        'tabel dicetak sekali lalu ditempel di dinding.',
      pelajari: [
        ['Dua langkah terjemahan',
         'Baris 170 mengubah <b>nama nada</b> jadi <b>frekuensi</b> ' +
         '(matematika musik). Baris 180 mengubah frekuensi jadi <b>pembagi ' +
         'pencacah</b> (matematika perangkat keras). Dua dunia berbeda, ' +
         'disambung dua baris.'],
        ['Rumus yang disimpan di satu berkas dan dipakai di berkas lain',
         'Baris 170 sama persis dengan OCTAVE.BAS baris 30 &mdash; tapi di ' +
         'sana ia dihitung sekali dan tidak pernah maju; di sini ia berjalan ' +
         'lewat dua gelung bersarang, 96 nada. <b>Satu rumus, satu berkas ' +
         'yang menyimpannya, satu berkas yang memakainya.</b>'],
        ['Keluaran yang bukan untuk layar',
         'Seluruh 26 barisnya memakai <code>LPRINT</code>. Tabel 96 baris ' +
         'tidak muat di layar 25 baris, dan tidak ada gunanya digulung ' +
         '&mdash; yang dibutuhkan adalah <b>kertas</b> yang bisa ditempel di ' +
         'dekat mesin. Program yang keluarannya benda fisik.'],
        ['Tabel sebagai pengganti perhitungan',
         'Setelah dicetak, program ini tidak dibutuhkan lagi. Yang dipakai ' +
         'setiap hari adalah kertasnya. Itu pola yang tetap masuk akal hari ' +
         'ini: hitung sekali, simpan hasilnya, jangan hitung ulang.']
      ],
      hindari: [
        ['Angka ajaib tanpa penjelasan',
         '<code>125000</code> di baris 180 tidak dijelaskan di mana pun. Itu ' +
         'frekuensi detak pencacah 8253 dibagi konstanta GW-BASIC &mdash; ' +
         'satu <code>REM</code> akan menghemat setengah jam pembacanya.'],
        ['Nomor yang mungkin meleset satu',
         'Baris 110 mencetak <code>oct + 2</code> dalam kurung. Kalau itu ' +
         'dimaksudkan sebagai nomor oktaf untuk perintah <code>PLAY</code>, ' +
         'angkanya meleset: <code>PLAY</code> menyebut oktaf C tengah sebagai ' +
         '<b>3</b>, sedangkan penomoran program ini menyebutnya <b>0</b>. ' +
         '<i>Belum diperiksa di GW-BASIC sungguhan.</i>'],
        ['Tidak ada cara berhenti',
         'Delapan oktaf dicetak tanpa jeda dan tanpa tawaran membatalkan. Di ' +
         'printer titik-matriks 1982, itu sekitar dua menit yang tidak bisa ' +
         'dihentikan selain dengan mematikan printernya.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa 125000',
        isi: [
          'Baris 180 adalah alasan berkas ini ada:',
          '<code>pitch = CINT(125000 / freq)</code>',
          'Pengeras suara IBM PC tidak bisa diberi tahu "bunyikan 440 Hz". ' +
          'Yang bisa dilakukan cuma satu: memasukkan sebuah <b>bilangan ' +
          'pembagi</b> ke cip pencacah waktu 8253. Cip itu berdetak pada ' +
          '1.193.180 Hz, dan membagi detaknya dengan bilangan itu &mdash; ' +
          'hasilnya gelombang persegi yang menggerakkan pengeras suaranya.',
          'Jadi untuk mendapat 440 Hz, pembaginya 1.193.180 / 440 = 2712.',
          'Lalu dari mana 125.000? Karena GW-BASIC tidak memakai satuan ' +
          'mentah itu. Perintah <code>SOUND</code> menerima frekuensi ' +
          'langsung, dan angka yang ada di tabel ini adalah satuan yang ' +
          'dipakai <b>di tempat lain</b> &mdash; sekitar sepersembilan-setengah ' +
          'dari detak cipnya.',
          'Yang penting bukan angka pastinya, melainkan <b>bentuk</b> ' +
          'masalahnya: musik berpikir dalam nama nada, perangkat keras ' +
          'berpikir dalam pembagi, dan sesuatu harus menjembatani keduanya. ' +
          'Berkas ini adalah jembatan itu, dicetak di atas kertas.',
          'Dan itu menjelaskan kenapa keluarannya <code>LPRINT</code> dan ' +
          'bukan <code>PRINT</code>. Tabel ini bukan untuk dibaca sekali ' +
          'lalu hilang; ia untuk <b>ditempel di dinding</b> dan dilihat ' +
          'berkali-kali sambil menulis program lain.'
        ] },
      { judul: 'Rumus yang berjalan',
        isi: [
          'OCTAVE.BAS dan berkas ini memuat baris yang sama persis:',
          '<code>freq = 440 * (2 ^ (oct + (note - 10) / 12))</code>',
          'Bedanya: di OCTAVE.BAS ia dihitung dengan <code>note</code> dan ' +
          '<code>octave</code> yang <b>tidak pernah berubah</b> &mdash; ' +
          'gelungnya lupa maju. Di sini ia berada di dalam dua gelung ' +
          'bersarang yang benar:',
          '<code>70  FOR oct = -3 TO 4</code><br>' +
          '<code>160   FOR note = 1 TO 12</code>',
          'Delapan oktaf dikali dua belas nada = <b>96 baris</b>, dari sekitar ' +
          '16 Hz (di bawah batas pendengaran) sampai sekitar 6.600 Hz.',
          'Perhatikan juga <code>noteno</code> di baris 230: sebuah pencacah ' +
          'yang berjalan terus melewati batas oktaf, jadi kolom pertama ' +
          'tabelnya menomori nada 1 sampai 96 berurutan. Nomor itu tidak ' +
          'dipakai perhitungan apa pun &mdash; gunanya semata-mata supaya ' +
          'orang bisa menunjuk "nada nomor 58" tanpa menyebut oktaf.',
          'Di penelusur, dua gelung bersarang ini adalah contoh yang bagus ' +
          'untuk dilihat melangkah: pasang titik henti di baris 170 dan ' +
          'perhatikan <code>OCT</code> yang bertahan dua belas putaran ' +
          'sementara <code>NOTE</code> berputar penuh.'
        ] }
    ]
  };
})(window);
