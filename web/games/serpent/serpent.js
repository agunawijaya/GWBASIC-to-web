/* ===========================================================================
   serpent.js — port dari SERPENT.BAS (6 Oktober 1982, kode build USR-5-5-K).

   ------------------------------------------------------------------------
   ULAR TANPA LARIK ULAR

   Cari larik tubuh di 64 baris program itu. Tidak ada. Satu-satunya larik
   yang dideklarasikan — PX, PY, PX1, PY1 — berindeks 1..2 dan berisi posisi
   serta arah DUA MUSUH. `LE` cuma pencacah panjang.

   Lalu bagaimana ekornya tahu jalan? Ia MEMBACA LAYAR:

       690 S=SCREEN(EY,EX):LOCATE EY,EX:PRINT " ";
       700 IF S=179 THEN EY=EY+Y2 ELSE IF S=196 THEN EX=EX+X2
       710 IF S=191 THEN IF X2=1 THEN X2=0:Y2=1:EY=EY+Y2 ELSE …
       720 IF S=192 THEN …
       730 IF S=217 THEN …
       740 IF S=218 THEN …

   Enam glif, enam aturan. Glif SUDUT memberi tahu penghapus ke mana ular dulu
   berbelok. Jadi bentuk tubuhnya hidup sepenuhnya sebagai aksara di memori
   layar, dan penghapus ekor adalah penelusur senarai berantai yang simpulnya
   adalah piksel.

   Yang dihemat nyata: ular panjang 200 butuh 200 pasangan koordinat — di
   BASIC 1982 itu 3.200 bita larik presisi ganda. Layar teks 40x25 yang SUDAH
   ADA menyimpan bentuk yang sama secara gratis.

   Port ini MENIRU strukturnya, bukan menggantinya: ada petak 25x40 berisi
   kode aksara, kepala menulis glif ke sana, dan penghapus ekor membacanya
   kembali. Kalau petak itu diganti dengan larik koordinat, port-nya akan
   lebih pendek dan kehilangan seluruh alasannya ada.

   ------------------------------------------------------------------------
   YANG MEMBUNUH BUKAN DINDING, MELAINKAN RENTANG KODE

       630 S=SCREEN(HY,HX):IF S<219 AND S>178 OR S=235 THEN 860

   Tidak ada daftar benda mematikan — hanya rentang kode aksara 179..218
   ditambah 235. Keenam glif tubuh kebetulan semuanya di dalamnya, dan `█`
   (219) tepat di luarnya. Tepi layar ditangani terpisah di baris 620.

   `S=235` (δ) tidak pernah digambar program ini. Sisa versi sebelumnya.

   ------------------------------------------------------------------------
   PROGRAM YANG MENYALAKAN NUMLOCK PEMAKAINYA

       500 …DEF SEG=0:POKE 1047,32

   1047 = 0040:0017, bita bendera papan ketik BIOS; bit ke-5 = NumLock. Arah
   dibaca lewat `A=VAL(INKEY$)` dengan 4/6/2/8, dan tuts angka hanya mengetik
   angka saat NumLock menyala. Jadi program ini menyalakannya sendiri dengan
   menulis ke memori BIOS — dan tidak pernah mengembalikannya.

   Di port, panah DAN angka sama-sama jalan; tidak ada yang perlu dipaksa.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();

  /* `el.hidden = true` bekerja untuk elemen HTML, TAPI TIDAK untuk elemen SVG:
     `hidden` adalah properti IDL milik HTMLElement, dan pada SVGElement ia cuma
     jadi properti JavaScript biasa yang tidak pernah terpantul ke atribut.
     Akibatnya `<svg>` tetap tergambar, dan kedua penampil muncul sekaligus —
     dilaporkan pemilik koleksi.

     Menyetel ATRIBUT-nya bekerja untuk keduanya. */
  const sembunyikan = (el, ya) => {
    if (ya) el.setAttribute('hidden', ''); else el.removeAttribute('hidden');
  };
  const $ = (id) => document.getElementById(id);
  const db = store('serpent');

  const KOL = 40, BARIS = 25;

  /* Kode aksara CP437, apa adanya dari programnya. */
  const KOSONG = 32;
  const V = 179, H = 196, TL = 218, TR = 191, BL = 192, BR = 217;   // glif tubuh
  const APEL = 148, MUSUH = 162, DINDING = 219, LABIRIN = 28;
  /* Kodok mangsa: TAMBAHAN, tidak ada di aslinya. Kodenya dipilih 164 karena
     ia di luar rentang mematikan 179..218 baris 630 — jadi menambahkannya
     tidak bisa diam-diam membunuh pemain, jebakan yang sudah dibahas di §2
     dokumennya. */
  const KODOK_MANGSA = 164;

  const GLIF = {
    32: ' ', 179: '│', 196: '─', 218: '┌', 191: '┐', 192: '└', 217: '┘',
    148: 'ö', 162: 'ó', 164: 'ñ', 219: '█', 28: '∙'
  };

  /* Baris 630: mati kalau 178 < kode < 219, atau kode 235. */
  const mematikan = (s) => (s > 178 && s < 219) || s === 235;

  /* --- petak layar: INI struktur datanya, bukan cache tampilan ----------- */
  let petak = [];
  const at = (r, c) => petak[(r - 1) * KOL + (c - 1)];
  const set = (r, c, kode) => {
    if (r < 1 || r > BARIS || c < 1 || c > KOL) return;
    petak[(r - 1) * KOL + (c - 1)] = kode;
  };

  const acak = rng();

  let hx = 1, hy = 1, x1 = 1, y1 = 0;        // kepala & arahnya
  let ex = 1, ey = 1, x2 = 1, y2 = 0;        // penghapus ekor & arahnya
  let le = 10, panjang = 10;                 // baris 510: L=10
  let skor = 0, nyawa = 3, apel = 0, dl = 0, p = 0;
  let musuh = [];          // kodok beracun — baris 530 aslinya
  let mangsa = [];         // kodok mangsa — tambahan
  let main = false, selesai = false, lihatEkor = false, modeGlif = false;
  let bacaTerakhir = 0;

  /* Antrean arah: diisi saat tombol DITEKAN, dikonsumsi satu per langkah.
     Dibatasi tiga supaya ketukan beruntun tidak menumpuk jadi belokan yang
     baru terjadi beberapa detik kemudian. */
  const antreanArah = [];
  const ANTREAN_MAKS = 3;

  const bunyi = (f, t) => { if ($('bunyi').checked) audio.sound(f, t); };

  /* --- menggambar -------------------------------------------------------- */
  const scr = $('layar');
  let barisEl = [];

  function bangunDom() {
    scr.textContent = '';
    barisEl = [];
    for (let r = 0; r < BARIS; r++) {
      const el = document.createElement('span');
      el.className = 'n-scr__row';
      scr.append(el);
      barisEl.push(el);
    }
  }

  function kelasKode(kode, r, c) {
    if (r === hy && c === hx) return 'n-kepala';
    if (kode === APEL) return 'n-apel';
    if (kode === MUSUH) return 'n-musuh';
    if (kode === DINDING) return 'n-dinding';
    if (kode === LABIRIN) return 'n-labirin';
    if (kode !== KOSONG) return 'n-tubuh';
    return '';
  }

  const esc = (s) => s.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));

  function gambar() {
    for (let r = 1; r <= BARIS; r++) {
      let html = '', mulai = 1, kelasKini = null;
      for (let c = 1; c <= KOL + 1; c++) {
        const kode = c <= KOL ? at(r, c) : -1;
        let k = c <= KOL ? kelasKode(kode, r, c) : null;
        if (lihatEkor && c === ex && r === ey) k = (k || '') + ' n-ekor';
        if (k !== kelasKini) {
          if (kelasKini !== null) {
            let teks = '';
            for (let i = mulai; i < c; i++) teks += GLIF[at(r, i)] || ' ';
            html += kelasKini ? '<span class="' + kelasKini + '">' + esc(teks) + '</span>'
                              : esc(teks);
          }
          kelasKini = k; mulai = c;
        }
      }
      barisEl[r - 1].innerHTML = html;
    }
    scr.classList.toggle('n-scr--ekor', lihatEkor);
    $('baca').textContent = lihatEkor && bacaTerakhir
      ? 'penghapus membaca "' + (GLIF[bacaTerakhir] || '?') + '" (' + bacaTerakhir + ')'
      : '';
  }

  /* =======================================================================
     MENGGAMBAR ULAR DENGAN MENELUSURI RANTAI GLIF

     Bentuk ularnya TIDAK dikarang dari daftar koordinat yang disimpan
     terpisah — kalau begitu, port ini akan punya dua sumber kebenaran yang
     bisa menyimpang. Ia dibaca dari petak, dengan aturan yang SAMA PERSIS
     dengan penghapus ekor di baris 700-740.

     Jadi tiap lengkungan tubuh yang Anda lihat adalah satu glif sudut yang
     benar-benar tersimpan di petak layar. Gambarnya adalah bukti rantainya
     bekerja: kalau satu glif salah, ularnya langsung putus di layar.
     ======================================================================= */
  function jalurTubuh() {
    const out = [];
    let x = ex, y = ey, dx = x2, dy = y2;
    for (let n = 0; n < KOL * BARIS; n++) {
      if (x < 1 || x > KOL || y < 1 || y > BARIS) break;
      out.push({ x, y });
      if (x === hx && y === hy) break;
      const s = at(y, x);
      if (s === V) y += dy;
      else if (s === H) x += dx;
      else if (s === TR) {
        if (dx === 1) { dx = 0; dy = 1; y += dy; }
        else if (dy === -1) { dy = 0; dx = -1; x += dx; } else break;
      } else if (s === BL) {
        if (dx === -1) { dx = 0; dy = -1; y += dy; }
        else if (dy === 1) { dy = 0; dx = 1; x += dx; } else break;
      } else if (s === BR) {
        if (dx === 1) { dx = 0; dy = -1; y += dy; }
        else if (dy === 1) { dy = 0; dx = -1; x += dx; } else break;
      } else if (s === TL) {
        if (dx === -1) { dx = 0; dy = 1; y += dy; }
        else if (dy === -1) { dy = 0; dx = 1; x += dx; } else break;
      } else break;
    }
    return out;
  }

  const SEL = 10;
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const pusat = (c, r) => ({ x: (c - 0.5) * SEL, y: (r - 0.5) * SEL });

  function defsSvg() {
    const d = mkn('defs');
    const grad = [
      ['gbadan', '#5ddc9a', '#1e8f5e', 0, 0, 0, 1],
      ['gkepala', '#8ef0b8', '#2ba36c', 0, 0, 0, 1],
      ['gbuah', '#ff8fa3', '#d61f45', 0, 0, 0, 1],
      ['gkodok', '#d946ef', '#7e22ce', 0, 0, 0, 1],
      ['gkodokm', '#a3b18a', '#5f7a3d', 0, 0, 0, 1],
      ['gpagar', '#c08a4e', '#7a5330', 0, 0, 0, 1],
      ['gtiang', '#a97240', '#5f3f24', 0, 0, 0, 1],
      ['gtanah', '#6b4a30', '#3a2819', 0, 0, 0, 1]
    ];
    grad.forEach(([id, a, b, x1_, y1_, x2_, y2_]) => {
      const g = mkn('linearGradient', { id, x1: x1_, y1: y1_, x2: x2_, y2: y2_ });
      g.append(mkn('stop', { offset: 0, 'stop-color': a }),
               mkn('stop', { offset: 1, 'stop-color': b }));
      d.append(g);
    });
    const f = mkn('filter', { id: 'nglow', x: '-50%', y: '-50%',
                              width: '200%', height: '200%' });
    f.append(mkn('feGaussianBlur', { stdDeviation: 2, result: 'b' }));
    const m = mkn('feMerge');
    m.append(mkn('feMergeNode', { in: 'b' }), mkn('feMergeNode', { in: 'SourceGraphic' }));
    f.append(m);
    d.append(f);
    return d;
  }

  /* --- pagar & ladang -------------------------------------------------------
     Permintaan pemilik koleksi: penghalang digambar sebagai pagar kayu, petak
     yang tadinya biru jadi tanah cokelat. Itu perubahan selera — tapi ia
     kebetulan memperlihatkan aturan yang selama ini tersembunyi.

     Satu petak labirin (baris 540) terdiri dari DUA benda yang nasibnya beda:

       │ ─   kode 179 & 196   di DALAM rentang mematikan 179-218   → membunuh
       isi   kode 28          di LUAR rentang                      → aman

     Selama keduanya sama-sama biru, tidak ada cara melihat perbedaan itu.
     Sekarang yang membunuh berupa pagar dan yang aman berupa tanah — dan
     petaknya terbaca apa adanya: kandang dua ruang, terbuka di sisi atas dan
     bawah, dengan satu galar melintang di baris 12 yang tidak boleh dilewati. */
  function selPagar(p, tegak) {
    const g = mkn('g', {
      transform: 'translate(' + p.x + ' ' + p.y + ')' + (tegak ? ' rotate(90)' : '')
    });
    /* Galar dibuat selebar penuh sel (-5..5) supaya sel bersebelahan
       menyambung jadi satu garis pagar, bukan potongan lepas. */
    g.append(mkn('rect', { class: 'n-galar', x: -5, y: -2.8, width: 10, height: 1.8 }));
    g.append(mkn('rect', { class: 'n-galar', x: -5, y: 1.1, width: 10, height: 1.8 }));
    /* SATU bilah per sel, bukan dua. Papan 40 kolom digambar pada viewBox 400,
       jadi satu satuan ≈ satu piksel: dua bilah selebar 2,8 dengan sela 1,4
       piksel melebur jadi tekstur, dan pagarnya terbaca sebagai tembok polos.
       Satu bilah selebar 3,6 menyisakan sela 6,4 piksel antar sel — cukup
       untuk terlihat sebagai pagar betulan. */
    g.append(mkn('rect', { class: 'n-bilah', x: -1.8, y: -4.7,
                           width: 3.6, height: 9.4, rx: .7 }));
    return g;
  }

  function selTanah(p, r, c) {
    const g = mkn('g', { transform: 'translate(' + p.x + ' ' + p.y + ')' });
    g.append(mkn('rect', { class: 'n-ladang', x: -5, y: -5, width: 10, height: 10 }));
    /* Alur bajak digeser selang-seling menurut baris+kolom supaya terbaca
       sebagai tanah yang dicangkul, bukan deretan kotak polos. */
    const o = ((r + c) % 2) ? -0.5 : 0.5;
    g.append(mkn('path', { class: 'n-alur',
                           d: 'M-4 ' + (-1.7 + o) + ' h8 M-4 ' + (1.9 + o) + ' h8' }));
    return g;
  }

  /* Simpangan tegak lurus lintasan: gelombang berjalan dari kepala ke ekor.
     Ini MURNI RUPA — tidak ada satu pun posisi sel yang berubah karenanya.
     Amplitudonya mengecil di kepala dan ekor supaya ujungnya tetap menempel
     pada selnya. */
  let fase = 0;
  const AMP = 2.6, PANJANG_GEL = 7.5;   // dalam satuan titik cuplikan

  function gambarUlar(alpha) {
    const svg = $('ular');
    svg.textContent = '';
    svg.append(defsSvg());

    const lat = mkn('g');
    // dinding & labirin, dibaca dari petak yang sama
    for (let r = 1; r <= BARIS; r++) {
      for (let c = 1; c <= KOL; c++) {
        const k = at(r, c);
        const p = pusat(c, r);
        if (k === DINDING) {
          lat.append(selPagar(p, false));            // dinding bawah, baris 550
        } else if (k === V || k === H) {
          // hanya glif labirin (yang bukan bagian tubuh) — dibedakan lewat jalur
        } else if (k === LABIRIN) {
          lat.append(selTanah(p, r, c));
        }
      }
    }
    svg.append(lat);

    const jalur = jalurTubuh();
    const diTubuh = new Set(jalur.map(s => s.y * 100 + s.x));

    /* Petak labirin memakai glif yang sama dengan tubuh (│ dan ─), jadi ia
       dibedakan dari tubuh dengan MENANYAKAN jalur — bukan dengan menebak. */
    for (let r = 1; r <= BARIS; r++) {
      for (let c = 1; c <= KOL; c++) {
        const k = at(r, c);
        if ((k === V || k === H) && !diTubuh.has(r * 100 + c)) {
          /* Arah pagar diambil dari glifnya sendiri: │ berarti pagar tegak,
             ─ berarti pagar melintang. Sekali lagi, petak layar yang menjawab. */
          svg.append(selPagar(pusat(c, r), k === V));
        }
      }
    }

    // buah & musuh
    for (let r = 1; r <= BARIS; r++) {
      for (let c = 1; c <= KOL; c++) {
        const k = at(r, c);
        if (k !== APEL && k !== MUSUH) continue;
        const p = pusat(c, r);
        if (k === APEL) {
          svg.append(mkn('circle', { class: 'n-buah', cx: p.x, cy: p.y + .6, r: 3.4 }));
          svg.append(mkn('path', { class: 'n-daun',
            d: 'M' + p.x + ' ' + (p.y - 2.8) + ' q 2.6 -2.2 4 -.4 q -2 2 -4 .4 z' }));
        }
      }
    }

    gambarKodok(svg, alpha);

    if (jalur.length < 2) return;

    /* Titik tubuh, dengan kepala digeser `alpha` ke sel berikutnya supaya
       geraknya mulus di antara dua langkah simulasi — bukan melompat sel. */
    const inti = jalur.map(s2 => pusat(s2.x, s2.y));
    const akhir = inti.length - 1;
    inti[akhir] = { x: inti[akhir].x + x1 * SEL * alpha,
                    y: inti[akhir].y + y1 * SEL * alpha };
    if (inti.length > 2) {
      const t0 = inti[0], t1 = inti[1];
      inti[0] = { x: t0.x + (t1.x - t0.x) * alpha, y: t0.y + (t1.y - t0.y) * alpha };
    }

    /* Dicuplik ulang dengan Catmull-Rom, empat titik per sel.

       Tanpa ini sudutnya siku-siku — karena jalurnya memang kisi — dan
       gelombang merayapnya tidak punya cukup titik untuk terbaca. Yang
       dihaluskan hanya GAMBARNYA; posisi selnya tidak tersentuh, dan itu
       yang menjaga simulasinya tetap sama persis dengan aslinya. */
    const halus = [];
    const CUPLIK = 4;
    const ambil = (k) => inti[Math.max(0, Math.min(inti.length - 1, k))];
    for (let i2 = 0; i2 < inti.length - 1; i2++) {
      const p0 = ambil(i2 - 1), p1 = ambil(i2), p2 = ambil(i2 + 1), p3 = ambil(i2 + 2);
      for (let k = 0; k < CUPLIK; k++) {
        const u = k / CUPLIK, u2 = u * u, u3 = u2 * u;
        halus.push({
          x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * u +
                    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
                    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
          y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * u +
                    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 +
                    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3)
        });
      }
    }
    halus.push(inti[akhir]);

    /* Gelombang merayap: simpangan tegak lurus lintasan, berjalan dari kepala
       ke ekor. MURNI RUPA — tidak ada satu pun posisi sel yang berubah. */
    const n = halus.length;
    const kiri = [], kanan = [];
    let ujung = null;
    for (let i2 = 0; i2 < n; i2++) {
      const a2 = halus[Math.max(0, i2 - 1)], b2 = halus[Math.min(n - 1, i2 + 1)];
      let tx = b2.x - a2.x, ty = b2.y - a2.y;
      const len = Math.hypot(tx, ty) || 1;
      tx /= len; ty /= len;
      const nx = -ty, ny = tx;
      const u = i2 / (n - 1);
      /* Gelombang hanya di SETENGAH DEPAN.

         Versi pertama meredamnya dengan `sin(pi*u)`, yang memuncak di tengah
         badan — jadi seluruh ular bergoyang sekaligus dan melelahkan dilihat.
         Dilaporkan pemilik koleksi.

         Sekarang: nol di belakang (u < 0,5), naik mulus sampai penuh di
         u = 0,8, lalu turun lagi tepat di kepala supaya kepalanya tetap
         menempel di selnya. Ekornya diam; yang merayap bagian depannya. */
      const halus3 = (a, b, v) => {
        const x = Math.min(1, Math.max(0, (v - a) / (b - a)));
        return x * x * (3 - 2 * x);
      };
      const redam = halus3(0.50, 0.80, u) * (1 - halus3(0.90, 1.00, u));
      const gel = Math.sin(fase - i2 / PANJANG_GEL) * AMP * redam;
      const px = halus[i2].x + nx * gel, py = halus[i2].y + ny * gel;
      // meruncing di ekor, menebal ke kepala
      const tebal = 0.9 + 3.1 * Math.pow(u, 0.65);
      kiri.push({ x: px + nx * tebal, y: py + ny * tebal });
      kanan.push({ x: px - nx * tebal, y: py - ny * tebal });
      halus[i2] = { x: px, y: py, tx, ty };
      if (i2 === n - 1) ujung = { x: px, y: py, tx, ty };
    }

    const kurva = (pts) => pts.map((p, i2) =>
      (i2 ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
    const d = kurva(kiri) + ' ' + kurva(kanan.slice().reverse()).replace('M', 'L') + ' Z';
    svg.append(mkn('path', { class: 'n-badan', d: d }));
    svg.append(mkn('path', { class: 'n-badan-tepi', d: d }));

    // sisik di sepanjang punggung
    for (let i2 = CUPLIK; i2 < n - CUPLIK; i2 += CUPLIK) {
      svg.append(mkn('circle', { class: 'n-sisik', cx: halus[i2].x.toFixed(1),
                                 cy: halus[i2].y.toFixed(1),
                                 r: (0.7 + 0.9 * (i2 / n)).toFixed(2) }));
    }

    gambarKepala(svg, ujung);
  }

  /* Kodok digambar dari KEADAANNYA, bukan dari petak — supaya ia bisa terlihat
     melayang di antara dua sel selama melompat, sementara petaknya tetap
     menyimpan satu sel utuh untuk tabrakan. Dua hal berbeda, sengaja dipisah. */
  function gambarKodok(svg, alpha) {
    for (const m of musuh.concat(mangsa)) {
      const racun = m.kode === MUSUH;
      let cx, cy, angkat = 0, pipih = 0;
      if (m.fase === 'lompat') {
        /* `m.t` hanya maju sekali per langkah simulasi (10x/detik), jadi tanpa
           `alpha` lompatannya patah jadi tiga atau empat potongan. Interpolasi
           yang sama dengan kepala ular: simulasinya tetap yang berwenang,
           gambarnya saja yang mengisi celah di antara dua langkah. */
        const t = Math.min(1, m.t + alpha * (1 / hz) / LOMPAT_DTK);
        const a = pusat(m.dari.x, m.dari.y), b = pusat(m.ke.x, m.ke.y);
        cx = a.x + (b.x - a.x) * t;
        cy = a.y + (b.y - a.y) * t;
        angkat = Math.sin(Math.PI * t) * 5.5;        // busur lompatan
        pipih = Math.sin(Math.PI * t) * 0.22;        // meregang saat melayang
      } else {
        const a = pusat(m.x, m.y);
        cx = a.x; cy = a.y;
        // sedikit mengembang-kempis saat diam, supaya ia terlihat bernapas
        pipih = -0.06 * Math.sin(fase * 0.5);
      }
      const g = mkn('g', { transform: 'translate(' + cx.toFixed(1) + ' ' +
                                      (cy - angkat).toFixed(1) + ')' });
      const rx = 3.5 * (1 - pipih), ry = 2.8 * (1 + pipih);
      // kaki belakang
      const kaki = (sisi) => mkn('path', { class: racun ? 'n-kaki' : 'n-kaki-m',
        d: 'M' + (sisi * 2.2) + ' 1.2 q' + (sisi * 2.6) + ' ' +
           (m.fase === 'lompat' ? 2.6 : 0.6) + ' ' + (sisi * 1.2) + ' ' +
           (m.fase === 'lompat' ? 3.4 : 2.2) });
      g.append(kaki(-1), kaki(1));
      // lingkar racun: penanda bahaya yang tetap terlihat saat kodok diam
      if (racun) g.append(mkn('circle', { class: 'n-racun', cx: 0, cy: 0, r: 5.4 }));
      g.append(mkn('ellipse', { class: racun ? 'n-kodok' : 'n-kodok-m',
                                cx: 0, cy: 0, rx: rx.toFixed(2), ry: ry.toFixed(2) }));
      /* Bercak gelap — bagian kedua dari pola aposematik. Letaknya tetap
         relatif terhadap badan, jadi ia ikut meregang saat melompat. */
      if (racun)
        [[-1.5, -.4, .95], [1.4, .5, .8], [0, 1.3, .6]].forEach(([bx, by, br]) =>
          g.append(mkn('circle', { class: 'n-bercak', cx: (bx * rx / 3.5).toFixed(2),
                                   cy: (by * ry / 2.8).toFixed(2), r: br })));
      // mata menonjol di atas kepala
      [-1, 1].forEach(sisi => {
        g.append(mkn('circle', { class: racun ? 'n-kodok-mata' : 'n-kodok-m-mata',
                                 cx: sisi * 1.5, cy: -ry * 0.75, r: 1.25 }));
        g.append(mkn('circle', { class: 'n-kodok-manik', cx: sisi * 1.5,
                                 cy: -ry * 0.75, r: .55 }));
      });
      svg.append(g);
    }
  }

  /* Mulut membuka SEBELUM makan: `bukaMulut` naik saat ada buah di depan,
     lalu menutup dengan sentakan sesudah tergigit. Ini rupa, tapi ia
     mengumumkan sesuatu yang nyata — sel berikutnya memang berisi APEL. */
  let bukaMulut = 0;

  function gambarKepala(svg, h) {
    const ang = Math.atan2(h.ty, h.tx);
    const g = mkn('g', { transform: 'translate(' + h.x.toFixed(1) + ' ' + h.y.toFixed(1) +
                                    ') rotate(' + (ang * 180 / Math.PI).toFixed(1) + ')' });
    const buka = bukaMulut * 26;            // derajat tiap rahang

    // rongga mulut, terlihat saat rahang terbuka
    if (bukaMulut > 0.02) {
      g.append(mkn('path', { class: 'n-mulut',
        d: 'M0 0 L9 -6 A9 9 0 0 1 9 6 Z' }));
      g.append(mkn('path', { class: 'n-lidah',
        d: 'M4 0 q5 0 7 ' + (Math.sin(fase * 2) * 2).toFixed(1) }));
    }

    const rahang = (tanda) =>
      mkn('path', { class: 'n-rahang',
        transform: 'rotate(' + (tanda * buka) + ')',
        d: 'M-4 0 q3 ' + (tanda * 4.6) + ' 8.5 ' + (tanda * 3.4) +
           ' q1.6 ' + (-tanda * 1.2) + ' 1.6 ' + (-tanda * 3.4) +
           ' q-4 ' + (-tanda * 1.4) + ' -10.1 0 z' });
    g.append(rahang(-1), rahang(1));

    // batok kepala
    g.append(mkn('ellipse', { class: 'n-kepala', cx: 0, cy: 0, rx: 6.2, ry: 4.6 }));
    // mata
    [-1, 1].forEach(s => {
      g.append(mkn('circle', { class: 'n-mata', cx: 1.4, cy: s * 2.4, r: 1.5 }));
      g.append(mkn('circle', { class: 'n-manik', cx: 2.0, cy: s * 2.4, r: .75 }));
    });
    svg.append(g);

    if (lihatEkor) {
      const p = pusat(ex, ey);
      svg.append(mkn('rect', { class: 'n-sorot', x: p.x - SEL / 2, y: p.y - SEL / 2,
                               width: SEL, height: SEL, rx: 2 }));
    }
  }

  function papan() {
    $('s-skor').textContent = skor;
    $('s-nyawa').textContent = nyawa;
    $('s-panjang').textContent = panjang;
    $('s-apel').textContent = apel + ' / 5';
    $('s-labirin').textContent = dl;
    $('s-musuh').textContent = p;
  }

  const pesan = (t) => { $('pesan').textContent = t || ''; };

  /* --- menyiapkan ronde, baris 530-560 ----------------------------------- */
  function ronde() {
    petak = new Array(KOL * BARIS).fill(KOSONG);
    hx = 1; hy = 1; x1 = 1; y1 = 0;
    ex = 1; ey = 1; x2 = 1; y2 = 0;
    le = panjang;                              // baris 530: LE=L
    /* Baris 530 juga berbunyi AP=0, dan ia dijangkau dari DUA arah: dari
       baris 640 (lima apel terkumpul) dan dari baris 870 (mati, nyawa masih
       ada). Versi sebelumnya menaruh pengosongan ini di pemanggil, jadi jalur
       kematian melewatkannya dan kemajuan apel terbawa melewati kematian.
       Tempatnya di sini, karena baris 530-lah yang dimodelkan fungsi ini. */
    apel = 0;
    bacaTerakhir = 0;
    antreanArah.length = 0;

    /* Baris 540: PS=1/(DL+1)*40, lalu DL petak labirin digambar. */
    let ps = Math.round(1 / (dl + 1) * 40);
    for (let i = 0; i < dl; i++) {
      for (let lp = 5; lp <= 19; lp++) {
        set(lp, ps, V);
        for (let k = 1; k <= 9; k++) set(lp, ps + k, LABIRIN);
        set(lp, ps + 10, V);
      }
      for (let k = 0; k <= 10; k++) set(12, ps + k, H);
      ps += 5;
    }

    for (let c = 1; c <= KOL; c++) set(BARIS, c, DINDING);   // baris 550

    /* Baris 560 menaruh lima apel tanpa memeriksa apa pun:

         560 FOR I=1 TO 5: LOCATE INT(RND*22)+2, INT(RND*39)+1: PRINT "ö"; : NEXT

       Dua apel bisa jatuh di sel yang sama, dan yang tersisa cuma empat. Baris
       640 menunggu AP mencapai 5, jadi rondenya terkunci — kunci yang sama
       dengan cacat kodok di §"KODOK TIDAK BOLEH MENDARAT", lewat sebab lain.
       Peluangnya kira-kira 1 dari 95 ronde (lima apel ke ~950 sel bebas), cukup
       jarang untuk lolos pengujian dan cukup sering untuk ditemui pemain.

       Apel juga bisa jatuh TEPAT DI ATAS pagar labirin dan menimpanya, membuat
       lubang di dinding yang seharusnya utuh.

       Diperbaiki: apel diulang undiannya sampai dapat sel yang boleh ditempati.
       Yang boleh itu tanah kosong ATAU tanah ladang (kode 28) — ladang memang
       bisa dimasuki (§6e), jadi apel di dalam kandang tetap sah dan tetap bisa
       diambil. Yang tidak boleh cuma menimpa sesuatu. */
    const bolehApel = (r, c) => {
      const k = at(r, c);
      return k === KOSONG || k === LABIRIN;
    };
    for (let i = 0; i < 5; i++) {                            // baris 560
      for (let coba = 0; coba < 200; coba++) {
        const r = Math.floor(acak.next() * 22) + 2;
        const c = Math.floor(acak.next() * 39) + 1;
        if (bolehApel(r, c)) { set(r, c, APEL); break; }
      }
    }

    /* Baris 530: dua musuh pertama; P menentukan berapa yang aktif. */
    musuh = [
      { x: 2, y: 24, dx: 1, dy: -1 },
      { x: 39, y: 24, dx: -1, dy: -1 }
    ].slice(0, Math.min(2, p)).map(m => Object.assign(m, {
      kode: MUSUH, fase: 'diam', t: 0, dari: { x: m.x, y: m.y }, ke: null,
      sisa: DIAM_MIN + acak.next() * (DIAM_MAKS - DIAM_MIN)
    }));
    musuh.forEach(m => set(m.y, m.x, MUSUH));

    /* Dua kodok mangsa, ditaruh di petak kosong. Mereka melompat dengan mesin
       yang sama dengan yang beracun — bedanya cuma kode petak, warna, dan apa
       yang terjadi saat ular menyentuhnya. */
    mangsa = [];
    for (let i = 0; i < 2; i++) {
      const t2 = petakKosong();
      if (!t2) break;
      mangsa.push({ x: t2.c, y: t2.r, dx: acak.next() < .5 ? 1 : -1, dy: 0,
                    kode: KODOK_MANGSA, fase: 'diam', t: 0,
                    dari: { x: t2.c, y: t2.r }, ke: null,
                    sisa: DIAM_MIN + acak.next() * (DIAM_MAKS - DIAM_MIN) });
      set(t2.r, t2.c, KODOK_MANGSA);
    }
    /* Kalau P melebihi dua, aslinya larik PX(4) memang cuma diisi dua —
       jadi musuh ketiga dan seterusnya tidak pernah benar-benar ada. */
    papan();
  }

  /* --- satu langkah, baris 570-840 --------------------------------------- */
  function langkah() {
    if (!main) return;

    /* --- arah, baris 580-610 ---
       Diambil dari ANTREAN, bukan dari keadaan tombol.

       Versi pertama memakai `kb.isDown()` yang dicuplik sekali per langkah
       simulasi (10 kali/detik). Ketukan singkat yang jatuh di antara dua
       cuplikan HILANG SAMA SEKALI — pemain menekan belok, ularnya tetap lurus,
       dan harus menekan berkali-kali. Dilaporkan pemilik koleksi.

       Antrean juga lebih setia: aslinya membaca `A=VAL(INKEY$)`, yaitu satu
       tombol dari PENYANGGA papan ketik per langkah — bukan keadaan tombol
       saat itu. */
    let belok = antreanArah.length ? antreanArah.shift() : null;

    /* Membalik arah 180 derajat diabaikan, tidak mematikan.

       Aslinya `IF A=4 AND X1<>-1` hanya mencegah MENGULANG arah yang sama,
       bukan membalik — jadi menekan kanan saat bergerak ke kiri membuat kepala
       masuk ke lehernya sendiri dan mati. Itu tidak logis bagi pemain, dan
       diminta diubah. Penyimpangan, dicatat di tabel empat kolom. */
    if ((belok === 4 && x1 === 1) || (belok === 6 && x1 === -1) ||
        (belok === 2 && y1 === -1) || (belok === 8 && y1 === 1)) belok = null;

    /* Baris 570: sebelum berbelok, sel kepala saat ini diisi glif LURUS
       menurut arah yang sedang berjalan. Baris 580-610 lalu MENIMPANYA dengan
       glif SUDUT kalau memang berbelok — dan sudut itulah yang nanti dibaca
       penghapus ekor. */
    set(hy, hx, y1 === 0 ? H : V);

    if (belok === 4 && x1 !== -1) { set(hy, hx, y1 === 1 ? BR : TR); x1 = -1; y1 = 0; }
    else if (belok === 6 && x1 !== 1) { set(hy, hx, y1 === 1 ? BL : TL); x1 = 1; y1 = 0; }
    else if (belok === 2 && y1 !== 1) { set(hy, hx, x1 === 1 ? TR : TL); y1 = 1; x1 = 0; }
    else if (belok === 8 && y1 !== -1) { set(hy, hx, x1 === 1 ? BR : BL); y1 = -1; x1 = 0; }

    // --- maju, baris 620 ---
    hx += x1; hy += y1;
    if (hx < 1 || hx > KOL || hy < 1 || hy > BARIS) return mati();

    // --- tabrakan, baris 630 & 650 ---
    const s = at(hy, hx);
    if (mematikan(s)) return mati();
    /* Baris 650: `IF S=162 THEN 860` — menyentuh musuh mematikan. Kode 162
       ada DI LUAR rentang 179..218 baris 630, jadi ia butuh barisnya sendiri.
       Versi pertama port ini melewatkannya sama sekali: katanya tidak berbahaya.
       Ditemukan saat meninjau ulang atas laporan pemilik koleksi. */
    if (s === MUSUH) return mati('Kodok beracun — jangan disentuh!');

    /* Kodok mangsa: TAMBAHAN. Sasaran yang bergerak lebih sulit daripada apel
       yang diam, jadi nilainya lebih besar — dan itu satu-satunya alasan ia
       layak ada di samping apel. */
    if (s === KODOK_MANGSA) {
      skor += 25;
      panjang += 2; le += 2;
      bunyi(180, 1); bunyi(1200, 0.6);
      /* Sekali dimakan, hilang — tidak muncul lagi. Kalau ia langsung
         digantikan, "kodok" berhenti jadi sasaran dan berubah jadi arus tak
         berujung; yang tersisa cuma apel dengan bentuk lain. Dua ekor per
         ronde membuat memburunya jadi keputusan, bukan rutinitas.

         Ronde baru (tiap 5 apel) tetap menyiapkan dua yang baru — itu bagian
         dari penyiapan papan, sama seperti lima apelnya. */
      const i2 = mangsa.findIndex(m => (m.fase === 'lompat' ? m.dari.x : m.x) === hx &&
                                       (m.fase === 'lompat' ? m.dari.y : m.y) === hy);
      if (i2 >= 0) {
        const m = mangsa[i2];
        set(m.fase === 'lompat' ? m.dari.y : m.y,
            m.fase === 'lompat' ? m.dari.x : m.x, KOSONG);
        mangsa.splice(i2, 1);
      }
      papan();
    }

    // --- apel, baris 640 ---
    if (s === APEL) {
      skor += 10;
      panjang += 1; le += 1;
      bunyi(100, 1); bunyi(1000, 0.5);
      apel += 1;
      papan();
      if (apel >= 5) {                        // baris 640
        dl += 1;
        if (dl >= 5) { dl = 0; p += 1; }
        return ronde();
      }
    }

    // --- gambar kepala, baris 660 ---
    set(hy, hx, y1 === 0 ? V : H);
    /* Perhatikan: baris 660 menulis glif yang TEGAK LURUS arah geraknya.
       Itu bukan salah ketik — sel ini akan dibaca lagi di langkah berikutnya
       oleh baris 570, yang menimpanya dengan glif yang benar. Yang penting
       hanyalah sel itu TIDAK kosong, supaya tabrakan terdeteksi. */

    // --- penghapus ekor, baris 670-740 ---
    if (le > 1) { le -= 1; }
    else {
      bacaTerakhir = at(ey, ex);
      set(ey, ex, KOSONG);
      const S = bacaTerakhir;
      if (S === V) ey += y2;
      else if (S === H) ex += x2;
      else if (S === TR) {
        if (x2 === 1) { x2 = 0; y2 = 1; ey += y2; }
        else if (y2 === -1) { y2 = 0; x2 = -1; ex += x2; }
      } else if (S === BL) {
        if (x2 === -1) { x2 = 0; y2 = -1; ey += y2; }
        else if (y2 === 1) { y2 = 0; x2 = 1; ex += x2; }
      } else if (S === BR) {
        if (x2 === 1) { x2 = 0; y2 = -1; ey += y2; }
        else if (y2 === 1) { y2 = 0; x2 = -1; ex += x2; }
      } else if (S === TL) {
        if (x2 === -1) { x2 = 0; y2 = 1; ey += y2; }
        else if (y2 === -1) { y2 = 0; x2 = 1; ex += x2; }
      }
    }

    gerakKodok(1 / hz);                        // baris 750-820
  }

  /* =======================================================================
     KODOK YANG MELOMPAT BERSELANG

     Aslinya (baris 750-820) musuh `ó` bergerak SETIAP langkah dan memantul
     dengan membaca SCREEN di depannya. Diminta diubah jadi kodok yang melompat
     berselang: lompat, diam beberapa detik, lompat lagi.

     Dua hal yang DIPERTAHANKAN dari aslinya, karena keduanya aturan main:

       - kodok tetap menempati SATU SEL di petak (kode 162), jadi tabrakan
         dihitung dengan cara yang sama persis;
       - arah lompatnya masih dipilih dengan MEMBACA PETAK di depan, dan
         berbalik kalau terhalang — logika pantul baris 790-800.

     Yang ditambahkan: sasaran lompat divalidasi supaya tidak pernah mendarat
     di atas badan ular. Aslinya tidak memeriksa itu — musuhnya bisa muncul
     tepat di tubuh ular dan membunuh pemain tanpa ia sempat berbuat apa-apa.
     ======================================================================= */
  const LOMPAT_DTK = 0.34;                    // lama satu lompatan
  const DIAM_MIN = 1.1, DIAM_MAKS = 2.8;      // jeda antar-lompatan

  function petakKosong() {
    for (let coba = 0; coba < 200; coba++) {
      const r = 2 + Math.floor(acak.next() * 22);
      const c = 2 + Math.floor(acak.next() * 38);
      if (at(r, c) === KOSONG) return { r, c };
    }
    return null;
  }

  /* KODOK TIDAK BOLEH MENDARAT DI ATAS APA PUN — cacat 1982 yang diperbaiki.

     Aslinya kodok (musuh `ó`) hanya berbalik untuk rentang mematikan:

       790 S1=SCREEN(…):S2=SCREEN(…):IF S1<219 AND S1>178 THEN PY1=-PY1
       800 IF S2<219 AND S2>178 THEN PX1=-PX1

     Apel berkode 148, di luar rentang itu — jadi musuh boleh menginjaknya. Dan
     langkah berikutnya:

       760 LOCATE PY,PX:PRINT " ";

     menghapus sel yang ditinggalkan, tanpa peduli apa yang tadi ada di sana.
     Apelnya lenyap.

     Itu MENGUNCI rondenya. Baris 560 menaruh tepat lima apel dan baris 640
     hanya maju setelah AP mencapai 5 — apel yang dimakan TIDAK diganti satu per
     satu, papannya baru dibangun ulang setelah kelimanya habis. Kurang satu
     apel berarti AP mentok di 4 selamanya, dan pemain harus bunuh diri untuk
     keluar. Persis yang dilaporkan pemilik koleksi.

     Aslinya cacat ini butuh 25 apel dulu (musuh pertama baru muncul saat P
     jadi 1). Kodok mangsa yang saya tambahkan bergerak dengan mesin yang sama
     dan ada sejak langkah pertama — jadi port ini MENAIKKAN cacat laten 1982
     jadi cacat yang langsung menggigit. Sebagian salah saya.

     Diperbaiki dengan satu syarat, bukan daftar pengecualian: sasaran lompat
     harus BENAR-BENAR KOSONG. Itu sekaligus menutup badan ular, pagar, tanah
     ladang, apel, dan kodok jenis lain. */
  const bolehMendarat = (r, c) => {
    if (r < 2 || r > 24 || c < 2 || c > 39) return false;
    return at(r, c) === KOSONG;
  };

  /* Sel kosong belum tentu aman: kodok lain yang sedang melayang masih
     tercatat di sel ASALNYA, bukan tujuannya. Tanpa pemeriksaan ini dua kodok
     bisa mengincar sel yang sama, lalu yang satu menghapus yang lain saat
     melompat pergi — cacat yang sama persis dengan cacat apel di atas. */
  const diincar = (r, c, diri) => musuh.concat(mangsa).some(
    o => o !== diri && o.fase === 'lompat' && o.ke && o.ke.x === c && o.ke.y === r);

  function pilihSasaran(m) {
    /* Urutan coba: arah sekarang, lalu pantulannya, lalu dua arah tegak lurus.
       Itu logika pantul baris 790-800, hanya diperluas supaya kodok tidak
       pernah kehabisan pilihan dan berdiri diam selamanya. */
    const calon = [
      [m.dx, m.dy], [-m.dx, -m.dy], [m.dy, m.dx], [-m.dy, -m.dx]
    ];
    for (const [dx, dy] of calon) {
      if (!dx && !dy) continue;
      const c = m.x + dx, r = m.y + dy;
      if (bolehMendarat(r, c) && !diincar(r, c, m)) {
        m.dx = dx; m.dy = dy; return { x: c, y: r };
      }
    }
    return null;                              // terkurung: diam saja
  }

  function gerakKodok(dt) {
    for (const m of musuh.concat(mangsa)) {
      if (m.fase === 'diam') {
        m.sisa -= dt;
        if (m.sisa > 0) continue;
        const ke = pilihSasaran(m);
        if (!ke) { m.sisa = DIAM_MIN; continue; }
        set(m.y, m.x, KOSONG);
        m.dari = { x: m.x, y: m.y };
        m.ke = ke;
        m.fase = 'lompat';
        m.t = 0;
        /* Selama melayang, kodok tetap MENEMPATI sel asalnya di petak. Kalau
           tidak, ada satu langkah saat ia tidak ada di mana pun — dan ular bisa
           menembusnya. */
        set(m.dari.y, m.dari.x, m.kode);
        continue;
      }
      m.t += dt / LOMPAT_DTK;
      if (m.t < 1) continue;
      set(m.dari.y, m.dari.x, KOSONG);
      m.x = m.ke.x; m.y = m.ke.y;
      set(m.y, m.x, m.kode);
      m.fase = 'diam';
      m.t = 0;
      m.sisa = DIAM_MIN + acak.next() * (DIAM_MAKS - DIAM_MIN);
    }
  }

  function mati(sebab) {
    for (let f = 1000; f >= 400; f -= 50) bunyi(f, 0.05);   // baris 860
    $('crt').classList.add('n-crt--mati');
    setTimeout(() => $('crt').classList.remove('n-crt--mati'), 800);
    nyawa -= 1;                                             // baris 870
    papan();
    if (nyawa > 0) {
      /* Panjang TIDAK dikembalikan ke 10. Baris 510 (L=10) cuma dijalankan
         sekali saat program mulai; baris 870 melompat ke 530, yang hanya
         menyalin LE=L. Jadi aslinya ular yang sudah panjang bangkit tetap
         panjang — dan versi sebelumnya diam-diam membuatnya lebih mudah. */
      ronde();
      /* Sebab kematian disebutkan, bukan cuma "mati". Pemain yang mengira
         kodok itu mangsa perlu diberi tahu apa yang barusan terjadi — dan
         sekali saja tidak cukup, karena pesannya lewat cepat. */
      if (sebab) { pesan(sebab); setTimeout(() => { if (main) pesan(''); }, 1600); }
      return;
    }
    main = false; gelung.stop(); selesai = true;
    pesan((sebab ? sebab + '  ' : '') + 'Permainan selesai — ' + skor);
    sync();
  }

  /* --- gelung ------------------------------------------------------------ */
  let hz = 10;
  function render(alpha) {
    fase += 0.34;                       // gelombang merayap, murni rupa
    /* Mulut membuka SEBELUM makan: tiga sel di depan kepala sudah cukup untuk
       memberi kesan mengantisipasi tanpa terlihat menganga sepanjang waktu. */
    let adaBuah = false;
    for (let k = 1; k <= 3; k++) {
      const c = hx + x1 * k, r = hy + y1 * k;
      if (r >= 1 && r <= BARIS && c >= 1 && c <= KOL && at(r, c) === APEL) adaBuah = true;
    }
    const target = (main && adaBuah) ? 1 : 0;
    bukaMulut += (target - bukaMulut) * 0.35;
    if (modeGlif) gambar(); else gambarUlar(alpha === undefined ? 1 : alpha);
  }

  let gelung = loop({ hz: hz, update: langkah, render: render });
  function buatGelung() {
    if (gelung.running) gelung.stop();
    gelung = loop({ hz: hz, update: langkah, render: render });
  }

  function mulai() {
    skor = 0; nyawa = 3; panjang = 10; apel = 0; dl = 0;
    /* Aslinya kodok pertama baru muncul setelah 25 apel (5 apel per labirin,
       5 labirin per kodok) — jadi sebagian besar pemain tidak akan pernah
       melihatnya sama sekali. Pemilih ini TAMBAHAN, supaya mekanik yang
       dijelaskan halaman ini bisa benar-benar dilihat. */
    p = Number($('awal').value) || 0;
    selesai = false; main = true;
    pesan('');
    ronde();
    buatGelung(); gelung.start();
    sync();
  }

  function sync() {
    $('mulai').textContent = main ? 'Ulang' : 'Mulai';
    $('jeda').disabled = !main;
    $('jeda').textContent = gelung.paused ? 'Lanjut' : 'Jeda';
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Serpent',
    source: 'SERPENT.BAS · 6 Okt 1982 · USR-5-5-K',
    backHref: '../../index.html'
  }));

  const baca = document.createElement('p');
  baca.className = 'n-baca'; baca.id = 'baca';
  $('crt').append(baca);

  kb.captureScroll(true);
  const ARAH = { ArrowLeft: 4, ArrowRight: 6, ArrowDown: 2, ArrowUp: 8,
                 '4': 4, '6': 6, '2': 2, '8': 8 };
  Object.keys(ARAH).forEach(k => kb.on(k, () => {
    if (antreanArah.length < ANTREAN_MAKS) antreanArah.push(ARAH[k]);
  }));
  $('mulai').addEventListener('click', mulai);
  $('jeda').addEventListener('click', () => { gelung.pause(); sync(); });
  $('mode').addEventListener('click', () => {
    modeGlif = !modeGlif;
    $('mode').setAttribute('aria-pressed', String(modeGlif));
    $('mode').textContent = modeGlif ? 'Tampilan ular' : 'Tampilan glif';
    sembunyikan($('layar'), !modeGlif);
    sembunyikan($('ular'), modeGlif);
    db.set('mode', modeGlif ? 'glif' : 'ular');
    render(1);
  });
  $('ekor').addEventListener('click', () => {
    lihatEkor = !lihatEkor;
    $('ekor').setAttribute('aria-pressed', String(lihatEkor));
    $('ekor').textContent = lihatEkor ? 'Sembunyikan penghapus' : 'Lihat penghapus ekor';
    db.set('ekor', lihatEkor ? '1' : '0');
    render(1);
  });
  $('hz').addEventListener('input', e => {
    hz = Number(e.target.value);
    $('hzv').textContent = hz + '/dtk';
    db.set('hz', hz);
    if (main) { const j = gelung.running; buatGelung(); if (j) gelung.start(); }
  });

  $('awal').addEventListener('change', e => db.set('awal', e.target.value));
  $('awal').value = db.get('awal', 0);

  hz = Number(db.get('hz', 10));
  $('hz').value = hz; $('hzv').textContent = hz + '/dtk';
  lihatEkor = db.get('ekor', '0') === '1';
  $('ekor').setAttribute('aria-pressed', String(lihatEkor));
  $('ekor').textContent = lihatEkor ? 'Sembunyikan penghapus' : 'Lihat penghapus ekor';

  /* --- tabel, dihitung dari aturannya sendiri ----------------------------- */
  $('tbl-glif').innerHTML =
    '<thead><tr><th>Kode</th><th>Glif</th><th>Artinya bagi penghapus ekor</th></tr></thead><tbody>' +
    [[V, 'terus tegak'], [H, 'terus mendatar'],
     [TR, 'belok: kanan↔bawah'], [BL, 'belok: kiri↔atas'],
     [BR, 'belok: kanan↔atas'], [TL, 'belok: kiri↔bawah']]
      .map(([k, arti]) => '<tr><td>' + k + '</td><td class="n-glif">' + GLIF[k] +
                          '</td><td>' + arti + '</td></tr>').join('') +
    '</tbody>';

  const dalamRentang = [];
  for (let c = 0; c < 256; c++) if (mematikan(c)) dalamRentang.push(c);
  $('tbl-mati').innerHTML =
    '<thead><tr><th>Diperiksa</th><th></th></tr></thead><tbody>' +
    '<tr><td>Kode dalam rentang mematikan</td><td>' + dalamRentang.length + '</td></tr>' +
    '<tr><td>Glif tubuh yang termasuk</td><td>6 / 6</td></tr>' +
    '<tr><td>Dinding <code>█</code> (219) termasuk?</td><td>tidak</td></tr>' +
    '<tr><td>Digambar program ini</td><td>7 kode</td></tr>' +
    '<tr><td>Sisanya, tidak pernah muncul</td><td>' + (dalamRentang.length - 6) + '</td></tr>' +
    '</tbody>';

  $('tbl-naik').innerHTML =
    '<thead><tr><th>Pemicu</th><th>Akibat</th></tr></thead><tbody>' +
    '<tr><td>1 apel</td><td>+10 skor, +1 panjang</td></tr>' +
    '<tr><td>5 apel</td><td>+1 petak labirin</td></tr>' +
    '<tr><td>5 labirin (= 25 apel)</td><td>+1 musuh</td></tr>' +
    '</tbody>';

  modeGlif = db.get('mode', 'ular') === 'glif';
  $('mode').setAttribute('aria-pressed', String(modeGlif));
  $('mode').textContent = modeGlif ? 'Tampilan ular' : 'Tampilan glif';
  sembunyikan($('layar'), !modeGlif);
  sembunyikan($('ular'), modeGlif);

  bangunDom();
  petak = new Array(KOL * BARIS).fill(KOSONG);
  for (let c = 1; c <= KOL; c++) set(BARIS, c, DINDING);
  render(1); papan(); pesan('Tekan Mulai'); sync();
})();
