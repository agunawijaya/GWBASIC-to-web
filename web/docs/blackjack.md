# Empat Blackjack — dari BASIC ke web

| | |
|---|---|
| Sumber | `run/21.BAS`, `run/BJ.BAS`, `run/BLACK.BAS`, `run/BLACKJCK.BAS` |
| Tahun | 1978 – 1982 |
| Ukuran asli | 336 + 218 + 396 + 282 = **1.232 baris** |
| Hasil port | [21](../games/21/index.html) · [BJ](../games/bj/index.html) · [BLACK](../games/black/index.html) · [BLACKJCK](../games/blackjck/index.html) |
| Mesin bersama | `_shared/blackjack.js` + `blackjack.css` |

Koleksi ini punya **empat** blackjack. Ditulis terpisah, oleh empat orang
berbeda, terentang empat tahun. Semuanya memainkan permainan yang sama.

Tidak satu pun memakai aturan yang sama.

Itulah kenapa keempatnya dikerjakan sekaligus dan berbagi satu mesin: kalau
masing-masing ditulis sendiri, perbedaannya akan tenggelam di antara ratusan
baris yang identik. Dengan aturan sebagai **data**, seluruh perbedaannya muat
dalam satu tabel.

---

## 1 · Tabel yang jadi seluruh isi dokumen ini

| | [21](../games/21/index.html) | [BJ](../games/bj/index.html) | [BLACK](../games/black/index.html) | [BLACKJCK](../games/blackjck/index.html) |
|---|---|---|---|---|
| Tahun | 1982 | 1980 | 1982 | **1978** |
| Dek | 1 | **4 (208 kartu)** | 1 | 1 |
| Kartu potong | — | **acak, 175–199** | — | — |
| **Blackjack dibayar** | **2 : 1** | 1,5 : 1 | **2 : 1** | 1,5 : 1 |
| Bandar di 17 lunak | berhenti | berhenti | berhenti | **ambil (H17)** |
| Asuransi | tidak | ya | tidak | ya |
| Split | ya | ya | **tidak** | ya |
| Double down | ya | ya | ya | ya |
| Batas taruhan | keping $100 | $5–$200, kelipatan $5 | bebas | **batas rumah $500** |
| Aturan diumumkan? | tidak | di layar petunjuk | tidak | **di layar, selalu** |

Baris yang paling penting adalah **pembayaran blackjack**. Dua dari empat
program membayar dua kali lipat. Aturan kasino sungguhan 1,5 : 1 (atau 3 : 2).

Selisih itu bukan hiasan. Ia membalik siapa yang unggul.

---

## 2 · Dua kali lipat, dan apa artinya

```basic
' 21.BAS
920  CSH = CSH + BT*200     ' menang biasa: taruhan kembali + 1x
1770 CSH = CSH + BT*300     ' blackjack:    taruhan kembali + 2x

' BLACK.BAS
5535 IF A(56+X)=9000 THEN ... WINNING(X) = WINNING(X) + BET(X)*2
5540 ... ELSE ... WINNING(X) = WINNING(X) + BET(X)
```

Dua program, dua gaya penulisan, satu aturan yang sama: blackjack membayar
dua kali taruhan, bukan satu setengah.

### Menghitungnya lebih dulu

Peluang pemain mendapat blackjack, di luar kasus seri, diukur atas 2 juta
pembagian: **4,656%**.

Tambahan bayaran 0,5 × peluang itu = **+2,328 poin persen** untuk pemain.

### Lalu mengukurnya

Simulasi 400.000 tangan dengan strategi dasar sederhana:

| Pembayaran | Hasil per taruhan |
|---|--:|
| 1,5 : 1 (BJ, BLACKJCK) | −2,178% |
| **2 : 1 (21, BLACK)** | **+0,144%** |

Selisih terukur: **+2,322 poin persen**. Prediksi: +2,328. Cocok sampai
**0,006 poin**.

> Angka mutlaknya jangan dipercaya sebagai "keunggulan bandar sesungguhnya" —
> strategi di simulasi itu sederhana (tanpa split dan double), jadi kedua
> baris terlalu pesimis sekitar 1,7 poin. Yang **tidak** bergantung strategi
> adalah selisihnya, karena ia lahir langsung dari peluang blackjack.
>
> Membedakan "angka yang bisa dipakai" dari "angka yang cuma benar secara
> relatif" adalah setengah pekerjaan mengukur.

