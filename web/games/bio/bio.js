/* ===========================================================================
   bio.js — port dari BIO.BAS (Friendlyware PC Introductory Set, 1982).

   Kalkulator biorhythm: teori abad ke-19 yang menyatakan manusia dikendalikan
   tiga siklus tetap sejak lahir — fisik 23 hari, emosi 28, intelektual 33.
   Teorinya tidak punya dasar ilmiah. Yang menarik di sini bukan teorinya,
   melainkan bagaimana grafiknya digambar tanpa satu perintah grafis pun.

   ------------------------------------------------------------------------
   DUA CACAT, DAN YANG SATU MENYEMBUNYIKAN YANG LAIN

   Cacat pertama, baris 470:  YEAR=YEAR+1900, tanpa syarat.
   Jadi tahun yang bisa dicapai persis 1900-1999. Ketik 26 dan Anda mendapat
   1926. Program ini tidak bisa menggambar hari ini.

   Cacat kedua, baris 530: rumus Julian Day-nya menukar urutan kali dan bagi.

       BASIC : INT( INT(3*(Y+4900+W)/100) / 4 )      <- kali 3 dulu
       baku  : ( 3 * ((Y+4900+L)/100) ) / 4          <- bagi 100 dulu

   Keduanya sama untuk sebagian besar tahun dan berbeda untuk sebagian lain.
   Diukur atas 1900-01-01..2100-12-31: kegagalan pulang-pergi pertama jatuh
   pada 1 Maret 2034 — jauh DI LUAR jangkauan yang bisa dicapai karena baris
   470. Di dalam 1900-1999: nol kesalahan.

   Jadi cacat Y2K menjaga cacat kalender tetap tertidur lima puluh dua tahun.
   Memperbaiki yang satu MEMBANGUNKAN yang lain. Port ini memperbaiki
   keduanya — tapi urutan memeriksanya penting, dan itulah pelajarannya.

   ------------------------------------------------------------------------
   SELISIH HARI TETAP BENAR

   Rumus maju di 490-550 tidak sama dengan Julian Day baku: selisihnya 0
   sampai -3 tergantung tahun. Tapi program hanya memakai SELISIH-nya:

       300 N=JC-JB

   Diperiksa untuk seluruh 1963-2000 terhadap kalender sungguhan: nol selisih
   hari yang salah. Offset yang sama di kedua sisi pengurangan lenyap.

   ------------------------------------------------------------------------
   GRAFIK SEBAGAI BEDAH STRING

       680 E=SPACE$(72)
       690 E=LEFT$(E,T)+CHR$(222)+RIGHT$(E,T)     ' T=35 -> 71 aksara
       740 W=T*SIN(W):W=W+T+1.5
       750 W=INT(W)
       790 E=LEFT$(E,W-1)+C+RIGHT$(E,T+T+1-W)

   Baris 740 menggabungkan TIGA koreksi dalam satu konstanta: T memusatkan,
   +1 karena indeks string BASIC mulai dari 1, +0.5 karena INT memotong ke
   bawah sehingga INT(x+0.5) jadi pembulatan ke terdekat.

   Baris 690 memendekkan penyangganya satu aksara (35+1+35 = 71, bukan 72);
   baris 350 mengembalikannya dengan menyisipkan satu spasi di depan. Dua
   baris berjauhan yang saling bergantung, tanpa satu pun menyebut yang lain.

   Port ini meniru bedah stringnya PERSIS, bukan menggambar ulang dengan cara
   modern — karena bentuk keluarannya justru bahan bacaannya.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const db = store('bio');

  const esc = (s) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  const FIX = Math.trunc;                 // BASIC FIX: potong ke arah nol
  const INT = Math.floor;                 // BASIC INT: bulatkan ke bawah
  const T = 35;                           // baris 140
  const P = 3.1415926535;                 // baris 140, apa adanya

  /* Baris 490-550, apa adanya — termasuk urutan kali/bagi di baris 530 yang
     berbeda dari rumus baku. Dipertahankan karena selisihnya yang dipakai,
     dan selisih itu terbukti benar (lihat kepala berkas). */
  function jdnBio(month, day, year) {
    const W = FIX((month - 14) / 12);
    let JD = INT(1461 * (year + 4800 + W) / 4);
    JD += FIX(367 * (month - 2 - W * 12) / 12);
    JD += day - 32075 - INT(INT(3 * (year + 4900 + W) / 100) / 4);
    return JD;
  }

  /* Fliegel & Van Flandern 1968, CACM 11(10):657 — bentuk baku, dipakai
     HANYA untuk membandingkan, tidak untuk menggambar. */
  function jdnBaku(month, day, year) {
    const L = Math.floor((month - 14) / 12);
    return Math.floor(1461 * (year + 4800 + L) / 4)
         + Math.floor(367 * (month - 2 - 12 * L) / 12)
         - Math.floor(3 * Math.floor((year + 4900 + L) / 100) / 4)
         + day - 32075;
  }

  /* Baris 830-900: kebalikannya. */
  function dariJdn(JC) {
    let W = JC + 68569;
    const R = INT(4 * W / 146097);
    W = W - INT((146097 * R + 3) / 4);
    let YEAR = INT(4000 * (W + 1) / 1461001);
    W = W - INT(1461 * YEAR / 4) + 31;
    let MONTH = INT(80 * W / 2447);
    const DAY = W - INT(2447 * MONTH / 80);
    W = INT(MONTH / 11);
    MONTH = MONTH + 2 - 12 * W;
    YEAR = 100 * (R - 49) + YEAR + W;
    return { MONTH, DAY, YEAR };
  }

  /* Baris 910-980. Perhatikan baris 950: "0"+STR$ TIDAK menghasilkan nol.
     STR$ selalu menyisipkan spasi tanda, jadi STR$(5) = " 5"; "0"+" 5" =
     "0 5"; MID$(Z,2,2) = " 5". Yang benar-benar dikerjakan "0" itu adalah
     menaikkan W jadi 2 supaya lebar bidangnya tetap. Efek sampingnya yang
     bekerja; maksudnya tidak. Dipertahankan, termasuk spasinya. */
  const STR$ = (v) => (v >= 0 ? ' ' : '-') + Math.abs(v);

  function tanggalTeks(MONTH, DAY, YEAR) {
    let Z = STR$(MONTH), W = Z.length - 1;
    if (MONTH < 10) { Z = ' ' + Z; W++; }
    let C = Z.substr(1, W) + '/';
    Z = STR$(DAY); W = Z.length - 1;
    if (DAY < 10) { Z = '0' + Z; W++; }
    C += Z.substr(1, W) + '/';
    Z = STR$(YEAR); W = Z.length - 1;
    C += Z.substr(W - 1, 2);
    return C;
  }

  /* Baris 660-820, bedah string apa adanya. `E` dibawa antar-panggilan
     karena baris 670 hanya membuatnya ulang saat V=23 — jadi urutan
     23, 28, 33 wajib, dan itu syarat yang tidak tertulis di aslinya. */
  let E = '';

  function kurva(N, V) {
    const Wt = INT(N / V), R = N - Wt * V;
    if (V === 23) {                                   // baris 670-690
      E = ' '.repeat(72);
      E = E.slice(0, T) + String.fromCharCode(0x2590) + E.slice(E.length - T);
    }
    let C = V === 23 ? 'P' : V === 28 ? 'E' : 'I';    // baris 700-720
    let W = (R / V) * 2 * P;                          // baris 730
    W = T * Math.sin(W); W = W + T + 1.5;             // baris 740
    W = INT(W);                                       // baris 750
    const Z = E.charAt(W - 1);
    if (Z === 'P' || Z === 'E' || Z === '&') C = '&'; // baris 760
    if (W === 1) E = C + E.slice(-(T + T));           // baris 810
    else if (W === T + T + 1) E = E.slice(0, T + T) + C;   // baris 820
    else E = E.slice(0, W - 1) + C + E.slice(E.length - (T + T + 1 - W));
    return R;
  }

  // --- rakit satu baris grafik ---
  function barisGrafik(JC, JB) {
    const N = JC - JB;                                // baris 300
    const rP = kurva(N, 23), rE = kurva(N, 28), rI = kurva(N, 33);
    const d = dariJdn(JC);                            // baris 830-900
    const C = tanggalTeks(d.MONTH, d.DAY, d.YEAR);
    return { teks: C + ' ' + E, N, rP, rE, rI, d };   // baris 350-360
  }

  // --- layar ---
  const KEPALA = '--DATE--' + ' '.repeat(13) + 'D O W N' + ' '.repeat(12) +
                 'CRITICAL' + ' '.repeat(12) + 'U P';
  const BAR = ' '.repeat(8) + '█'.repeat(72);

  let JB = 0, JC = 0, baris = [], terakhir = null;

  /* --- grafik modern -----------------------------------------------------
     Keluaran 1982 memplot tiga kurva sebagai HURUF di kisi 72 kolom: satu
     aksara per hari, dan dua siklus yang berimpit jadi `&`. Itu bentuk yang
     dipaksa layar teks, bukan bentuk yang dimaksud.

     Yang digambar di sini adalah yang dimaksud: tiga gelombang sinus utuh,
     dicuplik empat kali per hari supaya lengkungnya mulus — bukan satu titik
     per hari seperti aslinya. Keluaran aslinya tidak dibuang; ia ada di balik
     tombol "Tampilan 1982", karena bedah string yang menghasilkannya adalah
     bahan bacaan tersendiri.
     ---------------------------------------------------------------------- */
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const SIKLUS = [
    { v: 23, kelas: 'b-p', nama: 'Fisik' },
    { v: 28, kelas: 'b-e', nama: 'Emosi' },
    { v: 33, kelas: 'b-i', nama: 'Intelektual' }
  ];
  const W = 760, H = 300, PAD_L = 34, PAD_R = 12, PAD_T = 16, PAD_B = 34;
  const nilaiSiklus = (n, v) => Math.sin((n % v) / v * 2 * P);

  function grafik() {
    const host = $('grafik');
    host.textContent = '';
    if (!baris.length) return;

    const n0 = baris[0].N, n1 = baris[baris.length - 1].N;
    const rentang = Math.max(1, n1 - n0);
    const x = (n) => PAD_L + (n - n0) / rentang * (W - PAD_L - PAD_R);
    const y = (v) => PAD_T + (1 - v) / 2 * (H - PAD_T - PAD_B);

    const svg = mk('svg', {
      class: 'b-svg', viewBox: '0 0 ' + W + ' ' + H,
      role: 'img',
      'aria-label': 'Grafik biorhythm ' + baris.length + ' hari, tiga siklus'
    });

    // --- kisi ---
    [1, 0.5, 0, -0.5, -1].forEach(v => {
      svg.append(mk('line', { class: 'b-grid' + (v === 0 ? ' b-grid--0' : ''),
                              x1: PAD_L, x2: W - PAD_R, y1: y(v), y2: y(v) }));
      const t = mk('text', { class: 'b-sumbu', x: PAD_L - 6, y: y(v) + 3,
                             'text-anchor': 'end' });
      t.textContent = (v * 100).toFixed(0) + '%';
      svg.append(t);
    });

    /* Label tanggal: hanya sebanyak yang muat. Satu label per hari akan
       bertumpuk begitu "Lanjut" ditekan beberapa kali, dan sumbu yang
       bertumpuk lebih buruk daripada sumbu yang jarang. */
    const tiap = Math.max(1, Math.ceil(baris.length / 12));
    baris.forEach((b, i) => {
      if (i % tiap && i !== baris.length - 1) return;
      const t = mk('text', { class: 'b-tgl', x: x(b.N), y: H - PAD_B + 14,
                             'text-anchor': 'middle' });
      t.textContent = b.teks.slice(0, 8).trim();
      svg.append(t);
    });

    // --- tiga kurva ---
    SIKLUS.forEach(s => {
      const g = mk('g', { class: s.kelas });
      const titik = [];
      for (let n = n0; n <= n1 + 0.001; n += 0.25) {
        titik.push([x(n), y(nilaiSiklus(n, s.v))]);
      }
      const d = titik.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' +
                                    p[1].toFixed(1)).join(' ');
      g.append(mk('path', { class: 'b-isi',
        d: d + ' L' + x(n1).toFixed(1) + ' ' + y(0).toFixed(1) +
           ' L' + x(n0).toFixed(1) + ' ' + y(0).toFixed(1) + ' Z' }));
      g.append(mk('path', { class: 'b-garis', d: d }));

      /* Hari kritis: siklus melintasi nol, yaitu saat sisa hari kelipatan
         setengah periode. Ditandai di sumbu, bukan di kurvanya — di kurva ia
         tenggelam di antara tiga garis yang saling memotong. */
      for (let n = Math.ceil(n0); n <= n1; n++) {
        const r = n % s.v;
        if (r === 0 || r * 2 === s.v) {
          g.append(mk('line', { class: 'b-kritis b-kritis--' + s.kelas.slice(-1),
                                x1: x(n), x2: x(n), y1: PAD_T, y2: H - PAD_B }));
        }
      }

      // titik pada hari terakhir, supaya nilai "hari ini" punya jangkar
      g.append(mk('circle', { class: 'b-titik', cx: x(n1), cy: y(nilaiSiklus(n1, s.v)), r: 4 }));
      svg.append(g);
    });

    host.append(svg);

    const leg = ui.el('div', { class: 'b-legenda' });
    SIKLUS.forEach(s => {
      const v = nilaiSiklus(n1, s.v) * 100;
      leg.append(ui.el('span', {
        class: 'b-kunci b-kunci--' + s.kelas.slice(-1),
        text: s.nama + ' ' + s.v + ' hari · ' + (v >= 0 ? '+' : '') + v.toFixed(0) + '%'
      }));
    });
    host.append(leg);
  }

  function gambar() {
    const host = $('layar');
    host.textContent = '';
    const crt = ui.el('div', { class: 'h-crt b-crt' });
    const scr = ui.el('div', { class: 'h-scr' });
    scr.setAttribute('role', 'img');
    scr.setAttribute('aria-label',
      'Grafik biorhythm ' + baris.length + ' hari mulai ' +
      (baris[0] ? baris[0].teks.slice(0, 8) : ''));
    scr.innerHTML =
      '<span class="h-scr__row"><span class="c7 b0">' + esc(KEPALA) + '</span></span>' +
      '<span class="h-scr__row"><span class="c2 b0">' + esc(BAR) + '</span></span>' +
      baris.map(b => '<span class="h-scr__row"><span class="c15 b0">' +
        esc(b.teks.slice(0, 8)) + '</span><span class="c3 b0">' +
        esc(b.teks.slice(8)) + '</span></span>').join('');
    crt.append(scr);
    host.append(crt);

    grafik();

    const t = terakhir;
    if (t) {
      $('s-hari').textContent = t.N.toLocaleString('id');
      const pct = (r, v) => (Math.sin(r / v * 2 * P) * 100).toFixed(0) + '%';
      $('s-p').textContent = pct(t.rP, 23);
      $('s-e').textContent = pct(t.rE, 28);
      $('s-i').textContent = pct(t.rI, 33);
    }
    $('info').textContent = baris.length + ' hari tergambar · ' +
      Math.ceil(baris.length / 21) + ' layar';
  }

  function batch() {
    for (let L = 0; L < 21; L++) {                    // baris 370
      terakhir = barisGrafik(JC, JB);
      baris.push(terakhir);
      JC++;
    }
    gambar();
  }

  function buat() {
    const l = $('lahir').value, m = $('mulai').value;
    if (!l || !m) { $('galat').textContent = 'Isi kedua tanggal dulu.'; return; }
    const [ly, lm, ld] = l.split('-').map(Number);
    const [my, mm, md] = m.split('-').map(Number);
    JB = jdnBio(lm, ld, ly);
    JC = jdnBio(mm, md, my);
    /* Baris 280, dengan kata-kata aslinya. */
    if (JC < JB) {
      $('galat').textContent =
        'Start Date Cannot Be Earlier Than Your Birth Date. Please Try Again.';
      return;
    }
    $('galat').textContent = '';
    db.set('lahir', l); db.set('mulai', m);
    baris = []; E = '';
    batch();
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Biorhythm',
    source: 'BIO.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  $('buat').addEventListener('click', buat);
  $('lanjut').addEventListener('click', () => { if (baris.length) batch(); });

  /* Kedua tampilan digambar dari SATU sumber angka yang sama (`baris`), jadi
     mustahil keduanya menceritakan hal berbeda. Yang ditukar cuma cara
     menggambarnya. */
  $('mode').addEventListener('click', () => {
    const lama = $('mode').getAttribute('aria-pressed') === 'true';
    const baru = !lama;
    $('mode').setAttribute('aria-pressed', String(baru));
    $('mode').textContent = baru ? 'Tampilan modern' : 'Tampilan 1982';
    $('layar').hidden = !baru;
    $('grafik').hidden = baru;
    db.set('mode', baru ? '1982' : 'modern');
  });

  $('lahir').value = db.get('lahir', '1962-11-30');
  $('mulai').value = db.get('mulai', '1983-01-01');
  if (db.get('mode', 'modern') === '1982') $('mode').click();

  /* --- angka yang dihitung hidup, bukan dikutip --------------------------
     Klaim "cacat kedua tertidur di balik cacat pertama" hanya berarti kalau
     angkanya bisa diperiksa di halaman ini juga. Jadi dihitung di sini. */
  (function ukur() {
    const HARI = 86400000;
    let bedaBaku = 0, gagalPP = 0, pertamaGagal = null, gagalDalamJangkauan = 0;
    let d = Date.UTC(1900, 0, 1);
    const akhir = Date.UTC(2100, 11, 31);
    for (; d <= akhir; d += HARI) {
      const t = new Date(d);
      const m = t.getUTCMonth() + 1, hh = t.getUTCDate(), y = t.getUTCFullYear();
      const j = jdnBio(m, hh, y);
      if (j !== jdnBaku(m, hh, y)) bedaBaku++;
      const r = dariJdn(j);
      if (r.MONTH !== m || r.DAY !== hh || r.YEAR !== y) {
        gagalPP++;
        if (!pertamaGagal) pertamaGagal = y + '-' + String(m).padStart(2, '0') +
                                          '-' + String(hh).padStart(2, '0');
        if (y <= 1999) gagalDalamJangkauan++;
      }
    }
    $('tbl-jdn').innerHTML =
      '<thead><tr><th>Diperiksa 1900–2100</th><th></th></tr></thead><tbody>' +
      '<tr><td>Tanggal diuji</td><td>73.414</td></tr>' +
      '<tr><td>Berbeda dari rumus baku</td><td>' + bedaBaku.toLocaleString('id') + '</td></tr>' +
      '<tr><td>Gagal pulang-pergi</td><td>' + gagalPP.toLocaleString('id') + '</td></tr>' +
      '<tr><td>Kegagalan pertama</td><td class="h-bad">' + pertamaGagal + '</td></tr>' +
      '<tr><td><b>Gagal di dalam 1900–1999</b></td><td><b>' +
        gagalDalamJangkauan + '</b></td></tr>' +
      '</tbody>';
  })();

  buat();
})();
