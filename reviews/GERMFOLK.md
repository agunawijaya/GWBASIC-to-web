# GERMFOLK.BAS — Lagu rakyat Jerman

> Disebut di README.CAR sebagai demonstrasi perintah PLAY/SOUND.

| | |
|---|---|
| Sumber | Disket majalah What Micro? (CARPARK) |
| Tahun | 1990 |
| Panjang | 10 baris (nomor 10–100) |
| Subrutin | 0, dipanggil dari 0 tempat |
| Percabangan | 0 `GOTO`, 0 `GOSUB`, 0 target `ON…` |
| Komentar | 10% dari baris |
| Jalankan | `run\GERMFOLK.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Program ini **tidak punya satu pun subrutin** — seluruhnya alur lurus
dari atas ke bawah. Untuk program sekecil ini itu pilihan yang benar.

## Bagaimana program ini disusun

**Nol subrutin, nol percabangan, sepuluh baris.** Tidak ada arsitektur untuk
dibahas, dan itulah pelajarannya.

```basic
20 PLAY "o2 t200 l8"      ' setel keadaan sekali
30 PLAY "d g a b >c d4 ml e c< "
40 PLAY "mn b p8 a p8 g4 p8 "
```

Baris 20 menyetel oktaf, tempo, dan panjang not. Baris-baris sesudahnya cuma
not. Pemisahan antara **konfigurasi** dan **isi** membuat program ini terbaca
seperti partitur.

Ini pola yang berlaku jauh di luar musik: setel konteks sekali di awal, lalu
tulis isinya tanpa mengulang setelan. Anda melakukannya tiap kali menulis
`ctx.fillStyle = "red"` sebelum menggambar sepuluh kotak, atau menaruh
konfigurasi di puncak berkas.

Berkas ini berasal dari disket majalah dan memang ditulis untuk mengajar. Itu
terlihat dari setiap pilihannya: satu ide per baris, spasi di antara not, nol
trik. Kalau Anda menulis contoh untuk orang lain, tulis seperti ini.

## Yang menarik dari kodenya

Sepuluh baris, dan **satu-satunya program di koleksi yang menjelaskan dirinya
sendiri sepenuhnya**:

```basic
10 REM ******A German Folk Tune******
20 PLAY "o2 t200 l8"
30 PLAY "d g a b >c d4 ml e c< "
```

Baris 20 menyetel keadaan sekali: oktaf 2, tempo 200, panjang not seperdelapan.
Baris-baris berikutnya hanya not. Pemisahan antara "menyetel" dan "memainkan"
membuatnya bisa dibaca seperti partitur.

Bandingkan dengan `DREAM.BAS` yang menyimpan frasa ke variabel lalu
menyusunnya: dua pendekatan berbeda untuk masalah yang sama. `GERMFOLK` lebih
mudah dibaca dan diubah; `DREAM` lebih hemat kalau ada banyak pengulangan.
Keduanya benar untuk konteksnya masing-masing.

Berkas ini berasal dari disket majalah *What Micro?* dan memang ditulis untuk
mengajar, bukan untuk dipakai. Itu terlihat dari setiap pilihan di dalamnya:
satu ide per baris, spasi di antara not, nol trik.

## Yang bisa dipelajari

- Setel keadaan sekali di awal, lalu tulis isinya. Berlaku untuk `PLAY`, untuk grafis, untuk konfigurasi apa pun.
- Kode yang ditulis untuk mengajar terlihat berbeda dari kode yang ditulis untuk bekerja. Kalau Anda menulis contoh, tulis seperti ini.

## Lampiran

### Perkakas bahasa yang dipakai

`PLAY` — musik lewat bahasa makro not

### Sepuluh baris pembuka

```basic
10 REM ******A German Folk Tune******
20 PLAY "o2 t200 l8"
30 PLAY "d g a b >c d4 ml e c< "
40 PLAY "mn b p8 a p8 g4 p8 "
50 PLAY "d g a b >c d4 ml"
60 PLAY " e c <b p8 a8 p8 g4 p4"
70 PLAY ">d8. c16 <b >d c <b"
80 PLAY "a4 >d8. c16 <b >d c <b a4"
90 PLAY "g a b >c d4 ml e c mn"
100 PLAY "<b p8 a p8 g4."
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
