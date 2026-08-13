/* ===========================================================================
   i18n.js — dua bahasa untuk halaman peluncur.

   LINGKUPNYA SENGAJA SEMPIT: hanya `index.html`, si shell. Halaman permainan
   tetap memakai teks Inggris aslinya (keputusan (b) di PLAN.md §9 — teks
   antarmuka aplikasi dipertahankan apa adanya supaya bisa dibandingkan dengan
   sumbernya), dan dokumen pembelajaran tetap Bahasa Indonesia seluruhnya.
   Yang bilingual cuma pintu masuknya.

   TIDAK ADA PUSTAKA, TIDAK ADA BERKAS TERJEMAHAN TERPISAH. Alasannya sama
   dengan kenapa catalog.js berupa .js dan bukan .json: halaman ini harus jalan
   dari `file://`, dan di sana `fetch()` diblokir CORS. Satu-satunya cara
   memuat data tanpa server adalah menetapkan variabel global lewat <script>.

   Terjemahan program sendiri TIDAK di sini melainkan di catalog.js sebagai
   medan `ringkas_en`, berdampingan dengan `ringkas`. Menaruhnya terpisah
   berarti dua berkas yang harus tetap sejajar, dan yang seperti itu selalu
   melenceng diam-diam.
   =========================================================================== */
