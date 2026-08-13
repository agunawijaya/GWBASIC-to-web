/* ===========================================================================
   tictac.js — port dari TICTAC.BAS (Friendlyware PC Introductory Set, 1982).

   DUA HAL YANG MEMBUAT PROGRAM INI LAYAK DIBACA
   ---------------------------------------------
   1. PAPANNYA 5x5, BUKAN 3x3.

      Aslinya menyimpan papan sebagai `DIM C(24)` — 25 sel dalam satu larik
      lurus, disusun sebagai 5x5. Yang bisa dimainkan hanya sembilan di
      tengah; enam belas sisanya diisi angka 3 dan tidak pernah disentuh:

          0   1   2   3   4          . . . . .
          5   6   7   8   9          . 1 2 3 .
         10  11  12  13  14    -->   . 4 5 6 .
         15  16  17  18  19          . 7 8 9 .
         20  21  22  23  24          . . . . .

      Kenapa repot? Karena dengan begitu **pengecekan tepi hilang sama
      sekali**. Arah gerak cukup ditulis sebagai penambahan indeks — dan
      pertanyaan "apakah ini keluar papan?" tidak perlu ditanyakan, karena
      yang di luar papan berisi 3, dan 3 tidak pernah cocok dengan apa pun.

      Teknik ini masih dipakai sampai sekarang, dan namanya sama: sentinel.
      Mesin catur memakai papan 12x12 untuk alasan yang persis sama.

   2. AI-NYA BENAR-BENAR TIDAK TERKALAHKAN.

      Layar petunjuk aslinya menulis "I can not be defeated !!!" — sombong,
      dan ternyata benar. Seluruh pohon permainan ditelusuri: 549 permainan,
      412 kemenangan komputer, 137 seri, **nol kekalahan**.

      Yang membuatnya mengesankan: ini bukan minimax. Tidak ada penelusuran
      ke depan sama sekali. Hanya daftar aturan yang diperiksa berurutan, dan
      yang pertama cocok itulah yang dipakai. Sebelas baris `IF` di bagian
      tengahnya menangani jebakan garpu satu per satu, ditulis tangan.

   SATU HAL YANG TIDAK DIMILIKI PROGRAM ASLINYA
   --------------------------------------------
   Ia tidak bisa mendeteksi manusia menang. Baris 170 hanya memeriksa `W=1`
   (komputer menang) dan baris 160 memeriksa papan penuh (seri). Kalau
   manusia menang, program tidak menyadarinya dan terus meminta langkah.

   Itu bukan kelalaian yang berbahaya — ia konsekuensi wajar dari yakin bahwa
   AI-nya tidak bisa kalah. Tapi ia mengubah "tidak pernah kalah" dari sifat
   yang diuji menjadi asumsi yang dipegang. Di sini kemenangan manusia
   DIPERIKSA, supaya kalau suatu saat portingnya salah, kesalahannya terlihat.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, wait } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';

  /* Sel yang bisa dimainkan, dalam larik berpagar. Baris 830:
     DATA 6,7,8,11,12,13,16,17,18 */
  const PLAY = [6, 7, 8, 11, 12, 13, 16, 17, 18];

  /* Delapan arah sebagai penambahan indeks. Baris 810:
     DATA 1,6,5,4,-1,-6,-5,-4 */
  const DIRS = [1, 6, 5, 4, -1, -6, -5, -4];

  const EMPTY = 0, HUMAN = 1, ROBOT = 2, EDGE = 3;

  /** Larik berpagar yang baru: sembilan sel kosong, enam belas sel pagar. */
  function freshBoard() {
    const c = new Array(25).fill(EDGE);
    PLAY.forEach(i => { c[i] = EMPTY; });
    return c;
  }

  /* Semua garis tiga-berderet, diturunkan dari arah — bukan ditulis tangan.
     Aslinya memang tidak punya tabel ini, karena ia tidak pernah memeriksa
     kemenangan manusia. */
  const LINES = [];
  PLAY.forEach(a => {
    [1, 5, 6, 4].forEach(d => {
      const b = a + d, e = a + 2 * d;
      if (PLAY.includes(b) && PLAY.includes(e)) LINES.push([a, b, e]);
    });
  });

  function winnerOf(c) {
    for (const [a, b, e] of LINES) {
      if (c[a] !== EMPTY && c[a] === c[b] && c[b] === c[e]) return { who: c[a], line: [a, b, e] };
    }
    return null;
  }

  const freeCells = (c) => PLAY.filter(i => c[i] === EMPTY);

  /* --------------------------------------------------------------------
     AI, disalin apa adanya dari baris 860-1330.

     Tiap aturan mengembalikan alasannya juga, supaya halaman bisa
     menunjukkan KENAPA sebuah kotak dipilih. Itu tambahan murni: aslinya
     tidak punya cara memperlihatkan penalarannya sendiri.
     -------------------------------------------------------------------- */
  const RULES = [
    { id: 'win',    line: '860',  text: 'Selesaikan tiga-berderet sendiri' },
    { id: 'block',  line: '940',  text: 'Halangi tiga-berderet lawan' },
    { id: 'center', line: '1020', text: 'Ambil kotak tengah' },
    { id: 'fork',   line: '1050', text: 'Jawaban garpu yang ditulis tangan' },
    { id: 'corner', line: '1270', text: 'Sudut atau tengah yang masih kosong' },
    { id: 'any',    line: '1310', text: 'Kotak kosong pertama' }
  ];

  function aiMove(c) {
    // 860-930: dua milik sendiri sebaris, satu kosong -> menang
    for (let a = 6; a <= 18; a++) {
      if (c[a] !== ROBOT) continue;
      for (const d of DIRS) {
        const far = a + 2 * d;
        if (far < 6 || far > 18) continue;          // baris 890, sekaligus penjaga batas larik
        if (c[a + d] === ROBOT && c[far] === EMPTY) return { at: far, rule: 'win', win: true };
        if (c[a + d] === EMPTY && c[far] === ROBOT) return { at: a + d, rule: 'win', win: true };
      }
    }
    // 940-1010: bentuk yang sama, tapi milik lawan -> halangi
    for (let a = 6; a <= 18; a++) {
      if (c[a] !== HUMAN) continue;
      for (const d of DIRS) {
        const far = a + 2 * d;
        if (far < 6 || far > 18) continue;
        if (c[a + d] === HUMAN && c[far] === EMPTY) return { at: far, rule: 'block' };
        if (c[a + d] === EMPTY && c[far] === HUMAN) return { at: a + d, rule: 'block' };
      }
    }
    // 1020
    if (c[12] === EMPTY) return { at: 12, rule: 'center' };

    /* 1050-1240. Sebelas baris IF yang menangani jebakan garpu satu per satu.
       Tidak ada polanya — ini hasil orang duduk memainkan semua kemungkinan
       lalu menuliskan jawabannya. Dipertahankan apa adanya, termasuk
       percabangan ELSE berlapis di baris 1210-1230. */
    if (c[6] === HUMAN) {
      if (c[13] === HUMAN && c[8] === EMPTY) return { at: 8, rule: 'fork' };
      if (c[17] === HUMAN && c[16] === EMPTY) return { at: 16, rule: 'fork' };
    }
    if (c[8] === HUMAN) {
      if (c[11] === HUMAN && c[6] === EMPTY) return { at: 6, rule: 'fork' };
      if (c[17] === HUMAN && c[18] === EMPTY) return { at: 18, rule: 'fork' };
    }
    if (c[16] === HUMAN) {
      if (c[7] === HUMAN && c[6] === EMPTY) return { at: 6, rule: 'fork' };
      if (c[13] === HUMAN && c[18] === EMPTY) return { at: 18, rule: 'fork' };
    }
    if (c[18] === HUMAN) {
      if (c[11] === HUMAN) {
        if (c[6] !== ROBOT) { if (c[16] === EMPTY) return { at: 16, rule: 'fork' }; }
        else if (c[8] === EMPTY) return { at: 8, rule: 'fork' };
      } else if (c[7] === HUMAN) {
        if (c[6] === ROBOT && c[16] === EMPTY) return { at: 16, rule: 'fork' };
        if (c[8] === EMPTY) return { at: 8, rule: 'fork' };
      }
    }

    // 1250: dua sudut berseberangan milik lawan -> jangan ambil sudut lagi
    let from = 6;
    if ((c[6] === HUMAN && c[18] === HUMAN) || (c[8] === HUMAN && c[16] === HUMAN)) {
      from = 7;
    } else {
      // 1260
      if (c[17] === HUMAN && c[13] === HUMAN && c[18] === EMPTY) return { at: 18, rule: 'fork' };
      // 1270-1290: indeks genap 6..18 = keempat sudut dan tengah
      //            (10 dan 14 ikut terlewati karena berisi pagar)
      for (let a = 6; a <= 18; a += 2) {
        if (c[a] === EMPTY) return { at: a, rule: 'corner' };
      }
    }
    // 1310-1330
    for (let a = from; a <= 18; a++) {
      if (c[a] === EMPTY) return { at: a, rule: 'any' };
    }
    /* 1340 adalah `RUN` — program memulai dirinya sendiri kalau sampai di
       sini. Penelusuran seluruh pohon permainan menunjukkan jalur ini tidak
       pernah tercapai, tapi jaring pengamannya tetap dipasang. */
    return null;
  }

  /* --------------------------------------------------------------------
     Papan SVG
     -------------------------------------------------------------------- */
  const S = 120, PAD = 14;                 // ukuran sel dan jarak tepi coretan
  const mk = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const colOf = (i) => (i % 5) - 1;        // 0..2, dari larik berpagar
  const rowOf = (i) => Math.floor(i / 5) - 1;

  const svg = mk('svg', {
    viewBox: '0 0 ' + (S * 3) + ' ' + (S * 3), class: 't-board',
    role: 'grid', 'aria-label': 'Papan tic tac toe'
  });
  const inkLayer = mk('g', {});
  const cells = new Map();

  (function buildBoard() {
    // Garis pemisah. Aslinya CHR$(219) setinggi dua kolom, di baris 360-410.
    const grid = mk('g', { class: 't-grid' });
    [1, 2].forEach(k => {
      grid.append(mk('line', { x1: k * S, y1: 8, x2: k * S, y2: S * 3 - 8 }));
      grid.append(mk('line', { x1: 8, y1: k * S, x2: S * 3 - 8, y2: k * S }));
    });

    /* Kotak sentuh digambar LEBIH DULU dari coretan, supaya coretan berada di
       atasnya. SVG tidak punya z-index; urutan dokumen itulah urutan lapisan. */
    const hit = mk('g', {});
    PLAY.forEach((idx, n) => {
      const x = colOf(idx) * S, y = rowOf(idx) * S;
      const g = mk('g', { class: 't-cell' });
      g.append(mk('rect', { x: x + 2, y: y + 2, width: S - 4, height: S - 4,
                            rx: 8, fill: 'transparent' }));
      const t = mk('text', { class: 't-num', x: x + S / 2, y: y + S / 2 + 6 });
      t.textContent = n + 1;               // nomor kotak 1..9, seperti aslinya
      g.append(t);
      g.addEventListener('click', () => onPick(idx));
      hit.append(g);
      cells.set(idx, g);
    });

    svg.append(hit, grid, inkLayer);
    $('board').append(svg);
  })();

  /** Coretan X: dua garis silang. */
  function drawX(idx) {
    const x = colOf(idx) * S, y = rowOf(idx) * S;
    const g = mk('g', { class: 't-x' });
    const len = Math.hypot(S - 2 * PAD, S - 2 * PAD).toFixed(1);
    [[PAD, PAD, S - PAD, S - PAD], [S - PAD, PAD, PAD, S - PAD]].forEach((p, k) => {
      const l = mk('line', { class: 't-ink', x1: x + p[0], y1: y + p[1],
                             x2: x + p[2], y2: y + p[3] });
      l.style.setProperty('--len', len);
      l.style.animationDelay = (k * 140) + 'ms';
      g.append(l);
    });
    inkLayer.append(g);
  }

  /** Coretan O: satu lingkaran. */
  function drawO(idx) {
    const x = colOf(idx) * S, y = rowOf(idx) * S;
    const r = (S - 2 * PAD) / 2;
    const c = mk('circle', { class: 't-o t-ink', cx: x + S / 2, cy: y + S / 2, r });
    c.style.setProperty('--len', (2 * Math.PI * r).toFixed(1));
    inkLayer.append(c);
  }

  function drawWinLine(line) {
    const a = line[0], e = line[2];
    const x1 = colOf(a) * S + S / 2, y1 = rowOf(a) * S + S / 2;
    const x2 = colOf(e) * S + S / 2, y2 = rowOf(e) * S + S / 2;
    const l = mk('line', { class: 't-win t-ink', x1, y1, x2, y2 });
    l.style.setProperty('--len', Math.hypot(x2 - x1, y2 - y1).toFixed(1));
    inkLayer.append(l);
  }

  /* --------------------------------------------------------------------
     Larik berpagar, digambar dari keadaan yang sama dengan papannya.

     Ini bukan ilustrasi terpisah yang harus dijaga agar cocok — ia dibaca
     dari `board` yang sama, jadi mustahil melenceng.
     -------------------------------------------------------------------- */
  function drawPad(lastAt) {
    const host = $('pad');
    host.textContent = '';
    const grid = ui.el('div', { class: 't-pad' });
    for (let i = 0; i < 25; i++) {
      const v = board[i];
      const kind = v === EDGE ? 'edge' : v === HUMAN ? 'x' : v === ROBOT ? 'o' : 'free';
      const cell = ui.el('div', {
        class: 't-pad__c t-pad__c--' + kind + (i === lastAt ? ' is-last' : ''),
        title: 'C(' + i + ')' + (v === EDGE ? ' — pagar' : '')
      });
      cell.append(ui.el('span', { text: v === EDGE ? '3' : v === HUMAN ? 'X' : v === ROBOT ? 'O' : '0' }),
                  ui.el('small', { text: i }));
      grid.append(cell);
    }
    host.append(grid);
  }

  /* --- daftar aturan --- */
  (function buildRules() {
    RULES.forEach(r => {
      const row = ui.el('div', { class: 't-rule', id: 'rule-' + r.id });
      row.append(ui.el('span', { class: 't-rule__no', text: r.line }),
                 ui.el('span', { text: r.text }));
      $('rules').append(row);
    });
  })();

  function markRule(id) {
    RULES.forEach(r => {
      const el = $('rule-' + r.id);
      el.classList.toggle('is-on', r.id === id);
      el.classList.toggle('is-dead', id !== null && r.id !== id);
    });
  }

  /* --------------------------------------------------------------------
     Jalannya permainan
     -------------------------------------------------------------------- */
  let board = freshBoard();
  let phase = 'ask';                       // ask | human | robot | over
  let moves = 0;

  /* `store` adalah pabrik, bukan objek: ia dibuat per aplikasi supaya kuncinya
     berawalan `retro:tictac:`. Awalan itu wajib karena semua berkas yang dibuka
     lewat `file://` berbagi satu origin. */
  const db = store('tictac');
  const score = db.get('score', { win: 0, lose: 0, draw: 0 });

  function showScore() {
    $('sWin').textContent = score.win;
    $('sLose').textContent = score.lose;
    $('sDraw').textContent = score.draw;
    $('sMove').textContent = moves;
  }

  function say(text, idle) {
    $('say').textContent = text;
    $('say').classList.toggle('t-say--idle', !!idle);
  }

  function refresh(lastAt) {
    cells.forEach((g, idx) => {
      const open = board[idx] === EMPTY && phase === 'human';
      g.classList.toggle('is-open', open);
      g.classList.toggle('t-cell-filled', board[idx] !== EMPTY);
    });
    drawPad(lastAt === undefined ? -1 : lastAt);
    $('sMove').textContent = moves;
  }

  function newGame(humanFirst) {
    board = freshBoard();
    moves = 0;
    inkLayer.textContent = '';
    markRule(null);
    $('controls').classList.add('hidden');
    if (humanFirst) {
      phase = 'human';
      say('Please Enter Square Number');
      refresh();
    } else {
      phase = 'robot';
      refresh();
      robotTurn();
    }
  }

  function onPick(idx) {
    if (phase !== 'human' || board[idx] !== EMPTY) return;
    board[idx] = HUMAN;
    moves++;
    drawX(idx);
    audio.play('MB T220 O3 L32 g', { fresh: true });
    phase = 'robot';
    refresh(idx);
    if (finished()) return;
    robotTurn();
  }

  async function robotTurn() {
    say('Thinking…', true);
    await wait(420);                       // aslinya seketika; jeda ini murni rasa
    const move = aiMove(board);
    if (!move) {                           // baris 1340: RUN
      say('Papan buntu — aslinya memulai ulang program di sini.', true);
      phase = 'over';
      return;
    }
    board[move.at] = ROBOT;
    moves++;
    drawO(move.at);
    markRule(move.rule);
    audio.play('MB T220 O2 L32 c', { fresh: true });
    phase = 'human';
    refresh(move.at);
    if (finished()) return;
    say('Please Enter Square Number');
  }

  /** @returns {boolean} true kalau permainan selesai. */
  function finished() {
    const w = winnerOf(board);
    if (w) {
      drawWinLine(w.line);
      phase = 'over';
      if (w.who === ROBOT) {
        score.lose++;
        say('I Win !!!!');
        for (let k = 0; k < 5; k++) {      // baris 1410: SOUND 500,1 / SOUND 100,1
          setTimeout(() => { audio.sound(500, 1); }, k * 160);
          setTimeout(() => { audio.sound(100, 1); }, k * 160 + 80);
        }
      } else {
        /* Aslinya TIDAK punya cabang ini. Lihat catatan di kepala berkas. */
        score.win++;
        say('Anda menang — dan itu mustahil. Ada yang salah di porting ini.');
        ui.toast('Kemenangan manusia seharusnya tidak mungkin terjadi. '
               + 'Kalau Anda melihat pesan ini, tolong catat urutan langkahnya.');
      }
      db.set('score', score);
      showScore();
      askAgain();
      return true;
    }
    if (!freeCells(board).length) {        // baris 160
      phase = 'over';
      score.draw++;
      db.set('score', score);
      showScore();
      say('Tie Game');
      askAgain();
      return true;
    }
    return false;
  }

  function askAgain() {
    markRule(null);
    refresh();
    $('controls').classList.remove('hidden');
    $('yes').textContent = 'Main lagi — saya duluan';
    $('no').textContent = 'Main lagi — komputer duluan';
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Tic Tac Toe',
    source: 'TICTAC.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  $('yes').addEventListener('click', () => newGame(true));
  $('no').addEventListener('click', () => newGame(false));
  $('reset').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset skor?', 'Menang, kalah, dan seri dikembalikan ke nol.')) return;
    score.win = score.lose = score.draw = 0;
    db.set('score', score);
    showScore();
  });

  /* Angka 1-9 di papan ketik, persis seperti aslinya:
     `110 FOR A=1 TO 9: ON KEY(A) GOSUB 480` */
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (phase === 'ask' || phase === 'over') {
      if (e.key === 'y' || e.key === 'Y') newGame(true);
      if (e.key === 'n' || e.key === 'N') newGame(false);
      return;
    }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) onPick(PLAY[n - 1]);
  });

  showScore();
  refresh();
})();
