/* ===========================================================================
   15puzzle.js — port dari 15PUZZLE.BAS
   (Dale Dewey, Victor NY, Copyright 1982, 117 baris).

   Penjelasan lengkap ada di ../../docs/15puzzle.md. Tiga hal yang menentukan
   bentuk kode ini:

   1. Papan disimpan sebagai satu array 16 elemen, bukan matriks 4x4. Aslinya
      memakai S(5,5) — dua dimensi dengan satu baris/kolom kelebihan. Array
      rata membuat pemeriksaan paritas (butir 2) jadi jauh lebih sederhana.

   2. Pengocokan aslinya BISA menghasilkan papan yang mustahil diselesaikan,
      dan itu terjadi pada separuh permainan. Di sini paritas diperiksa dan
      diperbaiki. Ini perbaikan bug, bukan selera — lihat `isSolvable`.

   3. Keadaan permainan adalah objek biasa; menggambar adalah fungsi dari
      keadaan itu. Ubin dibuat SEKALI lalu hanya digeser lewat `transform`,
      supaya CSS bisa menganimasikannya.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, rng, store, audio, input } = window.RETRO;
  const { el } = ui;
  const $ = (id) => document.getElementById(id);
  const SVGNS = 'http://www.w3.org/2000/svg';

  const N = 4;                 // papan 4x4
  const COUNT = N * N;         // 16 petak
  const BLANK = 0;             // nilai penanda kotak kosong
  const CELL = 90, GAP = 6, PAD = 12;

  const db = store('15puzzle');
  const random = rng();

  /* --------------------------------------------------------------------
     Keadaan.
     `tiles[i]` = angka yang menempati petak ke-i (0..15), 0 = kosong.
     Indeks petak: i = baris * 4 + kolom, dihitung dari kiri-atas.
     -------------------------------------------------------------------- */
  const state = {
    tiles: [],
    blank: COUNT - 1,
    moves: 0,
    phase: 'idle',            // 'idle' | 'playing' | 'won'
    // Timer baru berjalan pada gerakan PERTAMA, bukan saat papan diacak —
    // kalau tidak, waktu memandangi papan ikut terhitung.
    startedAt: null,
    elapsed: 0,               // milidetik
    picture: null,            // null = mode angka; selain itu id gambar
    showNum: true,
    bestTime: db.get('bestTime', null),    // {ms, moves, at}
    bestMoves: db.get('bestMoves', null)   // {moves, ms, at}
  };

  const solvedBoard = () => {
    const t = [];
    for (let i = 1; i < COUNT; i++) t.push(i);
    t.push(BLANK);
    return t;
  };

  /* --------------------------------------------------------------------
     PARITAS — inti dari perbaikan bug.

     Aslinya (baris 990–1060) mengisi papan begini:

         1000  ST(I)=INT(RND*16)+1
         1020  FOR J=1 TO I-1
         1030   IF ST(I)=ST(J) THEN 1000     ' sudah dipakai, ulangi
         1040  NEXT J

     Yaitu permutasi acak murni dari 16 angka. Masalahnya: 15-puzzle punya
     besaran yang KEKAL. Tiap geseran yang sah selalu mengubah dua hal
     sekaligus — jumlah inversi dan baris kotak kosong — sedemikian rupa
     sehingga jumlah keduanya selalu berubah genap. Artinya paritas
     (inversi + baris kosong dari bawah) TIDAK PERNAH berubah selama bermain.

     Akibatnya papan acak hanya bisa diselesaikan kalau paritasnya kebetulan
     sama dengan papan tujuan. Peluangnya tepat setengah.

     Program 1982 itu tidak memeriksanya, jadi separuh permainannya mustahil
     dimenangkan — dan tidak ada satu pun pesan yang memberi tahu pemain.
     -------------------------------------------------------------------- */
  function inversions(t) {
    const nums = t.filter(v => v !== BLANK);
    let inv = 0;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) inv++;
      }
    }
    return inv;
  }

  function isSolvable(t) {
    const blankRow = Math.floor(t.indexOf(BLANK) / N);   // 0 = baris teratas
    const rowFromBottom = N - blankRow;                  // 1 = baris terbawah
    // Untuk papan berlebar genap: bisa diselesaikan bila jumlahnya ganjil.
    // Papan tujuan: 0 inversi + baris kosong 1 dari bawah = 1 (ganjil).
    return (inversions(t) + rowFromBottom) % 2 === 1;
  }

  function shuffledBoard() {
    let t;
    do {
      t = solvedBoard();
      random.shuffle(t);
      if (!isSolvable(t)) {
        // Menukar dua ubin bukan-kosong mengubah jumlah inversi tepat satu
        // langkah ganjil, jadi paritasnya berbalik. Satu tukar sudah cukup;
        // tidak perlu mengocok ulang.
        const a = t.findIndex(v => v !== BLANK);
        const b = t.findIndex((v, i) => v !== BLANK && i > a);
        [t[a], t[b]] = [t[b], t[a]];
      }
    } while (isWon(t));        // jangan mulai dari papan yang sudah selesai
    return t;
  }

  /* --------------------------------------------------------------------
     Menang.

     Aslinya (baris 560–600):
         580 IF (I=4) AND (J=4) THEN WIN=1: RETURN
         590 IF S(I,J)<>J+(I-1)*4 THEN WIN=0: RETURN

     Perhatikan baris 580 tidak memeriksa apakah petak terakhir kosong — dan
     memang tidak perlu: kalau 1..15 semua di tempatnya, sisa satu-satunya
     pasti kotak kosong. Logika yang sama dipakai di sini.
     -------------------------------------------------------------------- */
  function isWon(t) {
    for (let i = 0; i < COUNT - 1; i++) {
      if (t[i] !== i + 1) return false;
    }
    return true;
  }

  /* --------------------------------------------------------------------
     Menggambar.
     -------------------------------------------------------------------- */
  const tileNodes = new Map();    // angka 1..15 -> elemen <g> ubin
  const sliceHosts = new Map();   // angka 1..15 -> <g> tempat potongan gambar

  function buildTiles() {
    const host = $('tiles');
    host.textContent = '';
    tileNodes.clear();
    sliceHosts.clear();

    const mk = (tag, attrs) => {
      const n = document.createElementNS(SVGNS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    };

    for (let v = 1; v < COUNT; v++) {
      const g = mk('g', { class: 'tile' });
      g.dataset.value = v;

      // Empat lapisan tetap. Semuanya ADA sejak awal dengan ukuran tetap —
      // hover hanya mengubah warna dan opacity, tidak pernah ukuran.
      // Kedalaman datang dari gradien + pita sorot, bukan dari <filter>:
      // lima belas filter yang berjalan bersamaan mahal, dan wilayahnya
      // dihitung ulang tiap kali ada yang berubah.
      const face  = mk('rect', { class: 'face', width: CELL, height: CELL, rx: 8 });
      const home  = mk('rect', { class: 'home', width: CELL, height: CELL, rx: 8 });

      // Potongan gambar. Selalu ada, tapi kosong di mode angka.
      //
      // Gambar digambar dalam ruang 402×402 yang sama dengan papan, jadi
      // potongan milik sebuah ubin cukup didapat dengan menggeser gambar itu
      // ke posisi RUMAH-nya yang berlawanan, lalu memotongnya sebesar ubin.
      //
      // DUA grup bersarang, dan itu perlu: kalau `clip-path` dan `transform`
      // dipasang pada elemen yang SAMA, keduanya diselesaikan di ruang
      // koordinat yang sama sehingga bidang potongnya ikut bergeser. Grup luar
      // memotong (tanpa transform), grup dalam menggeser.
      const slice = mk('g', { class: 'slice', 'clip-path': 'url(#tileClip)' });
      const shift = mk('g');
      const hi = v - 1;
      shift.setAttribute('transform',
        'translate(' + (-xOf(hi)) + ',' + (-yOf(hi)) + ')');
      slice.append(shift);
      sliceHosts.set(v, shift);

      const shine = mk('rect', { class: 'shine', x: 5, y: 5,
                                 width: CELL - 10, height: 20, rx: 5 });
      const hl    = mk('rect', { class: 'hl', width: CELL, height: CELL, rx: 8 });
      const txt   = mk('text', { class: 'num', x: CELL / 2, y: CELL / 2 + 2 });
      txt.textContent = v;
      const badge = mk('text', { class: 'badge-num', x: 9, y: 20 });
      badge.textContent = v;

      g.append(face, home, slice, shine, hl, txt, badge);
      g.addEventListener('click', () => tapTile(v));
      host.append(g);
      tileNodes.set(v, g);
    }
  }

  const xOf = (i) => PAD + (i % N) * (CELL + GAP);
  const yOf = (i) => PAD + Math.floor(i / N) * (CELL + GAP);

  /** Ubin bernomor v seharusnya menempati petak ke-(v−1). */
  const isHome = (v, i) => i === v - 1;

  function render() {
    let home = 0;

    state.tiles.forEach((v, i) => {
      if (v === BLANK) return;
      const g = tileNodes.get(v);
      const atHome = isHome(v, i);
      if (atHome) home++;

      g.setAttribute('transform', 'translate(' + xOf(i) + ',' + yOf(i) + ')');
      g.classList.toggle('is-home', atHome);
      g.classList.toggle('is-locked',
        state.phase !== 'playing' || !canMove(i));
      g.setAttribute('aria-label',
        'Ubin ' + v + (atHome ? ', sudah di tempatnya' : ''));
    });

    $('tiles').classList.toggle('is-won', state.phase === 'won');
    $('board').classList.toggle('is-won', state.phase === 'won');
    $('board').classList.toggle('has-picture', !!state.picture);
    $('board').classList.toggle('show-num', state.showNum);
    $('moves').textContent = state.moves;
    $('home').innerHTML = home + '<span class="faint">/15</span>';
    renderRecords();
  }

  function say(msg, win) {
    const n = $('status');
    n.textContent = msg || '';
    n.classList.toggle('is-win', !!win);
  }

  /* --------------------------------------------------------------------
     Waktu.

     Aslinya tidak ada jam sama sekali — GW-BASIC punya TIME$ dengan resolusi
     detik, tapi `15PUZZLE.BAS` hanya menghitung langkah (`PRINT USING "Move ####"`).
     Di sini waktu diukur dengan `performance.now()`, dan yang penting: timer
     baru berjalan pada gerakan PERTAMA, bukan saat papan diacak.
     -------------------------------------------------------------------- */
  function nowMs() {
    if (state.startedAt === null) return state.elapsed;
    return state.elapsed + (performance.now() - state.startedAt);
  }

  function fmtTime(ms) {
    if (ms === null || ms === undefined) return '—';
    const t = Math.max(0, ms) / 1000;
    const m = Math.floor(t / 60);
    const s = t - m * 60;
    return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1);
  }

  let clockTimer = 0;
  function startClock() {
    if (state.startedAt !== null) return;
    state.startedAt = performance.now();
    clearInterval(clockTimer);
    clockTimer = setInterval(() => {
      if (state.phase === 'playing') $('clock').textContent = fmtTime(nowMs());
    }, 100);
  }

  function stopClock() {
    if (state.startedAt !== null) {
      state.elapsed += performance.now() - state.startedAt;
      state.startedAt = null;
    }
    clearInterval(clockTimer);
    $('clock').textContent = fmtTime(state.elapsed);
  }

  function renderRecords() {
    const bt = state.bestTime, bm = state.bestMoves;
    $('bestTime').textContent = bt ? fmtTime(bt.ms) : '—';
    $('bestTimeSub').textContent = bt ? bt.moves + ' langkah' : '';
    $('bestMoves').textContent = bm ? bm.moves : '—';
    $('bestMovesSub').textContent = bm ? fmtTime(bm.ms) : '';
  }

  /* --------------------------------------------------------------------
     Gerakan.

     Aslinya, tombol panah menggerakkan KOTAK KOSONG ke arah itu:
         390 IF Q=72 AND YZ>1 THEN X0=XZ: Y0=YZ-1: GOTO 440   ' panah atas
     YZ,XZ adalah posisi kosong; Y0,X0 jadi ubin yang akan bertukar dengannya.
     Semantik itu dipertahankan.
     -------------------------------------------------------------------- */
  function canMove(i) {
    const b = state.blank;
    const sameRow = Math.floor(i / N) === Math.floor(b / N);
    const sameCol = i % N === b % N;
    return (sameRow && Math.abs(i - b) === 1) ||
           (sameCol && Math.abs(i - b) === N);
  }

  function moveTileAt(i) {
    if (state.phase !== 'playing' || !canMove(i)) return false;
    startClock();                    // jam mulai pada gerakan pertama
    const b = state.blank;
    [state.tiles[i], state.tiles[b]] = [state.tiles[b], state.tiles[i]];
    state.blank = i;
    state.moves++;
    // Baris 1180: PLAY "L16ac" — dua not pendek tiap kali ubin bergerak.
    audio.play('MB T220 L16 a c', { fresh: true });
    if (isWon(state.tiles)) return win(), true;
    render();
    return true;
  }

  function tapTile(v) {
    const i = state.tiles.indexOf(v);
    if (!moveTileAt(i)) illegal();
  }

  /** Panah menggeser kotak kosong. dr/dc dalam satuan petak. */
  function moveBlank(dr, dc) {
    const b = state.blank;
    const r = Math.floor(b / N) + dr;
    const c = (b % N) + dc;
    if (r < 0 || r >= N || c < 0 || c >= N) return illegal();
    if (!moveTileAt(r * N + c)) illegal();
  }

  let illegalTimer = 0;
  function illegal() {
    // Baris 610: "Illegal Move!!" lalu FOR I=1 TO 2000: NEXT — jeda yang
    // panjangnya bergantung kecepatan CPU. Di sini 900 ms yang pasti.
    say('Illegal Move!!');
    audio.sound(160, 2);
    clearTimeout(illegalTimer);
    illegalTimer = setTimeout(() => {
      if (state.phase === 'playing') say('');
    }, 900);
  }

  function win() {
    state.phase = 'won';
    stopClock();

    // Dua rekor yang berdiri sendiri, masing-masing diperiksa terpisah.
    // Satu permainan bisa memecahkan keduanya, salah satu, atau tidak sama
    // sekali — dan itu memang tujuannya: mengejar waktu dan mengejar langkah
    // menuntut cara bermain yang berbeda.
    const run = { ms: Math.round(state.elapsed), moves: state.moves,
                  at: Date.now() };
    const broke = [];

    if (!state.bestTime || run.ms < state.bestTime.ms) {
      state.bestTime = run;
      db.set('bestTime', run);
      broke.push('waktu tercepat');
    }
    if (!state.bestMoves || run.moves < state.bestMoves.moves) {
      state.bestMoves = run;
      db.set('bestMoves', run);
      broke.push('langkah tersedikit');
    }

    const summary = state.moves + ' langkah dalam ' + fmtTime(run.ms);
    say('You have WON!  ' + summary +
        (broke.length ? '  — rekor baru: ' + broke.join(' & ') + '!' : ''), true);

    render();
    audio.resetPlayState();
    audio.play('MB T160 O2 L8 c e g O3 c4 O2 g8 O3 c2');
  }

  /* --------------------------------------------------------------------
     Memulai.
     -------------------------------------------------------------------- */
  function newGame() {
    state.tiles = shuffledBoard();
    state.blank = state.tiles.indexOf(BLANK);
    state.moves = 0;
    state.phase = 'playing';
    state.startedAt = null;
    state.elapsed = 0;
    clearInterval(clockTimer);
    $('clock').textContent = '0:00';
    say('Jam mulai berjalan pada gerakan pertama.');
    render();
    // Baris 1050: SOUND ST(I)*100, 0.75 — satu nada per ubin saat mengocok.
    state.tiles.forEach((v, i) => {
      if (v !== BLANK) setTimeout(() => audio.sound(v * 100, 0.6), i * 34);
    });
  }

  function showSolved() {
    state.tiles = solvedBoard();
    state.blank = COUNT - 1;
    state.phase = 'idle';
    state.moves = 0;
    state.startedAt = null;
    state.elapsed = 0;
    clearInterval(clockTimer);
    $('clock').textContent = '0:00';
    say('Papan tujuan. Tekan "Acak lagi" untuk mulai.');
    render();
  }

  /* --------------------------------------------------------------------
     Mode gambar.

     Gambar bawaan adalah SVG yang digambar tangan (lihat pictures.js).
     Gambar milik pemakai dibaca lewat FileReader jadi data URL — cara ini
     bekerja dari file:// karena tidak melewati jaringan sama sekali, berbeda
     dengan fetch() yang diblokir. Berkasnya tidak pernah meninggalkan
     komputer Anda.
     -------------------------------------------------------------------- */
  const PICS = window.RETRO.PUZZLE_PICTURES || [];

  function setPicture(id, dataUrl, label) {
    state.picture = id;
    const defs = $('picture-def');
    defs.innerHTML = '';

    if (id) {
      const wrap = document.createElementNS(SVGNS, 'g');
      wrap.setAttribute('id', 'pic-art');
      if (dataUrl) {
        // Gambar pemakai: dipaksa memenuhi bujur sangkar papan.
        const img = document.createElementNS(SVGNS, 'image');
        img.setAttribute('href', dataUrl);
        img.setAttribute('x', 0); img.setAttribute('y', 0);
        img.setAttribute('width', 402); img.setAttribute('height', 402);
        img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        wrap.append(img);
      } else {
        const pic = PICS.find(p => p.id === id);
        wrap.innerHTML = pic ? pic.svg : '';
      }
      defs.append(wrap);
    }

    // Tiap ubin merujuk definisi yang sama lewat <use> — satu gambar,
    // lima belas potongan.
    sliceHosts.forEach(host => {
      host.textContent = '';
      if (!id) return;
      const use = document.createElementNS(SVGNS, 'use');
      use.setAttribute('href', '#pic-art');
      host.append(use);
    });

    document.querySelectorAll('#modes .chip').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.pic === (id || '')));
    });
    $('ownPicName').textContent = label || 'JPG/PNG dari komputer Anda';
    render();
  }

  /* --------------------------------------------------------------------
     Pemasangan antarmuka.
     -------------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: 'The 15 Puzzle',
    source: '15PUZZLE.BAS · Dale Dewey · 1982',
    backHref: '../../index.html'
  }));

  buildTiles();
  setPicture(null);
  showSolved();

  const kb = input();
  kb.captureScroll(true);
  const ARROWS = {
    ArrowUp:    [-1, 0], ArrowDown:  [1, 0],
    ArrowLeft:  [0, -1], ArrowRight: [0, 1]
  };
  kb.on('*', e => {
    if (state.phase !== 'playing') return;
    const d = ARROWS[e.key];
    if (d) moveBlank(d[0], d[1]);
    // Baris 360: IF ANS$="Q" OR ANS$="q" THEN 630 — keluar.
    if (e.key === 'q' || e.key === 'Q') location.href = '../../index.html';
  });

  $('shuffle').addEventListener('click', newGame);
  $('solve').addEventListener('click', showSolved);

  $('resetBest').addEventListener('click', async () => {
    if (!state.bestTime && !state.bestMoves) {
      return ui.toast('Belum ada rekor untuk dihapus.');
    }
    const parts = [];
    if (state.bestTime) parts.push('tercepat <strong>' + fmtTime(state.bestTime.ms) + '</strong>');
    if (state.bestMoves) parts.push('tersedikit <strong>' + state.bestMoves.moves + ' langkah</strong>');
    const yes = await ui.confirmYesNo('Reset kedua rekor?',
      parts.join(' dan ') + ' akan dihapus. ' +
      'Permainan yang sedang berjalan tidak diubah.');
    if (!yes) return;
    state.bestTime = null;
    state.bestMoves = null;
    db.remove('bestTime');
    db.remove('bestMoves');
    ui.toast('Kedua rekor dihapus.');
    render();
  });

  // --- pemilih tampilan ubin ---
  const modes = $('modes');
  const addChip = (id, label, title) => {
    const b = el('button', { class: 'chip', type: 'button', text: label,
                             title: title || '', 'aria-pressed': 'false' });
    b.dataset.pic = id;
    b.addEventListener('click', () => setPicture(id || null));
    modes.append(b);
  };
  addChip('', 'Angka', 'Tampilan asli 1982');
  PICS.forEach(p => addChip(p.id, p.name, p.hint));
  // Chip baru ada SEKARANG, sementara setPicture() pertama dipanggil sebelum
  // ini — jadi tandai ulang mana yang aktif.
  setPicture(state.picture);

  $('ownPicBtn').addEventListener('click', () => $('ownPic').click());
  $('ownPic').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPicture('own', reader.result, f.name);
    reader.onerror = () => ui.toast('Gambar tidak bisa dibaca.');
    reader.readAsDataURL(f);
  });

  $('showNum').addEventListener('change', e => {
    state.showNum = e.target.checked;
    render();
  });

  newGame();
})();
