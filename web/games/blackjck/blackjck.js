/* ===========================================================================
   blackjck.js — port dari BLACKJCK.BAS
   CCII BLACKJACK, Jessen, 3 Januari 1978. Diadaptasi ke IBM PC oleh Patrick Leabo, Tucson.

   Mesin permainannya bersama, di `_shared/blackjack.js`; yang di sini hanya
   ATURAN program ini dan teks aslinya. Keempat port blackjack memakai mesin
   yang sama justru supaya perbedaan aturannya bisa dibaca berdampingan —
   lihat `web/docs/blackjack.md`.

   YANG KHAS DARI PROGRAM INI

   Yang tertua (1978) dan satu-satunya yang aturannya BENAR seluruhnya:

     - blackjack 1,5 : 1          (baris 1550, dan diumumkan di layar 3380)
     - bandar AMBIL di 17 lunak   (baris 2740-2760)  <- varian H17
     - asuransi                   (baris 1590-1660)
     - batas rumah $500           (baris 1220)

   Baris 2740-2760 layak dibaca pelan-pelan:

       2740 IF T(1)<17 THEN ambil
       2750 IF T(1)>17 THEN berhenti
       2760 IF E(1)>0  THEN ambil        ' T=17 dan punya As -> AMBIL

   Tiga baris untuk satu keputusan yang di kasino sungguhan tertulis di
   permukaan meja: "Dealer must hit soft 17".

   Ditulis untuk CCII pada 1978 -- empat tahun sebelum IBM PC punya program
   lain di koleksi ini -- lalu diadaptasi oleh Patrick Leabo, orang yang sama
   yang menulis MAXIT1 dan OTHELLO.
   =========================================================================== */

(function () {
  'use strict';

  const ui = RETRO.ui, B = RETRO.blackjack;
  const $ = id => document.getElementById(id);

  /* Seluruh perbedaan program ini dari ketiga saudaranya ada di sini. */
  const ATURAN = {
    dek: 1, potong: null,
    bayarBJ: 1.5,             // baris 1550: W1=W1+1.5*W -- dan layar 3380 mengumumkannya
    bandarH17: true,          // baris 2740-2760: pada 17 LUNAK, bandar AMBIL kartu
    asuransi: true,           // baris 1590-1660
    split: true, double: true,
    modal: 1000,
    taruhMin: 5, taruhMax: 500, kelipatan: 5,   // baris 1220: HOUSE LIMIT IS $500
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
    blackjackAnda:   'BLACKJACK! PAYS 1.5 TO 1',
    selamatDatang:   'HOUSE LIMIT IS $500.00    BLACKJACK PAYS 1.5 TO 1'
  };

  const permainan = B.meja({
    aturan: ATURAN, teks: TEKS,
    rng: RETRO.rng(RETRO.freshSeed()),
    audio: RETRO.audio,
    simpan: RETRO.store('blackjck')
  });

  $('topbar-host').append(ui.topbar({
    title: 'CCII Blackjack',
    source: 'BLACKJCK.BAS &middot; Jessen, 3 Jan 1978 &middot; PC: Patrick Leabo'
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
