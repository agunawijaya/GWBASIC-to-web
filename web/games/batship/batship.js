/* ===========================================================================
   batship.js — port BATSHIP.BAS (G.S. Alberts, IBM Burlington/Essex Junction
   Vermont, revisi terakhir 27 Juli 1982)

   Tiga hal yang menentukan seluruh berkas ini:

   1. PAPANNYA TIDAK PERNAH MENANDAI KENA. Baris 5850 hanya mencetak nomor
      giliran di petak yang ditembak. Yang memberi tahu Anda kena adalah kartu
      skor di sebelah kanan -- dan kartu itu cuma bilang "giliran ke-n mengenai
      KAPAL INDUK", bukan petak yang mana. Anda menembak tiga kali per giliran,
      jadi Anda tahu SESUATU kena tapi tidak tahu yang mana. Itu bukan
      kekurangan; itu seluruh permainannya.

   2. KAPAL INDUKNYA BERBENTUK SALIB. Baris 2920 menyebutnya sendiri:
      "WHICH END OF THE AIRCRAFT CARRIER HAS THE CROSS". Lima petak lurus plus
      dua petak melintang di salah satu ujungnya. Tujuh petak, bukan lima.

   3. KAPAL TIDAK BOLEH BERSENTUHAN, dan aturannya ditegakkan dengan larik
      "XED/YED": tiap petak yang sudah terisi mencoret 3x3 di sekelilingnya.
      Baris 5090-5210.
   =========================================================================== */
