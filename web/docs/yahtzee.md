# YAHTZEE — dari BASIC 1980 ke web

| | |
|---|---|
| Sumber | `run/YAHTZEE.BAS` — "YATZEE" |
| Penulis | JL Helms & MF Pezok untuk CCII, Coronado CA; diadaptasi ke IBM PC oleh Patrick Leabo, Tucson AZ |
| Tahun | 1980 |
| Ukuran asli | 612 baris (bernomor 1000–7110), **27% komentar** |
| Hasil port | [`../games/yahtzee/`](../games/yahtzee/index.html) |
| Analisis BASIC | [`../../reviews/YAHTZEE.md`](../../reviews/YAHTZEE.md) |
| Peran | **pilot komponen dadu** — menetapkan `_shared/dice.js` untuk CRAPS |

Program tertua di sesi ini, dan yang paling matang.

Patrick Leabo yang sama membawa [OTHELLO](othello.md) dan [MAXIT1](maxit1.md)
ke IBM PC dari Tucson. Ini yang ketiga — dan satu-satunya yang bukan karyanya
sendiri melainkan adaptasi dari CCII di Coronado, California. Tiga program dari
satu tangan di koleksi ini, dan yang ini yang paling rapi.

---

## 1 · `S(6,5)`: tabel frekuensi yang sekaligus indeks

Bagian terbaik dari program ini, dan ia muat dalam sembilan baris.

```basic
2250 FOR J= 1 TO 5
2260 X= C(J):S(X,0)= S(X,0)+ 1      ' berapa banyak mata X
2270 P= S(X,0):S(X,P)= J            ' dadu KE-BERAPA yang bermata X
2280 NEXT J
```

Satu larik, dua pekerjaan. Kolom 0 menyimpan **berapa banyak**; kolom 1 ke atas
menyimpan **dadu yang mana**. Lalu:

```basic
2330 FOR J= 5 TO 1 STEP -1          ' urutkan mata menurut BANYAKNYA,
2340 FOR M= 6 TO 1 STEP -1          ' terbanyak dulu
2350 IF S(M,0)<> J THEN 2370
2360 S(0,X)= M:X= X+ 1
```

Sesudah itu setiap pertanyaan tentang segenggam dadu dijawab dari tabel, bukan
dengan membandingkan dadu satu per satu:

| Pertanyaan | Jawabannya |
|---|---|
| three of a kind? | `S(S(0,0),0) >= 3` |
| four of a kind? | `S(S(0,0),0) >= 4` |
| full house? | `S(S(0,0),0) = 3` dan `S(S(0,1),0) = 2` |
| yatzee? | `S(S(0,0),0) = 5` |

Hitung frekuensi lebih dulu, lalu jawab semuanya dari situ. Namanya sekarang
histogram, `Counter`, atau `GROUP BY` — dan bentuknya di sini, pada **1980**,
sudah persis sama.

`_shared/dice.js` di port ini memakai bentuk yang sama (`tally` dan `byCount`),
dengan komentar yang menunjuk balik ke baris-baris ini. Itu bukan penghormatan;
itu karena tekniknya memang masih yang terbaik.

---

## 2 · Baris yang benar karena kebetulan

Dua baris berdekatan, dua bentuk yang berbeda:

```basic
2580 IF S(1,0)>0 AND S(2,0)>0 AND S(3,0)>0 AND S(4,0)>0 THEN 2620
     ' straight kecil — ditulis dengan benar

2630 IF S(1,0)AND S(2,0)AND S(3,0)AND S(4,0)AND S(5,0)= 1 THEN 2660
     ' straight besar — empat `>0` hilang
```

Di BASIC, `=` mengikat lebih erat daripada `AND`, dan `AND` adalah operator
**bit**, bukan operator logika. Jadi baris 2630 sebenarnya menghitung:

```
S(1,0) & S(2,0) & S(3,0) & S(4,0) & (S(5,0)=1 ? −1 : 0)
```

Hanya mata **kelima** yang dibandingkan dengan 1; empat sisanya cuma di-AND-kan
bitnya. Itu jelas bukan yang dimaksud penulisnya — satu baris sebelumnya ia
menulis bentuk yang benar untuk straight kecil.

