# Spacewar — dari EXE assembly ke halaman web

| | |
|---|---|
| Sumber | `run/SPACEWAR.EXE` — 22.528 bita |
| Basis port | **tidak ada `.bas`** — satu-satunya di koleksi ini yang begitu |
| Ukuran asli | 11.088 bita kode · 107 subrutin · CGA mode 6 (640×200, 1 bit) |
| Tahun | **1985** — dari string `" 1985  B SEILER."` di dalam binernya |
| Penulis | **Bill Seiler**, V1.50, dijual dengan konsep *user-supported* |
| Hasil port | [`../games/spacewar/`](../games/spacewar/index.html) |
| Analisis dekompilasi | [`../../decompile/SPACEWAR/ARCHITECTURE.md`](../../decompile/SPACEWAR/ARCHITECTURE.md) |
| Pemanen string | [`../../decompile/tools/harvest-spacewar.py`](../../decompile/tools/harvest-spacewar.py) |

---

## 1 · Satu-satunya yang tidak pernah BASIC

Tiga EXE lain di koleksi ini (`3DTTT`, `PAC-GAL`, `HOPPER`) adalah BASIC yang
di-compile. Ketahuannya bukan dari menebak, melainkan dari dua angka yang tidak
bisa dipalsukan oleh program yang bukan BASIC:

| | SPACEWAR | HOPPER | PAC-GAL | 3DTTT |
|---|--:|--:|--:|--:|
| Entri relokasi | **5** | 786 | 1.361 | 2.357 |
| String galat runtime BASIC | **0** | 22 | 22 | 22 |
| Ukuran berkas | **22.528** | 37.760 | 39.296 | 57.472 |

Runtime BASIC menyeret 20–30 KB kode pustaka dan ribuan rujukan antar-segmen yang
harus ditambal saat pemuatan. Lima relokasi berarti hampir tidak ada rujukan
semacam itu — ciri program **satu segmen yang ditulis tangan**.

Akibatnya untuk porting sangat langsung: **tidak ada titik berangkat.** Ketiga port
lain bermula dari rekompilasi `.bas` yang benar-benar bisa di-`RUN`, dan
perilakunya bisa dibaca baris demi baris. Yang ini tidak punya apa-apa semacam itu.
Itu penyimpangan terbesar di seluruh koleksi ini, dan perlu dinyatakan
terang-terangan alih-alih disamarkan.

---

## 2 · Tapi binernya membawa aturan mainnya sendiri — dalam kalimat

Inilah yang mengubah seluruh perhitungan. Di offset `0x3BD5` ada layar
`GAME INSTRUCTIONS`, enam belas baris ASCII biasa:

```
WEAPONS:PHOTON TORPEDOS - Use = 1 unit, Damage = 4 units.
        PHASERS         - Use = 1 unit, Damage = 2 units.
DEFENSE:IMPULSE ENGINES - Use = 1 unit every 1/2 second.
        CLOAK           - Use = 1 unit every 1/2 second.
        HYPER SPACE     - Use = 8 units.
COMMENT:You must have energy to use WEAPONS or DEFENCES.
        ENERGY is recharged at 1 unit every 2 seconds.
        Use PHASERS to shoot incoming PHOTON TORPEDOS.
        Touching the PLANET will drain your SHIELDS.
        The Left Robot player is defensive.
        The Right Robot player is offensive.
```

Bandingkan dengan apa yang biasanya bisa dipulihkan dari sebuah biner. Dari
`HOPPER` yang keluar **tabel kecepatan sebelas jalur** — sebelas angka, dan
artinya masih harus disimpulkan. Dari sini yang keluar **kalimat lengkap dengan
satuannya**.

Jadi setiap konstanta di `spacewar.js` yang bertanda `// BINER <offset>` bukan
hasil menyetel sampai terasa enak. Ia angka yang program 1985 itu sendiri cetak ke
layar, dipanen `harvest-spacewar.py` lengkap dengan offsetnya, dimuat lewat
`spacewar-data.js`, dan **tidak diketik ulang** di berkas permainan.

Begitu juga peta tombolnya. Layar `GAME KEYS` di `0x37AE` memberi sembilan tombol
per pemain:

| | kiri | kanan | |
|---|---|---|---|
| `FIRE PHASERS` | <kbd>Q</kbd> | <kbd>7</kbd> | |
| `CLOAK` | <kbd>W</kbd> | <kbd>8</kbd> | |
| `FIRE PHOTONS` | <kbd>E</kbd> | <kbd>9</kbd> | |
| `ROTATE CCW` | <kbd>A</kbd> | <kbd>4</kbd> | |
| `IMPULSE ENGINES` | <kbd>S</kbd> | <kbd>5</kbd> | |
| `ROTATE CW` | <kbd>D</kbd> | <kbd>6</kbd> | |
| `WEAPON ENERGY` | <kbd>Z</kbd> | <kbd>1</kbd> | |
| `HYPER SPACE` | <kbd>X</kbd> | <kbd>2</kbd> | |
| `SHIELD ENERGY` | <kbd>C</kbd> | <kbd>3</kbd> | |

Pemain kanan memakai **papan angka** — itu sebabnya barisnya 7-8-9 di atas dan
1-2-3 di bawah, bukan urut menaik.

> **Pelajaran.** Sebuah biner tidak cuma menyimpan kode; ia menyimpan segala yang
> pernah ditampilkan program itu ke manusia. Layar bantuan adalah **spesifikasi
> yang ikut terkompilasi** — dan untuk program yang kodenya terlalu sulit dibaca,
> teksnya kadang jalan masuk yang jauh lebih pendek daripada disassembly.

### Bagaimana pemetaannya dijaga tetap jujur

