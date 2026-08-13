/* ===========================================================================
   crazy8.js — port dari CRAZY8.BAS (Les Davids, 1986).

   Program dengan struktur terbaik di koleksi ini: 294 baris, hanya 8 GOTO.
   Kuncinya WHILE/WEND — loop dinyatakan sebagai loop, bukan sebagai lompatan
   mundur — dan pembagian subrutin menurut TANGGUNG JAWAB, bukan menurut
   urutan kejadian:

       2500-2850  shuffle routine     data
       2860-3150  computer section    kecerdasan
       3460-3630  create figure       tampilan
       3380-3450  print a card        tampilan

   Itu pemisahan model-view-controller, ditemukan sendiri pada 1986.

   ------------------------------------------------------------------------
   ATURANNYA, DARI BARIS 1120-1270 APA ADANYA

   Penulisnya mencetak aturannya sendiri di layar pembuka, jadi tidak ada yang
   perlu ditafsirkan:

       "You can play a card if you have the same suit, the same number (in
        which case the suit changes), or at any time you can play an eight.
        If you play an eight you will be prompted for new suit (h,c,s,d)."
       "If you cannot go, hit the space bar. You will then be dealt a new card."
       "Game will end at 100 points. The winner receives points from the
        losers hand. Points are equal to face value. Face cards are 10 each,
        aces are worth 15."

   Semua itu dipertahankan persis, termasuk As bernilai 15 — angka yang tidak
   lazim di Crazy Eights modern (biasanya As = 1) dan justru karena itu tidak
   diubah.

   ------------------------------------------------------------------------
   URUTAN KEPUTUSAN KOMPUTER — baris 2990-3130, dipertahankan persis

       1. kartu SEWARNA yang bukan 8      (2990-3030)
       2. kartu SEANGKA                   (3050-3090)
       3. sembarang 8                     (3110-3130)
       4. ambil satu kartu, ulangi sekali (3150-3230)
       5. kalau masih buntu, lewat

   Perhatikan urutan 1: delapan sengaja DISIMPAN, tidak dibuang untuk
   mencocokkan warna. Itu keputusan yang benar — 8 adalah kartu yang selalu
   bisa dimainkan, jadi ia paling berharga saat tangan mulai sempit.

   Yang TIDAK bagus ada di baris 3250: saat komputer memainkan 8, warna yang
   diumumkannya diambil dari kartu PERTAMA di tangannya —

       3250 IF IN=1 THEN S$=MID$(CHAND$(2),3,1) ELSE S$=MID$(CHAND$(1),3,1)

   dan tangannya diurutkan menurut huruf warna (c < d < h < s), jadi "kartu
   pertama" berarti "keriting kalau punya". Bukan warna terbanyak, bukan warna
   terkuat — cuma yang huruf awalnya paling kecil. Dipertahankan apa adanya,
   karena ini aturan main komputernya, bukan bug.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, cards, rng } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Huruf warna versi aslinya. Dipakai untuk MENGURUTKAN tangan, dan urutan
     itu ikut menentukan warna apa yang diumumkan komputer saat memainkan 8
     (baris 3250) — jadi hurufnya bukan sekadar label. */
  const HURUF = { clubs: 'c', diamonds: 'd', hearts: 'h', spades: 's' };

  /* Baris 1320: DATA 15,2,3,4,5,6,7,8,9,10,10,10,10 untuk A,2..9,10,J,Q,K. */
  const nilai = (c) => (c.v === 1 ? 15 : c.v >= 10 ? 10 : c.v);

  const db = store('crazy8');

  let dek, tangan, mesin, buang, warnaAktif, berikut;
  let skorAnda, skorMesin, ronde, sudahAmbil, fase, pesanMesin;
  let digambarUlang, totalGambar;          // penghitung untuk panel "redraw"

  /* --------------------------------------------------------------------
     Satu ronde

     Baris 1460-1540: delapan kartu masing-masing, dibagi BERSELANG-SELING —
     pemain dapat indeks ganjil, komputer indeks genap — lalu kartu ke-17 jadi
     kartu buangan pertama dan pengambilan mulai dari ke-18.
     -------------------------------------------------------------------- */
  function rondeBaru() {
    dek = rng().shuffle(cards.deck());
    tangan = []; mesin = [];
    for (let i = 0; i < 8; i++) {          // baris 1470: J = 1+((I-1)*2)
      tangan.push(dek[i * 2]);
      mesin.push(dek[i * 2 + 1]);
    }
    buang = dek[16];                       // baris 1520: UPCARD$ = DECK$(17)
    warnaAktif = buang.suit;
    berikut = 17;                          // baris 1510: NEXTCARD = 18
    sudahAmbil = false; fase = 'main'; pesanMesin = '';
    urut(tangan);
    gambar();
    kata('Your play.');
  }

  /* Baris 1590-1640: bubble sort pada HURUF WARNA saja, bukan pada angka.
     Tangan jadi berkelompok per warna, dan di dalam kelompok urutannya
     tinggal urutan bagi — itulah yang dilihat pemain 1986. */
  function urut(h) {
    for (let lagi = true; lagi;) {
      lagi = false;
      for (let i = 0; i < h.length - 1; i++) {
        if (HURUF[h[i].suit] > HURUF[h[i + 1].suit]) {
          [h[i], h[i + 1]] = [h[i + 1], h[i]];
          lagi = true;
        }
      }
    }
  }

  /* Baris 2220-2240. Tiga syarat, dan hanya tiga. */
  const bisa = (c) =>
    c.rank === '8' || c.suit === warnaAktif || c.v === buang.v;

  const adaLangkah = () => tangan.some(bisa);

  /* --------------------------------------------------------------------
     Giliran pemain
     -------------------------------------------------------------------- */
  async function mainkan(i) {
    if (fase !== 'main') return;
    const c = tangan[i];
    if (!bisa(c)) {
      audio.play('MF O1 F D', { fresh: true });   // baris 2190: PLAY "mfo1fd"
      return kata('Wrong card.', 'bad');
    }

    let warna = c.suit;
    if (c.rank === '8') {
      warna = await pilihWarna();
      if (!warna) return;                          // dibatalkan
    }

    tangan.splice(i, 1);
    buang = c; warnaAktif = warna;
    sudahAmbil = false;
    audio.sound(600, 0.06);
    gambar();

    if (!tangan.length) return selesai('anda');
    await giliranMesin();
  }

  /** Baris 2280-2340: "WHAT SUIT?" — h, c, s, atau d. */
  function pilihWarna() {
    fase = 'warna';
    kata('What suit?');
    gambar();
    return new Promise(resolve => {
      const kotak = $('suitpick');
      kotak.textContent = '';
      cards.SUITS.forEach(s => {
        const b = ui.el('button', {
          class: 'c-suit c-suit--' + s.color, type: 'button',
          text: s.sym, title: s.nama
        });
        b.addEventListener('click', () => {
          kotak.textContent = ''; fase = 'main'; resolve(s.key);
        });
        kotak.append(b);
      });
    });
  }

  /* Baris 2000-2070: spasi = ambil satu kartu. Baris 2010 — kalau sudah
     pernah mengambil di giliran ini, spasi kedua berarti LEWAT. Jadi
     mengambil dibatasi satu kartu per giliran, sama seperti komputernya. */
  async function ambilAtauLewat() {
    if (fase !== 'main') return;
    if (sudahAmbil) {
      sudahAmbil = false;
      kata('You pass.');
      gambar();
      return giliranMesin();
    }
    if (berikut >= 52) return dekHabis();
    tangan.push(dek[berikut++]);
    sudahAmbil = true;
    urut(tangan);
    audio.sound(300, 0.05);
    gambar();
    kata(adaLangkah() ? 'You drew a card.' : 'Still stuck — press again to pass.');
  }

  /* --------------------------------------------------------------------
     Giliran komputer — baris 2860-3360, urutan keputusannya dipertahankan
     -------------------------------------------------------------------- */
  async function giliranMesin() {
    fase = 'mesin';
    kata('Thinking...');                    // baris 1990
    gambar();
    await new Promise(r => setTimeout(r, 520));

    let ambil = false;
    for (;;) {
      urut(mesin);                          // baris 2900-2970, tiap putaran

      let i = mesin.findIndex(c => c.suit === warnaAktif && c.rank !== '8');
      let alasan = 'warna cocok';
      if (i < 0) {
        i = mesin.findIndex(c => c.v === buang.v);
        alasan = 'angka cocok';
      }
      if (i < 0) {
        i = mesin.findIndex(c => c.rank === '8');
        alasan = 'main delapan';
      }

      if (i >= 0) {
        const c = mesin[i];
        let warna = c.suit;
        if (alasan === 'main delapan') {
          /* Baris 3250 apa adanya: warna diambil dari kartu pertama di
             tangan — atau kartu kedua kalau delapannya sendiri yang pertama.
             Kalau delapan itu satu-satunya kartu, aslinya membaca CHAND$(2)
             yang kosong dan MID$ tidak mengubah apa pun; di sini warnanya
             tetap warna delapan itu sendiri, yang artinya sama. */
          const lain = mesin[i === 0 ? 1 : 0];
          if (lain) warna = lain.suit;
        }
        mesin.splice(i, 1);
        buang = c; warnaAktif = warna;
        pesanMesin = alasan;
        audio.sound(500, 0.06);
        if (!mesin.length) { gambar(); return selesai('mesin'); }
        if (mesin.length === 1) audio.sound(400, 0.1);   // baris 3360
        break;
      }

      /* Baris 3150: satu kartu, sekali. Kalau sesudah itu masih buntu, lewat. */
      if (ambil) { pesanMesin = 'lewat'; break; }
      if (berikut >= 52) return dekHabis();
      mesin.push(dek[berikut++]);
      ambil = true;
      pesanMesin = 'ambil kartu';
      gambar();
      await new Promise(r => setTimeout(r, 380));
    }

    fase = 'main';
    gambar();
    kata(adaLangkah() ? 'Your play.' : 'No play — press Draw.');
  }

  /* --------------------------------------------------------------------
     Akhir ronde — baris 3730-3880

     Kedua tangan dihitung, masing-masing masuk ke skor LAWANNYA. Karena yang
     menang tangannya kosong, hasilnya sama dengan aturan tercetaknya
     ("the winner receives points from the losers hand") — tapi kodenya
     memang menghitung keduanya, dan itu dipertahankan.
     -------------------------------------------------------------------- */
  function selesai(siapa) {
    fase = 'usai';
    const dariAnda = tangan.reduce((t, c) => t + nilai(c), 0);
    const dariMesin = mesin.reduce((t, c) => t + nilai(c), 0);
    skorMesin += dariAnda;
    skorAnda += dariMesin;
    ronde++;
    db.set('ronde', ronde);

    const menang = siapa === 'anda';
    kata(menang ? '!! You win' : '!! I win', menang ? null : 'bad');
    audio.play(menang ? 'MB T170 O2 L8 c e g O3 L4 c'
                      : 'MB T140 O2 L8 g e L4 c', { fresh: true });
    gambar();

    if (skorAnda >= 100 || skorMesin >= 100) return tamat();
    $('next').classList.remove('hidden');
  }

  function tamat() {
    fase = 'tamat';
    const menang = skorAnda > skorMesin;
    kata(menang ? 'Game over — you win!' : 'Game over — I win.', menang ? null : 'bad');
    if (menang) {
      const rek = db.get('best', null);
      if (rek === null || ronde < rek) {
        db.set('best', ronde);
        ui.toast('Rekor baru: menang dalam ' + ronde + ' ronde.');
      }
    }
    $('again').classList.remove('hidden');
  }

  /** Baris 2030 / 3220: dek habis sebelum ada yang menang. Lihat panel. */
  function dekHabis() {
    fase = 'usai';
    kata('Deck exhausted — no score this round.', 'bad');
    ronde++;
    gambar();
    $('next').classList.remove('hidden');
  }

  /* --------------------------------------------------------------------
     Gambar.

     Aslinya (baris 1710, 1810) menyimpan OLDHAND$ dan hanya menggambar ulang
     kartu yang BERUBAH. Di layar teks 80x25 satu kartu berarti 25 pasang
     LOCATE+PRINT; enam belas kartu berarti empat ratus. Perbandingannya
     dihitung di sini juga, dan ditampilkan di panel kanan.
     -------------------------------------------------------------------- */
  let lama = [];

  function gambar() {
    const barisMesin = $('cpu');
    barisMesin.textContent = '';
    mesin.forEach(() => barisMesin.append(cards.backEl({ small: true })));
    $('cpuN').textContent = mesin.length;

    $('pile').textContent = '';
    $('pile').append(cards.faceEl(buang));
    const tanda = cards.SUITS.filter(s => s.key === warnaAktif)[0];
    $('suit').textContent = tanda.sym;
    $('suit').className = 'c-active c-active--' + tanda.color;
    $('stock').textContent = String(52 - berikut);

    /* Penghitung "yang berubah": bandingkan tangan sekarang dengan yang
       tergambar sebelumnya, persis peran OLDHAND$. */
    const kini = tangan.map(c => c.id);
    let beda = 0;
    for (let i = 0; i < Math.max(kini.length, lama.length); i++) {
      if (kini[i] !== lama[i]) beda++;
    }
    lama = kini;
    digambarUlang += beda; totalGambar += Math.max(kini.length, 1);
    $('barDirty').style.width =
      Math.min(100, (digambarUlang / Math.max(totalGambar, 1)) * 100) + '%';
    $('nDirty').textContent = digambarUlang;
    $('nAll').textContent = totalGambar;

    const baris = $('hand');
    baris.textContent = '';
    tangan.forEach((c, i) => {
      const e = cards.faceEl(c, { tag: 'button' });
      e.type = 'button';
      e.classList.add('c-card');
      if (fase === 'main' && bisa(c)) e.classList.add('c-card--ok');
      else if (fase === 'main') e.classList.add('c-card--no');
      e.addEventListener('click', () => mainkan(i));
      baris.append(e);
    });

    $('sYou').textContent = skorAnda;
    $('sCpu').textContent = skorMesin;
    $('sRonde').textContent = ronde;
    $('draw').disabled = fase !== 'main';
    $('why').textContent = pesanMesin ? 'Komputer: ' + pesanMesin + '.' : '';
  }

  function kata(t, jenis) {
    $('say').textContent = t;
    $('say').className = 'c-say' + (jenis ? ' c-say--' + jenis : '');
  }

  /* --------------------------------------------------------------------
     Panel: tiga cara mengocok

     Aslinya (baris 2570-2650) memakai penolakan-dan-ulang:

         2580 NUMBR=100*RND
         2590 IF NUMBR > 52 THEN 2580      ' 48% langsung dibuang
         2600 IF NUMBR = 0 THEN 2580
         2610 IF TEST(NUMBR) = 1 THEN 2580 ' sudah terpakai, ulangi

     Benar, tapi mahal: makin penuh dek, makin sering gagal. Harapan
     jumlah undian = 100 x H(52) ~ 454 untuk 52 kartu. Diukur di sini,
     bukan diklaim.
     -------------------------------------------------------------------- */
  function kocok1982(r) {
    const dipakai = new Array(53).fill(false);
    let n = 0, undian = 0;
    while (n < 52) {
      const x = Math.floor(r.next() * 100);   // NUMBR = 100*RND
      undian++;
      if (x > 52 || x === 0 || dipakai[x]) continue;
      dipakai[x] = true; n++;
    }
    return undian;
  }

  function ukurKocok() {
    const r = rng();
    let jml = 0;
    const N = 1000;
    for (let i = 0; i < N; i++) jml += kocok1982(r);
    const rata = jml / N;
    $('shuffleOut').innerHTML =
      '<b>' + rata.toFixed(1) + '</b> undian rata-rata untuk 52 kartu, ' +
      'dari ' + N.toLocaleString('id-ID') + ' pengocokan. ' +
      'Fisher&ndash;Yates butuh <b>52</b> &mdash; selisih <b>' +
      (rata / 52).toFixed(1) + '&times;</b>. ' +
      'Ramalan teorinya 100&nbsp;&times;&nbsp;H(52) &asymp; 454.';
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Crazy Eights',
    source: 'CRAZY8.BAS · Les Davids · 1986',
    backHref: '../../index.html'
  }));

  $('draw').addEventListener('click', ambilAtauLewat);
  $('next').addEventListener('click', () => {
    $('next').classList.add('hidden'); pesanMesin = ''; lama = []; rondeBaru();
  });
  $('again').addEventListener('click', () => {
    $('again').classList.add('hidden');
    skorAnda = 0; skorMesin = 0; ronde = 1; pesanMesin = ''; lama = [];
    rondeBaru();
  });
  $('shuffleRun').addEventListener('click', ukurKocok);
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah ronde terbaik dihapus.')) return;
    db.set('best', null); tampilRekor();
  });

  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === ' ') { e.preventDefault(); ambilAtauLewat(); }
  });

  function tampilRekor() {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b + ' ronde';
  }

  skorAnda = 0; skorMesin = 0; ronde = 1;
  digambarUlang = 0; totalGambar = 0;
  tampilRekor();
  rondeBaru();
})();
