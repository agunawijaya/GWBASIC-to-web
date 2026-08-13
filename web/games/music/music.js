/* ===========================================================================
   music.js — port dari MUSIC.BAS (IBM Corp, 1981-82).

   Program IBM resmi untuk MEMBUAT dan memainkan lagu. Strukturnya sama dengan
   MORTGAGE.BAS dan SPACE.BAS: mulai di baris 940, dua pintu masuk (980 dan
   1000) untuk mode biasa versus mode contoh.

   ------------------------------------------------------------------------
   TANGGA NADA SAMA RATA, DALAM SATU BARIS

       1360 DIM M(88),O(70)
       1370 FOR I=7 TO 88:M(I) = 36.8*(2^(1/12))^(I-6):NEXT
       1380 FOR I=0 TO 6:M(I) = 32767:NEXT

   Baris 1370 adalah seluruh sistem penalaan Barat sejak abad ke-18. Akar
   kedua belas dari dua — satu semiton — dipangkatkan sebanyak jarak tuts dari
   acuan. Tidak ada tabel frekuensi, tidak ada DATA berisi 88 angka: satu
   rumus, dan seluruh piano lahir darinya.

   `36.8` adalah frekuensi tuts ke-7. Naik dua belas tuts mengalikannya dengan
   2 — satu oktaf — karena (2^(1/12))^12 = 2. Itu definisi tangga nada sama
   rata, ditulis sebagai kode.

   ------------------------------------------------------------------------
   DELAPAN PULUH DELAPAN

   `DIM M(88)` bukan angka bulat sembarangan: itu JUMLAH TUTS PIANO. Ukuran
   larik yang mencerminkan domainnya adalah bentuk dokumentasi — siapa pun
   yang melihat 88 di program musik langsung tahu apa yang dimodelkan, tanpa
   perlu satu komentar pun.

   Pola yang sama muncul di DOMINOES (`DIM PLD$(28)` — 28 batu ganda-enam) dan
   YAHTZEE (`DIM M(13)` — 13 kotak skor).

   ------------------------------------------------------------------------
   TUTS 0 SAMPAI 6 ADALAH DIAM

       1380 FOR I=0 TO 6:M(I) = 32767:NEXT
       1590 SOUND M(J),K

   Di GW-BASIC, `SOUND 32767, durasi` adalah cara resmi menghasilkan DIAM —
   bukan bunyi yang terlalu tinggi untuk didengar, melainkan istirahat yang
   didokumentasikan. Jadi tujuh tuts terbawah dipakai ulang sebagai istirahat,
   dan lagu-lagunya menuliskan istirahat sebagai tuts 0.

   Itu penghematan yang rapi: tidak butuh penanda khusus di data lagu, tidak
   butuh cabang di perulangan pemutar. Sebuah istirahat adalah nada, hanya
   saja nada yang tidak terdengar.

   Di sini tuts 0-6 dipetakan ke jeda sungguhan, karena Web Audio tidak punya
   frekuensi yang kebetulan berarti diam.

   ------------------------------------------------------------------------
   ON ERROR UNTUK MAKRO PLAY YANG DIKETIK PEMAKAI

       1141 ON ERROR GOTO 1148
       1142 PLAY "mf"
       1149 ON ERROR GOTO 0

   `PLAY` melempar galat kalau diberi makro yang tidak sah, dan makro itu
   diketik pemakai. Menangkapnya dan meminta mengetik ulang jauh lebih baik
   daripada membiarkan program mati — dan itu keputusan yang sama dengan
   PIECHART baris 1292, di program yang sama-sama IBM.

   ------------------------------------------------------------------------
   TIGA PERBAIKAN SESUDAH TINJAUAN (sesi 14b)

   Halaman ini dibangun di sesi 13 bersama MORTGAGE dan SPACE — tiga program
   IBM — dan itulah kesalahannya. Ia diperlakukan sebagai "program IBM ketiga"
   padahal tempatnya di KELOMPOK MUSIK, yang bentuknya sudah ditetapkan sesi 4
   oleh GERMFOLK, OCTAVE, DREAM dan NOTETABL. Akibatnya tiga hal:

   1. TIDAK ADA NOT BALOK. Kelima halaman musik lain memakai
      `_shared/staff.js`; halaman ini cuma punya papan tuts. Bukan kendala
      teknis — datanya (nomor tuts + durasi) justru bentuk paling mudah untuk
      digambar sebagai not. Sekarang dipakai, dengan pengaturan yang sama
      seperti DREAM: `pps: 90, playheadAt: 0.28`.

   2. PEMILIH INSTRUMEN TIDAK BERFUNGSI SAMA SEKALI. Versi lama memakai
      `<select>` sendiri lalu meneruskannya sebagai `playNotes(nada,
      { instrument: ... })` — dan audio.js TIDAK PERNAH membaca `opts
      .instrument`. Instrumennya keadaan modul, disetel lewat
      `audio.setInstrument()`. Jadi memilih "organ" tidak mengubah apa pun,
      dan tidak ada yang memberi tahu. Sekarang memakai `ui.instrumentBar()`
      yang memang untuk itu — dan alasan kenapa tombol mengalahkan `<select>`
      sudah ditulis di ui.js sejak sesi 4b; halaman ini melanggarnya tanpa
      menyadari.

   3. PEWAKTU TERPISAH UNTUK TAMPILAN. Versi lama menjadwalkan penyalaan tuts
      dengan satu `setTimeout` per nada, terpisah dari jadwal bunyinya.
      Sekarang bunyi dan gambar lahir dari sumber yang sama: `onNote` untuk
      papan tuts, dan satu jam `RETRO.clock` untuk menggulung not baloknya.

   Pelajarannya bukan tentang tiga cacat itu, melainkan tentang sebabnya:
   sebuah halaman dikelompokkan menurut ASAL programnya (IBM) dan bukan
   menurut BENTUKNYA (musik), lalu mewarisi kebiasaan kelompok yang salah.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, piano, staff, clock } = window.RETRO;
  const LAGU = window.RETRO.MUSIC_SONGS || [];
  const $ = (id) => document.getElementById(id);
  const db = store('music');

  /* Baris 1370-1380, apa adanya. Tuts 0-6 dikembalikan sebagai null, bukan
     32767 — di sini "diam" adalah ketiadaan nada, bukan sebuah frekuensi. */
  function freqTuts(i) {
    if (i <= 6) return null;                         // baris 1380
    return 36.8 * Math.pow(Math.pow(2, 1 / 12), i - 6);
  }

  /* Frekuensi -> nomor MIDI, supaya papan tuts dan not balok bersama bisa
     memakainya. Bukan pembulatan sembarang: tangga nada sama rata membuat
     pemetaan ini tepat, dan penyimpangannya di bawah seperseratus semiton. */
  const midiDari = (f) => Math.round(69 + 12 * Math.log2(f / 440));

  let lagu = 0, tempo = 1, papan = null, sheet = null;
  let jadwal = [], durasi = 0;
  let state = 'idle', raf = 0, token = 0, shownSec = -1;
  const beat = clock();

  /* Durasi di data aslinya adalah cacah "tik" yang dipakai SOUND. Satu tik
     kira-kira 1/18,2 detik — kecepatan pencacah waktu PC. Angka itulah yang
     mengubah data 1982 jadi durasi sungguhan. */
  const TIK = 1 / 18.2;

  function nadaLagu(s) {
    const out = [];
    let t = 0;
    s.nada.forEach(([tuts, dur]) => {
      const d = Math.max(dur, 1) * TIK / tempo;
      const f = freqTuts(tuts);
      if (f) out.push({ freq: f, at: t, dur: d * 0.92 });
      t += d;
    });
    return { nada: out, total: t };
  }

  const fmt = (d) => Math.floor(d / 60) + ':' + String(Math.floor(d % 60)).padStart(2, '0');

  /* --- rol lagu bergaya jukebox -------------------------------------------
     Sengaja TIDAK dijadikan modul bersama. Aturannya sama dengan cards.js dan
     dice.js: sebuah modul dibuat kalau sudah terbukti dipakai dua kali, bukan
     sebelumnya. Sampai ada halaman kedua yang butuh rol seperti ini, ia
     tinggal di sini. */
  const kartu = [];

  function bangunRol() {
    const rol = $('rol');
    rol.textContent = '';
    kartu.length = 0;
    LAGU.forEach((s, i) => {
      const b = ui.el('button', { class: 'u-kartu', type: 'button' });
      b.append(
        ui.el('span', { class: 'u-kartu__no',
                        text: String(i + 1).padStart(2, '0') + ' / ' + LAGU.length }),
        ui.el('span', { class: 'u-kartu__ju', text: s.judul.trim() })
      );
      b.addEventListener('click', () => pilih(i, i === lagu));
      rol.append(b);
      kartu.push(b);
    });
  }

  /* Pergeseran dihitung dari posisi elemen yang SEBENARNYA, bukan dari lebar
     kartu dikali indeks. Bedanya baru terasa kalau judulnya panjang, fonnya
     berubah, atau tata letaknya membungkus — tiga hal yang tidak bisa
     diketahui dari CSS saja. */
  function geser() {
    const rol = $('rol'), vitrin = rol.parentElement, k = kartu[lagu];
    if (!k) return;
    const dx = vitrin.clientWidth / 2 - (k.offsetLeft + k.offsetWidth / 2);
    rol.style.transform = 'translateX(' + Math.round(dx) + 'px)';
    kartu.forEach((b, i) => {
      b.classList.toggle('is-pilih', i === lagu);
      b.setAttribute('aria-current', i === lagu ? 'true' : 'false');
    });
    $('kiri').disabled = (lagu === 0);
    $('kanan').disabled = (lagu === LAGU.length - 1);
  }

  function pilih(i, langsungMain) {
    i = Math.max(0, Math.min(LAGU.length - 1, i));
    if (i !== lagu) { reset(); lagu = i; db.set('lagu', i); }
    geser();
    siapkan();
    if (langsungMain) putar();
  }

  /* --- menyiapkan lagu terpilih: not balok, cacah, jam --------------------- */
  function siapkan() {
    const s = LAGU[lagu];
    if (!s) return;
    const hasil = nadaLagu(s);
    jadwal = hasil.nada;
    durasi = hasil.total;
    sheet.setNotes(jadwal.map(n => ({
      midi: midiDari(n.freq), t: n.at, dur: n.dur
    })));
    sheet.setTime(0);
    $('count').textContent =
      s.nada.length + ' nada · ' + jadwal.length + ' berbunyi · ' +
      (s.nada.length - jadwal.length) + ' istirahat · ' + durasi.toFixed(1) + ' detik';
    $('clock').textContent = '0:00 / ' + fmt(durasi);
    shownSec = -1;
  }

  // --- pemutaran ---
  function tick() {
    const t = beat.now();
    sheet.setTime(t);
    const sec = Math.floor(Math.min(durasi, t));
    if (sec !== shownSec) {
      shownSec = sec;
      $('clock').textContent = fmt(sec) + ' / ' + fmt(durasi);
    }
    raf = requestAnimationFrame(tick);
  }

  function putar() {
    if (!jadwal.length) return;
    const my = ++token;
    audio.stop();
    if (papan) papan.clear();
    state = 'main';
    sync();
    beat.start();
    cancelAnimationFrame(raf);
    tick();

    audio.playNotes(jadwal, {
      onNote: (n) => {
        if (my !== token) return;
        papan.hitFreq(n.freq, Math.max(90, n.dur * 900));
        const nm = audio.noteName(n.freq);
        $('now').textContent = nm.name + nm.octave;
        $('now').classList.remove('m-now--idle');
      }
    }).then(() => { if (my === token && state === 'main') reset(); });
  }

  function jeda() {
    audio.pause(); beat.pause();
    cancelAnimationFrame(raf);
    if (papan) papan.clear();
    state = 'jeda'; sync();
  }

  function lanjut() {
    audio.resume(); beat.resume();
    state = 'main'; sync();
    cancelAnimationFrame(raf);
    tick();
  }

  function reset() {
    token++;
    audio.stop();
    cancelAnimationFrame(raf);
    beat.reset();
    if (sheet) sheet.setTime(0);
    if (papan) papan.clear();
    state = 'idle';
    shownSec = -1;
    $('now').textContent = '—';
    $('now').classList.add('m-now--idle');
    $('clock').textContent = '0:00 / ' + fmt(durasi);
    sync();
  }

  function sync() {
    $('play').textContent = state === 'main' ? 'Jeda' : state === 'jeda' ? 'Lanjut' : 'Play';
    $('reset').disabled = (state === 'idle');
  }

  function tekanPlay() {
    if (state === 'main') return jeda();
    if (state === 'jeda') return lanjut();
    putar();
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'IBM Music',
    source: 'MUSIC.BAS · IBM Corp · 1981-82',
    backHref: '../../index.html'
  }));

  /* Papan tuts dari _shared/piano.js — ditetapkan sesi 4 oleh empat halaman
     musik sebelumnya. Rentangnya dipilih dari data lagunya sendiri, bukan
     ditebak: tuts terendah dan tertinggi yang benar-benar dipakai kesebelas
     lagu. */
  let lo = 88, hi = 0;
  LAGU.forEach(s => s.nada.forEach(([t]) => {
    if (t > 6) { lo = Math.min(lo, t); hi = Math.max(hi, t); }
  }));
  const midiLo = midiDari(freqTuts(lo)), midiHi = midiDari(freqTuts(hi));
  const nama = (m) => ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][m % 12]
                      + (Math.floor(m / 12) - 1);
  papan = piano($('piano'), { from: nama(midiLo), to: nama(midiHi) });
  $('range').textContent = 'Tuts ' + lo + '–' + hi + ' (' + nama(midiLo) + '–' + nama(midiHi) + ')';

  /* Pengaturan yang sama dengan DREAM: penanda di 28% dari kiri, jadi 72%
     layar dipakai untuk not yang AKAN datang. Untuk lagu yang sudah ada, yang
     ingin dilihat pembaca adalah apa yang menyusul — bukan riwayatnya. */
  sheet = staff($('staff'), { pps: 90, playheadAt: 0.28 });

  $('instruments').replaceWith(ui.instrumentBar());

  $('play').addEventListener('click', tekanPlay);
  $('reset').addEventListener('click', reset);
  $('kiri').addEventListener('click', () => pilih(lagu - 1));
  $('kanan').addEventListener('click', () => pilih(lagu + 1));

  /* Panah kiri/kanan memutar rol — kecuali saat fokus sedang di penggeser
     tempo, karena di sana panah milik penggesernya. */
  window.addEventListener('keydown', (e) => {
    const t = e.target.tagName;
    if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); pilih(lagu - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); pilih(lagu + 1); }
  });

  $('tempo').addEventListener('input', e => {
    tempo = Number(e.target.value) / 100;
    $('tempov').textContent = e.target.value + '%';
    db.set('tempo', e.target.value);
    /* Tempo mengubah SELURUH jadwal, jadi lagu yang sedang berjalan harus
       dihentikan — bukan disesuaikan di tengah jalan. Menyesuaikannya berarti
       menjahit dua jadwal berbeda pada satu titik, dan tidak ada gunanya. */
    reset();
    siapkan();
  });

  /* Rol dipusatkan ulang saat lebar layar berubah: posisinya dihitung dari
     lebar jendela vitrin, dan lebar itu ikut berubah. */
  window.addEventListener('resize', geser);

  /* Tabel frekuensi hidup: rumus baris 1370 diperlihatkan hasilnya, bukan
     cuma dikutip. */
  function tabelFrek() {
    const tb = $('freqBody');
    tb.textContent = '';
    [7, 19, 31, 43, 49, 55, 67, 88].forEach(i => {
      const f = freqTuts(i);
      const tr = ui.el('tr');
      tr.append(ui.el('td', { text: String(i) }),
                ui.el('td', { text: f.toFixed(2) + ' Hz' }),
                ui.el('td', { text: nama(midiDari(f)) }));
      tb.append(tr);
    });
    const r7 = freqTuts(7), r19 = freqTuts(19);
    $('oktaf').innerHTML = 'Tuts 7 = <b>' + r7.toFixed(2) + ' Hz</b>, tuts 19 = <b>' +
      r19.toFixed(2) + ' Hz</b> — <b>' + (r19 / r7).toFixed(6) +
      '&times;</b>. Dua belas semiton, tepat satu oktaf.';

    /* Acuan `36.8` di baris 1370 TIDAK diturunkan dari A440.

       Hitung sendiri: tuts 49 keluar 441,10 Hz, bukan 440. Untuk tepat A440,
       acuannya harus 36,708. IBM memakai 36,8 — dan seluruh pianonya jadi
       sekitar 4 sen lebih tinggi daripada tala standar.

       Empat sen tidak terdengar sendirian, dan program ini tidak pernah
       dimainkan bersama alat musik lain, jadi tidak ada yang pernah
       mengeluh. Tapi angkanya bisa diperiksa, jadi diperiksa. */
    const a4 = freqTuts(49);
    const acuanTepat = 440 / Math.pow(2, 43 / 12);
    const sen = 1200 * Math.log2(a4 / 440);
    $('a440').innerHTML =
      'Tuts 49 seharusnya <b>A4 = 440 Hz</b>. Rumus baris 1370 memberi <b>' +
      a4.toFixed(2) + ' Hz</b> — <b>' + (sen >= 0 ? '+' : '') + sen.toFixed(1) +
      ' sen</b> lebih tinggi. Untuk tepat 440, acuannya harus <b>' +
      acuanTepat.toFixed(3) + '</b>, bukan 36,8.';
  }

  lagu = Number(db.get('lagu', 0));
  if (!(lagu >= 0 && lagu < LAGU.length)) lagu = 0;
  $('tempo').value = db.get('tempo', 100);
  $('tempov').textContent = $('tempo').value + '%';
  tempo = Number($('tempo').value) / 100;

  bangunRol();
  siapkan();
  sync();
  tabelFrek();

  /* Dipanggil LANGSUNG, bukan lewat requestAnimationFrame.

     Versi pertama menundanya satu bingkai supaya `clientWidth` sudah terisi.
     Itu memang jalan — di tab yang terlihat. Di tab latar belakang peramban
     TIDAK MENJALANKAN rAF sama sekali, jadi rolnya tidak pernah dipusatkan
     dan tetap menempel di kiri sampai jendelanya diubah ukurannya.

     Penundaan itu juga tidak dibutuhkan: kartunya berlebar tetap (`flex:
     0 0 178px`), dan membaca `clientWidth` di sini memaksa tata letak
     dihitung, yang justru memberi angka yang benar. Menunda sesuatu "supaya
     aman" berarti menggantungkannya pada penjadwal yang belum tentu jalan. */
  geser();
})();
