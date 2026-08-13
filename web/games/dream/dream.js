/* ===========================================================================
   dream.js — port dari DREAM.BAS (1984, 18 baris).

   Program tanpa satu pun GOTO, GOSUB, atau percabangan. Isinya murni data:
   lima belas frasa musik disimpan di variabel A$..O$, lalu disusun jadi lagu
   oleh tiga baris PLAY yang memakai perintah `X`.

       160 PLAY "XA$;XB$;XC$;XD$;XA$;XB$;XC$;"

   `XA$;` berarti "jalankan isi variabel A$" — pemanggilan subrutin di dalam
   bahasa makro. Karena itu bait A B C bisa muncul dua kali tanpa ditulis dua
   kali, dan lagu tiga menit muat dalam 18 baris.

   Struktur bait–refrein sebuah lagu tercermin langsung di struktur programnya.
   Prinsipnya sama dengan kompresi berbasis kamus, dan dengan cara kerja
   komponen di antarmuka sekarang: definisikan sekali, rujuk berkali-kali.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, piano, staff, clock } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Lima belas frasa, disalin PERSIS dari baris 10–150. */
  const PHRASE = {
    'A$': 'O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G',
    'B$': 'MLL4A.MNL8AFGAGFMLL2A.MNL8AP8A',
    'C$': 'MLL4B.MNL8BEFGABO4CO3MLL4FF.MNFL8G',
    'D$': 'MLL4A.MNL8ADEFGAMLL2B.MNL4B',
    'E$': 'MLL4A.MNL8AFGABO4CL2D.L8CDCL4MLE.MNEL8CCDC',
    'F$': 'MLL4E.MNEL8CCDCEO3MLL4BMNBL8O4CDCO3B',
    'G$': 'MLL4O4D.MNDL8O3AO4CO3BAO4L4MLC.MNL8CO3ABO4CO3BA',
    'H$': 'MLO4L4C.MNL8CCDEDCEDCECDEFE',
    'I$': 'MLL2D.MNL8DDEMLL4F.MNL8FEDFED',
    'J$': 'MLL4F.MNL8FEFEDCO3MLL2B.MNL8BBO4C',
    'K$': 'MLL4D.MNL8DCO3BO4DCO3BO4MLL4D.MNL8DCDCO3BA',
    'L$': 'MLL2A-.MNL8A-EFMLL4G.MNL8GEFGFE',
    'M$': 'MLL2G.MNL8GFGMLL4A.MNL8AFGAGF',
    'N$': 'MLL2A.MNL8AGAMLL4B.MNL8BEFGABO4CO3MLL4FF.MNFO4L8C',
    'O$': 'MLL4E.MNL8EP8CDEDCO5MLL2C.L4C.C'
  };

  /* Tiga baris penyusun, baris 160–180. */
  const COMPOSE = [
    { no: 160, macro: 'XA$;XB$;XC$;XD$;XA$;XB$;XC$;' },
    { no: 170, macro: 'XE$;XF$;XG$;XH$;XI$;XJ$;XK$;' },
    { no: 180, macro: 'XL$;XM$;XN$;XO$;' }
  ];

  /** Urutan frasa yang sebenarnya dimainkan, dibaca dari string X di atas. */
  const SEQUENCE = COMPOSE.flatMap(c =>
    (c.macro.match(/X([A-Z]\$);/g) || []).map(t => t.slice(1, -1)));

  /** Bagian ke-i berasal dari baris penyusun yang mana. Dihitung sekali. */
  const LINE_OF = COMPOSE.flatMap((c, k) =>
    (c.macro.match(/X([A-Z]\$);/g) || []).map(() => k));

  const kb = piano($('piano'), {
    from: 'C3', to: 'C6',
    onKey: m => { audio.note(m, 0.5); kb.hit(m, 400); }
  });

  /* --- not balok ---
     Seluruh lagu — 18 bagian, sekitar tiga menit — digambar sekali di muka.
     Perhatikan `vars: PHRASE`: penafsir menjalankan perintah X yang sama
     seperti saat membunyikan, jadi gambar dan bunyi lahir dari satu sumber.
     Kalau keduanya ditulis terpisah, cepat atau lambat pasti melenceng. */
  const sheet = staff($('staff'), { pps: 100, playheadAt: 0.28 });

  /* --------------------------------------------------------------------
     Jadwal: kapan tiap frasa dimulai.

     Dihitung dengan menafsirkan gabungan frasa 0..i dan mengambil durasinya.
     Harus digabung, bukan dijumlahkan satu-satu, karena tiap frasa MEWARISI
     oktaf/tempo/panjang dari frasa sebelumnya — persis seperti di GW-BASIC.
     -------------------------------------------------------------------- */
  function schedule() {
    const at = [];
    let joined = '';
    for (const name of SEQUENCE) {
      at.push(audio.debugParse(joined).total);
      joined += PHRASE[name];
    }
    return { at, total: audio.debugParse(joined).total };
  }

  const PLAN = schedule();

  /* Seluruh lagu sebagai satu makro, dipakai untuk membunyikan DAN menggambar. */
  const WHOLE = COMPOSE.map(c => c.macro).join('');
  const ALL = audio.debugParse(WHOLE, PHRASE);
  sheet.setNotes(ALL.notes.map(n => ({
    midi: audio.noteName(n.freq).midi, t: n.at, dur: n.dur
  })));

  // --- kotak urutan ---
  const timeline = $('timeline');
  SEQUENCE.forEach((name, i) => {
    timeline.append(ui.el('span', {
      class: 'm-chip', id: 'slot' + i, text: name[0],
      title: 'Bagian ' + (i + 1) + ': ' + name
    }));
  });

  // --- baris penyusun ---
  COMPOSE.forEach((c, i) => {
    const row = ui.el('div', { class: 'm-line', id: 'cline' + i });
    row.append(ui.el('span', { class: 'm-line__no', text: c.no }),
               ui.el('span', { text: 'PLAY "' + c.macro + '"' }));
    $('score').append(row);
  });

  // --- daftar frasa ---
  Object.keys(PHRASE).forEach((name, i) => {
    const row = ui.el('div', { class: 'm-line', id: 'p' + name[0] });
    row.append(ui.el('span', { class: 'm-line__no', text: name }),
               ui.el('span', { text: '"' + PHRASE[name] + '"' }));
    $('phrases').append(row);
  });

  const fmt = (s) => Math.floor(s / 60) + ':' +
    String(Math.floor(s % 60)).padStart(2, '0');

  /* --------------------------------------------------------------------
     Transport: mainkan / jeda / lanjut / ulang.

     Sama persis dengan GERMFOLK, dan itu disengaja — pola yang sama untuk
     masalah yang sama. Bedanya cuma apa yang ikut dijeda: di sini ada
     penunjuk waktu dan delapan belas kotak frasa yang harus ikut membeku.

     Penanda frasa TIDAK lagi dijadwalkan dengan setTimeout sendiri. Ia
     dihitung dari `beat.now()` tiap frame, jadi menjeda jamnya otomatis
     menjeda penandanya. Satu jam, bukan dua yang harus disamakan.
     -------------------------------------------------------------------- */
  let token = 0;
  let raf = 0;
  let state = 'idle';
  let shownSec = -1, shownPart = -1;
  const beat = clock();

  function sync() {
    $('play').textContent = state === 'playing' ? 'Jeda'
                          : state === 'paused' ? 'Lanjut' : 'Mainkan';
    $('reset').disabled = state === 'idle';
    $('now').classList.toggle('m-now--idle', state === 'idle');
  }

  function clearMarks() {
    SEQUENCE.forEach((n, i) => $('slot' + i).classList.remove('is-on'));
    Object.keys(PHRASE).forEach(n => $('p' + n[0]).classList.remove('is-on'));
    COMPOSE.forEach((c, i) => $('cline' + i).classList.remove('is-on'));
  }

  /** Bagian keberapa yang sedang berbunyi pada detik `t`. */
  function partAt(t) {
    let k = -1;
    for (let i = 0; i < PLAN.at.length; i++) if (PLAN.at[i] <= t) k = i;
    return k;
  }

  function showPart(i) {
    if (i === shownPart) return;
    shownPart = i;
    if (i < 0) return clearMarks();
    const name = SEQUENCE[i];
    SEQUENCE.forEach((n, k) => $('slot' + k).classList.toggle('is-on', k === i));
    Object.keys(PHRASE).forEach(n =>
      $('p' + n[0]).classList.toggle('is-on', n === name));
    COMPOSE.forEach((c, k) =>
      $('cline' + k).classList.toggle('is-on', k === LINE_OF[i]));
  }

  function tick() {
    const t = beat.now();
    sheet.setTime(t);
    showPart(partAt(t));
    const sec = Math.floor(Math.min(PLAN.total, t));
    if (sec !== shownSec) {
      shownSec = sec;
      $('clock').textContent = fmt(sec) + ' / ' + fmt(PLAN.total);
    }
    raf = requestAnimationFrame(tick);
  }

  function onPlay() {
    if (state === 'playing') return pause();
    if (state === 'paused') return resume();
    start();
  }

  function start() {
    const my = ++token;
    audio.resetPlayState();
    state = 'playing';
    beat.start();
    sync();

    audio.play(WHOLE, {
      fresh: true,
      vars: PHRASE,
      onNote: n => {
        if (my !== token) return;
        kb.hitFreq(n.freq, Math.max(110, n.dur * 900));
        const nm = audio.noteName(n.freq);
        $('now').textContent = nm.name + nm.octave;
      }
    }).then(() => { if (my === token && state === 'playing') reset(); });

    cancelAnimationFrame(raf);
    tick();
  }

  function pause() {
    audio.pause(); beat.pause(); kb.clear();
    state = 'paused'; sync();
  }

  function resume() {
    audio.resume(); beat.resume();
    state = 'playing'; sync();
  }

  function reset() {
    token++;
    audio.stop();
    cancelAnimationFrame(raf);
    beat.reset();
    sheet.setTime(0);
    clearMarks();
    kb.clear();
    state = 'idle';
    shownPart = -1; shownSec = -1;
    $('now').textContent = '—';
    $('clock').textContent = '0:00 / ' + fmt(PLAN.total);
    sync();
  }

  $('topbar-host').append(ui.topbar({
    title: 'Dream',
    source: 'DREAM.BAS · 1984',
    backHref: '../../index.html'
  }));

  $('instruments').replaceWith(ui.instrumentBar());

  $('play').addEventListener('click', onPlay);
  $('reset').addEventListener('click', reset);
  $('clock').textContent = '0:00 / ' + fmt(PLAN.total);
  sync();

})();
