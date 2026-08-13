# PAC-GAL — perilaku hantu

> **DIHASILKAN** oleh `decompile/tools/gen-pacgal-ref.py` — jangan disunting tangan.
> Setiap angka di bawah dibaca langsung dari `pacgal.js`; skrip itu **gagal keras**
> kalau tetapannya hilang atau berganti nama, jadi dokumen ini tidak bisa
> diam-diam menyimpang dari kodenya.

Ada **dua mode**, dipilih lewat saklar *"hantu asli PAC-GAL"* di halaman. Itu
bukan tingkat kesulitan — keduanya menjalankan algoritma yang berbeda sama sekali,
dan keduanya punya alasan berbeda untuk ada.

| | Saklar **mati** | Saklar **hidup** |
|---|---|---|
| Nama | Konvensi Pac-Man 1980 | Asli PAC-GAL 1982 |
| Status | **rekonstruksi** | **pemulihan** |
| Fungsi | `gerakSatuHantu()` | `gerakAsli()` |
| Sasaran | empat sasaran berbeda | satu sasaran, sama untuk keempatnya |
| Mengejar? | ya | **tidak pernah** — lihat §3 |
| Kenapa ada | supaya bisa dimainkan | supaya bisa dilihat apa adanya |

Geometri yang dirujuk sepanjang dokumen ini — sel gerbang, kotak kandang, sudut
sebar — ada di [`GEOMETRY.md`](GEOMETRY.md). Jangan menggalinya ulang dari kode.

---

## 1. Mesin keadaan — berlaku di KEDUA mode

Setiap hantu selalu berada di salah satu keadaan ini:

```
   kandang ──(pelet cukup)──> keluar ──(h.r < 11)──> kejar/sebar
      ^                          ^                          │
      │                          │                    (dimakan pemain
      │                          │                     saat takut)
      │                          └───(sampai di sel start)──┐
      └──────────── pulang (h.dimakan = true) <─────────────┘
```

| Keadaan | Sasaran | Boleh lewat gerbang |
|---|---|---|
| `kandang` | sel gerbang terdekat | ya |
| `keluar` | sel gerbang terdekat | ya |
| `kejar` | lihat §2 / §3 | **tidak** |
| `sebar` | sudut watak sendiri | **tidak** |
| `dimakan` (pulang) | sel start sendiri | ya |

Tiga hal yang gampang dikira sepele padahal masing-masing pernah jadi bug:

- **Selesai keluar = `h.r < GERBANG.r`.** Bukan menginjak satu sel. Gerbangnya
  dua sel; syarat sel-tunggal membuat hantu yang lewat sel satunya terkurung
  dalam mode `keluar` selamanya.
- **Gerbang satu arah.** Tanpa itu, hantu ketakutan yang bergerak acak melangkah
  masuk kandang, modenya masih `kejar`, jadi jaring pengaman tidak kena dan ia
  terjebak. Ini gejala "hantu tiba-tiba respawn ke kotak awal".
- **Jaring pengaman:** hantu bermode `kejar`/`sebar` yang ternyata berada di
  dalam kotak kandang dikembalikan ke mode `keluar`. Kotak itu harus memakai
  lebar kandang yang sebenarnya, bukan lebar posisi start.

### Kapan hantu keluar kandang

Dihitung dari **pelet yang sudah dimakan**, bukan dari waktu:

| Hantu | Ambang | Dari 468 pelet |
|---|---|---|
| 1 (Pengejar) | 0 pelet | 0% — langsung |
| 2 (Pembayang) | 5 pelet | 1% |
| 3 (Penjepit) | 14 pelet | 3% |
| 4 (Pemalu) | 28 pelet | 6% |

Versi sebelumnya memakai penundaan **waktu** tetap, dan `reset()` memasangnya
ulang setiap kali pemain mati. Hantu keempat menunggu tiga belas detik — jadi
kalau pemain mati sebelum itu, ia **tidak pernah keluar sama sekali**, seumur
permainan. Dua hantu terakhir praktis tidak ikut bermain.

Pencacah pelet memperbaikinya karena `sisa` **tidak** di-reset saat pemain mati:
sesudah mati, keempatnya langsung keluar lagi. Ambangnya diskalakan ke 468
pelet dan tetap **rekonstruksi** — PAC-GAL sendiri tidak punya aturan ini.

