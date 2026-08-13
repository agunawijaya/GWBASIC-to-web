# Hasil negatif — hipotesis yang diuji dan gagal

Catatan ini ada supaya usaha yang sama tidak diulang. Semua di bawah **sudah dicoba dan
tidak berhasil**, lengkap dengan sebabnya.

## 1 · Fingerprint entry point lewat jejak I/O (iterasi #3)

**Gagasan:** identifikasi rutin runtime dari interupsi/port yang disentuhnya —
`INT 10h` → grafis, port `42h`/`61h` → suara, port `201h` → joystick.

**Gagal karena:** BASCOM menyalurkan seluruh output video lewat **satu dispatcher
bersama**. Hampir setiap entry point akhirnya menyentuh `INT 10h`, jadi jejaknya seragam
dan tidak membedakan apa pun.

Upaya perbaikan dengan mengecualikan blok *hub* (175 blok terjangkau dari >45% entry
point) justru menutupi sinyal yang tersisa.

**Yang berhasil sebagai gantinya:** struktur tubuh rutin, dan literal yang diterimanya.

## 2 · Deskriptor string sebagai tabel statis di DGROUP (iterasi awal)

**Gagasan:** literal string dirujuk lewat tabel deskriptor di segmen data.

**Gagal karena:** tidak ada tabel seperti itu. Tiga format dicoba —
`u16len+u16off`, `u16off+u16len`, `u8len+u16off` — semuanya nihil.

**Yang berhasil:** menyelesaikan basis alamat secara statistik dari immediate 16-bit.

## 3 · `ON ... GOSUB` sebagai penjelas jangkauan 28% (iterasi #11)

**Gagasan:** kode yang tak terjangkau penelusuran statis dicapai lewat `ON ... GOSUB`
dengan tabel lompat inline sesudah panggilan runtime.

**Cara uji:** hitung, untuk tiap far call, berapa word berurutan sesudahnya yang jatuh
di rentang alamat kode.

**Hasil:** panjang tabel hampir seluruhnya **2**, di semua target termasuk rutin
aritmetika murni. Untuk word 16-bit di program berukuran puluhan KB, "jatuh di rentang
kode" adalah kebetulan statistik biasa. Tidak ada tanda tangan tabel lompat.

**Kesimpulan saat itu:** hipotesis tidak didukung.

### KOREKSI — hipotesisnya BENAR, ujinya yang salah

`ON ... GOSUB` memang ada di 3DTTT, di rutin `@33045`, dan **8 dari 9 situs panggilannya
membawa tabel lompat inline**. Bentuknya:

```
lcall 0x1B55          ; rutin ON..GOSUB
db    06              ; CACAH entri
dw    21986, 22040, 22094, 22139, 22184, 22229   ; alamat lengan
```

**Kenapa uji saya gagal:** saya membaca word mulai dari `situs+5`, padahal di situ ada
**byte cacah** lebih dulu — tabelnya mulai di `situs+6`. Semua word saya baca tergeser
satu byte, jadi terbaca sebagai nilai acak. Lalu saya menolak hasilnya karena "panjang
tabel hampir semua 2", padahal panjang 9 pun muncul dan saya abaikan sebagai derau.

Setelah alignment diperbaiki dan target tabel dipakai sebagai benih, sisa 3DTTT turun
dari **154 byte jadi 77**, dan sisa yang terbaca sebagai kode dari **105 byte (12 rentang)
jadi 18 byte (2 rentang)**. Kelima lengan 45-byte yang jadi teka-teki dua iterasi itu
adalah arm-arm `ON ... GOSUB`.

**Yang bisa dibawa:** saat sebuah uji struktur gagal, periksa dulu apakah *alignment*-nya
benar sebelum menyimpulkan strukturnya tidak ada. Satu byte geser cukup untuk membuat
tabel yang sah terbaca sebagai derau.

## 4 · `GOSUB` kedua yang terlewat di HOPPER/PAC-GAL (iterasi #11)

**Gagasan:** HOPPER hanya punya 2 target `GOSUB` dan PAC-GAL 3, versus 31 di 3DTTT.
Pasti ada rutin percabangan lain yang terlewat.

**Cara uji:** cari target yang situs panggilannya sering diikuti tepat satu word di
rentang kode.

**Hasil:** `ARITH!` di 3DTTT keluar 96% — padahal itu rutin aritmetika, bukan
percabangan. Diskriminatornya terlalu longgar dengan alasan yang sama seperti (3).

## Akar masalah bersama (3) dan (4)

Uji "word jatuh di rentang alamat kode" punya tingkat positif palsu sangat tinggi:
di program 26 KB, sekitar 40% dari semua nilai word acak lolos. Filter itu tidak bisa
dipakai untuk apa pun.

**Diskriminator yang lebih kuat** akan menuntut target jatuh **tepat di batas
instruksi** yang sudah diketahui — tapi itu melingkar, karena batas instruksi yang
diketahui justru hasil penelusuran yang sedang ingin diperluas.

**Kesimpulan jujur:** memecahkan langit-langit jangkauan butuh **penelusuran dinamis**.

## 5 · "Penelusuran dinamis tidak bisa diotomatiskan" — SALAH

Saya sempat menyimpulkan bahwa penelusuran dinamis butuh DOSBox, dan karena build
terpasang tidak punya jalur skrip untuk debugger-nya, itu harus dikerjakan manual oleh
user. Saya bahkan menulis prosedur manual dan parser untuknya.

**Salah.** DOSBox tidak diperlukan sama sekali. `C:\Projects\DOS-Decompiler` —
ditunjuk user — punya `tools/comrun.py`, emulator 8086 tersendiri di Python dengan opsi
`--exec-map`. Jejaknya diperoleh dalam beberapa menit, tanpa campur tangan manual.

**Sebabnya salah:** saya memeriksa satu perkakas (DOSBox-X) secara mendalam dan
menyimpulkan tentang seluruh kelas masalah. Batas kemampuan satu alat bukan batas
kemampuan pendekatan.


## 6 · Menaikkan budget, memperpanjang umpan tombol, dan mengirim timer — semuanya nihil

User meminta jejak dinamis tidak berhenti karena budget instruksi habis. Empat tuas
diputar. **Tidak satu pun menaikkan cakupan.**

| tuas | percobaan | hasil |
|---|---|---|
| `--budget` 6–10× lipat | HOPPER 40M → 400M | **nol alamat baru** (2.800 vs 2.801) |
| `--keys` 10× lebih panjang | 3DTTT 22 → 224 tombol | **lebih buruk**: 1.768 vs 1.811 alamat kode |
| `--timer-isr 1c` | PAC-GAL | **tidak terkirim sama sekali** |
| gabungan semua jejak | ketiganya | +42 / +7 / +0 alamat → **cakupan 0% berubah** |

