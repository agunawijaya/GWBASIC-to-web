# LIFE2 — dari BASIC 1983 ke web

| | |
|---|---|
| Sumber | `run/LIFE2.BAS` — public domain, oleh **John Sigle**, 21 Februari 1983 |
| Ukuran asli | 188 baris (nomor 1–65005) |
| Hasil port | [`../games/life2/`](../games/life2/index.html) |
| Analisis BASIC | [`../../reviews/LIFE2.md`](../../reviews/LIFE2.md) |

Game of Life karya Conway. Aturannya empat baris dan semua orang tahu — jadi
yang membuat program ini layak dibaca bukan aturannya, melainkan **cara ia
menghitungnya**. Ini algoritma paling maju di seluruh koleksi, dan ditulis
oleh satu-satunya penulis di sini yang gaya kodenya sudah modern pada 1983.

---

## 1 · Biayanya sebanding populasi, bukan luas papan

Cara paling lurus menghitung satu generasi adalah memindai seluruh papan:

```
21 baris × 78 kolom = 1638 sel, tiap generasi, selamanya
```

Di prosesor 4,77 MHz itu terasa. Dan yang lebih buruk: papan yang isinya cuma
satu *glider* berlima **tetap membayar penuh**.

LIFE2 tidak melakukan itu.

```basic
58  DIM CLIST(1,1500,1), LLEN(1)
```

`CLIST` adalah **daftar sel yang hidup**. Generasi berikutnya dihitung dengan
hanya menyentuh sel-sel di daftar itu beserta kedelapan tetangganya:

```basic
4012 FOR K=1 TO LLEN(CUR)
4022   RN=CLIST(0,K,CUR):CN=CLIST(1,K,CUR)
4023   R=RN:C=CN:GOSUB 4100          ' hitung tetangganya
…
4041   R=RN-1:C=CN:GOSUB 4200        ' lalu periksa kedelapan tetangganya
4042   R=RN-1:C=CN+1:GOSUB 4200
…
4060 NEXT K
```

Sel mati yang tidak bertetangga dengan sel hidup mana pun **tidak pernah
disentuh**. Papan kosong tidak menghabiskan waktu sama sekali.

Kernelnya diuji ulang terhadap pindai-penuh sebagai pembanding — keduanya
harus menghasilkan papan yang identik di setiap generasi:

| Pola | Cocok dengan pindai penuh? | Rata-rata sel diperiksa | Penghematan |
|---|---|--:|--:|
| Glider (40 generasi) | ya | 22,0 dari 1638 | **74,5×** |
| Blinker (8 generasi) | ya | 15,0 | 109,2× |
| Blok (8 generasi) | ya | 16,0 | 102,4× |
| Acak 120 sel (30 generasi) | ya | 148,1 | 11,1× |

Baris terakhir itu yang paling jujur: **penghematannya menyusut saat papannya
padat.** Kalau seluruh 1638 sel hidup, daftar itu justru menambah pekerjaan.

> **Pelajaran.** Algoritma ini menang karena sebuah sifat *data*-nya, bukan
> karena lebih pintar: Life hampir selalu **jarang**. Pola yang menarik
> menempati beberapa persen papan, bukan setengahnya.
>
> Pertanyaan yang tepat sebelum memilih struktur data bukan "mana yang lebih
> cepat", melainkan **"seperti apa data saya biasanya"**. Jawaban yang berbeda
> memberi pemenang yang berbeda.

### Dua bentuk dari data yang sama

Yang membuatnya bekerja adalah memelihara **dua** representasi berdampingan:

| | Bentuk | Menjawab pertanyaan |
|---|---|---|
| `G(baris, kolom, gen)` | papan penuh | "sel ini hidup?" — satu langkah |
| `CLIST(...)` + `LLEN` | daftar | "yang mana saja yang hidup?" — tanpa memindai |

Larik menjawab **apakah ada**; daftar menjawab **yang mana saja**. Salah satu
saja tidak cukup: tanpa larik, menghitung tetangga jadi pencarian linier;
tanpa daftar, mengulangi sel hidup jadi pemindaian 1638 sel.

Itu persis pola `Set` + `Array` yang masih dipakai hari ini — ditulis pada 1983
dengan bahan seadanya, karena BASIC tidak punya keduanya.

Harganya juga khas: **dua bentuk harus dijaga tetap sepakat.** Baris 2070–2078
memperlihatkan biayanya — menghapus satu sel menuntut mencarinya di daftar,
lalu menggeser seluruh sisanya:

```basic
2072  FOR K=LLEN(CUR) TO 1 STEP -1
2073    IF CLIST(0,K,CUR)=RN AND CLIST(1,K,CUR)=CN THEN GOTO 2075
2074  NEXT K  :  STOP
2075  FOR J=K TO LLEN(CUR)-1
2076   CLIST(0,J,CUR)=CLIST(0,J+1,CUR):CLIST(1,J,CUR)=CLIST(1,J+1,CUR)
2077  NEXT
```

