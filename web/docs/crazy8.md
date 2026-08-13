# CRAZY8 — dari BASIC 1986 ke web

| | |
|---|---|
| Sumber | `run/CRAZY8.BAS` — "C R A Z Y   E I G H T S" |
| Penulis | Les Davids, 1986 |
| Ukuran asli | 294 baris (bernomor 1000–3940) |
| Hasil port | [`../games/crazy8/`](../games/crazy8/index.html) |
| Analisis BASIC | [`../../reviews/CRAZY8.md`](../../reviews/CRAZY8.md) |
| Peran | pengguna kedua `_shared/cards.js` sesudah [SOLITAIR](solitair.md) |

Crazy Eights lawan komputer, sampai 100 poin.

Program ini punya **struktur terbaik di seluruh koleksi**: 294 baris dengan
hanya delapan `GOTO`. Rasio lompatan terendah untuk program sebesar ini, dan
itu bukan kebetulan — ia hasil dari dua keputusan yang bisa ditunjuk barisnya.

Sekaligus ia mengandung tiga hal yang tidak boleh ditiru: cara mengocok yang
membuang delapan kali lipat undian, sebuah bug salin-tempel yang membuat satu
kartu tidak pernah bisa dimainkan, dan satu jalan sempit yang membuat program
berhenti dengan `Out of DATA`.

---

## 1 · Kenapa hanya delapan `GOTO`

Dua sebab, dan keduanya keputusan sadar.

**Pertama, `WHILE`/`WEND`.** Perulangan dinyatakan sebagai perulangan:

```basic
1570 WHILE+ SORTTEST
1580 SORTTEST=0
1590 FOR I=1 TO PCARDS-1
...
1640 WEND
```

Bandingkan dengan program lain di koleksi yang sama, yang menyatakan hal yang
sama sebagai `IF ... THEN <nomor baris>` mundur. Perbedaannya bukan gaya: loop
yang ditulis sebagai `GOTO` tidak punya batas yang bisa dilihat mata, sehingga
setiap pembaca harus melacaknya sendiri.

> Catatan kecil: `WHILE+ SORTTEST` bukan salah ketik. Itu `WHILE +SORTTEST` —
> tanda plus uner, yang tidak melakukan apa-apa. Ia muncul tiga kali (1570,
> 2570, 2900), jadi ia kebiasaan penulisnya, bukan kecelakaan.

**Kedua, subrutin dibagi menurut tanggung jawab.** Dan penulisnya menamai
sendiri tiap bagian lewat komentar:

| Baris | Nama dari penulisnya | Peran |
|---|---|---|
| 2500–2850 | `shuffle routine` | data |
| 2860–3150 | `computer section` | kecerdasan |
| 3460–3630 | `create figure` | tampilan |
| 3380–3450 | `print a card` | tampilan |

Satu untuk data, satu untuk kecerdasan, dua untuk tampilan. Itu pemisahan
yang sama dengan **model–view–controller**, ditemukan sendiri pada 1986 oleh
orang yang hampir pasti belum pernah mendengar istilahnya.

Perhatikan juga baris 1010–1050: `DIM`-nya dikelompokkan menurut peran, tiap
kelompok dengan komentarnya. Itu peta data program, ditulis di tempat yang
akan dibaca lebih dulu.

---

## 2 · Mengocok dengan menolak dan mengulang

```basic
2580 NUMBR=100*RND
2590 IF NUMBR > 52 THEN 2580     ' 48% langsung dibuang
2600 IF NUMBR = 0  THEN 2580
2610 IF TEST(NUMBR) = 1 THEN 2580 ' sudah terpakai, ulangi
2620 TEST(NUMBR) = 1
2630 DECK(COUNT) = NUMBR
```

Ambil angka acak 0–99. Kalau di luar 1–52, buang. Kalau sudah terpakai, buang.
Ulangi sampai 52 tempat terisi.

Ini **benar secara statistik** — tiap urutan dek sama peluangnya, tidak ada
kartu yang lebih sering di depan. Yang salah bukan hasilnya, melainkan
harganya, dan harganya naik justru saat pekerjaannya hampir selesai: untuk
kartu terakhir, peluang satu undian berhasil tinggal **1 dari 100**.

