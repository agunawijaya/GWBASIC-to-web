# HOPPER — ide pengembangan selanjutnya

Dokumen ini bukan janji dan bukan rencana kerja. Isinya usulan berikut alasannya
dan cara menilainya.

> **Dokumen ini condong ke sisi bahan aslinya** — dekompilasi, pemulihan,
> dan aturan main. Ide yang murni tentang **port webnya sebagai perangkat
> lunak** (sentuh, papan ketik, tata letak layar kecil, aksesibilitas, uji)
> ada di [`hopper-ide-port.md`](hopper-ide-port.md).

HOPPER punya satu hal yang tidak dimiliki port lain: sebuah **berkas dari tahun
1991** yang formatnya sudah dibuktikan bisa dibaca dan ditulis ulang isi-identik.
Itu bahan yang belum dipakai sama sekali di halamannya.

Rujukan: [dokumen port](hopper.md) · [analisis dekompilasi](../../decompile/HOPPER/ARCHITECTURE.md)

---

## Keadaan sekarang

| | |
|---|---|
| Jalur | 11, kecepatannya dari tabel yang dibaca di dalam kode mesin |
| Tabel laju | `[1, -1, 2, -1, 2, 0, 1, -1, 2, -2, -1]` — yang keenam nol, strip tengah |
| Fase | main · gepeng · nyemplung · tuntas · usai |
| Level | naik saat kelima rumah terisi; laju `1 + kenaikan × (level−1)`, dibatasi ×5 |
| Panel | Skor · Nyawa · Waktu · Rumah terisi · Level · laju · Kecepatan jalur |
| Makro `DRAW` | ditafsirkan, tapi **hanya untuk melaporkan angka** — bukti, bukan aset |
| `HOPPER.SCO` | format sudah diperiksa dan **lulus isi-identik** — dan belum dipakai di web |

Batas laju ×5 bukan angka pilihan saya: itu **langit-langit dial aslinya**.

---

## Ide, diurutkan menurut nilainya

### 1. Hidupkan `HOPPER.SCO` di dalam peramban

**Status: pemulihan. Nilai tertinggi, dan tidak ada duanya di koleksi ini.**

`run/HOPPER.SCO` ditulis program aslinya pada **2 Agustus 1991**. Rekonstruksi
sudah membacanya, mengurutkannya, dan menulisnya kembali dengan isi **identik bita
demi bita** sampai penanda `0x1A` — 101 bita.

Itu berarti port webnya bisa:

- **menerima berkas `.SCO` yang dijatuhkan ke halaman** dan menampilkan papan skor
  1991 itu — nama, angka, apa adanya;
- **mengekspor** papan skor pemain sekarang dalam format yang sama, sehingga
  berkasnya bisa dikembalikan ke DOSBox dan dibaca program aslinya.

Yang kedua itu ujian yang bagus sekali: berkas keluaran peramban dibuka oleh
`HOPPER.EXE` di DOSBox-X. Kalau ia tampil benar, port ini terbukti berbicara
format aslinya — bukan sekadar meniru tampilannya.

Semuanya bisa dilakukan tanpa `fetch()`: `FileReader` + `Blob` bekerja di `file://`.

**Peringatan yang harus ikut ditulis:** klaimnya **isi-identik**, bukan
berkas-identik. Berkas aslinya 128 bita; selisih 27 bita itu padding nol dari DOS,
dan itu **satu sampel** — belum cukup untuk digeneralkan. Jangan menulis "identik"
tanpa kualifikasi itu.

---

### 2. Ruang pamer makro `DRAW`

**Status: pemulihan, sebagai pameran.**

Enam string `DRAW` byte-identik dengan deskriptor di biner:

```
S4$ = "C3F3DFD2GDGL2H2UE2G3HBD2D0GBU2LHU2E4RE"     katak
S5$ = "C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF2"     batang kayu
```

Versi pertama port ini menggambar hasilnya langsung ke layar, dan hasilnya buruk —
sprite CGA 11 × 10 piksel ditumpangkan sebagai garis tipis di atas kotak sebesar
jalur. Keputusan yang diambil sesudah itu benar dan **tidak perlu diulang**.

Yang belum ada: tempat untuk **melihat** makro itu sebagaimana mestinya. Panel
terpisah yang menggambar sprite 11 × 10 diperbesar, dengan **jejak pena
langkah demi langkah** — `U D L R` lurus, `E F G H` diagonal, `B` pindah tanpa
menggambar — mengubah bukti jadi sesuatu yang bisa dipahami tanpa membaca kode.

Bonusnya: adanya `E F G H` sebagai perintah tersendiri itu sendiri sebuah temuan,
dan jauh lebih mudah dijelaskan lewat animasi pena daripada lewat paragraf.

---

### 3. Anotasi 84 bita sisa rutin penggulung

**Status: pertanyaan dekompilasi yang masih terbuka.**

Perilakunya **sudah diukur** — di emulator ia menggeser jalur 8 piksel mendatar
sekali per bingkai, dan offset 5–15 di dalamnya adalah tabel kecepatan 11 jalur.
Yang belum: anotasi baris per baris sesudah offset 144.

Nilainya untuk halaman web sedang saja, karena logikanya **tidak pernah membaca
VRAM** — sudah diukur dengan kait pada tiap pembacaan dari `B800` selama 150 juta
instruksi: 21.873 pembacaan, **nol dari kode pengguna**. Itulah yang membolehkan
port webnya mengganti penggulung dengan animasi biasa tanpa mengubah aturan.

Jadi kerjakan ini untuk kelengkapan dokumen, bukan karena halamannya butuh.

---

### 4. Kurva kesulitan yang lebih dari sekadar laju

