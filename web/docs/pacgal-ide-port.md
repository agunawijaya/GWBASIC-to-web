# PAC-GAL — ide pengembangan **port web**

Dokumen ini khusus tentang port webnya sebagai **perangkat lunak yang dipakai
orang**: bisa dimainkan di mana, dengan apa, dan seberapa tahan.

Ide yang menyangkut **aturan main** — pelepas-paksa 1980, level 2, mode `I12%`,
buah bonus — ada di [`pacgal-ide.md`](pacgal-ide.md) dan tidak diulang di sini.

Rujukan: [`GEOMETRY.md`](../games/pacgal/GEOMETRY.md) ·
[`GHOSTS.md`](../games/pacgal/GHOSTS.md) · [dokumen port](pacgal.md)

---

## Keadaan sekarang — sisi port, terukur

| | |
|---|---|
| Kendali | papan ketik saja: panah dan `WASD` |
| Sentuh | **tidak ada** — tidak ada `touchstart`, `pointerdown`, maupun tombol layar |
| `_shared/input.js` | **tidak dipakai**, padahal tersedia dan dipakai 12 halaman lain |
| Jeda | **tidak ada** |
| Titik putus tata letak | hanya `1080px` — **tidak ada tata letak layar kecil** |
| `prefers-reduced-motion` | ditangani |
| Rekor | tersimpan lewat `store.js` |

Dua baris tebal itu punya akibat yang sama dan langsung: **di ponsel, halaman ini
terbuka tapi tidak bisa dimainkan.**

---

## Ide, diurutkan menurut nilainya

### 1. Bisa dimainkan di ponsel

**Ini yang terbesar.** Pac-Man hanya butuh empat arah — permainan aksi paling
mudah disentuhkan di koleksi ini, dan justru belum.

Dua cara, dan sebaiknya keduanya:

| Cara | Cocok untuk | Catatan |
|---|---|---|
| **Geser (swipe)** di area labirin | bermain santai | satu gerakan = satu arah; jangan menuntut ketepatan |
| **D-pad di layar** | bermain serius | harus bisa ditekan-tahan dan diganti arah tanpa mengangkat jari |

Yang penting untuk permainan ini: masukan arah di PAC-GAL bersifat **ketik-dulu**
— `pemain.ndr/ndc` disimpan dan baru dipakai saat beloknya sah. Jadi kendali
sentuh cukup mengisi variabel yang sama; tidak ada logika baru yang perlu ditulis,
dan rasa "belok bisa ditekan sebelum tikungan" ikut terbawa gratis.

**Jebakan yang harus dihindari:** d-pad yang menutupi labirin. Labirinnya 40 sel
lebar; di layar sempit ia sudah kecil. Tata letak tegak (labirin di atas, kendali
di bawah) lebih baik daripada kendali melayang.

**Ukuran berhasil:** satu permainan penuh sampai 468 pelet bisa diselesaikan di
layar 390 × 844 tanpa papan ketik.

---

### 2. Tata letak layar kecil

Sekarang satu-satunya titik putus di `1080px`. Di bawah itu tidak ada apa-apa —
padahal SPACEWAR punya `560px` dan 3DTTT punya `620px`, jadi polanya sudah ada di
koleksi ini dan tinggal ditiru.

Yang perlu diputuskan untuk halaman ini secara khusus: panel angkanya **panjang**
(pelet, nyawa, rentan, mode, giliran, `I12%`, bonus, rekor) ditambah panel saklar
hantu asli. Di layar sempit itu harus jadi bisa dilipat, bukan dijejalkan — dan
panel saklar itu **sudah pernah dilaporkan berantakan**, jadi ia yang paling perlu
diperiksa ulang di lebar sempit.

---

### 3. Jeda yang sungguhan

Belum ada. Kata "jeda" di kodenya semuanya merujuk pembekuan 0,9 detik saat hantu
dimakan, bukan jeda pemain.

Yang dibutuhkan: satu tombol dan satu tombol papan ketik (`P` atau `Esc`), plus
**jeda otomatis saat tab ditinggalkan**. Yang terakhir itu bukan sekadar
kenyamanan: mekanismenya sudah setengah ada — `loop.js` menjepit `dt > 0.25`
supaya dunia tidak melompat saat tab kembali — tapi pemain yang kembali tetap
mendapati dirinya sudah mati tanpa melihat apa pun.

---

### 4. Pakai `_shared/input.js`

Halaman ini menulis sendiri penanganan `keydown`-nya, padahal modul bersamanya
ada dan menyediakan tiga hal yang berguna di sini:

- `captureScroll()` — mencegah panah menggulung halaman, yang di layar sempit
  langsung terasa;
- `flush()` — mengosongkan penyangga ketik-dulu, berguna tepat sesudah mati supaya
  tombol yang tertekan panik tidak langsung membuang nyawa berikutnya;
