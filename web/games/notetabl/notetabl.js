/* ===========================================================================
   notetabl.js — port dari NOTETABL.BAS
   (disket majalah What Micro?, direktori CARPARK, 1990; 26 baris).

   DARI RETRO KE MODERN — satu perubahan besar
   -------------------------------------------
   Aslinya mencetak ke PRINTER, bukan ke layar:

       80  LPRINT : LPRINT
       90  LPRINT STRING$(79, "-");
       190 LPRINT TAB(3); : LPRINT noteno;

   `LPRINT` mengirim langsung ke LPT1. Program ini menghasilkan lembaran kertas
   untuk ditempel di dinding sebelah komputer — 96 baris tabel yang dipakai saat
   menulis program lain. Tidak ada satu pun `PRINT` ke layar di sini.

   Kendala yang melahirkannya: layar 80x25 hanya memuat 25 baris, sementara
   tabelnya 96 baris plus judul tiap oktaf. Menggulung tidak ada gunanya kalau
   Anda butuh melihat dua oktaf sekaligus. Kertas menyelesaikan itu.

   Sekarang: tabel yang bisa digulung DAN diklik untuk didengar — sesuatu yang
   kertas tidak bisa lakukan. Lebar 79 karakter dan TAB(3)/TAB(19)/TAB(35)/TAB(57)
   diganti kolom tabel sungguhan.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, piano, staff, clock } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Baris 260: DATA C,C#,D,D#,E,F,F#,G,G#,A,A#,B */
  const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  /* Baris 70: FOR oct = -3 TO 4 */
  const OCT_FROM = -3, OCT_TO = 4;

  /* Baris 170–180, disalin apa adanya.
     CINT membulatkan ke bilangan bulat terdekat — pembulatan bankir di
     GW-BASIC, tapi selisihnya tak terlihat pada angka sebesar ini. */
  const freqOf = (oct, note) => 440 * Math.pow(2, oct + (note - 10) / 12);
  const pitchOf = (freq) => Math.round(125000 / freq);

  const kb = piano($('piano'), {
    from: 'C1', to: 'C7',
    onKey: m => { audio.note(m, 0.5); kb.hit(m, 400); }
  });

  /* --- not balok ---
     Tabel dan not balok adalah dua tampilan dari SATU daftar yang sama.
     Karena itu mengklik sebuah baris tabel juga memindahkan not baloknya:
     bukan dua fitur terpisah yang harus dijaga agar sinkron, melainkan satu
     data yang digambar dua cara. */
  const sheet = staff($('staff'), { pps: 120, playheadAt: 0.28 });
  const STEP = 0.155;                          // detik antar nada saat menyapu

  /* --------------------------------------------------------------------
     Bangun tabel. Satu baris per nada, plus baris judul tiap oktaf —
     sama seperti baris 80–150 mencetak judul di tiap putaran oktaf luar.
     -------------------------------------------------------------------- */
  const rows = [];          // {noteno, oct, note, freq, pitch, midi, tr}
  const tbody = $('rows');
  let noteno = 1;           // baris 30: noteno = 1

  for (let oct = OCT_FROM; oct <= OCT_TO; oct++) {
    const head = ui.el('tr');
    const th = ui.el('td', {
      class: 'm-oct', colspan: 4,
      text: 'OCTAVE ' + oct + '  (' + (oct + 2) + ')'
    });
    head.append(th);
    tbody.append(head);

    for (let note = 1; note <= 12; note++) {
      const freq = freqOf(oct, note);
      const midi = Math.round(69 + 12 * Math.log2(freq / 440));
      const tr = ui.el('tr');
      tr.append(
        ui.el('td', { text: noteno }),
        ui.el('td', { text: NAMES[note - 1] + ' ' + oct }),
        ui.el('td', { text: freq.toFixed(2) }),
        ui.el('td', { text: pitchOf(freq) })
      );
      const rec = { noteno, oct, note, freq, midi, tr };
      /* Klik = "bawa nada ini ke garis penanda", bukan sekadar membunyikan. */
      const pick = () => {
        if (rec.t !== undefined) sheet.setTime(rec.t);
        hit(rec, 420);
      };
      tr.addEventListener('click', pick);
      tr.setAttribute('tabindex', '0');
      tr.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
      });
      tbody.append(tr);
      rows.push(rec);
      noteno++;                                  // baris 230
    }
  }

  /* Nada di bawah 37 Hz dan di atas 32767 Hz ditolak GW-BASIC — dan juga
     tidak terdengar. Ditandai supaya jelas kenapa sebagian baris tidak bunyi. */
  rows.forEach(r => {
    if (r.freq < 37 || r.freq > 32767) {
      r.tr.style.opacity = '.45';
      r.tr.title = 'Di luar jangkauan SOUND (37–32767 Hz)';
    }
  });

  /* Hanya nada yang benar-benar bisa dibunyikan yang masuk not balok —
     sama seperti GW-BASIC yang menolak SOUND di luar 37–32767 Hz. */
  const PLAY = rows.filter(r => r.freq >= 37 && r.freq <= 32767);
  PLAY.forEach((r, i) => { r.t = i * STEP; });
  sheet.setNotes(PLAY.map(r => ({ midi: r.midi, t: r.t, dur: STEP * 0.8 })));
  const SWEEP_TOTAL = PLAY.length * STEP;

  let current = null;

  /**
   * Sorot satu baris dan nyalakan tutsnya.
   * @param {boolean} [silent] jangan bunyikan — dipakai saat menyapu, karena
   *        di sana bunyinya sudah diurus penjadwal dan membunyikan ulang
   *        akan menghasilkan setiap nada dua kali.
   */
  function hit(rec, ms, silent) {
    if (current) current.tr.classList.remove('is-on');
    current = rec;
    rec.tr.classList.add('is-on');
    kb.hit(rec.midi, ms);
    $('now').classList.remove('m-now--idle');
    $('now').textContent = NAMES[rec.note - 1] + rec.oct;
    if (!silent) audio.sound(rec.freq, (ms / 1000) * 18.2);
  }

  /* --------------------------------------------------------------------
     Menyapu seluruh tabel.

     Daftar nadanya sudah ada — yang sama yang menggambar not balok — jadi
     tinggal diserahkan ke `audio.playNotes()`. Tidak ada jadwal setTimeout
     buatan sendiri lagi: jeda, lanjut, dan pergantian instrumen di tengah
     sapuan semuanya datang dari penjadwal bersama di `audio.js`.

     Ini keuntungan yang tidak terlihat sampai dicoba: memindahkan penjadwalan
     ke satu tempat membuat SEMUA halaman mendapat kemampuan baru sekaligus.
     -------------------------------------------------------------------- */
  let token = 0, raf = 0, state = 'idle';
  const beat = clock();

  function sync() {
    $('play').textContent = state === 'playing' ? 'Jeda'
                          : state === 'paused' ? 'Lanjut' : 'Mainkan seluruh tabel';
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
    state = 'playing';
    beat.start();
    sync();
    audio.playNotes(
      PLAY.map(r => ({ midi: r.midi, at: r.t, dur: STEP * 0.8, row: r })),
      { onNote: n => {
          if (my !== token) return;
          hit(n.row, 130, true);
          n.row.tr.scrollIntoView({ block: 'nearest' });
        } }
    ).then(() => { if (my === token && state === 'playing') reset(); });
    cancelAnimationFrame(raf);
    tick();
  }

  function pause() { audio.pause(); beat.pause(); kb.clear(); state = 'paused'; sync(); }
  function resume() { audio.resume(); beat.resume(); state = 'playing'; sync(); }

  function reset() {
    token++;
    audio.stop();
    cancelAnimationFrame(raf);
    beat.reset();
    sheet.setTime(0);
    if (current) current.tr.classList.remove('is-on');
    current = null;
    kb.clear();
    state = 'idle';
    $('now').textContent = '—';
    sync();
  }

  $('topbar-host').append(ui.topbar({
    title: 'Note Table',
    source: 'NOTETABL.BAS · What Micro? · 1990',
    backHref: '../../index.html'
  }));

  $('instruments').replaceWith(ui.instrumentBar());

  $('play').addEventListener('click', onPlay);
  $('reset').addEventListener('click', reset);
  sync();

})();
