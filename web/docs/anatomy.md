# ANATOMY — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/ANATOMY.BAS` — **"Anatomy of a Program"** |
| Penerbit | Friendlyware PC Introductory Set, 1982 |
| Ukuran asli | 159 baris, **115 di antaranya `PRINT`** |
| Peran | **pilot kelompok edukasi** — menetapkan `_shared/reader.js` + `reader.css` untuk tujuh program berikutnya |
| Hasil port | [`../games/anatomy/`](../games/anatomy/index.html) |
| Analisis BASIC | [`../../reviews/ANATOMY.md`](../../reviews/ANATOMY.md) |

Sebuah **program yang isinya program lain**: sembilan layar yang mencetak
listing [MASTER MIND](master.md) potong demi potong, dirujuk ke halaman 11–15
sebuah manual cetak.

---

## 0 · Judulnya sendiri salah selama tiga belas sesi

Katalog koleksi ini menyebutnya *"Tutorial anatomi tubuh"* sejak sesi 1.
Judul sebenarnya dicetak di bilah atas tiap layarnya:

```basic
1540 LOCATE 1,28:COLOR 0,7:PRINT " Anatomy of a Program "
```

Tebakan dari nama berkas, tidak pernah diperiksa, dan bertahan tiga belas sesi
karena tidak ada yang membuka programnya. Sudah diperbaiki di `catalog.js`,
`run/ANATOMY.bat`, dan berkas tinjauannya.

> **Pelajaran.** Metadata yang ditebak terlihat persis sama dengan metadata
> yang diperiksa. Satu-satunya bedanya adalah apakah seseorang pernah
> membukanya — dan itu tidak tercatat di mana pun.

---

## 1 · Datanya adalah kode, dan itu menipu penganalisisnya

115 dari 159 barisnya berbentuk `PRINT` berisi baris BASIC milik program lain.
Pencari kata kunci tidak bisa membedakan `RANDOMIZE` yang **dijalankan** dari
`RANDOMIZE` yang **dicetak** — dan analisis otomatis di `reviews/ANATOMY.md`
tertipu di enam tempat sekaligus:

| Klaim penganalisis | Kenyataan |
|---|---|
| memakai `PLAY` | kata Inggris di *"DO YOU WISH TO PLAY AGAIN?"* — bukan kode sama sekali |
| memakai `RANDOMIZE` | baris 670, di dalam string |
| `DIM GUESS(6)` dst. | di dalam string; ANATOMY **tidak punya satu larik pun** |
| `ON x GOTO` / `ON x GOSUB` berindeks | tidak ada; yang ada `ON KEY` dan `ON ERROR` |
| memuat program bernama `CHR$(34)` | dari `RUN"CHR$(34)"MENU` di dalam string |
| subrutin 1280 = "efek suara", 600 = "hitung acak" | keduanya ditebak dari isi string; kesembilan blok mengerjakan hal yang sama — mencetak sepotong listing |

Yang **tetap benar** di berkas itu: peta arsitektur, tabel subrutin, hitungan
percabangan. Semuanya diturunkan dari struktur `GOSUB`/`GOTO` yang nyata.

> **Pelajaran.** Analisis statis yang membaca *token* tanpa tahu *konteks*
> punya satu titik buta yang tajam: program yang memperlakukan kode sebagai
> data. Kepercayaan pada perkakas semacam ini harus dinyatakan per-jenis-klaim
> — "struktur: bisa dipercaya, isi: tidak" — bukan sebagai satu angka
> kepercayaan untuk seluruh laporan.

---

## 2 · Manual mendokumentasikan versi yang sudah tidak ada

Koleksi ini kebetulan memuat **keduanya**: tutorialnya, dan `MASTER.BAS` yang
dikirim bersamanya. Jadi keduanya bisa dibandingkan baris demi baris.

| Nasib 115 baris tercetak | | |
|---|--:|--:|
| Masih persis sama | 72 | 63% |
| Beda **hanya** target lompatannya (penomoran ulang) | 21 | 18% |
| **Benar-benar ditulis ulang** | 22 | 19% |

