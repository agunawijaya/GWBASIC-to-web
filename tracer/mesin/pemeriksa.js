/* ===========================================================================
   pemeriksa.js — membandingkan tabel baris dengan berkas .BAS aslinya.

   Sorotan baris di panel kanan adalah klaim: "baris inilah yang sedang
   dijalankan". Klaim itu hanya sekuat tabelnya. Kalau tabel cuma memuat 30
   dari 41 baris, penelusurannya tetap terlihat mulus — ia hanya melompati
   sebelas baris tanpa memberi tahu siapa pun.

   Maka angkanya dihitung dan dicetak di halaman. Empat hal yang dicari:

     hilang  nomor baris ada di .BAS tapi tidak di tabel  -> cakupan belum penuh
     asing   nomor baris ada di tabel tapi tidak di .BAS  -> tabelnya salah
     kembar  satu nomor baris muncul dua kali di tabel    -> GOTO jadi ambigu
     urutan  tabel tidak menaik seperti berkas aslinya    -> jatuh-ke-bawah salah

   Tiga yang terakhir bukan "cakupan yang belum penuh", melainkan cacat. Kalau
   salah satunya muncul, yang tersorot bisa bukan yang dijalankan — persis
   kegagalan yang seluruh rancangan ini dibuat untuk mencegah.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Ambil nomor baris di awal sebuah baris sumber BASIC. */
  function nomorBaris(teks) {
    var m = /^\s*(\d+)/.exec(teks);
    return m ? parseInt(m[1], 10) : null;
  }

  function periksa(sumber, tabel) {
    var asli = [], adaAsli = {}, i, n;

    for (i = 0; i < sumber.length; i++) {
      n = nomorBaris(sumber[i]);
      if (n === null) continue;         /* baris kosong / sambungan */
      asli.push(n);
      adaAsli[n] = true;
    }

    var adaTabel = {}, kembar = [], asing = [], urutanRusak = [];
    var sebelum = -1;

    for (i = 0; i < tabel.length; i++) {
      n = tabel[i].baris;
      if (adaTabel[n]) kembar.push(n); else adaTabel[n] = true;
      if (!adaAsli[n]) asing.push(n);
      if (n <= sebelum) urutanRusak.push(n);
      sebelum = n;
    }

    var hilang = [];
    for (i = 0; i < asli.length; i++) {
      if (!adaTabel[asli[i]]) hilang.push(asli[i]);
    }

    var cocok = asli.length - hilang.length;
    return {
      asli: asli,
      totalAsli: asli.length,
      totalTabel: tabel.length,
      cocok: cocok,
      persen: asli.length ? Math.round((cocok / asli.length) * 100) : 0,
      hilang: hilang,
      asing: asing,
      kembar: kembar,
      urutanRusak: urutanRusak,
      utuh: hilang.length === 0 && asing.length === 0 &&
            kembar.length === 0 && urutanRusak.length === 0
    };
  }

  /* Ringkas daftar nomor menjadi rentang: "70-140, 380".

     "Berdampingan" di sini berarti berdampingan DI DALAM BERKAS, bukan selisih
     sepuluh — nomor baris BASIC melompat sesuka penulisnya (70, 80, 140, 150).
     Itu sebabnya urutan aslinya ikut diberikan; tanpa itu, 70 dan 140 akan
     terlihat berjauhan padahal bertetangga.

     Tanpa peringkasan ini, MENU2.BAS yang 642 baris mencetak daftar nomor
     sepanjang layar dan tidak ada yang membacanya. */
  function ringkas(daftar, urutanAsli) {
    if (!daftar.length) return '';
    if (!urutanAsli) return daftar.join(', ');

    var posisi = {}, i;
    for (i = 0; i < urutanAsli.length; i++) posisi[urutanAsli[i]] = i;

    var keluar = [], mulai = daftar[0], akhir = daftar[0];
    for (i = 1; i <= daftar.length; i++) {
      var bersambung = i < daftar.length &&
                       posisi[daftar[i]] === posisi[akhir] + 1;
      if (bersambung) { akhir = daftar[i]; continue; }
      keluar.push(mulai === akhir ? String(mulai) : mulai + '-' + akhir);
      if (i < daftar.length) { mulai = daftar[i]; akhir = daftar[i]; }
    }
    return keluar.join(', ');
  }

  global.TRACER = global.TRACER || {};
  global.TRACER.pemeriksa = { periksa: periksa, ringkas: ringkas,
                              nomorBaris: nomorBaris };
})(window);
