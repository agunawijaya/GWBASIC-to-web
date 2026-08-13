# DOMINOES — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/DOMINOES.BAS` — Friendlyware PC Introductory Set |
| Tahun | 1982 |
| Ukuran asli | 387 baris (bernomor 10–3870), **0% komentar** |
| Hasil port | [`../games/dominoes/`](../games/dominoes/index.html) |
| Analisis BASIC | [`../../reviews/DOMINOES.md`](../../reviews/DOMINOES.md) |

Permainannya **All Fives** (Muggins) — bukan domino biasa. Anda tidak menang
dengan menghabiskan batu; Anda menang dengan mencetak angka, dan menghabiskan
batu hanya salah satu caranya.

Program ini contoh paling murni di koleksi tentang apa yang terjadi pada
program besar yang ditulis **tanpa satu pun penjelasan** — dan sekaligus berisi
cara mengocok pertama di koleksi ini yang benar-benar salah.

---

## 1 · 387 baris, nol komentar

```basic
50 PL1=1:GOSUB 2680:GOSUB 570:GOSUB 140:GOSUB 260
60 IF INVD THEN GOSUB 2050:GOTO 50 ELSE NOPLAY=0
70 GOSUB 1240:GOSUB 1550:YSCR=YSCR+HOLDY:PL1=0:IF PLNO=0 THEN 3590
```

Itu **seluruh giliran permainan** — dan tak satu pun dari sebelas nomor di situ
memberi tahu apa yang dikerjakan.

Yang perlu dinyatakan adil: **strukturnya benar.** Alur utamanya pendek dan
mendelegasikan ke subrutin, persis yang diajarkan buku mana pun. Yang hilang
cuma **namanya**. Untuk memahami satu baris itu, pembaca harus melompat ke lima
tempat dan membaca semuanya.

Bandingkan [LIFE2](life2.md), yang menulis `GOSUB 500 'Get new pattern from
player`. Biayanya satu komentar; hasilnya alur utama bisa dibaca tanpa melompat
sama sekali.

| Program | Komentar | Bisa dijalankan? |
|---|--:|---|
| [YAHTZEE](yahtzee.md) | 27% | ya |
| **DOMINOES** | **0%** | ya |

Keduanya jalan. Bedanya hanya terasa pada orang berikutnya — dan orang
berikutnya, empat puluh tahun kemudian, adalah saya.

> **Pelajaran.** Komentar bukan pengganti struktur yang baik, dan struktur yang
> baik bukan pengganti komentar. Program ini punya yang pertama dan tidak punya
> yang kedua, dan itu cukup untuk membuatnya nyaris tak terbaca.

---

## 2 · Mejanya hanya lima domino

```basic
340 IF OS THEN TBL$(DD)=ZLP+ZRP   ' isi lengan DIGANTI
```

`TBL$(0..3)` adalah keempat lengan, `TBL$(4)` pusatnya. **Satu domino per
lengan**, dan tiap kali ada yang dimainkan di sebuah lengan, isinya diganti.

Jadi program ini **tidak pernah menyimpan rangkaian dominonya**. Ia hanya perlu
ujung yang terbuka — untuk memeriksa aturan dan menghitung skor — dan sisanya
dibiarkan tinggal di layar, lalu dilupakan.

Rangkaian panjang yang Anda bayangkan saat bermain domino itu ada di **kepala
pemain**, bukan di memori. Dan untuk aturan All Fives itu memang cukup: tidak
ada satu aturan pun yang menanyakan apa yang ada di tengah rangkaian.

Sepupunya [BOWLING](bowling.md), yang membaca kembali layar untuk tahu di mana
pinnya. Bedanya penting:

| | BOWLING | DOMINOES |
|---|---|---|
| Layar dipakai sebagai | **penyimpan keadaan** | tampilan saja |
| Kalau tata letaknya digeser | aturan permainan **rusak** | tidak ada akibatnya |

BOWLING memakai layar sebagai memori. DOMINOES cuma **membuang apa yang tidak
dibutuhkannya** — dan itu keputusan yang benar, bukan jalan pintas.

### 2b · Kenapa port ini tetap menggambar rantainya