Harapan jumlah undian untuk 52 kartu:

```
100 × H(52) = 100 × (1 + 1/2 + … + 1/52) ≈ 454
```

Halaman port menyediakan tombol yang mengukurnya, bukan mengklaimnya —
1.000 pengocokan, dihitung di tempat. Hasil pengukurannya **452,8**, cocok
dengan ramalan teori sampai 0,3%.

### Tiga program, tiga cara mengocok

Ini cara ketiga di koleksi ini, dan ketiganya gagal dengan cara berbeda:

| Program | Cara | Biaya untuk 52 kartu |
|---|---|---|
| [SOLITAIR](solitair.md) | tukar ke ujung — Fisher–Yates | **52** |
| [MAXIT1](maxit1.md) | larik menyusut, geser sisanya | O(n²) — n(n−1)/4 ≈ **663** pergeseran |
| **CRAZY8** | tolak dan ulang | **~454 undian** |

Yang penting dinyatakan: **ketiganya menghasilkan pengocokan yang sah.** Tidak
ada yang berat sebelah, tidak ada urutan yang lebih mungkin daripada yang
lain. Yang berbeda cuma ongkosnya.

> **Pelajaran.** "Benar" dan "layak" adalah dua pertanyaan terpisah, dan
> menjawab yang pertama tidak membebaskan Anda dari yang kedua. Ketiga
> penulis ini menjawab pertanyaan pertama dengan benar; hanya satu yang
> menyadari ada pertanyaan kedua.

---

## 3 · Menggambar ulang hanya yang berubah

```basic
1710 IF PHAND$(I)=OLDHAND$(I) THEN 1770  ' lewati, tidak berubah
1720 OLDHAND$(I)=PHAND$(I)
1730 THE$=PHAND$(I): GOSUB 3460          ' bangun gambarnya
1740 COL=1+(6*(I-1)): GOSUB 3380         ' cetak ke layar
```

Satu kartu digambar sebagai kisi 5×5 karakter (`FIG$(5,5)`), dicetak dengan
dua puluh lima pasang `LOCATE`+`PRINT`. Enam belas kartu berarti **empat
ratus**, tiap kali layar disegarkan, di mesin yang mencetak karakter satu per
satu ke memori layar.

Jadi penulisnya menyimpan salinan tangan yang *sedang tergambar* —
`OLDHAND$` — dan melewati kartu yang tidak berubah. Dalam satu giliran
biasanya hanya satu kartu yang berbeda.

Namanya sekarang **dirty checking**, dan itu gagasan yang sama persis dengan:

- [LIFE2](life2.md), yang hanya menyentuh sel yang berubah keadaannya;
- kerangka kerja antarmuka mana pun yang Anda pakai hari ini.

Halaman port menghitung perbandingannya secara hidup, dari keadaan yang sama
dengan yang menggambar tangannya — jadi angkanya tidak bisa melenceng dari
apa yang benar-benar terjadi.

### `FIG$(5,5)`: gambar dibangun dari data

Kartu tidak disimpan sebagai 52 gambar jadi. Satu rutin (`create figure`,
3460–3630) merakit ulang kisi 5×5-nya dari nama kartu, jadi satu rutin
melayani seluruh dek. Bandingkan dengan `CRAPS.BAS`, yang menyimpan gambar
dadunya sebagai string jadi.

Ongkosnya muncul di satu tempat, dan penulisnya menyelesaikannya dengan
cara yang paling tidak enak — baris terpanjang di seluruh program (140 kolom),
seluruhnya untuk menangani kartu **10** yang butuh dua digit:

```basic
3660 IF MID$(THE$,1,1)=" " THEN FIG$(2,2)=MID$(THE$,2,1): FIG$(4,4)=FIG$(2,2) ELSE FIG$(2,2)="1": FIG$(2,3)="0": FIG$(4,3)="1":FIG$(4,4)="0"
```

