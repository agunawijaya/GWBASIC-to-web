/* ===========================================================================
   backgam.js — port dari BACKGAM.BAS (1986).

   Backgammon dua pemain lengkap dalam 161 baris. Bukan versi sederhana:
   masuk dari bar, memukul blot, mengeluarkan bidak, dobel yang memberi empat
   langkah, dan penolakan giliran saat tidak ada langkah sah — semuanya ada.

   ------------------------------------------------------------------------
   SATU LARIK UNTUK SELURUH PAPAN

       2450 DIM A(25)
       2482 A(24)=2:A(19)=-5:A(17)=-3:A(13)=5:A(12)=-5:A(8)=3:A(6)=5:A(1)=-2

   Dua puluh empat titik, ditambah dua slot di ujung, dan TANDA yang menyimpan
   pemiliknya:

       A(n) > 0   n bidak pemain 1
       A(n) < 0   |n| bidak pemain 2
       A(n) = 0   kosong

   Satu angka menyimpan DUA hal sekaligus — siapa pemiliknya dan berapa
   banyak. Ini penyandian yang masih dipakai mesin catur dan backgammon
   sampai sekarang, dan akibatnya besar: membalik papan untuk giliran lawan
   cukup mengalikan −1, dan menghitung pip tidak butuh satu pun `IF`.

   Slot 0 dan 25 adalah pengecualiannya, dan sengaja: keduanya menyimpan
   JUMLAH bidak di bar sebagai bilangan positif, bukan bertanda —
   A(25) bar pemain 1, A(0) bar pemain 2. Menaruhnya di ujung larik
   menghapus kasus khusus: pemain 1 masuk di `25 − dadu`, pemain 2 di `0 +
   dadu`, dan rumus yang sama melayani keduanya.

   ------------------------------------------------------------------------
   NOMOR BARISNYA MULAI DARI 2430

   Bukan 10. Entah program ini dulunya bagian dari sesuatu yang lebih besar,
   entah 2400 baris di depannya disisakan untuk sesuatu yang tak pernah
   ditulis. Rutin bantunya ada di 59950 dan 59990 — jauh di belakang, tanpa
   satu pun daftar isi yang menyebutkannya.

   ------------------------------------------------------------------------
   PARAMETER LEWAT VARIABEL GLOBAL

       TIMEOUT=3:GOSUB 59950

   `GOSUB` tidak menerima parameter, jadi nilainya dititipkan lewat variabel
   global. Pola ini muncul di seluruh koleksi; yang membuat versi ini termasuk
   yang paling baik adalah namanya — `TIMEOUT`, bukan `T`.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, dice } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const db = store('backgam');
  let A, giliran, dadu, sisaLangkah, pilihDari, fase, pesanTerakhir;

  /* Baris 2482 apa adanya. Lima belas bidak tiap pihak — bisa dijumlahkan
     sendiri: 2+5+3+5 = 15, dan 5+3+5+2 = 15. */
  const AWAL = { 24: 2, 19: -5, 17: -3, 13: 5, 12: -5, 8: 3, 6: 5, 1: -2 };

  /* Pemain 1 bergerak 24 -> 1 dan mengeluarkan bidak lewat 0; pemain 2
     sebaliknya. Seluruh perbedaan arah dinyatakan DI SINI, sekali, supaya
     sisa kodenya tidak perlu tahu siapa yang sedang bermain. */
  const SISI = {
    1: { tanda: 1,  bar: 25, arah: -1, rumah: (p) => p >= 1 && p <= 6,
         masuk: (d) => 25 - d, keluarLewat: 0 },
    2: { tanda: -1, bar: 0,  arah: 1,  rumah: (p) => p >= 19 && p <= 24,
         masuk: (d) => d,      keluarLewat: 25 }
  };
  const S = () => SISI[giliran];

  const milik = (p) => (A[p] === 0 ? 0 : A[p] > 0 ? 1 : 2);
  const banyak = (p) => Math.abs(A[p]);
  const diBar = () => A[S().bar];

  function papanBaru() {
    A = new Array(26).fill(0);
    for (const p in AWAL) A[p] = AWAL[p];
    A[0] = 0; A[25] = 0;                       // bar kedua pihak kosong
    /* Baris 2500: siapa yang mulai ditentukan lemparan koin, bukan aturan. */
    giliran = rng().int(2) + 1;
    dadu = []; sisaLangkah = []; pilihDari = null;
    fase = 'lempar'; pesanTerakhir = '';
    gambar();
    kata(nama(giliran) + ' starts. Roll the dice.');
  }

  const nama = (w) => (w === 1 ? 'PLAYER 1' : 'PLAYER 2');

  /* --------------------------------------------------------------------
     Melempar — baris 2560.

         2560 L=INT(RND*6+1):M=INT(RND*6+1):D=2:IF L=M THEN D=4

     Dobel memberi EMPAT langkah, bukan dua. Itu aturan backgammon sungguhan,
     dan program ini menyandikannya dalam satu `IF`.
     -------------------------------------------------------------------- */
  async function lempar() {
    if (fase !== 'lempar') return;
    fase = 'menggulir';
    gambar();
    const r = rng();
    for (let i = 0; i < 5; i++) {
      dadu = dice.roll(r, 2);
      gambarDadu(true);
      await new Promise(res => setTimeout(res, 90));
    }
    sisaLangkah = dadu[0] === dadu[1]
      ? [dadu[0], dadu[0], dadu[0], dadu[0]]     // baris 2560: D=4
      : [dadu[0], dadu[1]];
    fase = 'main';
    pilihDari = null;
    gambar();
    if (!adaLangkah()) return takBisaJalan();
    kata(nama(giliran) + ', your roll is ' + dadu.join(' and ') + '.');
  }

  /* --------------------------------------------------------------------
     Apakah sebuah langkah sah?

     Baris 2790-2940 untuk pemain 1, 3110-3290 untuk pemain 2 — bentuknya
     cermin, dan di sini ditulis sekali dengan `S()` yang menyimpan arahnya.
     -------------------------------------------------------------------- */
  function bolehTujuan(t) {
    if (t < 1 || t > 24) return false;
    /* Baris 2910: `IF A(T)<-1` — dua bidak lawan atau lebih memblokir.
       Tepat satu bidak lawan BUKAN penghalang; itu blot, dan memukulnya
       justru langkah yang sah. */
    return milik(t) !== (3 - giliran) || banyak(t) < 2;
  }

  /** Semua langkah sah dari satu titik, dipasangkan dengan dadu yang dipakai. */
  function langkahDari(f) {
    const out = [];
    const sd = [...new Set(sisaLangkah)];
    /* Baris 2850: kalau ada bidak di bar, TIDAK ADA langkah lain yang sah.
       Masuk dulu, baru yang lain. */
    if (diBar() && f !== S().bar) return out;

    sd.forEach(d => {
      if (f === S().bar) {
        const t = S().masuk(d);
        if (bolehTujuan(t)) out.push({ f: f, t: t, d: d, keluar: false });
        return;
      }
      if (milik(f) !== giliran) return;
      const t = f + S().arah * d;
      if (t >= 1 && t <= 24) {
        if (bolehTujuan(t)) out.push({ f: f, t: t, d: d, keluar: false });
        return;
      }
      /* Mengeluarkan bidak — baris 3020-3050. Syaratnya dua:
         seluruh bidak sudah di rumah, DAN dadunya tepat, ATAU dadunya lebih
         besar daripada titik terjauh yang masih terisi (aturan "kelebihan"). */
      if (!semuaDiRumah()) return;
      const jarak = giliran === 1 ? f : 25 - f;
      if (d === jarak) { out.push({ f: f, t: S().keluarLewat, d: d, keluar: true }); return; }
      if (d > jarak && f === terjauh()) {
        out.push({ f: f, t: S().keluarLewat, d: d, keluar: true });
      }
    });
    return out;
  }

  const semuaDiRumah = () => {
    if (diBar()) return false;
    for (let p = 1; p <= 24; p++) {
      if (milik(p) === giliran && !S().rumah(p)) return false;
    }
    return true;
  };

  /** Titik terjauh dari rumah yang masih terisi — padanan `J` di baris 2800. */
  function terjauh() {
    if (giliran === 1) { for (let p = 24; p >= 1; p--) if (milik(p) === 1) return p; }
    else { for (let p = 1; p <= 24; p++) if (milik(p) === 2) return p; }
    return 0;
  }

  function adaLangkah() {
    if (diBar()) return langkahDari(S().bar).length > 0;
    for (let p = 1; p <= 24; p++) {
      if (milik(p) === giliran && langkahDari(p).length) return true;
    }
    return false;
  }

  /* --------------------------------------------------------------------
     Menjalankan langkah — baris 2950-2960.

         2950 A(F)=A(F)-1:IF A(T)=-1 THEN A(0)=A(0)+1:A(T)=0
         2960 A(T)=A(T)+1

     Tiga baris, dan memukul blot sudah termasuk di dalamnya.
     -------------------------------------------------------------------- */
  function jalankan(m) {
    const s = S();
    if (m.f === s.bar) A[s.bar]--;
    else A[m.f] -= s.tanda;

    if (m.keluar) {
      audio.sound(760, 0.07);
    } else {
      if (milik(m.t) === 3 - giliran && banyak(m.t) === 1) {   // baris 2950
        A[m.t] = 0;
        A[SISI[3 - giliran].bar]++;
        audio.sound(220, 0.1);
        pesanTerakhir = 'Hit! ' + nama(3 - giliran) + ' goes to the bar.';
      } else {
        audio.sound(520, 0.05);
        pesanTerakhir = '';
      }
      A[m.t] += s.tanda;
    }

    const i = sisaLangkah.indexOf(m.d);
    if (i >= 0) sisaLangkah.splice(i, 1);
    pilihDari = null;

    if (menang()) return tamat();
    if (!sisaLangkah.length) return gantiGiliran();
    gambar();
    if (!adaLangkah()) return takBisaJalan();
    kata((pesanTerakhir ? pesanTerakhir + ' ' : '') +
         'Dice left: ' + sisaLangkah.join(', ') + '.');
  }

  /** Baris 2970-2990: menang kalau tak ada satu pun bidak tersisa di papan. */
  function menang() {
    for (let p = 0; p <= 25; p++) if (milik(p) === giliran) return false;
    return A[S().bar] === 0;
  }

  function gantiGiliran() {
    giliran = 3 - giliran;
    sisaLangkah = []; dadu = []; pilihDari = null;
    fase = 'lempar';
    gambar();
    kata((pesanTerakhir ? pesanTerakhir + ' ' : '') + nama(giliran) + ' — roll the dice.');
    pesanTerakhir = '';
  }

  /** Baris 3070: "You can't move!" — giliran berpindah tanpa langkah. */
  function takBisaJalan() {
    audio.play('MB T160 O2 L8 a e', { fresh: true });
    kata("You can't move!", 'bad');
    gambar();
    setTimeout(() => { if (fase === 'main') gantiGiliran(); }, 1100);
  }

  function tamat() {
    fase = 'usai';
    gambar();
    kata(nama(giliran) + ' wins!');
    audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true });
    const k = 'menang' + giliran;
    db.set(k, db.get(k, 0) + 1);
    $('again').classList.remove('hidden');
  }

  /* --------------------------------------------------------------------
     Memilih
     -------------------------------------------------------------------- */
  function klikTitik(p) {
    if (fase !== 'main') return;
    if (pilihDari === null) {
      const asal = diBar() ? S().bar : p;
      if (diBar() && p !== S().bar) {
        return kata('You must enter from the bar first.', 'bad');
      }
      if (!langkahDari(asal).length) {
        return kata('No legal move from there.', 'bad');
      }
      pilihDari = asal;
      gambar();
      return kata('Now pick where to move it.');
    }
    if (p === pilihDari) { pilihDari = null; gambar(); return kata('Cancelled.'); }
    const m = langkahDari(pilihDari).find(x => x.t === p);
    if (!m) return kata('That is not a legal move.', 'bad');
    jalankan(m);
  }

  function klikKeluar() {
    if (fase !== 'main' || pilihDari === null) return;
    const m = langkahDari(pilihDari).find(x => x.keluar);
    if (!m) return kata('Cannot bear off from there yet.', 'bad');
    jalankan(m);
  }

  /* --------------------------------------------------------------------
     Gambar. Tata letaknya mengikuti baris 2630 apa adanya: baris atas
     menampilkan titik 24 turun ke 13 dari kiri ke kanan, baris bawah 1 naik
     ke 12. Itu papan backgammon yang benar dilihat dari sisi pemain 1.
     -------------------------------------------------------------------- */
  const ATAS = []; for (let p = 24; p >= 13; p--) ATAS.push(p);
  const BAWAH = []; for (let p = 1; p <= 12; p++) BAWAH.push(p);

  function titikEl(p, atas) {
    const wrap = ui.el('div', {
      class: 'b-titik b-titik--' + (atas ? 'atas' : 'bawah') +
             (p % 2 === 0 ? ' b-titik--genap' : '') +
             (pilihDari !== null && langkahDari(pilihDari).some(m => m.t === p)
               ? ' b-titik--tujuan' : '') +
             (pilihDari === p ? ' b-titik--pilih' : ''),
      title: 'titik ' + p
    });
    wrap.append(ui.el('span', { class: 'b-segi' }));
    const tum = ui.el('div', { class: 'b-tumpuk' });
    for (let i = 0; i < Math.min(banyak(p), 5); i++) {
      tum.append(ui.el('i', { class: 'b-bidak b-bidak--' + milik(p) }));
    }
    if (banyak(p) > 5) {
      tum.append(ui.el('b', { class: 'b-lebih', text: '+' + (banyak(p) - 5) }));
    }
    wrap.append(tum);
    wrap.append(ui.el('span', { class: 'b-nomor', text: String(p) }));
    wrap.addEventListener('click', () => klikTitik(p));
    return wrap;
  }

  function gambarDadu(bergulir) {
    const d = $('dice');
    d.textContent = '';
    if (!dadu.length) return;
    dadu.forEach(v => {
      const e = dice.el(v, { size: 38 });
      if (bergulir) e.classList.add('die--rolling');
      d.append(e);
    });
    if (!bergulir && sisaLangkah.length) {
      d.append(ui.el('span', { class: 'b-sisa',
        text: 'sisa: ' + sisaLangkah.join(', ') }));
    }
  }

  function gambar() {
    const t = $('atas'), b = $('bawah');
    t.textContent = ''; b.textContent = '';
    ATAS.forEach(p => t.append(titikEl(p, true)));
    BAWAH.forEach(p => b.append(titikEl(p, false)));

    /* Bar: A(25) milik pemain 1, A(0) milik pemain 2 — keduanya cacah biasa,
       bukan bertanda. Lihat komentar kepala berkas. */
    [[25, 1], [0, 2]].forEach(([slot, pihak]) => {
      const box = $('bar' + pihak);
      box.textContent = '';
      /* Ditandai merah sejak giliran DIMULAI, bukan hanya setelah melempar:
         "Anda punya bidak di bar" adalah kabar yang menentukan seluruh
         giliran, dan pemain perlu tahu sebelum ia melempar, bukan sesudah. */
      const wajib = giliran === pihak && A[slot] &&
                    (fase === 'main' || fase === 'lempar');
      box.className = 'b-bar' + (pilihDari === slot ? ' b-bar--pilih' : '') +
                      (wajib ? ' b-bar--wajib' : '');
      for (let i = 0; i < A[slot]; i++) {
        box.append(ui.el('i', { class: 'b-bidak b-bidak--' + pihak }));
      }
      box.onclick = () => klikTitik(slot);
    });

    gambarDadu(fase === 'menggulir');
    $('roll').disabled = fase !== 'lempar';
    $('off').disabled = !(fase === 'main' && pilihDari !== null &&
                          langkahDari(pilihDari).some(m => m.keluar));
    $('sTurn').textContent = fase === 'usai' ? '—' : nama(giliran);
    $('sW1').textContent = db.get('menang1', 0);
    $('sW2').textContent = db.get('menang2', 0);
    $('sOff1').textContent = 15 - hitungBidak(1);
    $('sOff2').textContent = 15 - hitungBidak(2);
  }

  function hitungBidak(w) {
    let n = A[SISI[w].bar];
    for (let p = 1; p <= 24; p++) if (milik(p) === w) n += banyak(p);
    return n;
  }

  function kata(t, jenis) {
    $('say').textContent = t;
    $('say').className = 'b-say' + (jenis ? ' b-say--' + jenis : '');
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Backgammon',
    source: 'BACKGAM.BAS · 1986',
    backHref: '../../index.html'
  }));

  $('roll').addEventListener('click', lempar);
  $('off').addEventListener('click', klikKeluar);
  $('again').addEventListener('click', () => {
    $('again').classList.add('hidden'); papanBaru();
  });
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah kemenangan kedua pemain dihapus.')) return;
    db.set('menang1', 0); db.set('menang2', 0); gambar();
  });

  papanBaru();
})();
