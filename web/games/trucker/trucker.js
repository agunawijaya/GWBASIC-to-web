/* ===========================================================================
   trucker.js — port TRUCKER.BAS (Hughes Glantzberg, Carrollton TX, 1982)

   Los Angeles -> New York dengan truk trailer. Tiap putaran = SATU JAM, dan
   satu-satunya keputusan tetapnya adalah kecepatan.

   Tiga hal yang membentuk berkas ini:

   1. ANGKA KEEMPAT TIAP TITIK JALAN MEMUAT DUA HAL. `INT(ZH)` memilih jenis
      kejadian (baris 3130), pecahannya adalah PELUANG KEJADIAN ITU TIDAK JADI
      (`IF RND < ZH-INT(ZH) THEN RETURN`). Kecuali jenis 2, di mana pecahannya
      besar tolnya dalam dolar. Satu bilangan, dua makna.

   2. 55 MPH ADALAH PUNCAK KURVA IRIT. Baris 1480-1490: konsumsi = SP/(4,5 -
      0,2*|55-SP|). Bukan angka sembarangan -- itu batas kecepatan nasional AS
      1974, dan program ini menaruhnya persis di puncaknya.

   3. PENGUKUR BAHAN BAKARNYA BERBOHONG. Baris 1560 mencetak
      `INT(WF-4+RND*10)` -- nilai sebenarnya digeser acak antara -4 dan +5,
      diundi ulang tiap jam. Karena itu tulisannya "Approximate fuel".
   =========================================================================== */
