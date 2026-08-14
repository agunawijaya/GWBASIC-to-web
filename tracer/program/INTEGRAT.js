/* ===========================================================================
   INTEGRAT.js — porting minimalis INTEGRAT.BAS sebagai tabel baris.

   Empat puluh dua baris dari Feldman & Rugg, 1982: integral tentu dengan
   aturan Simpson. Program pertama di koleksi ini yang matematikanya sungguhan
   dan bukan permainan.

   Dan program pertama yang sengaja dikirim DALAM KEADAAN BELUM SELESAI.

   Baris 2000 berbunyi:

       2000 REM **** Y=F(X) Goes Here ************

   Itu saja. Sebuah komentar. Pemakainya diharapkan MENGETIK SENDIRI baris
   penggantinya — misalnya `2000 Y=X*X` — sebelum menjalankannya. Kotak
   peringatan bergaris ganda di baris 180-250 ada karena penulisnya tahu
   persis bahwa orang tidak akan melakukannya.

   Kalau tidak diisi, `Y` tetap 0, dan program berjalan dengan sempurna
   sambil menghitung integral dari fungsi nol. Berulang-ulang. Selamanya:

       # Segments    Integral
        2             0
        4             0
        8             0
        ...

   Karena baris 450-460 (`N=N*2:GOTO 320`) tidak punya syarat berhenti sama
   sekali. Satu-satunya jalan keluar adalah Ctrl-Break.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom. Tidak
     berpengaruh pada tampilan karena seluruh isi kotaknya berada di dalam
     kolom 31, tapi barisnya jadi tidak membungkus di tempat yang sama.
   - `SCREEN 0,0,0,0` dan `CLEAR` dijalankan sebagai penyetel keadaan awal.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Aksara kotak garis ganda CP437. Disimpan sebagai BITA, seperti yang
     dilakukan `CHR$` — konsol yang menerjemahkannya ke glif waktu mencetak. */
  var KIRI_ATAS = 201, DATAR = 205, KANAN_ATAS = 187,
      KIRI_BAWAH = 200, KANAN_BAWAH = 188;

  function angka(s) {
    var n = parseFloat(String(s).replace(/^\s+/, ''));
    return isNaN(n) ? 0 : n;      /* GW-BASIC memberi 0 untuk masukan kosong */
  }

  var tabel = [

    rem(100), rem(110), rem(120), rem(130),

    /* 140 `SCREEN 0,0,0,0` layar teks, halaman 0. `WIDTH 40` — lihat kepala
       berkas. `COLOR 7,0,0` putih di atas hitam. */
    { baris: 140, jalan: function (m) { m.warna(7, 0); } },
    /* 150 `CLEAR` membuang seluruh variabel. Di sini belum ada apa-apa. */
    { baris: 150, jalan: function (m) { m.cls(); } },
    { baris: 160, jalan: function (m) { m.v.N = 2; } },

    /* --- 170-270: kotak peringatan ---------------------------------------- */
    /* 170 `B=186` diselipkan di ujung baris PRINT — nilainya aksara garis
       tegak, dan dipakai sebagai dinding kiri-kanan kotak sesudah ini. */
    { baris: 170, jalan: function (m) {
        m.tab(4); m.cetak("Integral by Simpson's Rule"); m.barisBaru();
        m.v.B = 186;
      } },
    { baris: 180, bagian: [
        function (m) {
          m.barisBaru();
          m.cetak(m.chr(KIRI_ATAS) + m.ulang(29, DATAR) + m.chr(KANAN_ATAS));
          m.barisBaru();
        },
        function (m) { m.gosub(270); }
      ] },
    { baris: 190, bagian: [
        function (m) { dinding(m, 13, 'WARNING!'); },
        function (m) { m.gosub(270); }
      ] },
    { baris: 200, jalan: function (m) { dinding(m, 5, 'The subroutine at lines'); } },
    { baris: 210, jalan: function (m) { m.gosub(270); } },
    { baris: 220, jalan: function (m) { dinding(m, 5, '2000-2999 is assumed to'); } },
    { baris: 230, jalan: function (m) { m.gosub(270); } },
    { baris: 240, jalan: function (m) { dinding(m, 3, 'define Y as a function of X'); } },
    { baris: 250, bagian: [
        function (m) { m.gosub(270); },
        function (m) {
          m.cetak(m.chr(KIRI_BAWAH) + m.ulang(29, DATAR) + m.chr(KANAN_BAWAH));
          m.barisBaru();
        }
      ] },
    /* 260 melompati subrutin di 270. Tata letak khas BASIC bernomor baris:
       subrutin diletakkan di tengah alur, lalu alurnya dilangkahi. */
    { baris: 260, jalan: function (m) { m.lompat(280); } },
    /* 270 satu baris kotak yang kosong isinya — dipanggil enam kali. */
    { baris: 270, jalan: function (m) {
        m.cetak(m.chr(m.v.B)); m.tab(31); m.cetak(m.chr(m.v.B));
        m.barisBaru();
        m.kembali();
      } },

    /* --- 280-310: batas integrasi ----------------------------------------- */
    { baris: 280, bagian: [
        function (m) { m.barisBaru(); m.cetak('Lower limit of X'); },
        function (m) { m.masukan(function (s) { m.v.L = angka(s); }, '? '); }
      ] },
    { baris: 290, bagian: [
        function (m) { m.barisBaru(); m.cetak('Upper limit of X'); },
        function (m) { m.masukan(function (s) { m.v.U = angka(s); }, '? '); }
      ] },
    { baris: 300, jalan: function (m) { m.barisBaru(); } },
    /* 310 koma di PRINT memindahkan ke ZONA berikutnya — tiap 14 kolom di
       GW-BASIC. Itu yang membuat dua kolomnya lurus tanpa satu pun TAB. */
    { baris: 310, jalan: function (m) {
        m.cetak('# Segments'); m.tab(15); m.cetak('Integral'); m.barisBaru();
      } },

    /* --- 320-430: aturan Simpson ------------------------------------------
       Luas di bawah kurva dihampiri dengan parabola, bukan dengan persegi
       panjang. Rumusnya:

           A = (DX/3) * [ f(kiri) + f(kanan)
                          + 4 * (jumlah f di titik GANJIL)
                          + 2 * (jumlah f di titik GENAP) ]

       Baris 330-340 mengerjakan dua ujungnya, 360-380 yang ganjil, 400-420
       yang genap. `T` mengumpulkan semuanya. */
    { baris: 320, jalan: function (m) {
        m.v.DX = (m.v.U - m.v.L) / m.v.N;
        m.v.T = 0;
      } },
    { baris: 330, bagian: [
        function (m) { m.v.X = m.v.L; },
        function (m) { m.gosub(2000); },
        function (m) { m.v.T = m.v.T + (m.v.Y || 0); }
      ] },
    { baris: 340, bagian: [
        function (m) { m.v.X = m.v.U; },
        function (m) { m.gosub(2000); },
        function (m) { m.v.T = m.v.T + (m.v.Y || 0); }
      ] },
    { baris: 350, jalan: function (m) { m.v.M = m.v.N / 2; m.v.Z = 0; } },
    { baris: 360, jalan: function (m) { m.untuk('J', 1, m.v.M, 1, 390); } },
    { baris: 370, bagian: [
        function (m) { m.v.X = m.v.L + m.v.DX * (2 * m.v.J - 1); },
        function (m) { m.gosub(2000); }
      ] },
    { baris: 380, bagian: [
        function (m) { m.v.Z = m.v.Z + (m.v.Y || 0); },
        function (m) { m.lanjutkan('J'); },
        function (m) { m.v.T = m.v.T + 4 * m.v.Z; }
      ] },
    /* 390 kalau segmennya cuma dua, tidak ada titik genap di tengah sama
       sekali — jumlah keduanya dilewati. */
    { baris: 390, bagian: [
        function (m) { m.v.M = m.v.M - 1; },
        function (m) { if (m.v.M === 0) m.lompat(430); }
      ] },
    { baris: 400, bagian: [
        function (m) { m.v.Z = 0; },
        function (m) { m.untuk('J', 1, m.v.M, 1, 430); }
      ] },
    { baris: 410, bagian: [
        function (m) { m.v.X = m.v.L + m.v.DX * 2 * m.v.J; },
        function (m) { m.gosub(2000); },
        function (m) { m.v.Z = m.v.Z + (m.v.Y || 0); }
      ] },
    { baris: 420, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { m.v.T = m.v.T + 2 * m.v.Z; }
      ] },
    { baris: 430, jalan: function (m) { m.v.A = m.v.DX * m.v.T / 3; } },
    { baris: 440, jalan: function (m) {
        m.cetak(basic(m.v.N)); m.tab(15); m.cetak(basic(m.v.A));
        m.barisBaru();
      } },
    /* 450-460 SEGMENNYA DIGANDAKAN LALU DIULANG — tanpa satu pun syarat
       berhenti. Tidak ada batas putaran, tidak ada uji kekonvergenan, tidak
       ada tawaran keluar. Ctrl-Break satu-satunya jalan. */
    { baris: 450, jalan: function (m) { m.v.N = m.v.N * 2; } },
    { baris: 460, jalan: function (m) { m.lompat(320); } },

    rem(1970), rem(1980), rem(1990),
    /* 2000 DI SINILAH fungsinya seharusnya ditulis. Yang ada cuma komentar,
       jadi `Y` tidak pernah berubah dan tetap 0. Ganti baris ini dengan
       `Y=X*X` di GW-BASIC dan seluruh program berubah jadi berguna. */
    rem(2000),
    { baris: 2999, jalan: function (m) { m.kembali(); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }

  /* Satu baris kotak berisi teks: dinding, TAB, teks, TAB, dinding. */
  function dinding(m, kolom, teks) {
    m.cetak(m.chr(m.v.B));
    m.tab(kolom); m.cetak(teks);
    m.tab(31); m.cetak(m.chr(m.v.B));
    m.barisBaru();
  }

  /* GW-BASIC mencetak angka positif DENGAN SATU SPASI di depannya (tempat
     tanda minus), dan tanpa nol di depan koma untuk pecahan. Ditiru supaya
     kolomnya lurus seperti aslinya. */
  function basic(n) {
    if (n === undefined || n === null) n = 0;
    var s;
    if (n === Math.floor(n) && Math.abs(n) < 1e15) s = String(Math.abs(n));
    else s = String(Number(Math.abs(n).toPrecision(7))).replace(/^0\./, '.');
    return (n < 0 ? '-' : ' ') + s + ' ';
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['INTEGRAT'] = {
    nama: 'INTEGRAT',
    judul: 'Integrate (aturan Simpson)',
    sumber: 'INTEGRAT',
    berkas: 'run/INTEGRAT.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur INTEGRAT.BAS',
      simpul: [
        { id: 'kotak', baris: '170-270', jenis: 'mulai',
          teks: ['Kotak peringatan:', '"isi dulu baris 2000"'] },
        { id: 'batas', baris: '280-310',
          teks: ['Tanya batas bawah', 'dan batas atas X'] },
        { id: 'lebar', baris: '320',
          teks: ['DX = (U - L) / N', 'lebar tiap segmen'] },
        { id: 'ujung', baris: '330-340',
          teks: ['f(kiri) + f(kanan)', 'masing-masing sekali'] },
        { id: 'ganjil', baris: '360-380',
          teks: ['Titik ganjil,', 'dikali 4'] },
        { id: 'genap', baris: '390-420',
          teks: ['Titik genap,', 'dikali 2'] },
        { id: 'hasil', baris: '430-440',
          teks: ['A = DX * T / 3', 'lalu dicetak'] },
        { id: 'ganda', baris: '450-460', jenis: 'galat',
          teks: ['N digandakan,', 'ulang — tanpa henti'] },
        { id: 'kosong', baris: '2000-2999', jenis: 'subrutin',
          teks: ['Y = f(X):', 'KOSONG, cuma komentar'] }
      ],
      panah: [
        { dari: 'kotak', ke: 'batas' },
        { dari: 'batas', ke: 'lebar' },
        { dari: 'lebar', ke: 'ujung' },
        { dari: 'ujung', ke: 'ganjil' },
        { dari: 'ganjil', ke: 'genap' },
        { dari: 'genap', ke: 'hasil', label: 'lewati kalau N=2' },
        { dari: 'hasil', ke: 'ganda' },
        { dari: 'ganda', ke: 'lebar', label: 'selalu', jenis: 'galat' },
        { dari: 'ujung', ke: 'kosong', label: 'GOSUB 2000' },
        { dari: 'ganjil', ke: 'kosong' },
        { dari: 'genap', ke: 'kosong' }
      ]
    },

    pseudokode: [
      { baris: 170, tingkat: 0, teks: 'gambar kotak: <b>"subrutin di 2000-2999 dianggap mendefinisikan Y dari X"</b>' },
      { baris: 280, tingkat: 0, teks: 'tanya batas bawah <code>L</code> dan batas atas <code>U</code>' },
      { baris: 160, tingkat: 0, teks: 'mulai dengan <code>N = 2</code> segmen' },
      { baris: 320, tingkat: 0, teks: '<b>ULANG SELAMANYA:</b>' },
      { baris: 320, tingkat: 1, teks: '<code>DX = (U &minus; L) / N</code> &mdash; lebar tiap segmen' },
      { baris: 330, tingkat: 1, teks: '<code>T = f(L) + f(U)</code> &mdash; dua ujungnya, masing-masing sekali' },
      { baris: 360, tingkat: 1, teks: 'untuk tiap titik <b>ganjil</b>: <code>T = T + 4&times;f(x)</code>' },
      { baris: 400, tingkat: 1, teks: 'untuk tiap titik <b>genap</b>: <code>T = T + 2&times;f(x)</code>' },
      { baris: 430, tingkat: 1, teks: '<code>A = DX &times; T / 3</code>, cetak <code>N</code> dan <code>A</code>' },
      { baris: 450, tingkat: 1, teks: '<code>N = N &times; 2</code> &mdash; <b>tidak ada syarat berhenti</b>' },
      { baris: 2000, tingkat: 0, teks: '<code>Y = f(X)</code> &mdash; <b>baris ini kosong; harus diketik sendiri</b>' }
    ],

    perintahAsli: 'run\\INTEGRAT.bat',
    catatanAsli: 'Di GW-BASIC sungguhan, ketik dulu baris penggantinya sebelum ' +
      'RUN &mdash; misalnya <code>2000 Y=X*X</code>. Tanpa itu, hasilnya nol ' +
      'terus. Program tidak pernah berhenti sendiri: tekan Ctrl-Break.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol penelusur tetap 80 ' +
      'kolom. Tampilan kotaknya tidak berubah karena seluruh isinya berada di ' +
      'dalam kolom 31, tapi barisnya tidak membungkus di tempat yang sama ' +
      'seperti di layar 40 kolom.',

      '<b>Koma di <code>PRINT</code> ditiru dengan <code>TAB(15)</code>.</b> ' +
      'Di GW-BASIC koma memindahkan pencetakan ke zona 14 kolom berikutnya; ' +
      'di sini kolomnya dipatok. Untuk dua kolom yang isinya pendek, hasilnya ' +
      'sama.',

      '<b>Baris 2000 dibiarkan kosong seperti aslinya.</b> Ini bukan ' +
      'kelalaian melainkan isi programnya: yang bisa dilihat di halaman ini ' +
      'adalah program yang berjalan sempurna sambil menghitung integral dari ' +
      'fungsi nol.'
    ],

    pelajaran: {
      ringkas: 'Integral tentu dengan aturan Simpson &mdash; dikirim dengan ' +
        'satu baris sengaja dikosongkan supaya pemakainya mengisi sendiri, ' +
        'dan sebuah gelung yang tidak punya syarat berhenti.',
      pelajari: [
        ['Aturan Simpson dalam sebelas baris',
         'Luas di bawah kurva dihampiri dengan <b>parabola</b>, bukan dengan ' +
         'persegi panjang. Rumusnya: <code>(DX/3) &times; [f(kiri) + f(kanan) ' +
         '+ 4&times;&Sigma;ganjil + 2&times;&Sigma;genap]</code>. Baris ' +
         '330&ndash;340 mengerjakan ujungnya, 360&ndash;380 yang ganjil, ' +
         '400&ndash;420 yang genap. Bobot 4 dan 2 yang berselang-seling itulah ' +
         'seluruh isi aturannya.'],
        ['Program sebagai kerangka yang harus diisi',
         'Baris 2000 bukan lupa dikosongkan &mdash; itu <b>antarmukanya</b>. ' +
         'Pemakainya mengetik <code>2000 Y=X*X</code> sebelum <code>RUN</code>, ' +
         'dan programnya jadi kalkulator integral untuk fungsi apa pun. Di ' +
         'zaman tanpa fungsi sebagai nilai, cara menyuntikkan perilaku ke ' +
         'sebuah program adalah <b>menyunting programnya</b>. Yang sekarang ' +
         'kita sebut <i>callback</i>, di sini berupa nomor baris yang disepakati.'],
        ['Menggandakan segmen sampai hasilnya mengendap',
         'Baris 450 melipatduakan <code>N</code> tiap putaran, dan tiap baris ' +
         'keluaran memperlihatkan hampiran yang lebih halus dari sebelumnya. ' +
         'Membaca kolom itu dari atas ke bawah adalah cara melihat ' +
         '<b>kekonvergenan</b> dengan mata sendiri: angkanya berubah, berubah ' +
         'lebih kecil, lalu berhenti berubah.'],
        ['Kotak dari aksara CP437',
         'Baris 180&ndash;250 menggambar bingkai garis ganda dengan ' +
         '<code>CHR$(201)</code>, <code>205</code>, <code>187</code>, ' +
         '<code>186</code>, <code>200</code>, <code>188</code>. Dan baris 270 ' +
         '&mdash; satu baris kotak yang kosong isinya &mdash; dipanggil enam ' +
         'kali sebagai subrutin. <b>Bagian yang diulang dijadikan subrutin ' +
         'walaupun cuma satu baris.</b>']
      ],
      hindari: [
        ['Gelung tanpa syarat berhenti',
         'Baris 450&ndash;460: <code>N=N*2:GOTO 320</code>. Tidak ada batas ' +
         'putaran, tidak ada uji "kalau hasilnya sudah tidak berubah, ' +
         'berhenti", tidak ada tawaran keluar. Padahal justru <b>uji itulah ' +
         'yang seharusnya jadi inti sebuah penghitung integral</b> &mdash; dan ' +
         'menuliskannya cuma perlu satu baris: <code>IF ABS(A-A0)&lt;.0001 ' +
         'THEN END</code>. Ctrl-Break bukan rancangan.'],
        ['Kerangka yang diam saja kalau tidak diisi',
         'Kalau baris 2000 dibiarkan, <code>Y</code> tetap 0 dan seluruh ' +
         'kolom hasilnya nol. Tidak ada galat, tidak ada peringatan saat ' +
         'jalan &mdash; cuma kotak bergaris ganda yang sudah lewat sebelum ' +
         'pemakainya sempat membaca. <b>Sebuah kerangka yang gagal diisi ' +
         'seharusnya berteriak, bukan mengembalikan nol.</b>'],
        ['Kotak peringatan sebagai pengganti pemeriksaan',
         'Empat baris peringatan bergaris ganda ada karena penulisnya tahu ' +
         'orang akan menjalankannya tanpa mengisi baris 2000. Peringatan yang ' +
         'ditulis <b>karena masalahnya sudah diketahui</b> hampir selalu ' +
         'menandakan tempat yang seharusnya diperiksa program, bukan dibaca ' +
         'manusia.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa parabola dan bukan persegi panjang',
        isi: [
          'Cara paling sederhana menghitung luas di bawah kurva: potong jadi ' +
          'banyak persegi panjang tipis, jumlahkan. Itu jumlah Riemann, dan ' +
          'kesalahannya menyusut sebanding dengan lebar potongannya.',
          'Aturan Simpson mengganti tiap pasang potongan dengan ' +
          '<b>parabola</b> yang melewati tiga titiknya. Karena parabola ' +
          'melengkung mengikuti kurvanya, kesalahannya menyusut jauh lebih ' +
          'cepat &mdash; sebanding dengan pangkat empat lebar potongannya.',
          'Bobot 1&ndash;4&ndash;2&ndash;4&ndash;&hellip;&ndash;4&ndash;1 yang ' +
          'terlihat di baris 330&ndash;420 adalah akibat langsung dari ' +
          'aljabar parabola itu: titik ujung sekali, titik ganjil empat kali, ' +
          'titik genap dua kali, lalu semuanya dibagi tiga.',
          'Itu sebabnya <code>N</code> harus <b>genap</b>. Baris 160 memulainya ' +
          'dari 2 dan baris 450 selalu menggandakannya, jadi syarat itu ' +
          'terpenuhi tanpa perlu diperiksa &mdash; salah satu keputusan paling ' +
          'rapi di program ini.'
        ] },
      { judul: 'Baris kosong yang jadi antarmuka',
        isi: [
          'Program ini tidak bisa dijalankan apa adanya. Bukan karena rusak, ' +
          'melainkan karena <b>belum lengkap menurut rancangannya</b>.',
          '<code>2000 REM **** Y=F(X) Goes Here ************</code>',
          'Pemakainya diharapkan mengetik baris penggantinya di prompt ' +
          'GW-BASIC &mdash; <code>2000 Y=X*X</code>, atau ' +
          '<code>2000 Y=SIN(X)</code> &mdash; lalu <code>RUN</code>. Baris ' +
          'bernomor sama akan menimpa yang lama, dan seluruh sisanya ' +
          'menyesuaikan tanpa disentuh.',
          'Yang sedang terjadi di sini adalah menyuntikkan perilaku ke dalam ' +
          'algoritma umum. Di bahasa modern kita menyerahkan sebuah fungsi ' +
          'sebagai argumen: <code>integrate(f, a, b)</code>. BASIC 1982 tidak ' +
          'punya fungsi sebagai nilai, jadi yang disepakati bukan nama ' +
          'parameter melainkan <b>nomor baris</b>: 2000 sampai 2999 adalah ' +
          'milik pemakai, sisanya milik program.',
          'Kelemahannya kelihatan begitu disebut: kesepakatan itu tidak ' +
          'dipaksakan oleh apa pun. Tidak ada yang memeriksa apakah baris 2000 ' +
          'sudah diisi. Kalau belum, <code>Y</code> tetap 0 &mdash; nilai awal ' +
          'setiap variabel BASIC &mdash; dan programnya berjalan mulus sambil ' +
          'mengintegralkan fungsi nol.',
          'Dan itulah yang Anda lihat di halaman ini: kolom hasil yang isinya ' +
          'nol semua, dari program yang tidak melakukan satu pun kesalahan.'
        ] },
      { judul: 'Gelung yang tidak pernah selesai',
        isi: [
          'Dua baris terakhir alur utamanya:',
          '<code>450 N=N*2</code><br><code>460 GOTO 320</code>',
          'Segmennya digandakan, lalu semuanya dihitung ulang dari awal. ' +
          'Selamanya.',
          'Gagasannya sendiri benar dan bagus: makin banyak segmen, makin ' +
          'halus hampirannya, dan pemakainya bisa membaca kolom hasil dari ' +
          'atas ke bawah untuk melihat angkanya mengendap. Itu cara ' +
          'memperlihatkan kekonvergenan yang lebih jujur daripada memberi ' +
          'satu angka jadi.',
          'Yang hilang cuma satu baris. Simpan hasil sebelumnya, bandingkan, ' +
          'berhenti kalau selisihnya sudah lebih kecil dari yang diminta:',
          '<code>445 IF ABS(A-A0)&lt;.0001 THEN END ELSE A0=A</code>',
          'Tanpa itu, <code>N</code> terus berlipat &mdash; 2, 4, 8, &hellip; ' +
          'melewati sejuta &mdash; dan tiap putaran memanggil subrutin 2000 ' +
          'sebanyak <code>N+1</code> kali. Program yang seharusnya menjawab ' +
          'dalam sedetik berubah jadi program yang tidak pernah menjawab.',
          'Di penelusur, gelung itu juga tidak akan berhenti sendiri. ' +
          'Gunakan tombol <b>Jeda</b>, atau pasang titik henti di baris 440 ' +
          'dan perhatikan <code>N</code> berlipat dua tiap kali baris itu ' +
          'tersorot.'
        ] }
    ]
  };
})(window);
