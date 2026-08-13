# 3DTTT — dari EXE 1984 ke web

| | |
|---|---|
| Sumber | `run/3DTTT.EXE` |
| Basis port | `decompile/3DTTT/3dttt-run.bas` — 1.150 baris, 0 panggilan runtime tak tertangani |
| Ukuran asli | 1.205 pernyataan · papan 4×4×4 = 64 sel · 76 garis kemenangan |
| Judul | "LU's 3D Game" — terbaca dari layarnya sendiri |
| Hasil port | [`../games/3dttt/`](../games/3dttt/index.html) |
| Analisis dekompilasi | [`../../decompile/3DTTT/ARCHITECTURE.md`](../../decompile/3DTTT/ARCHITECTURE.md) |

Tic-tac-toe di dalam kubus: empat sebaris menang, termasuk yang menembus keempat
lapis secara diagonal. Terbesar dari empat `.EXE` yang dibongkar, dan satu-satunya
yang punya lawan komputer.

---

## 1 · Separuh programnya aritmetika — dan itu yang membuka isinya

Cacah operasi dari pembongkaran:

| Kelompok | Porsi |
|---|---|
| Aritmetika *single-precision* (`LET!` 426, `LOAD!` 297, `ARITH!` 233, …) | **50%** |
| Tampilan (`PRINT` 198, `LOCATE` 154, `COLOR` 115, …) | 27% |
| Subrutin (`GOSUB` 96 panggilan → 31 target) | 5% |

Untuk permainan yang papannya 4×4×4 dan bidaknya cuma `X`/`O`, lima puluh persen
aritmetika pecahan **tidak wajar**. Menaruh bidak tidak butuh pecahan; menghitung
*seberapa bagus* sebuah posisi butuh.

Bentuk percabangannya menegaskan: **679 cabang `IF` melawan 10 gelung.** Ini bukan
program yang mengulang, melainkan program yang memutuskan — dan itu bentuk khas
penilai posisi: periksa garis, periksa garis, periksa garis.

> **Pelajaran.** Sebaran jenis instruksi bisa mengungkap *apa yang program lakukan*
> sebelum satu baris pun dibaca. Rasio yang tidak wajar untuk tugas yang tampak —
> aritmetika pecahan di permainan bidak, atau perbandingan string di program grafis —
> hampir selalu menunjuk ke pekerjaan kedua yang belum terlihat.

---

## 2 · Papannya larik 5×5×5, bukan 4×4×4

Indeksnya terbaca utuh di banyak tempat:

```basic
G3!( CINT(F11!) + (CINT(F6!) * 5 + CINT(F12!)) * 5 )
```

Itu `x + (z·5 + y)·5` — langkahnya **5**, bukan 4. Papan 4×4×4 disimpan di larik
5×5×5, dan indeks 0 dibiarkan kosong supaya koordinat 1–4 bisa dipakai apa adanya.

Ongkosnya: **61 sel terbuang dari 125**, hampir separuh. Yang dibeli: satu
pengurangan hilang dari ratusan tempat pemakaian.

Di BASIC yang ditafsirkan, itu pertukaran yang masuk akal. Setiap `- 1` adalah token
yang harus diurai, dievaluasi, dan dibuang, setiap kali baris itu dijalankan.

> **Pelajaran.** "Buang memori untuk menghemat waktu" adalah pertukaran yang usianya
> setua komputasi, dan arah yang menguntungkan berubah bersama perangkat kerasnya.
> Pada 1984, 61 sel `single-precision` (244 bita) untuk menghapus satu operasi di
> gelung dalam adalah tawaran bagus. Hari ini kompilator akan menghapus pengurangan
> itu tanpa diminta, dan lariknya cuma jadi membingungkan.

---

## 3 · 76 garis — dihitung dua cara, bukan dikutip

Halaman ini tidak mempercayai angka 76 dari mana pun. Ia menghitungnya saat dimuat,
lalu mencocokkannya dengan rumus tertutup:

| Cara | Hasil |
|---|---|
| Pencacahan langsung (semua arah × semua titik awal, dedup) | **76** |
| Rumus `((n+2)³ − n³) / 2` untuk n = 4 | **76** |

Rinciannya, juga dihitung:

| Jenis | Sumbu yang bergerak | Jumlah |
|---|---|---|
| Lurus | 1 | 48 |
| Diagonal bidang | 2 | 24 |
| **Diagonal ruang** | 3 | **4** |

48 + 24 + 4 = 76.

Rumus keduanya punya alasan yang rapi: bungkus kubus dengan satu lapis selubung,
lalu setiap garis lurus menembus **tepat dua** sel selubung — jadi cacah selubung
dibagi dua.

Yang paling sering terlewat pemain adalah empat diagonal ruang itu. Mereka cuma
5,3% dari seluruh garis, tapi mereka satu-satunya yang tidak bisa dilihat dengan
memandang satu lapis saja.