**Akibat praktis yang perlu diketahui sebelum melapor bug.** Hantu keempat butuh
28 pelet. Pemain yang berhati-hati, atau yang mati berkali-kali di awal,
bisa bermain cukup lama tanpa pernah melihatnya keluar — dan itu **bukan** hantu
yang macet, melainkan ambang yang belum tercapai. Cara memastikannya: lihat
angka "Pelet" di panel. Kalau sudah di bawah 440 dan hantu keempat masih di
kandang, barulah itu cacat.

Pac-Man 1980 punya pengaman untuk keadaan ini yang **port ini tidak punya**:
pewaktu global yang melepas paksa hantu berikutnya kalau pemain tidak memakan
pelet apa pun selama beberapa detik. Lihat §5.

---

## 2. Mode Pac-Man 1980 (saklar mati) — REKONSTRUKSI

Diperiksa terhadap `pacman.fandom.com/wiki/Maze_Ghost_AI_Behaviors`, bagian
**"Pac-Man" saja** — bukan Arrangement 1996 dan seterusnya.

Aturan geraknya: di tiap langkah, coba semua arah **kecuali berbalik**, ambil
yang paling memperkecil jarak lurus ke sasaran. Berbalik hanya kalau buntu.
Larangan berbalik itu yang membuat hantu punya lintasan, bukan bergetar di tempat.

### Empat sasaran

| # | Nama | Padanan 1980 | Sudut sebar | Sasaran saat mengejar |
|---|---|---|---|---|
| 1 | Pengejar | Blinky (merah) | (0, 38) | posisi pemain |
| 2 | Pembayang | Pinky (merah muda) | (0, 1) | 2 petak di muka pemain |
| 3 | Penjepit | Inky (biru) | (23, 38) | cerminan Pengejar lewat titik 2 petak di muka pemain |
| 4 | Pemalu | Clyde (oranye) | (23, 1) | pemain kalau jauh, sudut sendiri kalau dekat |

**Pembayang** membidik `DEPAN = 2` petak di muka pemain.

**Penjepit** membidik `2 × (titik 2 petak di muka pemain) − posisi Pengejar` —
vektor dari Pengejar ke titik di depan pemain, digandakan. Itu sebabnya ia
menjepit: sasarannya bergantung pada di mana hantu **lain** berada.

**Pemalu** mengejar kalau jaraknya lebih dari `RADIUS_PEMALU = 8` petak, dan
pulang ke sudutnya kalau lebih dekat. Dari sisi pemain ia terlihat seperti
mundur takut-takut — dan itu memang yang bikin sudut kiri-bawah relatif aman.

### Bug limpahan arah atas — SENGAJA DITIRU

```js
if (pemain.dr === -1 && pemain.dc === 0) c -= n;   // bug limpahan arah atas
```

Di mesin aslinya, offset arah ditambahkan lewat satu rutin yang, untuk arah
**atas**, juga menambahkan offset yang sama ke sumbu mendatar. Jadi saat pemain
menghadap atas, titik bidik Pembayang bukan 2 petak di atasnya melainkan 2 di
atas **dan** 2 ke kiri.

Itu bug, bukan rancangan — tapi ia bug yang membentuk seluruh rasa main permainan
itu, karena ia yang membuat Pembayang bisa dikelabui dengan menghadap ke atas.
Meniru perilakunya tanpa meniru bugnya berarti meniru yang salah. Penjepit
memakai rutin yang sama, jadi ia mewarisi bug yang sama persis seperti di aslinya.

### Sebar / kejar bergantian

| Fase | Mode | Rentang | Perkiraan waktu |
|---|---|---|---|
| 1 | sebar | tik 0–55 | 0 s–7 s |
| 2 | kejar | tik 56–199 | 7 s–26 s |
| 3 | sebar | tik 200–255 | 26 s–33 s |
| 4 | kejar | tik 256–399 | 33 s–52 s |
| 5 | sebar | tik 400 dan seterusnya | 52 s → |

Tanpa pergantian ini, empat hantu yang semuanya mengejar akan menyudutkan pemain
sejak awal dan permainannya tidak bisa dimainkan.

### Mode marah (Cruise Elroy) — hanya Pengejar

