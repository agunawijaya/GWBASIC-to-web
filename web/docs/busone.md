# BUSONE…BUSTEN — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/BUSONE.BAS` … `run/BUSTEN.BAS` — **sepuluh berkas** |
| Penerbit | Friendlyware, 1982 |
| Ukuran asli | 911 baris, 50.111 bita, **41 layar** |
| Hasil port | [`../games/busone/`](../games/busone/index.html) |
| Analisis BASIC | [`../../reviews/BUSONE.md`](../../reviews/BUSONE.md) |

*"A walk through the automated accounting world"* — tutorial akuntansi dua
belas langkah, dari menyusun bagan akun sampai neraca saldo penutup, memakai
satu contoh: **ABC Hardware, Juni 1982**.

---

## 1 · Sepuluh berkas, dan alasannya bisa dihitung

| Berkas | Layar | Bita |
|---|--:|--:|
| `BUSONE` | 13 | 7.431 |
| `BUSTWO` | 2 | 3.198 |
| `BUSTHREE` | 5 | 7.232 |
| `BUSFOUR` | 2 | 3.330 |
| `BUSFIVE` | 2 | 5.539 |
| `BUSSIX` | 6 | 6.357 |
| `BUSSEVEN` | 3 | 5.133 |
| `BUSEIGHT` | 4 | 5.918 |
| `BUSNINE` | 2 | 2.931 |
| `BUSTEN` | 2 | 3.042 |
| **Total** | **41** | **50.111** |
| Memori IBM PC 1982 | | 65.536 |

Lima puluh kilobita teks program. Sebuah PC 64 KB harus memuat penafsir BASIC,
ruang kerjanya, **dan** programnya — jadi lima puluh kilobita tidak akan
pernah muat sekaligus.

Karena itu tutorialnya dipecah jadi sepuluh program yang saling memanggil:

```basic
1380 RUN"BUSTWO"     ← akhir BUSONE
 …
     RUN"BUSTEN"     ← akhir BUSNINE
```

`RUN` **membuang seluruh variabel**. Jadi tidak ada apa pun yang bisa dibawa
dari satu langkah ke langkah berikutnya — tiap berkas menggambar ulang
bingkainya sendiri, dan angka ABC Hardware harus **diketik ulang** di tiap
berkas yang memakainya.

> **Pelajaran.** Ini bentuk paling ekstrem dari pola yang berulang di koleksi
> ini. [ANATOMY](anatomy.md) tidak bisa menyimpan halaman sebagai tabel, jadi
> memakai sembilan baris kode yang hampir identik. **BUS tidak bisa
> menyimpannya di satu program sama sekali, jadi memakai sepuluh berkas.**
> Batas mesin memilih bentuk arsitekturnya, dan bentuk itu bertahan jauh
> setelah batasnya hilang.

---

## 2 · Bagan yang tumbuh, bukan bagan yang diganti

Langkah I menggambarkan siklus akuntansi sebagai bagan alur kotak. Layar
berikutnya **tidak menggambar ulang** — ia menambah satu kotak ke bagan yang
sudah ada.

Diukur **per sel** dari layar hasilnya sendiri:

| | |
|---|--:|
| Layar yang tidak menghapus satu aksara pun | **9** |
| dari | 41 |
| Semuanya di | `BUSONE` |

Contoh: layar 13 menambah **60 aksara** dan menghapus **nol**.

### Ukuran per baris tidak cukup, dan itu sendiri temuannya

Versi pertama ukuran ini membandingkan **baris utuh** — dan hanya menemukan
dua layar. Sebabnya: bagan tumbuh dengan **memanjangkan** baris yang sudah
ada. Baris 18 berubah dari satu kotak jadi dua:

```
    ╔═════════════╗
    ╔═════════════╗     ╔═════════════╗
```

Barisnya memang tidak sama lagi, padahal tidak ada satu aksara pun yang
dihapus. Definisi yang benar adalah per sel: **tidak ada sel yang tadi berisi
lalu sekarang kosong atau berubah.**

