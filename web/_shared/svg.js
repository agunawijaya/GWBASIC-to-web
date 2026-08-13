/* ===========================================================================
   svg.js — bentuk bersama: kartu remi, dadu, bidak, ikon.

   DARI RETRO KE MODERN
   --------------------
   Aslinya, "grafik" berarti karakter. Kartu remi digambar dengan kotak CP437:

       CRAZY8.BAS:   DIM FIG$(5,5)      ' kartu = kisi 5x5 karakter
       BLACK.BAS:    ON CARD+1 GOSUB    ' 14 rutin, satu per nilai kartu
       CRAPS.BAS:    A1=CHR$(201)+STRING$(2,205)+CHR$(187)+CHR$(31)+...

   Yang terakhir itu cerdas: `CHR$(31)` adalah kursor-turun dan `CHR$(29)`
   kursor-kiri, jadi satu string berisi karakter kendali menggambar kotak dua
   dimensi dari satu `PRINT` tunggal. Itu *escape sequence* — prinsip yang sama
   dengan `\033[2J` di terminal Unix sampai hari ini.

   Kendala yang melahirkannya: mode grafis CGA lambat dan boros memori
   (320x200 sudah memakan 16 KB dari 64 KB yang ada), sementara menulis karakter
   ke memori layar hampir gratis.

   Kendala itu sudah tidak ada. SVG bebas resolusi, bisa dianimasikan, ringan,
   dan satu definisi bisa dipakai 52 kali lewat `<use>` — persis semangat
   `DIM FIG$(5,5)` yang membangun kartu dari data alih-alih menyimpan 52 gambar.

   Yang dipertahankan: satu sumber bentuk yang dipakai ulang, bukan satu gambar
   per kartu.
   =========================================================================== */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const SUITS = {
    S: { name: 'spades',   red: false, glyph: '♠' },
    H: { name: 'hearts',   red: true,  glyph: '♥' },
    C: { name: 'clubs',    red: false, glyph: '♣' },
    D: { name: 'diamonds', red: true,  glyph: '♦' }
  };
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  /* Jalur simbol, digambar dalam kotak 100x100 supaya mudah diskala. */
  const SUIT_PATH = {
    S: 'M50 4C50 4 8 42 8 68c0 15 11 25 24 25 6 0 12-3 15-8 1 12-4 22-13 28h32' +
       'c-9-6-14-16-13-28 3 5 9 8 15 8 13 0 24-10 24-25C92 42 50 4 50 4Z',
    H: 'M50 97C50 97 6 63 6 34 6 17 18 6 32 6c9 0 15 5 18 12 3-7 9-12 18-12' +
       '14 0 26 11 26 28 0 29-44 63-44 63Z',
    C: 'M50 6c-11 0-20 9-20 20 0 4 1 7 3 10-3-2-7-3-11-3-11 0-20 9-20 20s9 20 20 20' +
       'c7 0 13-4 17-9-1 12-6 20-14 26h50c-8-6-13-14-14-26 4 5 10 9 17 9' +
       '11 0 20-9 20-20s-9-20-20-20c-4 0-8 1-11 3 2-3 3-6 3-10 0-11-9-20-20-20Z',
    D: 'M50 4C64 30 78 44 96 51 78 58 64 72 50 98 36 72 22 58 4 51 22 44 36 30 50 4Z'
  };

  /** Sisipkan definisi bersama satu kali per halaman. Aman dipanggil berulang. */
  function ensureDefs() {
    if (document.getElementById('retro-svg-defs')) return;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('id', 'retro-svg-defs');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML =
      '<defs>' +
        Object.keys(SUIT_PATH).map(k =>
          '<path id="suit-' + k + '" d="' + SUIT_PATH[k] + '"/>').join('') +
        '<pattern id="card-guilloche" width="14" height="14" patternUnits="userSpaceOnUse">' +
          '<path d="M0 7 Q3.5 0 7 7 T14 7" fill="none" stroke="currentColor" stroke-width=".6" opacity=".28"/>' +
          '<path d="M7 0 Q14 3.5 7 7 T7 14" fill="none" stroke="currentColor" stroke-width=".6" opacity=".28"/>' +
        '</pattern>' +
        '<linearGradient id="card-back" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#2b4a7a"/><stop offset="1" stop-color="#16294a"/>' +
        '</linearGradient>' +
      '</defs>';
    document.body.prepend(svg);
  }

  /**
   * Kartu remi.
   * @param {string} rank  'A','2'..'10','J','Q','K'
   * @param {string} suit  'S','H','C','D'
   * @param {object} [o]   {faceDown:boolean, w:number}
   * @returns {SVGElement}
   */
  function card(rank, suit, o) {
    ensureDefs();
    o = o || {};
    const w = o.w || 90, h = Math.round(w * 1.4);
    const s = SUITS[suit] || SUITS.S;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 140');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('class', 'card' + (o.faceDown ? ' card--down' : ''));
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', o.faceDown ? 'Kartu tertutup'
                                              : rank + ' ' + s.name);

    if (o.faceDown) {
      svg.innerHTML =
        '<rect x="2" y="2" width="96" height="136" rx="8" fill="url(#card-back)" ' +
              'stroke="#0e1a2e"/>' +
        '<rect x="9" y="9" width="82" height="122" rx="5" fill="none" ' +
              'stroke="#5f83bd" stroke-width="1.4" opacity=".7"/>' +
        '<g color="#8fb2e6"><rect x="9" y="9" width="82" height="122" rx="5" ' +
              'fill="url(#card-guilloche)"/></g>';
      return svg;
    }

    const ink = s.red ? '#c1272d' : '#131a22';
    const pip = (x, y, size, rot) =>
      '<use href="#suit-' + suit + '" fill="' + ink + '" ' +
      'transform="translate(' + x + ',' + y + ') scale(' + (size / 100) + ')' +
      (rot ? ' rotate(180 50 50)' : '') + '"/>';

    // Tata letak pip untuk kartu angka — tabel, bukan 13 rutin terpisah.
    const LAYOUT = {
      '2': [[50, 22], [50, 88]], '3': [[50, 22], [50, 55], [50, 88]],
      '4': [[28, 22], [72, 22], [28, 88], [72, 88]],
      '5': [[28, 22], [72, 22], [50, 55], [28, 88], [72, 88]],
      '6': [[28, 22], [72, 22], [28, 55], [72, 55], [28, 88], [72, 88]],
      '7': [[28, 22], [72, 22], [50, 38], [28, 55], [72, 55], [28, 88], [72, 88]],
      '8': [[28, 22], [72, 22], [50, 38], [28, 55], [72, 55], [50, 72], [28, 88], [72, 88]],
      '9': [[28, 20], [72, 20], [28, 44], [72, 44], [50, 55], [28, 66], [72, 66], [28, 90], [72, 90]],
      '10': [[28, 18], [72, 18], [28, 40], [72, 40], [50, 29], [28, 62], [72, 62], [50, 73], [28, 92], [72, 92]]
    };

    let body = '';
    if (rank === 'A') {
      body = pip(50 - 17, 70 - 17, 34);
    } else if (LAYOUT[rank]) {
      body = LAYOUT[rank].map(([x, y], i, arr) =>
        pip(x - 6, y - 6, 12, y > 55 && arr.length > 3)).join('');
    } else {                                   // J, Q, K
      body =
        '<rect x="26" y="34" width="48" height="72" rx="4" fill="none" ' +
              'stroke="' + ink + '" stroke-width="1.6"/>' +
        '<text x="50" y="78" text-anchor="middle" font-family="Georgia,serif" ' +
              'font-size="34" font-weight="700" fill="' + ink + '">' + rank + '</text>' +
        pip(50 - 9, 88, 18);
    }

    svg.innerHTML =
      '<rect x="2" y="2" width="96" height="136" rx="8" fill="#fbfcfe" ' +
            'stroke="#b9c4d2"/>' +
      '<text x="9" y="21" font-family="Georgia,serif" font-size="17" ' +
            'font-weight="700" fill="' + ink + '">' + rank + '</text>' +
      '<use href="#suit-' + suit + '" fill="' + ink + '" ' +
           'transform="translate(8,24) scale(.11)"/>' +
      '<g transform="rotate(180 50 70)">' +
        '<text x="9" y="21" font-family="Georgia,serif" font-size="17" ' +
              'font-weight="700" fill="' + ink + '">' + rank + '</text>' +
        '<use href="#suit-' + suit + '" fill="' + ink + '" ' +
             'transform="translate(8,24) scale(.11)"/>' +
      '</g>' + body;
    return svg;
  }

  /** Dadu tampak depan, 1..6. */
  function die(n, o) {
    o = o || {};
    const w = o.w || 56;
    const P = { 1: [[50, 50]], 2: [[28, 28], [72, 72]],
                3: [[28, 28], [50, 50], [72, 72]],
                4: [[28, 28], [72, 28], [28, 72], [72, 72]],
                5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
                6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]] };
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', w); svg.setAttribute('height', w);
    svg.setAttribute('class', 'die');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dadu ' + n);
    svg.innerHTML =
      '<rect x="4" y="4" width="92" height="92" rx="16" fill="#f7f9fc" ' +
            'stroke="#aab6c4" stroke-width="2"/>' +
      (P[n] || []).map(([x, y]) =>
        '<circle cx="' + x + '" cy="' + y + '" r="8.5" fill="#141b23"/>').join('');
    return svg;
  }

  /** Dek 52 kartu sebagai array {rank,suit,id} — belum dikocok. */
  function newDeck() {
    const out = [];
    for (const suit of ['S', 'H', 'C', 'D']) {
      for (const rank of RANKS) out.push({ rank, suit, id: rank + suit });
    }
    return out;
  }

  /** Nilai blackjack sebuah kartu (As dihitung 11, penyesuaian di pemanggil). */
  function blackjackValue(c) {
    if (c.rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(c.rank)) return 10;
    return parseInt(c.rank, 10);
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.svg = { card, die, newDeck, blackjackValue,
                       SUITS, RANKS, SUIT_PATH, ensureDefs, NS };
})(window);
