# MUSIC — dari BASIC 1981–82 ke web

| | |
|---|---|
| Sumber | `run/MUSIC.BAS` — "The IBM Personal Computer Music, Version 1.10" |
| Penerbit | IBM Corp, 1981–82 — "Licensed Material" |
| Hasil port | [`../games/music/`](../games/music/index.html) |
| Analisis BASIC | [`../../reviews/MUSIC.md`](../../reviews/MUSIC.md) |

Bukan permainan: sebuah **alat penyusun lagu**, tuts demi tuts, dengan sebelas
lagu contoh tersimpan di `DATA`-nya.

---

## 1 · Seluruh tangga nada Barat, dalam satu baris

```basic
1360 DIM M(88),O(70)
1370 FOR I=7 TO 88:M(I) = 36.8*(2^(1/12))^(I-6):NEXT
1380 FOR I=0 TO 6:M(I) = 32767:NEXT
```

Baris 1370 adalah sistem penalaan Barat sejak abad ke-18. **Akar kedua belas
dari dua** — satu semiton — dipangkatkan sebanyak jarak tuts dari acuan.

Tidak ada tabel frekuensi. Tidak ada `DATA` berisi 88 angka. Satu rumus, dan
seluruh piano lahir darinya.

| Tuts | Frekuensi | |
|--:|--:|---|
| 7 | 38,99 Hz | acuan +1 |
| 19 | 77,98 Hz | **tepat 2,000000×** |

Bukan kebetulan — itu definisinya: naik dua belas tuts berarti mengalikan
dengan (2<sup>1/12</sup>)<sup>12</sup> = 2. Satu oktaf adalah penggandaan
frekuensi, dan tangga nada sama rata membagi penggandaan itu jadi dua belas
langkah yang persis sama besar.

> **Pelajaran.** Rumus mengalahkan tabel ketika domainnya punya struktur.
> Tabel 88 angka bisa salah ketik di satu barisnya dan tidak ada yang tahu;
> rumus satu baris tidak punya tempat untuk salah ketik yang diam-diam.

---

## 2 · Acuannya bukan A440 — dan tidak ada yang pernah tahu

Rumusnya benar. Yang meleset adalah **titik acuannya**.

Tuts 49 seharusnya A4 = 440 Hz. Hitung baris 1370 untuk I = 49:

```
36.8 × 2^(43/12) = 441,10 Hz
```

**+4 sen** di atas tala standar dunia. Untuk tepat 440, acuannya harus
**36,708**, bukan 36,8.

Dan seluruh piano ikut bergeser — karena semua nada diturunkan dari acuan yang
sama, penyimpangannya seragam. Itu sebabnya tidak terdengar: **jarak
antarnadanya tetap tepat**, hanya seluruhnya digeser bersama-sama.

Empat sen tidak terdengar sendirian, dan program ini tidak pernah dimainkan
bersama alat musik lain. Jadi tidak ada yang pernah mengeluh, dan tidak ada
yang pernah tahu — sampai sekarang.

**Dipertahankan apa adanya di port.** Menalanya ke 440 akan membuat lagunya
terdengar "benar" dan datanya jadi bukan data 1982 lagi. Yang ditambahkan cuma
angkanya, dihitung hidup di halaman, supaya bisa diperiksa.

> **Pelajaran.** Galat yang seragam tidak terdeteksi oleh pemakainya. Sistem
> yang tidak pernah dibandingkan dengan sistem lain bisa salah selama empat
> puluh tahun tanpa satu keluhan pun. **Verifikasi butuh acuan luar** — kalau
> semua yang Anda bandingkan berasal dari sumber yang sama, semuanya akan
> setuju, termasuk saat semuanya salah.

---

## 3 · `DIM M(88)` — ukuran larik sebagai dokumentasi

`88` bukan angka bulat sembarangan: itu **jumlah tuts piano**. Siapa pun yang
melihat 88 di program musik langsung tahu apa yang dimodelkan, tanpa satu
komentar pun.

| Program | Larik | Kenapa angka itu |
|---|---|---|
| **MUSIC** | `M(88)` | tuts piano |
| [DOMINOES](dominoes.md) | `PLD$(28)` | batu ganda-enam |
| [YAHTZEE](yahtzee.md) | `M(13)` | kotak kartu skor |
| [BACKGAM](backgam.md) | `A(25)` | 24 titik + 2 bar |

Lawannya: larik yang dibulatkan ke angka bundar. `DIM X(100)` tidak memberi
tahu apa pun selain "cukup besar, mudah-mudahan".

> **Pelajaran.** Nama tipe dan ukuran adalah tempat dokumentasi termurah yang
> ada — ia tidak bisa basi terpisah dari kodenya, karena ia *adalah* kodenya.

---

## 4 · Tuts 0–6 adalah diam

