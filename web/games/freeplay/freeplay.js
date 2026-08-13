/* ===========================================================================
   freeplay.js — papan tuts yang bisa dimainkan sendiri.

   PROGRAM BARU, BUKAN PORT
   ------------------------
   Tidak ada .BAS di balik halaman ini. Ia lahir dari pertanyaan sederhana:
   kalau not balok bergulir sudah ada untuk MEMUTAR lagu, bisakah alat yang
   sama dipakai untuk MEREKAM permainan?

   Jawabannya ternyata satu angka. Di GERMFOLK/DREAM/NOTETABL, garis penanda
   diam di `playheadAt: 0.28` — dekat kiri, sehingga sebagian besar layar
   dipakai memperlihatkan not yang AKAN datang. Di sini garisnya di `0.9` —
   dekat kanan, karena tidak ada yang akan datang untuk diperlihatkan. Not
   lahir tepat di garis, lalu bergulir ke kiri jadi riwayat.

   Sisa kodenya identik: penggulungnya, penggambar kepala not, garis bantunya.

   TIGA JAM YANG HARUS SEJALAN
   ---------------------------
   Program ini menyentuh tiga sumber waktu sekaligus, dan itu sumber bug klasik:

     1. jam AudioContext        (detik, presisi tinggi, milik Web Audio)
     2. performance.now()       (milidetik sejak halaman dibuka)
     3. urutan kejadian keyboard

   Yang dipakai sebagai kebenaran di sini adalah nomor 2, dan HANYA itu.
   Waktu not di not balok, panjang not di rekaman, semuanya diukur dari satu
   `T0` yang sama. Web Audio diberi tahu "bunyikan sekarang" dan "berhenti
   sekarang" tanpa pernah diminta melaporkan jam miliknya. Dengan begitu tidak
   ada dua jam yang perlu disamakan.

   MENGAPA ADA PENERJEMAH KE MAKRO PLAY
   ------------------------------------
   Karena di situlah lingkarannya tertutup. Empat halaman musik lain MEMBACA
   string makro dari tahun 1984–1990. Halaman ini MENULIS string yang sama, dan
   hasilnya bisa ditempel kembali ke BASICA di DOSBox. Alat yang sudah berumur
   empat puluh tahun ternyata masih jadi format pertukaran yang sah.

   Penerjemahannya juga jujur soal apa yang HILANG: makro PLAY monofonik dan
   berketukan tetap, sedangkan sepuluh jari tidak. Itu ditulis apa adanya di
   halaman, bukan disembunyikan.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, piano, staff, clock, parseMIDI } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  /* --------------------------------------------------------------------
     Peta papan ketik.

     Dua baris, masing-masing satu oktaf. Angkanya = jarak semitone dari nada
     dasar. Susunan ini bukan karangan sendiri: baris bawah ZXCVBNM sebagai
     tuts putih dengan SDGHJ sebagai tuts hitam adalah tata letak yang dipakai
     hampir semua perangkat lunak musik sejak Fasttracker. Meniru kebiasaan
     yang sudah ada lebih berharga daripada menciptakan yang "lebih logis".
     -------------------------------------------------------------------- */
  const ROWS = [
    { label: 'Bawah', at: 0,
      keys: ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm',
             ',', 'l', '.', ';', '/'] },
    { label: 'Atas', at: 12,
      keys: ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u',
             'i', '9', 'o', '0', 'p'] }
  ];

  /* huruf -> jarak semitone dari nada dasar */
  const MAP = {};
  ROWS.forEach(r => r.keys.forEach((k, i) => { MAP[k] = r.at + i; }));

  /* Kebalikannya, untuk melabeli tuts. Semitone 12..16 punya DUA huruf —
     kedua baris memang sengaja bertindih satu oktaf, supaya melodi yang
     melewati batas oktaf tidak memaksa tangan berpindah baris. Yang dipakai
     sebagai label adalah huruf baris ATAS, karena posisinya di papan ketik
     lebih dekat dengan not-not tinggi yang biasanya dimainkan di sana. */
  const KEY_OF = {};
  ROWS.forEach(r => r.keys.forEach((k, i) => { KEY_OF[r.at + i] = k; }));

  const SPAN = 28;                          // semitone tertinggi di peta tuts
  const LO = audio.midiOf('C2');
  const HI = audio.midiOf('C7');
  let base = audio.midiOf('C3');            // nada untuk tuts Z

  const labelOf = (midi) => {
    const k = KEY_OF[midi - base];
    return k === undefined ? '' : k.toUpperCase();
  };

  /* --- papan tuts --- */
  const kb = piano($('piano'), {
    from: 'C2', to: 'C7',
    label: labelOf,
    onDown: down,
    onUp: up
  });

  /* --- not balok, garis penanda di KANAN --- */
  const sheet = staff($('staff'), {
    pps: 100,
    playheadAt: 0.9,
    range: [LO, HI]
  });
  sheet.setNotes([]);

  /* --------------------------------------------------------------------
     Jam pertunjukan.

     Versi pertama memakai `performance.now()` langsung, dan gulungan not
     baloknya BERJALAN TERUS selamanya — bahkan saat tidak ada yang ditekan.
     Akibatnya dua hal: nada yang barusan dimainkan hanyut keluar layar dalam
     sembilan detik, dan tombol Berhenti tidak berpengaruh apa pun padanya.

     Sekarang jamnya `RETRO.clock()` — bisa dijeda. Ia mulai berjalan pada
     tuts pertama yang ditekan dan berhenti kalau dijeda. Rekamannya tetap
     jujur soal ritme, karena selama merekam jamnya tidak pernah dijeda
     diam-diam: yang menjeda hanya pengguna.
     -------------------------------------------------------------------- */
  const beat = clock();

  /* --------------------------------------------------------------------
     BERAPA LAMA SEPI BOLEH BERJALAN SEBELUM GULUNGAN MEMBEKU

     Kalau jam dibiarkan jalan terus, rekaman Anda hanyut keluar layar
     walaupun tidak ada yang terjadi. Kalau jam dibekukan terlalu cepat,
     istirahat yang MEMANG bagian dari lagu ikut terhapus, dan ritme yang
     terekam bukan lagi ritme yang dimainkan.

     Jadi ambangnya harus lebih panjang dari jeda musik terpanjang yang masuk
     akal, dan lebih pendek dari waktu sebuah not hanyut keluar layar.

     BATAS BAWAH — diukur dari koleksi ini sendiri.
     Seluruh makro PLAY di 83 program ditafsirkan, dan seluruh perintah P/R
     dihitung: 98 jeda, dan yang TERPANJANG hanya 0,500 detik (muncul 33 kali,
     di BACKGAM, ELIZA, FOOTBALL, GOLF, MORTGAGE, DOMINOES, WIZARD). Median
     0,240 detik. Musik di koleksi ini nyaris tidak punya keheningan.

     Tapi itu jingle permainan, bukan komposisi — sampelnya bias ke pendek.
     Jadi angkanya diambil dari batas musik umum: satu birama penuh 4/4 pada
     tempo lambat (seperempat = 60) = 4 detik. Lebih panjang dari itu, sebuah
     keheningan berhenti jadi istirahat dan mulai jadi pergantian bagian.

     BATAS ATAS — geometri layarnya.
     Garis penanda di 810 unit, gulungan 100 unit/detik, jadi sebuah not keluar
     dari tepi kiri 8,1 detik setelah dimainkan. Ambang apa pun di bawah itu
     menjamin nada terakhir Anda tidak pernah sempat hanyut.

     4 detik memenuhi keduanya: 8x lebih longgar dari jeda terpanjang yang
     pernah ditulis di koleksi ini, dan separuh dari jendela layarnya.
     -------------------------------------------------------------------- */
  const MAX_REST = 4.0;
  let lastActive = 0;          // detik saat nada terakhir berhenti berbunyi
  let autoFreeze = true;       // lihat toggleFreeze()

  const held = new Map();      // midi -> {voice, note, rec, t}
  const REC = [];              // {midi, t, dur} — urut menurut t
  let mode = 'live';           // 'live' = main sendiri, 'midi' = memutar berkas
  let rState = 'idle';         // pemutaran ulang: idle | playing | paused

  function down(midi) {
    if (mode !== 'live' || midi < LO || midi > HI || held.has(midi)) return;
    if (!beat.running) beat.resume();          // tuts pertama menghidupkan jam
    const t = beat.now();
    lastActive = t;
    autoFreeze = true;                    // nada baru: aturan otomatis berlaku lagi
    const rec = { midi, t, dur: 0.12 };
    REC.push(rec);
    held.set(midi, {
      voice: audio.noteOn(midi),
      note: sheet.push(midi, t, 0.12),
      rec, t
    });
    kb.on(midi);
    $('now').classList.remove('m-now--idle');
    $('now').textContent = NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
    $('count').textContent = REC.length + ' nada';
    syncLive();
  }

  function up(midi) {
    const h = held.get(midi);
    if (!h) return;
    held.delete(midi);
    const dur = Math.max(0.08, beat.now() - h.t);
    lastActive = h.t + dur;               // nada ini berhenti di sini
    h.rec.dur = dur;
    if (h.voice) h.voice.release();
    sheet.setDur(h.note, dur);
    kb.off(midi);
    refreshMacro();
  }

  /* Not yang masih ditahan tumbuh terus. Batangnya diperlebar tiap gambar,
     bukan ditunggu sampai tuts dilepas — kalau tidak, sebuah nada panjang
     terlihat pendek selama dimainkan lalu tiba-tiba memanjang. */
  (function tick() {
    const t = beat.now();
    sheet.setTime(t);
    held.forEach(h => sheet.setDur(h.note, Math.max(0.08, t - h.t)));

    /* Membeku sendiri setelah sepi selama MAX_REST.

       Dibekukan tepat di `lastActive + MAX_REST`, bukan di posisi frame yang
       kebetulan sedang berjalan. Bedanya penting: kalau dibiarkan berhenti di
       mana pun frame-nya mendarat, panjang jeda yang terekam akan berbeda-beda
       tergantung beban mesin — dan rekaman yang sama bisa menghasilkan makro
       PLAY yang berbeda tiap kali. */
    if (autoFreeze && beat.running && mode === 'live' && rState === 'idle' &&
        !held.size && REC.length && t - lastActive > MAX_REST) {
      beat.pause();
      beat.seek(lastActive + MAX_REST);
      syncLive();
    }
    requestAnimationFrame(tick);
  })();

  /** Tombol "Jeda gulungan" / "Lanjut", dan tombol hapus rekaman. */
  function syncLive() {
    const on = beat.running;
    $('freeze').textContent = on ? 'Jeda gulungan' : 'Lanjut gulungan';
    $('freeze').disabled = mode !== 'live' || (!on && REC.length === 0);
    $('clear').disabled = REC.length === 0;
    syncReplay();
  }

  function toggleFreeze() {
    if (mode !== 'live') return;
    if (beat.running) {
      Array.from(held.keys()).forEach(m => up(m));   // lepas dulu, baru beku
      beat.pause();
    } else {
      /* Menjalankan lagi secara MANUAL mematikan pembekuan otomatis sampai
         nada berikutnya ditekan.

         Tanpa ini tombolnya seolah rusak: jamnya sudah lewat MAX_REST, jadi
         penjaga di putaran gambar langsung membekukannya lagi pada frame
         berikutnya, dan tidak ada yang terlihat berubah. Permintaan yang
         disampaikan langsung oleh pengguna harus menang atas aturan otomatis
         yang cuma menebak maksudnya. */
      autoFreeze = false;
      beat.resume();
    }
    syncLive();
  }

  /* --------------------------------------------------------------------
     Papan ketik.

     `event.repeat` harus dibuang. Menahan sebuah tuts memicu keydown berulang
     kali oleh sistem operasi, dan tanpa penjagaan itu satu tekanan akan
     melahirkan puluhan not. `held` sudah menjaga hal yang sama, tapi menolak
     lebih awal lebih murah dan lebih jelas maksudnya.
     -------------------------------------------------------------------- */
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey || e.repeat) return;
    const k = e.key.toLowerCase();

    if (e.key === 'ArrowLeft') { e.preventDefault(); return shift(-12); }
    if (e.key === 'ArrowRight') { e.preventDefault(); return shift(12); }
    if (e.key === ' ') { e.preventDefault(); return toggleFreeze(); }

    const semi = MAP[k];
    if (semi === undefined) return;
    e.preventDefault();
    down(base + semi);
  });

  window.addEventListener('keyup', e => {
    const semi = MAP[e.key.toLowerCase()];
    if (semi !== undefined) up(base + semi);
  });

  /* Kalau jendela kehilangan fokus di tengah tekanan, `keyup` tidak akan
     pernah sampai. Semua nada yang sedang ditahan dilepas paksa. */
  window.addEventListener('blur', () => {
    Array.from(held.keys()).forEach(m => up(m));
  });

  function shift(by) {
    const next = base + by;
    if (next < LO || next + SPAN > HI) return;
    Array.from(held.keys()).forEach(m => up(m));
    base = next;
    kb.relabel(labelOf);
    $('base').textContent = NAMES[((base % 12) + 12) % 12] + (Math.floor(base / 12) - 1);
    drawKeymap();
  }

  /**
   * Hapus rekaman: not balok dikosongkan, daftar REC dibuang, jam dikembalikan
   * ke nol. Inilah satu-satunya cara "melupakan" — tidak ada yang terhapus
   * diam-diam, dan tidak ada batas yang membuang not lama tanpa memberi tahu.
   *
   * Yang TIDAK ikut terhapus: pilihan instrumen dan tema. Keduanya milik
   * pengguna, bukan milik rekaman.
   */
  function clearAll() {
    if (rState !== 'idle') stopReplay();
    Array.from(held.keys()).forEach(m => up(m));
    REC.length = 0;
    lastActive = 0;
    autoFreeze = true;
    sheet.clear();
    beat.reset();
    $('count').textContent = '0 nada';
    $('now').textContent = '—';
    $('now').classList.add('m-now--idle');
    refreshMacro();
    syncLive();
  }

  /* --------------------------------------------------------------------
     Menerjemahkan permainan jadi makro PLAY.

     Tiga hal yang harus dibuang, dan ketiganya adalah batasan GW-BASIC,
     bukan kekurangan penerjemahnya:

       polifoni   dua nada bersamaan jadi satu — yang lebih dulu ditekan.
       waktu bebas panjang nada dibulatkan ke 1/1..1/32 pada T120.
       jeda       hanya jeda di atas 0,12 detik yang ditulis sebagai P.

     Yang menarik: keterbatasan ini persis alasan kenapa lagu-lagu di koleksi
     ini terdengar "kotak". Bukan karena penulisnya kurang mahir — melainkan
     karena alatnya memang tidak bisa menyatakan yang lain.
     -------------------------------------------------------------------- */
  const TEMPO = 120;
  const LENGTHS = [1, 2, 4, 8, 16, 32];

  function lenOf(sec) {
    const quarter = 60 / TEMPO;              // detik untuk not seperempat
    let best = 4, err = Infinity;
    LENGTHS.forEach(l => {
      const e = Math.abs(quarter * 4 / l - sec);
      if (e < err) { err = e; best = l; }
    });
    return best;
  }

  function toMacro(list) {
    if (!list.length) return 'T' + TEMPO;

    // Buang polifoni: not yang mulai sebelum not sebelumnya selesai dipotong.
    const mono = [];
    list.slice().sort((a, b) => a.t - b.t).forEach(n => {
      const prev = mono[mono.length - 1];
      if (prev && n.t < prev.t + prev.dur - 0.02) return;   // ditekan bersamaan
      mono.push(n);
    });

    const out = ['T' + TEMPO, 'L4'];
    let oct = null, end = mono[0].t;
    mono.forEach(n => {
      const gap = n.t - end;
      if (gap > 0.12) out.push('P' + lenOf(gap));
      // MIDI = 12 x (oktafGW + 2) + semitone  ->  oktafGW = MIDI/12 - 2
      const gw = Math.max(0, Math.min(6, Math.floor(n.midi / 12) - 2));
      if (gw !== oct) { out.push('O' + gw); oct = gw; }
      out.push(NAMES[((n.midi % 12) + 12) % 12] + lenOf(n.dur));
      end = n.t + n.dur;
    });
    return out.join(' ');
  }

  function refreshMacro() {
    $('macro').textContent = toMacro(REC);
  }

  /* --------------------------------------------------------------------
     Memainkan ulang lewat penafsir yang sama dengan halaman lain.

     Ini sekaligus ujian: kalau hasil terjemahan benar, apa yang terdengar
     harus mirip dengan yang barusan dimainkan. Kalau melenceng, penerjemahnya
     yang salah — bukan telinganya.

     BUG YANG PERNAH ADA DI SINI: menghentikan pemutaran membungkam suaranya
     tapi not baloknya jalan terus. Sebabnya sederhana dan mudah terulang —
     `stopReplay()` menghentikan `audio`, tapi lupa bahwa gulungan not balok
     dijalankan oleh jam yang BERBEDA (`beat`). Dua jam dinyalakan bersama,
     hanya satu yang dimatikan.

     Aturan yang dipegang sekarang: setiap tempat yang menyalakan keduanya
     harus mematikan keduanya. Karena itu semuanya dikumpulkan di satu fungsi,
     bukan disebar di beberapa penangan tombol.
     -------------------------------------------------------------------- */
  function syncReplay() {
    $('replay').textContent = rState === 'playing' ? 'Jeda'
                            : rState === 'paused' ? 'Lanjut' : 'Mainkan ulang';
    $('replay').disabled = mode !== 'live' || (rState === 'idle' && !REC.length);
    $('stopReplay').disabled = rState === 'idle';
  }

  function onReplay() {
    if (rState === 'playing') {
      audio.pause(); beat.pause(); kb.clear();
      rState = 'paused'; return syncReplay();
    }
    if (rState === 'paused') {
      audio.resume(); beat.resume();
      rState = 'playing'; return syncReplay();
    }
    startReplay();
  }

  /** Detik terakhir yang ditempati rekaman. */
  function recEnd() {
    return REC.reduce((m, r) => Math.max(m, r.t + r.dur), 0);
  }

  /**
   * Kembalikan not balok ke isi REKAMAN saja, dan letakkan penanda tepat di
   * ujungnya.
   *
   * REC adalah sumber kebenaran; not balok cuma gambarnya. Karena itu
   * "membersihkan jejak" tidak perlu melacak not mana yang berasal dari
   * pemutaran ulang — cukup gambar ulang dari sumbernya.
   *
   * Itu pola yang berlaku jauh di luar sini: kalau tampilan diturunkan dari
   * data, membatalkan apa pun selalu berarti "gambar ulang dari data", bukan
   * "cari dan hapus yang tadi ditambahkan".
   */
  function restoreStaff() {
    sheet.setNotes(REC.map(r => ({ midi: r.midi, t: r.t, dur: r.dur })));
    beat.pause();
    beat.seek(recEnd());
  }

  async function startReplay() {
    // Saat sebuah MIDI dimuat, panggungnya milik MIDI itu.
    if (mode !== 'live' || rState !== 'idle' || !REC.length) return;
    rState = 'playing';
    syncReplay();
    audio.resetPlayState();

    // Buang jejak pemutaran sebelumnya lebih dulu, supaya tidak menumpuk.
    restoreStaff();

    const macro = toMacro(REC);
    const parsed = audio.debugParse(macro);

    /* Hasil terjemahan digambar sebagai LANJUTAN riwayat, bukan
       menggantikannya — jadi selama diputar, perbedaan antara yang Anda
       mainkan dan yang muat dalam makro PLAY terlihat bersebelahan di layar
       yang sama. Jejaknya dibersihkan begitu pemutaran selesai. */
    beat.resume();
    const t0 = beat.now() + 0.25;
    parsed.notes.forEach(n =>
      sheet.push(audio.noteName(n.freq).midi, t0 + n.at, n.dur));

    await audio.play(macro, {
      fresh: true,
      onNote: n => {
        if (rState === 'playing') kb.hitFreq(n.freq, Math.max(110, n.dur * 900));
      }
    });

    if (rState === 'playing') stopReplay();
  }

  /**
   * Hentikan pemutaran ulang: bunyi, gulungan, DAN jejaknya di not balok.
   *
   * Ketiganya, bukan dua. Versi sebelumnya hanya menghentikan dua yang pertama
   * dan meninggalkan not hasil terjemahan tergambar di sana — sehingga tiap
   * kali "Mainkan ulang" ditekan, satu salinan lagi menumpuk di belakangnya.
   *
   * `audio.stop()` juga membungkam tuts yang mungkin sedang ditahan pemain.
   * Karena itu `held` ikut dikosongkan — kalau tidak, papan tuts akan
   * menyimpan nada yang sudah tidak berbunyi, dan menekan tuts yang sama lagi
   * tidak akan menghasilkan apa-apa.
   */
  function stopReplay() {
    audio.stop();
    Array.from(held.keys()).forEach(m => up(m));
    kb.clear();
    rState = 'idle';
    if (!held.size) restoreStaff();
    syncReplay();
    syncLive();
  }

  /* --------------------------------------------------------------------
     MEMUAT BERKAS MIDI

     Dua format pertukaran dari era yang sama akhirnya saling bicara: sebuah
     .mid dibaca, ditampilkan di not balok, dan diterjemahkan jadi makro PLAY
     yang bisa ditempel ke BASICA. SMF dibakukan 1988; GERMFOLK.BAS ditulis
     1990. Keduanya masih hidup.

     PERGANTIAN MODE
     ---------------
     Saat berkas dimuat, garis penanda pindah dari 0.9 ke 0.28. Ini bukan
     hiasan: memutar lagu yang sudah ada berarti ada MASA DEPAN untuk
     digambar, jadi ruang kanan jadi berguna lagi. Bermain sendiri tidak
     punya masa depan, jadi garisnya di kanan.

     Satu pemanggilan `sheet.setPlayhead()` mengurus seluruh perbedaannya.
     -------------------------------------------------------------------- */
  let song = null;        // hasil parseMIDI, atau null

  const noteLabel = (midi) =>
    NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);

  function fmtTime(sec) {
    return Math.floor(sec / 60) + ':' +
           String(Math.floor(sec % 60)).padStart(2, '0');
  }

  function loadFile(file) {
    if (!file) return;
    const fr = new FileReader();
    fr.onerror = () => ui.toast('Berkas gagal dibaca.');
    fr.onload = () => {
      try {
        /* Semua yang bisa salah ada di satu tempat: berkas bukan MIDI, MIDI
           bertakaran SMPTE, atau MIDI yang isinya cuma perkusi. Ketiganya
           dilempar `parseMIDI` sebagai Error berbahasa manusia, jadi di sini
           cukup ditampilkan apa adanya. */
        const m = parseMIDI(fr.result, { drums: false });
        useSong(m, file.name);
      } catch (err) {
        ui.toast(err.message || 'Berkas MIDI tidak bisa dibaca.');
      }
    };
    fr.readAsArrayBuffer(file);
  }

  function useSong(m, filename) {
    /* Apa pun yang sedang berbunyi dihentikan lebih dulu — pemutaran ulang
       rekaman sendiri maupun MIDI sebelumnya. Memuat berkas baru sambil yang
       lama masih berjalan adalah cara termudah mendapat dua lagu bertumpuk. */
    stopReplay();
    stopMidi();
    Array.from(held.keys()).forEach(m2 => up(m2));
    song = m;
    mode = 'midi';

    sheet.setPlayhead(0.28);               // ada masa depan untuk digambar
    sheet.setNotes(m.notes.map(n => ({ midi: n.midi, t: n.t, dur: n.dur })));
    beat.reset();

    /* `Math.min.apply` dihindari: sebuah berkas dengan puluhan ribu nada bisa
       melampaui batas jumlah argumen dan melempar RangeError. Reduce tidak
       punya batas itu. */
    let lo = 127, hi = 0;
    m.notes.forEach(n => { if (n.midi < lo) lo = n.midi; if (n.midi > hi) hi = n.midi; });

    $('midiInfo').textContent = [
      m.name || filename,
      m.notes.length + ' nada',
      fmtTime(m.total),
      m.tracks + ' trek',
      'format ' + m.format,
      noteLabel(lo) + '–' + noteLabel(hi),
      m.tempoCount > 1 ? m.tempoCount + ' perubahan tempo' : null
    ].filter(Boolean).join(' · ');

    /* Makro PLAY dibangun dari daftar yang sama. Di sinilah keterbatasan
       GW-BASIC paling terasa: sebuah lagu piano dengan dua tangan kehilangan
       seluruh tangan kirinya, karena PLAY monofonik. Itu tidak disembunyikan
       — justru itu pelajarannya. */
    $('macro').textContent = toMacro(m.notes);

    midiState = 'idle';
    syncMidi();
    ui.toast('MIDI dimuat. Papan tuts sementara nonaktif — tekan "Tutup" '
           + 'untuk kembali bermain sendiri.');
  }

  function dropSong() {
    stopMidi();
    song = null;
    mode = 'live';
    sheet.setPlayhead(0.9);                // kembali jadi perekam
    beat.reset();
    restoreStaff();
    refreshMacro();
    $('midiInfo').textContent = 'Belum ada berkas dimuat.';
    midiState = 'idle';
    syncMidi();
    syncLive();
  }

  /* --- transport MIDI: mainkan / jeda / lanjut / ulang --- */
  let midiState = 'idle';
  let midiToken = 0;

  function syncMidi() {
    $('playMidi').disabled = !song;
    $('resetMidi').disabled = !song || midiState === 'idle';
    $('dropMidi').disabled = !song;
    $('playMidi').textContent = midiState === 'playing' ? 'Jeda'
                              : midiState === 'paused' ? 'Lanjut' : 'Mainkan';
  }

  function onPlayMidi() {
    if (!song) return;
    if (midiState === 'playing') {
      audio.pause(); beat.pause(); kb.clear();
      midiState = 'paused'; return syncMidi();
    }
    if (midiState === 'paused') {
      audio.resume(); beat.resume();
      midiState = 'playing'; return syncMidi();
    }
    const my = ++midiToken;
    midiState = 'playing';
    beat.start();
    syncMidi();
    $('now').classList.remove('m-now--idle');

    audio.playNotes(
      song.notes.map(n => ({ midi: n.midi, at: n.t, dur: n.dur })),
      { onNote: n => {
          if (my !== midiToken) return;
          kb.hit(n.midi, Math.max(110, n.dur * 900));
          $('now').textContent =
            NAMES[((n.midi % 12) + 12) % 12] + (Math.floor(n.midi / 12) - 1);
        } }
    ).then(() => { if (my === midiToken && midiState === 'playing') stopMidi(); });
  }

  function stopMidi() {
    midiToken++;
    audio.stop();
    beat.reset();
    sheet.setTime(0);
    kb.clear();
    midiState = 'idle';
    $('now').textContent = '—';
    $('now').classList.add('m-now--idle');
    syncMidi();
  }

  /* --- peta tuts sebagai dua deret kecil ---
     Digambar ulang tiap kali oktaf digeser, karena nada di balik tiap tombol
     ikut berubah. Hurufnya tetap; artinya yang berpindah. */
  const BLACK = [1, 3, 6, 8, 10];

  function drawKeymap() {
    const host = $('keymap');
    host.textContent = '';
    ROWS.forEach(r => {
      const line = ui.el('div', { class: 'm-keyrow' });
      line.append(ui.el('span', { class: 'm-keyrow__label', text: r.label }));
      r.keys.forEach((k, i) => {
        const midi = base + r.at + i;
        const pc = ((midi % 12) + 12) % 12;
        line.append(ui.el('span', {
          class: 'm-key' + (BLACK.includes(pc) ? ' m-key--b' : ''),
          text: k.toUpperCase(),
          title: NAMES[pc] + (Math.floor(midi / 12) - 1)
        }));
      });
      host.append(line);
    });
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Free Play',
    source: 'Program baru · dibangun dari fondasi yang sama',
    backHref: '../../index.html'
  }));

  $('instruments').replaceWith(ui.instrumentBar());

  $('down').addEventListener('click', () => shift(-12));
  $('up').addEventListener('click', () => shift(12));
  $('clear').addEventListener('click', clearAll);
  $('file').addEventListener('change', e => {
    loadFile(e.target.files && e.target.files[0]);
    e.target.value = '';          // supaya berkas yang sama bisa dimuat lagi
  });
  $('playMidi').addEventListener('click', onPlayMidi);
  $('resetMidi').addEventListener('click', stopMidi);
  $('dropMidi').addEventListener('click', dropSong);
  $('freeze').addEventListener('click', toggleFreeze);

  $('replay').addEventListener('click', onReplay);
  $('stopReplay').addEventListener('click', stopReplay);
  $('copy').addEventListener('click', () => {
    const text = $('macro').textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => ui.toast('Makro PLAY disalin.'))
        .catch(() => ui.toast('Penyalinan ditolak peramban — pilih teksnya manual.'));
    } else {
      ui.toast('Peramban ini tidak mengizinkan salin otomatis dari file:// — '
             + 'pilih teksnya manual.');
    }
  });

  drawKeymap();
  refreshMacro();
  syncLive();
  syncMidi();
  syncReplay();
})();