### Tapi apakah ia salah?

Halaman port menjalankan **seluruh ruang lemparan** — 6⁵ = 7.776 kemungkinan,
bukan sampel — dan membandingkan kedua bentuk. Hasilnya:

> **240** straight besar yang sah. **0** selisih antara bentuk 1980 dan bentuk
> yang benar.

(240 = dua straight × 5! susunan = 240. Angka itu bisa diperiksa tanpa
komputer.)

Alasannya bisa ditelusuri, dan layak ditelusuri: agar hasil AND-nya bukan nol,
keempat mata pertama harus **semuanya ≥ 1** — kalau satu saja nol, seluruh AND
jadi nol. Dan mata kelima harus **tepat 1**. Dengan hanya lima dadu, empat mata
tak-nol ditambah satu mata yang tepat satu **memaksa** kelimanya masing-masing
tepat satu. Yaitu straight besar. Tidak ada ruang untuk salah.

> **Pelajaran.** Baris itu benar, tapi bukan karena ia menanyakan hal yang
> benar. Ia benar karena **lima dadu terlalu sedikit untuk membuatnya salah**.
> Tambah satu dadu, dan ia mulai berbohong.

Silsilah yang sama dengan pagar tak sengaja di [PEGLEAP](pegleap.md) dan angka
600 di [MAXIT1](maxit1.md) — dua-duanya juga karya Leabo atau setangkatannya:
**aman karena kebetulan, bukan karena dijaga.** Port ini memakai bentuk yang
benar, dan menyediakan tombol yang membuktikan keduanya sepakat.

---

## 3 · Huruf yang dipetakan dengan benar

Tiga belas kotak skor tidak muat dalam angka satu digit, jadi kotak 10–13 diberi
label `A B C D`. Pemetaannya **satu rumus**:

```basic
2000 I=ASC(I$)-48 : ... : IF I>9 THEN I=I-7
```

`'A'` = 65, 65−48 = 17, 17−7 = 10. Satu baris untuk keempat hurufnya.

Bandingkan dengan [CRAZY8](crazy8.md) (1986), yang menulis pemetaan yang sama
sebagai enam baris `IF` terpisah — dan salah menyalin salah satunya, sehingga
satu kartu tidak pernah bisa dimainkan:

| | YAHTZEE 1980 | CRAZY8 1986 |
|---|---|---|
| Bentuk | satu rumus aritmetika | enam `IF` berturut |
| Baris yang bisa salah ketik | 0 | 6 |
| Bug yang benar-benar ada | tidak ada | satu (`e` menunjuk kartu yang salah) |

Program yang **enam tahun lebih tua** memilih bentuk yang tidak bisa salah.
Satu rumus tidak punya baris kelima untuk salah diketik.

---

## 4 · Kursor yang tahu kapan gilirannya

```basic
1590 ... PRINT " HOW MANY DICE TO ROLL AGAIN? ";:LOCATE ,,1:GOSUB 2100: ... :LOCATE ,,0
```

`LOCATE ,,1` **menyalakan** kursor sebelum meminta masukan; `LOCATE ,,0`
mematikannya sesudahnya. Jadi kursor hanya terlihat saat pemakai memang sedang
diminta mengetik.

Detail sekecil ini hampir tidak ada di program lain di koleksi ini, dan ia
menjawab pertanyaan yang paling sering muncul di depan layar teks: *"ini nunggu
saya, atau nunggu dia?"*

Padanannya di port ini bukan kursor, melainkan **kotak skor yang menyala hijau**
— dan hanya menyala saat memang giliran Anda memilih.

---

## 5 · Dua predikat yang tampak sama, dan tidak boleh disamakan

Ini bug yang saya buat sendiri saat memport, dan ia layak ditulis karena
jebakannya rapi.

Aslinya punya **dua** pertanyaan berbeda tentang sebuah kotak skor:

```basic
' "Boleh dipilih giliran ini?"  — baris 2040-2050
2040 IF I= 12 AND K(12,A)> -1 THEN <sah>   ' YATZEE boleh berulang
2050 IF K(I,A)= 0 THEN <sah>               ' kotak lain: sekali saja

' "Kartunya sudah penuh?"       — baris 5420-5440, rutin yang lain sama sekali
5420 FOR K= 1 TO 13
5430 IF K(K,J)= 0 THEN Y= 1                ' masih ada yang KOSONG
5440 NEXT K
```