### Kenapa budget bukan hambatannya

HOPPER berjalan 400 juta instruksi dan membaca **satu** tombol dari 436. Ia tidak
menunggu papan ketik. Ia berputar di rutin runtime, dan menaikkan budget hanya
memperpanjang putaran yang sama.

### Kenapa dugaan timer salah

Ketiga program memang memasang vektor `INT 1Ch` (HOPPER @10243, 3DTTT @26353,
PAC-GAL @18554) — jadi dugaan bahwa mereka menunggu tick timer masuk akal. Tapi
jejaknya melaporkan:

```
timer interrupts delivered: 0, 1 skipped with interrupts disabled
```

PAC-GAL keluar di 88.834 instruksi dengan interupsi masih dimatikan (`cli`), jadi
tick tidak pernah sampai. **Timer bukan penghambatnya**, setidaknya untuk PAC-GAL.

### Kenapa umpan tombol lebih panjang bisa memperburuk

224 tombol membawa 3DTTT ke jalur berbeda dari 22 tombol, dan jalur itu ternyata
menyentuh lebih sedikit kode. Jejak dinamis mengukur **satu lintasan**, bukan
keseluruhan program — lintasan yang lebih panjang tidak otomatis lebih luas.

### Yang bisa disimpulkan

Langit-langit **56% / 46% / 53%** bukan artefak dari salah satu tuas ini. Menaikkannya
menuntut sesuatu yang berbeda jenisnya, bukan lebih banyak dari yang sama.

Dan sebelum mengejar itu: sisa region perlu **diklasifikasi** dulu — 27% byte printable
di 3DTTT, 38% di HOPPER. Sebagian dari "44% yang hilang" hampir pasti bukan kode.


## 7 · Langit-langit cakupan 56/46/53% — BUG DI PENGUKURAN SAYA SENDIRI

Ini kesalahan terbesar dalam pekerjaan ini, dan ia membiayai tiga iterasi penuh.

### Apa yang salah

Walk statis saya memakai situs far call sebagai **batas berhenti** — masuk akal untuk
memindai celah antar-panggilan. Tapi saya membiarkan aturan itu di dalam pengukur
cakupan, sehingga 5 byte tiap instruksi `lcall` **tidak pernah ditandai tercakup**.

Aritmetikanya langsung terbaca begitu diperiksa:

| | situs × 5 byte | "sisa" terukur | selisih |
|---|---|---|---|
| 3DTTT | 2.322 × 5 = 11.610 | 11.542 | −68 |
| PAC-GAL | 1.322 × 5 = 6.610 | 6.655 | +45 |
| HOPPER | 745 × 5 = 3.725 | 3.680 | −45 |

"44% kode yang hilang" itu adalah **instruksi panggilan itu sendiri**.

### Cakupan sebenarnya

| | dilaporkan | sebenarnya | sisa |
|---|---|---|---|
| 3DTTT | 56% | **99,4%** | 154 byte |
| PAC-GAL | 46% | **98,4%** | 195 byte |
| HOPPER | 53% | **99,9%** | 10 byte |

### Yang dibiayai kesalahan ini

Tiga iterasi mengejar jejak dinamis: penyelidikan debugger DOSBox-X, penemuan
`comrun.py`, enam kali menjalankan emulator, dan percobaan budget/tombol/timer.

Uji penentunya: jalankan pengukur **tanpa benih dinamis sama sekali**.

| | dengan jejak | tanpa jejak | sumbangan jejak |
|---|---|---|---|
| 3DTTT | 99,4% | 99,4% | **17 byte** |
| PAC-GAL | 98,4% | 98,4% | **0 byte** |
| HOPPER | 99,9% | 99,7% | **10 byte** |

Analisis statis sendirian sudah mencapai 98–99% sejak awal. Seluruh usaha penelusuran
dinamis mengejar hantu.

### Apa yang seharusnya menangkapnya lebih awal

Pelajaran `knowledge/11-unreached-code.md` dari proyek sumber tertulis jelas:
*"An unexplained percentage is a question, not a measurement."* Saya mengutipnya,
menulisnya ke dokumen, lalu tetap melaporkan 56% sebagai temuan selama tiga iterasi
tanpa menanyakan **byte yang mana**.

Yang akhirnya membongkarnya justru mengikuti nasihat itu: mengklasifikasi sisanya.
Kandidat "kode tak terjangkau" semuanya punya jumlah instruksi **sama persis** dengan
jumlah alur kendali — 4 dan 4, 34 dan 34. Tidak ada kode nyata berbentuk begitu. Itu
rentetan `lcall` murni, dan dari situ semuanya terurai.

**Yang bisa dibawa:** kalau sebuah angka tidak bergerak apa pun yang Anda coba,
curigai pengukurnya sebelum menyalahkan yang diukur.


## 8 · "HOPPER tidak punya tabel stub" — SALAH

Di iterasi #1 saya menyimpulkan HOPPER tidak memakai mekanisme stub `PRINT` bertipe,
karena penyaringan menghasilkan nilai `AL` tak masuk akal (185, 139, 232, …). Saya
menafsirkannya sebagai kecocokan kebetulan pada byte `E8`, dan menulis "tiga berkas,
tiga konvensi berbeda".

**Salah.** HOPPER punya grid stub 4×3 yang sama persis, di **22885–22940**:

```
22885  AL=4 AH=0   SINGLE ,        22905  AL=4 AH=1   SINGLE ;
22890  AL=8 AH=0   DOUBLE ,        22910  AL=8 AH=1   DOUBLE ;
22895  AL=2 AH=0   INTEGER ,       ...
22900  AL=3 AH=0   STRING ,        22940  AL=3 AH=2   STRING ganti baris
22945  <helper: pop [0x874]; lodsw cs:[si]>
```

**Sebabnya salah:** penyaringan saya memindai rentang alamat yang keliru, dan di
emitter saya bahkan menuliskan `stub=(0,0)` untuk HOPPER — jadi tabelnya tidak pernah
dicari di tempat yang benar. Nilai `AL` sampah itu memang kecocokan kebetulan, tapi
kesimpulan yang saya tarik darinya terlalu jauh.

**Dampaknya:** setelah diperbaiki, item `PRINT` HOPPER naik 30 → **66**, dan panggilan
tanpa nama turun 267 → **231**.

