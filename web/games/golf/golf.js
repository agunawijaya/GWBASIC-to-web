/* ===========================================================================
   golf.js — port GOLF.BAS (A. Vanchura, 17 Juli 1982)

   Penulis dan tanggal yang sama dengan WILDCAT, dan dua berkas itu memang
   bersaudara: keduanya menyimpan seluruh dunianya di `DATA` dan membiarkan
   satu rumus melakukan semua pekerjaan.

   Tiga hal yang membentuk berkas ini:

   1. SATU RUMUS MENENTUKAN JARAK PUKULAN, dan handicap masuk ke dalamnya
      tiga kali (baris 530-540). Jarak terjauh yang mungkin bagi siapa pun
      adalah 311 yard -- dan lapangan ketiga punya par 3 sepanjang 312 yard.

   2. KETIGA LAPANGAN ADALAH SATU DAFTAR 54 LUBANG yang dipotong tiga
      (baris 1290 melewati (C-1)*126 angka). Ketiganya par 72 dengan susunan
      par yang persis sama; yang berbeda hanya panjangnya.

   3. BOLA MASUK AIR DIKENAI TIGA PUKULAN, diumumkan sebagai satu. Baris
      1390 dan 1420 saling memanggil dan `STK=STK+1` dijalankan tiga kali.
   =========================================================================== */
