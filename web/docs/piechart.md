# PIECHART — dari BASIC 1981–82 ke web

| | |
|---|---|
| Sumber | `run/PIECHART.BAS` — "The IBM Personal Computer Piechart, Version 1.10" |
| Penerbit | **IBM Corp**, 1981–82 — "Licensed Material" |
| Ukuran asli | 77 baris |
| Hasil port | [`../games/piechart/`](../games/piechart/index.html) |
| Analisis BASIC | [`../../reviews/PIECHART.md`](../../reviews/PIECHART.md) |

Salah satu dari sedikit program **IBM resmi** di koleksi ini. Ia memuat contoh
terbaik tentang pesan galat yang berguna — dan sebuah bug warna yang bertahan
di perangkat lunak berlisensi.

---

## 1 · Potongan keempat tidak punya warna

```basic
1630 PAINT (CX+COS(AA)*0.8*SR, CY-SIN(AA)*0.8*SR), C MOD 4, 1
```

`C` berjalan 1..N, jadi `C MOD 4` menghasilkan **1, 2, 3, 0, 1, 2, 3, 0, …**

Di `SCREEN 1`, warna **0 adalah warna latar**. Jadi:

| Potongan | `C MOD 4` | Warna CGA |
|--:|--:|---|
| 1 | 1 | sian |
| 2 | 2 | magenta |
| 3 | 3 | putih |
| **4** | **0** | **latar — hilang** |

Potongan keempat, kedelapan, kedua belas… dicat dengan warna latar. Tampak
kosong, seolah tidak ada potongan di sana.

Ini ada di **produk IBM berlisensi**, dan ia hanya muncul kalau grafik punya
**empat potongan atau lebih**. Tiga potongan: sempurna. Empat: satu hilang.

> **Pelajaran.** Kenapa lolos? Karena penulisnya hampir pasti mengujinya dengan
> dua atau tiga potongan — jumlah yang paling wajar saat mencoba sesuatu. Bug
> yang butuh **tepat empat** masukan untuk muncul ada di titik buta antara
> "contoh cepat" dan "uji sungguhan", dan itu titik buta yang masih sama
> lebarnya hari ini.

Port ini memakai empat warna yang keempatnya terlihat, dan menyediakan tombol
**Pakai warna CGA asli** untuk memutar bugnya kembali — dengan keterangan yang
menandai potongan mana yang hilang.

---

## 2 · Pesan galat terbaik di koleksi ini

```basic
1292 ON ERROR GOTO 1295
1293 PLAY "p16"
1294 GOTO 1300
1296 PRINT "THIS PROGRAM REQUIRES ADVANCED BASIC -- USE COMMAND 'BASICA'"
```

Perhatikan baris 1293. `PLAY "p16"` adalah jeda seperenam belas nada —
**tidak berbunyi**, tidak mengubah apa pun. Ia ada semata-mata untuk **memicu
galat** kalau penafsirnya bukan Advanced BASIC, karena `PLAY` hanya ada di
sana.

Sebuah uji kemampuan yang dilakukan dengan menjalankan hal **paling tidak
berbahaya** yang bisa ditemukan. Pola yang sama masih dipakai sekarang:
*feature detection* dengan mencoba, bukan menebak dari nomor versi.

Dan pesannya menyebut **perintah persis** yang harus diketik. Bandingkan tiga
cara menangani hal yang sama di koleksi ini:

| Program | Caranya |
|---|---|
| `INTRO.BAS` | semua galat → keluar diam-diam |
| [15PUZZLE](15puzzle.md) | mendeteksi, memberi tahu, tetap lanjut |
| **PIECHART** | **memberi tahu apa masalahnya dan perintah perbaikannya** |

*"USE COMMAND 'BASICA'"* — bukan "fitur tidak tersedia", bukan "galat 73".
Kalimat yang bisa langsung dijalankan pemakai.

> **Pelajaran.** Pesan galat yang baik menjawab tiga hal: apa yang salah, kenapa,
> dan **apa yang harus saya ketik sekarang**. Yang ketiga paling sering hilang,
> dan yang ketiga paling berguna. Program 1982 ini menjawab ketiganya dalam satu
> kalimat.

---

## 3 · Lingkaran yang sengaja dipepatkan

```basic
1620 CIRCLE (CX,CY),SR,1,-A1-0.001,-A2,5/6
```

Parameter terakhir adalah **rasio aspek**. Layar CGA 320×200 pada monitor 4:3
punya piksel yang lebih tinggi daripada lebar:

```
(4/3) ÷ (320/200) = 1,333 ÷ 1,6 = 5/6
```