**Status: rekonstruksi — dan harus ditandai begitu.**

Naik level sekarang mengubah **dua** hal, bukan satu:

| | Sekarang |
|---|---|
| Laju | `1 + kenaikan × (level−1)`, dibatasi **×5** |
| Waktu per nyawa | `maks(45, 90 − 5 × (level−1))` detik |

Keduanya punya lantai/langit-langit, jadi sesudah beberapa level kesulitan
**berhenti naik sama sekali**. Batas ×5 itu asli dan tidak boleh dilewati, jadi
ruang yang tersisa ada di tempat lain:

- **rumah yang sudah terisi tertutup**, sehingga jalur yang tersisa makin sempit;
- **kepadatan kendaraan** naik walau lajunya tetap;
- **celah antar-kendaraan** menyempit — mengubah pola, bukan kecepatan.

Ketiganya rekonstruksi. Kalau dipasang, tulis di tabel penyimpangan bahwa aslinya
hanya menaikkan laju sampai langit-langit dial.

**Yang tidak boleh:** menaikkan `LAJU_MAKS` di atas ×5. Angka itu terbaca dari
program aslinya; melewatinya berarti berhenti memerankan program ini.

---

### 5. Mode "lihat mesinnya"

**Status: tambahan, bersifat penjelas.**

Panel sudah menampilkan kecepatan jalur. Langkah berikutnya: lapisan yang bisa
dinyalakan dan memperlihatkan **kotak tabrakan**, arah tiap jalur, dan angka tabel
laju tepat di ujung jalurnya masing-masing.

Alasannya bukan gaya. Salah satu cacat tersulit di port ini dulu adalah katak yang
**digambar 6 piksel di bawah** tempat tabrakannya dihitung — apa yang terlihat
tidak sama dengan apa yang dihitung. Lapisan seperti ini membuat cacat golongan itu
terlihat seketika, bukan sesudah dilaporkan pemain.

---

### 6. Papan skor yang tidak hilang

**Status: tambahan.** Skor sekarang tersimpan lokal. Kalau ide 1 dikerjakan,
keduanya sebaiknya berbagi satu bentuk data, supaya papan skor peramban dan berkas
`.SCO` 1991 itu benar-benar hal yang sama — bukan dua daftar yang kebetulan mirip.

---

## Yang sebaiknya TIDAK dikerjakan

- **Memakai makro `DRAW` sebagai aset gambar lagi.** Sudah dicoba, hasilnya buruk,
  dan alasannya sudah ditulis. Pelajarannya: kesetiaan menang untuk dokumen, tidak
  untuk sesuatu yang dimainkan.
- **Menaikkan `LAJU_MAKS` di atas ×5.** Lihat ide 4.
- **Mengubah kecepatan jadi relatif terhadap laju bingkai.** Kecepatan di port ini
  mutlak, terikat tabel yang dipulihkan; menjadikannya relatif akan membuat
  permainan berbeda di mesin yang berbeda dan memutus kaitannya dengan tabel itu.
- **Membuang fase.** Kelima fase itu lahir dari cacat nyata: dulu permainan
  langsung membeku saat rumah kelima terisi, karena tidak ada keadaan yang mewakili
  "sedang menyelesaikan level".


---

## Gudang ide — belum disaring

Bagian di atas diurutkan dan disaring. Bagian ini tidak. Sebagian pertanyaan di
bawah mungkin **tidak bisa dijawab** dengan bahan yang ada — itu bukan alasan
untuk tidak menuliskannya. Pertanyaan yang tercatat bisa dijawab orang lain, atau
oleh alat yang belum ada.

### Melanjutkan dekompilasi

- 200 panggilan (27%) belum bernama — porsi terbesar dari ketiga permainan BASIC.
- Anotasi 84 bita sisa rutin penggulung sesudah offset 144.
- Tahun programnya tidak diketahui; berkas `.SCO` bertanggal 1991, tapi itu
  tanggal berkas, bukan tanggal program.
- Rumus skor: terbaca atau diperkirakan?
- Batas waktu: terbaca dari biner, atau dipilih port?
- Apakah aslinya punya level sama sekali, atau hanya satu putaran?
- Apakah kecepatan jalur berubah antar-level di aslinya?
- Makro `DRAW` untuk benda selain katak dan batang kayu — enam sudah ketemu,
  apakah itu semuanya?
- Aturan tabrakan: dibaca dari koordinat, dan sudah dipastikan tidak membaca layar.
  Tapi toleransinya berapa?

### Berkas `.SCO`

- Cari **sampel kedua**. Klaim padding nol sekarang berdiri di atas satu berkas.
- Apa yang terjadi kalau berkasnya rusak? Apakah program aslinya menolak dengan
  anggun?
- Berapa banyak entri maksimum yang muat?
- Apakah ada medan yang belum dipahami di dalam 101 bita itu?

### Yang lebih spekulatif

- Suntikan assembly ke dalam BASIC adalah teknik yang layak dokumennya sendiri:
  siapa lagi di koleksi 83 program ini yang melakukannya?
- Bandingkan dengan Frogger asli — jumlah jalur, kecepatan, jumlah rumah — untuk
  melihat seberapa dekat program ini meniru.
- Jalankan biner di emulator dan bandingkan pola lalu lintas dengan port pada
  benih yang sama.

---

Berkas terkait: [pakai](../games/hopper/index.html) ·
[dokumen port](hopper.md) ·
[analisis dekompilasi](../../decompile/HOPPER/ARCHITECTURE.md) ·
[ide port lain](3dttt-ide.md) · [spacewar](spacewar-ide.md) · [pacgal](pacgal-ide.md)
