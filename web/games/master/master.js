/* ===========================================================================
   master.js — port dari MASTER.BAS
   (Friendlyware PC Introductory Set, 1982; menu #1 pilihan E).

   Mastermind. Aslinya memakai ANGKA 0-9 dan menampilkan dua bilangan sebagai
   petunjuk. Papan permainan Mastermind yang dijual toko memakai WARNA dan
   pasak hitam-putih. Keduanya tersedia di sini, dan itu bukan dua permainan
   melainkan dua penyandian dari permainan yang sama — lihat catatan di
   `judge()` dan `MODES`.

   ------------------------------------------------------------------------
   TEMUAN 1: RAHASIANYA NYARIS TIDAK ACAK

       710 FOR SUB=1 TO DIGITS
       720   RANDOMIZE(VAL(RIGHT$(TIME$,2))):ANSWER(SUB)=FIX(RND(SUB)*10)
       730 NEXT SUB

   `RANDOMIZE` ada DI DALAM perulangan. Tiap angka menyetel ulang pengacaknya
   lebih dulu, dan benihnya adalah detik pada jam — yang tidak berubah selama
   perulangan tiga sampai enam putaran itu berjalan. Jadi setiap angka diambil
   dari pengacak yang baru saja dikembalikan ke keadaan yang sama, dan
   benihnya sendiri cuma punya 60 kemungkinan.

   Seberapa jauh akibatnya bergantung pada apakah RANDOMIZE di GW-BASIC
   MENIMPA benih atau MENCAMPURNYA dengan yang lama — dan itu tidak diperiksa
   di sini, karena menjalankan GW-BASIC sungguhan bukan bagian dari porting.

   Port ini menyemai SEKALI, dari `crypto.getRandomValues`.

   ------------------------------------------------------------------------
   TEMUAN 2: DUA SUBRUTIN KOSONG YANG IKUT TERKIRIM

       1420 REM LOSE SONG
       1430 RETURN
       1440 REM WIN SONG
       1450 RETURN

   Keduanya dipanggil sungguhan dari baris 1220 dan 1250, dan keduanya
   langsung `RETURN`. Di sini keduanya diisi.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, rng, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* --------------------------------------------------------------------
     DUA PENYANDIAN, SATU PERMAINAN

     Mode hanya menentukan tiga hal: berapa lambang yang tersedia, bagaimana
     satu lambang digambar, dan bagaimana petunjuknya ditampilkan. Aturan,
     penilaian, dan seluruh alur permainannya tidak tahu-menahu.

     Itu bukan kebetulan — itu yang membuat penambahan mode warna hanya
     menyentuh lapisan tampilan. Kalau `judge()` sampai perlu tahu mode,
     rancangannya salah.
     -------------------------------------------------------------------- */
  const COLORS = [
    { hue: '#e5484d', letter: 'M', name: 'merah' },
    { hue: '#f07f1a', letter: 'J', name: 'jingga' },
    { hue: '#efd022', letter: 'K', name: 'kuning' },
    { hue: '#46a758', letter: 'H', name: 'hijau' },
    { hue: '#4a90e2', letter: 'B', name: 'biru' },
    { hue: '#9a6ad4', letter: 'U', name: 'ungu' }
  ];

  const MODES = {
    num: {
      label: 'Angka (seperti 1982)',
      symbols: 10,
      heads: ['Correct', 'In right position'],
      hint: 'Dua bilangan: berapa angka yang benar, dan berapa yang posisinya juga tepat.'
    },
    color: {
      label: 'Warna (papan klasik)',
      symbols: 6,
      heads: ['Pasak', 'petunjuk'],
      hint: 'Pasak hitam = warna dan posisi benar. Pasak putih = warna benar, posisi salah.'
    }
  };

  let mode = 'num';
  const M = () => MODES[mode];

  /* Baris 660-690. Empat tingkat: panjang deret dan jumlah tebakan.
     Jumlah tebakan tersirat dari `BOTROW` — baris layar terakhir yang dipakai. */
  const LEVELS = [
    { key: 'A', digits: 3, rows: 9,  label: 'A — 3 posisi' },
    { key: 'B', digits: 4, rows: 9,  label: 'B — 4 posisi' },
    { key: 'C', digits: 5, rows: 12, label: 'C — 5 posisi' },
    { key: 'D', digits: 6, rows: 15, label: 'D — 6 posisi' }
  ];

  const db = store('master');
  let level = null, secret = [], guesses = [], cur = [], row = 0, phase = 'pick';

  /* --------------------------------------------------------------------
     Penilaian — sama untuk kedua mode.

     Aslinya dua lintasan dengan dua larik penanda (baris 1090-1180); yang
     dihitungnya ternyata rumus baku Mastermind:

         tepat  = berapa posisi yang lambangnya sama
         benar  = Σ atas tiap lambang: min(muncul di tebakan, muncul di rahasia)

     Perhatikan bahwa `benar` SUDAH termasuk `tepat`. Papan klasik menampilkan
     pasak putih sebanyak `benar - tepat`; aslinya menampilkan `benar` mentah.
     Keduanya membawa informasi yang PERSIS SAMA — satu bisa dihitung dari yang
     lain — jadi menggantinya sungguh hanya soal penyandian, bukan soal
     mempermudah atau mempersulit.
     -------------------------------------------------------------------- */
  const MAXSYM = 10;
  function judge(guess, answer) {
    let exact = 0;
    const gc = new Array(MAXSYM).fill(0), ac = new Array(MAXSYM).fill(0);
    guess.forEach((d, i) => {
      if (d === answer[i]) exact++;
      gc[d]++; ac[answer[i]]++;
    });
    let total = 0;
    for (let d = 0; d < MAXSYM; d++) total += Math.min(gc[d], ac[d]);
    return { exact, total, near: total - exact };
  }

  /* --- rahasia --- */
  const makeSecret = (n) => {
    const r = rng();                       // disemai sekali dari crypto
    return Array.from({ length: n }, () => r.int(M().symbols));
  };

  /** Tiruan cacat 1982: pengacak disemai ULANG sebelum tiap angka, dengan
      benih yang sama — persis bentuk baris 720. */
  const makeSecret1982 = (n, seed) =>
    Array.from({ length: n }, () => rng(seed).int(10));

  /* --------------------------------------------------------------------
     Menggambar satu lambang.

     Warna SELALU disertai huruf. Mastermind sungguhan mengandalkan warna
     semata, dan itu menutup pintu bagi sekitar 8% laki-laki yang buta warna
     merah-hijau — persis pasangan warna yang paling sering dipakai. Huruf di
     dalam pasak menghapus masalah itu tanpa mengurangi apa pun bagi yang
     lain.
     -------------------------------------------------------------------- */
  function slot(v, mod) {
    if (mod === 'empty' || mod === 'cursor' || mod === 'hidden') {
      return ui.el('div', { class: 'k-slot k-slot--' + mod,
                            text: mod === 'hidden' ? '?' : '' });
    }
    if (mode === 'num') return ui.el('div', { class: 'k-slot', text: v });
    const c = COLORS[v];
    const d = ui.el('div', { class: 'k-slot k-slot--peg', title: c.name,
                             text: c.letter });
    d.style.setProperty('--peg', c.hue);
    return d;
  }

  /* Petunjuk. Mode angka menampilkan dua bilangan seperti aslinya; mode warna
     menampilkan pasak hitam dan putih seperti papan yang dijual toko. */
  function clueNodes(g) {
    if (!g) return [ui.el('div', { class: 'k-score' }), ui.el('div', { class: 'k-score' })];
    if (mode === 'num') {
      return [ui.el('div', { class: 'k-score', text: g.total }),
              ui.el('div', { class: 'k-score k-score--hit', text: g.exact })];
    }
    const box = ui.el('div', { class: 'k-pegs' });
    for (let i = 0; i < g.exact; i++) box.append(ui.el('span', { class: 'k-peg k-peg--b', title: 'posisi tepat' }));
    for (let i = 0; i < g.near; i++)  box.append(ui.el('span', { class: 'k-peg k-peg--w', title: 'warna benar, posisi salah' }));
    for (let i = g.exact + g.near; i < level.digits; i++) box.append(ui.el('span', { class: 'k-peg' }));
    return [box, ui.el('div', { class: 'k-score k-score--hit',
                                text: g.exact + '/' + g.near })];
  }

  function drawSecret(reveal) {
    const host = $('secret');
    host.textContent = '';
    if (!level) { host.append(slot(0, 'hidden')); return; }
    secret.forEach(d => host.append(reveal ? slot(d) : slot(0, 'hidden')));
  }

  function drawSheet() {
    const host = $('sheet');
    host.textContent = '';
    if (!level) return;
    for (let r = 0; r < level.rows; r++) {
      const line = ui.el('div', {
        class: 'k-line' + (r === row ? ' is-now' : r < row ? ' is-done' : '')
      });
      const cells = ui.el('div', { class: 'k-row' });
      for (let i = 0; i < level.digits; i++) {
        if (r < row) cells.append(slot(guesses[r].guess[i]));
        else if (r === row && i < cur.length) cells.append(slot(cur[i]));
        else cells.append(slot(0, r === row && i === cur.length ? 'cursor' : 'empty'));
      }
      line.append(cells, ...clueNodes(guesses[r]));
      host.append(line);
    }
  }

  function drawHeads() {
    const h = $('heads');
    h.textContent = '';
    h.append(ui.el('span', { text: 'Enter your guesses' }),
             ui.el('span', { text: M().heads[0] }),
             ui.el('span', { text: M().heads[1] }));
  }

  function drawPad() {
    const pad = $('pad');
    pad.textContent = '';
    for (let v = 0; v < M().symbols; v++) {
      const b = mode === 'num'
        ? ui.el('button', { class: 'keycap', type: 'button', text: v })
        : ui.el('button', { class: 'keycap keycap--peg', type: 'button',
                            text: COLORS[v].letter, title: COLORS[v].name });
      if (mode === 'color') b.style.setProperty('--peg', COLORS[v].hue);
      b.addEventListener('click', () => push(v));
      pad.append(b);
    }
  }

  function say(text, kind) {
    $('say').textContent = text;
    $('say').className = 'k-say' + (kind ? ' k-say--' + kind : '');
  }

  /** Berapa banyak rahasia yang mungkin — supaya perbedaan tingkat kesulitan
      antara sepuluh angka dan enam warna terlihat, bukan tersembunyi. */
  function showSpace() {
    if (!level) { $('space').textContent = ''; return; }
    const n = Math.pow(M().symbols, level.digits);
    $('space').textContent = M().symbols + ' lambang, ' + level.digits +
      ' posisi → ' + n.toLocaleString('id-ID') + ' kemungkinan rahasia, ' +
      level.rows + ' tebakan.';
  }

  /* --------------------------------------------------------------------
     Jalannya permainan
     -------------------------------------------------------------------- */
  function start(lv) {
    level = lv || level;
    if (!level) return;
    secret = makeSecret(level.digits);
    guesses = []; cur = []; row = 0; phase = 'play';
    drawHeads(); drawPad(); drawSecret(false); drawSheet(); showSpace();
    say(M().hint);
    $('undo').disabled = true;
    $('giveup').disabled = false;
  }

  function push(v) {
    if (phase !== 'play' || cur.length >= level.digits) return;
    cur.push(v);
    audio.play('MB T240 O3 L32 e', { fresh: true });
    $('undo').disabled = false;
    drawSheet();
    if (cur.length === level.digits) submit();
  }

  function undo() {
    if (phase !== 'play' || !cur.length) return;
    cur.pop();
    $('undo').disabled = cur.length === 0;
    drawSheet();
  }

  function submit() {
    const r = judge(cur, secret);
    guesses.push({ guess: cur.slice(), exact: r.exact, total: r.total, near: r.near });
    cur = [];
    row++;
    $('undo').disabled = true;
    drawSheet();

    if (r.exact === level.digits) return finish(true);
    if (row >= level.rows) return finish(false);
    say(mode === 'num'
      ? r.total + ' benar, ' + r.exact + ' di posisi tepat.'
      : r.exact + ' pasak hitam, ' + r.near + ' pasak putih.');
  }

  function finish(won) {
    phase = 'over';
    $('giveup').disabled = true;
    drawSecret(true);
    drawSheet();
    if (won) {
      say('!!!  C O N G R A T U L A T I O N S  !!!');
      winSong();
      const k = 'best-' + mode + '-' + level.digits;
      const best = db.get(k, null);
      if (best === null || row < best) { db.set(k, row); ui.toast('Rekor baru: ' + row + ' tebakan.'); }
    } else {
      say('!!!  S O R R Y , Y O U   L O S T  !!!', 'bad');
      loseSong();
    }
  }

  /* Baris 1440 dan 1420 — subrutin yang aslinya kosong, kini diisi. */
  function winSong()  { audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true }); }
  function loseSong() { audio.play('MB T110 O3 L8 c O2 L8 a f L2 d', { fresh: true }); }

  /* --------------------------------------------------------------------
     Percobaan sebaran pengacak.

     Selalu memakai sepuluh lambang, apa pun modenya — karena yang sedang
     ditiru adalah baris 720 yang berbunyi `FIX(RND(SUB)*10)`.
     -------------------------------------------------------------------- */
  function histogram(list, bug) {
    const counts = new Array(10).fill(0);
    list.forEach(s => s.forEach(d => counts[d]++));
    const max = Math.max.apply(null, counts) || 1;
    const host = $('hist');
    host.className = 'k-hist' + (bug ? ' k-hist--bug' : '');
    host.textContent = '';
    counts.forEach((n, d) => {
      const b = ui.el('div', { class: 'k-hist__b', title: d + ': ' + n + ' kali' });
      b.style.height = Math.max(2, Math.round(n / max * 76)) + 'px';
      b.append(ui.el('span', { text: d }));
      host.append(b);
    });
  }

  const allSame = (list) =>
    list.filter(s => s.every(d => d === s[0])).length / list.length * 100;

  function simulate(bug) {
    const N = 1000, LEN = 4;
    const out = [];
    for (let i = 0; i < N; i++) {
      out.push(bug ? makeSecret1982(LEN, i % 60)
                   : Array.from({ length: LEN }, () => rng().int(10)));
    }
    histogram(out, bug);
    const uniq = new Set(out.map(s => s.join(''))).size;
    $('histNote').textContent =
      (bug ? 'Versi 1982: ' : 'Versi diperbaiki: ') +
      uniq + ' rahasia berbeda dari ' + N + ' percobaan · ' +
      allSame(out).toFixed(1) + '% seluruh angkanya sama' +
      (bug ? ' — sebarannya juga timpang, karena benihnya cuma 60 nilai.'
           : ' — merata, dan praktis tidak pernah berulang.');
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Mastermind',
    source: 'MASTER.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  Object.keys(MODES).forEach(id => {
    const b = ui.el('button', { class: 'btn btn--ghost btn--sm', type: 'button',
                                text: MODES[id].label, id: 'mode-' + id });
    b.setAttribute('aria-pressed', id === mode ? 'true' : 'false');
    b.addEventListener('click', () => {
      mode = id;
      Object.keys(MODES).forEach(k =>
        $('mode-' + k).setAttribute('aria-pressed', k === id ? 'true' : 'false'));
      /* Ganti mode = mulai ulang. Melanjutkan permainan yang sedang berjalan
         sambil mengganti jumlah lambang akan membuat rahasianya memuat lambang
         yang tidak ada di papan angka. */
      if (level) start();
      else { drawHeads(); drawPad(); }
    });
    $('modes').append(b);
  });

  LEVELS.forEach(lv => {
    const b = ui.el('button', { class: 'btn btn--ghost btn--sm', type: 'button',
                                text: lv.label });
    b.addEventListener('click', () => start(lv));
    $('levels').append(b);
  });

  $('undo').addEventListener('click', undo);
  $('giveup').addEventListener('click', () => finish(false));
  $('simFix').addEventListener('click', () => simulate(false));
  $('simBug').addEventListener('click', () => simulate(true));

  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (phase === 'play') {
      /* Mode angka: 0-9 langsung. Mode warna: 1-6, karena pasak dinomori
         satu sampai enam di papan tombol — bukan nol sampai lima. */
      const n = parseInt(e.key, 10);
      if (!isNaN(n)) {
        const v = mode === 'num' ? n : n - 1;
        if (v >= 0 && v < M().symbols) { e.preventDefault(); return push(v); }
      }
      if (mode === 'color') {
        const i = COLORS.findIndex(c => c.letter === e.key.toUpperCase());
        if (i >= 0) { e.preventDefault(); return push(i); }
      }
      if (e.key === 'Backspace') { e.preventDefault(); return undo(); }
    }
    const lv = LEVELS.find(l => l.key === e.key.toUpperCase());
    if (lv) start(lv);
  });

  drawHeads();
  drawPad();
  drawSecret(false);
})();
