# STATS — sepuluh angka cuma-cuma untuk regu pertama

> Port web: [`web/games/stats/`](../games/stats/index.html) ·
> Sumber: [`run/STATS.BAS`](../../run/STATS.BAS) (449 baris) ·
> Analisis BASIC: [`reviews/STATS.md`](../../reviews/STATS.md)

Bukan permainan. *Sports Menu* dari Friendlyware adalah **penilai regu football
berbasis biorhythm**: masukkan tanggal lahir 22 pemain untuk dua regu dan
tanggal pertandingan, dan ia mencetak satu angka *Team Evaluation* untuk
masing-masing.

---

## 1 · Regu 0 diberi sepuluh angka, tanpa syarat dan tanpa keterangan

```basic
2820  NEXT B
2830  IF A=0 THEN AVG!(A)=AVG!(A)+10
2840  TEAMAVG(A)=AVG!(A)/22 : ...
2330  PRINT USING " ####.##"; TEAMAVG(0)*100
```

Regu **0** — regu pertama yang Anda buat — mendapat tambahan 10 pada jumlah
bobotnya sebelum dibagi 22 dan dikalikan 100 di layar. Nilainya tetap:

```
10 / 22 × 100 = 45,45 angka, setiap kali, apa pun tanggal lahirnya
```

Pada benih bawaan halaman ini:

| | regu 0 | regu 1 |
|---|--:|--:|
| dengan baris 2830 | **732,20** | 723,86 |
| tanpa baris 2830 | 686,74 | **723,86** |

Pemenangnya berbalik. Dan itu bukan kebetulan benih: menyapu **300 benih**,
bonus itu sendiri yang menentukan pemenang pada **57 di antaranya — 19 %**.
Satu dari lima perbandingan dimenangkan oleh sebaris kode yang tidak pernah
disebut di layar.

Mungkin ini dimaksudkan sebagai *home field advantage*. Tapi tidak ada satu pun
kata di seluruh 449 baris yang menyebutnya, layar tidak pernah menandainya, dan
pemakai yang membandingkan dua regu tidak punya cara mengetahuinya. Halaman port
ini menghitung kedua angka — dengan dan tanpa baris 2830 — berdampingan.

---

## 2 · Setengah tabel kurvanya dibaca lalu dilupakan

```basic
2870 FOR B=0 TO 1
2880  FOR A=1 TO 23:READ D(0,A,B):NEXT
2890  FOR A=1 TO 28:READ D(1,A,B):NEXT
2900  FOR A=1 TO 33:READ D(2,A,B):NEXT
2910 NEXT

1630 Z(B,3,T)=STR$(D(0,W,0))
1650 Z(B,5,T)=STR$(D(1,W,0))
1670 Z(B,7,T)=STR$(D(2,W,0))      ' indeks ketiga selalu 0, harfiah
```

Dua lapis dibaca, 84 angka masing-masing. Ketiga tempat yang memakainya menulis
`, 0)` sebagai angka mati. **Lapis kedua — 84 angka dari `DATA 3050` sampai
`3070` — masuk ke memori lalu tidak pernah disebut lagi.**

Kurvanya benar-benar berbeda: lapis 0 memuncak di 7,5, lapis 1 hanya sampai 3.
Ia tampak seperti skala kedua yang lebih tumpul — mungkin untuk olahraga lain,
mungkin untuk tingkat kesulitan.

Ini pengulangan persis dari `DATA 3030` di [FOOTBALL](football.md) §3: dua
program Friendlyware, satu kebiasaan yang sama — tabel varian ditulis lengkap,
dibaca ke memori, lalu tidak pernah disambungkan. Di FOOTBALL yang mati 50
angka; di sini 84.

---

## 3 · Hari kritis tidak terasa sama sekali

```basic
2710 DD=3
2720 TOT1=VAL(Z(B,3,A)):IF TOT1=0 THEN DD=DD-1
2730 TOT2=VAL(Z(B,5,A)):IF TOT2=0 THEN DD=DD-1
2740 TOT3=VAL(Z(B,7,A)):IF TOT3=0 THEN DD=DD-1
2750 IF DD=0 THEN AVG!=0:GOTO 2790
2760 AVG!=(TOT1+TOT2+TOT3)/DD
```

Nilai nol adalah **hari kritis** — titik ketika daur menyeberangi garis tengah,
dan dalam seluruh gagasan biorhythm justru hari yang paling berbahaya. Tapi
baris 2720–2740 tidak menjumlahkan nolnya; ia **mengecilkan pembaginya**.

Akibatnya, seorang pemain dengan dua hari kritis dan satu daur di puncak 7,5
mendapat rata-rata **7,5** — sama persis dengan pemain yang ketiga daurnya di
puncak. Hari kritis bukan hanya tidak menghukum; ia **menghilang**.

