/* ===========================================================================
   peta.js — menggambar peta alur program dari satu deklarasi.

   KENAPA DIGAMBAR SENDIRI, BUKAN PAKAI MERMAID DI HALAMAN

   Halaman ini harus jalan dari `file://` tanpa jaringan, jadi tidak boleh ada
   pustaka dari CDN. Tapi dokumen di `docs/` justru paling enak memakai
   Mermaid, karena penampil Markdown mana pun sudah bisa menggambarnya.

   Dua keluaran, satu sumber:

       arsitektur (data)
            |
            +--> gambar()   -> SVG sebaris, untuk halaman
            +--> mermaid()  -> teks Mermaid, untuk docs/*.md

   Kalau dua-duanya ditulis tangan, cepat atau lambat gambarnya bercerita hal
   yang berbeda dari kodenya. Itu jenis cacat yang paling sering menggigit
   proyek ini, dan seluruh penelusur ini dibangun untuk mencegahnya.

   BENTUK DATANYA

       arsitektur: {
         simpul: [
           { id: 'siap', baris: '10', jenis: 'mulai',
             teks: ['Siapkan layar 80x25', 'pasang penangkap galat'] },
           ...
         ],
         panah: [
           { dari: 'siap', ke: 'jebakan', label: 'GOSUB 500' },
           { dari: 'ulang', ke: 'tunggu', label: 'GOTO 260' },
           ...
         ]
       }

   `teks` sengaja berupa larik baris pendek, bukan satu kalimat panjang yang
   dipatah otomatis. Yang menulis peta harus memilih sendiri di mana barisnya
   patah — pematah otomatis selalu memilih tempat yang salah.

   Arah panah ditentukan dari urutan simpul, bukan dari tangan:
     - ke simpul tepat di bawahnya      -> panah lurus
     - ke simpul yang lebih bawah lagi  -> lengkung di kiri (melewati)
     - ke simpul di atasnya             -> lengkung di kanan (gelung)

   Jadi gelung selalu di kanan dan lompatan-maju selalu di kiri, di seluruh
   program. Sekali paham satu peta, dua puluh peta berikutnya terbaca sendiri.
   =========================================================================== */