| Tingkat | Pelet tersisa | Efek |
|---|---|---|
| 1 | ≤ 20 | langkah tambahan tiap 4 tik; **berhenti ikut menyebar** |
| 2 | ≤ 10 | langkah tambahan tiap 2 tik; berhenti ikut menyebar |

Ini yang mengubah akhir permainan dari "tinggal menyapu sisa" jadi kejaran
sungguhan. Tanpanya pelet terakhir selalu aman diambil. Berlaku **hanya di mode
1980** — PAC-GAL asli tidak punya padanannya.

---

## 3. Mode asli PAC-GAL (saklar hidup) — PEMULIHAN

Ini yang benar-benar dilakukan program 1982-nya. Tiga aturan, ketiganya dikutip
dari `pac-gal-run.bas`:

```basic
5210  IF CSNG(I12%) >= RND(2) THEN kejar ELSE jalan lurus
5270  kalau mengejar, koreksi hanya pada SUMBU YANG TIDAK SEDANG DITEMPUH
      (J7% = 0 -> samakan baris; selain itu -> samakan kolom)
----  sasarannya posisi pemain, SAMA untuk keempat hantu (I17%/I18%)
```

Perbedaan paling besar dari dugaan awal: **keempat hantu memakai pengejar yang
sama.** Satu-satunya yang membedakan mereka adalah nilai acak arah awal. Akibatnya
mereka menumpuk jadi satu rombongan dan permainannya gampang ditebak. Tidak ada
empat kepribadian; itu ditambahkan Pac-Man, bukan PAC-GAL.

### `I12%` — dan kenapa hantunya tidak pernah mengejar

```basic
1030  I12% = 0                      ' nilai awal
3320  I12% = CINT(I12% * 0.5)       ' saat pelet tersisa < 50
3680  I12% = I12% + I12%            ' mati saat pelet > 300, jika < 0,1
```

Nilai awalnya **nol**, dan kedua operasi yang mengubahnya cuma membagi dua dan
mengalikan dua. Nol tetap nol. Jadi syarat di 5210 tidak pernah benar, dan
hantunya **tidak pernah mengejar** — mereka berjalan lurus dan memantul.

Itu bukan cacat port ini; itu yang dilakukan pernyataan yang berhasil dipulihkan.
Nilainya ditampilkan di panel supaya bisa dilihat sendiri, dan kedua aturan
pengubahnya tetap dijalankan — kalau suatu saat pernyataan yang mengisi `I12%`
ditemukan, yang berubah cuma satu tetapan (`I12_AWAL`, sekarang `0`).

Ini cocok dengan temuan terpisah di `decompile/PAC-GAL/ARCHITECTURE.md` §4b:
ada blok AI-pengejar di binernya yang **tidak pernah bisa dicapai**. Dua bukti
dari dua tempat berbeda, kesimpulan sama.

Perhatikan juga arah kedua aturan pengubahnya: keduanya **menurunkan** keganasan
saat pemain mendekati menang, dan **menaikkannya** saat pemain mati di awal —
kebalikan dari Cruise Elroy.

### Yang tidak terpulihkan

Apa yang terjadi saat langkah hantu menabrak dinding. Di sini dipilih arah sah
lain secara acak — perilaku memantul yang wajar untuk hantu yang arah awalnya
sendiri diundi. Itu **rekonstruksi**, dan satu-satunya di jalur ini.

---

## 4. Keadaan takut — berlaku di kedua mode

Rumusnya **asli**, dari baris 2880 `pac-gal-run.bas`:

```
takut = (sisa / 5 + 20) / nyawa²
```

| | |
|---|---|
| Di awal permainan (468 pelet, 3 nyawa) | 13 giliran |
| Kecepatan saat takut | **sepertiga** — bergerak kalau `tik % 3 === 0` |
| Lama sebenarnya di layar | ≈ 5.1 detik |

Yang **diubah** bukan rumusnya, melainkan berapa lama satu "giliran" itu di
layar. Dengan setengah kecepatan, 13 giliran cuma ≈3.4 detik — dan karena
hantu bergerak **acak** saat takut (bukan kabur menjauh seperti Pac-Man 1980),
waktu sesingkat itu praktis tidak bisa dipakai: mereka tidak datang menghampiri,
jadi pemain tidak sempat mengejar. Dilaporkan pemilik proyek sebagai "hampir
tidak terasa". Sepertiga kecepatan memberi ≈5.1 detik **dan** membuat mereka
bisa dikejar.

