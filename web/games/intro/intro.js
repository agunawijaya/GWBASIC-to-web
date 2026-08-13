/* ===========================================================================
   intro.js — port dari INTRO.BAS (Friendlyware PC Introductory Set, 1982).

   Dua puluh tiga baris, satu layar, nol halaman. Program ini tidak mengajarkan
   apa pun: ia menggambar sebuah menu, menunggu 1/2/3, lalu MENGGANTI DIRINYA
   SENDIRI dengan program lain lewat RUN.

       160 RESP$=INKEY$:IF RESP$="" THEN 160
       170 IF RESP$="1" THEN RUN"HISTORY"
       180 IF RESP$="2" THEN RUN"anatomy"
       185 IF RESP$="3" THEN RUN"HINTS
       190 GOTO 160

   ------------------------------------------------------------------------
   KENAPA HALAMAN INI TIDAK MEMAKAI reader.js

   Saat reader.js dibuat di sesi 14, alasannya ditulis: "tujuh program
   berikutnya — HISTORY, INTRO, HEAREYE, BIO, ... — semuanya berbentuk yang
   sama, yaitu urutan layar yang dibalik maju-mundur oleh pemakai."

   INTRO membantahnya paling telak. Tidak ada halaman, tidak ada BACKFLAG,
   tidak ada ON KEY(1). Memaksakan reader.js di sini berarti menambahkan
   tombol maju/mundur ke sesuatu yang tidak punya urutan — antarmuka yang
   berbohong tentang bentuk programnya.

   Yang dipakai bersama justru yang lebih kecil dan lebih nyata: layar 80x25
   dan panelnya datang dari history.css, karena keduanya program Friendlyware
   dengan bentuk layar yang sama persis.

   ------------------------------------------------------------------------
   RUN SEBAGAI SATU-SATUNYA CARA BERPINDAH

   `RUN "nama"` memuat program lain dan MEMBUANG seluruh variabel yang ada.
   Itu bukan pilihan penulisnya — itu satu-satunya mekanisme yang tersedia.
   Akibatnya terlihat di seluruh koleksi: tiap program Friendlyware harus
   menggambar ulang kerangkanya sendiri dari nol, karena tidak ada apa pun
   yang bertahan melewati perpindahan.

   Di sini ia jadi tautan biasa, dan tidak ada yang hilang.
   =========================================================================== */
(function () {
  'use strict';

  const { ui } = window.RETRO;
  const SCR = window.RETRO.INTRO_SCREEN;
  const META = window.RETRO.INTRO_META || {};
  const $ = (id) => document.getElementById(id);

  const esc = (s) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  /* Sama dengan history.js: sel berdampingan berwarna sama digabung jadi satu
     <span>, dan pemisahannya HANYA pada perubahan warna supaya tidak ada
     kolom yang bergeser. */
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

  /* Nasib tiap tujuan di koleksi ini. `merged` diambil dari PLAN.md: HINTS
     dilebur ke shell, jadi ia tidak akan pernah punya halaman sendiri. */
  const TUJUAN = {
    HISTORY: { href: '../history/index.html', nama: 'Introduction To Computers',
               ket: '16 layar pelajaran komputer' },
    anatomy: { href: '../anatomy/index.html', nama: 'Anatomy of a Program',
               ket: '9 layar listing MASTER MIND' },
    HINTS: { href: null, nama: 'Helpful Commands',
             ket: '132 baris — dilebur ke shell, bukan aplikasi tersendiri' }
  };

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Introduction To Computers',
    source: 'INTRO.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  const crt = ui.el('div', { class: 'h-crt' });
  const scr = ui.el('div', { class: 'h-scr' });
  scr.setAttribute('role', 'img');
  scr.setAttribute('aria-label',
    'Layar menu INTRO: ' + SCR.teks.filter(b => b.trim()).join('. '));
  scr.innerHTML = SCR.teks.map((t, i) => barisHtml(t, SCR.att[i])).join('');
  crt.append(scr);
  $('layar').append(crt);

  const host = $('pilih');
  (META.tujuan || []).forEach(t => {
    const info = TUJUAN[t.program] || { href: null, nama: t.program, ket: '' };
    const tag = info.href ? 'a' : 'div';
    const el = ui.el(tag, {
      class: 'i-kartu' + (info.href ? '' : ' i-kartu--tanpa'),
      href: info.href
    });
    el.append(
      ui.el('span', { class: 'i-kartu__k', text: 'TOMBOL ' + t.tombol }),
      ui.el('span', { class: 'i-kartu__n', text: info.nama }),
      ui.el('span', { class: 'i-kartu__s', text: info.ket })
    );
    host.append(el);
  });

  /* Tombol 1/2/3 — tombol yang sama dengan baris 170-185. */
  window.addEventListener('keydown', (e) => {
    const t = e.target.tagName;
    if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;
    const cari = (META.tujuan || []).find(x => x.tombol === e.key);
    if (!cari) return;
    const info = TUJUAN[cari.program];
    if (info && info.href) { e.preventDefault(); location.href = info.href; }
  });

  $('tbl-tujuan').innerHTML =
    '<thead><tr><th>Tombol</th><th>Baris</th><th>Nasibnya di koleksi ini</th></tr></thead><tbody>' +
    (META.tujuan || []).map(t => {
      const info = TUJUAN[t.program] || {};
      return '<tr><td><code>' + t.tombol + '</code> → <code>RUN"' + t.program +
             '"</code></td><td>' + t.baris + '</td><td>' +
             (info.href ? 'diport — ' + info.nama : info.ket || 'belum') +
             '</td></tr>';
    }).join('') + '</tbody>';
})();
