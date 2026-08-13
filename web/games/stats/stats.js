/* ===========================================================================
   stats.js — port STATS.BAS ("Sports Menu", Friendlyware, 1982)

   Bukan permainan: sebuah PENILAI REGU FOOTBALL berbasis biorhythm. Anda
   memasukkan tanggal lahir 22 pemain untuk dua regu dan tanggal pertandingan;
   program menghitung tiga daur biorhythm klasik, menengok nilainya di tabel
   kurva buatan tangan, mengalikannya dengan bobot posisi, lalu mencetak satu
   angka "Team Evaluation".

   Empat hal yang membentuk berkas ini:

   1. REGU 0 DIBERI SEPULUH ANGKA CUMA-CUMA. Baris 2830 berbunyi
      `IF A=0 THEN AVG!(A)=AVG!(A)+10`, dan baris 2840 membaginya dengan 22
      lalu mengalikannya 100 di layar. Jadi regu pertama selalu unggul
      45,45 angka sebelum satu tanggal lahir pun dibandingkan.

   2. SETENGAH DATA KURVANYA MATI. Baris 2870-2910 membaca DUA lapis tabel,
      masing-masing 84 angka. Baris 1630/1650/1670 hanya pernah menyebut
      `D(k, W, 0)`. Lapis kedua tidak pernah disentuh -- pengulangan persis
      dari `DATA 3030` di FOOTBALL.BAS.

   3. HARI KRITIS TIDAK TERASA. Baris 2720-2760 mengurangi PEMBAGI setiap
      kali sebuah daur bernilai nol, bukan menjumlahkan nolnya. Pemain
      dengan dua hari kritis dan satu puncak mendapat rata-rata yang SAMA
      dengan pemain yang ketiga daurnya di puncak.

   4. TANGGAL JULIAN-nya BENAR. Baris 1710-1770 adalah algoritma
      Fliegel-Van Flandern yang sungguhan, ditulis tangan pada 1982.
   =========================================================================== */
