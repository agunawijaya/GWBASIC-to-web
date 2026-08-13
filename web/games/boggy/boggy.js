/* ===========================================================================
   boggy.js — port dari BOGGY.BAS (Friendlyware, 1982; menu #1 pilihan T).

   Kisi 10x10, tiga sasaran tersembunyi, sepuluh tebakan. Tiap tebakan
   dijawab dengan ARAH MATA ANGIN untuk tiap sasaran yang masih hidup:

       660 IF ROW=R(I) AND COL<C(I) THEN PRINT"East For No" I
       700 IF ROW<R(I) AND COL<C(I) THEN PRINT"Southeast For No" I
       ...

   Delapan baris `IF`, satu per arah. Tidak ada jarak, tidak ada "panas atau
   dingin" — hanya arah. Itu keputusan rancangan yang bagus: arah menyempitkan
   ruang jauh lebih cepat daripada kedekatan, dan tiga sasaran sekaligus
   membuat tiap tebakan membawa tiga potong informasi.

   ------------------------------------------------------------------------
   BUG: PENGACAK YANG DISEMAI ULANG DI DALAM PENOLAKAN

       310 RANDOMIZE(VAL(RIGHT$(TIME$,2)))
       320 FOR I=1 TO 3
       330     R(I)=FIX(RND(I)*10)
       350     C(I)=FIX(RND(J)*10)
       360 NEXT
       370 IF <dua sasaran bertumpuk> THEN 310

   Baris 370 menolak undian yang menaruh dua sasaran di sel yang sama, lalu
   mengulang dari baris 310 — yang MENYEMAI ULANG dari detik jam yang sama.

   Benih yang sama menghasilkan undian yang sama, yang ditolak lagi, yang
   mengulang lagi. Program berputar sampai detik pada jam berganti.

   Jadi ia tidak menggantung selamanya — tapi bisa membakar prosesor sampai
   satu detik penuh, dan yang lebih penting: penolakannya TIDAK BEKERJA.
   Ia tidak mengambil undian baru; ia mengambil undian yang sama berulang
   kali sampai waktunya berubah.

   Perbaikannya satu baris: pindahkan `RANDOMIZE` ke atas baris 310 supaya
   pengulangan hanya mengulang pengundiannya, bukan penyemaiannya.

   Ini kemunculan KELIMA `RANDOMIZE VAL(RIGHT$(TIME$,2))` di koleksi ini,
   dan bentuk salahnya berbeda di tiap program:

       MASTER   di dalam perulangan angka rahasia
       MAZE     dua kali dari keluarannya sendiri
       MAXIT1   dua kali dari sumber yang sama
       WILDCAT  dari keluarannya sendiri
       BOGGY    di dalam gelung penolakan
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, rng, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const N = 10, TARGETS = 3, GUESSES = 10;
  const DEAD = 99;                          // baris 640: R(I)=99

  const db = store('boggy');
  const r = rng();
  let R, C, alive, guess, hist, phase, tries;

  /* Pengundian dengan penolakan — bentuk aslinya dipertahankan, tapi
     penyemaiannya di LUAR gelung. Lihat catatan di kepala berkas. */
  function deal() {
    tries = 0;
    for (;;) {
      tries++;
      R = []; C = [];
      for (let i = 0; i < TARGETS; i++) { R.push(r.int(N)); C.push(r.int(N)); }
      const clash = (a, b) => R[a] === R[b] && C[a] === C[b];
      if (!(clash(0, 1) || clash(1, 2) || clash(2, 0))) break;   // baris 370
    }
    alive = [true, true, true];
    guess = 0; hist = []; phase = 'play';
  }

  /* Delapan arah, baris 660-730. Ditulis sebagai dua sumbu, bukan delapan
     `IF` — hasilnya sama, tapi tidak ada cabang yang bisa terlewat. */
  function hintFor(i, row, col) {
    const ns = row < R[i] ? 'South' : row > R[i] ? 'North' : '';
    const ew = col < C[i] ? 'East' : col > C[i] ? 'West' : '';
    return (ns + ew) || null;               // null = tepat sasaran
  }

  function shoot(row, col) {
    if (phase !== 'play') return;
    guess++;
    const lines = [];
    let hit = false;
    for (let i = 0; i < TARGETS; i++) {
      if (!alive[i]) { lines.push({ i, text: "You've Killed Number " + (i + 1), dead: true }); continue; }
      const h = hintFor(i, row, col);
      if (h === null) {
        alive[i] = false; hit = true;
        lines.push({ i, text: 'You Just Killed Number ' + (i + 1), kill: true });
      } else {
        lines.push({ i, text: 'GO ' + h + ' For No ' + (i + 1) });
      }
    }
    hist.unshift({ row, col, lines, n: guess });
    audio.play(hit ? 'MB T200 O3 L16 c e g' : 'MB T240 O2 L32 c', { fresh: true });

    if (alive.every(a => !a)) { phase = 'won'; }
    else if (guess >= GUESSES) { phase = 'lost'; }
    draw();

    if (phase === 'won') {
      say('Congratulations, You Win — in only ' + guess + ' guesses.', 'big');
      const best = db.get('best', null);
      if (best === null || guess < best) { db.set('best', guess); showBest(); }
      audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true });
    } else if (phase === 'lost') {
      say('Sepuluh tebakan habis.', 'bad');
      taps();
    }
  }

  /* Baris 800-840: "TAPS" — panggilan sangkakala pemakaman militer, dimainkan
     saat pemain kalah. Kelima barisnya disalin apa adanya, termasuk tempo,
     artikulasi (`ML`/`MN`), dan perpindahan oktafnya.

     Versi pertama port ini hanya menyalin dua baris pertama dan berhenti di
     tengah lagu — ketahuan hanya karena nomor barisnya diperiksa ulang. */
  const TAPS = [
    'T140 MN MB',
    'O3L8C.L16C L2F.L8C.L16F',
    'L2A.L8C.L16F L4A L8C. L16F L4A L8C. L16F L2A.',
    'O3 L8F.L16A ML O4L2C MN O3L4AL4FL2C.',
    'O3L8C.L16C ML L1F MN L4F'
  ].join(' ');

  function taps() { audio.play(TAPS, { fresh: true }); }

  /* --------------------------------------------------------------------
     Gambar
     -------------------------------------------------------------------- */
  function draw() {
    const host = $('grid');
    host.textContent = '';
    const g = ui.el('div', { class: 'y-grid' });
    const shots = new Set(hist.map(h => h.row + ',' + h.col));
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const key = i + ',' + j;
      const cls = ['y-c'];
      if (shots.has(key)) cls.push('y-c--shot');
      let label = '';
      // Sasaran hanya ditampilkan kalau sudah mati, atau permainan selesai.
      for (let t = 0; t < TARGETS; t++) {
        if (R[t] === i && C[t] === j && (!alive[t] || phase !== 'play')) {
          cls.push(alive[t] ? 'y-c--miss' : 'y-c--kill');
          label = String(t + 1);
        }
      }
      const cell = ui.el('div', { class: cls.join(' '), text: label,
                                  title: 'baris ' + i + ', kolom ' + j });
      if (phase === 'play') cell.addEventListener('click', () => shoot(i, j));
      g.append(cell);
    }
    host.append(g);

    const log = $('log');
    log.textContent = '';
    if (!hist.length) {
      log.append(ui.el('p', { class: 'y-empty',
        text: 'Tiap tebakan dijawab arah untuk ketiga monster. '
            + 'Jawabannya muncul di sini, yang terbaru di atas.' }));
    }
    // Baris 100 memakai `unshift`, jadi hist SUDAH terbaru-di-depan: jawaban
    // yang baru saja didapat selalu di puncak kotak, tidak perlu digulung
    // untuk dilihat. Jangan dibalik "supaya kronologis" -- itu justru
    // mendorong jawaban terbaru ke bawah lipatan.
    hist.forEach(h => {
      const box = ui.el('div', { class: 'y-turn' });
      box.append(ui.el('div', { class: 'y-turn__h',
        text: 'Tebakan ' + h.n + ' — (' + h.row + ', ' + h.col + ')' }));
      h.lines.forEach(l => box.append(ui.el('div', {
        class: 'y-line' + (l.kill ? ' y-line--kill' : l.dead ? ' y-line--dead' : ''),
        text: l.text })));
      log.append(box);
    });

    $('sGuess').textContent = guess + ' / ' + GUESSES;
    $('sLeft').textContent = alive.filter(Boolean).length;
    $('sTries').textContent = tries;
  }

  function say(t, kind) {
    $('say').textContent = t;
    $('say').className = 'y-say' + (kind ? ' y-say--' + kind : '');
  }

  const showBest = () => {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b;
  };

  function newGame() {
    deal(); draw();
    say('Klik satu sel. Tiap tebakan dijawab arah untuk ketiga sasaran.');
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Boggy Marsh',
    source: 'BOGGY.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));
  $('restart').addEventListener('click', newGame);
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah tebakan terbaik dihapus.')) return;
    db.set('best', null); showBest();
  });

  /* Aslinya membaca DUA angka berurutan lewat INKEY$ (baris 510-570):
     yang pertama baris, yang kedua kolom. Dipertahankan sebagai alternatif. */
  let pending = null;
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey || phase !== 'play') return;
    const n = parseInt(e.key, 10);
    if (isNaN(n)) return;
    e.preventDefault();
    if (pending === null) { pending = n; say('Baris ' + n + ' — sekarang kolomnya.'); }
    else { const rw = pending; pending = null; shoot(rw, n); }
  });

  showBest();
  newGame();
})();