(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* Ukuran. Semuanya dalam satuan viewBox; halaman yang menskalakannya. */
  var W = 360;          /* lebar kotak                          */
  var PAD_Y = 12;       /* jarak isi ke tepi atas/bawah kotak   */
  var H_JUDUL = 17;     /* tinggi baris nomor baris             */
  var H_BARIS = 17;     /* tinggi tiap baris teks               */
  var JARAK = 40;       /* ruang antar kotak, tempat panah      */
  var LAJUR = 26;       /* jarak antar lajur lengkung           */
  var TEPI = 14;
  /* Satuan viewBox -> piksel. Dipatok supaya kotak dan hurufnya berukuran
     SAMA di semua program: sekali mata terbiasa dengan satu peta, dua puluh
     peta berikutnya tidak perlu dibaca ulang dari nol. */
  var ESKALA = 0.85;

  var nomorMarker = 0;  /* id unik per SVG, supaya panah tidak saling curi */

  /* --- perhitungan tinggi tiap simpul ------------------------------------- */

  function tinggi(simpul) {
    return PAD_Y * 2 + H_JUDUL + H_BARIS * simpul.teks.length;
  }

  /* Klasifikasi panah dari urutan simpulnya. Ini yang membuat arah lengkung
     konsisten tanpa penulis peta perlu memikirkannya. */
  function golongkan(panah, indeks) {
    var a = indeks[panah.dari], b = indeks[panah.ke];
    if (a === undefined || b === undefined) return null;
    if (b === a + 1) return 'lurus';
    if (b > a) return 'lewat';     /* melompati simpul di antaranya */
    return 'balik';                /* gelung ke atas                */
  }

  /* --- SVG ----------------------------------------------------------------- */

  function el(nama, sifat) {
    var e = document.createElementNS(NS, nama), k;
    for (k in sifat) if (sifat[k] !== null) e.setAttribute(k, sifat[k]);
    return e;
  }

  function gambar(arsitektur) {
    var simpul = arsitektur.simpul, panah = arsitektur.panah || [];
    var indeks = {}, i;
    for (i = 0; i < simpul.length; i++) indeks[simpul[i].id] = i;

    /* 1. Tata letak: satu kolom, tinggi tiap kotak menurut isinya. */
    var atas = [], y = TEPI;
    for (i = 0; i < simpul.length; i++) {
      atas.push(y);
      y += tinggi(simpul[i]) + JARAK;
    }
    var tinggiTotal = y - JARAK + TEPI;

    /* 2. Bagikan lajur untuk lengkung, supaya dua gelung tidak bertumpuk.
          Lajur dihitung dari panjang lompatannya: yang paling jauh di luar. */
    var kiri = [], kanan = [];
    for (i = 0; i < panah.length; i++) {
      var jenis = golongkan(panah[i], indeks);
      panah[i]._jenis = jenis;
      if (jenis === 'lewat') kiri.push(panah[i]);
      else if (jenis === 'balik') kanan.push(panah[i]);
    }
    urutkanLajur(kiri, indeks);
    urutkanLajur(kanan, indeks);

    var lajurKiri = kiri.length ? maksLajur(kiri) + 1 : 0;
    var x0 = TEPI + lajurKiri * LAJUR;

    /* Label ikut menentukan lebar gambar. Tanpa ini `GOTO 260` terpotong jadi
       `GOTO 26` di tepi kanan — dan nomor baris yang salah baca lebih buruk
       daripada tidak ada label sama sekali. Lebar huruf ditaksir dari font
       monospace 10,5px; taksiran yang sedikit kelebihan tidak merugikan. */
    var kananMaks = x0 + W, kiriMin = x0, xL;
    for (i = 0; i < kanan.length; i++) {
      xL = x0 + W + 16 + kanan[i]._lajur * LAJUR;
      kananMaks = Math.max(kananMaks, xL + 7 + lebarLabel(kanan[i].label));
    }
    for (i = 0; i < kiri.length; i++) {
      xL = x0 - 16 - kiri[i]._lajur * LAJUR;
      kiriMin = Math.min(kiriMin, xL + 6 - lebarLabel(kiri[i].label));
    }

    var vbX = Math.min(0, kiriMin - TEPI);
    var vbW = kananMaks + TEPI - vbX;

    /* 3. Bangun SVG. */
    var id = 'panah-' + (++nomorMarker);
    var svg = el('svg', {
      viewBox: vbX + ' 0 ' + vbW + ' ' + tinggiTotal,
      /* Ukuran piksel dipatok, BUKAN diserahkan ke lebar kolom. Kalau peta
         diberi `width:100%`, program yang alurnya lebar (CHECK punya empat
         RETURN yang masing-masing perlu lajurnya sendiri) akan menyusut
         sampai hurufnya tidak terbaca — dan gambar yang tidak terbaca sama
         saja dengan tidak ada gambar. Yang lebar menggulung mendatar. */
      width: Math.round(vbW * ESKALA),
      height: Math.round(tinggiTotal * ESKALA),
      class: 'peta',
      role: 'img',
      'aria-label': arsitektur.judul || 'Peta alur program'
    });

    var defs = el('defs');
    var marker = el('marker', {
      id: id, viewBox: '0 0 10 10', refX: '9', refY: '5',
      markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse'
    });
    marker.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 z', class: 'peta__mata' }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    /* Panah digambar LEBIH DULU supaya kotak menutupinya, bukan sebaliknya.
       SVG tidak punya z-index; urutan dokumen adalah urutan lapisan. */
    var lapisPanah = el('g', { class: 'peta__panah-lapis' });
    var lapisLabel = el('g');       /* label SESUDAH semua garis */
    var lapisKotak = el('g');
    svg.appendChild(lapisPanah);
    svg.appendChild(lapisLabel);
    svg.appendChild(lapisKotak);

    for (i = 0; i < panah.length; i++) {
      gambarPanah(lapisPanah, lapisLabel, panah[i], simpul, indeks, atas, x0, id);
    }
    for (i = 0; i < simpul.length; i++) {
      gambarKotak(lapisKotak, simpul[i], x0, atas[i]);
    }
    return svg;
  }

  /* Lompatan yang lebih panjang mendapat lajur lebih luar, supaya lengkungnya
     tidak pernah memotong lengkung yang lebih pendek. */
  function urutkanLajur(daftar, indeks) {
    daftar.sort(function (p, q) {
      return jarak(p, indeks) - jarak(q, indeks);
    });
    for (var i = 0; i < daftar.length; i++) daftar[i]._lajur = i;
  }
  function jarak(p, indeks) {
    return Math.abs(indeks[p.ke] - indeks[p.dari]);
  }
  function lebarLabel(teks) { return teks ? teks.length * 6.4 : 0; }

  /* Dua panah antara pasangan simpul yang SAMA punya titik tengah yang sama,
     jadi labelnya akan bertumpuk persis. Tiap lajur digeser satu baris ke
     bawah supaya keduanya terbaca. Ditemukan oleh diagram keadaan TOWERS,
     yang punya tiga panah antara dua simpul yang sama. */
  function tengahLabel(yA, hA, yB, hB, lajur) {
    return (yA + hA / 2 + yB + hB / 2) / 2 + (lajur || 0) * 15;
  }

  function maksLajur(daftar) {
    var m = 0;
    for (var i = 0; i < daftar.length; i++) m = Math.max(m, daftar[i]._lajur);
    return m;
  }

  function gambarKotak(induk, s, x, y) {
    var h = tinggi(s), i;
    var g = el('g', { class: 'peta__simpul peta__simpul--' + (s.jenis || 'proses') });

    if (s.jenis === 'putusan') {
      /* Segi enam mendatar — bentuk baku "ada pilihan di sini". */
      var c = 18;
      g.appendChild(el('path', {
        class: 'peta__kotak',
        d: 'M' + (x + c) + ',' + y + ' H' + (x + W - c) +
           ' L' + (x + W) + ',' + (y + h / 2) +
           ' L' + (x + W - c) + ',' + (y + h) + ' H' + (x + c) +
           ' L' + x + ',' + (y + h / 2) + ' Z'
      }));
    } else {
      /* Simpul diagram keadaan selalu membulat — itu bentuk bakunya, dan yang
         membedakannya sekilas dari kotak flowchart. */
      var r = (s.jenis === 'mulai' || s.jenis === 'keluar') ? h / 2
            : (s.jenis === 'keadaan' ? 16 : 8);
      g.appendChild(el('rect', {
        class: 'peta__kotak', x: x, y: y, width: W, height: h, rx: r, ry: r
      }));
      if (s.jenis === 'subrutin') {
        /* Dua garis tegak di sisi — lambang baku subrutin sejak diagram
           alir kertas: "isinya dijelaskan di tempat lain". */
        g.appendChild(el('line', { class: 'peta__bilah',
          x1: x + 12, y1: y, x2: x + 12, y2: y + h }));
        g.appendChild(el('line', { class: 'peta__bilah',
          x1: x + W - 12, y1: y, x2: x + W - 12, y2: y + h }));
      }
    }

    var tx = x + W / 2;
    var judul = el('text', { class: 'peta__baris', x: tx, y: y + PAD_Y + 12,
                             'text-anchor': 'middle' });
    judul.textContent = 'baris ' + s.baris;
    g.appendChild(judul);

    for (i = 0; i < s.teks.length; i++) {
      var t = el('text', { class: 'peta__teks', x: tx,
                           y: y + PAD_Y + H_JUDUL + 12 + i * H_BARIS,
                           'text-anchor': 'middle' });
      t.textContent = s.teks[i];
      g.appendChild(t);
    }
    induk.appendChild(g);
  }

  function gambarPanah(induk, indukLabel, p, simpul, indeks, atas, x0, marker) {
    var a = indeks[p.dari], b = indeks[p.ke];
    if (a === undefined || b === undefined) return;

    var yA = atas[a], hA = tinggi(simpul[a]);
    var yB = atas[b], hB = tinggi(simpul[b]);
    var d, xL, labelX, labelY;

    if (a === b) {
      /* Gelung ke diri sendiri — bentuknya harus khusus. Kalau dipakaikan
         rumus gelung biasa, kedua ujungnya jatuh di titik yang sama dan yang
         keluar cuma coretan sebesar dua piksel. Yang benar: keluar dari sisi
         kanan sedikit di atas tengah, memutar, dan masuk lagi sedikit di
         bawahnya — sehingga terbaca sebagai "kembali ke sini". */
      xL = x0 + W + 16 + p._lajur * LAJUR;
      var yAtas = yA + hA / 2 - 11, yBawah = yA + hA / 2 + 11;
      d = 'M' + (x0 + W) + ',' + yAtas +
          ' H' + (xL - 8) + ' Q' + xL + ',' + yAtas + ' ' + xL + ',' + (yAtas + 8) +
          ' V' + (yBawah - 8) +
          ' Q' + xL + ',' + yBawah + ' ' + (xL - 8) + ',' + yBawah +
          ' H' + (x0 + W);
      labelX = xL + 7;
      labelY = yA + hA / 2 + 4;

    } else if (p._jenis === 'lurus') {
      d = 'M' + (x0 + W / 2) + ',' + (yA + hA) + ' V' + yB;
      labelX = x0 + W / 2 + 8;
      labelY = (yA + hA + yB) / 2 + 4;

    } else if (p._jenis === 'lewat') {
      /* Keluar dari sisi kiri, turun di lajur kiri, masuk lagi dari kiri. */
      xL = x0 - 16 - p._lajur * LAJUR;
      d = 'M' + x0 + ',' + (yA + hA / 2) +
          ' H' + (xL + 10) + ' Q' + xL + ',' + (yA + hA / 2) + ' ' + xL + ',' + (yA + hA / 2 + 10) +
          ' V' + (yB + hB / 2 - 10) +
          ' Q' + xL + ',' + (yB + hB / 2) + ' ' + (xL + 10) + ',' + (yB + hB / 2) +
          ' H' + x0;
      labelX = xL + 6;
      labelY = tengahLabel(yA, hA, yB, hB, p._lajur);

    } else {
      /* Gelung: keluar kanan, naik di lajur kanan, masuk lagi dari kanan. */
      xL = x0 + W + 16 + p._lajur * LAJUR;
      d = 'M' + (x0 + W) + ',' + (yA + hA / 2) +
          ' H' + (xL - 10) + ' Q' + xL + ',' + (yA + hA / 2) + ' ' + xL + ',' + (yA + hA / 2 - 10) +
          ' V' + (yB + hB / 2 + 10) +
          ' Q' + xL + ',' + (yB + hB / 2) + ' ' + (xL - 10) + ',' + (yB + hB / 2) +
          ' H' + (x0 + W);
      labelX = xL + 6;
      labelY = tengahLabel(yA, hA, yB, hB, p._lajur);
    }

    induk.appendChild(el('path', {
      class: 'peta__panah' + (p.jenis === 'galat' ? ' peta__panah--galat' : ''),
      d: d, 'marker-end': 'url(#' + marker + ')'
    }));

    if (p.label) {
      var t = el('text', {
        class: 'peta__label', x: labelX, y: labelY,
        'text-anchor': p._jenis === 'lewat' ? 'end' : 'start'
      });
      t.textContent = p.label;
      /* Label ditulis SESUDAH semua garis di lapisan yang sama, dan diberi
         halo sewarna latar lewat `paint-order` di CSS. Tanpa itu, label lajur
         dalam terpotong oleh garis lajur luar — dan yang terbaca bukan
         "GOTO 260" melainkan "GOTO| 26". */
      indukLabel.appendChild(t);
    }
  }

  /* --- keluaran kedua: sumber Mermaid untuk docs/*.md ---------------------- */

  /* --- diagram keadaan ------------------------------------------------------

     Flowchart menjawab "ke mana alurnya pergi". Untuk menu dan pengantar itu
     seluruh ceritanya. Untuk permainan, tidak: yang menentukan apa yang
     terjadi saat tombol ditekan sering bukan posisi penunjuk, melainkan
     KEADAAN programnya.

     TOWERS.BAS contoh paling bersih. Satu variabel, HOLD, menentukan arti
     seluruh antarmukanya: kalau 0, menekan Enter berarti "ambil cakram dari
     menara ini"; kalau tidak 0, Enter yang sama berarti "taruh cakram di
     menara ini". Dua arti, satu tombol, dan tidak satu pun terlihat di
     flowchart.

     Datanya berbentuk sama dengan flowchart (simpul + panah), jadi penggambar
     SVG-nya dipakai ulang apa adanya. Yang berbeda cuma dua: bentuk simpulnya
     selalu membulat, dan keluaran Mermaid-nya memakai `stateDiagram-v2`. */

  var BUNGKUS = {
    mulai:    ['(["', '"])'],
    keluar:   ['(["', '"])'],
    putusan:  ['{"', '"}'],
    subrutin: ['[["', '"]]'],
    galat:    ['[/"', '"/]'],
    proses:   ['["', '"]']
  };

  /* Label Mermaid ada di dalam tanda kutip, dan label panah ada di antara dua
     tanda `|`. Dua karakter itu harus dilolos, kalau tidak diagramnya gagal
     digambar tanpa pesan yang jelas — `RUN "nama"` cukup untuk mematahkannya.
     Mermaid menerima entitas HTML numerik/bernama di dalam label. */
  function lolos(teks) {
    return String(teks)
      .replace(/"/g, '#quot;')
      .replace(/\|/g, '#124;');
  }

  function mermaid(arsitektur) {
    if (arsitektur.jenis === 'keadaan') return mermaidKeadaan(arsitektur);

    var simpul = arsitektur.simpul, panah = arsitektur.panah || [];
    var keluar = ['flowchart TD'], i, s, b;

    for (i = 0; i < simpul.length; i++) {
      s = simpul[i];
      b = BUNGKUS[s.jenis || 'proses'] || BUNGKUS.proses;
      keluar.push('    ' + s.id + b[0] +
        '<b>' + lolos(s.baris) + '</b><br/>' +
        s.teks.map(lolos).join('<br/>') + b[1]);
    }
    keluar.push('');
    for (i = 0; i < panah.length; i++) {
      keluar.push('    ' + panah[i].dari +
        (panah[i].label ? ' -->|' + lolos(panah[i].label) + '| ' : ' --> ') +
        panah[i].ke);
    }
    return keluar.join('\n');
  }

  /* Sintaks stateDiagram-v2 berbeda dari flowchart dalam tiga hal, dan
     ketiganya mudah membuat diagram gagal digambar tanpa pesan yang jelas:
       - label simpul ditulis terpisah: `state "teks" as id`
       - label panah dipisah titik dua, bukan diapit `|`
       - `<br/>` tidak selalu dihormati, jadi baris digabung dengan pemisah
         mendatar supaya hasilnya sama di penampil mana pun */
  function mermaidKeadaan(arsitektur) {
    var simpul = arsitektur.simpul, panah = arsitektur.panah || [];
    var keluar = ['stateDiagram-v2'], i, s;

    for (i = 0; i < simpul.length; i++) {
      s = simpul[i];
      keluar.push('    state "' + lolos(s.teks.join(' · ')) +
        (s.baris ? ' · baris ' + lolos(s.baris) : '') + '" as ' + s.id);
    }
    keluar.push('');
    for (i = 0; i < panah.length; i++) {
      keluar.push('    ' + panah[i].dari + ' --> ' + panah[i].ke +
        (panah[i].label ? ' : ' + lolos(panah[i].label) : ''));
    }
    return keluar.join('\n');
  }

  global.TRACER = global.TRACER || {};
  global.TRACER.peta = { gambar: gambar, mermaid: mermaid };
})(window);
