# HISTORY — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/HISTORY.BAS` — isi menu *"1 Information"* di `INTRO.BAS` |
| Penerbit | Friendlyware PC Introductory Set, 1982 |
| Ukuran asli | 351 baris, **16 layar** |
| Hasil port | [`../games/history/`](../games/history/index.html) |
| Analisis BASIC | [`../../reviews/HISTORY.md`](../../reviews/HISTORY.md) |

---

## 0 · Judul katalog salah, untuk kedua kalinya berturut-turut

Katalog menyebutnya *"Evolusi Ukuran Komputer"*, diambil dari baris 80 yang
memang mencetak `THE EVOLUTION OF COMPUTER SIZE`. Itu **judul halaman
pertama**.

| Bab | Halaman |
|---|--:|
| Sejarah & ukuran ← yang dijadikan judul | 3 |
| CPU | 4 |
| Memori & data | 3 |
| DOS, bahasa, disket | 6 |

Tiga dari enam belas. Tiga belas sisanya CPU, unit kendali, ALU, bus I/O,
memori, file/record/field, DOS, bahasa mesin, assembly, BASIC, FORTRAN, COBOL,
dan lima belas perintah perawatan disket.

Sesudah [ANATOMY](anatomy.md) di sesi 14 — yang dikira pelajaran anatomi tubuh
— ini **kali kedua berturut-turut**. Keduanya ketahuan dengan cara yang sama:
membuka programnya.

> **Pelajaran.** Dua kali berturut-turut bukan kebetulan; itu **cacat
> proses**. Judul di katalog kita berasal dari berkas tinjauan yang dihasilkan
> otomatis, dan penghasilnya menebak dari nama berkas ketika programnya tidak
> menyebut namanya sendiri di tempat yang mudah dicari. Yang perlu diubah
> bukan dua entri itu, melainkan **derajat kepercayaan pada seluruh kolom
> judul** sampai tiap program dibuka.

---

## 1 · Tiga halaman yang menimpa halaman sebelumnya

Halaman **2, 3, dan 10** tidak memanggil `CLS`. Mereka menulis di atas layar
halaman sebelumnya, dan isinya cuma **selisih**.

Bukti paling rapinya di halaman 10:

```basic
1850 …PRINT "THERE ARE THREE TYPES OF COMPUTER MEMORY"   ← 40 aksara
2050 …PRINT "      FILES, RECORDS, AND FIELDS        "   ← 40 aksara
```

Bantalan spasinya — enam di depan, delapan di belakang — dihitung **persis**
supaya judul baru menutupi judul lama sampai aksara terakhir. Seseorang
menghitungnya, lalu tidak menuliskan alasannya di mana pun.

Untung besarnya: bingkai kotak 80×20 yang digambar halaman 9 (baris 1820–1840,
sebuah `FOR` sepanjang 19 putaran) **tidak perlu digambar ulang**. Pada
4,77 MHz, menggambar bingkai itu terlihat — ia menyapu dari atas ke bawah.

Hal yang sama berlaku di halaman 2 dan 3, yang menulis di dalam bingkai ENIAC
milik halaman 1.

> **Pelajaran.** Menggambar ulang seluruh layar adalah kemewahan yang baru
> muncul belakangan. Ketika menggambar mahal, **selisih** adalah satuan yang
> alami — dan harganya adalah halaman yang tidak bisa berdiri sendiri.

---

## 2 · Karena itu, port ini menjalankan programnya

`pages.js` dihasilkan dengan **menjalankan** `HISTORY.BAS` lewat penafsir kecil
yang mengenal lima perintah:

| | |
|---|---|
| `CLS` | kosongkan bufer |
| `COLOR f,b` | warna berlaku |
| `LOCATE r,c` | pindahkan kursor |
| `PRINT` | tulis literal, `STRING$()`, `SPC()`, `CHR$()` |
| `FOR…NEXT` | satu baris |

Itu **seluruh** perbendaharaan yang dipakai program ini untuk menggambar.
Hasilnya bufer 25×80 berisi aksara *dan* warna per sel, dipotret tiap kali
program berhenti di `GOSUB 3380`.

| | |
|---|--:|
| Baris BASIC | 351 |
| Halaman terpotret | 16 |
| Halaman tanpa `CLS` | 3 |
| Lebar tiap baris hasil, diperiksa di peramban | tepat 80 |

Menyalin enam belas layar dengan tangan akan lebih cepat, dan akan **salah**:
sebuah halaman yang isinya cuma selisih tidak bisa disalin sendirian.

> **Pelajaran.** Kalau bentuk aslinya adalah *proses*, tirulah prosesnya, bukan
> hasilnya. Menyalin hasil membuang justru sifat yang membuat aslinya menarik.

---

## 3 · Mundur bukan selalu satu halaman

Enam belas `IF BACKFLAG THEN <baris>`, dan targetnya tidak seragam:

| Target mundur | Jumlah |
|---|--:|
| ke halaman sebelumnya | 10 |
| melompat — **terpaksa** | 2 |
| ke awal bab | 2 |
| **tanpa penjelasan** | 1 |
| keluar program | 1 |

### 3a · Dua yang terpaksa

Halaman 4 mundur ke halaman 1; halaman 11 mundur ke halaman 9. Keduanya
melompati **halaman-timpa** (§1), yang tidak bisa digambar sendirian. Mundur ke
sana akan menghasilkan layar rusak — judul dan teks tanpa bingkai.

