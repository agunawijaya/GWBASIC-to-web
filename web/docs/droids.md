# DROIDS — permainan yang membaca layarnya sendiri

> Port web: [`web/games/droids/`](../games/droids/index.html) ·
> Sumber: [`run/DROIDS.BAS`](../../run/DROIDS.BAS) (183 baris) ·
> Analisis BASIC: [`reviews/DROIDS.md`](../../reviews/DROIDS.md)

Salah satu dari tiga berkas IPCO di koleksi ini. Sepuluh baris pertamanya bukan
kode melainkan **logo kelompok pengguna** yang digambar dengan karakter blok
CP437: *International PC Owners*, P.O. Box 10426, Pittsburgh PA 15234, disk
**2043-A** — ditambah baris *Error correction by JOHN BECK, Melbourne
PC-Group*. Berkas ini pergi dari Pittsburgh ke Melbourne, diperbaiki di sana,
lalu beredar lagi. Itu *fork* dan *patch*, dikirim lewat pos.

---

## 1 · Layarnya adalah papannya, secara harfiah

```basic
2210 Z=Z+1:CT=SCREEN (IY(DN)+DY,IX(DN)+DX)
2220 IF CT=ORE THEN 2230
2230 LOCATE IY(DN),IX(DN):PRINT CHR$(0)
2340 CT=SCREEN (IY(J)+JY,IX(J)+JX)
```

Cari larik yang menyimpan medannya. **Tidak ada.** Satu-satunya `DIM` di seluruh
berkas adalah `PL$(4)` dan `CH(4)` — nama pemain dan kode huruf droid.
Satu-satunya tempat bijih disimpan adalah **buffer video**, dan permainan
membacanya kembali dengan `SCREEN(y,x)`, fungsi GW-BASIC yang mengembalikan kode
karakter di sebuah sel layar.

Pola *layar sebagai struktur data* muncul di banyak berkas koleksi ini —
[SPACE](space.md), [METEOR](meteor.md), [SERPENT](serpent.md),
[ATTACK](attack.md), [PAC-GAL](pac-gal.md), [SUB](sub.md) semuanya memakai layar
sebagai keadaan. Tapi hanya di sini programnya benar-benar **membaca layarnya
sendiri** untuk mengetahui isi dunianya. Yang lain menulis ke layar dan menyimpan
salinannya di larik; berkas ini tidak punya salinan.

Konsekuensinya nyata dan tidak halus:

- Menghapus satu karakter dengan spasi = menghapus sepotong bijih.
- Menggulir layar = mengacak seluruh papan.
- Mengubah `WIDTH 40` (baris 1090) = mengubah geometri permainan.
- Papan pemain dan papan program adalah benda yang sama persis.

Akibat langsungnya ada di baris 2230: sel yang sudah dimakan ditulisi
`CHR$(0)`, **bukan spasi**. Karena itu baris 2229 harus memeriksa
`CT=0 OR CT=32` — dua cara berbeda untuk kosong, dan keduanya harus ditangani
karena layar bisa berisi keduanya.

Port ini memakai larik `sel[y][x]` — satu-satunya cara yang masuk akal di web —
tapi bentuk pemeriksaannya dipertahankan: sebuah fungsi `baca(x, y)` yang
mengembalikan `KOSONG` untuk apa pun di luar papan, persis seperti `SCREEN()`
mengembalikan 0 untuk sel layar yang belum ditulis.

---

## 2 · Empat bijih hilang tanpa pernah dihitung

```basic
1910 IX(J)=INT(15*RND)+5
1920 IY(J)=INT(10*RND)+3
1930 CHT=SCREEN(IY(J),IX(J)):IF CHT<>ORE THEN 1910
1940 LOCATE IY(J),IX(J):PRINT CHR$(CH(J))
```

Papannya **15 × 10 = 150 sel**, semuanya berisi bijih (`ORE = 254`, karakter ■).
Tiap droid *harus* mendarat di sel berbijih — baris 1930 mengulang undian sampai
dapat, yang sekaligus mencegah dua droid berdiri di tempat yang sama, karena sel
yang sudah ditempati tidak lagi berisi `ORE`.

Lalu droid itu menimpanya. Waktu ia pindah, baris 2230 mengosongkan sel asalnya
**tanpa menambah angka**. Jadi angka maksimum yang bisa dikumpulkan seluruh
pemain adalah **146**, bukan 150.

Papan port ini menghitung sisanya terhadap 146. Diperiksa pada satu pertandingan
penuh: 64 + 62 terkumpul, 20 tersisa di papan, dan 126 + 20 = **146 tepat**.

---

## 3 · Berhenti dengan bijih yang masih tergeletak

```basic
2310 FOR J=1 TO 4
2320  FOR JX=-1 TO 1
2330   FOR JY=-1 TO 1
2340    CT=SCREEN (IY(J)+JY,IX(J)+JX)
2350    IF CT=ORE THEN STP$="NO"
```

Syarat berhentinya bukan bijih habis, melainkan **tidak ada droid yang
bersebelahan dengan bijih**. Keempat droid bisa terkurung di petak kosong yang
mereka buat sendiri sementara bijih masih menumpuk di sudut yang jauh.

Disimulasikan 200 papan dengan langkah acak sampai buntu:

| | |
|---|--:|
| berhenti dengan bijih tersisa | **200 dari 200 (100 %)** |
| rata-rata yang tertinggal | **44,5 bijih** |

Tiga puluh persen ladang tidak pernah terpanen, setiap kali. Itu bukan cacat —
justru itu yang membuat permainannya punya taktik: menggiring droid ke tepi
lebih awal berarti mengunci ladangnya sendiri. Tapi aslinya tidak pernah
menyebutnya, dan pemain baru akan mengira permainannya rusak.

---

## 4 · Satu-satunya benih yang benar-benar lebar

```basic
1890 RANDOMIZE VAL(MID$(TIME$,7,2)+MID$(TIME$,4,2))
```

Perhatikan urutannya: `MID$` menyambung **detik** dengan **menit** sebagai
*teks*, baru hasilnya di-`VAL`. Jadi detik 35 dan menit 12 menjadi `3512` —
**3.600 benih yang mungkin**, bukan 60.

| berkas | caranya | ruang benih |
|---|---|--:|
| [WILDCAT](wildcat.md) | `RANDOMIZE(RND*30000)` | 60 (tidak menambah apa pun) |
| [GOLF](golf.md) | menyemai ulang selagi menunggu tombol | 60, tapi pemain yang memilih |
| [FOOTBALL](football.md) | menyemai ulang dari detik tiap permainan | 60 |
| **DROIDS** | menyambung detik dengan menit | **3.600** |

Yang benar-benar melebarkan ruang benihnya justru berkas paling sederhana di
antara semuanya — 183 baris melawan 449 dan 361 — dan caranya hanya menyambung
dua potongan `TIME$` sebelum mem-`VAL`-nya. Kadang perbaikan yang benar memang
lebih pendek daripada perbaikan yang salah.

---

## 5 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan sebagai karakter ■ di layar teks 40 kolom | tidak ada memori untuk larik | Layar = keadaan | **Petak SVG** dengan larik `sel[y][x]`. Bentuk pemeriksaannya dipertahankan: `baca(x,y)` mengembalikan kosong di luar papan, seperti `SCREEN()` |
| Droid = satu huruf `CHR$(65..68)`; bijih = satu karakter `CHR$(254)` | sel layar hanya muat SATU karakter, dan papannya adalah buffer video | Rupanya bukan pilihan, melainkan batas | **Digambar sebagai benda**: robot penambang beroda rantai dengan visor dan lencana dada, dan bongkahan bijih bersegi. Hurufnya **tetap ada** di dada tiap robot — ia identitas yang dipakai aturan (baris 2060 mencocokkan masukan dengan `CHR$(CH(J))`), jadi ia tidak boleh hilang hanya karena gambarnya jadi lebih bagus. Keempat robot dibedakan **warna dan bentuk antena** sekaligus, supaya tetap terbedakan kalau warnanya tidak terlihat. Bentuk bongkahan diundi dari **posisi selnya**, bukan dari pengacak, jadi ladangnya tidak berkedip tiap kali papan digambar ulang |
| Ketik huruf droid, Enter, ketik arah, Enter | `INPUT` satu-satunya masukan | — | Tombol huruf lalu **kompas delapan arah**, disusun seperti kompas di baris 1260–1330 |
| Arah yang sah tidak ditandai | tidak ada tempat di layar | Pemain harus membacanya sendiri dari papan | **Arah sah disorot.** Ini menambah pengetahuan, bukan aturan — arah tak sah tetap bisa ditekan dan tetap menghasilkan `ILLEGAL MOVE` |
| `ILLEGAL MOVE` tidak memindahkan giliran (3030 → 1130) | — | — | **Dipertahankan**, dan disebut di panel |
| Nama pemain diketik satu per satu | — | — | Otomatis `PLAYER 1..4`; yang menentukan hanya jumlahnya |
| `CHR$(0)` untuk sel kosong | `SCREEN()` mengembalikan 0 untuk sel yang belum ditulis | — | Tetap dibedakan dari spasi di dalam kode, dan dijelaskan di panel |
| `RANDOMIZE` dari jam | tidak ada sumber acak | — | Kotak **Benih**: papan yang sama bisa dimainkan ulang. Sifat 3.600-nya dijelaskan, tidak ditiru |
| `SAMPLE$="YES"` di baris 1030 | — | Baris mati: hanya dicapai lewat `GOTO 1030` sesudah `LOAD`/`CHAIN` | Dibuang |

---

## 6 · Latihan

1. Mainkan sampai buntu dan jumlahkan skor semua pemain ditambah bijih tersisa.
   Hasilnya selalu **146**.
2. Gerakkan satu droid bolak-balik di tengah papan sampai ia terkurung. Berapa
   bijih yang tersisa di sudut?
3. Pilih droid lalu tekan arah yang tidak disorot. Giliran tidak berpindah —
   itu perilaku baris 3030, bukan kelonggaran.
4. Main dengan satu pemain. Permainannya jadi teka-teki: berapa banyak dari 146
   yang bisa Anda kumpulkan sebelum keempat droid terkunci?
5. Papan yang sama, benih yang sama, urutan langkah yang sama → hasil yang sama.
   Di aslinya tidak, karena benihnya jam — walaupun jamnya 3.600 kali lebih
   halus daripada tetangganya.

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/DROIDS.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
