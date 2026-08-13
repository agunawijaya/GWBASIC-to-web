/* ===========================================================================
   reader.js — pembaca berhalaman, dipakai bersama.

   Modul ini lahir di ANATOMY (sesi 14), pilot kelompok edukasi.

   ------------------------------------------------------------------------
   KOREKSI, DITULIS SESI 15 — ALASAN KELAHIRANNYA SEBAGIAN SALAH

   Berkas ini semula dibuka dengan klaim: "tujuh program berikutnya — HISTORY,
   INTRO, HEAREYE, BIO, READING, CHECK, BUSONE — semuanya berbentuk yang sama,
   yaitu urutan layar yang dibalik maju-mundur oleh pemakai."

   Empat yang pertama sudah dibaca, dan klaim itu hanya benar untuk SATU:

     HISTORY   16 halaman tetap, `GOSUB 3380` + `BACKFLAG` — memang pembaca
               berhalaman. Tapi mundurnya TIDAK selalu satu langkah: baris
               830 mundur ke 40 (melompati 2 halaman), 1330 dan 1550 mundur
               ke 580, 2450 mundur ke 1820. Jadi bahkan yang paling cocok pun
               tidak sepenuhnya cocok.
     INTRO     SATU layar menu statis yang melempar ke program lain lewat
               `RUN`. Tidak ada halaman sama sekali.
     HEAREYE   dua alur maju-saja dua layar. `ON KEY(1)`..`(9)` semuanya
               menunjuk ke `RETURN` kosong — tombol mundurnya sengaja
               DIMATIKAN, bukan tidak sempat dibuat.
     BIO       kalkulator: jumlah "halaman" tidak diketahui di muka, dan F1
               di sana berarti "mulai sesi baru", bukan "halaman sebelumnya".

   Yang benar-benar sama di keempatnya bukan mesin halamannya, melainkan hal
   yang jauh lebih kecil: idiom bingkai `STRING$(80,219)` (3x persis), blok
   konfirmasi keluar F10 (2x hampir persis), dan `DEF SEG:POKE 106,0` (4x
   persis).

   Klaim itu dibiarkan tertulis di sini — dicoret, bukan dihapus — karena
   inilah persis kesalahan yang dibahas di docs/anatomy.md §2: dokumentasi
   yang menyalin keadaan lalu kalah balapan dengan kenyataannya. Yang membuat
   ketahuan cuma satu hal: keempat sumbernya benar-benar dibaca sebelum
   dipakai.

   Modul ini tetap berguna — untuk ANATOMY dan HISTORY. Kalau nanti terbukti
   hanya dua itu, ia tetap memenuhi syarat "dipakai lebih dari sekali".

   ------------------------------------------------------------------------
   APA YANG ADA DI SINI, DAN APA YANG TIDAK

   Ada  : urutan halaman, tombol maju/mundur, papan tombol, penanda posisi,
          pengumuman untuk pembaca layar, dan ingatan halaman terakhir.
   Tidak: apa pun tentang ISI halaman. Modul ini tidak pernah tahu apakah
          yang ditampilkan listing BASIC, gambar anatomi, atau soal latihan.

   Batas itu ditarik sengaja. Kalau modul ini mulai tahu isi, tiap program
   edukasi berikutnya akan menambahkan satu cabang lagi ke dalamnya, dan
   dalam tujuh program ia berubah jadi tempat sampah.

   ------------------------------------------------------------------------
   YANG ASLINYA TIDAK BISA, DAN KENAPA ITU DITAMBAHKAN

   ANATOMY.BAS punya sembilan halaman dan HANYA bisa maju satu atau mundur
   satu:

       50 CLS:GOSUB 1540:GOSUB  180:GOSUB 150:IF BACKFLAG THEN  40
       60 CLS:GOSUB 1540:GOSUB  340:GOSUB 150:IF BACKFLAG THEN  50
       70 CLS:GOSUB 1540:GOSUB  430:GOSUB 150:IF BACKFLAG THEN  60

   Sembilan baris yang hampir identik. Itu SEBUAH TABEL HALAMAN yang
   digulung jadi kode, karena `GOSUB` di BASIC tidak menerima nomor baris
   dari variabel — jadi tidak ada cara menulis `GOSUB halaman(i)`.

   Begitu tabelnya jadi data (`pages` di bawah), tiga hal langsung mungkin
   yang aslinya mustahil: lompat ke halaman mana pun, tahu ada berapa
   halaman seluruhnya, dan mengingat halaman terakhir. Ketiganya bukan
   selera — ketiganya adalah akibat langsung dari mengubah kode jadi data.
   =========================================================================== */

