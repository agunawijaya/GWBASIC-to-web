/* ===========================================================================
   germfolk.js — port dari GERMFOLK.BAS
   (disket majalah What Micro?, direktori CARPARK, 1990; 10 baris).

   Program terkecil kedua di koleksi, dan satu-satunya yang menjelaskan dirinya
   sendiri sepenuhnya. Struktur aslinya cuma dua hal:

       20 PLAY "o2 t200 l8"      ' setel keadaan SEKALI
       30..100 PLAY "…"          ' sisanya hanya not

   Pemisahan itulah pelajarannya, dan itu berlaku jauh di luar musik: setel
   konteks di awal, lalu tulis isinya tanpa mengulang setelan.

   SATU URAIAN, DUA KELUARAN
   -------------------------
   Kesembilan baris PLAY disambung jadi satu string, lalu ditafsirkan SEKALI.
   Hasilnya dipakai dua kali: untuk membunyikan nada, dan untuk menggambar not
   balok. Karena keduanya berasal dari daftar yang sama, keduanya mustahil
   melenceng — tidak ada "jam suara" dan "jam gambar" yang perlu disamakan.

   Penyambungan itu sah persis karena aturan pewarisan tadi: di GW-BASIC,
   `PLAY "a"` lalu `PLAY "b"` menghasilkan bunyi yang identik dengan
   `PLAY "ab"`. Keadaan oktaf/tempo/panjang mengalir menembus batas baris.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, piano, staff, clock } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Sepuluh baris asli, disalin apa adanya termasuk spasinya.
     Baris 10 komentar, 20 setelan, 30–100 melodi. */
  const LINES = [
    { no: 10, rem: true,  text: 'REM ******A German Folk Tune******' },
    { no: 20, setup: true, play: 'o2 t200 l8' },
    { no: 30, play: 'd g a b >c d4 ml e c< ' },
    { no: 40, play: 'mn b p8 a p8 g4 p8 ' },
    { no: 50, play: 'd g a b >c d4 ml' },
    { no: 60, play: ' e c <b p8 a8 p8 g4 p4' },
    { no: 70, play: '>d8. c16 <b >d c <b' },
    { no: 80, play: 'a4 >d8. c16 <b >d c <b a4' },
    { no: 90, play: 'g a b >c d4 ml e c mn' },
    { no: 100, play: '<b p8 a p8 g4.' }
  ];

  /* --------------------------------------------------------------------
     Menafsirkan sekali di muka.

     BOUND[i] mencatat, untuk tiap baris kode: nada ke berapa yang menjadi
     miliknya, dan bagaimana keadaan oktaf/tempo/panjang setelah baris itu
     selesai. Dengan tabel ini, satu nomor indeks nada cukup untuk tahu baris
     mana yang harus disorot — tanpa memutar per baris.
     -------------------------------------------------------------------- */
  const SCORE = LINES.filter(L => L.play).map(L => L.play).join(' ');
  const ALL = audio.debugParse(SCORE);

  const BOUND = [];
  (function buildBounds() {
    let acc = '', prev = 0;
    LINES.forEach((L, li) => {
      if (!L.play) return;
      acc += ' ' + L.play;
      const p = audio.debugParse(acc);
      BOUND.push({ line: li, from: prev, to: p.notes.length, state: p.state });
      prev = p.notes.length;
    });
  })();

  const lineOfNote = (idx) => {
    for (const b of BOUND) if (idx < b.to) return b;
    return BOUND[BOUND.length - 1];
  };

  // --- papan tuts ---
  const kb = piano($('piano'), {
    from: 'C3', to: 'B4',
    onKey: m => { audio.note(m, 0.5); kb.hit(m, 400); }
  });

  /* --- not balok ---
     Seluruh lagu digambar lebih dulu, jadi penonton melihat apa yang akan
     datang, bukan hanya apa yang sedang berbunyi. Garis penanda diam di
     kiri-tengah: kanan = belum dimainkan, kiri = sudah lewat. */
  const sheet = staff($('staff'), { pps: 105, playheadAt: 0.28 });
  sheet.setNotes(ALL.notes.map(n => ({
    midi: audio.noteName(n.freq).midi, t: n.at, dur: n.dur
  })));

  // --- daftar baris kode ---
  const score = $('score');
  LINES.forEach((L, i) => {
    const row = ui.el('div', {
      class: 'm-line' + (L.setup ? ' is-setup' : ''), id: 'line' + i
    });
    row.append(
      ui.el('span', { class: 'm-line__no', text: L.no }),
      ui.el('span', { text: L.rem ? L.text : 'PLAY "' + L.play + '"' })
    );
    score.append(row);
  });

  const highlight = (i) => {
    LINES.forEach((L, k) => $('line' + k).classList.toggle('is-on', k === i));
  };
  const clearLines = () => LINES.forEach((L, k) =>
    $('line' + k).classList.remove('is-on'));

  function showState(st) {
    $('sOct').textContent = st.octave;
    $('sTempo').textContent = st.tempo;
    $('sLen').textContent = '1/' + st.length;
  }

  /* --------------------------------------------------------------------
     Transport: mainkan / jeda / lanjut / ulang.

     Tiga keadaan saja, dan satu tombol yang berganti arti mengikutinya:

         idle    -> "Mainkan"
         playing -> "Jeda"
         paused  -> "Lanjut"

     Kembali ke awal adalah tindakan TERPISAH ("Ulang"), bukan efek samping
     dari berhenti. Versi pertama menggabungkan keduanya, dan hasilnya sebuah
     tombol yang menghukum: mendengarkan sebentar lalu berhenti berarti
     kehilangan posisi.

     Dua jam harus dijeda bersamaan — jam bunyi di `audio.js` dan jam gambar
     di sini. Keduanya memakai pola yang sama (menabung waktu yang sudah
     lewat), jadi keduanya bisa dilanjutkan tanpa menghitung ulang apa pun.
     -------------------------------------------------------------------- */
  let token = 0;
  let raf = 0;
  let state = 'idle';
  let curLine = -1;
  const beat = clock();

  function sync() {
    $('play').textContent = state === 'playing' ? 'Jeda'
                          : state === 'paused' ? 'Lanjut' : 'Mainkan';
    $('reset').disabled = state === 'idle';
    $('now').classList.toggle('m-now--idle', state === 'idle');
  }

  function tick() {
    sheet.setTime(beat.now());
    raf = requestAnimationFrame(tick);
  }

  function onPlay() {
    if (state === 'playing') return pause();
    if (state === 'paused') return resume();
    start();
  }

  function start() {
    const my = ++token;
    audio.resetPlayState();
    state = 'playing';
    beat.start();
    sync();

    /* Baris 20 tidak menghasilkan nada sama sekali, jadi ia tidak akan pernah
       terpilih oleh `lineOfNote`. Disorot manual di awal supaya terlihat bahwa
       ia memang yang pertama dijalankan. */
    curLine = 1;
    highlight(1);
    showState(BOUND[0].state);

    audio.play(SCORE, {
      fresh: true,
      onNote: (n, idx) => {
        if (my !== token) return;
        kb.hitFreq(n.freq, Math.max(120, n.dur * 900));
        const nm = audio.noteName(n.freq);
        $('now').textContent = nm.name + nm.octave;
        const b = lineOfNote(idx);
        if (b.line !== curLine) { curLine = b.line; highlight(b.line); showState(b.state); }
      }
    }).then(() => { if (my === token && state === 'playing') reset(); });

    cancelAnimationFrame(raf);
    tick();
  }

  function pause() {
    audio.pause();
    beat.pause();
    kb.clear();
    state = 'paused';
    sync();
  }

  function resume() {
    audio.resume();
    beat.resume();
    state = 'playing';
    sync();
  }

  function reset() {
    token++;
    audio.stop();
    cancelAnimationFrame(raf);
    beat.reset();
    sheet.setTime(0);
    clearLines();
    kb.clear();
    state = 'idle';
    curLine = -1;
    $('now').textContent = '—';
    showState({ octave: 2, tempo: 200, length: 8 });
    sync();
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'A German Folk Tune',
    source: 'GERMFOLK.BAS · What Micro? · 1990',
    backHref: '../../index.html'
  }));

  $('instruments').replaceWith(ui.instrumentBar());

  $('play').addEventListener('click', onPlay);
  $('reset').addEventListener('click', reset);
  sync();

})();