Port pertama menggambar persis apa yang disimpan aslinya: **lima batu terpisah**
dalam lima kotak, satu di tengah dan empat di ujung lengan. Setia sepenuhnya.

Dan tidak terbaca sebagai permainan domino sama sekali. Keluhan pertama yang
muncul adalah *"saya bingung melihat papan permainannya"* — dan itu keluhan yang
benar, karena tiga hal sekaligus salah pada papan itu:

| Yang salah | Akibatnya |
|---|---|
| Batu tiap lengan digambar dengan `luar` **selalu di kiri/atas**, apa pun arah lengannya | di lengan kanan dan bawah, angka yang harus dicocokkan justru menghadap **ke dalam** |
| Dobel selalu digambar tegak | padahal dobel dipasang **melintang** terhadap arah lengannya |
| Jumlah ujung terbuka **tidak ditampilkan** | satu-satunya angka yang menentukan skor tidak ada di layar |

Dua yang pertama bukan soal selera — itu **salah gambar**. Yang ketiga adalah
sesuatu yang aslinya juga tidak tampilkan; pemain 1982 menjumlahkannya sendiri
di kepala tiap giliran.

Sekarang: tiap lengan tumbuh ke arahnya sendiri dengan ujung terbuka menghadap
**keluar**, dobel dipasang melintang, tiap ujung memikul angkanya, dan jumlah
ujung ditampilkan hidup beserta sisanya menuju kelipatan lima berikutnya.

**Rantainya ikut disimpan** — dan itu penyimpangan yang paling besar di halaman
ini. Pembagian tugasnya dijaga di kode: `meja` yang dipakai aturan (lima batu,
persis aslinya), `rantai` yang dipakai gambar. Kalau keduanya pernah tidak
sepakat, yang salah adalah gambarnya, bukan permainannya.

> **Pelajaran.** Model data yang benar untuk *aturan* tidak otomatis benar
> untuk *pemain*. Aslinya menyimpan persis yang dibutuhkan mesinnya, dan itu
> keputusan yang bagus di mesin 64 KB — tapi ia bisa melakukannya justru karena
> rantai yang sesungguhnya tetap terlihat di layar, tidak pernah dihapus.
> Yang dibuang bukan informasinya, melainkan salinannya di memori. Port yang
> membuang keduanya membuang lebih banyak daripada yang dibuang aslinya.

---

## 3 · Cara keempat mengocok, dan yang pertama yang berat sebelah

```basic
2210 FOR A=1 TO 28
2220   B=FIX(RND*28)+1:C=FIX(RND*28)+1:IF B=C THEN 2220
2230   SWAP BONE$(B),BONE$(C)
2240 NEXT
```

Dua puluh delapan **penukaran acak**. Terlihat wajar, dan bagi kebanyakan orang
terasa cukup acak.

Tapi penukaran acak berulang hanya mendekati sebaran seragam kalau jumlahnya
**jauh lebih besar** daripada n log n. Dua puluh delapan penukaran untuk dua
puluh delapan batu tidak cukup.

Peluang sebuah batu tidak pernah tersentuh dalam satu penukaran adalah 26/28
(pasangan terurut yang melibatkannya: 54 dari 756). Atas 28 penukaran:

```
28 × (26/28)²⁸ ≈ 3,5 batu tidak pernah tersentuh sama sekali
```

Diukur di halaman port atas 20.000 pengocokan: **4,14 batu berakhir di tempat
asalnya** — lebih besar dari 3,5 karena sebagian batu tersentuh lalu kembali.

Pembandingnya tajam: **pengocokan yang benar meninggalkan tepat 1,00 batu di
tempatnya**, secara harapan — dan angka satu itu berlaku untuk n berapa pun
(jumlah titik tetap sebuah permutasi acak selalu berharapan 1). Cara 1982
meninggalkan empat kali lebih banyak.

### Empat program, empat cara mengocok

| Program | Cara | Seragam? |
|---|---|---|
| [SOLITAIR](solitair.md) | Fisher–Yates | ya |
| [MAXIT1](maxit1.md) | larik menyusut, O(n²) | ya |
| [CRAZY8](crazy8.md) | tolak dan ulang, ~454 undian | ya |
| **DOMINOES** | **penukaran acak** | **tidak** |

