# Dekompilasi EXE ter-compile — laporan penutup

> **Baru masuk ke folder ini?** Baca [`PELAJARAN.md`](PELAJARAN.md) lebih
> dulu. Ia meringkas cara kerjanya — apa yang berhasil, apa yang membuang
> waktu, dan tiga belas jalan buntu yang sudah dipetakan — supaya Anda
> tidak menempuhnya lagi.

Membongkar empat `.EXE` di `run\` kembali ke bentuk yang bisa dibaca.
2026-08-06. Ditutup setelah 18 iterasi.

## Status akhir

| Berkas | Asal | Hasil |
|---|---|---|
| [`SPACEWAR.EXE`](SPACEWAR/) | assembly murni | ✅ **selesai** — 99% kode terdisassembly + [arsitektur](SPACEWAR/ARCHITECTURE.md) |
| [`PAC-GAL.EXE`](PAC-GAL/) | BASIC ter-compile | [`pac-gal.bas`](PAC-GAL/pac-gal.bas) — 208 pernyataan, **98% ternama** |
| [`3DTTT.EXE`](3DTTT/) | BASIC ter-compile | [`3dttt.bas`](3DTTT/3dttt.bas) — 1.205 pernyataan, **99% ternama** |
| [`HOPPER.EXE`](HOPPER/) | BASIC ter-compile | [`hopper.bas`](HOPPER/hopper.bas) — 208 pernyataan, **93% ternama** |

**Jawaban atas pertanyaan awal:** ya, ketiga EXE BASIC bisa dibalik. `.bas` ketiganya
terbit, berbentuk BASIC bernomor baris dengan literal, tipe variabel, dan pernyataan
bernama di tempatnya. SPACEWAR tidak pernah BASIC; dikerjakan sebagai assembly dan tuntas.

**Dua sumbu, jangan tertukar.** Cakupan penamaan di tabel atas menjawab *"program ini
memanggil apa saja?"* — bukan *"hasilnya bisa dijalankan?"*. Nama seperti `FACSTORE!`
atau `ADD!` semuanya benar dan semuanya di BAWAH level sumber BASIC: keempatnya pecahan
mesin dari satu baris `A = B + C`. Sumbu kedua dikerjakan terpisah di
[`RUNNABLE.md`](RUNNABLE.md), dan di sanalah `.bas` yang benar-benar bisa di-`RUN`:

| berkas | baris | status jalan |
|---|---|---|
| [`pac-gal-run.bas`](PAC-GAL/pac-gal-run.bas) | 295 | **bermain, tanpa galat** — labirin 79 kolom, pelet, empat hantu mengejar |
| [`3dttt-run.bas`](3DTTT/3dttt-run.bas) | 1.150 | **bermain, tanpa galat** — papan 4x4x4, komputer menjalankan gilirannya |
| [`hopper-run.bas`](HOPPER/hopper-run.bas) | 394 | **bermain sampai GAME OVER, tanpa galat** — CGA, sprite GET/PUT |

## Kelanjutannya: keempatnya sudah diport ke web

Dekompilasi ini bukan ujung jalannya. Keempat program dibuatkan halaman web yang
bisa dimainkan, dengan dokumen arsitekturnya sendiri:

| Biner | Port | Dokumen | Yang dibawa dari sini |
|---|---|---|---|
| `PAC-GAL.EXE` | [`web/games/pacgal/`](../web/games/pacgal/index.html) | [`pacgal.md`](../web/docs/pacgal.md) | Labirin **dipanen dari layar EXE** yang dijalankan di emulator, bukan digambar tangan |
| `3DTTT.EXE` | [`web/games/3dttt/`](../web/games/3dttt/index.html) | [`3dttt.md`](../web/docs/3dttt.md) | Papan 4×4×4 dan penilai posisinya |
| `HOPPER.EXE` | [`web/games/hopper/`](../web/games/hopper/index.html) | [`hopper.md`](../web/docs/hopper.md) | **Tabel kecepatan 11 jalur** dibaca dari 232 bita kode mesin yang di-`POKE`; median nol terbaca dari data |
| `SPACEWAR.EXE` | [`web/games/spacewar/`](../web/games/spacewar/index.html) | [`spacewar.md`](../web/docs/spacewar.md) | **Aturan mainnya dikutip dari teks di dalam biner** — ongkos, kerusakan, laju isi ulang, peta tombol dua pemain |

Temuan yang baru muncul **saat porting**, bukan saat dekompilasi, dan karena itu
tidak ada di laporan ini:

- **`SPACEWAR.EXE` menyimpan spesifikasi permainannya sendiri dalam kalimat**, di
  layar `GAME INSTRUCTIONS` (`0x3BD5`) dan `GAME KEYS` (`0x37AE`). Untuk program
  yang tidak punya `.bas`, teksnya ternyata jalan masuk yang jauh lebih pendek
  daripada disassembly-nya. Dipanen
  [`tools/harvest-spacewar.py`](tools/harvest-spacewar.py), lengkap dengan offset
  dan `assert` yang menjaga pemetaannya tidak tergeser.
- **Tabel sprite SPACEWAR masih belum terpecahkan**, dan empat percobaan yang
  gagal kini tercatat di [`spacewar.md`](../web/docs/spacewar.md) §4 — termasuk
  hipotesis interleave mode 6, yang gagal dan karena itu membuktikan formatnya
  bukan salinan mentah dari layar.

---

## Angka akhir

| | HOPPER | 3DTTT | PAC-GAL | SPACEWAR |
|---|---|---|---|---|
| ukuran berkas | 37.760 | 57.472 | 39.296 | 22.528 |
| relokasi | 786 | 2.357 | 1.361 | **5** |
| string error runtime BASIC | 22 | 22 | 22 | **0** |
| kode game | 7,9 KB | ~26,4 KB | ~12 KB | 11,1 KB |
| panggilan runtime | 745 | 2.322 | 1.322 | — |
| pernyataan tersegmentasi | 208 | 1.205 | 208 | — |
| cakupan penamaan | **94%** | **99,5%** | **98,7%** | — |
| cakupan region kode | **99,9%** | **99,7%** | 98,4% | 99% |

---

# Arsitektur: tiga program, tiga watak

| | aritmetika | tampilan | loop | `IF` | watak |
|---|---|---|---|---|---|
| [3DTTT](3DTTT/ARCHITECTURE.md) | **50%** | 27% | 10 | **679** | mesin hitung — penilai posisi |
| [PAC-GAL](PAC-GAL/ARCHITECTURE.md) | — | **91%** | 3 | 72 | mesin cetak — labirin dari string |
| [HOPPER](HOPPER/ARCHITECTURE.md) | **48%** | 13% | **22** | 201 | simulasi — benda bergerak lewat `DRAW` |

3DTTT: separuh operasinya aritmetika *single-precision* dengan 679 percabangan melawan
10 loop — bentuk penilai posisi, dan teksnya menegaskan (`COMPUTER'S TURN`, `0-2 players`).