Kasus khusus di tengah rutin umum. Itu tempat yang paling mahal untuk
menaruhnya, karena setiap pembaca rutin gambar sekarang harus memahami soal
"10" juga.

---

## 3b · Huruf yang menunjuk kartu yang salah

```basic
2150 IF IN$="e" THEN IN=14
2160 IF IN$="e" THEN IN=15   ' baris yang sama, nilai berbeda
```

Dua baris berurutan menguji huruf yang **sama**. Yang kedua menimpa yang
pertama, jadi `e` selalu bernilai 15. Hampir pasti baris 2160 hasil salin
baris 2150 yang lupa diubah hurufnya.

Akibatnya berantai. Kartu ke-7 sampai ke-16 diberi label `7 8 9 A B C D E F G`
di layar (baris 1870–1940), tapi masukannya hanya memetakan `a`–`e`:

| Label di layar | Tombol | Kartu yang terpilih |
|---|---|---|
| A B C D | `a b c d` | 10, 11, 12, 13 — benar |
| E | `e` | **15**, bukan 14 |
| F, G | — | **tidak bisa dipilih** |

Jadi kartu ke-14 tidak pernah bisa dimainkan, dan menekan `e` membuang kartu
yang tertulis `F` di layar. Baris 2170 (`IF IN$<"a" OR IN$>"e"`) menolak `f`
dan `g` sebagai *"WRONG CARD"*.

Seberapa sering ini terasa? Tangan hanya membesar kalau pemain terus
mengambil kartu tanpa bisa membuang — jadi bug ini menyerang **tepat pada
saat pemain sedang paling terdesak**, dan tampak seperti permainannya yang
tidak adil, bukan seperti kesalahan pengetikan.

Di port ini kartu diklik langsung, jadi masalahnya lenyap tanpa satu aturan
pun berubah.

---

## 3c · Dek yang habis bisa merusak ronde berikutnya

Ini yang paling halus, dan satu-satunya di halaman ini yang **ditelusuri dari
kode, bukan dari menjalankan program**.

Nama dan rupa kartu hanya dibangun pada ronde pertama:

```basic
2660 IF PSCORE<>0 OR CSCORE<>0 THEN 2810   ' sudah pernah, lewati
2670 DATA "c","d","h","s"
2680 FOR I=1 TO 4: READ SUIT$(I): NEXT I
2710 DATA " A"," 2"," 3"," 4"," 5"," 6"," 7"
2720 DATA " 8"," 9","10"," J"," Q"," K"
2730 FOR I = 1 TO 4
2740   FOR J = 1 TO 13
2760     READ CARD$(N)
2780   NEXT J
2790   RESTORE 2710          ' dijalankan juga sesudah putaran KEEMPAT
2800 NEXT I
```

Penghematannya masuk akal. Yang luput adalah satu jalan yang membuat skor
tetap 0–0 saat masuk ronde kedua: **dek habis sebelum ada yang menang.**
Baris 2030 dan 3220 melompat ke 3850, yang me-reset `TEST()` dan langsung
memulai ronde baru **tanpa menghitung skor sama sekali**.

Ronde berikutnya masuk lagi ke 2670 — tapi penunjuk `DATA` sekarang ada di
awal baris 2710, ditinggalkan oleh `RESTORE` terakhir. Yang terbaca:

| `READ` | Seharusnya | Yang didapat |
|---|---|---|
| `SUIT$(1..4)` | `"c" "d" "h" "s"` | `" A" " 2" " 3" " 4"` |
| `CARD$(1..13)` | 13 nama kartu | 9 tersisa, lalu habis |

Hasilnya **`Out of DATA in 2760`** — program berhenti.

Syaratnya sempit: 35 kartu pengambilan harus habis sebelum salah satu tangan
kosong. Itu jarang, tapi tidak mustahil — dan justru kelangkaannya yang
membuatnya bertahan: cacat yang muncul satu kali dari seratus permainan
terbaca sebagai "komputernya ngadat", bukan sebagai bug yang bisa dilaporkan.

