# Peta entry point runtime 3DTTT

Iterasi loop #7, 2026-08-06. Cakupan penamaan naik dari 11/87 ke **16 entry point yang
menutup 62% panggilan** di kode game.

## Yang teridentifikasi

| RT# | offset | panggilan | nama | bukti |
|---|---|---|---|---|
| 1 | 29388 | 426 | `LET!` | `movsw ×2; sub di,4; sub si,4` — salin single 4 byte |
| 2 | 33189 | 297 | `LOAD!` | bingkai error `[604]`, muat 4 byte dari `[si]` |
| 3 | 32908 | 233 | `ARITH!` | dua operan 4 byte, uji tanda `or bh,bh`/`or ah,ah`, `xor bl,al` |
| 4 | 36709 | 111 | `PRINT_BEGIN` | menolkan `[82C]`,`[616]`,`[82D]` lalu `retf` |
| 5 | 36435 | 98 | `PRINT $;` | stub `03 01` |
| 6 | 32958 | 96 | **`GOSUB`** | uji batas stack `cmp sp,[5f0]` + word inline + `inc [61a]` |
| 7 | 29385 | 95 | `FACSTORE!` | `mov si,0xB4` (FAC) → `movsw ×2` |
| 8 | 29219 | 77 | `LOCATE` | akumulator argumen, **selalu tepat 2 argumen** |
| 9 | 29245 | 77 | `LOCATE` | pasangan, plus bingkai error |
| 10 | 31638 | 75 | `MULDIV!` | bongkar mantissa MBF **dua** operan (`or bh,0x80`) |
| 11 | 36455 | 67 | `PRINT $` ganti baris | stub `03 02` |
| 12 | 28098 | 58 | `COLOR` | akumulator argumen, **1–3 argumen** |
| 13 | 28124 | 57 | `COLOR` | pasangan, plus bingkai error |
| 14 | 33508 | 39 | `CHR$` | alokasi string 1 byte (`mov bx,1; call 0x931E`) |
| 15 | 29411 | 38 | `FACLOAD!` | `mov di,0xB4` (FAC) ← `movsw ×2` |
| 18 | 29176 | 30 | `STRCMP` | dua deskriptor string, ambil panjang minimum |

FAC 3DTTT ada di `DGROUP+0xB4` (HOPPER: `0xB2`).

## COLOR vs LOCATE — teka-teki iterasi #4–#5 selesai

Dua akumulator argumen yang bentuknya identik (`mov cl,bl` lalu masuk `0x6A6B`) ternyata
**dua pernyataan berbeda**, dan yang membedakan adalah **jumlah argumennya**:

```
COLOR  (RT#12/13):  1 arg × 2 pernyataan
                    2 arg × 52 pernyataan
                    3 arg × 3 pernyataan     ← batas 3 tercapai
LOCATE (RT#8/9):    2 arg × 77 pernyataan    ← SELALU tepat 2
```

`COLOR depan, belakang[, batas]` menerima sampai 3 argumen dengan yang ketiga opsional.
`LOCATE baris, kolom` tepat 2. Distribusinya cocok persis.

Nilai yang keluar mengonfirmasi:

```
   493  LOCATE 22 : LOCATE 2      → LOCATE 22, 2
   532  LOCATE 22 : LOCATE 5      → LOCATE 22, 5
  4384  COLOR 15 : COLOR 0        → COLOR 15, 0   (putih terang di hitam)
```

Baris 22 kolom 2 dan 5 adalah koordinat layar 80×25 yang sah. `COLOR 15,0` nilai baku.

**Keberatan iterasi #4 terjawab.** Waktu itu saya menolak hipotesis `COLOR` dengan alasan
"kalau semua `PRINT` memakai `;` tanpa ganti baris, harus ada yang memindahkan kursor —
dan `COLOR` tidak memindahkan kursor". Yang memindahkan kursor ternyata `LOCATE`, yaitu
akumulator **kedua** yang waktu itu belum saya kenali.

**Batas 4-argumen mode grafis** dari iterasi #5 juga terjelaskan: 3DTTT program mode teks,
jadi jalur `ch=4` tidak pernah dieksekusi. Batasan "3 di teks, 4 di grafis" yang membuat
saya buntu itu bukan tentang satu pernyataan — `ch` memang batas buffer, dan jumlah
argumen sebenarnya ditentukan pemanggil.