PAC-GAL: 71% operasinya mencetak string. Labirin dirakit sebagai rantai `PRINT`
bertitik-koma, dan ubinnya dibangun saat startup dari `CHR$`/`STRING$` CP437
([`MAZE-TILES.md`](PAC-GAL/MAZE-TILES.md)) — `V09F0$` yang diulang delapan kali per
koridor adalah `CHR$(249)`, **pelet yang dimakan pemain**.

HOPPER: loop terbanyak, `GOSUB` paling sedikit. Satu-satunya yang memakai `DRAW`, dan
satu-satunya yang menurunkan bagian kritis ke assembly — empat blok `DATA`-nya ternyata
**satu scroller horizontal CGA** 228 byte ([`DATA-BLOCKS.md`](HOPPER/DATA-BLOCKS.md)),
lengkap dengan tabel kecepatan 11 jalur dan kode yang memodifikasi dirinya sendiri.

---

# Mekanisme yang terbongkar

**1 · Basis string, dipecahkan secara statistik.** Tiga format deskriptor BASCOM dicoba
dan gagal. Yang berhasil: solve basis alamat dari immediate 16-bit terhadap alamat awal
literal. HOPPER 26.916 (29 dari 34 literal, runner-up 15), 3DTTT 18.564, PAC-GAL 28.084.