```basic
1380 FOR I=0 TO 6:M(I) = 32767:NEXT
1590 SOUND M(J),K
```

Di GW-BASIC, `SOUND 32767, durasi` adalah cara **resmi** menghasilkan diam —
bukan bunyi yang terlalu tinggi untuk didengar, melainkan istirahat yang
didokumentasikan.

Jadi tujuh tuts terbawah dipakai ulang sebagai istirahat, dan lagunya
menuliskan istirahat sebagai **tuts 0**. Lihat data *La Cucaracha*:

```
42,1, 0,1, 42,1, 0,1
```

nada, diam, nada, diam.

Penghematannya rapi: **tidak butuh penanda khusus** di data lagu, tidak butuh
cabang di perulangan pemutar. Sebuah istirahat adalah nada, hanya saja nada
yang tidak terdengar.

Di port, tuts 0–6 jadi jeda sungguhan — Web Audio tidak punya frekuensi yang
kebetulan berarti diam.

| | |
|---|---|
| Yang hilang | kebetulan indahnya |
| Yang didapat | pembaca berikutnya tidak perlu tahu bahwa 32767 istimewa |

> **Pelajaran.** Menyatukan dua konsep di satu tipe (nada & istirahat) menghapus
> satu cabang dari setiap tempat yang menyentuhnya. Harganya: satu nilai ajaib
> yang harus diketahui. Kedua sisinya nyata; yang ketiga — mendokumentasikannya
> — tidak dilakukan siapa pun di sini.

---

## 5 · `ON ERROR` untuk masukan pemakai

```basic
1141 ON ERROR GOTO 1148
1142 PLAY "mf"
1149 ON ERROR GOTO 0
```

`PLAY` melempar galat kalau diberi makro yang tidak sah — dan makro itu
**diketik pemakai**. Menangkapnya dan meminta mengetik ulang jauh lebih baik
daripada membiarkan program mati di tengah lagu.

Keputusan yang sama dengan [PIECHART](piechart.md) baris 1292, di program yang
sama-sama IBM. Menangani galat yang **bisa diperkirakan** adalah kebiasaan
rumah, bukan kebetulan satu penulis.

Perhatikan juga `ON ERROR GOTO 0` di baris 1149: penjagaan itu **dimatikan
lagi** begitu daerah berbahayanya lewat. Galat di luar situ tetap harus
berisik.

> **Pelajaran.** Cakupan penangkap galat sesempit mungkin. `ON ERROR` yang
> dibiarkan menyala sepanjang program menelan galat yang seharusnya
> menghentikannya.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Frekuensi | rumus baris 1370 (§1) | — | **Dipertahankan persis**, termasuk acuan 36,8 |
| Acuan A440 | meleset +4 sen (§2) | — | **Tidak dikoreksi**; ditampilkan sebagai angka yang dihitung hidup |
| Diam | `SOUND 32767` (§4) | GW-BASIC | Jeda sungguhan; tuts 0–6 mengembalikan `null` |
| Durasi | cacah tik pencacah PC | 18,2 Hz | `TIK = 1/18.2` — data 1982 jadi detik sungguhan |
| Sebelas lagu | `DATA` di badan program | Tidak ada berkas terpisah | Diekstrak **apa adanya**, termasuk salah ketik judulnya |
| Penyusun lagu | ketik tuts satu per satu | Alat aslinya | **Tidak diport** — pemutarnya yang dipertahankan; penyusunnya butuh papan ketik 1982 |
| Tempo | tetap, tertulis di `DATA` | — | **Ditambahkan** sebagai penggeser; dinyatakan sebagai tambahan |
| Instrumen | satu pengeras suara, satu gelombang | Perangkat keras PC | **Ditambahkan** dari `_shared/audio.js` (sesi 4) lewat `ui.instrumentBar()`; tambahan, bukan koreksi |
| Rentang papan tuts | 88 tuts penuh | — | Dihitung dari tuts terendah/tertinggi yang **benar-benar dipakai** kesebelas lagu |
| Not balok | tidak ada | Layar teks 80×25 | **Ditambahkan** — `_shared/staff.js`, pengaturan sama dengan DREAM (§7) |
| Pemilih lagu | ketik nomor lagu | Tidak ada penunjuk | Rol bergaya jukebox: satu pilihan di tengah, tetangganya mengintip (§7) |

Baris tempo, instrumen, dan rol lagu adalah **selera**, dan dinyatakan begitu:
ketiganya tidak ada di aslinya, dan tidak ada kendala 1982 yang menghalangi
tempo maupun instrumen — IBM hanya tidak membuatnya.

---

## 7 · Tiga cacat yang ditemukan sesudah tinjauan (sesi 14b)

