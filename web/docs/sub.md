# SUB — program yang lebih banyak `POKE` daripada baris

> `run/SUB.BAS` · 317 baris, **374 pernyataan `POKE`**
> · [pakai portnya](../games/sub/index.html) ·
> [analisis BASIC aslinya](../../reviews/SUB.md)

---

## 1 · Lebih banyak `POKE` daripada baris

Peta laut dan potongan melintang kapal selamnya **tidak digambar dengan
`PRINT`**. Keduanya ditulis langsung ke memori video, satu bita aksara per sel:

```basic
 960 POKE 76,215:A=88:POKE A,176:POKE A+2,176:POKE A+4,176
1120 FOR A=840 TO 932 STEP 4:POKE A,177:POKE A+2,177:NEXT
```

Alamatnya alamat layar: `(baris−1)×160 + kolom×2 − 2` untuk bita aksara, `+1`
untuk atributnya. Menulis ke sana **melewati seluruh penafsir** — tidak ada
gulir, tidak ada kursor, tidak ada penyaringan aksara kendali.

Itulah satu-satunya cara menggambar aksara CP437 *mana pun* di posisi *mana
pun* tanpa efek samping. Bandingkan dengan [METEOR](meteor.md) yang harus
menambal **empat kali** supaya `PRINT` tidak memicu gulir di sel pojok — SUB
tidak butuh satu pun tambalan itu, karena ia tidak pernah memakai `PRINT` untuk
menggambar.

| | |
|---|--:|
| Baris | 317 |
| Pernyataan `POKE` | **374** |
| Pernyataan `PRINT` | 57 |

---

## 2 · Ia memilih segmen videonya dengan benar — dan satu program lain salah

```basic
590 IF (PEEK(1040) AND 48)=48 THEN DEF SEG=45056 ELSE DEF SEG=47104
```

Alamat 1040 = `0040:0010`, kata perlengkapan BIOS; bit 4–5 menyimpan jenis
adaptor. Nilai **48** (0x30) berarti **monokrom**, dan **45056** = 0xB000 memang
segmen MDA; sisanya **47104** = 0xB800, segmen CGA. **Benar.**

`WHATMONF.BAS` di koleksi yang sama memetakannya **terbalik** — monokrom ke
0xB800, CGA ke 0xB000. `SUB.BAS`, bersama `MAZE.BAS`, adalah buktinya.

> **Pelajaran.** Ini pemeriksaan yang **tidak bisa dilakukan dari satu berkas
> saja**. Membaca `WHATMONF.BAS` sendirian tidak memberi cara tahu mana yang
> benar; yang menentukan adalah dua program lain di disket yang sama yang
> sepakat pada pemetaan sebaliknya. Koleksi ini kadang jadi alat ujinya sendiri.

---

## 3 · `SCREEN()` sebagai penyangga simpan-pulihkan

```basic
800 V=SCREEN(X,Y):W=SCREEN(X,Y,1)
810 PRINT CHR$(15);:FOR D=1 TO 20*B:NEXT
820 POKE (X-1)*160+Y*2-1,W:POKE (X-1)*160+Y*2-2,V
```

Sebelum menggambar bom di suatu sel, program **membaca aksara dan atributnya**
dari layar; sesudah jeda, ia menulisnya kembali. Jadi bom yang melintas tidak
merusak peta di bawahnya.

Ini kemunculan **keenam** "layar sebagai struktur data" di koleksi ini, dan
keperluannya baru lagi:

| Program | Yang dibaca dari layar | Untuk apa |
|---|---|---|
| [SPACE](space.md) | latar | supaya `PUT…XOR` bisa menghapus dirinya |
| [METEOR](meteor.md) | seluruh dunianya | tabrakan **dan** penyimpanan |
| [SERPENT](serpent.md) | bentuk tubuhnya sendiri | struktur data |
| [ATTACK](attack.md) | aksara di bawah bom | **harga** |
| PAC-GAL *(dari EXE)* | ubin labirin | tabrakan |
| **SUB** | aksara **dan atribut** | **cadangan — apa yang harus dikembalikan** |

Perhatikan ia satu-satunya yang membaca **dua** hal: `SCREEN(X,Y)` untuk
aksaranya dan `SCREEN(X,Y,1)` untuk warnanya. Lima yang lain cuma butuh
aksaranya.

---

## 4 · Tabel balistik 24 entri di `DATA`

```basic
2020 DATA -1.85,-1.1,-.3,.45,1.2,2,-2.00,-1.2,-.5,.3,1.1,1.85
2030 DATA -2.15,-1.4,-.6,.15,.9,1.7,-2.3,-1.55,-.8,0,.8,1.55
 740 B=B(ABS(A-DROP))
```

Dua puluh empat bilangan, satu per kuadran, tersusun **6 kolom × 4 baris**
persis seperti petanya:

