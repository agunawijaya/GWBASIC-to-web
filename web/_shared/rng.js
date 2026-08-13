/* ===========================================================================
   rng.js — pengacak berbenih.

   DARI RETRO KE MODERN
   --------------------
   Aslinya, hampir semua program di koleksi ini menyemai pengacaknya begini:

       RANDOMIZE VAL(RIGHT$(TIME$,2))

   yaitu dua digit terakhir detik jam — hanya 60 kemungkinan benih. Dua sesi yang
   dimulai pada detik yang sama akan mendapat urutan kartu yang identik.

   Yang lebih baik sudah ada di koleksi itu sendiri: METEOR.BAS mengaduk benihnya
   selama menunggu pemain menekan tombol, sehingga waktu reaksi manusia jadi
   sumber entropi. READING.BAS menggabungkan jam+menit+detik.

   Di sini kita ambil keduanya, plus satu hal yang tidak mungkin dulu:
   pengacak yang **bisa diulang persis**. Beri benih yang sama, dapat urutan yang
   sama — sehingga permainan bisa diuji, bug bisa direproduksi, dan pemain bisa
   berbagi "papan nomor 12345".

   Algoritmanya mulberry32: 32-bit, cepat, kualitas jauh di atas yang dibutuhkan
   permainan, dan cukup pendek untuk dibaca utuh.
   =========================================================================== */
(function (global) {
  'use strict';

  /**
   * Buat pengacak baru.
   * @param {number|string} [seed] benih; kalau kosong diambil dari waktu + acak kripto
   */
  function createRng(seed) {
    let state = normaliseSeed(seed);
    const initialSeed = state;

    /** Bilangan pecahan 0 <= x < 1. Padanan RND di BASIC. */
    function next() {
      state |= 0;
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    return {
      seed: initialSeed,
      next,

      /** Bilangan bulat 0..n-1. Padanan INT(RND*n). */
      int(n) { return Math.floor(next() * n); },

      /** Bilangan bulat min..max, keduanya inklusif. Padanan lempar dadu. */
      between(min, max) { return min + Math.floor(next() * (max - min + 1)); },

      /** Satu anggota acak dari array. */
      pick(arr) { return arr[Math.floor(next() * arr.length)]; },

      /**
       * Kocok array **di tempat** dengan Fisher-Yates.
       * Ini yang benar. Bandingkan dengan cara lama yang banyak dipakai:
       * "ambil kartu acak, kalau sudah terpakai ambil lagi" — makin ke akhir
       * makin sering gagal, dan waktunya tidak terbatas.
       */
      shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(next() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      },

      /** true dengan peluang p (0..1). */
      chance(p) { return next() < p; }
    };
  }

  function normaliseSeed(seed) {
    if (typeof seed === 'number' && Number.isFinite(seed)) return seed | 0;
    if (typeof seed === 'string' && seed.length) {
      // hash string -> 32 bit (FNV-1a), supaya "papan ABC" selalu sama
      let h = 0x811C9DC5;
      for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
      }
      return h | 0;
    }
    return freshSeed();
  }

  /** Benih dari sumber sungguhan — bukan 60 kemungkinan seperti aslinya. */
  function freshSeed() {
    if (global.crypto && global.crypto.getRandomValues) {
      return global.crypto.getRandomValues(new Uint32Array(1))[0] | 0;
    }
    return (Date.now() ^ (performance.now() * 1000)) | 0;
  }

  /**
   * Entropi dari waktu reaksi manusia — persis trik METEOR.BAS (1981), yang
   * mengaduk benihnya selama menunggu pemain menekan tombol.
   * Panggil berulang di dalam loop tunggu; hasilnya jadi benih yang bagus.
   */
  function stirFromUser(current) {
    return ((current * 33) ^ ((performance.now() * 1000) | 0)) | 0;
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.rng = createRng;
  global.RETRO.freshSeed = freshSeed;
  global.RETRO.stirFromUser = stirFromUser;
})(window);