Yang tetap benar: hanya **36 dari 745** panggilan HOPPER lewat tabel stub, versus 930
dari 1.322 di PAC-GAL. HOPPER memang jauh lebih sedikit mencetak teks — konsisten dengan
game grafis yang menggambar lewat `DRAW`. Perbedaan itu nyata; yang salah adalah
menyimpulkan mekanismenya tidak ada.

**Yang bisa dibawa:** "penyaringan saya tidak menemukannya" bukan "benda itu tidak ada".
Sebelum menyimpulkan sebuah mekanisme absen, periksa dulu apakah pencariannya menengok
ke tempat yang benar.


## 9 · Kecocokan tanda tangan antar-biner sebagai "bukti kedua" — MELINGKAR

Saya sendiri yang menulis di prompt loop bahwa cara termurah menaikkan nama `__maybe`
adalah mencocokkan tanda tangannya ke HOPPER/PAC-GAL. **Itu tidak sah.**

Kecocokan tanda tangan hanya menyatakan *"rutin yang sama muncul di kedua biner"*. Ia
tidak mengatakan apa yang rutin itu kerjakan. Dan karena nama di biner saudara justru
diturunkan **dari** nama di 3DTTT lewat `tools/xfer.py`, memakainya balik sebagai bukti
untuk 3DTTT adalah melingkar — satu sumber bukti didandani jadi dua.

Tujuh nama sempat berdiri di atas bukti melingkar itu: `LET!`, `FACSTORE!`, `FACLOAD!`,
`ARITH!`, `MULDIV!`, `LOAD!`, `PRINT_BEGIN`. Jenis bukti `X` sudah **dihapus** dari
`tools/audit-names.py`.

### Penggantinya, yang sungguh independen

| jenis | isi | contoh |
|---|---|---|
| `F` | akumulator bersama tetap | `0xB4` dirujuk 49 kali oleh **29 gugus rutin runtime berbeda** → itu FAC |
| `T` | pemetaan ukuran→tipe | tabel stub menetapkan `AL=4 ⇒ SINGLE`, bebas dari rutin mana pun |
| `V` | peran variabel dari luar | `[0x616]` terbukti pemilih perangkat oleh rutin **lain** (`0x8641`) |

Ketujuh nama itu bertahan dengan bukti pengganti ini. Yang berubah bukan kesimpulannya,
melainkan alasannya — dan alasan yang salah tetap perlu diganti meski kesimpulannya kebetulan benar.

### Satu nama yang justru dibantah buktinya

`STRCMP` diperiksa lewat pola situs panggilan: **24 dari 30** situs diikuti `mov` —
hasilnya *disimpan*, bukan dijadikan syarat cabang. Rutin banding akan diikuti lompatan
bersyarat, seperti `SGNTEST` yang **16 dari 16** situsnya begitu.

Nama diturunkan jadi `STROP__maybe` — sengaja lebih kabur: operasi string, jenisnya
belum ditentukan.

### Dan satu yang naik

`SGNTEST` mendapat bukti kedua yang sah dari pola itu (16/16 diikuti cabang bersyarat)
dan **naik dari `__maybe` jadi diterima**.

**Yang bisa dibawa:** bukti kedua harus punya *asal* yang berbeda, bukan sekadar
*bentuk* yang berbeda. Menyalin kesimpulan ke berkas lain lalu membacanya kembali
bukan konfirmasi.


## 10 · `MULDIV!` salah — itu penjumlahan, bukan perkalian

Rutin `@31638` (3DTTT) dan `@9370` (HOPPER) saya namai `MULDIV!` di iterasi awal,
berdasarkan bahwa keduanya membongkar mantissa MBF dua operan.

**Salah.** Tubuhnya berlanjut:

```asm
or  ch, ch        ; eksponen operan-2 nol?
or  ah, ah        ; eksponen operan-1 nol?
cmp ch, ah        ; BANDINGKAN kedua eksponen
```

Membandingkan eksponen adalah langkah **penyelarasan penjumlahan** floating-point.
Perkalian *menjumlahkan* eksponen; ia tidak pernah membandingkannya.

Konfirmasi kedua datang dari entry point tetangganya. Region 31606–31679 ternyata
**satu rutin dengan banyak entry**, dan entry di 31617 melakukan:

```asm
mov ax, [di+2]
xor al, 0x80      ; balik bit tanda
jmp 31644         ; masuk ke tubuh yang SAMA
```

Negasi-lalu-tambah adalah **pengurangan**. Jadi `NEG!` yang saya beri juga tidak
lengkap — ia bukan negasi berdiri sendiri, melainkan entry pengurangan.

Koreksi: `MULDIV!` → `ADD!`, `NEG!__maybe` → `SUB!`. Berlaku di kedua biner.

**Yang bisa dibawa:** membongkar operan hanya memberitahu *tipe* datanya, bukan
*operasi*-nya. Operasinya ada di apa yang dilakukan sesudah pembongkaran — dan saya
berhenti membaca terlalu cepat.


## 11 · `STRCMP` diturunkan tanpa alasan yang sah — koreksi atas koreksi

Di iterasi #6 saya menurunkan `STRCMP` (3DTTT `@29176`) jadi `STROP__maybe`, dengan
alasan: **24 dari 30 situs panggilan diikuti `mov`**, jadi hasilnya disimpan bukan
dijadikan syarat cabang, dan "rutin banding akan diikuti lompatan bersyarat".

**Penalaran itu cacat.** Perbandingan string di BASIC mengembalikan nilai; nilai itu
wajar disimpan ke sementara sebelum diuji. `mov` sesudah panggilan menyimpan **hasil
perbandingan**, bukan bukti melawan perbandingan.

Yang menyelesaikannya: membaca tubuhnya sampai habis.

```asm
mov  di, [bx+2]    ; penunjuk string 1
mov  cx, [bx]      ; panjang string 1
xchg bx, ax
mov  si, [bx+2]    ; penunjuk string 2
cmp  cx, [bx]
jbe  ...
mov  cx, [bx]      ; ambil panjang MINIMUM
repe cmpsb         ; PERBANDINGAN BYTE-PER-BYTE
```

`repe cmpsb` adalah perbandingan, definisional. Struktur identik di **ketiga biner**
(3DTTT `@29176`, PAC-GAL `@12690`, HOPPER `@13066`) di posisi yang sama.

`STRCMP` dipulihkan dengan bukti S (`repe cmpsb` sesudah panjang minimum) + A (dua
deskriptor string sebagai operan).

