# HOPPER — ide pengembangan **port web**

Dokumen ini khusus tentang port webnya sebagai **perangkat lunak yang dipakai
orang**: bisa dimainkan di mana, dengan apa, dan seberapa tahan.

Ide yang menyangkut **aturan main dan bahan aslinya** — berkas `HOPPER.SCO` 1991,
ruang pamer makro `DRAW`, kurva kesulitan — ada di
[`hopper-ide.md`](hopper-ide.md) dan tidak diulang di sini.

Rujukan: [dokumen port](hopper.md)

---

## Keadaan sekarang — sisi port, terukur

| | |
|---|---|
| Kendali | papan ketik saja: panah / `WASD` untuk melompat |
| Sentuh | **tidak ada** |
| `_shared/input.js` | **tidak dipakai** |
| Jeda | **tidak ada** |
| Titik putus tata letak | hanya `1080px` — **tidak ada tata letak layar kecil** |
| `prefers-reduced-motion` | ditangani |
| Skor | tersimpan lewat `store.js` |
| Waktu | 90 detik, mengetat 5 detik per level sampai lantai 45 |

---

## Ide, diurutkan menurut nilainya

### 1. Bisa dimainkan di ponsel

Dari keempat port, **HOPPER yang paling cocok untuk sentuh** — masukannya bukan
arah berkelanjutan melainkan **lompatan diskret**, satu ketukan satu lompat. Itu
justru gerakan yang paling alami di layar sentuh, dan tidak menuntut ketepatan
seperti stik arah.

Dua bentuk yang masuk akal:

| Bentuk | Cara | Catatan |
|---|---|---|
| **Ketuk arah** | ketuk di atas/bawah/kiri/kanan katak | tanpa tombol menutupi layar; paling langsung |
| **Geser pendek** | satu geseran = satu lompat | nyaman, tapi lebih mudah salah baca |

Karena satu ketukan menghasilkan **satu** lompatan, tidak ada masalah tekan-tahan
seperti pada permainan arah berkelanjutan. Ini pekerjaan kecil dengan hasil besar.

**Ukuran berhasil:** satu level tuntas — kelima rumah terisi — di layar
390 × 844 tanpa papan ketik.

---

### 2. Tata letak layar kecil

Satu-satunya titik putus di `1080px`. Papannya lebar (sebelas jalur mendatar),
jadi di layar tegak ia perlu diskalakan, bukan digulung — permainan yang bagian
bawah layarnya tidak terlihat tidak bisa dimainkan.

Panelnya juga panjang: Skor, Nyawa, Waktu, Rumah terisi, Level · laju, Kecepatan
jalur. Baris "Kecepatan jalur" itu yang paling menarik untuk dipertahankan (ia
angka hasil pemulihan) dan paling boros tempat — kandidat untuk dilipat.

---

### 3. Jeda, dan jeda otomatis

Belum ada sama sekali. Untuk permainan bertimer, ini lebih penting daripada di
permainan lain: meninggalkan tab berarti **kehilangan nyawa tanpa melihatnya**.

Minimal: tombol jeda, tombol papan ketik, dan **jeda otomatis saat tab tidak
terlihat** — waktunya ikut berhenti.

---

### 4. Pakai `_shared/input.js`

Terutama `flush()`. Permainan ini punya fase kematian yang panjang — katak gepeng,
lalu diam, lalu respawn — dan pemain yang menekan-nekan tombol selama fase itu
akan langsung melompat begitu respawn, kadang ke bawah roda berikutnya. Itu persis
masalah yang `flush()` selesaikan, dan idiom aslinya (`POKE 106,0`) memang ada di
program-program di koleksi ini.

`captureScroll()` juga langsung terasa di layar sempit.

---

### 5. Lapisan "lihat mesinnya"

Panel sudah menampilkan kecepatan jalur. Yang belum: lapisan yang bisa dinyalakan
dan memperlihatkan **kotak tabrakan**, arah tiap jalur, dan angka tabel laju tepat
di ujung jalurnya masing-masing.