- `tappable()` — menjadikan elemen bisa diketuk **sekaligus** bisa diakses papan
  ketik.

Ini bukan sekadar merapikan: `flush()` menjawab keluhan yang belum pernah
dilaporkan tapi hampir pasti ada — respawn yang langsung berjalan ke arah lama.

---

### 5. Kotak uji yang tetap, bukan yang dibuang

**Ini yang paling mahal kalau diabaikan.** Sepanjang perbaikan hantu, harness uji
gagal **empat kali dan semuanya diam-diam**:

1. kotak kandang diturunkan dari posisi start hantu;
2. koordinat dibalik `x/8` padahal gambarnya di `x = c·16 + 4`;
3. pemain uji diam di dinding, sehingga seluruh pengukuran berjalan di atas
   permainan yang **sudah usai**;
4. "mata kembali normal" terhitung padahal sebabnya pemain mati.

Semua harness itu dihapus sesudah dipakai, jadi pelajarannya tersimpan di dokumen
tapi tidak di kode. Yang layak dibuat: harness **permanen** dengan pemain uji
pencari jalan, yang melaporkan nyawa, kematian, pelet termakan, waktu di kandang,
dan mata yang pulang — plus **kontrol negatif**, karena uji yang lulus tidak
membuktikan apa pun sampai terbukti ia bisa gagal.

`GHOSTS.md` §6 sudah memuat daftar cara gagalnya. Ubah daftar itu jadi kode.

---

### 6. Simpan keadaan permainan

Rekor sudah tersimpan, permainannya tidak. Untuk permainan yang satu babaknya bisa
belasan menit, menutup tab berarti mengulang dari nol. Keadaan yang perlu disimpan
kecil saja: posisi, pelet yang tersisa, nyawa, tik, dan keadaan keempat hantu.

---

### 7. Terbaca oleh lebih banyak orang

- **Bentuk, bukan hanya warna.** Keempat hantu dibedakan warna; pemain buta warna
  melihat empat bentuk yang sama. Beri masing-masing siluet mata atau pola yang
  berbeda tipis.
- **Keadaan rentan** sekarang ditandai warna; tambahkan isyarat kedua (kedipan
  yang melambat menjelang habis) — itu juga isyarat yang berguna untuk semua orang,
  karena ia memberi tahu sisa waktu.
- **Umumkan kejadian penting** lewat wilayah `aria-live`: nyawa berkurang, hantu
  dimakan, level tuntas.

---

## Yang sebaiknya TIDAK dikerjakan

- **Menggambar ulang labirin supaya "lebih rapi" di layar kecil.** Petaknya hasil
  panen dan sudah diverifikasi 24/24 baris. Yang menyesuaikan diri adalah tata
  letak halamannya, bukan labirinnya.
- **Menambah pengaturan kecepatan.** `PER_LANGKAH` mengikat seluruh angka lain
  yang sudah diukur — ambang, durasi rentan, jeda. Mengubahnya lewat antarmuka
  membuat setiap angka di `GHOSTS.md` berhenti berlaku.
- **Mengganti SVG dengan kanvas demi kinerja.** Belum ada bukti ia lambat. Ukur
  dulu; kalau memang perlu, itu keputusan besar yang layak dokumennya sendiri.
- **Mengubah tetapan tanpa menjalankan ulang `gen-pacgal-ref.py`.**


---

## Gudang ide — belum disaring

Bagian di atas **diurutkan dan disaring**. Bagian ini tidak: ia menampung
sebanyak mungkin kemungkinan, termasuk yang meragukan, yang mahal, dan yang
mungkin ternyata buruk. Menyaring pada tahap ide terlalu dini — gagasan yang
kelihatan lemah sering jadi pintu ke gagasan yang tidak lemah.

Aturannya: **tidak ada yang dihapus dari daftar ini**, hanya dipindahkan ke
"sudah dipertimbangkan dan ditolak" berikut alasannya.

### Kendali dan platform

- D-pad layar yang bisa digeser posisinya (kidal / kanan).
- Geser (swipe) di seluruh area labirin.
- Zona ketuk tak terlihat: ketuk di sisi mana pun dari Pac-Gal.
- Dukungan gamepad lewat Gamepad API.
- Peta tombol yang bisa diubah dan tersimpan.
- Mode satu tangan: dua tombol (belok kiri / belok kanan relatif arah hadap).
- Getaran (`navigator.vibrate`) saat mati atau makan hantu.
- Mode layar penuh.
- Kunci orientasi tegak di ponsel.

### Melihat mesinnya

- **Penampil sasaran hantu**: kotak kecil di petak yang sedang dibidik tiap hantu
  — ini persis tampilan pengembang yang membuat AI Pac-Man 1980 bisa dipelajari
  orang banyak.