(function () {
  'use strict';

  const audio = window.RETRO.audio;
  const store = window.RETRO.store('batship');
  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };

  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const q = (id) => document.getElementById(id);

  /* ======================================================================
     Bagian 1 — kapal
     Indeks petak 1..22 persis seperti X()/Y() di aslinya; itu yang dipakai
     baris 5940-5990 untuk memutuskan kapal mana yang kena.
     ====================================================================== */
  const KAPAL = [
    { kode: 'AC', nama: 'AIRCRAFT CARRIER', dari: 1,  sampai: 7 },
    { kode: 'BB', nama: 'BATTLESHIP',       dari: 8,  sampai: 12 },
    { kode: 'CR', nama: 'CRUISER',          dari: 13, sampai: 16 },
    { kode: 'DD', nama: 'DESTROYER',        dari: 17, sampai: 19 },
    { kode: 'SS', nama: 'SUB',              dari: 20, sampai: 21 },
    { kode: 'PT', nama: 'P.T.',             dari: 22, sampai: 22 }
  ];
  const TOTAL = 22;                       // baris 1610: …=22 berarti semua tenggelam

  /* ======================================================================
     Bagian 2 — penempatan, baris 2910..5080 apa adanya
     ====================================================================== */
  function tempatkan(rnd) {
    const X = new Array(23).fill(0), Y = new Array(23).fill(0);
    let coba = 0, tolak = 0;
    const r10 = () => Math.floor(10 * rnd());
    const r4 = () => Math.floor(4 * rnd());

    /* --- kapal induk: lima lurus + dua melintang (baris 2910-3330) ------- */
    for (;;) {
      coba++;
      const x = r10(), y = r10(), z = r4(), e = Math.floor(2 * rnd()) + 1;
      if ((y < 4 && z === 0) || (x > 5 && z === 1) ||
          (y > 5 && z === 2) || (x < 4 && z === 3)) { tolak++; continue; }
      if ((z === 0 && (x === 0 || x === 9)) || (z === 1 && (y === 0 || y === 9)) ||
          (z === 2 && (x === 0 || x === 9)) || (z === 3 && (y === 0 || y === 9))) {
        tolak++; continue;
      }
      if (z === 0) {
        for (let i = 1; i <= 5; i++) { X[i] = x; Y[i] = y - (i - 1); }
        X[6] = x + 1; X[7] = x - 1;
        Y[6] = Y[7] = (e === 1 ? y : Y[5]);
      } else if (z === 1) {
        for (let i = 1; i <= 5; i++) { X[i] = x + (i - 1); Y[i] = y; }
        Y[6] = y + 1; Y[7] = y - 1;
        X[6] = X[7] = (e === 1 ? x : X[5]);
      } else if (z === 2) {
        for (let i = 1; i <= 5; i++) { X[i] = x; Y[i] = y + (i - 1); }
        X[6] = x + 1; X[7] = x - 1;
        Y[6] = Y[7] = (e === 1 ? y : Y[5]);
      } else {
        for (let i = 1; i <= 5; i++) { X[i] = x - (i - 1); Y[i] = y; }
        Y[6] = y + 1; Y[7] = y - 1;
        X[6] = X[7] = (e === 1 ? x : X[5]);
      }
      break;
    }

    /* --- larik coretan: 3x3 di sekeliling tiap petak terisi (baris 5090) -- */
    let ZZZ = 7;
    let XED = [], YED = [];
    const coret = () => {
      XED = []; YED = [];
      for (let i = 1; i <= ZZZ; i++) {
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) { XED.push(X[i] + dx); YED.push(Y[i] + dy); }
      }
    };
    coret();

    /* --- baris 5290: petak kapal baru tidak boleh jatuh di coretan -------- */
    const bentrok = (dari, sampai) => {
      for (let i = 0; i < XED.length; i++)
        for (let j = dari; j <= sampai; j++)
          if (X[j] === XED[i] && Y[j] === YED[i]) return true;
      return false;
    };

    /* --- kapal lurus: 5, 4, 3, 2 ----------------------------------------- */
    const LURUS = [
      { n: 5, dari: 8,  batas: 4 },   // baris 3440-3470: butuh 4 petak di depan
      { n: 4, dari: 13, batas: 3 },
      { n: 3, dari: 17, batas: 2 },
      { n: 2, dari: 20, batas: 1 }
    ];
    for (const k of LURUS) {
      for (;;) {
        coba++;
        const x = r10(), y = r10(), z = r4();
        if ((z === 0 && y < k.batas) || (z === 1 && x > 9 - k.batas) ||
            (z === 2 && y > 9 - k.batas) || (z === 3 && x < k.batas)) { tolak++; continue; }
        for (let i = 0; i < k.n; i++) {
          const j = k.dari + i;
          X[j] = x + (z === 1 ? i : z === 3 ? -i : 0);
          Y[j] = y + (z === 2 ? i : z === 0 ? -i : 0);
        }
        if (bentrok(k.dari, k.dari + k.n - 1)) { tolak++; continue; }
        ZZZ += k.n; coret(); break;
      }
    }

    /* --- kapal PT: satu petak (baris 4990-5050) --------------------------- */
    for (;;) {
      coba++;
      X[22] = r10(); Y[22] = r10();
      if (bentrok(22, 22)) { tolak++; continue; }
      ZZZ += 1; break;
    }
    return { X, Y, coba, tolak };
  }

  /* ======================================================================
     Bagian 3 — keadaan
     ====================================================================== */
  let X = [], Y = [];
  let giliran = 1, tembakSalvo = [], papan = {}, kenaKapal = {};
  let kartu = {}, hidup = false, ungkap = false, intip = false;
  let benih = 1982, statPenempatan = null, totalTembakan = 0;

  const kunci = (x, y) => y * 10 + x;

  /* ======================================================================
     Bagian 4 — gambar
     ====================================================================== */
  const svg = q('svg');
  const gAir = mkn('g', {}), gPetak = mkn('g', {}), gKapal = mkn('g', {});
  const gTanda = mkn('g', {}), gKartu = mkn('g', {});
  /* Kapal digambar DI BAWAH petak: petaknya tembus pandang, jadi nomor giliran
     tetap terbaca di atas lambung kapal saat diungkap. Kalau urutannya
     dibalik, pengungkapan justru menutupi bukti yang mau diperlihatkan. */
  [gAir, gKapal, gPetak, gTanda, gKartu].forEach(g => svg.append(g));

  const SEL = 42, X0 = 46, Y0 = 46;
  const px = (x) => X0 + x * SEL, py = (y) => Y0 + y * SEL;

  (function latar() {
    const defs = mkn('defs', {});
    const gr = mkn('linearGradient', { id: 'b-laut', x1: 0, y1: 0, x2: 0, y2: 1 });
    [['0%', '#0a2438'], ['60%', '#0d2f47'], ['100%', '#071a29']].forEach(([o, c]) =>
      gr.append(mkn('stop', { offset: o, 'stop-color': c })));
    defs.append(gr);
    svg.append(defs);
    gAir.append(mkn('rect', { class: 'b-laut', x: 0, y: 0, width: 780, height: 520 }));
    /* riak: ditaruh sekali dengan benih tetap, bukan animasi berat */
    const r = acak(7);
    for (let i = 0; i < 70; i++) {
      const x = 20 + r() * 740, y = 20 + r() * 480, w = 6 + r() * 14;
      gAir.append(mkn('path', {
        class: 'b-riak', d: 'M' + x + ' ' + y + ' q' + (w / 2) + ' -3 ' + w + ' 0'
      }));
    }
  })();

  function gambarPapan() {
    gPetak.textContent = '';
    for (let i = 0; i <= 9; i++) {
      const t = mkn('text', { class: 'b-tepi', x: px(i) + SEL / 2, y: Y0 - 10 });
      t.textContent = i; gPetak.append(t);
      const h = mkn('text', { class: 'b-tepi', x: X0 - 12, y: py(i) + SEL / 2 + 5 });
      h.textContent = String.fromCharCode(65 + i); gPetak.append(h);
    }
    for (let y = 0; y <= 9; y++) for (let x = 0; x <= 9; x++) {
      const g = mkn('g', {
        class: 'b-sel', tabindex: '0', role: 'button',
        'aria-label': 'Tembak ' + String.fromCharCode(65 + y) + x
      });
      g.dataset.k = kunci(x, y);
      g.append(mkn('rect', {
        class: 'b-petak', x: px(x) + 1.5, y: py(y) + 1.5,
        width: SEL - 3, height: SEL - 3, rx: 3
      }));
      const t = mkn('text', { class: 'b-nomor', x: px(x) + SEL / 2, y: py(y) + SEL / 2 + 6 });
      g.append(t);
      g.addEventListener('click', () => tembak(x, y));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tembak(x, y); }
      });
      gPetak.append(g);
    }
  }

  /* Kartu skornya adalah GAMBAR kapalnya. Baris 6080-6140 menaruh tujuh kotak
     kapal induk pada pola salib: lima mendatar, satu di atas kotak pertama,
     satu di bawahnya. Tata letak di bawah ini mengikuti LOCATE aslinya. */
  const KARTU = {
    AC: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [0, 0], [0, 2]],
    BB: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    CR: [[0, 0], [1, 0], [2, 0], [3, 0]],
    DD: [[0, 0], [1, 0], [2, 0]],
    SS: [[0, 0], [1, 0]],
    PT: [[0, 0]]
  };
  const KX = 520, KW = 40, KH = 30;
  const BARIS = { AC: 46, BB: 200, CR: 272, DD: 344, SS: 416, PT: 416 };
  const GESER = { PT: 3 * KW };   // kolom 56 -> 71 = tiga langkah lima kolom

  function gambarKartu() {
    gKartu.textContent = '';
    KAPAL.forEach(k => {
      const y0 = BARIS[k.kode], x0 = KX + (GESER[k.kode] || 0);
      const label = mkn('text', { class: 'b-label', x: x0, y: y0 - 8 });
      label.textContent = k.nama + '  (' + (k.sampai - k.dari + 1) + ')';
      gKartu.append(label);
      KARTU[k.kode].forEach(([cx, cy], i) => {
        const g = mkn('g', { class: 'b-slot' });
        g.append(mkn('rect', {
          class: 'b-slotKotak', x: x0 + cx * KW, y: y0 + cy * KH,
          width: KW - 5, height: KH - 5, rx: 3
        }));
        const t = mkn('text', {
          class: 'b-slotTeks', x: x0 + cx * KW + (KW - 5) / 2,
          y: y0 + cy * KH + (KH - 5) / 2 + 5
        });
        const isi = (kartu[k.kode] || [])[i];
        if (isi) { t.textContent = isi; g.classList.add('b-slot--isi'); }
        g.append(t);
        gKartu.append(g);
      });
    });
  }

  function perbaruiPapan() {
    gPetak.querySelectorAll('.b-sel').forEach(g => {
      const k = +g.dataset.k, v = papan[k];
      const t = g.querySelector('text');
      t.textContent = v || '';
      g.classList.toggle('b-sel--tembak', !!v);
      g.classList.toggle('b-sel--baru', tembakSalvo.some(s => s.k === k));
    });
  }

  /* Kapal baru digambar kalau permainan selesai (atau tombol "Intip" ditekan),
     persis seperti pengungkapan di SUB: buktinya harus bisa diperiksa. */
  function gambarKapal() {
    gKapal.textContent = '';
    if (!(ungkap || intip)) return;
    KAPAL.forEach(k => {
      for (let i = k.dari; i <= k.sampai; i++) {
        const g = mkn('rect', {
          class: 'b-kapal b-kapal--' + k.kode,
          x: px(X[i]) + 4, y: py(Y[i]) + 4, width: SEL - 8, height: SEL - 8, rx: 4
        });
        gKapal.append(g);
      }
      /* Kode kapal di pojok petak pertamanya, bukan di tengah -- tengahnya
         sudah dipakai nomor giliran. */
      const t = mkn('text', {
        class: 'b-kapalNama', x: px(X[k.dari]) + 6, y: py(Y[k.dari]) + 13
      });
      t.textContent = k.kode;
      gKapal.append(t);
    });
  }

  /* ======================================================================
     Bagian 5 — menembak
     ====================================================================== */
  function tembak(x, y) {
    if (!hidup) return;
    const k = kunci(x, y);
    if (papan[k]) { pesan('YOU USED THAT ONE BEFORE - TRY AGAIN', 'b-pesan--awas'); return; }
    if (tembakSalvo.length >= 3) {
      pesan('NOW CALCULATING THE RESULTS OF YOUR SHOTS…');   // baris 5880
      return;
    }
    papan[k] = giliran;
    tembakSalvo.push({ x, y, k });
    totalTembakan++;
    bunyiTembak();
    perbaruiPapan();
    perbaruiHud();
    pesan('SHOT #' + tembakSalvo.length + ' FOR TURN #' + giliran);
    if (tembakSalvo.length === 3) setTimeout(hitungSalvo, 260);
  }

  /* Baris 5900..6010: hasil dihitung SESUDAH ketiga tembakan, dan yang
     dilaporkan hanya "kapal apa", bukan "petak mana". */
  function hitungSalvo() {
    const kenaSekarang = [];
    tembakSalvo.forEach(s => {
      for (let K = 1; K <= 22; K++) {
        if (s.x === X[K] && s.y === Y[K]) {
          const kap = KAPAL.find(k => K >= k.dari && K <= k.sampai);
          kenaKapal[kap.kode] = (kenaKapal[kap.kode] || 0) + 1;
          kartu[kap.kode] = kartu[kap.kode] || [];
          kartu[kap.kode].push(giliran);
          kenaSekarang.push(kap);
        }
      }
    });
    gambarKartu();

    const jumlah = KAPAL.reduce((a, k) => a + (kenaKapal[k.kode] || 0), 0);
    const tenggelam = KAPAL.filter(k => (kenaKapal[k.kode] || 0) === k.sampai - k.dari + 1);

    if (kenaSekarang.length === 0) {
      pesan('TURN #' + giliran + ' — tidak ada yang kena.', 'b-pesan--awas');
    } else {
      const daftar = {};
      kenaSekarang.forEach(k => { daftar[k.nama] = (daftar[k.nama] || 0) + 1; });
      const s = Object.keys(daftar).map(n => daftar[n] + '× ' + n).join(', ');
      pesan('TURN #' + giliran + ' — kena: ' + s +
            (tenggelam.length ? '  ·  tenggelam: ' + tenggelam.map(t => t.kode).join(' ') : ''),
            'b-pesan--baik');
      audio.sound(160, 3);
    }

    if (jumlah === TOTAL) { menang(); return; }
    giliran += 1;
    tembakSalvo = [];
    perbaruiPapan();
    perbaruiHud();
  }

  function menang() {
    hidup = false; ungkap = true;
    gambarKapal(); perbaruiPapan(); perbaruiHud();
    /* Baris 1660 menulis "SHOTS", padahal yang dihitungnya GILIRAN. */
    pesan('OK———SO YOU FINALLY DID IT IN ' + giliran + ' SHOTS   ' +
          '(aslinya menulis "SHOTS"; yang dihitung giliran — ' +
          totalTembakan + ' tembakan sungguhan)', 'b-pesan--baik');
    const rekor = store.get('rekor');
    if (!rekor || giliran < rekor) store.set('rekor', giliran);
    perbaruiHud();
    if (q('bunyi').checked) {
      audio.play('T150L8O3CFAO4L4CL8O3AO4L2C')          // baris 6400: charge
        .then(() => audio.play('O3L4CCL2FL4CFL2AL4CFACFACFL2AL4FAO4L2CO3AFCL4CCL1F'));
    }
    q('mulai').hidden = false; q('mulai').textContent = 'Main lagi';
  }

  /* Baris 5820: FOR I=2000 TO 80 STEP -5: SOUND I,0.2 -- 385 nada. Pada 0,2
     detak masing-masing itu 4,2 detik bunyi per tembakan, dan antrean SOUND
     GW-BASIC hanya 32 nada dalam, jadi BASIC ikut tertahan selama itu.
     Di sini sapuannya dipadatkan jadi 24 nada dengan jangkauan yang sama. */
  function bunyiTembak() {
    if (!q('bunyi').checked) return;
    let t = 0;
    for (let f = 2000; f >= 80; f -= 80) {
      const hz = f;
      setTimeout(() => audio.sound(hz, 0.4), t);
      t += 11;
    }
    setTimeout(() => { audio.sound(300, 2); }, t);
    setTimeout(() => { audio.sound(200, 6); }, t + 110);
  }

  /* ======================================================================
     Bagian 6 — antarmuka
     ====================================================================== */
  function pesan(s, kelas) {
    const p = q('pesan');
    p.className = 'b-pesan' + (kelas ? ' ' + kelas : '');
    p.textContent = s || '';
  }

  function perbaruiHud() {
    q('s-giliran').textContent = giliran;
    q('s-tembakan').textContent = totalTembakan;
    q('s-salvo').textContent = tembakSalvo.length + ' / 3';
    const jumlah = KAPAL.reduce((a, k) => a + (kenaKapal[k.kode] || 0), 0);
    q('s-kena').textContent = jumlah + ' / 22';
    q('s-benih').textContent = benih;
    const r = store.get('rekor');
    q('s-rekor').textContent = r ? r + ' giliran' : '—';
    q('s-coba').textContent = statPenempatan ?
      statPenempatan.coba + ' (' + statPenempatan.tolak + ' ditolak)' : '—';
    /* Baris 1440 menawarkan "lihat papan dan kapalnya" SEBELUM permainan
       mulai -- jadi tombol ini pun hanya hidup sebelum tembakan pertama. */
    const bisaIntip = hidup && totalTembakan === 0;
    q('b-intip').disabled = !bisaIntip;
    if (!bisaIntip && intip) {
      intip = false;
      q('b-intip').setAttribute('aria-pressed', 'false');
      q('b-intip').textContent = 'Intip kapal';
      gambarKapal();
    }
  }

  function mulai() {
    const rnd = acak(benih);
    statPenempatan = tempatkan(rnd);
    X = statPenempatan.X; Y = statPenempatan.Y;
    giliran = 1; tembakSalvo = []; papan = {}; kenaKapal = {}; kartu = {};
    totalTembakan = 0; hidup = true; ungkap = false; intip = false;
    gambarPapan(); gambarKartu(); gambarKapal(); perbaruiPapan(); perbaruiHud();
    pesan('SHOT #1 FOR TURN #1 — pilih petak di papan.');
    q('mulai').hidden = true;
    if (q('bunyi').checked) audio.play('T150L8O3CFAO4L4CL8O3AO4L2C');
  }

  /* --- pasang -------------------------------------------------------------- */
  q('topbar-host').append(window.RETRO.ui.topbar({
    title: 'Battleship', source: 'BATSHIP.BAS · G.S. Alberts · 27 Jul 1982'
  }));

  q('mulai').addEventListener('click', mulai);
  q('benih').addEventListener('change', (e) => {
    benih = parseInt(e.currentTarget.value, 10) || 0;
    perbaruiHud();
  });
  q('b-intip').addEventListener('click', () => {
    intip = !intip;
    q('b-intip').setAttribute('aria-pressed', String(intip));
    q('b-intip').textContent = intip ? 'Sembunyikan kapal' : 'Intip kapal';
    gambarKapal();
  });

  /* --- angka yang dihitung halaman ini sendiri ----------------------------- */
  (function isiBukti() {
    /* Baris 1170-1200: N = H*M*S dengan H yang bisa negatif. 86.400 detik
       dalam sehari; berapa benih yang berbeda? Dihitung, bukan dikutip. */
    const set = new Set(); let neg = 0;
    for (let hh = 0; hh < 24; hh++) for (let mm = 0; mm < 60; mm++) for (let ss = 0; ss < 60; ss++) {
      let H = 1 + hh; const M = 1 + mm, S = 1 + ss;
      if (H > 16) H = H - 12;
      if (H > 8) H = 8 - H;
      const N = H * M * S;
      set.add(N); if (N < 0) neg++;
    }
    q('bk-benih').textContent = set.size.toLocaleString('id-ID');
    q('bk-neg').textContent = (100 * neg / 86400).toFixed(0) + '%';
    q('bk-detik').textContent = (86400).toLocaleString('id-ID');
    /* Minimum giliran: 22 petak, 3 tembakan per giliran. */
    q('bk-min').textContent = Math.ceil(22 / 3);
    /* Maksimum giliran yang mungkin: 100 petak, tanpa boleh mengulang. */
    q('bk-maks').textContent = Math.ceil(100 / 3);
    /* Berapa kali penempatan ditolak, rata-rata atas 500 papan. */
    let coba = 0, tolak = 0;
    for (let i = 0; i < 500; i++) {
      const s = tempatkan(acak(1000 + i));
      coba += s.coba; tolak += s.tolak;
    }
    q('bk-coba').textContent = (coba / 500).toFixed(1).replace('.', ',');
    q('bk-tolak').textContent = (tolak / 500).toFixed(1).replace('.', ',');
  })();

  gambarPapan(); gambarKartu(); perbaruiHud();
  pesan('Tekan Mulai.');
})();
