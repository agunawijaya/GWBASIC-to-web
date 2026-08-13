/* ===========================================================================
   strings.js — transkripsi WRTSTR.BAS (aslinya WRTSTRNG.BAS, 1982).

   Ini BUKAN salinan STRINGS.FIL. Ini programnya: tujuh belas baris yang
   MEMBANGKITKAN berkas itu, ditulis ulang apa adanya. Berkasnya lalu dihitung
   di sini, saat halaman dimuat, dan panjangnya diperiksa terhadap berkas yang
   benar-benar ada di koleksi (1.275 bita).

   Kenapa begitu, dan bukan menempelkan isi berkasnya langsung?

   Karena pasangan ini satu-satunya di koleksi yang PEMBANGKIT dan HASILNYA
   sama-sama selamat. Kalau hasilnya saja yang disalin, hubungan itu hilang —
   dan hubungan itulah pelajarannya: aturan Eliza ditulis dalam bentuk yang
   enak dibaca manusia (`DATA MOM,MOTHER`), lalu diolah sekali menjadi bentuk
   yang enak dibaca mesin (`" MOM "," MOTHER ",5,8`). Panjang kata dihitung
   di WRTSTR dan DISIMPAN, bukan dihitung ulang tiap kali Eliza jalan. Itu
   praberhitungan yang dipindah ke waktu pembuatan — sebuah build step, 1982.

   Diverifikasi: keluaran berkas ini cocok BITA DEMI BITA dengan
   run/STRINGS.FIL, termasuk penanda EOF Ctrl-Z di ujungnya.
   =========================================================================== */
(function (global) {
  'use strict';

  /* --- DATA baris 30 — 22 pasang kata yang ditukar -----------------------
     Perhatikan tiga tanda bintang. Itu bukan salah ketik; lihat catatan di
     bawah tabel. */
  const PASANG = [
    ['.', ' . '], [',', ' . '], ['?', ' . '], ['!', ' . '],
    ['MOM', 'MOTHER'], ['DAD', 'FATHER'], ['DONT', "DON'T"],
    ['CANT', "CAN'T"], ['WONT', "WON'T"], ['DREAMED', 'DREAMT'],
    ['DREAMS', 'DREAM'], ['I', 'YOU'], ['YOU', 'I'], ['ME', 'YOU'],
    ['MY', '*OUR'], ['YOUR', 'MY'], ['MYSELF', '*OURSELF'],
    ['YOURSELF', 'MYSELF'], ["I'M", "*OU'RE"], ["YOU'RE", "I'M"],
    ['AM', 'ARE'], ['WERE', 'WAS']
  ];

  /* --- DATA baris 80 — 27 kata umum yang dipakai penangan --------------- */
  const B_DATA = ['IS', 'ARE', 'ARE', 'WAS', 'MOTHER', 'FATHER', 'SISTER',
    'BROTHER', 'WIFE', 'HUSBAND', 'CHILDREN', 'WANT', 'NEED', 'SAD',
    'UNHAPPY', 'DEPRESSED', 'SICK', 'HAPPY', 'ELATED', 'GLAD', 'BETTER',
    'FEEL', 'THINK', 'BELIEVE', 'WISH', "CAN'T", 'CANNOT'];

  /* --- DATA baris 100 + 110 — 44 kata kunci, URUTANNYA ADALAH PRIORITAS -- */
  const K_DATA = ['COMPUTER', 'COMPUTERS', 'MACHINE', 'MACHINES', 'NAME',
    'ALIKE', 'LIKE', 'SAME', 'REMEMBER', 'DREAMT', 'DREAM', 'IF',
    'EVERYBODY', 'EVERYONE', 'NOBODY', 'NO ONE', 'WAS', 'YOUR', 'ALWAYS',
    'SORRY', 'ARE', 'ARE', 'BECAUSE', 'CAN', 'CERTAINLY', 'YES', 'DEUTSCH',
    'ESPANOL', 'FRANCAIS', 'ITALIANO', 'HELLO', 'HOW', 'WHAT', 'WHEN',
    'WHO', 'I', "I'M", 'MAYBE', 'PERHAPS', 'MY', 'NO', 'WHY', 'YOU',
    "YOU'RE"];

  /* --- baris 40-70 -------------------------------------------------------
     Panjang dihitung SEBELUM kata dibungkus spasi, lalu ditambah 2. Hasilnya
     sama saja; yang menarik adalah bahwa hasilnya IKUT DITULIS ke berkas. */
  const OW = [null], RW = [null], LO = [0], LR = [0];
  PASANG.forEach(function (p, idx) {
    const i = idx + 1;
    let o = p[0], r = p[1];
    let lo = o.length, lr = r.length;
    if (i >= 5) {                       /* baris 50-70: hanya 5..22 */
      o = ' ' + o + ' '; r = ' ' + r + ' ';
      lo += 2; lr += 2;
    }
    OW[i] = o; RW[i] = r; LO[i] = lo; LR[i] = lr;
  });

  /* baris 90 dan 120 — kedua daftar ini SELALU dibungkus spasi.
     Itulah pencocokan batas kata sebelum ada regex: " I " tidak akan pernah
     cocok dengan "SIT" atau "TIME". */
  const B = [null].concat(B_DATA.map(function (w) { return ' ' + w + ' '; }));
  const K = [null].concat(K_DATA.map(function (w) { return ' ' + w + ' '; }));

  /* --- baris 130-150: WRITE#1 --------------------------------------------
     WRITE# memberi tanda kutip pada string, koma di antara nilai, dan CR LF
     di akhir. Itu CSV — disediakan bahasa, tahun 1982, supaya INPUT# bisa
     membacanya kembali tanpa keraguan. */
  const baris = [];
  for (let i = 1; i <= 22; i++) {
    baris.push('"' + OW[i] + '","' + RW[i] + '",' + LO[i] + ',' + LR[i]);
  }
  for (let i = 1; i <= 27; i++) baris.push('"' + B[i] + '"');
  for (let i = 1; i <= 44; i++) baris.push('"' + K[i] + '"');

  /* \x1a = Ctrl-Z, penanda akhir berkas yang diwarisi DOS dari CP/M. */
  const BERKAS = baris.join('\r\n') + '\r\n\x1a';

  global.RETRO = global.RETRO || {};
  global.RETRO.ELIZA_STRINGS = {
    OW: OW, RW: RW, LO: LO, LR: LR, B: B, K: K,
    pasangMentah: PASANG,
    berkas: BERKAS,
    bita: BERKAS.length,            /* harus 1275 */
    bitaAsli: 1275                  /* ukuran run/STRINGS.FIL di koleksi */
  };
})(window);