**2 · Mesin `PRINT` dan stub bertipe** ([`OPERAND-STUBS.md`](OPERAND-STUBS.md),
[`PRINT-SEPARATORS.md`](PRINT-SEPARATORS.md)). Stub 5 byte `call helper` + 2 byte
deskriptor, tersusun sebagai **grid 4×3**: `AL` = tipe item (`%`/`$`/`!`/`#`),
`AH` = pemisah (`,` membagi kolom dengan 14 = zona `PRINT`; `;` langsung `ret`;
ganti baris).

**3 · `INT 3` sebagai jebakan event** ([`EVENT-TRAPS.md`](EVENT-TRAPS.md)). Byte `0xCC`
adalah `INT 3` yang dieksekusi — titik periksa `ON KEY`/`ON TIMER` seharga 1 byte, bukan
5. Ada 1.643 titik di 3DTTT. Handler `INT 9` membaca port 60h dan menghitung 10 tombol
fungsi = `ON KEY(1..10)`.

**4 · Peta runtime** ([`RUNTIME-MAP.md`](RUNTIME-MAP.md)). `COLOR` dan `LOCATE`
dibedakan oleh jumlah argumen (1–3 versus selalu tepat 2). `GOSUB`/`RETURN` terbukti
berpasangan lewat pencacah kedalaman `[0x61a]` yang satu menaikkan dan satu menurunkan.

**5 · Menamai lewat rantai literal→variabel→konsumen.** Pola yang paling produktif:
telusuri literal ke variabel yang ditugasinya (`LET$` dengan `bx`=sumber `dx`=tujuan),
lalu cari rutin yang menerima variabel itu. Menghasilkan `PLAY` di PAC-GAL (`@21341`
menerima ketiga variabel string `PLAY`), `DRAW` di HOPPER (`@22506` menerima variabel
yang ditugasi keempat string makro `DRAW`), dan `STROUT` di 3DTTT (`@33452` menerima
variabel prompt `V6002`/`V60A6`). Bukti A + L, dua asal berbeda.

Diotomatiskan di [`tools/chain.py`](tools/chain.py), yang memvalidasi dirinya dengan
menemukan kembali `PLAY` dan `DRAW` secara mandiri.

`SOUND` di HOPPER (`@11523`) datang dari tiga bukti bertemu: port speaker `42h`/`43h`/
`61h` di tubuhnya, `bx` bernilai 300/400/600 Hz di situs panggilan, dan `cmp bx, 0x25`
yang menolak nilai di bawah 37 — persis batas bawah frekuensi `SOUND` GW-BASIC.

Dua lagi di HOPPER dari struktur + arity:
- **`INT2SGL`** (`@21497`, 24 panggilan) — `mov ax, 0x9000` adalah eksponen MBF untuk
  magnitudo 16-bit; `neg bx` bersyarat tanda; `xor dx,dx` menolkan mantissa bawah.
  Merakit nilai single dari integer.
- **`CLS`** (`@11863`, 7 panggilan) — memilih `dl=39` atau `79` dari mode layar di
  `[0x616]`, `dh=24`: sudut kanan-bawah layar penuh. Rutin **tanpa argumen** yang
  menghitung batas layar; `CLS` satu-satunya pernyataan BASIC dengan sifat itu.

**6 · Konvensi register.** `bx` bertahan antar panggilan (wrapper `push`/`pop`) — 1.743
panggilan mendapat argumennya dari pewarisan ini. `LET$` memakai `bx`=sumber `dx`=tujuan.
`STRING$` memakai `bx`=cacah `dx`=kode karakter. `CONCAT$` memakai `bx` dan `ax`.