Sebelas dari 22 penulisan ulang ada di **halaman 1** saja — seluruh layar
petunjuknya disusun ulang, dipindah tiga baris ke bawah, dan ditambahi contoh
`` `3 3 9' `` yang tidak ada di manual.

Yang paling telak ada di halaman 9:

| | |
|---|---|
| Manual mencetak | `C O N G R A G U L A T I O N S` |
| Program yang dikirim | `C O N G R A T U L A T I O N S` |

Salah ketiknya **sudah diperbaiki di kodenya** dan **dibekukan selamanya di
dokumentasinya**.

Bukan kelalaian satu orang: dokumentasi dan kode disimpan di dua tempat
berbeda, dikerjakan pada waktu berbeda, dan tidak ada apa pun yang memaksa
keduanya tetap sejalan. Empat puluh tahun kemudian satu-satunya cara
mengetahuinya adalah **menjalankan perbandingannya** — yang dilakukan port ini
dan hasilnya ditampilkan hidup di halamannya.

> **Pelajaran.** Dokumentasi yang menyalin kode selalu kalah balapan dengan
> kodenya. Yang bertahan adalah dokumentasi yang menjelaskan **kenapa**, karena
> alasan berubah jauh lebih lambat daripada baris.

---

## 3 · 132 tanda kutip untuk satu karakter

```basic
180 PRINT"170 LOCATE 5,20,0:PRINT"CHR$(34)"Welcome to Master Mind…"CHR$(34)"
```

BASIC tidak punya karakter pelarian. Untuk mencetak **satu tanda kutip**,
string harus ditutup, `CHR$(34)` disambung, lalu string dibuka lagi.

Akibatnya bisa dihitung: **132 kemunculan `CHR$(34)` dalam 159 baris** — hampir
satu per baris. Baris 1120 panjangnya **250 kolom** untuk mencetak satu baris
BASIC sepanjang 185 kolom; selisih 65 kolom itu seluruhnya ongkos pelarian.

Itulah kenapa program ini nyaris tidak bisa dibaca di sumbernya, padahal yang
dicetaknya rapi.

---

## 4 · Tabel halaman yang tidak bisa ditulis sebagai tabel

```basic
50 CLS:GOSUB 1540:GOSUB  180:GOSUB 150:IF BACKFLAG THEN  40
60 CLS:GOSUB 1540:GOSUB  340:GOSUB 150:IF BACKFLAG THEN  50
70 CLS:GOSUB 1540:GOSUB  430:GOSUB 150:IF BACKFLAG THEN  60
…
```

Sembilan baris yang hampir identik. Itu **sebuah tabel** — `[180, 340, 430, …]`
— yang tidak bisa ditulis sebagai tabel, karena `GOSUB` tidak menerima nomor
baris dari variabel. Tidak ada `GOSUB halaman(i)` di BASIC.

Tiga subrutin yang masing-masing dipanggil sembilan kali membuat pemisahan
kerangka/isi-nya sebenarnya **rapi**:

| Baris | Peran | Padanan sekarang |
|---|---|---|
| 1540–1560 | bilah judul | komponen bingkai |
| 1510–1530 | nomor halaman | komponen kaki |
| 150–170 | tunggu tombol + tangani F1 | penangan navigasi |

Yang hilang cuma satu: **daftarnya**.

### Apa yang berubah begitu tabelnya jadi data

Port ini menyimpan kesembilan halaman sebagai larik, dan tiga hal langsung
mungkin yang aslinya **mustahil**, bukan sekadar tidak dibuat:

- lompat ke halaman mana pun (rel angka di atas layar)
- tahu ada berapa halaman seluruhnya (`3 / 9`)
- mengingat halaman terakhir yang dibaca

Ketiganya bukan selera; ketiganya akibat langsung dari perubahan bentuknya.
Itulah yang membuat `_shared/reader.js` lahir di sini, dan batasnya ditarik
sekarang: **modul itu tidak pernah tahu isi halaman apa pun.** Kalau ia mulai
tahu isi, tujuh program edukasi berikutnya masing-masing akan menambah satu
cabang ke dalamnya.

---

## 5 · Tiga hal yang benar karena kebetulan

Koleksi ini punya tema berulang — "benar karena kebetulan" lawan "benar karena
dijaga". ANATOMY menyumbang tiga sekaligus dalam 159 baris.

### 5a · `PAGE` tanpa dolar

```basic
1150 PAGE=15:GOSUB 1510        ← halaman 7
1260 PAGE=15:GOSUB 1510        ← halaman 8
1490 PAGE$=" 15 ":GOSUB 1510   ← halaman 9, benar
1510 LOCATE 23,17:PRINT "Screen corresponds to page"PAGE$"in your manual"
```

Dua kali `$` tertinggal. Baris 1510 mencetak `PAGE$`, jadi halaman 7 dan 8
menampilkan **nilai halaman sebelumnya**; `PAGE` yang angka diisi lalu tidak
pernah dibaca siapa pun.

Salah ketiknya tidak pernah terlihat karena halaman 6 sudah menyetel
`PAGE$=" 15 "`, dan halaman 7 dan 8 **memang seharusnya** menampilkan 15.

Dan ia juga tidak bisa terlihat lewat jalan lain: alurnya lurus 50→130, jadi
halaman 6 *selalu* berjalan tepat sebelum halaman 7. Tidak ada urutan
penelusuran yang membongkarnya.

### 5b · Halaman 9 muat tanpa sisa satu baris pun

Diukur, bukan ditaksir — dan diukur ulang oleh port di peramban:

| Halaman | Baris layar | Listing berakhir di |
|--:|--:|--:|
| 1 | 14 | baris 16 |
| 4 | 14 | baris 16 |
| 7 | 18 | baris 20 |
| **9** | **21** | **baris 23** |

Baris 23 adalah tempat pesan nomor halaman ditulis (`LOCATE 23,17`). Di halaman
9 baris terakhir listingnya mendarat di baris yang **sama** — dan tidak
bertabrakan hanya karena baris itu kebetulan berbunyi `1260 END`: delapan
kolom, berhenti sembilan kolom sebelum pesannya mulai.

Satu baris listing lagi, dan seluruh layar tergulir — membawa bilah judulnya
ikut hilang. **Nol baris sisa, sembilan kolom sisa**, dan tidak ada satu pun
komentar yang menyebutnya.

Itu sebabnya port ini menggambar layarnya sebagai kisi 80×25 sungguhan dengan
kaki yang dipasang mutlak di baris 23/24/25, bukan sebagai teks yang mengalir
bebas: **kalau tata letaknya mengalir, kebetulan itu tidak lagi bisa dilihat.**

### 5c · Huruf O sebagai angka nol

```basic
1330 …LOCATE 23,25,O:PRINT"DO YOU WISH TO PLAY AGAIN?  <Y/N>"
```

Itu **huruf O**, bukan angka nol. Variabel yang belum diisi bernilai 0 di
BASIC, dan 0 memang arti yang dimaksud (kursor disembunyikan).

Dan ia ikut terkirim: `MASTER.BAS` baris 1260 menulis `LOCATE 23,24,O` juga.
Salah ketik yang menghasilkan jawaban benar, disalin utuh ke versi berikutnya.

---

## 6 · `RETURN 1580` — kembali ke tempat lain

```basic
1570 KEY(1) OFF:BACKFLAG=1:RETURN 1580
```

`RETURN` biasa kembali ke pemanggil. `RETURN <nomor>` **membuang alamat
kembalinya** dan melompat ke baris yang disebut.

Itu satu-satunya jalan keluar: F1 menyela di tengah perulangan tunggu-tombol
baris 170. `RETURN` biasa akan kembali ke perulangan itu dan menunggu lagi —
padahal pemakainya sudah menyatakan ingin mundur.

Berpasangan dengan `BACKFLAG`, satu-satunya kanal dari penjebak tombol ke alur
utama, karena penjebak tidak bisa mengembalikan nilai.

Di port keduanya lenyap: sebuah penangan `keydown` memanggil `go(i - 1)`
langsung. Yang dulu butuh bendera global plus `RETURN` tidak lokal sekarang
adalah satu pemanggilan fungsi — dan itu bukan kecanggihan, melainkan akibat
punya **fungsi yang menerima argumen**.

---

## 7 · Dua sisipan yang tertinggal jejaknya

```basic
379 LOCATE  6,17:PRINT CHR$(201)   ╔
431 LOCATE 16,67:PRINT CHR$(188)   ╝
461 LOCATE 16,17:PRINT CHR$(200)   ╚
```

Nomor baris BASIC dinaikkan sepuluh-sepuluh justru supaya ada ruang
menyisipkan. Tiga nomor **ganjil** di tengah kelipatan sepuluh berarti:
seseorang menggambar kotaknya dengan empat perulangan, lupa pojoknya, lalu
menambalnya belakangan.

Pojok kanan-atas tidak pernah ditambahkan sama sekali.

> **Pelajaran.** Riwayat suntingan yang bertahan empat puluh tahun karena nomor
> barisnya tidak pernah dirapikan — jenis jejak yang di berkas modern hanya ada
> di dalam git, dan hilang begitu berkasnya disalin keluar dari repositori.

---

## 8 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Sembilan halaman | 9 baris `GOSUB` yang hampir identik (§4) | `GOSUB` tidak menerima variabel | Larik data; `_shared/reader.js` yang membalikkannya |
| Maju/mundur | maju 1, mundur 1, itu saja | tidak ada daftar halaman | **Ditambah** lompat langsung, `Home`/`End`, dan ingatan halaman terakhir — akibat §4, dinyatakan sebagai tambahan |
| <kbd>F1</kbd> mundur | `ON KEY(1)` + `BACKFLAG` + `RETURN 1580` (§6) | penangan tidak bisa mengembalikan nilai | Tombol yang **sama**, lewat satu penangan `keydown` |
| <kbd>F10</kbd> keluar | `RUN "intro"` | tiap program berkas terpisah | <kbd>Esc</kbd> — F10 milik menu jendela di peramban; dinyatakan di halamannya |
| Layar 80×25 | `LOCATE` mutlak | perangkat keras CGA | Kisi 80×25 sungguhan, kaki di baris 23/24/25 secara mutlak — supaya §5b tetap terukur |
| Warna | `COLOR 3` cyan, `COLOR 0,7` terbalik | 16 warna CGA | Dipertahankan; layarnya sengaja tetap hitam di tema terang |
| Nomor halaman | `PAGE$`, dengan dua salah ketik (§5a) | — | **Dipertahankan apa adanya**, termasuk cara nilai basinya bertahan. Yang ditambahkan cuma tabel yang memperlihatkannya |
| Pewarnaan sintaksis | tidak ada | layar teks satu warna | **Ditambahkan** — selera, dan dinyatakan begitu |
| Perbandingan dengan `MASTER.BAS` | mustahil | dua berkas, tidak ada perkakas | **Ditambahkan** (mode Banding, §2); ini bukan yang dilihat pembaca 1982 |
| Manual cetak | halaman 11–15, **hilang** | — | Ditulis ulang sekarang, ditandai *"ditulis 2026, bukan 1982"* di kepala panelnya |

Dua baris terakhir adalah penyimpangan terbesar di seluruh koleksi ini sejauh
ini, dan keduanya sengaja ditandai di layar. Menyamarkannya akan membuat
halaman ini ikut jadi sumber palsu bagi siapa pun yang membacanya empat puluh
tahun lagi — persis kesalahan yang dibahas §2.

---

## 9 · Cacat yang ditemukan saat membangun port ini

Dicatat karena keduanya jenis yang berulang, bukan karena besar.

**Nama kelas yang bertabrakan.** `.a-list` dipakai untuk dua hal: blok listing
di dalam layar, dan daftar berbutir di panel kanan. Yang kedua menyetel
`display:grid; gap: 4px`, jadi tiap baris listing mendapat jarak 4px yang tidak
diminta — dan halaman 9 yang seharusnya berakhir di baris 23 terukur berakhir
di baris 31. Cacatnya **tidak terlihat**; ia hanya terukur. Nama yang kedua
diganti jadi `.a-poin`.

**Pemisah baris yang jadi baris.** Versi pertama menyambung baris listing
dengan `"\n"`. Karena layarnya `white-space: pre-wrap`, tiap pemisah itu
menjadi satu baris kosong tambahan. `.a-ln` sudah `display:block`;
pemisahnya tidak pernah dibutuhkan.

**Penanda tempat yang tabrakan dengan datanya.** Penyorot sintaksis menyimpan
string sementara sebagai ` <angka> `. `FOR C=66 TO 18 STEP -1` mengandung
` 18 `, jadi angka yang sah di kode BASIC terbaca sebagai nomor potongan dan
diganti dengan `undefined`. Penandanya diganti dengan `NUL`, aksara yang
mustahil ada di datanya.

> **Pelajaran ketiganya sama.** Cacat tata letak yang tidak mengubah apa pun
> yang terlihat hanya bisa ditemukan dengan **mengukur**, bukan dengan
> melihat. Ketiganya ketahuan karena port ini memeriksa "baris terakhir
> listing mendarat di baris berapa?" — pertanyaan yang lahir dari §5b, bukan
> dari daftar periksa.

---

## 10 · Latihan

1. **Hitung ongkos pelariannya.** Ambil satu baris `PRINT` di
   `run/ANATOMY.BAS`, hitung panjangnya, lalu hitung panjang baris yang
   dicetaknya. Berapa persen sumbernya yang bukan isi?

2. **Cari yang ke-23.** Selain halaman 9, halaman mana yang paling dekat dengan
   batas 22 baris? Berapa baris listing lagi yang bisa ditambahkan sebelum
   layarnya tergulir?

3. **Bongkar `PAGE`.** Susun urutan penelusuran yang membuat salah ketik §5a
   terlihat. Bisakah? Kalau tidak, apa yang harus diubah di alurnya supaya
   bisa?

4. **Balik arah pertanyaannya.** `reviews/ANATOMY.md` menyebut 14 subrutin dan
   20 panah antar-subrutin. Berapa dari 14 itu yang benar-benar mengerjakan hal
   berbeda? Apa artinya angka "14" kalau sembilan di antaranya kembar?

5. **Tulis manual halaman 11.** Bandingkan dengan panel *Catatan halaman* di
   port. Apa yang Anda jelaskan yang tidak dijelaskan di sana, dan sebaliknya?

---

Berkas terkait: [pakai](../games/anatomy/index.html) ·
[MASTER MIND — program yang dibedah](master.md) ·
[koreksi analisis otomatis](../../reviews/ANATOMY.md)
