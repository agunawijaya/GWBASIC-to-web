# GOLF — sebuah par 3 yang mustahil dicapai

> Port web: [`web/games/golf/`](../games/golf/index.html) ·
> Sumber: [`run/GOLF.BAS`](../../run/GOLF.BAS) (361 baris) ·
> Analisis BASIC: [`reviews/GOLF.md`](../../reviews/GOLF.md)

Ditulis **A. Vanchura**, diperbarui terakhir **17 Juli 1982** — penulis dan
tanggal yang sama persis dengan [WILDCAT](wildcat.md). Kedua berkas itu memang
bersaudara: seluruh dunianya disimpan di `DATA`, dan satu rumus melakukan semua
pekerjaan.

---

## 1 · Rumus jarak punya batas keras, dan satu lubang melewatinya

```basic
530 DIST=INT(((30-A)*2.5+230-((30-A)*0.25+20)*F/2)+(RND*20))
```

`A` handicap, `F` nomor tongkat. Masukkan pemain terbaik yang diterima program
(`A=0`), tongkat terpanjang (`F=1`, kayu 1 — yang selalu ayunan penuh karena
baris 390 melompati permintaan persentase), dan undian `RND` paling murah hati:

```
(30 × 2,5) + 230 − ((30 × 0,25) + 20) × 1/2  =  75 + 230 − 13,75  =  291,25
                                    + RND×20  →  maksimum 311
```

**311 yard.** Itu batas keras: tidak ada jalan lain di seluruh program untuk
memukul lebih jauh — persentase ayunan hanya bisa memperkecil, dan handicap
lebih tinggi hanya mengurangi.

Sekarang lihat lapangan ketiga, *Swamp Grass USA*, lubang keenam:

| | |
|---|--:|
| Par | **3** |
| Panjang | **312 yard** |
| Pukulan terjauh yang mungkin | 311 yard |

**Satu yard.** Di lubang itu birdie mustahil bagi siapa pun, dan par menuntut
Anda memasukkan pukulan kedua dari luar green.

Halaman portnya menyapu ketiga lapangan tiap kali dimuat dan melaporkan lubang
mana saja yang melewati batas — jadi angka itu terhitung, bukan dikutip.

> Lapangan itu juga punya par 3 sepanjang **300 yard** (lubang 15) yang
> *hampir* mustahil: ia menuntut undian `RND ≥ 0,44` dengan handicap 0.

---

## 2 · Tiga lapangan yang sebenarnya satu daftar

```basic
1290 FOR D=1 TO ((C-1)*126):READ E:NEXT:RETURN
1740 CLS:READ PAR,YARDS,LEFT,RIGHT,DIFF,LNG,FAC
```

Tujuh angka per lubang × 18 lubang = **126**. Memilih lapangan ke-*C* berarti
**membuang** 126×(C−1) angka pertama dari aliran `DATA`. Jadi ketiga lapangan
itu bukan tiga blok data melainkan **satu daftar 54 lubang** yang dipotong tiga
— dan `E` hanya variabel buangan yang ada supaya `READ` punya tempat menaruh
hasilnya.

| Lapangan | Menu | Par | Yard | par 3/4/5 |
|---|--:|--:|--:|---|
| Amateur Green Grass Country Club | Rating 65 | **72** | 6.347 | 4/10/4 |
| Down Hill Country Club | Rating 69 | **72** | 7.470 | 4/10/4 |
| Swamp Grass USA | Rating 72 | **72** | 8.173 | 4/10/4 |

Ketiganya **par 72**, dengan susunan yang persis sama. Yang berbeda hanya
panjangnya — dan berbeda jauh.

Angka *Rating* di menu mengurutkan ketiganya dengan benar, tapi angkanya omong
kosong golf: *course rating* adalah skor harapan pemain scratch, jadi rating
**di bawah par** berarti lapangan itu lebih *mudah* daripada parnya. Lapangan
8.173 yard di dunia nyata akan dinilai sekitar 78–80. Dan angka yang benar-benar
menerangkan kesulitan — panjangnya — tidak pernah ditampilkan di menu sama
sekali.

