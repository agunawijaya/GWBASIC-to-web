/* ===========================================================================
   temple.js — aturan TEMPLE.BAS, "The Temple of Loth" v4.2.

   John Belew ("Nurruc the Chaotic") of the Apple Eliminators.
   Layar judul: 25 Juli 1984. Komentar kode: 29 Juni 1984.

   Berkas ini pendek karena TEMPLE memang pendek — sebagai gagasan. Ia
   WIZARD.BAS yang disalin lalu diubah, dan kodenya sendiri mengakuinya di
   baris 750: "THANKS TO RECREATIONAL COMPUTING FOR THE ORIGINAL PROGRAM".
   Mesinnya karena itu ada di `_shared/zot.js`, dan yang ada di sini cuma
   yang benar-benar berbeda:

     - nama monster diganti dari Tolkien/umum ke TSR (baris 740:
       "THANKS TO TSR FOR THE MONSTERS")
     - Orb of Zot jadi Amulet of Chaos, dan memberi bonus
     - kabut MENYALA, karena Belew membaca komentar Power dan
       melakukan yang disuruhnya
     - ada skor dan tangga peringkat, yang tidak ada di WIZARD
   =========================================================================== */
window.RETRO.zot({
  ekspor: 'TEMPLE',
  simpanan: 'temple',
  topbar: 'The Temple of Loth',
  sumber: 'TEMPLE.BAS · John Belew · 1984',

  /* WIZARD 4150 : IF Q > 99 THEN Q=Q-100 ' LET Q=34 TO HIDE ROOMS
     TEMPLE 4570 : IF Q > 99 THEN Q=Q-100:LET Q=34:REM TO HIDE ROOMS
     Belew memindahkan instruksinya dari balik tanda kutip ke dalam alur
     program. Di sini kabutnya bukan penyimpangan — ia memang bawaan. */
  kabutBawaan: true,

  judul: '* * * THE TEMPLE OF LOTH * * *',
  cerita: [
    'MANY GENERATIONS AGO, DURING THE GREAT ELFIN WARS OF THE',
    'FIRST AGE, THERE STOOD THE MAJESTIC TEMPLE OF THE DROW. THE',
    'DROW ARE AN EVIL RACE OF ELVES DEDICATED TO THE DESTRUCTION',
    'OF ALL ELVES BUT THEMSELVES. DURING THIS TIME THEY WERE RUL-',
    'ED BY THE EVIL PRIESTESS, TAR-ANCLIME, A GREAT SORCERESS.',
    'UNDER THE AID OF HER GODDESS LOTH, SHE CREATED THE AMULET',
    'OF CHAOS. MANY HAVE SOUGHT IT. NONE HAVE RETURNED.'],

  /* DATA 10540-10650. Bentuknya identik dengan WIZARD — 34 pasang, 88 item
     seluruhnya — dan yang diganti cuma kata-katanya. Perhatikan pola
     penggantiannya: dua belas monster jadi monster TSR (Green Slime, Mind
     Flayer, Drow, Drider, Balor Demon, Red Dragon), pedagangnya jadi Drow
     Merchant, tapi kedelapan HARTA dibiarkan persis seperti Power
     menulisnya — Palantir dan Silmaril tetap Tolkien. */
  CS: ['',
    'an empty room', 'the entrance', 'stairs going up', 'stairs going down',
    'a pool', 'a chest', 'gold pieces', 'flares', 'a warp', 'a sinkhole',
    'a Crystal Orb', 'a book', 'a Green Slime', 'an Orc', 'an Evil Dwarf',
    'a Goblin', 'a Mind Flayer', 'a Troll', 'a Giant spider', 'a Minotar',
    'a Drow', 'a Drider', 'a Balor Demon', 'a Red Dragon', 'a Drow Merchant',
    'the Ruby Red', 'the Norn Stone', 'the Pale Pearl', 'the Opal Eye',
    'the Green Gem', 'the Blue Flame', 'the Palantir', 'the Silmaril', 'X'],

  WS: ['', 'no weapon', 'Dagger', 'Mace', 'Sword',
       'No armor', 'Leather', 'Chainmail', 'Plate mail'],
  ES: ['', ' sandwich', ' stew', ' soup', ' burger',
       ' roast', ' filet', ' taco', ' pie'],
  RS: ['', 'Hobbit', 'Elf', 'Man', 'Dwarf'],

  /* TEMPLE 10250-10262: Amulet menyembuhkan kebutaan, melepaskan buku yang
     melekat, dan menaikkan kelincahan ke maksimum. WIZARD tidak memberi
     satu pun dari ketiganya. */
  orbBonus(S) { S.DX = 18; S.BF = 0; S.BL = 0; },

  skor: {
    /* TEMPLE 6450 — dihitung DI DALAM rutin papan status, jadi angka
       peringkat sebenarnya sudah terlihat tiap giliran. */
    akhir: (S) => S.IQ * 100 + S.ST * 100 + S.DX * 100 +
                  S.KM + S.FTRS + S.REQ + S.GP - S.turn * 5,
    /* TEMPLE 11050 — perintah '#'. Rumus yang SAMA SEKALI BERBEDA, dan
       nilainya ratusan kali lebih kecil. Dipertahankan apa adanya. */
    cepat: (S) => S.ST + S.IQ + S.DX + S.GP - S.turn,
    /* TEMPLE 10020-10027, apa adanya. Perhatikan rentang 20.000..35.000:
       tidak satu pun syarat menyentuhnya. */
    peringkat: [
      [20000, 'a Wimp', '<'],
      [35000, 'a Peasant', '>'],
      [50000, 'an Amateur', '>'],
      [75000, 'a Scout', '>'],
      [90000, 'an Adventurer', '>'],
      [110000, 'a Hero', '>'],
      [125000, 'a Wizard', '>'],
      [140000, 'a Lord', '>']],
    /* TEMPLE 12100 dan TEM-INS 2810 memuat angka yang sama, di dua berkas
       yang berbeda, tanpa apa pun yang menjaganya tetap sinkron. */
    tertinggi: 142498
  }
});
