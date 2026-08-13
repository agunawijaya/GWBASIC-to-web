/* ===========================================================================
   trucker-scene.js — pemandangan bergerak untuk TRUCKER.BAS

   Berkas ini TIDAK memuat satu pun aturan permainan. Aturannya seluruhnya di
   trucker.js; di sini hanya penyajian. Pemisahan itu disengaja: kalau nanti
   ada yang ingin memeriksa kesetiaan port terhadap BASIC-nya, ia cukup membaca
   satu berkas dan boleh mengabaikan yang ini sama sekali.

   Tiga gagasan yang membentuknya:

   1. PARALLAX BERLAPIS. Enam lapisan bergerak dengan pengali berbeda terhadap
      kecepatan yang sama: gunung 0,05 (praktis diam), bukit 0,14, jalur
      seberang 0,42, pinggir jalan 1,0, dan rumput terdepan 1,4. Kedalaman di
      layar 2D tidak lahir dari perspektif melainkan dari SELISIH KECEPATAN.

   2. RODA BERPUTAR MENURUT JARAK, BUKAN MENURUT WAKTU.
      sudut += (piksel yang ditempuh) / jari-jari. Jadi kalau truknya melambat,
      rodanya ikut melambat dengan sendirinya -- tidak ada satu pun angka
      "kecepatan putar" yang harus disetel.

   3. SATU JAM SIMULASI = SATU ANIMASI. Aturan dijalankan lebih dulu dan utuh
      (trucker.js), hasilnya dikumpulkan jadi antrean kejadian, lalu animasi
      MENETESKANNYA menurut jadwal. Urutan aturan tidak pernah bergantung pada
      animasi -- animasi cuma menceritakan apa yang sudah terjadi.
   =========================================================================== */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const n = (t, a, anak) => {
    const e = document.createElementNS(NS, t);
    for (const k in a) e.setAttribute(k, a[k]);
    if (anak) anak.forEach(c => c && e.append(c));
    return e;
  };
  const G = (a, anak) => n('g', a || {}, anak);

  /* --- tata letak vertikal, satu tempat -------------------------------------
     Semua angka lain di berkas ini menurunkan diri dari sini. */
  const L = {
    langit: 0, cakrawala: 238,
    jauhAtas: 240,           // tepi atas jalur berlawanan
    seberangY: 258,          // garis tanah jalur berlawanan (jauh)
    pagarY: 261,             // pagar pembatas median
    dekatAtas: 266,          // tepi atas jalur kita
    salipY: 308,             // garis tanah lajur salip (agak jauh)
    kitaY: 374,              // garis tanah lajur kita
    dekatBawah: 400,
    lebar: 800
  };
  const SKALA_SEBERANG = 0.54, SKALA_SALIP = 0.74;

  /* Pengali kecepatan tiap lapisan. Inilah seluruh rahasia kedalamannya. */
  const LAJU = {
    gunung: 0.05, bukit: 0.14, seberang: 0.42, pagar: 0.55,
    salip: 1.0, tabrak: 1.0, pinggir: 1.0, jalan: 1.0, depan: 1.4
  };

  /* ======================================================================
     Bagian 1 — palet & bentuk dasar
     ====================================================================== */
  /* Teks SVG tidak pernah membungkus dan tidak pernah mengecil sendiri. Semua
     teks di berkas ini karena itu membawa `data-maks` -- lebar kotak yang
     tersedia baginya -- dan diukur SESUDAH masuk dokumen dengan
     getComputedTextLength(). Kalau kepanjangan, ukuran hurufnya dikecilkan
     menurut rasio yang terukur.

     Kenapa bukan `textLength`? Karena atribut itu merenggangkan glif dan
     hasilnya terlihat gepeng -- pelajaran dari papan angka ATTACK.
     Mengecilkan ukuran huruf mempertahankan bentuknya. */
  function rapikanTeks(akar) {
    if (!akar || !akar.querySelectorAll) return;
    const daftar = akar.querySelectorAll('[data-maks]');
    for (let i = 0; i < daftar.length; i++) {
      const t = daftar[i];
      const maks = parseFloat(t.getAttribute('data-maks'));
      let lebar = 0;
      try { lebar = t.getComputedTextLength(); } catch (e) { continue; }
      if (!lebar || lebar <= maks) continue;
      const ukuran = parseFloat(global.getComputedStyle(t).fontSize) || 12;
      t.style.fontSize = (ukuran * maks / lebar).toFixed(2) + 'px';
    }
  }

  const roda = (r, kelas) => {
    /* Simpul luar tidak ikut berputar; hanya anaknya. Itu memisahkan
       "di mana rodanya" dari "seberapa jauh ia sudah berputar". */
    const putar = G({ class: 'sc-putar' }, [
      n('circle', { class: 'sc-ban', r: r }),
      n('circle', { class: 'sc-velg', r: r * 0.52 }),
      n('circle', { class: 'sc-noktah', cx: 0, cy: -r * 0.72, r: r * 0.17 }),
      n('line', { class: 'sc-jari', x1: -r * 0.5, y1: 0, x2: r * 0.5, y2: 0 }),
      n('line', { class: 'sc-jari', x1: 0, y1: -r * 0.5, x2: 0, y2: r * 0.5 })
    ]);
    return G({ class: 'sc-roda ' + (kelas || '') }, [putar]);
  };

  /* ======================================================================
     Bagian 2 — truk pemain
     Satu traktor (milik Anda), TIGA trailer (muatannya berganti). Itu bukan
     kemalasan menggambar: di terminal Los Angeles yang Anda pilih memang
     muatan, bukan kendaraan. Trailer yang berbeda itulah yang terlihat.
     ====================================================================== */
  function traktor() {
    const g = G({ class: 'sc-traktor' });
    /* sasis */
    g.append(n('rect', { class: 'sc-sasis', x: -16, y: -22, width: 132, height: 10 }));
    /* tangki bahan bakar krom & kotak aki */
    g.append(n('rect', { class: 'sc-tangki', x: 4, y: -30, width: 40, height: 17, rx: 8 }));
    g.append(n('rect', { class: 'sc-kotak', x: 48, y: -28, width: 22, height: 14, rx: 2 }));
    /* kabin tidur (sleeper) */
    g.append(n('path', { class: 'sc-kabin', d: 'M-14 -22 L-14 -74 L18 -74 L18 -22 Z' }));
    g.append(n('rect', { class: 'sc-garisKabin', x: -14, y: -52, width: 32, height: 3 }));
    /* kabin depan + kaca */
    g.append(n('path', { class: 'sc-kabin', d: 'M18 -22 L18 -80 L26 -86 L54 -86 L58 -74 L58 -22 Z' }));
    g.append(n('path', { class: 'sc-kaca', d: 'M24 -80 L50 -80 L54 -68 L24 -68 Z' }));
    g.append(n('rect', { class: 'sc-visor', x: 20, y: -88, width: 38, height: 5, rx: 2 }));
    /* moncong panjang khas conventional 1980-an */
    g.append(n('path', { class: 'sc-moncong', d: 'M58 -22 L58 -72 L104 -68 L112 -52 L112 -22 Z' }));
    g.append(n('rect', { class: 'sc-grill', x: 104, y: -52, width: 10, height: 24, rx: 2 }));
    for (let i = 0; i < 5; i++)
      g.append(n('line', { class: 'sc-grillGaris', x1: 105, y1: -49 + i * 5, x2: 113, y2: -49 + i * 5 }));
    /* spakbor depan */
    g.append(n('path', { class: 'sc-spakbor', d: 'M78 -22 q14 -22 30 -4 l0 4 Z' }));
    /* dua cerobong knalpot tegak */
    [-8, 2].forEach(x =>
      g.append(n('rect', { class: 'sc-cerobong', x: x, y: -104, width: 6, height: 84, rx: 3 })));
    /* klakson angin & spion */
    g.append(n('rect', { class: 'sc-krom', x: 22, y: -96, width: 16, height: 4, rx: 2 }));
    g.append(n('line', { class: 'sc-spion', x1: 60, y1: -80, x2: 60, y2: -56 }));
    g.append(n('rect', { class: 'sc-krom', x: 57, y: -80, width: 6, height: 13, rx: 2 }));
    /* bemper & lampu */
    g.append(n('rect', { class: 'sc-bemper', x: 110, y: -30, width: 8, height: 10, rx: 2 }));
    g.append(n('circle', { class: 'sc-lampuDepan', cx: 108, cy: -58, r: 4 }));
    return g;
  }

  /* --- trailer 1: berpendingin (jeruk) ------------------------------------- */
  function trailerJeruk() {
    const g = G({ class: 'sc-trailer sc-trailer--jeruk' });
    g.append(n('rect', { class: 'sc-badanDingin', x: -216, y: -92, width: 216, height: 78, rx: 3 }));
    /* rusuk dinding berinsulasi */
    for (let x = -208; x < -6; x += 13)
      g.append(n('line', { class: 'sc-rusuk', x1: x, y1: -88, x2: x, y2: -18 }));
    g.append(n('rect', { class: 'sc-pitaDingin', x: -216, y: -36, width: 216, height: 10 }));
    /* unit pendingin di hidung trailer */
    g.append(n('rect', { class: 'sc-reefer', x: -4, y: -98, width: 26, height: 42, rx: 3 }));
    g.append(n('circle', { class: 'sc-reeferKipas', cx: 9, cy: -77, r: 10 }));
    g.append(n('circle', { class: 'sc-reeferPusat', cx: 9, cy: -77, r: 3 }));
    for (let i = 0; i < 4; i++)
      g.append(n('line', { class: 'sc-reeferSirip', x1: -1, y1: -60 + i * 3, x2: 19, y2: -60 + i * 3 }));
    /* lambang jeruk */
    /* Lambang jeruk di ujung buritan, JAUH dari tulisan -- keduanya sempat
       bertumpuk karena tulisannya digeser ke kiri agar muat. */
    g.append(n('circle', { class: 'sc-jerukBuah', cx: -192, cy: -64, r: 17 }));
    g.append(n('path', { class: 'sc-jerukDaun', d: 'M-192 -81 q12 -8 18 -2 q-8 8 -18 2 Z' }));
    /* Badan trailer -216..0, sisi kanannya dipakai unit pendingin, jadi ruang
       tulisan berhenti di -20. */
    const t = n('text', { class: 'sc-tulisTrailer', x: -166, y: -62, 'data-maks': 150 });
    t.textContent = 'FRESH CITRUS'; g.append(t);
    const t2 = n('text', { class: 'sc-tulisKecil', x: -166, y: -47, 'data-maks': 150 });
    t2.textContent = 'KEEP REFRIGERATED 34°F'; g.append(t2);
    return g;
  }

  /* --- trailer 2: van kering (freight forwarding) -------------------------- */
  function trailerFreight() {
    const g = G({ class: 'sc-trailer sc-trailer--freight' });
    g.append(n('rect', { class: 'sc-badanVan', x: -222, y: -88, width: 222, height: 74, rx: 2 }));
    /* dinding bergelombang, ciri van aluminium */
    for (let x = -218; x < -4; x += 8)
      g.append(n('line', { class: 'sc-gelombang', x1: x, y1: -86, x2: x, y2: -16 }));
    g.append(n('rect', { class: 'sc-vanAtas', x: -222, y: -88, width: 222, height: 6 }));
    g.append(n('rect', { class: 'sc-vanBawah', x: -222, y: -20, width: 222, height: 6 }));
    /* pintu gulung di buritan + engsel */
    g.append(n('rect', { class: 'sc-pintu', x: -222, y: -84, width: 26, height: 66 }));
    [-78, -52, -30].forEach(y => g.append(n('rect', { class: 'sc-engsel', x: -224, y: y, width: 6, height: 8, rx: 1 })));
    /* kotak nama perusahaan */
    g.append(n('rect', { class: 'sc-plakat', x: -168, y: -74, width: 122, height: 34, rx: 2 }));
    const t = n('text', { class: 'sc-tulisPlakat', x: -107, y: -57, 'data-maks': 112 });
    t.textContent = 'FREIGHT'; g.append(t);
    const t2 = n('text', { class: 'sc-tulisPlakatKecil', x: -107, y: -46, 'data-maks': 112 });
    t2.textContent = 'FORWARDING CO.'; g.append(t2);
    return g;
  }

  /* --- trailer 3: surat (lebih pendek, bergaris) ---------------------------
     Hanya garis biru-merah dan tulisan "U.S. MAIL" -- tanpa lambang resmi
     apa pun. Lambang dinas negara tidak perlu ditiru untuk menyampaikan
     "ini truk pos". */
  function trailerSurat() {
    const g = G({ class: 'sc-trailer sc-trailer--surat' });
    g.append(n('rect', { class: 'sc-badanPos', x: -178, y: -86, width: 178, height: 72, rx: 3 }));
    g.append(n('rect', { class: 'sc-pitaBiru', x: -178, y: -60, width: 178, height: 15 }));
    g.append(n('rect', { class: 'sc-pitaMerah', x: -178, y: -45, width: 178, height: 5 }));
    g.append(n('rect', { class: 'sc-pintu', x: -178, y: -82, width: 24, height: 64 }));
    [-74, -50, -28].forEach(y => g.append(n('rect', { class: 'sc-engsel', x: -180, y: y, width: 6, height: 8, rx: 1 })));
    /* Badan -178..0, tapi 24 satuan pertama pintu: ruang aman -150..-8,
       titik tengahnya -79. */
    const t = n('text', { class: 'sc-tulisPos', x: -79, y: -66, 'data-maks': 134 });
    t.textContent = 'U.S. MAIL'; g.append(t);
    const t2 = n('text', { class: 'sc-tulisKecil', x: -79, y: -24, 'data-maks': 134 });
    t2.textContent = 'CONTRACT ROUTE'; g.append(t2);
    return g;
  }

  /* Rakit truk lengkap. Titik acuan (0,0) = tanah di bawah roda depan. */
  function trukPemain(ct) {
    const g = G({ class: 'sc-truk' });
    const tr = ct === 1 ? trailerJeruk() : ct === 2 ? trailerFreight() : trailerSurat();
    const geser = ct === 1 ? -22 : ct === 2 ? -24 : -18;
    tr.setAttribute('transform', 'translate(' + geser + ' 0)');
    g.append(tr);
    g.append(traktor());
    /* roda: dua sumbu belakang trailer, dua sumbu traktor, satu depan */
    const gandar = ct === 1 ? [-196, -168, -34, -6, 92] :
                   ct === 2 ? [-202, -174, -34, -6, 92] :
                              [-160, -132, -34, -6, 92];
    const rodaSemua = [];
    gandar.forEach((x, i) => {
      const r = i === 4 ? 17 : 16;
      const w = roda(r);
      w.setAttribute('transform', 'translate(' + x + ' ' + (-r) + ')');
      g.append(w); rodaSemua.push(w.firstChild);
    });
    /* penahan lumpur di belakang */
    g.append(n('rect', { class: 'sc-lumpur', x: gandar[0] - 26, y: -22, width: 8, height: 20, rx: 1 }));
    g._roda = rodaSemua;
    return g;
  }

  /* ======================================================================
     Bagian 3 — kendaraan lain
     Truk lain semuanya CAB-OVER (hidung rata) supaya sekali lihat berbeda
     dari truk pemain yang bermoncong panjang. Itu bukan karangan: pada 1982
     kedua bentuk itu memang sama-sama umum di jalan Amerika.
     ====================================================================== */
  function trukLain(warna) {
    const g = G({ class: 'sc-lain sc-lain--' + warna });
    g.append(n('rect', { class: 'sc-lainTrailer', x: -190, y: -84, width: 190, height: 70, rx: 2 }));
    for (let x = -186; x < -4; x += 9)
      g.append(n('line', { class: 'sc-gelombang', x1: x, y1: -82, x2: x, y2: -16 }));
    /* kabin rata (cab-over): kaca hampir sampai bemper */
    g.append(n('path', { class: 'sc-lainKabin', d: 'M0 -20 L0 -92 L52 -92 L52 -20 Z' }));
    g.append(n('rect', { class: 'sc-kaca', x: 6, y: -88, width: 42, height: 26, rx: 2 }));
    g.append(n('rect', { class: 'sc-bemper', x: 48, y: -30, width: 8, height: 12, rx: 2 }));
    g.append(n('circle', { class: 'sc-lampuDepan', cx: 46, cy: -44, r: 3.5 }));
    const gandar = [-168, -142, -22, 34];
    const rodaSemua = [];
    gandar.forEach(x => {
      const w = roda(15); w.setAttribute('transform', 'translate(' + x + ' -15)');
      g.append(w); rodaSemua.push(w.firstChild);
    });
    g._roda = rodaSemua;
    return g;
  }

  function sedan(warna) {
    const g = G({ class: 'sc-mobil sc-mobil--' + warna });
    g.append(n('path', { class: 'sc-mobilBadan',
      d: 'M-58 -14 L-58 -30 L-40 -30 L-28 -46 L18 -46 L32 -30 L52 -28 L54 -14 Z' }));
    g.append(n('path', { class: 'sc-kaca', d: 'M-36 -32 L-26 -43 L16 -43 L28 -32 Z' }));
    g.append(n('rect', { class: 'sc-mobilLampu', x: 50, y: -26, width: 6, height: 5, rx: 1 }));
    g.append(n('rect', { class: 'sc-mobilLampuBelakang', x: -60, y: -26, width: 5, height: 5, rx: 1 }));
    const rodaSemua = [];
    [-36, 30].forEach(x => {
      const w = roda(12); w.setAttribute('transform', 'translate(' + x + ' -12)');
      g.append(w); rodaSemua.push(w.firstChild);
    });
    g._roda = rodaSemua;
    return g;
  }

  function pikap(warna) {
    const g = G({ class: 'sc-mobil sc-mobil--' + warna });
    g.append(n('path', { class: 'sc-mobilBadan',
      d: 'M-60 -14 L-60 -34 L-6 -34 L-4 -50 L26 -50 L36 -34 L54 -32 L56 -14 Z' }));
    g.append(n('rect', { class: 'sc-bakPikap', x: -58, y: -34, width: 52, height: 3 }));
    g.append(n('path', { class: 'sc-kaca', d: 'M-2 -47 L24 -47 L32 -35 L-2 -35 Z' }));
    g.append(n('rect', { class: 'sc-mobilLampu', x: 52, y: -28, width: 6, height: 5, rx: 1 }));
    const rodaSemua = [];
    [-40, 32].forEach(x => {
      const w = roda(13); w.setAttribute('transform', 'translate(' + x + ' -13)');
      g.append(w); rodaSemua.push(w.firstChild);
    });
    g._roda = rodaSemua;
    return g;
  }

  /* Truk terparkir, TAMPAK BELAKANG -- yang Anda lihat kalau melewati atau
     berhenti di truck stop. Bentuknya sengaja berbeda dari ketiga trailer
     pemain: pintu ganda berengsel, bukan sisi bergelombang. */
  function trukParkir() {
    const g = G({ class: 'sc-parkir' });
    g.append(n('rect', { class: 'sc-parkirBadan', x: -58, y: -92, width: 116, height: 76, rx: 3 }));
    g.append(n('line', { class: 'sc-parkirBelah', x1: 0, y1: -90, x2: 0, y2: -18 }));
    [-84, -58, -32].forEach(y => {
      g.append(n('rect', { class: 'sc-engsel', x: -62, y: y, width: 5, height: 9, rx: 1 }));
      g.append(n('rect', { class: 'sc-engsel', x: 57, y: y, width: 5, height: 9, rx: 1 }));
    });
    /* palang pintu vertikal khas pintu ganda */
    [-40, -20, 20, 40].forEach(x =>
      g.append(n('rect', { class: 'sc-palang', x: x - 2, y: -88, width: 4, height: 68 })));
    g.append(n('rect', { class: 'sc-parkirBemper', x: -60, y: -18, width: 120, height: 7, rx: 2 }));
    [-44, 44].forEach(x => g.append(n('circle', { class: 'sc-lampuBelakang', cx: x, cy: -26, r: 4 })));
    [-52, 52].forEach(x => g.append(n('rect', { class: 'sc-lumpur', x: x - 7, y: -12, width: 14, height: 12 })));
    const t = n('text', { class: 'sc-tulisParkir', x: 0, y: -56, 'data-maks': 104 });
    t.textContent = 'LONG HAUL'; g.append(t);
    /* roda mengintip di bawah */
    [-38, 38].forEach(x => g.append(n('ellipse', { class: 'sc-ban', cx: x, cy: -8, rx: 12, ry: 8 })));
    return g;
  }

  /* Truk tangki pengantar solar. Kecil — dua gandar, tangki silinder pendek
     — supaya sekali lihat berbeda dari trailer pemain maupun dari cab-over
     lalu lintas biasa. Ia muncul hanya pada satu kejadian: baris 2540,
     "It cost $200 to get a barrel of diesel delivered." */
  function trukTangki() {
    const g = G({ class: 'sc-tangkiTruk' });
    g.append(n('rect', { class: 'sc-sasis', x: -104, y: -22, width: 150, height: 9 }));
    /* tangki silinder */
    g.append(n('rect', { class: 'sc-tangkiBadan', x: -100, y: -66, width: 104, height: 44, rx: 21 }));
    g.append(n('ellipse', { class: 'sc-tangkiTutup', cx: -98, cy: -44, rx: 6, ry: 21 }));
    [-72, -48, -24].forEach(x =>
      g.append(n('rect', { class: 'sc-tangkiPita', x: x, y: -66, width: 3, height: 44 })));
    g.append(n('rect', { class: 'sc-tangkiLubang', x: -60, y: -72, width: 18, height: 8, rx: 3 }));
    const t = n('text', { class: 'sc-tulisTangki', x: -48, y: -40, 'data-maks': 76 });
    t.textContent = 'DIESEL'; g.append(t);
    /* kabin pendek */
    g.append(n('path', { class: 'sc-tangkiKabin', d: 'M4 -22 L4 -70 L14 -76 L38 -76 L46 -60 L46 -22 Z' }));
    g.append(n('path', { class: 'sc-kaca', d: 'M12 -70 L34 -70 L40 -58 L12 -58 Z' }));
    g.append(n('rect', { class: 'sc-bemper', x: 44, y: -30, width: 8, height: 10, rx: 2 }));
    g.append(n('circle', { class: 'sc-lampuDepan', cx: 43, cy: -44, r: 3.5 }));
    /* suar kuning di atap */
    g.append(n('rect', { class: 'sc-suar', x: 16, y: -84, width: 14, height: 7, rx: 3 }));
    const rodaSemua = [];
    [-78, -46, 26].forEach(x => {
      const w = roda(14); w.setAttribute('transform', 'translate(' + x + ' -14)');
      g.append(w); rodaSemua.push(w.firstChild);
    });
    g._roda = rodaSemua;
    return g;
  }

  function mobilPolisi(nyala) {
    const g = G({ class: 'sc-polisi' });
    g.append(n('path', { class: 'sc-polisiBadan',
      d: 'M-60 -14 L-60 -32 L-42 -32 L-30 -48 L18 -48 L34 -32 L54 -30 L56 -14 Z' }));
    g.append(n('path', { class: 'sc-kaca', d: 'M-38 -34 L-28 -45 L16 -45 L30 -34 Z' }));
    g.append(n('rect', { class: 'sc-polisiPintu', x: -26, y: -32 + 2, width: 34, height: 16, rx: 2 }));
    const t = n('text', { class: 'sc-tulisPolisi', x: -9, y: -20, 'data-maks': 32 });
    t.textContent = 'STATE'; g.append(t);
    const bar = G({ class: 'sc-sirene' + (nyala ? ' sc-sirene--nyala' : '') });
    bar.append(n('rect', { class: 'sc-sireneMerah', x: -14, y: -56, width: 13, height: 7, rx: 2 }));
    bar.append(n('rect', { class: 'sc-sireneBiru', x: 1, y: -56, width: 13, height: 7, rx: 2 }));
    g.append(bar);
    const rodaSemua = [];
    [-38, 32].forEach(x => {
      const w = roda(12); w.setAttribute('transform', 'translate(' + x + ' -12)');
      g.append(w); rodaSemua.push(w.firstChild);
    });
    g._roda = rodaSemua;
    return g;
  }

  /* ======================================================================
     Bagian 4 — properti pinggir jalan
     Yang bertanda [DATA] menampilkan isi run/TRUCKER.BAS, bukan karangan.
     ====================================================================== */
  const P = {};

  P.kaktus = () => G({ class: 'sc-prop' }, [
    n('path', { class: 'sc-kaktus', d: 'M0 0 L0 -54 M0 -34 q-14 0 -14 -14 l0 -8 M0 -42 q14 0 14 -12 l0 -10' }),
    n('ellipse', { class: 'sc-tanah', cx: 0, cy: 2, rx: 12, ry: 3 })
  ]);

  P.pinus = () => G({ class: 'sc-prop' }, [
    n('rect', { class: 'sc-batang', x: -3, y: -18, width: 6, height: 18 }),
    n('path', { class: 'sc-daunGelap', d: 'M0 -76 L18 -34 L-18 -34 Z' }),
    n('path', { class: 'sc-daunGelap', d: 'M0 -58 L22 -14 L-22 -14 Z' })
  ]);

  P.pohon = () => G({ class: 'sc-prop' }, [
    n('rect', { class: 'sc-batang', x: -4, y: -26, width: 8, height: 26 }),
    n('circle', { class: 'sc-daun', cx: 0, cy: -44, r: 22 }),
    n('circle', { class: 'sc-daun', cx: -16, cy: -34, r: 15 }),
    n('circle', { class: 'sc-daun', cx: 17, cy: -36, r: 14 })
  ]);

  P.semak = () => G({ class: 'sc-prop' }, [
    n('circle', { class: 'sc-semak', cx: 0, cy: -8, r: 11 }),
    n('circle', { class: 'sc-semak', cx: 12, cy: -6, r: 8 })
  ]);

  P.tiang = () => G({ class: 'sc-prop' }, [
    n('rect', { class: 'sc-tiang', x: -3, y: -96, width: 6, height: 96 }),
    n('rect', { class: 'sc-tiang', x: -22, y: -92, width: 44, height: 4 }),
    n('rect', { class: 'sc-tiang', x: -16, y: -78, width: 32, height: 3 })
  ]);

  P.pagar = () => {
    const g = G({ class: 'sc-prop' });
    for (let i = 0; i < 4; i++) g.append(n('rect', { class: 'sc-pagarTiang', x: i * 34, y: -26, width: 4, height: 26 }));
    g.append(n('rect', { class: 'sc-pagarPapan', x: 0, y: -22, width: 116, height: 3 }));
    g.append(n('rect', { class: 'sc-pagarPapan', x: 0, y: -12, width: 116, height: 3 }));
    return g;
  };

  P.silo = () => G({ class: 'sc-prop' }, [
    n('rect', { class: 'sc-silo', x: -20, y: -104, width: 40, height: 104, rx: 4 }),
    n('path', { class: 'sc-siloAtap', d: 'M-22 -104 q22 -22 44 0 Z' }),
    n('rect', { class: 'sc-siloPita', x: -20, y: -70, width: 40, height: 4 }),
    n('rect', { class: 'sc-siloPita', x: -20, y: -40, width: 40, height: 4 })
  ]);

  P.kincir = () => {
    const g = G({ class: 'sc-prop' });
    g.append(n('path', { class: 'sc-menaraKincir', d: 'M-11 0 L-4 -70 L4 -70 L11 0 M-8 -24 L8 -24 M-6 -46 L6 -46' }));
    const kipas = G({ class: 'sc-kincirKipas' });
    for (let i = 0; i < 8; i++)
      kipas.append(n('path', { class: 'sc-kincirBilah', d: 'M0 0 L4 -18 L-4 -18 Z',
        transform: 'rotate(' + (i * 45) + ')' }));
    kipas.setAttribute('transform', 'translate(0 -78)');
    g.append(kipas);
    g.append(n('path', { class: 'sc-menaraKincir', d: 'M0 -78 L14 -70 L0 -66 Z' }));
    return g;
  };

  P.gudang = () => G({ class: 'sc-prop' }, [
    n('path', { class: 'sc-gudang', d: 'M-46 0 L-46 -46 L0 -74 L46 -46 L46 0 Z' }),
    n('rect', { class: 'sc-gudangPintu', x: -14, y: -34, width: 28, height: 34 }),
    n('path', { class: 'sc-gudangGaris', d: 'M-14 -34 L14 0 M14 -34 L-14 0' })
  ]);

  P.mesa = () => G({ class: 'sc-prop' }, [
    n('path', { class: 'sc-mesa', d: 'M-70 0 L-58 -44 L58 -44 L72 0 Z' }),
    n('rect', { class: 'sc-mesaPita', x: -62, y: -30, width: 122, height: 5 })
  ]);

  P.rumput = () => G({ class: 'sc-prop' }, [
    n('path', { class: 'sc-rumput', d: 'M0 0 L-5 -13 M0 0 L0 -16 M0 0 L6 -12 M9 0 L12 -10' })
  ]);

  P.reklame = (teks) => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-tiang', x: -4, y: -60, width: 8, height: 60 }));
    g.append(n('rect', { class: 'sc-reklame', x: -60, y: -108, width: 120, height: 50, rx: 2 }));
    const t = n('text', { class: 'sc-tulisReklame', x: 0, y: -78, 'data-maks': 110 });
    t.textContent = teks; g.append(t);
    return g;
  };

  /* [DATA] Perisai Interstate dengan nomor sungguhan dari nama jalan. */
  P.perisai = (nomor) => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-tiang', x: -3, y: -62, width: 6, height: 62 }));
    g.append(n('path', { class: 'sc-perisaiMerah',
      d: 'M-26 -104 L26 -104 L26 -86 Q26 -70 0 -60 Q-26 -70 -26 -86 Z' }));
    g.append(n('path', { class: 'sc-perisaiBiru',
      d: 'M-23 -96 L23 -96 L23 -86 Q23 -73 0 -64 Q-23 -73 -23 -86 Z' }));
    const t1 = n('text', { class: 'sc-perisaiKata', x: 0, y: -97, 'data-maks': 42 });
    t1.textContent = 'INTERSTATE'; g.append(t1);
    const t2 = n('text', { class: 'sc-perisaiNomor', x: 0, y: -76, 'data-maks': 40 });
    t2.textContent = nomor; g.append(t2);
    return g;
  };

  /* [DATA] Papan nama kota, isinya dari kolom nama di run/TRUCKER.BAS. */
  P.rambuKota = (nama) => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-tiang', x: -3, y: -56, width: 6, height: 56 }));
    g.append(n('rect', { class: 'sc-tiang', x: 47, y: -56, width: 6, height: 56 }));
    const lebar = Math.max(96, nama.length * 9 + 26);
    g.append(n('rect', { class: 'sc-rambuHijau', x: 25 - lebar / 2, y: -100, width: lebar, height: 42, rx: 3 }));
    g.append(n('rect', { class: 'sc-rambuTepi', x: 29 - lebar / 2, y: -96, width: lebar - 8, height: 34, rx: 2 }));
    const t = n('text', { class: 'sc-tulisRambu', x: 25, y: -73, 'data-maks': lebar - 20 });
    t.textContent = nama.toUpperCase(); g.append(t);
    return g;
  };

  P.rambuBatas = (n2) => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-tiang', x: -3, y: -54, width: 6, height: 54 }));
    g.append(n('rect', { class: 'sc-rambuPutih', x: -28, y: -110, width: 56, height: 58, rx: 2 }));
    const a = n('text', { class: 'sc-tulisBatasKecil', x: 0, y: -94, 'data-maks': 48 });
    a.textContent = 'SPEED'; g.append(a);
    const b = n('text', { class: 'sc-tulisBatasKecil', x: 0, y: -84, 'data-maks': 48 });
    b.textContent = 'LIMIT'; g.append(b);
    const c = n('text', { class: 'sc-tulisBatas', x: 0, y: -60, 'data-maks': 48 });
    c.textContent = n2; g.append(c);
    return g;
  };

  P.zonaWaktu = () => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-tiang', x: -3, y: -56, width: 6, height: 56 }));
    g.append(n('rect', { class: 'sc-tiang', x: 57, y: -56, width: 6, height: 56 }));
    g.append(n('rect', { class: 'sc-rambuHijau', x: -46, y: -104, width: 148, height: 48, rx: 3 }));
    const a = n('text', { class: 'sc-tulisRambu', x: 28, y: -86, 'data-maks': 132 });
    a.textContent = 'TIME ZONE'; g.append(a);
    const b = n('text', { class: 'sc-tulisRambuKecil', x: 28, y: -68, 'data-maks': 132 });
    b.textContent = 'SET CLOCK AHEAD 1 HOUR'; g.append(b);
    return g;
  };

  P.tol = () => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-tolTiang', x: -6, y: -120, width: 12, height: 120 }));
    g.append(n('rect', { class: 'sc-tolTiang', x: 154, y: -120, width: 12, height: 120 }));
    g.append(n('rect', { class: 'sc-tolAtap', x: -22, y: -136, width: 204, height: 20, rx: 3 }));
    g.append(n('rect', { class: 'sc-tolGardu', x: 44, y: -86, width: 46, height: 86, rx: 2 }));
    g.append(n('rect', { class: 'sc-tolKaca', x: 50, y: -78, width: 34, height: 30, rx: 2 }));
    const t = n('text', { class: 'sc-tulisTol', x: 80, y: -122, 'data-maks': 180 });
    t.textContent = 'TOLL'; g.append(t);
    g.append(n('rect', { class: 'sc-palangTol', x: 96, y: -46, width: 84, height: 6, rx: 3 }));
    for (let i = 0; i < 5; i++)
      g.append(n('rect', { class: 'sc-palangGaris', x: 100 + i * 17, y: -46, width: 8, height: 6 }));
    return g;
  };

  P.timbang = () => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-bangunan', x: 0, y: -92, width: 130, height: 92, rx: 3 }));
    g.append(n('rect', { class: 'sc-atapDatar', x: -10, y: -100, width: 150, height: 10, rx: 2 }));
    for (let i = 0; i < 3; i++)
      g.append(n('rect', { class: 'sc-jendelaGedung', x: 16 + i * 38, y: -76, width: 26, height: 30, rx: 2 }));
    g.append(n('rect', { class: 'sc-timbangan', x: -108, y: -12, width: 104, height: 12, rx: 2 }));
    g.append(n('rect', { class: 'sc-tiang', x: -140, y: -80, width: 6, height: 80 }));
    g.append(n('rect', { class: 'sc-rambuPutih', x: -186, y: -118, width: 96, height: 40, rx: 2 }));
    const t = n('text', { class: 'sc-tulisTimbang', x: -138, y: -102, 'data-maks': 86 });
    t.textContent = 'WEIGH'; g.append(t);
    const t2 = n('text', { class: 'sc-tulisTimbang', x: -138, y: -86, 'data-maks': 86 });
    t2.textContent = 'STATION'; g.append(t2);
    return g;
  };

  P.konstruksi = () => {
    const g = G({ class: 'sc-prop' });
    for (let i = 0; i < 5; i++) {
      const x = i * 40;
      g.append(n('rect', { class: 'sc-drum', x: x - 9, y: -34, width: 18, height: 34, rx: 3 }));
      g.append(n('rect', { class: 'sc-drumPita', x: x - 9, y: -27, width: 18, height: 6 }));
      g.append(n('rect', { class: 'sc-drumPita', x: x - 9, y: -14, width: 18, height: 6 }));
    }
    g.append(n('rect', { class: 'sc-tiang', x: 194, y: -56, width: 6, height: 56 }));
    g.append(n('path', { class: 'sc-rambuOranye', d: 'M197 -120 L241 -88 L197 -56 L153 -88 Z' }));
    const t = n('text', { class: 'sc-tulisKonstruksi', x: 197, y: -84, 'data-maks': 60 });
    t.textContent = 'ROAD'; g.append(t);
    const t2 = n('text', { class: 'sc-tulisKonstruksi', x: 197, y: -72, 'data-maks': 60 });
    t2.textContent = 'WORK'; g.append(t2);
    return g;
  };

  P.terowongan = () => {
    const g = G({ class: 'sc-prop' });
    g.append(n('path', { class: 'sc-bukitTerowongan', d: 'M-150 0 L-120 -120 L120 -120 L150 0 Z' }));
    g.append(n('path', { class: 'sc-mulutTerowongan', d: 'M-56 0 L-56 -62 Q0 -104 56 -62 L56 0 Z' }));
    g.append(n('path', { class: 'sc-lengkungTerowongan', d: 'M-64 0 L-64 -66 Q0 -112 64 -66 L64 0',
      fill: 'none' }));
    /* batu longsor menutup mulutnya */
    [[-30, -10, 20], [4, -16, 26], [34, -8, 17], [-8, -34, 15], [22, -38, 12]]
      .forEach(([x, y, r]) => g.append(n('circle', { class: 'sc-batu', cx: x, cy: y, r: r })));
    return g;
  };

  P.kuda = () => {
    const g = G({ class: 'sc-prop' });
    const satu = (x, s) => {
      const h = G({ transform: 'translate(' + x + ' 0) scale(' + s + ' 1)' });
      h.append(n('path', { class: 'sc-kuda',
        d: 'M-22 -22 L-22 -30 L-6 -34 L14 -34 L20 -30 L26 -40 L32 -40 L30 -26 L24 -22 L22 0 L16 0 L14 -20 L-8 -20 L-10 0 L-16 0 Z' }));
      h.append(n('path', { class: 'sc-kudaSurai', d: 'M24 -40 L30 -46 L34 -38 Z' }));
      return h;
    };
    g.append(satu(0, 1)); g.append(satu(54, -1));
    return g;
  };

  /* Pohon besar berbatang tebal, khusus jadi sasaran tabrakan. Ia digambar
     lebih kokoh daripada pohon pinggir jalan biasa supaya "menabrak sesuatu"
     terbaca sebagai peristiwa, bukan sebagai menyerempet semak. */
  /* Bagian yang tumbang ada di <g> DALAM, bukan di <g> luar. Sebabnya
     bukan gaya: <g> luar memakai ATRIBUT `transform` untuk posisinya, dan
     properti CSS `transform` akan MENIMPA atribut itu — pohonnya akan
     meloncat ke titik asal begitu kelas tumbang dipasang. Memisahkan
     "di mana ia berdiri" dari "seberapa miring ia" menghindari tabrakan itu
     sepenuhnya, dan miringnya digerakkan JS supaya tidak ada CSS sama sekali
     yang menyentuh transform-nya. */
  P.pohonTabrak = () => G({ class: 'sc-prop sc-pohonTabrak' }, [
    G({ class: 'sc-pohonBatang' }, [
      n('rect', { class: 'sc-batangTebal', x: -9, y: -46, width: 18, height: 46 }),
      n('path', { class: 'sc-akar', d: 'M-9 0 q-10 -4 -16 2 L16 2 q-6 -6 -16 -2 Z' }),
      n('circle', { class: 'sc-daunTabrak', cx: 0, cy: -76, r: 34 }),
      n('circle', { class: 'sc-daunTabrak', cx: -26, cy: -58, r: 23 }),
      n('circle', { class: 'sc-daunTabrak', cx: 27, cy: -60, r: 21 }),
      n('circle', { class: 'sc-daunTabrak', cx: 2, cy: -104, r: 19 })
    ])
  ]);

  P.tumbleweed = () => G({ class: 'sc-tumbleweed' }, [
    n('circle', { class: 'sc-tumbleweedBola', r: 13 }),
    n('path', { class: 'sc-tumbleweedGaris', d: 'M-11 -5 L11 4 M-8 7 L9 -8 M-12 3 L12 -2 M-2 -12 L3 12' })
  ]);

  P.truckStop = () => {
    const g = G({ class: 'sc-prop' });
    g.append(n('rect', { class: 'sc-tiang', x: -6, y: -150, width: 12, height: 150 }));
    g.append(n('rect', { class: 'sc-papanStop', x: -96, y: -198, width: 192, height: 56, rx: 4 }));
    /* Papan 192 satuan; sisakan tepi 11 di kiri dan kanan, jadi tulisannya
       tidak perlu dikecilkan sama sekali dan tetap terbaca dari jauh. */
    const t = n('text', { class: 'sc-tulisStopBesar', x: 0, y: -173, 'data-maks': 170 });
    t.textContent = 'TRUCK STOP'; g.append(t);
    const t2 = n('text', { class: 'sc-tulisStopKecil', x: 0, y: -153, 'data-maks': 170 });
    t2.textContent = 'DIESEL · CAFE · SHOWERS'; g.append(t2);
    /* kanopi pompa */
    g.append(n('rect', { class: 'sc-kanopiTiang', x: 150, y: -96, width: 10, height: 96 }));
    g.append(n('rect', { class: 'sc-kanopiTiang', x: 290, y: -96, width: 10, height: 96 }));
    g.append(n('rect', { class: 'sc-kanopi', x: 130, y: -114, width: 190, height: 20, rx: 3 }));
    [190, 250].forEach(x => {
      g.append(n('rect', { class: 'sc-pompa', x: x, y: -52, width: 20, height: 52, rx: 2 }));
      g.append(n('rect', { class: 'sc-pompaKaca', x: x + 4, y: -46, width: 12, height: 14, rx: 1 }));
    });
    /* dua truk parkir tampak belakang */
    const a = trukParkir(); a.setAttribute('transform', 'translate(390 0) scale(0.86)');
    const b = trukParkir(); b.setAttribute('transform', 'translate(530 0) scale(0.86)');
    g.append(a); g.append(b);
    return g;
  };

  /* --- langit ------------------------------------------------------------- */
  P.pesawat = () => G({ class: 'sc-pesawat' }, [
    n('path', { class: 'sc-pesawatBadan', d: 'M-26 0 L14 0 L26 3 L14 6 L-26 6 L-32 3 Z' }),
    n('path', { class: 'sc-pesawatSayap', d: 'M-8 3 L-22 -12 L-14 -12 L2 3 Z' }),
    n('path', { class: 'sc-pesawatSayap', d: 'M-8 3 L-22 16 L-14 16 L2 3 Z' }),
    n('path', { class: 'sc-pesawatEkor', d: 'M-26 1 L-34 -12 L-28 -12 L-19 1 Z' }),
    n('rect', { class: 'sc-jejakUap', x: -110, y: 2, width: 78, height: 2, rx: 1 })
  ]);

  P.burung = () => {
    const g = G({ class: 'sc-burung' });
    [[0, 0], [-16, 8], [16, 9], [-32, 17], [32, 18]].forEach(([x, y]) =>
      g.append(n('path', { class: 'sc-burungSayap',
        d: 'M' + (x - 7) + ' ' + y + ' q7 -6 7 0 q0 -6 7 0' })));
    return g;
  };

  P.kereta = () => {
    const g = G({ class: 'sc-kereta' });
    g.append(n('rect', { class: 'sc-rel', x: -40, y: 2, width: 900, height: 3 }));
    /* lokomotif */
    g.append(n('path', { class: 'sc-lokomotif', d: 'M0 0 L0 -34 L14 -34 L18 -44 L58 -44 L58 0 Z' }));
    g.append(n('rect', { class: 'sc-kaca', x: 22, y: -40, width: 30, height: 12, rx: 1 }));
    for (let i = 0; i < 9; i++) {
      const x = -74 - i * 76;
      g.append(n('rect', { class: 'sc-gerbong', x: x, y: -38, width: 70, height: 38, rx: 2 }));
      g.append(n('rect', { class: 'sc-gerbongPita', x: x, y: -24, width: 70, height: 4 }));
      g.append(n('rect', { class: 'sc-gerbongRoda', x: x + 8, y: 0, width: 54, height: 4 }));
    }
    return g;
  };

  /* ======================================================================
     Bagian 5 — mesin adegan

     DUA ATURAN YANG MENENTUKAN SELURUH BAGIAN INI.

     1. ADEGANNYA TIDAK PERNAH DIBONGKAR DI TENGAH PERJALANAN. Versi pertama
        membangun ulang seluruh pemandangan tiap jam, dan akibatnya apa pun
        yang sedang berlangsung -- mobil yang sedang menyalip, papan nama yang
        sedang lewat -- lenyap begitu saja tiap kali jam berganti. Itu bukan
        soal keindahan: keadaan yang terlihat tidak boleh hilang tanpa sebab.
        Sekarang yang diperbarui tiap jam hanya langit, cuaca, dan wilayah
        untuk benda YANG AKAN DATANG; yang sudah ada di layar tetap di sana.

     2. TIAP BENDA PUNYA KECEPATAN MUTLAK, bukan kecepatan relatif. Geseran di
        layar dihitung `(v_benda - v_kita) * parallax`. Itu satu rumus untuk
        segalanya:

          pohon           v = 0            -> bergeser kiri secepat kita
          mobil menyalip  v = 1,55 * kita  -> bergeser KANAN
          mobil tersalip  v = 0,52 * kita  -> bergeser kiri, pelan
          lawan arah      v = -1,05 * kita -> bergeser kiri, cepat sekali

        Dan yang penting: ketika kita MELAMBAT sampai berhenti, `v_kita` turun
        ke nol sementara `v_benda` tidak berubah. Pohon berhenti; mobil yang
        sedang menyalip terus berjalan dan keluar layar dengan wajar. Tidak ada
        yang perlu dihapus, dan tidak ada yang menghilang di tengah gerakan.
     ====================================================================== */
  let svg, akar, lap = {}, truk = null, rodaTruk = [];
  let benda = [];
  let ct = 1, cr = 1, hr = 0, bagian = 0, jalanPanjang = 2850, mfSekarang = 0;
  let jalanOfset = 0, sudutRoda = 0, gelung = null, r = Math.random;
  let sedangJalan = false, dibangun = false;

  /* Kecepatan kita, dalam piksel per detik, dan sasarannya. Perpindahan di
     antara keduanya eksponensial dengan tetapan waktu TAU -- itulah "melambat
     sampai berhenti" dan "menambah kecepatan lagi". */
  let vKita = 0, vTarget = 0, diam = 0;
  let TAU = 0.34;
  const TAU_JALAN = 0.34, TAU_CELAKA = 0.16;

  /* Posisi truk kita sendiri. Biasanya tetap di (330, kitaY) -- yang bergerak
     dunianya, bukan truknya. Hanya urutan tabrakan yang mengubahnya. */
  let trukX = 330, trukY = 0, trukSudut = 0;
  /* Truk hampir selalu diam di (330, garis lajur). Dua hal boleh
     memindahkannya, dan keduanya memakai SASARAN yang di-ease, bukan lompatan:
     menepi saat ditilang, dan keluar jalur saat celaka. */
  let trukTargetX = 330, trukTargetY = 0;
  const pasangTruknya = () => {
    if (truk) truk.setAttribute('transform',
      'translate(' + trukX.toFixed(1) + ' ' + trukY.toFixed(1) + ')' +
      (trukSudut ? ' rotate(' + trukSudut.toFixed(1) + ')' : ''));
  };

  /* Sela di tengah jam: truk berhenti untuk sesuatu, jam berhenti ikut, lalu
     jalan lagi. Sekarang cuma dipakai tilang. */
  let sela = null;
  /* Urutan tabrakan. */
  let celakaT = -1, sudahTabrak = false, kecepatanJam = 0;
  const PX_PER_MPH = 9;                   // selera; lihat dokumen §11b

  const acakBenih = (b) => { const g = global.RETRO.rng(b); return () => g.next(); };
  const derajat = (px) => (px / 16) * (180 / Math.PI) * 0.5;

  function pasang(el, benih) {
    svg = el; r = acakBenih(benih || 1982);
    svg.textContent = '';
    const defs = n('defs');
    svg.append(defs);
    const gl = n('linearGradient', { id: 'sc-langit', x1: 0, y1: 0, x2: 0, y2: 1 });
    gl.append(n('stop', { offset: '0%' })); gl.append(n('stop', { offset: '55%' }));
    gl.append(n('stop', { offset: '100%' }));
    defs.append(gl);
    const ga = n('linearGradient', { id: 'sc-aspal', x1: 0, y1: 0, x2: 0, y2: 1 });
    [['0%', '#4a4a53'], ['40%', '#33333b'], ['100%', '#1a1a20']]
      .forEach(([o, c]) => ga.append(n('stop', { offset: o, 'stop-color': c })));
    defs.append(ga);
    const clip = n('clipPath', { id: 'sc-batas' });
    clip.append(n('rect', { x: 0, y: 0, width: 800, height: L.dekatBawah }));
    defs.append(clip);

    /* URUTAN LAPISAN = URUTAN KEDALAMAN, dari yang terjauh ke yang terdekat.
       Membacanya dari atas ke bawah persis seperti berjalan dari cakrawala
       menuju kamera:

         langit → matahari → gunung → bukit → pesawat/burung
         → tanah & aspal jalur seberang
         → KENDARAAN BERLAWANAN ARAH        (berdiri di aspal itu)
         → pagar pembatas median
         → pohon, rambu, kincir, truck stop  (di median yang lebar)
         → aspal jalur kita
         → marka jalan                       (cat di atas aspal, di bawah roda)
         → KENDARAAN SEARAH / LAJUR SALIP    (lebih dekat daripada rambu)
         → truk kita
         → rumput terdepan → cuaca

       Versi sebelumnya menaruh `salip` sebelum `pinggir`, jadi truk yang
       menyalip lewat DI BELAKANG kincir angin dan papan nama — padahal ia
       jelas lebih dekat. Dan `seberang` sebelum `aspal` membuat kendaraan
       berlawanan arah tertimbun aspalnya sendiri. */
    akar = G({ 'clip-path': 'url(#sc-batas)' });
    svg.append(akar);
    ['langit', 'surya', 'gunung', 'bukit', 'benda_langit',
     'jauh', 'seberang', 'pembatas', 'pinggir',
     'aspal', 'marka', 'salip', 'tabrak', 'truk', 'depan', 'cuaca']
      .forEach(k => { lap[k] = G({ class: 'sc-lap sc-lap--' + k }); akar.append(lap[k]); });

    lap.langit.append(n('rect', { class: 'sc-langit', x: 0, y: 0, width: 800, height: L.cakrawala + 2 }));
    lap.jauh.append(n('rect', { class: 'sc-tanahJauh', x: 0, y: L.cakrawala, width: 800, height: L.dekatAtas - L.cakrawala }));
    lap.jauh.append(n('rect', { class: 'sc-aspalJauh', x: 0, y: L.jauhAtas, width: 800, height: L.seberangY - L.jauhAtas + 1 }));
    lap.jauh.append(n('rect', { class: 'sc-bahuJauh', x: 0, y: L.jauhAtas, width: 800, height: 2 }));
    lap.aspal.append(n('rect', { class: 'sc-aspal', x: 0, y: L.dekatAtas, width: 800, height: L.dekatBawah - L.dekatAtas }));
    lap.aspal.append(n('rect', { class: 'sc-bahuAtas', x: 0, y: L.dekatAtas, width: 800, height: 5 }));
    lap.aspal.append(n('rect', { class: 'sc-bahuBawah', x: 0, y: L.dekatBawah - 6, width: 800, height: 6 }));
    return api;
  }

  /* --- pembuat benda -------------------------------------------------------
     Satu tempat yang memutuskan benda masuk grup mana, supaya tidak ada
     rantai ternary yang diam-diam salah. */
  const GRUP = {
    gunung: 'gunung', bukit: 'bukit', seberang: 'seberang', pagar: 'pembatas',
    salip: 'salip', tabrak: 'tabrak', jalan: 'marka', pinggir: 'pinggir',
    depan: 'depan', langit: 'benda_langit'
  };
  function taruh(el, x, y, lapis, lebar, skala, skalaX) {
    const o = { el: el, x: x, y: y, lapis: lapis, lebar: lebar || 120,
                skala: skala, skalaX: skalaX, v: 0 };
    pasangTransform(o);
    lap[GRUP[lapis] || 'pinggir'].append(el);
    rapikanTeks(el);
    benda.push(o);
    return o;
  }
  function pasangTransform(o) {
    let t = 'translate(' + o.x.toFixed(1) + ' ' + o.y + ')';
    if (o.skala !== undefined && o.skala !== null)
      t += ' scale(' + (o.skalaX !== undefined && o.skalaX !== null ? o.skalaX : o.skala) +
           ' ' + o.skala + ')';
    o.el.setAttribute('transform', t);
  }
  const paling = (lapis) => benda.reduce((m, o) => o.lapis === lapis ? Math.max(m, o.x) : m, -9999);

  /* `mesa` sengaja TIDAK ada di sini: ia bentang alam jauh, dan menaruhnya
     di lapisan pinggir jalan membuatnya melesat lewat seperti papan reklame. */
  const HUTAN = {
    0: ['kaktus', 'kaktus', 'kaktus', 'semak', 'rumput'],
    1: ['semak', 'semak', 'kincir', 'tiang', 'rumput'],
    2: ['tiang', 'silo', 'pagar', 'kuda', 'rumput', 'gudang'],
    3: ['pohon', 'pohon', 'gudang', 'pagar', 'pinus', 'tiang'],
    4: ['pinus', 'pohon', 'tiang', 'reklame', 'pinus']
  };
  const REKLAME = ['EAT 24 HRS', 'LAST GAS 90 MI', 'SEE ROCK CITY',
                   'MOTEL VACANCY', 'DIESEL 1.09', 'RADIO 1470 AM'];

  function isiPinggir(dariX) {
    const daftar = HUTAN[bagian] || HUTAN[2];
    let x = dariX;
    while (x < 1150) {
      const jenis = daftar[Math.floor(r() * daftar.length)];
      const el = jenis === 'reklame' ? P.reklame(REKLAME[Math.floor(r() * REKLAME.length)]) : P[jenis]();
      taruh(el, x, L.dekatAtas, 'pinggir', 150, +(0.8 + r() * 0.45).toFixed(2));
      x += 90 + r() * 190;
    }
  }

  /* Gunung & bukit dipetak-petak selebar 900 dengan tinggi tepi yang SAMA di
     kedua ujungnya, jadi petak berikutnya menyambung tanpa sambungan terlihat
     -- dan wilayahnya boleh berganti di tengah jalan tanpa ada yang meloncat. */
  const TINGGI_GUNUNG = [96, 78, 44, 56, 86];
  function petakGunung(x0) {
    const t = TINGGI_GUNUNG[bagian];
    let d = 'M0 ' + L.cakrawala + ' L0 ' + (L.cakrawala - t * 0.35).toFixed(0);
    for (let x = 46; x <= 854; x += 46)
      d += ' L' + x + ' ' + (L.cakrawala - t * (0.35 + r() * 0.65)).toFixed(0);
    d += ' L900 ' + (L.cakrawala - t * 0.35).toFixed(0) + ' L900 ' + L.cakrawala + ' Z';
    taruh(G({}, [n('path', { class: 'sc-gunung', d: d })]), x0, 0, 'gunung', 900);

    let d2 = 'M0 ' + L.cakrawala + ' L0 ' + (L.cakrawala - t * 0.2).toFixed(0);
    for (let x = 34; x <= 866; x += 34)
      d2 += ' L' + x + ' ' + (L.cakrawala - t * 0.5 * (0.3 + r() * 0.7)).toFixed(0);
    d2 += ' L900 ' + (L.cakrawala - t * 0.2).toFixed(0) + ' L900 ' + L.cakrawala + ' Z';
    taruh(G({}, [n('path', { class: 'sc-bukit', d: d2 })]), x0, 0, 'bukit', 900);

    if (bagian <= 1)
      for (let x = 80; x < 860; x += 240 + r() * 220)
        taruh(P.mesa(), x0 + x, L.cakrawala + 2, 'bukit', 200, +(0.7 + r() * 0.8).toFixed(2));
  }

  function isiMarka(dariX) {
    for (let x = dariX; x < 1000; x += 96) {
      taruh(G({}, [n('rect', { class: 'sc-marka', width: 52, height: 6, rx: 3 })]),
            x, L.kitaY + 14, 'jalan', 60);
      taruh(G({}, [n('rect', { class: 'sc-markaJauh', width: 34, height: 4, rx: 2 })]),
            x + 40, L.salipY + 10, 'jalan', 40);
    }
  }
  function petakPagar(x) {
    taruh(G({}, [n('rect', { class: 'sc-pagarBesi', y: -14, width: 4, height: 14 }),
                 n('rect', { class: 'sc-pagarBesiPita', x: -4, y: -14, width: 62, height: 5, rx: 2 })]),
          x, L.pagarY + 8, 'pagar', 60);
  }

  function bersih() {
    benda.forEach(o => o.el.remove());
    benda = [];
    const tetap = { langit: 1, aspal: 1, jauh: 1 };
    Object.keys(lap).forEach(k => { if (!tetap[k]) lap[k].textContent = ''; });
    truk = null; rodaTruk = [];
  }

  /* --- langit -------------------------------------------------------------- */
  const JAM_WARNA = [
    { j: 0, a: '#04081a', b: '#0b1430', c: '#131c3a' },
    { j: 5, a: '#152046', b: '#4a3f66', c: '#8a5f66' },
    { j: 7, a: '#3f6fae', b: '#e8a86e', c: '#f6cf9a' },
    { j: 9, a: '#4f96da', b: '#9fd0ef', c: '#cfe6f7' },
    { j: 16, a: '#4f96da', b: '#9fd0ef', c: '#cfe6f7' },
    { j: 18, a: '#3a63a4', b: '#e88f5a', c: '#f3c090' },
    { j: 20, a: '#152046', b: '#4a3f66', c: '#6b3f52' },
    { j: 23, a: '#04081a', b: '#0b1430', c: '#131c3a' }
  ];
  const campur = (x, y, t) => {
    const p = (s2) => [parseInt(s2.slice(1, 3), 16), parseInt(s2.slice(3, 5), 16), parseInt(s2.slice(5, 7), 16)];
    const A = p(x), B = p(y);
    return 'rgb(' + A.map((v, i2) => Math.round(v + (B[i2] - v) * t)).join(',') + ')';
  };
  function langitJam(j) {
    let a = JAM_WARNA[0], b = JAM_WARNA[JAM_WARNA.length - 1];
    for (let i2 = 0; i2 < JAM_WARNA.length - 1; i2++)
      if (j >= JAM_WARNA[i2].j && j <= JAM_WARNA[i2 + 1].j) { a = JAM_WARNA[i2]; b = JAM_WARNA[i2 + 1]; break; }
    const t = (j - a.j) / Math.max(1, b.j - a.j);
    const g = document.getElementById('sc-langit');
    g.children[0].setAttribute('stop-color', campur(a.a, b.a, t));
    g.children[1].setAttribute('stop-color', campur(a.b, b.b, t));
    g.children[2].setAttribute('stop-color', campur(a.c, b.c, t));
    lap.langit.firstChild.setAttribute('fill', 'url(#sc-langit)');
  }

  /* Matahari/bulan dan bintang tinggal di lapisannya SENDIRI, terpisah dari
     pesawat dan burung -- supaya menyegarkan langit tiap jam tidak ikut
     menghapus benda yang sedang melintas. */
  function isiSurya(j) {
    lap.surya.textContent = '';
    const malam = (j >= 19 || j < 6);
    const busur = malam ? ((j + 5) % 24) / 11 : (j - 6) / 13;
    const x = 60 + busur * 680, y = L.cakrawala - 40 - Math.sin(Math.PI * busur) * 150;
    const bola = malam
      ? G({ class: 'sc-bulan' }, [n('circle', { r: 17 }),
          n('circle', { class: 'sc-bulanKawah', cx: -5, cy: -4, r: 4 }),
          n('circle', { class: 'sc-bulanKawah', cx: 6, cy: 4, r: 3 })])
      : G({ class: 'sc-matahari' }, [n('circle', { r: 22 })]);
    bola.setAttribute('transform', 'translate(' + x.toFixed(0) + ' ' + y.toFixed(0) + ')');
    lap.surya.append(bola);
    if (malam) {
      const rb = acakBenih(4242);
      for (let i2 = 0; i2 < 70; i2++)
        lap.surya.append(n('circle', { class: 'sc-bintang',
          cx: (rb() * 800).toFixed(0), cy: (rb() * (L.cakrawala - 40)).toFixed(0),
          r: (0.4 + rb() * 0.9).toFixed(2) }));
    }
  }

  function isiCuaca() {
    lap.cuaca.textContent = '';
    if (cr === 1) return;
    if (cr === 10) {
      lap.cuaca.append(n('rect', { class: 'sc-kabut', x: 0, y: 120, width: 800, height: L.dekatBawah - 120 }));
      return;
    }
    if (cr === 3) {
      lap.cuaca.append(n('rect', { class: 'sc-basah', x: 0, y: L.dekatAtas, width: 800, height: L.dekatBawah - L.dekatAtas }));
      return;
    }
    const salju = cr === 50;
    const jml = salju ? 260 : 150;
    const rc = acakBenih(77);
    for (let i2 = 0; i2 < jml; i2++) {
      const x = rc() * 820, y = rc() * L.dekatBawah;
      const e = salju
        ? n('circle', { class: 'sc-salju', cx: x.toFixed(0), cy: y.toFixed(0), r: (1.2 + rc() * 1.4).toFixed(1) })
        : n('line', { class: 'sc-hujan', x1: x.toFixed(0), y1: y.toFixed(0), x2: (x - 7).toFixed(0), y2: (y + 18).toFixed(0) });
      e.style.setProperty('--d', (rc() * 0.9).toFixed(2) + 's');
      lap.cuaca.append(e);
    }
    if (salju) lap.cuaca.append(n('rect', { class: 'sc-badai', x: 0, y: 0, width: 800, height: L.dekatBawah }));
  }

  function pasangTruk() {
    if (truk) { truk.remove(); }
    truk = trukPemain(ct);
    rodaTruk = truk._roda.slice();
    lap.truk.append(truk);
    pasangTruknya();
    rapikanTeks(truk);
    lampuTruk((hr + 8) % 24);
  }

  function lampuTruk(j) {
    if (!truk) return;
    const gelap = (j >= 18 || j < 7) || cr >= 10;
    truk.classList.toggle('sc-truk--lampu', gelap);
    let sorot = truk.querySelector('.sc-sorot');
    if (gelap && !sorot) {
      sorot = n('path', { class: 'sc-sorot', d: 'M116 -58 L520 -104 L520 -6 Z' });
      truk.insertBefore(sorot, truk.firstChild);
    } else if (!gelap && sorot) sorot.remove();
  }

  const hitungBagian = () => Math.max(0, Math.min(4,
    Math.floor(5 * mfSekarang / Math.max(1, jalanPanjang))));

  /* Bangun dari nol. Dipanggil sekali per PERJALANAN, bukan per jam. */
  function bangun(o) {
    ct = o.ct || ct; cr = o.cr === undefined ? cr : o.cr;
    hr = o.hr === undefined ? hr : o.hr;
    mfSekarang = o.mf === undefined ? mfSekarang : o.mf;
    jalanPanjang = o.panjang || jalanPanjang;
    bagian = hitungBagian();
    berhenti();
    bersih();
    trukX = 330; trukY = L.kitaY; trukSudut = 0;
    trukTargetX = 330; trukTargetY = L.kitaY;
    celakaT = -1; sudahTabrak = false; sela = null; TAU = TAU_JALAN;
    langitJam((hr + 8) % 24);
    isiSurya((hr + 8) % 24);
    petakGunung(0); petakGunung(900); petakGunung(1800);
    for (let x = -80; x < 1000; x += 58) petakPagar(x);
    isiMarka(-120);
    isiPinggir(-200);
    pasangTruk();
    isiCuaca();
    for (let x = -60; x < 900; x += 70)
      taruh(P.rumput(), x, L.dekatBawah, 'depan', 40, +(0.8 + r() * 0.7).toFixed(2));
    dibangun = true;
  }

  /* Perbarui yang berubah tiap jam. TIDAK menghapus apa pun yang sedang
     bergerak; wilayah baru hanya berlaku untuk benda yang akan datang. */
  function perbarui(o) {
    if (!dibangun) return bangun(o);
    const ctLama = ct;
    ct = o.ct || ct; cr = o.cr === undefined ? cr : o.cr;
    hr = o.hr === undefined ? hr : o.hr;
    mfSekarang = o.mf === undefined ? mfSekarang : o.mf;
    jalanPanjang = o.panjang || jalanPanjang;
    bagian = hitungBagian();
    const j = (hr + 8) % 24;
    langitJam(j); isiSurya(j); isiCuaca();
    if (ct !== ctLama) pasangTruk(); else lampuTruk(j);
  }

  /* ======================================================================
     Bagian 6 — gelung tunggal
     Satu gelung untuk seluruh halaman. Ia hidup selama masih ada yang
     bergerak -- termasuk sesudah kita berhenti, supaya kendaraan yang
     terlanjur di tengah manuver bisa menyelesaikannya — lalu mati sendiri.
     ====================================================================== */
  let sisaKejadian = [], sisaLalu = [], tJalan = 0, lamaJalan = 0, onKejadian = null, onSelesai = null;
  let akanCelaka = false;

  function pastikanGelung() {
    if (gelung) return;
    gelung = global.RETRO.loop({ hz: 60, update: langkah });
    gelung.start();
  }

  function langkah(dt) {
    /* laju kita menuju sasaran secara eksponensial */
    const k = 1 - Math.exp(-dt / TAU);
    vKita += (vTarget - vKita) * k;
    if (Math.abs(vTarget - vKita) < 0.6) vKita = vTarget;
    const maju = vKita * dt;
    jalanOfset += maju;
    sudutRoda += derajat(maju);

    for (let i2 = benda.length - 1; i2 >= 0; i2--) {
      const o = benda[i2];
      const p = LAJU[o.lapis] === undefined ? 1 : LAJU[o.lapis];
      /* `ikut` berarti "kecepatannya sama dengan kita" -- benda itu menempel
         di posisi layarnya apa pun yang kita lakukan. Itulah mobil polisi
         yang sudah merapat di belakang. */
      const vObj = o.ikut ? vKita : (o.v || 0);
      o.x += (vObj - vKita) * p * dt;
      pasangTransform(o);
      if (o.roda) {
        o.sudut = (o.sudut || 0) + derajat(vObj * dt);
        const rot = 'rotate(' + (o.sudut % 360).toFixed(1) + ')';
        for (let w = 0; w < o.roda.length; w++) o.roda[w].setAttribute('transform', rot);
      }
      if (o.x < -o.lebar - 500 || o.x > 1500) { o.el.remove(); benda.splice(i2, 1); }
    }

    const rot = 'rotate(' + (sudutRoda % 360).toFixed(1) + ')';
    for (let i2 = 0; i2 < rodaTruk.length; i2++) rodaTruk[i2].setAttribute('transform', rot);

    /* Truk menuju sasarannya, kecuali saat urutan celaka yang mengemudikannya
       sendiri bingkai demi bingkai. */
    if (celakaT < 0) {
      const kt = 1 - Math.exp(-dt / 0.45);
      trukX += (trukTargetX - trukX) * kt;
      trukY += (trukTargetY - trukY) * kt;
      if (Math.abs(trukTargetX - trukX) < 0.4) trukX = trukTargetX;
      if (Math.abs(trukTargetY - trukY) < 0.4) trukY = trukTargetY;
      pasangTruknya();
    }

    /* isi ulang hanya kalau memang sedang maju */
    if (vKita > 4) {
      const kp = paling('pinggir'); if (kp < 950) isiPinggir(kp + 90 + r() * 160);
      const km = paling('jalan'); if (km < 950) isiMarka(km + 96);
      const kg = paling('pagar'); if (kg < 950) petakPagar(kg + 58);
      const kn = paling('gunung'); if (kn < 900) petakGunung(kn + 900);
    }

    if (celakaT >= 0) { majuCelaka(dt); }
    else if (sela) { majuSela(dt); }
    else if (sedangJalan) {
      tJalan += dt;
      const bagianWaktu = tJalan / lamaJalan;
      while (sisaLalu.length && sisaLalu[0].pada <= bagianWaktu) munculkan(sisaLalu.shift());
      while (sisaKejadian.length && sisaKejadian[0].pada <= bagianWaktu) {
        const kj = sisaKejadian.shift();
        if (onKejadian) onKejadian(kj);
        if (kj.jenis === 'tilang') { mulaiSelaTilang(kj); break; }
        if (kj.jenis === 'bbm') { mulaiSelaBbm(kj); break; }
      }
      if (tJalan >= lamaJalan) {
        sedangJalan = false;
        while (sisaKejadian.length) { const kj = sisaKejadian.shift(); if (onKejadian) onKejadian(kj); }
        sisaLalu = [];
        if (akanCelaka) { mulaiCelaka(); }
        else {
          vTarget = 0;                     /* melambat, bukan berhenti mendadak */
          const selesai = onSelesai; onSelesai = null;
          if (selesai) selesai();
        }
      }
    } else if (vKita === 0 && vTarget === 0) {
      /* Semua diam? Baru gelungnya boleh mati. Kendaraan yang masih punya
         kecepatan sendiri DITUNGGU sampai keluar layar -- itulah seluruh
         maksudnya: yang sedang menyalip menyelesaikan salipannya. */
      diam += dt;
      let adaGerak = false;
      for (let i2 = 0; i2 < benda.length; i2++) if (benda[i2].v) { adaGerak = true; break; }
      /* Pagar pengaman: kalau pemain meninggalkan halaman terbuka, jangan
         biarkan gelung berputar selamanya menunggu satu mobil. */
      if (adaGerak && diam > 12) {
        for (let i2 = benda.length - 1; i2 >= 0; i2--)
          if (benda[i2].v) { benda[i2].el.remove(); benda.splice(i2, 1); }
        adaGerak = false;
      }
      if (!adaGerak) { gelung.stop(); gelung = null; diam = 0; }
    }
    if (vKita !== 0) diam = 0;
  }

  function jalan(opts) {
    const sp = Math.max(1, opts.sp || 55);
    const detik = opts.detik || 2.6;
    const antrean = (opts.kejadian || []).slice().sort((a, b) => a.pada - b.pada);
    const kurang = global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (kurang || opts.langsung) {
      antrean.forEach(k => opts.onKejadian && opts.onKejadian(k));
      if (opts.onSelesai) opts.onSelesai();
      return;
    }

    vTarget = sp * PX_PER_MPH;
    kecepatanJam = vTarget;
    const px = vTarget;
    tJalan = 0; lamaJalan = detik; sedangJalan = true;
    akanCelaka = !!opts.celaka;
    onKejadian = opts.onKejadian || null;
    onSelesai = opts.onSelesai || null;

    /* Prop kejadian dijadwalkan supaya TIBA di truk pada saat yang tepat. */
    antrean.forEach(k => {
      if (k.jenis === 'tilang' || k.jenis === 'bbm') return;   /* ditangani saat ia berbunyi */
      const el = propKejadian(k);
      if (!el) return;
      const x = 330 + px * (k.pada * detik);
      const o = taruh(el, x, k.langit ? 90 : L.dekatAtas,
                      k.langit ? 'langit' : 'pinggir', 320, 1);
      if (el._roda) { o.roda = el._roda; }
      k._prop = o;
    });
    sisaKejadian = antrean;
    sisaLalu = jadwalLaluLintas(sp, detik);
    pastikanGelung();
  }

  /* ======================================================================
     Sela tilang — empat babak

       kejar     mobil polisi muncul di belakang dengan kecepatan lebih tinggi
       merapat   begitu sampai di belakang truk, ia "ikut" (v = v kita) dan
                 KEDUANYA melambat sampai berhenti
       diam      tertahan beberapa detik; baris denda ditulis di sini
       lanjut    kita menambah kecepatan lagi, polisi ditinggal (v = 0) dan
                 tergeser mundur keluar layar

     Jam simulasi BERHENTI selama sela ini, jadi kejadian yang dijadwalkan
     sesudahnya tetap jatuh di pecahan waktu yang benar.
     ====================================================================== */
  /* Ujung buritan tiap trailer dalam koordinat lokal truk (termasuk penahan
     lumpurnya). Angka ini diambil dari geometri di Bagian 2, bukan dikira. */
  const BURITAN = { 1: -244, 2: -252, 3: -204 };
  const MONCONG_POLISI = 56;      // bemper depan mobil polisi, koordinat lokal
  const JARAK_POLISI = 38;        // celah yang terlihat, dalam satuan gambar
  const MENEPI_X = 470;           // truk maju sedikit saat menepi
  const xPolisi = () =>
    trukX + (BURITAN[ct] || -244) - MONCONG_POLISI - JARAK_POLISI;

  /* Pengantar solar memakai mesin sela yang SAMA dengan tilang; yang berbeda
     hanya kendaraannya dan babak terakhirnya. Pada tilang, kita yang pergi
     dan mobil polisi ditinggal. Pada pengantaran, truk tangki yang pergi
     lebih dulu — barulah kita jalan lagi. */
  const V_TANGKI = 430;
  /* Urutannya berbeda dari tilang, dan itu keharusan bukan selera: yang
     kehabisan bahan bakar berhenti LEBIH DULU, baru pengantarnya datang.
     Versi pertama memunculkan truk tangki selagi kita masih 55 MPH — dengan
     kecepatan mutlak 430 lawan 495 ia justru tertinggal makin jauh, karena
     memang lebih lambat. Menunggu kita berhenti membuat selisihnya berbalik
     tanda, dan ia menyusul dengan sendirinya. */
  function mulaiSelaBbm(k) {
    trukTargetX = MENEPI_X; trukTargetY = L.kitaY + 6;
    vTarget = 0;
    sela = { fase: 'henti', t: 0, polisi: null, k: k, sudahTulis: false, jenis: 'bbm' };
  }

  function mulaiSelaTilang(k) {
    const el = mobilPolisi(true);
    const o = taruh(el, -320, L.kitaY, 'salip', 340, 1);
    o.v = Math.max(200, vKita) * 1.9;
    o.roda = el._roda; o.sudut = 0;
    /* Menepi: truk maju ke bahu jalan supaya ADA RUANG di belakangnya.
       Tanpa ini mobil polisi terpaksa menempel di buritan trailer -- terlihat
       seperti menabrak, bukan menghentikan. */
    trukTargetX = MENEPI_X; trukTargetY = L.kitaY + 6;
    sela = { fase: 'kejar', t: 0, polisi: o, k: k, sudahTulis: false, jenis: 'tilang' };
  }

  function majuSela(dt) {
    const S = sela;
    if (S.fase === 'henti') {
      /* Menepi dan berhenti dulu. Truk tangki baru dipanggil sesudah itu. */
      if (vKita === 0 && Math.abs(trukTargetX - trukX) < 1) {
        const el = trukTangki();
        const t = taruh(el, -340, L.kitaY, 'salip', 340, 1);
        t.v = V_TANGKI; t.roda = el._roda; t.sudut = 0;
        S.polisi = t; S.fase = 'kejar';
      }
      return;
    }
    const o = S.polisi;
    if (!o) return;
    if (S.fase === 'kejar') {
      if (o.x >= xPolisi()) { o.ikut = true; S.fase = 'merapat'; vTarget = 0; }
      else if (o.x > 760) { o.ikut = true; S.fase = 'merapat'; vTarget = 0; }
      return;
    }
    if (S.fase === 'merapat') {
      /* Menahan jarak: mobil polisi mengikuti buritan truk yang masih maju
         menepi, jadi celahnya tetap sama besar apa pun trailernya. */
      o.x = xPolisi();
      if (vKita === 0 && trukX === trukTargetX) { S.fase = 'diam'; S.t = 0; }
      return;
    }
    if (S.fase === 'diam') {
      if (!S.sudahTulis) {
        S.sudahTulis = true;
        const baris = (S.k && S.k.tertahan) || [];
        for (let i2 = 0; i2 < baris.length; i2++)
          if (onKejadian) onKejadian(baris[i2]);
      }
      o.x = xPolisi();
      S.t += dt;
      if (S.t >= (S.jenis === 'bbm' ? 2.2 : 1.9)) {
        o.ikut = false;
        if (S.jenis === 'bbm') {
          /* Truk tangki menyelesaikan tugasnya lalu melaju pergi mendahului
             kita, sementara kita masih diam. */
          S.fase = 'pergi'; o.v = V_TANGKI;
        } else {
          S.fase = 'lanjut'; o.v = 0; vTarget = kecepatanJam;
          trukTargetX = 330; trukTargetY = L.kitaY;
        }
      }
      return;
    }
    if (S.fase === 'pergi') {
      if (o.x > 980) {
        S.fase = 'lanjut'; vTarget = kecepatanJam;
        trukTargetX = 330; trukTargetY = L.kitaY;
      }
      return;
    }
    /* lanjut: tunggu sampai kita benar-benar jalan lagi, baru jam disambung */
    if (vKita > kecepatanJam * 0.6) sela = null;
  }

  /* ======================================================================
     Tabrakan — truk keluar jalur ke bahu dekat lalu menghantam pohon.
     Ini satu-satunya tempat di seluruh berkas yang menggerakkan TRUK-nya
     sendiri; selebihnya truk selalu diam dan dunianya yang bergerak.
     ====================================================================== */
  const T_VEER = 0.52, T_TOTAL = 1.5;
  function mulaiCelaka() {
    celakaT = 0; sudahTabrak = false;
    trukTargetX = trukX; trukTargetY = trukY;
    TAU = TAU_CELAKA; vTarget = 0;
    sela = null; sisaLalu = [];
    /* Ditaruh 760: selama melambat, dunia masih bergeser kira-kira v x TAU
       (~100 satuan), jadi pohonnya berhenti tepat di depan moncong truk. */
    const pohon = taruh(P.pohonTabrak(), 760, L.dekatBawah - 2, 'tabrak', 220, 1.05);
    pohon.batang = pohon.el.querySelector('.sc-pohonBatang');
    celakaPohon = pohon;
  }

  function majuCelaka(dt) {
    celakaT += dt;
    const u = Math.min(1, celakaT / T_VEER);
    const x0 = trukTargetX, y0 = trukTargetY;
    trukX = x0 + (516 - x0) * u;
    trukY = y0 + (L.kitaY + 26 - y0) * u * u;
    trukSudut = 7 * u;
    if (celakaT >= T_VEER && !sudahTabrak) {
      sudahTabrak = true;
      trukSudut = 14; trukX = 516; trukY = L.kitaY + 26;
      trukTargetX = 516; trukTargetY = L.kitaY + 26;
      efekTabrak();
      if (svg) svg.dispatchEvent(new CustomEvent('sc-tabrak', { bubbles: true }));
    }
    if (sudahTabrak) {
      trukSudut = 14 - 3 * Math.min(1, (celakaT - T_VEER) / 0.6);
      if (celakaPohon && celakaPohon.batang) {
        const w = Math.min(1, (celakaT - T_VEER) / 0.45);
        const mudah = 1 - Math.pow(1 - w, 3);
        celakaPohon.batang.setAttribute('transform', 'rotate(' + (24 * mudah).toFixed(1) + ')');
      }
    }
    pasangTruknya();
    if (celakaT >= T_TOTAL) {
      celakaT = -1; TAU = TAU_JALAN;
      const selesai = onSelesai; onSelesai = null;
      if (selesai) selesai();
    }
  }

  let celakaPohon = null;
  function efekTabrak() {
    if (!truk) return;
    truk.classList.add('sc-truk--rusak');
    const g = G({ class: 'sc-rusak' });
    /* kaca retak */
    g.append(n('path', { class: 'sc-retak',
      d: 'M26 -74 L40 -62 L34 -50 M40 -62 L54 -70 M40 -62 L44 -48' }));
    /* asap dari moncong */
    for (let i2 = 0; i2 < 7; i2++) {
      const c = n('circle', { class: 'sc-asap', cx: 96 + i2 * 4, cy: -70, r: 7 + i2 * 2 });
      c.style.setProperty('--d', (i2 * 0.16).toFixed(2) + 's');
      g.append(c);
    }
    /* serpihan */
    for (let i2 = 0; i2 < 6; i2++) {
      const p2 = n('rect', { class: 'sc-serpih', x: 108, y: -40, width: 5, height: 3 });
      p2.style.setProperty('--dx', (30 + i2 * 22) + 'px');
      p2.style.setProperty('--dy', (-40 + i2 * 13) + 'px');
      p2.style.setProperty('--d', (i2 * 0.04).toFixed(2) + 's');
      g.append(p2);
    }
    truk.append(g);
  }

  function jadwalLaluLintas(sp, detik) {
    const daftar = [];
    const banyak = Math.min(7, 1 + Math.floor(detik * (sp / 42)));
    for (let i2 = 0; i2 < banyak; i2++) {
      const u = r();
      const arah = u < 0.34 ? 'lawan' : (u < 0.72 ? 'salip' : 'tersalip');
      daftar.push({ pada: r() * 0.85, arah: arah, jenis: r() < 0.4 ? 'truk' : 'mobil' });
    }
    return daftar.sort((a, b) => a.pada - b.pada);
  }

  const WARNA_MOBIL = ['biru', 'kuning', 'hijau', 'coklat', 'putih', 'merah'];

  /* Kecepatan MUTLAK tiap kendaraan, sebagai kelipatan kecepatan kita saat ia
     muncul. Sekali muncul, angka itu miliknya sendiri: kalau kita melambat,
     ia tidak ikut melambat. */
  const RELATIF = {
    lawan:    { v: -1.05, lapis: 'seberang', y: L.seberangY, skala: SKALA_SEBERANG, dari: 1120 },
    salip:    { v:  1.55, lapis: 'salip',    y: L.salipY,    skala: SKALA_SALIP,    dari: -340 },
    tersalip: { v:  0.52, lapis: 'salip',    y: L.salipY,    skala: SKALA_SALIP,    dari: 1120 }
  };

  function munculkan(cfg) {
    const w = WARNA_MOBIL[Math.floor(r() * WARNA_MOBIL.length)];
    const R = RELATIF[cfg.arah];
    const el = cfg.jenis === 'truk' ? trukLain(w) : (r() < 0.5 ? sedan(w) : pikap(w));
    if (cfg.arah === 'lawan') el.classList.add('sc-lawanArah');
    const o = taruh(el, R.dari, R.y, R.lapis, 340, R.skala,
                    cfg.arah === 'lawan' ? -R.skala : R.skala);
    o.v = R.v * Math.max(120, vKita);
    o.roda = el._roda;
    o.sudut = 0;
    return o;
  }

  /* ======================================================================
     Bagian 7 — berhenti di truck stop
     Kita MELAMBAT, bukan berhenti mendadak; papan dan pompa ditaruh sejauh
     jarak yang masih akan ditempuh selama melambat (v x TAU), jadi ia
     berhenti kira-kira di samping kita.
     ====================================================================== */
  function parkir() {
    const jarakSisa = vKita * TAU;
    vTarget = 0;
    sedangJalan = false;
    sisaKejadian = []; sisaLalu = [];
    taruh(P.truckStop(), 300 + jarakSisa, L.dekatAtas, 'pinggir', 700, 1);
    if (truk) truk.classList.add('sc-truk--parkir');
    pastikanGelung();
  }
  function berangkatLagi() {
    if (truk) truk.classList.remove('sc-truk--parkir');
  }

  function berhenti() {
    if (gelung) { gelung.stop(); gelung = null; }
    sedangJalan = false; vKita = 0; vTarget = 0;
    sisaKejadian = []; sisaLalu = []; onKejadian = null; onSelesai = null;
    sela = null; akanCelaka = false;
    /* Sengaja TIDAK menyentuh posisi truk maupun bangkai tabrakan: sesudah
       celaka, pemandangannya harus tetap terlihat selama pesan dibaca. */
  }

  function propKejadian(k) {
    switch (k.jenis) {
      case 'kota': return P.rambuKota(k.teksProp || 'CITY');
      case 'perisai': return P.perisai(k.teksProp || '40');
      case 'zona': return P.zonaWaktu();
      case 'tol': return P.tol();
      case 'timbang': return P.timbang();
      case 'konstruksi': return P.konstruksi();
      case 'batas': return P.rambuBatas(k.teksProp || '35');
      case 'radar': return mobilPolisi(k.nyala);
      case 'terowongan': return P.terowongan();
      case 'truckstop': return P.truckStop();
      case 'pesawat': return P.pesawat();
      case 'burung': return P.burung();
      case 'kereta': return P.kereta();
      default: return null;
    }
  }

  const api = {
    pasang: pasang,
    bangun: bangun,
    perbarui: perbarui,
    jalan: jalan,
    parkir: parkir,
    berangkatLagi: berangkatLagi,
    berhenti: berhenti,
    get sedangJalan() { return sedangJalan; },
    get sedangSela() { return !!sela || celakaT >= 0; },
    /* Dipakai uji otomatis: keadaan dalam yang tidak terlihat dari DOM. */
    diagnostik: () => ({ benda: benda.length, roda: rodaTruk.length,
                         t: +tJalan.toFixed(2), lama: lamaJalan, sela: sela ? sela.fase : '-',
                         celakaT: +celakaT.toFixed(2),
                         sudut: +sudutRoda.toFixed(1), ofset: +jalanOfset.toFixed(1),
                         v: +vKita.toFixed(1), vTarget: +vTarget.toFixed(1),
                         bergerak: benda.filter(o => o.v).length,
                         jalan: sedangJalan, gelung: !!gelung }),
    L: L
  };
  global.RETRO = global.RETRO || {};
  global.RETRO.truckerScene = api;
})(window);
