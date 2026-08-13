# Verifikasi: menjalankan yang selama ini hanya dibaca

Seluruh pekerjaan penamaan di proyek ini bersifat **statis**. Saya membaca disassembly
dan menuntut dua bukti independen sebelum memasang nama. Disiplin itu menangkap banyak
kesalahan — dua puluh di antaranya tercatat di [NEGATIVE-RESULTS.md](NEGATIVE-RESULTS.md)
— tetapi ia punya satu kelemahan yang tak bisa diperbaiki dari dalam:

> Pembacaan statis bisa **konsisten** dan tetap **salah**, karena tak ada pembanding
> di luar dirinya sendiri. Ia bisa menghitung apa yang gagal dijelaskannya; ia tidak
> bisa memberi tahu apakah yang berhasil dijelaskannya itu benar.

Angka cakupan 99% berarti "99% panggilan runtime sudah dikenali" — **bukan** "99%
programnya terbukti berjalan seperti yang saya klaim".

Dokumen ini menutup celah itu.

## Cara

`comrun.py` dari `C:\Projects\DOS-Decompiler` adalah emulator 8086 Python yang
menjalankan EXE-nya sungguhan dan mencatat setiap alamat yang **benar-benar
dieksekusi**. Berkas peta itu memberi tiga ukuran yang mustahil dihasilkan pembacaan
statis:

1. berapa rutin bernama yang benar-benar terpanggil saat program berjalan;
2. berapa persen situs panggilan yang **dijalankan** sudah punya nama;
3. adakah alamat kode pengguna yang dieksekusi tetapi tak pernah tersentuh
   penelusuran statis.

`tools/referee.py` melakukan perbandingannya.

## Hasil jejak awal

Ketiga program dijalankan 40 juta instruksi dari titik masuk, tanpa masukan tombol.

| biner | alamat dieksekusi | situs panggilan dijalankan | **sudah bernama** | nama teruji berjalan |
|---|---|---|---|---|
| 3DTTT | 1.695 | 110 | **93,6%** | 20 dari 54 |
| HOPPER | 2.072 | 67 | **91,0%** | 27 dari 65 |
| PAC-GAL | 666 | 7 | 57,1% | 3 dari 38 |

(PAC-GAL macet di gelung tunggu papan ketik — lihat bagian tersendiri di bawah.)

Angka PAC-GAL yang rendah **bukan** hasil buruk melainkan sampel kecil: ia berhenti
setelah tujuh panggilan karena menunggu tombol.

## Jejak lebih dalam, dengan masukan tombol

Menyuapkan tombol membawa 3DTTT melewati menu pembuka:

| jejak 3DTTT | situs panggilan dijalankan | **sudah bernama** | nama teruji |
|---|---|---|---|
| tanpa tombol, 40 juta instruksi | 110 | 93,6% | 20 |
| dengan tombol, 120 juta instruksi | **122** | **94,3%** | **26** |

Yang bertambah terbukti: `ON_GOSUB` — rutin tabel-lompat berargumen sebaris dari
iterasi #11 — lalu `CINT`, `FACNORM`, `INPUT`, `LEFT$`, dan `VAL`.

Yang **tidak** berubah justru ikut memberi tahu sesuatu: ketujuh target tanpa nama yang
dijalankan tetap tujuh alamat yang sama persis. Daftar itu stabil, jadi ia memang
kandidat kejar yang nyata, bukan artefak satu jejak.

## Konfirmasi yang paling berarti

**`INKEY$` terbukti dari perilaku, bukan dari struktur.** Baik HOPPER maupun PAC-GAL
berhenti karena kehabisan anggaran instruksi di titik yang sama persis: gelung jajak
papan ketik. Alamat tempat HOPPER berhenti:

```
0x2b97 -> 0x2b9c -> 0x2b9e -> 0x2ba3 -> 0x2ba5 -> 0x2ba6 -> 0x2bb0 -> 0x2bb3
                                                    ^ mov ah,1 / int 16h
```

`0x2b97` dan `0x2bb0` adalah **tepat dua rutin yang dipanggil `INKEY$` @18535**, yang
saya namai di iterasi #6 semata-mata dari tiga panjang keluarannya (0, 1, dan 2 byte).
Program itu memang sedang menjajak papan ketik lewat rutin yang saya sebut `INKEY$`.

