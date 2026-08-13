/* ===========================================================================
   audio.js — penafsir makro PLAY + perintah SOUND, di atas Web Audio.

   DARI RETRO KE MODERN
   --------------------
   GW-BASIC punya dua perintah suara, dan koleksi ini memakai keduanya:

       PLAY "o2 t200 l8 d g a b >c d4 ml e c<"      (GERMFOLK.BAS)
       SOUND 525.25, 18.2                            (XWING.BAS)

   `PLAY` menerima bahasa makro not — sebuah *domain-specific language* yang
   dipanggang ke dalam interpreter BASIC tahun 1981. `SOUND` lebih mentah:
   frekuensi dalam Hz, durasi dalam satuan 1/18,2 detik (karena pencacah waktu
   IBM PC berdetak 18,2 kali per detik).

   Keduanya keluar lewat speaker PC internal: **satu suara saja, gelombang
   kotak, tanpa kendali volume**.

   Yang dipertahankan di sini:
     - bahasa makro PLAY ditafsirkan sungguhan, bukan diganti API lain, karena
       justru itu yang mau ditunjukkan. String lagu dari kode 1982 bisa disalin
       apa adanya dan berbunyi sama.
     - gelombang kotak, karena itu bunyi khasnya.
     - satu suara pada satu waktu (monofonik), seperti aslinya.

   Yang berubah, dan kenapa:
     - ada kendali volume dan tombol bisu. Speaker PC tidak punya; sekarang
       menyakiti telinga bukan lagi ciri khas yang perlu dilestarikan.
     - ada amplop serang/lepas 5 ms. Tanpa itu, gelombang kotak yang dipotong
       mendadak menghasilkan "klik" yang keras di speaker modern.
     - butuh gestur pengguna dulu (aturan peramban), jadi ada `unlock()`.
   =========================================================================== */