Bedanya halus. Kotak YATZEE yang sudah berisi 50 **tetap boleh dipilih lagi**
(itu cara program ini memberi bonus yatzee kedua), tapi ia **tidak lagi bernilai
0** — jadi ia tidak menghalangi permainan berakhir.

Versi pertama port ini memakai satu predikat untuk keduanya. Akibatnya:
permainan tidak pernah selesai. Begitu YATZEE terisi 50, ia selamanya "masih
bisa dipilih", jadi "sudah penuh" tidak pernah benar. Ketiga belas kotak terisi
dan giliran terus berputar tanpa akhir.

Yang menarik: **aslinya sudah benar**, dan benar dengan cara yang eksplisit —
dua rutin terpisah, di dua tempat berjauhan, masing-masing menjawab satu
pertanyaan. Yang menggoda saya untuk menyatukannya justru karena keduanya
*terlihat* menanyakan hal yang sama.

> **Pelajaran.** Dua predikat yang selalu sepakat pada sembilan puluh sembilan
> persen keadaan tetap dua predikat. Yang satu persen itulah alasan keduanya
> ditulis terpisah — dan program 1980 ini tahu itu.

Satu bug lagi yang ditemukan saat menguji: pewaktu giliran berikutnya tidak
dibatalkan saat permainan usai, sehingga papan yang seharusnya mati bisa
menyala kembali. Terlihat karena tab uji yang tersembunyi menunda pewaktunya
cukup lama sampai dua kejadian bertabrakan — jarang, tapi bukan mustahil di
tangan pemain. Sudah diperbaiki dengan `clearTimeout` plus pagar kedua di
`giliranBaru`.

---

## 6 · Benih yang sama, untuk kelima kalinya

```basic
1170 RANDOMIZE VAL(RIGHT$(TIME$,2))
```

Detik saja — **60 kemungkinan**. Pola yang sama muncul di [MAXIT1](maxit1.md),
[MASTER](master.md), [KENO](keno.md), dan di sini.

Bedanya, di sini ia **paling tidak berbahaya**:

| | KENO | YAHTZEE |
|---|---|---|
| Menyemai | tiap ronde (baris 1090) | sekali di awal (baris 1170) |
| Yang diramalkan | 20 angka, langsung menentukan menang | 39 lemparan berturut |
| Bisa dihafal? | ya, 60 undian | tidak praktis |

Bahaya sebuah benih lemah tidak ditentukan oleh benihnya, melainkan oleh
**berapa banyak yang bisa diramalkan dari sana** — dan berapa besar
keuntungannya bagi yang meramalkan.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Aturan skor | 13 kotak, bonus 35 di 63, yatzee 50 lalu +100 | — | **Dipertahankan persis**, termasuk `K(15,A)>62` yang berarti "63 ke atas" |
| Frekuensi dadu | `S(6,5)`, tabel + indeks (§1) | Larik satu-satunya struktur data | **Dipertahankan sebagai gagasan** di `_shared/dice.js` |
| Straight besar | bentuk bit yang benar karena kebetulan (§2) | Ketidaktahuan urutan operator | Bentuk yang benar; kesetaraan keduanya **dibuktikan** atas seluruh 7.776 lemparan |
| Kotak hangus | `K(I,A) = -1`, dicetak sebagai `0` | Tidak ada nilai "kosong" selain 0 | Dipertahankan: `—` untuk hangus, kosong untuk belum dipakai |
| Memilih kotak | ketik `1`–`9`, `A`–`D` | Tidak ada tetikus | Klik. Huruf aslinya tetap ditampilkan di tiap baris |
| Nilai yang akan didapat | **tidak ditampilkan** — pemain menghitung sendiri | Layar 80×25 sudah penuh | **Ditampilkan** sebagai pratinjau di kotak yang bisa dipilih — lihat di bawah |
| Jumlah pemain | 1–5, nama diketik | — | 1–5 dipertahankan; nama otomatis `PLAYER n` |
| Lawan komputer | ada (baris 2760–3460) | — | **Tidak diport** — lihat di bawah |
| Dadu | `PRINT` angka | Layar teks | SVG di `_shared/dice.js`; titiknya lingkaran sungguhan |
| Kursor sadar-giliran | `LOCATE ,,1` / `,,0` (§4) | — | Kotak yang menyala hijau hanya saat giliran Anda |
| Bunyi | `PLAY "L64T200N70"` klik, glissando saat melempar | — | Dipertahankan |
| "NO - NO - DUMMY" | baris 2070 | — | **Dipertahankan apa adanya** |

