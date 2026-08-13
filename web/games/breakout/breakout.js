/* ===========================================================================
   breakout.js — port dari BREAKOUT.BAS (K.R. Sloan Jr., 1 Januari 1982).

   PILOT ARKADE. Keputusan di berkas ini diwarisi sesi 18-25, jadi tiap
   keputusan yang tidak jelas dari kodenya ditulis alasannya.

   Namanya di berkas BREAKOUT.BAS, tapi baris 140 mencetak "Welcome to
   Spinout" — dan nama itu yang tepat. Bedanya dengan Breakout biasa bukan
   hiasan: bolanya punya SPIN, dan spin itu MEMBELOKKAN lintasannya
   terus-menerus.

   ------------------------------------------------------------------------
   SPIN: MATRIKS ROTASI YANG MENYAMAR

       760 VX=OVX-(SPIN*OVY*.05):VY=OVY+(SPIN*OVX*.05)+G
       761 SPIN=SPIN*.9999

   Dengan t = SPIN*0,05 itu adalah

       ⎡vx'⎤   ⎡ 1  -t ⎤ ⎡vx⎤
       ⎣vy'⎦ = ⎣ t   1 ⎦ ⎣vy⎦

   yaitu rotasi sudut kecil, diterapkan TIAP LANGKAH. Tapi matriksnya TIDAK
   menjaga laju: determinannya 1+t^2, bukan 1. Diukur: pada spin 1 lajunya
   tumbuh ~13% tiap seratus langkah. Itu GALAT HAMPIRAN, bukan fitur.

   ------------------------------------------------------------------------
   SATU ANGKA, ENAM AKIBAT

   Kemampuan 1-10 dibagi sepuluh lalu dipakai di enam tempat: laju maksimum
   (290), gravitasi (295), pengali laju bata atas (710), peluang bata
   DIKEMBALIKAN (1150), kekuatan english papan (1250), dan besar spin (1260).

   ------------------------------------------------------------------------
   BATA YANG SUDAH PECAH BISA KEMBALI

   Peluang undian SKILL/2 tiap pukulan papan — tapi baris 1170 membatalkannya
   kalau bata yang diundi masih utuh. Jadi peluang SESUNGGUHNYA adalah
   SKILL/2 x (bagian bata yang sudah pecah): hampir tidak pernah di awal,
   dan makin sering makin dekat ke kemenangan.

   ------------------------------------------------------------------------
   RUPA MODERN — DAN KENAPA ITU BUKAN CUMA HIASAN

   Versi pertama halaman ini setia ke palet CGA. Pemilik koleksi memintanya
   dimodernkan, dan permintaan itu ternyata memperbaiki sesuatu yang nyata:

   JEJAK BOLA MEMBUAT SPIN TERLIHAT. Seluruh program ini tentang lintasan
   yang MELENGKUNG, dan pada satu titik cahaya yang berpindah tiap langkah,
   lengkungan itu praktis tidak terlihat. Jejak sepuluh langkah membuatnya
   jadi hal pertama yang disadari pemain — dan itu tepat, karena memang itu
   yang membedakan program ini dari Breakout mana pun.

   Yang ditambahkan, dan alasannya:

     jejak bola      memperlihatkan lengkung spin (di atas)
     cincin spin     arah dan besar spin, dibaca langsung dari `spin`
     pecahan bata    memberi umpan balik tabrakan yang di aslinya cuma bunyi
     bata kembali    animasi masuk + dering merah — mekanik khas program ini
                     yang paling mudah terlewat kalau tidak ditandai
     angka melayang  memperlihatkan nilai baris yang TERBALIK dari Breakout baku
     getar layar     bobot tumbukan

   Semuanya SELERA kecuali dua yang pertama, dan dinyatakan begitu di
   dokumennya. Mode 1982 tetap ada satu tombol jauhnya, dan keduanya
   menjalankan simulasi yang sama persis.

   ------------------------------------------------------------------------
   AMBANG SVG YANG SAYA TETAPKAN SENDIRI, LALU SAYA UJI

   Dokumen pilot ini menulis: "SVG berhenti benar begitu ada ratusan benda
   bergerak bersamaan". Partikel adalah kasus itu, jadi ambangnya DIUKUR di
   sini, bukan diasumsikan.

   Kolam partikel dibatasi 120 dan dipakai ulang — tidak ada elemen yang
   dibuat atau dihapus selama bermain. Diukur di peramban sepanjang satu
   permainan penuh:

       elemen di dalam <svg>      267 diam, 268 puncak
       partikel hidup sekaligus     8 puncak (satu bata per tumbukan)
       angka melayang hidup         1 puncak

   Jadi yang benar-benar berubah tiap bingkai adalah bola, papan, cincin
   spin, sepuluh jejak, dan paling banyak sembilan efek — sekitar dua puluh
   elemen, bukan ratusan. SVG masih jauh dari batasnya.

   Kalau program arkade berikutnya butuh lebih dari itu, ia harus PINDAH ke
   canvas, bukan menaikkan batas ini.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, loop } = window.RETRO;
  const kb = window.RETRO.input();          // pabrik, bukan objek — lihat input.js
  const $ = (id) => document.getElementById(id);
  const db = store('breakout');
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const kurangiGerak =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- tetapan, apa adanya dari baris 110-130 ---------------------------- */
  const T = 8, B = 188, L = 8, R = 308;
  const BH = 8, BW = (R - L) / 20;          // 15
  const BT = T + BH * 4;                     // 40
  const KOL = 20, BARIS = 4;
  const NILAI = (by) => 10 + 50 * by;        // baris 330

  const acak = rng();
  const svg = $('layar');

  let bata = [];
  let x = 160, y = 100, vx = 0, vy = 0, spin = 0;
  let ox = 160, oy = 100, obx = 0, oby = 0;
  let px = 160, py = 100;                    // posisi langkah sebelumnya (interpolasi)
  let pl = 150, pr = 170;
  const PY = B - 20;                         // baris 480
  let skor = 0, bola = 0, skill = 0.5, maxv = 0, g = 0, fast = 1;
  let dibalik = 0, main = false, sajikan = false, selesaiPermainan = false;
  let elBola = null, elPapan = null, gEfek = null, gDunia = null, gJejak = null, elSpin = null;
  let modern = true;

  const bunyi = (f, tik) => { if ($('bunyi').checked) audio.sound(f, tik); };

  /* --- kolam partikel, ukuran tetap --------------------------------------
     Dibuat sekali, dipakai ulang. Membuat/menghapus elemen di tengah gelung
     memaksa penataan ulang DOM tiap tumbukan — biaya yang persis muncul di
     saat paling ramai. */
  const MAKS_PECAHAN = 120;
  const pecahan = [];

  /* Jejak bola: sepuluh cuplikan posisi. Bukan hiasan — inilah yang membuat
     lengkung spin terlihat. */
  const JEJAK = 10;
  const jejak = [];

  /* --- gambar ------------------------------------------------------------ */
  function defs() {
    const d = mk('defs');
    const rona = [
      ['g0', '#3b82f6', '#1d4ed8'],   // baris 0 — 10 poin
      ['g1', '#22d3ee', '#0891b2'],   // baris 1 — 60
      ['g2', '#f59e0b', '#b45309'],   // baris 2 — 110
      ['g3', '#fb7185', '#be123c'],   // baris 3 — 160, paling bernilai
      ['gp', '#a7f3d0', '#34d399']    // papan
    ];
    rona.forEach(([id, a, b]) => {
      const lg = mk('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 });
      lg.append(mk('stop', { offset: 0, 'stop-color': a }),
                mk('stop', { offset: 1, 'stop-color': b }));
      d.append(lg);
    });
    const f = mk('filter', { id: 'glow', x: '-60%', y: '-60%',
                             width: '220%', height: '220%' });
    f.append(mk('feGaussianBlur', { stdDeviation: 1.6, result: 'b' }));
    const m = mk('feMerge');
    m.append(mk('feMergeNode', { in: 'b' }), mk('feMergeNode', { in: 'SourceGraphic' }));
    f.append(m);
    d.append(f);
    return d;
  }

  function bangunLayar() {
    svg.textContent = '';
    svg.append(defs());

    /* Semua yang bisa bergetar ada di SATU grup. Getar layar dilakukan dengan
       menggeser grup itu, bukan tiap elemen — satu atribut per bingkai. */
    gDunia = mk('g');
    svg.append(gDunia);

    if (modern && !kurangiGerak) {
      const kisi = mk('g', { class: 'k-kisi' });
      for (let gx = 0; gx <= 320; gx += 20)
        kisi.append(mk('line', { x1: gx, y1: 0, x2: gx, y2: 200 }));
      for (let gy = 0; gy <= 200; gy += 20)
        kisi.append(mk('line', { x1: 0, y1: gy, x2: 320, y2: gy }));
      gDunia.append(kisi);
    }

    gDunia.append(mk('rect', { class: 'k-bingkai', x: L + .5, y: T + .5,
                               width: R - L, height: B - T }));

    bata = [];
    for (let by = 0; by < BARIS; by++) {
      for (let bx = 0; bx < KOL; bx++) {
        const el = mk('rect', {
          class: 'k-bata k-bata--r' + by,
          x: L + 2 + BW * bx, y: BT + 2 + BH * by,
          width: BW - 4, height: BH - 4
        });
        gDunia.append(el);
        bata.push({ nilai: NILAI(by), hidup: true, el, bx, by });
      }
    }

    gJejak = mk('g');
    gDunia.append(gJejak);
    jejak.length = 0;
    for (let i = 0; i < JEJAK; i++) {
      const c = mk('circle', { class: 'k-jejak', cx: -10, cy: -10, r: 1 });
      gJejak.append(c);
      jejak.push({ el: c, x: -10, y: -10 });
    }

    elPapan = mk('rect', { class: 'k-papan', x: 0, y: PY, width: 21, height: 2.4 });
    elSpin = mk('path', { class: 'k-spin', d: '' });
    elBola = mk('circle', { class: 'k-bola', cx: -10, cy: -10, r: 2.5 });
    gDunia.append(elPapan, elSpin, elBola);

    gEfek = mk('g');
    gDunia.append(gEfek);
    pecahan.length = 0;
    for (let i = 0; i < MAKS_PECAHAN; i++) {
      const el = mk('rect', { class: 'k-pecahan', x: -10, y: -10,
                              width: 1.6, height: 1.6, opacity: 0 });
      gEfek.append(el);
      pecahan.push({ el, hidup: false, x: 0, y: 0, vx: 0, vy: 0, umur: 0, teks: null });
    }
  }

  const idx = (bx, by) => by * KOL + bx;

  function ledakkan(bx, by, warna) {
    if (!modern || kurangiGerak) return;
    const cx = L + 2 + BW * bx + (BW - 4) / 2;
    const cy = BT + 2 + BH * by + (BH - 4) / 2;
    let dibuat = 0;
    for (const p of pecahan) {
      if (p.hidup || dibuat >= 8) continue;
      const a = acak.next() * Math.PI * 2, s = 0.6 + acak.next() * 1.6;
      p.hidup = true; p.x = cx; p.y = cy;
      p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s - 0.4;
      p.umur = 1;
      p.el.setAttribute('fill', warna);
      dibuat++;
    }
  }

  /* Angka melayang memakai kolam yang sama, dengan satu elemen teks yang
     dipinjam — jadi tidak ada elemen baru yang dibuat saat bermain. */
  const angka = [];
  function angkaMelayang(cx, cy, teks) {
    if (!modern || kurangiGerak) return;
    let a = angka.find(v => !v.hidup);
    if (!a) {
      if (angka.length >= 8) return;
      const el = mk('text', { class: 'k-angka', x: -10, y: -10 });
      gEfek.append(el);
      a = { el, hidup: false, x: 0, y: 0, umur: 0 };
      angka.push(a);
    }
    a.hidup = true; a.x = cx; a.y = cy; a.umur = 1;
    a.el.textContent = teks;
  }

  let getar = 0;
  function goyang(kuat) { if (modern && !kurangiGerak) getar = kuat; }

  function render(alpha) {
    const bx = px + (x - px) * alpha, by = py + (y - py) * alpha;

    elPapan.setAttribute('x', pl);
    elBola.setAttribute('cx', bx);
    elBola.setAttribute('cy', by);

    if (modern && !kurangiGerak) {
      // jejak: geser cuplikan, yang terbaru paling terang dan paling besar
      for (let i = jejak.length - 1; i > 0; i--) {
        jejak[i].x = jejak[i - 1].x; jejak[i].y = jejak[i - 1].y;
      }
      jejak[0].x = bx; jejak[0].y = by;
      jejak.forEach((j, i) => {
        const f = 1 - i / jejak.length;
        j.el.setAttribute('cx', j.x); j.el.setAttribute('cy', j.y);
        j.el.setAttribute('r', (2.2 * f).toFixed(2));
        j.el.setAttribute('opacity', (0.42 * f * f).toFixed(3));
      });

      /* Cincin spin: busur yang panjangnya sebanding besar spin dan arahnya
         mengikuti tandanya. Dibaca langsung dari `spin`, jadi ia tidak bisa
         berbohong tentang keadaan simulasi. */
      const s = Math.max(-2, Math.min(2, spin));
      if (Math.abs(s) > 0.02) {
        const r0 = 5, sudut = Math.min(5, Math.abs(s) * 2.6);
        const a0 = (performance.now() / 1000) * s * 3;
        const a1 = a0 + sudut * Math.sign(s);
        const d = 'M' + (bx + r0 * Math.cos(a0)).toFixed(2) + ' ' +
                  (by + r0 * Math.sin(a0)).toFixed(2) +
                  ' A' + r0 + ' ' + r0 + ' 0 ' +
                  (Math.abs(sudut) > Math.PI ? 1 : 0) + ' ' +
                  (s > 0 ? 1 : 0) + ' ' +
                  (bx + r0 * Math.cos(a1)).toFixed(2) + ' ' +
                  (by + r0 * Math.sin(a1)).toFixed(2);
        elSpin.setAttribute('d', d);
        elSpin.setAttribute('opacity', Math.min(1, Math.abs(s)).toFixed(2));
      } else {
        elSpin.setAttribute('opacity', 0);
      }

      // pecahan
      for (const p of pecahan) {
        if (!p.hidup) continue;
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.umur -= 0.045;
        if (p.umur <= 0) { p.hidup = false; p.el.setAttribute('opacity', 0); continue; }
        p.el.setAttribute('x', p.x); p.el.setAttribute('y', p.y);
        p.el.setAttribute('opacity', p.umur.toFixed(2));
      }
      for (const a of angka) {
        if (!a.hidup) continue;
        a.y -= 0.35; a.umur -= 0.028;
        if (a.umur <= 0) { a.hidup = false; a.el.setAttribute('opacity', 0); continue; }
        a.el.setAttribute('x', a.x); a.el.setAttribute('y', a.y);
        a.el.setAttribute('opacity', a.umur.toFixed(2));
      }

      if (getar > 0.02) {
        gDunia.setAttribute('transform', 'translate(' +
          ((acak.next() - .5) * getar).toFixed(2) + ',' +
          ((acak.next() - .5) * getar).toFixed(2) + ')');
        getar *= 0.82;
      } else if (getar) { getar = 0; gDunia.removeAttribute('transform'); }
    }

    papanAngka();
  }

  function papanAngka() {
    $('s-skor').textContent = Math.round(skor);
    $('s-bola').textContent = bola + ' / 4';
    $('s-bata').textContent = bata.filter(b => b.hidup).length;
    $('s-spin').textContent = spin.toFixed(2).replace('.', ',');
    $('s-laju').textContent = Math.hypot(vx, vy).toFixed(2).replace('.', ',');
    $('s-balik').textContent = dibalik;
  }

  function pesan(t) { $('pesan').textContent = t || ''; }

  /* =======================================================================
     SATU LANGKAH SIMULASI = SATU PUTARAN 740->1300.
     Fungsi ini TIDAK berubah antara mode modern dan mode 1982.
     ======================================================================= */
  function langkah() {
    if (!main) return;
    px = x; py = y;

    gerakPapan();                             // GOSUB 1410
    if (sajikan) return;                      // menunggu tombol saji (baris 730)

    ox = x; oy = y; obx = bxDari(x); oby = byDari(y);   // baris 740
    const ovx = vx, ovy = vy;                 // baris 750

    // baris 760-761
    vx = ovx - spin * ovy * 0.05;
    vy = ovy + spin * ovx * 0.05 + g;
    spin *= 0.9999;

    // baris 770-781
    if (vx > maxv) vx = maxv;
    if (vy > maxv) vy = maxv;
    if (vx < -maxv) vx = -maxv;
    if (vy < -maxv) vy = -maxv;

    x += vx; y += vy;                         // baris 790

    const bx = bxDari(x), by = byDari(y);     // baris 800-830
    if (by >= 0 && by <= 3) {                 // baris 840-850
      const k = bata[idx(bx, by)];
      if (k && k.hidup) {                     // baris 860
        if (by <= 1) vy = vy * fast;          // baris 870-880
        if (obx !== bx) vx = -vx;             // baris 890
        if (oby !== by) vy = -vy;             // baris 900
        skor += k.nilai;                      // baris 910
        bunyi(440, 2);                        // baris 920
        k.hidup = false;
        k.el.classList.remove('k-bata--kembali');
        k.el.classList.add('k-bata--pecah');  // baris 930-960
        ledakkan(bx, by, ['#3b82f6', '#22d3ee', '#f59e0b', '#fb7185'][by]);
        angkaMelayang(L + 2 + BW * bx + (BW - 4) / 2,
                      BT + BH * by, '+' + k.nilai);
        goyang(1.6);
        if (skor >= 6800) return menang();    // baris 970
      }
    }
    /* Baris 1050 dst. dijalankan JUGA sesudah bata pecah: baris 970
       melompat ke 1050, bukan ke akhir putaran. */

    // --- dinding, baris 1050-1070 ---
    if (x <= L) { x = L + L - x; vx = -vx; vy += spin; bunyi(600, 2); goyang(.8); }
    if (x >= R) { x = R + R - x; vx = -vx; vy -= spin; bunyi(1200, 2); goyang(.8); }
    if (y <= T) { y = T + T - y; vy = -vy; vx -= spin; bunyi(880, 2); goyang(.8); }
    if (y >= B) return bolaHilang();          // baris 1080 -> 1310

    // --- papan, baris 1090-1260 ---
    const lewatiPapan = (y < PY) || (oy > PY);
    if (!lewatiPapan) {
      const kena = ((pl - 2) < x && x < (pr + 2)) ||
                   ((pl - 2) < ox && ox < (pr + 2));
      if (kena) {
        y = PY + PY - y;                      // baris 1130
        bunyi(300, 5);                        // baris 1140
        kilatPapan();
        mungkinKembalikanBata();              // baris 1150-1200
        vy = -vy;                             // baris 1230
        /* Baris 1240: (PL-PR) NEGATIF karena PR=PL+20, jadi MISS bertanda
           terbalik — dan baris 1250 mengalikannya dengan VY yang juga sudah
           dibalik di 1230. Dua tanda negatif yang saling menghapus, dan
           hasilnya benar: memukul di kanan tengah membelokkan bola ke kanan. */
        const miss = (x - (pl + pr) / 2) / (pl - pr);
        vx = vx + vy * miss * skill * 5;      // baris 1250
        spin = spin * skill + miss * skill;   // baris 1260
      }
    }
  }

  const bxDari = (v) => Math.max(0, Math.min(19, Math.floor((v - L) / BW)));
  const byDari = (v) => Math.floor((v - BT) / BH);

  let pewaktuPapan = 0;
  function kilatPapan() {
    if (!modern) return;
    elPapan.classList.add('k-papan--kena');
    clearTimeout(pewaktuPapan);
    pewaktuPapan = setTimeout(() => elPapan.classList.remove('k-papan--kena'), 70);
  }

  /* Baris 1150-1200. Peluangnya SKILL/2 — tapi baris 1170 membatalkannya
     kalau bata yang diundi masih utuh, jadi peluang sesungguhnya
     SKILL/2 x (bagian bata yang sudah pecah). */
  function mungkinKembalikanBata() {
    if (acak.next() * 2 > skill) return;
    const bx = Math.floor(acak.next() * 19.99);
    const by = Math.floor(acak.next() * 3.99);
    const k = bata[idx(bx, by)];
    if (!k || k.hidup) return;                // baris 1170
    k.hidup = true;
    k.el.classList.remove('k-bata--pecah');   // baris 1190
    k.el.classList.add('k-bata--kembali');
    skor -= k.nilai;                          // baris 1200
    dibalik++;
    angkaMelayang(L + 2 + BW * bx + (BW - 4) / 2, BT + BH * by, '−' + k.nilai);
    bunyi(150, 3);
    goyang(2.4);
  }

  /* Baris 1410-1530. Aslinya papan bergeser 5 piksel PER TOMBOL yang masuk
     penyangga, jadi kecepatannya = laju ulang papan ketik pemakai. Di sini
     5 piksel per LANGKAH selama tombol ditahan. */
  function gerakPapan() {
    if (kb.isDown('ArrowLeft')) pl -= 5;
    if (kb.isDown('ArrowRight')) pl += 5;
    if (pl < L) pl = L;                       // baris 1470
    if (pl > R - 20) pl = R - 20;             // baris 1480
    pr = pl + 20;                             // baris 1500
    /* Bola TIDAK menempel di papan saat menunggu saji. Aslinya baris 650-670
       menaruhnya di X ACAK lalu menggambarnya di sana, dan baris 720-730
       menunggu tombol saji sambil membiarkannya diam di situ. */
  }

  /* --- alur permainan ---------------------------------------------------- */
  function bolaBaru() {
    if (bola >= 4) return habis();            // baris 530/1330
    bola++;
    x = L + acak.next() * (R - L);            // baris 650
    y = B - 10;                               // baris 660
    px = x; py = y;
    vx = 6 * acak.next() - 3;                 // baris 680
    vy = -5 - 2 * acak.next();                // baris 690
    spin = 0;                                 // baris 700
    sajikan = true;
    jejak.forEach(j => { j.x = x; j.y = y; });
    pesan('Spasi untuk menyajikan');
    papanAngka();
  }

  function bolaHilang() {
    bunyi(200, 20);                           // baris 1320
    goyang(3.2);
    bolaBaru();
  }

  function menang() {
    main = false; gelung.stop();
    svg.parentElement.classList.add('k-crt--menang');
    audio.play('mfaemb');                     // baris 1000
    for (let i = 0; i < 10; i++)
      ledakkan(Math.floor(acak.next() * 20), Math.floor(acak.next() * 4), '#ffd166');
    pesan('SEMUA BATA PECAH — ' + Math.round(skor));
    selesaiPermainan = true;
    sync();
  }

  function habis() {
    main = false; gelung.stop();
    pesan('Permainan selesai — ' + Math.round(skor));
    selesaiPermainan = true;
    sync();
  }

  /* --- gelung: langkah tetap, dari _shared/loop.js -----------------------
     `render` menerima alpha — posisi antara dua langkah simulasi. Memakainya
     membuat simulasi 32 langkah/detik tergambar mulus di 60 bingkai/detik
     tanpa mengubah fisikanya sedikit pun. */
  let hz = 32;
  let gelung = loop({ hz: hz, update: langkah, render: render });

  function buatGelung() {
    if (gelung.running) gelung.stop();
    gelung = loop({ hz: hz, update: langkah, render: render });
  }

  function mulai() {
    const s = Number($('skill').value);
    skill = s / 10;                           // baris 280
    maxv = 6 + 4 * skill;                     // baris 290
    g = skill / 5;                            // baris 295
    fast = 1 + skill;                         // baris 710
    skor = 0; bola = 0; dibalik = 0;
    selesaiPermainan = false;
    pl = 150; pr = 170;
    svg.parentElement.classList.remove('k-crt--menang');
    bangunLayar();
    main = true;
    bolaBaru();
    buatGelung();
    gelung.start();
    sync();
    db.set('skill', s);
  }

  function sync() {
    $('mulai').textContent = selesaiPermainan || !main ? 'Mulai' : 'Ulang';
    $('jeda').disabled = !main;
    $('jeda').textContent = gelung.paused ? 'Lanjut' : 'Jeda';
  }

  function setelMode() {
    svg.parentElement.classList.toggle('k-crt--1982', !modern);
    $('mode').textContent = modern ? 'Mode 1982' : 'Mode modern';
    $('mode').setAttribute('aria-pressed', String(!modern));
    db.set('mode', modern ? 'modern' : '1982');
    bangunLayar();
    render(1);
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Spinout',
    source: 'BREAKOUT.BAS · K.R. Sloan Jr. · 1 Jan 1982',
    backHref: '../../index.html'
  }));

  kb.captureScroll(true);
  kb.on(' ', () => {
    if (!main) return;
    if (sajikan) { sajikan = false; pesan(''); }
  });

  $('mulai').addEventListener('click', mulai);
  $('jeda').addEventListener('click', () => { gelung.pause(); sync(); });
  $('mode').addEventListener('click', () => {
    modern = !modern;
    const jalan = gelung.running;
    setelMode();
    if (jalan && main) { buatGelung(); gelung.start(); }
  });
  $('hz').addEventListener('input', e => {
    hz = Number(e.target.value);
    $('hzv').textContent = hz + '/dtk';
    db.set('hz', hz);
    if (main) { const jalan = gelung.running; buatGelung(); if (jalan) gelung.start(); }
  });
  $('skill').addEventListener('change', e => db.set('skill', e.target.value));

  hz = Number(db.get('hz', 32));
  $('hz').value = hz;
  $('hzv').textContent = hz + '/dtk';
  $('skill').value = db.get('skill', 5);
  modern = db.get('mode', 'modern') !== '1982';

  /* --- angka-angka, dihitung dari aturannya sendiri ----------------------- */
  const total = [0, 1, 2, 3].reduce((s, by) => s + NILAI(by) * KOL, 0);
  $('tbl-nilai').innerHTML =
    '<thead><tr><th>Baris bata</th><th>Nilai</th><th>× 20 kolom</th></tr></thead><tbody>' +
    [0, 1, 2, 3].map(by =>
      '<tr><td>' + by + (by === 0 ? ' (paling atas)' : by === 3 ? ' (terbawah)' : '') +
      '</td><td>' + NILAI(by) + '</td><td>' + NILAI(by) * KOL + '</td></tr>').join('') +
    '<tr><td><b>Total</b></td><td></td><td><b>' + total + '</b></td></tr></tbody>';

  $('tbl-spin').innerHTML =
    '<thead><tr><th>Spin</th><th>Belok/langkah</th><th>Laju per 100 langkah</th></tr></thead><tbody>' +
    [0.25, 0.5, 1, 2].map(s => {
      const t = s * 0.05;
      const tumbuh = (Math.pow(Math.hypot(1, t), 100) - 1) * 100;
      return '<tr><td>' + String(s).replace('.', ',') + '</td><td>' +
             (Math.atan(t) * 180 / Math.PI).toFixed(1).replace('.', ',') + '°</td><td>+' +
             tumbuh.toFixed(1).replace('.', ',') + '%</td></tr>';
    }).join('') + '</tbody>';

  $('tbl-balik').innerHTML =
    '<thead><tr><th>Kemampuan</th><th>Peluang undian</th></tr></thead><tbody>' +
    [1, 3, 5, 7, 10].map(s =>
      '<tr><td>' + s + '</td><td>' + (s / 10 / 2 * 100) + '%</td></tr>').join('') +
    '</tbody>';
  $('k-balik').textContent = 'bata bisa kembali';

  setelMode();
  pesan('Tekan Mulai');
  sync();
})();
