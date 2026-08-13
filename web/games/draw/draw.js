/* ===========================================================================
   draw.js — port DRAW.BAS (Friendlyware, 30 Agustus 1982 11:00)

   Penyunting gambar karakter: kanvas 80 kolom x 19 baris, digambar dengan
   lima puluh karakter CP437 yang dipetakan ke tombol A-Y dan a-y.

   Tiga hal yang membentuk berkas ini:

   1. SHIFT BUKAN "HURUF BESAR" -- IA PASANGAN. DATA 2310 dan 2320 masing-masing
      berisi 25 kode, dan kode ke-n di kedua baris SELALU sepasang: A memberi
      sudut kiri-atas ganda, a memberi sudut kiri-BAWAH ganda; I memberi garis
      mendatar, i memberi garis tegak; L memberi blok penuh, l memberi blok
      setengah gelap. Satu tombol = satu pasang, dan Shift memilih pelengkapnya.
      Tidak ada satu baris pun di program ini yang menjelaskan itu.

   2. SEBUAH .PIC ADALAH SALINAN MENTAH MEMORI LAYAR. Baris 1750 memanggil
      `BLOAD KEEP$, 480` -- offset 480 = 80 kolom x 3 baris x 2 bita, yaitu
      persis tiga baris menu di atas. Berkas gambarnya bukan format; ia
      potongan RAM.

   3. DRAW.EXE HILANG DARI KOLEKSI. Baris 50 memuat 200 bita kode mesin ke
      &HE00 dan memanggilnya di dua titik masuk: `CODE=0` (baris 400, 2340)
      dan `CODE=&H40` (baris 2210). Polanya menunjukkan simpan-layar dan
      pulihkan-layar. Berkasnya tidak ada, jadi bagian itu dibangun ulang
      dari perilakunya, bukan dari isinya -- dan itu disebut di panel.
   =========================================================================== */