### Kenapa nilai pratinjau ditampilkan

Ini **penyimpangan karena selera**, dan dinyatakan begitu.

Pemain 1980 melihat lima dadu, menghitung sendiri berapa nilainya di tiap kotak,
lalu mengetik nomor kotaknya. Menghitung itu bagian dari permainannya — dan
port ini menghapusnya.

Alasannya: aritmetikanya bukan yang membuat Yahtzee menarik. Yang menarik adalah
**keputusannya** — ambil 30 sekarang atau bertahan mengejar 40? Korbankan ACES
atau korbankan YATZEE? Menyembunyikan angkanya tidak membuat keputusan itu lebih
sulit; ia cuma menambah pekerjaan menjumlahkan lima angka, dan pekerjaan itu
tidak pernah salah kalau dilakukan dengan sabar.

Yang **tidak** dilakukan: menyarankan kotak mana yang terbaik. Batasnya di situ
— menampilkan fakta yang bisa dihitung pemain sendiri, tidak menggantikan
pertimbangannya.

### Kenapa lawan komputernya tidak diport

Aslinya menawarkan lawan bernama `"IBM PC"` (baris 1300), dengan kecerdasannya
di baris 2760–3460: daftar prioritas — yatzee, empat sama, full house, straight
besar, dan seterusnya — ditambah rutin terpisah untuk memilih dadu mana yang
dilempar ulang.

Yang diport hanya bagian **manusianya**: satu sampai lima pemain bergantian,
persis batas aslinya. Lawan komputernya **belum** diport, dan itu dinyatakan
sebagai kekurangan, bukan penyederhanaan — sama seperti [MAXIT1](maxit1.md).

Alasannya: memport separuh AI lebih buruk daripada tidak sama sekali. Pemilihan
kotaknya mudah dibaca; pemilihan dadunya tersebar di tiga subrutin yang saling
memanggil, dan menebak maksudnya berarti mengarang lawan yang bukan lawan 1980.

---

## 8 · Latihan

1. **Patahkan baris 2630.** Tulis versi enam dadu dari straight besar dan
   jalankan kedua bentuk atas 6⁶ = 46.656 lemparan. Berapa selisihnya sekarang?
   Ini cara termurah membuktikan bahwa "benar" dan "benar karena alasan yang
   benar" adalah dua hal berbeda.

2. **Hitung sendiri angka 240.** Tanpa program: berapa banyak dari 7.776
   lemparan yang merupakan straight besar? Cocokkan dengan keluaran tombolnya.

3. **Port AI-nya.** Baca 2760–3460 dan tulis pemilihan kotaknya saja (tanpa
   pemilihan dadu). Mainkan seratus permainan melawannya. Berapa skor rata-rata,
   dan di kotak mana ia paling sering rugi?

4. **Ubah ambang bonusnya.** `K(15,A)>62` memberi 35. Berapa peluang sebenarnya
   mencapai 63 kalau Anda selalu mengambil kotak atas yang terbesar? Apakah 35
   nilai yang adil untuk itu?

5. **Cari dua predikat yang disamakan.** §5 menceritakan satu. Telusuri satu
   program lain di koleksi ini dan cari tempat di mana dua pertanyaan yang
   berbeda dijawab dengan satu pemeriksaan yang sama.

---

Berkas terkait: [mainkan](../games/yahtzee/index.html) ·
[CRAPS — pengguna kedua `dice.js`](craps.md) ·
[CRAZY8 — pemetaan huruf yang gagal](crazy8.md) ·
[MAXIT1](maxit1.md) · [OTHELLO](othello.md) · [PEGLEAP](pegleap.md) ·
[fondasi §2.6 — keacakan](_fondasi.md)
