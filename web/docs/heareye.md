# HEAREYE — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/HEAREYE.BAS` — *"Hearing And Eye Test"* |
| Penerbit | Friendlyware PC Introductory Set, 1982 |
| Ukuran asli | 117 baris |
| Hasil port | [`../games/heareye/`](../games/heareye/index.html) |
| Analisis BASIC | [`../../reviews/HEAREYE.md`](../../reviews/HEAREYE.md) |

Dua alat kesehatan rumahan: kartu mata Snellen dari aksara blok CGA, dan sapuan
nada 100–30.000 Hz lewat pengeras suara PC. Keduanya membuka dengan peringatan
yang sama — *"This test is not a replacement for regular visits to your
doctor."*

---

## 1 · Sembilan jebakan tombol yang tidak melakukan apa-apa

```basic
1080 ON KEY(1) GOSUB 1180
 …          (sembilan baris)
1160 ON KEY(9) GOSUB 1180
1170 FOR A=1 TO 9:KEY(A) ON:NEXT
1180 RETURN
```

Sembilan tombol fungsi dijebak, dan penanganannya **kosong**. Sekilas ini
terlihat seperti tombol mundur yang sengaja dimatikan.

Bukan itu sebabnya.

Di GW-BASIC, <kbd>F1</kbd>…<kbd>F9</kbd> punya **makro bawaan**: F1 mengetik
`LIST`, F2 `RUN`, F3 `LOAD"`. `KEY OFF` di baris 10 cuma menyembunyikan
tampilannya di baris 25 — makronya **tetap mengetik**. Program ini membaca
masukan lewat `INKEY$`, jadi tanpa jebakan itu menekan F1 akan menumpahkan
huruf `L-I-S-T` ke dalam uji.

Jadi penangan kosong bukan "tidak jadi dibuat": **pekerjaannya memang tidak
melakukan apa-apa**. Menjebak adalah cara mematikan makronya.

Perhatikan juga baris 1180 melayani dua peran sekaligus: ia `RETURN` untuk
`GOSUB 1080` **dan** badan kesembilan penangan itu. Satu baris, dua tugas, nol
komentar.

> **Pelajaran.** Kode yang tampak seperti kelalaian sering kali penanganan
> sesuatu yang tidak terlihat lagi. Sembilan `ON KEY` kosong itu tidak masuk
> akal sampai Anda tahu bahwa tombol fungsi GW-BASIC **mengetik sendiri** —
> pengetahuan yang hilang bersama platformnya. Menyimpulkan "ini sengaja
> dimatikan" dari bentuknya saja akan salah.

---

## 2 · Satu angka yang mengubah alat ukur

```basic
950 FOR I=100 TO 30000 STEP 100
960   SOUND I,J
970   IF I=14000 THEN J=10
980   B$=INKEY$:IF B$<>"" THEN 1000
990 NEXT I
```

`J` adalah **panjang** tiap nada dalam tik pencacah PC (1/18,2 detik). Ia mulai
dari 1, dan berubah jadi **10** begitu sapuan mencapai 14.000 Hz — sepuluh kali
lebih *lambat*, bukan lebih cepat.

| Bagian sapuan | Langkah | Waktu |
|---|--:|--:|
| 100 – 14.000 Hz (1 tik) | 139 | 7,6 dtk |
| 14.000 – 30.000 Hz (10 tik) | 161 | 88,5 dtk |
| **Bagian di atas 14 kHz** | | **92% waktunya** |

Alasannya ada di layar sebelumnya, baris 810: *"most people will lose the tone
near 15,000 cycles per second"*.

Sapuan itu **melambat tepat sebelum jawabannya** — supaya pendengar punya waktu
menyadari nadanya hilang, dan supaya frekuensi yang dilaporkan punya resolusi
di rentang yang penting.

Satu angka, satu baris, dan ia mengubah alat ukur kasar jadi alat ukur yang
berguna. Tidak ada komentar yang menyebutnya.

