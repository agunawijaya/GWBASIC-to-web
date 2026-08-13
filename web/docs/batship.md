# BATSHIP — permainan yang menolak memberi tahu Anda apa pun

> Port web: [`web/games/batship/`](../games/batship/index.html) ·
> Sumber: [`run/BATSHIP.BAS`](../../run/BATSHIP.BAS) (544 baris) ·
> Analisis BASIC: [`reviews/BATSHIP.md`](../../reviews/BATSHIP.md)

Ditulis oleh **G.S. Alberts** di **IBM Burlington, Vermont** — pabrik
semikonduktor di Essex Junction yang muncul sebagai sasaran **BTV** di
[ABM2A](abm2a.md) — dan direvisi terakhir **27 Juli 1982**. Ia menyatakan
dirinya *public domain* di baris 1010.

Sekilas ini Battleship biasa. Ia bukan. Dua keputusan rancangan membuatnya
permainan yang sama sekali lain, dan keduanya mudah terlewat kalau Anda hanya
menjalankannya sebentar.

---

## 1 · Papannya tidak pernah memberi tahu petak mana yang kena

Ini seluruh kode yang menulis ke papan permainan:

```basic
5830 A=((YY(TURN,J)*2)+3):B=((XX(TURN,J)*5)+4)
5840 LOCATE A,B
5850 PRINT TURN;
```

Nomor giliran. Titik. Tidak ada cabang kena, tidak ada warna, tidak ada aksara
lain. Petak yang menghantam kapal induk dan petak yang jatuh di laut kosong
**terlihat persis sama**.

Perhitungan kena baru berjalan sesudah ketiga tembakan (baris 5900–6010), dan
hasilnya ditulis ke **kartu skor**, bukan ke papan:

```basic
5940 IF FLIP=1 AND K<8 THEN HAC=HAC+1:DD=1
…
6080 LOCATE 4,56:PRINT TURN:RETURN
```

Jadi kabar yang Anda terima tiap giliran berbunyi: *"giliran ke-7 mengenai kapal
penjelajah, satu kali."* Tanpa alamat. Anda menembak **tiga** petak giliran itu,
jadi Anda tahu satu di antaranya kena — tapi tidak yang mana.

Dan penulisnya memastikan Anda tidak salah paham, di layar petunjuknya sendiri:

```basic
1400 PRINT:PRINT "HOWEVER THE PLACE WHERE THE SHOT IS RECORDED ON THE SCORECARD"
1410 PRINT "WILL NOT NECESSARILY BE THE PART OF THE SHIP HIT.  IS IS USED ONLY"
1420 PRINT "TO GIVE YOU A RECORD OF WHICH SHIPS YOU HIT ON WHICH TURNS."
```

Kotak yang terisi bukan bagian kapal yang kena; ia diisi berurutan.

Dari situ salvo tiga tembakan berubah artinya. Di Battleship biasa, menembak
tiga kali sekaligus hanyalah mempercepat. Di sini ia **alat pengaburan**: makin
banyak tembakan per giliran, makin kabur kabarnya. Permainan ini bukan soal
membidik, ia soal **menyusun eksperimen** — memilih tiga petak yang, apa pun
jawabannya, menyempitkan kemungkinan.

**Port ini tidak memperbaikinya.** Menandai kena akan membuatnya sepele dan
menghapus satu-satunya hal yang membuatnya menarik. Berkas `batship.css`
menyimpan aturan itu sebagai komentar di kepalanya, supaya penyunting berikutnya
tidak "membetulkan" apa yang tidak rusak.

---

## 2 · Kapal induknya berbentuk salib

```basic
2920 REM CHOOSE RANDOM NUMBERS FOR START OF SHIP, DIRECTION OF SHIP
     AND WHICH END OF THE AIRCRAFT CARRIER HAS THE CROSS
```

Bukan lima petak lurus — **tujuh**. Lima lurus, ditambah `X(6)` dan `X(7)` yang
melintang di salah satu ujung. Ujung mana ditentukan `E=INT(2*RND)+1`:

```basic
3100 IF E=1 THEN Y(6)=Y:Y(7)=Y            ' salib di kepala
3110 IF E=2 THEN Y(6)=Y(5):Y(7)=Y(5)      ' salib di ekor
```

Bentuknya:

```
     E = 1                     E = 2
       ▓                                 ▓
     ▓ ▓ ▓ ▓ ▓                 ▓ ▓ ▓ ▓ ▓ ▓ ▓        (lima lurus + dua melintang)
       ▓                                 ▓
```

