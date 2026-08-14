/* ===========================================================================
   BOWLING.js — porting minimalis BOWLING.BAS sebagai tabel baris.

   Tujuh puluh lima baris, dan tiga gagasan yang masing-masing layak
   ditelusuri sendiri.

   (1) SEPULUH PIN DIGAMBAR DENGAN KODE GERAK KURSOR.

       1001 DATA 234,31,29,29,234,31,29,29,234,28
       1002 DATA 234,31,29,29,29,29,234,28,234,31
       1003 DATA 29,29,234,28,234,31,29,29,234,31,234

       234 adalah pin (Ω di CP437). 28, 29, 31 BUKAN gambar — ia perintah:
       kanan, kiri, bawah. Baris 400 mencetak ketiga puluh satu bita itu
       berurutan, dan hasilnya segitiga sepuluh pin. Sebuah program menggambar
       yang disimpan sebagai data.

   (2) LAYAR SEBAGAI PETA TABRAKAN, LAGI.

       570 IF SCREEN(V,H)=234 THEN J=J+1 ELSE 610

       Tidak ada larik pin. Bola menyusuri lajurnya dan MEMBACA LAYAR; kalau
       ketemu kode 234, itu pin. Yang roboh dihapus dari layar, dan itulah
       satu-satunya catatan bahwa ia sudah roboh. Gagasan yang sama dengan
       SERPENT.BAS, dipakai untuk hal yang sama sekali lain.

   (3) ARITMETIKA ATAS NILAI BENAR/SALAH.

       470 LOCATE 14+(Z9<2)*2, 31+(Z9/2=INT(Z9/2))*20

       Di BASIC, perbandingan bernilai -1 (benar) atau 0 (salah). Baris ini
       memakainya sebagai ANGKA untuk menempatkan empat kotak skor dalam kisi
       2x2, tanpa satu pun IF. Baris 630 memakai trik yang sama untuk MENUKAR
       warna depan dan belakang.

   Dan di tengah semuanya ada mesin keadaan penilaian bowling yang sungguhan
   (baris 450, 680-770) — strike, spare, dan bonusnya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom. Lajur dan rak
     pinnya menempati separuh kiri layar. Batas geraknya diperiksa program
     sendiri (`WHILE H<40`), jadi permainannya berjalan benar.
   - `SOUND` diam.
   - Gelung tunda `FOR I=1 TO DIFLVL:NEXT` habis seketika, jadi bidikannya
     bergerak secepat penelusuran. Pakai penggeser laju di atas layar.
   - `POKE 1047,64` (Caps Lock menyala) tidak ditiru; penelusur menerima
     huruf kecil maupun besar.
   - `WHILE+` di berkas aslinya diperlakukan sebagai `WHILE` biasa. Bentuk
     itu muncul di delapan berkas koleksi ini — artefak alat yang mengubah
     .BAS ter-token jadi teks, bukan sesuatu yang diketik penulisnya.
   =========================================================================== */

