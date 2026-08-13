/* ===========================================================================
   history.js — port dari HISTORY.BAS (Friendlyware PC Introductory Set, 1982).

   Enam belas layar pelajaran komputer: isi menu "1 Information" di INTRO.BAS
   baris 170. Nama berkasnya HISTORY, dan itulah yang membuat katalog koleksi
   ini menyebutnya "Evolusi Ukuran Komputer" selama empat belas sesi —
   padahal sejarah cuma tiga halaman pertamanya. Tiga belas sisanya CPU, ALU,
   bus I/O, memori, DOS, bahasa pemrograman, dan perawatan disket.

   Ini kali KEDUA berturut-turut judul katalog ternyata tebakan dari nama
   berkas, sesudah ANATOMY di sesi 14.

   ------------------------------------------------------------------------
   LAYARNYA DIJALANKAN, BUKAN DISALIN

   `pages.js` dihasilkan dengan MENJALANKAN HISTORY.BAS lewat penafsir kecil
   yang mengenal lima perintah: CLS, COLOR, LOCATE, PRINT, dan FOR..NEXT satu
   baris. Itu seluruh perbendaharaan yang dipakai program ini untuk
   menggambar.

   Kenapa dijalankan? Karena halaman 2, 3 dan 10 TIDAK memanggil CLS. Mereka
   menulis di atas layar halaman sebelumnya, dan isinya cuma SELISIH. Sebuah
   selisih tidak bisa disalin sendirian — ia harus dihitung.

   Bukti paling rapinya di halaman 10:

       1850 …PRINT "THERE ARE THREE TYPES OF COMPUTER MEMORY"   40 aksara
       2050 …PRINT "      FILES, RECORDS, AND FIELDS        "   40 aksara

   Bantalan spasinya dihitung persis supaya judul baru menutupi judul lama
   sampai aksara terakhir. Untungnya: bingkai kotak 80x20 milik halaman 9
   tidak perlu digambar ulang — dan pada 4,77 MHz, menggambar bingkai itu
   TERLIHAT menyapu dari atas ke bawah.

   ------------------------------------------------------------------------
   MUNDUR BUKAN SELALU SATU HALAMAN

   Enam belas `IF BACKFLAG THEN <baris>`, empat kelompok:

     10x  ke halaman sebelumnya          — perilaku biasa
      2x  TERPAKSA melompat (hal 4, 11)  — halaman yang dilewati adalah
                                           halaman-timpa yang tidak bisa
                                           digambar sendirian
      2x  ke awal bab (hal 6, 7)         — keputusan desain: subtopik CPU
                                           mundur ke pembuka babnya
      1x  tanpa penjelasan (hal 8)       — baris 1810 mundur ke baris 840,
                                           yaitu halaman 5, di bab LAIN, dan
                                           bukan pembuka bab itu

   Yang terakhir itu satu-satunya target yang tidak cocok pola apa pun di
   seluruh program. Di port ini mundur selalu satu halaman (keputusan pemakai
   koleksi ini, sesi 15); perilaku aslinya DITAMPILKAN sebagai tabel, tidak
   ditiru — seluruh nilainya ada pada bisa dibandingkan, bukan pada dialami.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, reader } = window.RETRO;
  const HAL = window.RETRO.HISTORY_PAGES || [];
  const META = window.RETRO.HISTORY_META || {};
  const $ = (id) => document.getElementById(id);

  const esc = (s) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  /* Sel yang berdampingan dengan warna sama digabung jadi satu <span>. Tanpa
     itu satu halaman berarti 2.000 elemen; dengan itu sekitar seratus. Yang
     dijaga: pemisahannya HANYA pada perubahan warna, jadi tidak ada satu pun
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

  function layar(p) {
    const crt = ui.el('div', { class: 'h-crt' });
    const scr = ui.el('div', { class: 'h-scr' });
    scr.setAttribute('role', 'img');
    scr.setAttribute('aria-label',
      'Layar ' + p.n + ' dari ' + HAL.length + ': ' + p.judul + '. ' +
      p.layar.teks.filter(b => b.trim()).join('. '));
    scr.innerHTML = p.layar.teks
      .map((t, i) => barisHtml(t, p.layar.att[i])).join('');
    crt.append(scr);
    return crt;
  }

  // --- bab: dipakai untuk mewarnai rel dan mengisi papan angka ---
  const BAB = {};
  let urutBab = 0;
  HAL.forEach(p => {
    const k = p.bab || '(pembuka)';
    if (!(k in BAB)) BAB[k] = ++urutBab;
    p.babKey = k;
  });
  const NAMA_BAB = {
    '(pembuka)': 'Sejarah & ukuran',
    'CPU': 'CPU',
    'memory': 'Memori & data',
    'OPERATING SYSYEMS': 'DOS, bahasa, disket'   // salah ketik aslinya dipertahankan
  };

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Information - pelajaran komputer',
    source: 'HISTORY.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  reader($('reader'), {
    key: 'history',
    pages: HAL.map(p => ({
      label: p.judul,
      build(host) {
        const kepala = ui.el('div', { class: 'h-kepala' });
        kepala.append(
          ui.el('h2', { text: p.judul }),
          ui.el('span', { class: 'h-bab',
                          text: NAMA_BAB[p.babKey] || p.babKey }),
          ui.el('span', { class: 'mono',
                          text: 'HISTORY.BAS ' + p.mulai + '–' + p.gosub })
        );
        host.append(kepala, layar(p));
      }
    })),
    onPage(n) {
      const p = HAL[n];
      $('s-hal').textContent = (n + 1) + ' / ' + HAL.length;
      $('s-bab').textContent = NAMA_BAB[p.babKey] || p.babKey;
      $('s-baris').textContent = p.mulai + '–' + p.gosub;
      $('s-cls').textContent = p.cls ? 'ya' : 'tidak — menimpa';
      $('stat-cls').classList.toggle('stat--warn', !p.cls);
    }
  });

  // Rel diwarnai menurut bab; halaman-timpa ditandai garis putus-putus.
  document.querySelectorAll('.rdr__pin').forEach((b, i) => {
    b.classList.add('rdr__pin--bab' + ((BAB[HAL[i].babKey] - 1) % 3 + 1));
    if (!HAL[i].cls) b.classList.add('rdr__pin--timpa');
    b.title = HAL[i].judul + (HAL[i].cls ? '' : ' — menimpa halaman sebelumnya');
  });

  /* --- angka-angka, dihitung dari datanya sendiri ------------------------- */
  $('m-baris').textContent = META.baris;
  $('m-hal').textContent = META.halaman;
  $('m-timpa').textContent = META.tanpaCls;
  $('k-timpa').textContent = META.tanpaCls + ' halaman menimpa';
  $('k-topik').textContent = Object.keys(BAB).length + ' bab';

  const perBab = {};
  HAL.forEach(p => { perBab[p.babKey] = (perBab[p.babKey] || 0) + 1; });
  $('tbl-bab').innerHTML =
    '<thead><tr><th>Bab</th><th>Halaman</th></tr></thead><tbody>' +
    Object.keys(perBab).map(k =>
      '<tr><td>' + (NAMA_BAB[k] || k) + '</td><td>' + perBab[k] +
      (k === '(pembuka)' ? ' <span class="h-bad">← yang dijadikan judul</span>' : '') +
      '</td></tr>').join('') + '</tbody>';

  const LABEL = {
    'sebelumnya': 'ke halaman sebelumnya',
    'terpaksa': 'melompat — terpaksa',
    'awal bab': 'ke awal bab',
    'aneh': 'tanpa penjelasan',
    'keluar': 'keluar program'
  };
  const hitung = {};
  HAL.forEach(p => { hitung[p.backJenis] = (hitung[p.backJenis] || 0) + 1; });
  $('tbl-back').innerHTML =
    '<thead><tr><th>Target mundur</th><th>Jumlah</th></tr></thead><tbody>' +
    ['sebelumnya', 'terpaksa', 'awal bab', 'aneh', 'keluar']
      .filter(k => hitung[k])
      .map(k => '<tr><td' + (k === 'aneh' ? ' class="h-bad"' : '') + '>' +
                LABEL[k] + '</td><td>' + hitung[k] + '</td></tr>').join('') +
    '</tbody>';
})();
