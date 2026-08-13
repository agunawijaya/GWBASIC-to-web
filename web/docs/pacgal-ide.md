# PAC-GAL — ide pengembangan selanjutnya

Dokumen ini bukan janji dan bukan rencana kerja. Isinya usulan berikut alasannya
dan cara menilainya.

> **Dokumen ini condong ke sisi bahan aslinya** — dekompilasi, pemulihan,
> dan aturan main. Ide yang murni tentang **port webnya sebagai perangkat
> lunak** (sentuh, papan ketik, tata letak layar kecil, aksesibilitas, uji)
> ada di [`pacgal-ide-port.md`](pacgal-ide-port.md).

PAC-GAL adalah port yang paling banyak diperbaiki di koleksi ini, dan hampir semua
perbaikannya datang dari **dimainkan**, bukan dari dibaca. Karena itu daftar di
bawah dimulai dari yang sudah tercatat sebagai penyimpangan yang diketahui — bukan
dari gagasan baru.

Rujukan wajib sebelum menyentuh kodenya:
[`GEOMETRY.md`](../games/pacgal/GEOMETRY.md) ·
[`GHOSTS.md`](../games/pacgal/GHOSTS.md) · [dokumen port](pacgal.md)

Keduanya **dihasilkan** oleh `decompile/tools/gen-pacgal-ref.py`. Sesudah mengubah
tetapan apa pun, jalankan skrip itu lagi — kalau tidak, dokumennya berbohong.

---

## Keadaan sekarang

| | |
|---|---|
| Labirin | 24 × 40, 468 pelet, dipanen dari layar EXE, diverifikasi 24/24 baris |
| Dua mode hantu | konvensi Pac-Man 1980 (rekonstruksi) · asli PAC-GAL (pemulihan), lewat saklar |
| Keluar kandang | ambang pelet 0 / 5 / 14 / 28 |
| Navigasi terarah | peta jarak hasil banjir, untuk fase **keluar** dan **pulang** |
| Rentan | rumus asli baris 2880, sepertiga laju, ≈5,1 detik |
| Bonus hantu | 200 / 400 / 800 / 1600 + jeda 0,9 detik — rekonstruksi dari arcade |
| Sesudah 468 pelet | permainan **selesai** — tidak ada level 2 |

---

## Ide, diurutkan menurut nilainya

### 1. Mode "seandainya `I12%` menyala"

**Status: eksperimen atas temuan. Ini ide paling menarik di daftar, dan cuma bisa
dilakukan di port ini.**

Temuan intinya: di PAC-GAL, `I12%` adalah peluang mengejar, satu angka untuk
keempat hantu. Nilai awalnya **nol**, dan kedua operasi yang mengubahnya cuma
membagi dua dan mengalikan dua. Nol tetap nol. Jadi syarat pengejaran di baris 5210
**tidak pernah benar** — hantunya tidak pernah mengejar, seumur program.

Itu cocok dengan temuan terpisah di `ARCHITECTURE.md` §4b: ada blok AI pengejar di
binernya yang **tidak pernah bisa dicapai**. Dua hal mati yang saling cocok,
ditemukan lewat dua jalur.

Sekarang `I12_AWAL = 0` sudah jadi tetapan tersendiri, dan panel sudah menampilkan
nilainya. Yang belum ada: **penggeser** yang membiarkan pemain menaikkannya.

Nilainya bukan sebagai kesulitan tambahan, melainkan sebagai **jawaban atas
pertanyaan sejarah**: seperti apa PAC-GAL kalau saklar yang tidak pernah menyala itu
menyala? Dan lebih jauh — kedua aturan pengubahnya **menurunkan** keganasan saat
pemain mendekati menang dan **menaikkannya** saat pemain mati di awal, kebalikan
dari Cruise Elroy. Dengan `I12%` bukan nol, kurva terbalik itu akhirnya bisa
dirasakan, bukan cuma dibaca.

**Ukuran berhasil:** pada beberapa nilai `I12%`, laporkan berapa langkah rata-rata
hantu mendekat ke pemain dan berapa lama pemain bertahan. Kalau kurva terbaliknya
memang terasa, angkanya akan memperlihatkannya.

**Wajib:** tandai jelas di halaman bahwa ini **bukan** perilaku aslinya — aslinya
nol — dan perbarui `GHOSTS.md` lewat generatornya.

---

### 2. Tiga penyimpangan dari 1980 yang sudah tercatat

Ketiganya sudah ada di tabel penyimpangan `GHOSTS.md` §5. Memasangnya berarti
memindahkan baris dari "berbeda" ke "sama":

