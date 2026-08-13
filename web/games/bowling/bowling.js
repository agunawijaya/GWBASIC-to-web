/* ===========================================================================
   bowling.js — port dari BOWLING.BAS (1986, 75 baris).

   Program terpendek di Sesi 7, dan yang paling padat pelajarannya: ia memakai
   TIGA pola khas BASIC sekaligus, dan ketiganya sudah bernama di fondasi.

   ------------------------------------------------------------------------
   1. LAYAR SEBAGAI STRUKTUR DATA  (pola yang TIDAK ditiru)

       570 IF SCREEN(V,H)=234 THEN J=J+1 ELSE 610
       590 X1=X1+D:X2=X2+1:IF SCREEN(X1,X2)=234 THEN
           LOCATE X1,X2:PRINT " ";:J=J+1: … GOTO 590

   Program ini tidak menyimpan di mana pinnya berada. Untuk tahu apakah bola
   mengenai pin, ia MEMBACA KEMBALI LAYAR — `SCREEN(V,H)` mengembalikan kode
   karakter di baris V kolom H, dan 234 adalah karakter pin. Menjatuhkan pin
   berarti `PRINT " "` di situ.

   Tampilan ADALAH keadaan permainannya.

   Alasannya masuk akal untuk 1986: layar sudah ada, sudah dua dimensi, bisa
   dibaca maupun ditulis, dan tidak memakan memori tambahan. Harganya baru
   terasa saat sesuatu berubah — ganti warna, geser tata letak, ganti kartu
   grafis, dan aturan permainannya ikut rusak.

   Di sini pin adalah data, dan layar digambar darinya.

   ------------------------------------------------------------------------
   2. ESCAPE SEQUENCE UNTUK MENGGAMBAR  (pola yang DITIRU)

       1001 DATA 234,31,29,29,234,31,29,29,234,28
       400  FOR I=1 TO 31:READ PC:PRINT CHR$(PC);:NEXT

   Tiga puluh satu angka menggambar sepuluh pin — karena hanya sepuluh di
   antaranya yang berupa pin (234); sisanya perintah gerak kursor:
   31 = turun, 29 = kiri, 28 = kanan.

   Bentuk dua dimensi disimpan sebagai deret satu dimensi berisi "gambar" dan
   "pindah". Prinsipnya sama dengan `\033[2J` di terminal Unix, dan dengan
   gambar dadu di CRAPS.BAS.

   ------------------------------------------------------------------------
   3. SKOR BOLING SEBAGAI MESIN KEADAAN

       450 ON S(Z9) GOSUB 680,700,720,740,760

   Menghitung skor boling biasanya digambarkan sebagai MELIHAT KE DEPAN: nilai
   sebuah strike baru diketahui setelah dua lemparan berikutnya. Program ini
   tidak pernah melihat ke depan — ia menyimpan satu angka keadaan per pemain,
   dan tiap lemparan memutakhirkannya. Bonus dibayar saat lemparannya terjadi.

   Lima keadaan, dan itu cukup untuk seluruh aturan boling.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, wait } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';

  /* --------------------------------------------------------------------
     Pin sebagai DATA.

     Sepuluh pin dalam segitiga: satu di depan, lalu 2, 3, 4. Baris = jalur
     bola (0..6), kolom = jarak dari pelempar (0..3).
     -------------------------------------------------------------------- */
  const PINS = [
    { n: 1, row: 3, col: 0 },
    { n: 2, row: 2, col: 1 }, { n: 3, row: 4, col: 1 },
    { n: 4, row: 1, col: 2 }, { n: 5, row: 3, col: 2 }, { n: 6, row: 5, col: 2 },
    { n: 7, row: 0, col: 3 }, { n: 8, row: 2, col: 3 },
    { n: 9, row: 4, col: 3 }, { n: 10, row: 6, col: 3 }
  ];
  const ROWS = 7, COLS = 4;

  let standing;                            // Set nomor pin yang masih berdiri
  const pinAt = (r, c) => PINS.find(p => p.row === r && p.col === c && standing.has(p.n));

  /* --------------------------------------------------------------------
     Kartu skor — mesin keadaan lima langkah, baris 680-760.

     S = 1  frame biasa
     S = 2  bonus strike, lemparan pertama
     S = 3  dua strike berturut-turut
     S = 4  bonus strike, lemparan kedua
     S = 5  bonus spare
     -------------------------------------------------------------------- */
  const STATE_TEXT = [
    '', 'frame biasa — belum ada bonus berjalan',
    'bonus strike, lemparan bonus pertama',
    'dua strike berturut-turut — lemparan ini dihitung ganda',
    'bonus strike, lemparan bonus kedua',
    'bonus spare — lemparan ini dihitung dua kali'
  ];

  let total, S, frame, ball, frameHits, rolls, phase;

  function newGame() {
    total = 0; S = 1; frame = 1; ball = 0; frameHits = 0;
    rolls = [];                            // {frame, pins, mark}
    phase = 'aim';
    standing = new Set(PINS.map(p => p.n));
    aimRow = 3; aimDir = 1;
    say('Tekan Lempar saat pelempar sejajar dengan sasaran.');
    drawCard(); drawStates(); drawPins(); render();
    $('throw').disabled = false;
  }

  /**
   * Majukan mesin keadaan satu lemparan — persis baris 680-760.
   *
   * Ini DITAMPILKAN, bukan dipakai menghitung total. Alasannya jujur: versi
   * pertama port ini memakainya untuk menjumlah, dan hasilnya 330 untuk
   * permainan sempurna, bukan 300.
   *
   * Yang salah bukan mesin keadaannya, melainkan penyederhanaan saya. Di
   * aslinya frame kesepuluh ditangani cabang khusus:
   *
   *     270 IF Q=10 THEN ON S GOTO 280,310,310,280,340
   *
   * Lemparan bonus di frame sepuluh bukan frame baru; ia hanya membayar bonus
   * frame sebelumnya. Tanpa cabang itu, dua lemparan terakhir dihitung sebagai
   * frame penuh DAN sebagai bonus — persis 30 angka kelebihan.
   */
  function advanceState(j, firstBall, pinsThisFrame) {
    const J = j, J1 = pinsThisFrame, PS = firstBall;
    if (S === 1) {                         // 680
      if (J1 === 10) S = PS ? 2 : 5;
    } else if (S === 2) {                  // 700
      S = (J === 10) ? 3 : 4;
    } else if (S === 3) {                  // 720
      if (J !== 10) S = 4;
    } else if (S === 4) {                  // 740
      S = (J1 === 10) ? 5 : 1;
    } else if (S === 5) {                  // 760
      S = (J === 10) ? 2 : 1;
    }
  }

  /**
   * Skor baku, dihitung dari daftar lemparan mentah.
   *
   * Sepuluh frame; strike bernilai 10 + dua lemparan berikutnya, spare
   * bernilai 10 + satu lemparan berikutnya. Frame kesepuluh memuat lemparan
   * bonusnya sendiri, jadi tidak perlu perlakuan khusus di sini — dan itulah
   * kenapa bentuk ini lebih sulit ditulis salah daripada mesin keadaan.
   */
  function scoreGame(pins) {
    let t = 0, i = 0;
    for (let f = 0; f < 10; f++) {
      const a = pins[i] || 0, b = pins[i + 1] || 0, c = pins[i + 2] || 0;
      if (a === 10) { t += 10 + b + c; i += 1; }
      else if (a + b === 10) { t += 10 + c; i += 2; }
      else { t += a + b; i += 2; }
    }
    return t;
  }

  /* --------------------------------------------------------------------
     Lintasan
     -------------------------------------------------------------------- */
  /* Tingginya 260, bukan 240 seperti versi pertama, dan pita barisnya diberi
     jarak 32 dari tepi atas. Tambahan itu murni ruang untuk pelemparnya:
     kepalanya menjulur ke atas garis bidik, dan di baris paling atas versi
     lama ia terpotong tepi viewBox. Lantainya tidak berubah lebarnya. */
  const VW = 660, VH = 260;
  const X0 = 40, X1 = 560;                 // pangkal dan ujung lintasan
  const rowY = (r) => 32 + r * ((VH - 80) / (ROWS - 1));
  const colX = (c) => 400 + c * 48;

  const mk = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const svg = mk('svg', { viewBox: '0 0 ' + VW + ' ' + VH, class: 'b-lane',
                          role: 'img', 'aria-label': 'Lintasan boling' });
  $('lane').append(svg);

  let aimRow = 3, aimDir = 1, ballX = null, ballRow = 3, stride = 0;

  /* --------------------------------------------------------------------
     Pelempar.

     Aslinya penunjuk bidik berayun naik-turun di pangkal lintasan (baris
     510-530), dan versi pertama port ini menggambarnya sebagai segitiga
     kuning. Setia pada bentuknya, tapi tidak pada artinya: yang bergerak
     naik-turun mencari jalur di sana bukan sebuah panah — itu ORANG yang
     memilih tempat berdiri. Segitiga membuat pemain membaca layar sebagai
     "penunjuk yang harus disejajarkan"; orang yang melangkah membuatnya
     terbaca sebagai apa yang sebenarnya terjadi.

     Langkah kakinya dibangkitkan dari SATU variabel. `stride` naik satu tiap
     kali barisnya berubah, dan sudut fasenya seperempat putaran per langkah:

         t = stride * pi/2      ->      sin(t) = 0, 1, 0, -1, 0, 1, ...

     Satu kaki memakai sin(t), satunya sin(-t). Keduanya otomatis berlawanan,
     kaki yang melayang terangkat sedikit, dan pinggulnya turun saat
     langkahnya terbuka — itu tiga tanda yang membuat mata membaca "berjalan"
     alih-alih "bergetar". Tidak ada daftar pose, dan tidak ada angka waktu
     yang ditulis dua kali: kalau tingkat kesulitannya dinaikkan, ayunannya
     cepat dan langkahnya ikut cepat dengan sendirinya.

     ------------------------------------------------------------------------
     KENAPA BOLANYA DI DADA, DIPEGANG DUA TANGAN

     Percobaan pertama menggambarnya dari samping dengan bola di tangan yang
     terjulur rendah, seperti sesaat sebelum lepas. Anatomisnya benar; di
     layar gagal. Di lebar kolom yang ada, lintasan ini dirender sekitar 0,84
     kali ukuran viewBox-nya, jadi seluruh orangnya cuma setinggi ~28px. Pada
     ukuran itu lengan terjulur dan kaki melangkah berebut ruang yang sama,
     dan hasilnya gumpalan yang tidak terbaca sebagai apa pun.

     Yang dipakai sekarang adalah sikap AWALAN: bola dipegang dua tangan
     setinggi dada. Bentuknya jadi piktogram — kepala, bola, dua kaki — dan
     tiga bagian itu tidak pernah saling tumpang tindih, jadi ia tetap
     terbaca saat kecil. Kebetulan yang menguntungkan: sikap ini juga yang
     paling dikenali orang sebagai "boling", lebih daripada saat lepas.

     Ia juga menyelesaikan soal ruang. Dengan bola di dada, badannya cuma
     menjulur ~19 satuan ke ATAS garis bidik alih-alih ~28, dan baris paling
     atas tidak lagi memotong kepalanya.

     Satu penyimpangan yang disengaja: BOLANYA TIDAK IKUT MENGAYUN saat
     melangkah. Orang sungguhan mengayunkan bolanya. Tapi di sini bola itu
     menandai jalur bidik — kalau ia bergerak naik-turun sendiri, ia
     berbohong tentang ke mana lemparannya akan pergi. Yang bergerak hanya
     kaki dan pinggul; bolanya duduk persis di garis, selalu.
     -------------------------------------------------------------------- */
  function bowler(y, holding, s) {
    const g = mk('g', { class: 'b-bowler' });
    const t = s * Math.PI / 2;
    const swing = Math.sin(t);

    const cx = 22;                                // sumbu badan
    const bx = X0 - 6;                            // bola, tepat di garis bidik
    const shY = y - 4;                            // bahu
    const hipY = y + 8 + Math.abs(swing) * 1.3;   // pinggul turun saat langkah terbuka

    const P = (cls, d) => mk('path', { class: cls, d: d });

    /* Bayangan lebih dulu: ia ada DI BAWAH orangnya, dan di SVG urutan
       dokumen adalah urutan lapisan. */
    g.append(mk('ellipse', { class: 'b-shadow', cx: cx + 1, cy: y + 27, rx: 12, ry: 3 }));

    /* Kaki: celana dari pinggul ke pergelangan, lalu sepatu di ujungnya.
       Keduanya dihitung dari `v` yang sama, jadi sepatunya mustahil lepas
       dari kakinya — kesalahan yang gampang terjadi kalau posisinya ditulis
       dua kali. */
    const kaki = (v, sfx) => {
      const frag = document.createDocumentFragment();
      const fx = cx + v * 8.5;
      const fy = y + 24 - Math.abs(v) * 2.4;      // kaki yang melayang terangkat
      const kx = (cx + fx) / 2 + 2, ky = (hipY + fy) / 2;
      frag.append(P('b-pants' + sfx,
        'M' + cx + ',' + hipY + ' Q' + kx + ',' + ky + ' ' + fx + ',' + fy));
      frag.append(P('b-shoe' + sfx,
        'M' + (fx - 2.2) + ',' + (fy + 2.4) + ' L' + (fx + 3.6) + ',' + (fy + 2.4)));
      return frag;
    };

    /* Lengan: kulit dari bahu ke bola, lengan baju menutupi pangkalnya.
       Lengan bajunya digambar SESUDAH kulitnya — kain ada di atas kulit. */
    const lengan = (dx, sfx) => {
      const frag = document.createDocumentFragment();
      const sx = cx + dx;
      frag.append(P('b-skin' + sfx,
        'M' + sx + ',' + shY + ' Q' + (sx + 6) + ',' + (shY + 4) + ' ' +
        (bx - 3) + ',' + (y + 1)));
      frag.append(P('b-sleeve' + sfx,
        'M' + sx + ',' + shY + ' L' + (sx + 4.5) + ',' + (shY + 2.6)));
      return frag;
    };

    // --- sisi jauh, digambar sebelum badan -------------------------------
    g.append(kaki(-swing, '--far'));
    g.append(lengan(-3, '--far'));

    // --- badan ------------------------------------------------------------
    g.append(mk('rect', { class: 'b-skin-fill', x: cx - 1.6, y: y - 11,
                          width: 3.6, height: 4.5 }));          // leher
    g.append(P('b-shirt',
      'M' + (cx - 6.6) + ',' + (y - 5.4) +
      ' Q' + (cx - 7.4) + ',' + (y + 2) + ' ' + (cx - 5.4) + ',' + (hipY + 1.5) +
      ' L' + (cx + 5.6) + ',' + (hipY + 1.5) +
      ' Q' + (cx + 7.6) + ',' + (y + 2) + ' ' + (cx + 6.8) + ',' + (y - 5.4) +
      ' Q' + (cx + 0.2) + ',' + (y - 8.6) + ' ' + (cx - 6.6) + ',' + (y - 5.4) + ' Z'));
    // Kerah dan belahan depan — dua sapuan kecil yang membuatnya jadi BAJU,
    // bukan sekadar bidang berwarna.
    g.append(P('b-collar',
      'M' + (cx - 3.4) + ',' + (y - 7.2) + ' L' + (cx + 0.3) + ',' + (y - 3.6) +
      ' L' + (cx + 3.9) + ',' + (y - 7.4)));
    g.append(P('b-placket',
      'M' + (cx + 0.3) + ',' + (y - 3.6) + ' L' + (cx + 0.6) + ',' + (hipY + 1)));

    g.append(mk('circle', { class: 'b-head', cx: cx + 1.2, cy: y - 14, r: 5 }));
    g.append(P('b-hair',                                        // rambut, bagian atas-belakang
      'M' + (cx - 3.8) + ',' + (y - 15.4) +
      ' A5,5 0 0 1 ' + (cx + 5.6) + ',' + (y - 16.4) +
      ' Q' + (cx + 1) + ',' + (y - 13.6) + ' ' + (cx - 3.8) + ',' + (y - 15.4) + ' Z'));

    // --- sisi dekat -------------------------------------------------------
    g.append(kaki(swing, ''));
    g.append(lengan(2, ''));

    if (holding) {
      g.append(mk('circle', { class: 'b-ball', cx: bx, cy: y, r: 6 }));
      // Tiga lubang jari. Pada ~5px mereka nyaris tidak terlihat sebagai
      // lubang, tapi mereka memutus bidang hijau polos — dan itu cukup untuk
      // membuatnya terbaca sebagai bola boling, bukan kelereng.
      [[-1.6, -1.9], [1.5, -1.9], [-0.1, 0.9]].forEach(([dx, dy]) => {
        g.append(mk('circle', { class: 'b-ballhole', cx: bx + dx, cy: y + dy, r: 0.95 }));
      });
    }
    return g;
  }

  function render() {
    svg.textContent = '';
    svg.append(mk('rect', { class: 'b-gutter', x: 0, y: 0, width: VW, height: VH }));
    svg.append(mk('rect', { class: 'b-floor', x: X0, y: 14, width: X1 - X0, height: VH - 28 }));
    for (let r = 1; r < ROWS; r++) {
      svg.append(mk('line', { class: 'b-line', x1: X0, y1: (rowY(r) + rowY(r - 1)) / 2,
                              x2: X1, y2: (rowY(r) + rowY(r - 1)) / 2 }));
    }

    PINS.forEach(p => {
      const g = mk('g', { class: 'b-pin' + (standing.has(p.n) ? '' : ' b-pin--down') });
      const x = colX(p.col), y = rowY(p.row);
      g.append(mk('ellipse', { cx: x, cy: y, rx: 6, ry: 9 }));
      g.append(mk('circle', { cx: x, cy: y - 8, r: 4 }));
      svg.append(g);
    });

    if (phase === 'aim') {
      svg.append(mk('line', { class: 'b-aimline', x1: X0 + 14, y1: rowY(aimRow),
                              x2: X1, y2: rowY(aimRow) }));
    }
    /* Pelemparnya tetap berdiri setelah bola lepas — cuma tangannya kosong.
       Ia berdiri di baris tempat bolanya dilepas, karena `aimRow` berhenti
       di situ begitu fasenya berganti. */
    svg.append(bowler(rowY(aimRow), phase === 'aim', stride));

    if (ballX !== null) {
      svg.append(mk('circle', { class: 'b-ball', cx: ballX, cy: rowY(ballRow), r: 9 }));
    }
  }

  /* Penunjuk berayun naik-turun antara baris atas dan bawah — baris 510-530,
     di mana kecepatannya adalah `FOR I=1 TO DIFLVL:NEXT`, yaitu mencacah
     pekerjaan alih-alih melihat jam. Di sini ia jam sungguhan. */
  let aimTimer = 0;
  function aimLoop() {
    if (phase !== 'aim') return;
    aimRow += aimDir;
    if (aimRow >= ROWS - 1 || aimRow <= 0) aimDir = -aimDir;
    stride++;                                // satu langkah per perpindahan baris
    render();
    aimTimer = setTimeout(aimLoop, 340 - Number($('diff').value) * 26);
  }

  /* --------------------------------------------------------------------
     Bola berjalan, dan pin roboh menyebar menyerong — baris 560-600.
     -------------------------------------------------------------------- */
  async function roll() {
    if (phase !== 'aim') return;
    clearTimeout(aimTimer);
    phase = 'rolling';
    $('throw').disabled = true;
    ballRow = aimRow;

    for (ballX = X0; ballX < colX(0) - 10; ballX += 22) {
      render();
      audio.sound(37, 0.5);
      await wait(18);
    }

    let hit = 0;
    for (let c = 0; c < COLS; c++) {
      const p = pinAt(ballRow, c);
      ballX = colX(c);
      render();
      if (!p) { await wait(45); continue; }
      standing.delete(p.n); hit++;
      audio.sound(74, 0.5);
      /* baris 580-600: dari pin yang kena, sebaran menyerong ke depan-atas
         dan depan-bawah, selama masih ada pin berdiri. */
      for (const d of [-1, 1]) {
        let r2 = p.row, c2 = c;
        for (;;) {
          r2 += d; c2 += 1;
          const q = pinAt(r2, c2);
          if (!q) break;
          standing.delete(q.n); hit++;
          audio.sound(74, 0.5);
        }
      }
      render();
      await wait(120);
    }
    ballX = null;
    render();
    finishBall(hit);
  }

  function finishBall(hit) {
    frameHits += hit;
    const first = ball === 0;
    advanceState(hit, first, frameHits);
    rolls.push({ frame, pins: hit, mark: markOf(hit, first, frameHits) });
    total = scoreGame(rolls.map(r => r.pins));

    const strike = first && hit === 10;
    const spare = !first && frameHits === 10;
    say(strike ? 'STRIKE!' : spare ? 'SPARE!' : hit + ' pin.',
        strike || spare ? 'big' : '');
    if (strike || spare) audio.play('MB T200 O2 L16 c e g O3 c', { fresh: true });

    drawCard(); drawStates(); drawPins();

    if (frame === 10) {
      /* Frame kesepuluh: baris 270 memakai `ON S GOTO` untuk memutuskan
         apakah masih ada lemparan bonus. Di sini disederhanakan jadi aturan
         yang sama: strike atau spare memberi satu lemparan tambahan. */
      const extra = (strike || spare) && rolls.filter(r => r.frame === 10).length < 3;
      if (!extra && (ball >= 1 || strike)) return endGame();
    }

    if (strike || ball >= 1) {
      if (frame >= 10) return endGame();
      frame++; ball = 0; frameHits = 0;
      standing = new Set(PINS.map(p => p.n));
    } else {
      ball++;
    }
    phase = 'aim';
    $('throw').disabled = false;
    $('sFrame').textContent = Math.min(frame, 10);
    aimLoop();
  }

  const markOf = (hit, first, tot) =>
    first && hit === 10 ? 'X' : (!first && tot === 10) ? '/' : (hit === 0 ? '-' : String(hit));

  function endGame() {
    phase = 'over';
    $('throw').disabled = true;
    say('Selesai — total ' + total + '.', 'big');
    const best = db.get('best', null);
    if (best === null || total > best) {
      db.set('best', total); showBest();
      ui.toast('Rekor baru: ' + total + '.');
    }
    audio.play('MB T170 O2 L8 c e g O3 L4 c', { fresh: true });
  }

  /* --------------------------------------------------------------------
     Tampilan sisi
     -------------------------------------------------------------------- */
  function drawCard() {
    const host = $('card');
    host.textContent = '';
    const card = ui.el('div', { class: 'b-card' });
    for (let f = 1; f <= 10; f++) {
      const box = ui.el('div', { class: 'b-fr' + (f === frame && phase !== 'over' ? ' is-now' : '') });
      const top = ui.el('div', { class: 'b-fr__t' });
      rolls.filter(r => r.frame === f).forEach(r =>
        top.append(ui.el('span', { text: r.mark })));
      box.append(top, ui.el('div', { class: 'b-fr__s', text: f === 1 ? String(total) : '' }));
      card.append(box);
    }
    host.append(card);
    $('sTotal').textContent = total;
  }

  function drawStates() {
    const host = $('states');
    host.textContent = '';
    for (let s = 1; s <= 5; s++) {
      const row = ui.el('div', { class: 'b-st' + (s === S ? ' is-on' : '') });
      row.append(ui.el('span', { class: 'b-st__n', text: 'S=' + s }),
                 ui.el('span', { text: STATE_TEXT[s] }));
      host.append(row);
    }
  }

  /* Kebalikan dari "layar sebagai struktur data": inilah datanya. */
  function drawPins() {
    const host = $('pinData');
    host.textContent = '';
    const g = ui.el('div', { class: 'b-pins' });
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const p = PINS.find(q => q.row === r && q.col === c);
      g.append(ui.el('div', {
        class: 'b-pc' + (!p ? ' b-pc--none' : standing.has(p.n) ? ' b-pc--up' : ''),
        text: p ? String(p.n) : ''
      }));
    }
    host.append(g);
  }

  function say(t, kind) {
    $('say').textContent = t;
    $('say').className = 'b-say' + (kind ? ' b-say--' + kind : '');
  }

  const db = store('bowling');
  const showBest = () => {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b;
  };

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Bowling Champ',
    source: 'BOWLING.BAS · 1986',
    backHref: '../../index.html'
  }));

  $('throw').addEventListener('click', roll);
  $('restart').addEventListener('click', () => { clearTimeout(aimTimer); newGame(); aimLoop(); });
  $('diff').addEventListener('input', e => { $('diffN').textContent = e.target.value; });
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Skor tertinggi dihapus.')) return;
    db.set('best', null); showBest();
  });
  $('showPins').addEventListener('click', () => {
    const on = $('pinData').classList.toggle('hidden') === false;
    $('showPins').setAttribute('aria-pressed', on ? 'true' : 'false');
    $('showPins').textContent = on ? 'Sembunyikan data pin' : 'Tampilkan data pin';
  });

  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); roll(); }
  });

  showBest();
  newGame();
  aimLoop();
})();