> **Pelajaran.** Dua cara menghitung yang tidak saling meminjam lebih kuat daripada
> satu cara yang diulang. Kesalahan pada pencacahan (lupa dedup, salah batas) tidak
> akan menghasilkan angka yang sama dengan rumus kombinatorik — jadi kalau keduanya
> setuju, keduanya hampir pasti benar.

---

## 4 · Lawan komputernya rekonstruksi — dan karena itu diukur

Ini yang membedakan halaman ini dari port lain di koleksi.

`ARCHITECTURE.md` §2 menyatakan pemetaan 31 target `GOSUB` ke fungsi permainan
**belum dikerjakan**. Jadi algoritma penilai aslinya belum terbaca, dan penilai di
port ini **milik saya** — sekeluarga (ia memeriksa ke-76 garis) tapi bukan yang sama.

Klaim "AI-nya bagus" karena itu tidak boleh ditulis. Yang boleh cuma angka.

**200 permainan penuh, benih tetap 20260809, giliran pertama bergantian** supaya
keunggulan langkah pertama tidak terhitung sebagai kekuatan:

| Lawan | Menang | Seri | Kalah | Ancaman langsung diblok |
|---|--:|--:|--:|---|
| Acak | 200 | 0 | 0 | **3 / 3** |
| Rakus (menang → halangi → acak) | 179 | 20 | 1 | **67 / 67** |

**Angka pertama tidak mengukur apa pun, dan itu sengaja ditampilkan.** Versi pertama
pengukuran ini cuma memakai lawan acak; hasilnya 200 dari 200, dan saya hampir
menuliskannya sebagai bukti. Ia bukan bukti: lawan acak nyaris tak pernah menyusun
tiga sebaris, jadi cabang "halangi" di penilai hanya diuji **tiga kali dalam 200
permainan**. Sebuah pengujian yang tidak bisa gagal tidak memberi informasi.

Lawan rakus menaikkan angka itu dari 3 jadi **67** — dan semuanya diblok.

**Satu kekalahan itu justru temuan yang paling berguna.** Kalau setiap ancaman
tunggal diblok (67 dari 67), satu-satunya cara kalah adalah lawan menyusun **dua
ancaman sekaligus**: dua sel berbeda yang masing-masing menyelesaikan garis. Memblok
salah satunya tetap kalah oleh yang lain. Penilai ini tidak melihat ke depan, jadi
ia tidak bisa mencegah garpu terbentuk — dan sekali dalam 200 permainan, lawan rakus
membuatnya tanpa sengaja.

> **Pelajaran.** Sebuah tolok ukur yang selalu lulus bukan tolok ukur, melainkan
> hiasan. Tanda bahayanya spesifik dan bisa dilihat: kalau cabang yang paling ingin
> Anda uji hanya terpicu segelintir kali dalam ratusan percobaan, lawannya yang
> salah — bukan kodenya yang bagus.

---

## 4b · Kontras yang hilang di tema terang

Versi pertama kubus 3D memakai pelat biru tembus pandang di atas `--bg-sunken` —
token latar layar. Di tema gelap token itu `#0a0d12` dan pelatnya terbaca jelas;
di tema **terang** ia `#e7ecf2`, dan pelat yang sama jadi nyaris hilang. Sel kosong
tidak bisa dibedakan dari latarnya, dan menaruh bidak jadi menebak.

Ini lolos seluruh pemeriksaan saya karena saya hanya pernah melihatnya di satu tema.

Perbaikannya: **panggung kubus diberi latar gelap sendiri**, tidak mewarisi tema,
lalu nilai selnya dinaikkan. Diukur sesudahnya, terhadap latar panggung:

| | Sebelum | Sesudah |
|---|--:|--:|
| Rangka sel kosong | 3,78 : 1 | **8,29 : 1** |
| Titik tengah sel | — (tidak ada) | **13,04 : 1** |
| Bidak `X` | — | **13,79 : 1** |
| Bidak `O` | — | **11,44 : 1** |

Ambang WCAG untuk elemen non-teks 3 : 1; angka lama sudah lolos ambang itu dan
tetap **tidak cukup dipakai**. Yang kurang bukan kepatuhan, melainkan bahwa sel
kosong harus terbaca sebagai *sasaran yang bisa diklik*, bukan sekadar terlihat ada.

> **Pelajaran.** Token tema yang membalik nilai antara terang dan gelap tidak aman
> dipakai sebagai landasan warna semi-transparan: yang Anda uji cuma satu dari dua
> hasil. Kalau sebuah komponen menuntut latar dengan sifat tertentu, komponen itu
> yang harus membawa latarnya sendiri — bukan berharap temanya kebetulan cocok.

---

## 5 · Tiga tingkat kepastian

| Tingkat | Bagian | Dasar |
|---|---|---|
| **Pasti** | tata letak empat lapis, judul, baris `LAST MOVE`/`MADE BY`, larik 5×5×5, porsi aritmetika 50%, 679 : 10 | terbaca dari EXE atau terukur dari layarnya |
| **Pasti (matematika)** | 76 garis, rincian 48/24/4 | dihitung, bukan dibaca — tidak bergantung pada EXE sama sekali |
| **Turunan** | bahwa programnya penilai posisi | disimpulkan dari sebaran instruksi dan bentuk percabangan |
| **Rekonstruksi** | algoritma penilainya, bobot, laju, rupa | **saya yang mengisi** |

