/* ===========================================================================
   black.js — port dari BLACK.BAS
   Program paling rajin dikomentari di koleksi ini.

   Mesin permainannya bersama, di `_shared/blackjack.js`; yang di sini hanya
   ATURAN program ini dan teks aslinya. Keempat port blackjack memakai mesin
   yang sama justru supaya perbedaan aturannya bisa dibaca berdampingan —
   lihat `web/docs/blackjack.md`.

   YANG KHAS DARI PROGRAM INI

   Tidak ada split -- baris 2550 menawarkan tepat empat pilihan:
   "1=HIT, 2=STAND, 3=DOUBLE, 4=REVIEW CARDS".

   Bandarnya berhenti di 17 LUNAK (baris 5070-5080), varian yang lebih
   ramah bagi pemain daripada BLACKJCK.

   Pengocokannya bukan Fisher-Yates melainkan 156 TUKAR ACAK (baris 1250):

       FOR L=1 TO 156 : X=INT(RND*52)+1 : Y=INT(RND*52)+1 : SWAP ...

   Apakah 156 tukar cukup untuk 52 kartu? Diukur di web/docs/blackjack.md.
   =========================================================================== */

(function () {
  'use strict';

  const ui = RETRO.ui, B = RETRO.blackjack;
  const $ = id => document.getElementById(id);

  /* Seluruh perbedaan program ini dari ketiga saudaranya ada di sini. */
  const ATURAN = {
    dek: 1,                   // dikocok dengan 156 tukar acak, baris 1250
    potong: null,
    bayarBJ: 2,               // baris 5535: WINNING=WINNING+BET*2 (menang biasa +BET)
    bandarH17: false,         // baris 5070-5080: berhenti di 17 LUNAK juga
    asuransi: false,
    split: false,             // pilihannya cuma 1=HIT 2=STAND 3=DOUBLE 4=REVIEW
    double: true,
    modal: 500,
    taruhMin: 5, taruhMax: 200, kelipatan: 5,
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
    blackjackAnda:   'BLACKJACK',
    selamatDatang:   'What is your bet?'
  };

  const permainan = B.meja({
    aturan: ATURAN, teks: TEKS,
    rng: RETRO.rng(RETRO.freshSeed()),
    audio: RETRO.audio,
    simpan: RETRO.store('black')
  });

  $('topbar-host').append(ui.topbar({
    title: 'Blackjack — BLACK.BAS',
    source: 'BLACK.BAS &middot; 1982'
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
