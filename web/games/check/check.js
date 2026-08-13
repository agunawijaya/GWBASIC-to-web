/* ===========================================================================
   check.js — port dari CHECK.BAS (Friendlyware PC Introductory Set, 1982).

   Enam puluh lima baris yang ternyata BUKAN program buku cek. Ia peluncur:
   dua layar penjelasan, satu tanya-jawab kesiapan disket, lalu

       720 GOSUB 740:CLOSE:CHAIN"info.sys",4250

   dan `info.sys` TIDAK ADA dalam koleksi ini. Jadi yang bisa diport hanyalah
   yang benar-benar ada — tiga layar, dan hitungan tentang apa yang hilang.

   Ini kali ketiga separuh sebuah program hilang: manual ANATOMY halaman
   11-15, halaman 31 milik BIO, dan sekarang seluruh badan program ini.

   ------------------------------------------------------------------------
   GALAT SEBAGAI CARA BERTANYA "DISKET MANA YANG MASUK?"

       730 ERX=0:CLOSE:OPEN "I",1,"MENU.BAS":IF ERX=0 THEN ERROR 200
       750 ERX=1
       755 IF ERR=200 THEN MG$="Insert `CHECK REGISTER' Diskette"

   Tidak ada cara bertanya "disket apa yang sedang masuk?". Yang ada cuma:
   coba buka sebuah berkas, dan lihat apa yang terjadi.

   Baris 730 mencoba membuka MENU.BAS. Kalau BERHASIL (ERX masih 0), berarti
   yang masuk disket FriendlyWare — bukan yang dibutuhkan. Maka program
   MEMBANGKITKAN GALAT 200 SENDIRI untuk meminta disket yang benar.

   Kode 200 tidak dipakai GW-BASIC. Ia nomor pesan buatan sendiri, disalurkan
   lewat mekanisme galat karena itu satu-satunya jalur yang sudah menganga ke
   penangan bersama.

   ------------------------------------------------------------------------
   LAYAR KETIGA MENIMPA LAYAR KEDUA

   Baris 440-460 tidak memanggil CLS. Ia menulis di baris 17, 18, dan 20 di
   atas layar kesiapan yang sudah ada. Sama seperti HISTORY halaman 2, 3, dan
   10 — dan karena itu ketiga layar di sini juga DIJALANKAN, bukan disalin.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, reader } = window.RETRO;
  const SCR = window.RETRO.CHECK_SCREENS || {};
  const META = window.RETRO.CHECK_META || {};
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

  function layar(nama, label) {
    const s = SCR[nama];
    const crt = ui.el('div', { class: 'h-crt' });
    const scr = ui.el('div', { class: 'h-scr' });
    scr.setAttribute('role', 'img');
    scr.setAttribute('aria-label', label + '. ' +
      s.teks.filter(b => b.trim()).join('. '));
    scr.innerHTML = s.teks.map((t, i) => barisHtml(t, s.att[i])).join('');
    crt.append(scr);
    return crt;
  }

  function kepala(judul, baris) {
    const k = ui.el('div', { class: 'h-kepala' });
    k.append(ui.el('h2', { text: judul }),
             ui.el('span', { class: 'mono', text: 'CHECK.BAS ' + baris }));
    return k;
  }

  const HAL = [
    { label: 'Penjelasan & syarat disket', baris: '90–330', nama: 'petunjuk' },
    { label: 'Siap? (pertanyaan pertama)', baris: '350–390', nama: 'siap1' },
    { label: 'Siap? (peringatan kedua)', baris: '440–460', nama: 'siap2' }
  ];

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Check Register (peluncur)',
    source: 'CHECK.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  reader($('reader'), {
    key: 'check',
    pages: HAL.map(p => ({
      label: p.label,
      build(host) {
        host.append(kepala(p.label, p.baris), layar(p.nama, p.label));
      }
    })),
    onPage(n) { $('s-layar').textContent = (n + 1) + ' / ' + HAL.length; }
  });

  /* --- angka-angka, dihitung dari sumbernya ------------------------------ */
  const lubang = (META.lompat || []).find(x => x.dari === 520);
  $('s-hilang').textContent = lubang ? lubang.selang + ' nomor' : '—';
  $('s-disk').textContent = META.diskette;
  $('n-disk').textContent = META.diskette;
  $('k-disk').textContent = META.diskette + '× kata “diskette”';

  $('tbl-hilang').innerHTML =
    '<thead><tr><th>Yang disambung</th><th>Ada di koleksi?</th></tr></thead><tbody>' +
    (META.chain || []).map(c =>
      '<tr><td><code>CHAIN "' + c.berkas + '", ' + c.baris + '</code></td>' +
      '<td>' + (c.ada ? 'ya' : '<b class="h-bad">tidak</b>') + '</td></tr>').join('') +
    '<tr><td>Selang nomor baris 520 → 720</td><td>' +
      (lubang ? lubang.selang : '—') + '</td></tr>' +
    '</tbody>';

  const NAMA_ERR = {
    '70': 'Permission denied / disk write-protect',
    '71': 'Disk not ready',
    '72': 'Disk media error',
    '200': 'bukan kode GW-BASIC — nomor pesan buatan sendiri'
  };
  $('tbl-galat').innerHTML =
    '<thead><tr><th>Kode</th><th>Artinya</th></tr></thead><tbody>' +
    (META.err || []).map(e =>
      '<tr><td><code>ERR=' + e + '</code></td><td>' +
      (NAMA_ERR[e] || '—') +
      ((META.buatGalat || []).includes(e)
        ? ' <b class="h-bad">← dibangkitkan sendiri</b>' : '') +
      '</td></tr>').join('') +
    '<tr><td><code>ERL=</code></td><td>' + (META.erl || []).join(', ') +
      ' — pesan dipilih dari <em>baris mana</em> yang gagal, bukan galat apa</td></tr>' +
    '</tbody>';
})();
