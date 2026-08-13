/* ===========================================================================
   21.js — port dari 21.BAS
   Friendlyware PC Introductory Set, menu #1 pilihan D.

   Mesin permainannya bersama, di `_shared/blackjack.js`; yang di sini hanya
   ATURAN program ini dan teks aslinya. Keempat port blackjack memakai mesin
   yang sama justru supaya perbedaan aturannya bisa dibaca berdampingan —
   lihat `web/docs/blackjack.md`.

   YANG KHAS DARI PROGRAM INI

   Blackjack dibayar DUA KALI LIPAT (baris 1770: CSH=CSH+BT*300, sedangkan
   menang biasa CSH=CSH+BT*200). Aturan kasino sungguhan 1,5:1. Selisih itu
   memindahkan sekitar 2,3 poin persen keunggulan ke pihak pemain -- cukup
   untuk membuat harapan pemain jadi POSITIF.

   Dan program ini tahu: baris 90 memeriksa `IF CSH>10000` lalu menampilkan
   "You Broke The Bank !!!". Layar kemenangan itu sendiri adalah buktinya.
   =========================================================================== */

(function () {
  'use strict';

  const ui = RETRO.ui, B = RETRO.blackjack;
  const $ = id => document.getElementById(id);

  /* Seluruh perbedaan program ini dari ketiga saudaranya ada di sini. */
  const ATURAN = {
    dek: 1, potong: null,
    bayarBJ: 2,               // "Dealer Pays Double" -- baris 860, 1770
    bandarH17: false,         // baris 670: IF CPHD>16 THEN berhenti
    asuransi: false,          // tidak ada sama sekali
    split: true, double: true,
    modal: 2000,              // baris 70: CSH=2000
    taruhMin: 100, taruhMax: 1000, kelipatan: 100,   // taruhan dalam keping $100
    bangkrutkanBandar: 10000  // baris 90: IF CSH>10000 THEN "You Broke The Bank"
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
    blackjackAnda:   'You Have Blackjack! Dealer Pays Double.',
    selamatDatang:   'Place Your Bet Please. How Many Chips?'
  };

  const permainan = B.meja({
    aturan: ATURAN, teks: TEKS,
    rng: RETRO.rng(RETRO.freshSeed()),
    audio: RETRO.audio,
    simpan: RETRO.store('21')
  });

  $('topbar-host').append(ui.topbar({
    title: 'Blackjack',
    source: '21.BAS &middot; Friendlyware &middot; 1982'
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