Perhatikan `STOP` di baris 2074: kalau selnya hidup di `G` tapi tidak ada di
`CLIST`, kedua bentuknya sudah tidak sepakat, dan program **berhenti total**.
Itu bukan penanganan galat — itu `assert`. Penulisnya tahu bahwa kalau
invariannya patah, melanjutkan hanya akan menghasilkan sampah.

---

## 2 · Dua papan yang bertukar peran

```basic
55  DIM G(NROWS+1,NCOLS+1,1)
376 SWAP CUR,NXT
```

Dimensi ketiga berukuran dua. `CUR` dan `NXT` cuma dua angka (0 dan 1), dan
berganti generasi berarti **menukarnya** — tidak ada satu pun sel yang disalin.

Namanya *double buffering*, dan kartu grafis Anda memakainya sekarang untuk
alasan yang persis sama: menulis ke satu penyangga sambil yang lain
ditampilkan, lalu tukar.

Dan `SWAP` adalah kata kunci BASIC sungguhan — bukan tiga baris dengan
variabel sementara. Salah satu tempat di mana BASIC 1981 lebih ringkas daripada
JavaScript sebelum ES6.

---

## 3 · Komentar terbaik di seluruh koleksi

```basic
52     C=0:R=0:CUR=0:NXT=1:NN=0:CR=0:RN=0       'Mention early for efficiency
```

Baris yang terlihat tidak berguna: menyetel nol ke variabel yang memang sudah
nol. Tanpa komentarnya, orang berikutnya akan menghapusnya.

Komentarnya menjelaskan hal yang **tidak terbaca dari kodenya**: GW-BASIC
menyimpan variabel dalam tabel menurut urutan pertama kali disebut, dan
mencarinya secara **linier**. Menyebut variabel yang paling sering dipakai
lebih dulu menaruhnya di depan tabel, sehingga tiap pembacaan lebih cepat.

Di dalam kernel yang membaca `G`, `R`, `C`, dan `NN` ribuan kali per generasi,
itu bukan optimasi mikro yang sia-sia — itu di jalur terpanas program.

> **Pelajaran.** Komentar yang baik tidak mengulang apa yang dilakukan kode
> (`' set C to 0`). Ia menjelaskan **kenapa baris ini ada** — terutama ketika
> jawabannya tidak ada di dalam berkas itu, melainkan di dalam kepala
> penerjemahnya.
>
> Ini juga peringatan tentang batas berlakunya: nasihat itu benar untuk
> GW-BASIC, dan tidak berarti apa-apa untuk JavaScript. Komentar tentang
> kinerja perlu menyebutkan **mesin apa** yang dimaksud.

---

## 4 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Algoritma | Daftar sel hidup + papan penuh | Prosesor 4,77 MHz | **Dipertahankan**, dan penghematannya ditampilkan sebagai angka hidup di layar |
| Papan | `G(NROWS+1, NCOLS+1, 1)` dengan pagar nol | Menghindari pengecekan tepi | Dipertahankan: larik lurus dengan pagar keliling, sama seperti [TICTAC](tictac.md) |
| Dua generasi | `SWAP CUR,NXT` | Menghindari penyalinan 1638 sel | Perubahan dikumpulkan lalu diterapkan sekaligus — maksud yang sama, tanpa dua papan |
| Menggambar | Kursor panah + `M` menyalakan, spasi memadamkan | Tidak ada tetikus | Dipertahankan — **dan** ditambah klik-seret |
| Bunyi tiap generasi | `SOUND 700,.1` (baris 378) | — | Dipertahankan |
| Kecepatan | `FOR K=1 TO 2000:NEXT` | Tidak ada pewaktu | Penggeser kecepatan; lihat [fondasi §2.2](_fondasi.md) |
| Pola siap pakai | **tidak ada** | — | Ditambahkan (glider, blinker, kodok, pentomino R, meriam glider) |
| Berhenti sendiri | tidak ada | — | Ditambahkan: kalau tidak ada sel yang berubah, simulasi berhenti dan mengatakannya |
| Panel "Cara memakai" | layar petunjuk sebelum mulai | — | Ditambahkan kembali, dan dibuka dengan kalimat *"Ini bukan permainan"* — lihat di bawah |

### Kalimat pertama yang paling penting: "Ini bukan permainan"

Versi pertama halaman ini tidak menjelaskan apa pun tentang Life. Ia
menampilkan papan kosong, tombol **Jalankan**, dan tiga panel yang membahas
algoritmanya. Semuanya benar, dan semuanya menjawab pertanyaan yang belum
ditanyakan.

