/* DIHASILKAN dari decompile/HOPPER/hopper-run.bas -- jangan disunting tangan.

   Isinya dua hal yang KELUAR UTUH dari biner 1980-an, bukan tafsiran:

   1. Enam string DRAW. Byte-identik dengan deskriptor di HOPPER.EXE. DRAW
      adalah bahasa makro menggambar GW-BASIC, dan hopper.js menafsirkannya
      sungguhan -- sama seperti audio.js menafsirkan makro PLAY. Jadi bentuk
      katak dan batang kayu di halaman ini digambar oleh program 1980-an itu
      sendiri, bukan digambar ulang oleh saya.

   2. Tabel kecepatan sebelas jalur, dari penggulung 232 bita yang di-POKE
      program ke dirinya sendiri lalu dipanggil CALL. Nilainya dalam BITA
      layar CGA; satu bita = empat piksel. Jalur ke-6 berkecepatan NOL --
      itu median strip Frogger. */
window.RETRO = window.RETRO || {};
window.RETRO.HOPPER = {
 "draw": {
  "S3$": "C1RFL3BL3L0BL2R0BR11R0BR2DL2BL2L5BL2L2FBR3R5BR3GL0BL2L5BL2FR7GL5R5BFBRL0BL2L5BL2DR9DBL3L3BL3DL2BR11R2",
  "S4$": "C3F3DFD2GDGL2H2UE2G3HBD2D0GBU2LHU2E4RE",
  "S5$": "C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF2",
  "S6$": "C0BU3L3BD3L1BH2L2BG1BL4L3BH3L5BD3BG2R3BG3R5BR4R3BE2BR3R2",
  "S7$": "R5FL8GRBR5R0BR4DBL4L0BL5LGR2BR5R0BR5R2FRL17GR19FL21DR21BDBLL4BL10L4BFBR2L2BR14R2BR2BE10",
  "S8$": "L5GR8FLBL5L0BL4DBR4R0BR5RFL2BL5L0BL5L2GLR17FL19GR21DL21BDBRR4BR10R4BGBL2R2BL14L2BR26BE10"
 },
 "kecepatan": [
  1,
  -1,
  2,
  -1,
  2,
  0,
  1,
  -1,
  2,
  -2,
  -1
 ],
 "penggulung_byte": 232
};
