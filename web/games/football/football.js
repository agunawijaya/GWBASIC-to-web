/* ===========================================================================
   football.js — port FOOTBALL.BAS ("Head Coach", Friendlyware, 29 Jul 1982)

   Empat hal yang membentuk berkas ini:

   1. SATU TABEL DIPAKAI DUA ARAH. `YRD(RW, POSI)` dibaca baik ketika Anda
      menyerang maupun ketika Anda bertahan, dan kode 98/99 di dalamnya
      BERTUKAR ARTI: 99 berarti "I Intercepted" waktu Anda memegang bola,
      "You Intercepted" waktu tidak. Akibatnya nomor formasi bertahan yang
      Anda pilih justru MEMILIH kolom hasil bagi serangan komputer.

   2. INDEKSNYA MELESET DI KEDUA UJUNG. `RW = FIX(RND*10)` menghasilkan
      0..9, tapi baris 590 mengisi baris 1..10. Jadi baris 0 tidak pernah
      diisi (selalu nol) dan baris 10 tidak pernah dipakai.

   3. SELURUH DATA KEDUA MATI. Baris 590 membaca 50 angka; baris 3020 sudah
      berisi 50. Baris 3030 -- yang bedanya hanya SATU angka -- tidak pernah
      tersentuh.

   4. HASIL TIAP PERMAINAN DITENTUKAN DETIK JAM. Baris 1750-1790 menyemai
      ulang RND dari `RIGHT$(TIME$,2)` SEBELUM SETIAP PERMAINAN, jadi hanya
      ada 60 hasil yang mungkin, dan dua permainan dalam detik yang sama
      memberi hasil yang sama persis.
   =========================================================================== */