### Kerapuhannya

`IF I=14000` memakai **sama dengan**, bukan lebih besar. Ia benar hanya karena
14.000 tepat kelipatan `STEP 100` dan sapuan mulai dari 100. Ubah langkahnya
jadi 3, dan ambangnya tidak akan pernah kena — uji akan berjalan 300 langkah
cepat dan tidak ada yang tahu kenapa hasilnya jadi kasar.

> **Pelajaran.** Perbandingan persis pada pencacah adalah ranjau yang meledak
> jauh dari tempatnya dipasang. `>=` di sini akan sama benarnya dan tidak
> bergantung pada apa pun.

---

## 3 · "Stand back 20 feet from the screen"

Baris 300 menyuruh berdiri 20 kaki dari layar; baris 350 menjanjikan mata
normal bisa membaca baris `20/20`.

**Itu tidak bisa benar.** Ukuran aksara di layar teks tergantung ukuran
*fisik* monitornya: aksara pada monitor 12 inci dan 25 inci sama-sama satu sel
80×25, tapi tingginya berbeda dua kali lipat. Jarak 20 kaki hanya sah untuk
*satu* ukuran layar, dan program tidak pernah menanyakannya.

Kartu Snellen cetak tidak punya masalah ini — ia dicetak pada ukuran tertentu,
sekali, selamanya. **Memindahkannya ke layar membuang justru sifat yang membuatnya
alat ukur.**

### Yang dilakukan port ini

Ukurannya **ditanyakan**, dengan benda yang ukurannya sama di seluruh dunia:
kartu ATM, 85,6 mm menurut ISO/IEC 7810 ID-1. Dari situ didapat piksel per
milimeter, tinggi optotipe 20/20 diukur dari yang **benar-benar tergambar**,
dan jarak baca yang benar dihitung terbalik dari definisinya — optotipe 20/20
menghadang **5 menit busur** pada jarak ujinya.

Hasil nyata di layar uji:

| Penyetelan | Tinggi optotipe | Jarak yang benar |
|---|--:|--:|
| bilah acuan 400 px | 5,7 mm | **3,9 m** (13,0 kaki) |
| bilah acuan 200 px | 11,5 mm | **7,9 m** (25,9 kaki) |

Dua-duanya bukan 20 kaki. Itu sebabnya angka aslinya tidak bisa dipertahankan
diam-diam.

> **Pelajaran.** Alat ukur yang dipindah ke media baru harus membawa
> kalibrasinya, bukan angkanya. Menyalin "20 kaki" ke layar adalah menyalin
> *hasil* kalibrasi yang syaratnya sudah tidak berlaku.

---

## 4 · Ketika aksara blok kehabisan resolusi

Tujuh baris kartu, dan tekniknya **berubah tiga kali** saat hurufnya mengecil:

| Baris | Digambar dari |
|---|---|
| `20/50` | blok penuh `█` + separuh `▐ ▌ ▄ ▀` |
| `20/40` – `20/20` | hanya `█ ▀ ▄`, makin sedikit sel |
| `20/15` | separuh blok dalam **satu** baris teks |
| `20/10`, `20/5` | **huruf sungguhan**: `U` `∩` `n` `u` |

Dua baris terakhir bukan gambar lagi — mereka **huruf yang diketik**. Di bawah
ukuran itu, satu sel aksara tidak bisa lagi dibagi jadi bentuk, jadi penulisnya
berhenti menggambar dan mulai mengetik.

Konsistensinya tetap terjaga: `U` dan `∩` (`CHR$(239)`) adalah bentuk yang sama
diputar 180° — persis peran yang dimainkan huruf `E` terbalik-balik di kartu
Snellen sungguhan, di mana yang diuji adalah **arah**, bukan pengenalan huruf.