| | | | | | |
|--:|--:|--:|--:|--:|--:|
| −1,85 | −1,10 | −0,30 | 0,45 | 1,20 | 2,00 |
| −2,00 | −1,20 | −0,50 | 0,30 | 1,10 | 1,85 |
| −2,15 | −1,40 | −0,60 | 0,15 | 0,90 | 1,70 |
| −2,30 | −1,55 | −0,80 | 0,00 | 0,80 | 1,55 |

Nilainya simpangan mendatar bom per langkah: negatif ke kiri, positif ke kanan,
dan makin ke bawah makin condong ke kiri. Dihitung tangan, ditulis sebagai
`DATA`, dan dipakai supaya bom terlihat jatuh **menuju** kuadran yang dipilih.

Lintasannya sendiri memakai kosinus (`L=COS(E)*(3+ABS(B))+6`, baris 780), tapi
**ke mana** ia jatuh ditentukan dua puluh empat angka yang diketik satu per
satu. Trigonometri untuk bentuknya, tabel untuk arahnya.

---

## 5 · Kapal selamnya tidak pernah ada di baris tepi

```basic
440 A=FIX(RND*24):IF (A>6 AND A<11) OR (A>12 AND A<17) THEN 450 ELSE 430
470 ON FIX(RND*8) GOTO …          ' delapan arah: ±1, ±5, ±6, ±7
```

Kepala kapal selam hanya boleh di kuadran **H I J K** dan **N O P Q** — empat
kolom tengah dari dua baris tengah.

Alasannya praktis: baris 470–550 menaruh dua sel sisanya di salah satu dari
delapan arah pada kisi enam kolom, dan tanpa batasan itu tetangganya bisa jatuh
di luar kisi. **Cara menghindari indeks di luar batas tanpa memeriksa batas:
batasi titik awalnya.** Lebih murah daripada delapan pemeriksaan — dan ia
menjelma jadi aturan main.

### Dan itu yang membuat permainannya bisa dimenangkan

Torpedo musuh 50/50 dan Anda kalah pada torpedo ketiga, jadi harapan umur satu
permainan **6 giliran = 18 bom** melawan **72 sel**:

| Bom acak | Peluang ketiga sel terkena |
|--:|--:|
| 9 | 0,14% |
| **18** — harapan satu permainan | **1,37%** |
| 27 | 4,90% |
| 36 — separuh peta | 11,97% |

Bermain buta praktis mustahil. Kalau Anda tahu kepalanya hanya bisa di 8 dari 24
kuadran, kandidatnya turun dari 72 sel jadi **24** — dan karena ketiganya
bersambungan, begitu satu sel kena sisanya paling banyak delapan tebakan.

Diverifikasi di port: dua belas permainan dengan pengebom otomatis yang
memprioritaskan zona kepala menghasilkan satu kemenangan, dan sel yang
ditemukannya **J–K–L tingkat 1** — tiga sel segaris berjarak satu, kepala di K,
di dalam zona sah.

---

## 6 · Tiga lagu, tiga keadaan

| Baris | Kapan | Lagu |
|--:|---|---|
| 2050 | mulai | *Anchors Aweigh* |
| 2710 | menang | *Battle Hymn of the Republic* |
| 2640 | kalah | *Taps* |

Ketiganya makro `PLAY` yang diketik penuh, dan dimainkan apa adanya di port ini.
*Taps* untuk kalah bukan lelucon — itu lagu pemakaman militer, dan ia dipilih
dengan sengaja.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Menggambar | 374 `POKE` ke memori video (§1) | `PRINT` memicu gulir dan menyaring aksara kendali | **Tidak diport sebagai mekanisme** — peramban tidak punya memori video. **Dicatat**, karena itu temuan utamanya, dan karena ia menjelaskan kenapa program ini tidak butuh satu pun tambalan gulir |
| Kisi miring | `POKE A+156` = +1 baris, −2 kolom (640–660) | — | **Dipertahankan sebagai bentuk**: tiap baris petak digeser ke kiri. Kemiringannya milik programnya, bukan selera |
| Segmen video | `PEEK(1040) AND 48` (§2) | dua jenis kartu | Tidak relevan di peramban. **Dicatat**, dan dipakai sebagai bukti bahwa `WHATMONF.BAS` keliru |
| `SCREEN()` simpan-pulihkan | baca aksara **dan** atribut (§3) | tidak ada lapisan gambar | Di port, bomnya digambar di lapisannya sendiri — jadi tidak perlu dipulihkan. **Dicatat**, karena keperluannya yang menarik |
| Tabel balistik | 24 entri `DATA` (§4) | tidak ada trigonometri yang murah | **Dipakai apa adanya**: nilainya menentukan simpangan bom, dan tabelnya ditampilkan di panel dari datanya sendiri |
| Penempatan kapal selam | kepala dibatasi 8 kuadran (§5) | menghindari indeks di luar batas | **Dipertahankan persis**, dan dijelaskan — karena itu satu-satunya pengetahuan yang membuat permainannya bisa dimenangkan |
| Memilih sasaran | dua tuts: tingkat lalu huruf (300–380) | tidak ada tetikus | **Klik langsung di petaknya**, plus Tab + `Enter`. Petaknya seukuran kuadrannya |
| Balasan musuh | `MISS=FIX(RND*2)` — 50/50 (260) | — | **Dipertahankan persis** |
| Tiga lagu | makro `PLAY` (§6) | — | **Dimainkan apa adanya** lewat penafsir `_shared/audio.js` |
| Animasi bom | `FOR…NEXT` di dalam gelung gambar | tidak ada pewaktu | Digerakkan `loop.js` (rAF langkah tetap), **bukan `setInterval`** — yang dicekik jadi ≥1 detik di tab latar belakang |
| Pengungkapan saat kalah | **tidak ada** — aslinya tidak pernah memberi tahu di mana kapal selamnya | — | **Tambahan.** Atas permintaan pemilik koleksi: sesudah kalah, badan kapal selam digambar melintasi ketiga selnya, selnya diberi garis putus, dan kuadrannya disebut dengan kata. Lihat §7b |
| Keluar | `RUN "menu"` lewat `ON KEY(10)` | tiap program berkas terpisah | Tautan kembali di bilah atas |

