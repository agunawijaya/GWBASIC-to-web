/* ===========================================================================
   hique2.js — port dari HIQUE2.BAS (Wes Meier, 1983).

   Peg solitaire Inggris: papan salib 33 lubang, semuanya berisi pasak kecuali
   yang di tengah. Lompati satu pasak ke lubang kosong di seberangnya; pasak
   yang dilompati diangkat. Sisakan sesedikit mungkin.

   ------------------------------------------------------------------------
   PAPAN SALIB DI DALAM LARIK LURUS

   Aslinya menyimpan papan sebagai `DIM P(33)` — satu larik lurus dengan
   penomoran mengikuti bentuk salibnya:

                 1  2  3
                 4  5  6
           7  8  9 10 11 12 13
          14 15 16 17 18 19 20
          21 22 23 24 25 26 27
                28 29 30
                31 32 33

   Penomoran itu enak untuk manusia dan tidak berguna untuk aritmetika: 9 dan
   10 bertetangga, tapi 13 dan 14 tidak. Jadi sebelum memeriksa lompatan,
   nomor lubang diterjemahkan ke KISI MAYA TUJUH KOLOM lewat empat `IF`:

       109 IF MOVE.FROM<4  THEN MF=MOVE.FROM-6
       110 IF MOVE.FROM<7  THEN MF=MOVE.FROM-2
       111 IF MOVE.FROM>30 THEN MF=MOVE.FROM+6
       112 IF MOVE.FROM>27 THEN MF=MOVE.FROM+2
       119 IF ABS(MT-MF)<>2 AND ABS(MT-MF)<>14 THEN <tolak>

   Setelah diterjemahkan, dua baris berurutan berjarak tepat tujuh. Jadi
   selisih 2 = lompatan mendatar, selisih 14 = lompatan menegak. Pemetaannya
   diperiksa untuk ketiga puluh tiga lubang dan benar: selisihnya tetap.

   ------------------------------------------------------------------------
   TAPI KISINYA TIDAK PUNYA PAGAR

   Aturan itu menerima 84 lompatan. Papan sungguhan hanya punya 76.

   Delapan sisanya adalah PEMBUNGKUSAN TEPI: lubang di kolom paling kanan
   sebuah baris berjarak tepat 2 dari kolom paling kiri baris berikutnya, dan
   tidak ada apa pun yang menghentikannya:

       12 -> lompati 13 -> 14      (2,5) (2,6) (3,0)
       13 -> lompati 14 -> 15      (2,6) (3,0) (3,1)
       19 -> lompati 20 -> 21      (3,5) (3,6) (4,0)
       20 -> lompati 21 -> 22      (3,6) (4,0) (4,1)
       ...dan keempat kebalikannya

   Bandingkan dengan TICTAC di koleksi yang sama: ia menyimpan papan 3x3 di
   dalam larik 5x5 dengan PAGAR di sekelilingnya, justru supaya hal ini tidak
   bisa terjadi. Dua program, satu disket, satu masalah — satu menyelesaikannya
   dengan pagar, satu tidak menyelesaikannya sama sekali.

   Di sini lompatan diturunkan dari GEOMETRI papan, bukan dari aritmetika
   indeks. Aturan 1982 tetap bisa dinyalakan lewat tombol, dan lompatan
   liarnya ditandai kuning — supaya bugnya bisa dilihat, bukan cuma dibaca.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, wait } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Denah salib, persis penomoran baris 15-21. Spasi = di luar papan. */
  const LAYOUT = [
    '  123  ',
    '  456  ',
    '789ABCD',
    'EFGHIJK',
    'LMNOPQR',
    '  STU  ',
    '  VWX  '
  ];
  const SYM = '123456789ABCDEFGHIJKLMNOPQRSTUVWX';

  const RC = {};                 // nomor lubang -> {r, c}
  const AT = {};                 // "r,c" -> nomor lubang
  LAYOUT.forEach((line, r) => {
    line.split('').forEach((ch, c) => {
      if (ch === ' ') return;
      const n = SYM.indexOf(ch) + 1;
      RC[n] = { r, c };
      AT[r + ',' + c] = n;
    });
  });

  const CENTER = 17;
  const TOTAL = 33;

  /* Lompatan yang benar-benar mungkin: diturunkan dari geometri, bukan dari
     aritmetika indeks. Tidak ada pembungkusan tepi karena tetangga dicari
     lewat koordinat, dan koordinat di luar salib memang tidak ada. */
  const JUMPS = [];
  Object.keys(RC).forEach(k => {
    const n = +k, { r, c } = RC[n];
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
      const over = AT[(r + dr) + ',' + (c + dc)];
      const to = AT[(r + 2 * dr) + ',' + (c + 2 * dc)];
      if (over && to) JUMPS.push({ from: n, over, to, wild: false });
    });
  });

  /* Delapan lompatan yang HANYA diterima aturan 1982 — hasil pembungkusan
     tepi di kisi maya tujuh kolom. Dihitung ulang di sini dari aturan
     aslinya, bukan disalin sebagai daftar tetap, supaya kalau pemetaannya
     salah dibaca, jumlahnya akan langsung berbeda dari delapan. */
  const mf = (n) => n < 4 ? n - 6 : n < 7 ? n - 2 : n > 30 ? n + 6 : n > 27 ? n + 2 : n;
  const WILD = [];
  Object.keys(RC).forEach(a => {
    Object.keys(RC).forEach(b => {
      const x = +a, y = +b;
      if (x === y) return;
      const d = Math.abs(mf(y) - mf(x));
      if (d !== 2 && d !== 14) return;
      const mid = (mf(x) + mf(y)) / 2;
      const over = Object.keys(RC).map(Number).find(k => mf(k) === mid);
      if (!over) return;
      if (JUMPS.some(j => j.from === x && j.over === over && j.to === y)) return;
      WILD.push({ from: x, over, to: y, wild: true });
    });
  });

  /* Kelima lubang tempat pasak terakhir bisa berhenti, menurut invarian
     pewarnaan mod 3. Dihitung, bukan ditulis tangan. */
  function endHoles() {
    const sig = (pegs) => [(a, b) => (a + b) % 3, (a, b) => ((a - b) % 3 + 3) % 3]
      .map(f => {
        const n = [0, 0, 0];
        pegs.forEach(p => { n[f(RC[p].r, RC[p].c)]++; });
        const p0 = n.map(x => x % 2).join('');
        const p1 = n.map(x => 1 - x % 2).join('');
        return p0 < p1 ? p0 : p1;
      }).join('|');
    const all = Object.keys(RC).map(Number);
    const s0 = sig(all.filter(n => n !== CENTER));
    return all.filter(n => sig([n]) === s0);
  }
  const ENDS = endHoles();

  /* --------------------------------------------------------------------
     Keadaan
     -------------------------------------------------------------------- */
  const db = store('hique2');
  let pegs, sel, moves, history, legacy = false, phase = 'play';

  const rules = () => legacy ? JUMPS.concat(WILD) : JUMPS;
  const legalFrom = (n) => rules().filter(j =>
    j.from === n && pegs.has(j.from) && pegs.has(j.over) && !pegs.has(j.to));
  const anyLegal = () => rules().some(j =>
    pegs.has(j.from) && pegs.has(j.over) && !pegs.has(j.to));

  function reset() {
    pegs = new Set(Object.keys(RC).map(Number));
    pegs.delete(CENTER);                   // baris 25: P(17)=EMPTY
    sel = null; moves = 0; history = []; phase = 'play';
    draw();
    say('Klik pasak, lalu klik lubang tujuannya.');
  }

  /* --------------------------------------------------------------------
     Gambar. Seluruh papan digambar ulang dari `pegs` tiap kali —
     33 elemen, jadi tidak ada gunanya memperumit dengan pembaruan sebagian.
     -------------------------------------------------------------------- */
  const board = ui.el('div', { class: 'h-board' });
  $('board').append(board);

  function draw() {
    board.textContent = '';
    const targets = sel === null ? [] : legalFrom(sel);
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const n = AT[r + ',' + c];
        if (!n) { board.append(ui.el('div', { class: 'h-hole h-hole--void' })); continue; }
        const t = targets.find(j => j.to === n);
        const cls = ['h-hole'];
        if (n === sel) cls.push('h-hole--sel');
        if (t) cls.push(t.wild ? 'h-hole--wild' : 'h-hole--to');
        if (pegs.size === 1 && ENDS.includes(n)) cls.push('h-hole--end');
        const cell = ui.el('div', { class: cls.join(' '), text: String(n),
                                    title: 'Lubang ' + n });
        if (pegs.has(n)) cell.append(ui.el('div', { class: 'h-peg' }));
        cell.addEventListener('click', () => tap(n));
        board.append(cell);
      }
    }
    $('sPegs').textContent = pegs.size;
    $('sMoves').textContent = moves;
    $('undo').disabled = history.length === 0;
  }

  function say(text, kind) {
    $('say').textContent = text;
    $('say').className = 'h-say' + (kind ? ' h-say--' + kind : '');
  }

  /* --------------------------------------------------------------------
     Langkah
     -------------------------------------------------------------------- */
  function tap(n) {
    if (phase !== 'play') return;
    if (sel !== null) {
      const j = legalFrom(sel).find(x => x.to === n);
      if (j) return apply(j);
      if (n === sel) { sel = null; return draw(); }
    }
    if (!pegs.has(n)) { say('Lubang itu kosong.', 'bad'); return; }
    if (!legalFrom(n).length) {
      sel = null; draw();
      say('Pasak itu tidak punya lompatan.', 'bad');
      audio.sound(37, 5);                  // baris 94: SOUND 37,5
      return;
    }
    sel = n;
    draw();
    say('Pilih lubang tujuannya.');
  }

  function apply(j) {
    history.push({ from: j.from, over: j.over, to: j.to });
    pegs.delete(j.from); pegs.delete(j.over); pegs.add(j.to);
    moves++;
    sel = null;
    audio.play('MB T240 O3 L32 g', { fresh: true });
    draw();
    check(j.wild);
  }

  function undo() {
    const j = history.pop();
    if (!j) return;
    pegs.add(j.from); pegs.add(j.over); pegs.delete(j.to);
    moves--; sel = null; phase = 'play';
    draw();
    say('Satu lompatan dibatalkan.');
  }

  function check(wasWild) {
    if (wasWild) {
      say('Lompatan liar — tidak mungkin di papan sungguhan.', 'bad');
      return;
    }
    if (pegs.size === 1) {
      phase = 'over';
      const last = Array.from(pegs)[0];
      say('Satu pasak tersisa, di lubang ' + last + '.');
      audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true });
      record();
      return;
    }
    if (!anyLegal()) {
      phase = 'over';
      say('Tidak ada lompatan lagi. Tersisa ' + pegs.size + ' pasak.', 'bad');
      record();
      return;
    }
    say('Klik pasak, lalu klik lubang tujuannya.');
  }

  /* Rekor = SESEDIKIT mungkin pasak tersisa. Permainan dengan aturan 1982
     tidak dicatat: lompatan liarnya membuat teka-tekinya jadi soal lain. */
  function record() {
    if (legacy) return;
    const best = db.get('best', null);
    if (best === null || pegs.size < best) {
      db.set('best', pegs.size);
      showBest();
      ui.toast('Rekor baru: tersisa ' + pegs.size + ' pasak.');
    }
  }
  const showBest = () => {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b;
  };

  /* --------------------------------------------------------------------
     Penyelesaian.

     Dicari dengan penelusuran mendalam plus tabel keadaan yang sudah
     dikunjungi — tanpa tabel itu, pohonnya terlalu besar untuk diselesaikan
     di dalam peramban.

     Aslinya tidak punya penyelesai sama sekali; ia hanya wasit.
     -------------------------------------------------------------------- */
  function findSolution() {
    const seen = new Set();
    const start = new Set(Object.keys(RC).map(Number));
    start.delete(CENTER);
    const key = (s) => Array.from(s).sort((a, b) => a - b).join(',');
    const path = [];

    function go(s) {
      if (s.size === 1) return true;
      const k = key(s);
      if (seen.has(k)) return false;
      seen.add(k);
      for (const j of JUMPS) {
        if (!s.has(j.from) || !s.has(j.over) || s.has(j.to)) continue;
        s.delete(j.from); s.delete(j.over); s.add(j.to);
        path.push(j);
        if (go(s)) return true;
        path.pop();
        s.add(j.from); s.add(j.over); s.delete(j.to);
      }
      return false;
    }
    return go(start) ? path.slice() : null;
  }

  let solveToken = 0;
  async function showSolution() {
    const my = ++solveToken;
    $('solve').disabled = true;
    $('stopSolve').disabled = false;
    say('Mencari penyelesaian…', 'idle');
    await wait(30);                        // beri kesempatan layar menggambar

    const plan = findSolution();
    if (my !== solveToken) return;
    if (!plan) { say('Tidak ditemukan.', 'bad'); return stopSolution(); }

    reset();
    phase = 'solving';
    for (const j of plan) {
      if (my !== solveToken) return;
      pegs.delete(j.from); pegs.delete(j.over); pegs.add(j.to);
      moves++;
      draw();
      audio.play('MB T255 O3 L64 c', { fresh: true });
      await wait(230);
    }
    if (my !== solveToken) return;
    phase = 'over';
    const last = Array.from(pegs)[0];
    say('31 lompatan, satu pasak tersisa di lubang ' + last + '.');
    stopSolution();
  }

  function stopSolution() {
    solveToken++;
    $('solve').disabled = false;
    $('stopSolve').disabled = true;
    if (phase === 'solving') { phase = 'play'; say('Dihentikan.'); }
  }

  /* --------------------------------------------------------------------
     Panel penjelasan — daftar lompatan liar dan papan kecil lubang akhir.
     Keduanya dibangkitkan dari data yang sama dengan permainannya.
     -------------------------------------------------------------------- */
  (function explain() {
    const list = $('badList');
    WILD.filter(j => j.from < j.to).forEach(j => {
      list.append(ui.el('div', {
        text: j.from + ' → lompati ' + j.over + ' → ' + j.to +
              '   (' + RC[j.from].r + ',' + RC[j.from].c + ') → (' +
              RC[j.to].r + ',' + RC[j.to].c + ')'
      }));
    });
    list.append(ui.el('div', { text: '…dan keempat kebalikannya.' }));

    const mini = ui.el('div', { class: 'h-mini' });
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const n = AT[r + ',' + c];
        mini.append(ui.el('div', {
          class: 'h-mini__c' + (!n ? ' h-mini__c--void'
                                  : ENDS.includes(n) ? ' h-mini__c--end' : ''),
          title: n ? 'Lubang ' + n : ''
        }));
      }
    }
    $('ends').append(mini);
  })();

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Hi-Que',
    source: 'HIQUE2.BAS · Wes Meier · 1983',
    backHref: '../../index.html'
  }));

  $('undo').addEventListener('click', undo);
  $('restart').addEventListener('click', () => { solveToken++; stopSolution(); reset(); });
  $('solve').addEventListener('click', showSolution);
  $('stopSolve').addEventListener('click', stopSolution);
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah pasak tersisa terbaik dihapus.')) return;
    db.set('best', null); showBest();
  });
  $('legacy').addEventListener('click', () => {
    legacy = !legacy;
    $('legacy').setAttribute('aria-pressed', legacy ? 'true' : 'false');
    $('legacyNote').textContent = legacy
      ? 'Aturan 1982 aktif: delapan lompatan pembungkus tepi ikut diterima, '
        + 'ditandai kuning. Permainan begini tidak dicatat sebagai rekor.'
      : 'Aturan 1982 menerima delapan lompatan yang tidak mungkin di papan '
        + 'sungguhan. Nyalakan untuk melihatnya — lompatan liar ditandai kuning.';
    sel = null;
    draw();
  });

  showBest();
  reset();
})();
