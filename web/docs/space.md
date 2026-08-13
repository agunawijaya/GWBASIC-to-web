# SPACE — dari BASIC 1981–82 ke web

| | |
|---|---|
| Sumber | `run/SPACE.BAS` — "The IBM Personal Computer Space, Version 1.10" |
| Penulis | R. Heiney & M. Hallerman, IBM Corp |
| Ukuran asli | 57 baris, **nol `GOSUB`** |
| Hasil port | [`../games/space/`](../games/space/index.html) |
| Analisis BASIC | [`../../reviews/SPACE.md`](../../reviews/SPACE.md) |

Bukan permainan dan bukan alat — sebuah **demo**. IBM mengirimkannya untuk
memperlihatkan apa yang bisa dilakukan kartu grafis warna.

Empat puluh lima dari 57 barisnya adalah kerangka IBM (§3). Yang benar-benar
khas program ini cuma **sebelas baris terakhir** — dan di sebelas baris itu ada
dua gagasan yang layak dibaca.

---

## 1 · Satu baris yang memuat seluruh sistem grafis CGA

```basic
1430 CLS:CIRCLE(160,100),30,1,,,0.45:PAINT(160,100),1,1:
     DRAW"bm160,100e30bm160,100h30":LINE (130,100)-(190,100),2:
     GET(130,70)-(190,130),I
```

| Perintah | Perannya |
|---|---|
| `CIRCLE …,0.45` | elips — parameter terakhir **rasio aspek** |
| `PAINT` | isi dari titik tengah sampai ketemu batas |
| `DRAW "bm…e30…h30"` | dua diagonal; `bm` = pindah tanpa menggambar |
| `LINE` | garis mendatar |
| `GET` | **potret** seluruh hasilnya ke larik `I(800)` |

Lima perintah grafis berbeda, satu baris, dan hasilnya sebuah **sprite**.
Setelah baris ini, gambarnya tidak pernah dibuat ulang — ia cuma ditempelkan.

`DIM I(800)` di baris 1410 bukan tebakan: daerah 61×61 piksel pada 2 bit per
piksel adalah 930 bita, dan larik integer 800 elemen menyediakan 1.600.
Ukurannya dihitung, bukan dibulatkan.

---

## 2 · XOR: menggambar dan menghapus dengan perintah yang sama

```basic
1480 K1=RND*259:K2=RND*138:PUT(K1,K2),I,XOR:
     FOR I1=1 TO 150:NEXT:PUT(K1,K2),I,XOR:NEXT
```

`PUT … XOR` menggambar sprite dengan meng-XOR-kan bitnya ke layar.
Mengulanginya di tempat yang **sama** mengembalikan layar persis seperti
semula:

```
latar    1011
sprite   0110
XOR      1101   ← tergambar
XOR lagi 1011   ← latar kembali utuh
```

Jadi **satu perintah melayani dua pekerjaan yang berlawanan**, dan latar
belakangnya tidak perlu disimpan sama sekali. Itulah cara menggerakkan benda di
layar sebelum ada *buffer* ganda: gambar, tunggu, gambar lagi.

Harganya terlihat, dan program ini **memamerkannya**: sprite yang di-XOR di
atas latar berwarna tidak memakai warnanya sendiri — ia memakai warna hasil
XOR. Baris 1440 sengaja membagi layar jadi tiga pita warna, dan sprite yang
sama tampak berbeda di tiap pita.

> **Pelajaran.** Itu bukan cacat; itu peragaan. Sebuah demo yang memperlihatkan
> *batas* tekniknya, bukan cuma kelebihannya, mengajarkan lebih banyak daripada
> yang menyembunyikannya.

Angka `259` dan `138` juga bukan sembarang: 320−61 dan 200−61, yaitu lebar
layar dikurangi lebar sprite. Dihitung tangan, dan tidak dijelaskan.

---

## 3 · Empat puluh dua baris yang sama dengan PIECHART

Baris 940–1299 program ini hampir seluruhnya identik dengan
[PIECHART](piechart.md): layar pembuka berlogo IBM, pemeriksaan kartu grafis
lewat `PEEK(&H410)`, uji Advanced BASIC lewat `PLAY "p16"`, dan penanganan
keluar.