(function () {
  'use strict';

  const ui = window.RETRO.ui;
  const store = window.RETRO.store('draw');
  const q = (id) => document.getElementById(id);

  /* ======================================================================
     Bagian 1 — palet, DATA 2310 dan 2320 apa adanya
     ====================================================================== */
  const BAWAH = [200,188,186,202,185,197,192,217,179,193,180,177,176,221,220,
                 17,27,174,25,249,250,157,4,5,2];        /* ARRAY%(0,*) — a..y */
  const ATAS  = [201,187,205,203,204,206,218,191,196,194,195,219,178,222,223,
                 16,26,175,24,15,248,247,6,3,1];         /* ARRAY%(1,*) — A..Y */

  /* CP437 -> Unicode, hanya kode yang benar-benar dipakai palet ini. */
  const CP = {
    1:'☺', 2:'☻', 3:'♥', 4:'♦', 5:'♣', 6:'♠',
    15:'☼', 16:'►', 17:'◄', 24:'↑', 25:'↓',
    26:'→', 27:'←', 32:' ', 157:'¥', 174:'«', 175:'»',
    176:'░', 177:'▒', 178:'▓', 179:'│', 180:'┤',
    185:'╣', 186:'║', 187:'╗', 188:'╝', 191:'┐',
    192:'└', 193:'┴', 194:'┬', 195:'├', 196:'─',
    197:'┼', 200:'╚', 201:'╔', 202:'╩', 203:'╦',
    204:'╠', 205:'═', 206:'╬', 217:'┘', 218:'┌',
    219:'█', 220:'▄', 221:'▌', 222:'▐', 223:'▀',
    247:'≈', 248:'°', 249:'∙', 250:'·'
  };
  /* Peta di atas hanya memuat kode PALET. Baris 460 (mode AlphaNumeric) dan
     baris 470 (spasi) memasukkan kode ASCII biasa ke sel yang sama, jadi
     penerjemahnya harus melayani keduanya -- kalau tidak, menekan F5 lalu
     mengetik "HI" menghasilkan dua sel kosong yang tetap terhitung terisi:
     keadaan yang berubah tanpa gambar. */
  const glif = (k) => CP[k] || ((k >= 32 && k < 127) ? String.fromCharCode(k) : ' ');

  /* Enam belas warna CGA — urutan sama dengan COLOR di BASIC. */
  const CGA = ['#000000','#0000aa','#00aa00','#00aaaa','#aa0000','#aa00aa',
               '#aa5500','#aaaaaa','#555555','#5555ff','#55ff55','#55ffff',
               '#ff5555','#ff55ff','#ffff55','#ffffff'];

  /* ======================================================================
     Bagian 2 — kanvas. Baris 970-1000: X dijepit 4..22, Y 1..80, dan
     melewati tepi memindahkan kursor satu baris, bukan menahannya.
     ====================================================================== */
  const KOL = 80, BAR = 19;                 /* baris layar 4..22 = 19 baris */
  let sel = [], cx = 39, cy = 8;            /* X=12,Y=40 asli -> (8, 39)    */
  let fg = 7, bg = 0, alfanumerik = false;
  let simpanan = null;                       /* padanan "tempory.tmp"        */

  function kosong() {
    sel = [];
    for (let y = 0; y < BAR; y++) {
      const r = [];
      for (let x = 0; x < KOL; x++) r.push({ k: 32, f: 7, b: 0 });
      sel.push(r);
    }
  }

  /* Baris 970-1010 apa adanya, digeser ke indeks 0. */
  function jepit() {
    if (cx > KOL - 1) { if (cy < BAR - 1) { cy += 1; cx -= KOL; } else cx = KOL - 1; }
    if (cx < 0) { if (cy > 0) { cy -= 1; cx += KOL; } else cx = 0; }
    if (cy > BAR - 1) cy = BAR - 1;
    if (cy < 0) cy = 0;
  }

  function taruh(kode) {
    sel[cy][cx] = { k: kode, f: fg, b: bg };
    cx += 1; jepit();
  }

  /* ======================================================================
     Bagian 3 — gambar
     ====================================================================== */
  const kanvas = q('kanvas');
  let sl = null;
  function bangun() {
    kanvas.textContent = '';
    sl = [];
    for (let y = 0; y < BAR; y++) {
      const baris = document.createElement('div');
      baris.className = 'w-baris';
      const rr = [];
      for (let x = 0; x < KOL; x++) {
        const s = document.createElement('span');
        s.className = 'w-sel';
        s.addEventListener('click', () => { cx = x; cy = y; lukis(); });
        baris.append(s); rr.push(s);
      }
      kanvas.append(baris); sl.push(rr);
    }
  }
  function lukis() {
    for (let y = 0; y < BAR; y++)
      for (let x = 0; x < KOL; x++) {
        const c = sel[y][x], e = sl[y][x];
        const g = glif(c.k);
        if (e.textContent !== g) e.textContent = g;
        e.style.color = CGA[c.f]; e.style.background = CGA[c.b];
        e.classList.toggle('w-kursor', x === cx && y === cy);
      }
    q('s-pos').textContent = 'baris ' + (cy + 4) + ', kolom ' + (cx + 1);
    q('s-warna').textContent = fg + ' / ' + bg;
    q('s-mode').textContent = alfanumerik ? 'AlphaNumeric' : 'Graphics';
    q('s-isi').textContent = terisi();
  }
  const terisi = () => sel.reduce((s, r) => s + r.filter(c => c.k !== 32).length, 0);

  /* ======================================================================
     Bagian 4 — papan tombol palet
     ====================================================================== */
  function bilahPalet() {
    /* Baris 720-780: dua baris palet di bawah layar, "UPPER" dan "LOWER",
       dengan huruf tombolnya di antara keduanya. Disusun ulang jadi tombol
       yang bisa diklik -- tapi hurufnya tetap di tengah, seperti aslinya. */
    const luar = q('palet');
    luar.textContent = '';
    const b = document.createElement('div');
    b.className = 'w-palet';
    luar.append(b);
    [['UPPER', ATAS, true], [null, null, null], ['LOWER', BAWAH, false]]
      .forEach(([lbl, arr, besar]) => {
        const row = document.createElement('div');
        row.className = 'w-paletBaris';
        const t = document.createElement('span');
        t.className = 'w-paletLabel'; t.textContent = lbl || '';
        row.append(t);
        for (let i = 0; i < 25; i++) {
          const s = document.createElement('button');
          s.type = 'button';
          if (arr) {
            s.className = 'w-tombolGlif';
            s.textContent = glif(arr[i]);
            s.title = (besar ? 'Shift+' : '') + String.fromCharCode(65 + i);
            s.addEventListener('click', () => { taruh(arr[i]); lukis(); });
          } else {
            s.className = 'w-tombolHuruf'; s.disabled = true;
            s.textContent = String.fromCharCode(65 + i);
          }
          row.append(s);
        }
        b.append(row);
      });
  }

  /* ======================================================================
     Bagian 5 — tombol fungsi, baris 830-880
     ====================================================================== */
  function simpanGambar() {
    const n = (q('nama').value || '').toUpperCase().slice(0, 8).trim();
    if (!n) { pesan('Nama gambar kosong.'); return; }
    const d = store.get('pic') || {};
    d[n] = sel.map(r => r.map(c => [c.k, c.f, c.b]));
    store.set('pic', d);
    daftar(); pesan('Tersimpan sebagai ' + n + '.PIC');
  }
  function muatGambar(n) {
    const d = store.get('pic') || {};
    if (!d[n]) { pesan('File Was Not Found'); return; }
    sel = d[n].map(r => r.map(a => ({ k: a[0], f: a[1], b: a[2] })));
    lukis(); pesan('Dimuat: ' + n + '.PIC');
  }
  function hapusGambar(n) {
    const d = store.get('pic') || {};
    delete d[n]; store.set('pic', d); daftar(); pesan('Dihapus: ' + n);
  }
  function daftar() {
    const d = store.get('pic') || {};
    const nm = Object.keys(d).sort();
    q('daftar').innerHTML = nm.length
      ? nm.map(n => '<span class="w-file"><button type="button" data-n="' + n +
          '" class="btn btn--ghost btn--sm">' + n + '</button>' +
          '<button type="button" data-h="' + n + '" class="btn btn--ghost btn--sm w-x">×</button></span>').join('')
      : '<span class="w-kecil">PICTURE.FLE kosong</span>';
    q('daftar').querySelectorAll('[data-n]').forEach(b =>
      b.addEventListener('click', () => muatGambar(b.dataset.n)));
    q('daftar').querySelectorAll('[data-h]').forEach(b =>
      b.addEventListener('click', () => hapusGambar(b.dataset.h)));
  }
  function pesan(s) { q('pesan').textContent = s; }

  /* ======================================================================
     Bagian 6 — papan ketik, baris 440-710
     ====================================================================== */
  function tekan(e) {
    const k = e.key;
    let ditangani = true;
    if (k.length === 1) {
      if (alfanumerik) taruh(k.charCodeAt(0));            /* baris 460 */
      else if (k === ' ') taruh(32);                      /* baris 470 */
      else if (k >= 'A' && k <= 'Y') taruh(ATAS[k.charCodeAt(0) - 65]);
      else if (k >= 'a' && k <= 'y') taruh(BAWAH[k.charCodeAt(0) - 97]);
      else ditangani = false;
    } else if (k === 'ArrowUp') { cy -= 1; jepit(); }
    else if (k === 'ArrowDown') { cy += 1; jepit(); }
    else if (k === 'ArrowLeft') { if (e.ctrlKey) cx -= 10; else cx -= 1; jepit(); }
    else if (k === 'ArrowRight') { if (e.ctrlKey) cx += 10; else cx += 1; jepit(); }
    else if (k === 'PageUp') { cy -= 5; jepit(); }        /* baris 580 */
    else if (k === 'PageDown') { cy += 5; jepit(); }      /* baris 590 */
    else if (k === 'Home') { cx = 0; cy = 0; }            /* baris 600 */
    else if (k === 'End') { cx = KOL - 1; }               /* baris 610 */
    else if (k === 'Backspace') { cx -= 1; jepit(); sel[cy][cx] = { k: 32, f: fg, b: bg }; }
    else if (k === 'Delete') { sel[cy][cx] = { k: 32, f: fg, b: bg }; }
    else ditangani = false;
    if (ditangani) { e.preventDefault(); lukis(); }
  }

  /* ======================================================================
     Bagian 7 — bukti: pasangan palet dihitung dari DATA-nya sendiri
     ====================================================================== */
  (function bukti() {
    const PASANG = [
      ['sudut & cermin', [0, 1, 6, 7]],
      ['tegak lawan mendatar', [2, 8]],
      ['sambungan T dan silang', [3, 4, 5, 9, 10]],
      ['empat tingkat naungan', [11, 12]],
      ['separuh blok, kiri/kanan & atas/bawah', [13, 14]],
      ['panah berlawanan arah', [15, 16, 17, 18]],
      ['besar lawan kecil', [19, 20]],
      ['tak sepadan', [21]],
      ['kartu hitam lawan merah', [22, 23]],
      ['wajah putih lawan hitam', [24]]
    ];
    q('b-pasang').innerHTML = PASANG.map(([nm, idx]) =>
      '<tr><td>' + nm + '</td><td class="w-g">' +
      idx.map(i => String.fromCharCode(65 + i) + ' ' + glif(ATAS[i])).join('  ') +
      '</td><td class="w-g">' +
      idx.map(i => String.fromCharCode(97 + i) + ' ' + glif(BAWAH[i])).join('  ') +
      '</td></tr>').join('');
    q('b-jumlah').textContent = (ATAS.length + BAWAH.length);
    /* Adakah kode yang muncul dua kali di seluruh palet? */
    const semua = ATAS.concat(BAWAH);
    const ganda = semua.filter((v, i) => semua.indexOf(v) !== i);
    q('b-ganda').textContent = ganda.length ? ganda.join(', ') : 'tidak ada satu pun';
    q('b-offset').textContent = (KOL * 3 * 2);
  })();

  /* ======================================================================
     Bagian 8 — pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'Draw', source: 'DRAW.BAS · Friendlyware · 30 Agu 1982'
  }));
  kosong(); bangun(); bilahPalet(); daftar(); lukis();
  document.addEventListener('keydown', tekan);
  q('f4').addEventListener('click', simpanGambar);
  q('f6').addEventListener('click', () => {                /* baris 2780 */
    simpanan = sel.map(r => r.map(c => ({ k: c.k, f: c.f, b: c.b })));
    kosong(); cx = 39; cy = 8; lukis(); pesan('Layar dibersihkan.');
  });
  q('f2').addEventListener('click', () => {                /* baris 2190-2230 */
    if (!simpanan) { pesan('Belum ada gambar di memori.'); return; }
    sel = simpanan.map(r => r.map(c => ({ k: c.k, f: c.f, b: c.b })));
    lukis(); pesan('Gambar sebelumnya dipulihkan dari memori.');
  });
  q('f5').addEventListener('click', () => {                /* baris 2150-2170 */
    alfanumerik = !alfanumerik; lukis();
    pesan(alfanumerik ? 'You Are In AlphaNumeric Character Set'
                      : 'Kembali ke palet grafis.');
  });
  ['fg', 'bg'].forEach(id => q(id).addEventListener('change', () => {
    fg = Number(q('fg').value); bg = Number(q('bg').value); lukis();
  }));
  q('contoh').addEventListener('click', () => {
    /* Sebuah kotak berbingkai ganda, digambar HANYA dengan tombol palet —
       bukti bahwa pasangannya memang cukup untuk menggambar sesuatu. */
    kosong();
    const gambar = (x, y, kode) => { sel[y][x] = { k: kode, f: fg, b: bg }; };
    const x0 = 24, y0 = 4, w = 30, h = 8;
    gambar(x0, y0, ATAS[0]); gambar(x0 + w, y0, ATAS[1]);
    gambar(x0, y0 + h, BAWAH[0]); gambar(x0 + w, y0 + h, BAWAH[1]);
    for (let i = 1; i < w; i++) { gambar(x0 + i, y0, ATAS[2]); gambar(x0 + i, y0 + h, ATAS[2]); }
    for (let j = 1; j < h; j++) { gambar(x0, y0 + j, BAWAH[2]); gambar(x0 + w, y0 + j, BAWAH[2]); }
    /* Isi kotak diletakkan dari UKURAN KOTAKNYA, bukan dari angka yang
       ditulis tangan. Versi pertama memakai `x0+8 + i*6 + j`, yang meleset
       dua sel melewati bingkai kanan -- bilah naungannya luber keluar kotak.
       Sekarang keduanya dipusatkan terhadap lebar dalam kotak, jadi tidak
       bisa keluar berapa pun ukurannya. */
    const dalam = w - 1;                       /* sel yang bisa dipakai      */
    const kiri = x0 + 1;

    const judul = 'FRIENDLYWARE  DRAW';
    const jx = kiri + Math.max(0, Math.floor((dalam - judul.length) / 2));
    for (let i = 0; i < judul.length && jx + i < x0 + w; i++)
      sel[y0 + 2][jx + i] = { k: judul.charCodeAt(i), f: 14, b: bg };

    const naungan = [ATAS[11], ATAS[12], BAWAH[11], BAWAH[12]];   /* █ ▓ ▒ ░ */
    const pita = Math.max(1, Math.floor(dalam / (naungan.length + 1)));
    const lebarBilah = pita * naungan.length;
    const bx = kiri + Math.floor((dalam - lebarBilah) / 2);
    naungan.forEach((k, i) => {
      for (let j = 0; j < pita; j++) {
        const x = bx + i * pita + j;
        if (x > x0 && x < x0 + w) gambar(x, y0 + 4, k);
      }
    });
    cx = x0; cy = y0; lukis();
    pesan('Contoh digambar dengan tombol A B C a b c L M l m saja.');
  });
})();