### Dan programnya sendiri tahu

```basic
90   IF CSH>10000 THEN 3340
3350 PRINT"You Broke The Bank !!!"
```

`21.BAS` punya layar kemenangan untuk **membangkrutkan bandar**. Simulasi
bertaruh $100 per tangan dari modal $2.000 sampai $10.000 atau habis:

| Pembayaran | Membangkrutkan bandar |
|---|--:|
| 1,5 : 1 | 2% dari 400 percobaan |
| **2 : 1** | **20%**, median 2.466 tangan |

Sepuluh kali lipat. Layar itu bukan hiasan — dengan aturannya sendiri, ia
memang bisa dicapai.

> **Pelajaran.** Kalau sebuah program punya penanganan khusus untuk keadaan
> yang "seharusnya tidak mungkin", itu bukti bahwa keadaan itu **mungkin**.
> Seseorang menulis baris 3340–3360 karena mereka melihatnya terjadi.

---

## 3 · Nilai tangan tanpa satu pun perulangan

Menghitung nilai tangan blackjack terdengar sepele sampai ada As: ia bernilai
11 kalau muat, 1 kalau tidak, dan hanya **satu** As yang pernah bisa bernilai
11 (dua sudah 22).

Tiga program memakai perulangan atau cabang berulang. `BJ.BAS` tidak:

```basic
130 DEF FNA(Q) = Q + 11*(Q>=22)
310 X1=X : IF X1>10 THEN X1=10
320 Q1=Q+X1 : IF Q>=11 THEN 350
330 IF X>1 THEN Q = Q1 - 11*(Q1>=11) : RETURN
340 Q = Q+11 : RETURN
350 Q = Q1 - (Q<=21 AND Q1>21) : IF Q>=33 THEN Q=-1
```

Dibaca sekilas, ini tampak salah. Tiga As: 11+11+11 = 33, lalu `FNA`
mengurangi 11 → 22 → bangkrut. Padahal tiga As bernilai **13**.

### Kenapa ia benar

Kuncinya baris 330. Ingat di BASIC, ekspresi benar bernilai **−1**:

```
Q = Q1 - 11*(Q1>=11)   →  kalau Q1>=11, ini Q1 + 11
```

Jadi setiap total 11 ke atas **disimpan digeser +11**, dan `FNA` membatalkan
geserannya. Nilai yang tersimpan sekaligus membawa keterangan "tangan ini
lunak atau tidak" — tanpa satu pun variabel tambahan.

Telusuri tiga As:

| Kartu | `Q` tersimpan | `FNA(Q)` | benar? |
|---|--:|--:|---|
| A | 11 | 11 | ya |
| A A | 12 | 12 | ya |
| A A A | 13 | 13 | ya |

Dan sebuah tangan yang berubah dari lunak jadi keras:

| Kartu | `Q` | `FNA(Q)` | benar? |
|---|--:|--:|---|
| A | 11 | 11 | A = 11 |
| A 5 | 16 | 16 | lunak 16 |
| A 5 9 | 26 | 15 | As jatuh jadi 1 |

Baris 350 yang melakukannya: `Q1 - (Q<=21 AND Q1>21)` menambah 1 ketika
tangan baru saja melewati 21, dan tambahan 1 itu — digabung dengan `FNA` yang
mengurangi 11 — persis sama dengan menurunkan As dari 11 ke 1.

### Bukti, bukan kekaguman

Menelusuri **semua** tangan 1 sampai 6 kartu (5.229.042 kombinasi) lewat
rutin di atas, dibandingkan dengan aturan blackjack yang benar:

**nol ketidakcocokan.**

> **Pelajaran.** "Terlihat salah" bukan temuan. Kode yang padat menabung
> keterangan di dalam nilainya sendiri, dan itu memang sulit dibaca — tapi
> sulit dibaca dan salah adalah dua hal berbeda. Yang membedakannya bukan
> membaca lebih lama, melainkan menjalankannya atas semua masukan yang
> mungkin. Di sini "semua masukan" hanya lima juta, jadi tidak ada alasan
> untuk menebak.

---

## 4 · Empat cara mengocok, dan satu yang kurang

