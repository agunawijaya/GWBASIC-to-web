/* ===========================================================================
   READING.js — porting minimalis READING.BAS sebagai tabel baris.

   Tiga puluh sembilan baris: sebuah TACHISTOSCOPE. Kata dikedipkan sekejap
   di tengah layar, pemakai mengetik apa yang sempat dibacanya, dan lamanya
   kedipan disesuaikan menurut betul-salahnya. Alat latih kecepatan membaca
   yang di sekolah 1970-an berupa mesin proyektor seharga ratusan dolar.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) PROGRAM INI MENYAMBUNG DIRINYA SENDIRI. Baris 74:
           CHAIN MERGE "words", 75, ALL
       WORDS.BAS dimuat dan baris-barisnya DISISIPKAN ke program yang sedang
       berjalan, lalu jalannya diteruskan di baris 75 dengan seluruh variabel
       dipertahankan. Sesudah baris itu, program yang berjalan bukan lagi
       yang ada di berkas.

   (2) MENGHITUNG DATA DENGAN CARA MENABRAK. Baris 1000-1050 tidak punya cara
       menanyakan "ada berapa butir DATA?" — jadi ia MEMBACA TERUS sampai
       BASIC melempar galat "Out of DATA", dan menangkap galat itu sebagai
       tanda selesai. Pencacahnya, `L`, adalah jumlah yang terbaca sebelum
       tabrakan.

   (3) KESULITAN YANG MENYESUAIKAN DIRI. `T1` adalah lama kedipan. Benar
       berarti T1 berkurang (lebih cepat, lebih sulit); salah berarti
       bertambah. Satu variabel, dan permainannya menyetel dirinya ke
       pembacanya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `CHAIN MERGE` ditiru dengan MENYAMBUNG antrean DATA milik WORDS.BAS ke
     antrean program ini. Baris-baris WORDS.BAS tidak muncul di panel sumber
     — tapi karena seluruhnya `DATA`, tidak ada satu pun yang akan pernah
     disorot sebagai baris yang berjalan.
   - `PLAY` diam, jadi bunyi benar (tiga nada naik) dan bunyi salah (dua
     dengung rendah) tidak terdengar.
   - Gelung tunda di baris 140 dan gelung penunggu waktu di 2000-2020 habis
     seketika, jadi kedipannya tidak berkedip: kata itu muncul dan langsung
     hilang di langkah berikutnya. Pasang titik henti di baris 130.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    rem(5),
    /* 10 `DEFSTR C,R,S,Z` membuat C, R, S, Z bertipe string tanpa tanda $.
       C() larik pujian; BASIC melarik-otomatiskannya sampai 10. */
    { baris: 10, jalan: function (m) {
        m.cls();
        m.v.C = [];
        for (var i = 0; i <= 10; i++) m.v.C[i] = '';
      } },
    { baris: 20, jalan: function (m) {
        m.locate(1, 27); m.warna(0, 7);
        m.cetak(' ***** TACHISTOSCOPE *****');
      } },
    { baris: 30, jalan: function (m) {
        m.locate(3, 10); m.warna(7, 0);
        m.cetak('This program is designed to improve your reading speed.');
      } },
    ajar(40, 5, 10, 'I will briefly display a short phase and you try and read it.'),
    ajar(50, 7, 10, 'Type what you see, and I will tell you if you were right.'),
    { baris: 70, jalan: function (m) {
        m.warna(15, null); m.locate(25, 25);
        m.cetak("press any key when you're ready");
      } },
    /* 74 CHAIN MERGE: muat WORDS.BAS, sisipkan barisnya ke program yang
       sedang berjalan, lanjutkan di baris 75, pertahankan variabel (ALL).
       Yang disambung di sini cuma antrean DATA-nya — lihat kepala berkas. */
    { baris: 74, jalan: function (m) {
        var w = global.PROGRAM['WORDS'];
        m.data(w ? w.data : []);
      } },
    /* 75 Dua hal aneh dalam satu baris. `XX` dihitung dari jam dan tidak
       pernah dipakai lagi di mana pun. Dan `RANDOMIZE` ditulis TANPA
       argumen — di GW-BASIC itu BERHENTI dan bertanya "Random number seed
       (-32768 to 32767)?" di layar judul, padahal `XX` yang barusan dihitung
       jelas dimaksudkan sebagai jawabannya. */
    { baris: 75, bagian: [
        function (m) { m.gosub(1000); },
        function (m) {
          m.v.T1 = 1000; m.v.T4 = 100;
          m.v['T$'] = '00:00:00';
          m.v.XX = 0;
          m.semai(1);
        }
      ] },
    { baris: 78, jalan: function (m) {
        m.v.C[1] = 'Right'; m.v.C[2] = 'Correct'; m.v.C[3] = 'Absolutely';
        m.v.C[4] = "You're doing OK!";
        m.v.C[5] = "I knew you'd get that one";
      } },
    { baris: 80, jalan: function (m) { if (m.inkey() === '') m.lompat(80); } },
    /* 100 memilih kata acak dengan MEMBACA LEWAT: kembalikan penunjuk DATA
       ke awal, lalu baca sebanyak undiannya. Gagasan yang sama dengan
       pemilih labirin MAZE.BAS dan pemilih lapangan GOLF.BAS. */
    { baris: 100, jalan: function (m) {
        m.ulangData();
        var n = Math.trunc(m.acak() * m.v.L + 1);
        for (m.v.I = 1; m.v.I <= n; m.v.I++) m.v.S = m.baca();
      } },
    { baris: 110, jalan: function (m) {
        m.warna(10, null); m.cls();
        m.locate(12, 1, 0); m.cetak(ulang('-', 80));
        m.locate(14, 1, 0); m.cetak(ulang('-', 80));
      } },
    { baris: 120, bagian: [
        function (m) { m.v.T = 5; },
        function (m) { m.gosub(2000); }
      ] },
    /* 130 kata dipusatkan sendiri: kolom = 40 dikurangi separuh panjangnya. */
    { baris: 130, jalan: function (m) {
        m.v.X = 40 - Math.trunc(m.v.S.length / 2);
        m.warna(15, null);
        m.locate(13, m.v.X); m.cetak(m.v.S); m.barisBaru();
      } },
    { baris: 140, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= m.v.T1; m.v.I++) { /* jeda: lama kedipan */ }
        m.cls();
      } },
    { baris: 150, bagian: [
        function (m) {
          m.warna(7, null); m.locate(1, 1);
          m.cetak('Enter what you read '); m.barisBaru();
        },
        function (m) { m.masukan('R', '? '); }
      ] },
    { baris: 160, jalan: function (m) {
        if (m.v.R === m.v.S) m.gosub(500); else m.gosub(600);
      } },
    { baris: 170, jalan: function (m) {
        m.warna(15, null); m.locate(24, 22);
        m.cetak('Do you want another phrase (Y or N)?');
      } },
    { baris: 180, jalan: function (m) {
        m.v['I$'] = m.inkey();
        if (m.v['I$'] === '') m.lompat(180);
      } },
    { baris: 190, jalan: function (m) {
        if ('ynYN'.indexOf(m.v['I$']) < 0) m.lompat(180);
      } },
    { baris: 200, jalan: function (m) {
        if ('yY'.indexOf(m.v['I$']) >= 0) m.lompat(100);
      } },
    { baris: 210, jalan: function (m) { m.jalankan('MENU'); } },

    /* --- 500-650: benar dan salah ----------------------------------------- */
    /* 500 `I=RND(6)*6+1` menghasilkan 1 sampai 7, sementara C() cuma diisi
       1 sampai 5. Seperempat waktu pujiannya string kosong. */
    { baris: 500, jalan: function (m) {
        m.warna(0, 7);
        m.v.I = Math.round(m.acak() * 6 + 1);
        m.v.X = 40 - (m.v.C[m.v.I] || '').length / 2;
        m.locate(12, bulat(m.v.X));
        m.cetak(m.v.C[m.v.I] || ''); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 510, jalan: function (m) { m.mainkan('mbc16c16c16ge8g'); } },
    /* 520 BENAR: kedipannya dipersingkat — lain kali lebih sulit. */
    { baris: 520, jalan: function (m) {
        m.v.T1 = m.v.T1 - m.v.T4; m.kembali();
      } },
    /* 600 SALAH: dan langkah penyesuaiannya diperkecil dari 100 jadi 10 —
       untuk selamanya. Sesudah satu kesalahan, program tidak akan pernah
       lagi menyesuaikan diri secepat semula. */
    { baris: 600, jalan: function (m) { m.mainkan('n50n25'); m.v.T4 = 10; } },
    { baris: 610, bagian: [
        function (m) {
          m.warna(7, null); m.locate(3, 1);
          m.cetak('Sorry - Try again!'); m.barisBaru();
        },
        function (m) { m.masukan('R', '? '); }
      ] },
    { baris: 620, jalan: function (m) { if (m.v.R === m.v.S) m.lompat(500); } },
    { baris: 630, jalan: function (m) {
        m.mainkan('n50n25');
        m.warna(7, null); m.locate(12, 27);
        m.cetak('Sorry, what I gave you was'); m.barisBaru();
      } },
    { baris: 640, jalan: function (m) {
        m.warna(0, 7); m.locate(13, 27);
        m.cetak(m.v.S); m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 650, jalan: function (m) {
        m.v.T1 = m.v.T1 + m.v.T4; m.kembali();
      } },

    /* --- 1000-1050: menghitung DATA dengan cara menabrak ------------------ */
    { baris: 1000, jalan: function (m) { m.penangkapGalat = 1050; } },
    { baris: 1010, jalan: function (m) { m.ulangData(); m.v.L = 0; } },
    /* 1020 baca terus. Waktu DATA habis, BASIC melempar galat 4 dan alurnya
       dibelokkan ke 1050. Tidak ada cara lain menanyakan panjang DATA. */
    /* Ketiganya WAJIB terpisah. Waktu `READ` gagal, BASIC meninggalkan sisa
       barisnya dan pergi ke penangan galat — jadi `L=L+1` dan `GOTO 1020`
       tidak boleh ikut jalan. Kalau ketiganya ditulis dalam satu penggal,
       `lompat(1020)` akan MENIMPA belokan ke penangan galat itu dan
       gelungnya tidak akan pernah berhenti. */
    { baris: 1020, bagian: [
        function (m) { m.v['X$'] = m.baca(); },
        function (m) { m.v.L = m.v.L + 1; },
        function (m) { m.lompat(1020); }
      ] },
    /* 1050 `RETURN` — bukan `RESUME`. Di GW-BASIC itu meninggalkan penangan
       galat dalam keadaan "sedang menangani" selamanya: galat berikutnya
       tidak akan tertangkap lagi. Di program ini tidak terasa karena tidak
       ada galat kedua. */
    { baris: 1050, jalan: function (m) { m.kembali(); } },

    /* --- 2000-2020: menunggu dengan melihat jam --------------------------- */
    /* Jam diubah jadi detik dengan jam dikali 120, bukan 3600. Menit dan
       detik konsisten; hanya perpindahan JAM yang salah hitung — dan itu
       cuma terasa sekali dalam enam puluh menit. */
    { baris: 2000, jalan: function (m) {
        m.v.T3 = detik(m);
      } },
    { baris: 2010, jalan: function (m) {
        m.v.T2 = detik(m);
      } },
    { baris: 2020, jalan: function (m) {
        if (m.v.T > m.v.T2 - m.v.T3) m.lompat(2010); else m.kembali();
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }
  function ulang(s, n) { var k = '', i; for (i = 0; i < n; i++) k += s; return k; }
  function bulat(n) { return Math.max(1, Math.min(80, Math.round(n))); }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi);
    } };
  }

  /* Jam penelusur maju tetap tiap dibaca — sama seperti CRAPS.BAS. Di sini
     itu justru yang membuat gelung tunggu di 2010 bisa selesai. */
  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 86400;
    var j = Math.floor(m.v.JAM / 3600), n = Math.floor(m.v.JAM / 60) % 60,
        d = m.v.JAM % 60;
    m.v['T$'] = dua(j) + ':' + dua(n) + ':' + dua(d);
    return j * 120 + n * 60 + d;
  }
  function dua(n) { return (n < 10 ? '0' : '') + n; }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['READING'] = {
    nama: 'READING',
    judul: 'Reading (tachistoscope)',
    sumber: 'READING',
    berkas: 'run/READING.BAS',
    tabel: tabel,
    benih: 5,
    /* Kosong: seluruh DATA-nya datang dari WORDS.BAS lewat CHAIN MERGE. */
    data: [],

    arsitektur: {
      judul: 'Alur READING.BAS',
      simpul: [
        { id: 'judul', baris: '10-70', jenis: 'mulai',
          teks: ['Judul dan tiga baris', 'penjelasan'] },
        { id: 'merge', baris: '74',
          teks: ['CHAIN MERGE "words":', 'sisipkan 398 kata'] },
        { id: 'hitung', baris: '1000-1050', jenis: 'subrutin',
          teks: ['Baca sampai galat,', 'hitung berapa butir'] },
        { id: 'pilih', baris: '100',
          teks: ['Pilih kata acak dengan', 'membaca lewat'] },
        { id: 'kedip', baris: '110-140',
          teks: ['Kedipkan kata di tengah,', 'selama T1'] },
        { id: 'jawab', baris: '150', jenis: 'putusan',
          teks: ['Pemakai mengetik', 'apa yang dibacanya'] },
        { id: 'benar', baris: '500-520',
          teks: ['Pujian acak,', 'T1 dikurangi: lebih sulit'] },
        { id: 'salah', baris: '600-650', jenis: 'galat',
          teks: ['Coba lagi; kalau tetap salah,', 'T1 ditambah dan T4 mengecil'] },
        { id: 'lagi', baris: '170-210', jenis: 'keluar',
          teks: ['Sekali lagi? atau', 'kembali ke menu'] }
      ],
      panah: [
        { dari: 'judul', ke: 'merge' },
        { dari: 'merge', ke: 'hitung' },
        { dari: 'hitung', ke: 'pilih' },
        { dari: 'pilih', ke: 'kedip' },
        { dari: 'kedip', ke: 'jawab' },
        { dari: 'jawab', ke: 'benar', label: 'cocok' },
        { dari: 'jawab', ke: 'salah', label: 'tidak cocok', jenis: 'galat' },
        { dari: 'salah', ke: 'benar', label: 'benar di percobaan kedua' },
        { dari: 'benar', ke: 'lagi' },
        { dari: 'salah', ke: 'lagi', jenis: 'galat' },
        { dari: 'lagi', ke: 'pilih', label: 'Y' }
      ]
    },

    pseudokode: [
      { baris: 74, tingkat: 0, teks: '<code>CHAIN MERGE "words", 75, ALL</code> &mdash; <b>sisipkan program lain ke diri sendiri</b>' },
      { baris: 1000, tingkat: 0, teks: 'pasang penangan galat, lalu <b>baca DATA terus sampai menabrak</b>' },
      { baris: 1020, tingkat: 1, teks: 'tiap butir menaikkan <code>L</code>; galat "Out of DATA" jadi tanda selesai' },
      { baris: 100, tingkat: 0, teks: '<b>ULANG:</b> pilih kata acak dengan <code>RESTORE</code> lalu membaca lewat' },
      { baris: 130, tingkat: 1, teks: 'pusatkan kata di baris 13: <code>kolom = 40 &minus; panjang/2</code>' },
      { baris: 140, tingkat: 1, teks: 'tunggu <code>T1</code> putaran, lalu <b>bersihkan layar</b>' },
      { baris: 150, tingkat: 1, teks: 'pemakai mengetik apa yang sempat dibacanya' },
      { baris: 520, tingkat: 2, teks: 'benar &rarr; <code>T1 = T1 &minus; T4</code> &mdash; lain kali lebih cepat' },
      { baris: 600, tingkat: 2, teks: 'salah &rarr; <code>T4 = 10</code> <b>selamanya</b>, lalu satu kesempatan lagi' },
      { baris: 650, tingkat: 2, teks: 'masih salah &rarr; tunjukkan jawabannya, <code>T1 = T1 + T4</code>' }
    ],

    perintahAsli: 'run\\READING.bat',
    catatanAsli: 'Di DOSBox-X kedipannya benar-benar berkedip &mdash; sekitar ' +
      'sepersekian detik &mdash; dan bunyi benar/salah terdengar. Butuh ' +
      'WORDS.BAS ada di folder yang sama.',

    penyimpangan: [
      '<b><code>CHAIN MERGE</code> ditiru dengan menyambung antrean ' +
      '<code>DATA</code> milik WORDS.BAS</b> ke antrean program ini. ' +
      'Baris-baris WORDS.BAS tidak muncul di panel sumber &mdash; tapi karena ' +
      'seluruhnya <code>DATA</code>, tidak ada satu pun yang akan pernah ' +
      'disorot sebagai baris yang berjalan.',

      '<b>Gelung tunda habis seketika.</b> Baris 140 (lama kedipan) dan ' +
      '2000&ndash;2020 (menunggu lima satuan jam) lewat dalam satu langkah, ' +
      'jadi kedipannya tidak berkedip: kata muncul lalu langsung hilang. ' +
      'Pasang titik henti di baris 130 untuk membacanya.',

      '<b><code>PLAY</code> diam</b>, jadi tiga nada naik untuk benar dan dua ' +
      'dengung rendah untuk salah tidak terdengar.',

      '<b>Jam penelusur maju tetap tujuh detik tiap dibaca.</b> Di sini itu ' +
      'justru yang membuat gelung tunggu di baris 2010 bisa selesai sama ' +
      'sekali.',

      '<b><code>RANDOMIZE</code> tanpa argumen tidak bertanya.</b> Di ' +
      'GW-BASIC baris 75 akan berhenti dan meminta angka benih dari pemakai; ' +
      'di sini benihnya dipasang tetap supaya penelusuran bisa diulang.'
    ],

    pelajaran: {
      ringkas: 'Alat latih kecepatan membaca yang menyambung dirinya sendiri ' +
        'dengan berkas kamus, menghitung datanya dengan cara menabrak, dan ' +
        'menyetel kesulitannya sendiri lewat satu variabel.',
      pelajari: [
        ['Program yang menyambung dirinya sendiri',
         '<code>CHAIN MERGE "words", 75, ALL</code> memuat WORDS.BAS dan ' +
         '<b>menyisipkan baris-barisnya</b> ke program yang sedang berjalan, ' +
         'lalu melanjutkan di baris 75 dengan seluruh variabel dipertahankan. ' +
         'Sesudah baris 74, program yang berjalan bukan lagi yang ada di ' +
         'berkas &mdash; ia 39 baris ditambah 36 baris kamus.'],
        ['Menghitung dengan cara menabrak',
         'BASIC tidak punya cara menanyakan "ada berapa butir DATA?". Jadi ' +
         'baris 1000-1050 memasang penangan galat, membaca terus sampai ' +
         '<code>Out of DATA</code>, dan memakai <b>galat itu sendiri</b> ' +
         'sebagai tanda selesai. Pencacahnya adalah jumlah yang terbaca ' +
         'sebelum tabrakan. Kasar, dan satu-satunya cara.'],
        ['Kesulitan yang menyetel diri',
         '<code>T1</code> adalah lama kedipan. Benar &rarr; berkurang (lebih ' +
         'sulit); salah &rarr; bertambah. Satu variabel, dan alat ini ' +
         'menyesuaikan diri ke pembacanya dalam beberapa putaran &mdash; ' +
         'gagasan yang di ujian modern disebut <i>adaptive testing</i>.'],
        ['Memusatkan teks tanpa fungsi bantu',
         'Baris 130: <code>X = 40 - INT(LEN(S)/2)</code>. Layar 80 kolom, ' +
         'tengahnya 40, jadi mundur separuh panjang kata. Satu baris yang ' +
         'sama muncul lagi di baris 500 untuk memusatkan pujiannya.']
      ],
      hindari: [
        ['Undian yang melewati batas lariknya',
         'Baris 500: <code>I=RND(6)*6+1</code> menghasilkan 1 sampai 7, ' +
         'sementara <code>C()</code> cuma diisi 1 sampai 5. Seperempat waktu ' +
         '<code>C(I)</code> adalah string kosong dan <b>pujiannya tidak ' +
         'muncul sama sekali</b> &mdash; tanpa galat, tanpa tanda apa pun. ' +
         'Pemakai cuma melihat layar yang diam.'],
        ['Langkah penyesuaian yang mengecil dan tidak pernah pulih',
         '<code>T4</code> mulai dari 100. Kesalahan pertama membuat baris 600 ' +
         'menyetelnya jadi <b>10</b>, dan tidak ada satu baris pun yang ' +
         'mengembalikannya. Sesudah satu kesalahan, alat ini menyesuaikan ' +
         'diri sepuluh kali lebih lambat &mdash; selamanya.'],
        ['RETURN dari dalam penangan galat',
         'Baris 1050 memakai <code>RETURN</code>, bukan <code>RESUME</code>. ' +
         'Di GW-BASIC itu meninggalkan penangan galat dalam keadaan "sedang ' +
         'menangani": <b>galat berikutnya tidak akan tertangkap lagi</b>. Di ' +
         'sini tidak terasa karena tidak ada galat kedua &mdash; tapi ' +
         'menambah satu <code>OPEN</code> saja sudah cukup untuk membuatnya ' +
         'terasa.'],
        ['Jam yang dikali 120',
         'Baris 2000: <code>VAL(LEFT$(T$,2))*120 + &hellip;*60 + &hellip;</code>. ' +
         'Menit dikali 60 dan detik dikali 1 konsisten, tapi jam seharusnya ' +
         'dikali <b>3600</b>, bukan 120. Hanya terasa sekali dalam enam puluh ' +
         'menit &mdash; dan waktu terasa, kedipannya akan salah panjang.'],
        ['Benih acak yang dihitung lalu dibuang',
         'Baris 75 menghitung <code>XX</code> dari jam &mdash; jelas ' +
         'dimaksudkan sebagai benih &mdash; lalu menulis <code>RANDOMIZE</code> ' +
         '<b>tanpa argumen</b>. Akibatnya <code>XX</code> tidak pernah dipakai ' +
         'di mana pun, dan GW-BASIC malah <b>berhenti dan bertanya</b> ' +
         '"Random number seed (-32768 to 32767)?" &mdash; di tengah layar ' +
         'judul, sebelum pemakai sempat menekan tombol apa pun. Yang ' +
         'dimaksud hampir pasti <code>RANDOMIZE XX</code>.']
      ]
    },

    penjelasan: [
      { judul: 'Program yang bukan lagi isi berkasnya',
        isi: [
          'Baris 74 adalah satu-satunya di seluruh koleksi ini yang memakai ' +
          '<code>CHAIN MERGE</code>:',
          '<code>74 CHAIN MERGE "words", 75, ALL</code>',
          'Tiga bagian: muat <b>words</b>, lanjutkan di baris <b>75</b>, ' +
          'pertahankan <b>semua</b> variabel.',
          'Yang membedakannya dari <code>CHAIN</code> biasa (yang dipakai ' +
          'HANGMAN.BAS dan OTHELLO.BAS untuk pindah ke menu) adalah kata ' +
          '<code>MERGE</code>: barisnya tidak <b>menggantikan</b> program yang ' +
          'sedang berjalan, melainkan <b>disisipkan ke dalamnya</b>, menurut ' +
          'nomor baris.',
          'Jadi sesudah baris 74, yang berjalan di memori adalah READING.BAS ' +
          '<b>ditambah</b> WORDS.BAS. Berkas READING.BAS di disket tidak ' +
          'berubah; yang berubah program yang hidup.',
          'Itu sebabnya WORDS.BAS bernomor mulai 10000 &mdash; supaya ' +
          'penyisipannya tidak menimpa baris READING.BAS mana pun. Nomor yang ' +
          'sama akan menimpa, diam-diam.',
          'Di penelusur, penyisipan itu ditiru dengan menyambung ' +
          '<b>antrean DATA</b>-nya saja. Panel sumber tetap memperlihatkan ' +
          'READING.BAS. Kehilangannya kecil: seluruh isi WORDS.BAS adalah ' +
          '<code>DATA</code>, dan <code>DATA</code> tidak pernah "dijalankan" ' +
          '&mdash; tidak ada baris yang akan disorot di sana meski ia ' +
          'ditampilkan.'
        ] },
      { judul: 'Menghitung dengan cara menabrak',
        isi: [
          'Sesudah kamusnya masuk, program perlu tahu satu hal: <b>ada berapa ' +
          'kata?</b> Tanpa itu, baris 100 tidak bisa mengundi kata acak.',
          'BASIC tidak punya cara menanyakannya. Tidak ada ' +
          '<code>LEN(DATA)</code>, tidak ada penunjuk yang bisa dibaca. Yang ' +
          'ada cuma <code>READ</code>, dan galat kalau <code>READ</code> ' +
          'kehabisan.',
          'Jadi baris 1000-1050 memakai galat itu sebagai jawaban:',
          '<code>1000 ON ERROR GOTO 1050</code><br>' +
          '<code>1010 RESTORE:L=0</code><br>' +
          '<code>1020 READ X$:L=L+1:GOTO 1020</code><br>' +
          '<code>1050 RETURN</code>',
          'Baca terus. Naikkan pencacah. Waktu DATA habis, BASIC melempar ' +
          'galat 4 dan melompat ke 1050. <code>L</code> berhenti di jumlah ' +
          'yang terbaca &mdash; <b>398</b>.',
          'Ini pola yang di bahasa modern akan disebut menyalahgunakan ' +
          'pengecualian sebagai alur kendali, dan memang begitu. Bedanya: di ' +
          'sini tidak ada pilihan lain. Satu-satunya cara mengetahui panjang ' +
          'sesuatu adalah berjalan sampai ujungnya dan menabrak dindingnya.',
          'Ada satu kelanjutan yang layak diperhatikan: baris 1050 memakai ' +
          '<code>RETURN</code>, bukan <code>RESUME</code>. <code>RESUME</code> ' +
          'yang menutup penanganan galat; tanpanya, GW-BASIC menganggap ' +
          'dirinya masih di dalam penangan selamanya, dan <b>galat berikutnya ' +
          'tidak akan tertangkap</b>. Di program sependek ini tidak pernah ' +
          'terasa &mdash; tapi ia sebuah ranjau yang sudah dipasang.'
        ] },
      { judul: 'Satu variabel yang menyetel kesulitannya',
        isi: [
          '<code>T1</code> adalah lamanya kata dikedipkan &mdash; jumlah ' +
          'putaran gelung kosong di baris 140. Mulai dari 1000.',
          'Benar (baris 520): <code>T1 = T1 - T4</code>. Kedipan berikutnya ' +
          'lebih singkat, jadi lebih sulit.',
          'Salah (baris 650): <code>T1 = T1 + T4</code>. Lebih lama, lebih ' +
          'mudah.',
          'Dalam beberapa putaran, <code>T1</code> akan mengendap di sekitar ' +
          'batas kemampuan pembacanya &mdash; cukup cepat untuk menantang, ' +
          'cukup lambat untuk terbaca. Gagasan yang sekarang punya nama, ' +
          '<i>adaptive testing</i>, dalam dua baris.',
          'Tapi ada cacat yang membuatnya pincang. <code>T4</code>, besar ' +
          'langkah penyesuaiannya, mulai dari 100 &mdash; dan baris 600 ' +
          'menyetelnya jadi <b>10</b> begitu ada kesalahan pertama:',
          '<code>600 PLAY "n50n25":T4=10</code>',
          'Tidak ada satu baris pun yang mengembalikannya ke 100. Jadi ' +
          'sesudah satu kesalahan, alat ini butuh sepuluh kali lebih banyak ' +
          'putaran untuk bergerak sejauh yang sama.',
          'Yang membuatnya sulit terlihat: perubahannya <b>ke arah yang ' +
          'benar</b>. Langkah yang mengecil sesudah kesalahan pertama memang ' +
          'terdengar masuk akal &mdash; penyesuaian halus di dekat batas ' +
          'kemampuan. Tapi kalau itu maksudnya, ia seharusnya berlaku dua ' +
          'arah dan bisa pulih. Yang tertulis cuma satu arah, sekali, dan ' +
          'selamanya.'
        ] }
    ]
  };
})(window);