(function (global) {
  'use strict';

  const KAMUS = {
    id: {
      'html.lang': 'id',
      'topbar.sub': '1978 – 1995 · versi web, jalan offline',
      'topbar.rencana': 'Rencana',
      'topbar.svg': 'Demo SVG',
      'topbar.katalog': 'Katalog arsip',
      'topbar.bahasa': 'English',
      'topbar.bahasaTitel': 'Switch to English',
      'hero.eyebrow': 'Peluncur',
      'hero.judul': 'Delapan puluh tiga program BASIC, ditulis ulang untuk peramban.',
      'hero.lead': 'Menggantikan <code>MENU.BAS</code> dan <code>MENU2.BAS</code> — ' +
                   'dua berkas yang dulu jadi menu disket Friendlyware 1982. Tiap ' +
                   'program yang sudah diport punya aplikasinya sendiri plus satu ' +
                   'dokumen yang menjelaskan arsitektur aslinya, apa yang berubah, ' +
                   'dan kenapa.',
      'metrik.total': 'Program BASIC asli',
      'metrik.aplikasi': 'Menjadi aplikasi',
      'metrik.siap': 'Sudah diport',
      'metrik.baris': 'Total baris BASIC',
      'cari.placeholder': 'Cari nama, judul, atau tahun…',
      'cari.label': 'Cari program',
      'saring.label': 'Saring menurut kelompok',
      'kosong': 'Tidak ada yang cocok.',
      'kartu.dok': 'dokumen →',
      'satuan.program': 'program',
      'satuan.baris': 'baris',
      'satuan.subrutin': 'subrutin',
      'status.exe': 'dibongkar dari EXE',
      'status.perkakas': 'perkakas belajar',
      'status.baru': 'program baru',
      'status.merge': 'tidak jadi aplikasi',
      'status.siap': 'siap dimainkan',
      'status.fase': 'fase ',
      'footer.1': 'Semua berkas di sini berjalan tanpa server, tanpa internet, dan ' +
                  'tanpa pustaka pihak ketiga. Kode sumber BASIC aslinya ada di ' +
                  '<code>../run/</code>, analisis arsitekturnya di ' +
                  '<a href="../reviews/README.md">../reviews/</a>.',
      'footer.2': 'Satu-satunya yang disimpan di peramban Anda: rekor permainan, ' +
                  'pilihan instrumen, pilihan bahasa, dan pilihan tema. Semuanya di ' +
                  '<code>localStorage</code>, berawalan <code>retro:</code>, dan ' +
                  'tidak pernah meninggalkan mesin ini.',
      'tema.sistem': 'Tema: sistem',
      'tema.gelap': 'Tema: gelap',
      'tema.terang': 'Tema: terang',
      'tema.judul': 'Ganti tema',
      'hapus': 'Hapus data tersimpan',
      'hapus.kosong': 'Tidak ada data tersimpan.',
      'hapus.judul': 'Hapus data tersimpan?',
      'hapus.isi': ' butir akan dihapus: rekor permainan, pilihan instrumen, dan ' +
                   'pilihan tema. Tidak bisa dibatalkan.',
      'hapus.selesai': ' butir dihapus. Muat ulang halaman untuk melihat tampilan ' +
                       'bawaannya lagi.'
    },
    en: {
      'html.lang': 'en',
      'topbar.sub': '1978 – 1995 · web port, runs offline',
      'topbar.rencana': 'Plan',
      'topbar.svg': 'SVG demo',
      'topbar.katalog': 'Archive catalogue',
      'topbar.bahasa': 'Indonesia',
      'topbar.bahasaTitel': 'Ganti ke Bahasa Indonesia',
      'hero.eyebrow': 'Launcher',
      'hero.judul': 'Eighty-three BASIC programs, rewritten for the browser.',
      'hero.lead': 'Replacing <code>MENU.BAS</code> and <code>MENU2.BAS</code> — the ' +
                   'two files that were the Friendlyware 1982 diskette menu. Every ' +
                   'program that has been ported gets its own app plus a document ' +
                   'explaining the original architecture, what changed, and why.',
      'metrik.total': 'Original BASIC programs',
      'metrik.aplikasi': 'Became apps',
      'metrik.siap': 'Ported so far',
      'metrik.baris': 'Total BASIC lines',
      'cari.placeholder': 'Search name, title, or year…',
      'cari.label': 'Search programs',
      'saring.label': 'Filter by group',
      'kosong': 'Nothing matches.',
      'kartu.dok': 'write-up →',
      'satuan.program': 'programs',
      'satuan.baris': 'lines',
      'satuan.subrutin': 'subroutines',
      'status.exe': 'recovered from EXE',
      'status.perkakas': 'learning tool',
      'status.baru': 'new program',
      'status.merge': 'not a separate app',
      'status.siap': 'ready to play',
      'status.fase': 'phase ',
      'footer.1': 'Everything here runs with no server, no internet, and no ' +
                  'third-party libraries. The original BASIC source is in ' +
                  '<code>../run/</code>, the architecture analyses in ' +
                  '<a href="../reviews/README.md">../reviews/</a>.',
      'footer.2': 'The only things stored in your browser: high scores, instrument ' +
                  'choice, language choice, and theme choice. All in ' +
                  '<code>localStorage</code>, prefixed <code>retro:</code>, and they ' +
                  'never leave this machine.',
      'tema.sistem': 'Theme: system',
      'tema.gelap': 'Theme: dark',
      'tema.terang': 'Theme: light',
      'tema.judul': 'Change theme',
      'hapus': 'Erase stored data',
      'hapus.kosong': 'No stored data.',
      'hapus.judul': 'Erase stored data?',
      'hapus.isi': ' items will be erased: high scores, instrument choice, and ' +
                   'theme choice. This cannot be undone.',
      'hapus.selesai': ' items erased. Reload the page to see the default ' +
                       'appearance again.'
    }
  };

  /* Nama kelompok. Ditaruh di sini, bukan di catalog.js, karena catalog.js
     dibangkitkan otomatis dan tidak boleh disunting tangan. */
  const KELOMPOK_EN = {
    puzzle: 'Puzzles & boards', kartu: 'Cards & dice', arkade: 'Arcade & action',
    musik: 'Music & sound', matematika: 'Maths & tools',
    edukasi: 'Education & presentation', simulasi: 'Simulation & strategy',
    petualangan: 'Adventure', bisnis: 'Business tutorials',
    percakapan: 'Conversation', shell: 'Menus (became this shell)',
    data: 'Supporting data', anomali: 'Anomalies'
  };

  /* Asal dan keterangan "menyatu ke ..." berulang di banyak entri, jadi
     diterjemahkan lewat pemetaan frasa — bukan medan per program. */
  const ASAL_EN = {
    'PD / majalah': 'Public domain / magazine',
    'Tidak diketahui': 'Unknown',
    'Program baru': 'New program',
    'Perkakas belajar': 'Learning tool',
    'Turunan modern dari DRAW.BAS': 'Modern derivative of DRAW.BAS'
  };
  const GABUNG_EN = {
    'menyatu ke BUSONE (tutorial 10 bagian)': 'folded into BUSONE (10-part tutorial)',
    'menyatu ke ELIZA': 'folded into ELIZA',
    'menyatu ke READING': 'folded into READING',
    'menyatu ke TEMPLE': 'folded into TEMPLE',
    'menyatu ke shell': 'folded into the shell',
    'menjadi shell ini': 'became this shell',
    'dilewati — duplikat MUSIC': 'skipped — duplicate of MUSIC',
    'dokumen saja, tanpa aplikasi': 'document only, no app'
  };

  const KUNCI = 'retro:situs:bahasa';
  function bacaTersimpan() {
    try { return global.localStorage.getItem(KUNCI); } catch (e) { return null; }
  }
  function simpan(l) {
    try { global.localStorage.setItem(KUNCI, l); } catch (e) { /* abaikan */ }
  }

  /* Bawaannya Indonesia — ini proyek berbahasa Indonesia. Peramban berbahasa
     Inggris dibuka dalam Inggris, tapi pilihan yang PERNAH disimpan selalu
     menang atas tebakan itu. */
  let bahasa = bacaTersimpan() ||
    (String(global.navigator && global.navigator.language || '').toLowerCase()
      .startsWith('en') ? 'en' : 'id');

  const pendengar = [];

  const i18n = {
    get bahasa() { return bahasa; },
    /** Terjemahan satu kunci. Kunci yang tidak dikenal dikembalikan apa adanya
        supaya kekurangan terlihat di layar, bukan hilang jadi string kosong. */
    t(kunci) {
      const k = KAMUS[bahasa];
      return (k && k[kunci] !== undefined) ? k[kunci] : kunci;
    },
    /** Ambil medan dari entri katalog menurut bahasa aktif, dengan mundur ke
        versi Indonesia kalau terjemahannya belum ada. */
    medan(p, nama) {
      if (bahasa === 'en' && p[nama + '_en']) return p[nama + '_en'];
      return p[nama];
    },
    kelompok(id, label) {
      return bahasa === 'en' ? (KELOMPOK_EN[id] || label) : label;
    },
    asal(s) { return bahasa === 'en' ? (ASAL_EN[s] || s) : s; },
    gabung(s) { return bahasa === 'en' ? (GABUNG_EN[s] || s) : s; },
    ganti(l) {
      if (l !== 'id' && l !== 'en') return;
      bahasa = l;
      simpan(l);
      document.documentElement.lang = i18n.t('html.lang');
      pendengar.forEach(f => f(l));
    },
    onGanti(f) { pendengar.push(f); },
    /** Terapkan ke seluruh simpul ber-`data-i18n`. */
    terapkan(akar) {
      (akar || document).querySelectorAll('[data-i18n]').forEach(e => {
        e.textContent = i18n.t(e.getAttribute('data-i18n'));
      });
      /* `data-i18n-html` untuk teks yang memuat <code> atau <a>. Isinya
         ditulis di kamus ini sendiri, bukan datang dari luar — jadi tidak ada
         masukan pemakai yang pernah melewati innerHTML. */
      (akar || document).querySelectorAll('[data-i18n-html]').forEach(e => {
        e.innerHTML = i18n.t(e.getAttribute('data-i18n-html'));
      });
      (akar || document).querySelectorAll('[data-i18n-attr]').forEach(e => {
        e.getAttribute('data-i18n-attr').split(',').forEach(pasang => {
          const [attr, kunci] = pasang.split(':');
          e.setAttribute(attr.trim(), i18n.t(kunci.trim()));
        });
      });
    }
  };

  global.RETRO = global.RETRO || {};
  global.RETRO.i18n = i18n;
})(window);
