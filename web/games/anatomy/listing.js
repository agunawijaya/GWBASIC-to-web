/* ===========================================================================
   listing.js — DIHASILKAN, jangan disunting tangan.

   Isi: listing MASTER MIND yang DICETAK oleh ANATOMY.BAS, diekstrak dari
   115 pernyataan PRINT-nya, ditambah perbandingan tiap baris dengan
   run/MASTER.BAS yang benar-benar dikirim dalam koleksi ini.

       s: "sama"  -> masih persis sama di MASTER.BAS
          "nomor" -> hanya target lompatannya berbeda (penomoran ulang)
          "tulis" -> benar-benar ditulis ulang

   Sumber: run/ANATOMY.BAS + run/MASTER.BAS. Pembangkit disimpan di dokumen.
   =========================================================================== */
window.RETRO = window.RETRO || {};
window.RETRO.ANATOMY_META = {"baris": 159, "cetak": 115, "sama": 72, "nomor": 21, "tulis": 22, "chr34": 132, "mmBaris": 137};
window.RETRO.ANATOMY_PAGES = [
 {
  "n": 1,
  "judul": "Layar petunjuk",
  "src": [
   180,
   330
  ],
  "rows": [
   {
    "src": 180,
    "mm": 170,
    "t": "170 LOCATE 5,20,0:PRINT\"Welcome to Master Mind. The object of this game is\"",
    "s": "tulis"
   },
   {
    "src": 190,
    "mm": 180,
    "t": "180 LOCATE 6,15:PRINT\"to correctly guess a series of from 3 to 6 numbers.\"",
    "s": "tulis"
   },
   {
    "src": 200,
    "mm": 190,
    "t": "190 LOCATE 7,15:PRINT\"Each number is randomly generated and the possibility\"",
    "s": "tulis"
   },
   {
    "src": 210,
    "mm": 200,
    "t": "200 LOCATE 8,15:PRINT\"exists that you may have 2 of the same number in a\"",
    "s": "tulis"
   },
   {
    "src": 220,
    "mm": 210,
    "t": "210 LOCATE 9,15:PRINT\"series.\"",
    "s": "tulis"
   },
   {
    "src": 230,
    "mm": 220,
    "t": "220 LOCATE 11,20:PRINT\"You will be given from 9 to 15 guesses to accomplish\"",
    "s": "tulis"
   },
   {
    "src": 240,
    "mm": 230,
    "t": "230 LOCATE 12,15:PRINT\"this task, depending upon the length of the series.\"",
    "s": "tulis"
   },
   {
    "src": 250,
    "mm": 240,
    "t": "240 LOCATE 13,15:PRINT\"After each guess you will be told the number of cor-\"",
    "s": "tulis"
   },
   {
    "src": 260,
    "mm": 250,
    "t": "250 LOCATE 14,15:PRINT\"rect digits, along with how many are in the right po-",
    "s": "tulis"
   },
   {
    "src": 270,
    "mm": 260,
    "t": "260 LOCATE 15,15:PRINT\"sition. Use these clues to guess the correct series.\"",
    "s": "tulis"
   },
   {
    "src": 280,
    "mm": 270,
    "t": "270 LOCATE 25,27:COLOR 15,0:PRINT\"PRESS ANY KEY TO CONTINUE\";:COLOR 7",
    "s": "tulis"
   },
   {
    "src": 290,
    "mm": 280,
    "t": "280 IF INKEY$<>\"\" THEN 280",
    "s": "nomor"
   },
   {
    "src": 300,
    "mm": 290,
    "t": "290 RESP$=INKEY$:IF RESP$=\"\" THEN 290",
    "s": "nomor"
   },
   {
    "src": 310,
    "mm": 300,
    "t": "300 CLS",
    "s": "sama"
   }
  ],
  "page": " 11 & 12 ",
  "bug": false,
  "tampil": " 11 & 12 "
 },
 {
  "n": 2,
  "judul": "Menu tingkat kesulitan",
  "src": [
   340,
   420
  ],
  "rows": [
   {
    "src": 340,
    "mm": 310,
    "t": "310 DIM GUESS(6):DIM ANSWER(6):COLOR 15,0",
    "s": "sama"
   },
   {
    "src": 350,
    "mm": 320,
    "t": "320 LOCATE 8,32,0:PRINT \"WELCOME TO MASTER MIND\"",
    "s": "sama"
   },
   {
    "src": 360,
    "mm": 330,
    "t": "330 LOCATE 9,20,0:PRINT\"TO CHOOSE A LEVEL ENTER THE LETTER NEXT TO IT\"",
    "s": "sama"
   },
   {
    "src": 370,
    "mm": 340,
    "t": "340 LOCATE 11,29,0:PRINT \"A)  SERIES OF 3 NUMBERS\"",
    "s": "sama"
   },
   {
    "src": 380,
    "mm": 350,
    "t": "350 LOCATE 12,29,0:PRINT \"B)  SERIES OF 4 NUMBERS\"",
    "s": "sama"
   },
   {
    "src": 390,
    "mm": 360,
    "t": "360 LOCATE 13,29,0:PRINT \"C)  SERIES OF 5 NUMBERS\"",
    "s": "sama"
   },
   {
    "src": 400,
    "mm": 370,
    "t": "370 LOCATE 14,29,0:PRINT \"D)  SERIES OF 6 NUMBERS\":COLOR 3,0",
    "s": "sama"
   }
  ],
  "page": " 12 & 13 ",
  "bug": false,
  "tampil": " 12 & 13 "
 },
 {
  "n": 3,
  "judul": "Bingkai kotak",
  "src": [
   430,
   590
  ],
  "rows": [
   {
    "src": 430,
    "mm": 379,
    "t": "379 LOCATE 6,17:PRINT CHR$(201)",
    "s": "sama"
   },
   {
    "src": 440,
    "mm": 380,
    "t": "380 FOR A=18 TO 66",
    "s": "sama"
   },
   {
    "src": 450,
    "mm": 390,
    "t": "390     LOCATE 6,A,0:PRINT CHR$(205)",
    "s": "sama"
   },
   {
    "src": 460,
    "mm": 400,
    "t": "400 NEXT",
    "s": "sama"
   },
   {
    "src": 470,
    "mm": 410,
    "t": "410 FOR B=7 TO 15",
    "s": "sama"
   },
   {
    "src": 480,
    "mm": 420,
    "t": "420     LOCATE B,67,0:PRINT CHR$(186)",
    "s": "sama"
   },
   {
    "src": 490,
    "mm": 430,
    "t": "430 NEXT",
    "s": "sama"
   },
   {
    "src": 500,
    "mm": 431,
    "t": "431 LOCATE 16,67:PRINT CHR$(188)",
    "s": "sama"
   },
   {
    "src": 510,
    "mm": 440,
    "t": "440 FOR C=66 TO 18 STEP -1",
    "s": "sama"
   },
   {
    "src": 520,
    "mm": 450,
    "t": "450     LOCATE 16,C,0:PRINT CHR$(205)",
    "s": "sama"
   },
   {
    "src": 530,
    "mm": 460,
    "t": "460 NEXT",
    "s": "sama"
   },
   {
    "src": 540,
    "mm": 461,
    "t": "461 LOCATE 16,17:PRINT CHR$(200)",
    "s": "sama"
   },
   {
    "src": 550,
    "mm": 470,
    "t": "470 FOR D=15 TO 7 STEP -1",
    "s": "sama"
   },
   {
    "src": 560,
    "mm": 480,
    "t": "480     LOCATE D,17,0:PRINT CHR$(186)",
    "s": "sama"
   },
   {
    "src": 570,
    "mm": 490,
    "t": "490 NEXT",
    "s": "sama"
   }
  ],
  "page": " 13 & 14 ",
  "bug": false,
  "tampil": " 13 & 14 "
 },
 {
  "n": 4,
  "judul": "Pilihan pemain & angka rahasia",
  "src": [
   600,
   710
  ],
  "rows": [
   {
    "src": 600,
    "mm": 500,
    "t": "500 RESP$=INKEY$:IF RESP$=\"\" THEN 500",
    "s": "nomor"
   },
   {
    "src": 610,
    "mm": 510,
    "t": "510 IF RESP$=\"A\" OR RESP$=\"a\"     THEN DIGITS=3:STARTANS=36:STARTGES=8:BOTROW=15:GOTO 560",
    "s": "nomor"
   },
   {
    "src": 620,
    "mm": 520,
    "t": "520 IF RESP$=\"B\" OR RESP$=\"b\"     THEN DIGITS=4:STARTANS=34:STARTGES=6:BOTROW=15:GOTO 560",
    "s": "nomor"
   },
   {
    "src": 630,
    "mm": 530,
    "t": "530 IF RESP$=\"C\" OR RESP$=\"c\"     THEN DIGITS=5:STARTANS=32:STARTGES=4:BOTROW=18:GOTO 560",
    "s": "nomor"
   },
   {
    "src": 640,
    "mm": 540,
    "t": "540 IF RESP$=\"D\" OR RESP$=\"d\"     THEN DIGITS=6:STARTANS=30:STARTGES=2:BOTROW=21:GOTO 560",
    "s": "nomor"
   },
   {
    "src": 650,
    "mm": 550,
    "t": "550 GOTO 500",
    "s": "nomor"
   },
   {
    "src": 660,
    "mm": 560,
    "t": "560 FOR SUB=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 670,
    "mm": 570,
    "t": "570 RANDOMIZE(VAL(RIGHT$(TIME$,2))):ANSWER(SUB)=FIX(RND(SUB)*10)",
    "s": "sama"
   },
   {
    "src": 680,
    "mm": 580,
    "t": "580 NEXT SUB",
    "s": "sama"
   },
   {
    "src": 690,
    "mm": 590,
    "t": "590 CLS",
    "s": "sama"
   }
  ],
  "page": " 14 ",
  "bug": false,
  "tampil": " 14 "
 },
 {
  "n": 5,
  "judul": "Kepala tabel",
  "src": [
   720,
   870
  ],
  "rows": [
   {
    "src": 720,
    "mm": 600,
    "t": "600 XX=1:YY=1:GOSUB 1230",
    "s": "nomor"
   },
   {
    "src": 730,
    "mm": 610,
    "t": "610 LOCATE 1,34,0:PRINT\"SECRET NUMBERS\"",
    "s": "sama"
   },
   {
    "src": 740,
    "mm": 620,
    "t": "620 LOCATE 2,30,0:PRINT\"----------------------\"",
    "s": "sama"
   },
   {
    "src": 750,
    "mm": 630,
    "t": "630 BEGINANS=STARTANS",
    "s": "sama"
   },
   {
    "src": 760,
    "mm": 640,
    "t": "640 FOR M=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 770,
    "mm": 650,
    "t": "650     LOCATE 3,BEGINANS,0:PRINT CHR$(219) CHR$(219)",
    "s": "sama"
   },
   {
    "src": 780,
    "mm": 660,
    "t": "660     BEGINANS=BEGINANS+4",
    "s": "sama"
   },
   {
    "src": 790,
    "mm": 670,
    "t": "670 NEXT",
    "s": "sama"
   },
   {
    "src": 800,
    "mm": 680,
    "t": "680 COLOR 15,0:LOCATE 5,4,0:PRINT\"ENTER YOUR GUESSES\":COLOR 3,0",
    "s": "sama"
   },
   {
    "src": 810,
    "mm": 690,
    "t": "690 LOCATE 6,2,0:PRINT\"----------------------\"",
    "s": "sama"
   },
   {
    "src": 820,
    "mm": 700,
    "t": "700 LOCATE 5,28,0:PRINT\"CORRECT NUMBERS\"",
    "s": "sama"
   },
   {
    "src": 830,
    "mm": 710,
    "t": "710 LOCATE 6,28,0:PRINT\"---------------\"",
    "s": "sama"
   },
   {
    "src": 840,
    "mm": 720,
    "t": "720 LOCATE 5,49,0:PRINT\"CORRECT NUMBERS/RIGHT POSITION\"",
    "s": "tulis"
   },
   {
    "src": 850,
    "mm": 730,
    "t": "730 LOCATE 6,49,0:PRINT\"------------------------------\"",
    "s": "tulis"
   }
  ],
  "page": " 14 & 15 ",
  "bug": false,
  "tampil": " 14 & 15 "
 },
 {
  "n": 6,
  "judul": "Kotak tebakan kosong",
  "src": [
   880,
   980
  ],
  "rows": [
   {
    "src": 880,
    "mm": 740,
    "t": "740 FOR ROW=7 TO BOTROW",
    "s": "sama"
   },
   {
    "src": 890,
    "mm": 750,
    "t": "750     BEGINGES=STARTGES",
    "s": "sama"
   },
   {
    "src": 900,
    "mm": 760,
    "t": "760     FOR Q=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 910,
    "mm": 770,
    "t": "770         LOCATE ROW,BEGINGES,0:PRINT CHR$(220) CHR$(220)",
    "s": "sama"
   },
   {
    "src": 920,
    "mm": 780,
    "t": "780         BEGINGES=BEGINGES+4",
    "s": "sama"
   },
   {
    "src": 930,
    "mm": 790,
    "t": "790     NEXT Q",
    "s": "sama"
   },
   {
    "src": 940,
    "mm": 800,
    "t": "800     LOCATE ROW,35,0:PRINT CHR$(220) CHR$(220)",
    "s": "sama"
   },
   {
    "src": 950,
    "mm": 810,
    "t": "810     LOCATE ROW,63,0:PRINT CHR$(220) CHR$(220)",
    "s": "sama"
   },
   {
    "src": 960,
    "mm": 820,
    "t": "820 NEXT ROW",
    "s": "sama"
   }
  ],
  "page": " 15 ",
  "bug": false,
  "tampil": " 15 "
 },
 {
  "n": 7,
  "judul": "Membaca tebakan & menghitung tepat",
  "src": [
   990,
   1160
  ],
  "rows": [
   {
    "src": 990,
    "mm": 830,
    "t": "830 FOR ROW=7 TO BOTROW",
    "s": "sama"
   },
   {
    "src": 1000,
    "mm": 840,
    "t": "840     BEGINGES=STARTGES:HITS=0:GUESSES=0",
    "s": "sama"
   },
   {
    "src": 1010,
    "mm": 850,
    "t": "850     DIM HITS$(10,6):DIM MISSES$(10,6)",
    "s": "sama"
   },
   {
    "src": 1020,
    "mm": 860,
    "t": "860     FOR SUB=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 1030,
    "mm": 870,
    "t": "870         LOCATE ROW,BEGINGES,0",
    "s": "sama"
   },
   {
    "src": 1040,
    "mm": 880,
    "t": "880         DEF SEG:POKE 106,0:IF INKEY$<>\"\" THEN 880",
    "s": "nomor"
   },
   {
    "src": 1050,
    "mm": 890,
    "t": "890         TRY$=INKEY$:IF TRY$=\"\" OR TRY$<\"0\" OR TRY$>\"9\" THEN 890",
    "s": "nomor"
   },
   {
    "src": 1060,
    "mm": 900,
    "t": "900         GUESS(SUB)=VAL(TRY$)",
    "s": "sama"
   },
   {
    "src": 1070,
    "mm": 910,
    "t": "910         LOCATE ROW,BEGINGES-1,0:PRINT CHR$(255) GUESS(SUB)",
    "s": "sama"
   },
   {
    "src": 1080,
    "mm": 920,
    "t": "920         BEGINGES=BEGINGES+4",
    "s": "sama"
   },
   {
    "src": 1090,
    "mm": 930,
    "t": "930     NEXT SUB",
    "s": "sama"
   },
   {
    "src": 1100,
    "mm": 940,
    "t": "940     FOR X=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 1110,
    "mm": 950,
    "t": "950         FOR Y=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 1120,
    "mm": 960,
    "t": "960          IF GUESS(X)=ANSWER(Y) AND X=Y AND HITS$(GUESS(X),X)<>\"*\"             THEN GUESSES=GUESSES+1:HITS=HITS+1:HITS$(GUESS(X),X)=\"*\"             :MISSES$(GUESS(X),X)=\"*\": GOTO 980",
    "s": "tulis"
   },
   {
    "src": 1130,
    "mm": 970,
    "t": "970         NEXT Y",
    "s": "sama"
   },
   {
    "src": 1140,
    "mm": 980,
    "t": "980     NEXT X",
    "s": "sama"
   }
  ],
  "page": null,
  "bug": true,
  "tampil": " 15 "
 },
 {
  "n": 8,
  "judul": "Menghitung angka benar salah tempat",
  "src": [
   1170,
   1270
  ],
  "rows": [
   {
    "src": 1170,
    "mm": 990,
    "t": "990     FOR X=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 1180,
    "mm": 1000,
    "t": "1000         FOR Y=1 TO DIGITS",
    "s": "sama"
   },
   {
    "src": 1190,
    "mm": 1010,
    "t": "1010             IF GUESS(X)=ANSWER(Y) AND HITS$(GUESS(X),X)=\"\"                 AND MISSES$(GUESS(X),X)=\"\" AND X<>Y AND MISSES$(GUESS(X),Y)",
    "s": "tulis"
   },
   {
    "src": 1200,
    "mm": null,
    "t": "                 =\"\" AND HITS$(GUESS(X),Y)=\"\"                 THEN GUESSES=GUESSES+1:MISSES$(GUESS(X),X)=\"*\"                 :MISSES$(GUESS(X),Y)=\"*\": GOTO 1030",
    "s": "tulis"
   },
   {
    "src": 1210,
    "mm": 1020,
    "t": "1020         NEXT Y",
    "s": "sama"
   },
   {
    "src": 1220,
    "mm": 1030,
    "t": "1030     NEXT X",
    "s": "sama"
   },
   {
    "src": 1230,
    "mm": 1040,
    "t": "1040     LOCATE ROW,34,0:PRINT CHR$(255) GUESSES CHR$(255)",
    "s": "sama"
   },
   {
    "src": 1240,
    "mm": 1050,
    "t": "1050     LOCATE ROW,62,0:PRINT CHR$(255) HITS CHR$(255)",
    "s": "sama"
   },
   {
    "src": 1250,
    "mm": 1060,
    "t": "1060     ERASE MISSES$: ERASE HITS$",
    "s": "sama"
   }
  ],
  "page": null,
  "bug": true,
  "tampil": " 15 "
 },
 {
  "n": 9,
  "judul": "Menang, kalah, dan keluar",
  "src": [
   1280,
   1500
  ],
  "rows": [
   {
    "src": 1280,
    "mm": 1070,
    "t": "1070     IF HITS=DIGITS THEN GOSUB 20:GOSUB 1280:LOCATE 22,21:PRINT\"",
    "s": "tulis"
   },
   {
    "src": 1290,
    "mm": null,
    "t": "          !!!  C O N G R A G U L A T I O N S  !!!\":GOTO 1110",
    "s": "tulis"
   },
   {
    "src": 1300,
    "mm": 1080,
    "t": "1080 NEXT ROW",
    "s": "sama"
   },
   {
    "src": 1310,
    "mm": 1090,
    "t": "1090 GOSUB 20",
    "s": "nomor"
   },
   {
    "src": 1320,
    "mm": 1100,
    "t": "1100 GOSUB 1265:LOCATE 22,23,0:PRINT\"!!!  S O R R Y , Y O U   L O S T  !!!\"",
    "s": "nomor"
   },
   {
    "src": 1330,
    "mm": 1110,
    "t": "1110 LOCATE 23,25,O:PRINT\"DO YOU WISH TO PLAY AGAIN?  <Y/N>\"",
    "s": "tulis"
   },
   {
    "src": 1340,
    "mm": 1120,
    "t": "1120 IF INKEY$<>\"\" THEN 1120",
    "s": "nomor"
   },
   {
    "src": 1350,
    "mm": 1130,
    "t": "1130 RESP$=INKEY$:IF RESP$=\"\" THEN 1130",
    "s": "nomor"
   },
   {
    "src": 1360,
    "mm": 1140,
    "t": "1140 IF RESP$=\"Y\" OR RESP$=\"y\" THEN CLS:GOTO 320",
    "s": "nomor"
   },
   {
    "src": 1370,
    "mm": 1150,
    "t": "1150 IF RESP$<>\"N\" AND RESP$<>\"n\" THEN 1130",
    "s": "nomor"
   },
   {
    "src": 1380,
    "mm": 1160,
    "t": "1160 RUN\"MENU",
    "s": "sama"
   },
   {
    "src": 1390,
    "mm": 1170,
    "t": "1170 KEY(10) OFF:XX=CSRLIN:YY=POS(0):LOCATE 25,1:PRINT SPC(79);:LOCATE 25,25",
    "s": "tulis"
   },
   {
    "src": 1400,
    "mm": 1180,
    "t": "1180 COLOR 15:PRINT \"DO YOU WISH TO LEAVE THIS GAME <Y/N>\";:COLOR 7",
    "s": "tulis"
   },
   {
    "src": 1410,
    "mm": 1190,
    "t": "1190 IF INKEY$<>\"\" THEN 1190",
    "s": "nomor"
   },
   {
    "src": 1420,
    "mm": 1200,
    "t": "1200 R$=INKEY$:IF R$=\"\" THEN 1200",
    "s": "nomor"
   },
   {
    "src": 1430,
    "mm": 1210,
    "t": "1210 IF R$=\"Y\" OR R$=\"y\" THEN 1160",
    "s": "nomor"
   },
   {
    "src": 1440,
    "mm": 1220,
    "t": "1220 IF R$<>\"N\" AND R$<>\"n\" THEN 1200",
    "s": "nomor"
   },
   {
    "src": 1450,
    "mm": 1230,
    "t": "1230 LOCATE 25,1:PRINT SPC(79);:LOCATE 25,25:COLOR 0,7",
    "s": "sama"
   },
   {
    "src": 1460,
    "mm": 1240,
    "t": "1240 PRINT \" STRIKE <F10> TO LEAVE THIS GAME \";:COLOR 7,0:LOCATE XX,YY",
    "s": "tulis"
   },
   {
    "src": 1470,
    "mm": 1250,
    "t": "1250 KEY(10) ON:DEF SEG:POKE 106,0:RETURN",
    "s": "sama"
   },
   {
    "src": 1480,
    "mm": 1260,
    "t": "1260 END",
    "s": "sama"
   }
  ],
  "page": " 15 ",
  "bug": false,
  "tampil": " 15 "
 }
];
