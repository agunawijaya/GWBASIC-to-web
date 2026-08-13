/* ===========================================================================
   mortgage.js — port dari MORTGAGE.BAS (IBM Corp, 1981-82).

   ------------------------------------------------------------------------
   SATU-SATUNYA PROGRAM DI KOLEKSI DENGAN RIWAYAT PERUBAHAN

       940 REM The IBM Personal Computer Mortgage
       950 REM Version 1.00 (C)Copyright IBM Corp 1981, 1982
       960 REM Licensed Material - Program Property of IBM
       965 REM Author - Glenn Stuart Dardick
       970 REM Modified by Ayodele Isaac Anise; September, 1986.

   Penulis asli, dan pengubah berikutnya DENGAN TANGGALNYA. Ini changelog
   dalam lima baris, di berkas yang tidak punya kendali versi — karena kendali
   versi belum ada di komputer pribadi.

   Delapan puluh tiga program lain di koleksi ini tidak punya baris seperti
   itu. Yang kita tahu tentang mereka cuma nama satu orang, kalau beruntung.

   ------------------------------------------------------------------------
   RUMUSNYA, SATU BARIS

       1480 PF = AF*(RF/(1-(1/((1+RF)^NF)))):RETURN

   Angsuran bulanan = pokok x bunga / (1 - (1+bunga)^-n). Rumus anuitas baku,
   ditulis tanpa satu variabel perantara pun — dan dipanggil dari dua tempat
   yang sangat berbeda: pembanding tabel dan penghitung amortisasi.

   Perhatikan bahwa `AF` disetel 1 saat dipanggil dari pembanding (baris 1910),
   sehingga yang kembali adalah angsuran per SATU rupiah pokok. Lalu baris 1930
   mengalikannya dengan tiap pokok di kolomnya. Satu pemanggilan rumus, lima
   belas baris hasil — karena angsuran berbanding lurus dengan pokoknya.

   ------------------------------------------------------------------------
   PEMBULATAN YANG DIGESER SEPERSEJUTA

       1930 P = INT((P+0.005000001)*100)/100

   Bukan 0.005, melainkan 0.005000001. Itu penjaga terhadap pecahan biner:
   sebuah nilai yang secara desimal tepat di 0,005 tidak selalu tersimpan tepat
   di 0,005, dan `INT` akan memotongnya ke bawah di separuh kasus. Menggeser
   sepersejuta membuat "tepat setengah sen" selalu naik.

   Angka itu muncul TIGA KALI di program ini (baris 1930, 2420, 2490), selalu
   sama. Seseorang menemukan masalahnya sekali, lalu memakai obat yang sama di
   mana pun ia muncul — dan tidak menuliskan alasannya sama sekali.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const db = store('mortgage');

  /* Baris 1480, apa adanya. `r` bunga per bulan, `n` jumlah bulan. */
  const angsuran = (pokok, r, n) =>
    r === 0 ? pokok / n : pokok * (r / (1 - (1 / Math.pow(1 + r, n))));

  /* Baris 1930/2420/2490. Nilai gesernya dipertahankan persis — lihat
     komentar kepala berkas. */
  const senBulat = (v) => Math.floor((v + 0.005000001) * 100) / 100;

  const uang = (v) => v.toLocaleString('id-ID',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* --------------------------------------------------------------------
     Mode 1 — PEMBANDING (baris 1490-2000)

     Lima belas baris bunga x beberapa kolom pokok. Kenaikannya tertulis di
     baris 1650 dan 1700:

         AINC = 2000            ' pokok naik 2000 tiap kolom
         RINC = 0.0025/12       ' bunga naik 0,25% setahun tiap baris

     Perhatikan RINC: 0,0025 adalah 0,25% per TAHUN, dibagi 12 karena seluruh
     hitungan bekerja dalam bunga per bulan.
     -------------------------------------------------------------------- */
  const AINC = 2000, RINC = 0.0025 / 12, BARIS = 15;

  function banding() {
    const A = Number($('cA').value) || 0;
    const IR = Number($('cR').value) || 0;
    const Y = Number($('cY').value) || 0;
    const kol = Math.max(1, Math.min(8, Number($('cK').value) || 4));
    const pesan = $('cMsg');
    pesan.textContent = '';

    if (A <= 0) return galat(pesan, 'Jumlah pokok harus lebih dari nol.');
    if (IR < 1 || IR > 35) return galat(pesan, '(1 TO 35 PERCENT)');
    const n = Y * 12;
    if (n < 1 || n > 420) return galat(pesan, '(1 TO 35 YEARS)');

    const r0 = IR / 1200;                                  // baris 1700
    const tbl = $('cTbl');
    tbl.textContent = '';

    const thead = ui.el('tr');
    thead.append(ui.el('th', { text: 'Bunga' }));
    for (let j = 0; j < kol; j++) {
      thead.append(ui.el('th', { text: (A + j * AINC).toLocaleString('id-ID') }));
    }
    tbl.append(thead);

    let adaTerlaluBesar = false;
    for (let i = 0; i < BARIS; i++) {
      const rf = r0 + i * RINC;                             // baris 1910
      const perSatu = angsuran(1, rf, n);                   // AF=1
      const tr = ui.el('tr');
      tr.append(ui.el('th', { text: (rf * 1200).toFixed(2) + '%' }));
      for (let j = 0; j < kol; j++) {
        const p = senBulat(perSatu * (A + j * AINC));       // baris 1930
        /* Baris 1935: PRINT USING "####.##" hanya muat sampai 9999,99 —
           jadi batas 10000 bukan aturan keuangan, melainkan LEBAR KOLOM.
           Dipertahankan sebagai penanda, bukan sebagai penghenti. */
        const td = ui.el('td', { text: uang(p) });
        if (p > 10000) { td.className = 'g-lebar'; adaTerlaluBesar = true; }
        tr.append(td);
      }
      tbl.append(tr);
    }
    $('cNote').innerHTML = adaTerlaluBesar
      ? 'Sel bertanda merah melewati <b>10.000</b> &mdash; aslinya berhenti di '
      + 'situ dengan <em>"PAYMENTS TOO LARGE TO DISPLAY"</em>, karena '
      + '<code>PRINT USING "####.##"</code> cuma muat empat digit.'
      : 'Bunga naik <b>0,25%</b> tiap baris, pokok naik <b>2.000</b> tiap kolom '
      + '&mdash; kenaikan aslinya (baris 1650 dan 1700).';
    db.set('c', { A, IR, Y, kol });
  }

  /* --------------------------------------------------------------------
     Mode 2 — AMORTISASI (baris 2010-2700)

         2470 AMORT(0,1) = AF
         2490 AMORT(I,2) = INT((AMORT(I-1,1)*RF+0.005000001)*100)/100
         2500 AMORT(I,1) = AMORT(I-1,1)-PF+AMORT(I,2)

     Bunga bulan ini dihitung dari sisa pokok BULAN LALU, dibulatkan ke sen,
     lalu sisa pokok baru = sisa lama - angsuran + bunga. Pokok yang terbayar
     adalah selisihnya, dan program tidak pernah menyimpannya sebagai angka
     tersendiri.
     -------------------------------------------------------------------- */
  function amortisasi() {
    const A = Number($('aA').value) || 0;
    const IR = Number($('aR').value) || 0;
    const Y = Number($('aY').value) || 0;
    const pesan = $('aMsg');
    pesan.textContent = '';

    if (A <= 0) return galat(pesan, 'Jumlah pokok harus lebih dari nol.');
    if (IR < 1 || IR > 35) return galat(pesan, '(1 TO 35 PERCENT)');
    const n = Y * 12;
    if (n < 1 || n > 420) return galat(pesan, '(1 TO 35 YEARS)');

    const rf = IR / 1200;                                   // baris 2300
    const pf = senBulat(angsuran(A, rf, n));                // baris 2420
    $('aPay').innerHTML = 'MONTHLY PAYMENTS ARE ====&gt; <b>' + uang(pf) + '</b>';

    const sisa = [A], bunga = [0];
    for (let i = 1; i <= n; i++) {
      bunga[i] = senBulat(sisa[i - 1] * rf);                 // baris 2490
      sisa[i] = sisa[i - 1] - pf + bunga[i];                 // baris 2500
    }

    const mulai = Math.max(1, Math.min(n, Number($('aP').value) || 1));
    const akhir = Math.min(n, mulai + 11);                   // periode 12 bulan
    const tbl = $('aTbl');
    tbl.textContent = '';
    const th = ui.el('tr');
    ['Bulan', 'Angsuran', 'Bunga', 'Pokok', 'Sisa'].forEach(t =>
      th.append(ui.el('th', { text: t })));
    tbl.append(th);

    let tb = 0, tp = 0;
    for (let i = mulai; i <= akhir; i++) {
      const pokok = pf - bunga[i];
      tb += bunga[i]; tp += pokok;
      const tr = ui.el('tr');
      tr.append(ui.el('th', { text: String(i) }),
                ui.el('td', { text: uang(pf) }),
                ui.el('td', { text: uang(bunga[i]) }),
                ui.el('td', { text: uang(pokok) }),
                ui.el('td', { text: uang(Math.max(sisa[i], 0)) }));
      tbl.append(tr);
    }
    const tr = ui.el('tr', { class: 'g-jml' });
    tr.append(ui.el('th', { text: 'Jumlah' }),
              ui.el('td', { text: uang(pf * (akhir - mulai + 1)) }),
              ui.el('td', { text: uang(tb) }),
              ui.el('td', { text: uang(tp) }),
              ui.el('td', { text: '' }));
    tbl.append(tr);

    /* Angka yang aslinya tidak pernah ditampilkan: total bunga seumur
       pinjaman. Ditambahkan karena itu satu-satunya angka yang membuat
       "bandingkan bunga" punya arti — dan ia selalu mengejutkan. */
    const totalBunga = bunga.reduce((s, b) => s + b, 0);
    $('aTotal').innerHTML =
      'Total bunga selama <b>' + n + '</b> bulan: <b>' + uang(totalBunga) +
      '</b> &mdash; <b>' + ((totalBunga / A) * 100).toFixed(1) +
      '%</b> dari pokoknya. Aslinya tidak pernah menampilkan angka ini.';
    $('aMax').textContent = n;
    $('aP').max = n;
    db.set('a', { A, IR, Y, P: mulai });
  }

  function galat(host, t) {
    host.innerHTML = '<span class="g-err">' + t + '</span>';
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'IBM Mortgage',
    source: 'MORTGAGE.BAS · Glenn Stuart Dardick / Ayodele Isaac Anise · 1981-86',
    backHref: '../../index.html'
  }));

  document.querySelectorAll('[data-mode]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach(x =>
        x.setAttribute('aria-pressed', String(x === b)));
      $('mode1').classList.toggle('hidden', b.dataset.mode !== '1');
      $('mode2').classList.toggle('hidden', b.dataset.mode !== '2');
    });
  });
  ['cA', 'cR', 'cY', 'cK'].forEach(id => $(id).addEventListener('input', banding));
  ['aA', 'aR', 'aY', 'aP'].forEach(id => $(id).addEventListener('input', amortisasi));

  const c = db.get('c', null);
  if (c) { $('cA').value = c.A; $('cR').value = c.IR; $('cY').value = c.Y; $('cK').value = c.kol; }
  const a = db.get('a', null);
  if (a) { $('aA').value = a.A; $('aR').value = a.IR; $('aY').value = a.Y; $('aP').value = a.P; }
  banding();
  amortisasi();
})();
