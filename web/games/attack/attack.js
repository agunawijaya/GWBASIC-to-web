/* ===========================================================================
   attack.js — port dari ATTACK.BAS (7 Oktober 1982, kode build MOD-5-5-M).

   ------------------------------------------------------------------------
   SELURUH LANSKAPNYA SATU STRING

       540 A$="_____/\_____/\__/\_______/\_/\____/\__/\___▄▄▄_/\_____…?"
       670 B$=MID$(A$,L+Z,40-Z)
       680 COLOR 6:LOCATE 23,1+Z:PRINT B$;

   Tidak ada larik medan, tidak ada peta. Ada satu string sepanjang 190 aksara,
   dan yang bergulir adalah JENDELA 40 kolom yang menggeser satu aksara per
   bingkai. L berjalan 1..149, jadi indeks terjauh yang tersentuh 188 — dua
   aksara sisa.

   Z adalah guncangan: baris 1530 menyetelnya ke 4 saat bom meledak, baris 660
   menurunkannya satu per bingkai. Perhatikan `40-Z` — jendelanya ikut MENYEMPIT
   selama berguncang, jadi lanskapnya terlihat tersentak mundur lalu menyusul.

   ------------------------------------------------------------------------
   BOM SELALU JATUH DI KOLOM 3 — YANG DIBIDIK WAKTU, BUKAN TEMPAT

       1030 IF Y/2=INT(Y/2) THEN BY=Y+1 ELSE BY=Y     ' selalu baris ganjil
       1080 …BY=BY+2…                                  ' turun dua baris/bingkai
       1070 IF BY=21 THEN GOSUB 1450                   ' meledak di baris 21
       1460 BE=SCREEN(BY+2,3)                          ' BACA LAYAR di (23,3)

   Kolomnya tetap 3. Yang berubah cuma KAPAN Anda menjatuhkannya, karena
   lanskapnya yang bergerak melewati kolom itu. Dan lamanya jatuh = (21-BY)/2
   bingkai, jadi menjatuhkan dari ketinggian berarti harus memimpin sasaran
   lebih jauh.

   Imbalannya tepat sebanding:

       1510 IF BE=210 OR BE=193 THEN SC=SC+(25-Y2)*12

   Y2 adalah baris pesawat SAAT bom dilepas. Makin tinggi, makin besar
   penggandanya — dan makin sulit menebak ke mana lanskapnya akan bergeser.
   Dua baris kode, satu tukar-menukar yang utuh.

   ------------------------------------------------------------------------
   BENIH ACAK YANG KEHILANGAN FAKTOR ENAM PULUH

       500 R1$=LEFT$(TIME$,2):R2$=RIGHT$(TIME$,2):R3$=MID$(TIME$,3,2)
       510 RANDOMIZE VAL(R1$+R2$+R3$)

   TIME$ berbentuk "HH:MM:SS". Indeks ke-3 adalah TITIK DUA, bukan menit. Jadi
   R3$ = ":M", dan `VAL("HHSS:M")` berhenti di titik dua — komponen ketiganya
   tidak menyumbang apa pun.

       terbaca  : HH + SS            -> 24 x 60      =  1.440 benih
       dimaksud : HH + SS + MM       -> 24 x 60 x 60 = 86.400 benih

   Satu posisi meleset, faktor 60 hilang. FLYS di koleksi yang sama menulis
   `MID$(TIME$,4,2)` dan benar.

   ------------------------------------------------------------------------
   DUA POKE KE BITA YANG SAMA, LEWAT DUA JALAN BERBEDA

       520 …DEF SEG=&H40 : POKE &H17,&H40      ' 0040:0017, nilai 64 = CapsLock
       625  DEF SEG=0    : POKE 1047,32        ' 0000:0417, nilai 32 = NumLock

   0x40:0x17 dan 0x0000:0x0417 adalah alamat linear yang SAMA — 1047 desimal,
   bita bendera papan ketik BIOS. Keduanya POKE biasa, bukan OR, jadi baris 625
   MENGHAPUS CapsLock yang baru dinyalakan baris 520. Tulisan pertamanya mati
   sebelum sempat berguna.

   SERPENT — sehari sebelumnya, berkas yang sama layar pembukanya — cuma
   melakukan yang kedua.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();
  const $ = (id) => document.getElementById(id);
  const db = store('attack');

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

  /* --- baris 540: lanskapnya, apa adanya ---------------------------------
     Kodenya TIDAK diketik ulang di sini. `attack-data.js` dibangkitkan langsung
     dari run/ATTACK.BAS, jadi tidak ada kesempatan salah salin — dan kalau
     berkas aslinya berubah, datanya ikut berubah. */
  const A = window.RETRO.ATTACK_LANSKAP;          // 190 kode CP437, 0-basis
  const LANSKAP = [0].concat(A);                  // 1-basis, seperti MID$

  /* --- petak layar 40x25: satu-satunya kebenaran ---------------------------
     Diperlukan, bukan hiasan: baris 1460 menilai bom dengan `SCREEN(23,3)`,
     jadi harus ada layar yang bisa ditanya. Sama seperti SERPENT dan METEOR. */
  const layar = new Int16Array(KOL * BARIS).fill(32);
  const idx = (y, x) => (y - 1) * KOL + (x - 1);
  const at = (y, x) => (y < 1 || y > BARIS || x < 1 || x > KOL) ? 32 : layar[idx(y, x)];
  const set = (y, x, k) => { if (y >= 1 && y <= BARIS && x >= 1 && x <= KOL) layar[idx(y, x)] = k; };

  /* ======================================================================= */

  const svg = $('svg');
  let gLangit, gTanah, gPesawat, gMusuh, gBom, gTeks, gEfek;

  (function defs() {
    const d = mkn('defs');
    const grad = [
      ['glangit', ['#0b1b3a', 0], ['#123258', .55], ['#2a4a72', 1]],
      ['gbadan',  ['#dfe7f2', 0], ['#9aa9bf', .5], ['#4d5a72', 1]],
      ['gmusuh',  ['#ffb0a0', 0], ['#e0503a', .5], ['#7c1a10', 1]],
      ['ggedung', ['#7d8ea6', 0], ['#3f4c62', .55], ['#1d2534', 1]],
      ['gpabrik', ['#ffd98a', 0], ['#e0912a', .5], ['#7a4408', 1]],
      ['gbukit',  ['#3c5a44', 0], ['#22392a', .6], ['#101c15', 1]]
    ];
    grad.forEach(([id, ...st]) => {
      const g = mkn('linearGradient', { id, x1: '0%', y1: '0%', x2: '20%', y2: '100%' });
      st.forEach(([c, o]) => g.append(mkn('stop', { offset: o, 'stop-color': c })));
      d.append(g);
    });
    const f = mkn('filter', { id: 'apijatuh', x: '-60%', y: '-60%', width: '220%', height: '220%' });
    f.append(mkn('feGaussianBlur', { stdDeviation: 3, result: 'b' }));
    const m = mkn('feMerge');
    m.append(mkn('feMergeNode', { in: 'b' }), mkn('feMergeNode', { in: 'SourceGraphic' }));
    f.append(m);
    d.append(f);
    svg.append(d);
  })();

  gLangit = mkn('g'); gTanah = mkn('g'); gBom = mkn('g');
  gMusuh = mkn('g'); gPesawat = mkn('g'); gEfek = mkn('g'); gTeks = mkn('g');
  svg.append(gLangit, gTanah, gBom, gMusuh, gPesawat, gEfek, gTeks);

  /* --- rupa lanskap: tiap kode CP437 jadi satu ubin gambar ----------------
     Bentuknya baru, tapi PEMETAANNYA bukan selera: kode 210 dan 193 adalah dua
     yang dinilai baris 1510 dengan pengganda ketinggian, jadi keduanya
     digambar sebagai PABRIK — satu-satunya bangunan berwarna hangat di seluruh
     lanskap. Sasaran termahal harus paling mudah dikenali. */
  function ubin(kode, gx, dasar) {
    const g = mkn('g', { transform: 'translate(' + gx + ' 0)' });
    const T = dasar;                                   // garis tanah, satuan y
    const tanah = (d) => g.append(mkn('path', { class: 'a-tanah', d }));
    switch (kode) {
      case 95:  tanah('M0 ' + T + ' h' + SW); break;                       // _
      case 47:  tanah('M0 ' + (T + 9) + ' L' + SW + ' ' + (T - 9)); break; // /
      case 92:  tanah('M0 ' + (T - 9) + ' L' + SW + ' ' + (T + 9)); break; // \
      case 63:  tanah('M0 ' + T + ' h' + SW);                              // ? penanda ujung
                g.append(mkn('circle', { class: 'a-ujung', cx: SW / 2, cy: T - 7, r: 3 }));
                break;
      case 220:                                                            // gedung rendah
        g.append(mkn('rect', { class: 'a-gedung', x: 1.5, y: T - 17, width: SW - 3, height: 17 }));
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 2; j++)
            g.append(mkn('rect', { class: 'a-jendela', x: 3.5 + i * 3.6, y: T - 14 + j * 6,
                                   width: 2.2, height: 3.4 }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 239:                                                            // hanggar melengkung
        g.append(mkn('path', { class: 'a-gedung',
          d: 'M1.5 ' + T + ' V' + (T - 9) + ' Q' + (SW / 2) + ' ' + (T - 21) +
             ' ' + (SW - 1.5) + ' ' + (T - 9) + ' V' + T + ' Z' }));
        g.append(mkn('rect', { class: 'a-pintu', x: SW / 2 - 2.4, y: T - 8, width: 4.8, height: 8 }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 219:                                                            // menara tinggi
        g.append(mkn('rect', { class: 'a-gedung', x: 2.5, y: T - 34, width: SW - 5, height: 34 }));
        for (let j = 0; j < 6; j++)
          g.append(mkn('rect', { class: 'a-jendela', x: 4.5, y: T - 31 + j * 5,
                                 width: SW - 9, height: 2.4 }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 210:                                                            // PABRIK: cerobong
        g.append(mkn('rect', { class: 'a-pabrik', x: 1.5, y: T - 14, width: SW - 3, height: 14 }));
        g.append(mkn('rect', { class: 'a-cerobong', x: SW / 2 - 2.6, y: T - 30, width: 5.2, height: 17 }));
        g.append(mkn('ellipse', { class: 'a-asap', cx: SW / 2, cy: T - 34, rx: 4.4, ry: 3 }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 193:                                                            // PABRIK: badan
        g.append(mkn('rect', { class: 'a-pabrik', x: 1, y: T - 19, width: SW - 2, height: 19 }));
        g.append(mkn('path', { class: 'a-atap',
          d: 'M1 ' + (T - 19) + ' l4 -5 l4 5 l4 -5 l4 5 Z' }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 215:                                                            // menara rangka
        g.append(mkn('path', { class: 'a-rangka',
          d: 'M4 ' + T + ' L7 ' + (T - 28) + ' M12 ' + T + ' L9 ' + (T - 28) +
             ' M5.5 ' + (T - 8) + ' h9 M6.3 ' + (T - 16) + ' h7.4 M7 ' + (T - 24) + ' h6' }));
        g.append(mkn('circle', { class: 'a-lampu', cx: 8, cy: T - 29, r: 1.8 }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 242: case 243:                                                  // tangki bahan bakar
        g.append(mkn('rect', { class: 'a-tangki', x: 2, y: T - 13, width: SW - 4, height: 13, rx: 5 }));
        g.append(mkn('line', { class: 'a-tangkiGaris', x1: 2, y1: T - 6.5, x2: SW - 2, y2: T - 6.5 }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 208:                                                            // kubah
        g.append(mkn('path', { class: 'a-gedung',
          d: 'M1.5 ' + T + ' V' + (T - 6) + ' A' + (SW / 2 - 1.5) + ' ' + (SW / 2 - 1.5) +
             ' 0 0 1 ' + (SW - 1.5) + ' ' + (T - 6) + ' V' + T + ' Z' }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      case 218: case 191: {                                                // derek
        const s = kode === 218 ? 1 : -1, px = kode === 218 ? 3 : SW - 3;
        g.append(mkn('rect', { class: 'a-gedung', x: px - 1.6, y: T - 24, width: 3.2, height: 24 }));
        g.append(mkn('line', { class: 'a-rangka', x1: px, y1: T - 24,
                               x2: px + s * 11, y2: T - 24 }));
        g.append(mkn('line', { class: 'a-rangka', x1: px + s * 9, y1: T - 24,
                               x2: px + s * 9, y2: T - 17 }));
        tanah('M0 ' + T + ' h' + SW);
        break;
      }
      case 32:                                                             // langit
        return null;
      default:
        /* Sisa kode >=169 tetap DIGAMBAR, bukan dibiarkan kosong: baris 1514
           menilainya, jadi bangunan yang tak terlihat berarti poin yang tak
           bisa dicari. */
        if (kode >= 169) {
          g.append(mkn('rect', { class: 'a-gedung', x: 2, y: T - 11, width: SW - 4, height: 11 }));
          tanah('M0 ' + T + ' h' + SW);
          break;
        }
        return null;
    }
    return g;
  }

  /* --- pesawat, musuh, bom ----------------------------------------------- */
  function pesawatGambar(jatuh) {
    const g = mkn('g', { class: 'a-pesawat' + (jatuh ? ' a-pesawat--jatuh' : '') });
    g.append(mkn('path', { class: 'a-badan',
      d: 'M1 11 L20 8 L34 9.5 L38 11 L34 12.5 L20 14 L1 12 Z' }));
    g.append(mkn('path', { class: 'a-sayapP', d: 'M14 11 L24 2 L28 3 L22 11 Z' }));
    g.append(mkn('path', { class: 'a-sayapP', d: 'M14 11 L24 19 L28 18 L22 11 Z' }));
    g.append(mkn('path', { class: 'a-ekor', d: 'M2 11 L7 4 L10 4.5 L8 11 Z' }));
    g.append(mkn('ellipse', { class: 'a-kokpit', cx: 29, cy: 10, rx: 3.4, ry: 1.7 }));
    g.append(mkn('path', { class: 'a-api', d: 'M1 11 L-7 9.5 L-11 11 L-7 12.5 Z' }));
    return g;
  }

  function musuhGambar() {
    const g = mkn('g', { class: 'a-musuh' });
    g.append(mkn('path', { class: 'a-mbadan', d: 'M15 10 L-2 8 L-6 10 L-2 12 L15 12 Z' }));
    g.append(mkn('path', { class: 'a-msayap', d: 'M4 10 L11 3 L14 4 L9 10 Z' }));
    g.append(mkn('path', { class: 'a-msayap', d: 'M4 10 L11 17 L14 16 L9 10 Z' }));
    g.append(mkn('circle', { class: 'a-mkokpit', cx: 1.5, cy: 10, r: 1.7 }));
    return g;
  }

  function bomGambar() {
    const g = mkn('g', { class: 'a-bom' });
    g.append(mkn('path', { class: 'a-bbadan',
      d: 'M8 2 C11 5,11 11,8 15 C5 11,5 5,8 2 Z' }));
    g.append(mkn('path', { class: 'a-bsirip', d: 'M8 12 l3 5 l-3 -2 l-3 2 Z' }));
    return g;
  }

  /* ======================================================================= */

  let sc = 0, bd = 35, sf = 60;                 // 520: SC=0 SF=60 BD=35
  let L = 0, Z = 0, Y = 14, Y1 = 0, Y5 = 0, SE = 0;
  let B = -1, BY = 0, Y2 = 0;                   // bom
  let Q1 = 1, mus = [];                         // musuh
  let main = false, mode1982 = false, sinarAktif = null;
  let acak = rng(1);
  let hz = 12;
  let gelung = { start() {}, stop() {}, pause() {} };

  const pesan = (t) => { $('pesan').textContent = t || ''; };

  /* Persediaan ditampilkan di TIGA tempat: papan angka, tombolnya sendiri, dan
     bilah sisa. Aslinya baris 600 mencetaknya di baris 4 layar dan baris 1040
     serta 1100 memperbaruinya tiap pemakaian — jadi ia memang selalu terlihat
     di layar, bukan angka tersembunyi. Dilaporkan pemilik koleksi: di port
     versi pertama satu baris papan angka saja tidak cukup terbaca. */
  function papan() {
    $('s-skor').textContent = sc;
    $('s-bom').textContent = bd;
    $('s-laser').textContent = sf;
    $('s-bingkai').textContent = L + ' / 149';
    $('s-rekor').textContent = db.get('rekor', 0);
    $('n-bom').textContent = bd;
    $('n-laser').textContent = sf;
    $('b-bom').classList.toggle('a-habis', bd === 0);
    $('b-laser').classList.toggle('a-habis', sf === 0);
    $('b-bom').classList.toggle('a-tipis', bd > 0 && bd <= 5);
    $('b-laser').classList.toggle('a-tipis', sf > 0 && sf <= 10);
    $('bar-bom').style.width = (bd / 35 * 100) + '%';
    $('bar-laser').style.width = (sf / 60 * 100) + '%';

    /* ARAH TEGAK YANG SEDANG BERLAKU.

       Baris 710-730 menyetel Y1 dan membiarkannya — pesawatnya terus bergerak
       sampai disuruh berhenti. Itu bukan pilihan rasa: `INKEY$` tidak punya
       kejadian tombol-dilepas, jadi "tahan untuk bergerak" MUSTAHIL di BASIC
       DOS. Yang bisa dilakukan cuma menyetel arah dan menyediakan rem.

       Yang hilang di port versi pertama: tidak ada cara melihat arah mana yang
       sedang berlaku. Pemilik koleksi menyangka pesawatnya tidak bisa didiamkan
       sama sekali. Aturannya benar; yang kurang penunjuknya. */
    const arah = Y5 === 1 ? 'jatuh' : (Y1 === -1 ? 'naik' : (Y1 === 1 ? 'turun' : 'datar'));
    $('b-atas').classList.toggle('a-aktif', arah === 'naik');
    $('b-diam').classList.toggle('a-aktif', arah === 'datar');
    $('b-bawah').classList.toggle('a-aktif', arah === 'turun' || arah === 'jatuh');
    [$('b-atas'), $('b-diam'), $('b-bawah')].forEach(b =>
      b.classList.toggle('a-habis', Y5 === 1));
    $('s-arah').textContent = arah === 'jatuh' ? 'jatuh (tak terkendali)' : arah;
    $('s-arah').classList.toggle('a-nilai-bahaya', arah === 'jatuh');
  }

  /* --- baris 540-560: siapkan ronde -------------------------------------- */
  function ronde() {
    L = 0; Z = 0; Y1 = 0; Y5 = 0; SE = 0; B = -1;
    Y = Math.floor(acak.next() * 14) + 8;              // 570: INT(RND*14)+8
    Q1 = 1;
    mus = [{ x: 40, y: 14, dy: 0, r: 0 }];             // 560: Y(1)=14 X(1)=40
    gulir();                                           // 620-630: jendela pertama
    gambar();
    papan();
  }

  /* Baris 670-680: jendela selebar 40-Z aksara, mulai dari indeks L+Z, dicetak
     mulai kolom 1+Z. Perhatikan jendelanya MENYEMPIT selama Z>0 — itulah
     guncangan layarnya, dan tidak ada satu pun baris yang khusus menanganinya. */
  function gulir() {
    const l = Math.max(1, L);
    for (let x = 1; x <= KOL; x++) set(23, x, 32);
    for (let i = 0; i < KOL - Z; i++) set(23, 1 + Z + i, LANSKAP[l + Z + i] || 32);
  }

  /* --- satu bingkai simulasi = satu putaran gelung 650-1020 --------------- */
  function langkah() {
    /* Sinar dari langkah sebelumnya dibuang SEBELUM dunia bergerak — lihat
       `sinarLaser()`, jaminan ketiga. */
    if (sinarAktif) { sinarAktif.remove(); sinarAktif = null; }
    L += 1;                                            // 650
    if (L >= 150) { return selesaiRonde(); }
    if (Z > 0) Z -= 1;                                 // 660

    gulir();                                           // 670-680

    if (Y5 === 1) { bunyi(1500, .1); Y1 = 1; }         // 690: kehilangan kendali

    if (B === 1) langkahBom();                         // 860

    if (Y + Y1 === 6) { Y5 = 1; Y1 = 1; }              // 810
    if (Y + Y1 === 23) { SE = 1; return mati('menabrak tanah'); }   // 820
    Y = Y + Y1;                                        // 840

    langkahMusuh();
    gambar();
    papan();
  }

  /* --- baris 870-1010: musuh --------------------------------------------- */
  function langkahMusuh() {
    for (let q = 0; q < mus.length; q++) {
      const m = mus[q];
      if (m.r === 1) {                                 // 880-890: sedang menunggu
        if (Math.floor(acak.next() * 50) > 45) m.r = 0;
        continue;
      }
      m.x -= 2;                                        // 920
      m.y += m.dy;
      if (m.x <= 0) { lahirkan(m); continue; }         // 930: GOSUB 1410
      if (Q1 < 4 && m.x === 30) {                      // 950: GOSUB 1430
        Q1 += 1;
        mus.push({ x: 40, y: Math.floor(acak.next() * 15) + 8, dy: 0, r: 0 });
      }
      if (m.y < Y) m.dy = 1;                           // 960
      if (m.y > Y) m.dy = -1;                          // 970
      if (Math.floor(acak.next() * 40) > 35) m.dy = -m.dy;            // 980
      if (m.y + m.dy === 23 || m.y + m.dy === 6) m.dy = 0;            // 990
      if ((m.x === 4 || m.x === 2) && m.y === Y) return mati('ditembak jatuh'); // 1000
    }
  }
  function lahirkan(m) {                               // 1410
    m.y = Math.floor(acak.next() * 15) + 8;
    m.x = 40; m.r = 1; m.dy = 0;
  }

  /* --- baris 1030-1090 & 1450-1550: bom ---------------------------------- */
  function jatuhkanBom() {                             // 780 -> 1030
    if (bd <= 0) { pesan('Bom habis — 35 sudah terpakai.'); return; }
    if (B === 1) { pesan('Masih ada bom yang jatuh — satu saja sekaligus.'); return; }
    if (Y >= 20) { pesan('Terlalu rendah untuk menjatuhkan bom.'); return; }
    if (!(bd > 0 && B === -1 && Y < 20)) return;       // 780: syarat aslinya
    BY = (Y % 2 === 0) ? Y + 1 : Y;                    // 1030
    B = 1; bd -= 1; Y2 = Y;                            // 1040
    bunyi(120, 1);
    papan();
  }

  function langkahBom() {                              // 1070-1080
    if (BY === 21) return meledak();                   // 1070: GOSUB 1450
    BY += 2;                                           // 1080
  }

  function meledak() {                                 // 1450-1550
    B = -1;
    const BE = at(23, 3);                              // 1460: BACA LAYAR
    BY += 2;                                           // 1480
    bunyi(50, 1);
    let tambah = 0, jenis = '';
    if (BE === 210 || BE === 193) {                    // 1510
      tambah = (25 - Y2) * 12; jenis = 'pabrik';
    } else if (BE >= 169 && BE !== 210 && BE !== 193 && BE !== 196) {   // 1514
      tambah = Math.floor(acak.next() * 30) + 10; jenis = 'bangunan';
    }
    sc += tambah;
    Z = 4;                                             // 1530
    letusan(3, 23, tambah, jenis);
    papan();
  }

  /* --- baris 1100-1190: laser --------------------------------------------
     Aslinya sinarnya digambar, dibunyikan, ditahan `FOR D=1 TO 20`, lalu
     dihapus — semuanya di dalam satu penekanan tombol (1100-1120). Ia KEJADIAN,
     bukan keadaan yang bertahan, dan itu ditiru persis di sini.

     Baris 1130 hanya membunuh musuh yang barisnya PERSIS sama dan `X>4`, dan
     baris 1160 keluar dari gelung sesudah satu kena — jadi satu tembakan paling
     banyak menjatuhkan satu musuh. Keduanya dipertahankan. */
  function tembakLaser() {                             // 790 -> 1100
    if (sf <= 0) { pesan('Laser habis — 60 sudah terpakai.'); return; }   // 790: IF SF>0
    sf -= 1;
    const barisTembak = Y;                             // baris yang BENAR-BENAR diuji
    let kena = false;
    bunyi(900, 1);
    for (const m of mus) {                             // 1130
      if (m.y === barisTembak && m.x > 4 && m.r !== 1) {
        sc += 20;                                      // 1160
        kena = true;
        letusan(m.x, m.y, 20, 'musuh');
        for (let s = 150; s <= 160; s++) bunyi(s, .1); // 1170
        m.y = Math.floor(acak.next() * 16) + 7;        // 1180
        m.x = 40; m.r = 1;
        break;
      }
    }
    sinarLaser(barisTembak, kena);
    papan();
  }

  /* SINARNYA ADALAH KEJADIAN, BUKAN KEADAAN — dan itu bukan soal rasa.

     Versi sebelumnya menyimpan `laserSisa` lalu menggambar ulang sinarnya di
     `gambar()` bingkai berikutnya. Akibatnya sinar itu BERBOHONG: uji kenanya
     dijalankan pada keadaan dunia saat tombol ditekan, tapi gambarnya bertahan
     melewati satu langkah simulasi — dan selama langkah itu musuh bergerak dua
     kolom serta bisa berpindah baris. Jadi pemain melihat sinar melintasi
     musuh yang TIDAK PERNAH diuji, lalu musuh itu terbang santai. Persis yang
     dilaporkan pemilik koleksi.

     Sekarang sinarnya dibuat sekali di lapisan efek, pada baris yang benar-
     benar diuji, dan memudar sendiri lewat animasi CSS. `gambar()` tidak pernah
     menyentuhnya, jadi ia tidak bisa tergambar ulang terhadap dunia yang sudah
     berubah. Aslinya memang begitu: baris 1100-1120 menggambar, menahan
     `FOR D=1 TO 20`, lalu menghapus — semuanya di dalam satu penekanan tombol. */
  function sinarLaser(baris, kena) {
    const y = (baris - 1) * SH + SH / 2;
    const g = mkn('g', { class: 'a-sinar' + (kena ? ' a-sinar--kena' : '') });
    /* Baris 1100: `LOCATE Y,5: PRINT M$` dengan M$ 36 aksara — mulai kolom 5,
       panjang 36 kolom. Baris 1130 membunuh yang X>4. Gambarnya dan syarat
       bunuhnya menutupi rentang yang sama persis, jadi apa yang terlihat
       adalah apa yang mematikan. */
    g.append(mkn('rect', { class: 'a-sinar__pijar', x: 4 * SW, y: y - 4,
                           width: 36 * SW, height: 8 }));
    g.append(mkn('rect', { class: 'a-sinar__inti', x: 4 * SW, y: y - 1.2,
                           width: 36 * SW, height: 2.4 }));
    gEfek.append(g);
    /* TIGA jaminan sinarnya hilang, dan yang ketiga yang mengikat:
         1. animasi CSS selesai;
         2. pewaktu cadangan, kalau animasinya tidak pernah berjalan —
            tab latar belakang atau `prefers-reduced-motion`;
         3. LANGKAH SIMULASI BERIKUTNYA. Ini bukan kemewahan: sinarnya diuji
            terhadap keadaan dunia saat tombol ditekan, jadi begitu dunia maju
            satu langkah ia tidak lagi berhak tergambar. */
    g.addEventListener('animationend', () => g.remove());
    setTimeout(() => g.remove(), 500);
    if (sinarAktif) sinarAktif.remove();
    sinarAktif = g;
    while (gEfek.childElementCount > 30) gEfek.firstChild.remove();
  }

  /* --- akhir ------------------------------------------------------------- */
  function mati(sebab) {
    main = false; gelung.stop(); kb.captureScroll(false);
    bunyi(60, 4);
    $('crt').classList.add('a-crt--mati');
    setTimeout(() => $('crt').classList.remove('a-crt--mati'), 700);
    simpanRekor();
    /* 1295: mati dengan skor di atas 800 tetap dihitung berhasil. */
    if (sc > 800) {
      teksBesar('G A M E   O V E R', 'GOOD JOB!!');
      pesan('Tertembak jatuh (' + sebab + ') — tapi skor ' + sc + ' di atas 800.');
    } else {
      teksBesar('YOU FAILED', 'YOUR MISSION');       // 1300-1390
      pesan('Habis: ' + sebab + '. Skor ' + sc + '.');
    }
    tombolAkhir();
  }

  function selesaiRonde() {                            // 1580-1799
    main = false; gelung.stop(); kb.captureScroll(false);
    simpanRekor();
    if (sc > 500) {                                    // 1790
      teksBesar('MISSION COMPLETE', 'ON TO THE NEXT ROUND!');
      pesan('149 bingkai selesai, skor ' + sc + ' — ronde berikutnya.');
      $('lanjut').hidden = false;
    } else {
      teksBesar('MISSION COMPLETE', '');
      pesan('149 bingkai selesai, skor ' + sc + '. Perlu di atas 500 untuk ronde berikutnya.');
    }
    tombolAkhir();
  }

  function tombolAkhir() {
    $('mulai').disabled = false;
    $('mulai').textContent = 'Main lagi';
  }
  function simpanRekor() {
    if (sc > db.get('rekor', 0)) db.set('rekor', sc);
    papan();
  }

  let besar = null;
  function teksBesar(a, b) { besar = [a, b]; gambar(); }

  /* --- letusan ------------------------------------------------------------ */
  function letusan(x, y, nilai, jenis) {
    const cx = (x - .5) * SW, cy = (y - .5) * SH;
    const c = mkn('circle', { class: 'a-letus', cx, cy, r: 6 });
    gEfek.append(c);
    c.addEventListener('animationend', () => c.remove());
    if (nilai > 0) {
      const t = mkn('text', { class: 'a-angka' + (jenis === 'pabrik' ? ' a-angka--pabrik' : ''),
                              x: cx, y: cy, 'text-anchor': 'middle' });
      t.textContent = '+' + nilai;
      gEfek.append(t);
      t.addEventListener('animationend', () => t.remove());
    }
    $('crt').classList.remove('a-crt--guncang');
    void $('crt').offsetWidth;
    $('crt').classList.add('a-crt--guncang');
    setTimeout(() => $('crt').classList.remove('a-crt--guncang'), 340);
    while (gEfek.childElementCount > 30) gEfek.firstChild.remove();
  }

  /* --- menggambar --------------------------------------------------------- */
  function gambar() {
    if (mode1982) return gambarGlif();
    sembunyikan($('glif'), true);
    sembunyikan(svg, false);

    gLangit.textContent = '';
    gLangit.append(mkn('rect', { class: 'a-langit', x: 0, y: 0, width: KOL * SW, height: BARIS * SH }));
    /* Baris 580/610 mencetak garis biru di baris 5 — "atmosfer". Melewatinya
       membuat Y5=1 dan kendali hilang (baris 810), jadi ia BUKAN hiasan. */
    gLangit.append(mkn('line', { class: 'a-atmosfer', x1: 0, y1: 5 * SH, x2: KOL * SW, y2: 5 * SH }));

    gTanah.textContent = '';
    for (let x = 1; x <= KOL; x++) {
      const u = ubin(at(23, x), (x - 1) * SW, 22 * SH + SH);
      if (u) gTanah.append(u);
    }
    gTanah.append(mkn('rect', { class: 'a-bumi', x: 0, y: 23 * SH, width: KOL * SW, height: 2 * SH }));

    gPesawat.textContent = '';
    const p = pesawatGambar(Y5 === 1);
    p.setAttribute('transform', 'translate(' + (1 * SW) + ' ' + ((Y - 1) * SH) + ')');
    gPesawat.append(p);

    gMusuh.textContent = '';
    for (const m of mus) {
      if (m.r === 1) continue;
      const g = musuhGambar();
      g.setAttribute('transform', 'translate(' + ((m.x - 1) * SW) + ' ' + ((m.y - 1) * SH) + ')');
      gMusuh.append(g);
    }

    gBom.textContent = '';
    if (B === 1) {
      const g = bomGambar();
      g.setAttribute('transform', 'translate(' + (2 * SW) + ' ' + ((BY - 1) * SH) + ')');
      gBom.append(g);
    }

    /* Sinar laser SENGAJA tidak digambar di sini — lihat `tembakLaser()`. */

    gTeks.textContent = '';

    /* --- baris 600: BARIS STATUS DI DALAM LAYAR ---------------------------
       Ini terlewat sepenuhnya di versi pertama port, dan pemilik koleksi yang
       menemukannya. Aslinya BOMBS / SCORE / LASERS bukan panel di luar layar —
       ia tercetak DI baris 4, tepat di atas garis atmosfer baris 5:

          600 COLOR 7:LOCATE 4,3 :PRINT "BOMBS -";BD;" SCORE -";SC;
                     :LOCATE 4,28:PRINT "LASERS -";SF;
         1040       …LOCATE 4,3 :PRINT "BOMBS -";BD
         1100       …LOCATE 4,28:PRINT "LASERS -";SF
         1160/1520  …LOCATE 4,14:PRINT "SCORE -";SC

       Kolom 3, 14, dan 28 diambil dari baris PEMBARUANNYA (1040/1160/1100),
       bukan dari baris 600 — karena ketiganya yang berjalan terus-menerus.

       Catatan kecil yang tidak ditiru: baris 600 mencetak lewat satu `PRINT`
       beruntun, dan spasi di depan `" SCORE -"` membuatnya mulai di kolom 15;
       baris 1160 memakai kolom 14. Jadi di aslinya label SCORE bergeser satu
       kolom ke kiri begitu skornya berubah pertama kali. Di sini kolom 14
       sejak awal — pergeseran itu cacat tampilan, bukan aturan main. */
    const angka = (v) => ' ' + v + ' ';                // format angka BASIC
    [[3, 'BOMBS -' + angka(bd)], [14, 'SCORE -' + angka(sc)],
     [28, 'LASERS -' + angka(sf)]].forEach(([kolom, s]) => {
      /* Tanpa `textLength`. Percobaan pertama memaksanya selebar sel grid
         (11 aksara x 16 satuan), dan karena fonta 15px hanya maju ~9 satuan
         per aksara, hurufnya jadi teregang jauh — dan spasi ekornya tetap
         dibuang sehingga "BOMBS - 35" menempel ke "SCORE".

         Yang benar: pilih ukuran fonta yang MEMANG selebar selnya. Fonta
         monospace maju kira-kira 0,6 x ukuran, jadi 25px ~ 15 satuan, dekat
         dengan SW=16. Kolom 3/14/28 lalu jatuh di tempatnya sendiri. */
      const t = mkn('text', { class: 'a-status', x: (kolom - 1) * SW,
                              y: 3 * SH + SH * 0.8, 'xml:space': 'preserve' });
      t.textContent = s;
      gTeks.append(t);
    });

    if (besar) {
      [besar[0], besar[1]].forEach((s, i) => {
        if (!s) return;
        const t = mkn('text', { class: 'a-besar', x: KOL * SW / 2, y: (9 + i * 2) * SH,
                                'text-anchor': 'middle' });
        t.textContent = s;
        gTeks.append(t);
      });
    }
  }

  function gambarGlif() {
    sembunyikan(svg, true);
    sembunyikan($('glif'), false);
    const baris = [];
    for (let y = 1; y <= BARIS; y++) {
      let s = '';
      for (let x = 1; x <= KOL; x++) {
        let k = at(y, x);
        if (y === Y && x === 2) s += '>■→';
        else if (y === Y && x >= 2 && x <= 4) continue;
        else if (mus.some(m => m.r !== 1 && m.y === y && m.x === x)) s += '←';
        else if (B === 1 && y === BY && x === 3) s += '●';
        else s += String.fromCharCode(k);
      }
      baris.push(s);
    }
    $('glif').textContent = baris.join('\n');
  }

  /* --- kendali ------------------------------------------------------------ */
  kb.on('*', (e) => {
    if (!main) return;
    const k = e.key;
    if (k === '8' || k === 'ArrowUp') { if (Y5 !== 1) { Y1 = -1; papan(); } }        // 710
    else if (k === '2' || k === 'ArrowDown') { if (Y5 !== 1) { Y1 = 1; papan(); } }  // 720
    else if (k === '5' || k === ' ') { if (Y5 !== 1) { Y1 = 0; papan(); } }          // 730
    else if (k === '4' || k === 'ArrowLeft') jatuhkanBom();                          // 780
    else if (k === '6' || k === 'ArrowRight') tembakLaser();                         // 790
  });

  function buatGelung() {
    gelung.stop();
    gelung = loop({ hz: hz, update: () => { if (main) langkah(); } });
  }

  function mulai(lanjutan) {
    /* 500-510: benih dari jam. Cacatnya dipertahankan — lihat kepala berkas.
       Nilai yang dipakai ditampilkan di papan angka supaya bisa diperiksa. */
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const benih = parseInt(hh + ss, 10);            // VAL berhenti di titik dua
    acak = rng(benih);
    $('s-benih').textContent = benih;

    if (!lanjutan) { sc = 0; bd = 35; sf = 60; }    // 520
    besar = null;
    $('lanjut').hidden = true;
    ronde();
    main = true;
    pesan('');
    $('mulai').disabled = true;
    kb.captureScroll(true);
    buatGelung();
    gelung.start();
  }

  /* --- pasang ------------------------------------------------------------- */
  $('topbar-host').append(ui.topbar({
    title: 'Attack', source: 'ATTACK.BAS · 7 Okt 1982 · MOD-5-5-M'
  }));

  $('mulai').addEventListener('click', () => mulai(false));
  $('lanjut').addEventListener('click', () => mulai(true));     // 1799: GOTO 540
  $('mode').addEventListener('click', () => {
    mode1982 = !mode1982;
    $('mode').setAttribute('aria-pressed', String(mode1982));
    $('mode').textContent = mode1982 ? 'Mode modern' : 'Mode 1982';
    gambar();
  });
  $('hz').addEventListener('input', (e) => {
    hz = +e.target.value;
    $('hzv').textContent = hz + '/dtk';
    if (main) { buatGelung(); gelung.start(); }
  });
  [['b-atas', () => { if (main && Y5 !== 1) { Y1 = -1; papan(); } }],
   ['b-bawah', () => { if (main && Y5 !== 1) { Y1 = 1; papan(); } }],
   ['b-diam', () => { if (main && Y5 !== 1) { Y1 = 0; papan(); } }],
   ['b-bom', () => { if (main) jatuhkanBom(); }],
   ['b-laser', () => { if (main) tembakLaser(); }]
  ].forEach(([id, fn]) => $(id).addEventListener('click', fn));

  $('hzv').textContent = hz + '/dtk';

  /* Angka bukti dihitung dari lanskapnya sendiri, bukan diketik. */
  (function bukti() {
    const cacah = {};
    for (const k of A) cacah[k] = (cacah[k] || 0) + 1;
    $('b-panjang').textContent = A.length;
    $('b-pabrik').textContent = (cacah[210] || 0) + (cacah[193] || 0);
    $('b-bangunan').textContent = Object.keys(cacah)
      .filter(k => +k >= 169 && +k !== 210 && +k !== 193 && +k !== 196)
      .reduce((n, k) => n + cacah[k], 0);
    $('b-medan').textContent = (cacah[95] || 0) + (cacah[47] || 0) + (cacah[92] || 0);
  })();

  ronde();
  gambar();
  papan();
  pesan('Tekan Mulai. 8/2 naik-turun, 5 berhenti, 4 jatuhkan bom, 6 tembak laser.');
})();
