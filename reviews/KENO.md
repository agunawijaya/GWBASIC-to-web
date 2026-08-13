# KENO.BAS — PC Keno

> Steve Schlich, Sep 1984. Papan digambar dengan karakter kotak CP437.

| | |
|---|---|
| Sumber | Public domain / listing majalah lain-lain |
| Tahun | 1984 |
| Panjang | 137 baris (nomor 10–9140) |
| Subrutin | 1, dipanggil dari 2 tempat |
| Percabangan | 8 `GOTO`, 2 `GOSUB`, 0 target `ON…` |
| Komentar | 2% dari baris |
| Jalankan | `run\KENO.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Hanya ada 1 subrutin, jadi diagram tidak menambah apa pun.

### Subrutin dan perannya

| Baris | Panjang | Dipanggil | Peran (diambil dari kode) |
|---|--:|--:|---|
| `760`–`870` | 13 baris | 2× | subroutine to put number up on screen |

### Perulangan utama

`GOTO` mundur terpanjang: dari baris **9140** kembali ke **60** — melingkupi 9080 nomor baris.
Itulah loop utama program ini; segala sesuatu di dalam rentang tersebut
dijalankan berulang.

### Data yang dipegang

| Array | Dipakai | Ditulis di baris |
|---|--:|---|
| `ROW` | 13× | 120, 130, 140, 150, 160, … |
| `COL` | 11× | 220, 230, 240, 250, 260, … |
| `CHOSEN` | 5× | 700, 1020 |
| `PICK` | 5× | 580, 930, 1030 |
| `PICKED` | 4× | 590, 770, 930 |

## Bagaimana program ini disusun

Satu subrutin untuk 137 baris, dan namanya ditulis penulisnya sendiri:
`subroutine to put number up on screen`.

Kenapa cuma satu? Karena keno cuma punya satu operasi yang berulang: menaruh
sebuah angka di kotaknya. Segala hal lain — mengocok, mengundi, membandingkan —
terjadi sekali per ronde dan tidak perlu dipanggil dari mana-mana.

Lima array-nya bercerita lebih banyak daripada subrutinnya:

```basic
ROW(100), COL(100), CHOSEN(100), PICKED(100), PICK(100)
```

`ROW`/`COL` = posisi layar tiap angka (dihitung sekali, dipakai terus).
`CHOSEN` = angka yang dipilih pemain. `PICKED`/`PICK` = angka yang diundi.

Memisahkan **posisi layar** dari **keadaan permainan** ke array berbeda adalah
pemisahan tampilan-dan-data yang benar. `ROW`/`COL` diisi sekali di awal; sisa
program tinggal `LOCATE ROW(N), COL(N)` tanpa menghitung apa pun.

Loop terluarnya melingkupi 9080 nomor baris (60←9140) — layar instruksi ada di
baris 9000-an, jauh dari kode permainan. Pemisahan wilayah nomor baris lagi.

Peringatan penamaan: `PICK` dan `PICKED` bersebelahan dan artinya mirip. Nama
yang baik belum cukup kalau dua nama tetangga tidak jelas bedanya.

## Yang menarik dari kodenya

PC Keno karya Steve Schlich, September 1984. Yang menonjol adalah **penamaan
arraynya**:

```basic
DIM ROW(100), COL(100), CHOSEN(100), PICKED(100), PICK(100)
```

`ROW`, `COL`, `CHOSEN`, `PICKED`, `PICK` — semuanya kata sungguhan. Bandingkan
dengan tetangganya yang memakai `A`, `B`, `Q`, `Z`. Ini membuat kode bisa dibaca
tanpa kamus.

Tapi perhatikan jebakan yang tersisa: `PICKED` dan `PICK` berbeda satu huruf dan
maknanya mirip. Nama yang baik belum cukup kalau dua nama yang berdekatan tidak
jelas bedanya. Ini masalah yang sama dengan `user` vs `users` di kode modern.

Papannya digambar dengan karakter kotak ganda:

```basic
║ 1  ║ 2  ║ 3  ║ 4  ║ 5  ║ 6  ║ 7  ║ 8  ║ 9  ║ 10 ║      GAME
```

Ditulis utuh sebagai teks, bukan dirakit dengan `STRING$`. Untuk tabel yang
bentuknya tidak beraturan, menulis utuh memang lebih jelas — dan sekaligus
menjadikan berkas sumbernya semacam gambar rancangan.

Baris 510 memakai `COLOR 16,5` — warna 16 adalah **atribut berkedip** di CGA.
Dipakai menandai angka yang cocok. Efektif, dan gratis.

## Yang bisa dipelajari

- Pakai kata sungguhan untuk nama array. `CHOSEN(100)` langsung memberi tahu isinya.
- Untuk tata letak yang tidak beraturan, menulis utuh lebih jelas daripada merakit dengan loop.
- Warna 16–31 di CGA berarti berkedip. Cara gratis menarik perhatian.

## Yang jangan ditiru

- `PICK` dan `PICKED` berdampingan. Kalau dua nama hanya beda imbuhan, pembaca akan tertukar cepat atau lambat.

## Lampiran

### Perkakas bahasa yang dipakai

`PLAY` — musik lewat bahasa makro not, `INKEY$` — baca tombol tanpa menunggu Enter, `RANDOMIZE` — menyemai pengacak, `DEFINT` — variabel default bilangan bulat, `LOCATE` — posisikan kursor, `COLOR` — warna teks

### Deklarasi array

```basic
DIM ROW(100)
DIM COL(100)
DIM CHOSEN(100)
DIM PICKED(100)
DIM PICK(100)
```

### Sepuluh baris pembuka

```basic
10 'PC KENO by Steve Schlich 9/84
20 GAME=1
30 DEFINT A-Z
40 CLEAR
50 CLS:KEY OFF
55 CLS: PRINT "Do you want instructions (Y/N)?";
56 B$=INKEY$: IF B$="" THEN 56
57 IF B$="Y" OR B$="y" THEN 9000
60 CLS:DIM ROW(100)
70 DIM COL(100)
```

### Baris terpanjang (154 kolom)

```basic
510 LOCATE 25,22: COLOR 0,3: PRINT " your spot ";: LOCATE 25,35: COLOR 0,7: PRINT " drawn spot ";: LOCATE 25,49: COLOR 16,5: PRINT " a match ";: COLOR 6,0
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
