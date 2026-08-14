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

  T({ baris: 10, jalan: function () { /* KEY OFF */ } });
  /* 15 VAL(MID$(TIME$,7,2)) — detik dari jam. */
  T({ baris: 15, jalan: function (m) { m.v.N = 0; } });
  T({ baris: 20, jalan: function () { /* RANDOMIZE N */ } });
  T({ baris: 30, jalan: function (m) { m.masukan("ANS$", "Do you want graphics (Y/N)"); } });
  T({ baris: 40, jalan: function (m) { if ((m.v["ANS$"] || '') === "y") m.lompat(70); } });
  T({ baris: 50, jalan: function (m) { if ((m.v["ANS$"] || '') === "Y") m.lompat(70); } });
  T({ baris: 55, jalan: function (m) { if ((m.v["ANS$"] || '') === "ARIOCH") m.lompat(700); } });
  T({ baris: 60, jalan: function (m) { m.lompat(350); } });
  T({ baris: 70, jalan: function (m) { m.layar(1); m.cls(); } });
  T({ baris: 80, jalan: function (m) { m.lingkaran(20, 20, 20); } });
  T({ baris: 90, jalan: function (m) { m.cat(30, 30, 2, 3); } });
  T({ baris: 100, jalan: function (m) { m.lingkaran(240, 30, 15); } });
  T({ baris: 110, jalan: function (m) { m.cat(240, 30, 1, 3); } });
  T({ baris: 120, jalan: function (m) { m.pset(60, 125); } });
  T({ baris: 130, jalan: function (m) { m.gambar('e100;f100;l199'); } });
  /* 140 Koordinat x=360 di layar selebar 320. GW-BASIC memotongnya; yang tergambar
     cuma bagian yang muat. Dua baris berturut-turut melakukannya, dan yang
     kedua (baris 160) menimpanya dengan warna lain. */
  T({ baris: 140, jalan: function (m) { m.garis(360, 125, 0, 360, null, 'BF'); } });
  T({ baris: 150, jalan: function (m) { m.cat(100, 100, 3); } });
  T({ baris: 160, jalan: function (m) { m.garis(360, 125, 0, 360, 1, 'BF'); } });
  T({ baris: 170, jalan: function (m) { m.locate(16, 19); } });
  T({ baris: 180, jalan: function (m) { m.cetak("   "); m.barisBaru(); } });
  T({ baris: 190, jalan: function (m) { m.untuk('J', 1, 200, 1); } });
  T({ baris: 200, jalan: function (m) { m.v['I'] = ( m.acak() * 360 ); } });
  T({ baris: 210, jalan: function (m) { m.v['F'] = ( m.acak() * 120 ); } });
  T({ baris: 220, jalan: function (m) { m.untuk('R', 1, 0, -1); } });
  /* 230 Dua ratus bintang, masing-masing digambar sebagai lingkaran berjari-jari 1
     lalu 0 — gelung `FOR R=1 TO 0 STEP -1` di baris 220. */
  T({ baris: 230, jalan: function (m) { m.lingkaran(m.v.I, m.v.F, m.v.R, 3); } });
  T({ baris: 240, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 250, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 260, jalan: function (m) { m.locate(22, 11); } });
  T({ baris: 270, jalan: function (m) { m.cetak("THE TEMPLE OF LOTH"); m.barisBaru(); } });
  T({ baris: 280, jalan: function (m) { m.locate(22, 11); } });
  T({ baris: 290, jalan: function () { /* BEEP */ } });
  T({ baris: 300, jalan: function (m) { m.untuk('X', 200, 0, -4); } });
  /* 310 Aspek 1 membuatnya BUKAN lingkaran: piksel SCREEN 1 tidak persegi, jadi
     aspek 1 menghasilkan elips gepeng. Lima puluh satu di antaranya, mengecil
     dari 200 ke 0 — terowongan yang menutup. */
  T({ baris: 310, jalan: function (m) { m.lingkaran(160, 100, m.v.X, null, null, null, 1); } });
  T({ baris: 320, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 330, jalan: function (m) { m.layar(2); } });
  T({ baris: 340, jalan: function (m) { m.layar(0); } });
  T({ baris: 350, jalan: function (m) { m.cls(); } });
  T({ baris: 360, jalan: function (m) { m.barisBaru(); m.warna(12, 0); } });
  T({ baris: 370, jalan: function (m) { m.cetak("            ▄▄▄▄▄ ▄▄▄▄ ▄   ▄ ▄▄▄▄  ▄    ▄▄▄▄           ▄▄▄   ▄▄▄▄"); m.barisBaru(); } });
  T({ baris: 380, jalan: function (m) { m.cetak("              █   █    ██ ██ █   █ █    █             █   █  █"); m.barisBaru(); } });
  T({ baris: 390, jalan: function (m) { m.cetak("              █   █▀▀  █ █ █ █▀▀▀  █    █▀▀           █   █  █▀▀"); m.barisBaru(); } });
  T({ baris: 400, jalan: function (m) { m.cetak("              █   █▄▄▄ █   █ █     █▄▄▄ █▄▄▄          ▀▄▄▄▀  █"); m.barisBaru(); } });
  T({ baris: 410, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 420, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 430, jalan: function (m) { m.cetak("                  ▄     ▄▄▄  ▄▄▄▄▄  ▄  ▄            ▄▄▄▄▄▄"); m.barisBaru(); } });
  T({ baris: 440, jalan: function (m) { m.cetak("                  █    █   █   █    █  █          ▄▀ █  █ ▀▄"); m.barisBaru(); } });
  T({ baris: 450, jalan: function (m) { m.cetak("                  █    █   █   █    █▀▀█        ▄▀   █  █   ▀▄"); m.barisBaru(); } });
  T({ baris: 460, jalan: function (m) { m.cetak("                  █▄▄▄ ▀▄▄▄▀   █    █  █      ▄█▄▄▄▄▄█▄▄█▄▄▄▄▄█▄"); m.barisBaru(); } });
  T({ baris: 470, jalan: function (m) { m.barisBaru(); m.warna(31, 0); } });
  T({ baris: 480, jalan: function (m) { m.cetak("                                 VERSION 4.2"); m.barisBaru(); } });
  T({ baris: 490, jalan: function (m) { m.warna(3, 0); m.cetak("                                July 25, 1984"); m.barisBaru(); } });
  T({ baris: 500, jalan: function (m) { m.warna(3, 0); m.cetak("              Suggested for use with printer and graphics board"); m.barisBaru(); } });
  T({ baris: 510, jalan: function (m) { m.cetak(""); m.barisBaru(); } });
  T({ baris: 520, jalan: function (m) { m.cetak("                               by John Belew"); m.barisBaru(); } });
  T({ baris: 530, jalan: function (m) { m.cetak("                            (Nurruc the Chaotic)"); m.barisBaru(); } });
  T({ baris: 540, jalan: function (m) { m.barisBaru(); m.warna(10, 0); } });
  T({ baris: 550, jalan: function (m) { m.cetak("                         of the Apple Eliminators"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 560, jalan: function (m) { m.v['SOU'] = Math.floor( m.acak() * 2 + 1 ); } });
  T({ baris: 570, jalan: function (m) { var tj = [580, 600][(m.v["SOU"] || 0) - 1]; if (tj) m.lompat(tj); } });
  T({ baris: 580, jalan: function () { /* PLAY"O1MFT155L2DL4EL2FDL1GG#" */ } });
  T({ baris: 590, jalan: function (m) { m.lompat(650); } });
  T({ baris: 600, jalan: function (m) { m.untuk('QWER', 220, 196, -1); } });
  T({ baris: 610, jalan: function () { /* SOUND QWER,1 */ } });
  T({ baris: 620, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 630, jalan: function () { /* PLAY"O1MLT155L2GP10EP10L1F#" */ } });
  T({ baris: 640, jalan: function (m) { m.lompat(650); } });
  T({ baris: 650, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 660, jalan: function (m) { m.cetak("     Make sure that all commands are done in capitals.  For help type `H'."); m.barisBaru(); } });
  T({ baris: 670, jalan: function (m) { m.masukan("ANS$", "                      Do you want instructions (Y/N)"); } });
  T({ baris: 680, jalan: function (m) { if ((m.v["ANS$"] || '') === "Y") m.lompat(11570); } });
  T({ baris: 690, jalan: function (m) { if ((m.v["ANS$"] || '') === "y") m.lompat(11570); } });
  rem(700);
  rem(710);
  rem(720);
  rem(730);
  rem(740);
  rem(750);
  rem(760);
  rem(770);
  T({ baris: 780, jalan: function () { /* DEFINT A-Z */ } });
  T({ baris: 790, jalan: function (m) { m.dim("C$()", 34); m.dim("I$()", 34); m.dim("R$()", 4); m.dim("W$()", 8); m.dim("E$()", 8); } });
  T({ baris: 800, jalan: function (m) { m.dim("L()", 512); m.dim("C()", 3, 4); m.dim("T()", 8); m.dim("O()", 3); m.dim("R()", 3); } });
  /* 810 Lima `DEF FN` berturut-turut, dan kelimanya menyimpan seluruh aritmetika
     permainan ini. Bentuknya sama persis dengan WIZARD.BAS baris 240-280 —
     program induknya di Recreational Computing, 1980. */
  T({ baris: 810, jalan: function () { /* DEF FNA(Q)=1+INT(RND(1)*Q) — lihat FNA() di atas */ } });
  T({ baris: 820, jalan: function () { /* DEF FNB(Q)=Q+8*((Q=9)-(Q=0)) */ } });
  T({ baris: 830, jalan: function () { /* DEF FNC(Q)=-Q*(Q<19)-18*(Q>18) */ } });
  T({ baris: 840, jalan: function () { /* DEF FND(Q)=64*(Q-1)+8*(X-1)+Y */ } });
  T({ baris: 850, jalan: function () { /* DEF FNE(Q)=Q+100*(Q>99) */ } });
  T({ baris: 860, jalan: function (m) { m.warna(11, 0); m.v["Y$"] = "** Please answer yes or no"; m.warna(3, 0); } });
  T({ baris: 870, jalan: function (m) { m.v['NG'] = 0; } });
  rem(880);
  rem(890);
  rem(900);
  T({ baris: 910, jalan: function (m) { m.v['NG'] = (m.v['NG'] || 0) + 1; } });
  T({ baris: 920, jalan: function (m) { m.v['Q'] = m.acak(); } });
  T({ baris: 930, jalan: function (m) { m.ulangData(0); } });
  T({ baris: 940, jalan: function (m) { m.untuk('Q', 1, 34, 1); } });
  T({ baris: 950, jalan: function (m) { m.v["C$()"][(m.v["Q"] || 0)] = m.baca(); m.v["I$()"][(m.v["Q"] || 0)] = m.baca(); } });
  T({ baris: 960, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 970, jalan: function (m) { m.untuk('Q', 1, 512, 1); } });
  T({ baris: 980, jalan: function (m) { m.v['L()'][ (m.v['Q'] || 0) ] = 101; } });
  T({ baris: 990, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1000, jalan: function (m) { m.untuk('Q', 1, 8, 1); } });
  T({ baris: 1010, jalan: function (m) { m.v["W$()"][(m.v["Q"] || 0)] = m.baca(); m.v["E$()"][(m.v["Q"] || 0)] = m.baca(); } });
  T({ baris: 1020, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1030, jalan: function (m) { m.untuk('Q', 1, 4, 1); } });
  T({ baris: 1040, jalan: function (m) { m.v["R$()"][(m.v["Q"] || 0)] = m.baca(); } });
  T({ baris: 1050, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1060, jalan: function (m) { if ((m.v['NG'] || 0) > 1) m.lompat(1420); } });
  rem(1070);
  rem(1080);
  rem(1090);
  rem(1100);
  T({ baris: 1110, jalan: function (m) { m.cls(); } });
  T({ baris: 1120, jalan: function (m) { m.cetak("       ╔═════════════════════════════════════════════════════════════════╗"); m.barisBaru(); } });
  T({ baris: 1130, jalan: function (m) { m.cetak("       ╠═════════════════╣"); m.warna(27, 0); m.cetak("* * * THE TEMPLE OF LOTH * * *"); m.warna(3, 0); m.cetak("╠════════════════╣"); m.barisBaru(); } });
  T({ baris: 1140, jalan: function (m) { m.cetak("       ╠═════════════════════════════════════════════════════════════════╣"); m.barisBaru(); } });
  rem(1150);
  rem(1160);
  rem(1170);
  T({ baris: 1180, jalan: function (m) { m.cetak("       ║      Many generations ago, during the great Elfin Wars  of the  ║"); m.barisBaru(); } });
  T({ baris: 1190, jalan: function (m) { m.cetak("       ║   first age, there stood the majestic temple of the Drow.  The  ║"); m.barisBaru(); } });
  T({ baris: 1200, jalan: function (m) { m.cetak("       ║   Drow are an evil race of elves dedicated to the  destruction  ║"); m.barisBaru(); } });
  T({ baris: 1210, jalan: function (m) { m.cetak("       ║   of all elves but themselves. During this time they were rul-  ║"); m.barisBaru(); } });
  T({ baris: 1220, jalan: function (m) { m.cetak("       ║   ed by the the evil priestess,Tar-Anclime, a great sorceress.  ║"); m.barisBaru(); } });
  T({ baris: 1230, jalan: function (m) { m.cetak("       ║   Under the aid of her goddess Loth, she created "); m.warna(11, 0); m.cetak("the Amulet of"); m.warna(3, 0); m.cetak("  ║"); m.barisBaru(); } });
  T({ baris: 1240, jalan: function (m) { m.cetak("       ║"); m.warna(11, 0); m.cetak("   Chaos"); m.warna(3, 0); m.cetak(" which was to be used to aid her side in the final des-  ║"); m.barisBaru(); } });
  T({ baris: 1250, jalan: function (m) { m.cetak("       ║   truction of their rivals. The Drow massed for The final con-  ║"); m.barisBaru(); } });
  T({ baris: 1260, jalan: function (m) { m.cetak("       ║   flict but they were attacked by their rival forces and there  ║"); m.barisBaru(); } });
  T({ baris: 1270, jalan: function (m) { m.cetak("       ║   they were utterly destroyed. Now thousands of years later it  ║"); m.barisBaru(); } });
  T({ baris: 1280, jalan: function (m) { m.cetak("       ║   is said that in the  kingdom of Rhyl that the descendents of  ║"); m.barisBaru(); } });
  T({ baris: 1290, jalan: function (m) { m.cetak("       ║   the Drow are massing. The Drow plan to return to claim their  ║"); m.barisBaru(); } });
  T({ baris: 1300, jalan: function (m) { m.cetak("       ║   homeland to retrieve "); m.warna(11, 0); m.cetak("the Amulet of Chaos"); m.warna(3, 0); m.cetak(" so they can finally  ║"); m.barisBaru(); } });
  T({ baris: 1310, jalan: function (m) { m.cetak("       ║   destroy the elves of good. Living in the village shadowed by  ║"); m.barisBaru(); } });
  T({ baris: 1320, jalan: function (m) { m.cetak("       ║   now crumbling  temple, you have been  chosen to retrieve the  ║"); m.barisBaru(); } });
  T({ baris: 1330, jalan: function (m) { m.cetak("       ║   Amulet  before the Drow  return so that it can be destroyed.  ║"); m.barisBaru(); } });
  T({ baris: 1340, jalan: function (m) { m.cetak("       ║   There are many  dangers that live in the  mazes of the ruins  ║"); m.barisBaru(); } });
  T({ baris: 1350, jalan: function (m) { m.cetak("       ║   such as powerful  and  magic  monsters.  It is even believed  ║"); m.barisBaru(); } });
  T({ baris: 1360, jalan: function (m) { m.cetak("       ║   that the some Drow still live in ruins."); m.warna(28, 0); m.cetak(" BEWARE!!!"); m.warna(3, 0); m.cetak("             ║"); m.barisBaru(); } });
  rem(1370);
  T({ baris: 1380, jalan: function (m) { m.cetak("       ╚═════════════════════════════════════════════════════════════════╝"); m.barisBaru(); } });
  T({ baris: 1400, jalan: function (m) { m.lompat(1420); } });
  T({ baris: 1410, jalan: function (m) { m.cetak("Wait one moment please while I stock the temple..."); m.barisBaru(); } });
  T({ baris: 1420, jalan: function (m) { m.v['X'] = 1; m.v['Y'] = 4; } });
  T({ baris: 1430, jalan: function (m) { m.v['L()'][ FND(m,  1 ) ] = 2; } });
  T({ baris: 1440, jalan: function (m) { m.untuk('Z', 1, 7, 1); } });
  T({ baris: 1450, jalan: function (m) { m.untuk('Q1', 1, 2, 1); } });
  T({ baris: 1460, jalan: function (m) { m.v['Q'] = 104; } });
  T({ baris: 1470, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1480, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) + 1 ) ] = 103; } });
  T({ baris: 1490, jalan: function (m) { m.lanjutkan('Q1'); } });
  T({ baris: 1500, jalan: function (m) { m.lanjutkan('Z'); } });
  T({ baris: 1510, jalan: function (m) { m.untuk('Z', 1, 8, 1); } });
  T({ baris: 1520, jalan: function (m) { m.untuk('Q', 113, 124, 1); } });
  T({ baris: 1530, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1540, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1550, jalan: function (m) { m.untuk('Q1', 1, 3, 1); } });
  T({ baris: 1560, jalan: function (m) { m.untuk('Q', 105, 112, 1); } });
  T({ baris: 1570, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1580, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1590, jalan: function (m) { m.v['Q'] = 125; } });
  T({ baris: 1600, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1610, jalan: function (m) { m.lanjutkan('Q1'); } });
  T({ baris: 1620, jalan: function (m) { m.lanjutkan('Z'); } });
  T({ baris: 1630, jalan: function (m) { m.untuk('Q', 126, 133, 1); } });
  T({ baris: 1640, jalan: function (m) { m.v['Z'] = FNA(m,  8 ); } });
  T({ baris: 1650, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1660, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1670, jalan: function (m) { m.v['Q'] = 101; } });
  T({ baris: 1680, jalan: function (m) { m.untuk('A', 1, 3, 1); } });
  T({ baris: 1690, jalan: function (m) { m.v['Z'] = FNA(m,  8 ); } });
  T({ baris: 1700, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1710, jalan: function (m) { m.v['C()'][ (m.v['A'] || 0) ][ 1 ] = (m.v['X'] || 0); } });
  T({ baris: 1720, jalan: function (m) { m.v['C()'][ (m.v['A'] || 0) ][ 3 ] = (m.v['Z'] || 0); } });
  T({ baris: 1730, jalan: function (m) { m.v['C()'][ (m.v['A'] || 0) ][ 2 ] = (m.v['Y'] || 0); } });
  T({ baris: 1740, jalan: function (m) { m.v['C()'][ (m.v['A'] || 0) ][ 4 ] = 0; } });
  T({ baris: 1750, jalan: function (m) { m.lanjutkan('A'); } });
  T({ baris: 1760, jalan: function (m) { m.v['RC'] = 0; } });
  T({ baris: 1770, jalan: function (m) { m.v['ST'] = 2; } });
  T({ baris: 1780, jalan: function (m) { m.v['DX'] = 8; } });
  T({ baris: 1790, jalan: function (m) { m.v['R$()'][3] = 'Man'; } });
  T({ baris: 1800, jalan: function (m) { m.v['Q'] = 112 + FNA(m,  12 ); } });
  T({ baris: 1810, jalan: function (m) { m.v['Z'] = FNA(m,  8 ); } });
  T({ baris: 1820, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1830, jalan: function (m) { m.v['R()'][ 1 ] = (m.v['X'] || 0); } });
  T({ baris: 1840, jalan: function (m) { m.v['R()'][ 2 ] = (m.v['Y'] || 0); } });
  T({ baris: 1850, jalan: function (m) { m.v['R()'][ 3 ] = (m.v['Z'] || 0); } });
  T({ baris: 1860, jalan: function (m) { m.v['Q'] = 109; } });
  T({ baris: 1870, jalan: function (m) { m.v['Z'] = FNA(m,  8 ); } });
  T({ baris: 1880, jalan: function (m) { m.gosub(10450); } });
  T({ baris: 1890, jalan: function (m) { m.v['O()'][ 1 ] = (m.v['X'] || 0); } });
  T({ baris: 1900, jalan: function (m) { m.v['O()'][ 2 ] = (m.v['Y'] || 0); } });
  T({ baris: 1910, jalan: function (m) { m.v['O()'][ 3 ] = (m.v['Z'] || 0); } });
  T({ baris: 1920, jalan: function (m) { m.v['BF'] = 0; m.v['OT'] = 8; m.v['AV'] = 0; m.v['HT'] = 0; m.v['T'] = 1; m.v['VF'] = 0; m.v['LF'] = 0; } });
  T({ baris: 1930, jalan: function (m) {
      m.v.TC = 0; m.v['GP!'] = 60; m.v.RF = 0; m.v.OF = 0;
      m.v.BL = 0; m.v.IQ = 8; m.v.SX = 0;
    } });
  T({ baris: 1940, jalan: function (m) { m.untuk('Q', 1, 8, 1); } });
  T({ baris: 1950, jalan: function (m) { m.v['T()'][ (m.v['Q'] || 0) ] = 0; } });
  T({ baris: 1960, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 1970, jalan: function (m) { m.cetak(m.chr(7)); } });
  T({ baris: 1980, jalan: function (m) { m.cls(); } });
  T({ baris: 1990, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2000, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2010, jalan: function (m) { m.warna(11, 0); m.cetak("  You are in large room blinded by a very bright light.  All of the sudden you "); m.barisBaru(); } });
  T({ baris: 2020, jalan: function (m) { m.cetak("hear a booming voice which says, `You have been chosen bold one to be a valiant"); m.barisBaru(); } });
  T({ baris: 2030, jalan: function (m) { m.cetak("and brave  warrior of any race you desire.  You can choose to be an Elf, a Man,"); m.barisBaru(); } });
  T({ baris: 2040, jalan: function (m) { m.cetak("a Dwarf or a Hobbit.' Remember though, you only have 500 turns."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 2050, jalan: function (m) { m.warna(3, 0); } });
  T({ baris: 2060, jalan: function (m) { m.gosub(10690); } });
  T({ baris: 2070, jalan: function (m) { m.untuk('Q', 1, 4, 1); } });
  T({ baris: 2080, jalan: function (m) { m.v['STR'] = Math.floor( m.acak() * 10 + 2 ); } });
  T({ baris: 2090, jalan: function (m) { m.v['DEX'] = Math.floor( m.acak() * 10 + 2 ); } });
  /* 2100 Bangsa dipilih dari HURUF PERTAMA namanya, dan nomor bangsanya langsung
     jadi PENGALI kekuatan: Hobbit (1) paling lemah, Elf (2), Man (3),
     Dwarf (4) paling kuat. Satu perkalian menggantikan tabel sifat bangsa. */
  T({ baris: 2100, jalan: function (m) {
      if ((m.v['R$()'][m.v.Q] || '').charAt(0) === m.v['O$']) {
        m.v.RC = m.v.Q; m.v.ST = m.v.STR * m.v.Q; m.v.DX = m.v.DEX * m.v.Q;
      }
    } });
  T({ baris: 2110, jalan: function (m) { if (m.v.ST > 18) m.v.ST = 18; } });
  T({ baris: 2120, jalan: function (m) { if (m.v.DX > 18) m.v.DX = 18; } });
  T({ baris: 2130, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 2140, jalan: function (m) { m.barisBaru(); } });
  /* 2150 `OT=OT+4*(RC=1)` — dan hasilnya MENGURANGI, bukan menambah, karena
     perbandingan yang benar bernilai −1 di BASIC. Hobbit (bangsa 1) dapat
     empat pilihan LEBIH SEDIKIT di daftar barang. Satu tanda kurung yang
     membalik arah seluruh baris. */
  T({ baris: 2150, jalan: function (m) { m.v.OT = (m.v.OT || 0) + 4 * (m.v.RC === 1 ? -1 : 0); } });
  /* 2160 Kalau pemainnya memilih bangsa, `R$(3)` diganti dari 'Man' jadi 'Human' —
     supaya kalimat 'you are a Man' terbaca wajar tapi 'Are you a Human?'
     juga wajar. Satu kata yang berubah menurut kalimat yang memakainya. */
  T({ baris: 2160, jalan: function (m) { if (m.v.RC > 0) { m.v['R$()'][3] = 'Human'; m.lompat(2190); } } });
  T({ baris: 2170, jalan: function (m) { m.warna(11, 0); m.cetak("** That was incorrect. Please type E, D, M, OR H."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 2180, jalan: function (m) { m.lompat(2060); } });
  T({ baris: 2190, jalan: function (m) { m.cetak("Which sex do you prefer"); } });
  T({ baris: 2200, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 2210, jalan: function (m) { if ((m.v["O$"] || '') === "M") { m.v["SX"] = 1; m.lompat(2250); } } });
  T({ baris: 2220, jalan: function (m) { if ((m.v["O$"] || '') === "F") m.lompat(2250); } });
  T({ baris: 2230, jalan: function (m) {
      m.warna(11, 0); m.cetak('** Cute ' + m.v['R$()'][m.v.RC] +
                            ', Real cute. Try M OR F.');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 2240, jalan: function (m) { m.lompat(2190); } });
  T({ baris: 2250, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2260, jalan: function (m) {
      m.cetak('OK, ' + m.v['R$()'][m.v.RC] +
              ', you have the following attributes :'); m.barisBaru();
    } });
  T({ baris: 2270, jalan: function (m) { m.cetak("Strength ="); m.cetak(bas((m.v["ST"] || 0))); m.barisBaru(); } });
  T({ baris: 2280, jalan: function (m) { m.cetak("Intelligence ="); m.cetak(bas((m.v["IQ"] || 0))); m.barisBaru(); } });
  T({ baris: 2290, jalan: function (m) { m.cetak("Dexterity ="); m.cetak(bas((m.v["DX"] || 0))); m.barisBaru(); } });
  T({ baris: 2300, jalan: function (m) { m.cetak("and"); m.cetak(bas((m.v["OT"] || 0))); m.cetak("other points you allocate as you wish."); m.barisBaru(); } });
  T({ baris: 2310, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2320, jalan: function (m) { m.v['Z$'] = 'Strength'; } });
  T({ baris: 2330, jalan: function (m) { m.gosub(10740); } });
  T({ baris: 2340, jalan: function (m) { m.v['ST'] = (m.v['ST'] || 0) + (m.v['Q'] || 0); } });
  T({ baris: 2350, jalan: function (m) { if ((m.v['OT'] || 0) === 0) m.lompat(2430); } });
  T({ baris: 2360, jalan: function (m) { m.v['Z$'] = 'Intelligence'; } });
  T({ baris: 2370, jalan: function (m) { m.gosub(10740); } });
  T({ baris: 2380, jalan: function (m) { m.v['IQ'] = (m.v['IQ'] || 0) + (m.v['Q'] || 0); } });
  T({ baris: 2390, jalan: function (m) { if ((m.v['OT'] || 0) === 0) m.lompat(2430); } });
  T({ baris: 2400, jalan: function (m) { m.v['Z$'] = 'Dexterity'; } });
  T({ baris: 2410, jalan: function (m) { m.gosub(10740); } });
  T({ baris: 2420, jalan: function (m) { m.v['DX'] = (m.v['DX'] || 0) + (m.v['Q'] || 0); } });
  T({ baris: 2430, jalan: function (m) { m.cetak("OK, "); m.cetak(m.v["R$()"][ (m.v["RC"] || 0) ]); m.cetak(", you find your self at a bazaar in a small village built in the "); m.barisBaru(); } });
  T({ baris: 2440, jalan: function (m) { m.cetak("shadow of a large and crumbling castle.  You have nothing save the clothes on "); m.barisBaru(); } });
  T({ baris: 2450, jalan: function (m) { m.cetak("your back and a purse containing 60gp's to buy your equipments with."); m.barisBaru(); } });
  T({ baris: 2460, jalan: function (m) { m.v['Z$'] = 'Armor'; } });
  T({ baris: 2470, jalan: function (m) { m.gosub(10990); } });
  T({ baris: 2480, jalan: function (m) { m.v['AV'] = 0; m.v['WV'] = 0; m.v['FL'] = 0; m.v['WC'] = 0; } });
  T({ baris: 2490, jalan: function (m) { m.cetak("Plate Mail:30gp's Chainmail:20gp's Leather:10gp's Nothing:-"); m.barisBaru(); } });
  T({ baris: 2500, jalan: function (m) { m.gosub(10690); } });
  T({ baris: 2510, jalan: function (m) { if ((m.v["O$"] || '') === "N") m.lompat(2570); } });
  /* 2520 Nilai zirah dipilih tanpa satu pun IF: tiap perbandingan bernilai −1 kalau
     benar, jadi tiga perkalian menghasilkan 3, 2, 1, atau 0 tepat sesuai
     huruf yang diketik. Plate, Chainmail, Leather, atau tidak sama sekali. */
  T({ baris: 2520, jalan: function (m) {
      m.v.AV = -3 * (m.v['O$'] === 'P' ? -1 : 0)
             - 2 * (m.v['O$'] === 'C' ? -1 : 0)
             - (m.v['O$'] === 'L' ? -1 : 0);
    } });
  T({ baris: 2530, jalan: function (m) { if ((m.v['AV'] || 0) > 0) m.lompat(2570); } });
  T({ baris: 2540, jalan: function (m) { m.barisBaru(); } });
  /* 2550 Ejekan yang menyebut monster ACAK dari daftar yang sama dengan yang nanti
     menyerang pemainnya. Data yang dipakai dua kali untuk dua keperluan. */
  T({ baris: 2550, jalan: function (m) {
      m.warna(11, 0);
      m.cetak('** Are you a ' + m.v['R$()'][m.v.RC] + ' or ' +
              m.v['C$()'][FNA(m, 12) + 12] + '?');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 2560, jalan: function (m) { m.lompat(2460); } });
  T({ baris: 2570, jalan: function (m) { m.v.AH = m.v.AV * 7; m.v['GP!'] = m.v['GP!'] - m.v.AV * 10; } });
  T({ baris: 2580, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2590, jalan: function (m) {
      m.cetak('OK, bold ' + m.v['R$()'][m.v.RC] + ', you have' +
              bas(m.v['GP!']) + "gp's left."); m.barisBaru();
    } });
  T({ baris: 2600, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2610, jalan: function (m) { m.v['Z$'] = 'Weapons'; } });
  T({ baris: 2620, jalan: function (m) { m.gosub(10990); } });
  T({ baris: 2630, jalan: function (m) { m.cetak("Sword:30gp's Mace:20gp's Dagger:10gp's Nothing:-"); m.barisBaru(); } });
  T({ baris: 2640, jalan: function (m) { m.gosub(10690); } });
  T({ baris: 2650, jalan: function (m) { if ((m.v["O$"] || '') === "N") m.lompat(2710); } });
  T({ baris: 2660, jalan: function (m) {
      m.v.WV = -3 * (m.v['O$'] === 'S' ? -1 : 0)
             - 2 * (m.v['O$'] === 'M' ? -1 : 0)
             - (m.v['O$'] === 'D' ? -1 : 0);
    } });
  T({ baris: 2670, jalan: function (m) { if ((m.v['WV'] || 0) > 0) m.lompat(2710); } });
  T({ baris: 2680, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2690, jalan: function (m) {
      m.warna(11, 0);
      m.cetak('** Is your IQ really' + bas(m.v.IQ) + '?');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 2700, jalan: function (m) { m.lompat(2610); } });
  T({ baris: 2710, jalan: function (m) { m.v['GP!'] = m.v['GP!'] - m.v.WV * 10; } });
  T({ baris: 2720, jalan: function (m) { if ((m.v['GP!'] || 0) < 20) m.lompat(2780); } });
  T({ baris: 2730, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2740, jalan: function (m) { m.cetak("Do you want to buy a lamp for 20gp's"); } });
  T({ baris: 2750, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 2760, jalan: function (m) {
      if (m.v['O$'] === 'Y') {
        m.v.LF = 1; m.v['GP!'] = m.v['GP!'] - 20; m.lompat(2780);
      }
    } });
  T({ baris: 2770, jalan: function (m) { if ((m.v["O$"] || '') !== "N") { m.barisBaru(); m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.barisBaru(); m.lompat(2740); } } });
  T({ baris: 2780, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2790, jalan: function (m) { if (m.v['GP!'] < 1) { m.v.Q = 0; m.lompat(2900); } } });
  T({ baris: 2800, jalan: function (m) {
      m.cetak('OK, ' + m.v['R$()'][m.v.RC] + ', you have' +
              bas(m.v['GP!']) + 'gold pieces left.'); m.barisBaru();
    } });
  T({ baris: 2810, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2820, jalan: function (m) { m.masukan("O$", "Flares give off light which allows you to see all the rooms around you.  At a   cost of 1gp each how many do you want to buy?"); } });
  T({ baris: 2830, jalan: function (m) { m.v.Q = parseInt(m.v['O$'], 10) || 0; } });
  T({ baris: 2840, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2850, jalan: function (m) { if (m.v.Q > 0 || (m.v['O$'] || ' ').charCodeAt(0) === 48) m.lompat(2890); } });
  T({ baris: 2860, jalan: function (m) { m.warna(11, 0); m.cetak("** If you don't want any, just type 0."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 2870, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 2880, jalan: function (m) { m.lompat(2820); } });
  T({ baris: 2890, jalan: function (m) {
      m.warna(11, 0);
      if (m.v.Q > m.v['GP!']) {
        m.cetak('** You can only afford' + bas(m.v['GP!']) + '.');
        m.barisBaru(); m.warna(3, 0); m.barisBaru(); m.lompat(2820);
      }
    } });
  T({ baris: 2900, jalan: function (m) { m.v.FL = (m.v.FL || 0) + m.v.Q; m.v['GP!'] = m.v['GP!'] - m.v.Q; } });
  T({ baris: 2910, jalan: function (m) { m.v['X'] = 1; m.v['Y'] = 4; m.v['Z'] = 1; } });
  T({ baris: 2920, jalan: function (m) {
      m.warna(27, 0);
      m.cetak('OK, ' + m.v['R$()'][m.v.RC] +
              ', You are now entering the castle!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 2930, jalan: function (m) { m.lompat(6370); } });
  rem(2940);
  rem(2950);
  rem(2960);
  T({ baris: 2970, jalan: function (m) { m.v['T'] = (m.v['T'] || 0) + 1; } });
  T({ baris: 2980, jalan: function (m) { if ((m.v['RF'] || 0) + (m.v['OF'] || 0) > 0) m.lompat(3110); } });
  /* 2990 Tiga kutukan, dan tiap satu ditawar oleh satu harta: `C(n,4)` menyala kalau
     pemain berada di ruang kutukannya, `T(n)` menyala kalau ia membawa
     penawarnya. Perbandingan langsung antara keduanya — kutukan berlaku
     hanya kalau tidak ada penawarnya. */
  T({ baris: 2990, jalan: function (m) { if (m.v['C()'][1][4] > m.v['T()'][1]) m.v.T = (m.v.T || 0) + 1; } });
  T({ baris: 3000, jalan: function (m) { if (m.v['C()'][2][4] > m.v['T()'][3]) m.v['GP!'] = m.v['GP!'] - FNA(m, 5); } });
  T({ baris: 3010, jalan: function (m) { if (m.v['GP!'] < 0) m.v['GP!'] = 0; } });
  T({ baris: 3020, jalan: function (m) { if (m.v['C()'][ 3 ][ 4 ] <= m.v['T()'][ 5 ]) m.lompat(3110); } });
  T({ baris: 3030, jalan: function (m) { m.v['A'] = (m.v['X'] || 0); m.v['B'] = (m.v['Y'] || 0); m.v['C'] = (m.v['Z'] || 0); } });
  T({ baris: 3040, jalan: function (m) { m.v['X'] = FNA(m,  8 ); m.v['Y'] = FNA(m,  8 ); m.v['Z'] = FNA(m,  8 ); } });
  T({ baris: 3050, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = FNE(m,  m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] ) + 100; } });
  T({ baris: 3060, jalan: function (m) { m.v['X'] = (m.v['A'] || 0); m.v['Y'] = (m.v['B'] || 0); m.v['Z'] = (m.v['C'] || 0); } });
  T({ baris: 3070, jalan: function (m) { if (m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] !== 1) m.lompat(3110); } });
  T({ baris: 3080, jalan: function (m) { m.untuk('Q', 1, 3, 1); } });
  /* 3090 'Apakah pemain berada di ruang kutukan ini?' — tiga perbandingan DIKALIKAN.
     Hasilnya 1 hanya kalau ketiganya benar, karena (−1)×(−1)×(−1) = −1 dan
     tanda minus di depan membalikkannya. Satu baris menggantikan tiga IF
     bersarang. */
  T({ baris: 3090, jalan: function (m) {
      m.v['C()'][m.v.Q][4] =
        -(m.v['C()'][m.v.Q][1] === m.v.X ? -1 : 0) *
         (m.v['C()'][m.v.Q][2] === m.v.Y ? -1 : 0) *
         (m.v['C()'][m.v.Q][3] === m.v.Z ? -1 : 0);
    } });
  T({ baris: 3100, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 3110, jalan: function (m) { if (FNA(m,  5 ) > 1) m.lompat(3610); } });
  T({ baris: 3120, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3130, jalan: function (m) { m.cetak("You "); } });
  T({ baris: 3140, jalan: function (m) { m.v['Q'] = FNA(m,  7 ) + (m.v['BL'] || 0); } });
  T({ baris: 3150, jalan: function (m) { if (m.v.Q > 7) m.v.Q = 4; } });
  T({ baris: 3160, jalan: function (m) { var tj = [3460, 3200, 3440, 3180, 3480, 3510, 3530][(m.v["Q"] || 0) - 1]; if (tj) m.gosub(tj); } });
  T({ baris: 3170, jalan: function (m) { m.lompat(3610); } });
  T({ baris: 3180, jalan: function (m) { m.cetak("stepped on dragon @#*%!"); m.barisBaru(); } });
  T({ baris: 3190, jalan: function (m) { m.kembali(); } });
  T({ baris: 3200, jalan: function (m) { m.cetak("hear "); } });
  T({ baris: 3210, jalan: function (m) { var tj = [3220, 3280, 3360, 3390][FNA(m, 4) - 1]; if (tj) m.lompat(tj); } });
  T({ baris: 3220, jalan: function (m) { m.cetak("a scream!"); m.barisBaru(); } });
  T({ baris: 3230, jalan: function (m) { m.untuk('I', 2075, 1800, -1); } });
  T({ baris: 3240, jalan: function () { /* SOUND / PLAY */ } });
  T({ baris: 3250, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 3260, jalan: function () { /* SOUND / PLAY */ } });
  T({ baris: 3270, jalan: function (m) { m.kembali(); } });
  T({ baris: 3280, jalan: function (m) { m.cetak("footsteps!"); m.barisBaru(); } });
  rem(3290);
  T({ baris: 3300, jalan: function (m) { m.untuk('J', 40, 37, -1); } });
  T({ baris: 3310, jalan: function () { /* SOUND / PLAY */ } });
  T({ baris: 3320, jalan: function () { /* SOUND / PLAY */ } });
  rem(3330);
  T({ baris: 3340, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 3350, jalan: function (m) { m.kembali(); } });
  T({ baris: 3360, jalan: function (m) { m.cetak("a Wumpus!"); m.barisBaru(); } });
  T({ baris: 3370, jalan: function () { /* SOUND / PLAY */ } });
  T({ baris: 3380, jalan: function (m) { m.kembali(); } });
  T({ baris: 3390, jalan: function (m) { m.cetak("groans!"); m.barisBaru(); } });
  T({ baris: 3400, jalan: function (m) { m.untuk('I', 300, 37, -1); } });
  T({ baris: 3410, jalan: function () { /* SOUND / PLAY */ } });
  T({ baris: 3420, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 3430, jalan: function (m) { m.kembali(); } });
  T({ baris: 3440, jalan: function (m) { m.cetak("sneezed!"); m.barisBaru(); } });
  T({ baris: 3450, jalan: function (m) { m.kembali(); } });
  T({ baris: 3460, jalan: function (m) { m.cetak("see a bat fly by!"); m.barisBaru(); } });
  T({ baris: 3470, jalan: function (m) { m.kembali(); } });
  T({ baris: 3480, jalan: function (m) {
      m.cetak('hear a ' + m.v['C$()'][12 + FNA(m, 13)] + ' growling!');
      m.barisBaru();
    } });
  T({ baris: 3490, jalan: function (m) { m.lompat(3400); } });
  T({ baris: 3500, jalan: function (m) { m.kembali(); } });
  T({ baris: 3510, jalan: function (m) { m.cetak("feel like you're being watched!"); m.barisBaru(); } });
  T({ baris: 3520, jalan: function (m) { m.kembali(); } });
  T({ baris: 3530, jalan: function (m) { m.cetak("hear faint rustling noises!"); m.barisBaru(); } });
  T({ baris: 3540, jalan: function (m) { m.untuk('Q', 1, 200, 1); } });
  T({ baris: 3550, jalan: function (m) { m.v['A'] = Math.floor( m.acak() * 50 + 37 ); } });
  T({ baris: 3560, jalan: function () { /* SOUND / PLAY */ } });
  rem(3570);
  T({ baris: 3580, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 3590, jalan: function () { /* SOUND / PLAY */ } });
  T({ baris: 3600, jalan: function (m) { m.kembali(); } });
  T({ baris: 3610, jalan: function (m) { if ((m.v['BL'] || 0) + m.v['T()'][ 4 ] !== 2) m.lompat(3650); } });
  T({ baris: 3620, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3630, jalan: function (m) { m.cetak(m.v['C$()'][29] + ' cures your blindness!'); m.barisBaru(); } });
  T({ baris: 3640, jalan: function (m) { m.v['BL'] = 0; } });
  T({ baris: 3650, jalan: function (m) { if ((m.v['BF'] || 0) + m.v['T()'][ 6 ] !== 2) m.lompat(3690); } });
  T({ baris: 3660, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3670, jalan: function (m) { m.cetak(m.v['C$()'][31] + ' dissolves the book!'); m.barisBaru(); } });
  T({ baris: 3680, jalan: function (m) { m.v['BF'] = 0; } });
  T({ baris: 3690, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3695, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 3700, jalan: function (m) { m.locate(23, 1); m.warna(3, 0); m.cetak("Enter your command:"); m.barisBaru(); } });
  T({ baris: 3705, jalan: function (m) { m.untuk('ASD', 1, 2, 1); } });
  T({ baris: 3710, jalan: function (m) { m.locate(23, 20); m.cetak("-"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3720, jalan: function (m) { m.locate(23, 20); m.cetak("\\"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3730, jalan: function (m) { m.locate(23, 20); m.cetak("│"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3740, jalan: function (m) { m.locate(23, 20); m.cetak("/"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3750, jalan: function (m) { m.locate(23, 20); m.cetak("-"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3760, jalan: function (m) { m.locate(23, 20); m.cetak("\\"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3770, jalan: function (m) { m.locate(23, 20); m.cetak("│"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3780, jalan: function (m) { m.locate(23, 20); m.cetak("/"); m.barisBaru(); /* SOUND 32767,1 */ } });
  T({ baris: 3790, jalan: function (m) { m.locate(23, 20); m.cetak("-"); /* SOUND 32767,1 */ } });
  rem(3791);
  T({ baris: 3792, jalan: function (m) { m.lanjutkan(); } });
  T({ baris: 3795, jalan: function (m) { m.masukan('O$', ''); } });
  /* 3800 Satu-satunya perintah dua huruf: DR untuk minum. Diperiksa SEBELUM baris
     3810 memotong masukannya jadi satu huruf. */
  T({ baris: 3800, jalan: function (m) { if ((m.v['O$'] || '').slice(0, 2) === 'DR') m.lompat(5180); } });
  T({ baris: 3810, jalan: function (m) { m.v['O$'] = (m.v['O$'] || '').charAt(0); } });
  T({ baris: 3820, jalan: function (m) { if ((m.v["O$"] || '') === "N") m.lompat(4300); } });
  T({ baris: 3830, jalan: function (m) {
      var o = m.v['O$'];
      if (o === 'S' || o === 'W' || o === 'E') m.lompat(4310);
    } });
  T({ baris: 3840, jalan: function (m) { if ((m.v["O$"] || '') === "U") m.lompat(4360); } });
  T({ baris: 3850, jalan: function (m) { if ((m.v["O$"] || '') === "D") m.lompat(4390); } });
  T({ baris: 3860, jalan: function (m) { if ((m.v["O$"] || '') === "▐") m.lompat(10210); } });
  T({ baris: 3870, jalan: function (m) { if ((m.v["O$"] || '') === "M") m.lompat(4440); } });
  /* 3880 3880-3930 `ON BL+1 GOTO` — bendera kebutaan dipakai sebagai INDEKS, bukan
     sebagai syarat. Nol berarti tujuan pertama, satu berarti tujuan kedua
     (pesan 'kamu tidak bisa melihat apa-apa'). Empat perintah memakai pola
     yang sama. */
  T({ baris: 3880, jalan: function (m) {
      if (m.v['O$'] === 'F') {
        var tj = [4680, 4440][(m.v.BL || 0) + 1 - 1]; if (tj) m.lompat(tj);
      }
    } });
  T({ baris: 3890, jalan: function (m) {
      if (m.v['O$'] === 'L') {
        var tj = [4940, 4440][(m.v.BL || 0) + 1 - 1]; if (tj) m.lompat(tj);
      }
    } });
  T({ baris: 3900, jalan: function (m) { if ((m.v["O$"] || '') === "O") m.lompat(5370); } });
  T({ baris: 3910, jalan: function (m) { if ((m.v["O$"] || '') === "Q") m.lompat(6240); } });
  T({ baris: 3920, jalan: function (m) {
      if (m.v['O$'] === 'G') {
        var tj = [5830, 4440][(m.v.BL || 0) + 1 - 1]; if (tj) m.lompat(tj);
      }
    } });
  /* 3930 Teleportasi hanya bekerja kalau pemain membawa Runestaff — dan yang
     memutuskannya indeks yang sama, bukan sebuah IF. */
  T({ baris: 3930, jalan: function (m) {
      if (m.v['O$'] === 'T') {
        m.barisBaru();
        var tj = [6090, 6130][(m.v.RF || 0) + 1 - 1]; if (tj) m.lompat(tj);
      }
    } });
  T({ baris: 3940, jalan: function (m) { if ((m.v["O$"] || '') === "#") m.lompat(11050); } });
  T({ baris: 3950, jalan: function (m) { if ((m.v["O$"] || '') === "H") m.lompat(3970); } });
  T({ baris: 3960, jalan: function (m) { m.lompat(4280); } });
  T({ baris: 3970, jalan: function (m) { m.masukan("HARD$", "Do you want a hard copy (Y/N)"); } });
  T({ baris: 3980, jalan: function (m) { if ((m.v["HARD$"] || '') === "Y") m.lompat(11100); } });
  T({ baris: 3990, jalan: function (m) { m.cetak("╔══════════════════════════════════════════════════════════════╗"); m.barisBaru(); } });
  T({ baris: 4000, jalan: function (m) { m.cetak("║"); m.warna(27, 0); m.cetak("   *** TEMPLE OF LOTH'S COMMAND AND INFORMATION SUMMARY ***"); m.warna(3, 0); m.cetak("   ║"); m.barisBaru(); } });
  T({ baris: 4010, jalan: function (m) { m.cetak("╠══════════════════════════════════════════════════════════════╣"); m.barisBaru(); } });
  T({ baris: 4020, jalan: function (m) { m.cetak("║ The following commands available are:                        ║"); m.barisBaru(); } });
  T({ baris: 4030, jalan: function (m) { m.cetak("║                                                              ║"); m.barisBaru(); } });
  T({ baris: 4040, jalan: function (m) { m.cetak("║ H=Help   N=North    S=South   E=East    W=West    U=Up       ║"); m.barisBaru(); } });
  T({ baris: 4050, jalan: function (m) { m.cetak("║ D=Down   DR=Drink   M=Map     F=Flare   L=Lamp    O=Open     ║"); m.barisBaru(); } });
  T({ baris: 4060, jalan: function (m) { m.cetak("║ G=Gaze   T=Teleport Q=Quit    #=Score                        ║"); m.barisBaru(); } });
  T({ baris: 4070, jalan: function (m) { m.cetak("╠══════════════════════════════════════════════════════════════╣"); m.barisBaru(); } });
  T({ baris: 4080, jalan: function (m) { m.cetak("║ The contents of the rooms are as follows:                    ║"); m.barisBaru(); } });
  T({ baris: 4090, jalan: function (m) { m.cetak("║                                                              ║"); m.barisBaru(); } });
  T({ baris: 4100, jalan: function (m) { m.cetak("║ ╬ = empty room      B = book            C = chest            ║"); m.barisBaru(); } });
  T({ baris: 4110, jalan: function (m) { m.cetak("║ D = stairs down     ∩ = entrance/exit   ƒ = flares           ║"); m.barisBaru(); } });
  T({ baris: 4120, jalan: function (m) { m.cetak("║ G = gold pieces     ¥ = monster         Φ = crystal orb      ║"); m.barisBaru(); } });
  T({ baris: 4130, jalan: function (m) { m.cetak("║ P = magic pool      S = sinkhole        T = treasure         ║"); m.barisBaru(); } });
  T({ baris: 4140, jalan: function (m) { m.cetak("║ U = stairs up       * = Drow            █ = warp/amulet      ║"); m.barisBaru(); } });
  T({ baris: 4150, jalan: function (m) { m.cetak("╠══════════════════════════════════════════════════════════════╣"); m.barisBaru(); } });
  T({ baris: 4160, jalan: function (m) { m.cetak("║ The benefits of having treasures are:                        ║"); m.barisBaru(); } });
  T({ baris: 4170, jalan: function (m) { m.cetak("║                                                              ║"); m.barisBaru(); } });
  T({ baris: 4180, jalan: function (m) { m.cetak("║ RUBY RED - avoid lethargy    PALE PEARL - avoid leech        ║"); m.barisBaru(); } });
  T({ baris: 4190, jalan: function (m) { m.cetak("║ GREEN GEM - avoid forgetting  OPAL EYE - cure blindness      ║"); m.barisBaru(); } });
  T({ baris: 4200, jalan: function (m) { m.cetak("║ BLUE FLAME - dissolves books  NORN STONE - no benefit        ║"); m.barisBaru(); } });
  T({ baris: 4210, jalan: function (m) { m.cetak("║ PALANTIR - no benefit         SILMARIL - no benefit          ║"); m.barisBaru(); } });
  T({ baris: 4220, jalan: function (m) { m.cetak("╠══════════════════════════════════════════════════════════════╣"); m.barisBaru(); } });
  T({ baris: 4230, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4240, jalan: function (m) { m.cetak("Press RETURN when ready to resume, "); m.cetak(m.v["R$()"][ (m.v["RC"] || 0) ]); m.cetak("."); } });
  T({ baris: 4250, jalan: function (m) { m.masukan('O$', ''); } });
  T({ baris: 4260, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 4270, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4280, jalan: function (m) {
      m.warna(11, 0);
      m.cetak('** Bold ' + m.v['R$()'][m.v.RC] +
              ", that wasn't a valid command!");
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 4290, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 4300, jalan: function (m) { if (m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] === 2) m.lompat(9710); } });
  /* 4310 Arah gerak dari perbandingan, bukan dari IF. `(O$="N")` bernilai −1, jadi
     X berkurang satu ke utara dan bertambah satu ke selatan — dan kedua arah
     muat di satu baris tanpa percabangan. */
  T({ baris: 4310, jalan: function (m) { m.v.X = m.v.X + (m.v['O$'] === 'N' ? -1 : 0) - (m.v['O$'] === 'S' ? -1 : 0); } });
  T({ baris: 4320, jalan: function (m) { m.v.Y = m.v.Y + (m.v['O$'] === 'W' ? -1 : 0) - (m.v['O$'] === 'E' ? -1 : 0); } });
  T({ baris: 4330, jalan: function (m) { m.v['X'] = FNB(m,  (m.v['X'] || 0) ); } });
  T({ baris: 4340, jalan: function (m) { m.v['Y'] = FNB(m,  (m.v['Y'] || 0) ); } });
  T({ baris: 4350, jalan: function (m) { m.lompat(6370); } });
  T({ baris: 4360, jalan: function (m) { if (m.v['L()'][FND(m, m.v.Z)] === 3) { m.v.Z = m.v.Z - 1; m.lompat(6370); } } });
  T({ baris: 4370, jalan: function (m) { m.v['Z$'] = 'Up'; } });
  T({ baris: 4380, jalan: function (m) { m.lompat(4410); } });
  T({ baris: 4390, jalan: function (m) { m.v['Z$'] = 'Down'; } });
  T({ baris: 4400, jalan: function (m) { if (m.v['L()'][FND(m, m.v.Z)] === 4) { m.v.Z = m.v.Z + 1; m.lompat(6370); } } });
  T({ baris: 4410, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4420, jalan: function (m) {
      m.warna(11, 0);
      m.cetak('** There are no stairs going ' + m.v['Z$'] + ' from here!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 4430, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 4440, jalan: function (m) { if ((m.v['BL'] || 0) !== 1) m.lompat(4520); } });
  T({ baris: 4450, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4460, jalan: function (m) {
      m.warna(11, 0);
      m.cetak("** You can't see anything " + m.v['R$()'][m.v.RC] + '!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 4470, jalan: function (m) { m.lompat(2970); } });
  rem(4480);
  rem(4490);
  rem(4500);
  T({ baris: 4510, jalan: function (m) { m.warna(6, 0); } });
  T({ baris: 4520, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4530, jalan: function (m) { m.v['A'] = (m.v['X'] || 0); m.v['B'] = (m.v['Y'] || 0); } });
  T({ baris: 4540, jalan: function (m) { m.untuk('X', 1, 8, 1); } });
  T({ baris: 4550, jalan: function (m) { m.untuk('Y', 1, 8, 1); } });
  T({ baris: 4560, jalan: function (m) { m.v['Q'] = m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ]; } });
  /* 4570 DUA penugasan ke Q, berurutan, di baris yang sama — dan yang pertama
     LANGSUNG DIBUANG oleh yang kedua. `Q=Q-100` melepas penanda 'belum
     dilihat', lalu `LET Q=34` menimpanya dengan nomor ruang kosong.
     Komentarnya sendiri, `REM TO HIDE ROOMS`, menjelaskan maksudnya: ruang
     yang belum dilihat digambar sebagai ruang tak dikenal. Tapi pengurangan
     100-nya tidak berguna sama sekali, dan ia tetap di sana. */
  T({ baris: 4570, jalan: function (m) { if (m.v.Q > 99) { m.v.Q = m.v.Q - 100; m.v.Q = 34; } } });
  /* 4580 Tanda kurung siku menandai tempat pemain berdiri di peta. Dan `COLOR 3,0,1`
     di ujung baris ini TIDAK PERNAH dijalankan — ia berada sesudah GOTO. */
  T({ baris: 4580, jalan: function (m) {
      m.warna(6, 0);
      if (m.v.X === m.v.A && m.v.Y === m.v.B) {
        m.cetak('<' + m.v['I$()'][m.v.Q] + '>  '); m.lompat(4600);
      }
    } });
  T({ baris: 4590, jalan: function (m) { m.warna(6, 0); m.cetak(' ' + m.v['I$()'][m.v.Q] + '   '); m.warna(3, 0); } });
  T({ baris: 4600, jalan: function (m) { m.lanjutkan('Y'); } });
  T({ baris: 4610, jalan: function (m) { m.warna(3, 0); m.barisBaru(); } });
  T({ baris: 4620, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4630, jalan: function (m) { m.lanjutkan('X'); } });
  T({ baris: 4640, jalan: function (m) { m.v['X'] = (m.v['A'] || 0); m.v['Y'] = (m.v['B'] || 0); } });
  T({ baris: 4650, jalan: function (m) { m.lompat(4890); } });
  T({ baris: 4660, jalan: function (m) {
      m.warna(12, 0); m.cetak(') level' + bas(m.v.Z));
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 4670, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 4680, jalan: function (m) { if ((m.v['FL'] || 0) !== 0) m.lompat(4740); } });
  T({ baris: 4690, jalan: function (m) { m.warna(11, 0); m.cetak("** You can't, you're out of flares!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 4700, jalan: function (m) { m.lompat(2970); } });
  rem(4710);
  rem(4720);
  rem(4730);
  T({ baris: 4740, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4750, jalan: function (m) { m.v['FL'] = (m.v['FL'] || 0) - 1; } });
  T({ baris: 4760, jalan: function (m) { m.v['A'] = (m.v['X'] || 0); m.v['B'] = (m.v['Y'] || 0); } });
  T({ baris: 4770, jalan: function (m) { m.untuk('Q1', (m.v['A'] || 0) - 1, (m.v['A'] || 0) + 1, 1); } });
  T({ baris: 4780, jalan: function (m) { m.v['X'] = FNB(m,  (m.v['Q1'] || 0) ); } });
  T({ baris: 4790, jalan: function (m) { m.untuk('Q2', (m.v['B'] || 0) - 1, (m.v['B'] || 0) + 1, 1); } });
  T({ baris: 4800, jalan: function (m) { m.v['Y'] = FNB(m,  (m.v['Q2'] || 0) ); } });
  T({ baris: 4810, jalan: function (m) { m.v['Q'] = FNE(m,  m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] ); } });
  T({ baris: 4820, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = (m.v['Q'] || 0); } });
  T({ baris: 4830, jalan: function (m) { m.warna(12, 0); m.cetak(' ' + m.v['I$()'][m.v.Q] + '   '); m.warna(3, 0); } });
  T({ baris: 4840, jalan: function (m) { m.lanjutkan('Q2'); } });
  T({ baris: 4850, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4860, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4870, jalan: function (m) { m.lanjutkan('Q1'); } });
  T({ baris: 4880, jalan: function (m) { m.v['X'] = (m.v['A'] || 0); m.v['Y'] = (m.v['B'] || 0); } });
  T({ baris: 4890, jalan: function (m) { m.gosub(11020); } });
  T({ baris: 4900, jalan: function (m) { m.lompat(2970); } });
  rem(4910);
  rem(4920);
  rem(4930);
  T({ baris: 4940, jalan: function (m) { if ((m.v['LF'] || 0) !== 0) m.lompat(4980); } });
  T({ baris: 4950, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4960, jalan: function (m) {
      m.warna(11, 0);
      m.cetak("** You don't have a lamp, " + m.v['R$()'][m.v.RC] + '!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 4970, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 4980, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 4990, jalan: function (m) { m.cetak("Where do you want to shine the lamp (N,S,E,W)"); } });
  T({ baris: 5000, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 5010, jalan: function (m) { m.v['A'] = (m.v['X'] || 0); m.v['B'] = (m.v['Y'] || 0); } });
  /* 5020 Lampu menyorot ke ruang sebelah, dan `FNB` MEMBUNGKUS koordinatnya: keluar
     di sisi satu berarti masuk di sisi seberangnya. Kastilnya berbentuk
     donat, dan seluruh bentuk itu ada di satu fungsi satu baris. */
  T({ baris: 5020, jalan: function (m) { m.v.X = FNB(m, m.v.X + (m.v['O$'] === 'N' ? -1 : 0) - (m.v['O$'] === 'S' ? -1 : 0)); } });
  T({ baris: 5030, jalan: function (m) { m.v.Y = FNB(m, m.v.Y + (m.v['O$'] === 'W' ? -1 : 0) - (m.v['O$'] === 'E' ? -1 : 0)); } });
  T({ baris: 5040, jalan: function (m) { if ((m.v['A'] || 0) - (m.v['X'] || 0) + (m.v['B'] || 0) - (m.v['Y'] || 0) !== 0) m.lompat(5080); } });
  T({ baris: 5050, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5060, jalan: function (m) {
      m.warna(11, 0);
      m.cetak("** That's not a direction " + m.v['R$()'][m.v.RC] + '!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 5070, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 5080, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5090, jalan: function (m) { m.cetak("The lamp shines into ("); m.cetak(bas((m.v["X"] || 0))); m.cetak(","); m.cetak(bas((m.v["Y"] || 0))); m.cetak(") level"); m.cetak(bas((m.v["Z"] || 0))); m.cetak("."); m.barisBaru(); } });
  T({ baris: 5100, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5110, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = FNE(m,  m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] ); } });
  T({ baris: 5120, jalan: function (m) {
      m.cetak('There you will find ' +
              m.v['C$()'][m.v['L()'][FND(m, m.v.Z)]] + '.'); m.barisBaru();
    } });
  T({ baris: 5130, jalan: function (m) { m.v['X'] = (m.v['A'] || 0); m.v['Y'] = (m.v['B'] || 0); } });
  T({ baris: 5140, jalan: function (m) { m.lompat(2970); } });
  rem(5150);
  rem(5160);
  rem(5170);
  T({ baris: 5180, jalan: function (m) { if (m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] === 5) m.lompat(5220); } });
  T({ baris: 5190, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5200, jalan: function (m) { m.warna(11, 0); m.cetak("** There is no pool to drink from here!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 5210, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 5220, jalan: function (m) { m.v['Q'] = FNA(m,  8 ); } });
  T({ baris: 5230, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5240, jalan: function (m) { m.cetak("You take a drink and "); } });
  T({ baris: 5250, jalan: function (m) { if (m.v.Q < 7) m.cetak('feel '); } });
  T({ baris: 5260, jalan: function (m) { var tj = [5270, 5280, 5290, 5300, 5310, 5320, 5330, 5350][(m.v["Q"] || 0) - 1]; if (tj) m.lompat(tj); } });
  T({ baris: 5270, jalan: function (m) { m.v["ST"] = FNC(m,  (m.v['ST'] || 0) + FNA(m,  3 ) ); m.cetak("stronger."); m.barisBaru(); m.lompat(2970); } });
  /* 5280 `ON (1-(ST<1)) GOTO 2880,9120` — perbandingan sebagai INDEKS lagi. Kalau
     kekuatannya masih positif, syaratnya 0 dan indeksnya 1; kalau habis,
     syaratnya −1 dan indeksnya 2, yang menuju layar kematian. */
  T({ baris: 5280, jalan: function (m) {
      m.v.ST = m.v.ST - FNA(m, 3); m.warna(15, 0);
      m.cetak('weaker.'); m.barisBaru(); m.warna(7, 0);
      var tj = [2880, 9120][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);
    } });
  T({ baris: 5290, jalan: function (m) { m.v["IQ"] = FNC(m,  (m.v['IQ'] || 0) + FNA(m,  3 ) ); m.cetak("smarter."); m.barisBaru(); m.lompat(2970); } });
  T({ baris: 5300, jalan: function (m) {
      m.v.IQ = m.v.IQ - FNA(m, 3); m.warna(11, 0);
      m.cetak('dumber.'); m.barisBaru(); m.warna(3, 0);
      var tj = [2970, 9590][(1 - (m.v.IQ < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);
    } });
  T({ baris: 5310, jalan: function (m) { m.v["DX"] = FNC(m,  (m.v['DX'] || 0) + FNA(m,  3 ) ); m.cetak("faster."); m.barisBaru(); m.lompat(2970); } });
  T({ baris: 5320, jalan: function (m) {
      m.v.DX = m.v.DX - FNA(m, 3); m.warna(11, 0);
      m.cetak('clumsier.'); m.barisBaru(); m.warna(3, 0);
      var tj = [2970, 9590][(1 - (m.v.DX < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);
    } });
  T({ baris: 5330, jalan: function (m) { m.v.Q = FNA(m, 4); if (m.v.Q === m.v.RC) m.lompat(5330); } });
  T({ baris: 5340, jalan: function (m) {
      m.v.RC = m.v.Q;
      m.cetak('become a ' + m.v['R$()'][m.v.RC] + '.'); m.barisBaru();
      m.lompat(2970);
    } });
  /* 5350 Kelamin disimpan sebagai 0 atau 1, dan dibalik dengan `SX=1-SX`. Lalu
     kata 'female' dibangun dengan mencetak 'fe' lebih dulu kalau perlu —
     dua huruf, bukan dua kalimat. */
  T({ baris: 5350, jalan: function (m) {
      m.v.SX = 1 - m.v.SX; m.cetak('turn into a ');
      if (m.v.SX === 0) m.cetak('fe');
    } });
  T({ baris: 5360, jalan: function (m) {
      m.cetak('male ' + m.v['R$()'][m.v.RC] + '!'); m.barisBaru();
      m.lompat(2970);
    } });
  T({ baris: 5370, jalan: function (m) { if (m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] !== 6) m.lompat(5410); } });
  T({ baris: 5380, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5390, jalan: function (m) { m.cetak("You open the chest and"); m.barisBaru(); } });
  T({ baris: 5400, jalan: function (m) { m.lompat(5670); } });
  T({ baris: 5410, jalan: function (m) { if (m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] !== 12) m.lompat(5450); } });
  T({ baris: 5420, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5430, jalan: function (m) { m.cetak("You open the book and"); m.barisBaru(); } });
  T({ baris: 5440, jalan: function (m) { m.lompat(5480); } });
  T({ baris: 5450, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5460, jalan: function (m) { m.warna(11, 0); m.cetak("** there is nothing to open here."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 5470, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 5480, jalan: function (m) {
      var tj = [5490, 5520, 5540, 5560, 5590, 5620][FNA(m, 6) - 1];
      if (tj) m.lompat(tj);
    } });
  T({ baris: 5490, jalan: function (m) {
      m.warna(0, 15); m.cls();
      m.cetak('Flash! Oh no! you are now a blind ' +
              m.v['R$()'][m.v.RC] + '!'); m.barisBaru();
    } });
  T({ baris: 5500, jalan: function (m) { m.v['BL'] = 1; } });
  T({ baris: 5510, jalan: function (m) { m.lompat(5650); } });
  T({ baris: 5520, jalan: function (m) { m.cetak("It's another volume of Nurúcc's poetry! - YECH!!"); m.barisBaru(); } });
  T({ baris: 5530, jalan: function (m) { m.lompat(5650); } });
  /* 5540 Lelucon yang cuma bekerja karena nama bangsanya dipakai sebagai kata benda:
     Playhobbit, Playelf, Playhuman, Playdwarf. */
  T({ baris: 5540, jalan: function (m) {
      m.cetak("It's an old copy of Play" + m.v['R$()'][FNA(m, 4)] + '!');
      m.barisBaru();
    } });
  T({ baris: 5550, jalan: function (m) { m.lompat(5650); } });
  T({ baris: 5560, jalan: function (m) { m.cetak("It's a manual of dexterity!"); m.barisBaru(); } });
  T({ baris: 5570, jalan: function (m) { m.v['DX'] = 18; } });
  T({ baris: 5580, jalan: function (m) { m.lompat(5650); } });
  T({ baris: 5590, jalan: function (m) { m.cetak("It's a manual of strength!"); m.barisBaru(); } });
  T({ baris: 5600, jalan: function (m) { m.v['ST'] = 18; } });
  T({ baris: 5610, jalan: function (m) { m.lompat(5650); } });
  T({ baris: 5620, jalan: function (m) { m.warna(11, 0); m.cetak("The book sticks to your hands -"); m.barisBaru(); } });
  T({ baris: 5630, jalan: function (m) { m.cetak("now you are unable to draw your weapon!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 5640, jalan: function (m) { m.v['BF'] = 1; } });
  T({ baris: 5650, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = 1; } });
  T({ baris: 5660, jalan: function (m) { m.lompat(2970); } });
  /* 5670 Empat kemungkinan, tapi tujuan kedua dan keempat SAMA — jadi peluangnya
     bukan seperempat merata melainkan 1:2:1. Pembobotan yang ditulis sebagai
     pengulangan alamat. */
  T({ baris: 5670, jalan: function (m) { var tj = [5680, 5730, 5770, 5730][FNA(m, 4) - 1]; if (tj) m.lompat(tj); } });
  T({ baris: 5680, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5690, jalan: function (m) { m.warna(14, 0); m.cetak("KABOOM!"); m.warna(3, 0); m.cetak(" it explodes!!"); m.barisBaru(); } });
  T({ baris: 5700, jalan: function (m) { m.v['Q'] = FNA(m,  6 ); } });
  T({ baris: 5710, jalan: function (m) { m.gosub(9490); } });
  T({ baris: 5720, jalan: function (m) { var tj = [5650, 9590][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj); } });
  T({ baris: 5730, jalan: function (m) { m.v['Q'] = FNA(m,  1000 ); } });
  T({ baris: 5740, jalan: function (m) { m.cetak("find"); m.cetak(bas((m.v["Q"] || 0))); m.cetak("gold pieces!"); m.barisBaru(); } });
  T({ baris: 5750, jalan: function (m) { m.v['GP!'] = m.v['GP!'] + m.v.Q; } });
  T({ baris: 5760, jalan: function (m) { m.lompat(5650); } });
  T({ baris: 5770, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5780, jalan: function (m) { m.warna(5, 0); m.cetak("GAS!!"); m.warna(3, 0); m.cetak("you stagger from the room!"); m.barisBaru(); } });
  T({ baris: 5790, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = 1; } });
  T({ baris: 5800, jalan: function (m) { m.v['T'] = (m.v['T'] || 0) + 20; } });
  /* 5810 Arah acak diambil sebagai satu aksara dari string 'NSEW'. Tabel arah yang
     panjangnya empat aksara. */
  T({ baris: 5810, jalan: function (m) { m.v['O$'] = 'NSEW'.charAt(FNA(m, 4) - 1); } });
  T({ baris: 5820, jalan: function (m) { m.lompat(4310); } });
  T({ baris: 5830, jalan: function (m) { if (m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] === 11) m.lompat(5870); } });
  T({ baris: 5840, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5850, jalan: function (m) { m.warna(11, 0); m.cetak("**You need an orb to use the gaze command!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 5860, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 5870, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 5880, jalan: function (m) { m.cetak("You see "); } });
  T({ baris: 5890, jalan: function (m) {
      var tj = [5900, 5920, 5940, 5960, 6030, 6070][FNA(m, 6) - 1];
      if (tj) m.lompat(tj);
    } });
  T({ baris: 5900, jalan: function (m) { m.cetak("Yourself in a bloody mess!"); m.barisBaru(); } });
  T({ baris: 5910, jalan: function (m) {
      m.v.ST = m.v.ST - FNA(m, 2);
      var tj = [2970, 9590][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);
    } });
  T({ baris: 5920, jalan: function (m) {
      m.cetak('Yourself drinking from a pool and becoming ' +
              m.v['C$()'][12 + FNA(m, 13)] + '!'); m.barisBaru();
    } });
  T({ baris: 5930, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 5940, jalan: function (m) {
      m.cetak(m.v['C$()'][12 + FNA(m, 13)] + ' gazing back at you!');
      m.barisBaru();
    } });
  T({ baris: 5950, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 5960, jalan: function (m) { m.v['A'] = (m.v['X'] || 0); m.v['B'] = (m.v['Y'] || 0); m.v['C'] = (m.v['Z'] || 0); } });
  T({ baris: 5970, jalan: function (m) { m.v['X'] = FNA(m,  8 ); m.v['Y'] = FNA(m,  8 ); m.v['Z'] = FNA(m,  8 ); } });
  T({ baris: 5980, jalan: function (m) { m.v['Q'] = FNE(m,  m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] ); } });
  T({ baris: 5990, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = (m.v['Q'] || 0); } });
  T({ baris: 6000, jalan: function (m) { m.cetak(m.v["C$()"][ (m.v["Q"] || 0) ]); m.cetak(" at ("); m.cetak(bas((m.v["X"] || 0))); m.cetak(","); m.cetak(bas((m.v["Y"] || 0))); m.cetak(") level"); m.cetak(bas((m.v["Z"] || 0))); m.cetak("."); m.barisBaru(); } });
  T({ baris: 6010, jalan: function (m) { m.v['X'] = (m.v['A'] || 0); m.v['Y'] = (m.v['B'] || 0); m.v['Z'] = (m.v['C'] || 0); } });
  T({ baris: 6020, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 6030, jalan: function (m) { m.v['A'] = FNA(m,  8 ); m.v['B'] = FNA(m,  8 ); m.v['C'] = FNA(m,  8 ); } });
  /* 6040 BOLA KRISTALNYA BERBOHONG. Peluang tiga dari delapan ia menunjukkan letak
     Jimat Chaos yang SEBENARNYA; lima dari delapan yang tercetak angka acak
     yang sudah disiapkan baris sebelumnya. Dan tidak ada apa pun di layar
     yang membedakan keduanya. */
  T({ baris: 6040, jalan: function (m) {
      if (FNA(m, 8) < 4) {
        m.v.A = m.v['O()'][1]; m.v.B = m.v['O()'][2]; m.v.C = m.v['O()'][3];
      }
    } });
  T({ baris: 6050, jalan: function (m) {
      m.warna(12, 0);
      m.cetak('The Amulet of Chaos at (' + bas(m.v.A) + ',' +
              bas(m.v.B) + ') level' + bas(m.v.C) + '!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 6060, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 6070, jalan: function (m) { m.cetak("a soap opera rerun!"); m.barisBaru(); } });
  T({ baris: 6080, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 6090, jalan: function (m) { if ((m.v['RF'] || 0) !== 0) m.lompat(6130); } });
  T({ baris: 6100, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6110, jalan: function (m) { m.warna(11, 0); m.cetak("** You can't teleport without the Runestaff!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 6120, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 6130, jalan: function (m) { m.v['Z$'] = 'X-Coordinate'; } });
  T({ baris: 6140, jalan: function (m) { m.gosub(10850); } });
  T({ baris: 6150, jalan: function (m) { m.v['X'] = (m.v['Q'] || 0); } });
  T({ baris: 6160, jalan: function (m) { m.v['Z$'] = 'Y-Coordinate'; } });
  T({ baris: 6170, jalan: function (m) { m.gosub(10850); } });
  T({ baris: 6180, jalan: function (m) { m.v['Y'] = (m.v['Q'] || 0); } });
  T({ baris: 6190, jalan: function (m) { m.v['Z$'] = 'Z-Coordinate'; } });
  T({ baris: 6200, jalan: function (m) { m.gosub(10850); } });
  T({ baris: 6210, jalan: function (m) { m.v['Z'] = (m.v['Q'] || 0); } });
  T({ baris: 6220, jalan: function (m) { m.v['O$'] = 'T'; } });
  T({ baris: 6230, jalan: function (m) { m.lompat(6370); } });
  T({ baris: 6240, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6250, jalan: function (m) { m.cetak("Do you really want to quit now?"); } });
  T({ baris: 6260, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 6270, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6280, jalan: function (m) { if ((m.v["O$"] || '') === "Y") m.lompat(6310); } });
  T({ baris: 6290, jalan: function (m) { m.warna(11, 0); m.cetak("** Then don't say that you do!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 6300, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 6310, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6320, jalan: function (m) { m.lompat(9870); } });
  rem(6330);
  rem(6340);
  rem(6350);
  T({ baris: 6360, jalan: function (m) { m.cls(); } });
  T({ baris: 6370, jalan: function (m) { m.warna(3, 0); m.barisBaru(); } });
  T({ baris: 6380, jalan: function (m) { if (m.v.BL === 0) { m.gosub(11020); } } });
  T({ baris: 6390, jalan: function (m) { m.locate(24, 1); m.warna(3, 0); } });
  T({ baris: 6400, jalan: function (m) { m.cetak("Strength ="); m.cetak(bas((m.v["ST"] || 0))); m.cetak(" Intelligence ="); m.cetak(bas((m.v["IQ"] || 0))); m.cetak(" Dexterity ="); m.cetak(bas((m.v["DX"] || 0))); m.barisBaru(); } });
  T({ baris: 6410, jalan: function (m) {
      m.cetak('Treasures =' + bas(m.v.TC) + ' Flares =' + bas(m.v.FL) +
              ' Gold Pieces =' + bas(m.v['GP!'])); m.barisBaru();
    } });
  /* 6420 Satu larik `W$` menyimpan EMPAT senjata dan EMPAT zirah berurutan, dan yang
     memisahkannya cuma pergeseran indeks: `WV+1` untuk senjata, `AV+5` untuk
     zirah. Delapan nama di satu larik, dua kelompok, nol tabel. */
  T({ baris: 6420, jalan: function (m) {
      m.cetak('Turns =' + bas(m.v.T) + '  Weapon = ' + m.v['W$()'][m.v.WV + 1] +
              '  Armor = ' + m.v['W$()'][m.v.AV + 5]);
    } });
  T({ baris: 6430, jalan: function (m) { if (m.v.LF === 1) { m.cetak('  and a lamp'); m.barisBaru(); } } });
  T({ baris: 6440, jalan: function (m) { if (m.v.LF === 0) { m.cetak('   '); m.barisBaru(); } } });
  /* 6450 SKORNYA BERNAMA JOHN. Variabel `JOHN!` — nama penulisnya sendiri, John
     Belew — dan baris 12100 nanti menyebut angka 142.498 sebagai skor
     miliknya yang harus diganti kalau ada yang mengalahkannya. */
  T({ baris: 6450, jalan: function (m) {
      m.v['JOHN!'] = m.v.IQ * 100 + m.v.ST * 100 + m.v.DX * 100 +
                    (m.v['KM!'] || 0) + (m.v.FTRS || 0) + (m.v.REQ || 0) +
                    m.v['GP!'] - m.v.T * 5;
    } });
  rem(6460);
  rem(6470);
  T({ baris: 6480, jalan: function (m) { m.cetak('Score =' + bas(m.v['JOHN!'])); } });
  T({ baris: 6490, jalan: function (m) { m.cetak("  Status = "); } });
  T({ baris: 6500, jalan: function (m) { m.v['EQUZ'] = 0; } });
  T({ baris: 6510, jalan: function (m) { if (m.v.BL === 1) { m.cetak('-Blinded'); m.barisBaru(); m.v.EQUZ = 1; } } });
  T({ baris: 6520, jalan: function (m) {
      if (m.v.BF === 1) {
        m.cetak('-Unable to draw weapon'); m.barisBaru(); m.v.EQUZ = 1;
      }
    } });
  T({ baris: 6530, jalan: function (m) { if ((m.v.EQUZ || 0) === 0) { m.cetak('-Normal'); m.barisBaru(); } } });
  T({ baris: 6540, jalan: function (m) { m.v['MAGICAL'] = 0; } });
  T({ baris: 6550, jalan: function (m) { m.cetak("You are carrying "); } });
  T({ baris: 6560, jalan: function (m) {
      if (m.v.OF === 1) {
        m.warna(12, 0); m.cetak('The Amulet of Chaos'); m.barisBaru();
        m.warna(3, 0); m.v.MAGICAL = 1;
      }
    } });
  T({ baris: 6570, jalan: function (m) { if (m.v.RF === 1) { m.cetak('The Runestaff'); m.barisBaru(); m.v.MAGICAL = 1; } } });
  T({ baris: 6580, jalan: function (m) {
      if ((m.v.MAGICAL || 0) === 0) {
        m.cetak('no magical items at the moment'); m.barisBaru();
      }
    } });
  T({ baris: 6590, jalan: function (m) { m.v['QXYZ'] = 0; } });
  T({ baris: 6600, jalan: function (m) { m.cetak("The treasures you carry are "); } });
  T({ baris: 6610, jalan: function (m) { m.untuk('Q', 1, 8, 1); } });
  T({ baris: 6620, jalan: function (m) {
      if (m.v['T()'][m.v.Q] === 1) {
        m.cetak(m.v['C$()'][m.v.Q + 25]); m.barisBaru(); m.v.QXYZ = 1;
      }
    } });
  T({ baris: 6630, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 6640, jalan: function (m) { if ((m.v.QXYZ || 0) === 0) { m.cetak('nothing'); m.barisBaru(); } } });
  T({ baris: 6650, jalan: function (m) { if (m.v.COME === 1) m.lompat(6670); } });
  /* 6660 Lima ratus giliran, dan sesudah itu Drow kembali. Batas waktu satu-satunya
     di seluruh permainan, disebut sekali di baris 2040 dan diperiksa di sini. */
  T({ baris: 6660, jalan: function (m) { if (m.v.T > 500) m.lompat(11380); } });
  T({ baris: 6670, jalan: function (m) { m.v['WC'] = 0; } });
  T({ baris: 6680, jalan: function (m) { m.v['Q'] = FNE(m,  m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] ); } });
  T({ baris: 6690, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = (m.v['Q'] || 0); } });
  T({ baris: 6700, jalan: function (m) { m.v['Z$'] = 'You now have '; } });
  T({ baris: 6710, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6720, jalan: function (m) { m.cetak("Here you find "); m.cetak(m.v["C$()"][ (m.v["Q"] || 0) ]); m.cetak("."); m.barisBaru(); } });
  T({ baris: 6730, jalan: function (m) { if (m.v.Q < 7 || m.v.Q === 11 || m.v.Q === 12) m.lompat(2970); } });
  T({ baris: 6740, jalan: function (m) {
      if (m.v.Q === 7) {
        m.v['GP!'] = m.v['GP!'] + FNA(m, 10);
        m.cetak(m.v['Z$'] + bas(m.v['GP!']) + '.'); m.barisBaru();
        m.lompat(5650);
      }
    } });
  T({ baris: 6750, jalan: function (m) {
      if (m.v.Q === 8) {
        m.v.FL = m.v.FL + FNA(m, 5);
        m.cetak(m.v['Z$'] + bas(m.v.FL) + '.'); m.barisBaru();
        m.lompat(5650);
      }
    } });
  T({ baris: 6760, jalan: function (m) { if ((m.v['Q'] || 0) > 9) m.lompat(6790); } });
  /* 6770 Jimat Chaos MENYAMAR JADI WARP. Ruangnya bernomor sama dengan warp biasa,
     dan yang membedakan cuma pemeriksaan koordinat di baris ini — dan hanya
     kalau pemain datang lewat teleportasi. Persis trik yang sama dengan
     WIZARD.BAS. */
  T({ baris: 6770, jalan: function (m) {
      if (m.v['O()'][1] === m.v.X && m.v['O()'][2] === m.v.Y &&
          m.v['O()'][3] === m.v.Z) {
        var tj = [4310, 10190][(1 - (m.v['O$'] === 'T' ? -1 : 0)) - 1];
        if (tj) m.lompat(tj);
      }
    } });
  T({ baris: 6780, jalan: function (m) { m.v["X"] = FNA(m,  8 ); m.v["Y"] = FNA(m,  8 ); m.v["Z"] = FNA(m,  8 ); m.lompat(6370); } });
  T({ baris: 6790, jalan: function (m) { if (m.v.Q === 10) { m.v.Z = FNB(m, m.v.Z + 1); m.lompat(6370); } } });
  T({ baris: 6800, jalan: function (m) { if (m.v.Q <= 25 || m.v.Q >= 34) m.lompat(6860); } });
  T({ baris: 6810, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6820, jalan: function (m) { m.cetak("It's now yours!"); m.barisBaru(); } });
  T({ baris: 6830, jalan: function (m) { m.v['T()'][ (m.v['Q'] || 0) - 25 ] = 1; } });
  T({ baris: 6840, jalan: function (m) { m.v['TC'] = (m.v['TC'] || 0) + 1; } });
  T({ baris: 6850, jalan: function (m) { m.lompat(5650); } });
  T({ baris: 6860, jalan: function (m) { m.v['A'] = m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] - 12; } });
  T({ baris: 6870, jalan: function (m) { m.v['WC'] = 0; } });
  T({ baris: 6880, jalan: function (m) { if (m.v.A < 13 || m.v.VF === 1) m.lompat(8070); } });
  T({ baris: 6890, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6900, jalan: function (m) { m.cetak("You may trade with, attack, or ignore the Drow Merchant."); m.barisBaru(); } });
  T({ baris: 6910, jalan: function (m) { m.gosub(10690); } });
  T({ baris: 6920, jalan: function (m) { if ((m.v["O$"] || '') === "I") m.lompat(2970); } });
  T({ baris: 6930, jalan: function (m) { if ((m.v["O$"] || '') !== "A") m.lompat(6980); } });
  T({ baris: 6940, jalan: function (m) { m.v['VF'] = 1; } });
  T({ baris: 6950, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 6960, jalan: function (m) { m.warna(3, 0); m.cetak("You'll be sorry that you did that!"); m.barisBaru(); } });
  T({ baris: 6970, jalan: function (m) { m.lompat(8070); } });
  T({ baris: 6980, jalan: function (m) { if ((m.v["O$"] || '') === "T") m.lompat(7020); } });
  T({ baris: 6990, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7000, jalan: function (m) {
      m.warna(11, 0);
      m.cetak('** Nice shot ' + m.v['R$()'][m.v.RC] + '!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 7010, jalan: function (m) { m.lompat(6890); } });
  T({ baris: 7020, jalan: function (m) { m.untuk('Q', 1, 8, 1); } });
  T({ baris: 7030, jalan: function (m) { m.v['A'] = FNA(m,  (m.v['Q'] || 0) * 1500 ); } });
  T({ baris: 7040, jalan: function (m) { if (m.v['T()'][ (m.v['Q'] || 0) ] === 0) m.lompat(7100); } });
  T({ baris: 7050, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7060, jalan: function (m) {
      m.cetak('Do you want to sell ' + m.v['C$()'][m.v.Q + 25] + ' for ' +
              bas(m.v.A) + "gp's");
    } });
  T({ baris: 7070, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 7080, jalan: function (m) {
      if (m.v['O$'] === 'Y') {
        m.v.TC = m.v.TC - 1; m.v['T()'][m.v.Q] = 0;
        m.v['GP!'] = m.v['GP!'] + m.v.A; m.lompat(7100);
      }
    } });
  T({ baris: 7090, jalan: function (m) { if ((m.v["O$"] || '') !== "N") { m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.lompat(7050); } } });
  T({ baris: 7100, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 7110, jalan: function (m) { if ((m.v['GP!'] || 0) >= 1000) m.lompat(7150); } });
  T({ baris: 7120, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7130, jalan: function (m) { m.cetak("You're too poor to trade, "); m.cetak(m.v["R$()"][ (m.v["RC"] || 0) ]); m.cetak("."); m.barisBaru(); } });
  T({ baris: 7140, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 7150, jalan: function (m) { if ((m.v['GP!'] || 0) < 1250) m.lompat(7650); } });
  T({ baris: 7160, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7170, jalan: function (m) {
      m.cetak('OK ' + m.v['R$()'][m.v.RC] + ', you have ' + bas(m.v['GP!']) +
              "gp's and " + m.v['W$()'][m.v.AV + 5] + ' armor.');
      m.barisBaru();
    } });
  T({ baris: 7180, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7190, jalan: function (m) { m.v['Z$'] = 'Armor'; } });
  T({ baris: 7200, jalan: function (m) { m.gosub(10990); } });
  T({ baris: 7210, jalan: function (m) { m.cetak("Nothing:0gp's Leather:1250gp's "); } });
  T({ baris: 7220, jalan: function (m) { if (m.v['GP!'] > 1499) m.cetak("Chainmail:1500:gp's "); } });
  T({ baris: 7230, jalan: function (m) { if (m.v['GP!'] > 1999) m.cetak("Plate Mail:2000gp's "); } });
  T({ baris: 7240, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7250, jalan: function (m) { m.gosub(10690); } });
  T({ baris: 7260, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7270, jalan: function (m) { if ((m.v["O$"] || '') === "N") m.lompat(7400); } });
  T({ baris: 7280, jalan: function (m) {
      if (m.v['O$'] === 'L') {
        m.v['GP!'] = m.v['GP!'] - 1250; m.v.AV = 1; m.v.AH = 7; m.lompat(7400);
      }
    } });
  T({ baris: 7290, jalan: function (m) { if (m.v['O$'] !== 'C' || m.v['GP!'] >= 1500) m.lompat(7320); } });
  T({ baris: 7300, jalan: function (m) { m.warna(11, 0); m.cetak("** You haven't got that much gold on hand!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 7310, jalan: function (m) { m.lompat(7180); } });
  T({ baris: 7320, jalan: function (m) {
      if (m.v['O$'] === 'C') {
        m.v['GP!'] = m.v['GP!'] - 1500; m.v.AV = 2; m.v.AH = 14; m.lompat(7400);
      }
    } });
  T({ baris: 7330, jalan: function (m) { if (m.v['O$'] !== 'P' || m.v['GP!'] >= 2000) m.lompat(7360); } });
  T({ baris: 7340, jalan: function (m) { m.warna(11, 0); m.cetak("** You can't afford plate mail!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 7350, jalan: function (m) { m.lompat(7180); } });
  T({ baris: 7360, jalan: function (m) {
      if (m.v['O$'] === 'P') {
        m.v['GP!'] = m.v['GP!'] - 2000; m.v.AV = 3; m.v.AH = 21; m.lompat(7400);
      }
    } });
  T({ baris: 7370, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7380, jalan: function (m) { m.warna(11, 0); m.cetak("** Choose a selection."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 7390, jalan: function (m) { m.lompat(7240); } });
  T({ baris: 7400, jalan: function (m) { if ((m.v['GP!'] || 0) < 1250) m.lompat(7650); } });
  T({ baris: 7410, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7420, jalan: function (m) {
      m.cetak('You have' + bas(m.v['GP!']) + "gp's left with " +
              m.v['W$()'][m.v.WV + 1] + ' in hand.'); m.barisBaru();
    } });
  T({ baris: 7430, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7440, jalan: function (m) { m.v['Z$'] = 'Weapon'; } });
  T({ baris: 7450, jalan: function (m) { m.gosub(10990); } });
  T({ baris: 7460, jalan: function (m) { m.cetak("Nothing:- Dagger:1250gp's"); } });
  T({ baris: 7470, jalan: function (m) { if (m.v['GP!'] > 1499) m.cetak("Mace:1500gp's"); } });
  T({ baris: 7480, jalan: function (m) { if (m.v['GP!'] > 1999) m.cetak("Sword:2000gp's"); } });
  T({ baris: 7490, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7500, jalan: function (m) { m.gosub(10690); } });
  T({ baris: 7510, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7520, jalan: function (m) { if ((m.v["O$"] || '') === "N") m.lompat(7650); } });
  T({ baris: 7530, jalan: function (m) {
      if (m.v['O$'] === 'D') {
        m.v['GP!'] = m.v['GP!'] - 1250; m.v.WV = 1; m.lompat(7650);
      }
    } });
  T({ baris: 7540, jalan: function (m) { if (m.v['O$'] !== 'M' || m.v['GP!'] >= 1500) m.lompat(7570); } });
  T({ baris: 7550, jalan: function (m) { m.warna(11, 0); m.cetak("** Sorry sir, I'm afraid I don't give credit!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 7560, jalan: function (m) { m.lompat(7430); } });
  T({ baris: 7570, jalan: function (m) {
      if (m.v['O$'] === 'M') {
        m.v['GP!'] = m.v['GP!'] - 1500; m.v.WV = 2; m.lompat(7650);
      }
    } });
  T({ baris: 7580, jalan: function (m) { if (m.v['O$'] !== 'S' || m.v['GP!'] >= 2000) m.lompat(7620); } });
  T({ baris: 7590, jalan: function (m) { m.warna(11, 0); m.cetak("** Your Dungeon Express Card - "); } });
  T({ baris: 7600, jalan: function (m) { m.cetak("You left home without it!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 7610, jalan: function (m) { m.lompat(7430); } });
  T({ baris: 7620, jalan: function (m) {
      if (m.v['O$'] === 'S') {
        m.v['GP!'] = m.v['GP!'] - 2000; m.v.WV = 3; m.lompat(7650);
      }
    } });
  T({ baris: 7630, jalan: function (m) { m.warna(11, 0); m.cetak("** Try choosing a selection!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 7640, jalan: function (m) { m.lompat(7490); } });
  T({ baris: 7650, jalan: function (m) { if ((m.v['GP!'] || 0) < 1000) m.lompat(2970); } });
  T({ baris: 7660, jalan: function (m) { m.v['Z$'] = 'Strength'; } });
  T({ baris: 7670, jalan: function (m) { m.gosub(10930); } });
  T({ baris: 7680, jalan: function (m) { if ((m.v["O$"] || '') !== "Y") m.lompat(7740); } });
  T({ baris: 7690, jalan: function (m) { m.v['GP!'] = m.v['GP!'] - 1000; } });
  T({ baris: 7700, jalan: function (m) { m.v['ST'] = FNC(m,  (m.v['ST'] || 0) + FNA(m,  6 ) ); } });
  T({ baris: 7710, jalan: function (m) { m.v['Q'] = (m.v['ST'] || 0); } });
  T({ baris: 7720, jalan: function (m) { m.gosub(10960); } });
  T({ baris: 7730, jalan: function (m) { m.lompat(7650); } });
  T({ baris: 7740, jalan: function (m) { if ((m.v["O$"] || '') !== "N") { m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.lompat(7660); } } });
  T({ baris: 7750, jalan: function (m) { if ((m.v['GP!'] || 0) < 1000) m.lompat(2970); } });
  T({ baris: 7760, jalan: function (m) { m.v['Z$'] = 'Intelligence'; } });
  T({ baris: 7770, jalan: function (m) { m.gosub(10930); } });
  T({ baris: 7780, jalan: function (m) { if ((m.v["O$"] || '') !== "Y") m.lompat(7840); } });
  T({ baris: 7790, jalan: function (m) { m.v['GP!'] = m.v['GP!'] - 1000; } });
  T({ baris: 7800, jalan: function (m) { m.v['IQ'] = FNC(m,  (m.v['IQ'] || 0) + FNA(m,  6 ) ); } });
  T({ baris: 7810, jalan: function (m) { m.v['Q'] = (m.v['IQ'] || 0); } });
  T({ baris: 7820, jalan: function (m) { m.gosub(10960); } });
  T({ baris: 7830, jalan: function (m) { m.lompat(7750); } });
  T({ baris: 7840, jalan: function (m) { if ((m.v["O$"] || '') !== "N") { m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.lompat(7760); } } });
  T({ baris: 7850, jalan: function (m) { if ((m.v['GP!'] || 0) < 1000) m.lompat(2970); } });
  T({ baris: 7860, jalan: function (m) { m.v['Z$'] = 'Dexterity'; } });
  T({ baris: 7870, jalan: function (m) { m.gosub(10930); } });
  T({ baris: 7880, jalan: function (m) { if ((m.v["O$"] || '') !== "Y") m.lompat(7940); } });
  T({ baris: 7890, jalan: function (m) { m.v['GP!'] = m.v['GP!'] - 1000; } });
  T({ baris: 7900, jalan: function (m) { m.v['DX'] = FNC(m,  (m.v['DX'] || 0) + FNA(m,  6 ) ); } });
  T({ baris: 7910, jalan: function (m) { m.v['Q'] = (m.v['DX'] || 0); } });
  T({ baris: 7920, jalan: function (m) { m.gosub(10960); } });
  T({ baris: 7930, jalan: function (m) { m.lompat(7850); } });
  T({ baris: 7940, jalan: function (m) { if ((m.v["O$"] || '') !== "N") { m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.lompat(7860); } } });
  T({ baris: 7950, jalan: function (m) { if (m.v['GP!'] < 1000 || m.v.LF === 1) m.lompat(2970); } });
  T({ baris: 7960, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 7970, jalan: function (m) { m.cetak("Do you want to buy a lamp for 1000 gp's"); } });
  T({ baris: 7980, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 7990, jalan: function (m) { if ((m.v["O$"] || '') !== "Y") m.lompat(8050); } });
  T({ baris: 8000, jalan: function (m) { m.v['GP!'] = m.v['GP!'] - 1000; } });
  T({ baris: 8010, jalan: function (m) { m.v['LF'] = 1; } });
  T({ baris: 8020, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8030, jalan: function (m) { m.cetak("It's guaranteed to outlive you!"); m.barisBaru(); } });
  T({ baris: 8040, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 8050, jalan: function (m) { if ((m.v["O$"] || '') !== "N") { m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.lompat(7960); } } });
  T({ baris: 8060, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 8070, jalan: function (m) { m.v['Q1'] = 1 + Math.floor( (m.v['A'] || 0) / 2 ); m.v['Q2'] = (m.v['A'] || 0) + 2; m.v['Q3'] = 1; } });
  /* 8080 Siapa yang menyerang lebih dulu ditentukan oleh kegesitan pemain melawan
     DUA lemparan dadu sembilan sisi — jadi rata-rata yang harus dikalahkan
     sepuluh, dan kegesitan maksimum delapan belas hampir selalu menang. */
  T({ baris: 8080, jalan: function (m) {
      if (m.v['C()'][1][4] > m.v['T()'][1] || m.v.BL === 1 ||
          m.v.DX < FNA(m, 9) + FNA(m, 9)) m.lompat(9100);
    } });
  T({ baris: 8090, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8100, jalan: function (m) {
      m.warna(3, 0);
      m.cetak("You're confronting " + m.v['C$()'][m.v.A + 12] + '!');
      m.barisBaru();
    } });
  T({ baris: 8110, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8120, jalan: function (m) { m.cetak("You may attack or retreat (strongly suggested!)."); m.barisBaru(); } });
  T({ baris: 8130, jalan: function (m) {
      if (m.v.Q3 === 1) {
        m.cetak('You can also attempt to bribe the creature.'); m.barisBaru();
      }
    } });
  T({ baris: 8140, jalan: function (m) {
      if (m.v.IQ > 14) {
        m.cetak('You can also cast a spell.'); m.barisBaru();
      }
    } });
  T({ baris: 8150, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8160, jalan: function (m) { m.cetak("Your strength is"); m.cetak(bas((m.v["ST"] || 0))); m.cetak("and your dexterity is"); m.cetak(bas((m.v["DX"] || 0))); m.cetak("."); m.barisBaru(); } });
  T({ baris: 8170, jalan: function (m) { m.gosub(10690); } });
  T({ baris: 8180, jalan: function (m) { if ((m.v["O$"] || '') !== "A") m.lompat(8590); } });
  T({ baris: 8190, jalan: function (m) { if ((m.v['WV'] || 0) !== 0) m.lompat(8230); } });
  T({ baris: 8200, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8210, jalan: function (m) {
      m.warna(11, 0);
      m.cetak('** Pounding on ' + m.v['C$()'][m.v.A + 12] +
              " won't hurt it!"); m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 8220, jalan: function (m) { m.lompat(9100); } });
  T({ baris: 8230, jalan: function (m) { if ((m.v['BF'] || 0) !== 1) m.lompat(8270); } });
  T({ baris: 8240, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8250, jalan: function (m) { m.warna(11, 0); m.cetak("** You can't kill it with a book, so I suggest you either attack or retreat!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 8260, jalan: function (m) { m.lompat(9100); } });
  T({ baris: 8270, jalan: function (m) { if ((m.v['DX'] || 0) >= FNA(m,  20 ) + ( 3 * (m.v['BL'] || 0) )) m.lompat(8310); } });
  T({ baris: 8280, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8290, jalan: function (m) {
      m.cetak('You barely missed the ' + m.v['C$()'][m.v.A + 12] + '!');
      m.barisBaru();
    } });
  T({ baris: 8300, jalan: function (m) { m.lompat(9100); } });
  /* 8310 8310-8320 nama monster disimpan lengkap dengan kata sandangnya — 'a Kobold',
     'an Orc'. Dua baris ini membuangnya: potong dua aksara pertama, lalu
     kalau yang tersisa masih diawali spasi (karena sandangnya 'an'), potong
     satu lagi. Kalimat yang butuh namanya telanjang mendapatkannya. */
  T({ baris: 8310, jalan: function (m) {
      var s = m.v['C$()'][m.v.A + 12] || '';
      m.v['Z$'] = s.slice(2);
    } });
  T({ baris: 8320, jalan: function (m) { if ((m.v['Z$'] || '').charAt(0) === ' ') m.v['Z$'] = m.v['Z$'].slice(1); } });
  T({ baris: 8330, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8340, jalan: function (m) { m.cetak("A valiant blow, you hit the "); m.cetak((m.v["Z$"] || '')); m.cetak("!"); m.barisBaru(); } });
  T({ baris: 8350, jalan: function (m) { m.v['Q2'] = (m.v['Q2'] || 0) - (m.v['WV'] || 0); } });
  T({ baris: 8360, jalan: function (m) { if (m.v.A !== 9 && m.v.A !== 12) m.lompat(8410); } });
  T({ baris: 8370, jalan: function (m) { if (FNA(m,  8 ) !== 1) m.lompat(8410); } });
  T({ baris: 8380, jalan: function (m) { m.barisBaru(); } });
  /* 8390 Hanya dua monster yang bisa mematahkan senjata: nomor 9 dan 12. Keduanya
     diperiksa dengan satu baris, dan tidak ada apa pun yang menyebut nama
     mereka. */
  T({ baris: 8390, jalan: function (m) {
      m.warna(11, 0);
      m.cetak('OH NO! Your ' + m.v['W$()'][m.v.WV + 1] + ' broke!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 8400, jalan: function (m) { m.v['WV'] = 0; } });
  T({ baris: 8410, jalan: function (m) { if ((m.v['Q2'] || 0) > 0) m.lompat(9100); } });
  T({ baris: 8420, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8430, jalan: function (m) { m.v['MC'] = (m.v['MC'] || 0) - 1; } });
  T({ baris: 8440, jalan: function (m) { m.cetak('You kill ' + m.v['C$()'][m.v.A + 12] + '.'); m.barisBaru(); } });
  T({ baris: 8445, jalan: function (m) { m.v['KM!'] = (m.v['KM!'] || 0) + 1000; } });
  T({ baris: 8450, jalan: function (m) { if ((m.v['H'] || 0) > (m.v['T'] || 0) - 60) m.lompat(8490); } });
  T({ baris: 8460, jalan: function (m) { m.barisBaru(); } });
  /* 8470 Nama monster disambung dengan salah satu dari delapan cara memasaknya, dan
     hasilnya kalimat yang berbeda tiap kali. Delapan string, tiga belas
     monster, seratus empat kemungkinan. */
  T({ baris: 8470, jalan: function (m) {
      m.cetak('You spend an hour eating ' + m.v['C$()'][m.v.A + 12] +
              m.v['E$()'][FNA(m, 8)] + '.'); m.barisBaru();
    } });
  T({ baris: 8480, jalan: function (m) { m.v['H'] = (m.v['T'] || 0); } });
  T({ baris: 8490, jalan: function (m) {
      if (m.v.X !== m.v['R()'][1] || m.v.Y !== m.v['R()'][2] ||
          m.v.Z !== m.v['R()'][3]) {
        var tj = [8540, 10490][(1 - (m.v.A === 13 ? -1 : 0)) - 1];
        if (tj) m.lompat(tj);
      }
    } });
  T({ baris: 8500, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8510, jalan: function (m) {
      m.warna(11, 0);
      m.cetak("You've found the Runestaff!" + m.chr(7)); m.barisBaru();
      m.warna(3, 0);
    } });
  T({ baris: 8515, jalan: function (m) { m.v['FTRS'] = 10000; } });
  T({ baris: 8520, jalan: function (m) { m.v['R()'][ 1 ] = 0; } });
  T({ baris: 8530, jalan: function (m) { m.v['RF'] = 1; } });
  T({ baris: 8540, jalan: function (m) { m.v['Q'] = FNA(m,  1000 ); } });
  T({ baris: 8550, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8560, jalan: function (m) { m.cetak("You now get his hoard of"); m.cetak(bas((m.v["Q"] || 0))); m.cetak("gp's!"); m.barisBaru(); } });
  T({ baris: 8570, jalan: function (m) { m.v['GP!'] = m.v['GP!'] + m.v.Q; } });
  T({ baris: 8580, jalan: function (m) { m.lompat(5650); } });
  T({ baris: 8590, jalan: function (m) { if ((m.v["O$"] || '') === "R") m.lompat(9100); } });
  T({ baris: 8600, jalan: function (m) { if ((m.v["O$"] || '') !== "C") m.lompat(8890); } });
  T({ baris: 8610, jalan: function (m) { if (m.v.IQ >= 15 || m.v.Q3 <= 1) m.lompat(8650); } });
  T({ baris: 8620, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8630, jalan: function (m) { m.warna(11, 0); m.cetak("** You can't cast a spell now!"); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 8640, jalan: function (m) { m.lompat(8090); } });
  T({ baris: 8650, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8660, jalan: function (m) { m.cetak("Which spell do you wish to cast, Web, Fireball, or Deathspell?"); } });
  T({ baris: 8670, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 8680, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8690, jalan: function (m) { if ((m.v["O$"] || '') !== "W") m.lompat(8730); } });
  T({ baris: 8700, jalan: function (m) { m.v['ST'] = (m.v['ST'] || 0) - 1; } });
  T({ baris: 8710, jalan: function (m) { m.v['WC'] = FNA(m,  8 ) + 1; } });
  T({ baris: 8720, jalan: function (m) { var tj = [9100, 9590][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj); } });
  T({ baris: 8730, jalan: function (m) { if ((m.v["O$"] || '') !== "F") m.lompat(8820); } });
  T({ baris: 8740, jalan: function (m) { m.v['Q'] = FNA(m,  7 ) + FNA(m,  7 ); } });
  T({ baris: 8750, jalan: function (m) { m.v['ST'] = (m.v['ST'] || 0) - 1; } });
  T({ baris: 8760, jalan: function (m) { m.v['IQ'] = (m.v['IQ'] || 0) - 1; } });
  T({ baris: 8770, jalan: function (m) { if (m.v.IQ < 1 || m.v.ST < 1) m.lompat(9590); } });
  T({ baris: 8780, jalan: function (m) { m.cetak("It does"); m.cetak(bas((m.v["Q"] || 0))); m.cetak("points worth of damage."); m.barisBaru(); } });
  T({ baris: 8790, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8800, jalan: function (m) { m.v['Q2'] = (m.v['Q2'] || 0) - (m.v['Q'] || 0); } });
  T({ baris: 8810, jalan: function (m) { m.lompat(8410); } });
  T({ baris: 8820, jalan: function (m) { if ((m.v["O$"] || '') === "D") m.lompat(8860); } });
  T({ baris: 8830, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8840, jalan: function (m) { m.warna(11, 0); m.cetak("** Try one of the options given."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 8850, jalan: function (m) { m.lompat(8090); } });
  T({ baris: 8860, jalan: function (m) { m.cetak("Death is. . . "); } });
  /* 8870 Mantra terkuat menuntut kecerdasan di atas 15 ditambah satu lemparan dadu
     empat sisi — jadi bahkan kecerdasan 18 pun bisa gagal, dan gagalnya
     berarti kecerdasan nol dan kematian. */
  T({ baris: 8870, jalan: function (m) {
      if (m.v.IQ < FNA(m, 4) + 15) {
        m.cetak('yours!'); m.barisBaru(); m.v.IQ = 0; m.lompat(9590);
      }
    } });
  T({ baris: 8880, jalan: function (m) { m.cetak("his!"); m.barisBaru(); m.v["Q2"] = 0; m.lompat(8420); } });
  T({ baris: 8890, jalan: function (m) { if (m.v['O$'] === 'B' && m.v.Q3 <= 1) m.lompat(8930); } });
  T({ baris: 8900, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8910, jalan: function (m) { m.warna(11, 0); m.cetak("** Choose one of the options listed."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 8920, jalan: function (m) { m.lompat(8090); } });
  T({ baris: 8930, jalan: function (m) { if ((m.v['TC'] || 0) !== 0) m.lompat(8970); } });
  T({ baris: 8940, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 8950, jalan: function (m) { m.cetak("All I want is your life!"); m.barisBaru(); } });
  T({ baris: 8960, jalan: function (m) { m.lompat(9100); } });
  T({ baris: 8970, jalan: function (m) { m.v['Q'] = FNA(m,  8 ); } });
  T({ baris: 8980, jalan: function (m) { if (m.v['T()'][ (m.v['Q'] || 0) ] === 0) m.lompat(8970); } });
  T({ baris: 8990, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9000, jalan: function (m) {
      m.cetak('I want ' + m.v['C$()'][m.v.Q + 25] +
              '. Will you give it to me?');
    } });
  T({ baris: 9010, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 9020, jalan: function (m) { if ((m.v["O$"] || '') === "N") m.lompat(9100); } });
  T({ baris: 9030, jalan: function (m) { if ((m.v["O$"] || '') !== "Y") { m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.lompat(8990); } } });
  T({ baris: 9040, jalan: function (m) { m.v['T()'][ (m.v['Q'] || 0) ] = 0; } });
  T({ baris: 9050, jalan: function (m) { m.v['TC'] = (m.v['TC'] || 0) - 1; } });
  T({ baris: 9060, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9070, jalan: function (m) { m.cetak("OK, just don't tell anyone else."); m.barisBaru(); } });
  /* 9080 Bendera 'sudah melihat Drow' dinaikkan dengan perbandingan — dan sekali
     lagi nilainya −1, jadi VF sebenarnya MENURUN. Yang memeriksanya di baris
     6880 menguji `VF=1`, yang karena itu tidak pernah benar. */
  T({ baris: 9080, jalan: function (m) {
      m.v.VF = (m.v.VF || 0) +
        (m.v['L()'][FND(m, m.v.Z)] === 25 ? -1 : 0);
    } });
  T({ baris: 9090, jalan: function (m) { m.lompat(2970); } });
  T({ baris: 9100, jalan: function (m) { m.v['Q3'] = 2; } });
  T({ baris: 9110, jalan: function (m) { if ((m.v['WC'] || 0) <= 0) m.lompat(9140); } });
  T({ baris: 9120, jalan: function (m) { m.v['WC'] = (m.v['WC'] || 0) - 1; } });
  T({ baris: 9130, jalan: function (m) { if (m.v.WC === 0) { m.barisBaru(); m.cetak('The web just broke!'); m.barisBaru(); } } });
  T({ baris: 9140, jalan: function (m) {
      var s = m.v['C$()'][m.v.A + 12] || '';
      m.v['Z$'] = s.slice(2);
    } });
  T({ baris: 9150, jalan: function (m) { if ((m.v['Z$'] || '').charAt(0) === ' ') m.v['Z$'] = m.v['Z$'].slice(1); } });
  T({ baris: 9160, jalan: function (m) { if ((m.v['WC'] || 0) <= 0) m.lompat(9200); } });
  T({ baris: 9170, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9180, jalan: function (m) { m.cetak("The "); m.cetak((m.v["Z$"] || '')); m.cetak(" is stuck and can't attack now!"); m.barisBaru(); } });
  T({ baris: 9190, jalan: function (m) { m.lompat(9380); } });
  T({ baris: 9200, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9210, jalan: function (m) { m.cetak("The "); m.cetak((m.v["Z$"] || '')); m.cetak(" attacks!"); m.barisBaru(); } });
  T({ baris: 9220, jalan: function (m) { if ((m.v['DX'] || 0) < FNA(m,  7 ) + FNA(m,  7 ) + FNA(m,  7 ) + 3 * (m.v['BL'] || 0)) m.lompat(9330); } });
  T({ baris: 9230, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9240, jalan: function (m) { m.v['HIT'] = Math.floor( m.acak() ( 0 ) * 2 + 1 ); } });
  T({ baris: 9250, jalan: function (m) { var tj = [9260, 9280, 9300][(m.v["HIT"] || 0) - 1]; if (tj) m.lompat(tj); } });
  T({ baris: 9260, jalan: function (m) { m.cetak("The blow barely misses your left leg making sparks a huge dent in the floor!"); m.barisBaru(); } });
  T({ baris: 9270, jalan: function (m) { m.lompat(9380); } });
  T({ baris: 9280, jalan: function (m) { m.cetak("The "); m.cetak((m.v["Z$"] || '')); m.cetak(" charges at you but you dodge out of the way just in time!"); m.barisBaru(); } });
  T({ baris: 9290, jalan: function (m) { m.lompat(9380); } });
  T({ baris: 9300, jalan: function (m) { m.cetak("The "); m.cetak((m.v["Z$"] || '')); m.cetak(" just barely misses your ear!"); m.barisBaru(); } });
  T({ baris: 9310, jalan: function (m) { m.lompat(9380); } });
  T({ baris: 9320, jalan: function (m) { m.lompat(9380); } });
  T({ baris: 9330, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9340, jalan: function (m) {
      m.warna(12, 0);
      m.cetak('Thud! The ' + m.v['Z$'] + ' hit you!'); m.barisBaru();
      m.warna(3, 0);
    } });
  T({ baris: 9350, jalan: function (m) { m.v['Q'] = (m.v['Q1'] || 0); } });
  T({ baris: 9360, jalan: function (m) { m.gosub(9490); } });
  T({ baris: 9370, jalan: function (m) { if ((m.v['ST'] || 0) < 1) m.lompat(9590); } });
  T({ baris: 9380, jalan: function (m) { if ((m.v["O$"] || '') !== "R") m.lompat(8090); } });
  T({ baris: 9390, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9400, jalan: function (m) { m.cetak("You have escaped!"); m.barisBaru(); } });
  T({ baris: 9410, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9420, jalan: function (m) { m.cetak("Do you want to go North, South, East, or West?"); } });
  T({ baris: 9430, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 9440, jalan: function (m) { if ((m.v["O$"] || '') === "N" || (m.v["O$"] || '') === "S" || (m.v["O$"] || '') === "E" || (m.v["O$"] || '') === "W") m.lompat(4310); } });
  T({ baris: 9450, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9460, jalan: function (m) {
      m.warna(11, 0);
      m.cetak("** Don't press your luck, " + m.v['R$()'][m.v.RC] + '!');
      m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 9470, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9480, jalan: function (m) { m.lompat(9420); } });
  T({ baris: 9490, jalan: function (m) { if ((m.v['AV'] || 0) === 0) m.lompat(9570); } });
  T({ baris: 9500, jalan: function (m) { m.v['Q'] = (m.v['Q'] || 0) - (m.v['AV'] || 0); } });
  T({ baris: 9510, jalan: function (m) { m.v['AH'] = (m.v['AH'] || 0) - (m.v['AV'] || 0); } });
  /* 9520 Zirah menyerap kelebihan pukulan: yang tersisa dikurangkan dari ketahanan
     zirahnya, bukan dari pemainnya. Dan karena Q negatif, `AH-Q` justru
     MENAMBAH — tanda minus yang dua kali berbalik. */
  T({ baris: 9520, jalan: function (m) { if (m.v.Q < 0) { m.v.AH = m.v.AH - m.v.Q; m.v.Q = 0; } } });
  T({ baris: 9530, jalan: function (m) { if ((m.v['AH'] || 0) >= 0) m.lompat(9570); } });
  T({ baris: 9540, jalan: function (m) { m.v['AH'] = 0; m.v['AV'] = 0; } });
  T({ baris: 9550, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9560, jalan: function (m) { m.cetak("Your armor is damaged beyond use . . . good luck!"); m.barisBaru(); } });
  T({ baris: 9570, jalan: function (m) { m.v['ST'] = (m.v['ST'] || 0) - (m.v['Q'] || 0); } });
  T({ baris: 9580, jalan: function (m) { m.kembali(); } });
  T({ baris: 9590, jalan: function (m) { m.cetak(m.chr(7)); m.barisBaru(); } });
  T({ baris: 9600, jalan: function (m) { m.gosub(10630); } });
  T({ baris: 9610, jalan: function (m) {
      m.warna(3, 0);
      m.cetak('A noble effort, oh formerly living ' +
              m.v['R$()'][m.v.RC] + '!'); m.barisBaru();
    } });
  T({ baris: 9620, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9630, jalan: function (m) { m.cetak("You died due to lack of "); } });
  T({ baris: 9640, jalan: function (m) { if (m.v.ST < 1) { m.cetak('Strength.'); m.barisBaru(); } } });
  T({ baris: 9650, jalan: function (m) { if (m.v.IQ < 1) { m.cetak('Intelligence.'); m.barisBaru(); } } });
  T({ baris: 9660, jalan: function (m) { if (m.v.DX < 1) { m.cetak('Dexterity.'); m.barisBaru(); } } });
  T({ baris: 9670, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9680, jalan: function (m) { m.v['Q3'] = 1; } });
  T({ baris: 9690, jalan: function (m) { m.cetak("At the time you died, you had :"); m.barisBaru(); } });
  T({ baris: 9700, jalan: function (m) { m.lompat(9920); } });
  T({ baris: 9710, jalan: function (m) { m.v['Q3'] = 0; } });
  T({ baris: 9720, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9730, jalan: function (m) { m.cetak("You left the castle with"); } });
  T({ baris: 9740, jalan: function (m) { if (m.v.OF === 0) m.cetak('out'); } });
  T({ baris: 9750, jalan: function (m) { m.cetak(" the Amulet of Chaos."); m.barisBaru(); } });
  T({ baris: 9760, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9770, jalan: function (m) { if ((m.v['OF'] || 0) === 0) m.lompat(9870); } });
  T({ baris: 9780, jalan: function (m) { m.cls(); } });
  T({ baris: 9790, jalan: function (m) { m.warna(11, 0); m.cetak("       ▄   ▄  ▄▄▄   ▄   ▄       ▄   ▄  ▄  ▄   ▄    ▄  ▄"); m.barisBaru(); } });
  T({ baris: 9800, jalan: function (m) { m.cetak("       ▀▄▄▄▀ █   █  █   █       █ ▄ █  █  █▀▄ █    █  █"); m.barisBaru(); } });
  T({ baris: 9810, jalan: function (m) { m.cetak("         █   ▀▄▄▄▀  ▀▄▄▄▀        █ █   █  █  ▀█    ▄  ▄"); m.barisBaru(); } });
  T({ baris: 9820, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9830, jalan: function (m) { /* BEEP */ m.cetak("An incredibly glorious victory!!!!"); m.barisBaru(); /* BEEP */ /* BEEP */ /* BEEP */ m.warna(3, 0); } });
  T({ baris: 9840, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9850, jalan: function (m) { m.cetak("In addition, you got out with the following:"); m.barisBaru(); } });
  T({ baris: 9860, jalan: function (m) { m.lompat(9910); } });
  T({ baris: 9870, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9880, jalan: function (m) { m.cetak("A less than awe-inspiring defeat."); m.barisBaru(); } });
  T({ baris: 9890, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9900, jalan: function (m) { m.cetak("When you left the castle, you had:"); m.barisBaru(); } });
  T({ baris: 9910, jalan: function (m) { if (m.v.Q3 === 0) { m.cetak('Your miserable life!'); m.barisBaru(); } } });
  T({ baris: 9920, jalan: function (m) { m.untuk('Q', 1, 8, 1); } });
  T({ baris: 9930, jalan: function (m) {
      if (m.v['T()'][m.v.Q] === 1) {
        m.cetak(m.v['C$()'][m.v.Q + 25]); m.barisBaru();
      }
    } });
  T({ baris: 9940, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 9950, jalan: function (m) { m.cetak(m.v['W$()'][m.v.WV + 1] + ' and ' + m.v['W$()'][m.v.AV + 5]); } });
  T({ baris: 9960, jalan: function (m) { if (m.v.LF === 1) m.cetak(' and a lamp'); } });
  T({ baris: 9970, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 9980, jalan: function (m) {
      m.cetak('You also had' + bas(m.v.FL) + 'flares and' +
              bas(m.v['GP!']) + 'gold pieces'); m.barisBaru();
    } });
  T({ baris: 9990, jalan: function (m) { if (m.v.RF === 1) { m.cetak('and the Runestaff'); m.barisBaru(); } } });
  T({ baris: 10000, jalan: function (m) { m.cetak('Your score was ' + bas(m.v['JOHN!'])); m.barisBaru(); } });
  T({ baris: 10010, jalan: function (m) { m.cetak("And it took you"); m.cetak(bas((m.v["T"] || 0))); m.cetak("turns!"); m.barisBaru(); } });
  /* 10020 10020-10027 delapan pangkat, dan ADA LUBANG DI ANTARA DUA YANG PERTAMA:
     yang pertama menguji `< 20000`, yang kedua `> 35000`. Skor di antara
     20.000 dan 35.000 tidak memenuhi satu pun, jadi `RANK$` tetap kosong
     dan kalimat pangkatnya tercetak tanpa pangkat. */
  T({ baris: 10020, jalan: function (m) { if (m.v['JOHN!'] < 20000) m.v['RANK$'] = 'a Wimp'; } });
  T({ baris: 10021, jalan: function (m) { if (m.v['JOHN!'] > 35000) m.v['RANK$'] = 'a Peasant'; } });
  T({ baris: 10022, jalan: function (m) { if (m.v['JOHN!'] > 50000) m.v['RANK$'] = 'an Amateur'; } });
  T({ baris: 10023, jalan: function (m) { if (m.v['JOHN!'] > 75000) m.v['RANK$'] = 'a Scout'; } });
  T({ baris: 10024, jalan: function (m) { if (m.v['JOHN!'] > 90000) m.v['RANK$'] = 'an Adventurer'; } });
  T({ baris: 10025, jalan: function (m) { if (m.v['JOHN!'] > 110000) m.v['RANK$'] = 'a Hero'; } });
  T({ baris: 10026, jalan: function (m) { if (m.v['JOHN!'] > 125000) m.v['RANK$'] = 'a Wizard'; } });
  T({ baris: 10027, jalan: function (m) { if (m.v['JOHN!'] > 140000) m.lompat(11999); } });
  rem(10040);
  T({ baris: 10050, jalan: function (m) { m.cetak("You are ranked as "); m.cetak((m.v["RANK$"] || '')); m.barisBaru(); } });
  T({ baris: 10051, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10060, jalan: function (m) { m.cetak(" Are you foolish enough to want to play again?"); } });
  T({ baris: 10070, jalan: function (m) { m.gosub(10710); } });
  T({ baris: 10080, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10090, jalan: function (m) { if ((m.v["O$"] || '') !== "Y") m.lompat(10150); } });
  T({ baris: 10100, jalan: function (m) { m.cetak("Some "); m.cetak(m.v["R$()"][ (m.v["RC"] || 0) ]); m.cetak("s never learn!"); m.barisBaru(); } });
  T({ baris: 10110, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10120, jalan: function (m) { m.cetak("Please be patient while the castle is restocked."); m.barisBaru(); } });
  T({ baris: 10130, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10140, jalan: function (m) { m.lompat(910); } });
  T({ baris: 10150, jalan: function (m) { if ((m.v["O$"] || '') !== "N") { m.cetak((m.v["Y$"] || '')); m.barisBaru(); m.lompat(10050); } } });
  T({ baris: 10160, jalan: function (m) { m.cetak("Maybe dumb "); m.cetak(m.v["R$()"][ (m.v["RC"] || 0) ]); m.cetak(" is not so dumb after all!"); m.barisBaru(); } });
  T({ baris: 10170, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10180, jalan: function (m) { m.lompat(11040); } });
  T({ baris: 10190, jalan: function (m) { m.barisBaru(); } });
  rem(10200);
  T({ baris: 10210, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10220, jalan: function (m) { m.warna(28, 0); /* BEEP */ /* BEEP */ m.cetak("You just found The Amulet of Chaos!"); m.barisBaru(); /* BEEP */ /* BEEP */ m.warna(3, 0); } });
  T({ baris: 10230, jalan: function (m) { m.v['ST'] = 18; } });
  T({ baris: 10240, jalan: function (m) { m.v['IQ'] = 18; } });
  T({ baris: 10250, jalan: function (m) { m.v['DX'] = 18; } });
  T({ baris: 10260, jalan: function (m) { m.v['REQ'] = 20000; } });
  T({ baris: 10261, jalan: function (m) { m.v['BF'] = 0; } });
  T({ baris: 10262, jalan: function (m) { m.v['BL'] = 0; } });
  T({ baris: 10270, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10280, jalan: function (m) { m.cetak("The Runestaff has just disappeared!"); m.barisBaru(); } });
  T({ baris: 10290, jalan: function (m) { m.v['RF'] = 0; } });
  T({ baris: 10300, jalan: function (m) { m.v['OF'] = 1; } });
  T({ baris: 10310, jalan: function (m) { m.v['O()'][ 1 ] = 0; } });
  T({ baris: 10320, jalan: function (m) { m.lompat(5650); } });
  rem(10330);   /* DATA — lihat `data` di objek program */
  rem(10340);   /* DATA — lihat `data` di objek program */
  rem(10350);   /* DATA — lihat `data` di objek program */
  rem(10360);   /* DATA — lihat `data` di objek program */
  rem(10370);   /* DATA — lihat `data` di objek program */
  rem(10380);   /* DATA — lihat `data` di objek program */
  rem(10390);   /* DATA — lihat `data` di objek program */
  rem(10400);   /* DATA — lihat `data` di objek program */
  rem(10410);   /* DATA — lihat `data` di objek program */
  rem(10420);   /* DATA — lihat `data` di objek program */
  rem(10430);   /* DATA — lihat `data` di objek program */
  rem(10440);   /* DATA — lihat `data` di objek program */
  T({ baris: 10450, jalan: function (m) { m.v['X'] = FNA(m,  8 ); m.v['Y'] = FNA(m,  8 ); } });
  T({ baris: 10460, jalan: function (m) { if (m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] !== 101) m.lompat(10450); } });
  T({ baris: 10470, jalan: function (m) { m.v['L()'][ FND(m,  (m.v['Z'] || 0) ) ] = (m.v['Q'] || 0); } });
  T({ baris: 10480, jalan: function (m) { m.kembali(); } });
  T({ baris: 10490, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10500, jalan: function (m) { m.cetak("You get all his wares :"); m.barisBaru(); } });
  T({ baris: 10510, jalan: function (m) { m.cetak("Plate mail"); m.barisBaru(); } });
  T({ baris: 10520, jalan: function (m) { m.v['AV'] = 3; m.v['AH'] = 21; } });
  T({ baris: 10530, jalan: function (m) { m.cetak("A sword"); m.barisBaru(); } });
  T({ baris: 10540, jalan: function (m) { m.v['WV'] = 3; } });
  T({ baris: 10550, jalan: function (m) { m.cetak("A strength potion"); m.barisBaru(); } });
  T({ baris: 10560, jalan: function (m) { m.v['ST'] = FNC(m,  (m.v['ST'] || 0) + FNA(m,  6 ) ); } });
  T({ baris: 10570, jalan: function (m) { m.cetak("An intelligence potion"); m.barisBaru(); } });
  T({ baris: 10580, jalan: function (m) { m.v['IQ'] = FNC(m,  (m.v['IQ'] || 0) + FNA(m,  6 ) ); } });
  T({ baris: 10590, jalan: function (m) { m.cetak("A dexterity potion"); m.barisBaru(); } });
  T({ baris: 10600, jalan: function (m) { m.v['DX'] = FNC(m,  (m.v['DX'] || 0) + FNA(m,  6 ) ); } });
  T({ baris: 10610, jalan: function (m) { if (m.v.LF === 0) { m.cetak('A lamp'); m.barisBaru(); m.v.LF = 1; } } });
  T({ baris: 10620, jalan: function (m) { m.lompat(8540); } });
  T({ baris: 10630, jalan: function (m) { m.untuk('Q', 1, 64, 1); } });
  T({ baris: 10640, jalan: function (m) { m.cetak("*"); } });
  T({ baris: 10650, jalan: function (m) { m.lanjutkan('Q'); } });
  T({ baris: 10660, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10670, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10680, jalan: function (m) { m.kembali(); } });
  T({ baris: 10690, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10700, jalan: function (m) { m.cetak("Your choice"); } });
  T({ baris: 10710, jalan: function (m) { m.masukan("O$", '? '); } });
  T({ baris: 10720, jalan: function (m) { m.v['O$'] = (m.v['O$'] || '').charAt(0); } });
  T({ baris: 10730, jalan: function (m) { m.kembali(); } });
  T({ baris: 10740, jalan: function (m) { m.cetak("How many points do you wish to add to your "); m.cetak((m.v["Z$"] || '')); } });
  T({ baris: 10750, jalan: function (m) { m.masukan("O$", '? '); } });
  T({ baris: 10760, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10770, jalan: function (m) { m.v.Q = parseInt(m.v['O$'], 10) || 0; } });
  /* 10780 Membedakan 'nol' dari 'bukan angka': `VAL` mengembalikan nol untuk keduanya,
     jadi kode aksaranya diperiksa langsung — 48 adalah angka nol. */
  T({ baris: 10780, jalan: function (m) { if (m.v.Q === 0 && (m.v['O$'] || ' ').charCodeAt(0) !== 48) m.v.Q = -1; } });
  T({ baris: 10790, jalan: function (m) {
      if (m.v.Q < 0 || m.v.Q > m.v.OT || m.v.Q !== Math.floor(m.v.Q)) {
        m.cetak('** '); m.lompat(10740);
      }
    } });
  T({ baris: 10800, jalan: function (m) { m.v['OT'] = (m.v['OT'] || 0) - (m.v['Q'] || 0); } });
  T({ baris: 10810, jalan: function (m) { m.kembali(); } });
  T({ baris: 10820, jalan: function (m) { m.masukan("O$", '? '); } });
  T({ baris: 10830, jalan: function (m) { m.v.Q = Math.trunc(parseFloat(m.v['O$']) || 0); } });
  T({ baris: 10840, jalan: function (m) { m.kembali(); } });
  T({ baris: 10850, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10860, jalan: function (m) { m.cetak((m.v["Z$"] || '')); } });
  T({ baris: 10870, jalan: function (m) { m.masukan("O$", '? '); } });
  T({ baris: 10880, jalan: function (m) { m.v.Q = Math.trunc(parseFloat(m.v['O$']) || 0); } });
  T({ baris: 10890, jalan: function (m) { if (m.v.Q > 0 && m.v.Q < 9) m.kembali(); } });
  T({ baris: 10900, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10910, jalan: function (m) { m.warna(11, 0); m.cetak("** Try a number from 1 to 8."); m.barisBaru(); m.warna(3, 0); } });
  T({ baris: 10920, jalan: function (m) { m.lompat(10850); } });
  T({ baris: 10930, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10940, jalan: function (m) { m.cetak("Do you want to buy a potion of "); m.cetak((m.v["Z$"] || '')); m.cetak(" for 1000 gp's"); } });
  T({ baris: 10950, jalan: function (m) { m.lompat(10710); } });
  T({ baris: 10960, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 10970, jalan: function (m) { m.cetak("Your "); m.cetak((m.v["Z$"] || '')); m.cetak(" is now"); m.cetak(bas((m.v["Q"] || 0))); m.cetak("."); m.barisBaru(); } });
  T({ baris: 10980, jalan: function (m) { m.kembali(); } });
  T({ baris: 10990, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 11000, jalan: function (m) {
      m.cetak('These are the types of ' + m.v['Z$'] + ' you can buy :');
      m.barisBaru();
    } });
  T({ baris: 11010, jalan: function (m) { m.kembali(); } });
  T({ baris: 11020, jalan: function (m) {
      m.warna(2, 0);
      m.cetak('You are at (' + bas(m.v.X) + ',' + bas(m.v.Y) +
              ') level' + bas(m.v.Z) + '.'); m.barisBaru(); m.warna(3, 0);
    } });
  T({ baris: 11030, jalan: function (m) { m.kembali(); } });
  T({ baris: 11040, jalan: function (m) { m.henti('SYSTEM di baris 11040.'); } });
  /* 11050 Skor sementara dihitung dengan rumus yang BERBEDA dari baris 6450 — tanpa
     pengali seratus, tanpa nilai monster, tanpa denda giliran lima kali.
     Dua rumus untuk satu nama variabel, dan yang mana yang berlaku
     bergantung baris mana yang terakhir dijalankan. */
  T({ baris: 11050, jalan: function (m) { m.v['JOHN!'] = m.v.ST + m.v.IQ + m.v.DX + m.v['GP!'] - m.v.T; } });
  T({ baris: 11060, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 11070, jalan: function (m) { m.cetak('Your score at this time is ' + bas(m.v['JOHN!'])); m.barisBaru(); } });
  T({ baris: 11080, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 11090, jalan: function (m) { m.lompat(3690); } });
  /* 11100 11100-11330 ringkasan perintah dan lambang ruang, dikirim ke PENCETAK
     lewat `LPRINT`. Baris 500 di layar pembuka memang menyarankannya:
     'Suggested for use with printer and graphics board'. Peta lambangnya
     memakai aksara kotak CP437, dan itu satu-satunya tempat di seluruh
     program yang menjelaskan artinya. */
  T({ baris: 11100, jalan: function (m) { m.cetakPrinter("*** TEMPLE OF LOTH'S COMMAND AND INFORMATION SUMMARY ***"); m.cetakPrinter(''); } });
  T({ baris: 11110, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11120, jalan: function (m) { m.cetakPrinter("The following commands available are:"); m.cetakPrinter(''); } });
  T({ baris: 11130, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11140, jalan: function (m) { m.cetakPrinter("H=Help   N=North    S=South   E=East    W=West    U=Up"); m.cetakPrinter(''); } });
  T({ baris: 11150, jalan: function (m) { m.cetakPrinter("D=Down   DR=Drink   M=Map     F=Flare   L=Lamp    O=Open"); m.cetakPrinter(''); } });
  T({ baris: 11160, jalan: function (m) { m.cetakPrinter("G=Gaze   T=Teleport Q=Quit    #=Score"); m.cetakPrinter(''); } });
  T({ baris: 11170, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11180, jalan: function (m) { m.cetakPrinter("The contents of the rooms are as follows:"); m.cetakPrinter(''); } });
  T({ baris: 11190, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11200, jalan: function (m) { m.cetakPrinter("\u256c = empty room      B = book            C = chest"); m.cetakPrinter(''); } });
  T({ baris: 11210, jalan: function (m) { m.cetakPrinter("D = stairs down     \u2229 = entrance/exit   \u0192 = flares"); m.cetakPrinter(''); } });
  T({ baris: 11220, jalan: function (m) { m.cetakPrinter("G = gold pieces     \u00a5 = monster         \u03a6 = crystal orb"); m.cetakPrinter(''); } });
  T({ baris: 11230, jalan: function (m) { m.cetakPrinter("P = magic pool      S = sinkhole        T = treasure"); m.cetakPrinter(''); } });
  T({ baris: 11240, jalan: function (m) { m.cetakPrinter("U = stairs up       * = Drow            \u2588 = warp/amulet"); m.cetakPrinter(''); } });
  T({ baris: 11250, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11260, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11270, jalan: function (m) { m.cetakPrinter("The benefits of having treasures are:"); m.cetakPrinter(''); } });
  T({ baris: 11280, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11290, jalan: function (m) { m.cetakPrinter("RUBY RED - avoid lethargy    PALE PEARL - avoid leech"); m.cetakPrinter(''); } });
  T({ baris: 11300, jalan: function (m) { m.cetakPrinter("GREEN GEM - avoid forgetting  OPAL EYE - cure blindness"); m.cetakPrinter(''); } });
  T({ baris: 11310, jalan: function (m) { m.cetakPrinter("BLUE FLAME - dissolves books  NORN STONE - no benefit"); m.cetakPrinter(''); } });
  T({ baris: 11320, jalan: function (m) { m.cetakPrinter("PALANTIR - no benefit         SILMARIL - no benefit"); m.cetakPrinter(''); } });
  T({ baris: 11330, jalan: function (m) { m.cetakPrinter(''); m.cetakPrinter(''); } });
  T({ baris: 11340, jalan: function (m) { m.lompat(3700); } });
  T({ baris: 11350, jalan: function (m) { m.henti('END di baris 11350.'); } });
  T({ baris: 11360, jalan: function (m) { m.v['RF'] = 1; } });
  T({ baris: 11370, jalan: function (m) { m.lompat(3700); } });
  T({ baris: 11380, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 11390, jalan: function (m) { m.v['COME'] = 1; } });
  T({ baris: 11400, jalan: function (m) { m.cetak("You hear footsteps..."); } });
  T({ baris: 11410, jalan: function () { /* SOUND 32767,28 */ } });
  T({ baris: 11420, jalan: function (m) { m.cetak("The footsteps get louder!"); m.barisBaru(); } });
  T({ baris: 11430, jalan: function () { /* SOUND 32767,28 */ } });
  T({ baris: 11440, jalan: function (m) { m.cetak("You hear people talking in a strange language."); m.barisBaru(); } });
  T({ baris: 11450, jalan: function () { /* SOUND 32767,28 */ } });
  T({ baris: 11460, jalan: function (m) { m.cetak("Oh, No!! the Drow have returned!!!"); m.barisBaru(); } });
  T({ baris: 11470, jalan: function (m) { m.v['DROW'] = Math.floor( m.acak() * 100 ); } });
  T({ baris: 11480, jalan: function (m) { if ((m.v['DROW'] || 0) < 10) m.lompat(11530); } });
  T({ baris: 11490, jalan: function (m) { m.v['ST'] = 0; } });
  T({ baris: 11500, jalan: function (m) { m.v['IQ'] = 0; } });
  T({ baris: 11510, jalan: function (m) { m.v['DX'] = 0; } });
  T({ baris: 11520, jalan: function (m) { m.lompat(9600); } });
  T({ baris: 11530, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 11540, jalan: function (m) { m.cetak("You escaped just in time!"); m.barisBaru(); } });
  T({ baris: 11550, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 11560, jalan: function (m) { m.lompat(9760); } });
  /* 11570 SATU-SATUNYA jalan ke petunjuknya: `CHAIN"TEM-INS.BAS",10`. Berkas itu ada
     di disket yang sama, 290 baris, dan baris 3010-nya memanggil balik
     `CHAIN "Temple",700`. Dua berkas yang saling melempar, karena keduanya
     tidak muat di memori bersama-sama. */
  T({ baris: 11570, jalan: function (m) { m.rantai('TEM-INS.BAS', 10); } });
  T({ baris: 11999, jalan: function (m) { m.locate(25, 1); m.masukan('QWERTYU$', 'Press return to continue.'); } });
  T({ baris: 12000, jalan: function (m) { m.cls(); m.warna(26, 0); } });
  T({ baris: 12010, jalan: function (m) { m.cetak("  ▄▄   ▄▄  ▄   ▄  ▄▄  ▄▄▄   ▄▄  ▄▄▄  ▄  ▄ ▄    ▄▄  ▄▄▄▄▄ ▄  ▄▄  ▄   ▄  ▄▄    ▄"); m.barisBaru(); } });
  T({ baris: 12020, jalan: function (m) { m.cetak(" █  ▀ █  █ ██  █ █  ▀ █  █ █  █ █  █ █  █ █   █  █   █   █ █  █ ██  █ █  ▀  █ █"); m.barisBaru(); } });
  T({ baris: 12030, jalan: function (m) { m.cetak(" █    █  █ █ █ █ █    █▄▄▀ █▄▄█ █  █ █  █ █   █▄▄█   █   █ █  █ █ █ █  ▀▀▄  █ █"); m.barisBaru(); } });
  T({ baris: 12040, jalan: function (m) { m.cetak(" █  ▄ █  █ █  ██ █ ▀█ █ ▀▄ █  █ █  █ █  █ █   █  █   █   █ █  █ █  ██ ▄  █   ▀"); m.barisBaru(); } });
  T({ baris: 12050, jalan: function (m) { m.cetak("  ▀▀   ▀▀  ▀   ▀  ▀▀  ▀  ▀ ▀  ▀ ▀▀▀   ▀▀  ▀▀▀ ▀  ▀   ▀   ▀  ▀▀  ▀   ▀  ▀▀    ▀"); m.barisBaru(); } });
  T({ baris: 12060, jalan: function (m) { m.warna(3, 0); m.barisBaru(); } });
  T({ baris: 12070, jalan: function (m) { m.barisBaru(); } });
  T({ baris: 12080, jalan: function (m) {
      m.cetak(' You have been ranked as a Lord with a score of ' +
              bas(m.v['JOHN!'])); m.barisBaru();
    } });
  T({ baris: 12090, jalan: function (m) { m.barisBaru(); } });
  /* 12100 DAN INILAH BARIS TERAKHIRNYA. 142.498 adalah skor John Belew sendiri, dan
     TEM-INS.BAS menyebut angka yang sama persis di daftar skor tertingginya.
     Siapa pun yang mengalahkannya diminta menyunting berkas yang lain —
     dengan tangan, di penyunting BASIC. */
  T({ baris: 12100, jalan: function (m) {
      if (m.v['JOHN!'] > 142498) {
        m.cetak(" Don't forget to replace my score on Tem-Ins.Bas");
        m.barisBaru();
      }
    } });
  T({ baris: 12200, jalan: function (m) { m.lompat(10051); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['TEMPLE'] = {
    nama: 'TEMPLE',
    judul: 'The Temple of Loth (John Belew, 25 Juli 1984)',
    sumber: 'TEMPLE',
    berkas: 'run/TEMPLE.BAS',
    tabel: tabel,
    benih: 84,

    /* Seluruh DATA berkas ini, baris 10330-10440, dalam urutannya. Dibaca
       tiga kali oleh tiga gelung berbeda: 34 pasang nama-dan-lambang ruang,
       8 pasang senjata/zirah dan cara memasak, lalu 4 nama bangsa. */
    data: [
      "An empty room", "╬", "the entrance", "∩",
      "stairs going up", "U", "stairs going down", "D",
      "a pool", "P", "a chest", "C",
      "gold pieces", "G", "flares", "ƒ",
      "a warp", "█", "a sinkhole", "S",
      "a Crystal Orb", "Φ", "a book", "B",
      "a Green Slime", "▓", "an Orc", "¥",
      "an Evil Dwarf", "¥", "a Goblin", "¥",
      "a Mind Flayer", "¥", "a Troll", "¥",
      "a Giant spider", "¥", "a Minotar", "¥",
      "a Drow", "*", "a Drider", "¥",
      "a Balor Demon", "¥", "a Red Dragon", "δ",
      "a Drow Merchant", "Ω", "the Ruby Red", "T",
      "the Norn Stone", "T", "the Pale Pearl", "T",
      "the Opal Eye", "T", "the Green Gem", "T",
      "the Blue Flame", "T", "the Palantir", "T",
      "the Silmaril", "T", "X", "?",
      "no weapon", " Sandwich", "Dagger", " stew",
      "Mace", " soup", "Sword", " burger",
      "No armor", " roast", "Leather", " filet",
      "Chainmail", " taco", "Plate mail", " pie",
      "Hobbit", "Elf", "Man", "Dwarf"
    ],

    arsitektur: {
      judul: 'Alur TEMPLE.BAS',
      simpul: [
        { id: 'buka', baris: '10-690', jenis: 'mulai',
          teks: ['Layar grafik pembuka,', 'judul, dan kata sandi', 'rahasia ARIOCH'] },
        { id: 'isi', baris: '1420-1760',
          teks: ['512 ruang diisi: tangga,', 'monster, harta, kutukan —', 'semuanya lewat GOSUB 10450'] },
        { id: 'tokoh', baris: '2080-2920', jenis: 'putusan',
          teks: ['Bangsa jadi PENGALI sifat;', 'zirah dan senjata dari', 'perbandingan, bukan IF'] },
        { id: 'perintah', baris: '3795-3930', jenis: 'putusan',
          teks: ['Satu huruf (DR dua);', 'kebutaan jadi INDEKS', 'lewat ON BL+1 GOTO'] },
        { id: 'gerak', baris: '4310-4400',
          teks: ['Arah dari perbandingan;', 'FNB membungkus koordinat'] },
        { id: 'ruang', baris: '6370-6800',
          teks: ['Isi ruang menentukan', 'apa yang terjadi;', 'Jimat menyamar jadi warp'] },
        { id: 'lawan', baris: '8070-9520',
          teks: ['Kegesitan lawan dua dadu;', 'zirah menyerap kelebihan'] },
        { id: 'sihir', baris: '5250-6070',
          teks: ['Kolam, buku, bola kristal —', 'dan bola kristalnya BERBOHONG'] },
        { id: 'usai', baris: '9590-12200', jenis: 'keluar',
          teks: ['Mati, kehabisan giliran,', 'atau membawa Jimat pulang'] }
      ],
      panah: [
        { dari: 'buka', ke: 'isi' },
        { dari: 'isi', ke: 'tokoh' },
        { dari: 'tokoh', ke: 'perintah' },
        { dari: 'perintah', ke: 'gerak' },
        { dari: 'gerak', ke: 'ruang' },
        { dari: 'ruang', ke: 'lawan', label: 'ada monster' },
        { dari: 'ruang', ke: 'sihir', label: 'kolam / buku / bola' },
        { dari: 'lawan', ke: 'perintah' },
        { dari: 'sihir', ke: 'perintah' },
        { dari: 'lawan', ke: 'usai', label: 'sifat habis' },
        { dari: 'ruang', ke: 'usai', label: 'Jimat dibawa keluar' }
      ]
    },

    pseudokode: [
      { baris: 3090, tingkat: 0, teks: 'tiga perbandingan <b>dikalikan</b> &rarr; "pemain ada di ruang kutukan ini?"' },
      { baris: 4310, tingkat: 0, teks: 'arah gerak dari perbandingan: <code>X+(O$="N")-(O$="S")</code>' },
      { baris: 2520, tingkat: 0, teks: 'harga zirah dari tiga perkalian, tanpa satu pun <code>IF</code>' },
      { baris: 5280, tingkat: 0, teks: 'perbandingan jadi <b>INDEKS</b>: <code>ON (1-(ST&lt;1)) GOTO hidup,mati</code>' },
      { baris: 840, tingkat: 0, teks: '<code>FND</code> memetakan tiga koordinat ke satu larik 512 ruang' },
      { baris: 820, tingkat: 1, teks: '&hellip;<code>FNB</code> membungkusnya: kastilnya berbentuk <b>donat</b>' },
      { baris: 850, tingkat: 1, teks: '&hellip;<code>FNE</code> mencopot penanda <b>+100 = belum dilihat</b>' },
      { baris: 6040, tingkat: 0, teks: 'bola kristal <b>berbohong lima kali dari delapan</b>' },
      { baris: 6770, tingkat: 0, teks: 'Jimat Chaos <b>menyamar jadi warp</b> &mdash; sama seperti WIZARD.BAS' },
      { baris: 2100, tingkat: 0, teks: 'nomor bangsa langsung jadi <b>pengali</b> kekuatan dan kegesitan' },
      { baris: 4570, tingkat: 0, teks: 'dua penugasan berurutan; yang pertama <b>langsung dibuang</b>' },
      { baris: 10020, tingkat: 0, teks: 'tangga pangkat punya <b>lubang</b> antara 20.000 dan 35.000' },
      { baris: 12100, tingkat: 0, teks: 'skor penulisnya sendiri, 142.498, dan permintaan menyunting berkas lain' }
    ],

    perintahAsli: 'run\\TEMPLE.bat',
    catatanAsli: 'Jawab N pada pertanyaan grafik dan petunjuk untuk langsung ' +
      'masuk. Pilih bangsa dengan huruf pertamanya (H, E, M, D), lalu M atau ' +
      'F. Perintahnya satu huruf: N S E W U D untuk gerak, M peta, G bola ' +
      'kristal, F suar, # skor. Coba ketik ARIOCH di pertanyaan pertama.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Termasuk dua lagu ' +
      'pembuka yang dipilih acak di baris 560-640, dan seluruh efek pertarungan.',

      '<b><code>RANDOMIZE VAL(MID$(TIME$,7,2))</code> diganti benih tetap</b>, ' +
      'supaya kastil yang sama bisa ditelusuri dua kali.',

      '<b><code>LPRINT</code> (baris 11100-11330) dicetak ke layar.</b> Baris ' +
      '500 di layar pembuka menyarankan pencetak; ringkasan lambang ruangnya ' +
      'hanya ada di sana.',

      '<b><code>CHAIN"TEM-INS.BAS",10</code> (baris 11570) tidak bisa ' +
      'dijalankan</b> &mdash; tapi berkasnya ada di koleksi ini dan sudah ' +
      'diport tersendiri: lihat [TEM-INS](tem-ins.md).',

      '<b>Layar grafik pembuka (baris 70-340) memakai koordinat di luar ' +
      'layar</b> (<code>LINE (360,125)-(0,360)</code> pada layar 320&times;200). ' +
      'GW-BASIC memotongnya; permukaan grafik penelusur melakukan hal yang sama.'
    ],

    pelajaran: {
      ringkas: 'Seluruh geometri kastilnya ada di lima fungsi satu baris, dan ' +
        'seluruh logikanya di perbandingan yang dipakai sebagai angka.',
      pelajari: [
        ['Lima baris yang memuat seluruh bentuk kastilnya',
         '<code>840 DEF FND(Q)=64*(Q-1)+8*(X-1)+Y</code>',
         'Delapan lantai, delapan baris, delapan kolom &mdash; 512 ruang, dan ' +
         'satu larik satu dimensi menyimpan semuanya. Fungsi ini yang ' +
         'menerjemahkan koordinat jadi indeks, dan ia dipakai lebih dari ' +
         'empat puluh kali.',
         'Perhatikan bahwa ia cuma menerima SATU argumen. X dan Y diambil dari ' +
         'variabel global &mdash; fungsi yang membaca keadaan di luar dirinya, ' +
         'yang di BASIC bukan kecerobohan melainkan satu-satunya cara: ' +
         '<code>DEF FN</code> hanya boleh punya satu baris.',
         '<code>820 DEF FNB(Q)=Q+8*((Q=9)-(Q=0))</code>',
         'Dan ini yang menentukan BENTUK kastilnya. Koordinat nol jadi ' +
         'delapan, sembilan jadi satu &mdash; keluar dari sisi barat berarti ' +
         'masuk dari sisi timur. Kastilnya berbentuk donat di kedua sumbu, dan ' +
         'seluruh topologi itu ada di satu baris yang tidak menyebut kata ' +
         '"dinding" sama sekali.'],
        ['Perbandingan sebagai bilangan, empat cara',
         'Di BASIC, perbandingan yang benar bernilai &minus;1. Program ini ' +
         'memakainya untuk empat hal yang sama sekali berbeda:',
         '<code>3090 C(Q,4)=-(C(Q,1)=X)*(C(Q,2)=Y)*(C(Q,3)=Z)</code> &mdash; ' +
         'tiga perbandingan DIKALIKAN. Hasilnya 1 hanya kalau ketiganya benar. ' +
         'Menggantikan tiga <code>IF</code> bersarang dengan satu baris.',
         '<code>4310 X=X+(O$="N")-(O$="S")</code> &mdash; arah gerak. Kedua ' +
         'arah muat di satu baris tanpa percabangan.',
         '<code>2520 AV=-3*(O$="P")-2*(O$="C")-(O$="L")</code> &mdash; harga ' +
         'zirah. Tiga perkalian menghasilkan 3, 2, 1, atau 0 tepat sesuai ' +
         'huruf yang diketik.',
         '<code>5280 ON (1-(ST&lt;1)) GOTO 2880,9120</code> &mdash; dan ini ' +
         'yang paling jauh: perbandingan jadi INDEKS. Kekuatan masih positif ' +
         'berarti indeks 1, habis berarti indeks 2, dan indeks 2 adalah layar ' +
         'kematian.'],
        ['Satu larik untuk dua kelompok',
         '<code>6420 &hellip; W$(WV+1) &hellip; W$(AV+5)</code>',
         '<code>W$</code> menyimpan delapan nama berurutan: empat senjata lalu ' +
         'empat zirah. Yang memisahkannya cuma pergeseran indeks &mdash; ' +
         '<code>+1</code> untuk senjata, <code>+5</code> untuk zirah.',
         'Dan <code>E$</code> di sebelahnya menyimpan delapan cara memasak, ' +
         'dibaca dari <code>DATA</code> yang sama, berselang-seling dengan ' +
         '<code>W$</code>. Baris 8470 menyambung nama monster dengan salah ' +
         'satunya: seratus empat kalimat dari dua puluh satu string.'],
        ['Nama monster yang dibersihkan dari kata sandangnya',
         '<code>8310 Z$=RIGHT$(C$(A+12),LEN(C$(A+12))-2)</code>',
         '<code>8320 IF LEFT$(Z$,1)=" " THEN Z$=MID$(Z$,2)</code>',
         'Nama monster disimpan lengkap: "a Kobold", "an Orc". Kalimat seperti ' +
         '<i>"You\'re confronting a Kobold!"</i> butuh bentuk itu; kalimat ' +
         'seperti <i>"Thud! The Kobold hit you!"</i> tidak.',
         'Dua baris membuang sandangnya: potong dua aksara, lalu kalau yang ' +
         'tersisa masih diawali spasi &mdash; karena sandangnya "an" dan bukan ' +
         '"a" &mdash; potong satu lagi. Dua baris, dua bentuk, satu daftar.']
      ],
      hindari: [
        ['Penugasan yang langsung dibuang',
         '<code>4570 IF Q > 99 THEN Q=Q-100:LET Q=34:REM TO HIDE ROOMS</code>',
         'Dua penugasan ke <code>Q</code> berurutan di baris yang sama, dan ' +
         'yang pertama tidak pernah berarti apa-apa: <code>Q=34</code> ' +
         'menimpanya seketika.',
         'Maksudnya jelas dari komentarnya &mdash; ruang yang belum dilihat ' +
         'digambar sebagai ruang tak dikenal. Tapi pengurangan seratusnya sisa ' +
         'dari versi sebelumnya, dan ia masih di sana, membuat pembacanya ' +
         'mengira nilai aslinya dipakai untuk sesuatu.'],
        ['Tangga pangkat yang berlubang',
         '<code>10020 IF JOHN! &lt; 20000 THEN RANK$ ="a Wimp"</code>',
         '<code>10021 IF JOHN! > 35000 THEN RANK$="a Peasant"</code>',
         'Yang pertama menguji <b>kurang dari</b> 20.000; yang kedua ' +
         '<b>lebih dari</b> 35.000. Skor di antara keduanya tidak memenuhi ' +
         'satu pun, dan <code>RANK$</code> tetap string kosong.',
         'Kalimat pangkatnya tetap tercetak &mdash; tanpa pangkat di dalamnya. ' +
         'Dan rentang 20.000-35.000 justru rentang yang paling mungkin dicapai ' +
         'pemain baru.'],
        ['Dua rumus skor untuk satu nama',
         '<code>6450 JOHN!=IQ*100+ST*100+DX*100+KM!+FTRS+REQ+GP!-T*5</code>',
         '<code>11050 LET JOHN!=ST+IQ+DX+GP!-T</code>',
         'Baris 6450 dipakai papan keadaan; baris 11050 dipakai perintah ' +
         '"#". Keduanya menulis ke variabel yang sama, dan yang kedua jauh ' +
         'lebih kecil &mdash; tanpa pengali seratus, tanpa nilai monster yang ' +
         'dibunuh, tanpa denda giliran lima kali.',
         'Jadi menekan "#" MENURUNKAN skor yang tercatat, dan skor akhir di ' +
         'baris 10000 bergantung pada baris mana yang terakhir dijalankan. ' +
         'Pemain yang sering memeriksa skornya mendapat pangkat yang lebih ' +
         'rendah.'],
        ['Bola kristal yang berbohong tanpa memberi tanda',
         '<code>6040 IF FNA(8) &lt; 4 THEN A=O(1) : B=O(2) : C=O(3)</code>',
         '<code>6050 &hellip; PRINT "The Amulet of Chaos at (";A;",";B;") level";C</code>',
         'Tiga dari delapan kali, A, B, dan C diisi letak Jimat yang ' +
         'sebenarnya. Lima dari delapan kali mereka tetap berisi angka acak ' +
         'yang disiapkan baris sebelumnya.',
         'Dan kalimat yang tercetak SAMA PERSIS di kedua kasus. Tidak ada ' +
         '"mungkin", tidak ada "sepertinya" &mdash; bola kristalnya menyatakan ' +
         'kebohongan dengan keyakinan yang sama dengan kebenaran.',
         'Sebagai rancangan permainan itu bagus. Sebagai kode ia berbahaya: ' +
         'satu-satunya yang membedakan kedua cabang adalah tiga penugasan di ' +
         'dalam sebuah <code>IF</code>, dan tidak ada satu komentar pun yang ' +
         'menyebutkannya.']
      ]
    },

    penjelasan: [
      { judul: 'Empat tahun, dua penulis, satu kerangka',
        isi: [
          'Bagian kepala berkas ini menyebut sumbernya sendiri:',
          '<code>750 REM    * THANKS TO RECREATIONAL COMPUTING FOR THE ORIGINAL*</code>',
          '<code>760 REM    * PROGRAM          JUNE 29, 1984                   *</code>',
          'Recreational Computing memuat WIZARD.BAS di edisi Juli/Agustus 1980, ' +
          'karya Joseph R. Power. Berkas itu ada di koleksi ini juga, 944 ' +
          'baris, dan sudah diport.',
          'Yang membuktikan hubungannya bukan kalimat itu melainkan lima baris ' +
          'di bagian atas:',
          '<code>810 DEF FNA(Q)=1+INT(RND(1)*Q)</code>',
          '<code>820 DEF FNB(Q)=Q+8*((Q=9)-(Q=0))</code>',
          '<code>830 DEF FNC(Q)=-Q*(Q&lt;19)-18*(Q>18)</code>',
          '<code>840 DEF FND(Q)=64*(Q-1)+8*(X-1)+Y</code>',
          '<code>850 DEF FNE(Q)=Q+100*(Q>99)</code>',
          'Kelimanya sama bentuknya dengan WIZARD.BAS baris 240-280. Bukan ' +
          'mirip &mdash; sama. Larik 512 ruang, pembungkusan koordinat ' +
          'delapan-ke-satu, batas atas 18 untuk sifat pemain, dan penanda ' +
          '"+100 berarti belum dilihat".',
          'Dan yang berbeda menceritakan empat tahun di antaranya. WIZARD ' +
          'punya monster generik; TEMPLE berterima kasih kepada TSR &mdash; ' +
          'penerbit Dungeons &amp; Dragons &mdash; dan memakai Mind Flayer, ' +
          'Drider, Balor Demon. WIZARD punya Orb of Zot; TEMPLE punya Amulet ' +
          'of Chaos dan cerita latar dua puluh baris tentang Perang Elf ' +
          'Pertama.',
          'WIZARD berjalan di layar teks polos; TEMPLE membuka dengan layar ' +
          'grafik CGA, dua ratus bintang, dan terowongan elips yang menutup.',
          'Yang tidak berubah: aritmetikanya. Empat tahun, dua penulis, dan ' +
          'lima baris yang disalin utuh karena tidak ada yang perlu diperbaiki ' +
          'di sana.',
          'Dan TEMPLE menambahkan sesuatu yang tidak dimiliki induknya: berkas ' +
          'kedua. Baris 11570 memanggil <code>CHAIN"TEM-INS.BAS",10</code>, ' +
          'dan TEM-INS baris 3010 memanggil balik <code>CHAIN "Temple",700</code>. ' +
          'Dua ratus sembilan puluh baris petunjuk yang tidak muat di memori ' +
          'bersama permainannya, jadi keduanya saling melempar.'
        ] },
      { judul: 'Skor yang bernama John',
        isi: [
          'Variabel skor program ini bernama <code>JOHN!</code>.',
          '<code>6450 JOHN!=IQ*100+ST*100+DX*100+KM!+FTRS+REQ+GP!-T*5</code>',
          'John Belew, yang menandatangani baris 520 dan menyebut dirinya ' +
          'Nurruc the Chaotic di baris 530. Tanda seru di ujungnya bukan ' +
          'ekspresi &mdash; ia penanda presisi tunggal, karena skornya bisa ' +
          'melebihi 32.767.',
          'Dan baris terakhir program ini, nomor 12100, berbunyi:',
          '<code>12100 IF JOHN! > 142498 THEN PRINT " Don\'t forget to replace ' +
          'my score on Tem-Ins.Bas</code>',
          'Seratus empat puluh dua ribu empat ratus sembilan puluh delapan. ' +
          'Skor penulisnya sendiri, ditulis sebagai bilangan telanjang di ' +
          'dalam syarat.',
          'Dan angka yang sama ada di TEM-INS.BAS &mdash; berkas petunjuknya, ' +
          'di disket yang sama, di daftar skor tertinggi. Dua berkas, satu ' +
          'angka, dan tidak ada apa pun yang menjaga keduanya tetap sama.',
          'Yang diminta baris ini bukan agar programnya memperbarui daftar ' +
          'itu. Ia meminta <b>pemainnya</b> melakukannya: memuat berkas yang ' +
          'lain di penyunting BASIC, mencari barisnya, dan mengetik ulang ' +
          'angkanya.',
          'Itu cara sebuah papan skor bekerja ketika tidak ada berkas data, ' +
          'tidak ada jaringan, dan satu-satunya penyimpanan bersama adalah ' +
          'disket yang dipinjamkan dari tangan ke tangan.',
          'Dan itu juga sebabnya angka 142.498 masih ada di sini, empat puluh ' +
          'dua tahun kemudian, di kedua berkasnya: tidak ada seorang pun yang ' +
          'pernah mengalahkannya, atau kalau ada, tidak ada yang repot-repot ' +
          'menyuntingnya.'
        ] }
    ]
  };
})(window);
