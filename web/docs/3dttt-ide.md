# 3DTTT — ide pengembangan selanjutnya

Dokumen ini bukan janji dan bukan rencana kerja. Isinya usulan berikut alasannya,
dan yang lebih penting: **cara mengukur apakah usulan itu berhasil**. Port ini
punya satu sifat yang tidak dimiliki port lain di koleksi — lawan komputernya
sudah diukur, bukan diklaim — jadi setiap ide di bawah harus bisa dinilai dengan
angka yang sebanding.

> **Dokumen ini condong ke sisi bahan aslinya** — dekompilasi, pemulihan,
> dan aturan main. Ide yang murni tentang **port webnya sebagai perangkat
> lunak** (sentuh, papan ketik, tata letak layar kecil, aksesibilitas, uji)
> ada di [`3dttt-ide-port.md`](3dttt-ide-port.md).

Rujukan: [dokumen port](3dttt.md) · [analisis dekompilasi](../../decompile/3DTTT/ARCHITECTURE.md)

---

## Keadaan sekarang

| | |
|---|---|
| Papan | 4×4×4, disimpan sebagai larik 5×5×5 seperti aslinya |
| Garis menang | 76, dihitung dua cara yang saling memeriksa |
| Lawan komputer | **rekonstruksi saya**, bukan algoritma asli |
| Bobot penilai | `BOBOT = [0, 1, 12, 200]` |
| Tolok ukur | 200 permainan, benih 20260809, giliran pertama bergantian |
| Hasil vs lawan rakus | 179 menang · 20 seri · **1 kalah** · 67/67 ancaman diblok |
| Kendali halaman | Mulai · putar tegak · putar datar · **Ukur** |

Satu kekalahan itu bukan noise — ia **garpu**: dua ancaman sekaligus, dan penilai
yang tidak melihat ke depan tidak bisa mencegahnya terbentuk.

---

## Ide, diurutkan menurut nilainya

### 1. Petakan 31 target `GOSUB` — dan pulihkan penilai aslinya

**Status: pemulihan.** Ini ide terkuat di daftar, karena ia mengubah bagian yang
paling lemah dari port ini — sebuah rekonstruksi — menjadi temuan.

`ARCHITECTURE.md` §2 menyatakan pemetaan 31 target `GOSUB` ke fungsi permainan
**belum dikerjakan**. Selama itu belum, kalimat "penilai ini milik saya, bukan yang
asli" harus tetap berdiri di dokumen port.

Kalau berhasil, polanya sudah ada di koleksi ini: PAC-GAL memasang **saklar** yang
menjalankan perilaku asli berdampingan dengan rekonstruksi, sehingga keduanya bisa
dibandingkan langsung dan pembacanya bisa menilai sendiri. Lakukan hal yang sama:
saklar "lawan asli 3DTTT" di sebelah "Ukur".

**Ukuran berhasil:** jalankan tolok ukur yang sama terhadap kedua penilai.
Berapa menang/seri/kalah masing-masing? Kalau penilai asli ternyata **lebih lemah**,
itu tetap temuan, dan justru temuan yang menarik.

**Ongkos:** besar, dan hasilnya tidak dijamin. Ini pekerjaan dekompilasi, bukan
pekerjaan web.

---

### 2. Tutup satu kekalahan itu — dan ukur harganya

**Status: perbaikan rekonstruksi.** Dua pendekatan, dan menariknya justru dari
membandingkan keduanya:

| Pendekatan | Cara | Ongkos jalan |
|---|---|---|
| **Deteksi garpu langsung** | sesudah langkah saya, hitung sel kosong yang menyelesaikan garis lawan; kalau ≥ 2, langkah itu ditolak | murah, satu sapuan tambahan |
| **Pencarian kedalaman 2** | telusuri langkah lawan berikutnya secara penuh | mahal, ~76 × 61 penilaian |

Keduanya menyelesaikan kekalahan yang sama. Pertanyaannya bukan "mana yang jalan",
melainkan **berapa harga penglihatan satu langkah** — dan itu angka yang layak
ditulis di dokumen port.

**Ukuran berhasil:** kekalahan turun dari 1 jadi 0 pada 200 permainan yang sama,
**dan** waktu per langkah dilaporkan untuk keduanya.

**Peringatan:** kalau kekalahan sudah 0, tolok ukurnya berhenti memberi informasi.
Lihat ide 3 — keduanya harus dikerjakan bersama, bukan berurutan.

---

### 3. Lawan tolok ukur yang membangun garpu dengan sengaja

**Status: alat ukur.** Pelajaran yang sudah tertulis di dokumen port berbunyi:
sebuah tolok ukur yang selalu lulus bukan tolok ukur, melainkan hiasan. Lawan
rakus sekarang membuat garpu **satu kali dalam 200 permainan** — dan itu tanpa
sengaja.

Begitu ide 2 dikerjakan, angka 1 itu jadi 0, dan tolok ukurnya mati.

Jadi buat lawan ketiga yang **mencari garpu**: pilih langkah yang memaksimalkan
jumlah sel penyelesai miliknya sendiri. Ia tidak perlu pintar secara umum; ia cuma
perlu menekan tepat pada kelemahan yang sedang diuji.

**Ukuran berhasil:** terhadap penilai **sekarang**, lawan ini harus menang jauh
lebih dari sekali. Kalau tidak, ia belum layak dipakai menguji perbaikannya.

---

