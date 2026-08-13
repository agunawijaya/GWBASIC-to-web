# MAZE — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/MAZE.BAS` — Friendlyware PC Introductory Set |
| Tahun | 1982 |
| Ukuran asli | 305 baris — **terpanjang di Sesi 6** |
| Hasil port | [`../games/maze/`](../games/maze/index.html) |
| Analisis BASIC | [`../../reviews/MAZE.md`](../../reviews/MAZE.md) |

Labirin **orang-pertama**: Anda berdiri di dalam lorong dan hanya melihat apa
yang ada di depan mata. Ini program paling ambisius di seluruh koleksi — dan
caranya mencapai itu jauh lebih sederhana daripada yang terlihat.

---

## 1 · Tiga dimensi dari empat bit per sel

Seluruh labirin adalah `DIM A(7,7)` — 64 sel, masing-masing **satu angka**.
Empat bitnya adalah empat dindingnya:

```basic
400 L(1)=D AND 8 : L(2)=D AND 4 : L(3)=D AND 2 : L(4)=D AND 1
       8 = utara      4 = timur      2 = selatan     1 = barat
```

Pandangan lorongnya dibangun dengan **berjalan maju di dalam peta** sampai
empat sel, menggambar satu bingkai tiap kedalaman, dan berhenti begitu ada
dinding:

```basic
480 ON L+1 GOSUB 940,960,1020,1060,1100   ' gambar bingkai kedalaman L
500 IF L(DIR) THEN RETURN                 ' dinding di depan -> berhenti
510 L=L+1:IF L>4 THEN RETURN              ' maksimal empat sel
520 IF DIR=1 THEN X=X-1                   ' maju satu sel DI DALAM PETA
530 IF DIR=2 THEN Y=Y+1
540 IF DIR=3 THEN X=X+1
550 IF DIR=4 THEN Y=Y-1
```

Lima subrutin, satu per kedalaman. **Tidak ada perkalian matriks, tidak ada
proyeksi, tidak ada trigonometri** — hanya lima gambar yang ukurannya sudah
disiapkan, dipilih oleh sebuah `ON…GOSUB`.

Yang membuatnya bekerja: sudutnya cuma **empat**. Anda selalu menghadap salah
satu dari utara/timur/selatan/barat, jadi perspektifnya hanya punya lima
kemungkinan — dan lima kemungkinan tidak perlu dihitung, cukup disimpan.

> **Pelajaran.** Sebelum menghitung sesuatu, hitung dulu **berapa banyak
> jawaban berbedanya**. Kalau jumlahnya kecil dan tetap, tabel mengalahkan
> rumus — lebih cepat, lebih mudah diperiksa, dan tidak bisa salah dengan
> cara yang halus.
>
> Ini pola yang sama dengan tabel jawaban garpu di [TICTAC](tictac.md):
> ruang masalahnya cukup kecil untuk ditulis habis.

Di port ini bingkainya **dihitung** (`half(d) = HW × 0,52ᵈ`) alih-alih ditulis
satu per satu — bukan karena lebih benar, tapi karena dengan begitu jumlah
kedalaman bisa diubah dengan satu angka.

---

## 2 · Pintu keluar yang koordinatnya di luar peta

Tiap labirin punya **tepat satu lubang** di dinding luarnya, dan koordinat
pintu keluarnya berada **di luar** kisi 8×8:

| Labirin | Mulai | Pintu keluar | Langkah terpendek |
|--:|---|---|--:|
| 1 | (7,3) | **(8,2)** | 32 |
| 2 | (0,7) | **(8,0)** | 21 |
| 3 | (6,2) | **(8,1)** | 39 |
| 4 | (0,0) | **(−1,1)** | 22 |
| 5 | (0,3) | **(0,8)** | 19 |

Baris 8, kolom −1, kolom 8 — semuanya di luar `A(7,7)`.

Sekarang lihat urutan dua baris ini:

