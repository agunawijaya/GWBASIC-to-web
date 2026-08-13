/* ===========================================================================
   golf-data.js -- diambil langsung dari DATA baris 1860-2190 run/GOLF.BAS
   oleh skrip; jangan disunting tangan.

   DATA-nya SATU ALIRAN 54 lubang; baris 1290 memilih lapangan dengan
   melewati (C-1)*126 angka, yaitu 18 lubang x 7 medan. Jadi ketiga
   lapangan itu sebenarnya satu daftar panjang yang dipotong tiga.

   Tiap lubang: PAR, YARDS, LEFT, RIGHT, DIFF, LNG, FAC (baris 1740).
   LEFT/RIGHT menunjuk ke MEDAN[] -- indeks 6 dan 7 (danau, out of bounds)
   yang membuat baris 1390 menjatuhkan pukulan penalti.
   =========================================================================== */
window.RETRO = window.RETRO || {};
RETRO.GOLF = {
  MEDAN: ['Fairway', 'Deep Rough', 'Trees', 'Adjacent Fairway', 'Sand Trap', 'A Big Lake', 'Out Of Bounds'],
  LAPANGAN: [
    { nama: 'Amateur Green Grass Country Club', rating: 65, lubang: [
      { par: 5, yard: 501, kiri: 2, kanan: 3, diff: 60, lng: 6, fac: 3 },
      { par: 3, yard: 165, kiri: 2, kanan: 6, diff: 60, lng: 6, fac: 1 },
      { par: 5, yard: 475, kiri: 3, kanan: 3, diff: 50, lng: 7, fac: 3 },
      { par: 4, yard: 289, kiri: 3, kanan: 3, diff: 35, lng: 8, fac: 2 },
      { par: 4, yard: 340, kiri: 7, kanan: 2, diff: 80, lng: 6, fac: 2 },
      { par: 4, yard: 365, kiri: 7, kanan: 6, diff: 80, lng: 4, fac: 2 },
      { par: 3, yard: 185, kiri: 7, kanan: 2, diff: 80, lng: 4, fac: 1 },
      { par: 4, yard: 330, kiri: 7, kanan: 2, diff: 80, lng: 6, fac: 2 },
      { par: 4, yard: 412, kiri: 7, kanan: 2, diff: 80, lng: 2, fac: 2 },
      { par: 4, yard: 440, kiri: 7, kanan: 3, diff: 80, lng: 8, fac: 3 },
      { par: 4, yard: 420, kiri: 7, kanan: 4, diff: 80, lng: 9, fac: 3 },
      { par: 3, yard: 145, kiri: 2, kanan: 6, diff: 85, lng: 8, fac: 1 },
      { par: 5, yard: 535, kiri: 7, kanan: 2, diff: 80, lng: 5, fac: 3 },
      { par: 4, yard: 340, kiri: 3, kanan: 3, diff: 45, lng: 5, fac: 2 },
      { par: 4, yard: 380, kiri: 6, kanan: 6, diff: 85, lng: 4, fac: 2 },
      { par: 3, yard: 165, kiri: 3, kanan: 3, diff: 34, lng: 6, fac: 1 },
      { par: 4, yard: 410, kiri: 7, kanan: 2, diff: 85, lng: 2, fac: 2 },
      { par: 5, yard: 450, kiri: 3, kanan: 3, diff: 45, lng: 8, fac: 3 },
    ] },
    { nama: 'Down Hill Country Club', rating: 69, lubang: [
      { par: 4, yard: 412, kiri: 6, kanan: 6, diff: 80, lng: 2, fac: 2 },
      { par: 4, yard: 446, kiri: 3, kanan: 3, diff: 25, lng: 8, fac: 2 },
      { par: 5, yard: 630, kiri: 3, kanan: 3, diff: 35, lng: 2, fac: 3 },
      { par: 3, yard: 210, kiri: 6, kanan: 6, diff: 75, lng: 2, fac: 1 },
      { par: 4, yard: 315, kiri: 3, kanan: 1, diff: 40, lng: 7, fac: 2 },
      { par: 4, yard: 454, kiri: 3, kanan: 6, diff: 85, lng: 7, fac: 3 },
      { par: 3, yard: 154, kiri: 6, kanan: 6, diff: 85, lng: 7, fac: 1 },
      { par: 5, yard: 625, kiri: 3, kanan: 6, diff: 85, lng: 2, fac: 3 },
      { par: 4, yard: 444, kiri: 3, kanan: 3, diff: 25, lng: 8, fac: 3 },
      { par: 3, yard: 215, kiri: 1, kanan: 7, diff: 85, lng: 12, fac: 2 },
      { par: 5, yard: 556, kiri: 2, kanan: 2, diff: 30, lng: 4, fac: 3 },
      { par: 4, yard: 413, kiri: 3, kanan: 6, diff: 85, lng: 2, fac: 2 },
      { par: 4, yard: 450, kiri: 4, kanan: 4, diff: 25, lng: 8, fac: 3 },
      { par: 4, yard: 465, kiri: 3, kanan: 7, diff: 85, lng: 7, fac: 3 },
      { par: 5, yard: 630, kiri: 2, kanan: 2, diff: 15, lng: 2, fac: 3 },
      { par: 3, yard: 147, kiri: 6, kanan: 6, diff: 85, lng: 8, fac: 1 },
      { par: 4, yard: 432, kiri: 2, kanan: 3, diff: 35, lng: 8, fac: 3 },
      { par: 4, yard: 472, kiri: 7, kanan: 6, diff: 85, lng: 7, fac: 3 },
    ] },
    { nama: 'Swamp Grass USA', rating: 72, lubang: [
      { par: 5, yard: 628, kiri: 3, kanan: 3, diff: 10, lng: 2, fac: 3 },
      { par: 3, yard: 235, kiri: 6, kanan: 6, diff: 75, lng: 10, fac: 2 },
      { par: 4, yard: 531, kiri: 3, kanan: 6, diff: 65, lng: 5, fac: 3 },
      { par: 4, yard: 465, kiri: 2, kanan: 7, diff: 65, lng: 7, fac: 3 },
      { par: 4, yard: 543, kiri: 6, kanan: 2, diff: 60, lng: 4, fac: 3 },
      { par: 3, yard: 312, kiri: 6, kanan: 6, diff: 85, lng: 7, fac: 2 },
      { par: 5, yard: 622, kiri: 2, kanan: 3, diff: 25, lng: 2, fac: 3 },
      { par: 4, yard: 476, kiri: 2, kanan: 2, diff: 35, lng: 7, fac: 3 },
      { par: 4, yard: 465, kiri: 3, kanan: 2, diff: 40, lng: 7, fac: 3 },
      { par: 3, yard: 197, kiri: 6, kanan: 3, diff: 75, lng: 3, fac: 1 },
      { par: 4, yard: 345, kiri: 6, kanan: 2, diff: 70, lng: 5, fac: 2 },
      { par: 5, yard: 623, kiri: 3, kanan: 2, diff: 30, lng: 2, fac: 3 },
      { par: 4, yard: 456, kiri: 2, kanan: 3, diff: 35, lng: 7, fac: 3 },
      { par: 4, yard: 398, kiri: 3, kanan: 3, diff: 35, lng: 3, fac: 2 },
      { par: 3, yard: 300, kiri: 6, kanan: 7, diff: 75, lng: 8, fac: 2 },
      { par: 5, yard: 621, kiri: 2, kanan: 3, diff: 45, lng: 2, fac: 3 },
      { par: 4, yard: 467, kiri: 3, kanan: 3, diff: 44, lng: 7, fac: 3 },
      { par: 4, yard: 489, kiri: 2, kanan: 2, diff: 32, lng: 6, fac: 3 },
    ] },
  ]
};