(function () {
  'use strict';

  const D = window.RETRO.FOOTBALL;
  const ui = window.RETRO.ui;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('football');
  const scene = window.RETRO.FOOTBALLSCENE;   /* penyajian saja — lihat football-scene.js */
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const q = (id) => document.getElementById(id);

  /* ======================================================================
     Bagian 1 — tabel, dibangun persis seperti baris 590
     ====================================================================== */
  const YRD = [];                                  /* YRD[i][j], i 0..10 */
  for (let i = 0; i <= 10; i++) YRD.push([0, 0, 0, 0, 0, 0, 0, 0]);
  (function isiTabel() {
    let k = 0;
    for (let i = 1; i <= 10; i++)
      for (let j = 1; j <= 5; j++) YRD[i][j] = D.DATA1[k++];
  })();

  /* ======================================================================
     Bagian 2 — keadaan (nama dari aslinya)
     ====================================================================== */
  let VSR = 0, HSR = 0;          /* skor Anda (visitor), skor komputer (home) */
  let DN = 1, YDS = 10, QTR = 1, PLS = 0;
  let OPS = 55, NPS = 55, YLN = 0, RW = 0, POSI = 0;
  let giliran = 'komputer';      /* siapa yang memegang bola  */
  let selesai = false, benih = 1982, rnd = null, mengunci = false;
  let jamPalsu = 0;              /* pengganti RIGHT$(TIME$,2) */
  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };

  /* Baris 1750-1790, dengan satu penyesuaian yang dijelaskan di panel:
     aslinya menyemai dari detik jam dinding. Di sini "detik"-nya diundi
     dari benih yang bisa Anda tulis, supaya pertandingan bisa diulang --
     tapi sifatnya dipertahankan: SATU angka 0..59 memilih seluruh hasil. */
  function undiRW() {
    jamPalsu = Math.floor(rnd() * 60);             /* padanan RIGHT$(TIME$,2) */
    RW = rwDariDetik(jamPalsu);
    return RW;
  }
  /* RANDOMIZE(N) lalu RND: satu detik -> satu RW. Pemetaannya tetap. */
  const rwDariDetik = (n) => {
    const r = window.RETRO.rng(n * 2654435761 + 1);
    return Math.floor(r.next() * 10);
  };

  const nilai = () => YRD[RW][POSI] || 0;

  /* Baris 2780-2800 */
  function hitungYLN() {
    YLN = (NPS - 15) * 2;
    if (YLN > 50) YLN = 100 - YLN;
    return YLN;
  }
  const majuKanan = () => (QTR === 1 || QTR === 3);
  /* Jarak ke garis gol yang DITUJU penyerang, dalam yard. Batas skor di
     baris 1540-1570 adalah kolom 64 dan 16, dan satu kolom dua yard. */
  const golYard = (anda) =>
    Math.abs(((anda === majuKanan()) ? 64 : 16) - OPS) * 2;

  /* ======================================================================
     Bagian 3 — lapangan
     ====================================================================== */
  const svg = q('svg');
  const gL = mkn('g', {});
  svg.append(gL);
  const LW = 820, LH = 250;
  /* Aslinya lapangan adalah kolom layar. Baris 2780 memberi rumusnya:
         YLN = (NPS-15)*2,  dan  IF YLN>50 THEN YLN=100-YLN
     jadi SATU kolom = DUA yard, garis gol ada di kolom 16 dan 64, dan
     kolom 15/65 adalah garis nol di kedua ujung. Semua angka di lapangan
     ini dihitung dari rumus itu, bukan dibagi rata. */
  const YLNkol = (c) => { const y = (c - 15) * 2; return y > 50 ? 100 - y : y; };
  const KOL = (c) => 22 + (c - 13) * (776 / 54);  /* tampilkan kolom 13..67 */

  function gambar(pesan) {
    gL.textContent = '';
    gL.append(mkn('rect', { class: 'f-latar', x: 0, y: 0, width: LW, height: LH }));
    /* Endzone: batas skor di baris 1540-1570 adalah NPS>64 dan NPS<16,
       jadi garis golnya persis di kolom 16 dan 64. */
    gL.append(mkn('rect', { class: 'f-ez f-ez--kiri', x: KOL(13), y: 40,
      width: KOL(16) - KOL(13), height: 150 }));
    gL.append(mkn('rect', { class: 'f-ez f-ez--kanan', x: KOL(64), y: 40,
      width: KOL(67) - KOL(64), height: 150 }));
    gL.append(mkn('rect', { class: 'f-rumput', x: KOL(16), y: 40,
      width: KOL(64) - KOL(16), height: 150 }));
    for (let c = 16; c <= 64; c += 2.5) {
      const t = (c - 16) % 5 === 0;
      gL.append(mkn('line', { class: 'f-garis' + (t ? ' f-garis--tebal' : ''),
        x1: KOL(c), y1: 40, x2: KOL(c), y2: 190 }));
    }
    [16, 64].forEach(c => gL.append(mkn('line', { class: 'f-gol',
      x1: KOL(c), y1: 40, x2: KOL(c), y2: 190 })));
    for (let c = 20; c <= 60; c += 5) {
      const t = mkn('text', { class: 'f-angka', x: KOL(c), y: 208 });
      t.textContent = YLNkol(c); gL.append(t);
    }
    [[13.5, 'GOAL'], [64.5, 'GOAL']].forEach(([c, s2]) => {
      const t = mkn('text', { class: 'f-golTeks', x: KOL(c) + 14, y: 208 });
      t.textContent = s2; gL.append(t);
    });
    /* garis pertama-turun: 10 yard = 5 kolom dari OPS ke arah serangan */
    const arah = (giliran === 'anda') === majuKanan() ? 1 : -1;
    const gol = OPS + arah * (YDS / 2);
    if (gol > 20 && gol < 60)
      gL.append(mkn('line', { class: 'f-first', x1: KOL(gol), y1: 40,
        x2: KOL(gol), y2: 190 }));
    /* bola */
    gL.append(mkn('ellipse', { class: 'f-bola', cx: KOL(OPS), cy: 115, rx: 13, ry: 8 }));
    gL.append(mkn('path', { class: 'f-jahit',
      d: 'M' + (KOL(OPS) - 6) + ' 115 L' + (KOL(OPS) + 6) + ' 115' }));
    /* panah arah serangan */
    const ax = KOL(OPS) + arah * 34;
    gL.append(mkn('path', { class: 'f-panah',
      d: 'M' + ax + ' 115 l' + (arah * 18) + ' -7 v14 z' }));
    const nm = mkn('text', { class: 'f-pemilik', x: KOL(OPS), y: 90 });
    nm.textContent = giliran === 'anda' ? 'BOLA ANDA' : 'BOLA SAYA';
    gL.append(nm);
    if (pesan) {
      const p = mkn('text', { class: 'f-pesan', x: LW / 2, y: 27 });
      p.textContent = pesan; gL.append(p);
    }
    const inf = mkn('text', { class: 'f-info', x: 14, y: 236 });
    inf.textContent = 'QTR ' + QTR + '   DOWN ' + DN + '   YARDS TO GO ' + YDS +
      '   ON THE ' + hitungYLN() + '   PLAY ' + PLS + '/30';
    gL.append(inf);
  }

  /* ======================================================================
     Bagian 4 — panel
     ====================================================================== */
  const panel = q('panel');
  function tanya(judul, isi, catatan) {
    panel.textContent = '';
    if (judul) {
      const h = document.createElement('p');
      h.className = 'f-tanya'; h.innerHTML = judul; panel.append(h);
    }
    const row = document.createElement('div');
    row.className = 'f-row';
    isi.forEach(n => row.append(n));
    panel.append(row);
    if (catatan) {
      const p = document.createElement('p');
      p.className = 'f-catatan'; p.innerHTML = catatan; panel.append(p);
    }
  }
  const tombol = (t, fn, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn ' + (k || 'btn--ghost btn--sm');
    b.textContent = t; b.addEventListener('click', fn); return b;
  };
  function tulis(s, kelas) {
    const p = document.createElement('p');
    p.className = 'f-baris' + (kelas ? ' f-' + kelas : '');
    p.textContent = s;
    q('log').append(p); q('log').scrollTop = q('log').scrollHeight;
  }

  /* ======================================================================
     Bagian 5 — alur
     ====================================================================== */
  function mulai() {
    if (mengunci) return;
    rnd = acak(benih);
    /* Aliran acak hiasan DIPISAH dari aliran permainan: kalau pemilihan
       penerima operan mengambil dari `rnd`, hasil pertandingan akan
       bergeser hanya karena animasinya dinyalakan. */
    if (scene) scene.benih(benih);
    VSR = 0; HSR = 0; DN = 1; YDS = 10; QTR = 1; PLS = 0; selesai = false;
    q('log').textContent = '';
    tulis('H E A D   C O A C H', 'judul');
    tanya('Would You Like To Kick Or Receive? <span class="f-kecil">(baris 600)</span>', [
      tombol('Kick', () => { OPS = 55; NPS = 55; giliran = 'komputer'; bertahan(); }, 'btn--primary btn--sm'),
      tombol('Receive', () => { OPS = 25; NPS = 25; giliran = 'anda'; menyerang(); }, 'btn--primary btn--sm')
    ], 'Pilihan ini menetapkan posisi awal: <b>kolom 55</b> kalau menendang, ' +
       '<b>kolom 25</b> kalau menerima (baris 680&ndash;690).');
    gambar('KICKOFF');
    perbaruiHud();
  }

  /* Baris 720-1180: giliran komputer menyerang, Anda memilih formasi. */
  function bertahan() {
    if (selesai) return;
    giliran = 'komputer'; DN = 1; YDS = 10;
    gambar(null); perbaruiHud();
    if (scene && q('animasi').checked) scene.siap({ andaMenyerang: false, down: DN, togo: YDS,
      keGol: golYard(false) });
    const b = D.BERTAHAN.map((n, i) =>
      tombol((i + 1) + ' · ' + n, () => jalankan(i + 1, false)));
    b.push(tombol('0 · (tidak ada)', () => jalankan(0, false), 'btn--ghost btn--sm f-nol'));
    tanya('It\'s My Ball On The ' + hitungYLN() +
      ' Yard Line. <span class="f-kecil">Select A Defensive Formation.</span>', b,
      'Nomor yang Anda tekan menjadi <code>POSI</code>, dan <code>POSI</code> ' +
      'adalah <b>kolom</b> di tabel hasil &mdash; tabel yang sama yang dipakai ' +
      'waktu Anda menyerang. Jadi formasi bertahan Anda ikut memilih hasil ' +
      'apa yang mungkin didapat komputer. Lihat tabelnya di panel sebelah. ' +
      'Tombol <b>0</b> diterima aslinya (baris 850 hanya menolak di luar 0&ndash;5) ' +
      'dan selalu memberi nol yard.');
  }

  /* Baris 1190-1650: Anda menyerang. */
  function menyerang() {
    if (selesai) return;
    giliran = 'anda'; DN = 1; YDS = 10;
    gambar(null); perbaruiHud();
    if (scene && q('animasi').checked) scene.siap({ andaMenyerang: true, down: DN, togo: YDS,
      keGol: golYard(true) });
    const b = D.SERANG.map((n, i) =>
      tombol((i + 1) + ' · ' + n, () => jalankan(i + 1, true)));
    b.push(tombol('0 · (tidak ada)', () => jalankan(0, true), 'btn--ghost btn--sm f-nol'));
    tanya('It\'s Your Ball On The ' + hitungYLN() +
      ' Yard Line. <span class="f-kecil">Select An Offensive Play.</span>', b,
      'Nomor 6 dan 7 (field goal dan punt) dicabang sebelum tabel dibaca ' +
      '(baris 1440&ndash;1450), jadi hanya 1&ndash;5 yang benar-benar ' +
      'menengok <code>YRD</code>.');
  }

  /* Satu permainan, mengikuti urutan aslinya. */
  async function jalankan(pilihan, anda) {
    if (mengunci || selesai) return;
    POSI = pilihan;
    undiRW();                                      /* GOSUB 1750 */
    PLS += 1;

    if (PLS > 30 && QTR === 4) return akhir();
    if (PLS > 30 && QTR === 2) {                   /* baris 950/1420 */
      QTR += 1; PLS = 1;
      tulis('End Of The Half — quarter ' + QTR, 'judul');
      OPS = 55; NPS = 55; giliran = 'komputer';
      return bertahan();
    }
    if (PLS > 30) {                                /* baris 960/1430 */
      QTR += 1; PLS = 0;
      NPS = 80 - OPS; OPS = NPS;                   /* baris 2900: tukar sisi */
      tulis('End Of The Quarter — quarter ' + QTR + ', sisi ditukar', 'judul');
      return anda ? menyerang() : bertahan();
    }

    if (!anda) {
      /* Baris 970-990: komputer memutuskan sendiri di 4th down. */
      if (DN > 3 && ((majuKanan() && NPS < 35) || (!majuKanan() && NPS > 45)))
        { await adegan({ andaMenyerang: false, jenis: 'fg', keGol: golYard(false), down: DN, togo: YDS,
              teks: 'FIELD GOAL' }); return fieldGoalKomputer(); }
      if (DN > 3) { await adegan({ andaMenyerang: false, jenis: 'punt',
            keGol: golYard(false), down: DN, togo: YDS, teks: 'PUNT' }); return punt(false); }
    } else {
      if (POSI === 7) { await adegan({ andaMenyerang: true, jenis: 'punt',
            keGol: golYard(true), down: DN, togo: YDS, teks: 'PUNT' }); return punt(true); }
      if (POSI === 6) { await adegan({ andaMenyerang: true, jenis: 'fg',
            keGol: golYard(true), down: DN, togo: YDS, teks: 'FIELD GOAL' }); return fieldGoalAnda(); }
    }

    const v = nilai();

    /* ---- perhitungan selesai; sisanya gambar ------------------------- */
    const lari = (POSI === 1 || POSI === 2);
    const hasil = v === 99 ? 'intersep' : v === 98 ? 'fumble' : v === 0 ? 'nol' : 'gain';
    const keGol = golYard(anda);
    await adegan({
      keGol: keGol,
      andaMenyerang: anda, jenis: lari ? 'lari' : 'operan', yard: v === 99 || v === 98 ? 6 : v,
      hasil: hasil, down: DN, togo: YDS,
      teks: hasil === 'intersep' ? (anda ? 'INTERCEPTED' : 'YOU INTERCEPTED')
          : hasil === 'fumble' ? 'FUMBLE'
          : v === 0 ? (lari ? 'NO GAIN' : 'INCOMPLETE')
          : (v > 0 ? '+' + v + ' YARDS' : v + ' YARDS'),
      kelas: (hasil === 'gain' && v > 0) === anda ? 'e-baik2' : 'e-bahaya2'
    });

    if (v === 99) return anda ? intersepKomputer() : intersepAnda();
    if (v === 98) return anda ? fumbleAnda() : fumbleKomputer();
    if (v === 100) return touchdown(anda);         /* tidak pernah terjadi */

    YDS -= v;
    if (YDS <= 0) { DN = 1; YDS = 10; } else DN += 1;
    const arah = (anda === majuKanan()) ? 1 : -1;
    NPS = OPS + arah * (v / 2);

    if (anda) {
      if (NPS > 64 && majuKanan()) return touchdown(true);
      if (NPS > 64 && !majuKanan()) return safety(true);
      if (NPS < 16 && !majuKanan()) return touchdown(true);
      if (NPS < 16 && majuKanan()) return safety(true);
      if (DN > 4) {                                /* baris 1580-1590 */
        OPS = NPS;
        tulis('Ball Turned Over On 4th Down');
        bunyi('T160L16O2C');
        return bertahan();
      }
    } else {
      if (NPS < 16 && majuKanan()) return touchdown(false);
      if (NPS < 16 && !majuKanan()) return safety(false);
      if (NPS > 64 && !majuKanan()) return touchdown(false);
      if (NPS > 64 && majuKanan()) return safety(false);
    }
    OPS = NPS;
    laporGain(v, anda);
    gambar(null); perbaruiHud();
    lanjutkan(anda);
  }

  /* Pembungkus tunggal ke lapisan gambar. Semua yang perlu diketahui
     football-scene.js sudah dihitung; ia tidak pernah menyentuh `rnd`. */
  async function adegan(o) {
    /* Kuncinya dipasang SEBELUM cabang, bukan sesudah. `jalankan` sekarang
       async, jadi ada celah antara satu klik dan kelanjutannya bahkan ketika
       animasinya mati -- dan tanpa kunci di celah itu, klik kedua masuk ke
       permainan yang belum selesai dan hasilnya tertelan. */
    mengunci = true;
    if (scene && q('animasi').checked) {
      panel.textContent = '';
      o.bunyi = q('bunyi').checked;
      try { await scene.main(o); } catch (e) {}
    }
    mengunci = false;
  }

  /* Baris 2810-2860 */
  function laporGain(v, anda) {
    const lari = (POSI === 1 || POSI === 2);
    let s;
    if (v === 0) s = lari ? 'No Gain On The Play' : 'Incomplete Pass';
    else if (v > 0) s = lari ? 'Gain Of ' + v + ' On The Play'
                             : 'Pass Completed For ' + v + ' Yards';
    else s = lari ? 'Loss Of ' + Math.abs(v) + ' On The Play'
                  : 'Quarterback Sacked: Loss Of ' + Math.abs(v);
    tulis((anda ? 'Anda — ' : 'Saya — ') + s + '   [detik ' + jamPalsu +
          ' → baris ' + RW + ', kolom ' + POSI + ']', v > 0 ? 'baik' : v < 0 ? 'awas' : null);
  }

  function lanjutkan(anda) {
    if (selesai) return;
    if (anda) menyerangLagi(); else bertahanLagi();
  }
  /* Lanjutan tanpa mereset DOWN — aslinya kembali ke 1260 / 790. */
  function menyerangLagi() {
    gambar(null); perbaruiHud();
    const b = D.SERANG.map((n, i) => tombol((i + 1) + ' · ' + n, () => jalankan(i + 1, true)));
    b.push(tombol('0 · (tidak ada)', () => jalankan(0, true), 'btn--ghost btn--sm f-nol'));
    tanya('Down ' + DN + ', ' + YDS + ' to go. <span class="f-kecil">' +
          'Select An Offensive Play.</span>', b);
  }
  function bertahanLagi() {
    gambar(null); perbaruiHud();
    const b = D.BERTAHAN.map((n, i) => tombol((i + 1) + ' · ' + n, () => jalankan(i + 1, false)));
    b.push(tombol('0 · (tidak ada)', () => jalankan(0, false), 'btn--ghost btn--sm f-nol'));
    tanya('Down ' + DN + ', ' + YDS + ' to go. <span class="f-kecil">' +
          'Select A Defensive Formation.</span>', b);
  }

  /* --- kejadian ------------------------------------------------------- */
  function bunyi(m) { if (q('bunyi').checked) try { audio.play(m); } catch (e) {} }

  function touchdown(anda) {                       /* 2120 / 2250 */
    DN = 1; YDS = 10;
    if (anda) { VSR += 7; } else { HSR += 7; }
    NPS = majuKanan() ? (anda ? 55 : 25) : (anda ? 25 : 55);
    OPS = NPS;
    tulis('!!!!  TOUCHDOWN  !!!!  ' + (anda ? 'Anda' : 'Saya') + ' +7', 'besar');
    bunyi('T220L4O3EDEFFE');
    gambar('TOUCHDOWN'); perbaruiHud();
    return anda ? bertahan() : menyerang();
  }
  function safety(anda) {                          /* 2070 / 2200 */
    DN = 1; YDS = 10;
    /* Safety diberikan kepada LAWAN dari yang memegang bola. */
    if (anda) { HSR += 2; } else { VSR += 2; }
    NPS = majuKanan() ? (anda ? 55 : 25) : (anda ? 25 : 55);
    OPS = NPS;
    tulis('!!!!   Safety    !!!!  ' + (anda ? 'Saya' : 'Anda') + ' +2', 'bahaya');
    bunyi('T120L16O2CG');
    gambar('SAFETY'); perbaruiHud();
    return anda ? bertahan() : menyerang();
  }
  function intersepKomputer() {                    /* 1900 */
    DN = 1; YDS = 10;
    NPS = OPS + (majuKanan() ? 5 : -5);
    if (majuKanan() && NPS > 64) NPS = 55;
    if (!majuKanan() && NPS < 16) NPS = 25;
    OPS = NPS;
    tulis('!!!! I Intercepted !!!!', 'bahaya');
    bunyi('T120L16O2C'); return bertahan();
  }
  function intersepAnda() {                        /* 1970 */
    DN = 1; YDS = 10;
    NPS = OPS + (majuKanan() ? -5 : 5);
    if (majuKanan() && NPS < 16) NPS = 25;
    if (!majuKanan() && NPS > 64) NPS = 55;
    OPS = NPS;
    tulis('!!! You Intercepted !!!', 'baik');
    bunyi('T180L16O5CG'); return menyerang();
  }
  function fumbleAnda() {                          /* 2040 */
    DN = 1; YDS = 10;
    tulis('!!!! Sorry, You Fumbled !!!!', 'bahaya');
    bunyi('T120L16O2C'); return bertahan();
  }
  function fumbleKomputer() {                      /* 2170 */
    DN = 1; YDS = 10;
    tulis('!!!! Oops , I Fumbled !!!!', 'baik');
    bunyi('T180L16O5C'); return menyerang();
  }
  function punt(anda) {                            /* 2300 / 2370 */
    DN = 1; YDS = 10;
    const arah = (anda === majuKanan()) ? 1 : -1;
    NPS = OPS + arah * 20;
    if (NPS > 64) NPS = 55;
    if (NPS < 16) NPS = 25;
    OPS = NPS;
    tulis('!!!!  Good Punt  !!!!  ' + (anda ? 'Anda' : 'Saya') + ' menendang');
    bunyi('T200L32O4CO3GEC');
    gambar('PUNT'); perbaruiHud();
    return anda ? bertahan() : menyerang();
  }

  /* Baris 2440-2610: field goal Anda. EMPAT tingkat -- dan baris 2540
     memakai `NPS>35` di tengah blok yang seluruhnya memakai `NPS<`. */
  function fieldGoalAnda() {
    let baik = false, barisSalah = false;
    if (majuKanan()) {
      baik = (NPS > 25 && RW < 9) || (NPS > 30 && RW < 7) ||
             (NPS > 35 && RW < 5) || (NPS > 38 && RW < 4);
    } else {
      const a = (NPS < 25 && RW < 9), b = (NPS < 30 && RW < 7);
      const c = (NPS > 35 && RW < 5);               /* 2540 — apa adanya */
      const d = (NPS < 38 && RW < 4);
      baik = a || b || c || d;
      barisSalah = c && !(a || b || d);
    }
    DN = 1; YDS = 10;
    if (baik) {
      VSR += 3;
      tulis('!!!!  Field Goal Was Good  !!!!  Anda +3' +
            (barisSalah ? '   ← lolos lewat baris 2540 yang tandanya terbalik' : ''),
            'besar');
      bunyi('T220L4O3EDE');
      NPS = majuKanan() ? 55 : 25; OPS = NPS;
    } else {
      tulis('!!!!  Field Goal Try Wide  !!!!');
      bunyi('T120L16O2C');
      if (majuKanan() && NPS > 55) { NPS = 55; OPS = 55; }
      if (!majuKanan() && NPS < 25) { NPS = 25; OPS = 25; }
    }
    gambar('FIELD GOAL'); perbaruiHud();
    return bertahan();
  }

  /* Baris 2620-2770: field goal komputer. Hanya TIGA tingkat, dan baris
     2710 memakai `NPS<45` di tengah blok yang seluruhnya memakai `NPS>`. */
  function fieldGoalKomputer() {
    let baik = false, barisSalah = false;
    if (majuKanan()) {
      baik = (NPS < 25 && RW < 9) || (NPS < 30 && RW < 7) || (NPS < 35 && RW < 5);
    } else {
      const a = (NPS > 55 && RW < 9), b = (NPS > 50 && RW < 7);
      const c = (NPS < 45 && RW < 5);               /* 2710 — apa adanya */
      baik = a || b || c;
      barisSalah = c && !(a || b);
    }
    DN = 1; YDS = 10;
    if (baik) {
      HSR += 3;
      tulis('!!!!  Field Goal Was Good  !!!!  Saya +3' +
            (barisSalah ? '   ← lolos lewat baris 2710 yang tandanya terbalik' : ''),
            'bahaya');
      bunyi('T220L4O3EDE');
      NPS = majuKanan() ? 25 : 55; OPS = NPS;
    } else {
      tulis('!!!!  Field Goal Try Wide  !!!!');
      if (majuKanan() && NPS < 25) { NPS = 25; OPS = 25; }
      if (!majuKanan() && NPS > 55) { NPS = 55; OPS = 55; }
    }
    gambar('FIELD GOAL'); perbaruiHud();
    return menyerang();
  }

  /* Baris 2920-2950 */
  function akhir() {
    selesai = true;
    let s;
    if (HSR > VSR) s = 'You Lost By A Score Of ' + HSR + ' To ' + VSR;
    else if (VSR > HSR) s = 'You Won By A Score Of ' + VSR + ' To ' + HSR;
    else s = 'Seri ' + VSR + ' — ' + HSR +
             ' (aslinya tidak mencetak apa pun untuk hasil ini)';
    tulis('Time Is Up; The Game Is Over', 'judul');
    tulis(s, VSR > HSR ? 'besar' : 'bahaya');
    gambar('GAME OVER'); perbaruiHud();
    const r = store.get('rekor');
    if (typeof r !== 'number' || VSR > r) store.set('rekor', VSR);
    tanya('<b>' + s + '</b>', [tombol('Main lagi', mulai, 'btn--primary btn--sm')],
      VSR === HSR ? 'Baris 2940 dan 2950 keduanya memakai <code>&gt;</code>, ' +
        'jadi kalau skornya sama <b>tidak ada kalimat apa pun yang dicetak</b> ' +
        '&mdash; layar hanya bertanya mau main lagi atau tidak.' : '');
  }

  /* ======================================================================
     Bagian 6 — papan angka
     ====================================================================== */
  function perbaruiHud() {
    q('s-qtr').textContent = Math.min(4, QTR);
    q('s-anda').textContent = VSR;
    q('s-saya').textContent = HSR;
    q('s-down').textContent = DN + ' & ' + YDS;
    q('s-yln').textContent = hitungYLN();
    q('s-play').textContent = PLS + ' / 30';
    q('s-benih').textContent = benih;
    const r = store.get('rekor');
    q('s-rekor').textContent = (typeof r === 'number') ? r : '—';
  }

  /* ======================================================================
     Bagian 7 — bukti, dihitung dari tabelnya sendiri
     ====================================================================== */
  (function bukti() {
    /* Tabel hasil, terbuka. Aslinya tidak pernah memperlihatkannya. */
    let h = '<tr><th>RW</th>' + D.BERTAHAN.map((n, i) =>
      '<th>' + (i + 1) + '</th>').join('') + '</tr>';
    for (let i = 0; i <= 10; i++) {
      const mati = (i === 0) ? ' f-mati' : (i === 10) ? ' f-mati' : '';
      h += '<tr class="' + mati + '"><td>' + i +
        (i === 0 ? ' <span class="f-kecil">tak terisi</span>' :
         i === 10 ? ' <span class="f-kecil">tak terpakai</span>' : '') + '</td>';
      for (let j = 1; j <= 5; j++) {
        const v = YRD[i][j];
        const k = v === 99 ? 'f-int' : v === 98 ? 'f-fum' : v < 0 ? 'f-neg' :
                  v >= 30 ? 'f-besar2' : '';
        h += '<td class="' + k + '">' + (v === 99 ? '99' : v === 98 ? '98' : v) + '</td>';
      }
      h += '</tr>';
    }
    q('b-tabel').innerHTML = h;

    /* Peluang tiap kolom, dihitung dari sepuluh baris yang benar-benar dipakai. */
    let t = '';
    for (let j = 1; j <= 5; j++) {
      let jum = 0, n = 0, int_ = 0, fum = 0, maks = -99;
      for (let i = 0; i <= 9; i++) {
        const v = YRD[i][j];
        if (v === 99) int_++; else if (v === 98) fum++;
        else { jum += v; n++; if (v > maks) maks = v; }
      }
      t += '<tr><td>' + j + ' — ' + D.SERANG[j - 1] + '<br><span class="f-kecil">' +
        D.BERTAHAN[j - 1] + '</span></td><td>' + (jum / 10).toFixed(1) +
        '</td><td>' + maks + '</td><td>' + (int_ * 10) + ' %</td><td>' +
        (fum * 10) + ' %</td></tr>';
    }
    q('b-peluang').innerHTML = t;

    /* Data 3030 vs 3020 */
    const beda = [];
    D.DATA1.forEach((v, i) => { if (D.DATA2[i] !== v) beda.push([i, v, D.DATA2[i]]); });
    q('b-beda').innerHTML = beda.length
      ? beda.map(b => '<li>angka ke-' + (b[0] + 1) + ' — baris <code>3020</code> berisi <b>' +
          b[1] + '</b>, baris <code>3030</code> berisi <b>' + b[2] + '</b> (baris ' +
          (Math.floor(b[0] / 5) + 1) + ' kolom ' + (b[0] % 5 + 1) + ')</li>').join('')
      : '<li>tidak ada</li>';

    /* Kode 100 tidak pernah muncul di data */
    q('b-seratus').textContent = D.DATA1.indexOf(100) < 0 && D.DATA2.indexOf(100) < 0
      ? 'tidak ada satu pun' : 'ada';

    /* 60 detik -> berapa RW yang berbeda? */
    const rekap = {};
    for (let s = 0; s < 60; s++) { const w = rwDariDetik(s); rekap[w] = (rekap[w] || 0) + 1; }
    q('b-detik').textContent = Object.keys(rekap).length + ' nilai RW berbeda dari 60 detik';
  })();

  /* ======================================================================
     Bagian 8 — pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'Head Coach', source: 'FOOTBALL.BAS · Friendlyware · 29 Jul 1982'
  }));
  if (scene) scene.pasang(q('svg2'));
  q('mulai').addEventListener('click', mulai);
  q('benih').addEventListener('change', e => {
    benih = parseInt(e.currentTarget.value, 10) || 0; perbaruiHud();
  });

  mulai();
})();
