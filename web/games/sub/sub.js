/* ===========================================================================
   sub.js — port dari SUB.BAS (perburuan kapal selam, 80 kolom).

   ------------------------------------------------------------------------
   LEBIH BANYAK `POKE` DARIPADA BARIS

       374 pernyataan POKE dalam 317 baris.

   Peta laut dan potongan melintang kapal selamnya TIDAK digambar dengan
   `PRINT`. Keduanya ditulis langsung ke memori video, satu bita aksara per
   sel, ratusan kali:

        960 POKE 76,215:A=88:POKE A,176:POKE A+2,176:POKE A+4,176
       1120 FOR A=840 TO 932 STEP 4:POKE A,177:POKE A+2,177:NEXT

   Alamatnya alamat layar: `(baris-1)*160 + kolom*2 - 2` untuk bita aksara,
   `+1` untuk bita atribut. Menulis ke sana melewati seluruh penafsir — tidak
   ada gulir, tidak ada kursor, tidak ada penyaringan aksara kendali. Itulah
   satu-satunya cara menggambar aksara CP437 apa pun di posisi mana pun tanpa
   efek samping.

   ------------------------------------------------------------------------
   IA MEMILIH SEGMEN VIDEONYA DENGAN BENAR — DAN SATU PROGRAM LAIN SALAH

       590 IF (PEEK(1040) AND 48)=48 THEN DEF SEG=45056 ELSE DEF SEG=47104

   Alamat 1040 = 0040:0010, kata perlengkapan BIOS; bit 4-5 menyimpan jenis
   adaptor. Nilai 48 (0x30) berarti MONOKROM, dan 45056 = 0xB000 memang
   segmen MDA; sisanya 47104 = 0xB800, segmen CGA. Benar.

   `WHATMONF.BAS` di koleksi yang sama memetakannya TERBALIK. SUB.BAS —
   bersama MAZE.BAS — adalah buktinya, dan ketiganya ada di disket yang sama.

   ------------------------------------------------------------------------
   `SCREEN()` DIPAKAI SEBAGAI PENYANGGA SIMPAN-PULIHKAN

       800 V=SCREEN(X,Y):W=SCREEN(X,Y,1)
       810 PRINT CHR$(15);:FOR D=1 TO 20*B:NEXT
       820 POKE (X-1)*160+Y*2-1,W:POKE (X-1)*160+Y*2-2,V

   Sebelum menggambar bom di suatu sel, program MEMBACA aksara dan atributnya
   dari layar; sesudah jeda, ia menulisnya kembali. Jadi bom yang melintas
   tidak merusak peta di bawahnya.

   Ini kemunculan KEENAM "layar sebagai struktur data" di koleksi ini, dan
   keperluannya baru lagi:

       SPACE    latar, supaya PUT…XOR bisa menghapus dirinya
       METEOR   seluruh dunianya
       SERPENT  bentuk tubuhnya sendiri
       ATTACK   nilai skor
       PAC-GAL  tabrakan labirin
       SUB      PENYANGGA CADANGAN — apa yang harus dikembalikan

   ------------------------------------------------------------------------
   TABEL BALISTIK 24 ENTRI DI `DATA`

       2020 DATA -1.85,-1.1,-.3,.45,1.2,2,-2.00,-1.2,-.5,.3,1.1,1.85
       2030 DATA -2.15,-1.4,-.6,.15,.9,1.7,-2.3,-1.55,-.8,0,.8,1.55
        740 B=B(ABS(A-DROP))

   Dua puluh empat bilangan, satu per kuadran, tersusun 6 kolom x 4 baris
   persis seperti petanya:

       -1,85  -1,10  -0,30   0,45   1,20   2,00
       -2,00  -1,20  -0,50   0,30   1,10   1,85
       -2,15  -1,40  -0,60   0,15   0,90   1,70
       -2,30  -1,55  -0,80   0,00   0,80   1,55

   Nilainya simpangan mendatar bom per langkah: negatif ke kiri, positif ke
   kanan, dan makin ke bawah makin condong ke kiri. Dihitung tangan, ditulis
   sebagai DATA, dan dipakai supaya bom terlihat jatuh MENUJU kuadran yang
   dipilih. Tidak ada trigonometri untuk itu — cuma tabel.

   ------------------------------------------------------------------------
   KAPAL SELAMNYA TIDAK PERNAH ADA DI BARIS TEPI

       440 A=FIX(RND*24):IF (A>6 AND A<11) OR (A>12 AND A<17) THEN 450 ELSE 430

   Kepala kapal selam hanya boleh di kuadran 7-10 atau 13-16 — yaitu
   H I J K dan N O P Q, empat kolom tengah dari dua baris tengah. Alasannya
   praktis: baris 470-550 menaruh dua sel sisanya di salah satu dari delapan
   arah (+-1, +-5, +-6, +-7), dan tanpa batasan itu tetangganya bisa jatuh di
   luar kisi. Jadi baris paling atas dan paling bawah tidak pernah memuat
   kepala kapal selam — tapi bisa memuat ekornya.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();
  const $ = (id) => document.getElementById(id);
  const db = store('sub');

  const KOL = 6, BAR = 4, PER = KOL * BAR;      // 24 kuadran per tingkat
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const e = document.createElementNS(NS, t);
    if (a) for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };
  const bunyi = (f, t) => { if ($('bunyi').checked) audio.sound(f, t); };
  const lagu = (m) => $('bunyi').checked
    ? Promise.resolve(audio.play(m, { fresh: true })).catch(() => {})
    : Promise.resolve();

  /* --- baris 2020-2030: tabel balistik ------------------------------------ */
  const BALISTIK = [
    -1.85, -1.1, -0.3, 0.45, 1.2, 2.00,
    -2.00, -1.2, -0.5, 0.30, 1.1, 1.85,
    -2.15, -1.4, -0.6, 0.15, 0.9, 1.70,
    -2.30, -1.55, -0.8, 0.00, 0.8, 1.55
  ];
  /* Delapan arah tetangga di kisi enam kolom, baris 470-550. */
  const ARAH = [1, 7, 6, 5, -1, -7, -6, -5];

  /* --- keadaan ------------------------------------------------------------ */
  let kapal = [];            // SUB(1..3) — indeks 0..71, 99 = sudah kena
  /* Posisi ASLI ketiga selnya, disimpan terpisah dan tidak pernah diubah.
     `kapal` kehilangan isinya begitu kena (baris 200-220 menimpanya dengan 99),
     jadi tanpa salinan ini tidak ada cara mengungkap letaknya sesudah kalah. */
  let kapalAsli = [];
  let ungkap = false;
  let ditembak = new Set();  // sel yang sudah dibom
  /* Sel yang KENA disimpan terpisah. Tidak bisa disimpulkan dari `kapal`,
     karena baris 200-220 menimpa SUB(n) dengan 99 begitu kena — jadi sesudah
     dihitung, selnya berhenti "milik" kapal selam. Versi pertama menandainya
     dari `kapal` dan tanda merahnya langsung hilang lagi. */
  let kenaSet = new Set();
  let hit = 0, tembakan = 0, giliran = 0;
  let main = false, acak = rng(1), kapten = '';
  let bomJalan = null;

  const svg = $('svg');
  let gLaut, gKisi, gTanda, gBom, gTeks;

  (function defs() {
    const d = mkn('defs');
    [['glaut', ['#0d2740', 0], ['#08192b', .55], ['#040c16', 1]]].forEach(([id, ...st]) => {
      const g = mkn('linearGradient', { id, x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
      st.forEach(([c, o]) => g.append(mkn('stop', { offset: o, 'stop-color': c })));
      d.append(g);
    });
    const f = mkn('filter', { id: 'sglow', x: '-70%', y: '-70%', width: '240%', height: '240%' });
    f.append(mkn('feGaussianBlur', { stdDeviation: 3, result: 'b' }));
    const m = mkn('feMerge');
    m.append(mkn('feMergeNode', { in: 'b' }), mkn('feMergeNode', { in: 'SourceGraphic' }));
    f.append(m); d.append(f); svg.append(d);
  })();

  gLaut = mkn('g'); gKisi = mkn('g'); gTanda = mkn('g');
  gBom = mkn('g'); gTeks = mkn('g');
  svg.append(gLaut, gKisi, gTanda, gBom, gTeks);

  /* Tata letak: tiga tingkat bertumpuk, tiap tingkat 6x4 dan tiap barisnya
     digeser ke kiri — meniru `POKE A+156` di baris 640-660, yang menambah
     160 (satu baris) lalu MENGURANGI 4 (dua kolom). Jadi petanya memang
     miring di aslinya; itu bukan tambahan. */
  const SELW = 46, SELH = 20, GESER = 11;
  /* Ketiga kisi dinaikkan (44/168/292 -> 36/152/268) supaya tingkat 3 berakhir
     di y=348 dan menyisakan 52 satuan di bawah untuk baris pesan. Versi
     pertama membuat pesan kekalahan menutupi kapal selam yang baru diungkap —
     tepat gambar yang paling perlu dilihat. */
  const ASAL = [{ x: 60, y: 36 }, { x: 60, y: 152 }, { x: 60, y: 268 }];

  function pusat(i) {
    const t = Math.floor(i / PER), q = i % PER;
    const r = Math.floor(q / KOL), c = q % KOL;
    return { x: ASAL[t].x + c * SELW - r * GESER + SELW / 2,
             y: ASAL[t].y + r * SELH + SELH / 2, t, r, c, q };
  }
  const huruf = (q) => String.fromCharCode(65 + q);

  /* --- menggambar ---------------------------------------------------------- */
  function gambar() {
    gLaut.textContent = '';
    gLaut.append(mkn('rect', { class: 's-laut', x: 0, y: 0, width: 640, height: 400 }));
    for (let i = 0; i < 3; i++) {
      gLaut.append(mkn('line', { class: 's-garisTingkat', x1: 20, y1: ASAL[i].y - 10,
                                 x2: 620, y2: ASAL[i].y - 10 }));
    }

    gKisi.textContent = '';
    for (let i = 0; i < 72; i++) {
      const p = pusat(i);
      const g = mkn('g', { class: 's-sel', tabindex: main ? '0' : '-1',
                           role: 'button',
                           'aria-label': 'Tingkat ' + (p.t + 1) + ' kuadran ' + huruf(p.q) });
      g.append(mkn('path', { class: 's-petak',
        d: 'M' + (p.x - SELW / 2 + 3) + ' ' + (p.y - SELH / 2 + 2) +
           ' l' + (SELW - 6) + ' 0 l' + (-GESER) + ' ' + (SELH - 4) +
           ' l' + (-(SELW - 6)) + ' 0 Z' }));
      const l = mkn('text', { class: 's-huruf', x: p.x - GESER / 2, y: p.y + 4,
                              'text-anchor': 'middle' });
      l.textContent = huruf(p.q);
      g.append(l);
      g.addEventListener('click', () => pilih(i));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pilih(i); }
      });
      gKisi.append(g);
    }

    gTanda.textContent = '';
    ditembak.forEach(i => {
      const p = pusat(i);
      const k = kenaSet.has(i) ? 's-kena' : 's-luput';
      gTanda.append(mkn('circle', { class: 'ss ' + k, cx: p.x - GESER / 2, cy: p.y, r: 7 }));
    });

    /* --- pengungkap: hanya sesudah kalah ---------------------------------
       Digambar dari `kapalAsli`, bukan dari `kapal` — lihat catatan di sana.
       Bentuknya satu badan memanjang yang melintasi ketiga sel, supaya
       terlihat bahwa ketiganya memang BERSAMBUNGAN dan sejajar. */
    if (ungkap && kapalAsli.length === 3) {
      const p0 = pusat(kapalAsli[0]);                    // kepala
      const p1 = pusat(kapalAsli[1]), p2 = pusat(kapalAsli[2]);
      const ax = (q) => q.x - GESER / 2;
      const sudut = Math.atan2(p1.y - p2.y, ax(p1) - ax(p2)) * 180 / Math.PI;
      const g = mkn('g', { class: 's-ungkap',
        transform: 'translate(' + ax(p0) + ' ' + p0.y + ') rotate(' + sudut.toFixed(2) + ')' });
      const L = Math.hypot(ax(p1) - ax(p2), p1.y - p2.y) / 2 + 16;
      g.append(mkn('rect', { class: 's-badan', x: -L, y: -7, width: L * 2, height: 14, rx: 7 }));
      g.append(mkn('path', { class: 's-menara', d: 'M-7 -7 L-5 -14 L5 -14 L7 -7 Z' }));
      g.append(mkn('line', { class: 's-periskop', x1: 0, y1: -14, x2: 0, y2: -20 }));
      g.append(mkn('circle', { class: 's-mata', cx: 0, cy: 0, r: 2.4 }));
      gTanda.append(g);
      kapalAsli.forEach(i => {
        const p = pusat(i);
        gTanda.append(mkn('rect', { class: 's-selUngkap',
          x: p.x - SELW / 2 + 3, y: p.y - SELH / 2 + 2,
          width: SELW - 6, height: SELH - 4 }));
      });
    }

    gTeks.textContent = '';
    for (let i = 0; i < 3; i++) {
      /* Rata KANAN di x=624: rata kiri di 596 membuat "LEVEL 3" menjulur
         sampai ~642 dan terpotong tepi viewBox 640. */
      const t = mkn('text', { class: 's-tingkat', x: 624, y: ASAL[i].y + 44,
                              'text-anchor': 'end' });
      t.textContent = 'LEVEL ' + (i + 1);
      gTeks.append(t);
    }
    const st = mkn('text', { class: 's-status', x: 16, y: 22, 'xml:space': 'preserve' });
    st.textContent = 'CAPT ' + (kapten || '—') + '   HITS TAKEN ' + hit + '/3' +
                     '   SUB ' + kenaSet.size + '/3';
    gTeks.append(st);
    if (besar) {
      const t = mkn('text', { class: 's-besar', x: 320, y: 200, 'text-anchor': 'middle' });
      t.textContent = besar;
      gTeks.append(t);
    }
  }

  let besar = '';
  const pesan = (t) => { $('pesan').textContent = t || ''; };

  function papan() {
    $('s-kena').textContent = kenaSet.size + ' / 3';
    $('s-hit').textContent = hit + ' / 3';
    $('s-tembakan').textContent = tembakan + ' / 3';
    $('s-giliran').textContent = giliran;
    $('s-dibom').textContent = ditembak.size;
  }

  /* --- baris 430-560: taruh kapal selam ------------------------------------ */
  function taruhKapal() {
    let a;
    do { a = Math.floor(acak.next() * 24); }                 // 440
    while (!((a > 6 && a < 11) || (a > 12 && a < 17)));
    a += Math.floor(acak.next() * 3) * 24;                   // 450
    const d = ARAH[Math.floor(acak.next() * 8)];             // 470-550
    kapal = [a, a + d, a - d];                               // 560
    kapalAsli = kapal.slice();                               // kepala di indeks 0
  }

  /* --- baris 300-380 + 710-910: pilih kuadran & jatuhkan bom --------------- */
  function pilih(i) {
    if (!main || bomJalan) return;
    if (ditembak.has(i)) { pesan('Kuadran itu sudah dibom.'); return; }
    jatuhkanBom(i);
  }

  function jatuhkanBom(i) {
    const p = pusat(i);
    const drift = BALISTIK[p.q];                             // 740: B=B(ABS(A-DROP))
    bomJalan = true;
    ditembak.add(i);
    tembakan += 1;

    /* Baris 770-830: lintasan kosinus, 14 langkah. Simpangan mendatarnya
       diambil dari tabel balistik — jadi bomnya memang jatuh MENUJU kuadran
       yang dipilih, dan sudut jatuhnya berbeda tiap kuadran. */
    const langkah = [];
    const x0 = 320, y0 = 8;
    for (let n = 0; n <= 13; n++) {
      const e = 1.5 + n * 0.25;                              // 770
      const naik = Math.cos(e) * (3 + Math.abs(drift));      // 780
      langkah.push({ x: x0 + (p.x - GESER / 2 - x0) * (n / 13) + drift * n * 1.6,
                     y: y0 + (p.y - y0) * (n / 13) - naik * 4 });
    }
    /* Digerakkan `loop.js` (rAF berlangkah tetap), BUKAN `setInterval`.
       Sebabnya sudah dibayar di halaman lain koleksi ini: setInterval dicekik
       jadi >=1 detik di tab latar belakang, dan animasi 14 langkah berubah
       jadi 14 detik. rAF berhenti sama sekali di tab latar — itu jujur, dan
       ia bisa dipompa saat diuji. */
    let n = 0;
    const jalan = loop({ hz: 18, update: () => {
      gBom.textContent = '';
      const s = langkah[n];
      gBom.append(mkn('circle', { class: 's-bom', cx: s.x, cy: s.y, r: 4 }));
      if (n > 0) gBom.append(mkn('line', { class: 's-jejak', x1: langkah[n - 1].x,
                                           y1: langkah[n - 1].y, x2: s.x, y2: s.y }));
      bunyi(1000 - n * 60, .2);
      n += 1;
      if (n >= langkah.length) { jalan.stop(); ledak(i); }
    } });
    jalan.start();
  }

  function ledak(i) {
    gBom.textContent = '';
    bomJalan = null;
    const p = pusat(i);
    const kenaKapal = kapal.includes(i);
    if (kenaKapal) {                                         // 200-220
      kenaSet.add(i);
      kapal[kapal.indexOf(i)] = 99;
      bunyi(120, 4);
    }
    letusan(p.x - GESER / 2, p.y, kenaKapal);
    gambar(); papan();

    if (kapal.every(c => c === 99)) return menang();         // 230
    if (tembakan < 3) {                                      // 240
      pesan(kenaKapal ? 'KENA! Bagian kapal selam hancur.' : 'Meleset.');
      return;
    }
    /* Tiga tembakan habis: kapal selam membalas, baris 250-290. */
    tembakan = 0; giliran += 1;
    let tunda = 0;
    const jeda = loop({ hz: 6, update: () => {
      tunda += 1; if (tunda >= 4) { jeda.stop(); balasan(); }
    } });
    jeda.start();
  }

  function balasan() {
    const luput = Math.floor(acak.next() * 2);               // 260: MISS=FIX(RND*2)
    if (luput) {
      pesan('Torpedo musuh meleset. Giliran Anda lagi.');
      bunyi(220, 3);
    } else {
      hit += 1;                                              // 270
      pesan('Kapal Anda terkena torpedo. ' + hit + ' dari 3.');
      bunyi(90, 6);
      guncang();
      if (hit === 3) return kalah();                         // 280
    }
    /* Kapal selam berpindah tiap giliran? TIDAK — baris 290 kembali ke 180
       yang cuma menggambar ulang peta. Posisinya tetap sepanjang permainan. */
    gambar(); papan();
  }

  /* --- akhir ---------------------------------------------------------------- */
  function menang() {
    main = false; besar = 'SUB DESTROYED';
    gambar(); papan();
    pesan('Kapal selam tenggelam, Kapten ' + kapten + ' — ' + sebutLetak() +
          '. Giliran terpakai: ' + giliran + '.');
    lagu('MB MN T120 O2 G8 G8. G16 G8. F16 E8. G16 O3 C8. D16 E8. E16 E8. D16 C4');  // 2710
    const r = db.get('rekor', null);
    if (!r || giliran < r) db.set('rekor', giliran);
    $('s-rekor').textContent = db.get('rekor', '—');
    $('mulai').disabled = false; $('mulai').textContent = 'Main lagi';
  }

  function kalah() {
    main = false; besar = 'YOUR SHIP IS LOST';
    ungkap = true;                                   // perlihatkan letaknya
    gambar(); papan();
    pesan('Tiga torpedo. Kapal Anda tenggelam, Kapten ' + kapten + '. ' +
          'Kapal selam ada di ' + sebutLetak() + '.');
    lagu('T100 MN MB O3L8C.L16C L2F.L8C.L16F L2A.L8C.L16F L4A');                     // 2640
    $('mulai').disabled = false; $('mulai').textContent = 'Main lagi';
  }

  /* Menyebut letaknya dengan kata, bukan cuma menggambarnya: kepala lebih
     dulu, lalu kedua ekornya, dengan tingkatnya. */
  function sebutLetak() {
    if (kapalAsli.length !== 3) return '—';
    const t = Math.floor(kapalAsli[0] / PER) + 1;
    const ek = [kapalAsli[1], kapalAsli[2]].sort((a, b) => a - b).map(i => huruf(i % PER));
    return 'tingkat ' + t + ', kuadran ' + huruf(kapalAsli[0] % PER) +
           ' (kepala) dengan ' + ek.join(' dan ');
  }

  /* --- efek ----------------------------------------------------------------- */
  function letusan(x, y, kena) {
    const c = mkn('circle', { class: 's-letus' + (kena ? ' s-letus--kena' : ''),
                              cx: x, cy: y, r: 6 });
    gBom.append(c);
    c.addEventListener('animationend', () => c.remove());
    setTimeout(() => c.remove(), 900);
  }
  let gT = 0;
  function guncang() {
    const el = $('crt');
    el.classList.remove('s-crt--guncang'); void el.offsetWidth;
    el.classList.add('s-crt--guncang');
    clearTimeout(gT); gT = setTimeout(() => el.classList.remove('s-crt--guncang'), 420);
  }

  /* --- mulai ----------------------------------------------------------------- */
  function mulai() {
    kapten = ($('kapten').value || '').trim().slice(0, 12);
    if (kapten.length < 2) kapten = '';                      // 2110
    acak = rng(new Date().getSeconds() * 1000 + Math.floor(Math.random() * 999));
    kapal = []; kapalAsli = []; ditembak = new Set(); kenaSet = new Set();
    ungkap = false;
    hit = 0; tembakan = 0; giliran = 0; besar = ''; bomJalan = null;
    taruhKapal();
    main = true;
    pesan('Pilih kuadran mana pun di ketiga tingkat. Tiga bom per giliran.');
    $('mulai').disabled = true;
    gambar(); papan();
    lagu('MB T200O3L4 MLCCMBMNEGMLAL8AMNL8EL4L2AO4CL4DO3GO4L1C');                     // 2050
  }

  /* --- pasang ---------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: 'Sub', source: 'SUB.BAS · perburuan kapal selam · 80 kolom'
  }));
  $('mulai').addEventListener('click', mulai);
  $('s-rekor').textContent = db.get('rekor', '—');

  /* Tabel balistik ditampilkan dari datanya, bukan diketik di HTML. */
  const tb = $('tabel-balistik');
  for (let r = 0; r < 4; r++) {
    const tr = ui.el('tr');
    for (let c = 0; c < 6; c++) {
      const v = BALISTIK[r * 6 + c];
      tr.append(ui.el('td', { class: 'mono' + (v < 0 ? ' s-kiri' : v > 0 ? ' s-kanan' : ''),
                              text: v.toFixed(2).replace('.', ',') }));
    }
    tb.append(tr);
  }
  /* Kuadran yang boleh memuat kepala kapal selam — dihitung, bukan diketik. */
  const sah = [];
  for (let a = 0; a < 24; a++) if ((a > 6 && a < 11) || (a > 12 && a < 17)) sah.push(huruf(a));
  $('b-sah').textContent = sah.join(' ');

  gambar(); papan();
  pesan('Isi nama kapten lalu Mulai.');
})();
