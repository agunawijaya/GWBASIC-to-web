/* ===========================================================================
   anatomy.js — port dari ANATOMY.BAS (Friendlyware PC Introductory Set, 1982).

   Namanya BUKAN pelajaran anatomi tubuh — itu tebakan dari nama berkas, dan
   tebakan itu sempat masuk ke katalog koleksi ini selama tiga belas sesi.
   Judul sebenarnya ada di baris 1540, dicetak di bilah atas tiap layarnya:

       1540 LOCATE 1,28:COLOR 0,7:PRINT " Anatomy of a Program "

   Ia sebuah program yang ISINYA program lain: sembilan layar yang mencetak
   listing MASTER MIND potong demi potong, supaya pembaca bisa menelusurinya
   sambil memegang manual cetak.

   ------------------------------------------------------------------------
   SETENGAH PROGRAM INI HILANG

       1510 LOCATE 23,17:PRINT "Screen corresponds to page"PAGE$"in your manual"

   Layarnya menunjuk ke halaman 11-15 sebuah manual yang tidak ada dalam
   koleksi. Jadi yang tersisa cuma separuh: kode tanpa penjelasannya.

   Port ini menampilkan separuh yang ada persis seperti aslinya, lalu MENULIS
   separuh yang hilang — dan menandainya sebagai tulisan 2026, bukan 1982.
   Menyamarkan keduanya akan membuat berkas ini ikut jadi sumber palsu bagi
   siapa pun yang membacanya empat puluh tahun lagi.

   ------------------------------------------------------------------------
   TIGA HAL YANG BENAR KARENA KEBETULAN

   1. `PAGE=15` di baris 1150 dan 1260 lupa tanda dolarnya, jadi baris 1510
      mencetak nilai LAMA. Tidak terlihat, karena nilai lamanya kebetulan
      " 15 " juga — dan alurnya lurus, jadi tidak ada urutan penelusuran yang
      membongkarnya.

   2. Halaman 9 mencetak 21 baris mulai dari baris layar ke-3, jadi berakhir
      tepat di baris 23 — baris yang sama dengan pesan nomor halaman. Tidak
      bertabrakan hanya karena baris terakhirnya berbunyi `1260 END`, delapan
      kolom, sedangkan pesannya mulai di kolom 17.

   3. `LOCATE 23,25,O` di baris 1330 memakai huruf O, bukan angka nol. Di
      BASIC variabel yang belum diisi bernilai 0, dan 0 memang arti yang
      dimaksud (kursor disembunyikan). Salah ketik yang menghasilkan jawaban
      benar — dan ia ikut terkirim ke MASTER.BAS.

   Ketiganya dipertahankan apa adanya di sini, termasuk yang nomor 2: kaki
   layar dipasang mutlak di baris 23/24/25 supaya tabrakannya bisa dilihat,
   bukan disembunyikan oleh tata letak yang mengalir bebas.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, reader } = window.RETRO;
  const HAL = window.RETRO.ANATOMY_PAGES || [];
  const META = window.RETRO.ANATOMY_META || {};
  const $ = (id) => document.getElementById(id);

  /* --- pewarnaan sintaksis ------------------------------------------------
     String diambil LEBIH DULU, sebelum kata kunci. Kalau urutannya dibalik,
     kata "PRINT" di dalam kalimat "PRESS ANY KEY" ikut terwarnai — persis
     kesalahan yang membuat penganalisis otomatis mengira program ini memakai
     PLAY (lihat panel "Penganalisis yang tertipu"). */
  const KATA = ('PRINT|LOCATE|COLOR|IF|THEN|ELSE|GOTO|GOSUB|RETURN|FOR|TO|STEP|' +
    'NEXT|DIM|ERASE|CLS|END|RUN|DEF SEG|POKE|PEEK|KEY|SCREEN|WIDTH|RANDOMIZE|' +
    'AND|OR|NOT|SPC|STRING\\$|CHR\\$|INKEY\\$|TIME\\$|RIGHT\\$|LEFT\\$|MID\\$|' +
    'VAL|FIX|INT|RND|CSRLIN|POS|ON ERROR|ON');
  /* `\b` di ujung kanan tidak bisa dipakai: sesudah `$` pada CHR$ datang `(`,
     dua-duanya bukan aksara kata, jadi tidak ada batas di sana dan CHR$ tidak
     akan pernah cocok. Lookahead negatif menyatakan maksud sebenarnya —
     "jangan menyambung ke aksara kata berikutnya" — dan berlaku untuk kata
     yang berakhiran huruf maupun yang berakhiran `$`. */
  const RE_KATA = new RegExp('\\b(' + KATA + ')(?![A-Z0-9$])', 'g');

  const escHtml = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  /* Penanda tempat memakai NUL, bukan angka berapit spasi. Versi pertama
     memakai spasi-angka-spasi, dan `FOR C=66 TO 18 STEP -1` mengandung " 18 " — angka
     yang sah di kode BASIC terbaca sebagai nomor potongan, lalu diganti
     dengan `undefined`. Penanda yang mustahil ada di datanya adalah
     satu-satunya penanda yang aman. */
  const NUL = String.fromCharCode(0);
  const RE_NUL = new RegExp(NUL + '([0-9]+)' + NUL, 'g');

  function warnai(teks) {
    const potong = [];
    let sisa = '';
    // 1. pisahkan string BASIC "..." jadi potongan utuh
    const re = /"[^"]*"?/g;
    let last = 0, m;
    while ((m = re.exec(teks))) {
      sisa += teks.slice(last, m.index);
      sisa += NUL + potong.length + NUL;
      potong.push(m[0]);
      last = m.index + m[0].length;
    }
    sisa += teks.slice(last);
    // 2. kata kunci hanya di luar string
    let out = escHtml(sisa).replace(RE_KATA, '<span class="a-kw">$1</span>');
    // 3. kembalikan stringnya
    out = out.replace(RE_NUL,
      (_, i) => '<span class="a-str">' + escHtml(potong[i]) + '</span>');
    return out;
  }

  function barisHtml(r) {
    const t = r.t;
    const m = t.match(/^(\d+)(\s)/);
    const isi = m ? warnai(t.slice(m[1].length)) : warnai(t);
    const num = m ? '<span class="a-num">' + m[1] + '</span>' : '';
    /* Tidak ada pemisah antarbaris. Versi pertama menyambung dengan "\n",
       dan karena layarnya `white-space: pre-wrap`, tiap pemisah itu menjadi
       satu baris kosong tambahan — listing halaman 9 membengkak dari 21 jadi
       31 baris dan tabrakan di baris 23 tidak lagi terukur. `.a-ln` sudah
       `display:block`; pemisahnya tidak pernah dibutuhkan. */
    return '<span class="a-ln a-ln--' + r.s + '">' + num + isi + '</span>';
  }

  /* --- layar 80x25 --------------------------------------------------------
     Baris 1 (judul), 23 (nomor halaman), 24 (petunjuk tombol) dan 25 (keluar)
     dipasang MUTLAK pada barisnya. Itu yang membuat sempitnya halaman 9 bisa
     diukur, bukan cuma diceritakan. */
  function layar(p) {
    const crt = ui.el('div', { class: 'a-crt' });
    const scr = ui.el('div', { class: 'a-scr' + (banding ? ' a-scr--banding' : '') });
    scr.setAttribute('role', 'img');
    scr.setAttribute('aria-label',
      'Layar ' + p.n + ': listing MASTER MIND baris ' +
      (p.rows[0].mm || '') + ' sampai ' + (p.rows[p.rows.length - 1].mm || ''));

    scr.innerHTML =
      '<div class="a-row a-r1"><span class="a-inv"> Anatomy of a Program </span></div>' +
      '<div class="a-list">' + p.rows.map(barisHtml).join('') + '</div>' +
      '<div class="a-row a-r23">Screen corresponds to page' + p.tampil + 'in your manual</div>' +
      '<div class="a-row a-r24 a-hi">Strike Any Key To Continue  Strike &lt;F1&gt; For Previous Page</div>' +
      '<div class="a-row a-r25"><span class="a-inv"> Strike &lt;F10&gt; To Leave This Program </span></div>';

    crt.append(scr);
    layarAktif.push(scr);
    return crt;
  }

  let banding = false;
  const layarAktif = [];

  /* --- catatan halaman ----------------------------------------------------
     Inilah manual yang hilang, ditulis ulang. Ditandai sebagai tulisan
     sekarang di kepala panelnya, dan tidak pernah dicampur ke dalam layar. */
  const CATATAN = [
    `<p><strong>Layar petunjuk.</strong> <code>LOCATE baris,kolom,kursor</code>
     memindahkan kursor sebelum tiap <code>PRINT</code>; argumen ketiga
     <code>0</code> menyembunyikan kursornya supaya tidak berkedip di tengah
     teks.</p>
     <p>Perhatikan dua baris terakhir, 280 dan 290. Yang pertama
     <em>membuang</em> tombol yang sudah telanjur masuk penyangga; yang kedua
     baru menunggu tombol sungguhan. Tanpa baris 280, tombol yang dipakai
     untuk sampai ke layar ini akan langsung melewatinya. Pasangan ini muncul
     di hampir setiap program koleksi.</p>
     <p><strong>Seluruh layar ini ditulis ulang sebelum dikirim</strong> —
     sebelas dari dua puluh dua perbedaan ada di sini. Versi yang dikirim
     memindahkannya tiga baris ke bawah dan menambah contoh
     <code>\`3 3 9'</code> yang tidak ada di manual.</p>`,

    `<p><strong>Menu tingkat.</strong> <code>DIM GUESS(6):DIM ANSWER(6)</code>
     memesan tempat untuk enam angka <em>sebelum</em> pemain memilih
     tingkatnya. Bukan kelalaian: larik BASIC tidak bisa diubah ukurannya,
     jadi satu-satunya pilihan aman adalah memesan sebesar kemungkinan
     terbesar.</p>
     <p><code>COLOR 15,0</code> menyalakan putih terang untuk judul dan
     menunya, lalu baris 370 mengembalikannya ke <code>COLOR 3,0</code>.
     Warna di sini adalah <em>keadaan global</em> — dinyalakan dan wajib
     dimatikan lagi, seperti pena yang harus ditutup.</p>`,

    `<p><strong>Bingkai kotak.</strong> Empat perulangan menggambar empat
     sisinya dengan aksara gambar-garis: <code>205</code> ═ mendatar,
     <code>186</code> ║ tegak. Pojoknya tidak bisa ikut perulangan, jadi
     ditulis satu per satu: <code>201</code> ╔, <code>188</code> ╝,
     <code>200</code> ╚.</p>
     <p>Sekarang lihat <strong>nomor barisnya</strong>: 379, 431, 461.
     Semuanya ganjil, di tengah kelipatan sepuluh. Nomor baris dinaikkan
     sepuluh-sepuluh justru supaya ada ruang menyisip — jadi tiga nomor ini
     berarti seseorang menggambar kotaknya, lupa pojoknya, lalu menambalnya
     belakangan. Riwayat suntingan yang bertahan karena tidak pernah
     dirapikan.</p>
     <p>Dan pojok kanan-atas tidak pernah ditambahkan sama sekali.</p>`,

    `<p><strong>Pilihan pemain, dan angka rahasianya.</strong> Empat baris
     <code>IF</code> masing-masing menyetel <em>empat</em> angka sekaligus:
     berapa digit, di kolom mana angka rahasia dicetak, di kolom mana tebakan
     dicetak, dan sampai baris berapa papannya turun. Keempatnya dihitung
     tangan supaya tabelnya tetap di tengah pada tiap tingkat.</p>
     <p><strong>Baris 570 adalah bug yang paling terkenal di koleksi ini</strong>,
     dan tutorial ini mencetaknya sebagai bahan pelajaran:
     <code>RANDOMIZE</code> berada <em>di dalam</em> perulangan, dan benihnya
     dua digit terakhir <code>TIME$</code> — yaitu detik. Perulangan tiga
     sampai enam putaran selesai dalam milidetik, jadi tiap angka diambil dari
     pengacak yang baru saja dikembalikan ke keadaan yang sama.</p>
     <p>Uraian lengkapnya, dengan pembandingnya yang bisa dijalankan, ada di
     <a href="../master/index.html">halaman MASTER MIND</a>.</p>`,

    `<p><strong>Kepala tabel.</strong> <code>CHR$(219)</code> █ adalah balok
     penuh: itulah cara menyembunyikan angka rahasia — bukan dengan tidak
     mencetaknya, melainkan dengan mencetak sesuatu yang menutupinya.</p>
     <p>Garis bawah judul kolom diketik sebagai untaian tanda hubung di dalam
     string, bukan dihasilkan perulangan. Lebih pendek ditulis, tapi kalau
     judulnya berubah panjang, garisnya tidak ikut.</p>`,

    `<p><strong>Kotak tebakan kosong.</strong> Perulangan bersarang: baris 7
     sampai <code>BOTROW</code>, dan di tiap baris sebanyak
     <code>DIGITS</code> kotak. Posisinya maju empat kolom tiap kotak —
     dua kolom untuk <code>CHR$(220)</code> ▄ dan dua kolom jarak.</p>
     <p>Angka 4 itu muncul di enam tempat berbeda sepanjang program, selalu
     sebagai angka telanjang. Mengubah jarak antarkotak berarti menemukan
     keenamnya.</p>`,

    `<p><strong>Membaca tebakan, lalu menghitung yang tepat.</strong> Tiap
     angka dibaca satu per satu lewat <code>INKEY$</code>, dan disaring dengan
     membandingkan <em>string</em>: <code>TRY$&lt;"0" OR TRY$&gt;"9"</code>.
     Perbandingan aksara, bukan angka — dan itu benar, karena "0" sampai "9"
     memang berurutan di tabel ASCII.</p>
     <p>Baris 850 mengejutkan: <code>DIM</code> di <em>dalam</em> perulangan.
     Ia berpasangan dengan <code>ERASE</code> di akhir tiap baris tebakan
     (halaman berikutnya). BASIC tidak punya cara mengosongkan larik, jadi
     satu-satunya jalan adalah <strong>menghapusnya lalu memesannya
     lagi</strong>.</p>
     <p>Lintasan pertama menghitung angka yang benar <em>dan</em> pada posisi
     yang benar, menandainya <code>"*"</code> di <code>HITS$</code> supaya
     tidak dihitung dua kali oleh lintasan kedua.</p>`,

    `<p><strong>Angka benar, tempat salah.</strong> Satu syarat
     <code>IF</code> sepanjang 185 kolom, dengan enam pemeriksaan yang
     digabung <code>AND</code>. Empat di antaranya cuma memastikan pasangan
     ini belum pernah dihitung — oleh lintasan sebelumnya, atau oleh putaran
     sebelumnya di lintasan ini.</p>
     <p>Itulah harga tidak punya struktur data: yang sebenarnya dibutuhkan
     adalah <em>himpunan</em> "sudah dipakai", dan yang tersedia cuma dua
     larik string dua dimensi berisi tanda bintang.</p>
     <p>Port MASTER MIND menggantinya dengan menghitung kemunculan tiap angka
     di kedua sisi lalu mengambil yang terkecil — tiga baris, dan tidak butuh
     penanda sama sekali.</p>`,

    `<p><strong>Menang, kalah, dan keluar.</strong> Baris 1070 memeriksa
     kemenangan lalu mencetak ucapan selamat — dieja
     <code class="a-bad">C O N G R A G U L A T I O N S</code> di manual ini,
     dan <code>C O N G R A T U L A T I O N S</code> di program yang benar-benar
     dikirim. Salah ketiknya sudah diperbaiki di kodenya, dan dibekukan
     selamanya di dokumentasinya.</p>
     <p>Baris 1170 sampai 1250 adalah penjebak <kbd>F10</kbd>. Ia menyimpan
     posisi kursor dengan <code>CSRLIN</code> dan <code>POS(0)</code>,
     bertanya, lalu mengembalikan kursor ke tempatnya semula — sebuah
     penangan interupsi yang berhati-hati mengembalikan keadaan yang
     dipinjamnya.</p>
     <p><code>POKE 106,0</code> di baris 1250 mengosongkan penyangga ketik.
     Tanpa itu, tombol yang diketik selama tanya-jawab akan tumpah ke
     permainan begitu ia kembali.</p>
     <p>Terakhir, perhatikan <code>LOCATE 23,25,O</code> di baris 1110: itu
     <strong>huruf O</strong>, bukan angka nol. Variabel yang belum diisi
     bernilai 0 di BASIC, dan 0 memang yang dimaksud. Salah ketik yang
     menghasilkan jawaban benar — dan ia ikut terkirim.</p>`
  ];

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Anatomy of a Program',
    source: 'ANATOMY.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  const tombolBanding = ui.el('button', {
    class: 'btn btn--ghost btn--sm', type: 'button',
    'aria-pressed': 'false', text: 'Banding: mati'
  });
  tombolBanding.addEventListener('click', () => {
    banding = !banding;
    tombolBanding.textContent = 'Banding: ' + (banding ? 'nyala' : 'mati');
    tombolBanding.setAttribute('aria-pressed', String(banding));
    layarAktif.forEach(s => s.classList.toggle('a-scr--banding', banding));
  });

  const buku = reader($('reader'), {
    key: 'anatomy',
    pages: HAL.map((p) => ({
      label: p.judul,
      build(host) {
        const kepala = ui.el('div', { class: 'a-kepala' });
        kepala.append(
          ui.el('h2', { text: p.judul }),
          ui.el('span', {
            class: 'mono',
            text: 'MASTER MIND ' + p.rows[0].mm + '–' +
                  p.rows.filter(r => r.mm).slice(-1)[0].mm +
                  ' · ANATOMY ' + p.src[0] + '–' + p.src[1]
          })
        );
        host.append(kepala, layar(p));
      }
    })),
    onPage(n) {
      $('catatan').innerHTML = CATATAN[n];
    }
  });

  // tombol Banding diselipkan ke bilah pembaca, supaya alat halaman berkumpul
  document.querySelector('.rdr__bar').append(tombolBanding);

  /* --- angka-angka, dihitung dari datanya sendiri ------------------------- */
  $('s-cetak').textContent = META.cetak;
  $('s-sama').textContent = META.sama;
  $('s-nomor').textContent = META.nomor;
  $('s-tulis').textContent = META.tulis;
  $('n-chr').textContent = META.chr34;
  $('k-chr').textContent = META.chr34 + '× CHR$(34)';

  const pct = (v) => (v * 100 / META.cetak).toFixed(0) + '%';
  $('tbl-drift').innerHTML =
    '<thead><tr><th>Nasib 115 baris tercetak</th><th></th></tr></thead><tbody>' +
    '<tr><td>Masih persis sama</td><td>' + META.sama + ' · ' + pct(META.sama) + '</td></tr>' +
    '<tr><td>Beda hanya target lompatannya</td><td>' + META.nomor + ' · ' + pct(META.nomor) + '</td></tr>' +
    '<tr><td>Benar-benar ditulis ulang</td><td>' + META.tulis + ' · ' + pct(META.tulis) + '</td></tr>' +
    '</tbody>';

  $('tbl-page').innerHTML =
    '<thead><tr><th>Hal</th><th>Disetel</th><th>Tampil</th></tr></thead><tbody>' +
    HAL.map(p =>
      '<tr><td>' + p.n + '</td><td>' +
      (p.bug ? '<code class="a-bad">PAGE=15</code>' :
               '<code>PAGE$=' + p.page.trim() + '</code>') +
      '</td><td>' + p.tampil.trim() + '</td></tr>').join('') +
    '</tbody>';

  /* Berapa baris layar yang benar-benar dipakai tiap halaman, dihitung dari
     lebar 80 kolom — bukan ditaksir. Listing mulai di baris layar ke-3. */
  const barisLayar = (p) => p.rows.reduce(
    (n, r) => n + Math.max(1, Math.ceil(r.t.length / 80)), 0);
  $('tbl-muat').innerHTML =
    '<thead><tr><th>Hal</th><th>Baris layar</th><th>Berakhir di</th></tr></thead><tbody>' +
    HAL.map(p => {
      const b = barisLayar(p), akhir = 2 + b;
      return '<tr><td>' + p.n + '</td><td>' + b + '</td><td' +
             (akhir >= 23 ? ' class="a-bad"' : '') + '>baris ' + akhir + '</td></tr>';
    }).join('') + '</tbody>';
})();