---

## 3 · Bola masuk air dikenai tiga pukulan, diumumkan satu

```basic
1390 LOCATE 2,1:STK=STK+1:IF B1>5 THEN 1420
…
1420 PRINT"Shot Went Into "Z(B1):STK=STK+1: … :B1=1: … :GOTO 1390
```

Telusuri satu bola yang masuk danau (`B1=6`) atau keluar batas (`B1=7`):

1. Baris 1390 menambah **satu** pukulan, lalu melompat ke 1420.
2. Baris 1420 menambah **satu lagi**, menyetel `B1=1`, dan melompat **kembali**
   ke 1390.
3. Baris 1390 menambah **satu lagi** — kali ini lolos, karena `B1` sudah 1.

**Tiga pukulan.** Dan yang tercetak di layar berbunyi *"Penalty Stroke
Accessed"* — tunggal. Aturan golf sungguhan: pukulannya sendiri plus satu
penalti, jadi dua.

**Dipertahankan** di port ini, dan dicatat di layar tiap kali terjadi.

---

## 4 · Jurang di tengah tas tongkat

```basic
350 IF Z="I" THEN PRINT" IRON";:F=F+9.5:GOTO 380
390 IF F<8 THEN GOSUB 1200:GOTO 510          ' kayu: lompati persentase
500 …:SWING=SWING/100:IF B1=5 THEN 660 ELSE F=F-5:GOTO 530
```

Besi nomor *n* masuk sebagai `n+9,5`, lalu **dikurangi 5** di baris 500 sesudah
persentase ayunan dibaca — jadi yang sampai ke rumus adalah `n+4,5`. Kayu tidak
pernah melewati baris 500 (baris 390 melompatinya), jadi kayu *n* masuk sebagai
`n` apa adanya.

Akibatnya ada lompatan di tengah tas: kayu 4 memukul jauh lebih jauh daripada
besi 1, dan tidak ada tongkat yang mengisi celahnya. Tabel jarak di halaman
port menghitung ulang seluruh tas dari rumus yang sama tiap kali handicap
diubah, dan lompatan itu terlihat sebagai selisih.

---

## 5 · Benih yang diaduk selagi pemain berpikir

```basic
1170 Z=INKEY$:IF Z="" THEN RANDOMIZE VAL(RIGHT$(TIME$,2)):GOTO 1170 ELSE RETURN
```

Setiap kali program menunggu tombol, ia **menyemai ulang** pembangkit acaknya —
berkali-kali per detik, sampai Anda menekan sesuatu. Jadi benih yang berlaku
bukan waktu program dijalankan melainkan **detik saat Anda menekan tombol**.

Masih enam puluh nilai. Tapi yang memilihnya sekarang *pemain*, bukan jam mulai
— dan itu bedanya besar, karena waktu tekan jauh lebih sulit diulang daripada
waktu jalan.

Bandingkan dengan [WILDCAT](wildcat.md) §5, yang ditulis **orang yang sama pada
hari yang sama**, dan yang mencoba melebarkan benihnya dengan
`RANDOMIZE(RND*30000)` — sebuah obat yang tidak menambah satu bit pun entropi.
Dua berkas, satu tangan, satu minggu: yang satu obatnya bekerja, yang satu
tidak. Dan yang bekerja adalah yang lebih sederhana.

> Keluarga yang sama: [METEOR](meteor.md) juga mengaduk benihnya selagi pemain
> berpikir, dengan cara ketiga lagi — `(R+511) MOD 32003`, yang orbitnya
> terbukti penuh 32.003 nilai.

---

## 6 · Tujuh medan, dan dua di antaranya menghukum

```basic
1860 DATA Fairway,Deep Rough,Trees,Adjacent Fairway,Sand Trap,A Big Lake,Out Of Bounds
```