- Penampil **peta jarak** `KELUAR` dan `PULANG` sebagai gradien di labirin.
- Penampil mode tiap hantu (kandang / keluar / kejar / sebar / pulang) sebagai
  warna bingkai.
- Garis dari hantu ke sasarannya.
- Penghitung mundur sebar↔kejar yang terlihat.
- Nilai `I12%` sebagai bilah, bukan angka.
- Langkah-per-langkah (frame step) dan gerak lambat untuk mempelajari kejaran.
- Rekaman 5 detik terakhir sebelum mati, bisa diputar ulang.

### Cara bermain yang lain

- **Dua papan berdampingan, satu masukan**: mode 1980 dan mode asli PAC-GAL
  dijalankan bersamaan dengan benih dan tombol yang sama. Perbedaan kedua AI jadi
  terlihat langsung, bukan diceritakan.
- Mode atraksi: permainan bermain sendiri di halaman muka.
- Dua pemain bergantian, skor tertinggi menang.
- Pemain kedua mengendalikan satu hantu.
- Mode latihan: pilih level, pilih posisi awal, hantu bisa dimatikan satu per satu.
- Mode "hanya satu hantu" untuk belajar pola tiap watak.
- Serangan waktu: berapa cepat 468 pelet habis.
- Mode tanpa energizer.
- Labirin alternatif (dengan penanda jelas bahwa itu bukan labirin aslinya).
- Penyunting labirin.

### Angka dan riwayat

- Peta panas tempat pemain mati.
- Peta panas petak yang paling sering dilalui.
- Statistik: waktu bertahan rata-rata, hantu mana yang paling sering membunuh.
- Grafik pelet per menit.
- Riwayat beberapa permainan terakhir, bukan hanya rekor.
- Benih acak ditampilkan dan bisa dimasukkan — permainan jadi bisa diulang persis.
- Ekspor rekaman masukan, putar ulang deterministik (RNG-nya sudah berbenih).

### Suara

- Sirene hantu yang naik nada seiring pelet menipis, seperti arcade.
- Nada berbeda untuk tiap mode hantu.
- Suara langkah pelet yang berselang-seling.
- Pilihan: senyap / hanya efek / lengkap.

### Ketahanan

- Simpan keadaan permainan, lanjutkan setelah tab ditutup.
- Uji rendaman tetap dengan kontrol negatif.
- Pemeriksaan otomatis bahwa setiap `id` yang ditulis kode ada di HTML.
- Pemeriksaan bahwa `GHOSTS.md` dan `GEOMETRY.md` tidak basi (jalankan generator
  di CI kecil, bandingkan hasilnya).
- Tangkap galat global dan tampilkan, jangan telan diam-diam.

### Rupa dan penyajian

- **Tampilan mode teks**: gambar labirinnya sebagai karakter CP437 di font
  monospace — itu **persis** wujud aslinya, karena program ini memang mencetak
  layar teks. Ide rupa yang kebetulan juga paling setia.
- Palet CGA asli sebagai pilihan tema.
- Tapis CRT: garis pindai, lengkungan tepi, cahaya fosfor.
- Gaya dinding: garis tunggal / balok penuh / bergaya.
- Kulit (skin) hantu yang bisa diganti.
- Guncangan layar kecil saat nyawa hilang.
- Partikel saat pelet dimakan.
- Peralihan antar-level dan antar-nyawa.
- Tingkat perbesaran yang bisa dipilih.
- Penskalaan piksel tegas versus halus.
- Mode gelap/terang untuk labirinnya sendiri, bukan hanya halamannya.

### Pengenalan bagi pemain baru

- Lapisan sekali-jalan saat pertama membuka: apa tombolnya, apa tujuannya.
- Petunjuk kontekstual: "hantu berkedip berarti masa rentan hampir habis".
- Mode latihan tanpa nyawa.
- Mode dengan satu hantu saja, ditambah satu per satu.
- Anotasi "apa yang sedang Anda lihat" di panel — terutama untuk `I12%` yang
  butuh penjelasan.
- Tingkat kesulitan bawaan untuk pemain baru.

### Sudah dipertimbangkan dan ditolak

| Ide | Alasan ditolak |
|---|---|
| Pengaturan kecepatan di antarmuka | `PER_LANGKAH` mengikat semua angka terukur lain |
| Mengganti SVG dengan kanvas | belum ada bukti lambat; ukur dulu |
| Menggambar ulang labirin agar rapi di layar kecil | petaknya hasil panen dan terverifikasi |

---

Berkas terkait: [pakai](../games/pacgal/index.html) ·
[ide aturan main](pacgal-ide.md) · [dokumen port](pacgal.md) ·
[port lain](3dttt-ide-port.md) · [spacewar](spacewar-ide-port.md) · [hopper](hopper-ide-port.md)
