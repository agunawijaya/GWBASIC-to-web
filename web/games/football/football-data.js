/* football-data.js — dari DATA baris 3020 dan 3030 FOOTBALL.BAS
   Diambil apa adanya. Baris 590 membacanya dengan
       FOR I=1 TO 10: FOR J=1 TO 5: READ YRD(I,J)
   jadi 50 angka pertama mengisi baris 1..10 kolom 1..5. */
window.RETRO = window.RETRO || {};
window.RETRO.FOOTBALL = {
  /* DATA 3020 — satu-satunya yang pernah dibaca */
  DATA1: [0,2,14,10,0, 2,98,0,8,40, 8,4,8,4,99, -2,-4,0,99,0, 6,10,0,6,50,
          0,6,12,0,0, 4,-2,-8,18,0, 0,16,-2,0,99, 14,30,6,0,0, 2,0,4,2,0],
  /* DATA 3030 — TIDAK PERNAH DIBACA. Bedanya dengan 3020 hanya satu angka. */
  DATA2: [0,2,14,10,0, 2,98,6,8,40, 8,4,8,4,99, -2,-4,0,99,0, 6,10,0,6,50,
          0,6,12,0,0, 4,-2,-8,18,0, 0,16,-2,0,99, 14,30,6,0,0, 2,0,4,2,0],

  SERANG: ['Line Plunge', 'End Run', 'Screen Pass', 'Short Pass', 'Long Bomb',
           'Field Goal', 'Punt'],
  BERTAHAN: ['Goal Line', 'Short Run', 'Long Run', 'Short Pass', 'Long Pass'],

  /* Kode khusus di dalam tabel. Artinya BERTUKAR menurut siapa yang pegang
     bola: 99 = "I Intercepted" kalau Anda menyerang, "You Intercepted"
     kalau Anda bertahan. Satu tabel, dua bacaan. */
  KODE: { 98: 'fumble', 99: 'intersep', 100: 'touchdown' }
};
