/* ===========================================================================
   wildcat.js — port WILDCAT.BAS (A. Vanchura, 17 Juli 1982)

   Anda pemilik perusahaan pengeboran minyak. Modal pinjaman $1.000.000,
   sepuluh sumur, peta Boom County 10x10.

   Tiga hal yang membentuk berkas ini:

   1. PELUANGNYA TIDAK BERGANTUNG PADA KEDALAMAN YANG ANDA PILIH. `PAYOFF =
      HIT(TYPE, TRY)` dengan TRY acak 1..40 -- TYPE ditentukan situsnya, bukan
      angka yang Anda ketik. Petunjuk di baris 2500 berkata "makin dalam makin
      kecil peluangnya", dan itu benar untuk JENIS ZONA, bukan untuk kedalaman
      di dalam zona.

   2. PETUNJUKNYA MENGARAHKAN KE PILIHAN TERBURUK. Zona dangkal memang paling
      sering berhasil (75%), tapi nilai harapannya $96 ribu; zona dalam kering
      75% tapi nilai harapannya $499 ribu. Dan zona TENGAH lebih buruk daripada
      dangkal di kedua sisi -- lebih mahal, laba harapan lebih kecil.

   3. SEPERTIGA TABEL DATA-NYA TIDAK PERNAH BISA DIBACA. Lihat dokumen.
   =========================================================================== */
