/* ===========================================================================
   match.js — port dari MATCH.BAS (Friendlyware, 1982).

   Permainan mencocokkan hadiah bergaya acara kuis televisi: empat puluh kotak,
   dua puluh hadiah yang masing-masing muncul dua kali, dan daftar hadiah yang
   kini jadi potret 1982 yang jauh lebih tajam daripada yang dimaksudkan
   penulisnya.

   ------------------------------------------------------------------------
   PEMAIN SEBAGAI INDEKS, BUKAN SEBAGAI VARIABEL BERNOMOR

       130 DIM A(20),B(40),PV(40),PZ(81),VL(81),TBL(1,50),
           PL(1),T(1),MATCH(1),KEEP(1,21)

   `DIM` terpanjang di koleksi — sepuluh larik dalam satu baris. Yang penting
   pola `(1)` yang muncul empat kali: PL(1), T(1), MATCH(1), KEEP(1,21).
   Larik berukuran dua adalah cara program ini menyimpan data PER PEMAIN.

   Jadi PL(0) dan PL(1) nama kedua pemain, MATCH(0)/MATCH(1) skornya. Pemain
   menjadi INDEKS, bukan sekumpulan variabel bernomor — dan akibatnya seluruh
   logika giliran cukup ditulis SEKALI, dengan `T` sebagai penunjuk pemain
   aktif.

   Itu pola yang benar, dan port ini memakainya juga (`pemain[0]`,
   `pemain[1]`) karena alasannya masih berlaku persis.

   Yang tidak ditiru: baris 1490 menulis `Q(T(T))` — larik `T` diindeks oleh
   variabel skalar `T`. Sah di BASIC karena nama larik dan nama skalar hidup
   di ruang nama berbeda, tapi hampir mustahil dibaca benar sekali lihat.

   ------------------------------------------------------------------------
   RANDOMIZE DI DALAM PERULANGAN, UNTUK KETIGA KALINYA

       210 FOR A=1 TO 20
       220  RANDOMIZE(VAL(RIGHT$(TIME$,2)))   ' di DALAM perulangan
       230  A(A)=(RND*80):IF A(A)=0 THEN 230

   Penyakit yang sama dengan CRAPS: menyemai ulang dari detik, di dalam
   perulangan yang sedang membangkitkan angka. Selama satu detik berjalan,
   `RND` dikembalikan ke keadaan yang sama tiap putaran — jadi dua puluh
   hadiah yang "dipilih acak" itu jauh lebih sedikit ragamnya daripada
   kelihatannya. Baris 250 menolak duplikat, dan itulah yang menyelamatkan
   papannya dari berisi dua puluh hadiah yang sama.

   Muncul lagi di baris 320, di dalam perulangan penempatan.

   ------------------------------------------------------------------------
   ANGKA RAHASIA YANG TIDAK COCOK DENGAN PETUNJUKNYA

       270 SC=FIX(RND*89)+10                       ' 10 sampai 98
       3320 PRINT "... Guess My Secret Number <11 to 99>"

   Rentang yang diminta layar: 11-99. Rentang yang benar-benar dibangkitkan:
   10-98. Meleset satu di KEDUA ujungnya. Pemain yang percaya pada petunjuknya
   tidak akan pernah menebak 10, dan akan membuang tebakan pada 99.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Delapan puluh entri DATA baris 2520-3310, apa adanya. Nilai negatif
     adalah kartu khusus: -1 TAKE ONE, -2 LOSE ONE, -3 WILD CARD. */
  const HADIAH = [
    { n: 'COLOR TV', v: 650 }, { n: 'WINNABAGO', v: 13540 },
    { n: 'SWISS WATCH', v: 250 }, { n: '$5000 CASH', v: 5000 },
    { n: '$1 CASH', v: 1 }, { n: 'IBM P.C.', v: 2300 },
    { n: 'FRIENDLYWARE', v: 49.95 }, { n: 'TRIP TO MEXICO', v: 3000 },
    { n: 'TRIP TO JAPAN', v: 6000 }, { n: 'MINK COAT', v: 2300 },
    { n: '10 SPEED BIKE', v: 135 }, { n: 'BOX OF BANANAS', v: 5 },
    { n: 'SPEED BOAT', v: 14000 }, { n: 'NEW TIRES', v: 150 },
    { n: 'DISNEY TRIP', v: 3000 }, { n: 'SNOWMOBILE', v: 3200 },
    { n: 'MINOLTA CAMERA', v: 550 }, { n: 'BETAMAX', v: 1150 },
    { n: 'SEWING MACHINE', v: 250 }, { n: 'BRASS BED', v: 800 },
    { n: 'JACUZZI SPA', v: 4300 }, { n: 'DISHWASHER', v: 320 },
    { n: 'WASHER', v: 340 }, { n: 'DRYER', v: 320 },
    { n: 'TAKE ONE', v: -1 }, { n: 'LOSE ONE', v: -2 },
    { n: 'WILD CARD', v: -3 }, { n: 'B&W T-V', v: 95 },
    { n: 'VOLKSWAGEN', v: 5500 }, { n: 'APPLE CIDER', v: 3.98 },
    { n: 'JUG OF MILK', v: 2.05 }, { n: 'LAWN MOWER', v: 230 },
    { n: '$500 CASH', v: 500 }, { n: 'DISK DRIVE', v: 350 },
    { n: 'ENCYCLOPEDIAS', v: 650 }, { n: 'USED CAR', v: 20 },
    { n: 'TOUPEE', v: 29 }, { n: 'BLOND WIG', v: 50 },
    { n: 'CASSETTE TAPE', v: 65 }, { n: 'STEREO', v: 1000 },
    { n: 'TURKEY FARM', v: 1200 }, { n: 'GOLD RING', v: 300 },
    { n: 'DIAMOND RING', v: 2300 }, { n: 'TIRED OVEN', v: 25 },
    { n: 'PATIO SET', v: 490 }, { n: 'BEDROOM SET', v: 900 },
    { n: 'SAIL BOAT', v: 6000 }, { n: 'BRICK HOME', v: 55000 },
    { n: 'MOBILE HOME', v: 21000 }, { n: 'SHRIMP DINNER', v: 25 },
    { n: 'SURF BOARD', v: 250 }, { n: 'GOLF CLUBS', v: 550 },
    { n: 'SWIMMING POOL', v: 10000 }, { n: 'BRIEF CASE', v: 65 },
    { n: 'NEW WARDROBE', v: 800 }, { n: 'SILK SHEETS', v: 125 },
    { n: 'WATER BED', v: 450 }, { n: 'WATER SKIS', v: 120 },
    { n: 'OUNCE OF GOLD', v: 500 }, { n: 'BAR OF SOAP', v: .25 },
    { n: 'PET SQURRIEL', v: 75 }, { n: 'OCEAN CRUISE', v: 5400 },
    { n: 'ROLEX CAMERA', v: 90 }, { n: 'SNORKEL & FINS', v: 65 },
    { n: 'LEATHER WALLET', v: 10 }, { n: 'MX-80 PRINTER', v: 550 },
    { n: 'BYTE MAGAZINE', v: 3 }, { n: 'MOTOR CYCLE', v: 3000 },
    { n: 'MINI BIKE', v: 150 }, { n: 'MOPED', v: 450 },
    { n: 'SILVER BOWL', v: 250 }, { n: 'TV DINNER', v: 1 },
    { n: 'FROZEN PIZZA', v: 2 }, { n: 'AM-FM RADIO', v: 25 },
    { n: 'CB-RADIO', v: 140 }, { n: 'TAMPA NUGGET', v: .75 },
    { n: 'BED LAMP', v: 15 }, { n: '6 PACK/COORS', v: 3.15 },
    { n: 'SWING SET', v: 230 }, { n: 'SKILL SAW', v: 55 },
  ];

  const KOL = ['A', 'B', 'C', 'D', 'E'];          // baris 2490: A1,B1,C1,D1,E1,A2,...
  const KOLOM = 5;                                // baris 640/650: 8 baris x 5 kolom

  const db = store('match');
  let papan, pemain, giliran, buka, fase, rahasia, tebakTerakhir;

  /* Mode gambar — polanya diambil dari 15PUZZLE, yang lebih dulu menyimpan
     gambarnya sebagai DATA di berkas terpisah dan menyalakannya lewat deret
     chip. Lihat prizepics.js untuk gambarnya sendiri dan alasan bentuknya.

     Temanya disimpan, jadi pilihan Anda bertahan antar-permainan. */
  const IKON = window.RETRO.PRIZE_ICONS || {};
  const KAT = window.RETRO.PRIZE_CAT || {};
  const TEMA = window.RETRO.PRIZE_THEMES || [{ id: '', nama: 'Teks' }];
  let tema = db.get('tema', '');

  /** Ikon sebuah hadiah, atau null di mode teks / kalau tidak terpetakan. */
  function ikonEl(namaHadiah) {
    if (!tema) return null;
    const d = IKON[KAT[namaHadiah]];
    if (!d) return null;
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', 'm-ikon');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = d;
    return s;
  }

  const uang = (v) => '$' + v.toLocaleString('en-US',
    { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const label = (i) => KOL[i % KOLOM] + (Math.floor(i / KOLOM) + 1);

  /* Baris 210-360: dua puluh hadiah berbeda dipilih dari delapan puluh, lalu
     masing-masing ditaruh DUA KALI di antara empat puluh kotak. */
  function papanBaru() {
    const r = rng();
    const pilih = r.shuffle(HADIAH.map((h, i) => i)).slice(0, 20);
    const isi = [];
    pilih.forEach(idx => { isi.push(idx, idx); });
    r.shuffle(isi);
    papan = isi.map(idx => ({ idx: idx, terbuka: false, hilang: false }));

    /* Baris 270: SC=FIX(RND*89)+10 — sepuluh sampai sembilan puluh delapan,
       meski layarnya meminta 11 sampai 99. Dipertahankan apa adanya. */
    rahasia = 10 + r.int(89);

    pemain = [
      { nama: 'PLAYER 1', hadiah: [] },
      { nama: 'PLAYER 2', hadiah: [] }
    ];
    giliran = 0; buka = []; fase = 'main'; tebakTerakhir = null;
    gambar();
    kata(pemain[0].nama + ' — pick a square.');
  }

  const nilai = (i) => HADIAH[papan[i].idx].v;
  const nama = (i) => HADIAH[papan[i].idx].n;
  const wild = (i) => nilai(i) === -3;

  /* --------------------------------------------------------------------
     Membuka kotak
     -------------------------------------------------------------------- */
  async function bukaKotak(i) {
    if (fase !== 'main' || buka.length >= 2) return;
    if (papan[i].hilang || papan[i].terbuka) return;
    papan[i].terbuka = true;
    buka.push(i);
    audio.sound(600, 0.05);
    gambar();
    if (buka.length === 1) {
      return kata(nama(i) + (nilai(i) > 0 ? ' — ' + uang(nilai(i)) : ''));
    }

    await new Promise(r => setTimeout(r, 700));
    const a = buka[0], b = buka[1];
    /* Baris 780-790: WILD CARD cocok dengan apa pun. */
    const cocok = papan[a].idx === papan[b].idx || wild(a) || wild(b);

    if (!cocok) {
      papan[a].terbuka = false; papan[b].terbuka = false;
      buka = [];
      audio.play('MB T200 O2 L8 e c', { fresh: true });
      giliran = 1 - giliran;
      gambar();
      return kata('No match. ' + pemain[giliran].nama + ' — pick a square.');
    }

    // Kartu khusus dibaca dari kartu yang BUKAN wild.
    const utama = wild(a) ? b : a;
    papan[a].hilang = true; papan[b].hilang = true;
    buka = [];
    audio.play('MB T170 O2 L8 c e g', { fresh: true });

    const v = nilai(utama);
    if (v === -1) return ambilSatu();          // baris 840 -> 1420
    if (v === -2) return lepasSatu();          // baris 830 -> 1540
    if (v === -3) { gambar(); return lanjut('Two wild cards — nothing won.'); }
    pemain[giliran].hadiah.push(papan[utama].idx);
    gambar();
    lanjut('Match! ' + nama(utama) + ' — ' + uang(v));
  }

  /* --------------------------------------------------------------------
     Masih adakah pasangan yang bisa dimainkan?

     INI YANG MEMBUAT PERMAINAN BISA SELESAI, dan port pertama melewatkannya
     sepenuhnya — ia hanya memeriksa apakah papan sudah kosong.

     Kenapa "papan kosong" tidak cukup: kartu WILD merusak parity papan. Tiap
     hadiah punya DUA salinan, jadi selama yang dicocokkan selalu sepasang
     yang sama, papan pasti bisa dihabiskan. Tapi wild boleh mencocokkan apa
     saja (baris 780-790) — dan begitu ia memakan satu salinan hadiah lain,
     pasangan hadiah itu jadi yatim:

         W1 + TAKE1   ->  sisa: W2, TAKE2, IBM1, IBM2
         W2 + IBM1    ->  sisa: TAKE2, IBM2   <- mustahil cocok, permainan buntu

     Aslinya memeriksanya di baris 1280-1340, dan mengakhiri babak papan saat
     tidak ada dua kotak berisi hadiah yang sama.

     SATU PERBEDAAN yang disengaja: pemeriksaan aslinya memakai kesamaan
     MURNI (`IF B(A)=B(B)`), sehingga ia tidak menganggap wild bisa
     dipasangkan. Akibatnya aslinya bisa mengakhiri babak papan padahal masih
     ada langkah sah — tersisa satu wild dan satu IBM PC, misalnya, yang
     menurut baris 780 boleh dimainkan. Aturan cocoknya dan aturan selesainya
     tidak sepakat soal wild.

     Di sini keduanya dibuat sepakat: sebuah pasangan dianggap ada kalau dua
     kotak berisi hadiah yang sama ATAU salah satunya wild. Itu superset dari
     syarat aslinya, jadi ia tetap pasti berhenti — dan ia tidak pernah
     menutup papan saat pemain masih punya langkah. */
  function adaPasangan() {
    const sisa = papan.map((k, i) => ({ k, i })).filter(x => !x.k.hilang);
    for (let a = 0; a < sisa.length; a++) {
      for (let b = a + 1; b < sisa.length; b++) {
        if (sisa[a].k.idx === sisa[b].k.idx) return true;
        if (wild(sisa[a].i) || wild(sisa[b].i)) return true;
      }
    }
    return false;
  }

  function lanjut(pesan) {
    if (!adaPasangan()) return mulaiTebak(pesan);
    gambar();
    kata(pesan + ' ' + pemain[giliran].nama + ' plays again.');
  }

  /* Baris 1420-1450: TAKE ONE — ambil satu hadiah lawan. */
  function ambilSatu() {
    const lawan = pemain[1 - giliran];
    if (!lawan.hadiah.length) {
      gambar();
      return lanjut('TAKE ONE — ' + lawan.nama + ' has no prizes to take.');
    }
    fase = 'ambil';
    gambar();
    kata('TAKE ONE — pick a prize from ' + lawan.nama + '.');
  }

  /* Baris 1540-1570: LOSE ONE — serahkan satu hadiah sendiri. */
  function lepasSatu() {
    if (!pemain[giliran].hadiah.length) {
      gambar();
      return lanjut('LOSE ONE — you have no prizes to lose.');
    }
    fase = 'lepas';
    gambar();
    kata('LOSE ONE — pick one of your own prizes to give up.');
  }

  function pilihHadiah(pihak, k) {
    if (fase === 'ambil' && pihak === 1 - giliran) {
      const idx = pemain[pihak].hadiah.splice(k, 1)[0];
      pemain[giliran].hadiah.push(idx);
      fase = 'main';
      return lanjut('Took ' + HADIAH[idx].n + '.');
    }
    if (fase === 'lepas' && pihak === giliran) {
      const idx = pemain[pihak].hadiah.splice(k, 1)[0];
      pemain[1 - giliran].hadiah.push(idx);
      fase = 'main';
      return lanjut('Gave up ' + HADIAH[idx].n + '.');
    }
  }

  /* --------------------------------------------------------------------
     Babak penutup — baris 3320-3360.

     Papan habis, lalu pemain menebak angka rahasia. Yang lebih dulu tepat
     MEMENANGKAN PERMAINAN — nilai hadiah tidak menentukan siapa yang menang,
     ia cuma menyatakan apa yang dibawa pulang. Dan gilirannya TIDAK berpindah
     saat tebakan meleset ("But Still Your Turn", baris 3350).
     -------------------------------------------------------------------- */
  function mulaiTebak(pesan) {
    /* Kotak yang tersisa dibuka. Aslinya langsung menghapus papannya
       (baris 1940: FOR A=1 TO 40:B(A)=0), jadi pemain tidak pernah tahu apa
       yang tertinggal — dan kalau babaknya berakhir karena yatim, ia juga
       tidak tahu KENAPA berakhir. Membukanya menjawab keduanya sekaligus. */
    const sisa = papan.filter(k => !k.hilang);
    sisa.forEach(k => { k.terbuka = true; k.yatim = true; });
    buka = [];
    fase = 'tebak';
    gambar();

    if (sisa.length) {
      /* Pemberitahuan yang TIDAK bisa terlewat.

         Versi sebelumnya hanya mengubah baris pesan — dan baris itu sudah
         memikul hasil pencocokan DAN ajakan menebak, jadi kabar terpenting
         ("papan berhenti lebih cepat, dan ini sebabnya") jadi kalimat tengah
         yang paling mudah dilewati. Pemain yang sedang bingung justru yang
         paling butuh membacanya.

         Sekarang tiga lapis, masing-masing bekerja sendiri: kartu yatimnya
         dibuka DAN ditandai, sebuah toast muncul, dan baris pesannya
         menyebutkannya. */
      ui.toast(sisa.length + ' kotak tersangkut — tidak ada pasangan lagi. '
               + 'Lanjut ke tebak angka.', 5200);
      audio.play('MB T140 O2 L8 g f e', { fresh: true });
    }

    const kenapa = sisa.length
      ? 'No pair left — ' + sisa.length + ' square' + (sisa.length > 1 ? 's' : '') +
        ' stranded by a wild card. '
      : 'Board clear. ';
    kata((pesan ? pesan + ' ' : '') + kenapa +
         pemain[giliran].nama + ' — guess my secret number.');
  }

  function tebak() {
    if (fase !== 'tebak') return;
    const g = Number($('guess').value);
    if (!Number.isInteger(g)) return;
    tebakTerakhir = g;
    if (g === rahasia) {                        // baris 3340
      fase = 'usai';
      audio.play('MB T160 O2 L8 c e g O3 c e g L2 c', { fresh: true });
      const total = pemain[giliran].hadiah.reduce((t, i) => t + HADIAH[i].v, 0);
      kata('Congradulations ' + pemain[giliran].nama + ' You WIN !!! — ' + uang(total));
      const rek = db.get('best', 0);
      if (total > rek) { db.set('best', total); ui.toast('Rekor baru: ' + uang(total)); }
      gambar();
      $('again').classList.remove('hidden');
      return;
    }
    audio.sound(g < rahasia ? 300 : 900, 0.12);
    kata(g < rahasia ? 'Sorry, too low. But still your turn.'
                     : 'Sorry, too high. But still your turn.', 'bad');
    gambar();
  }

  /* --------------------------------------------------------------------
     Gambar
     -------------------------------------------------------------------- */
  function gambar() {
    const g = $('grid');
    g.textContent = '';
    papan.forEach((k, i) => {
      const b = ui.el('button', { class: 'm-kotak', type: 'button' });
      if (k.hilang) {
        b.classList.add('m-kotak--hilang');
        b.disabled = true;
      } else if (k.terbuka) {
        b.classList.add('m-kotak--buka');
        if (nilai(i) < 0) b.classList.add('m-kotak--khusus');
        /* Kotak yang tersangkut ditandai berbeda dari kotak yang sekadar
           sedang terbuka — tanpa itu, papan akhir terlihat seperti dua kartu
           yang menunggu dibalik, bukan seperti dua kartu yang sudah mati. */
        if (k.yatim) b.classList.add('m-kotak--yatim');
        /* Ikon DI ATAS nama, tidak menggantikannya: dua hadiah berbeda bisa
           berbagi ikon, dan di permainan ingatan itu akan menyesatkan. */
        const ik = ikonEl(nama(i));
        if (ik) b.append(ik);
        b.append(ui.el('span', { class: 'm-nama', text: nama(i) }));
        if (nilai(i) > 0) {
          b.append(ui.el('span', { class: 'm-nilai', text: uang(nilai(i)) }));
        }
      } else {
        b.append(ui.el('span', { class: 'm-label', text: label(i) }));
        b.disabled = fase !== 'main' || buka.length >= 2;
      }
      b.addEventListener('click', () => bukaKotak(i));
      g.append(b);
    });

    [0, 1].forEach(p => {
      const box = $('p' + p);
      box.textContent = '';
      const total = pemain[p].hadiah.reduce((t, i) => t + HADIAH[i].v, 0);
      $('n' + p).textContent = pemain[p].nama;
      $('t' + p).textContent = uang(total);
      $('w' + p).classList.toggle('m-aktif', p === giliran && fase !== 'usai');
      pemain[p].hadiah.forEach((idx, k) => {
        const bisa = (fase === 'ambil' && p === 1 - giliran) ||
                     (fase === 'lepas' && p === giliran);
        const e = ui.el('button', {
          class: 'm-hadiah' + (bisa ? ' m-hadiah--bisa' : ''),
          type: 'button', text: HADIAH[idx].n, title: uang(HADIAH[idx].v)
        });
        e.disabled = !bisa;
        e.addEventListener('click', () => pilihHadiah(p, k));
        box.append(e);
      });
    });

    $('guessRow').classList.toggle('hidden', fase !== 'tebak');
    $('sLeft').textContent = papan.filter(k => !k.hilang).length;
    $('sBest').textContent = uang(db.get('best', 0));
    $('sGuess').textContent = tebakTerakhir === null ? '—' : String(tebakTerakhir);
  }

  function kata(t, jenis) {
    $('say').textContent = t;
    $('say').className = 'm-say' + (jenis ? ' m-say--' + jenis : '');
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Match (Prize Concentration)',
    source: 'MATCH.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  $('guessGo').addEventListener('click', tebak);
  $('guess').addEventListener('keydown', e => { if (e.key === 'Enter') tebak(); });
  $('again').addEventListener('click', () => {
    $('again').classList.add('hidden'); papanBaru();
  });
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Nilai hadiah tertinggi dihapus.')) return;
    db.set('best', 0); gambar();
  });

  // --- pemilih tema gambar, sepola dengan 15PUZZLE ---
  const barisTema = $('themes');
  function pasangTema(id) {
    tema = id;
    db.set('tema', id);
    $('grid').className = 'm-grid' + (id ? ' m-grid--' + id : '');
    barisTema.querySelectorAll('.chip').forEach(b => {
      b.setAttribute('aria-pressed', String((b.dataset.tema || '') === id));
    });
    if (papan) gambar();
  }
  TEMA.forEach(t => {
    const b = ui.el('button', { class: 'chip', type: 'button', text: t.nama,
                                title: t.hint || '', 'aria-pressed': 'false' });
    b.dataset.tema = t.id;
    b.addEventListener('click', () => pasangTema(t.id));
    barisTema.append(b);
  });

  papanBaru();
  pasangTema(tema);
})();