Gerak acak saat takut hanya berlaku untuk hantu yang **sedang bermain**. Hantu
yang sedang keluar kandang atau sedang pulang tetap terarah — kalau tidak, hantu
yang baru keluar kehilangan sasarannya dan melantur kembali ke kandang.

### Dua fase terarah, satu mekanisme: peta jarak

Hantu punya dua fase yang harus **sampai ke suatu tempat**, bukan berkeliaran:
**keluar** dari kandang, dan **pulang** setelah dimakan. Keduanya kini memakai
peta jarak hasil banjir, dan pemilih langkah yang sama (`turuniPeta`):

| Peta | Benih banjir | Dipakai saat |
|---|---|---|
| `KELUAR` | kedua sel tepat di atas gerbang: (10,19) dan (10,20) | mode `keluar` |
| `PULANG` | sel start tiap hantu (empat peta) | `dimakan` |

Dihitung sekali saat muat, lalu gratis selamanya: hantu cukup melangkah ke
tetangga dengan angka terkecil. Selalu ada satu, jadi tidak ada jalan buntu dan
tidak ada undian. Berbalik arah diizinkan di kedua fase — hantu yang sedang
keluar atau pulang bukan hantu yang sedang berpatroli.

Sebelumnya keduanya dikemudikan **aturan sumbu**, dan keduanya rusak — dengan
cara berbeda, dan dilaporkan sebagai dua keluhan terpisah. Keduanya dibedah di
dua bagian berikut.

### Jalan pulang mata — peta jarak, bukan aturan sumbu

Hantu yang dimakan pulang dengan **peta jarak hasil banjir**: satu banjir per
sel start hantu, dihitung sekali saat muat, melewati gerbang (hantu yang dimakan
memang boleh melewatinya). Mata cukup melangkah ke tetangga dengan angka
terkecil — selalu jalan terpendek, dan biayanya nol saat bermain. Berbalik arah
diizinkan di sini: mata bukan hantu yang sedang berpatroli.

**Kenapa bukan aturan sumbu.** Versi sebelumnya mengemudikan mata dengan
"samakan baris dulu, baru kolom":

```js
dr = Math.sign(tr - h.r); dc = 0;
if (dr === 0) { dc = Math.sign(tc - h.c); }
```

Aturan itu **tidak bisa memulangkan siapa pun**. Untuk masuk kandang, hantu harus
sejajar di **kolom** gerbang (19/20) lalu turun lewat baris 11. Tapi aturan itu
baru mengizinkan gerak mendatar setelah baris sasaran tercapai — dan baris
sasarannya (13) ada **di dalam** kandang yang berdinding. Jadi mata mendorong
ke bawah, menabrak atap kandang, lalu memantul acak. Selamanya.

Gejalanya persis seperti yang dilaporkan: di mode PAC-GAL hantu yang dimakan
tetap berwujud mata dan tidak pernah kembali normal, bahkan sesudah masa rentan
habis — karena satu-satunya tempat `dimakan` dimatikan adalah saat mata tiba di
sel start-nya.

**Kontrol negatif.** Aturan lama dipasang kembali sementara untuk memastikan
ujinya memang bisa gagal. Hasilnya memisahkan keduanya dengan tegas:

| | mode 1980 | mode asli PAC-GAL |
|---|---|---|
| aturan sumbu (lama) | 2 dari 2 pulang | **0 pulang** |
| peta jarak (sekarang) | 2 dari 2 pulang | **3 dari 3 pulang** |

Mode 1980 tidak pernah terkena karena pemilih arahnya menimbang **keempat** arah
dan mengambil jarak lurus terkecil — masih bisa terjebak lembah lokal secara
teori, tapi tidak di petak ini. Peta jarak menghapus seluruh kelas kesalahan itu
untuk kedua mode sekaligus.

### Keluar kandang: undian di ambang pintu

Cacat kedua, dari aturan sumbu yang sama tapi di fase keluar. Yang paling
merusak bukan navigasinya, melainkan **apa yang terjadi saat hantu berdiri
persis di sel gerbang**: sasarannya adalah selnya sendiri, jadi `dr` dan `dc`
dua-duanya nol. Tidak ada langkah yang terhitung, dan hantu jatuh ke cabang
"memantul acak". Dari sel gerbang hanya ada dua tetangga — satu ke luar, satu
kembali ke dalam kandang.

