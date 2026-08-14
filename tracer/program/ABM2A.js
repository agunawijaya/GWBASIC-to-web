/* ===========================================================================
   ABM2A.js — porting minimalis ABM2A.BAS sebagai tabel baris.

       10 REM  ABM 2 WRITTEN BY ED DAVIS...THIS VERSION 7/18/82

   Missile Command untuk IBM PC. Dua ratus tiga puluh satu baris, dan enam
   kota di pantai timur yang bernama BTV, FSH, HPN, MAN, RAL, BOC — kode
   bandara Burlington, Fishkill, White Plains, Manhattan, Raleigh, Boca Raton.
   Baris 1070 mengatakannya terang-terangan: yang dibela adalah lokasi IBM.

   YANG PALING LAYAK DILIHAT: DRAW MEMANGGIL DIRINYA SENDIRI.

       950 PSET(0,180):DRAW "R32;X"+VARPTR$(CT2$)+"R16;X"+VARPTR$(CT$)
       960 DRAW "R16;X"+VARPTR$(CT3$)+"R5U10R6D10R5;X"+VARPTR$(CT$)+...

   Perintah `X` di dalam bahasa DRAW berarti: JALANKAN STRING LAIN sebagai
   perintah gambar. Yang disisipkan bukan isi stringnya melainkan ALAMATNYA —
   itulah gunanya `VARPTR$`.

   Tiga bentuk kota disimpan sekali di baris 920-940, lalu enam kota digambar
   dengan memanggil ketiganya bergantian, diselingi `R16` untuk berpindah.
   Prosedur, argumen, dan pemanggilan — di dalam sebuah string.

   YANG KEDUA: SATU LARIK, TUJUH ARTI.

       40 DIM M(6,15)

   Enam belas rudal, dan tujuh baris larik yang masing-masing berarti lain:

       M(0,I)  keadaan: 0 habis, 1 terbang, 2 menunggu giliran
       M(1,I)  kota sasarannya
       M(2,I)  x sekarang        M(3,I)  y sekarang
       M(4,I)  langkah x per baris
       M(5,I)  x peluncuran      M(6,I)  y peluncuran

   Nomor 12 sampai 15 tidak dipakai di awal. Mereka anak-anak MIRV: baris 420
   mengisinya begitu sebuah rudal melewati ketinggian 70.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` dan `SOUND` diam.
   - `RANDOMIZE VAL(RIGHT$(TIME$,2))` diganti benih tetap.
   - `VARPTR$` tidak punya padanan; tabel baris menulis NAMA variabelnya
     langsung di dalam string DRAW (`XCT2$;`). Lihat catatan di grafik.js.
   - `POKE &H410` (baris 1870 dan 1950) benar-benar menukar kartu tampilan di
     mesin aslinya. Di penelusur ia tidak melakukan apa-apa.
   - `LOAD"MENU",R` (baris 630 dan 1510) tidak bisa dijalankan.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }

  /* --- 10-60: mulai -------------------------------------------------------- */
  rem(10);
  T({ baris: 20, bagian: [
      function (m) { m.gosub(1930); },
      function (m) { m.v['ABM%'] = 0; }
    ] });
  T({ baris: 25, jalan: function (m) { m.gosub(10000); } });
  T({ baris: 30, jalan: function (m) {
      m.cls(); m.layar(0); m.locate(3, 10); m.cetak('Before we begin....');
    } });
  T({ baris: 32, jalan: function (m) {
      m.locate(23, 30); m.warna(1); m.cetak('EMD 7/82'); m.warna(7);
    } });
  T({ baris: 35, jalan: function (m) {
      m.locate(6, 3); m.warna(14);
      m.cetak('ENEMY ROCKET PERFORMANCE HANDICAP:'); m.warna(7);
      m.barisBaru(); m.barisBaru();
      m.cetak('  0=MISSION-IMPOSSIBLE  1=VERY FAST'); m.barisBaru();
      m.barisBaru();
      m.cetak('  2=EXPERT            '); m.warna(2);
      m.cetak('  3=NORMAL'); m.barisBaru(); m.barisBaru();
    } });
  T({ baris: 36, bagian: [
      function (m) { m.warna(7); },
      function (m) {
        m.masukan(function (s) { m.v['RS%'] = Math.round(parseFloat(s) || 0); },
                  '  4=PRACTICE            5=JUNIOR   ');
      }
    ] });
  /* 40 `M(6,15)` — tujuh baris kali enam belas rudal. Lihat tabel di kepala. */
  T({ baris: 40, jalan: function (m) {
      m.dim('T%()', 1, 5); m.dim('M()', 6, 15); m.dim('CH%()', 66);
    } });
  T({ baris: 50, jalan: function (m) { m.gosub(1010); } });
  T({ baris: 60, jalan: function (m) { m.lompat(770); } });

  /* --- 70-260: gelung utama ------------------------------------------------ */
  rem(70);
  /* 80 `REM STICK COMMANDS WERE HERE` — pembacaan tuas permainan dibuang, dan
     yang tersisa cuma bekas tempatnya. */
  rem(80);
  T({ baris: 90, jalan: function (m) { if (m.v['ABM%']) m.lompat(170); } });
  T({ baris: 100, jalan: function (m) { m.lompat(1600); } });
  /* 110 kedua PUT tanpa aksi = XOR: yang pertama menghapus bidikan dari tempat
     lamanya, yang kedua menggambarnya di tempat barunya. Satu baris untuk
     seluruh gerakan bidikan. */
  T({ baris: 110, jalan: function (m) {
      /* `SY` belum pernah diisi saat baris ini pertama kali jalan — di BASIC
         nilainya nol, dan bidikannya memang mulai di tepi atas. */
      if (m.v.SY === undefined) m.v.SY = 0;
      m.taruh(m.v.LX, m.v.LY, m.v['CH%()'], 'XOR');
      m.taruh(m.v.X, m.v.SY, m.v['CH%()'], 'XOR');
      m.v.LX = m.v.X; m.v.LY = m.v.SY;
    } });
  T({ baris: 120, jalan: function (m) { if (m.v['ABM%']) m.lompat(170); } });
  T({ baris: 130, jalan: function (m) { if (m.v['B%'] === 0) m.lompat(260); } });
  T({ baris: 140, jalan: function (m) { m.v['B%'] = 0; } });
  /* 150 rudal pemainnya digambar sebagai SATU GARIS dari pangkalan (168,160)
     ke titik bidikan, seketika. Yang memakan waktu bukan terbangnya melainkan
     ledakannya di baris 170. */
  T({ baris: 150, jalan: function (m) {
      m.v.DX = m.v.LX + 10; m.v.DY = m.v.LY + 10;
      m.garis(168, 160, m.v.DX, m.v.DY, 3);
      m.v['ABM%'] = 1; m.v.RR = 1;
    } });
  T({ baris: 160, jalan: function (m) {
      m.taruh(m.v.LX, m.v.LY, m.v['CH%()'], 'XOR');
      m.v.LX = 158; m.v.LY = 150;
      m.taruh(m.v.LX, m.v.LY, m.v['CH%()'], 'XOR');
    } });
  /* 170 ledakan digambar sebagai lingkaran yang membesar satu piksel tiap
     putaran gelung utama — jadi ia berjalan BERSAMAAN dengan rudal musuh,
     tanpa gelung tersendiri. */
  T({ baris: 170, jalan: function (m) {
      m.v.RR = 1 + m.v.RR; m.lingkaran(m.v.DX, m.v.DY, m.v.RR, 2);
    } });
  T({ baris: 180, jalan: function (m) { if (m.v.RR < 11) m.lompat(260); } });
  T({ baris: 190, jalan: function (m) {
      m.v['ABM%'] = 0;
      m.garis(168, 160, m.v.DX, m.v.DY, 0);
      m.lingkaran(m.v.DX, m.v.DY, 10, 0);
      m.garis(m.v.DX - 11, m.v.DY - 10, m.v.DX + 11, m.v.DY + 10, 0, 'BF');
    } });
  T({ baris: 200, jalan: function (m) { m.v.I = -1; } });
  T({ baris: 210, jalan: function (m) {
      m.v.I = m.v.I + 1; if (m.v.I > 15) m.lompat(260);
    } });
  T({ baris: 220, jalan: function (m) {
      if (m.v['M()'][0][m.v.I] === 0) m.lompat(210);
    } });
  /* 230 jangkauan ledakan = besar hulu ledak yang dipilih pemain. Tebakan
     yang lebih besar lebih mudah kena, dan baris 250 membayarnya lebih
     murah. */
  T({ baris: 230, jalan: function (m) {
      var M = m.v['M()'], i = m.v.I;
      if (Math.abs(M[2][i] - m.v.DX) < m.v['WH%'] + 1 &&
          Math.abs(M[3][i] - m.v.DY) < m.v['WH%']) m.lompat(250);
    } });
  T({ baris: 240, jalan: function (m) { m.lompat(210); } });
  /* 250 warna garisnya ditulis `O` — HURUF O, bukan angka nol. Variabel `O`
     tidak pernah diisi di seluruh program ini, jadi nilainya nol, jadi
     hasilnya kebetulan benar. Lihat catatan cacat. */
  T({ baris: 250, jalan: function (m) {
      var M = m.v['M()'], i = m.v.I;
      m.garis(M[5][i], M[6][i], M[2][i], M[3][i], m.v.O || 0);
      M[0][i] = 0;
      m.v.SC = (m.v.SC || 0) + (10 - m.v['WH%']);
    } });
  /* 260 `CT%` adalah pengatur kecepatan: rudal musuh baru bergerak sesudah
     `RS%` putaran gelung. Nilai RS% dipilih pemain di baris 36, dan baris
     1470 MENGURANGINYA tiap kali ia menang. */
  T({ baris: 260, jalan: function (m) {
      if ((m.v['CT%'] || 0) < m.v['RS%']) {
        m.v['CT%'] = (m.v['CT%'] || 0) + 1; m.lompat(70);
      }
    } });
  T({ baris: 270, jalan: function (m) { m.v['CT%'] = 0; } });

  /* --- 280-450: rudal musuh ------------------------------------------------ */
  T({ baris: 280, bagian: [
      function (m) { m.v.N = 0; },
      function (m) { m.untuk('I', 0, 15, 1, 330); }
    ] });
  T({ baris: 290, jalan: function (m) {
      if (m.v['M()'][0][m.v.I] !== 1) { m.v.N = m.v.N + 1; m.lompat(330); }
    } });
  T({ baris: 300, jalan: function (m) {
      var M = m.v['M()'], i = m.v.I;
      M[2][i] = M[2][i] + M[4][i]; M[3][i] = M[3][i] + 1;
      m.pset(M[2][i], M[3][i], 3);
    } });
  T({ baris: 310, jalan: function (m) {
      if (m.v['M()'][3][m.v.I] > 159) m.gosub(460);
    } });
  /* 320 MIRV dipicu oleh ketinggian: rudal PERTAMA yang melewati baris 70
     memecah diri. `FLAG%` menjaga supaya hanya sekali. */
  T({ baris: 320, jalan: function (m) {
      if (m.v['M()'][3][m.v.I] > 70 && m.v['FLAG%'] === 0) {
        m.v['FLAG%'] = 123; m.v['MIRV%'] = m.v.I;
      }
    } });
  T({ baris: 330, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { if (m.v.MR === 0 && m.v.N > 15) m.lompat(1370); }
    ] });
  T({ baris: 340, jalan: function (m) { if (m.v['FLAG%'] === 123) m.lompat(400); } });
  /* 350 peluang empat persen tiap putaran: itu seluruh jadwal peluncuran
     musuh. Tidak ada penghitung waktu, tidak ada antrean. */
  T({ baris: 350, jalan: function (m) { if (m.acak() < 0.96) m.lompat(70); } });
  T({ baris: 360, jalan: function (m) { m.v.I = 0; } });
  T({ baris: 370, jalan: function (m) {
      m.v.I = m.v.I + 1;
      if (m.v['M()'][0][m.v.I] === 2) { m.v['M()'][0][m.v.I] = 1; m.lompat(70); }
    } });
  T({ baris: 380, jalan: function (m) {
      if (m.v.I === 11) {
        m.locate(1, 3); m.cetak('ENEMY HAS LAUNCHED ALL MISSLES');
        m.v.MR = 0; m.lompat(70);
      }
    } });
  T({ baris: 390, jalan: function (m) { m.lompat(370); } });
  /* 400-440 MIRV: empat anak dilahirkan di tempat induknya, masing-masing
     menuju kota BERIKUTNYA dalam urutan melingkar (TT% bertambah, dan baris
     410 memutarnya kembali ke nol sesudah lima). */
  T({ baris: 400, jalan: function (m) {
      m.v.FLAG = -1; m.v.N = 0;
      m.v['PT%'] = m.v['M()'][1][m.v['MIRV%']];
      m.v['TT%'] = m.v['PT%'] + 1;
    } });
  T({ baris: 410, jalan: function (m) {
      m.v.N = m.v.N + 1; m.v['TT%'] = m.v['TT%'] + 1;
      if (m.v['TT%'] > 5) m.v['TT%'] = m.v['TT%'] - 6;
    } });
  T({ baris: 420, jalan: function (m) {
      var M = m.v['M()'], i = m.v.N + 11, p = m.v['MIRV%'];
      m.v.I = i;
      M[0][i] = 1; M[1][i] = m.v['TT%'];
      M[2][i] = M[2][p]; M[3][i] = M[3][p];
      M[5][i] = M[2][i]; M[6][i] = M[3][i];
    } });
  /* 430 pembaginya 90, bukan 160. Anak MIRV lahir di ketinggian 70 dan harus
     sampai 160 — sisa perjalanannya sembilan puluh baris. Angka yang benar,
     dihitung sekali, ditulis telanjang. */
  T({ baris: 430, jalan: function (m) {
      var M = m.v['M()'], i = m.v.I;
      M[4][i] = (m.v['T%()'][1][m.v['TT%']] - M[5][i]) / 90;
    } });
  T({ baris: 440, jalan: function (m) {
      if (m.v.N < 4) { m.v['FLAG%'] = -1; m.lompat(410); }
    } });
  T({ baris: 450, jalan: function (m) { m.lompat(70); } });

  /* --- 460-530: rudal musuh meledak ---------------------------------------- */
  rem(460);
  T({ baris: 470, bagian: [
      function (m) { m.untuk('R', 6, 36, 1, 500); },
      function (m) {
        if (m.v.R < 30) m.lingkaran(m.v['M()'][2][m.v.I], 160, m.v.R, 2);
      }
    ] });
  /* 480 lingkaran warna 0 berjari-jari LIMA LEBIH KECIL mengejar yang di
     baris 470. Hasilnya cincin setebal lima piksel yang mengembang — ledakan
     berongga, dari dua perintah. */
  T({ baris: 480, jalan: function (m) {
      m.lingkaran(m.v['M()'][2][m.v.I], 160, m.v.R - 5, 0);
    } });
  T({ baris: 490, jalan: function (m) { m.lanjutkan('R'); } });
  T({ baris: 500, jalan: function (m) {
      var M = m.v['M()'], i = m.v.I;
      m.v['T%()'][0][M[1][i]] = 0;
      m.garis(M[5][i], M[6][i], M[2][i], M[3][i], 0);
    } });
  T({ baris: 510, jalan: function (m) { m.v['M()'][0][m.v.I] = 0; } });
  /* 520 DAN DI SINI CACATNYA: gelung ini memakai `I` — nama yang sedang
     dipakai gelung pemanggilnya di baris 280-330 sebagai nomor rudal. Sesudah
     RETURN, `I` bernilai nomor kota, bukan nomor rudal. */
  T({ baris: 520, bagian: [
      function (m) { m.untuk('I', 0, 5, 1, 530); },
      function (m) { if (m.v['T%()'][0][m.v.I] === 1) m.kembali(); }
    ] });
  /* 530 `RETURN 540` — pulang ke tempat LAIN. Alamat pulang yang tersimpan
     dibuang, dan alurnya lanjut di baris 540. Cara sebuah subrutin
     meninggalkan pekerjaan yang tadi disela. */
  T({ baris: 530, bagian: [
      function (m) { m.lanjutkan('I'); },
      function (m) { m.kembali(540); }
    ] });

  /* --- 540-650: kalah ------------------------------------------------------ */
  rem(540);
  T({ baris: 550, jalan: function (m) {
      m.cls(); m.warna(4, 7); m.locate(6, 9);
      m.cetak('YOU SHOULD BE DEMOTED!');
    } });
  T({ baris: 560, jalan: function (m) {
      m.locate(10, 5); m.cetak('ALL CITIES HAVE BEEN DESTROYED');
    } });
  T({ baris: 570, jalan: function (m) {
      m.locate(15, 6);
      m.cetak('YOUR SCORE IS ' + bas(m.v.SC) + ' POINTS.');
    } });
  T({ baris: 580, jalan: function (m) {
      m.locate(17, 2);
      m.cetak('THE HIGHEST SCORE TODAY IS ' + bas(m.v.HSC) + ' POINTS.');
    } });
  T({ baris: 590, jalan: function (m) {
      m.locate(24, 5); m.cetak('DO YOU WISH TO PLAY AGAIN (Y/N)?');
    } });
  /* 600 rekornya baru diperbarui SESUDAH dicetak di baris 580 — jadi skor
     terbaik yang barusan dibuat tidak pernah muncul di layar yang
     mengumumkannya. */
  T({ baris: 600, jalan: function (m) {
      if (m.v.SC > (m.v.HSC || 0)) m.v.HSC = m.v.SC;
    } });
  T({ baris: 610, jalan: function (m) {
      m.v['K$'] = m.inkey(); if (m.v['K$'] === '') m.lompat(610);
    } });
  T({ baris: 620, jalan: function (m) {
      if (m.v['K$'] === 'Y' || m.v['K$'] === 'y') m.lompat(60);
    } });
  T({ baris: 630, jalan: function (m) {
      if (m.v['K$'] === 'N' || m.v['K$'] === 'n') { m.cls(); m.jalankan('MENU'); }
    } });
  T({ baris: 640, jalan: function (m) { m.lompat(610); } });
  T({ baris: 650, jalan: function (m) { m.henti('END di baris 650.'); } });

  /* --- 660-760: menyiapkan rudal musuh ------------------------------------- */
  T({ baris: 660, jalan: function (m) { m.untuk('I', 0, 11, 1, 690); } });
  T({ baris: 670, jalan: function (m) {
      var M = m.v['M()'], i = m.v.I;
      M[0][i] = 2;
      M[5][i] = Math.floor(m.acak() * 280) + 20;
      M[2][i] = M[5][i]; M[6][i] = 0; M[3][i] = 0;
    } });
  T({ baris: 680, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 690, jalan: function (m) { m.untuk('I', 0, 11, 1, 730); } });
  /* 700 dua belas rudal, enam kota: rudal 0-5 dan 6-11 menyerang kota yang
     sama. Tiap kota dijatah dua. */
  T({ baris: 700, jalan: function (m) {
      m.v.II = m.v.I; if (m.v.I > 5) m.v.II = m.v.I - 6;
    } });
  /* 710 langkah x dihitung SEKALI, dari selisih tempat lahir dan sasarannya
     dibagi seratus enam puluh baris perjalanan. Sesudah itu rudalnya tidak
     pernah memikirkan sasarannya lagi — ia cuma menambah dua bilangan. */
  T({ baris: 710, jalan: function (m) {
      var M = m.v['M()'], i = m.v.I;
      M[4][i] = (m.v['T%()'][1][m.v.II] - M[5][i]) / 160;
      M[1][i] = m.v.II;
    } });
  T({ baris: 720, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 730, jalan: function (m) { m.v['M()'][0][0] = 1; } });
  T({ baris: 740, jalan: function (m) { m.v.MR = 16; } });
  T({ baris: 750, jalan: function (m) { m.kembali(); } });
  T({ baris: 760, jalan: function (m) { m.henti('STOP di baris 760.'); } });

  /* --- 770-1000: menyiapkan layar ------------------------------------------ */
  rem(770);
  rem(780);
  T({ baris: 790, jalan: function (m) {
      m.v['NM%'] = 11; m.v['FLAG%'] = 0; m.v['MIRV%'] = 33;
      m.v.SC = 0; m.v.X = 100; m.v.Y = 100; m.v.LX = 100; m.v.LY = 100;
    } });
  T({ baris: 800, jalan: function () { /* RANDOMIZE */ } });
  T({ baris: 810, jalan: function (m) { m.layar(1); m.warna(0, 1); m.cls(); } });
  /* 820-850 bidikannya digambar lalu DIPUNGUT: lingkaran dengan empat coret
     di sekelilingnya — dan celah di antara coretannya yang membuatnya
     terlihat seperti teropong, bukan seperti palang. */
  T({ baris: 820, jalan: function (m) { m.lingkaran(110, 110, 5, 3); } });
  T({ baris: 830, jalan: function (m) {
      m.garis(100, 110, 105, 110); m.garis(115, 110, 120, 110);
    } });
  T({ baris: 840, jalan: function (m) {
      m.garis(110, 100, 110, 105); m.garis(110, 115, 110, 120);
    } });
  T({ baris: 850, jalan: function (m) {
      m.v['CH%()'] = m.ambil(100, 100, 120, 120); m.cls();
    } });
  T({ baris: 860, jalan: function (m) { m.untuk('I', 0, 5, 1, 890); } });
  /* 870 enam kota berjarak 48 piksel: 48, 96, 144, 192, 240, 288. */
  T({ baris: 870, jalan: function (m) {
      m.v['T%()'][0][m.v.I] = 1; m.v['T%()'][1][m.v.I] = 48 * (m.v.I + 1);
    } });
  T({ baris: 880, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 890, jalan: function (m) { m.gosub(660); } });
  rem(900);
  T({ baris: 910, jalan: function (m) { m.layar(1); m.warna(0, 0); } });
  /* 920-940 tiga siluet kota, masing-masing sebuah string DRAW. Ketiganya
     tidak pernah digambar langsung; mereka dipanggil dari baris 950-960. */
  T({ baris: 920, jalan: function (m) {
      m.v['CT$'] = 'U2R4U18R7D8R3D3R3U9R3D7R5D4R3D5R5D2';
    } });
  T({ baris: 930, jalan: function (m) {
      m.v['CT2$'] = 'U5R1U3R1D3R2U3R1D3R2U3R1D3R2U3R1D3R2D3R1U1R1U10R1U1R3D1R1D6R3U10R4D14R5D3';
    } });
  T({ baris: 940, jalan: function (m) {
      m.v['CT3$'] = 'U20R6D18R1U5R2U8E2F2D5R1D9R2U9R1U9R4D13R3U9R6D5R2D10';
    } });
  /* 950-960 SELURUH GARIS LANGIT dalam dua baris. `X` memanggil string lain
     sebagai subrutin gambar; `R16` di antaranya cuma memindahkan pena ke kota
     berikutnya. Enam kota dari tiga bentuk. */
  T({ baris: 950, jalan: function (m) {
      m.pset(0, 180); m.gambar('R32;XCT2$;R16;XCT$;');
    } });
  T({ baris: 960, jalan: function (m) {
      m.gambar('R16;XCT3$;R5U10R6D10R5;XCT$;R16;XCT2$;R16;XCT$;R16;');
    } });
  /* 970 satu PAINT mengisi SEMUANYA. Garis langitnya tersambung dari ujung
     ke ujung dan bertumpu di tepi bawah layar, jadi seluruh kota adalah satu
     bidang tertutup. */
  T({ baris: 970, jalan: function (m) { m.cat(120, 190, 3); } });
  T({ baris: 980, jalan: function (m) {
      [[5, 'BTV'], [11, 'FSH'], [17, 'HPN'], [24, 'MAN'],
       [30, 'RAL'], [36, 'BOC']].forEach(function (k) {
        m.locate(25, k[0]); m.cetak(k[1]);
      });
      m.locate(1, 1);
    } });
  T({ baris: 990, jalan: function (m) {
      m.v.LX = 120; m.v.LY = 100;
      m.taruh(120, 100, m.v['CH%()'], 'XOR');
      m.v['BOOM%'] = 0;
    } });
  T({ baris: 1000, jalan: function (m) { m.lompat(70); } });

  /* --- 1010-1360: petunjuk ------------------------------------------------- */
  rem(1010);
  T({ baris: 1020, jalan: function (m) { m.layar(0); m.warna(1, 0); m.cls(); } });
  /* 1030 dan 1190, 1200, 1250 stringnya tidak ditutup. GW-BASIC menutupnya di
     ujung baris. `COLOR 21` = 16+5: bit keenam belas menyalakan KEDIPAN. */
  T({ baris: 1030, jalan: function (m) {
      m.locate(1, 10); m.warna(21); m.cetak('ANTI-BALLISTIC-MISSILE');
      m.barisBaru();
    } });
  T({ baris: 1040, jalan: function (m) {
      m.locate(2, 16); m.warna(5); m.cetak('BY ED DAVIS'); m.barisBaru();
    } });
  [[1050, 4, 5, 'You are the commander of an'],
   [1060, 5, 3, 'anti-ballistic missile defense system.'],
   [1070, 6, 3, 'Your mission is to defend the IBM'],
   [1080, 7, 3, 'East coast sites from the enemy.'],
   [1090, 9, 5, 'The enemy has 12 missiles to fire'],
   [1100, 10, 3, 'at your 6 locations.  Your missiles'],
   [1110, 11, 3, 'will destroy his if within range.'],
   [1120, 12, 3, 'You may choose the megatonnage of'],
   [1130, 13, 3, 'your missiles, but will get a higher'],
   [1140, 14, 3, 'score with smaller warhead sizes.'],
   [1150, 15, 3, 'The ememy does have MIRV capability.'],
   [1160, 18, 3, 'WHAT SIZE (3-9) WARHEAD DO YOU WANT?:'],
   [1170, 20, 3, '       3=SMALL (EXPERT)'],
   [1190, 22, 3, '       5=BIG   (BEGINNER)'],
   [1200, 23, 3, '       9=WOW!  (CHICKEN)']
  ].forEach(function (k) {
    T({ baris: k[0], jalan: function (m) {
        if (k[0] === 1050) m.warna(7);
        m.locate(k[1], k[2]); m.cetak(k[3]); m.barisBaru();
      } });
  });
  T({ baris: 1180, jalan: function (m) {
      m.locate(21, 3); m.warna(2); m.cetak('       4=NORMAL(GOOD)');
      m.barisBaru(); m.warna(7);
    } });
  /* 1210 `POKE 1050,PEEK(1052)` — kepala penyangga papan tik disamakan dengan
     ekornya, dan penyangganya kosong. LIFE2.BAS baris 2016 melakukan hal yang
     sama persis dengan penugasan yang TERBALIK: `POKE 1052,PEEK(1050)`.
     Dua program, satu tujuan, dua arah. */
  T({ baris: 1210, jalan: function (m) { m.kosongkanPenyangga(); } });
  T({ baris: 1220, jalan: function (m) {
      m.v['K$'] = m.inkey(); if (m.v['K$'] === '') m.lompat(1220);
    } });
  /* 1230 syaratnya cuma "lebih dari dua". Menunya menawarkan 3, 4, 5, dan 9 —
     tapi 6, 7, dan 8 juga diterima tanpa sepatah kata. */
  T({ baris: 1230, jalan: function (m) {
      var v = parseInt(m.v['K$'], 10) || 0;
      if (v > 2) m.v['WH%'] = v; else m.lompat(1220);
    } });
  T({ baris: 1240, jalan: function (m) {
      m.cls(); m.locate(3, 18); m.layar(0);
    } });
  T({ baris: 1250, jalan: function (m) {
      m.cetak(' **** MISSILE CONTROLS FOR ABM2 ****'); m.barisBaru();
    } });
  T({ baris: 1260, jalan: function (m) {
      m.locate(6, 3); m.cetak('YOU CONTROL THE TARGET AREA OF YOUR');
      m.barisBaru();
    } });
  T({ baris: 1270, jalan: function (m) {
      m.cetak("ABM'S THRU THE USE OF THE DIRECTIONAL"); m.barisBaru();
    } });
  T({ baris: 1280, jalan: function (m) {
      m.cetak('KEYS:'); m.barisBaru(); m.barisBaru();
    } });
  [[1290, 24, '  -RAISES SIGHTS'], [1300, 25, '  -LOWERS SIGHTS'],
   [1310, 26, '  -MOVES SIGHTS TO RIGHT'], [1320, 27, '  -MOVES SIGHTS TO LEFT']
  ].forEach(function (k) {
    T({ baris: k[0], jalan: function (m) {
        m.warna(20); m.cetak(m.chr(k[1])); m.warna(7);
        m.cetak(k[2]); m.barisBaru();
      } });
  });
  T({ baris: 1330, jalan: function (m) {
      m.warna(20); m.cetak('(Esc)'); m.warna(7);
      m.cetak(' -KEY LAUNCHES MISSILES'); m.barisBaru();
    } });
  T({ baris: 1340, jalan: function (m) {
      m.locate(23, 5); m.cetak('PRESS ANY KEY TO BEGIN....GOOD LUCK!');
    } });
  T({ baris: 1350, jalan: function (m) { m.masukan('I$', ''); } });
  T({ baris: 1360, jalan: function (m) { m.kembali(); } });

  /* --- 1370-1590: menang --------------------------------------------------- */
  rem(1370);
  T({ baris: 1380, bagian: [
      function (m) { m.v['NT%'] = 0; m.untuk('I', 0, 5, 1); },
      function (m) { m.v['NT%'] = m.v['NT%'] + m.v['T%()'][0][m.v.I]; },
      function (m) { m.lanjutkan('I'); }
    ] });
  T({ baris: 1390, jalan: function (m) { m.cls(); m.warna(9, 7); } });
  T({ baris: 1400, jalan: function () { /* PLAY */ } });
  T({ baris: 1410, jalan: function (m) {
      m.locate(4, 11); m.cetak(' CONGRATULATIONS! ');
    } });
  T({ baris: 1420, jalan: function (m) {
      m.locate(8, 5); m.cetak(' YOU HAVE WON THE BATTLE..');
    } });
  T({ baris: 1430, jalan: function (m) {
      m.locate(10, 5); m.cetak(bas(m.v['NT%']) + ' IBM LOCATIONS REMAIN');
    } });
  T({ baris: 1440, jalan: function (m) {
      m.v.SC = m.v.SC + 50; if (m.v.SC > (m.v.HSC || 0)) m.v.HSC = m.v.SC;
    } });
  T({ baris: 1450, jalan: function (m) {
      m.locate(12, 5); m.cetak('YOUR SCORE IS :' + bas(m.v.SC));
    } });
  T({ baris: 1460, jalan: function (m) {
      m.locate(13, 5);
      m.cetak('THE HIGHEST SCORE IS:' + bas(m.v.HSC) + ' POINTS');
    } });
  /* 1470 hadiah kemenangan: musuhnya jadi LEBIH CEPAT. `RS%` adalah jumlah
     putaran gelung yang harus lewat sebelum rudal bergerak, jadi menguranginya
     mempercepat permainan. */
  T({ baris: 1470, jalan: function (m) {
      m.v['RS%'] = m.v['RS%'] - 1; if (m.v['RS%'] < 0) m.v['RS%'] = 0;
    } });
  T({ baris: 1480, jalan: function (m) {
      m.locate(19, 5); m.cetak("THE ENEMY'S WARHEAD PERFORMANCE "); m.barisBaru();
      m.cetak('      IS NOW ' + bas(m.v['RS%'])); m.barisBaru();
    } });
  T({ baris: 1490, jalan: function (m) {
      m.locate(22, 5); m.cetak('DO YOU WISH TO PLAY AGAIN (Y/N)');
    } });
  T({ baris: 1500, jalan: function (m) {
      m.v['K$'] = m.inkey(); if (m.v['K$'] === '') m.lompat(1500);
    } });
  T({ baris: 1510, jalan: function (m) {
      if (m.v['K$'] === 'N' || m.v['K$'] === 'n') { m.cls(); m.jalankan('MENU'); }
    } });
  T({ baris: 1520, jalan: function (m) {
      if (m.v['K$'] === 'y' || m.v['K$'] === 'Y') m.lompat(1550);
    } });
  T({ baris: 1530, jalan: function (m) { m.lompat(1500); } });
  T({ baris: 1550, jalan: function (m) {
      m.locate(23, 5); m.cetak(' CHANGE YOU WARHEAD SIZE? (Y/N)     ');
    } });
  T({ baris: 1560, jalan: function (m) {
      m.v['K$'] = m.inkey();
      if (m.v['K$'] === 'n' || m.v['K$'] === 'N') m.lompat(60);
    } });
  T({ baris: 1570, bagian: [
      function (m) {
        if (m.v['K$'] !== 'y' && m.v['K$'] !== 'Y') { m.lompat(1580); return; }
        m.gosub(1010);
      },
      function (m) { m.lompat(60); }
    ] });
  T({ baris: 1580, jalan: function (m) { m.lompat(1560); } });
  T({ baris: 1590, jalan: function (m) { m.henti('END di baris 1590.'); } });

  /* --- 1600-1730: tombol ---------------------------------------------------
     `RIGHT$(INKEY$,1)` mengambil aksara KEDUA dari tombol panah, dan aksara
     itu kebetulan huruf: 72="H", 80="P", 77="M", 75="K". Jadi keempat panah
     bisa dicari sekaligus dengan satu INSTR di dalam string "HPMK". */
  T({ baris: 1600, jalan: function (m) {
      var k = m.inkey();
      m.v['K$'] = k ? k.slice(-1) : '';
      if (m.v['K$'] === '') m.lompat(110);
    } });
  T({ baris: 1610, jalan: function (m) {
      m.v['KK$'] = m.inkey(); if (m.v['KK$'] !== '') m.lompat(1610);
    } });
  T({ baris: 1620, jalan: function (m) {
      m.v.J = ('HPMK' + m.chr(27)).indexOf(m.v['K$']) + 1;
      var tujuan = [1640, 1660, 1680, 1700, 1720][m.v.J - 1];
      if (tujuan) m.lompat(tujuan);
    } });
  T({ baris: 1630, jalan: function (m) { m.lompat(110); } });
  T({ baris: 1640, jalan: function (m) {
      m.v.SY = (m.v.SY || 0) - 10; if (m.v.SY < 1) m.v.SY = 1;
    } });
  T({ baris: 1650, jalan: function (m) { m.lompat(110); } });
  T({ baris: 1660, jalan: function (m) {
      m.v.SY = (m.v.SY || 0) + 10; if (m.v.SY > 150) m.v.SY = 150;
    } });
  T({ baris: 1670, jalan: function (m) { m.lompat(110); } });
  T({ baris: 1680, jalan: function (m) {
      m.v.X = m.v.X + 10; if (m.v.X > 298) m.v.X = 298;
    } });
  T({ baris: 1690, jalan: function (m) { m.lompat(110); } });
  T({ baris: 1700, jalan: function (m) {
      m.v.X = m.v.X - 10; if (m.v.X < 5) m.v.X = 5;
    } });
  T({ baris: 1710, jalan: function (m) { m.lompat(110); } });
  T({ baris: 1720, jalan: function (m) { m.v['B%'] = 1; } });
  T({ baris: 1730, jalan: function (m) { m.lompat(110); } });

  /* --- 1740-2000: menukar kartu tampilan -----------------------------------
     Dan ini yang di BREAKOUT.BAS sudah jadi komentar: menulis ke kata
     perlengkapan BIOS supaya BASIC mengira kartu yang lain yang terpasang.
     Di sini ia hidup, dipanggil di baris 20, dan punya menu tersendiri yang
     tidak pernah dicapai. */
  rem(1740);
  T({ baris: 1750, jalan: function (m) { m.cls(); } });
  T({ baris: 1760, jalan: function (m) {
      m.barisBaru();
      m.cetak('IF YOU WANT TO TOGGLE MONOCHROME/COLOR  THEN;'); m.barisBaru();
    } });
  T({ baris: 1770, jalan: function (m) {
      m.cetak('   FOR COLOR PRESS - C'); m.barisBaru();
    } });
  T({ baris: 1780, jalan: function (m) {
      m.cetak('   FOR MONO  PRESS - M'); m.barisBaru();
    } });
  T({ baris: 1790, jalan: function (m) {
      m.cetak('   FOR NO CHANGE PRESS ANY OTHER KEY.'); m.barisBaru();
    } });
  T({ baris: 1800, jalan: function (m) {
      m.v['K$'] = m.inkey(); if (m.v['K$'] === '') m.lompat(1800);
    } });
  T({ baris: 1810, bagian: [
      function (m) {
        if (m.v['K$'] !== 'C' && m.v['K$'] !== 'c') { m.lompat(1820); return; }
        m.gosub(1930);
      },
      function (m) { m.henti('END di baris 1810.'); }
    ] });
  T({ baris: 1820, bagian: [
      function (m) {
        if (m.v['K$'] !== 'M' && m.v['K$'] !== 'm') { m.lompat(1830); return; }
        m.gosub(1850);
      },
      function (m) { m.henti('END di baris 1820.'); }
    ] });
  T({ baris: 1830, jalan: function (m) { m.cls(); } });
  T({ baris: 1840, jalan: function (m) {
      m.cetak('@@@@@@@@@@@@    NO CHANGE   @@@@@@@@@@@@@@'); m.barisBaru();
      m.henti('END di baris 1840.');
    } });
  rem(1850);
  T({ baris: 1860, jalan: function () { /* DEF SEG=0 */ } });
  T({ baris: 1870, jalan: function () { /* POKE &H410,(PEEK(&H410) OR &H30) */ } });
  T({ baris: 1880, jalan: function () { /* DEF SEG */ } });
  T({ baris: 1890, jalan: function (m) { m.locate(null, null, 1); } });
  T({ baris: 1900, jalan: function (m) { m.layar(0); } });
  T({ baris: 1910, jalan: function () { /* WIDTH 80 */ } });
  T({ baris: 1920, jalan: function (m) { m.kembali(); } });
  rem(1930);
  T({ baris: 1940, jalan: function () { /* DEF SEG=0 */ } });
  T({ baris: 1950, jalan: function () { /* POKE &H410 */ } });
  T({ baris: 1960, jalan: function () { /* DEF SEG */ } });
  T({ baris: 1970, jalan: function (m) { m.locate(null, null, 1); } });
  T({ baris: 1980, jalan: function (m) { m.layar(0); } });
  T({ baris: 1990, jalan: function () { /* WIDTH 40 */ } });
  T({ baris: 2000, jalan: function (m) { m.kembali(); } });

  /* --- 10000-10270: logo "DAVIS DISK" -------------------------------------- */
  rem(10000);
  T({ baris: 10010, jalan: function (m) { m.cls(); m.layar(1); m.warna(0, 1); } });
  /* 10020-10150 tiga puluh empat ruas garis yang membentuk sepasang bentuk
     besar. Tidak ada satu pun komentar tentang apa yang digambar. */
  var GARIS = {
    10020: [[20, 40, 160, 40], [null, null, 166, 50], [null, null, 40, 50]],
    10030: [[null, null, 87, 120], [null, null, 112, 120], [null, null, 120, 130],
            [null, null, 80, 130]],
    10040: [[20, 40, 80, 130]],
    10050: [[20, 40, 0, 70], [null, null, 60, 160], [null, null, 100, 160]],
    10060: [[60, 160, 80, 130], [100, 160, 120, 130], [166, 50, 146, 80],
            [null, null, 60, 80]],
    10070: [[66, 170, 71, 160]],
    10080: [[66, 170, 86, 200], [null, null, 200, 30], [null, null, 180, 0],
            [null, null, 152, 40]],
    10090: [[125, 80, 98, 120], [180, 0, 190, 0]],
    10100: [[null, null, 210, 30], [null, null, 200, 30]],
    10110: [[210, 30, 97, 200]],
    10120: [[204, 40, 230, 40], [null, null, 290, 130], [null, null, 142, 130]],
    10130: [[198, 50, 222, 50], [null, null, 270, 120], [null, null, 150, 120]],
    10140: [[178, 80, 203, 80], [null, null, 222, 50], [203, 80, 230, 120]],
    10150: [[290, 130, 270, 160], [null, null, 122, 160], [85, 200, 98, 200]]
  };
  Object.keys(GARIS).forEach(function (nomor) {
    var daftar = GARIS[nomor];
    T({ baris: parseInt(nomor, 10), jalan: function (m) {
        daftar.forEach(function (g) {
          var x1 = g[0] === null ? m.xKini() : g[0];
          var y1 = g[1] === null ? m.yKini() : g[1];
          m.garis(x1, y1, g[2], g[3]);
        });
      } });
  });
  T({ baris: 10160, jalan: function (m) { m.cat(140, 100, 3, 3); } });
  T({ baris: 10170, jalan: function (m) {
      [[160, 100], [100, 70], [150, 150], [200, 70], [100, 150]].forEach(
        function (p) { m.cat(p[0], p[1], 1, 3); });
    } });
  T({ baris: 10180, jalan: function (m) {
      m.cat(40, 100, 3, 3); m.cat(240, 100, 3, 3);
    } });
  T({ baris: 10190, jalan: function (m) {
      m.cat(65, 100, 2, 3); m.cat(260, 100, 2, 3); m.cat(195, 20, 2, 3);
    } });
  T({ baris: 10200, jalan: function (m) {
      m.v.N = (m.v.N || 0) + 1; if (m.v.N === 4) m.kembali();
    } });
  /* 10210 dan 10240 gelung tunda yang BADANNYA perintah COLOR — tiga ratus
     kali ganti warna ke warna yang sama. Menunda dan mewarnai dikerjakan
     pernyataan yang sama, dan yang menunda justru pengulangannya. */
  T({ baris: 10210, bagian: [
      function (m) { m.untuk('I', 1, 300, 1, 10220); },
      function (m) { m.warna(0, 0); },
      function (m) { m.lanjutkan('I'); }
    ] });
  T({ baris: 10220, jalan: function (m) {
      m.locate(2, 8); m.cetak('DAVIS DISK');
    } });
  T({ baris: 10230, jalan: function (m) {
      m.locate(23, 25); m.cetak('           ');
    } });
  T({ baris: 10240, bagian: [
      function (m) { m.untuk('I', 1, 300, 1, 10250); },
      function (m) { m.warna(0, 1); },
      function (m) { m.lanjutkan('I'); }
    ] });
  T({ baris: 10250, jalan: function (m) {
      m.locate(2, 8); m.cetak('           ');
    } });
  T({ baris: 10260, jalan: function (m) {
      m.locate(23, 25);
      m.cetak(m.chr(1) + '  ENJOY! ' + m.chr(1));
    } });
  T({ baris: 10270, jalan: function (m) { m.lompat(10200); } });

  function bas(n) {
    if (n === undefined || n === null) n = 0;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['ABM2A'] = {
    nama: 'ABM2A',
    judul: 'ABM 2 (Ed Davis, 18 Juli 1982)',
    sumber: 'ABM2A',
    berkas: 'run/ABM2A.BAS',
    tabel: tabel,
    benih: 82,

    arsitektur: {
      judul: 'Alur ABM2A.BAS',
      simpul: [
        { id: 'logo', baris: '10000-10270', jenis: 'mulai',
          teks: ['Logo "DAVIS DISK",', 'berkedip tiga kali'] },
        { id: 'ajar', baris: '1010-1360', jenis: 'putusan',
          teks: ['Besar hulu ledak 3-9:', 'kecil = sulit, nilainya besar'] },
        { id: 'kota', baris: '920-980',
          teks: ['Tiga bentuk kota,', 'enam kota, satu PAINT'] },
        { id: 'bidik', baris: '1600-1730', jenis: 'putusan',
          teks: ['Panah dicari lewat INSTR', 'atas "HPMK"+CHR$(27)'] },
        { id: 'ledak', baris: '150-250',
          teks: ['Rudal digambar seketika;', 'ledakannya membesar', 'satu piksel per putaran'] },
        { id: 'musuh', baris: '280-330',
          teks: ['Tiap rudal maju satu baris.', 'Langkah x dihitung SEKALI'] },
        { id: 'mirv', baris: '400-440',
          teks: ['Lewat ketinggian 70:', 'empat anak, sasaran berurutan'] },
        { id: 'kena', baris: '460-530',
          teks: ['Kota jatuh. Semua kota jatuh?', 'RETURN 540 — pulang ke tempat lain'] },
        { id: 'usai', baris: '1370-1590', jenis: 'keluar',
          teks: ['Menang: musuhnya', 'dipercepat satu tingkat'] }
      ],
      panah: [
        { dari: 'logo', ke: 'ajar' },
        { dari: 'ajar', ke: 'kota' },
        { dari: 'kota', ke: 'bidik' },
        { dari: 'bidik', ke: 'ledak', label: 'Esc' },
        { dari: 'bidik', ke: 'musuh' },
        { dari: 'ledak', ke: 'musuh' },
        { dari: 'musuh', ke: 'mirv', label: 'lewat 70' },
        { dari: 'musuh', ke: 'kena', label: 'sampai 159' },
        { dari: 'mirv', ke: 'bidik' },
        { dari: 'kena', ke: 'usai', label: 'kota habis' },
        { dari: 'musuh', ke: 'usai', label: 'rudal habis' }
      ]
    },

    pseudokode: [
      { baris: 950, tingkat: 0, teks: '<code>X</code>+<code>VARPTR$</code> &mdash; DRAW <b>memanggil string lain</b> sebagai subrutin' },
      { baris: 920, tingkat: 1, teks: '&hellip;tiga bentuk kota, enam kota, dua baris' },
      { baris: 970, tingkat: 1, teks: '&hellip;dan satu <code>PAINT</code> mengisi seluruh garis langitnya' },
      { baris: 40, tingkat: 0, teks: '<code>M(6,15)</code> &mdash; <b>tujuh arti</b> di satu larik' },
      { baris: 420, tingkat: 1, teks: '&hellip;nomor 12-15 disisakan untuk anak MIRV' },
      { baris: 430, tingkat: 1, teks: '&hellip;pembaginya <b>90</b>, bukan 160: sisa perjalanan dari ketinggian 70' },
      { baris: 1620, tingkat: 0, teks: 'panah dicari lewat <code>INSTR("HPMK")</code> &mdash; kode pindainya huruf' },
      { baris: 520, tingkat: 0, teks: 'subrutin memakai <code>I</code>, nama yang <b>masih dipakai pemanggilnya</b>' },
      { baris: 530, tingkat: 0, teks: '<code>RETURN 540</code> &mdash; pulang ke tempat lain' },
      { baris: 250, tingkat: 0, teks: 'warnanya ditulis <code>O</code> (huruf), bukan <code>0</code> &mdash; dan tetap benar' },
      { baris: 1210, tingkat: 0, teks: 'penyangga papan tik dikosongkan &mdash; <b>terbalik</b> dari LIFE2 baris 2016' }
    ],

    perintahAsli: 'run\\ABM2A.bat',
    catatanAsli: 'Pilih 3 untuk hulu ledak paling kecil, lalu 3 untuk ' +
      'kecepatan musuh normal. Panah menggerakkan bidikan, Esc menembak. ' +
      'Perhatikan rudal pertama yang melewati tengah layar: ia memecah diri ' +
      'jadi lima.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b>',

      '<b><code>VARPTR$</code> tidak punya padanan di penelusur.</b> Tabel ' +
      'barisnya menulis NAMA variabelnya langsung di dalam string DRAW ' +
      '(<code>XCT2$;</code> menggantikan <code>"X"+VARPTR$(CT2$)</code>). ' +
      'Yang berubah cuma cara stringnya menyebut tujuannya; yang dikerjakan ' +
      'sama persis.',

      '<b><code>POKE &amp;H410</code> di baris 1870 dan 1950 tidak melakukan ' +
      'apa-apa.</b> Di mesin aslinya keduanya benar-benar menukar kartu ' +
      'tampilan yang dikira BASIC terpasang.',

      '<b><code>LOAD"MENU",R</code> tidak bisa dijalankan</b> &mdash; bentuk ' +
      'KEEMPAT dari "jalan pulang ke menu" di koleksi ini, sesudah ' +
      '<code>RUN "MENU"</code>, <code>CHAIN "MENU"</code>, dan ' +
      '<code>RUN "MENU.PGM"</code> yang berkasnya tidak ada.',

      '<b><code>RANDOMIZE VAL(RIGHT$(TIME$,2))</code> diganti benih tetap.</b>'
    ],

    pelajaran: {
      ringkas: 'Bahasa DRAW dipakai sebagai bahasa pemrograman: string yang ' +
        'memanggil string lain sebagai subrutin gambar.',
      pelajari: [
        ['Subrutin di dalam sebuah string',
         'Baris 920-940 menyimpan tiga siluet kota sebagai string DRAW biasa. ' +
         'Ketiganya tidak pernah digambar langsung.',
         'Baris 950-960 memanggilnya:',
         '<code>950 PSET(0,180):DRAW "R32;X"+VARPTR$(CT2$)+"R16;X"+VARPTR$(CT$)</code>',
         'Perintah <code>X</code> berarti "jalankan string yang alamatnya ' +
         'menyusul". <code>VARPTR$</code> memberikan alamat itu. Jadi DRAW ' +
         'pergi ke string lain, menjalankan isinya, lalu kembali &mdash; ' +
         'panggilan subrutin, di dalam sebuah bahasa yang seluruhnya berupa ' +
         'string.',
         'Enam kota digambar dari tiga bentuk, dan yang memisahkan mereka cuma ' +
         '<code>R16</code> di sela-selanya: geser pena enam belas piksel ke ' +
         'kanan, gambar kota berikutnya.',
         'Ini fitur GW-BASIC yang paling jarang dipakai di seluruh koleksi ' +
         'ini &mdash; satu-satunya pemakaian, di satu program.'],
        ['Satu PAINT untuk seluruh kota',
         'Baris 970: <code>PAINT (120,190),3</code>. Satu titik, satu warna, ' +
         'dan seluruh garis langit terisi.',
         'Yang membolehkannya: garis langitnya digambar sebagai SATU jalur ' +
         'bersambung dari tepi kiri layar sampai tepi kanan, dan ia bertumpu ' +
         'di tepi bawah. Jadi bagian bawah layar adalah satu bidang tertutup ' +
         'yang bentuknya kebetulan berupa enam kota.',
         'Tidak ada satu pun kota yang dicat sendiri-sendiri.'],
        ['Langkah yang dihitung sekali',
         '<code>710 M(4,I)=(T%(1,II)-M(5,I))/160</code>',
         'Selisih antara tempat lahir rudal dan kota sasarannya, dibagi 160 ' +
         '&mdash; jumlah baris yang harus dilaluinya. Hasilnya langkah x per ' +
         'baris.',
         'Sesudah itu rudalnya tidak pernah memikirkan sasarannya lagi. Baris ' +
         '300 cuma menambah dua bilangan:',
         '<code>300 M(2,I)=M(2,I)+M(4,I):M(3,I)=M(3,I)+1</code>',
         'Enam belas rudal yang mengejar sasaran, dan tidak satu pun yang ' +
         'perlu tahu di mana sasarannya. Pengejarannya sudah dibakukan jadi ' +
         'sebuah bilangan.',
         'Dan baris 430 melakukan hal yang sama untuk anak MIRV dengan ' +
         'pembagi <b>90</b> &mdash; karena mereka lahir di ketinggian 70 dan ' +
         'sisa perjalanannya sembilan puluh baris. Angka yang benar, dihitung ' +
         'sekali, dan tidak pernah dijelaskan.'],
        ['Kode pindai yang kebetulan huruf',
         '<code>1600 K$=RIGHT$(INKEY$,1)</code>',
         '<code>1620 J=INSTR("HPMK"+CHR$(27),K$):ON J GOTO 1640,1660,1680,1700,1720</code>',
         'Tombol panah datang sebagai dua aksara: <code>CHR$(0)</code> lalu ' +
         'kode pindainya. Kode pindai panah atas 72, dan CHR$(72) adalah ' +
         'huruf <b>H</b>. Bawah 80 = P, kanan 77 = M, kiri 75 = K.',
         'Jadi <code>RIGHT$(INKEY$,1)</code> mengambil aksara kedua, dan ' +
         'keempat panah bisa dicari sekaligus dengan satu <code>INSTR</code> ' +
         'di dalam string <code>"HPMK"</code>. Lima kemungkinan, satu ' +
         'pencarian, satu <code>ON GOTO</code>.',
         'Akibat sampingannya: menekan huruf H juga menaikkan bidikan.'],
        ['Ledakan berongga dari dua lingkaran',
         '<code>470 FOR R=6 TO 36:IF R<30 THEN CIRCLE (M(2,I),160),R,2</code>',
         '<code>480 CIRCLE (M(2,I),160),R-5,0</code>',
         'Satu lingkaran berwarna menggambar tepi luar, satu lingkaran ' +
         'berwarna latar berjari-jari lima lebih kecil menghapus di ' +
         'belakangnya. Yang terlihat cincin setebal lima piksel yang ' +
         'mengembang lalu lenyap.',
         'Dan <code>IF R&lt;30</code> menghentikan yang menggambar lebih awal ' +
         'daripada yang menghapus, jadi enam putaran terakhir hanya ' +
         'membersihkan. Api padam sendiri.']
      ],
      hindari: [
        ['Subrutin yang mencuri pencacah pemanggilnya',
         'Baris 280-330 adalah gelung <code>FOR I=0 TO 15</code> yang ' +
         'memajukan tiap rudal. Di dalamnya, baris 310 memanggil ' +
         '<code>GOSUB 460</code> saat sebuah rudal mencapai tanah.',
         'Dan subrutin itu, di baris 520, membuka gelungnya sendiri: ' +
         '<code>FOR I=0 TO 5</code> &mdash; nama yang sama.',
         'Kalau sebuah kota masih berdiri, baris 520 <code>RETURN</code> di ' +
         'tengah gelung, dan <code>I</code> membawa nomor KOTA, bukan nomor ' +
         'rudal.',
         'Sesudah pulang, baris 320 memeriksa rudal ke-I yang salah, dan ' +
         'baris 330 melanjutkan gelung dari tempat yang salah.',
         'Diukur di penelusur: rudal nomor <b>0</b> mencapai tanah, dan ' +
         'sesudah <code>RETURN</code> nilai <code>I</code> menjadi ' +
         '<b>1</b> &mdash; nomor kota pertama yang masih berdiri. ' +
         '<code>NEXT I</code> lalu menaikkannya ke 2, jadi rudal nomor 1 ' +
         'TIDAK dimajukan sama sekali pada bingkai itu.',
         'Arah kesalahannya bergantung angka mana yang lebih besar. Kalau ' +
         'nomor kota yang selamat lebih KECIL daripada nomor rudal yang ' +
         'meledak, rudal-rudal di antaranya justru diproses dua kali dan ' +
         'melompat dua baris sekaligus.',
         'Gejalanya: sesudah sebuah kota jatuh, beberapa rudal tersendat ' +
         'atau menyentak. Cocok betul dengan suasana permainannya, dan ' +
         'karena itu tidak pernah dilaporkan sebagai cacat.'],
        ['Rekor yang diumumkan sebelum diperbarui',
         'Baris 580 mencetak <code>HSC</code>. Baris 600 baru menaikkannya ' +
         'kalau skor barusan lebih tinggi.',
         'Jadi pemain yang baru saja memecahkan rekor melihat rekor LAMA di ' +
         'layar yang mengumumkan kekalahannya. Rekornya baru muncul di ' +
         'permainan berikutnya.',
         'Dua puluh baris di bawahnya, urutan yang sama ditulis dengan benar: ' +
         'baris 1440 memperbarui <code>HSC</code> sebelum baris 1460 ' +
         'mencetaknya.'],
        ['Huruf O yang menyamar jadi nol',
         '<code>250 LINE (M(5,I),M(6,I))-(M(2,I),M(3,I)),O</code>',
         'Argumen warnanya huruf <b>O</b>, bukan angka <b>0</b>. Baris ini ' +
         'seharusnya menghapus jejak rudal yang baru ditembak jatuh.',
         'Ia bekerja &mdash; karena variabel <code>O</code> tidak pernah ' +
         'diisi di seluruh 231 baris ini, jadi nilainya nol, jadi warnanya ' +
         'nol, jadi jejaknya terhapus.',
         'Kebenaran yang dititipkan pada sebuah variabel yang tidak ada. ' +
         'Satu baris <code>O=3</code> di mana pun akan mengubah baris 250 ' +
         'jadi menggambar ulang jejak yang mau dihapusnya.'],
        ['Menu yang menawarkan empat dan menerima tujuh',
         'Baris 1160-1200 menawarkan hulu ledak 3, 4, 5, dan 9.',
         '<code>1230 IF VAL(K$)>2 THEN WH%=VAL(K$) ELSE GOTO 1220</code>',
         'Syaratnya cuma "lebih dari dua". Angka 6, 7, dan 8 diterima tanpa ' +
         'sepatah kata &mdash; dan berfungsi persis seperti yang diharapkan, ' +
         'karena <code>WH%</code> dipakai langsung sebagai jangkauan ledakan.',
         'Bukan cacat yang merusak apa pun. Tapi menunya berbohong tentang ' +
         'apa yang bisa dipilih, dan yang menentukan bukan menunya melainkan ' +
         'satu perbandingan di baris lain.']
      ]
    },

    penjelasan: [
      { judul: 'Bahasa gambar yang punya subrutin',
        isi: [
          'Bahasa <code>DRAW</code> punya perintah bernama <code>X</code>, ' +
          'dan ia satu-satunya perintah di bahasa itu yang tidak menggambar ' +
          'apa pun.',
          '<code>X</code> berarti: <i>jalankan string LAIN sebagai perintah ' +
          'gambar, lalu kembali ke sini.</i>',
          'Yang menyusul <code>X</code> bukan nama variabelnya melainkan ' +
          'ALAMATNYA di memori, dan cara mendapatkan alamat itu ' +
          '<code>VARPTR$</code>:',
          '<code>950 PSET(0,180):DRAW "R32;X"+VARPTR$(CT2$)+"R16;X"+VARPTR$(CT$)</code>',
          '<code>960 DRAW "R16;X"+VARPTR$(CT3$)+"R5U10R6D10R5;X"+VARPTR$(CT$)+' +
          '"R16;X"+VARPTR$(CT2$)+"R16;X"+VARPTR$(CT$)+"R16;"</code>',
          'Dua baris, dan seluruh garis langit enam kota tergambar.',
          'Bacalah baris 960 sebagai daftar perintah: geser 16 ke kanan, ' +
          'gambar kota bentuk ketiga, geser dan gambar sebuah menara kecil ' +
          'dari lima perintah mentah, gambar kota bentuk pertama, geser, ' +
          'gambar kota bentuk kedua, geser, gambar kota bentuk pertama lagi, ' +
          'geser.',
          'Tiga bentuk kota, dipakai enam kali, dan sebuah menara yang ' +
          'digambar langsung di tengah panggilan &mdash; karena bentuknya ' +
          'cuma dipakai sekali dan tidak layak disimpan.',
          'Yang membuatnya pantas dicatat: <code>DRAW</code> di sini bukan ' +
          'lagi cara menggambar. Ia bahasa pemrograman yang punya prosedur, ' +
          'dan program yang ditulis dengannya ada di dalam empat variabel ' +
          'string.',
          'Dan penutupnya baris 970:',
          '<code>970 PAINT (120,190),3</code>',
          'Satu titik. Karena jalur yang digambar itu bersambung dari tepi ke ' +
          'tepi dan bertumpu di dasar layar, seluruh kota adalah satu bidang ' +
          'tertutup. Enam kota, satu perintah isi.',
          'Dihitung di penelusur: pena berakhir di x=323 &mdash; tiga piksel ' +
          'di luar tepi kanan layar, jadi jalurnya benar-benar menyeberang ' +
          'penuh. Dan <code>PAINT</code> yang menyusul mengisi <b>8.682</b> ' +
          'piksel, tepat bagian bawah layar; 55.318 sisanya tetap kosong. ' +
          'Tidak ada kebocoran.'
        ] },
      { judul: 'Enam belas rudal di tujuh baris larik',
        isi: [
          '<code>40 DIM T%(1,5):DIM M(6,15):DIM CH%(66)</code>',
          '<code>M</code> berukuran 7&times;16, dan tiap barisnya berarti hal ' +
          'yang berbeda:',
          '<code>M(0,I)</code> keadaan &mdash; 0 habis, 1 terbang, 2 menunggu',
          '<code>M(1,I)</code> nomor kota sasarannya',
          '<code>M(2,I)</code>, <code>M(3,I)</code> tempatnya sekarang',
          '<code>M(4,I)</code> langkah mendatar per baris',
          '<code>M(5,I)</code>, <code>M(6,I)</code> tempat ia diluncurkan',
          'Tidak ada tipe data. Tidak ada nama. Tujuh larik sejajar, ' +
          'ditumpuk jadi satu dan dibedakan oleh indeks pertamanya.',
          'Dua belas rudal pertama disiapkan di baris 660-720 dan diberi ' +
          'keadaan 2 &mdash; menunggu. Baris 730 mengubah SATU saja jadi 1:',
          '<code>730 M(0,0)=1:REM THIS ENABLES ONLY ONE MISSLE ******</code>',
          'Sisanya dinyalakan satu per satu oleh baris 350-390, dengan peluang ' +
          'empat persen tiap putaran gelung utama. Tidak ada jadwal, tidak ada ' +
          'penghitung waktu, tidak ada antrean. Sebuah lemparan dadu, dan ' +
          'rudal pertama yang masih menunggu berangkat.',
          'Nomor 12 sampai 15 tidak pernah disentuh oleh persiapan itu. ' +
          'Mereka disisakan.',
          'Baris 320 menandai rudal pertama yang melewati ketinggian 70, dan ' +
          'baris 400-440 mengisi keempat nomor sisa itu dengan anak-anaknya ' +
          '&mdash; lahir di tempat induknya, masing-masing menuju kota yang ' +
          'berbeda:',
          '<code>410 N=N+1:TT%=TT%+1:IF TT%>5 THEN TT%=TT%-6</code>',
          '<code>420 I=N+11: M(0,I)=1:M(1,I)=TT%:M(2,I)=M(2,MIRV%)&hellip;</code>',
          '<code>TT%</code> berjalan dari sasaran induknya ke kota berikutnya, ' +
          'melingkar kembali ke nol sesudah lima. Empat anak, empat kota ' +
          'berurutan &mdash; satu serangan yang menyebar rapi.',
          'MIRV, sepuluh baris. Dan yang membuatnya sepuluh baris: nomor 12 ' +
          'sampai 15 sudah ada sejak awal, sudah punya tujuh baris atribut ' +
          'yang sama dengan rudal biasa, dan gelung di baris 280-330 sudah ' +
          'menelusuri sampai 15 tanpa tahu apa yang akan mengisinya.',
          'Larik yang dibuat sedikit lebih besar daripada yang dibutuhkan, ' +
          'dan sebuah kemampuan yang tumbuh di ruang sisa itu.'
        ] }
    ]
  };
})(window);