`BLACK.BAS` tidak memakai Fisher–Yates:

```basic
1250 FOR L=1 TO 156 : X=INT(RND*52)+1 : Y=INT(RND*52)+1 : SWAP ...
```

**156 tukar acak.** Cara ini menuju seragam, tapi butuh cukup banyak tukar.
Ambang teorinya `½ n ln n` ≈ **103** untuk 52 kartu. 156 di atas 103.

Saya menduga itu cukup. **Ternyata belum**, dan ujinya masih bisa melihatnya —
khi-kuadrat atas 200.000 kocokan, tabel 52 posisi × 52 kartu, ambang 99,9% =
2.830:

| Cara | χ² | Simpangan rata | |
|---|--:|--:|---|
| 20 tukar | 110.470.061 | 89,5% | bias parah |
| 52 tukar | 9.002.531 | 25,6% | bias |
| 103 tukar (ambang teori) | 167.454 | 3,69% | bias |
| **156 tukar (BLACK aslinya)** | **5.117** | **1,45%** | **bias, tapi tipis** |
| 300 tukar | 2.698 | 1,28% | lolos |
| [SOLITAIR](solitair.md) Fisher–Yates, 52 langkah | 2.640 | — | lolos |

### Dan `BJ` justru yang paling parah

```basic
260 FOR II=1 TO 208 : CP=INT(RND*208)+1 : CM=C(II):C(II)=C(CP):C(CP)=CM
270 NEXT II
```

Sekilas ini Fisher–Yates. Bukan. Fisher–Yates mengundi dari **sisa yang belum
terpakai** (`1..i`); baris ini mengundi dari **seluruh larik** (`1..208`)
setiap kali. Itu kesalahan pengocokan paling terkenal yang ada, dan hasilnya
tidak seragam:

| Cara | n=52, 200rb kocokan | n=208, 60rb kocokan |
|---|--:|--:|
| **BJ.BAS baris 260** | **136.885** | **207.336** |
| Fisher–Yates | 2.640 | 42.672 |
| ambang 99,9% | 2.830 | 43.759 |

Bukan tipis seperti `BLACK` — ini **48 kali** ambangnya.

> Di [dokumen SOLITAIR §4](solitair.md) saya memakai justru algoritma ini
> sebagai **kontrol negatif**: sesuatu yang sengaja salah, dipasang untuk
> membuktikan bahwa ujinya memang bisa gagal.
>
> Ternyata kontrol itu bukan karangan. Ia ada di koleksi ini, di `BJ.BAS`
> baris 260.

Dan ironinya rapi: `BJ` adalah satu-satunya program di koleksi yang berpikir
seperti kasino soal **sepatu** — empat dek, kartu potong yang letaknya diundi
supaya penghitung kartu tidak bisa menebak. Penulisnya jelas paham bahwa
keacakan itu penting.

Lalu ia mengocoknya dengan cara yang bias.

> **Pelajaran.** Kecanggihan di satu lapis tidak menular ke lapis di
> bawahnya. Kartu potong acak adalah pemikiran tingkat lanjut yang dibangun
> **di atas** sebuah pengocokan yang tidak pernah diperiksa — dan lapis
> bawah itulah yang menentukan.

### Empat program, empat cara, satu peringkat

| Program | Cara | Hasil |
|---|---|---|
| [SOLITAIR](solitair.md) | Fisher–Yates | seragam, O(n) |
| [MAXIT1](maxit1.md) | larik menyusut | seragam, O(n²) |
| `BLACK` | 156 tukar acak | bias tipis (1,45%) |
| `BJ` | tukar dengan acak 1..n | **bias parah** |

Empat penulis, empat dasawarsa perkakas yang sama, empat hasil berbeda —
untuk satu masalah yang jawabannya sudah diterbitkan pada 1938.

Jejaknya bisa disebut dengan tepat: pada 156 tukar, rata-rata **1,111** kartu
tetap di posisi awalnya, bukan 1,000. **11% terlalu banyak kartu tidak
bergerak.**

Praktisnya kecil — jauh dari cukup untuk dimanfaatkan pemain, dan pemain 1982
tidak punya 200.000 kocokan untuk diperiksa. Tapi angkanya jelas: 156 kira-kira
**setengah** dari yang dibutuhkan agar ujinya berhenti melihat pola, sementara
[SOLITAIR](solitair.md) mencapai seragam sempurna dengan **52** langkah.