Halaman ini dibangun di sesi 13 bersama [MORTGAGE](mortgage.md) dan
[SPACE](space.md) — tiga program IBM — **dan itulah kesalahannya**. Ia
diperlakukan sebagai "program IBM ketiga", padahal tempatnya di **kelompok
musik**, yang bentuknya sudah ditetapkan sesi 4 oleh GERMFOLK, OCTAVE, DREAM
dan NOTETABL. Akibatnya tiga hal.

### 7a · Tidak ada not balok

Kelima halaman musik lain memakai `_shared/staff.js`; halaman ini cuma punya
papan tuts. Bukan kendala teknis — datanya (nomor tuts + durasi) justru bentuk
**paling mudah** untuk digambar sebagai not, jauh lebih mudah daripada makro
`PLAY` yang harus ditafsirkan dulu di DREAM.

Sekarang dipakai, dengan pengaturan yang sama: `pps: 90, playheadAt: 0.28` —
penanda di 28% dari kiri, sehingga 72% layar dipakai untuk not yang **akan**
datang. Untuk lagu yang sudah ada, yang ingin dilihat pembaca adalah apa yang
menyusul, bukan riwayatnya.

### 7b · Pemilih instrumen tidak berfungsi sama sekali

```js
audio.playNotes(nada, { instrument: $('ins').value })   // versi lama
```

`audio.js` **tidak pernah membaca `opts.instrument`**. Instrumen adalah keadaan
modul, disetel lewat `audio.setInstrument()`. Jadi memilih "organ" tidak
mengubah apa pun — dan tidak ada yang memberi tahu, karena meneruskan kolom
yang tidak dikenal ke sebuah objek pilihan bukan galat.

Sekarang memakai `ui.instrumentBar()` yang memang untuk itu. Alasan kenapa
tombol mengalahkan `<select>` sudah ditulis di `ui.js` sejak sesi 4b — jarak
dan tempat — dan halaman ini melanggarnya tanpa menyadari.

Ikutannya: instrumen sekarang berlaku **seketika, di tengah lagu yang sedang
berjalan**, karena penjadwal beruntun membaca instrumen 120 ms sebelum tiap
nada berbunyi.

### 7c · Pewaktu terpisah untuk tampilan

Versi lama menjadwalkan penyalaan tuts dengan satu `setTimeout` per nada,
terpisah dari jadwal bunyinya. Dua jadwal untuk satu peristiwa akan pelan-pelan
bergeser, dan tidak ada yang bisa menyatakan mana yang benar.

Sekarang bunyi dan gambar lahir dari sumber yang sama: `onNote` menyalakan
papan tuts, dan satu jam `RETRO.clock` menggulung not baloknya.

> **Pelajaran.** Yang menarik bukan ketiga cacatnya, melainkan **sebab yang
> sama**: sebuah halaman dikelompokkan menurut **asal** programnya (IBM) dan
> bukan menurut **bentuknya** (musik), lalu mewarisi kebiasaan kelompok yang
> salah. Pengelompokan yang dipilih untuk kemudahan penjadwalan diam-diam jadi
> pengelompokan yang menentukan standar mutu.

### 7d · Satu cacat lagi, dari rol barunya

Rol lagu dipusatkan lewat `requestAnimationFrame(geser)` supaya `clientWidth`
sudah terisi. Itu jalan **di tab yang terlihat**. Di tab latar belakang
peramban tidak menjalankan rAF sama sekali, jadi rolnya tidak pernah
dipusatkan dan menempel di kiri sampai jendelanya diubah ukurannya.

Penundaannya juga tidak dibutuhkan: kartunya berlebar tetap, dan membaca
`clientWidth` langsung justru memaksa tata letak dihitung. Diganti jadi
pemanggilan langsung.

> **Pelajaran.** Menunda sesuatu "supaya aman" berarti menggantungkannya pada
> penjadwal yang belum tentu jalan. rAF adalah janji untuk **menggambar**,
> bukan janji untuk **berjalan**.

---

## 7 · Latihan

1. **Hitung acuannya sendiri.** Dari syarat "tuts 49 = 440 Hz", turunkan acuan
   yang benar. Berapa selisihnya dari 36,8, dan berapa sen artinya?

2. **Cari batas telinga.** Pada penyimpangan berapa sen dua nada mulai
   terdengar berbeda saat dibunyikan berurutan? Dan saat dibunyikan
   bersamaan? Kenapa jawabannya sangat berbeda?

3. **Balik penghematannya.** Kalau istirahat ditulis sebagai penanda khusus
   (misalnya tuts −1), baris mana saja di program aslinya yang harus berubah?

4. **Periksa salah ketik judulnya.** Bandingkan `songs.js` dengan `DATA` di
   `run/MUSIC.BAS`. Judul mana yang salah eja, dan kenapa itu dipertahankan?

---

Berkas terkait: [pakai](../games/music/index.html) ·
[PIECHART](piechart.md) — `ON ERROR` yang sama ·
[SPACE](space.md) · [MORTGAGE](mortgage.md) — program IBM lain
