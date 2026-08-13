# 3DTTT — ide pengembangan **port web**

Dokumen ini khusus tentang port webnya sebagai **perangkat lunak yang dipakai
orang**: bisa dimainkan di mana, dengan apa, dan seberapa tahan.

Ide yang menyangkut **kekuatan lawan komputer** — pemulihan penilai asli, deteksi
garpu, tolok ukur yang lebih galak — ada di [`3dttt-ide.md`](3dttt-ide.md) dan
tidak diulang di sini.

Rujukan: [dokumen port](3dttt.md)

---

## Keadaan sekarang — sisi port, terukur

| | |
|---|---|
| Menaruh bidak | **klik saja** — tidak ada padanan papan ketik |
| Panah papan ketik | **memutar papan**, bukan memindahkan pilihan |
| Sentuh | ketukan bekerja lewat `click`; seret untuk memutar lewat *pointer event* |
| `_shared/input.js` | **tidak dipakai** — padahal `tappable()` dibuat persis untuk papan seperti ini |
| Jeda | tidak ada (dan memang tidak perlu — permainan bergiliran) |
| Titik putus tata letak | `1080px` dan `620px` |
| `prefers-reduced-motion` | ditangani, termasuk mematikan denyut garis menang |
| Rekor | tersimpan lewat `store.js` |

Berbeda dari tiga port lain, hambatan terbesar di sini **bukan** sentuh — ketukan
sudah bekerja. Hambatannya papan ketik.

---

## Ide, diurutkan menurut nilainya

### 1. Bisa dimainkan tanpa tetikus

**Ini yang terbesar, dan yang paling khas port ini.**

Sekarang panah dipakai untuk **memutar papan**. Akibatnya tidak ada satu pun cara
menaruh bidak dari papan ketik: pemain yang tidak bisa memakai tetikus tidak bisa
bermain sama sekali.

Konfliknya harus diselesaikan dulu, dan ada tiga jalan:

| Jalan | Panah | Memutar |
|---|---|---|
| **A** | memindahkan pilihan | `Shift` + panah |
| **B** | memindahkan pilihan dalam satu lapis; `PgUp`/`PgDn` ganti lapis | tombol `[` `]` |
| **C** | tetap memutar | pilihan lewat `Tab` + `Enter` — 64 kali `Tab`, tidak manusiawi |

**A atau B**, jangan C. B lebih cocok dengan bentuk papannya: 4×4×4 secara alami
adalah empat lapis, dan berpindah lapis adalah gerakan yang memang perlu dipahami
pemain untuk melihat diagonal ruang.

`input.tappable()` sudah menyediakan separuh jawabannya — ia memberi `tabindex`,
menangani `Enter`/spasi, dan tetap bisa diketuk. Yang perlu ditambahkan cuma
perpindahan pilihan antar-sel.

**Ukuran berhasil:** satu permainan penuh diselesaikan tanpa menyentuh tetikus,
dan setiap sel terpilih diumumkan cukup jelas untuk diikuti tanpa melihat layar.

---

### 2. Papan yang bisa dibaca di layar sempit

Titik putus `620px` sudah ada, tapi papan 4×4×4 di layar ponsel punya masalah yang
lebih dalam daripada ukuran: **sel yang saling menutupi**. Memutar dengan seret di
layar kecil juga bertabrakan dengan gulir halaman.

Yang layak dicoba, dari yang paling murah:

- **Tampilan empat lapis berdampingan** sebagai pilihan selain tampilan 3D —
  di layar sempit ini hampir pasti lebih terbaca, dan ia juga membuat diagonal
  ruang bisa ditelusuri dengan mata.
- **Kunci gulir** selama jari berada di atas papan.
- **Tombol putar** yang sudah ada (`tegak`, `datar`) diperbesar di layar sentuh —
  memutar dengan tombol lebih tepat daripada dengan seret di ruang sempit.

---

### 3. Urungkan langkah, dan tonton ulang

