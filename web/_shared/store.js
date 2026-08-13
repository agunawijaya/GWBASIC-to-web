/* ===========================================================================
   store.js — penyimpanan yang bertahan antar sesi.

   DARI RETRO KE MODERN
   --------------------
   Aslinya, papan skor ditulis ke disket:

       ZAP'EM.BAS:  OPEN "O",1,"BS.SCO"  ...  PRINT#1, NME$(I), SCORE(I)
       STATS.BAS:   WRITE#1, Z(A,1,B), ...

   Perhatikan STATS.BAS memakai WRITE# dan bukan PRINT#: WRITE# menyisipkan koma
   pemisah dan tanda kutip otomatis, sehingga hasilnya bisa dibaca kembali oleh
   INPUT# tanpa ambiguitas. Itu format CSV, disediakan bahasa, tahun 1982.

   Padanan sekarang adalah localStorage + JSON. Kendala yang berubah: tidak ada
   lagi disket yang bisa lupa diganti (STATS.BAS punya seluruh rutin khusus untuk
   mendeteksi pemakai memasang disket yang salah).

   Kendala BARU yang muncul: kalau halaman dibuka lewat file://, semua berkas
   lokal berbagi satu origin — jadi kunci wajib diberi awalan per aplikasi.
   Dan di sebagian peramban/mode privat, localStorage bisa dilarang sama sekali,
   jadi harus ada jalur cadangan.
   =========================================================================== */
(function (global) {
  'use strict';

  const memory = new Map();          // cadangan kalau localStorage diblokir
  let backendChecked = false;
  let hasLocal = false;

  function localAvailable() {
    if (backendChecked) return hasLocal;
    backendChecked = true;
    try {
      const probe = '__retro_probe__';
      global.localStorage.setItem(probe, '1');
      global.localStorage.removeItem(probe);
      hasLocal = true;
    } catch (e) {
      hasLocal = false;                       // mode privat, izin, atau file://
    }
    return hasLocal;
  }

  /**
   * Buat penyimpanan ber-awalan untuk satu aplikasi.
   * @param {string} appId  mis. "hangman" -> kunci jadi "retro:hangman:skor"
   */
  function createStore(appId) {
    const prefix = 'retro:' + appId + ':';

    function read(key, fallback) {
      const k = prefix + key;
      try {
        const raw = localAvailable() ? global.localStorage.getItem(k)
                                     : (memory.has(k) ? memory.get(k) : null);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;                      // data rusak: jangan sampai crash
      }
    }

    function write(key, value) {
      const k = prefix + key;
      const raw = JSON.stringify(value);
      try {
        if (localAvailable()) global.localStorage.setItem(k, raw);
        else memory.set(k, raw);
      } catch (e) {
        memory.set(k, raw);                   // kuota penuh -> turun ke memori
      }
      return value;
    }

    return {
      get: read,
      set: write,
      remove(key) {
        const k = prefix + key;
        try { global.localStorage.removeItem(k); } catch (e) { /* abaikan */ }
        memory.delete(k);
      },

      /** true kalau data benar-benar bertahan setelah tab ditutup. */
      get persistent() { return localAvailable(); },

      /**
       * Papan skor tertinggi, seperti BS.SCO / HOPPER.SCO / LANDER.SCR.
       * Menyimpan `limit` entri teratas, terurut menurun.
       * @returns {Array<{name:string,score:number,at:number}>} daftar baru
       */
      addHighScore(name, score, limit) {
        limit = limit || 10;
        const list = read('highscores', []);
        list.push({ name: String(name).slice(0, 16) || 'ANON',
                    score: Number(score) || 0,
                    at: Date.now() });
        list.sort((a, b) => b.score - a.score);
        return write('highscores', list.slice(0, limit));
      },

      highScores() { return read('highscores', []); }
    };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.store = createStore;
})(window);
