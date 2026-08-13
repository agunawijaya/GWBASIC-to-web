/* ===========================================================================
   gauss.js — eliminasi Gauss dengan pivot parsial, dipakai bersama.

   Modul ini lahir dari temuan, bukan dari perencanaan. Bandingkan sendiri:

       SIMEQN.BAS baris 390-590
       CURVE.BAS  baris 780-980

   Dua puluh satu baris yang SAMA PERSIS, kata demi kata, hanya berbeda nomor
   barisnya. Phil Feldman dan Tom Rugg menulis satu penyelesai persamaan
   linear, lalu menyalinnya ke program kedua — karena BASIC 1982 tidak punya
   satu pun cara berbagi kode antarprogram. Tidak ada `INCLUDE`, tidak ada
   pustaka, tidak ada modul. Yang ada cuma `CHAIN`, dan itu mengganti seluruh
   program, bukan menambahkan bagian.

   Jadi berkas ini adalah hal yang mereka tidak bisa tulis. Isinya sama;
   yang berbeda cuma bahwa ia ada SEKALI.

   ------------------------------------------------------------------------
   ALGORITMANYA, DIPERTAHANKAN LANGKAH DEMI LANGKAH

   1. PIVOT PARSIAL (baris 410-480). Untuk tiap kolom, cari baris dengan
      |A(baris,kolom)| terbesar di bawahnya, lalu tukar. Tanpa ini, elemen
      diagonal bisa nol dan pembagian di langkah berikutnya meledak.

          430 Q=ABS(A(M,K))-ABS(A(L,K))
          440 IF Q>0 THEN L=M

      `SWAP` di baris 470-480 bukan hiasan: ia bagian dari algoritmanya, dan
      BASIC kebetulan punya kata untuk itu.

   2. ELIMINASI MAJU (baris 490-550). Kurangi tiap baris di bawah dengan
      kelipatan baris pivot sampai kolomnya nol.

   3. SUBSTITUSI MUNDUR (baris 560-590). Dari baris terakhir naik ke atas.

   ------------------------------------------------------------------------
   SATU HAL YANG ASLINYA TIDAK PUNYA: PEMERIKSAAN SINGULAR

       500 Q=A(M,K)/A(K,K)

   Tidak ada satu pun baris yang memeriksa apakah `A(K,K)` nol. Pivot parsial
   memilih yang TERBESAR, tapi kalau seluruh kolomnya nol — sistem yang
   singular, misalnya dua persamaan yang sebenarnya sama — yang terbesar pun
   nol, dan pembagian itu menghasilkan tak hingga yang menjalar diam-diam ke
   seluruh jawaban.

   Di GW-BASIC hasilnya "Division by zero" dan program berhenti; di
   JavaScript hasilnya `Infinity` dan `NaN` yang tampak seperti jawaban.
   Karena itu pemeriksaannya DITAMBAHKAN di sini, dan ditandai jelas sebagai
   tambahan.
   =========================================================================== */

(function (global) {
  'use strict';

  /**
   * Selesaikan A·v = r.
   * @param {number[][]} A0 matriks n×n (disalin, tidak diubah)
   * @param {number[]}   r0 ruas kanan
   * @returns {{v:number[]|null, tukar:number[][], langkah:string[], singular:boolean}}
   */
  function solve(A0, r0) {
    const n = r0.length;
    const A = A0.map(baris => baris.slice());
    const r = r0.slice();
    const v = new Array(n).fill(0);
    const tukar = [];
    const langkah = [];

    if (n === 1) {                                   // baris 390-400
      if (A[0][0] === 0) return { v: null, tukar, langkah, singular: true };
      v[0] = r[0] / A[0][0];
      return { v, tukar, langkah, singular: false };
    }

    for (let k = 0; k < n - 1; k++) {
      /* 1. Pivot parsial — baris 410-480 */
      let l = k;
      for (let m = k + 1; m < n; m++) {
        if (Math.abs(A[m][k]) - Math.abs(A[l][k]) > 0) l = m;
      }
      if (l !== k) {
        for (let j = k; j < n; j++) {
          const t = A[k][j]; A[k][j] = A[l][j]; A[l][j] = t;   // baris 470
        }
        const t = r[k]; r[k] = r[l]; r[l] = t;                 // baris 480
        tukar.push([k + 1, l + 1]);
        langkah.push('Tukar baris ' + (k + 1) + ' dan ' + (l + 1) +
                     ' — pivot terbesar ada di sana.');
      }

      /* TAMBAHAN: aslinya tidak memeriksa ini. Lihat komentar kepala. */
      if (A[k][k] === 0) return { v: null, tukar, langkah, singular: true };

      /* 2. Eliminasi maju — baris 490-550 */
      for (let m = k + 1; m < n; m++) {
        const q = A[m][k] / A[k][k];
        A[m][k] = 0;
        for (let j = k + 1; j < n; j++) A[m][j] -= q * A[k][j];
        r[m] -= q * r[k];
      }
      langkah.push('Kolom ' + (k + 1) + ' dinolkan di bawah diagonal.');
    }

    if (A[n - 1][n - 1] === 0) return { v: null, tukar, langkah, singular: true };

    /* 3. Substitusi mundur — baris 560-590.

       Aslinya menaruh penugasan V(M) DI DALAM perulangan J:

           580 Q=0:FOR J=M+1 TO N:Q=Q+A(M,J)*V(J)
           590 V(M)=(R(M)-Q)/A(M,M):NEXT:NEXT:RETURN

       Dua `NEXT` berturut di baris 590 menutup keduanya, jadi V(M) ditulis
       ulang tiap putaran J. Hasil akhirnya benar — penulisan terakhir memakai
       Q yang lengkap — tapi ia dikerjakan N−M kali, dan pembaca harus
       menghitung sendiri untuk yakin. Di sini penugasannya di luar. */
    v[n - 1] = r[n - 1] / A[n - 1][n - 1];
    for (let m = n - 2; m >= 0; m--) {
      let q = 0;
      for (let j = m + 1; j < n; j++) q += A[m][j] * v[j];
      v[m] = (r[m] - q) / A[m][m];
    }
    langkah.push('Substitusi mundur dari baris ' + n + ' ke atas.');
    return { v, tukar, langkah, singular: false };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.gauss = { solve };
})(window);
