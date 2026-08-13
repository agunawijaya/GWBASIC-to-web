/* ===========================================================================
   studio.js — ASCII Studio

   Versi MODERN dari DRAW.BAS. Port setianya ada di `games/draw/` dan tidak
   disentuh; berkas ini mengambil satu temuan dari sana dan membangun di
   atasnya.

   Temuan itu: palet DRAW.BAS bukan lima puluh benda melainkan DUA PULUH LIMA
   PASANG, dan pasangan garisnya -- sudut, sambungan T, silang -- adalah
   potongan yang saling menyambung. Kalau potongannya saling menyambung, maka
   komputer bisa memilihkan potongan yang benar sendiri: untuk tiap sel cukup
   dilihat tetangga mana yang juga berisi garis, lalu glifnya diambil dari
   tabel enam belas kemungkinan. Itulah yang membuat alat GARIS, KOTAK, dan
   ELIPS di sini menyambung rapi tanpa pemakai memilih sudut satu per satu.

   Semua yang lain -- tetikus, undo, isi-ember, pipet, ekspor teks -- adalah
   perkakas biasa. Yang satu itu yang berasal dari programnya.
   =========================================================================== */
(function () {
  'use strict';

  const ui = window.RETRO.ui;
  const store = window.RETRO.store('draw-studio');
  const q = (id) => document.getElementById(id);

  /* ======================================================================
     Bagian 1 — glif
     ====================================================================== */
  const CP = {
    1:'☺',2:'☻',3:'♥',4:'♦',5:'♣',6:'♠',15:'☼',16:'►',17:'◄',24:'↑',25:'↓',
    26:'→',27:'←',32:' ',157:'¥',174:'«',175:'»',176:'░',177:'▒',178:'▓',
    179:'│',180:'┤',185:'╣',186:'║',187:'╗',188:'╝',191:'┐',192:'└',193:'┴',
    194:'┬',195:'├',196:'─',197:'┼',200:'╚',201:'╔',202:'╩',203:'╦',204:'╠',
    205:'═',206:'╬',217:'┘',218:'┌',219:'█',220:'▄',221:'▌',222:'▐',223:'▀',
    247:'≈',248:'°',249:'∙',250:'·'
  };
  const glif = (k) => CP[k] || ((k >= 32 && k < 127) ? String.fromCharCode(k) : ' ');

  /* Tabel penyambung. Bit 1=utara, 2=timur, 4=selatan, 8=barat.
     Indeksnya = jumlah bit tetangga yang juga berisi garis segaya. */
  const TUNGGAL = [32,179,196,192,179,179,218,195,196,217,196,193,191,180,194,197];
  const GANDA   = [32,186,205,200,186,186,201,204,205,188,205,202,187,185,203,206];
  const SET_TUNGGAL = new Set(TUNGGAL.slice(1));
  const SET_GANDA = new Set(GANDA.slice(1));

  /* Palet yang bisa diklik: pasangan asli DRAW.BAS + beberapa yang berguna. */
  const PALET = [
    ['garis tunggal', [196,179,218,191,192,217,195,180,194,193,197]],
    ['garis ganda',   [205,186,201,187,200,188,204,185,203,202,206]],
    ['blok & naungan',[219,178,177,176,223,220,221,222]],
    ['tanda',         [16,17,24,25,26,27,175,174,15,248,249,250,247,157]],
    ['simbol',        [6,4,3,5,1,2]]
  ];

  const CGA = ['#000000','#0000aa','#00aa00','#00aaaa','#aa0000','#aa00aa',
               '#aa5500','#aaaaaa','#555555','#5555ff','#55ff55','#55ffff',
               '#ff5555','#ff55ff','#ffff55','#ffffff'];

  /* ======================================================================
     Bagian 2 — keadaan
     ====================================================================== */
  const KOL = 80, BAR = 25;
  let sel = [], pratinjau = null;
  let alat = 'pensil', glifAktif = 219, fg = 15, bg = 0;
  let gaya = 'tunggal';                 /* untuk alat garis/kotak/elips */
  let mulaiX = 0, mulaiY = 0, seret = false;
  let riwayat = [], maju = [];

  const kosongSel = () => ({ k: 32, f: 7, b: 0 });
  function kosong() {
    sel = [];
    for (let y = 0; y < BAR; y++) {
      const r = []; for (let x = 0; x < KOL; x++) r.push(kosongSel());
      sel.push(r);
    }
  }
  const salin = (s) => s.map(r => r.map(c => ({ k: c.k, f: c.f, b: c.b })));
  function simpanRiwayat() {
    riwayat.push(salin(sel));
    if (riwayat.length > 60) riwayat.shift();
    maju = [];
    perbaruiTombol();
  }
  function perbaruiTombol() {
    q('undo').disabled = !riwayat.length;
    q('redo').disabled = !maju.length;
  }

  /* ======================================================================
     Bagian 3 — alat
     ====================================================================== */
  const dalam = (x, y) => x >= 0 && y >= 0 && x < KOL && y < BAR;
  function tulis(buf, x, y, k) {
    if (!dalam(x, y)) return;
    buf[y][x] = { k: k, f: fg, b: bg };
  }

  /* Bresenham. Dipakai alat GARIS dan juga sapuan tetikus supaya gerakan
     cepat tidak meninggalkan lubang. */
  function garis(buf, x0, y0, x1, y1, pakai) {
    let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx + dy;
    for (;;) {
      pakai(buf, x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  /* Elips titik-tengah, digambar sebagai garis penyambung. */
  function elips(buf, x0, y0, x1, y1, pakai) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const rx = Math.abs(x1 - x0) / 2, ry = Math.abs(y1 - y0) / 2;
    if (rx < 0.5 || ry < 0.5) { garis(buf, x0, y0, x1, y1, pakai); return; }
    const n = Math.max(24, Math.round((rx + ry) * 4));
    let px = null, py = null;
    for (let i = 0; i <= n; i++) {
      const t = i / n * Math.PI * 2;
      const x = Math.round(cx + rx * Math.cos(t));
      const y = Math.round(cy + ry * Math.sin(t));
      /* SELALU sambungkan titik berurutan, bukan hanya kalau lompatannya
         lebih dari satu sel. Kalau tidak, langkah diagonal meninggalkan sel
         yang tetangga tegak-lurusnya kosong -- penyambungnya lalu tidak
         punya apa-apa untuk disambung, dan elipsnya keluar sebagai deretan
         setrip terputus. */
      if (px !== null) garis(buf, px, py, x, y, pakai); else pakai(buf, x, y);
      px = x; py = y;
    }
  }

  /* Isi-ember: sebar-lebar dari sel awal ke semua sel bertetangga yang
     glif DAN warnanya sama. */
  function isi(buf, x, y) {
    const a = buf[y][x], target = { k: a.k, f: a.f, b: a.b };
    if (target.k === glifAktif && target.f === fg && target.b === bg) return;
    const antre = [[x, y]], lihat = new Set();
    while (antre.length) {
      const [px, py] = antre.pop();
      const kunci = py * KOL + px;
      if (!dalam(px, py) || lihat.has(kunci)) continue;
      const c = buf[py][px];
      if (c.k !== target.k || c.f !== target.f || c.b !== target.b) continue;
      lihat.add(kunci);
      buf[py][px] = { k: glifAktif, f: fg, b: bg };
      antre.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
  }

  /* Penyambung: tandai sel sebagai "garis", lalu pilih glifnya dari tetangga.
     Inilah bagian yang berasal dari temuan pasangan palet DRAW.BAS. */
  function tandaiGaris(buf, x, y) {
    if (!dalam(x, y)) return;
    buf[y][x] = { k: -1, f: fg, b: bg };            /* -1 = "garis, belum dipilih" */
  }
  const adalahGaris = (buf, x, y) => {
    if (!dalam(x, y)) return false;
    const k = buf[y][x].k;
    if (k === -1) return true;
    return gaya === 'ganda' ? SET_GANDA.has(k) : SET_TUNGGAL.has(k);
  };
  function sambungkan(buf) {
    const tabel = gaya === 'ganda' ? GANDA : TUNGGAL;
    const perlu = [];
    for (let y = 0; y < BAR; y++)
      for (let x = 0; x < KOL; x++) if (buf[y][x].k === -1) perlu.push([x, y]);
    perlu.forEach(([x, y]) => {
      let m = 0;
      if (adalahGaris(buf, x, y - 1)) m |= 1;
      if (adalahGaris(buf, x + 1, y)) m |= 2;
      if (adalahGaris(buf, x, y + 1)) m |= 4;
      if (adalahGaris(buf, x - 1, y)) m |= 8;
      buf[y][x] = { k: tabel[m] || tabel[10], f: buf[y][x].f, b: buf[y][x].b };
    });
  }

  /* Satu alat, dijalankan ke sebuah penyangga. */
  function jalankanAlat(buf, x0, y0, x1, y1, sedangSeret) {
    const titik = (b, x, y) => tulis(b, x, y, glifAktif);
    const sambung = (b, x, y) => tandaiGaris(b, x, y);
    if (alat === 'pensil') garis(buf, x0, y0, x1, y1, titik);
    else if (alat === 'hapus') {
      const h = (b, x, y) => { if (dalam(x, y)) b[y][x] = kosongSel(); };
      garis(buf, x0, y0, x1, y1, h);
    }
    else if (alat === 'garis') { garis(buf, x0, y0, x1, y1, sambung); sambungkan(buf); }
    else if (alat === 'kotak' || alat === 'kotakIsi') {
      const ax = Math.min(x0, x1), bx = Math.max(x0, x1);
      const ay = Math.min(y0, y1), by = Math.max(y0, y1);
      if (alat === 'kotakIsi')
        for (let y = ay + 1; y < by; y++)
          for (let x = ax + 1; x < bx; x++) tulis(buf, x, y, glifAktif);
      for (let x = ax; x <= bx; x++) { sambung(buf, x, ay); sambung(buf, x, by); }
      for (let y = ay; y <= by; y++) { sambung(buf, ax, y); sambung(buf, bx, y); }
      sambungkan(buf);
    }
    else if (alat === 'elips') { elips(buf, x0, y0, x1, y1, sambung); sambungkan(buf); }
    else if (alat === 'isi') { if (!sedangSeret) isi(buf, x1, y1); }
    else if (alat === 'pipet') {
      if (!sedangSeret && dalam(x1, y1)) {
        const c = buf[y1][x1];
        if (c.k !== 32) { glifAktif = c.k; fg = c.f; bg = c.b; segarKontrol(); }
      }
    }
    else if (alat === 'teks') { /* ditangani papan ketik */ }
  }

  /* ======================================================================
     Bagian 4 — gambar
     ====================================================================== */
  const kanvas = q('kanvas');
  let node = [];
  function bangun() {
    kanvas.textContent = '';
    node = [];
    for (let y = 0; y < BAR; y++) {
      const b = document.createElement('div');
      b.className = 'p-baris';
      const rr = [];
      for (let x = 0; x < KOL; x++) {
        const s = document.createElement('span');
        s.className = 'p-sel'; s.dataset.x = x; s.dataset.y = y;
        b.append(s); rr.push(s);
      }
      kanvas.append(b); node.push(rr);
    }
  }
  function lukis() {
    const buf = pratinjau || sel;
    for (let y = 0; y < BAR; y++)
      for (let x = 0; x < KOL; x++) {
        const c = buf[y][x], e = node[y][x];
        const g = c.k === -1 ? '·' : glif(c.k);
        if (e.textContent !== g) e.textContent = g;
        e.style.color = CGA[c.f]; e.style.background = CGA[c.b];
      }
    q('s-isi').textContent = sel.reduce((s, r) =>
      s + r.filter(c => c.k !== 32).length, 0);
  }

  /* ======================================================================
     Bagian 5 — tetikus
     ====================================================================== */
  /* Sel dihitung dari KOORDINAT, bukan dari `ev.target`.

     Versi pertama memakai `ev.target.closest('.p-sel')`. Itu bekerja untuk
     `pointerdown`, lalu berhenti bekerja: `setPointerCapture` membuat seluruh
     kejadian berikutnya menyasar elemen yang menangkap -- yaitu kanvasnya --
     bukan sel di bawah penunjuk. Jadi `pointermove` dan `pointerup` selalu
     mendapat null, seretannya tidak pernah menemukan sel, dan tidak ada yang
     tergambar sama sekali. Menghitung dari persegi pembatas kebal terhadap
     itu, dan sekaligus benar waktu penunjuk keluar-masuk tepi kanvas. */
  const selDari = (ev) => {
    const r = kanvas.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const x = Math.floor((ev.clientX - r.left) / (r.width / KOL));
    const y = Math.floor((ev.clientY - r.top) / (r.height / BAR));
    if (x < 0 || y < 0 || x >= KOL || y >= BAR) return null;
    return [x, y];
  };
  kanvas.addEventListener('pointerdown', ev => {
    const p = selDari(ev); if (!p) return;
    ev.preventDefault(); kanvas.setPointerCapture(ev.pointerId);
    simpanRiwayat();
    mulaiX = p[0]; mulaiY = p[1]; seret = true;
    if (alat === 'teks') { karX = p[0]; karY = p[1]; seret = false; lukis(); return; }
    pratinjau = salin(sel);
    jalankanAlat(pratinjau, mulaiX, mulaiY, mulaiX, mulaiY, true);
    lukis();
  });
  kanvas.addEventListener('pointermove', ev => {
    const p = selDari(ev);
    if (p) q('s-pos').textContent = 'x ' + (p[0] + 1) + ', y ' + (p[1] + 1);
    if (!seret || !p) return;
    pratinjau = salin(sel);
    if (alat === 'pensil' || alat === 'hapus') {
      jalankanAlat(pratinjau, mulaiX, mulaiY, p[0], p[1], true);
      sel = salin(pratinjau);                 /* sapuan bebas langsung tetap */
      mulaiX = p[0]; mulaiY = p[1];
      pratinjau = null;
    } else jalankanAlat(pratinjau, mulaiX, mulaiY, p[0], p[1], true);
    lukis();
  });
  const lepas = (ev) => {
    if (!seret) return;
    seret = false;
    const p = selDari(ev) || [mulaiX, mulaiY];
    if (pratinjau) { pratinjau = null; }
    const buf = salin(sel);
    if (alat !== 'pensil' && alat !== 'hapus')
      jalankanAlat(buf, mulaiX, mulaiY, p[0], p[1], false);
    sel = buf; lukis();
  };
  kanvas.addEventListener('pointerup', lepas);
  kanvas.addEventListener('pointercancel', lepas);

  /* ======================================================================
     Bagian 6 — alat teks
     ====================================================================== */
  let karX = 0, karY = 0;
  document.addEventListener('keydown', ev => {
    if (ev.ctrlKey && ev.key.toLowerCase() === 'z') { ev.preventDefault(); undo(); return; }
    if (ev.ctrlKey && ev.key.toLowerCase() === 'y') { ev.preventDefault(); redo(); return; }
    if (alat !== 'teks') return;
    if (ev.key.length === 1) {
      simpanRiwayat();
      tulis(sel, karX, karY, ev.key.charCodeAt(0));
      karX += 1; if (karX >= KOL) { karX = 0; karY += 1; }
      ev.preventDefault(); lukis();
    } else if (ev.key === 'Enter') { karX = 0; karY += 1; ev.preventDefault(); }
    else if (ev.key === 'Backspace') {
      simpanRiwayat(); karX = Math.max(0, karX - 1);
      if (dalam(karX, karY)) sel[karY][karX] = kosongSel();
      ev.preventDefault(); lukis();
    }
  });

  /* ======================================================================
     Bagian 7 — antarmuka
     ====================================================================== */
  function bilahGlif() {
    const b = q('glif'); b.textContent = '';
    PALET.forEach(([nama, kode]) => {
      const g = document.createElement('div');
      g.className = 'p-grup';
      const t = document.createElement('span');
      t.className = 'p-grupLabel'; t.textContent = nama; g.append(t);
      kode.forEach(k => {
        const s = document.createElement('button');
        s.type = 'button'; s.className = 'p-glif'; s.textContent = glif(k);
        s.dataset.k = k;
        s.addEventListener('click', () => { glifAktif = k; segarKontrol(); });
        g.append(s);
      });
      b.append(g);
    });
  }
  function bilahWarna() {
    [['fgbar', 16, (i) => { fg = i; segarKontrol(); }],
     ['bgbar', 8, (i) => { bg = i; segarKontrol(); }]].forEach(([id, n, fn]) => {
      const b = q(id); b.textContent = '';
      for (let i = 0; i < n; i++) {
        const s = document.createElement('button');
        s.type = 'button'; s.className = 'p-warna'; s.dataset.i = i;
        s.style.background = CGA[i]; s.title = 'warna ' + i;
        s.addEventListener('click', () => fn(i));
        b.append(s);
      }
    });
  }
  function segarKontrol() {
    document.querySelectorAll('#glif .p-glif').forEach(e =>
      e.classList.toggle('p-aktif', Number(e.dataset.k) === glifAktif));
    document.querySelectorAll('#fgbar .p-warna').forEach(e =>
      e.classList.toggle('p-aktif', Number(e.dataset.i) === fg));
    document.querySelectorAll('#bgbar .p-warna').forEach(e =>
      e.classList.toggle('p-aktif', Number(e.dataset.i) === bg));
    document.querySelectorAll('#alat button').forEach(e =>
      e.classList.toggle('p-aktif', e.dataset.a === alat));
    document.querySelectorAll('#gaya button').forEach(e =>
      e.classList.toggle('p-aktif', e.dataset.g === gaya));
    q('s-alat').textContent = alat;
    q('s-glif').textContent = glif(glifAktif) + '  (' + glifAktif + ')';
    q('s-warna').textContent = fg + ' / ' + bg;
    kanvas.classList.toggle('p-kanvas--teks', alat === 'teks');
  }
  function undo() {
    if (!riwayat.length) return;
    maju.push(salin(sel)); sel = riwayat.pop(); pratinjau = null;
    lukis(); perbaruiTombol();
  }
  function redo() {
    if (!maju.length) return;
    riwayat.push(salin(sel)); sel = maju.pop(); pratinjau = null;
    lukis(); perbaruiTombol();
  }

  /* Ekspor: teks murni, baris kanan dipangkas. */
  function keTeks() {
    return sel.map(r => r.map(c => glif(c.k)).join('').replace(/\s+$/, ''))
      .join('\n').replace(/\n+$/, '');
  }

  /* ======================================================================
     Bagian 8 — pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'ASCII Studio', source: 'turunan modern dari DRAW.BAS · 1982'
  }));
  kosong(); bangun(); bilahGlif(); bilahWarna(); segarKontrol(); lukis();
  perbaruiTombol();

  q('alat').addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    alat = b.dataset.a; segarKontrol();
  });
  q('gaya').addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    gaya = b.dataset.g; segarKontrol();
  });
  q('undo').addEventListener('click', undo);
  q('redo').addEventListener('click', redo);
  q('bersih').addEventListener('click', () => { simpanRiwayat(); kosong(); lukis(); });
  q('salin').addEventListener('click', () => {
    const t = keTeks();
    q('keluaran').value = t; q('keluaran').hidden = false;
    q('keluaran').select();
    try { navigator.clipboard.writeText(t); q('pesan').textContent =
      'Disalin ke papan klip (' + t.split('\n').length + ' baris).'; }
    catch (e) { q('pesan').textContent = 'Teks ada di kotak di bawah — salin sendiri.'; }
  });
  q('simpan').addEventListener('click', () => {
    const n = (q('nama').value || 'GAMBAR').toUpperCase().slice(0, 16).trim();
    const d = store.get('karya') || {};
    d[n] = sel.map(r => r.map(c => [c.k, c.f, c.b]));
    store.set('karya', d); daftar();
    q('pesan').textContent = 'Tersimpan: ' + n;
  });
  function daftar() {
    const d = store.get('karya') || {};
    const nm = Object.keys(d).sort();
    q('daftar').innerHTML = nm.length ? nm.map(n =>
      '<span class="p-file"><button type="button" data-n="' + n +
      '" class="btn btn--ghost btn--sm">' + n + '</button>' +
      '<button type="button" data-h="' + n +
      '" class="btn btn--ghost btn--sm p-x">×</button></span>').join('')
      : '<span class="p-kecil">belum ada karya tersimpan</span>';
    q('daftar').querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => {
      simpanRiwayat();
      sel = (store.get('karya') || {})[b.dataset.n]
        .map(r => r.map(a => ({ k: a[0], f: a[1], b: a[2] })));
      lukis(); q('pesan').textContent = 'Dimuat: ' + b.dataset.n;
    }));
    q('daftar').querySelectorAll('[data-h]').forEach(b => b.addEventListener('click', () => {
      const d2 = store.get('karya') || {}; delete d2[b.dataset.h];
      store.set('karya', d2); daftar();
    }));
  }
  daftar();

  q('demo').addEventListener('click', () => {
    simpanRiwayat(); kosong();
    const simpanAlat = alat, simpanGaya = gaya, simpanGlif = glifAktif;
    const simpanFg = fg, simpanBg = bg;
    alat = 'kotak'; gaya = 'ganda'; fg = 11;
    jalankanAlat(sel, 2, 1, 77, 23, false);
    gaya = 'tunggal'; fg = 10;
    alat = 'kotak'; jalankanAlat(sel, 5, 3, 38, 12, false);
    alat = 'elips'; fg = 13; jalankanAlat(sel, 44, 3, 74, 12, false);
    alat = 'garis'; fg = 14;
    jalankanAlat(sel, 8, 16, 70, 16, false);
    jalankanAlat(sel, 39, 14, 39, 21, false);
    alat = 'isi'; glifAktif = 176; fg = 8;
    isi(sel, 20, 8);
    alat = simpanAlat; gaya = simpanGaya; glifAktif = simpanGlif;
    fg = simpanFg; bg = simpanBg;
    const judul = 'ASCII STUDIO';
    for (let i = 0; i < judul.length; i++)
      sel[19][34 + i] = { k: judul.charCodeAt(i), f: 15, b: 0 };
    segarKontrol(); lukis();
    q('pesan').textContent = 'Kotak, elips, dan garis — sudutnya dipilih sendiri.';
  });
})();
