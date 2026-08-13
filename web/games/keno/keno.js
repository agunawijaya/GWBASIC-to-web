/* ===========================================================================
   keno.js — port dari KENO.BAS (Steve Schlich, September 1984).

   Seratus tiga puluh tujuh baris, dan kalimat pembuka petunjuknya sendiri
   sudah menjelaskan seluruh permainannya:

       9010 PRINT"KENO has the worst odds of any casino game."

   Rumah menarik 20 angka dari 1..80. Pemain menebak 1..11 angka lebih dulu.
   Yang cocok dihitung. Itu saja.

   ------------------------------------------------------------------------
   TIGA HAL YANG DITEMUKAN DI SUMBERNYA

   1. BAYARANNYA TIDAK PERNAH ADA.

      Petunjuknya menjanjikan:

          9050 "Your payoff (if there is one) depends on the ratio between"
          9060 "how many spots you picked and how many came up..."

      Tapi tidak ada satu baris pun di seluruh program yang menghitung
      bayaran. Yang ditampilkan cuma `MATCHES`. Kata "if there is one" di
      baris 9050 ternyata harfiah — memang tidak ada.

   2. PENGHITUNG `FOR` DIUBAH DARI DALAM PERULANGANNYA SENDIRI.

          660 FOR D1=1 TO 20
          670 CHOICE=INT(RND*80)+1
          680 IF CHOSEN(CHOICE)<>1 THEN 700
          690 D1=D1-1: GOTO 740      ' mundurkan pencacah, lalu ke NEXT
          ...
          740 NEXT D1

      `NEXT` menaikkannya kembali, jadi hasil bersihnya nol dan putaran itu
      diulang. Jalan di GW-BASIC; tidak dijamin di mana pun.

   3. HANYA ADA 60 UNDIAN YANG MUNGKIN.

          630 T$=RIGHT$(TIME$,2)   ' DETIK saja
          640 T=VAL(T$)
          650 RANDOMIZE T

      Dan baris 1090 kembali ke 630 tiap permainan baru — jadi tiap
      permainan menyemai ulang dari detik. Dua puluh angka yang ditarik
      rumah **sepenuhnya ditentukan oleh detik saat undian dimulai**. Enam
      puluh permainan berbeda, selamanya.

      Di permainan judi, itu bukan kelemahan mutu acak. Itu seluruh
      permainannya.

   ------------------------------------------------------------------------
   YANG DITAMBAHKAN, DAN KENAPA

   Aslinya menyatakan "worst odds of any casino game" tapi tidak pernah
   menunjukkannya. Halaman ini menghitung peluang sebenarnya —
   hipergeometrik, dari rumus, bukan dari simulasi — dan menaruhnya di
   sebelah papan. Itu penambahan, bukan pemulihan, dan dinyatakan begitu di
   dokumennya.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const MAKS_SPOT = 11;                    // baris 530: "How many spots (1-11)"
  const DITARIK = 20;                      // baris 660: FOR D1=1 TO 20

  const db = store('keno');
  let pilihan, ditarik, cocok, permainan, fase, jedaTarik;

  /* --------------------------------------------------------------------
     Papan.

     Aslinya membelah 1-40 dan 41-80 dengan judul di tengahnya (baris
     300-500), dan pembelahan itu dipertahankan — ia satu-satunya hal yang
     membuat papan KENO ini terlihat seperti papan KENO ini, bukan seperti
     kisi 8x10 mana pun.
     -------------------------------------------------------------------- */
  const sel = [];

  function bangunPapan() {
    [[1, 40, 'atas'], [41, 80, 'bawah']].forEach(([a, b, nama]) => {
      const kisi = ui.el('div', { class: 'k-grid k-grid--' + nama });
      for (let n = a; n <= b; n++) {
        const e = ui.el('button', { class: 'k-n', type: 'button', text: String(n) });
        e.addEventListener('click', () => pilih(n));
        sel[n] = e;
        kisi.append(e);
      }
      $('board').append(kisi);
      if (nama === 'atas') {
        $('board').append(ui.el('p', { class: 'k-title',
          text: '* * *   P C   *   K E N O   * * *' }));
      }
    });
  }

  /* Baris 540-610. Aslinya menanyakan berapa spot dulu, lalu memintanya satu
     per satu lewat INPUT. Di sini spot diklik langsung, dan jumlahnya menjadi
     akibat — bukan pertanyaan yang harus dijawab lebih dulu.

     Satu cacat aslinya ikut hilang karena itu: baris 540-610 TIDAK PERNAH
     memeriksa apakah sebuah angka sudah dipilih. Mengetik "7" dua kali
     menghabiskan dua jatah spot tapi hanya menandai satu kotak — pemain
     bertaruh dengan spot yang lebih sedikit daripada yang ia kira. */
  function pilih(n) {
    if (fase !== 'pilih') return;
    if (pilihan.has(n)) { pilihan.delete(n); }
    else {
      if (pilihan.size >= MAKS_SPOT) {
        return kata('Maximum ' + MAKS_SPOT + ' spots.', 'bad');
      }
      pilihan.add(n);
      audio.sound(520, 0.04);
    }
    gambar();
  }

  /* --------------------------------------------------------------------
     Undian rumah — baris 660-740.

     Aslinya menolak-dan-mengulang dengan memundurkan pencacah `FOR`. Di sini
     hasilnya sama (20 angka berbeda dari 80) lewat pengambilan tanpa
     pengembalian, dan jumlah undian yang dibutuhkan cara aslinya dihitung
     di panel supaya bisa dibandingkan.
     -------------------------------------------------------------------- */
  async function tarik() {
    if (fase !== 'pilih' || !pilihan.size) return;
    fase = 'menarik';
    ditarik = new Set(); cocok = 0;
    gambar();
    kata('Drawing numbers...');             // baris 765

    const r = rng();
    const kolam = [];
    for (let n = 1; n <= 80; n++) kolam.push(n);
    r.shuffle(kolam);

    for (let i = 0; i < DITARIK; i++) {
      const n = kolam[i];
      ditarik.add(n);
      if (pilihan.has(n)) { cocok++; audio.sound(700, 0.07); }
      else audio.sound(320, 0.03);
      gambar();
      await new Promise(res => setTimeout(res, jedaTarik));
    }

    fase = 'usai';
    permainan++;
    db.set('main', permainan);
    const rek = db.get('best', 0);
    if (cocok > rek) { db.set('best', cocok); ui.toast('Rekor baru: ' + cocok + ' cocok.'); }
    kata('Spots matched: ' + cocok);        // baris 890
    gambar();
  }

  function gambar() {
    for (let n = 1; n <= 80; n++) {
      const e = sel[n];
      e.className = 'k-n'
        + (pilihan.has(n) ? ' k-n--saya' : '')
        + (ditarik.has(n) ? (pilihan.has(n) ? ' k-n--cocok' : ' k-n--tarik') : '');
      e.disabled = fase !== 'pilih';
    }
    $('sSpots').textContent = pilihan.size;
    $('sMatch').textContent = fase === 'pilih' ? '—' : cocok;
    $('sGame').textContent = permainan;
    $('sBest').textContent = db.get('best', 0);
    $('draw').disabled = fase !== 'pilih' || !pilihan.size;
    $('same').classList.toggle('hidden', fase !== 'usai');
    $('newp').classList.toggle('hidden', fase !== 'usai');

    /* Tabel peluang hanya bergantung pada BERAPA spot yang dipilih, dan itu
       tidak berubah selama undian berjalan — jadi membangunnya ulang dua
       puluh kali per permainan adalah pekerjaan yang hasilnya sudah pasti
       sama.

       Kejujuran soal ukurannya: ini BUKAN perbaikan kecepatan yang terasa.
       Diukur, membangun ulang tabel itu jauh di bawah satu milidetik, dan
       kelambatan yang sempat terlihat saat menguji ternyata datang dari
       Chrome yang mencekik `setTimeout` di tab tersembunyi, bukan dari sini.
       Yang diperbaiki adalah bentuknya: menghitung ulang sesuatu yang tidak
       berubah membuat pembaca berikutnya mengira ia bisa berubah. */
    if (pilihan.size !== spotTergambar) {
      spotTergambar = pilihan.size;
      hitungPeluang();
    }
  }
  let spotTergambar = -1;

  function kata(t, jenis) {
    $('say').textContent = t;
    $('say').className = 'k-say' + (jenis ? ' k-say--' + jenis : '');
  }

  /* --------------------------------------------------------------------
     Peluang sebenarnya — hipergeometrik, dari rumus.

         P(m cocok | k spot) = C(k,m) * C(80-k, 20-m) / C(80,20)

     C(80,20) sekitar 3,5 x 10^18, jauh di atas bilangan bulat aman
     JavaScript, jadi dihitung lewat logaritma faktorial. Bukan simulasi:
     angka di layar ini adalah peluang eksak, bukan taksiran.
     -------------------------------------------------------------------- */
  const lnFakt = (() => {
    const t = [0];
    for (let i = 1; i <= 100; i++) t[i] = t[i - 1] + Math.log(i);
    return t;
  })();
  const lnC = (n, k) =>
    (k < 0 || k > n) ? -Infinity : lnFakt[n] - lnFakt[k] - lnFakt[n - k];

  function peluang(k, m) {
    const v = lnC(k, m) + lnC(80 - k, DITARIK - m) - lnC(80, DITARIK);
    return v === -Infinity ? 0 : Math.exp(v);
  }

  function hitungPeluang() {
    const k = pilihan.size;
    const tbody = $('oddsBody');
    tbody.textContent = '';
    if (!k) {
      $('oddsHead').textContent = 'Pilih spot dulu untuk melihat peluangnya.';
      $('oddsExp').textContent = '';
      return;
    }
    $('oddsHead').textContent = k + ' spot dipilih — peluang eksak tiap hasil:';
    for (let m = 0; m <= k; m++) {
      const p = peluang(k, m);
      const tr = ui.el('tr', p > 0 && m === k ? { class: 'k-odds--all' } : null);
      tr.append(
        ui.el('td', { text: m + ' cocok' }),
        ui.el('td', { text: (p * 100).toFixed(p < 0.001 ? 5 : 2) + '%' }),
        ui.el('td', { text: p > 0 ? '1 : ' + Math.round(1 / p).toLocaleString('id-ID') : '—' })
      );
      tbody.append(tr);
    }
    /* Harapan jumlah cocok = k x 20/80 = k/4, dan itu tidak bergantung pada
       spot mana yang dipilih — hanya pada berapa banyak. */
    $('oddsExp').innerHTML =
      'Harapan jumlah cocok: <b>' + (k / 4).toFixed(2) + '</b> ' +
      '(selalu <code>spot &divide; 4</code>, apa pun angkanya). ' +
      'Peluang <b>semua</b> ' + k + ' spot kena: <b>1 : ' +
      Math.round(1 / peluang(k, k)).toLocaleString('id-ID') + '</b>.';
  }

  /* --------------------------------------------------------------------
     Panel: berapa undian yang dihabiskan cara 1984

     Baris 670-690 menolak angka yang sudah keluar dan mengulang. Untuk 20
     dari 80 itu tidak semahal mengocok 52 kartu — tapi ia tetap bisa
     diukur, dan diukur di sini, bukan ditaksir.
     -------------------------------------------------------------------- */
  function ukurUndian() {
    const r = rng();
    let jml = 0;
    const N = 5000;
    for (let i = 0; i < N; i++) {
      const ada = new Uint8Array(81);
      let n = 0;
      while (n < DITARIK) {
        jml++;
        const x = Math.floor(r.next() * 80) + 1;
        if (ada[x]) continue;
        ada[x] = 1; n++;
      }
    }
    const rata = jml / N;
    /* Harapan teoretisnya: sum_{i=0..19} 80/(80-i) */
    let teori = 0;
    for (let i = 0; i < DITARIK; i++) teori += 80 / (80 - i);
    $('drawsOut').innerHTML =
      '<b>' + rata.toFixed(2) + '</b> undian rata-rata untuk 20 angka, dari ' +
      N.toLocaleString('id-ID') + ' permainan. Teorinya &Sigma; 80/(80&minus;i) = <b>' +
      teori.toFixed(2) + '</b>. Pemborosannya cuma <b>' +
      ((rata / DITARIK - 1) * 100).toFixed(0) + '%</b> &mdash; jauh lebih ringan ' +
      'daripada di <a href="../crazy8/index.html">CRAZY8</a>, karena di sini ' +
      'papannya empat kali lebih besar daripada yang diambil.';
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'PC Keno',
    source: 'KENO.BAS · Steve Schlich · 1984',
    backHref: '../../index.html'
  }));

  bangunPapan();

  $('draw').addEventListener('click', tarik);
  $('same').addEventListener('click', () => {          // baris 940: P
    ditarik = new Set(); cocok = 0; fase = 'pilih';
    kata('Same ' + pilihan.size + ' spots. Draw when ready.');
    gambar();
  });
  $('newp').addEventListener('click', () => {          // baris 930: N
    pilihan = new Set(); ditarik = new Set(); cocok = 0; fase = 'pilih';
    kata('Pick 1 to ' + MAKS_SPOT + ' spots.');
    gambar();
  });
  $('drawsRun').addEventListener('click', ukurUndian);
  $('speed').addEventListener('input', e => {
    jedaTarik = 260 - Number(e.target.value) * 25;
    $('speedN').textContent = e.target.value;
  });
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah cocok terbaik dihapus.')) return;
    db.set('best', 0); gambar();
  });

  pilihan = new Set(); ditarik = new Set();
  cocok = 0; permainan = db.get('main', 0); fase = 'pilih';
  jedaTarik = 260 - 5 * 25;
  kata('Pick 1 to ' + MAKS_SPOT + ' spots.');
  gambar();
})();
