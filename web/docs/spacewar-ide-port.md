# SPACEWAR — ide pengembangan **port web**

Dokumen ini khusus tentang port webnya sebagai **perangkat lunak yang dipakai
orang**: bisa dimainkan di mana, dengan apa, dan seberapa tahan.

Ide yang menyangkut **bahan asli dan aturan main** — tempat gambar planet kedua,
ruang pamer sprite, layar asli — ada di [`spacewar-ide.md`](spacewar-ide.md) dan
tidak diulang di sini.

Rujukan: [dokumen port](spacewar.md)

---

## Keadaan sekarang — sisi port, terukur

| | |
|---|---|
| Kendali | papan ketik saja, **dua set tombol** (pemain kiri dan kanan) |
| Sentuh | **tidak ada** |
| `_shared/input.js` | **tidak dipakai** |
| Jeda | **ada** — satu-satunya dari keempat port |
| Titik putus tata letak | `1120px` dan `560px` — **paling siap di antara keempatnya** |
| `prefers-reduced-motion` | ditangani |
| Rekor | tersimpan lewat `store.js` |

Port ini yang paling matang sisi platformnya. Karena itu daftar di bawah lebih
pendek, dan yang tersisa justru yang paling sulit.

---

## Ide, diurutkan menurut nilainya

### 1. Sentuh — dan mengakui bahwa ini yang tersulit

Berbeda dari HOPPER (satu ketukan satu lompat) dan PAC-GAL (empat arah), SPACEWAR
butuh **enam kendali berkelanjutan sekaligus**: putar kiri, putar kanan, impuls,
foton, fasor, selubung, hyperspace — dan aslinya untuk **dua** pemain.

Jadi jangan mencoba memindahkan semuanya. Yang masuk akal:

| Sasaran | Tata letak |
|---|---|
| **Satu pemain lawan robot** | putar kiri/kanan di kiri layar, dorong + tembak di kanan; senjata jarang dipakai (selubung, hyperspace) jadi tombol kecil |
| **Dua pemain di satu layar** | jangan. Layar ponsel tidak muat dua set kendali yang adil |

Keputusan yang perlu diambil lebih dulu: **apakah mode dua pemain diakui hanya
untuk papan ketik.** Menuliskannya terang-terangan lebih baik daripada memaksakan
tata letak yang tidak enak bagi keduanya.

**Ukuran berhasil:** satu pertandingan penuh melawan robot bisa dimenangkan di
layar 390 × 844 tanpa papan ketik.

---

### 2. Pilihan pemain yang terlihat

Sekarang mode ditentukan dua kotak centang robot. Mematikan keduanya menghasilkan
manusia lawan manusia, tapi itu tidak terbaca sebagai fitur — ia terlihat seperti
mematikan sesuatu.

Satu pilihan tegas — **manusia vs robot** / **manusia vs manusia** /
**robot vs robot** — yang di belakangnya cuma menyetel kedua saklar yang sudah ada.
Robot lawan robot juga berguna sebagai peragaan **dan** sebagai uji rendaman: ia
satu-satunya cara menjalankan permainan ini berjam-jam tanpa tangan manusia.

---

### 3. Peta tombol yang bisa diubah

Dua set tombol di satu papan ketik itu sempit, dan tata letak papan ketik berbeda
antar-negara — `W`/`Z`/`Q` tidak di tempat yang sama pada AZERTY.

Karena peta tombol aslinya dipulihkan dari biner dan **ditampilkan dari sana**,
setiap perubahan harus jelas memisahkan dua hal: peta **asli** (dokumen sejarah,
tetap ditampilkan apa adanya) dan peta **yang sedang dipakai** (bisa diubah,
tersimpan di `store.js`). Jangan sampai penyetelan pemain menimpa tampilan yang
dikutip dari binernya.

---

### 4. Pakai `_shared/input.js`

`captureScroll()` yang paling terasa di sini: permainan ini memakai banyak tombol
sekaligus, dan spasi atau panah yang lolos akan menggulung halaman tepat saat
pemain sedang menghindar.