Peta tombol bisa saja diketik sembilan baris di `spacewar.js` dan selesai. Yang
dikerjakan berbeda: `harvest-spacewar.py` menyebut **offset** tiap tombol dan tiap
keterangannya, lalu memastikannya dengan `assert` — tombolnya harus satu karakter,
urutan kiri harus `QWEASDZXC`, urutan kanan `789456123`, dan **aksi pasangan
kiri-kanan harus sama persis**. Syarat terakhir itu yang membuktikan pemetaannya
tidak tergeser satu slot.

Di sisi web, `perintahDari()` menyambungkan aksi ke logika lewat **kata di dalam
teksnya** (`PHASER`, `CCW`, `HYPER`), bukan lewat urutan larik. Kalau tabel di
binernya suatu saat terbaca berbeda, yang berubah cuma tombolnya — bukan
sambungannya.

---

## 3 · Program yang tidak mempercayai satu pun lapisan di atasnya

| | |
|---|--:|
| Panggilan interupsi, **seluruh** program | 4 |
| — di antaranya `INT 10h` | 3 |
| Port `3DAh` (tunggu retrace) | tidak dipakai |
| Port `61h` (speaker) | 21 tempat |
| Cakupan region kode hasil dekompilasi | 99% |
| Subrutin teridentifikasi | 107 |

Empat interupsi untuk seluruh program. Ketiga `INT 10h` itu seluruh urusannya
dengan BIOS grafis: **ambil mode, pasang mode 6, pulihkan mode**. Sisanya tulis
langsung ke `B800`.

Papan ketik dibaca dari **port `60h` mentah**, melewati BIOS. Ini bukan gaya-gayaan
melainkan keharusan arsitektural: `INT 16h` mengembalikan *tombol yang ditekan*,
dan tidak bisa memberi tahu tombol mana yang sedang **ditahan**. Permainan dua
pemain di satu papan ketik — di mana dua orang menahan tombol putar bersamaan —
mustahil tanpa melewati BIOS.

Tiga hal lain yang layak dicatat:

- **Deteksi kartu grafis dengan menguji perilaku memori, bukan bertanya.** Ia
  menulis ke `B800:0000`, `:1000`, `:2000`, `:3000` — empat alamat berjarak 4 KB —
  lalu membacanya kembali. Kalau memorinya tidak berperilaku seperti VRAM 16 KB, ia
  pulihkan mode video, cetak `SORRY ! You need a 640 X 200 Color Graphics card to
  run SPACEWAR !`, dan keluar. (Kalimat berikutnya di berkas: *May the farce be
  with you.*)
- **Stack ditaruh di dalam tabel vektor interupsi**, di `0000:0166` — memakai slot
  vektor yang ia tahu tidak akan dipakai sebagai RAM.
- **Ia mematikan motor floppy sendiri** dan mematikan konfigurasi Hercules lewat
  port `3BFh`.

Tidak adanya port `3DAh` juga sebuah keputusan: ia menulis VRAM **tanpa menunggu
vertical blank**, menukar kemungkinan robek layar dengan kecepatan.

---

## 4 · Tabel sprite: dari "belum terpecahkan" ke terpecahkan

Tabel sprite-nya ada di offset citra **`0x1840`**, 16 entri berjarak tepat 128
bita. (Dokumen dekompilasinya menyebut `0x1860`; itu meleset 32 bita, dan
akibatnya dibahas di peringatan bawah.)

### Terpecahkan — dengan bertanya siapa yang membacanya

Enam percobaan membaca datanya langsung semuanya gagal (tabelnya di bawah). Yang
memecahkannya bukan percobaan ketujuh, melainkan satu pertanyaan yang tidak pernah
ditanyakan selama 18 iterasi dekompilasi: **rutin mana yang membaca daerah ini?**

`sub_4792`, offset citra 18322. Ia menjawab seluruh formatnya sekaligus:

```asm
and  ax, 0xf          ; indeks dipotong 0..15   -> 16 entri
shl  si, 7            ; indeks * 128            -> strid 128
add  si, 0x1840       ; basis tabel             -> 0x1840
mov  cx, 0x20         ; 32 putaran              -> 32 baris
lodsw / xchg al, ah   ; TIAP PASANGAN BITA DITUKAR
mov  es:[di], ax      ; ...dua kali             -> 4 bita/baris
add  di, 0x1ffe       ; bank mode 6 berselang-seling
```

Tiap entri **32 × 32 piksel**, dan **seluruh 128 bita terpakai** — bukan 64 seperti
yang tertulis di dokumen dekompilasinya. Didekode begitu, entri 4:

```
..........############..........
.......###............###.......
....########################....
...#........................#...
..############################..
.#............#......#........#.
##############........##########
#.............#......#.........#
#..............######..........#
################################
.#............................#.
..############################..
...#........................#...
....########################....
.......###............###.......
..........############..........
```

Sebuah **lingkaran** dengan satu tanda kecil yang berpindah tempat dari entri ke
entri: enam belas bingkai benda bundar yang berputar. Hampir pasti **PLANET** yang
disebut teks bantuannya sendiri.

Dekodernya disimpan sebagai
[`spritedec.py`](../../decompile/tools/spritedec.py), dengan tiap tetapan menunjuk
ke baris `sub_4792` yang jadi dasarnya.

