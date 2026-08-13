/* ===========================================================================
   octave.js — port dari OCTAVE.BAS
   (disket majalah What Micro?, direktori CARPARK, 1990; 6 baris).

   Program terkecil di seluruh koleksi, dan satu-satunya yang punya bug yang
   layak dijelaskan:

       10 octave = -2: note = 1: length = 1
       20 PLAY "o0 t255"
       30 freq = 440 * (2 ^ (octave + (note - 10) / 12))
       40 SOUND freq, length
       50 PLAY "c"
       60 GOTO 30

   `note` ditetapkan sekali di baris 10 dan tidak pernah berubah. Baris 60
   melompat ke 30, bukan ke sebuah perulangan yang menaikkannya. Jadi program
   yang dijelaskan sebagai "memainkan satu oktaf" sebenarnya memainkan satu
   nada yang sama, selamanya.

   YANG DIJALANKAN DI SINI ADALAH VERSI YANG DIPERBAIKI.
   Satu baris yang hilang dikembalikan — `note` dinaikkan tiap putaran — dan
   program langsung melakukan apa yang dijanjikan judulnya. Rumus di baris 30
   tidak disentuh sama sekali; ia memang sudah benar sejak awal.

   Bukti bahwa rumusnya benar ada di disket yang sama: NOTETABL.BAS memakai
   rumus persis sama, dibungkus `FOR note = 1 TO 12`, dan ia bekerja.

   DUA NADA PER PUTARAN
   --------------------
   Yang mudah terlewat kalau hanya membaca kodenya: tiap putaran membunyikan
   DUA nada, bukan satu. Baris 40 membunyikan nada hasil hitungan, baris 50
   membunyikan C rendah yang tetap. Di not balok, C tetap itu terlihat sebagai
   deretan lurus di paranada bas, sementara nada hitungan menaiki tangga di
   atasnya. Aslinya kedua deret itu sama-sama datar — itulah bugnya, terlihat.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, piano, staff, clock } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const OCTAVE = -2;              // baris 10
  const LENGTH = 1;               // baris 10 — satuan 1/18,2 detik
  const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  /** Rumus baris 30, disalin apa adanya. */
  const freqOf = (octave, note) => 440 * Math.pow(2, octave + (note - 10) / 12);

  /* Nada dari baris 50: PLAY "o0 t255 c" -> oktaf 0, C -> MIDI 24 (C1). */
  const PEDAL_MIDI = 24;

  /* Irama putaran, dipilih supaya cukup pelan untuk diikuti mata. */
  const PERIOD = 0.80;            // detik satu putaran baris 30–60
  const AT_C = 0.40;              // baris 50 dibunyikan di tengah putaran

  const LINES = [
    { no: 10, text: 'octave = -2: note = 1: length = 1' },
    { no: 20, text: 'PLAY "o0 t255"' },
    { no: 30, text: 'freq = 440 * (2 ^ (octave + (note - 10) / 12))' },
    { no: 40, text: 'SOUND freq, length' },
    { no: 50, text: 'PLAY "c"' },
    { no: 55, text: 'note = note + 1', fix: true },
    { no: 60, text: 'IF note <= 12 THEN GOTO 30', fix: true }
  ];

  const kb = piano($('piano'), {
    from: 'C1', to: 'C4',
    onKey: m => { audio.note(m, 0.5); kb.hit(m, 400); }
  });

  /* --- not balok ---
     Dua belas putaran dijadwalkan di muka, jadi seluruh tangga nada sudah
     tergambar sebelum nada pertama berbunyi. Garis penanda diam di
     kiri-tengah; not yang menyentuhnya adalah yang sedang dibunyikan. */
  const sheet = staff($('staff'), { pps: 130, playheadAt: 0.28 });

  /* --------------------------------------------------------------------
     Jadwal dua belas putaran.

     Tiap putaran menghasilkan DUA nada: hasil hitungan baris 40, dan C tetap
     baris 50. Keduanya masuk satu daftar, dan kolom tambahan `kind`/`note`
     ikut terbawa sampai ke `onNote` — di situlah halaman tahu baris kode mana
     yang harus disorot.

     Daftar ini diserahkan ke `audio.playNotes()`, penjadwal yang sama dengan
     yang dipakai makro PLAY. Akibatnya jeda, lanjut, dan pergantian instrumen
     di tengah jalan didapat tanpa satu baris pun kode tambahan di sini.
     -------------------------------------------------------------------- */
  const PLAN = [];
  for (let note = 1; note <= 12; note++) {
    const at = (note - 1) * PERIOD;
    const f = freqOf(OCTAVE, note);
    // LENGTH satuannya 1/18,2 detik, persis seperti pencacah IBM PC.
    // Dikali lima: 55 ms yang asli nyaris tak terdengar di speaker modern.
    PLAN.push({ midi: audio.noteName(f).midi, freq: f,
                at, dur: LENGTH * 5 / 18.2, kind: 'calc', note });   // baris 40
    // PLAY "c" pada t255: not seperempat = 60/255 detik.
    PLAN.push({ midi: PEDAL_MIDI, at: at + AT_C, dur: 60 / 255,
                kind: 'pedal', note });                              // baris 50
  }
  sheet.setNotes(PLAN.map(p => ({ midi: p.midi, t: p.at, dur: p.dur })));

  const score = $('score');
  LINES.forEach((L, i) => {
    const row = ui.el('div', { class: 'm-line' + (L.fix ? ' is-fix' : ''), id: 'line' + i });
    row.append(ui.el('span', { class: 'm-line__no', text: L.no }),
               ui.el('span', { text: L.text }));
    score.append(row);
  });
  const mark = (i) => LINES.forEach((L, k) =>
    $('line' + k).classList.toggle('is-on', k === i));
  const clearMarks = () => LINES.forEach((L, k) =>
    $('line' + k).classList.remove('is-on'));

  function show(note) {
    const f = freqOf(OCTAVE, note);
    const midi = audio.noteName(f).midi;
    $('fNote').textContent = note;
    $('sNote').textContent = note;
    $('sFreq').textContent = f.toFixed(1);
    $('sName').textContent = NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
    return { f, midi };
  }

  /* --- transport: mainkan / jeda / lanjut / ulang --- */
  let token = 0, raf = 0, state = 'idle';
  const beat = clock();

  function sync() {
    $('play').textContent = state === 'playing' ? 'Jeda'
                          : state === 'paused' ? 'Lanjut' : 'Mainkan satu oktaf';
    $('reset').disabled = state === 'idle';
    $('now').classList.toggle('m-now--idle', state === 'idle');
  }

  function tick() {
    sheet.setTime(beat.now());
    raf = requestAnimationFrame(tick);
  }

  function onNote(n) {
    if (n.kind === 'calc') {
      mark(3);                                   // baris 40: SOUND freq, length
      show(n.note);
      kb.hit(n.midi, 320);
      $('now').textContent = $('sName').textContent;
    } else {
      mark(4);                                   // baris 50: PLAY "c"
      kb.hit(PEDAL_MIDI, 260);
      /* Baris 55 dan 60 tidak membunyikan apa pun, jadi tidak ada nada yang
         bisa memicunya. Disorot menyusul dengan jeda pendek — cukup untuk
         terbaca mata, terlalu pendek untuk perlu ikut dijeda. */
      setTimeout(() => { if (state === 'playing') mark(5); }, 170);
      setTimeout(() => { if (state === 'playing') mark(6); }, 270);
      setTimeout(() => { if (state === 'playing') mark(2); }, 380);
    }
  }

  function onPlay() {
    if (state === 'playing') return pause();
    if (state === 'paused') return resume();
    start();
  }

  function start() {
    const my = ++token;
    state = 'playing';
    beat.start();
    mark(2);
    sync();
    audio.playNotes(PLAN, { onNote })
         .then(() => { if (my === token && state === 'playing') done(); });
    cancelAnimationFrame(raf);
    tick();
  }

  function pause() { audio.pause(); beat.pause(); kb.clear(); state = 'paused'; sync(); }
  function resume() { audio.resume(); beat.resume(); state = 'playing'; sync(); }

  function done() {
    ui.toast('Dua belas nada — satu oktaf penuh. Rumus baris 30 tidak diubah '
           + 'sedikit pun; yang ditambahkan hanya kenaikan `note`.');
    reset();
  }

  function reset() {
    token++;
    audio.stop();
    cancelAnimationFrame(raf);
    beat.reset();
    sheet.setTime(0);
    clearMarks();
    kb.clear();
    state = 'idle';
    $('now').textContent = '—';
    show(1);
    sync();
  }

  $('topbar-host').append(ui.topbar({
    title: 'Octave',
    source: 'OCTAVE.BAS · What Micro? · 1990',
    backHref: '../../index.html'
  }));

  $('instruments').replaceWith(ui.instrumentBar());

  $('play').addEventListener('click', onPlay);
  $('reset').addEventListener('click', reset);

  show(1);
  sync();
})();
