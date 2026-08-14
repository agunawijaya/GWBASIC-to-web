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