(function () {
  'use strict';

  const D = window.RETRO.WILDCAT;
  const ui = window.RETRO.ui;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('wildcat');
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const q = (id) => document.getElementById(id);
  const uang = (v) => (v < 0 ? '-$' : '$') +
    Math.abs(Math.round(v)).toLocaleString('en-US');

  /* ======================================================================
     Bagian 1 — keadaan (nama dari aslinya)
     ====================================================================== */
  let CSH = 1000000, CHS = 0, OOM = false;
  let MAP = [], WELL = [], YRN = [];
  let C = 0, TYPE = 0, SZN = 0, EZN = 0, DT = 0, CSF = 0, Dcoba = 0;
  let FRC = 0, OPN = 0, OPD = 0, GSP = 0;
  let benih = 1982, rnd = null, fase = 'awal';
  const RND = () => rnd();
  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };

  /* ======================================================================
     Bagian 2 — peta, baris 2030-2070
     Perhatikan `FOR C=0 TO 100`: 101 situs dibuat, padahal A0..J9 hanya
     memberi 0..99. Satu situs dibangkitkan tiap permainan lalu tidak pernah
     bisa dipilih siapa pun. Dipertahankan supaya urutan RND-nya sama.
     ====================================================================== */
  function bikinPeta() {
    MAP = [];
    for (let c = 0; c <= 100; c++) {
      if (RND() < 0.6) { MAP[c] = { ada: false, tipe: 0 }; continue; }
      if (RND() < 0.4) { MAP[c] = { ada: true, tipe: 1 }; continue; }
      if (RND() < 0.6) { MAP[c] = { ada: true, tipe: 2 }; continue; }
      MAP[c] = { ada: true, tipe: 3 };
    }
    MAP.forEach(m => { m.bor = false; });
  }

  /* ======================================================================
     Bagian 3 — gambar
     ====================================================================== */
  const svg = q('svg');
  const gPeta = mkn('g', {}), gSumur = mkn('g', {});
  svg.append(gPeta, gSumur);

  const KOL = 10, SELW = 62, SELH = 34, MX = 62, MY = 74;

  function gambarPeta() {
    gSumur.textContent = ''; gPeta.textContent = '';
    gPeta.append(mkn('rect', { class: 'w-latar', x: 0, y: 0, width: 760, height: 470 }));
    const j = mkn('text', { class: 'w-judul', x: 380, y: 40 });
    j.textContent = 'B O O M   C O U N T Y   U S A';
    gPeta.append(j);

    for (let r = 0; r < 10; r++) for (let k = 0; k < 10; k++) {
      const c = r * 10 + k, m = MAP[c];
      const x = MX + k * SELW, y = MY + r * SELH;
      const g = mkn('g', { class: 'w-sel' + (m.ada && !m.bor ? ' w-sel--ada' : '') });
      g.append(mkn('rect', { class: 'w-kotak', x: x, y: y, width: SELW, height: SELH }));
      if (m.bor) {
        /* Situs yang sudah dibor ditandai menara kecil. */
        g.append(mkn('path', { class: 'w-menaraKecil',
          d: 'M' + (x + SELW / 2 - 8) + ' ' + (y + SELH - 7) +
             ' L' + (x + SELW / 2) + ' ' + (y + 7) +
             ' L' + (x + SELW / 2 + 8) + ' ' + (y + SELH - 7) + ' Z' }));
        g.append(mkn('circle', { class: 'w-tandaHasil w-tandaHasil--' + (m.hasil || 'kering'),
          cx: x + SELW / 2, cy: y + SELH / 2 + 4, r: 5 }));
      } else if (m.ada) {
        const t = mkn('text', { class: 'w-label', x: x + SELW / 2, y: y + SELH / 2 + 5 });
        t.textContent = D.HURUF[r] + k;
        g.append(t);
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', 'Bor di ' + D.HURUF[r] + k);
        const pilih = () => pilihSitus(c);
        g.addEventListener('click', pilih);
        g.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pilih(); }
        });
      }
      gPeta.append(g);
    }
    const kas = mkn('text', { class: 'w-kas', x: 380, y: 448 });
    kas.textContent = 'Cash Assets   ' + uang(CSH);
    gPeta.append(kas);
    perbaruiHud();
  }

  /* Penampang tegak: permukaan, tiga lapisan zona, menara, dan mata bor.
     Ini tambahan port -- aslinya menara digambar sebagai seni aksara di
     tengah layar tanpa satu pun angka kedalaman yang terlihat sebagai
     gambar. Skala 1 piksel = 40 kaki, jadi 15.000 kaki muat di 375. */
  const KAKI = (ft) => 96 + ft / 40;
  function gambarSumur(kedalaman, kena) {
    gPeta.textContent = ''; gSumur.textContent = '';
    gSumur.append(mkn('rect', { class: 'w-langit', x: 0, y: 0, width: 760, height: 96 }));
    gSumur.append(mkn('rect', { class: 'w-tanah', x: 0, y: 96, width: 760, height: 374 }));
    /* Lapisan zona digambar SESUDAH tanah, bukan sebelum — kalau tidak ia
       tertimbun tanahnya sendiri. */
    D.ZONA.forEach((z, i) => gSumur.append(mkn('rect', {
      class: 'w-zona w-zona--' + (i + 1), x: 0, y: KAKI(z.szn),
      width: 760, height: (z.ezn - z.szn) / 40
    })));
    D.ZONA.forEach((z, i) => {
      const t = mkn('text', { class: 'w-zonaNama', x: 752, y: KAKI(z.szn) + 15 });
      t.textContent = ['SHALLOW', 'MEDIUM', 'DEEP'][i] + ' ' +
        z.szn.toLocaleString('en-US') + '-' + z.ezn.toLocaleString('en-US') + ' ft';
      gSumur.append(t);
    });
    /* menara bor */
    const X = 250;
    const m = mkn('g', { class: 'w-menara', transform: 'translate(' + X + ' 96)' });
    m.append(mkn('path', { class: 'w-rangka', d: 'M-34 0 L-11 -80 L11 -80 L34 0' }));
    for (let i = 1; i < 6; i++) {
      const t = i / 6, y = -80 * t, w2 = 34 - 23 * t;
      m.append(mkn('line', { class: 'w-silang', x1: -w2, y1: y, x2: w2, y2: y }));
    }
    m.append(mkn('path', { class: 'w-silang', d: 'M-34 0 L34 -80 M34 0 L-34 -80' }));
    m.append(mkn('rect', { class: 'w-lantai', x: -44, y: 0, width: 88, height: 8 }));
    gSumur.append(m);
    /* lubang bor */
    gSumur.append(mkn('rect', { class: 'w-lubang', x: X - 4, y: 96, width: 8,
      height: Math.max(0, KAKI(kedalaman) - 96) }));
    gSumur.append(mkn('path', { class: 'w-mata',
      d: 'M' + (X - 9) + ' ' + KAKI(kedalaman) + ' L' + (X + 9) + ' ' + KAKI(kedalaman) +
         ' L' + X + ' ' + (KAKI(kedalaman) + 16) + ' Z' }));
    const lbl = mkn('text', { class: 'w-kedalaman', x: X + 20, y: KAKI(kedalaman) + 6 });
    lbl.textContent = Math.round(kedalaman).toLocaleString('en-US') + ' ft';
    gSumur.append(lbl);
    if (kena) {
      for (let i = 0; i < 12; i++)
        gSumur.append(mkn('circle', { class: 'w-semburan',
          cx: X + (i % 2 ? 1 : -1) * (4 + i * 2), cy: 90 - i * 7, r: 5 + i * 0.8,
          style: '--d:' + (i * 0.05).toFixed(2) + 's' }));
    }
    /* skala kaki */
    for (let ft = 0; ft <= 15000; ft += 2500) {
      gSumur.append(mkn('line', { class: 'w-skala', x1: 0, y1: KAKI(ft), x2: 22, y2: KAKI(ft) }));
      const t = mkn('text', { class: 'w-skalaTeks', x: 26, y: KAKI(ft) + 4 });
      t.textContent = ft.toLocaleString('en-US'); gSumur.append(t);
    }
  }

  /* ======================================================================
     Bagian 4 — panel keputusan
     ====================================================================== */
  const panel = q('panel');
  function tanya(judul, isi, catatan) {
    panel.textContent = '';
    if (judul) {
      const h = document.createElement('p');
      h.className = 'w-tanya'; h.innerHTML = judul; panel.append(h);
    }
    const row = document.createElement('div');
    row.className = 'w-row';
    isi.forEach(n => row.append(n));
    panel.append(row);
    if (catatan) {
      const p = document.createElement('p');
      p.className = 'w-catatan'; p.innerHTML = catatan; panel.append(p);
    }
  }
  const tombol = (teks, fn, kelas) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn ' + (kelas || 'btn--ghost btn--sm');
    b.textContent = teks; b.addEventListener('click', fn); return b;
  };

  function tulis(s, kelas) {
    const p = document.createElement('p');
    p.className = 'w-baris' + (kelas ? ' w-' + kelas : '');
    p.textContent = s;
    q('log').append(p);
    q('log').scrollTop = q('log').scrollHeight;
  }

  /* ======================================================================
     Bagian 5 — alur
     ====================================================================== */
  function mulai() {
    rnd = acak(benih);
    CSH = 1000000; CHS = 0; OOM = false;
    WELL = []; YRN = [];
    q('log').textContent = '';
    bikinPeta();
    tulis('WILDCATTER — Boom County, USA', 'judul');
    tulis('We have loaned you $1,000,000 to begin exploration. Ten wells.');
    gambarPeta();
    fase = 'peta';
    tanya('Please Pick A Drill Site.', [],
      'Hanya petak <b>bernama</b> yang bisa dibor. Enam puluh persen peta ' +
      'sengaja kosong (baris 2030) dan namanya tidak dicetak sama sekali &mdash; ' +
      'jadi peta ini <b>sudah</b> laporan geologi pertama Anda.');
  }

  /* Baris 1590-1710 */
  function pilihSitus(c) {
    if (fase !== 'peta') return;
    C = c; TYPE = MAP[c].tipe;
    SZN = D.ZONA[TYPE - 1].szn; EZN = D.ZONA[TYPE - 1].ezn;
    fase = 'geologi';
    gambarSumur(0, false);
    tanya('GEOLOGY REPORT &mdash; ' + D.HURUF[Math.floor(c / 10)] + (c % 10),
      [tombol('Bor', mulaiBor, 'btn--primary btn--sm'),
       tombol('Batal', () => { fase = 'peta'; gambarPeta(); mulai_lagi_panel(); })],
      'Potential Pay Zone: <b>' + SZN.toLocaleString('en-US') + ' &ndash; ' +
      EZN.toLocaleString('en-US') + ' ft</b> &middot; Target Zone Starts At <b>' +
      (SZN + 500).toLocaleString('en-US') + ' ft</b>.<br>' +
      'Biaya bor $30/ft, rekah $10/ft. Peluang dan hasilnya ditentukan ' +
      '<b>jenis zona ini</b>, bukan angka kedalaman yang Anda ketik nanti &mdash; ' +
      'lihat panel di sebelah.');
  }
  const mulai_lagi_panel = () => tanya('Please Pick A Drill Site.', []);

  /* Baris 480-560 */
  function mulaiBor() {
    MAP[C].bor = true;
    CSF = SZN * 30;                 // baris 480 — dibayar SZN kaki…
    DT = SZN + 500;                 // …tapi sampai di SZN+500 kaki
    if (CSH - CSF < 0) { OOM = true; YRN[CHS + 1] = -CSH; return akhir(); }
    Dcoba = 1; CHS += 1;
    tulis('Well #' + CHS + ' at ' + D.HURUF[Math.floor(C / 10)] + (C % 10) +
          ' — drilling to ' + DT.toLocaleString('en-US') + ' ft', 'judul');
    uji();
  }

  /* Baris 560-620 */
  function uji() {
    Dcoba += 1;
    const TRY = Math.floor(RND() * 40) + 1;
    const PAYOFF = D.HIT[TYPE - 1][TRY - 1];
    gambarSumur(DT, PAYOFF > 1);
    perbaruiHud();
    if (PAYOFF > 1) return adaTanda(PAYOFF);
    tulis('No Show At ' + Math.round(DT).toLocaleString('en-US') + ' Feet.', 'awas');
    if (Dcoba >= 3) {
      tulis('You Must Try A New Well Sight', 'awas');
      YRN[CHS] = -CSF;
      OPD = 0; GSP = 0; FRC = 0; OPN = 0;
      return laporan();
    }
    tanyaLebihDalam();
  }

  /* Baris 660-920 */
  function tanyaLebihDalam() {
    fase = 'dalam';
    const inp = document.createElement('input');
    inp.type = 'number'; inp.className = 'w-angka';
    inp.min = DT; inp.max = EZN; inp.step = 100; inp.value = Math.min(EZN, DT + 500);
    tanya('Do You Wish To Go Deeper? Enter New Test Depth:',
      [inp,
       tombol('Bor lebih dalam', () => {
         const DPT = Number(inp.value);
         if (DPT < DT) { tulis('You Must Go Deeper', 'awas'); return; }
         if (DPT > EZN) { tulis('You Are Past The Pay Zone', 'awas'); return; }
         CSF = CSF + 30 * (DPT - DT);       // baris 920
         DT = DPT;
         uji();
       }, 'btn--primary btn--sm'),
       tombol('Berhenti di sini', () => {
         YRN[CHS] = -CSF; OPD = 0; GSP = 0; FRC = 0; OPN = 0; laporan();
       })],
      'Baris 850 menguji <code>DPT &gt;= DT</code> &mdash; <b>sama besar pun ' +
      'diterima</b>. Mengetik kedalaman yang sama persis membuat ' +
      '<code>CSF+30*(DPT-DT)</code> menambah <b>nol</b> dolar, lalu baris 570 ' +
      'mengundi <code>TRY</code> yang baru. Undian gratis, dan tidak ada aturan ' +
      'lain yang bergantung pada kedalaman.');
  }

  /* Baris 930-1170 */
  function adaTanda(PAYOFF) {
    fase = 'rekah';
    FRC = 10 * DT;
    tulis('Oil And GAS Show At ' + Math.round(DT).toLocaleString('en-US') + ' Feet', 'baik');
    tanya('Fracture Cost Is <b>' + uang(FRC) + '</b>. Do You Want To Fracture?',
      [tombol('Rekah', () => rekah(PAYOFF), 'btn--primary btn--sm'),
       tombol('Tidak', () => {
         YRN[CHS] = -CSF; OPD = 0; GSP = 0; FRC = 0; OPN = 0; laporan();
       })],
      'Menolak merekah membuang seluruh biaya bor tanpa hasil apa pun ' +
      '(baris 1000 melompat ke 680). Rekah $10 per kaki kedalaman.');
  }

  /* Baris 1010-1150 */
  function rekah(PAYOFF) {
    /* Indeks GANJIL 1,3,…,19: satu larik datar dibaca sebagai tabel dua kolom. */
    const HIT = Math.floor(Math.floor(RND() * 10) * 2) + 1;
    const tabel = D.PAY[TYPE - 1][PAYOFF - 1];
    OPD = tabel[HIT - 1];
    GSP = tabel[HIT] * 1000;
    OPN = (Math.floor(RND() * 75) + 150) * 12;
    gambarSumur(DT, true);
    tulis('!!  EUREKA,  WE  STRUCK  OIL  !!', 'baik');
    tulis('Well Will Produce ' + OPD + ' Barrels Of Oil Per Day');
    tulis(GSP.toLocaleString('en-US') + ' Cubic Feet Of Natural Gas Per Day');
    laporan();
  }

  /* Baris 1180-1580 */
  function laporan() {
    fase = 'laporan';
    const TOTALCOST = OPN + FRC + CSF;
    const ODS = OPD * 9000, GDS = GSP * 2.1;
    const GRDS = ODS + GDS;
    const RVS = GRDS * 5;
    WELL[CHS] = RVS;
    const NTP = GRDS - TOTALCOST;
    CSH = CSH + NTP;
    YRN[CHS] = NTP;
    const b = (a, v, kelas) =>
      '<tr class="' + (kelas || '') + '"><td>' + a + '</td><td>' + uang(v) + '</td></tr>';
    let add = 0; for (let a = 1; a <= CHS; a++) add += (WELL[a] || 0);
    panel.textContent = '';
    const d = document.createElement('div');
    d.innerHTML =
      '<p class="w-tanya">***** INCOME STATEMENT ***** &mdash; Well #' + CHS + '</p>' +
      '<table class="w-tbl"><tbody>' +
      b('Drilling', CSF) + b('Fracture', FRC) + b('1 YR. OPER.', OPN) +
      b('Total Cost', TOTALCOST, 'w-garis') +
      b('Oil', ODS) + b('Gas', GDS) +
      b('Total Income', GRDS, 'w-garis') +
      b('Net Profit', NTP, 'w-tebal' + (NTP < 0 ? ' w-rugi' : ' w-untung')) +
      b('Estimated Reserves In Ground', RVS) +
      b('Total Reserves So Far', add) +
      '</tbody></table>';
    panel.append(d);
    const row = document.createElement('div');
    row.className = 'w-row';
    row.append(tombol(CHS >= 10 || CSH <= 0 ? 'Final statement' : 'Peta Boom County',
      () => {
        if (CHS >= 10 || CSH <= 0) return akhir();
        MAP[C].hasil = NTP > 0 ? 'untung' : (OPD || GSP ? 'impas' : 'kering');
        fase = 'peta'; gambarPeta(); mulai_lagi_panel();
      }, 'btn--primary btn--sm'));
    panel.append(row);
    MAP[C].hasil = NTP > 0 ? 'untung' : (OPD || GSP ? 'impas' : 'kering');
    tulis('Net profit well #' + CHS + ': ' + uang(NTP) +
          '  ·  cash ' + uang(CSH), NTP > 0 ? 'baik' : 'awas');
    perbaruiHud();
  }

  /* Baris 2750-2960 */
  function akhir() {
    fase = 'selesai';
    let tot = 0; for (let a = 1; a <= 10; a++) tot += (WELL[a] || 0);
    let baris = '';
    for (let a = 1; a <= 10; a++)
      baris += '<tr><td>' + a + '</td><td>' + uang(YRN[a] || 0) +
               '</td><td>' + uang(WELL[a] || 0) + '</td></tr>';
    panel.textContent = '';
    const d = document.createElement('div');
    d.innerHTML =
      '<p class="w-tanya">***** FINAL  STATEMENT *****</p>' +
      '<table class="w-tbl w-tbl--3"><thead><tr><th>Well #</th>' +
      '<th>1st Year Earnings</th><th>Reserves</th></tr></thead><tbody>' + baris +
      '<tr class="w-garis w-tebal"><td></td><td>' +
      uang(OOM ? -1000000 : CSH - 1000000) + '</td><td>' + uang(tot) + '</td></tr>' +
      '</tbody></table>' +
      (OOM ? '<p class="w-catatan w-rugi">You Ran Out Of Money At ' +
             Math.round(CSH / 30).toLocaleString('en-US') + ' Feet.<br>' +
             'You Have 30 Days To Repay Your Loan.<br>' +
             'Personal Checks Are Not Accepted !!</p>' : '');
    panel.append(d);
    const row = document.createElement('div');
    row.className = 'w-row';
    row.append(tombol('Main lagi', mulai, 'btn--primary btn--sm'));
    panel.append(row);
    const rekor = store.get('rekor');
    const laba = OOM ? -1000000 : CSH - 1000000;
    if (typeof rekor !== 'number' || laba > rekor) store.set('rekor', laba);
    perbaruiHud();
    audio.play(laba > 0 ? 'T140L8O3CEGO4CEGL2C' : 'T90L8O3GEDL2C');
  }

  /* ======================================================================
     Bagian 6 — papan angka
     ====================================================================== */
  function perbaruiHud() {
    q('s-kas').textContent = uang(CSH);
    q('s-sumur').textContent = CHS + ' / 10';
    q('s-tipe').textContent = TYPE ? ['dangkal', 'sedang', 'dalam'][TYPE - 1] : '—';
    q('s-zona').textContent = TYPE ? SZN.toLocaleString('en-US') + '–' +
      EZN.toLocaleString('en-US') : '—';
    q('s-dalam').textContent = DT ? Math.round(DT).toLocaleString('en-US') + ' ft' : '—';
    q('s-biaya').textContent = uang(CSF || 0);
    q('s-benih').textContent = benih;
    /* store.get() mengembalikan undefined kalau belum ada, bukan null —
       perbandingan === null melewatkannya dan uang(undefined) jadi NaN. */
    const r = store.get('rekor');
    q('s-rekor').textContent = (typeof r === 'number') ? uang(r) : '—';
    let sisa = 0; for (let c = 0; c < 100; c++) if (MAP[c] && MAP[c].ada && !MAP[c].bor) sisa++;
    q('s-situs').textContent = sisa;
  }

  /* ======================================================================
     Bagian 7 — pasang & bukti
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'Wildcatter', source: 'WILDCAT.BAS · A. Vanchura · 17 Jul 1982'
  }));
  q('mulai').addEventListener('click', mulai);
  q('benih').addEventListener('change', e => {
    benih = parseInt(e.currentTarget.value, 10) || 0; perbaruiHud();
  });

  (function isiBukti() {
    /* Semua angka di panel kanan dihitung di sini dari tabelnya sendiri. */
    const nilai = (opd, gsp) => opd * 9000 + gsp * 1000 * 2.1;
    const baris = [];
    let mati = 0, semua = 0;
    for (let t = 0; t < 3; t++) {
      const hit = D.HIT[t];
      const kering = hit.filter(x => x === 1).length;
      let harap = 0;
      const rinci = [];
      for (let p = 2; p <= 5; p++) {
        const n = hit.filter(x => x === p).length;
        if (!n) continue;
        const tab = D.PAY[t][p - 1];
        let s = 0;
        for (let k = 0; k < 20; k += 2) s += nilai(tab[k], tab[k + 1]);
        const rata = s / 10;
        harap += (n / 40) * rata;
        rinci.push(n + '/40 → ' + uang(rata));
      }
      /* nilai yang tidak pernah bisa dibaca: payoff 1 selalu, plus payoff
         yang tidak ada di tabel HIT */
      for (let p = 1; p <= 5; p++) {
        semua += 20;
        const bisa = p > 1 && hit.indexOf(p) >= 0;
        if (!bisa) mati += 20;
      }
      const z = D.ZONA[t];
      const biaya = z.szn * 30 + 10 * (z.szn + 500) + 187 * 12;
      baris.push({ t: t + 1, kering: kering, harap: harap, biaya: biaya, rinci: rinci, z: z });
    }
    const tbody = q('b-tabel');
    tbody.innerHTML = baris.map(r =>
      '<tr><td>' + ['dangkal', 'sedang', 'dalam'][r.t - 1] + '<br><span class="w-kecil">' +
      r.z.szn.toLocaleString('en-US') + '–' + r.z.ezn.toLocaleString('en-US') + ' ft</span></td>' +
      '<td>' + Math.round(100 * (40 - r.kering) / 40) + ' %</td>' +
      '<td>' + uang(r.harap) + '</td>' +
      '<td>' + uang(r.biaya) + '</td>' +
      '<td class="' + (r.harap - r.biaya > 0 ? 'w-untung' : 'w-rugi') + '"><b>' +
      uang(r.harap - r.biaya) + '</b></td></tr>').join('');
    q('b-mati').textContent = mati;
    q('b-semua').textContent = semua;
    q('b-persen').textContent = Math.round(100 * mati / semua) + ' %';
    q('b-kosong').textContent = '60 %';
    q('b-situs').textContent = (40 * 0.4).toFixed(1) + ' % · ' +
      (40 * 0.6 * 0.6).toFixed(1) + ' % · ' + (40 * 0.6 * 0.4).toFixed(1) + ' %';
  })();

  mulai();
})();
