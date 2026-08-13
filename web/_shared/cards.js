/* ===========================================================================
   cards.js — setumpuk kartu remi, dipakai bersama.

   Ditetapkan oleh SOLITAIR (Sesi 8) sebagai pilot, dan akan dipakai 11
   program kartu sesudahnya. Karena itu modul ini sengaja TIDAK tahu apa-apa
   soal solitaire: ia hanya tahu kartu, tumpukan, dan cara menggambarnya.
   Aturan permainan tinggal di berkas permainannya masing-masing.

   Yang TIDAK dicakup di sini, supaya jelas batasnya: dadu (YAHTZEE, CRAPS),
   ubin domino (DOMINOES), dan papan BACKGAM. Ketiganya bukan kartu, dan
   memaksanya masuk ke sini hanya akan membuat modul ini kabur. Masing-masing
   akan dapat modulnya sendiri kalau memang terbukti dipakai lebih dari sekali.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Urutan warna mengikuti SOLITAIR.BAS baris 360-400 apa adanya:

       370 IF (I MOD 13) - 1 = 0 THEN RESTORE : Z = Z + 1
       390 CARD$(I) = ZZ$ + CHR$(Z)

     Z mulai dari 2 dan naik di kartu ke-1, 14, 27, 40 — jadi CHR$(3)..CHR$(6),
     yang di halaman kode 437 IBM PC persis hati, wajik, keriting, sekop.
     Nomor `gw` disimpan supaya dokumen bisa menunjuk balik ke angka aslinya. */
  const SUITS = [
    { key: 'hearts',   sym: '♥', color: 'red',   gw: 3, id: 'H', nama: 'hati' },
    { key: 'diamonds', sym: '♦', color: 'red',   gw: 4, id: 'D', nama: 'wajik' },
    { key: 'clubs',    sym: '♣', color: 'black', gw: 5, id: 'C', nama: 'keriting' },
    { key: 'spades',   sym: '♠', color: 'black', gw: 6, id: 'S', nama: 'sekop' }
  ];

  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const NAMA_PANGKAT = { A: 'As', J: 'Jack', Q: 'Ratu', K: 'Raja' };

  /**
   * Sebuah kartu. `v` 1..13 (As=1, Raja=13) adalah satu-satunya sumber urutan;
   * `rank` cuma label untuk dibaca manusia.
   * @typedef {{v:number, rank:string, suit:string, sym:string,
   *            color:string, id:string, gw:number}} Kartu
   */
  function card(v, suit) {
    return {
      v: v, rank: RANKS[v - 1],
      suit: suit.key, sym: suit.sym, color: suit.color, gw: suit.gw,
      id: suit.id + v
    };
  }

  /** Setumpuk 52 kartu, urutan sama dengan CARD$(1..52) sebelum dikocok. */
  function deck() {
    const out = [];
    SUITS.forEach(s => { for (let v = 1; v <= 13; v++) out.push(card(v, s)); });
    return out;
  }

  /* TIDAK ADA `shuffle` di sini dengan sengaja.

     `rng.js` sudah punya Fisher-Yates, dan menaruh yang kedua di modul ini
     berarti dua salinan algoritma yang sama persis di satu proyek -- yang
     lambat laun akan berbeda tanpa ada yang memutuskannya. Pakai:

         RETRO.rng(benih).shuffle(RETRO.cards.deck())

     Silsilahnya ada di web/docs/solitair.md: bentuk di SOLITAIR.BAS baris
     410-450 sama dengan yang di rng.js, dan sudah diuji khi-kuadrat bersama
     pembandingnya. */

  function isRed(c)   { return !!c && c.color === 'red'; }
  function label(c)   { return c ? c.rank + c.sym : ''; }

  /** Nama yang dibacakan pembaca layar: "As sekop", "10 hati". */
  function bacaan(c) {
    if (!c) return 'tempat kosong';
    const s = SUITS.filter(x => x.key === c.suit)[0];
    return (NAMA_PANGKAT[c.rank] || c.rank) + ' ' + (s ? s.nama : '');
  }

  /* --- penggambaran ---------------------------------------------------------
     `mk` lokal, bukan RETRO.ui.el, supaya modul ini tidak bergantung pada
     urutan pemuatan skrip. Halaman yang cuma butuh kartu tidak perlu ui.js. */
  function mk(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  /**
   * Elemen kartu terbuka.
   * @param {Kartu} c
   * @param {{small?:boolean, tag?:string}} [opts]
   */
  function faceEl(c, opts) {
    opts = opts || {};
    const e = mk(opts.tag || 'div',
                 'card card--' + c.color + (opts.small ? ' card--sm' : ''));
    e.dataset.card = c.id;
    e.setAttribute('role', 'img');
    e.setAttribute('aria-label', bacaan(c));

    const ix = mk('span', 'card__ix');
    ix.append(mk('b', null, c.rank), mk('i', null, c.sym));
    e.append(ix, mk('span', 'card__pip', c.sym));
    return e;
  }

  /** Elemen kartu tertutup. */
  function backEl(opts) {
    opts = opts || {};
    const e = mk('div', 'card card--back' + (opts.small ? ' card--sm' : ''));
    e.setAttribute('role', 'img');
    e.setAttribute('aria-label', 'kartu tertutup');
    return e;
  }

  /** Kotak kosong bergaris putus — tempat kartu yang belum terisi. */
  function slotEl(text) {
    const e = mk('div', 'card card--slot');
    if (text) e.append(mk('span', 'card__slot-txt', text));
    return e;
  }

  /** Gambar kartu: terbuka, tertutup, atau tempat kosong. */
  function el(c, opts) {
    opts = opts || {};
    if (!c) return slotEl(opts.slotText);
    return opts.up === false ? backEl(opts) : faceEl(c, opts);
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.cards = {
    SUITS: SUITS, RANKS: RANKS,
    card: card, deck: deck,
    isRed: isRed, label: label, bacaan: bacaan,
    el: el, faceEl: faceEl, backEl: backEl, slotEl: slotEl
  };
})(window);