```basic
380 IF X=B(2) AND Y=B(3) THEN 580    ' pintu keluar? -> menang
390 D=A(S,T)                          ' baru sentuh larik
```

Pemeriksaan pintu keluar terjadi **sebelum** larik disentuh. Dan baris 390
memakai `S,T` — posisi **lama**, yang selalu di dalam kisi. Jadi koordinat di
luar batas itu tidak pernah dipakai sebagai indeks.

Aman. Tapi aman karena **urutan dua baris**. Tukar keduanya dan program membaca
di luar larik.

> Ini jenis kebenaran yang sama dengan bug cakram di [TOWERS](towers.md) dan
> pagar tak sengaja di [PEGLEAP](pegleap.md): benar, tapi tidak ada satu pun
> baris yang menyatakan **kenapa** ia benar. Yang berikutnya menyentuh kode ini
> tidak punya cara tahu bahwa urutan itu penting.

---

## 3 · Lima labirin tetap, dan pengacak yang tidak mengacak

```basic
2330 RANDOMIZE(VAL(RIGHT$(TIME$,2))*100)
2350 RANDOMIZE(RND*500)
2360 RANDOMIZE(RND*500)
2370 FOR C=1 TO FIX(RND*5)+1
2380   FOR A=0 TO 7:READ B(A):NEXT
2390   FOR A=0 TO 7:FOR B=0 TO 7:READ A(A,B):NEXT B,A
2400 NEXT C
```

**Program ini tidak membangkitkan labirin.** Ada lima labirin tetap di dalam
`DATA`, dan salah satunya dipilih dengan **membaca maju** lalu membuang yang
terlewati.

Kenapa begitu? Karena penunjuk `READ` di BASIC hanya bisa **maju**, atau
dikembalikan ke awal dengan `RESTORE`. Tidak ada cara melompat ke blok `DATA`
tertentu. Jadi "ambil yang ke-3" benar-benar berarti membaca tiga blok
berturut-turut dan membuang dua di antaranya — 144 angka dibaca lalu dibuang.

Itu bukan kemalasan; itu satu-satunya cara.

### Baris 2350 dan 2360

Keduanya menyemai ulang pengacak **dari keluarannya sendiri**.

Itu menambah **nol** entropi. Keluaran sebuah pengacak sepenuhnya ditentukan
oleh benihnya, jadi menyemai ulang dari keluarannya hanya memindahkan keadaan
ke tempat lain di deret yang sama — bukan ke deret yang berbeda.

Pola ini sudah tercatat sebagai kesalahan `WILDCAT.BAS` di
[fondasi §2.6](_fondasi.md). Di sini dilakukan **dua kali**.

Benihnya tetap `VAL(RIGHT$(TIME$,2))` — detik pada jam, **60 kemungkinan**.
Untuk lima labirin dengan dua titik mulai masing-masing, itu tetap membuat dua
orang yang menekan mulai pada detik yang sama mendapat labirin yang sama.

> **Pelajaran.** Menambah baris `RANDOMIZE` terasa seperti menambah keacakan,
> dan itulah yang membuat kesalahan ini menarik: ia **kelihatan** seperti
> perbaikan. Keacakan tidak bertambah dengan mengaduk lebih lama; ia hanya
> bertambah kalau ada **informasi baru** yang masuk.

---

## 4 · Memeriksa kelima labirinnya

Kelimanya diekstrak dari `DATA` ke `mazes.js` oleh sebuah program, bukan
disalin tangan — 360 angka, tepat 5 blok × 72. Lalu diperiksa:

| Pemeriksaan | Hasil |
|---|---|
| Dinding bersama disepakati kedua sel bertetangga | **0 ketidaksepakatan** di kelimanya |
| Lubang di dinding luar | **tepat 1** per labirin |
| Pintu keluar bisa dicapai dari titik mulai | **kelimanya bisa** |
| Panjang jalur terpendek | 19 – 39 langkah |
| Semua 64 sel bisa dicapai | **empat dari lima** — lihat §4b |