Permainan bergiliran adalah tempat paling wajar untuk fitur ini, dan port ini
belum punya.

Nilai tambahnya khusus di sini: dokumen port mencatat **satu kekalahan dari 200
permainan**, dan sebabnya garpu — dua ancaman sekaligus. Permainan itu layak bisa
**ditonton ulang langkah demi langkah**. Sebuah fitur yang sekaligus jadi alat
bukti untuk klaim di dokumennya sendiri.

---

### 4. Pakai `_shared/input.js`

Selain `tappable()` untuk ide 1, `captureScroll()` menyelesaikan tabrakan antara
panah dan gulir halaman yang muncul begitu panah dipakai untuk memilih sel.

---

### 5. Tolok ukur sebagai bagian halaman, bukan tombol tersembunyi

Tombol **Ukur** adalah bagian paling jujur dari halaman ini — ia menjalankan 200
permainan dan menunjukkan angkanya. Yang bisa ditingkatkan murni sisi port:

- **jangan bekukan halaman** selama pengukuran; jalankan bertahap dengan kemajuan
  yang terlihat, atau di *worker* — 200 permainan penuh bukan pekerjaan sekejap;
- **simpan hasilnya** lewat `store.js`, supaya pembaca berikutnya melihat angka
  tanpa harus menjalankan ulang;
- **tampilkan sebaran**, bukan hanya total: kekalahan yang satu itu terjadi pada
  permainan ke berapa, dan dengan giliran pertama siapa?

---

### 6. Terbaca oleh lebih banyak orang

- **Dua pemain** dibedakan warna. Bedakan juga bentuknya — bulat lawan silang —
  supaya papan tetap terbaca bagi pemain buta warna. Ini murah dan langsung.
- **Garis menang** sudah disorot dengan cahaya; pada `prefers-reduced-motion`
  denyutnya dimatikan — periksa bahwa sorotannya sendiri masih cukup terlihat
  tanpa animasi, karena tanpa denyut ia tinggal bayangan.
- **`aria-live`** untuk giliran dan hasil, dan label sel yang menyebut
  koordinatnya, supaya papan bisa diikuti tanpa melihat.

---

## Yang sebaiknya TIDAK dikerjakan

- **Menaikkan kesulitan lawan tanpa menjalankan tolok ukurnya.** Klaim "sekarang
  lebih pintar" tidak boleh masuk halaman tanpa tabel menang/seri/kalah.
- **Animasi papan yang menutupi keadaan.** Papan ini sudah sulit dibaca; gerakan
  yang menghalangi pembacaan sel adalah kemunduran.
- **Menyembunyikan tombol Ukur.** Ia bukan alat pengembang; ia bukti.
- **Mengganti larik 5×5×5 di dalamnya jadi 4×4×4 "supaya bersih".** Keborosan itu
  temuannya — 61 sel terbuang supaya indeks bisa dipakai apa adanya.


---

## Gudang ide — belum disaring

Bagian di atas **diurutkan dan disaring**. Bagian ini tidak: ia menampung
sebanyak mungkin kemungkinan, termasuk yang meragukan, yang mahal, dan yang
mungkin ternyata buruk. Menyaring pada tahap ide terlalu dini — gagasan yang
kelihatan lemah sering jadi pintu ke gagasan yang tidak lemah.

Aturannya: **tidak ada yang dihapus dari daftar ini**, hanya dipindahkan ke
"sudah dipertimbangkan dan ditolak" berikut alasannya.

### Kendali dan platform

- Pilihan sel lewat panah, lapis lewat `PgUp`/`PgDn`.
- `input.tappable()` untuk tiap sel: ketuk, `Enter`, dan `tabindex` sekaligus.
- Tombol putar diperbesar di layar sentuh.
- Kunci gulir selama jari di atas papan.
- Gamepad.
- Layar penuh.

### Melihat papannya