> **Pelajaran.** Ambang teori seperti `½ n ln n` menjanjikan *mendekati*
> seragam, bukan seragam. "Di atas ambang" bukan jawaban; ia hanya
> memberi tahu di mana harus mulai mengukur.
>
> Dan saya sempat menulis kebalikannya sebelum mengukur. Dugaan yang
> masuk akal, ditulis dengan percaya diri, dan salah.

---

## 5 · Bandar di 17 lunak: dua pilihan, dua program

```basic
' BLACK.BAS — berhenti (S17)
5070 IF V>16 THEN 5500
5080 IF X>0 AND V+10>16 AND V+10<22 THEN V=V+10 : GOTO 5500

' BLACKJCK.BAS — ambil (H17)
2740 IF T(1)<17 THEN 3020      ' ambil
2750 IF T(1)>17 THEN 2770      ' berhenti
2760 IF E(1)>0  THEN 3020      ' 17 DAN punya As -> ambil
```

As + 6 bernilai 17. Apakah bandar berhenti?

`BLACK` berhenti. `BLACKJCK` mengambil. Keduanya adalah aturan kasino yang
**sungguhan ada** — S17 dan H17 tertulis di permukaan meja di kasino berbeda.
H17 menguntungkan bandar sekitar 0,2%.

Yang menarik: keduanya **konsisten dengan dirinya sendiri**. Ini bukan bug di
salah satunya; ini dua meja yang berbeda.

Baris 2760 layak diperhatikan sekali lagi. Tiga baris `IF` untuk satu
keputusan, dan baris ketiganya adalah seluruh aturan H17. Di kasino, kalimat
itu dicetak di kain hijaunya.

---

## 6 · Program yang menuliskan aturannya, dan yang tidak

```basic
' BLACKJCK.BAS
3360 LOCATE 15,63:PRINT"RULES:"
3370 LOCATE 16,54:PRINT"HOUSE LIMIT IS $500.00"
3380 LOCATE 17,54:PRINT"BLACKJACK PAYS 1.5 TO 1"
```

`BLACKJCK` menampilkan panel aturan di sisi kanan layar, **selalu**, seperti
papan di meja kasino. Dan yang diumumkan cocok dengan kodenya (baris 1550:
`W1 = W1 + 1.5*W`).

`BJ` menuliskan aturannya di layar petunjuk (baris 710–890), termasuk batas
taruhan dan cara kerja asuransi. Pembayarannya 1,5 : 1.

`21` dan `BLACK` tidak mengumumkan pembayaran blackjack di mana pun. Keduanya
membayar 2 : 1.

Dua dari dua yang menuliskan aturannya menulisnya dengan benar; dua dari dua
yang tidak menuliskannya, salah.

> **Pelajaran.** Empat program bukan sampel yang cukup untuk membuktikan apa
> pun. Tapi arahnya masuk akal, dan sebabnya bisa dinamai: **aturan yang harus
> dicetak untuk dibaca orang harus dinyatakan sekali, di satu tempat, dalam
> kalimat.** Yang tidak pernah dicetak boleh hidup sebagai `BT*300` di baris
> 1770 dan tidak pernah dibandingkan dengan apa pun.
>
> Ini alasan yang sama dengan `2550 PRINT"1=HIT, 2=STAND, 3=DOUBLE"` di
> `BLACK` — satu baris yang sekaligus jadi spesifikasi lengkap pilihan
> pemain, jadi layar dan kode tidak bisa berbeda pendapat.

---

## 7 · Satu mesin, empat aturan

Seluruh perbedaan di §1 muat dalam satu objek per program:

```js
/* BLACKJCK */
const ATURAN = {
  dek: 1, potong: null,
  bayarBJ: 1.5,        // baris 1550
  bandarH17: true,     // baris 2740-2760
  asuransi: true, split: true, double: true,
  taruhMin: 5, taruhMax: 500, kelipatan: 5   // baris 1220
};
```

Dan aturan yang jadi data bisa diperiksa oleh mesin, bukan hanya oleh mata:
`bayarBJ` muncul di satu tempat di seluruh port, jadi tidak mungkin ada dua
baris yang menyatakan pembayaran berbeda — kegagalan yang persis terjadi pada
program yang aturannya tersebar.