Pemeriksaan pertama itu yang paling berharga. Kalau tafsir saya atas bitnya
salah — misalnya 8 ternyata selatan, bukan utara — maka dinding antara dua sel
bertetangga akan sering tidak cocok. Nol ketidaksepakatan di 5 × 112 batas
adalah bukti kuat bahwa pemetaannya benar.

> **Pelajaran.** Data yang punya **redundansi** bisa memeriksa dirinya sendiri.
> Dinding antara dua sel dicatat dua kali di format ini — sekali sebagai
> "selatan" milik sel atas, sekali sebagai "utara" milik sel bawah. Redundansi
> itu terasa boros, dan justru itulah yang memungkinkan pemeriksaannya.

### 4b · Satu sel yang tidak bisa dimasuki siapa pun

Pemeriksaan itu diulang di halaman permainan, dan kali ini dengan satu
pertanyaan tambahan: *berapa sel yang benar-benar bisa dicapai dari titik
mulai?*

| Labirin | Keluar dalam | Sel tercapai |
|--:|--:|---|
| 1 | 32 langkah | **63 / 64** |
| 2 | 21 langkah | 64 / 64 |
| 3 | 39 langkah | 64 / 64 |
| 4 | 22 langkah | 64 / 64 |
| 5 | 19 langkah | 64 / 64 |

**Labirin pertama punya satu sel yang tertutup rapat di keempat sisinya.**
Kantong buntu yang tidak bisa dimasuki dari mana pun, di labirin yang digambar
tangan dan dikirim ke ribuan disket.

Ia tidak merusak apa pun — labirinnya tetap bisa diselesaikan — dan justru itu
sebabnya ia bertahan empat puluh tahun tanpa ada yang menyadarinya. Sebuah sel
yang tidak pernah dikunjungi siapa pun tidak punya cara mengeluh.

Satu koreksi yang layak dicatat: versi pertama pemeriksa ini menuntut **semua**
sel tercapai, dan langsung menuduh data 1982 cacat. Padahal syaratnya bukan
itu. "Bisa diselesaikan" berarti **pintu keluarnya tercapai** — sel tersegel
cuma membuat sebagian labirin tidak berguna, bukan membuatnya mustahil.

Bentuk kesalahannya sama persis dengan bug [MATCH](match.md): dua syarat yang
terdengar sama, dan hanya satu yang benar-benar jadi aturan.

---

## 4c · Pelajaran: bagaimana menjamin labirin pasti bisa diselesaikan

MAZE.BAS **tidak pernah mengajukan pertanyaan ini**, dan itu titik awal yang
menarik: ia tidak membangkitkan labirin sama sekali. Jaminannya datang dari
seorang manusia yang menggambar lima labirin dan memeriksanya sendiri.

Itu jawaban yang sah. Ia juga **tidak bisa diskalakan ke labirin keenam** —
dan, seperti §4b menunjukkan, tidak sepenuhnya berhasil bahkan untuk yang
kelima.

Jadi: kalau labirinnya dibangkitkan, bagaimana kita tahu ada jalan dari titik
mulai ke pintu keluar?

### Jawaban yang salah: acak lalu periksa

Robohkan dinding secara acak dengan peluang *p*, telusuri, ulangi kalau gagal.
Hasilnya benar — tapi ongkosnya tidak terbatas, dan seberapa sering ia gagal
bergantung sepenuhnya pada *p*. Diukur atas 2.000 labirin 8×8 per baris:

| Peluang dinding dibuka | Semua sel tercapai |
|--:|--:|
| 30% | **0,0%** |
| 40% | **0,0%** |
| 50% | **0,0%** |
| 60% | 1,4% |
| 70% | 18,4% |

Pada kepadatan yang menghasilkan labirin yang *terasa seperti labirin*
(30–50%), cara ini **tidak pernah berhasil sekali pun** dalam enam ribu
percobaan. Dan pada kepadatan yang sering berhasil, dindingnya sudah terlalu
sedikit untuk disebut labirin.