**Yang bisa dibawa:** menurunkan sebuah nama juga butuh bukti, bukan hanya keraguan.
Saya menurunkan ini atas dasar pola situs panggilan yang saya salah tafsirkan, padahal
tubuh rutinnya — yang belum saya baca sampai habis — menjawabnya langsung. Ini pola
yang sama dengan sec. 10: **berhenti membaca terlalu cepat.**

## 12. Penelusur "pemilik tubuh" di `variants.py` melampaui batas rutin

`tools/variants.py` menandai byte milik tiap rutin bernama dengan menelusuri linier
sampai 80 instruksi dari titik masuknya. Batas 80 itu sewenang-wenang: kalau sebuah
rutin berakhir dengan lompatan bersyarat (bukan `ret`), penelusuran terus berjalan
melewati ujungnya dan mengklaim byte milik rutin **tetangga**.

Akibatnya alat itu melaporkan `@9676` dan `@9679` di HOPPER "jatuh ke tubuh STR2OP".
Sebenarnya keduanya rutin perkalian/pembagian sendiri — tubuhnya berisi `xor al,cl`
(gabung tanda kedua operan) dan `sub ah,0x81` (bias eksponen MBF), yang tak satu pun
milik penanganan string. STR2OP kebetulan bertetangga.

**Yang bisa dibawa:** keluaran alat pencari kandidat adalah *petunjuk*, bukan bukti.
Sepuluh laporan `variants.py` lain terbukti benar setelah tubuhnya dibaca sendiri;
dua ini tidak. Yang membedakan bukan alatnya melainkan pembacaan manual sesudahnya.
Jangan sekali-kali menaikkan keluaran alat langsung menjadi nama.

## 13. Kekhawatiran bahwa @9364 membatalkan koreksi sec. 10 — tidak terbukti

Waktu `variants.py` menunjukkan `@9364` masuk ke tubuh `ADD!` sementara prolog di
sekitarnya me-XOR tanda, saya menduga koreksi sec. 10 (`MULDIV!` -> `ADD!`) salah lagi.
Membaca region 9338-9380 sampai habis menyelesaikannya ke arah sebaliknya:

```
9343  call 0x3397
9346  mov  di, 0xB2      ; di = FAC
9349  call 0x33b7
9352  mov  ax, [di+2]
9355  xor  al, 0x80      ; <-- balik tanda operan
9357  jmp  0x24a0        ; masuk ke jalur penjumlahan
...
9364  call 0x3397        ; entry ADD!: sama persis TANPA xor
9367  mov  di, 0xB2
9370  call 0x33b7
9373  mov  ax, [di+2]
9376  mov  bx, [di+1]    ; kedua jalur bertemu di sini
```

Kedua jalur identik kecuali satu instruksi `xor al,0x80`. Pengurangan memang
dilaksanakan sebagai penjumlahan dengan tanda dibalik — persis yang dinyatakan
sec. 10. Jadi ini **menguatkan** `ADD!`/`SUB!`, bukan membantahnya.

**Yang bisa dibawa:** kecurigaan terhadap nama lama tetap harus diuji, dan hasil
ujinya kadang membenarkan nama itu. Mencatat dugaan yang gugur sama pentingnya
dengan mencatat koreksi.

## 14. Dict literal Python menelan kunci ganda — satu nama hilang tanpa jejak

Setiap iterasi menyisipkan nama baru ke depan `named={...}` di `emit2.py`. Kalau
alamat yang disisipkan **sudah ada** di sana, Python tidak mengeluh: dict literal
dengan kunci berulang hanya memakai nilai terakhir. Karena penyisipan saya di depan,
nama lama yang berada di belakang selalu menang.

Itu terjadi pada `@9359` di HOPPER. Iterasi #6 menamainya `ADD!_FAC`; nama lama
`FACOP!` menimpanya diam-diam. Akibatnya:

- iterasi #6 sebenarnya menghasilkan **10** nama efektif, bukan 11 seperti yang saya laporkan;
- alamat itu memang sudah terhitung "bernama", jadi angka cakupan tidak terpengaruh —
  hanya jumlah nama baru yang salah.

**Perbaikan:** `emit2.py` sekarang membaca dirinya sendiri dan berhenti dengan
`KUNCI GANDA di <biner>: [...]` sebelum mengerjakan apa pun. Penjaganya diuji dengan
menyisipkan duplikat buatan ke dict pertama dan memastikan proses benar-benar berhenti
— uji pertama saya sendiri gagal karena memakai alamat yang bukan milik dict pertama,
jadi lolos tanpa arti. Penjaga yang tak pernah dilihat memicu tidak membuktikan apa pun.

**Yang bisa dibawa:** tooling yang gagal secara diam-diam lebih berbahaya daripada
tooling yang salah dengan berisik. Angka yang saya laporkan tiap iterasi berasal dari
alat yang sama yang menyimpan datanya — kalau alat itu bisa kehilangan masukan tanpa
bersuara, laporannya tak bisa dipercaya sampai jalur diamnya ditutup.

## 15. `STR2OP` dan `FACOP!` keduanya salah — bukti "dua jenis" yang sebenarnya satu

Menelusuri kunci ganda di sec. 14 membuka dua nama lama yang keliru.

**`STR2OP` @9682 sebenarnya tubuh `MUL!`.** Bukti lamanya berbunyi "baca deskriptor
string dari si DAN di, uji byte tinggi keduanya". Yang benar-benar ada di sana:

```
9685  lodsw                 ; muat operan MBF, bukan deskriptor string
9693  mov  cx, [di+2]       ; byte eksponen operan kedua
9696  or   ch, ch           ; uji eksponen NOL, bukan "byte tinggi"
9704  xor  al, cl           ; gabungkan tanda kedua operan
9706  sub  ah, 0x81         ; bias eksponen MBF
9762  mul  di               ; ... dan dua mul lagi di 9770, 9781
```

**`FACOP!` @9359 dan @9671 tidak pernah lolos dua-bukti.** Catatannya:
`S = "memuat FAC 0xB2"`, `F = "0xB2 dirujuk 48 kali"`. Kedua baris itu **pengamatan
yang sama** ditulis dua kali — bahwa alamat 0xB2 adalah FAC. Tidak ada jenis kedua
yang mandiri. Nama itu lolos audit hanya karena label jenisnya berbeda, bukan karena
buktinya berbeda. Keduanya kini diperbaiki dengan menelusuri sasaran lompatannya:
`@9359` masuk ke `ADD!` @9370, `@9671` masuk ke `MUL!` @9682.

