/* ===========================================================================
   piano.js — papan tuts yang bisa menyala, dipakai bersama halaman musik.

   DARI RETRO KE MODERN
   --------------------
   Tidak ada padanannya di aslinya: `PLAY` dan `SOUND` hanya berbunyi, tanpa
   menampilkan apa pun. Empat program musik di koleksi ini
   (GERMFOLK, OCTAVE, DREAM, NOTETABL) semuanya "buta" — Anda mendengar hasilnya
   tapi tidak melihat not mana yang sedang dimainkan.

   Menambahkan tampilan ini murni tambahan, dan alasannya pedagogis: bahasa
   makro `PLAY` jauh lebih mudah dipahami kalau `>c d4 ml e c<` terlihat
   bergerak di papan tuts sambil berbunyi.

   Papan tuts digambar dari data, bukan 88 elemen yang ditulis tangan — pola
   yang sama dengan papan Othello di svg-demo.html.
   =========================================================================== */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const WHITE = [0, 2, 4, 5, 7, 9, 11];      // semitone yang bertuts putih

  const isWhite = (midi) => WHITE.includes(((midi % 12) + 12) % 12);
  const nameOf = (midi) => NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);

  /** "C3" -> MIDI 48 */
  function midiOf(name) {
    const m = /^([A-G])(#|b)?(-?\d+)$/.exec(String(name).trim());
    if (!m) return 60;
    let semi = NAMES.indexOf(m[1]);
    if (m[2] === '#') semi += 1;
    if (m[2] === 'b') semi -= 1;
    return 12 * (parseInt(m[3], 10) + 1) + semi;
  }

  const W = 26, WH = 124, BW = 16, BH = 78;

  /**
   * @param {HTMLElement} host  wadah; isinya diganti
   * @param {object} [opts]     {from:'C3', to:'C6', onKey:fn(midi)}
   */
  function createPiano(host, opts) {
    opts = opts || {};
    const lo = midiOf(opts.from || 'C3');
    const hi = midiOf(opts.to || 'C6');

    // Kunci putih dulu supaya kunci hitam bisa ditumpuk di atasnya.
    const whites = [];
    for (let m = lo; m <= hi; m++) if (isWhite(m)) whites.push(m);
    const width = whites.length * W;

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + WH);
    svg.setAttribute('class', 'piano');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label',
      'Papan tuts ' + nameOf(lo) + ' sampai ' + nameOf(hi));

    const keys = new Map();       // midi -> elemen
    const xOfWhite = new Map();
    whites.forEach((m, i) => xOfWhite.set(m, i * W));

    const add = (m, x, w, h, cls) => {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', 0);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('rx', 3);
      r.setAttribute('class', cls);
      r.dataset.midi = m;
      if (opts.onKey) {
        r.style.cursor = 'pointer';
        r.addEventListener('click', () => opts.onKey(m));
      }
      /* Tekan-dan-tahan. Dipakai papan tuts bebas, di mana panjang nada
         ditentukan oleh berapa lama tuts ditekan — bukan oleh nilai tetap.
         `pointerleave` ikut melepas: kalau jari digeser keluar tuts sambil
         menekan, `pointerup` tidak pernah sampai dan nadanya akan nyangkut. */
      if (opts.onDown) {
        r.style.cursor = 'pointer';
        r.style.touchAction = 'none';
        r.addEventListener('pointerdown', e => {
          e.preventDefault();
          opts.onDown(m);
        });
        const up = () => { if (opts.onUp) opts.onUp(m); };
        r.addEventListener('pointerup', up);
        r.addEventListener('pointerleave', up);
        r.addEventListener('pointercancel', up);
      }
      svg.append(r);
      keys.set(m, r);
    };

    whites.forEach(m => add(m, xOfWhite.get(m), W - 1.5, WH, 'pkey pkey--w'));
    for (let m = lo; m <= hi; m++) {
      if (isWhite(m)) continue;
      const left = xOfWhite.get(m - 1);          // tuts hitam selalu di kanan putih
      if (left === undefined) continue;
      add(m, left + W - BW / 2 - 0.75, BW, BH, 'pkey pkey--b');
    }

    // Label C pada tiap oktaf, penanda posisi
    whites.filter(m => m % 12 === 0).forEach(m => {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', xOfWhite.get(m) + (W - 1.5) / 2);
      t.setAttribute('y', WH - 8);
      t.setAttribute('class', 'plabel');
      t.textContent = nameOf(m);
      svg.append(t);
    });

    /* Label bebas di tiap tuts — dipakai untuk menuliskan huruf papan ketik
       mana yang membunyikannya. Disimpan supaya bisa diganti saat oktaf
       digeser: yang berpindah adalah pemetaannya, bukan tutsnya. */
    const marks = new Map();
    if (opts.label) {
      keys.forEach((k, m) => {
        const t = document.createElementNS(NS, 'text');
        const black = !isWhite(m);
        t.setAttribute('x', Number(k.getAttribute('x')) +
                            Number(k.getAttribute('width')) / 2);
        t.setAttribute('y', black ? BH - 12 : WH - 26);
        t.setAttribute('class', 'pmark' + (black ? ' pmark--b' : ''));
        t.style.pointerEvents = 'none';
        t.textContent = opts.label(m) || '';
        svg.append(t);
        marks.set(m, t);
      });
    }

    host.textContent = '';
    host.append(svg);

    let litTimers = new Map();

    return {
      lo, hi, nameOf, midiOf,

      /** Nyalakan satu tuts selama `ms`. Aman dipanggil bertubi-tubi. */
      hit(midi, ms) {
        const k = keys.get(midi);
        if (!k) return;
        k.classList.add('is-on');
        clearTimeout(litTimers.get(midi));
        litTimers.set(midi, setTimeout(() => k.classList.remove('is-on'),
                                       ms || 260));
      },

      /** Nyalakan berdasarkan frekuensi — langsung dari keluaran parsePlay. */
      hitFreq(freq, ms) {
        this.hit(Math.round(69 + 12 * Math.log2(freq / 440)), ms);
      },

      /** Nyalakan tanpa batas waktu — pasangannya `off()`. */
      on(midi) {
        const k = keys.get(midi);
        if (!k) return;
        clearTimeout(litTimers.get(midi));
        litTimers.delete(midi);
        k.classList.add('is-on');
      },
      off(midi) {
        const k = keys.get(midi);
        if (k) k.classList.remove('is-on');
      },

      /** Tulis ulang label tiap tuts, mis. setelah oktaf digeser. */
      relabel(fn) {
        marks.forEach((t, m) => { t.textContent = fn(m) || ''; });
      },

      clear() {
        litTimers.forEach(t => clearTimeout(t));
        litTimers.clear();
        keys.forEach(k => k.classList.remove('is-on'));
      }
    };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.piano = createPiano;
  global.RETRO.noteNameOf = nameOf;
})(window);