Port ini membangun deknya ulang tiap ronde, jadi tidak ada penunjuk yang bisa
tertinggal. Ronde yang kehabisan dek berhenti dengan bersih, mengatakannya,
dan melanjutkan tanpa skor — persis yang **dimaksudkan** baris 3850.

---

## 3d · Benih yang justru lebih baik daripada tetangganya

```basic
2520 TIM$=MID$(TIME$,4,2)       ' menit
2530 TIM$=TIM$+MID$(TIME$,7,2)  ' + detik
2540 SEED=VAL(TIM$)
```

Menit **dan** detik, disambung jadi satu bilangan: **3.600 benih** yang
mungkin.

Bandingkan dengan `RANDOMIZE VAL(RIGHT$(TIME$,2))` — detik saja, **60 benih** —
yang muncul di [MAXIT1](maxit1.md), [MASTER](master.md), dan dua program lain
di koleksi ini. CRAZY8 enam puluh kali lebih baik daripada tetangganya di
disket yang sama.

Yang menarik: **tidak ada satu komentar pun yang menyebutkan bahwa itu
disengaja.** Kita tidak tahu apakah penulisnya memikirkan mutu benih, atau
kebetulan menyambung dua bidang waktu karena itu yang ada di tangannya.

Tetap tidak cukup, tentu saja: 3.600 kemungkinan melawan 52! urutan dek.
Port ini menyemai dari `crypto.getRandomValues` — lihat
[fondasi §2.6](_fondasi.md).

---

## 4 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Aturan main | dicetak sendiri di baris 1120–1270 | — | **Dipertahankan persis**, termasuk As = 15 (tidak lazim di Crazy Eights modern, dan justru karena itu tidak diubah) |
| Pembagian kartu | berselang-seling, `J=1+((I-1)*2)` | — | Dipertahankan persis |
| Urutan keputusan komputer | warna → angka → 8 → ambil → lewat | — | **Dipertahankan persis**, dan alasannya ditampilkan hidup di layar |
| Warna yang diumumkan komputer saat main 8 | kartu pertama di tangan, baris 3250 | Tangan diurutkan menurut huruf warna | Dipertahankan — ini aturan main komputernya, bukan bug (§4b) |
| Pengocokan | tolak-dan-ulang, ~454 undian | `RND` murah, `SWAP` belum terpikir | Fisher–Yates. Cara aslinya bisa **diukur** lewat tombol, bukan cuma dibaca |
| Benih | menit+detik, 3.600 kemungkinan | Tidak ada entropi selain jam | `crypto.getRandomValues` |
| Memilih kartu | tombol `1`–`9`, lalu `a`–`e` | Tidak ada tetikus | Klik langsung — bug §3b lenyap tanpa aturan berubah |
| Gambar kartu | `FIG$(5,5)`, dirakit dari data | Layar teks 80×25 | `_shared/cards.js`, prinsip yang sama: dibangun dari data, bukan 52 gambar jadi |
| Gambar ulang | hanya yang berubah (`OLDHAND$`) | 400 `PRINT` per penyegaran | **Dipertahankan sebagai gagasan**, dan perbandingannya ditampilkan (§3) |
| Warna aktif | disimpan di dalam `UPCARD$` sendiri | Satu string menyimpan kartu *dan* warna berlaku | **Dipisah** jadi dua data — lihat di bawah |
| Dek habis | lompat ke 3850, bisa merusak ronde berikutnya (§3c) | — | **Diperbaiki**: ronde berhenti bersih, dek dibangun ulang |
| Urut tangan | bubble sort pada huruf warna | — | Dipertahankan — urutannya ikut menentukan langkah komputer |
| Bunyi | `PLAY` per kartu saat mengocok, `SOUND 400,5` pada kartu terakhir | — | Dipertahankan |
| Nama pemain | `INPUT "NAME "` | — | Tidak ditanyakan; tidak ada yang memakainya selain papan skor |

### Kenapa "warna yang berlaku" dipisah dari kartu buangan

Aslinya menyimpan keduanya di satu string. Saat sebuah 8 dimainkan:

```basic
2360 MID$(IN$,3,1)=MID$(S$,1,1)   ' ganti huruf warna DI DALAM kartunya
2380 UPCARD$ = IN$
```

