# CURVE — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/CURVE.BAS` — "LEAST SQUARES CURVE FITTING" |
| Penulis | Phil Feldman & Tom Rugg, 1982 |
| Ukuran asli | 89 baris |
| Hasil port | [`../games/curve/`](../games/curve/index.html) |
| Analisis BASIC | [`../../reviews/CURVE.md`](../../reviews/CURVE.md) |

Pencocokan kurva kuadrat terkecil: diberi titik-titik (x, y), cari polinom
berderajat d yang paling dekat dengan semuanya.

---

## 1 · Baris 780–980 adalah baris 390–590 SIMEQN

Sama persis, kata demi kata. Dua puluh satu baris eliminasi Gauss yang
disalin-tempel — karena BASIC 1982 tidak punya satu pun cara berbagi kode
antarprogram.

Ceritanya lengkap di [SIMEQN §4](simeqn.md). Di port ini keduanya memanggil
`_shared/gauss.js`.

---

## 2 · Matriks yang dibangun dari jumlah indeksnya

Ini bagian yang layak dibaca pelan-pelan, karena ia menjelaskan kenapa program
*pencocokan kurva* membutuhkan *penyelesai persamaan* sama sekali.

Kita mencari koefisien yang meminimalkan jumlah kuadrat sisa. Turunan terhadap
tiap koefisien disamakan nol, dan hasilnya sistem (d+1) persamaan — **persamaan
normal**. Matriksnya cuma butuh jumlah pangkat x:

```basic
450 FOR J=1 TO D2:P(J)=0:FOR K=1 TO NP
460 P(J)=P(J)+X(K)^J:NEXT:NEXT:P(0)=NP      ' P(j) = Σ x^j
510 FOR J=1 TO N:FOR K=1 TO N:A(J,K)=P(J+K-2)
```

Baris 510 adalah intinya: **`A(j,k) = P(j+k−2)`**. Tiap elemen ditentukan oleh
*jumlah indeksnya saja* — matriks Hankel.

Akibatnya seluruh matriks (d+1)×(d+1) dibangun dari **2d+1 angka**, bukan dari
(d+1)². Untuk derajat 7: 15 jumlah pangkat, bukan 64 elemen. Dan tiap `P(j)`
cuma satu sapuan atas data.

Itulah kenapa seluruh kuadrat terkecil polinomial muat di 89 baris: ia bukan
soal matriks, ia soal **menjumlahkan pangkat**.

---

## 3 · "Percent Goodness of Fit" bukan R²

```basic
600 T=100*SQR(1-T/G)
```

`T` jumlah kuadrat sisa, `G` jumlah kuadrat simpangan terhadap rata-rata. Jadi
`1−T/G` adalah **R²** — dan yang dicetak adalah **akarnya**, dikali seratus.
Yaitu |R|, koefisien korelasi.

| R² sebenarnya | Yang dicetak |
|--:|--:|
| 0,81 | **90,0** |
| 0,64 | **80,0** |
| 0,25 | **50,0** |

Angkanya **selalu terdengar lebih bagus** daripada yang sebenarnya, dan tidak
ada satu pun baris di program yang menyebut nama besaran itu.

Bukan kesalahan hitung — keduanya besaran yang sah. Yang hilang cuma
**namanya**.

> **Pelajaran.** Angka tanpa nama tidak bisa diperiksa. Pembaca yang melihat
> "Percent Goodness of Fit = 90" tidak punya cara tahu apakah itu R², |R|,
> atau sesuatu yang lain — dan karena terdengar seperti persentase, ia akan
> dibaca sebagai "90% cocok". Halaman port menampilkan keduanya berdampingan.

---

## 4 · Grafik yang tidak boleh ada

```basic
130 REM: Any BASIC, any CRT.
```

Aslinya **tidak punya grafik sama sekali**. Grafik berarti `SCREEN 1`, dan
`SCREEN 1` tidak ada di semua mesin — jadi baris 130 melarangnya.

Gantinya adalah mode *"Determine specific points"* (baris 690–730): ketik X,
dapat Y, satu per satu. Itulah cara "melihat" kurva pada 1982 — dengan
mengintipnya lewat lubang kunci, satu titik pada satu waktu.

Grafik di halaman port adalah **penyimpangan**, dan alasannya: seluruh guna
mencocokkan kurva adalah melihat apakah kurvanya masuk akal, dan mata
mengerjakan itu dalam sekejap sementara tabel angka butuh menit. Mode aslinya
tetap disediakan di bawah grafik.

Satu tambahan yang bukan sekadar hiasan: **garis sisa** — jarak tegak tiap
titik ke kurvanya, digambar putus-putus merah. Itulah besaran yang dikuadratkan
dan dijumlahkan; memperlihatkannya berarti memperlihatkan **apa yang sedang
diminimalkan**, bukan cuma hasilnya.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Persamaan normal | `A(j,k) = P(j+k−2)` (§2) | — | **Dipertahankan persis** |
| Penyelesai | disalin dari SIMEQN | Tidak ada modul di BASIC | `_shared/gauss.js` |
| Batas data | 100 pasang, derajat 0–7 | `DIM X(100)`, `DIM A(8,8)` | **Dipertahankan keduanya** |
| Penanda akhir data | ketik `999,999` | `INPUT` tidak punya akhir | Kotak teks punya akhir sendiri; `999,999` **tetap dikenali** untuk data 1982 yang disalin |
| Grafik | **tidak ada** (§4) | Baris 130 | **Ditambahkan**, dengan garis sisa |
| "Goodness of fit" | akar R² tanpa nama (§3) | — | Keduanya ditampilkan, dengan namanya |
| Pesan galat | `** ERROR! **` dengan `COLOR 23` berkedip | — | Kata-katanya dipertahankan; kedipannya tidak |
| Mode titik tunggal | baris 690–730 | Satu-satunya cara "melihat" kurva | Dipertahankan, di bawah grafik |

---

## 6 · Latihan

1. **Lihat overfitting.** Pakai data contoh dan naikkan derajat sampai 7.
   Pada derajat berapa kurvanya mulai mengejar derau alih-alih polanya? Apa
   yang terjadi pada "Goodness of Fit" di saat yang sama?

2. **Hitung ulang §3.** Dari data contoh derajat 1, catat R² dan angka yang
   dicetak. Buktikan bahwa yang kedua adalah 100 kali akar yang pertama.

3. **Rusak matriks Hankelnya.** Ubah baris 510 jadi `A(J,K)=P(J+K-1)`. Untuk
   derajat berapa hasilnya masih terlihat masuk akal? Itu ukuran betapa
   halusnya kesalahan indeks di sini.

4. **Bandingkan ongkosnya.** Untuk 100 titik dan derajat 7: berapa perkalian
   untuk membangun `P()`, dan berapa untuk menyelesaikan sistem 8×8? Mana yang
   mendominasi?

---

Berkas terkait: [pakai](../games/curve/index.html) ·
[SIMEQN — penyelesai yang sama](simeqn.md) ·
[INTEGRAT](integrat.md) — trio Feldman & Rugg
