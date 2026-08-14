/* ===========================================================================
   XWING.js — porting minimalis XWING.BAS sebagai tabel baris.

       1000  REM * STAR PILOT GAME *
       1010  REM * WRITTEN BY GEORGE BLANK, LEECHBURG, PA. *
       1020  REM * FOR  PUBLIC DOMAIN UNLESS MOVIEMAKERS OBJECT *
       1030  REM * VERSION 4.0    SEPTEMBER 25,1978 *
       1040  REM * MODIFIED TO RUN ON THE IBM PC BY ERNEST *
       1050  REM * SMITH AND RAYMOND ROGERS, HOUSTON, TEXAS *
       1060  REM * DECEMBER 82 *

   Ditulis 25 September 1978 — empat bulan sesudah Star Wars tayang di luar
   Amerika, dan tiga tahun sebelum IBM PC ada. Dipindahkan ke PC Desember 1982
   oleh dua orang di Houston, lalu disebarkan klub TPCUG di Pittsburgh, yang
   menempelkan kop suratnya sendiri di baris 40-230.

   Dan baris 1020 mengurus perizinannya dalam satu kalimat: FOR PUBLIC DOMAIN
   UNLESS MOVIEMAKERS OBJECT.

   YANG PALING LAYAK DILIHAT: GAMBAR YANG DIKETIK SEBAGAI ANGKA.

       1350  DIM IM4(13):IM4(0)=22:IM4(1)=7:IM4(2)=128:IM4(3)=-32760:...

   Tiga belas gambar — tembakan pesawat kekaisaran, tembakan Vader, enam
   bingkai ledakan, dan berkas laser selebar 74 piksel — tidak digambar dan
   tidak dimuat dari disket. Semuanya DIKETIK sebagai penugasan larik, satu
   bilangan bulat bertanda demi satu bilangan bulat bertanda, dalam format
   yang persis sama dengan yang ditulis `GET`.

   Bilangan di atas 32767 muncul sebagai negatif. `IM5(3)=-32768!` bahkan
   butuh akhiran `!` supaya tidak melimpah saat diurai.

   LANDER.BAS ada di disket yang sama dan butuh hal yang sama — tiga puluh
   sembilan gambar. Ia memilih jalan yang berlawanan: satu `BLOAD` dari berkas
   terpisah. Satu memindahkan persoalannya ke disket; satu memindahkannya ke
   jari.

   YANG KEDUA: PERSPEKTIF SEBAGAI EMPAT GAMBAR DAN SATU BENDERA.

       2490 IF O-S<20000 AND DSTAR2=0 THEN DSTAR2=1:DSFLAG=1:DS(0)=DS2(0):...
       2860 IF G-S<20000 AND IMPFIGH2=0 THEN ...:IMX=37:IMY=20:IMR1=2:IMR2=2

   Tiap sasaran punya beberapa ukuran gambar, dan tiap ambang jarak menyalin
   yang berikutnya ke atas gambar yang sedang dipakai. Yang ikut berganti
   bukan cuma gambarnya: `IMR1` dan `IMR2` adalah JANGKAUAN TEMBAK, dan
   keduanya membesar bersamanya. Sasaran yang lebih dekat lebih mudah kena,
   dan tidak ada satu baris pun yang menghitungnya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` dan `SOUND` diam — dan di sini itu banyak: tema Star Wars di baris
     1250-1260 dan 6360-6370 ditulis sebagai frekuensi mentah, bukan makro.
   - `RANDOMIZE(VAL(RIGHT$(TIME$,2)))` dan `TIME$` diganti benih dan jam tetap,
     jadi penghitung waktu di baris 5200-5270 tidak berjalan.
   - `POKE &H410` (baris 1070) diabaikan.
   - Larik gambar tidak bisa disalin unsur demi unsur di penelusur; tiap
     penyalinan `IM(0)=IM2(0):IM(1)=IM2(1):...` menyalin SELURUH gambarnya
     sekaligus. Di berkas aslinya keduanya sama saja — yang disalin memang
     seluruh isi lariknya.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }
  function bas(n) {
    if (n === undefined || n === null) n = 0;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }
  function ulang(s, n) {
    var k = '', i;
    for (i = 0; i < n; i++) k += s;
    return k;
  }
  /* Menyalin gambar. Di BASIC penyalinannya ditulis unsur demi unsur
     (`IM(0)=IM2(0):IM(1)=IM2(1):...`) karena larik tidak bisa ditugaskan
     sekaligus; yang disalin selalu seluruh isi lariknya. */
  function salin(g) {
    if (!g) return g;
    if (g.data) return { lebar: g.lebar, tinggi: g.tinggi, data: g.data.slice() };
    return g.slice();
  }
  /* Baris yang seluruhnya penugasan larik: `ISI` mengisi, `DIMISI` men-DIM
     dulu. Isinya diambil langsung dari berkas aslinya, tanpa disalin tangan. */
  function ISI(n, daftar) {
    T({ baris: n, jalan: function (m) {
        daftar.forEach(function (p) {
          if (!m.v[p[0]]) m.dim(p[0], 400);
          m.v[p[0]][p[1]] = p[2];
        });
      } });
  }
  function DIMISI(n, dims, daftar) {
    T({ baris: n, jalan: function (m) {
        dims.forEach(function (d) { m.dim(d[0], d[1]); });
        daftar.forEach(function (p) { m.v[p[0]][p[1]] = p[2]; });
      } });
  }

  T({ baris: 10, jalan: function (m) { m.cls(); } });
  T({ baris: 20, jalan: function (m) { m.layar(0); } });
  T({ baris: 30, jalan: function () { /* WIDTH 40 */ } });
  T({ baris: 40, jalan: function (m) { m.cetak("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"); m.barisBaru(); } });
  T({ baris: 50, jalan: function (m) { m.cetak("░┌───────────────────────────────────┐░"); m.barisBaru(); } });
  T({ baris: 60, jalan: function (m) { m.cetak("░│                                   │░"); m.barisBaru(); } });
  T({ baris: 70, jalan: function (m) { m.cetak("░│            2060-A.BAS             │░"); m.barisBaru(); } });
  T({ baris: 80, jalan: function (m) { m.cetak("░│              XWING                │░"); m.barisBaru(); } });
  T({ baris: 90, jalan: function (m) { m.cetak("░│                                   │░"); m.barisBaru(); } });
  T({ baris: 100, jalan: function (m) { m.cetak("░│                                   │░"); m.barisBaru(); } });
  T({ baris: 110, jalan: function (m) { m.cetak("░│ BROUGHT TO YOU BY THE MEMBERS OF  │░"); m.barisBaru(); } });
  T({ baris: 120, jalan: function (m) { m.cetak("░│      ▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄      │░"); m.barisBaru(); } });
  T({ baris: 130, jalan: function (m) { m.cetak("░│        █   █   █ █     █   █      │░"); m.barisBaru(); } });
  T({ baris: 140, jalan: function (m) { m.cetak("░│        █   █▄▄▄█ █     █   █      │░"); m.barisBaru(); } });
  T({ baris: 150, jalan: function (m) { m.cetak("░│        █   █     █     █   █      │░"); m.barisBaru(); } });
  T({ baris: 160, jalan: function (m) { m.cetak("░│      ▄▄█▄▄ █     █▄▄▄▄ █▄▄▄█      │░"); m.barisBaru(); } });
  T({ baris: 170, jalan: function (m) { m.cetak("░│                                   │░"); m.barisBaru(); } });
  T({ baris: 180, jalan: function (m) { m.cetak("░│      International PC Owners      │░"); m.barisBaru(); } });
  T({ baris: 190, jalan: function (m) { m.cetak("░│                                   │░"); m.barisBaru(); } });
  T({ baris: 200, jalan: function (m) { m.cetak("░│P.O. Box 10426, Pittsburgh PA 15234│░"); m.barisBaru(); } });
  T({ baris: 210, jalan: function (m) { m.cetak("░│                                   │░"); m.barisBaru(); } });
  T({ baris: 220, jalan: function (m) { m.cetak("░└───────────────────────────────────┘░"); m.barisBaru(); } });
  T({ baris: 230, jalan: function (m) { m.cetak("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"); m.barisBaru(); } });
  T({ baris: 240, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 250, jalan: function (m) { m.cetak("       PRESS ANY KEY TO CONTINUE"); m.barisBaru(); } });
  T({ baris: 260, jalan: function (m) { m.v['A$'] = m.inkey(); if (m.v['A$'] === '') m.lompat(260); } });
  T({ baris: 270, jalan: function () { /* WIDTH 80 */ } });
  T({ baris: 280, jalan: function (m) { m.cls(); } });
  rem(1000);
  rem(1010);
  rem(1020);
  rem(1030);
  rem(1040);
  rem(1050);
  rem(1060);
  /* 1070 Sama seperti ABM2A.BAS baris 1950: menulis ke kata perlengkapan BIOS. */
  T({ baris: 1070, jalan: function () { /* DEF SEG=0:POKE &H410 — menyuruh BASIC mengira kartu warna terpasang */ } });
  /* 1080 `WIDTH 40:SCREEN 1:SCREEN 0:WIDTH 80:WIDTH 40:SCREEN 1` — tarian mode yang
     sama dengan LANDER.BAS baris 3940, dan sebabnya sama: SCREEN cuma
     membersihkan layar kalau modenya BERGANTI. */
  T({ baris: 1080, jalan: function (m) { m.layar(1); m.layar(0); m.layar(1); m.warna(0, 1); } });
  T({ baris: 1090, jalan: function (m) { m.lompat(1200); } });
  T({ baris: 1100, jalan: function (m) { m.v.V = (m.v.V || 0) - 1; if (m.v.V < -3) m.v.V = -3; } });
  T({ baris: 1110, jalan: function (m) { m.kembali(); } });
  T({ baris: 1120, jalan: function (m) { m.v.W = (m.v.W || 0) - 1; if (m.v.W < -5) m.v.W = -5; } });
  T({ baris: 1130, jalan: function (m) { m.kembali(); } });
  T({ baris: 1140, jalan: function (m) { m.v.W = (m.v.W || 0) + 1; if (m.v.W > 5) m.v.W = 5; } });
  T({ baris: 1150, jalan: function (m) { m.kembali(); } });
  T({ baris: 1160, jalan: function (m) { m.v.V = (m.v.V || 0) + 1; if (m.v.V > 3) m.v.V = 3; } });
  T({ baris: 1170, jalan: function (m) { m.kembali(); } });
  /* 1180 1180 dan 1190 dipanggil BERPASANGAN mengapit tiap bagian yang tidak boleh
     disela: nyalakan semua jebakan, kerjakan, tunda semua lagi. `KEY(n) STOP`
     bukan `OFF` — tombol yang ditekan selama itu tetap DIINGAT dan dijemput
     begitu jebakannya menyala lagi. */
  T({ baris: 1180, jalan: function (m) {
      [1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, true); });
      m.kembali();
    } });
  T({ baris: 1190, jalan: function (m) {
      [1, 2, 11, 12, 13, 14].forEach(function (k) { m.tundaJebakan(k); });
      m.kembali();
    } });
  T({ baris: 1200, jalan: function (m) { m.locate(8, 1); m.cetak("***************************************"); } });
  T({ baris: 1210, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 1220, jalan: function (m) { m.cetak("*      X W I N G   F I G H T E R      *"); } });
  T({ baris: 1230, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 1240, jalan: function (m) { m.cetak("***************************************"); } });
  T({ baris: 1250, jalan: function () { /* SOUND 525.25,18.2:SOUND 783.99,18.2/2:SOUND 698.46,18.2/6:SOUND 659.26,18.2/6:SOUND 587.33,18.2/6:SOUND 1046.6,18.2:SOUND 783.99,18.2/2:SOUND 698.46,18.2/6:SOUND 659.26,18.2/6:SOUND 587.33,18.2/6 */ } });
  T({ baris: 1260, jalan: function () { /* SOUND 1046.5,18.2:SOUND 783.99,18.2/2:SOUND 698.46,18.2/6:SOUND 659.26,18.2/6:SOUND 698.46,18.2/6:SOUND 587.33,18.2 */ } });
  T({ baris: 1270, jalan: function (m) { m.locate(16, 1); m.cetak("DO YOU WANT INSTRUCTIONS (Y OR N)?"); } });
  T({ baris: 1280, jalan: function (m) {
      m.v['K$'] = m.inkey();
      if (m.v['K$'] === 'Y' || m.v['K$'] === 'y') m.lompat(6930);
    } });
  T({ baris: 1290, jalan: function (m) { if (m.v['K$'] !== 'N' && m.v['K$'] !== 'n') m.lompat(1270); } });
  /* 1300 `CLEAR` mengosongkan SELURUH variabel — dan baris 5340 melompat ke sini
     untuk memulai permainan baru. Jadi tiga belas gambar di baris 1340-2030
     dibangun ulang dari nol tiap kali, termasuk ratusan penugasan lariknya. */
  T({ baris: 1300, jalan: function (m) { m.cls(); m.kosongkanVariabel(); } });
  T({ baris: 1310, jalan: function () { /* RANDOMIZE(VAL(RIGHT$(TIME$,2))) */ } });
  /* 1320 F1 menembak meriam, F2 melepas torpedo, dan keempat panah menggeser kapal.
     Enam jebakan, dan sesudah baris ini gelung utamanya tidak pernah membaca
     tombol lagi kecuali untuk angka kecepatan. */
  T({ baris: 1320, jalan: function (m) {
      m.pasangJebakan(1, 5350); m.pasangJebakan(2, 5750);
      m.pasangJebakan(11, 1100); m.pasangJebakan(12, 1120);
      m.pasangJebakan(13, 1140); m.pasangJebakan(14, 1160);
    } });
  /* 1330 Satu DRAW menggambar TIGA ukuran pesawat sekaligus, berjajar ke kanan —
     dan baris 1340 memungut ketiganya dengan tiga GET dari petak yang
     berbeda. Perspektif, dibangun sebagai satu gambar. */
  T({ baris: 1330, jalan: function (m) {
      m.locate(8, 1); m.cetak('IMPERIAL FIGHTER:  ');
      m.gambar('C2;BM145,59;M+0,0;BM+10,1;M+0,-2;M+2,2;M+0,-2;BM+10,-1;'
             + 'M+0,4;BM+6,-4;M+0,4;M+0,-2;M-6,0');
    } });
  /* 1340 GET (145,59)-(145,59) memungut SATU PIKSEL: itu gambar pesawat yang masih
     terlalu jauh untuk berbentuk apa pun. */
  T({ baris: 1340, jalan: function (m) {
      m.dim('IM()', 6); m.dim('IM1()', 6); m.dim('IM2()', 6); m.dim('IM3()', 6);
      m.v['IM()'] = m.ambil(145, 59, 145, 59);
      m.v['IM1()'] = m.ambil(145, 59, 145, 59);
      m.v['IM2()'] = m.ambil(155, 58, 157, 60);
      m.v['IM3()'] = m.ambil(167, 57, 173, 61);
    } });
  DIMISI(1350, [['IM4()',13]], [['IM4()',0,22], ['IM4()',1,7], ['IM4()',2,128], ['IM4()',3,-32760], ['IM4()',4,2048], ['IM4()',5,128], ['IM4()',6,-22008], ['IM4()',7,-22358], ['IM4()',8,128], ['IM4()',9,-32760], ['IM4()',10,2048], ['IM4()',11,128], ['IM4()',12,8]]);
  DIMISI(1360, [['IM5()',20]], [['IM5()',0,26], ['IM5()',1,9], ['IM5()',2,128], ['IM5()',3,-32768], ['IM5()',4,128], ['IM5()',5,-32768], ['IM5()',6,128], ['IM5()',7,-32768], ['IM5()',8,128], ['IM5()',9,-32768], ['IM5()',10,-21846], ['IM5()',11,-32598], ['IM5()',12,128]]);
  ISI(1370, [['IM5()',13,-32768], ['IM5()',14,128], ['IM5()',15,-32768], ['IM5()',16,128], ['IM5()',17,-32768], ['IM5()',18,128], ['IM5()',19,-32768]]);
  DIMISI(1380, [['IM6()',44]], [['IM6()',0,34], ['IM6()',1,17], ['IM6()',2,2048], ['IM6()',5,32], ['IM6()',7,-32768], ['IM6()',9,512], ['IM6()',12,-32760], ['IM6()',14,8192], ['IM6()',15,32], ['IM6()',17,2176], ['IM6()',20,2], ['IM6()',23,128], ['IM6()',25,8192], ['IM6()',28,8]]);
  ISI(1390, [['IM6()',29,128], ['IM6()',30,512], ['IM6()',31,2], ['IM6()',33,-30720], ['IM6()',36,32], ['IM6()',38,-32768], ['IM6()',40,512], ['IM6()',43,8]]);
  DIMISI(1400, [['IM7()',44]], []);
  ISI(1410, [['IM7()',0,30], ['IM7()',1,21], ['IM7()',2,-22006], ['IM7()',3,-22358], ['IM7()',4,32], ['IM7()',5,8192], ['IM7()',6,-21846], ['IM7()',7,-32598], ['IM7()',8,2048], ['IM7()',9,128]]);
  ISI(1420, [['IM7()',10,2048], ['IM7()',11,128], ['IM7()',12,2048], ['IM7()',13,128], ['IM7()',14,2048], ['IM7()',15,128], ['IM7()',16,2048], ['IM7()',17,128], ['IM7()',18,2048], ['IM7()',19,128]]);
  ISI(1430, [['IM7()',20,2560], ['IM7()',21,32], ['IM7()',22,2048], ['IM7()',23,128], ['IM7()',24,8704], ['IM7()',25,128], ['IM7()',26,2048], ['IM7()',27,128], ['IM7()',28,2048], ['IM7()',29,128]]);
  ISI(1440, [['IM7()',30,2048], ['IM7()',31,128], ['IM7()',32,2048], ['IM7()',33,128], ['IM7()',34,2048], ['IM7()',35,128], ['IM7()',36,2048], ['IM7()',37,128], ['IM7()',38,-22518], ['IM7()',39,-22358]]);
  ISI(1450, [['IM7()',40,2592], ['IM7()',41,8192], ['IM7()',42,-21846], ['IM7()',43,-32598]]);
  DIMISI(1460, [['IM8()',102]], []);
  ISI(1470, [['IM8()',0,50], ['IM8()',1,29], ['IM8()',3,2048], ['IM8()',7,10], ['IM8()',10,2048], ['IM8()',11,128], ['IM8()',14,8200], ['IM8()',17,2048], ['IM8()',18,8], ['IM8()',21,514]]);
  ISI(1480, [['IM8()',25,-32640], ['IM8()',28,8192], ['IM8()',29,32], ['IM8()',32,2184], ['IM8()',35,514], ['IM8()',36,2], ['IM8()',38,2048], ['IM8()',39,-32760], ['IM8()',40,128], ['IM8()',42,8352]]);
  ISI(1490, [['IM8()',43,-32736], ['IM8()',45,8194], ['IM8()',46,2176], ['IM8()',47,128], ['IM8()',48,512], ['IM8()',49,34], ['IM8()',50,-32766], ['IM8()',51,128], ['IM8()',52,10250], ['IM8()',54,-24448]]);
  ISI(1500, [['IM8()',55,8704], ['IM8()',56,32], ['IM8()',58,136], ['IM8()',59,-24446], ['IM8()',61,-32256], ['IM8()',62,514], ['IM8()',63,128], ['IM8()',65,-30592], ['IM8()',66,8], ['IM8()',68,8192]]);
  ISI(1510, [['IM8()',69,8224], ['IM8()',72,8200], ['IM8()',73,128], ['IM8()',75,512], ['IM8()',76,34], ['IM8()',79,-22528], ['IM8()',80,128], ['IM8()',83,8224], ['IM8()',86,2048], ['IM8()',87,8]]);
  ISI(1520, [['IM8()',90,2050], ['IM8()',94,136], ['IM8()',97,10240], ['IM8()',101,8]]);
  T({ baris: 1530, jalan: function (m) {
      m.locate(10, 1); m.cetak('DARTH VADER     :  ');
      m.gambar('C2;BM145,75;M+0,0;BM+10,1;M+0,-2;M+2,2;M+0,-2;BM+11,-1;'
             + 'M-1,1;M+0,2;M+1,1;BM+4,-4;M+1,1;M+0,2;M-1,1;BM+1,-2;M-6,0');
    } });
  T({ baris: 1540, jalan: function (m) {
      m.dim('DV()', 6); m.dim('DV1()', 6); m.dim('DV2()', 6); m.dim('DV3()', 6);
      m.v['DV()'] = m.ambil(145, 75, 145, 75);
      m.v['DV1()'] = m.ambil(145, 75, 145, 75);
      m.v['DV2()'] = m.ambil(155, 74, 157, 76);
      m.v['DV3()'] = m.ambil(167, 73, 173, 77);
    } });
  DIMISI(1550, [['DV4()',13]], []);
  ISI(1560, [['DV4()',0,22], ['DV4()',1,7], ['DV4()',2,8], ['DV4()',3,8320], ['DV4()',4,8192], ['DV4()',5,128], ['DV4()',6,-22008], ['DV4()',7,-22358], ['DV4()',8,128], ['DV4()',9,8200]]);
  ISI(1570, [['DV4()',10,8192], ['DV4()',11,8], ['DV4()',12,128]]);
  DIMISI(1580, [['DV5()',20]], []);
  ISI(1590, [['DV5()',0,26], ['DV5()',1,9], ['DV5()',2,8], ['DV5()',3,8], ['DV5()',4,32], ['DV5()',5,2], ['DV5()',6,128], ['DV5()',7,-32768], ['DV5()',8,128], ['DV5()',9,-32768]]);
  ISI(1600, [['DV5()',10,-21846], ['DV5()',11,-32598], ['DV5()',12,128], ['DV5()',13,-32768], ['DV5()',14,128], ['DV5()',15,-32768], ['DV5()',16,32], ['DV5()',17,2], ['DV5()',18,8], ['DV5()',19,8]]);
  DIMISI(1610, [['DV6()',32]], []);
  ISI(1620, [['DV6()',0,30], ['DV6()',1,15], ['DV6()',2,-22528], ['DV6()',4,2], ['DV6()',6,8], ['DV6()',8,34], ['DV6()',10,-32640], ['DV6()',12,8320], ['DV6()',14,2176], ['DV6()',16,512]]);
  ISI(1630, [['DV6()',19,2176], ['DV6()',21,2080], ['DV6()',23,2056], ['DV6()',25,8194], ['DV6()',27,-32768], ['DV6()',29,2], ['DV6()',31,168]]);
  DIMISI(1640, [['DV7()',44]], []);
  ISI(1650, [['DV7()',0,32], ['DV7()',1,21], ['DV7()',2,10752], ['DV7()',3,-24406], ['DV7()',4,-32768], ['DV7()',5,-30720], ['DV7()',6,-22014], ['DV7()',7,682], ['DV7()',8,520], ['DV7()',9,-30688]]);
  ISI(1660, [['DV7()',10,544], ['DV7()',11,8224], ['DV7()',12,512], ['DV7()',13,32], ['DV7()',14,512], ['DV7()',15,32], ['DV7()',16,512], ['DV7()',17,32], ['DV7()',18,512], ['DV7()',19,32]]);
  ISI(1670, [['DV7()',20,512], ['DV7()',21,136], ['DV7()',22,512], ['DV7()',23,32], ['DV7()',24,2048], ['DV7()',25,160], ['DV7()',26,512], ['DV7()',27,32], ['DV7()',28,512], ['DV7()',29,32]]);
  ISI(1680, [['DV7()',30,512], ['DV7()',31,32], ['DV7()',32,512], ['DV7()',33,32], ['DV7()',34,520], ['DV7()',35,544], ['DV7()',36,546], ['DV7()',37,2080], ['DV7()',38,-21888], ['DV7()',39,-24534]]);
  ISI(1690, [['DV7()',40,546], ['DV7()',41,-32640], ['DV7()',42,-22006], ['DV7()',43,170]]);
  DIMISI(1700, [['DV8()',76]], []);
  ISI(1710, [['DV8()',0,46], ['DV8()',1,25], ['DV8()',3,10752], ['DV8()',4,128], ['DV8()',6,-32768], ['DV8()',7,32], ['DV8()',9,-22526], ['DV8()',10,8], ['DV8()',12,512], ['DV8()',13,2]]);
  ISI(1720, [['DV8()',16,-32640], ['DV8()',18,512], ['DV8()',19,8224], ['DV8()',21,2048], ['DV8()',22,2056], ['DV8()',24,8192], ['DV8()',25,2082], ['DV8()',27,-32766], ['DV8()',28,-30592], ['DV8()',30,-32248]]);
  ISI(1730, [['DV8()',31,10240], ['DV8()',32,128], ['DV8()',33,-30712], ['DV8()',34,2048], ['DV8()',35,128], ['DV8()',36,-24536], ['DV8()',37,2048], ['DV8()',38,128], ['DV8()',39,-32630], ['DV8()',40,2048]]);
  ISI(1740, [['DV8()',41,672], ['DV8()',42,-32760], ['DV8()',44,2184], ['DV8()',45,10], ['DV8()',47,8322], ['DV8()',48,32], ['DV8()',50,-32640], ['DV8()',51,128], ['DV8()',53,-32224], ['DV8()',56,-30712]]);
  ISI(1750, [['DV8()',59,-24062], ['DV8()',62,-32768], ['DV8()',63,168], ['DV8()',65,8192], ['DV8()',66,136], ['DV8()',68,2048], ['DV8()',69,136], ['DV8()',71,512], ['DV8()',72,136], ['DV8()',75,168]]);
  T({ baris: 1760, jalan: function (m) {
      m.locate(12, 1); m.cetak('DEATH STAR      :  ');
      m.gambar('C3;BM145,91;M+0,0;BM+11,-1;M-1,1;M+2,0;M-1,1;BM+12,-3;'
             + 'M+1,0;M+1,1;M-3,0;M+0,1;M+3,0;M-1,1;M-1,0');
    } });
  T({ baris: 1770, jalan: function (m) {
      m.gambar('C3;BM+12,-5;M+2,0;M+1,1;M-4,0;M-1,1;M+6,0;M+0,1;M-6,0;'
             + 'M+0,1;M+6,0;M-1,1;M-4,0;M+1,1;M+2,0');
    } });
  /* 1780 Bintang Kematian punya EMPAT ukuran, satu lebih banyak daripada kedua
     pesawat — karena ia yang paling lama didekati. */
  T({ baris: 1780, jalan: function (m) {
      ['DS()', 'DS1()', 'DS2()', 'DS3()', 'DS4()'].forEach(function (nm) { m.dim(nm, 8); });
      m.v['DS()'] = m.ambil(145, 91, 145, 91);
      m.v['DS1()'] = m.ambil(145, 91, 145, 91);
      m.v['DS2()'] = m.ambil(155, 90, 157, 92);
      m.v['DS3()'] = m.ambil(167, 89, 170, 92);
      m.v['DS4()'] = m.ambil(178, 87, 184, 93);
    } });
  DIMISI(1790, [['EXPL3()',18], ['EXPL4()',18], ['EXPL5()',18], ['EXPL6()',18], ['EXPL7()',18], ['EXPL8()',18]], []);
  T({ baris: 1800, jalan: function () { /* DATA — lihat `data` di objek program */ } });
  T({ baris: 1810, jalan: function (m) {
      m.dim('EXPL3()', 18);
      for (m.v.I = 0; m.v.I <= 18; m.v.I++) m.v['EXPL3()'][m.v.I] = m.baca();
    } });
  T({ baris: 1820, jalan: function () { /* DATA — lihat `data` di objek program */ } });
  T({ baris: 1830, jalan: function (m) {
      m.dim('EXPL4()', 18);
      for (m.v.I = 0; m.v.I <= 18; m.v.I++) m.v['EXPL4()'][m.v.I] = m.baca();
    } });
  T({ baris: 1840, jalan: function () { /* DATA — lihat `data` di objek program */ } });
  T({ baris: 1850, jalan: function (m) {
      m.dim('EXPL5()', 18);
      for (m.v.I = 0; m.v.I <= 18; m.v.I++) m.v['EXPL5()'][m.v.I] = m.baca();
    } });
  T({ baris: 1860, jalan: function () { /* DATA — lihat `data` di objek program */ } });
  T({ baris: 1870, jalan: function (m) {
      m.dim('EXPL6()', 18);
      for (m.v.I = 0; m.v.I <= 18; m.v.I++) m.v['EXPL6()'][m.v.I] = m.baca();
    } });
  T({ baris: 1880, jalan: function () { /* DATA — lihat `data` di objek program */ } });
  T({ baris: 1890, jalan: function (m) {
      m.dim('EXPL7()', 18);
      for (m.v.I = 0; m.v.I <= 18; m.v.I++) m.v['EXPL7()'][m.v.I] = m.baca();
    } });
  T({ baris: 1900, jalan: function () { /* DATA — lihat `data` di objek program */ } });
  T({ baris: 1910, jalan: function (m) {
      m.dim('EXPL8()', 18);
      for (m.v.I = 0; m.v.I <= 18; m.v.I++) m.v['EXPL8()'][m.v.I] = m.baca();
    } });
  T({ baris: 1920, jalan: function (m) { m.locate(17, 1); m.cetak("SELECT SKILL LEVEL FROM 0 TO 3"); m.barisBaru(); } });
  T({ baris: 1930, jalan: function (m) {
      m.v['S$'] = m.inkey();
      if ('0123'.indexOf(m.v['S$']) < 0 || m.v['S$'] === '') m.lompat(1920);
    } });
  T({ baris: 1940, jalan: function (m) { m.v.SKILL = parseInt(m.v['S$'], 10) || 0; m.cls(); } });
  DIMISI(1950, [['LASAR()',381]], []);
  ISI(1960, [['LASAR()',0,148], ['LASAR()',1,40], ['LASAR()',2,64], ['LASAR()',11,5136], ['LASAR()',20,16385], ['LASAR()',21,16385], ['LASAR()',29,5120], ['LASAR()',31,20], ['LASAR()',38,256], ['LASAR()',39,64], ['LASAR()',40,256], ['LASAR()',41,64], ['LASAR()',48,20]]);
  ISI(1970, [['LASAR()',50,5120], ['LASAR()',57,16385], ['LASAR()',60,16385], ['LASAR()',66,5120], ['LASAR()',70,20], ['LASAR()',75,256], ['LASAR()',76,64], ['LASAR()',79,256], ['LASAR()',85,4], ['LASAR()',89,20480], ['LASAR()',94,20480], ['LASAR()',99,5]]);
  ISI(1980, [['LASAR()',103,1280], ['LASAR()',109,80], ['LASAR()',113,80], ['LASAR()',118,1280], ['LASAR()',122,5], ['LASAR()',128,20480], ['LASAR()',131,20480], ['LASAR()',138,5], ['LASAR()',140,1280], ['LASAR()',148,80], ['LASAR()',150,80]]);
  ISI(1990, [['LASAR()',157,1024], ['LASAR()',159,1], ['LASAR()',167,16385], ['LASAR()',168,5120], ['LASAR()',177,276], ['LASAR()',178,64], ['LASAR()',186,256], ['LASAR()',187,84], ['LASAR()',196,21505], ['LASAR()',205,5120], ['LASAR()',206,16385]]);
  ISI(2000, [['LASAR()',214,256], ['LASAR()',215,64], ['LASAR()',216,20], ['LASAR()',224,4], ['LASAR()',225,256], ['LASAR()',233,20480], ['LASAR()',235,20480], ['LASAR()',242,1280], ['LASAR()',245,5], ['LASAR()',252,80], ['LASAR()',255,80]]);
  ISI(2010, [['LASAR()',261,5], ['LASAR()',264,1280], ['LASAR()',270,20480], ['LASAR()',274,20480], ['LASAR()',279,1280], ['LASAR()',284,5], ['LASAR()',289,80], ['LASAR()',294,80], ['LASAR()',298,1], ['LASAR()',303,1024], ['LASAR()',307,5120]]);
  ISI(2020, [['LASAR()',313,16385], ['LASAR()',316,256], ['LASAR()',317,64], ['LASAR()',323,20], ['LASAR()',326,20], ['LASAR()',332,256], ['LASAR()',333,64], ['LASAR()',335,16385], ['LASAR()',342,5120], ['LASAR()',344,5120], ['LASAR()',352,16385]]);
  ISI(2030, [['LASAR()',353,256], ['LASAR()',354,64], ['LASAR()',362,20], ['LASAR()',363,20], ['LASAR()',371,256], ['LASAR()',372,16448], ['LASAR()',381,4096]]);
  rem(2040);
  /* 2050 Bintang Kematian mulai 70.000 sampai 102.000 km jauhnya; pesawat kekaisaran
     25.000; Vader 40.000 sampai 72.000. Urutan kedatangannya sudah ditentukan
     di sini, tiga baris, tanpa satu pun jadwal. */
  T({ baris: 2050, jalan: function (m) {
      m.v.M = Math.floor(m.acak() * 61) + 10;
      m.v.N = Math.floor(m.acak() * 21) + 10;
      m.v.O = Math.floor(m.acak() * 32001) + 70000;
    } });
  T({ baris: 2060, jalan: function (m) { m.v['E'] = Math.floor( m.acak() * 61 ) + 10; m.v['F'] = Math.floor( m.acak() * 21 ) + 10; m.v['G'] = 25000; } });
  T({ baris: 2070, jalan: function (m) {
      m.v.H = Math.floor(m.acak() * 61) + 10;
      m.v.I = Math.floor(m.acak() * 21) + 10;
      m.v.J = Math.floor(m.acak() * 32001) + 40000;
    } });
  T({ baris: 2080, jalan: function (m) { m.v['Q'] = 5; m.v['Z'] = 3; } });
  T({ baris: 2090, jalan: function (m) { m.v['IMX'] = 38; m.v['IMY'] = 21; m.v['IMR1'] = 1; m.v['IMR2'] = 1; } });
  T({ baris: 2100, jalan: function (m) { m.v['DVX'] = 38; m.v['DVY'] = 21; m.v['DVR1'] = 1; m.v['DVR2'] = 1; } });
  /* 2110 2110-2140 tingkat kesulitan mengatur DUA hal sekaligus: A1/A2 batas waktunya,
     dan BYPASS seberapa jarang musuh mengelak. Tingkat 3 tidak menyetel
     BYPASS sama sekali — nilainya tetap nol, dan nol berarti mengelak SETIAP
     putaran. */
  T({ baris: 2110, jalan: function (m) { if (m.v.SKILL === 0) { m.v.A1 = 5; m.v.A2 = 0; m.v.BYPASS = 3; } } });
  T({ baris: 2120, jalan: function (m) { if (m.v.SKILL === 1) { m.v.A1 = 3; m.v.A2 = 0; m.v.BYPASS = 2; } } });
  T({ baris: 2130, jalan: function (m) { if (m.v.SKILL === 2) { m.v.A1 = 2; m.v.A2 = 45; m.v.BYPASS = 1; } } });
  T({ baris: 2140, jalan: function (m) { if (m.v.SKILL === 3) { m.v.A1 = 2; m.v.A2 = 30; } } });
  T({ baris: 2150, jalan: function (m) { m.v['K$'] = '5'; } });
  T({ baris: 2160, jalan: function (m) { m.garis(1, 1, 76, 42, 3, 'B'); } });
  /* 2170 2170-2180 garis bidik: dua deret titik berjarak enam piksel, dengan LUBANG
     selebar dua belas di tengahnya. Lubang itu yang jadi sasarannya. */
  T({ baris: 2170, jalan: function (m) {
      m.gambar('C3;BM2,21;' + ulang('M+0,0;BM+6,0;', 5)
             + 'M+0,0;BM+12,0;' + ulang('M+0,0;BM+6,0;', 5) + 'M+0,0');
    } });
  T({ baris: 2180, jalan: function (m) {
      m.gambar('C3;BM38,3;' + ulang('M+0,0;BM+0,3;', 5)
             + 'M+0,0;BM+0,6;' + ulang('M+0,0;BM+0,3;', 5) + 'M+0,0');
    } });
  T({ baris: 2190, jalan: function (m) { m.locate(8, 1); m.cetak("REPUBLIC      X-WING     STAR FIGHTER"); m.barisBaru(); } });
  T({ baris: 2200, jalan: function (m) { m.locate(10, 5); m.cetak("TORPEDOES"); m.barisBaru(); } });
  T({ baris: 2210, jalan: function (m) { m.locate(12, 1); m.cetak("HOR.   VERT. DIRECTION"); m.barisBaru(); } });
  T({ baris: 2220, jalan: function (m) { m.locate(15, 1); m.cetak("SPEED MACH"); m.barisBaru(); } });
  T({ baris: 2230, jalan: function (m) { m.locate(17, 1); m.cetak("RADAR TARGETS"); m.barisBaru(); } });
  T({ baris: 2240, jalan: function (m) { m.locate(18, 8); m.cetak("KM TO IMPERIAL FIGHTER"); m.barisBaru(); } });
  T({ baris: 2250, jalan: function (m) { m.locate(19, 8); m.cetak("KM TO DARTH VADER"); m.barisBaru(); } });
  T({ baris: 2260, jalan: function (m) { m.locate(20, 8); m.cetak("KM TO DEATH STAR"); m.barisBaru(); } });
  T({ baris: 2270, jalan: function (m) { m.locate(22, 1); m.cetak("TIME REMAINING"); m.barisBaru(); } });
  T({ baris: 2280, jalan: function () { /* PLAY"T250" */ } });
  /* 2290 VAL(RIGHT$(TIME$,2)) — detik dari jam. */
  T({ baris: 2290, jalan: function (m) { m.v.SEC1 = 0; } });
  T({ baris: 2300, jalan: function (m) { m.gosub(1180); } });
  rem(2310);
  T({ baris: 2320, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 2330, jalan: function (m) { m.taruh(38, 21, m.v['DS1()'], 'XOR'); } });
  T({ baris: 2340, jalan: function (m) { m.locate(10, 1); m.cetak(bas((m.v['Z'] || 0))); m.barisBaru(); } });
  /* 2350 `-V` dicetak dengan tanda dibalik: panah atas menambah V, tapi yang
     ditampilkan kebalikannya, karena yang bergerak kapal pemain dan yang
     terlihat bergerak justru sasarannya. */
  T({ baris: 2350, jalan: function (m) {
      m.locate(13, 1);
      m.cetak(bas(m.v.W || 0) + '     ' + bas(-(m.v.V || 0)));
    } });
  T({ baris: 2360, jalan: function (m) { m.locate(15, 12); m.cetak(bas((m.v['Q'] || 0) * 10)); m.barisBaru(); } });
  T({ baris: 2370, jalan: function (m) { m.v.GS = m.v.G - (m.v.S || 0); if (m.v.GS < 0) m.v.GS = 0; } });
  T({ baris: 2380, jalan: function (m) { m.locate(18, 1); m.cetak(bas((m.v['GS'] || 0))); m.barisBaru(); } });
  T({ baris: 2390, jalan: function (m) { m.v.JS = m.v.J - (m.v.S || 0); if (m.v.JS < 0) m.v.JS = 0; } });
  T({ baris: 2400, jalan: function (m) { m.locate(19, 1); m.cetak(bas((m.v['JS'] || 0))); m.barisBaru(); } });
  T({ baris: 2410, jalan: function (m) { m.v.OS = m.v.O - (m.v.S || 0); if (m.v.OS < 0) m.v.OS = 0; } });
  T({ baris: 2420, jalan: function (m) { m.locate(20, 1); m.cetak(bas((m.v['OS'] || 0))); m.barisBaru(); } });
  T({ baris: 2430, jalan: function (m) {
      m.locate(22, 16);
      m.cetak(bas((m.v.A1 || 0)) + ':' + bas((m.v.A2NEW || 0)));
    } });
  T({ baris: 2440, jalan: function () { /* SOUND 37*Q,1 */ } });
  T({ baris: 2450, jalan: function (m) { m.taruh(38, 21, m.v['DS1()'], 'XOR'); } });
  T({ baris: 2460, jalan: function (m) { m.gosub(1180); } });
  rem(2470);
  /* 2480 `IF O-S=30000 OR O-S>30000` — dua perbandingan untuk satu `>=`. Bentuk yang
     dipakai orang yang belum yakin penafsirnya punya `>=`. */
  T({ baris: 2480, jalan: function (m) { if (m.v.O - (m.v.S || 0) >= 30000) m.lompat(2840); } });
  /* 2490 2490-2510 tiga ambang jarak, tiga ukuran gambar. Tiap satu punya benderanya
     sendiri supaya penggantiannya cuma sekali — dan DSFLAG mengingat gambar
     MANA yang harus dipakai untuk menghapus jejak lamanya. */
  T({ baris: 2490, jalan: function (m) {
      if (m.v.O - (m.v.S || 0) < 20000 && !m.v.DSTAR2) {
        m.v.DSTAR2 = 1; m.v.DSFLAG = 1; m.v['DS()'] = salin(m.v['DS2()']);
      }
    } });
  T({ baris: 2500, jalan: function (m) {
      if (m.v.O - (m.v.S || 0) < 10000 && !m.v.DSTAR3) {
        m.v.DSTAR3 = 1; m.v.DSFLAG = 2; m.v['DS()'] = salin(m.v['DS3()']);
      }
    } });
  T({ baris: 2510, jalan: function (m) {
      if (m.v.O - (m.v.S || 0) < 5000 && !m.v.DSTAR4) {
        m.v.DSTAR4 = 1; m.v.DSFLAG = 3; m.v['DS()'] = salin(m.v['DS4()']);
      }
    } });
  T({ baris: 2520, jalan: function (m) { if ((m.v.FLAG1 || 0) !== m.v.BYPASS) { m.v.FLAG1 = ((m.v.FLAG1 || 0) || 0) + 1; m.lompat(2550); } } });
  T({ baris: 2530, jalan: function (m) { m.v['FLAG1'] = 0; } });
  T({ baris: 2540, jalan: function (m) { m.v['M'] = (m.v['M'] || 0) + Math.floor( m.acak() * 5 ) - 2; m.v['N'] = (m.v['N'] || 0) + Math.floor( m.acak() * 5 ) - 2; } });
  T({ baris: 2550, jalan: function (m) { m.v['M'] = (m.v['M'] || 0) - (m.v['W'] || 0); m.v['N'] = (m.v['N'] || 0) - (m.v['V'] || 0); } });
  T({ baris: 2560, jalan: function (m) { if (m.v.M < 2) m.v.M = 2 + Math.floor(m.acak() * 3); } });
  T({ baris: 2570, jalan: function (m) { if (m.v.M > 69) m.v.M = 69 - Math.floor(m.acak() * 3); } });
  T({ baris: 2580, jalan: function (m) { if (m.v.N < 2) m.v.N = 2 + Math.floor(m.acak() * 3); } });
  T({ baris: 2590, jalan: function (m) { if (m.v.N > 35) m.v.N = 35 - Math.floor(m.acak() * 3); } });
  T({ baris: 2600, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 2610, jalan: function (m) { m.taruh((m.v['M'] || 0), (m.v['N'] || 0), m.v['DS()'], 'XOR'); } });
  T({ baris: 2620, jalan: function (m) { if (!m.v.DSNEW) { m.v.DSNEW = 1; m.lompat(2680); } } });
  T({ baris: 2630, jalan: function (m) { if ((m.v['DSFLAG'] || 0) === 0) m.lompat(2670); } });
  T({ baris: 2640, jalan: function (m) {
      if (m.v.DSFLAG === 1) {
        m.v.DSFLAG = 0; m.taruh(m.v.MP, m.v.NP, m.v['DS1()'], 'XOR'); m.lompat(2680);
      }
    } });
  T({ baris: 2650, jalan: function (m) {
      if (m.v.DSFLAG === 2) {
        m.v.DSFLAG = 0; m.taruh(m.v.MP, m.v.NP, m.v['DS2()'], 'XOR'); m.lompat(2680);
      }
    } });
  T({ baris: 2660, jalan: function (m) {
      if (m.v.DSFLAG === 3) {
        m.v.DSFLAG = 0; m.taruh(m.v.MP, m.v.NP, m.v['DS3()'], 'XOR'); m.lompat(2680);
      }
    } });
  T({ baris: 2670, jalan: function (m) { m.taruh((m.v['MP'] || 0), (m.v['NP'] || 0), m.v['DS()'], 'XOR'); } });
  T({ baris: 2680, jalan: function (m) { m.gosub(1180); } });
  T({ baris: 2690, jalan: function (m) { m.v['MP'] = (m.v['M'] || 0); m.v['NP'] = (m.v['N'] || 0); } });
  T({ baris: 2700, jalan: function (m) { if (m.v.O - (m.v.S || 0) > 10000 || m.v.FLAG === 1) m.lompat(2840); } });
  T({ baris: 2710, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 2720, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 2730, jalan: function (m) { m.locate(24, 1); m.cetak("*** DEATH STAR WITHIN TORPEDO RANGE ***"); } });
  T({ baris: 2740, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 2750, jalan: function (m) { m.locate(24, 1); m.cetak("                                       "); } });
  T({ baris: 2760, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 2770, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 2780, jalan: function (m) { m.locate(24, 1); m.cetak("*** DEATH STAR WITHIN TORPEDO RANGE ***"); } });
  T({ baris: 2790, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 2800, jalan: function (m) { m.locate(24, 1); m.cetak("                                       "); } });
  T({ baris: 2810, jalan: function (m) { m.gosub(1180); } });
  T({ baris: 2820, jalan: function (m) { m.v['FLAG'] = 1; } });
  rem(2830);
  T({ baris: 2840, jalan: function (m) { m.gosub(1190); } });
  /* 2850 Bagian pertama baris ini `GOSUB 1180`, bagian kedua `GOTO 3910` — dan
     keduanya di baris yang sama. Di penelusur GOSUB-nya jadi bagian sendiri
     supaya lompatannya terjadi SESUDAH subrutin itu pulang. */
  T({ baris: 2850, jalan: function (m) { if (m.v.G - (m.v.S || 0) > 26000) { m.gosub(1180); return; } } });
  /* 2860 IMX,IMY titik bidik dan IMR1,IMR2 JANGKAUAN TEMBAKNYA — dan ketiganya ikut
     membesar bersama gambarnya. Pesawat yang lebih dekat lebih mudah kena,
     tanpa satu pun perhitungan tersendiri. */
  T({ baris: 2860, jalan: function (m) {
      if (m.v.G - (m.v.S || 0) < 20000 && !m.v.IMPFIGH2) {
        m.v.IMPFIGH2 = 1; m.v.IMFLAG = 1; m.v['IM()'] = salin(m.v['IM2()']);
        m.v.IMX = 37; m.v.IMY = 20; m.v.IMR1 = 2; m.v.IMR2 = 2;
      }
    } });
  T({ baris: 2870, jalan: function (m) {
      if (m.v.G - (m.v.S || 0) < 10000 && !m.v.IMPFIGH3) {
        m.v.IMPFIGH3 = 1; m.v.IMFLAG = 2; m.v['IM()'] = salin(m.v['IM3()']);
        m.v.IMX = 35; m.v.IMY = 19; m.v.IMR1 = 4; m.v.IMR2 = 3;
      }
    } });
  T({ baris: 2880, jalan: function (m) { if ((m.v.FLAG2 || 0) !== m.v.BYPASS) { m.v.FLAG2 = ((m.v.FLAG2 || 0) || 0) + 1; m.lompat(2910); } } });
  T({ baris: 2890, jalan: function (m) { m.v['FLAG2'] = 0; } });
  T({ baris: 2900, jalan: function (m) { m.v['E'] = (m.v['E'] || 0) + Math.floor( m.acak() * 5 ) - 2; m.v['F'] = (m.v['F'] || 0) + Math.floor( m.acak() * 5 ) - 2; } });
  T({ baris: 2910, jalan: function (m) { m.v['E'] = (m.v['E'] || 0) - (m.v['W'] || 0); m.v['F'] = (m.v['F'] || 0) - (m.v['V'] || 0); } });
  T({ baris: 2920, jalan: function (m) { if (m.v.E < 2) m.v.E = 2 + Math.floor(m.acak() * 3); } });
  T({ baris: 2930, jalan: function (m) { if (m.v.E > 69) m.v.E = 69 - Math.floor(m.acak() * 3); } });
  T({ baris: 2940, jalan: function (m) { if (m.v.F < 2) m.v.F = 2 + Math.floor(m.acak() * 3); } });
  T({ baris: 2950, jalan: function (m) { if (m.v.F > 37) m.v.F = 37 - Math.floor(m.acak() * 3); } });
  T({ baris: 2960, jalan: function (m) { m.taruh((m.v['E'] || 0), (m.v['F'] || 0), m.v['IM()'], 'XOR'); } });
  T({ baris: 2970, jalan: function (m) { if (!m.v.IMNEW) { m.v.IMNEW = 1; m.lompat(3020); } } });
  T({ baris: 2980, jalan: function (m) { if ((m.v['IMFLAG'] || 0) === 0) m.lompat(3010); } });
  T({ baris: 2990, jalan: function (m) {
      if (m.v.IMFLAG === 1) {
        m.v.IMFLAG = 0; m.taruh(m.v.EP, m.v.FP, m.v['IM1()'], 'XOR'); m.lompat(3020);
      }
    } });
  T({ baris: 3000, jalan: function (m) {
      if (m.v.IMFLAG === 2) {
        m.v.IMFLAG = 0; m.taruh(m.v.EP, m.v.FP, m.v['IM2()'], 'XOR'); m.lompat(3020);
      }
    } });
  T({ baris: 3010, jalan: function (m) { m.taruh((m.v['EP'] || 0), (m.v['FP'] || 0), m.v['IM()'], 'XOR'); } });
  T({ baris: 3020, jalan: function (m) { m.gosub(1180); } });
  T({ baris: 3030, jalan: function (m) { m.v['EP'] = (m.v['E'] || 0); m.v['FP'] = (m.v['F'] || 0); } });
  T({ baris: 3040, jalan: function (m) { if (m.v.G - (m.v.S || 0) > 5000 || m.v.FLAG3 === 1) m.lompat(3170); } });
  T({ baris: 3050, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 3060, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 3070, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER ATTACKS ****"); } });
  T({ baris: 3080, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 3090, jalan: function (m) { m.locate(24, 1); m.cetak("                                  "); } });
  T({ baris: 3100, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 3110, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 3120, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER ATTACKS ****"); } });
  T({ baris: 3130, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 3140, jalan: function (m) { m.locate(24, 1); m.cetak("                                  "); } });
  T({ baris: 3150, jalan: function (m) { m.gosub(1180); } });
  T({ baris: 3160, jalan: function (m) { m.v['FLAG3'] = 1; } });
  T({ baris: 3170, jalan: function (m) { if (m.v.G > (m.v.S || 0)) m.lompat(3910); } });
  rem(3180);
  T({ baris: 3190, jalan: function (m) {
      m.v.FLAG3 = 0; m.v.IMNEW = 0; m.v.IMNEW1 = 0;
      m.v.IMPFIGH2 = 0; m.v.IMPFIGH3 = 0;
      m.taruh(m.v.E, m.v.F, m.v['IM()'], 'XOR');
    } });
  T({ baris: 3200, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 3210, jalan: function (m) { m.v['DELTAX'] = 29 - (m.v['E'] || 0); m.v['DELTAY'] = 19 - (m.v['F'] || 0); } });
  T({ baris: 3220, jalan: function (m) { if (m.v.DELTAX > 0) m.v.E = m.v.E + 1; } });
  T({ baris: 3230, jalan: function (m) { if (m.v.DELTAX < 0) m.v.E = m.v.E - 1; } });
  T({ baris: 3240, jalan: function (m) { if (m.v.DELTAY > 0) m.v.F = m.v.F + 1; } });
  T({ baris: 3250, jalan: function (m) { if (m.v.DELTAY < 0) m.v.F = m.v.F - 1; } });
  T({ baris: 3260, jalan: function (m) { if (m.v.DELTAX === 0 && m.v.DELTAY === 0) m.lompat(3320); } });
  T({ baris: 3270, jalan: function (m) {
      m.taruh(m.v.E, m.v.F, m.v['IM()'], 'XOR');
      if (!m.v.IMNEW1) { m.v.IMNEW1 = 1; m.lompat(3290); }
    } });
  T({ baris: 3280, jalan: function (m) { m.taruh((m.v['EP'] || 0), (m.v['FP'] || 0), m.v['IM()'], 'XOR'); } });
  T({ baris: 3290, jalan: function (m) { m.v['EP'] = (m.v['E'] || 0); m.v['FP'] = (m.v['F'] || 0); } });
  T({ baris: 3300, jalan: function () { /* PLAY "P32" */ } });
  T({ baris: 3310, jalan: function (m) { m.lompat(3210); } });
  T({ baris: 3320, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 4, (m.v['FP'] || 0) - 1, m.v['IM4()'], 'XOR'); } });
  T({ baris: 3330, jalan: function (m) { m.taruh((m.v['EP'] || 0), (m.v['FP'] || 0), m.v['IM()'], 'XOR'); } });
  T({ baris: 3340, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 3350, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 9, (m.v['FP'] || 0) - 2, m.v['IM5()'], 'XOR'); } });
  T({ baris: 3360, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 4, (m.v['FP'] || 0) - 1, m.v['IM4()'], 'XOR'); } });
  T({ baris: 3370, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 3380, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 12, (m.v['FP'] || 0) - 6, m.v['IM6()'], 'XOR'); } });
  T({ baris: 3390, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 9, (m.v['FP'] || 0) - 2, m.v['IM5()'], 'XOR'); } });
  T({ baris: 3400, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 3410, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 9, (m.v['FP'] || 0) - 7, m.v['IM7()'], 'XOR'); } });
  T({ baris: 3420, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 12, (m.v['FP'] || 0) - 6, m.v['IM6()'], 'XOR'); } });
  T({ baris: 3430, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 3440, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 20, (m.v['FP'] || 0) - 14, m.v['IM8()'], 'XOR'); } });
  T({ baris: 3450, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 9, (m.v['FP'] || 0) - 7, m.v['IM7()'], 'XOR'); } });
  T({ baris: 3460, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 3470, jalan: function (m) { m.taruh((m.v['EP'] || 0) - 20, (m.v['FP'] || 0) - 14, m.v['IM8()'], 'XOR'); } });
  T({ baris: 3480, jalan: function (m) { m.untuk('J2', 10000, 100, -500); } });
  T({ baris: 3490, jalan: function () { /* SOUND J2,.001*18.2 */ } });
  T({ baris: 3500, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 3510, jalan: function () { /* FOR A=1 TO 50:NEXT A — jeda */ } });
  T({ baris: 3520, jalan: function (m) { m.untuk('J2', 10000, 100, -500); } });
  T({ baris: 3530, jalan: function () { /* SOUND J2,.001*18.2 */ } });
  T({ baris: 3540, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 3550, jalan: function (m) { m.v['G'] = (m.v['G'] || 0) + 25000; } });
  T({ baris: 3560, jalan: function (m) { m.v['E'] = Math.floor( m.acak() * 61 ) + 10; m.v['F'] = Math.floor( m.acak() * 21 ) + 10; } });
  T({ baris: 3570, jalan: function (m) { m.v['K'] = Math.floor( m.acak() * 10 ); } });
  T({ baris: 3580, jalan: function (m) { if ((m.v['K'] || 0) > (m.v['SKILL'] || 0)) m.lompat(3790); } });
  T({ baris: 3590, jalan: function (m) { [1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); }); } });
  T({ baris: 3600, jalan: function (m) { m.cls(); } });
  T({ baris: 3610, jalan: function (m) { m.cetak("BLAM!"); m.barisBaru(); } });
  T({ baris: 3620, jalan: function (m) { m.untuk('J2', 1000, 37, -10); } });
  T({ baris: 3630, jalan: function () { /* SOUND J2,.01*18.2 */ } });
  T({ baris: 3640, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 3650, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3660, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 3670, jalan: function (m) { m.cetak("YOU HAVE JUST BEEN SHOT DOWN BY AN"); } });
  T({ baris: 3680, jalan: function (m) { m.cetak("IMPERIAL SKY FIGHTER!"); m.barisBaru(); } });
  T({ baris: 3690, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3700, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 3710, jalan: function (m) { m.cetak("YOU ARE A HERO!"); m.barisBaru(); } });
  T({ baris: 3720, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3730, jalan: function (m) { m.cetak("UNFORTUNATELY, YOU ARE A DEAD HERO AND"); } });
  T({ baris: 3740, jalan: function (m) { m.cetak("DEAD HEROES DON'T WIN WARS. DARTH VADER"); } });
  T({ baris: 3750, jalan: function (m) { m.cetak("WINS!"); m.barisBaru(); } });
  T({ baris: 3760, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3770, jalan: function (m) { m.cetak("*********   YOU   LOSE!!   *********"); m.barisBaru(); } });
  T({ baris: 3780, jalan: function (m) { m.lompat(5310); } });
  T({ baris: 3790, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 3800, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER MISSED ****"); } });
  T({ baris: 3810, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 3820, jalan: function (m) { m.locate(24, 1); m.cetak("                                 "); } });
  T({ baris: 3830, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 3840, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 3850, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER MISSED ****"); } });
  T({ baris: 3860, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 3870, jalan: function (m) { m.locate(24, 1); m.cetak("                                 "); } });
  T({ baris: 3880, jalan: function (m) { m.v['IM()'] = salin(m.v['IM1()']); } });
  T({ baris: 3890, jalan: function (m) { m.gosub(1180); } });
  rem(3900);
  T({ baris: 3910, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 3920, jalan: function (m) { if (m.v.J - (m.v.S || 0) > 26000) { m.gosub(1180); return; } } });
  T({ baris: 3930, jalan: function (m) {
      if (m.v.J - (m.v.S || 0) < 20000 && !m.v.DVADER2) {
        m.v.DVADER2 = 1; m.v.DVFLAG = 1; m.v['DV()'] = salin(m.v['DV2()']);
        m.v.DVX = 37; m.v.DVY = 20; m.v.DVR1 = 2; m.v.DVR2 = 2;
      }
    } });
  T({ baris: 3940, jalan: function (m) {
      if (m.v.J - (m.v.S || 0) < 10000 && !m.v.DVADER3) {
        m.v.DVADER3 = 1; m.v.DVFLAG = 2; m.v['DV()'] = salin(m.v['DV3()']);
        m.v.DVX = 35; m.v.DVY = 19; m.v.DVR1 = 4; m.v.DVR2 = 3;
      }
    } });
  T({ baris: 3950, jalan: function (m) { if ((m.v.FLAG2 || 0) !== m.v.BYPASS) { m.v.FLAG2 = ((m.v.FLAG2 || 0) || 0) + 1; m.lompat(3980); } } });
  T({ baris: 3960, jalan: function (m) { m.v['FLAG2'] = 0; } });
  T({ baris: 3970, jalan: function (m) { m.v['H'] = (m.v['H'] || 0) + Math.floor( m.acak() * 5 ) - 2; m.v['I'] = (m.v['I'] || 0) + Math.floor( m.acak() * 5 ) - 2; } });
  T({ baris: 3980, jalan: function (m) { m.v['H'] = (m.v['H'] || 0) - (m.v['W'] || 0); m.v['I'] = (m.v['I'] || 0) - (m.v['V'] || 0); } });
  T({ baris: 3990, jalan: function (m) { if (m.v.H < 2) m.v.H = 2 + Math.floor(m.acak() * 3); } });
  T({ baris: 4000, jalan: function (m) { if (m.v.H > 69) m.v.H = 69 - Math.floor(m.acak() * 3); } });
  T({ baris: 4010, jalan: function (m) { if (m.v.I < 2) m.v.I = 2 + Math.floor(m.acak() * 3); } });
  T({ baris: 4020, jalan: function (m) { if (m.v.I > 37) m.v.I = 37 - Math.floor(m.acak() * 3); } });
  T({ baris: 4030, jalan: function (m) { m.taruh((m.v['H'] || 0), (m.v['I'] || 0), m.v['DV()'], 'XOR'); } });
  T({ baris: 4040, jalan: function (m) { if (!m.v.DVNEW) { m.v.DVNEW = 1; m.lompat(4090); } } });
  T({ baris: 4050, jalan: function (m) { if ((m.v['DVFLAG'] || 0) === 0) m.lompat(4080); } });
  T({ baris: 4060, jalan: function (m) {
      if (m.v.DVFLAG === 1) {
        m.v.DVFLAG = 0; m.taruh(m.v.HP, m.v.IP, m.v['DV1()'], 'XOR'); m.lompat(4090);
      }
    } });
  T({ baris: 4070, jalan: function (m) {
      if (m.v.DVFLAG === 2) {
        m.v.DVFLAG = 0; m.taruh(m.v.HP, m.v.IP, m.v['DV2()'], 'XOR'); m.lompat(4090);
      }
    } });
  T({ baris: 4080, jalan: function (m) { m.taruh((m.v['HP'] || 0), (m.v['IP'] || 0), m.v['DV()'], 'XOR'); } });
  T({ baris: 4090, jalan: function (m) { m.gosub(1180); } });
  T({ baris: 4100, jalan: function (m) { m.v['HP'] = (m.v['H'] || 0); m.v['IP'] = (m.v['I'] || 0); } });
  T({ baris: 4110, jalan: function (m) { if (m.v.J - (m.v.S || 0) > 5000 || m.v.FLAG4 === 1) m.lompat(4350); } });
  T({ baris: 4120, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 4130, jalan: function (m) { if ((m.v['DVGONE'] || 0) === 0) m.lompat(4240); } });
  T({ baris: 4140, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 4150, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER ATTACKS ****"); } });
  T({ baris: 4160, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 4170, jalan: function (m) { m.locate(24, 1); m.cetak("                                  "); } });
  T({ baris: 4180, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 4190, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 4200, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER ATTACKS ****"); } });
  T({ baris: 4210, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 4220, jalan: function (m) { m.locate(24, 1); m.cetak("                                  "); } });
  T({ baris: 4230, jalan: function (m) { m.lompat(4330); } });
  T({ baris: 4240, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 4250, jalan: function (m) { m.locate(24, 1); m.cetak("**** DARTH VADER ATTACKS ****"); } });
  T({ baris: 4260, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 4270, jalan: function (m) { m.locate(24, 1); m.cetak("                             "); } });
  T({ baris: 4280, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 4290, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 4300, jalan: function (m) { m.locate(24, 1); m.cetak("**** DARTH VADER ATTACKS ****"); } });
  T({ baris: 4310, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 4320, jalan: function (m) { m.locate(24, 1); m.cetak("                             "); } });
  T({ baris: 4330, jalan: function (m) { m.v['FLAG4'] = 1; } });
  T({ baris: 4340, jalan: function (m) { m.gosub(1180); } });
  T({ baris: 4350, jalan: function (m) { if (m.v.J > (m.v.S || 0)) m.lompat(5140); } });
  rem(4360);
  T({ baris: 4370, jalan: function (m) {
      m.v.FLAG4 = 0; m.v.DVNEW = 0; m.v.DVNEW1 = 0;
      m.v.DVADER2 = 0; m.v.DVADER3 = 0;
      m.taruh(m.v.H, m.v.I, m.v['DV()'], 'XOR');
    } });
  T({ baris: 4380, jalan: function (m) { m.gosub(1190); } });
  T({ baris: 4390, jalan: function (m) { m.v['DELTAX'] = 41 - (m.v['H'] || 0); m.v['DELTAY'] = 19 - (m.v['I'] || 0); } });
  T({ baris: 4400, jalan: function (m) { if (m.v.DELTAX > 0) m.v.H = m.v.H + 1; } });
  T({ baris: 4410, jalan: function (m) { if (m.v.DELTAX < 0) m.v.H = m.v.H - 1; } });
  T({ baris: 4420, jalan: function (m) { if (m.v.DELTAY > 0) m.v.I = m.v.I + 1; } });
  T({ baris: 4430, jalan: function (m) { if (m.v.DELTAY < 0) m.v.I = m.v.I - 1; } });
  T({ baris: 4440, jalan: function (m) { if (m.v.DELTAX === 0 && m.v.DELTAY === 0) m.lompat(4500); } });
  T({ baris: 4450, jalan: function (m) {
      m.taruh(m.v.H, m.v.I, m.v['DV()'], 'XOR');
      if (!m.v.DVNEW1) { m.v.DVNEW1 = 1; m.lompat(4470); }
    } });
  T({ baris: 4460, jalan: function (m) { m.taruh((m.v['HP'] || 0), (m.v['IP'] || 0), m.v['DV()'], 'XOR'); } });
  T({ baris: 4470, jalan: function (m) { m.v['HP'] = (m.v['H'] || 0); m.v['IP'] = (m.v['I'] || 0); } });
  T({ baris: 4480, jalan: function () { /* PLAY "P32" */ } });
  T({ baris: 4490, jalan: function (m) { m.lompat(4390); } });
  /* 4500 4500-4650 tembakan Vader digambar dengan larik DV4..DV8 — kecuali kalau
     `DVGONE` sudah menyala, yang berarti Vader sendiri sudah ditembak jatuh
     dan yang menyerang tinggal pesawat biasa. Maka gambar IM4..IM8 yang
     dipakai, dan seluruh pesannya ikut berganti. Satu bendera, dua musuh. */
  T({ baris: 4500, jalan: function (m) { m.taruh(m.v.HP, m.v.IP - 1, m.v[(m.v.DVGONE || 0) ? 'IM4()' : 'DV4()'], 'XOR'); } });
  T({ baris: 4510, jalan: function (m) { m.taruh((m.v['HP'] || 0), (m.v['IP'] || 0), m.v['DV()'], 'XOR'); } });
  T({ baris: 4520, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 4530, jalan: function (m) { m.taruh(m.v.HP + 3, m.v.IP - 2, m.v[(m.v.DVGONE || 0) ? 'IM5()' : 'DV5()'], 'XOR'); } });
  T({ baris: 4540, jalan: function (m) { m.taruh(m.v.HP, m.v.IP - 1, m.v[(m.v.DVGONE || 0) ? 'IM4()' : 'DV4()'], 'XOR'); } });
  T({ baris: 4550, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 4560, jalan: function (m) { m.taruh(m.v.HP + 2, m.v.IP - 6, m.v[(m.v.DVGONE || 0) ? 'IM6()' : 'DV6()'], 'XOR'); } });
  T({ baris: 4570, jalan: function (m) { m.taruh(m.v.HP + 3, m.v.IP - 2, m.v[(m.v.DVGONE || 0) ? 'IM5()' : 'DV5()'], 'XOR'); } });
  T({ baris: 4580, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 4590, jalan: function (m) { m.taruh(m.v.HP + 1, m.v.IP - 6, m.v[(m.v.DVGONE || 0) ? 'IM7()' : 'DV7()'], 'XOR'); } });
  T({ baris: 4600, jalan: function (m) { m.taruh(m.v.HP + 2, m.v.IP - 6, m.v[(m.v.DVGONE || 0) ? 'IM6()' : 'DV6()'], 'XOR'); } });
  T({ baris: 4610, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 4620, jalan: function (m) { m.taruh(m.v.HP + 2, m.v.IP - 6, m.v[(m.v.DVGONE || 0) ? 'IM8()' : 'DV8()'], 'XOR'); } });
  T({ baris: 4630, jalan: function (m) { m.taruh(m.v.HP + 1, m.v.IP - 6, m.v[(m.v.DVGONE || 0) ? 'IM7()' : 'DV7()'], 'XOR'); } });
  T({ baris: 4640, jalan: function () { /* PLAY "P4" */ } });
  T({ baris: 4650, jalan: function (m) { m.taruh(m.v.HP + 2, m.v.IP - 6, m.v[(m.v.DVGONE || 0) ? 'IM8()' : 'DV8()'], 'XOR'); } });
  T({ baris: 4660, jalan: function (m) { m.untuk('J2', 10000, 100, -500); } });
  T({ baris: 4670, jalan: function () { /* SOUND J2,.001*18.2 */ } });
  T({ baris: 4680, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 4690, jalan: function () { /* FOR A=1 TO 50:NEXT A — jeda */ } });
  T({ baris: 4700, jalan: function (m) { m.untuk('J2', 10000, 100, -500); } });
  T({ baris: 4710, jalan: function () { /* SOUND J2,.001*18.2 */ } });
  T({ baris: 4720, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 4730, jalan: function (m) { m.v['J'] = (m.v['J'] || 0) + 25000; } });
  T({ baris: 4740, jalan: function (m) { m.v['H'] = Math.floor( m.acak() * 61 ) + 10; m.v['I'] = Math.floor( m.acak() * 21 ) + 10; } });
  T({ baris: 4750, jalan: function (m) { m.v['K'] = Math.floor( m.acak() * 10 ); } });
  T({ baris: 4760, jalan: function (m) { if ((m.v['K'] || 0) > (m.v['SKILL'] || 0) + 1) m.lompat(4910); } });
  T({ baris: 4770, jalan: function (m) { [1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); }); } });
  T({ baris: 4780, jalan: function (m) { m.cls(); m.cetak('****  B O O M !  ****'); m.barisBaru(); } });
  T({ baris: 4790, jalan: function (m) { m.untuk('J2', 1000, 37, -10); } });
  T({ baris: 4800, jalan: function () { /* SOUND J2,.01*18.2 */ } });
  T({ baris: 4810, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 4820, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4830, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 4840, jalan: function (m) {
      if ((m.v.DVGONE || 0) === 1) {
        m.cetak('TOO BAD.  YOU HAVE BEEN SHOT DOWN.'); m.barisBaru();
        m.lompat(4880);
      }
    } });
  T({ baris: 4850, jalan: function (m) { m.cetak("YOU HAVE JUST BEEN PERSONALLY SHOT DOWN"); } });
  T({ baris: 4860, jalan: function (m) { m.cetak("BY DARTH VADER.  THE FORCE WAS NOT WITH"); } });
  T({ baris: 4870, jalan: function (m) { m.cetak("YOU."); m.barisBaru(); } });
  T({ baris: 4880, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4890, jalan: function (m) { m.cetak("*********   YOU   LOSE!!   *********"); m.barisBaru(); } });
  T({ baris: 4900, jalan: function (m) { m.lompat(5310); } });
  T({ baris: 4910, jalan: function (m) { if ((m.v['DVGONE'] || 0) === 0) m.lompat(5030); } });
  T({ baris: 4920, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 4930, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER MISSED ****"); } });
  T({ baris: 4940, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 4950, jalan: function (m) { m.locate(24, 1); m.cetak("                                 "); } });
  T({ baris: 4960, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 4970, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 4980, jalan: function (m) { m.locate(24, 1); m.cetak("**** IMPERIAL FIGHTER MISSED ****"); } });
  T({ baris: 4990, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 5000, jalan: function (m) { m.locate(24, 1); m.cetak("                                 "); } });
  T({ baris: 5010, jalan: function (m) { m.v['DV()'] = salin(m.v['DV1()']); } });
  T({ baris: 5020, jalan: function (m) { m.lompat(5140); } });
  T({ baris: 5030, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 5040, jalan: function (m) { m.locate(24, 1); m.cetak("**** DARTH VADER MISSED ****"); } });
  T({ baris: 5050, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 5060, jalan: function (m) { m.locate(24, 1); m.cetak("                            "); } });
  T({ baris: 5070, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 5080, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 5090, jalan: function (m) { m.locate(24, 1); m.cetak("**** DARTH VADER MISSED ****"); } });
  T({ baris: 5100, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 5110, jalan: function (m) { m.locate(24, 1); m.cetak("                            "); } });
  T({ baris: 5120, jalan: function (m) { m.v['DV()'] = salin(m.v['DV1()']); } });
  rem(5130);
  T({ baris: 5140, jalan: function (m) { m.gosub(1180); } });
  T({ baris: 5150, jalan: function (m) { m.v['Z$'] = m.inkey(); } });
  /* 5160 Satu-satunya tombol yang dibaca gelung utamanya: angka kecepatan. Semua
     yang lain datang lewat jebakan. */
  T({ baris: 5160, jalan: function (m) {
      var q = parseInt(m.v['Z$'], 10);
      if (q > 0 && q < 10) m.v.Q = q;
    } });
  T({ baris: 5170, jalan: function (m) { m.v['S'] = (m.v['S'] || 0) + (m.v['Q'] || 0) * 100; } });
  T({ baris: 5180, jalan: function (m) { if ((m.v['S'] || 0) > (m.v['O'] || 0)) m.lompat(6410); } });
  rem(5190);
  T({ baris: 5200, jalan: function (m) { m.v.SEC2 = 0; } });
  T({ baris: 5210, jalan: function (m) { m.v['SECNEW'] = (m.v['SEC2'] || 0); } });
  T({ baris: 5220, jalan: function (m) { if ((m.v['SECNEW'] || 0) === (m.v['SECOLD'] || 0)) m.lompat(5280); } });
  /* 5230 Jam BASIC hanya memberi detik 00-59. Baris ini menghitung berapa kali angka
     itu MELOMPAT MUNDUR, dan baris 5250 memakai `60*N8` untuk menyusun
     kembali waktu yang sebenarnya. Menit dihitung dari kejutan. */
  T({ baris: 5230, jalan: function (m) { if ((m.v.SECNEW || 0) < (m.v.SECOLD || 0)) m.v.N8 = ((m.v.N8 || 0) || 0) + 1; } });
  T({ baris: 5240, jalan: function (m) { m.v['SECOLD'] = (m.v['SEC2'] || 0); } });
  T({ baris: 5250, jalan: function (m) { m.v['A2NEW'] = (m.v['A2'] || 0) - ( (m.v['SEC2'] || 0) + ( 60 * (m.v['N8'] || 0) ) - (m.v['SEC1'] || 0) ); } });
  T({ baris: 5260, jalan: function (m) {
      if ((m.v.A2NEW || 0) < 0) {
        m.v.A2NEW = (m.v.A2NEW || 0) + 60; m.v.A1 = (m.v.A1 || 0) - 1; m.v.A2 = (m.v.A2 || 0) + 60;
      }
    } });
  T({ baris: 5270, jalan: function (m) { if ((m.v['A1'] || 0) < 0) m.lompat(6760); } });
  T({ baris: 5280, jalan: function (m) { m.lompat(2320); } });
  rem(5290);
  /* 5300 5290-5300 TIDAK PERNAH DIJALANKAN: baris 5280 selalu `GOTO 2320`, dan
     tidak ada satu pun lompatan ke 5290 atau 5300 di seluruh berkas. Sisa
     dari 'DISPLAY SKY FIGHTER' yang tidak jadi dibangun. */
  T({ baris: 5300, jalan: function (m) { m.v.A = 3; } });
  rem(5310);
  T({ baris: 5320, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5330, jalan: function (m) { m.cetak("HIT ENTER TO PLAY AGAIN, ESC TO GIVE UP"); m.barisBaru(); } });
  T({ baris: 5340, jalan: function (m) {
      m.v['B$'] = m.inkey();
      if (m.v['B$'] === m.chr(13)) m.lompat(1300);
      else if (m.v['B$'] === m.chr(27)) { m.cls(); m.layar(0); m.henti('END di baris 5340.'); }
      else m.lompat(5340);
    } });
  rem(5350);
  /* 5360 Yang ditunda LIMA, bukan enam: jebakan F1 tidak menunda dirinya sendiri —
     mesin sudah melakukannya selama penangannya berjalan. */
  T({ baris: 5360, jalan: function (m) { [2, 11, 12, 13, 14].forEach(function (k) { m.tundaJebakan(k); }); } });
  T({ baris: 5370, jalan: function (m) { m.taruh(2, 2, m.v['LASAR()'], 'XOR'); } });
  T({ baris: 5380, jalan: function (m) { m.untuk('J2', 5000, 100, -250); } });
  T({ baris: 5390, jalan: function () { /* SOUND J2,.01*18.2 */ } });
  T({ baris: 5400, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 5410, jalan: function (m) { m.taruh(2, 2, m.v['LASAR()'], 'XOR'); } });
  /* 5420 Uji kena: jarak dari titik bidik lebih kecil daripada JANGKAUAN yang ikut
     membesar bersama gambarnya. Tidak ada geometri sama sekali. */
  T({ baris: 5420, jalan: function (m) {
      if (m.v.G - (m.v.S || 0) < 26000 && Math.abs(m.v.IMX - m.v.E) < m.v.IMR1
          && Math.abs(m.v.IMY - m.v.F) < m.v.IMR2) m.lompat(5450);
    } });
  T({ baris: 5430, jalan: function (m) {
      if (m.v.J - (m.v.S || 0) < 26000 && Math.abs(m.v.DVX - m.v.H) < m.v.DVR1
          && Math.abs(m.v.DVY - m.v.I) < m.v.DVR2) m.lompat(5580);
    } });
  T({ baris: 5440, jalan: function (m) { m.lompat(5730); } });
  /* 5450 Tiap bingkai ledakan digambar DUA KALI berturut-turut di tempat yang sama —
     PUT XOR yang meniadakan dirinya sendiri. Yang tersisa cuma kedipannya,
     dan latar di bawahnya utuh. */
  T({ baris: 5450, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL3()'], 'XOR');
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL3()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5460, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL4()'], 'XOR');
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL4()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5470, jalan: function (m) { m.taruh((m.v['E'] || 0), (m.v['F'] || 0), m.v['IM()'], 'XOR'); } });
  T({ baris: 5480, jalan: function (m) { if ((m.v['IMR2'] || 0) === 1) m.lompat(5540); } });
  T({ baris: 5490, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL5()'], 'XOR');
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL5()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5500, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL6()'], 'XOR');
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL6()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5510, jalan: function (m) { if ((m.v['IMR2'] || 0) === 2) m.lompat(5540); } });
  T({ baris: 5520, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL7()'], 'XOR');
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL7()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5530, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL8()'], 'XOR');
      m.taruh(m.v.E - 2, m.v.F - 3, m.v['EXPL8()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5540, jalan: function (m) { m.v['G'] = (m.v['G'] || 0) + 25000; m.v['E'] = Math.floor( m.acak() * 61 ) + 10; m.v['F'] = Math.floor( m.acak() * 21 ) + 10; m.v['FLAG3'] = 0; m.v['IMNEW'] = 0; m.v['IMPFIGH2'] = 0; m.v['IMPFIGH3'] = 0; } });
  T({ baris: 5550, jalan: function (m) { m.v['IMX'] = 38; m.v['IMY'] = 21; m.v['IMR1'] = 1; m.v['IMR2'] = 1; } });
  T({ baris: 5560, jalan: function (m) { m.v['IM()'] = salin(m.v['IM1()']); } });
  T({ baris: 5570, jalan: function (m) { m.lompat(5730); } });
  T({ baris: 5580, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL3()'], 'XOR');
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL3()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5590, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL4()'], 'XOR');
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL4()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5600, jalan: function (m) { m.taruh((m.v['H'] || 0), (m.v['I'] || 0), m.v['DV()'], 'XOR'); } });
  T({ baris: 5610, jalan: function (m) { if ((m.v['DVR2'] || 0) === 1) m.lompat(5670); } });
  T({ baris: 5620, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL5()'], 'XOR');
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL5()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5630, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL6()'], 'XOR');
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL6()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5640, jalan: function (m) { if ((m.v['DVR2'] || 0) === 2) m.lompat(5670); } });
  T({ baris: 5650, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL7()'], 'XOR');
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL7()'], 'XOR');
      m.lanjutkan('I9');
    } });
  T({ baris: 5660, jalan: function (m) {
      m.untuk('I9', 1, 2, 1);
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL8()'], 'XOR');
      m.taruh(m.v.H - 2, m.v.I - 3, m.v['EXPL8()'], 'XOR');
      m.lanjutkan('I9');
    } });
  /* 5670 Vader ditembak jatuh — dan barisnya sendiri di panel diganti namanya jadi
     'KM TO IMPERIAL FIGHTER'. Sesudah ini tidak ada lagi Darth Vader di
     permainan ini, cuma pesawat biasa yang datang dari jarak yang sama. */
  T({ baris: 5670, jalan: function (m) {
      m.v.J = m.v.J + 25000;
      m.v.H = Math.floor(m.acak() * 61) + 10;
      m.v.I = Math.floor(m.acak() * 21) + 10;
      m.v.FLAG4 = 0;
      m.locate(19, 8); m.cetak('KM TO IMPERIAL FIGHTER');
    } });
  T({ baris: 5680, jalan: function (m) { m.v['DVNEW'] = 0; m.v['DVADER2'] = 0; m.v['DVADER3'] = 0; } });
  T({ baris: 5690, jalan: function (m) { m.v['DVX'] = 38; m.v['DVY'] = 21; m.v['DVR1'] = 1; m.v['DVR2'] = 1; } });
  /* 5700 Dan gambar besarnya pun diganti gambar pesawat biasa. */
  T({ baris: 5700, jalan: function (m) { if (!(m.v.DVGONE || 0)) m.v['DV3()'] = salin(m.v['IM3()']); } });
  T({ baris: 5710, jalan: function (m) { m.v['DV()'] = salin(m.v['DV1()']); } });
  T({ baris: 5720, jalan: function (m) { m.v['DVGONE'] = 1; } });
  T({ baris: 5730, jalan: function (m) { [2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, true); }); } });
  T({ baris: 5740, jalan: function (m) { m.kembali(); } });
  rem(5750);
  T({ baris: 5760, jalan: function (m) { [1, 11, 12, 13, 14].forEach(function (k) { m.tundaJebakan(k); }); } });
  T({ baris: 5770, jalan: function (m) { if ((m.v['Z'] || 0) === 0) m.lompat(3600); } });
  T({ baris: 5780, jalan: function (m) { m.untuk('J2', 1500, 100, -20); } });
  T({ baris: 5790, jalan: function () { /* SOUND J2,.01*18.2 */ } });
  T({ baris: 5800, jalan: function () { /* SOUND 3600-J2,.01*18.2 */ } });
  T({ baris: 5810, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 5820, jalan: function (m) { m.v['Z'] = (m.v['Z'] || 0) - 1; } });
  T({ baris: 5830, jalan: function (m) { if ((m.v['O'] || 0) - (m.v['S'] || 0) > 10000) m.lompat(5990); } });
  /* 5840 INILAH BARISNYA. `POINT(38,21)` membaca WARNA satu piksel di pusat garis
     bidik, dan warna 3 adalah Bintang Kematian. Pertanyaannya bukan 'di mana
     sasarannya' melainkan 'apakah ada BAGIANNYA tepat di bidikan saya' — dan
     yang menjawabnya bidang piksel itu sendiri. */
  T({ baris: 5840, jalan: function (m) { if (m.titik(38, 21) !== 3) m.lompat(5880); } });
  T({ baris: 5850, jalan: function (m) { if ((m.v['SKILL'] || 0) === 0) m.lompat(6100); } });
  T({ baris: 5860, jalan: function (m) { m.v['K'] = Math.floor( m.acak() * 10 ); } });
  T({ baris: 5870, jalan: function (m) { if ((m.v['K'] || 0) > (m.v['SKILL'] || 0) + 1) m.lompat(6100); } });
  T({ baris: 5880, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 5890, jalan: function (m) { m.locate(24, 1); m.cetak("**** TORPEDO  MISSED  ****"); } });
  T({ baris: 5900, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 5910, jalan: function (m) { m.locate(24, 1); m.cetak("                          "); } });
  T({ baris: 5920, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 5930, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 5940, jalan: function (m) { m.locate(24, 1); m.cetak("**** TORPEDO  MISSED  ****"); } });
  T({ baris: 5950, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 5960, jalan: function (m) { m.locate(24, 1); m.cetak("                          "); } });
  T({ baris: 5970, jalan: function (m) { if ((m.v['Z'] || 0) <= 0) m.lompat(4780); } });
  T({ baris: 5980, jalan: function (m) { m.lompat(6080); } });
  T({ baris: 5990, jalan: function (m) { m.untuk('K', 1, 2, 1); } });
  T({ baris: 6000, jalan: function (m) { m.locate(24, 1); m.cetak("**** OUT  OF  RANGE  ****"); } });
  T({ baris: 6010, jalan: function () { /* PLAY "L2 N0" */ } });
  T({ baris: 6020, jalan: function (m) { m.locate(24, 1); m.cetak("                         "); } });
  T({ baris: 6030, jalan: function () { /* PLAY "L16 N0" */ } });
  T({ baris: 6040, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 6050, jalan: function (m) { m.locate(24, 1); m.cetak("**** OUT  OF  RANGE  ****"); } });
  T({ baris: 6060, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 6070, jalan: function (m) { m.locate(24, 1); m.cetak("                         "); } });
  T({ baris: 6080, jalan: function (m) { [1, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, true); }); } });
  T({ baris: 6090, jalan: function (m) { m.kembali(); } });
  rem(6100);
  T({ baris: 6110, jalan: function (m) { [1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); }); } });
  T({ baris: 6120, jalan: function (m) { m.untuk('SCALE', 1, 24, 1); } });
  /* 6130 `S=SCALE;` membaca variabel SCALE dari dalam string DRAW, dan gelung di
     baris 6120 menaikkannya dari 1 ke 24. X-wing yang membesar sampai memenuhi
     layar. Awalan `N` di tiap perintah berarti 'gambar lalu KEMBALI ke titik
     semula' — jadi seluruh bentuknya dipancarkan dari satu titik. */
  T({ baris: 6130, jalan: function (m) {
      m.gambar('C3;S=SCALE;BM38,21;NM+6,0;NM-6,0;NM+0,-3;NM+0,3;NM-6,3;'
             + 'NM+6,-3;NM-6,-3;NM+6,3;NM+3,-3;NM-3,3;NM+3,3;NM-3,-3;'
             + 'NM+6,2;NM-6,-2;NM-6,1;NM+6,-1;NM+1,3;NM-1,-3');
    } });
  T({ baris: 6140, jalan: function (m) { m.lanjutkan('SCALE'); } });
  T({ baris: 6150, jalan: function (m) { m.cls(); } });
  T({ baris: 6160, jalan: function (m) { m.untuk('K', 1, 5, 1); } });
  T({ baris: 6170, jalan: function () { /* SOUND 37,.1*18.2 */ } });
  T({ baris: 6180, jalan: function (m) { m.layar(0); } });
  T({ baris: 6190, jalan: function () { /* FOR A=1 TO 10:NEXT A — jeda */ } });
  /* 6200 6160-6210 berkedip lima kali dengan cara BERGANTI MODE LAYAR. Kartunya butuh
     waktu untuk menyetel ulang tiap kali, dan waktu itulah kedipannya. */
  T({ baris: 6200, jalan: function (m) { m.layar(1); } });
  T({ baris: 6210, jalan: function (m) { m.lanjutkan('K'); } });
  T({ baris: 6220, jalan: function () { /* WIDTH 40 */ } });
  T({ baris: 6230, jalan: function (m) { m.cls(); m.barisBaru(); m.barisBaru(); m.barisBaru(); } });
  T({ baris: 6240, jalan: function (m) { m.cetak("* * * * * * * * * * * * * * * * * * * *"); } });
  T({ baris: 6250, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 6260, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 6270, jalan: function (m) { m.cetak("*    THE  FORCE  IS  WITH  YOU  !!    *"); } });
  T({ baris: 6280, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 6290, jalan: function (m) { m.cetak("* YOU HAVE DESTROYED THE DEATH STAR ! *"); } });
  T({ baris: 6300, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 6310, jalan: function (m) { m.cetak("*    YOU HAVE SAVED THE REPUBLIC !    *"); } });
  T({ baris: 6320, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 6330, jalan: function (m) { m.cetak("* PRINCESS LEAH WILL LOVE YOU ALWAYS! *"); } });
  T({ baris: 6340, jalan: function (m) { m.cetak("*                                     *"); } });
  T({ baris: 6350, jalan: function (m) { m.cetak("* * * * * * * * * * * * * * * * * * * *"); m.barisBaru(); } });
  T({ baris: 6360, jalan: function () { /* SOUND 525.25,18.2:SOUND 783.99,18.2/2:SOUND 698.46,18.2/6:SOUND 659.26,18.2/6:SOUND 587.33,18.2/6:SOUND 1046.6,18.2:SOUND 783.99,18.2/2:SOUND 698.46,18.2/6:SOUND 659.26,18.2/6:SOUND 587.33,18.2/6 */ } });
  T({ baris: 6370, jalan: function () { /* SOUND 1046.5,18.2:SOUND 783.99,18.2/2:SOUND 698.46,18.2/6:SOUND 659.26,18.2/6:SOUND 698.46,18.2/6:SOUND 587.33,18.2 */ } });
  T({ baris: 6380, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6390, jalan: function (m) { m.lompat(5310); } });
  rem(6400);
  T({ baris: 6410, jalan: function (m) { [1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); }); } });
  T({ baris: 6420, jalan: function (m) { m.v['DELTAX'] = 35 - (m.v['M'] || 0); m.v['DELTAY'] = 18 - (m.v['N'] || 0); } });
  T({ baris: 6430, jalan: function (m) { if (m.v.DELTAX > 0) m.v.M = m.v.M + 1; } });
  T({ baris: 6440, jalan: function (m) { if (m.v.DELTAX < 0) m.v.M = m.v.M - 1; } });
  T({ baris: 6450, jalan: function (m) { if (m.v.DELTAY > 0) m.v.N = m.v.N + 1; } });
  T({ baris: 6460, jalan: function (m) { if (m.v.DELTAY < 0) m.v.N = m.v.N - 1; } });
  T({ baris: 6470, jalan: function (m) { if (m.v.DELTAX === 0 && m.v.DELTAY === 0) m.lompat(6530); } });
  T({ baris: 6480, jalan: function (m) { m.taruh((m.v['M'] || 0), (m.v['N'] || 0), m.v['DS()'], 'XOR'); } });
  T({ baris: 6490, jalan: function (m) { m.taruh((m.v['MP'] || 0), (m.v['NP'] || 0), m.v['DS()'], 'XOR'); } });
  T({ baris: 6500, jalan: function (m) { m.v['MP'] = (m.v['M'] || 0); m.v['NP'] = (m.v['N'] || 0); } });
  T({ baris: 6510, jalan: function () { /* PLAY "P32" */ } });
  T({ baris: 6520, jalan: function (m) { m.lompat(6420); } });
  T({ baris: 6530, jalan: function (m) { m.untuk('RAD', 4, 20, 1); } });
  T({ baris: 6540, jalan: function (m) { m.lingkaran(38, 21, m.v.RAD, 3); } });
  T({ baris: 6550, jalan: function () { /* PLAY "P32" */ } });
  T({ baris: 6560, jalan: function (m) { m.lanjutkan('RAD'); } });
  T({ baris: 6570, jalan: function (m) { m.cls(); m.cetak('CRASH'); m.barisBaru(); } });
  T({ baris: 6580, jalan: function (m) { m.untuk('J2', 1000, 37, -10); } });
  T({ baris: 6590, jalan: function () { /* SOUND J2,.01*18.2 */ } });
  T({ baris: 6600, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 6610, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 6620, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6630, jalan: function (m) { m.cetak("DARTH VADER IS LAUGHING AT YOU."); m.barisBaru(); } });
  T({ baris: 6640, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 6650, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6660, jalan: function (m) { m.cetak("YOU HAVE JUST COLLIDED WITH THE DEATH"); } });
  T({ baris: 6670, jalan: function (m) { m.cetak("STAR.  THEY DID NOT EVEN HEAR THE"); } });
  T({ baris: 6680, jalan: function (m) { m.cetak("COLLISION.  YOU DID NOT EVEN SCRATCH"); } });
  T({ baris: 6690, jalan: function (m) { m.cetak("THE DEATH STAR'S PAINT, BUT YOU ARE   "); } });
  T({ baris: 6700, jalan: function (m) { m.cetak("DEAD!"); m.barisBaru(); } });
  T({ baris: 6710, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6720, jalan: function (m) { m.cetak("*********   YOU  LOSE!!   *********"); m.barisBaru(); } });
  T({ baris: 6730, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6740, jalan: function (m) { m.lompat(5310); } });
  rem(6750);
  T({ baris: 6760, jalan: function (m) { [1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); }); } });
  T({ baris: 6770, jalan: function (m) { m.cls(); m.cetak('TOO LATE!'); m.barisBaru(); } });
  T({ baris: 6780, jalan: function (m) { m.untuk('J2', 1000, 37, -10); } });
  T({ baris: 6790, jalan: function () { /* SOUND J2,.01*18.2 */ } });
  T({ baris: 6800, jalan: function (m) { m.lanjutkan('J2'); } });
  T({ baris: 6810, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 6820, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6830, jalan: function (m) { m.cetak("DARTH VADER IS LAUGHING AT YOU."); m.barisBaru(); } });
  T({ baris: 6840, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 6850, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6860, jalan: function (m) { m.cetak("THE DEATH STAR HAS JUST DESTROYED"); } });
  T({ baris: 6870, jalan: function (m) { m.cetak("PRINCESS LEAH AND THE ENTIRE REBEL"); } });
  T({ baris: 6880, jalan: function (m) { m.cetak("STRONGHOLD"); } });
  T({ baris: 6890, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6900, jalan: function (m) { m.cetak("*********   YOU  LOSE!!   *********"); m.barisBaru(); } });
  T({ baris: 6910, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6920, jalan: function (m) { m.lompat(5310); } });
  T({ baris: 6930, jalan: function (m) { m.cls(); } });
  T({ baris: 6940, jalan: function (m) { m.cetak("       STAR  PILOT  INSTRUCTIONS"); m.barisBaru(); } });
  T({ baris: 6950, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6960, jalan: function (m) { m.cetak("    THE DEATH  STAR SPACE STATION, UNDER"); } });
  T({ baris: 6970, jalan: function (m) { m.cetak("THE COMMAND OF DARTH  VADER, IS THE MOST"); } });
  T({ baris: 6980, jalan: function (m) { m.cetak("POWERFUL  WEAPON  THE UNIVERSE  HAS EVER"); } });
  T({ baris: 6990, jalan: function (m) { m.cetak("KNOWN.   A FRONTAL  ATTACK BY  ANY OTHER"); } });
  T({ baris: 7000, jalan: function (m) { m.cetak("CRAFT WOULD BE ABSOLUTE SUICIDE. HOWEVER"); } });
  T({ baris: 7010, jalan: function (m) { m.cetak("INTELLIGENCE DELIVERED  TO  OUR REPUBLIC"); } });
  T({ baris: 7020, jalan: function (m) { m.cetak("HEADQUARTERS  BY  THE  ANDROIDS R2D2 AND"); } });
  T({ baris: 7030, jalan: function (m) { m.cetak("C3PO GIVES A FAINT  HOPE OF A SUCCESSFUL"); } });
  T({ baris: 7040, jalan: function (m) { m.cetak("ATTACK  BY A SMALL ONE OR TWO  PASSENGER"); } });
  T({ baris: 7050, jalan: function (m) { m.cetak("X-WING FIGHTER."); m.barisBaru(); } });
  T({ baris: 7060, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7070, jalan: function (m) { m.cetak("    THERE IS A SMALL, UNSHIELDED EXHAUST"); } });
  T({ baris: 7080, jalan: function (m) { m.cetak("PORT  ON  THE  SURFACE OF THE DEATH STAR"); } });
  T({ baris: 7090, jalan: function (m) { m.cetak("THAT LEADS DIRECTLY TO THE MAIN REACTOR."); } });
  T({ baris: 7100, jalan: function (m) { m.cetak("SINCE IT IS AN EMERGENCY THERMAL PORT IN"); } });
  T({ baris: 7110, jalan: function (m) { m.cetak("CASE THE REACTOR OVERHEATS, IT COULD NOT"); } });
  T({ baris: 7120, jalan: function (m) { m.cetak("BE SHIELDED."); m.barisBaru(); } });
  T({ baris: 7130, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7140, jalan: function (m) { m.masukan('B$', '     (PRESS ENTER  TO  CONTINUE)'); } });
  T({ baris: 7150, jalan: function (m) { m.cls(); } });
  T({ baris: 7160, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7170, jalan: function (m) { m.cetak("    IF YOU CAN  SLIP YOUR  SMALL FIGHTER"); } });
  T({ baris: 7180, jalan: function (m) { m.cetak("PAST THE  DEATH STAR'S DEFENSES AND MAKE"); } });
  T({ baris: 7190, jalan: function (m) { m.cetak("A DIRECT HIT ON THE THERMAL EXHAUST PORT"); } });
  T({ baris: 7200, jalan: function (m) { m.cetak("WITH  A  TORPEDO, THERE IS A CHANCE THAT"); } });
  T({ baris: 7210, jalan: function (m) { m.cetak("THE  TORPEDO  WILL   PENETRATE  TO   THE"); } });
  T({ baris: 7220, jalan: function (m) { m.cetak("MAIN REACTOR AND START A CHAIN REACTION,"); } });
  T({ baris: 7230, jalan: function (m) { m.cetak("DESTROYING THE DEATH STAR."); m.barisBaru(); } });
  T({ baris: 7240, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7250, jalan: function (m) { m.cetak("    IT IS A SLIM  CHANCE,  BUT IT IS THE"); } });
  T({ baris: 7260, jalan: function (m) { m.cetak("ONLY  HOPE  THE  REPUBLIC HAS.   OBI-WAN"); } });
  T({ baris: 7270, jalan: function (m) { m.cetak("KENOBI GAVE  HIS LIFE TO GET THE MESSAGE"); } });
  T({ baris: 7280, jalan: function (m) { m.cetak("HERE, SO HE CONSIDERED IT IMPORTANT."); m.barisBaru(); } });
  T({ baris: 7290, jalan: function (m) { m.barisBaru(); m.barisBaru(); m.barisBaru(); m.barisBaru(); } });
  T({ baris: 7300, jalan: function (m) { m.cetak("PRESS ENTER FOR X-WING FIGHTER          "); } });
  T({ baris: 7310, jalan: function (m) { m.masukan('B$', '      FAMILIARIZATION'); } });
  T({ baris: 7320, jalan: function (m) { m.cls(); } });
  T({ baris: 7330, jalan: function (m) { m.cetak("        REPUBLIC  X-WING  FIGHTER       "); m.barisBaru(); } });
  T({ baris: 7340, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7350, jalan: function (m) { m.cetak("     THE X-WING  FIGHTER IS A SMALL  ONE"); } });
  T({ baris: 7360, jalan: function (m) { m.cetak("MAN  SPACESHIP  THAT IS,  QUITE FRANKLY,"); } });
  T({ baris: 7370, jalan: function (m) { m.cetak("OBSOLETE.  IT IS ARMED ONLY WITH A LASER"); } });
  T({ baris: 7380, jalan: function (m) { m.cetak("CANNON  AND  THREE  TORPEDOES.   USE THE"); } });
  T({ baris: 7390, jalan: function (m) { m.cetak("LASER CANNON  TO  FIGHT OFF ANY IMPERIAL"); } });
  T({ baris: 7400, jalan: function (m) { m.cetak("FIGHTERS AND SAVE THE  TORPEDOES FOR THE"); } });
  T({ baris: 7410, jalan: function (m) { m.cetak("DEATH STAR."); m.barisBaru(); } });
  T({ baris: 7420, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7430, jalan: function (m) { m.cetak("     THE  TARGET  ACQUISITION  RADAR CAN"); } });
  T({ baris: 7440, jalan: function (m) { m.cetak("DETECT IN  EXCESS OF  100,000 KILOMETERS"); } });
  T({ baris: 7450, jalan: function (m) { m.cetak("AWAY, BUT CAN ONLY DISPLAY TARGETS WITH-"); } });
  T({ baris: 7460, jalan: function (m) { m.cetak("IN  20,000 KM.   THEREFORE,  YOU WILL BE"); } });
  T({ baris: 7470, jalan: function (m) { m.cetak("WARNED OF APPROACHING  TARGETS  ON  YOUR"); } });
  T({ baris: 7480, jalan: function (m) { m.cetak("CONTROL PANEL  BEFORE THEY ARE DISPLAYED"); } });
  T({ baris: 7490, jalan: function (m) { m.cetak("ON THE RADAR SCREEN."); m.barisBaru(); } });
  T({ baris: 7500, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7510, jalan: function (m) { m.masukan('B$', '     (PRESS ENTER  TO  CONTINUE)'); } });
  T({ baris: 7520, jalan: function (m) { m.cls(); } });
  T({ baris: 7530, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7540, jalan: function (m) { m.cetak("     THE LASER  CANNON IS AN  ANTIQUATED"); } });
  T({ baris: 7550, jalan: function (m) { m.cetak("WEAPON.  TO  HIT AN ENEMY, YOU MUST HAVE"); } });
  T({ baris: 7560, jalan: function (m) { m.cetak("HIM  IN THE  EXACT CENTER  OF THE  CROSS"); } });
  T({ baris: 7570, jalan: function (m) { m.cetak("HAIRS ON YOUR RADAR SCREEN. THEN YOU MAY"); } });
  T({ baris: 7580, jalan: function (m) { m.cetak("FIRE THE  LASER CANNON BY  TYPING THE F1"); } });
  T({ baris: 7590, jalan: function (m) { m.cetak("KEY ON YOUR CONTROL PANEL."); m.barisBaru(); } });
  T({ baris: 7600, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7610, jalan: function (m) { m.cetak("     YOUR  THREE  TORPEDOES ARE COMPUTER"); } });
  T({ baris: 7620, jalan: function (m) { m.cetak("GUIDED,  BUT ALSO QUITE  LIMITED.   MAKE"); } });
  T({ baris: 7630, jalan: function (m) { m.cetak("SURE THAT YOU ARE WITHIN 10000 KM OF THE"); } });
  T({ baris: 7640, jalan: function (m) { m.cetak("DEATH STAR  AND THAT YOU HAVE  SOME PART"); } });
  T({ baris: 7650, jalan: function (m) { m.cetak("OF  THE SPACE STATION  IN THE CENTER  OF"); } });
  T({ baris: 7660, jalan: function (m) { m.cetak("THE  CROSS HAIRS  ON YOUR  RADAR SCREEN."); } });
  T({ baris: 7670, jalan: function (m) { m.cetak("EVEN THEN,  SINCE IT TAKES A PERFECT HIT"); } });
  T({ baris: 7680, jalan: function (m) { m.cetak("ON THE EXHAUST PORT TO DESTROY THE DEATH"); } });
  T({ baris: 7690, jalan: function (m) { m.cetak("STAR,  YOU  MAY  REQUIRE  MORE  THAN ONE"); } });
  T({ baris: 7700, jalan: function (m) { m.cetak("TORPEDO.   TYPE THE  F2  KEY TO FIRE THE"); } });
  T({ baris: 7710, jalan: function (m) { m.cetak("TORPEDO."); m.barisBaru(); } });
  T({ baris: 7720, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7730, jalan: function (m) { m.masukan('B$', '    (PRESS ENTER  TO  CONTINUE)'); } });
  T({ baris: 7740, jalan: function (m) { m.cls(); } });
  T({ baris: 7750, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7760, jalan: function (m) { m.cetak("    THE SPEED OF YOUR SHIP IS CONTROLLED"); } });
  T({ baris: 7770, jalan: function (m) { m.cetak("BY TYPING THE NUMBERS  1 THROUGH 9  (FOR"); } });
  T({ baris: 7780, jalan: function (m) { m.cetak("MACH  10 THROUGH 90  RESPECTIVELY).  THE"); } });
  T({ baris: 7790, jalan: function (m) { m.cetak("MOVEMENT OF YOUR  SHIP IS  CONTROLLED BY"); } });
  T({ baris: 7800, jalan: function (m) { m.cetak("THE CURSOR CONTROLS.  SINCE THESE INPUTS"); } });
  T({ baris: 7810, jalan: function (m) { m.cetak("MOVE YOUR SHIP  AND NOT THE TARGETS, THE"); } });
  T({ baris: 7820, jalan: function (m) { m.cetak("TARGETS APPEAR  TO  MOVE IN THE OPPOSITE"); } });
  T({ baris: 7830, jalan: function (m) { m.cetak("DIRECTION.   ALSO, YOU  CAN  EXPECT  THE"); } });
  T({ baris: 7840, jalan: function (m) { m.cetak("ENEMY TO TAKE EVASIVE ACTION."); m.barisBaru(); } });
  T({ baris: 7850, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7860, jalan: function (m) { m.cetak("    WHEN SELECTING THE SKILL LEVEL, 0 IS"); } });
  T({ baris: 7870, jalan: function (m) { m.cetak("THE EASIEST  GAME AND 3 IS THE  HARDEST."); } });
  T({ baris: 7880, jalan: function (m) { m.cetak("SKILL LEVEL  0  PROVIDES THE BEST CHANCE"); } });
  T({ baris: 7890, jalan: function (m) { m.cetak("OF BEING  MISSED BY THE  FIGHTERS AND OF"); } });
  T({ baris: 7900, jalan: function (m) { m.cetak("HITTING  THE DEATH STAR.  LEVEL  0  ALSO"); } });
  T({ baris: 7910, jalan: function (m) { m.cetak("PROVIDES  THE LARGEST  TIME LIMIT BEFORE"); } });
  T({ baris: 7920, jalan: function (m) { m.cetak("THE DEATH STAR DESTROYS THE REBEL BASE."); m.barisBaru(); } });
  T({ baris: 7930, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7940, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7950, jalan: function (m) { m.masukan('B$', 'PRESS ENTER FOR  TAKE-OFF'); } });
  T({ baris: 7960, jalan: function (m) { m.cls(); } });
  T({ baris: 7970, jalan: function (m) { m.cetak("****************************************"); m.barisBaru(); } });
  T({ baris: 7980, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7990, jalan: function (m) { m.cetak("    MAY  THE  FORCE  BE  WITH  YOU"); m.barisBaru(); } });
  T({ baris: 8000, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8010, jalan: function (m) { m.cetak("****************************************"); m.barisBaru(); } });
  T({ baris: 8020, jalan: function () { /* PLAY "L1 N0":PLAY "L1 N0" */ } });
  T({ baris: 8030, jalan: function (m) { m.lompat(1300); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['XWING'] = {
    nama: 'XWING',
    judul: 'Star Pilot / X-Wing Fighter (George Blank 1978, port PC 1982)',
    sumber: 'XWING',
    berkas: 'run/XWING.BAS',
    tabel: tabel,
    benih: 77,

    /* Enam bingkai ledakan, dalam urutan DATA-nya di baris 1800-1900. Tiap
       satu sembilan belas bilangan bulat: lebar dalam bit, tinggi, lalu
       pikselnya dipadatkan — format `GET` apa adanya. */
    data: [].concat(
      [22, 11, 0, 0, 0, 8194, 0, -32608, -22006, 2560, -32598, -22006, 128, 168, 8706, 0, 0, 0, 0],
      [22, 11, -30720, 2048, 136, -30718, -24544, -32608, -22006, -21848, -22358, -22006, -23936, 10274, -30206, 2048, -32632, -30720, 0],
      [22, 11, -30712, 512, 136, 8194, -32760, -24416, -21974, -21976, -22358, -21974, -32608, 2216, -30206, 512, 138, -30712, 128],
      [22, 11, -30712, 2048, 136, 8194, -24536, -32608, -22006, -21976, -22358, -22006, -24448, 10408, 8706, 2048, -32632, -30712, 128],
      [22, 11, -30688, 2048, 2080, 8194, -32736, -32608, -21974, -22008, -22358, -22006, -24448, 10408, 8706, 2048, -32632, -30688, 32],
      [22, 11, -30688, 2048, 2184, -30718, -24544, -32608, -22006, -21848, -22358, -22006, -23936, 10274, -30206, 2048, -32632, -30688, 32]),

    arsitektur: {
      judul: 'Alur XWING.BAS',
      simpul: [
        { id: 'kop', baris: '10-280', jenis: 'mulai',
          teks: ['Kop surat klub TPCUG,', 'ditempel di depan program', 'yang bukan miliknya'] },
        { id: 'gambar', baris: '1330-2030',
          teks: ['Tiga sasaran digambar DRAW,', 'dipungut GET tiga-empat ukuran;', '13 gambar lain DIKETIK'] },
        { id: 'jebak', baris: '1320',
          teks: ['Enam ON KEY: F1, F2,', 'dan empat panah'] },
        { id: 'panel', baris: '2160-2300',
          teks: ['Garis bidik dengan LUBANG', 'di tengahnya'] },
        { id: 'utama', baris: '2320-2460',
          teks: ['Jarak = target - jarak tempuh;', 'S bertambah Q*100 tiap putaran'] },
        { id: 'dekat', baris: '2490-2510',
          teks: ['Tiap ambang jarak menyalin', 'gambar yang lebih besar', 'DAN jangkauan tembak'] },
        { id: 'elak', baris: '2520-2590', jenis: 'putusan',
          teks: ['BYPASS mengatur seberapa', 'sering musuh mengelak'] },
        { id: 'tembak', baris: '5350-5740', jenis: 'putusan',
          teks: ['F1: kena kalau jaraknya', 'lebih kecil dari jangkauan'] },
        { id: 'torpedo', baris: '5750-6090', jenis: 'putusan',
          teks: ['F2: POINT(38,21) membaca', 'LAYAR untuk tahu ada apa', 'di garis bidik'] },
        { id: 'usai', baris: '6100-6920', jenis: 'keluar',
          teks: ['Menang, tertembak,', 'menabrak, atau kehabisan waktu'] }
      ],
      panah: [
        { dari: 'kop', ke: 'gambar' },
        { dari: 'gambar', ke: 'jebak' },
        { dari: 'jebak', ke: 'panel' },
        { dari: 'panel', ke: 'utama' },
        { dari: 'utama', ke: 'dekat' },
        { dari: 'dekat', ke: 'elak' },
        { dari: 'elak', ke: 'utama' },
        { dari: 'jebak', ke: 'tembak', label: 'F1' },
        { dari: 'jebak', ke: 'torpedo', label: 'F2' },
        { dari: 'tembak', ke: 'utama' },
        { dari: 'torpedo', ke: 'usai', label: 'kena' },
        { dari: 'elak', ke: 'usai', label: 'waktu habis' }
      ]
    },

    pseudokode: [
      { baris: 1350, tingkat: 0, teks: 'tiga belas gambar <b>diketik</b> sebagai penugasan larik' },
      { baris: 1360, tingkat: 1, teks: '&hellip;<code>-32768!</code> butuh akhiran <code>!</code> supaya tidak melimpah' },
      { baris: 2860, tingkat: 0, teks: 'ambang jarak menyalin gambar yang lebih besar &mdash; <b>dan jangkauan tembaknya</b>' },
      { baris: 5420, tingkat: 1, teks: '&hellip;jadi sasaran yang lebih dekat lebih mudah kena, tanpa satu perhitungan' },
      { baris: 5840, tingkat: 0, teks: '<code>POINT(38,21)</code> &mdash; torpedo bertanya pada <b>layar</b> ada apa di bidikan' },
      { baris: 1180, tingkat: 0, teks: '<code>KEY(n) STOP</code> berpasangan mengapit tiap bagian yang tak boleh disela' },
      { baris: 5700, tingkat: 0, teks: 'Vader jatuh &rarr; gambarnya <b>diganti pesawat biasa</b>, pesannya ikut' },
      { baris: 5230, tingkat: 0, teks: 'menit dihitung dari <b>berapa kali detik melompat mundur</b>' },
      { baris: 2110, tingkat: 0, teks: 'tingkat 3 tidak menyetel <code>BYPASS</code>; nol berarti mengelak tiap putaran' },
      { baris: 6130, tingkat: 0, teks: '<code>S=SCALE;</code> di dalam DRAW &rarr; X-wing membesar dari 1 ke 24' },
      { baris: 5300, tingkat: 0, teks: 'dua baris yang <b>tidak pernah dijalankan</b> &mdash; sisa rancangan yang batal' }
    ],

    perintahAsli: 'run\\XWING.bat',
    catatanAsli: 'Jawab N untuk melewati petunjuknya, lalu pilih tingkat 0. ' +
      'Angka 1-9 mengatur kecepatan, panah menggeser kapal, F1 meriam, F2 ' +
      'torpedo. Perhatikan sasarannya membesar bertahap &mdash; dan makin ' +
      'besar, makin mudah kena.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Yang hilang lebih ' +
      'banyak daripada biasanya: tema Star Wars di baris 1250-1260 dan ' +
      '6360-6370 ditulis sebagai <b>frekuensi mentah</b> (525.25, 783.99, ' +
      '698.46&hellip;) dengan lama nada dalam satuan detak 18,2 per detik, ' +
      'bukan sebagai makro <code>PLAY</code>.',

      '<b><code>TIME$</code> dan <code>RANDOMIZE</code> diganti nilai tetap</b>, ' +
      'jadi penghitung waktu di baris 5200-5270 tidak berjalan dan batas ' +
      'waktunya tidak pernah habis.',

      '<b>Larik gambar disalin utuh, bukan unsur demi unsur.</b> Di berkas ' +
      'aslinya <code>IM(0)=IM2(0):IM(1)=IM2(1):IM(2)=IM2(2):IM(3)=IM2(3)</code> ' +
      'menyalin SELURUH isi <code>IM2</code> &mdash; empat unsur memang seluruh ' +
      'gambarnya. Akibatnya sama.',

      '<b><code>POKE &amp;H410</code> (baris 1070) diabaikan.</b>',

      '<b>Kop surat klub di baris 40-230 memakai aksara blok CP437</b> ' +
      '(&#x2591;, &#x2584;, &#x2588;) yang digambar konsol penelusur apa adanya.'
    ],

    pelajaran: {
      ringkas: 'Perspektif dibangun dari beberapa gambar dan satu bendera — ' +
        'dan jangkauan tembaknya ikut membesar bersama gambarnya.',
      pelajari: [
        ['Jarak yang mengubah tiga hal sekaligus',
         '<code>2860 IF G-S&lt;20000 AND IMPFIGH2=0 THEN IMPFIGH2=1:IMFLAG=1:' +
         'IM(0)=IM2(0):&hellip;:IMX=37:IMY=20:IMR1=2:IMR2=2</code>',
         'Satu ambang jarak, dan yang berubah: <b>gambarnya</b> (disalin dari ' +
         '<code>IM2</code>), <b>titik bidiknya</b> (<code>IMX,IMY</code> ' +
         'bergeser karena gambarnya lebih besar dan titik acuannya di sudut ' +
         'kiri atas), dan <b>jangkauan tembaknya</b> (<code>IMR1,IMR2</code>).',
         'Yang terakhir itu yang paling halus. Baris 5420 menguji kena dengan ' +
         '<code>ABS(IMX-E)&lt;IMR1</code> &mdash; jarak dari titik bidik lebih ' +
         'kecil daripada jangkauan. Karena jangkauannya ikut membesar, sasaran ' +
         'yang lebih dekat otomatis lebih mudah kena.',
         'Tidak ada satu baris pun yang menghitung "sasaran besar lebih mudah ' +
         'kena". Itu akibat dari menaruh ukuran dan jangkauan di baris yang ' +
         'sama.',
         'Dan <code>IMFLAG</code> mengingat gambar MANA yang sedang dipakai, ' +
         'supaya baris 2990-3000 bisa menghapus jejak lamanya dengan gambar ' +
         'yang benar. Mengganti gambar di tengah animasi XOR menuntut ingatan ' +
         'tentang apa yang tadi digambar.'],
        ['Satu DRAW, tiga ukuran, tiga GET',
         '<code>1330 &hellip;DRAW "C2;BM145,59;M+0,0;BM+10,1;&hellip;"</code>',
         '<code>1340 &hellip;GET (145,59)-(145,59),IM1:GET (155,58)-(157,60),IM2:' +
         'GET (167,57)-(173,61),IM3</code>',
         'Satu perintah DRAW menggambar ketiga ukuran pesawat berjajar ke ' +
         'kanan di layar, lalu tiga <code>GET</code> memungut masing-masing ' +
         'dari petak yang berbeda.',
         'Yang paling kecil <code>GET (145,59)-(145,59)</code> &mdash; satu ' +
         'piksel. Itu pesawat yang masih terlalu jauh untuk berbentuk apa pun, ' +
         'dan ia tetap sebuah sprite penuh, dengan kepala dan semuanya.',
         'Dan gambar aslinya tidak dihapus: ia tetap terlihat di layar ' +
         'petunjuk sebagai contoh, di sebelah tulisan "IMPERIAL FIGHTER:". ' +
         'Bahan dan pajangan sekaligus.'],
        ['Jebakan yang ditunda berpasangan',
         'Baris 1180 menyalakan keenam jebakan tombol; baris 1190 menundanya. ' +
         'Keduanya dipanggil BERPASANGAN, mengapit tiap bagian yang tidak boleh ' +
         'disela &mdash; menggambar sasaran, menghapus jejaknya, memperbarui ' +
         'panel.',
         'Yang dipakai <code>KEY(n) STOP</code>, bukan <code>OFF</code>. ' +
         'Bedanya menentukan: tombol yang ditekan selama penundaan tetap ' +
         '<b>diingat</b>, dan dijemput begitu jebakannya menyala lagi. Pemain ' +
         'tidak pernah kehilangan tembakan.',
         'Tiga keadaan &mdash; nyala, tunda, mati &mdash; dan program ini ' +
         'memakai ketiganya: <code>OFF</code> baru dipakai saat permainannya ' +
         'benar-benar berakhir.'],
        ['Musuh yang diganti sesudah mati',
         'Kalau Darth Vader ditembak jatuh, baris 5700 menyalin gambar pesawat ' +
         'kekaisaran ke dalam slot gambar Vader, dan baris 5670 mengganti ' +
         'tulisan di panel jadi "KM TO IMPERIAL FIGHTER".',
         'Sesudah itu <code>DVGONE</code> menyala, dan setiap pesan, setiap ' +
         'gambar tembakan, dan setiap kalimat kekalahan memeriksanya untuk ' +
         'memilih kata yang benar.',
         'Satu bendera, dan seluruh peran yang tadi dipegang Vader diambil alih ' +
         'pesawat biasa &mdash; termasuk jaraknya, yang di-<i>reset</i> ke ' +
         '25.000 km seperti musuh baru.']
      ],
      hindari: [
        ['Tiga belas gambar yang diketik dengan tangan',
         'Baris 1350-2030 berisi ratusan penugasan seperti ' +
         '<code>IM6(12)=-32760</code>. Tidak ada satu pun komentar yang ' +
         'mengatakan gambar apa itu, berapa ukurannya, atau dari mana angkanya ' +
         'datang.',
         'Angka-angka itu keluaran <code>GET</code> dari sesi lain yang tidak ' +
         'ada lagi &mdash; seseorang menggambar ledakannya, memungutnya, ' +
         'mencetak isinya, lalu mengetikkannya kembali ke dalam program.',
         'Satu salah ketik di antara ratusan bilangan itu tidak akan pernah ' +
         'ketahuan sampai gambarnya muncul di layar, dan bahkan kemudian yang ' +
         'terlihat cuma satu piksel yang salah warna.',
         'LANDER.BAS memilih jalan lain untuk persoalan yang sama, dan yang ' +
         'membedakan keduanya bukan kepintaran melainkan berapa banyak berkas ' +
         'yang mau dibawa di disket.'],
        ['Dua baris yang tidak pernah dijalankan',
         '<code>5280 GOTO 2320</code>',
         '<code>5290 REM * DISPLAY SKY FIGHTER *</code>',
         '<code>5300 IF J-S&lt;10000 THEN A=3</code>',
         'Baris 5280 selalu melompat, dan tidak ada satu pun lompatan ke 5290 ' +
         'atau 5300 di seluruh 732 baris. Judulnya menyebut musuh ketiga ' +
         '&mdash; "SKY FIGHTER" &mdash; yang tidak pernah dibangun, dan ' +
         'satu-satunya sisanya penugasan <code>A=3</code> ke variabel yang ' +
         'tidak dibaca siapa pun.',
         'Dan nama itu muncul sekali lagi, di baris 3670: "YOU HAVE JUST BEEN ' +
         'SHOT DOWN BY AN IMPERIAL SKY FIGHTER!" &mdash; kalimat kekalahan ' +
         'untuk musuh yang tidak ada, dipakai untuk musuh yang ada.'],
        ['Tingkat kesulitan yang lupa satu nilai',
         '<code>2110 IF SKILL=0 THEN A1=5:A2=0:BYPASS=3</code>',
         '<code>2140 IF SKILL=3 THEN A1=2:A2=30</code>',
         'Tiga tingkat pertama menyetel <code>BYPASS</code>; yang keempat ' +
         'tidak. Nilainya tetap nol dari <code>CLEAR</code> di baris 1300.',
         'Dan nol punya arti: baris 2520 menguji ' +
         '<code>IF FLAG1&lt;&gt;BYPASS</code>, jadi dengan BYPASS=0 syaratnya ' +
         'langsung salah dan musuhnya mengelak SETIAP putaran.',
         'Kebetulan itu benar &mdash; tingkat 3 memang yang tersulit. Tapi ' +
         'yang membuatnya tersulit bukan angka yang dipilih melainkan angka ' +
         'yang <b>tidak ditulis</b>, dan tidak ada apa pun di baris 2140 yang ' +
         'mengatakannya.'],
        ['Sembilan belas pesan yang ditulis lima kali',
         'Pola ini muncul sembilan kali di berkas ini, tiap kali tujuh baris:',
         '<code>FOR K=1 TO 2 : LOCATE 24,1:PRINT "pesan"; : PLAY "L2 N0" : ' +
         'LOCATE 24,1:PRINT "spasi"; : PLAY "L16 N0" : NEXT K</code>',
         'lalu pesannya dicetak sekali lagi, dijeda dua kali, dan dihapus.',
         'Enam puluh tiga baris untuk sesuatu yang bisa jadi satu subrutin ' +
         'dengan satu argumen string. Dan karena disalin, pesannya sendiri ' +
         'harus ditulis DUA KALI di tiap salinan &mdash; sekali sebagai teks, ' +
         'sekali sebagai spasi sepanjang teks itu.',
         'Baris 3090 menghapus 34 spasi untuk pesan 33 aksara. Satu kelebihan, ' +
         'tidak berakibat apa-apa, dan tidak mungkin ketahuan tanpa menghitung.']
      ]
    },

    penjelasan: [
      { judul: 'Torpedo yang bertanya pada layar',
        isi: [
          'Meriam laser di baris 5420-5430 menguji kena dengan aritmetika: ' +
          'jarak antara titik bidik dan letak sasaran, dibandingkan dengan ' +
          'jangkauan tembak.',
          'Torpedo tidak. Baris 5840:',
          '<code>5840 IF POINT(38,21)&lt;&gt;3 THEN 5880</code>',
          'Titik (38,21) adalah pusat garis bidik. <code>POINT</code> membaca ' +
          'WARNA piksel di layar. Dan warna 3 adalah warna Bintang Kematian.',
          'Jadi pertanyaannya bukan "di mana Bintang Kematian?" melainkan ' +
          '<i>"apakah ada bagian Bintang Kematian tepat di tengah bidikan ' +
          'saya?"</i> &mdash; dan yang menjawabnya layar itu sendiri.',
          'Bedanya bukan gaya. Bintang Kematian bukan titik: pada jarak ' +
          'terdekat ia gambar 7&times;7 piksel dengan lekuk dan lubang. ' +
          'Menguji "apakah bidikan mengenai bagian yang padat" dengan ' +
          'aritmetika menuntut menyimpan bentuknya. Menanyakannya pada layar ' +
          'tidak menuntut apa pun &mdash; bentuknya sudah ada di sana, ' +
          'digambar oleh <code>PUT</code> beberapa baris sebelumnya.',
          'Dan petunjuknya di baris 7650 menjelaskannya dengan kata-kata yang ' +
          'sama: <i>"some part of the space station in the center of the cross ' +
          'hairs"</i>. Bagian. Bukan pesawatnya, bagiannya.',
          'Ini pemakaian kesembilan "layar sebagai struktur data" di koleksi ' +
          'ini, dan yang paling ketat: yang dibaca bukan aksara melainkan satu ' +
          'piksel, dan yang bergantung padanya bukan tampilan melainkan syarat ' +
          'menang.',
          'Sesudah lolos uji itu pun masih ada dua lapis lagi &mdash; baris ' +
          '5850 memberi tingkat 0 kemenangan cuma-cuma, dan baris 5860-5870 ' +
          'melempar dadu untuk tingkat lainnya. Bidikan yang tepat bukan ' +
          'jaminan; ia cuma tiket untuk ikut undian.'
        ] },
      { judul: 'Kop surat di depan program orang lain',
        isi: [
          'Berkas ini dimulai dengan dua ratus delapan puluh baris yang tidak ' +
          'ada hubungannya dengan permainannya:',
          '<code>40 PRINT"&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&hellip;"</code>',
          '<code>110 PRINT"&#x2591;&#x2502; BROUGHT TO YOU BY THE MEMBERS OF  &#x2502;&#x2591;"</code>',
          '<code>180 PRINT"&#x2591;&#x2502;      International PC Owners      &#x2502;&#x2591;"</code>',
          '<code>200 PRINT"&#x2591;&#x2502;P.O. Box 10426, Pittsburgh PA 15234&#x2502;&#x2591;"</code>',
          'Sebuah kotak berbingkai aksara blok CP437, dengan huruf TPCUG ' +
          'digambar dari aksara &#x2584; dan &#x2588; setinggi lima baris, dan ' +
          'sebuah kotak pos di Pittsburgh.',
          'Lalu baris 260 menunggu tombol, baris 280 membersihkan layar, dan ' +
          'baris 1000 memulai program yang sebenarnya &mdash; yang kepalanya ' +
          'menyebut tiga nama lain dan dua kota lain:',
          '<code>1010  REM * WRITTEN BY GEORGE BLANK, LEECHBURG, PA. *</code>',
          '<code>1040  REM * MODIFIED TO RUN ON THE IBM PC BY ERNEST *</code>',
          '<code>1050  REM * SMITH AND RAYMOND ROGERS, HOUSTON, TEXAS *</code>',
          'Tiga lapis kepemilikan, ditumpuk menurut urutan waktunya, dan tidak ' +
          'satu pun menghapus yang di bawahnya. Klub yang menyebarkannya ' +
          'menempelkan kopnya <b>di depan</b>, bukan menggantikan.',
          'Nomor barisnya sendiri yang menceritakannya: 10-280 untuk kop ' +
          'suratnya, lalu lompat ke 1000. Seribu adalah nomor yang dipilih ' +
          'orang yang tahu ia sedang menyisipkan sesuatu di depan program yang ' +
          'sudah jadi, dan tidak mau menyentuh penomorannya.',
          'Dan di antara ketiganya ada satu kalimat lagi, baris 1020, yang ' +
          'mengurus perizinan seluruh permainan ini dalam sembilan kata:',
          '<code>1020  REM * FOR  PUBLIC DOMAIN UNLESS MOVIEMAKERS OBJECT *</code>',
          'September 1978. Film itu baru setahun.'
        ] }
    ]
  };
})(window);
