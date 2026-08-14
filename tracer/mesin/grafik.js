/* ===========================================================================
   grafik.js — permukaan grafik CGA (SCREEN 1 dan SCREEN 2).

   Sama seperti konsol.js meniru 2000 sel teks, berkas ini meniru hal yang
   benar-benar ada di kartunya: sebuah bidang piksel dengan JUMLAH WARNA YANG
   SANGAT TERBATAS, dan itulah yang membentuk cara program-program ini
   digambar.

     SCREEN 1  320x200, EMPAT warna sekaligus — dan tiga di antaranya dipilih
               dari PALET, bukan bebas. `COLOR latar, palet` memilih warna 0
               (latar, bebas dari 16) dan gugus 1-2-3:
                 palet 0 : hijau, merah, coklat
                 palet 1 : cyan,  magenta, putih
               Itu sebabnya begitu banyak gambar di koleksi ini bercorak
               cyan-magenta: bukan selera, melainkan satu-satunya gugus yang
               punya warna terang.

     SCREEN 2  640x200, DUA warna. Argumen warna di semua perintah diabaikan
               kecuali nol (hapus) dan bukan-nol (nyala).

   Piksel SCREEN 1 lebarnya dua kali piksel SCREEN 2, dan keduanya tidak
   persegi di monitor aslinya. Di sini kanvasnya dibuat 640x400 lalu tiap
   piksel logis digambar sebagai kotak — 2x2 untuk SCREEN 1, 1x2 untuk
   SCREEN 2 — jadi perbandingan bentuknya sama dengan aslinya.

   YANG DITIRU:
     SCREEN, CLS, COLOR      PSET, PRESET, POINT
     LINE (termasuk B/BF dan gaya garis 16-bit)
     CIRCLE (termasuk busur, dan aspek yang membuatnya jadi elips)
     PAINT (isi banjir sampai warna batas)
     GET / PUT (lima aksi: PSET, PRESET, AND, OR, XOR)
     DRAW (penafsir makro lengkap: U D L R E F G H M A C S B N X)
     LOCATE/PRINT di atas grafik — 40 kolom di SCREEN 1, 80 di SCREEN 2

   YANG TIDAK DITIRU, dan alasannya:
     - VIEW dan WINDOW. Dipakai satu kali di seluruh koleksi (15PUZZLE dan
       LANDER), dan keduanya cuma untuk membatasi CLS. Ditangani sebagai
       kotak pemotong sederhana, tanpa penskalaan koordinat.
     - Halaman layar (argumen ke-3 dan ke-4 SCREEN). Tidak ada program grafik
       di koleksi ini yang memakainya.
     - Kedip. Sama seperti di konsol.
   =========================================================================== */

