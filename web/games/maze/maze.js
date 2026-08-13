/* ===========================================================================
   maze.js — port dari MAZE.BAS (Friendlyware, 1982).

   Labirin orang-pertama: Anda berdiri di dalam lorong dan hanya melihat apa
   yang ada di depan mata. Ini program paling ambisius di seluruh koleksi.

   ------------------------------------------------------------------------
   TIGA DIMENSI DARI EMPAT BIT PER SEL

   Seluruh labirin adalah `DIM A(7,7)` — 64 sel, masing-masing satu angka.
   Empat bitnya adalah empat dindingnya (baris 400):

       8 = utara   4 = timur   2 = selatan   1 = barat

   Pandangannya dibangun dengan BERJALAN MAJU DI DALAM PETA sampai empat sel,
   menggambar satu bingkai tiap kedalaman, berhenti begitu ada dinding:

       480 ON L+1 GOSUB 940,960,1020,1060,1100
       500 IF L(DIR) THEN RETURN
       510 L=L+1:IF L>4 THEN RETURN
       520 IF DIR=1 THEN X=X-1        ' maju satu sel di dalam peta
       ...

   Lima subrutin, satu per kedalaman. Tidak ada perkalian matriks, tidak ada
   proyeksi, tidak ada trigonometri — hanya lima gambar yang sudah disiapkan
   ukurannya, dipilih oleh sebuah `ON…GOSUB`.

   Itu cara yang benar untuk 4,77 MHz, dan cara yang masih benar sekarang
   kalau sudutnya cuma empat: perspektif yang hanya punya lima kemungkinan
   tidak perlu dihitung, cukup disimpan.

   Di port ini bingkainya DIHITUNG (`half(d) = W0 * k^d`) alih-alih ditulis
   satu per satu — bukan karena lebih benar, tapi karena dengan begitu jumlah
   kedalaman bisa diubah dengan satu angka.

   ------------------------------------------------------------------------
   PINTU KELUAR YANG KOORDINATNYA DI LUAR PETA

       380 IF X=B(2) AND Y=B(3) THEN 580
       390 D=A(S,T)

   Tiap labirin punya tepat satu lubang di dinding luarnya, dan koordinat
   pintu keluarnya berada DI LUAR kisi 8x8 — baris 8, atau kolom -1.

   Perhatikan urutan kedua baris itu. Pemeriksaan pintu keluar terjadi
   sebelum larik disentuh, dan baris 390 memakai `S,T` — posisi LAMA, yang
   selalu di dalam kisi. Jadi koordinat di luar batas itu tidak pernah dipakai
   sebagai indeks.

   Aman, tapi aman karena urutan dua baris. Tukar keduanya dan program membaca
   di luar larik.

   ------------------------------------------------------------------------
   LIMA LABIRIN TETAP

   Program ini tidak membangkitkan labirin; ia menyimpan lima di dalam `DATA`
   dan memilih salah satunya dengan MEMBACA MAJU lalu membuang yang terlewati
   (baris 2370-2400) — karena penunjuk `READ` di BASIC hanya bisa maju.

   Kelimanya diekstrak apa adanya ke `mazes.js`, dan diperiksa: nol dinding
   yang tidak disepakati dua sel bertetangga, tepat satu lubang tepi per
   labirin, dan kelimanya bisa diselesaikan (19 sampai 39 langkah).
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, rng, store } = window.RETRO;
  const MAZES = window.RETRO.MAZES;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';

  /* Arah 1..4 dan bit dindingnya, baris 340-370 dan 400. */
  const STEP = { 1: [-1, 0], 2: [0, 1], 3: [1, 0], 4: [0, -1] };
  const BIT = { 1: 8, 2: 4, 3: 2, 4: 1 };
  const NAME = { 1: 'utara', 2: 'timur', 3: 'selatan', 4: 'barat' };

  const r = rng();
  const db = store('maze');
  let mz, no, x, y, dir, steps, seen, phase, showMap = false;

  const wallAt = (i, j, d) =>
    (i < 0 || i > 7 || j < 0 || j > 7) ? true : !!(mz.cells[i][j] & BIT[d]);

  const turn = (d, delta) => ((d - 1 + delta + 4) % 4) + 1;   // baris 310-320

  /* Jarak terpendek ke pintu keluar — untuk ditampilkan sebagai pembanding.
     Aslinya tidak punya angka ini; ia tidak tahu labirinnya seberapa panjang. */
  function shortest() {
    const dist = {}, q = [[mz.start[0], mz.start[1]]];
    dist[q[0]] = 0;
    while (q.length) {
      const [i, j] = q.shift();
      for (let d = 1; d <= 4; d++) {
        if (wallAt(i, j, d)) continue;
        const ni = i + STEP[d][0], nj = j + STEP[d][1];
        if (ni === mz.exit[0] && nj === mz.exit[1]) return dist[[i, j]] + 1;
        if (ni < 0 || ni > 7 || nj < 0 || nj > 7) continue;
        if (dist[[ni, nj]] !== undefined) continue;
        dist[[ni, nj]] = dist[[i, j]] + 1;
        q.push([ni, nj]);
      }
    }
    return null;
  }

  /* --------------------------------------------------------------------
     Pandangan orang-pertama.

     Lima bingkai bersarang. Bingkai ke-d setengah lebarnya `HW * K^d`;
     dinding samping adalah segi empat yang menghubungkan bingkai d ke d+1.
     Kalau ada bukaan di kiri/kanan, sisi itu digambar gelap alih-alih terang.
     -------------------------------------------------------------------- */
  const VW = 640, VH = 400, CX = 320, CY = 200;
  const HW = 300, VHW = 186, K = 0.52, DEPTH = 4;
  const half = (d) => HW * Math.pow(K, d);
  const vhalf = (d) => VHW * Math.pow(K, d);

  const mk = (tag, a) => {
    const n = document.createElementNS(NS, tag);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const poly = (cls, pts) =>
    mk('polygon', { class: cls, points: pts.map(p => p.join(',')).join(' ') });

  const svg = mk('svg', { viewBox: '0 0 ' + VW + ' ' + VH, class: 'z-view',
                          role: 'img', 'aria-label': 'Pandangan lorong' });
  $('view').append(svg);

  function render() {
    svg.textContent = '';
    let i = x, j = y, d = 0;

    /* Digambar dari JAUH ke DEKAT, supaya yang dekat menutupi yang jauh —
       SVG tidak punya z-index, urutan dokumen itulah urutan lapisan. */
    const layers = [];

    for (d = 0; d <= DEPTH; d++) {
      const o = half(d), o2 = half(d + 1);
      const v = vhalf(d), v2 = vhalf(d + 1);
      const left = turn(dir, -1), right = turn(dir, 1);

      const openL = !wallAt(i, j, left);
      const openR = !wallAt(i, j, right);

      layers.push({ d, i, j, o, o2, v, v2, openL, openR });

      if (wallAt(i, j, dir)) { layers[layers.length - 1].blocked = true; break; }
      const ni = i + STEP[dir][0], nj = j + STEP[dir][1];
      if (ni === mz.exit[0] && nj === mz.exit[1]) {
        layers[layers.length - 1].exitAhead = true; break;
      }
      if (ni < 0 || ni > 7 || nj < 0 || nj > 7) break;
      i = ni; j = nj;
    }

    layers.slice().reverse().forEach(L => {
      const g = mk('g', { class: L.d >= 2 ? 'z-far' : '' });
      // langit-langit dan lantai
      g.append(poly('z-side', [[CX - L.o, CY - L.v], [CX + L.o, CY - L.v],
                               [CX + L.o2, CY - L.v2], [CX - L.o2, CY - L.v2]]));
      g.append(poly('z-side', [[CX - L.o, CY + L.v], [CX + L.o, CY + L.v],
                               [CX + L.o2, CY + L.v2], [CX - L.o2, CY + L.v2]]));
      /* Dinding kiri & kanan — atau bukaan.

         Bukaan tidak cukup digambar "lebih gelap": tanpa tepi, ia terbaca
         sebagai panel datar yang kebetulan gelap. Yang membuatnya terbaca
         sebagai LORONG adalah dua tiang tegak terang di tepi dekat dan tepi
         jauhnya — persis apa yang mata lihat pada ambang pintu sungguhan. */
      const side = (sign, open) => {
        const xa = CX + sign * L.o, xb = CX + sign * L.o2;
        g.append(poly(open ? 'z-open' : 'z-wall',
          [[xa, CY - L.v], [xb, CY - L.v2], [xb, CY + L.v2], [xa, CY + L.v]]));
        if (!open) return;
        g.append(mk('line', { class: 'z-post', x1: xa, y1: CY - L.v, x2: xa, y2: CY + L.v }));
        g.append(mk('line', { class: 'z-post', x1: xb, y1: CY - L.v2, x2: xb, y2: CY + L.v2 }));
      };
      side(-1, L.openL);
      side(1, L.openR);
      // dinding buntu di ujung, atau pintu keluar
      if (L.blocked || L.exitAhead) {
        g.append(mk('rect', {
          class: L.exitAhead ? 'z-exit' : 'z-end',
          x: CX - L.o2, y: CY - L.v2, width: 2 * L.o2, height: 2 * L.v2
        }));
      }
      svg.append(g);
    });
  }

  /* --------------------------------------------------------------------
     Peta. TAMBAHAN — aslinya tidak punya, dan sengaja mati secara bawaan:
     labirin orang-pertama kehilangan seluruh maksudnya kalau petanya
     terbuka. Disediakan karena tanpa itu, seseorang yang ingin MEMBACA
     kodenya tidak punya cara memeriksa bahwa pandangannya benar.
     -------------------------------------------------------------------- */
  function drawPlan() {
    const host = $('plan');
    host.textContent = '';
    if (!showMap) return;
    const g = ui.el('div', { class: 'z-plan' });
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const c = mz.cells[i][j];
      const cls = ['z-cell'];
      if (c & 8) cls.push('w-n');
      if (c & 4) cls.push('w-e');
      if (c & 2) cls.push('w-s');
      if (c & 1) cls.push('w-w');
      if (seen.has(i + ',' + j)) cls.push('is-seen');
      /* Sel yang bersebelahan dengan lubang di dinding luar — dari sinilah
         Anda melangkah keluar. Petanya toh sudah membuka seluruh dinding,
         jadi menyembunyikan pintu keluarnya hanya menyisakan pekerjaan
         menelusuri tepi dengan mata. */
      for (let d = 1; d <= 4; d++) {
        if (mz.cells[i][j] & BIT[d]) continue;
        if (i + STEP[d][0] === mz.exit[0] && j + STEP[d][1] === mz.exit[1]) {
          cls.push('is-exit');
        }
      }
      if (i === x && j === y) cls.push('is-here');
      const cell = ui.el('div', { class: cls.join(' '), title: 'A(' + i + ',' + j + ') = ' + c });
      if (i === x && j === y) {
        cell.style.setProperty('--rot', ((dir - 1) * 90) + 'deg');
      }
      g.append(cell);
    }
    host.append(g);
  }

  function drawBits() {
    const host = $('bits');
    host.textContent = '';
    const c = mz.cells[x][y];
    [[8, 'utara'], [4, 'timur'], [2, 'selatan'], [1, 'barat']].forEach(([b, n]) => {
      const on = !!(c & b);
      const el = ui.el('div', { class: 'z-bit' + (on ? ' z-bit--on' : '') });
      el.append(ui.el('b', { text: on ? b : 0 }), ui.el('span', { text: n }));
      host.append(el);
    });
  }

  function say(t, kind) {
    $('say').textContent = t;
    $('say').className = 'z-say' + (kind ? ' z-say--' + kind : '');
  }

  function refresh() {
    render(); drawPlan(); drawBits();
    $('sStep').textContent = steps;
  }

  /* --------------------------------------------------------------------
     Gerak
     -------------------------------------------------------------------- */
  function forward() {
    if (phase !== 'play') return;
    const ni = x + STEP[dir][0], nj = y + STEP[dir][1];

    // baris 380: pintu keluar diperiksa SEBELUM larik disentuh
    if (ni === mz.exit[0] && nj === mz.exit[1]) {
      steps++;
      phase = 'won';
      say('Anda keluar dalam ' + steps + ' langkah!', 'win');
      audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true });
      const best = db.get('best', null);
      if (best === null || steps < best) { db.set('best', steps); showBest(); }
      refresh();
      return;
    }
    if (wallAt(x, y, dir)) {
      // baris 410: delapan kali SOUND 300 / 50 — bunyi menabrak
      for (let k = 0; k < 4; k++) {
        setTimeout(() => { audio.sound(300, 1); }, k * 60);
        setTimeout(() => { audio.sound(50, 1); }, k * 60 + 30);
      }
      say('Dinding.', 'bad');
      return;
    }
    x = ni; y = nj; steps++;
    seen.add(x + ',' + y);
    audio.play('MB T240 O3 L64 c', { fresh: true });
    say('Anda menghadap ' + NAME[dir] + '.');
    refresh();
  }

  function rotate(delta) {
    if (phase !== 'play') return;
    dir = turn(dir, delta);
    say('Anda menghadap ' + NAME[dir] + '.');
    audio.play('MB T240 O2 L64 e', { fresh: true });
    refresh();
  }

  /* --------------------------------------------------------------------
     Memilih labirin.

     Aslinya membaca maju sebanyak FIX(RND*5)+1 blok lalu membuang sisanya.
     Di sini kelimanya sudah ada di memori, jadi tinggal diindeks — tapi
     angkanya tetap 1..5 dan pengacaknya disemai SEKALI, bukan tiga kali
     dari keluarannya sendiri (lihat catatan baris 2350-2360).
     -------------------------------------------------------------------- */
  function pick(n) {
    no = n === undefined ? r.int(MAZES.length) + 1 : n;
    mz = MAZES[no - 1];
    // baris 2410: separuh kemungkinan memakai titik mulai alternatif
    const alt = r.next() < 0.5;
    x = alt ? mz.altStart[0] : mz.start[0];
    y = alt ? mz.altStart[1] : mz.start[1];
    dir = alt ? mz.altDir : mz.dir;
    steps = 0; phase = 'play';
    seen = new Set([x + ',' + y]);
    $('sNo').textContent = no;
    $('sBestPath').textContent = shortest() === null ? '—' : shortest();
    say('Anda menghadap ' + NAME[dir] + '.');
    refresh();
  }

  const showBest = () => {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b;
  };

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Maze',
    source: 'MAZE.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  $('fwd').addEventListener('click', forward);
  $('left').addEventListener('click', () => rotate(-1));
  $('right').addEventListener('click', () => rotate(1));
  $('back').addEventListener('click', () => rotate(2));      // baris 270: DIR+2
  $('again').addEventListener('click', () => pick());
  /* Satu fungsi, dua pemicu. Tombol dan tuts M harus selalu sepakat soal
     keadaan peta — kalau logikanya disalin dua kali, cepat atau lambat salah
     satunya lupa diperbarui. */
  function toggleMap() {
    showMap = !showMap;
    $('map').setAttribute('aria-pressed', showMap ? 'true' : 'false');
    $('map').textContent = showMap ? 'Sembunyikan peta (M)' : 'Tampilkan peta (M)';
    $('plan').classList.toggle('hidden', !showMap);
    drawPlan();
  }
  $('map').addEventListener('click', toggleMap);
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Jumlah langkah terbaik dihapus.')) return;
    db.set('best', null); showBest();
  });

  /* Baris 260-290 menerima panah DAN angka 8/4/6/2 — keduanya dipertahankan. */
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const k = e.key;
    if (k === 'ArrowUp' || k === '8')    { e.preventDefault(); return forward(); }
    if (k === 'ArrowLeft' || k === '4')  { e.preventDefault(); return rotate(-1); }
    if (k === 'ArrowRight' || k === '6') { e.preventDefault(); return rotate(1); }
    if (k === 'ArrowDown' || k === '2')  { e.preventDefault(); return rotate(2); }
    if (k === 'm' || k === 'M')          { e.preventDefault(); return toggleMap(); }
  });

  showBest();
  pick();
})();
