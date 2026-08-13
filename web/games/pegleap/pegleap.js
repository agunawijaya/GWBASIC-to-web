/* ===========================================================================
   pegleap.js — port dari PEGLEAP.BAS (Friendlyware, 1982).

   Peg solitaire Inggris — teka-teki yang PERSIS SAMA dengan
   HIQUE2.BAS di koleksi yang sama. Yang berbeda cuma dua hal, dan keduanya
   layak dibandingkan berdampingan.

   ------------------------------------------------------------------------
   1. MASUKANNYA KURSOR, BUKAN NOMOR

   HIQUE2 meminta pemain mengetik nomor lubang (atau memakai light pen).
   PEGLEAP memakai kursor yang digerakkan tombol panah:

       410 KEY(11) ON:KEY(12) ON:KEY(13) ON:KEY(14) ON
       430 ON KEY(11) GOSUB 500     ' panah atas
       440 ON KEY(12) GOSUB 540     ' panah kiri
       450 ON KEY(13) GOSUB 580     ' panah kanan
       460 ON KEY(14) GOSUB 620     ' panah bawah
       470 MOVE$=INKEY$:IF MOVE$<>CHR$(13) THEN 410

   Dan posisi kursornya dibaca kembali dari POSISI KURSOR LAYAR:

       480 XCOORD=(POS(0)-10)/6
       490 YCOORD=(CSRLIN/3)+1

   Itu pola yang sudah dicatat di koleksi ini sebagai yang TIDAK ditiru:
   tampilan dijadikan sumber kebenaran. Di sini koordinat kursor disimpan
   sebagai data biasa, dan layar digambar dari data itu.

   ------------------------------------------------------------------------
   2. KISINYA SEMBILAN KOLOM, DAN ITU YANG MENYELAMATKANNYA

   Papan disimpan sebagai `DIM B(70)` — larik lurus selebar sembilan.
   Aturan lompatnya aritmetika murni:

       840 IF ((Z+P)/2)=INT((Z+P)/2) THEN 850 ELSE <tolak>   ' titik tengah bulat
       850 IF (ABS(Z-P)-2)*(ABS(Z-P)-18)<>0 THEN <tolak>     ' 2 = mendatar
                                                             ' 18 = menegak
       820 IF B(P)=0 OR B(P)=-7 THEN <tolak>                 ' 0 = bukan lubang

   Aritmetika indeks seperti ini biasanya membungkus tepi: dari kolom 8,
   `+2` mendarat di kolom 1 baris berikutnya. Tapi salibnya hanya memakai
   kolom 2..8 — kolom 0 dan 1 TIDAK PERNAH jadi lubang, jadi `B()`-nya nol
   dan baris 820 menolaknya.

   Diperiksa: aturan ini menerima tepat 76 lompatan, sama persis dengan yang
   mungkin secara geometris. Nol lompatan liar.

   Bandingkan HIQUE2, yang memakai kisi maya selebar TUJUH — mepet, tanpa
   kolom cadangan — dan menerima 84 lompatan, delapan di antaranya mustahil.

   Tiga program, satu masalah, tiga jawaban:

       TICTAC   pagar tersurat   papan 3x3 di larik 5x5, nilai penjaga 3
       PEGLEAP  pagar tersirat   kisi 9 kolom, sel bukan-lubang bernilai 0
       HIQUE2   tidak ada        kisi 7 kolom mepet  ->  8 lompatan liar

   Yang perlu dinyatakan jujur: pagar PEGLEAP mungkin tidak disengaja. Lebar
   sembilan bisa saja dipilih karena enak dihitung. Ia benar — tapi benar
   dengan cara yang sama rapuhnya dengan bug cakram di TOWERS: aman karena
   kebetulan, bukan karena dijaga.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const W = 9;                             // lebar larik B(), bukan lebar salib
  const ROWS = 8;                          // baris 1..7 dipakai; 0 disisakan

  /* Baris 340-360: ke-33 indeks lubang di dalam B(70). */
  const HOLES = [13, 14, 15, 22, 23, 24, 29, 30, 31, 32, 33, 34, 35,
                 38, 39, 40, 41, 42, 43, 44, 47, 48, 49, 50, 51, 52, 53,
                 58, 59, 60, 67, 68, 69];
  const CENTER = 41;                       // baris 330: B(41)=-3
  const HOLE = new Set(HOLES);

  const rowOf = (i) => Math.floor(i / W);
  const colOf = (i) => i % W;

  /* Kolom pertama dan terakhir yang benar-benar dipakai salibnya — dihitung
     dari HOLES, bukan ditulis 2 dan 8. Papan digambar sebatas rentang ini;
     kolom 0 dan 1 milik larik, bukan milik permainan. Lihat pegleap.css untuk
     alasan lengkapnya. */
  const C0 = Math.min(...HOLES.map(colOf));
  const C1 = Math.max(...HOLES.map(colOf));

  /* Lompatan menurut aturan aslinya, dibangkitkan ulang di sini — bukan
     ditulis sebagai daftar tetap. Kalau lebar kisinya diubah, jumlahnya
     ikut berubah, dan bugnya (kalau muncul) langsung terlihat. */
  const JUMPS = [];
  HOLES.forEach(a => HOLES.forEach(b => {
    if (a === b) return;
    if ((a + b) % 2) return;               // baris 840: titik tengah harus bulat
    const d = Math.abs(a - b);
    if (d !== 2 && d !== 18) return;       // baris 850
    const over = (a + b) / 2;
    if (!HOLE.has(over)) return;           // baris 820: B(P)=0 -> bukan lubang
    JUMPS.push({ from: a, over, to: b });
  }));

  /* --------------------------------------------------------------------
     Keadaan
     -------------------------------------------------------------------- */
  const db = store('pegleap');
  let pegs, sel, cur, moves, history, phase;

  const legalFrom = (n) => JUMPS.filter(j =>
    j.from === n && pegs.has(j.from) && pegs.has(j.over) && !pegs.has(j.to));
  const anyLegal = () => JUMPS.some(j =>
    pegs.has(j.from) && pegs.has(j.over) && !pegs.has(j.to));

  function reset() {
    pegs = new Set(HOLES);
    pegs.delete(CENTER);
    sel = null; cur = CENTER; moves = 0; history = []; phase = 'play';
    draw();
    say('Gerakkan kursor dengan panah, Enter untuk memilih.');
  }

  /* --------------------------------------------------------------------
     Gambar.

     Papan main memakai kolom C0..C1 saja, supaya salibnya terpusat. Larik
     penuh sembilan kolom tetap digambar utuh di `#grid` — di sanalah pagar
     itu ditunjukkan, lengkap dengan nilai nolnya.
     -------------------------------------------------------------------- */
  const board = ui.el('div', { class: 'g-board' });
  board.style.gridTemplateColumns = 'repeat(' + (C1 - C0 + 1) + ', var(--peg))';
  $('board').append(board);
  const grid = ui.el('div', { class: 'g-grid' });
  $('grid').append(grid);

  function draw() {
    const targets = sel === null ? [] : legalFrom(sel);
    board.textContent = '';
    grid.textContent = '';

    for (let r = 1; r < ROWS; r++) {
      for (let c = C0; c <= C1; c++) {
        const i = r * W + c;
        if (!HOLE.has(i)) {
          board.append(ui.el('div', { class: 'g-hole g-hole--void' }));
          continue;
        }
        const cls = ['g-hole'];
        if (i === sel) cls.push('g-hole--sel');
        if (i === cur) cls.push('g-hole--cur');
        if (targets.some(j => j.to === i)) cls.push('g-hole--to');
        const cell = ui.el('div', { class: cls.join(' '), title: 'B(' + i + ')' });
        if (pegs.has(i)) cell.append(ui.el('div', { class: 'g-peg' }));
        cell.addEventListener('click', () => { cur = i; tap(i); });
        board.append(cell);
      }
    }

    /* Larik B() apa adanya, termasuk sel yang tidak pernah jadi lubang.
       Dibaca dari keadaan yang sama dengan papannya, jadi mustahil melenceng. */
    for (let r = 1; r < ROWS; r++) {
      for (let c = 0; c < W; c++) {
        const i = r * W + c;
        const kind = !HOLE.has(i) ? 'void' : pegs.has(i) ? 'peg' : 'free';
        grid.append(ui.el('div', {
          class: 'g-cell g-cell--' + kind,
          text: !HOLE.has(i) ? '0' : pegs.has(i) ? '-7' : '-3',
          title: 'B(' + i + ')  baris ' + r + ' kolom ' + c
        }));
      }
    }

    $('sPegs').textContent = pegs.size;
    $('sMoves').textContent = moves;
    $('undo').disabled = history.length === 0;
  }

  function say(text, kind) {
    $('say').textContent = text;
    $('say').className = 'g-say' + (kind ? ' g-say--' + kind : '');
  }

  /* --------------------------------------------------------------------
     Langkah
     -------------------------------------------------------------------- */
  function tap(n) {
    if (phase !== 'play' || !HOLE.has(n)) return;
    if (sel !== null) {
      const j = legalFrom(sel).find(x => x.to === n);
      if (j) return apply(j);
      if (n === sel) { sel = null; draw(); return say('Pilihan dibatalkan.'); }
    }
    if (!pegs.has(n)) { draw(); return say('Lubang itu kosong.', 'bad'); }
    if (!legalFrom(n).length) {
      sel = null; draw();
      return say('Pasak itu tidak punya lompatan.', 'bad');
    }
    sel = n; draw();
    say('Pilih lubang tujuannya.');
  }

  function apply(j) {
    history.push(j);
    pegs.delete(j.from); pegs.delete(j.over); pegs.add(j.to);
    moves++; sel = null; cur = j.to;
    audio.play('MB T240 O3 L32 g', { fresh: true });
    draw();
    check();
  }

  function undo() {
    const j = history.pop();
    if (!j) return;
    pegs.add(j.from); pegs.add(j.over); pegs.delete(j.to);
    moves--; sel = null; phase = 'play';
    draw();
    say('Satu lompatan dibatalkan.');
  }

  function check() {
    if (pegs.size === 1) {
      phase = 'over';
      say('Satu pasak tersisa, di B(' + Array.from(pegs)[0] + ').');
      audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true });
      return record();
    }
    if (!anyLegal()) {
      phase = 'over';
      say('Tidak ada lompatan lagi. Tersisa ' + pegs.size + ' pasak.', 'bad');
      return record();
    }
    say('Gerakkan kursor dengan panah, Enter untuk memilih.');
  }

  function record() {
    const best = db.get('best', null);
    if (best === null || pegs.size < best) {
      db.set('best', pegs.size); showBest();
      ui.toast('Rekor baru: tersisa ' + pegs.size + ' pasak.');
    }
  }
  const showBest = () => {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b;
  };

  /* --------------------------------------------------------------------
     Kursor panah.

     Aslinya membaca posisinya kembali dari POS(0) dan CSRLIN — posisi kursor
     LAYAR (baris 480-490). Di sini `cur` adalah data biasa, dan layar
     digambar darinya. Arahnya sama; sumber kebenarannya terbalik.
     -------------------------------------------------------------------- */
  function move(dr, dc) {
    let r = rowOf(cur), c = colOf(cur);
    for (let k = 0; k < W; k++) {           // lompati sel yang bukan lubang
      r += dr; c += dc;
      const i = r * W + c;
      if (r < 1 || r >= ROWS || c < 0 || c >= W) return;
      if (HOLE.has(i)) { cur = i; draw(); return; }
    }
  }

  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const k = e.key;
    if (k === 'ArrowUp')    { e.preventDefault(); return move(-1, 0); }
    if (k === 'ArrowDown')  { e.preventDefault(); return move(1, 0); }
    if (k === 'ArrowLeft')  { e.preventDefault(); return move(0, -1); }
    if (k === 'ArrowRight') { e.preventDefault(); return move(0, 1); }
    if (k === 'Enter' || k === ' ') { e.preventDefault(); return tap(cur); }
    if (k === 'z' || k === 'Z') { e.preventDefault(); return undo(); }
  });

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Peg Leap',
    source: 'PEGLEAP.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  $('undo').addEventListener('click', undo);
  $('restart').addEventListener('click', reset);
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah pasak tersisa terbaik dihapus.')) return;
    db.set('best', null); showBest();
  });

  /* Angka di panel dihitung, bukan ditulis — kalau lebar kisinya diubah,
     angkanya ikut berubah dan klaimnya tidak jadi bohong. */
  $('cOrig').textContent = JUMPS.length;
  $('cWild').textContent = JUMPS.filter(j => {
    const dr = Math.abs(rowOf(j.to) - rowOf(j.from));
    const dc = Math.abs(colOf(j.to) - colOf(j.from));
    return !((dr === 0 && dc === 2) || (dr === 2 && dc === 0));
  }).length;

  showBest();
  reset();
})();
