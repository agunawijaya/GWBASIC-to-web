# SPACEWAR — ide pengembangan selanjutnya

Dokumen ini bukan janji dan bukan rencana kerja. Isinya usulan berikut alasannya
dan cara menilainya.

> **Dokumen ini condong ke sisi bahan aslinya** — dekompilasi, pemulihan,
> dan aturan main. Ide yang murni tentang **port webnya sebagai perangkat
> lunak** (sentuh, papan ketik, tata letak layar kecil, aksesibilitas, uji)
> ada di [`spacewar-ide-port.md`](spacewar-ide-port.md).

SPACEWAR punya kedudukan khusus di koleksi: **satu-satunya yang tidak pernah
BASIC**, dan satu-satunya yang binernya membawa aturan mainnya sendiri dalam
kalimat bahasa Inggris. Akibatnya port ini sudah lebih lengkap daripada yang
terlihat — periksa daftar "sudah ada" di bawah sebelum mengusulkan apa pun.

Rujukan: [dokumen port](spacewar.md) · [analisis dekompilasi](../../decompile/SPACEWAR/ARCHITECTURE.md)

---

## Keadaan sekarang

| | |
|---|---|
| Kendali | Mulai · Jeda · robot kiri · robot kanan · planet · gravitasi |
| Baku | robot kanan menyala, robot kiri mati — bawaannya manusia lawan robot |
| Senjata | foton, **fasor**, impuls, selubung, hyperspace — semuanya terpasang |
| Fasor | menembak jatuh torpedo lawan, persis seperti aturan di biner `0x3E31` |
| Planet | Gargantua (*Interstellar*), berikut animasi kapal tersedot |
| Suara | ada |
| Sprite asli | keenam tabel **sudah terpecahkan**, tersimpan di `spacewar-data.js` |

### Yang SUDAH ditampilkan — jangan diusulkan ulang

Saya sempat mengira teks aslinya belum dipakai. Salah, dan ini dicatat supaya
tidak terulang:

| Blok | Ukuran | Status |
|---|--:|---|
| `G A M E   I N S T R U C T I O N S` | 16 baris, 818 karakter | **tampil** di `<pre id="instruksi">` |
| Pemberitahuan `USER-SUPPORTED` | 14 baris, 695 karakter | **tampil** di `<pre id="shareware">` |
| Peta tombol kedua pemain | dari `D.kiri` / `D.kanan` | **tampil**, judulnya pun dari binernya |
| `legenda` — tata letak layar `G A M E   K E Y S` | 69 baris, 464 karakter | **belum dipakai** (lihat ide 4) |

Pelajaran kecil yang membuat saya keliru: judul di binernya **dijarangkan**
(`G A M E    K E Y S`), jadi mencari `"GAME KEYS"` menghasilkan nol dan terbaca
seperti tidak ada. Sebuah pencarian yang gagal bukan bukti ketiadaan.

---

## Ide, diurutkan menurut nilainya

### 1. Selesaikan pertanyaan tempat gambar planet kedua di (592, 24)

**Status: pertanyaan dekompilasi yang masih terbuka, dan satu-satunya yang bisa
mengubah isi halaman.**

Tabel `0x1840` sudah pasti planetnya — digambar tepat di titik tengah layar,
digerbangi saklar berlabel `PLANET`, berputar 16 bingkai. Tiga hal berhimpit dan
tidak ada bacaan lain yang muat.

Tapi ada **tempat gambar kedua** di (592, 24), sudut kanan atas, di dalam ISR yang
juga menjaga pencacah jam BIOS di `40:6C`. Ia memakai tabel dan pencacah bingkai
yang sama, tapi gerbangnya berbeda. **Perannya belum dipastikan.**

Kandidatnya: benda kedua di arena, indikator status, atau sisa yang tak terpakai.
Cara menyelesaikannya bukan membaca kodenya lebih lama, melainkan **menjalankan
binernya** dan melihat apa yang muncul di sudut itu. Kalau ternyata benda kedua,
port ini kehilangan satu benda — dan itu perubahan isi, bukan hiasan.

