/* ===========================================================================
   dominoes.js — port dari DOMINOES.BAS (Friendlyware, 1982).

   387 baris, 77 GOTO, 65 GOSUB, dan NOL KOMENTAR. Contoh paling murni di
   koleksi ini tentang apa yang terjadi pada program besar yang ditulis tanpa
   satu pun penjelasan: seluruh giliran permainan muat dalam lima baris —

       50 PL1=1:GOSUB 2680:GOSUB 570:GOSUB 140:GOSUB 260
       60 IF INVD THEN GOSUB 2050:GOTO 50 ELSE NOPLAY=0
       70 GOSUB 1240:GOSUB 1550:YSCR=YSCR+HOLDY:PL1=0:IF PLNO=0 THEN 3590

   — dan tak satu pun dari sebelas nomor itu memberi tahu apa yang dikerjakan.
   Strukturnya benar; yang hilang cuma namanya.

   Permainannya ALL FIVES (Muggins), bukan domino biasa. Tiga hal yang
   menentukan, dan ketiganya ada di kodenya:

   ------------------------------------------------------------------------
   1. MEJANYA HANYA LIMA DOMINO

   TBL$(0..3) adalah keempat lengan, TBL$(4) pusatnya. Satu domino per lengan,
   dan tiap kali Anda bermain di sebuah lengan, isinya DIGANTI:

       340 IF OS THEN TBL$(DD)=ZLP+ZRP

   Jadi program ini tidak pernah menyimpan rangkaian dominonya. Ia hanya perlu
   ujung yang terbuka — untuk memeriksa aturan dan menghitung skor — dan
   sisanya dibiarkan tinggal di layar, lalu dilupakan.

   Rangkaian domino yang panjang itu ada di kepala pemain, bukan di memori.

   ------------------------------------------------------------------------
   2. LENGAN SAMPING HANYA TERBUKA KALAU DOMINO PERTAMA ADALAH DOBEL

       380 IF ZL=ZR THEN 440      ' pusat dobel -> keempat lengan boleh
       390 IF DD=0 THEN IF ZL=ZLP THEN ...
       410 IF DD=2 THEN IF ZR=ZLP THEN ...
       430 GOTO 320               ' selain itu: tidak sah

   Kalau domino pembuka bukan dobel, lengan 1 dan 3 tidak pernah bisa dipakai
   dan permainannya jadi garis lurus berujung dua. Itulah aturan "spinner"
   domino sungguhan, disandikan dalam empat baris.

   ------------------------------------------------------------------------
   3. SKOR = JUMLAH UJUNG TERBUKA, KALAU HABIS DIBAGI LIMA

       1720 IF PTOT/5=PTOT\5 THEN 1730 ELSE RETURN
       1730 HOLDY=PTOT:RETURN

   Dan dobel di ujung lengan dihitung KEDUA belahannya (baris 1610), karena
   dobel dipasang melintang sehingga dua sisinya sama-sama menghadap keluar.

   Rutin 1580-1710 diport baris demi baris di `hitungSkor()` di bawah,
   termasuk kasus-kasus pusatnya, karena menyederhanakannya berarti menebak.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  const TARGET = { A: 100, B: 250, C: 500 };      // baris 3490-3510

  const db = store('dominoes');
  let tangan, mesin, kandang, meja, pusat;
  let skorAnda, skorMesin, target, fase, dipilih, pesan;

  /* `rantai` TIDAK ADA di aslinya, dan itu justru intinya.

     Program 1982 hanya menyimpan ujung terbuka tiap lengan (`meja`), lalu
     melupakan sisanya — rangkaian dominonya tinggal di layar dan tidak pernah
     dibaca lagi (lihat panel "Mejanya hanya lima domino"). Untuk ATURANNYA itu
     cukup: tidak ada satu aturan pun yang menanyakan apa yang ada di tengah
     rangkaian.

     Tapi untuk PEMAINNYA tidak cukup. Papan yang cuma menampilkan lima batu
     terpisah tidak terbaca sebagai permainan domino, dan pemain kehilangan
     satu-satunya hal yang membuat meja domino masuk akal: melihat rantainya
     tumbuh. Jadi rantainya disimpan di sini — HANYA untuk digambar.

     Pembagian tugasnya dijaga dengan sengaja: `meja` yang dipakai aturan,
     `rantai` yang dipakai gambar. Kalau keduanya pernah tidak sepakat, yang
     salah adalah gambarnya, bukan permainannya. */
  let rantai;

  /* Baris 2160-2200: keduapuluh delapan batu set ganda-enam, dibangun dengan
     dua pencacah — B naik sampai 6 lalu dikembalikan ke C, dan C naik satu.
     Hasilnya tiap pasangan (B,C) dengan B >= C, tepat sekali. */
  function semuaBatu() {
    const out = [];
    let b = -1, c = 0;
    for (let a = 1; a <= 28; a++) {
      b++;
      out.push({ a: b, b: c });
      if (b === 6) { b = c; c++; }
    }
    return out;
  }

  /* --------------------------------------------------------------------
     Pengocokan aslinya, baris 2210-2240 — DIPAKAI hanya oleh panel, bukan
     oleh permainannya:

         2220 B=FIX(RND*28)+1:C=FIX(RND*28)+1:IF B=C THEN 2220
         2230 SWAP BONE$(B),BONE$(C)

     Dua puluh delapan penukaran acak. Ini cara keempat mengocok di koleksi
     ini, dan yang PERTAMA yang benar-benar berat sebelah: penukaran acak
     berulang memang mendekati sebaran seragam, tapi hanya kalau jumlahnya
     jauh lebih besar daripada n log n. Dua puluh delapan penukaran untuk dua
     puluh delapan batu tidak cukup — sebagian batu tidak pernah tersentuh
     sama sekali.

     Peluang sebuah batu tidak pernah terpilih dalam 28 penukaran:
     (26/28)^28 ~ 13%. Jadi rata-rata sekitar 3,6 dari 28 batu tetap di
     tempat asalnya. */
  function kocok1982(r, n) {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(i);
    for (let i = 0; i < n; i++) {
      let b = r.int(n), c = r.int(n);
      while (b === c) c = r.int(n);              // baris 2220: IF B=C THEN ulangi
      [arr[b], arr[c]] = [arr[c], arr[b]];
    }
    return arr;
  }

  /* --------------------------------------------------------------------
     Membagi — baris 2270-2310. Berselang-seling, tujuh masing-masing,
     kandang mulai dari batu ke-15.
     -------------------------------------------------------------------- */
  function babakBaru() {
    const r = rng();
    const batu = r.shuffle(semuaBatu());
    tangan = []; mesin = [];
    for (let i = 0; i < 7; i++) {
      tangan.push(batu[i * 2]);                  // baris 2290: BONE$(A), A ganjil
      mesin.push(batu[i * 2 + 1]);               // baris 2300: BONE$(A+1)
    }
    kandang = batu.slice(14);                    // baris 2310: BNPTR=15
    meja = [null, null, null, null];             // TBL$(0..3)
    rantai = [[], [], [], []];                   // hanya untuk digambar
    pusat = null;                                // TBL$(4)
    dipilih = null; pesan = '';
    fase = 'anda';
    gambar();
    kata('Your play.');
  }

  /* --------------------------------------------------------------------
     Sah atau tidak — baris 280-460, diport apa adanya.

     Nilai balik: null kalau tidak sah, atau {luar, dalam} yaitu bentuk
     penyimpanan aslinya (ujung terbuka lebih dulu, ujung yang menempel
     sesudahnya) — persis TBL$(DD)=ZLP+ZRP di baris 340.
     -------------------------------------------------------------------- */
  function coba(dd, d) {
    if (!pusat) return { luar: d.a, dalam: d.b, kePusat: true };

    const lengan = meja[dd];
    if (lengan) {                                // baris 290-350
      if (lengan.luar === d.a) return { luar: d.b, dalam: d.a };   // IS
      if (lengan.luar === d.b) return { luar: d.a, dalam: d.b };   // OS
      return null;                                                 // baris 320
    }

    // Lengan kosong: dicocokkan ke pusat — baris 360-460.
    const zl = pusat.a, zr = pusat.b;
    if (zl === zr) {                             // baris 380: pusat dobel
      if (zl === d.a) return { luar: d.b, dalam: d.a };
      if (zl === d.b) return { luar: d.a, dalam: d.b };
      return null;
    }
    if (dd === 0) {                              // baris 390-400
      if (zl === d.a) return { luar: d.b, dalam: d.a };
      if (zl === d.b) return { luar: d.a, dalam: d.b };
    }
    if (dd === 2) {                              // baris 410-420
      if (zr === d.a) return { luar: d.b, dalam: d.a };
      if (zr === d.b) return { luar: d.a, dalam: d.b };
    }
    return null;                                 // baris 430
  }

  /* Baris 500-530 mengalihkan permainan dari lengan samping ke lengan utama
     kalau yang utama masih kosong. Penjaganya (baris 490) membandingkan
     `TBL$(A)` — dan `A` di titik itu adalah sisa pencacah FOR dari tempat
     lain, tidak disetel di jalur ini. Perilakunya jadi bergantung pada nilai
     yang kebetulan tertinggal.

     Port ini tidak meniru ketergantungan itu. Yang dicapai baris 500-530 —
     "isi kedua ujung dulu, baru sampingnya" — dicapai di sini dengan
     MENUTUP lengan samping selama lengan utamanya kosong. Hasil akhirnya
     sama, tanpa bergantung pada variabel yang tak tentu. */
  const lenganTerbuka = (dd) => {
    if (!pusat) return false;
    if (meja[dd]) return true;
    if (dd === 0 || dd === 2) return true;
    return pusat.a === pusat.b && meja[0] !== null && meja[2] !== null;
  };

  const adaLangkah = (h) =>
    !pusat || h.some(d => [0, 1, 2, 3].some(dd => lenganTerbuka(dd) && coba(dd, d)));

  /* --------------------------------------------------------------------
     Skor — baris 1550-1750, diport baris demi baris.
     -------------------------------------------------------------------- */
  /* Dipecah dua: `rincianUjung()` menghasilkan JUMLAH ujung terbuka beserta
     asal tiap sukunya, dan `hitungSkor()` mengubahnya jadi skor.

     Aslinya keduanya satu rutin (1550-1750) yang langsung mengembalikan
     HOLDY. Dipisah di sini karena jumlah ujung adalah satu-satunya angka yang
     menentukan skor di All Fives, dan aslinya tidak pernah menampilkannya —
     pemain 1982 harus menjumlahkannya sendiri di kepala tiap giliran. */
  function rincianUjung() {
    if (!pusat) return { bagian: [], total: 0 };
    const plm = pusat.a, prm = pusat.b;
    const bagian = [];

    // Baris 1740: lemparan pertama dinilai dari pusatnya sendiri.
    if (meja.every(x => x === null)) {
      bagian.push({ dari: 'pusat', n: plm }, { dari: 'pusat', n: prm });
      return { bagian, total: plm + prm };
    }

    let ptot = 0, flag1 = false;
    for (let a = 0; a <= 3; a++) {                       // baris 1580
      const L = meja[a];
      if (L) {                                           // baris 1600 (tidak kosong)
        ptot += L.luar;                                  // baris 1610
        bagian.push({ dari: 'lengan ' + a, n: L.luar });
        if (L.luar === L.dalam) {                        // dobel: dua sisi menghadap keluar
          ptot += L.dalam;
          bagian.push({ dari: 'lengan ' + a + ' (dobel)', n: L.dalam });
        }
        continue;
      }
      if (plm !== prm) {                                 // baris 1630 -> 1690
        if (a === 0) { ptot += plm; bagian.push({ dari: 'pusat', n: plm }); }
        else if (a === 2) { ptot += prm; bagian.push({ dari: 'pusat', n: prm }); }
        continue;
      }
      if (flag1) continue;                               // baris 1640
      if (a === 0 || a === 2) {                          // baris 1650
        ptot += prm + plm;
        bagian.push({ dari: 'pusat', n: plm }, { dari: 'pusat', n: prm });
      } else {                                           // baris 1660-1670
        if (meja[1] === null) { ptot += plm; bagian.push({ dari: 'pusat', n: plm }); }
        if (meja[3] === null) { ptot += plm; bagian.push({ dari: 'pusat', n: plm }); }
      }
      flag1 = true;                                      // baris 1680
    }
    return { bagian, total: ptot };
  }

  function hitungSkor() {
    const { total } = rincianUjung();
    return total % 5 === 0 ? total : 0;                  // baris 1720-1730
  }

  /* --------------------------------------------------------------------
     Giliran Anda
     -------------------------------------------------------------------- */
  function pilihBatu(i) {
    if (fase !== 'anda') return;
    dipilih = (dipilih === i) ? null : i;
    gambar();
    kata(dipilih === null ? 'Your play.' : 'Now pick a place on the table.');
  }

  async function taruh(dd) {
    if (fase !== 'anda' || dipilih === null) return;
    const d = tangan[dipilih];
    if (!pusat) {
      pusat = d;
      tangan.splice(dipilih, 1);
    } else {
      if (!lenganTerbuka(dd)) return kata('Fill both ends first.', 'bad');
      const h = coba(dd, d);
      if (!h) return kata('That domino does not fit there.', 'bad');
      meja[dd] = h;
      rantai[dd].push(h);
      tangan.splice(dipilih, 1);
    }
    dipilih = null;
    audio.sound(520, 0.05);

    const s = hitungSkor();
    skorAnda += s;
    gambar();
    kata(s ? 'You score ' + s + '.' : 'No score.');
    if (!tangan.length) return babakUsai('anda');
    await giliranMesin();
  }

  /** Baris 1880: mengambil dari kandang sampai dapat yang bisa dimainkan. */
  function ambil() {
    if (fase !== 'anda') return;
    if (adaLangkah(tangan)) return kata('You still have a play.', 'bad');
    if (!kandang.length) {
      kata('Boneyard empty — you pass.');
      return giliranMesin();
    }
    tangan.push(kandang.shift());
    audio.sound(300, 0.05);
    gambar();
    kata('You drew a domino.');
  }

  /* --------------------------------------------------------------------
     Giliran komputer — baris 750-1140.

     Aslinya menyapu lengan 3..0 dan tangannya 1..CONO, menilai tiap
     kemungkinan lewat GOSUB 1150, dan menyimpan yang terbaik. Itu pencarian
     rakus satu langkah: ambil skor terbesar yang tersedia sekarang.
     Bentuknya dipertahankan, termasuk arah sapuannya.
     -------------------------------------------------------------------- */
  async function giliranMesin() {
    fase = 'mesin';
    dipilih = null;
    gambar();
    kata('One moment please — I am thinking.');       // baris 80
    await new Promise(r => setTimeout(r, 480));

    for (;;) {
      let terbaik = null;
      for (let dd = 3; dd >= 0; dd--) {               // baris 760: FOR DD=3 TO 0 STEP-1
        if (pusat && !lenganTerbuka(dd)) continue;
        for (let i = 0; i < mesin.length; i++) {      // baris 770
          const h = coba(dd, mesin[i]);
          if (!h) continue;
          const simpanMeja = meja.slice(), simpanPusat = pusat;
          if (!pusat) pusat = mesin[i]; else meja[dd] = h;
          const s = hitungSkor();
          meja = simpanMeja; pusat = simpanPusat;
          if (!terbaik || s > terbaik.s) terbaik = { dd, i, h, s };
          if (!simpanPusat) break;                    // pembuka: satu tempat saja
        }
        if (!pusat) break;
      }

      if (terbaik) {
        const d = mesin[terbaik.i];
        if (!pusat) pusat = d;
        else { meja[terbaik.dd] = terbaik.h; rantai[terbaik.dd].push(terbaik.h); }
        mesin.splice(terbaik.i, 1);
        skorMesin += terbaik.s;
        audio.sound(440, 0.05);
        gambar();
        pesan = terbaik.s ? 'I score ' + terbaik.s + '.' : 'I play.';
        if (!mesin.length) return babakUsai('mesin');
        break;
      }

      /* Baris 90-100: kalau tidak ada langkah, ambil dari kandang dan ulangi;
         kalau kandang habis, lewat. */
      if (!kandang.length) { pesan = 'I pass.'; break; }
      mesin.push(kandang.shift());
      gambar();
      await new Promise(r => setTimeout(r, 260));
    }

    fase = 'anda';
    gambar();
    kata(pesan + (adaLangkah(tangan) ? ' Your play.' : ' You have no play — draw.'));
  }

  /* --------------------------------------------------------------------
     Babak usai — baris 3590-3670.

     Sisa batu lawan dijumlahkan, lalu DIBULATKAN ke kelipatan lima terdekat:

         3620 REMA=TOT MOD 5:TOT=TOT\5:TOT=TOT*5:IF REMA>2 THEN TOT=TOT+5

     Sisa 3 atau 4 dibulatkan ke atas, sisa 0..2 ke bawah. Itu pembulatan
     setengah-ke-atas yang benar, ditulis tanpa fungsi pembulatan apa pun.
     -------------------------------------------------------------------- */
  const bulatLima = (t) => {
    const rema = t % 5;
    let v = Math.floor(t / 5) * 5;
    if (rema > 2) v += 5;
    return v;
  };

  function babakUsai(siapa) {
    const sisaMesin = mesin.reduce((t, d) => t + d.a + d.b, 0);
    const sisaAnda = tangan.reduce((t, d) => t + d.a + d.b, 0);
    if (siapa === 'anda') skorAnda += bulatLima(sisaMesin);
    else skorMesin += bulatLima(sisaAnda);

    fase = 'usai';
    gambar();
    const menang = siapa === 'anda';
    kata(menang ? 'You go out — ' + bulatLima(sisaMesin) + ' from my hand.'
                : 'I go out — ' + bulatLima(sisaAnda) + ' from your hand.',
         menang ? null : 'bad');
    audio.play(menang ? 'MB T170 O2 L8 c e g O3 L4 c' : 'MB T140 O2 L8 g e L4 c',
               { fresh: true });

    if (skorAnda >= target || skorMesin >= target) return tamat();
    $('next').classList.remove('hidden');
  }

  function tamat() {
    fase = 'tamat';
    const menang = skorAnda > skorMesin;
    kata(menang ? 'Game to you, ' + skorAnda + ' — ' + skorMesin + '.'
                : 'Game to me, ' + skorMesin + ' — ' + skorAnda + '.',
         menang ? null : 'bad');
    if (menang) {
      const rek = db.get('best', 0);
      if (skorAnda > rek) { db.set('best', skorAnda); ui.toast('Rekor baru: ' + skorAnda); }
    }
    gambar();
    $('again').classList.remove('hidden');
  }

  /* --------------------------------------------------------------------
     Gambar
     -------------------------------------------------------------------- */
  /**
   * Satu batu. `p1` adalah belahan KIRI (kalau mendatar) atau ATAS (kalau
   * tegak); `p2` yang seberangnya. Pemanggilnya yang menentukan urutan, dan
   * itulah yang membuat ujung terbuka selalu menghadap keluar.
   */
  function batuEl(p1, p2, opts) {
    opts = opts || {};
    const e = ui.el(opts.tag || 'div', {
      class: 'd-bone' + (opts.tegak ? ' d-bone--tegak' : ''),
      title: p1 + '-' + p2
    });
    e.append(pipEl(p1), ui.el('span', { class: 'd-bar' }), pipEl(p2));
    return e;
  }

  /* Arah tiap lengan, dan apa artinya bagi gambar batunya.

     Versi pertama port ini menggambar tiap lengan dengan `luar` selalu di
     kiri/atas, apa pun arah lengannya — sehingga di lengan kanan dan bawah,
     angka yang harus dicocokkan pemain justru menghadap KE DALAM. Papan jadi
     terasa tidak masuk akal, dan itu keluhan pertama yang muncul.

     Tabel ini menyatakan arahnya sekali, dan gambar mengikutinya:

       lengan 0  ke atas    ujung terbuka di ATAS     batu tegak
       lengan 1  ke kanan   ujung terbuka di KANAN    batu mendatar
       lengan 2  ke bawah   ujung terbuka di BAWAH    batu tegak
       lengan 3  ke kiri    ujung terbuka di KIRI     batu mendatar

     Dobel selalu dipasang MELINTANG terhadap arah lengannya — itu sebabnya
     `tegak` dibalik untuk dobel. */
  const ARAH = {
    0: { tegakBiasa: true,  luarDulu: true  },   // ke atas: luar di atas
    1: { tegakBiasa: false, luarDulu: false },   // ke kanan: luar di kanan
    2: { tegakBiasa: true,  luarDulu: false },   // ke bawah: luar di bawah
    3: { tegakBiasa: false, luarDulu: true  }    // ke kiri: luar di kiri
  };

  function batuLengan(dd, L) {
    const a = ARAH[dd];
    const dobel = L.luar === L.dalam;
    const tegak = dobel ? !a.tegakBiasa : a.tegakBiasa;
    return a.luarDulu ? batuEl(L.luar, L.dalam, { tegak })
                      : batuEl(L.dalam, L.luar, { tegak });
  }

  /* Baris 2130: DATA "   "," . ",". .",".:."… — tiap mata digambar sebagai
     pola titik, bukan angka. Di sini polanya kisi 3x3 yang sama untuk ketujuh
     nilai, jadi tidak ada mata yang titiknya bergeser sendiri. */
  const POLA = {
    0: [], 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
  };
  function pipEl(n) {
    const e = ui.el('span', { class: 'd-half' });
    for (let i = 0; i < 9; i++) {
      e.append(ui.el('i', { class: POLA[n].includes(i) ? 'd-pip' : 'd-pip d-pip--off' }));
    }
    return e;
  }

  function gambar() {
    /* Pusat. Batu pertama terletak SEARAH sumbu utama (lengan 0 di atas,
       lengan 2 di bawah), jadi tegak — kecuali kalau ia dobel, yang selalu
       melintang. Mata `a` menghadap lengan 0 dan `b` menghadap lengan 2,
       persis pembagian di baris 390-420. */
    const p = $('pusat');
    p.textContent = '';
    p.className = 'd-pusat';
    if (pusat) {
      p.append(batuEl(pusat.a, pusat.b, { tegak: pusat.a !== pusat.b }));
    } else {
      /* Belum ada pusat: tempat batu PERTAMA ada di tengah, bukan di lengan.
         Ia diberi penanda sendiri karena tanpa itu tidak ada apa pun di layar
         yang memberi tahu ke mana batu pertama harus diklik — dan lengan mana
         pun tidak akan menyala, karena `lenganTerbuka` selalu false selama
         pusatnya kosong. */
      if (fase === 'anda' && dipilih !== null) p.classList.add('d-pusat--bisa');
      p.append(ui.el('span', { class: 'd-kosong',
        text: dipilih === null ? 'first domino' : 'taruh di sini' }));
      p.onclick = () => taruh(0);
    }

    [0, 1, 2, 3].forEach(dd => {
      const slot = $('l' + dd);
      slot.textContent = '';
      slot.className = 'd-arm d-arm--' + dd;

      rantai[dd].forEach(L => slot.append(batuLengan(dd, L)));

      const L = meja[dd];
      const bisa = fase === 'anda' && dipilih !== null
                   && lenganTerbuka(dd) && coba(dd, tangan[dipilih]);

      /* Kotak ujung: tempat batu berikutnya akan mendarat. Ia juga yang
         memikul angka ujung terbuka, karena itulah satu-satunya angka yang
         perlu dicocokkan pemain. */
      const ujung = ui.el('span', { class: 'd-ujung' });
      if (pusat && !lenganTerbuka(dd)) {
        ujung.classList.add('d-ujung--tutup');
        ujung.title = 'tertutup — pusatnya bukan dobel';
      } else if (bisa) {
        ujung.classList.add('d-ujung--bisa');
        ujung.textContent = '+';
      } else if (L) {
        ujung.classList.add('d-ujung--angka');
        ujung.textContent = String(L.luar);
        ujung.title = 'ujung terbuka: ' + L.luar;
      }
      slot.append(ujung);
      slot.onclick = () => taruh(dd);
    });

    // Jumlah ujung terbuka — angka yang menentukan skor, dan yang aslinya
    // tidak pernah tampilkan.
    const r = rincianUjung();
    const box = $('ends');
    if (!pusat) { box.textContent = ''; }
    else {
      const sisa = (5 - (r.total % 5)) % 5;
      box.textContent = '';
      box.append(ui.el('span', { class: 'd-ends__l', text: 'ujung terbuka' }));
      r.bagian.forEach((b, i) => {
        if (i) box.append(ui.el('span', { class: 'd-ends__op', text: '+' }));
        box.append(ui.el('b', { text: String(b.n), title: b.dari }));
      });
      box.append(ui.el('span', { class: 'd-ends__op', text: '=' }));
      box.append(ui.el('b', { class: 'd-ends__tot', text: String(r.total) }));
      box.append(ui.el('span', {
        class: 'd-ends__v' + (sisa ? '' : ' d-ends__v--ok'),
        text: sisa ? '(butuh ' + sisa + ' lagi)' : '✓ habis dibagi 5'
      }));
    }

    // tangan
    const h = $('hand');
    h.textContent = '';
    tangan.forEach((d, i) => {
      const b = batuEl(d.a, d.b, { tag: 'button' });
      b.type = 'button';
      b.classList.add('d-pick');
      if (i === dipilih) b.classList.add('d-pick--sel');
      b.addEventListener('click', () => pilihBatu(i));
      h.append(b);
    });

    $('cpuN').textContent = mesin.length;
    const cpu = $('cpu');
    cpu.textContent = '';
    mesin.forEach(() => cpu.append(ui.el('i', { class: 'd-back' })));

    $('sYou').textContent = skorAnda;
    $('sCpu').textContent = skorMesin;
    $('sYard').textContent = kandang.length;
    $('sTarget').textContent = target;
    $('sBest').textContent = db.get('best', 0);
    $('draw').disabled = fase !== 'anda';
  }

  function kata(t, jenis) {
    $('say').textContent = t;
    $('say').className = 'd-say' + (jenis ? ' d-say--' + jenis : '');
  }

  /* Panel: seberapa berat sebelah pengocokan 1982. */
  function ujiKocok() {
    const r = rng();
    const N = 20000, n = 28;
    let takTersentuh = 0;
    for (let t = 0; t < N; t++) {
      const arr = kocok1982(r, n);
      for (let i = 0; i < n; i++) if (arr[i] === i) takTersentuh++;
    }
    const rata = takTersentuh / N;
    const teori = n * Math.pow((n - 2) / n, n);
    $('shufOut').innerHTML =
      'Rata-rata <b>' + rata.toFixed(2) + '</b> dari 28 batu berakhir di ' +
      'tempat asalnya, atas ' + N.toLocaleString('id-ID') + ' pengocokan.<br>' +
      'Batas bawahnya 28&nbsp;&times;&nbsp;(26/28)<sup>28</sup> = <b>' +
      teori.toFixed(2) + '</b> &mdash; yaitu batu yang <em>tidak pernah ' +
      'tersentuh sama sekali</em>. Yang terukur lebih besar karena sebagian ' +
      'batu tersentuh lalu kembali ke tempatnya.<br>' +
      'Pembandingnya: pengocokan yang benar meninggalkan <b>1,00</b> batu di ' +
      'tempatnya, secara harapan &mdash; dan angka satu itu berlaku untuk ' +
      'n berapa pun. Cara 1982 meninggalkan <b>' + (rata).toFixed(1) +
      '&times;</b> lebih banyak.';
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Dominoes (All Fives)',
    source: 'DOMINOES.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  Object.keys(TARGET).forEach(k => {
    const b = ui.el('button', { class: 'btn btn--ghost', type: 'button',
                                text: k + ' — ' + TARGET[k] + ' points' });
    b.addEventListener('click', () => {
      target = TARGET[k];
      $('setup').classList.add('hidden');
      $('play').classList.remove('hidden');
      skorAnda = 0; skorMesin = 0;
      babakBaru();
    });
    $('targets').append(b);
  });

  $('draw').addEventListener('click', ambil);
  $('next').addEventListener('click', () => {
    $('next').classList.add('hidden'); babakBaru();
  });
  $('again').addEventListener('click', () => {
    $('again').classList.add('hidden');
    $('play').classList.add('hidden');
    $('setup').classList.remove('hidden');
  });
  $('shufRun').addEventListener('click', ujiKocok);
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Skor tertinggi dihapus.')) return;
    db.set('best', 0); if (tangan) gambar();
  });

  $('sBest').textContent = db.get('best', 0);
})();