### Batasnya, dan kapan berhenti berbagi

Aturan yang saya pakai: **kalau sebuah perbedaan tidak bisa dinyatakan sebagai
data di `aturan`, ia bukan soal aturan** — dan harus tinggal di berkas
programnya, bukan dipaksa masuk ke mesin bersama.

Yang tetap tinggal di masing-masing: teks aslinya, panel dokumentasinya, dan
keterangan sumber. Yang **tidak** dimasukkan sama sekali: dua pemain di
`BLACK`, dan lima pemain di `BJ`. Keduanya nyata di aslinya, tapi keduanya
menuntut tata letak yang berbeda, bukan sekadar nilai yang berbeda — jadi
memasukkannya akan mulai mengaburkan mesinnya.

---

## 8 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala | Bentuk sekarang & alasannya |
|---|---|---|---|
| Aturan | Tersebar di baris `IF` masing-masing program | — | Satu objek `aturan` per program; perbedaannya jadi bisa dibaca berdampingan (§7) |
| Kartu | Indeks aritmatika ke dalam larik dek | Tidak ada tipe rekaman | `_shared/cards.js` — objek kartu, dari pilot [SOLITAIR](solitair.md) |
| Nilai tangan | Empat cara berbeda, salah satunya tanpa perulangan (§3) | — | Satu fungsi; keempat cara aslinya dibahas di dokumen, bukan diduplikasi di kode |
| Pilihan pemain | Huruf lewat `INKEY$`, dan tombol fungsi di `BJ` | Tidak ada tetikus | Tombol, plus pintasan papan tik `H`/`S`/`D` |
| Tombol yang tak berlaku | Ditolak dengan bunyi setelah ditekan | Layar teks | **Disembunyikan** — split hanya muncul kalau kartunya memang pasangan |
| Sepatu `BJ` | `C(208)` + kartu potong `CZ` | — | Dipertahankan utuh, termasuk letak potong yang diundi; sisa sepatu ditampilkan |
| Pengocokan `BLACK` | 156 tukar acak (§4) | — | **Diganti** Fisher–Yates. Ini satu-satunya aturan-teknis yang diubah, dan diukur dulu sebelum diubah |
| Dua/lima pemain | `BLACK` 1–2, `BJ` sampai 5 | — | **Tidak diport** (§7). Disebutkan di sini supaya jelas apa yang hilang |
| Uang | Variabel `CSH` / `WINNING()` | Tidak ada penyimpanan | `localStorage` per program — keempatnya punya dompet sendiri |

---

## 9 · Latihan

1. **Bacalah baris 310–360 sampai yakin ia salah.** Lalu tulis penelusuran
   menyeluruh atas semua tangan 1–6 kartu. Berapa lama sampai Anda percaya
   ia benar? Apa yang akhirnya meyakinkan Anda — argumennya atau angkanya?

2. **Ubah `bayarBJ` menjadi 1,5 di `21`.** Berapa lama sekarang sampai
   uang $2.000 habis? Bandingkan dengan aturan aslinya.

3. **Berapa tukar yang cukup?** Ulangi tabel §4 dengan ukuran contoh yang
   lebih besar. Apakah 300 tetap lolos pada 2 juta kocokan? Apa artinya
   "cukup acak" kalau jawabannya bergantung pada berapa banyak yang Anda
   periksa?

4. **Hitung H17 sendiri.** Simulasikan `bandarH17: true` dan `false` pada
   aturan yang sama persis. Apakah selisihnya benar sekitar 0,2 poin persen?

5. **Kartu potong.** Di `BJ`, hitung berapa kartu yang sudah keluar dan
   pakai itu untuk memvariasikan taruhan. Berapa besar keunggulan yang bisa
   diperoleh sebelum kocok ulang? Sekarang buat titik potongnya tetap di 175
   alih-alih diundi — berapa besar bedanya?

---

Berkas terkait: [21](../games/21/index.html) · [BJ](../games/bj/index.html) ·
[BLACK](../games/black/index.html) · [BLACKJCK](../games/blackjck/index.html) ·
[SOLITAIR — pilot komponen kartu](solitair.md) ·
[MAXIT1](maxit1.md) · [OTHELLO](othello.md)