Nama variabel asli, nomor baris asli, dan seluruh komentar hilang permanen.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan | larik `single-precision` 5×5×5, indeks 0 terbuang | menghemat satu pengurangan di ratusan tempat, di BASIC yang ditafsirkan | Larik rapat 64 sel. Pemborosannya **didokumentasikan sebagai panel**, tidak ditiru — ia menjawab kendala yang sudah tidak ada |
| Tata letak | empat papan 4×4 bersebelahan di layar teks | layar 80×25 aksara tidak bisa menggambar ruang | **Kubus 3D yang bisa diputar bebas.** Ini penyimpangan terbesar di halaman ini, dan alasannya bukan gaya: empat diagonal ruang menembus keempat lapis sekaligus, dan di tampilan datar tidak ada satu pun cara MELIHATnya — pemain harus membayangkannya. Susunan 1984-nya tetap tersedia sebagai saklar, karena untuk membaca satu lapis dengan cepat ia memang lebih jelas, dan karena di sana setiap sel selalu bisa diklik tanpa terhalang |
| Masukan | ketik tiga angka, ada kursor panah (F-key) | tidak ada tetikus | Klik langsung. Kursor panahnya **tidak** ditiru — ia ada karena tetikus belum umum, dan kendala itu hilang |
| Penilai posisi | ~50% program, algoritma belum terbaca | 64 KB, tanpa pustaka | **Rekonstruksi**, dan dinyatakan begitu di halamannya. Kekuatannya diukur, bukan diklaim |
| Bidak | `X` dan `O` aksara | mode teks | Tetap `X` dan `O`. Menggantinya dengan SVG tidak menambah apa pun — bentuknya memang sudah huruf, bukan gambar yang terpaksa jadi huruf |
| Umpan balik | baris `LAST MOVE:` / `MADE BY:` | satu baris status | Dipertahankan sebagai dua `.stat`, plus **penanda sel terakhir** di papan — di 64 sel, tanpa penanda jejaknya mudah hilang |
| "Please Wait" | dicetak sebelum giliran komputer | penilaian butuh detik di 4,77 MHz | Jeda 220 ms **buatan**, dan itu **selera**: penilai ini selesai dalam milidetik. Jedanya ada supaya jawabannya terbaca sebagai jawaban, bukan sebagai bagian dari klik |
| Simpan / muat (F2/F3) | ke disket | — | **Tidak diport.** Catatan menang/seri/kalah disimpan `localStorage`; menyimpan posisi di tengah permainan tidak menjawab kebutuhan apa pun di peramban |

---

## 7 · Latihan

1. **Buktikan hipotesis garpu.** Ubah lawan rakus supaya mencatat posisi saat ia
   menang. Pada permainan yang kalah itu, berapa sel kosong yang masing-masing
   menyelesaikan garis untuk lawan pada langkah terakhir? Kalau jawabannya ≥ 2,
   hipotesis "ancaman ganda" di §4 terbukti; kalau 1, ada cacat lain di penilai.
2. **Cari harga penglihatan satu langkah.** Tambahkan pencarian kedalaman 2
   (setelah langkah saya, apakah lawan punya dua ancaman?). Berapa kekalahan yang
   hilang dari 200 permainan, dan berapa kali lipat waktunya bertambah?
3. **Ukur nilai diagonal ruang.** Jalankan pengukuran dengan keempat diagonal ruang
   dibuang dari daftar garis. Berapa hasilnya berubah? Angka itu mengukur seberapa
   besar sumbangan 5,3% garis yang paling sering terlewat manusia.
4. **Uji bobotnya.** Ganti `BOBOT = [0, 1, 12, 200]` jadi linear `[0, 1, 2, 3]`.
   Berapa kekalahan lawan rakus sekarang? Selisihnya mengukur klaim di komentar
   kode bahwa bobot linear menukar satu ancaman nyata dengan dua potensi.
5. **Hitung ongkos larik 5×5×5.** Berapa bita yang dihamburkan (61 sel
   *single-precision*), dan berapa persen itu dari ruang kerja BASIC 64 KB? Lalu
   perkirakan berapa kali pengurangan `- 1` akan dijalankan dalam satu permainan
   penuh, dan putuskan apakah pertukarannya sepadan.

---
Berkas terkait: [pakai](../games/3dttt/index.html) ·
[fondasi](_fondasi.md) ·
[PAC-GAL — port pertama dari EXE](pacgal.md) ·
[analisis dekompilasi](../../decompile/3DTTT/ARCHITECTURE.md) ·
[basis port](../../decompile/3DTTT/3dttt-run.bas) ·
[EXE aslinya](../../run/3DTTT.EXE)