## Iterasi #8 — `GOSUB`/`RETURN` tertutup, lima nama baru

| RT# | offset | panggilan | nama | bukti |
|---|---|---|---|---|
| 20 | 32999 | 27 | **`RETURN`** | `dec word [0x61a]` + `js` → pasangan `inc` milik `GOSUB` |
| 21 | 33264 | 19 | `CINT` | muat FAC (`[0xB4]`/`[0xB6]`), nolkan `bx`, uji eksponen |
| 23 | 29851 | 16 | `SGNTEST` | uji eksponen `or ah,ah`, putar tanda ke carry |
| 24 | 31617 | 16 | `NEG!` | `mov ax,[di+2]; xor al,0x80` — balik bit tanda MBF |
| 27 | 31627 | 14 | varian aritmetika FAC | `mov si,0xB4` lalu masuk jalur bongkar MBF |

**`GOSUB?` tertutup.** `RT#6` menambah `[0x61a]`, `RT#20` menguranginya dan menjebak
nilai negatif dengan `js` — itu persis error *RETURN without GOSUB*. Pencacah kedalaman
bersama membuktikan pasangannya. Tanda tanya dicabut.

3DTTT sekarang **123 pernyataan `GOSUB`/`RETURN`** terbaca langsung.

## Cakupan