### 4. Tingkat kesulitan yang jujur

**Status: tambahan.** Alih-alih "mudah/sedang/sulit" yang artinya kabur, tiap
tingkat memakai penilai yang berbeda **dan menampilkan angka tolok ukurnya sendiri**
di panel: "tingkat ini: 179–20–1 dari 200".

Itu membuat pilihan kesulitan jadi informasi, bukan hiasan — dan sekaligus memaksa
tiap tingkat benar-benar diukur sebelum dipasang.

---

### 5. Membuat 76 garis itu terlihat

**Status: tambahan.** Papan 4×4×4 sulit dibaca, dan diagonal ruang yang cuma 5,3%
dari garis adalah yang paling sering terlewat manusia.

**Sudah ada:** garis menang disorot saat permainan usai (`is-menang`, berikut
animasi denyut yang dimatikan pada `prefers-reduced-motion`), dan panel menghitung
"garis hidup". Jangan diusulkan ulang.

Yang belum:

- **Sorot ancaman**: tandai sel yang, kalau diisi, menyelesaikan garis siapa pun.
  Penilai sudah menghitungnya di dalam — variabel `ancaman` ada di kode pengukuran —
  tapi angka itu tidak pernah sampai ke layar. Ini alat belajar: pemain jadi
  melihat apa yang dilihat penilai.
- **Peta garis**: daftar ke-76 garis yang bisa disorot satu per satu, supaya
  diagonal ruang berhenti jadi hal yang cuma diketahui dari dokumen.

**Peringatan dari §4b dokumen port:** kontras di tema terang pernah hilang. Apa pun
yang ditambahkan di sini harus diperiksa di **kedua** tema, dan sebaiknya tidak
mengandalkan warna sendirian.

---

### 6. Urungkan langkah dan telusuri ulang

**Status: tambahan.** Untuk permainan yang inti kesulitannya adalah melihat ruang,
kemampuan mundur satu langkah dan mencoba lagi bernilai besar sebagai alat belajar.
Tambahan wajarnya: putar ulang seluruh permainan langkah demi langkah, terutama
untuk **satu permainan yang kalah itu** — ia layak bisa ditonton.

---

## Yang sebaiknya TIDAK dikerjakan

- **Menaikkan kesulitan tanpa mengukurnya.** Klaim "AI-nya sekarang lebih pintar"
  tidak boleh masuk dokumen tanpa tabel menang/seri/kalah dari tolok ukur yang sama.
- **Mengganti larik 5×5×5 jadi 4×4×4.** Ia boros, dan itu memang temuannya —
  61 sel terbuang supaya setiap indeks bisa dipakai apa adanya tanpa pengurangan.
  Merapikannya menghapus buktinya.
- **Animasi papan yang menutupi keadaan.** Papan ini sudah sulit dibaca; gerakan
  yang menghalangi pembacaan sel adalah kemunduran, bukan kemajuan.
- **Menyembunyikan tolok ukur.** Tombol "Ukur" adalah bagian paling jujur dari
  halaman ini.


---

## Gudang ide — belum disaring

Bagian di atas diurutkan dan disaring. Bagian ini tidak. Sebagian pertanyaan di
bawah mungkin **tidak bisa dijawab** dengan bahan yang ada — itu bukan alasan
untuk tidak menuliskannya. Pertanyaan yang tercatat bisa dijawab orang lain, atau
oleh alat yang belum ada.

### Melanjutkan dekompilasi

- 303 panggilan (13%) belum bernama — terbanyak `RT#16`/`RT#17`, keduanya operasi
  string.
- Empat nama masih `__maybe`: `CINT`, `NEG!`, `STROP`, `STROUT`. Masing-masing
  baru punya satu jenis bukti.
- 105 bita dalam 12 rentang terbaca sebagai kode tapi tak terjangkau penelusuran.
- Petakan 31 target `GOSUB` ke fungsi permainan.

### Memulihkan aturan mainnya

- Algoritma penilai aslinya — inti dari semuanya.
- Apakah aslinya punya tingkat kesulitan?
- Aturan giliran pertama: acak, atau selalu pemain?
- Apakah aslinya menyimpan ke-76 garis, atau menghitungnya saat jalan?
- Bagaimana aslinya menampilkan papan 3D di layar teks?
- Apakah ada pesan/teks yang belum dipanen?

### Cara lain yang belum dicoba

- **Sidik jari perilaku**: alih-alih membaca penilainya, *ukur* binernya. Beri ia
  posisi yang sama berulang kali di emulator dan catat langkahnya. Dari beberapa
  ratus posisi, sifat penilainya bisa disimpulkan tanpa pernah membaca kodenya.
- Bandingkan langkah biner asli dengan langkah penilai port pada posisi yang sama —
  angka ketidaksesuaiannya adalah ukuran seberapa jauh rekonstruksi ini meleset.
- Cari klon 3D tic-tac-toe sezaman yang kode sumbernya ada, sebagai pembanding.
- Uji apakah penilai port dan penilai asli bisa dibedakan oleh manusia yang bermain
  melawan keduanya secara buta.

---

Berkas terkait: [pakai](../games/3dttt/index.html) ·
[dokumen port](3dttt.md) ·
[analisis dekompilasi](../../decompile/3DTTT/ARCHITECTURE.md) ·
[ide port lain](spacewar-ide.md) · [hopper](hopper-ide.md) · [pacgal](pacgal-ide.md)