Alasannya bukan gaya. Salah satu cacat tersulit di port ini adalah katak yang
**digambar 6 piksel di bawah** tempat tabrakannya dihitung — yang terlihat tidak
sama dengan yang dihitung, dan itu golongan cacat yang paling sulit dilaporkan
pemain karena mereka hanya merasa "kok kena, padahal belum kena".

Lapisan seperti ini membuat golongan itu terlihat seketika.

---

### 6. Uji rendaman yang tetap

Port ini pernah **membeku total** karena satu elemen panel yang tidak ada
(`s-level`) membuat `tulis()` melempar sebelum gelung sempat dimulai — kendaraan
dan batang kayu diam, tapi kataknya masih bisa melompat. Dari luar itu terlihat
seperti masalah animasi; sebabnya urutan pemanggilan.

Uji yang mencegahnya kembali tidak rumit: jalankan beberapa ribu bingkai tanpa
kepala, lalu periksa bahwa **posisi kendaraan berubah** dan tidak ada galat yang
tertelan. Tambahkan pemeriksaan bahwa setiap elemen panel yang ditulis kode
memang ada di HTML — daftarnya pendek dan mudah dibandingkan.

---

### 7. Terbaca oleh lebih banyak orang

- **Jalur air dan jalur jalan** dibedakan warna. Bedakan juga teksturnya, supaya
  tenggelam dan terlindas tidak terasa sewenang-wenang bagi pemain buta warna.
- **Waktu hampir habis** sebaiknya punya isyarat kedua selain angka mengecil —
  bunyi atau denyut — karena mata pemain sedang di kataknya, bukan di panel.
- **`aria-live`** untuk kejadian: rumah terisi, nyawa berkurang, level naik.

---

## Yang sebaiknya TIDAK dikerjakan

- **Mengubah kecepatan jadi relatif terhadap laju bingkai.** Kecepatan di port ini
  mutlak, terikat tabel sebelas jalur yang dipulihkan dari kode mesin. Menjadikannya
  relatif memutus kaitan itu dan membuat permainan berbeda di tiap mesin.
- **Menaikkan `LAJU_MAKS` di atas ×5.** Itu langit-langit dial aslinya.
- **Membuang fase.** Kelima fase (main, gepeng, nyemplung, tuntas, usai) lahir dari
  cacat nyata: dulu permainan membeku saat rumah kelima terisi karena tidak ada
  keadaan yang mewakili "sedang menyelesaikan level".
- **Menambahkan animasi yang membongkar adegan lalu membangunnya lagi.** Urutan
  lapisan dan kesinambungan benda di layar ini sudah pernah jadi sumber cacat.


---

## Gudang ide — belum disaring

Bagian di atas **diurutkan dan disaring**. Bagian ini tidak: ia menampung
sebanyak mungkin kemungkinan, termasuk yang meragukan, yang mahal, dan yang
mungkin ternyata buruk. Menyaring pada tahap ide terlalu dini — gagasan yang
kelihatan lemah sering jadi pintu ke gagasan yang tidak lemah.

Aturannya: **tidak ada yang dihapus dari daftar ini**, hanya dipindahkan ke
"sudah dipertimbangkan dan ditolak" berikut alasannya.

### Kendali dan platform

- Ketuk arah di sekitar katak.
- Geser pendek satu lompat.
- Empat tombol layar besar.
- Gamepad.
- Peta tombol yang bisa diubah.
- Getaran saat terlindas atau tenggelam.
- Layar penuh dan kunci orientasi.
- Mode satu tangan: hanya maju dan menyamping.

### Melihat mesinnya

- Lapisan kotak tabrakan.
- Angka tabel laju sebelas jalur, dicetak di ujung tiap jalurnya.
- Arah tiap jalur sebagai panah.
- **Peragaan penggulung assembly**: animasi yang memperlihatkan geseran 8 piksel
  per bingkai yang dilakukan kode mesin yang disuntikkan program aslinya.