(function () {
  'use strict';

  const D = window.RETRO.STATS;
  const ui = window.RETRO.ui;
  const store = window.RETRO.store('stats');
  const q = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };

  /* ======================================================================
     Bagian 1 — tanggal Julian, baris 1710-1770 apa adanya
     ====================================================================== */
  function julian(bulan, hari, tahun) {
    const w = Math.trunc((bulan - 14) / 12);
    let jd = Math.floor(1461 * (tahun + 4800 + w) / 4);
    jd += Math.trunc(367 * (bulan - 2 - w * 12) / 12);
    jd -= Math.floor(Math.floor(3 * (tahun + 4900 + w) / 100) / 4);
    return jd + hari - 32075;
  }

  /* Baris 220: FNX(V) = FIX(DIFF - INT(DIFF/V)*V) + 1, yaitu (DIFF mod V)+1 */
  const fnx = (diff, v) => Math.trunc(diff - Math.floor(diff / v) * v) + 1;

  /* ======================================================================
     Bagian 2 — keadaan
     ====================================================================== */
  let benih = 1982, rnd = null;
  let tglMain = '1982-10-17';
  let regu = [[], []];
  let namaRegu = ['HOME', 'VISITORS'];
  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };

  function buatRegu() {
    rnd = acak(benih);
    regu = [[], []];
    for (let t = 0; t < 2; t++)
      for (let i = 0; i < 22; i++) {
        /* Tanggal lahir diundi supaya halaman ini bisa dipakai tanpa
           mengetik 44 tanggal. Semuanya bisa disunting satu per satu. */
        const th = 1948 + Math.floor(rnd() * 14);
        const bl = 1 + Math.floor(rnd() * 12);
        const hr = 1 + Math.floor(rnd() * 28);
        regu[t].push({ lahir: th + '-' + pad(bl) + '-' + pad(hr) });
      }
  }
  const pad = (n) => (n < 10 ? '0' : '') + n;

  /* ======================================================================
     Bagian 3 — perhitungan, baris 1550-1690 dan 2680-2850
     ====================================================================== */
  function hitung() {
    const [ty, tb, td] = tglMain.split('-').map(Number);
    const GAME = julian(tb, td, ty);
    const hasil = [];
    for (let t = 0; t < 2; t++) {
      let jumlah = 0, of_ = 0, df = 0;
      const baris = [];
      for (let b = 0; b < 22; b++) {
        const [ly, lb, ld] = regu[t][b].lahir.split('-').map(Number);
        const DIFF = GAME - julian(lb, ld, ly);
        const nilai = [], hari = [];
        for (let k = 0; k < 3; k++) {
          const w = fnx(DIFF, D.SIKLUS[k]);
          hari.push(w);
          nilai.push(D.K0[k][w - 1]);           /* D(k, W, 0) — lapis 0 saja */
        }
        /* Baris 2710-2760: PEMBAGI berkurang tiap nilai nol, bukan nolnya
           yang ikut dijumlahkan. Hari kritis jadi tidak terasa. */
        let DD = 3;
        nilai.forEach(v => { if (v === 0) DD -= 1; });
        const tot = nilai.reduce((s, v) => s + v, 0);
        let avg = DD === 0 ? 0 : tot / DD;
        avg = avg * D.BOBOT[b];                 /* baris 2770 */
        jumlah += avg;
        if (b < 11) of_ += avg; else df += avg; /* baris 2810 */
        baris.push({ pos: D.POSISI[b], bobot: D.BOBOT[b], hari: hari,
                     nilai: nilai, DD: DD, tot: tot, avg: avg,
                     lahir: regu[t][b].lahir });
      }
      const bonus = (t === 0) ? 10 : 0;         /* baris 2830 */
      const total = jumlah + bonus;
      hasil.push({ baris: baris, jumlah: jumlah, bonus: bonus,
                   evaluasi: (total / 22) * 100,
                   evaluasiTanpaBonus: (jumlah / 22) * 100,
                   of: of_ / 11, df: df / 11 });
    }
    return hasil;
  }

  /* ======================================================================
     Bagian 4 — gambar: tiga daur sebagai kurva
     ====================================================================== */
  const svg = q('svg');
  const gK = mkn('g', {});
  svg.append(gK);
  const LW = 820, LH = 260;

  function gambarKurva(sorotHari) {
    gK.textContent = '';
    gK.append(mkn('rect', { class: 's-latar', x: 0, y: 0, width: LW, height: LH }));
    const x0 = 54, x1 = LW - 24, yBase = LH - 44, tinggi = LH - 92;
    /* Sumbu nilai 0..7,5 — nilai tertinggi yang ada di tabel. */
    for (let v = 0; v <= 7.5; v += 2.5) {
      const y = yBase - (v / 7.5) * tinggi;
      gK.append(mkn('line', { class: 's-grid', x1: x0, y1: y, x2: x1, y2: y }));
      const t = mkn('text', { class: 's-sumbu', x: 44, y: y + 4 });
      t.textContent = v; gK.append(t);
    }
    D.K0.forEach((kurva, k) => {
      const n = kurva.length;
      let d = '';
      kurva.forEach((v, i) => {
        const x = x0 + (i / (n - 1)) * (x1 - x0);
        const y = yBase - (v / 7.5) * tinggi;
        d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      });
      gK.append(mkn('path', { class: 's-kurva s-kurva--' + k, d: d }));
      if (sorotHari) {
        const i = sorotHari[k] - 1;
        const x = x0 + (i / (n - 1)) * (x1 - x0);
        const y = yBase - (kurva[i] / 7.5) * tinggi;
        gK.append(mkn('circle', { class: 's-titik s-kurva--' + k, cx: x, cy: y, r: 5 }));
        const t = mkn('text', { class: 's-nilai', x: x, y: y - 12 });
        t.textContent = kurva[i]; gK.append(t);
      }
      const lbl = mkn('text', { class: 's-legenda s-kurva--' + k,
        x: x0 + 4 + k * 200, y: 22 });
      lbl.textContent = '— ' + D.NAMA[k]; gK.append(lbl);
    });
    const t = mkn('text', { class: 's-sumbu', x: x0, y: LH - 14 });
    t.textContent = 'HARI KE-1 DALAM DAUR   →   HARI TERAKHIR';
    gK.append(t);
  }

  /* ======================================================================
     Bagian 5 — tampilan
     ====================================================================== */
  function tampil() {
    const h = hitung();
    /* daftar pemain regu yang dipilih */
    const t = Number(q('lihat').value);
    const R = h[t];
    q('t-judul').textContent = namaRegu[t] + ' — ' + (t === 0 ? 'regu 0' : 'regu 1');
    q('t-tabel').innerHTML = R.baris.map((b, i) =>
      '<tr class="' + (i === 10 ? 's-pisah' : '') + '"><td>' + b.pos + '</td>' +
      '<td><input type="date" class="s-tgl" data-t="' + t + '" data-i="' + i +
      '" value="' + b.lahir + '"></td>' +
      '<td>' + b.bobot + '</td>' +
      b.nilai.map((v, k) => '<td class="' + (v === 0 ? 's-krit' : '') + '">' +
        b.hari[k] + '<span class="s-kecil">/' + D.SIKLUS[k] + '</span> ' +
        '<b>' + v.toFixed(1) + '</b></td>').join('') +
      '<td>' + b.DD + '</td><td>' + b.tot.toFixed(1) + '</td>' +
      '<td><b>' + b.avg.toFixed(2) + '</b></td></tr>').join('');

    q('s-of').textContent = R.of.toFixed(2);
    q('s-df').textContent = R.df.toFixed(2);
    q('s-eval0').textContent = h[0].evaluasi.toFixed(2);
    q('s-eval1').textContent = h[1].evaluasi.toFixed(2);
    q('s-menang').textContent = h[0].evaluasi > h[1].evaluasi ? namaRegu[0]
      : h[1].evaluasi > h[0].evaluasi ? namaRegu[1] : 'seri';
    q('s-benih').textContent = benih;

    /* Bukti bonus: hitung ulang kedua regu tanpa baris 2830. */
    q('b-dengan').textContent = h[0].evaluasi.toFixed(2) + '  vs  ' + h[1].evaluasi.toFixed(2);
    q('b-tanpa').textContent = h[0].evaluasiTanpaBonus.toFixed(2) + '  vs  ' +
      h[1].evaluasi.toFixed(2);
    q('b-selisih').textContent = (h[0].evaluasi - h[0].evaluasiTanpaBonus).toFixed(2);
    const balik = (h[0].evaluasi > h[1].evaluasi) &&
                  (h[0].evaluasiTanpaBonus < h[1].evaluasi);
    q('b-balik').textContent = balik
      ? 'YA — pada benih ini, bonus itu SENDIRI yang memenangkan regu 0'
      : 'tidak pada benih ini (coba benih lain)';
    q('b-balik').className = balik ? 's-krit' : '';

    /* Sorot kurva pada pemain pertama regu yang dilihat. */
    gambarKurva(R.baris[0].hari);
    q('s-sorot').textContent = R.baris[0].pos + ' (' + R.baris[0].lahir + ')';

    document.querySelectorAll('.s-tgl').forEach(el =>
      el.addEventListener('change', e => {
        const tt = +e.currentTarget.dataset.t, ii = +e.currentTarget.dataset.i;
        regu[tt][ii].lahir = e.currentTarget.value;
        tampil();
      }));
  }

  /* ======================================================================
     Bagian 6 — bukti yang dihitung dari datanya sendiri
     ====================================================================== */
  (function bukti() {
    q('b-lapis').innerHTML = D.K0.map((k, i) =>
      '<tr><td>' + D.NAMA[i] + '</td><td>' + k.length + '</td><td>' +
      D.K1[i].length + '</td><td>' + (D.K1[i].join(',') === k.join(',')
        ? 'sama' : 'BERBEDA') + '</td></tr>').join('');
    q('b-jumlahMati').textContent = D.K1.reduce((s, k) => s + k.length, 0);

    /* Berapa hari kritis dalam satu daur penuh? */
    q('b-krit').innerHTML = D.K0.map((k, i) => {
      const nol = k.filter(v => v === 0).length;
      return '<tr><td>' + D.NAMA[i] + '</td><td>' + nol + '</td><td>' +
        (100 * nol / k.length).toFixed(1) + ' %</td></tr>';
    }).join('');

    /* Peluang ketiga daur nol bersamaan = pembagi nol. */
    let n0 = 0;
    const P = 23 * 28 * 33;
    for (let d = 0; d < P; d++) {
      let z = 0;
      for (let k = 0; k < 3; k++) if (D.K0[k][fnx(d, D.SIKLUS[k]) - 1] === 0) z++;
      if (z === 3) n0++;
    }
    q('b-nol3').textContent = n0 + ' dari ' + P.toLocaleString('id-ID') +
      ' hari (' + (100 * n0 / P).toFixed(4) + ' %)';
    q('b-ulang').textContent = P.toLocaleString('id-ID') + ' hari ≈ ' +
      (P / 365.25).toFixed(1) + ' tahun';
  })();

  /* ======================================================================
     Bagian 7 — pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'Sports Menu', source: 'STATS.BAS · Friendlyware · 1982'
  }));
  function segar() {
    benih = parseInt(q('benih').value, 10) || 0;
    tglMain = q('tglmain').value || tglMain;
    namaRegu = [q('nama0').value || 'HOME', q('nama1').value || 'VISITORS'];
    buatRegu(); tampil();
    const r = store.get('benih');
    if (r !== benih) store.set('benih', benih);
  }
  ['benih', 'tglmain', 'nama0', 'nama1'].forEach(id =>
    q(id).addEventListener('change', segar));
  q('lihat').addEventListener('change', tampil);
  q('mulai').addEventListener('click', segar);
  segar();
})();