| Baris 940–1299 | |
|---|--:|
| Jumlah baris | **45** / 44 |
| **Identik** | **42** |
| Berbeda | nama program (2×), baris penulis |

Sebuah **kerangka program** yang disalin-tempel antarjudul — dan yang
menyalinnya adalah **IBM**, bukan penulis perorangan.

Sepupunya di koleksi ini: penyelesai Gauss yang sama persis di
[SIMEQN](simeqn.md) dan [CURVE](curve.md). Bedanya, yang itu *algoritma*; yang
ini **seluruh cangkang program**.

Penyebabnya sama: BASIC 1982 tidak punya cara berbagi kode antarprogram. Kalau
dua program butuh layar pembuka yang sama, satu-satunya jalan adalah
mengetiknya dua kali — dan mempertahankan keduanya tetap sama selamanya.

> **Pelajaran.** Salin-tempel bukan tanda penulis yang malas; ia tanda
> **bahasa yang tidak menyediakan alternatif**. Ketika IBM sendiri melakukannya
> di produk berlisensinya, itu bukan lagi soal disiplin perorangan.

---

## 4 · Rasio aspek, untuk kedua kalinya

| Program | Nilai | Maksudnya |
|---|---|---|
| [PIECHART](piechart.md) | `5/6` | supaya lingkaran **terlihat bulat** |
| **SPACE** | `0.45` | supaya elipsnya **terlihat pipih** |

Angka yang sama jenisnya, dua maksud yang **berlawanan**. Yang satu koreksi
perangkat keras; yang lain keputusan rupa.

Dan itu sebabnya keduanya diperlakukan berbeda di port ini: **5/6 dibuang**
karena piksel sekarang persegi, sementara **0,45 dipertahankan** — tanpa itu,
stasiun ruang angkasanya jadi bola.

> **Pelajaran.** Menyalin angka bukan menyalin maksud. Dua konstanta yang
> tampak sejenis bisa berasal dari dua dunia berbeda — satu dari perangkat
> keras, satu dari selera — dan hanya satu yang ikut usang.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Sprite | dibuat sekali di baris 1430, dipotret `GET` | Menggambar ulang mahal | Digambar ulang sebagai grup SVG; bentuk dan ukurannya sama |
| Penghapusan | `PUT … XOR` dua kali (§2) | Tidak ada buffer ganda | `mix-blend-mode: difference` — padanan terdekat, dan bisa dimatikan untuk dibandingkan |
| Rasio 0,45 | keputusan rupa (§4) | — | **Dipertahankan** |
| Tiga pita warna | baris 1440 | Memperagakan akibat XOR | Dipertahankan, termasuk pita keempat yang tidak tergambar |
| Tangga kromatik | `PLAY "mbl64t255o=j;…"`, oktaf 2–6 | — | Dipertahankan; bisa dimatikan |
| Kerangka IBM | 42 baris disalin dari PIECHART (§3) | Tidak ada modul di BASIC | Tidak diport; dicatat sebagai temuan |
| Jalan sampai Esc | `IF A$=CHR$(27)` | — | Tombol yang sama menghentikannya |

---

## 6 · Latihan

1. **Matikan XOR.** Bandingkan kedua mode di halaman port. Selain warnanya,
   apa lagi yang berubah — dan kenapa mode tanpa XOR butuh sesuatu yang tidak
   dibutuhkan mode XOR?

2. **Hitung ukuran `GET`.** Untuk daerah 61×61 pada 2 bit per piksel, berapa
   bita yang dibutuhkan? Bandingkan dengan `DIM I(800)` integer. Berapa
   sisanya?

3. **Cari batas XOR.** Susun latar berwarna yang membuat sprite XOR
   **menghilang sama sekali**. Berapa warna latar yang punya sifat itu?

4. **Telusuri kerangkanya.** Berapa program lain di koleksi ini yang memakai
   layar pembuka IBM yang sama? Bandingkan barisnya dan cari yang berbeda.

---

Berkas terkait: [pakai](../games/space/index.html) ·
[PIECHART — kerangka yang sama](piechart.md) ·
[MORTGAGE](mortgage.md) · [MUSIC](music.md) — program IBM lain