> **Pelajaran.** "Bangkitkan lalu periksa, ulangi kalau gagal" terdengar aman
> karena hasilnya selalu benar. Yang disembunyikannya adalah **berapa lama**
> — dan di sini jawabannya sering "tidak pernah".

### Jawaban yang benar: bangun sebagai pohon rentang

Gali dengan penelusuran mendalam acak, dan patuhi satu aturan:

```js
if (sudah[nr][nc]) continue;   // seluruh jaminannya ada di baris ini
```

*Setiap kali menggali, gali hanya ke sel yang belum pernah dikunjungi.*
Akibatnya berantai, dan tiap langkahnya bisa diperiksa:

1. tiap sel baru masuk lewat **tepat satu** dinding yang dibuka
2. jadi jumlah dinding dibuka = **jumlah sel − 1**
3. graf terhubung dengan *n* simpul dan *n−1* sisi adalah **pohon**
4. di pohon, **setiap** pasang simpul punya jalan — dan tepat satu

Termasuk pasangan mulai/keluar, **apa pun keduanya**. Tidak ada yang perlu
diperiksa sesudahnya: labirin yang tidak bisa diselesaikan bukan sekadar tidak
muncul — ia **mustahil dibangun**. Sel tersegel seperti di labirin 1 juga
mustahil, karena tiap sel dimasuki tepat sekali saat digali.

Diuji atas 200 labirin berukuran 4×4 sampai 12×12: **nol yang tidak terhubung,
nol dinding timpang, nol yang bukan pohon.**

### Dan pemeriksanya tetap ditulis

Kalau pembangkitnya benar secara konstruksi, kenapa masih menulis penelusuran?

**Bukan untuk menjaga pembangkitnya — melainkan untuk menjaga penyuntingnya.**
Seluruh invariannya hidup di satu baris `continue`, dan baris seperti itu
adalah yang paling mudah dihapus orang berikutnya yang merasa labirinnya
"terlalu sedikit cabangnya". Pemeriksa yang berjalan tiap kali membangkitkan
mengubah kesalahan diam menjadi kesalahan yang bersuara.

> **Pelajaran besarnya.** Ini kebalikan langsung dari pola yang berulang di
> koleksi ini:
>
> | Program | Statusnya |
> |---|---|
> | [PEGLEAP](pegleap.md) — pagar tersirat | benar karena **kebetulan** |
> | [MAXIT1](maxit1.md) — angka 600 | benar karena **kebetulan** |
> | [YAHTZEE](yahtzee.md) — straight besar | benar karena **kebetulan** |
> | pembangkit di sini | benar karena **dijaga, dua kali** |
>
> Ketiga yang pertama benar hari ini dan rapuh besok: satu perubahan kecil di
> tempat lain membuatnya salah tanpa ada yang tahu. Yang keempat benar karena
> bentuknya tidak mengizinkan yang lain — dan tetap diperiksa, karena bentuk
> bisa diubah orang.

### Di mana pelajaran ini ditaruh, dan kenapa

| Tempat | Isinya | Alasannya |
|---|---|---|
| **Layar permainan** | pembangkit hidup, pengukur, pembuktian jalur | "Benar karena konstruksi" adalah klaim yang harus **dilihat**, bukan dibaca |
| **Dokumen ini** | tiga pendekatan, angkanya, latihan | Bentuk panjang; tempat argumen lengkap tinggal |
| **Komentar `generator.js`** | invarian dinyatakan di tempat ia dijaga | Supaya penyunting berikutnya tahu apa yang tidak boleh dirusak |

**Bukan di `reviews/MAZE.md`** — berkas itu analisis program 1982, dan
pelajaran ini bukan tentang program 1982. Menaruhnya di sana akan mencampur
"apa yang ada di kodenya" dengan "apa yang seharusnya ada", dan pembaca
berikutnya tidak punya cara memisahkannya lagi.

