/* ===========================================================================
   simeqn.js — port dari SIMEQN.BAS (Phil Feldman & Tom Rugg, 1982).

   Lima puluh baris, dan BARIS TERPANJANGNYA CUMA 50 KOLOM — terpendek di
   koleksi. Itu bukan kebetulan; lihat baris 130.

   ------------------------------------------------------------------------
   "Any BASIC, any CRT."

       130 REM: Any BASIC, any CRT.

   Satu kalimat, dan ia menjelaskan seluruh bentuk program ini. Perkakas
   bahasa yang dipakai: `BEEP`, `SWAP`, `DEFINT`, `STRING$`, `COLOR`. Itu
   saja. Tidak ada `LOCATE`, tidak ada `SCREEN 1`, tidak ada `PEEK`/`POKE`,
   tidak ada `ON KEY`.

   Bandingkan dengan program Friendlyware mana pun di koleksi ini, yang penuh
   `LOCATE` dan `POKE 106,0`. Feldman & Rugg membatasi diri pada irisan bahasa
   yang ada di SEMUA mesin, supaya programnya bisa diketik ulang dari majalah
   di Apple II, TRS-80, atau IBM PC tanpa satu pun perubahan.

   Harganya: tampilannya polos, dan tata letaknya seluruhnya lewat `PRINT`
   dan `TAB`. Imbalannya: ini satu-satunya kelompok program di koleksi yang
   secara teori masih jalan di mana pun.

   ------------------------------------------------------------------------
   DEFINT SEBAGAI KONVENSI MATEMATIKA

       150 CLEAR:CLS:DEFINT J,K,L,M,N

   Lima huruf itu dijadikan bilangan bulat; `A`, `R`, `V` dibiarkan pecahan.
   Itu bukan penghematan memori — itu konvensi matematika (i, j, k untuk
   indeks) yang dipetakan ke sistem tipe BASIC. Pembaca yang melihat `J`
   langsung tahu ia indeks, bukan koefisien.

   ------------------------------------------------------------------------
   PENYELESAINYA DIPINDAH KE _shared/gauss.js

   Baris 390-590 program ini SAMA PERSIS dengan baris 780-980 CURVE.BAS.
   Dua puluh satu baris yang disalin-tempel, karena BASIC tidak punya cara
   berbagi kode. Di port ini keduanya memanggil satu modul — dan itu satu-
   satunya perbedaan struktural yang berarti antara versi 1982 dan versi ini.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, gauss } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const db = store('simeqn');
  const MAKS = 8;
  let n = 3;

  /* --------------------------------------------------------------------
     Kisi masukan. Aslinya menanyakan tiap koefisien satu per satu lewat
     `INPUT` (baris 290-320) — N² + N pertanyaan berturut-turut, tanpa cara
     mundur kalau salah ketik. Di sini semuanya terlihat sekaligus.
     -------------------------------------------------------------------- */
  function bangunKisi() {
    const host = $('grid');
    host.textContent = '';
    host.style.gridTemplateColumns = 'repeat(' + n + ', minmax(0,1fr)) 24px 90px';

    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        const sel = ui.el('div', { class: 'q-sel' });
        const inp = ui.el('input', { type: 'number', step: 'any',
                                     id: 'a' + j + '_' + k, value: '0' });
        inp.addEventListener('input', () => { $('out').textContent = ''; });
        sel.append(inp, ui.el('span', { class: 'q-var', html: 'x<sub>' + (k + 1) + '</sub>' }));
        host.append(sel);
      }
      host.append(ui.el('div', { class: 'q-eq', text: '=' }));
      const rhs = ui.el('input', { type: 'number', step: 'any',
                                   id: 'r' + j, value: '0', class: 'q-rhs' });
      host.append(rhs);
    }
    contohkan();
  }

  /* Contoh bawaan supaya halaman tidak terbuka dengan kisi nol semua —
     sistem 3×3 dengan jawaban bulat (x = 2, 3, −1), jadi kebenarannya bisa
     diperiksa mata tanpa kalkulator. */
  function contohkan() {
    const A = [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]];
    const r = [8, -11, -3];
    if (n !== 3) return;
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) $('a' + j + '_' + k).value = A[j][k];
      $('r' + j).value = r[j];
    }
  }

  const baca = () => {
    const A = [], r = [];
    for (let j = 0; j < n; j++) {
      const baris = [];
      for (let k = 0; k < n; k++) baris.push(Number($('a' + j + '_' + k).value) || 0);
      A.push(baris);
      r.push(Number($('r' + j).value) || 0);
    }
    return { A, r };
  };

  function selesaikan() {
    const { A, r } = baca();
    const h = gauss.solve(A, r);
    const out = $('out');
    out.textContent = '';

    if (h.singular) {
      audio.play('MB T200 O2 L8 f d', { fresh: true });
      out.append(ui.el('p', { class: 'q-bad',
        text: 'Sistem ini singular — tidak punya jawaban tunggal.' }));
      out.append(ui.el('p', { class: 'q-note',
        text: 'Aslinya tidak memeriksa ini: baris 500 membagi dengan A(K,K) '
            + 'tanpa menanyakan apakah nilainya nol. Lihat panel di samping.' }));
      return;
    }

    audio.play('MB T200 O2 L16 c e g', { fresh: true });
    /* Baris 340-370: "The solution is", lalu X1..Xn. Bentuknya dipertahankan,
       termasuk penamaan X1 (bukan x₀) — aslinya mulai dari satu. */
    const p = ui.el('p', { class: 'q-judul', text: 'The solution is' });
    out.append(p);
    const daftar = ui.el('div', { class: 'q-jawab' });
    h.v.forEach((val, i) => {
      daftar.append(ui.el('div', { html: '<b>X' + (i + 1) + '</b> = ' + rapi(val) }));
    });
    out.append(daftar);

    /* Sisa: A·v dibandingkan dengan r. Aslinya tidak melakukan ini —
       ia mencetak jawabannya dan berhenti. Ditambahkan karena eliminasi Gauss
       bisa kehilangan ketelitian, dan satu-satunya cara tahu adalah
       memasukkan jawabannya kembali. */
    let maksSisa = 0;
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += A[j][k] * h.v[k];
      maksSisa = Math.max(maksSisa, Math.abs(s - r[j]));
    }
    out.append(ui.el('p', { class: 'q-note',
      html: 'Sisa terbesar |A&middot;x &minus; r| = <b>' +
            maksSisa.toExponential(2) + '</b> — dimasukkan kembali untuk diperiksa.' }));

    const jej = ui.el('details', { class: 'q-jejak' });
    jej.append(ui.el('summary', { text: 'Langkah eliminasinya' }));
    h.langkah.forEach(l => jej.append(ui.el('p', { class: 'q-note', text: l })));
    out.append(jej);

    db.set('n', n);
  }

  const rapi = (v) => {
    if (!isFinite(v)) return String(v);
    const b = Math.round(v);
    return Math.abs(v - b) < 1e-9 ? String(b) : v.toPrecision(8).replace(/0+$/, '');
  };

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Simultaneous Equations',
    source: 'SIMEQN.BAS · Phil Feldman & Tom Rugg · 1982',
    backHref: '../../index.html'
  }));

  $('n').addEventListener('input', e => {
    n = Math.max(1, Math.min(MAKS, Number(e.target.value) || 1));
    $('nv').textContent = n;
    $('out').textContent = '';
    bangunKisi();
  });
  $('go').addEventListener('click', selesaikan);
  $('nol').addEventListener('click', () => {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) $('a' + j + '_' + k).value = 0;
      $('r' + j).value = 0;
    }
    $('out').textContent = '';
  });
  /* Contoh singular: baris kedua kelipatan persis baris pertama. */
  $('sing').addEventListener('click', () => {
    if (n < 2) { $('n').value = 3; $('n').dispatchEvent(new Event('input')); }
    const A = [[1, 2, 3], [2, 4, 6], [1, 1, 1]], r = [6, 12, 3];
    for (let j = 0; j < Math.min(n, 3); j++) {
      for (let k = 0; k < Math.min(n, 3); k++) $('a' + j + '_' + k).value = A[j][k];
      $('r' + j).value = r[j];
    }
    $('out').textContent = '';
  });

  n = db.get('n', 3);
  $('n').value = n; $('nv').textContent = n;
  bangunKisi();
})();
