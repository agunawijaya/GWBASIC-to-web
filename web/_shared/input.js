/* ===========================================================================
   input.js — masukan papan ketik, tetikus, dan sentuh.

   DARI RETRO KE MODERN
   --------------------
   Idiom paling sering muncul di seluruh koleksi (83 program):

       280 Z=INKEY$: IF Z="" THEN 280

   Artinya "ambil satu tombol; kalau belum ada, ulangi terus". Ini *polling*:
   program memutar CPU sekencang-kencangnya sampai ada tombol ditekan. Dulu itu
   satu-satunya cara, karena BASIC tidak punya konsep menunggu tanpa bekerja.

   Padanan modern: `await input.nextKey()`. Peramban punya event loop, jadi
   "menunggu" benar-benar berarti tidak melakukan apa-apa — hemat baterai, dan
   tab tidak membeku.

   Idiom kedua yang selalu menyertainya:

       40 POKE 106,0
       50 IF INKEY$<>"" THEN 40

   `POKE 106,0` menulis langsung ke ruang kerja interpreter GW-BASIC untuk
   mengosongkan penyangga ketik-dulu, supaya pemain yang menekan-nekan tombol
   tidak melewati layar berikutnya tanpa membacanya. Tidak terdokumentasi, dan
   hanya jalan di GW-BASIC. Di sini fungsinya jelas: `input.flush()`.

   Tambahan yang tidak ada di aslinya: dukungan sentuh, karena separuh pembaca
   akan membukanya di ponsel.
   =========================================================================== */
(function (global) {
  'use strict';

  /**
   * @param {HTMLElement|Document} [target] elemen yang menerima fokus
   */
  function createInput(target) {
    target = target || global.document;

    const down = new Set();        // tombol yang sedang ditekan
    const queue = [];              // tombol yang sudah ditekan, belum diambil
    const waiters = [];            // janji yang sedang menunggu tombol
    const handlers = new Map();    // pendengar terdaftar

    // Tombol yang biasanya menggulung halaman; kita cegah selama bermain.
    const SCROLLERS = new Set([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft',
                               'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End']);
    let blockScroll = false;

    function onKeyDown(e) {
      if (e.repeat) return;
      if (blockScroll && SCROLLERS.has(e.key)) e.preventDefault();
      down.add(e.key);

      const evt = { key: e.key, code: e.code, ctrl: e.ctrlKey, alt: e.altKey,
                    shift: e.shiftKey, raw: e };

      // Pendengar khusus lebih dulu; kalau ada yang menangani, selesai.
      const list = handlers.get(e.key.toLowerCase()) || handlers.get('*');
      if (list) { list.forEach(fn => fn(evt)); }

      // Bangunkan satu penunggu, atau simpan untuk penunggu berikutnya.
      if (waiters.length) waiters.shift()(evt);
      else if (queue.length < 8) queue.push(evt);
    }

    function onKeyUp(e) { down.delete(e.key); }
    function onBlur() { down.clear(); }

    global.addEventListener('keydown', onKeyDown);
    global.addEventListener('keyup', onKeyUp);
    global.addEventListener('blur', onBlur);

    return {
      /**
       * Menunggu satu tombol. Padanan langsung dari
       * `280 Z=INKEY$: IF Z="" THEN 280`, tapi tanpa membakar CPU.
       * @returns {Promise<{key:string, code:string}>}
       */
      nextKey() {
        if (queue.length) return Promise.resolve(queue.shift());
        return new Promise(resolve => waiters.push(resolve));
      },

      /**
       * Menunggu salah satu dari sekumpulan tombol, huruf besar-kecil diabaikan.
       * Padanan `IF Z="Y" OR Z="y" THEN ... ELSE IF Z="N" ...`
       * @param {string[]} keys mis. ['y','n']
       */
      async nextKeyOf(keys) {
        const want = keys.map(k => k.toLowerCase());
        for (;;) {
          const e = await this.nextKey();
          const k = e.key.toLowerCase();
          if (want.includes(k)) return k;
        }
      },

      /** Padanan `DEF SEG:POKE 106,0` — buang tombol yang sudah menumpuk. */
      flush() { queue.length = 0; },

      /** Sedang ditekan sekarang? Untuk gerakan kontinu di permainan aksi. */
      isDown(key) { return down.has(key); },

      /** Salah satu dari daftar sedang ditekan? */
      anyDown(keys) { return keys.some(k => down.has(k)); },

      /**
       * Daftarkan pendengar. Padanan `ON KEY(n) GOSUB`.
       * @param {string} key nama tombol, atau '*' untuk semua
       * @returns {function} pemanggilnya membatalkan pendaftaran
       */
      on(key, fn) {
        const k = key.toLowerCase();
        if (!handlers.has(k)) handlers.set(k, []);
        handlers.get(k).push(fn);
        return () => {
          const list = handlers.get(k);
          const i = list.indexOf(fn);
          if (i >= 0) list.splice(i, 1);
        };
      },

      /** Cegah tombol panah & spasi menggulung halaman selama bermain. */
      captureScroll(on) { blockScroll = on !== false; },

      /**
       * Jadikan elemen bisa "diketuk" seperti tombol, sekaligus bisa diakses
       * papan ketik. Dipakai untuk papan permainan di layar sentuh.
       */
      tappable(el, fn) {
        el.addEventListener('click', fn);
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); }
        });
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      },

      destroy() {
        global.removeEventListener('keydown', onKeyDown);
        global.removeEventListener('keyup', onKeyUp);
        global.removeEventListener('blur', onBlur);
        handlers.clear(); waiters.length = 0; queue.length = 0; down.clear();
      }
    };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.input = createInput;
})(window);
