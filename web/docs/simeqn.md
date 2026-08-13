# SIMEQN — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/SIMEQN.BAS` — "A SIMULTANEOUS LINEAR EQUATION SOLVER" |
| Penulis | Phil Feldman & Tom Rugg, 1982 |
| Ukuran asli | 50 baris; **baris terpanjang 50 kolom** — terpendek di koleksi |
| Hasil port | [`../games/simeqn/`](../games/simeqn/index.html) |
| Analisis BASIC | [`../../reviews/SIMEQN.md`](../../reviews/SIMEQN.md) |
| Peran | menetapkan `_shared/gauss.js`, dipakai bersama [CURVE](curve.md) |

Eliminasi Gauss dengan pivot parsial, dalam lima puluh baris.

---

## 1 · "Any BASIC, any CRT."

```basic
130 REM: Any BASIC, any CRT.
```

Satu kalimat, dan ia menjelaskan seluruh bentuk program ini. Perkakas bahasa
yang dipakainya: `BEEP`, `SWAP`, `DEFINT`, `STRING$`, `COLOR`. Itu saja.

Tidak ada `LOCATE`, tidak ada `SCREEN 1`, tidak ada `PEEK`/`POKE`, tidak ada
`ON KEY` — bandingkan dengan program Friendlyware mana pun di koleksi ini,
yang penuh `LOCATE` dan `POKE 106,0`.

Feldman & Rugg membatasi diri pada **irisan bahasa yang ada di semua mesin**,
supaya programnya bisa diketik ulang dari majalah di Apple II, TRS-80, atau
IBM PC tanpa satu pun perubahan.

Bukti disiplin itu ada di angkanya: **baris terpanjangnya 50 kolom** —
terpendek di seluruh koleksi. Lebar layar terkecil yang mungkin ditemuinya
adalah 40 kolom, dan ia tidak pernah jauh melewatinya.

> **Pelajaran.** Portabilitas bukan hal yang ditambahkan; ia hal yang
> **tidak dilakukan**. Program ini portabel karena penulisnya menolak
> memakai hampir semua yang tersedia — dan menuliskan penolakan itu sebagai
> komentar di baris ketiga, supaya penyunting berikutnya tahu aturannya.

---

## 2 · `DEFINT` sebagai konvensi matematika

```basic
150 CLEAR:CLS:DEFINT J,K,L,M,N
    DIM A(N,N),R(N),V(N)
```

Lima huruf dijadikan bilangan bulat; `A`, `R`, `V` dibiarkan pecahan karena
berisi koefisien.

Itu bukan penghematan memori — itu **konvensi matematika** (i, j, k untuk
indeks) yang dipetakan ke sistem tipe BASIC. Pembaca yang melihat `J` langsung
tahu ia indeks, bukan koefisien, tanpa melacak dari mana asalnya.

`SWAP` di baris 470–480 juga bukan hiasan: pivot parsial **adalah** pertukaran
baris, dan BASIC kebetulan punya satu kata untuk itu.

---

## 3 · Pembagian dengan nol yang tidak pernah diperiksa

```basic
500 Q=A(M,K)/A(K,K)
```

Tidak ada satu pun baris yang memeriksa apakah `A(K,K)` bernilai nol.

Pivot parsial (baris 410–480) memilih baris dengan nilai mutlak **terbesar**,
dan itu menyelamatkan hampir semua kasus. Tapi kalau seluruh kolomnya nol —
sistem yang **singular**, misalnya dua persamaan yang sebenarnya sama — maka
yang terbesar pun nol.

| Di mana | Apa yang terjadi |
|---|---|
| GW-BASIC 1982 | `Division by zero`, program berhenti |
| JavaScript | `Infinity` lalu `NaN` — **tampak seperti jawaban** |

Karena itu pemeriksaannya **ditambahkan** di port ini, ditandai jelas sebagai
tambahan di `_shared/gauss.js`.