`LEFT` dan `RIGHT` tiap lubang menunjuk ke daftar ini, dan `IF B1>5` di baris
1390 adalah seluruh aturan penaltinya: indeks 6 dan 7 — danau dan luar batas —
menjatuhkan pukulan, sisanya tidak.

Karena itu peta lubang di port ini mewarnai sisi kiri dan kanan menurut medannya
dan menuliskan namanya. Angkanya sudah ada di `DATA` sejak 1982; yang belum ada
hanyalah gambarnya.

Perhatikan juga baris 590: hook dan slice **hanya berlaku kalau pemain
memilihnya** sebagai kesulitannya. Dengan *perfect player*, bola yang melenceng
jauh sekalipun tetap dianggap di fairway — `ON B+1 GOTO 610,620` hanya punya
dua target, jadi `B` bernilai 2 sampai 5 jatuh lewat ke baris 640.

---

## 6b · Fisika yang harus dikarang, karena aslinya tidak punya

Baris 530 menghasilkan **satu** angka: jarak total. Tidak ada tinggi, tidak ada
waktu, tidak ada sudut. Jadi begitu bola mau digambar melambung, seluruh
lintasannya harus dikarang — dan kalau dikarang, ia harus dikarang **benar**,
bukan sekadar melengkung.

Semuanya diturunkan dari `F`, nomor tongkat yang sama yang masuk ke rumus 530:

```
loft         = 9 + 2,5 F           derajat
sudut luncur = 0,85 × loft         bola berangkat lebih rendah dari loft
apeks/carry  = 0,095 + 0,0085 F    makin loncong makin tinggi
gelinding    = 0,19 − 0,012 F      driver lari jauh, wedge berhenti
sudut jatuh  = 30 + 0,55 × luncur
```

Angka-angka itu bukan selera. Mereka dipilih supaya keluarannya berimpit dengan
data lacak-bola yang diterbitkan:

| tongkat | loft hitung | loft nyata | apeks hitung | apeks nyata | jatuh hitung | jatuh nyata |
|---|--:|--:|--:|--:|--:|--:|
| Wood 1 | 11,5° | 10,5° | 25,6 yd | ~30 yd | 35° | ~38° |
| Wood 3 | 16,5° | 15° | 27,9 yd | ~30 yd | 38° | ~40° |
| Iron 6 | 35,3° | 30–34° | 29,4 yd | ~28 yd | 46° | ~46° |
| PW | 46,5° | 46° | 24,0 yd | ~28 yd | 52° | ~52° |

Perhatikan bentuk kolom apeks: ia **tidak** naik terus, ia memuncak di besi
tengah lalu turun lagi. Itu memang yang terjadi di lapangan, dan itu keluar
sendiri dari rumusnya — bukan ditanam.

**Lintasannya bukan parabola.** Parabola yang lewat (carry, apeks) selalu
berangkat terlalu curam dan mendarat terlalu landai; bola golf sungguhan
berangkat landai, mengambang, lalu jatuh curam karena gaya angkat. Maka dipakai
kuartik

```
y(u) = c1 u + c2 u² + c3 u³ + c4 u⁴,    u = 0..1 sepanjang carry
```

dengan `c1` dikunci sudut luncur, dua syarat ujung `y(1) = 0` dan `y'(1) = −m1`
mengunci sudut jatuh, dan sisa satu derajat kebebasan dipakai untuk menyetel
puncaknya tepat setinggi apeks. Penyetelannya dengan bagi-dua — dan bagi-dua
**sah** di sini karena

```
∂y/∂t = u²(1 − u)²  ≥ 0  untuk semua u
```

jadi puncaknya naik monoton terhadap parameter bebasnya. Itu bukan kebetulan
yang menyenangkan; itu yang membuat pencariannya boleh dipercaya. Diperiksa 400
titik per lintasan untuk enam tongkat: tidak ada nilai negatif, dan tidak ada
lintasan yang berbelok dua kali.