**Yang bisa dibawa:** audit dua-bukti memeriksa **label** jenis, bukan isinya. Nama
yang samar seperti `FACOP!` ("operasi FAC") justru paling mudah lolos, karena hampir
semua pengamatan bisa dipaksa cocok dengannya. Nama yang tepat lebih mudah dibantah —
dan itu kelebihannya, bukan kekurangannya.

## 16. `STROUT` sebenarnya `LEN` — rutin rujukannya sendiri salah dibaca

`STROUT` @33452 di 3DTTT bertumpu pada anggapan bahwa `0x939E` adalah loop pemancar
karakter. Tubuh @33452 sendiri hanya empat instruksi:

```
33452  push word ptr [bx]     ; word PANJANG dari deskriptor
33454  call 0x939E
33457  pop  bx                ; word yang sama kembali sebagai hasil
33458  retf
```

Membaca `0x939E` sampai habis menunjukkan ia pengelola heap string, bukan pencetak:
`xchg [0x83A], ax` menukar kepala daftar-bebas, `mov [bx+2], 0xFFFF` menulis sentinel,
dan cabang di 37814 memecah blok lalu menyimpan sisanya. Yang menentukan: **`CONCAT$`
melompat ke `0x939E` tepat setelah `rep movsw` selesai menyalin** — tak ada yang
mencetak sesudah menggabungkan string; yang dilakukan adalah melepas sementaranya.

Situs panggilan @33452 menutup perkaranya:

```
4889  lcall @33452
4894  sub  bx, 0x1C      ; 28 - hasil
4897  neg  bx            ; memusatkan teks
...
12590 lcall @33452
12595 or   bx, bx
12597 jne  ...           ; IF LEN(s$) = 0 THEN
```

Hasilnya selalu dipakai sebagai bilangan. Itu `LEN`. Entry tetangganya @33459, yang
menolak panjang nol lalu mengambil karakter pertama dan menolkan byte tinggi, adalah
`ASC`.

**Yang bisa dibawa:** `STROUT` lolos audit dengan bukti berjenis `V` — "peran rutin
lain yang sudah terbukti". Tetapi rutin rujukan itu **tidak pernah saya baca sendiri**;
perannya saya simpulkan dari rutin ketiga. Bukti `V` hanya sekuat pembacaan rutin yang
dirujuknya. Kalau rantainya tak pernah menyentuh disassembly, ia bukan bukti melainkan
asumsi yang diwariskan.

## 17. `@17031` hampir bernama `SCREEN` — layanan FCB DOS yang membatalkannya

Rutin HOPPER `@17031` mengubah argumennya menjadi bitmask (`mov cl,bl; mov bl,1;
shl bl,cl`) lalu menyimpannya di `[0x6A4]`. Pembacanya membandingkan slot itu dengan
2, 4, dan 8, dan sekali dengan `test byte ptr [0x6A4], ah`.

Saya menduga itu **mode layar**: HOPPER memang mencetak "Color/graphics adaptor not
available" dan "Switching to Color/Graphics Adaptor", dan `SCREEN 0/1/2` yang diubah
jadi bit menghasilkan 1/2/4 — cocok dengan angka yang terlihat.

Membaca region pembacanya sampai habis membatalkannya:

```
27794  rep movsb            ; rakit nama FCB 12 byte dari 0x658
27800  cmp byte ptr [0x6A4], 8
27813  cmp byte ptr [0x6A4], 2
27823  mov ah, 0x13
27825  int 0x21             ; DOS 13h = hapus berkas (FCB)
27827  mov ah, 0x16         ; DOS 16h = buat berkas (FCB)
```

`[0x6A4]` adalah **mode berkas**, dan 1/2/4/8 persis INPUT/OUTPUT/RANDOM/APPEND milik
BASIC. Situs panggilan yang memuat `xor bx,bx` berarti mode 1 = INPUT — dan HOPPER
memang membaca `hopper.SCO`.

**Yang bisa dibawa:** angka yang cocok bukan bukti kalau sumber kecocokannya tidak
diperiksa. 1/2/4/8 muat untuk mode layar maupun mode berkas; yang membedakan hanya
`int 0x21`, dan itu baru terlihat setelah membaca 80 byte lebih jauh. Ini penerapan
langsung §16: bukti jenis `V` menuntut region rujukannya benar-benar dibongkar, bukan
dikenali sekilas dari satu baris.

## 18. Argumen sebaris tak bisa dideteksi dari situs panggilan

Setelah menemukan `SCALE2!` @29924 mengambil satu byte dari aliran instruksi
pemanggilnya, saya menulis pemindai untuk mencari rutin serupa. Idenya: kalau byte
sesudah `lcall` 5-byte adalah data, disassembly mulai `s+5` mestinya terlihat rusak
dan mulai `s+6` terlihat sehat.

Pemindai itu mengembalikan **nol hasil di ketiga biner** — termasuk gagal menemukan
`@29924` sendiri, yang sudah terbukti berargumen sebaris.

Sebabnya sederhana: satu byte nyasar hampir selalu menyatu menjadi instruksi yang
tetap masuk akal. Byte `0x04` menjadi `add al, imm8` yang menelan byte berikutnya,
dan sisa aliran tetap terdisassembly bersih. Tidak ada sinyal yang bisa dibedakan.

**Yang berhasil** adalah membaca TUBUH rutinnya, karena polanya tak punya tafsir lain:

```
13570  pop  si
13571  pop  ds          ; ds:si = alamat kembali jauh
13573  lodsb            ; ambil byte sebaris
...
13588  push ds
13589  push si          ; dorong balik alamat yang sudah maju
```

Versi tubuh menemukan enam rutin, dan **tervalidasi karena menemukan kembali
`ON_GOSUB` dan `INPUT`** — dua rutin yang sudah lebih dulu diketahui membawa data
sebaris lewat jalur bukti yang sama sekali berbeda.

**Yang bisa dibawa:** ketika sebuah pemindai mengembalikan nol, jangan langsung
menyimpulkan fenomenanya langka — uji dulu pada kasus yang sudah pasti. Kalau
pemindai gagal menemukan contoh yang sudah terbukti, yang rusak adalah pemindainya.
Alat yang berhasil menemukan kembali temuan lama adalah alat yang layak dipercaya.

## 19. `SPC` dan `TAB` HOPPER dikenali tapi sengaja tidak dinamai

Dua entry HOPPER, `@20039` dan `@20073`, berbagi satu gelung yang memancarkan spasi
(`mov al, 0x20` diulang `cx` kali) dan satu pembantu di `0x4E8E` yang mengambil
argumennya modulo lebar layar. Perbedaan keduanya **hanya satu instruksi**:

```
20039  mov ax, bx           ; @20039
20042  call 0x4E8E
...
20073  mov ax, bx           ; @20073
20076  dec ax               ; <-- satu-satunya beda
20077  call 0x4E8E
```

Pasangan yang berbeda hanya pada penyesuaian 1-berbasis, berbagi gelung pemancar
spasi, dan mengambil modulo lebar layar — itu `SPC` dan `TAB`. Sampai di situ saya
yakin.

Yang **tidak** bisa saya pastikan adalah mana yang mana. Kalau pembantu `0x4324` yang
dipanggil sesudahnya mengurangkan kolom kini, maka keduanya sama-sama "pindah ke
kolom" dan yang ber-`dec` adalah `TAB`. Kalau tidak, yang tanpa `dec` memancarkan
cacah mutlak dan itulah `SPC`. Membedakannya menuntut membongkar `0x4324` dan rantai
kolomnya, dan menebak berarti berpeluang 50% memasang kedua nama TERBALIK — kesalahan
yang lebih buruk daripada tidak menamai, karena nama yang salah terlihat sama
meyakinkannya dengan yang benar.

**Yang bisa dibawa:** penerapan langsung §17. Mengenali sebuah *pasangan* tidak sama
dengan bisa mengurutkannya. Ketika bukti hanya cukup untuk yang pertama, yang jujur
adalah mencatat pasangannya dan berhenti.

## 20. Pendeteksi argumen sebaris melewatkan sepertiga kasusnya

Versi tubuh dari `tools/inline.py` (sec. 18) mencari pola `pop <reg>; pop ds` diikuti
`lodsb`. Pola itu benar — tetapi hanya salah satu dari dua bentuk yang dipakai runtime.
Bentuk kedua memanen alamat kembali ke **`es:di`** dan membacanya dengan
`mov al, es:[di]`:

```
21832  pop  di
21833  pop  es              ; es:di = alamat kembali jauh
21834  mov  al, es:[di]     ; ambil byte sebaris
21837  inc  di
21838  mov  [0x6B8], es     ; simpan alamat yang sudah maju
21842  mov  [0x6B6], di
```

Alat itu melaporkan enam rutin; sesudah diperluas ke bentuk `es:di` ia melaporkan
sembilan. Tiga yang terlewat termasuk `STKPUSH` @36119 di 3DTTT — rutin yang **sudah
bernama sejak lama** dan memang diketahui membawa data sebaris.

**Yang bisa dibawa:** ini kebalikan dari sec. 18. Di sana alat mengembalikan nol dan
kegagalannya kentara. Di sini alat mengembalikan hasil yang masuk akal, dan justru
itulah bahayanya — enam temuan terasa seperti jawaban lengkap. Yang membongkarnya
adalah menemukan kasus ketujuh **dengan tangan**, lalu bertanya kenapa alat
melewatkannya. Uji regresi yang tepat untuk alat pencari bukan "apakah ia menemukan
sesuatu" melainkan "apakah ia menemukan kembali semua yang sudah saya ketahui".

## 21. Menambah anggaran, bukan mengukur — dan salah membaca "last inside"

HOPPER berhenti pada teks `INITIALIZING...`. Saya menaikkan anggaran instruksi dari
40 juta ke 150 juta, lalu ke 200 juta, lalu ke 600 juta. Tidak satu pun berhasil, dan
percobaan terakhir bahkan kena timeout sehingga tak menghasilkan apa-apa.

Sepanjang itu saya memakai baris `last inside` dari comrun sebagai bukti:

```
last inside: 0x4302 -> 0x4303 -> 0x4307 -> 0x4309 -> 0x430f -> 0x4311 -> 0x42fd -> 0x4356
```

dan menyimpulkan "ia berputar di jalur keluaran perangkat". Itu keliru dua kali. Baris
itu adalah **delapan instruksi terakhir sebelum anggaran habis** — ekor eksekusi, bukan
gelung. Dan menyimpulkan "berputar" dari delapan alamat berurutan sama sekali tak
berdasar; instruksi apa pun yang sedang dieksekusi saat anggaran habis akan muncul di
sana.

Yang menyelesaikannya adalah **mengukur**. `tools/hotspot.py` menghitung eksekusi per
alamat, dan satu jalan 8 juta instruksi menjawab semuanya:

- region terpanas seluruhnya di atas 7863, artinya nol pernyataan BASIC -- keliru juga,
  karena setelah alamat kode pengguna ikut dilaporkan, terlihat sebuah gelung 233
  iterasi di 809-840;
- badan gelungnya: `READ` sebuah nilai, dua `LOAD!`, lalu `mov ds,[0x98]` diikuti
  `mov byte ptr [bx], al` -- **`POKE` ke segmen yang disetel `DEF SEG`**;
- 233 iterasi, sekitar 34.000 instruksi per iterasi.

Program itu **tidak macet sama sekali**. Ia sedang menyuntikkan 228 byte kode mesin
dari pernyataan `DATA` -- persis yang diklaim `HOPPER/DATA-BLOCKS.md` -- dan `READ`
milik BASCOM memindai ulang daftar `DATA` dari awal pada setiap panggilan, sehingga
biayanya kuadratik. Lambat, tetapi maju.

Hasil sampingannya: rutin yang memakan waktu itu, `@19921`, ternyata `READ!` yang belum
bernama, beserta tiga saudaranya.

**Yang bisa dibawa:** naluri "tambah anggaran" adalah cara menghindari pertanyaan.
Pertanyaannya bukan "berapa lama ia butuh" melainkan "sedang apa dia", dan itu bisa
diukur kapan saja dengan biaya satu jalan pendek. Saya membakar empat percobaan panjang
sebelum menulis pencacah tiga baris yang menjawabnya sekali jalan.

---

## 22. Tabel sprite SPACEWAR — dua salah baca beruntun, lalu terpecahkan

Ditulis 10 Agustus 2026. **Bagian ini pernah berisi kesimpulan yang salah selama
kurang lebih satu jam**, dan versi itu ikut dikirim ke port webnya. Riwayatnya
ditulis lengkap di sini karena kesalahannya lebih berguna daripada hasilnya.

### Babak 1 — klaim asli

`SPACEWAR/ARCHITECTURE.md` §5 menyebut daerah `0x1860`–`0x2026` sebagai tabel
sprite, 16 entri, strid 128, "64 bita terpakai", dan menyimpulkan itu **tabel
rotasi 16 sudut kapal**. Kesimpulan itu dipakai sebagai dasar rancangan port
webnya, yang memutar kapalnya dalam 16 langkah.

### Babak 2 — "koreksi" saya yang juga salah

