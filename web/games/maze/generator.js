/* ===========================================================================
   generator.js — pelajaran: bagaimana menjamin labirin PASTI bisa diselesaikan.

   Berkas ini BUKAN bagian dari permainannya. MAZE.BAS menyimpan lima labirin
   tetap di dalam DATA, dan port ini memainkan kelimanya apa adanya. Yang ada
   di sini adalah jawaban atas pertanyaan yang program 1982 itu tidak pernah
   ajukan pada dirinya sendiri:

       "Kalau labirinnya dibangkitkan, bagaimana kita tahu ada jalan dari
        titik mulai ke pintu keluar?"

   Penulis MAZE.BAS menjawabnya dengan cara yang paling tua: ia menggambar
   lima labirin dengan tangan, dan memeriksanya sendiri. Itu jawaban yang sah
   — dan tidak bisa diskalakan ke labirin keenam.

   ------------------------------------------------------------------------
   TIGA JAWABAN, DAN HANYA SATU YANG BENAR-BENAR MENJAWAB

   1. ACAK LALU PERIKSA. Robohkan dinding secara acak, lalu telusuri; kalau
      tidak nyambung, ulangi. Benar hasilnya, tapi ongkosnya tidak terbatas
      dan sangat bergantung pada berapa banyak dinding yang dirobohkan.

   2. BANGUN SEBAGAI POHON RENTANG. Gali labirin dengan penelusuran mendalam
      acak: mulai dari satu sel, dan setiap kali menggali, gali HANYA ke sel
      yang BELUM PERNAH dikunjungi.

      Itu satu aturan, dan ia cukup. Karena tiap sel baru dihubungkan tepat
      sekali ke sel yang sudah terhubung, hasilnya selalu POHON RENTANG:
      seluruh sel terhubung, dan tidak ada gelang. Dan di graf terhubung,
      SETIAP pasang sel punya jalan — termasuk pasangan mulai/keluar, apa pun
      keduanya.

      Tidak ada yang perlu diperiksa sesudahnya. Labirin yang tidak bisa
      diselesaikan bukan sekadar tidak muncul; ia MUSTAHIL dibangun.

   3. TETAP TULIS PEMERIKSANYA. Bukan untuk menjaga pembangkitnya — melainkan
      untuk menjaga penyuntingnya. Lihat catatan di `banjir()`.

   ------------------------------------------------------------------------
   Bitmask dindingnya sama dengan MAZE.BAS baris 400, supaya labirin yang
   dibangkitkan di sini bisa dibaca oleh penggambar yang sama:

       8 = utara   4 = timur   2 = selatan   1 = barat
   =========================================================================== */
window.RETRO = window.RETRO || {};