Konsekuensinya menjalar ke seluruh program:

| | |
|---|--:|
| Petak kapal induk | 7 |
| Battleship | 5 |
| Cruiser | 4 |
| Destroyer | 3 |
| Sub | 2 |
| P.T. | 1 |
| **Jumlah** | **22** |

Dan 22 itulah angka yang menutup permainan:

```basic
1610 IF HAC+HB+HC+HD+HS+HPT=22 THEN GOTO 1650
```

Battleship standar memakai 17 petak. Program ini memakai 22, dan kartu
skornya **berbentuk kapalnya**: baris 6130 dan 6140 menaruh kotak keenam dan
ketujuh di baris 2 dan 6 — tepat di atas dan di bawah kotak pertama, membentuk
salib yang sama di atas kertas.

Karena bentuk salib punya sisi menonjol, satu petak kena pada kapal induk
memberi lebih banyak petunjuk daripada satu petak pada kapal lurus — sekaligus
lebih membingungkan, karena arah "sepanjang kapal" bisa berbelok.

---

## 3 · Kapal tidak boleh bersentuhan — dengan larik coretan

Aturan "tidak boleh menempel, bahkan menyudut" ditegakkan dengan cara yang
sederhana dan, tidak seperti banyak program di koleksi ini, **benar**:

```basic
5100 FOR I=1 TO ZZZ
5110 J=(((I-1)*9)+1)
5120 XED(J)=X(I):YED(J)=Y(I)+1
…                                   ' sembilan entri per petak:
5200 XED(J+8)=X(I):YED(J+8)=Y(I)    ' petaknya sendiri + delapan tetangganya
```

```basic
5300 FOR I=1 TO 9*ZZZ
5310 FOR J=ZZZ+1 TO ZZZZ+ZZZ
5320 IF X(J)=XED(I) AND Y(J)=YED(I) THEN FLIP=1
```

`ZZZ` adalah jumlah petak yang **sudah** terpasang, `ZZZZ` jumlah petak kapal
**baru**. Kalau bentrok, undi ulang seluruh kapalnya. Penolakan berulang, bukan
pencarian — pendekatan yang khas untuk 1982 dan cukup untuk papan sekecil ini.

**Diverifikasi.** Port ini membangun 2.000 papan dan memeriksa tiga invarian:

| Yang diperiksa | Pelanggaran |
|---|--:|
| Setiap petak berada di dalam 0–9 | **0** |
| Tidak ada petak yang dipakai dua kapal | **0** |
| Jarak Chebyshev antar kapal ≥ 2 (tidak menempel, tidak menyudut) | **0** |

Ditambah 300 papan lagi khusus untuk memeriksa **bentuk salib** kapal induk —
lima petak segaris, dua petak melintang, tepat di salah satu ujung: **300 dari
300 benar**, dan keempat orientasinya (mendatar/tegak × kepala/ekor) muncul.

Biayanya terukur: rata-rata **22,0 undian** untuk membangun satu papan, di
antaranya **16,0 ditolak**.

Aturan ini punya akibat yang bisa dipakai pemain, dan port ini menuliskannya di
panel "Cara bermain": **sekali Anda tahu satu petak kapal, kedelapan tetangganya
pasti kosong kecuali di sepanjang arah kapal itu.** Menembak menyerong dari
petak yang kena selalu sia-sia.

> Baris 5230–5270 adalah alat pemeriksa penulisnya sendiri, ditinggalkan dalam
> keadaan di-`REM`: hapus REM-nya, dan program menggambar `X` di tiap petak
> tercoret. Ia menguji aturannya dengan **melihatnya**, cara yang sama yang
> dipakai halaman ini untuk membuktikan logo IBM di [LANDER](lander.md) §7.

---

## 4 · 86.400 detik, 7.152 benih

```basic
1170 H=1+VAL(LEFT$(TIME$,2)):M=1+VAL(MID$(TIME$,4,2)):S=1+VAL(RIGHT$(TIME$,2))
1180 IF H>16 THEN H=H-12
1190 IF H>8 THEN H=8-H
1200 N=H*M*S:RANDOMIZE(N)
```

Benihnya **hasil kali** jam × menit × detik, dan perkalian menghancurkan
keacakan: banyak waktu yang berbeda menghasilkan hasil kali yang sama.
Dihitung atas seluruh 86.400 detik dalam sehari:

| | |
|---|--:|
| Waktu mulai yang mungkin | 86.400 |
| Nilai `N` yang berbeda | **7.152** |
| Yang bernilai negatif | **50 %** |