> **Pelajaran.** Sebuah ukuran yang salah tidak memberi jawaban salah — ia
> memberi jawaban untuk pertanyaan lain, dan angkanya tetap terlihat
> meyakinkan. "2 dari 41" tidak tampak mencurigakan sampai dibandingkan
> dengan apa yang sebenarnya terlihat di layar.

Dan efeknya di 4,77 MHz bukan sekadar hemat: pemakai **melihat** kotak baru
muncul di bagan yang tetap diam. Menggambar ulang seluruh bagan akan membuat
layarnya berkedip, dan hubungan antar-langkahnya hilang.

---

## 3 · Enam baris yang sama di sepuluh berkas

```basic
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30 GOTO 80
```

Itu **seluruh** kode yang dipakai bersama sepuluh berkas — enam baris, dan
semuanya soal membaca tombol. Sembilan ratus sebelas baris sisanya tidak ada
yang sama.

Jebakan sembilan tombol fungsi ke penangan kosong muncul untuk **kelima
kalinya** di koleksi ini, sesudah [HEAREYE](heareye.md), [BIO](bio.md), dan
[CHECK](check.md). Alasannya sama: mematikan makro bawaan GW-BASIC agar tidak
menumpahkan `LIST` ke dalam `INKEY$`.

Lima program, satu kebiasaan rumah, nol komentar di kelimanya — dan di sini ia
diketik ulang **sepuluh kali dalam satu produk**, karena tidak ada cara lain.

---

## 4 · Salah ketik yang ikut tergambar

Bagan alur langkah I memuat kotak berlabel `TRANSCATION`. Seharusnya
*TRANSACTION*.

Yang membuatnya menarik: label itu bukan teks biasa — ia bagian dari
**gambar**, diketik pas selebar kotaknya. Memperbaikinya berarti mengubah
panjang teks di dalam kotak yang lebarnya sudah tetap.

Kebetulan *TRANSCATION* dan *TRANSACTION* sama-sama sebelas aksara — jadi
sebenarnya bisa diperbaiki tanpa menyentuh apa pun yang lain. Tidak ada yang
melakukannya, dan salah ketik itu terpampang di layar pertama tutorial
akuntansi selama empat puluh tahun.

---

## 5 · Dua belas langkah, satu contoh

| Langkah | Berkas |
|---|---|
| I. Flow of accounting cycle | `BUSONE` |
| II. Set up chart of accounts | `BUSTWO` |
| III. Transactions occur | `BUSTHREE` |
| IV. Posting to journal | `BUSTHREE` |
| V. Posting to ledgers | `BUSTHREE` |
| VI. Trial balance | `BUSFOUR` |
| VII. Worksheet prepared | `BUSFIVE` |
| VIII. Financial statements | `BUSSIX` |
| IX. Adjusting entries | `BUSSEVEN` |
| X. Closing entries | `BUSEIGHT` |
| XI. Post-closing trial balance | `BUSNINE` |
| XII. Simulation recap | `BUSTEN` |

Perhatikan pembagiannya tidak rapi: `BUSTHREE` memuat tiga langkah, sementara
`BUSNINE` dan `BUSTEN` masing-masing satu. Pemisahannya mengikuti **ukuran
bita**, bukan struktur pelajarannya — persis yang diharapkan kalau batas
mesin yang memilih.

Seluruh tutorial memakai satu perusahaan contoh: **ABC Hardware**, bulan buku
**Juni 1982**. Angka yang sama — penjualan $12.045,00, laba bersih $2.500,00 —
muncul di beberapa berkas, dan tiap berkas mengetiknya ulang.

Kalau angka itu perlu diubah, ia harus dicari di sepuluh berkas. Tidak ada
satu tempat pun yang bisa disebut "sumber kebenaran", karena tidak ada yang
bertahan melewati `RUN`.

---

## 6 · Penafsir yang lebih lengkap daripada milik HISTORY

