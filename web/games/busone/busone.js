/* ===========================================================================
   busone.js — port dari BUSONE.BAS .. BUSTEN.BAS (Friendlyware, 1982).

   "A walk through the automated accounting world" — tutorial akuntansi dua
   belas langkah, 41 layar, memakai satu contoh: ABC Hardware, Juni 1982.

   ------------------------------------------------------------------------
   SEPULUH BERKAS, DAN ALASANNYA BISA DIHITUNG

   50.111 bita teks program di sepuluh berkas. Sebuah IBM PC 1982 dengan 64 KB
   harus memuat penafsir BASIC, ruang kerjanya, DAN programnya — jadi lima
   puluh kilobita tidak akan pernah muat sekaligus.

   Karena itu tutorialnya dipecah jadi sepuluh program yang saling memanggil
   lewat `RUN "BUSTWO"` dan seterusnya. Dan `RUN` MEMBUANG SELURUH VARIABEL:
   tidak ada apa pun yang bisa dibawa dari satu langkah ke langkah berikutnya,
   jadi tiap berkas menggambar ulang bingkainya sendiri dan mengetik ulang
   angka ABC Hardware yang dipakainya.

   Itu bentuk paling ekstrem dari pola yang berulang di koleksi ini: ANATOMY
   tidak bisa menyimpan halaman sebagai tabel jadi memakai sembilan baris
   kode; BUS tidak bisa menyimpannya di satu program sama sekali.

   ------------------------------------------------------------------------
   LAYARNYA DIJALANKAN, BUKAN DISALIN

   Sama seperti HISTORY — dan di sini alasannya bahkan lebih kuat. Bagan alur
   siklus akuntansi di langkah I TUMBUH: layar berikutnya menambah satu kotak
   ke bagan yang sudah ada, bukan menggambar bagan baru. Sebuah layar yang
   isinya cuma selisih tidak bisa disalin sendirian.

   Penafsirnya harus lebih lengkap daripada milik HISTORY: layar BUS dibangun
   lewat GOSUB ke subrutin penggambar kotak, jadi alur kendalinya harus
   diikuti sungguhan — GOTO, GOSUB, RETURN, IF..THEN <baris>, dan FOR..NEXT
   BERSARANG (`FOR I=1 TO 3 STEP 2:FOR J=20 TO 62:…:NEXT:NEXT`).

   ------------------------------------------------------------------------
   ENAM BARIS YANG SAMA DI SEPULUH BERKAS

       40 POKE 106,0
       50 IF INKEY$<>"" THEN 40
       60 RESP$=INKEY$:IF RESP$="" THEN 60
       70 RETURN
       20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
       30 GOTO 80

   Itu SELURUH kode yang dipakai bersama — enam baris, semuanya soal membaca
   tombol. Sembilan ratus sebelas baris sisanya tidak ada yang sama.

   Jebakan sembilan tombol fungsi ke penangan kosong muncul untuk KELIMA
   kalinya di koleksi ini (sesudah HEAREYE, BIO, CHECK) — dan di sini ia
   diketik ulang sepuluh kali dalam satu produk.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, reader } = window.RETRO;
  const HAL = window.RETRO.BUS_PAGES || [];
  const META = window.RETRO.BUS_META || {};
  const $ = (id) => document.getElementById(id);

  const esc = (s) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function barisHtml(teks, att) {
    let out = '', mulai = 0;
    const sama = (a, b) => a[0] === b[0] && a[1] === b[1];
    for (let i = 1; i <= teks.length; i++) {
      if (i === teks.length || !sama(att[i], att[mulai])) {
        const [fg, bg] = att[mulai];
        out += '<span class="c' + fg + ' b' + bg + '">' +
               esc(teks.slice(mulai, i)) + '</span>';
        mulai = i;
      }
    }
    return '<span class="h-scr__row">' + out + '</span>';
  }

  function layar(p) {
    const crt = ui.el('div', { class: 'h-crt' });
    const scr = ui.el('div', { class: 'h-scr' });
    scr.setAttribute('role', 'img');
    scr.setAttribute('aria-label',
      'Layar ' + p.n + ' dari ' + HAL.length + '. ' +
      p.layar.teks.filter(b => b.trim()).join('. '));
    scr.innerHTML = p.layar.teks.map((t, i) => barisHtml(t, p.layar.att[i])).join('');
    crt.append(scr);
    return crt;
  }

  /* --- langkah: diambil dari judul "STEP <romawi>." yang tergambar ---------
     Bukan didaftar dengan tangan: kalau layarnya berubah, labelnya ikut. */
  const RE_STEP = /STEP\s+([IVX]+)\.\s*([A-Z][A-Za-z \-/&]+)/;
  let langkahKini = null;
  HAL.forEach(p => {
    const gabung = p.layar.teks.join('\n');
    const m = gabung.match(RE_STEP);
    if (m) langkahKini = { romawi: m[1], nama: m[2].trim() };
    p.langkah = langkahKini;
  });

  /* --- pertumbuhan: layar mana yang MENAMBAH tanpa menghapus ---------------
     Diukur PER SEL, bukan per baris.

     Versi pertama membandingkan baris utuh: "tiap baris tak-kosong layar
     sebelumnya masih ada". Itu mengukur hal yang salah dan hanya menemukan
     dua layar. Sebabnya: bagan alur tumbuh dengan MEMANJANGKAN baris yang
     sudah ada — baris 18 berubah dari satu kotak jadi dua — jadi baris
     lamanya memang tidak ada lagi sebagai baris, padahal tidak ada satu pun
     aksara yang dihapus.

     Definisi yang benar dan bisa diperiksa: tidak ada satu sel pun yang tadi
     berisi lalu sekarang kosong atau berubah. Itu persis arti "menambah". */
  function bedaSel(lama, baru) {
    let hapus = 0, tambah = 0;
    for (let r = 0; r < lama.length; r++) {
      const a = lama[r], b = baru[r] || '';
      for (let c = 0; c < 80; c++) {
        const x = a[c] || ' ', y = b[c] || ' ';
        if (x === y) continue;
        if (x !== ' ') hapus++; else tambah++;
      }
    }
    return { hapus, tambah };
  }
  let nTambah = 0;
  HAL.forEach((p, i) => {
    if (i === 0 || HAL[i - 1].berkas !== p.berkas) { p.tumbuh = null; return; }
    const d = bedaSel(HAL[i - 1].layar.teks, p.layar.teks);
    p.tumbuh = (d.hapus === 0 && d.tambah > 0) ? d.tambah : null;
    if (p.tumbuh !== null) nTambah++;
  });

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Business Simulation',
    source: 'BUSONE…BUSTEN · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  const BERKAS = [];
  HAL.forEach(p => { if (!BERKAS.includes(p.berkas)) BERKAS.push(p.berkas); });

  reader($('reader'), {
    key: 'busone',
    pages: HAL.map(p => ({
      label: (p.langkah ? 'Langkah ' + p.langkah.romawi + ' — ' + p.langkah.nama
                        : 'Pembuka') + ' (' + p.berkas + ')',
      build(host) {
        const kepala = ui.el('div', { class: 'h-kepala' });
        kepala.append(
          ui.el('h2', { text: p.langkah ? p.langkah.nama : 'Pembuka' }),
          ui.el('span', { class: 'b-langkah',
                          text: p.langkah ? 'Langkah ' + p.langkah.romawi : 'awal' }),
          ui.el('span', { class: 'b-berkas', text: p.berkas + ' · baris ' + p.baris })
        );
        host.append(kepala, layar(p));
      }
    })),
    onPage(n) {
      const p = HAL[n];
      $('s-layar').textContent = (n + 1) + ' / ' + HAL.length;
      $('s-berkas').textContent = p.berkas;
      $('s-langkah').textContent = p.langkah
        ? p.langkah.romawi + '. ' + p.langkah.nama : '—';
      $('s-tambah').textContent = p.tumbuh === null
        ? (n === 0 || HAL[n - 1].berkas !== p.berkas ? 'berkas baru' : 'digambar ulang')
        : '+' + p.tumbuh + ' aksara, 0 dihapus';
      $('stat-tambah').classList.toggle('stat--good', p.tumbuh !== null);
    }
  });

  document.querySelectorAll('.rdr__pin').forEach((b, i) => {
    const p = HAL[i];
    b.classList.add('rdr__pin--f' + (BERKAS.indexOf(p.berkas) % 5));
    if (i === 0 || HAL[i - 1].berkas !== p.berkas) b.classList.add('rdr__pin--awal');
    b.title = p.berkas + ' baris ' + p.baris +
              (p.langkah ? ' — Langkah ' + p.langkah.romawi + '. ' + p.langkah.nama : '');
  });

  /* --- angka-angka, dihitung dari datanya sendiri ------------------------- */
  $('k-layar').textContent = HAL.length + ' layar';
  $('k-bita').textContent = (META.bita / 1024).toFixed(1) + ' KB total';
  $('n-tambah').textContent = nTambah;
  $('n-total').textContent = HAL.length;

  $('tbl-berkas').innerHTML =
    '<thead><tr><th>Berkas</th><th>Layar</th><th>Bita</th></tr></thead><tbody>' +
    (META.perBerkas || []).map(x =>
      '<tr><td><code>' + x.nama + '</code></td><td>' + x.layar + '</td><td>' +
      x.bita.toLocaleString('id') + '</td></tr>').join('') +
    '<tr><td><b>Total</b></td><td><b>' + HAL.length + '</b></td><td><b>' +
      (META.bita || 0).toLocaleString('id') + '</b></td></tr>' +
    '<tr><td colspan="2">Memori IBM PC 1982</td><td>65.536</td></tr>' +
    '</tbody>';

  const tumbuhPerBerkas = {};
  HAL.forEach(p => {
    if (p.tumbuh !== null) tumbuhPerBerkas[p.berkas] = (tumbuhPerBerkas[p.berkas] || 0) + 1;
  });
  $('tbl-tambah').innerHTML =
    '<thead><tr><th>Berkas</th><th>Layar yang menambah</th></tr></thead><tbody>' +
    Object.keys(tumbuhPerBerkas).map(k =>
      '<tr><td><code>' + k + '</code></td><td>' + tumbuhPerBerkas[k] + '</td></tr>').join('') +
    '<tr><td><b>Seluruhnya</b></td><td><b>' + nTambah + ' dari ' + HAL.length +
      '</b></td></tr></tbody>';

  const langkah = [];
  HAL.forEach(p => {
    if (p.langkah && !langkah.some(x => x.romawi === p.langkah.romawi)) {
      langkah.push({ romawi: p.langkah.romawi, nama: p.langkah.nama, berkas: p.berkas });
    }
  });
  $('tbl-langkah').innerHTML =
    '<thead><tr><th>Langkah</th><th>Berkas</th></tr></thead><tbody>' +
    langkah.map(x => '<tr><td>' + x.romawi + '. ' + x.nama + '</td><td><code>' +
      x.berkas + '</code></td></tr>').join('') + '</tbody>';
})();
