/* ===========================================================================
   tutor.js — Blackjack Tutor.

   BUKAN PORT, dan `games/21/` tidak disentuh sama sekali. Mejanya memakai
   mesin yang sama (`_shared/blackjack.js`) dengan objek aturan yang menyalin
   `21.BAS`, supaya aturan di sini tidak bisa melenceng dari port setianya.

   SATU BEDA YANG DISENGAJA dari port 21: kartu potong.
   Baris 150 `21.BAS` berbunyi `CD=CD+1:IF CD>40 THEN GOSUB 2070` — sepatunya
   dikocok ulang begitu 40 dari 52 kartu terpakai, diperiksa di awal tiap
   tangan. Port 21 memakai `potong: null`, yang berarti baru mengocok saat
   kelima puluh dua kartu habis. Di sini dipakai yang 40, karena seluruh
   nasihatnya dihitung dari sisa kartu dan titik kocok ulang menentukan
   seberapa jauh komposisinya boleh menyimpang.

   Perbedaan itu DILAPORKAN, bukan diam-diam diperbaiki di tempat lain.
   =========================================================================== */
(function () {
  'use strict';

  const ui = window.RETRO.ui;
  const i18n = window.RETRO.i18n;
  const BJ = window.RETRO.blackjack;
  const NS = window.RETRO.nasihatBJ;
  const store = window.RETRO.store('bjtutor');
  const $ = id => document.getElementById(id);

  /* Disalin dari games/21/21.js — kalau ini melenceng, mejanya bukan 21 lagi. */
  const ATURAN = {
    dek: 1,
    potong: [41, 41],         // baris 150: IF CD>40 -> kocok ulang
    bayarBJ: 2,               // baris 860/1770: "Dealer Pays Double"
    bandarH17: false,         // baris 670: IF CPHD>16 THEN berhenti
    asuransi: false,
    split: true, double: true,
    modal: 2000, taruhMin: 100, taruhMax: 1000, kelipatan: 100,
    bangkrutkanBandar: 10000
  };

  const TEKS = {
    seri: 'Push.', andaBangkrut: 'You Busted! Dealer Wins.',
    bandarBangkrut: 'Dealer Busted! You Win.',
    blackjackBandar: 'Dealer Has Blackjack!  You Lose.',
    andaMenang: (a, b) => 'Dealer Has ' + b + '. You Have ' + a + '. You Win.',
    bandarMenang: (a, b) => 'Dealer Has ' + b + '. You Have ' + a + '. Dealer Wins.',
    tidakCukup: 'You do not have that much money.',
    tidakCukupGanda: "You Don't Have Enough Money To Double Down",
    tidakCukupSplit: "You Don't Have Enough Money To Split Your Hand.",
    telatGanda: 'TOO LATE TO DOUBLE', takBisaSplit: 'NO SPLITS NOW',
    bukanPasangan: 'NO SPLITS NOW',
    kocokUlang: 'Reshuffling the deck.', tekanBagi: 'Place your bet, then Deal.',
    habis: 'You Have Lost  All  Of  Your Money!',
    bankPecah: 'You Broke The Bank !!!',
    blackjackAnda: 'You Have Blackjack! Dealer Pays Double.',
    selamatDatang: 'Place Your Bet Please. How Many Chips?'
  };

  /* ======================================================================
     KAMUS. Ditaruh di berkas ini, bukan di `_shared/i18n.js`, karena semua
     kalimat di bawah cuma dipakai halaman ini.
     ====================================================================== */
  const NAMA = {
    id: { hit: 'TAMBAH', stand: 'BERHENTI', ganda: 'GANDAKAN', split: 'PECAH' },
    en: { hit: 'HIT', stand: 'STAND', ganda: 'DOUBLE', split: 'SPLIT' }
  };
  const K = {
    id: {
      judul: 'Blackjack Tutor', sumber: '21.BAS · Friendlyware · 1982',
      cap: 'SARAN', capNilai: 'PENILAIAN',
      bandar: 'Bandar', anda: 'Anda',
      skor: 'Keputusan optimal', biaya: 'Ongkos kekeliruan',
      sisa: 'Sisa kartu di sepatu', hitung: 'Hitungan berjalan',
      kas: 'Modal', mkp: 'M / K / S', reset: 'Mulai ulang',
      sembunyi: 'Sembunyikan saran sampai saya memutuskan',
      cara: 'Cara kerjanya',
      tepiPlus: 'menguntungkan', tepiMinus: 'merugikan',
      benar: 'Tepat.', keliru: 'Kurang tepat.',
      hilang: (n) => 'Pilihan itu melepas ' + n + ' satuan taruhan dibanding ' ,
      seharusnya: 'Yang terbaik tadi ',
      evNama: { aksi: 'Pilihan', ev: 'Nilai harapan' },
      hampiran: 'Angka PECAH adalah hampiran: dihitung sebagai dua tangan ' +
                'bebas, tanpa pecah ulang.',
      bustBandar: (p) => 'Peluang bandar bangkrut: ' + p + '%.',
      totalAnda: (t, l) => 'Tangan Anda ' + t + (l ? ' (lunak)' : '') + '.',
      satuan: 'satuan taruhan'
    },
    en: {
      judul: 'Blackjack Tutor', sumber: '21.BAS · Friendlyware · 1982',
      cap: 'ADVICE', capNilai: 'REVIEW',
      bandar: 'Dealer', anda: 'You',
      skor: 'Optimal decisions', biaya: 'Cost of mistakes',
      sisa: 'Cards left in shoe', hitung: 'Running count',
      kas: 'Bankroll', mkp: 'W / L / P', reset: 'Restart',
      sembunyi: 'Hide advice until after I decide',
      cara: 'How this works',
      tepiPlus: 'in your favour', tepiMinus: 'against you',
      benar: 'Correct.', keliru: 'Not the best.',
      hilang: (n) => 'That choice gives up ' + n + ' betting units against ',
      seharusnya: 'The best was ',
      evNama: { aksi: 'Option', ev: 'Expected value' },
      hampiran: 'The SPLIT figure is an approximation: computed as two free ' +
                'hands, with no re-splitting.',
      bustBandar: (p) => 'Dealer bust probability: ' + p + '%.',
      totalAnda: (t, l) => 'Your hand is ' + t + (l ? ' (soft)' : '') + '.',
      satuan: 'betting units'
    }
  };
  const t = () => K[i18n.bahasa] || K.id;
  const nama = (a) => (NAMA[i18n.bahasa] || NAMA.id)[a] || a;

  /* ======================================================================
     ALASAN — kalimat berlapis.

     Lapis 1 kalimat biasa, lapis 2 angka di baliknya, lapis 3 tabel EV.
     Lapis 3 ada di tabel terpisah; dua yang pertama di sini.
     ====================================================================== */
  function alasan(s, kartuBandar) {
    const L = t();
    const up = Math.min(kartuBandar[0].v, 10);
    const bust = Math.round(NS.peluangBust(s.sebaran) * 100);
    const v = s.nilaiTangan;
    const a = s.terbaik.aksi;
    const kedua = s.pilihan[1];
    const selisih = kedua ? (s.terbaik.ev - kedua.ev) : 0;

    const bagian = [];
    bagian.push(L.totalAnda(v.total, v.lunak));
    bagian.push(L.bustBandar(bust));

    if (i18n.bahasa === 'en') {
      if (a === 'stand')
        bagian.push(bust >= 35
          ? 'The dealer is likely to break, so let them. Drawing only risks your own hand.'
          : 'Drawing is more likely to break you than to improve you.');
      if (a === 'hit')
        bagian.push(v.total <= 11
          ? 'You cannot break with one card, so there is nothing to lose by drawing.'
          : 'Standing here loses more often than the risk of breaking costs.');
      if (a === 'ganda')
        bagian.push('A strong start against a weak upcard: the extra bet is worth more than the loss of further draws.');
      if (a === 'split')
        bagian.push('As one hand this is weak; as two hands each card starts something better.');
      if (kedua) bagian.push('It beats ' + nama(kedua.aksi) + ' by ' +
                             selisih.toFixed(3) + ' ' + L.satuan + '.');
    } else {
      if (a === 'stand')
        bagian.push(bust >= 35
          ? 'Bandar besar kemungkinan bangkrut sendiri — biarkan. Menambah kartu hanya mempertaruhkan tangan Anda.'
          : 'Menambah kartu lebih sering membuat Anda bangkrut daripada memperbaiki tangan.');
      if (a === 'hit')
        bagian.push(v.total <= 11
          ? 'Dengan satu kartu Anda tidak mungkin bangkrut, jadi tidak ada yang dipertaruhkan.'
          : 'Berhenti di sini lebih sering kalah daripada ongkos risiko bangkrutnya.');
      if (a === 'ganda')
        bagian.push('Awal yang kuat melawan kartu buka yang lemah: tambahan taruhan lebih berharga daripada kehilangan kesempatan menambah kartu lagi.');
      if (a === 'split')
        bagian.push('Sebagai satu tangan ini lemah; sebagai dua tangan, tiap kartu memulai sesuatu yang lebih baik.');
      if (kedua) bagian.push('Ia unggul ' + selisih.toFixed(3) + ' ' + L.satuan +
                             ' atas ' + nama(kedua.aksi) + '.');
    }
    return bagian.join(' ');
  }

  /* ======================================================================
     Keadaan penilaian
     ====================================================================== */
  let meja = null;
  let saranKini = null;      // saran untuk keputusan yang sedang menunggu
  let benar = 0, total = 0, ongkos = 0;
  let hitung = 0;            // hitungan berjalan Hi-Lo
  let terlihatSebelumnya = 0;

  /* ======================================================================
     APA YANG BELUM TERLIHAT PEMAIN

     Dua koreksi, dan keduanya cacat yang sempat ada di sini:

     1. `meja.bandarKartu` memuat KARTU TERTUTUP juga. Memberikannya ke mesin
        hitung membuat penasihatnya mengintip — dan hasilnya langsung
        kelihatan mustahil: "peluang bandar bangkrut 0%" dengan nilai harapan
        BERHENTI tepat -1,000, karena total bandar sudah pasti diketahui.
        Yang boleh dilihat cuma kartu buka.

     2. Kartu tertutup itu SUDAH keluar dari dek, jadi `dek.komposisi` tidak
        memuatnya lagi. Tapi bagi pemain ia masih tidak diketahui — jadi ia
        harus DIKEMBALIKAN ke kumpulan yang belum terlihat. Kalau tidak,
        peluangnya dihitung atas dek yang salah.
     ====================================================================== */
  function kartuBuka() { return meja.bandarKartu.slice(0, 1); }

  function komposisiSisa() {
    const k = Object.assign({}, meja.dek.komposisi);
    meja.bandarKartu.slice(1).forEach(c => {
      const v = Math.min(c.v, 10);
      k[v] = (k[v] | 0) + 1;
    });
    return k;
  }

  function hitungUlangHiLo() {
    /* Hi-Lo dari kartu yang SUDAH keluar = 52 dikurangi sisa. */
    const sisa = komposisiSisa();
    let c = 0;
    const penuh = { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 16 };
    for (let v = 1; v <= 10; v++) {
      const keluar = (penuh[v] | 0) - (sisa[v] | 0);
      if (v >= 2 && v <= 6) c += keluar;
      else if (v === 10 || v === 1) c -= keluar;
    }
    hitung = c;
  }

  function bisaGanda() {
    const h = meja.tangan[meja.tanganAktif];
    return meja.aturan.double && h && h.kartu.length === 2;
  }
  function bisaSplit() {
    const h = meja.tangan[meja.tanganAktif];
    return meja.aturan.split && meja.tangan.length === 1 && h &&
           h.kartu.length === 2 &&
           Math.min(h.kartu[0].v, 10) === Math.min(h.kartu[1].v, 10);
  }

  function perbarui() {
    const L = t();
    hitungUlangHiLo();
    $('btHitung').textContent = (hitung > 0 ? '+' : '') + hitung;
    $('btSkor').textContent = benar + ' / ' + total;
    $('btBiaya').textContent = ongkos.toFixed(2);

    if (meja.fase !== 'main') { $('btNasihat').hidden = true; saranKini = null; return; }

    const h = meja.tangan[meja.tanganAktif];
    if (!h) { $('btNasihat').hidden = true; return; }

    saranKini = NS.saran({
      kartu: h.kartu, kartuBandar: kartuBuka(),
      komposisi: komposisiSisa(), aturan: meja.aturan,
      bolehGanda: bisaGanda(), bolehSplit: bisaSplit()
    });

    const sembunyi = $('btSembunyi').checked;
    $('btNasihat').hidden = sembunyi;
    if (sembunyi) return;

    $('btCap').textContent = L.cap;
    $('btAksi').textContent = nama(saranKini.terbaik.aksi);
    const ev = saranKini.terbaik.ev;
    $('btTepi').textContent = (ev >= 0 ? '+' : '') + ev.toFixed(3) +
                              ' · ' + (ev >= 0 ? L.tepiPlus : L.tepiMinus);
    $('btTepi').className = 'bt-tepi ' + (ev >= 0 ? 'bt-plus' : 'bt-minus');
    $('btAlasan').textContent = alasan(saranKini, kartuBuka());

    const baris = ['<tr><th>' + L.evNama.aksi + '</th><th>' + L.evNama.ev +
                   '</th></tr>'];
    saranKini.pilihan.forEach((p, i) => {
      baris.push('<tr class="' + (i === 0 ? 'bt-baik' : '') + '"><td>' +
                 nama(p.aksi) + (p.hampiran ? ' *' : '') + '</td><td class="mono">' +
                 (p.ev >= 0 ? '+' : '') + p.ev.toFixed(3) + '</td></tr>');
    });
    $('btEv').innerHTML = baris.join('');
    $('btHampiran').hidden = !saranKini.pilihan.some(p => p.hampiran);
    $('btHampiran').textContent = '* ' + L.hampiran;
  }

  /** Dipanggil TEPAT SEBELUM aksi pemain dijalankan. */
  function nilaiKeputusan(aksi) {
    if (!saranKini) return;
    const L = t();
    const dipilih = saranKini.pilihan.find(p => p.aksi === aksi);
    if (!dipilih) return;
    total++;
    const rugi = saranKini.terbaik.ev - dipilih.ev;
    const tepat = rugi < 1e-9;
    if (tepat) benar++; else ongkos += rugi;

    $('btNilai').hidden = false;
    $('btNilaiCap').textContent = L.capNilai;
    $('btNilaiAksi').textContent = nama(aksi);
    $('btNilaiAksi').className = 'bt-aksi ' + (tepat ? 'bt-plus' : 'bt-minus');
    $('btNilaiAlasan').textContent = tepat
      ? L.benar + ' ' + alasan(saranKini, kartuBuka())
      : L.keliru + ' ' + L.hilang(rugi.toFixed(3)) + nama(saranKini.terbaik.aksi) +
        '. ' + alasan(saranKini, kartuBuka());
    saranKini = null;
  }

  /* ======================================================================
     Pasang
     ====================================================================== */
  function pasangTeks() {
    const L = t();
    $('lblBandar').textContent = L.bandar;
    $('lblAnda').textContent = L.anda;
    $('lblSkor').textContent = L.skor;
    $('lblBiaya').textContent = L.biaya;
    $('lblSisa').textContent = L.sisa;
    $('lblHitung').textContent = L.hitung;
    $('lblKas').textContent = L.kas;
    $('lblMKS').textContent = L.mkp;
    $('lblSembunyi').textContent = L.sembunyi;
    $('lblCara').textContent = L.cara;
    $('btReset').textContent = L.reset;
    document.title = L.judul + ' — Classic DOS BASIC Games';
    $('btCara').innerHTML = i18n.bahasa === 'en' ? CARA_EN : CARA_ID;
    $('btPanel').innerHTML = i18n.bahasa === 'en' ? PANEL_EN : PANEL_ID;
  }

  const CARA_ID = '<p class="bt-catatan">Mejanya <b>persis 21.BAS</b>: satu dek,' +
    ' blackjack dibayar <b>dua kali lipat</b>, bandar berhenti di 17 lunak,' +
    ' tanpa asuransi, dan dikocok ulang begitu 40 kartu terpakai.</p>' +
    '<ol class="howto__steps"><li>Sebelum Anda menekan tombol, panel <b>SARAN</b>' +
    ' menyebutkan pilihan terbaik, alasannya, dan nilai harapan tiap pilihan.</li>' +
    '<li>Sesudah Anda menekan, panel <b>PENILAIAN</b> mengatakan apakah pilihan Anda' +
    ' tepat — dan kalau tidak, berapa satuan taruhan yang terlepas.</li>' +
    '<li>Semua angka dihitung dari <b>kartu yang masih tersisa</b>, bukan dari dek' +
    ' baru. Itu sebabnya sarannya bisa berubah di akhir sepatu.</li></ol>';
  const CARA_EN = '<p class="bt-catatan">The table is <b>exactly 21.BAS</b>: one deck,' +
    ' blackjack pays <b>double</b>, dealer stands on soft 17, no insurance,' +
    ' and it reshuffles once 40 cards are used.</p>' +
    '<ol class="howto__steps"><li>Before you press anything, the <b>ADVICE</b> panel' +
    ' names the best option, the reasoning, and the expected value of each option.</li>' +
    '<li>After you press, the <b>REVIEW</b> panel says whether your choice was right —' +
    ' and if not, how many betting units it gave up.</li>' +
    '<li>Every number is computed from the <b>cards still left</b>, not from a fresh' +
    ' deck. That is why the advice can change late in the shoe.</li></ol>';

  const PANEL_ID = '<section class="panel"><h2 class="panel__title">Kenapa dihitung, ' +
    'bukan disalin dari tabel</h2><p class="bt-catatan">Tabel <i>basic strategy</i> ' +
    'yang beredar disusun untuk meja kasino: blackjack 3:2, banyak dek. ' +
    '<b>21.BAS bukan meja itu</b> — blackjack dibayar 2:1 (baris 860/1770), satu ' +
    'dek, tanpa asuransi. Menempelkan tabel kanonik ke sini akan memberi saran ' +
    'yang salah dengan percaya diri.</p><p class="bt-catatan">Satu cacat di mesin ' +
    'ini sempat membuktikannya: sebelum baris 230–240 diperhitungkan — bandar ' +
    'ber-blackjack menang seketika, <b>sebelum</b> pemain sempat bertindak — ' +
    'PECAH 8,8 lawan 10 keluar sebagai pilihan terburuk, padahal setiap tabel ' +
    'mengatakan selalu pecah. Mesin hitung yang keliru tidak memberi galat; ia ' +
    'memberi nasihat buruk dengan angka di belakangnya.</p></section>' +
    '<p class="bt-catatan"><a href="../../docs/blackjack-tutor.md">Catatan lengkap ' +
    'halaman ini</a> &middot; <a href="../21/index.html">Port setia 21.BAS</a> ' +
    '&middot; <a href="../../docs/blackjack.md">Empat blackjack dibandingkan</a> ' +
    '&middot; <a href="../../../reviews/21.md">Analisis BASIC aslinya</a></p>';
  const PANEL_EN = '<section class="panel"><h2 class="panel__title">Why it is computed, ' +
    'not copied from a chart</h2><p class="bt-catatan">The <i>basic strategy</i> charts ' +
    'everyone quotes are built for casino tables: blackjack 3:2, many decks. ' +
    '<b>21.BAS is not that table</b> — blackjack pays 2:1 (lines 860/1770), one deck, ' +
    'no insurance. Pasting a canonical chart here would give wrong advice, ' +
    'confidently.</p><p class="bt-catatan">A defect in this engine proved it: before ' +
    'lines 230–240 were accounted for — a dealer blackjack wins instantly, ' +
    '<b>before</b> the player may act — SPLIT 8,8 against a 10 came out as the worst ' +
    'option, though every chart says always split. A wrong engine does not raise an ' +
    'error; it gives bad advice with numbers behind it.</p></section>' +
    '<p class="bt-catatan"><a href="../../docs/blackjack-tutor.md">Full notes on ' +
    'this page</a> &middot; <a href="../21/index.html">The faithful 21.BAS port</a> ' +
    '&middot; <a href="../../docs/blackjack.md">Four blackjacks compared</a> ' +
    '&middot; <a href="../../../reviews/21.md">The original BASIC analysis</a></p>';

  function bangun() {
    $('topbar-host').textContent = '';
    $('topbar-host').append(ui.topbar({ title: t().judul, source: t().sumber }));

    meja = BJ.meja({
      aturan: ATURAN, teks: TEKS,
      rng: window.RETRO.rng(window.RETRO.freshSeed()),
      audio: window.RETRO.audio
    });

    /* Aksi pemain: dinilai DULU, baru dijalankan. */
    const bungkus = (id, jalan, aksi) => {
      const b = $(id);
      if (!b) return;
      const salinan = b.cloneNode(true);      /* buang penangan lama */
      b.parentNode.replaceChild(salinan, b);
      salinan.addEventListener('click', () => {
        if (aksi) nilaiKeputusan(aksi);
        jalan();
        perbarui();
      });
    };
    bungkus('bjBagi', () => { $('btNilai').hidden = true; meja.bagi(); }, null);
    bungkus('bjHit', () => meja.hit(), 'hit');
    bungkus('bjStand', () => meja.stand(), 'stand');
    bungkus('bjGanda', () => meja.ganda(), 'ganda');
    bungkus('bjSplit', () => meja.split(), 'split');
    bungkus('bjLagi', () => { $('btNilai').hidden = true; meja.lagi(); }, null);
    bungkus('bjTaruhNaik', () => meja.ubahTaruh(+1), null);
    bungkus('bjTaruhTurun', () => meja.ubahTaruh(-1), null);

    meja.mulai();
    perbarui();
  }

  $('btSembunyi').addEventListener('change', perbarui);
  $('btReset').addEventListener('click', () => {
    benar = 0; total = 0; ongkos = 0;
    $('btNilai').hidden = true;
    bangun();
  });

  pasangTeks();
  bangun();
  i18n.onGanti(() => { pasangTeks(); perbarui(); });

  window.RETRO.BJTUTOR = { get meja() { return meja; }, NS, ATURAN,
                           get skor() { return { benar, total, ongkos }; } };
})();
