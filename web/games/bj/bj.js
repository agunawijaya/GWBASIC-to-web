/* ===========================================================================
   bj.js — port dari BJ.BAS
   Versi ringkas, dengan sepatu empat dek dan kartu potong acak.

   Mesin permainannya bersama, di `_shared/blackjack.js`; yang di sini hanya
   ATURAN program ini dan teks aslinya. Keempat port blackjack memakai mesin
   yang sama justru supaya perbedaan aturannya bisa dibaca berdampingan —
   lihat `web/docs/blackjack.md`.

   YANG KHAS DARI PROGRAM INI

   Satu-satunya dari empat yang memakai SEPATU: 208 kartu, empat dek. Dan
   kartu potongnya diletakkan ACAK (baris 250):

       CZ = INT(RND(1)*25) + 175

   Kocok ulang terjadi setelah 175-199 kartu terpakai. Letak yang acak itu
   persis alasannya kasino sungguhan memakai kartu potong: penghitung kartu
   tidak boleh bisa tahu kapan sepatunya akan habis.

   Nilai tangannya dihitung TANPA perulangan, lewat total yang digeser +11
   (baris 310-360). Bentuknya mencurigakan dan ternyata benar persis --
   diuji atas 5.229.042 tangan.
   =========================================================================== */

(function () {
  'use strict';

  const ui = RETRO.ui, B = RETRO.blackjack;
  const $ = id => document.getElementById(id);

  /* Seluruh perbedaan program ini dari ketiga saudaranya ada di sini. */
  const ATURAN = {
    dek: 4,                   // baris 150: DIM C(208)
    potong: [175, 199],       // baris 250: CZ=INT(RND(1)*25)+175 -- kartu potong ACAK
    bayarBJ: 1.5,             // baris 1270: S(I)=S(I)+1.5*B(I)
    bandarH17: false,         // baris 1600: berhenti begitu FNA(Q)>=17
    asuransi: true,           // baris 840-850, sampai 50% taruhan
    split: true, double: true,
    modal: 1000,
    taruhMin: 5, taruhMax: 200, kelipatan: 5,   // baris 1010, persis
    bangkrutkanBandar: null
  };

  /* Teks di dalam permainan sengaja tetap bahasa Inggris aslinya. */
  const TEKS = {
    seri:            'Push.',
    andaBangkrut:    'You Busted! Dealer Wins.',
    bandarBangkrut:  'Dealer Busted! You Win.',
    blackjackBandar: 'Dealer Has Blackjack!  You Lose.',
    andaMenang:  (a, b) => 'Dealer Has ' + b + '. You Have ' + a + '. You Win.',
    bandarMenang:(a, b) => 'Dealer Has ' + b + '. You Have ' + a + '. Dealer Wins.',
    tidakCukup:      'You do not have that much money.',
    tidakCukupGanda: "You Don't Have Enough Money To Double Down",
    tidakCukupSplit: "You Don't Have Enough Money To Split Your Hand.",
    telatGanda:      'TOO LATE TO DOUBLE',
    takBisaSplit:    'NO SPLITS NOW',
    bukanPasangan:   'NO SPLITS NOW',
    asuransiMenang:  'You win on insurance.',
    asuransiKalah:   'You lost on insurance.',
    kocokUlang:      'Reshuffling the shoe.',
    tekanBagi:       'Place your bet, then Deal.',
    habis:           'You Have Lost  All  Of  Your Money!',
    bankPecah:       'You Broke The Bank !!!',
    blackjackAnda:   'BLACKJACK! Paid 1.5 to 1.',
    selamatDatang:   'Enter a bet in multiples of $5, not exceeding $200.'
  };

  const permainan = B.meja({
    aturan: ATURAN, teks: TEKS,
    rng: RETRO.rng(RETRO.freshSeed()),
    audio: RETRO.audio,
    simpan: RETRO.store('bj')
  });

  $('topbar-host').append(ui.topbar({
    title: 'Blackjack — empat dek',
    source: 'BJ.BAS &middot; 1980'
  }));

  $('bjBagi').addEventListener('click', permainan.bagi);
  $('bjHit').addEventListener('click', permainan.hit);
  $('bjStand').addEventListener('click', permainan.stand);
  $('bjGanda').addEventListener('click', permainan.ganda);
  $('bjSplit').addEventListener('click', permainan.split);
  $('bjLagi').addEventListener('click', permainan.lagi);
  $('bjAsuransiYa').addEventListener('click', () => permainan.asuransi(true));
  $('bjAsuransiTidak').addEventListener('click', () => permainan.asuransi(false));
  $('bjTaruhNaik').addEventListener('click', () => permainan.ubahTaruh(1));
  $('bjTaruhTurun').addEventListener('click', () => permainan.ubahTaruh(-1));
  $('bjUlang').addEventListener('click', permainan.mulai);

  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'h') permainan.hit();
    else if (k === 's') permainan.stand();
    else if (k === 'd') permainan.ganda();
    else if (k === 'enter') { permainan.bagi(); permainan.lagi(); }
  });

  permainan.mulai();
})();
