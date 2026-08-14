import sys, pathlib
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
import gendocs as G

DOCS = AKAR / 'tracer' / 'docs'

ORD = {73:'ketujuh puluh tiga', 74:'ketujuh puluh empat', 75:'ketujuh puluh lima',
       76:'ketujuh puluh enam', 77:'ketujuh puluh tujuh', 78:'ketujuh puluh delapan',
       79:'ketujuh puluh sembilan', 80:'kedelapan puluh', 81:'kedelapan puluh satu',
       82:'kedelapan puluh dua', 83:'kedelapan puluh tiga'}

DAFTAR = [
 ('SPACE', 73,
  'Lima puluh tujuh baris, dan hanya delapan di antaranya yang benar-benar '
  'programnya — sisanya kerangka yang dipakai seluruh disket contoh IBM.',
  '[PIECHART](piechart.md) · [MORTGAGE](mortgage.md) · [DROIDS](droids.md)'),
 ('PIECHART', 74,
  'Diagram pai yang seluruh irisannya merenggang tanpa satu baris pun yang '
  'khusus untuk itu.',
  '[SPACE](space.md) · [15PUZZLE](15puzzle.md)'),
 ('15PUZZLE', 75,
  'Angka yang baru dicetak dipakai sebagai dinding penahan cat — dan separuh '
  'teka-tekinya mustahil diselesaikan.',
  '[BREAKOUT](breakout.md) · [SOLITAIR](solitair.md)'),
 ('BREAKOUT', 76,
  'Satu Januari 1982, lima bulan sesudah IBM PC dijual — dan bolanya '
  'melengkung.',
  '[15PUZZLE](15puzzle.md) · [ABM2A](abm2a.md) · [LANDER](lander.md)'),
 ('FLYS', 77,
  'String DRAW yang membaca variabel BASIC dari dalam dirinya sendiri, dan '
  'sepetak layar kosong yang dipungut jadi penghapus.',
  '[ABM2A](abm2a.md) · [15PUZZLE](15puzzle.md)'),
 ('LIFE2', 78,
  'Kehidupan Conway yang tidak pernah menelusuri papannya — dan sebuah STOP '
  'yang dipasang sebagai penjaga.',
  '[SOLITAIR](solitair.md) · [FLYS](flys.md)'),
 ('ABM2A', 79,
  'Bahasa DRAW dipakai sebagai bahasa pemrograman: string yang memanggil '
  'string lain sebagai subrutin gambar.',
  '[FLYS](flys.md) · [LANDER](lander.md) · [BREAKOUT](breakout.md)'),
 ('SOLITAIR', 80,
  'Layar petunjuk yang sudah tergambar di halaman lain sebelum ada yang '
  'memintanya.',
  '[LIFE2](life2.md) · [15PUZZLE](15puzzle.md) · [CRAZY8](crazy8.md)'),
 ('LANDER', 81,
  'Satu BLOAD yang mengisi empat puluh larik — dan sebuah komentar bertanggal '
  '23 Februari 1982 yang mengaku kenapa SCREEN harus dipanggil dua kali.',
  '[ABM2A](abm2a.md) · [BREAKOUT](breakout.md) · [SOLITAIR](solitair.md)'),
]

if __name__ == '__main__':
    hasil = []
    for nama, no, pembuka, tetangga in DAFTAR:
        teks = G.halaman(nama, ORD[no], tetangga, pembuka)
        (DOCS / (nama.lower() + '.md')).write_text(teks, encoding='utf-8', newline='\n')
        hasil.append('%-9s %6d bita  ->  docs/%s.md' % (nama, len(teks), nama.lower()))
    (_ALAT / str(_ALAT / 'hasil6.txt')).write_text('\n'.join(hasil), encoding='utf-8')
