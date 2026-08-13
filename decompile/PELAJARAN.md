# Pelajaran dari dekompilasi — bekal untuk agen berikutnya

> Baca ini **sebelum** menyentuh berkas lain di folder ini. Isinya bukan
> temuan teknis — itu ada di [`README.md`](README.md), [`RUNNABLE.md`](RUNNABLE.md),
> dan [`VERIFICATION.md`](VERIFICATION.md). Isinya **cara bekerjanya**: apa yang
> ternyata benar, apa yang ternyata membuang waktu, dan kesalahan mana yang
> paling mahal.
>
> Bahannya diambil dari tiga belas hasil negatif yang tercatat di
> [`NEGATIVE-RESULTS.md`](NEGATIVE-RESULTS.md) — dokumen yang, kalau Anda hanya
> punya waktu membaca satu berkas di folder ini, sebaiknya itu yang dibaca.

---

## 1 · Catat yang gagal, bukan hanya yang berhasil

`NEGATIVE-RESULTS.md` panjangnya 42 KB dan berisi **tiga belas hipotesis yang
diuji lalu runtuh**. Itu bukan arsip kegagalan; itu perkakas yang paling banyak
menghemat waktu di seluruh pekerjaan ini.

Alasannya sederhana: dekompilasi berjalan dengan menebak, dan tebakan yang sama
akan muncul lagi. Tanpa catatan, agen berikutnya — atau Anda sendiri tiga hari
kemudian — akan menguji ulang "deskriptor string pasti tabel statis di DGROUP"
dan membuang setengah hari yang sama untuk kedua kalinya.

**Aturannya: begitu sebuah hipotesis runtuh, tulis di tempat yang sama, dengan
nomor iterasinya, sebelum melanjutkan.** Bukan nanti.

---

## 2 · Empat dari tiga belas kegagalan itu adalah cacat alat, bukan cacat program

Ini pola terpenting yang muncul, dan ia baru kelihatan setelah dijejer:

| § | yang dikira | yang sebenarnya |
|---|---|---|
| 5 | "penelusuran dinamis tidak bisa diotomatiskan" | **salah** — bisa, dan sudah |
| 7 | langit-langit cakupan mentok di 56/46/53 % | **bug di alat ukur saya sendiri** |
| 8 | "HOPPER tidak punya tabel stub" | **salah** — punya |
| 11 | `STRCMP` diturunkan tanpa alasan sah | koreksi atas koreksi |

Dan satu lagi yang sudah merembes sampai ke dokumen terbit:
`SCREEN()` di BASCOM dikira menjawab dari salinan bayangan, padahal **alat
ukurnya yang tidak menangani `int 10h ah=08h`**, dan kait pengukurnya menulis
`AX` sebelum pencatat sempat membaca nomor fungsinya. Klaim itu sempat masuk ke
`web/docs/serpent.md` dan harus ditarik di sana.

**Pelajarannya: ketika sebuah pengukuran memberi angka yang mengejutkan —
terutama nol, atau langit-langit yang rapi — curigai alatnya lebih dulu,
sebelum menyimpulkan sesuatu tentang programnya.** Angka nol nyaris tidak
pernah berarti "tidak terjadi apa-apa"; ia hampir selalu berarti "saya tidak
mengukur tempat yang benar".

Uji murahnya: **jalankan alat ukur itu pada kasus yang jawabannya sudah Anda
ketahui.** Kalau ia tidak bisa mendeteksi hal yang jelas ada, ia juga tidak bisa
dipercaya waktu mengatakan sesuatu tidak ada.

---

## 3 · Kecocokan tanda tangan antar-biner bukan bukti kedua

Hasil negatif §9 layak disebut terpisah karena kesalahannya halus dan sangat
meyakinkan: rutin yang sama ditemukan di dua biner berbeda, lalu kecocokan itu
dianggap **saling menguatkan**.

Padahal keduanya dikompilasi oleh **kompiler yang sama**. Menemukan potongan
identik di keduanya tidak menambah bukti apa pun tentang *apa fungsinya* — ia
hanya membuktikan keduanya keluar dari pabrik yang sama. Itu penalaran melingkar
yang menyamar sebagai konfirmasi.

**Bukti kedua harus datang dari sumbu yang berbeda**: dari menjalankan program,
dari data di sebelahnya, dari perilaku yang terlihat di layar — bukan dari
biner ketiga yang lahir dari kompiler yang sama.

---

## 4 · Dua sumbu kemajuan, dan jangan pernah melaporkannya bersebelahan

Ada dua ukuran yang sama sekali berbeda, dan menaruhnya di satu baris laporan
akan menyesatkan siapa pun yang membacanya:

- **Cakupan penamaan** — berapa persen rutin yang sudah punya nama dan
  keterangan.
- **Bisa dijalankan** — apakah hasilnya benar-benar berjalan.

