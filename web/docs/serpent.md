# SERPENT — dari BASIC 1982 ke web

| | |
|---|---|
| Sumber | `run/SERPENT.BAS` — *"Serpent, Version 00"* |
| Tanggal | **6 Oktober 1982**, kode build `USR-5-5-K` |
| Ukuran asli | 64 baris |
| Hasil port | [`../games/serpent/`](../games/serpent/index.html) |
| Analisis BASIC | [`../../reviews/SERPENT.md`](../../reviews/SERPENT.md) |

Ular biasa — dengan satu hal yang sama sekali tidak biasa: **tubuhnya tidak
disimpan di larik mana pun.**

---

## 1 · Ular tanpa larik ular

Cari larik tubuh di 64 baris program ini. Tidak ada. Satu-satunya larik yang
dideklarasikan adalah empat ini, semuanya berindeks **1–2**:

```basic
530 …PX(1)=2:PY(1)=24:PX1(1)=1:PY1(1)=-1
    PX(2)=39:PY(2)=24:PX1(2)=-1:PY1(2)=-1
```

Itu posisi dan arah **dua musuh**. `LE` cuma pencacah panjang.

Lalu bagaimana ekornya tahu jalan? **Ia membaca layar.**

```basic
690 S=SCREEN(EY,EX):LOCATE EY,EX:PRINT " ";
700 IF S=179 THEN EY=EY+Y2 ELSE IF S=196 THEN EX=EX+X2
710 IF S=191 THEN IF X2=1 THEN X2=0:Y2=1:EY=EY+Y2 ELSE …
720 IF S=192 THEN …
730 IF S=217 THEN …
740 IF S=218 THEN …
```

| Kode | Glif | Artinya bagi penghapus ekor |
|--:|:--|---|
| 179 | `│` | terus tegak |
| 196 | `─` | terus mendatar |
| 191 | `┐` | belok: kanan ↔ bawah |
| 192 | `└` | belok: kiri ↔ atas |
| 217 | `┘` | belok: kanan ↔ atas |
| 218 | `┌` | belok: kiri ↔ bawah |

Enam glif, enam aturan. **Glif sudut memberi tahu penghapus ke mana ular dulu
berbelok** — jadi bentuk tubuhnya hidup sepenuhnya sebagai aksara di memori
layar, dan penghapus ekor adalah **penelusur senarai berantai yang simpulnya
adalah piksel**.

### Yang dihemat, dihitung

Ular panjang 200 butuh 200 pasangan koordinat. Di BASIC 1982 tanpa `DEFINT`
itu larik presisi ganda: 2 × 200 × 8 = **3.200 bita**. Layar teks 40×25 yang
**sudah ada** menyimpan bentuk yang sama secara gratis — dan sekaligus
menampilkannya.

### Diverifikasi

Kalau penghapus salah membaca **satu saja** sudut, ia akan menyimpang dari
jalur dan cacah tubuhnya langsung melenceng. Jadi ujinya sederhana dan tajam:
jalankan zig-zag panjang dan hitung glif tubuh di layar tiap beberapa langkah.

| | |
|---|--:|
| Panjang ular | 10 |
| Cacah glif tubuh, langkah 15–75, melewati puluhan sudut | **tetap 10** |
| Penyimpangan | **0** |

> **Pelajaran.** Struktur data tidak harus berupa larik. Kalau sebuah bentuk
> sudah harus digambar, gambarnya **adalah** penyimpanannya — dan satu-satunya
> yang dibutuhkan supaya bisa dibaca kembali adalah **abjad yang cukup kaya**.
> Enam glif gambar-garis cukup untuk menyandikan enam arah, dan itu sebabnya
> teknik ini mustahil dengan huruf biasa.

---

## 2 · Yang membunuh bukan dinding, melainkan rentang kode

```basic
630 S=SCREEN(HY,HX):IF S<219 AND S>178 OR S=235 THEN 860
```

Tidak ada daftar "benda mematikan". Yang ada satu **rentang kode aksara**:
179–218, ditambah 235.

| | |
|---|--:|
| Kode dalam rentang mematikan | 41 |
| Glif tubuh yang termasuk | **6 / 6** |
| Dinding `█` (219) termasuk? | **tidak** |
| Kode yang benar-benar digambar program ini | 7 |
| Kode dalam rentang yang tidak pernah muncul | 35 |

Keenam glif tubuh kebetulan semuanya jatuh di rentang itu, dan `█` (219) tepat
di luarnya — jadi dinding batas layar **tidak** membunuh lewat baris ini. Tepi
layar ditangani terpisah di baris 620 (`HX<1 OR HX>40 OR HY<1 OR HY>24`).

