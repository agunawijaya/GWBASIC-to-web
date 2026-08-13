# MUSIC.BAS — IBM PC Music v1.10

> (C) IBM 1981, 1982. Memainkan dan menyunting lagu dengan perintah PLAY.

| | |
|---|---|
| Sumber | Program contoh IBM Personal Computer |
| Tahun | 1982 |
| Panjang | 210 baris (nomor 940–4550) |
| Subrutin | 1, dipanggil dari 1 tempat |
| Percabangan | 22 `GOTO`, 1 `GOSUB`, 2 target `ON…` |
| Komentar | 4% dari baris |
| Jalankan | `run\MUSIC.bat` |

## Peta arsitektur

*Diagram di bawah ini bukan tafsiran — semuanya diturunkan langsung dari
kode: tiap panah adalah `GOSUB` yang benar-benar ada, tiap kotak adalah
blok antara sebuah entri dan `RETURN`-nya.*

Hanya ada 1 subrutin, jadi diagram tidak menambah apa pun.

### Subrutin dan perannya

| Baris | Panjang | Dipanggil | Peran (diambil dari kode) |
|---|--:|--:|---|
| `1490`–`1510` | 3 baris | 1× | tunggu tombol |

### Program lain yang dimuat

```mermaid
flowchart LR
    SELF["MUSIC"]
    SELF ==>|"CHAIN<br/>(variabel ikut)"| NSAMPLES["SAMPLES"]
    style SELF fill:#def,stroke:#37a
```

### Kejadian yang dijebak

- `ON ERROR` → baris 0, 1148

### Perulangan utama

`GOTO` mundur terpanjang: dari baris **1830** kembali ke **1630** — melingkupi 200 nomor baris.
Itulah loop utama program ini; segala sesuatu di dalam rentang tersebut
dijalankan berulang.

### Data yang dipegang

| Array | Dipakai | Ditulis di baris |
|---|--:|---|
| `O` | 35× | 1390, 1400, 1410, 1420, 1430, … |
| `M` | 4× | 1370, 1380 |

## Bagaimana program ini disusun

Satu subrutin untuk 210 baris. Hampir seluruh program adalah alur lurus dengan
tiga loop bersarang di baris 1490–1830.

Strukturnya sama dengan `MORTGAGE.BAS`: mulai di baris 940, dua pintu masuk
(980 normal, 1000 mode contoh), ruang 1–939 dicadangkan untuk pemanggil.

Yang khas di sini adalah array-nya:

```basic
DIM M(88), O(70)
```

Delapan puluh delapan — **jumlah tuts piano**. `M` memetakan nomor tuts ke nada;
`O(70)` menyimpan lagu yang sedang disusun, dan dibaca 35 kali.

Ukuran array yang mencerminkan domainnya adalah bentuk dokumentasi. Siapa pun
yang melihat `88` di program musik langsung tahu apa yang dimodelkan — jauh lebih
informatif daripada `M(100)` yang dibulatkan.

Penanganan galatnya juga tepat sasaran:

```basic
ON ERROR GOTO 1148
```

`PLAY` akan melempar galat kalau diberi makro yang tidak sah, dan pemakai program
ini **mengetik makro `PLAY` sendiri**. Jadi galat sintaks adalah kejadian yang
diharapkan, bukan kecelakaan — menangkapnya lalu meminta ketik ulang adalah
perilaku yang benar.

Kalau Anda ingin mempelajari bahasa makro `PLAY`, urutan bacaan terbaiknya:
`GERMFOLK.BAS` (paling polos) → `DREAM.BAS` (frasa yang disusun) → program ini
(editor penuh).

## Yang menarik dari kodenya

Program IBM resmi untuk membuat dan memainkan lagu. Strukturnya sama dengan
`MORTGAGE.BAS`: mulai di baris 940, dua pintu masuk (980 dan 1000) untuk mode
biasa versus mode contoh.

Yang khas di sini adalah `DIM M(88),O(70)`. Delapan puluh delapan — **jumlah
tuts piano**. Array `M` memetakan nomor tuts ke nada; `O(70)` menyimpan lagu
yang sedang disusun.

Ukuran array yang mencerminkan domainnya seperti ini adalah bentuk dokumentasi.
Siapa pun yang melihat `88` di program musik langsung tahu apa yang sedang
dimodelkan, tanpa perlu komentar.

Program ini juga memakai `ON ERROR` untuk menangani kesalahan sintaks dalam
string `PLAY` yang diketik pemakai — karena `PLAY` akan melempar galat kalau
diberi makro yang tidak sah. Menangkapnya dan meminta pemakai mengetik ulang
jauh lebih baik daripada membiarkan program mati.

Kalau Anda ingin mempelajari bahasa makro `PLAY` secara serius, urutan bacaan
yang baik adalah: `GERMFOLK.BAS` (paling sederhana) → `DREAM.BAS` (frasa yang
disusun) → program ini (editor penuh).

## Yang bisa dipelajari

- Ukuran array yang mencerminkan domain (`M(88)` untuk tuts piano) mendokumentasikan dirinya sendiri.
- Tangkap galat dari input pengguna yang berupa bahasa (di sini makro `PLAY`) dan minta ketik ulang, jangan biarkan program mati.

## Lampiran

### Perkakas bahasa yang dipakai

`PLAY` — musik lewat bahasa makro not, `SOUND` — nada mentah (frekuensi, durasi), `DEF SEG` — pindah segmen memori, `ON ERROR GOTO` — penanganan galat, `ON x GOTO` — percabangan berindeks, `INKEY$` — baca tombol tanpa menunggu Enter, `CHAIN` — muat program lain, bawa variabel, `DEFINT` — variabel default bilangan bulat, `STRING$` — ulang satu karakter n kali, `LOCATE` — posisikan kursor, `COLOR` — warna teks

### Deklarasi array

```basic
DIM M(88),O(70)
```

### Sepuluh baris pembuka

```basic
940 REM The IBM Personal Computer Music
950 REM Version 1.10 (C)Copyright IBM Corp 1981, 1982
960 REM Licensed Material - Program Property of IBM
975 DEF SEG
980 SAMPLES$ = "NO"
990 GOTO 1010
1000 SAMPLES$ = "YES"
1010 KEY OFF:SCREEN 0,1:COLOR 15,0,0:WIDTH 40:CLS:LOCATE 5,19,0:PRINT "IBM"
1020 LOCATE 7,12:PRINT "Personal Computer"
1030 COLOR 10,0:LOCATE 10,9:PRINT CHR$(213)+STRING$(21,205)+CHR$(184)
```

---
[Dasar-dasar BASIC](00-DASAR-BASIC.md) · [Daftar review](README.md) · [Katalog koleksi](../README.md)
