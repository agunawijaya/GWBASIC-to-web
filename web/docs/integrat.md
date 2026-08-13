# INTEGRAT — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/INTEGRAT.BAS` — "Integral by Simpson's Rule" |
| Penulis | Phil Feldman & Tom Rugg, 1982 |
| Ukuran asli | 42 baris, **21% komentar** |
| Hasil port | [`../games/integrat/`](../games/integrat/index.html) |
| Analisis BASIC | [`../../reviews/INTEGRAT.md`](../../reviews/INTEGRAT.md) |

Program terpendek di koleksi yang mengerjakan sesuatu yang sungguh-sungguh
sulit — dan yang keputusan rancangannya paling berani.

---

## 1 · Fungsinya adalah bagian dari programnya

```basic
1970 REM ****
1980 REM **** Enter Subroutine At Line 2000
1990 REM ****
2000 REM **** Y=F(X) Goes Here ************
2999 RETURN
```

Fungsi yang mau diintegralkan **bukan masukan program**. Pemakai diharapkan
**menyunting baris 2000-an**, mengetik rumusnya sendiri, lalu menjalankan.

Dan program membuka dengan kotak berbingkai yang mengatakannya:

```
╔═══════════════════════════════╗
║          WARNING!             ║
║   The subroutine at lines     ║
║   2000-2999 is assumed to     ║
║ define Y as a function of X   ║
╚═══════════════════════════════╝
```

Dari sudut pandang sekarang ini terlihat aneh. Sebetulnya inilah **callback** —
hanya saja mekanismenya menyunting kode, karena BASIC tidak punya penunjuk
fungsi.

Rentang **2000–2999** yang dicadangkan adalah **kontrak antarmuka**: *"kode
Anda di sini, kode saya di luar sini."* Dan kotak berbingkai itu ada karena
kontrak tersebut **tidak bisa dipaksakan bahasanya** — satu-satunya penegaknya
adalah pemakai yang membacanya.

Idenya masih hidup di mana-mana:

| Sekarang | Kontraknya |
|---|---|
| `conftest.py` di pytest | "fixture Anda di berkas ini" |
| `Makefile` | "aturan Anda, perkakas saya" |
| blok `<script>` di HTML | "kode Anda di antara tag ini" |

Bedanya cuma: sekarang **bahasanya membantu memisahkan keduanya**, jadi
peringatan berbingkai itu tidak perlu dicetak lagi.

> **Pelajaran.** Kotak `WARNING!` itu bukan hiasan dan bukan kecemasan
> berlebihan — ia **penegak kontrak yang dikerjakan manusia**, karena tidak
> ada mekanisme lain. Tiap kali bahasa Anda tidak bisa menjamin sesuatu,
> jaminannya turun ke dokumentasi; dan dokumentasi hanya bekerja kalau
> ditaruh di tempat yang mustahil dilewati.

---

## 2 · Perulangan yang tidak pernah berhenti

```basic
440 PRINT N,A
450 N=N*2
460 GOTO 320     ' selamanya
```

Tidak ada syarat berhenti. Program menggandakan jumlah segmen **selamanya**,
mencetak satu baris tiap kali, sampai pemakai menekan Ctrl-Break.

Itu terdengar seperti kelalaian, dan mungkin memang bukan. Aturan Simpson
**mendekati** jawabannya, tidak pernah persis. Berhenti pada suatu ambang
berarti memutuskan berapa teliti "cukup teliti" — dan program ini memilih
**tidak memutuskan**, lalu menyerahkannya ke mata pemakai.

Angkanya berhenti berubah di digit yang Anda pedulikan; di situlah Anda
berhenti.

Port ini membatasi 20 langkah dan menyediakan tombol berhenti — bukan karena
aturannya berubah, melainkan karena halaman web tidak punya Ctrl-Break, dan
tab yang menggantung selamanya bukan perilaku yang jujur. Kolom **Selisih**
adalah tambahan: ia menunjukkan hal yang dulu harus dilihat sendiri dengan
membandingkan dua baris berturut.

---

## 3 · Bobot 1, 4, 2, 4, …, 4, 1

```basic
330 X=L:GOSUB 2000:T=T+Y     ' ujung kiri, bobot 1
340 X=U:GOSUB 2000:T=T+Y     ' ujung kanan, bobot 1
380 Z=Z+Y:NEXT:T=T+4*Z       ' titik GANJIL, bobot 4
420 NEXT:T=T+2*Z             ' titik GENAP, bobot 2
430 A=DX*T/3
```

Aturan Simpson mendekati kurva dengan **parabola**, bukan garis lurus — satu
parabola untuk tiap pasang segmen. Bobot 1–4–2–…–4–1 dibagi 3 adalah akibat
langsung dari itu.