Layar-layar ini **dijalankan**, bukan disalin — alasan yang sama dengan
[HISTORY](history.md) §2, dan di sini lebih kuat lagi karena sembilan layar
hanya berupa selisih (§2).

Tapi penafsirnya harus lebih lengkap: layar BUS dibangun lewat `GOSUB` ke
subrutin penggambar kotak, jadi alur kendalinya harus diikuti sungguhan.

| HISTORY | BUS |
|---|---|
| baris berurutan | `GOTO`, `GOSUB`, `RETURN` dengan tumpukan |
| `FOR…NEXT` satu tingkat | `FOR…NEXT` **bersarang** |
| — | `IF … THEN <baris>` |
| — | `PRINT TAB(n)` |
| — | `DEFSTR` — huruf biasa memegang string |

Dua jebakan yang memakan waktu:

**`FOR` bersarang.** Kesepuluh berkas memakai
`FOR I=1 TO 3 STEP 2:FOR J=20 TO 62:LOCATE I,J:PRINT"─":NEXT:NEXT` untuk
menggambar bingkainya. Penangan yang rata melewati `FOR J` bagian dalam, lalu
gagal di `LOCATE I,J` karena `J` tidak pernah diisi.

**`DEFSTR A-E,J,L`.** Di `BUSFIVE` dan `BUSSEVEN`, huruf biasa memegang
potongan aksara gambar-garis. Menyisipkannya ke ekspresi numerik menghasilkan
`╔+═+═`, yang bukan ekspresi apa pun. Penafsirnya harus tahu mana variabel
angka dan mana string — sesuatu yang di BASIC ditentukan oleh **deklarasi di
baris 20**, bukan oleh nilainya.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Sepuluh program | `RUN` berantai (§1) | 50 KB tidak muat di 64 KB | **Satu aplikasi, 41 layar.** Batas aslinya dihitung dan ditampilkan, bukan ditiru |
| Bagan tumbuh | tanpa `CLS` (§2) | menggambar mahal di 4,77 MHz | **Dipertahankan** — programnya dijalankan, jadi hasilnya sama persis |
| Navigasi | maju saja, dalam satu berkas | tidak ada mesin halaman | Maju/mundur + rel lompat — **tambahan**, konsisten dengan sesi 15 |
| Batas berkas | tak terlihat di layar | — | **Ditampilkan**: warna pasak + batas kiri tebal di layar pertama tiap berkas |
| Label langkah | tergambar di layar | — | Diekstrak dari layarnya, bukan didaftar tangan — kalau layarnya berubah, labelnya ikut |
| 6 baris bersama | diketik ulang 10× (§3) | tidak ada modul | **Tidak diport**; dijelaskan sebagai temuan |
| `TRANSCATION` | salah ketik (§4) | — | **Dipertahankan** |
| Angka ABC Hardware | diketik ulang tiap berkas | `RUN` membuang variabel | Dipertahankan apa adanya di tiap layar |

---

## 8 · Latihan

1. **Hitung ulang batasnya.** Kalau PC-nya 128 KB, berapa berkas yang
   dibutuhkan? Dan berapa banyak dari enam baris bersama itu yang bisa
   dihapus?

2. **Cari yang tumbuh.** Dari sembilan layar yang menambah tanpa menghapus,
   berapa aksara yang ditambahkan masing-masing? Adakah pola dalam urutannya?

3. **Perbaiki `TRANSCATION`.** Tunjukkan bahwa perbaikannya tidak mengubah
   lebar apa pun. Kenapa itu tetap tidak dilakukan?

4. **Uji pemisahannya.** Kalau berkasnya dipecah menurut **langkah** dan bukan
   menurut bita, berapa berkas yang dibutuhkan dan berapa yang terlalu besar?

---

Berkas terkait: [pakai](../games/busone/index.html) ·
[HISTORY — layar yang dijalankan, bukan disalin](history.md) ·
[HEAREYE](heareye.md) · [BIO](bio.md) · [CHECK](check.md) — idiom `ON KEY`
kosong yang sama