(function (global) {
  'use strict';

  const U = 8, T = 4, S = 2, B = 1;
  /* Tiap arah: pergeseran baris/kolom, bit dinding di sel ini, dan bit
     dinding PASANGANNYA di sel seberang. Dinding selalu dibuka berpasangan —
     itu invarian pertama, dan yang paling mudah dilanggar diam-diam. */
  const ARAH = [
    { dr: -1, dc: 0, bit: U, lawan: S },
    { dr: 0, dc: 1, bit: T, lawan: B },
    { dr: 1, dc: 0, bit: S, lawan: U },
    { dr: 0, dc: -1, bit: B, lawan: T }
  ];

  const buatKisi = (n) => {
    const g = [];
    for (let r = 0; r < n; r++) { g.push(new Array(n).fill(U | T | S | B)); }
    return g;
  };

  /* --------------------------------------------------------------------
     1. POHON RENTANG lewat penelusuran mendalam acak.

     Satu aturan yang menjamin segalanya, dan ia ada di baris `if (sudah[...])
     continue;` di bawah: JANGAN PERNAH menggali ke sel yang sudah dikunjungi.

     Akibatnya berantai:
       - tiap sel baru masuk lewat tepat SATU dinding yang dibuka
       - jadi jumlah dinding yang dibuka = jumlah sel - 1
       - graf terhubung dengan n simpul dan n-1 sisi adalah POHON
       - di pohon, tiap pasang simpul punya tepat satu jalan

     "Tepat satu" itu bonus: labirin pohon tidak punya gelang, jadi tidak ada
     jalan memutar yang membingungkan — dan tidak ada ruang tertutup.
     -------------------------------------------------------------------- */
  function galiPohon(n, r) {
    const g = buatKisi(n);
    const sudah = buatKisi(n).map(baris => baris.map(() => false));
    const tumpuk = [[r.int(n), r.int(n)]];
    sudah[tumpuk[0][0]][tumpuk[0][1]] = true;
    let dibuka = 0;

    while (tumpuk.length) {
      const [cr, cc] = tumpuk[tumpuk.length - 1];
      const calon = [];
      ARAH.forEach((a, i) => {
        const nr = cr + a.dr, nc = cc + a.dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) return;
        if (sudah[nr][nc]) return;                 // <- ATURANNYA, satu baris
        calon.push(i);
      });
      if (!calon.length) { tumpuk.pop(); continue; }
      const i = calon[r.int(calon.length)];
      const a = ARAH[i];
      const nr = cr + a.dr, nc = cc + a.dc;
      g[cr][cc] &= ~a.bit;                         // buka dua-duanya, selalu
      g[nr][nc] &= ~a.lawan;
      dibuka++;
      sudah[nr][nc] = true;
      tumpuk.push([nr, nc]);
    }
    return { g, dibuka, sel: n * n };
  }

  /* --------------------------------------------------------------------
     2. ACAK LALU PERIKSA — pembanding, bukan cara yang dipakai.

     Robohkan sebagian dinding secara acak (peluang `p`), lalu telusuri.
     Dipakai panel di halaman untuk MENGUKUR berapa sering cara ini gagal,
     alih-alih menebaknya.
     -------------------------------------------------------------------- */
  function galiAcak(n, r, p) {
    const g = buatKisi(n);
    for (let cr = 0; cr < n; cr++) {
      for (let cc = 0; cc < n; cc++) {
        [1, 2].forEach(i => {                      // cukup timur & selatan
          const a = ARAH[i];
          const nr = cr + a.dr, nc = cc + a.dc;
          if (nr >= n || nc >= n) return;
          if (r.next() >= p) return;
          g[cr][cc] &= ~a.bit;
          g[nr][nc] &= ~a.lawan;
        });
      }
    }
    return g;
  }

  /* --------------------------------------------------------------------
     3. PEMERIKSA: banjir dari titik mulai.

     Kalau pembangkitnya benar secara konstruksi, kenapa masih menulis ini?

     Bukan untuk menjaga PEMBANGKITNYA — melainkan untuk menjaga
     PENYUNTINGNYA. Invarian "jangan gali ke sel yang sudah dikunjungi" hidup
     di satu baris `continue`, dan baris seperti itu adalah yang paling mudah
     dihapus orang berikutnya yang merasa labirinnya "terlalu sedikit
     cabangnya". Pemeriksa yang berjalan tiap kali membangkitkan mengubah
     kesalahan diam menjadi kesalahan yang bersuara.

     Ini kebalikan langsung dari pola yang berulang di koleksi ini — pagar tak
     sengaja di PEGLEAP, angka 600 di MAXIT1, straight besar di YAHTZEE.
     Ketiganya BENAR KARENA KEBETULAN. Yang ini benar karena dijaga, dua kali.
     -------------------------------------------------------------------- */
  function banjir(g, dari) {
    const n = g.length;
    const jarak = g.map(baris => baris.map(() => -1));
    jarak[dari[0]][dari[1]] = 0;
    const antre = [dari];
    let kepala = 0, terjauh = 0;
    while (kepala < antre.length) {
      const [cr, cc] = antre[kepala++];
      ARAH.forEach(a => {
        if (g[cr][cc] & a.bit) return;             // ada dinding, tidak lewat
        const nr = cr + a.dr, nc = cc + a.dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) return;
        if (jarak[nr][nc] !== -1) return;
        jarak[nr][nc] = jarak[cr][cc] + 1;
        terjauh = Math.max(terjauh, jarak[nr][nc]);
        antre.push([nr, nc]);
      });
    }
    let dicapai = 0;
    jarak.forEach(baris => baris.forEach(v => { if (v >= 0) dicapai++; }));
    return { jarak, dicapai, terjauh, semua: dicapai === n * n };
  }

  /** Dinding yang tidak disepakati dua sel bertetangga — invarian pertama. */
  function dindingTimpang(g) {
    const n = g.length;
    let salah = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      ARAH.forEach(a => {
        const nr = r + a.dr, nc = c + a.dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) return;
        const ada = !!(g[r][c] & a.bit), adaLawan = !!(g[nr][nc] & a.lawan);
        if (ada !== adaLawan) salah++;
      });
    }
    return salah / 2;
  }

  global.RETRO.MAZEGEN = {
    ARAH, buatKisi, galiPohon, galiAcak, banjir, dindingTimpang
  };
})(window);