Kartunya tetap 8, tapi huruf warnanya ditimpa. Hemat, dan untuk keperluan
pemeriksaan aturan hasilnya benar.

Yang hilang adalah **kejujuran tampilan**: layar menggambar `UPCARD$`, jadi
sesudah sebuah 8 pemain melihat kartu 8 dengan lambang warna yang bukan warna
kartu itu. Di layar teks satu warna, itu tidak terlalu terasa. Di halaman
yang menggambar kartu sungguhan, itu akan terbaca sebagai kesalahan gambar.

Port ini menyimpan dua data — kartu teratas, dan warna yang berlaku — dan
menampilkan keduanya berdampingan. Petak *suit* di sebelah tumpukan ada
justru karena keduanya **boleh berbeda**, dan perbedaan itu muncul tepat pada
saat permainan paling menentukan.

### 4b · Kenapa AI-nya tidak diperbaiki

Baris 3250 memilih warna yang diumumkan dari kartu pertama di tangan:

```basic
3250 IF IN=1 THEN S$=MID$(CHAND$(2),3,1) ELSE S$=MID$(CHAND$(1),3,1)
```

Karena tangan diurutkan menurut huruf warna (`c` < `d` < `h` < `s`), "kartu
pertama" berarti **"keriting kalau punya, kalau tidak wajik, …"** — bukan
warna terbanyak, bukan warna terkuat. Heuristik yang jelas lebih baik ada dan
mudah: umumkan warna yang paling banyak Anda pegang.

Itu tidak dilakukan, dan alasannya aturan proyek ini: **yang diperbaiki hanya
bug, dan ini bukan bug.** Komputer bermain lemah — tapi ia bermain lemah
dengan cara yang sama persis seperti 1986, dan itu yang sedang dilestarikan.
Yang wajib adalah menyatakannya, bukan menyembunyikannya.

Satu hal yang **memang** ditangani: kalau delapan itu satu-satunya kartu di
tangan komputer, aslinya membaca `CHAND$(2)` yang kosong dan `MID$` tidak
mengubah apa pun — warnanya tetap warna delapan itu sendiri. Port ini
melakukan hal yang sama, dengan tulisan yang menyatakannya.

---

## 5 · Latihan

1. **Ukur cara mengocoknya sendiri.** Tombol di halaman menjalankan 1.000
   pengocokan cara 1982. Ubah `100*RND` jadi `53*RND` di kepala Anda: berapa
   undian yang dihemat? Apakah hasilnya masih sah?

2. **Cari batas atasnya.** Tolak-dan-ulang tidak punya batas waktu — secara
   teori ia bisa berjalan selamanya. Hitung peluang satu pengocokan butuh
   lebih dari 1.000 undian. Apakah angka itu cukup kecil untuk dipercaya?

3. **Perbaiki AI-nya.** Ubah pilihan warna komputer jadi "warna terbanyak di
   tangan". Mainkan dua puluh ronde melawan versi lama. Berapa selisih
   skornya, dan apakah selisih itu cukup besar untuk terasa?

4. **Rekonstruksi bug `Out of DATA`.** Tanpa menjalankan programnya, tulis
   urutan kejadian persis yang membuat baris 2760 kehabisan data. Berapa
   kartu pengambilan yang harus habis, dan berapa giliran minimum untuk
   sampai ke sana?

5. **Bandingkan dua gambar kartu.** `CRAZY8` merakit kartu dari data
   (`FIG$(5,5)`); `CRAPS.BAS` menyimpannya sebagai string jadi. Tulis
   keduanya untuk kartu As sekop. Mana yang lebih pendek, dan mana yang lebih
   pendek kalau Anda harus menggambar 52 kartu?

---

Berkas terkait: [mainkan](../games/crazy8/index.html) ·
[SOLITAIR — pilot kartu](solitair.md) ·
[MAXIT1 — cara mengocok kedua](maxit1.md) ·
[LIFE2 — dirty checking yang sama](life2.md) ·
[fondasi §2.6 — keacakan](_fondasi.md)
