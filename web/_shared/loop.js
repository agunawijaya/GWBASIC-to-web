/* ===========================================================================
   loop.js — game loop dengan langkah waktu tetap.

   DARI RETRO KE MODERN
   --------------------
   Ini perubahan paling penting di seluruh proyek, jadi layak dijelaskan panjang.

   Aslinya, kecepatan permainan diatur dengan menghitung pekerjaan:

       FOOTBALL.BAS:  FOR HOLD=1 TO DELAY: ... : NEXT HOLD
       PIECHART.BAS:  FOR I=1 TO 9000: NEXT
       BOGGY.BAS:     FOR A=1 TO 2000: NEXT

   Berapa lama `FOR I=1 TO 2000: NEXT` berjalan? **Tergantung kecepatan
   komputernya.** Di IBM PC 4,77 MHz mungkin setengah detik; di 486 sekejap saja.

   Akibatnya seluruh generasi permainan ini jadi tak bisa dimainkan begitu
   prosesor makin cepat — dan lahirlah utilitas seperti SLOWDOWN.COM dan
   GOSLOW.COM yang ada di `..\tools\` koleksi ini. Itu bukan fitur; itu tambalan
   untuk kesalahan rancangan.

   Pelajarannya masih berlaku persis: **jangan mengukur waktu dengan menghitung
   pekerjaan. Ukur waktu dengan jam.**

   Yang dipakai di sini adalah pola *fixed timestep*: simulasi selalu maju dalam
   potongan waktu yang sama besar (mis. 1/60 detik), berapa pun kecepatan mesin.
   Kalau mesin lambat, satu frame menjalankan beberapa langkah simulasi. Kalau
   cepat, sisa waktunya dipakai untuk interpolasi saat menggambar.

   Hasilnya: perilaku permainan **identik** di mesin mana pun — sesuatu yang
   tidak pernah bisa dicapai versi aslinya.
   =========================================================================== */
(function (global) {
  'use strict';

  /**
   * @param {object} opts
   * @param {function(number, number)} opts.update  (dt detik, waktuTotal detik)
   * @param {function(number)} [opts.render]        (alpha 0..1 untuk interpolasi)
   * @param {number} [opts.hz=60]                   langkah simulasi per detik
   * @param {number} [opts.maxCatchUp=5]            batas langkah susulan per frame
   */
  function createLoop(opts) {
    const update = opts.update;
    const render = opts.render || null;
    const step = 1 / (opts.hz || 60);
    const maxCatchUp = opts.maxCatchUp || 5;

    let raf = 0, last = 0, acc = 0, elapsed = 0;
    let running = false, paused = false;

    function frame(now) {
      if (!running) return;
      raf = global.requestAnimationFrame(frame);

      let dt = (now - last) / 1000;
      last = now;

      // Lompatan besar terjadi kalau tab disembunyikan lalu dibuka lagi.
      // Tanpa batas ini, simulasi akan mencoba mengejar berjam-jam sekaligus
      // dan tab membeku — "spiral of death" yang klasik.
      if (dt > 0.25) dt = step;
      if (paused) return;

      acc += dt;
      let steps = 0;
      while (acc >= step && steps < maxCatchUp) {
        update(step, elapsed);
        elapsed += step;
        acc -= step;
        steps++;
      }
      if (steps === maxCatchUp) acc = 0;      // menyerah mengejar, jangan menumpuk

      if (render) render(acc / step);         // alpha: posisi antara dua langkah
    }

    return {
      start() {
        if (running) return;
        running = true; paused = false;
        last = global.performance.now(); acc = 0;
        raf = global.requestAnimationFrame(frame);
      },
      stop() {
        running = false;
        global.cancelAnimationFrame(raf);
      },
      pause(on) { paused = on === undefined ? !paused : !!on; },
      get paused() { return paused; },
      get running() { return running; },
      get time() { return elapsed; },
      reset() { elapsed = 0; acc = 0; }
    };
  }

  /**
   * Jeda asinkron. Padanan langsung `FOR I=1 TO 2000: NEXT`, tapi
   * diukur dalam milidetik sungguhan, bukan dalam jumlah putaran.
   */
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  /**
   * Animasi sekali jalan selama `ms`, memanggil `onFrame(t)` dengan t 0..1.
   * Untuk hal-hal kecil seperti kartu dibalik atau ubin bergeser, di mana
   * membuat game loop penuh berlebihan.
   */
  function tween(ms, onFrame, easing) {
    const ease = easing || (t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    return new Promise(resolve => {
      const t0 = global.performance.now();
      (function tick(now) {
        const t = Math.min(1, (now - t0) / ms);
        onFrame(ease(t), t);
        if (t < 1) global.requestAnimationFrame(tick);
        else resolve();
      })(t0);
    });
  }

  /**
   * Jam yang bisa dijeda.
   *
   * `performance.now()` tidak pernah berhenti, dan itu benar — ia jam dinding.
   * Tapi yang dibutuhkan halaman musik adalah **jam pertunjukan**: waktu yang
   * berjalan selama lagu berjalan dan diam selama lagu dijeda.
   *
   * Caranya menabung, bukan mengurangi. Selama berjalan, waktu dibaca sebagai
   * "tabungan + berapa lama sejak terakhir dijalankan". Saat dijeda, selisih
   * itu dipindahkan ke tabungan dan jamnya berhenti membaca jam dinding.
   *
   * Ini pola yang sama dengan stopwatch, dan alasannya sama: menyimpan
   * "kapan mulai" saja tidak cukup begitu boleh ada jeda di tengah.
   */
  function createClock() {
    let saved = 0;          // detik yang sudah ditabung dari sesi-sesi sebelumnya
    let since = 0;          // performance.now() saat terakhir dijalankan
    let running = false;

    return {
      get running() { return running; },

      /** Waktu pertunjukan sekarang, dalam detik. */
      now() {
        return saved + (running ? (global.performance.now() - since) / 1000 : 0);
      },

      /** Mulai dari nol. */
      start() { saved = 0; since = global.performance.now(); running = true; },

      /** Jalan lagi dari posisi terakhir. */
      resume() {
        if (running) return;
        since = global.performance.now();
        running = true;
      },

      pause() {
        if (!running) return;
        saved = this.now();
        running = false;
      },

      /** Kembali ke nol dan berhenti. */
      reset() { saved = 0; since = global.performance.now(); running = false; },

      /** Pindah ke posisi tertentu tanpa mengubah status jalan/berhenti. */
      seek(t) { saved = t; since = global.performance.now(); }
    };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.loop = createLoop;
  global.RETRO.wait = wait;
  global.RETRO.tween = tween;
  global.RETRO.clock = createClock;
})(window);
