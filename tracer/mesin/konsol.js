/* ===========================================================================
   konsol.js — layar teks CGA 80x25 dengan atribut per sel.

   Ini bukan "kotak teks yang kebetulan monospace". Ia meniru hal yang benar-
   benar ada di perangkat kerasnya: 2000 sel, tiap sel menyimpan satu karakter
   plus satu bita atribut (4 bit warna depan, 3 bit warna latar, 1 bit kedip).
   Itu sebabnya `COLOR 0,7:PRINT" A "` menghasilkan blok terbalik, bukan teks
   berwarna: yang berubah adalah atribut selnya, bukan gaya tulisannya.

   Yang ditiru:
     - kursor 1-berbasis (baris 1..25, kolom 1..80), seperti LOCATE
     - PRINT menulis di posisi kursor lalu memajukannya, membungkus di kolom 80
     - TAB(n) memindah ke kolom n; kalau sudah lewat, turun satu baris dulu
     - CLS mengisi ulang seluruh sel dengan spasi berwarna latar saat ini
     - gulung satu baris kalau kursor melewati baris 25

   Yang TIDAK ditiru (dan alasannya):
     - kedip (bit ke-8 atribut). Warna latar 8..15 dipetakan ke 0..7. Kedip di
       halaman web mengganggu dan tidak satu pun program dalam cakupan memakainya.
     - penundaan pembungkusan baris. GW-BASIC menahan pembungkusan sampai
       karakter berikutnya benar-benar ditulis; di sini kursor langsung pindah.
       Bedanya hanya terlihat kalau tulisan berhenti persis di kolom 80.
   =========================================================================== */