`flush()` berguna di antara ronde, supaya tombol yang masih tertekan saat kapal
meledak tidak langsung membakar bahan bakar di ronde berikutnya.

---

### 5. Papan skor dan pertandingan beberapa ronde

Tiap pertandingan sekarang berdiri sendiri. Format "menang 3 dari 5" cocok dengan
permainan dua pemain, murni sisi port, dan tidak menyentuh satu pun aturan yang
dipulihkan dari biner.

---

### 6. Uji rendaman otomatis lewat robot vs robot

Port ini punya sesuatu yang tidak dimiliki tiga lainnya: **dua robot**. Itu berarti
uji rendaman tidak butuh pemain uji buatan sama sekali — nyalakan keduanya,
jalankan ribuan bingkai tanpa kepala, lalu periksa:

- tidak ada galat yang tertelan;
- kedua kapal benar-benar bergerak (jangan sampai lolos seperti dunia yang
  membeku di HOPPER dulu);
- pertandingan **selesai** — kalau tidak pernah ada yang menang dalam batas waktu,
  itu sendiri temuan;
- energi perisai dan senjata tidak pernah negatif atau melampaui batasnya.

Ini uji paling murah di seluruh koleksi, dan belum ada.

---

### 7. Terbaca oleh lebih banyak orang

- **Kedua kapal** dibedakan warna dan bentuk — periksa apakah bedanya masih
  terbaca di tema terang dan bagi pemain buta warna, terutama saat keduanya
  berdekatan di depan Gargantua yang terang.
- **Energi perisai dan senjata** sebaiknya punya isyarat selain angka: bilah yang
  memendek, atau bunyi saat mendekati habis.
- **`aria-live`** untuk kejadian besar: kapal tersedot, pertandingan usai.

---

## Yang sebaiknya TIDAK dikerjakan

- **Memindahkan mode dua pemain ke sentuh dengan memaksa.** Lebih baik diakui
  sebagai mode papan ketik.
- **Menyentuh angka yang dikutip dari biner.** `FOTON_ONGKOS`, `FOTON_RUSAK`,
  `IMPULS_ONGKOS`, `IMPULS_TIAP` datang dari kalimat aturan di dalam binernya
  sendiri. Menyetelnya ulang "supaya lebih seimbang" membuang satu-satunya bagian
  permainan ini yang tidak perlu direkonstruksi.
- **Menambah efek di sekitar Gargantua karena selera.** Ia sudah melewati empat
  putaran koreksi. Tambahan apa pun jangan mengembalikan tepi tegas yang sudah
  susah payah dihilangkan.
- **Menyalahkan tapis blur untuk masalah kinerja tanpa mengukur.** Itu pernah
  dilakukan di proyek ini dan **salah** — halaman lain yang tanpa tapis pun ikut
  tersendat. Ukur dulu, baru simpulkan.


---

## Gudang ide — belum disaring

Bagian di atas **diurutkan dan disaring**. Bagian ini tidak: ia menampung
sebanyak mungkin kemungkinan, termasuk yang meragukan, yang mahal, dan yang
mungkin ternyata buruk. Menyaring pada tahap ide terlalu dini — gagasan yang
kelihatan lemah sering jadi pintu ke gagasan yang tidak lemah.

Aturannya: **tidak ada yang dihapus dari daftar ini**, hanya dipindahkan ke
"sudah dipertimbangkan dan ditolak" berikut alasannya.

### Kendali dan platform

- Kendali sentuh satu pemain: putar kiri/kanan di kiri, dorong dan tembak di kanan.
- Tombol senjata jarang-pakai (selubung, hyperspace) sebagai tombol kecil.
- Gamepad — permainan ini yang paling diuntungkan, karena butuh banyak tombol
  berkelanjutan.
- Dua gamepad untuk mode dua pemain.
- Peta tombol yang bisa diubah dan tersimpan, terpisah dari peta asli yang dikutip
  dari biner.
- Layar penuh.
- Mode kidal (tukar sisi kendali).

### Melihat mesinnya

