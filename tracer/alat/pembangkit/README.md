# Pembangkit tabel baris dan halaman docs

Alat yang membangkitkan sebagian isi `tracer/` dari sumbernya, supaya tidak ada
angka atau aksara yang disalin dengan tangan lebih dari sekali.

Semuanya Python 3, tanpa pustaka luar, dan semuanya menghitung letak repo dari
letak skripnya sendiri — jadi boleh dijalankan dari mana saja.

## Dua kelompok

### 1. Tabel baris XWING dan TEMPLE

Dua program terakhir terlalu besar untuk ditulis tangan seluruhnya tanpa salah
salin: 732 dan 1.187 baris. Keduanya dibangkitkan.

```
python bangun.py            periksa saja — bandingkan dengan yang ada sekarang
python bangun.py --tulis    tulis hasilnya ke tracer/program/
```

Tanpa `--tulis` ia tidak menyentuh apa pun; ia cuma membangun ulang di memori
dan mengatakan apakah hasilnya sama. Kalau berbeda, salah satunya salah.

Bagiannya:

| berkas | isi |
|---|---|
| `xwexpr.py` | penerjemah ungkapan BASIC → JavaScript |
| `genxwing.py`, `genxwing2.py` | pengenal pola baris XWING |
| `gentemple.py`, `temple_gabung.py`, `temple_lanjut.py` | pengenal pola baris TEMPLE |
| `xwing_tangan.py`, `temple_tangan.py` | baris yang ditulis tangan, dengan komentarnya |
| `rakitxwing.py`, `rakittemple.py` | menggabungkan keduanya menurut nomor baris |
| `*_kepala.js`, `*_ekor*.js`, `temple_data.json` | kepala berkas, metadata program, dan DATA-nya |

**Penerjemahnya sengaja sempit.** Apa pun yang tidak cocok PERSIS melempar
`Menyerah`, dan barisnya jatuh ke berkas `*_tangan.py`. Tidak ada baris yang
diterjemahkan setengah, dan tidak ada tebakan.

Aturan itu yang menangkap tiga cacat nyata — lihat *"Penerjemah yang sengaja
sempit"* di [`../../docs/_rancangan.md`](../../docs/_rancangan.md). Yang
terpenting: di BASIC perbandingan yang benar bernilai **−1**, dan di JavaScript
`true` jadi **+1**. Karena itu perbandingan di luar syarat `IF` selalu ditolak.

Ukur alat ini dari berapa banyak yang DITOLAK, bukan berapa banyak yang
diterjemahkan.

### 2. Halaman `docs/`

```
python tulisdocs.py     tulis ulang 17 halaman (BACKGAM … WIZARD)
python tulisdocs6.py    tulis ulang 9 halaman kelompok grafik (SPACE … LANDER)
```

Keduanya membaca metadata yang **sudah ada di berkas programnya** —
`arsitektur`, `pseudokode`, `penyimpangan`, `pelajaran`, `penjelasan` — lalu
merakitnya jadi Markdown. Halaman docs tidak pernah ditulis tangan; ia turunan.

`mermaid.py` menirukan `mesin/peta.js` di Python, dan keluarannya sudah
diverifikasi **identik bita demi bita** dengan `TRACER.peta.mermaid()` untuk
setiap diagram di koleksi ini. Itu yang menjaga diagram di halaman docs tetap
sama dengan diagram di aplikasinya.

## Pemeriksa

```
python cekjs.py <berkas.js>   kurung yang tidak berpasangan, melewati string dan komentar
python hitungbaris.py         berapa program dan berapa baris BASIC yang sudah diport
```

`cekjs.py` bukan pengurai JavaScript penuh — ia cuma cukup untuk menangkap
kurung timpang di berkas tabel baris yang dibangkitkan, tanpa perlu memuatnya
di peramban.