Jadi lompatannya **bukan pilihan**: halaman utuh terakhir adalah satu-satunya
target yang sah. Bentuk gambar menentukan bentuk navigasi.

### 3b · Dua yang ke awal bab

Halaman 6 dan 7 (ALU, bus I/O) mundur ke halaman 4 — pembuka bab CPU. Itu
keputusan desain: subtopik mengembalikan pembaca ke pembuka babnya, bukan ke
subtopik sebelahnya.

Strukturnya nyata dan hanya ada sebagai komentar yang tidak pernah sampai ke
layar:

```basic
570  '****** CPU ******
1560 '****** memory ******
2210 '***** OPERATING SYSYEMS ******
```

(Salah ketik `SYSYEMS` itu ada di aslinya, dan dipertahankan di port.)

### 3c · Satu yang tidak punya penjelasan

```basic
1810 IF BACKFLAG THEN 840    ← halaman 8 mundur ke halaman 5
```

Halaman 8 membuka bab *memory*. Halaman 5 ada di bab *CPU*, dan bukan pembuka
bab itu (yang di baris 580). Bukan halaman sebelumnya, bukan awal bab mana
pun. **Satu-satunya target yang tidak cocok pola apa pun di seluruh program.**

> **Pelajaran.** Menyebut empat lompatan "tidak konsisten" adalah kesimpulan
> yang malas. Setelah diperiksa satu per satu, dua di antaranya **terpaksa**,
> dua **punya pola**, dan hanya satu yang benar-benar ganjil — dan yang ganjil
> itu justru bukan yang paling mencurigakan waktu pertama dilihat. Menghitung
> mengalahkan menaksir.

---

## 4 · Bingkainya *adalah* ENIAC

Halaman 1 menulis: *"The border that surrounds this text represents ENIAC"*.

Kotak tebal `CHR$(219)` yang mengelilingi layar bukan hiasan — ia **gambar**,
dan seluruh isi halaman berdiri di dalamnya sebagai perbandingan ukuran. Di
dalamnya huruf `E N I A C` dieja menurun di kolom 6 (baris 290–330), dengan
panah `<---` di atas dan di bawah sebagai tanda ukur. IBM 360 dan IBM PC
digambar sebagai dua kotak kecil di dalam kotak besar yang sama.

Tiga skala pada satu layar 80×25, dan **nol** perintah grafis: seluruh program
ini `SCREEN 0`, tanpa satu `LINE`, `CIRCLE`, `DRAW`, atau `PSET`.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Enam belas layar | `LOCATE`+`PRINT` langsung ke memori layar | CGA teks 80×25 | Kisi 80×25 dengan warna **per sel**, palet CGA apa adanya |
| Halaman-timpa | 3 halaman tanpa `CLS` (§1) | Menggambar bingkai mahal di 4,77 MHz | **Dipertahankan** — programnya dijalankan, jadi hasilnya sama persis |
| Mundur | 5 dari 16 tidak ke halaman sebelumnya (§3) | Bentuk gambar + keputusan bab | **Linear**, satu halaman. Perilaku aslinya ditampilkan sebagai tabel, tidak ditiru — keputusan pemakai koleksi ini, sesi 15 |
| Lompat ke halaman mana pun | mustahil | `GOSUB` tidak menerima variabel | **Ditambahkan** (rel angka), akibat langsung dari halaman jadi data — sama seperti [ANATOMY §4](anatomy.md) |
| Struktur bab | komentar `'****** CPU ******` | tidak pernah sampai ke layar | **Ditampilkan**: warna pasak rel + label di kepala halaman |
| <kbd>F1</kbd> mundur | `ON KEY(1)` + `BACKFLAG` + `RETURN 3500` | penangan tidak bisa mengembalikan nilai | Tombol yang **sama**, satu penangan `keydown` |
| <kbd>F10</kbd> keluar | konfirmasi Y/N lalu `RUN "INTRO"` | tiap program berkas terpisah | <kbd>Esc</kbd> + tautan kembali di bilah atas |
| Baris 24 & 25 | selalu baris bantuan | disiplin rumah Friendlyware | **Dipertahankan di dalam layar**, bukan dipindah ke antarmuka |
| Salah ketik `SYSYEMS` | baris 2210 | — | Dipertahankan, dan dikutip |

---

## 6 · Latihan

1. **Uji bantalannya.** Ubah judul halaman 10 jadi lebih pendek satu aksara di
   kepala Anda. Apa yang muncul di layar, dan di kolom berapa?

2. **Cari halaman-timpa lain.** Selain 2, 3, dan 10, adakah halaman yang
   *hampir* bisa jadi halaman-timpa — yang bingkainya sama dengan halaman
   sebelumnya tapi tetap memanggil `CLS`? Berapa banyak yang terbuang?

3. **Perbaiki baris 1810.** Kalau `840` memang salah ketik, nilai apa yang
   paling masuk akal, dan pola mana yang Anda pakai untuk memilihnya?

4. **Hitung ongkos bingkai.** Bingkai halaman 9 adalah `FOR A=4 TO 22` dengan
   dua `LOCATE`+`PRINT` tiap putaran. Berapa panggilan layar seluruhnya, dan
   kenapa itu terlihat di 4,77 MHz tapi tidak di mesin sekarang?

---

Berkas terkait: [pakai](../games/history/index.html) ·
[ANATOMY — tetangganya di menu yang sama](anatomy.md)
