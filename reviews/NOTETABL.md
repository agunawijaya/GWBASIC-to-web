# NOTETABL.BAS — Tabel nada / frekuensi

> Mencetak seluruh nada dan frekuensinya untuk dipakai dengan SOUND. Berbasis LPRINT.

| | |
|---|---|
| Sumber | Disket majalah What Micro? (CARPARK) |
| Tahun | 1990 |
| Panjang | 26 baris (nomor 10–260) |
| Subrutin | 0, dipanggil dari 0 tempat |
| Percabangan | 0 `GOTO`, 0 `GOSUB`, 0 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\NOTETABL.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Program ini **tidak punya satu pun subrutin** — seluruhnya alur lurus
dari atas ke bawah. Untuk program sekecil ini itu pilihan yang benar.

### Data yang dipegang

| Array | Dipakai | Ditulis di baris |
|---|--:|---|
| `NOTENAME$` | 3× | 50 |

## Bagaimana program ini disusun

Nol subrutin, nol percabangan, 26 baris. Tidak ada arsitektur — dan yang menarik
justru **gaya penulisannya**, karena berkas ini ditulis tahun 1990, delapan tahun
setelah sebagian besar isi koleksi.

```basic
10 OPTION BASE 1
30 noteno = 1: DIM notename$(12)
40 FOR count = 1 TO 12
50     READ note$: notename$(count) = note$
60 NEXT count
```

Tiga hal yang tidak muncul di 82 program lainnya:

1. **Nama variabel huruf kecil dan bermakna** — `noteno`, `notename$`, `count`,
   `oct`. Bukan `N`, `A$`, `I`.
2. **Indentasi sungguhan** di dalam blok `FOR`.
3. **`OPTION BASE 1`** — indeks array mulai dari 1, bukan 0. Dinyatakan sekali,
   dan seluruh program bebas dari kebingungan off-by-one.

Bahasanya sama persis dengan `TICTAC.BAS` dari 1982. Yang berubah cuma kebiasaan
orang yang menulisnya. Membaca kedua berkas berdampingan adalah cara tercepat
melihat delapan tahun evolusi budaya pemrograman.

`OPTION BASE 1` khususnya layak diingat: ia menghapus seluruh kelas bug dengan
satu baris deklarasi, dan tersedia di GW-BASIC sejak awal — hanya nyaris tidak
ada yang memakainya.

## Yang menarik dari kodenya

Dua puluh enam baris dari disket majalah *What Micro?*, dan **satu-satunya
program di seluruh koleksi yang ditulis dengan gaya modern**:

```basic
10 OPTION BASE 1
30 noteno = 1: DIM notename$(12)
40 FOR count = 1 TO 12
50     READ note$: notename$(count) = note$
60 NEXT count
```

Perhatikan tiga hal yang tidak muncul di 82 program lainnya:

1. **Nama variabel huruf kecil dan bermakna**: `noteno`, `notename$`, `count`,
   `oct`. Bukan `N`, `A$`, `I`.
2. **Indentasi dengan tab** di dalam blok `FOR`.
3. **`OPTION BASE 1`** — mengubah indeks array agar mulai dari 1, bukan 0.
   Sekali dinyatakan, seluruh program jadi bebas dari kebingungan off-by-one.

Ini ditulis tahun 1990, delapan tahun setelah kebanyakan isi koleksi ini. Dalam
rentang itu, gaya menulis kode di dunia BASIC berubah total — dan berkas ini
adalah buktinya dalam satu halaman.

Bandingkan berdampingan dengan `TICTAC.BAS` (1982). Bahasanya sama persis.
Yang berbeda hanya kebiasaan orang yang menulisnya.

Isinya sendiri sederhana: mencetak tabel nada dan frekuensi ke printer lewat
`LPRINT`, untuk dipakai bersama perintah `SOUND`.

## Yang bisa dipelajari

- `OPTION BASE 1` menghapus seluruh kelas bug off-by-one di BASIC. Nyatakan sekali di awal.
- Nama variabel bermakna dan indentasi bisa dilakukan di BASIC sejak awal. Yang berubah adalah kebiasaan, bukan bahasanya.
- Baca berkas ini bersebelahan dengan program tahun 1982 mana pun. Perbandingan itu sendiri adalah pelajarannya.

## Lampiran

### Perkakas bahasa yang dipakai

`STRING$` — ulang satu karakter n kali, `LPRINT` — cetak ke printer

### Deklarasi array

```basic
DIM NOTENAME$(12)
```

### Sepuluh baris pembuka

```basic
10 OPTION BASE 1
20 CLS
30 noteno = 1: DIM notename$(12)
40 FOR count = 1 TO 12
50	READ note$: notename$(count) = note$
60 NEXT count
70 FOR oct = -3 TO 4
80	LPRINT : LPRINT
90	LPRINT STRING$(79, "-");
100	LPRINT : LPRINT TAB(30);
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