> [!WARNING]
> **Dua salah baca mendahului ini, dan yang kedua sempat saya kirim sebagai
> temuan.** Sebabnya sepele dan diam: `spacewar.asm` memakai offset **citra**,
> sedangkan berkas `.EXE` punya **header 512 bita** di depannya; dan basisnya
> `0x1840`, bukan `0x1860` seperti yang tertulis di dokumen dekompilasinya.
>
> Membaca dengan kerangka yang salah tetap menghasilkan **pola yang rapi** — saya
> mengukurnya dengan tekun dan melaporkannya. Data biner apa pun yang dibaca dengan
> strid tetap akan selalu berpola, karena strid-nya sendiri yang menciptakannya.
> Riwayat lengkapnya di
> [`NEGATIVE-RESULTS.md`](../../decompile/NEGATIVE-RESULTS.md) §22.

Konsekuensinya untuk port ini: tabel itu **tidak berisi kapal sama sekali**, jadi
rotasi 16 langkah di sini adalah **pilihan rancangan**, bukan simpulan dari biner —
dipertahankan karena enak dimainkan.

### Lalu kapalnya ketemu, dengan cara yang sama

Basis-basis lain jatuh dalam satu langkah begitu penyalinnya dibaca. `sub_45CA`,
offset citra 17866, dipanggil dari 17990 (pemain kanan) dan 17999 (pemain kiri):

| tabel | basis | n | strid | ukuran |
|---|--:|--:|--:|---|
| **kapal pemain kiri** | `0x1340` | 16 | 32 | **16 × 16** |
| **kapal pemain kanan** | `0x1540` | 16 | 32 | **16 × 16** |
| kecil, sepasang (kedip) | `0x1740` / `0x17C0` | 8 | 16 | 16 × 8 |
| font angka | `0x22A0` | 12 | 16 | 16 × 8 |

Dua sifat `sub_45CA` yang menutup pertanyaan lama sekaligus:

* **XOR.** Menggambar dan menghapus dengan operasi yang sama — itu sebabnya ada
  bendera per-pemain di `0xcbc`/`0xccc` yang dibalik tiap kali digambar.
* **Digeser saat menggambar** (`and cl,7` lalu `shr ax,cl`, tiga bita keluaran per
  baris). Jadi **tidak pernah ada varian *pre-shifted*** di berkas ini. Dugaan itu
  batal dengan sendirinya, tanpa perlu diuji.

Keadaan pemain ikut terbaca: **X di `0xd5c`, Y di `0xd7c`, sudut di `0xe7c`**,
strid `0x10` antar-pemain.

Keenam belas sudut kedua kapal ditampilkan di panel halaman port-nya — piksel
aslinya, bukan gambar saya.

> **Dan ini bagian yang paling perlu dikatakan.** Sudut kapal dipetakan
> `add bl,8 | and bx,0xf0 | shl bx,1` — dibulatkan ke perenambelasan terdekat.
> **Jadi "16 sudut" memang benar sejak awal**, dan "koreksi" saya yang mencabutnya
> salah. Yang membuktikan klaim aslinya benar bukan data yang sama yang saya tatap
> berjam-jam, melainkan **empat instruksi di tempat lain sama sekali**.
>
> Klaim asli maupun bantahan saya sama-sama menebak dari bentuk data. Yang satu
> kebetulan benar. Menebak yang kebetulan benar dan menebak yang kebetulan salah
> punya nilai bukti yang sama: nol.

Keenam percobaan membaca datanya langsung, dicatat supaya tidak diulang — dan
perhatikan bahwa semuanya menyerang **datanya**, tidak satu pun menyerang
**pembacanya**:

| Percobaan | Hasil |
|---|---|
| Render datar 32 × 16 (4 bita/baris) | gagal |
| Render datar 16 × 32 (2 bita/baris) | gagal |
| Dua separuh dijalin sebagai baris genap/ganjil (interleave mode 6) | gagal |
| Pindai korelasi baris ke seluruh segmen data | gagal — yang tertangkap pola garis vertikal, bukan kapal |
| Uji apakah separuh kedua adalah **mask** separuh pertama | gagal — mask harus melingkupi gambarnya, tapi `A & ~B` bernilai 78–98 bit, jauh dari nol |
| Render 4 dan 8 bita/baris sesudah strid diukur | bentuknya simetris empat arah — **bukan kapal**, apa pun ia |

Yang **terlihat** dari percobaan jalin, dan ini temuan baru: 64 bita tiap entri
terbelah jadi dua separuh yang **nyaris sama tapi tidak persis**. Itu konsisten
dengan pasangan gambar-dan-mask, atau dengan dua varian ter-geser
(*pre-shifted*) — keduanya belum terbukti yang mana.

Hipotesis interleave layak dicoba karena mode 6 memang menyimpan baris genap di
`0x0000` dan ganjil di `0x2000`; sprite yang disalin apa adanya dari layar akan
tersimpan sebagai dua setengah-gambar. Ia gagal, dan kegagalannya informatif:
formatnya **bukan** salinan mentah dari layar.

> **Pelajaran.** Empat percobaan gagal yang dicatat lebih berguna daripada satu
> kalimat "formatnya belum dipecahkan". Yang pertama memberi tahu orang berikutnya
> ke mana **tidak perlu** pergi; yang kedua cuma memberi tahu bahwa ada masalah.

Maka bentuk kapal dan bintang di halaman ini **digambar sendiri**.
Presedennya `HOPPER`, dan alasannya sama persis: menyamarkan yang belum terpecahkan
sebagai kesetiaan cuma cara halus untuk tidak mengakuinya.

---

## 4b · Mesin teksnya, dan satu jebakan yang menipu 18 iterasi

Program ini membawa **fontnya sendiri** — dan harus begitu: di mode 6 tidak ada
mode teks sama sekali, jadi setiap huruf digambar sendiri.

