# DREAM.BAS — Dream (musik)

> Satu lagu yang seluruhnya ditulis sebagai string makro PLAY.

| | |
|---|---|
| Sumber | Public domain / listing majalah lain-lain |
| Tahun | 1984 |
| Panjang | 18 baris (nomor 10–180) |
| Subrutin | 0, dipanggil dari 0 tempat |
| Percabangan | 0 `GOTO`, 0 `GOSUB`, 0 target `ON…` |
| Komentar | 0% dari baris |
| Jalankan | `run\DREAM.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Program ini **tidak punya satu pun subrutin** — seluruhnya alur lurus
dari atas ke bawah. Untuk program sekecil ini itu pilihan yang benar.

## Bagaimana program ini disusun

**Nol subrutin, nol `GOTO`, nol percabangan.** Delapan belas baris yang isinya
murni penetapan variabel, lalu memainkannya.

```basic
10 A$ = "O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G"
20 B$ = "MLL4A.MNL8AFGAGFMLL2A.MNL8AP8A"
```

Ini arsitektur **data-sebagai-program**. Tiap variabel menyimpan satu frasa
musik; lagunya dibentuk dengan menyebut nama-nama frasa dalam urutan tertentu.
Frasa yang berulang cukup disebut ulang.

Struktur bait–refrein–bridge sebuah lagu jadi tercermin langsung di struktur
programnya, dan itulah kenapa lagu tiga menit muat dalam 18 baris.

Prinsipnya sama dengan kompresi berbasis kamus, dan dengan cara kerja
komponen di antarmuka: **definisikan sekali, rujuk berkali-kali.**

Bandingkan dengan `GERMFOLK.BAS` yang menulis notnya lurus tanpa disimpan ke
variabel. Untuk lagu tanpa banyak pengulangan, cara itu lebih terbaca; untuk
lagu dengan refrein, cara `DREAM` lebih hemat. Dua arsitektur untuk satu
masalah, masing-masing benar di tempatnya.

## Yang menarik dari kodenya

Delapan belas baris, tanpa satu pun `GOTO` atau `GOSUB`. Isinya murni data:

```basic
10 A$ = "O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G"
20 B$ = "MLL4A.MNL8AFGAGFMLL2A.MNL8AP8A"
```

Tiap variabel menyimpan satu frasa musik dalam bahasa makro `PLAY`. Setelah
semua frasa didefinisikan, program tinggal memainkannya dalam urutan tertentu —
dan frasa yang berulang cukup disebut ulang namanya.

Ini persis konsep **struktur lagu**: bait, refrein, bridge. Dengan menyimpan tiap
bagian sekali lalu menyusunnya, lagu tiga menit muat dalam delapan belas baris.
Prinsipnya sama dengan kompresi berbasis kamus.

Baca bahasa makronya: `O3` = oktaf 3, `L8` = not seperdelapan, `ML` = legato,
`MN` = normal, `P8` = istirahat seperdelapan, `.` = not bertitik (1,5×).
Ini bahasa domain-spesifik yang dipanggang ke dalam interpreter BASIC pada 1981.

## Yang bisa dipelajari

- Pisahkan data dari alur. Program ini seluruhnya data, dan justru karena itu ia pendek dan mudah diubah.
- Simpan bagian yang berulang sekali, lalu susun dari namanya. Berlaku untuk musik, untuk teks, untuk apa pun.
- `PLAY` adalah contoh bahasa domain-spesifik yang tertanam. Perhatikan betapa padatnya notasi yang tepat sasaran.

## Lampiran

### Perkakas bahasa yang dipakai

`PLAY` — musik lewat bahasa makro not

### Sepuluh baris pembuka

```basic
10 A$ = "O3L8EL4MLG.MNL8GEFGFEMLL2G.L8MNGP8G"
20 B$ = "MLL4A.MNL8AFGAGFMLL2A.MNL8AP8A"
30 C$ = "MLL4B.MNL8BEFGABO4CO3MLL4FF.MNFL8G"
40 D$ = "MLL4A.MNL8ADEFGAMLL2B.MNL4B"
50 E$ = "MLL4A.MNL8AFGABO4CL2D.L8CDCL4MLE.MNEL8CCDC"
60 F$ = "MLL4E.MNEL8CCDCEO3MLL4BMNBL8O4CDCO3B"
70 G$ = "MLL4O4D.MNDL8O3AO4CO3BAO4L4MLC.MNL8CO3ABO4CO3BA"
80 H$ = "MLO4L4C.MNL8CCDEDCEDCECDEFE"
90 I$ = "MLL2D.MNL8DDEMLL4F.MNL8FEDFED"
100 J$ = "MLL4F.MNL8FEFEDCO3MLL2B.MNL8BBO4C"
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