**773 panggilan ternama, 303 belum → 72%** (naik dari 62% di iterasi #7).

Sisanya tersebar tipis: `RT#16` dan `RT#17` (30 masing-masing) yang keduanya operasi
string, lalu ekor panjang di bawah 15 panggilan.

## Dua akumulator, bukan satu

Sampai iterasi #7 saya memperlakukan FAC sebagai satu region tunggal 4 byte. Rutin
perkalian presisi-ganda menunjukkan itu keliru: ada **dua** akumulator yang saling
tumpang tindih.

| biner | FAC tunggal (4 byte, MBF single) | FAC ganda (8 byte, MBF double) |
|---|---|---|
| HOPPER | `0xB2` – `0xB5` | `0xAE` – `0xB5` |
| PAC-GAL | `0x1A` – `0x1D` | `0x16` – `0x1D` |
| 3DTTT | `0xB4` – `0xB7` | `0xB0` – `0xB7` |

FAC tunggal menempati **paruh atas** FAC ganda. Cara membedakan rutin mana memakai
yang mana, tanpa perlu menebak:

- **operan presisi tunggal** dibaca di `[si]` dan `[di+2]` — byte eksponen ada di
  offset 2 dari basis 4-byte;
- **operan presisi ganda** dibaca di `[si+6]` dan `[di+6]` — offset 6 dari basis
  8-byte;
- geseran mantissa presisi tunggal memakai dua word (`shl dx` / `rcl bx`), presisi
  ganda memakai empat (`shl dx` / `rcl cx` / `rcl bx` / `rcl di`) = 64 bit.

Arah eksponen memisahkan operasinya, terlepas dari presisinya:

| operasi | eksponen | instruksi penentu |
|---|---|---|
| `ADD!` | — | tanpa `xor al,cl` |
| `SUB!` | — | `xor al,0x80` lalu masuk jalur `ADD!` |
| `MUL!` | `add ah, ch` (dijumlahkan) | tiga `mul` berurutan |
| `DIV!` | `sub ah, ch` (dikurangkan) | `div bx` |

Kedua operasi kali dan bagi sama-sama diawali `xor al, cl` yang menggabungkan tanda
kedua operan. Penjumlahan tidak pernah melakukannya — itu cara tercepat memisahkan
kelompok kali/bagi dari kelompok tambah/kurang sebelum membaca lebih jauh.

### Penanda presisi kedua: penjaga selisih eksponen

Rutin penjumlahan menyelaraskan kedua operan sebelum menjumlahkan, dan menolak
selisih eksponen yang melebihi lebar mantissanya:

| presisi | penjaga | lebar mantissa |
|---|---|---|
| tunggal | `cmp ah, 0x18` | 24 bit |
| ganda | `cmp ah, 0x38` | 56 bit |

Angka penjaga ini menentukan presisi sendirian, tanpa perlu melihat offset operan.

### Penanda presisi ketiga: jumlah `movsw` pada keluarga salin-FAC

| rutin | arah | instruksi | ukuran |
|---|---|---|---|
| `LOAD!` | memori -> FAC | `movsw` x2, `sub si,4` | 4 byte |
| `LOAD#` | memori -> FAC | `movsw` x4, `sub si,8` | 8 byte |
| `FACSTORE!` | FAC -> memori | `mov si,<FAC tunggal>`, `movsw` x2 | 4 byte |
| `FACSTORE#` | FAC -> memori | `mov si,<FAC ganda>`, `movsw` x4 | 8 byte |

Arah dibaca dari `movsw` itu sendiri (`ds:[si]` -> `es:[di]`): rutin yang menyetel
**`di`** ke alamat FAC adalah pemuat, yang menyetel **`si`** adalah penyimpan.
Penyimpan juga menyelamatkan `si`/`di` milik pemanggil ke sepasang slot data dan
memulihkannya sebelum kembali; pemuat tidak.

### Pembanding

`FCMP!` (PAC-GAL `@15731`) memakai `std` lalu `repe cmpsw` — perbandingan mundur
mulai dari word paling berarti — didahului `xor bl, al` untuk menggabungkan tanda
dan `rcl` untuk memindahkannya ke carry. Bentuk presisi-gandanya adalah entry
tetangga yang mengganti `mov cx, 2` dengan `add di, 6`, yaitu offset byte eksponen
pada operan 8-byte.

## Heap string

Ketiga biner memakai heap dengan bentuk yang sama: blok berantai, panjang di word
pertama, sentinel `0xFFFF` menandai ujung, dan bit 0 pada word panjang sebagai tanda
blok terpakai. Alokatornya first-fit dengan pemecahan blok; bila gagal ia memadatkan
lalu memindai ulang dari basis, menyerah setelah enam percobaan.

| biner | penunjuk pemindai | basis | puncak |
|---|---|---|---|
| HOPPER | `[0x7FA]` | `[0x624]` | `[0x626]` |
| 3DTTT | `[0x5F4]` | `[0x838]` | `[0x83A]` (kepala daftar-bebas) |

Rutin pelepas string sementara 3DTTT ada di `0x939E`. Mengenalinya penting karena
banyak rutin string **melompat** ke sana sebagai langkah terakhir — `CONCAT$` melakukan
`jmp 0x939E` tepat setelah `rep movsw`. Lompatan itu sempat saya salah baca sebagai
pencetakan, yang membuat `LEN` bernama `STROUT` selama beberapa iterasi
(lihat NEGATIVE-RESULTS sec. 16).

## Kode tipe

Nilai yang sama dipakai di tiga tempat berbeda, dan kecocokannya bisa dipakai sebagai
bukti mandiri:

| kode | tipe BASIC | ukuran |
|---|---|---|
| 2 | `%` bilangan bulat | 2 byte |
| 3 | `$` string | deskriptor |
| 4 | `!` presisi tunggal | 4 byte |
| 8 | `#` presisi ganda | 8 byte |

Tempatnya: byte `AL` pada deskriptor stub operan, byte tipe `[0x8B6]` yang disetel
keempat entry `READ`, dan lebar operan yang dipakai rutin aritmetika.

## Rutin berargumen sebaris

Enam rutin mengambil argumennya bukan dari register melainkan dari **aliran instruksi
pemanggil**, tepat sesudah `lcall` 5-byte. Polanya:

```
pop  si
pop  ds          ; ds:si = alamat kembali jauh
lodsb            ; ambil byte sebaris (atau lodsw / beberapa word)
...
push ds
push si          ; dorong balik alamat yang sudah maju melewati data
```

| biner | rutin | data sebaris |
|---|---|---|
| 3DTTT | `SCALE2!` @29924 | 1 byte, delta eksponen |
| 3DTTT | `ON_GOSUB` @33045 | 1 byte cacah + N word alamat |
| 3DTTT | `INPUT` @35846 | deskriptor prompt |
| PAC-GAL | `INPUT` @21265 | deskriptor prompt |
| HOPPER | `SCALE2!` @13566 | 1 byte, delta eksponen |
| HOPPER | `INPUT` @20759 | deskriptor prompt |

`SCALE2!` menambahkan byte sebarisnya ke byte eksponen FAC, yang pada MBF berarti
mengali dengan 2^N — cara compiler menghindari perkalian penuh untuk pengali pangkat
dua. Nilai yang terlihat: 0x01, 0x03, dan 0x04 (kali 2, 8, dan 16).

Mendeteksinya **harus** dari tubuh rutin. Uji dari situs panggilan tidak bekerja karena
byte nyasar menyatu jadi instruksi yang tetap masuk akal (NEGATIVE-RESULTS sec. 18).

## Grafis CGA (HOPPER)

Empat slot data memegang seluruh keadaan grafis, dan mengenalinya membuka sebagian
besar rutin gambarnya:

| slot | isi |
|---|---|
| `[0x60E]` / `[0x610]` | titik kini — hasil koordinat terakhir yang dievaluasi |
| `[0x612]` / `[0x614]` | titik awal garis |
| `[0x876]` / `[0x878]` | basis relatif `STEP`, nol untuk koordinat mutlak |
| `[0x87]` | mode layar; bit 0 memilih 320 atau 640 piksel |

Alurnya seragam. `GFXPT` @20155 menjumlahkan basis relatif ke operan, menyimpannya
sebagai titik kini, **menolkan kembali basis itu**, lalu mengapit hasilnya:

```
27164  mov  cx, bx
27166  add  cx, [0x876]      ; tambahkan basis STEP
27174  mov  [0x60E], cx      ; simpan sebagai titik kini
27184  mov  [0x876], ax      ; ax=0 -- kembalikan ke mode mutlak
...
24224  mov  bx, 0x280        ; 640
24231  shr  bx, 1            ; 320 bila mode lain
24239  mov  cx, bx           ; apit x
24245  cmp  dx, 0xC8         ; 200
24251  mov  dx, 0xC7         ; apit y
```

Entry @20140 melakukan kebalikannya — menyalin titik kini **ke dalam** basis relatif —
yang berarti itulah bentuk `STEP` dari statement yang sama.

Penggambar garis di 24994 memakai selisih mutlak yang dihitung 27193 dan 27204,
memilih satu dari empat penunjuk rutin langkah menurut tanda dan sumbu mana yang
lebih panjang, lalu menyimpannya di `[0x7E7]` — Bresenham dengan pemilihan oktan.

`GET` dan `PUT` berbagi satu rutin blit di `0x5F5A` dan hanya dibedakan oleh bendera
carry: `clc` untuk `GET`, `stc` untuk `PUT`. Arahnya juga terlihat dari header larik —
`GET` **menulis** lebar dan tinggi ke `[bx]` dan `[bx+2]`, `PUT` **membacanya**.

## Trio substring

`LEFT$`, `RIGHT$`, dan `MID$` adalah tiga entry ke satu pengekstrak bersama di
`0x8450` (3DTTT). Pengekstrak itu memakai **`cx` sebagai offset awal** dan **`dx`
sebagai cacah karakter**, lalu mengapit keduanya terhadap panjang di `[bx]`:

```
33872  or   dx, dx        ; cacah negatif -> galat
33876  je   -> string kosong
33879  cmp  dx, [bx]      ; apit cacah ke panjang
33885  or   cx, cx        ; apit awal ke >= 0
33891  call 0x93DE        ; alokasi dan salin
```

Ketiga entry hanya berbeda pada cara `cx` dihitung — dan justru itu yang
membedakan ketiga fungsi BASIC-nya:

| entry | penyetel offset awal | fungsi |
|---|---|---|
| @33685 | `xor cx, cx` | `LEFT$` — mulai dari nol |
| @33694 | `mov cx,[bx]` lalu `sub cx, dx` | `RIGHT$` — mulai dari panjang dikurangi cacah |
| @33708 | `dec dx` lalu apit awal **dan** cacah | `MID$` — dua argumen, awal 1-berbasis |

## Plot piksel CGA

| alamat | peran |
|---|---|
| `0x5E2B` = 24107 | hitung alamat byte dan masker bit; `y/2`, kali 80, `+0x2000` untuk bank ganjil, simpan di `[0x7ED]` |
| `0x5E0F` = 24079 | tulis piksel ke `0xB800` lewat baca-ubah-tulis: `xor` warna `[0x7E0]`, `and` masker `[0x7EB]`, `xor` balik |

`PSET` memanggil keduanya. Rutin yang berhenti setelah `0x5E2B` saja hanya menyiapkan
alamat tanpa menggambar — HOPPER `@20466` termasuk kelompok itu dan sengaja dibiarkan
tanpa nama, karena menebak antara `PRESET` dan penyiap titik ujung `LINE` tidak
dibenarkan bukti yang ada.

## Kursor: memisahkan `CSRLIN` dari `POS`

Dua slot berdampingan menyimpan posisi kursor, dan dua rutin mengembalikannya sebagai
bilangan — tetapi mana baris dan mana kolom tidak terbaca dari rutin pembacanya. Yang
menjawabnya adalah **penyetel** kursor, karena ia menyerahkan keduanya ke BIOS:

```
26933  mov  dx, [0x53]     ; DL = [0x53], DH = [0x54]
...
26955  xchg dl, dh         ; DH = [0x53], DL = [0x54]
26957  dec  dh
26959  dec  dl             ; 1-berbasis -> 0-berbasis
26961  mov  ah, 2          ; BIOS: set posisi kursor
```

BIOS fungsi 2 membaca `DH` sebagai baris dan `DL` sebagai kolom. Setelah `xchg`,
`[0x53]` mendarat di `DH` dan `[0x54]` di `DL`:

| slot | peran | pembaca |
|---|---|---|
| `[0x53]` | baris | `CSRLIN` @28912 |
| `[0x54]` | kolom | `POS` @29775 |

Pelajarannya berulang: peran sebuah slot data sering lebih mudah dibaca dari yang
**menulisnya** ketimbang dari yang membacanya, terutama bila penulisnya menyerahkan
nilai itu ke antarmuka dengan kontrak register yang sudah baku.

## `OPEN`: dua jalan ke slot mode yang sama

BASIC punya dua bentuk `OPEN`, dan runtime memberi masing-masing rutinnya sendiri —
tetapi keduanya bermuara ke slot mode berkas yang sama.

| bentuk BASIC | rutin | cara |
|---|---|---|
| `OPEN "I", #1, ...` | `OPEN_MODE$` | ambil karakter pertama, besarkan dengan `and bl,0xDF`, petakan `I`/`O`/`R`/`A` ke 1/2/4/8 |
| `OPEN ... FOR INPUT` | `OPEN_MODE` | ubah indeks numerik jadi bit tunggal dengan `mov bl,1; shl bl,cl` |

HOPPER memakai keduanya: `@16975` bentuk huruf, `@17031` bentuk indeks, dan keduanya
menulis ke `[0x6A4]`. Slot itu kemudian dibaca tepat sebelum layanan FCB DOS
(`int 21h ah=0x13` hapus, `ah=0x16` buat), yang mengunci arti keempat bitnya sebagai
`INPUT` / `OUTPUT` / `RANDOM` / `APPEND`.

Perhatikan bahwa bentuk huruf memanggil pelepas string sementara sesudah selesai —
tanda bahwa argumennya string, bukan angka.

## Empat bentuk masukan, dibedakan tanpa menebak

HOPPER memakai keempat bentuk masukan BASIC, dan masing-masing punya tanda
strukturalnya sendiri:

| bentuk | rutin | yang membedakannya |
|---|---|---|
| `INPUT` | @20759 | membawa deskriptor format **sebaris** di aliran instruksi |
| `LINE INPUT` | @19827 | memanggil pengambil yang sama tetapi **tanpa** deskriptor sebaris |
| `INPUT #n` | @20835 | memetakan nomor berkas, menolak mode 2, memasang vektor `[0x6B4]` |
| `INPUT$(n[,#f])` | @13841 | `xchg` penunjuk perangkat lalu alokasi string berpanjang tertentu |

Ketiadaan daftar format adalah tanda `LINE INPUT` yang paling jelas — `INPUT` harus
membawa daftar variabel dan pemisahnya, `LINE INPUT` tidak punya apa pun untuk dibawa.
Ini satu-satunya nama dalam proyek ini yang bertumpu pada **absennya** sesuatu, dan
itu sah hanya karena `tools/inline.py` sudah diuji menemukan kembali semua pembawa
data sebaris yang diketahui (NEGATIVE-RESULTS sec. 20).
