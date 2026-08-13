/* ===========================================================================
   maxit1.js — port dari MAXIT1.BAS
   (versi PET, diadaptasi ke IBM PC oleh Patrick Leabo, Tucson, 20 Maret 1982).

   Penulis yang sama dengan OTHELLO.BAS — dua program di koleksi ini dari
   tangan yang sama, keduanya "adapted from PET", keduanya menuliskan nama,
   kota, dan tanggal di baris komentar.

   ATURANNYA
   ---------
   Papan 8x8 berisi 64 angka. Sebuah penanda duduk di satu sel.

     - Pemain 1 mengambil angka dari BARIS penanda.
     - Pemain 2 mengambil angka dari KOLOM penanda.

   Angka yang diambil masuk ke skor, selnya jadi kosong, dan penanda pindah
   ke sana. Giliran berganti. Yang tidak punya langkah kalah gilirannya.

   Karena penanda berpindah ke sel yang baru saja diambil, tiap langkah Anda
   MENENTUKAN pilihan apa yang tersedia untuk lawan. Itu seluruh permainannya.

   ------------------------------------------------------------------------
   TIGA HAL YANG LAYAK DIBACA

   1. `FL = 600 + jumlah baris`  (baris 1640)

      Sel kosong bernilai -100 dan penanda bernilai 100. Kalau satu baris
      hanya berisi penanda dan tujuh sel kosong:

          100 + 7 x (-100) = -600,  jadi  FL = 600 + (-600) = 0

      Angka 600 dipilih supaya penjumlahannya mendarat TEPAT di nol ketika
      tidak ada langkah tersisa. Satu perulangan penjumlahan menggantikan
      perulangan pencarian — dan hasilnya sekaligus jadi bendera.

      Rapi, dan sekaligus rapuh: ubah nilai sel kosong dari -100, dan 600
      tidak lagi berarti apa-apa. Tidak ada satu pun baris yang menyatakan
      hubungan itu.

   2. Pengocokan dengan larik yang menyusut  (baris 1270-1330)

          1270 FOR K=1 TO 64:AV(K)=K:NEXT
          1290 P1=1+INT(K*RND(1))
          1300 J=AV(P1)-1
          1310 IF P1<K THEN FOR I=P1 TO K-1:AV(I)=AV(I+1):NEXT

      Isi larik 1..64, ambil satu indeks acak, lalu GESER sisanya menutup
      lubang. Itu pengambilan sampel tanpa pengembalian yang benar — tapi
      O(n^2), karena tiap pengambilan menggeser sisa lariknya.

      Fisher-Yates menyelesaikan hal yang sama dalam O(n) dengan menukar
      elemen terpilih ke ujung alih-alih menggeser. Bedanya di BASIC tidak
      sebesar kelihatannya: 64 elemen, dan menukar dua elemen juga harus
      ditulis tangan.

   3. `RANDOMIZE VAL(RIGHT$(TIME$,2))` dua kali (baris 1110 dan 1260)

      Enam puluh benih yang mungkin. Ini kemunculan keempat pola yang sama
      di koleksi ini; lihat fondasi 2.6.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, rng, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Baris 1350-1410: sebaran 64 nilai ubin, disalin apa adanya.
     Yang bernilai 100 adalah penanda awal. */
  const TILES = [
    15, 10, 9, 9, 8, 8, 7, 7, 7, 6, 6, 6,
    5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3,
    2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1,
    -2, -2, -2, -2, -3, -3, -3,
    -4, -4, -4, -5, -5, -6, -6,
    -7, -9, 100
  ];
  const MARK = 100, GONE = -100;

  const db = store('maxit1');
  const r = rng();
  let bd, mr, mc, s1, s2, turn, phase;

  function deal() {
    /* Pengocokan aslinya O(n^2) dengan menggeser larik. Di sini Fisher-Yates,
       dan alasannya ditulis di kepala berkas — bukan karena yang lama salah,
       melainkan karena yang ini menyatakan maksudnya lebih langsung. */
    const t = TILES.slice();
    for (let i = t.length - 1; i > 0; i--) {
      const j = r.int(i + 1);
      const x = t[i]; t[i] = t[j]; t[j] = x;
    }
    bd = [];
    for (let i = 0; i < 8; i++) bd.push(t.slice(i * 8, i * 8 + 8));
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      if (bd[i][j] === MARK) { mr = i; mc = j; }
    }
    s1 = 0; s2 = 0; turn = 1; phase = 'play';
  }

  /* Baris 1640/1670. Bentuk aslinya dipertahankan sebagai catatan, tapi yang
     dipakai adalah pertanyaan yang sebenarnya: adakah sel yang masih berisi
     angka di jalur ini? */
  const lineOf = (who) => {
    const out = [];
    for (let k = 0; k < 8; k++) {
      const i = who === 1 ? mr : k, j = who === 1 ? k : mc;
      if (bd[i][j] !== GONE && bd[i][j] !== MARK) out.push({ i, j, v: bd[i][j] });
    }
    return out;
  };

  /** Padanan harfiah baris 1640, dipakai untuk ditampilkan di panel. */
  const flOf = (who) => {
    let sum = 0;
    for (let k = 0; k < 8; k++) sum += who === 1 ? bd[mr][k] : bd[k][mc];
    return 600 + sum;
  };

  function take(i, j) {
    if (phase !== 'play') return;
    const moves = lineOf(turn);
    if (!moves.some(m => m.i === i && m.j === j)) return;
    const v = bd[i][j];
    if (turn === 1) s1 += v; else s2 += v;
    bd[mr][mc] = GONE;
    bd[i][j] = MARK;
    mr = i; mc = j;
    audio.play('MB T240 O3 L32 ' + (v >= 0 ? 'g' : 'c'), { fresh: true });
    turn = turn === 1 ? 2 : 1;
    draw();
    setTimeout(next, 320);
  }

  function next() {
    if (phase !== 'play') return;
    if (!lineOf(turn).length) {
      /* Baris 1440-1460: kalau satu pemain buntu, giliran berpindah. Kalau
         keduanya buntu, permainan selesai. */
      turn = turn === 1 ? 2 : 1;
      if (!lineOf(turn).length) return finish();
      say(turn === 1 ? 'Lawan buntu — giliran Anda lagi.' : 'Anda buntu — giliran komputer.');
      draw();
    }
    if (turn === 2) setTimeout(robot, 420);
    else say('Giliran Anda: ambil satu angka dari BARIS penanda.');
  }

  /* --------------------------------------------------------------------
     Lawan komputer.

     DEVIASI YANG PERLU DINYATAKAN: AI aslinya tidak diport. Yang ini
     memilih langkah yang memaksimalkan (nilai yang diambil) dikurangi
     (nilai terbaik yang tersisa untuk lawan sesudahnya) — satu langkah ke
     depan, sama dalamnya dengan AI OTHELLO karya penulis yang sama.
     -------------------------------------------------------------------- */
  function robot() {
    if (phase !== 'play' || turn !== 2) return;
    const moves = lineOf(2);
    if (!moves.length) return next();
    let best = null, bs = -Infinity;
    moves.forEach(m => {
      const save = [bd[mr][mc], bd[m.i][m.j]], om = mr, oc = mc;
      bd[mr][mc] = GONE; bd[m.i][m.j] = MARK; mr = m.i; mc = m.j;
      const reply = lineOf(1).reduce((a, x) => Math.max(a, x.v), -99);
      bd[om][oc] = save[0]; bd[m.i][m.j] = save[1]; mr = om; mc = oc;
      const s = m.v - Math.max(0, reply);
      if (s > bs) { bs = s; best = m; }
    });
    const v = best.v;
    s2 += v;
    bd[mr][mc] = GONE; bd[best.i][best.j] = MARK;
    mr = best.i; mc = best.j;
    audio.play('MB T240 O2 L32 c', { fresh: true });
    turn = 1;
    draw();
    say('Komputer mengambil ' + v + '. Giliran Anda.');
    setTimeout(next, 260);
  }

  function finish() {
    phase = 'over';
    draw();
    say(s1 > s2 ? 'Anda menang, ' + s1 + ' lawan ' + s2
      : s2 > s1 ? 'Komputer menang, ' + s2 + ' lawan ' + s1
      : 'Seri, ' + s1 + ' sama.', 'big');
    const best = db.get('best', null);
    if (best === null || s1 > best) { db.set('best', s1); showBest(); }
    audio.play(s1 >= s2 ? 'MB T170 O2 L8 c e g O3 L4 c'
                        : 'MB T110 O3 L8 c O2 L8 a f L2 d', { fresh: true });
  }

  /* --------------------------------------------------------------------
     Gambar
     -------------------------------------------------------------------- */
  function draw() {
    const host = $('board');
    host.textContent = '';
    const g = ui.el('div', { class: 'x-board' });
    const moves = phase === 'play' && turn === 1 ? lineOf(1) : [];
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const v = bd[i][j];
      const cls = ['x-c'];
      if (v === MARK) cls.push('x-c--mark');
      else if (v === GONE) cls.push('x-c--gone');
      else if (v < 0) cls.push('x-c--neg');
      if (i === mr) cls.push('x-c--row');
      if (j === mc) cls.push('x-c--col');
      const ok = moves.some(m => m.i === i && m.j === j);
      if (ok) cls.push('x-c--ok');
      const cell = ui.el('div', {
        class: cls.join(' '),
        text: v === MARK ? '**' : v === GONE ? '' : String(v)
      });
      if (ok) cell.addEventListener('click', () => take(i, j));
      g.append(cell);
    }
    host.append(g);
    $('s1').textContent = s1;
    $('s2').textContent = s2;
    $('fl1').textContent = flOf(1);
    $('fl2').textContent = flOf(2);
    document.querySelector('.x-p1').classList.toggle('is-turn', turn === 1 && phase === 'play');
    document.querySelector('.x-p2').classList.toggle('is-turn', turn === 2 && phase === 'play');
  }

  function say(t, kind) {
    $('say').textContent = t;
    $('say').className = 'x-say' + (kind ? ' x-say--' + kind : '');
  }

  const showBest = () => {
    const b = db.get('best', null);
    $('sBest').textContent = b === null ? '—' : b;
  };

  function newGame() {
    deal(); draw();
    say('Giliran Anda: ambil satu angka dari BARIS penanda.');
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Maxit',
    source: 'MAXIT1.BAS · Patrick Leabo · 1982',
    backHref: '../../index.html'
  }));
  $('restart').addEventListener('click', newGame);
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Skor terbaik dihapus.')) return;
    db.set('best', null); showBest();
  });

  showBest();
  newGame();
})();