Ini *berhasil*, tapi rapuh dengan cara yang khas: menambahkan hiasan apa pun
yang kode aksaranya jatuh di 179–218 akan mematikan pemain tanpa alasan yang
terlihat di layar.

Dan `S=235` (`δ`) — **tidak ada apa pun di program ini yang menggambar aksara
itu.** Sisa dari versi sebelumnya yang tidak pernah dibersihkan.

> **Pelajaran.** Menguji *rentang* alih-alih *daftar* menukar kejelasan dengan
> kependekan, dan yang dibayar adalah kemampuan menambah apa pun ke layar
> tanpa memeriksa kode aksaranya lebih dulu. Satu baris yang lebih pendek, satu
> aturan tak tertulis yang harus diingat selamanya.

---

## 3 · Program yang menyalakan NumLock Anda

```basic
500 …DEF SEG=0:POKE 1047,32
```

Alamat 1047 adalah `0040:0017` — bita bendera papan ketik BIOS. Bit ke-5
(nilai 32) adalah **NumLock**.

Kenapa? Karena arahnya dibaca begini:

```basic
570 A=VAL(INKEY$)
580 IF A=4 …  590 IF A=6 …  600 IF A=2 …  610 IF A=8
```

`VAL(INKEY$)` hanya menghasilkan angka kalau tombolnya *mengetik angka*. Tuts
angka mengetik angka **hanya saat NumLock menyala** — jadi program ini
menyalakannya sendiri, dengan menulis langsung ke memori BIOS, dan **tidak
pernah mengembalikannya**.

[ATTACK](attack.md) — program tetangganya dari hari berikutnya — melakukan hal
yang sama **dua kali**, lewat dua cara berbeda, dalam satu program.

---

## 4 · Layar sebagai struktur data — kemunculan keempat

| Program | Yang dibaca dari layar |
|---|---|
| [SPACE](space.md) | latar, supaya `PUT…XOR` bisa menghapus dirinya sendiri |
| [METEOR](meteor.md) | sasaran — `SCREEN(Y,X)=219` berarti kena |
| **SERPENT** | **bentuk tubuhnya sendiri**, sebagai senarai berantai |
| PAC-GAL *(dari EXE)* | tabrakan labirin — `SCREEN(r, c*2+1)` |

Yang membuat SERPENT paling jauh: tiga yang lain **menanyakan** keadaan ke
layar. SERPENT **menyimpan strukturnya di sana** — dan tanpa layar itu,
programnya tidak punya ular sama sekali.

### Catatan ketelitian, 9 Agustus 2026

Agen yang membongkar `PAC-GAL.EXE` mengukur sesuatu yang menyentuh tabel di
atas. Ia memasang kait pada **setiap pembacaan memori dari B800** (video RAM)
selama 150 juta instruksi, dan menghitung berapa yang berasal dari kode
program:

| | Pembacaan VRAM dari kode pengguna |
|---|--:|
| HOPPER | 0 |
| **PAC-GAL** | **0** — padahal ia punya dua belas situs `SCREEN()` |

Kesimpulan yang ditarik waktu itu: `SCREEN()` di **BASCOM** tidak membaca video
RAM, melainkan menjawab dari salinan bayangan milik runtime.

> [!WARNING]
> **Sudah tidak berlaku sejak Putaran 3, 9 Agustus 2026.** Angka nol di atas
> ternyata **cacat alat, bukan temuan**, dan agen yang mengukurnya sendiri yang
> menariknya kembali. Dua sebabnya: `textscreen.py` tidak menangani `int 10h ah=08h` sama
> sekali (jadi tidak ada pembacaan yang bisa terpantau), dan kait pengukurnya
> menulis `AX` sebelum pencatat sempat membaca nomor fungsinya.
>
> Yang sebenarnya terjadi, dibongkar sampai `retf`:
>
> ```asm
> 21168  mov  bh, [0xb1]     ; halaman tampilan
> 21173  mov  ah, 2          ; setel kursor
> 21175  call 18292          ; pembungkus int 10h polos
> 21178  mov  ah, 8          ; BACA KARAKTER DAN ATRIBUT DI KURSOR
> 21180  call 18292
> ```
>
> Jadi `SCREEN(baris,kolom)` **memang menanyakan layar** — lewat BIOS video, yang
> membaca memori layar. Sisi dinamisnya cocok satu-satu: rutin itu dimasuki
> **1.039 kali**, `int 10h ah=08h` tercatat **1.039 kali**, nol keluar lebih awal
> di validasi. Tidak ada salinan bayangan.