(function () {
  'use strict';

  const D = window.RETRO.GOLF;
  const ui = window.RETRO.ui;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('golf');
  const scene = window.RETRO.GOLFSCENE;      /* penyajian saja — lihat golf-scene.js */
  let mengunci = false;                      /* selagi animasi berjalan, tombol mati */
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const q = (id) => document.getElementById(id);

  /* ======================================================================
     Bagian 1 — keadaan (nama dari aslinya)
     ====================================================================== */
  let A = 12;          // handicap
  let B = 3;           // jenis kesulitan 0..5
  let C = 1;           // lapangan
  let HOLE = 1, STK = 0, STKS = 0, TOTAL = 0, HP = 0;
  let PAR = 0, YARDS = 0, LEFT = 1, RIGHT = 1, DIFF = 0, LNG = 0, FAC = 0;
  let GRN = 0, OF = 0, DIST = 0, HOLD = 0, B1 = 1, PENALTY = 0;
  let diGreen = false, kartu = [], benih = 1982, rnd = null, selesai = false;
  const RND = () => rnd();
  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };
  const KESULITAN = ['HOOK', 'SLICE', 'POOR DISTANCE', 'PERFECT PLAYER',
                     'SAND TRAP PLAY', 'POOR PUTTING'];

  /* ======================================================================
     Bagian 2 — rumus, baris 530-540 apa adanya
     F = nomor tongkat: 1..4 kayu, 10.5..18.5 besi (F+9.5), 20 pitching wedge
     ====================================================================== */
  const jarakDasar = (a, f) =>
    (30 - a) * 2.5 + 230 - ((30 - a) * 0.25 + 20) * f / 2;

  /* Jarak terjauh yang mungkin bagi handicap a: kayu 1, ayunan penuh,
     ditambah undian RND*20 yang paling murah hati. */
  const jarakMaks = (a) => Math.floor(jarakDasar(a, 1) + 19.999);

  /* ======================================================================
     Bagian 3 — gambar: peta lubang dari atas
     Aslinya hanya mencetak tiga baris angka. Peta ini memperlihatkan angka
     yang SAMA -- jarak tersisa dan simpangan melenceng -- sebagai tempat.
     ====================================================================== */
  const svg = q('svg');
  const gLub = mkn('g', {});
  svg.append(gLub);
  const LW = 820, LH = 300;
  const TEEX = 60, GRNX = 760;

  function gambarLubang(bolaJarak, bolaOf, tampilBola) {
    gLub.textContent = '';
    const skala = (GRNX - TEEX) / Math.max(1, YARDS);
    const sx = (y) => TEEX + y * skala;
    gLub.append(mkn('rect', { class: 'g-latar', x: 0, y: 0, width: LW, height: LH }));
    /* pinggir kiri & kanan: nama medan langsung dari DATA */
    [[LEFT, 0, 54, 'kiri'], [RIGHT, LH - 54, 54, 'kanan']].forEach(([idx, y, h, sisi]) => {
      gLub.append(mkn('rect', { class: 'g-sisi g-sisi--' + idx, x: 0, y: y, width: LW, height: h }));
      /* Label kanan di ATAS pitanya, bukan di bawah: baris keterangan
         lubang duduk di y = LH-12, dan kalau label ini ditaruh di +36 ia
         menabraknya. */
      const t = mkn('text', { class: 'g-sisiNama', x: 12, y: y + (sisi === 'kiri' ? 22 : 18) });
      t.textContent = (sisi === 'kiri' ? 'KIRI: ' : 'KANAN: ') + D.MEDAN[idx - 1].toUpperCase();
      gLub.append(t);
    });
    gLub.append(mkn('rect', { class: 'g-fairway', x: TEEX - 24, y: 54,
      width: GRNX - TEEX + 60, height: LH - 108, rx: 40 }));
    /* green */
    gLub.append(mkn('ellipse', { class: 'g-green', cx: GRNX, cy: LH / 2, rx: 44, ry: 40 }));
    gLub.append(mkn('circle', { class: 'g-lubang', cx: GRNX, cy: LH / 2, r: 4 }));
    gLub.append(mkn('path', { class: 'g-tiang',
      d: 'M' + GRNX + ' ' + (LH / 2) + ' L' + GRNX + ' ' + (LH / 2 - 40) }));
    gLub.append(mkn('path', { class: 'g-bendera',
      d: 'M' + GRNX + ' ' + (LH / 2 - 40) + ' L' + (GRNX + 22) + ' ' + (LH / 2 - 34) +
         ' L' + GRNX + ' ' + (LH / 2 - 28) + ' Z' }));
    /* tee */
    gLub.append(mkn('rect', { class: 'g-tee', x: TEEX - 22, y: LH / 2 - 16,
      width: 26, height: 32, rx: 4 }));
    /* penanda jarak tiap 100 yard */
    for (let y = 100; y < YARDS; y += 100) {
      gLub.append(mkn('line', { class: 'g-tik', x1: sx(y), y1: 60, x2: sx(y), y2: LH - 60 }));
      const t = mkn('text', { class: 'g-tikTeks', x: sx(y), y: 74 });
      t.textContent = y; gLub.append(t);
    }
    /* keterangan lubang */
    const info = mkn('text', { class: 'g-info', x: 14, y: LH - 12 });
    info.textContent = 'HOLE ' + HOLE + '   PAR ' + PAR + '   ' + YARDS + ' YARDS' +
      '   STROKES ' + STK;
    gLub.append(info);
    if (tampilBola) {
      const bx = sx(Math.max(0, YARDS - bolaJarak));
      const by = LH / 2 + Math.max(-108, Math.min(108, bolaOf * 1.6));
      gLub.append(mkn('line', { class: 'g-garisSisa', x1: bx, y1: by, x2: GRNX, y2: LH / 2 }));
      gLub.append(mkn('circle', { class: 'g-bola', cx: bx, cy: by, r: 6 }));
      const t = mkn('text', { class: 'g-bolaTeks', x: bx, y: by - 14 });
      t.textContent = Math.round(bolaJarak) + ' yd ke pin';
      gLub.append(t);
    }
  }

  /* Tampilan putting: satu jalur, bola dan lubang, jarak dalam kaki.
     `sisi` = +1 bola masih kurang, -1 bola sudah melewati lubang. Aslinya
     kehilangan tandanya di baris 1030 (`IF GRN<0 THEN GRN=-GRN`), jadi
     tanda itu dipegang di sini semata-mata supaya bolanya bisa digambar
     menggelinding MELEWATI lubang, bukan meloncat ke sisi yang salah. */
  function gambarGreen(feet, sisi) {
    gLub.textContent = '';
    gLub.append(mkn('rect', { class: 'g-greenLatar', x: 0, y: 0, width: LW, height: LH }));
    gLub.append(mkn('ellipse', { class: 'g-greenBesar', cx: LW / 2, cy: LH / 2,
      rx: 360, ry: 118 }));
    const cx = LW / 2, cy = LH / 2;
    gLub.append(mkn('circle', { class: 'g-lubang', cx: cx, cy: cy, r: 7 }));
    gLub.append(mkn('path', { class: 'g-tiang', d: 'M' + cx + ' ' + cy + ' L' + cx + ' ' + (cy - 70) }));
    gLub.append(mkn('path', { class: 'g-bendera',
      d: 'M' + cx + ' ' + (cy - 70) + ' L' + (cx + 26) + ' ' + (cy - 63) +
         ' L' + cx + ' ' + (cy - 56) + ' Z' }));
    const bx = cx - Math.max(-330, Math.min(330, feet * 8 * (sisi === -1 ? -1 : 1)));
    gLub.append(mkn('circle', { class: 'g-bola', cx: bx, cy: cy, r: 6 }));
    gLub.append(mkn('line', { class: 'g-garisSisa', x1: bx, y1: cy, x2: cx, y2: cy }));
    const t = mkn('text', { class: 'g-bolaTeks', x: (bx + cx) / 2, y: cy - 16 });
    t.textContent = Math.abs(Math.round(feet)) + ' feet';
    gLub.append(t);
    const info = mkn('text', { class: 'g-info', x: 14, y: LH - 12 });
    info.textContent = 'ON THE GREEN   HOLE ' + HOLE + '   PAR ' + PAR + '   STROKES ' + STK;
    gLub.append(info);
  }

  /* ======================================================================
     Bagian 4 — panel
     ====================================================================== */
  const panel = q('panel');
  function tanya(judul, isi, catatan) {
    panel.textContent = '';
    if (judul) {
      const h = document.createElement('p');
      h.className = 'g-tanya'; h.innerHTML = judul; panel.append(h);
    }
    const row = document.createElement('div');
    row.className = 'g-row';
    isi.forEach(n => row.append(n));
    panel.append(row);
    if (catatan) {
      const p = document.createElement('p');
      p.className = 'g-catatan'; p.innerHTML = catatan; panel.append(p);
    }
  }
  const tombol = (t, fn, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn ' + (k || 'btn--ghost btn--sm');
    b.textContent = t; b.addEventListener('click', fn); return b;
  };
  function tulis(s, kelas) {
    const p = document.createElement('p');
    p.className = 'g-baris' + (kelas ? ' g-' + kelas : '');
    p.textContent = s;
    q('log').append(p); q('log').scrollTop = q('log').scrollHeight;
  }

  /* ======================================================================
     Bagian 5 — alur
     ====================================================================== */
  function mulai() {
    if (mengunci) return;
    rnd = acak(benih);
    /* Aliran acak hiasan DIPISAH dari aliran permainan. Kalau pohon di
       pinggir lubang mengambil dari `rnd`, maka jumlah pohon akan menggeser
       hasil pukulan -- pelajaran yang sudah dibayar sekali di TRUCKER. */
    if (scene) scene.benih(benih);
    A = Math.max(0, Math.min(30, Number(q('handicap').value) || 12));
    B = Number(q('kesulitan').value);
    C = Number(q('lapangan').value);
    HOLE = 1; STK = 0; STKS = 0; TOTAL = 0; kartu = []; selesai = false;
    q('log').textContent = '';
    tulis('P C   G O L F — ' + D.LAPANGAN[C - 1].nama, 'judul');
    tulis('Handicap ' + A + ' · ' + KESULITAN[B]);
    if (A < 4) tulis('You Should Be On The Tour!!', 'baik');
    tee();
  }

  /* Baris 1740-1840 */
  function tee() {
    if (HOLE > 18) return akhirRonde();
    const h = D.LAPANGAN[C - 1].lubang[HOLE - 1];
    PAR = h.par; YARDS = h.yard; LEFT = h.kiri; RIGHT = h.kanan;
    DIFF = h.diff; LNG = h.lng + 4; FAC = h.fac;
    TOTAL += PAR; STK = 0; HP = 0; PENALTY = 0; B1 = 1; diGreen = false;
    GRN = YARDS; OF = 0;
    gambarLubang(YARDS, 0, false);
    if (scene) scene.lubangBaru(YARDS);
    tulis('No. ' + HOLE + ' Tee — ' + YARDS + ' yards, par ' + PAR, 'judul');
    tulis('On Your Left Is ' + D.MEDAN[LEFT - 1] + ' · On Your Right Is ' + D.MEDAN[RIGHT - 1]);
    perbaruiHud();
    pilihTongkat();
  }

  /* Baris 280-500 */
  function pilihTongkat() {
    const daftar = [];
    for (let i = 1; i <= 4; i++)
      daftar.push(tombol(i + 'W', () => ayun(i, false), 'btn--ghost btn--sm'));
    for (let i = 1; i <= 9; i++)
      daftar.push(tombol(i + 'I', () => besi(i), 'btn--ghost btn--sm'));
    daftar.push(tombol('PW', () => besi(10.5), 'btn--ghost btn--sm'));
    tanya('Choose Your Club. <span class="g-kecil">Kayu selalu ayunan penuh ' +
          '(baris 390); besi dan PW minta persentase.</span>', daftar,
      'Jarak terjauh yang mungkin bagi handicap <b>' + A + '</b> adalah <b>' +
      jarakMaks(A) + ' yard</b> &mdash; kayu 1, ayunan penuh, undian paling murah hati. ' +
      'Bandingkan dengan jarak lubang ini: <b>' + Math.round(GRN) + ' yard</b>.');
  }

  /* Besi: F = nomor + 9.5 (baris 350), lalu minta persentase ayunan. */
  function besi(nomor) {
    const F = nomor === 10.5 ? 20 : nomor + 9.5;
    const sl = document.createElement('input');
    sl.type = 'range'; sl.min = 11; sl.max = 100; sl.step = 1; sl.value = 100;
    sl.className = 'g-slider';
    const out = document.createElement('b'); out.className = 'g-out';
    const sync = () => { out.textContent = sl.value + ' %'; };
    sl.addEventListener('input', sync); sync();
    tanya('Select % Of Swing <span class="g-kecil">(11 sampai 100)</span>',
      [sl, out, tombol('Pukul', () => ayun(F, true, Number(sl.value) / 100),
        'btn--primary btn--sm'), tombol('Ganti tongkat', pilihTongkat)],
      'Baris 500: sesudah persentase dibaca, <code>F = F - 5</code>. Jadi ' +
      'besi nomor <i>n</i> masuk ke rumus sebagai <code>' + (F - 5).toFixed(1) +
      '</code>, bukan ' + F.toFixed(1) + '.');
  }

  /* Baris 530-750.

     Dipecah dua. Bagian PERTAMA menghitung semuanya persis seperti aslinya
     dan tidak boleh disentuh: urutan panggilan RND di sini menentukan
     seluruh sisa ronde, jadi tidak satu pun undian boleh ditambah, dibuang,
     atau dipindah. Bagian KEDUA menggambar dan mencatat. Karena itu semua
     kalimat catatan dikumpulkan dulu ke `pesan`, baru dituliskan sesudah
     animasi selesai -- kalau tidak, pemain akan membaca hasilnya sebelum
     melihat bolanya mendarat. */
  async function ayun(F, pakaiSwing, SWING) {
    if (mengunci) return;
    if (!pakaiSwing) SWING = 1;
    else F = F - 5;                                  // baris 500
    const sisaSebelum = YARDS;
    const pesan = [];
    const kata = (s, k) => pesan.push([s, k]);

    DIST = Math.floor(((30 - A) * 2.5 + 230 -
           ((30 - A) * 0.25 + 20) * F / 2) + (RND() * 20));
    DIST = Math.floor(DIST * SWING);
    OF = (RND() / 0.6) * (2 * A + 16) * Math.abs(Math.tan(DIST * 0.003));
    GRN = Math.floor(Math.sqrt(OF * OF + Math.abs(YARDS - DIST) * Math.abs(YARDS - DIST)));
    const lewat = (YARDS - DIST < 0 && GRN >= 20);
    HOLD = YARDS; YARDS = GRN;
    STK += 1;

    if (GRN > 25) {
      /* Baris 590: OF kecil = tetap di fairway; kalau tidak, hook/slice. */
      if (OF < DIFF + (A * 1.1) - (SWING * 20)) B1 = 1;
      else if (B === 0) { B1 = LEFT; kata('You Hooked ' + (OF > 50 ? '— Outa SIGHT.' : ''), 'awas'); }
      else if (B === 1) { B1 = RIGHT; kata('You Sliced ' + (OF > 50 ? '— Outa SIGHT.' : ''), 'awas'); }
      else B1 = 1;
    } else if (GRN > 15) B1 = 5;                     // sand trap
    else if (GRN > 1) { B1 = 1; GRN = Math.floor(GRN * (RND() * 4)); }
    else GRN = 0;

    if (lewat) kata('Too Much Club, You\'re Over The Green', 'awas');
    const air = (B1 === 6);
    const medan = D.MEDAN[B1 - 1];

    /* ---- di sini perhitungan berhenti; sisanya hanya gambar ------------ */
    mengunci = true;
    panel.textContent = '';
    if (q('animasi').checked && scene) {
      /* `sisaSesudah` adalah GRN, dan GRN itu SISI MIRING:
         akar(melenceng^2 + sisa lurus^2) di baris 560. Angka itulah yang
         dipakai permainan untuk memutuskan Anda sudah di green atau belum,
         jadi angka itu pula yang harus dipatuhi gambarnya. */
      await scene.pukul({ dist: DIST, F: F, sisaSebelum: sisaSebelum,
                          medan: medan, air: air, bunyi: q('bunyi').checked,
                          sisaSesudah: (B1 > 5) ? null : GRN });
    }
    mengunci = false;
    pesan.forEach(p => tulis(p[0], p[1]));

    if (B1 > 5) {                                    // baris 1420: danau / OB
      /* TIGA kenaikan STK: satu di 1390 (sudah), satu di 1420, satu lagi
         karena 1420 melompat balik ke 1390. Diumumkan sebagai SATU. */
      STK += 2;
      tulis('Shot Went Into ' + medan + ' — Penalty Stroke Accessed. ' +
            'Hit From Same Location', 'bahaya');
      tulis('  (tiga pukulan benar-benar ditambahkan — lihat panel)', 'catatan');
      PENALTY = 1; B1 = 1; YARDS = HOLD; DIST = 0; OF = 0; GRN = HOLD;
      if (scene) scene.kembali(HOLD);
      gambarLubang(GRN, 0, true); perbaruiHud();
      return pilihTongkat();
    }

    tulis('Shot Went ' + DIST + ' Yards. It\'s ' + Math.round(GRN) +
          ' Yards From The Green, ' + Math.round(OF) + ' Yards Off Line In ' +
          medan);
    if (GRN <= 1) return keGreen();
    gambarLubang(GRN, OF * (B === 0 ? -1 : 1), true);
    perbaruiHud();
    pilihTongkat();
  }

  /* Baris 750-1160: putting. GRN sekarang dalam KAKI. */
  function keGreen() {
    diGreen = true;
    GRN = Math.floor(Math.abs(GRN) * 3 + RND() * 30) + 3;    // yard -> kaki
    if (scene) scene.green(GRN);
    gambarGreen(GRN, 1); perbaruiHud();
    tanyaPutt();
  }

  function tanyaPutt() {
    const sl = document.createElement('input');
    sl.type = 'range'; sl.min = 0.5; sl.max = 10; sl.step = 0.1;
    sl.value = Math.max(0.5, Math.min(10, (GRN / 4.5).toFixed(1)));
    sl.className = 'g-slider';
    const out = document.createElement('b'); out.className = 'g-out';
    const sync = () => { out.textContent = 'faktor ' + sl.value; };
    sl.addEventListener('input', sync); sync();
    tanya('You\'re On The Green <b>' + Math.round(GRN) +
          '</b> Feet From The Pin. Enter A Putt Factor <span class="g-kecil">' +
          '(0,5 sampai 10)</span>',
      [sl, out, tombol('Putt', () => putt(Number(sl.value)), 'btn--primary btn--sm')],
      'Baris 930: jarak berkurang <code>faktor &times; (4 + 2&times;RND) &minus; 1,5</code>. ' +
      'Kalau kesulitan Anda <b>POOR PUTTING</b>, pengalinya ' +
      '<code>(4 + 1&times;RND)</code> &mdash; sebarannya lebih sempit, bukan lebih buruk. ' +
      'Nilai wajar di sini kira-kira <b>' + (GRN / 4.5).toFixed(1) + '</b>.');
  }

  async function putt(PUTT) {
    if (mengunci) return;
    const dari = GRN;
    HP += 1;
    if (HP > 6 || STK - 1 > (A * 0.75) + 2) { GRN = 0; }
    else if (B === 5) GRN = GRN - PUTT * (4 + 1 * RND()) + 1;
    else GRN = GRN - PUTT * (4 + 2 * RND()) + 1.5;
    if (GRN < -40 || GRN > 40) GRN = 40;
    STK += 1;
    GRN = Math.floor(GRN + 0.4);
    const lewatLubang = GRN < 0;                     // tanda yang dibuang 1030
    if (GRN < 0) GRN = -GRN;

    /* Bola menggelinding: melambat seperti bola sungguhan (kuadratik), dan
       kalau ia melewati lubang, ia benar-benar digambar melewatinya. */
    if (q('animasi').checked && scene) {
      mengunci = true; panel.textContent = '';
      const sampai = lewatLubang ? -GRN : GRN;         // bertanda: minus = kelewat
      await scene.gerak(Math.min(1.5, 0.45 + Math.abs(dari - sampai) * 0.035), (t) => {
        const e = 1 - Math.pow(1 - t, 2);              // melambat seperti bola nyata
        const nilai = dari + (sampai - dari) * e;
        gambarGreen(Math.abs(nilai), nilai < 0 ? -1 : 1);
        scene.puttKe(nilai);
      });
      mengunci = false;
      if (q('bunyi').checked && GRN === 0) try { audio.sound(320, 1.2); } catch (e) {}
    }
    gambarGreen(GRN, lewatLubang ? -1 : 1);
    if (scene) scene.puttKe(lewatLubang ? -GRN : GRN);
    perbaruiHud();
    if (GRN !== 0) {
      tulis('Putt — ' + Math.round(GRN) + ' feet remaining' +
            (lewatLubang ? ', past the hole.' : '.'));
      return tanyaPutt();
    }
    selesaiLubang();
  }

  /* Baris 1530-1600 & 1430-1520 */
  function selesaiLubang() {
    const d = STK - PAR;
    let pesan = '', nada = null;
    if (d === 2) { pesan = 'A Double Bogey. Let The Next Foursome Play Through'; nada = 'T120L16O2CGCG'; }
    else if (d === 1) { pesan = 'A Bogey. Maybe The Next Hole Will Be Better.'; nada = 'T120L16O3CG'; }
    else if (d === 0) { pesan = 'A Par. Keep Up The Good Work.'; nada = 'T160L4O5C'; }
    else if (d > 2) { pesan = 'Maybe You Had Better Get Your Money Back.'; nada = 'T90L2O2C'; }
    else if (d === -1) { pesan = 'Alright ! A Birdie.'; nada = 'T180L16O5CGCG'; }
    else if (d === -2) {
      pesan = PAR === 3 ? 'A Hole In One !!!!' : 'An Eagle. WOW !! You Should Be On The Tour.';
      nada = 'T180L16O5CGCGCG';
    } else if (d === -3) { pesan = 'YEE-HAA!!! A Double Eagle !!!'; nada = 'T200L16O5CO6CO5GO6G'; }
    tulis(pesan, d <= 0 ? 'baik' : 'awas');
    if (nada && q('bunyi').checked) audio.play(nada);
    STKS += STK;
    kartu.push({ hole: HOLE, par: PAR, yard: D.LAPANGAN[C - 1].lubang[HOLE - 1].yard, stk: STK });
    tulis('Your Score On Hole ' + HOLE + ' Was ' + STK +
          '  ·  total ' + STKS + ' (par ' + TOTAL + ')');
    HOLE += 1;
    tanya('', [tombol(HOLE > 18 ? 'Kartu skor' : 'Tee berikutnya', tee, 'btn--primary btn--sm')]);
    perbaruiHud();
  }

  /* Baris 1610-1720 */
  function akhirRonde() {
    selesai = true;
    const hit = { bad: 0, dbog: 0, bog: 0, par: 0, bird: 0, eag: 0, dbl: 0, ace: 0 };
    kartu.forEach(k => {
      const d = k.stk - k.par;
      if (d > 2) hit.bad++; else if (d === 2) hit.dbog++; else if (d === 1) hit.bog++;
      else if (d === 0) hit.par++; else if (d === -1) hit.bird++;
      else if (d === -2) { if (k.par === 3) hit.ace++; else hit.eag++; }
      else if (d === -3) hit.dbl++;
    });
    let baris = '';
    for (let i = 0; i < 9; i++) {
      const a2 = kartu[i], b2 = kartu[i + 9];
      baris += '<tr><td>' + (i + 1) + '</td><td>' + a2.par + '</td><td>' + a2.yard +
        '</td><td class="' + kelasSkor(a2) + '">' + a2.stk + '</td>' +
        '<td>' + (i + 10) + '</td><td>' + b2.par + '</td><td>' + b2.yard +
        '</td><td class="' + kelasSkor(b2) + '">' + b2.stk + '</td></tr>';
    }
    panel.textContent = '';
    const d = document.createElement('div');
    d.innerHTML =
      '<p class="g-tanya">Your Score Is As Follows &mdash; ' + D.LAPANGAN[C - 1].nama + '</p>' +
      '<table class="g-kartu"><thead><tr><th>#</th><th>par</th><th>yd</th><th>skor</th>' +
      '<th>#</th><th>par</th><th>yd</th><th>skor</th></tr></thead><tbody>' + baris +
      '</tbody></table>' +
      '<p class="g-tanya">Par For This Course Is ' + TOTAL +
      ' &middot; Your Score Was <b>' + STKS + '</b> (' +
      (STKS - TOTAL >= 0 ? '+' : '') + (STKS - TOTAL) + ')</p>' +
      '<p class="g-catatan">' + hit.bad + ' awful &middot; ' + hit.dbog + ' double bogey &middot; ' +
      hit.bog + ' bogey &middot; ' + hit.par + ' par &middot; ' + hit.bird + ' birdie &middot; ' +
      hit.eag + ' eagle &middot; ' + hit.dbl + ' double eagle &middot; ' + hit.ace +
      ' hole in one</p>';
    panel.append(d);
    const row = document.createElement('div');
    row.className = 'g-row';
    row.append(tombol('Main lagi', mulai, 'btn--primary btn--sm'));
    panel.append(row);
    const r = store.get('rekor');
    if (typeof r !== 'number' || STKS < r) store.set('rekor', STKS);
    perbaruiHud();
  }
  const kelasSkor = (k) => {
    const d = k.stk - k.par;
    return d < 0 ? 'g-bird' : d === 0 ? 'g-par' : d === 1 ? 'g-bog' : 'g-bad';
  };

  /* ======================================================================
     Bagian 6 — papan angka
     ====================================================================== */
  function perbaruiHud() {
    q('s-hole').textContent = Math.min(18, HOLE) + ' / 18';
    q('s-par').textContent = PAR || '—';
    q('s-yard').textContent = YARDS ? Math.round(YARDS) : '—';
    q('s-stk').textContent = STK;
    q('s-total').textContent = STKS + ' (par ' + TOTAL + ')';
    q('s-sisa').textContent = diGreen ? Math.round(GRN) + ' ft' : Math.round(GRN) + ' yd';
    q('s-maks').textContent = jarakMaks(A) + ' yd';
    q('s-benih').textContent = benih;
    const r = store.get('rekor');
    q('s-rekor').textContent = (typeof r === 'number') ? r : '—';
  }

  /* ======================================================================
     Bagian 7 — pasang & bukti
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'PC Golf', source: 'GOLF.BAS · A. Vanchura · 17 Jul 1982'
  }));
  if (scene) scene.pasang(q('svg2'));
  q('mulai').addEventListener('click', mulai);
  q('benih').addEventListener('change', e => {
    benih = parseInt(e.currentTarget.value, 10) || 0; perbaruiHud();
  });
  ['handicap', 'kesulitan', 'lapangan'].forEach(id =>
    q(id).addEventListener('change', () => {
      A = Math.max(0, Math.min(30, Number(q('handicap').value) || 12));
      perbaruiHud(); isiTabelJarak();
    }));

  /* Tabel jarak maksimum tiap tongkat, dihitung dari rumus baris 530. */
  function isiTabelJarak() {
    const a = Math.max(0, Math.min(30, Number(q('handicap').value) || 12));
    const baris = [];
    for (let i = 1; i <= 4; i++)
      baris.push(['Wood ' + i, Math.floor(jarakDasar(a, i)), Math.floor(jarakDasar(a, i) + 19.999)]);
    for (let i = 1; i <= 9; i++) {
      const f = i + 9.5 - 5;
      baris.push(['Iron ' + i, Math.floor(jarakDasar(a, f)), Math.floor(jarakDasar(a, f) + 19.999)]);
    }
    baris.push(['Pitching wedge', Math.floor(jarakDasar(a, 15)), Math.floor(jarakDasar(a, 15) + 19.999)]);
    q('b-jarak').innerHTML = baris.map(r =>
      '<tr><td>' + r[0] + '</td><td>' + Math.max(0, r[1]) + '</td><td>' +
      Math.max(0, r[2]) + '</td></tr>').join('');
    q('b-maks').textContent = jarakMaks(a) + ' yard (handicap ' + a + ')';
    q('b-maks0').textContent = jarakMaks(0) + ' yard';
  }

  (function isiBukti() {
    const t = D.LAPANGAN.map(L => {
      const par = L.lubang.reduce((s, h) => s + h.par, 0);
      const yd = L.lubang.reduce((s, h) => s + h.yard, 0);
      const p3 = L.lubang.filter(h => h.par === 3).length;
      const p4 = L.lubang.filter(h => h.par === 4).length;
      const p5 = L.lubang.filter(h => h.par === 5).length;
      return '<tr><td>' + L.nama + '</td><td>' + L.rating + '</td><td>' + par +
        '</td><td>' + yd.toLocaleString('en-US') + '</td><td>' + p3 + '/' + p4 + '/' + p5 +
        '</td></tr>';
    }).join('');
    q('b-lapangan').innerHTML = t;
    const mustahil = [];
    D.LAPANGAN.forEach((L, ci) => L.lubang.forEach((h, hi) => {
      if (h.par === 3 && h.yard > jarakMaks(0))
        mustahil.push('lapangan ' + (ci + 1) + ' lubang ' + (hi + 1) +
                      ' — par 3, ' + h.yard + ' yard');
    }));
    q('b-mustahil').innerHTML = mustahil.length
      ? mustahil.map(s => '<li>' + s + '</li>').join('')
      : '<li>tidak ada</li>';
    isiTabelJarak();
  })();

  mulai();
})();