`sub_46DD` menggambarnya: basis `0x22A0`, diindeks **ASCII 7 bit**
(`and bx, 0x7f`), 16 bita per glif, 8 baris, 16 piksel lebar, dan **maju 10
piksel** per huruf — jadi huruf-hurufnya saling menumpuk enam piksel. Kode di
bawah `0x20` dipakai sebagai glif bingkai kotak. Ia juga menangani `0x0D`
(kembali ke kolom awal), `0x0A` (turun 8), dan `0x1F` (spasi setengah).

Yang mencetak string, `sub_4732`, memakai trik yang sudah lama hilang:

```asm
pop  bp              ; ALAMAT KEMBALI diambil dari tumpukan
mov  bl, cs:[bp]     ; bita di sana = karakter berikutnya
inc  bp
push bp              ; dorong balik alamat yang sudah maju
```

Stringnya ditulis **di dalam aliran kode**, tepat sesudah `call`-nya, dan
rutinnya kembali ke titik sesudah penanda nol. Ada **37 situs panggilan**, dan
di situlah `V1.50`, `COPYRIGHT © 1985 B SEILER.`, `LEFT PLAYER KEYS` dan
kawan-kawan sebenarnya duduk.

Fontnya dipanen dan dipakai menulis judul di panel halaman port ini — huruf itu
milik programnya, bukan milik halaman ini.

### Jebakannya

Karena data dan kode berselang-seling di segmen yang sama, penelusur rekursif
membongkar tiap string sebagai instruksi:

| yang terbaca di disassembly | sebenarnya |
|---|---|
| `adc ax, 0x2020` berulang | spasi di `"   G A M E    K E Y S  "` |
| `sbb ax, 0x1d1d` berulang | glif bingkai `0x1D` berderet |
| lima "handler dispatch berukuran tepat 8 instruksi" | `db 0x0c ×7, 0x00` |

Baris terakhir itu yang paling mahal. Ia melahirkan hipotesis yang bertahan
sampai akhir dekompilasi — *"lima handler untuk lima aksi di teks bantuan"* —
karena 5 dan 5 cocok. Kelimanya sebenarnya menggambar **kotak bilah menu** di
X = 200, 290, 380, 470, 560, berjarak tepat 90 piksel di baris paling bawah.

Dan **angka cakupan kode 99% itu salah di kedua arah sekaligus**:

| | |
|---|--:|
| Segmen kode | 11.088 bita |
| String sebaris (37 buah) + data terakui | 2.971 = **26,8%** |
| Wilayah kode **sejati** | 8.117 bita |
| Dari wilayah sejati, tertutup instruksi | **100,0%** |

Ia melebihkan apa yang dihitung sebagai kode — seperempat segmennya bukan
instruksi — sekaligus **meremehkan** pemulihan instruksinya, yang ternyata **100%**.

Kerusakan terbesarnya justru bukan di angka itu, melainkan di **ukuran rutin**.
`sub_3582` tercatat "526 instruksi, terbesar dalam program"; 81% isinya string, dan
sisanya cuma ~203 bita instruksi — ia **penggambar layar `GAME KEYS`**. `sub_3999`
tercatat 488 instruksi; 97% isinya string, tersisa ~47 bita — ia mencetak blok
`GAME INSTRUCTIONS`. Dari sana lahir kesimpulan yang bertahan sampai akhir
dekompilasi: *"tiga rutin render besar memakan hampir sepertiga kode program"*.
Ketiganya bukan renderer, dan tidak besar.

Panen ini juga memulihkan bilah menunya utuh sebagai satu string — lengkap dengan
penanda **L** dan **R** yang membedakan kedua tombol `ROBOT`, sesuatu yang tidak
terlihat waktu string-stringnya dipanen terpisah:

```
 EXIT    PLAY    ROBOT L   ROBOT R   PLANET   GRAVITY   PAUSE
```

> **Pelajaran.** Dua kecocokan angka melahirkan dua hipotesis yang salah di berkas
> yang sama: "16 entri = 16 sudut kapal" (§4) dan "5 handler = 5 aksi" (di sini).
> Keduanya kebetulan, dan keduanya bertahan lama justru karena **terdengar masuk
> akal** — yang terdengar masuk akal jarang diperiksa.

---

## 4c · Bilah menunya, dan apa yang dikendalikannya

Teks menunya satu string sebaris, dicetak dari **X = 0, Y = 192**. Dengan langkah
maju 10 piksel per huruf (dan 5 piksel untuk ``), posisi tiap label bisa
dihitung — dan kelima kotak yang digambar `sub_4183`…`sub_41CB` jatuh **persis** di
lima label yang bisa di-*toggle*:

| kotak | X | label | bit keadaan | saklar di port ini |
|---|--:|---|---|---|
| 1 | 200 | `ROBOT L` | `[0x1076]` bit 0 | **Kiri robot** |
| 2 | 290 | `ROBOT R` | `[0x1076]` bit 1 | **Kanan robot** |
| 3 | 380 | `PLANET` | `[0x2040]` bit 0 | **Lubang hitam** |
| 4 | 470 | `GRAVITY` | `[0x2040]` bit 1 | **Gravitasi** |
| 5 | 560 | `PAUSE` | `[0x170]` bit 0 | tombol **Jeda** |

`EXIT` (X = 25) dan `PLAY` (X = 115) **tidak berkotak** — keduanya perintah, bukan
saklar. Itu sebabnya kotaknya lima, bukan tujuh.

Keempat saklar di halaman ini ternyata memetakan satu-lawan-satu ke saklar aslinya,
plus tombol Jeda untuk yang kelima. Itu **bukan kebetulan** — saklarnya memang
dirancang dari string menu yang dipanen. Yang baru di sini adalah **bit keadaan
mana yang dikendalikan masing-masing**, dan itulah yang memastikan pemetaannya.

### Dan ini yang memastikan tabel `0x1840` itu planet

