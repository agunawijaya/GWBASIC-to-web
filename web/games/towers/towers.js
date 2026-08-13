/* ===========================================================================
   towers.js — port dari TOWERS.BAS
   (Friendlyware PC Introductory Set, 1982; pembaruan terakhir 1 Sep 1982).

   Menara Hanoi delapan cakram, dengan dua kekhasan yang membedakannya dari
   hampir semua versi lain:

     1. Cakram dimulai di tiang TENGAH, bukan di tiang paling kiri.
        (baris 890: `FOR A=0 TO 8: TW(2,A)=A`)

     2. Tujuannya boleh tiang luar YANG MANA SAJA.
        (baris 1380-1430 menghitung tiang 1 dan tiang 3, menang kalau salah
        satunya berisi delapan)

   Keduanya terlihat seperti kelonggaran, dan bukan: jumlah langkah minimumnya
   tetap 2^8 - 1 = 255. Kebebasan memilih tujuan tidak menghemat satu langkah
   pun, karena begitu cakram terbesar bergerak, tujuannya sudah terkunci.

   YANG TIDAK ADA DI PROGRAM ASLINYA
   ---------------------------------
   Penyelesaiannya. Program 1982 ini hanya wasit: ia memeriksa langkah,
   menghitung, dan mengumumkan kemenangan. Yang memecahkan teka-tekinya adalah
   pemain.

   Padahal Menara Hanoi adalah contoh baku rekursi, dan penyelesaiannya muat
   dalam empat baris. Jadi di sini ditambahkan — bukan untuk mempermudah,
   melainkan karena inilah satu-satunya program di koleksi yang teka-tekinya
   PUNYA rumus tertutup yang layak diperlihatkan.

   SATU BUG YANG TIDAK PERNAH MELEDAK
   ----------------------------------
   Baris 540: `IF TW(PL,DK)>HOLD THEN TW(PL,DK-1)=HOLD`

   Kalau `DK` bernilai 1, ia menulis ke `TW(PL,0)` — baris nol, yang tidak
   pernah digambar. Cakramnya akan lenyap. Itu tidak pernah terjadi, tapi
   bukan karena dijaga: `DK=1` berarti tiang tujuan sudah penuh delapan
   cakram, dan kalau delapan cakram ada di sana, tidak ada yang bisa dipegang.

   Aman karena aritmetika, bukan karena diperiksa. Perbedaannya penting: yang
   pertama patah diam-diam begitu jumlah cakramnya diubah.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, wait } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';

  const N = 8;                             // jumlah cakram, seperti aslinya
  const START = 1;                         // tiang tengah (indeks 0,1,2)
  const MIN_MOVES = Math.pow(2, N) - 1;    // 255

  /* --- geometri --- */
  const W = 720, H = 300;
  const POST_X = [120, 360, 600];
  const BASE_Y = 262, DISC_H = 23, TOP_Y = 56;
  const widthOf = (s) => 46 + s * 21;      // cakram 1 = 67 px, cakram 8 = 214 px

  const mk = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  /* --------------------------------------------------------------------
     Keadaan.

     Tiap tiang adalah larik ukuran cakram, dari BAWAH ke atas. Dengan begitu
     "cakram teratas" selalu elemen terakhir, dan aturan permainan jadi satu
     baris: boleh ditaruh kalau tujuannya kosong atau puncaknya lebih besar.

     Aslinya memakai `TW(tiang, baris)` dengan baris tetap 1..8 dan nol
     berarti kosong — perlu memindai untuk menemukan puncak (baris 420-440).
     Larik bertumpuk menghapus pemindaian itu sepenuhnya.
     -------------------------------------------------------------------- */
  let pegs, moves, held, sel, phase;

  function reset() {
    pegs = [[], [], []];
    for (let s = N; s >= 1; s--) pegs[START].push(s);   // terbesar di dasar
    moves = 0;
    held = null;                           // ukuran cakram yang sedang dipegang
    drag = null;
    sel = START;                           // posisi penunjuk `**`
    phase = 'play';                        // play | solving | won
    layout();
    setDepth(0, []);
    say('Position Flashing Star Above Target Disk');
    $('sMove').textContent = 0;
  }

  const canDrop = (peg, size) =>
    pegs[peg].length === 0 || pegs[peg][pegs[peg].length - 1] > size;

  /* --------------------------------------------------------------------
     Gambar
     -------------------------------------------------------------------- */
  const svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'w-board',
                          role: 'img', 'aria-label': 'Tiga tiang Menara Hanoi' });
  const discNodes = new Map();             // ukuran -> <g>
  const highlights = [];
  let star;

  (function build() {
    svg.append(mk('rect', { class: 'w-base', x: 40, y: BASE_Y, width: W - 80,
                            height: 10, rx: 5 }));
    POST_X.forEach((x, i) => {
      svg.append(mk('rect', { class: 'w-post', x: x - 5, y: TOP_Y - 8,
                              width: 10, height: BASE_Y - TOP_Y + 8, rx: 5 }));
      const zone = mk('rect', { class: 'w-zone', x: x - 118, y: TOP_Y - 20,
                                width: 236, height: BASE_Y - TOP_Y + 30 });
      zone.setAttribute('tabindex', '0');
      zone.addEventListener('pointerdown', e => onDown(i, e));
      zone.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(i); }
      });
      const hl = mk('rect', { class: 'w-hl', x: x - 118, y: TOP_Y - 20,
                              width: 236, height: BASE_Y - TOP_Y + 30, rx: 10 });
      svg.append(zone, hl);
      highlights.push(hl);
    });

    /* Warna cakram bergerak sepanjang roda warna menurut ukuran.
       Aslinya SEMUA cakram merah muda (COLOR 12) dan dibedakan hanya oleh
       lebarnya. Itu cukup di layar 80x25, tapi di layar yang lebih besar
       warna membuat "mana yang lebih besar" terbaca tanpa mengukur. */
    for (let s = 1; s <= N; s++) {
      const g = mk('g', { class: 'w-disc' });
      const w = widthOf(s);
      g.append(mk('rect', { x: -w / 2, y: 0, width: w, height: DISC_H - 3,
                            rx: (DISC_H - 3) / 2,
                            fill: 'hsl(' + (18 + s * 26) + ' 62% 58%)' }));
      const t = mk('text', { x: 0, y: DISC_H / 2 + 2 });
      t.textContent = s;
      g.append(t);
      svg.append(g);
      discNodes.set(s, g);
    }

    star = mk('text', { class: 'w-star', x: POST_X[START], y: TOP_Y - 26 });
    star.textContent = '**';
    svg.append(star);
    $('board').append(svg);
  })();

  /** Tempatkan setiap cakram menurut keadaan. Gambar diturunkan dari data. */
  function layout() {
    pegs.forEach((stack, p) => {
      stack.forEach((size, level) => {
        discNodes.get(size).setAttribute('transform',
          'translate(' + POST_X[p] + ',' + (BASE_Y - (level + 1) * DISC_H) + ')');
        discNodes.get(size).classList.remove('is-held');
      });
    });
    if (held !== null) {
      const g = discNodes.get(held);
      /* Sedang diseret -> ikut penunjuk. Dipegang tanpa diseret (mode klik
         dua tahap) -> melayang di atas tiang yang sedang disorot. */
      const p = (drag && drag.moved) ? drag.pos
                                     : { x: POST_X[sel], y: TOP_Y - 4 };
      g.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ')');
      g.classList.add('is-held');
      /* Transisi dimatikan selama diseret. Kalau tidak, cakramnya selalu
         tertinggal seperempat detik di belakang jari - terasa seperti macet,
         bukan seperti animasi. */
      g.classList.toggle('is-drag', !!(drag && drag.moved));
    }
    star.setAttribute('x', POST_X[sel]);
    highlights.forEach((h, i) => {
      const on = i === sel && held !== null;
      /* Bukan `bad` — nama itu sudah dipakai fungsi pesan galat di bawah,
         dan membayanginya di sini adalah cara termudah membuat orang
         berikutnya salah baca. */
      const blocked = on && !!drag && !canDrop(i, held) && i !== drag.from;
      h.classList.toggle('is-sel', on && !blocked);
      h.classList.toggle('is-bad', blocked);
    });
  }

  function say(text, kind) {
    $('say').textContent = text;
    $('say').className = 'w-say' + (kind ? ' w-say--' + kind : '');
  }

  /* --------------------------------------------------------------------
     MENYERET

     Aslinya mustahil: IBM PC 1982 tidak punya tetikus, dan seluruh masukannya
     lewat `INKEY$`. Jadi ini tambahan penuh - tapi tambahan yang TIDAK
     menggantikan cara lama, melainkan menumpang di atasnya.

     Ketiganya hidup berdampingan:
       - seret        : tekan di tiang, geser, lepas di tiang tujuan
       - klik dua kali: klik tiang asal, lalu klik tiang tujuan (seperti 1982)
       - papan ketik  : panah kiri/kanan + Enter (persis baris 290-310)

     Yang membuat ketiganya muat dalam satu jalur kode: tekanan yang dilepas
     TANPA digeser diperlakukan sebagai "ambil", bukan "ambil lalu kembalikan".
     Jadi mode klik dua tahap muncul sendiri dari mesin seret yang sama, bukan
     dari cabang terpisah yang harus dijaga sejalan.

     Tiang tujuan dicari dari JARAK MENDATAR TERDEKAT, bukan dari elemen apa
     yang kebetulan ada di bawah penunjuk. Itu jauh lebih pemaaf: melepas
     cakram sedikit di atas atau di bawah papan tetap masuk ke tiang yang
     benar, dan tidak ada "zona mati" di antara tiang.
     -------------------------------------------------------------------- */
  let drag = null;      // {from, moved, pos, id}

  /** Ubah koordinat layar jadi koordinat viewBox SVG. */
  function toSvg(e) {
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint ? svg.createSVGPoint() : new DOMPoint(0, 0);
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  const pegAt = (x) => {
    let best = 0, bd = Infinity;
    POST_X.forEach((px, i) => {
      const d = Math.abs(px - x);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  };

  function onDown(peg, e) {
    if (phase !== 'play') return;
    // Sudah memegang cakram (dari klik sebelumnya): tekanan ini adalah tujuan.
    if (held !== null) { sel = peg; return tap(peg); }
    if (!pegs[peg].length) { sel = peg; layout(); bad('Tiang itu kosong.'); return; }

    e.preventDefault();
    sel = peg;
    held = pegs[peg].pop();
    drag = { from: peg, moved: false, id: e.pointerId,
             pos: { x: POST_X[peg], y: TOP_Y - 4 } };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
    audio.play('MB T240 O3 L32 e', { fresh: true });
    say('Position Flashing Star Above Target Tower');
    layout();
  }

  window.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = toSvg(e);
    /* Ambang enam satuan supaya getaran jari saat mengklik tidak dianggap
       seretan - tanpa itu, mode klik dua tahap praktis tidak bisa dipakai
       di layar sentuh. */
    if (!drag.moved && Math.abs(p.x - POST_X[drag.from]) < 6 &&
        Math.abs(p.y - (TOP_Y - 4)) < 6) return;
    drag.moved = true;
    drag.pos = { x: p.x, y: p.y - DISC_H / 2 };
    sel = pegAt(p.x);
    layout();
  });

  window.addEventListener('pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    const to = d.moved ? pegAt(toSvg(e).x) : d.from;
    drag = null;
    if (held !== null) discNodes.get(held).classList.remove('is-drag');

    if (!d.moved) { sel = d.from; layout(); return; }   // tekan-lepas = mode klik

    if (to === d.from) {                 // dikembalikan ke asalnya: bukan langkah
      pegs[d.from].push(held);
      held = null;
      say('Position Flashing Star Above Target Disk');
      layout();
      return;
    }
    if (!canDrop(to, held)) {            // baris 540: yang besar tidak boleh
      pegs[d.from].push(held);           // menimpa yang kecil
      held = null;
      layout();
      bad('Invalid Move. Please Try Again.');
      return;
    }
    place(to);
  });

  /* --------------------------------------------------------------------
     Langkah pemain.

     Aslinya dua tahap: pilih tiang asal, lalu tiang tujuan (baris 410-570).
     Dipertahankan, karena tahap itulah yang membuat aturan "hanya cakram
     teratas" terasa — Anda memegang satu cakram, bukan menyeret tumpukan.
     -------------------------------------------------------------------- */
  function tap(peg) {
    if (phase !== 'play') return;
    sel = peg;
    if (held === null) {
      if (!pegs[peg].length) { bad('Tiang itu kosong.'); return; }
      held = pegs[peg].pop();
      say('Position Flashing Star Above Target Tower');
      audio.play('MB T240 O3 L32 e', { fresh: true });
    } else {
      if (!canDrop(peg, held)) {
        // baris 610-630, pesan aslinya dipertahankan apa adanya
        bad('Invalid Move. Please Try Again.');
        layout();
        return;
      }
      place(peg);
    }
    layout();
  }

  /** Letakkan cakram yang dipegang. Satu-satunya tempat `moves` bertambah -
      jadi tidak mungkin ada jalur masukan yang lupa menghitung langkahnya. */
  function place(peg) {
    pegs[peg].push(held);
    held = null;
    moves++;
    $('sMove').textContent = moves;
    audio.play('MB T240 O3 L32 c', { fresh: true });
    say('Position Flashing Star Above Target Disk');
    layout();
    checkWin();
  }

  function bad(msg) {
    say(msg, 'bad');
    audio.sound(160, 2);
    setTimeout(() => {
      if (phase === 'play') say(held === null ? 'Position Flashing Star Above Target Disk'
                                              : 'Position Flashing Star Above Target Tower');
    }, 1400);
  }

  /* baris 1380-1430: menang kalau tiang luar mana pun berisi delapan */
  function checkWin() {
    if (pegs[0].length !== N && pegs[2].length !== N) return false;
    phase = 'won';
    say('You Made It In ' + moves + ' Moves');
    const best = db.get('best', null);
    if (best === null || moves < best) {
      db.set('best', moves);
      showBest();
      ui.toast(moves === MIN_MOVES
        ? 'Sempurna — 255 langkah, tidak mungkin lebih pendek.'
        : 'Rekor baru: ' + moves + ' langkah.');
    }
    // baris 1410 aslinya tidak berbunyi apa-apa; ini tambahan
    ['O3 L16 c e g', 'O4 L16 c'].forEach((m, i) =>
      setTimeout(() => audio.play(m, { fresh: i === 0 }), i * 260));
    return true;
  }

  /* --------------------------------------------------------------------
     Penyelesai rekursif.

     Daftar langkah dibangkitkan LEBIH DULU, seluruhnya, lalu diputar. Bukan
     rekursi yang dijeda di tengah jalan — itu akan menuntut penulisan ulang
     jadi mesin keadaan, dan justru menghapus hal yang mau diperlihatkan.

     Kedalaman ikut dicatat supaya bisa digambar. Kedalaman maksimumnya
     persis jumlah cakram: rekursi ini turun satu tingkat per cakram, tidak
     pernah lebih.
     -------------------------------------------------------------------- */
  function solveMoves(n, from, to, via, depth, out) {
    if (n === 0) return out;
    solveMoves(n - 1, from, via, to, depth + 1, out);
    out.push({ size: n, from, to, depth });
    solveMoves(n - 1, via, to, from, depth + 1, out);
    return out;
  }

  function setDepth(d, stack) {
    $('sDepth').textContent = d;
    const host = $('trace');
    host.textContent = '';
    stack.forEach((s, i) => {
      const row = ui.el('div', { class: 'w-trace__row' });
      row.append(ui.el('span', { class: 'w-trace__d', text: i + 1 }));
      const bar = ui.el('div', { class: 'w-trace__bar', text: s });
      bar.style.width = Math.max(12, 100 - i * 10) + '%';
      row.append(bar);
      host.append(row);
    });
  }

  let solveToken = 0;

  async function autoSolve() {
    if (phase === 'solving') return;
    const my = ++solveToken;
    reset();
    phase = 'solving';
    $('solve').disabled = true;
    $('stopSolve').disabled = false;

    const plan = solveMoves(N, START, 2, 0, 1, []);
    say('Menjalankan penyelesaian rekursif — ' + plan.length + ' langkah');

    for (const m of plan) {
      if (my !== solveToken) return;
      sel = m.to;
      pegs[m.to].push(pegs[m.from].pop());
      moves++;
      $('sMove').textContent = moves;
      layout();
      setDepth(m.depth, ['pindah(' + (N - m.depth + 1) + ')'].concat(
        Array.from({ length: m.depth - 1 }, (_, k) => 'pindah(' + (N - m.depth + 2 + k) + ')')));
      audio.play('MB T255 O' + (2 + (m.size > 4 ? 0 : 1)) + ' L64 c', { fresh: true });
      await wait(Math.max(14, 160 - plan.length / 6));
    }
    if (my !== solveToken) return;
    phase = 'play';
    $('solve').disabled = false;
    $('stopSolve').disabled = true;
    checkWinAfterSolve();
  }

  /* Penyelesaian otomatis TIDAK boleh mencatat rekor: itu bukan permainan
     Anda. Yang ditampilkan cuma hasilnya. */
  function checkWinAfterSolve() {
    phase = 'won';
    say('Selesai dalam ' + moves + ' langkah — dan 255 adalah yang terpendek.');
  }

  function stopSolve() {
    solveToken++;
    phase = 'play';
    $('solve').disabled = false;
    $('stopSolve').disabled = true;
    say('Dihentikan. Anda bisa melanjutkan dari posisi ini.');
  }

  /* --- rekor --- */
  const db = store('towers');
  function showBest() {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b;
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Towers of Atlantis',
    source: 'TOWERS.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  $('solve').addEventListener('click', autoSolve);
  $('stopSolve').addEventListener('click', stopSolve);
  $('restart').addEventListener('click', () => { solveToken++; reset(); });
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah langkah terbaik dihapus.')) return;
    db.set('best', null);
    showBest();
  });

  /* Panah kiri/kanan dan Enter, persis seperti baris 290-310 —
     yang di sana membaca CHR$(75) dan CHR$(77) dari kode pindaian. */
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey || phase !== 'play') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); sel = Math.max(0, sel - 1); layout(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); sel = Math.min(2, sel + 1); layout(); }
    if (e.key === 'Enter') { e.preventDefault(); tap(sel); }
  });

  showBest();
  reset();
})();