- Penampil makro `DRAW` dengan jejak pena langkah demi langkah.
- Gerak lambat dan langkah-per-langkah.
- Rekaman detik terakhir sebelum mati.

### Cara bermain yang lain

- Mode atraksi.
- Serangan waktu: lima rumah secepat mungkin.
- Mode tanpa batas waktu untuk berlatih.
- Mode satu jalur: berlatih satu jalur sulit berulang-ulang.
- Dua pemain bergantian.
- Dua katak di layar yang sama (kooperatif).
- Mode tanpa akhir dengan laju tetap.
- Penyunting jalur: susun sendiri urutan jalur dan kecepatannya.
- Mode terbalik: mulai dari rumah, kembali ke bawah.

### Angka dan riwayat

- Sebab kematian dicacah: terlindas / tenggelam / waktu habis / terbawa arus.
- Peta panas tempat kematian.
- Jalur mana yang paling sering mematikan.
- Rata-rata waktu tersisa saat rumah terisi.
- Riwayat beberapa permainan terakhir.
- Benih ditampilkan dan bisa dimasukkan.
- Rekaman masukan dan putar ulang deterministik.

### Berkas `.SCO`

- Impor berkas 1991 dengan menjatuhkannya ke halaman.
- Ekspor dalam format yang sama, lalu buka di DOSBox-X sebagai ujian.
- Tampilkan kedua papan skor berdampingan: milik 1991 dan milik pemain sekarang.
- Penampil heksa berkasnya, dengan penjelasan tiap medan.

### Suara

- Suara lompat, terlindas, tenggelam, rumah terisi.
- Nada peringatan saat waktu menipis.
- Pilihan senyap / efek / lengkap.

### Ketahanan

- Uji rendaman: beberapa ribu bingkai, periksa kendaraan **benar-benar bergerak**
  (dunia pernah membeku total dan itu tidak tertangkap uji apa pun).
- Pemeriksaan bahwa setiap `id` panel yang ditulis kode ada di HTML — cacat
  `s-level` yang hilang pernah mematikan seluruh gelung.
- Tangkap galat global, jangan telan.
- Simpan keadaan permainan.

### Rupa dan penyajian

- Palet CGA empat warna sebagai pilihan tema.
- Tapis CRT: garis pindai dan cahaya fosfor.
- Tekstur jalur: aspal, air beriak, kayu — bukan hanya warna.
- Percikan air saat tenggelam; serpihan saat terlindas.
- Jejak samar di belakang kendaraan cepat.
- Guncangan layar kecil saat terlindas.
- Variasi siang/malam per level.
- Peralihan antar-level.
- Perbesaran yang bisa dipilih; penskalaan piksel tegas versus halus.
- Animasi rumah terisi yang lebih terasa sebagai imbalan.

### Pengenalan bagi pemain baru

- Lapisan sekali-jalan: tombol dan tujuan.
- Petunjuk kontekstual: "jalur keenam tidak bergerak — itu tempat beristirahat".
- Mode latihan tanpa batas waktu dan tanpa nyawa.
- Mode satu jalur untuk melatih jalur tersulit.
- Penanda arah jalur yang lebih jelas bagi pemain baru, bisa dimatikan.

### Sudah dipertimbangkan dan ditolak

| Ide | Alasan ditolak |
|---|---|
| Makro `DRAW` sebagai aset gambar | sudah dicoba, hasilnya coretan; jadi bukti, bukan aset |
| `LAJU_MAKS` di atas ×5 | itu langit-langit dial aslinya |
| Kecepatan relatif terhadap laju bingkai | memutus kaitan dengan tabel laju yang dipulihkan |

---

Berkas terkait: [pakai](../games/hopper/index.html) ·
[ide aturan main & bahan asli](hopper-ide.md) · [dokumen port](hopper.md) ·
[port lain](3dttt-ide-port.md) · [spacewar](spacewar-ide-port.md) · [pacgal](pacgal-ide-port.md)