`[0x2040]` bit 0 — bit yang dibalik kotak **`PLANET`** — adalah gerbang yang
memutuskan apakah benda bundar 32 × 32 digambar:

```asm
test byte [0x2040], 1     ; saklar PLANET
je   ...                  ; kalau padam, lewati
inc  byte [0x2041]        ; bingkai animasi berikutnya
mov  bx, 0x13f            ; X = 319
mov  dx, 0x63             ; Y = 99   -> TITIK TENGAH LAYAR
call sub_4792
```

Tiga hal berhimpit dan tidak ada bacaan lain yang muat: digambar **tepat di titik
tengah layar**, digerbangi **saklar berlabel `PLANET`**, dan **berputar** 16
bingkai. Jadi tabel `0x1840` adalah planetnya — bukan lagi dugaan.

Yang di halaman ini digambar sebagai lubang hitam, atas permintaan. Fisikanya
tetap sama, dan sekarang ada satu hal lagi yang cocok tanpa direncanakan:
saklarnya menyalakan dan memadamkan benda yang sama persis dengan yang dikendalikan
saklar `PLANET` di 1985.

---

## 5 · Sejauh mana programnya berhasil dijalankan

| | |
|---|--:|
| Mode video yang diminta | **6** — 640×200 |
| Bita framebuffer terisi | 5.616 / 16.384 |
| Piksel menyala sesudah didekode | **17.591** / 128.000 |
| Baris teks | **0** — semuanya grafis |

Layar yang tercapai **bukan permainannya**, melainkan halaman teks yang dirender di
mode grafis — kemungkinan layar judul atau halaman *user-supported*. Menyetirnya
masuk ke permainan butuh urutan tombol yang belum diketahui, karena pemetaan lima
handler aksinya (masing-masing **tepat 8 instruksi**, pola tabel dispatch yang
jelas) belum ditelusuri satu per satu.

Aturan yang disepakati **sebelum** pekerjaan ini dimulai berbunyi begini:

| Keadaan | Yang dikirim |
|---|---|
| Ada tangkapan berisi **dua kapal** | Port bermain penuh, bentuk kapal dari piksel hasil panen |
| Framebuffer bisa dipanen tapi **tidak pernah sampai ke kapal** | Halaman dokumentasi, dan ketiadaannya dihitung |
| Di antara keduanya | Halaman dokumentasi berikut tangkapannya |

Yang dikirim di sini **tidak persis salah satunya**, dan itu perlu dinyatakan
terang-terangan. Aturan itu disusun dengan satu asumsi: bahwa satu-satunya jalan ke
port yang bisa dimainkan adalah **memanen piksel kapalnya**. Asumsi itu ternyata
salah — ada jalan kedua yang tidak terpikirkan waktu itu, yaitu **memanen
aturannya**. Piksel kapal masih belum tercapai, jadi baris pertama tidak berlaku;
tapi menahan port yang bisa dimainkan atas dasar itu akan berarti menahannya karena
alasan yang sudah tidak berlaku lagi.

Maka yang dikirim: **port yang bisa dimainkan dengan aturan yang dikutip, bentuk
yang digambar sendiri, dan ketiadaan sprite yang tetap dihitung** — tabel percobaan
gagal di §4 itu justru isi panelnya, bukan yang disembunyikan.

---

## 6 · Piksel mode 6 tidak persegi

640×200 di layar 4:3 membuat tiap piksel **2,4 kali lebih tinggi daripada lebar**.

`PAC-GAL` dan `HOPPER` memakai `viewBox="0 0 320 200"` supaya koordinat dari kode
aslinya tetap berarti. Di sini alasan itu tidak ada — tidak ada `.bas`, jadi tidak
ada koordinat asli untuk dipertahankan. Yang tersisa cuma kerugiannya: pada
640×200, lingkaran jadi lonjong dan **sudut rotasi berhenti jadi sudut**. Untuk
permainan yang seluruhnya tentang menghadap ke arah yang benar, itu merusak justru
hal yang sedang ditiru.

Jadi dunianya **640×480**: bidang layar yang sama, dipetakan ke piksel persegi.

---

## 6b · Menggambar Gargantua, dan dua kali salah sebelum benar

Bentuknya diminta mengikuti Gargantua di *Interstellar* (2014). Yang membuatnya
dikenali bukan bola hitamnya — itu bagian yang paling mudah — melainkan tiga hal
yang harus ada sekaligus:

1. **Cakram akresi dilihat hampir dari tepi**, pipih dan memanjang mendatar.
2. **Cincin ter-lensa yang melengkung di atas dan di bawah bayangannya.** Ini
   cirinya. Ia bukan cincin kedua: ia *sisi jauh dari cakram yang sama*, yang
   cahayanya dibelokkan gravitasi sampai terlihat menekuk melewati atas dan bawah.
3. **Bayangan pekat dengan cincin foton tipis** yang memeluk tepinya.

Urutan menggambarnya tidak bebas, dan itu yang menghasilkan kedalaman: sisi jauh
dulu, lalu bayangannya menutupi yang di belakang, baru sisi dekat di atas
segalanya. Digambar sekaligus, ia tampak seperti cincin yang ditempel di depan
bola.

### Kesalahan pertama: tiga cacat yang cuma terlihat kalau diperbesar

Dari jarak main, versi pertama tampak baik-baik saja. Diperbesar, tiga hal salah:

| Cacat | Akibatnya |
|---|---|
| Garis paling panas melintas **di depan** bayangan | secara gambar itu berarti cahaya menembus lubang hitam |
| Lengkung ter-lensa terlalu jauh dan terlalu kabur | terbaca sebagai halo terpisah, bukan cahaya yang membelok mengitari tepinya |
| Cincin foton hilang | tepi bayangannya jadi datar, tak bertepi |