**Apakah temuan §1 batal?** Tidak — tidak waktu itu, dan tidak sekarang. Yang
menarik justru bahwa jawabannya sama untuk kedua versi dunia, dan alasannya
perlu dinyatakan, bukan diasumsikan.

Yang penting bukan *di alamat mana* jawabannya disimpan, melainkan **siapa yang
memilikinya**. Program tidak punya larik tubuh; yang menyimpan bentuk itu adalah
subsistem tampilan. VRAM, BIOS, atau salinan bayangan — kesimpulannya sama:
**satu-satunya salinan bentuk ular itu adalah yang sedang ditampilkan.**

Satu catatan tambahan supaya batas klaimnya tetap jelas: pengukuran itu tentang
**BASCOM** — EXE ter-compile. SERPENT dan [METEOR](meteor.md) adalah `.BAS` yang
**ditafsirkan**, jalur yang berbeda. Saya tidak mengukur GW-BASIC, jadi saya
tidak mengklaim apa pun tentangnya.

> **Pelajaran pertama, dan ia bertahan dua kali.** Sebuah temuan yang dinyatakan
> pada tingkat yang tepat bertahan terhadap pengukuran yang lebih dalam. Kalau §1
> di atas berbunyi *"ia membaca video RAM"*, ia akan runtuh oleh satu kait memori.
> Karena ia berbunyi *"tidak ada larik tubuh; bentuknya hidup di layar"*, ia
> selamat — mula-mula terhadap pengukuran yang ternyata salah, lalu terhadap
> pembongkaran yang membetulkannya. Klaim Putaran 2 yang runtuh justru yang
> dinyatakan pada tingkat **mekanisme**.

> **Pelajaran kedua, dan ini yang lebih tajam: ketiadaan bukan bukti.** Angka
> nol itu dipakai sebagai temuan, padahal ia gejala dua cacat alat. Sebuah nol
> selalu punya dua kemungkinan — **hal itu tidak terjadi**, atau **saya tidak
> bisa melihatnya** — dan yang kedua wajib disingkirkan lebih dulu. Bandingkan
> dengan §6d di bawah, yang menemukan cacat lewat arah sebaliknya: bukan dengan
> mencari gejala, melainkan dengan menuliskan keadaan yang **harus mustahil** dan
> memeriksanya tiap bingkai. Nol yang berasal dari invarian yang dilanggar-atau-
> tidak berbeda jenis dengan nol yang berasal dari alat yang mungkin buta.

Musuhnya pun begitu: baris 790–800 membaca `SCREEN` di depan langkahnya untuk
memutuskan berbalik. Tidak ada apa pun di program ini yang tahu di mana dinding
berada.

---

## 5 · Kesulitan yang naik dua tingkat

```basic
640 …AP=AP+1:IF AP<5 THEN 750 ELSE …DL=DL+1:
    IF DL=5 THEN DL=0:P=P+1:GOTO 530 ELSE 530
```

| Pemicu | Akibat |
|---|---|
| 1 apel | +10 skor, +1 panjang |
| 5 apel | +1 petak labirin |
| 5 labirin (= 25 apel) | +1 musuh |

Dua pencacah bersarang. Musuh kedua baru muncul setelah **25 apel**, dan `DL`
dikembalikan ke nol setiap kali — layarnya dibersihkan dari labirin lalu diisi
lagi dari awal.

Satu cacat yang ikut diport: larik musuhnya `PX(4)` tapi baris 530 hanya
mengisi indeks 1 dan 2. Jadi **musuh ketiga dan keempat tidak pernah
benar-benar ada** — `P` boleh naik terus, tapi yang bergerak tetap dua.

---