**Keluarga jebakan peristiwa terbukti aktif.** `comrun` melaporkan `interrupts
requested: 03h` pada 3DTTT dan PAC-GAL — `INT 3`, titik periksa jebakan yang
didokumentasikan di [EVENT-TRAPS.md](EVENT-TRAPS.md) sejak awal proyek. Dan pada jejak
3DTTT, `ON_KEY_GOSUB` serta `KEY_ONOFF` — dua nama termuda, dari iterasi #20 — memang
terpanggil. Dua jalur bukti yang sama sekali terpisah bertemu di kesimpulan yang sama.

**Nama-nama tersulit dari iterasi akhir bertahan.** Pada HOPPER, yang terkonfirmasi
berjalan mencakup `TIME$`, `VAL`, `INPUT$`, `DEF SEG` dan `DEF SEG=`, `KEY_DISPLAY`,
`MID$`, `RIGHT$`, `CINT#`, `MUL#_FAC`, dan `ADD#` — termasuk seluruh keluarga presisi
ganda yang ditemukan di iterasi #7 dan #8.

## PAC-GAL tidak bergerak, dan alasannya menguatkan temuan lama

PAC-GAL berhenti di alamat yang sama persis pada setiap percobaan — tanpa tombol,
dengan tombol, dengan Enter, dengan anggaran 150 juta instruksi. Selalu 711 alamat,
selalu berhenti di `0x4c23`. Membongkar titik itu menjelaskan kenapa:

```
0x4c0e  cmp  byte ptr [0x70], 0    ; ada tombol tersangga?
0x4c13  jne  0x4c26
0x4c15  cmp  word ptr [0x72], 0    ; penyangga kedua?
0x4c1a  jne  0x4c26
0x4c1f  mov  ah, 1
0x4c21  int  0x16                  ; kalau tidak, tanya BIOS
0x4c26  ret
0x4c27  call 0x4c0e
0x4c2a  je   0x4c27                ; <-- gelung tunggu, selamanya
```

Gelung di `0x4c27` menunggu sampai ada tombol. PAC-GAL memeriksa **penyangganya
sendiri** di `[0x70]` dan `[0x72]` lebih dulu — dan penyangga itu hanya diisi oleh
penangan `INT 9` miliknya, yang membaca port `0x60` dan yang saya bongkar di
iterasi #20.

`comrun.py` mengemulasi `INT 10h`, `16h`, `1Ah`, `20h`, dan `21h` — **tidak ada
`INT 9`**. Interupsi perangkat keras papan ketik tak pernah diantarkan, jadi penangan
PAC-GAL tak pernah jalan, penyangganya tetap kosong, dan gelungnya berputar selamanya.

Ini **batas wasitnya, bukan cacat rekonstruksinya**. Dan sebagai efek samping ia
memberi bukti perilaku untuk analisis jebakan peristiwa: PAC-GAL memang tidak
memakai jalur papan ketik BIOS biasa melainkan penangan `INT 9` sendiri — persis
seperti yang dibaca dari disassembly-nya, dan sekarang terlihat dari cara ia macet.

3DTTT memakai `ON KEY` juga tetapi tetap maju, karena sebagian jalurnya menjajak
`INT 16h` langsung.

## Batas jejak ini, dinyatakan terang

- **Ini jejak permulaan, bukan permainan penuh.** 122 dari 2.322 situs panggilan 3DTTT
  yang berjalan; sisanya menunggu alur permainan yang belum dicapai. Nama yang "belum
  tersentuh" bukan berarti salah — hanya **belum teruji**.
- **Tidak ada perbandingan keluaran.** Saya membandingkan alamat yang dieksekusi, bukan
  layar yang dihasilkan. Rutin bisa terpanggil pada urutan yang benar dan tetap saya
  salah artikan perannya.
- **`.bas`-nya sendiri tetap tak bisa dijalankan.** Ia rekonstruksi yang bisa dibaca:
  tanpa nama variabel asli, tanpa nomor baris, tanpa komentar — semuanya dibuang
  compiler dan tak ada di EXE. Verifikasi ini menguji **peta rutinnya**, bukan
  kemampuan menjalankan ulang programnya.

## Yang berubah karena verifikasi ini

Sebelumnya saya hanya bisa mengatakan "132 nama, masing-masing dua bukti independen".
Sekarang bisa ditambahkan: dari situs panggilan yang benar-benar dijalankan mesin,
**lebih dari sembilan dari sepuluh sudah bernama**, dan **41 nama berbeda** terbukti
benar-benar dieksekusi:

```
ADD!  ADD!_FAC  ADD#  ARG_C  ARITH!  ASC  CINT  CINT#  CLS  COLOR  CONCAT$
DEF_SEG  DEF_SEG=  FACLOAD!  FACNORM  FACSTORE!  FACSTORE#  FACTEST  GOSUB
INKEY$  INPUT  INPUT$  INT2SGL  KEY_DISPLAY  KEY_ONOFF  LEFT$  LET!  LET$
LOAD!  LOCATE  MID$  MUL!_FAC  MUL#_FAC  ON_GOSUB  ON_KEY_GOSUB  PRINT_BEGIN
RETURN  RIGHT$  SCREEN_STMT  TIME$  VAL
```

Sisa yang tak bernama pun jadi lebih terukur. Pada 3DTTT hanya **tujuh** target tanpa
nama yang benar-benar berjalan, pada HOPPER **enam**. Itulah yang layak dikejar
berikutnya — bukan 53 target sisa, melainkan belasan yang terbukti dipakai.

## Jejak sebagai pemandu, bukan sekadar wasit

Daftar tiga belas target itu langsung dikerjakan, dan hasilnya membenarkan gagasannya:
enam nama baru dari tiga belas kandidat, jauh di atas laju satu-per-iterasi yang membuat
loop penamaan dihentikan.

| nama | biner | yang menentukan |
|---|---|---|
| `KEY_LIST` | 3DTTT, HOPPER | memancarkan `F`, nomor, spasi, lalu isi string untuk **sepuluh** entri dari basis `0x16`; `add bx,4` menegaskan langkah deskriptor |
| `KEY_ASSIGN` | HOPPER | menguji 1..10 lalu menghitung `0x16 + (n-1)*4` — entri ke-n tabel yang sama |
| `KEY_DISPLAY` | 3DTTT | tiga keadaan dengan penjaga-perubahan, melengkapi padanannya di dua biner lain |
| `TRAP_INIT` | 3DTTT, PAC-GAL | menolkan tepat 105 byte = 21 rekaman dari basis tabel jebakan |

Putaran itu diteruskan sampai kandidatnya habis. Tiga nama lagi menyusul —
`SND_TIMER_OFF` (membungkam pengeras suara lewat port 0x61, memulihkan vektor INT 8
yang disimpan, menolkan PIT) dan `CLEAR` di dua biner (ukuran baku 0x200 dengan batas
bawah 0x180, batas dibulatkan genap, disimpan ke penunjuk heap masing-masing biner).

Hasil akhirnya, **sembilan nama dari tiga belas kandidat**:

| jejak | dijalankan dan bernama, sebelum | sesudah | target berjalan tanpa nama |
|---|---|---|---|
| 3DTTT | 94,3% | **97,5%** | 7 -> **3** |
| HOPPER | 91,0% | **94,0%** | 6 -> **4** |

Pelajarannya melampaui proyek ini: ketika penamaan statis mentok, **jejak eksekusi
bukan cuma alat verifikasi melainkan alat prioritas**. Ia memisahkan ekor yang panjang
dan tak berbukti dari segelintir yang benar-benar dipakai program.


---

# Bagian dua: menguji ISI, bukan alur

Bagian pertama membandingkan **alamat yang dieksekusi**. Itu menguji kendali: rutin yang
saya namai memang dipanggil, pada program yang memang berjalan. Ia tidak menguji apa pun
tentang **apa yang digambar** — dan justru di situlah klaim paling konkret proyek ini
berada, di `MAZE-TILES.md`, `DATA-BLOCKS.md`, dan `assets.md`.

`comrun.py` membuang framebuffer grafis, tetapi ketiga program ini menulis teks. Lebih
jauh, penyangga teks di `0xB800` **kosong sama sekali**: BASCOM menyalurkan keluaran
konsol lewat BIOS, dan `comrun` mencatat `INT 10h` lalu mengabaikannya. Isi layarnya
tidak tersimpan di memori mana pun — ia hanya lewat sebagai panggilan.

`tools/textscreen.py` mencegat panggilan itu. Ia **tidak mengubah** `comrun.py`;
ia meng-import-nya, menurunkan `Machine`, dan membungkus `_on_int` untuk memelihara
kisi 80x25 sendiri yang ditafsirkan sebagai CP437.

## Yang terbaca di layar

**HOPPER ternyata klon Frogger.**

```
JOYSTICK OR KEYBOARD (J/K)
...
INSTRUCTIONS:
Use the cursor keys on the numeric
keypad to move your frog.
Press Esc to pause, <F10> to abort
```

Tiga baris itu mengonfirmasi tiga temuan yang sebelumnya hanya berupa angka:

