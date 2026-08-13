/* ===========================================================================
   nasihat.js — mesin hitung penasihat blackjack.

   KENAPA DIHITUNG, BUKAN DISALIN DARI TABEL
   -----------------------------------------
   Tabel "basic strategy" yang beredar di mana-mana disusun untuk meja kasino
   biasa: blackjack dibayar 3:2, sering enam dek, sering bandar menambah di 17
   lunak. `21.BAS` bukan meja itu. Ia membayar blackjack **2:1** (baris 860 dan
   1770: `CSH=CSH+BT*300` lawan `BT*200` untuk menang biasa), bandar berhenti
   di 17 lunak (670: `IF CPHD>16`), tidak ada asuransi, SATU dek, dan sepatunya
   dikocok ulang begitu 40 kartu terpakai (150: `IF CD>40`).

   Menempelkan tabel kanonik ke meja itu akan menghasilkan saran yang SALAH,
   diucapkan dengan percaya diri, lengkap dengan alasan yang terdengar benar.
   Untuk bahan ajar itu kegagalan terburuk yang mungkin.

   Jadi seluruh angka di sini dihitung dari aturan program itu sendiri, dan
   dari KARTU YANG MASIH TERSISA di sepatu — bukan dari dek baru. Pada satu dek
   dengan 40 dari 52 kartu terpakai, bedanya bukan hiasan.

   YANG DIHITUNG EKSAK, DAN YANG TIDAK
   -----------------------------------
   Eksak: sebaran hasil akhir bandar, nilai harapan STAND, nilai harapan HIT
   (dengan kelanjutan optimal), dan nilai harapan DOUBLE.
   Hampiran: SPLIT — dihitung sebagai dua tangan bebas tanpa split ulang.
   Hampiran itu DIKATAKAN di layar, tidak disembunyikan.
   =========================================================================== */