Jadi setiap kali hantu sampai di ambang pintu, ia **melempar koin** apakah mau
keluar atau masuk lagi.

Mode 1980 tidak terkena: pemilihnya menimbang keempat arah dan mengambil jarak
terkecil, dan urutan `ARAH` menaruh "atas" lebih dulu — jadi ia selalu memilih
keluar. Mode asli PAC-GAL tidak punya penyeimbang itu. Hantunya bergelantungan
di sekitar kandang, dan yang apes terlihat seperti **tidak pernah pergi dari
kotak awal** — persis keluhan yang dilaporkan.

**Kontrol negatif** (mode asli PAC-GAL, pemain uji yang sama, 14.000 bingkai):

| | waktu di dalam kandang sesudah keluar | masuk lagi | petak dijelajahi | posisi akhir |
|---|---|---|---|---|
| aturan sumbu (lama) | 2–**10**% | 3–5× | 104–117 | keempatnya menempel kandang: (12,20) (11,20) (10,22) (14,15) |
| peta jarak (sekarang) | 1–3% | 2–4× | **142–195** | tersebar: (18,4) (13,2) (18,28) (13,38) |

Mode 1980 diperiksa ulang sesudah ikut dipindah ke peta jarak: keluar pada pelet
ke-5/7/15/29 seperti sebelumnya, 1–4% waktu di kandang, posisi akhir tetap di
empat sudut. Tidak ada perubahan perilaku, hanya satu mekanisme yang dipakai
bersama alih-alih dua yang bisa rusak sendiri-sendiri.

### Memakan hantu: skor berlipat dan jeda

**Apa yang PAC-GAL 1982 lakukan** — baris 4560 `pac-gal-run.bas`:

```basic
4560 J2%(I6%) = 7 : J3%(I6%) = 14 : J4%(I6%) = I6% + 16
```

Tiga hal seketika: warna kembali ke **7 (normal)**, baris ke **14**, kolom ke
**sel start-nya sendiri**. Tidak ada fase mata, tidak ada penundaan, tidak ada
penantian sampai masa rentan habis. Hantu itu langsung berdiri di kandang dalam
wujud normal dan langsung berjalan lagi. (`J2%` memang atribut warna — lihat
`COLOR J2%(I6%), 0` di baris 7010. Warna rentannya `26`, yaitu 16+10:
**hijau muda berkedip**, bukan biru.)

Pac-Man 1980 pada intinya sama: mata pulang, hantu lahir kembali, lalu **langsung
keluar** — ia tidak menunggu energizer habis. Bedanya matanya bergerak jauh lebih
cepat daripada hantu biasa, jadi jedanya malah lebih pendek lagi.

Jadi port ini sudah **lebih murah hati daripada aslinya**: matanya masih harus
menempuh jalan pulang, dan itu jeda yang tidak ada di PAC-GAL 1982.

**Yang ditambahkan, dan kenapa.** Yang hilang dari port ini bukan jedanya
melainkan **imbalannya**: PAC-GAL tidak punya skor sama sekali — satu-satunya
pencacah yang dicetaknya adalah `dots`. Memakan hantu karena itu tidak
menghasilkan apa pun, sehingga masa rentan hanya berarti beberapa detik aman
tanpa hasil. Di Pac-Man arcade justru di situ inti bonusnya. Dua mekanisme
arcade itu dipasang di sini:

| | Nilai | Tetapan |
|---|---|---|
| Nilai hantu berturut-turut dalam **satu** energizer | 200 / 400 / 800 / 1600 | `NILAI_HANTU` |
| Permainan membeku sambil menampilkan angkanya | 0.90 detik | `BEKU_LAMA` |

Rantainya kembali ke 200 setiap kali energizer **berikutnya** dimakan
(`rantai = 0` di cabang energizer, bukan di cabang pelet biasa — cabang yang
salah akan mereset rantai pada setiap pelet dan membuat kelipatannya tidak
pernah tercapai).

Jedanya diperiksa **paling awal** di `update()`, sebelum `langkahKe` menumpuk.
Kalau tidak, begitu jeda usai dunia akan melompat beberapa langkah sekaligus.
Ia juga membekukan pencacah rentan — persis seperti arcade, di mana waktu rentan
tidak berjalan selama angka ditampilkan.