Saya mengukur isi daerah itu dan menemukan pola yang tampak meyakinkan: bita
pembuka entri 4–15 identik, popcount dua populasi (48–95 lawan 212–223), simetri
empat arah, dan pasangan separuh yang bertukar antara entri *k* dan 15−*k*. Dari
situ saya simpulkan tafsir "tabel rotasi" harus dicabut, dan saya kirim
kesimpulan itu ke lima berkas.

**Seluruh pengukuran itu diambil dari bita yang salah.** Dua kesalahan menumpuk,
dan dua-duanya diam:

1. `spacewar.asm` memakai offset **citra**. Berkas `.EXE` punya **header 512
   bita** di depannya, jadi `offset_berkas = offset_asm + 0x200`. Saya membaca
   `0x1860` sebagai offset berkas.
2. Basisnya juga bukan `0x1860`. Rutin penggambarnya menyebut **`0x1840`** —
   selisih 32 bita, cukup untuk menggeser tiap entri seperempat baris.

Salah satu saja sudah cukup membuat hasilnya jadi bubur. Keduanya sekaligus
membuatnya bubur **yang berpola** — dan pola itulah yang saya ukur dengan tekun
lalu laporkan sebagai temuan.

### Babak 3 — bertanya siapa yang membacanya

Yang memecahkannya bukan pengukuran tambahan atas datanya, melainkan satu
pertanyaan yang tidak pernah ditanyakan siapa pun selama 18 iterasi dekompilasi:
**rutin mana yang membaca daerah ini?**

`sub_4792`, offset citra 18322. Ia menjawab seluruh formatnya sekaligus:

```asm
18326  and  ax, 0xf          ; indeks dipotong 0..15      -> 16 entri
18333  shl  si, 7            ; indeks * 128               -> strid 128
18335  add  si, 0x1840       ; basis tabel                -> 0x1840, bukan 0x1860
18361  mov  cx, 0x20         ; 32 putaran                 -> 32 baris
18374  lodsw / xchg al, ah   ; TIAP PASANGAN BITA DITUKAR
18377  mov  es:[di], ax      ; ...ditulis; dua kali       -> 4 bita/baris
18388  add  di, 0x1ffe       ; maju satu baris pindai
18390  cmp  di, 0x4000       ; ...bank mode 6 berselang-seling
18394  sub  di, 0x3fb0       ; bungkus: 0x4000-0x3fb0 = 80 = satu baris pindai
```

Jadi tiap entri **32 × 32 piksel**, dan **seluruh 128 bita terpakai** — bukan 64
seperti yang tertulis di `ARCHITECTURE.md`. Dugaan "sisa 64 bita menyimpan mask
atau varian pre-shifted" tidak perlu diuji: sisa itu tidak ada.

Detail `add di, 0x1ffe` juga menjelaskan kenapa hipotesis *interleave* gagal
sebagai transformasi data. Datanya **tersimpan dalam urutan tampil**; yang
menangani selang-seling bank mode 6 adalah **alamatnya**, bukan susunannya.

### Hasilnya

Didekode dengan aturan itu, entri 4:

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

Sebuah **lingkaran 32 × 32** dengan satu tanda kecil di dalamnya yang berpindah
tempat dari entri ke entri. Enam belas bingkai sebuah benda bundar yang berputar.

Jadi klaim asli §5 **lebih benar daripada koreksi saya**: ia memang tabel rotasi
16 langkah. Yang salah cuma *apa* yang berputar — bukan kapal, melainkan benda
bundar, hampir pasti **PLANET** yang disebut teks bantuannya sendiri
(`Touching the PLANET will drain your SHIELDS`).

Dekodernya disimpan sebagai [`tools/spritedec.py`](tools/spritedec.py), lengkap
dengan rujukan ke tiap baris `sub_4792` yang jadi dasar tiap tetapannya.

### Lanjutannya, jam yang sama — kapalnya ketemu

Cara yang sama diterapkan ke basis-basis lain, dan semuanya jatuh dalam satu
langkah. Pemanggil di offset citra 17990/17999 memilih basis per pemain, dan
`sub_45CA` menyalinnya:

| tabel | basis | n | strid | ukuran |
|---|--:|--:|--:|---|
| kapal pemain kiri | `0x1340` | 16 | 32 | 16 × 16 |
| kapal pemain kanan | `0x1540` | 16 | 32 | 16 × 16 |
| kecil, sepasang | `0x1740` / `0x17C0` | 8 | 16 | 16 × 8 |
| font angka | `0x22A0` | 12 | 16 | 16 × 8 |

`sub_45CA` menggambar dengan **XOR** dan **menggeser saat menggambar**
(`and cl,7` lalu `shr ax,cl`, tiga bita keluaran per baris). Itu menutup dugaan
lama "sisa slot menyimpan varian pre-shifted" secara telak: pergeserannya
dikerjakan CPU tiap bingkai, tidak pernah disimpan.

Dan sudutnya: `add bl,8 | and bx,0xf0 | shl bx,1` — dibulatkan ke perenambelasan
terdekat. **Jadi "16 sudut" memang benar sejak awal.** Buktinya cuma ada di tempat
yang tidak pernah dilihat siapa pun — di kode pemetaan sudutnya, bukan di jumlah
entri tabel.

Keadaan pemain ikut jatuh: X di `0xd5c`, Y di `0xd7c`, sudut di `0xe7c`, strid
`0x10` antar-pemain.

**Yang bisa dibawa, bagian kedua:**

> Klaim asli benar. "Koreksi" saya salah. Dan yang membuktikan klaim aslinya benar
> bukan data yang sama yang kami berdua tatap, melainkan **empat instruksi di
> tempat lain sama sekali**.
>
> Dua-duanya — klaim asli maupun bantahan saya — sama-sama menebak dari bentuk
> data. Yang satu kebetulan benar. Menebak yang kebetulan benar dan menebak yang
> kebetulan salah punya nilai bukti yang sama: nol.

**Yang bisa dibawa, dan ini yang mahal:**

> Saya mengukur dengan tekun, mendapat pola yang rapi, dan melaporkannya —
> tanpa pernah **memeriksa kerangka bacanya terhadap satu penanda yang diketahui**.
> Satu baris (`b[0x200:] == b'SORRY !...'`, dan `.asm` mencatatnya di offset 0)
> akan menjatuhkannya dalam sedetik.
>
> Pola yang rapi bukan bukti bahwa kerangkanya benar. Data biner apa pun yang
> dibaca dengan strid tetap akan **selalu** menghasilkan keteraturan, karena
> strid-nya sendiri yang menciptakannya. Yang membedakan temuan dari artefak
> adalah penanda dari luar — dan menemukan **kode yang membaca data itu** adalah
> penanda yang paling kuat yang bisa didapat.