(function (global) {
  'use strict';

  /* Nilai tangan, sama persis dengan `_shared/blackjack.js` — ditulis ulang di
     sini supaya mesin hitung ini bisa diuji tanpa memuat mejanya. */
  function nilai(kartu) {
    let t = 0, as = 0;
    kartu.forEach(k => { const v = Math.min(k.v || k, 10); t += v; if (v === 1) as++; });
    const lunak = as > 0 && t + 10 <= 21;
    return { total: lunak ? t + 10 : t, keras: t, lunak, bangkrut: t > 21 };
  }

  /** Salin komposisi dan ambil satu kartu bernilai v. */
  function kurangi(k, v) { const s = Object.assign({}, k); s[v]--; return s; }
  function jumlah(k) { let n = 0; for (const v in k) n += k[v]; return n; }

  /* ======================================================================
     SEBARAN HASIL AKHIR BANDAR

     Rekursif atas komposisi sisa. `A.bandarH17` menentukan apakah 17 lunak
     ditambah — untuk 21.BAS nilainya false, jadi bandar berhenti di semua 17.

     Hasilnya peluang atas: 17, 18, 19, 20, 21, bangkrut. Blackjack bandar
     ditangani terpisah oleh pemanggilnya, karena bayarannya beda.
     ====================================================================== */
  function sebaranBandar(kartuBandar, komposisi, A, memo) {
    const v = nilai(kartuBandar);
    if (v.total > 21) return { bust: 1 };
    const berhenti = v.total > 17 ||
                     (v.total === 17 && (!v.lunak || !A.bandarH17));
    if (berhenti) { const o = {}; o[v.total] = 1; return o; }

    /* Kunci memo: total + kelunakan + komposisi. Komposisi berubah tiap
       kartu, jadi memonya hanya menolong di dalam satu pohon panggilan. */
    const kunci = v.total + '/' + (v.lunak ? 's' : 'h') + '/' +
                  [1,2,3,4,5,6,7,8,9,10].map(x => komposisi[x] | 0).join(',');
    if (memo[kunci]) return memo[kunci];

    const n = jumlah(komposisi);
    const hasil = {};
    if (n === 0) { const o = {}; o[v.total] = 1; return o; }
    for (let c = 1; c <= 10; c++) {
      const ada = komposisi[c] | 0;
      if (!ada) continue;
      const p = ada / n;
      const sub = sebaranBandar(kartuBandar.concat([{ v: c }]),
                                kurangi(komposisi, c), A, memo);
      for (const k in sub) hasil[k] = (hasil[k] || 0) + p * sub[k];
    }
    memo[kunci] = hasil;
    return hasil;
  }

  /** Nilai harapan berhenti, dalam satuan taruhan (menang +1, kalah -1). */
  function evStand(totalPemain, sebaran) {
    let ev = 0;
    for (const k in sebaran) {
      const p = sebaran[k];
      if (k === 'bust') ev += p;
      else {
        const t = Number(k);
        ev += p * (totalPemain > t ? 1 : totalPemain < t ? -1 : 0);
      }
    }
    return ev;
  }

  /* ======================================================================
     NILAI HARAPAN PEMAIN

     `evTerbaik` mengembalikan nilai harapan bermain optimal dari keadaan ini
     — dipakai sebagai kelanjutan sesudah HIT. Kedalamannya dibatasi bukan
     demi kecepatan melainkan karena tangan blackjack memang tidak bisa
     panjang: dari total 4 pun, lima kartu sudah hampir pasti bangkrut.
     ====================================================================== */
  function evHit(kartu, komposisi, kartuBandar, A, memo, dalam) {
    const n = jumlah(komposisi);
    if (!n) return evStand(nilai(kartu).total, sebaranMain(kartuBandar, komposisi, A));
    let ev = 0;
    for (let c = 1; c <= 10; c++) {
      const ada = komposisi[c] | 0;
      if (!ada) continue;
      const p = ada / n;
      const baru = kartu.concat([{ v: c }]);
      const sisa = kurangi(komposisi, c);
      const vb = nilai(baru);
      if (vb.total > 21) { ev += p * -1; continue; }
      ev += p * evTerbaik(baru, sisa, kartuBandar, A, memo, dalam + 1).ev;
    }
    return ev;
  }

  function evTerbaik(kartu, komposisi, kartuBandar, A, memo, dalam) {
    const v = nilai(kartu);
    if (v.total > 21) return { ev: -1, aksi: 'stand' };
    const berhenti = evStand(v.total, sebaranMain(kartuBandar, komposisi, A));
    if (dalam >= 8 || v.total >= 21) return { ev: berhenti, aksi: 'stand' };
    const tambah = evHit(kartu, komposisi, kartuBandar, A, memo, dalam);
    return tambah > berhenti ? { ev: tambah, aksi: 'hit' }
                             : { ev: berhenti, aksi: 'stand' };
  }

  /* ======================================================================
     SARAN LENGKAP untuk satu keadaan meja.
     ====================================================================== */
  function saran(keadaan) {
    const { kartu, kartuBandar, komposisi, aturan, bolehGanda, bolehSplit } = keadaan;
    const A = aturan;
    const v = nilai(kartu);
    const sebaran = sebaranMain(kartuBandar, komposisi, A);

    const pilihan = [];
    const evS = evStand(v.total, sebaran);
    pilihan.push({ aksi: 'stand', ev: evS });

    if (v.total < 21) {
      pilihan.push({ aksi: 'hit',
                     ev: evHit(kartu, komposisi, kartuBandar, A, {}, 0) });
    }

    if (bolehGanda) {
      /* Double: tepat SATU kartu lalu wajib berhenti, taruhan dua kali. */
      const n = jumlah(komposisi);
      let ev = 0;
      for (let c = 1; c <= 10; c++) {
        const ada = komposisi[c] | 0;
        if (!ada) continue;
        const baru = kartu.concat([{ v: c }]);
        const vb = nilai(baru);
        const sisa = kurangi(komposisi, c);
        ev += (ada / n) * (vb.total > 21 ? -1
              : evStand(vb.total, sebaranMain(kartuBandar, sisa, A)));
      }
      pilihan.push({ aksi: 'ganda', ev: 2 * ev, hampiran: false });
    }

    if (bolehSplit) {
      /* HAMPIRAN, dan disebut begitu di layar: dihitung sebagai DUA tangan
         yang masing-masing mulai dari satu kartu pecahan, tanpa split ulang
         dan tanpa memperhitungkan bahwa kedua tangan berbagi sepatu yang
         sama. Menghitungnya eksak menuntut menelusuri kedua tangan bersama,
         dan ongkosnya tidak sebanding dengan bedanya. */
      const satu = kartu[0];
      const n = jumlah(komposisi);
      let ev = 0;
      for (let c = 1; c <= 10; c++) {
        const ada = komposisi[c] | 0;
        if (!ada) continue;
        const tangan = [satu, { v: c }];
        ev += (ada / n) * evTerbaik(tangan, kurangi(komposisi, c),
                                    kartuBandar, A, {}, 0).ev;
      }
      pilihan.push({ aksi: 'split', ev: 2 * ev, hampiran: true });
    }

    pilihan.sort((a, b) => b.ev - a.ev);
    return { pilihan, terbaik: pilihan[0], sebaran, nilaiTangan: v };
  }

  /* Peluang bandar bangkrut — dipakai untuk kalimat alasannya. */
  function peluangBust(sebaran) { return sebaran.bust || 0; }

  /* ======================================================================
     SEBARAN DENGAN SYARAT "BANDAR TIDAK PUNYA BLACKJACK"

     Baris 230-240 `21.BAS`:

         230 IF CP(1)=10 AND CP(2)=1 THEN BJK1=1:GOTO 710
         240 IF CP(2)=10 AND CP(1)=1 THEN BJK1=1:GOTO 710

     Bandar yang blackjack menang SEKETIKA, sebelum pemain sempat menambah,
     menggandakan, atau memecah. Jadi pada saat pemain memutuskan, keadaan
     "bandar blackjack" SUDAH TIDAK MUNGKIN — ia tersaring keluar.

     Versi pertama mesin ini melewatkan itu, dan akibatnya terukur: split 8,8
     lawan kartu buka 10 keluar sebagai pilihan TERBURUK, padahal setiap tabel
     blackjack mengatakan selalu pecah. Sebabnya taruhan ganda dibebani
     kekalahan melawan blackjack bandar yang tidak akan pernah terjadi.

     Salah satu tanda mesin hitung yang keliru memang begitu: ia tidak
     memberi galat, ia memberi nasihat yang buruk dengan angka di belakangnya.
     ====================================================================== */
  function sebaranMain(kartuBandar, komposisi, A) {
    if (kartuBandar.length !== 1) {
      return sebaranBandar(kartuBandar, komposisi, A, {});
    }
    const up = Math.min(kartuBandar[0].v, 10);
    const pasangan = up === 1 ? 10 : (up === 10 ? 1 : 0);
    if (!pasangan) return sebaranBandar(kartuBandar, komposisi, A, {});

    const n = jumlah(komposisi);
    const bisaBJ = komposisi[pasangan] | 0;
    const pBJ = n ? bisaBJ / n : 0;
    if (pBJ >= 1) return { 21: 1 };

    /* Jumlahkan tiap kartu tertutup KECUALI yang membuat blackjack, lalu
       normalkan ulang dengan (1 - pBJ). */
    const hasil = {};
    for (let c = 1; c <= 10; c++) {
      const ada = komposisi[c] | 0;
      if (!ada || c === pasangan) continue;
      const p = (ada / n) / (1 - pBJ);
      const sub = sebaranBandar(kartuBandar.concat([{ v: c }]),
                                kurangi(komposisi, c), A, {});
      for (const k in sub) hasil[k] = (hasil[k] || 0) + p * sub[k];
    }
    return hasil;
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.nasihatBJ = { nilai, sebaranBandar, sebaranMain, evStand, saran,
                             peluangBust, jumlah, kurangi };
})(window);
