/* ===========================================================================
   dice.js — dadu, dipakai bersama.

   Modul ini lahir dengan syarat yang sudah ditulis lebih dulu di cards.js:

       "Yang TIDAK dicakup di sini, supaya jelas batasnya: dadu (YAHTZEE,
        CRAPS) ... Masing-masing akan dapat modulnya sendiri kalau memang
        terbukti dipakai lebih dari sekali."

   YAHTZEE (sesi 10) dan CRAPS (sesi 10) keduanya memakai dadu, jadi syaratnya
   terpenuhi — dan modul ini dibuat pada program pertama yang membutuhkannya,
   bukan sebelumnya. Kalau ternyata cuma satu program yang memakainya, berkas
   ini seharusnya dilebur kembali ke program itu.

   Seperti cards.js, modul ini TIDAK tahu aturan permainan apa pun. Ia hanya
   tahu: sebuah dadu punya mata 1..6, dan begini rupanya.

   ------------------------------------------------------------------------
   KENAPA SVG, BUKAN KISI CSS

   Titik dadu bisa digambar dengan sembilan kotak CSS dan `visibility`. Itu
   lebih pendek. Yang hilang: pada ukuran kecil, titik yang digambar sebagai
   kotak ber-`border-radius` tidak pernah benar-benar bulat — sudutnya
   dibulatkan oleh pembulatan piksel, dan lima titik di satu dadu membulat ke
   arah yang berbeda-beda.

   Lingkaran SVG tetap lingkaran di ukuran berapa pun, dan tata letaknya
   diturunkan dari satu kisi 3x3 yang sama untuk keenam mata — jadi mustahil
   ada mata yang titiknya bergeser sendiri dari yang lain.
   =========================================================================== */

(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  /* Kisi 3x3, dinyatakan sekali. Kolom dan baris 0..2; koordinat sebenarnya
     dihitung dari sana, jadi mengubah ukuran dadu tidak pernah membuat
     titiknya keluar dari kotaknya. */
  const KOLOM = [0, 1, 2];

  /* Mata 1..6 sebagai daftar sel (kolom, baris) pada kisi itu.

     Susunannya bukan pilihan bebas: dadu sungguhan selalu menaruh mata ganjil
     dengan satu titik di pusat, dan mata genap simetris terhadap kedua sumbu.
     Itu sebabnya 6 memakai dua kolom penuh, bukan dua baris — sisi 6 dan 3
     harus bisa dibaca dari arah yang sama. */
  const POLA = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [2, 0], [0, 2], [2, 2]],
    5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
    6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]
  };

  const mk = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };

  /**
   * Satu dadu sebagai elemen SVG.
   * @param {number} v mata 1..6
   * @param {{size?:number, tag?:string}} [opts]
   */
  function el(v, opts) {
    opts = opts || {};
    const S = opts.size || 46;
    const svg = mk('svg', {
      class: 'die', viewBox: '0 0 100 100',
      width: S, height: S, role: 'img',
      'aria-label': 'dadu ' + v
    });
    svg.dataset.v = v;
    svg.append(mk('rect', { class: 'die__body', x: 4, y: 4, width: 92, height: 92, rx: 18 }));
    (POLA[v] || []).forEach(([c, r]) => {
      svg.append(mk('circle', {
        class: 'die__pip',
        cx: 24 + KOLOM[c] * 26,
        cy: 24 + KOLOM[r] * 26,
        r: 9
      }));
    });
    return svg;
  }

  /** Lempar n dadu dengan pengacak yang diberikan. Padanan INT(6*RND(1)+1). */
  function roll(r, n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(r.between(1, 6));
    return out;
  }

  /**
   * Tabel frekuensi mata 1..6 — indeks 0 tidak dipakai.
   *
   * Ini teknik yang dipakai YAHTZEE.BAS baris 2200-2280, dan alasannya masih
   * berlaku: begitu frekuensinya dihitung, SEMUA pertanyaan tentang
   * segenggam dadu ("three of a kind?", "full house?") dijawab dari tabel
   * itu, bukan dengan membandingkan dadu satu per satu.
   */
  function tally(dadu) {
    const t = [0, 0, 0, 0, 0, 0, 0];
    dadu.forEach(v => { t[v]++; });
    return t;
  }

  /** Mata yang diurutkan menurut BANYAKNYA, terbanyak dulu — padanan S(0,K). */
  function byCount(dadu) {
    const t = tally(dadu);
    const mata = [];
    for (let v = 1; v <= 6; v++) if (t[v]) mata.push(v);
    mata.sort((a, b) => t[b] - t[a] || b - a);
    return mata;
  }

  const sum = (dadu) => dadu.reduce((a, b) => a + b, 0);

  global.RETRO = global.RETRO || {};
  global.RETRO.dice = { el, roll, tally, byCount, sum, POLA };
})(window);