## 6 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Tubuh ular | glif di memori layar (§1) | 3.200 bita larik terlalu mahal | **Ditiru persis**: ada petak 25×40 berisi kode aksara, kepala menulis glif ke sana, penghapus membacanya kembali. Mengganti dengan larik koordinat akan lebih pendek **dan menghapus seluruh alasan program ini layak dibaca** |
| Glif gambar-garis | `│ ─ ┌ ┐ └ ┘` | — | **Tetap jadi simulasinya**, tapi digambar sebagai ular sungguhan — lihat §6b. Tombol *Tampilan glif* mengembalikan aksaranya |
| Syarat mati | rentang kode 179–218 (§2) | — | **Dipertahankan persis**, termasuk `235` yang tidak pernah muncul |
| Kendali | tuts angka 4/6/2/8, NumLock dipaksa (§3) | `VAL(INKEY$)` | Panah **dan** angka sama-sama jalan; tidak ada yang dipaksa |
| Pembacaan arah | satu tombol dari **penyangga** per langkah | `INKEY$` | **Antrean**, bukan keadaan tombol — lihat §6c. Lebih setia *dan* memperbaiki lag |
| Membalik 180° | membunuh — kepala masuk ke lehernya sendiri | `IF A=4 AND X1<>-1` hanya mencegah arah yang sama | **Diabaikan, tidak mematikan.** Penyimpangan atas permintaan pemilik koleksi; aslinya tidak logis bagi pemain |
| Mangsa | hanya apel `ö`, diam | — | **Ditambah kodok hijau yang melompat**, +25 dan panjang +2. Sasaran bergerak lebih sulit daripada apel diam, dan itu satu-satunya alasan ia layak ada di samping apel. Kodenya **164**, sengaja di luar rentang mematikan 179–218 (§2) |
| Persediaan mangsa | apel selalu diganti begitu dimakan (baris 700) | — | **Kodok tidak diganti.** Dua ekor per ronde, habis ya habis — atas permintaan pemilik koleksi. Apel tetap diganti persis seperti aslinya. Alasannya: mangsa yang langsung terisi ulang berhenti jadi sasaran dan berubah jadi arus tanpa ujung — yang tersisa cuma apel dengan bentuk lain. Dua ekor yang terbatas membuat memburunya jadi keputusan. Ronde baru (tiap 5 apel) dan nyawa baru menyiapkan dua ekor lagi, sebagai bagian dari penyiapan papan — sama seperti lima apelnya |
| Musuh | `ó` memantul **tiap langkah** (750–820) | — | **Kodok beracun yang melompat berselang**: diam 1,1–2,8 dtk lalu melompat 0,34 dtk. Penyimpangan atas permintaan pemilik koleksi. Logika pantul baris 790–800 dipertahankan sebagai cara memilih arah, dan sasarannya **divalidasi** supaya tidak pernah mendarat di badan ular — aslinya tidak memeriksa itu |
| Kodok vs apel | kodok menginjak apel dan menghapusnya saat pergi (760, 790–800) | pantulan hanya menguji rentang 179–218 | **Cacat, diperbaiki.** Sasaran lompat harus benar-benar kosong. Aslinya ini **mengunci ronde selamanya** — lihat §6d |
| Penempatan apel | 5 apel diundi tanpa memeriksa apa pun (560) | `LOCATE RND…: PRINT` tidak bisa gagal | **Cacat, diperbaiki.** Undian diulang sampai dapat sel yang boleh ditempati. Dua apel di satu sel mengunci ronde dengan cara yang sama, ~1 dari 95 ronde — §6d |
| Panjang sesudah mati | tetap; `L=10` hanya di baris 510, dan 870 melompat ke 530 | — | **Dipertahankan persis.** Port sebelumnya mengembalikannya ke 10 dan diam-diam membuat permainan lebih mudah — §6d |
| Kecepatan | satu putaran perulangan penafsir | tidak ada pewaktu | Penggeser langkah/detik, bawaan 10 — sama seperti [BREAKOUT](breakout.md) |
| Musuh | larik `PX(4)`, hanya 2 terisi (§5) | — | **Dipertahankan**, dan cacatnya dicatat |
| Rupa | CGA 40 kolom | — | Warna dan cahaya dimodernkan **di sekeliling glif**, tidak menggantikannya |
| Petak labirin | `│ ─` biru dan isian biru gelap, seragam | — | **Pagar kayu cokelat** untuk glifnya, **tanah cokelat** untuk isiannya. Permintaan pemilik koleksi, dan diminta sebagai selera &mdash; tapi lihat §6e: rupanya kebetulan memperlihatkan aturan yang selama ini tersembunyi |
| Gelombang merayap | tidak ada | — | Hanya **setengah depan**. Versi pertama menggoyang seluruh badan dan melelahkan dilihat — dilaporkan pemilik koleksi. Diukur pada garis tengah badan: sebaran ekor **0,000**, sebaran depan **1,75** |
| Sorotan penghapus ekor | tidak ada | — | **Ditambahkan** — satu-satunya efek yang bukan hiasan: ia memperlihatkan mekanik intinya bekerja |
| Keluar | `LOAD"MENU",R` | tiap program berkas terpisah | Tautan kembali di bilah atas |

Baris "sorotan penghapus ekor" adalah tambahan, dan dinyatakan begitu. Sisanya
mengikuti aslinya.

### 6b · Ular yang digambar dari rantai glif

Versi pertama port ini mempertahankan aksaranya di layar, dengan alasan: *"di
sini rupa retro bukan rupa — ia implementasinya."*

Pemilik koleksi meminta ular sungguhan yang merayap. Alasan itu **tidak batal**
— yang berubah adalah cara memenuhinya.