- Tampilan empat lapis berdampingan sebagai pilihan selain 3D.
- Peta ke-76 garis, bisa disorot satu per satu.
- Sorot sel ancaman (yang menyelesaikan garis siapa pun).
- **Peta panas penilaian**: nilai penilai untuk tiap sel kosong, ditampilkan
  sebagai warna. Ini memperlihatkan isi kepala lawan komputer, bukan hasilnya.
- Sorot keempat diagonal ruang saja — 5,3% garis yang paling sering terlewat.
- Bentuk berbeda untuk kedua pemain, bukan hanya warna.
- Animasi perputaran yang bisa dimatikan.

### Cara bermain yang lain

- Urungkan langkah dan maju lagi.
- Putar ulang permainan langkah demi langkah — terutama **satu permainan yang
  kalah** dari 200.
- Tombol petunjuk (hint).
- Manusia lawan manusia di satu papan.
- Tingkat kesulitan, masing-masing menampilkan angka tolok ukurnya sendiri.
- Mode teka-teki: diberi posisi, cari langkah menang.
- Penyunting posisi.
- Buku pembukaan.
- Turnamen antar-varian penilai, dijalankan di halaman.
- Batas waktu per langkah.
- Papan 3×3×3 atau 5×5×5 sebagai percobaan (dengan penanda jelas bahwa aslinya
  4×4×4).

### Angka dan riwayat

- Tolok ukur dijalankan bertahap dengan kemajuan terlihat, bukan membekukan halaman.
- Hasil tolok ukur tersimpan, tidak perlu diulang tiap pembaca.
- Sebaran hasil: kekalahan terjadi pada permainan ke berapa, giliran pertama siapa.
- Bandingkan dua penilai berdampingan pada 200 permainan yang sama.
- Riwayat permainan pemain sendiri.
- Benih ditampilkan dan bisa dimasukkan.

### Suara

- Nada taruh bidak yang berbeda untuk kedua pemain.
- Nada kemenangan.
- Pilihan senyap.

### Ketahanan

- Tolok ukur di *worker* supaya halaman tidak membeku.
- Uji bahwa daftar 76 garis tetap berjumlah 76 sesudah perubahan apa pun.
- Uji bahwa penilai tidak pernah memilih sel terisi.
- Tangkap galat global.

### Rupa dan penyajian

- Bahan papan: kawat, kaca, balok padat.
- Proyeksi isometrik sebagai alternatif perspektif.
- Sudut perspektif yang bisa diatur.
- Label koordinat di tiap sel, bisa dimatikan.
- Palet CGA asli sebagai pilihan tema.
- Tapis CRT.
- Animasi bidak turun ke tempatnya.
- Garis menang digambar sebagai batang tembus papan, bukan hanya sorotan sel.
- Perbesaran papan yang bisa dipilih.
- Bayangan sel untuk memperjelas kedalaman.

### Pengenalan bagi pemain baru

- Lapisan sekali-jalan: cara memutar, cara menaruh.
- Peragaan singkat "inilah yang dimaksud diagonal ruang" — animasi satu garis
  menembus keempat lapis.
- Mode latihan melawan lawan acak.
- Tombol petunjuk yang menjelaskan **alasannya**, bukan hanya menunjuk sel.
- Papan 3×3×3 sebagai pemanasan sebelum 4×4×4.

### Sudah dipertimbangkan dan ditolak

| Ide | Alasan ditolak |
|---|---|
| Menaikkan kesulitan tanpa menjalankan tolok ukur | klaim kekuatan tanpa angka tidak boleh masuk halaman |
| Mengganti larik 5×5×5 jadi 4×4×4 | keborosannya adalah temuannya |
| Pilihan sel lewat `Tab` saja | 64 kali `Tab` bukan antarmuka |

---

Berkas terkait: [pakai](../games/3dttt/index.html) ·
[ide lawan komputer](3dttt-ide.md) · [dokumen port](3dttt.md) ·
[port lain](spacewar-ide-port.md) · [hopper](hopper-ide-port.md) · [pacgal](pacgal-ide-port.md)
