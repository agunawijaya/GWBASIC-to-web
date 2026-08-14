/* ===========================================================================
   BREAKOUT.js — porting minimalis BREAKOUT.BAS sebagai tabel baris.

       10 REM ibm pc spinout
       20 REM K.R. Sloan, Jr.
       30 REM 1 January 1982

   Satu Januari 1982 — lima bulan sesudah IBM PC dijual. Nama berkasnya
   BREAKOUT, tapi baris pertamanya menyebut nama yang lain, dan nama yang lain
   itu yang benar.

   YANG PALING PALING LAYAK DILIHAT: BOLANYA MELENGKUNG.

       760 VX=OVX-(SPIN*OVY*.05):VY=OVY+(SPIN*OVX*.05)+G
       761 SPIN=SPIN*.9999

   Dua perkalian, dan itu putaran vektor kecepatan sebesar sudut kecil yang
   sebanding dengan SPIN. Bolanya tidak bergerak lurus — ia MELENGKUNG,
   dan lengkungannya luruh perlahan (0,9999 tiap langkah).

   SPIN-nya datang dari cara bola mengenai pemukul:

       1240 MISS=(X-(PL+PR)/2)/(PL-PR)
       1260 SPIN=(SPIN*SKILL)+MISS*SKILL

   Kena di pinggir pemukul memberi putaran. Itu seluruh permainannya, dan
   itu sebabnya ia bernama Spinout, bukan Breakout.

   YANG KEDUA: BATA YANG HIDUP KEMBALI.

       1150 IF (RND(1)*2)>SKILL GOTO 1210
       1160 BX=INT(RND(1)*19.99):BY=INT(RND(1)*3.99):
       1170 IF BRICK[1+BX,1+BY]>0 GOTO 1210
       1180 BRICK[1+BX,1+BY]=-BRICK[1+BX,1+BY]
       1190 LINE (...),2+INT(BY/2),BF
       1200 SCORE=SCORE-BRICK[1+BX,1+BY]

   Tiap kali bola kena pemukul, ada peluang satu bata yang sudah hancur
   DIBANGUN LAGI dan nilainya dipotong dari skor. Itulah gunanya baris 960
   MENEGATIFKAN bata alih-alih menolkannya: tandanya menyimpan "pernah ada
   dan sudah hancur", jadi ia bisa dipulihkan lengkap dengan nilainya.

   Dan di baris 1160 itu juga ada cacatnya — lihat catatan.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` dan `SOUND` diam.
   - `RANDOMIZE(VAL(RIGHT$(TIME$,2)))` diganti benih tetap.
   - `PEEK(&H410)` disimpan ke `EQUIPMENT%` tapi tidak pernah dibaca lagi;
     penelusur mengisinya dengan nilai kartu warna yang masuk akal.
   - `RUN "MENU.PGM"` di baris 1390 — berkas itu TIDAK ADA di disketnya.
     Yang ada MENU.BAS. Lihat catatan cacat.
   - Baris 720 memakai aksara backtick, bukan apostrof, sebagai penanda
     komentar. Lihat catatan cacat; di penelusur ia diperlakukan sebagai
     komentar supaya sisanya bisa ditelusuri.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }

  /* --- 10-90: judul dan pilihan tombol ------------------------------------ */
  [10, 20, 30].forEach(rem);
  /* 40-60 kurung SIKU, bukan kurung biasa. GW-BASIC menerima keduanya untuk
     indeks larik, dan berkas ini memakai siku dari awal sampai akhir tanpa
     sekali pun tergelincir. Kebiasaan dari bahasa lain, dibawa utuh. */
  T({ baris: 40, jalan: function (m) { m.dim('BALL()', 14); } });
  T({ baris: 50, jalan: function (m) { m.dim('PADDLE()', 9); } });
  T({ baris: 60, jalan: function (m) { m.dim('BRICK()', 20, 4); } });
  T({ baris: 65, jalan: function () { /* RANDOMIZE(VAL(RIGHT$(TIME$,2))) */ } });
  T({ baris: 70, jalan: function () { /* KEY OFF:PLAY "mb" */ } });
  T({ baris: 80, jalan: function (m) { m.v.LOUD = 0; } });
  /* 90 lagu kemenangan disimpan di variabel bernama BRUNO$ — satu-satunya
     nama diri di seluruh berkas ini. */
  T({ baris: 90, jalan: function (m) {
      m.v['BRUNO$'] = 'l16o2b-o3cl8ddc+16do2fp1';
    } });

  /* --- 110-135: ukuran arena ---------------------------------------------- */
  T({ baris: 110, jalan: function (m) {
      m.v.T = 8; m.v.B = 188; m.v.L = 8; m.v.R = 308;
    } });
  T({ baris: 120, jalan: function (m) {
      m.v.BH = 8; m.v.BW = (m.v.R - m.v.L) / 20;
    } });
  T({ baris: 130, jalan: function (m) {
      m.v.BT = m.v.T + m.v.BH * 4; m.v.BB = m.v.BT + m.v.BH * 4;
    } });
  T({ baris: 135, jalan: function (m) { m.cls(); } });
  T({ baris: 140, jalan: function (m) {
      m.locate(7, 12); m.cetak('Welcome to Spinout');
    } });
  T({ baris: 150, jalan: function (m) {
      m.locate(8, 12); m.cetak('ArchMach Version 1');
    } });

  /* --- 160-260: pemainnya memilih sendiri tombolnya ------------------------
     Tidak ada tata letak tombol yang dipaksakan. Pemain menekan apa saja, dan
     tombol itulah yang jadi "kanan". Tiap pilihan diuji terhadap yang sudah
     dipilih; kalau bentrok, semuanya diulang dari awal. */
  T({ baris: 160, jalan: function (m) {
      m.locate(12, 1); m.cetak('Choose a key to move the paddle right');
    } });
  T({ baris: 170, jalan: function (m) {
      m.v['R$'] = m.inkey(); if (m.v['R$'] === '') m.lompat(170);
    } });
  T({ baris: 180, jalan: function (m) {
      m.locate(12, 1); m.cetak('Choose a key to move the paddle left ');
    } });
  T({ baris: 190, jalan: function (m) {
      m.v['L$'] = m.inkey(); if (m.v['L$'] === '') m.lompat(190);
    } });
  T({ baris: 200, jalan: function (m) {
      if (m.v['R$'] === m.v['L$']) m.lompat(160);
    } });
  T({ baris: 210, jalan: function (m) {
      m.locate(12, 1); m.cetak('Choose a key to serve                ');
    } });
  T({ baris: 220, jalan: function (m) {
      m.v['S$'] = m.inkey(); if (m.v['S$'] === '') m.lompat(220);
    } });
  T({ baris: 230, jalan: function (m) {
      if (m.v['R$'] === m.v['S$'] || m.v['L$'] === m.v['S$']) m.lompat(160);
    } });
  T({ baris: 240, jalan: function (m) {
      m.locate(12, 1); m.cetak('Choose a key to turn noise on/off   ');
    } });
  /* 250 berakhir dengan titik koma nyasar sesudah `GOTO 250`. GW-BASIC
     memakannya tanpa berkata apa-apa. */
  T({ baris: 250, jalan: function (m) {
      m.v['N$'] = m.inkey(); if (m.v['N$'] === '') m.lompat(250);
    } });
  T({ baris: 260, jalan: function (m) {
      if (m.v['R$'] === m.v['N$'] || m.v['L$'] === m.v['N$'] ||
          m.v['S$'] === m.v['N$']) m.lompat(160);
    } });

  /* --- 270-296: tingkat kesulitan ------------------------------------------
     SKILL bukan sekadar angka kecepatan. Ia dipakai lima kali dengan arti yang
     berbeda-beda: batas kecepatan (290), GRAVITASI (295), peluang bata hidup
     kembali (1150), besar simpangan pukulan (1250), dan besar putaran (1260).
     Satu bilangan yang mengendalikan seluruh watak permainannya. */
  T({ baris: 270, bagian: [
      function (m) { m.locate(12, 1); },
      function (m) {
        m.masukan(function (s) { m.v.SKILL = parseFloat(s) || 0; },
                  'How good are you at this game (1-10)');
      }
    ] });
  T({ baris: 275, jalan: function (m) { if (m.v.SKILL < 1) m.lompat(270); } });
  T({ baris: 276, jalan: function (m) { if (m.v.SKILL > 10) m.lompat(270); } });
  T({ baris: 280, jalan: function (m) { m.v.SKILL = m.v.SKILL / 10; } });
  T({ baris: 290, jalan: function (m) {
      m.v.MAXVX = 6 + 4 * m.v.SKILL; m.v.MAXVY = m.v.MAXVX;
    } });
  /* 295 GRAVITASI, dan besarnya ikut pilihan pemain. Makin tinggi tingkat
     yang diakuinya, makin berat bolanya jatuh. */
  T({ baris: 295, jalan: function (m) { m.v.G = m.v.SKILL / 5; } });
  /* 296 separuh baris ini komentar: `POKE &H410,EQUIPMENT%-&H10` yang
     dinonaktifkan. Ia dulu BERBOHONG kepada BASIC tentang kartu yang
     terpasang, supaya SCREEN 1 mau jalan di mesin monokrom. Pasangannya —
     yang mengembalikan nilainya — ada di baris 1341, juga dinonaktifkan. */
  T({ baris: 296, jalan: function (m) { m.v['EQUIPMENT%'] = 0x2D; } });
  T({ baris: 297, jalan: function (m) {
      m.layar(0); m.layar(1); m.warna(1, 0); m.cls();
    } });

  /* --- 300-360: pasang bata ------------------------------------------------
     Nilai bata 10, 60, 110, 160 dari atas ke bawah. Dua puluh kolom kali
     empat baris, jumlahnya 6800 — dan angka itu muncul lagi di baris 970
     sebagai syarat menang, tanpa satu pun komentar yang menghubungkannya. */
  T({ baris: 300, jalan: function (m) { m.garis(0, 0, 319, 199, 0, 'BF'); } });
  T({ baris: 310, jalan: function (m) { m.untuk('BY', 0, 3, 1, 360); } });
  T({ baris: 320, jalan: function (m) { m.untuk('BX', 0, 19, 1, 350); } });
  T({ baris: 330, jalan: function (m) {
      m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY] = 10 + 50 * m.v.BY;
    } });
  /* 340 warna bata `2+INT(BY/2)` — dua baris atas warna 2, dua baris bawah
     warna 3. Empat baris bata, dua warna, satu pembagian. */
  T({ baris: 340, jalan: function (m) {
      var x = m.v.L + 2 + m.v.BW * m.v.BX, y = m.v.BT + 2 + m.v.BH * m.v.BY;
      m.garis(x, y, x + (m.v.BW - 4), y + (m.v.BH - 4),
              2 + Math.floor(m.v.BY / 2), 'BF');
    } });
  T({ baris: 350, bagian: [
      function (m) { m.lanjutkan('BX'); },
      function (m) { m.lanjutkan('BY'); }
    ] });
  T({ baris: 360, jalan: function (m) { m.v.SCORE = 0; } });

  /* --- 370-400: dinding, digambar sebagai satu garis bersambung ------------
     `LINE -(x,y)` tanpa titik awal melanjutkan dari titik terakhir. Empat
     baris, satu persegi, tanpa sekali pun mengulang koordinat. */
  T({ baris: 370, jalan: function (m) {
      m.garis(m.v.L, m.v.T, m.v.R, m.v.T);
    } });
  T({ baris: 380, jalan: function (m) {
      m.garis(m.xKini(), m.yKini(), m.v.R, m.v.B);
    } });
  T({ baris: 390, jalan: function (m) {
      m.garis(m.xKini(), m.yKini(), m.v.L, m.v.B);
    } });
  T({ baris: 400, jalan: function (m) {
      m.garis(m.xKini(), m.yKini(), m.v.L, m.v.T);
    } });

  /* --- 410-500: bola dan pemukul dibuat DENGAN MENGGAMBARNYA ---------------
     Tidak ada larik yang diisi angka. Bolanya digambar sungguhan di tengah
     layar dengan gelung 5x5 dan uji jarak, lalu DIPUNGUT dari layar dengan
     GET. Cetakan itu yang jadi sprite. Gambar aslinya ditinggalkan di layar —
     dan baris 640 menghapusnya dengan PUT XOR di tempat yang sama. */
  T({ baris: 410, jalan: function (m) { m.v.X = 160; m.v.Y = 100; } });
  T({ baris: 420, jalan: function (m) { m.v['LASTD$'] = ''; } });
  T({ baris: 430, jalan: function (m) { m.untuk('I', 1, 5, 1, 470); } });
  T({ baris: 440, jalan: function (m) { m.untuk('J', 1, 5, 1, 460); } });
  /* 450 `<6.25` — jari-jari 2,5 dikuadratkan. Uji lingkaran tanpa akar. */
  T({ baris: 450, jalan: function (m) {
      var di = m.v.I - 3, dj = m.v.J - 3;
      if (di * di + dj * dj < 6.25) {
        m.pset(m.v.X - 3 + m.v.I, m.v.Y - 3 + m.v.J);
      }
    } });
  T({ baris: 460, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) { m.lanjutkan('I'); }
    ] });
  T({ baris: 470, jalan: function (m) {
      m.v['BALL()'] = m.ambil(m.v.X - 2, m.v.Y - 2, m.v.X + 2, m.v.Y + 2);
    } });
  T({ baris: 480, jalan: function (m) {
      m.v.PL = 150; m.v.PR = 170; m.v.PY = m.v.B - 20;
    } });
  T({ baris: 490, jalan: function (m) {
      m.garis(m.v.PL, m.v.PY, m.v.PR, m.v.PY, 1, 'BF');
    } });
  T({ baris: 500, jalan: function (m) {
      m.v['PADDLE()'] = m.ambil(m.v.PL, m.v.PY, m.v.PR, m.v.PY);
    } });

  /* --- 510-730: satu bola --------------------------------------------------- */
  rem(510);
  T({ baris: 520, jalan: function (m) { /* IF LOUD=1 THEN PLAY BRUNO$ */ } });
  T({ baris: 530, jalan: function (m) { m.untuk('SHOT', 1, 4, 1, 1340); } });
  T({ baris: 540, jalan: function (m) { m.locate(25, 1); } });
  T({ baris: 550, jalan: function (m) { m.cetakFormat('#####', m.v.SCORE); } });
  T({ baris: 560, jalan: function (m) { m.locate(25, 8); } });
  /* 570 `PRINT USING "Ball #  "` — kata "Ball" bukan bagian formatnya, ia
     teks harfiah di string yang sama. */
  T({ baris: 570, jalan: function (m) { m.cetakFormat('Ball #  ', m.v.SHOT); } });
  T({ baris: 580, jalan: function (m) { m.locate(25, 18); } });
  T({ baris: 590, jalan: function (m) { m.cetak('K.R.Sloan,Jr.  1Jan82'); } });
  /* 600-630 mengurung X,Y ke dalam arena SEBELUM baris 640 menghapus bola di
     tempat lamanya. Kalau bola lolos jauh keluar arena, PUT-nya akan mencoret
     tempat yang salah. */
  T({ baris: 600, jalan: function (m) { if (m.v.X > m.v.R) m.v.X = m.v.R; } });
  T({ baris: 610, jalan: function (m) { if (m.v.X < m.v.L) m.v.X = m.v.L; } });
  T({ baris: 620, jalan: function (m) { if (m.v.Y < m.v.T) m.v.Y = m.v.T; } });
  T({ baris: 630, jalan: function (m) { if (m.v.Y > m.v.B) m.v.Y = m.v.B; } });
  /* 640 PUT tanpa aksi = XOR. Ia MENGHAPUS bola dari tempat terakhirnya —
     dan pada bola pertama, yang dihapusnya adalah gambar yang dipakai baris
     430-460 untuk membuat sprite-nya. */
  T({ baris: 640, jalan: function (m) {
      m.taruh(m.v.X - 2, m.v.Y - 2, m.v['BALL()'], 'XOR');
    } });
  T({ baris: 650, jalan: function (m) {
      m.v.X = m.v.L + m.acak() * (m.v.R - m.v.L);
    } });
  T({ baris: 660, jalan: function (m) { m.v.Y = m.v.B - 10; } });
  T({ baris: 670, jalan: function (m) {
      m.taruh(m.v.X - 2, m.v.Y - 2, m.v['BALL()'], 'XOR');
    } });
  T({ baris: 680, jalan: function (m) { m.v.VX = 6 * m.acak() - 3; } });
  T({ baris: 690, jalan: function (m) { m.v.VY = -5 - 2 * m.acak(); } });
  T({ baris: 700, jalan: function (m) { m.v.SPIN = 0; } });
  T({ baris: 710, jalan: function (m) { m.v.FAST = 1 + m.v.SKILL; } });
  /* 720 komentarnya ditandai BACKTICK, bukan apostrof — satu-satunya di
     seluruh koleksi yang berada di luar string. Lihat catatan cacat. */
  T({ baris: 720, jalan: function (m) { m.gosub(1410); } });
  T({ baris: 730, jalan: function (m) {
      if (m.v['D$'] !== m.v['S$']) m.lompat(720);
    } });

  /* --- 740-790: satu langkah bola ------------------------------------------
     Semua "yang tadi" disimpan lebih dulu: OX, OY, OBX, OBY, OVX, OVY. Enam
     variabel bayangan, dan tiap satu dipakai untuk hal yang berbeda —
     menghapus gambar lama, mengetahui bata mana yang baru saja ditinggalkan,
     dan menghitung putaran dari kecepatan SEBELUM dilengkungkan. */
  T({ baris: 740, jalan: function (m) {
      m.v.OX = m.v.X; m.v.OY = m.v.Y; m.v.OBX = m.v.BX; m.v.OBY = m.v.BY;
    } });
  T({ baris: 750, jalan: function (m) { m.v.OVX = m.v.VX; m.v.OVY = m.v.VY; } });
  /* 760 INILAH BARISNYA. Kecepatan lama diputar sedikit — sudutnya sebanding
     dengan SPIN — lalu gravitasi ditambahkan. Karena keduanya dihitung dari
     OVX/OVY yang sama, ini benar-benar putaran, bukan dua penyesuaian
     berurutan yang saling memakan. */
  T({ baris: 760, jalan: function (m) {
      m.v.VX = m.v.OVX - m.v.SPIN * m.v.OVY * 0.05;
      m.v.VY = m.v.OVY + m.v.SPIN * m.v.OVX * 0.05 + m.v.G;
    } });
  T({ baris: 761, jalan: function (m) { m.v.SPIN = m.v.SPIN * 0.9999; } });
  T({ baris: 770, jalan: function (m) { if (m.v.VX > m.v.MAXVX) m.v.VX = m.v.MAXVX; } });
  T({ baris: 771, jalan: function (m) { if (m.v.VY > m.v.MAXVY) m.v.VY = m.v.MAXVY; } });
  T({ baris: 780, jalan: function (m) { if (m.v.VX < -m.v.MAXVX) m.v.VX = -m.v.MAXVX; } });
  T({ baris: 781, jalan: function (m) { if (m.v.VY < -m.v.MAXVY) m.v.VY = -m.v.MAXVY; } });
  T({ baris: 790, jalan: function (m) {
      m.v.X = m.v.X + m.v.VX; m.v.Y = m.v.Y + m.v.VY;
    } });

  /* --- 800-960: kena bata? ------------------------------------------------- */
  T({ baris: 800, jalan: function (m) {
      m.v.BX = Math.floor((m.v.X - m.v.L) / m.v.BW);
    } });
  T({ baris: 810, jalan: function (m) { if (m.v.BX > 19) m.v.BX = 19; } });
  T({ baris: 820, jalan: function (m) { if (m.v.BX < 0) m.v.BX = 0; } });
  T({ baris: 830, jalan: function (m) {
      m.v.BY = Math.floor((m.v.Y - m.v.BT) / m.v.BH);
    } });
  T({ baris: 840, jalan: function (m) { if (m.v.BY > 3) m.lompat(1050); } });
  T({ baris: 850, jalan: function (m) { if (m.v.BY < 0) m.lompat(1050); } });
  T({ baris: 860, jalan: function (m) {
      if (m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY] <= 0) m.lompat(1050);
    } });
  /* 870-880 dua baris bata bagian ATAS mempercepat bola. Makin dalam ia
     menembus, makin cepat ia keluar. */
  T({ baris: 870, jalan: function (m) { if (m.v.BY > 1) m.lompat(890); } });
  T({ baris: 880, jalan: function (m) { m.v.VY = m.v.VY * m.v.FAST; } });
  /* 890-900 arah pantulnya ditentukan oleh SISI mana yang diseberangi: kalau
     nomor kolom batanya berubah, ia masuk dari samping; kalau nomor barisnya
     berubah, dari atas atau bawah. Tidak ada geometri, cuma perbandingan
     dua pasang bilangan bulat. */
  T({ baris: 890, jalan: function (m) { if (m.v.OBX !== m.v.BX) m.v.VX = -m.v.VX; } });
  T({ baris: 900, jalan: function (m) { if (m.v.OBY !== m.v.BY) m.v.VY = -m.v.VY; } });
  T({ baris: 910, jalan: function (m) {
      m.v.SCORE = m.v.SCORE + m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY];
    } });
  T({ baris: 920, jalan: function () { /* SOUND 440,2*LOUD */ } });
  /* 930-950 bolanya diangkat, batanya dihapus, bolanya dipasang lagi. Kalau
     tidak, penghapusan bata akan memakan sebagian bola yang kebetulan
     menutupinya — dan karena PUT-nya XOR, bekasnya permanen. */
  T({ baris: 930, jalan: function (m) {
      m.taruh(m.v.OX - 2, m.v.OY - 2, m.v['BALL()'], 'XOR');
    } });
  T({ baris: 940, jalan: function (m) {
      var x = m.v.L + 2 + m.v.BW * m.v.BX, y = m.v.BT + 2 + m.v.BH * m.v.BY;
      m.garis(x, y, x + (m.v.BW - 4), y + (m.v.BH - 4), 0, 'BF');
    } });
  T({ baris: 950, jalan: function (m) {
      m.taruh(m.v.OX - 2, m.v.OY - 2, m.v['BALL()'], 'XOR');
    } });
  /* 960 batanya DINEGATIFKAN, bukan dinolkan. Tandanya menyimpan "sudah
     hancur"; besarnya tetap menyimpan nilainya. Itu yang membuat baris
     1170-1200 bisa membangkitkannya kembali lengkap dengan harganya. */
  T({ baris: 960, jalan: function (m) {
      m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY] =
        -m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY];
    } });

  /* --- 970-1040: menang ----------------------------------------------------
     6800 = 20 kolom x (10+60+110+160). Angka itu dihitung di kepala penulisnya
     dan dituliskan sebagai bilangan telanjang; tidak ada satu pun baris yang
     menghubungkannya dengan baris 330. */
  T({ baris: 970, jalan: function (m) { if (m.v.SCORE < 6800) m.lompat(1050); } });
  T({ baris: 972, jalan: function (m) { m.locate(25, 1); } });
  T({ baris: 974, jalan: function (m) { m.cetakFormat('#####', m.v.SCORE); } });
  T({ baris: 980, jalan: function (m) { m.untuk('FLASH', 1, 8, 1, 1040); } });
  /* 990 `COLOR FLASH,.5+RND(FLASH)` — nomor PALETNYA bilangan pecahan acak.
     GW-BASIC membulatkannya, jadi paletnya berkedip antara dua gugus warna
     sementara latarnya berjalan 1 sampai 8. */
  T({ baris: 990, jalan: function (m) {
      m.warna(m.v.FLASH, Math.round(0.5 + m.acak()));
    } });
  T({ baris: 1000, jalan: function () { /* PLAY "mfaemb" */ } });
  T({ baris: 1010, jalan: function (m) { m.lanjutkan('FLASH'); } });
  T({ baris: 1040, jalan: function (m) { m.lompat(1340); } });

  /* --- 1050-1080: dinding --------------------------------------------------
     `X=L+L-X` memantulkan posisi terhadap dinding, bukan sekadar menaruhnya
     di dinding. Bola yang lewat tiga piksel akan berakhir tiga piksel di sisi
     dalam — jaraknya terjaga, jadi kecepatan tinggi tidak membuatnya lengket.
     Dan tiap dinding mengubah SPIN dengan tanda yang berbeda. */
  T({ baris: 1050, jalan: function (m) {
      if (m.v.X <= m.v.L) {
        m.v.X = m.v.L + m.v.L - m.v.X; m.v.VX = -m.v.VX;
        m.v.VY = m.v.VY + m.v.SPIN;
      }
    } });
  T({ baris: 1060, jalan: function (m) {
      if (m.v.X >= m.v.R) {
        m.v.X = m.v.R + m.v.R - m.v.X; m.v.VX = -m.v.VX;
        m.v.VY = m.v.VY - m.v.SPIN;
      }
    } });
  T({ baris: 1070, jalan: function (m) {
      if (m.v.Y <= m.v.T) {
        m.v.Y = m.v.T + m.v.T - m.v.Y; m.v.VY = -m.v.VY;
        m.v.VX = m.v.VX - m.v.SPIN;
      }
    } });
  T({ baris: 1080, jalan: function (m) { if (m.v.Y >= m.v.B) m.lompat(1310); } });

  /* --- 1090-1130: kena pemukul? -------------------------------------------
     1090 memastikan bola benar-benar MENYEBERANGI garis pemukul turun ke
     bawah. 1100 dan 1110 menguji dua tempat — posisi baru DAN posisi lama —
     jadi bola cepat yang melompati pemukul tetap tertangkap. */
  T({ baris: 1090, jalan: function (m) {
      if (m.v.Y < m.v.PY || m.v.OY > m.v.PY) m.lompat(1270);
    } });
  T({ baris: 1100, jalan: function (m) {
      if (m.v.PL - 2 < m.v.X && m.v.X < m.v.PR + 2) m.lompat(1130);
    } });
  T({ baris: 1110, jalan: function (m) {
      if (m.v.PL - 2 < m.v.OX && m.v.OX < m.v.PR + 2) m.lompat(1130);
    } });
  T({ baris: 1120, jalan: function (m) { m.lompat(1270); } });
  T({ baris: 1130, jalan: function (m) { m.v.Y = m.v.PY + m.v.PY - m.v.Y; } });
  T({ baris: 1140, jalan: function () { /* SOUND 300,5*LOUD */ } });

  /* --- 1150-1200: bata yang hidup kembali ---------------------------------- */
  T({ baris: 1150, jalan: function (m) {
      if (m.acak() * 2 > m.v.SKILL) m.lompat(1210);
    } });
  /* 1160 DAN DI SINI CACATNYA. Baris ini menimpa BX dan BY — dua variabel
     yang di baris 740 akan disalin ke OBX,OBY sebagai "bata yang tadi
     ditempati bola". Sesudah satu pemulihan, penanda itu menunjuk petak acak,
     dan uji arah pantul di baris 890-900 memakai perbandingan yang salah. */
  T({ baris: 1160, jalan: function (m) {
      m.v.BX = Math.floor(m.acak() * 19.99);
      m.v.BY = Math.floor(m.acak() * 3.99);
    } });
  T({ baris: 1170, jalan: function (m) {
      if (m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY] > 0) m.lompat(1210);
    } });
  T({ baris: 1180, jalan: function (m) {
      m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY] =
        -m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY];
    } });
  T({ baris: 1190, jalan: function (m) {
      var x = m.v.L + 2 + m.v.BW * m.v.BX, y = m.v.BT + 2 + m.v.BH * m.v.BY;
      m.garis(x, y, x + (m.v.BW - 4), y + (m.v.BH - 4),
              2 + Math.floor(m.v.BY / 2), 'BF');
    } });
  T({ baris: 1200, jalan: function (m) {
      m.v.SCORE = m.v.SCORE - m.v['BRICK()'][1 + m.v.BX][1 + m.v.BY];
    } });

  /* --- 1210-1260: pantulan pemukul ----------------------------------------- */
  T({ baris: 1210, jalan: function (m) { m.locate(25, 1); } });
  T({ baris: 1220, jalan: function (m) {
      m.cetak((m.v.SCORE < 0 ? '-' : ' ') + Math.abs(m.v.SCORE) + ' ');
    } });
  T({ baris: 1230, jalan: function (m) { m.v.VY = -m.v.VY; } });
  /* 1240 penyebutnya `PL-PR` — bilangan NEGATIF (−20). Jadi MISS negatif
     kalau bola kena di kanan tengah. Lalu 1250 mengalikannya dengan VY yang
     baris 1230 baru saja jadikan negatif juga. Dua tanda minus yang saling
     meniadakan, dan tidak satu pun disebut di mana-mana. */
  T({ baris: 1240, jalan: function (m) {
      m.v.MISS = (m.v.X - (m.v.PL + m.v.PR) / 2) / (m.v.PL - m.v.PR);
    } });
  T({ baris: 1250, jalan: function (m) {
      m.v.VX = m.v.VX + m.v.VY * m.v.MISS * m.v.SKILL * 5;
    } });
  T({ baris: 1260, jalan: function (m) {
      m.v.SPIN = m.v.SPIN * m.v.SKILL + m.v.MISS * m.v.SKILL;
    } });

  /* --- 1270-1300: gambar ulang, lalu putar lagi ---------------------------- */
  T({ baris: 1270, jalan: function (m) {
      m.taruh(m.v.X - 2, m.v.Y - 2, m.v['BALL()'], 'XOR');
    } });
  T({ baris: 1280, jalan: function (m) {
      m.taruh(m.v.OX - 2, m.v.OY - 2, m.v['BALL()'], 'XOR');
    } });
  T({ baris: 1290, jalan: function (m) { m.gosub(1410); } });
  T({ baris: 1300, jalan: function (m) { m.lompat(740); } });

  /* --- 1310-1400: bola habis, permainan habis ------------------------------ */
  rem(1310);
  T({ baris: 1320, jalan: function () { /* IF LOUD=1 THEN SOUND 200,20 */ } });
  T({ baris: 1330, jalan: function (m) { m.lanjutkan('SHOT'); } });
  rem(1340);
  /* 1341 pasangan baris 296 yang dinonaktifkan: mengembalikan kata
     perlengkapan BIOS ke 125 sesudah dibohongi. Keduanya mati bersama. */
  rem(1341);
  T({ baris: 1342, jalan: function (m) { m.layar(0); } });
  T({ baris: 1350, jalan: function (m) { m.locate(12, 20); } });
  T({ baris: 1360, jalan: function (m) {
      m.cetak('Do you want to play another game?');
    } });
  T({ baris: 1370, jalan: function (m) {
      m.v['D$'] = m.inkey(); if (m.v['D$'] === '') m.lompat(1370);
    } });
  T({ baris: 1380, jalan: function (m) {
      if (m.v['D$'] === 'y' || m.v['D$'] === 'Y') m.jalankan();
    } });
  /* 1390 `RUN "MENU.PGM"` — dan berkas itu tidak ada. Yang ada di disketnya
     MENU.BAS. Lihat catatan cacat. */
  T({ baris: 1390, jalan: function (m) {
      if (m.v['D$'] === 'n' || m.v['D$'] === 'N') { m.cls(); m.jalankan('MENU.PGM'); }
    } });
  T({ baris: 1400, jalan: function (m) { m.lompat(1360); } });

  /* --- 1410-1530: pemukul --------------------------------------------------
     Gelungnya ada DI DALAM subrutin: 1450 dan 1460 kembali ke 1430 sesudah
     menggeser, jadi satu panggilan menghabiskan SELURUH tombol yang tertumpuk
     di penyangga. Pemain yang menahan tombol bergerak sejauh yang tertumpuk,
     bukan lima piksel per bingkai. */
  rem(1410);
  T({ baris: 1420, jalan: function (m) { m.v.OPL = m.v.PL; } });
  T({ baris: 1430, jalan: function (m) { m.v['D$'] = m.inkey(); } });
  T({ baris: 1440, jalan: function (m) {
      if (m.v['D$'] === m.v['N$']) m.v.LOUD = -1 * m.v.LOUD + 1;
    } });
  T({ baris: 1450, jalan: function (m) {
      if (m.v['D$'] === m.v['L$']) { m.v.PL = m.v.PL - 5; m.lompat(1430); }
    } });
  T({ baris: 1460, jalan: function (m) {
      if (m.v['D$'] === m.v['R$']) { m.v.PL = m.v.PL + 5; m.lompat(1430); }
    } });
  T({ baris: 1470, jalan: function (m) { if (m.v.PL < m.v.L) m.v.PL = m.v.L; } });
  T({ baris: 1480, jalan: function (m) {
      if (m.v.PL > m.v.R - 20) m.v.PL = m.v.R - 20;
    } });
  /* 1490 kalau pemukulnya tidak bergerak, tidak ada yang digambar ulang.
     Penghematan yang penting: PUT XOR dua kali di tempat yang sama akan
     mengedipkan pemukul di tiap bingkai. */
  T({ baris: 1490, jalan: function (m) { if (m.v.OPL === m.v.PL) m.kembali(); } });
  T({ baris: 1500, jalan: function (m) { m.v.PR = m.v.PL + 20; } });
  T({ baris: 1510, jalan: function (m) {
      m.taruh(m.v.OPL, m.v.PY, m.v['PADDLE()'], 'XOR');
    } });
  T({ baris: 1520, jalan: function (m) {
      m.taruh(m.v.PL, m.v.PY, m.v['PADDLE()'], 'XOR');
    } });
  T({ baris: 1530, jalan: function (m) { m.kembali(); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BREAKOUT'] = {
    nama: 'BREAKOUT',
    judul: 'Spinout (K.R. Sloan Jr., 1 Januari 1982)',
    sumber: 'BREAKOUT',
    berkas: 'run/BREAKOUT.BAS',
    tabel: tabel,
    benih: 82,

    arsitektur: {
      judul: 'Alur BREAKOUT.BAS',
      simpul: [
        { id: 'tombol', baris: '160-260', jenis: 'mulai',
          teks: ['Pemain memilih SENDIRI', 'empat tombolnya'] },
        { id: 'skill', baris: '270-295', jenis: 'putusan',
          teks: ['Satu angka 1-10 yang mengatur', 'kecepatan, gravitasi,', 'putaran, dan pemulihan bata'] },
        { id: 'pasang', baris: '300-500',
          teks: ['Bata, dinding, lalu bola dan pemukul', 'DIGAMBAR untuk dipungut GET'] },
        { id: 'sajian', baris: '600-730',
          teks: ['Hapus bola lama, taruh di tempat acak,', 'tunggu tombol sajian'] },
        { id: 'putar', baris: '740-790',
          teks: ['SIMPAN yang lama,', 'PUTAR kecepatan sebesar SPIN,', 'tambahkan gravitasi'] },
        { id: 'bata', baris: '800-960', jenis: 'putusan',
          teks: ['Kena bata? Pantul menurut sisi', 'yang diseberangi; bata DINEGATIFKAN'] },
        { id: 'dinding', baris: '1050-1080',
          teks: ['Pantulan cermin; tiap dinding', 'mengubah SPIN dengan tanda berbeda'] },
        { id: 'pemukul', baris: '1090-1260', jenis: 'putusan',
          teks: ['Kena pemukul: beri SPIN,', 'dan mungkin bangkitkan satu bata'] },
        { id: 'usai', baris: '1310-1400', jenis: 'keluar',
          teks: ['Empat bola habis,', 'atau skor 6800'] }
      ],
      panah: [
        { dari: 'tombol', ke: 'skill' },
        { dari: 'skill', ke: 'pasang' },
        { dari: 'pasang', ke: 'sajian' },
        { dari: 'sajian', ke: 'putar' },
        { dari: 'putar', ke: 'bata' },
        { dari: 'bata', ke: 'dinding' },
        { dari: 'dinding', ke: 'pemukul' },
        { dari: 'pemukul', ke: 'putar', label: 'bola masih hidup' },
        { dari: 'dinding', ke: 'usai', label: 'lewat dasar' },
        { dari: 'bata', ke: 'usai', label: 'skor 6800' },
        { dari: 'usai', ke: 'sajian', label: 'bola berikutnya' }
      ]
    },

    pseudokode: [
      { baris: 760, tingkat: 0, teks: 'kecepatan <b>diputar</b> sebesar sudut kecil &rarr; bolanya melengkung' },
      { baris: 761, tingkat: 1, teks: 'putarannya luruh <code>&times;0,9999</code> tiap langkah' },
      { baris: 1260, tingkat: 0, teks: 'SPIN datang dari <b>seberapa pinggir</b> bola kena pemukul' },
      { baris: 295, tingkat: 0, teks: '<code>G</code> gravitasi &mdash; dan besarnya ikut angka yang diakui pemain' },
      { baris: 960, tingkat: 0, teks: 'bata <b>dinegatifkan</b>, bukan dinolkan: tandanya menyimpan nasibnya' },
      { baris: 1180, tingkat: 1, teks: '&hellip;jadi ia bisa <b>dibangkitkan lagi</b> lengkap dengan harganya' },
      { baris: 1160, tingkat: 1, teks: '&hellip;tapi baris ini <b>menimpa BX,BY</b> yang masih dipakai baris 740' },
      { baris: 470, tingkat: 0, teks: 'bola dibuat dengan <b>menggambarnya</b>, lalu dipungut <code>GET</code>' },
      { baris: 890, tingkat: 0, teks: 'arah pantul dari <b>nomor petak</b> yang berubah, bukan dari geometri' },
      { baris: 1050, tingkat: 0, teks: '<code>X=L+L-X</code> &mdash; pantulan cermin, bukan penempelan ke dinding' }
    ],

    perintahAsli: 'run\\BREAKOUT.bat',
    catatanAsli: 'Program menanyakan empat tombol lebih dulu &mdash; kanan, ' +
      'kiri, sajian, dan bunyi &mdash; lalu satu angka 1 sampai 10. Coba ' +
      'angka 10 dan perhatikan bolanya melengkung; coba 1 dan ia hampir ' +
      'lurus.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Termasuk lagu ' +
      'kemenangan yang disimpan di <code>BRUNO$</code>.',

      '<b><code>RANDOMIZE(VAL(RIGHT$(TIME$,2)))</code> diganti benih tetap</b>, ' +
      'supaya sajian yang sama bisa ditelusuri dua kali.',

      '<b><code>PEEK(&amp;H410)</code> diisi nilai kartu warna yang masuk ' +
      'akal.</b> Programnya menyimpannya ke <code>EQUIPMENT%</code> lalu ' +
      'tidak pernah membacanya lagi &mdash; baris yang memakainya sudah jadi ' +
      'komentar.',

      '<b><code>INPUT;"How good are you..."</code> dipecah jadi dua bagian</b> ' +
      'di penelusur (<code>LOCATE</code> lalu permintaannya), supaya ' +
      'permintaan masukan berdiri sendiri sebagai satu langkah.',

      '<b>Baris 720 diperlakukan sebagai komentar</b> meski aksara penandanya ' +
      'backtick, bukan apostrof. Lihat catatan cacat &mdash; ini yang ' +
      'membuat sisa berkasnya bisa ditelusuri sama sekali.'
    ],

    pelajaran: {
      ringkas: 'Bola yang melengkung dari dua perkalian, dan satu tanda minus ' +
        'yang menyimpan seluruh riwayat sebuah bata.',
      pelajari: [
        ['Putaran vektor sebagai dua perkalian',
         '<code>760 VX=OVX-(SPIN*OVY*.05):VY=OVY+(SPIN*OVX*.05)+G</code>',
         'Itu putaran vektor kecepatan sebesar sudut kecil. Bentuk lengkapnya ' +
         'butuh sinus dan kosinus; untuk sudut kecil, <code>sin&theta;&asymp;' +
         '&theta;</code> dan <code>cos&theta;&asymp;1</code>, dan yang tersisa ' +
         'persis dua perkalian di atas.',
         'Yang membuatnya benar: keduanya dihitung dari <code>OVX</code> dan ' +
         '<code>OVY</code> yang <b>sama</b> &mdash; nilai sebelum baris ini. ' +
         'Kalau <code>VX</code> yang baru dipakai untuk menghitung ' +
         '<code>VY</code>, hasilnya bukan putaran lagi melainkan dua ' +
         'penyesuaian berurutan yang saling memakan.',
         'Itu sebabnya baris 750 ada. Dua variabel bayangan, semata-mata ' +
         'supaya satu baris di bawahnya bisa membaca keadaan yang belum ' +
         'berubah.',
         'Diukur di penelusur dengan <code>SPIN=5</code> dan gravitasi ' +
         'dimatikan, arah bolanya berbelok <b>14,036&deg; tiap langkah</b> ' +
         '&mdash; tepat <code>atan(0,25)</code>, dan 0,25 adalah ' +
         '<code>SPIN&times;0,05</code>. Dengan <code>SPIN=0</code> ' +
         'arahnya tetap 0&deg; langkah demi langkah.'],
        ['Sprite yang dibuat dengan menggambarnya',
         'Baris 430-470 tidak mengisi larik dengan angka. Ia menggambar ' +
         'lingkaran sungguhan di tengah layar &mdash; gelung 5&times;5 dengan ' +
         'uji <code>(I-3)&sup2;+(J-3)&sup2;&lt;6.25</code> &mdash; lalu ' +
         'MEMUNGUTNYA dengan <code>GET</code>.',
         'Uji jaraknya sendiri layak dilihat: 6,25 adalah 2,5 dikuadratkan, ' +
         'jadi tidak ada akar yang perlu dihitung.',
         'Dan gambar aslinya tidak dihapus. Ia ditinggalkan di layar, lalu ' +
         'baris 640 &mdash; <code>PUT</code> pertama pada bola pertama ' +
         '&mdash; menghapusnya dengan XOR di tempat yang sama. Pembuatan dan ' +
         'pembersihan dikerjakan oleh dua mekanisme berbeda yang kebetulan ' +
         'saling melengkapi.'],
        ['Satu tanda minus, dua keterangan',
         'Baris 960 menegatifkan nilai bata alih-alih menolkannya. Sesudah ' +
         'itu <b>tandanya</b> berarti "sudah hancur atau belum" dan ' +
         '<b>besarnya</b> tetap berarti "berapa nilainya".',
         'Dua keterangan di satu bilangan, dan tidak satu pun dari keduanya ' +
         'perlu larik tersendiri. Itulah yang membuat baris 1170-1200 bisa ' +
         'membangkitkan bata yang sudah hancur lengkap dengan harganya ' +
         '&mdash; dan memotong harga itu dari skor.'],
        ['Pantulan cermin, bukan penempelan',
         '<code>1050 IF X&lt;=L THEN X=L+L-X:VX=-VX</code>',
         'Bola yang menembus dinding tiga piksel ditaruh tiga piksel di sisi ' +
         'dalam, bukan tepat di dinding. Jaraknya terjaga.',
         'Bedanya baru terasa pada kecepatan tinggi: menempelkan bola ke ' +
         'dinding membuatnya bisa terperangkap di sana &mdash; posisi tetap ' +
         'di batas, syaratnya benar lagi di langkah berikutnya, dan ia ' +
         'bergetar. Pantulan cermin tidak pernah punya masalah itu.'],
        ['Tombol yang dipilih pemainnya',
         'Baris 160-260 tidak memaksakan tata letak apa pun. Pemain menekan ' +
         'tombol, dan tombol itulah yang jadi "kanan". Tiap pilihan ' +
         'berikutnya diuji terhadap yang sudah dipilih, dan kalau bentrok, ' +
         'semuanya diulang dari awal &mdash; tidak ada usaha menambal ' +
         'sebagian.',
         'Sembilan baris untuk sesuatu yang di zaman ini butuh satu layar ' +
         'pengaturan tersendiri.']
      ],
      hindari: [
        ['Variabel kerja yang dipakai dua orang',
         'Baris 1160 mengambil bata acak untuk dibangkitkan lagi, dan ia ' +
         'memakai <code>BX</code> dan <code>BY</code> &mdash; dua variabel ' +
         'yang di baris 800-830 berarti "petak bata yang sedang ditempati ' +
         'bola".',
         'Sesudah satu pemulihan, keduanya menunjuk petak acak. Lalu baris ' +
         '740 menyalinnya ke <code>OBX,OBY</code> sebagai "petak yang tadi ' +
         'ditempati", dan baris 890-900 memakai perbandingan itu untuk ' +
         'memutuskan arah pantul.',
         'Diperiksa langsung di penelusur: dengan bola berada di petak ' +
         '<code>(10,2)</code>, sekali jalan baris 1150-1200 meninggalkan ' +
         '<code>BX,BY</code> di <code>(18,1)</code> &mdash; dan baris 740 ' +
         'menyalin angka itu bulat-bulat ke <code>OBX,OBY</code>.',
         'Jadi tabrakan bata pertama sesudah tiap pemulihan memantul ke arah ' +
         'yang salah &mdash; dan hampir selalu ke arah yang PALING salah: ' +
         'karena petak acak itu biasanya berbeda di kedua sumbu, baris ' +
         '890 dan 900 sama-sama menyala dan bola dibalik dua kali. Ia ' +
         'pulang ke arah datangnya.',
         'Tambalannya dua baris: pakai nama lain di 1160-1200. Yang mahal ' +
         'menemukannya, karena gejalanya menyamar jadi bagian dari permainan ' +
         'yang memang sengaja tidak dapat ditebak.'],
        ['Angka 6800 yang dihitung di kepala',
         'Baris 970 menguji <code>SCORE&lt;6800</code> sebagai syarat menang. ' +
         'Angka itu jumlah seluruh nilai bata: 20 kolom kali (10+60+110+160).',
         'Tapi tidak ada satu baris pun yang menghitungnya. Ia dihitung sekali ' +
         'oleh penulisnya lalu dituliskan sebagai bilangan telanjang, dan ' +
         'baris 330 yang menentukan nilainya berada 640 baris di atasnya.',
         'Mengubah nilai bata &mdash; atau menambah satu baris bata &mdash; ' +
         'membuat kemenangan mustahil, dan tidak ada apa pun di baris 330 ' +
         'yang memperingatkannya.'],
        ['Backtick yang bukan apostrof',
         '<code>720 GOSUB 1410 `MOVE PADDLE</code>',
         'Aksara sebelum "MOVE" adalah backtick (bita &amp;H60), bukan ' +
         'apostrof (&amp;H27). Baris 1290 di berkas yang sama menulis ' +
         'perintah yang persis sama dengan apostrof yang benar.',
         'Backtick memang banyak dipakai di koleksi ini &mdash; tapi selalu ' +
         'DI DALAM string, sebagai tanda kutip pembuka: ' +
         '<code>PRINT "Press `E\' to quit"</code>. Baris 720 satu-satunya ' +
         'tempat ia berada di luar string, di posisi yang mengharuskannya ' +
         'jadi penanda komentar.',
         'GW-BASIC tidak mengenal backtick sebagai penanda komentar. Apa ' +
         'persisnya yang terjadi saat berkas ini dimuat &mdash; ditolak saat ' +
         'LOAD, atau galat sintaks saat baris 720 pertama kali dijalankan ' +
         '&mdash; belum diuji di mesin aslinya, dan ditandai untuk diperiksa.',
         'Yang pasti: di berkas ini, di salinan ini, aksaranya salah.'],
        ['Jalan pulang ke berkas yang tidak ada',
         '<code>1390 IF D$="n" OR D$="N" THEN CLS:RUN "MENU.PGM"</code>',
         'Tidak ada MENU.PGM di disketnya. Yang ada MENU.BAS.',
         'Ini varian ketiga dari cacat yang sama di koleksi ini: MENU yang ' +
         'disunting jadi komentar (15PUZZLE, SPACE), MENU yang namanya salah ' +
         '(di sini), dan MENU yang benar tapi programnya tidak pernah sampai ' +
         'ke sana. Tiga cara berbeda untuk kehilangan jalan pulang.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa ia bernama Spinout',
        isi: [
          'Berkasnya bernama BREAKOUT.BAS. Baris pertamanya berkata lain:',
          '<code>10 REM ibm pc spinout</code>',
          'Dan baris 140 mencetaknya ke layar: <i>Welcome to Spinout</i>. ' +
          'Nama berkas boleh delapan aksara; nama sebenarnya tidak muat.',
          'Bedanya bukan soal nama. Breakout memantulkan bola pada sudut ' +
          'yang bergantung tempat kena. Program ini melakukan sesuatu yang ' +
          'lain:',
          '<code>1240 MISS=(X-(PL+PR)/2)/(PL-PR)</code>',
          '<code>1260 SPIN=(SPIN*SKILL)+MISS*SKILL</code>',
          'Kena di pinggir pemukul tidak hanya mengubah arah &mdash; ia ' +
          'memberi <b>putaran</b>, dan putaran itu tersimpan di variabel ' +
          '<code>SPIN</code> yang bertahan sesudah pantulan selesai.',
          'Lalu tiap langkah bola:',
          '<code>760 VX=OVX-(SPIN*OVY*.05):VY=OVY+(SPIN*OVX*.05)+G</code>',
          'Arah geraknya diputar sedikit demi sedikit. Bolanya tidak ' +
          'bergerak lurus di antara pantulan &mdash; ia MELENGKUNG, seperti ' +
          'bola yang benar-benar berputar di udara.',
          'Dan putaran ini tidak menjaga lajunya. Bentuk sebenarnya butuh ' +
          'sinus dan kosinus; yang ditulis di sini bentuk hampirannya, dan ' +
          'hampiran itu <b>mengalikan laju bola dengan ' +
          '&radic;(1+(0,05&middot;SPIN)&sup2;) tiap langkah</b>. Diukur di ' +
          'penelusur pada <code>SPIN=5</code>: 6,375 &rarr; 6,571 &rarr; ' +
          '6,773 &rarr; 6,981 &mdash; naik 3,08 persen tiap langkah.',
          'Bola yang berputar kencang jadi makin cepat sampai baris 770-781 ' +
          'memotongnya di <code>MAXVX</code> dan <code>MAXVY</code>. Dua ' +
          'pemotongan itu bukan pemanis: tanpa keduanya, permainan ini ' +
          'meledak sendiri.',
          'Baris 761 membuat lengkungannya luruh: <code>SPIN=SPIN*.9999</code>. ' +
          'Sepersepuluh ribu tiap langkah &mdash; cukup lambat sehingga ' +
          'lengkungan sebuah pukulan bertahan sepanjang beberapa pantulan, ' +
          'cukup cepat sehingga tidak selamanya.',
          'Dan ada tiga tempat lain yang menyentuh SPIN, satu untuk tiap ' +
          'dinding:',
          '<code>1050 ... VY=VY+SPIN</code> &nbsp; (dinding kiri)',
          '<code>1060 ... VY=VY-SPIN</code> &nbsp; (dinding kanan)',
          '<code>1070 ... VX=VX-SPIN</code> &nbsp; (langit-langit)',
          'Bola yang berputar dan menyerempet dinding terlempar &mdash; ke ' +
          'arah yang bergantung dinding mana dan arah putarannya. Itu ' +
          'gesekan, ditulis sebagai satu penjumlahan.',
          'Seluruh mekanika ini &mdash; putaran, peluruhan, gesekan dinding, ' +
          'gravitasi &mdash; muat dalam tujuh baris yang tersebar di seluruh ' +
          'gelung utamanya. Satu Januari 1982.'
        ] },
      { judul: 'Bata yang bangkit lagi, dan variabel yang dicurinya',
        isi: [
          'Baris 960 tidak menolkan bata yang hancur:',
          '<code>960 BRICK[1+BX,1+BY]=-BRICK[1+BX,1+BY]</code>',
          'Ia menegatifkannya. Tandanya sekarang berarti "sudah hancur", ' +
          'besarnya tetap berarti "berapa nilainya". Dua keterangan di satu ' +
          'bilangan.',
          'Yang dibeli dengan itu terlihat di baris 1150-1200, yang jalan ' +
          'tiap kali bola kena pemukul:',
          '<code>1150 IF (RND(1)*2)>SKILL GOTO 1210</code>',
          '<code>1160 BX=INT(RND(1)*19.99):BY=INT(RND(1)*3.99):</code>',
          '<code>1170 IF BRICK[1+BX,1+BY]>0 GOTO 1210</code>',
          '<code>1180 BRICK[1+BX,1+BY]=-BRICK[1+BX,1+BY]</code>',
          '<code>1200 SCORE=SCORE-BRICK[1+BX,1+BY]</code>',
          'Ambil satu petak acak. Kalau batanya masih berdiri, tidak ada ' +
          'yang terjadi. Kalau sudah hancur, <b>bangkitkan lagi</b> ' +
          '&mdash; gambar ulang, dan potong nilainya dari skor pemain.',
          'Peluangnya <code>SKILL/2</code>. Pemain yang mengaku pandai ' +
          'dihukum lebih sering: pada tingkat 10, satu dari dua pukulan ' +
          'membangunkan sebuah bata.',
          'Itu bagian yang dirancang. Sekarang bagian yang tidak.',
          'Baris 1160 memakai <code>BX</code> dan <code>BY</code>. Kedua nama ' +
          'itu sudah punya arti di tempat lain: baris 800-830 mengisinya ' +
          'dengan petak bata yang sedang ditempati bola, dan baris 740 ' +
          'menyalinnya ke <code>OBX,OBY</code> di awal tiap langkah.',
          '<code>OBX</code> dan <code>OBY</code> dipakai baris 890-900 untuk ' +
          'memutuskan arah pantul: kalau nomor kolomnya berubah, bola masuk ' +
          'dari samping; kalau nomor barisnya berubah, dari atas.',
          'Sesudah satu pemulihan, keduanya menunjuk petak acak di seluruh ' +
          'dinding bata. Tabrakan berikutnya membandingkan petak yang benar ' +
          'dengan petak sembarang, dan hampir pasti menemukan KEDUANYA ' +
          'berbeda &mdash; jadi bola dipantulkan di kedua sumbu sekaligus, ' +
          'terlepas dari sisi mana yang sebenarnya disentuh.',
          'Diperiksa langsung: bola di petak <code>(10,2)</code>, satu kali ' +
          'jalan baris 1150-1200, dan <code>BX,BY</code> berakhir di ' +
          '<code>(18,1)</code>. Baris 740 menyalinnya apa adanya.',
          'Gejalanya: sesekali bola memantul balik ke arah datangnya ' +
          '&mdash; kedua sumbu dibalik sekaligus. Tidak sering, tidak ' +
          'dapat ditebak.',
          'Dan justru karena permainan ini SENGAJA tidak dapat ditebak ' +
          '&mdash; bolanya melengkung, batanya bangkit, gravitasinya ' +
          'menarik &mdash; cacat itu punya tempat sempurna untuk bersembunyi. ' +
          'Ia terlihat seperti bagian dari rancangannya.',
          'Perbaikannya dua nama variabel. Menemukannya butuh membaca ' +
          'delapan ratus baris di antara dua pemakaian yang tidak pernah ' +
          'muncul di layar yang sama.'
        ] }
    ]
  };
})(window);