Bentuk ularnya **tidak dikarang dari daftar koordinat terpisah**. Kalau begitu,
port ini akan punya dua sumber kebenaran yang bisa menyimpang. Ia dibaca dari
petak, oleh `jalurTubuh()`, dengan **aturan yang sama persis** dengan penghapus
ekor di baris 700–740:

```js
if (s === V)  y += dy;                    // │  terus tegak
else if (s === H)  x += dx;               // ─  terus mendatar
else if (s === TR) { … }                  // ┐  belok
…
```

Jadi **tiap lengkungan tubuh yang terlihat adalah satu glif sudut yang
benar-benar tersimpan di petak layar.** Gambarnya bukan hiasan di atas
simulasi — ia gambar *dari* senarai berantainya, dan kalau satu glif salah,
ularnya langsung putus di layar.

Empat lapis di atas itu, semuanya **murni rupa** dan tidak menyentuh satu pun
posisi sel:

| Lapis | Apa yang dilakukan |
|---|---|
| Cuplik ulang Catmull-Rom, 4 titik per sel | membulatkan sudut kisi — tanpa ini tubuhnya siku-siku |
| Gelombang merayap | simpangan tegak lurus lintasan, berjalan kepala→ekor, teredam di kedua ujung |
| Runcing ke ekor | lebar `0,9 + 3,1·u^0,65` |
| Interpolasi `alpha` | kepala meluncur di antara dua langkah simulasi, bukan melompat sel |

Dan satu yang **mengumumkan sesuatu yang nyata**: mulut membuka saat ada buah
dalam **tiga sel** di depan kepala. Itu rupa, tapi yang ditampilkannya adalah
isi petak — bukan tebakan.

Tombol **Tampilan glif** mengembalikan aksaranya. Keduanya membaca petak yang
sama; `langkah()` tidak tahu mode mana yang sedang aktif.

### 6c · Enam hal yang ditemukan setelah dipakai

Dilaporkan pemilik koleksi setelah mencoba versi pertama. Dicatat karena
ketiganya jenis yang berulang.

**Dua penampil muncul sekaligus.** Menukar ke tampilan glif lalu kembali
membuat ular dan aksara tergambar bersamaan. Dugaan pertama saya salah — saya
menyangka `display: block` milik penulis mengalahkan `[hidden]` milik peramban.
Itu benar *sebagai aturan CSS*, tapi bukan sebabnya. Sebabnya:

```js
svg.hidden = true;      // tidak berpengaruh pada elemen SVG
```

`hidden` adalah properti IDL milik `HTMLElement`. Pada `SVGElement` ia cuma jadi
properti JavaScript biasa yang **tidak pernah terpantul ke atribut**. Diperbaiki
dengan `setAttribute('hidden','')`, yang bekerja untuk keduanya.

**Belokan hilang.** Arah dicuplik dengan `kb.isDown()` sekali per langkah
simulasi — sepuluh kali per detik. Ketukan singkat yang jatuh di antara dua
cuplikan **hilang sama sekali**; pemain harus menekan berkali-kali. Diganti
dengan **antrean** yang diisi saat tombol ditekan dan dikonsumsi satu per
langkah.

Yang menarik: bentuk itu justru **lebih setia**. Aslinya `A=VAL(INKEY$)` membaca
satu tombol dari *penyangga papan ketik*, bukan keadaan tombol saat itu — jadi
antrean adalah terjemahan yang lebih tepat daripada `isDown()`.

**Musuh tidak mematikan.** Baris 650 berbunyi `IF S=162 THEN 860` — menyentuh
musuh membunuh. Kode 162 ada **di luar** rentang 179–218 milik baris 630, jadi
ia butuh barisnya sendiri, dan versi pertama port ini melewatkannya. Bukan
penyederhanaan yang disengaja: kelalaian, ditemukan saat meninjau ulang atas
laporan.

> **Pelajaran.** Ketiganya lolos dari pengujian saya karena saya menguji **yang
> saya bangun**, bukan **yang dipakai**. Cacah glif tubuh yang tetap 10 melewati
> puluhan sudut membuktikan penghapus ekornya benar — dan tidak mengatakan apa
> pun tentang apakah tombolnya terasa responsif, apakah musuhnya berbahaya, atau
> apakah dua penampil bisa muncul bersamaan. Uji yang tajam pada satu sumbu
> tidak memberi jaminan apa pun pada sumbu lain.

**Kodok terbaca sebagai mangsa.** Cacat kelima, dan seluruhnya milik saya.