(function (global) {
  'use strict';

  var PALET = global.TRACER && global.TRACER.PALET_CGA;

  /* Dua gugus warna SCREEN 1. Indeks 0 diisi belakangan dari `COLOR latar`. */
  var PALET_1 = [
    [0, 2, 4, 6],     /* palet 0: hijau, merah, coklat  */
    [0, 3, 5, 7]      /* palet 1: cyan,  magenta, putih */
  ];

  var MODE = {
    1: { lebar: 320, tinggi: 200, warna: 4, kolom: 40, skalaX: 2, skalaY: 2 },
    2: { lebar: 640, tinggi: 200, warna: 2, kolom: 80, skalaX: 1, skalaY: 2 }
  };

  function Grafik(induk, konsol) {
    this.induk = induk;
    this.konsol = konsol;

    /* Konsol teks memberi tahu tiap sel yang berubah. Selama mode grafik
       aktif, sel itu langsung digambar ke kanvas — jadi LOCATE dan PRINT
       bekerja di atas gambar tanpa satu baris pun perubahan di tabel baris.
       Di SCREEN 1 layarnya 40 kolom, jadi kolom 41-80 diabaikan; itu memang
       yang terjadi di kartunya. */
    var G = this;
    konsol.saatSelBerubah = function (idx, ch, fg) {
      if (!G.aktif()) return;
      var b = Math.floor(idx / konsol.kolom) + 1;
      var k = (idx % konsol.kolom) + 1;
      if (k > G.kolom) return;
      G.cetakSel(b, k, ch, fg);
    };
    this.mode = 0;
    this.kanvas = null;
    this.ctx = null;

    this.piksel = null;      /* Uint8Array indeks warna, satu per piksel logis */
    this.lebar = 0;
    this.tinggi = 0;
    this.kolom = 40;

    this.latar = 0;          /* warna 0 di SCREEN 1 */
    this.palet = 1;          /* gugus 1-2-3 */
    this.warnaKini = 3;      /* warna gambar bawaan = warna tertinggi */

    /* Titik acuan terakhir. LINE, DRAW, dan bentuk STEP semuanya memakainya. */
    this.x = 0;
    this.y = 0;

    /* Keadaan DRAW yang bertahan antar pemanggilan. */
    this.drawSudut = 0;
    this.drawSkala = 4;      /* S4 = skala 1:1, sesuai GW-BASIC */

    this.potong = null;      /* VIEW: {x1,y1,x2,y2} atau null */
  }

  /* --- mode --------------------------------------------------------------- */

  /* SCREEN 0 mengembalikan layar teks; SCREEN 1/2 menyembunyikannya dan
     memasang kanvas di tempat yang sama. Berpindah mode SELALU membersihkan
     layar, sama seperti di GW-BASIC. */
  Grafik.prototype.layar = function (mode) {
    mode = mode | 0;
    if (mode !== 0 && mode !== 1 && mode !== 2) mode = 0;
    /* `SCREEN` hanya membersihkan layar kalau MODENYA berganti. Menyebut
       mode yang sama lagi tidak melakukan apa-apa — dan itu penting:
       SOLITAIR.BAS memanggil `SCREEN 0,1,...` berkali-kali semata-mata untuk
       menukar halaman teksnya, dan meja permainannya harus selamat. */
    if (mode === this.mode) return;
    this.mode = mode;

    if (mode === 0) {
      if (this.kanvas) this.kanvas.style.display = 'none';
      if (this.konsol && this.konsol.induk) {
        this.konsol.induk.style.display = '';
      }
      this.konsol.cls();
      return;
    }

    var m = MODE[mode];
    this.lebar = m.lebar;
    this.tinggi = m.tinggi;
    this.kolom = m.kolom;
    this.piksel = new Uint8Array(m.lebar * m.tinggi);

    if (!this.kanvas) this._bangunKanvas();
    this.kanvas.width = m.lebar * m.skalaX;
    this.kanvas.height = m.tinggi * m.skalaY;
    this.kanvas.style.display = '';
    if (this.konsol && this.konsol.induk) {
      this.konsol.induk.style.display = 'none';
    }
    this.potong = null;
    this.warnaKini = m.warna - 1;
    this._keTengah();
    this.drawSudut = 0; this.drawSkala = 4;
    this.cls();
  };

  Grafik.prototype._bangunKanvas = function () {
    var c = document.createElement('canvas');
    c.className = 'cga-grafik';
    this.kanvas = c;
    this.ctx = c.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.induk.appendChild(c);
  };

  Grafik.prototype.aktif = function () { return this.mode === 1 || this.mode === 2; };

  /* TITIK ACUAN TERAKHIR SESUDAH SCREEN DAN CLS ADALAH TENGAH LAYAR, bukan
     sudut kiri atas. Itu aturan GW-BASIC, dan ia bukan detail hiasan: FLYS.BAS
     baris 240-290 menggambar lalatnya tanpa satu pun koordinat mutlak, lalu
     memungutnya dengan `GET (151,91)-(172,103)` — angka-angka yang hanya masuk
     akal kalau penanya bermula di (160,100). Dengan titik awal (0,0), seluruh
     lalatnya tergambar di luar petak yang dipungut, dan sprite-nya kosong. */
  Grafik.prototype._keTengah = function () {
    this.x = Math.floor(this.lebar / 2);
    this.y = Math.floor(this.tinggi / 2);
  };

  /* --- warna -------------------------------------------------------------- */

  Grafik.prototype.warna = function (latar, palet) {
    var latarLama = this.latar, paletLama = this.palet;
    if (latar !== null && latar !== undefined) this.latar = latar & 15;
    if (palet !== null && palet !== undefined) this.palet = palet & 1;
    /* Kalau tidak ada yang berubah, tidak ada yang perlu digambar ulang.
       Penjagaan ini bukan penghias: ABM2A.BAS baris 10210 memakai
       `FOR I=1 TO 300:COLOR 0,0:NEXT I` sebagai gelung TUNDA — tiga ratus
       perintah COLOR ke warna yang sama persis. Tanpa penjagaan ini, tiap
       satu di antaranya menggambar ulang enam puluh empat ribu piksel. */
    if (this.latar === latarLama && this.palet === paletLama) return;
    /* Tidak perlu menggambar ulang teksnya secara terpisah: hurufnya sudah
       ada DI DALAM `piksel`, jadi `_gambarSemua()` sudah membawanya. Lihat
       catatan panjang di `cetakSel`. */
    this._gambarSemua();
  };

  /* Indeks warna logis (0..3) -> warna CGA sebenarnya (0..15). */
  Grafik.prototype._warnaAsli = function (i) {
    if (this.mode === 2) return i ? 15 : 0;
    if (i === 0) return this.latar;
    return PALET_1[this.palet][i & 3];
  };

  /* --- menggambar piksel --------------------------------------------------- */

  Grafik.prototype._boleh = function (x, y) {
    if (x < 0 || y < 0 || x >= this.lebar || y >= this.tinggi) return false;
    var p = this.potong;
    if (p && (x < p.x1 || x > p.x2 || y < p.y1 || y > p.y2)) return false;
    return true;
  };

  Grafik.prototype.pset = function (x, y, c) {
    x = Math.round(x); y = Math.round(y);
    /* PSET MEMINDAHKAN TITIK ACUAN, bahkan kalau piksennya sendiri terpotong.
       Sempat terlewat di sini, dan akibatnya besar: ABM2A.BAS baris 950
       menulis `PSET(0,180):DRAW "R32;X..."` — PSET-lah yang menaruh pena di
       tepi kiri sebelum seluruh garis langitnya digambar secara relatif.
       Tanpa perpindahan itu, enam kota tergambar dari tengah layar dan
       berakhir di luar batas kanan. */
    this.x = x; this.y = y;
    if (!this._boleh(x, y)) return;
    if (c === null || c === undefined) c = this.warnaKini;
    c &= (this.mode === 2 ? 1 : 3);
    var i = y * this.lebar + x;
    if (this.piksel[i] === c) return;
    this.piksel[i] = c;
    this._catSel(x, y, c);
  };

  Grafik.prototype.preset = function (x, y, c) {
    this.pset(x, y, (c === null || c === undefined) ? 0 : c);
  };

  Grafik.prototype.titik = function (x, y) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.lebar || y >= this.tinggi) return -1;
    return this.piksel[y * this.lebar + x];
  };

  Grafik.prototype._catSel = function (x, y, c) {
    var m = MODE[this.mode];
    this.ctx.fillStyle = PALET[this._warnaAsli(c)];
    this.ctx.fillRect(x * m.skalaX, y * m.skalaY, m.skalaX, m.skalaY);
  };

  /* Menggambar ULANG seluruh layar. Dikerjakan lewat satu `putImageData`,
     bukan enam puluh empat ribu `fillRect`: yang kedua memakan waktu belasan
     detik pada CLS yang terjadi di tengah gelung, dan CLS memang terjadi di
     tengah gelung — FLYS.BAS memanggilnya sekali per lalat. */
  Grafik.prototype._gambarSemua = function () {
    if (!this.aktif()) return;
    var m = MODE[this.mode];
    var lebarKanvas = this.lebar * m.skalaX;
    var tinggiKanvas = this.tinggi * m.skalaY;
    var gambar = this.ctx.createImageData(lebarKanvas, tinggiKanvas);
    var d = gambar.data;

    /* Palet CGA diterjemahkan sekali ke empat warna RGB, bukan sekali per
       piksel. */
    var rgb = [], i, w;
    for (i = 0; i < 4; i++) {
      w = PALET[this._warnaAsli(i)];
      rgb.push([parseInt(w.slice(1, 3), 16), parseInt(w.slice(3, 5), 16),
                parseInt(w.slice(5, 7), 16)]);
    }

    var x, y, sx, sy, c, warna, p;
    for (y = 0; y < this.tinggi; y++) {
      for (x = 0; x < this.lebar; x++) {
        c = rgb[this.piksel[y * this.lebar + x] & 3];
        for (sy = 0; sy < m.skalaY; sy++) {
          p = ((y * m.skalaY + sy) * lebarKanvas + x * m.skalaX) * 4;
          for (sx = 0; sx < m.skalaX; sx++) {
            d[p] = c[0]; d[p + 1] = c[1]; d[p + 2] = c[2]; d[p + 3] = 255;
            p += 4;
          }
        }
      }
    }
    this.ctx.putImageData(gambar, 0, 0);
  };

  Grafik.prototype.cls = function () {
    if (!this.aktif()) { this.konsol.cls(); return; }
    var p = this.potong;
    if (p) {
      for (var y = p.y1; y <= p.y2; y++) {
        for (var x = p.x1; x <= p.x2; x++) this.piksel[y * this.lebar + x] = 0;
      }
    } else {
      this.piksel.fill(0);
    }
    this._gambarSemua();
    this._keTengah();
    this.konsol.b = 1; this.konsol.k = 1;
    /* CLS grafik juga mengosongkan teksnya — di kartunya keduanya satu
       bidang memori yang sama. */
    for (var i = 0; i < this.konsol.sel.length; i++) {
      this.konsol.sel[i] = { ch: ' ', fg: this.konsol.fg, bg: this.konsol.bg };
    }
  };

  /* --- LINE ---------------------------------------------------------------
     `gaya` adalah topeng 16 bit dari `LINE ...,,,&HF0F0`: tiap piksel di
     sepanjang garis memakai bit berikutnya, dan bit nol berarti dilewati.
     Itu cara BASIC menggambar garis putus-putus tanpa perintah tersendiri. */
  Grafik.prototype.garis = function (x1, y1, x2, y2, c, bentuk, gaya) {
    x1 = Math.round(x1); y1 = Math.round(y1);
    x2 = Math.round(x2); y2 = Math.round(y2);
    if (c === null || c === undefined) c = this.warnaKini;
    bentuk = (bentuk || '').toUpperCase();

    if (bentuk === 'BF') {
      var a = Math.min(y1, y2), b = Math.max(y1, y2);
      var k1 = Math.min(x1, x2), k2 = Math.max(x1, x2);
      for (var y = a; y <= b; y++) {
        for (var x = k1; x <= k2; x++) this.pset(x, y, c);
      }
    } else if (bentuk === 'B') {
      this._ruas(x1, y1, x2, y1, c, gaya);
      this._ruas(x2, y1, x2, y2, c, gaya);
      this._ruas(x2, y2, x1, y2, c, gaya);
      this._ruas(x1, y2, x1, y1, c, gaya);
    } else {
      this._ruas(x1, y1, x2, y2, c, gaya);
    }
    this.x = x2; this.y = y2;
  };

  /* Bresenham. Ditulis utuh, bukan lewat kanvas, karena `POINT` dan `PAINT`
     harus bisa membaca kembali piksel yang persis sama. */
  Grafik.prototype._ruas = function (x1, y1, x2, y2, c, gaya) {
    if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
      throw new Error('LINE dengan koordinat bukan bilangan: (' + x1 + ',' +
                      y1 + ')-(' + x2 + ',' + y2 + ')');
    }
    var dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    var sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
    var err = dx - dy, e2, bit = 0;
    for (;;) {
      if (gaya === null || gaya === undefined ||
          (gaya >> (bit & 15)) & 1) this.pset(x1, y1, c);
      bit++;
      if (x1 === x2 && y1 === y2) break;
      e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x1 += sx; }
      if (e2 < dx) { err += dx; y1 += sy; }
    }
  };

  /* --- CIRCLE -------------------------------------------------------------
     `aspek` bukan hiasan: di SCREEN 1 piksel tidak persegi, jadi lingkaran
     yang benar-benar bulat di layar butuh aspek 5/6 — dan itulah nilai
     bawaan GW-BASIC. Aspek lain menghasilkan elips.
     `awal` dan `akhir` dalam radian, dan TANDANYA membawa arti yang tidak ada
     hubungannya dengan besarnya: sudut NEGATIF berarti "gambar juga jari-jari
     dari pusat ke ujung ITU". Tandanya diperiksa PER SUDUT, bukan sekali untuk
     keduanya — jadi `CIRCLE ...,-1,2` menghasilkan busur dengan SATU jari-jari,
     bukan potongan pai yang utuh.

     Bedanya kelihatan di PIECHART.BAS baris 1620, yang menulis `-A1-0.001`
     bukan `-A1`. Potongan pertama mulai di sudut nol, dan minus nol tetap nol
     — tidak negatif — jadi tanpa tambahan seperseribu itu potongan pertama
     kehilangan satu jari-jarinya sementara yang lain utuh. */
  Grafik.prototype.lingkaran = function (x, y, r, c, awal, akhir, aspek) {
    x = Math.round(x); y = Math.round(y); r = Math.round(r);
    /* Koordinat yang bukan bilangan menghentikan penelusuran, BUKAN membuat
       gelungnya berputar selamanya. Di BASIC variabel yang belum diisi
       bernilai nol dan tidak pernah NaN; kalau NaN sampai ke sini, yang salah
       tabel barisnya, dan itu harus terdengar. */
    if (!isFinite(x) || !isFinite(y) || !isFinite(r)) {
      throw new Error('CIRCLE dengan koordinat bukan bilangan: (' +
                      x + ',' + y + ') r=' + r);
    }
    if (c === null || c === undefined) c = this.warnaKini;
    if (aspek === null || aspek === undefined) {
      aspek = (this.mode === 1) ? 5 / 6 : 5 / 12;
    }
    var rx = r, ry = r;
    if (aspek > 1) rx = Math.round(r / aspek); else ry = Math.round(r * aspek);

    var ruasAwal = false, ruasAkhir = false, a1 = awal, a2 = akhir;
    if (a1 !== null && a1 !== undefined && a1 < 0) { ruasAwal = true; a1 = -a1; }
    if (a2 !== null && a2 !== undefined && a2 < 0) { ruasAkhir = true; a2 = -a2; }
    var penuh = (a1 === null || a1 === undefined) && (a2 === null || a2 === undefined);
    if (a1 === null || a1 === undefined) a1 = 0;
    if (a2 === null || a2 === undefined) a2 = 2 * Math.PI;

    /* Lingkaran penuh digambar dengan algoritma elips titik-tengah, bukan
       dengan menyapu sudut. Alasannya bukan kecepatan: sapuan sudut selalu
       meninggalkan LUBANG di tempat kelengkungannya paling tajam, dan
       PAINT yang datang sesudahnya akan bocor lewat lubang itu. Titik-tengah
       menjamin tiap piksel bertetangga dengan piksel berikutnya. */
    if (penuh) {
      this._elips(x, y, rx, ry, c);
      this.x = x; this.y = y;
      return;
    }

    /* Busur tetap disapu per sudut — ia memang tidak tertutup, jadi tidak ada
       yang bisa bocor. Langkahnya dibuat rapat supaya tidak putus-putus. */
    var n = Math.max(16, Math.ceil(8 * Math.max(rx, ry)));
    var i, t, px, py;
    var mulai = a1, henti = a2;
    if (henti < mulai) henti += 2 * Math.PI;
    for (i = 0; i <= n; i++) {
      t = mulai + (henti - mulai) * i / n;
      px = Math.round(x + rx * Math.cos(t));
      py = Math.round(y - ry * Math.sin(t));
      this.pset(px, py, c);
    }
    if (ruasAwal) {
      this._ruas(x, y, Math.round(x + rx * Math.cos(mulai)),
                 Math.round(y - ry * Math.sin(mulai)), c, null);
    }
    if (ruasAkhir) {
      this._ruas(x, y, Math.round(x + rx * Math.cos(henti)),
                 Math.round(y - ry * Math.sin(henti)), c, null);
    }
    this.x = x; this.y = y;
  };

  /* Elips titik-tengah, delapan arah simetris. Menghasilkan lengkung
     TERTUTUP: setiap piksel bersentuhan dengan piksel berikutnya, jadi
     PAINT di dalamnya tidak bisa lolos keluar. */
  Grafik.prototype._elips = function (cx, cy, rx, ry, c) {
    if (rx < 1) rx = 1;
    if (ry < 1) ry = 1;
    var x = 0, y = ry;
    var rx2 = rx * rx, ry2 = ry * ry;
    var px = 0, py = 2 * rx2 * y;
    var G = this;
    function empat(x, y) {
      G.pset(cx + x, cy + y, c); G.pset(cx - x, cy + y, c);
      G.pset(cx + x, cy - y, c); G.pset(cx - x, cy - y, c);
    }
    empat(x, y);
    var p = Math.round(ry2 - rx2 * ry + 0.25 * rx2);
    while (px < py) {
      x++; px += 2 * ry2;
      if (p < 0) { p += ry2 + px; }
      else { y--; py -= 2 * rx2; p += ry2 + px - py; }
      empat(x, y);
    }
    p = Math.round(ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) -
                   rx2 * ry2);
    while (y > 0) {
      y--; py -= 2 * rx2;
      if (p > 0) { p += rx2 - py; }
      else { x++; px += 2 * ry2; p += rx2 - py + px; }
      empat(x, y);
    }
  };

  /* --- PAINT ---------------------------------------------------------------
     Isi banjir empat arah sampai bertemu warna BATAS. Kalau batasnya tidak
     disebut, batasnya sama dengan warna isinya — itu perilaku GW-BASIC, dan
     itu sebabnya `PAINT (x,y),3` berhenti sendiri di garis yang sudah
     berwarna 3.
     Ditulis dengan tumpukan sendiri, bukan rekursi: bidang 320x200 bisa
     memakan enam puluh empat ribu bingkai panggilan. */
  Grafik.prototype.cat = function (x, y, c, batas) {
    x = Math.round(x); y = Math.round(y);
    if (c === null || c === undefined) c = this.warnaKini;
    c &= (this.mode === 2 ? 1 : 3);
    if (batas === null || batas === undefined) batas = c;
    batas &= (this.mode === 2 ? 1 : 3);
    if (!this._boleh(x, y)) return;

    var awal = this.piksel[y * this.lebar + x];
    if (awal === batas) return;

    var tumpuk = [x, y], px, py, i;
    while (tumpuk.length) {
      py = tumpuk.pop(); px = tumpuk.pop();
      if (!this._boleh(px, py)) continue;
      i = py * this.lebar + px;
      if (this.piksel[i] === batas || this.piksel[i] === c) continue;
      /* rentang mendatar dulu, lalu dorong tetangga atas-bawahnya */
      var kiri = px, kanan = px;
      while (kiri - 1 >= 0 && this._boleh(kiri - 1, py) &&
             this.piksel[py * this.lebar + kiri - 1] !== batas &&
             this.piksel[py * this.lebar + kiri - 1] !== c) kiri--;
      while (kanan + 1 < this.lebar && this._boleh(kanan + 1, py) &&
             this.piksel[py * this.lebar + kanan + 1] !== batas &&
             this.piksel[py * this.lebar + kanan + 1] !== c) kanan++;
      for (var q = kiri; q <= kanan; q++) {
        this.pset(q, py, c);
        if (py > 0) tumpuk.push(q, py - 1);
        if (py + 1 < this.tinggi) tumpuk.push(q, py + 1);
      }
    }
    /* Titik acuan sesudah PAINT adalah titik AWALNYA, bukan piksel terakhir
       yang kebetulan terisi. */
    this.x = x; this.y = y;
  };

  /* --- GET / PUT -----------------------------------------------------------
     Di BASIC, `GET` menulis ke sebuah LARIK BIASA: dua bita lebar dalam bit,
     dua bita tinggi, lalu bit-bit gambarnya. Program bisa menyimpannya,
     menyalinnya, bahkan menulisnya ke berkas.
     Di sini bentuknya disederhanakan jadi objek {lebar, tinggi, data} yang
     disimpan di unsur larik yang sama — yang penting perilakunya sama:
     satu larik menampung satu gambar, dan `PUT` bisa memakainya berkali-kali. */
  Grafik.prototype.ambil = function (x1, y1, x2, y2) {
    x1 = Math.round(x1); y1 = Math.round(y1);
    x2 = Math.round(x2); y2 = Math.round(y2);
    var a = Math.min(x1, x2), b = Math.min(y1, y2);
    var l = Math.abs(x2 - x1) + 1, t = Math.abs(y2 - y1) + 1;
    var d = new Uint8Array(l * t), x, y;
    for (y = 0; y < t; y++) {
      for (x = 0; x < l; x++) {
        d[y * l + x] = (a + x < this.lebar && b + y < this.tinggi &&
                        a + x >= 0 && b + y >= 0)
          ? this.piksel[(b + y) * this.lebar + a + x] : 0;
      }
    }
    return { lebar: l, tinggi: t, data: d };
  };

  /* Lima aksi PUT. XOR adalah bawaannya, dan itu yang membuat sprite bisa
     dihapus dengan menggambarnya dua kali di tempat yang sama — teknik yang
     dipakai hampir semua program grafik di koleksi ini. */
  /* --- gambar yang datang sebagai LARIK BILANGAN BULAT ---------------------

     `GET` di BASIC menulis ke larik biasa, dan program boleh mengisinya
     sendiri. XWING.BAS melakukannya untuk tiga belas gambar: ratusan
     penugasan `IM4(0)=22:IM4(1)=7:IM4(2)=128:...` yang diketik langsung ke
     dalam programnya.

     Bentuknya sama persis dengan yang ditulis GET di SCREEN 1:

         unsur 0   lebar dalam BIT  (dua bit per piksel, jadi 22 = 11 piksel)
         unsur 1   tinggi dalam baris
         sisanya   piksel, dipadatkan; tiap bilangan bulat dua bita,
                   bita rendah lebih dulu, dan di dalam tiap bita empat
                   piksel dari bit tertinggi ke terendah

     Bilangan di atas 32767 muncul sebagai NEGATIF, karena bulat di BASIC
     bertanda. Itu bukan kesalahan pengetikan; itu yang keluar dari GET. */
  Grafik.prototype.dariLarik = function (arr) {
    if (!arr || arr.length < 2) return null;
    var lebarBit = arr[0] | 0, tinggi = arr[1] | 0;
    var lebar = Math.floor(lebarBit / (this.mode === 2 ? 1 : 2));
    var bpr = Math.ceil(lebarBit / 8);
    var bita = [], i, w;
    for (i = 2; i < arr.length; i++) {
      w = arr[i] | 0; if (w < 0) w += 65536;
      bita.push(w & 255, (w >> 8) & 255);
    }
    var data = new Array(lebar * tinggi), x, y, b;
    for (y = 0; y < tinggi; y++) {
      for (x = 0; x < lebar; x++) {
        b = bita[y * bpr + (x >> 2)];
        data[y * lebar + x] = b === undefined ? 0 : (b >> (6 - 2 * (x & 3))) & 3;
      }
    }
    return { lebar: lebar, tinggi: tinggi, data: data };
  };

  Grafik.prototype.taruh = function (x, y, gbr, aksi) {
    /* Larik bilangan bulat diterima apa adanya — lihat `dariLarik`. */
    if (gbr && !gbr.data && gbr.length >= 2) gbr = this.dariLarik(gbr);
    if (!gbr || !gbr.data) return;
    x = Math.round(x); y = Math.round(y);
    aksi = (aksi || 'XOR').toUpperCase();
    var maks = this.mode === 2 ? 1 : 3;
    var i, j, s, t, lama;
    for (j = 0; j < gbr.tinggi; j++) {
      for (i = 0; i < gbr.lebar; i++) {
        if (!this._boleh(x + i, y + j)) continue;
        s = gbr.data[j * gbr.lebar + i];
        lama = this.piksel[(y + j) * this.lebar + x + i];
        switch (aksi) {
          case 'PSET':   t = s; break;
          case 'PRESET': t = (~s) & maks; break;
          case 'AND':    t = lama & s; break;
          case 'OR':     t = lama | s; break;
          default:       t = lama ^ s; break;   /* XOR */
        }
        this.pset(x + i, y + j, t & maks);
      }
    }
  };

  /* --- VIEW ---------------------------------------------------------------- */
  Grafik.prototype.pandang = function (x1, y1, x2, y2) {
    if (x1 === null || x1 === undefined) { this.potong = null; return; }
    this.potong = {
      x1: Math.min(x1, x2), y1: Math.min(y1, y2),
      x2: Math.max(x1, x2), y2: Math.max(y1, y2)
    };
  };

  /* --- DRAW ---------------------------------------------------------------
     Bahasa makro delapan arah. Yang membuatnya layak ditiru utuh: ia punya
     KEADAAN YANG BERTAHAN — sudut (A), skala (S), dan warna (C) tetap
     berlaku sampai perintah DRAW berikutnya. Program bisa memutar seluruh
     gambar dengan satu huruf.

       U D L R      atas, bawah, kiri, kanan
       E F G H      empat diagonal
       M x,y        pindah; awalan + atau - berarti relatif
       B            awalan: pindah saja, jangan menggambar
       N            awalan: gambar, lalu kembali ke titik semula
       A n          putar n*90 derajat
       C n          ganti warna
       S n          skala; n/4 adalah pengalinya
       X var;       JALANKAN STRING LAIN sebagai subrutin gambar
  */
  Grafik.prototype.gambarMakro = function (s, vars, dalam) {
    if (!this.aktif() || !s) return;
    s = String(s).toUpperCase();
    var i = 0, n = s.length;
    vars = vars || {};
    dalam = dalam || 0;
    var G = this;

    /* `=NAMA;` — DRAW membaca VARIABEL BASIC dari dalam stringnya sendiri.
       Bukan penyulihan saat string dirangkai: string yang sama bisa dipakai
       berkali-kali dan tiap kali membaca nilai yang berlaku saat itu. FLYS.BAS
       memakainya untuk mewarnai (`c=clr;`), memindahkan pena (`bm0,=y;`), dan
       melangkah (`m+=dx;,=dy;`) — tiga hal berbeda, satu mekanisme. */
    function nilaiVar(nama) {
      nama = nama.replace(/\s+/g, '');
      var v = vars[nama];
      if (v === undefined) v = vars[nama + '%'];
      if (v === undefined) v = vars[nama + '!'];
      return Math.round(Number(v) || 0);
    }

    /* GW-BASIC mengabaikan spasi DI MANA PUN di dalam string DRAW —
       `BM 100,150` dan `BM100,150` sama saja. Melewati spasi di sini, bukan
       di pemanggilnya, membuat itu berlaku untuk semua perintah sekaligus. */
    function lewatiSpasi() { while (i < n && s[i] === ' ') i++; }

    function angka() {
      var t = '';
      lewatiSpasi();
      if (s[i] === '+' || s[i] === '-') { t += s[i]; i++; lewatiSpasi(); }
      if (s[i] === '=') {
        i++;
        var nama = '';
        while (i < n && s[i] !== ';' && s[i] !== ',') { nama += s[i]; i++; }
        if (s[i] === ';') i++;
        var nv = nilaiVar(nama);
        return t === '-' ? -nv : nv;
      }
      while (i < n && s[i] >= '0' && s[i] <= '9') { t += s[i]; i++; }
      lewatiSpasi();
      if (s[i] === ';') i++;
      return t === '' || t === '+' || t === '-' ? null : parseInt(t, 10);
    }

    var ARAH = {
      'U': [0, -1], 'D': [0, 1], 'L': [-1, 0], 'R': [1, 0],
      'E': [1, -1], 'F': [1, 1], 'G': [-1, 1], 'H': [-1, -1]
    };

    while (i < n) {
      var c = s[i];
      if (c === ' ' || c === ';') { i++; continue; }

      var buta = false, balik = false;
      while (c === 'B' || c === 'N') {
        if (c === 'B') buta = true; else balik = true;
        i++; lewatiSpasi(); c = s[i];
      }
      if (i >= n) break;
      i++;

      if (c === 'A') { this.drawSudut = (angka() || 0) & 3; continue; }
      if (c === 'C') { this.warnaKini = (angka() || 0) & (this.mode === 2 ? 1 : 3); continue; }
      if (c === 'S') { this.drawSkala = angka() || 4; continue; }
      /* `X` — SUBRUTIN GAMBAR. Di GW-BASIC bentuknya `"X"+VARPTR$(CT2$)`:
         yang disisipkan bukan isi stringnya melainkan ALAMATNYA, dan DRAW
         pergi ke sana lalu menjalankan isinya sebagai perintah gambar.
         Itu satu-satunya cara memanggil "prosedur" di dalam bahasa DRAW, dan
         ABM2A.BAS baris 950-960 memakainya untuk menggambar enam kota dari
         tiga bentuk kota.
         VARPTR$ tidak punya padanan di penelusur, jadi tabel barisnya menulis
         NAMA variabelnya langsung: `XCT2$;`. Yang berubah cuma cara stringnya
         menyebut tujuannya; yang dikerjakan sama persis. */
      if (c === 'X') {
        var namaX = '';
        while (i < n && s[i] !== ';') { namaX += s[i]; i++; }
        if (s[i] === ';') i++;
        namaX = namaX.replace(/\s+/g, '');
        var isiX = vars[namaX];
        if (typeof isiX === 'string' && dalam < 8) {
          this.gambarMakro(isiX, vars, dalam + 1);
        }
        continue;
      }

      var x0 = this.x, y0 = this.y, tx, ty;

      if (c === 'M') {
        lewatiSpasi();
        var relatif = (s[i] === '+' || s[i] === '-');
        var a = angka();
        lewatiSpasi();
        if (s[i] === ',') i++;
        var b = angka();
        if (a === null || b === null) continue;
        tx = relatif ? this.x + a : a;
        ty = relatif ? this.y + b : b;
      } else if (ARAH[c]) {
        var jarak = angka();
        if (jarak === null) jarak = 1;
        var d = ARAH[c];
        var dx = d[0], dy = d[1];
        /* A memutar arahnya 90 derajat sekali per satuan. */
        for (var r = 0; r < this.drawSudut; r++) {
          var t = dx; dx = dy; dy = -t;
        }
        jarak = jarak * this.drawSkala / 4;
        tx = this.x + Math.round(dx * jarak);
        ty = this.y + Math.round(dy * jarak);
      } else {
        continue;                      /* huruf yang tidak dikenal dilewati */
      }

      if (!buta) this._ruas(x0, y0, tx, ty, this.warnaKini, null);
      this.x = tx; this.y = ty;
      if (balik) { this.x = x0; this.y = y0; }
    }
  };

  /* --- teks di atas grafik -------------------------------------------------

     DI KARTUNYA, TEKS DAN GAMBAR ADALAH SATU BIDANG MEMORI YANG SAMA.

     Itu bukan detail sepele, dan sempat salah di sini: mula-mula glif dilukis
     langsung ke kanvas dan tidak pernah masuk ke `piksel`. Hasilnya tulisan
     yang terlihat tapi tidak ada — `POINT` tidak menemukannya, dan `PAINT`
     mengalir menembusnya seolah ia tidak pernah dicetak.

     15PUZZLE.BAS memaksa yang sebenarnya. Baris 1180-1190 mencetak angka
     ubin, lalu mengecat petaknya dengan BATAS warna yang sama dengan angka
     itu:

         1180 PRINT USING "##";N0        angkanya, warna 3
         1190 PAINT (...),C0,3           cat berhenti di warna 3

     Catnya mengalir mengelilingi angka dan angkanya selamat. Itu hanya bisa
     terjadi kalau coretan angka benar-benar ada di dalam bidang piksel.

     Maka glifnya DIRASTER: dilukis sekali ke kanvas 8x8 tersembunyi, dibaca
     kembali, dan dipasang piksel demi piksel lewat `pset` yang sama dengan
     yang dipakai LINE dan CIRCLE. Sesudah itu tidak ada lagi "lapisan teks";
     yang ada cuma piksel.

     Ikut benar dengan sendirinya: sel yang dicetak MENIMPA seluruh 8x8-nya
     dengan warna 0 di bit yang kosong — persis seperti aslinya, dan itulah
     yang membuat trik hapus `PRINT "  ";CHR$(29);CHR$(29);` bekerja. */

  Grafik.prototype._rasterGlif = function (ch) {
    if (!this._glif) {
      this._glif = {};
      var kv = document.createElement('canvas');
      kv.width = 8; kv.height = 8;
      this._glifCtx = kv.getContext('2d', { willReadFrequently: true });
    }
    if (this._glif[ch]) return this._glif[ch];

    var g = this._glifCtx;
    g.clearRect(0, 0, 8, 8);
    g.fillStyle = '#fff';
    g.textBaseline = 'top';
    g.font = '8px ui-monospace, "Cascadia Mono", Consolas, monospace';
    /* Font vektor apa pun lebih sempit dari sel 8 piksel, jadi glifnya
       direntang mendatar sampai persis mengisi selnya. */
    var lebarGlif = g.measureText(ch).width || 8;
    g.save();
    g.scale(8 / lebarGlif, 1);
    g.fillText(ch, 0, 0);
    g.restore();

    var d = g.getImageData(0, 0, 8, 8).data, topeng = [], i;
    /* Ambangnya di seperempat: font 8 piksel selalu berkabut di tepinya, dan
       ambang yang terlalu tinggi memutus coretan tipis jadi titik-titik —
       yang berarti PAINT bocor lewat huruf. */
    for (i = 0; i < 64; i++) topeng.push(d[i * 4 + 3] > 64 ? 1 : 0);
    this._glif[ch] = topeng;
    return topeng;
  };

  Grafik.prototype.cetakSel = function (b, k, ch, fg) {
    if (!this.aktif()) return;
    var x0 = (k - 1) * 8, y0 = (b - 1) * 8;
    var warna = (fg === undefined || fg === null) ? this.warnaKini : fg;
    warna &= (this.mode === 2 ? 1 : 3);

    var topeng = (ch === ' ') ? null : this._rasterGlif(ch);
    var x, y, c;
    for (y = 0; y < 8; y++) {
      for (x = 0; x < 8; x++) {
        c = (topeng && topeng[y * 8 + x]) ? warna : 0;
        /* Sengaja lewat jalur yang sama dengan pset, TAPI tanpa uji VIEW:
           di GW-BASIC, `VIEW` mengurung gambar dan tidak mengurung teks. */
        this._setBebas(x0 + x, y0 + y, c);
      }
    }
  };

  Grafik.prototype._setBebas = function (x, y, c) {
    if (x < 0 || y < 0 || x >= this.lebar || y >= this.tinggi) return;
    var i = y * this.lebar + x;
    if (this.piksel[i] === c) return;
    this.piksel[i] = c;
    this._catSel(x, y, c);
  };

  global.TRACER = global.TRACER || {};
  global.TRACER.Grafik = Grafik;
})(window);