(function (global) {
  'use strict';

  var PIN = 234, GARIS = 196, TEGAK = 179;

  /* Perbandingan di BASIC bernilai -1 (benar) atau 0 (salah), dan program ini
     memakai nilainya sebagai ANGKA. */
  function bas(uji) { return uji ? -1 : 0; }

  /* Gelung `WHILE INKEY$="" ... WEND` membentang baris 510-540. `WEND` ada di
     penggal PERTAMA baris 540, dan pernyataan sesudahnya di penggal kedua —
     tempat yang tidak bisa dituju `GOTO`. Jadi keluarnya dicatat di sini. */
  var lepasBidikan = false;

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.dim('NA$', 3); m.dim('S()', 3); m.dim('T()', 3);
        m.warna(3, 0);
      } },
    { baris: 20, jalan: function (m) { m.locate(1, 1, 0); m.cls(); } },
    { baris: 30, jalan: function (m) {
        m.locate(8, 12); m.cetak('BOWLING CHAMP!!'); m.barisBaru();
      } },
    { baris: 40, jalan: function (m) {
        m.locate(13, 7); m.cetak('How many bowlers? (1-4):'); m.barisBaru();
      } },
    { baris: 50, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(50);
      } },
    { baris: 60, jalan: function (m) {
        var k = m.v['A$'].charCodeAt(0);
        if (k < 49 || k > 52) m.lompat(50);
        else m.v.A = k - 48;
      } },
    { baris: 70, bagian: [
        function (m) { m.untuk('I', 1, m.v.A, 1, 95); },
        function (m) {
          m.locate(15 + m.v.I, 8);
          m.cetak('Bowler ' + m.v.I + ' ');
        }
      ] },
    { baris: 80, jalan: function (m) {
        m.locate(null, 16); m.cetak("'s name:");
      } },
    { baris: 90, bagian: [
        function (m) { m.masukan('A$', '? '); },
        function (m) { m.v['NA$'][m.v.I - 1] = m.v['A$'].slice(0, 8); },
        function (m) { m.lanjutkan('I'); }
      ] },
    { baris: 95, jalan: function (m) {
        m.cls();
        m.locate(13, 7); m.cetak('Difficulty level (0-60).'); m.barisBaru();
        m.locate(14, 7); m.cetak('60=extremely easy ; 0=impossible');
        m.barisBaru();
      } },
    { baris: 100, bagian: [
        function (m) { m.locate(16, 9); },
        function (m) {
          m.masukan(function (s) { m.v.DIFLVL = parseFloat(s) || 0; }, '? ');
        }
      ] },

    /* --- 110-190: papan skor --------------------------------------------- */
    { baris: 110, jalan: function (m) {
        m.cls(); m.warna(15, null);
        m.locate(1, 10);
        m.cetak('1  2  3  4  5  6  7  8  9  10'); m.barisBaru();
      } },
    { baris: 120, jalan: function (m) {
        m.locate(2, 10);
        for (m.v.J = 1; m.v.J <= 31; m.v.J++) m.cetak(m.chr(GARIS));
      } },
    { baris: 130, bagian: [
        function (m) { m.untuk('I', 1, m.v.A, 1, 160); },
        function (m) {
          m.locate(2 * m.v.I + 1, 1); m.warna(m.v.I + 1, null);
          m.cetak(m.v['NA$'][m.v.I - 1]);
          m.locate(null, 12);
        }
      ] },
    { baris: 140, jalan: function (m) {
        m.warna(15, null);
        for (m.v.J = 12; m.v.J <= 36; m.v.J += 3) m.cetak(m.chr(TEGAK) + '  ');
      } },
    { baris: 150, bagian: [
        function (m) {
          m.locate(2 * m.v.I + 2, 10);
          for (m.v.J = 1; m.v.J <= 31; m.v.J++) m.cetak(m.chr(GARIS));
        },
        function (m) { m.lanjutkan('I'); }
      ] },
    /* 160-170 empat kotak skor total, disusun dua-dua. Perhatikan `IF I=2`
       yang memindahkan barisnya — dan bandingkan dengan baris 470, yang
       melakukan hal yang sama tanpa satu pun IF. */
    { baris: 160, bagian: [
        function (m) { m.locate(12, 1); },
        function (m) { m.untuk('I', 0, m.v.A - 1, 1, 180); },
        function (m) { if (m.v.I === 2) m.locate(14, 1); }
      ] },
    { baris: 170, bagian: [
        function (m) {
          m.warna(m.v.I + 2, null);
          var nama = m.v['NA$'][m.v.I];
          m.cetak(nama + ':'); m.spc(19 - nama.length);
        },
        function (m) { m.lanjutkan('I'); },
        function (m) { m.warna(15, null); }
      ] },
    { baris: 180, jalan: function (m) {
        m.locate(15, 1);
        for (m.v.I = 1; m.v.I <= 39; m.v.I++) m.cetak(m.chr(GARIS));
      } },
    { baris: 190, jalan: function (m) {
        m.locate(25, 1);
        for (m.v.I = 1; m.v.I <= 39; m.v.I++) m.cetak(m.chr(GARIS));
      } },
    /* 210 `S(I)=1` — keadaan awal mesin penilaian tiap pemain. */
    { baris: 210, jalan: function (m) {
        for (m.v.I = 0; m.v.I <= m.v.A - 1; m.v.I++) m.v['S()'][m.v.I] = 1;
      } },

    /* --- 230-370: sepuluh babak, tiap pemain ------------------------------ */
    { baris: 230, bagian: [
        function (m) { m.untuk('Q', 1, 10, 1, 280); },
        function (m) { m.untuk('Z9', 0, m.v.A - 1, 1, 280); }
      ] },
    { baris: 240, bagian: [
        function (m) { m.warna(null, m.v.Z9 + 2); },
        function (m) {
          for (m.v.I = 16; m.v.I <= 24; m.v.I++) {
            m.locate(m.v.I, 1); m.spc(39); m.barisBaru();
          }
        }
      ] },
    { baris: 250, bagian: [
        function (m) { m.v.B1 = 0; },
        function (m) { m.gosub(390); }
      ] },
    { baris: 260, jalan: function (m) {
        if (m.v.J1 !== 10) { m.v.B1 = 1; m.gosub(430); }
      } },
    /* 270 babak kesepuluh: keadaan mesin penilaian menentukan berapa bola
       bonus yang didapat. */
    { baris: 270, jalan: function (m) {
        if (m.v.Q !== 10) return;
        var ke = [280, 310, 310, 280, 340][m.v.S - 1];
        if (ke) m.lompat(ke);
      } },
    { baris: 280, bagian: [
        function (m) { m.lanjutkan('Z9'); },
        function (m) { m.lanjutkan('Q'); },
        function (m) {
          m.locate(16, 10); m.cetak('Play again? (y/n):'); m.barisBaru();
        }
      ] },
    { baris: 290, bagian: [
        function (m) {
          m.v['A$'] = m.inkey();
          if (m.v['A$'] === '') m.tunggu();
        },
        function (m) {
          if (m.v['A$'].toUpperCase() === 'Y') m.jalankan('BOWLING');
          else { m.warna(7, 0); m.jalankan('MENU'); }
        }
      ] },
    { baris: 310, jalan: function (m) {
        m.locate(20, 1);
        m.cetak('Take two more balls, ' + m.v['NA$'][m.v.Z9]);
      } },
    { baris: 320, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 2000; m.v.I++) { /* jeda */ }
        m.locate(null, 1); m.spc(29); m.barisBaru();
      } },
    { baris: 330, bagian: [
        function (m) { m.v['S()'][m.v.Z9] = m.v.S - 1; m.v.B1 = 1; },
        function (m) { m.gosub(390); },
        function (m) { if (m.v.J !== 10) m.lompat(370); else m.lompat(360); }
      ] },
    { baris: 340, jalan: function (m) {
        m.locate(20, 1);
        m.cetak('Take one more ball, ' + m.v['NA$'][m.v.Z9]);
      } },
    { baris: 350, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 2200; m.v.I++) { /* jeda */ }
        m.locate(null, 1); m.spc(28); m.barisBaru();
      } },
    { baris: 360, bagian: [
        function (m) { m.v['S()'][m.v.Z9] = 1; m.v.B1 = 2; },
        function (m) { m.gosub(390); },
        function (m) { m.lompat(280); }
      ] },
    { baris: 370, bagian: [
        function (m) { m.v['S()'][m.v.Z9] = 1; m.v.B1 = 2; },
        function (m) { m.gosub(430); },
        function (m) { m.lompat(280); }
      ] },

    /* --- 390-430: pasang rak pin, lalu lempar ----------------------------- */
    { baris: 390, jalan: function (m) { m.warna(15, null); m.locate(17, 39); } },
    /* 400 tiga puluh satu bita dicetak berurutan: pin (234) dan gerak kursor
       (28 kanan, 29 kiri, 31 bawah). `RESTORE` di ujungnya supaya raknya bisa
       dipasang lagi lemparan berikutnya. */
    { baris: 400, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 31; m.v.I++) {
          m.v.PC = m.baca();
          m.cetak(m.chr(m.v.PC));
        }
        m.ulangData();
      } },
    /* 410 `PS=1=1` — cara menulis "PS := benar". Nilainya -1. */
    { baris: 410, jalan: function (m) {
        m.v.PS = bas(true); m.v.J1 = 0; m.lompat(440);
      } },
    { baris: 430, jalan: function (m) { m.v.PS = 0; } },
    { baris: 440, bagian: [
        function (m) { m.gosub(500); },
        function (m) {
          m.v.T = m.v['T()'][m.v.Z9]; m.v.S = m.v['S()'][m.v.Z9];
          m.v.T = m.v.T + m.v.J;
        }
      ] },
    /* 450 MESIN KEADAAN PENILAIAN. `S` menyimpan "sedang menunggu bonus apa",
       dan tiap keadaan punya subrutinnya sendiri. */
    { baris: 450, jalan: function (m) {
        var ke = [680, 700, 720, 740, 760][m.v['S()'][m.v.Z9] - 1];
        if (ke) m.gosub(ke);
      } },
    { baris: 460, jalan: function (m) {
        m.v['T()'][m.v.Z9] = m.v.T; m.v['S()'][m.v.Z9] = m.v.S;
        m.warna(m.v.Z9 + 2, 0);
      } },
    /* 470 EMPAT KOTAK SKOR DALAM KISI 2x2, TANPA SATU PUN IF.
       (Z9<2) bernilai -1 untuk pemain 0 dan 1, jadi 14+(-1)*2 = baris 12.
       (Z9/2=INT(Z9/2)) bernilai -1 untuk pemain genap, jadi 31+(-1)*20 =
       kolom 11. Perbandingan dipakai sebagai angka. */
    { baris: 470, jalan: function (m) {
        var Z9 = m.v.Z9;
        m.locate(14 + bas(Z9 < 2) * 2,
                 31 + bas(Z9 / 2 === Math.trunc(Z9 / 2)) * 20);
        m.cetak(String(m.v['T()'][Z9]) + ' '); m.barisBaru();
      } },
    { baris: 480, jalan: function (m) { m.warna(0, m.v.Z9 + 2); m.kembali(); } },

    /* --- 500-540: membidik ------------------------------------------------ */
    { baris: 500, jalan: function (m) {
        m.v.H = 1; m.v.V = 24; m.v.D = -1;
        m.warna(0, m.v.Z9 + 2);
        lepasBidikan = false;
      } },
    /* 510 `WHILE INKEY$=""` — bola bidikan naik-turun di kolom 1 sampai ada
       tombol ditekan. Makin besar DIFLVL makin lambat, jadi makin mudah
       membidik: itulah seluruh isi "tingkat kesulitan". */
    { baris: 510, bagian: [
        function (m) {
          if (m.inkey() !== '') { lepasBidikan = true; m.lompat(540); }
        },
        function (m) { m.locate(m.v.V, m.v.H); m.cetak(' '); }
      ] },
    { baris: 520, jalan: function (m) {
        m.v.V = m.v.V + m.v.D;
        m.locate(m.v.V, m.v.H); m.cetak('O');
      } },
    { baris: 530, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= m.v.DIFLVL; m.v.I++) { /* jeda */ }
        if (m.v.V === 24 || m.v.V === 16) m.v.D = -m.v.D;
      } },
    { baris: 540, bagian: [
        function (m) { if (!lepasBidikan) m.lompat(510); },
        function (m) { m.untuk('H', 2, 35, 1, 560); },
        function (m) {
          m.locate(m.v.V, m.v.H - 1); m.cetak(' O');
          m.v['A$'] = m.inkey();
        }
      ] },
    /* 545 tombol `]` menahan bolanya di tengah lajur. */
    { baris: 545, jalan: function (m) {
        if (m.v['A$'] === ']' && m.inkey() === '') m.tunggu();
      } },
    { baris: 550, bagian: [
        function (m) { /* SOUND: diam */ },
        function (m) { m.lanjutkan('H'); }
      ] },

    /* --- 560-610: menabrak pin ------------------------------------------- */
    { baris: 560, bagian: [
        function (m) { m.v.J = 0; },
        function (m) { if (!(m.v.H < 40)) m.lompat(620); }
      ] },
    /* 570 SELURUH deteksi tabrakan: baca layar di depan bola. */
    { baris: 570, jalan: function (m) {
        if (m.layarAksara(m.v.V, m.v.H) === PIN) m.v.J = m.v.J + 1;
        else m.lompat(610);
      } },
    /* 580-600 pin yang roboh menjatuhkan tetangganya SECARA DIAGONAL, ke atas
       dan ke bawah, selama masih ketemu pin. Itu seluruh "fisika"-nya. */
    { baris: 580, bagian: [
        function (m) { m.untuk('D', -1, 1, 2, 610); },
        function (m) { m.v.X1 = m.v.V; },
        function (m) { m.v.X2 = m.v.H; }
      ] },
    { baris: 590, jalan: function (m) {
        m.v.X1 = m.v.X1 + m.v.D; m.v.X2 = m.v.X2 + 1;
        if (m.layarAksara(m.v.X1, m.v.X2) === PIN) {
          m.locate(m.v.X1, m.v.X2); m.cetak(' ');
          m.v.J = m.v.J + 1;
          m.lompat(590);
        }
      } },
    { baris: 600, jalan: function (m) { m.lanjutkan('D'); } },
    { baris: 610, bagian: [
        function (m) {
          m.locate(m.v.V, m.v.H - 1); m.cetak(' O');
          m.v.H = m.v.H + 1;
        },
        function (m) { if (m.v.H < 40) m.lompat(570); }
      ] },

    /* --- 620-660: catat hasilnya di papan skor ---------------------------- */
    { baris: 620, jalan: function (m) { m.v.J1 = m.v.J1 + m.v.J; } },
    /* 630 warna depan dan belakang DITUKAR menurut bola keberapa, lagi-lagi
       dengan aritmetika atas nilai benar/salah. Bola pertama tampil terang
       di atas gelap; bola kedua kebalikannya. */
    { baris: 630, jalan: function (m) {
        m.locate(2 * m.v.Z9 + 3, 7 + 3 * m.v.Q + m.v.B1);
        m.warna(-(2 + m.v.Z9) * bas(m.v.B1 === 0),
                -(2 + m.v.Z9) * bas(m.v.B1 !== 0));
        m.v.G = m.v.J + 48;
      } },
    /* 640 sepuluh pin roboh: `X` kalau sekali lempar (strike), `/` kalau dua
       kali (spare). Kode 88 dan 47. */
    { baris: 640, jalan: function (m) {
        if (m.v.J1 === 10) m.v.G = m.v.PS ? 88 : 47;
      } },
    { baris: 650, jalan: function (m) {
        m.cetak(m.chr(m.v.G)); m.barisBaru();
        m.warna(0, 2 + m.v.Z9);
      } },
    { baris: 660, jalan: function (m) {
        m.locate(m.v.V, m.v.H - 1); m.cetak(' ');
        m.kembali();
      } },

    /* --- 680-770: mesin keadaan penilaian --------------------------------- *
       S=1 biasa            S=2 strike, menunggu dua lemparan berikutnya
       S=3 dua strike       S=4 spare / bonus lemparan kedua
       S=5 selesai bonus                                                     */
    { baris: 680, jalan: function (m) {
        if (m.v.J1 === 10) m.v.S = m.v.PS ? 2 : 5;
      } },
    { baris: 690, jalan: function (m) { m.kembali(); } },
    { baris: 700, jalan: function (m) {
        m.v.T = m.v.T + m.v.J;
        m.v.S = (m.v.J === 10) ? 3 : 4;
      } },
    { baris: 710, jalan: function (m) { m.kembali(); } },
    { baris: 720, jalan: function (m) {
        m.v.T = m.v.T + m.v.J * 2;
        if (m.v.J !== 10) m.v.S = 4;
      } },
    { baris: 730, jalan: function (m) { m.kembali(); } },
    { baris: 740, jalan: function (m) {
        m.v.T = m.v.T + m.v.J;
        m.v.S = (m.v.J1 === 10) ? 5 : 1;
      } },
    { baris: 750, jalan: function (m) { m.kembali(); } },
    { baris: 760, jalan: function (m) {
        m.v.T = m.v.T + m.v.J;
        m.v.S = (m.v.J === 10) ? 2 : 1;
      } },
    { baris: 770, jalan: function (m) { m.kembali(); } },

    { baris: 1001, jalan: function () { } },
    { baris: 1002, jalan: function () { } },
    { baris: 1003, jalan: function () { } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BOWLING'] = {
    nama: 'BOWLING',
    judul: 'Bowling Champ (pin dari kode gerak kursor)',
    sumber: 'BOWLING',
    berkas: 'run/BOWLING.BAS',
    tabel: tabel,
    data: [
      234, 31, 29, 29, 234, 31, 29, 29, 234, 28,
      234, 31, 29, 29, 29, 29, 234, 28, 234, 31,
      29, 29, 234, 28, 234, 31, 29, 29, 234, 31, 234
    ],

    arsitektur: {
      judul: 'Alur BOWLING.BAS',
      simpul: [
        { id: 'siap', baris: '10-100', jenis: 'mulai',
          teks: ['Berapa pemain, namanya,', 'tingkat kesulitan'] },
        { id: 'papan', baris: '110-210',
          teks: ['Gambar papan skor', 'dan empat kotak total'] },
        { id: 'babak', baris: '230-240',
          teks: ['Sepuluh babak,', 'tiap pemain bergiliran'] },
        { id: 'rak', baris: '390-400', jenis: 'subrutin',
          teks: ['Pasang sepuluh pin dari', 'DATA gerak kursor'] },
        { id: 'bidik', baris: '500-540',
          teks: ['Bola naik-turun;', 'tombol melepasnya'] },
        { id: 'tabrak', baris: '560-610', jenis: 'putusan',
          teks: ['BACA LAYAR: kode 234?', 'Pin roboh, tetangga ikut'] },
        { id: 'nilai', baris: '450, 680-770', jenis: 'subrutin',
          teks: ['Mesin keadaan:', 'strike, spare, bonusnya'] },
        { id: 'catat', baris: '620-660',
          teks: ['Tulis X, /, atau angka', 'di kotak babaknya'] },
        { id: 'bonus', baris: '270, 310-370',
          teks: ['Babak 10: satu atau dua', 'bola bonus, tergantung keadaan'] },
        { id: 'lagi', baris: '280-290', jenis: 'keluar',
          teks: ['Main lagi? atau', 'kembali ke menu'] }
      ],
      panah: [
        { dari: 'siap', ke: 'papan' },
        { dari: 'papan', ke: 'babak' },
        { dari: 'babak', ke: 'rak' },
        { dari: 'rak', ke: 'bidik' },
        { dari: 'bidik', ke: 'tabrak' },
        { dari: 'tabrak', ke: 'nilai' },
        { dari: 'nilai', ke: 'catat' },
        { dari: 'catat', ke: 'babak', label: 'giliran berikutnya' },
        { dari: 'catat', ke: 'bonus', label: 'babak 10' },
        { dari: 'bonus', ke: 'rak', label: 'bola bonus' },
        { dari: 'bonus', ke: 'lagi' },
        { dari: 'lagi', ke: 'siap', label: 'Y' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Mesin keadaan penilaian bowling',
        keterangan: 'Nilai bowling tidak bisa dihitung saat itu juga: strike ' +
          'bernilai 10 <b>ditambah dua lemparan berikutnya</b>, spare 10 ' +
          'ditambah satu. Jadi <code>S(pemain)</code> menyimpan "sedang ' +
          'menunggu bonus apa", dan baris 450 memilih subrutin menurut ' +
          'keadaan itu: <code>ON S(Z9) GOSUB 680,700,720,740,760</code>.',
        simpul: [
          { id: 'biasa', baris: '680', jenis: 'mulai',
            teks: ['S=1 biasa', 'belum ada bonus tertunda'] },
          { id: 'strike', baris: '700', jenis: 'keadaan',
            teks: ['S=2 strike', 'menunggu dua lemparan'] },
          { id: 'dobel', baris: '720', jenis: 'keadaan',
            teks: ['S=3 dua strike beruntun', 'lemparan berikut dihitung 2x'] },
          { id: 'spare', baris: '740', jenis: 'keadaan',
            teks: ['S=4 menunggu', 'satu lemparan lagi'] },
          { id: 'usai', baris: '760', jenis: 'keluar',
            teks: ['S=5 bonus selesai'] }
        ],
        panah: [
          { dari: 'biasa', ke: 'strike', label: 'sepuluh pin, bola pertama' },
          { dari: 'biasa', ke: 'usai', label: 'sepuluh pin, bola kedua (spare)' },
          { dari: 'strike', ke: 'dobel', label: 'strike lagi' },
          { dari: 'strike', ke: 'spare', label: 'kurang dari sepuluh' },
          { dari: 'dobel', ke: 'spare', label: 'kurang dari sepuluh' },
          { dari: 'spare', ke: 'usai', label: 'sepuluh pin' },
          { dari: 'spare', ke: 'biasa', label: 'kurang dari sepuluh' },
          { dari: 'usai', ke: 'strike', label: 'strike' },
          { dari: 'usai', ke: 'biasa', label: 'kurang dari sepuluh' }
        ]
      }
    ],

    pseudokode: [
      { baris: 400, tingkat: 0, teks: 'gambar rak pin: <b>31 bita DATA</b>, sebagian pin, sebagian <b>gerak kursor</b>' },
      { baris: 500, tingkat: 0, teks: 'bola bidikan naik-turun di kolom 1; makin besar <code>DIFLVL</code> makin lambat' },
      { baris: 540, tingkat: 0, teks: 'tombol ditekan &rarr; bola menggelinding ke kanan' },
      { baris: 570, tingkat: 1, teks: '<code>SCREEN(V,H)=234</code>? <b>baca layar</b>, bukan larik &mdash; itu pin' },
      { baris: 580, tingkat: 2, teks: 'pin yang roboh menjatuhkan tetangganya <b>diagonal</b>, selama masih ketemu pin' },
      { baris: 450, tingkat: 0, teks: '<code>ON S(Z9) GOSUB &hellip;</code> &mdash; <b>mesin keadaan</b> strike/spare' },
      { baris: 640, tingkat: 1, teks: 'sepuluh pin: <code>X</code> kalau sekali lempar, <code>/</code> kalau dua kali' },
      { baris: 470, tingkat: 0, teks: 'empat kotak skor dalam kisi 2&times;2 &mdash; <b>tanpa satu pun <code>IF</code></b>' },
      { baris: 270, tingkat: 0, teks: 'babak 10: keadaan menentukan satu atau dua bola bonus' }
    ],

    perintahAsli: 'run\\BOWLING.bat',
    catatanAsli: 'Di DOSBox-X layarnya 40 kolom, ada bunyi bola dan pin, dan ' +
      'bidikannya bergerak sesuai tingkat kesulitan yang dipilih.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom. ' +
      'Lajur dan rak pin menempati separuh kiri layar. Batas geraknya ' +
      'diperiksa program sendiri (<code>WHILE H&lt;40</code>), jadi ' +
      'permainannya berjalan benar.',

      '<b><code>SOUND</code> diam</b>, jadi bunyi bola menggelinding dan pin ' +
      'roboh tidak terdengar.',

      '<b>Gelung tunda habis seketika</b>, jadi bidikan bergerak secepat ' +
      'penelusuran. Pakai penggeser laju di atas layar untuk memperlambatnya.',

      '<b><code>POKE 1047,64</code> tidak ditiru.</b> Alamat itu bendera ' +
      'papan tombol BIOS, dan 64 menyalakan Caps Lock &mdash; supaya ' +
      'perbandingan <code>A$="Y"</code> di baris 290 selalu cocok. Penelusur ' +
      'menerima huruf kecil maupun besar.',

      '<b><code>WHILE+</code> diperlakukan sebagai <code>WHILE</code> biasa.</b> ' +
      'Bentuk itu muncul di delapan berkas koleksi ini &mdash; artefak alat ' +
      'yang mengubah .BAS ter-token jadi teks, bukan sesuatu yang diketik ' +
      'penulisnya.'
    ],

    pelajaran: {
      ringkas: 'Sepuluh pin digambar dengan kode gerak kursor, tabrakan dibaca ' +
        'dari layar, dan penilaiannya mesin keadaan lima keadaan &mdash; ' +
        'seluruhnya dalam 75 baris.',
      pelajari: [
        ['Program menggambar yang disimpan sebagai data',
         'Baris 1001&ndash;1003 berisi 31 bita. Sebagian pin (kode 234), ' +
         'sebagian <b>perintah gerak kursor</b>: 28 kanan, 29 kiri, 31 bawah. ' +
         'Baris 400 mencetak semuanya berurutan, dan hasilnya segitiga ' +
         'sepuluh pin. Bukan gambar yang disimpan, melainkan <b>langkah-langkah ' +
         'menggambarnya</b> &mdash; nenek moyang langsung dari urutan escape ' +
         'terminal dan dari format vektor.'],
        ['Aritmetika atas nilai benar/salah',
         'Di BASIC, perbandingan bernilai <b>&minus;1</b> (benar) atau ' +
         '<b>0</b> (salah), dan keduanya bilangan biasa. Baris 470 memakainya ' +
         'untuk menempatkan empat kotak skor dalam kisi 2&times;2 tanpa satu ' +
         'pun <code>IF</code>: <code>14+(Z9&lt;2)*2</code> memberi baris 12 ' +
         'atau 14, <code>31+(Z9/2=INT(Z9/2))*20</code> memberi kolom 11 atau ' +
         '31. Baris 630 memakai trik yang sama untuk <b>menukar</b> warna ' +
         'depan dan belakang.'],
        ['Penilaian bowling sebagai mesin keadaan',
         'Nilai bowling tidak bisa dihitung saat itu juga: strike bernilai 10 ' +
         'ditambah <b>dua lemparan berikutnya</b>, spare 10 ditambah satu. ' +
         'Jadi <code>S(pemain)</code> menyimpan "sedang menunggu bonus apa", ' +
         'dan <code>ON S(Z9) GOSUB 680,700,720,740,760</code> memilih ' +
         'perlakuannya. Lima keadaan, lima subrutin dua baris. Lihat diagram ' +
         'keadaan di atas.'],
        ['Layar sebagai peta tabrakan',
         'Tidak ada larik pin. Bola menyusuri lajurnya, membaca ' +
         '<code>SCREEN(V,H)</code>, dan kode 234 berarti pin. Yang roboh ' +
         'dihapus dari layar &mdash; dan itulah satu-satunya catatan bahwa ia ' +
         'sudah roboh. Gagasan yang sama dengan SERPENT.BAS, dipakai untuk ' +
         'hal yang sama sekali lain.'],
        ['Tingkat kesulitan yang cuma sebuah jeda',
         '<code>DIFLVL</code> dipakai di satu tempat: ' +
         '<code>FOR I=1 TO DIFLVL:NEXT</code> di baris 530. Makin besar, ' +
         'makin lambat bidikannya bergerak, makin mudah mengenainya. ' +
         '<b>Seluruh "tingkat kesulitan" adalah satu gelung kosong.</b>']
      ],
      hindari: [
        ['Satu huruf untuk dua hal',
         '<code>S</code> adalah larik keadaan penilaian <i>dan</i> variabel ' +
         'biasa yang menampung keadaan pemain yang sedang jalan. Baris 330 ' +
         'menulis <code>S(Z9)=S-1</code> &mdash; larik diisi dari skalarnya. ' +
         'Sama untuk <code>T</code>, <code>J</code>/<code>J1</code>, dan ' +
         '<code>D</code> yang dipakai sebagai arah bidikan <b>dan</b> sebagai ' +
         'pencacah gelung diagonal di baris 580.'],
        ['Rak pin yang dipasang ulang tiap lemparan',
         'Baris 390&ndash;400 dipanggil untuk <b>setiap</b> lemparan, termasuk ' +
         'bola kedua. Yang membuatnya tetap benar cuma baris 430, yang ' +
         'melewati pemasangan rak untuk bola kedua. Kalau baris 430 ikut ' +
         'memanggil 400, pin yang sudah roboh akan berdiri lagi &mdash; dan ' +
         'tidak ada apa pun yang mencegahnya selain letak nomor barisnya.'],
        ['Nomor baris sebagai satu-satunya penanda alur',
         'Baris 270 <code>ON S GOTO 280,310,310,280,340</code> melompat ke ' +
         'lima tempat berbeda menurut keadaan, dan dua di antaranya sama. ' +
         'Untuk memahaminya, kelima tujuan itu harus dibaca satu per satu ' +
         '&mdash; tidak ada nama, tidak ada penjelasan.']
      ]
    },

    penjelasan: [
      { judul: 'Sepuluh pin yang digambar oleh datanya sendiri',
        isi: [
          'Baris 400 pendek sekali:',
          '<code>400 FOR I=1 TO 31:READ PC:PRINT CHR$(PC);:NEXT:RESTORE</code>',
          'Baca tiga puluh satu angka, cetak sebagai aksara. Selesai.',
          'Yang membuatnya menggambar segitiga adalah isi angkanya. Kode 234 ' +
          'adalah <b>&Omega;</b> di CP437 &mdash; sebuah pin. Tapi 28, 29, dan ' +
          '31 bukan gambar sama sekali: di GW-BASIC, mencetaknya ' +
          '<b>memindahkan kursor</b> ke kanan, kiri, dan bawah.',
          'Jadi urutannya terbaca sebagai perintah: pin, turun, kiri, kiri, ' +
          'pin, turun, kiri, kiri, pin, kanan&hellip; Sepuluh pin, tersusun ' +
          'sebagai segitiga, dari satu string bita.',
          'Ini bentuk paling awal dari sesuatu yang masih ada di mana-mana: ' +
          'menyimpan <b>langkah-langkah menggambar</b>, bukan gambarnya. ' +
          'Urutan escape terminal (<code>\\033[2J</code>), perintah ' +
          '<code>DRAW</code> di BASIC grafik, jalur SVG (<code>M 10 10 L 20 ' +
          '20</code>) &mdash; semuanya prinsip yang sama.',
          'Dan <code>RESTORE</code> di ujung baris 400 yang membuatnya bisa ' +
          'dipakai lagi: penunjuk <code>DATA</code> dikembalikan ke awal, jadi ' +
          'rak yang sama bisa dipasang lemparan berikutnya.'
        ] },
      { judul: 'Kenapa penilaian bowling butuh mesin keadaan',
        isi: [
          'Kalau semua lemparan bernilai jumlah pinnya, penilaian bowling ' +
          'cuma penjumlahan. Yang membuatnya rumit dua aturan:',
          '<b>Strike</b> (sepuluh pin di bola pertama) bernilai 10 ' +
          '<b>ditambah dua lemparan berikutnya</b>. <b>Spare</b> (sepuluh pin ' +
          'dalam dua bola) bernilai 10 ditambah <b>satu</b> lemparan ' +
          'berikutnya.',
          'Artinya nilai sebuah babak <b>belum bisa diketahui saat babak itu ' +
          'selesai</b>. Ia bergantung pada apa yang belum terjadi.',
          'Cara program ini menanganinya: <code>S(pemain)</code> menyimpan ' +
          '"sedang menunggu bonus apa". Lima nilai, lima subrutin dua baris ' +
          'di 680&ndash;770, dan satu baris yang memilih di antaranya:',
          '<code>450 ON S(Z9) GOSUB 680,700,720,740,760</code>',
          'Tiap subrutin mengerjakan dua hal: menambahkan nilai lemparan ini ' +
          'dengan bobot yang benar, dan <b>menentukan keadaan berikutnya</b>. ' +
          'Keadaan 3 (dua strike beruntun) mengalikan lemparan dengan dua, ' +
          'karena ia jadi bonus untuk dua babak sekaligus.',
          'Ini mesin keadaan yang sungguhan, ditulis dengan cara paling ' +
          'sederhana yang mungkin: <b>sebuah angka, dan sebuah tabel lompat</b>. ' +
          'Tidak ada nama keadaan, tidak ada penjelasan, dan tidak ada ' +
          'diagram &mdash; sampai halaman ini menggambarnya.'
        ] }
    ]
  };
})(window);