Pembangkitnya **sengaja tidak disambungkan ke permainannya.** MAZE.BAS punya
lima labirin, dan port ini memainkan lima labirin — aturan mainnya
dipertahankan. Pembangkit itu bahan ajar, dan berdiri di berkasnya sendiri
(`generator.js`, `lesson.js`) supaya bisa dibuang tanpa menyentuh permainannya.

---

## 5 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala | Bentuk sekarang & alasannya |
|---|---|---|---|
| Peta | `A(7,7)`, 4 bit per sel | Memori | **Dipertahankan**, dan bitnya ditampilkan hidup di panel kanan |
| Pandangan | Lima subrutin gambar, ditulis satu per satu | Tidak ada proyeksi yang terjangkau | SVG dengan bingkai **dihitung**, tapi bentuknya sama: kerangka lorong, bukan tekstur |
| Menggambar | Langsung ke memori video (`DEF SEG=&HB000`/`B800`) | `PRINT` terlalu lambat | Tidak relevan; peramban tidak punya padanannya |
| Kontras dinding/bukaan | blok penuh lawan spasi kosong | mode teks | Harus **dibuat ulang dengan sengaja** — lihat di bawah |
| Deteksi adaptor | `PEEK(1040) AND 48` → mono atau warna | Dua jenis kartu grafis | Dibuang |
| Labirin | 5 tetap di `DATA`, dipilih dengan membaca maju | `READ` hanya bisa maju | Kelimanya diekstrak; pemilihannya jadi indeks biasa |
| Pengacak | `RANDOMIZE` tiga kali, dua dari keluarannya sendiri | Tidak ada sumber entropi | Disemai **sekali** dari `crypto.getRandomValues` |
| Belok | `↓` = `DIR+2`, balik badan (baris 270) | — | **Dipertahankan** — bukan mundur selangkah |
| Bunyi menabrak | `SOUND 300,1` / `SOUND 50,1` ×8 (baris 410) | — | Dipertahankan |
| Peta | tidak ada | — | **Ditambahkan, mati secara bawaan** — lihat di bawah |
| Jalur terpendek | tidak ada | — | Ditambahkan sebagai pembanding |

### Bug yang saya buat sendiri: dinding dan bukaan sewarna

Versi pertama render lorong ini punya cacat yang membuatnya nyaris tidak bisa
dimainkan: **lorong yang bercabang ke samping terlihat sama saja dengan tembok
buntu.**

| | rasio |
|---|--:|
| dinding `#101720` lawan bukaan `#05070a` | **1,12 : 1** |
| bukaan `#05070a` lawan latar `#05070a` | **1,00 : 1** |

Bukaannya digambar dengan warna yang **persis sama** dengan latarnya, dan
dindingnya cuma 12% lebih terang. Keduanya praktis satu warna.

Yang menarik: **aslinya tidak punya masalah ini.** MAZE.BAS mode teks —
dindingnya blok penuh `CHR$(219)`, bukaannya spasi kosong. Kontras maksimal,
gratis, tanpa seorang pun perlu memikirkannya. Mengganti blok dengan poligon
SVG-lah yang menghilangkannya.

Perbaikannya dua lapis:

1. Dinding dinaikkan ke `#55677a` — **3,45 : 1** terhadap bukaan.
2. Tiap bukaan diberi **tiang tegak terang di kedua tepinya**. Itu yang
   membuatnya terbaca sebagai *ambang pintu*, bukan sekadar panel yang
   kebetulan gelap.

Dan `.z-far` diturunkan dari opacity 0,55 ke 0,82: memudarkan yang jauh terlalu
kuat akan menghapus lagi kontras yang barusan diperbaiki. Jarak sudah
disampaikan oleh bingkai yang mengecil.