Baris 1190 hampir pasti salah ketik. `H=8-H` membuat `H` negatif untuk jam
**8–15 dan 20–23** — separuh hari penuh. Yang dimaksud kemungkinan besar
`H=H-8`, yang akan menjaga `H` di rentang 1–8. `RANDOMIZE` menerima bilangan
negatif tanpa mengeluh, jadi kekeliruannya tidak pernah terlihat; ia hanya
mengecilkan ruang benih dan membuat setengah hari bercermin dengan setengah
lainnya.

Ini keluarga temuan yang sama dengan
[ATTACK](attack.md) (benihnya kehilangan faktor 60 karena `MID$` mengambil titik
dua) dan [LANDER](lander.md) (hanya 60 medan, karena hanya detik yang dipakai).
Tiga program, tiga penulis, satu kesulitan yang sama: **IBM PC 1982 tidak punya
sumber keacakan, dan jam adalah satu-satunya yang tersedia.**

---

## 5 · Bunyinya, lagi-lagi, adalah jamnya

```basic
5820 FOR I=2000 TO 80 STEP -5:SOUND I,0.2:NEXT I:SOUND 300,2:SOUND 200,10
```

Itu **385 nada** berturut-turut, setiap kali Anda menembak. Pada 0,2 detak
masing-masing, totalnya **4,2 detik**. Antrean `SOUND` GW-BASIC dalamnya 32
nada; begitu penuh, BASIC berhenti dan menunggu. Tiga tembakan per giliran
berarti **lebih dari dua belas detik** menunggu bunyi selesai, tiap giliran.

Persis mekanisme yang membuat [LANDER](lander.md) §4 berjalan 2,32 bingkai per
detik. Dua penulis berbeda, dua tahun berbeda, satu akibat yang sama: **di IBM
PC, memutar bunyi berarti menghentikan program.** Ini bukan kebetulan melainkan
sifat perangkat kerasnya — pengeras suara PC dikendalikan satu pencacah, dan
BASIC tidak punya cara memainkannya di latar tanpa antrean.

---

## 6 · Tawaran yang tidak pernah ditepati

```basic
1440 INPUT "DO YOU WANT TO SEE THE PLAYING BOARD AND SHIPS USED BEFORE STARTING";ANS$
1450 IF LEFT$(ANS$,1)="N" THEN GOTO 1510
…
1470 REM THIS SECTION JUST SHOWS THE BOARD AND SHIPS WITHOUT HIDING THEM
1480 GOSUB 1700
```

Baris 1700 hanya menggambar **papan kosong**. Kapalnya belum ada: subrutin yang
menempatkannya, `GOSUB 2850`, baru dipanggil di baris 1580 — jauh sesudahnya.
Jadi menjawab "ya" memperlihatkan petak kosong, dan komentar penulisnya sendiri
di baris 1470 menjanjikan sesuatu yang tidak dilakukan kodenya.

Ini menarik justru karena kebalikannya dari [SUB](sub.md) §7b. Di sana pemain
meminta pengungkapan yang tidak pernah ada di aslinya; di sini aslinya
**menjanjikan** pengungkapan lalu tidak memberikannya. Kedua kali obatnya sama:
perlihatkan kapalnya, supaya penalaran pemain bisa diperiksa.

Port ini menepati janji itu di tempat yang sama — tombol **Intip kapal** hanya
hidup sebelum tembakan pertama — dan **selalu** mengungkap kapalnya saat
permainan selesai.

---

## 7 · Tiga hal kecil yang keliru

| Baris | Yang tertulis | Akibatnya | Di port |
|---|---|---|---|
| `1660` | `"…DID IT IN ";TURN;"SHOTS"` | `TURN` menghitung **giliran**, dan tiap giliran tiga tembakan. Angkanya meleset tiga kali lipat. | **Dipertahankan**, dengan kedua angka ditampilkan berdampingan |
| `5780` | `IF S$(TURN,J)=S$(K,L)` | Perbandingan teks **peka huruf besar-kecil**, padahal baris 5470–5660 menerima `A1` maupun `a1`. Petak yang sama bisa ditembak dua kali dengan mengganti besar-kecilnya, dan giliran terbuang tanpa Anda tahu. | **Tidak bisa terjadi**: port memakai koordinat petak, bukan teks yang diketik |
| `1100` | `DIM S$(100,3)` | Disiapkan untuk 100 giliran. Permainan tidak mungkin melewati **34**: hanya ada 100 petak, dan pengulangan ditolak. | Tidak relevan; angkanya ditampilkan sebagai batas atas |
| `1420` | `"IS IS USED ONLY"` | Salah ketik `IT IS`. | Dikutip apa adanya |

