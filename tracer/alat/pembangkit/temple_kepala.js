/* ===========================================================================
   TEMPLE.js — porting minimalis TEMPLE.BAS sebagai tabel baris.

       520 PRINT"                               by John Belew
       530 PRINT"                            (Nurruc the Chaotic)
       550 PRINT"                         of the Apple Eliminators"
       480 PRINT"                                 VERSION 4.2
       490 PRINT "                                July 25, 1984

   Program terpanjang di koleksi ini — 1.187 baris — dan yang paling banyak
   riwayatnya. Baris 750 menyebutkan asalnya sendiri:

       740 REM    *        THANKS TO TSR FOR THE MONSTERS            *
       750 REM    * THANKS TO RECREATIONAL COMPUTING FOR THE ORIGINAL*
       760 REM    * PROGRAM          JUNE 29, 1984                   *

   RECREATIONAL COMPUTING adalah majalah yang memuat WIZARD.BAS di edisi
   Juli/Agustus 1980 — dan warisannya bisa dibaca langsung dari lima baris di
   bagian atas:

       810 DEF FNA(Q)=1+INT(RND(1)*Q)
       820 DEF FNB(Q)=Q+8*((Q=9)-(Q=0))
       830 DEF FNC(Q)=-Q*(Q<19)-18*(Q>18)
       840 DEF FND(Q)=64*(Q-1)+8*(X-1)+Y
       850 DEF FNE(Q)=Q+100*(Q>99)

   Kelimanya sama bentuknya dengan WIZARD.BAS baris 240-280. `FND` memetakan
   tiga koordinat ke satu larik 512 ruang; `FNB` membungkus koordinat sehingga
   kastilnya berbentuk donat; `FNE` mencopot penanda "+100 = belum dilihat".
   Empat tahun, dua penulis, satu kerangka.

   YANG PALING LAYAK DILIHAT: SELURUH GEOMETRINYA ADA DI LIMA BARIS ITU, DAN
   SELURUH LOGIKANYA DI PERBANDINGAN YANG DIPAKAI SEBAGAI ANGKA.

       3090 C(Q,4)=-(C(Q,1)=X)*(C(Q,2)=Y)*(C(Q,3)=Z)
       4310 X=X+(O$="N")-(O$="S")
       2520 AV=-3*(O$="P")-2*(O$="C")-(O$="L")
       5280 ON (1-(ST<1)) GOTO 2880,9120

   Empat baris, empat pemakaian yang berbeda dari kenyataan yang sama: di
   BASIC, perbandingan yang benar bernilai −1. Yang pertama mengalikan tiga
   perbandingan untuk menjawab "apakah pemain ada di ruang kutukan ini";
   yang kedua menjadikannya arah gerak; yang ketiga menjadikannya harga
   zirah; yang keempat menjadikannya INDEKS untuk memilih antara hidup dan
   mati.

   YANG KEDUA: SKORNYA BERNAMA JOHN.

       6450 JOHN!=IQ*100+ST*100+DX*100+KM!+FTRS+REQ+GP!-T*5
      12100 IF JOHN! > 142498 THEN PRINT " Don't forget to replace my score on Tem-Ins.Bas

   Variabel skornya diberi nama penulisnya sendiri, dan baris terakhir program
   ini meminta siapa pun yang mengalahkan 142.498 untuk menyunting berkas yang
   LAIN. Angka itu ada di TEM-INS.BAS, di disket yang sama.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` dan `SOUND` diam.
   - `RANDOMIZE` dari jam diganti benih tetap.
   - `LPRINT` (baris 11100-11330) dicetak ke layar, bukan ke pencetak.
   - `CHAIN"TEM-INS.BAS",10` di baris 11570 tidak bisa dijalankan — tapi
     berkasnya ADA di koleksi ini dan sudah diport tersendiri.
   - `SYSTEM` di baris 11040 menghentikan penelusuran.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }
  function bas(n) {
    if (n === undefined || n === null) n = 0;
    if (typeof n === 'string') return n;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }

  /* --- lima fungsi satu baris, baris 810-850 -------------------------------
     Ditulis sekali di sini karena `DEF FN` di BASIC memang sebuah definisi,
     bukan pernyataan yang dijalankan berulang. Barisnya sendiri tetap ada di
     tabel sebagai penanda. */

  /* FNA: satu lemparan dadu Q sisi. Dipakai lima puluh dua kali. */
  function FNA(m, Q) { return 1 + Math.floor(m.acak() * Q); }

  /* FNB: MEMBUNGKUS koordinat. Nol jadi delapan, sembilan jadi satu — jadi
     keluar dari sisi barat berarti masuk dari sisi timur. Bentuk kastilnya
     donat, dan seluruh bentuk itu ada di satu baris. */
  function FNB(m, Q) { return Q + 8 * ((Q === 9 ? -1 : 0) - (Q === 0 ? -1 : 0)); }

  /* FNC: batas atas 18 untuk sifat pemain, tanpa satu pun IF. */
  function FNC(m, Q) { return -Q * (Q < 19 ? -1 : 0) - 18 * (Q > 18 ? -1 : 0); }

  /* FND: tiga koordinat jadi satu indeks. Lantai Q, baris X, kolom Y —
     dan X dan Y diambil dari variabel global, bukan dari argumennya. Fungsi
     yang membaca keadaan di luar dirinya. */
  function FND(m, Q) {
    return 64 * (Q - 1) + 8 * ((m.v.X || 0) - 1) + (m.v.Y || 0);
  }

  /* FNE: mencopot penanda "belum dilihat". Isi ruang disimpan sebagai nomor,
     dan nomor yang ditambah 100 berarti pemain belum pernah melihatnya.
     `Q>99` bernilai −1, jadi `Q+100*(-1)` mengurangi seratus. */
  function FNE(m, Q) { return Q + 100 * (Q > 99 ? -1 : 0); }

