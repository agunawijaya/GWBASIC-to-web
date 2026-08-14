/* ===========================================================================
   HINTS.js — porting minimalis HINTS.BAS sebagai tabel baris.

   Seratus tiga puluh dua baris: lima halaman bantuan perintah DOS, dengan
   F1 untuk halaman sebelumnya dan F10 untuk keluar. Bukan permainan, bukan
   perhitungan — sebuah PEMBACA DOKUMEN, ditulis dengan cara satu-satunya
   yang tersedia pada 1982.

   Dan di tengahnya ada satu baris yang layak seluruh halaman ini:

       1300 KEY(1) OFF:BACKFLAG=1:RETURN 1310

   `RETURN <baris>` — bukan `RETURN` polos. Ia MEMBUANG alamat pulang dan
   melanjutkan di tempat lain. Yang terjadi:

       baris 250   GOSUB 1190          <- tunggu tombol
       baris 1210  Z=INKEY$: ...       <- menunggu di sini
       F1 ditekan  GOSUB 1300          <- jebakan menyela
       baris 1300  RETURN 1310         <- alamat pulang JEBAKAN dibuang
       baris 1310  RETURN              <- ...dan ini pulang dari GOSUB 1190

   Jadi menekan F1 membuat subrutin penunggu itu KELUAR LEBIH AWAL, dengan
   sebuah bendera terpasang. Cara membatalkan pekerjaan yang sedang menunggu,
   di bahasa yang tidak punya `break` maupun pengecualian.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 1200) dijadikan pembuang penyangga tombol, karena
     dipasangkan dengan gelung pembuang `IF INKEY$<>""` di baris yang sama.
   - Berakhir dengan `RUN"intro`, dan penangkap galat di baris 1320 dengan
     `RUN "menu`. Keduanya tanpa tanda kutip penutup — lihat catatan.
   =========================================================================== */

