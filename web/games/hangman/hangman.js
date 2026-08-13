/* ===========================================================================
   hangman.js — port dari HANGMAN.BAS (Friendlyware, 1 Feb 1983, 217 baris).

   Penjelasan lengkap keputusan porting ada di ../../docs/hangman.md.
   Ringkasnya, tiga hal yang menentukan bentuk kode ini:

   1. Di aslinya, urutan bagian tubuh dinyatakan oleh sebuah tabel dispatch
      yang melompat ke RANTAI FALL-THROUGH menurun:

          650 ON CHANCE GOTO 760,750,740,730,720,710,700,690,680
          680 GOSUB 970    ' telapak kaki kanan
          690 GOSUB 1090   ' tangan kanan
          ...
          760 GOSUB 810    ' kepala

      Masuk di 750 berarti menggambar badan LALU jatuh ke 760 dan menggambar
      kepala. Jadi satu lompatan menghasilkan gambar KUMULATIF. Di sini,
      padanannya cuma `PARTS.slice(0, chances)`.

   2. Keadaan permainan adalah objek biasa; menggambar adalah fungsi dari
      keadaan itu. Tidak ada satu pun keadaan yang disimpan di dalam DOM.

   3. Aturan mainnya dipertahankan persis, termasuk yang tidak biasa:
      sepuluh kesempatan (bukan enam), dan tawaran menebak kata utuh setiap
      kali satu huruf tertebak benar.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, rng, store, audio, input } = window.RETRO;
  const { el } = ui;
  const WORDS = window.RETRO.HANGMAN_WORDS;

  const $ = (id) => document.getElementById(id);

  /* --------------------------------------------------------------------
     Tabel bagian tubuh.

     Urutannya diambil langsung dari rantai fall-through baris 650–770.
     Indeks 9 (kesalahan ke-10) berisi TIGA bagian sekaligus, karena di
     aslinya `ON CHANCE GOTO` hanya punya sembilan target — nilai 10 jatuh
     keluar tabel dan melanjutkan ke baris 660 & 670 yang menggambar tiang
     gantungan dan telapak kaki kiri. Lihat dokumen bagian "kejutan di 650".
     -------------------------------------------------------------------- */
  const PARTS = [
    ['head'],                        // 1  — GOSUB 810
    ['torso'],                       // 2  — GOSUB 880
    ['legL'],                        // 3  — GOSUB 950
    ['legR'],                        // 4  — GOSUB 960
    ['armL'],                        // 5  — GOSUB 1000
    ['armR'],                        // 6  — GOSUB 1040
    ['handL'],                       // 7  — GOSUB 1080
    ['handR'],                       // 8  — GOSUB 1090
    ['footR'],                       // 9  — GOSUB 970
    ['footL', 'gallows', 'face']     // 10 — baris 660+670, plus GOSUB 1100
  ];
  const MAX_CHANCES = PARTS.length;  // 10, sama dengan `IF CHANCE=10` di 440

  /* Lagu dari kode asli, disalin apa adanya.
     Menang: baris 520–540, "HAIL TO THE CHIEF" (dimainkan dua kali).
     Kalah : baris 1130–1170, "TAPS" — lagu pemakaman militer. */
  const TUNE_WIN = [
    'T140 MN MB',
    'MB O2 G4. A4 B8 O3 C4. O2 B4 A8 G4 A8 G4 E8 D4. C4.',
    'MB O2 G4. A4 B8 O3 C4. O2 B4 A8 G4 A8 G4 E8 D4. C4.'
  ];
  const TUNE_LOSE = [
    'T120 MN MB',
    'O3L8C.L16C L2F.L8C.L16F',
    'L2A.L8C.L16F L4A L8C. L16F L4A L8C. L16F L2A.',
    'O3 L8F.L16A ML O4L2C MN O3L4AL4FL2C.',
    'O3L8C.L16C ML L1F MN L4F'
  ];

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /* --------------------------------------------------------------------
     Keadaan. Satu objek, satu sumber kebenaran.
     -------------------------------------------------------------------- */
  const db = store('hangman');
  const random = rng();

  const state = {
    word: '',
    guessed: new Set(),   // huruf yang sudah dicoba
    chances: 0,           // jumlah kesalahan, 0..10
    phase: 'idle',        // 'idle' | 'playing' | 'won' | 'lost'
    tries: 0,             // jumlah huruf yang dicoba (dipakai di pesan menang)
    // Daftar kata yang sudah keluar sengaja TIDAK disimpan antar sesi.
    // Aslinya memakai array A() yang hidup di memori dan hilang saat program
    // dijalankan ulang, jadi tiap sesi mulai dari 101 kata penuh.
    seen: [],
    wins: db.get('wins', 0),
    losses: db.get('losses', 0)
  };

  /* --------------------------------------------------------------------
     Memilih kata.

     Aslinya (baris 260–270):
         260 B=RND(1)*100:A(A)=B
         270 FOR C=0 TO A-1:IF A(C)=B THEN 260 ELSE NEXT

     "ambil acak; kalau sudah pernah keluar, ambil lagi" — makin banyak kata
     terpakai, makin sering gagal, dan waktunya tidak terbatas. Kalau semua
     101 kata sudah keluar, loop itu TIDAK PERNAH berhenti: program menggantung.

     Di sini: saring dulu yang belum terpakai, baru pilih. Waktunya pasti, dan
     kalau habis, daftarnya direset dengan pesan yang jelas.
     -------------------------------------------------------------------- */
  function pickWord() {
    let pool = WORDS.map((w, i) => i).filter(i => !state.seen.includes(i));
    if (!pool.length) {
      state.seen = [];
      pool = WORDS.map((w, i) => i);
      ui.toast('Ke-101 kata sudah keluar semua — daftar dimulai lagi.');
    }
    const idx = random.pick(pool);
    state.seen.push(idx);
    return WORDS[idx];
  }

  /* --------------------------------------------------------------------
     Menggambar. Semuanya turunan dari `state`, tidak ada yang lain.
     -------------------------------------------------------------------- */
  function activeParts() {
    const on = new Set(PARTS.slice(0, state.chances).flat());

    // Tiang gantungan SELALU tergambar sejak awal.
    //
    // Di aslinya ia baru muncul di kesalahan ke-10, karena `ON CHANCE GOTO`
    // di baris 650 hanya punya sembilan target dan nilai 10 jatuh keluar
    // tabel ke baris 660 (lihat dokumen bagian "kejutan di baris 650").
    // Akibatnya sosok itu melayang tanpa tiang selama sembilan kesalahan
    // pertama — terbaca sebagai gambar yang rusak, bukan sebagai keputusan.
    //
    // 'gallows' sengaja DIBIARKAN di dalam PARTS[9] supaya tabel itu tetap
    // cerminan jujur dari rantai 650–760; yang berubah hanya cara ia dipakai.
    on.add('gallows');

    // Wajah hanya muncul kalau memang sudah kalah.
    if (state.phase !== 'lost') on.delete('face');
    return on;
  }

  function render() {
    const on = activeParts();
    document.querySelectorAll('.part').forEach(node => {
      node.classList.toggle('is-on', on.has(node.dataset.part));
    });

    const dead = state.phase === 'lost';
    $('figure').classList.toggle('is-dead', dead);
    $('p-face').classList.toggle('is-dead', dead);

    $('chanceN').textContent = state.chances;
    $('chanceN').parentElement.classList.toggle('is-danger', state.chances >= 8);

    // Kata: huruf yang sudah tertebak tampil, sisanya garis bawah.
    // Kalau kalah, seluruh kata dibuka — aslinya tidak melakukan ini, tapi
    // pemain berhak tahu jawabannya.
    $('word').innerHTML = state.word.split('').map(ch => {
      const shown = state.guessed.has(ch) || state.phase !== 'playing';
      const cls = state.guessed.has(ch) ? 'hit' : 'miss';
      return '<span class="' + cls + '">' + (shown ? ch : '_') + '</span>';
    }).join(' ');

    ALPHABET.forEach(ch => {
      const b = $('key-' + ch);
      const used = state.guessed.has(ch);
      b.disabled = used || state.phase !== 'playing';
      b.dataset.state = used ? (state.word.includes(ch) ? 'hit' : 'miss') : '';
    });

    $('wins').textContent = state.wins;
    $('losses').textContent = state.losses;
    $('seen').innerHTML = state.seen.length + '<span class="faint">/101</span>';
  }

  function say(msg) { $('status').textContent = msg || ''; }

  /* --------------------------------------------------------------------
     Alur permainan.
     -------------------------------------------------------------------- */
  function newWord() {
    state.word = pickWord();
    state.guessed.clear();
    state.chances = 0;
    state.tries = 0;
    state.phase = 'playing';
    hideGuessBox();
    say('Tebak satu huruf.');
    render();
  }

  function guessLetter(ch) {
    if (state.phase !== 'playing' || state.guessed.has(ch)) return;
    state.guessed.add(ch);
    state.tries++;

    if (state.word.includes(ch)) {
      // Menang kalau seluruh huruf sudah tertebak (baris 420: IF WORD=WORD(B)).
      if (state.word.split('').every(c => state.guessed.has(c))) return win();
      audio.play('MB T180 O3 L16 E', { fresh: true });
      say('Ada. Tebak kata utuhnya, atau lanjut menebak huruf.');
      showGuessBox();
    } else {
      // Baris 440: hanya kesalahan yang menambah CHANCE.
      state.chances++;
      audio.play('MB T180 O2 L16 C', { fresh: true });
      if (state.chances >= MAX_CHANCES) return lose();
      say('Tidak ada huruf itu.');
    }
    render();
  }

  function guessWord(text) {
    const g = text.trim().toUpperCase();
    if (!g) return;
    if (g === state.word) return win();
    // Baris 490: "Nice Try. But No Cigar !!" — dan CHANCE tidak bertambah.
    say('Nice Try. But No Cigar !!');
    hideGuessBox();
    render();
  }

  function win() {
    state.phase = 'won';
    state.wins++;
    db.set('wins', state.wins);
    hideGuessBox();
    say('You Guessed It !!!!  In ' + state.tries + ' Tries');
    render();
    playTune(TUNE_WIN);
  }

  function lose() {
    state.phase = 'lost';
    state.losses++;
    db.set('losses', state.losses);
    hideGuessBox();
    say('Kata itu: ' + state.word);
    render();
    playTune(TUNE_LOSE).then(() => {
      // Baris 1190: FOR C=50 TO 200 STEP 1: SOUND C,0.0001: NEXT
      // Sapuan nada naik yang sangat cepat, sesudah TAPS selesai.
      for (let f = 50; f <= 200; f += 10) audio.sound(f * 4, 0.35);
    });
  }

  let tuneToken = 0;
  async function playTune(lines) {
    const my = ++tuneToken;
    audio.resetPlayState();
    for (const line of lines) {
      if (my !== tuneToken) return;      // permainan baru → hentikan lagu lama
      await audio.play(line);
    }
  }

  function showGuessBox() {
    $('guessBox').classList.remove('hidden');
    $('guessInput').value = '';
  }
  function hideGuessBox() { $('guessBox').classList.add('hidden'); }

  /* --------------------------------------------------------------------
     Pemasangan antarmuka.
     -------------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: 'Hangman',
    source: 'HANGMAN.BAS · Friendlyware · 1983',
    backHref: '../../index.html'
  }));

  const keys = $('keys');
  ALPHABET.forEach(ch => {
    const b = el('button', { class: 'keycap', type: 'button', id: 'key-' + ch,
                             text: ch, 'aria-label': 'Tebak huruf ' + ch });
    b.addEventListener('click', () => guessLetter(ch));
    keys.append(b);
  });

  // Papan ketik fisik. Padanan `1550 W=INKEY$` — tapi tanpa memutar CPU.
  const kb = input();
  kb.on('*', e => {
    if (e.ctrl || e.alt) return;
    const ch = e.key.toUpperCase();
    if (ch.length === 1 && ch >= 'A' && ch <= 'Z' &&
        document.activeElement !== $('guessInput')) {
      guessLetter(ch);
    }
  });

  $('guessBox').addEventListener('submit', e => {
    e.preventDefault();
    guessWord($('guessInput').value);
  });
  $('skipGuess').addEventListener('click', () => { hideGuessBox(); say(''); });

  $('newWord').addEventListener('click', newWord);
  $('reveal').addEventListener('click', async () => {
    if (state.phase !== 'playing') return newWord();
    const yes = await ui.confirmYesNo('Menyerah?',
      'Kata akan dibuka dan dihitung sebagai kalah.');
    if (yes) { state.chances = MAX_CHANCES; lose(); }
  });
  $('resetScore').addEventListener('click', async () => {
    if (!state.wins && !state.losses) {
      return ui.toast('Papan skor memang masih kosong.');
    }
    const yes = await ui.confirmYesNo('Reset papan skor?',
      'Jumlah <strong>menang</strong> dan <strong>kalah</strong> kembali ke nol. ' +
      'Permainan yang sedang berjalan dan daftar kata terpakai tidak diubah.');
    if (!yes) return;
    state.wins = 0;
    state.losses = 0;
    db.set('wins', 0);
    db.set('losses', 0);
    ui.toast('Papan skor direset.');
    render();
  });

  // Web Audio menolak berbunyi sebelum ada gestur pengguna — kendala yang
  // tidak dimiliki speaker PC tahun 1983.
  newWord();
  render();
})();