| Penyimpangan | Apa yang perlu dibuat | Ongkos |
|---|---|---|
| **Tidak ada pelepas-paksa berbasis waktu** | 1980 melepas hantu berikutnya kalau pemain lama tidak makan pelet (±4 detik). Ini juga **pengaman** untuk hantu keempat yang butuh 28 pelet | kecil |
| **Hantu tidak berbalik arah** saat sebar↔kejar berganti | 1980 memaksa berbalik; itu isyarat yang bisa dibaca pemain | kecil |
| **Tidak ada perlambatan di terowongan** | 1980 memperlambat hantu di terowongan, sehingga terowongan jadi tempat lolos | kecil |

Yang pertama paling berguna. Ia langsung menutup keadaan yang sudah terbukti bikin
bingung: pemain berhati-hati atau sering mati bisa bermain lama tanpa pernah
melihat hantu keempat keluar — dan itu **bukan** hantu macet, melainkan ambang yang
belum tercapai. Pengaman waktu menghapus kebingungannya sekaligus mendekatkan ke 1980.

---

### 3. Level 2 — dan pertanyaan yang menyertainya

**Status: rekonstruksi.**

Sekarang menghabiskan 468 pelet mengakhiri permainan. Itu antiklimaks, dan hampir
pasti bukan yang dilakukan aslinya — tapi **saya belum memeriksanya**, dan itu
harus dikerjakan lebih dulu: apa yang dilakukan `pac-gal-run.bas` saat pelet habis?
Jawabannya menentukan apakah level 2 itu pemulihan atau karangan.

Kalau ternyata karangan, kurva kesulitannya jangan diarang sendiri — pakai yang
sudah ada di binernya: `I12%` (ide 1) dan rumus rentan `(pelet/5 + 20) / nyawa²`
yang membuat permainan **makin mudah** saat nyawa tinggal sedikit. Itu kurva yang
tidak biasa, dan justru itu yang layak dipertahankan.

---

### 4. Selesaikan kenapa binernya keluar dini di bawah emulasi

**Status: pertanyaan dekompilasi yang masih terbuka.**

Akibatnya lebih kecil daripada yang diduga — labirinnya sempat tergambar penuh
sebelum program berhenti, dan sudah dipanen jadi data. Tapi selama ini terbuka,
setiap pertanyaan tentang apa yang terjadi **sesudah** permainan berjalan lama
(termasuk ide 3) hanya bisa dijawab dari kode, tidak dari menjalankannya.

Ini prasyarat diam-diam untuk beberapa ide lain, jadi nilainya lebih besar daripada
kelihatannya.

---

### 5. Buah bonus

**Status: rekonstruksi murni — dan harus ditandai keras.**

PAC-GAL **tidak punya skor sama sekali**; satu-satunya pencacah yang dicetaknya
adalah `dots`. Buah bonus adalah gagasan Pac-Man arcade, bukan gagasan permainan ini.

Kalau dipasang, perlakukan seperti skor hantu yang sudah ada: jelas-jelas ditandai
sebagai tambahan dari arcade, masuk tabel penyimpangan, dan disebut di halaman.
Jangan dipasang diam-diam supaya "terasa lebih lengkap".

---

### 6. Menikung (*cornering*)

**Status: rekonstruksi.** Di arcade, membelok tepat sebelum tikungan memotong sudut
dan menghemat beberapa piksel — itu keterampilan inti yang memisahkan pemain biasa
dari pemain mahir.

Port ini bergerak petak demi petak, jadi menikung berarti mengubah model geraknya,
bukan menambah satu aturan. Ongkosnya besar dan risikonya nyata: semua tetapan yang
sudah diukur — laju, ambang, jarak — dinyatakan dalam petak. Kerjakan paling akhir,
kalau memang mau.

---

### 7. Kotak uji yang tetap

**Status: alat ukur, dan berdasarkan pengalaman pahit.**

Sepanjang sesi perbaikan, harness uji gagal **empat kali dan semuanya diam-diam**:
kotak kandang diturunkan dari posisi start hantu; koordinat dibalik `x/8` padahal
gambarnya di `x = c·16 + 4`; pemain uji diam di dinding sehingga seluruh pengukuran
berjalan di atas permainan yang sudah usai; dan "mata kembali normal" terhitung
padahal sebabnya pemain mati.

