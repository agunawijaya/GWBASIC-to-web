/* ===========================================================================
   droids.js — port DROIDS.BAS (IPCO disk 2043-A, koreksi John Beck, Melbourne)

   Empat hal yang membentuk berkas ini:

   1. LAYARNYA ADALAH PAPANNYA, secara harfiah. Tidak ada larik medan sama
      sekali. Satu-satunya tempat penyimpanan bijih adalah buffer video, dan
      permainan membacanya kembali dengan `SCREEN(y,x)` -- fungsi yang
      mengembalikan kode karakter di sel layar. Ini contoh paling murni dari
      "layar sebagai struktur data" di seluruh koleksi ini.

   2. SEL YANG SUDAH DIMAKAN DITULISI CHR$(0), BUKAN SPASI. Baris 2230
      mencetak `CHR$(0)`, jadi `SCREEN()` mengembalikan 0, dan baris 2229
      harus memeriksa 0 DAN 32 sekaligus.

   3. EMPAT BIJIH LENYAP TANPA PERNAH DIHITUNG. Tiap droid ditaruh di atas
      sel berbijih (baris 1930 mengulang sampai dapat), dan waktu ia pindah
      baris 2230 mengosongkan sel itu. Jadi dari 150 sel, hanya 146 yang
      bisa jadi angka.

   4. BENIHNYA 3.600, bukan 60. Baris 1890 menyambung DETIK dengan MENIT
      sebagai teks lalu mem-VAL-nya -- satu-satunya program di koleksi ini
      yang benar-benar melebarkan benihnya, dan caranya sesederhana
      menyambung dua potongan `TIME$`.
   =========================================================================== */