Tiga yang pertama **mahal tapi benar**. Yang keempat **murah dan salah** — dan
satu-satunya yang tidak akan pernah ketahuan dari bermain sekali dua kali.

> **Pelajaran.** Tiga cacat pertama di koleksi ini semuanya soal *ongkos*;
> yang keempat soal *kebenaran*. Dan justru yang keempat yang paling sulit
> dilihat, karena satu-satunya gejalanya adalah pola yang butuh ribuan
> pengocokan untuk muncul.

Port ini memakai Fisher–Yates; cara aslinya bisa diukur lewat tombol di
halamannya.

---

## 4 · Lengan samping menunggu sebuah dobel

```basic
380 IF ZL=ZR THEN 440    ' pusat dobel -> keempat lengan boleh
390 IF DD=0 THEN IF ZL=ZLP THEN ...
410 IF DD=2 THEN IF ZR=ZLP THEN ...
430 GOTO 320             ' selain itu: tidak sah
```

Kalau domino pembuka **bukan dobel**, lengan 1 dan 3 tidak akan pernah bisa
dipakai, dan permainannya jadi garis lurus berujung dua. Kalau pembukanya
**dobel**, keempat lengan terbuka dan mejanya jadi salib.

Itu aturan *spinner* domino sungguhan, disandikan dalam empat baris tanpa satu
kata pun yang menyebut namanya.

Di port ini aturan itu dibuat **terbaca dari papannya sendiri**: lengan yang
terbuka bergaris putus-putus, lengan yang tertutup bergaris utuh dan diredupkan.
Versi pertama membiarkan kolom kosongnya menciut, dan akibatnya bentuk salibnya
lenyap — mejanya terbaca sebagai tiga domino bertumpuk, seolah lengan samping
itu tidak ada. Padahal justru sebaliknya yang perlu terlihat.

---

## 5 · Pembulatan ke lima, tanpa fungsi pembulatan

```basic
3620 REMA=TOT MOD 5:TOT=TOT\5:TOT=TOT*5:IF REMA>2 THEN TOT=TOT+5
```

Saat seseorang menghabiskan batunya, sisa batu lawan dijumlahkan lalu
dibulatkan ke kelipatan lima terdekat. Sisa 3 atau 4 ke atas, sisa 0–2 ke bawah.

Itu **pembulatan setengah-ke-atas yang benar**, ditulis dalam satu baris dengan
pembagian bulat dan sisa — tanpa satu pun fungsi pembulatan, karena BASIC tidak
punya yang membulatkan ke kelipatan sembarang.

Layak dicatat justru karena ia **benar**. Baris sepadat ini biasanya tempat bug
bersembunyi; yang ini tidak.

---

## 6 · Penjaga yang membaca variabel yang tidak disetel

```basic
490 IF LEFT$(TBL$(4),1)<>RIGHT$(TBL$(A),1) THEN 540
500 IF TBL$(1)="  " AND TBL$(2)="  " AND DD=1 THEN DD=2:GOTO 540
510 IF TBL$(3)="  " AND TBL$(2)="  " AND DD=3 THEN DD=2:GOTO 540
```

Baris 500–530 mengalihkan permainan dari lengan samping ke lengan utama kalau
yang utama masih kosong. Maksudnya jelas dan benar: *isi kedua ujung dulu, baru
sampingnya*.

Tapi penjaganya di baris 490 membaca `TBL$(A)` — dan **`A` tidak disetel di
jalur ini**. Nilainya adalah sisa pencacah `FOR` dari tempat lain. Jadi apakah
pengalihan itu terjadi bergantung pada angka yang kebetulan tertinggal.

Port ini **tidak meniru ketergantungan itu**. Yang dicapai baris 500–530 dicapai
di sini dengan **menutup lengan samping selama lengan utamanya kosong** — hasil
akhirnya sama, tanpa bergantung pada variabel yang tak tentu.