> **Pelajaran.** Batas alat memaksa perubahan teknik, dan penulisnya menyerah
> pada waktu yang tepat. Memaksakan blok sampai baris terakhir akan
> menghasilkan bentuk yang tidak terbaca — dan itu merusak **ujinya**, bukan
> cuma rupanya. Konsistensi teknik bukan tujuan; konsistensi *fungsi* iya.

---

## 5 · Di atas 20 kHz, port ini berhenti jujur

Sapuan aslinya sampai 30.000 Hz. Web Audio mencuplik pada 44.100 Hz, jadi nada
di atas **22.050 Hz** (batas Nyquist) tidak bisa dihasilkan — yang keluar adalah
bayangannya di frekuensi lain, bukan nadanya.

Jadi bagian sapuan itu **ditandai berarsir** di layar, dan tidak diklaim
sebagai pengukuran. Arsir dipilih, bukan warna lain: warna lain membaca sebagai
"kategori lain", arsir membaca sebagai "tidak sah".

Aslinya juga sudah jujur soal ini, di baris 830: *"we had no way to evaluate the
capacity of the speaker"* — mereka tahu batasnya ada di perangkat keras, dan
menuliskannya di layar.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Dua uji | dipilih dari menu, masing-masing alur **maju-saja** | tidak ada mesin halaman | Satu urutan **lima halaman** dengan tombol mundur dan rel lompat — **tambahan**, keputusan pemakai koleksi ini, sesi 15 |
| Tombol mundur | **tidak ada** | — | **Ditambahkan**, dan dinyatakan begitu di panel *Cara memakai* |
| Sembilan `ON KEY` kosong | mematikan makro tombol fungsi (§1) | GW-BASIC | **Tidak diport** — peramban tidak punya makro tombol fungsi. Dijelaskan sebagai temuan |
| Kartu Snellen | aksara blok CGA (§4) | layar teks 80×25 | **Dipertahankan persis**, kisi 80×25 warna per sel |
| "20 feet" | angka tetap (§3) | tidak bisa tahu ukuran layar | **Diganti perhitungan**: kalibrasi kartu ATM → jarak yang benar dihitung. Angka aslinya tetap ditampilkan sebagai pembanding |
| Sapuan nada | `SOUND I,J`, `J` berubah di 14 kHz (§2) | pengeras suara PC | **Dipertahankan persis**, termasuk 1 dan 10 tik dan tik 1/18,2 detik |
| Di atas 22.050 Hz | dibunyikan | — | **Tidak dibunyikan**, ditandai berarsir (§5) |
| Sesudah uji selesai | `GOTO 10` — program memulai dirinya kembali | tidak ada cara mengosongkan keadaan | Kembali ke halaman, keadaan tidak perlu dibuang |
| Peringatan dokter | baris 270–290, 740–760 | — | **Dipertahankan apa adanya**, di dalam layar |

---

## 7 · Latihan

1. **Hitung ulang jaraknya.** Untuk monitor Anda sendiri, ukur lebar layar
   dalam sentimeter, lalu hitung jarak baca yang benar untuk baris 20/20.
   Berapa jauh dari 20 kaki?

2. **Perbaiki ambangnya.** Ganti `IF I=14000` dengan bentuk yang tidak
   bergantung pada nilai `STEP`. Apa yang berubah kalau `STEP` jadi 3?

3. **Cari batas teknik.** Pada baris ke berapa aksara blok berhenti bisa
   dipakai, dan kenapa tepat di sana? Hitung berapa sel yang tersisa untuk
   satu optotipe di tiap baris.

4. **Uji arahnya.** `U` dan `∩` adalah pasangan terbalik. Berapa banyak
   pasangan terbalik lain yang tersedia di CP437, dan mana yang akan Anda pilih
   untuk baris kedelapan kalau ada?

---

Berkas terkait: [pakai](../games/heareye/index.html) ·
[INTRO — kerangka yang sama](intro.md) ·
[SPACE §2 — teknik XOR pada layar](space.md)