### Kesalahan kedua, dan yang lebih mendasar: semuanya bertepi tegas

Versi kedua menggambar cakramnya sebagai **elips** — bentuk bertepi tegas, dengan
gradien yang cuma berjalan mendatar. Hasilnya benar bentuknya, salah bendanya.

Cakram akresi bukan benda padat melainkan gas bercahaya, dan di seluruh gambar
Gargantua **hanya ada satu tepi tegas: siluet bayangannya**. Segala yang lain
meredup ke ketiadaan.

Perbaikannya: tiap bentuk bercahaya memakai **dua gradien sekaligus**.

| Lapisan | Isinya |
|---|---|
| `fill` — `linearGradient` mendatar | suhu, dan pancaran Doppler (sisi yang mendekat lebih terang) |
| `mask` — `radialGradient` | kerapatan, meredup ke **segala** arah |

Elipsnya lalu dibuat jauh lebih besar daripada cakram yang terlihat, supaya
cahayanya sudah habis sebelum tepi geometrinya tercapai — dengan begitu tidak ada
satu pun garis batas yang bisa terlihat.

Satu jebakan yang muncul dari cara itu: bidang paling panas di tengah cakram
sempat memakai topeng yang sama dengan cakramnya, dan karena ia jatuh persis di
daerah paling pekat topeng itu, ia keluar sebagai **pita bertepi tegas** — tepi
tegas terakhir yang tersisa. Ia butuh topengnya sendiri, yang tingginya sepadan
dengan pitanya.

### Kesalahan ketiga: setengah bawah bayangannya menyala

Dilaporkan pemilik proyek, dan benar. Sisi dekat cakramnya digambar sebagai
**setengah bidang** yang menutupi seluruh bagian bawah bayangan. Angkanya
menjelaskan kenapa: pudar bidang itu membentang 31 piksel sedangkan bayangannya
berjari-jari 17 — tidak ada sisa untuk hitam.

Yang salah bukan idenya melainkan **tebalnya**, dan di baliknya ada salah paham
soal bendanya lagi: cakramnya tipis, dan cahaya yang meluas itu **pendar** —
pendar tidak menghalangi apa-apa. Jadi pembagiannya bukan atas-bawah melainkan
menurut fungsi:

| Bagian | Ditaruh | Karena |
|---|---|---|
| Cakram yang meluas dan lembut | **di belakang** bayangan | ia pendar, tidak menghalangi |
| Satu pita sempit di bidang cakram | **di depan** bayangan | inilah gas rapat yang benar-benar menutupi |

Pitanya setinggi 3,6 piksel dan digeser sedikit ke bawah titik tengah, seperti
pandangan sedikit dari atas. Diukur ulang dari piksel hasil render: bayangannya
kini **hitam di atas pita, dan hitam lagi di bawahnya** — yang membuatnya terbaca
sebagai bola dan bukan sebagai bulan sabit.

### Kesalahan keempat: terlihat seperti dua cincin

Juga dilaporkan pemilik proyek — sebuah cincin besar tepat di tengah, dan sebuah
cincin kecil sedikit di bawahnya.

Sebabnya panjang pitanya. Pita sisi dekat dibuat **selebar cakram**, jadi di kiri
dan kanan lubang ia berjalan sejajar dengan cakram utama: dua garis mendatar
beriringan. Itu salah secara geometri, bukan cuma jelek. Sisi dekat dan sisi jauh
adalah **cakram yang sama**; di kedua ujungnya mereka menyatu jadi satu garis, dan
hanya terpisah di dekat pusat — tempat yang satu lewat di depan lubang dan yang
lain dibelokkan ke atasnya.

Perbaikannya persis usul yang datang bersama laporannya: **pendekkan pitanya
sampai sebatas bagian hitamnya saja**. Panjangnya kini 2,4 × jari-jari bayangan,
lalu memudar habis — jadi di luar lubang yang terlihat cuma satu cakram.

