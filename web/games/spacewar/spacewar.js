/* ===========================================================================
   spacewar.js — port dari SPACEWAR.EXE (Bill Seiler, 1985), V1.50.

   ------------------------------------------------------------------------
   TEMUAN 1 — SATU-SATUNYA DARI KEEMPATNYA YANG TIDAK PERNAH BASIC

   Tiga EXE lain di koleksi ini BASIC yang di-compile, dan ketahuan dari dua
   angka: 786-2.357 entri relokasi, dan 22 string galat runtime BASIC. SPACEWAR
   punya **5 relokasi** dan **0 string galat**. Ia assembly 8086 tulis tangan.

   Akibatnya untuk porting: tidak ada `.bas` yang bisa jadi basis. Ketiga port
   lain berangkat dari rekompilasi yang benar-benar bisa di-RUN; yang ini tidak
   punya titik berangkat semacam itu sama sekali.

   ------------------------------------------------------------------------
   TEMUAN 2 — TAPI BINERNYA MEMBAWA ATURAN MAINNYA SENDIRI, DALAM KALIMAT

   Di offset 0x3BD5 ada layar GAME INSTRUCTIONS, enam belas baris teks ASCII:

       WEAPONS:PHOTON TORPEDOS - Use = 1 unit, Damage = 4 units.
               PHASERS         - Use = 1 unit, Damage = 2 units.
       DEFENSE:IMPULSE ENGINES - Use = 1 unit every 1/2 second.
               CLOAK           - Use = 1 unit every 1/2 second.
               HYPER SPACE     - Use = 8 units.
               ENERGY is recharged at 1 unit every 2 seconds.

   Jadi setiap konstanta di berkas ini yang bertanda BINER di bawah bukan hasil
   menyetel sampai terasa enak: ia angka yang program itu sendiri cetak ke layar.
   Dipanen `decompile/tools/harvest-spacewar.py`, lengkap dengan offsetnya, dan
   dimuat lewat `spacewar-data.js` -- bukan diketik ulang di sini.

   Begitu juga peta tombolnya, sembilan per pemain, dari layar GAME KEYS di
   0x37AE. Pemain kanan memakai papan angka; itu sebabnya barisnya 789/456/123.

   ------------------------------------------------------------------------
   TEMUAN 3 — YANG BELUM TERPECAHKAN: TATA LETAK PIKSEL SPRITE

   TERPECAHKAN 10 Agustus 2026 -- dan bukan dengan mengukur datanya, melainkan
   dengan menemukan RUTIN YANG MEMBACANYA: `sub_4792`, offset citra 18322. Ia
   menjawab formatnya sekaligus:

       and ax,0xf | shl si,7 | add si,0x1840   16 entri, strid 128, basis 0x1840
       cx=0x20                                  32 baris
       lodsw ; xchg al,ah ; stosw  (dua kali)   4 bita/baris, pasangan DITUKAR
       add di,0x1ffe / wrap 0x4000-0x3fb0       bank mode 6 berselang-seling

   Jadi tiap entri 32 x 32 piksel, seluruh 128 bita terpakai. Didekode begitu,
   isinya sebuah LINGKARAN dengan satu tanda kecil yang berpindah tempat dari
   entri ke entri: enam belas bingkai benda bundar yang berputar. Hampir pasti
   PLANET yang disebut teks bantuannya sendiri. Dekoder: tools/spritedec.py.

   Artinya untuk berkas ini: tabel itu TIDAK BERISI KAPAL sama sekali, jadi
   rotasi 16 langkah di sini tidak punya dasar dari biner. Ia PILIHAN RANCANGAN,
   dipertahankan karena enak dimainkan.

   Dua salah baca yang mendahului kesimpulan ini -- termasuk satu yang sempat
   saya kirim sebagai temuan -- ditulis lengkap di
   decompile/NEGATIVE-RESULTS.md sec. 22. Ringkasnya: `.asm` memakai offset
   citra sedangkan `.EXE` punya header 512 bita, dan basisnya 0x1840 bukan
   0x1860.

   Tapi bentuknya belum keluar. Yang sudah dicoba dan GAGAL:
     - render datar 32x16 dan 16x32
     - menjalin dua separuh sebagai baris genap/ganjil (interleave mode 6)
     - pindai korelasi baris ke seluruh segmen data

   Yang terlihat: 64 bita tiap entri terbelah jadi dua separuh yang nyaris sama
   tapi tidak persis -- konsisten dengan gambar-dan-mask, atau dua varian
   ter-geser. Belum terbukti yang mana.

   Maka bentuk kapal di sini DIGAMBAR SENDIRI. Presedennya Hopper, dan alasannya
   sama: menyamarkan yang belum terpecahkan sebagai kesetiaan cuma cara halus
   untuk tidak mengakuinya.

   ------------------------------------------------------------------------
   TEMUAN 4 — PIKSEL MODE 6 TIDAK PERSEGI

   640x200 di layar 4:3 membuat tiap piksel 2,4 kali lebih tinggi daripada
   lebar. Dunia di sini 640x480: bidang yang sama, dipetakan ke piksel persegi.
   Kalau dipakai 640x200 apa adanya, lingkaran jadi lonjong dan sudut rotasi
   tidak lagi sudut -- yang justru merusak hal yang sedang ditiru.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, loop, rng } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const db = store('spacewar');
  const D = window.RETRO.SPACEWAR;

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] !== null) e.setAttribute(k, attrs[k]);
    return e;
  }
  function tulis(id, nilai) { const n = $(id); if (n) n.textContent = nilai; }
  const jepit = (t) => Math.max(0, Math.min(1, t));

  // =========================================================================
  // Aturan — yang BINER datang dari teks di dalam EXE
  // =========================================================================
  const FOTON_ONGKOS = 1, FOTON_RUSAK = 4;      // BINER 0x3CA9
  const FASER_ONGKOS = 1, FASER_RUSAK = 2;      // BINER 0x3CE4
  const IMPULS_ONGKOS = 1, IMPULS_TIAP = 0.5;   // BINER 0x3D21
  const CLOAK_ONGKOS = 1, CLOAK_TIAP = 0.5;     // BINER 0x3D5B
  const HYPER_ONGKOS = 8;                       // BINER 0x3D95
  const ISI_ULANG_TIAP = 2;                     // BINER 0x3DF9

  /* Yang di bawah ini TIDAK ada di binernya dalam bentuk kalimat. Ia rekonstruksi,
     dan dipisahkan ke bloknya sendiri supaya batas itu terlihat dari kode, bukan
     cuma dari dokumen. Nilainya dipilih supaya konsisten dengan yang pasti:
     shield 24 berarti tepat enam foton (6 x 4) -- pertandingan yang cukup panjang
     untuk terasa, cukup pendek untuk selesai. */
  const SHIELD_AWAL = 24, ENERGI_AWAL = 20, ENERGI_MAKS = 40;
  const SHIELD_MAKS = 40, SENJATA_AWAL = 8, SENJATA_MAKS = 20;
  const SHIELD_RENDAH = 6;                      // ambang bunyi peringatan
  const LANGKAH_SUDUT = 16;                     // PILIHAN -- lihat koreksi di kepala
  const PUTAR_TIAP = 0.09;                      // detik per langkah 22,5 derajat
  const DORONG = 132;                           // percepatan impuls, px/dtk^2
  const LAJU_MAKS = 190;
  const FOTON_LAJU = 260, FOTON_UMUR = 2.6;
  const FASER_LAJU = 520, FASER_UMUR = 0.55;
  const GESEK = 0.9992;                         // sangat kecil; ruang hampa
  const GRAVITASI = 1.35e6;                     // G*M, disetel agar orbit terasa
  const PLANET_R = 26, PLANET_KURAS = 8;        // kuras shield per detik menyentuh
  const HYPER_AMAN = 90;                        // jarak minimum dari planet
  /* Di dalam radius ini kapal tidak bisa lagi lepas: ia tersedot. Angkanya
     dipilih tepat di luar bayangan yang tergambar (17), supaya saat animasinya
     mulai kapalnya masih terlihat -- kalau penangkapannya terjadi di dalam
     bayangan, yang tampak cuma kapal yang hilang begitu saja. */
  const SEDOT_R = 21, SEDOT_LAMA = 1.9;

  const LEBAR = 640, TINGGI = 480;

  // =========================================================================
  // Peta tombol — dipanen dari layar GAME KEYS
  // =========================================================================
  /* `D.kiri` dan `D.kanan` masing-masing sembilan entri {tombol, aksi, off*}.
     Aksi dipetakan ke perintah lewat KATA di dalamnya, bukan lewat urutan:
     kalau tabel di binernya suatu saat terbaca berbeda, yang berubah cuma
     tombolnya, bukan sambungannya ke logika. */
  function perintahDari(aksi) {
    if (aksi.includes('PHASER')) return 'faser';
    if (aksi.includes('PHOTON')) return 'foton';
    if (aksi.includes('CLOAK')) return 'cloak';
    if (aksi.includes('CCW')) return 'kiri';
    if (aksi.includes('CW')) return 'kanan';
    if (aksi.includes('IMPULSE')) return 'dorong';
    if (aksi.includes('HYPER')) return 'hyper';
    if (aksi.includes('WEAPON')) return 'keSenjata';
    if (aksi.includes('SHIELD')) return 'keShield';
    return null;
  }

  const PETA = [{}, {}];                        // kode tombol -> perintah, per kapal
  [D.kiri, D.kanan].forEach((sisi, i) => {
    sisi.forEach(e => {
      const p = perintahDari(e.aksi);
      if (p) PETA[i][e.tombol.toLowerCase()] = p;
    });
  });

  // =========================================================================
  // Keadaan
  // =========================================================================
  const FASE = { DIAM: 'diam', MAIN: 'main', USAI: 'usai' };
  let fase = FASE.DIAM, mainLoop, acak, lapis, bintang, lubang;
  let kapal, peluru, tekan = {}, jeda = false, pemenang = null, tUsai = 0;
  let sebabMenang = '';
  let akum = 0, ledakan = [];

  function kapalBaru(i) {
    return {
      i,
      x: i ? LEBAR * 0.78 : LEBAR * 0.22,
      y: TINGGI / 2,
      vx: 0, vy: i ? -46 : 46,
      sudut: i ? 12 : 4,                        // 0 = ke kanan, naik searah jarum jam
      tPutar: 0, tImpuls: 0, tCloak: 0, tIsi: 0, tTembak: 0,
      shield: SHIELD_AWAL, energi: ENERGI_AWAL, senjata: SENJATA_AWAL,
      cloak: false, hidup: true, tHyper: 0, tPeringatan: 0, sedot: null
    };
  }

  function reset() {
    acak = rng(Date.now() & 0xffff);
    kapal = [kapalBaru(0), kapalBaru(1)];
    peluru = []; ledakan = []; pemenang = null; tekan = {}; jeda = false; tUsai = 0;
  }

  const rad = (k) => k * (Math.PI * 2 / LANGKAH_SUDUT);
  const robot = (i) => $(i ? 't-kanan' : 't-kiri') && $(i ? 't-kanan' : 't-kiri').checked;
  const adaPlanet = () => $('t-planet') && $('t-planet').checked;
  const adaGravitasi = () => adaPlanet() && $('t-gravitasi') && $('t-gravitasi').checked;

  // =========================================================================
  // Bentuk — digambar sendiri, bukan dari tabel sprite
  // =========================================================================
  function siapkanBentuk(defs) {
    /* --- dua kapal -------------------------------------------------------
       Aturan yang menentukan seluruh rancangannya, dan bukan soal selera:

       1. ARAH HADAP harus terbaca seketika. Itu satu-satunya informasi yang
          dipakai pemain tiap detik. Karena itu tiap kapal punya hidung panjang
          yang jelas dan buritan yang jelas -- bukan bentuk yang nyaris simetris.
       2. Keduanya dibedakan SILUET lebih dulu, warna kemudian. Kalau warnanya
          dilucuti, yang kiri tetap harus terbaca sebagai pencegat bersayap
          sapuan dan yang kanan sebagai kapal berat berpolong samping.
       3. Ia digambar sekitar 29 unit di dunia 640 unit -- di layar sekitar 30
          piksel. Pada ukuran itu detail halus jadi bubur, jadi tiap kapal cuma
          punya LIMA bagian: siluet gelap, pelat atas yang lebih terang, kanopi,
          aksen warna regu, dan nyala mesin. Menambah bagian keenam tidak akan
          terlihat; ia cuma menambah ongkos gambar.
       4. Lambungnya GELAP dengan garis tepi terang, bukan sebaliknya. Di atas
          ruang hitam, bentuk terang penuh berubah jadi bercak; yang membuat
          bentuknya terbaca adalah tepinya.

       Keduanya menghadap KANAN pada sudut 0. */
    const KAPAL = [
      {
        id: 's-kapal0', warna: '#8ef0a4', tepi: '#e9fff0',
        // Pencegat: hidung panjang, dua sayap tersapu ke belakang, buritan kotak.
        siluet: 'M17 0 L8 -2.6 L2 -3.2 L-3 -10 L-8 -10 L-6 -3.4 L-12 -3.6'
              + ' L-12 3.6 L-6 3.4 L-8 10 L-3 10 L2 3.2 L8 2.6 Z',
        pelat:  'M13 0 L7 -1.7 L1 -2.1 L-2 -6.6 L-5.6 -6.6 L-4.4 -2.2 L-9.6 -2.3'
              + ' L-9.6 2.3 L-4.4 2.2 L-5.6 6.6 L-2 6.6 L1 2.1 L7 1.7 Z',
        kanopi: 'M9.6 0 L4.6 -1.4 L0.4 -1.1 L0.4 1.1 L4.6 1.4 Z',
        aksen: ['M-3.2 -9.4 L-7.6 -9.4 L-6.9 -7.3 L-3.9 -7.3 Z',
                'M-3.2 9.4 L-7.6 9.4 L-6.9 7.3 L-3.9 7.3 Z'],
        mesin: [[-11.6, -1.9], [-11.6, 1.9]]
      },
      {
        id: 's-kapal1', warna: '#9fd7ff', tepi: '#eaf4ff',
        // Kapal berat: hidung tumpul, badan lebar, dua polong mesin di samping.
        siluet: 'M16 0 L11.5 -3 L-2 -5 L-4 -11 L-9 -11 L-9 -5.6 L-12 -5'
              + ' L-12 5 L-9 5.6 L-9 11 L-4 11 L-2 5 L11.5 3 Z',
        pelat:  'M12 0 L8.5 -1.9 L-1.4 -3.3 L-3 -8.4 L-7.4 -8.4 L-7.4 -3.6'
              + ' L-9.8 -3.2 L-9.8 3.2 L-7.4 3.6 L-7.4 8.4 L-3 8.4 L-1.4 3.3'
              + ' L8.5 1.9 Z',
        kanopi: 'M8.8 0 L4.6 -1.7 L0.6 -1.4 L0.6 1.4 L4.6 1.7 Z',
        aksen: ['M-4.2 -10.4 L-8.6 -10.4 L-8.6 -8.6 L-4.2 -8.6 Z',
                'M-4.2 10.4 L-8.6 10.4 L-8.6 8.6 L-4.2 8.6 Z'],
        mesin: [[-11.6, -3.4], [-11.6, 0], [-11.6, 3.4]]
      }
    ];

    KAPAL.forEach(k => {
      const g = el('g', { id: k.id });
      /* Garis tepi terang: inilah yang membuat bentuknya terbaca di atas ruang
         hitam pada ukuran 30 piksel. Tebalnya 0,9 -- lebih tipis jadi hilang,
         lebih tebal jadi memakan bentuk yang dikelilinginya. */
      g.append(el('path', { d: k.siluet, fill: '#1b2431', stroke: k.tepi,
        'stroke-width': .9, 'stroke-linejoin': 'round' }));
      g.append(el('path', { d: k.pelat, fill: '#38485e' }));
      k.aksen.forEach(d => g.append(el('path', { d, fill: k.warna })));
      // Kanopi: satu-satunya bagian yang lebih terang dari garis tepinya, jadi
      // mata langsung jatuh ke sana -- dan kanopi selalu ada di DEPAN.
      g.append(el('path', { d: k.kanopi, fill: '#bfe9ff' }));
      g.append(el('path', { d: k.kanopi, fill: 'none', stroke: '#06121e',
        'stroke-width': .5 }));
      /* Nosel, bukan lampu. Sepasang lingkaran terang di buritan terbaca sebagai
         MATA -- dan begitu terbaca sebagai mata, seluruh kapalnya berubah jadi
         wajah. Diganti rumah gelap bersudut dengan celah tipis di dalamnya. */
      k.mesin.forEach(([x, y]) => {
        g.append(el('path', {
          d: 'M' + (x + 1.4) + ' ' + (y - 1.9) + ' L' + (x - 1.6) + ' ' + (y - 1.5)
             + ' L' + (x - 1.6) + ' ' + (y + 1.5) + ' L' + (x + 1.4) + ' ' + (y + 1.9) + ' Z',
          fill: '#0a1018' }));
        g.append(el('path', {
          d: 'M' + (x + .2) + ' ' + (y - 1.15) + ' L' + (x - 1.1) + ' ' + (y - .95)
             + ' L' + (x - 1.1) + ' ' + (y + .95) + ' L' + (x + .2) + ' ' + (y + 1.15) + ' Z',
          fill: k.warna }));
      });
      defs.append(g);
    });

    /* Semburan impuls: satu def per kapal, karena letak mesinnya berbeda.
       Menempelkan satu bentuk api yang sama ke keduanya akan membuat nyalanya
       keluar dari tempat yang bukan mesin -- kesalahan kecil yang justru
       merusak kesan bahwa kapalnya benda yang dirancang. */
    KAPAL.forEach((k, i) => {
      const api = el('g', { id: 's-api' + i });
      k.mesin.forEach(([x, y]) => {
        api.append(el('path', {
          d: 'M' + x + ' ' + (y - 1.5) + ' L' + (x - 9) + ' ' + y
             + ' L' + x + ' ' + (y + 1.5) + ' Z',
          fill: '#ffd27a', opacity: .95
        }));
        api.append(el('path', {
          d: 'M' + x + ' ' + (y - .8) + ' L' + (x - 5) + ' ' + y
             + ' L' + x + ' ' + (y + .8) + ' Z',
          fill: '#fff6e0'
        }));
      });
      defs.append(api);
    });

    lubangHitam(defs);
  }

  /* =========================================================================
     Lubang hitam — Gargantua, bentuk yang dipakai film Interstellar (2014)

     Binernya menyebut benda ini PLANET, dan kalimatnya dikutip apa adanya di
     panel: "Touching the PLANET will drain your SHIELDS." Yang berubah cuma
     RUPANYA, atas permintaan pemilik proyek. Fisikanya tidak ikut berubah -- ia
     tetap satu titik massa dengan radius yang sama.

     Yang membuat Gargantua dikenali bukan bola hitamnya, melainkan tiga hal,
     dan ketiganya harus ada atau gambarnya jadi "bola hitam biasa":

       1. Cakram akresi dilihat HAMPIR DARI TEPI -- pipih, memanjang mendatar.
       2. Cincin ter-lensa yang melengkung DI ATAS dan DI BAWAH bayangannya.
          Itu sisi jauh cakram yang sama, yang cahayanya dibelokkan gravitasi
          sampai terlihat menekuk ke atas dan ke bawah. Inilah cirinya.
       3. Bayangan hitam pekat dengan cincin foton tipis yang memeluknya.

     Urutan gambarnya yang menghasilkan kedalaman, dan urutannya tidak bebas:
     sisi JAUH cakram digambar lebih dulu, lalu bayangannya menutupi bagian yang
     ada di belakang, baru sisi DEKAT digambar di atas segalanya. Kalau seluruh
     cakram digambar sekaligus, ia tampak seperti cincin yang ditempel di depan
     bola -- bukan cakram yang mengelilinginya.
     ========================================================================= */
  function lubangHitam(defs) {
    const RS = 17;                 // jari-jari bayangan (event horizon di layar)
    const RD = 68, TD = 10;        // jangkauan dan ketebalan inti cakram akresi

    /* --- kenapa semuanya bertepi lembut ----------------------------------
       Versi sebelumnya menggambar cakramnya sebagai elips: bentuk bertepi
       TEGAS, gradiennya cuma mendatar. Dari dekat itu salah, dan salahnya
       mendasar -- cakram akresi bukan benda padat melainkan gas bercahaya, dan
       di seluruh gambar Gargantua hanya ADA SATU tepi tegas: siluet bayangannya.
       Segala yang lain meredup.

       Jadi tiap bentuk bercahaya di sini memakai dua gradien sekaligus:
         - `fill` linearGradient mendatar  -> suhu dan pancaran Doppler
         - `mask` radialGradient           -> kerapatan, meredup ke segala arah
       Elipsnya dibuat jauh lebih besar daripada cakram yang terlihat, supaya
       cahayanya sudah habis sebelum tepi geometrinya tercapai. Dengan begitu
       tidak ada satu pun garis batas yang bisa terlihat. */
    const g = el('linearGradient', { id: 'lh-cakram', x1: 0, y1: 0, x2: 1, y2: 0 });
    [['0%', '#3a1000'], ['14%', '#c2470a'], ['30%', '#ff9d2a'],
     ['43%', '#ffd98f'], ['50%', '#fff6e2'], ['58%', '#ffce7a'],
     ['72%', '#ff8a1e'], ['88%', '#a03200'], ['100%', '#2a0a00']
    ].forEach(([o, c]) => g.append(el('stop', { offset: o, 'stop-color': c })));
    defs.append(g);

    /* Profil kerapatan. Tetap penuh di inti, lalu turun panjang dan halus.
       Perhentian di 38% itu yang membuat bidang cakramnya tetap terbaca sebagai
       bidang; tanpa itu ia jadi kabut merata tanpa bentuk. */
    const mk = (id, stops) => {
      const rg = el('radialGradient', { id });
      stops.forEach(([o, a]) => rg.append(el('stop', {
        offset: o, 'stop-color': '#fff', 'stop-opacity': a })));
      defs.append(rg);
    };
    mk('lh-rapat', [['0%', 1], ['38%', .96], ['58%', .6], ['76%', .24],
                    ['90%', .07], ['100%', 0]]);
    mk('lh-renggang', [['0%', .5], ['45%', .3], ['72%', .1], ['100%', 0]]);

    const topeng = (id, grad, rx, ry) => {
      const m = el('mask', { id, maskUnits: 'userSpaceOnUse',
                             x: -rx, y: -ry, width: rx * 2, height: ry * 2 });
      m.append(el('ellipse', { rx, ry, fill: 'url(#' + grad + ')' }));
      defs.append(m);
    };
    topeng('lh-m-cakram', 'lh-rapat', RD * 1.45, TD * 3.1);
    topeng('lh-m-halo', 'lh-renggang', RD * 1.9, TD * 6.5);
    /* Bidang paling panas butuh topengnya SENDIRI. Dipakaikan topeng cakram,
       ia jatuh di daerah paling pekat topeng itu dan keluar sebagai pita
       bertepi tegas -- tepi tegas terakhir yang tersisa di gambar ini. Topeng
       yang ketinggiannya sepadan dengan pitanya membuatnya memudar ke atas dan
       ke bawah juga, bukan cuma ke kiri dan ke kanan. */
    topeng('lh-m-panas', 'lh-rapat', RD * 1.45, 3.6);
    /* Pita sisi dekat: satu-satunya bagian cakram yang boleh MENUTUPI bayangan,
       jadi ia harus tipis DAN pendek. Lihat catatan di langkah (6). */
    topeng('lh-m-pita', 'lh-rapat', RS * 2.4, 3.6);

    // Cincin ter-lensa: paling terang di puncak lengkungnya, memudar ke sisi.
    const gl = el('linearGradient', { id: 'lh-lensa', x1: 0, y1: 0, x2: 1, y2: 0 });
    [['0%', '#3a1200', 0], ['18%', '#ff8f1e', .55], ['50%', '#fff0c8', 1],
     ['82%', '#ff8f1e', .55], ['100%', '#3a1200', 0]
    ].forEach(([o, c, a]) => gl.append(el('stop', {
      offset: o, 'stop-color': c, 'stop-opacity': a })));
    defs.append(gl);

    /* TIDAK ADA feGaussianBlur di sini. Kelembutannya dibuat dari radialGradient
       untuk pendar, dan tiga goresan bertumpuk yang makin tipis dan makin pekat
       untuk lengkung ter-lensa. Keduanya geometri biasa, bukan pengolahan piksel,
       jadi ongkosnya jauh di bawah blur -- dan itu berarti di sini, karena
       `lapis` dibangun ulang tiap bingkai di lapisan cat yang sama.

       KOREKSI: filter blur-nya semula dibuang karena saya kira ia yang membuat
       kompositor berhenti menjawab permintaan tangkapan layar. Itu salah --
       halaman Hopper yang tidak punya filter apa pun ternyata gagal juga, jadi
       macetnya di alat uji, bukan di gambar ini. Alasan kinerja di atas tetap
       berlaku sendiri; alasan yang KELIRU-lah yang dicabut, bukan keputusannya. */
    const pendar = el('radialGradient', { id: 'lh-pendar' });
    [['0%', 0], ['58%', 0], ['70%', .34], ['80%', .2], ['100%', 0]
    ].forEach(([o, a]) => pendar.append(el('stop', {
      offset: o, 'stop-color': '#ff9d2a', 'stop-opacity': a })));
    defs.append(pendar);

    /* Separuh cakram dipotong dengan <clipPath>. Potongannya di y=0 tidak akan
       terlihat sebagai garis karena kedua separuh memakai gradien DAN topeng
       yang sama persis -- keduanya tersambung kembali seolah tak pernah dipotong. */
    // Pandangan sedikit dari ATAS: bidang cakram yang melintas di depan
    // bayangan jatuh di bawah titik tengahnya, bukan tepat membelahnya.
    const MIRING = 3.5;

    // Bidang cakram dipotong di tempat bayangannya berada, supaya bagian paling
    // panas tidak melintas DI DEPAN bayangan -- itu berarti cahaya menembusnya.
    const cl = el('clipPath', { id: 'lh-luar' });
    cl.append(el('rect', { x: -RD * 1.6, y: -TD * 4,
                           width: RD * 1.6 - RS - 1, height: TD * 8 }));
    cl.append(el('rect', { x: RS + 1, y: -TD * 4,
                           width: RD * 1.6 - RS - 1, height: TD * 8 }));
    defs.append(cl);

    // Redshift: dipakai kapal yang sedang tersedot, bukan oleh lubangnya sendiri.
    const merah = el('filter', { id: 'lh-merah' });
    merah.append(el('feColorMatrix', { type: 'matrix', values:
      '1.25 .45 .25 0 .04   .12 .30 .10 0 0   .05 .06 .22 0 0   0 0 0 1 0' }));
    defs.append(merah);

    const cakram = (rx, ry, mask, op) => {
      const e = el('ellipse', { rx, ry, fill: 'url(#lh-cakram)',
                                mask: 'url(#' + mask + ')' });
      if (op !== undefined) e.setAttribute('opacity', op);
      return e;
    };

    const lh = el('g', { id: 's-lubang' });

    /* (0) Batas bahaya yang sebenarnya, digambar samar.
       Cahayanya membentang jauh melewati zona yang benar-benar berbahaya. Tanpa
       penanda, pemain akan menduga seluruh cakram terang itu mematikan dan
       menghindari ruang yang sebenarnya aman. Cincinnya sengaja nyaris tak
       terlihat: menuntun kalau dicari, tidak mengganggu kalau tidak. */
    lh.append(el('circle', { r: PLANET_R + 9, fill: 'none', stroke: '#ff8f6b',
      'stroke-width': .7, 'stroke-dasharray': '2 9', opacity: .14 }));

    // (1) halo terluar: gas tipis, tanpa tepi sama sekali
    lh.append(cakram(RD * 1.9, TD * 6.5, 'lh-m-halo', .5));

    /* (2) Seluruh cakram, DI BELAKANG bayangan.
       Versi sebelumnya memotongnya jadi separuh-jauh dan separuh-dekat, lalu
       menggambar separuh-dekat di depan bayangan. Yang salah bukan idenya
       melainkan TEBALNYA: separuh-dekat itu setengah bidang, dan pudarnya
       membentang 31 piksel sedangkan bayangannya berjari-jari 17. Akibatnya
       seluruh bagian bawah bayangan tertutup terang, dan bayangannya berhenti
       terbaca sebagai bola.

       Cakram yang sebenarnya TIPIS. Cahaya yang meluas itu pendar, dan pendar
       tidak menghalangi apa-apa. Jadi pembagiannya sekarang bukan atas-bawah
       melainkan menurut fungsinya: yang meluas ditaruh di BELAKANG, dan yang
       menutupi cuma satu pita sempit di langkah (6). */
    lh.append(cakram(RD * 1.45, TD * 3.1, 'lh-m-cakram'));

    /* (3) cincin ter-lensa, lengkung ATAS. Inilah ciri Gargantua: ia sisi JAUH
       dari cakram yang sama, yang cahayanya dibelokkan sampai terlihat menekuk
       melewati atas dan bawah bayangannya. Digambar dua lapis -- satu lebar dan
       kabur, satu tipis di dalamnya -- supaya terang di tengah dan habis ke tepi
       tanpa garis batas. */
    const RLX = RS + 3.5, RLY = RS + 7;
    const lengkung = (atas) => {
      const y = atas ? 1.5 : -1.5, sweep = atas ? 1 : 0;
      const d = 'M' + (-RLX) + ' ' + y + ' A' + RLX + ' ' + RLY + ' 0 0 ' + sweep
              + ' ' + RLX + ' ' + y;
      const g2 = el('g', {});
      [[6.4, .16], [3.6, .34], [1.8, .92]].forEach(([w, o]) => {
        g2.append(el('path', { d, fill: 'none', stroke: 'url(#lh-lensa)',
          'stroke-width': w, 'stroke-linecap': 'round', opacity: o }));
      });
      return g2;
    };
    lh.append(lengkung(true));

    /* (4) bayangan: SATU-SATUNYA tepi tegas di seluruh gambar ini. Cincin
       fotonnya tipis dan tajam karena memang begitu; pendar di sekitarnya kabur. */
    lh.append(el('circle', { r: RS + 11, fill: 'url(#lh-pendar)' }));
    lh.append(el('circle', { r: RS, fill: '#000' }));
    lh.append(el('circle', { r: RS + .9, fill: 'none', stroke: '#ffe4b5',
      'stroke-width': 1.2, opacity: .92 }));

    // (5) cincin ter-lensa, lengkung BAWAH -- di depan bayangan
    lh.append(lengkung(false));

    /* (6) Pita sisi DEKAT -- satu-satunya yang melintas di depan bayangan.
       Ditaruh sedikit di bawah titik tengah, seperti pandangan sedikit dari
       atas: hitam di atas pita, hitam lagi di bawahnya. Itu yang membuat
       bayangannya tetap terbaca sebagai bola dan bukan sebagai bulan sabit.

       PANJANGNYA cuma 2,4 x jari-jari bayangan, bukan selebar cakram. Versi
       sebelumnya selebar cakram, dan akibatnya di kiri dan kanan lubang ia
       berjalan SEJAJAR dengan cakram utama -- terbaca sebagai DUA cincin, satu
       di tengah dan satu sedikit di bawahnya. Itu salah: sisi dekat dan sisi
       jauh adalah cakram yang SAMA, dan di kedua ujungnya mereka menyatu jadi
       satu garis. Mereka cuma terpisah di dekat pusat, tempat yang satu lewat di
       depan lubang dan yang lain dibelokkan ke atasnya. Dilaporkan pemilik
       proyek, dan usul perbaikannya -- pendekkan sampai sebatas bagian hitamnya
       saja -- persis yang benar. */
    const pita = el('g', {});
    const isi = el('g', { transform: 'translate(0,' + (MIRING + 4) + ')' });
    isi.append(el('ellipse', { rx: RS * 2.4, ry: 3.6, fill: 'url(#lh-cakram)',
      mask: 'url(#lh-m-pita)' }));
    pita.append(isi);
    lh.append(pita);

    // (7) bidang paling panas, dipotong di tepi bayangan dan ikut memudar
    const panas = el('g', { 'clip-path': 'url(#lh-luar)' });
    panas.append(el('ellipse', { rx: RD * 1.45, ry: 3.6, fill: '#fff8ea',
      mask: 'url(#lh-m-panas)', opacity: .62 }));
    lh.append(panas);

    defs.append(lh);
  }

  /* Medan bintang dibangun SEKALI, bukan tiap bingkai. Ia tidak pernah berubah,
     dan menggambar ulang dua ratus lingkaran enam puluh kali sedetik cuma untuk
     mendapatkan gambar yang identik adalah ongkos tanpa hasil. */
  function taburBintang(g) {
    const r = rng(20250810);
    for (let i = 0; i < 190; i++) {
      const t = r.next();
      g.append(el('circle', {
        cx: (r.next() * LEBAR).toFixed(1), cy: (r.next() * TINGGI).toFixed(1),
        r: (t < .82 ? .7 : 1.3).toFixed(1), fill: '#dfe9ff',
        opacity: (0.18 + t * 0.6).toFixed(2)
      }));
    }
  }

  // =========================================================================
  // Gambar
  // =========================================================================
  function gambar() {
    while (lapis.firstChild) lapis.firstChild.remove();

    /* Lubang hitamnya TIDAK ikut digambar ulang tiap bingkai. Ia tidak pernah
       bergerak dan memakai tiga filter blur; me-rasterisasi ulang tiga puluh kali
       sedetik untuk gambar yang identik adalah ongkos tanpa hasil -- alasan yang
       persis sama dengan medan bintang. Yang berubah cuma tampil atau tidak. */
    if (lubang) lubang.style.display = adaPlanet() ? '' : 'none';

    peluru.forEach(p => {
      if (p.jenis === 'foton') {
        lapis.append(el('circle', { cx: p.x, cy: p.y, r: 2.6, fill: '#ffe9a8' }));
        lapis.append(el('circle', { cx: p.x, cy: p.y, r: 5.2, fill: 'none',
          stroke: '#ffbe4d', 'stroke-width': .8, opacity: .55 }));
      } else {
        // Faser: garis, bukan titik -- ia jauh lebih cepat dan harus terbaca begitu.
        lapis.append(el('path', {
          d: 'M' + p.x + ' ' + p.y + ' L' + (p.x - p.vx * 0.02) + ' ' + (p.y - p.vy * 0.02),
          stroke: '#ff8f6b', 'stroke-width': 1.8, 'stroke-linecap': 'round'
        }));
      }
    });

    kapal.forEach(k => {
      if (!k.hidup) return;
      if (k.sedot) return gambarSedot(k);
      const g = el('g', {
        /* Skala 1,3: bentuk aslinya dirancang pada kotak ~28 piksel, dan pada
           layar 640 lebar itu terlalu kecil untuk dibaca sebagai KAPAL YANG
           MENGHADAP KE SUATU ARAH -- padahal arah hadap satu-satunya informasi
           yang harus terbaca seketika di permainan ini. */
        transform: 'translate(' + k.x.toFixed(1) + ',' + k.y.toFixed(1) + ') '
          + 'rotate(' + (k.sudut * 360 / LANGKAH_SUDUT).toFixed(1) + ') scale(1.3)',
        // Cloak tidak menghilangkan kapal sepenuhnya: lawan manusia butuh sesuatu
        // untuk dikejar, dan "hilang total" bukan permainan melainkan tebak-tebakan.
        opacity: k.cloak ? .22 : 1
      });
      if (k.dorongTampil) g.append(el('use', { href: '#s-api' + k.i }));
      g.append(el('use', { href: '#s-kapal' + k.i }));
      lapis.append(g);
      if (k.shield <= SHIELD_RENDAH && !k.cloak) {
        lapis.append(el('circle', { cx: k.x, cy: k.y, r: 17, fill: 'none',
          stroke: '#ff6b6b', 'stroke-width': 1,
          opacity: (0.25 + 0.35 * Math.sin(k.tPeringatan * 9)).toFixed(2) }));
      }
    });

    ledakan.forEach(x => {
      const u = x.t / x.umur;
      lapis.append(el('circle', { cx: x.x, cy: x.y, r: (4 + 34 * u).toFixed(1),
        fill: 'none', stroke: '#ffd27a', 'stroke-width': (2.4 * (1 - u)).toFixed(2),
        opacity: (1 - u).toFixed(2) }));
      lapis.append(el('circle', { cx: x.x, cy: x.y, r: (2 + 18 * u).toFixed(1),
        fill: 'none', stroke: '#ff8f6b', 'stroke-width': (1.6 * (1 - u)).toFixed(2),
        opacity: (1 - u).toFixed(2) }));
    });
  }

  /* Kapal yang tersedot: mengecil sambil terpilin masuk, meregang ke arah
     lubangnya, memerah, lalu habis.

     Peregangannya yang membuatnya terbaca sebagai TERSEDOT dan bukan sekadar
     mengecil. Ia dikerjakan di kerangka RADIAL: diputar dulu supaya sumbu-x
     menunjuk ke lubang, diregangkan di sana, baru diputar balik ke arah hadap
     kapalnya. Kalau diregangkan di kerangka kapalnya sendiri, arah regangannya
     ikut berputar bersama kapal -- dan yang terlihat kapal yang melar acak. */
  function gambarSedot(k) {
    const p = k.sedot;
    const u = jepit(p.t / SEDOT_LAMA);
    const sisa = 1 - u;
    const radial = Math.atan2(k.y - TINGGI / 2, k.x - LEBAR / 2) * 180 / Math.PI;
    const hadap = k.sudut * 360 / LANGKAH_SUDUT;
    const kecil = 1.3 * Math.pow(sisa, 1.15);

    const g = el('g', {
      opacity: Math.pow(sisa, 0.65).toFixed(3),
      transform: 'translate(' + k.x.toFixed(1) + ',' + k.y.toFixed(1) + ') '
        + 'rotate(' + radial.toFixed(1) + ') '
        + 'scale(' + (1 + 2.6 * u * u).toFixed(3) + ',' + (1 - 0.55 * u).toFixed(3) + ') '
        + 'rotate(' + (hadap - radial).toFixed(1) + ') '
        + 'scale(' + kecil.toFixed(3) + ')'
    });
    if (u > 0.3) g.setAttribute('filter', 'url(#lh-merah)');
    g.append(el('use', { href: '#s-kapal' + k.i }));
    lapis.append(g);

    // Jejak busur di belakangnya: sisa lintasan yang baru saja dilewati.
    if (u > 0.08) {
      const a = Math.atan2(k.y - TINGGI / 2, k.x - LEBAR / 2);
      const r = Math.hypot(k.x - LEBAR / 2, k.y - TINGGI / 2);
      const b = a - p.arah * 1.15;
      lapis.append(el('path', {
        d: 'M' + (LEBAR / 2 + Math.cos(a) * r).toFixed(1) + ' '
           + (TINGGI / 2 + Math.sin(a) * r).toFixed(1)
           + ' A' + (r * 1.18).toFixed(1) + ' ' + (r * 1.18).toFixed(1) + ' 0 0 '
           + (p.arah > 0 ? 0 : 1) + ' '
           + (LEBAR / 2 + Math.cos(b) * r * 1.5).toFixed(1) + ' '
           + (TINGGI / 2 + Math.sin(b) * r * 1.5).toFixed(1),
        fill: 'none', stroke: '#ff9d6b', 'stroke-width': (1.6 * sisa).toFixed(2),
        'stroke-linecap': 'round', opacity: (0.5 * sisa).toFixed(2)
      }));
    }
  }

  function segarkan() {
    kapal.forEach(k => {
      tulis('h' + k.i + '-shield', Math.max(0, Math.round(k.shield)));
      tulis('h' + k.i + '-energi', Math.max(0, Math.floor(k.energi)));
      tulis('h' + k.i + '-senjata', Math.max(0, Math.floor(k.senjata)));
      const n = $('h' + k.i + '-bar');
      if (n) n.style.width = Math.max(0, Math.min(100, k.shield / SHIELD_MAKS * 100)) + '%';
      const s = $('h' + k.i + '-status');
      if (s) s.textContent = !k.hidup ? 'hancur' : k.sedot ? 'tersedot'
        : k.cloak ? 'cloak' : robot(k.i) ? 'robot' : 'manusia';
    });
  }

  // =========================================================================
  // Fisika dan aturan
  // =========================================================================
  function bungkus(o) {
    if (o.x < 0) o.x += LEBAR; else if (o.x > LEBAR) o.x -= LEBAR;
    if (o.y < 0) o.y += TINGGI; else if (o.y > TINGGI) o.y -= TINGGI;
  }

  /* Jarak terpendek di dunia yang membungkus. Tanpa ini, dua kapal yang saling
     berdekatan lewat tepi layar akan dihitung berjauhan -- dan robotnya berbalik
     ke arah yang salah, yang di layar terlihat seperti robot yang bodoh. */
  function delta(a, b) {
    let dx = b.x - a.x, dy = b.y - a.y;
    if (dx > LEBAR / 2) dx -= LEBAR; else if (dx < -LEBAR / 2) dx += LEBAR;
    if (dy > TINGGI / 2) dy -= TINGGI; else if (dy < -TINGGI / 2) dy += TINGGI;
    return { dx, dy, d: Math.hypot(dx, dy) };
  }

  function tarikPlanet(o, dt) {
    if (!adaGravitasi()) return;
    const { dx, dy, d } = delta(o, { x: LEBAR / 2, y: TINGGI / 2 });
    const r = Math.max(PLANET_R, d);
    const a = GRAVITASI / (r * r * r);
    o.vx += dx * a * dt; o.vy += dy * a * dt;
  }

  function tembak(k, jenis) {
    if (k.tTembak > 0) return;
    const ongkos = jenis === 'foton' ? FOTON_ONGKOS : FASER_ONGKOS;
    if (k.senjata < ongkos) return;
    k.senjata -= ongkos;
    k.tTembak = jenis === 'foton' ? 0.34 : 0.16;
    const a = rad(k.sudut), laju = jenis === 'foton' ? FOTON_LAJU : FASER_LAJU;
    peluru.push({
      jenis, dari: k.i,
      x: k.x + Math.cos(a) * 15, y: k.y + Math.sin(a) * 15,
      vx: k.vx + Math.cos(a) * laju, vy: k.vy + Math.sin(a) * laju,
      umur: jenis === 'foton' ? FOTON_UMUR : FASER_UMUR
    });
    // `sound(freq, ticks)`: satuannya 1/18,2 detik, pencacah IBM PC -- bukan detik.
    audio.sound(jenis === 'foton' ? 220 : 760, jenis === 'foton' ? 1.6 : 0.8);
  }

  function hyper(k) {
    if (k.energi < HYPER_ONGKOS) return;
    k.energi -= HYPER_ONGKOS;
    // Muncul di tempat acak yang tidak menempel planet -- kalau tidak, hyperspace
    // jadi cara mati, bukan cara kabur.
    for (let c = 0; c < 40; c++) {
      const x = acak.next() * LEBAR, y = acak.next() * TINGGI;
      if (Math.hypot(x - LEBAR / 2, y - TINGGI / 2) > HYPER_AMAN) { k.x = x; k.y = y; break; }
    }
    k.vx *= 0.3; k.vy *= 0.3;
    ledakan.push({ x: k.x, y: k.y, t: 0, umur: 0.45 });
    audio.sound(120, 3);
  }

  function perintah(k, p, dt) {
    if (p === 'kiri')  { if (k.tPutar <= 0) { k.sudut = (k.sudut + LANGKAH_SUDUT - 1) % LANGKAH_SUDUT; k.tPutar = PUTAR_TIAP; } }
    if (p === 'kanan') { if (k.tPutar <= 0) { k.sudut = (k.sudut + 1) % LANGKAH_SUDUT; k.tPutar = PUTAR_TIAP; } }
    if (p === 'dorong') {
      /* Ongkosnya per SETENGAH DETIK, bukan per bingkai -- itu yang tertulis di
         binernya, dan bedanya besar: per bingkai akan menghabiskan energi enam
         puluh kali lebih cepat. */
      k.tImpuls += dt;
      if (k.tImpuls >= IMPULS_TIAP) {
        k.tImpuls -= IMPULS_TIAP;
        if (k.energi >= IMPULS_ONGKOS) k.energi -= IMPULS_ONGKOS; else return;
      }
      if (k.energi > 0) {
        const a = rad(k.sudut);
        k.vx += Math.cos(a) * DORONG * dt; k.vy += Math.sin(a) * DORONG * dt;
        k.dorongTampil = true;
      }
    }
    if (p === 'foton') tembak(k, 'foton');
    if (p === 'faser') tembak(k, 'faser');
    if (p === 'hyper') hyper(k);
    if (p === 'cloak') {
      k.tCloak += dt;
      if (k.tCloak >= CLOAK_TIAP) {
        k.tCloak -= CLOAK_TIAP;
        if (k.energi >= CLOAK_ONGKOS) k.energi -= CLOAK_ONGKOS; else return;
      }
      if (k.energi > 0) k.cloak = true;
    }
    /* WEAPON ENERGY dan SHIELD ENERGY: namanya pasti, perilakunya SIMPULAN.
       Yang pasti dari teksnya cuma "You must have energy to use WEAPONS or
       DEFENCES" -- jadi keduanya diperlakukan sebagai pengalihan dari cadangan
       ENERGY ke salah satu dari dua bank. Itu bacaan yang memberi kesembilan
       tombolnya pekerjaan, tapi ia tetap bacaan. */
    if (p === 'keSenjata' && k.energi >= 1 && k.senjata < SENJATA_MAKS) { k.energi -= 1; k.senjata += 1; }
    if (p === 'keShield'  && k.energi >= 1 && k.shield  < SHIELD_MAKS)  { k.energi -= 1; k.shield  += 1; }
  }

  // =========================================================================
  // Robot — "The Left Robot player is defensive. The Right Robot player is
  // offensive." Dua kalimat itu ada di binernya; wataknya bukan karangan.
  // =========================================================================
  function otak(k, lawan, dt) {
    const t = delta(k, lawan);
    const pl = delta(k, { x: LEBAR / 2, y: TINGGI / 2 });
    const menyerang = k.i === 1;
    const keluar = [];

    // Menjauh dari planet lebih dulu, apa pun wataknya: tertarik masuk berarti
    // kehilangan shield terus-menerus, dan tidak ada watak yang untung dari itu.
    let mauX = t.dx, mauY = t.dy;
    /* Ambangnya dinaikkan dari 150 sejak lubangnya bisa MENANGKAP, bukan cuma
       menguras: sekali di dalam SEDOT_R tidak ada lagi yang bisa dilakukan, jadi
       robot harus berbalik jauh sebelum sampai ke sana. */
    if (adaPlanet() && pl.d < 190) { mauX = -pl.dx; mauY = -pl.dy; }
    else if (!menyerang) {
      // Bertahan: jaga jarak sedang. Terlalu dekat dihindari, terlalu jauh
      // didekati -- supaya ia tetap ikut bertanding, bukan cuma kabur.
      const ingin = 210;
      const arah = t.d < ingin ? -1 : 1;
      mauX = t.dx * arah; mauY = t.dy * arah;
    }

    const sudutMau = Math.atan2(mauY, mauX);
    const sudutTembak = Math.atan2(t.dy, t.dx);
    const sekarang = rad(k.sudut);
    const beda = (a) => { let d = a - sekarang; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; };

    // Kalau lawan hampir tepat di depan, membidik menang atas bermanuver.
    const bidik = Math.abs(beda(sudutTembak));
    const arahkan = bidik < 0.45 && t.d < 340 ? sudutTembak : sudutMau;
    const d = beda(arahkan);
    if (d > 0.22) keluar.push('kanan'); else if (d < -0.22) keluar.push('kiri');

    if (Math.abs(beda(sudutMau)) < 0.6 && k.energi > 3) keluar.push('dorong');

    if (bidik < 0.30 && t.d < 300 && k.senjata >= 1) keluar.push(menyerang ? 'foton' : 'faser');
    // Faser juga alat bertahan: teksnya menyebut ia bisa menembak foton yang
    // datang. Robot bertahan memakainya begitu ada foton lawan yang mendekat.
    if (!menyerang && peluru.some(p => p.jenis === 'foton' && p.dari !== k.i
        && delta(k, p).d < 130 && Math.abs(beda(Math.atan2(delta(k, p).dy, delta(k, p).dx))) < 0.5)) {
      keluar.push('faser');
    }

    if (k.shield <= SHIELD_RENDAH) {
      if (k.energi >= HYPER_ONGKOS && t.d < 150) keluar.push('hyper');
      else if (!menyerang && k.energi > 2) keluar.push('cloak');
    }
    if (k.energi > (menyerang ? 12 : 16)) keluar.push(menyerang ? 'keSenjata' : 'keShield');
    else if (k.senjata < 2 && k.energi > 4) keluar.push('keSenjata');

    keluar.forEach(p => perintah(k, p, dt));
  }

  // =========================================================================
  // Gelung
  // =========================================================================
  function update(dt) {
    if (fase !== FASE.MAIN || jeda) return;
    akum += dt;

    kapal.forEach(k => {
      if (!k.hidup) return;
      if (k.sedot) return majuSedot(k, dt);
      k.cloak = false; k.dorongTampil = false;
      if (pemenang !== null) { k.x += k.vx * dt; k.y += k.vy * dt; bungkus(k); return; }
      k.tPutar -= dt; k.tTembak -= dt; k.tPeringatan += dt;

      k.tIsi += dt;
      if (k.tIsi >= ISI_ULANG_TIAP) {           // BINER: 1 unit tiap 2 detik
        k.tIsi -= ISI_ULANG_TIAP;
        k.energi = Math.min(ENERGI_MAKS, k.energi + 1);
      }

      if (robot(k.i)) otak(k, kapal[1 - k.i], dt);
      else for (const kode in PETA[k.i]) if (tekan[kode]) perintah(k, PETA[k.i][kode], dt);

      tarikPlanet(k, dt);
      const laju = Math.hypot(k.vx, k.vy);
      if (laju > LAJU_MAKS) { k.vx *= LAJU_MAKS / laju; k.vy *= LAJU_MAKS / laju; }
      k.vx *= GESEK; k.vy *= GESEK;
      k.x += k.vx * dt; k.y += k.vy * dt;
      bungkus(k);

      // BINER 0x3EA4: "Touching the PLANET will drain your SHIELDS."
      const jarak = delta(k, { x: LEBAR / 2, y: TINGGI / 2 }).d;
      if (adaPlanet() && jarak < PLANET_R + 9) {
        k.shield -= PLANET_KURAS * dt;
        if (k.shield <= 0) return hancur(k);
      }
      // Lebih dalam dari itu tidak ada lagi jalan keluar, berapa pun shield-nya.
      if (adaPlanet() && jarak < SEDOT_R) mulaiSedot(k);
    });

    for (let i = peluru.length - 1; i >= 0; i--) {
      const p = peluru[i];
      p.umur -= dt;
      if (p.jenis === 'foton') tarikPlanet(p, dt);
      p.x += p.vx * dt; p.y += p.vy * dt;
      bungkus(p);
      if (p.umur <= 0) { peluru.splice(i, 1); continue; }

      if (adaPlanet() && delta(p, { x: LEBAR / 2, y: TINGGI / 2 }).d < PLANET_R) {
        peluru.splice(i, 1); continue;
      }

      // BINER 0x3E31: "Use PHASERS to shoot incoming PHOTON TORPEDOS."
      if (p.jenis === 'faser') {
        const j = peluru.findIndex(q => q.jenis === 'foton' && q.dari !== p.dari
                                     && delta(p, q).d < 7);
        if (j >= 0) {
          ledakan.push({ x: peluru[j].x, y: peluru[j].y, t: 0, umur: 0.3 });
          peluru.splice(Math.max(i, j), 1); peluru.splice(Math.min(i, j), 1);
          audio.sound(520, 1);
          continue;
        }
      }

      const sasaran = kapal[1 - p.dari];
      if (sasaran.hidup && delta(p, sasaran).d < 11) {
        sasaran.shield -= p.jenis === 'foton' ? FOTON_RUSAK : FASER_RUSAK;
        ledakan.push({ x: p.x, y: p.y, t: 0, umur: 0.35 });
        peluru.splice(i, 1);
        audio.sound(160, 1.4);
        if (sasaran.shield <= 0) hancur(sasaran);
      }
    }

    for (let i = ledakan.length - 1; i >= 0; i--) {
      ledakan[i].t += dt;
      if (ledakan[i].t >= ledakan[i].umur) ledakan.splice(i, 1);
    }

    if (tUsai > 0) { tUsai -= dt; if (tUsai <= 0) { gambar(); return usai(); } }

    if (akum > 0.033) { akum = 0; gambar(); segarkan(); }
  }

  /* Fase tidak langsung dipindah ke USAI. Kalau layarnya beku pada bingkai yang
     sama dengan tembakan terakhir, ledakannya tidak pernah terlihat -- pemain
     cuma melihat kapal lenyap dan spanduk muncul. Jadi ada jeda 1,1 detik yang
     tetap menganimasikan, sama seperti animasi mati di Hopper. */
  const TUNDA_USAI = 1.1;

  function mulaiSedot(k) {
    if (k.sedot) return;
    const dx = k.x - LEBAR / 2, dy = k.y - TINGGI / 2;
    k.sedot = {
      t: 0,
      r0: Math.max(6, Math.hypot(dx, dy)),
      a0: Math.atan2(dy, dx),
      // Arah pilinan mengikuti arah gerak kapalnya saat tertangkap, bukan
      // dipilih tetap -- kalau tetap, kapal yang masuk dari kiri dan dari kanan
      // akan berpilin ke arah yang sama dan itu terlihat seperti animasi kaleng.
      arah: (dx * k.vy - dy * k.vx) >= 0 ? 1 : -1
    };
    k.vx = k.vy = 0;
    audio.play('mbl32t255o3ccro2gro2cro1g');
  }

  function majuSedot(k, dt) {
    const p = k.sedot;
    p.t += dt;
    const u = jepit(p.t / SEDOT_LAMA);
    // Jari-jari menyusut makin cepat, sudut berputar makin cepat: dua-duanya
    // dipangkatkan supaya detik terakhirnya jauh lebih cepat dari detik pertama.
    const r = p.r0 * Math.pow(1 - u, 1.7);
    const a = p.a0 + p.arah * u * u * 7.5;
    k.x = LEBAR / 2 + Math.cos(a) * r;
    k.y = TINGGI / 2 + Math.sin(a) * r;
    if (u >= 1) { k.sedot = null; hancur(k, true); }
  }

  function hancur(k, tanpaLedakan) {
    if (!k.hidup) return;
    k.hidup = false; k.shield = 0; k.sedot = null;
    /* Kapal yang tersedot tidak meledak. Ledakan berarti "hancur di tempat",
       dan yang barusan terjadi justru sebaliknya: ia hilang ke dalam sesuatu.
       Menambahkan ledakan di situ akan membatalkan seluruh animasinya. */
    if (!tanpaLedakan) {
      for (let i = 0; i < 3; i++) ledakan.push({ x: k.x, y: k.y, t: -i * 0.12, umur: 0.7 });
      audio.play('mbl16t255o2cro1gro1c');
    }
    pemenang = 1 - k.i;
    sebabMenang = tanpaLedakan ? 'Lawan tersedot ke dalam lubang hitam'
                               : 'Shield lawan habis';
    tUsai = TUNDA_USAI;
    catatMenang(pemenang);
  }

  function usai() {
    fase = FASE.USAI;
    const nama = pemenang ? 'KANAN' : 'KIRI';
    pesanLayar('KAPAL ' + nama + ' MENANG', sebabMenang,
               'Tekan Mulai untuk bertanding lagi');
    tulis('go', 'Main lagi');
    const b = $('jeda'); if (b) b.disabled = true;
    gambar(); segarkan();
  }

  // =========================================================================
  // Papan
  // =========================================================================
  function catatMenang(i) {
    const p = db.get('menang', [0, 0]);
    p[i] = (p[i] || 0) + 1;
    db.set('menang', p);
    tampilMenang();
  }
  function tampilMenang() {
    const p = db.get('menang', [0, 0]);
    tulis('h0-menang', p[0] || 0);
    tulis('h1-menang', p[1] || 0);
  }

  function pesanLayar(judul, baris, kaki) {
    const p = $('pesan');
    if (!p) return;
    if (!judul) { p.hidden = true; p.innerHTML = ''; return; }
    p.hidden = false;
    p.innerHTML = '<strong class="w-pesan__judul"></strong>'
                + '<span class="w-pesan__baris"></span>'
                + '<span class="w-pesan__kaki"></span>';
    p.querySelector('.w-pesan__judul').textContent = judul;
    p.querySelector('.w-pesan__baris').textContent = baris || '';
    p.querySelector('.w-pesan__kaki').textContent = kaki || '';
  }

  // =========================================================================
  // Pemasangan
  // =========================================================================
  $('topbar-host').append(ui.topbar({
    title: 'Spacewar',
    source: 'SPACEWAR.EXE · Bill Seiler · 1985 · dibongkar dari EXE',
    backHref: '../../index.html'
  }));

  const svg = el('svg', {
    viewBox: '0 0 ' + LEBAR + ' ' + TINGGI, class: 'w-svg',
    role: 'img', 'aria-label': 'Layar Spacewar, dua kapal dan sebuah lubang hitam'
  });
  const defs = el('defs', {});
  svg.append(defs);
  siapkanBentuk(defs);
  bintang = el('g', {});
  taburBintang(bintang);
  svg.append(bintang);
  lubang = el('g', {});
  lubang.append(el('use', { href: '#s-lubang', x: LEBAR / 2, y: TINGGI / 2 }));
  svg.append(lubang);
  lapis = el('g', {});
  svg.append(lapis);
  $('layar').append(svg);

  // --- HUD dua sisi, dibangun dari peta tombol yang dipanen -----------------
  const hud = $('hud');
  [0, 1].forEach(i => {
    const w = document.createElement('div');
    w.className = 'w-sisi w-sisi--' + i;
    w.innerHTML =
      '<div class="w-sisi__kepala"><span class="w-sisi__nama"></span>'
      + '<span class="w-sisi__status" id="h' + i + '-status">—</span></div>'
      + '<div class="w-bar"><i id="h' + i + '-bar"></i></div>'
      + '<div class="w-angka">'
      + '<span>SHIELD <b id="h' + i + '-shield">0</b></span>'
      + '<span>ENERGY <b id="h' + i + '-energi">0</b></span>'
      + '<span>WEAPON <b id="h' + i + '-senjata">0</b></span>'
      + '<span>menang <b id="h' + i + '-menang">0</b></span>'
      + '</div>';
    w.querySelector('.w-sisi__nama').textContent = i ? 'KAPAL KANAN' : 'KAPAL KIRI';
    hud.append(w);
  });

  // --- legenda tombol, langsung dari string biner ---------------------------
  const kunci = $('kunci');
  if (kunci) {
    [['LEFT PLAYER KEYS', D.kiri], ['RIGHT PLAYER KEYS', D.kanan]].forEach(([judul, sisi]) => {
      const kol = document.createElement('div');
      kol.className = 'w-kunci__kol';
      const h = document.createElement('p');
      h.className = 'w-kunci__judul';
      h.textContent = judul;                    // judulnya pun dari binernya
      kol.append(h);
      sisi.forEach(e => {
        const r = document.createElement('p');
        r.className = 'w-kunci__baris';
        const k = document.createElement('kbd'); k.textContent = e.tombol;
        const s = document.createElement('span'); s.textContent = e.aksi;
        r.append(k, s);
        kol.append(r);
      });
      kunci.append(kol);
    });
  }

  /* --- panel sprite: kapal 1985 yang sesungguhnya ------------------------
     Tiap sudut digambar sebagai SATU <path>, bukan 256 <rect>. Piksel yang
     bersebelahan mendatar digabung jadi satu ruas, jadi sebuah kapal 16x16
     biasanya cuma belasan ruas. Dengan 32 kapal di halaman ini, bedanya antara
     ~400 simpul dan ~8.000. */
  function petakSprite(baris) {
    let d = '';
    baris.forEach((r, y) => {
      let x = 0;
      while (x < r.length) {
        if (r[x] !== '#') { x++; continue; }
        let n = 0;
        while (x + n < r.length && r[x + n] === '#') n++;
        d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z';
        x += n;
      }
    });
    return d;
  }

  function pasangSprite(idHost, kunci) {
    const host = $(idHost);
    if (!host || !D.sprite || !D.sprite[kunci]) return;
    D.sprite[kunci].forEach((baris, i) => {
      const s = el('svg', { viewBox: '0 0 16 16', class: 'w-sprite__sel',
                            role: 'img', 'aria-label': 'sudut ' + i });
      s.append(el('path', { d: petakSprite(baris), fill: 'currentColor' }));
      host.append(s);
    });
  }
  /* Judul dengan font milik programnya sendiri. Tiap huruf satu <svg> 16x8,
     dan langkah majunya 10 piksel -- bukan 16 -- persis seperti `add ax,0xa` di
     `sub_46DD`. Kalau dipakai 16, tulisannya jadi renggang dan tidak lagi
     memperlihatkan bagaimana program itu benar-benar menata hurufnya. */
  function tulisFont(idHost, teks) {
    const host = $(idHost);
    if (!host || !D.font) return;
    const g = D.font.glif;
    [...teks].forEach(c => {
      const k = c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
      if (!g[k]) return;
      const s = el('svg', { viewBox: '0 0 16 8', class: 'w-font__glif',
                            role: 'img', 'aria-label': c });
      s.append(el('path', { d: petakSprite(g[k]), fill: 'currentColor' }));
      host.append(s);
    });
    host.setAttribute('aria-label', teks);
  }
  tulisFont('font-judul', 'SPACEWAR V1.50');

  pasangSprite('sprite-kiri', 'kiri');
  pasangSprite('sprite-kanan', 'kanan');

  // --- panel teks, ditampilkan apa adanya ----------------------------------
  tulis('instruksi', D.instruksi.map(e => e.teks).join('\n'));
  tulis('shareware', D.shareware.map(e => e.teks).join('\n'));
  tulis('tolak', D.syarat);
  tulis('farce', D.farce);
  tulis('versi', D.versi);
  tulis('cipta', D.hakCipta);

  mainLoop = loop({ update, hz: 60 });

  /* Sama seperti Hopper: gelung dinyalakan LEBIH DULU. Apa pun yang gagal di
     antara sini dan akhir fungsi tidak boleh berakibat "permainan tidak jalan". */
  function mulai() {
    reset();
    fase = FASE.MAIN;
    mainLoop.start();
    jeda = false;
    pesanLayar(null);
    tulis('go', 'Berjalan');
    const b = $('jeda'); if (b) { b.disabled = false; b.textContent = 'Jeda'; }
    gambar(); segarkan();
  }

  const KODE = {};
  [0, 1].forEach(i => { for (const k in PETA[i]) KODE[k] = true; });

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (!KODE[k]) return;
    e.preventDefault();
    if (fase !== FASE.MAIN) return mulai();     // tombol apa pun memulai
    tekan[k] = true;
  });
  window.addEventListener('keyup', (e) => { tekan[e.key.toLowerCase()] = false; });
  window.addEventListener('blur', () => { tekan = {}; });

  $('go').addEventListener('click', mulai);
  $('jeda').addEventListener('click', () => {
    if (fase !== FASE.MAIN) return;
    jeda = !jeda;
    $('jeda').textContent = jeda ? 'Lanjut' : 'Jeda';
    pesanLayar(jeda ? 'JEDA' : null, jeda ? 'Permainan dihentikan sementara' : '',
               jeda ? 'Tekan Lanjut' : '');
  });
  ['t-kiri', 't-kanan', 't-planet', 't-gravitasi'].forEach(id => {
    const n = $(id);
    if (n) n.addEventListener('change', () => { gambar(); segarkan(); });
  });

  reset();
  tampilMenang();
  gambar(); segarkan();
})();