Waktu terbang memakai rumus lambungan `t = √(8h/g)` dengan
g = 32,17 ft/s² = 10,72 yard/s². Driver apeks 26 yard menggantung 4,4 detik.
Di layar diputar 0,62 kali kecepatan nyata supaya satu pukulan tidak memakan
lima detik.

**Yang mengikat gambar pada aturan:** `CARRY + ROLL` yang tertulis di kartu
selalu persis sama dengan angka `Shot Went … Yards` di catatan perjalanan.
Dua sumber, satu angka. Diukur pada pukulan uji: aturan berkata 280, gambar
berkata 230 + 50.

Dan satu hal yang **tidak** dilanggar: lapisan hiasan punya aliran acaknya
sendiri. Kalau pohon di pinggir lubang mengambil dari `rnd` milik permainan,
maka jumlah pohon akan menggeser hasil pukulan — pelajaran yang sudah dibayar
sekali di [TRUCKER](trucker.md). Buktinya diukur, bukan diklaim: satu lubang
dimainkan dua kali dengan benih yang sama, sekali dengan animasi menyala dan
sekali dengan animasi mati, dan ketiga belas baris catatannya identik
huruf demi huruf.

> Satu pengecualian pada urutan kedalaman, dan disebut supaya tidak terlihat
> curang: **bendera digambar sesudah pohon** dan tidak pernah tertimbun, karena
> ia sasaran seluruh permainan. Sebagai gantinya pohon dilarang tumbuh dalam
> 16 yard dari pin. Undian acaknya tetap diambil untuk pohon yang dibuang —
> kalau tidak, melewatkan satu pohon akan menggeser semua pohon berikutnya, dan
> pemandangan lubang berubah hanya karena benderanya kebetulan berdiri di
> tempat lain.

### 6b.1 · Skala adalah bagian dari kebenaran gambar

Versi pertama lapisan ini punya cacat yang hanya kelihatan waktu dimainkan:
bola berhenti 8 yard dari pin di lubang 501 yard, dan **tergambar seperti sudah
di atas green** — sementara permainan masih meminta Anda memilih tongkat. Tiga
sebab bertumpuk, dan ketiganya soal skala:

1. **Bingkai tidak pernah menyusut.** Ia ditetapkan dari panjang pukulan dan
   dibiarkan begitu. Pada bingkai 500 yard, 8 yard memang tidak terbedakan dari
   nol.
2. **Lingkaran green punya batas bawah 9 piksel.** Jadi di lubang panjang ia
   menggelembung jauh melebihi ukuran sebenarnya, dan bola yang mendarat di
   dekatnya masuk ke dalamnya.
3. **Sumbu jarak diukur dari tepi kiri bingkai**, padahal tertulis "yard dari
   bola". Selisihnya kecil, tapi ia membuat angka di gambar berbeda dari angka
   di papan — dan sekali itu terjadi, seluruh gambar tidak bisa dipercaya lagi.

Perbaikannya: sesudah bola berhenti, kamera **merapat** ke sisa jarak yang
sebenarnya, dalam gerak beranimasi 0,6 detik; lingkaran green memakai ukuran
sungguhan (jari-jari 20 yard) tanpa batas bawah; dan tanda jarak dihitung dari
posisi bola.

Sisa jarak yang dipakai adalah `GRN`, dan `GRN` itu **sisi miring** —
`akar(melenceng² + sisa lurus²)` di baris 560. Karena tampilan samping memandang
lurus sepanjang garis bola-ke-pin, merapat berarti benderanya ikut bergeser.
Yang bergerak kameranya, bukan tiangnya; karena itu geraknya dianimasikan, tidak
dipotong. Diukur di enam pukulan berturut-turut: angka `SISA KE PIN` di kartu
sama persis dengan papan angka — 221, 27, 8, 2 yard — dan titik nol sumbu
jatuh tepat di piksel bolanya.