(function (global) {
  'use strict';

  let ctx = null;
  let master = null;
  let muted = false;
  let volume = 0.22;                 // gelombang kotak terdengar keras; tahan diri

  function ensureCtx() {
    if (ctx) return ctx;
    const AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : volume;
    master.connect(ctx.destination);
    return ctx;
  }

  /* Peramban menolak berbunyi sebelum ada gestur pengguna.

     Versi pertama menyelesaikannya dengan overlay "klik untuk mulai" di tiap
     halaman. Itu berlebihan: gestur apa pun sudah cukup, dan tiap halaman
     memang punya tombol yang harus ditekan lebih dulu ("Mainkan", huruf di
     HANGMAN, ubin di 15PUZZLE). Jadi kuncinya dibuka pada sentuhan PERTAMA
     apa pun, sekali, lalu pendengarnya dilepas. Tidak ada satu pun halaman
     yang perlu tahu soal ini. */
  /* Membuka perangkat audio dengan membunyikan SATU CUPLIKAN SENYAP.

     Sebuah AudioContext yang baru dibuat belum benar-benar terhubung ke
     perangkat suara. Selama perangkatnya masih dibuka — puluhan milidetik,
     kadang lebih di Windows — `currentTime` tetap di nol dan tidak ada satu
     pun render quantum yang berjalan.

     Nada pertama yang dijadwalkan di jendela itu bisa hilang. Gejalanya
     terkenal dan selalu sama: "bunyi pertama tidak keluar, yang kedua baru
     terdengar". Menyodorkan buffer satu cuplikan yang isinya diam memaksa
     perangkatnya terbuka sekarang, sehingga nada sungguhan yang menyusul
     sudah menemukan jam yang berjalan. */
  let primed = false;
  function prime(c) {
    if (primed || !c) return;
    primed = true;
    try {
      const src = c.createBufferSource();
      src.buffer = c.createBuffer(1, 1, c.sampleRate);
      src.connect(c.destination);
      src.start(0);
    } catch (e) { /* peramban lama: tidak apa-apa, hanya kehilangan pemanasan */ }
  }

  function unlock() {
    const c = ensureCtx();
    if (!c) return Promise.resolve();
    prime(c);
    if (c.state === 'suspended') return c.resume().then(() => prime(c));
    return Promise.resolve();
  }

  const WAKE = ['pointerdown', 'keydown', 'touchstart'];
  function wakeOnce() {
    unlock();
    // Satu fungsi yang sama dilepas dari ketiga kejadian. Kalau tiap
    // addEventListener diberi closure sendiri, removeEventListener tidak akan
    // cocok dan pendengarnya menetap selamanya.
    WAKE.forEach(e => global.removeEventListener(e, wakeOnce, true));
  }
  WAKE.forEach(e => global.addEventListener(e, wakeOnce, true));

  /** MIDI -> Hz. A4 (MIDI 69) = 440 Hz, temperamen sama. */
  function midiToHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  /* --- instrumen ----------------------------------------------------------
     Semuanya disintesis, bukan rekaman. Tidak ada berkas contoh nada yang
     dimuat — halaman ini harus jalan dari file:// tanpa aset tambahan, dan
     satu set sampel piano saja sudah berukuran puluhan megabita.

     Yang membedakan satu instrumen dari lainnya di sini ada tiga:
       partials  — deret harmonik: perbandingan frekuensi dan kerasnya.
                   Inilah yang paling menentukan "warna" suara.
       envelope  — a: serang, d: peluruhan, s: tingkat tahan, r: lepas.
                   Piano meluruh sampai nol; biola bertahan selama ditekan.
       filter    — menumpulkan atau menajamkan keseluruhan.
       vibrato   — goyangan kecil pada frekuensi; ciri alat gesek dan tiup.

     Hasilnya jelas bisa dibedakan telinga, tapi jujur saja: ini
     PENDEKATAN, bukan tiruan. Sebuah biola sungguhan jauh lebih rumit.

     `pcspeaker` adalah bawaan, dan itu disengaja — ia satu-satunya yang
     benar-benar terdengar seperti mesin aslinya. Sisanya kenyamanan. */
  const INSTRUMENTS = {
    pcspeaker: {
      label: 'Speaker PC (asli)',
      partials: [[1, 1]], type: 'square',
      env: { a: 0.005, d: 0, s: 1, r: 0.005 }, gain: 1
    },
    piano: {
      label: 'Piano',
      partials: [[1, 1], [2, 0.36], [3, 0.14], [4, 0.09], [6, 0.04]],
      type: 'sine',
      env: { a: 0.002, d: 1.6, s: 0, r: 0.18 }, gain: 1.5,
      filter: { type: 'lowpass', freq: 5200, q: 0.7 }
    },
    guitar: {
      label: 'Gitar',
      partials: [[1, 1], [2, 0.5], [3, 0.3], [4, 0.16], [5, 0.09], [6, 0.05]],
      type: 'triangle',
      env: { a: 0.004, d: 1.1, s: 0, r: 0.14 }, gain: 1.5,
      filter: { type: 'lowpass', freq: 3200, q: 1.1 }
    },
    violin: {
      label: 'Biola',
      partials: [[1, 1], [2, 0.55], [3, 0.35], [4, 0.2], [5, 0.12], [6, 0.07]],
      type: 'sawtooth',
      env: { a: 0.09, d: 0.12, s: 0.85, r: 0.12 }, gain: 0.9,
      filter: { type: 'lowpass', freq: 2900, q: 1.4 },
      vibrato: { rate: 5.4, depth: 0.006 }        // depth relatif thd frekuensi
    },
    trumpet: {
      label: 'Terompet',
      partials: [[1, 1], [2, 0.7], [3, 0.5], [4, 0.32], [5, 0.2], [6, 0.12]],
      type: 'sawtooth',
      env: { a: 0.045, d: 0.08, s: 0.9, r: 0.09 }, gain: 0.8,
      filter: { type: 'bandpass', freq: 1500, q: 0.8 },
      vibrato: { rate: 4.8, depth: 0.003 }
    },
    flute: {
      label: 'Seruling',
      partials: [[1, 1], [2, 0.12], [3, 0.05]],
      type: 'sine',
      env: { a: 0.07, d: 0.06, s: 0.9, r: 0.12 }, gain: 1.1,
      vibrato: { rate: 5, depth: 0.004 }
    },
    organ: {
      label: 'Organ',
      partials: [[1, 1], [2, 0.6], [3, 0.4], [4, 0.5], [6, 0.25], [8, 0.3]],
      type: 'sine',
      env: { a: 0.012, d: 0, s: 1, r: 0.06 }, gain: 0.8
    },
    musicbox: {
      label: 'Kotak musik',
      partials: [[1, 1], [3.2, 0.4], [5.7, 0.22], [8.1, 0.1]],
      type: 'sine',
      env: { a: 0.001, d: 0.9, s: 0, r: 0.3 }, gain: 1.4
    }
  };

  let instrument = 'pcspeaker';

  /* Rakit satu suara: partial-partial + penapis + getar, semuanya bermuara
     ke satu simpul penguat yang amplopnya belum ditulis.

     Dipisah dari `tone()` karena ada DUA cara memakainya, dan bedanya bukan
     soal bunyi melainkan soal WAKTU:

       tone()        panjang nada sudah diketahui saat dijadwalkan (PLAY/SOUND)
       startVoice()  panjang nada baru ketahuan saat tuts dilepas (papan tuts)

     Bagian yang sama — rakitannya — ditulis sekali di sini. Yang berbeda —
     amplopnya — ditulis di masing-masing pemakai. */
  function buildVoice(freq, when) {
    const c = ensureCtx();
    const ins = INSTRUMENTS[instrument] || INSTRUMENTS.pcspeaker;

    const amp = c.createGain();
    amp.gain.value = 0;

    let out = amp;
    if (ins.filter) {
      const f = c.createBiquadFilter();
      f.type = ins.filter.type;
      f.frequency.setValueAtTime(
        Math.min(c.sampleRate / 2 - 100, ins.filter.freq), when);
      f.Q.value = ins.filter.q || 1;
      amp.connect(f);
      out = f;
    }
    out.connect(master);

    // Getar frekuensi: satu LFO dipakai bersama semua partial.
    let lfo = null, lfoGain = null;
    if (ins.vibrato) {
      lfo = c.createOscillator();
      lfo.frequency.value = ins.vibrato.rate;
      lfoGain = c.createGain();
      lfo.connect(lfoGain);
    }

    const oscs = [];
    ins.partials.forEach(([ratio, level]) => {
      const o = c.createOscillator();
      o.type = ins.type;
      o.frequency.setValueAtTime(freq * ratio, when);
      const g = c.createGain();
      g.gain.value = level;
      o.connect(g); g.connect(amp);
      if (lfoGain) {
        const vg = c.createGain();
        vg.gain.value = freq * ratio * ins.vibrato.depth;
        lfoGain.connect(vg);
        vg.connect(o.frequency);
      }
      oscs.push(o);
    });
    if (lfoGain) lfoGain.gain.value = 1;

    return { ins, env: ins.env, amp, oscs, lfo, peak: ins.gain || 1 };
  }

  /* --- daftar suara yang sedang hidup -------------------------------------
     Setiap nada yang sudah dijadwalkan ke Web Audio akan berbunyi pada
     waktunya, dan tidak ada cara "membatalkan" osilator yang sudah di-`start`
     selain menghentikannya. Jadi semua suara didaftarkan di sini supaya
     `stop()` punya sesuatu untuk dihentikan.

     Ini yang dulu hilang: tombol Berhenti hanya membekukan gambar, karena
     bunyinya sudah terlanjur dijadwalkan sampai akhir lagu dan tidak ada yang
     memegang rujukannya lagi. */
  const live = new Set();

  function register(h) {
    live.add(h);
    // Lepas sendiri begitu nada selesai wajar, supaya daftarnya tidak tumbuh.
    if (h.oscs[0]) h.oscs[0].onended = () => live.delete(h);
  }

  function killAll() {
    if (!ctx) return;
    const t = ctx.currentTime;
    live.forEach(h => {
      try {
        // Diredam 30 ms dulu, tidak dipotong mentah — memotong gelombang di
        // tengah menghasilkan "klik" yang justru lebih mengganggu dari nadanya.
        h.amp.gain.cancelScheduledValues(t);
        h.amp.gain.setValueAtTime(Math.max(0.0001, h.amp.gain.value), t);
        h.amp.gain.linearRampToValueAtTime(0, t + 0.03);
        h.oscs.forEach(o => o.stop(t + 0.05));
        if (h.lfo) h.lfo.stop(t + 0.05);
      } catch (e) { /* sudah berhenti sendiri; tidak apa-apa */ }
    });
    live.clear();
  }

  /* Bunyikan satu nada dengan instrumen yang sedang dipilih.
     `when` dan `dur` dalam detik pada jam AudioContext. */
  function tone(freq, when, dur, gate) {
    const c = ensureCtx();
    if (!c) return;
    const v = buildVoice(freq, when);
    const env = v.env, amp = v.amp, peak = v.peak;

    const hold = Math.max(0.02, dur * (gate === undefined ? 1 : gate));

    // Amplop ADSR. Nilai 0 dihindari pada ramp eksponensial, jadi memakai
    // linear untuk serang dan setTarget untuk peluruhan.
    const t0 = when;
    const tA = t0 + Math.max(0.001, env.a);
    amp.gain.setValueAtTime(0, t0);
    amp.gain.linearRampToValueAtTime(peak, tA);

    let tRelease;
    if (env.s <= 0) {                       // meluruh sendiri: piano, gitar
      amp.gain.setTargetAtTime(0, tA, Math.max(0.02, env.d) / 3);
      tRelease = tA + Math.min(hold, env.d * 1.2);
    } else {                                // bertahan: biola, organ, tiup
      if (env.d > 0) {
        amp.gain.setTargetAtTime(peak * env.s, tA, Math.max(0.01, env.d));
      }
      tRelease = t0 + hold;
      amp.gain.setValueAtTime(Math.max(0.0001, amp.gain.value || peak * env.s),
                              tRelease);
      amp.gain.linearRampToValueAtTime(0, tRelease + env.r);
    }
    const stopAt = tRelease + env.r + 0.03;

    v.oscs.forEach(o => { o.start(t0); o.stop(stopAt); });
    if (v.lfo) { v.lfo.start(t0); v.lfo.stop(stopAt); }
    register(v);
  }

  /* --- nada yang ditahan --------------------------------------------------
     Untuk papan tuts: bunyikan sekarang, matikan nanti entah kapan.

     Ada jaring pengaman 30 detik. Kalau tuts "nyangkut" — misalnya jendela
     kehilangan fokus di tengah tekanan sehingga `keyup` tidak pernah sampai —
     osilatornya tetap berhenti sendiri. `stop()` boleh dipanggil ulang dengan
     waktu yang lebih awal; panggilan terakhirlah yang berlaku. */
  function startVoice(freq) {
    const c = ensureCtx();
    if (!c || muted) return null;

    /* Jeda awal diperpanjang selama konteks belum benar-benar berjalan.
       `unlock()` memanggil `resume()` yang asinkron, jadi pada gestur pertama
       nada bisa dijadwalkan sementara konteksnya masih tertidur. 60 ms cukup
       untuk menutupi jeda itu, dan tidak terasa sebagai kelambatan. */
    const when = c.currentTime + (c.state === 'running' ? 0.005 : 0.06);
    const v = buildVoice(freq, when);
    const env = v.env, amp = v.amp, peak = v.peak;

    const tA = when + Math.max(0.001, env.a);
    amp.gain.setValueAtTime(0, when);
    amp.gain.linearRampToValueAtTime(peak, tA);
    if (env.s <= 0) {                       // meluruh sendiri walau ditahan
      amp.gain.setTargetAtTime(0, tA, Math.max(0.02, env.d) / 3);
    } else if (env.d > 0) {
      amp.gain.setTargetAtTime(peak * env.s, tA, Math.max(0.01, env.d));
    }

    v.oscs.forEach(o => { o.start(when); o.stop(when + 30); });
    if (v.lfo) { v.lfo.start(when); v.lfo.stop(when + 30); }
    register(v);

    /* Berapa nilai amplop pada detik `t`, DIHITUNG dari jadwal yang barusan
       ditulis sendiri — bukan dibaca dari `amp.gain.value`.

       INILAH bug "tuts pertama tidak bunyi", dan sebabnya halus.

       `AudioParam.value` mengembalikan nilai yang terakhir kali BENAR-BENAR
       dirender oleh untai audio. Kalau untai itu belum sempat berjalan —
       persis keadaan pada nada pertama, saat perangkat suaranya masih dibuka —
       yang dikembalikan adalah nilai awalnya, yaitu **nol**.

       Lalu `release()` yang lama melakukan ini:

           g.setValueAtTime(Math.max(0.0001, g.value), now);   // 0.0001
           g.linearRampToValueAtTime(0, now + rel);            // 0.0001 -> 0

       Sebuah tanjakan dari nol ke nol. Nadanya tidak pernah berbunyi.

       Menghitung sendiri menghapus seluruh ketergantungan pada keadaan untai
       audio. Kita yang menulis jadwalnya; kita tahu nilainya tanpa bertanya.

       CATATAN JUJUR SOAL GEJALANYA.
       Bug ini mengenai SEMUA instrumen, bukan hanya sebagian — nada pertama
       hilang apa pun yang dipilih. Yang membuatnya terbaca sebagai "piano
       bunyi, yang lain tidak" adalah cacat KEDUA yang menumpang di atasnya:
       melepas tuts di tengah serangan memotong tanjakannya, dan yang tersisa
       tinggal separuh puncak. Untuk biola itu berarti 0,45 dari 0,90; untuk
       piano 1,38 dari 1,38, karena serangan 2 ms mustahil terpotong.

       Digabung dengan gain bawaannya (piano 1,5 — biola 0,9) selisihnya jadi
       sekitar 10 dB. Cukup untuk membuat yang satu terdengar jelas dan yang
       lain seperti tidak ada. Dua cacat, satu gejala — dan gejalanya menunjuk
       ke arah yang salah. */
    function levelAt(t) {
      if (t <= when) return 0.0001;
      if (t < tA) return Math.max(0.0001, peak * (t - when) / (tA - when));
      if (env.s <= 0) {                       // meluruh sendiri
        return Math.max(0.0001,
          peak * Math.exp(-(t - tA) / (Math.max(0.02, env.d) / 3)));
      }
      const sus = peak * env.s;               // bertahan
      if (!(env.d > 0)) return Math.max(0.0001, peak);
      return Math.max(0.0001,
        sus + (peak - sus) * Math.exp(-(t - tA) / Math.max(0.01, env.d)));
    }

    let done = false;
    return {
      freq,
      /**
       * Lepaskan nada.
       *
       * BUG YANG PERNAH ADA DI SINI, dan sebabnya layak dibaca pelan-pelan.
       *
       * Versi pertama selalu melakukan ini:
       *
       *     amp.gain.cancelScheduledValues(sekarang);
       *     amp.gain.setValueAtTime(amp.gain.value, sekarang);
       *     amp.gain.linearRampToValueAtTime(0, sekarang + lepas);
       *
       * Benar — asalkan serangannya sudah selesai. Kalau tuts dilepas
       * SEBELUM serangan selesai, `cancelScheduledValues` menghapus tanjakan
       * menuju puncak, lalu `amp.gain.value` yang dibaca masih nyaris nol,
       * dan yang tersisa adalah tanjakan dari nol ke nol.
       *
       * Nadanya tidak pernah berbunyi sama sekali.
       *
       * Yang membuatnya sulit dilihat: ia hanya terjadi pada instrumen
       * berserangan panjang. Piano menyerang dalam 2 ms, gitar 4 ms, organ
       * 12 ms — mustahil dilepas secepat itu. Tapi biola 90 ms, seruling
       * 70 ms, terompet 45 ms; sebuah ketukan pendek di bawah angka itu jadi
       * senyap total. Gejalanya terbaca sebagai "piano bunyi, yang lain
       * tidak" — padahal tidak ada hubungannya dengan instrumen mana,
       * melainkan dengan berapa lama tutsnya ditekan.
       *
       * Angka 90 ms itu bukan kesalahan, dan tidak diperkecil: biola memang
       * butuh waktu untuk berbunyi, dan itulah yang membuatnya terdengar
       * seperti biola. Yang diperbaiki adalah pelepasannya.
       */
      release() {
        if (done) return;
        done = true;
        live.delete(v);
        const now = c.currentTime;
        const rel = Math.max(0.04, env.r);
        const g = amp.gain;

        if (now < tA) {
          /* Masih menanjak. Seluruh amplop ditulis ULANG dari sekarang:
             serangan dipendekkan, tapi tidak dihapus. Nada pendek jadi tetap
             terdengar, dan warna instrumennya tetap utuh. */
          const quick = Math.min(0.02, Math.max(0.004, tA - now));
          g.cancelScheduledValues(now);
          g.setValueAtTime(levelAt(now), now);
          g.linearRampToValueAtTime(peak, now + quick);
          g.linearRampToValueAtTime(0, now + quick + rel);
          const stopAt = now + quick + rel + 0.03;
          v.oscs.forEach(o => o.stop(stopAt));
          if (v.lfo) v.lfo.stop(stopAt);
          return;
        }

        g.cancelScheduledValues(now);
        g.setValueAtTime(levelAt(now), now);
        g.linearRampToValueAtTime(0, now + rel);
        v.oscs.forEach(o => o.stop(now + rel + 0.03));
        if (v.lfo) v.lfo.stop(now + rel + 0.03);
      }
    };
  }

  /* --- penafsir makro PLAY ------------------------------------------------
     Perintah yang didukung (subset GW-BASIC yang dipakai koleksi ini):
       O n     oktaf 0..6            (bawaan 4; lihat catatan pemetaan di bawah)
       > <     naik / turun oktaf
       L n     panjang not bawaan    1,2,4,8,16,32,64 (4 = not seperempat)
       T n     tempo, not seperempat per menit, 32..255 (bawaan 120)
       A..G    not, boleh diikuti # atau + (kres), - (mol),
               angka panjang, dan titik (menambah setengah durasi)
       N n     not menurut nomor 0..84 (0 = diam)
       P n     istirahat sepanjang n
       ML MN MS  legato / normal / stakato — mengubah proporsi bunyi vs jeda
       MF MB   latar depan / belakang — diabaikan, tidak relevan di web
       X<var>; jalankan isi sebuah variabel — lihat catatan di bawah
     ---------------------------------------------------------------------- */

  /* Perintah X: "substring", yaitu PEMANGGILAN SUBRUTIN di dalam bahasa makro.
       DREAM.BAS:  10 A$ = "O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G"
                  160 PLAY "XA$;XB$;XC$;XD$;XA$;XB$;XC$;"
     Lima belas frasa disimpan sekali, lalu disusun jadi lagu — termasuk
     mengulang A B C dua kali. Bahasa makro PLAY punya pemakaian ulang, dan
     itulah yang membuat lagu tiga menit muat di 18 baris.
     Di sini isi variabel dioper lewat opts.vars. */

  const SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const GATE = { ML: 1.0, MN: 7 / 8, MS: 3 / 4 };

  /* PEMETAAN OKTAF — mudah meleset satu oktaf, jadi ditulis eksplisit.
     Manual GW-BASIC: "Ada tujuh oktaf, 0 sampai 6. Tiap oktaf dari C sampai B.
     Oktaf 3 dimulai dengan C tengah. Oktaf bawaan adalah 4."
     C tengah = C4 dalam notasi ilmiah = MIDI 60, maka:
         MIDI = 12 * (oktafGW + 2) + semitone
     Uji: oktaf 3, C -> 12*5 + 0 = 60 = C tengah. ✔
     Versi pertama memakai (oktaf + 1) dan hasilnya satu oktaf terlalu rendah —
     GERMFOLK.BAS terdengar seperti garis bas, bukan melodi. */
  const OCTAVE_BASE = 2;

  /* Perintah N memakai penomoran 1..84 yang dimulai di oktaf 0.
     N1 = oktaf 0, C = MIDI 12*(0+2) = 24, jadi MIDI = n + 23. */
  const NOTE_NUMBER_BASE = 23;

  /**
   * Ubah string makro jadi daftar nada.
   * @returns {{notes:Array<{freq:number,at:number,dur:number,gate:number}>, total:number}}
   */
  /** Ganti setiap `X<nama>;` dengan isi variabelnya, berulang sampai habis. */
  function expandX(src, vars, depth) {
    if (!vars || depth > 8) return src;
    let out = '', i = 0, changed = false;
    while (i < src.length) {
      if (src[i] === 'X') {
        const end = src.indexOf(';', i);
        if (end > i) {
          const name = src.slice(i + 1, end);
          const key = Object.keys(vars).find(
            k => k.toUpperCase().replace(/\s+/g, '') === name);
          if (key !== undefined) {
            out += String(vars[key]).toUpperCase().replace(/\s+/g, '');
            i = end + 1;
            changed = true;
            continue;
          }
        }
      }
      out += src[i++];
    }
    return changed ? expandX(out, vars, depth + 1) : out;
  }

  function parsePlay(macro, state, vars) {
    let s = String(macro).toUpperCase().replace(/\s+/g, '');
    s = expandX(s, vars, 0);
    const st = Object.assign({ octave: 4, length: 4, tempo: 120, gate: GATE.MN },
                             state || {});
    const notes = [];
    let t = 0;                                   // detik sejak awal
    let i = 0;

    const num = () => {                          // baca deretan angka
      let n = '';
      while (i < s.length && s[i] >= '0' && s[i] <= '9') n += s[i++];
      return n === '' ? null : parseInt(n, 10);
    };
    const dots = () => {                         // titik: 1.5x, 1.75x, ...
      let mult = 1, add = 0.5;
      while (s[i] === '.') { mult += add; add /= 2; i++; }
      return mult;
    };
    const beat = () => 60 / st.tempo;            // durasi not seperempat

    while (i < s.length) {
      const ch = s[i++];

      if (ch === 'O') { const n = num(); if (n !== null) st.octave = clamp(n, 0, 6); }
      else if (ch === '>') { st.octave = clamp(st.octave + 1, 0, 6); }
      else if (ch === '<') { st.octave = clamp(st.octave - 1, 0, 6); }
      else if (ch === 'T') { const n = num(); if (n !== null) st.tempo = clamp(n, 32, 255); }
      else if (ch === 'L') { const n = num(); if (n !== null) st.length = clamp(n, 1, 64); }
      else if (ch === 'M') {
        const k = 'M' + s[i++];
        if (GATE[k] !== undefined) st.gate = GATE[k];   // ML / MN / MS
        // MF dan MB diabaikan dengan sengaja
      }
      else if (ch === 'P' || ch === 'R') {              // istirahat
        const n = num();
        const dur = beat() * (4 / (n || st.length)) * dots();
        t += dur;
      }
      else if (ch === 'N') {                            // not menurut nomor
        const n = num();
        const dur = beat() * (4 / st.length) * dots();
        if (n) notes.push({ freq: midiToHz(n + NOTE_NUMBER_BASE), at: t, dur, gate: st.gate });
        t += dur;
      }
      else if (SEMITONE[ch] !== undefined) {            // A..G
        let semi = SEMITONE[ch];
        while (s[i] === '#' || s[i] === '+' || s[i] === '-') {
          semi += (s[i] === '-') ? -1 : 1;
          i++;
        }
        const n = num();
        const dur = beat() * (4 / (n || st.length)) * dots();
        const midi = 12 * (st.octave + OCTAVE_BASE) + semi;
        notes.push({ freq: midiToHz(midi), at: t, dur, gate: st.gate });
        t += dur;
      }
      // karakter lain diabaikan, sama seperti GW-BASIC yang permisif
    }
    return { notes, total: t, state: st };
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* --- API publik --------------------------------------------------------- */

  let chain = null;      // state PLAY berjalan, supaya beberapa PLAY nyambung

  /* --- penjadwal beruntun -------------------------------------------------
     Versi pertama `play()` menjadwalkan SELURUH lagu ke Web Audio dalam satu
     kali jalan. Itu sederhana dan akurat, tapi menimbulkan dua cacat yang
     baru terlihat saat dipakai sungguhan:

       1. Tombol Berhenti tidak bisa menghentikan bunyi. Osilator yang sudah
          dijadwalkan akan berbunyi pada waktunya, titik.
       2. Pergantian instrumen tidak berlaku di tengah lagu, karena `tone()`
          membaca instrumen saat MENJADWALKAN — dan penjadwalannya sudah
          selesai sebelum nada pertama berbunyi.

     Keduanya gejala dari satu penyebab: keputusan diambil terlalu awal.

     Penyelesaiannya pola baku Web Audio: sebuah pemompa yang berjalan tiap
     25 ms dan hanya menjadwalkan nada yang jatuh dalam 120 ms ke depan.
     Cukup jauh untuk kebal terhadap tersendatnya `setTimeout`, cukup dekat
     supaya perubahan apa pun terasa seketika.

     Ini bukan sekadar tambalan — ia mengubah sifat programnya. Nada tidak
     lagi "sudah pasti akan berbunyi"; ia baru pasti 120 ms sebelum terdengar.
     Segala sesuatu yang bisa berubah di tengah lagu jadi mungkin. */
  const LOOKAHEAD = 0.12;   // detik: sejauh apa menjadwalkan ke depan
  const TICK = 25;          // ms: sesering apa pemompa berjalan
  const LEAD = 0.06;        // detik: jeda sebelum nada pertama

  let gen = 0;              // naik tiap stop(); pemompa lama langsung berhenti
  let pending = [];         // {gen, resolve} dari play() yang belum selesai

  /* Semua setTimeout yang tertunda, supaya `stop()` bisa membatalkannya.
     Memakai Set dan menghapus diri sendiri saat menyala: sebuah lagu tiga menit
     menghasilkan ribuan pewaktu, dan array yang tidak pernah dibersihkan akan
     terus tumbuh selama halaman terbuka. */
  const timers = new Set();

  function later(fn, ms) {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  }

  function finish(my) {
    if (cur && cur.my === my) cur = null;
    const done = pending.filter(p => p.gen === my);
    pending = pending.filter(p => p.gen !== my);
    done.forEach(p => p.resolve());
  }

  /* Pemutaran yang sedang berjalan. Hanya boleh ada satu — bukan karena
     Web Audio tidak sanggup lebih, melainkan karena "jeda" dan "posisi
     sekarang" jadi tidak punya arti kalau ada dua lagu berjalan bersamaan.
     Batasan yang dipilih, bukan yang diwarisi. */
  let cur = null;   // {notes, total, opts, my, t0, i, paused, at}

  function pump() {
    const c = ctx;
    if (!cur || cur.my !== gen || cur.paused || !c) return;
    const now = c.currentTime;
    const notes = cur.notes, t0 = cur.t0, onNote = cur.opts.onNote;

    // Jadwalkan hanya nada yang jatuh dalam jendela pendek di depan.
    while (cur.i < notes.length && t0 + notes[cur.i].at < now + LOOKAHEAD) {
      const n = notes[cur.i], idx = cur.i, my = cur.my;
      tone(n.freq, t0 + n.at, n.dur, n.gate);
      if (onNote) {
        later(() => { if (cur && cur.my === my && !cur.paused) onNote(n, idx); },
              Math.max(0, (t0 + n.at - now) * 1000));
      }
      cur.i++;
    }

    if (cur.i >= notes.length && now >= t0 + cur.total) return finish(cur.my);
    later(pump, TICK);
  }

  function startSchedule(notes, total, opts) {
    const c = ensureCtx();
    if (!c || muted) return Promise.resolve();

    /* Memulai pemutaran baru saat yang lama MASIH BERJALAN berarti
       menggantikannya, bukan menumpuk di atasnya. Inilah yang dulu
       menghasilkan "dua lagu sekaligus" saat Mainkan ditekan dua kali.

       Sama pentingnya: `stop()` menyelesaikan Promise pemutaran lama. Tanpa
       itu, `await audio.play(...)` di pemanggil yang lama akan menggantung
       selamanya — pemompanya berhenti, tapi tidak ada yang memberi tahu
       siapa pun bahwa ia berhenti.

       Syarat `pending.length` penting. Pemutaran yang sudah selesai wajar
       tidak boleh diganggu: HANGMAN memainkan lagu kemenangannya sebagai
       beberapa `await audio.play()` berurutan, dan tanpa syarat ini ekor
       nada terakhir tiap baris akan dipotong oleh baris berikutnya. */
    if (pending.length) api.stop();

    const my = ++gen;
    cur = { notes, total, opts: opts || {}, my,
            t0: c.currentTime + LEAD, i: 0, paused: false, at: 0 };

    return new Promise(resolve => {
      pending.push({ gen: my, resolve });
      pump();
    });
  }

  const api = {
    unlock,

    get available() { return !!(global.AudioContext || global.webkitAudioContext); },

    setVolume(v) {
      volume = clamp(Number(v) || 0, 0, 1);
      if (master) master.gain.value = muted ? 0 : volume;
      return volume;
    },
    get volume() { return volume; },

    setMuted(m) {
      muted = !!m;
      if (master) master.gain.value = muted ? 0 : volume;
      return muted;
    },
    get muted() { return muted; },

    /* --- instrumen --- */
    get instruments() {
      return Object.keys(INSTRUMENTS).map(
        id => ({ id, label: INSTRUMENTS[id].label }));
    },
    get instrument() { return instrument; },
    setInstrument(id) {
      if (INSTRUMENTS[id]) instrument = id;
      return instrument;
    },

    /**
     * Mainkan string makro PLAY. Beberapa panggilan berurutan mewarisi
     * oktaf/tempo/panjang dari yang sebelumnya — persis seperti GW-BASIC,
     * di mana `PLAY "o2 t200 l8"` di satu baris berlaku untuk baris berikutnya.
     * @returns {Promise<void>} selesai saat nada terakhir berhenti
     */
    /**
     * @param {string} macro string makro PLAY
     * @param {object} [opts]
     *   fresh   — jangan warisi oktaf/tempo dari PLAY sebelumnya
     *   vars    — kamus untuk perintah X, mis. { 'A$': 'O3L8E…' }
     *   onNote  — dipanggil tiap nada berbunyi, untuk menggerakkan tampilan
     */
    play(macro, opts) {
      opts = opts || {};
      const { notes, total, state } =
        parsePlay(macro, opts.fresh ? null : chain, opts.vars);
      chain = state;
      return startSchedule(notes, total, opts);
    },

    /**
     * Mainkan daftar nada langsung, tanpa lewat makro PLAY.
     *
     * Dipakai berkas MIDI dan halaman yang jadwalnya dihitung sendiri
     * (OCTAVE, NOTETABL). Berbeda dari `play()` dalam satu hal penting:
     * daftarnya boleh **polifonik** — beberapa nada boleh tumpang tindih.
     * Makro PLAY tidak bisa menyatakan itu; Web Audio bisa.
     *
     * @param {Array<{midi?:number, freq?:number, at:number, dur:number}>} list
     *        Kolom lain apa pun ikut diteruskan apa adanya ke `onNote` —
     *        di situlah halaman menitipkan "nada ini milik baris kode mana".
     */
    playNotes(list, opts) {
      const notes = (list || []).map(n => {
        const o = Object.assign({}, n);
        if (o.freq === undefined) o.freq = midiToHz(o.midi);
        return o;
      }).sort((a, b) => a.at - b.at);
      const total = notes.reduce((m, n) => Math.max(m, n.at + (n.dur || 0)), 0);
      return startSchedule(notes, total, opts || {});
    },

    /**
     * Jeda di tempat. Bunyi berhenti, tapi posisinya diingat.
     *
     * Bedanya dengan `stop()` bukan soal seberapa keras berhentinya, melainkan
     * soal apa yang dibuang: `stop()` membuang jadwalnya, `pause()` menyimpan.
     */
    pause() {
      if (!cur || cur.paused || !ctx) return this;
      cur.paused = true;
      cur.at = Math.max(0, ctx.currentTime - cur.t0);   // posisi dalam lagu
      timers.forEach(clearTimeout);
      timers.clear();
      killAll();
      return this;
    },

    /** Lanjutkan dari posisi saat dijeda. */
    resume() {
      if (!cur || !cur.paused || !ctx) return this;
      cur.paused = false;
      cur.t0 = ctx.currentTime + LEAD - cur.at;
      /* Indeks dihitung ULANG, tidak dilanjutkan dari yang tersimpan.
         Saat dijeda, sebagian nada sudah "dijadwalkan" ke dalam jendela 120 ms
         lalu dibunuh `killAll()`. Kalau indeksnya diteruskan begitu saja,
         nada-nada itu hilang tanpa jejak. Mencari ulang dari posisi jeda
         membuat pertanyaannya sederhana: mana nada pertama yang belum lewat? */
      cur.i = cur.notes.findIndex(n => n.at >= cur.at);
      if (cur.i < 0) cur.i = cur.notes.length;
      pump();
      return this;
    },

    get paused() { return !!(cur && cur.paused); },
    get playing() { return !!(cur && !cur.paused); },

    /** Posisi pemutaran sekarang, dalam detik sejak awal lagu. */
    get position() {
      if (!cur || !ctx) return 0;
      return cur.paused ? cur.at : Math.max(0, ctx.currentTime - cur.t0);
    },

    /**
     * Hentikan SEMUA bunyi sekarang juga: nada yang sedang berbunyi diredam,
     * nada yang belum dijadwalkan dibatalkan, penanda visual yang tertunda
     * dibuang, dan `play()` yang sedang berjalan diselesaikan.
     */
    stop() {
      gen++;
      cur = null;
      timers.forEach(clearTimeout);
      timers.clear();
      killAll();
      const waiting = pending;
      pending = [];
      waiting.forEach(p => p.resolve());
      return this;
    },

    /** Lupakan oktaf/tempo yang diwarisi — mulai dari bawaan lagi. */
    resetPlayState() { chain = null; },

    /**
     * Padanan `SOUND frekuensi, durasi`.
     * Durasi dalam satuan 1/18,2 detik, persis seperti pencacah IBM PC —
     * jadi `SOUND 440, 18.2` berbunyi satu detik, sama seperti aslinya.
     */
    sound(freq, ticks) {
      const c = ensureCtx();
      if (!c || muted) return Promise.resolve();
      const dur = (Number(ticks) || 1) / 18.2;
      if (freq >= 37 && freq <= 32767) tone(freq, c.currentTime + 0.01, dur, 1);
      return new Promise(r => setTimeout(r, dur * 1000));
    },

    /** Padanan `BEEP` — di IBM PC selalu 800 Hz selama seperempat detik. */
    beep() { return api.sound(800, 4.55); },

    /** Lihat hasil penafsiran tanpa membunyikan — dipakai untuk visualisasi. */
    debugParse(macro, vars) { return parsePlay(macro, null, vars); },

    /**
     * Bunyikan nada dan tahan sampai `release()` dipanggil.
     * @returns {{freq:number, release:function}|null} null kalau suara mati
     */
    noteOn(midi) { return startVoice(midiToHz(midi)); },

    /** Bunyikan satu nada langsung dengan panjang tetap. */
    note(midi, dur) {
      const c = ensureCtx();
      if (!c || muted) return;
      tone(midiToHz(midi), c.currentTime + 0.005, dur || 0.6, 1);
    },

    /** MIDI dari nama, mis. "C4" -> 60. Kebalikan dari noteName(). */
    midiOf(name) {
      const m = /^([A-G])(#|b)?(-?\d+)$/.exec(String(name).trim());
      if (!m) return 60;
      const BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
      let semi = BASE[m[1]];
      if (m[2] === '#') semi += 1;
      if (m[2] === 'b') semi -= 1;
      return 12 * (parseInt(m[3], 10) + 1) + semi;
    },

    /** MIDI/Hz -> nama not, mis. 440 -> "A4". Untuk menyorot tuts piano. */
    noteName(freq) {
      const midi = Math.round(69 + 12 * Math.log2(freq / 440));
      const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F',
                     'F#', 'G', 'G#', 'A', 'A#', 'B'];
      return { midi, name: NAMES[((midi % 12) + 12) % 12],
               octave: Math.floor(midi / 12) - 1 };
    }
  };

  global.RETRO = global.RETRO || {};
  global.RETRO.audio = api;
})(window);