| yang terbaca | temuan yang dikuatkan |
|---|---|
| "move your frog" | tabel kecepatan per-lajur `+1,-1,+2,-1,+2,0,...` di `DATA-BLOCKS.md` adalah sebelas lajur lalu-lintas dan batang kayu berlawanan arah |
| "`<F10>` to abort" | jalur ketiga `INKEY$` yang mengembalikan **dua** byte, untuk tombol diperluas yang tak punya ASCII — inilah yang membuat tafsir `MKI$` ditolak di iterasi #6 |
| "JOYSTICK OR KEYBOARD" | `@19476` = `STICK`, pembaca sumbu joystick: ia memvalidasi 0 <= n < 4, dan n=0 mencabang ke pencuplik port permainan `0x201` di 19490 |

Yang terakhir patut digarisbawahi: perannya terbukti dari mulut programnya sendiri,
setelah disiplin dua-bukti menolak menamainya.

**Koreksi alamat.** Catatan ini semula menempelkan temuan joystick itu pada `@23194`.
Alamatnya salah. Kode port `0x201` ada di 19490, yang dicapai dari `@19476`; `@23194`
sama sekali tidak menyentuh port apa pun — ia memasang penangan keluaran
(`[0x7d7]=1`, `[0x7d8]=<offset>`) dan ketiga argumennya adalah string format
`PRINT USING`, termasuk `'######   '`. Keduanya kini bernama dengan bukti terpisah.

**PAC-GAL bertanya `How fast (0-30000)?`** — sebuah prompt `INPUT`, yang menjelaskan
kenapa ia macet di gelung tunggu papan ketik pada setiap jejak sebelumnya.

## Galat yang menguatkan dua hal sekaligus

Dijawab `100`, PAC-GAL melempar galat runtime BASIC:

```
Illegal function call at 1010:00B3
```

Offset `0xB3` = 179, dan di sana ada `INT 3` — titik periksa batas-pernyataan dari
[EVENT-TRAPS.md](EVENT-TRAPS.md). Dua instruksi sebelumnya:

```
165  lcall LOCATE
170  mov   bx, [0x9C4]
174  lcall LOCATE
179  int3            <-- galat muncul di sini
```

`Illegal function call` adalah galat yang **persis** dilempar `LOCATE` untuk baris atau
kolom di luar jangkauan. Jadi satu galat mengonfirmasi dua hal terpisah: bahwa rutin di
12890 dan 12916 memang `LOCATE`, dan bahwa `INT 3` memang titik periksa di batas
pernyataan.

Penyebab galatnya sendiri kemungkinan besar **batas wasitnya**: `comrun` mengabaikan
set-mode video, jadi variabel lebar layar yang diuji `LOCATE` tak pernah terisi benar.

## Yang masih belum terlihat

Framebuffer grafis HOPPER tetap hitam meskipun program sudah meminta mode 4
(CGA 320x200) dan menjalankan 2.800 alamat. Ia berhenti lagi sesudah membaca satu
tombol. Gelung permainannya menulis port `0x40` dan `0x61` — pencacah timer dan
pengeras suara — jadi ia kemungkinan menunggu detak yang tak pernah datang.

### `INITIALIZING...` bukan kemacetan — dan mengukurnya membuktikan `DATA-BLOCKS.md`

Menambah anggaran instruksi tidak menolong, dan itu memang bukan jawabannya.
`tools/hotspot.py` menghitung eksekusi per alamat, dan satu jalan 8 juta instruksi
menemukan gelung 233 iterasi di kode pengguna 809-840:

```
778  lcall @19921           ; READ sebuah nilai dari DATA
786  lcall LOAD!
796  lcall LOAD!
802  mov  ds, word ptr [0x98]   ; segmen yang disetel DEF SEG
806  mov  byte ptr [bx], al     ; POKE
840  jbe  775                   ; ulangi
```

`HOPPER/DATA-BLOCKS.md` menyatakan HOPPER menyuntikkan penggulung CGA sepanjang
**228 byte** dari pernyataan `DATA`. Gelung itu berjalan **233 kali**, membaca sebuah
nilai dan mem-`POKE`-nya ke segmen `DEF SEG`. Itu klaim yang sama, terlihat berjalan.

Program itu tidak macet: `READ` milik BASCOM memindai ulang daftar `DATA` dari awal
setiap kali dipanggil, jadi biayanya kuadratik -- sekitar 34.000 instruksi per iterasi.
Lambat, tetapi maju.

Profil itu juga memberi **empat nama baru**: `@19921` yang memakan waktu ternyata
`READ!`, beserta `READ#`, `READ%`, dan `READ$` di sebelahnya.

Dan rekonstruksinya kini sejalan dengan layar, baris demi baris:

```
 709  ... DEF_SEG= ...
 778  READ! : LOAD! : LOAD!
 895  ... PRINT "JOYSTICK OR KEYBOARD (J/K)";
1002  INPUT$ : STRCMP
```

Kalimat pada pernyataan 895 itulah yang muncul di layar emulator.

### Batas yang tak bisa saya tembus dengan alat ini

Sesudah gelung `READ`/`POKE` selesai, kode pengguna **berhenti maju sepenuhnya**:
233 hit di 8 juta instruksi, dan tetap 233 di 60 juta, sementara runtime membakar
52 juta lagi. Profil per-alamat menunjukkan gelungnya tepat: sekitar **183.000
iterasi** dalam 12 juta instruksi, seluruhnya di dalam runtime, memanggil jalur
baca-karakter perangkat di 27608 yang setiap kali melapor akhir-masukan.

Yang menutup kemungkinan "ia menunggu tombol": `comrun` melaporkan
`1 reads, 4 of 5 keys unused`. Lima tombol tersedia di antrean, HOPPER membaca satu,
lalu **tak pernah menjajak papan ketik lagi**. Gelung itu bukan penantian masukan.

Dua hipotesis saya sebelumnya gugur di sini, dan keduanya layak dicatat: bukan
kemacetan papan ketik (tombol tak terpakai), dan bukan pengulangan pada EOF (`jb` di
20869 melompat ke penangan galat, bukan kembali ke gelung).

Kesimpulan yang bisa dipertanggungjawabkan: lapisan perangkat BASCOM meminta sesuatu
yang `comrun` tak sediakan, dan program berputar di dalamnya. Menembusnya menuntut
menambal alat orang lain atau memakai DOSBox-X, yang menurut catatan proyek ini
menggantung bila dijalankan berulang. Saya berhenti di sini alih-alih memaksa.

Artinya gambar CGA-nya sendiri, dan labirin `MAZE-TILES.md`, tetap **belum terlihat**.
Klaim penggulung 228 byte sudah terkonfirmasi lewat gelung `READ`/`POKE`-nya; bentuk
gambarnya belum.

## Ringkasan dua sumbu

| sumbu | pertanyaan | jawabannya |
|---|---|---|
| kendali | apakah rutin yang saya namai memang dipanggil? | ya -- 97,5% dan 94,0% situs yang dijalankan sudah bernama, 41 nama terbukti dieksekusi |
| isi | apakah saya benar soal apa yang digambar? | **sebagian** -- teksnya mengonfirmasi tiga temuan, grafisnya belum tercapai |

Kedua sumbu itu bisa benar sendiri-sendiri dan tetap tak menangkap kesalahan yang
satunya. Contoh yang dikutip `comrun.py` di kepala berkasnya tepat soal ini: sebuah
ekstraksi yang mencapai 100% panggilan sambil menyusun lantai empat belas balok menjadi
tangga diagonal, dan angkanya identik sebelum dan sesudah diperbaiki.

Untuk proyek ini, sumbu kendali sudah terukur baik. Sumbu isi baru terbukti untuk teks.
Yang grafis -- penggulung CGA, sprite `GET`/`PUT`, labirin -- tetap klaim statis, dan
dokumen ini tidak berpura-pura sebaliknya.

> **Sudah tidak berlaku sejak 2026-08-08.** Kalimat di atas ditulis sebelum sumbu isi
> yang grafis bisa diukur. Ketiganya kini terukur, dan angkanya ada di tempat lain --
> **penunjuk, bukan salinan**, supaya tidak ada dua angka yang bisa menyimpang:
>
> | Yang diukur | Tempatnya |
> |---|---|
> | Labirin PAC-GAL, 24/24 baris sel demi sel | [`RUNNABLE.md`](RUNNABLE.md) -- bagian wasit layar |
> | Papan 3DTTT, 18/18 baris | [`RUNNABLE.md`](RUNNABLE.md) -- bagian yang sama |
> | Framebuffer CGA HOPPER (`gfxref.py`) | [`RUNNABLE.md`](RUNNABLE.md) -- "Grafis HOPPER akhirnya terbandingkan dua sisi" |
> | Penggulung 232 bita yang di-POKE, dijalankan dan diukur | [`RUNNABLE.md`](RUNNABLE.md) -- "Penggulung yang di-POKE" |
>
> Satu peringatan yang ikut terukur: bukti HOPPER **statistik, bukan eksak** --
> layarnya bergerak terus, jadi kedua sisi tak pernah berada pada saat yang sama.
> Ia tidak setara dengan 24/24 dan 18/18, dan tidak boleh disajikan seolah setara.