> **Pelajaran.** Beralih dari medium lama ke medium baru bisa **menghilangkan
> sifat yang dulu gratis.** Mode teks memaksa kontras tinggi karena hanya ada
> blok atau kosong; SVG mengizinkan segala gradasi, termasuk gradasi yang tidak
> bisa dibedakan mata. Kebebasan yang lebih besar berarti tanggung jawab yang
> tadinya dipegang medium kini berpindah ke Anda.
>
> Ini kali ketiga di proyek ini saya memilih warna dengan menebak dan salah —
> setelah tombol sekunder dan pasak Mastermind. Ketiganya ketahuan hanya
> setelah dilaporkan, dan ketiganya terjawab dalam satu menit begitu rasionya
> dihitung.

### Kenapa peta ada tapi mati secara bawaan

Ini deviasi terbesar di halaman ini, jadi alasannya perlu jelas.

Labirin orang-pertama kehilangan **seluruh** maksudnya kalau petanya terbuka —
yang tersisa cuma berjalan menyusuri koridor yang sudah Anda lihat.

Tapi tanpa peta, seseorang yang ingin **membaca kodenya** tidak punya cara
memeriksa bahwa pandangan lorongnya benar. Jadi ia disediakan, dimatikan
secara bawaan, dan dinyatakan di sini sebagai alat baca — bukan bagian dari
permainannya.

Dibuka dan ditutup dengan **<kbd>M</kbd>** atau tombolnya. Yang ditampilkan:
seluruh dinding, sel yang sudah Anda lewati, posisi dan **arah hadap** Anda,
serta sel tempat pintu keluarnya berada.

Menandai pintu keluar terasa seperti kelewatan, dan sebetulnya tidak menambah
apa-apa: petanya sudah membuka seluruh dinding, jadi lubang di tepi luar bisa
dicari sendiri dengan mata. Yang ditambahkan cuma menghemat penelusuran tepi —
bukan informasi.

Satu hal kecil yang dijaga di kodenya: tombol dan tuts <kbd>M</kbd> memanggil
**fungsi yang sama**. Kalau logikanya disalin dua kali, cepat atau lambat salah
satunya lupa diperbarui — dan keduanya lalu tidak sepakat soal apakah petanya
sedang terbuka.

---

## 6 · Latihan

1. **Ubah kedalaman pandangannya.** Ganti `DEPTH = 4` jadi 6 di `maze.js`.
   Apakah lorongnya terasa lebih dalam, atau justru lebih membingungkan?
   Sekarang bayangkan melakukannya di versi aslinya — berapa subrutin gambar
   baru yang harus ditulis?

2. **Bangkitkan labirin sungguhan.** Ganti kelima labirin tetap dengan
   pembangkit (DFS *recursive backtracker* muat dalam ±20 baris). Lalu periksa
   hasilnya dengan pemeriksaan yang sama di §4 — apakah dinding bersamanya
   selalu sepakat?

3. **Tukar dua baris.** Balik urutan baris 380 dan 390 pada versi BASIC-nya.
   Apa yang terjadi saat Anda melangkah ke pintu keluar? Kenapa bug itu hanya
   muncul di satu tempat di seluruh labirin?

4. **Ukur pengacaknya.** Tulis program yang meniru baris 2330–2370 dan
   menghitung labirin mana yang terpilih untuk keenam puluh nilai detik.
   Berapa labirin berbeda yang benar-benar bisa muncul? Sekarang hapus baris
   2350 dan 2360 — apakah jawabannya berubah?

5. **Bandingkan dengan yang datang kemudian.** *3D Monster Maze* (1982, ZX81)
   memakai teknik yang sama. *Wolfenstein 3D* (1992) memakai *raycasting* —
   sudut bebas, bukan empat. Apa yang membuat lompatan itu mungkin, dan apa
   yang hilang darinya?

---

Berkas terkait: [mainkan](../games/maze/index.html) ·
[TICTAC — tabel jawaban juga](tictac.md) ·
[TOWERS — benar karena kebetulan juga](towers.md) ·
[fondasi §2.6 — keacakan](_fondasi.md)