**7 · Tumpukan runtime: `STKPUSH`/`STKREAD`.** Pasangan di 3DTTT yang mengelola blok
status bersama di `[0x71E]`–`[0x727]`. `@36119` mengambil alamat kembali (`pop di`/`pop es`),
membaca byte inline, lalu menyimpan `es:di` dan `sp`; `@36318` membaca `[0x722]`,
mengalihkan `ds` ke `ss`, dan menelusuri mundur. Dinamai sesuai **yang dilakukannya** —
pernyataan BASIC yang diwakilinya (kemungkinan `FOR`/`NEXT`) belum dibuktikan.

**8 · `ON ... GOSUB` dengan tabel lompat inline.** Rutin `@33045` di 3DTTT: byte cacah
di `situs+5`, lalu N word alamat. 8 dari 9 situs panggilannya membawa tabel.

```
lcall ON_GOSUB
db    06                                          ; cacah
dw    21986, 22040, 22094, 22139, 22184, 22229    ; lengan
```

Tubuhnya menaikkan `[0x61a]` — pencacah kedalaman yang sama dipakai `GOSUB`/`RETURN` —
dan kelima lengan berakhir dengan `jmp` ke `lcall RETURN`. Jadi ini **`ON ... GOSUB`**,
bukan `GOTO`; nama awalnya dikoreksi di iterasi lanjutan.

Ini yang menjelaskan lima lengan identik berjarak 45 byte — masing-masing satu arm.
Memakainya sebagai benih menurunkan sisa 3DTTT dari 154 byte ke **77**, dan sisa yang
terbaca sebagai kode dari 105 byte ke **18**.

*Hipotesis ini sempat saya tolak di iterasi #11 karena uji saya salah alignment — lihat
[`NEGATIVE-RESULTS.md`](NEGATIVE-RESULTS.md) §3.*

**9 · Struktur blok** ([`BLOCK-STRUCTURE.md`](BLOCK-STRUCTURE.md)). Target `GOSUB` dibaca
dari word inline. Kedalaman bersarang hampir seluruhnya nol — khas BASIC bernomor baris,
di mana pengulangan dibangun dari `GOTO`.

**10 · Aset dan berkas** ([`RESIDUE-AND-FILES.md`](RESIDUE-AND-FILES.md)). `HOPPER.SCO`
mengonfirmasi analisis mesin `PRINT` **dari luar biner**: spasi depan-belakang tiap angka
adalah perilaku `PRINT` yang saya simpulkan dari `mov al, 0x20`.

---

# Hasil negatif

Sembilan pendekatan terdokumentasi lengkap di
[`NEGATIVE-RESULTS.md`](NEGATIVE-RESULTS.md). Yang terpenting:

**§7 — langit-langit cakupan 56/46/53% adalah bug pengukur saya sendiri.** Walk memakai
situs far call sebagai batas berhenti dan tak pernah menandai 5 byte tiap `lcall`.
"44% yang hilang" adalah instruksi panggilan itu sendiri. Cakupan sebenarnya 98–99%.
**Kesalahan ini membiayai tiga iterasi penelusuran dinamis** yang akhirnya menyumbang
17/0/10 byte.

**§9 — kecocokan tanda tangan antar-biner melingkar.** Nama di biner saudara diturunkan
*dari* nama di sini, jadi memakainya balik bukan konfirmasi. Diganti bukti `F`
(akumulator bersama), `T` (pemetaan ukuran-tipe), `V` (peran variabel dari rutin lain).

**§6 — budget, umpan tombol, dan timer semuanya nihil.** HOPPER 400 juta instruksi →
nol alamat baru.

**§8 — "HOPPER tidak punya tabel stub" salah.** Penyaringan memindai rentang alamat yang
keliru. Tabelnya ada di 22885–22940.

---

# Verifikasi: dari terbaca menjadi terbukti

Seluruh penamaan di atas bersifat **statis**. Disiplin dua-bukti menangkap dua puluh
kesalahan, tetapi ia punya kelemahan yang tak bisa diperbaiki dari dalam: pembacaan
statis bisa konsisten dan tetap salah, karena tak ada pembanding di luar dirinya.

