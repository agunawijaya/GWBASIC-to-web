# Dari terbaca menjadi BISA DIJALANKAN

Laporan sebelumnya menutup pekerjaan pada `.bas` yang **terbaca**. Dokumen ini menutup
jarak berikutnya: `.bas` yang benar-benar bisa di-`RUN`.

Perbedaan keduanya besar dan sempat tersamarkan oleh cara saya melaporkan angka.
"98% ternama" mengukur berapa situs panggilan runtime yang punya nama — pertanyaan
*"program ini memanggil apa saja?"*. Ia tidak mengukur apa pun tentang bisa-dijalankan.
Nama seperti `FACSTORE!`, `LOAD!`, `ADD!` semuanya benar dan semuanya berada **di bawah
level sumber BASIC**: keempatnya adalah pecahan mesin dari satu baris `A = B + C`.
Menamai keempatnya 100% tetap tidak menghasilkan satu pun baris BASIC.

Ukuran yang jujur untuk pertanyaan kedua, diukur sebelum pekerjaan ini dimulai:

| | pernyataan berbentuk BASIC | token tanpa padanan BASIC |
|---|---|---|
| HOPPER | 3,4% | 73,0% |
| 3DTTT | 32,6% | 60,3% |
| PAC-GAL | 83,7% | 5,0% |

## Hasil

| | baris .bas | panggilan tak tertangani | status jalan |
|---|---|---|---|
| [`pac-gal-run.bas`](PAC-GAL/pac-gal-run.bas) | 295 | **0** / 1322 | **bermain, tanpa galat** |
| [`3dttt-run.bas`](3DTTT/3dttt-run.bas) | 1.150 | **0** / 2322 | **bermain, tanpa galat** |
| [`hopper-run.bas`](HOPPER/hopper-run.bas) | 394 | **0** / 745 | **bermain sampai GAME OVER, tanpa galat** |

Setiap panggilan runtime di kode pengguna ketiga biner kini tertangani, dan byte
nyasar di kode pengguna tetap **nol**.

Wasit layar, membandingkan EXE asli dengan `.bas` pada masukan yang sama:

| | hasil |
|---|---|
| PAC-GAL | labirin **identik sel demi sel**, 24 dari 24 baris |
| 3DTTT | **18 dari 18** baris berisi — seluruh papan permainan |
| HOPPER | **5 dari 5** baris berisi (layar instruksi) |
| HOPPER grafis | **perbandingan piksel dua sisi**: warna identik, 96% peta baris sepakat, korelasi profil tinta 0,844 |
| Penggulung HOPPER | 232 byte dijalankan: menggeser jalur **+8 piksel mendatar**, tabel arahnya cocok |
| HOPPER.SCO | berkas skor 1991 dibaca, diurutkan, ditulis kembali — **identik byte demi byte** |

Diuji dengan PC-BASIC 2.0.8, bukan diperiksa sintaksnya saja. Dua alat menjaganya:
`tools/checkbas.py` memeriksa BENTUK berkas (nomor urut, panjang baris, target lompat,
posisi `REM`), `tools/smoke.py` memeriksa PERILAKU (galat runtime, layar terisi, dan
untuk PAC-GAL lebar tiap baris labirin).

`checkbas.py` juga menguji dua invarian KESETIAAN yang tak bergantung waktu, dan
keduanya lahir dari cacat nyata:

* **Pemisah PRINT.** Jumlah `PRINT` berakhir-baris-baru di `.bas` harus sama dengan
  jumlah stub pemisah "baris baru" di biner (2 / 76 / 26 — cocok persis). Inilah yang
  membuktikan gulungan layar PAC-GAL saat kehilangan nyawa adalah perilaku asli 1982,
  bukan cacat rekonstruksi.
* **Literal terpakai.** Setiap teks yang dirujuk kode pengguna harus ada di `.bas`.
  Pemeriksaan ini menemukan tiga pernyataan `PRINT USING` HOPPER yang hilang total.

**PAC-GAL** menggambar labirin lengkap — setiap baris tepat 79 kolom, dinding `█`,
koridor gambar-kotak, pelet `∙` (CHR$(249)) persis klaim
[`MAZE-TILES.md`](PAC-GAL/MAZE-TILES.md) yang sebelumnya tak pernah terlihat, kandang
hantu dengan gerbangnya, dan terowongan di kedua sisi. Pencacah `dots 468`, nyawa `☺☺☺`,
Pac-Gal beranimasi menyusuri koridor, keempat hantu `♥♦♣♠` keluar kandang lalu mengejar.
Kredit `Al J. Jiménez, May 1982` terbit lengkap dengan `é` CP437.

**3DTTT** menampilkan layar instruksi utuh — termasuk salah ketik aslinya, "hoirzontal" —
lalu menjalankan seluruh dialog penyiapan: `how many players?`, `would you like to move
first?`, `'X' or 'O'?`. Sesudahnya ia menggambar keempat papan 4×4 bersebelahan, baris
tombol fungsi, dan kotak status, menjalankan giliran komputer, dan menunggu di
`Please make your move:`.

