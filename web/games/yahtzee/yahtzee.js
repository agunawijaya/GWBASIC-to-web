/* ===========================================================================
   yahtzee.js — port dari YAHTZEE.BAS.

       1000 '     YATZEE
       1010 ' ORIGINAL BY JL HELMS & MF PEZOK FOR CCII
       1020 ' CORONADO, CA
       1030 ' ADAPTED TO IBM PC BY PATRICK LEABO
       1040 ' TUCSON, AZ

   Enam ratus dua belas baris dengan 27% komentar — rasio komentar tertinggi
   kedua di koleksi. Patrick Leabo yang sama juga membawa OTHELLO dan MAXIT ke
   IBM PC dari Tucson; ini yang ketiga, dan satu-satunya yang bukan karyanya
   sendiri melainkan adaptasi dari CCII, Coronado.

   ------------------------------------------------------------------------
   S(6,5): TABEL FREKUENSI YANG SEKALIGUS INDEKS

   Ini bagian terbaik dari program ini, dan ia muat dalam sembilan baris:

       2250 FOR J= 1 TO 5
       2260 X= C(J):S(X,0)= S(X,0)+ 1      ' berapa banyak mata X
       2270 P= S(X,0):S(X,P)= J            ' dadu KE-BERAPA yang bermata X
       2280 NEXT J

       2330 FOR J= 5 TO 1 STEP -1          ' lalu urutkan mata menurut
       2340 FOR M= 6 TO 1 STEP -1          ' BANYAKNYA, terbanyak dulu
       2350 IF S(M,0)<> J THEN 2370
       2360 S(0,X)= M:X= X+ 1

   Sesudah itu setiap pertanyaan tentang segenggam dadu dijawab dari tabel,
   bukan dengan membandingkan dadu satu per satu:

       "three of a kind?"  ->  S(S(0,0),0) >= 3
       "full house?"       ->  S(S(0,0),0) = 3 DAN S(S(0,1),0) = 2
       "yatzee?"           ->  S(S(0,0),0) = 5

   Hitung frekuensi lebih dulu, lalu jawab semuanya dari situ. Namanya
   sekarang histogram, `Counter`, atau `GROUP BY` — dan bentuknya di sini,
   pada 1980, sudah persis sama.

   ------------------------------------------------------------------------
   HURUF YANG DIPETAKAN DENGAN BENAR

   Tiga belas kotak skor tidak muat dalam angka satu digit, jadi kotak 10-13
   diberi label A, B, C, D. Pemetaannya satu baris:

       2000 I=ASC(I$)-48 : ... : IF I>9 THEN I=I-7

   'A' = 65, 65-48 = 17, 17-7 = 10. Satu rumus untuk keempat hurufnya.

   Bandingkan dengan CRAZY8 (1986), yang menulis pemetaan yang sama sebagai
   enam baris IF terpisah dan salah menyalin salah satunya — sehingga satu
   kartu tidak pernah bisa dimainkan. Program yang lebih tua, enam tahun
   sebelumnya, memilih bentuk yang tidak bisa salah.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, dice } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Tiga belas kotak, dengan label persis seperti papan aslinya
     (baris 6850-7000). Kolom `kunci` adalah tombol yang ditekan pemain 1980. */
  const KOTAK = [
    { i: 1,  kunci: '1', nama: 'ACES',        atas: true },
    { i: 2,  kunci: '2', nama: 'TWOS',        atas: true },
    { i: 3,  kunci: '3', nama: 'THREES',      atas: true },
    { i: 4,  kunci: '4', nama: 'FOURS',       atas: true },
    { i: 5,  kunci: '5', nama: 'FIVES',       atas: true },
    { i: 6,  kunci: '6', nama: 'SIXES',       atas: true },
    { i: 7,  kunci: '7', nama: '3 OF A KIND' },
    { i: 8,  kunci: '8', nama: '4 OF A KIND' },
    { i: 9,  kunci: '9', nama: 'FULL HOUSE' },
    { i: 10, kunci: 'A', nama: 'SM STRAIGHT' },
    { i: 11, kunci: 'B', nama: 'LG STRAIGHT' },
    { i: 12, kunci: 'C', nama: 'YATZEE' },
    { i: 13, kunci: 'D', nama: 'CHANCE' }
  ];

  const db = store('yahtzee');
  let pemain, giliran, dadu, tahan, lemparan, fase;

  /* --------------------------------------------------------------------
     Penilaian — tiap cabang dari barisnya sendiri.

     Nilai balik: angka untuk skor sah, atau null kalau kotak itu HANGUS.
     Aslinya menulis hangus sebagai K(I,A) = -1 (baris 2740), dan membedakan
     -1 dari 0 penting: 0 berarti "belum dipakai", -1 berarti "sudah dipakai,
     nilainya nol". Baris 4070 melewati keduanya saat menjumlahkan, jadi
     hasilnya sama — yang berbeda cuma apa yang boleh dipilih lagi.
     -------------------------------------------------------------------- */
  function nilai(i, d, kartuLama) {
    const t = dice.tally(d);
    const urut = dice.byCount(d);          // padanan S(0,K)
    const terbanyak = urut.length ? t[urut[0]] : 0;
    const kedua = urut.length > 1 ? t[urut[1]] : 0;
    const jumlah = dice.sum(d);

    if (i <= 6) {                          // baris 2440-2460
      return t[i] ? i * t[i] : null;
    }
    switch (i) {
      case 7:  return terbanyak >= 3 ? jumlah : null;              // 2520-2530
      case 8:  return terbanyak >= 4 ? jumlah : null;              // 2540-2550
      case 9:  return (terbanyak === 3 && kedua === 2) ? 25 : null; // 2560-2570
      case 10: return smallStraight(t) ? 30 : null;                // 2580-2620
      case 11: return largeStraight(t) ? 40 : null;                // 2630-2660
      case 12:                                                     // 2670-2690
        if (terbanyak !== 5) return null;
        return kartuLama[12] > 0 ? kartuLama[12] + 100 : 50;
      case 13: return jumlah;                                      // 2700
    }
    return null;
  }

  /* Baris 2580-2600, bentuknya dipertahankan: tiga kemungkinan, masing-masing
     diperiksa dengan `>0` yang tersurat. */
  function smallStraight(t) {
    return (t[1] > 0 && t[2] > 0 && t[3] > 0 && t[4] > 0) ||
           (t[2] > 0 && t[3] > 0 && t[4] > 0 && t[5] > 0) ||
           (t[3] > 0 && t[4] > 0 && t[5] > 0 && t[6] > 0);
  }

  /* Bentuk yang BENAR untuk straight besar: kelima mata masing-masing tepat
     satu. Aslinya tidak menulisnya begini — lihat `lurusBesar1982` di bawah
     dan panel "Baris yang benar karena kebetulan". */
  function largeStraight(t) {
    const semua = (a) => a.every(v => t[v] === 1);
    return semua([1, 2, 3, 4, 5]) || semua([2, 3, 4, 5, 6]);
  }

  /* --------------------------------------------------------------------
     Bentuk aslinya, baris 2630-2640, diterjemahkan apa adanya:

         2630 IF S(1,0)AND S(2,0)AND S(3,0)AND S(4,0)AND S(5,0)= 1 THEN 2660

     Di BASIC, `=` mengikat lebih erat daripada `AND`, dan `AND` adalah
     operator BIT, bukan logika. Jadi yang benar-benar dihitung adalah:

         S(1,0) & S(2,0) & S(3,0) & S(4,0) & (S(5,0) = 1 ? -1 : 0)

     Hanya mata KELIMA yang dibandingkan dengan 1; empat sisanya cuma
     di-AND-kan bitnya. Itu jelas bukan yang dimaksud penulisnya — satu baris
     sebelumnya, untuk straight kecil, ia menulis `S(1,0)>0 AND ...` dengan
     benar. Fungsi ini dipakai panel untuk membuktikan bahwa keduanya toh
     memberi jawaban yang sama, atas seluruh 7.776 lemparan.
     -------------------------------------------------------------------- */
  function lurusBesar1982(t) {
    const B = (x) => (x ? -1 : 0);          // TRUE di BASIC = -1, semua bit
    const a = t[1] & t[2] & t[3] & t[4] & B(t[5] === 1);
    const b = t[2] & t[3] & t[4] & t[5] & B(t[6] === 1);
    return a !== 0 || b !== 0;
  }

  /** Bandingkan kedua bentuk atas SELURUH ruang lemparan, bukan atas sampel. */
  function bandingkanLurus() {
    let beda = 0, sah = 0, n = 0;
    const d = [0, 0, 0, 0, 0];
    for (d[0] = 1; d[0] <= 6; d[0]++)
    for (d[1] = 1; d[1] <= 6; d[1]++)
    for (d[2] = 1; d[2] <= 6; d[2]++)
    for (d[3] = 1; d[3] <= 6; d[3]++)
    for (d[4] = 1; d[4] <= 6; d[4]++) {
      const t = dice.tally(d);
      const benar = largeStraight(t), lama = lurusBesar1982(t);
      n++;
      if (benar) sah++;
      if (benar !== lama) beda++;
    }
    return { n, sah, beda };
  }

  /* --------------------------------------------------------------------
     Kartu skor
     -------------------------------------------------------------------- */
  function kartuBaru() {
    const k = {};
    KOTAK.forEach(b => { k[b.i] = 0; });
    return k;
  }

  const totalAtas = (k) =>
    [1, 2, 3, 4, 5, 6].reduce((t, i) => t + Math.max(k[i], 0), 0);
  /** Baris 4100: `IF K(15,A) > 62 THEN K(14,A) = 35`. */
  const bonusAtas = (k) => (totalAtas(k) > 62 ? 35 : 0);
  const totalBawah = (k) =>
    [7, 8, 9, 10, 11, 12, 13].reduce((t, i) => t + Math.max(k[i], 0), 0);
  const grandTotal = (k) => totalAtas(k) + bonusAtas(k) + totalBawah(k);

  /* DUA PREDIKAT YANG BERBEDA, dan aslinya memang membedakannya.

     "Boleh dipilih giliran ini?" — baris 2040-2050:

         2040 IF I= 12 AND K(12,A)> -1 THEN <sah>   ' YATZEE boleh berulang
         2050 IF K(I,A)= 0 THEN <sah>               ' kotak lain: sekali saja

     "Kartunya sudah penuh?" — baris 5420-5440, rutin yang sama sekali lain:

         5420 FOR K= 1 TO 13
         5430 IF K(K,J)= 0 THEN Y= 1                ' masih ada yang KOSONG
         5440 NEXT K

     Bedanya halus dan menentukan. Kotak YATZEE yang sudah berisi 50 tetap
     boleh dipilih lagi, tapi ia TIDAK lagi bernilai 0 — jadi ia tidak
     menghalangi permainan berakhir.

     Versi pertama port ini memakai satu predikat untuk keduanya, dan
     akibatnya permainan tidak pernah selesai: begitu YATZEE terisi 50, ia
     selamanya "masih bisa dipilih", jadi "sudah penuh" tidak pernah benar.
     Ketiga belas kotak terisi dan giliran terus berputar. */
  const bisaDipilih = (k, i) => (i === 12 ? k[12] >= 0 : k[i] === 0);
  const selesai = (k) => KOTAK.every(b => k[b.i] !== 0);

  /* --------------------------------------------------------------------
     Jalannya giliran
     -------------------------------------------------------------------- */
  function mulai(jml) {
    pemain = [];
    for (let i = 0; i < jml; i++) {
      pemain.push({ nama: 'PLAYER ' + (i + 1), kartu: kartuBaru() });
    }
    giliran = 0;
    $('setup').classList.add('hidden');
    $('play').classList.remove('hidden');
    bangunKartu();
    giliranBaru();
  }

  function giliranBaru() {
    if (fase === 'usai') return;             // pagar kedua, lihat `pewaktuGiliran`
    lemparan = 0;
    tahan = [false, false, false, false, false];
    dadu = [0, 0, 0, 0, 0];
    fase = 'lempar';
    gambar();
    kata(pemain[giliran].nama + ' — roll the dice.');
  }

  async function lempar() {
    if (fase === 'usai' || lemparan >= 3) return;
    fase = 'menggulir';
    const r = rng();
    const idx = dadu.map((_, i) => i).filter(i => lemparan === 0 || !tahan[i]);
    idx.forEach(i => { $('d' + i).classList.add('die--rolling'); });
    audio.play('MB T255 L64 O5 C C# D D# E F', { fresh: true });   // baris 2130
    await new Promise(r2 => setTimeout(r2, 380));
    idx.forEach(i => { dadu[i] = r.between(1, 6); });               // baris 1480
    lemparan++;
    fase = 'pilih';
    gambar();
    kata(lemparan < 3
      ? 'Hold dice, then roll again — or pick a box.'
      : 'Last roll. Pick a box.');
  }

  function toggleTahan(i) {
    if (fase !== 'pilih' || lemparan === 0) return;
    tahan[i] = !tahan[i];
    audio.sound(tahan[i] ? 660 : 380, 0.04);
    gambar();
  }

  function pilihKotak(i) {
    if (fase !== 'pilih') return;
    const k = pemain[giliran].kartu;
    if (!bisaDipilih(k, i)) {
      /* Baris 2060-2070: "NO - NO - DUMMY - - TRY AGAIN". Kalimatnya
         dipertahankan — ia bagian dari suara program ini, dan menghaluskannya
         berarti menghapus satu-satunya tempat program ini bicara kasar. */
      audio.play('MB T200 O1 F D', { fresh: true });
      return kata('NO - NO - DUMMY - - TRY AGAIN', 'bad');
    }
    const v = nilai(i, dadu, k);
    k[i] = (v === null) ? -1 : v;
    audio.play('L64 T200 N70', { fresh: true });                   // baris 2110

    if (v === null) kata('Scratched.', 'bad');
    else if (i === 12 && v > 50) kata('YATZEE again — bonus 100, box now ' + v + '.');
    else kata(v + ' points.');

    gambar();

    if (pemain.every(p => selesai(p.kartu))) return tamat();
    /* Baris 1360-1390: lewati pemain yang kartunya sudah penuh. */
    do { giliran = (giliran + 1) % pemain.length; }
    while (selesai(pemain[giliran].kartu));
    /* Pewaktunya disimpan supaya bisa DIBATALKAN. Tanpa itu, giliran yang
       sudah dijadwalkan tetap berjalan sesudah permainan usai dan menyalakan
       kembali papan yang seharusnya mati — terlihat saat menguji, karena tab
       yang tersembunyi menunda pewaktu cukup lama sampai dua kejadian itu
       bertabrakan. Jarang, tapi bukan mustahil di tangan pemain. */
    clearTimeout(pewaktuGiliran);
    pewaktuGiliran = setTimeout(giliranBaru, 700);
  }
  let pewaktuGiliran = 0;

  function tamat() {
    clearTimeout(pewaktuGiliran);
    fase = 'usai';
    const nilaiAkhir = pemain.map(p => grandTotal(p.kartu));
    const tertinggi = Math.max(...nilaiAkhir);
    const menang = pemain.filter((p, i) => nilaiAkhir[i] === tertinggi)
                         .map(p => p.nama).join(' & ');
    kata('Game over — ' + menang + ' wins with ' + tertinggi + '.');
    audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true });
    const rek = db.get('best', 0);
    if (tertinggi > rek) { db.set('best', tertinggi); ui.toast('Rekor baru: ' + tertinggi); }
    gambar();
    $('again').classList.remove('hidden');
  }

  /* --------------------------------------------------------------------
     Gambar
     -------------------------------------------------------------------- */
  let sel = {};

  function bangunKartu() {
    const tbl = $('card');
    tbl.textContent = '';
    const thead = ui.el('thead');
    const hr = ui.el('tr');
    hr.append(ui.el('th', { text: '' }));
    pemain.forEach(p => hr.append(ui.el('th', { text: p.nama })));
    thead.append(hr);
    tbl.append(thead);

    const tb = ui.el('tbody');
    sel = {};
    const barisTotal = (id, label, kelas) => {
      const tr = ui.el('tr', { class: 'y-sum ' + (kelas || '') });
      tr.append(ui.el('th', { text: label }));
      pemain.forEach((p, pi) => {
        const td = ui.el('td');
        sel[id + '-' + pi] = td;
        tr.append(td);
      });
      tb.append(tr);
    };

    KOTAK.forEach(b => {
      if (b.i === 7) barisTotal('atas', 'TOTAL UPPER', 'y-sum--rule');
      const tr = ui.el('tr');
      const th = ui.el('th');
      th.append(ui.el('span', { class: 'y-key', text: b.kunci }),
                ui.el('span', { text: b.nama }));
      tr.append(th);
      pemain.forEach((p, pi) => {
        const td = ui.el('td', { class: 'y-cell' });
        const btn = ui.el('button', { class: 'y-pick', type: 'button' });
        btn.addEventListener('click', () => { if (pi === giliran) pilihKotak(b.i); });
        td.append(btn);
        sel['k' + b.i + '-' + pi] = btn;
        tr.append(td);
      });
      tb.append(tr);
    });
    barisTotal('bonus', 'BONUS (63+)');
    barisTotal('total', 'GRAND TOTAL', 'y-sum--grand');
    tbl.append(tb);
  }

  function gambar() {
    // dadu
    const baris = $('dice');
    baris.textContent = '';
    dadu.forEach((v, i) => {
      const b = ui.el('button', {
        class: 'die-btn' + (tahan[i] ? ' die--hold' : ''),
        type: 'button', id: 'd' + i,
        title: tahan[i] ? 'ditahan' : 'klik untuk menahan'
      });
      b.append(v ? dice.el(v, { size: 54 }) : dice.el(1, { size: 54 }));
      if (!v) b.style.opacity = '.25';
      b.disabled = fase !== 'pilih' || !lemparan;
      b.addEventListener('click', () => toggleTahan(i));
      baris.append(b);
    });

    $('roll').disabled = fase === 'menggulir' || fase === 'usai' || lemparan >= 3;
    $('roll').textContent = lemparan === 0 ? 'Roll' : 'Roll again (' + (3 - lemparan) + ' left)';
    $('sRoll').textContent = lemparan + ' / 3';
    $('sWho').textContent = fase === 'usai' ? '—' : pemain[giliran].nama;
    $('sBest').textContent = db.get('best', 0);

    // kartu skor
    pemain.forEach((p, pi) => {
      const k = p.kartu;
      KOTAK.forEach(b => {
        const btn = sel['k' + b.i + '-' + pi];
        const v = k[b.i];
        const aktif = pi === giliran && fase === 'pilih' && bisaDipilih(k, b.i);
        btn.textContent = v === 0 ? '' : (v < 0 ? '—' : String(v));
        btn.className = 'y-pick'
          + (v < 0 ? ' y-pick--hangus' : '')
          + (v > 0 ? ' y-pick--isi' : '')
          + (aktif ? ' y-pick--bisa' : '');
        btn.disabled = !aktif;
        /* Sel yang bisa dipilih menampilkan nilai yang AKAN didapat kalau
           dipilih sekarang. Aslinya tidak melakukan ini — pemain 1980
           menghitungnya sendiri di kepala, lalu mengetik nomor kotaknya.
           Ini penyimpangan, dan alasannya di dokumen §4. */
        if (aktif) {
          const n = nilai(b.i, dadu, k);
          btn.textContent = n === null ? '0' : String(n);
          btn.classList.add(n === null ? 'y-pick--nol' : 'y-pick--nilai');
        }
      });
      sel['atas-' + pi].textContent = totalAtas(k);
      sel['bonus-' + pi].textContent = bonusAtas(k);
      sel['total-' + pi].textContent = grandTotal(k);
    });
  }

  function kata(t, jenis) {
    $('say').textContent = t;
    $('say').className = 'y-say' + (jenis ? ' y-say--' + jenis : '');
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Yatzee',
    source: 'YAHTZEE.BAS · Helms & Pezok / Patrick Leabo · 1980',
    backHref: '../../index.html'
  }));

  [1, 2, 3, 4, 5].forEach(n => {
    const b = ui.el('button', { class: 'btn btn--ghost', type: 'button',
                                text: n === 1 ? '1 player' : n + ' players' });
    b.addEventListener('click', () => mulai(n));
    $('players').append(b);
  });

  $('roll').addEventListener('click', lempar);
  $('again').addEventListener('click', () => {
    $('again').classList.add('hidden');
    $('play').classList.add('hidden');
    $('setup').classList.remove('hidden');
  });
  $('straightRun').addEventListener('click', () => {
    const h = bandingkanLurus();
    $('straightOut').innerHTML =
      'Diperiksa atas <b>' + h.n.toLocaleString('id-ID') + '</b> lemparan ' +
      '(seluruh 6<sup>5</sup>, bukan sampel). Straight besar yang sah: <b>' +
      h.sah + '</b>. Selisih antara bentuk 1980 dan bentuk yang benar: <b>' +
      h.beda + '</b>.' + (h.beda === 0
        ? ' Nol — barisnya <b>benar</b>, tapi bukan karena ia menanyakan hal yang benar.'
        : ' Ada selisih!');
  });
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Skor tertinggi dihapus.')) return;
    db.set('best', 0);
    if (pemain) gambar();
  });

  $('sBest').textContent = db.get('best', 0);
})();