[`VERIFICATION.md`](VERIFICATION.md) menutup celah itu. Ketiga EXE dijalankan di
emulator 8086 dan setiap alamat yang benar-benar dieksekusi dicatat, lalu dibandingkan
dengan rekonstruksi statis lewat [`tools/referee.py`](tools/referee.py).

| biner | situs panggilan yang DIJALANKAN | **sudah bernama** |
|---|---|---|
| 3DTTT | 122 | **97,5%** |
| HOPPER | 67 | **94,0%** |

Konfirmasi paling tajam datang tanpa diminta: HOPPER dan PAC-GAL sama-sama berhenti di
gelung jajak papan ketik, dan alamat tempat berhenti itu **tepat dua rutin yang
dipanggil `INKEY$`** — nama yang dipasang semata-mata dari tiga panjang keluarannya.
Program itu memang sedang menjajak papan ketik lewat rutin yang saya sebut `INKEY$`.

Bagian kedua dokumen itu menguji **isi**, bukan alur. `tools/textscreen.py` mencegat
`INT 10h` — tanpa mengubah `comrun.py`, hanya menurunkan kelasnya — dan merakit ulang
layar teks yang selama ini tak tersimpan di memori mana pun.

Hasilnya membalik arah pembuktian: kali ini **programnya yang mengonfirmasi saya**.

| yang tertulis di layar | temuan yang dikuatkan |
|---|---|
| "move your frog" | HOPPER klon Frogger; tabel kecepatan per-lajur `+1,-1,+2,...` di `DATA-BLOCKS.md` adalah lajur lalu-lintas berlawanan arah |
| "`<F10>` to abort" | jalur dua-byte `INKEY$` untuk tombol diperluas, yang membuat tafsir `MKI$` ditolak |
| "JOYSTICK OR KEYBOARD" | `@19476` = `STICK`, pembaca sumbu joystick lewat port `0x201` — yang disiplin dua-bukti **tolak namai**, dan kini terbukti perannya |

Satu galat runtime PAC-GAL, `Illegal function call at 1010:00B3`, mendarat tepat di
sebuah `INT 3` dua instruksi sesudah dua panggilan `LOCATE` — mengonfirmasi keduanya
sekaligus: nama `LOCATE`, dan peran `INT 3` sebagai titik periksa batas-pernyataan.

Batasnya tetap dinyatakan terang: jejaknya belum mencapai permainan penuh, framebuffer
grafis HOPPER masih hitam sehingga penggulung CGA di `DATA-BLOCKS.md` belum teruji,
labirin `MAZE-TILES.md` belum tercapai, dan `.bas`-nya sendiri tetap rekonstruksi yang
tak bisa dijalankan ulang.

---

# Yang tersisa, dan kenapa

**75 panggilan belum bernama** (3DTTT 12, HOPPER 46, PAC-GAL 17), tersebar di
**46 entry point berbeda**. Ekornya panjang — tiap entry point tersisa di bawah
15 panggilan, jadi biaya per nama naik terus.
**Nol nama `__maybe`** — semua 189 entri (91 nama berbeda) di ketiga biner lolos ambang dua-bukti.

Panen terakhir datang dari teknik varian-entry (`tools/variants.py`): runtime BASCOM
memakai banyak entry point ke satu tubuh bersama, tiap entry hanya menyiapkan operan
lalu melompat masuk. Sebelas nama lahir dari sana, termasuk tiga yang paling terasa:

| nama | bukti yang menentukan |
|---|---|
| `INKEY$` | tiga panjang keluaran: 0 (deskriptor kosong `0x124`), 1, dan 2 untuk kode pindai diperluas — pola yang hanya dimiliki `INKEY$` |
| `PRINT#` | tubuhnya memetakan nomor berkas ke blok kendali dan menguji `cmp byte [si],1`; **setiap** situs panggilan didahului `mov bx,1` |
| `ADD!_FAC` / `SUB!_FAC` | satu memasuki jalur yang melewati `xor al,0x80`, satu lagi melewatinya — kontras satu instruksi |