Itu sebabnya jumlah segmennya **harus genap**, dan sebabnya program mulai dari
`N=2` lalu menggandakannya: menggandakan bilangan genap selalu menghasilkan
bilangan genap. Satu baris (`450 N=N*2`) menjaga syarat itu tanpa pernah
menyebutkannya.

Untuk kurva mulus, menggandakan segmen menurunkan galat sekitar **enam belas
kali** tiap baris. Diuji di port pada ∫4/(1+x²) dari 0 sampai 1 (jawabannya π):

| Segmen | Taksiran | Selisih |
|--:|---|--:|
| 4 | 3,14156862745 | 8,24e−3 |
| 8 | 3,14159250246 | 2,39e−5 |
| 16 | 3,14159265122 | 1,49e−7 |

Pada N = 16 sudah tepat sampai 2,4×10⁻⁹ dari π.

Coba **√x** dari 0: turunannya tak hingga di titik 0, dan selisihnya mengecil
**jauh lebih lambat**. Aturan Simpson mengandaikan kurvanya mulus, dan di situ
ia tidak — andaian yang tidak pernah tertulis di program mana pun.

---

## 4 · Penafsir sendiri, bukan `eval()`

Fungsi yang diketik pemakai harus dievaluasi puluhan ribu kali. `eval()` akan
bekerja — dan ia juga akan menjalankan **apa pun**, termasuk yang ditempel
orang lain lewat tautan.

Penafsir di `integrat.js` adalah turun-rekursif satu lintasan yang hanya
mengenal angka, `x`, tanda kurung, operator aritmetika, dan **daftar fungsi
yang tertutup**. Diuji:

| Masukan | Hasil |
|---|---|
| `alert(1)` | `fungsi tidak dikenal: alert` |
| `window.location` | `nama tidak dikenal: window` |
| `sinus(x)` | `fungsi tidak dikenal: sinus` |
| `sin(x` | `kurang tanda kurung tutup` |
| `2*x^3 - x + 1` | diterima |

Imbalan sampingannya: pesan galatnya lebih baik daripada `eval`. *"fungsi tidak
dikenal: sinus"* lebih berguna daripada *"sinus is not defined"* — karena
penafsirnya tahu ia sedang membaca **rumus**, bukan program.

Ini penambahan yang tidak punya padanan di aslinya; di 1982, "menyunting baris
2000" berarti Anda memang sedang menulis program, dan tidak ada batas yang
perlu dijaga.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Algoritma | Simpson, bobot 1-4-2-…-1 | — | **Dipertahankan baris demi baris** |
| Fungsi | disunting ke baris 2000-an (§1) | Tidak ada penunjuk fungsi | Kotak rumus + penafsir sendiri (§4) |
| Kotak `WARNING!` | digambar dengan `CHR$(201)` dkk | — | **Dipertahankan bentuknya** — ia satu-satunya hiasan, dan ia serius |
| Perulangan | tak berhenti, `GOTO 320` (§2) | Ctrl-Break sebagai jalan keluar | Dibatasi 20 langkah + tombol berhenti |
| Kolom selisih | tidak ada | — | **Ditambahkan**: menunjukkan apa yang dulu harus dilihat sendiri |
| Batas segmen | tak terbatas | — | 2²⁰; alasannya di §2 |
| Contoh siap pakai | tidak ada | Pemakai menulis fungsinya sendiri | Empat contoh, termasuk satu yang **melanggar** andaian mulus |

---

## 6 · Latihan

1. **Patahkan Simpson.** Integralkan `abs(x)` dari −1 sampai 1. Jawabannya
   tepat 1. Berapa segmen yang dibutuhkan untuk mencapai enam digit, dan kenapa
   jauh lebih banyak daripada `sin(x)`?

2. **Hitung bobotnya sendiri.** Turunkan aturan Simpson dari parabola yang
   melewati tiga titik. Dari mana angka 1, 4, 1 dan pembagi 3 datang?

3. **Tulis kontraknya hari ini.** Bagaimana Anda menyediakan "masukkan fungsi
   Anda di sini" pada 1982 tanpa menyuruh pemakai menyunting kode? Berapa baris
   yang dibutuhkan, dan apakah sepadan untuk program 42 baris?

4. **Ukur laju konvergensinya.** Untuk `sin(x)` dari 0 sampai π, catat selisih
   tiap langkah. Berapa perbandingan antarbaris? Cocokkan dengan ramalan
   teori h⁴.

---

Berkas terkait: [pakai](../games/integrat/index.html) ·
[SIMEQN](simeqn.md) · [CURVE](curve.md) — trio Feldman & Rugg
