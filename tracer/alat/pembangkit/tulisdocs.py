import sys, pathlib, io
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
import gendocs as G
# Konsol Windows memakai cp1252; laporan di bawah memuat aksara di luar itu.
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

DOCS = AKAR / 'tracer' / 'docs'

ORD = {56: 'kelima puluh enam', 57: 'kelima puluh tujuh',
       58: 'kelima puluh delapan', 59: 'kelima puluh sembilan',
       60: 'keenam puluh', 61: 'keenam puluh satu', 62: 'keenam puluh dua',
       63: 'keenam puluh tiga', 64: 'keenam puluh empat',
       65: 'keenam puluh lima', 66: 'keenam puluh enam',
       67: 'keenam puluh tujuh', 68: 'keenam puluh delapan',
       69: 'keenam puluh sembilan', 70: 'ketujuh puluh',
       71: 'ketujuh puluh satu', 72: 'ketujuh puluh dua'}

# nama, urutan, kalimat pembuka, tautan tetangga
DAFTAR = [
 ('BACKGAM', 56,
  'Dua pemain di satu papan tombol, dan seluruh papannya muat di satu larik '
  'dua puluh enam unsur.',
  '[DROIDS](droids.md) · [MORTGAGE](mortgage.md)'),
 ('DROIDS', 57,
  'Menambang bijih di terowongan sambil menghindari droid yang meluncur — dan '
  'droidnya membaca layar untuk tahu ke mana ia bisa pergi.',
  '[BACKGAM](backgam.md) · [SERPENT](serpent.md) · [METEOR](meteor.md)'),
 ('MUSIC', 58,
  'Papan tuts di layar teks, sebelas lagu, dan delapan puluh dua frekuensi '
  'yang dihitung dari satu rumus.',
  '[MUSIC1](music1.md) · [NOTETABL](notetabl.md) · [OCTAVE](octave.md)'),
 ('MUSIC1', 59,
  'Berkas yang sama dengan MUSIC.BAS, berbeda empat baris — dan dua di '
  'antaranya tidak mengubah apa pun.',
  '[MUSIC](music.md)'),
 ('ATTACK', 60,
  'Sebuah permainan pengebom, di disket utilitas IBM, yang sasarannya pabrik '
  'Apple.',
  '[SERPENT](serpent.md) · [ZAP\'EM](zapem.md) · [METEOR](meteor.md)'),
 ('BJ', 61,
  'Blackjack empat dek dengan split dan asuransi — dan kartu As dilacak tanpa '
  'satu pun bendera.',
  '[BLACKJCK](blackjck.md) · [BLACK](black.md) · [CRAZY8](crazy8.md)'),
 ('BLACKJCK', 62,
  'Ditulis 3 Januari 1978, empat tahun sebelum mesin yang menjalankannya ada.',
  '[BJ](bj.md) · [BLACK](black.md) · [YAHTZEE](yahtzee.md)'),
 ('TEM-INS', 63,
  'Dua ratus sembilan puluh baris yang tidak menghitung apa pun — separuh '
  'dari sepasang berkas yang saling memanggil.',
  '[WIZARD](wizard.md) · [HISTORY](history.md)'),
 ('CRAZY8', 64,
  'Kartu digambar dengan mengubah satu kisi bersama, dan pintu untuk '
  'mengosongkannya tidak pernah diketuk.',
  '[BJ](bj.md) · [BLACKJCK](blackjck.md)'),
 ('HISTORY', 65,
  'Enam belas halaman pelajaran komputer untuk orang yang baru membuka kardus '
  'PC-nya — dengan tombol mundur yang salah sasaran di lima halaman.',
  '[TEM-INS](tem-ins.md) · [HINTS](hints.md) · [ANATOMY](anatomy.md)'),
 ('TRUCKER', 66,
  'Mengemudi truk dari Los Angeles ke New York dalam empat hari, dengan peta '
  'yang muat di satu kolom angka.',
  '[BLACK](black.md) · [MORTGAGE](mortgage.md)'),
 ('BLACK', 67,
  'Program kedua Hughes Glantzberg di koleksi ini — dengan tiga subrutin yang '
  'disalin utuh dari TRUCKER.BAS, cacatnya ikut.',
  '[TRUCKER](trucker.md) · [BJ](bj.md) · [BLACKJCK](blackjck.md)'),
 ('ELIZA', 68,
  'Psikoterapis Weizenbaum, ditulis ulang untuk PC — dengan seluruh '
  'kosakatanya di berkas terpisah dan sebuah bita nol yang menjaga '
  'pekerjaannya.',
  '[STARTREK](startrek.md) · [WIZARD](wizard.md)'),
 ('STARTREK', 69,
  'Terbit di Creative Computing awal 1970-an, dipindahkan ke IBM PC sepuluh '
  'tahun kemudian — dan bekas kedua zamannya masih terlihat.',
  '[ELIZA](eliza.md) · [WIZARD](wizard.md) · [ATTACK](attack.md)'),
 ('BATSHIP', 70,
  'Enam kapal disembunyikan di petak sepuluh kali sepuluh, dengan aturan '
  '"tidak boleh bersentuhan" yang diwujudkan sebagai daftar.',
  '[YAHTZEE](yahtzee.md) · [BOWLING](bowling.md)'),
 ('YAHTZEE', 71,
  'Satu larik yang mengindeks dadu menurut banyaknya — dan empat puluh baris '
  'komentar yang menggambar larik itu.',
  '[BLACKJCK](blackjck.md) · [BATSHIP](batship.md) · [CRAZY8](crazy8.md)'),
 ('WIZARD', 72,
  'Program terpanjang di koleksi ini, dan induk dari sebuah permainan lain '
  'yang tersimpan di disket yang sama.',
  '[TEM-INS](tem-ins.md) · [STARTREK](startrek.md) · [ELIZA](eliza.md)'),
]

if __name__ == '__main__':
    for nama, no, pembuka, tetangga in DAFTAR:
        teks = G.halaman(nama, ORD[no], tetangga, pembuka)
        (DOCS / (nama.lower() + '.md')).write_text(
            teks, encoding='utf-8', newline=chr(10))
        print('%-9s %5d bita  ->  docs/%s.md' %
              (nama, len(teks), nama.lower()))