Dan pada jarak putting, penggambar dunia dibuang sama sekali. Pada 23 kaki satu
piksel bernilai dua sentimeter: pohon setinggi 10 yard menjadi 500 piksel dan
green selebar 40 yard menjadi setrip selebar layar. Jadi di sana yang digambar
hanya yang benar-benar ada di depan mata — permukaan green, tiangnya, dan
lubangnya yang selebar **4,25 inci = 0,118 yard**, jadi 6 piksel. Justru
kekecilan itu yang membuat 23 kaki terasa jauh.

---

## 7 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| Tiga baris teks per pukulan: jarak, sisa, simpangan | layar teks 80×25 | Angka tanpa tempat | **Peta lubang dari atas**: tee, koridor fairway, green dan bendera, bola diplot pada (sisa jarak, simpangan). Angka yang sama, sebagai tempat |
| Bola berpindah 280 yard tanpa gambar apa pun | tidak ada grafik, dan tidak ada fisika di seluruh 361 baris | Pemain tidak bisa melihat apa yang dilakukan pilihannya | **Tampilan samping**: pemain mengayun, bola terpukul dan melambung, mendarat, memantul, menggelinding. Lintasannya dihitung dari nomor tongkat yang sama yang dipakai baris 530 (§6b), dan `CARRY + ROLL` selalu sama persis dengan angka yang dicetak permainan. Ini **tambahan**, bukan perubahan: aturan tidak digeser satu undian pun, dan bisa dimatikan |
| Sisi kiri/kanan hanya dicetak namanya (baris 1820–1830) | — | — | **Pita berwarna** di kedua tepi, dengan namanya dari `DATA`. Danau dan luar batas diberi warna yang berbeda tajam karena hanya keduanya yang menghukum |
| Persentase ayunan diketik lewat penyunting `INKEY$` sendiri (baris 400–490) | tidak ada `INPUT` yang bisa dibatalkan | — | Penggeser 11–100 % dengan batas yang sama |
| Faktor putt diketik (baris 820–900) | — | — | Penggeser 0,5–10, dengan nilai wajar dihitung dari jarak tersisa dan ditawarkan sebagai bawaan |
| Tabel jarak tongkat tidak pernah ada | — | Pemain menebak | **Ditampilkan**, dihitung dari rumus baris 530 memakai handicap yang sedang berlaku. Ini menambah pengetahuan, bukan aturan — dan tanpanya temuan §1 tidak bisa diperiksa |
| Bunyi `SOUND` per hasil lubang (1530–1590) | pengeras suara satu pencacah | — | Diterjemahkan ke `PLAY` pendek lewat penafsir bersama |
| Tiga pukulan untuk bola masuk air | salah alur `GOSUB` | — | **Dipertahankan**, dan dicatat di layar (§3) |
| `RANDOMIZE` di gelung tunggu tombol | tidak ada sumber acak | — | Kotak **Benih**: benih sama → ronde sama. Sifat "pemain yang memilih benih" dijelaskan, tidak ditiru |

---

## 8 · Latihan

1. Pilih lapangan **3** dan mainkan sampai lubang 6. Ia par 3 sepanjang 312
   yard. Coba capai green dari tee dengan handicap 0. Tidak bisa — dan panel
   memberi tahu Anda kenapa sebelum Anda mencoba.
2. Ubah handicap dari 30 ke 0 dan perhatikan tabel jarak tongkat. Kayu 1
   bertambah dari 220 ke 311 yard; sekaligus simpangan melencengnya menyusut,
   karena `A` muncul di kedua rumus.
3. Pukul bola ke danau. Hitung pukulan di papan angka sebelum dan sesudah.
   Selisihnya tiga.
4. Bandingkan panjang lapangan 1 dan 3 di panel: 6.347 lawan 8.173 yard, par
   sama. Berapa pukulan tambahan yang seharusnya dituntut selisih 1.826 yard?
5. Mainkan dua ronde dengan benih yang sama dan pilihan yang sama. Hasilnya
   identik — di aslinya tidak akan, karena benihnya diaduk oleh waktu tekan
   tombol Anda (§5).

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/GOLF.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
