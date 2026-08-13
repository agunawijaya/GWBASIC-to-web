/* ===========================================================================
   staff.js — not balok bergulir.

   Not bergerak dari KANAN ke KIRI. Ada satu garis penanda yang diam; not yang
   sedang menyentuh garis itulah yang berbunyi.

   Dua mode, dan bedanya cuma letak garis penandanya:

     playheadAt = 0.28   untuk memutar lagu yang sudah ada.
                         Not di kanan garis = akan datang, di kiri = sudah lewat.

     playheadAt = 0.9    untuk papan tuts bebas.
                         Not muncul di garis saat ditekan, lalu bergulir ke kiri
                         menjadi riwayat permainan.

   PARANADA BESAR (grand staff)
   ----------------------------
   Satu paranada treble saja tidak cukup: GERMFOLK turun sampai D3, DREAM naik
   sampai C6. Jadi dipakai dua paranada sekaligus dengan C tengah di antaranya.

   Posisi tegak dihitung dari LANGKAH DIATONIS, bukan dari nomor MIDI. Ini
   penting: C dan C# menempati garis yang sama, bedanya hanya tanda kres di
   depannya. Kalau memakai MIDI langsung, tangga nada akan terlihat timpang.

       langkah = oktaf x 7 + indeksHuruf     (C=0, D=1, E=2, F=3, G=4, A=5, B=6)
       y       = Y0 - (langkah - 18) x 6

   Garis paranada semuanya jatuh di langkah GENAP:
       bas    G2=18  B2=20  D3=22  F3=24  A3=26
       C tengah      C4=28  (garis bantu di antara dua paranada)
       treble E4=30  G4=32  B4=34  D5=36  F5=38
   =========================================================================== */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const LETTER = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];   // semitone -> huruf
  const SHARP = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];    // perlu tanda kres?

  const STEP_UNIT = 6;        // jarak setengah-langkah tegak
  const Y0 = 150;             // y untuk langkah 18 (G2, garis bawah bas)
  const H = 196;              // tinggi viewBox
  const BASS = [18, 20, 22, 24, 26];
  const TREBLE = [30, 32, 34, 36, 38];

  const stepOf = (midi) => {
    const pc = ((midi % 12) + 12) % 12;
    return Math.floor(midi / 12 - 1) * 7 + LETTER[pc];
  };
  const isSharp = (midi) => !!SHARP[((midi % 12) + 12) % 12];
  const yOf = (step) => Y0 - (step - 18) * STEP_UNIT;

  /** Garis bantu yang dibutuhkan sebuah not di langkah `s`. */
  function ledgers(s) {
    const out = [];
    if (s >= 40) { for (let e = 40; e <= s; e += 2) out.push(e); }
    else if (s <= 16) { for (let e = 16; e >= s; e -= 2) out.push(e); }
    else if (s === 28) out.push(28);
    return out;
  }

  /**
   * @param {HTMLElement} host
   * @param {object} [opts] {pps:110, playheadAt:0.28, width:900}
   */
  function createStaff(host, opts) {
    opts = opts || {};
    const PPS = opts.pps || 110;             // piksel per detik
    const W = opts.width || 900;
    let headX = W * (opts.playheadAt === undefined ? 0.28 : opts.playheadAt);

    let vbTop = 0, vbH = H;                  // diperlebar otomatis, lihat fit()

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'staff');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Not balok bergulir');

    const mk = (tag, attrs) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    };

    // --- paranada (diam) ---
    const fixed = mk('g', { class: 'staff__fixed' });
    [...BASS, ...TREBLE].forEach(s => {
      fixed.append(mk('line', { class: 'staff__line', x1: 0, x2: W,
                                y1: yOf(s), y2: yOf(s) }));
    });
    // batang penghubung dua paranada di ujung kiri
    fixed.append(mk('line', { class: 'staff__brace', x1: 1, x2: 1,
                              y1: yOf(38), y2: yOf(18) }));
    svg.append(fixed);

    // --- not (bergulir) ---
    const scroll = mk('g', { class: 'staff__scroll' });
    svg.append(scroll);

    // --- garis penanda (diam, di atas not) ---
    const head = mk('g', { class: 'staff__head' });
    const headLine = mk('line', { x1: headX, x2: headX, y1: 4, y2: H - 4 });
    head.append(headLine);
    const headTip = mk('polygon', {
      points: (headX - 6) + ',4 ' + (headX + 6) + ',4 ' + headX + ',14' });
    head.append(headTip);
    svg.append(head);

    /* NOTETABL menjangkau C1 sampai C7 — jauh di luar paranada besar. Daripada
       memotong not yang tidak muat, kotak pandang diperlebar seperlunya. Skala
       tegaknya tetap sama, jadi jarak antar garis tidak berubah; yang berubah
       hanya berapa banyak ruang kosong yang ikut terlihat. */
    /** Gambar ulang garis penanda pada posisi `headX` yang berlaku. */
    function placeHead() {
      headLine.setAttribute('x1', headX);
      headLine.setAttribute('x2', headX);
      headLine.setAttribute('y1', vbTop + 4);
      headLine.setAttribute('y2', vbTop + vbH - 4);
      headTip.setAttribute('points',
        (headX - 6) + ',' + (vbTop + 4) + ' ' +
        (headX + 6) + ',' + (vbTop + 4) + ' ' +
        headX + ',' + (vbTop + 14));
    }

    function fit(steps) {
      let top = 0, bot = H;
      // Jangkauan tetap (kalau ada) SELALU ikut dihitung. Tanpa ini,
      // `setNotes([])` akan mengecilkan kembali kotak pandang yang sudah
      // dipas untuk papan tuts bebas.
      const all = opts.range ? steps.concat(opts.range.map(stepOf)) : steps;
      all.forEach(s => {
        const y = yOf(s);
        if (y - 34 < top) top = y - 34;        // ruang untuk tangkai ke atas
        if (y + 34 > bot) bot = y + 34;
      });
      vbTop = Math.floor(top);
      vbH = Math.ceil(bot) - vbTop;
      svg.setAttribute('viewBox', '0 ' + vbTop + ' ' + W + ' ' + vbH);
      placeHead();
    }

    /* Papan tuts bebas tahu jangkauannya sejak awal, jadi kotak pandang bisa
       dipas sekali di muka. Kalau menunggu not pertama yang tinggi, skala
       tegaknya berubah di tengah jalan dan seluruh gambar terlihat melompat. */
    if (opts.range) fit(opts.range.map(stepOf));

    host.textContent = '';
    host.append(svg);

    const notes = [];        // {midi, t, dur, g}

    function draw(n) {
      const s = stepOf(n.midi);
      const x = headX + n.t * PPS;
      const y = yOf(s);
      const g = mk('g', { class: 'note' + (n.rest ? ' note--rest' : '') });
      g.setAttribute('transform', 'translate(' + x + ',' + y + ')');

      ledgers(s).forEach(e => g.append(mk('line', {
        class: 'note__ledger', x1: -11, x2: 11,
        y1: yOf(e) - y, y2: yOf(e) - y })));

      // kepala not: elips miring, seperti notasi sungguhan
      g.append(mk('ellipse', { class: 'note__head', cx: 0, cy: 0,
                               rx: 6.2, ry: 4.4,
                               transform: 'rotate(-20)' }));

      // tangkai: ke atas kalau not di bawah tengah, ke bawah kalau di atas
      const up = s < 28;
      g.append(mk('line', { class: 'note__stem',
        x1: up ? 5.6 : -5.6, x2: up ? 5.6 : -5.6,
        y1: 0, y2: up ? -30 : 30 }));

      if (isSharp(n.midi)) {
        const t = mk('text', { class: 'note__acc', x: -18, y: 5 });
        t.textContent = '♯';
        g.append(t);
      }

      // panjang not tergambar sebagai batang di belakang kepala
      if (n.dur > 0) {
        g.insertBefore(mk('rect', { class: 'note__len', x: -6,
          y: -3.5, width: Math.max(6, n.dur * PPS), height: 7, rx: 3.5 }),
          g.firstChild);
      }

      scroll.append(g);
      n.g = g;
      return g;
    }

    let lastT = -1;
    return {
      get headX() { return headX; },
      pps: PPS,

      /**
       * Pindahkan garis penanda saat program berjalan.
       *
       * Inilah "satu angka" yang membedakan memutar lagu (0.28, penanda di
       * kiri, ruang kanan untuk yang akan datang) dari bermain sendiri (0.9,
       * penanda di kanan, seluruh layar jadi riwayat). FREEPLAY memakai
       * keduanya bergantian: 0.9 saat menekan tuts, 0.28 saat memutar MIDI.
       *
       * Seluruh not harus digambar ulang karena posisi mendatarnya dihitung
       * dari `headX`. Itu terdengar mahal, tapi hanya terjadi saat berganti
       * mode — bukan tiap frame.
       */
      setPlayhead(frac) {
        headX = W * frac;
        placeHead();
        const keep = notes.slice();
        this.setNotes(keep);
      },

      /** Ganti seluruh isi dengan daftar not baru. */
      setNotes(list) {
        const src = (list || []).slice();
        scroll.textContent = '';
        notes.length = 0;
        fit(src.map(n => stepOf(n.midi)));
        src.forEach(n => { notes.push(n); draw(n); });
        lastT = -1;
        this.setTime(0);
      },

      /** Tambah satu not di waktu `t` — dipakai papan tuts bebas. */
      push(midi, t, dur) {
        const n = { midi, t, dur: dur || 0.35 };
        const y = yOf(stepOf(midi));
        if (y - 34 < vbTop || y + 34 > vbTop + vbH) {
          fit(notes.concat([n]).map(x => stepOf(x.midi)));
        }
        notes.push(n);
        draw(n);
        // buang not yang sudah jauh keluar layar supaya DOM tidak menumpuk
        while (notes.length > 400) {
          const old = notes.shift();
          if (old.g) old.g.remove();
        }
        return n;
      },

      /**
       * Ubah panjang sebuah not yang sudah tergambar.
       * Dibutuhkan papan tuts: saat not digambar, panjangnya belum diketahui —
       * baru ketahuan ketika tutsnya dilepas. Yang berubah hanya LEBAR batang,
       * bukan posisinya, jadi not tidak melompat saat sedang ditahan.
       */
      setDur(n, dur) {
        if (!n) return;
        n.dur = dur;
        const bar = n.g && n.g.querySelector('.note__len');
        if (bar) bar.setAttribute('width', Math.max(6, dur * PPS));
      },

      /** Geser gulungan ke posisi waktu `t` (detik). */
      setTime(t) {
        if (t === lastT) return;
        lastT = t;
        scroll.setAttribute('transform', 'translate(' + (-t * PPS) + ',0)');
        notes.forEach(n => {
          if (!n.g) return;
          const rel = n.t - t;
          n.g.classList.toggle('is-now', rel <= 0.02 && rel > -(n.dur || 0.3));
          n.g.classList.toggle('is-past', rel <= -(n.dur || 0.3));
        });
      },

      clear() {
        scroll.textContent = '';
        notes.length = 0;
        lastT = -1;
        scroll.setAttribute('transform', 'translate(0,0)');
      },

      stepOf, yOf, isSharp
    };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.staff = createStaff;
})(window);