Iterasi berikutnya menutup keluarga aritmetika dan, tanpa dicari, menemukan
**akumulator kedua**. Rutin `@9676` (HOPPER) menjumlahkan eksponen
(`sub ah,0x81` / `sub ch,0x80` / `add ah,ch`) dan berisi tiga `mul` = **perkalian**;
`@9810` mengurangkan eksponen dan berisi `div bx` = **pembagian**. Strukturnya sama
persis; hanya arah eksponen yang berbeda.

Lalu `@15894` memakai pola yang sama tetapi membaca operan di `[si+6]`, bukan
`[si]`/`[di+2]`, dan menggeser mantissa lewat rantai empat word
(`shl dx / rcl cx / rcl bx / rcl di`) — **64 bit**. Itu presisi ganda. Basisnya,
`0xAE`, berada tepat **4 byte di bawah** FAC tunggal `0xB2`:

| biner | FAC tunggal (4 byte) | FAC ganda (8 byte) |
|---|---|---|
| HOPPER | `0xB2` | `0xAE` |
| PAC-GAL | `0x1A` | `0x16` |
| 3DTTT | `0xB4` | `0xB0` |

FAC tunggal ternyata **paruh atas** FAC ganda. Ini sekaligus menjelaskan entry
`CINT` bervarian `si=0xAE`/`si=0x16` yang sebelumnya tak terbaca: keduanya bentuk
presisi-ganda, kini bernama `CINT#`. Kolom 3DTTT di tabel itu cocok dengan bukti lama
yang berdiri sendiri — catatan `FACNORM` sudah mencatat rutin itu membaca `[0xB0]`.

Ramalan itu terbukti pada iterasi berikutnya. Dengan `[si+6]` sebagai penanda,
seluruh sisa keluarga presisi-ganda terbuka sekaligus — dan memberi **penanda ukuran
kedua yang berdiri sendiri**. Rutin penjumlahan menjaga selisih eksponennya:

| presisi | penjaga | artinya |
|---|---|---|
| tunggal | `cmp ah, 0x18` | 24 bit mantissa MBF single |
| ganda | `cmp ah, 0x38` | 56 bit mantissa MBF double |

Bila selisih eksponen melampaui lebar mantissa, operan yang lebih kecil tak lagi
mengubah hasil dan langsung dibuang. Penjaga itu sekaligus membuktikan dua hal:
operasinya penjumlahan (penyelarasan, bukan penggabungan tanda), dan presisinya
terbaca dari angka penjaganya saja.

Keluarga salin-FAC memberi pemetaan ukuran ketiga, kali ini dari jumlah instruksi:

```
13155  mov [0x618],si        ; simpan si,di pemanggil
       mov si, 0xB2          ; FAC tunggal sebagai SUMBER
       movsw ; movsw         ; 2 word = 4 byte   -> FACSTORE!
13180  mov si, 0xAE          ; FAC ganda
       movsw ; movsw ; movsw ; movsw   ; 8 byte -> FACSTORE#
13144  mov di, 0xAE          ; FAC ganda sebagai TUJUAN
       movsw x4 ; sub si, 8  ; muat, lalu mundurkan penunjuk -> LOAD#
```

Arah salinan (`movsw` menyalin `ds:[si]` ke `es:[di]`) yang memisahkan muat dari
simpan — bukan tebakan dari namanya.

Terakhir, PAC-GAL `@15731` ternyata **pembanding** titik-mengambang: `std` lalu
`repe cmpsw`, membandingkan mundur dari word paling berarti, dengan `xor bl,al`
menggabungkan tanda. Entry tetangganya memakai `add di,6` alih-alih `mov cx,2` —
bentuk presisi-ganda dari rutin yang sama.

Ramalan iterasi #7 tentang FAC ganda 3DTTT di `0xB0` juga terkonfirmasi langsung:
`@29456` memakai `si := 0xB0` dengan empat `movsw`.