- Jejak lintasan kedua kapal.
- Cincin bahaya di radius `SEDOT_R`.
- Medan gravitasi sebagai panah atau garis kontur.
- Garis prediksi lintasan pendek.
- Bilah energi perisai dan senjata, bukan hanya angka.
- Penampil sudut kapal (0–15) — sudutnya diskret seperti aslinya, dan itu terasa.
- Gerak lambat dan langkah-per-langkah.
- Penampil sprite asli 16 sudut, berikut alamat dan strid.
- Layar asli CGA dalam font hasil panen.

### Cara bermain yang lain

- Mode atraksi: robot lawan robot di halaman muka.
- Pertandingan beberapa ronde ("menang 3 dari 5").
- Turnamen antar-varian robot.
- Tingkat kesulitan robot.
- Watak robot berbeda: agresif, penghindar, penembak jauh.
- Mode tanpa planet / gravitasi kuat / gravitasi lemah (saklarnya sudah ada,
  jadikan pratata).
- Mode senjata terbatas: hanya foton, hanya fasor.
- Mode kooperatif melawan beberapa robot.
- Arena lebih besar dari layar, dengan peta kecil.
- Mode "hanya menghindar": bertahan selama mungkin.

### Angka dan riwayat

- Statistik pertandingan: tembakan, ketepatan, kerusakan, waktu bertahan.
- Riwayat pertandingan.
- Peta panas tempat kapal hancur.
- Benih ditampilkan dan bisa dimasukkan.
- Rekaman masukan dan putar ulang.

### Suara

- Suara mesin impuls yang berubah menurut dorongan.
- Nada berbeda untuk foton dan fasor.
- Bunyi peringatan saat perisai menipis.
- Suara hyperspace.

### Ketahanan

- **Uji rendaman lewat robot vs robot** — port ini satu-satunya yang tidak butuh
  pemain uji buatan.
- Periksa: energi tidak pernah negatif atau melampaui batas; pertandingan
  benar-benar selesai; kedua kapal bergerak.
- Tangkap galat global.
- Ukur kinerja sebelum menyimpulkan apa pun tentangnya.

### Rupa dan penyajian

- Mode CRT monokrom hijau atau kuning — sesuai zamannya, dan cocok dengan
  permainan luar angkasa.
- Garis pindai dan cahaya fosfor.
- Partikel ledakan, bukan hanya lingkaran.
- Guncangan layar saat perisai kena.
- Kerapatan medan bintang yang bisa diatur.
- Bintang berkedip perlahan.
- Jejak mesin impuls yang panjangnya mengikuti dorongan.
- Riak gravitasi di sekitar Gargantua yang bergerak lambat.
- Perbesaran arena yang bisa dipilih.
- Peralihan antar-ronde.
- Palet alternatif untuk kedua kapal, demi keterbacaan.

### Pengenalan bagi pemain baru

- Lapisan sekali-jalan: tombol mana untuk apa — permainan ini punya tombol
  terbanyak di koleksi, jadi ini paling dibutuhkan di sini.
- Latihan tanpa lawan: hanya terbang, merasakan gravitasi.
- Petunjuk kontekstual: "fasor bisa menembak jatuh torpedo".
- Robot dengan tingkat kesulitan paling rendah sebagai lawan pertama.
- Penjelasan singkat kenapa kapal melengkung mendekati planet.

### Sudah dipertimbangkan dan ditolak

| Ide | Alasan ditolak |
|---|---|
| Mengganti kapal modern dengan sprite 16×16 | sudah diputuskan; sprite layak dipamerkan, bukan dipasang diam-diam |
| Dua pemain di satu layar sentuh | tidak muat secara adil; akui saja sebagai mode papan ketik |
| Menyetel ulang ongkos/kerusakan senjata | angkanya dikutip dari kalimat aturan di dalam binernya |
| Menyalahkan tapis blur untuk kinerja | pernah dilakukan dan **salah**; halaman tanpa tapis pun tersendat |

---

Berkas terkait: [pakai](../games/spacewar/index.html) ·
[ide bahan asli & aturan](spacewar-ide.md) · [dokumen port](spacewar.md) ·
[port lain](3dttt-ide-port.md) · [hopper](hopper-ide-port.md) · [pacgal](pacgal-ide-port.md)
