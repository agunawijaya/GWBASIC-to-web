/* ===========================================================================
   FLYS.js — porting minimalis FLYS.BAS sebagai tabel baris.

       10 '*****************
       20 '**     FLY     **
       30 '*****************

   Tidak ada nama penulis, tidak ada tahun. Seekor lalat berdengung di salah
   satu dari tiga tempat, tiga pemukul jatuh menutupinya, dan pemainnya harus
   ingat yang mana.

   YANG PALING LAYAK DILIHAT: DRAW MEMBACA VARIABEL DARI DALAM STRINGNYA.

       400 DRAW "c=clr; bm0,=y; m+25,25 m+25,0 m+25,-25"
       980 DRAW "c=clr; m+=dx;,=dy;"

   Bentuk `=NAMA;` di dalam string DRAW berarti "ambil nilai variabel BASIC
   bernama NAMA". Bukan penyulihan saat stringnya dirangkai — string yang sama
   dipakai berkali-kali di dalam gelung, dan tiap kali ia membaca nilai yang
   berlaku SAAT ITU.

   Baris 400 memakainya untuk warna dan untuk posisi; baris 980 untuk arah
   langkah. Tiga hal yang berbeda, satu mekanisme, dan semuanya di dalam
   sebuah string.

   YANG KEDUA: LALATNYA DIHAPUS DENGAN SEPETAK LAYAR KOSONG.

       270 GET (131,91)-(152,103),FLY0
       280 GET (151,91)-(172,103),FLY1
       290 GET (151,105)-(172,117),FLY2

   Dua gambar lalat, tiga GET. Yang ketiga — FLY0 — dipungut dari petak di
   SEBELAH KIRI lalatnya. Diukur di penelusur: isinya NOL piksel bergambar
   dari 286, sementara kedua lalatnya masing-masing 50. Ia bukan gambar lalat;
   ia gambar KETIADAAN lalat, dan `PUT ...,FLY0,PSET` di baris 630 memakainya
   untuk menghapus.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` dan `SOUND` diam. Yang hilang cukup banyak di sini: dengung lalat
     (baris 550-560), bunyi pemukul, dan amplop nada berbentuk sinus pangkat
     tiga di baris 910.
   - `RANDOMIZE VAL(MID$(TIME$,4,2)+RIGHT$(TIME$,2))` diganti benih tetap.
   - `CHAIN "MENU"` (baris 9000) tidak bisa dijalankan.
   - Ukuran larik penampung GET (`FLY0(21)`, `SWAT(714)`) tidak diperiksa
     penelusur — di mesin aslinya ia menentukan hidup-matinya program. Lihat
     catatan.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }

  /* --- 10-160: siapkan ----------------------------------------------------- */
  [10, 20, 30, 40].forEach(rem);
  T({ baris: 50, jalan: function () { /* CLEAR */ } });
  /* 52 F10 dijemput jebakan ke baris 9000, yang meninggalkan program sama
     sekali. Satu-satunya jalan keluar yang disediakan sejak baris kelima. */
  T({ baris: 52, jalan: function (m) {
      m.pasangJebakan(10, 9000); m.jebakan(10, true);
    } });
  T({ baris: 60, jalan: function (m) { m.gosub(1730); } });
  T({ baris: 70, jalan: function (m) { m.layar(1); } });
  T({ baris: 80, jalan: function () { /* KEY OFF */ } });
  T({ baris: 90, jalan: function (m) { m.cls(); } });
  T({ baris: 100, jalan: function (m) { m.warna(0, 1); } });
  T({ baris: 110, jalan: function () { /* OPTION BASE 1 */ } });
  /* 120 `DEFINT X,Y` — dan itu yang membuat larik penampung GET di baris
     130-140 TIDAK ikut jadi bulat. Lihat catatan tentang ukurannya. */
  T({ baris: 120, jalan: function () { /* DEFINT X,Y */ } });
  T({ baris: 130, jalan: function (m) {
      m.dim('FLY0()', 21); m.dim('FLY1()', 21); m.dim('FLY2()', 21);
    } });
  T({ baris: 140, jalan: function (m) { m.dim('SWAT()', 714); } });
  /* 150 `X(3)` dan `Y(3)` di-DIM dan tidak pernah dipakai lagi di 180 baris
     sesudahnya. Sisa dari rancangan yang tidak jadi. */
  T({ baris: 150, jalan: function (m) { m.dim('X()', 3); m.dim('Y()', 3); } });
  /* 160 DELAY adalah SATU-SATUNYA ukuran kesulitan, dan sekaligus satu-satunya
     ukuran nilai: baris 1490 menghitung skor dari selisihnya terhadap 3000. */
  T({ baris: 160, jalan: function (m) { m.v.DELAY = 3000; } });
  rem(170);

  /* --- 180-290: membangun lalat ------------------------------------------- */
  rem(180);
  /* 190-230 lalatnya dipecah jadi lima potongan bernama, lalu dirangkai jadi
     dua gambar berbeda dengan menukar sepasang sayapnya. Badan yang sama
     dipakai dua kali; yang berubah cuma sayapnya. */
  T({ baris: 190, jalan: function (m) {
      m.v['BODY$'] = 'c1u5be1d6r1u6bf1d5';
    } });
  T({ baris: 200, jalan: function (m) {
      m.v['URWING$'] = 'c3bu3br1e3r1g3r1e3';
    } });
  T({ baris: 210, jalan: function (m) {
      m.v['ULWING$'] = 'bg3bl7h3l1f3l1h3';
    } });
  T({ baris: 220, jalan: function (m) {
      m.v['DRWING$'] = 'c3br6h3l1f3l1h3';
    } });
  T({ baris: 230, jalan: function (m) {
      m.v['DLWING$'] = 'bl5g3l1e3l1g3';
    } });
  T({ baris: 240, jalan: function (m) {
      m.gambar(m.v['BODY$'] + m.v['URWING$'] + m.v['ULWING$']);
    } });
  T({ baris: 250, jalan: function (m) { m.gambar('bd20br6'); } });
  T({ baris: 260, jalan: function (m) {
      m.gambar(m.v['BODY$'] + m.v['DRWING$'] + m.v['DLWING$']);
    } });
  /* 270 PETAK PENGHAPUS: diambil dari sebelah kiri lalat, bukan dari lalatnya.
     Isinya hampir seluruhnya kosong, dan itulah gunanya. */
  T({ baris: 270, jalan: function (m) {
      m.v['FLY0()'] = m.ambil(131, 91, 152, 103);
    } });
  T({ baris: 280, jalan: function (m) {
      m.v['FLY1()'] = m.ambil(151, 91, 172, 103);
    } });
  T({ baris: 290, jalan: function (m) {
      m.v['FLY2()'] = m.ambil(151, 105, 172, 117);
    } });
  rem(300);

  /* --- 310-430: membangun pemukul ------------------------------------------
     Kotak padat, lalu 56 lubang dipotong dari dalamnya dengan LINE warna 0:
     jaring pemukul dibuat dengan MENGHAPUS, bukan menggambar. */
  rem(310);
  T({ baris: 320, jalan: function (m) { m.cls(); } });
  T({ baris: 330, jalan: function (m) { m.garis(0, 50, 75, 135, 3, 'BF'); } });
  T({ baris: 340, jalan: function (m) { m.untuk('X', 5, 65, 10, 380); } });
  T({ baris: 350, jalan: function (m) { m.untuk('Y', 55, 125, 10, 370); } });
  T({ baris: 360, jalan: function (m) {
      m.garis(m.v.X, m.v.Y, m.v.X + 5, m.v.Y + 5, 0, 'BF');
    } });
  T({ baris: 370, bagian: [
      function (m) { m.lanjutkan('Y'); },
      function (m) { m.lanjutkan('X'); }
    ] });
  /* 380-410 gagangnya: tiga puluh garis patah bertumpuk, lima yang teratas
     berwarna 3 dan sisanya warna 0. Yang warna 0 MENGHAPUS bagian bawah
     kotak, menyisakan bentuk lengkung di bawah jaringnya. */
  T({ baris: 380, jalan: function (m) { m.untuk('Y', 106, 135, 1, 420); } });
  T({ baris: 390, jalan: function (m) {
      m.v.CLR = m.v.Y < 111 ? 3 : 0;
    } });
  /* 400 `=clr;` dan `=y;` dibaca DRAW dari variabelnya sendiri, tiap putaran
     gelung. Stringnya tidak pernah berubah; nilainya yang berubah. */
  T({ baris: 400, jalan: function (m) {
      m.gambar('c=clr; bm0,=y; m+25,25 m+25,0 m+25,-25');
    } });
  T({ baris: 410, jalan: function (m) { m.lanjutkan('Y'); } });
  T({ baris: 420, jalan: function (m) { m.garis(30, 136, 45, 199, 1, 'BF'); } });
  T({ baris: 430, jalan: function (m) {
      m.v['SWAT()'] = m.ambil(0, 50, 75, 199);
    } });
  rem(440);

  /* --- 450-480: bingkai layar ---------------------------------------------- */
  rem(450);
  T({ baris: 460, jalan: function (m) { m.cls(); } });
  T({ baris: 470, jalan: function (m) { m.garis(0, 0, 319, 199, 2, 'BF'); } });
  T({ baris: 480, jalan: function (m) { m.garis(9, 9, 310, 190, 3, 'BF'); } });
  rem(490);

  /* --- 500-640: lalat berdengung ------------------------------------------- */
  rem(500);
  T({ baris: 510, jalan: function (m) { m.garis(15, 15, 304, 184, 0, 'BF'); } });
  /* 520 batas gelungnya sendiri acak: antara 7 dan 12 dengungan. Dinilai
     SEKALI, saat FOR dijalankan. */
  T({ baris: 520, jalan: function (m) {
      m.untuk('I', 1, 7 + 5 * m.acak(), 1, 650);
    } });
  T({ baris: 530, jalan: function (m) {
      m.v.FLY = Math.floor(3 * m.acak() + 1);
    } });
  T({ baris: 540, jalan: function (m) { m.v.BUZZ = 0; } });
  T({ baris: 550, jalan: function () { /* SOUND 47,0 */ } });
  T({ baris: 560, jalan: function () { /* SOUND 63+7*RND,999 */ } });
  /* 570 `WHILE+ BUZZ < DELAY` — dengan tanda TAMBAH nyasar sesudah WHILE,
     persis seperti 15PUZZLE.BAS baris 355. Dua program berbeda, kebiasaan
     yang sama. */
  T({ baris: 570, jalan: function (m) {
      if (!(m.v.BUZZ < m.v.DELAY)) m.lompat(620);
    } });
  T({ baris: 580, jalan: function (m) {
      m.taruh(74 * m.v.FLY, 67, m.v['FLY1()'], 'PSET');
    } });
  T({ baris: 590, jalan: function (m) {
      m.taruh(74 * m.v.FLY, 67, m.v['FLY2()'], 'PSET');
    } });
  /* 600 dengungnya dihitung dalam satuan 99. Angka itu tidak berarti apa-apa
     selain "cukup besar supaya gelungnya tidak kelamaan"; DELAY 3000 berarti
     tiga puluh kepakan sayap. */
  T({ baris: 600, jalan: function (m) { m.v.BUZZ = m.v.BUZZ + 99; } });
  T({ baris: 610, jalan: function (m) { m.lompat(570); } });
  T({ baris: 620, jalan: function () { /* SOUND 47,0 */ } });
  /* 630 petak kosong ditumpangkan di atas lalatnya. PSET, bukan XOR: yang
     ditaruh menimpa apa pun yang ada. */
  T({ baris: 630, jalan: function (m) {
      m.taruh(74 * m.v.FLY, 67, m.v['FLY0()'], 'PSET');
    } });
  T({ baris: 640, jalan: function (m) { m.lanjutkan('I'); } });
  rem(650);

  /* --- 660-700: tiga pemukul turun ----------------------------------------- */
  rem(660);
  T({ baris: 670, jalan: function (m) { m.untuk('SWIPE', 1, 3, 1, 710); } });
  T({ baris: 680, jalan: function () { /* SOUND 999,1 */ } });
  T({ baris: 690, jalan: function (m) {
      m.taruh(87 * m.v.SWIPE - 51, 35, m.v['SWAT()'], 'XOR');
    } });
  T({ baris: 700, jalan: function (m) { m.lanjutkan('SWIPE'); } });
  rem(710);

  /* --- 720-820: tebakan ---------------------------------------------------- */
  rem(720);
  /* 730-740 penyangga tombol dikosongkan lebih dulu: apa pun yang ditekan
     selama lalatnya berdengung tidak boleh terhitung sebagai jawaban. */
  T({ baris: 730, jalan: function (m) { m.v['K$'] = m.inkey(); } });
  T({ baris: 740, jalan: function (m) { if (m.v['K$'] !== '') m.lompat(730); } });
  T({ baris: 745, jalan: function (m) {
      m.locate(1, 12); m.cetak('Press ESC to end');
    } });
  T({ baris: 750, jalan: function (m) { m.locate(3, 7); } });
  /* 760 stringnya TIDAK DITUTUP di berkas aslinya. GW-BASIC menutupnya di
     ujung baris, dan hasilnya sama saja. */
  T({ baris: 760, jalan: function (m) {
      m.cetak('Check which swatter (1,2,3) ?'); m.barisBaru();
    } });
  T({ baris: 770, jalan: function (m) { m.v['K$'] = m.inkey(); } });
  T({ baris: 780, jalan: function (m) { if (m.v['K$'] === '') m.lompat(770); } });
  /* 785 ESC melompat ke 9000 — ke dalam badan penangan jebakan F10, bukan
     lewat GOSUB. Tidak jadi soal: baris 9000 CHAIN keluar dan tidak pernah
     kembali, jadi RETURN di 9010 memang tidak berguna bagi siapa pun. */
  T({ baris: 785, jalan: function (m) {
      if (m.v['K$'] === m.chr(27)) m.lompat(9000);
    } });
  T({ baris: 790, jalan: function (m) {
      if (m.v['K$'] !== '1' && m.v['K$'] !== '2' && m.v['K$'] !== '3') m.lompat(770);
    } });
  T({ baris: 800, jalan: function (m) { m.v.GUESS = parseInt(m.v['K$'], 10); } });
  T({ baris: 810, jalan: function (m) {
      m.garis(87 * m.v.GUESS - 51, 35, 87 * m.v.GUESS + 24, 184, 0, 'BF');
    } });
  T({ baris: 820, jalan: function (m) {
      if (m.v.GUESS !== m.v.FLY) m.lompat(1260);
    } });
  rem(830);

  /* --- 840-1000: kena ------------------------------------------------------ */
  rem(840);
  /* 850 DELAY dikalikan 0,7370001. Tiga angka nol dan sebuah satu di ujungnya
     — dan tidak ada satu pun baris yang menjelaskan kenapa bukan 0,737. */
  T({ baris: 850, jalan: function (m) {
      m.v.DELAY = 0.7370001 * m.v.DELAY;
    } });
  T({ baris: 860, jalan: function (m) { m.gosub(1490); } });
  T({ baris: 870, jalan: function (m) { m.locate(3, 7); } });
  T({ baris: 880, jalan: function (m) {
      m.cetak('GOT IT !!!'); m.tab(37);
    } });
  T({ baris: 890, jalan: function (m) { m.v.SPOT = 74 * m.v.GUESS + 9; } });
  T({ baris: 900, jalan: function (m) { m.untuk('I', 0, 40, 1, 1000); } });
  /* 910 amplop nadanya sinus PANGKAT TIGA. Pangkat tiganya yang penting: ia
     membuat lengkungnya datar di tengah dan tajam di ujung — bunyi "splat"
     yang naik cepat lalu meluruh pelan. */
  T({ baris: 910, jalan: function (m) {
      m.v.FREQ = 99 * Math.pow(Math.sin(2.1 - m.v.I / 17), 3) + 678;
    } });
  T({ baris: 920, jalan: function () { /* SOUND 99,0 */ } });
  T({ baris: 930, jalan: function () { /* SOUND FREQ,2 */ } });
  /* 940 tiap tiga langkah penanya dikembalikan ke titik lalatnya. Tanpa ini
     cipratannya akan mengembara pergi; dengan ini ia memancar dari satu
     tempat. */
  T({ baris: 940, jalan: function (m) {
      if (m.v.I % 3 === 0) m.gambar('bm=spot;,67');
    } });
  T({ baris: 950, jalan: function (m) { m.v.CLR = Math.floor(3 * m.acak() + 1); } });
  T({ baris: 960, jalan: function (m) { m.v.DX = Math.floor(9 * m.acak() - 4); } });
  T({ baris: 970, jalan: function (m) { m.v.DY = Math.floor(9 * m.acak() - 4); } });
  T({ baris: 980, jalan: function (m) { m.gambar('c=clr; m+=dx;,=dy;'); } });
  T({ baris: 990, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 1000, jalan: function (m) { m.garis(15, 15, 304, 184, 0, 'BF'); } });

  /* --- 1010-1230: pangkat -------------------------------------------------- */
  T({ baris: 1010, jalan: function (m) { if (m.v.RANK === 99) m.lompat(1620); } });
  T({ baris: 1020, jalan: function (m) { if (m.v.RANK !== 11) m.lompat(1100); } });
  rem(1030);
  rem(1040);
  T({ baris: 1050, jalan: function (m) { m.v.RANK = 1; } });
  T({ baris: 1060, jalan: function (m) { m.garis(15, 15, 304, 184, 0, 'BF'); } });
  T({ baris: 1070, jalan: function (m) { m.locate(12, 4); } });
  T({ baris: 1080, jalan: function (m) {
      m.cetak("YOU JUST MADE 'SENIOR DE-BUGGER'!!!"); m.barisBaru();
    } });
  T({ baris: 1090, jalan: function () { /* PLAY */ } });
  T({ baris: 1100, jalan: function (m) { if (m.v.RANK !== 12) m.lompat(1180); } });
  rem(1110);
  rem(1120);
  T({ baris: 1130, jalan: function (m) { m.v.RANK = 2; } });
  T({ baris: 1140, jalan: function (m) { m.garis(15, 15, 304, 184, 0, 'BF'); } });
  T({ baris: 1150, jalan: function (m) { m.locate(12, 4); } });
  T({ baris: 1160, jalan: function (m) {
      m.cetak('WOW! What a professional! Buzz on!');
    } });
  T({ baris: 1170, jalan: function () { /* PLAY */ } });
  T({ baris: 1180, jalan: function (m) { m.garis(15, 15, 304, 184, 0, 'BF'); } });
  T({ baris: 1190, jalan: function (m) { m.locate(12, 4); } });
  T({ baris: 1200, jalan: function (m) {
      m.cetak('Oh oh! Here comes a faster fly ...');
    } });
  T({ baris: 1210, jalan: function (m) { m.untuk('I', 1, 999, 1, 1230); } });
  T({ baris: 1220, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 1230, jalan: function (m) { m.lompat(510); } });
  rem(1240);

  /* --- 1250-1460: luput ----------------------------------------------------
     1,47 kali lebih lambat kalau luput, 0,737 kali lebih cepat kalau kena.
     Hasil kalinya 1,0834 — LEBIH DARI SATU. Satu kena dan satu luput
     meninggalkan pemainnya lebih lambat daripada saat mulai. Permainan yang
     diam-diam memaafkan. */
  rem(1250);
  T({ baris: 1260, jalan: function (m) { m.v.DELAY = 1.47 * m.v.DELAY; } });
  T({ baris: 1270, jalan: function (m) {
      if (m.v.DELAY > 3000) m.v.DELAY = 3000;
    } });
  T({ baris: 1280, jalan: function (m) { m.gosub(1490); } });
  T({ baris: 1290, jalan: function (m) {
      m.garis(87 * m.v.FLY - 51, 35, 87 * m.v.FLY + 24, 184, 0, 'BF');
    } });
  T({ baris: 1300, jalan: function (m) { m.locate(3, 7); } });
  T({ baris: 1310, jalan: function (m) {
      m.cetak('Whoops, it got away.'); m.tab(37);
    } });
  T({ baris: 1320, jalan: function () { /* SOUND 57,47 */ } });
  T({ baris: 1330, jalan: function (m) { m.untuk('I', 1, 100, 1, 1370); } });
  T({ baris: 1340, jalan: function (m) {
      m.taruh(74 * m.v.FLY, 67, m.v['FLY1()'], 'PSET');
    } });
  T({ baris: 1350, jalan: function (m) {
      m.taruh(74 * m.v.FLY, 67, m.v['FLY2()'], 'PSET');
    } });
  T({ baris: 1360, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 1370, jalan: function (m) { m.garis(15, 15, 304, 184, 0, 'BF'); } });
  T({ baris: 1380, jalan: function (m) { m.locate(12, 7); } });
  T({ baris: 1390, jalan: function (m) {
      if (m.v.DELAY === 3000) m.v['MISS$'] = 'Here comes another one ...';
    } });
  T({ baris: 1400, jalan: function (m) {
      if (m.v.DELAY < 3000) m.v['MISS$'] = 'Here comes a slower fly ...';
    } });
  T({ baris: 1410, jalan: function (m) { m.cetak(m.v['MISS$'] || ''); } });
  /* 1420-1430 pangkat DITURUNKAN lagi kalau kecepatannya jatuh — jadi pujian
     yang sama bisa muncul dua kali dalam satu permainan. */
  T({ baris: 1420, jalan: function (m) { if (m.v.SPEED < 9000) m.v.RANK = 1; } });
  T({ baris: 1430, jalan: function (m) { if (m.v.SPEED < 8000) m.v.RANK = 0; } });
  T({ baris: 1440, jalan: function (m) { m.untuk('I', 1, 999, 1, 1460); } });
  T({ baris: 1450, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 1460, jalan: function (m) { m.lompat(510); } });
  rem(1470);

  /* --- 1480-1590: skor dan pangkat -----------------------------------------
     RANK memakai DUA sistem angka di satu variabel: 0/1/2 berarti "pangkat
     yang sudah diumumkan", 11/12/99 berarti "baru saja naik, umumkan". Baris
     1020 dan 1100 memeriksa yang kedua lalu menggantinya dengan yang pertama.
     Bendera sekali-pakai, disimpan di dalam nilainya sendiri. */
  rem(1480);
  T({ baris: 1490, jalan: function (m) {
      m.v.SPEED = (3000 - m.v.DELAY) * 10 / 3;
    } });
  T({ baris: 1500, jalan: function (m) { if (m.v.SPEED < 0) m.v.SPEED = 0; } });
  T({ baris: 1510, jalan: function (m) { m.locate(25, 5); } });
  T({ baris: 1520, jalan: function (m) {
      m.cetakFormat('SPEED = ####', m.v.SPEED);
    } });
  T({ baris: 1530, jalan: function (m) {
      if (m.v.SPEED > (m.v.RECORD || 0)) m.v.RECORD = m.v.SPEED;
    } });
  T({ baris: 1540, jalan: function (m) { m.locate(25, 22); } });
  T({ baris: 1550, jalan: function (m) {
      m.cetakFormat('RECORD = ####', m.v.RECORD || 0);
    } });
  T({ baris: 1560, jalan: function (m) {
      if (m.v.SPEED > 8000 && (m.v.RANK || 0) < 1) m.v.RANK = 11;
    } });
  T({ baris: 1570, jalan: function (m) {
      if (m.v.SPEED > 9000 && (m.v.RANK || 0) < 2) m.v.RANK = 12;
    } });
  T({ baris: 1580, jalan: function (m) { if (m.v.SPEED > 9999) m.v.RANK = 99; } });
  T({ baris: 1590, jalan: function (m) { m.kembali(); } });
  rem(1600);

  /* --- 1610-1700: menang, dan tidak pernah berhenti menang ------------------ */
  rem(1610);
  T({ baris: 1620, jalan: function (m) { m.locate(10, 5); } });
  T({ baris: 1630, jalan: function (m) {
      m.cetak('YOU DID IT!!! NO BUGS LEFT!!!'); m.barisBaru();
    } });
  T({ baris: 1640, jalan: function (m) { m.locate(12, 5); } });
  T({ baris: 1650, jalan: function (m) {
      m.cetak('Welcome to the S.W.A.T. team !'); m.barisBaru();
    } });
  T({ baris: 1660, jalan: function () { /* PLAY */ } });
  T({ baris: 1670, jalan: function (m) { m.v.BGD = Math.floor(m.acak() * 6); } });
  T({ baris: 1680, jalan: function (m) { m.v.PLT = Math.floor(m.acak() * 2); } });
  T({ baris: 1690, jalan: function (m) { m.warna(m.v.BGD, m.v.PLT); } });
  /* 1700 dan itu SELURUH akhirnya. Tidak ada tombol, tidak ada END, tidak ada
     jalan keluar selain F10. Program yang menang dan tidak pernah berhenti
     merayakannya. */
  T({ baris: 1700, jalan: function (m) { m.lompat(1660); } });
  rem(1710);

  /* --- 1720-1740: benih ---------------------------------------------------- */
  rem(1720);
  T({ baris: 1730, jalan: function () { /* RANDOMIZE dari jam */ } });
  T({ baris: 1740, jalan: function (m) { m.kembali(); } });

  /* --- 9000-9999: keluar ---------------------------------------------------- */
  T({ baris: 9000, jalan: function (m) { m.rantai('MENU'); } });
  T({ baris: 9010, jalan: function (m) { m.kembali(); } });
  T({ baris: 9999, jalan: function (m) { m.henti('END di baris 9999.'); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['FLYS'] = {
    nama: 'FLYS',
    judul: 'Fly (penulis tidak disebut)',
    sumber: 'FLYS',
    berkas: 'run/FLYS.BAS',
    tabel: tabel,
    benih: 47,

    arsitektur: {
      judul: 'Alur FLYS.BAS',
      simpul: [
        { id: 'bangun', baris: '190-290', jenis: 'mulai',
          teks: ['Lalat dirangkai dari lima', 'potongan DRAW bernama;', 'petak kosong jadi penghapus'] },
        { id: 'pemukul', baris: '320-430',
          teks: ['Kotak padat, lalu 56 lubang', 'DIHAPUS untuk jadi jaring'] },
        { id: 'dengung', baris: '510-640',
          teks: ['7-12 kali: lalat muncul', 'di salah satu dari tiga tempat'] },
        { id: 'tutup', baris: '670-700',
          teks: ['Tiga pemukul jatuh menutupi', 'ketiga tempatnya'] },
        { id: 'tebak', baris: '730-820', jenis: 'putusan',
          teks: ['Yang mana tadi?'] },
        { id: 'kena', baris: '850-1000',
          teks: ['DELAY x0,737 — lebih cepat.', 'Cipratan digambar DRAW acak'] },
        { id: 'luput', baris: '1260-1460',
          teks: ['DELAY x1,47 — lebih lambat.', 'Lalatnya mengepak mengejek'] },
        { id: 'skor', baris: '1490-1590',
          teks: ['SPEED dari DELAY;', 'RANK memakai dua sistem angka'] },
        { id: 'menang', baris: '1620-1700', jenis: 'keluar',
          teks: ['SPEED>9999: merayakan', 'SELAMANYA'] }
      ],
      panah: [
        { dari: 'bangun', ke: 'pemukul' },
        { dari: 'pemukul', ke: 'dengung' },
        { dari: 'dengung', ke: 'tutup' },
        { dari: 'tutup', ke: 'tebak' },
        { dari: 'tebak', ke: 'kena', label: 'benar' },
        { dari: 'tebak', ke: 'luput', label: 'salah' },
        { dari: 'kena', ke: 'skor' },
        { dari: 'luput', ke: 'skor' },
        { dari: 'skor', ke: 'dengung', label: 'lagi' },
        { dari: 'skor', ke: 'menang', label: 'RANK=99' }
      ]
    },

    pseudokode: [
      { baris: 400, tingkat: 0, teks: '<code>=NAMA;</code> di dalam DRAW membaca <b>variabel BASIC</b>, saat itu juga' },
      { baris: 980, tingkat: 1, teks: '&hellip;string yang sama, nilai berbeda tiap putaran gelung' },
      { baris: 270, tingkat: 0, teks: 'petak <b>kosong</b> dipungut jadi sprite penghapus' },
      { baris: 360, tingkat: 0, teks: 'jaring pemukul dibuat dengan <b>menghapus</b> 56 lubang dari kotak padat' },
      { baris: 850, tingkat: 0, teks: 'kena: <code>DELAY&times;0,7370001</code> &mdash; dan angka aneh itu tak dijelaskan' },
      { baris: 1260, tingkat: 1, teks: 'luput: <code>&times;1,47</code>; hasil kali keduanya <b>1,0834</b> &mdash; memaafkan' },
      { baris: 1560, tingkat: 0, teks: '<code>RANK</code> memakai dua sistem angka: 0/1/2 dan 11/12/99' },
      { baris: 910, tingkat: 0, teks: 'nada cipratan: <b>sinus pangkat tiga</b> &mdash; datar di tengah, tajam di ujung' },
      { baris: 1700, tingkat: 0, teks: 'menang &rarr; <code>GOTO 1660</code> &rarr; <b>tidak pernah berhenti</b>' },
      { baris: 570, tingkat: 0, teks: '<code>WHILE+</code> &mdash; plus nyasar yang sama dengan 15PUZZLE baris 355' }
    ],

    perintahAsli: 'run\\FLYS.bat',
    catatanAsli: 'Lalatnya berdengung di salah satu dari tiga tempat, lalu ' +
      'tiga pemukul menutupi ketiganya. Tekan 1, 2, atau 3. Setiap tebakan ' +
      'yang benar mempercepat lalat berikutnya. ESC atau F10 keluar.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam</b>, dan yang hilang ' +
      'lebih banyak daripada biasanya: dengung lalat, bunyi pemukul jatuh, ' +
      'dan amplop nada berbentuk sinus pangkat tiga di baris 910.',

      '<b><code>RANDOMIZE VAL(MID$(TIME$,4,2)+RIGHT$(TIME$,2))</code> diganti ' +
      'benih tetap</b> &mdash; menit dan detik jam disambung jadi satu ' +
      'bilangan, cara membuat benih yang berubah tiap detik.',

      '<b><code>CHAIN "MENU"</code> di baris 9000 tidak bisa dijalankan.</b> ' +
      'Ia satu-satunya jalan keluar yang disediakan program ini.',

      '<b>Tidak ada satu pun koordinat mutlak di baris 240-260.</b> Lalatnya ' +
      'digambar dari <i>titik acuan terakhir</i>, dan sesudah ' +
      '<code>SCREEN 1</code> titik itu adalah TENGAH LAYAR &mdash; (160,100). ' +
      'Angka-angka <code>GET</code> di baris 270-290 hanya masuk akal dengan ' +
      'aturan itu, dan permukaan grafik penelusur harus diperbaiki untuk ' +
      'menirunya.',

      '<b>Ukuran larik penampung <code>GET</code> tidak diperiksa penelusur.</b> ' +
      'Di mesin aslinya ia menentukan hidup-matinya program &mdash; lihat ' +
      'catatan tentang <code>SWAT(714)</code>.'
    ],

    pelajaran: {
      ringkas: 'String DRAW yang membaca variabel BASIC dari dalam dirinya ' +
        'sendiri, dan sepetak layar kosong yang dipungut jadi penghapus.',
      pelajari: [
        ['Gambar yang dirangkai dari potongan bernama',
         'Baris 190-230 memberi nama pada lima potongan gambar: badan, sayap ' +
         'kanan atas, sayap kiri atas, sayap kanan bawah, sayap kiri bawah.',
         'Lalu baris 240 dan 260 merangkainya jadi dua lalat berbeda dengan ' +
         'menukar sepasang sayapnya:',
         '<code>240 DRAW BODY$+URWING$+ULWING$</code>',
         '<code>260 DRAW BODY$+DRWING$+DLWING$</code>',
         'Badannya digambar dua kali dan hanya ditulis sekali. Bahasa DRAW ' +
         'berupa string biasa, jadi penyambungan string adalah penyusunan ' +
         'gambar &mdash; dan itu berlaku tanpa satu pun perintah tambahan.'],
        ['Menghapus untuk menggambar',
         'Pemukulnya dibuat terbalik. Baris 330 menggambar kotak padat 76' +
         '&times;86, lalu baris 340-370 memotong 56 lubang dari dalamnya ' +
         'dengan <code>LINE ...,0,BF</code>.',
         'Jaring dibuat dari lubang-lubangnya, bukan dari benangnya. Dua ' +
         'gelung bersarang, satu perintah.',
         'Dan baris 380-410 melakukannya lagi untuk lengkung bawahnya: tiga ' +
         'puluh garis patah, lima yang teratas berwarna 3 dan sisanya ' +
         'berwarna 0 &mdash; yang berwarna 0 mengunyah bagian bawah kotak ' +
         'sampai bentuknya benar.'],
        ['Petak kosong sebagai sprite penghapus',
         'Tiga <code>GET</code> di baris 270-290, padahal cuma dua lalat yang ' +
         'digambar. Yang ketiga &mdash; <code>FLY0</code> &mdash; dipungut ' +
         'dari petak di sebelah kiri lalatnya.',
         'Isinya hampir seluruhnya kosong, dan itu justru gunanya. ' +
         '<code>PUT ...,FLY0,PSET</code> di baris 630 menimpakan kekosongan ' +
         'itu ke atas lalat, dan lalatnya hilang.',
         'Dihitung di penelusur: <code>FLY1</code> dan <code>FLY2</code> ' +
         'masing-masing berisi 50 piksel bergambar dari 286, sedangkan ' +
         '<code>FLY0</code> berisi <b>nol dari 286</b>. Ia benar-benar ' +
         'kosong &mdash; sepetak layar hitam yang dijadikan alat.',
         'Alternatifnya <code>LINE ...,0,BF</code>. Ini bukan lebih cepat dan ' +
         'bukan lebih pendek &mdash; tapi ia memakai jalur kode yang persis ' +
         'sama dengan menggambar, jadi tidak ada kemungkinan ukuran ' +
         'penghapusnya melenceng dari ukuran yang digambar.'],
        ['Bendera sekali-pakai di dalam nilainya sendiri',
         '<code>RANK</code> bernilai 0, 1, atau 2 &mdash; pangkat yang sudah ' +
         'diumumkan. Tapi baris 1560-1580 mengisinya dengan 11, 12, atau 99.',
         'Angka-angka itu berarti "baru saja naik, dan belum diumumkan". ' +
         'Baris 1020 dan 1100 memeriksanya, mencetak selamatnya, lalu ' +
         'menggantinya dengan 1 atau 2.',
         'Satu variabel membawa dua hal: tingkat, dan kejadian sekali-pakai. ' +
         'Yang membuatnya bekerja bukan kepintaran melainkan pemilihan angka ' +
         '&mdash; 11 dan 1 sengaja dibuat berbeda cukup jauh sehingga ' +
         'perbandingan <code>&lt;</code> di baris 1560 tetap masuk akal untuk ' +
         'keduanya.']
      ],
      hindari: [
        ['Ukuran larik yang benar karena tipenya kebetulan tepat',
         '<code>140 DIM SWAT(714)</code>, dan baris 430 memungut petak ' +
         '76&times;150 piksel ke dalamnya.',
         'Di SCREEN 1 satu piksel dua bit, jadi satu baris 76 piksel butuh 19 ' +
         'bita; 150 baris ditambah 4 bita kepala = <b>2854 bita</b>.',
         'Larik 715 unsur menampung 2854 bita hanya kalau tiap unsurnya EMPAT ' +
         'bita &mdash; presisi tunggal. Kalau <code>SWAT</code> bertipe ' +
         'bulat, ia cuma 1430 bita dan <code>GET</code> gagal.',
         'Yang menjaganya: baris 120 menulis <code>DEFINT X,Y</code> ' +
         '&mdash; hanya X dan Y. Kalau baris itu berbunyi ' +
         '<code>DEFINT A-Z</code>, seperti belasan program lain di koleksi ' +
         'ini, program ini mati di baris 430.',
         'Larik penampung <code>GET</code> yang dihitung pas-pasan selalu ' +
         'begini: benar sampai seseorang mengubah sesuatu yang kelihatannya ' +
         'tidak berhubungan.'],
        ['Larik yang di-DIM lalu dilupakan',
         '<code>150 DIM X(3),Y(3)</code>. Keduanya tidak pernah muncul lagi ' +
         'di 180 baris sesudahnya.',
         'Yang membuatnya lebih dari sekadar sampah: nama X dan Y juga dipakai ' +
         'sebagai pencacah gelung biasa di baris 340-370 dan 380-410. Jadi ' +
         'pembaca yang menemukan <code>X</code> harus tahu lebih dulu apakah ' +
         'yang dimaksud larik atau skalar &mdash; dan jawabannya selalu ' +
         'skalar, karena lariknya tidak pernah dipakai.'],
        ['Akhir yang tidak berakhir',
         'Baris 1620-1700 adalah layar kemenangan. Ia mencetak dua kalimat, ' +
         'memainkan lagu, mengacak warna, lalu <code>GOTO 1660</code>.',
         'Tidak ada tombol yang dibaca. Tidak ada <code>END</code>. Satu-' +
         'satunya jalan keluar F10, yang dipasang di baris 52 dan tidak ' +
         'disebut lagi di layar mana pun sesudahnya.',
         'Pemain yang menang harus menekan tombol yang tidak pernah ' +
         'diberitahukan kepadanya, atau mematikan mesinnya.'],
        ['Dua angka yang tidak dijelaskan',
         '<code>850 DELAY=0.7370001*DELAY</code> dan ' +
         '<code>1260 DELAY=1.47*DELAY</code>.',
         'Angka pertama punya ekor: 0,737<b>0001</b>. Tidak ada satu pun ' +
         'komentar yang menyebutnya, dan bedanya dari 0,737 terlalu kecil ' +
         'untuk berpengaruh pada apa pun.',
         'Yang lebih besar akibatnya: hasil kali keduanya 1,0834 &mdash; ' +
         'lebih dari satu. Satu kena dan satu luput meninggalkan pemainnya ' +
         '<b>lebih lambat</b> daripada saat mulai. Permainan ini diam-diam ' +
         'memaafkan, dan tidak ada baris yang mengatakannya.']
      ]
    },

    penjelasan: [
      { judul: 'String yang membaca variabel',
        isi: [
          'Bahasa <code>DRAW</code> milik BASIC punya satu bentuk yang mudah ' +
          'terlewat:',
          '<code>400 DRAW "c=clr; bm0,=y; m+25,25 m+25,0 m+25,-25"</code>',
          'Bagian <code>=clr;</code> dan <code>=y;</code> bukan salah ketik. ' +
          'Bentuk <code>=NAMA;</code> berarti: <i>ambil nilai variabel BASIC ' +
          'bernama NAMA, sekarang.</i>',
          'Bedanya dengan menyambung string terlihat di baris 380-410:',
          '<code>380 FOR Y = 106 TO 135</code>',
          '<code>390 IF Y &lt; 111 THEN CLR=3 ELSE CLR=0</code>',
          '<code>400 DRAW "c=clr; bm0,=y; ..."</code>',
          '<code>410 NEXT Y</code>',
          'Stringnya <b>tidak pernah berubah</b> sepanjang tiga puluh ' +
          'putaran. Yang berubah <code>CLR</code> dan <code>Y</code>, dan ' +
          'string yang sama membacanya lagi tiap kali.',
          'Kalau harus disambung, baris 400 akan berbunyi ' +
          '<code>DRAW "c"+STR$(CLR)+"bm0,"+STR$(Y)+"..."</code> &mdash; lebih ' +
          'panjang, lebih mudah salah, dan merangkai string baru tiga puluh ' +
          'kali.',
          'Baris 980 memakainya untuk hal yang berbeda lagi:',
          '<code>980 DRAW "c=clr; m+=dx;,=dy;"</code>',
          'Di sini yang dibaca <b>arah langkah</b>. Tiga variabel acak yang ' +
          'diisi baris 950-970, dan satu string tetap yang menjelmakannya ' +
          'jadi coretan. Empat puluh putaran, empat puluh coretan berbeda, ' +
          'satu string.',
          'Dan baris 940 melengkapinya:',
          '<code>940 IF I MOD 3 = 0 THEN DRAW "bm=spot;,67"</code>',
          'Tiap tiga langkah, pena dikembalikan ke titik lalatnya. Tanpa ' +
          'baris ini cipratannya akan berjalan pergi seperti gerak Brown; ' +
          'dengan baris ini ia memancar dari satu titik &mdash; dan itulah ' +
          'bentuk yang benar untuk sesuatu yang baru saja ditepuk.'
        ] },
      { judul: 'Tujuh ratus lima belas kali empat',
        isi: [
          'Baris 140 dan 430:',
          '<code>140 DIM SWAT(714)</code>',
          '<code>430 GET (0,50)-(75,199),SWAT</code>',
          'Petak yang dipungut 76 piksel lebar, 150 piksel tinggi. Di SCREEN 1 ' +
          'tiap piksel dua bit, jadi satu baris butuh ' +
          '<code>76&times;2/8 = 19</code> bita. Seratus lima puluh baris ' +
          'ditambah empat bita kepala: <b>2854 bita</b>.',
          '<code>DIM SWAT(714)</code> memberi 715 unsur &mdash; karena BASIC ' +
          'menghitung dari nol.',
          '715 kali empat bita = <b>2860 bita</b>. Cukup, dengan sisa enam.',
          'Kali <b>dua</b> bita = 1430 bita. Tidak cukup, dan ' +
          '<code>GET</code> akan menolak.',
          'Jadi seluruh program ini bergantung pada <code>SWAT</code> bertipe ' +
          'presisi tunggal, bukan bulat. Dan yang menjaminnya satu baris di ' +
          'bagian atas:',
          '<code>120 DEFINT X,Y</code>',
          'Hanya X dan Y yang dijadikan bulat. Bukan A-Z, bukan A-S. Dua ' +
          'huruf, dipilih tepat karena keduanya pencacah gelung di baris ' +
          '340-370, dan tidak satu pun huruf lain ikut serta.',
          'Kalau baris 120 berbunyi <code>DEFINT A-Z</code> &mdash; yang ' +
          'ditulis belasan program lain di koleksi ini tanpa berpikir dua ' +
          'kali &mdash; <code>SWAT</code>, <code>FLY0</code>, ' +
          '<code>FLY1</code>, dan <code>FLY2</code> semuanya menyusut jadi ' +
          'separuh, dan program ini mati di baris 270 sebelum sempat ' +
          'menggambar apa pun.',
          'Yang membuatnya layak dicatat bukan bahwa penulisnya benar. Ia ' +
          'benar. Yang layak dicatat adalah bahwa kebenarannya dititipkan ' +
          'pada sebuah baris yang letaknya 310 baris dari tempat akibatnya, ' +
          'dan yang bunyinya tidak menyebut-nyebut ukuran, larik, atau ' +
          'gambar &mdash; cuma dua huruf.'
        ] }
    ]
  };
})(window);