Baris 650 berbunyi `IF S=162 THEN 860` — menyentuh musuh **membunuh**. Aslinya
musuh itu digambar sebagai `ó`, aksara yang tidak menjanjikan apa pun. Saya
menggantinya dengan **kodok berwarna kuning-emas** — dan kodok di sebelah ular
membaca sebagai makanan. Pemilik koleksi mencobanya, mengira itu mangsa, dan
mati.

Rupanya bertentangan dengan aturannya, dan **yang salah rupanya**.

Diperbaiki dengan **aposematisme** — pola peringatan yang dipakai kodok panah
beracun sungguhan:

| Lapis | Yang dilakukan |
|---|---|
| Ungu magenta | satu-satunya rona yang tidak dipakai apa pun lain di papan (ular hijau, apel merah muda, pagar dan tanah cokelat) |
| Tiga bercak gelap | kontras tinggi — bagian kedua dari pola aposematik |
| Lingkar denyut | menandai sel berbahaya bahkan saat kodoknya diam |
| Mata hijau limau | melengkapi kontras, dan menjauhkannya dari mata putih ular |

Ditambah tiga tempat teks yang menyebutnya sebelum pemain menemukannya sendiri:
keping aturan, label papan angka, dan langkah ketiga di *Cara bermain*. Dan
saat mati karenanya, pesannya menyebut sebabnya — bukan sekadar "mati".

> **Pelajaran.** Aturan mainnya tidak berubah sedikit pun; yang berubah cuma
> gambarnya, dan itu sudah cukup untuk membuat pemain melakukan hal yang
> sebaliknya. **Rupa adalah bagian dari aturan** — kalau ia menjanjikan sesuatu
> yang tidak dipenuhi kode, pemain akan mempercayai rupanya. Aslinya lolos dari
> jebakan ini bukan karena lebih bijak, melainkan karena `ó` tidak menjanjikan
> apa-apa.

Dan karena harapan itu masuk akal, ia dipenuhi: **kodok mangsa ditambahkan**,
hijau-zaitun, tanpa bercak dan tanpa lingkar. Pelajaran di atas dipakai
terbalik — kalau rupa mencolok berarti *jangan sentuh*, maka rupa biasa berarti
*boleh*. Dua jenis kodok sekarang menandai dirinya sendiri, dan pemain tidak
perlu mati untuk mempelajari yang mana.

**Kodok tak pernah terlihat.** Yang keenam bukan cacat melainkan temuan:
kodok pertama baru muncul setelah **25 apel** (5 apel per labirin, 5 labirin per
kodok). Sebagian besar pemain tidak akan pernah melihatnya. Karena halaman ini
ada untuk *memperlihatkan* mekaniknya, ditambahkan pemilih **"Mulai dengan
0/1/2 kodok"** — tambahan, dinyatakan begitu.

### 6d · Ronde yang tak bisa disudahi — satu laporan, empat cacat

Dilaporkan pemilik koleksi: *"Kodok bisa lompat ke posisi apel. Setelah itu
kodok melompat lagi, dan gambar apel menghilang. Game jadi tidak bisa
disudahi — jumlah apel yang harus dimakan kurang satu, tapi gambar apelnya
sudah tidak ada. Ular jadi harus bunuh diri."*

Diagnosisnya benar seluruhnya, dan yang ditemukan ternyata cacat **1982**,
bukan cacat port.

**Sebab 1 — kodok menghapus apel (asli).** Kodok berbalik hanya untuk rentang
mematikan:

```basic
790 S1=SCREEN(…):S2=SCREEN(…):IF S1<219 AND S1>178 THEN PY1(PL)=-PY1(PL)
800 IF S2<219 AND S2>178 THEN PX1(PL)=-PX1(PL)
```

Apel berkode **148**, di luar rentang itu — jadi kodok boleh menginjaknya. Dan
langkah berikutnya menghapus sel yang ditinggalkan tanpa peduli isinya:

```basic
760 LOCATE PY(PL),PX(PL):PRINT " ";
```

Apelnya lenyap. Rondenya terkunci, karena baris 560 menaruh **tepat lima** apel
dan baris 640 hanya maju setelah `AP` mencapai 5 — apel yang dimakan **tidak**
diganti satu per satu, papannya baru dibangun ulang setelah kelimanya habis.
Kurang satu apel berarti `AP` mentok di 4 selamanya.

Aslinya cacat ini baru hidup setelah **25 apel** (musuh pertama muncul saat `P`
jadi 1). Kodok mangsa yang saya tambahkan memakai mesin gerak yang sama dan ada
sejak langkah pertama — jadi port ini **menaikkan cacat laten jadi cacat yang
langsung menggigit**. Bagian itu salah saya.