---

### 2. Perlihatkan gravitasinya

**Status: tambahan. Nilai main tertinggi.**

Saklar gravitasi sudah ada, tapi efeknya hanya terasa, tidak terlihat. Tiga
kemungkinan, dari yang paling murah:

| | Apa | Ongkos |
|---|---|---|
| **Jejak lintasan** | sisa jalur kapal beberapa detik terakhir | kecil |
| **Cincin bahaya** | lingkaran di radius `SEDOT_R`, tempat penyedotan mulai | kecil |
| **Garis prediksi** | ramalan pendek lintasan sendiri | sedang |

Cincin bahaya yang paling berguna untuk permainannya: sekarang batas maut
Gargantua adalah tebakan, dan kematian karenanya terasa sewenang-wenang, bukan
salah pemain.

**Peringatan gambar:** Gargantua sudah melewati empat putaran koreksi, tiga di
antaranya karena saya salah. Apa pun yang ditambahkan di sekitarnya jangan sampai
mengembalikan tepi tegas yang sudah susah payah dihilangkan — pakai gradien, bukan
garis penuh.

---

### 3. Jadikan pilihan pemainnya terlihat

**Status: penyesuaian antarmuka. Ongkos kecil.**

Binernya pada dasarnya permainan **dua orang** — peta tombol kedua pemain
dipulihkan utuh dan sudah dipakai. Mematikan kedua saklar robot sudah menghasilkan
manusia lawan manusia, tapi itu tidak terbaca sebagai fitur; ia terlihat seperti
mematikan sesuatu.

Usulnya satu pilihan tegas — **manusia vs robot** / **manusia vs manusia** /
**robot vs robot** — yang di belakangnya cuma menyetel kedua saklar yang sudah ada.
Robot lawan robot juga berguna sebagai peragaan dan sebagai uji rendaman panjang.

---

### 4. Layar asli, sebagai layar

**Status: pemulihan, kecil.**

Teks aslinya sudah tampil, tapi sebagai **HTML**. Yang belum ada: melihatnya
sebagaimana ia muncul di layar CGA 1985 — tata letaknya, penjarangan hurufnya, font
angka hasil panen. Blok `legenda` (69 baris) memang menyimpan tata letak layar
`G A M E   K E Y S` itu dan sekarang tidak dipakai sama sekali.

Nilainya bersifat museum, bukan main. Kerjakan kalau ingin halamannya punya satu
tempat yang benar-benar terlihat seperti aslinya.

---

### 5. Ruang pamer sprite asli — bukan pengganti kapalnya

**Status: pemulihan, sebagai pameran.**

Keenam tabel sudah terpecahkan, parameternya dibaca dari kedua penyalinnya — bukan
ditebak dari datanya:

| tabel | basis | n | strid | ukuran |
|---|--:|--:|--:|---|
| kapal pemain kiri / kanan | `0x1340` / `0x1540` | 16 | 32 | 16 × 16 |
| kecil, kiri / kanan | `0x1740` / `0x17C0` | 8 | 16 | 16 × 8 |
| font angka | `0x22A0` | 12 | 16 | 16 × 8 |
| bundar (planet) | `0x1840` | 16 | 128 | 32 × 32 |

**Ini BUKAN usulan mengganti kapal yang sekarang.** Kapal modern di halaman itu
diminta dan sudah disetujui; menggantinya dengan piksel 16×16 menghapus keputusan
yang sudah diambil. Yang diusulkan halaman pamer terpisah: keenam belas sudut
rotasi, ditampilkan besar, berikut alamat dan strid-nya.

Preseden dan pelajarannya ada di HOPPER — makro `DRAW` asli tetap ditafsirkan, tapi
perannya **bukti, bukan aset**. Perlakukan sprite ini sama.

---