(function (global) {
  'use strict';

  var BARIS = 25, KOLOM = 80;

  /* Palet CGA standar. Nilai ini bukan selera: inilah 16 warna yang benar-benar
     dikeluarkan kartu CGA (nilai RGB 0/85/170/255 pada tiap kanal). */
  var PALET = [
    '#000000', '#0000aa', '#00aa00', '#00aaaa',
    '#aa0000', '#aa00aa', '#aa5500', '#aaaaaa',
    '#555555', '#5555ff', '#55ff55', '#55ffff',
    '#ff5555', '#ff55ff', '#ffff55', '#ffffff'
  ];

  /* --- CP437 -------------------------------------------------------------

     `CHR$(196)` di GW-BASIC bukan "karakter nomor 196 dalam Unicode" — ia
     glif nomor 196 di dalam ROM font kartu CGA, yaitu garis mendatar. Tanpa
     tabel ini, kotak yang digambar INTRO.BAS keluar sebagai huruf beraksen
     acak.

     Kode 32..126 sama persis dengan ASCII, jadi hanya tiga daerah yang perlu
     dipetakan: 0..31 (glif, bukan kendali — CGA tidak punya karakter kendali
     di layar), 127, dan 128..255.

     Ditulis sebagai daftar kode heksadesimal, bukan sebagai huruf-hurufnya
     langsung. Dua kali di repositori ini karakter tak terlihat ikut tersalin
     ke dalam berkas sumber dan baru ketahuan berjam-jam kemudian; daftar
     angka tidak bisa menyembunyikan apa pun. */
  var PETA_CP437 = (
    /* 0..15   */ '0020 263A 263B 2665 2666 2663 2660 2022 25D8 25CB 25D9 2642 2640 266A 266B 263C ' +
    /* 16..31  */ '25BA 25C4 2195 203C 00B6 00A7 25AC 21A8 2191 2193 2192 2190 221F 2194 25B2 25BC ' +
    /* 127     */ '2302 ' +
    /* 128..143*/ '00C7 00FC 00E9 00E2 00E4 00E0 00E5 00E7 00EA 00EB 00E8 00EF 00EE 00EC 00C4 00C5 ' +
    /* 144..159*/ '00C9 00E6 00C6 00F4 00F6 00F2 00FB 00F9 00FF 00D6 00DC 00A2 00A3 00A5 20A7 0192 ' +
    /* 160..175*/ '00E1 00ED 00F3 00FA 00F1 00D1 00AA 00BA 00BF 2310 00AC 00BD 00BC 00A1 00AB 00BB ' +
    /* 176..191*/ '2591 2592 2593 2502 2524 2561 2562 2556 2555 2563 2551 2557 255D 255C 255B 2510 ' +
    /* 192..207*/ '2514 2534 252C 251C 2500 253C 255E 255F 255A 2554 2569 2566 2560 2550 256C 2567 ' +
    /* 208..223*/ '2568 2564 2565 2559 2558 2552 2553 256B 256A 2518 250C 2588 2584 258C 2590 2580 ' +
    /* 224..239*/ '03B1 00DF 0393 03C0 03A3 03C3 00B5 03C4 03A6 0398 03A9 03B4 221E 03C6 03B5 2229 ' +
    /* 240..255*/ '2261 00B1 2265 2264 2320 2321 00F7 2248 00B0 2219 00B7 221A 207F 00B2 25A0 00A0'
  ).split(' ');

  /* Satu larik 256 entri, dibangun sekali saat berkas dimuat. */
  var CP437 = (function () {
    var tabel = new Array(256), i, j = 0;
    for (i = 0; i < 32; i++)  tabel[i] = String.fromCharCode(parseInt(PETA_CP437[j++], 16));
    for (i = 32; i < 127; i++) tabel[i] = String.fromCharCode(i);
    tabel[127] = String.fromCharCode(parseInt(PETA_CP437[j++], 16));
    for (i = 128; i < 256; i++) tabel[i] = String.fromCharCode(parseInt(PETA_CP437[j++], 16));
    return tabel;
  })();

  /* CHR$(n) dengan arti CGA-nya. Kode di luar 0..255 dilipat seperti BASIC. */
  function cp437(kode) { return CP437[((kode | 0) % 256 + 256) % 256]; }

  function Konsol(induk) {
    this.induk = induk;
    this.baris = BARIS;
    this.kolom = KOLOM;

    /* --- HALAMAN TEKS -------------------------------------------------
       Kartu CGA punya memori teks untuk BEBERAPA layar penuh sekaligus —
       delapan di 40 kolom, empat di 80. `SCREEN 0,warna,aktif,tampak`
       memilih dua di antaranya: yang DITULISI dan yang DITAMPILKAN, dan
       keduanya boleh berbeda.

       Itu bukan kemewahan. SOLITAIR.BAS menggambar seluruh layar
       petunjuknya ke halaman 1 sementara pemain melihat halaman 0, lalu
       F1 cukup menukar halaman yang ditampilkan. Petunjuknya muncul
       SEKETIKA dan permainannya tidak perlu digambar ulang saat ia
       ditutup — tak ada satu pun baris yang mengurus pemulihan layar.

       Di sini tiap halaman satu larik sel. `this.sel` selalu menunjuk
       halaman yang sedang ditulisi; DOM hanya menerima perubahan kalau
       halaman itu kebetulan juga yang sedang ditampilkan. */
    this.halaman = [];
    for (var h = 0; h < 8; h++) this.halaman.push(new Array(BARIS * KOLOM));
    this.halamanAktif = 0;
    this.halamanTampak = 0;
    this.sel = this.halaman[0];               /* {ch, fg, bg} */
    this.span = new Array(BARIS * KOLOM);     /* elemen DOM padanannya */

    this.b = 1;            /* baris kursor, 1-berbasis */
    this.k = 1;            /* kolom kursor, 1-berbasis */
    this.fg = 7;
    this.bg = 0;
    this.kursorTampak = true;
    this.saatSelBerubah = null;    /* dipasang mesin/grafik.js */

    this._bangunDom();
    this.cls();
  }

  Konsol.prototype._bangunDom = function () {
    var i, j, baris, s;
    this.induk.innerHTML = '';
    this.induk.classList.add('cga');
    for (i = 0; i < BARIS; i++) {
      baris = document.createElement('div');
      baris.className = 'cga__baris';
      for (j = 0; j < KOLOM; j++) {
        s = document.createElement('span');
        s.className = 'f7 g0';
        s.textContent = ' ';
        baris.appendChild(s);
        this.span[i * KOLOM + j] = s;
      }
      this.induk.appendChild(baris);
    }
  };

  Konsol.prototype._tulisSel = function (idx, ch, fg, bg) {
    var s = this.sel[idx];
    if (s && s.ch === ch && s.fg === fg && s.bg === bg) return;
    this.sel[idx] = { ch: ch, fg: fg, bg: bg };
    /* Menulis ke halaman yang tidak ditampilkan tidak mengubah apa pun yang
       terlihat — persis seperti di kartunya. */
    if (this.halamanAktif !== this.halamanTampak) return;
    /* Kait untuk permukaan grafik: begitu SCREEN 1 atau 2 aktif, teks harus
       muncul di kanvas, bukan di kisi DOM ini. Satu pemberitahuan per sel
       yang benar-benar berubah — jauh lebih murah daripada menggambar ulang
       seluruh layar tiap kali satu huruf dicetak. */
    if (this.saatSelBerubah) this.saatSelBerubah(idx, ch, fg, bg);
    var el = this.span[idx];
    /* Spasi ditulis apa adanya; lebarnya dijaga `white-space: pre` pada
       .cga__baris, bukan oleh entitas nbsp. */
    el.textContent = ch;
    el.className = 'f' + fg + ' g' + bg;
  };

  /* `SCREEN 0,warna,aktif,tampak`. Argumen yang dilewati ditulis null dan
     artinya "jangan diubah", sama seperti LOCATE. */
  Konsol.prototype.aturHalaman = function (aktif, tampak) {
    var i;
    if (aktif !== null && aktif !== undefined) {
      this.halamanAktif = aktif & 7;
      this.sel = this.halaman[this.halamanAktif];
      /* Halaman yang belum pernah dipakai masih kosong; isi dengan spasi
         supaya bacaannya sama dengan halaman yang sudah di-CLS. */
      for (i = 0; i < BARIS * KOLOM; i++) {
        if (!this.sel[i]) this.sel[i] = { ch: ' ', fg: this.fg, bg: this.bg };
      }
    }
    if (tampak !== null && tampak !== undefined) {
      var lama = this.halamanTampak;
      this.halamanTampak = tampak & 7;
      if (this.halamanTampak !== lama) this._gambarHalaman();
    }
  };

  /* Menyalin seluruh halaman yang ditampilkan ke DOM. Dipanggil hanya saat
     halaman yang TAMPAK berganti — bukan saat yang aktif berganti. */
  Konsol.prototype._gambarHalaman = function () {
    var buf = this.halaman[this.halamanTampak], i, s, el;
    for (i = 0; i < BARIS * KOLOM; i++) {
      s = buf[i] || { ch: ' ', fg: this.fg, bg: this.bg };
      buf[i] = s;
      el = this.span[i];
      el.textContent = s.ch;
      el.className = 'f' + s.fg + ' g' + s.bg;
      if (this.saatSelBerubah) this.saatSelBerubah(i, s.ch, s.fg, s.bg);
    }
  };

  /* --- perintah yang dipanggil tabel baris -------------------------------- */

  Konsol.prototype.cls = function () {
    for (var i = 0; i < BARIS * KOLOM; i++) this._tulisSel(i, ' ', this.fg, this.bg);
    this.b = 1;
    this.k = 1;
    this._perbaruiKursor();
  };

  /* COLOR depan, latar. Latar 8..15 dilipat ke 0..7 (lihat catatan kedip). */
  Konsol.prototype.warna = function (fg, bg) {
    if (fg !== null && fg !== undefined) this.fg = fg & 15;
    if (bg !== null && bg !== undefined) this.bg = bg & 7;
  };

  /* LOCATE baris, kolom, kursor. Argumen yang dilewati di BASIC (`LOCATE ,,0`)
     ditulis sebagai null di sini, dan artinya sama: jangan diubah. */
  Konsol.prototype.locate = function (b, k, kursor) {
    if (b !== null && b !== undefined) this.b = Math.max(1, Math.min(BARIS, b));
    if (k !== null && k !== undefined) this.k = Math.max(1, Math.min(KOLOM, k));
    if (kursor !== null && kursor !== undefined) this.kursorTampak = !!kursor;
    this._perbaruiKursor();
  };

  Konsol.prototype.kursor = function (tampak) {
    this.kursorTampak = !!tampak;
    this._perbaruiKursor();
  };

  /* PRINT tanpa penutup baris. Penutup barisnya ditulis terpisah sebagai
     barisBaru(), supaya tabel baris memperlihatkan titik koma aslinya. */
  Konsol.prototype.cetak = function (teks) {
    teks = String(teks);
    for (var i = 0; i < teks.length; i++) {
      var kode = teks.charCodeAt(i);
      if (kode === 10) { this.barisBaru(); continue; }
      if (kode === 13) { this.k = 1; this._perbaruiKursor(); continue; }

      /* Karakter kendali kursor. Empat kode ini TIDAK digambar; ia
         memindahkan kursor:

             28 kanan    29 kiri    30 atas    31 bawah

         Akibatnya satu PRINT bisa menggambar bentuk DUA DIMENSI: cetak
         beberapa karakter, mundur dengan CHR$(29), turun dengan CHR$(31),
         cetak lagi. HANGMAN.BAS memakainya untuk menganimasikan orangnya
         melambaikan tangan, dan CRAPS.BAS untuk menggambar dadu dari satu
         string tunggal.

         Ini nenek moyang langsung urutan escape terminal — `\033[2J` dan
         kawan-kawannya bekerja dengan prinsip yang sama, dan masih dipakai
         tiap kali sebuah program menggambar bilah kemajuan di terminal. */
      if (kode >= 28 && kode <= 31) {
        if (kode === 28 && this.k < KOLOM) this.k++;
        else if (kode === 29 && this.k > 1) this.k--;
        else if (kode === 30 && this.b > 1) this.b--;
        else if (kode === 31 && this.b < BARIS) this.b++;
        this._perbaruiKursor();
        continue;
      }
      /* Pemetaan CP437 terjadi DI SINI, di ambang layar — bukan lebih awal.
         Alasannya ditemukan oleh CHECK.BAS: `IF RS$=CHR$(27)` membandingkan
         BITA, sedangkan `PRINT CHR$(196)` menggambar GLIF. Kalau CHR$ langsung
         mengembalikan glifnya, perbandingan itu tidak akan pernah cocok.
         Jadi string di dalam program berisi bita, persis seperti di memori
         mesin aslinya, dan font-lah yang menerjemahkannya jadi gambar. */
      var ch = kode < 256 ? CP437[kode] : teks.charAt(i);
      this._tulisSel((this.b - 1) * KOLOM + (this.k - 1), ch, this.fg, this.bg);
      this.k++;
      if (this.k > KOLOM) { this.k = 1; this._turun(); }
    }
    this._perbaruiKursor();
  };

  Konsol.prototype.barisBaru = function () {
    this.k = 1;
    this._turun();
    this._perbaruiKursor();
  };

  /* TAB(n): pindah ke kolom n. Kalau kursor sudah melewati n, GW-BASIC turun
     satu baris dulu — itu sebabnya kolom TAB di MENU.BAS selalu menaik. */
  Konsol.prototype.tab = function (n) {
    n = Math.max(1, Math.min(KOLOM, n));
    if (n < this.k) { this.k = 1; this._turun(); }
    /* Kolom yang dilompati diisi spasi beratribut saat ini, seperti aslinya. */
    while (this.k < n) {
      this._tulisSel((this.b - 1) * KOLOM + (this.k - 1), ' ', this.fg, this.bg);
      this.k++;
    }
    this._perbaruiKursor();
  };

  /* POS(0) — kolom kursor sekarang. */
  Konsol.prototype.pos = function () { return this.k; };

  /* SPC(n) di dalam PRINT: cetak n spasi beratribut sekarang. Berbeda dari
     TAB(n) yang menuju kolom mutlak — SPC bergerak relatif. */
  Konsol.prototype.spc = function (n) {
    var teks = '', i;
    for (i = 0; i < n; i++) teks += ' ';
    this.cetak(teks);
  };

  Konsol.prototype._turun = function () {
    this.b++;
    if (this.b > BARIS) { this.b = BARIS; this._gulung(); }
  };

  Konsol.prototype._gulung = function () {
    var i, s;
    for (i = 0; i < (BARIS - 1) * KOLOM; i++) {
      s = this.sel[i + KOLOM];
      this._tulisSel(i, s.ch, s.fg, s.bg);
    }
    for (i = (BARIS - 1) * KOLOM; i < BARIS * KOLOM; i++) {
      this._tulisSel(i, ' ', this.fg, this.bg);
    }
  };

  Konsol.prototype._perbaruiKursor = function () {
    if (this._selKursor) this._selKursor.classList.remove('cga__kursor');
    var el = this.span[(this.b - 1) * KOLOM + (this.k - 1)];
    if (this.kursorTampak && el) el.classList.add('cga__kursor');
    this._selKursor = this.kursorTampak ? el : null;
  };

  /* --- BSAVE / BLOAD atas RAM layar ---------------------------------------
     DRAW.BAS menyimpan gambarnya dengan `BSAVE nama,480,3040` dan memuatnya
     kembali dengan `BLOAD nama,480` — yaitu menyalin RAM layar mentah-mentah
     ke disket. Karena satu sel teks memakan DUA bita (satu aksara, satu
     atribut warna), 480 bita berarti sel ke-240 dan 3040 bita berarti 1520
     sel: baris 4 sampai 22. Persis daerah gambarnya, dan itu bukan tebakan —
     baris 970-980 DRAW.BAS mengunci kursornya di baris 4..22 juga.

     Diambil sebagai salinan, bukan rujukan, supaya gambar yang tersimpan
     tidak ikut berubah waktu layarnya digambari lagi. */
  Konsol.prototype.simpanBlok = function (bitaAwal, jumlahBita) {
    var awal = Math.floor(bitaAwal / 2), n = Math.floor(jumlahBita / 2);
    var keluar = [], i, s;
    for (i = 0; i < n && awal + i < BARIS * KOLOM; i++) {
      s = this.sel[awal + i];
      keluar.push({ ch: s.ch, fg: s.fg, bg: s.bg });
    }
    return keluar;
  };

  Konsol.prototype.pulihkanBlok = function (data, bitaAwal) {
    var awal = Math.floor(bitaAwal / 2), i;
    if (!data) return;
    for (i = 0; i < data.length && awal + i < BARIS * KOLOM; i++) {
      this._tulisSel(awal + i, data[i].ch, data[i].fg, data[i].bg);
    }
  };

  /* POKE satu aksara langsung ke RAM layar.

     WILDCAT.BAS menggambar kisi petanya begini: garis mendatarnya dicetak
     dengan `PRINT STRING$(60,196)`, lalu SIMPANGANNYA (T, palang, siku)
     dipoke satu per satu ke alamat yang dihitung sendiri. Sel yang dipoke
     mempertahankan warnanya, karena yang ditulis cuma bita aksaranya; bita
     atributnya (alamat ganjil) tidak disentuh. Itu ditiru apa adanya. */
  Konsol.prototype.pokeAksara = function (bitaAlamat, kode) {
    var ganjil = bitaAlamat % 2;
    var idx = (bitaAlamat - ganjil) / 2;
    if (idx < 0 || idx >= BARIS * KOLOM) return;
    var s = this.sel[idx] || { ch: ' ', fg: this.fg, bg: this.bg };
    if (ganjil) {
      /* Alamat ganjil = bita ATRIBUT: empat bit bawah warna depan, tiga bit
         berikutnya warna latar. MAZE.BAS memakainya di baris 1160 dan 1190
         untuk mewarnai tanda panah tanpa menyentuh hurufnya. */
      this._tulisSel(idx, s.ch, kode & 15, (kode >> 4) & 7);
    } else {
      this._tulisSel(idx, cp437(kode & 255), s.fg, s.bg);
    }
  };

  /* --- SCREEN(baris, kolom) ------------------------------------------------
     Membaca kembali apa yang ada di layar. SUB.BAS memakainya untuk trik
     "simpan-di-bawah": sebelum menggambar bom di suatu tempat, ia membaca
     aksara dan warna yang ada di situ; sesudah bomnya lewat, kedua bita itu
     dipoke kembali. Latar belakangnya utuh tanpa perlu menggambar ulang.

     SCREEN(b,k)   -> kode aksaranya
     SCREEN(b,k,1) -> bita atributnya (warna depan + latar) */
  var BALIK437 = null;
  function kodeCp437(glif) {
    if (!BALIK437) {
      BALIK437 = {};
      for (var i = 255; i >= 0; i--) BALIK437[CP437[i]] = i;
    }
    var k = BALIK437[glif];
    return k === undefined ? 32 : k;
  }

  Konsol.prototype.bacaAksara = function (b, k) {
    var s = this.sel[(b - 1) * KOLOM + (k - 1)];
    return s ? kodeCp437(s.ch) : 32;
  };

  Konsol.prototype.bacaAtribut = function (b, k) {
    var s = this.sel[(b - 1) * KOLOM + (k - 1)];
    return s ? ((s.bg & 7) << 4) | (s.fg & 15) : 7;
  };

  /* Dipakai penguji: baca satu baris layar sebagai teks biasa. */
  Konsol.prototype.bacaBaris = function (b) {
    var keluar = '', i;
    for (i = 0; i < KOLOM; i++) keluar += this.sel[(b - 1) * KOLOM + i].ch;
    return keluar;
  };

  global.TRACER = global.TRACER || {};
  global.TRACER.Konsol = Konsol;
  global.TRACER.PALET_CGA = PALET;
  global.TRACER.cp437 = cp437;
})(window);
