/* ===========================================================================
   football-scene.js — lapisan penyajian untuk FOOTBALL.BAS

   Berkas ini TIDAK PUNYA ATURAN. Ia menerima angka yang sudah diputuskan
   football.js -- berapa yard, permainan nomor berapa, siapa yang memegang
   bola, apa hasilnya -- lalu menggambarkannya sebagai dua regu di lapangan.
   Kalau berkas ini dihapus, permainannya tetap berjalan utuh.

   Tiga aturan yang dibawa dari TRUCKER dan GOLF dan berlaku juga di sini:

   1. HIASAN TIDAK PERNAH MENGAMBIL DARI ACAK PERMAINAN. Modul ini punya
      aliran `RETRO.rng` sendiri.
   2. URUTAN LAPISAN = URUTAN KEDALAMAN, dan pembawa bola selalu di atas.
   3. SKALA IKUT KEADAAN. Kamera mengikuti pembawa bola, dan sumbu yardnya
      diukur dari garis scrimmage -- tempat yang ditulis labelnya.

   ---------------------------------------------------------------------------
   GERAK

   Aslinya tidak punya gerak sama sekali: baris 1470 hanya mengedipkan
   tulisan "PLAY IN PROGRESS" sebanyak `DELAY` kali. Jadi kecepatannya harus
   dikarang, dan dikarang dari angka yang benar:

     lari          8,0 yard/detik    pelari NFL menempuh 40 yard ~4,5 detik
     mundur QB     6,0 yard/detik
     bola lambung  18 yard/detik     operan menengah
     penjegal      7,2 yard/detik    sedikit lebih lambat dari pembawa bola

   Dengan itu, tambahan 14 yard memakan 1,75 detik -- kira-kira selama
   permainan sungguhan, dan cukup lama untuk dibaca mata.
   =========================================================================== */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const txt = (a, s) => { const n = mkn('text', a); n.textContent = s; return n; };

  const W = 820, H = 232, GND = 188;
  const LEBAR = 42;                 /* yard yang muat di layar */
  const PX = W / LEBAR;             /* piksel per yard         */
  const V_LARI = 8.0, V_MUNDUR = 6.0, V_BOLA = 18, V_JEGAL = 7.2;

  const LAPIS = ['langit', 'tribun', 'rumput', 'garis', 'jauh',
                 'regu', 'pembawa', 'bola', 'teks'];
  let svg = null, L = {}, acak = null;
  let kam = 0;                      /* tepi kiri kamera, yard dari scrimmage */
  let lewati = null, arahKanan = true;
  let keGol = null;   /* yard ke garis gol, dari permainan */

  const px = (yd) => (yd - kam) * PX;

  function pasang(el) {
    svg = el; svg.textContent = '';
    L = {};
    LAPIS.forEach(n => { const g = mkn('g', { 'data-l': n }); L[n] = g; svg.append(g); });
    svg.addEventListener('click', () => { if (lewati) lewati(); });
  }

  /* ======================================================================
     Bagian 1 — latar
     ====================================================================== */
  function latar() {
    L.langit.textContent = ''; L.tribun.textContent = '';
    L.rumput.textContent = ''; L.garis.textContent = '';
    L.langit.append(mkn('rect', { class: 'e-langit', x: 0, y: 0, width: W, height: 74 }));
    /* tribun: barisan penonton, ukuran TETAP -- ia jauh, jadi ia tidak ikut
       membesar waktu kamera bergeser. */
    L.tribun.append(mkn('rect', { class: 'e-tribun', x: 0, y: 46, width: W, height: 28 }));
    for (let i = 0; i < 118; i++) {
      const x = (i * 7 + 3), y = 50 + ((i * 13) % 20);
      L.tribun.append(mkn('circle', { class: (i % 3 ? 'e-penonton' : 'e-penonton2'),
        cx: x, cy: y, r: 2.6 }));
    }
    L.tribun.append(mkn('rect', { class: 'e-pagar', x: 0, y: 72, width: W, height: 4 }));
    L.rumput.append(mkn('rect', { class: 'e-rumput', x: 0, y: 76, width: W, height: H - 76 }));
    /* Garis yard tiap 5 yard, diukur DARI GARIS SCRIMMAGE (yard 0). */
    const m0 = Math.ceil(kam / 5) * 5;
    for (let y = m0; y <= kam + LEBAR; y += 5) {
      const x = px(y);
      L.garis.append(mkn('line', { class: 'e-yard' + (y === 0 ? ' e-yard--los' : ''),
        x1: x, y1: 96, x2: x, y2: GND + 12 }));
      L.garis.append(txt({ class: 'e-yardTeks', x: x, y: GND + 26 },
        (y > 0 ? '+' : '') + y));
    }
    /* Garis gol dan endzone. Tanpa keduanya, touchdown di layar hanyalah
       lari panjang yang tiba-tiba diberi papan "TOUCHDOWN" -- kejadian yang
       sebabnya tidak tergambar. Jaraknya dihitung permainan dari OPS. */
    if (keGol !== null && keGol < kam + LEBAR + 12) {
      const xg = px(keGol);
      L.garis.append(mkn('rect', { class: 'e-endzone', x: xg, y: 76,
        width: Math.max(0, W - xg), height: H - 76 }));
      L.garis.append(mkn('line', { class: 'e-gol', x1: xg, y1: 88, x2: xg, y2: GND + 12 }));
      L.garis.append(txt({ class: 'e-golTeks', x: xg + 46, y: 108 }, 'END ZONE'));
    }
    L.garis.append(txt({ class: 'e-sumbu', x: 8, y: 20 }, 'YARD DARI GARIS SCRIMMAGE'));
  }

  /* ======================================================================
     Bagian 2 — pemain
     Dilihat dari pinggir lapangan. `dalam` 0..1 menirukan kedalaman: makin
     jauh ke dalam layar, makin kecil dan makin tinggi letaknya. Itu yang
     membuat sebelas orang di satu garis tidak jadi satu gumpalan.
     ====================================================================== */
  function orang(kelas, dalam) {
    const s = 0.72 + 0.28 * (1 - dalam);
    const g = mkn('g', { class: 'e-orang ' + kelas });
    const h = 46 * s;
    g.append(mkn('ellipse', { class: 'e-bayang', cx: 0, cy: 2, rx: 9 * s, ry: 3 * s }));
    g.append(mkn('path', { class: 'e-kaki', d: 'M' + (-4 * s) + ' 0 L' + (-3 * s) +
      ' ' + (-h * 0.42) + ' L' + (3 * s) + ' ' + (-h * 0.42) + ' L' + (5 * s) + ' 0 Z' }));
    g.append(mkn('path', { class: 'e-jersey', d: 'M' + (-8 * s) + ' ' + (-h * 0.4) +
      ' L' + (8 * s) + ' ' + (-h * 0.4) + ' L' + (7 * s) + ' ' + (-h * 0.78) +
      ' L' + (-7 * s) + ' ' + (-h * 0.78) + ' Z' }));
    g.append(mkn('rect', { class: 'e-bahu', x: -10 * s, y: -h * 0.82,
      width: 20 * s, height: 6 * s, rx: 3 * s }));
    g.append(mkn('circle', { class: 'e-helm', cx: 0, cy: -h * 0.92, r: 6.4 * s }));
    g.append(mkn('path', { class: 'e-topeng', d: 'M' + (5 * s) + ' ' + (-h * 0.92) +
      ' q' + (4 * s) + ' ' + (2 * s) + ' 0 ' + (4 * s) }));
    return g;
  }

  /* Susunan regu. x dalam yard relatif garis scrimmage, dalam 0..1. */
  const SERANG = [
    { x: -0.7, d: 0.10, p: 'WR' }, { x: -0.7, d: 0.28, p: 'OL' },
    { x: -0.7, d: 0.40, p: 'OL' }, { x: -0.7, d: 0.52, p: 'C' },
    { x: -0.7, d: 0.64, p: 'OL' }, { x: -0.7, d: 0.76, p: 'OL' },
    { x: -0.7, d: 0.94, p: 'TE' },
    { x: -3.2, d: 0.52, p: 'QB' }, { x: -6.0, d: 0.44, p: 'RB' },
    { x: -6.0, d: 0.70, p: 'FB' }, { x: -0.7, d: 0.02, p: 'WR' }
  ];
  const BERTAHAN = [
    { x: 0.9, d: 0.24, p: 'DL' }, { x: 0.9, d: 0.42, p: 'DL' },
    { x: 0.9, d: 0.60, p: 'DL' }, { x: 0.9, d: 0.78, p: 'DL' },
    { x: 4.5, d: 0.32, p: 'LB' }, { x: 4.5, d: 0.52, p: 'LB' },
    { x: 4.5, d: 0.72, p: 'LB' },
    { x: 9.0, d: 0.10, p: 'CB' }, { x: 9.0, d: 0.92, p: 'CB' },
    { x: 14.0, d: 0.40, p: 'S' }, { x: 14.0, d: 0.66, p: 'S' }
  ];

  let regu = [];            /* {el, x, y0, d, sisi, peran, tx} */
  let elBola = null, elJejak = null, elLabel = null, jejak = [];
  let pembawa = null;

  /* Sebaran kedalaman harus LEBIH BESAR dari tinggi orangnya, kalau tidak
     tujuh pemain garis depan yang berdiri di satu yard yang sama menumpuk
     jadi satu tiang totem. Tinggi orang ~46 px, jadi sebarannya 66 px --
     dan tiap kedalaman digeser sedikit ke samping supaya barisannya
     terbaca sebagai barisan, bukan sebagai tumpukan. */
  const yDari = (d) => GND - 66 * (1 - d);
  const geser = (d) => (d - 0.5) * 1.5;          /* yard, ke kiri/kanan */

  function susun(andaMenyerang) {
    L.regu.textContent = ''; L.pembawa.textContent = '';
    L.bola.textContent = ''; L.teks.textContent = ''; L.jauh.textContent = '';
    regu = []; jejak = [];
    const kelasO = andaMenyerang ? 'e-tim--anda' : 'e-tim--saya';
    const kelasD = andaMenyerang ? 'e-tim--saya' : 'e-tim--anda';
    /* Digambar dari yang PALING JAUH ke yang paling dekat, supaya yang di
       depan menutup yang di belakang -- urutan lapisan = urutan kedalaman. */
    const semua = SERANG.map(o => ({ ...o, sisi: 'O', kelas: kelasO }))
      .concat(BERTAHAN.map(o => ({ ...o, sisi: 'D', kelas: kelasD })));
    semua.sort((a, b) => a.d - b.d);
    semua.forEach(o => {
      const el = orang(o.kelas, o.d);
      L.regu.append(el);
      regu.push({ el: el, x: o.x, d: o.d, sisi: o.sisi, peran: o.p });
    });
    elJejak = mkn('polyline', { class: 'e-jejak', points: '' });
    L.bola.append(elJejak);
    elBola = mkn('ellipse', { class: 'e-bola', cx: 0, cy: 0, rx: 5.5, ry: 3.4 });
    L.bola.append(elBola);
    elLabel = txt({ class: 'e-label', x: 0, y: 0 }, '');
    L.teks.append(elLabel);
    taruhSemua();
  }

  function taruhSemua() {
    regu.forEach(r => r.el.setAttribute('transform',
      'translate(' + px(r.x + geser(r.d)).toFixed(1) + ' ' +
      yDari(r.d).toFixed(1) + ')'));
  }

  function taruhBola(yd, dalam, tinggi, label) {
    const x = px(yd), y = yDari(dalam) - 12 - (tinggi || 0) * PX * 0.5;
    elBola.setAttribute('cx', x.toFixed(1));
    elBola.setAttribute('cy', y.toFixed(1));
    elLabel.setAttribute('x', Math.max(46, Math.min(W - 46, x)).toFixed(1));
    elLabel.setAttribute('y', (y - 16).toFixed(1));
    elLabel.textContent = label || '';
    jejak.push([yd, dalam, tinggi || 0]);
    if (jejak.length > 400) jejak.shift();
    elJejak.setAttribute('points', jejak.map(t =>
      px(t[0]).toFixed(1) + ',' + (yDari(t[1]) - 12 - t[2] * PX * 0.5).toFixed(1)).join(' '));
  }

  /* ======================================================================
     Bagian 3 — mesin waktu
     ====================================================================== */
  function animasi(durasi, langkah) {
    return new Promise(resolve => {
      let t0 = null, batal = false;
      const usai = () => { if (batal) return; batal = true; lewati = null; langkah(1); resolve(); };
      lewati = usai;
      const bingkai = (ts) => {
        if (batal) return;
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / (durasi * 1000));
        langkah(p);
        if (p < 1) requestAnimationFrame(bingkai); else usai();
      };
      requestAnimationFrame(bingkai);
    });
  }
  const mulus = (p) => p * p * (3 - 2 * p);

  /* Kamera menahan pembawa bola di sepertiga kiri layar, dan tidak pernah
     mundur -- kamera yang bergoyang maju-mundur lebih membingungkan
     daripada kamera yang diam. */
  function kejar(yd) {
    const mau = Math.max(-10, yd - LEBAR * 0.33);
    kam += (mau - kam) * 0.14;
  }

  /* ======================================================================
     Bagian 4 — satu permainan
     ====================================================================== */
  const api = {
    pasang: pasang,
    benih(b) { acak = window.RETRO.rng((Number(b) || 0) * 6151 + 40961); },

    /** Gambar diam: dua regu berbaris, siap. */
    siap(o) {
      if (!svg) return;
      if (!acak) api.benih(1);
      kam = -10; arahKanan = true;
      keGol = (o.keGol == null) ? null : o.keGol;
      latar(); susun(o.andaMenyerang);
      taruhBola(-0.7, 0.52, 0, '');
      L.teks.append(txt({ class: 'e-judul', x: W / 2, y: 34 },
        (o.andaMenyerang ? 'BOLA ANDA' : 'BOLA SAYA') +
        '  ·  DOWN ' + o.down + ' & ' + o.togo));
    },

    /**
     * Mainkan satu permainan.
     * @param o {andaMenyerang, jenis:'lari'|'operan'|'punt'|'fg',
     *           yard, hasil:'gain'|'nol'|'intersep'|'fumble'|'td'|'safety'|
     *           'fg-baik'|'fg-gagal'|'punt', teks, down, togo, bunyi}
     */
    async main(o) {
      if (!svg) return;
      kam = -10;
      keGol = (o.keGol == null) ? null : o.keGol;
      latar(); susun(o.andaMenyerang);
      taruhBola(-0.7, 0.52, 0, '');

      /* --- berbaris ---------------------------------------------------- */
      await animasi(0.35, () => {});

      /* --- snap: bola ke quarterback ----------------------------------- */
      const qb = regu.find(r => r.sisi === 'O' && r.peran === 'QB');
      await animasi(0.22, (t) => {
        taruhBola(-0.7 + (qb.x + 0.7) * t, 0.52, 0.5 * Math.sin(Math.PI * t), '');
      });
      if (o.bunyi) try { window.RETRO.audio.sound(140, 0.7); } catch (e) {}

      const yard = o.yard || 0;
      if (o.jenis === 'punt' || o.jenis === 'fg') return tendang(o);
      if (o.jenis === 'operan') return operan(o, qb);
      return lari(o, qb);
    },

    /** Bendera hasil, ditinggalkan di layar sampai permainan berikutnya. */
    hasil(s, kelas) {
      if (!svg) return;
      L.teks.append(txt({ class: 'e-hasil ' + (kelas || ''), x: W / 2, y: 62 }, s));
    },

    gerak(d, f) { return animasi(d, f); }
  };

  /* --- permainan lari -------------------------------------------------- */
  async function lari(o, qb) {
    const rb = regu.find(r => r.peran === 'RB');
    const dLari = rb.d;
    /* serah terima */
    await animasi(0.28, (t) => {
      const x = qb.x + (rb.x + 1.2 - qb.x) * t;
      taruhBola(x, 0.52 + (dLari - 0.52) * t, 0, '');
      rb.x = rb.x + 0.5 * (1 / 60);
    });
    const mulai = rb.x, tujuan = o.yard;
    const jarak = Math.abs(tujuan - mulai);
    const durasi = Math.max(0.5, jarak / V_LARI);
    const musuh = regu.filter(r => r.sisi === 'D');
    const awal = musuh.map(r => r.x);
    await animasi(durasi, (t) => {
      /* Harus MENCAPAI 1 tepat di t=1. Versi pertama memakai
         `t<0.85 ? t : 0.85+(t-0.85)*0.4`, yang berhenti di 0,91 -- pelarinya
         mati sembilan persen sebelum sasaran, dan labelnya menuliskan -1
         yard untuk permainan yang hasilnya 0. Gambar yang tidak sampai ke
         angkanya sendiri adalah gambar yang berbohong. */
      const e = 1 - Math.pow(1 - t, 1.7);                /* melambat ditekan */
      const x = mulai + (tujuan - mulai) * e;
      rb.x = x;
      /* Bertahan bergerak MENUJU pembawa bola, tidak menembus garisnya --
         penjegal yang lewat di belakang pembawa bola terbaca sebagai bug. */
      musuh.forEach((m, i) => {
        const arah = x > awal[i] ? 1 : -1;
        const maju = Math.min(Math.abs(x - awal[i]), V_JEGAL * durasi * t);
        m.x = awal[i] + arah * maju * 0.82;
      });
      /* penyerang lain ikut maju separuh */
      regu.filter(r => r.sisi === 'O' && r !== rb).forEach(r => { r.x += 0.02; });
      kejar(x); latar(); taruhSemua();
      /* Di bingkai terakhir tuliskan ANGKA PERMAINAN, bukan pembulatan
         posisi -- keduanya harus sama, dan kalau berbeda yang menang
         angkanya. */
      const tampil = t >= 1 ? tujuan : x;
      taruhBola(x, dLari, 0, (tampil >= 0 ? '+' : '') + Math.round(tampil) + ' yd');
    });
    return tutup(o);
  }

  /* --- permainan operan ------------------------------------------------ */
  async function operan(o, qb) {
    const wr = regu.filter(r => r.peran === 'WR' || r.peran === 'TE');
    const target = wr[Math.floor(acak.next() * wr.length)];
    const jauh = Math.max(3, Math.abs(o.yard));

    /* SACK -- dan ia diperiksa SEBELUM QB mundur, bukan sesudah.
       Versi pertama memundurkan QB lima yard dulu (ke -8,2) baru
       memindahkannya ke titik jegal; untuk sack 2 yard itu berarti QB
       BERLARI MAJU enam yard ke arah pertahanan lalu dinyatakan "sacked".
       Di football sungguhan titik jegal itulah akhir mundurnya, jadi
       mundurnya langsung ke sana, satu gerakan. */
    if (o.yard < 0) {
      const musuh = regu.filter(r => r.sisi === 'D'), awal = musuh.map(r => r.x);
      const dari0 = qb.x;
      await animasi(Math.max(0.55, Math.abs(o.yard - dari0) / V_MUNDUR), (t) => {
        const e = 1 - Math.pow(1 - t, 1.7);
        const x = dari0 + (o.yard - dari0) * e;
        qb.x = x;
        musuh.forEach((m, i) => { m.x = awal[i] + (x - awal[i]) * e * 0.92; });
        kejar(x); latar(); taruhSemua();
        taruhBola(x, 0.52, 0, Math.round(t >= 1 ? o.yard : x) + ' yd');
      });
      return tutup(o);
    }

    const mundur = qb.x - 5;
    /* QB mundur */
    await animasi(5 / V_MUNDUR, (t) => {
      qb.x = qb.x + (mundur - qb.x) * 0.2;
      wr.forEach(r => { r.x += jauh * 0.9 / (60 * (5 / V_MUNDUR)); });
      latar(); taruhSemua();
      taruhBola(qb.x, 0.52, 0, 'DROP BACK');
    });
    /* bola melambung. Tinggi puncaknya ikut jarak: operan pendek datar,
       bom panjang tinggi -- itu satu-satunya isyarat visual yang
       membedakan kolom 3, 4, dan 5. */
    /* Operan tidak lengkap tetap DILEMPAR: di football ia melayang ke arah
       penerima lalu jatuh di sana, bukan mati di garis scrimmage. Jaraknya
       diambil dari kedalaman rute penerima, dan labelnya tidak pernah
       menuliskan yard supaya tidak terbaca sebagai perolehan. */
    const takLengkap = (o.hasil === 'nol');
    const bek = regu.filter(r => r.sisi === 'D' && (r.peran === 'CB' || r.peran === 'S'));
    const penangkap = bek[Math.floor(acak.next() * bek.length)];
    const dari = qb.x;
    const ke = o.hasil === 'intersep' ? jauh : takLengkap ? 9 + Math.round(acak.next() * 6) : o.yard;
    const puncak = Math.min(9, 1.2 + jauh * 0.16);
    const durasi = Math.max(0.45, Math.abs(ke - dari) / V_BOLA + 0.25);
    jejak = [];
    await animasi(durasi, (t) => {
      const x = dari + (ke - dari) * t;
      const h = puncak * 4 * t * (1 - t);
      target.x = Math.max(target.x, ke);
      /* Kalau bola diintersep, yang menunggu di titik tangkap harus bek --
         bola yang mendarat di rumput kosong lalu diumumkan "intercepted"
         adalah kejadian tanpa gambar. */
      if (o.hasil === 'intersep') { penangkap.x = ke; penangkap.d = target.d; }
      regu.filter(r => r.sisi === 'D' && r.x < ke).forEach(r => { r.x += 0.06; });
      kejar(x); latar(); taruhSemua();
      /* Label = posisi bola DARI GARIS SCRIMMAGE, satuan yang sama dengan
         sumbu di bawahnya dan dengan angka di catatan. Versi pertama
         menuliskan jarak tempuh bola dari QB yang sudah mundur lima yard,
         jadi operan 8 yard tertulis "16 yd" -- benar untuk bolanya, salah
         untuk permainannya. */
      taruhBola(x, target.d, h, takLengkap ? 'PASS' :
        (t >= 1 ? (ke >= 0 ? '+' : '') + Math.round(ke)
                : (x >= 0 ? '+' : '') + Math.round(x)) + ' yd');
    });
    if (o.bunyi) try { window.RETRO.audio.sound(o.hasil === 'nol' ? 90 : 300, 1); } catch (e) {}
    if (o.hasil === 'nol') {
      /* bola jatuh: tidak ada yang memegangnya */
      await animasi(0.3, (t) => taruhBola(ke, target.d, -0.4 * t, 'INCOMPLETE'));
    } else if (o.hasil !== 'intersep' && Math.abs(o.yard) > 0) {
      await animasi(0.35, () => { latar(); taruhSemua(); });
    }
    return tutup(o);
  }

  /* --- tendangan ------------------------------------------------------- */
  async function tendang(o) {
    const k = regu.find(r => r.peran === 'RB');
    await animasi(0.3, () => {});
    if (o.bunyi) try { window.RETRO.audio.sound(200, 1.2); } catch (e) {}
    const jauh = o.jenis === 'punt' ? 40 : Math.max(18, o.yard || 30);
    const puncak = o.jenis === 'fg' ? 12 : 16;
    jejak = [];
    await animasi(1.05, (t) => {
      const x = k.x + jauh * t;
      const h = puncak * 4 * t * (1 - t);
      kejar(x); latar(); taruhSemua();
      taruhBola(x, 0.5, h, o.jenis === 'fg' ? 'FIELD GOAL' : 'PUNT');
    });
    return tutup(o);
  }

  function tutup(o) {
    if (o.teks) api.hasil(o.teks, o.kelas);
    lewati = null;
    return o;
  }

  window.RETRO = window.RETRO || {};
  window.RETRO.FOOTBALLSCENE = api;
})();