### 6. Papan skor dan pertandingan beberapa ronde

**Status: tambahan.** Sekarang tiap pertandingan berdiri sendiri. Format "menang 3
dari 5" cocok dengan permainan dua pemain dan tidak menyentuh satu pun aturan yang
dipulihkan.

---

## Yang sebaiknya TIDAK dikerjakan

- **Mengganti kapal modern dengan sprite 16×16.** Sudah diputuskan. Sprite-nya
  layak dipamerkan, bukan dipasang diam-diam.
- **Menyentuh angka yang dikutip dari biner.** `FOTON_ONGKOS`, `FOTON_RUSAK`,
  `IMPULS_ONGKOS`, `IMPULS_TIAP` datang dari kalimat aturan di dalam binernya
  sendiri, lengkap dengan alamatnya. Menyetelnya ulang "supaya lebih seimbang"
  membuang satu-satunya bagian permainan ini yang tidak perlu direkonstruksi.
- **Menggambar ulang Gargantua karena selera.** Ubah hanya kalau ada rujukan baru.
- **Menambah senjata yang tidak ada di binernya.** Daftarnya lengkap dan terbaca.
- **Mengulang pekerjaan yang sudah selesai.** Lihat tabel "sudah ditampilkan" di
  atas — dan cari string dengan potongan pendek, karena judul di biner ini
  dijarangkan huruf demi huruf.


---

## Gudang ide — belum disaring

Bagian di atas diurutkan dan disaring. Bagian ini tidak. Sebagian pertanyaan di
bawah mungkin **tidak bisa dijawab** dengan bahan yang ada — itu bukan alasan
untuk tidak menuliskannya. Pertanyaan yang tercatat bisa dijawab orang lain, atau
oleh alat yang belum ada.

### Melanjutkan dekompilasi

- Peran tempat gambar bundar kedua di (592, 24), di dalam ISR yang menjaga jam BIOS.
- Sisa butir di §9 yang belum tertutup.
- Arah dan urutan bingkai rotasi planet: 16 bingkai, tapi searah jarum jam atau
  sebaliknya?
- Rutin suara: apakah ada, dan bagaimana bunyinya di speaker PC.
- Laju pemulihan energi perisai dan senjata — apakah terbaca sebagai angka?
- Radius tabrakan: apakah terbaca, atau selama ini diperkirakan?
- Pembangkit medan bintang.
- Apakah hyperspace punya peluang gagal, seperti Spacewar! aslinya di PDP-1?
- Syarat menang dan teks penutupnya.
- Semua string sebaris: sudah dipanen semua, atau masih ada yang terlewat?

### Memeriksa port terhadap biner

- Bandingkan **satu per satu** label bilah menu di biner dengan saklar di port.
- Bandingkan peta tombol yang ditampilkan port dengan yang dipakai port — keduanya
  harus sama, dan itu belum pernah diuji dengan `assert`.
- Jalankan biner di emulator dan bandingkan lintasan kapal dengan port pada
  masukan yang sama. Gravitasi adalah tempat perbedaan paling mudah terlihat.
- Ukur berapa lama satu pertandingan di biner asli, bandingkan dengan port.

### Yang lebih spekulatif

- Cari versi lain SPACEWAR dari penulis yang sama (biner menyebut "SPACE MINEZ"
  yang belum selesai — apakah pernah terbit?).
- Lacak apakah pemberitahuan shareware-nya pernah dijawab orang.
- Rekonstruksi robotnya: apakah `otak` di port sekeluarga dengan robot aslinya,
  atau berbeda sama sekali? Ini pertanyaan yang belum pernah diajukan.

---

Berkas terkait: [pakai](../games/spacewar/index.html) ·
[dokumen port](spacewar.md) ·
[analisis dekompilasi](../../decompile/SPACEWAR/ARCHITECTURE.md) ·
[ide port lain](3dttt-ide.md) · [hopper](hopper-ide.md) · [pacgal](pacgal-ide.md)