Dihitung dari tabelnya sendiri:

| daur | hari kritis | bagian |
|---|--:|--:|
| Physical (23) | 2 | 8,7 % |
| Emotional (28) | 2 | 7,1 % |
| Intellectual (33) | 2 | 6,1 % |

Ketiganya nol bersamaan — satu-satunya keadaan yang membuat pembagi jadi nol dan
ditangkap baris 2750 — terjadi **8 dari 21.252 hari (0,0376 %)**. Seluruh
polanya berulang tiap 21.252 hari, kira-kira **58,2 tahun**.

---

## 4 · Yang justru sangat baik

```basic
1710 W=FIX((MONTH-14)/12)
1720 JD=INT(1461*(YEAR+4800+W)/4)
1730 X=FIX(367*(MONTH-2-W*12)/12)
...  JD=JD+DAY-32075
```

Itu algoritma **Fliegel–Van Flandern** yang sungguhan — rumus tanggal Julian
yang diterbitkan di *Communications of the ACM* tahun 1968 — ditulis tangan
dengan `INT` dan `FIX` yang tepat di tempat yang tepat. Selisih hari antara dua
tanggal apa pun jadi benar, termasuk melintasi tahun kabisat dan aturan abad.
Di tengah program yang memberi satu regu bonus rahasia, bagian tanggalnya
justru tanpa cela.

Baris 30 juga cerdas: `FILES "menu.bas"` dipakai untuk **mendeteksi** apakah
disket yang terpasang adalah disket program dan bukan disket data. Prasyarat
yang diperiksa dari isi, bukan ditanyakan kepada pemakai.

Dan `AVG!(21)` — akhiran `!` memaksa presisi tunggal untuk satu variabel di
tengah `DEFINT A-C`. Rata-rata memang tidak boleh dibulatkan. Menimpa tipe
bawaan **untuk satu variabel yang memang membutuhkannya** adalah penggunaan
akhiran tipe yang benar.

Satu batas yang tidak bisa dihindari: baris 1590 `YEAR=1900+VAL(MID$(Z,7,2))` —
tahun dua digit, jadi tidak ada tanggal lahir sesudah 1999.

---

## 5 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| Menu enam pilihan A–F, roster diketik satu per satu ke disket | tidak ada penyimpanan lain | Memasukkan 44 tanggal sebelum melihat apa pun | **Roster langsung ada**, diundi dari benih yang bisa ditulis; tiap tanggal bisa disunting di tempat dan angkanya dihitung ulang seketika |
| Kurva biorhythm tidak pernah digambar | layar teks 80×25 | Angka tanpa bentuk | **Ketiga kurva digambar** dari `DATA 3010–3040`, dengan titik pada hari yang sedang berlaku. Ini menambah pengetahuan, bukan aturan — dan tanpanya §3 tidak bisa diperiksa |
| Kolom `DD` tidak pernah ditampilkan | — | Pembagi yang menyusut jadi tak terlihat | **Ditampilkan sebagai kolom**, dan nilai nol diberi warna. Perilakunya dipertahankan persis |
| Bonus +10 tidak pernah disebut | — | Pemakai tidak bisa tahu | **Dipertahankan**, dan angka tanpa bonus dihitung berdampingan supaya bisa dibandingkan |
| Lapis kedua tabel dibaca lalu diabaikan | — | — | **Dipertahankan** (tidak dipakai), tapi isinya ditampilkan dan dibandingkan dengan lapis 0 |
| Tahun dua digit, `1900 +` | `MID$` dua karakter | Tidak ada tanggal sesudah 1999 | Tahun empat digit. Ini perbaikan yang diambil karena aslinya tidak punya pilihan lain, bukan karena selera |
| Simpan/muat roster ke disket (`WRITE#`, baris 3430) | disket | — | Dibuang: benihnya sendiri sudah memulihkan seluruh roster |

---

## 6 · Latihan

1. Lihat kedua angka evaluasi, lalu bandingkan dengan baris "tanpa baris 2830".
   Selisihnya selalu 45,45 — tidak pernah berubah, apa pun rosternya.
2. Coba benih 1 sampai 20. Pada berapa di antaranya bonus itu sendiri yang
   memenangkan regu 0? (Dari 300 benih: 57.)
3. Cari pemain dengan kolom `DD` bernilai 1 atau 2 dan lihat kolom `×bobot`-nya.
   Bandingkan dengan pemain berbobot sama yang `DD`-nya 3.
4. Ubah tanggal main sejauh 21.252 hari (58,2 tahun) dan perhatikan bahwa
   seluruh kolom daurnya kembali persis sama.
5. Perhatikan bobot posisi: quarterback 5, middle linebacker 4, free safety 3.
   Seorang quarterback yang sedang di puncak menyumbang 37,5 dari total; seorang
   *left guard* hanya 7,5.

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/STATS.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
