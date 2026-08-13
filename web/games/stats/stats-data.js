/* stats-data.js — dari DATA 3010–3120 STATS.BAS, apa adanya.
   Baris 2870-2910 membacanya dua LAPIS:
     lapis 0 = 3010(23) + 3020(28) + 3030(28) + 3040(5)  = 84 angka
     lapis 1 = 3050(23) + 3060(28) + 3070(33)            = 84 angka
   Baris 1630/1650/1670 hanya pernah menyebut D(k, W, 0). Lapis 1 mati. */
window.RETRO = window.RETRO || {};
window.RETRO.STATS = {
  /* lapis 0 — yang dipakai */
  K0: [
    [2,3,4.5,6,7.5,7.5,7.5,6,4.5,3,2,0,1,2,3,4,5,5,5,4,3,2,0],
    [2,2,3,4.5,4.5,6,7.5,7.5,7.5,6,4.5,4.5,3,2,0,1,2,3,3,4,5,5,5,4,3,2,1,0],
    [2,2,3,3,4.5,4.5,6,7.5,7.5,7.5,6,4.5,4.5,3,3,2,0,1,2,2,3,3,4,5,5,5,4,3,
     3,4,4,1,0]
  ],
  /* lapis 1 — dibaca ke memori, tidak pernah disebut lagi */
  K1: [
    [1,2,2,2,3,3,3,2,2,2,1,0,1,2,2,2,3,3,3,2,2,2,0],
    [1,1,2,2,2,2,3,3,3,2,2,2,2,1,0,1,2,2,2,2,3,3,3,2,2,2,1,0],
    [1,1,2,2,2,2,2,3,3,3,2,2,2,2,2,1,0,1,2,2,2,2,2,3,3,3,2,2,2,2,2,1,0]
  ],
  SIKLUS: [23, 28, 33],
  NAMA: ['Physical (23)', 'Emotional (28)', 'Intellectual (33)'],
  /* DATA 3080 — bobot tiap posisi */
  BOBOT: [5,3,2,2,2,2,1,1,1,1,1,4,2,2,2,2,2,1,1,1,1,3],
  /* DATA 3090–3120 — 22 posisi, 11 serang lalu 11 bertahan */
  POSISI: ['QUARTERBACK','HALFBACK','FULLBACK','WIDE RECIEVER','TIGHT END',
    'SPLIT END','CENTER','R.TACKLE','R.GUARD','L.TACKLE','L.GUARD',
    'M.LINEBACKER','R.LINEBACKER','L.LINEBACKER','LINEBACK/LINE','R.CORNERBACK',
    'L.CORNERBACK','DEF.LINEMAN','DEF.LINEMAN','DEF.LINEMAN','STRONG SAFETY',
    'FREE SAFETY'],
  /* Baris 2950-2980 */
  LABEL: ['crit', 'low', 'avg', 'high']
};
