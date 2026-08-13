/* ===========================================================================
   curve.js — port dari CURVE.BAS (Phil Feldman & Tom Rugg, 1982).

   Pencocokan kurva kuadrat terkecil: diberi titik-titik (x, y), cari polinom
   berderajat d yang paling dekat dengan semuanya.

   ------------------------------------------------------------------------
   BARIS 780-980 ADALAH BARIS 390-590 SIMEQN

   Sama persis, kata demi kata, hanya nomor barisnya berbeda. Dua puluh satu
   baris eliminasi Gauss yang disalin-tempel — karena BASIC 1982 tidak punya
   satu pun cara berbagi kode antarprogram.

   Di port ini keduanya memanggil `_shared/gauss.js`. Lihat komentar di sana.

   ------------------------------------------------------------------------
   BAGAIMANA KUADRAT TERKECIL DIUBAH JADI SISTEM PERSAMAAN

   Ini bagian yang layak dibaca pelan-pelan, karena ia menjelaskan kenapa
   program pencocokan kurva membutuhkan penyelesai persamaan sama sekali.

   Kita mencari koefisien v0..vd yang meminimalkan jumlah kuadrat sisa. Turunan
   terhadap tiap koefisien disamakan nol, dan hasilnya sistem (d+1) persamaan
   yang disebut PERSAMAAN NORMAL. Matriksnya cuma butuh jumlah pangkat x:

       450 FOR J=1 TO D2:P(J)=0:FOR K=1 TO NP
       460 P(J)=P(J)+X(K)^J:NEXT:NEXT:P(0)=NP     ' P(j) = sum x^j
       510 FOR J=1 TO N:FOR K=1 TO N:A(J,K)=P(J+K-2)

   Baris 510 itu intinya: A(j,k) = P(j+k-2). Matriks yang tiap elemennya
   ditentukan oleh JUMLAH indeksnya saja — matriks Hankel. Jadi seluruh
   matriks (d+1)x(d+1) dibangun dari 2d+1 angka, bukan dari (d+1)^2.

   Ruas kanannya jumlah y kali pangkat x (baris 470-500).

   ------------------------------------------------------------------------
   "PERCENT GOODNESS OF FIT" ITU BUKAN R KUADRAT

       590 G=G+(Y(J)-M)^2:NEXT:IF G=0 THEN T=100:GOTO 610
       600 T=100*SQR(1-T/G)

   T adalah jumlah kuadrat sisa, G jumlah kuadrat simpangan terhadap rata-rata.
   Jadi 1 - T/G adalah R kuadrat — dan yang dicetak adalah AKARNYA, dikali
   seratus. Yaitu |R|, koefisien korelasi, bukan R kuadrat.

   Bedanya nyata: R kuadrat 0,81 tampil sebagai 90, bukan 81. Angkanya
   terdengar lebih bagus daripada yang sebenarnya, dan tidak ada satu pun
   baris yang menyebut nama besaran itu.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, gauss } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };

  const MX = 100, MD = 7;              // baris 160-180: batas aslinya
  const db = store('curve');
  let titik = [], koef = null, derajat = 2;

  /* Data bawaan: sebuah parabola dengan derau kecil, supaya halaman terbuka
     dengan sesuatu yang jelas bukan garis lurus — perbedaan derajat 1 dan 2
     langsung terlihat tanpa mengetik apa pun. */
  const CONTOH = '0,1.1\n1,2.0\n2,4.9\n3,10.2\n4,16.8\n5,26.1\n6,36.9\n7,50.2';

  function baca() {
    const teks = $('data').value;
    const out = [];
    teks.split(/[\n;]+/).forEach(baris => {
      const b = baris.trim();
      if (!b) return;
      const p = b.split(/[,\s]+/).map(Number);
      /* Baris 270-280: 999,999 menandai akhir data. Di sini tidak dibutuhkan
         lagi — kotak teks punya akhir sendiri — tapi tetap dikenali, karena
         data 1982 yang disalin-tempel akan berisi baris itu. */
      if (p.length >= 2 && p[0] === 999 && p[1] === 999) return;
      if (p.length >= 2 && isFinite(p[0]) && isFinite(p[1])) out.push([p[0], p[1]]);
    });
    return out.slice(0, MX);
  }

  /* --------------------------------------------------------------------
     Membangun persamaan normal — baris 450-510, apa adanya.
     -------------------------------------------------------------------- */
  function cocokkan() {
    titik = baca();
    const np = titik.length;
    const pesan = $('msg');
    pesan.textContent = '';
    koef = null;

    if (!np) return galat('No data entered');                     // baris 370
    derajat = Math.max(0, Math.floor(Number($('deg').value) || 0));
    if (derajat >= np) return galat('Not enough data');           // baris 420
    if (derajat > MD) return galat('Degree too high');            // baris 430

    const n = derajat + 1, d2 = 2 * derajat;
    const P = new Array(d2 + 1).fill(0);
    P[0] = np;                                                    // baris 460
    for (let j = 1; j <= d2; j++) {
      for (let k = 0; k < np; k++) P[j] += Math.pow(titik[k][0], j);
    }
    const R = new Array(n).fill(0);
    for (let k = 0; k < np; k++) R[0] += titik[k][1];             // baris 470
    for (let j = 1; j < n; j++) {                                 // baris 490-500
      for (let k = 0; k < np; k++) R[j] += titik[k][1] * Math.pow(titik[k][0], j);
    }
    const A = [];
    for (let j = 0; j < n; j++) {                                 // baris 510
      const baris = [];
      for (let k = 0; k < n; k++) baris.push(P[j + k]);
      A.push(baris);
    }

    const h = gauss.solve(A, R);
    if (h.singular) return galat('Sistem persamaan normalnya singular — '
      + 'titik-titiknya tidak menentukan polinom derajat itu.');

    koef = h.v;
    audio.play('MB T200 O2 L16 c e g', { fresh: true });
    tampilkan(np);
    db.set('data', $('data').value);
  }

  function galat(t) {
    /* Baris 740-770: "** ERROR! ** -- " lalu pesannya, dengan COLOR 23 yang
       berkedip. Kata-katanya dipertahankan; kedipannya tidak. */
    audio.play('MB T200 O2 L8 f d', { fresh: true });
    $('msg').innerHTML = '<span class="c-err">** ERROR! **</span> &mdash; ' + t;
    $('out').textContent = '';
    $('plot').textContent = '';
  }

  const nilaiDi = (x) => koef.reduce((s, v, i) => s + v * Math.pow(x, i), 0);

  function tampilkan(np) {
    const out = $('out');
    out.textContent = '';
    out.append(ui.el('p', { class: 'c-judul', text: np + ' data pairs entered.' }));

    /* Baris 530-560: tabel X POWER / COEFFICIENT. */
    const tb = ui.el('table', { class: 'c-tbl' });
    const th = ui.el('tr');
    th.append(ui.el('th', { text: 'X POWER' }), ui.el('th', { text: 'COEFFICIENT' }));
    tb.append(th);
    koef.forEach((v, i) => {
      const tr = ui.el('tr');
      tr.append(ui.el('td', { text: String(i) }), ui.el('td', { text: rapi(v) }));
      tb.append(tr);
    });
    out.append(tb);

    /* Baris 570-610: "Percent Goodness of Fit". Lihat komentar kepala berkas —
       yang dicetak adalah AKAR dari R kuadrat. Keduanya ditampilkan di sini,
       supaya selisihnya terlihat alih-alih tersembunyi. */
    const y = titik.map(t => t[1]);
    const rata = y.reduce((a, b) => a + b, 0) / y.length;
    let T = 0, G = 0;
    titik.forEach(([xv, yv]) => { T += Math.pow(yv - nilaiDi(xv), 2); });
    y.forEach(yv => { G += Math.pow(yv - rata, 2); });
    const r2 = G === 0 ? 1 : 1 - T / G;
    const asli = G === 0 ? 100 : 100 * Math.sqrt(Math.max(r2, 0));

    out.append(ui.el('p', { class: 'c-note',
      html: 'Percent Goodness of Fit = <b>' + asli.toFixed(4) + '</b> ' +
            '&mdash; angka yang dicetak aslinya.' }));
    out.append(ui.el('p', { class: 'c-note',
      html: 'R&sup2; = <b>' + r2.toFixed(6) + '</b>, yaitu <b>' +
            (r2 * 100).toFixed(2) + '%</b>. Aslinya mencetak <b>akarnya</b>, ' +
            'jadi angkanya selalu terdengar lebih bagus daripada yang sebenarnya.' }));

    gambar();
  }

  /* --------------------------------------------------------------------
     Grafik.

     Aslinya TIDAK punya grafik sama sekali — baris 130 mengharuskannya jalan
     di CRT mana pun, dan grafik berarti `SCREEN 1` yang tidak ada di semua
     mesin. Yang ditawarkannya sebagai gantinya adalah mode "Determine
     specific points" (baris 690-730): ketik X, dapat Y, satu per satu.

     Grafik di sini adalah penyimpangan, dan alasannya: seluruh gunanya
     mencocokkan kurva adalah melihat apakah kurvanya masuk akal, dan mata
     mengerjakan itu dalam sekejap sementara tabel angka butuh menit.
     Mode "specific points" aslinya tetap disediakan di bawahnya.
     -------------------------------------------------------------------- */
  function gambar() {
    const host = $('plot');
    host.textContent = '';
    if (!koef || !titik.length) return;

    const W = 420, H = 260, P = 34;
    const xs = titik.map(t => t[0]), ys = titik.map(t => t[1]);
    let x0 = Math.min(...xs), x1 = Math.max(...xs);
    let y0 = Math.min(...ys), y1 = Math.max(...ys);
    const N = 160;
    for (let i = 0; i <= N; i++) {
      const v = nilaiDi(x0 + (x1 - x0) * i / N);
      if (isFinite(v)) { y0 = Math.min(y0, v); y1 = Math.max(y1, v); }
    }
    if (x1 === x0) { x0 -= 1; x1 += 1; }
    if (y1 === y0) { y0 -= 1; y1 += 1; }
    const mx = (x1 - x0) * 0.04, my = (y1 - y0) * 0.08;
    x0 -= mx; x1 += mx; y0 -= my; y1 += my;
    const sx = (x) => P + (x - x0) / (x1 - x0) * (W - P * 1.4);
    const sy = (y) => H - P + (y - y0) / (y0 - y1) * (H - P * 1.7);

    const svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'c-plot',
                            role: 'img', 'aria-label': 'grafik titik data dan kurva' });
    svg.append(mk('line', { class: 'c-axis', x1: P, y1: H - P, x2: W - 8, y2: H - P }));
    svg.append(mk('line', { class: 'c-axis', x1: P, y1: 8, x2: P, y2: H - P }));

    let d = '';
    for (let i = 0; i <= N; i++) {
      const xv = x0 + (x1 - x0) * i / N, yv = nilaiDi(xv);
      d += (i ? 'L' : 'M') + sx(xv).toFixed(1) + ',' + sy(yv).toFixed(1);
    }
    svg.append(mk('path', { class: 'c-fit', d: d }));
    titik.forEach(([xv, yv]) => {
      svg.append(mk('circle', { class: 'c-dot', cx: sx(xv), cy: sy(yv), r: 3.4 }));
      /* Garis sisa: jarak tegak titik ke kurva. Itulah yang dikuadratkan
         dan dijumlahkan oleh kuadrat terkecil — jadi memperlihatkannya
         berarti memperlihatkan apa yang sedang diminimalkan. */
      svg.append(mk('line', { class: 'c-res', x1: sx(xv), y1: sy(yv),
                              x2: sx(xv), y2: sy(nilaiDi(xv)) }));
    });
    /* Label ujung sumbu. `append()` mengembalikan undefined, jadi elemennya
       harus dipegang dulu sebelum diisi teks — kesalahan yang gampang lolos
       karena barisnya terbaca seperti berantai. */
    [x0, x1].forEach((xv, i) => {
      const t = mk('text', { class: 'c-lab', x: i ? W - 12 : P, y: H - P + 15,
                             'text-anchor': i ? 'end' : 'start' });
      t.textContent = rapi(xv);
      svg.append(t);
    });
    [y0, y1].forEach((yv, i) => {
      const t = mk('text', { class: 'c-lab', x: P - 5, y: i ? 14 : H - P - 3,
                             'text-anchor': 'end' });
      t.textContent = rapi(yv);
      svg.append(t);
    });
    host.append(svg);
  }

  const rapi = (v) => {
    if (!isFinite(v)) return String(v);
    const b = Math.round(v);
    if (Math.abs(v - b) < 1e-10) return String(b);
    return Math.abs(v) < 1e-4 || Math.abs(v) > 1e6
      ? v.toExponential(4) : String(Number(v.toPrecision(7)));
  };

  /* Baris 690-730: mode "Determine specific points". Dipertahankan. */
  function hitungTitik() {
    if (!koef) return;
    const xv = Number($('xq').value);
    if (!isFinite(xv)) return;
    $('yq').textContent = 'Y= ' + rapi(nilaiDi(xv));
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Least Squares Curve Fitting',
    source: 'CURVE.BAS · Phil Feldman & Tom Rugg · 1982',
    backHref: '../../index.html'
  }));

  $('go').addEventListener('click', cocokkan);
  $('deg').addEventListener('input', e => {
    $('degv').textContent = e.target.value;
    if (titik.length) cocokkan();
  });
  $('xq').addEventListener('input', hitungTitik);
  $('contoh').addEventListener('click', () => {
    $('data').value = CONTOH; cocokkan();
  });

  $('data').value = db.get('data', CONTOH);
  $('degv').textContent = $('deg').value;
  cocokkan();
})();