Yang tersingkat secara matematis: **8 giliran** (22 petak ÷ 3 tembakan,
dibulatkan ke atas) — dan itu menuntut setiap tembakan kena.

---

## 8 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan digambar dengan `CHR$(220)` dan `CHR$(219)`, sel 5 kolom × 2 baris | layar teks 80×25 | Petak persegi panjang karena aksara memang begitu | Petak **persegi** di SVG. Perbandingan sisi aksara bukan bagian dari aturan permainan; menyalinnya hanya akan membuat papan sulit dibaca |
| Tembakan diketik sebagai `C8`, `g2` | tidak ada tetikus | Koordinat huruf-angka | **Klik petak.** Penyaringan masukan baris 5450–5720 (panjang harus 2, huruf A–J, angka 0–9) jadi tidak berlaku, dan bersamanya hilang pula cacat peka-huruf di baris 5780 |
| Papan tidak menandai kena | — | **Aturan, bukan keterbatasan** | **Dipertahankan mutlak.** Petak kena dan meleset tampil identik |
| Kartu skor diisi berurutan, bukan menurut bagian kapal | disebut sendiri di baris 1400–1420 | Sengaja | **Dipertahankan**, termasuk bentuk salibnya |
| Tiga tembakan per giliran, hasil diumumkan sesudah ketiganya | — | Alat pengaburan | **Dipertahankan.** Salvo yang sedang berjalan disorot kuning — ketiganya, kena maupun meleset, jadi tidak ada yang bocor |
| `RANDOMIZE(H*M*S)` | tidak ada sumber keacakan | 7.152 benih | Kotak **Benih papan**: benih sama → papan sama. Bilangan acaknya **bukan** bilangan GW-BASIC; LCG-nya tidak ditiru, hanya strukturnya |
| 385 nada per tembakan | pengeras suara satu pencacah | Efek samping, bukan rancangan | Sapuan dipadatkan jadi **24 nada** dengan jangkauan frekuensi yang sama (2000→80 Hz), dan tidak menahan permainan |
| `PLAY` "charge" dan "taps" di baris 6400/6420 | — | — | **Dimainkan apa adanya** lewat penafsir `PLAY` bersama |
| Tawaran "lihat kapalnya" yang kosong | kekeliruan urutan | — | **Ditepati** (§6), di tempat yang sama, dan mati sesudah tembakan pertama |
| Alamat rumah dan nomor telepon penulis di baris 1040–1050 | kebiasaan 1982 | — | **Sengaja tidak disalin.** Nama dan lokasi kerjanya disebutkan; data pribadi orang yang mungkin masih hidup tidak perlu diterbitkan ulang. Berkas aslinya tetap utuh di `run/` |

---

## 9 · Latihan

1. Tekan **Intip kapal** sebelum menembak, lalu hitung petak kapal induk.
   Tujuh, bukan lima. Sekarang cari ujung mana yang memegang salibnya.
2. Setel **Benih papan** ke angka yang sama dua kali. Papannya identik. Itu
   struktur `RANDOMIZE(H*M*S)`: waktu mulai menentukan segalanya, dan hanya ada
   7.152 kemungkinan.
3. Tembak tiga petak yang **berjauhan** di giliran pertama, lalu tiga petak yang
   **bersebelahan** di giliran kedua. Bandingkan berapa banyak yang Anda
   pelajari. Salvo yang menyebar memberi kabar yang lebih tajam justru karena
   laporannya tidak beralamat.
4. Sesudah satu petak diketahui kena, tembak salah satu tetangga
   **menyerongnya**. Ia pasti meleset — aturan "tidak boleh bersentuhan"
   menjaminnya. Berapa banyak tembakan yang bisa Anda hemat dengan itu?
5. Mainkan sampai selesai, lalu bandingkan angka **"DID IT IN n SHOTS"** dengan
   penghitung *Tembakan* di papan angka. Yang satu tiga kali yang lain.
6. Menang dalam **8 giliran** menuntut 22 tembakan kena berturut-turut dari 24.
   Dengan bantuan **Intip kapal**, berapa giliran terbaik yang bisa Anda capai —
   dan apakah 8 benar-benar mungkin dengan salvo tiga tembakan?

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/BATSHIP.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
