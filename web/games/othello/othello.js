/* ===========================================================================
   othello.js — port dari OTHELLO.BAS
   (versi PET, diadaptasi ke IBM PC oleh Patrick Leabo, Tucson Arizona, 3-82).

   Program ini dikirim ke dunia dengan pengakuan di baris komentarnya sendiri:

       1025 REM NOT DONE YET BUT HAVE FUN -- PLEASE ADD A GOOD ALGORITHM TO IT

   Sebelas tahun sebelum istilah "open source" ada, seseorang menuliskan
   permintaan terbuka supaya siapa pun yang menemukan berkas ini menulis AI
   yang lebih baik. Itu bagian paling berharga dari seluruh program.

   ------------------------------------------------------------------------
   PAPAN 10x10 UNTUK PERMAINAN 8x8

       1080 DIM A(9,9)

   `A(9,9)` berarti indeks 0..9 di kedua arah — sepuluh kali sepuluh. Papan
   sesungguhnya cuma 1..8; satu cincin di sekelilingnya tidak pernah diisi
   dan tetap bernilai nol.

   Itu penting saat menghitung bidak yang terkepung. Rutin di baris 2780
   berjalan lurus ke satu arah sampai menemukan bidak sendiri:

       2800 IF A(I6,J6)<>T2 THEN 2910      ' bukan bidak lawan -> berhenti
       2820 IF A(I6,J6)=T1 THEN 2850       ' bidak sendiri -> terkepung
       2830 IF A(I6,J6)=Z0 THEN 2910       ' kosong -> batal

   Berjalan keluar papan akan membaca sel pagar, yang bernilai nol, dan
   baris 2830 membatalkannya. Tidak ada satu pun pemeriksaan tepi.

   Ini teknik yang sama dengan TICTAC (pagar bernilai 3 di larik 5x5) dan
   PEGLEAP (kisi sembilan kolom). Empat program di koleksi ini menghadapi
   masalah "apa yang terjadi di tepi", dan tiga menyelesaikannya dengan pagar.

   ------------------------------------------------------------------------
   AI-NYA: SATU LANGKAH KE DEPAN

   Tiap kotak kosong dinilai dengan jumlah bidak yang terbalik, ditambah bobot
   menurut letaknya (baris 1690-1740):

       baris/kolom 1 atau 8  ->  +2    tepi, kuat
       baris/kolom 2 atau 7  ->  -2    sebelah tepi, membuka jalan ke sudut
       baris/kolom 3 atau 6  ->  +1    dalam

   Bobotnya benar secara strategi. Yang tidak ada: penelusuran. AI ini tidak
   pernah membayangkan jawaban lawan, bahkan satu langkah pun.

   Seri dipecah dengan lemparan koin (baris 1770), jadi ia tidak selalu
   memainkan langkah yang sama pada posisi yang sama.

   Satu perilaku yang mudah terlewat: kalau tidak ada langkah dengan nilai
   positif, bobot hukuman -2 DIBUANG dan pencarian diulang (baris 1810-1830).
   Jadi program lebih memilih langkah yang buruk daripada melewatkan giliran.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, rng, store, wait } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const EMPTY = 0, HUMAN = -1, ROBOT = 1;   // baris 1350: B=-1, W=1
  const W = 10;                             // lebar larik: 8 papan + 2 pagar
  const at = (r, c) => r * W + c;           // baris 1..8, kolom 1..8

  /* Baris 3290: DATA 0,1,-1,1,-1,0,-1,-1,0,-1,1,-1,1,0,1,1 */
  const DIRS = [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]];

  const r = rng();
  const db = store('othello');
  let board, turn, win, phase, expert = true, useWindow = true;

  /* Bobot posisi, baris 1690-1740. Ditulis sebagai fungsi supaya peta bobot
     di panel kanan dan penilaian AI memakai sumber yang sama. */
  function weight(i, j) {
    if (!expert) return 0;
    let s = 0;
    [i, j].forEach(v => {
      if (v === 1 || v === 8) s += 2;        // S2
      else if (v === 2 || v === 7) s -= 2;   // S5
      else if (v === 3 || v === 6) s += 1;   // S4
    });
    return s;
  }

  function reset() {
    board = new Int8Array(W * W);            // pagar ikut nol, dan tetap nol
    board[at(4, 4)] = ROBOT; board[at(5, 5)] = ROBOT;
    board[at(4, 5)] = HUMAN; board[at(5, 4)] = HUMAN;
    win = { yl: 3, yh: 6, xl: 3, xh: 6 };    // baris 1070
    turn = HUMAN; phase = 'play';
    draw();
    say('Giliran Anda. Kotak bertanda bisa dimainkan.');
  }

  /* --------------------------------------------------------------------
     Aturan. Berjalan lurus ke delapan arah sampai bertemu bidak sendiri;
     kalau di tengah jalan ada sel kosong atau pagar (keduanya nol), batal.
     -------------------------------------------------------------------- */
  function flips(i, j, me) {
    if (board[at(i, j)] !== EMPTY) return [];
    const foe = -me, out = [];
    for (const [di, dj] of DIRS) {
      const run = [];
      let y = i + di, x = j + dj;
      while (board[at(y, x)] === foe) { run.push(at(y, x)); y += di; x += dj; }
      if (run.length && board[at(y, x)] === me) out.push.apply(out, run);
    }
    return out;
  }

  const legal = (me) => {
    const out = [];
    for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) {
      const f = flips(i, j, me);
      if (f.length) out.push({ i, j, f });
    }
    return out;
  };

  function grow(i, j) {                      // baris 2940-2970
    if (i === win.yl) win.yl = Math.max(1, win.yl - 1);
    if (i === win.yh) win.yh = Math.min(8, win.yh + 1);
    if (j === win.xl) win.xl = Math.max(1, win.xl - 1);
    if (j === win.xh) win.xh = Math.min(8, win.xh + 1);
  }

  function place(m, me) {
    board[at(m.i, m.j)] = me;
    m.f.forEach(k => { board[k] = me; });
    grow(m.i, m.j);
    audio.play('MB T240 O3 L32 ' + (me === HUMAN ? 'g' : 'c'), { fresh: true });
  }

  /* --------------------------------------------------------------------
     AI, baris 1600-1830.

     `drop` = apakah hukuman -2 sudah dibuang. Kalau tidak ada langkah
     bernilai positif, program aslinya mengulang pencarian tanpa hukuman
     itu — lebih baik langkah buruk daripada melewatkan giliran.
     -------------------------------------------------------------------- */
  function think() {
    for (let drop = 0; drop < 2; drop++) {
      let best = null, bs = -Infinity;
      const lo = useWindow ? win : { yl: 1, yh: 8, xl: 1, xh: 8 };
      for (let i = lo.yl; i <= lo.yh; i++) {
        for (let j = lo.xl; j <= lo.xh; j++) {
          const f = flips(i, j, ROBOT);
          if (!f.length) continue;
          let s = f.length + weight(i, j);
          if (drop) s = f.length + Math.max(0, weight(i, j));
          if (s < bs) continue;
          // baris 1770: seri dipecah dengan lemparan koin
          if (s === bs && r.next() > 0.5) continue;
          bs = s; best = { i, j, f, score: s };
        }
      }
      if (best && bs > 0) return best;
      if (best && drop) return best;
    }
    return null;
  }

  /* --------------------------------------------------------------------
     Tampilan
     -------------------------------------------------------------------- */
  const boardEl = ui.el('div', { class: 'o-board' });
  $('board').append(boardEl);
  let lastMove = null;

  function draw() {
    const moves = phase === 'play' && turn === HUMAN ? legal(HUMAN) : [];
    boardEl.textContent = '';
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        const v = board[at(i, j)];
        const ok = moves.some(m => m.i === i && m.j === j);
        const inWin = useWindow && i >= win.yl && i <= win.yh && j >= win.xl && j <= win.xh;
        const sq = ui.el('div', {
          class: 'o-sq' + (ok ? ' o-sq--ok' : '') + (inWin ? ' o-sq--win' : ''),
          title: 'baris ' + i + ', kolom ' + j
        });
        if (v !== EMPTY) {
          const p = ui.el('div', { class: 'o-p o-p--' + (v === HUMAN ? 'b' : 'w') });
          if (lastMove && lastMove.i === i && lastMove.j === j) p.classList.add('o-p--new');
          else if (lastMove && lastMove.f.includes(at(i, j))) p.classList.add('o-p--flip');
          sq.append(p);
        }
        if (ok) sq.addEventListener('click', () => human(i, j));
        boardEl.append(sq);
      }
    }
    const b = count(HUMAN), w = count(ROBOT);
    $('sB').textContent = b; $('sW').textContent = w;
    document.querySelector('.o-score--b').classList.toggle('is-turn', turn === HUMAN && phase === 'play');
    document.querySelector('.o-score--w').classList.toggle('is-turn', turn === ROBOT && phase === 'play');
    $('win').textContent = win.yl + '–' + win.yh + ' × ' + win.xl + '–' + win.xh;
    $('winPct').textContent =
      Math.round((win.yh - win.yl + 1) * (win.xh - win.xl + 1) / 64 * 100) + '%';
    $('pass').disabled = !(phase === 'play' && turn === HUMAN && moves.length === 0);
    drawWeights();
  }

  const count = (me) => {
    let n = 0;
    for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) if (board[at(i, j)] === me) n++;
    return n;
  };

  function drawWeights() {
    const host = $('weights');
    host.textContent = '';
    for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) {
      const w = weight(i, j);
      host.append(ui.el('div', {
        class: 'o-w' + (w > 0 ? ' o-w--plus' : w < 0 ? ' o-w--minus' : ''),
        text: w > 0 ? '+' + w : String(w)
      }));
    }
  }

  function say(t, kind) {
    $('say').textContent = t;
    $('say').className = 'o-say' + (kind ? ' o-say--' + kind : '');
  }

  /* --------------------------------------------------------------------
     Alur giliran
     -------------------------------------------------------------------- */
  function human(i, j) {
    if (phase !== 'play' || turn !== HUMAN) return;
    const f = flips(i, j, HUMAN);
    if (!f.length) return;
    lastMove = { i, j, f };
    place(lastMove, HUMAN);
    turn = ROBOT;
    draw();
    setTimeout(robot, 380);
  }

  async function robot() {
    if (phase !== 'play') return;
    if (!legal(ROBOT).length) {
      if (!legal(HUMAN).length) return finish();
      turn = HUMAN; lastMove = null; draw();
      return say('IBM PC tidak punya langkah. Giliran Anda lagi.', 'bad');
    }
    say('OK, I AM THINKING!');
    await wait(320);
    const m = think();
    if (!m) { turn = HUMAN; draw(); return say('IBM PC melewatkan giliran.', 'bad'); }
    lastMove = m;
    place(m, ROBOT);
    turn = HUMAN;
    draw();
    if (!legal(HUMAN).length) {
      if (!legal(ROBOT).length) return finish();
      say('Anda tidak punya langkah — tekan "Lewati giliran".', 'bad');
    } else say('Giliran Anda. Kotak bertanda bisa dimainkan.');
  }

  function finish() {
    phase = 'over';
    lastMove = null;
    draw();
    const b = count(HUMAN), w = count(ROBOT);
    say(b > w ? 'Anda menang, ' + b + '–' + w
      : w > b ? 'IBM PC menang, ' + w + '–' + b
      : 'Seri, ' + b + '–' + w);
    const rec = db.get('rec', { win: 0, lose: 0, draw: 0 });
    if (b > w) rec.win++; else if (w > b) rec.lose++; else rec.draw++;
    db.set('rec', rec);
    audio.play(b >= w ? 'MB T170 O2 L8 c e g O3 L4 c'
                      : 'MB T110 O3 L8 c O2 L8 a f L2 d', { fresh: true });
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Othello',
    source: 'OTHELLO.BAS · Patrick Leabo · 1982',
    backHref: '../../index.html'
  }));

  $('restart').addEventListener('click', () => { lastMove = null; reset(); });
  $('pass').addEventListener('click', () => {
    if (phase !== 'play' || turn !== HUMAN) return;
    turn = ROBOT; lastMove = null; draw(); setTimeout(robot, 200);
  });
  $('expert').addEventListener('change', e => { expert = e.target.checked; draw(); });
  $('window').addEventListener('change', e => { useWindow = e.target.checked; draw(); });

  reset();
})();