Membaca keluarga `PRINT` sampai habis juga memunculkan kelimanya sekaligus di
36709–36760 (3DTTT) dan 23248–23294 (HOPPER): `PRINT`, `WRITE`, `PRINT#`, `LPRINT`,
`WRITE#`, dibedakan hanya oleh sebuah bendera byte dan penunjuk perangkat.

**Blok AI hantu PAC-GAL di 10538 — kemungkinan besar kode mati.** Lima hipotesis diuji
dan gagal; yang menentukan: **alamat 10538 tidak pernah muncul sebagai word di mana pun
dalam berkas**, dan `jmp` di 10535 melompat melewatinya. Tanpa alamat itu tersimpan di
mana pun, tak ada mekanisme statis yang bisa mencapainya. Belum dibuktikan positif —
membuktikan tak-terjangkau menuntut memeriksa seluruh jalur — tapi lima jalur masuk
sudah ditutup. Rutin kejarnya sendiri utuh dan berfungsi.

*(Teka-teki serupa di 3DTTT — lima lengan berjarak 45 byte — sudah terpecahkan: itu
arm-arm `ON ... GOSUB`. PAC-GAL tidak punya tabel `ON ... GOSUB` sama sekali, jadi
mekanismenya berbeda.)*

**Yang hilang selamanya:** nama variabel (jadi `V096A`), nomor baris asli, seluruh `REM`.
**Tipe** variabel justru selamat, terbaca dari deskriptor stub.

---

# Berkas keluaran

```
README.md                    laporan ini
NEGATIVE-RESULTS.md          9 pendekatan yang gagal, dengan sebabnya
OPERAND-STUBS.md             mesin PRINT dan stub bertipe
PRINT-SEPARATORS.md          AH = pemisah PRINT
EVENT-TRAPS.md               INT 3 dan INT 9
RUNTIME-MAP.md               peta entry point 3DTTT
BLOCK-STRUCTURE.md           alur kendali ketiganya
ARG-ACCUMULATOR.md           akumulator argumen 0x6E8B
RESIDUE-AND-FILES.md         sisa region kode, berkas skor
DYNAMIC-TRACING.md           penelusuran dinamis (dan kenapa tak diperlukan)
name-evidence.json           bukti tiap nama, per jenis

3DTTT/     3dttt.bas  menu-block.bas  ARCHITECTURE.md  statements.txt  user-code.asm  assets.md
PAC-GAL/   pac-gal.bas  ARCHITECTURE.md  MAZE-TILES.md  statements.txt  user-code.asm  assets.md
HOPPER/    hopper.bas  ARCHITECTURE.md  DATA-BLOCKS.md  data-blocks.asm  statements.txt  user-code.asm  assets.md
SPACEWAR/  spacewar.asm  ARCHITECTURE.md  README.md
RUNNABLE.md                  rekompilasi ke .bas yang BISA DI-RUN
tools/     27 skrip Python + capstone
trace/     jejak emulator (tidak diperlukan; lihat NEGATIVE-RESULTS §7)
```

Pipeline reproducible: `layout.py` → `entrymap.py` → `strres.py` → `stubs.py` →
`xfer.py` → `emit2.py` → `emitbas.py`. Klasifikasi sisa: `classify.py`.
Rekompilasi bisa-jalan: `ir.py` → `operands.py` → `recover.py` → `build-bas.py`.
Penjagaan: `checkbas.py` (bentuk berkas, plus dua invarian kesetiaan — pemisah `PRINT` dan literal terpakai), `smoke.py` (perilaku saat dijalankan), dan `refscreen.py` (wasit layar: EXE asli lawan `.bas` pada masukan yang sama).
Audit nama: `audit-names.py`. Profil argumen: `argpat.py`.

## Pengakuan

Metode dan disiplinnya banyak berutang pada `C:\Projects\DOS-Decompiler` — terutama
aturan dua-bukti di `SKILL.md`, dan pelajaran *"an unexplained percentage is a question,
not a measurement"* di `knowledge/11-unreached-code.md`. Pelajaran kedua itu yang
akhirnya membongkar bug pengukur di §7, setelah saya mengutipnya tapi tidak
menerapkannya selama tiga iterasi.
