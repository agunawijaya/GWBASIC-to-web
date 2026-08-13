/* ===========================================================================
   life2.js — port dari LIFE2.BAS (John Sigle, 21 Februari 1983).

   Game of Life karya Conway. Aturannya empat baris dan semua orang tahu; yang
   membuat program ini layak dibaca adalah CARA ia menghitungnya.

   ------------------------------------------------------------------------
   ALGORITMA DAFTAR SEL HIDUP

   Cara paling lurus menghitung satu generasi adalah memindai seluruh papan:
   21 x 78 = 1638 sel, tiap generasi, selamanya. Di 4,77 MHz itu terasa —
   dan papan yang isinya cuma satu glider berlima tetap membayar penuh.

   LIFE2 tidak begitu. Ia menyimpan DAFTAR sel yang hidup:

       58  DIM CLIST(1,1500,1), LLEN(1)

   dan menghitung generasi berikutnya dengan hanya menyentuh sel-sel di daftar
   itu beserta kedelapan tetangganya (baris 4012-4060). Papan kosong tidak
   menghabiskan waktu sama sekali.

   Biayanya sebanding dengan POPULASI, bukan dengan LUAS PAPAN. Untuk Life itu
   pilihan yang sangat tepat, karena Life hampir selalu jarang: pola yang
   menarik menempati beberapa persen papan, bukan setengahnya.

   Yang membuatnya bekerja adalah menyimpan dua bentuk dari data yang sama:

       G(baris, kolom, generasi)  — papan penuh, untuk bertanya "sel ini hidup?"
                                    dalam satu langkah
       CLIST(...)                 — daftar, untuk bisa MENGULANGI yang hidup
                                    tanpa memindai

   Larik menjawab "apakah ada", daftar menjawab "yang mana saja". Keduanya
   dipelihara berdampingan. Itu persis pola `Set` + `Array` yang masih dipakai
   sekarang, ditulis tahun 1983 dengan bahan seadanya.

   ------------------------------------------------------------------------
   DUA PAPAN YANG BERTUKAR PERAN

       55  DIM G(NROWS+1,NCOLS+1,1)
       376 SWAP CUR,NXT

   Dimensi ketiga berukuran dua. `CUR` dan `NXT` cuma dua angka (0 dan 1), dan
   berganti generasi berarti menukarnya — tidak ada satu pun sel yang disalin.
   Namanya double buffering, dan kartu grafis Anda memakainya sekarang untuk
   alasan yang sama.

   ------------------------------------------------------------------------
   YANG DIUBAH DI SINI

   Papan aslinya TIDAK melingkar: `G` diberi satu baris dan satu kolom lebih
   (NROWS+1, NCOLS+1) sebagai pagar yang selalu nol, jadi tetangga di luar
   papan terbaca mati. Itu trik yang sama dengan TICTAC. Dipertahankan.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const ROWS = 21, COLS = 78;              // baris 53: NROWS=21 : NCOLS=78
  const AREA = ROWS * COLS;                // 1638

  /* Papan disimpan sebagai satu larik lurus dengan PAGAR di keempat sisinya —
     lebar (COLS+2), tinggi (ROWS+2). Sama seperti `G(NROWS+1,NCOLS+1,·)` di
     aslinya, dan sama seperti papan 5x5 di TICTAC: tetangga di luar papan
     selalu terbaca mati, jadi tidak ada satu pun pengecekan tepi. */
  const W = COLS + 2;
  const idx = (r, c) => (r + 1) * W + (c + 1);
  const NEIGH = [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1];

  let alive = new Uint8Array(W * (ROWS + 2));
  let list = [];                           // padanan CLIST: indeks sel hidup
  let gen = 0, visited = 0;

  /* --- papan di layar --- */
  const cellNodes = new Array(AREA);
  (function build() {
    const grid = $('grid');
    const frag = document.createDocumentFragment();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const d = ui.el('div', { class: 'l-c' });
        d.dataset.r = r; d.dataset.c = c;
        cellNodes[r * COLS + c] = d;
        frag.append(d);
      }
    }
    grid.append(frag);
  })();

  const nodeAt = (r, c) => cellNodes[r * COLS + c];

  function setCell(r, c, on) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const i = idx(r, c);
    if (!!alive[i] === !!on) return;
    alive[i] = on ? 1 : 0;
    nodeAt(r, c).classList.toggle('is-on', !!on);
    if (on) list.push(i);
    else list = list.filter(x => x !== i);
  }

  /* --------------------------------------------------------------------
     Satu generasi.

     Yang dikerjakan persis seperti baris 4012-4060: untuk tiap sel hidup,
     periksa dirinya sendiri DAN kedelapan tetangganya. Sel mati yang tidak
     bertetangga dengan sel hidup mana pun tidak pernah disentuh — dan itulah
     seluruh penghematannya.

     Bedanya satu: aslinya memakai penanda di larik `G` untuk mencegah sebuah
     sel diperiksa dua kali (baris 4200). Di sini dipakai `Set`, yang tidak
     ada di BASIC.
     -------------------------------------------------------------------- */
  function stepGen() {
    const candidates = new Set();
    list.forEach(i => {
      candidates.add(i);
      NEIGH.forEach(d => candidates.add(i + d));
    });
    visited = candidates.size;

    const born = [], died = [];
    candidates.forEach(i => {
      let n = 0;
      for (const d of NEIGH) n += alive[i + d];
      const on = alive[i] === 1;
      if (on && n !== 2 && n !== 3) died.push(i);
      else if (!on && n === 3) born.push(i);
    });

    // Perubahan diterapkan SETELAH semuanya dihitung — padanan CUR/NXT.
    died.forEach(i => { alive[i] = 0; });
    born.forEach(i => { alive[i] = 1; });

    /* Daftar dibangun ulang dari yang sudah ada, bukan dengan memindai papan.
       Kalau memindai, seluruh keuntungannya hilang di sini. */
    list = list.filter(i => alive[i] === 1).concat(born);

    // Hanya sel yang BERUBAH yang disentuh di DOM.
    const paint = (i, on) => {
      const r = Math.floor(i / W) - 1, c = (i % W) - 1;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) nodeAt(r, c).classList.toggle('is-on', on);
    };
    died.forEach(i => paint(i, false));
    born.forEach(i => paint(i, true));

    gen++;
    showStats();
    return born.length + died.length;      // 0 = pola sudah diam
  }

  function showStats() {
    $('sGen').textContent = gen;
    $('sPop').textContent = list.length;
    $('sVisit').textContent = visited;
    $('barVisit').style.width = Math.min(100, visited / AREA * 100) + '%';
    $('barVisitN').textContent = visited;
    $('ratio').textContent = visited === 0
      ? 'Gambar sesuatu untuk melihat perbandingannya.'
      : 'Generasi ini memeriksa ' + visited + ' sel dari 1638 — '
        + (AREA / visited).toFixed(1) + '× lebih sedikit daripada pindai penuh.';
  }

  function clearAll() {
    stop();
    alive = new Uint8Array(W * (ROWS + 2));
    list = [];
    gen = 0; visited = 0;
    cellNodes.forEach(n => n.classList.remove('is-on'));
    showStats();
  }

  /* --------------------------------------------------------------------
     Menjalankan
     -------------------------------------------------------------------- */
  let timer = 0, running = false;

  function tick() {
    const changed = stepGen();
    if (changed === 0) {                   // pola beku: berhenti sendiri
      stop();
      ui.toast('Pola berhenti berubah pada generasi ' + gen + '.');
      return;
    }
    audio.sound(700, 0.1);                 // baris 378: SOUND 700,.1
    timer = setTimeout(tick, 1000 / Number($('speed').value));
  }

  function start() {
    if (running || !list.length) return;
    running = true;
    $('run').textContent = 'Jeda';
    tick();
  }

  function stop() {
    running = false;
    clearTimeout(timer);
    $('run').textContent = 'Jalankan';
  }

  /* --------------------------------------------------------------------
     Menggambar
     -------------------------------------------------------------------- */
  let painting = false, paintOn = true;

  $('grid').addEventListener('pointerdown', e => {
    const t = e.target.closest('.l-c');
    if (!t) return;
    e.preventDefault();
    stop();
    const r = +t.dataset.r, c = +t.dataset.c;
    paintOn = alive[idx(r, c)] !== 1;      // seret menyalakan atau memadamkan
    painting = true;
    setCell(r, c, paintOn);
    showStats();
  });
  $('grid').addEventListener('pointerover', e => {
    if (!painting) return;
    const t = e.target.closest('.l-c');
    if (!t) return;
    setCell(+t.dataset.r, +t.dataset.c, paintOn);
    showStats();
  });
  window.addEventListener('pointerup', () => { painting = false; });

  /* Kursor papan ketik, persis seperti baris 2050-2078:
     panah menggerakkan, M menyalakan, spasi memadamkan. */
  let cr = 10, cc = 39;                    // baris 2022: RN=11 : CN=39
  function showCursor() {
    cellNodes.forEach(n => n.classList.remove('is-cursor'));
    nodeAt(cr, cc).classList.add('is-cursor');
  }

  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const k = e.key;
    if (k === 'ArrowUp')    { e.preventDefault(); cr = Math.max(0, cr - 1); }
    else if (k === 'ArrowDown')  { e.preventDefault(); cr = Math.min(ROWS - 1, cr + 1); }
    else if (k === 'ArrowLeft')  { e.preventDefault(); cc = Math.max(0, cc - 1); }
    else if (k === 'ArrowRight') { e.preventDefault(); cc = Math.min(COLS - 1, cc + 1); }
    else if (k === 'm' || k === 'M') { setCell(cr, cc, true); showStats(); }
    else if (k === ' ') { e.preventDefault(); setCell(cr, cc, false); showStats(); }
    else if (k === 'r' || k === 'R') { running ? stop() : start(); }
    else if (k === 'c' || k === 'C') { clearAll(); }
    else return;
    showCursor();
  });

  /* --------------------------------------------------------------------
     Pola siap pakai.

     Aslinya tidak punya ini — pemain menggambar semuanya sendiri. Ditambahkan
     karena Life tanpa contoh pola sulit dimasuki: tebakan acak hampir selalu
     mati dalam beberapa generasi, dan orang menyimpulkan programnya rusak.
     -------------------------------------------------------------------- */
  const PRESETS = [
    { name: 'Glider', cells: [[0,1],[1,2],[2,0],[2,1],[2,2]], at: [2, 3] },
    { name: 'Blinker', cells: [[0,0],[0,1],[0,2]], at: [10, 20] },
    { name: 'Kodok', cells: [[0,1],[0,2],[0,3],[1,0],[1,1],[1,2]], at: [10, 34] },
    { name: 'Pentomino R', cells: [[0,1],[0,2],[1,0],[1,1],[2,1]], at: [9, 38] },
    { name: 'Meriam glider', at: [4, 6], cells: [
      [4,0],[4,1],[5,0],[5,1],[4,10],[5,10],[6,10],[3,11],[7,11],[2,12],[8,12],
      [2,13],[8,13],[5,14],[3,15],[7,15],[4,16],[5,16],[6,16],[5,17],
      [2,20],[3,20],[4,20],[2,21],[3,21],[4,21],[1,22],[5,22],
      [0,24],[1,24],[5,24],[6,24],[2,34],[3,34],[2,35],[3,35] ] }
  ];

  PRESETS.forEach(p => {
    const b = ui.el('button', { class: 'btn btn--ghost btn--sm', type: 'button',
                                text: p.name });
    b.addEventListener('click', () => {
      clearAll();
      p.cells.forEach(([r, c]) => setCell(p.at[0] + r, p.at[1] + c, true));
      showStats();
    });
    $('presets').append(b);
  });

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Game of Life',
    source: 'LIFE2.BAS · John Sigle · 1983',
    backHref: '../../index.html'
  }));

  $('run').addEventListener('click', () => { running ? stop() : start(); });
  $('step').addEventListener('click', () => { stop(); if (list.length) stepGen(); });
  $('clear').addEventListener('click', clearAll);

  showCursor();
  showStats();
})();