(function () {
  'use strict';

  const ui = window.RETRO.ui;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('droids');
  const q = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };

  /* ======================================================================
     Bagian 1 — papan, ukuran diturunkan dari baris 1220-1230
       X15$ = 1 + 14 karakter = 15 kolom, dicetak pada baris 3..12 = 10 baris
     ====================================================================== */
  const LEBAR = 15, TINGGI = 10;
  const ORE = 254, KOSONG = 0;                  /* baris 1060 dan 2230 */
  const HURUF = [65, 66, 67, 68];               /* baris 1080: A B C D  */
  const ARAH = {
    N: [0, -1], NE: [1, -1], E: [1, 0], SE: [1, 1],
    S: [0, 1], SW: [-1, 1], W: [-1, 0], NW: [-1, -1]
  };

  let sel = [];                 /* sel[y][x] = ORE / KOSONG / kode huruf droid */
  let dx = [], dy = [];         /* IX(J), IY(J) */
  let skor = [], nama = [], NPLAY = 2, NP = 0;
  let benih = 1982, rnd = null, selesai = false;
  let dipilih = -1, jalur = null;
  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };

  /* Baris 2210: SCREEN(y,x). Di luar papan ia membaca layar kosong -> 0. */
  const baca = (x, y) =>
    (x < 0 || y < 0 || x >= LEBAR || y >= TINGGI) ? KOSONG : sel[y][x];

  function mulai() {
    rnd = acak(benih);
    NPLAY = Number(q('pemain').value);
    nama = []; skor = [];
    for (let i = 0; i < NPLAY; i++) { nama.push('PLAYER ' + (i + 1)); skor.push(0); }
    sel = [];
    for (let y = 0; y < TINGGI; y++) sel.push(new Array(LEBAR).fill(ORE));
    dx = []; dy = [];
    /* Baris 1900-1950: undi sampai mendarat di sel berbijih. Karena sel yang
       sudah ditempati droid tidak lagi berisi ORE, ini sekaligus mencegah
       dua droid berdiri di tempat yang sama. */
    for (let j = 0; j < 4; j++) {
      let x, y, n = 0;
      do { x = Math.floor(rnd() * LEBAR); y = Math.floor(rnd() * TINGGI); n++; }
      while (baca(x, y) !== ORE && n < 500);
      dx.push(x); dy.push(y); sel[y][x] = HURUF[j];
    }
    NP = 0; selesai = false; dipilih = -1; jalur = null;
    q('log').textContent = '';
    tulis('WELCOME TO DROIDS — IPCO 2043-A', 'judul');
    tulis('Empat bijih di bawah droid hilang tanpa dihitung: 150 − 4 = 146 angka tersedia.');
    gambar(); perbaruiHud(); tanyaDroid();
  }

  /* ======================================================================
     Bagian 2 — langkah, baris 2200-2280 apa adanya
     ====================================================================== */
  function langkah(dn, arah) {
    if (selesai) return;
    const [ax, ay] = ARAH[arah];
    let z = 0, ambil = 0;
    const titik = [[dx[dn], dy[dn]]];
    while (true) {
      z += 1;
      const ct = baca(dx[dn] + ax, dy[dn] + ay);
      if (ct !== ORE) {
        /* Baris 2221-2226: kalau langkah PERTAMA sudah bukan bijih, itu
           langkah haram dan giliran TIDAK berpindah (3030 GOTO 1130).
           Kalau z>1, droid hanya berhenti dan giliran berpindah. */
        if (z === 1) {
          tulis('ILLEGAL MOVE — ' + String.fromCharCode(HURUF[dn]) + ' ke ' + arah +
                ' bukan bijih', 'awas');
          dipilih = -1; jalur = null; gambar(); tanyaDroid();
          return;
        }
        break;
      }
      sel[dy[dn]][dx[dn]] = KOSONG;              /* baris 2230: CHR$(0) */
      dx[dn] += ax; dy[dn] += ay;
      sel[dy[dn]][dx[dn]] = HURUF[dn];
      skor[NP] += 1;                             /* baris 2250 */
      ambil += 1;
      titik.push([dx[dn], dy[dn]]);
    }
    if (q('bunyi').checked) try { audio.play('O1T200G'); } catch (e) {}
    tulis(nama[NP] + ' — droid ' + String.fromCharCode(HURUF[dn]) + ' ke ' + arah +
          ', ambil ' + ambil + ' bijih (skor ' + skor[NP] + ')', 'baik');
    jalur = titik; dipilih = -1;
    NP = (NP + 1) % NPLAY;                       /* baris 1160 */
    gambar(); perbaruiHud();
    if (cekAkhir()) return;
    tanyaDroid();
  }

  /* Baris 2290-2370: permainan berhenti kalau TIDAK ADA droid yang punya
     bijih di salah satu dari delapan sel tetangganya. */
  function cekAkhir() {
    let ada = false;
    for (let j = 0; j < 4; j++)
      for (let a = -1; a <= 1; a++)
        for (let b = -1; b <= 1; b++)
          if (baca(dx[j] + a, dy[j] + b) === ORE) ada = true;
    if (ada) return false;
    selesai = true;
    const maks = Math.max(...skor);
    const menang = nama.filter((n, i) => skor[i] === maks);
    tulis('GAME IS OVER', 'judul');
    tulis('Pemenang: ' + menang.join(', ') + ' dengan ' + maks +
          '  ·  total terkumpul ' + skor.reduce((s, v) => s + v, 0) + ' dari 146');
    const r = store.get('rekor');
    if (typeof r !== 'number' || maks > r) store.set('rekor', maks);
    tanya('<b>GAME IS OVER</b> — ' + menang.join(', ') + ' menang dengan ' + maks,
      [tombol('Main lagi', mulai, 'btn--primary btn--sm')],
      'Sisa bijih di papan: <b>' + sisaBijih() + '</b>. Aslinya juga berhenti ' +
      'di sini: selama tidak ada droid yang bersebelahan dengan bijih, tidak ' +
      'ada langkah yang mungkin — berapa pun bijih yang masih tergeletak jauh.');
    perbaruiHud();
    return true;
  }
  const sisaBijih = () => sel.reduce((s, r) => s + r.filter(v => v === ORE).length, 0);

  /* ======================================================================
     Bagian 3 — gambar
     ====================================================================== */
  const svg = q('svg');
  const gB = mkn('g', {});
  svg.append(gB);
  const S = 50, X0 = 32, Y0 = 26;      /* sel diperbesar supaya muat gambar */

  /* ----------------------------------------------------------------------
     Aslinya sebuah droid adalah SATU HURUF (CHR$(65..68)) dan sebutir bijih
     adalah SATU KARAKTER (CHR$(254), kotak penuh CP437). Itu bukan pilihan
     rupa -- itu satu-satunya yang muat, karena papannya adalah buffer video
     dan sel layar hanya bisa berisi satu karakter. Di sini kendalanya sudah
     tidak ada, jadi keduanya digambar sebagai benda: robot penambang, dan
     bongkahan bijih.

     Hurufnya TETAP ada, di dada tiap droid -- ia identitas yang dipakai
     aturan (baris 2060 mencocokkan masukan pemain dengan CHR$(CH(J))), jadi
     ia tidak boleh hilang hanya karena gambarnya jadi lebih bagus.
     ---------------------------------------------------------------------- */
  const ROBOT = [
    { k: 'a', antena: 'bola' }, { k: 'b', antena: 'piring' },
    { k: 'c', antena: 'ganda' }, { k: 'd', antena: 'jarum' }
  ];

  function gambarDroid(g, j, cx, cy) {
    const r = ROBOT[j], K = 'd-r' + r.k;
    const G = mkn('g', { class: 'd-robot ' + K,
      transform: 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')' });
    G.append(mkn('ellipse', { class: 'd-bayang', cx: 0, cy: 19, rx: 14, ry: 4 }));
    /* antena -- keempatnya berbeda bentuk, bukan hanya berbeda warna, supaya
       tetap terbedakan kalau warnanya tidak terlihat */
    G.append(mkn('line', { class: 'd-antena', x1: 0, y1: -17, x2: 0, y2: -24 }));
    if (r.antena === 'bola')
      G.append(mkn('circle', { class: 'd-antenaUjung', cx: 0, cy: -26, r: 3 }));
    else if (r.antena === 'piring')
      G.append(mkn('path', { class: 'd-antenaUjung', d: 'M-5 -25 A5 5 0 0 1 5 -25 Z' }));
    else if (r.antena === 'ganda') {
      G.append(mkn('line', { class: 'd-antena', x1: -4, y1: -24, x2: 4, y2: -24 }));
      G.append(mkn('circle', { class: 'd-antenaUjung', cx: -4, cy: -25, r: 2.2 }));
      G.append(mkn('circle', { class: 'd-antenaUjung', cx: 4, cy: -25, r: 2.2 }));
    } else
      G.append(mkn('path', { class: 'd-antenaUjung', d: 'M0 -30 L2.6 -24 L-2.6 -24 Z' }));
    /* kepala dan visor */
    G.append(mkn('rect', { class: 'd-badan', x: -9, y: -18, width: 18, height: 12, rx: 4 }));
    G.append(mkn('rect', { class: 'd-visor', x: -6.5, y: -15, width: 13, height: 5, rx: 2.5 }));
    /* lengan */
    G.append(mkn('rect', { class: 'd-badan', x: -15, y: -4, width: 4.5, height: 12, rx: 2 }));
    G.append(mkn('rect', { class: 'd-badan', x: 10.5, y: -4, width: 4.5, height: 12, rx: 2 }));
    /* dada, dengan HURUFNYA */
    G.append(mkn('rect', { class: 'd-badan', x: -11, y: -6, width: 22, height: 18, rx: 4 }));
    G.append(mkn('rect', { class: 'd-dada', x: -7, y: -3, width: 14, height: 12, rx: 2 }));
    const t = mkn('text', { class: 'd-droidTeks', x: 0, y: 7 });
    t.textContent = String.fromCharCode(HURUF[j]);
    G.append(t);
    /* roda rantai */
    G.append(mkn('path', { class: 'd-rantai', d: 'M-12 12 L12 12 L15 18 L-15 18 Z' }));
    G.append(mkn('circle', { class: 'd-roda', cx: -7, cy: 16, r: 2.4 }));
    G.append(mkn('circle', { class: 'd-roda', cx: 0, cy: 16, r: 2.4 }));
    G.append(mkn('circle', { class: 'd-roda', cx: 7, cy: 16, r: 2.4 }));
    g.append(G);
  }

  /* Bongkahan bijih. Bentuknya diundi dari POSISINYA, bukan dari pengacak --
     jadi sebutir bijih di sel yang sama selalu tampak sama, dan menggambar
     ulang papan tidak membuat ladangnya berkedip. */
  function gambarBijih(g, x, y, cx, cy) {
    const h = ((x * 73856093) ^ (y * 19349663)) >>> 0;
    const varian = h % 3, miring = ((h >> 4) % 7) - 3;
    const G = mkn('g', { class: 'd-ore',
      transform: 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) +
                 ') rotate(' + (miring * 4) + ')' });
    G.append(mkn('ellipse', { class: 'd-bayang', cx: 0, cy: 10, rx: 11, ry: 3 }));
    if (varian === 0) {
      G.append(mkn('path', { class: 'd-bijih', d: 'M-10 8 L-6 -6 L3 -9 L10 2 L6 9 Z' }));
      G.append(mkn('path', { class: 'd-bijihSisi', d: 'M-6 -6 L3 -9 L2 2 L-10 8 Z' }));
      G.append(mkn('path', { class: 'd-kilau', d: 'M-4 -4 L1 -6 L0 0 Z' }));
    } else if (varian === 1) {
      G.append(mkn('path', { class: 'd-bijih', d: 'M-9 7 L-10 -3 L-2 -9 L7 -4 L8 6 L0 10 Z' }));
      G.append(mkn('path', { class: 'd-bijihSisi', d: 'M-2 -9 L7 -4 L1 1 L-10 -3 Z' }));
      G.append(mkn('path', { class: 'd-kilau', d: 'M-3 -6 L2 -5 L-1 -1 Z' }));
    } else {
      G.append(mkn('path', { class: 'd-bijih', d: 'M-11 4 L-5 -7 L4 -8 L11 3 L4 9 L-5 9 Z' }));
      G.append(mkn('path', { class: 'd-bijihSisi', d: 'M-5 -7 L4 -8 L6 1 L-6 2 Z' }));
      G.append(mkn('path', { class: 'd-kilau', d: 'M-3 -5 L2 -5 L1 -1 Z' }));
    }
    g.append(G);
  }

  function gambar() {
    gB.textContent = '';
    gB.append(mkn('rect', { class: 'd-latar', x: 0, y: 0, width: 820, height: 580 }));
    for (let y = 0; y < TINGGI; y++)
      for (let x = 0; x < LEBAR; x++) {
        const cx = X0 + x * S, cy = Y0 + y * S;
        gB.append(mkn('rect', { class: 'd-sel', x: cx, y: cy, width: S - 2,
          height: S - 2, rx: 3 }));
        const v = sel[y][x];
        const mx = cx + (S - 2) / 2, my = cy + (S - 2) / 2;
        if (v === ORE) gambarBijih(gB, x, y, mx, my);
        else if (v >= 65) gambarDroid(gB, v - 65, mx, my);
      }
    if (jalur && jalur.length > 1) {
      const d = jalur.map((p, i) => (i ? 'L' : 'M') + (X0 + p[0] * S + (S - 2) / 2) +
        ' ' + (Y0 + p[1] * S + (S - 2) / 2)).join(' ');
      gB.append(mkn('path', { class: 'd-jalur', d: d }));
    }
    if (dipilih >= 0)
      gB.append(mkn('rect', { class: 'd-pilih', x: X0 + dx[dipilih] * S - 2,
        y: Y0 + dy[dipilih] * S - 2, width: S + 2, height: S + 2, rx: 5 }));
    const inf = mkn('text', { class: 'd-info', x: X0, y: Y0 + TINGGI * S + 22 });
    inf.textContent = 'BIJIH TERSISA ' + sisaBijih() + ' / 146' +
      '   ·   GILIRAN ' + (selesai ? '—' : nama[NP]);
    gB.append(inf);
  }

  /* ======================================================================
     Bagian 4 — panel
     ====================================================================== */
  const panel = q('panel');
  function tanya(judul, isi, catatan) {
    panel.textContent = '';
    if (judul) {
      const h = document.createElement('p');
      h.className = 'd-tanya'; h.innerHTML = judul; panel.append(h);
    }
    const row = document.createElement('div');
    row.className = 'd-row';
    isi.forEach(n => row.append(n));
    panel.append(row);
    if (catatan) {
      const p = document.createElement('p');
      p.className = 'd-catatan'; p.innerHTML = catatan; panel.append(p);
    }
  }
  const tombol = (t, fn, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn ' + (k || 'btn--ghost btn--sm');
    b.textContent = t; b.addEventListener('click', fn); return b;
  };
  function tulis(s, kelas) {
    const p = document.createElement('p');
    p.className = 'd-baris' + (kelas ? ' d-' + kelas : '');
    p.textContent = s;
    q('log').append(p); q('log').scrollTop = q('log').scrollHeight;
  }

  function tanyaDroid() {
    if (selesai) return;
    const b = HURUF.map((h, j) => tombol(String.fromCharCode(h),
      () => { dipilih = j; gambar(); tanyaArah(j); }, 'btn--primary btn--sm'));
    tanya(nama[NP] + ', TYPE A DROID\'S SYMBOL',
      b, 'Baris 1580: <b>siapa pun boleh menggerakkan droid mana pun</b>. ' +
         'Angkanya masuk ke skor pemain yang sedang giliran, bukan ke "pemilik" ' +
         'droid — tidak ada pemilik.');
  }

  function tanyaArah(dn) {
    const grid = document.createElement('div');
    grid.className = 'd-arah';
    const susun = ['NW', 'N', 'NE', 'W', '', 'E', 'SW', 'S', 'SE'];
    susun.forEach(a => {
      if (!a) { grid.append(document.createElement('span')); return; }
      const bisa = baca(dx[dn] + ARAH[a][0], dy[dn] + ARAH[a][1]) === ORE;
      grid.append(tombol(a, () => langkah(dn, a),
        bisa ? 'btn--primary btn--sm' : 'btn--ghost btn--sm'));
    });
    tanya('Droid <b>' + String.fromCharCode(HURUF[dn]) +
      '</b> — TYPE A DIRECTION', [grid, tombol('Ganti droid', tanyaDroid)],
      'Arah yang <b>tidak</b> disorot bukan bijih di langkah pertama, jadi ' +
      'menekannya menghasilkan <code>ILLEGAL MOVE</code> dan giliran ' +
      '<b>tidak berpindah</b> (baris 3030 kembali ke 1130). Aslinya tidak ' +
      'menandai mana yang sah — Anda harus melihatnya sendiri di layar.');
  }

  function perbaruiHud() {
    q('s-giliran').textContent = selesai ? '—' : nama[NP];
    q('s-sisa').textContent = sisaBijih();
    q('s-skor').textContent = skor.join(' · ');
    q('s-benih').textContent = benih;
    const r = store.get('rekor');
    q('s-rekor').textContent = (typeof r === 'number') ? r : '—';
  }

  /* ======================================================================
     Bagian 5 — bukti
     ====================================================================== */
  (function bukti() {
    q('b-sel').textContent = LEBAR + ' × ' + TINGGI + ' = ' + (LEBAR * TINGGI);
    q('b-skor').textContent = (LEBAR * TINGGI - 4);
    /* Berapa sering permainan berhenti dengan bijih masih tergeletak?
       Disimulasikan: main asal-asalan sampai buntu, 200 kali. */
    let jumlahSisa = 0, macet = 0, N = 200;
    for (let s = 0; s < N; s++) {
      const r = window.RETRO.rng(s + 1);
      const p = [];
      for (let y = 0; y < TINGGI; y++) p.push(new Array(LEBAR).fill(ORE));
      const px = [], py = [];
      for (let j = 0; j < 4; j++) {
        let x, y, n = 0;
        do { x = Math.floor(r.next() * LEBAR); y = Math.floor(r.next() * TINGGI); n++; }
        while (p[y][x] !== ORE && n < 500);
        px.push(x); py.push(y); p[y][x] = HURUF[j];
      }
      const bc = (x, y) => (x < 0 || y < 0 || x >= LEBAR || y >= TINGGI) ? 0 : p[y][x];
      for (let putar = 0; putar < 4000; putar++) {
        const sah = [];
        for (let j = 0; j < 4; j++)
          for (const a in ARAH)
            if (bc(px[j] + ARAH[a][0], py[j] + ARAH[a][1]) === ORE) sah.push([j, a]);
        if (!sah.length) break;
        const [j, a] = sah[Math.floor(r.next() * sah.length)];
        const [ax, ay] = ARAH[a];
        while (bc(px[j] + ax, py[j] + ay) === ORE) {
          p[py[j]][px[j]] = 0; px[j] += ax; py[j] += ay; p[py[j]][px[j]] = HURUF[j];
        }
      }
      let sisa = 0;
      for (let y = 0; y < TINGGI; y++) for (let x = 0; x < LEBAR; x++)
        if (p[y][x] === ORE) sisa++;
      jumlahSisa += sisa; if (sisa > 0) macet++;
    }
    q('b-macet').textContent = macet + ' dari ' + N + ' (' +
      (100 * macet / N).toFixed(0) + ' %)';
    q('b-rata').textContent = (jumlahSisa / N).toFixed(1) + ' bijih';
    q('b-benih').textContent = (60 * 60).toLocaleString('id-ID');
  })();

  /* ======================================================================
     Bagian 6 — pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'Droids', source: 'DROIDS.BAS · IPCO 2043-A · koreksi John Beck'
  }));
  q('mulai').addEventListener('click', mulai);
  q('benih').addEventListener('change', e => {
    benih = parseInt(e.currentTarget.value, 10) || 0; mulai();
  });
  q('pemain').addEventListener('change', mulai);
  mulai();
})();