### 7b · Pengungkapan saat kalah, dan kenapa ia perlu

Aslinya tidak pernah memberi tahu di mana kapal selamnya berada. Anda kalah,
dan itu saja.

Permintaan pemilik koleksi: **ungkap posisinya saat kalah, supaya bisa
dibuktikan bahwa kapal selamnya memang tergambar dengan benar dan bom yang
meleset memang meleset.** Itu bukan sekadar kenyamanan — ia menutup satu-satunya
lubang kepercayaan yang tersisa di port ini. Selama posisinya tak pernah
diperlihatkan, "meleset" dan "cacat" terlihat sama persis dari kursi pemain.

Yang membuatnya bisa dikerjakan: posisi aslinya disimpan **terpisah**.

```js
kapal = [a, a + d, a - d];      // baris 560
kapalAsli = kapal.slice();      // salinan, kepala di indeks 0
```

`kapal` tidak bisa dipakai, karena baris 200–220 menimpanya dengan `99` begitu
sebuah sel kena — itu cacat yang sama yang sempat membuat tanda merah menghilang
sendiri, dan sekarang ia muncul lagi dalam bentuk lain.

Yang digambar: badan kapal selam yang **melintasi ketiga sel**, diputar
mengikuti sumbunya, plus garis putus di tiap selnya, plus kalimat yang menyebut
tingkat dan kuadrannya.

Sudut putarnya diambil dari **geometri yang benar-benar digambar**, bukan dari
kisi logis — karena petaknya miring (§7, `POKE A+156`), sepasang sel yang
"lurus ke bawah" secara logis tergambar menyerong. Diverifikasi:

| Kasus | Kuadran | Selisih indeks | Sudut gambar |
|---|---|--:|--:|
| Mendatar | M · **N** · O, tingkat 3 | 1 | 0,00° |
| Menurun | B · **H** · N, tingkat 2 | 6 | 118,81° |
| Menurun | E · **K** · Q, tingkat 3 | 6 | ~119° |

Ketiganya menandai tepat tiga sel, dan kepalanya selalu di zona sah §5.

---

## 8 · Latihan

1. **Hitung ulang alamat layarnya.** Baris 960 menulis ke alamat 76. Baris dan
   kolom berapa itu, dan kenapa jawabannya bukan bilangan bulat kalau Anda lupa
   bahwa tiap sel memakan **dua** bita?

2. **Cari tambalan yang tidak ada.** [METEOR](meteor.md) punya empat pertahanan
   untuk sel (24,80). Tunjukkan kenapa SUB tidak butuh satu pun.

3. **Petakan tabel balistiknya.** Nilai baris terakhir kolom keempat adalah
   `0,00`. Kuadran mana itu, dan kenapa masuk akal bahwa justru di situ bomnya
   jatuh lurus?

4. **Ukur peluang menang yang sebenarnya.** §5 memakai bom acak. Hitung ulang
   dengan strategi yang memakai batasan kuadran, dan bandingkan.

5. **Periksa pengungkapannya.** Kalah dengan sengaja, lalu cocokkan lingkaran
   biru (meleset) dan merah (kena) dengan badan kapal selam yang diungkap.
   Kalau ada lingkaran biru yang jatuh di atas badannya, itu cacat &mdash;
   temukan di baris mana.

---

Berkas terkait: [pakai](../games/sub/index.html) ·
[METEOR](meteor.md) — yang harus menambal `PRINT` empat kali ·
[SERPENT](serpent.md) · [ATTACK](attack.md) · [ZAP'EM](zapem.md)