Pertanyaan yang benar-benar diajukan orang saat membukanya adalah: *ini
program apa? Permainan, atau cuma tontonan sambil klik-klik?*

Itu pertanyaan yang wajar, dan halaman ini tidak menjawabnya sama sekali —
sebagian justru karena **judulnya sendiri menyesatkan**. Conway menamainya
*Game of Life*, tapi ia bukan permainan dalam arti yang dipakai sisa koleksi
ini: tidak ada lawan, tidak ada skor, tidak ada menang atau kalah. Istilahnya
*permainan tanpa pemain* — Anda menentukan keadaan awal, aturannya berjalan
sendiri, dan yang Anda amati adalah akibatnya.

Yang membuat kelalaian ini mudah terjadi: setiap halaman lain di koleksi ini
adalah permainan sungguhan, jadi "cara bermain" berarti "tombol mana yang
ditekan". Di sini jawaban itu tidak cukup, karena masalahnya bukan pemain
tidak tahu cara menekan tombol — ia tidak tahu **untuk apa**.

> **Pelajaran.** Sebuah halaman boleh menjelaskan cara memakai sesuatu dengan
> sempurna dan tetap gagal, kalau ia melewatkan kalimat yang menerangkan
> *benda apa ini*. Panel petunjuk yang menganggap kategorinya sudah jelas akan
> selalu terbaca sebagai jawaban atas pertanyaan yang salah.

Aslinya, menariknya, **tidak** melakukan kesalahan ini. LIFE2.BAS punya rutin
petunjuk sendiri (baris 1000 ke atas), dan ia menyatakan aturannya lengkap:

```basic
1128 PRINT "  1.  A bacteria with 2 or 3 neighbors survives from one generation to "
1130 PRINT "      the next.  A bacterium with fewer neighbors dies of isolation."
1132 PRINT "      One with more neighbors dies of overcrowding."
1136 PRINT "      neighboring cells which contain bacteria."
```

Perhatikan juga baris 1122: *"has 8 neighbors except that cells on the boundry
have less than 8"* — papannya bertepi keras, tidak membungkus, dan penulisnya
menyebutkan itu di petunjuknya. Yang hilang, hilang saat diport; sekarang
dikembalikan dalam Bahasa Indonesia, dengan satu kalimat tambahan di depan
yang tidak dibutuhkan pemakai 1983 karena mereka tidak mengira sedang membuka
sebuah permainan.

### Kenapa pola siap pakai ditambahkan

Ini deviasi yang paling besar, jadi alasannya perlu jelas.

Life tanpa contoh pola sulit dimasuki. Corat-coret acak hampir selalu mati atau
membeku dalam beberapa generasi, dan orang menyimpulkan programnya rusak —
padahal itu memang perilaku Life. Sebuah *glider* menjelaskan seluruh daya
tarik permainannya dalam empat generasi.

Aslinya tidak menyediakannya karena tempat memang tidak ada: 188 baris sudah
termasuk layar petunjuk, editor pola, dan kernelnya.

---

## 5 · Latihan

1. **Bandingkan dua algoritma.** Tulis versi pindai-penuh (dua perulangan
   bersarang atas 1638 sel), jalankan berdampingan dengan versi daftar, dan
   pastikan keduanya menghasilkan papan yang identik di tiap generasi. Lalu
   ukur: pada populasi berapa versi daftar mulai **kalah**?

2. **Papan melingkar.** Pagar nol membuat tepi papan mematikan. Ubah supaya
   tepi kiri bersambung ke tepi kanan (torus). Apa yang terjadi pada sebuah
   glider yang menabrak tepi? Dan apa yang harus berubah pada pagarnya?

3. **Hidupkan `STOP` di baris 2074.** Rusak dengan sengaja kesepakatan antara
   `G` dan `CLIST` — misalnya hapus sel dari larik tanpa menghapusnya dari
   daftar. Berapa generasi sampai akibatnya terlihat? Sekarang bayangkan
   mencari bug itu tanpa `assert`.

4. **Ubah aturannya.** Aturan Conway ditulis B3/S23 — lahir kalau tepat 3
   tetangga, bertahan kalau 2 atau 3. Coba B36/S23 ("HighLife"), yang punya
   pola yang bisa menggandakan diri. Berapa baris yang harus diubah?

5. **Ukur kepadatan.** Isi papan secara acak pada kepadatan 5%, 20%, 50%, dan
   ukur berapa sel yang diperiksa tiap generasi. Gambarkan grafiknya. Di mana
   titik impasnya, dan apakah itu cocok dengan tebakan Anda di latihan 1?

---

Berkas terkait: [mainkan](../games/life2/index.html) ·
[TICTAC — pagar sentinel juga](tictac.md) · [fondasi](_fondasi.md) ·
[TOWERS](towers.md) · [MASTER](master.md)