> **Pelajaran.** Empat kali salah pada satu gambar, dan tidak satu pun terlihat
> dari membaca kode. Yang keempat ini juga mengajarkan hal lain: laporan yang
> menyertakan **usul perbaikan** ("dibuat lebih pendek, hanya menutupi bagian
> hitamnya") lebih berharga daripada laporan yang cuma menyebut ada yang salah —
> usul itulah yang menunjuk langsung ke geometrinya. Kesalahan pertama soal **penempatan** dan
> Kesalahan pertama soal **penempatan** dan ketahuan cepat; yang kedua dan ketiga
> soal **apa benda itu sebenarnya** — gas yang tipis dan berpendar, bukan pelat;
> yang keempat soal **bagian mana yang boleh terlihat di mana**. Ketiga yang
> terakhir sama-sama jenis kesalahan yang bertahan lama, karena hasilnya
> "kelihatan benar" sampai ada yang membandingkannya dengan aslinya.

### Catatan alat: ketika tangkapan layar mati

Di tengah perbaikan ketiga, tangkapan layar lewat ekstensi berhenti berfungsi
sama sekali. Dugaan pertama: filter blur di gambar inilah yang membuat
kompositornya tercekik. Filternya dibuang, dan tangkapan layarnya **tetap gagal** —
lalu halaman Hopper, yang tidak punya filter apa pun, ternyata gagal juga.
Macetnya di alat uji, bukan di gambar.

Gambarnya tetap harus dilihat, jadi jalurnya diganti: SVG-nya dirender sendiri ke
`<canvas>`, pikselnya dibaca, lalu dipetakan jadi **peta kecerahan ASCII**. Yang
dinilai tetap piksel hasil render sungguhan — hanya salurannya yang berbeda. Peta
itu juga yang membuktikan perbaikan ketiga berhasil, baris demi baris.

Pembuangan filternya tetap dipertahankan: alasan kinerjanya berdiri sendiri.
Yang dicabut alasan yang keliru, bukan keputusannya.

### Kapal yang tersedot

Di dalam radius 21 piksel tidak ada lagi jalan keluar: kapalnya ditangkap, dan
animasinya mengambil alih selama 1,9 detik. Ia **mengecil sambil terpilin masuk,
meregang ke arah lubangnya, memerah, lalu habis**.

Peregangannya yang membuatnya terbaca sebagai *tersedot* dan bukan sekadar
mengecil — dan ia harus dikerjakan di **kerangka radial**: diputar dulu supaya
sumbu-x menunjuk ke lubang, diregangkan di sana, baru diputar balik ke arah hadap
kapalnya. Diregangkan di kerangka kapalnya sendiri, arah regangannya ikut berputar
bersama kapal, dan yang terlihat kapal yang melar acak.

Dua keputusan kecil yang menentukan:

- **Radius tangkapnya 21, sedikit di luar bayangan yang tergambar (17).** Kalau
  penangkapannya terjadi di dalam bayangan, yang tampak cuma kapal yang hilang
  begitu saja — animasinya tidak pernah terlihat.
- **Arah pilinannya mengikuti arah gerak kapal saat tertangkap**, dihitung dari
  hasil silang posisi dan kecepatannya. Dipilih tetap, kapal yang masuk dari kiri
  dan dari kanan akan berpilin ke arah yang sama, dan itu langsung terbaca sebagai
  animasi kaleng.

Kapal yang tersedot **tidak meledak**. Ledakan berarti "hancur di tempat", dan yang
barusan terjadi justru sebaliknya: ia hilang ke dalam sesuatu. Spanduk
kemenangannya pun berbunyi lain — *"Lawan tersedot ke dalam lubang hitam"*, bukan
*"Shield lawan habis"*.

---

## 6c · Menggambar kapalnya

Versi pertama dua segitiga datar. Diganti atas permintaan, dan empat aturan yang
menentukan rancangannya — semuanya soal keterbacaan, bukan selera:

1. **Arah hadap harus terbaca seketika.** Itu satu-satunya informasi yang dipakai
   pemain tiap detik. Karena itu tiap kapal punya hidung panjang yang jelas dan
   buritan yang jelas — bukan bentuk yang nyaris simetris.
2. **Dibedakan siluet lebih dulu, warna kemudian.** Kalau warnanya dilucuti, yang
   kiri tetap harus terbaca sebagai pencegat bersayap sapuan dan yang kanan
   sebagai kapal berat berpolong samping.
3. **Lima bagian per kapal, tidak lebih:** siluet gelap, pelat atas lebih terang,
   kanopi, aksen warna regu, nosel. Di layar kapalnya sekitar 30 piksel; bagian
   keenam tidak akan terlihat, ia cuma menambah ongkos gambar.
4. **Lambung gelap dengan garis tepi terang, bukan sebaliknya.** Di atas ruang
   hitam, bentuk terang penuh berubah jadi bercak — yang membuat bentuknya
   terbaca adalah tepinya. Tebalnya 0,9: lebih tipis hilang, lebih tebal memakan
   bentuk yang dikelilinginya.

Satu koreksi yang cuma ketahuan setelah diperbesar: nosel mesinnya semula sepasang
**lingkaran terang** di buritan, dan sepasang lingkaran terang terbaca sebagai
**mata** — begitu terbaca sebagai mata, seluruh kapalnya berubah jadi wajah.
Diganti rumah gelap bersudut dengan celah tipis di dalamnya.

Semburan impulsnya punya satu definisi **per kapal**, bukan satu bentuk yang
dipakai bersama, karena letak mesinnya berbeda. Nyala yang keluar dari tempat yang
bukan mesin adalah kesalahan kecil yang justru merusak kesan bahwa kapalnya benda
yang dirancang.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Papan ketik | port `60h` mentah, bit *break* dibuang dengan `and di, 0x7f` | `INT 16h` tidak bisa melaporkan tombol yang sedang **ditahan** | `keydown`/`keyup` menjaga set tombol tertahan — masalah yang sama, jawaban yang sudah disediakan platform |
| Aturan main | teks di `0x3BD5`, dicetak ke layar bantuan | satu-satunya tempat menaruh dokumentasi | **Dikutip apa adanya** dan dipakai sebagai konstanta permainan; ditampilkan utuh di panel, bukan diringkas |
| Peta tombol | teks di `0x37AE` | idem | Dipanen berikut offset, dijaga `assert`, disambung ke logika lewat **kata** bukan urutan |
| Sprite kapal | tabel 16 entri, 128 bita stride | rotasi harus pra-hitung; 8086 tidak sanggup memutar bitmap tiap bingkai | **Digambar ulang** sebagai vektor. 16 langkah rotasinya dipertahankan — itu satu-satunya hal tentang sprite yang benar-benar diketahui |
| Layar | CGA mode 6, 640×200, 1 bit | mode monokrom paling tajam yang ada | SVG 640×480 — bidang yang sama, piksel persegi. Lihat §6 |
| Benda di tengah | disebut `PLANET` di teks bantuannya | — | **Digambar sebagai lubang hitam** bergaya Gargantua, atas permintaan. Pilihan, bukan temuan — dan fisikanya tidak ikut berubah. Lihat §6b |
| Mati karena benda di tengah | `PLANET` menguras `SHIELDS` sampai habis | — | Pengurasannya **tetap**, persis seperti kalimatnya. Yang ditambahkan: di dalam radius tangkap, kapalnya tersedot dengan animasi 1,9 detik alih-alih meledak. Tambahan, bukan pengganti |
| Warna | tidak ada; menyala atau tidak | perangkat keras 1 bit | Enam warna, **dan tidak mengaku meniru apa pun**. Dua kapal dibedakan **bentuk** lebih dulu, warna kemudian — karena bentuk yang harus terbaca kalau warnanya dilucuti |
| Robot | dua watak, kiri bertahan kanan menyerang | — | **Dipertahankan** — dua kalimat itu ada di binernya, jadi wataknya bukan karangan |
| Sinkronisasi layar | tidak ada; tulis VRAM kapan saja | menunggu retrace berarti membuang waktu | `requestAnimationFrame` dengan langkah tetap 1/60 — lihat [`_fondasi.md`](_fondasi.md) |
| Suara | port `61h` langsung, 21 tempat berbeda | tidak ada mixer; speaker satu bit | `audio.js`, dipicu di tempat kejadian yang sama |

---

## 8 · Apa yang masih rekonstruksi

Batasnya perlu terlihat, jadi ia ditulis dua kali: sekali di panel halaman, sekali
di sini.

**Pasti — dikutip dari teks biner:** ongkos dan kerusakan foton (1 / 4) dan faser
(1 / 2), impuls dan cloak 1 unit tiap ½ detik, hyperspace 8 unit, isi ulang 1 unit
tiap 2 detik, faser bisa menembak foton yang datang, benda di tengah menguras shield, bunyi
peringatan saat shield rendah, watak kedua robot, seluruh nama tombol.

**Simpulan — bukan kutipan:**

- **16 langkah rotasi — pasti**, dan buktinya bukan yang saya kira dua kali
  sebelumnya. Bukan "16 entri berjarak sama" (itu tabel lain, isinya lingkaran),
  melainkan kode pemetaan sudutnya sendiri:
  `add bl,8 | and bx,0xf0 | shl bx,1`, membulatkan ke perenambelasan terdekat.
  Lihat §4.
- **Arti `WEAPON ENERGY` dan `SHIELD ENERGY`.** Namanya pasti; perilakunya tidak.
  Teksnya cuma bilang *"You must have energy to use WEAPONS or DEFENCES"*. Bacaan
  yang dipakai: keduanya mengalihkan satu unit dari cadangan `ENERGY` ke salah satu
  dari dua bank. Itu bacaan yang memberi kesembilan tombolnya pekerjaan — tapi ia
  tetap bacaan, dan kalau suatu saat disassembly-nya terbaca, ia bisa saja salah.

**Rekonstruksi penuh:** kapasitas shield (24 = tepat enam foton), kapasitas dan
nilai awal energi, percepatan impuls, laju maksimum, kecepatan dan umur torpedo,
kekuatan gravitasi, radius benda di tengah, layar yang membungkus di tepi.

**Pilihan, bukan temuan:** benda di tengah digambar sebagai **lubang hitam** bergaya
Gargantua (*Interstellar*, 2014), atas permintaan pemilik proyek. Binernya menyebutnya
`PLANET` dan kalimatnya tetap dikutip apa adanya di panel; yang berubah cuma rupanya,
dan fisikanya sama sekali tidak. Ia dicatat di baris tabel kepastiannya sendiri karena
"digambar sendiri karena sumbernya belum terpecahkan" dan "digambar lain karena
diminta begitu" adalah dua hal yang berbeda, dan menyatukannya akan mengaburkan
keduanya.

---

## 9 · Latihan

1. **Pastikan tabel `0x1840` itu apa.** Formatnya terpecahkan (32 × 32, 16 entri)
   dan isinya lingkaran berputar, tapi *perannya* belum dipastikan — planet, atau
   ledakan, atau perisai. Caranya sama: cari pemanggil `sub_4792` dan lihat dari
   keadaan mana indeksnya datang. Basis `0x12c0` juga masih belum ditelusuri.
2. **Cari urutan tombol menuju permainan.** Lima handler aksi masing-masing tepat 8
   instruksi (`sub_4183`, `sub_4195`, `sub_41A7`, `sub_41B9`, `sub_41CB`). Bacalah
   tabel dispatch di `sub_404A` (175 instruksi) dan tentukan kode scan mana yang
   memilih `PLAY`.
3. **Uji klaim deteksi kartu grafisnya.** Jalankan `SPACEWAR.EXE` di DOSBox-X dengan
   `machine=hercules`, lalu dengan `machine=cga`. Apakah pesan `SORRY !` muncul
   persis pada yang pertama?
4. **Bandingkan dua jalan pemulihan.** Untuk `HOPPER` yang keluar sebelas angka
   yang artinya harus disimpulkan; untuk `SPACEWAR` yang keluar kalimat lengkap
   dengan satuan. Program seperti apa yang menaruh spesifikasinya sendiri di dalam
   binernya, dan apa yang membuat kebiasaan itu hilang?
5. **Periksa `BS.SCO`.** 128 bita, seluruh skornya nol, diakhiri `0x1A`. Ia memakai
   format angka bergaya `PRINT` BASIC — padahal SPACEWAR assembly murni. Entah ia
   meniru format itu dengan sengaja, entah berkasnya pernah ditulis program lain.
   Belum ditelusuri.

---
Berkas terkait: [pakai](../games/spacewar/index.html) ·
[fondasi](_fondasi.md) ·
[HOPPER — preseden menggambar ulang](hopper.md) ·
[PAC-GAL — port pertama dari EXE](pacgal.md) ·
[3DTTT](3dttt.md) ·
[SPACE — teknik XOR GET/PUT](space.md)
