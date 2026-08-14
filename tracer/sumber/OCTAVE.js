/* Dihasilkan oleh tracer/alat/bikin-sumber.py - jangan disunting tangan.
   Sumber: run/OCTAVE.BAS (6 baris) */
window.SUMBER = window.SUMBER || {};
window.SUMBER["OCTAVE"] = [
  "10 octave = -2: note = 1: length = 1",
  "20 PLAY \"o0 t255\"",
  "30 freq = 440 * (2 ^ (octave + (note - 10) / 12))",
  "40 SOUND freq, length   ",
  "50 PLAY \"c\"              ",
  "60 GOTO 30",
];
