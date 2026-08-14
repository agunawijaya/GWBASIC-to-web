/* ===========================================================================
   penjalan.js — mesin yang menelusuri tabel baris.

   Seluruh alasan berkas ini ada: **sorotan dan eksekusi harus berasal dari
   struktur yang sama.** Kalau porting minimalisnya ditulis sebagai fungsi
   biasa lalu nomor barisnya ditempel belakangan sebagai komentar, sorotan di
   panel kanan menjadi klaim yang tidak ada yang memeriksanya — dan klaim yang
   tidak diperiksa selalu melenceng cepat atau lambat.

   Maka programnya ditulis begini:

       [ { baris: 10, jalan: function (m) { m.cls(); } },
         { baris: 20, jalan: function (m) { m.gosub(500); } } ]

   Penjalan memegang satu penunjuk ke dalam larik itu. Baris yang disorot =
   entri yang penunjuknya sedang menunjuk. Tidak ada jalan bagi keduanya untuk
   berbeda.

   Akibat lain yang disengaja:
     - GOTO/GOSUB menjadi pencarian nomor baris di dalam tabel, persis seperti
       yang dilakukan penafsir BASIC sungguhan.
     - Nomor baris yang belum ditulis TIDAK dilewati diam-diam; penelusuran
       berhenti dan mengatakan baris berapa yang hilang.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Status yang mungkin dilaporkan ke antarmuka. */
  var DIAM = 'diam';          /* siap, belum/berhenti jalan     */
  var JALAN = 'jalan';        /* penelusuran otomatis berjalan  */
  var TUNGGU = 'tunggu';      /* gelung INKEY$, menanti tombol  */
  var MASUK = 'masukan';      /* INPUT: menanti satu BARIS utuh */
  var SELESAI = 'selesai';    /* program habis dengan wajar     */
  var GAGAL = 'gagal';        /* ada yang belum ditulis / salah */

  /* Pembantu `PRINT USING`; lihat catatan di `cetakFormat`.

     Sebuah string format terdiri atas satu MEDAN ANGKA dan teks harfiah di
     kiri-kanannya. `PRINT USING " ##,### ";4000` mencetak satu spasi, angkanya,
     lalu satu spasi lagi; `PRINT USING "Ball #  ";1` mencetak `Ball 1  `.
     Jadi medannya dicari dulu, sisanya diteruskan apa adanya. */
  function berformat(fmt, nilai) {
    /* Yang di luar MEDAN ANGKA dicetak apa adanya. `PRINT USING "Ball #  ";S`
       menghasilkan `Ball 1  ` — kata "Ball" bukan bagian formatnya, ia teks
       biasa yang kebetulan berada di string yang sama. Ditagih BREAKOUT.BAS
       baris 570, dan sebelum itu dianggap tidak ada. */
    var medan = fmt.match(/[#,.$]*#[#,.$]*/);
    if (!medan) return fmt;
    if (medan.index || medan.index + medan[0].length < fmt.length) {
      return fmt.slice(0, medan.index) + berformat(medan[0], nilai) +
             fmt.slice(medan.index + medan[0].length);
    }
    var titik = fmt.indexOf('.');
    var kepala = titik < 0 ? fmt : fmt.slice(0, titik);
    var desimal = titik < 0 ? 0 : (fmt.slice(titik + 1).match(/#/g) || []).length;
    var s = Math.abs(Number(nilai) || 0).toFixed(desimal).split('.');
    if (kepala.indexOf(',') >= 0) {
      s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    var teks = s[0] + (desimal ? '.' + s[1] : '');
    if (kepala.indexOf('$$') >= 0) teks = '$' + teks;
    if (Number(nilai) < 0) teks = '-' + teks;
    while (teks.length < fmt.length) teks = ' ' + teks;
    return teks;
  }

  function Penjalan(opsi) {
    this.konsol = opsi.konsol;
    this.cariProgram = opsi.cariProgram || function () { return null; };
    this.adaSumber = opsi.adaSumber || function () { return false; };
    /* Mencari port lengkap sebuah program di web/games/. Lihat catatan di
       `_run`: `RUN "WILDCAT"` di MENU.BAS harus benar-benar sampai ke
       Wildcatter, bukan berhenti di pesan. */
    this.cariPort = opsi.cariPort || function () { return null; };
    this.bukaPort = opsi.bukaPort || function () {};
    this.saatBerubah = opsi.saatBerubah || function () {};

    this.laju = 8;                 /* baris per detik */
    this.titikHenti = {};          /* {nomorBaris: true} */

    this.program = null;
    this.tabel = [];
    this.idx = -1;
    /* Nomor bagian di dalam baris berbagian. Lihat catatan "Baris berbagian"
       di bawah; untuk baris biasa nilainya selalu 0. */
    this.bagian = 0;
    this.status = DIAM;
    this.pesan = '';
    this.jumlahLangkah = 0;

    this.tumpukan = [];            /* indeks kembali untuk GOSUB */
    this.penyangga = [];           /* tombol yang belum diambil INKEY$ */
    this.fungsiTertunda = [];      /* F1..F10 yang menunggu dijemput jebakan */
    this.jebakanBerjalan = 0;      /* nomor tombol yang penangannya jalan */
    this.gelung = [];              /* tumpukan FOR yang sedang terbuka */
    this.data = [];                /* isi seluruh pernyataan DATA */
    this.dataKe = 0;               /* penunjuk READ berikutnya */

    this._kendali = null;
    this._bingkaiAktif = false;
    this._tSebelum = null;
    this._sisa = 0;
    this._lewatiHenti = false;
    this._diamDi = 0;

    this.m = this._bikinMesin();
  }

  /* --- objek `m` yang dilihat tiap baris ---------------------------------- */

  Penjalan.prototype._bikinMesin = function () {
    var P = this;
    var k = this.konsol;
    /* Permukaan grafik menempel di induk yang sama dengan konsol teks, dan
       hanya salah satu yang terlihat pada satu waktu. Lihat mesin/grafik.js. */
    var g = this.grafik = new global.TRACER.Grafik(k.induk.parentNode || k.induk, k);

    return {
      /* Variabel program. RUN mengosongkannya — itu pelajaran utama MENU.BAS. */
      v: {},
      /* Nilai ERR terakhir, dibaca oleh baris penangkap galat. */
      err: 0,
      /* Baris tujuan ON ERROR GOTO; 0 berarti penangkap dimatikan. */
      penangkapGalat: 0,

      /* ON KEY(n) GOSUB baris — baris tujuan tiap jebakan.
         Nomor 1-10 tombol fungsi F1-F10; 11-14 tombol panah
         (11 atas, 12 kiri, 13 kanan, 14 bawah), persis penomoran GW-BASIC. */
      jebakanBaris: {},
      /* KEY(n) ON / KEY(n) OFF — nyala tidaknya tiap jebakan. */
      jebakanNyala: {},
      /* KEY(n) STOP — ditunda: tombolnya diingat, penjemputannya tidak. */
      jebakanTunda: {},

      /* --- layar --- */
      /* --- layar ---
         Empat perintah di bawah ini adalah SATU-SATUNYA tempat teks dan
         grafik bertemu. Selama `SCREEN 0`, semuanya jatuh ke konsol teks
         seperti sebelumnya; begitu `SCREEN 1` atau `2` dipasang, yang
         menerima permukaan piksel. Tabel baris tidak perlu tahu bedanya. */
      /* `SCREEN mode, warna, aktif, tampak`. Dua argumen terakhir memilih
         HALAMAN teks yang ditulisi dan yang ditampilkan — lihat catatan
         panjang di `konsol.js`. Ditagih SOLITAIR.BAS baris 180/880/1110. */
      layar:     function (mode, warna, aktif, tampak) {
                   g.layar(mode);
                   if (aktif !== undefined || tampak !== undefined) {
                     k.aturHalaman(aktif, tampak);
                   }
                 },
      cls:       function () { if (g.aktif()) g.cls(); else k.cls(); },
      spc:       function (n) { k.spc(n); },
      /* `PRINT USING` — pencetakan berformat. Yang ditiru hanya bagian yang
         benar-benar dipakai koleksi ini:
             $$   tanda dolar yang menempel di depan angka pertama
             #    satu posisi angka
             ,    pemisah ribuan
             .##  dua angka di belakang koma
         Bentuk lain (`**`, `+`, `^^^^`, medan string `\  \`) belum ditiru;
         kalau nanti ada program yang memakainya, hasilnya akan salah dan
         penelusuran TIDAK berhenti — jadi catatan ini penting. */
      cetakFormat: function (fmt, nilai) { k.cetak(berformat(fmt, nilai)); },
      /* BSAVE / BLOAD atas RAM layar — lihat catatan panjang di `konsol.js`.
         Ditagih DRAW.BAS, yang menyimpan gambar dengan menyalin RAM layar
         mentah-mentah. Simpanannya cuma ada di memori penelusur: menyegarkan
         halaman menghapus semuanya. */
      simpanLayar:   function (bitaAwal, jumlahBita) {
        return k.simpanBlok(bitaAwal, jumlahBita);
      },
      pulihkanLayar: function (data, bitaAwal) { k.pulihkanBlok(data, bitaAwal); },
      /* POKE satu aksara ke RAM layar — lihat catatan di `konsol.js`.
         Ditagih WILDCAT.BAS, yang memoke simpangan kisi petanya satu per
         satu ke alamat yang dihitungnya sendiri. */
      pokeLayar: function (bitaAlamat, kode) { k.pokeAksara(bitaAlamat, kode); },
      /* SCREEN(baris, kolom) dan SCREEN(baris, kolom, 1) — membaca kembali
         isi layar. Ditagih SUB.BAS untuk trik "simpan-di-bawah": baca dulu
         apa yang ada di situ, gambar bomnya, lalu kembalikan. */
      layarAksara: function (b, kol) { return k.bacaAksara(b, kol); },
      layarAtribut: function (b, kol) { return k.bacaAtribut(b, kol); },
      /* CHR$(n) mengembalikan BITA n, bukan glifnya. Ini penting dan sempat
         salah: `IF RS$=CHR$(27)` di CHECK.BAS membandingkan bita yang datang
         dari INKEY$, sedangkan `PRINT CHR$(196)` di INTRO.BAS menggambar
         garis. Satu fungsi, dua pemakaian — dan yang menyatukan keduanya
         adalah bitanya, bukan gambarnya. Terjemahan ke glif CP437 dikerjakan
         konsol saat mencetak. */
      chr:       function (n) { return String.fromCharCode(n & 255); },
      /* STRING$(n, kode) — n salinan satu bita. */
      ulang:     function (n, kode) {
        var s = String.fromCharCode(kode & 255), keluar = '', i;
        for (i = 0; i < n; i++) keluar += s;
        return keluar;
      },
      warna:     function (fg, bg, batas) {
                   k.warna(fg, bg);
                   /* Di SCREEN 1, `COLOR latar, palet` artinya lain sama
                      sekali: yang pertama warna nomor nol, yang kedua memilih
                      gugus hijau-merah-coklat atau cyan-magenta-putih. */
                   if (g.aktif()) g.warna(fg, bg);
                   if (batas !== undefined) { /* argumen ke-3: bingkai layar */ }
                 },
      /* `DEF SEG: POKE &H4E,n` — warna teks di MODE GRAFIK.
         Di SCREEN 1 dan 2, `COLOR` tidak lagi berarti warna huruf: yang
         pertama jadi warna nomor nol dan yang kedua memilih palet. Tidak ada
         satu pun pernyataan BASIC yang menyetel warna huruf di mode grafik.
         Yang ada cuma satu alamat di daerah kerja BASICA sendiri &mdash;
         &H4E &mdash; dan program yang butuh huruf berwarna memokenya
         langsung. Ditagih 15PUZZLE.BAS baris 790 dan 960. */
      warnaTeks: function (n) { k.warna(n & 15, null); },
      locate:    function (b, kol, kur) { k.locate(b, kol, kur); },
      kursor:    function (t) { k.kursor(t); },
      /* Teks tidak perlu tahu apa pun soal grafik: konsol memberi tahu
         permukaan piksel lewat kait `saatSelBerubah`, sel demi sel. */
      cetak:     function (s) { k.cetak(s); },
      barisBaru: function () { k.barisBaru(); },
      tab:       function (n) { k.tab(n); },
      pos:       function () { return k.pos(); },

      /* --- grafik ---
         Semuanya diteruskan apa adanya ke mesin/grafik.js; yang di sini cuma
         nama Indonesianya, supaya tabel baris terbaca seperti kalimat. */
      pset:      function (x, y, c) { g.pset(x, y, c); },
      preset:    function (x, y, c) { g.preset(x, y, c); },
      titik:     function (x, y) { return g.titik(x, y); },
      garis:     function (x1, y1, x2, y2, c, bentuk, gaya) {
                   g.garis(x1, y1, x2, y2, c, bentuk, gaya);
                 },
      lingkaran: function (x, y, r, c, awal, akhir, aspek) {
                   g.lingkaran(x, y, r, c, awal, akhir, aspek);
                 },
      cat:       function (x, y, c, batas) { g.cat(x, y, c, batas); },
      ambil:     function (x1, y1, x2, y2) { return g.ambil(x1, y1, x2, y2); },
      taruh:     function (x, y, gbr, aksi) { g.taruh(x, y, gbr, aksi); },
      /* Variabel program ikut diserahkan: DRAW boleh membacanya sendiri lewat
         bentuk `=NAMA;`. Lihat catatan di `gambarMakro`. */
      gambar:    function (s) { g.gambarMakro(s, P.m.v); },
      pandang:   function (x1, y1, x2, y2) { g.pandang(x1, y1, x2, y2); },
      /* Titik acuan terakhir, dipakai bentuk STEP. */
      xKini:     function () { return g.x; },
      yKini:     function () { return g.y; },

      /* --- masukan --- */
      /* INKEY$: ambil satu tombol dari penyangga, atau "" kalau kosong.
         Tidak menunggu — persis seperti aslinya. */
      inkey: function () {
        return P.penyangga.length ? P.penyangga.shift() : '';
      },
      /* --- larik ---
         BASIC memberi larik batas ATAS, dan indeksnya mulai dari 0. `DIM
         TW(3,8)` berarti 4x9 kotak, bukan 3x8. Kesalahan pagar-tiang ini
         sudah menjebak orang selama empat puluh tahun, jadi ditiru apa
         adanya — termasuk isian awalnya: 0 untuk angka, "" untuk string. */
      dim: function (nama, b1, b2, b3) {
        /* Nama larik boleh ditulis dengan kurung — `A$()` — supaya
           larik dan skalar bernama sama bisa hidup berdampingan seperti
           di BASIC. Jadi tanda dolarnya dicari DI MANA PUN, bukan cuma
           di ujung nama. */
        var isi = (nama.indexOf('$') >= 0) ? '' : 0;
        var batas = [b1, b2, b3].filter(function (b) { return b !== undefined; });
        function bikin(tingkat) {
          var larik = new Array(batas[tingkat] + 1), i;
          for (i = 0; i <= batas[tingkat]; i++) {
            larik[i] = (tingkat + 1 < batas.length) ? bikin(tingkat + 1) : isi;
          }
          return larik;
        }
        this.v[nama] = bikin(0);
        return this.v[nama];
      },

      /* --- READ / DATA ---
         Seluruh pernyataan DATA di sebuah program membentuk SATU antrean
         panjang, tidak peduli di baris mana ia ditulis. READ mengambil satu
         nilai berikutnya dari antrean itu. Itu sebabnya menambah satu DATA di
         tengah program bisa menggeser bacaan di tempat yang sama sekali lain. */
      data: function (daftar) { P.data = P.data.concat(daftar); },
      baca: function () {
        if (P.dataKe >= P.data.length) {
          P.m.galat(4, 'Out of DATA');
          return null;
        }
        return P.data[P.dataKe++];
      },
      /* RESTORE, dan `RESTORE <baris>` yang memindahkan penunjuk DATA ke
         tempat tertentu alih-alih ke awal. Karena penelusur menyimpan seluruh
         DATA sebagai satu larik datar, yang diberikan bukan nomor baris
         melainkan INDEKS di larik itu — dan tabel baris yang bersangkutan
         menulis indeksnya di komentar. Ditagih STATS.BAS baris 2930. */
      ulangData: function (indeks) { P.dataKe = indeks || 0; },

      /* --- gelung FOR yang membentang banyak baris ---
         Lihat catatan panjang di dekat `_lanjutkanGelung` di bawah. */
      untuk: function (nama, awal, akhir, langkah, lewatKe) {
        P._bukaGelung(nama, awal, akhir, langkah, lewatKe);
      },
      lanjutkan: function (nama) { P._lanjutkanGelung(nama); },

      /* CSRLIN — baris kursor sekarang, pasangan POS(0). */
      barisKursor: function () { return k.b; },

      /* --- jebakan tombol fungsi ---
         ON KEY(n) GOSUB baris memasang penangan; KEY(n) ON menyalakannya.
         Keduanya terpisah di BASIC dan urutannya bebas — MENU.BAS memasang
         lalu menyalakan, CHECK.BAS menyalakan lalu memasang. */
      pasangJebakan: function (n, baris) { this.jebakanBaris[n] = baris; },
      jebakan:       function (n, nyala) {
        this.jebakanNyala[n] = !!nyala;
        this.jebakanTunda[n] = false;
      },
      /* `KEY(n) STOP` — keadaan KETIGA, bukan sekadar mati. Tombolnya tetap
         DIINGAT, tapi jebakannya tidak dijemput sampai `KEY(n) ON` berikutnya.
         PEGLEAP.BAS memakainya sebagai gelung: nyalakan, matikan-tunda, pasang
         penangan, baca INKEY$ — berputar sampai Enter ditekan. Tanpa keadaan
         tunda, tombol panah yang ditekan di sela gelung akan hilang. */
      tundaJebakan:  function (n) {
        this.jebakanNyala[n] = false;
        this.jebakanTunda[n] = true;
      },

      /* `DEF SEG:POKE 106,0` adalah trik lama untuk membuang tombol yang
         terlanjur ditekan: offset 106 di segmen data GW-BASIC sendiri (bukan
         segmen 0) menyimpan cacah tombol tertunda milik penafsir. */
      kosongkanPenyangga: function () { P.penyangga.length = 0; },
      /* `CLEAR` — mengosongkan SELURUH variabel tanpa memuat ulang
         programnya. Bedanya dengan `RUN`: alurnya tidak kembali ke baris
         pertama, jadi baris sesudahnya jalan dengan papan kosong.
         Ditagih XWING.BAS baris 1300, yang dilompati dari baris 5340
         setiap kali pemain memulai permainan baru. */
      kosongkanVariabel: function () {
        var nama;
        for (nama in this.v) { if (this.v.hasOwnProperty(nama)) delete this.v[nama]; }
      },

      /* --- INPUT ---
         Bedanya dengan INKEY$ mendasar: INKEY$ mengambil SATU tombol dan
         tidak pernah menunggu; INPUT menunggu SATU BARIS UTUH, lengkap
         dengan gema di layar dan Backspace yang bekerja.

         Sepanjang dua belas program sebelumnya, tidak satu pun memakai INPUT
         — semuanya menulis penyunting masukannya sendiri dari INKEY$ (lihat
         BIO.BAS baris 1340-1670 dan HANGMAN.BAS baris 2130-2240). OTHELLO.BAS
         yang pertama memakai perintah bawaannya, dan itu masuk akal: ia port
         dari BASIC Commodore PET, bukan tulisan tim Friendlyware.

         Cara kerjanya di penelusur: baris yang memanggil `masukan()` DIULANG
         sekali. Panggilan pertama menyalakan modus menunggu; sesudah pemakai
         menekan Enter, baris yang sama dijalankan lagi dan kali ini
         `masukan()` langsung mengisi variabelnya lalu kembali. Karena itu
         INPUT sebaiknya diletakkan di bagiannya sendiri.

         `nama` boleh berupa FUNGSI, dan itu bukan kemewahan: `INPUT A(J,K)`
         di SIMEQN.BAS mengisi sebuah SEL LARIK, bukan variabel bernama, dan
         `INPUT L` di INTEGRAT.BAS harus jadi ANGKA, bukan teks yang diketik.
         Dua-duanya diselesaikan di berkas programnya sendiri:

             m.masukan(function (s) { m.v.A[J][K] = angka(s); }, 'Koefisien? ')

         Bentuk string tetap berlaku dan artinya sama seperti sebelumnya:
         isikan apa adanya ke variabel bernama itu. */
      masukan: function (nama, tanya) {
        if (P._masukanSiap) {
          if (typeof nama === 'function') nama(P._masukanIsi);
          else P.m.v[nama] = P._masukanIsi;
          P._masukanSiap = false;
          P._masukanIsi = '';
          return;
        }
        if (tanya) k.cetak(tanya);
        P._kendali = { jenis: 'masukan' };
      },

      /* --- kendali alur --- */
      /* Menunggu DI TEMPAT: baris DAN bagian yang sama dijalankan lagi di
         langkah berikutnya.

         Perlu karena `IF INKEY$="" THEN <baris ini>` melompat ke AWAL
         barisnya — dan kalau penantiannya berada di penggal kedua sebuah
         baris berbagian, penggal pertama akan ikut jalan lagi. SERPENT.BAS
         baris 520 (`CLS:PRINT "press a key":A$=INPUT$(1)`) akan membersihkan
         layar tiap langkah kalau ditulis begitu. */
      tunggu:  function () {
        P._kendali = { jenis: 'gelung', idx: P.idx, bagian: P.bagian };
      },
      lompat:  function (n) { P._kendali = { jenis: 'lompat', ke: n }; },
      gosub:   function (n) { P._kendali = { jenis: 'gosub', ke: n }; },
      /* `RETURN` polos pulang ke pemanggilnya. `RETURN <baris>` membuang
         alamat pulang itu dan melanjutkan di baris lain — cara sebuah
         penangan jebakan MENINGGALKAN pekerjaan yang tadi disela, bukan
         kembali ke sana. BIO.BAS baris 1680 memakainya untuk membatalkan
         penggambaran grafik saat F1 ditekan. */
      kembali: function (baris) {
        P._kendali = { jenis: 'kembali', ke: baris || 0 };
      },
      /* RUN "nama" — muat program lain. Variabel hilang, layar tidak dibersihkan. */
      jalankan: function (nama, baris) {
        P._kendali = { jenis: 'run', nama: nama, baris: baris || 0 };
      },
      henti:   function (pesan) { P._kendali = { jenis: 'henti', pesan: pesan || '' }; },
      /* Memicu galat BASIC; kalau ada ON ERROR aktif, alurnya ke sana.
         Dipakai juga untuk pernyataan `ERROR n`, yang memang gunanya memicu
         galat buatan sendiri — CHECK.BAS memakai kode 200 sebagai sandi
         "diskette-nya salah", bukan sebagai galat sungguhan. */
      galat:   function (kode, pesan) {
        P._kendali = { jenis: 'galat', kode: kode, pesan: pesan || '' };
      },
      /* RESUME dan RESUME <baris>. Tanpa argumen = ulangi yang tadi gagal. */
      lanjut:  function (ke) { P._kendali = { jenis: 'lanjut', ke: ke || 0 }; },

      /* --- berkas ---
         Program di koleksi ini tidak pernah benar-benar MEMBACA berkas lewat
         OPEN; mereka memakainya sebagai uji keberadaan. `OPEN "I",1,"MENU.BAS"`
         di CHECK.BAS artinya "apakah disket FriendlyWare ada di drive?" —
         kalau tidak, ERR 53 dan penangannya yang menyuruh pemakai memasukkan
         disket. Maka yang ditiru cukup keberadaannya. */
      buka: function (nama) {
        if (!P.adaSumber(nama)) P.m.galat(53, 'File not found: ' + nama);
      },

      /* --- disket dalam memori ---
         Sebagian program BENAR-BENAR membaca dan menulis berkas data:
         ZAP'EM.BAS menyimpan sepuluh skor tertinggi, WRTSTR.BAS menulis
         kosakata untuk ELIZA.BAS. Untuk itu penjalan memegang sebuah
         "disket": peta nama-berkas -> larik nilai, persis seperti antrean
         DATA.

         Yang penting: disket ini TIDAK dikosongkan oleh `RUN` maupun
         `CLEAR`. Berkas di disket sungguhan juga tidak. Yang mengosongkannya
         cuma menyegarkan halaman. */
      bukaTulis: function (nama) {
        P.disket[nama] = [];
        P._berkas = { nama: nama, tulis: true, ke: 0 };
      },
      bukaBaca: function (nama) {
        if (!P.disket[nama]) { P.m.galat(53, 'File not found: ' + nama); return; }
        P._berkas = { nama: nama, tulis: false, ke: 0 };
      },
      /* `PRINT#1, a;",";b` menulis satu baris berisi dua medan. Yang disimpan
         di sini medannya, bukan barisnya — supaya `INPUT#1, x, y` membacanya
         kembali satu per satu, sama seperti yang dilakukan penafsirnya. */
      tulisBerkas: function () {
        var b = P._berkas, i;
        if (!b || !b.tulis) return;
        for (i = 0; i < arguments.length; i++) P.disket[b.nama].push(arguments[i]);
      },
      bacaBerkas: function () {
        var b = P._berkas;
        if (!b || b.tulis) return '';
        var isi = P.disket[b.nama];
        if (b.ke >= isi.length) { P.m.galat(62, 'Input past end'); return ''; }
        return isi[b.ke++];
      },
      tutup: function () { P._berkas = null; },
      /* CHAIN "nama", baris — seperti RUN tapi meneruskan ke nomor baris
         tertentu, dan (dengan COMMON) bisa membawa variabel. */
      rantai: function (nama, baris) {
        P._kendali = { jenis: 'rantai', nama: nama, baris: baris || 0 };
      },
      /* --- suara ---
         Penelusur ini tidak bersuara sama sekali, dan itu penyimpangan yang
         harus dinyatakan tiap kali dipakai. Untuk HEAREYE.BAS akibatnya
         besar: seluruh tes pendengarannya adalah nada yang naik, dan tanpa
         nada itu yang tersisa cuma kerangkanya. Kerangkanya sendiri tetap
         mengajar — lihat catatan di program/HEAREYE.js. */
      /* --- pengacak ---
         RND dan RANDOMIZE. Yang dipakai pengacak bersama repositori ini
         (web/_shared/rng.js), BUKAN pengacak GW-BASIC yang asli — jadi
         urutan angkanya berbeda dari mesin 1982.

         Itu disengaja, dan alasannya penelusuran: penelusur ini menyemai
         dengan benih TETAP saat program dimuat, sehingga menjalankan program
         yang sama dua kali menghasilkan angka yang sama. Titik henti dan
         percobaan jadi bisa diulang. Program yang menyemai dari jam
         (`RANDOMIZE(VAL(RIGHT$(TIME$,2)))`) tetap dituruti — hanya saja di
         sini "jam"-nya adalah angka yang diberikan tabel barisnya. */
      acak: function () { return P.pengacak.next(); },
      semai: function (benih) { P.aturBenih(benih); },
      /* `RANDOMIZE` di GW-BASIC MENCAMPUR argumennya ke benih yang sedang
         berjalan; ia tidak menggantinya begitu saja. Bedanya baru terasa di
         satu keadaan: kalau RANDOMIZE dipanggil berkali-kali dengan angka
         yang SAMA di dalam satu gelung.

         MATCH.BAS baris 320 melakukan persis itu — menyemai ulang dengan
         detik jam di dalam gelung penolakan. Dengan penggantian murni,
         undian berikutnya membeku pada nilai yang sama dan gelungnya tidak
         pernah selesai. Dengan pencampuran, tiap putaran memberi angka baru.

         Port lain memakai `semai` biasa, dan hasilnya sama saja di sana
         karena tidak satu pun menyemai ulang dengan angka tetap berulang. */
      semaiCampur: function (n) {
        P.aturBenih(((n | 0) ^ Math.floor(P.pengacak.next() * 0x7fffffff)) >>> 0);
      },

      /* `LPRINT` menulis ke PRINTER, bukan ke layar. Penelusur tidak punya
         printer, dan program yang seluruh keluarannya LPRINT (NOTETABL.BAS)
         akan tampil kosong sama sekali kalau ini dibiarkan diam. Maka
         keluarannya dibelokkan ke layar, dan itu dicatat sebagai
         penyimpangan di tiap program yang memakainya. */
      cetakPrinter: function (s) { k.cetak(s === undefined ? '' : String(s)); },

      bunyi: function () { },                       /* BEEP            */
      suara: function (frekuensi, lama) { },        /* SOUND f, lama   */
      mainkan: function (makro) { },                /* PLAY "..."      */
      /* Untuk baris yang tidak bisa dijalankan utuh (mis. DRAW.BAS memanggil
         DRAW.EXE yang hilang dari koleksi). Berhenti dan katakan kenapa. */
      buntu: function (alasan) { P._kendali = { jenis: 'buntu', alasan: alasan }; }
    };
  };

  /* --- memuat program ------------------------------------------------------ */

  Penjalan.prototype.muat = function (program, opsi) {
    opsi = opsi || {};
    this.jeda();
    /* Halaman teks kembali ke nol/nol: memuat program lain tidak boleh
       mewarisi halaman yang kebetulan sedang ditampilkan program sebelumnya. */
    if (this.konsol.aturHalaman) this.konsol.aturHalaman(0, 0);
    /* Disket bertahan melewati RUN dan CLEAR — berkas di disket sungguhan
       juga. Isi awalnya (`disketAwal`) cuma dipasang kalau berkasnya belum
       ada, supaya perubahan dari permainan sebelumnya tidak hilang. */
    this.disket = this.disket || {};
    this._berkas = null;
    if (program.disketAwal) {
      for (var nb in program.disketAwal) {
        if (!this.disket[nb]) this.disket[nb] = program.disketAwal[nb].slice();
      }
    }
    this.program = program;
    this.tabel = program.tabel;
    this.idx = 0;
    this.bagian = 0;
    this.tumpukan = [];
    this.penyangga = [];
    this.fungsiTertunda = [];
    this.jebakanBerjalan = 0;
    this.gelung = [];
    /* DATA dikumpulkan SEBELUM program jalan, bukan saat baris DATA-nya
       dilewati — di GW-BASIC pun begitu, dan itulah kenapa baris DATA boleh
       diletakkan di mana saja, termasuk di tempat yang tidak pernah dieksekusi
       (TOWERS.BAS menaruhnya di antara RETURN dan subrutin berikutnya). */
    this.data = (program.data || []).slice();
    this.dataKe = 0;
    /* Benih tetap: dua kali menjalankan program yang sama memberi angka yang
       sama. Tanpa ini, tiap penelusuran berbeda dan tidak ada percobaan yang
       bisa diulang. */
    this.aturBenih(program.benih === undefined ? 1982 : program.benih);
    this.status = DIAM;
    this.pesan = '';
    this._lewatiHenti = false;
    this._diamDi = 0;

    if (!opsi.pertahankanVariabel) this.m.v = {};
    this.m.err = 0;
    this.m.erl = 0;
    this.m.penangkapGalat = 0;
    this._titikGalat = null;
    this._dalamPenangan = false;
    this._masukanSiap = false;
    this._masukanIsi = '';
    /* RUN membuang jebakan tombol sama seperti ia membuang variabel. */
    this.m.jebakanBaris = {};
    this.m.jebakanNyala = {};
    this.m.jebakanTunda = {};

    if (!opsi.pertahankanLayar) {
      this.konsol.warna(7, 0);
      this.konsol.cls();
      this.konsol.kursor(true);
    }
    this.jumlahLangkah = opsi.pertahankanLangkah ? this.jumlahLangkah : 0;
    this._lapor();
  };

  /* --- gelung FOR yang membentang banyak baris -----------------------------

     Sampai program keempat, tiap gelung FOR muat dalam satu baris, jadi satu
     langkah penelusuran menjalankan seluruh putarannya. TOWERS.BAS memaksa
     yang sebenarnya:

         420 FOR DK=1 TO 8
         430   IF TW(PL,DK) THEN ... :GOTO 460
         440 NEXT DK

     Sekarang FOR dan NEXT ada di baris berbeda, dan penunjuknya harus bisa
     kembali ke atas. Maka ada tumpukan gelung, terpisah dari tumpukan GOSUB.

     Dua perilaku GW-BASIC yang ikut ditiru, keduanya penting:

     1. `FOR` dengan nama variabel yang SAMA membuang bingkai lama. Itulah yang
        menyelamatkan baris 430 di atas: ia melompat keluar gelung dengan GOTO
        tanpa pernah sampai ke NEXT, meninggalkan bingkai menggantung. Tanpa
        aturan ini, tumpukannya bertambah tiap kali dan tidak pernah surut.

     2. Syaratnya diuji di NEXT, bukan di FOR — jadi badan gelung selalu jalan
        sekali. GW-BASIC menguji di FOR dan bisa melompati badannya sama
        sekali. Untuk menutup beda itu, `untuk()` menerima argumen `lewatKe`:
        nomor baris sesudah NEXT-nya. Kalau rentangnya kosong dan `lewatKe`
        tidak diberikan, penelusuran BERHENTI dan mengatakannya — bukan
        diam-diam menjalankan badan yang seharusnya dilewati. */

  Penjalan.prototype._bukaGelung = function (nama, awal, akhir, langkah, lewatKe) {
    langkah = (langkah === undefined || langkah === 0) ? 1 : langkah;

    for (var i = this.gelung.length - 1; i >= 0; i--) {
      if (this.gelung[i].nama === nama) { this.gelung.splice(i, 1); break; }
    }
    this.m.v[nama] = awal;

    var kosong = langkah > 0 ? (awal > akhir) : (awal < akhir);
    if (kosong) {
      if (lewatKe) { this._kendali = { jenis: 'lompat', ke: lewatKe }; return; }
      this._kendali = { jenis: 'buntu', alasan:
        'gelung FOR ' + nama + ' rentangnya kosong (' + awal + ' sampai ' +
        akhir + ' langkah ' + langkah + '), dan tabel ini belum menyebutkan ' +
        'baris tujuan kalau badannya harus dilewati.' };
      return;
    }

    var entri = this.tabel[this.idx];
    this.gelung.push({
      nama: nama, akhir: akhir, langkah: langkah,
      idx: entri && entri.bagian ? this.idx : this.idx + 1,
      bagian: entri && entri.bagian ? this.bagian + 1 : 0
    });
  };

  Penjalan.prototype._lanjutkanGelung = function (nama) {
    var g = this.gelung[this.gelung.length - 1];
    if (!g) {
      this._kendali = { jenis: 'buntu', alasan: 'NEXT tanpa FOR yang terbuka.' };
      return;
    }
    /* `NEXT` polos menutup gelung terdalam. `NEXT A` menutup gelung A — dan
       SEKALIGUS membuang semua gelung yang lebih dalam darinya.

       Itu bukan kelonggaran, melainkan cara program lama keluar dari gelung
       bersarang. MASTER.BAS baris 1110 melompat dari dalam gelung Y langsung
       ke `NEXT X`; gelung Y ditinggalkan begitu saja, dan GW-BASIC
       membuangnya tanpa protes. Tanpa aturan ini, penelusuran berhenti di
       tempat yang di mesin aslinya berjalan mulus. */
    if (nama && g.nama !== nama) {
      var ada = -1, j;
      for (j = this.gelung.length - 1; j >= 0; j--) {
        if (this.gelung[j].nama === nama) { ada = j; break; }
      }
      if (ada < 0) {
        this._kendali = { jenis: 'buntu', alasan:
          'NEXT ' + nama + ' padahal tidak ada gelung FOR ' + nama +
          ' yang terbuka.' };
        return;
      }
      this.gelung.length = ada + 1;      /* buang yang lebih dalam */
      g = this.gelung[ada];
    }
    this.m.v[g.nama] += g.langkah;
    var lanjut = g.langkah > 0 ? (this.m.v[g.nama] <= g.akhir)
                               : (this.m.v[g.nama] >= g.akhir);
    if (lanjut) {
      this._kendali = { jenis: 'gelung', idx: g.idx, bagian: g.bagian };
    } else {
      this.gelung.pop();      /* habis: jatuh ke baris berikutnya */
    }
  };

  /* Pengacak bersama repositori dipakai kalau ada; kalau tidak, gelung
     bawaan yang sederhana. Yang penting bukan kualitas acaknya, melainkan
     bahwa benih yang sama selalu memberi urutan yang sama. */
  Penjalan.prototype.aturBenih = function (benih) {
    this.benih = benih;
    if (global.RETRO && global.RETRO.rng) {
      this.pengacak = global.RETRO.rng(benih);
      return;
    }
    var keadaan = (benih | 0) || 1;
    this.pengacak = { next: function () {
      keadaan = (keadaan * 1103515245 + 12345) & 0x7fffffff;
      return keadaan / 0x80000000;
    } };
  };

  Penjalan.prototype.ulangDariAwal = function () {
    if (this.program) this.muat(this.program);
  };

  /* --- kendali penelusuran ------------------------------------------------- */

  Penjalan.prototype.mulai = function () {
    if (!this.program) return;
    if (this.status === SELESAI || this.status === GAGAL) return;
    this.status = JALAN;
    this._tSebelum = null;
    this._sisa = 0;
    this._lapor();
    this._mintaBingkai();
  };

  Penjalan.prototype.jeda = function () {
    if (this.status === JALAN || this.status === TUNGGU) {
      this.status = DIAM;
      this._lapor();
    }
    this._bingkaiAktif = false;
  };

  Penjalan.prototype.aturLaju = function (n) {
    this.laju = n;
    this._sisa = 0;
  };

  Penjalan.prototype.aturTitikHenti = function (nomor) {
    if (this.titikHenti[nomor]) delete this.titikHenti[nomor];
    else this.titikHenti[nomor] = true;
    this._lapor();
    return !!this.titikHenti[nomor];
  };

  /* Tombol panah punya dua nasib yang berbeda, dan programnya yang memilih:

       ada `ON KEY(11..14)` terpasang -> jadi jebakan, TIDAK sampai ke INKEY$
       tidak ada                      -> masuk INKEY$ sebagai CHR$(0)+kode

     PEGLEAP.BAS memakai yang pertama untuk menggerakkan kursor; TOWERS.BAS
     memakai yang kedua dan memeriksanya dengan RIGHT$(Z,1). Keduanya benar,
     dan yang membedakan cuma ada tidaknya jebakan. */
  var PANAH = { 72: 11, 75: 12, 77: 13, 80: 14 };

  Penjalan.prototype.tekan = function (ch) {
    /* Sedang di tengah INPUT: tombolnya masuk ke baris jawaban, bukan ke
       penyangga INKEY$. Gema dan Backspace ditangani di sini, persis seperti
       yang dikerjakan penafsirnya sendiri. */
    if (this.status === MASUK) {
      if (ch === '\r') {
        this._masukanSiap = true;
        this.status = DIAM;
        this.pesan = 'INPUT menerima: "' + this._masukanIsi + '"';
        this.konsol.barisBaru();
        this._lapor();
        return;
      }
      if (ch === '\b' || ch === String.fromCharCode(8)) {
        if (this._masukanIsi.length) {
          this._masukanIsi = this._masukanIsi.slice(0, -1);
          this.konsol.cetak(String.fromCharCode(29) + ' ' + String.fromCharCode(29));
        }
        return;
      }
      if (ch.length === 1 && ch >= ' ') {
        this._masukanIsi += ch;
        this.konsol.cetak(ch);
      }
      return;
    }

    if (ch.length === 2 && ch.charCodeAt(0) === 0) {
      var n = PANAH[ch.charCodeAt(1)];
      if (n && this.m.jebakanBaris[n]) { this.tekanFungsi(n); return; }
    }
    this.penyangga.push(ch);
    /* Menekan tombol saat menunggu membuat penelusuran lanjut sendiri, supaya
       gelung INKEY$ terasa seperti aslinya alih-alih seperti kebuntuan.
       _diamDi harus dinolkan lebih dulu, kalau tidak gelung langsung menilai
       dirinya "masih menjajak" dan berhenti lagi di bingkai yang sama. */
    this._diamDi = 0;
    if (this.status === TUNGGU) this.mulai();
  };

  /* F1..F10. Berbeda dari tombol biasa: tombol fungsi tidak pernah masuk
     INKEY$, ia hanya memicu jebakan. Kalau tidak ada jebakan yang menyala
     untuknya, ia hilang begitu saja — persis seperti aslinya. */
  Penjalan.prototype.tekanFungsi = function (n) {
    this.fungsiTertunda.push(n);
    this._diamDi = 0;
    if (this.status === TUNGGU) this.mulai();
  };

  /* Jebakan dijemput di BATAS BARIS, bukan di tengah baris. Itu bukan
     penyederhanaan penelusur: GW-BASIC pun hanya memeriksa jebakan di antara
     pernyataan, dan itulah kenapa satu pernyataan yang lama (mis. gelung FOR
     panjang dalam satu baris) menunda tombol fungsi sampai selesai. */
  Penjalan.prototype._jebakanSiap = function () {
    if (this.jebakanBerjalan) return 0;    /* jebakan mati selama penangannya jalan */
    for (var i = 0; i < this.fungsiTertunda.length; i++) {
      var n = this.fungsiTertunda[i];
      if (this.m.jebakanNyala[n] && this.m.jebakanBaris[n]) {
        this.fungsiTertunda.splice(i, 1);
        return n;
      }
    }
    /* Tombol yang jebakannya sedang DITUNDA (`KEY(n) STOP`) tetap diingat;
       ia akan dijemput begitu `KEY(n) ON` berikutnya jalan. Sisanya dibuang
       supaya tidak menumpuk. */
    var sisa = [];
    for (i = 0; i < this.fungsiTertunda.length; i++) {
      if (this.m.jebakanTunda[this.fungsiTertunda[i]]) sisa.push(this.fungsiTertunda[i]);
    }
    this.fungsiTertunda = sisa;
    return 0;
  };

  /* --- satu langkah -------------------------------------------------------- */

  Penjalan.prototype.langkah = function () {
    if (!this.program) return false;
    if (this.status === SELESAI || this.status === GAGAL) return false;

    if (this.idx < 0 || this.idx >= this.tabel.length) {
      return this._selesai('Program habis: tidak ada baris sesudah yang terakhir.');
    }

    var entri = this.tabel[this.idx];

    /* Titik henti diperiksa SEBELUM barisnya dijalankan, supaya yang tersorot
       saat berhenti adalah baris yang belum terjadi — sama seperti debugger. */
    if (this.titikHenti[entri.baris] && !this._lewatiHenti) {
      this.status = DIAM;
      this.pesan = 'Berhenti di titik henti baris ' + entri.baris + '.';
      this._lewatiHenti = true;
      this._lapor();
      return false;
    }
    this._lewatiHenti = false;

    /* Jebakan tombol fungsi dijemput SEBELUM baris ini jalan, dan alamat
       pulangnya adalah baris ini sendiri — sesudah RETURN, baris yang
       tertunda itulah yang dijalankan. */
    var jebakan = this._jebakanSiap();
    if (jebakan) {
      this.tumpukan.push({ idx: this.idx, bagian: this.bagian, jebakan: jebakan });
      this.jebakanBerjalan = jebakan;
      var hasil = this._keBaris(this.m.jebakanBaris[jebakan], entri);
      if (hasil) this.pesan = 'F' + jebakan + ' menjemput jebakan ON KEY(' +
        jebakan + ') GOSUB ' + this.m.jebakanBaris[jebakan] + '.';
      this._lapor();
      return hasil;
    }

    /* --- baris berbagian ---------------------------------------------------

       Satu baris BASIC boleh memuat banyak pernyataan, dan sebagian di
       antaranya bisa MENINGGALKAN baris itu di tengah jalan:

           80 GOSUB 90:GOSUB 140:GOSUB 40:GOSUB 90:GOSUB 350:RUN"menu"

       Lima GOSUB dalam satu baris. RETURN yang pertama harus kembali ke
       pernyataan KEDUA di baris 80, bukan ke baris sesudahnya. Karena itu
       entri tabel boleh berbentuk `{ baris, bagian: [fn, fn, ...] }`, dan
       alamat pulang GOSUB membawa nomor bagian, bukan cuma nomor baris.

       Sorotan tidak terpengaruh: seluruh bagian milik satu nomor baris, dan
       nomor baris itulah yang disorot. Penyorotan tetap per baris. */
    this._kendali = null;
    var mulaiBagian = this.bagian;
    try {
      if (entri.bagian) {
        for (var b = mulaiBagian; b < entri.bagian.length; b++) {
          this.bagian = b;
          entri.bagian[b](this.m);
          if (this._kendali) break;
        }
      } else {
        this.bagian = 0;
        entri.jalan(this.m);
      }
    } catch (e) {
      return this._gagal('Baris ' + entri.baris + ' melempar galat: ' + e.message);
    }
    this.jumlahLangkah++;

    var kendali = this._kendali;
    if (!kendali) {                       /* jatuh ke baris berikutnya */
      this.idx++;
      this.bagian = 0;
      this._diamDi = 0;
      if (this.idx >= this.tabel.length) {
        return this._selesai('Program habis di baris ' + entri.baris + '.');
      }
      this._lapor();
      return true;
    }

    switch (kendali.jenis) {
      case 'lompat':
        return this._keBaris(kendali.ke, entri);

      case 'gosub':
        /* Pulang ke bagian SESUDAH GOSUB-nya; kalau barisnya tidak berbagian,
           pulang ke baris sesudahnya. */
        if (entri.bagian) this.tumpukan.push({ idx: this.idx, bagian: this.bagian + 1, jebakan: 0 });
        else              this.tumpukan.push({ idx: this.idx + 1, bagian: 0, jebakan: 0 });
        return this._keBaris(kendali.ke, entri);

      case 'kembali':
        if (!this.tumpukan.length) {
          return this._gagal('RETURN di baris ' + entri.baris + ' tanpa GOSUB.');
        }
        var pulang = this.tumpukan.pop();
        /* RETURN dari sebuah penangan menyalakan lagi jebakannya. Selama
           penangan berjalan, tombol yang sama tidak bisa menjemput dirinya
           sendiri — kalau bisa, satu tombol yang ditahan akan menumpuk
           panggilan sampai tumpukannya habis. */
        if (pulang.jebakan) this.jebakanBerjalan = 0;
        this._diamDi = 0;
        /* RETURN <baris>: alamat pulangnya dibuang, alurnya lanjut di tempat
           lain. Itu cara sebuah penangan MENINGGALKAN pekerjaan yang tadi
           disela, bukan kembali ke sana. */
        if (kendali.ke) return this._keBaris(kendali.ke, entri);
        this.idx = pulang.idx;
        this.bagian = pulang.bagian || 0;
        this._lapor();
        return true;

      /* INPUT: berhenti tanpa memajukan penunjuk. Baris yang sama akan
         dijalankan lagi begitu Enter ditekan — lihat catatan di `masukan`. */
      case 'masukan':
        this.status = MASUK;
        this._masukanIsi = '';
        this.pesan = 'INPUT: ketik jawabannya lalu tekan Enter.';
        this._lapor();
        return false;

      case 'gelung':
        this.idx = kendali.idx;
        this.bagian = kendali.bagian;
        this._diamDi = 0;
        this._lapor();
        return true;

      case 'run':
        return this._run(kendali.nama, entri, kendali.baris);

      case 'rantai':
        return this._rantai(kendali.nama, kendali.baris, entri);

      case 'henti':
        return this._selesai(kendali.pesan || 'Berhenti di baris ' + entri.baris + '.');

      case 'buntu':
        this.status = GAGAL;
        this.pesan = 'Baris ' + entri.baris + ': ' + kendali.alasan;
        this._lapor();
        return false;

      case 'galat':
        return this._galat(kendali.kode, kendali.pesan, entri);

      /* RESUME. Tiga bentuk, dan CHECK.BAS memakai dua di antaranya:
           RESUME          ulangi pernyataan yang tadi gagal
           RESUME <baris>  lanjut dari baris tertentu
         Yang penting bukan lompatannya, melainkan bahwa RESUME-lah yang
         MENUTUP penanganan galat. Sebelum RESUME, penangkap galat masih mati;
         galat kedua di dalam penangan tidak akan tertangkap lagi. */
      case 'lanjut':
        this._dalamPenangan = false;
        if (kendali.ke) return this._keBaris(kendali.ke, entri);
        if (!this._titikGalat) {
          return this._gagal('RESUME di baris ' + entri.baris +
            ' padahal tidak ada galat yang sedang ditangani.');
        }
        this.idx = this._titikGalat.idx;
        this.bagian = this._titikGalat.bagian;
        this._diamDi = 0;
        this._lapor();
        return true;
    }
    return this._gagal('Kendali tak dikenal di baris ' + entri.baris + '.');
  };

  /* Satu galat BASIC. Yang dicatat bukan cuma kodenya:

       ERR  kode galatnya
       ERL  nomor baris tempat galat terjadi — dipakai penangan CHECK.BAS
            untuk membedakan "gagal membuka berkas di 730" dari "gagal di 740"

     Titik galatnya (baris DAN bagian) disimpan supaya RESUME tanpa argumen
     bisa mengulangi pernyataan yang tepat, bukan seluruh barisnya. */
  Penjalan.prototype._galat = function (kode, pesan, entri) {
    this.m.err = kode;
    this.m.erl = entri.baris;
    this._titikGalat = { idx: this.idx, bagian: this.bagian };

    if (this.m.penangkapGalat && !this._dalamPenangan) {
      this._dalamPenangan = true;
      var hasil = this._keBaris(this.m.penangkapGalat, entri);
      if (hasil) {
        this.pesan = 'Galat ' + kode + (pesan ? ' (' + pesan + ')' : '') +
          ' di baris ' + entri.baris + ' ditangkap ON ERROR.';
        this._lapor();
      }
      return hasil;
    }
    /* Galat di dalam penangan galat tidak tertangkap lagi — kalau tertangkap,
       satu berkas yang hilang bisa memutar penangannya selamanya tanpa ada
       yang tahu. */
    return this._gagal('Galat BASIC ' + kode +
      (pesan ? ' (' + pesan + ')' : '') + ' di baris ' + entri.baris +
      (this._dalamPenangan ? ', terjadi DI DALAM penangan galat.'
                           : ', tanpa ON ERROR aktif.'));
  };

  Penjalan.prototype._keBaris = function (nomor, asal) {
    var i = this.cariIndeks(nomor);
    if (i < 0) {
      return this._gagal('Baris ' + asal.baris + ' menuju baris ' + nomor +
        ', tapi baris itu belum ada di tabel penelusur ini.');
    }
    this.bagian = 0;
    /* Lompatan ke diri sendiri = gelung jajak (INKEY$). Ditandai supaya gelung
       otomatis tidak membakar ribuan langkah untuk hal yang sama. */
    this._diamDi = (i === this.idx) ? this._diamDi + 1 : 0;
    this.idx = i;
    this._lapor();
    return true;
  };

  Penjalan.prototype._run = function (nama, asal, baris) {
    /* `RUN` tanpa nama berkas berarti "jalankan ulang program ini dari awal".
       Bedanya dengan sekadar melompat ke baris pertama: variabel dikosongkan.
       TOWERS.BAS memakainya untuk memulai permainan baru; OTHELLO.BAS memakai
       bentuk `RUN <baris>` yang mulai dari nomor baris tertentu — tetap
       dengan variabel yang dikosongkan. */
    if (!nama) {
      this.muat(this.program, { pertahankanLangkah: true });
      if (baris) {
        var i = this.cariIndeks(baris);
        if (i < 0) {
          return this._gagal('RUN ' + baris +
            ': baris itu belum ada di tabel penelusur ini.');
        }
        this.idx = i;
      }
      this.pesan = 'RUN tanpa nama — program ini dijalankan ulang dari awal, ' +
        'variabel dikosongkan.';
      this._lapor();
      return true;
    }
    var prog = this.cariProgram(nama);
    if (prog) {
      /* Inilah pelajarannya: RUN membuang seluruh variabel. Layar tidak
         dibersihkan — program barulah yang melakukan CLS-nya sendiri. */
      this.muat(prog, { pertahankanLayar: true, pertahankanLangkah: true });
      this.pesan = 'RUN "' + nama + '" — variabel dikosongkan, layar dibiarkan.';
      this.status = DIAM;
      this._lapor();
      return true;
    }
    /* Belum punya tabel baris — tapi mungkin punya PORT LENGKAP di web/games/.

       Di mesin aslinya `RUN "WILDCAT"` benar-benar memuat Wildcatter, dan
       menu yang tombolnya tidak membawa ke mana-mana bukan menu. Jadi kalau
       portnya ada, penelusur menyerahkan kendali ke sana — persis seperti
       RUN menyerahkan kendali ke program lain, dan sama seperti RUN, tidak
       ada jalan kembali kecuali lewat pintu yang disediakan program baru itu. */
    var port = this.cariPort(nama);
    if (port && port.url) {
      this.status = DIAM;
      this.pesan = 'RUN "' + nama + '" — membuka ' + port.judul +
        (port.catatan ? ' (' + port.catatan + ')' : '') + '.';
      this.tujuanPort = port;
      this._lapor();
      this.bukaPort(port);
      return false;
    }
    if (port) {
      return this._gagal('RUN "' + nama + '": ' + port.judul +
        ' belum punya tabel baris di penelusur ini, dan portnya pun belum ' +
        'selesai (' + (port.catatan || 'belum dijadwalkan') + ').');
    }
    if (this.adaSumber(nama)) {
      return this._gagal('RUN "' + nama + '": ' + nama +
        '.BAS ada di koleksi, tapi belum punya tabel baris di penelusur ini.');
    }
    /* Berkasnya memang tidak ada — inilah ERR=53 yang asli. */
    return this._galat(53, 'File not found: ' + nama, asal);
  };

  /* CHAIN berbeda dari RUN dalam satu hal yang penting di sini: berkas yang
     dituju boleh **tidak ada di koleksi ini sama sekali** — bukan program
     BASIC yang belum ditelusuri, melainkan berkas yang memang hilang. Kalau
     begitu, yang terjadi adalah ERR 53 yang sungguhan, dan program berhak
     menanganinya sendiri. */
  Penjalan.prototype._rantai = function (nama, baris, asal) {
    var prog = this.cariProgram(nama);
    if (prog) {
      this.muat(prog, { pertahankanLayar: true, pertahankanLangkah: true });
      if (baris) {
        var i = this.cariIndeks(baris);
        if (i < 0) {
          return this._gagal('CHAIN "' + nama + '", ' + baris +
            ': baris itu belum ada di tabel penelusur ini.');
        }
        this.idx = i;
      }
      this.pesan = 'CHAIN "' + nama + '"' + (baris ? ', lanjut di baris ' + baris : '');
      this.status = DIAM;
      this._lapor();
      return true;
    }
    if (this.adaSumber(nama)) {
      return this._gagal('CHAIN "' + nama + '": berkasnya ada di koleksi, ' +
        'tapi belum punya tabel baris di penelusur ini.');
    }
    return this._galat(53, 'File not found: ' + nama, asal);
  };

  Penjalan.prototype._selesai = function (pesan) {
    this.status = SELESAI;
    this.pesan = pesan;
    this._lapor();
    return false;
  };

  Penjalan.prototype._gagal = function (pesan) {
    this.status = GAGAL;
    this.pesan = pesan;
    this._lapor();
    return false;
  };

  Penjalan.prototype.cariIndeks = function (nomor) {
    for (var i = 0; i < this.tabel.length; i++) {
      if (this.tabel[i].baris === nomor) return i;
    }
    return -1;
  };

  Penjalan.prototype.barisSekarang = function () {
    var e = this.tabel[this.idx];
    return e ? e.baris : null;
  };

  /* --- gelung otomatis ----------------------------------------------------- */

  Penjalan.prototype._mintaBingkai = function () {
    if (this._bingkaiAktif) return;
    this._bingkaiAktif = true;
    var P = this;
    global.requestAnimationFrame(function (t) {
      P._bingkaiAktif = false;
      P._bingkai(t);
    });
  };

  /* Waktu diambil dari argumen rAF, bukan dari Date.now(). Itu membuat gelung
     ini bisa diuji dengan mengganti requestAnimationFrame dan memutar jamnya
     sendiri — cara satu-satunya menguji animasi di tab yang tersembunyi. */
  Penjalan.prototype._bingkai = function (t) {
    if (this.status !== JALAN) return;

    if (this._tSebelum === null) this._tSebelum = t;
    var dt = Math.max(0, t - this._tSebelum);
    this._tSebelum = t;

    this._sisa += dt * (this.laju / 1000);
    var anggaran = Math.min(Math.floor(this._sisa), this.laju > 200 ? 4000 : 400);
    this._sisa -= anggaran;

    for (var i = 0; i < anggaran; i++) {
      if (!this.langkah()) break;
      /* Berhenti membakar langkah kalau program cuma menjajakan INKEY$. */
      if (this._diamDi > 2) { this.status = TUNGGU; this._lapor(); break; }
    }

    if (this.status === JALAN) this._mintaBingkai();
  };

  Penjalan.prototype._lapor = function () {
    this.saatBerubah(this);
  };

  Penjalan.STATUS = { DIAM: DIAM, JALAN: JALAN, TUNGGU: TUNGGU,
                      SELESAI: SELESAI, GAGAL: GAGAL };

  global.TRACER = global.TRACER || {};
  global.TRACER.Penjalan = Penjalan;
})(window);
