/* ===========================================================================
   SIMEQN.js — porting minimalis SIMEQN.BAS sebagai tabel baris.

   Lima puluh baris dari Feldman & Rugg, 1982: penyelesai sistem persamaan
   linear serentak. Metodenya ELIMINASI GAUSS DENGAN PIVOT PARSIAL — algoritma
   yang sampai hari ini ada di dalam setiap pustaka aljabar linear yang
   dipakai orang.

   Dua bagian, dan itu seluruh isinya:

       410-550   maju: buat segitiga. Tiap baris dikurangi kelipatan baris di
                 atasnya sampai semua yang di bawah diagonal jadi nol.
       560-590   mundur: baris terakhir tinggal satu suku, jadi X-nya langsung
                 ketahuan. Sulihkan ke atas, satu per satu.

   Dan di antara keduanya, 420-480: PIVOT PARSIAL. Sebelum mengeliminasi
   sebuah kolom, cari baris yang angkanya PALING BESAR di kolom itu dan
   tukarkan ke atas. Bukan demi kerapian — demi ketelitian. Membagi dengan
   angka kecil membesarkan galat pembulatan, dan galat itu ikut terbawa ke
   setiap baris di bawahnya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom. Terasa di
     baris 380, yang menggambar garis pemisah selebar 40 aksara — di layar 80
     kolom ia jadi separuh lebar layar.
   - `BEEP` diam.
   =========================================================================== */

