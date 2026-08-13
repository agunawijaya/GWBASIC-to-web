/* ===========================================================================
   piechart.js — port dari PIECHART.BAS (IBM Corp, 1981-82).

   Program IBM resmi, 77 baris, dan ia memuat contoh terbaik di koleksi ini
   tentang PESAN GALAT YANG BERGUNA — serta sebuah bug warna yang bertahan di
   perangkat lunak berlisensi.

   ------------------------------------------------------------------------
   1. PESAN GALAT YANG BISA LANGSUNG DIJALANKAN

       1292 ON ERROR GOTO 1295
       1293 PLAY "p16"
       1294 GOTO 1300
       1295 COLOR 31,0,0
       1296 PRINT "THIS PROGRAM REQUIRES ADVANCED BASIC -- USE COMMAND 'BASICA'"

   Perhatikan baris 1293. `PLAY "p16"` adalah jeda seperenam belas nada —
   TIDAK BERBUNYI, tidak mengubah apa pun. Ia ada semata-mata untuk MEMICU
   GALAT kalau penafsirnya bukan Advanced BASIC, karena `PLAY` hanya ada di
   sana. Sebuah uji kemampuan yang dilakukan dengan menjalankan hal yang
   paling tidak berbahaya yang bisa ditemukan.

   Dan pesannya sendiri menyebut PERINTAH PERSIS yang harus diketik. Bandingkan
   dengan tiga cara lain menangani hal yang sama di koleksi ini:

       INTRO.BAS     semua galat -> keluar diam-diam
       15PUZZLE.BAS  mendeteksi, memberi tahu, tetap lanjut
       PIECHART.BAS  memberi tahu APA masalahnya dan APA perintah perbaikannya

   ------------------------------------------------------------------------
   2. POTONGAN KEEMPAT TIDAK PUNYA WARNA

       1630 PAINT (CX+COS(AA)*0.8*SR, CY-SIN(AA)*0.8*SR), C MOD 4, 1

   `C` berjalan 1..N, jadi `C MOD 4` menghasilkan 1, 2, 3, 0, 1, 2, 3, 0, ...
   Di SCREEN 1, warna 0 adalah WARNA LATAR. Jadi potongan keempat, kedelapan,
   kedua belas... dicat dengan warna latar — tampak kosong, seolah tidak ada
   potongan di sana.

   Bug ini ada di produk IBM berlisensi, dan ia hanya muncul kalau grafik Anda
   punya empat potongan atau lebih. Tiga potongan: sempurna. Empat: satu
   hilang.

   Port ini memakai empat warna yang keempatnya terlihat, dan menyediakan
   tombol untuk MELIHAT bug aslinya.

   ------------------------------------------------------------------------
   3. LINGKARAN YANG SENGAJA DIPEPATKAN

       1620 CIRCLE (CX,CY),SR,1,-A1-0.001,-A2,5/6

   Parameter terakhir adalah rasio aspek. Layar CGA 320x200 pada monitor 4:3
   punya piksel yang lebih tinggi daripada lebar: (4/3)/(320/200) = 5/6. Jadi
   supaya lingkaran TERLIHAT bulat, ia harus digambar pepat 5/6.

   Sudut negatif (-A1, -A2) punya arti khusus di GW-BASIC: gambar juga garis
   dari pusat ke ujung busur. Itulah yang membuat sebuah busur jadi POTONGAN
   PAI, dalam satu perintah.

   Dan `-A1-0.001` bukan salah ketik: sudut awal dan akhir yang sama persis
   akan menggambar busur nol, jadi sedikit dimundurkan supaya potongan pertama
   tidak lenyap.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };

  const db = store('piechart');

  /* Empat warna CGA SCREEN 1 palet 1 — persis yang tersedia bagi program ini.
     Indeks 0 adalah latar, dan itulah sumber bugnya. */
  const CGA = ['#000000', '#55ffff', '#ff55ff', '#ffffff'];
  const CGA_NAMA = ['hitam (latar)', 'sian', 'magenta', 'putih'];
  /* Palet port: empat warna yang KEEMPATNYA terlihat. */
  const WARNA = ['#4dd0a7', '#f0a13c', '#7aa7ff', '#e06c8a'];

  const CONTOH = 'Sewa,3200\nGaji,8600\nBahan,2100\nListrik,900\nLain-lain,700';
  let bugAsli = false;

  function baca() {
    const out = [];
    $('data').value.split(/[\n;]+/).forEach(b => {
      const t = b.trim();
      if (!t) return;
      const k = t.lastIndexOf(',');
      if (k < 0) return;
      const nama = t.slice(0, k).trim();
      const v = Number(t.slice(k + 1));
      if (nama && isFinite(v) && v > 0) out.push({ nama, v });
    });
    return out.slice(0, 100);                    // baris 1300: DIM R(100)
  }

  function gambar() {
    const data = baca();
    const host = $('chart');
    host.textContent = '';
    $('msg').textContent = '';
    if (!data.length) { $('msg').textContent = 'Belum ada data.'; return; }

    const total = data.reduce((s, d) => s + d.v, 0);   // baris 1500
    const W = 420, H = 300, CX = 200, CY = 150;
    const SR = 92, LR = 104;                            // baris 1440: SR=44, LR=50
    const svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'p-svg',
                            role: 'img', 'aria-label': 'diagram pai' });

    const judul = $('title').value.trim();
    if (judul) {
      const t = mk('text', { class: 'p-title', x: CX, y: 20, 'text-anchor': 'middle' });
      t.textContent = judul;
      svg.append(t);
      /* Baris 1560: kotak di sekeliling judul, digambar dengan LINE ... ,B */
      svg.append(mk('rect', { class: 'p-titlebox', x: CX - judul.length * 4 - 8,
                              y: 7, width: judul.length * 8 + 16, height: 18 }));
    }

    let a2 = 0;
    data.forEach((d, i) => {
      const c = i + 1;                                  // baris 1570: C=1 TO N
      const a1 = a2;
      a2 = a2 + (d.v / total) * 2 * Math.PI;            // baris 1580
      const aa = (a1 + a2) / 2;                         // baris 1590

      /* Baris 1600-1610: pusat tiap potongan digeser KELUAR sejauh LR-SR
         sepanjang garis baginya. Jadi pai ini SELALU meledak, bukan pilihan —
         tidak ada satu baris pun yang bisa mematikannya. */
      const cx = CX + Math.cos(aa) * (LR - SR);
      const cy = CY - Math.sin(aa) * (LR - SR);

      const isi = bugAsli ? CGA[c % 4] : WARNA[i % WARNA.length];

      /* Titik pada sudut a: (cx + R cos a, cy − R sin a). Tanda minus pada y
         karena sumbu y SVG menunjuk ke bawah, sementara sudut matematika naik
         berlawanan arah jarum jam.

         Akibatnya, sudut yang MEMBESAR bergerak berlawanan jarum jam di layar,
         dan bendera sapuan SVG harus 0 — bukan 1. Versi pertama memakai sudut
         negatif dengan sapuan 1, dan potongannya saling menimpa.

         Jari-jarinya SAMA untuk x dan y: lingkaran sungguhan. Rasio 5/6 di
         baris 1620 aslinya adalah koreksi untuk piksel CGA yang tidak persegi
         — memakainya di sini justru akan MEMEPATKAN lingkaran yang sudah
         bulat. Lihat panel "Lingkaran yang sengaja dipepatkan". */
      const x1 = cx + Math.cos(a1) * SR, y1 = cy - Math.sin(a1) * SR;
      const x2 = cx + Math.cos(a2) * SR, y2 = cy - Math.sin(a2) * SR;
      const besar = (a2 - a1) > Math.PI ? 1 : 0;
      svg.append(mk('path', {
        class: 'p-slice', fill: isi,
        d: 'M' + cx.toFixed(2) + ',' + cy.toFixed(2) +
           ' L' + x1.toFixed(2) + ',' + y1.toFixed(2) +
           ' A' + SR + ',' + SR + ' 0 ' + besar + ' 0 ' +
           x2.toFixed(2) + ',' + y2.toFixed(2) + ' Z'
      }));

      /* Baris 1640-1660: label ditaruh di luar busur, sepanjang garis bagi,
         dengan garis bawah di bawahnya. */
      const lx = cx + Math.cos(aa) * (SR + 18);
      const ly = cy - Math.sin(aa) * (SR + 18);
      const t = mk('text', { class: 'p-lab', x: lx, y: ly,
                             'text-anchor': Math.cos(aa) < -0.2 ? 'end'
                               : Math.cos(aa) > 0.2 ? 'start' : 'middle' });
      t.textContent = d.nama + ' ' + Math.round((d.v / total) * 100) + '%';
      svg.append(t);
    });

    host.append(svg);

    const ket = $('legend');
    ket.textContent = '';
    data.forEach((d, i) => {
      const c = i + 1;
      const isi = bugAsli ? CGA[c % 4] : WARNA[i % WARNA.length];
      const baris = ui.el('div', { class: 'p-key' });
      baris.append(ui.el('i', { style: 'background:' + isi }));
      baris.append(ui.el('span', {
        text: d.nama + ' — ' + d.v.toLocaleString('id-ID') +
              ' (' + ((d.v / total) * 100).toFixed(1) + '%)'
      }));
      if (bugAsli && c % 4 === 0) {
        baris.append(ui.el('b', { class: 'p-hilang', text: '← dicat warna latar' }));
      }
      ket.append(baris);
    });

    if (bugAsli && data.length >= 4) {
      $('msg').innerHTML = '<b class="p-hilang">Potongan ke-4, ke-8, &hellip; ' +
        'dicat dengan <code>C MOD 4</code> = 0 &mdash; warna latar. ' +
        'Itu bug baris 1630, apa adanya.</b>';
    }
    db.set('data', $('data').value);
    db.set('title', $('title').value);
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'IBM Piechart',
    source: 'PIECHART.BAS · IBM Corp · 1981-82',
    backHref: '../../index.html'
  }));

  $('go').addEventListener('click', gambar);
  $('data').addEventListener('input', gambar);
  $('title').addEventListener('input', gambar);
  $('bug').addEventListener('click', () => {
    bugAsli = !bugAsli;
    $('bug').setAttribute('aria-pressed', String(bugAsli));
    $('bug').textContent = bugAsli ? 'Pakai warna port' : 'Pakai warna CGA asli';
    audio.sound(bugAsli ? 300 : 600, 0.06);
    gambar();
  });
  $('contoh').addEventListener('click', () => {
    $('title').value = 'Pengeluaran bulanan';
    $('data').value = CONTOH;
    gambar();
  });

  $('title').value = db.get('title', 'Pengeluaran bulanan');
  $('data').value = db.get('data', CONTOH);
  gambar();
})();