Program bisa 100 % dinamai dan tetap tidak bisa jalan; bisa 40 % dinamai dan
sudah jalan penuh. Keduanya kemajuan, tapi kemajuan yang berbeda jenis, dan
menjumlahkannya menghasilkan angka yang tidak berarti apa-apa.

Laporkan terpisah, selalu.

---

## 5 · Empat fakta yang membuat EXE ter-compile bisa dipulihkan

Ini inti teknis yang paling menghemat waktu, dan alasan tiga dari empat program
akhirnya bisa dikembalikan menjadi `.bas` yang benar-benar `RUN`. Rinciannya di
[`RUNNABLE.md`](RUNNABLE.md), tapi bentuk umumnya:

Program BASCOM ter-compile **bukan kode mesin yang ditulis tangan**. Ia rangkaian
panggilan ke runtime BASCOM, dan runtime itu punya pola yang tetap. Begitu peta
entry point runtime-nya terbaca (lihat [`RUNTIME-MAP.md`](RUNTIME-MAP.md)),
sebagian besar biner berubah dari "kode mesin" menjadi "daftar pernyataan
BASIC yang ditulis dengan cara lain".

Konsekuensi praktisnya: **jangan mulai dari membaca instruksi.** Mulai dari
mengenali runtime-nya. Yang tersisa sesudah itu jauh lebih kecil daripada yang
terlihat di awal.

`SPACEWAR` adalah pengecualiannya — satu segmen, ditulis tangan, tidak ada
runtime yang bisa dikenali, dan karena itu tidak punya titik berangkat sama
sekali. Kalau sebuah biner tidak menunjukkan pola runtime, **kenali itu lebih
awal** dan sesuaikan targetnya; jangan habiskan iterasi mencari sesuatu yang
memang tidak ada di sana.

---

## 6 · Sepakati kriteria pengiriman sebelum mulai, dan berani menyatakan kalau
hasilnya tidak persis salah satunya

Sebelum porting keempat EXE dimulai, disepakati tabel tiga baris: keadaan apa
menghasilkan kiriman apa. Tabel itu berguna — sampai `SPACEWAR` menghasilkan
sesuatu yang **tidak persis cocok dengan baris mana pun**, karena asumsi yang
mendasarinya ternyata salah (dikira satu-satunya jalan ke port yang bisa
dimainkan adalah memanen piksel kapalnya; ternyata ada jalan kedua).

Yang benar dilakukan waktu itu, dan yang harus dilakukan lagi: **katakan
terus terang bahwa hasilnya di luar tabel, lalu jelaskan kenapa.** Memaksakan
hasil ke dalam kategori yang paling mendekati akan menyembunyikan justru bagian
yang paling perlu diketahui.

Tabelnya sendiri masih tercatat di [`../web/docs/spacewar.md`](../web/docs/spacewar.md).

---

## 7 · Yang mahal dan tidak membuahkan apa-apa

Hasil negatif §6 mencatat tiga hal yang dicoba bersamaan dan **ketiganya
nihil**: menaikkan budget, memperpanjang umpan tombol, dan mengirim timer.

Polanya khas: ketika penelusuran mentok, godaannya adalah "beri lebih banyak" —
lebih banyak waktu, lebih banyak masukan, lebih banyak putaran. Itu hampir tidak
pernah berhasil, karena mentoknya biasanya bukan soal kuantitas melainkan soal
**tempat yang salah** (lihat §2).

Sebelum menaikkan angka apa pun, tanyakan: apakah saya sudah membuktikan alat
ini bisa melihat hal yang saya cari?

---

## 8 · Ringkas untuk agen yang baru masuk

1. Baca [`NEGATIVE-RESULTS.md`](NEGATIVE-RESULTS.md) lebih dulu. Tiga belas jalan
   buntu sudah dipetakan; jangan menempuhnya lagi.
2. Baca [`README.md`](README.md) untuk status akhir dan angka.
3. Kalau target Anda program BASCOM ter-compile, mulai dari
   [`RUNTIME-MAP.md`](RUNTIME-MAP.md), bukan dari disassembly.
4. Setiap kali sebuah pengukuran mengejutkan, uji alatnya pada kasus yang sudah
   Anda ketahui jawabannya.
5. Catat kegagalan segera, dengan nomor iterasi.
6. Laporkan cakupan penamaan dan keterbacaan-jalan sebagai dua angka terpisah.
7. Bukti kedua harus dari sumbu berbeda. Biner ketiga dari kompiler yang sama
   bukan bukti.

---

*Folder ini juga memuat perkakasnya di [`tools/`](tools/), keluaran penelusuran
di `trace/`, dan berkas verifikasi di `verify/`. Keempat program hasilnya sudah
diport dan didokumentasikan di `web/docs/`: [spacewar](../web/docs/spacewar.md),
[3dttt](../web/docs/3dttt.md), [pacgal](../web/docs/pacgal.md),
[hopper](../web/docs/hopper.md).*