**Sebab 2 — dua apel di satu sel (asli).** Baris 560 tidak memeriksa apa pun:

```basic
560 COLOR 4:FOR R=1 TO 5:LOCATE RND*22+2,RND*39+1:PRINT "ö";:NEXT
```

Dua apel bisa jatuh di sel yang sama, dan yang tersisa cuma empat — **kunci yang
sama persis, lewat sebab lain.** Lima apel ke ~950 sel bebas memberi peluang
kira-kira **1 dari 95 ronde**: cukup jarang untuk lolos pengujian, cukup sering
untuk ditemui pemain. Apel juga bisa jatuh tepat di atas pagar labirin dan
melubanginya.

**Sebab 3 — dua kodok mengincar sel yang sama (port).** Kodok yang sedang
melayang masih tercatat di sel **asalnya**, bukan tujuannya (itu disengaja,
supaya ular tidak bisa menembusnya). Akibatnya dua kodok bisa memilih tujuan
yang sama, lalu yang satu menghapus yang lain saat melompat pergi. Cacat yang
sama dengan sebab 1, korbannya saja berbeda.

**Sebab 4 — kemajuan apel terbawa melewati kematian (port).** Bukan penyebab
kunci, tapi ketahuan oleh alat uji yang sama. Baris 530 berbunyi `AP=0`, dan ia
dijangkau dari **dua** arah: dari baris 640 (lima apel terkumpul) dan dari baris
870 (mati, nyawa masih ada). Versi sebelumnya menaruh pengosongan itu di
pemanggil, jadi jalur kematian melewatkannya. Sekalian ketahuan pasangannya:
port juga mengembalikan panjang ular ke 10 saat mati, padahal `L=10` di baris
510 **cuma dijalankan sekali** saat program mulai — baris 870 melompat ke 530,
yang hanya menyalin `LE=L`. Aslinya ular yang sudah panjang bangkit tetap
panjang.

**Perbaikannya.** Untuk sebab 1 dan 3, satu syarat menggantikan daftar
pengecualian: sasaran lompat harus **benar-benar kosong**, dan tidak sedang
diincar kodok lain. Itu sekaligus menutup badan ular, pagar, tanah, apel, dan
kodok jenis lain. Untuk sebab 2, undian apel diulang sampai dapat sel yang boleh
ditempati — kosong **atau** tanah ladang, karena ladang memang bisa dimasuki
(§6e), jadi apel di dalam kandang tetap sah. Untuk sebab 4, `AP=0` dipindah ke
dalam fungsi yang memodelkan baris 530, dan pengaturan ulang panjang dihapus.

**Buktinya.** Satu invarian yang harus benar di **tiap bingkai**: apel di papan
+ apel yang sudah dimakan = 5. Dijalankan 40.000 bingkai dengan dua kodok
beracun menyala sejak awal, ular dikemudikan pemburu apel otomatis:

| | |
|---|--:|
| Bingkai diperiksa | 40.000 |
| Ronde diselesaikan | 5 |
| Tingkat labirin dicapai | 2 |
| Pelanggaran invarian | **0** |
| Kodok menumpuk apel | **0** |
| Ronde terkunci >6.000 bingkai | **0** |

> **Pelajaran.** Ketiga cacat sebelumnya (§6c) ketahuan karena **dipakai**. Yang
> ini ketahuan karena dipakai *dan* ada invarian yang bisa dituliskan. Bedanya
> penting: laporannya menyebut satu jalan (kodok menginjak apel), invariannya
> menemukan **empat**. Uji yang menanyakan "apakah keadaan ini mustahil?"
> menangkap sebab yang tidak terpikir; uji yang menanyakan "apakah gejala ini
> muncul?" hanya menangkap yang sudah dilaporkan.

### 6e · Pagar kayu, tanah ladang — dan aturan yang selama ini tak terlihat

Pemilik koleksi meminta: petak biru itu jadi **pagar kayu cokelat** dan **tanah
cokelat**, karena bentuknya sudah terbaca seperti ladang. Diminta sebagai selera,
dan dikerjakan sebagai selera.

Tapi warnanya harus dibagi ke suatu tempat, dan pembagian itu ternyata sudah
ditentukan oleh baris 540 — bukan oleh saya. Satu petak labirin terdiri dari
**dua benda dengan nasib berbeda**:

| Bagian | Kode | Rentang mematikan 179–218 (§2) | Akibatnya |
|---|--:|---|---|
| Bingkai `│` `─` | 179, 196 | **di dalam** | menyentuhnya membunuh |
| Isian | **28** | di luar | **aman dilewati** |