Ini penyimpangan, dan alasannya: meniru perilaku yang bergantung pada nilai tak
tentu berarti memilih salah satu kemungkinannya secara sewenang-wenang, lalu
menyebutnya "asli". Yang jujur adalah menyatakan bahwa aslinya tidak tentu, dan
memilih perilaku yang **maksudnya** jelas.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Aturan | All Fives, skor saat ujung terbuka habis dibagi 5 | — | **Dipertahankan persis**, termasuk dobel yang dihitung dua sisi |
| Meja (aturan) | lima domino saja (§2) | Memori 64 KB | **Dipertahankan** — `meja` di kode masih lima batu, dan itu yang dibaca aturannya |
| Meja (gambar) | rantai dilupakan dari memori, tapi tetap terlihat di layar | Layar tidak pernah dihapus | **Rantai disimpan dan digambar** (§2b) — penyimpangan terbesar di halaman ini |
| Arah batu di lengan | ujung terbuka menghadap keluar, dobel melintang | — | Dipertahankan; port pertama **salah** menggambarnya (§2b) |
| Jumlah ujung terbuka | tidak ditampilkan | Layar 80×25 sudah penuh | **Ditampilkan hidup**, beserta sisanya menuju kelipatan lima |
| Lengan samping | perlu pusat dobel (§4) | — | Dipertahankan, dan dibuat **terlihat** di papan |
| Pengocokan | 28 penukaran acak, tidak seragam (§3) | `SWAP` murah, keseragaman tak terpikir | Fisher–Yates. Cara aslinya bisa **diukur** lewat tombol |
| Benih | `RANDOMIZE VAL(RIGHT$(TIME$,2))` — 60 nilai | Tidak ada entropi selain jam | `crypto.getRandomValues`. Kemunculan **keenam** pola ini |
| Membagi | berselang-seling, 7 masing-masing, kandang dari batu ke-15 | — | Dipertahankan persis |
| Skor akhir babak | sisa lawan dibulatkan ke lima (§5) | — | Dipertahankan persis |
| Target | A=100, B=250, C=500 | — | Dipertahankan ketiganya |
| Pengalihan lengan | penjaga membaca `A` yang tak disetel (§6) | — | **Diganti** dengan menutup lengan; alasannya di §6 |
| Memilih tempat | tombol panah menggeser penunjuk (baris 190–220) | Tidak ada tetikus | Klik langsung pada tempatnya |
| Gambar batu | pola titik tiga karakter (baris 2130) | Layar teks | Kisi 3×3 yang sama untuk ketujuh nilai, jadi mata 6 dan 3 sejajar titiknya |
| Komentar | **nol** | — | Port ini menulis alasan di tempat kodenya, bukan sesudahnya |

---

## 8 · Latihan

1. **Ukur pengocokannya sendiri.** Berapa banyak penukaran yang dibutuhkan agar
   jumlah titik tetapnya turun ke 1,0? Bandingkan dengan n log n untuk n=28.

2. **Cari gejalanya di permainan.** Kalau 4 dari 28 batu tetap di tempatnya,
   apa yang bisa diamati seorang pemain setelah seratus babak? Rancang satu
   pengamatan yang bisa membedakan pengocokan 1982 dari Fisher–Yates.

3. **Beri nama sebelas lompatannya.** Ambil baris 50–70 dan tulis satu komentar
   untuk tiap `GOSUB`, dengan membaca subrutinnya. Berapa lama? Itulah biaya
   yang tidak dibayar penulisnya, dan yang dibayar setiap pembaca sesudahnya.

4. **Tentukan nilai `A`.** Telusuri semua jalur yang sampai ke baris 490 dan
   cari tahu nilai `A` yang mungkin di titik itu. Apakah pengalihan 500–530
   pernah benar-benar terjadi?

5. **Tambahkan rangkaiannya.** Ubah port ini agar menyimpan seluruh rangkaian
   domino, bukan cuma ujungnya. Aturan mana yang berubah? Kalau tidak ada,
   apa yang Anda dapat dari penyimpanan tambahan itu?

---

Berkas terkait: [mainkan](../games/dominoes/index.html) ·
[SOLITAIR](solitair.md) · [MAXIT1](maxit1.md) · [CRAZY8](crazy8.md) —
tiga cara mengocok yang lain ·
[BOWLING — layar sebagai penyimpan](bowling.md) ·
[LIFE2 — `GOSUB` yang diberi nama](life2.md) ·
[fondasi §2.6 — keacakan](_fondasi.md)
