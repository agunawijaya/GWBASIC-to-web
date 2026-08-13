/* ===========================================================================
   wizard.js — aturan WIZARD.BAS, "The Wizard's Castle".

   Joseph R. Power untuk Exidy Sorcerer, Recreational Computing Jul/Agu 1980;
   diport ke Heath Microsoft BASIC oleh J.F. Stetson; disket IPCO 2039-A.

   Seluruh mesinnya ada di `_shared/zot.js`, karena TEMPLE.BAS memakai mesin
   yang sama — 706 pernyataannya identik kata demi kata dengan program ini,
   dan kedua `DIM` serta kelima `DEF FN` sama aksara demi aksara. Berkas ini
   cuma memuat yang BERBEDA.
   =========================================================================== */
window.RETRO.zot({
  ekspor: 'WIZARD',
  simpanan: 'wizard',
  topbar: "The Wizard's Castle",
  sumber: 'WIZARD.BAS · Joseph R. Power · 1980',

  /* Baris 4150 membuka seluruh lantai; port ini menyalakan kabutnya sebagai
     bawaan dan menyatakan penyimpangannya di docs/wizard.md §2a. */
  kabutBawaan: true,

  judul: '* * * THE WIZARD\'S CASTLE * * *',
  cerita: [
    "MANY CYCLES AGO, IN THE KINGDOM OF N'DIC, THE GNOMIC",
    'WIZARD ZOT FORGED HIS GREAT *ORB OF POWER*. HE SOON',
    'VANISHED, LEAVING BEHIND HIS VAST SUBTERRANEAN CASTLE',
    'FILLED WITH ESURIENT MONSTERS, FABULOUS TREASURES, AND',
    'THE INCREDIBLE *ORB OF ZOT*. FROM THAT TIME HENCE, MANY',
    "A BOLD YOUTH HAS VENTURED INTO THE WIZARD'S CASTLE. AS",
    'OF NOW, *NONE* HAS EVER EMERGED VICTORIOUSLY! BEWARE!!'],

  /* DATA 9470-9550: 34 pasang C$/I$. Nama monsternya Tolkien dan umum;
     Belew menggantinya dengan monster TSR empat tahun kemudian. */
  CS: ['',
    'AN EMPTY ROOM', 'THE ENTRANCE', 'STAIRS GOING UP', 'STAIRS GOING DOWN',
    'A POOL', 'A CHEST', 'GOLD PIECES', 'FLARES', 'A WARP', 'A SINKHOLE',
    'A CRYSTAL ORB', 'A BOOK', 'A KOBOLD', 'AN ORC', 'A WOLF', 'A GOBLIN',
    'AN OGRE', 'A TROLL', 'A BEAR', 'A MINOTAUR', 'A GARGOYLE', 'A CHIMERA',
    'A BALROG', 'A DRAGON', 'A VENDOR', 'THE RUBY RED', 'THE NORN STONE',
    'THE PALE PEARL', 'THE OPAL EYE', 'THE GREEN GEM', 'THE BLUE FLAME',
    'THE PALANTIR', 'THE SILMARIL', 'X'],

  /* DATA 9550-9570: W$ memuat DUA tabel (senjata 1..4, baju zirah 5..8) dan
     E$ — lelucon makanan — ikut terbaca di gelung READ yang sama. */
  WS: ['', 'NO WEAPON', 'DAGGER', 'MACE', 'SWORD',
       'NO ARMOR', 'LEATHER', 'CHAINMAIL', 'PLATE'],
  ES: ['', ' SANDWICH', ' STEW', ' SOUP', ' BURGER',
       ' ROAST', ' FILET', ' TACO', ' PIE'],
  RS: ['', 'HOBBIT', 'ELF', 'MAN', 'DWARF']          /* DATA 9580 */
});
