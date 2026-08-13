# WRTSTR.BAS — Penulis STRINGS.FIL

> Alat pendamping yang membangkitkan ulang file aturan Eliza. Nama aslinya WRTSTRNG.BAS.

| | |
|---|---|
| Sumber | Public domain / listing majalah lain-lain |
| Tahun | 1982 |
| Panjang | 17 baris (nomor 5–160) |
| Subrutin | 0, dipanggil dari 0 tempat |
| Percabangan | 0 `GOTO`, 0 `GOSUB`, 0 target `ON…` |
| Komentar | 18% dari baris |
| Jalankan | `run\WRTSTR.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Program ini **tidak punya satu pun subrutin** — seluruhnya alur lurus
dari atas ke bawah. Untuk program sekecil ini itu pilihan yang benar.

### Data yang dipegang

| Array | Dipakai | Ditulis di baris |
|---|--:|---|
| `OW$` | 6× | 50 |
| `RW$` | 6× | 50 |
| `LO` | 5× | 40, 60 |
| `LR` | 5× | 40, 60 |
| `K$` | 5× | 120 |
| `B$` | 5× | 90 |

## Bagaimana program ini disusun

Nol subrutin, 17 baris, dan **satu-satunya program di koleksi yang tugasnya
menghasilkan berkas untuk program lain**.

```basic
10 OPEN"O",1,"STRINGS.FIL"
20 DIM OW$(22),RW$(22),LO(22),LR(22),A$(20),K$(44),B$(27),M$(20)
30 DATA .," . ",","," . ",MOM,MOTHER,DAD,FATHER,...
```

Ini **generator data**, dan polanya masih persis sama sekarang: data ditulis di
`DATA` dalam bentuk yang enak dibaca manusia, program membacanya, memprosesnya
sedikit, lalu menulis berkas dalam bentuk yang enak dibaca mesin.

Pemrosesan kecilnya ada di baris 50–70:

```basic
50 FOR I=5 TO 22:RW$(I)=" "+RW$(I)+" ":OW$(I)=" "+OW$(I)+" "
60 LO(I)=LO(I)+2:LR(I)=LR(I)+2
```

Tiap kata dibungkus spasi kiri-kanan, panjangnya ditambah 2. Kenapa? Supaya
pencarian `" I "` tidak cocok dengan "SIT" atau "TIME". Itu **pencocokan batas
kata** yang dibuat manual — sekarang kita menulis `\bI\b` di regex, prinsipnya
identik.

Yang paling penting secara arsitektur: perhitungan panjang (`LO`, `LR`) dilakukan
**sekali di sini dan disimpan ke berkas**, bukan dihitung ulang tiap kali Eliza
berjalan. Itu praberhitungan yang dipindahkan ke *waktu pembuatan* — persis
seperti *build step* sekarang.

`DIM`-nya identik dengan `ELIZA.BAS`, yang berarti keduanya harus selalu diubah
bersamaan. Ketergantungan itu tidak tercatat di mana pun.

## Yang menarik dari kodenya

Tujuh belas baris yang membangkitkan `STRINGS.FIL` — berkas aturan untuk
`ELIZA.BAS`. Namanya di dalam kode adalah `WRTSTRNG.BAS` (baris 5), dipendekkan
jadi `WRTSTR.BAS` agar muat di 8 karakter DOS.

Ini **generator data**, dan pola yang dipakainya masih persis sama sekarang:
data ditulis di `DATA` dalam bentuk yang enak dibaca manusia, program membacanya,
memprosesnya sedikit, lalu menulis berkas dalam bentuk yang enak dibaca mesin.

Pemrosesan kecilnya ada di baris 50–70:

```basic
50 FOR I=5 TO 22:RW$(I)=" "+RW$(I)+" ":OW$(I)=" "+OW$(I)+" "
60 LO(I)=LO(I)+2:LR(I)=LR(I)+2
70 NEXT
```

Tiap kata dibungkus spasi di kiri-kanan, dan panjangnya ditambah 2. Kenapa?
Supaya pencarian `" I "` tidak cocok dengan kata "SIT" atau "TIME". Itu
**pencocokan batas kata** yang dibuat manual — sekarang kita menulis `\bI\b`
di regex, tapi prinsipnya identik.

Perhatikan juga bahwa perhitungan panjang (`LO`, `LR`) dilakukan **sekali di sini
dan disimpan ke berkas**, bukan dihitung ulang tiap kali Eliza berjalan. Ini
precompute yang dipindahkan ke waktu pembuatan — persis seperti *build step*
sekarang.

Empat baris `DATA` dalam berkas 17 baris berarti hampir seluruhnya data.
Bandingkan strukturnya dengan `ELIZA.BAS` yang membacanya: `DIM` keduanya persis
sama, jadi keduanya harus selalu diubah bersamaan.

## Yang bisa dipelajari

- Pisahkan **generator data** dari **konsumen data**. Yang mahal dihitung sekali saat membangun, bukan tiap kali program jalan.
- Membungkus kata dengan spasi adalah pencocokan batas kata sebelum ada regex.

## Yang jangan ditiru

- Dua berkas dengan `DIM` identik yang harus selalu diubah bersamaan, tanpa satu pun komentar yang menyebutkan ketergantungan itu.

## Lampiran

### Perkakas bahasa yang dipakai

`OPEN` — baca/tulis berkas

### Deklarasi array

```basic
DIM OW$(22),RW$(22),LO(22),LR(22),A$(20),K$(44),B$(27),M$(20)
```

### Sepuluh baris pembuka

```basic
5 '        ***** THIS IS THE PROGRAM CALLED "WRTSTRNG.BAS" *****
10 OPEN"O",1,"STRINGS.FIL"
20 DIM OW$(22),RW$(22),LO(22),LR(22),A$(20),K$(44),B$(27),M$(20)
30 DATA .," . ",","," . ",?," . ",!," . ",MOM,MOTHER,DAD,   FATHER,DONT,DON'T,CANT,CAN'T,WONT,WON'T,DREAMED,DREAMT,   DREAMS,DREAM,I,YOU,YOU,I,ME,YOU,MY,*OUR,YOUR,MY,MYSELF,   *OURSELF,YOURSELF,MYSELF
40 FOR I=1 TO 22:READ OW$(I),RW$(I):LO(I)=LEN(OW$(I)):LR(I)=LEN(RW$(I)):NEXT
50 FOR I=5 TO 22:RW$(I)=" "+RW$(I)+" ":OW$(I)=" "+OW$(I)+" "
60 LO(I)=LO(I)+2:LR(I)=LR(I)+2
70 NEXT
80 DATA IS,ARE,ARE,WAS,MOTHER,FATHER,SISTER,BROTHER,WIFE,    HUSBAND,CHILDREN,WANT,NEED,SAD,UNHAPPY,DEPRESSED,SICK,    HAPPY,ELATED,GLAD,BETTER,FEEL,THINK,BELIEVE,WISH,CAN'T,    CANNOT
90 FOR I=1 TO 27:READ B$(I):B$(I)=" "+B$(I)+" ":NEXT
```

### Baris terpanjang (241 kolom)

```basic
30 DATA .," . ",","," . ",?," . ",!," . ",MOM,MOTHER,DAD,   FATHER,DONT,DON'T,CANT,CAN'T,WONT,WON'T,DREAMED,DREAMT,   DREAMS,DREAM,I,YOU,YOU,I,ME,YOU,MY,*OUR,YOUR,MY,MYSELF,   *OURSELF,YOURSELF,MYSELF,I'M,*OU'RE,YOU'RE,I'M,AM,ARE,   WERE,WAS
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