Selama keduanya sama-sama biru, tidak ada satu pun cara melihat perbedaan itu.
Petaknya terbaca sebagai satu balok padat, dan pemain yang menyimpulkan
"jangan dekat-dekat" tidak akan pernah tahu bahwa **bagian dalamnya bisa
dimasuki**.

Baris 540 dan 527 sebenarnya membangun sesuatu yang lebih menarik daripada
balok:

```basic
540 …FOR LP=5 TO 19: LOCATE LP,PS: PRINT "│"; …9 isian… "│"; : NEXT
    FOR K=0 TO 10: LOCATE 12,PS+K: PRINT "─"; : NEXT
```

Lima belas baris tinggi, sebelas kolom lebar, **tidak ada bingkai di sisi atas
dan bawah**, dan satu galar melintang di baris 12. Itu bukan balok — itu
**kandang dua ruang yang terbuka di kedua ujungnya**. Ular bisa masuk dari atas,
berbalik di dalam, dan keluar lagi; yang tidak boleh cuma menembus dindingnya
atau galar tengahnya.

Sekarang yang membunuh berupa pagar, yang aman berupa tanah, dan bentuk itu
terbaca dari layar tanpa perlu dijelaskan. Kayunya sengaja dibuat **lebih
terang** daripada tanahnya: yang mematikan harus lebih menonjol daripada yang
aman.

Angkanya diperiksa dua sumber — dihitung dari BASIC-nya, lalu dicacah dari DOM
saat satu petak aktif (`DL=1`, jadi `PS = 1/(1+1)×40 = 20`):

| Yang dihitung | Dari BASIC | Tercacah |
|---|--:|--:|
| Kolom pagar tegak | 20 dan 30 (`PS`, `PS+10`) | 20 dan 30 |
| Sel pagar tegak | 15×2 − 2 *(baris 12 diambil `─`)* = **28** | 28 |
| Sel pagar mendatar | 11 *(baris 12)* + 40 *(dinding bawah, baris 550)* = **51** | 51 |
| Sel tanah | 15×9 − 9 *(baris 12)* = **126** | 126 |

Satu catatan teknis yang mengubah gambarnya. Percobaan pertama memakai **dua
bilah per sel**, selebar 2,8 satuan dengan sela 1,4. Papan 40 kolom digambar
pada `viewBox` selebar 400, jadi satu satuan ≈ satu piksel — dan sela 1,4 piksel
melebur. Pagarnya tergambar benar dan **terbaca sebagai tembok polos**. Diganti
jadi **satu bilah selebar 3,6**, yang menyisakan sela 6,4 piksel antar sel.
Jumlah elemennya turun 40 dan pagarnya baru terlihat sebagai pagar.

> **Pelajaran.** Ini kebalikan dari §6c. Di sana rupa yang salah
> **menyembunyikan** aturan; di sini permintaan selera **memaksa saya memilih di
> mana batas warnanya jatuh**, dan satu-satunya jawaban yang bisa dipertahankan
> adalah batas yang sudah ada di kodenya. Selera yang dipetakan ke struktur
> tidak menambah kebohongan — ia membongkar sesuatu yang sudah lama tertulis.

---

> **Pelajaran.** Permintaan "buat lebih cantik" dan syarat "jangan hilangkan
> temuannya" **tidak selalu bertentangan**. Yang menyelesaikannya bukan
> kompromi di tengah, melainkan menanyakan dari mana bentuk itu boleh berasal:
> begitu ularnya digambar **dengan menelusuri rantai glif**, kecantikannya
> justru jadi bukti bahwa rantainya bekerja.

---

## 7 · Latihan

1. **Patahkan penghapusnya.** Ubah satu aturan di baris 700–740 — misalnya
   tukar `┐` dengan `┘`. Berapa langkah sampai ularnya kelihatan salah, dan
   apa gejalanya?

2. **Hitung ambang abjadnya.** Berapa glif minimum yang dibutuhkan untuk
   menyandikan lintasan ular di kisi empat arah? Kenapa jawabannya bukan empat?

3. **Cari 235.** Telusuri seluruh 64 baris dan tunjukkan bahwa `δ` memang tidak
   pernah digambar. Apa dugaan Anda tentang versi sebelumnya?

4. **Perbaiki musuhnya.** Larik `PX(4)` cuma diisi dua. Isi keempatnya —
   di mana Anda menaruh dua yang baru, dan kenapa posisi awal itu penting?

---

Berkas terkait: [pakai](../games/serpent/index.html) ·
[ATTACK — kerangka pembuka yang sama, sehari sesudahnya](attack.md) ·
[METEOR](meteor.md) · [SPACE](space.md) — layar sebagai struktur data
