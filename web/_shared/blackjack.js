/* ===========================================================================
   blackjack.js — mesin blackjack bersama untuk EMPAT port sekaligus:
   `21`, `BJ`, `BLACK`, `BLACKJCK`.

   KENAPA SATU MESIN, BUKAN EMPAT

   Keempat program memainkan permainan yang sama dengan aturan yang BERBEDA —
   dan justru perbedaan itulah yang ingin ditunjukkan. Kalau masing-masing
   ditulis sendiri-sendiri, perbedaannya akan tenggelam di antara ratusan
   baris yang identik, dan tidak ada satu tempat pun untuk membandingkannya.

   Di sini aturannya jadi DATA. Seluruh perbedaan antara keempat program muat
   dalam satu objek `aturan` — dan objek itu bisa ditaruh berdampingan di
   sebuah tabel. Lihat `web/docs/blackjack.md`.

   Yang TIDAK ada di sini: tampilan khas tiap program, teks aslinya, dan
   panel dokumentasinya. Itu tinggal di berkas masing-masing.
   =========================================================================== */

(function (global) {
  'use strict';

  const K = global.RETRO.cards;

  /**
   * Nilai sebuah tangan: As bernilai 11 kalau muat, 1 kalau tidak. Hanya
   * SATU As yang pernah bisa bernilai 11 — dua As bernilai 11 sudah 22.
   *
   * BJ.BAS melakukannya tanpa perulangan sama sekali, dengan menyimpan total
   * yang digeser +11 (baris 310-360). Bentuknya terlihat mencurigakan dan
   * ternyata benar persis: diuji atas 5.229.042 tangan 1-6 kartu, nol
   * ketidakcocokan. Ceritanya di web/docs/blackjack.md §3.
   *
   * @returns {{total:number, lunak:boolean, bangkrut:boolean}}
   */
  function nilai(tangan) {
    let t = 0, as = 0;
    tangan.forEach(c => { t += Math.min(c.v, 10); if (c.v === 1) as++; });
    const lunak = as > 0 && t + 10 <= 21;
    if (lunak) t += 10;
    return { total: t, lunak: lunak, bangkrut: t > 21 };
  }

  const blackjack = t => t.length === 2 && nilai(t).total === 21;

  /**
   * Sepatu kartu. Satu dek atau banyak, dengan kartu potong opsional.
   *
   * BJ.BAS punya yang paling maju di koleksi (baris 250):
   *     CZ = INT(RND(1)*25) + 175
   * yaitu kocok ulang setelah 175-199 kartu dari 208 — kartu potong yang
   * letaknya ACAK, persis seperti kasino sungguhan, supaya penghitung kartu
   * tidak bisa tahu kapan sepatunya akan habis.
   */
  function sepatu(dek, potong, rng) {
    let kartu = [], pakai = 0, batas = 0;
    function kocok() {
      kartu = [];
      for (let i = 0; i < dek; i++) kartu = kartu.concat(K.deck());
      rng.shuffle(kartu);
      pakai = 0;
      batas = potong ? potong[0] + rng.int(potong[1] - potong[0] + 1)
                     : kartu.length;
    }
    kocok();
    return {
      /* Baris 190 aslinya: `IF C>=CZ THEN <kocok>` — pemeriksaan ada SEBELUM
         TIAP KARTU, bukan sebelum tiap tangan. Jadi sepatunya dikocok ulang
         di tengah tangan begitu kartu potong tercapai.

         Versi pertama port ini memeriksanya saat membagi saja. Akibatnya
         sepatu boleh terus dipakai sampai tangan itu selesai — dan terukur
         turun sampai SISA 3 KARTU, jauh melewati kartu potong di 175-199.
         Di ambang itu satu tangan panjang bisa menghabiskan sepatunya dan
         memicu kocok ulang di titik yang salah. */
      ambil() { if (pakai >= batas) kocok(); return kartu[pakai++]; },
      get habis() { return pakai >= batas; },
      get sisa() { return kartu.length - pakai; },
      get batas() { return batas; },
      /* KOMPOSISI sisa sepatu — CACAHNYA saja, bukan urutannya.

         Ini sengaja mengembalikan tabel jumlah per nilai kartu, bukan larik
         kartunya. Bedanya menentukan: penghitung kartu yang jujur tahu APA
         yang masih ada, bukan APA YANG DATANG BERIKUTNYA. Mengembalikan
         lariknya akan membuat penasihat di blackjack-tutor bisa mengintip
         masa depan, dan nasihat yang mengintip bukan nasihat. */
      get komposisi() {
        const c = {};
        /* Sampai AKHIR dek, bukan sampai kartu potong. Kartu potong cuma
           memicu kocok ulang; ia tidak mengeluarkan kartu dari dek. Versi
           pertama berhenti di `batas` dan akibatnya terlihat seketika:
           hitungan Hi-Lo menunjukkan -2 pada dek yang masih utuh, karena
           sebelas kartu di belakang kartu potong dikira sudah keluar. */
        for (let i = pakai; i < kartu.length; i++) {
          const v = Math.min(kartu[i].v, 10);
          c[v] = (c[v] || 0) + 1;
        }
        return c;
      },
      kocok: kocok
    };
  }

  /* =========================================================================
     MEJA — alur permainan dan gambarnya.

     Seluruh perbedaan antara keempat program masuk lewat `cfg.aturan`. Kalau
     sebuah perbedaan tidak bisa dinyatakan di sana, itu tandanya ia memang
     bukan soal aturan, dan harus tinggal di berkas programnya — bukan
     dipaksa masuk ke sini.
     ========================================================================= */

  function el(tag, cls, txt) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function meja(cfg) {
    const A = cfg.aturan, T = cfg.teks, rng = cfg.rng, audio = cfg.audio;
    const $ = id => document.getElementById(id);
    const dek = sepatu(A.dek, A.potong || null, rng);
    const uang = n => '$' + Number(n).toLocaleString('en-US');

    let kas, taruh, tangan, aktif, bandar, fase, asuransi, riwayat;

    function mulai() {
      kas = A.modal;
      riwayat = { menang: 0, kalah: 0, seri: 0, bj: 0, tangan: 0 };
      fase = 'taruh'; taruh = A.taruhMin; tangan = []; bandar = [];
      asuransi = 0; aktif = 0;
      pesan(T.selamatDatang || '');
      gambar();
    }

    /* --- membagi ---------------------------------------------------------- */

    function bagi() {
      if (fase !== 'taruh') return;
      if (taruh > kas) return pesan(T.tidakCukup, 'bad');
      if (A.potong && dek.habis) pesan(T.kocokUlang);   // kocoknya di `ambil`
      kas -= taruh;
      tangan = [{ kartu: [dek.ambil(), dek.ambil()], taruh: taruh,
                  selesai: false, ganda: false }];
      bandar = [dek.ambil(), dek.ambil()];
      aktif = 0; asuransi = 0; fase = 'main';
      riwayat.tangan++;
      klik();
      if (A.asuransi && bandar[0].v === 1) { fase = 'asuransi'; return gambar(); }
      if (!cekBlackjack()) pesan('');
      gambar();
    }

    /** @returns {boolean} true kalau tangan langsung selesai. */
    function cekBlackjack() {
      if (!blackjack(tangan[0].kartu) && !blackjack(bandar)) return false;
      tangan[0].selesai = true;
      fase = 'bandar';
      selesaikan();
      return true;
    }

    /* --- langkah pemain --------------------------------------------------- */

    const kini = () => tangan[aktif];

    function hit() {
      if (fase !== 'main') return;
      const h = kini();
      h.kartu.push(dek.ambil());
      klik();
      if (nilai(h.kartu).bangkrut) { h.selesai = true; return lanjut(); }
      gambar();
    }

    function stand() {
      if (fase !== 'main') return;
      kini().selesai = true;
      lanjut();
    }

    function ganda() {
      if (fase !== 'main') return;
      const h = kini();
      if (h.kartu.length !== 2) return pesan(T.telatGanda, 'bad');
      if (h.taruh > kas) return pesan(T.tidakCukupGanda, 'bad');
      kas -= h.taruh; h.taruh *= 2; h.ganda = true;
      h.kartu.push(dek.ambil());
      h.selesai = true;
      klik();
      lanjut();
    }

    function split() {
      if (fase !== 'main') return;
      const h = kini();
      if (tangan.length > 1 || h.kartu.length !== 2)
        return pesan(T.takBisaSplit, 'bad');
      /* Aslinya membandingkan NILAI, bukan pangkat: BJ.BAS baris 790 menulis
         "Only pairs and face cards", jadi K+Q boleh dipecah. Itu aturan
         longgar yang memang ada di sebagian kasino, dan dipertahankan. */
      if (Math.min(h.kartu[0].v, 10) !== Math.min(h.kartu[1].v, 10))
        return pesan(T.bukanPasangan, 'bad');
      if (h.taruh > kas) return pesan(T.tidakCukupSplit, 'bad');
      kas -= h.taruh;
      const k2 = h.kartu.pop();
      h.kartu.push(dek.ambil());
      tangan.push({ kartu: [k2, dek.ambil()], taruh: h.taruh,
                    selesai: false, ganda: false });
      klik();
      gambar();
    }

    function jawabAsuransi(ya) {
      if (fase !== 'asuransi') return;
      if (ya) {
        const maks = Math.floor(tangan[0].taruh / 2);
        if (maks <= kas) { asuransi = maks; kas -= maks; }
      }
      fase = 'main';
      if (!cekBlackjack()) pesan('');
      gambar();
    }

    function lanjut() {
      while (aktif < tangan.length && tangan[aktif].selesai) aktif++;
      if (aktif < tangan.length) return gambar();
      fase = 'bandar';
      mainBandar();
      selesaikan();
    }

    /* --- bandar ------------------------------------------------------------
       Satu baris yang memisahkan dua program:

         BLACK.BAS  5070-5080 : berhenti di 17 lunak  (S17)
         BLACKJCK   2740-2760 : AMBIL di 17 lunak     (H17)

       H17 menguntungkan bandar sekitar 0,2%. Dua program, dua varian kasino
       yang dua-duanya sungguhan ada. */
    function mainBandar() {
      if (tangan.every(h => nilai(h.kartu).bangkrut)) return;
      for (;;) {
        const v = nilai(bandar);
        if (v.total > 17) break;
        if (v.total === 17 && !(A.bandarH17 && v.lunak)) break;
        bandar.push(dek.ambil());
        if (nilai(bandar).bangkrut) break;
      }
    }

    /* --- pembayaran --------------------------------------------------------
       `A.bayarBJ` adalah kelipatan taruhan yang DITAMBAHKAN: 1,5 berarti
       aturan kasino 3:2, dan 2 berarti dua kali lipat. Dua dari empat program
       memakai 2 — dan itu membalik keunggulan ke pihak pemain. Diukur di
       web/docs/blackjack.md §2. */
    function selesaikan() {
      const bbj = blackjack(bandar), vb = nilai(bandar);
      const baris = [];

      if (asuransi) {
        if (bbj) { kas += asuransi * 3; baris.push(T.asuransiMenang); }
        else baris.push(T.asuransiKalah);
      }

      tangan.forEach(h => {
        const vp = nilai(h.kartu);
        const pbj = blackjack(h.kartu) && tangan.length === 1;
        if (pbj && bbj)       { kas += h.taruh; riwayat.seri++;  baris.push(T.seri); }
        else if (pbj)         { kas += h.taruh * (1 + A.bayarBJ); riwayat.menang++;
                                riwayat.bj++; baris.push(T.blackjackAnda); }
        else if (bbj)         { riwayat.kalah++; baris.push(T.blackjackBandar); }
        else if (vp.bangkrut) { riwayat.kalah++; baris.push(T.andaBangkrut); }
        else if (vb.bangkrut) { kas += h.taruh * 2; riwayat.menang++;
                                baris.push(T.bandarBangkrut); }
        else if (vp.total > vb.total) { kas += h.taruh * 2; riwayat.menang++;
                                baris.push(T.andaMenang(vp.total, vb.total)); }
        else if (vp.total < vb.total) { riwayat.kalah++;
                                baris.push(T.bandarMenang(vp.total, vb.total)); }
        else                  { kas += h.taruh; riwayat.seri++; baris.push(T.seri); }
      });

      fase = 'selesai';
      pesan(baris.join('   '), 'besar');
      if (cfg.simpan) cfg.simpan.set('kas', kas);
      gambar();
    }

    /* --- gambar ------------------------------------------------------------ */

    function tanganEl(kartu, sembunyi) {
      const h = el('div', 'hand');
      kartu.forEach((c, i) => h.append(K.el(c, { up: !(sembunyi && i === 1) })));
      return h;
    }

    function gambar() {
      const sembunyi = fase === 'main' || fase === 'asuransi';

      const db = $('bjBandar'); db.textContent = '';
      db.append(tanganEl(bandar, sembunyi));
      $('bjBandarNilai').textContent = !bandar.length ? '—'
        : sembunyi ? Math.min(bandar[0].v, 10) + ' + ?'
                   : String(nilai(bandar).total);

      const dp = $('bjPemain'); dp.textContent = '';
      tangan.forEach((h, i) => {
        const kotak = el('div',
          'bj-seat' + (i === aktif && fase === 'main' ? ' is-aktif' : ''));
        kotak.append(tanganEl(h.kartu, false));
        const v = nilai(h.kartu);
        kotak.append(el('div', 'bj-seat__v',
          (blackjack(h.kartu) ? 'BLACKJACK'
                              : v.total + (v.lunak && v.total <= 21 ? ' soft' : '')) +
          '  ·  ' + uang(h.taruh) + (h.ganda ? ' ×2' : '')));
        dp.append(kotak);
      });
      if (!tangan.length) dp.append(el('div', 'bj-seat__v', T.tekanBagi || ''));

      $('bjKas').textContent = uang(kas);
      $('bjTaruh').textContent = uang(taruh);
      $('bjMenang').textContent = riwayat.menang;
      $('bjKalah').textContent = riwayat.kalah;
      $('bjSeri').textContent = riwayat.seri;
      if ($('bjSisa')) $('bjSisa').textContent = dek.sisa;

      const set = (id, tampil) => { const b = $(id); if (b) b.hidden = !tampil; };
      const h = kini();
      set('bjBagi',     fase === 'taruh');
      set('bjTaruhTurun', fase === 'taruh');
      set('bjTaruhNaik',  fase === 'taruh');
      set('bjAsuransi', fase === 'asuransi');
      set('bjHit',      fase === 'main');
      set('bjStand',    fase === 'main');
      set('bjGanda',    fase === 'main' && A.double && h && h.kartu.length === 2);
      set('bjSplit',    fase === 'main' && A.split && tangan.length === 1 &&
                        h && h.kartu.length === 2 &&
                        Math.min(h.kartu[0].v, 10) === Math.min(h.kartu[1].v, 10));
      set('bjLagi',     fase === 'selesai');

      if (fase === 'selesai') {
        if (A.bangkrutkanBandar && kas >= A.bangkrutkanBandar)
          pesan(T.bankPecah, 'besar');
        else if (kas < A.taruhMin) pesan(T.habis, 'bad');
      }
    }

    function pesan(t, jenis) {
      const e = $('bjPesan');
      e.textContent = t || '';
      e.className = 'bj-pesan' + (jenis ? ' bj-pesan--' + jenis : '');
    }

    const klik = () => audio && audio.sound(1400, 0.4);

    function ubahTaruh(d) {
      if (fase !== 'taruh') return;
      const t = taruh + d * A.kelipatan;
      taruh = Math.max(A.taruhMin, Math.min(A.taruhMax, Math.min(t, kas)));
      gambar();
    }

    return {
      mulai: mulai, bagi: bagi, hit: hit, stand: stand, ganda: ganda,
      split: split, asuransi: jawabAsuransi, ubahTaruh: ubahTaruh,
      lagi() {
        if (kas < A.taruhMin) return mulai();
        fase = 'taruh'; tangan = []; bandar = []; asuransi = 0;
        taruh = Math.min(taruh, kas);
        pesan(''); gambar();
      },
      get kas() { return kas; },
      get riwayat() { return riwayat; },
      get dek() { return dek; },
      /* Kait BACA-SAJA. Ditambahkan untuk blackjack-tutor, yang perlu melihat
         keadaan meja tanpa boleh mengubahnya. Semuanya salinan atau nilai
         primitif, jadi tidak ada jalan dari luar untuk menyentuh keadaan asli
         — dan keempat halaman blackjack yang sudah ada tidak terpengaruh
         sedikit pun, karena tidak satu pun memanggilnya. */
      get fase() { return fase; },
      get taruh() { return taruh; },
      get aturan() { return A; },
      get bandarKartu() { return bandar.slice(); },
      get tanganAktif() { return aktif; },
      get tangan() {
        return tangan.map(h => ({ kartu: h.kartu.slice(), taruh: h.taruh,
                                  selesai: h.selesai, ganda: h.ganda }));
      }
    };
  }

  global.RETRO.blackjack = { nilai: nilai, blackjack: blackjack,
                             sepatu: sepatu, meja: meja };
})(window);