(function (global) {
  'use strict';

  var GARIS = 205;                        /* CP437 garis datar ganda */

  function angka(s) {
    var n = parseFloat(String(s).replace(/^\s+/, ''));
    return isNaN(n) ? 0 : n;
  }

  /* MID$(STR$(n),2) — buang satu spasi yang ditaruh BASIC di depan angka
     positif. Muncul empat kali di program ini dan sekali tidak dipakai. */
  function tanpaSpasi(n) { return String(n); }

  var tabel = [

    rem(100), rem(110), rem(120), rem(130),

    { baris: 140, jalan: function (m) { m.warna(7, 0); } },
    /* 150 `DEFINT J,K,L,M,N` — kelima pencacah gelungnya bulat. Perhatikan
       `L` ikut di dalamnya: di sini L bukan batas bawah melainkan nomor
       baris pivot. */
    { baris: 150, jalan: function (m) { m.cls(); } },
    { baris: 160, jalan: function (m) {
        m.tab(5); m.cetak('A SIMULTANEOUS LINEAR EQUATION'); m.barisBaru();
      } },
    { baris: 170, jalan: function (m) {
        m.tab(17); m.cetak('SOLVER'); m.barisBaru();
      } },
    { baris: 180, jalan: function (m) { m.barisBaru(); } },
    { baris: 190, bagian: [
        function (m) { m.cetak('Number of equations'); },
        function (m) { m.masukan(function (s) { m.v.N = Math.round(angka(s)); }, '? '); }
      ] },
    { baris: 200, jalan: function (m) { if (m.v.N > 0) m.lompat(230); } },
    { baris: 210, jalan: function (m) { m.barisBaru(); m.bunyi(); } },
    { baris: 220, jalan: function (m) {
        m.cetak('There must be at least 1 !'); m.barisBaru();
        m.lompat(180);
      } },
    /* 230 larik dibuat SESUDAH jumlahnya diketahui. Kalau baris ini kena dua
       kali, GW-BASIC menolak dengan "Duplicate Definition" — dan itu tidak
       pernah terjadi karena 220 kembali ke 180, bukan ke 230. */
    { baris: 230, jalan: function (m) {
        m.dim('A', m.v.N, m.v.N);
        m.dim('R', m.v.N);
        m.dim('V', m.v.N);
      } },
    { baris: 240, jalan: function (m) { m.barisBaru(); } },
    /* 250 di sini angkanya TIDAK dibersihkan, jadi tercetak "The 3 unknowns"
       dengan spasi di kedua sisi — dan "The 1 unknowns" kalau N=1. */
    { baris: 250, jalan: function (m) {
        m.cetak('The ' + m.v.N + ' unknowns will be denoted'); m.barisBaru();
      } },
    { baris: 260, jalan: function (m) {
        m.cetak('X1 through X' + tanpaSpasi(m.v.N)); m.barisBaru();
      } },
    { baris: 270, bagian: [
        function (m) { m.gosub(380); },
        function (m) { m.untuk('J', 1, m.v.N, 1, 340); }
      ] },
    { baris: 280, jalan: function (m) {
        m.cetak('Enter values for equation ' + m.v.J); m.barisBaru();
      } },
    { baris: 290, bagian: [
        function (m) { m.barisBaru(); },
        function (m) { m.untuk('K', 1, m.v.N, 1, 320); }
      ] },
    { baris: 300, jalan: function (m) {
        m.cetak('Coefficient of X' + tanpaSpasi(m.v.K));
      } },
    { baris: 310, bagian: [
        function (m) {
          m.masukan(function (s) { m.v.A[m.v.J][m.v.K] = angka(s); }, '? ');
        },
        function (m) { m.lanjutkan('K'); }
      ] },
    { baris: 320, bagian: [
        function (m) { m.cetak('Right hand side'); },
        function (m) { m.masukan(function (s) { m.v.R[m.v.J] = angka(s); }, '? '); }
      ] },
    { baris: 330, bagian: [
        function (m) { m.gosub(380); },
        function (m) { m.lanjutkan('J'); },
        function (m) { m.gosub(390); }
      ] },
    { baris: 340, jalan: function (m) { m.cetak('The solution is'); m.barisBaru(); } },
    { baris: 350, bagian: [
        function (m) { m.barisBaru(); },
        function (m) { m.untuk('J', 1, m.v.N, 1, 370); }
      ] },
    { baris: 360, jalan: function (m) {
        m.cetak('  X' + tanpaSpasi(m.v.J) + '=' + basic(m.v.V[m.v.J]));
        m.barisBaru();
      } },
    { baris: 370, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { m.henti('Selesai di baris 370 (END).'); }
      ] },
    /* 380 garis pemisah selebar 40 aksara, dipanggil tiga kali. */
    { baris: 380, jalan: function (m) {
        m.barisBaru();
        m.cetak(m.ulang(40, GARIS)); m.barisBaru();
        m.barisBaru();
        m.kembali();
      } },

    /* --- 390-590: eliminasi Gauss ----------------------------------------- */
    { baris: 390, jalan: function (m) { if (m.v.N > 1) m.lompat(410); } },
    /* 400 satu persamaan satu variabel: bagi saja. Tidak ada pemeriksaan
       A(1,1)=0 di sini — lihat catatan tentang matriks singular. */
    { baris: 400, jalan: function (m) {
        m.v.V[1] = m.v.R[1] / m.v.A[1][1];
        m.kembali();
      } },
    { baris: 410, bagian: [
        function (m) { m.untuk('K', 1, m.v.N - 1, 1, 560); },
        function (m) { m.v.M = m.v.K + 1; }
      ] },

    /* 420-450 CARI PIVOT: baris mana, dari K sampai N, yang angkanya paling
       besar di kolom K. `L` menyimpan calonnya, `M` yang sedang diperiksa. */
    { baris: 420, jalan: function (m) { m.v.L = m.v.K; } },
    { baris: 430, jalan: function (m) {
        m.v.Q = Math.abs(m.v.A[m.v.M][m.v.K]) - Math.abs(m.v.A[m.v.L][m.v.K]);
      } },
    { baris: 440, jalan: function (m) { if (m.v.Q > 0) m.v.L = m.v.M; } },
    /* 450 gelung buatan sendiri: naikkan M, kembali ke 430. Bukan FOR —
       padahal bisa. Lihat catatan tentang dua gaya gelung. */
    { baris: 450, jalan: function (m) {
        if (m.v.M < m.v.N) { m.v.M = m.v.M + 1; m.lompat(430); }
      } },
    { baris: 460, jalan: function (m) { if (m.v.L === m.v.K) m.lompat(490); } },
    /* 470-480 TUKAR BARIS: seluruh koefisiennya, lalu ruas kanannya. Kalau
       ruas kanannya lupa ikut ditukar, jawabannya salah tanpa satu pun
       tanda. */
    { baris: 470, bagian: [
        function (m) { m.untuk('J', m.v.K, m.v.N, 1, 480); },
        function (m) {
          var a = m.v.A, K = m.v.K, L = m.v.L, J = m.v.J;
          var t = a[K][J]; a[K][J] = a[L][J]; a[L][J] = t;
        },
        function (m) { m.lanjutkan('J'); }
      ] },
    { baris: 480, jalan: function (m) {
        var r = m.v.R, K = m.v.K, L = m.v.L;
        var t = r[K]; r[K] = r[L]; r[L] = t;
      } },

    /* 490-540 ELIMINASI: tiap baris di bawah K dikurangi kelipatan baris K,
       sebanyak yang membuat kolom K-nya jadi nol. */
    { baris: 490, jalan: function (m) { m.v.M = m.v.K + 1; } },
    /* 500 `Q=A(M,K)/A(K,K)` — TIDAK ADA pemeriksaan A(K,K)=0. Kalau
       matriksnya singular, di sini terjadi pembagian nol dan GW-BASIC
       melanjutkan dengan tak-hingga mesin. Lihat "Yang jangan ditiru". */
    { baris: 500, jalan: function (m) {
        m.v.Q = m.v.A[m.v.M][m.v.K] / m.v.A[m.v.K][m.v.K];
        m.v.A[m.v.M][m.v.K] = 0;
      } },
    { baris: 510, jalan: function (m) { m.untuk('J', m.v.K + 1, m.v.N, 1, 530); } },
    { baris: 520, bagian: [
        function (m) {
          var a = m.v.A, M = m.v.M, J = m.v.J, K = m.v.K;
          a[M][J] = a[M][J] - m.v.Q * a[K][J];
        },
        function (m) { m.lanjutkan('J'); }
      ] },
    { baris: 530, jalan: function (m) {
        m.v.R[m.v.M] = m.v.R[m.v.M] - m.v.Q * m.v.R[m.v.K];
      } },
    { baris: 540, jalan: function (m) {
        if (m.v.M < m.v.N) { m.v.M = m.v.M + 1; m.lompat(500); }
      } },
    { baris: 550, jalan: function (m) { m.lanjutkan('K'); } },

    /* 560-590 SULIH BALIK: baris terakhir tinggal satu suku. */
    { baris: 560, jalan: function (m) {
        m.v.V[m.v.N] = m.v.R[m.v.N] / m.v.A[m.v.N][m.v.N];
      } },
    { baris: 570, jalan: function (m) { m.untuk('M', m.v.N - 1, 1, -1, 590); } },
    { baris: 580, bagian: [
        function (m) { m.v.Q = 0; },
        function (m) { m.untuk('J', m.v.M + 1, m.v.N, 1, 590); },
        function (m) {
          m.v.Q = m.v.Q + m.v.A[m.v.M][m.v.J] * m.v.V[m.v.J];
        }
      ] },
    /* 590 `V(M)=...` berada DI DALAM gelung J — dihitung ulang tiap putaran.
       Hasilnya tetap benar karena yang terakhir memakai Q yang sudah lengkap,
       tapi pekerjaannya terbuang. Lihat "Yang jangan ditiru". */
    { baris: 590, bagian: [
        function (m) {
          m.v.V[m.v.M] = (m.v.R[m.v.M] - m.v.Q) / m.v.A[m.v.M][m.v.M];
        },
        function (m) { m.lanjutkan('J'); },
        function (m) { m.lanjutkan('M'); },
        function (m) { m.kembali(); }
      ] }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }

  function basic(n) {
    if (n === undefined || n === null) n = 0;
    var s;
    if (n === Math.floor(n) && Math.abs(n) < 1e15) s = String(Math.abs(n));
    else s = String(Number(Math.abs(n).toPrecision(7))).replace(/^0\./, '.');
    return (n < 0 ? '-' : ' ') + s + ' ';
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['SIMEQN'] = {
    nama: 'SIMEQN',
    judul: 'Simeqn (eliminasi Gauss)',
    sumber: 'SIMEQN',
    berkas: 'run/SIMEQN.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur SIMEQN.BAS',
      simpul: [
        { id: 'jumlah', baris: '190-220', jenis: 'putusan',
          teks: ['Berapa persamaan?', 'harus lebih dari nol'] },
        { id: 'larik', baris: '230',
          teks: ['DIM A(N,N), R(N), V(N)', 'sesudah N diketahui'] },
        { id: 'isi', baris: '270-330',
          teks: ['Tanya tiap koefisien', 'dan tiap ruas kanan'] },
        { id: 'satu', baris: '390-400',
          teks: ['N=1: bagi saja,', 'tanpa eliminasi'] },
        { id: 'pivot', baris: '420-480',
          teks: ['Cari angka terbesar', 'di kolom K, tukar ke atas'] },
        { id: 'maju', baris: '490-550',
          teks: ['Kurangi tiap baris di bawah,', 'kolom K jadi nol'] },
        { id: 'mundur', baris: '560-590',
          teks: ['Baris terakhir langsung;', 'sulihkan ke atas'] },
        { id: 'cetak', baris: '340-370', jenis: 'keluar',
          teks: ['Cetak X1 sampai XN', 'lalu END'] }
      ],
      panah: [
        { dari: 'jumlah', ke: 'larik', label: 'N > 0' },
        { dari: 'jumlah', ke: 'jumlah', label: 'N <= 0: tanya lagi', jenis: 'galat' },
        { dari: 'larik', ke: 'isi' },
        { dari: 'isi', ke: 'satu' },
        { dari: 'satu', ke: 'cetak', label: 'N = 1' },
        { dari: 'satu', ke: 'pivot', label: 'N > 1' },
        { dari: 'pivot', ke: 'maju' },
        { dari: 'maju', ke: 'pivot', label: 'kolom berikutnya' },
        { dari: 'maju', ke: 'mundur', label: 'segitiga selesai' },
        { dari: 'mundur', ke: 'cetak' }
      ]
    },

    pseudokode: [
      { baris: 190, tingkat: 0, teks: 'tanya <code>N</code>, ulangi selama <code>N &le; 0</code>' },
      { baris: 230, tingkat: 0, teks: '<code>DIM A(N,N), R(N), V(N)</code> &mdash; <b>sesudah</b> N diketahui' },
      { baris: 270, tingkat: 0, teks: 'untuk tiap persamaan: tanya N koefisien, lalu ruas kanannya' },
      { baris: 410, tingkat: 0, teks: '<b>MAJU</b> &mdash; untuk tiap kolom <code>K</code> = 1&hellip;N&minus;1:' },
      { baris: 420, tingkat: 1, teks: 'cari baris dengan <code>|A(baris,K)|</code> terbesar &mdash; <b>pivot parsial</b>' },
      { baris: 470, tingkat: 1, teks: 'tukar baris itu ke posisi K, <b>berikut ruas kanannya</b>' },
      { baris: 500, tingkat: 1, teks: 'untuk tiap baris di bawah: kurangi <code>Q&times;</code>baris K, sampai kolom K jadi nol' },
      { baris: 560, tingkat: 0, teks: '<b>MUNDUR</b> &mdash; baris terakhir tinggal satu suku: <code>V(N)=R(N)/A(N,N)</code>' },
      { baris: 570, tingkat: 1, teks: 'naik satu baris: kurangi suku yang sudah diketahui, bagi dengan diagonalnya' },
      { baris: 350, tingkat: 0, teks: 'cetak <code>X1</code> sampai <code>XN</code>' }
    ],

    perintahAsli: 'run\\SIMEQN.bat',
    catatanAsli: 'Coba sistem yang jawabannya sudah diketahui, misalnya ' +
      '<code>2x + y = 5</code> dan <code>x - y = 1</code> &mdash; jawabannya ' +
      'X1=2, X2=1. Masukkan koefisiennya berurutan: 2, 1, 5, lalu 1, -1, 1.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol penelusur tetap 80 ' +
      'kolom. Terasa di baris 380, yang menggambar garis pemisah selebar 40 ' +
      'aksara &mdash; di layar 80 kolom ia jadi separuh lebar layar.',

      '<b><code>BEEP</code> diam</b> (baris 210).',

      '<b>Pembagian nol memberi <code>NaN</code>, bukan tak-hingga mesin.</b> ' +
      'Kalau sistemnya singular, GW-BASIC mencetak "Division by zero" lalu ' +
      'melanjutkan dengan 1.701412E+38; penelusur melanjutkan dengan ' +
      '<code>NaN</code>. Akibatnya sama dan itu yang penting: <b>program ' +
      'selesai dengan tenang dan mencetak sampah sebagai jawaban</b>.',

      '<b><code>SWAP</code> ditulis apa adanya sebagai tukar-tiga-langkah</b> ' +
      'di baris 470 dan 480. GW-BASIC punya perintah bawaan untuk itu; ' +
      'JavaScript tidak, dan menambah operasi mesin baru untuk satu program ' +
      'tidak sepadan.'
    ],

    pelajaran: {
      ringkas: 'Eliminasi Gauss dengan pivot parsial dalam dua puluh baris ' +
        '&mdash; algoritma yang masih ada di setiap pustaka aljabar linear ' +
        'hari ini, tanpa satu pun penjagaan terhadap matriks singular.',
      pelajari: [
        ['Dua bagian, dan itu seluruh algoritmanya',
         '<b>Maju</b> (410&ndash;550): tiap baris dikurangi kelipatan baris di ' +
         'atasnya sampai semua yang di bawah diagonal jadi nol. <b>Mundur</b> ' +
         '(560&ndash;590): baris terakhir tinggal satu suku, jadi X-nya ' +
         'langsung ketahuan; sulihkan ke atas satu per satu. Selesai.'],
        ['Kenapa pivot parsial, dan kenapa itu bukan kerapian',
         'Baris 420&ndash;480 mencari baris dengan angka <b>terbesar</b> di ' +
         'kolom yang sedang dikerjakan, lalu menukarnya ke atas. Alasannya ' +
         'ketelitian: baris 500 membagi dengan <code>A(K,K)</code>, dan ' +
         'membagi dengan angka kecil <b>membesarkan galat pembulatan</b> ' +
         '&mdash; galat yang lalu ikut terbawa ke setiap baris di bawahnya. ' +
         'Menukar baris tidak mengubah jawabannya sama sekali, tapi bisa ' +
         'mengubah berapa banyak angka di belakang koma yang masih benar.'],
        ['Larik yang ukurannya ditentukan pemakai',
         'Baris 230 <code>DIM A(N,N),R(N),V(N)</code> dijalankan <b>sesudah</b> ' +
         '<code>N</code> diketahui dari <code>INPUT</code>. Itu sebabnya baris ' +
         '220 kembali ke <b>180</b> dan bukan ke 230: kalau baris 230 kena dua ' +
         'kali, GW-BASIC menolak dengan "Duplicate Definition". Satu nomor ' +
         'baris yang dipilih dengan benar.'],
        ['Menukar ruas kanan bersama barisnya',
         'Baris 470 menukar koefisiennya, baris 480 menukar ' +
         '<code>R()</code>-nya. Kalau yang kedua terlupa, matriksnya benar ' +
         'tapi jawabannya salah &mdash; dan tidak ada satu pun yang akan ' +
         'memberi tahu. Persamaan adalah <b>kedua sisinya</b>, dan menukar ' +
         'satu tanpa yang lain memutus pasangannya.']
      ],
      hindari: [
        ['Membagi tanpa memeriksa nol',
         'Baris 500 <code>Q=A(M,K)/A(K,K)</code>, baris 560 ' +
         '<code>V(N)=R(N)/A(N,N)</code>, baris 400 ' +
         '<code>V(1)=R(1)/A(1,1)</code>. Tak satu pun memeriksa penyebutnya. ' +
         'Kalau sistemnya <b>singular</b> &mdash; misalnya dua persamaan yang ' +
         'sebenarnya sama &mdash; diagonalnya jadi nol, GW-BASIC mencetak ' +
         '"Division by zero" lalu <b>melanjutkan</b> dengan tak-hingga mesin, ' +
         'dan jawaban yang tercetak di baris 360 adalah sampah yang terlihat ' +
         'seperti angka. Padahal pivot parsial di 420&ndash;450 sudah ' +
         'menemukan angka terbesarnya; kalau yang terbesar pun nol, di situlah ' +
         'tempat paling murah untuk mengatakan "sistem ini tidak punya ' +
         'jawaban tunggal".'],
        ['Penugasan yang tertinggal di dalam gelung',
         'Baris 590 <code>V(M)=(R(M)-Q)/A(M,M)</code> berada <b>di dalam</b> ' +
         'gelung <code>J</code> yang dibuka di baris 580. Ia dihitung ulang ' +
         'tiap putaran, padahal cuma yang terakhir yang berarti. Hasilnya ' +
         'tetap benar &mdash; itu yang membuatnya bertahan &mdash; tapi ' +
         'pekerjaannya terbuang, dan pembaca berikutnya harus berhenti dulu ' +
         'untuk memastikan bahwa itu memang tidak merusak apa-apa. ' +
         '<b>Kebenaran yang harus dibuktikan ulang tiap kali dibaca punya ' +
         'harga.</b>'],
        ['Dua gaya gelung dalam satu subrutin',
         'Baris 410 dan 510 memakai <code>FOR/NEXT</code>. Baris 450 dan 540 ' +
         'menulis gelungnya sendiri: <code>IF M&lt;N THEN M=M+1:GOTO &hellip;</code>. ' +
         'Keduanya melakukan hal yang persis sama, di subrutin yang sama, ' +
         'sepuluh baris berjauhan. Yang buatan sendiri itu <b>tidak mendapat ' +
         'apa pun</b> sebagai gantinya &mdash; ia cuma membuat batas gelungnya ' +
         'tidak terlihat.'],
        ['Kalimat yang tidak dijaga tata bahasanya',
         'Baris 250 mencetak <code>"The";N;"unknowns"</code>. Untuk N=1 ' +
         'hasilnya "The 1 unknowns". Dan di sini <code>N</code> ' +
         '<b>tidak</b> dibersihkan dengan <code>MID$(STR$(N),2)</code>, ' +
         'padahal trik itu dipakai di baris 260, 300, dan 360. Empat tempat, ' +
         'tiga cara.']
      ]
    },

    penjelasan: [
      { judul: 'Membuat segitiga, lalu memanjatnya',
        isi: [
          'Tiga persamaan tiga variabel terlihat rumit karena ketiganya ' +
          'terikat satu sama lain. Eliminasi Gauss melepas ikatan itu satu per ' +
          'satu sampai tersisa satu persamaan yang cuma punya satu variabel.',
          'Caranya cuma satu gerakan, diulang: <b>kurangi sebuah baris dengan ' +
          'kelipatan baris di atasnya</b>, sebanyak yang membuat satu ' +
          'koefisiennya jadi nol. Itu boleh dilakukan karena mengurangkan ' +
          'persamaan dari persamaan tidak mengubah jawabannya.',
          'Sesudah dijalankan untuk seluruh kolom, matriksnya berbentuk ' +
          'segitiga: baris pertama masih punya semua variabel, baris kedua ' +
          'kehilangan satu, dan baris terakhir cuma punya satu.',
          'Baris terakhir itulah yang dikerjakan lebih dulu (baris 560): satu ' +
          'variabel, satu pembagian, selesai. Lalu naik satu baris &mdash; ' +
          'yang sekarang cuma punya satu variabel yang belum diketahui, karena ' +
          'yang lain sudah ketemu. Begitu terus sampai ke atas.',
          'Dua puluh baris BASIC, dan bentuk yang sama masih ada di dalam ' +
          'LAPACK yang dipanggil NumPy dan MATLAB hari ini.'
        ] },
      { judul: 'Kenapa barisnya ditukar-tukar',
        isi: [
          'Baris 420&ndash;480 adalah bagian yang paling mudah dikira ' +
          'kerapian, dan justru yang paling penting.',
          'Sebelum mengeliminasi kolom <code>K</code>, program menyisir seluruh ' +
          'baris dari K sampai N, mencari yang <b>nilai mutlaknya paling ' +
          'besar</b> di kolom itu, lalu menukarnya ke posisi K.',
          'Alasannya ada di baris 500: <code>Q=A(M,K)/A(K,K)</code>. Angka ' +
          'yang jadi penyebut itu dipakai untuk <b>setiap baris di bawahnya</b>. ' +
          'Kalau kebetulan kecil &mdash; katakan 0,0001 &mdash; maka ' +
          '<code>Q</code> jadi besar, dan setiap galat pembulatan kecil di ' +
          'baris K ikut dikalikan besar dan disebar ke seluruh matriks.',
          'Menukar baris tidak mengubah jawaban sama sekali; sistem persamaan ' +
          'tidak peduli urutan penulisannya. Yang berubah cuma <b>berapa banyak ' +
          'angka di belakang koma yang masih bisa dipercaya</b> di akhir.',
          'Ini salah satu contoh paling bersih dari sesuatu yang sering ' +
          'terlihat di kode numerik: langkah yang secara matematika tidak ' +
          'melakukan apa-apa, tapi tanpanya hasilnya berantakan.',
          'Dan justru di situ letak kelalaiannya. Program sudah bersusah payah ' +
          'mencari angka terbesar di kolom itu &mdash; tapi tidak pernah ' +
          'bertanya apakah yang terbesar itu <b>nol</b>. Kalau ya, sistemnya ' +
          'singular, dan baris 500 akan membagi dengan nol.'
        ] },
      { judul: 'Satu baris yang tertinggal di dalam gelung',
        isi: [
          'Dua baris terakhir programnya:',
          '<code>580 Q=0:FOR J=M+1 TO N:Q=Q+A(M,J)*V(J)</code><br>' +
          '<code>590 V(M)=(R(M)-Q)/A(M,M):NEXT:NEXT</code>',
          'Perhatikan di mana <code>NEXT</code> yang pertama berada: ' +
          '<b>sesudah</b> <code>V(M)=&hellip;</code>. Artinya penugasan itu ada ' +
          'di dalam gelung <code>J</code>, dan dijalankan ulang tiap putaran.',
          'Untuk <code>M</code> yang jauh dari ujung, itu berarti puluhan ' +
          'pembagian yang hasilnya langsung ditimpa putaran berikutnya. Hanya ' +
          'yang terakhir yang benar-benar dipakai &mdash; dan yang terakhir ' +
          'itu memang benar, karena <code>Q</code> sudah lengkap saat itu.',
          'Jadi programnya bekerja. Itu justru yang membuat cacat semacam ini ' +
          'bertahan puluhan tahun: tidak ada gejalanya.',
          'Tapi harganya bukan cuma kecepatan. Pembaca berikutnya &mdash; ' +
          'termasuk penulisnya sendiri enam bulan kemudian &mdash; harus ' +
          'berhenti, melacak <code>Q</code>, dan meyakinkan diri bahwa ' +
          'penugasan berulang itu tidak merusak apa-apa. <b>Kode yang benar ' +
          'karena kebetulan menuntut pembuktian ulang tiap kali dibaca.</b>',
          'Memindahkan satu <code>NEXT</code> ke ujung baris 580 menyelesaikan ' +
          'keduanya sekaligus.'
        ] }
    ]
  };
})(window);
