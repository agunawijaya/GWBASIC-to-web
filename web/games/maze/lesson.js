/* ===========================================================================
   lesson.js — menghidupkan panel pelajaran di halaman MAZE.

   Dipisah dari maze.js dengan sengaja: maze.js memainkan kelima labirin
   aslinya dan tidak boleh tahu apa-apa tentang pembangkit. Kalau kelak panel
   ini dibuang, satu berkas ini dan satu blok HTML-nya yang dihapus — tanpa
   menyentuh permainannya.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, rng } = window.RETRO;
  const G = window.RETRO.MAZEGEN;
  const MAZES = window.RETRO.MAZES;
  const $ = (id) => document.getElementById(id);
  if (!G || !$('genPohon')) return;

  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };

  /* --------------------------------------------------------------------
     Menggambar labirin beserta hasil banjirnya.

     Warna sel = jarak dari titik mulai. Itu bukan hiasan: sel yang TIDAK
     tercapai tidak punya warna sama sekali, jadi labirin yang cacat langsung
     terlihat sebagai lubang hitam — tanpa perlu membaca angka apa pun.
     -------------------------------------------------------------------- */
  function gambar(g, hasil, mulai) {
    const n = g.length, S = 22, P = 6;
    const svg = mk('svg', {
      viewBox: '0 0 ' + (n * S + P * 2) + ' ' + (n * S + P * 2),
      class: 'z-gen', role: 'img',
      'aria-label': 'labirin yang dibangkitkan, diwarnai menurut jarak'
    });
    const maks = Math.max(hasil.terjauh, 1);

    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const x = P + c * S, y = P + r * S;
      const d = hasil.jarak[r][c];
      const isi = d < 0 ? '#000'
        : 'hsl(' + Math.round(150 - (d / maks) * 150) + ' 70% ' +
          Math.round(64 - (d / maks) * 24) + '%)';
      svg.append(mk('rect', { x: x, y: y, width: S, height: S, fill: isi,
                              opacity: d < 0 ? .85 : 1 }));
      const w = g[r][c];
      const garis = (x1, y1, x2, y2) =>
        svg.append(mk('line', { x1: x1, y1: y1, x2: x2, y2: y2, class: 'z-gw' }));
      if (w & 8) garis(x, y, x + S, y);
      if (w & 4) garis(x + S, y, x + S, y + S);
      if (w & 2) garis(x, y + S, x + S, y + S);
      if (w & 1) garis(x, y, x, y + S);
    }
    svg.append(mk('circle', { cx: P + mulai[1] * S + S / 2,
                              cy: P + mulai[0] * S + S / 2, r: 5,
                              class: 'z-gstart' }));
    return svg;
  }

  /* --------------------------------------------------------------------
     Pohon rentang: bangkitkan, lalu BUKTIKAN.

     Tiga hal diperiksa sekaligus, dan ketiganya dicetak apa adanya — kalau
     salah satu meleset, angkanya yang bicara, bukan kalimatnya.
     -------------------------------------------------------------------- */
  function bangkitkan() {
    const n = Number($('genN').value);
    const r = rng();
    const { g, dibuka, sel } = G.galiPohon(n, r);
    const mulai = [r.int(n), r.int(n)];
    const h = G.banjir(g, mulai);
    const timpang = G.dindingTimpang(g);

    $('genPapan').textContent = '';
    $('genPapan').append(gambar(g, h, mulai));

    const pohon = dibuka === sel - 1;
    $('genOut').innerHTML =
      'Sel: <b>' + sel + '</b> &middot; dinding dibuka: <b>' + dibuka + '</b> ' +
      (pohon ? '= sel&minus;1 &check;' : '<span class="z-bad">&ne; sel&minus;1</span>') +
      '<br>Tercapai dari titik mulai: <b>' + h.dicapai + ' / ' + sel + '</b> ' +
      (h.semua ? '&check; <b class="z-ok">seluruhnya</b>'
               : '<span class="z-bad">ADA YANG TIDAK TERCAPAI</span>') +
      '<br>Dinding timpang: <b>' + timpang + '</b>' +
      (timpang === 0 ? ' &check;' : ' <span class="z-bad">&larr; tidak disepakati dua sel</span>') +
      '<br>Jarak terjauh: <b>' + h.terjauh + '</b> langkah &mdash; itulah pasangan ' +
      'mulai/keluar tersulit yang mungkin di labirin ini.';
  }

  /* --------------------------------------------------------------------
     Pembanding: acak lalu periksa. Diukur, bukan ditaksir.
     -------------------------------------------------------------------- */
  function ukurAcak() {
    const r = rng(), n = 8, N = 2000;
    const baris = [];
    [0.3, 0.4, 0.5, 0.6, 0.7].forEach(p => {
      let lolos = 0;
      for (let i = 0; i < N; i++) {
        const g = G.galiAcak(n, r, p);
        if (G.banjir(g, [0, 0]).semua) lolos++;
      }
      baris.push({ p, persen: (lolos / N) * 100 });
    });
    const tb = $('tubuhAcak');
    tb.textContent = '';
    baris.forEach(b => {
      const tr = ui.el('tr', b.persen < 50 ? { class: 'z-row-bad' } : null);
      tr.append(ui.el('td', { text: Math.round(b.p * 100) + '%' }),
                ui.el('td', { text: b.persen.toFixed(1) + '%' }));
      tb.append(tr);
    });
    $('tabelAcak').classList.remove('hidden');
  }

  /* --------------------------------------------------------------------
     Memeriksa kelima labirin aslinya.

     Komentar di maze.js MENGKLAIM kelimanya bisa diselesaikan. Klaim itu
     diperiksa di sini, di halaman yang sama, supaya tidak perlu dipercaya.
     -------------------------------------------------------------------- */
  function periksaLima() {
    if (!MAZES || !MAZES.length) { $('limaOut').textContent = 'Data labirin tidak ada.'; return; }
    const hasil = MAZES.map((m, i) => {
      const g = m.grid || m.cells || m.a;
      const mulai = m.start;
      const h = G.banjir(g, mulai);
      const timpang = G.dindingTimpang(g);
      /* Jarak ke sel yang bersebelahan dengan lubang tepi — dari sanalah
         pemain melangkah keluar. */
      const ex = m.exit;
      let langkah = null;
      for (let r = 0; r < g.length; r++) for (let c = 0; c < g.length; c++) {
        if (Math.abs(r - ex[0]) + Math.abs(c - ex[1]) === 1 && h.jarak[r][c] >= 0) {
          langkah = langkah === null ? h.jarak[r][c] : Math.min(langkah, h.jarak[r][c]);
        }
      }
      return { i: i + 1, semua: h.semua, dicapai: h.dicapai, timpang, langkah };
    });

    /* SYARATNYA "BISA DISELESAIKAN", BUKAN "SEMUA SEL TERCAPAI".

       Versi pertama pemeriksa ini menuntut keduanya, dan langsung menuduh
       data 1982 cacat. Padahal sel yang tersegel TIDAK membuat labirin
       mustahil — ia cuma membuat sebagian labirin tidak berguna. Yang
       menentukan hanya satu: apakah pintu keluar tercapai dari titik mulai.

       Kesalahan yang sama bentuknya dengan bug MATCH: dua syarat yang
       terdengar sama, dan hanya satu yang benar-benar jadi aturan. */
    const bisa = hasil.every(h => h.langkah !== null && h.timpang === 0);
    const tersegel = hasil.filter(h => !h.semua);

    $('limaOut').innerHTML =
      hasil.map(h => 'Labirin <b>' + h.i + '</b>: keluar dalam <b>' +
        (h.langkah === null ? '—' : h.langkah + 1) + '</b> langkah &middot; ' +
        h.dicapai + '/64 sel tercapai' +
        (h.semua ? '' : ' <span class="z-bad">&larr; ' + (64 - h.dicapai) +
                        ' sel tersegel</span>') +
        ' &middot; ' + h.timpang + ' dinding timpang').join('<br>') +
      '<br><b class="' + (bisa ? 'z-ok' : 'z-bad') + '">' +
      (bisa ? 'Kelimanya bisa diselesaikan — klaim di maze.js terbukti.'
            : 'Ada labirin yang tidak bisa diselesaikan.') + '</b>' +
      (tersegel.length
        ? '<br><span class="z-note">Tapi labirin ' +
          tersegel.map(h => h.i).join(', ') + ' punya sel yang <b>tidak bisa ' +
          'dimasuki sama sekali</b> — kantong buntu yang tertutup rapat. ' +
          'Tidak merusak permainannya, dan justru itu yang membuatnya bertahan ' +
          'empat puluh tahun tanpa ada yang menyadarinya. Pembangkit pohon ' +
          'rentang <b>mustahil</b> menghasilkan sel seperti itu.</span>'
        : '');
  }

  $('genPohon').addEventListener('click', bangkitkan);
  $('genAcak').addEventListener('click', ukurAcak);
  $('genLima').addEventListener('click', periksaLima);
  $('genN').addEventListener('input', e => {
    $('genNv').textContent = e.target.value;
    bangkitkan();
  });

  bangkitkan();
})();