Semua harness itu dihapus sesudah dipakai. Yang layak dibuat: satu harness
**permanen** dengan pemain uji pencari jalan, yang melaporkan nyawa, kematian,
pelet termakan, waktu di kandang, dan mata yang pulang — plus **kontrol negatif**,
karena uji yang lulus tidak membuktikan apa pun sampai terbukti ia bisa gagal.

`GHOSTS.md` §6 sudah memuat daftar cara gagalnya. Ubah daftar itu jadi kode.

---

## Yang sebaiknya TIDAK dikerjakan

- **Menyentuh rumus rentan `(pelet/5 + 20) / nyawa²`.** Ia asli, baris 2880. Kalau
  masa rentan terasa salah, ubah **berapa lama satu giliran di layar** — itu yang
  sudah dilakukan sekali, dan alasannya tercatat.
- **Menggali geometri dari kode lagi.** Ambil dari `GEOMETRY.md`. Gerbang kandang
  pernah dikira satu sel padahal dua, dan tiga gejala yang tampak tidak berhubungan
  lahir dari satu sel itu.
- **Membangun uji dari posisi start hantu.** Kotak dari empat sel start bukan kotak
  kandang. Uji yang memakainya lulus persis di saat permainannya rusak.
- **Menambah mekanisme terarah yang ketiga.** Keluar dan pulang sudah memakai satu
  peta jarak bersama. Dua mekanisme untuk satu tugas adalah persis cara dua bug
  kemarin lahir.
- **Mengubah tetapan tanpa menjalankan ulang generatornya.** Dokumen yang berbohong
  lebih berbahaya daripada dokumen yang tidak ada.


---

## Gudang ide — belum disaring

Bagian di atas diurutkan dan disaring. Bagian ini tidak. Sebagian pertanyaan di
bawah mungkin **tidak bisa dijawab** dengan bahan yang ada — itu bukan alasan
untuk tidak menuliskannya. Pertanyaan yang tercatat bisa dijawab orang lain, atau
oleh alat yang belum ada.

### Melanjutkan dekompilasi

- 88 panggilan (7%) belum bernama — porsi terkecil dari ketiganya.
- **Kenapa binernya keluar dini di bawah emulasi.** Masih terbuka, dan jadi
  prasyarat diam-diam untuk beberapa pertanyaan lain.
- Kenapa blok AI hantu di 10538–10623 tak terjangkau penelusuran.
- Apa yang dilakukan program saat pelet habis.
- **Pemicu energizer**: ujinya `IF SCREEN(...) > 7`, dan setiap ubin labirin
  bernilai lebih dari 7. Pembacaan itu belum menghasilkan penjelasan yang masuk
  akal, dan ini satu-satunya bagian besar yang masih rekonstruksi murni.
- Apakah ada skor sama sekali selain pencacah `dots`.
- Apakah ada level berikutnya.
- Rutin suara.
- Dua tabel per-hantu di `0x964` dan `0x994` yang diindeks `[0x9CE]` — isinya apa.

### Memeriksa yang sudah ada

- Panen labirin dari **emulator kedua**, sebagai sumber ketiga yang bebas.
- Uji apakah `I12%` benar-benar tidak pernah bukan-nol dengan menjalankan biner
  dan mengintip alamatnya, bukan hanya membaca `.bas`-nya.
- Jalankan biner cukup lama untuk melihat apakah hantunya benar-benar tidak pernah
  mengejar — pemulihan `.bas` mengatakan begitu, tapi itu belum pernah disaksikan.
- Bandingkan gerak hantu biner dengan mode "asli PAC-GAL" di port, langkah demi
  langkah.

### Yang lebih spekulatif

- Cari klon Pac-Man BASIC sezaman untuk melihat apakah pola "satu pengejar untuk
  semua hantu" itu umum, atau khas program ini.
- Lacak Al J. Jiménez — kredit ada di dalam EXE-nya sendiri, Mei 1982.
- Apakah ada versi lain PAC-GAL dengan nomor versi berbeda.
- Bandingkan labirinnya dengan labirin Pac-Man arcade: berapa banyak yang ditiru,
  berapa banyak yang dikarang.

---

Berkas terkait: [pakai](../games/pacgal/index.html) ·
[dokumen port](pacgal.md) ·
[geometri](../games/pacgal/GEOMETRY.md) · [perilaku hantu](../games/pacgal/GHOSTS.md) ·
[analisis dekompilasi](../../decompile/PAC-GAL/ARCHITECTURE.md) ·
[ide port lain](3dttt-ide.md) · [spacewar](spacewar-ide.md) · [hopper](hopper-ide.md)