(function (global) {
  'use strict';

  var G_KA = 201, G_D = 205, G_KN = 187, G_T = 186, G_BN = 188, G_BA = 200;

  var tabel = [

    { baris: 10, jalan: function (m) { m.penangkapGalat = 1320; } },
    { baris: 20, jalan: function (m) {
        m.pasangJebakan(10, 1220); m.jebakan(10, true);
      } },
    /* 30 F1 dipasang di sini tapi baru DINYALAKAN di baris 1190, tiap kali
       program mulai menunggu tombol. Di luar penungguan, F1 tidak berarti
       apa-apa. */
    { baris: 30, jalan: function (m) { m.pasangJebakan(1, 1300); } },
    { baris: 40, jalan: function () { } },
    { baris: 50, jalan: function (m) { m.v.XLIN = 1; m.v.XPOS = 1; } },

    /* --- halaman 1: istilah dasar ----------------------------------------- */
    { baris: 60, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1270); }
      ] },
    bingkaiAtas(70), bingkaiSisi(80), bingkaiBawah(90), judul(100),
    tulis(110, 5, 20, 'Before proceeding  with specific commands,'),
    tulis(120, 6, 20, 'it will be  helpful for you to understand'),
    tulis(130, 7, 20, 'a few terms and concepts.'),
    tulis(140, 9, 20, 'FRAGMENTATION  is a term used to describe'),
    tulis(150, 10, 20, "a file that is `broken up' and resides on"),
    tulis(160, 11, 20, 'different parts of a diskette rather than'),
    tulis(170, 12, 20, 'intact in one place as it should be.'),
    tulis(180, 14, 20, 'There are TWO types of commands, INTERNAL'),
    tulis(190, 15, 20, 'and EXTERNAL. Internal commands are built'),
    tulis(200, 16, 20, 'into the command processor;  and external'),
    tulis(210, 17, 20, 'commands reside on the  DOS  diskette.'),
    tulis(220, 19, 20, 'All of the commands on the next 3 screens'),
    tulis(230, 20, 20, "(except `COPY') are external commands, so"),
    tulis(240, 21, 20, 'THEY ALL REQUIRE USE OF THE DOS DISKETTE!'),
    { baris: 250, jalan: function (m) { m.gosub(1190); } },
    { baris: 260, jalan: function (m) {
        if (m.v.BACKFLAG) m.jalankan('INTRO');
      } },

    /* --- halaman 2: FORMAT dan CHKDSK ------------------------------------- */
    { baris: 270, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1270); }
      ] },
    bingkaiAtas(280), bingkaiSisi(290), bingkaiBawah(300), judul(310),
    tulis(320, 5, 10, 'FORMAT B:/S'),
    tulis(330, 5, 24, 'You must put  DOS  onto all new diskettes that'),
    tulis(340, 6, 24, 'you want to use with your disk driven PC. With'),
    tulis(350, 7, 24, 'third party software, you must  FORMAT a blank'),
    tulis(360, 8, 24, 'diskette BEFORE you can copy anything onto it.'),
    tulis(370, 10, 24, 'To FORMAT a new diskette, first insert the DOS'),
    tulis(380, 11, 24, 'diskette. Type FORMAT B:/S and press ENTER key.'),
    tulis(390, 13, 24, 'By using Format B:/S you will FORMAT and trans-'),
    tulis(400, 14, 24, 'fer the three system files to the new diskette.'),
    tulis(410, 16, 10, 'CHKDSK B:'),
    tulis(420, 16, 24, 'This command will tell you:  1) how many total'),
    tulis(430, 17, 24, 'bytes of storage are on the diskette,   2) how'),
    tulis(440, 18, 24, 'many  bytes  of  storage that remain available,'),
    tulis(450, 19, 24, '3) the number of files,   4) total bytes of PC'),
    tulis(460, 20, 24, 'memory, and 5) bytes of memory still available.'),
    { baris: 470, jalan: function (m) { m.gosub(1190); } },
    { baris: 480, jalan: function (m) { if (m.v.BACKFLAG) m.lompat(60); } },

    /* --- halaman 3: menyalin disket --------------------------------------- */
    { baris: 490, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1270); }
      ] },
    bingkaiAtas(500), bingkaiSisi(510), bingkaiBawah(520), judul(530),
    tulis(540, 5, 9, 'DISKCOPY A: B:'),
    tulis(550, 5, 24, "This command will produce a `carbon  copy' of the"),
    tulis(560, 6, 24, 'diskette in drive  A  to the diskette in drive  B.'),
    tulis(570, 8, 9, 'DISKCOMP A: B:'),
    tulis(580, 8, 24, 'This should be used after a diskcopy command.  It'),
    tulis(590, 9, 24, 'will verify that the orginal was copied correctly.'),
    tulis(600, 11, 9, 'COPY A:*.* B:'),
    tulis(610, 11, 24, 'This command is slower than the  diskcopy command,'),
    tulis(620, 12, 9, ' (Internal)    but is useful because it copies all files  sequen-'),
    tulis(630, 13, 24, 'tually and re-groups any  FRAGMENTED  files. This'),
    tulis(640, 14, 24, 'command can also be used to copy a single file by'),
    tulis(650, 15, 24, 'file name.  Please refer to your  DOS  manual.'),
    tulis(660, 17, 9, 'COMP A:*.* B:'),
    tulis(670, 17, 24, 'Compares the copied diskette to the original on a'),
    tulis(680, 18, 24, 'file by file (ie: name by name) basis.'),
    { baris: 690, jalan: function (m) { m.gosub(1190); } },
    { baris: 700, jalan: function (m) { if (m.v.BACKFLAG) m.lompat(270); } },

    /* --- halaman 4: DATE, MODE, SYS, TIME ---------------------------------- */
    { baris: 710, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1270); },
        function (m) {
          m.locate(1, 1);
          m.cetak(m.chr(G_KA) + m.ulang(78, G_D) + m.chr(G_KN)); m.barisBaru();
        }
      ] },
    bingkaiSisi(720), bingkaiBawah(730), judul(740),
    tulis(750, 4, 10, ''),
    tulis(760, 5, 10, 'DATE          This command will set the date for new'),
    tulis(770, 6, 10, '              files and will appear in the directory.'),
    tulis(780, 7, 10, ''),
    tulis(790, 8, 10, 'MODE[]:[],[]  This command will set the mode for the'),
    tulis(800, 9, 10, '              printer or monitor.'),
    tulis(810, 10, 10, ''),
    tulis(820, 11, 10, 'SYS B:        Transfers the three  DOS  system files.'),
    tulis(830, 12, 10, ''),
    tulis(840, 13, 10, 'TIME          This command will allow you to set the'),
    tulis(850, 14, 10, '              Hours and Minutes used as the starting'),
    tulis(860, 15, 10, '              point on the internal clock.'),
    tulis(870, 16, 10, ''),
    tulis(880, 17, 10, ''),
    tulis(890, 18, 10, '              The MODE and SYS commands are EXTERNAL.'),
    tulis(900, 19, 10, '              They require the use of a DOS diskette.'),
    tulis(910, 20, 10, ''),
    { baris: 920, jalan: function (m) { m.gosub(1190); } },
    { baris: 930, jalan: function (m) { if (m.v.BACKFLAG) m.lompat(490); } },

    /* --- halaman 5: perintah internal -------------------------------------- */
    { baris: 940, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1270); }
      ] },
    bingkaiAtas(950), bingkaiSisi(960), bingkaiBawah(970), judul(980),
    tulis(990, 4, 10, ''),
    tulis(1000, 5, 10, "(batch)       Executes a `batch' of  files or a series of"),
    tulis(1010, 6, 10, '              commands  without  re-entering each command.'),
    tulis(1020, 7, 10, '              This will be done automatically and sequen-'),
    tulis(1030, 8, 10, "              tially for all files with `.BAT' extentions."),
    tulis(1040, 9, 10, ''),
    tulis(1050, 10, 10, 'DIR           Lists all filenames,  the type of  file and'),
    tulis(1060, 11, 10, '              its extention (ie: .com, .bas, .exe, .bat),'),
    tulis(1070, 12, 10, '              the size of the file in bytes, and also the'),
    tulis(1080, 13, 10, '              date that the file was created.'),
    tulis(1090, 14, 10, ''),
    tulis(1100, 15, 10, 'ERASE         Deletes a file from diskette.  You must use'),
    tulis(1110, 16, 10, '              the complete filename and its extention.'),
    tulis(1120, 18, 10, 'TYPE          Displays file contents.'),
    tulis(1130, 20, 10, '              These are  INTERNAL  commands.  They DO NOT'),
    tulis(1140, 21, 10, '              require the use of your  DOS  diskette.'),
    { baris: 1150, jalan: function (m) { m.gosub(1190); } },
    { baris: 1160, jalan: function (m) { if (m.v.BACKFLAG) m.lompat(710); } },
    { baris: 1170, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(1270); }
      ] },
    { baris: 1180, jalan: function (m) { m.jalankan('INTRO'); } },

    /* --- 1190-1210: menunggu satu tombol ---------------------------------- */
    /* Di sinilah F1 DINYALAKAN. Di luar penungguan ini, menekan F1 tidak
       berarti apa-apa — dan itu disengaja: "halaman sebelumnya" cuma masuk
       akal saat halaman sedang ditampilkan. */
    { baris: 1190, jalan: function (m) {
        m.v.BACKFLAG = 0;
        m.jebakan(1, true);
        m.locate(24, 12); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue   Strike <F1> For Previous Page');
        m.warna(3, 0);
      } },
    { baris: 1200, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(1200);
      } },
    { baris: 1210, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1210); else m.kembali();
      } },

    /* --- 1220-1290: F10, dan bilah bawah ---------------------------------- */
    /* 1220 `CSRLIN` dan `POS(0)` MENYIMPAN posisi kursor sebelum bilah
       pertanyaan menimpanya, supaya baris 1280 bisa mengembalikannya. */
    { baris: 1220, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos();
        m.locate(25, 1); m.spc(79);
      } },
    { baris: 1230, jalan: function (m) {
        m.locate(25, 21); m.warna(15, 0);
        m.cetak('Do You Wish To Leave This Program? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 1240, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1240);
      } },
    { baris: 1250, jalan: function (m) {
        if (m.v.Z === 'y' || m.v.Z === 'Y') m.jalankan('INTRO');
      } },
    /* 1260 jawaban "N" JATUH KE BAWAH ke 1270 — subrutin bilah bawah yang
       juga dipanggil tiap halaman. Satu subrutin, dua jalan masuk. */
    { baris: 1260, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(1240);
      } },
    { baris: 1270, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 23); m.warna(0, 7);
      } },
    { baris: 1280, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Program ');
        m.warna(3, 0);
        m.locate(m.v.XLIN, m.v.XPOS, 0);
      } },
    { baris: 1290, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },

    /* --- 1300-1310: F1, dan RETURN <baris> -------------------------------- */
    /* Lihat catatan panjang di kepala berkas. `RETURN 1310` membuang alamat
       pulang jebakan, dan `RETURN` di 1310 pulang dari GOSUB 1190 — jadi
       penungguan tombol itu keluar lebih awal dengan BACKFLAG terpasang. */
    { baris: 1300, jalan: function (m) {
        m.jebakan(1, false); m.v.BACKFLAG = 1;
        m.kembali(1310);
      } },
    { baris: 1310, jalan: function (m) { m.kembali(); } },
    { baris: 1320, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function bingkaiAtas(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.locate(1, 1);
      m.cetak(m.chr(G_KA) + m.ulang(78, G_D) + m.chr(G_KN));
      m.barisBaru();
    } };
  }
  function bingkaiSisi(nomor) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
        m.locate(m.v.A, 1); m.cetak(m.chr(G_T)); m.barisBaru();
        m.locate(m.v.A, 80); m.cetak(m.chr(G_T));
      }
    } };
  }
  function bingkaiBawah(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.locate(23, 1);
      m.cetak(m.chr(G_BA) + m.ulang(78, G_D) + m.chr(G_BN));
    } };
  }
  function judul(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.warna(15, 0); m.locate(3, 31);
      m.cetak('HELPFUL DOS COMMANDS'); m.barisBaru();
      m.warna(3, 0);
    } };
  }
  function tulis(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['HINTS'] = {
    nama: 'HINTS',
    judul: 'Hints (lima halaman bantuan DOS)',
    sumber: 'HINTS',
    berkas: 'run/HINTS.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur HINTS.BAS',
      simpul: [
        { id: 'pasang', baris: '10-50', jenis: 'mulai',
          teks: ['ON ERROR, F10 ke keluar,', 'F1 ke halaman sebelumnya'] },
        { id: 'hal1', baris: '60-260',
          teks: ['Halaman 1:', 'istilah dan konsep'] },
        { id: 'hal2', baris: '270-480',
          teks: ['Halaman 2:', 'FORMAT, CHKDSK'] },
        { id: 'hal3', baris: '490-700',
          teks: ['Halaman 3:', 'DISKCOPY, COPY, COMP'] },
        { id: 'hal4', baris: '710-930',
          teks: ['Halaman 4:', 'DATE, MODE, SYS, TIME'] },
        { id: 'hal5', baris: '940-1160',
          teks: ['Halaman 5:', 'batch, DIR, ERASE, TYPE'] },
        { id: 'tunggu', baris: '1190-1210', jenis: 'subrutin',
          teks: ['Nyalakan F1,', 'tunggu satu tombol'] },
        { id: 'f1', baris: '1300-1310', jenis: 'putusan',
          teks: ['F1: BACKFLAG=1,', 'RETURN 1310 - keluar lebih awal'] },
        { id: 'f10', baris: '1220-1290', jenis: 'subrutin',
          teks: ['F10: simpan kursor,', 'tanya Y/N, pulihkan'] },
        { id: 'keluar', baris: '1170-1180', jenis: 'keluar',
          teks: ['RUN "intro"'] }
      ],
      panah: [
        { dari: 'pasang', ke: 'hal1' },
        { dari: 'hal1', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'f1', label: 'F1 ditekan' },
        { dari: 'f1', ke: 'hal1', label: 'BACKFLAG: mundur satu halaman' },
        { dari: 'hal1', ke: 'hal2' },
        { dari: 'hal2', ke: 'hal3' },
        { dari: 'hal3', ke: 'hal4' },
        { dari: 'hal4', ke: 'hal5' },
        { dari: 'hal5', ke: 'keluar' },
        { dari: 'tunggu', ke: 'f10', label: 'F10 ditekan' },
        { dari: 'f10', ke: 'keluar', label: 'Y' }
      ]
    },

    pseudokode: [
      { baris: 20, tingkat: 0, teks: 'F10 &rarr; 1220 (keluar), F1 &rarr; 1300 (halaman sebelumnya)' },
      { baris: 60, tingkat: 0, teks: 'tiap halaman: bingkai, judul, isi, lalu <code>GOSUB 1190</code>' },
      { baris: 1190, tingkat: 1, teks: '<code>KEY(1) ON</code> &mdash; F1 <b>hanya berarti saat menunggu</b>' },
      { baris: 1210, tingkat: 1, teks: 'tunggu satu tombol, lalu <code>RETURN</code>' },
      { baris: 1300, tingkat: 1, teks: 'F1: <code>BACKFLAG=1 : RETURN 1310</code> &mdash; <b>buang alamat pulang jebakan</b>' },
      { baris: 1310, tingkat: 2, teks: '&hellip;dan <code>RETURN</code> di sini pulang dari <code>GOSUB 1190</code>' },
      { baris: 480, tingkat: 1, teks: '<code>IF BACKFLAG THEN 60</code> &mdash; mundur ke halaman sebelumnya' },
      { baris: 1220, tingkat: 0, teks: 'F10: simpan kursor dengan <code>CSRLIN</code>/<code>POS(0)</code>, tanya Y/N' },
      { baris: 1260, tingkat: 1, teks: 'jawaban N <b>jatuh ke bawah</b> ke subrutin bilah, lalu pulih' }
    ],

    perintahAsli: 'run\\HINTS.bat',
    catatanAsli: 'Lima halaman bantuan perintah DOS 1.x. Tombol apa saja maju ' +
      'satu halaman, F1 mundur, F10 keluar.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 1200), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris yang sama.',

      '<b>Berakhir dengan <code>RUN"intro</code></b>, dan penangkap galat di ' +
      'baris 1320 dengan <code>RUN "menu</code> &mdash; keduanya tanpa tanda ' +
      'kutip penutup.'
    ],

    pelajaran: {
      ringkas: 'Pembaca dokumen lima halaman, dan sebuah <code>RETURN ' +
        '&lt;baris&gt;</code> yang membatalkan penungguan dari dalam jebakan ' +
        'tombol.',
      pelajari: [
        ['RETURN ke tempat lain',
         'Baris 1300: <code>KEY(1) OFF:BACKFLAG=1:RETURN 1310</code>. ' +
         '<code>RETURN</code> polos pulang ke pemanggilnya; ' +
         '<code>RETURN &lt;baris&gt;</code> <b>membuang</b> alamat pulang itu ' +
         'dan melanjutkan di tempat lain. Di sini alamat yang dibuang adalah ' +
         'milik jebakan F1, dan baris 1310 &mdash; sebuah <code>RETURN</code> ' +
         'polos &mdash; yang akhirnya pulang dari <code>GOSUB 1190</code>. ' +
         'Hasilnya: <b>menekan F1 membuat subrutin penunggu keluar lebih ' +
         'awal</b>, dengan sebuah bendera terpasang. Cara membatalkan ' +
         'pekerjaan yang sedang menunggu, di bahasa tanpa <code>break</code> ' +
         'maupun pengecualian.'],
        ['Tombol yang cuma berarti di tempat tertentu',
         '<code>ON KEY(1) GOSUB 1300</code> dipasang sekali di baris 30, tapi ' +
         '<code>KEY(1) ON</code> baru dinyalakan di baris 1190 &mdash; setiap ' +
         'kali program mulai menunggu tombol. Di luar penungguan itu, F1 ' +
         'tidak berarti apa-apa. <b>Pemasangan dan penyalaan dipisah</b>, dan ' +
         'yang kedua itulah yang menentukan konteksnya.'],
        ['Menyimpan kursor sebelum menimpanya',
         'Baris 1220 memanggil <code>CSRLIN</code> dan <code>POS(0)</code> ' +
         'untuk mencatat posisi kursor, lalu bilah pertanyaan menimpa baris ' +
         '25. Baris 1280 mengembalikannya dengan ' +
         '<code>LOCATE XLIN,XPOS,0</code>. Kalau jawabannya "N", pemakai ' +
         'kembali ke halaman yang persis sama seperti sebelumnya.'],
        ['Satu subrutin, dua jalan masuk',
         'Baris 1270&ndash;1290 menggambar bilah bawah dan dipanggil tiap ' +
         'halaman lewat <code>GOSUB 1270</code>. Tapi baris 1260 juga ' +
         '<b>jatuh ke bawah</b> ke sana &mdash; jawaban "N" pada pertanyaan ' +
         'keluar meneruskan langsung ke penggambar bilah, lalu ' +
         '<code>RETURN</code> di 1290 pulang dari jebakan F10. Satu subrutin ' +
         'yang dipakai sebagai subrutin <i>dan</i> sebagai lanjutan.']
      ],
      hindari: [
        ['Lima salinan bingkai yang sama',
         'Baris 70&ndash;100, 280&ndash;310, 500&ndash;530, 710&ndash;740, ' +
         '950&ndash;980 menggambar bingkai dan judul yang <b>identik</b>. ' +
         'Empat puluh baris untuk sesuatu yang cukup satu subrutin. Dan ' +
         'halaman 4 malah menggabungkan baris atasnya ke baris 710 &mdash; ' +
         'jadi kelimanya tidak persis sama bentuknya, cuma sama hasilnya.'],
        ['Tanda kutip yang tidak pernah ditutup',
         'Baris 110, 120, 130, 320, 550, 560, 580, 590, 750, 1180, 1250, ' +
         'dan 1320 semuanya berakhir tanpa kutip penutup. GW-BASIC ' +
         'menerimanya, dan di berkas ini itu jelas <b>kebiasaan</b>, bukan ' +
         'kecelakaan. Bentuk yang sama ada di BUSSIX.BAS dan BUSTEN.BAS.'],
        ['Salah eja di dokumen bantuan',
         '<code>orginal</code> (baris 590), <code>extention</code> (1030, ' +
         '1060, 1110), <code>sequentually</code> yang dipenggal jadi ' +
         '"sequen-tually" (620&ndash;630). Ini <b>dokumentasi</b> &mdash; ' +
         'satu-satunya bagian program yang gunanya memang dibaca.'],
        ['Nomor halaman yang ditulis di dua tempat',
         'Baris 480, 700, 930, dan 1160 masing-masing menyebut nomor baris ' +
         'halaman sebelumnya (<code>60</code>, <code>270</code>, ' +
         '<code>490</code>, <code>710</code>). Menyisipkan satu halaman baru ' +
         'berarti mengubah dua tempat sekaligus, dan tidak ada apa pun yang ' +
         'akan memberi tahu kalau salah satunya terlewat.']
      ]
    },

    penjelasan: [
      { judul: 'RETURN yang tidak pulang ke tempatnya',
        isi: [
          'Program ini punya masalah yang kelihatan sederhana: pemakai sedang ' +
          'menunggu di dalam subrutin (<code>GOSUB 1190</code>, menunggu ' +
          'tombol di baris 1210), dan menekan F1 harus membuat <b>seluruh ' +
          'penungguan itu batal</b> lalu kembali ke halaman sebelumnya.',
          'Di bahasa modern itu sebuah <code>break</code>, atau sebuah ' +
          'pengecualian, atau sinyal batal. BASIC 1982 tidak punya satu pun.',
          'Yang dipunyainya: <code>RETURN &lt;nomor baris&gt;</code>.',
          'Beginilah jalannya. Baris 250 memanggil <code>GOSUB 1190</code>, ' +
          'dan alamat pulangnya (baris 260) masuk tumpukan. Subrutin itu ' +
          'berhenti menunggu di baris 1210. Waktu F1 ditekan, GW-BASIC ' +
          'menyela dan memanggil <code>GOSUB 1300</code> &mdash; alamat ' +
          'pulang <b>kedua</b> masuk tumpukan.',
          'Baris 1300 lalu menulis <code>RETURN 1310</code>. Itu membuang ' +
          'alamat pulang jebakan dan melanjutkan di baris 1310. Dan baris ' +
          '1310 isinya cuma <code>RETURN</code> &mdash; yang sekarang memakai ' +
          'alamat pulang yang <b>pertama</b>, milik <code>GOSUB 1190</code>.',
          'Hasilnya: penungguan di baris 1210 tidak pernah selesai, tapi ' +
          'programnya melanjutkan seolah-olah selesai &mdash; di baris 260, ' +
          'dengan <code>BACKFLAG</code> menyala.',
          'Dua baris, dan sebuah pembatalan yang bersih. Perhatikan juga apa ' +
          'yang <b>tidak</b> terjadi: tumpukannya tidak bocor, dan tidak ada ' +
          'jejak yang tertinggal. Trik yang sama dipakai BIO.BAS baris 1680 ' +
          'untuk membatalkan penggambaran grafik yang sedang berjalan.'
        ] },
      { judul: 'Dokumen yang harus berupa program',
        isi: [
          'Lima halaman teks tentang perintah DOS. Pada 1982 tidak ada cara ' +
          'lain menyampaikannya di layar selain <b>menulis program yang ' +
          'mencetaknya</b>.',
          'Tidak ada penampil teks. Tidak ada <code>more</code> yang bisa ' +
          'diandalkan ada. Tidak ada format dokumen. Yang ada BASIC, dan ' +
          'sebuah disket.',
          'Jadi seratus tiga puluh dua baris ini pada dasarnya sebuah ' +
          '<i>pager</i>: ia menggambar bingkai, mencetak halaman, menunggu ' +
          'tombol, dan menyediakan cara mundur. Persis pekerjaan yang ' +
          'sekarang dikerjakan <code>less</code>, penampil PDF, atau sebuah ' +
          'halaman web.',
          'Yang membuatnya menarik: karena dokumennya <b>adalah</b> ' +
          'programnya, keduanya tidak bisa tidak sinkron. Tidak ada berkas ' +
          'bantuan yang bisa hilang, tidak ada versi yang bisa ketinggalan. ' +
          'Dan harganya juga langsung terlihat &mdash; mengubah satu kalimat ' +
          'berarti menyunting kode, dan menyisipkan satu halaman berarti ' +
          'mengubah nomor baris di dua tempat.'
        ] }
    ]
  };
})(window);
