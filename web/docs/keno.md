# KENO — dari BASIC 1984 ke web

| | |
|---|---|
| Sumber | `run/KENO.BAS` — "PC KENO by Steve Schlich 9/84" |
| Penulis | Steve Schlich, September 1984 |
| Ukuran asli | 137 baris |
| Hasil port | [`../games/keno/`](../games/keno/index.html) |
| Analisis BASIC | [`../../reviews/KENO.md`](../../reviews/KENO.md) |

Program terpendek di sesi ini, dan yang temuannya paling tajam.

Petunjuknya sendiri membuka dengan kalimat yang jarang ditulis pembuat
permainan tentang permainannya sendiri:

```basic
9010 PRINT"KENO has the worst odds of any casino game.  The `house' (in this case,"
9020 PRINT"your computer) draws 20 random numbers from 1 to 80 for each game."
```

Rumah menarik 20 angka dari 80. Pemain menebak 1 sampai 11 angka lebih dulu.
Yang cocok dihitung. Itu seluruh permainannya — dan tiga hal yang ditemukan di
bawahnya masing-masing lebih besar daripada permainannya.

---

## 1 · Hanya ada enam puluh undian yang mungkin

```basic
630 T$=RIGHT$(TIME$,2)   ' DETIK saja
640 T=VAL(T$)
650 RANDOMIZE T
...
1090 GOTO 630            ' tiap permainan baru menyemai ULANG
```

Benihnya detik pada jam: **0 sampai 59**. Dan baris 1090 mengembalikan alur ke
630 setiap permainan baru, jadi penyemaiannya diulang setiap kali.

Karena `RANDOMIZE` dengan benih yang sama mengembalikan pengacak ke keadaan
yang sama, akibatnya:

> **Dua puluh angka yang ditarik rumah sepenuhnya ditentukan oleh detik saat
> undian dimulai.**

Ada **enam puluh** undian yang mungkin di seluruh riwayat program ini, dan ia
akan mengulanginya selamanya. Siapa pun yang mencatat keenam puluhnya sekali
bisa menang setiap kali, tinggal melirik jam.

Pola `RANDOMIZE VAL(RIGHT$(TIME$,2))` ini bukan hal baru di koleksi ini — ia
muncul di [MAXIT1](maxit1.md), [MASTER](master.md), dan dua program lain. Yang
membuatnya berbeda di sini adalah **apa yang bergantung padanya**:

| Program | Yang ditentukan benih 60-nilai | Akibat |
|---|---|---|
| [MAXIT1](maxit1.md) | tata letak papan | papan berulang, permainan tetap adil |
| [MASTER](master.md) | deret rahasia | dua permainan pada detik sama = rahasia sama |
| **KENO** | **undian rumah** | **seluruh permainannya bisa dihafal** |

Dan pembandingnya ada di disket yang sama: [CRAZY8](crazy8.md) menyambung
menit *dan* detik, dan mendapat 3.600. Tidak ada satu komentar pun yang
menjelaskan kenapa yang satu berbeda dari yang lain.

> **Pelajaran.** Mutu pengacak bukan sifat program; ia sifat *keputusan yang
> bergantung padanya*. Benih yang cukup baik untuk mengacak tata letak papan
> adalah benih yang menghancurkan permainan judi. Pertanyaannya bukan
> "seberapa acak?", melainkan "apa yang akan dilakukan orang kalau ia bisa
> menebaknya?"

Port ini menyemai dari `crypto.getRandomValues` — lihat
[fondasi §2.6](_fondasi.md).

---

## 2 · Bayaran yang dijanjikan dan tidak pernah ditulis

```basic
9050 PRINT"will come up.  Your payoff (if there is one) depends on the ratio between"
9060 PRINT"how many spots you picked and how many came up during the game."
```

Tidak ada **satu baris pun** di seluruh 137 baris yang menghitung bayaran.
Yang ditampilkan di akhir permainan hanya ini:

```basic
890 PRINT"               Spots matched:";MATCHES;
```

Tidak ada taruhan, tidak ada saldo, tidak ada tabel bayaran. Permainan judi
tanpa uang di dalamnya.

Kurung *"if there is one"* di baris 9050 ternyata harfiah. Kita tidak bisa
tahu apakah rencananya batal, apakah kalimat itu disalin dari selebaran kasino
sungguhan, atau apakah penulisnya memang cuma ingin menunjukkan peluangnya —
tapi ketiga kemungkinan itu sama menariknya, dan tidak satu pun bisa diketahui
dari kodenya.

**Port ini tidak menambahkan tabel bayaran.** Menambahkannya berarti mengarang
aturan yang tidak pernah ada; dan yang menarik dari program ini justru bahwa
aturan itu *tidak* ada.

---

## 3 · Pencacah `FOR` yang diubah dari dalam perulangannya sendiri

```basic
660 FOR D1=1 TO 20
670 CHOICE=INT(RND*80)+1
680 IF CHOSEN(CHOICE)<>1 THEN 700
690 D1=D1-1: GOTO 740      ' mundurkan pencacah, lalu lompat ke NEXT
700 CHOSEN(CHOICE)=1
...
740 NEXT D1
```

Angka yang sudah keluar ditolak. Cara mengulangnya: **memundurkan pencacah
`FOR`-nya sendiri** satu langkah, lalu melompat ke `NEXT` yang akan
menaikkannya kembali. Hasil bersihnya nol, jadi putaran itu diulang.

Ini cerdik, dan jalan di GW-BASIC. Tapi ia bergantung pada satu hal yang tidak
dijamin bahasa mana pun: bahwa `NEXT` membaca variabelnya **saat itu juga**,
bukan memakai salinan yang disimpan saat `FOR` dimulai.

Di penyusun yang menyimpan pencacah di register — yang dilakukan hampir semua
penyusun modern — baris 690 tidak akan berpengaruh apa-apa, dan undiannya akan
berisi angka kembar. Programnya tetap **jalan**; ia cuma jadi salah, diam-diam.

> **Pelajaran.** Bug yang paling sulit dipindahkan antarbahasa bukan yang
> membuat program berhenti. Yang berhenti akan Anda temukan dalam lima menit.
> Yang berbahaya adalah yang tetap jalan dengan hasil yang **hampir** benar.

### Berapa mahal cara tolak-dan-ulangnya?

Halaman port menyediakan tombol yang mengukurnya. Harapan teoretisnya:

```
Σ (i=0..19) 80/(80−i) ≈ 22,85 undian untuk 20 angka
```

Diukur atas 5.000 permainan: **22,82** — cocok sampai 0,1%. Pemborosannya
hanya **14%**, jauh lebih ringan daripada di [CRAZY8](crazy8.md) yang
membuang delapan kali lipat, karena di sini papannya empat kali lebih besar
daripada yang diambil. Cara yang sama, harga yang sangat berbeda, dan yang
menentukan bukan caranya melainkan rasio "yang diambil" terhadap "yang
tersedia".

---

## 4 · Dua larik yang tertukar namanya

```basic
120 FOR C1=1 TO 71 STEP 10: ROW(C1)=16   ' 16 itu KOLOM layar
220 FOR C1=1 TO 10:         COL(C1)=2    ' 2 itu BARIS layar
...
840 LOCATE COL(C1),ROW(C1)               ' LOCATE menerima (baris, kolom)
```

`ROW()` menyimpan kolom layar; `COL()` menyimpan barisnya. Namanya tertukar,
dan baris 840 menukarnya kembali saat dipakai — jadi programnya **benar**.

Ini jenis kesalahan yang paling awet, justru karena ia tidak pernah salah
hasil: tidak ada yang memaksanya diperbaiki. Yang ia rusak hanya pembaca
berikutnya, yang harus membuktikan sendiri bahwa kekacauan itu disengaja
sebelum berani menyentuhnya.

Delapan puluh angka dipetakan lewat **enam belas perulangan `FOR` terpisah**
(baris 120–290): delapan untuk kolom, delapan untuk baris. Di port ini
letaknya diurus satu baris `grid-template-columns: repeat(10, 1fr)`, dan
keenam belas perulangan itu hilang seluruhnya.

---

## 5 · Peluang yang sebenarnya — satu-satunya penambahan

Aslinya **menyatakan** "worst odds of any casino game" tapi tidak pernah
**menunjukkannya**. Port ini menghitungnya, dari rumus:

```
P(m cocok | k spot) = C(k,m) × C(80−k, 20−m) / C(80,20)
```

Ini distribusi hipergeometrik — pengambilan tanpa pengembalian.
`C(80,20) ≈ 3,5 × 10¹⁸` ada di atas batas bilangan bulat aman JavaScript, jadi
dihitung lewat logaritma faktorial. Angka di tabel **eksak**, bukan hasil
simulasi.

Dua hal yang langsung terlihat begitu angkanya ada di layar:

**Harapan jumlah cocok selalu `spot ÷ 4`,** apa pun angka yang dipilih. Memilih
"angka keberuntungan" tidak mengubah apa pun — tiap angka punya peluang 20/80
yang sama untuk keluar.

**Solid-11 adalah 1 banding 62.381.978.** Untuk perbandingan, solid-8 adalah
1 banding 230.115. Kedua angka itu cocok dengan tabel keno yang diterbitkan
kasino sungguhan, yang berarti rumusnya benar dan aturan 1984 ini memang aturan
keno sungguhan.

Ini **penambahan**, bukan pemulihan — dan dinyatakan begitu di tabel §6. Ia
ditambahkan karena kalimat pembuka penulisnya adalah sebuah klaim, dan klaim
yang bisa diperiksa lebih baik diperiksa daripada diulangi.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Aturan | 20 dari 80, pemain pilih 1–11 | — | **Dipertahankan persis**, termasuk batas 11 yang tidak lazim |
| Bayaran | **tidak ada**, meski dijanjikan petunjuk | — | **Tetap tidak ada** (§2). Menambahkannya berarti mengarang aturan |
| Papan | dibelah 1–40 / judul / 41–80 | Layar 80×25, judul butuh tempat | **Dipertahankan** — tidak ada alasan teknisnya lagi, tapi justru itu yang membuatnya terlihat seperti papan KENO *ini* |
| Letak angka | 16 perulangan `FOR`, dua larik tertukar nama (§4) | Tidak ada tata letak selain `LOCATE` | Satu `grid-template-columns` |
| Memilih spot | `INPUT` jumlah dulu, lalu satu per satu | Tidak ada tetikus | Klik langsung; jumlahnya jadi akibat, bukan pertanyaan di depan |
| Spot kembar | **tidak diperiksa** — mengetik "7" dua kali menghabiskan dua jatah, menandai satu kotak | — | Tidak mungkin terjadi lagi: klik kedua membatalkan pilihan |
| Undian | tolak-dan-ulang lewat `D1=D1-1` (§3) | `RND` murah, tidak ada larik acak | Pengambilan tanpa pengembalian. Biaya cara aslinya bisa **diukur** lewat tombol |
| Benih | detik saja — 60 undian yang mungkin (§1) | Tidak ada entropi selain jam | `crypto.getRandomValues` |
| Jeda antarangka | `FOR J=1 TO 400: NEXT J` | Tidak ada pewaktu | Penggeser kecepatan; lihat [fondasi §2.2](_fondasi.md) |
| Tiga warna keadaan | `COLOR 0,3` / `0,7` / `16,5` + legenda baris 510 | Enam belas warna teks | Dipertahankan sebagai tiga keadaan, dengan legenda yang sama katanya |
| Peluang | diklaim, tidak dihitung | — | **Ditambahkan** (§5) — satu-satunya penambahan di halaman ini |
| Keluar | `LOAD"MENU",R` | Tiap program berkas terpisah | Tautan kembali di bilah atas |

---

## 7 · Latihan

1. **Hafalkan enam puluh undian.** Kalau Anda punya program aslinya dan
   sabar, catat undian untuk tiap detik 0–59. Berapa lama sampai Anda bisa
   menang setiap kali? Apa yang harus diubah penulisnya — satu baris —
   supaya itu mustahil?

2. **Pindahkan bug `FOR`-nya.** Tulis ulang baris 660–740 dalam bahasa yang
   Anda pakai sehari-hari, sesetia mungkin. Apakah `D1=D1-1` masih
   berpengaruh? Kalau tidak, berapa angka kembar yang muncul dalam 1.000
   undian?

3. **Rancang tabel bayarannya.** Pakai peluang di §5 untuk menyusun tabel
   bayaran yang membuat keunggulan rumah tepat 25% — angka yang mendekati
   keno sungguhan. Berapa yang harus dibayar untuk solid-8?

4. **Uji klaimnya.** "Worst odds of any casino game." Bandingkan harapan
   pengembalian keno dengan rolet Amerika (5,26%) dan mesin slot. Apakah
   klaim 1984 itu benar?

5. **Cari dua larik tertukar lainnya.** Nama yang berlawanan dengan isinya
   tidak pernah membuat program salah, jadi ia tidak pernah dilaporkan.
   Telusuri satu program lain di koleksi ini dan cari satu.

---

Berkas terkait: [mainkan](../games/keno/index.html) ·
[CRAZY8 — tolak-dan-ulang yang jauh lebih mahal](crazy8.md) ·
[MAXIT1](maxit1.md) · [MASTER](master.md) ·
[fondasi §2.6 — keacakan](_fondasi.md)
