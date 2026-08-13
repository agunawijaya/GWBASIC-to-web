# WHATMONF.BAS — Deteksi jenis monitor

> Empat baris: mem-PEEK byte BIOS video di memori bawah untuk membedakan warna vs Hercules.

| | |
|---|---|
| Sumber | Disket majalah What Micro? (CARPARK) |
| Tahun | 1990 |
| Panjang | 4 baris (nomor 10–40) |
| Subrutin | 0, dipanggil dari 0 tempat |
| Percabangan | 0 `GOTO`, 0 `GOSUB`, 0 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\WHATMONF.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Program ini **tidak punya satu pun subrutin** — seluruhnya alur lurus
dari atas ke bawah. Untuk program sekecil ini itu pilihan yang benar.

## Bagaimana program ini disusun

Empat baris. Tidak ada arsitektur — tapi ada pelajaran yang lebih tajam.

```basic
10 DEF SEG=&H0040
20 VALUE=PEEK(&H0049)
30 IF VALUE=2 OR VALUE=3 THEN SCRN=&HB000
40 IF VALUE=7 THEN SCRN=&HB800
```

Alamat `0040:0049` adalah byte mode video BIOS. Nilai 7 = adaptor monokrom,
nilai 2 atau 3 = mode teks berwarna.

Dan pemetaannya **terbalik**. Mode 7 (monokrom) memakai segmen `&HB000`; mode 2/3
(CGA) memakai `&HB800`. Program ini menuliskannya tertukar.

Buktinya ada di koleksi ini sendiri. `MAZE.BAS` memeriksa hal serupa lewat alamat
lain dan memetakan monokrom ke `&HB000` — kebalikan dari berkas ini. Salah satu
keliru, dan menurut dokumentasi BIOS, yang keliru adalah berkas ini.

Pelajarannya bukan tentang penulisnya. Ini adalah **potongan kode yang
dimaksudkan untuk disalin ke program lain** — ia tidak pernah dijalankan
sendirian, jadi tidak pernah teruji. Empat baris pun bisa salah, dan tanpa cara
mengujinya, tidak ada yang akan tahu.

Kalau Anda menerbitkan potongan kode untuk disalin orang, sediakan juga cara
membuktikannya benar. Untuk berkas ini caranya mudah: jalankan `_GW-BASIC.bat`,
ketik keempat baris itu, tambahkan `50 PRINT VALUE, HEX$(SCRN)`, lalu `RUN`.

## Yang menarik dari kodenya

Empat baris. Program terpendek di koleksi, dan tetap mengajarkan sesuatu:

```basic
10 DEF SEG=&H0040
20 VALUE=PEEK(&H0049)
30 IF VALUE=2 OR VALUE=3 THEN SCRN=&HB000
40 IF VALUE=7 THEN SCRN=&HB800
```

Alamat `0040:0049` adalah **byte mode video BIOS**. Nilai 7 berarti adaptor
monokrom (MDA/Hercules), nilai 2 atau 3 berarti mode teks berwarna. Dari situ
program menetapkan alamat memori layar yang benar.

Ada satu hal yang menarik di sini: nilainya **tertukar** dibanding kebiasaan
umum. Mode 7 (monokrom) seharusnya memakai segmen `&HB000`, dan mode 2/3 (CGA)
memakai `&HB800`. Program ini menuliskannya terbalik.

Bandingkan dengan `MAZE.BAS` yang memeriksa hal serupa lewat alamat lain dan
memetakan `&HB000` ke monokrom — kebalikan dari berkas ini. Salah satunya
keliru, dan berdasarkan dokumentasi BIOS, yang keliru adalah berkas ini.

Ini bukan kritik terhadap penulisnya, melainkan pelajaran: **kode empat baris
pun bisa salah, dan tanpa cara mengujinya, tidak ada yang akan tahu.** Berkas ini
berasal dari cover disk majalah dan tidak pernah dijalankan sendirian — ia
potongan untuk disalin ke program lain.

Cara memeriksanya sendiri: jalankan `_GW-BASIC.bat`, ketik program empat baris
ini, tambahkan `50 PRINT VALUE, HEX$(SCRN)`, lalu `RUN`.

## Yang bisa dipelajari

- Byte `0040:0049` menyimpan mode video BIOS. Nilai 7 = monokrom, 2/3 = teks berwarna.
- Potongan kode yang dimaksudkan untuk disalin ke tempat lain jarang teruji. Verifikasi sebelum memakainya.

## Yang jangan ditiru

- Menerbitkan potongan kode tanpa cara mengujinya. Empat baris ini beredar di majalah dengan pemetaan yang tampaknya terbalik.

## Lampiran

### Perkakas bahasa yang dipakai

`PEEK` — baca memori langsung, `DEF SEG` — pindah segmen memori

### Sepuluh baris pembuka

```basic
10 DEF SEG=&H0040
20 VALUE=PEEK(&H0049)
30 IF VALUE=2 OR VALUE=3 THEN SCRN=&HB000
40 IF VALUE=7 THEN SCRN=&HB800
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