> **Pelajaran.** Ini bukan "aslinya ceroboh". Di BASIC, pembagian dengan nol
> **berhenti**, dan berhenti adalah perilaku yang jujur. Yang berubah bukan
> kodenya melainkan **bahasanya**: JavaScript memilih melanjutkan dengan
> `NaN`, dan diam itulah yang berbahaya. Kode yang dipindahkan antarbahasa
> mewarisi keputusan bahasa barunya, bukan yang lama.

---

## 4 · Dua puluh satu baris yang sama, di dua program

| | |
|---|---|
| `SIMEQN.BAS` | baris 390–590 |
| `CURVE.BAS` | baris 780–980 |

**Sama persis, kata demi kata**, hanya berbeda nomor barisnya. Feldman & Rugg
menulis satu penyelesai persamaan linear, lalu menyalinnya ke program kedua.

Bukan karena malas — karena **tidak ada cara lain**. BASIC 1982 tidak punya
`INCLUDE`, tidak punya pustaka, tidak punya modul. Yang ada cuma `CHAIN`, dan
itu *mengganti* seluruh program, bukan menambahkan bagian.

Di port ini keduanya memanggil `_shared/gauss.js`. Itu satu-satunya perbedaan
struktural yang berarti antara versi 1982 dan versi ini — dan ia **bukan
perbaikan atas penulisnya, melainkan atas bahasanya**.

Perhatikan juga apa yang *tidak* mereka lakukan: menyederhanakan salah satu
salinan. Kedua salinan tetap identik, sampai ke pivot parsialnya, meski CURVE
sebenarnya cuma butuh matriks kecil dan simetris. Menjaga dua salinan tetap
sama adalah disiplin, dan disiplin itu yang membuat temuannya bisa dipastikan
empat puluh tahun kemudian.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Algoritma | Gauss + pivot parsial | — | **Dipertahankan langkah demi langkah** |
| Penyelesai | disalin ke dua program (§4) | Tidak ada modul di BASIC | Satu `_shared/gauss.js` |
| Masukan | `INPUT` N²+N kali berturut, tanpa bisa mundur | Tidak ada tetikus, tidak ada tata letak | Kisi yang semuanya terlihat sekaligus |
| Pembagian nol | tidak diperiksa (§3) | Bahasanya berhenti sendiri | **Diperiksa** — bahasanya tidak berhenti lagi |
| Substitusi mundur | `V(M)` ditulis ulang di dalam perulangan `J` | `NEXT:NEXT` di satu baris | Penugasan dipindah ke luar; hasilnya sama, pembacanya tidak perlu menghitung |
| Nama jawaban | `X1`…`Xn`, mulai dari satu | — | Dipertahankan |
| Pemeriksaan hasil | tidak ada | — | **Ditambahkan**: A·x dimasukkan kembali, sisanya ditampilkan |
| Tampilan | `PRINT` + `TAB` saja (§1) | Baris 130 | Kepolosannya ditiru, bukan tampilannya |

---

## 6 · Latihan

1. **Buat pivot parsialnya gagal.** Susun sistem 3×3 yang benar tapi membuat
   eliminasi tanpa pivot meledak. Lalu susun satu yang membuat pivot parsial
   pun tidak menolong.

2. **Ukur harganya.** Untuk n persamaan, berapa perkalian yang dikerjakan
   eliminasi Gauss? Bandingkan dengan aturan Cramer untuk n = 3, 5, 10.

3. **Cari salinan ketiganya.** Dua program di koleksi ini berbagi penyelesai
   yang sama. Telusuri sisanya: adakah blok lain yang muncul dua kali di dua
   program berbeda?

4. **Kembalikan `NEXT:NEXT`.** Tulis ulang substitusi mundur persis seperti
   baris 570–590. Buktikan hasilnya sama, lalu hitung berapa penugasan
   tambahan yang dikerjakannya untuk n = 8.

---

Berkas terkait: [pakai](../games/simeqn/index.html) ·
[CURVE — pemakai kedua penyelesai yang sama](curve.md) ·
[INTEGRAT](integrat.md) — trio Feldman & Rugg