Supaya lingkaran **terlihat** bulat, ia harus digambar pepat 5/6. Angka yang
tampak sembarang itu sebenarnya seluruh geometri monitornya, dipadatkan jadi
satu pecahan.

**Port ini tidak memakainya.** Piksel layar Anda persegi, jadi menerapkan 5/6
di sini justru akan *memepatkan* lingkaran yang sudah bulat. Meniru angkanya
berarti mengkhianati maksudnya — yang diinginkan baris 1620 adalah lingkaran
yang terlihat bulat, dan di layar persegi itu berarti 1.

Dua hal lain di baris yang sama:

**Sudut negatif** (`-A1`, `-A2`) punya arti khusus di GW-BASIC: gambar juga
garis dari pusat ke ujung busur. Itulah yang mengubah sebuah busur jadi
**potongan pai**, dalam satu perintah.

**`-A1-0.001`** bukan salah ketik: sudut awal dan akhir yang sama persis akan
menggambar busur nol, jadi sedikit dimundurkan supaya potongan pertama tidak
lenyap. Sebuah *epsilon* yang ditulis tangan, empat puluh tahun sebelum kata
itu jadi umum.

---

## 4 · Pai yang selalu meledak

```basic
1440 LR=50:SR=44
1600 CX=160+COS(AA)*(LR-SR)
1610 CY=100-SIN(AA)*(LR-SR)
```

Pusat tiap potongan digeser **keluar** sejauh `LR−SR` = 6 piksel, sepanjang
garis baginya sendiri. Hasilnya diagram pai *exploded* — tiap potongan
terpisah dari pusat.

Yang menarik: itu **bukan pilihan**. Tidak ada satu baris pun yang bisa
mematikannya, tidak ada pertanyaan ke pemakai. IBM memutuskan bahwa diagram pai
*selalu* begitu, dan menuliskannya sebagai dua angka di baris 1440.

Dipertahankan apa adanya. Sebuah keputusan rancangan yang tidak ditawarkan
sebagai pilihan tetap sebuah keputusan rancangan — dan menawarkannya sekarang
berarti menghapus jejaknya.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Bentuk pai | selalu meledak, 6 piksel (§4) | — | **Dipertahankan**, tetap tanpa pilihan |
| Warna | `C MOD 4`, potongan ke-4 hilang (§1) | 4 warna CGA, indeks 0 = latar | Empat warna yang **semuanya terlihat**; bug aslinya bisa dinyalakan lewat tombol |
| Rasio aspek | `5/6` untuk piksel CGA (§3) | Piksel tidak persegi | **Tidak dipakai** — piksel sekarang persegi; alasannya di §3 |
| Epsilon `0.001` | mencegah busur nol | — | Tidak dibutuhkan; SVG menggambar busur nol dengan benar |
| Uji kemampuan | `PLAY "p16"` (§2) | Tidak ada cara menanyakan versi | Tidak relevan lagi; dicatat sebagai temuan |
| Pesan galat | menyebut perintah perbaikannya (§2) | — | **Dijadikan standar** untuk pesan galat di port ini |
| Batas data | `DIM R(100)` | Memori | **Dipertahankan**, meski pai 100 potongan bukan pai lagi |
| Masukan | `INPUT` satu per satu | — | Kotak teks; grafik diperbarui sambil mengetik |
| Layar pembuka | logo IBM + hak cipta | — | Tidak diport; hak cipta disebut di bilah atas |

---

## 6 · Latihan

1. **Lihat bugnya.** Isi lima baris data, lalu tekan **Pakai warna CGA asli**.
   Potongan mana yang hilang? Tambah jadi sembilan baris — berapa yang hilang
   sekarang?

2. **Perbaiki baris 1630.** Tulis ulang `C MOD 4` supaya keempat warna dipakai
   dan tidak ada yang jatuh ke 0. Berapa cara yang Anda temukan, dan mana yang
   paling sulit salah dibaca?

3. **Hitung ulang 5/6.** Untuk `SCREEN 2` (640×200) pada monitor 4:3, berapa
   rasio aspek yang benar? Dan untuk layar 16:9 modern pada 1920×1080?

4. **Cari uji kemampuan lain.** `PLAY "p16"` menguji Advanced BASIC dengan
   menjalankan sesuatu yang tak berbahaya. Telusuri koleksi ini dan cari
   program lain yang menguji kemampuan dengan mencoba, bukan dengan
   menanyakan.

---

Berkas terkait: [pakai](../games/piechart/index.html) ·
[15PUZZLE — cara lain menangani galat](15puzzle.md) ·
[CURVE — grafik yang tidak boleh ada](curve.md)
