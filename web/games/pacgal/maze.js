/* DIHASILKAN oleh decompile/tools/genmaze.py -- jangan disunting tangan.

   Labirin ini DIUKUR, bukan disalin. Ia tidak ada sebagai larik di
   mana pun: PAC-GAL membangunnya saat startup dari CHR$/STRING$ lalu
   mencetaknya baris demi baris, jadi satu-satunya tempat ia berwujud
   adalah layar. Sumbernya karena itu tangkapan layar EXE 1982 yang
   dijalankan emulator, dan susunannya sudah dicocokkan sel demi sel
   dengan rekonstruksi .bas-nya -- 24 dari 24 baris.

   Bukti yang memeriksa dirinya sendiri: jumlah ubin pelet di sini
   ada 468, dan baris status yang dicetak programnya sendiri berbunyi
   "dots 468". Dua angka dari dua tempat berbeda, sama. */
window.RETRO = window.RETRO || {};
window.RETRO.PACGAL_MAZE = {
 "sumber": "run/PAC-GAL.EXE dijalankan lewat decompile/tools/textscreen.py",
 "verifikasi": "24/24 baris cocok sel demi sel dengan pac-gal-run.bas (refscreen.py)",
 "kolom": 80,
 "baris": 24,
 "pelet": 468,
 "status": "dots 468      ☺☺☺              P A C - G A L         Al J. Jiménez, May 1982"
};
window.RETRO.PACGAL_ROWS = [
 "▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ",
 "█ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ █ ",
 "█ ∙ ║ ∙ ╔══════ ∙ ║ ∙ ════════╦════ ∙ ║ ∙ ════╦════════ ∙ ║ ∙ ════════╗ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ║ ∙ ═══════════════ ∙ ║ ∙ ════╩════ ∙ ║ ∙ ═════════════════ ∙ ║ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ═════════ ∙ ══════╗ ∙ ╔═══════╦═══════╦════ ∙ ╔════ ∙ ═════════ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ╔═╝ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ║ ∙ ════════╗ ∙ ║ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ║ ∙ ╔════════ ∙ ║ ∙ ║ ∙ █ ",
 "█ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ║ ∙ ║ ∙ ║ ∙ ══╩═══════╩════ ∙ ║ ∙ ║ ∙ ║ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ █ ",
 "▀▀▀▀▀▀▀▀▀ ∙ ║ ∙ ║ ∙ ∙ ∙ ║ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ║ ∙ ∙ ∙ ║ ∙ ║ ∙ ▀▀▀▀▀▀▀▀▀ ",
 "─── ∙ ∙ ∙ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ╔════     ════╗ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ∙ ∙ ∙ ─── ",
 "▄▄▄▄▄▄▄▄▄ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ∙ ∙ ║             ║ ∙ ∙ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ▄▄▄▄▄▄▄▄▄ ",
 "█ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ║             ║ ∙ ║ ∙ ║ ∙ ║ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ █ ",
 "█ ∙ ║ ∙ ║ ∙ ║ ∙ ∙ ∙ ║ ∙ ║ ∙ ║ ∙ ║             ║ ∙ ║ ∙ ║ ∙ ║ ∙ ∙ ∙ ║ ∙ ║ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ║ ∙ ╚════ ∙ ║ ∙ ║ ∙ ║ ∙ ╚═════════════╝ ∙ ║ ∙ ║ ∙ ║ ∙ ════╝ ∙ ║ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ════════════╝ ∙ ╚═════════════════════════════╝ ∙ ╚════════════ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙   ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ║ ∙ ═══════════════ ∙ ║ ∙ ════╦════ ∙ ║ ∙ ═════════════════ ∙ ║ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ║ ∙ █ ",
 "█ ∙ ║ ∙ ╚══════ ∙ ║ ∙ ════════╩════ ∙ ║ ∙ ════╩════════ ∙ ║ ∙ ════════╝ ∙ ║ ∙ █ ",
 "█ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ║ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ █ ",
 "▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ",
];