---

## 23. Cakupan kode SPACEWAR 99% — angkanya terlalu tinggi, dan sebabnya satu rutin

Ditulis 10 Agustus 2026, saat porting web.

`sub_4732` (offset citra 18226, **37 situs panggilan**) mencetak string dengan cara
yang sudah lama hilang: ia **mengambil alamat kembalinya sendiri dari tumpukan**,
membaca bita di sana sebagai teks, lalu mendorong balik alamat yang sudah maju.
Stringnya ditulis **di dalam aliran kode**, tepat sesudah `call`-nya.

Akibatnya, di segmen kode SPACEWAR **data dan kode berselang-seling**. Penelusur
rekursif tidak tahu itu, jadi ia membongkar tiap string sebagai instruksi — dan
menghitungnya sebagai kode yang berhasil dicakup.

Deretan yang selama ini tampak aneh di disassembly ternyata itu:

| yang terbaca | sebenarnya |
|---|---|
| `adc ax, 0x2020` berulang belasan kali | spasi di `"   G A M E    K E Y S  "` |
| `sbb ax, 0x1d1d` berulang | glif bingkai `0x1D` berderet |
| lima "handler dispatch berukuran tepat 8 instruksi" | `db 0x0c ×7, 0x00` |

Ukuran lain dari kekacauan yang sama: **50 dari 492 label** `sub_`/`loc_` di
disassembly jatuh **di dalam** salah satu string sebaris. Label-label itu hantu —
alamat yang tidak pernah jadi sasaran kendali apa pun.

Yang terakhir di tabel itu paling mahal: ia melahirkan hipotesis yang bertahan
sampai akhir dekompilasi — *"lima handler untuk lima aksi di teks bantuan"* — karena 5 dan 5
cocok. Kelimanya sebenarnya menggambar kotak menu di X = 200, 290, 380, 470, 560,
berjarak tepat 90 piksel di baris paling bawah layar.

**Sudah diukur, 10 Agustus 2026.** Rentang tiap string dihitung dari bita sesudah
`call`-nya sampai penanda nol, inklusif:

| | |
|---|--:|
| Segmen kode | 10.928 – 22.016 = **11.088 bita** |
| Situs panggilan `sub_4732` | 37 |
| String terpendek / terpanjang / rata-rata | 4 / 814 / 75,9 bita |
| **Total bita string sebaris** | **2.808** |
| Data yang `.asm` sendiri sudah akui | 93 |
| **Bukan instruksi sama sekali** | **2.901 bita = 26,2%** |

Ketiga puluh tujuhnya diperiksa satu per satu dan semuanya sah — yang rasio
karakter tercetaknya rendah bukan pemindaian yang kebablasan melainkan **deretan
glif bingkai** (`0x08` mendatar, `0x01`–`0x07`/`0x09`/`0x13` sudut dan sambungan),
yang memang karakter di font ini. Dua yang terpanjang 100% tercetak: blok
`GAME INSTRUCTIONS` (814 bita) dan pemberitahuan `USER-SUPPORTED` (728 bita).

**Yang bisa dan tidak bisa dikatakan dari angka ini.** Bisa: klaim "cakupan region
kode 99%" menghitung **2.901 bita yang bukan instruksi** sebagai kode yang berhasil
dibongkar — lebih dari seperempat segmennya. Tidak bisa: berapa persen *instruksi
yang sebenarnya* berhasil dipulihkan. Angka itu tidak bisa diturunkan dari yang
ada; ia butuh pembongkaran ulang yang tahu batas tiap string.

Hasil sampingan panen ini: bilah menunya terbaca utuh sebagai satu string —

```
  \x1f EXIT \x1f  \x1f PLAY \x1f  \x1fROBOT\x1fL  \x1fROBOT\x1fR  \x1fPLANET\x1f  GRAVITY   PAUSE
```

— lengkap dengan penanda **L** dan **R** yang membedakan kedua tombol `ROBOT`,
sesuatu yang tidak terlihat waktu string-string itu dipanen terpisah.

**Yang bisa dibawa:** angka cakupan mengukur *"berapa banyak bita yang berhasil
dibongkar jadi instruksi yang sah"*, bukan *"berapa banyak bita yang memang
instruksi"*. Untuk program yang menyelipkan data ke aliran kodenya, kedua hal itu
berbeda — dan yang pertama akan selalu terlihat lebih bagus.

> Dua kecocokan angka melahirkan dua hipotesis yang salah di berkas yang sama:
> "16 entri = 16 sudut kapal" (§22) dan "5 handler = 5 aksi" (di sini). Keduanya
> kebetulan. Keduanya bertahan lama justru karena terdengar masuk akal — dan yang
> terdengar masuk akal jarang diperiksa.

### Berapa jauh akibatnya, diukur

Sesudah batas tiap string diketahui, semuanya bisa dihitung:

| | |
|---|--:|
| Segmen kode | 11.088 bita |
| String sebaris (37 buah) + data terakui | 2.971 bita = **26,8%** |
| Wilayah kode **sejati** | 8.117 bita |
| Dari wilayah sejati itu, tertutup instruksi | **8.117 = 100,0%** |

Jadi angka lamanya salah **di kedua arah sekaligus**: ia melebihkan apa yang
dihitung sebagai kode (seperempat segmen bukan instruksi) sekaligus **meremehkan**
pemulihan instruksinya — yang sebenarnya **100%**, bukan 99%.

Kerusakan terbesarnya bukan di angka itu melainkan di **ukuran rutin**:

| rutin | dikira | ternyata |
|---|---|---|
| `sub_3582` | "526 instruksi, terbesar dalam program" | 81% isinya string; ~203 bita instruksi. Penggambar layar `GAME KEYS` |
| `sub_3999` | "488 instruksi" | 97% isinya string; ~47 bita instruksi. Pencetak `GAME INSTRUCTIONS` |

Dari sana lahir kesimpulan yang bertahan sampai akhir: *"tiga rutin render besar
memakan hampir sepertiga kode program"*. Ketiganya bukan renderer, dan tidak besar.

**Yang bisa dibawa:** metrik ukuran rutin mewarisi kesalahan pembongkarnya tanpa
menunjukkan tandanya. Sebuah rutin yang "besar" karena menelan string terlihat
persis sama dengan rutin yang besar karena rumit — dan yang pertama justru
mengundang perhatian yang tidak dibutuhkannya.
