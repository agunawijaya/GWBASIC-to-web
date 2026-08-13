/* ===========================================================================
   words.js — 101 kata rahasia HANGMAN.

   Disalin PERSIS dari baris DATA 1290–1310 di run/HANGMAN.BAS, tanpa
   penambahan, pengurangan, atau perubahan ejaan. Termasuk "QUE" yang
   kemungkinan besar salah ketik dari "CUE" — dibiarkan apa adanya, karena
   memperbaikinya berarti mengubah isi permainan.

   Aslinya dimuat dengan:
       150 DIM WORD(100)
       170 FOR B=0 TO 100
       180     READ WORD(B)
       190 NEXT

   `FOR B=0 TO 100` membaca 101 kata, dan memang tersedia persis 101. Kalau
   kurang satu saja, GW-BASIC mati dengan galat "Out of DATA" — tidak ada
   pemeriksaan, tidak ada peringatan.

   Kenapa berkas .js dan bukan .json: halaman ini harus jalan dari file://,
   dan di sana fetch() diblokir. Lihat docs/_fondasi.md bagian 6.
   =========================================================================== */
window.RETRO = window.RETRO || {};
window.RETRO.HANGMAN_WORDS = [
  "BUG", "PRINTER", "GAME", "ELBOW", "PIZZA", "BUDGET", "CRY", "THING",
  "FEIGN", "CARD", "TALK", "EXAMPLE", "TENSION", "CALCULATOR", "SHOE",
  "TABLE", "STEREO", "BICYCLE", "GUESS", "BLENDER", "FAULT", "DIRTY",
  "LOUDSPEAKER", "CHICKEN", "DANGEROUS", "DIFFERENT", "SCIENTIST", "KIDNEY",
  "SELF", "MAHOGANY", "UGLY", "FRIENDLYWARE", "PROGRAM", "OPERA", "MUSIC",
  "REPLICA", "COMPUTER", "BABOON", "CHIMPANZEE", "CHAIR", "HORSE", "FELLOW",
  "AUTOMOBILE", "KIDNAP", "LAMP", "LIGHT", "FREEZER", "FRY", "SKATE",
  "ERRONEOUSLY", "SEQUENCE", "AFTER", "HIGHWAY", "POLICE", "ART", "CRIED",
  "FLY", "AIRPLANE", "SAILBOAT", "HOUSE", "DRIVEWAY", "FENCE", "HOTEL",
  "MOTEL", "SWIM", "OCEAN", "LAKE", "DRIVE", "ICE", "SNOW", "CATCH", "FALL",
  "WALL", "FLOOR", "ESCAPE", "QUE", "CHECK", "FILE", "JUMP", "CEMENT",
  "ASPHALT", "BRICK", "MAILBOX", "TRUCK", "THUNDER", "LIGHTNING", "RAIN",
  "ADVENTURE", "BUS", "TOWER", "SKYSCRAPER", "LAWN", "ELEPHANT", "CIRCUS",
  "SCARY", "KILLED", "BABY", "PUPPIES", "CHURCH", "STORE", "STREET"
];