**HOPPER** beralih ke CGA (`SCREEN 0` lalu `SCREEN 1, 0`), menyuntikkan penggulung
228 byte lewat gelung `READ`/`POKE`, dan **memainkan permainan sampai selesai**:
`INITIALIZING...`, layar instruksi ("Use the cursor keys on the numeric keypad to move
your frog"), lalu empat nyawa dengan pencacah waktu berjalan 80 → 2, `G A M E   O V E R`,
dan `WOULD YOU LIKE TO PLAY AGAIN (y/n)?`.

## Yang harus dipecahkan lebih dulu

Pipeline lama (`emit2.py`) mengintip tiga byte sebelum tiap `lcall`. Itu cukup untuk
merender, tidak cukup untuk merekonstruksi.

**1 · Deskriptor string yang sebenarnya.** Bentuk deskriptor BASCOM dipecahkan secara
empiris: **`(len:word, ptr:word)`, alamat runtime = offset berkas + 4**, 17 suara lawan 2
untuk derau. Deskriptor panjang-nol adalah `""` yang sah — itulah yang dipakai
`IF INKEY$ = "" THEN`.

**2 · Batas kode pengguna diturunkan, bukan disetel tangan.** Rutin runtime seluruhnya di
atas kode pengguna, jadi situs panggilan di bawah target terendah pasti milik pengguna.
Nilai lama meleset di dua biner: PAC-GAL **kelebihan 311 byte**, 3DTTT justru **memotong
314 byte kode pengguna**.

**3 · Argumen sebaris, dari tubuh rutin.** Pola `FACSTORE!` ada di *helper* yang
dipanggilnya (`@12831`), bukan di tubuhnya; `GOSUB` terlewat karena `pop si` dan `pop ds`
tidak bersebelahan. Byte nyasar di kode pengguna turun ke **1 / 2 / 0** byte.

**4 · Dua konvensi operan float.** PAC-GAL memberi operan lewat **indeks sebaris**
(`idx*8 + [0x60a]`); HOPPER dan 3DTTT lewat **alamat di si/di**. Alamat yang pernah
menjadi tujuan penyimpanan FAC adalah variabel; sisanya konstanta MBF — begitulah `5`,
`20`, `0.5`, `360`, `60` muncul. Pelacakannya harus mengikuti salinan register: HOPPER
menitipkan alamat tujuan lewat `mov bx, di` … `mov di, bx`, dan melacak immediate saja
membuat variabel itu terbaca sebagai konstanta raksasa yang `CINT`-nya meluap.

**5 · Satu nama, beberapa konvensi.** Tabel nama menyebut empat entry point berbeda
"ADD!". Pembedanya ada di dua instruksi pertama: `si=<FAC>` berarti FAC operan kiri,
`di=<FAC>` operan kanan, sisanya memakai si dan di dari pemanggil. Hal serupa pada
`STRING$` (kode karakter versus string) dan `LOAD!` — yang ternyata **bukan pemuat FAC**
melainkan konversi float→integer di `bx`, terbaca dari `adc bx,0` dan `neg bx`.

**6 · Nilai yang menyeberangi blok.** Register, bendera perbandingan, dan FAC semuanya
bisa hidup melewati batas pernyataan. Tiga analisis dipasang: liveness register dengan
materialisasi ke variabel bantu, propagasi konstanta maju, dan liveness FAC.

**7 · Variabel lokal di bingkai tumpukan.** Compiler menumpahkan alamat deskriptor
string ke `[bp-N]`. Tanpa dimodelkan, `mov bx, [bp-6]` terbaca nol dan ubin labirin
terbit sebagai `CHR$(0)` — tak terlihat di layar, sehingga baris labirin **memendek**,
dinding kanannya bergeser, dan hantu bisa melangkah keluar layar. Sembilan dari dua
puluh tiga baris labirin PAC-GAL cacat karena ini.

**8 · `PEEK`, `POKE`, `DEF SEG`.** `mov ds, [<pemegang segmen>]` lalu
`mov bl, byte ptr [bx]` adalah `PEEK`; kebalikannya `POKE`. Tanpa dimodelkan, bx tetap
berisi ALAMAT dan `CSNG(&H510)` terbit sebagai konstanta 1296.

**9 · `ON ... GOTO` yang menyamar jadi `ON ... GOSUB`.** `@33045` dan `@33044` adalah
entry TUMPANG-TINDIH ke tubuh yang sama, berbagi dua byte: `b8 32 e4` dibaca sebagai
`mov ax,0xE432` bila dimasuki di 33044, dan sebagai `xor ah,ah` bila dimasuki di 33045.
Di 33067 tubuhnya menguji `or ah,ah` / `je` yang MELEWATI `push dx` (alamat kembali)
sekaligus `inc [0x61a]` (pencacah kedalaman GOSUB). Jadi 33044 = `ON ... GOSUB`,
33045 = `ON ... GOTO` — dan seluruh situs 3DTTT memakai 33045.

Menerbitkannya sebagai GOSUB mendorong 64 alamat kembali per lintasan gelung papan,
lalu `RETURN` mengambil yang salah dan penghitung gelung terbaca basi. Itulah asal
indeks 217 pada larik berjangkauan 0–124 yang sempat saya kira cacat tak terpecahkan.

## Koreksi

**Dugaan saya tentang `SCREEN` keliru.** Saya sempat menduga galat PAC-GAL berasal dari
sentinel `cx=0x7FFF` yang membuat `SCREEN` BASCOM lebih permisif daripada GW-BASIC.
Membaca tubuh `@21120` sampai jalur galatnya (`jmp 0x3678`) menunjukkan runtime aslinya
melempar galat yang sama. Penyebab sebenarnya ada di dua tempat lain: baris labirin yang
memendek (§7 di atas), dan **`LOCATE` dengan argumen nol**.

Argumen `LOCATE` tidak dieksekusi di situs panggilan: tiap panggilan hanya menumpuk satu
byte ke penyangga (`@19444`), dan validatornya hanya menolak byte tinggi bukan nol.
Nilai 0 lolos — dan dalam BASIC itu berarti argumen **dihilangkan** (`LOCATE , 5`
mempertahankan barisnya). PAC-GAL memang menghapus hantu slot 1 yang tak pernah
ditempatkan, jadi barisnya nol. Argumen konstan diterbitkan apa adanya; yang dihitung
saat jalan dibungkus penjaga agar nol berperilaku seperti "dihilangkan".

Dua nama di tabel lama juga terbukti keliru, keduanya menyebabkan galat runtime nyata:

| lama | sebenarnya | bukti |
|---|---|---|
| `@20299 LOCATE` (PAC-GAL) | **`COLOR` argumen pertama** | validatornya `@20500` (ch=3/4) keluarga COLOR; LOCATE memakai `@13039` (ch=5). `LOCATE 26` yang mustahil ternyata `COLOR 15, 0` |
| `@33045 ON_GOSUB` (3DTTT) | **`ON ... GOTO`** | `xor ah,ah` di entry membuat `or ah,ah`/`je` di 33067 melewati `push dx` dan `inc [0x61a]`; entry tumpang-tindih 33044 yang menyetel ah≠0 barulah bentuk GOSUB-nya |
| `LOAD!` (ketiganya) | **konversi float→integer** | tubuhnya mendenormalisasi mantissa ke `bx`, bukan `movsw` ke FAC |

Enam nama baru lahir dari pekerjaan ini — `RND`, `RANDOMIZE`, `SOUND`, `STRTEMP`,
`INPUT_ITEM`, `INPUT_DONE` — dan `STRING$` dipecah menjadi `STRING$_C`/`STRING$_S`.
Kesebelasnya tercatat di `name-evidence.json` dengan dua jenis bukti, nol turun ke
`__maybe`.

## Jebakan yang layak dicatat

`REM` mengomentari **sisa baris** di BASIC. Menyisipkan catatan `REM ?? <rutin>` di
tengah daftar pernyataan menelan semua yang mengikutinya — dan itu membekukan gelung
penyiapan tombol HOPPER selamanya. Catatannya kini ditempel di ujung baris.

Presedensi GW-BASIC menempatkan operator relasional **lebih erat** daripada `AND`, jadi
`A AND B = 0` terbaca `A AND (B = 0)`. Idiom `and bx,bx` pada pola `SGN` di AI pengejar
PAC-GAL jadi salah arti tanpa kurung.

`THEN` dan `ELSE` juga menyerap sisa baris — cacat sekelas `REM`, dan lebih berbahaya
karena tak terlihat. Penjaga `LOCATE` berbentuk `IF ... THEN LOCATE ... ELSE ...`
membuat penambah gelung `FOR` di baris yang sama tak pernah dieksekusi. Gantinya bentuk
bebas cabang: `L1% = L1% + (L1% <= 0) * (L1% - CSRLIN)` — `(L1% <= 0)` bernilai -1 atau
0, jadi hasilnya CSRLIN bila nol dan tak berubah bila positif. `checkbas.py` sekarang
menolak `THEN`/`ELSE` yang bukan pernyataan terakhir.

`--output` milik PC-BASIC hanya merekam teks yang tergulir keluar; program ini menulis
lewat `LOCATE` ke posisi tetap sehingga berkas keluarannya selalu tampak kosong. Itu
sempat terbaca keliru sebagai "program berhenti sesudah INPUT". `runbas.py` membaca isi
layar lewat API Python-nya. `max_memory` PC-BASIC juga tak boleh melebihi 65535 — di
atas itu sesinya rusak diam-diam.

## Memuat 3DTTT ke ruang 64 KB

3DTTT semula butuh 8.034 byte lebih banyak daripada yang disediakan GW-BASIC. Empat
perubahan menutupnya, semuanya sah:

| perubahan | hemat |
|---|---|
| ukuran `DIM` dihitung per larik dari ekspresi indeksnya | ~14 KB |
| blok yang hanya bisa dimasuki lewat jatuh-melalui digabung (1.869 → 1.175 baris; GW-BASIC memakai 5 byte overhead per baris) | ~3,5 KB |
| penugasan variabel bantu yang mati dibuang, dianalisis pada TEKS yang terbit, bukan pada model mesin | ~6,5 KB |
| rantai geser digabung (`x * 2 * 2 * 2` → `x * 8`) | ~1 KB |

Yang ketiga penting sebagai pelajaran: liveness di dalam rekompiler bekerja pada model
MESIN dan menandai `bx` hidup karena rutin runtime membacanya, tetapi keluaran BASIC
belum tentu ikut membacanya. Akibatnya `X2%` ditugasi 355 kali dan dibaca 63 kali, dan
`X6%` ditugasi 25 kali tanpa pernah dibaca sekali pun.

## Membuka HOPPER

Empat hal, dan tak satu pun ternyata plafon:

**`SCREEN` yang hilang.** Rekonstruksi HOPPER tak pernah menerbitkan `SCREEN`, jadi
seluruh grafiknya digambar di mode teks. Sebabnya dua rutin salah nama. Keluarga
`LOCATE`, `COLOR`, dan `SCREEN` punya prolog identik, tetapi validator argumennya
berbeda dan itu sidik jarinya: `ch=5` LOCATE, `ch=4` SCREEN, `ch=3`+`ch=4` COLOR.
`tools/stmtfamily.py` mengaudit ketiga biner dengan uji itu dan menemukan tiga
kekeliruan, semuanya di HOPPER. Sesudah dikoreksi, `SCREEN 0 : SCREEN 1, 0` terbit —
mode CGA yang membuat `DRAW` dan `PSET` sah.

**`DATA` yang tak terbaca.** Rutin `READ` (@19947) menelusuri teks lewat penunjuk
[0x6ac] dan memisah pada koma, jadi `DATA` disimpan sebagai TEKS berkoma di DGROUP dan
bisa diambil langsung. Lima blok, 232 nilai, diawali `235,18,144` = `jmp short +18; nop`
— persis [`DATA-BLOCKS.md`](HOPPER/DATA-BLOCKS.md). (Dokumen itu menyebut empat blok
228 byte; ada satu baris `DATA` kelima berisi `255,7,31,203`, dan gelungnya memang
membaca 231.)

**Lima nama baru.** `CONCAT$`, `STR$`, `RND`, `INSTR`, dan `INT` — yang terakhir koreksi
atas `FACTEST`: di ketujuh situsnya hasilnya mengalir ke aritmetika float dan tak pernah
ke lompatan bersyarat, jadi ia mengembalikan nilai, bukan bendera. Tanpa `INT`,
`STR$(RND(1) * 3 + 1)` menghasilkan pecahan dan makro `DRAW`-nya ditolak; dengan itu
barisnya menjadi `DRAW S11$ + "C" + STR$(INT(RND(1) * 3) + 1)`.

**Sprite `GET`/`PUT` dan `LINE`.** Titik grafis disimpan di `[0x60E]`/`[0x610]`; helper
`@27164` menyetelnya, dan `GFXSTART` memindahkan titik lama ke `[0x612]`/`[0x614]` lebih
dulu sehingga pasangan `(x1,y1)-(x2,y2)` terbentuk. Dari situ empat nama lagi lahir:

| rutin | pernyataan | bukti pembeda |
|---|---|---|
| `@20372` **`GET`** | `GET (x1,y1)-(x2,y2), larik` | menghitung `\|x2-x1\|+1` dan `\|y2-y1\|+1` lalu menyalin persegi ke larik di bx; kedua situsnya didahului GFXPT + GFXSTART |
| `@20227` **`LINE_BF`** | `LINE ...-..., c, BF` | lebar ke `[0x6AE]`, tinggi ke bp, lalu `dec bp / jne` menggambar sebaris penuh piksel per baris — kotak TERISI |
| `@20170` **`LINE`** | `LINE ...-..., c` | mendorong kedua titik lalu memanggil penggambar garis, tanpa perhitungan lebar/tinggi |
| `@20466` **`GFXPT`** | (penyetel titik) | tubuh identik dengan GFXPT `@20155`/`@20360`, dan selalu mendahului `PUT` |

Helper `@27215` yang dipakai `LINE` dan `LINE_BF` **jatuh** ke badan `GFXSTART`, jadi
titik keduanya datang dari bx/dx rutin itu sendiri — bukan dari pasangan yang sudah
tersimpan. Sempat saya salah baca, dan hasilnya `LINE (266,0)-(266,0)`.

Sesudahnya HOPPER menerbitkan sprite kataknya utuh:
`GET (CINT(F45!), CINT(F48!))-(CINT(F45! + 13), CINT(F48! + 10)), J1%` — persegi 14x11.
`GET`/`PUT` juga menuntut nama larik **tanpa subskrip**; `J1%(0)` ditolak parser.

**`INPUT$` bukan `INKEY$`.** `INPUT$(n)` memblokir sampai n karakter tersedia; `INKEY$`
tidak dan bisa mengembalikan `""`. Menyamakan keduanya membuat `ASC(S1$)` menerima
string kosong.

Dua cacat lagi ada di HARNESS saya, bukan di rekonstruksi: `peek_values` yang tidak
diisi membuat setiap `PEEK` melempar `TypeError` dari dalam PC-BASIC (CLI-nya mengisi
sendiri, API Session tidak), dan `INPUT$` gagal dengan `Input past end` bila penyangga
papan ketik kosong saat dipanggil.

## Wasit layar, dan apa yang ia temukan

`tools/refscreen.py` menjalankan EXE asli (lewat `textscreen.py`, yang mencegat
`INT 10h`) dan `.bas` (lewat `runbas.py`) dengan masukan yang SAMA, lalu membandingkan
isi layarnya. Uji asap hanya menangkap galat runtime; wasit ini menangkap hasil yang
salah diam-diam — justru kelas cacat yang paling mahal di proyek ini.

Ia langsung membayar dirinya. Layar EXE menampilkan `Please enter your name?`; layar
`.bas` tidak punya prompt itu sama sekali. **Seluruh pernyataan `INPUT` 3DTTT hilang
dari rekonstruksi** — empat belas situs, termasuk nama pemain, nama berkas simpanan, dan
drive tujuan.

Sebabnya dua rutin salah nama. `@36119` dan `@36318` dinamai `STKPUSH`/`STKREAD` dan
saya perlakukan sebagai pembukuan tumpukan, jadi tak menerbitkan apa pun. Tubuhnya
memanen alamat kembali jauh lalu membaca dua byte sebaris (cacah dan kode tipe) dan
menyimpan penunjuk daftar item — struktur pengumpul argumen, bukan tumpukan `FOR`.
Pasangannya menelusuri daftar itu mundur, dan alamat yang dibawanya di situs 12581
adalah alamat yang persis di-`LEN` sembilan instruksi kemudian. Itu `INPUT_ITEM` dan
`INPUT_DONE`.

Sesudah dikoreksi, prompt-nya terbit utuh: `INPUT "Please enter your name? "; S3$`,
`INPUT "Please enter file name:"; S6$`, `INPUT "Target disk drive: (a,b,c,d)"; S7$`.

**Kode tipe yang tak terbaca, dipelajari dari pemakaian.** Byte tipe sebaris melewati
tabel `xlat` di ruang data runtime yang tak terbaca dari citra berkas, jadi kode 3DTTT
(7) tak terpetakan tabel stub. Tetapi sebagian tujuan `INPUT` terpakai di tempat lain
dengan cara yang menentukan — `LEN` diterapkan padanya. Dari pasangan itu pemetaannya
disimpulkan (`{7: '$', 5: '!'}` untuk 3DTTT, `{4: '!'}` untuk PAC-GAL) lalu diterapkan
ke tujuan yang pemakaiannya tidak menentukan. Pola yang sama dipakai memecahkan DELTA
deskriptor string: satu besaran tak terbaca, disimpulkan dari kasus-kasus yang konsisten.

Satu cacat lagi ada di alatnya sendiri: `textscreen.py` tidak menguraikan escape
(`--keys ""` masuk sebagai empat karakter harfiah) sementara `runbas.py`
menguraikannya. Kedua sisi wasit menerima masukan berbeda, dan perbandingan pertamanya
tak berarti. Sekarang keduanya memakai penguraian yang sama.

## PAC-GAL akhirnya bisa diwasiti — dan hipotesis lamanya keliru

Wasit PAC-GAL dulu terhalang: EXE-nya melempar `Illegal function call` sebelum
menggambar apa pun. Catatan lama menduga penyebabnya `comrun` mengabaikan set-mode
video sehingga lebar layar tak terisi. Diukur, dugaan itu **salah**.

Menjebak `cmp dh, [0x6f6]` — pembanding kolom di dalam `LOCATE` — memperlihatkan
lebar layar terisi baik-baik saja, dengan **40**, sementara programnya meminta kolom
**60**. Lebar itu memang dihitung dari tabel di data program sendiri, bukan dari BIOS,
jadi mustahil kosong.

Sebabnya satu tingkat lebih awal: `int 10h ah=0Fh` — "ambil mode video kini" — dipanggil
tepat sekali dan **tak ada yang menjawabnya**. `comrun` tak menangani `int 10h` sama
sekali, jadi BASCOM membaca mode 0, dan mode 0 berarti layar 40 kolom. Menjawab satu
pertanyaan itu (mode 3, 80 kolom — keadaan yang diserahkan DOS) membuat PAC-GAL
menggambar labirinnya.

Ini cacat harness KEEMPAT yang menyamar sebagai cacat rekonstruksi, sesudah
`peek_values`, kaitan `devices`, dan penguraian escape.

**Membandingkan permainan yang bergerak.** Perbandingan baris-demi-baris pada permainan
yang berjalan mengukur KAPAN cuplikan diambil, bukan apakah gambarnya benar: titik,
hantu, pemain, dan ruang bekas titik yang dimakan menempati sel yang sama bergantian.
Dua ukuran ditambahkan:

* `rangka()` mereduksi tiap baris ke kerangka dindingnya saja — tak bergantung waktu.
* `--keep-play` mempertahankan `PLAY`, supaya `.bas` berjalan pada laju aslinya alih-alih
  melesat jauh mendahului EXE yang membeku menunggu detak timer.

Hasilnya: **labirin identik sel demi sel, 24 dari 24 baris.**

## Layar yang tak bisa diwasiti, diuji tanpa waktu sama sekali

Layar instruksi HOPPER tak pernah bisa dibandingkan: di mesin asli `INITIALIZING...`
memakan waktu karena 233 kali `READ` dari `DATA`, sementara PC-BASIC menyelesaikannya
seketika. Selisihnya kecepatan, bukan isi.

Isinya bisa diuji tanpa waktu: setiap deskriptor string yang alamatnya muncul sebagai
immediate 16-bit di kode pengguna HARUS punya teksnya di `.bas`. `checkbas.py`
memeriksanya sekarang — dan pemeriksaan itu langsung menemukan **tiga pernyataan
`PRINT USING` HOPPER yang hilang seluruhnya**, termasuk dua prompt yang menampilkan
nilai berjalan di dalam kurung siku.

Menariknya, `@23194` yang mencetaknya adalah alamat yang catatan lama sebut sebagai
pemasang vektor joystick. Ia tak menyentuh port apa pun. Joystick yang sesungguhnya
ada di `@19476` = `STICK`, dan kini keduanya bernama dengan bukti terpisah.

Menutup jalur itu membuka empat cacat berantai yang saling menutupi:

| cacat | akibat |
|---|---|
| `PRINT_BEGIN` MEMBUANG buffer PRINT alih-alih menerbitkannya | angka skor lenyap dan formatnya bocor ke pernyataan berikutnya |
| larik string runtuh jadi satu skalar `X9$` | kesepuluh nama papan skor jadi sama persis |
| `LINE_INPUT` mengabaikan nomor berkas | gelung pembaca papan skor membaca PAPAN KETIK, bukan berkasnya |
| `STKPOP` sebenarnya `INPUT_DONE`, dan `@16870` adalah `EOF` | seluruh pembacaan berkas menguap; gelungnya dijaga konstanta |

Sesudah semuanya ditutup, wasit layar HOPPER naik dari **0% ke 100%** — dan layarnya
memperlihatkan `Enter Skill Level (1-4) [1]:`, dengan nilai berjalan terpasang tepat di
tempat `#`.

## Permainan yang benar-benar dimainkan

Menjalankan tanpa galat belum membuktikan logikanya jalan. Tombol arah dikirim sebagai
kode pindai diperluas (`CHR$(0)` + kode), dan hasilnya:

**HOPPER** merespons panah dan MENCETAK SKOR: 20, 40, 60, ... sampai 220, lalu
`YOUR SCORE IS IN THE TOP TEN` — cabang skor tertinggi ikut jalan. Kataknya bergerak,
pencacah waktunya turun, dan nyawanya habis sebagaimana mestinya.

## Bukti terkuat: berkas skor 1991 yang bolak-balik utuh

HOPPER menulis papan skor ke `HOPPER.SCO`. Koleksi ini masih menyimpan berkas yang
ditulis program ASLINYA pada 2 Agustus 1991. Berkas itu disodorkan ke rekonstruksi,
dibaca, diurutkan, lalu ditulis kembali — dan hasilnya **identik byte demi byte**:

```
asli 1991      : 128 byte, isi sampai 0x1A = 101
rekonstruksi   : 101 byte, isi sampai 0x1A = 101
isi IDENTIK    : True
sisa berkas asli hanya padding nol: True
```

Isinya: ` 14190 / dik / 13550 / dik / 13470 / (kosong) / 640 / dik / ...` — sepuluh
pasang, skor menurun, nama pada slot yang benar termasuk yang kosong. Selisih 27 byte
itu bukan perbedaan isi, melainkan DOS yang memadatkan berkas ke blok 128 byte.

Ini menguji satu rantai penuh sekaligus: `EOF`, `INPUT #1`, `LINE INPUT #1`, larik
`G1!()` dan `G2$()`, pengurutannya, lalu `PRINT #1`. Nama pada slot yang berbeda-beda
hanya mungkin bila lariknya benar-benar terindeks — sebelum sesi ini seluruhnya runtuh
menjadi satu skalar dan kesepuluh namanya sama.

Spasi depan-belakang pada angka juga bukan kebetulan: `VERIFICATION.md` menyimpulkannya
dari `mov al, 0x20` di mesin `PRINT`, jauh sebelum ada yang bisa dijalankan.

## Menutup sisa yang terakhir

Empat puluh panggilan terakhir ternyata bukan sisa-sisa acak. Membongkarnya satu per
satu memunculkan tiga kelompok yang rapi:

**Prolog dan terminator runtime, sama di ketiga biner.** Situs 26 dan 38 selalu berisi
pasangan yang byte-nya identik: `RT_HEAPINIT` membaca `PSP:[2]` (batas memori yang
diberi DOS) lalu memasang segmen DGROUP, dan `RT_STMTCTX` menyetel kode konteks 5 serta
mencatat `sp` sebagai titik periksa pernyataan. Keduanya pembukuan, bukan pernyataan.

Terminatornya punya DUA entry ke badan yang sama: entry luar menguji sebuah bendera dan
mengambil jalur `stc`, entry dalam langsung `clc`. Carry itulah pembeda dua ragam
terminasi. Yang dalam dipanggil dari tengah program — `END` eksplisit; yang luar tepat
sekali di situs panggilan TERAKHIR — terminator implisit di ujung program. Setiap biner
memakai keduanya, dan penamaan sebelumnya hanya menangkap satu per biner (yang berbeda
pula di HOPPER dibanding dua lainnya).

**Sebelas pernyataan BASIC yang tak pernah terbit.** `RANDOMIZE` (benih dari `TIME$`,
ditulis ke kata yang dibaca `RND`), `SGN`, `PAINT`, `TAB`, `PLAY`, `KEY`, `CALL`,
`ON ERROR GOTO` / `ON ERROR GOTO 0`, dan `PRINT USING` di PAC-GAL.

Beberapa membuktikan diri sendiri begitu terbit:

```
PRINT TAB(12);" G A M E   O V E R"
PAINT (CINT(F3! + -9), CINT(F27! + 5)), 2      <- warna 2 di satu situs
PAINT (CINT(F3! + F41!), CINT(F27! + 3)), 3    <- warna 3 di situs lain
ON ERROR GOTO 10770 : OPEN "O", #1, "hopper.SCO"
10770 ON ERROR GOTO 0 : CLOSE : CLS : END
PLAY "P2L8C.CL16CL8D.GL16FL8EL4C"
```

`TAB(12)` menengahkan teks yang panjangnya memang pas; argumen warna `PAINT` BERBEDA
antar situs, jadi ia perilaku argumen dan bukan konstanta rutin; dan alamat penangan
yang dipasang `ON ERROR` persis alamat situs `ON ERROR GOTO 0` yang menutup berkas lalu
mengakhiri program.

**Satu jebakan baru.** `ON ERROR GOTO 0` bukan lompatan — nol di situ berarti
*mematikan* penangkap galat. Baik `fix_refs` di `recover.py` maupun pemeriksa target di
`checkbas.py` membacanya sebagai rujukan ke baris 0 yang tak terbit, lalu mengalihkannya
ke baris terbit pertama. Penangan galatnya jadi memasang ulang dirinya ke awal program.
Keduanya kini mengecualikan bentuk itu.

## Memperdalam wasit: dari satu baris menjadi seluruh papan

Perbandingan 3DTTT dulu cuma **satu baris** (`Please enter your name?`) karena EXE-nya
membeku. Penyebabnya bukan misteri: ketiga biner mengaitkan **INT 1Ch**, dan tak ada
yang pernah mengirimkan detaknya. `comrun` sudah punya mesinnya (`_fire_isr` membaca
vektor hidup setiap kali), tinggal dipakai — `refscreen.py` kini meneruskan
`--timer-isr`.

Dengan detak itu 3DTTT menggambar SELURUH papan: empat kisi 4×4, judul `LU's 3D Game`,
kotak status, dan baris tombol fungsi. Tiga cacat harness lagi muncul dan ditutup:

| cacat | akibat |
|---|---|
| codec `cp437` Python memetakan 0x01–0x1F ke karakter KENDALI | glif `↑↓←→◄` di baris tombol fungsi hilang dari sisi EXE, padahal layar PC menampilkannya |
| `textscreen.py` hanya mencegat INT 10h | 3DTTT menulis sudut `╝` di baris 23 kolom 80 **langsung ke B800** — menghindari gulir yang dipicu teletype di sel terakhir; satu-satunya sel yang tak lewat INT 10h |
| regex pembuang `PLAY` juga cocok DI DALAM literal | `PRINT "WOULD YOU LIKE TO PLAY AGAIN (y/n)? "` berubah jadi `"WOULD YOU LIKE TO REM` — alat pembandingnya sendiri yang merusak layar. Penggantinya kini `PLAY ""`, bukan `REM`, karena `REM` menelan sisa baris |

Sesudahnya: **18 dari 18 baris cocok, dan 17 dari 17 kerangka kotaknya.**

## Grafis HOPPER, akhirnya terlihat

`get_pixels()` PC-BASIC ternyata **memang** mengembalikan framebuffer grafis. Catatan
lama yang menyebut ia mengembalikan penyangga teks keliru — waktu itu programnya belum
sempat masuk mode grafis. Diuji langsung dengan `SCREEN 1 : LINE (0,0)-(319,199),3`, ia
mengembalikan 320×200 dengan warna 3 di sepanjang diagonal.

Dua hal lagi menghalangi: HOPPER berhenti di prompt skill (kuncinya kurang), dan
tangkapan tunggal di ujung waktu selalu kosong karena permainan membersihkan layarnya
saat usai. `tools/gfxshot.py` mencuplik BERKALA dan menyimpan bingkai terkaya.

Hasilnya **14.537 piksel dalam empat warna CGA**, dengan pita-pita lalu lintas dan
sungai yang jelas berbentuk. `PSET`, `DRAW`, `PAINT`, dan `PUT` semuanya bekerja.

Dan gambarnya bukan sekadar "ada": **keenam string `DRAW` byte-identik dengan
deskriptor di biner asli** —

```
S4$ = "C3F3DFD2GDGL2H2UE2G3HBD2D0GBU2LHU2E4RE"      <- katak
S5$ = "C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF2"      <- batang kayu
```

jadi program gambarnya memang milik aslinya, dijalankan apa adanya.

## Penggulung yang di-POKE: byte-nya asli, tapi PC-BASIC tak menjalankannya

HOPPER menyuntikkan 232 byte kode mesin lewat `READ`/`POKE` lalu `CALL`. Diuji dengan
penanda (`POKE` sebuah `mov byte [0100],42`, lalu `PEEK` sesudah `CALL`), PC-BASIC
menerima `CALL` **tanpa galat tetapi tidak menjalankan kode 8086** — byte penandanya
tetap 0.

Yang tetap bisa dibuktikan tanpa emulator penuh, dan sudah dibuktikan:

* **Ketiga belas pernyataan `DATA` cocok persis** dengan teksnya di DGROUP biner.
* Bytenya membongkar menjadi penggulung pita CGA yang sah: `std` untuk salinan mundur,
  `mul bx` dengan `0x1E0` = 480 = 6 baris × 80 byte per pita.

Jadi kesenjangannya murni milik PC-BASIC, dan letaknya sudah terukur.

## Grafis HOPPER akhirnya terbandingkan dua sisi

EXE HOPPER dulu "masuk mode 4 lalu tak menulis apa pun". Sebabnya bukan grafis: ia
terjebak gelung baca berkas. `comrun` **tidak menangani layanan FCB gaya lama sama
sekali**, dan HOPPER membaca papan skornya lewat `int 21h ah=21h` (baca acak FCB) —
18.023 percobaan dalam satu jalan, tak pernah dijawab, tak pernah selesai.

`textscreen.py` kini melayani FCB (`ah=0Fh/10h/14h/21h`). Panggilannya turun dari
18.023 menjadi **satu**, dan EXE-nya menggambar dunia permainannya.

Satu salah baca lagi ikut terkoreksi: hook framebuffer sebelumnya menafsirkan B800
sebagai pasangan karakter/atribut di SEMUA mode. Di mode grafis B800 adalah penyangga
piksel, jadi byte piksel muncul sebagai huruf — `0x55` jadi `U`, `0x05` jadi `♣` — dan
layar HOPPER terbaca seolah dunianya digambar dengan karakter. Hook itu kini hanya
aktif di mode teks, dan `pixels()` men-decode mode 4 dengan benar (dua bank
berselang, empat piksel per byte).

Sesudahnya kedua sisi memberi kisi 320×200 bernilai 0–3 yang sebanding. `tools/gfxref.py`
membandingkannya lewat ukuran yang tak bergantung waktu:

```
warna terpakai: EXE [0,1,2,3] | .bas [0,1,2,3] | SAMA
peta baris berisi: 193 dari 200 baris sepakat (96%)
korelasi profil tinta per baris: 0,844
```

Selisih jumlah tinta (22.098 lawan 14.465) wajar: keduanya berada pada saat permainan
yang berbeda. Struktur pitanya — baris titik di atas, pita sungai `::::`, pita jalan
`####` — berada di baris yang sama di kedua sisi.

## Penggulung yang di-POKE: dijalankan, dan terbukti menggulung

Dua bukti independen, dan keduanya sepakat.

**Pertama, di BASIC sungguhan.** Dua percobaan DOSBox-X pertama menggantung tanpa
keluaran. Sebabnya bukan DOSBox-X-nya melainkan SDL yang menunggu jendela:
`SDL_VIDEODRIVER=dummy` membuatnya berjalan headless dan **keluar dengan kode 0**. Di
bawah COMPAQ Personal Computer BASIC 1.12 (`run/BASICA.EXE` — varian GW-BASIC yang
berdiri sendiri, bukan BASICA IBM yang menuntut ROM), byte yang sama di-POKE lalu
dipanggil dengan `CALL` sungguhan, dan framebuffer-nya di-`BSAVE` sebelum dan sesudah:

```
BEFORE.SCR / AFTER.SCR: penanda 0xFD, segmen 0xB800, panjang 16384
baris  70: geser -8 piksel, 95% cocok
baris  71: geser -8 piksel, 95% cocok   ... dua belas baris berturut-turut
```

**Kedua, di emulator.** `tools/runscroll.py` menjalankan 232 byte itu langsung:
framebuffer diisi pola yang bervariasi di kedua sumbu, rutinnya dipanggil sebagai
panggilan JAUH — persis yang dilakukan `CALL` — lalu isinya dibandingkan.

```
eksekusi: kembali normal
piksel berubah: 19.659 dari 64.000 (30,7%)
geseran mendatar terbaik per baris:
   baris  34: geser +8 piksel, 84% cocok
   baris  35: geser +8 piksel, 85% cocok
   ...
```

Perubahannya mulai **tepat di baris 34**, sesuai segmen `0xB855` yang dipasang rutin itu
sendiri (`0x550` byte = area permainan di bawah baris skor). Dan setiap baris yang
berubah adalah **geseran mendatar +8 piksel** — bukan corat-coret, melainkan penggulung
jalur. Tabel arah/kecepatan yang tertanam di offset 5 (`01 ff 02 ff 02 00 01 ff 02 fe ff`
— nilai ±1/±2 byte = ±4/±8 piksel) cocok dengan geseran yang terukur.

Percobaan pertama sempat melaporkan "tidak ada yang berubah". Itu salah pola uji saya:
polanya seragam mendatar, dan geseran horizontal pada pola semacam itu memang tak
terlihat sama sekali.

**Kedua metode sepakat: geseran MENDATAR sebesar 8 piksel.** Arah dan pita yang terlihat
berbeda (+8 di baris 34 lawan −8 di baris 70) karena pola ujinya berbeda kepadatan dan
tabel arahnya memang per-jalur — nilai `02` (+2 byte = +8 piksel) dan `fe` (−2 byte =
−8 piksel) sama-sama ada di tabel itu.

Jadi `CALL` dalam rekonstruksi bukan sekadar pernyataan yang benar secara sintaksis: di
BASIC seangkatan aslinya ia menjalankan penggulung, dan penggulungnya menggulung.

## Batas yang tersisa

Tak ada lagi panggilan yang tak tertangani. Yang tetap hilang permanen adalah hal yang
memang tidak ada di dalam berkas `.EXE`: **nama variabel asli, nomor baris asli, dan
seluruh `REM`**. Yang diterbitkan adalah nama sintetis yang **konsisten** — itu yang
dibutuhkan agar program berjalan, bukan agar terlihat sama dengan aslinya.

PC-BASIC menerima `CALL` tapi tidak menjalankan kode 8086, jadi efek penggulung tak
muncul di harness utama. Itu batas PC-BASIC, dan sudah dilewati lewat jalur lain:
bytenya terbukti asli (13 dari 13 `DATA` cocok persis) dan terbukti menggulung, baik di
COMPAQ BASIC 1.12 sungguhan maupun di emulator.

Yang belum tercapai: menjalankan rekonstruksi UTUH di bawah COMPAQ BASIC sampai selesai.
Percobaannya (dengan penyangga papan ketik BIOS diisi lebih dulu) kehabisan waktu tanpa
mencapai jalur akhir permainan, jadi klaimnya dibatasi pada apa yang benar-benar
terbukti: rutin yang di-POKE berjalan di BASIC sungguhan, bukan seluruh permainannya.

## Berkas

```
tools/ir.py           aliran instruksi selaras + panjang argumen sebaris
tools/operands.py     deskriptor string, konstanta MBF, saluran operan
tools/recover.py      interpretasi abstrak -> pernyataan BASIC
tools/build-bas.py    penerbit ketiga .bas
tools/checkbas.py     pemeriksa BENTUK berkas (tanpa menjalankan)
tools/smoke.py        pemeriksa PERILAKU (jalankan, laporkan galat pertama)
tools/runbas.py       jalankan di PC-BASIC dan TANGKAP LAYARNYA
tools/refscreen.py    WASIT: bandingkan layar EXE dengan layar .bas
tools/gfxshot.py      tangkap layar GRAFIS .bas (bingkai terkaya) + seni ASCII
tools/gfxref.py       WASIT GRAFIS: bandingkan framebuffer CGA kedua sisi
tools/runscroll.py    jalankan penggulung 232 byte dan ukur geserannya
tools/stmtfamily.py   audit keluarga LOCATE/COLOR/SCREEN dari sidik jari validator
tools/view.py         pembongkar beranotasi (alat kerja)
```