(function () {
  'use strict';

  const D = window.RETRO.TRUCKER;
  const ui = window.RETRO.ui;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('trucker');
  const NS = 'http://www.w3.org/2000/svg';
  const mkn = (t, a) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]);
    return n;
  };
  const q = (id) => document.getElementById(id);

  /* Baris 1365-1375: tombol n/m/s memilih RT 1/0/2, dan RH (kepadatan
     pengawasan) 4/2/1. RH dipakai di tiga tempat yang saling melawan. */
  const PILIHAN = [
    { key: 'n', rt: 1, rh: 4, label: 'northern' },
    { key: 'm', rt: 0, rh: 2, label: 'middle' },
    { key: 's', rt: 2, rh: 1, label: 'southern' }
  ];

  /* ======================================================================
     Bagian 1 — keadaan (nama variabel dipertahankan dari aslinya)
     ====================================================================== */
  /* Nilai awal = keadaan baris 1000/1190 sebelum perjalanan dimulai, supaya
     papan angka tidak pernah menampilkan NaN sebelum tombol Mulai ditekan. */
  let XC = 190, MF = 0, HL = 3, HS = 7, HR = 0, WF = 190, TC = 10, TS = 1,
      SL = 55, NP = 0, CT = 2, WL = 40000, RT = 0, RH = 2, NT = 0, CX = 0;
  let bbmTampil = 190;      // angka yang DITAMPILKAN, bukan isi tangki
  let SP = 55, CD = 1, CDs = '', CR = 1, CRs = '', NSTOP = 0;
  let XP = 0, XN = 0;                       // laba kumulatif & jumlah perjalanan
  let rute = null, fase = 'awal', hidup = false, catatan = [];
  let benih = 1982, rnd = null;
  const RND = () => rnd();

  /* Lama animasi satu jam, dalam detik. Ini SELERA, bukan turunan dari
     apa pun di BASIC-nya -- aslinya satu jam berlalu seketika sesudah Anda
     menekan Enter. Lihat dokumen §11. */
  const DURASI = { lambat: 4.2, biasa: 2.6, cepat: 1.4, langsung: 0 };
  let laju = 'biasa';

  const acak = (b) => { const r = window.RETRO.rng(b); return () => r.next(); };

  /* ======================================================================
     Bagian 2 — waktu, baris 2100-2220
     HR=0 berarti Senin pukul 8 pagi, karena DH=HR+8.
     ====================================================================== */
  function jam(hr) {
    let dh = hr + 8, dt = Math.floor(dh / 24);
    dh = dh - 24 * dt;
    while (dt > 6) dt -= 7;
    let dm = 'AM';
    if (dh === 12) dm = 'Noon';
    else { if (dh > 12) { dh -= 12; dm = 'PM'; } if (dh === 0) { dh = 12; dm = 'Midnight'; } }
    return { hari: D.HARI[dt], dt: dt, jam: dh, dm: dm,
             teks: D.HARI[dt] + ' · ' + dh + ' ' + dm };
  }
  /* Jam 0..23 sungguhan, dipakai untuk warna langit. Perhatikan baris 5110
     memakai HR-INT(HR/24) yang BUKAN ini — lihat dokumen §8. */
  const jamHari = (hr) => (hr + 8) % 24;

  /* ======================================================================
     Bagian 3 — cuaca (2810-2985) dan kondisi pengemudi (3000-3060)
     ====================================================================== */
  const AMBANG = {
    0: [3400, 4900, 4700, 4200],     // middle  (baris 2870)
    1: [3300, 4800, 4600, 3800],     // north   (baris 2820)
    2: [4000, 5700, 5500, 4400]      // south   (baris 2910)
  };
  function cuaca() {
    const AF = (3000 + MF) * RND();
    const a = AMBANG[RT];
    /* `CR<>50` : sekali badai salju, tidak boleh langsung kembali cerah.
       Satu-satunya ingatan yang dimiliki cuaca di program ini. */
    if (AF < a[0] && CR !== 50) { CR = 1; CRs = 'clear & dry'; return; }
    if (AF > a[1]) { CR = 50; CRs = 'B-L-I-Z-Z-A-R-D !!'; return; }
    if (AF > a[2]) { CR = 10; CRs = 'fog — limited visibility'; return; }
    if (RT === 0) {                                    // baris 2900, khas middle
      if (AF > a[3]) {
        if (Math.floor(RND() * 3) + 1 === 1) { CR = 5; CRs = 'light snow'; return; }
        CR = 5; CRs = 'rain'; return;
      }
    } else if (RT === 1) {
      if (AF > a[3]) { CR = 5; CRs = 'light snow'; return; }
    } else {
      if (AF > a[3]) { CR = 5; CRs = 'rain'; return; }
    }
    CR = 3; CRs = 'clear, but roadway is wet';
  }

  function kondisi() {
    /* Baris 3020/3030 aslinya berbunyi `COS(HR/HS)<2.3` dan `<2.5`. COS tidak
       pernah melebihi 1, jadi kedua syarat itu SELALU benar dan tinggal HL
       yang menentukan. Dipertahankan apa adanya; lihat dokumen §8. */
    if (HL > 19 || HR / HS > 4) { CD = 100; CDs = '. . E X H A U S T E D . .'; return; }
    if (HL < 4) { CD = 1; CDs = 'rested & rearing to go'; return; }
    if (HL < 8) { CD = 2; CDs = 'fine'; return; }
    if (HL < 12 && HR / HS <= 3) { CD = 4; CDs = 'b o r e d'; return; }
    if (HL < 16 && HR / HS <= 3) { CD = 8; CDs = 't i r e d !!'; return; }
    CD = 25; CDs = 'fatigued… you\'re getting sleepy';
  }

  /* ======================================================================
     Bagian 4 — catatan layar
     ====================================================================== */
  /* Selama satu jam sedang dianimasikan, baris catatan tidak langsung
     ditulis melainkan DIANTREKAN dengan stempel waktu 0..1. Aturannya sudah
     selesai dijalankan seluruhnya; animasi cuma menceritakannya menurut
     urutan yang benar. */
  let antrean = null, saat = 0;
  function antre(o) { if (antrean) antrean.push(Object.assign({ pada: saat }, o)); }
  function prop(jenis, teksProp, extra) {
    antre(Object.assign({ jenis: jenis, teksProp: teksProp }, extra || {}));
  }

  function tulis(s, kelas) {
    if (antrean) { antre({ teks: s, kelas: kelas }); return; }
    catatan.push({ s: s, k: kelas || '' });
    if (catatan.length > 140) catatan.shift();
    const log = q('log');
    const p = document.createElement('p');
    p.className = 't-baris' + (kelas ? ' t-' + kelas : '');
    p.textContent = s;
    log.append(p);
    log.scrollTop = log.scrollHeight;
  }
  const bersihkanCatatan = () => { catatan = []; q('log').textContent = ''; };

  /* ======================================================================
     Bagian 5 — gambar
     Pemandangannya sendiri ada di trucker-scene.js; berkas ini hanya
     memberitahunya keadaan. Yang tetap di sini cuma PITA MIL, karena ia
     bukan pemandangan melainkan tampilan langsung struktur data rutenya.
     ====================================================================== */
  const svg = q('svg');
  const scene = window.RETRO.truckerScene;
  scene.pasang(svg, 1982);
  const gPita = mkn('g', {});
  svg.append(gPita);

  /* Hiasan TIDAK BOLEH mengambil dari aliran acak permainan. Kalau pesawat
     yang lewat ikut memakai rnd(), maka menyalakan animasi akan mengubah
     jalannya permainan -- dan port ini berhenti bisa diperbandingkan dengan
     aslinya. Karena itu hiasan punya aliran sendiri, dibenihi jam. */
  const rHias = (jam) => acak(9000 + jam);

  /* Pita mil: struktur data rutenya, apa adanya. Satu satuan-x = satu mil. */
  function gambarPita() {
    gPita.textContent = '';
    if (!rute) return;
    const X0 = 40, X1 = 760, Y = 424;
    const sx = (m) => X0 + (X1 - X0) * Math.min(1, m / rute.mil);
    gPita.append(mkn('rect', { class: 't-pitaLatar', x: X0, y: Y - 7, width: X1 - X0, height: 14, rx: 7 }));
    gPita.append(mkn('rect', {
      class: 't-pitaIsi', x: X0, y: Y - 7, width: Math.max(0, sx(MF) - X0), height: 14, rx: 7
    }));
    rute.titik.forEach((t) => {
      if (t.m >= 9999) return;
      const x = sx(t.m), lewat = MF >= t.m, jenis = Math.floor(t.z);
      const g = mkn('g', { class: 't-pin' + (lewat ? ' t-pin--lewat' : '') });
      g.append(mkn('circle', { class: 't-pinTitik t-pinTitik--' + jenis, cx: x, cy: Y, r: jenis ? 4.5 : 3 }));
      const ttl = mkn('title', {});
      ttl.textContent = t.n + ' — ' + t.j + ' (mil ' + t.m + ')' +
        (jenis ? ' · ' + D.KEJADIAN[jenis] : '');
      g.append(ttl);
      gPita.append(g);
    });
    const tr = mkn('g', { class: 't-pitaTruk', transform: 'translate(' + sx(MF).toFixed(1) + ' ' + (Y - 20) + ')' });
    tr.append(mkn('path', { d: 'M-9 0 L9 0 L9 -9 L2 -9 L-1 -14 L-9 -14 Z' }));
    tr.append(mkn('path', { class: 't-pitaTrukJarum', d: 'M0 2 L-4 9 L4 9 Z' }));
    gPita.append(tr);
    [['LOS ANGELES', X0, 'start'], ['NEW YORK', X1, 'end']].forEach(([s2, x, an]) => {
      const t = mkn('text', { class: 't-pitaNama', x: x, y: Y + 26, 'text-anchor': an });
      t.textContent = s2; gPita.append(t);
    });
  }

  /* Dua pintu ke adegan, dan bedanya penting:

       bangunAdegan()  membongkar dan menyusun ulang — hanya saat PERJALANAN
                       berganti, atau muatan/rute baru dipilih.
       gambarSemua()   memperbarui langit, cuaca, dan wilayah TANPA menyentuh
                       apa pun yang sedang bergerak.

     Versi pertama port ini hanya punya yang pertama, dan memanggilnya tiap
     jam. Akibatnya mobil yang sedang menyalip lenyap tiap kali jam berganti.
     Keadaan yang terlihat tidak boleh hilang tanpa sebab. */
  const keadaanAdegan = () => ({ hr: HR, cr: CR, ct: CT || 2, mf: MF || 0,
                                 panjang: rute ? rute.mil : 2850 });
  function bangunAdegan() { scene.bangun(keadaanAdegan()); }
  function gambarSemua() {
    scene.perbarui(keadaanAdegan());
    gambarPita();
    perbaruiHud();
  }

  /* ======================================================================
     Bagian 6 — papan angka
     ====================================================================== */
  function perbaruiHud() {
    const w = jam(HR);
    q('s-hari').textContent = w.teks;
    q('s-odo').textContent = Math.round(MF).toLocaleString('id-ID');
    q('s-sisa').textContent = rute ? Math.max(0, Math.round(rute.mil - MF)).toLocaleString('id-ID') : '—';
    /* Baris 1560: yang ditampilkan BUKAN WF melainkan INT(WF-4+RND*10).
       Angkanya diundi SEKALI PER JAM di jalanSatuJam(), bukan di sini --
       lihat komentar di sana. */
    q('s-bbm').textContent = bbmTampil;
    q('s-sp').textContent = SP;
    q('s-sl').textContent = SL;
    q('s-cd').textContent = CDs || '—';
    q('s-cr').textContent = CRs || '—';
    q('s-xc').textContent = '$' + (XC || 0).toFixed(2);
    q('s-tilang').textContent = NT || 0;
    q('s-benih').textContent = benih;
    q('s-cd').className = 'stat__value mono t-cd' + (CD >= 25 ? ' t-bahaya' : CD >= 8 ? ' t-awas' : '');
    q('s-cr').className = 'stat__value mono' + (CR >= 10 ? ' t-bahaya' : CR > 1 ? ' t-awas' : '');
    /* Peluang celaka bingkai ini, dari baris 1400-1420: SP^2*CD*CR / 10^7. */
    const p = rute ? Math.min(1, SP * SP * CD * CR / 1e7) : 0;
    q('s-risiko').textContent = (p * 100).toFixed(2).replace('.', ',') + ' %';
    q('s-risiko').className = 'stat__value mono' + (p > 0.1 ? ' t-bahaya' : p > 0.02 ? ' t-awas' : '');
    /* Bilah solar: nilai SEBENARNYA, dengan dua ambang yang juga tergambar
       sebagai zona di jalurnya — 20 galon (cadangan) dan 50 galon (waspada).
       Lima puluh galon kira-kira 225 mil pada 55 MPH, yaitu sekitar satu
       penggal antar truck stop; dua puluh galon kira-kira 90 mil. */
    const gal = Math.max(0, WF || 0);
    const bar = q('bar-bbm');
    bar.style.width = Math.min(100, 100 * gal / 200).toFixed(1) + '%';
    bar.classList.toggle('t-isi--cadangan', gal <= 20);
    bar.classList.toggle('t-isi--waspada', gal > 20 && gal <= 50);
    let Tb = Math.abs(55 - (SP || 55)); if (Tb > 12) Tb = 12.5;
    const mpg = 4.5 - 0.2 * Tb;
    q('bbm-teks').textContent = Math.round(gal) + ' gal \u00b7 ' +
      Math.round(gal * mpg) + ' mi @' + (SP || 55);
  }

  /* ======================================================================
     Bagian 7 — panel keputusan
     ====================================================================== */
  const panel = q('panel');
  function tanya(judul, isi) {
    panel.textContent = '';
    if (judul) {
      const h = document.createElement('p');
      h.className = 't-tanya'; h.textContent = judul; panel.append(h);
    }
    const row = document.createElement('div');
    row.className = 't-row';
    isi.forEach(n => row.append(n));
    panel.append(row);
  }
  const tombol = (teks, fn, kelas) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn ' + (kelas || 'btn--ghost btn--sm');
    b.textContent = teks;
    b.addEventListener('click', fn);
    return b;
  };
  const angka = (id, nilai, min, max, langkah) => {
    const i = document.createElement('input');
    i.type = 'number'; i.id = id; i.value = nilai;
    i.min = min; i.max = max; i.step = langkah || 1;
    i.className = 't-angka';
    return i;
  };
  const label = (teks) => {
    const s = document.createElement('span');
    s.className = 't-label'; s.textContent = teks; return s;
  };

  /* Selama animasi TIDAK ADA dialog: panelnya berubah jadi bilah keadaan
     tanpa satu pun tombol, supaya tidak ada keputusan yang bisa diambil di
     tengah jam yang sudah terlanjur dihitung. */
  function panelJalan() {
    panel.textContent = '';
    const d = document.createElement('div');
    d.className = 't-jalanBar';
    d.innerHTML = '<b>DRIVING</b> <span class="mono">' + SP + ' MPH</span>' +
      ' <span class="t-label">· ' + (CRs || '') + ' · ' + (CDs || '') + '</span>';
    const jalur = document.createElement('div');
    jalur.className = 't-jalanJalur';
    const isi = document.createElement('i');
    isi.className = 't-jalanIsi';
    isi.style.animationDuration = (DURASI[laju] || 0.01) + 's';
    jalur.append(isi);
    panel.append(d, jalur);
  }
  const majuPanel = () => {};

  /* ======================================================================
     Bagian 8 — alur
     ====================================================================== */
  function mulaiPerjalanan() {
    /* Tombol "Perjalanan baru" ada di luar panel, jadi ia bisa ditekan di
       tengah animasi. Hentikan adegannya dulu supaya tidak ada gelung lama
       yang masih menggeser benda milik perjalanan yang sudah dibuang. */
    scene.berhenti();
    antrean = null;
    lewatiStop = false;
    rnd = acak(benih);
    XC = 190; MF = 0; HL = 3; HS = 7; HR = 0;         // baris 1000
    bbmTampil = 190;
    NT = 0; CX = 0; CR = 1; CRs = 'clear & dry'; CD = 1;
    rute = null; hidup = true; SP = 55; SL = 55;
    bersihkanCatatan();
    tulis('You are at the Los Angeles trucking terminal.', 'judul');
    tulis('The cargo is due in New York by 4 PM on Thursday.');
    bangunAdegan();
    gambarPita(); perbaruiHud();
    pilihMuatan();
  }

  function pilihMuatan() {
    fase = 'muatan';
    tanya('Three types of cargo are available:', [
      tombol('1 — oranges', () => setMuatan(1), 'btn--primary btn--sm'),
      tombol('2 — freight forwarding', () => setMuatan(2)),
      tombol('3 — U.S. Mail', () => setMuatan(3))
    ]);
    const p = document.createElement('ul');
    p.className = 't-daftar';
    [['oranges', 'highest profit if they don\'t spoil — 6,5 ¢/lb'],
     ['freight forwarding', 'penalty for late delivery — 5 ¢/lb'],
     ['U.S. Mail', 'lowest rate, but no hurry to arrive — 4,75 ¢/lb']]
      .forEach(([a, b]) => {
        const li = document.createElement('li');
        li.innerHTML = '<b>' + a + '</b> — ' + b;
        p.append(li);
      });
    panel.append(p);
  }

  function setMuatan(t) {
    CT = t;
    tulis('Cargo: ' + ['oranges', 'freight forwarding', 'U.S. Mail'][t - 1], 'pilih');
    fase = 'berat';
    const inp = angka('wl', 40000, 25000, 50000, 500);
    tanya('How many pounds will you carry? (40,000 is the legal limit)', [
      inp, tombol('Muat', () => setBerat(Number(inp.value)), 'btn--primary btn--sm')
    ]);
    const n = document.createElement('p');
    n.className = 't-catatan';
    n.innerHTML = 'Baris 1110 menolak di bawah <b>25.000</b> ' +
      '(<i>"You can\'t make a living on half a load"</i>) dan baris 1200 memotong ' +
      'di <b>50.000</b>. Tapi jembatan timbang menimbang <b>kotor</b>: ' +
      '19.000 (traktor) + muatan + 7 lb/galon solar, batas 60.000 — jadi ' +
      '"batas resmi" 40.000 itu sudah <b>lewat</b> kalau tangki Anda penuh.';
    panel.append(n);
  }

  function setBerat(w) {
    WL = w;
    if (WL < 25000) { tulis('You can\'t make a living on half a load.', 'awas'); return; }
    if (WL > 50000) { WL = 50000; tulis('50,000 pounds of cargo has filled your trailer!', 'awas'); }
    /* baris 1190 */
    TC = 10; WF = 190; NP = 0; TS = 1; SL = 55; XN += 1;
    HR = HR + 1;                                       // baris 1220
    tulis('Loaded ' + WL.toLocaleString('en-US') + ' lb. Paid $190.00 for a nearly full tank of diesel.');
    fase = 'ban';
    tanya('Two of your tires are worn. Do you want replacements?', [
      tombol('Ban baru — $200', () => beliBan('n')),
      tombol('Vulkanisir — $100', () => beliBan('r')),
      tombol('Tidak', () => pilihRute(), 'btn--primary btn--sm')
    ]);
    const n = document.createElement('p');
    n.className = 't-catatan';
    n.innerHTML = 'Ban baru mengurangi keausan <code>TC</code> 4 satuan, ' +
      'vulkanisir 3 (baris 1310-1315). <code>TC</code> mulai dari 10, dan ' +
      'peluang ban meletus <code>SQR(MF+100)*TC</code> — jadi ini mengurangi ' +
      'risiko sepanjang perjalanan, bukan sekali pakai.';
    panel.append(n);
  }

  function beliBan(jenis) {
    const inp = angka('nban', 2, 1, 3, 1);
    tanya('How many? (baris 1290 hanya menerima 0–2 … lihat catatan)', [
      inp,
      tombol('Beli', () => {
        const t = Number(inp.value);
        /* Baris 1280: T=3 dengan ban BARU adalah pintu rahasia — ia memberi
           dua ban DAN mengisi ulang ban serep (TS=2), seharga satu ban. */
        if (t === 3 && jenis === 'n') {
          TS = 2; XC += 200; TC -= 4 * 2;
          tulis('Bought 3 new tires — and the spare rack is full again. (baris 1280)', 'pilih');
        } else if (t < 0 || t > 2) {
          tulis('I did not understand your answers. Let\'s try again!', 'awas');
          return setBerat(WL);
        } else if (t === 0) { /* baris 1300 */ }
        else if (jenis === 'r') { TC -= 3 * t; XC += 100 * t; }
        else { TC -= 4 * t; XC += 200 * t; }
        if (!(t === 3 && jenis === 'n') && t > 0)
          tulis('Bought ' + t + ' ' + (jenis === 'r' ? 'retread' : 'new') + ' tire(s).', 'pilih');
        pilihRute();
      }, 'btn--primary btn--sm')
    ]);
    const n = document.createElement('p');
    n.className = 't-catatan';
    n.innerHTML = 'Ketik <b>3</b> dengan ban <b>baru</b> dan baris 1280 memberi ' +
      'Anda dua ban <i>plus</i> ban serep kedua seharga satu ban. Baris 1290 ' +
      'yang menolak &gt;2 dijalankan <i>sesudahnya</i>, jadi tidak pernah kena.';
    panel.append(n);
  }

  function pilihRute() {
    fase = 'rute';
    tanya('You may choose the northern, middle or southern route.',
      PILIHAN.map(p => tombol(
        p.label + ' — ' + D.RUTE[p.rt].mil.toLocaleString('id-ID') + ' mil',
        () => setRute(p), p.key === 'm' ? 'btn--primary btn--sm' : 'btn--ghost btn--sm')));
    const tbl = document.createElement('table');
    tbl.className = 't-tbl';
    tbl.innerHTML =
      '<tr><th></th><th>mil</th><th>titik</th><th>RH</th><th>polisi</th><th>ban</th><th>badai di ujung</th></tr>' +
      PILIHAN.map(p => {
        const r = D.RUTE[p.rt];
        const badai = Math.max(0, 1 - AMBANG[p.rt][1] / (3000 + r.mil));
        return '<tr><td>' + p.label + '</td><td>' + r.mil.toLocaleString('id-ID') +
          '</td><td>' + r.titik.length + '</td><td>' + p.rh +
          '</td><td>' + (p.rh === 4 ? 'paling ketat' : p.rh === 2 ? 'sedang' : 'paling longgar') +
          '</td><td>' + (p.rh === 4 ? 'paling jarang' : p.rh === 2 ? 'sedang' : 'paling sering') +
          '</td><td>' + (badai * 100).toFixed(1).replace('.', ',') + ' %</td></tr>';
      }).join('');
    panel.append(tbl);
    const n = document.createElement('p');
    n.className = 't-catatan';
    n.innerHTML = '<b>RH</b> muncul di tiga tempat dan menariknya ke dua arah ' +
      'berlawanan: makin tinggi, makin cepat polisi menyalakan lampu ' +
      '(baris 1450) dan makin sulit lolos (2310) — tapi makin <i>jarang</i> ban ' +
      'meletus (1440). Rute utara paling pendek dan paling diawasi; rute ' +
      'selatan paling panjang, paling longgar, dan cuacanya paling ramah.';
    panel.append(n);
  }

  function setRute(p) {
    RT = p.rt; RH = p.rh; rute = D.RUTE[RT]; NP = 0;
    tulis('Route: ' + p.label + ' — ' + rute.mil.toLocaleString('en-US') + ' miles, ' +
          rute.titik.length + ' waypoints.', 'pilih');
    audio.play('T150L8O3CFAO4L4C');
    bangunAdegan();
    langkahBaru();
  }

  /* --- satu jam ---------------------------------------------------------- */
  function langkahBaru() {
    fase = 'jalan';
    cuaca(); kondisi(); gambarSemua();
    const t = rute.titik[NP];
    tulis('Cruising on ' + (t ? t.j : rute.titik[rute.titik.length - 1].j));
    tulis('You are feeling ' + CDs + ' · Current weather: ' + CRs,
          CD >= 25 || CR >= 10 ? 'awas' : '');
    NSTOP += 1;
    if (NSTOP > 3) return tawariTruckStop();
    tanyaKecepatan();
  }

  function tanyaKecepatan() {
    fase = 'kecepatan';
    const maks = Math.floor(1.5 * SL);                 // baris 1660
    const sl = document.createElement('input');
    /* Sesudah kehabisan bahan bakar baris 2500 menyetel SP=0, jadi nilai
       terakhir tidak selalu masuk akal sebagai bawaan penggeser. */
    sl.type = 'range'; sl.min = 20; sl.max = 100; sl.step = 5;
    sl.value = Math.max(20, Math.min(SP >= 20 ? SP : 55, maks));
    sl.className = 't-slider';
    const out = document.createElement('b');
    out.className = 't-spOut';
    const mpg = (v) => { let T = Math.abs(55 - v); if (T > 12) T = 12.5; return 4.5 - 0.2 * T; };
    const sync = () => {
      const v = Number(sl.value);
      const p = Math.min(1, v * v * CD * CR / 1e7);
      out.innerHTML = v + ' MPH &nbsp;·&nbsp; ' + mpg(v).toFixed(2).replace('.', ',') +
        ' mpg &nbsp;·&nbsp; celaka ' + (p * 100).toFixed(2).replace('.', ',') + ' %' +
        (v > SL ? ' &nbsp;·&nbsp; <span class="t-bahaya">di atas batas ' + SL + '</span>' : '');
    };
    sl.addEventListener('input', sync); sync();
    tanya('How fast do you wish to go? (batas jalan ' + SL + ', mesin mentok ' + maks + ')', [
      sl, out, tombol('Jalan satu jam', () => {
        let v = Number(sl.value);
        if (v < 20) { tulis('You have to go at least 20 —', 'awas'); return; }
        if (v > maks) { v = maks; tulis('You can only get the old rig to go ' + v + ' MPH on this road.', 'awas'); }
        SP = v; jalanSatuJam();
      }, 'btn--primary btn--sm')
    ]);
  }

  /* Baris 1400-1530 apa adanya. Urutan pemanggilan RND() tidak diubah sedikit
     pun; yang ditambahkan hanya stempel waktu untuk animasi. */
  function jalanSatuJam() {
    const MF0 = MF, HRawal = HR;
    antrean = []; saat = 0.10;
    let celakaDulu = false, sampaiDulu = false;

    let AF = SP * SP * CD * CR;                        // 1400
    if (AF > RND() * 10000000) celakaDulu = true;      // 1420
    else {
      AF = Math.sqrt(MF + 100) * TC;                   // 1430
      saat = 0.42; if (AF > RH * 25000 * RND()) banMeletus();   // 1440
      saat = 0.26; if (SP > SL - RH + 10) polisi();    // 1450
      HR += 1; HL += 1;                                // 1460
      if (SL < 40) SL = 55;                            // 1470
      let T = Math.abs(55 - SP); if (T > 12) T = 12.5; // 1480
      const T1 = SP / (4.5 - 0.2 * T);                 // 1490
      WF -= T1;                                        // 1500
      saat = 0.70; if (WF < 0) habisBbm(T1);
      MF += SP;                                        // 1510
      /* Baris 1560, di tempatnya yang benar dalam urutan: sesudah 1530,
         sebelum titik jalan. Ia mengambil SATU bilangan acak per jam, dan
         itu penting -- kalau diundi ulang tiap kali papan angka disegarkan,
         maka jumlah penyegaran tampilan ikut menggeser seluruh permainan.
         Persis itu yang terjadi pada percobaan pertama saya. */
      bbmTampil = Math.floor(WF - 4 + RND() * 10);
      if (MF > rute.mil) sampaiDulu = true;            // 1520
      else lewatTitik(MF0);
    }

    hias(MF0, HRawal);
    const daftar = antrean; antrean = null;
    fase = 'animasi';
    panelJalan();
    scene.jalan({
      sp: SP, detik: DURASI[laju] * (celakaDulu ? 0.7 : 1),
      langsung: laju === 'langsung',
      /* Adegan yang memainkan tabrakannya, dan `onSelesai` baru dipanggil
         sesudah truk berhenti menghantam. */
      celaka: celakaDulu,
      kejadian: daftar,
      onKejadian: (k) => { if (k.teks) tulis(k.teks, k.kelas); majuPanel(); },
      onSelesai: () => {
        if (celakaDulu) return celaka();
        gambarSemua();
        if (sampaiDulu) return sampai();
        langkahBaru();
      }
    });
  }

  /* Hiasan murni: pesawat, burung, kereta, tumbleweed. Memakai aliran acak
     TERPISAH (rHias) supaya menyalakan animasi tidak menggeser satu pun
     bilangan acak permainan. */
  function hias(MF0, jamKe) {
    const h = rHias(jamKe);
    const j = (HR + 8) % 24, siang = j >= 6 && j < 20;
    const bag = Math.min(4, Math.floor(5 * MF0 / rute.mil));
    if (h() < 0.18) antre({ pada: 0.15 + h() * 0.5, jenis: 'pesawat', langit: true });
    if (siang && h() < 0.22) antre({ pada: 0.1 + h() * 0.6, jenis: 'burung', langit: true });
    if (bag >= 1 && bag <= 3 && h() < 0.16) antre({ pada: 0.2 + h() * 0.5, jenis: 'kereta' });
    if (lewatiStop) { antre({ pada: 0.5, jenis: 'truckstop' }); lewatiStop = false; }
  }

  /* Baris 1600 + 3100-3140. `MF0` hanya dipakai untuk menaruh papan namanya
     pada saat yang tepat di dalam animasi. */
  function lewatTitik(MF0) {
    while (NP < rute.titik.length && rute.titik[NP].m <= MF && rute.titik[NP].m < 9999) {
      const t = rute.titik[NP];
      saat = Math.max(0.08, Math.min(0.92, (t.m - MF0) / Math.max(1, SP)));
      /* Papan nama kota dan perisai Interstate keduanya dibaca dari DATA. */
      const no = /I-(\d+)/.exec(t.j);
      if (no) prop('perisai', no[1]);
      prop('kota', t.n);
      tulis('You have just passed ' + t.n + ' — ' + t.j, 'titik');
      SL = 55;                                         // baris 3120
      kejadian(t);
      NP += 1;
    }
  }

  function kejadian(t) {
    const ZH = t.z, jenis = Math.floor(ZH), pecah = ZH - jenis;
    if (jenis === 1) { prop('zona'); HR += 1; tulis('Time zone changes — set clock ahead one hour.', 'kejadian'); return; }
    if (jenis === 2) {                                  // baris 3310
      const T = Math.round(100 * pecah);
      prop('tol');
      XC += T; tulis('STOP! Pay toll of $' + T.toFixed(2), 'kejadian'); return;
    }
    if (RND() < pecah) return;                          // 3360/3410/3710/3870
    if (jenis === 3) {
      prop('konstruksi'); prop('batas', '35');
      SL = 35; tulis('Construction ahead!! Slow down — speed limit 35 MPH', 'kejadian'); return;
    }
    if (jenis === 4) {                                  // radar
      const T = SP + RND() * 5 - 2;
      const kena = T > SL + 3;
      prop('radar', null, { nyala: kena });
      tulis('You were just clocked by radar at ' + T.toFixed(0) + ' MPH.', 'kejadian');
      if (kena) tilang(); else tulis('     No ticket this time.');
      return;
    }
    if (jenis === 5) return timbang(ZH);
    if (jenis === 6) return longsor();
    if (jenis === 7) return reefer();
  }

  /* Baris 3500-3690 */
  function timbang(ZH) {
    if (ZH === Math.floor(ZH) && RND() >= 0.5) return;
    prop('timbang');
    tulis('Weighing station open — trucks must stop.', 'kejadian');
    const T = 19000 + WL + 7 * WF + 25 * Math.floor(RND() * 10);
    tulis('Scale weighs truck with cargo, fuel & driver: ' +
          Math.round(T).toLocaleString('en-US') + ' pounds.');
    const lebih = Math.floor(T - 60000);
    if (lebih < 1) { tulis('     You\'re O.K.', 'baik'); return; }
    if (ZH === 5) {                                     // baris 3630, hanya Louisiana
      tulis('You are not allowed to enter Louisiana with that load.', 'awas');
      tulis('     Take a 200 mile detour through Arkansas with 45 MPH limit.');
      SL = 45;
      rute = JSON.parse(JSON.stringify(rute));          // salinan: aslinya menyunting DATA di tempat
      rute.titik[NP].j = 'Arkansas county roads';
      for (let i = 11; i < rute.titik.length; i++)
        if (rute.titik[i].m < 9999) rute.titik[i].m += 200;
      rute.mil += 200;
      return;
    }
    const T1 = Math.floor(RND() * 4) + 2;
    const denda = 200 + (lebih * T1) / 100;
    XC += denda;
    tulis('     Overweight fine is $200.00 plus ' + T1 + ' cents/pound. Pay $' +
          denda.toFixed(2), 'awas');
  }

  function longsor() {
    const T = Math.floor(RND() * 6);
    prop('terowongan');
    tulis('A rock slide has blocked the Alleghany Tunnel entrance.', 'kejadian');
    tulis('     Cleared in ' + T + ' hours.');
    HR += T;
    if (CT === 1) { WF -= 7 * T; if (WF <= 1) habisBbm(0); }
    const T1 = T > 1 ? Math.floor(T / 2 + 0.5) : 0;
    if (T1 > 3) HL = 0; else if (T1 > 0) HL = HL / 2;
    HS += T1;
    if (T1) tulis('     While waiting, you got ' + T1 + ' hours of sleep.');
  }

  function reefer() {
    if (CT > 1) return;                                 // baris 3860
    tulis('The trailer refrigeration unit has failed, endangering the cargo.', 'awas');
    tulis('     Repairs take 2 hours and cost $100.00.');
    CX += Math.floor(RND() * 5); HR += 2; HL += 2; XC += 100;
  }

  /* Baris 2300-2460 */
  function polisi() {
    if (Math.pow(SP - SL + 2 * RH - 5, 2) < 900 * RND()) return;
    tilang();
  }
  function tilang() {
    /* "Smokey is behind you" muncul saat mobil polisi mulai mengejar; sisa
       barisnya DITAHAN sampai truk benar-benar berhenti di bahu jalan.
       Larik `tertahan` diisi sesudah prop diantrekan -- ia dipegang lewat
       acuan, jadi urutan penulisannya di sini tidak jadi soal. */
    const tertahan = [];
    const tahan = (t, k) => antrean ? tertahan.push({ teks: t, kelas: k }) : tulis(t, k);

    tulis('Smokey is behind you with his lights on. Pull over!', 'awas');
    prop('tilang', null, { tertahan: tertahan });

    NT += 1;
    tahan('See the justice of the peace for your ' + (D.KE[NT - 1] || (NT + 'th')) + ' offense.');
    tahan('     Wait ' + NT + ' hours for your hearing.');
    HR += NT; HL += NT;
    if (NT > 3) {
      tahan('  You are sentenced to 30 days in jail for reckless driving.', 'bahaya');
      tahan('Your I.C.C. driver\'s license is revoked!', 'bahaya');
      return bangkrut();
    }
    const T = Math.floor(NT * (RND() * 5));
    const T1 = Math.floor(5 * (RT + NT * (RND() * 4)));
    const bayar = T1 + T * (SP - SL);
    XC += bayar;
    tahan('     The fine is $' + T1.toFixed(2) + ' plus $' + T.toFixed(2) +
          ' for each MPH over the limit. Pay $' + bayar.toFixed(2), 'awas');
  }

  /* Baris 2600-2740 */
  function banMeletus() {
    tulis('Your just blew a tire !!', 'bahaya');
    if (TS === 0) {
      tulis('Since your spare has already been used, you have to call a tow truck.');
      tulis('     This service cost $400.00 and took 4 hours.');
      HR += 4; HL += 4; XC += 400;
      return;
    }
    TC -= 2 * TS; TS = 0;
    const T = Math.floor(RND() * 2) + 1;
    tulis('     It took ' + T + ' hours to change the ' + (T === 1 ? 'outside' : 'inside') + ' tire.');
    HR += T;
    /* Baris 2660 berbunyi `HL=HR+T+1` — HR, bukan HL. Dipertahankan: satu
       huruf yang membuat ban kempes berujung "tertidur di belakang kemudi". */
    HL = HR + T + 1;
    tulis('     (baris 2660: HL=HR+T+1 — jam terjaga Anda melompat ke ' +
          Math.round(HL) + ')', 'catatan');
  }

  /* Baris 2500-2590.

     Kejadian ini sebelumnya HANYA ada di teks, dan itu membingungkan: bilah
     solar melompat dari merah ke hijau tanpa pemain mengisi apa pun, karena
     baris 2550 diam-diam menaruh 55 galon di tangki. Sekarang ia punya
     gambar — truk tangki datang, mengisi, lalu pergi — dan barisnya ditahan
     sampai truk itu benar-benar berhenti di samping kita. */
  function habisBbm(T1) {
    const sisa = T1 + WF; WF = 0; SP = 0;
    let T = Math.abs(55 - SP); if (T > 12) T = 12.5;
    const jauh = (4.5 - 0.2 * T) * sisa;
    MF += jauh;
    tulis('After ' + jauh.toFixed(0) + ' more miles, you ran out of fuel  (DUMMY !!)', 'bahaya');

    const tertahan = [];
    const tahan = (t, k) => antrean ? tertahan.push({ teks: t, kelas: k }) : tulis(t, k);
    prop('bbm', null, { tertahan: tertahan });

    tahan('     It cost $200 to get a barrel of diesel delivered.');
    WF = 55;
    const t1 = Math.floor(RND() * 5); HR += t1; XC += 200; HL += t1;
    tahan('          You also wasted ' + t1 + ' hours by your carelessness.');
    if (CT === 1) {
      CX += Math.floor(RND() * 3);
      tahan('     Sitting with the reefer off is damaging the oranges.', 'awas');
    }
  }

  /* Baris 1700-2020 */
  let lewatiStop = false;
  function tawariTruckStop() {
    fase = 'stop';
    tanya('Truck stop ahead. Do you want to stop?', [
      tombol('Ya', truckStop, 'btn--primary btn--sm'),
      /* Baris 1720: menolak berarti terus jalan -- dan truk yang parkir di
         sana akan lewat begitu saja di jam berikutnya. */
      tombol('Tidak, jalan terus', () => { NSTOP = 1; HL += 1; lewatiStop = true; tanyaKecepatan(); })
    ]);
  }

  function truckStop() {
    HR += 1; NSTOP = 0;
    gambarSemua();
    /* Melambat sampai berhenti; kendaraan yang sedang menyalip tetap berjalan
       dengan kecepatannya sendiri dan keluar layar wajar. */
    scene.parkir();
    const harga = 85 + Math.floor(35 * RND());          // baris 1740
    fase = 'isi';
    const inp = angka('gal', Math.min(200 - Math.floor(WF), 120), 0, 400, 5);
    tanya('Diesel fuel costs $' + (harga / 100).toFixed(2) + ' per gallon. How many gallons?', [
      inp, tombol('Isi', () => {
        const g = Number(inp.value);
        if (g > 0) { XC += harga * g / 100; WF += g; tulis('Pay $' + (harga * g / 100).toFixed(2)); }
        if (WF > 201) { tulis('Your tank only holds 200 gallons — ' + Math.floor(WF - 200) + ' gallons spilled !!', 'awas'); WF = 200; }
        bbmTampil = Math.floor(WF);   // sesudah mengisi, angkanya pasti — Anda baru melihatnya
        tulis('So far, you have spent $' + XC.toFixed(2));
        tanyaTidur();
      }, 'btn--primary btn--sm'),
      tombol('Lewati', tanyaTidur)
    ]);
    const n = document.createElement('p');
    n.className = 't-catatan';
    n.innerHTML = 'Harga solar diundi $0,85–$1,19 tiap berhenti (baris 1740). ' +
      'Tangki 200 galon, dan kelebihannya <b>tumpah</b> — tetap dibayar.';
    panel.append(n);
    /* Baris 1800-1850: tawaran beli ban hanya muncul kalau serep sudah habis,
       dan menjawab "Y" menjalankan baris 1850 -- STOP. Program berhenti. */
    if (TS === 0) {
      const w = document.createElement('p');
      w.className = 't-catatan t-bahaya';
      w.innerHTML = 'Di sini aslinya menawarkan beli ban (baris 1830) — dan ' +
        'menjawab <b>Y</b> menjatuhkan program ke baris 1850: <code>STOP</code>. ' +
        'Kodenya tidak pernah ditulis. Port ini menghilangkan tawaran itu.';
      panel.append(w);
    }
  }

  function tanyaTidur() {
    fase = 'tidur';
    const inp = angka('jam', 6, 1, 12, 1);
    tanya('Do you want to get some sleep?', [
      inp, tombol('Tidur', () => tidur(Number(inp.value)), 'btn--primary btn--sm'),
      tombol('Tidak', () => { gambarSemua(); tanyaKecepatan(); })
    ]);
    const n = document.createElement('p');
    n.className = 't-catatan';
    /* Baris 1950-1990, dan urutannya yang menentukan: JAM maju sebanyak T
       PENUH, lalu baris 1970 memangkas T, lalu 1980/1990 memakai T yang SUDAH
       dipangkas. Jadi tidur siang lima jam menghabiskan lima jam dan hanya
       dibukukan tiga -- dan tiga tidak lebih besar dari tiga, jadi jam
       terjaganya cuma dibagi dua, bukan disetel ulang. */
    n.innerHTML = 'Tidur <b>lebih dari 3 jam</b> menyetel ulang jam terjaga ke ' +
      'nol; kurang dari itu cuma <b>membaginya dua</b> (baris 1990). Tapi tidur ' +
      'pada <b>pukul 6 pagi–7 malam</b> lebih dulu dipangkas jadi ' +
      '<code>INT(T/2+0,6)</code> karena berisik (baris 1970) — dan yang dipakai ' +
      'baris 1990 adalah angka yang sudah dipangkas itu. Akibatnya <b>di siang ' +
      'hari Anda butuh 7 jam</b> untuk mendapat penyetelan ulang, di malam hari ' +
      'cukup 4. Jamnya tetap maju sebanyak yang Anda minta.';
    panel.append(n);
  }

  function tidur(T) {
    if (T < 1) { gambarSemua(); return tanyaKecepatan(); }
    const DH = HR - 24 * Math.floor(HR / 24);           // baris 1950
    HR += T;
    if (CT === 1) { WF -= 7 * T; if (WF < 0) { WF = 0; habisBbm(0); } }
    if (DH > 21 || DH < 12) {
      T = Math.floor(T / 2 + 0.6);
      tulis('Thanks to the daytime noise, you got only ' + T + ' hours real sleep.', 'awas');
    }
    HS += T;
    if (T > 3) HL = 0; else HL = HL / 2;                // baris 1990
    audio.play('mbn50n0n50n0n50n0n50n0n50');            // baris 2000
    tulis('Time to hit the road again.', 'baik');
    lewatiStop = false;                                 // sudah berhenti, tak perlu dilewati
    scene.berangkatLagi();
    if (CT === 1) tulis('You now have ' + Math.floor(WF) + ' gallons of fuel.');
    gambarSemua();
    tanyaKecepatan();
  }

  /* Baris 4000-4170 */
  function celaka() {
    hidup = false; fase = 'selesai';
    scene.berhenti();
    let sebab;
    if (CD === 100 || (CD === 25 && SP < 65)) sebab = 'You fell asleep at the wheel.';
    else if (CR === 50) sebab = 'You drove off the road into a snow filled ditch.';
    else if (CR === 10) sebab = 'You rear-ended a pick-up with no tail lights.';
    else if (SP > 65) sebab = '        Speed kills !';
    else if (CR > 2) sebab = 'You hit a slick spot and skidded off the road.';
    else sebab = 'A drunk driver rammed your rig.  Tough luck !';
    tulis('C R A S H !!', 'bahaya');
    tulis(sebab, 'bahaya');
    tulis('You lose your truck & profits.', 'bahaya');
    tanya('Do you want to start over?', [
      tombol('Perjalanan baru', () => { XP = 0; NT = 0; mulaiPerjalanan(); }, 'btn--primary btn--sm')
    ]);
    gambarSemua();
  }

  function bangkrut() {
    hidup = false; fase = 'selesai';
    tulis('Your rig has been repossessed.', 'bahaya');
    tanya('', [tombol('Perjalanan baru', () => { XP = 0; mulaiPerjalanan(); }, 'btn--primary btn--sm')]);
  }

  /* Baris 5000-5490 */
  function sampai() {
    hidup = false; fase = 'selesai';
    scene.berhenti();
    gambarSemua();
    tulis('W E L C O M E   T O   N E W   Y O R K', 'judul');

    /* Baris 5110 memakai HR-INT(HR/24), yang BUKAN jam-dalam-hari. Rumus itu
       hanya kebetulan benar selama 24 jam pertama — dan perjalanan tersingkat
       pun 33 jam, jadi gudangnya tidak pernah benar-benar tutup. */
    const T5110 = HR - Math.floor(HR / 24);
    if (!(T5110 < 10 || T5110 > 21)) {
      tulis('The warehouse is closed for the night. Come back tomorrow.', 'awas');
      HR += 24 - T5110;
    }
    const hari = Math.floor(HR / 24), sisaJam = HR - 24 * hari;
    tulis('You completed the trip in ' + hari + ' days' + (sisaJam > 1 ? ' & ' + sisaJam + ' hours.' : '.'));
    tulis('     Trip expenses totaled $' + XC.toFixed(2));
    const T1 = 85 * hari + 85;
    tulis('     Truck payment, insurance and taxes cost $' + T1);
    XC += T1;

    let XT = 0, catatanAkhir = [];
    if (CT === 1) {
      const susut = (hari - 4) * Math.floor(RND() * 3);
      if (susut > 0) CX += susut;
      if (CX > 6) {
        tulis('Your oranges have spoiled. Haul them to the dump!', 'bahaya');
        XT = -50;
      } else {
        XT = 0.06500001 * WL;
        tulis('Collect six-and-a-half cents per pound for good oranges: $' + XT.toFixed(2));
        if (CX >= 1) {
          tulis('     Part of the load is damaged. Subtract ' + (5 * CX) + '%.', 'awas');
          XT = XT - XT * CX / 20;
          tulis('     Net payment is $' + XT.toFixed(2));
        }
      }
    } else if (CT === 2) {
      XT = 0.05 * WL;
      tulis('Collect five cents a pound for freight: $' + XT.toFixed(2));
      if (HR >= 95) {
        /* Baris 5340 mengumumkan denda 10% lalu LANGSUNG ke 5400 tanpa
           mengurangi apa pun. Dipertahankan; dilaporkan. */
        tulis('     You\'re late!!  Subtract ten percent penalty.', 'awas');
        catatanAkhir.push('Denda 10% itu diumumkan tapi TIDAK PERNAH dipotong — ' +
          'baris 5340 langsung meloncat ke 5400. Menu di baris 1050 menjanjikan ' +
          '"penalty for late delivery"; dendanya tidak ada.');
      }
      catatanAkhir.push('Batas yang diuji baris 5330 adalah HR<95, yaitu Jumat pukul 7 pagi — ' +
        'padahal baris 1070 menjanjikan Kamis pukul 4 sore (HR=80). Kelonggaran 15 jam.');
    } else {
      XT = 0.0475 * WL; CX = 0;
      tulis('Postmaster pays 4.75 cents per pound on delivery: $' + XT.toFixed(2));
    }

    XT = XT - XC; XP += XT;
    if (XT >= 0) {
      tulis('Your net profit this trip was $' + XT.toFixed(2), 'baik');
      if (XT > 100) tulis('     G O O D   W O R K  !!', 'baik');
    } else {
      tulis('Bad trip. . . You lost $' + Math.abs(XT).toFixed(2), 'bahaya');
      if (XP < 0) tulis('     You are bankrupt !!!', 'bahaya');
    }
    if (XN > 1) tulis('     Your average profit has been $' + (XP / XN).toFixed(2));
    if (XT < 200 || XP / XN < 250) tulis('     You\'d make more money washing dishes !', 'awas');
    catatanAkhir.forEach(s => tulis(s, 'catatan'));

    const rekor = store.get('rekor');
    if (rekor === null || XT > rekor) { store.set('rekor', XT); }
    audio.play('O3L4CCL2FL4CFL2AL4CFACFACFL2AL4FAO4L2CO3AFCL4CCL1F');
    tanya('Do you want to make another trip?', [
      tombol('Perjalanan baru', mulaiPerjalanan, 'btn--primary btn--sm')
    ]);
    perbaruiHud();
  }

  /* ======================================================================
     Bagian 9 — pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'Trucker', source: 'TRUCKER.BAS · Hughes Glantzberg · 1982'
  }));

  /* Guncangan layar dipicu oleh BENTURANNYA, bukan oleh akhir perhitungan:
     adegan mengirim `sc-tabrak` pada bingkai truk menghantam pohon. */
  q('svg').addEventListener('sc-tabrak', () => {
    const c = q('crt');
    c.classList.remove('t-crt--celaka'); void c.offsetWidth;
    c.classList.add('t-crt--celaka');
    if (q('bunyi').checked) for (let i = 80; i >= 1; i -= 5) audio.sound(60 + i * 6, 0.6);
  });

  q('mulai').addEventListener('click', mulaiPerjalanan);
  q('benih').addEventListener('change', (e) => {
    benih = parseInt(e.currentTarget.value, 10) || 0;
    perbaruiHud();
  });
  (function lajuAnimasi() {
    const sel = q('laju');
    const simpan = store.get('laju');
    if (simpan && DURASI[simpan] !== undefined) { laju = simpan; sel.value = simpan; }
    sel.addEventListener('change', (e) => {
      laju = e.currentTarget.value; store.set('laju', laju);
    });
  })();

  /* --- angka yang dihitung halaman ini dari datanya sendiri ---------------- */
  (function isiBukti() {
    let n = 0, tol = 0, nol = 0;
    const jenis = {};
    D.RUTE.forEach(r => r.titik.forEach(t => {
      n++;
      const k = Math.floor(t.z);
      jenis[k] = (jenis[k] || 0) + 1;
      if (k === 2) tol += Math.round(100 * (t.z - k));
      if (t.z === 0) nol++;
    }));
    q('b-titik').textContent = n;
    q('b-tol').textContent = '$' + tol;
    q('b-nol').textContent = nol;
    q('b-jenis').textContent = Object.keys(jenis).sort()
      .map(k => (D.KEJADIAN[k] || '—') + ' ' + jenis[k]).join(' · ');
    /* Puncak kurva irit: cari SP dengan mpg tertinggi. */
    let best = 0, bestV = 0;
    for (let v = 20; v <= 100; v++) {
      let T = Math.abs(55 - v); if (T > 12) T = 12.5;
      const m = 4.5 - 0.2 * T;
      if (m > best) { best = m; bestV = v; }
    }
    q('b-irit').textContent = bestV + ' MPH (' + best.toFixed(1).replace('.', ',') + ' mpg)';
    q('b-jarak').textContent = Math.round(200 * best).toLocaleString('id-ID');
    /* Berat kotor pada muatan "batas resmi" 40.000 dengan tangki penuh. */
    q('b-kotor').textContent = (19000 + 40000 + 7 * 190).toLocaleString('id-ID');
  })();

  perbaruiHud();
  bangunAdegan();
  tanya('', [tombol('Mulai di Los Angeles', mulaiPerjalanan, 'btn--primary btn--sm')]);
})();