(function (global) {
  'use strict';

  const R = global.RETRO = global.RETRO || {};
  const el = (tag, attrs, kids) => R.ui.el(tag, attrs, kids);

  /* Tombol yang tidak boleh kita rebut: kalau fokus sedang di kolom isian,
     panah kiri/kanan milik kursor teks, bukan milik pembaca. */
  function mengetik(node) {
    if (!node) return false;
    const t = node.tagName;
    return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || node.isContentEditable;
  }

  function reader(host, opts) {
    const pages = opts.pages || [];
    if (!pages.length) throw new Error('reader: pages kosong');

    const db = opts.key && R.store ? R.store(opts.key) : null;
    let i = 0;
    const dibangun = new Array(pages.length);   // isi halaman dibangun sekali saja

    const root  = el('div', { class: 'rdr' });
    const rail  = el('div', { class: 'rdr__rail', role: 'tablist',
                              'aria-label': 'halaman' });
    const layar = el('div', { class: 'rdr__page', tabindex: '-1' });
    const hidup = el('p', { class: 'visually-hidden', role: 'status',
                            'aria-live': 'polite' });

    const prev = el('button', {
      class: 'btn btn--ghost rdr__nav', type: 'button', text: '← Mundur'
    });
    const next = el('button', {
      class: 'btn btn--primary rdr__nav', type: 'button', text: 'Maju →'
    });
    const cacah = el('span', { class: 'rdr__count mono' });

    /* Rel halaman: satu pasak per halaman. Aslinya tidak ada — sembilan
       nomor baris tidak bisa dijadikan daftar. */
    const pasak = pages.map((p, n) => {
      const b = el('button', {
        class: 'rdr__pin', type: 'button', role: 'tab',
        text: String(n + 1),
        title: (p.label || ('Halaman ' + (n + 1)))
      });
      b.addEventListener('click', () => go(n));
      rail.append(b);
      return b;
    });

    const bar = el('div', { class: 'rdr__bar' });
    bar.append(prev, cacah, next);
    root.append(rail, layar, bar, hidup);
    host.append(root);

    function bangun(n) {
      if (dibangun[n]) return dibangun[n];
      const box = el('div', { class: 'rdr__body' });
      const p = pages[n];
      if (typeof p.build === 'function') p.build(box, n);
      else if (p.node) box.append(p.node);
      else if (p.html) box.innerHTML = p.html;
      dibangun[n] = box;
      return box;
    }

    function go(n, fokus) {
      n = Math.max(0, Math.min(pages.length - 1, n));
      i = n;
      layar.textContent = '';
      layar.append(bangun(n));
      prev.disabled = (n === 0);
      next.disabled = (n === pages.length - 1);
      cacah.textContent = (n + 1) + ' / ' + pages.length;
      pasak.forEach((b, k) => {
        b.setAttribute('aria-selected', k === n ? 'true' : 'false');
        b.classList.toggle('rdr__pin--kini', k === n);
        b.classList.toggle('rdr__pin--lalu', k < n);
      });
      const p = pages[n];
      hidup.textContent = 'Halaman ' + (n + 1) + ' dari ' + pages.length +
                          (p.label ? ': ' + p.label : '');
      if (db) db.set('halaman', n);
      if (fokus) layar.focus();
      if (opts.onPage) opts.onPage(n, p);
    }

    prev.addEventListener('click', () => go(i - 1, true));
    next.addEventListener('click', () => go(i + 1, true));

    /* F1 = mundur, sama dengan aslinya (baris 1570). F10 aslinya keluar dari
       program; di peramban F10 milik menu jendela, jadi Escape yang dipakai
       dan itu dinyatakan di halamannya, bukan disembunyikan. */
    function tombol(e) {
      if (mengetik(e.target)) return;
      const k = e.key;
      if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(i + 1, true); }
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'F1') { e.preventDefault(); go(i - 1, true); }
      else if (k === 'Home') { e.preventDefault(); go(0, true); }
      else if (k === 'End')  { e.preventDefault(); go(pages.length - 1, true); }
      else if (k === 'Escape' && opts.onExit) opts.onExit();
    }
    global.addEventListener('keydown', tombol);

    const mulai = db ? Number(db.get('halaman', 0)) : 0;
    go(Number.isFinite(mulai) ? mulai : 0);

    return {
      go, next: () => go(i + 1), prev: () => go(i - 1),
      page: () => i, count: () => pages.length,
      destroy: () => { global.removeEventListener('keydown', tombol); root.remove(); }
    };
  }

  R.reader = reader;
})(window);
