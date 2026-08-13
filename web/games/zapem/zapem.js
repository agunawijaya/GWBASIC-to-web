/* ===========================================================================
   zapem.js — port dari ZAP'EM.BAS (3 Februari 1982, kode build MAV-5-5-K).

   Yang paling TUA dari trio Attack/Serpent/Zap'em, dan satu-satunya yang
   menyimpan papan skor ke disket.

   ------------------------------------------------------------------------
   PEMAINNYA MENGETIK SENDIRI BENIH ACAKNYA

       460 INPUT "AH....YOUR NAME PLEASE ";NME$
           :LOCATE 15,1:INPUT "YOUR LAST SCORE ";R
       550 RANDOMIZE R

   Pertanyaan "berapa skor terakhir Anda" itu bukan basa-basi dan bukan
   diverifikasi ke mana pun — angkanya langsung jadi BENIH PENGACAK. Ketik
   angka yang sama, dapat permainan yang sama persis.

   Empat program, empat jawaban untuk soal yang sama:

       METEOR   mengaduk benih selama pemain berpikir      32.003 nilai
       FLYS     MID$(TIME$,4,2)+RIGHT$(TIME$,2)             3.600 nilai
       ATTACK   MID$(TIME$,3,2) — mengambil titik dua       1.440 nilai (cacat)
       ZAP'EM   MENANYAKANNYA KEPADA PEMAIN                 sebanyak yang diketik

   ------------------------------------------------------------------------
   "GHOST SHIPS" ITU CACAT INDEKS, DAN CERITANYA MEMBENARKANNYA

       1140 IF LL=B(Z) THEN LOCATE X,LL:PRINT "*":GOSUB 1190
            :LOCATE X,LL:PRINT " ":A(Z)=0:B(LL)=0:SCORE=SCORE+100:GOTO 680

   Perhatikan `B(LL)=0`. `Z` adalah nomor kapal, `LL` adalah KOLOM. Keduanya
   tidak sama — yang dimaksud jelas `B(Z)=0`. Karena kolomnya berjalan 3..24
   dan kapal aktifnya berindeks 1..6, tembakan yang mengenai sasaran di kolom
   3, 4, 5, atau 6 akan MENGHAPUS POSISI KAPAL LAIN, yang lalu lenyap tanpa
   memberi skor.

   Dan baris 1280 menjelaskannya sebagai fitur:

       1280 "The Horde ships are unpredictable. Some are Ghost ships. These
             will take more than one hit or will vanish upon being hit without
             a score increment."

   Cerita latarnya membenarkan cacatnya sendiri. Dipertahankan apa adanya —
   ini permainan yang lorenya lahir dari salah indeks.

   ------------------------------------------------------------------------
   PAPAN SKORNYA BERNAMA METEOR.DAT, DAN METEOR TIDAK PERNAH MENYENTUHNYA

       1390 OPEN "METEOR.DAT" FOR INPUT AS #1
       1500 OPEN "METEOR.DAT" FOR OUTPUT AS #1

   `METEOR.BAS` punya NOL pernyataan OPEN — sudah diperiksa. Berkas itu
   sepenuhnya milik ZAP'EM. (Review lamanya menyebut `BS.SCO`; itu keliru —
   `BS.SCO` ada di run/ tapi tidak ada satu pun program di koleksi yang
   membukanya, dan isinya lima entri kosong.)

   Sepuluh nama di METEOR.DAT dipakai sebagai isi awal papan skor di sini.

   ------------------------------------------------------------------------
   GELUNGNYA MEMASANG ULANG JEBAKAN TOMBOL TIAP BINGKAI

       620 KEY(14) ON : 630 ON KEY(14) GOSUB 970
       640 KEY(11) ON : 650 ON KEY(11) GOSUB 980
       660 KEY(1)  ON : 670 ON KEY(1)  GOSUB 990
       …
       960 GOTO 620

   Kenapa pemasangannya ada DI DALAM gelung? Karena penangannya tidak pernah
   `RETURN` — baris 970/980 berakhir `GOTO 680`, 990 berakhir di `GOTO 620`.
   Di GW-BASIC, jebakan tombol ditangguhkan selama penangan berjalan dan baru
   pulih saat `RETURN`. Karena tidak pernah ada `RETURN`, satu-satunya cara
   menghidupkannya lagi adalah memasangnya ulang — tiap bingkai, selamanya.

   ------------------------------------------------------------------------
   DUA VARIABEL MATI

       520 X=10 : Y=20
       820 Y=Y+M

   `M` tidak pernah diberi nilai di seluruh 137 baris, jadi ia nol dan `Y`
   tidak pernah berubah. `Y` sendiri tidak pernah dibaca sesudahnya. Sepasang
   variabel yang tidak melakukan apa-apa, bertahan sejak Februari 1982.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();
  const $ = (id) => document.getElementById(id);
  const db = store('zapem');

  const KOL = 40, BARIS = 25, SW = 16, SH = 20;
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const e = document.createElementNS(NS, t);
    if (a) for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };
  const sembunyikan = (el, ya) => {
    if (ya) el.setAttribute('hidden', ''); else el.removeAttribute('hidden');
  };
  const bunyi = (f, t) => { if ($('bunyi').checked) audio.sound(f, t); };

  /* --- keadaan, baris 470-520 -------------------------------------------- */
  const T1 = 6;                       // 510: jumlah kapal aktif
  let A = [], B = [];                 // 470: DIM A(250),B(250)
  let fuel = 150, kapal = 3, skor = 0, X = 10;
  let V = 7;                          // 500: warna; jadi 31 (berkedip) saat fuel<50
  let main = false, mode1982 = false;
  let acak = rng(0), benih = 0, nama = '';
  let hz = 10;
  let gelung = { start() {}, stop() {} };
  let tembakan = null;                // kilatan sinar, seperti ATTACK

  const svg = $('svg');
  let gLatar, gBingkai, gKapal, gHorde, gEfek, gTeks;

  (function defs() {
    const d = mkn('defs');
    [['gruang', ['#0a1024', 0], ['#141d3c', .6], ['#05070f', 1]],
     ['gpesawat', ['#eaf6ff', 0], ['#7fb4d8', .5], ['#2c4f70', 1]],
     ['ghorde', ['#ffd98a', 0], ['#e0912a', .5], ['#6b3a05', 1]]
    ].forEach(([id, ...st]) => {
      const g = mkn('linearGradient', { id, x1: '0%', y1: '0%', x2: '25%', y2: '100%' });
      st.forEach(([c, o]) => g.append(mkn('stop', { offset: o, 'stop-color': c })));
      d.append(g);
    });
    const f = mkn('filter', { id: 'zglow', x: '-60%', y: '-60%', width: '220%', height: '220%' });
    f.append(mkn('feGaussianBlur', { stdDeviation: 3, result: 'b' }));
    const m = mkn('feMerge');
    m.append(mkn('feMergeNode', { in: 'b' }), mkn('feMergeNode', { in: 'SourceGraphic' }));
    f.append(m); d.append(f); svg.append(d);
  })();

  gLatar = mkn('g'); gBingkai = mkn('g'); gHorde = mkn('g');
  gKapal = mkn('g'); gEfek = mkn('g'); gTeks = mkn('g');
  svg.append(gLatar, gBingkai, gHorde, gKapal, gEfek, gTeks);

  /* Bintang latar — tambahan, dan satu-satunya hiasan yang punya posisi tetap
     supaya tidak terbaca sebagai objek permainan. */
  const BINTANG = (function () {
    const r = rng(20482), b = [];
    for (let i = 0; i < 70; i++) {
      b.push({ x: 2 + r.next() * (KOL - 4), y: 4.5 + r.next() * 18,
               s: .5 + r.next() * 1.2, o: .2 + r.next() * .5 });
    }
    return b;
  })();

  /* --- rupa ---------------------------------------------------------------
     "It is supposed to be a fighter with rakish inverse swept wings" — baris
     1260. Kalimat itu ada karena `CHR$(27)` cuma bisa jadi `◄`, dan penulisnya
     tahu itu tidak cukup. Di sini sayap sapuan-terbaliknya digambar. */
  function pesawatGambar() {
    const g = mkn('g', { class: 'z-pesawat' });
    g.append(mkn('path', { class: 'z-badan', d: 'M2 10 L15 7.5 L23 10 L15 12.5 Z' }));
    g.append(mkn('path', { class: 'z-sayap', d: 'M6 10 L2 2 L9 3.5 L12 10 Z' }));
    g.append(mkn('path', { class: 'z-sayap', d: 'M6 10 L2 18 L9 16.5 L12 10 Z' }));
    g.append(mkn('circle', { class: 'z-kokpit', cx: 17, cy: 10, r: 1.9 }));
    g.append(mkn('path', { class: 'z-api', d: 'M23 10 L30 8.6 L34 10 L30 11.4 Z' }));
    return g;
  }

  function hordeGambar() {
    const g = mkn('g', { class: 'z-horde' });
    g.append(mkn('path', { class: 'z-hbadan',
      d: 'M3 10 L8 4.5 L13 10 L8 15.5 Z' }));
    g.append(mkn('circle', { class: 'z-hmata', cx: 8, cy: 10, r: 1.6 }));
    return g;
  }

  /* --- baris 570-610: bingkai kotak ganda -------------------------------- */
  function gambarBingkai() {
    gBingkai.textContent = '';
    const kotak = (x1, y1, x2, y2) => mkn('rect', { class: 'z-bingkai',
      x: (x1 - 1) * SW + 3, y: (y1 - 1) * SH + 3,
      width: (x2 - x1 + 1) * SW - 6, height: (y2 - y1 + 1) * SH - 6, rx: 4 });
    gBingkai.append(kotak(1, 1, 38, 23));                       // 580-600
    gBingkai.append(mkn('line', { class: 'z-pemisah', x1: 3, y1: 4 * SH - 3,
                                  x2: 38 * SW - 3, y2: 4 * SH - 3 }));   // 610
  }

  /* --- baris 690/870/930: PAPAN ANGKA DI DALAM LAYAR ----------------------
     Aslinya ketiganya tercetak di baris 2, di dalam bingkai, di atas garis
     pemisah baris 4:

        690 LOCATE 2,15:PRINT SHIP
        870 LOCATE 2,24:PRINT "SCORE: ";SCORE
        930 LOCATE 2,3 :PRINT "FUEL: ";INT(FUEL)

     Ini ditulis lebih dulu, bukan sesudah dilaporkan — pelajaran ATTACK §6c. */
  function statusLayar() {
    const angka = (v) => ' ' + v + ' ';
    return [[3, 'FUEL: ' + Math.trunc(fuel)],
            [14, 'SHIPS:' + angka(kapal)],
            [24, 'SCORE: ' + skor]];
  }

  /* --- menggambar --------------------------------------------------------- */
  function gambar() {
    if (mode1982) return gambarGlif();
    sembunyikan($('glif'), true); sembunyikan(svg, false);

    gLatar.textContent = '';
    gLatar.append(mkn('rect', { class: 'z-ruang', x: 0, y: 0,
                                width: KOL * SW, height: BARIS * SH }));
    for (const b of BINTANG) {
      gLatar.append(mkn('circle', { class: 'z-bintang', cx: b.x * SW, cy: b.y * SH,
                                    r: b.s, opacity: b.o }));
    }
    gambarBingkai();

    gHorde.textContent = '';
    for (let f = 1; f <= T1; f++) {
      if (!A[f] || !B[f]) continue;
      const g = hordeGambar();
      g.setAttribute('transform', 'translate(' + ((B[f] - 1) * SW) + ' ' + ((A[f] - 1) * SH) + ')');
      gHorde.append(g);
    }

    gKapal.textContent = '';
    const p = pesawatGambar();
    p.setAttribute('transform', 'translate(' + (1 * SW) + ' ' + ((X - 1) * SH) + ')');
    if (fuel < 50) p.classList.add('z-pesawat--kedip');          // 860: V=31
    gKapal.append(p);

    gTeks.textContent = '';
    statusLayar().forEach(([kolom, s]) => {
      const t = mkn('text', { class: 'z-status', x: (kolom - 1) * SW,
                              y: SH + SH * 0.8, 'xml:space': 'preserve' });
      t.textContent = s;
      gTeks.append(t);
    });
    if (pesanBesar) {
      const t = mkn('text', { class: 'z-besar', x: KOL * SW / 2, y: 11 * SH,
                              'text-anchor': 'middle' });
      t.textContent = pesanBesar;
      gTeks.append(t);
    }
  }

  function gambarGlif() {
    sembunyikan(svg, true); sembunyikan($('glif'), false);
    const g = [];
    for (let y = 1; y <= 23; y++) {
      let s = '';
      for (let x = 1; x <= 38; x++) {
        if (y === 1 || y === 23) s += (x === 1 ? '╔' : x === 38 ? '╗' : '═');
        else if (y === 4) s += (x === 1 ? '╠' : x === 38 ? '╣' : '═');
        else if (x === 1 || x === 38) s += '║';
        else if (y === X && x === 2) s += '◄';
        else {
          let ada = '';
          for (let f = 1; f <= T1; f++) if (A[f] === y && B[f] === x) ada = '■';
          s += ada || ' ';
        }
      }
      if (y === 2) {
        let baris = s.split('');
        statusLayar().forEach(([k, t]) => {
          for (let i = 0; i < t.length; i++) baris[k - 1 + i] = t[i];
        });
        s = baris.join('');
      }
      g.push(s);
    }
    $('glif').textContent = g.join('\n');
  }

  let pesanBesar = '';
  const pesan = (t) => { $('pesan').textContent = t || ''; };

  function papan() {
    $('s-skor').textContent = skor;
    $('s-fuel').textContent = Math.trunc(fuel);
    $('s-kapal').textContent = kapal;
    $('s-benih').textContent = benih;
    $('bar-fuel').style.width = Math.max(0, Math.min(100, fuel / 150 * 100)) + '%';
    $('bar-fuel').classList.toggle('z-kritis', fuel < 50);
    $('s-horde').textContent = A.slice(1, T1 + 1).filter((_, i) => A[i + 1] && B[i + 1]).length;
  }

  /* --- baris 720-810 & 900-920: Horde ------------------------------------ */
  function lahirkan(i) {                                        // 730/910/920
    A[i] = Math.floor(acak.next() * 16) + 5;
    B[i] = Math.floor(acak.next() * 7) + 30;
    if (A[i] < 6) A[i] = 7;
  }

  function langkah() {
    if (kapal === 0 || fuel <= 0) return selesai();             // 700

    let rr = Math.floor(acak.next() * 10);                      // 720
    if (rr >= 1 && rr <= T1 && !B[rr]) lahirkan(rr);            // 730

    for (let f = 1; f <= T1; f++) {                             // 740
      if (!A[f] || !B[f]) continue;                             // 750
      if (A[f] === X && B[f] === 2) {                           // 760: TABRAKAN
        bunyi(200, 3); kapal -= 1;
        letusan(2, X, 'ouch');
        A[f] = 0; B[f] = 0;
        continue;
      }
      if (B[f] < 3) {                                           // 780: LOLOS
        const baris = A[f];
        B[f] = 0; A[f] = 0; skor -= 150; bunyi(55, 1);
        letusan(2, baris, 'lolos');
        continue;
      }
      B[f] -= 1;                                                // 790
    }

    fuel -= 1.2;                                                // 850
    if (fuel < 50) V = 31;                                      // 860
    if (fuel < 1) return selesai();                             // 890

    rr = Math.floor(acak.next() * T1);                          // 900
    if (rr >= 1 && (!B[rr] || !A[rr])) lahirkan(rr);            // 910-920

    gambar(); papan();
  }

  /* --- baris 1050-1180: menembak ------------------------------------------ */
  function tembak() {
    if (!main) return;
    /* 1070-1090: cari kapal yang SEBARIS. Kalau tidak ada, baris 1100
       menggambar sinar sampai kolom 24 lalu selesai — meleset. */
    let z = 0;
    for (let i = 1; i <= T1; i++) if (X === A[i] && B[i]) { z = i; break; }
    if (!z) { sinar(X, 24, false); bunyi(120, 1); return; }

    /* 1120-1160: sinar berjalan kolom 3..24 dan berhenti di kolom kapalnya. */
    const kolom = B[z];
    if (kolom > 24) { sinar(X, 24, false); bunyi(120, 1); return; }
    sinar(X, kolom, true);
    for (let s = 300; s <= 315; s++) bunyi(s, .21);              // 1190-1210
    skor += 100;                                                // 1140
    A[z] = 0;

    /* 1140 menulis `B(LL)=0`, bukan `B(Z)=0` — LL kolom, Z nomor kapal.
       Inilah "Ghost ship" baris 1280. Dipertahankan apa adanya. */
    const hantu = (kolom >= 1 && kolom <= T1 && kolom !== z && B[kolom]) ? kolom : 0;
    const hKol = hantu ? B[hantu] : 0, hBar = hantu ? A[hantu] : 0;
    B[kolom] = 0;
    if (hantu) { A[hantu] = 0; letusan(hKol, hBar, 'hantu'); hantuCacah += 1; }

    letusan(kolom, X, 'kena');
    gambar(); papan();
  }

  let hantuCacah = 0;

  function sinar(baris, sampai, kena) {
    const y = (baris - 1) * SH + SH / 2;
    const g = mkn('g', { class: 'z-sinar' + (kena ? ' z-sinar--kena' : '') });
    g.append(mkn('rect', { class: 'z-sinar__pijar', x: 2 * SW, y: y - 4,
                           width: (sampai - 2) * SW, height: 8 }));
    g.append(mkn('rect', { class: 'z-sinar__inti', x: 2 * SW, y: y - 1.2,
                           width: (sampai - 2) * SW, height: 2.4 }));
    gEfek.append(g);
    /* Sama seperti ATTACK: sinarnya KEJADIAN, bukan keadaan. Ia dibuang pada
       langkah berikutnya supaya tidak pernah tergambar terhadap dunia yang
       sudah bergerak. */
    g.addEventListener('animationend', () => g.remove());
    setTimeout(() => g.remove(), 500);
    if (tembakan) tembakan.remove();
    tembakan = g;
    while (gEfek.childElementCount > 24) gEfek.firstChild.remove();
  }

  function letusan(kol, bar, jenis) {
    const cx = (kol - .5) * SW, cy = (bar - .5) * SH;
    const c = mkn('circle', { class: 'z-letus z-letus--' + jenis, cx, cy, r: 5 });
    gEfek.append(c);
    c.addEventListener('animationend', () => c.remove());
    setTimeout(() => c.remove(), 700);
    const label = { kena: '+100', lolos: '−150', ouch: 'OUCH', hantu: 'GHOST' }[jenis];
    if (label) {
      const t = mkn('text', { class: 'z-angka z-angka--' + jenis, x: cx, y: cy,
                              'text-anchor': 'middle' });
      t.textContent = label;
      gEfek.append(t);
      t.addEventListener('animationend', () => t.remove());
      setTimeout(() => t.remove(), 1200);
    }
    while (gEfek.childElementCount > 24) gEfek.firstChild.remove();
  }

  /* --- papan skor, baris 1330-1560 ---------------------------------------- */
  function tabelSkor() {
    return db.get('papan', null) || window.RETRO.ZAPEM_SKOR.map(e => ({ ...e }));
  }

  function simpanSkor() {
    const t = tabelSkor();
    t.push({ nama: nama || '???', skor });
    t.sort((a, b) => b.skor - a.skor);
    /* Baris 1470-1490 mengurut sepuluh dengan bubble sort dan MENUKAR nama
       bersama skornya (baris 1480 memakai dua `SWAP`) — jadi larik paralelnya
       aman. Yang tidak aman: baris 1480 membaca SCORE(I+1) sampai I=10, yaitu
       SCORE(11) yang tidak pernah dibaca dari berkas dan bernilai nol. Skor
       NEGATIF (mungkin, karena baris 780 mengurangi 150) akan tertukar ke
       slot 11 dan hilang saat baris 1510 hanya menulis 1..10. */
    const t10 = t.slice(0, 10);
    db.set('papan', t10);
    return t10;
  }

  function gambarTabel(sorot) {
    const t = tabelSkor();
    const b = $('papan-skor');
    b.textContent = '';
    t.forEach((e, i) => {
      const baris = ui.el('tr', sorot && e.nama === sorot.nama && e.skor === sorot.skor
                                ? { class: 'z-baru' } : {});
      baris.append(ui.el('td', { text: String(i + 1) }),
                   ui.el('td', { text: e.nama }),
                   ui.el('td', { class: 'mono', text: String(e.skor) }));
      b.append(baris);
    });
  }

  function selesai() {
    main = false; gelung.stop(); kb.captureScroll(false);
    pesanBesar = 'GAME OVER';
    gambar();
    const t = simpanSkor();
    const masuk = t.some(e => e.nama === (nama || '???') && e.skor === skor);
    gambarTabel({ nama: nama || '???', skor });
    pesan('Selesai. Skor ' + skor + (masuk ? ' — masuk sepuluh besar.' : '.') +
          (hantuCacah ? ' Ghost ship: ' + hantuCacah + '.' : ''));
    $('mulai').disabled = false;
    $('mulai').textContent = 'Main lagi';
    papan();
  }

  /* --- mulai --------------------------------------------------------------- */
  function mulai() {
    nama = ($('nama').value || '').trim().toUpperCase().slice(0, 12) || 'ANDA';
    benih = parseInt($('benih').value, 10);
    if (!Number.isFinite(benih)) benih = 0;
    acak = rng(benih);                                          // 550: RANDOMIZE R

    A = new Array(251).fill(0); B = new Array(251).fill(0);     // 470
    fuel = 150; kapal = 3; skor = 0; X = 10; V = 7;             // 480-520
    hantuCacah = 0; pesanBesar = ''; tembakan = null;
    gEfek.textContent = '';
    main = true;
    pesan('');
    $('mulai').disabled = true;
    kb.captureScroll(true);
    gelung.stop();
    gelung = loop({ hz, update: () => { if (main) langkah(); } });
    gelung.start();
    gambar(); papan();
  }

  /* --- kendali, baris 620-670 & 970-1000 ---------------------------------- */
  function naik() { if (!main) return; X -= 1; if (X < 2) X = 22; gambar(); }    // 980/1020
  function turun() { if (!main) return; X += 1; if (X > 22) X = 2; gambar(); }   // 970/1010

  kb.on('*', (e) => {
    if (!main) return;
    if (e.key === 'ArrowUp' || e.key === '8') naik();            // KEY(11)
    else if (e.key === 'ArrowDown' || e.key === '2') turun();    // KEY(14)
    else if (e.key === 'F1' || e.key === ' ' || e.key === 'Enter') { e.raw.preventDefault(); tembak(); }  // KEY(1)
  });

  /* --- pasang -------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: "Zap'em", source: "ZAP'EM.BAS · 3 Feb 1982 · MAV-5-5-K"
  }));

  $('mulai').addEventListener('click', mulai);
  $('b-naik').addEventListener('click', naik);
  $('b-turun').addEventListener('click', turun);
  $('b-tembak').addEventListener('click', tembak);
  $('mode').addEventListener('click', () => {
    mode1982 = !mode1982;
    $('mode').setAttribute('aria-pressed', String(mode1982));
    $('mode').textContent = mode1982 ? 'Mode modern' : 'Mode 1982';
    gambar();
  });
  $('hz').addEventListener('input', (e) => {
    hz = +e.target.value;
    $('hzv').textContent = hz + '/dtk';
    if (main) { gelung.stop(); gelung = loop({ hz, update: () => { if (main) langkah(); } }); gelung.start(); }
  });
  $('reset-papan').addEventListener('click', () => {
    db.set('papan', window.RETRO.ZAPEM_SKOR.map(e => ({ ...e })));
    gambarTabel(null);
    pesan('Papan skor dikembalikan ke isi METEOR.DAT 1980-an.');
  });
  $('hzv').textContent = hz + '/dtk';

  gambarTabel(null);
  gambar(); papan();
  pesan('Isi nama dan angka benih, lalu Mulai. ↑/↓ atau 8/2 bergerak, Spasi menembak.');
})();