Keduanya **rekonstruksi dari arcade, bukan dari PAC-GAL**, dan tercatat di §5.

---

## 5. Penyimpangan yang masih ada dari Pac-Man 1980

Disebutkan supaya tidak dicari-cari lagi sebagai bug:

| Penyimpangan | Alasan |
|---|---|
| Hantu **tidak berbalik arah** saat mode sebar/kejar berganti | 1980 memaksa berbalik; di sini tidak |
| Jadwal sebar/kejar sendiri (`SEBAR = [0, 56, 200, 256, 400]`) | 1980 punya jadwal per-level; port ini satu jadwal |
| **Tidak ada perlambatan di terowongan** | 1980 memperlambat hantu di terowongan |
| Hantu takut bergerak **acak**, bukan menjauh | rumus lamanya asli, tapi arah kaburnya tidak terpulihkan |
| Ambang keluar kandang berbasis pelet | rekonstruksi; PAC-GAL tidak punya aturan ini sama sekali |
| **Tidak ada pelepas-paksa berbasis waktu** | 1980 melepas hantu berikutnya kalau pemain lama tidak makan pelet; di sini pelepasan murni dari hitungan pelet |
| Mata hantu yang pulang bergerak **sekencang hantu biasa** | di 1980 mata jauh lebih cepat; laju di sini justru memberi jeda lebih panjang |
| Mata pulang lewat **jalan terpendek** (peta jarak) | 1980 memakai pemilih arah yang sama seperti hantu biasa; peta jarak dipakai di sini supaya mata tidak bisa tersesat |
| Keluar kandang juga lewat **peta jarak** | menghapus undian di ambang pintu; di 1980 hasilnya kebetulan sama karena urutan arahnya sudah membiaskan ke luar |
| **Skor hantu 200 / 400 / 800 / 1600 dan jeda 0.90 detik ditambahkan** | rekonstruksi dari arcade; PAC-GAL 1982 tidak punya skor apa pun, hanya pencacah `dots` |

---

## 6. Kalau ada yang perlu diubah

1. Baca [`GEOMETRY.md`](GEOMETRY.md) dulu. Jangan menggali geometri dari kode.
2. Ubah tetapan di `pacgal.js`, bukan angka di dokumen ini.
3. Jalankan `python decompile/tools/gen-pacgal-ref.py` — dokumen ini dan
   `GEOMETRY.md` terbit ulang, dan pemeriksaan geometrinya jalan lagi.
4. Kalau skripnya gagal dengan `TETAPAN HILANG`, itu memang gunanya: kode
   berubah tanpa dokumennya ikut. Perbaiki polanya, jangan hapus assert-nya.

### Tiga cara harness berkas ini pernah gagal — semuanya diam-diam

Ditulis lengkap karena ketiganya menghasilkan angka yang **kelihatan masuk akal**:

1. **Kotak kandang diturunkan dari posisi start hantu.** Hantu yang naik satu
   petak — masih di dalam kandang — sudah terhitung "keluar". Ujinya lulus
   persis di saat permainannya rusak.
2. **Koordinat dibalik dengan `x / 8`.** `pacgal.js` menggambar di
   `x = c*2*W + W/2` dengan `W = 8`, jadi baliknya `c = (x - 4) / 16`. Konversi
   yang salah menaruh tiap hantu di kolom ganda dan satu baris di bawah
   tempatnya, dan "di dalam kandang" jadi tidak pernah kena.
3. **Pemain uji tidak digerakkan.** Ia berjalan ke kiri sampai mentok dinding,
   lalu dimakan tiga kali dalam ~10 detik. Seluruh sisa pengukuran berjalan di
   atas permainan yang **sudah usai** — dan tentu saja hantu keempat "tidak
   pernah keluar", karena ambang 28 pelet tidak akan pernah tercapai.

Karena itu harness apa pun untuk berkas ini **wajib ikut melaporkan** nyawa,
jumlah kematian, dan pelet yang sudah termakan. Tanpa ketiganya, angka hantu
tidak bisa ditafsirkan sama sekali.

**Jangan** membangun uji dari posisi start hantu, dan jangan menurunkan geometri
apa pun dari tetapan yang sedang diuji. Ambil dari [`GEOMETRY.md`](GEOMETRY.md).
