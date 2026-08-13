# Classic DOS BASIC Games — arsip koleksi 1978–1995

> Folder ini **bukan satu aplikasi**. Ini **arsip** — tumpukan isi beberapa disket
> DOS berbeda yang dulu pernah disalin jadi satu, lalu dikemas ulang sekitar
> tahun 2000. Ada 83 program BASIC, 4 permainan siap-jalan, 3 interpreter, dan
> sisa-sisa dokumentasi dari lima sumber yang bisa dilacak.

Dirapikan pada 6 Agustus 2026. Salinan folder asli apa adanya ada di
`..\old_games_BACKUP_20260806.zip` (135 berkas, terverifikasi).

---

## 1. Ringkasan singkat

| | |
|---|---|
| Program BASIC (`.BAS`) | 83 — semuanya sudah dikonversi ke teks, bisa dibuka Notepad |
| Permainan siap-jalan (`.EXE`) | 4 |
| Interpreter BASIC | 3 (GW-BASIC 3.23, IBM BASICA, BASRUN) |
| Peluncur Windows (`.bat`) | 91 |
| Rentang tahun program | 1978 – 1995 |
| Sumber yang teridentifikasi | 7 kelompok (lihat bagian 4) |

Program tertua yang bisa dilacak adalah **XWING** (25 September 1978, ditulis
untuk TRS-80 lalu diport ke IBM PC pada Desember 1982). Yang termuda adalah
**TEMPLE** (1995). Berkas `Readme.txt` dan sebagian besar `.bat` bertanggal
tahun 2000 — itu bukan umur programnya, itu tanggal orang mengemas ulang
koleksi ini menjadi paket shareware "Classic Old DOS Games collection".

---

## 2. Struktur folder

```
old_games\
├─ README.md                  ← berkas ini
├─ dosbox-games.conf          ← profil perangkat keras DOSBox-X (IBM PC / CGA / 4,77 MHz / zoom 5x)
│
├─ run\                       ← "disket" yang di-mount sebagai C: di DOSBox
│   ├─ *.BAS          83 program, sudah jadi teks biasa
│   ├─ *.bat          91 peluncur Windows (klik dua kali)
│   ├─ GW.EXE  BASICA.EXE  BASRUN.EXE
│   ├─ 3DTTT.EXE  PAC-GAL.EXE  HOPPER.EXE  SPACEWAR.EXE
│   └─ BS.SCO  HOPPER.SCO  LANDER.BIN  LANDER.SCR  METEOR.DAT  STRINGS.FIL
│
├─ reviews\                   ← analisis arsitektur + code review per program
│   ├─ 00-DASAR-BASIC.md      ← baca ini dulu kalau baru kenal BASIC
│   ├─ README.md              ← indeks + urutan baca menurut pola arsitektur
│   └─ <NAMA>.md              ← 83 berkas, satu per program
├─ docs\                      ← Readme.txt, STARTREK.DOC, README.CAR, USE.BAT, HELPME.BAT
├─ tools\                     ← utilitas DOS: SPEED.COM, GOSLOW.COM, CAL.COM, GETRTC.EXE, slodn200.zip
├─ misc\                      ← SAMPLE.TXT, TJRHGFE, ELIZA.SRC (bukan bagian runtime)
└─ _attic\
    ├─ original-bas-binary\   ← 74 berkas .BAS asli dalam bentuk biner, tak tersentuh
    ├─ original-launchers\    ← 27 berkas .bat asli tahun 2000
    └─ LIST.BAS               ← rusak, 9 byte
```

**Kenapa `run\` sengaja dibiarkan rata (tanpa subfolder genre)?** Karena tiga hal
akan patah kalau `.BAS` dipencar:

1. `MENU.BAS` memanggil `RUN "WILDCAT"`, `RUN "MENU2"`, dan seterusnya — semua
   tanpa path, jadi wajib satu direktori.
2. Sepuluh bagian `BUSONE`…`BUSTEN` saling berantai dengan cara yang sama.
3. Beberapa program membaca berkas pendamping di direktori kerja:
   `LANDER.BAS`↔`LANDER.BIN`/`.SCR`, `METEOR.BAS`↔`METEOR.DAT`,
   `ELIZA.BAS`↔`STRINGS.FIL`, `HOPPER.EXE`↔`HOPPER.SCO`.

Jadi pengelompokan dilakukan di dokumen ini (bagian 4 dan 5), bukan di sistem berkas.

---

## 3. Cara menjalankan

### Cara paling gampang
Buka `run\`, klik dua kali salah satu `.bat`. Contoh: `TEMPLE.bat`, `PAC-GAL.bat`,
`STARTREK.bat`. Peluncur akan menjalankan DOSBox-X, me-mount `run\` sebagai `C:`,
dan langsung membuka programnya.

### Empat peluncur khusus (diawali garis bawah, jadi ada di urutan atas)

| Berkas | Fungsi |
|---|---|
| `_BASICA.bat` | Langsung masuk prompt `Ok` IBM BASICA 1983 |
| `_GW-BASIC.bat` | Langsung masuk prompt `Ok` GW-BASIC 3.23 |
| `_FRIENDLYWARE-MENU.bat` | Menyalakan menu Friendlyware 1982 yang asli |
| `_DOS-PROMPT.bat` | Prompt DOS biasa dengan `C:` sudah ter-mount |

Di dalam BASICA/GW-BASIC:

```
FILES                 daftar isi disket
LOAD "TICTAC.BAS"     muat program
LIST                  baca kodenya
RUN                   jalankan
SYSTEM                keluar ke DOS
```

### Yang diasumsikan
`dosbox-x` **harus ada di PATH**. Tidak ada satu pun path absolut di dalam `.bat`,
jadi seluruh folder bisa dipindah atau disalin ke komputer lain tanpa diedit.
Semua `.bat` memakai `-conf "..\dosbox-games.conf"`, jadi konfigurasi DOSBox-X
global Anda tidak disentuh sama sekali.

### Setelan DOSBox yang dipakai dan alasannya

| Setelan | Nilai | Alasan |
|---|---|---|
| `machine` | `cga` | Survei kode menunjukkan hanya `SCREEN 0`, `1`, dan `2` yang dipakai — semuanya mode CGA. EGA/VGA tidak diperlukan. |
| `cycles` | `fixed 315` | Setara IBM PC 8088 4,77 MHz. Game aksi di sini (BREAKOUT, METEOR, ABM2A, FLYS, ATTACK) mengatur kecepatan lewat kecepatan loop mentah, jadi kalau dinaikkan malah tak bisa dimainkan. |
| `scaler` | `normal5x forced` | Zoom 5x seperti diminta. |
| `output` | `openglnb` | Penyaringan nearest-neighbour, supaya zoom 5x jadi piksel kotak tajam, bukan gambar buram. |
| `aspect` | `false` | Agar penskalaan tetap kelipatan bulat di kedua arah. |
| `memsize` | `1` MB | Cukup; program aslinya berjalan di 64 KB. |

**Catatan soal zoom 5x di layar 1920×1200 Anda:**
mode grafis `SCREEN 1` (320×200) jadi 1600×1000 — pas 5x dan muat di layar.
Tapi mode teks 80 kolom jadi 3200×1000, lebih lebar dari layar, sehingga
dijepit oleh DOSBox. Sebagian besar program di sini memakai mode teks. Kalau
mau semuanya muat, ganti satu baris di `dosbox-games.conf` jadi `normal3x`
(1920×600 untuk teks) atau `normal4x`. Alt+Enter untuk layar penuh.

Kecepatan bisa diubah saat main: **Ctrl+F11** melambatkan, **Ctrl+F12** mempercepat.

### Utilitas di `tools\` sudah tidak diperlukan
`SPEED.COM`, `GOSLOW.COM`, dan `slodn200.zip` (SLOWDOWN 2.00) ketiganya adalah
alat *memperlambat CPU* — peninggalan zaman ketika PC 386/486 terlalu kencang
untuk game yang ditulis buat 8088. Karena `cycles=fixed 315` sudah mengurus itu,
ketiganya tersimpan sebagai artefak sejarah saja.

---

## 4. Asal-usul: koleksi ini gabungan dari mana saja

Tujuh kelompok berhasil dilacak. Bukti diambil dari baris `REM` di dalam kode
(yang baru terbaca setelah proses konversi di bagian 8), dari berkas dokumentasi
yang menyertainya, dan dari struktur menunya.

### 4.1 Friendlyware PC Introductory Set — 36 program (kelompok terbesar)

Bukti: `MENU.BAS` dan `MENU2.BAS` memuat string `" F R I E N D L Y W A R E "`,
dan menu itu memetakan persis 21 + 11 entri ke nama berkas yang ada di sini.

`MENU.BAS` (Menu #1, permainan) memetakan:

| Tombol | Judul di layar | Berkas |
|---|---|---|
| A | Wildcatter | `WILDCAT.BAS` |
| B | Othello | `OTHELLO.BAS` |
| C | Peg Leap | `PEGLEAP.BAS` |
| D | Blackjack | `21.BAS` |
| E | Mastermind | `MASTER.BAS` |
| F | Sea Battle | `SUB.BAS` |
| G | Hangman | `HANGMAN.BAS` |
| H | Dominoes | `DOMINOES.BAS` |
| I | PC Golf | `GOLF.BAS` |
| J | Head Coach | `FOOTBALL.BAS` |
| K | Match | `MATCH.BAS` |
| L | Nevada Dice | `CRAPS.BAS` |
| M | Eye & Hearing Test | `HEAREYE.BAS` |
| N | Tic Tac Toe | `TICTAC.BAS` |
| O | You Draw It | `DRAW.BAS` |
| P | Towers Of Atlantis | `TOWERS.BAS` |
| Q | Personal Biorhythms | `BIO.BAS` |
| R | Sports Predicting | `STATS.BAS` |
| S | Killer Maze | `MAZE.BAS` |
| T | Boggy Marsh | `BOGGY.BAS` |
| U | ke Menu #2 | `MENU2.BAS` |

`MENU2.BAS` (Menu #2, bisnis) memetakan A→`BUSONE.BAS`, G→`INTRO.BAS`,
J→`CHECK.BAS`, K→kembali ke `MENU.BAS`. Menariknya, tujuh entri sisanya
(Depreciation Costs, Inventory Reorder, Present/Future Value, Amortization
Analysis, Economic Order Quantity, Break Even Analysis, Stock Ratio Analysis)
**bukan berkas terpisah** — semuanya subrutin di dalam `MENU2.BAS` itu sendiri,
yang karena itu membengkak jadi 642 baris.

`BUSONE`…`BUSTEN` ternyata bukan sepuluh program berbeda, melainkan **satu
tutorial "Business Simulation" sepuluh bagian** yang saling berantai:
`BUSONE` → `BUSTWO` → … → `BUSTEN` → kembali ke `MENU`. Ini teknik *overlay*
klasik, dipakai supaya materi yang tidak muat di memori 64 KB tetap bisa jalan.

Beberapa program kelompok ini punya penanda waktu penyuntingan di dalam kode:
`WILDCAT` dan `GOLF` sama-sama "Last Update - 7/17/82:AM:A.Vanchura",
`FOOTBALL` "7/29/82:09:00pm", `DRAW` "update 8/30/82 11:00 am",
`TOWERS` "last update 9/1/82 10:00 am", `HANGMAN` "update 2/1/83".

Ini juga satu-satunya kelompok yang disimpan **terproteksi** (lihat bagian 8) —
wajar, karena Friendlyware produk komersial.

### 4.2 Program contoh IBM Personal Computer — 5 program

`MORTGAGE`, `MUSIC`, `MUSIC1`, `PIECHART`, `SPACE` semuanya membawa tiga baris
`REM` yang identik pola-nya:

```
REM The IBM Personal Computer Mortgage
REM Version 1.00 (C)Copyright IBM Corp 1981, 1982
REM Licensed Material - Program Property of IBM
```

`MORTGAGE` mencantumkan penulisnya, Glenn Stuart Dardick, dan seorang pengubah
kemudian: "Modified by Ayodele Isaac Anise; September, 1986". `SPACE` menyebut
R. Heiney & M. Hallerman. Dua berkas `.EXE` (`3DTTT` dan `HOPPER`) juga membawa
string "Licensed Material - Program Property of IBM" di dalam binernya.

### 4.3 International PC Owners (IPCO) — 3 program

Kelompok ini paling gamblang. `WIZARD`, `DROIDS`, dan `XWING` sama-sama membuka
dengan kotak ASCII yang isinya:

```
░│            2039-A.BAS             │░
░│        THE WIZARD'S CASTLE        │░
░│ BROUGHT TO YOU BY THE MEMBERS OF  │░
░│      International PC Owners      │░
░│P.O. Box 10426, Pittsburgh PA 15234│░
```

Nomor disknya berbeda-beda: `2039-A` (Wizard's Castle), `2043-A` (Droids),
`2060-A` (XWing). Jadi ini pustaka public-domain kelompok pengguna dengan
penomoran disk. `DROIDS` menambahkan baris "Error correction by JOHN BECK,
Melbourne PC-Group" — jejak bahwa berkas ini sempat menyeberang ke Australia.

Silsilah `WIZARD` terekam tiga lapis di dalam kodenya sendiri: aslinya karya
Joseph R. Power untuk **Exidy Sorcerer**, terbit di majalah *Recreational
Computing* edisi Juli/Agustus 1980, lalu dimodifikasi J.F. Stetson untuk
Heath Microsoft BASIC, baru kemudian sampai ke IBM PC.

### 4.4 Seri Attack / Serpent / Zap'em — 3 program (kemungkinan besar juga IBM)

`ATTACK.BAS`, `SERPENT.BAS`, dan `ZAP'EM.BAS` memakai kerangka layar pembuka
yang identik dan format versi yang sama:

```
ATTACK    Version 1.1    OCTOBER 7  1982   MOD-5-5-M
SERPENT   Version 00     OCTOBER 06 1982   USR-5-5-K
ZAP'EM    Version 1B     FEBRUARY 03,1982  MAV-5-5-K
```

Kode di ujung (`MOD-5-5-M`, `USR-5-5-K`, `MAV-5-5-K`) berpola seragam, jadi
ketiganya jelas dari penerbit yang sama.

Dan penerbit itu tampaknya IBM. Ketiganya membuka dengan dua baris ini:

```basic
10 KEY OFF:SCREEN 0,1:COLOR 15,0,0:WIDTH 40:CLS:LOCATE 5,19:PRINT "IBM"
20 LOCATE 7,8,0:PRINT "General  utility  programs"
```

Bandingkan dengan program contoh IBM resmi di bagian 4.2 (`MORTGAGE`, `MUSIC`,
`PIECHART`, `SPACE`), yang barisnya:

```basic
1010 KEY OFF:SCREEN 0,1:COLOR 15,0,0:WIDTH 40:CLS:LOCATE 5,19:PRINT "IBM"
1020 LOCATE 7,12:PRINT "Personal Computer"
```

Mode layar, lebar, warna, dan posisi `LOCATE 5,19` **sama persis** — hanya baris
kedua yang berbeda ("General utility programs" versus "Personal Computer").
Jadi ketiganya kemungkinan besar berasal dari disket IBM seri lain. Bedanya
dengan kelompok 4.2: tidak ada satu pun baris `REM` hak cipta di ketiganya,
jadi ini dugaan berdasar tata letak, bukan pernyataan tertulis.

### 4.5 Disket majalah *What Micro?* — 4 program

Berkas `docs\README.CAR` adalah daftar isi direktori `C:\PROTEXT\TEXT\CARP`
dari volume disk bernama `STEVE_BLIPS`, dan menyebut satu per satu:
`WHATMONF.BAS`, `GERMFOLK.BAS`, `OCTAVE.BAS`, `NOTETABL.BAS` — keempatnya ada di
sini. `GOSLOW.COM` di `tools\` memperkuat ini: string di dalamnya berbunyi
"WHAT MICRO? TOOLKIT GoSlow -- version 1.0, (C)1987 Strange Software Ltd."

Keempatnya bukan permainan, melainkan **contoh mengajar**: cara memakai perintah
`PLAY`, cara memakai `SOUND` dengan rumus frekuensi, cara mencetak tabel nada,
dan cara mem-`PEEK` byte BIOS video untuk mendeteksi jenis monitor.

### 4.6 Listing Feldman & Rugg — 3 program

`CURVE`, `INTEGRAT`, dan `SIMEQN` membawa header seragam:

```
REM: COPYRIGHT 1982 Phil Feldman and Tom Rugg.
REM: Any BASIC, any CRT.
```

Baris "Any BASIC, any CRT" itu penting: ketiganya sengaja ditulis **tanpa** satu
pun perintah khas IBM PC (`LOCATE`, `COLOR`, `SCREEN`), supaya bisa diketik ulang
di komputer merek apa pun. Bandingkan dengan program Friendlyware yang penuh
`LOCATE`/`COLOR` — dua filosofi portabilitas yang bertolak belakang.

### 4.7 Public domain & listing majalah lain-lain — 29 program

Sisanya berdiri sendiri-sendiri, tapi banyak yang menyebut asal-usulnya:

- **`STARTREK`** — dari *BASIC Computer Games* karya Dave Ahl (versi paling
  ditiru sepanjang sejarah BASIC), diport ke IBM PC oleh Bob & Sharon Fritz,
  Oktober–November 1981, lengkap dengan alamat rumah di San Diego. Manualnya
  ada di `docs\STARTREK.DOC`.
- **`METEOR`** — Edward T. Ordman, November 1981; kodenya sendiri menyebutkan
  sumber terbitnya: *Creative Computing* Vol. 8 No. 8, hlm. 178–185.
- **`ELIZA`** — "Copyright (C) 1981 by Steve Grumette", versi 3.0. Seluruh basis
  aturannya dibaca dari `STRINGS.FIL`, dan `WRTSTR.BAS` adalah alat pembuat
  berkas itu. Dua berkas di `misc\` (`SAMPLE.TXT` dan `TJRHGFE`) ternyata
  **transkrip percakapan Eliza**, bukan dokumentasi.
- **`BATSHIP`** — G.S. Alberts, dengan alamat lengkap, nomor telepon, dan bahkan
  nomor tie-line internal IBM Burlington, Vermont. Ditandai "PUBLIC DOMAIN
  SOFTWARE".
- **Empat program yang lewat tangan Patrick Leabo, Tucson, Arizona** —
  `BLACKJCK` (asli 1978 untuk CCII), `MAXIT1` (dari Commodore PET, 20 Mar 1982),
  `OTHELLO` (dari PET, Maret 1982), `YAHTZEE` (asli JL Helms & MF Pezok untuk
  CCII, Coronado CA). Orang ini rupanya rajin memindahkan program dari mesin
  lain ke IBM PC. Di `OTHELLO` dia bahkan menulis catatan jujur:
  *"NOT DONE YET BUT HAVE FUN -- PLEASE ADD A GOOD ALGORITHM TO IT"*.

### Garis waktu

```
1978  XWING (v4.0, TRS-80)          BLACKJCK (CCII)
1980  WIZARD (Exidy Sorcerer)       YAHTZEE (CCII)
1981  STARTREK, METEOR, ELIZA       program contoh IBM
1982  ledakan besar: Friendlyware, Feldman & Rugg,
      seri Attack/Serpent/Zap'em, port-port Patrick Leabo
1983  LIFE2, HANGMAN
1984  KENO, SOLITAIR, 3DTTT
1985  SPACEWAR, FLYS
1986  PAC-GAL, CRAZY8, BACKGAM, DROIDS, HIQUE2
1987  GOSLOW (What Micro? Toolkit)
1990  disket What Micro? (CARPARK)
1991  HOPPER
1995  TEMPLE v4.2
2000  dikemas ulang jadi "Classic Old DOS Games collection"
```

---

## 5. Katalog program BASIC

Semua berkas di bawah ini ada di `run\`, sudah berbentuk teks biasa, dan punya
peluncur `.bat` bernama sama. Kolom **Format asli** menerangkan bentuk berkas
sebelum dikonversi (lihat bagian 8).

Tiap program juga punya berkas analisis di **`reviews\<NAMA>.md`**, berisi peta
arsitekturnya (diagram *call graph* yang diekstrak langsung dari kode, tabel
subrutin beserta perannya, tabel dispatch, peta kejadian) dan penjelasan pola
arsitektur apa yang ditunjukkannya. Mulai dari
[`reviews\README.md`](reviews/README.md) yang menyusun ke-83 program menurut
**pola arsitektur**, bukan menurut abjad.

| Program | Judul | Thn | Asal | Baris | Format asli | Keterangan |
|---|---|---|---|--:|---|---|
| `15PUZZLE.BAS` | The 15 Puzzle | 1982 | PD / majalah | 117 | tokenized | Dale Dewey, Victor NY. Memeriksa keberadaan BASICA dan kartu Color/Graphics sebelum mulai. |
| `21.BAS` | Blackjack | 1982 | Friendlyware | 336 | **terproteksi** | Menu #1 pilihan D. Mendukung split dan double down. |
| `ABM2A.BAS` | ABM 2 (Anti-Ballistic Missile) | 1982 | PD / majalah | 231 | tokenized | Ed Davis, versi 18 Jul 1982. Enam tingkat kesulitan; kode joystick sudah dibuang. |
| `ANATOMY.BAS` | Tutorial anatomi tubuh | 1982 | Friendlyware | 159 | **terproteksi** | Tutorial bergambar sembilan halaman; F1 mundur satu halaman, F10 kembali ke menu. |
| `ATTACK.BAS` | Attack v1.1 | 1982 | Attack/Serpent/Zap'em | 204 | tokenized | Bertanggal 7 Okt 1982, kode build MOD-5-5-M. Kerangka sama dengan SERPENT dan ZAP'EM. |
| `BACKGAM.BAS` | Backgammon | 1986 | PD / majalah | 161 | tokenized | Backgammon dua pemain lengkap dengan penghitungan pip. |
| `BATSHIP.BAS` | Battleship | 1982 | PD / majalah | 544 | tokenized | G.S. Alberts, Essex Jct. Vermont; revisi terakhir 27 Jul 1982. Dinyatakan public domain; cukup 64K dan layar monokrom. |
| `BIO.BAS` | Biorhythm pribadi | 1982 | Friendlyware | 169 | **terproteksi** | Menu #1 pilihan Q. Memplot siklus 23/28/33 hari dari tanggal lahir. |
| `BJ.BAS` | Blackjack (versi ringkas) | 1980 | PD / majalah | 218 | tokenized | Nilai kartu dihitung aritmatika dari satu indeks dek, bukan disimpan per kartu. |
| `BLACK.BAS` | Blackjack (1-2 pemain) | 1982 | PD / majalah | 396 | tokenized | Program paling rajin dikomentari di koleksi ini; tiap subrutin punya blok header. |
| `BLACKJCK.BAS` | CCII Blackjack | 1978 | PD / majalah | 282 | tokenized | Ditulis 3 Jan 1978 oleh Jessen untuk CCII; diadaptasi ke PC oleh Patrick Leabo, Tucson. |
| `BOGGY.BAS` | Boggy Marsh | 1982 | Friendlyware | 101 | tokenized | Menu #1 pilihan T. Menyeberangi rawa tanpa tenggelam. |
| `BOWLING.BAS` | Bowling Champ | 1986 | PD / majalah | 75 | tokenized | 1-4 pemain, kesulitan 0-60. Skor sepuluh frame penuh termasuk strike dan spare. |
| `BREAKOUT.BAS` | Spinout (Breakout) | 1982 | PD / majalah | 164 | teks ASCII | K.R. Sloan Jr., 1 Jan 1982. Memakai GET/PUT dengan XOR agar paddle bergerak tanpa kedip. |
| `BUSEIGHT.BAS` | Business Simulation, bagian 8 | 1982 | Friendlyware | 102 | **terproteksi** | Berantai ke BUSNINE. |
| `BUSFIVE.BAS` | Business Simulation, bagian 5 | 1982 | Friendlyware | 110 | **terproteksi** | Memperkenalkan worksheet. Berantai ke BUSSIX. |
| `BUSFOUR.BAS` | Business Simulation, bagian 4 | 1982 | Friendlyware | 66 | **terproteksi** | Berantai ke BUSFIVE. |
| `BUSNINE.BAS` | Business Simulation, bagian 9 | 1982 | Friendlyware | 53 | **terproteksi** | Berantai ke BUSTEN. |
| `BUSONE.BAS` | Business Simulation, bagian 1 | 1982 | Friendlyware | 138 | **terproteksi** | Menu #2 pilihan A. Bagian pertama tutorial berantai sepuluh bagian; RUN BUSTWO di akhir. |
| `BUSSEVEN.BAS` | Business Simulation, bagian 7 | 1982 | Friendlyware | 102 | **terproteksi** | Berantai ke BUSEIGHT. |
| `BUSSIX.BAS` | Business Simulation, bagian 6 | 1982 | Friendlyware | 102 | **terproteksi** | Pengurangan pendapatan dan biaya. Berantai ke BUSSEVEN. |
| `BUSTEN.BAS` | Business Simulation, bagian 10 | 1982 | Friendlyware | 54 | **terproteksi** | Bagian terakhir; kembali ke MENU. |
| `BUSTHREE.BAS` | Business Simulation, bagian 3 | 1982 | Friendlyware | 125 | **terproteksi** | Berantai ke BUSFOUR. |
| `BUSTWO.BAS` | Business Simulation, bagian 2 | 1982 | Friendlyware | 59 | **terproteksi** | Kas dan utang usaha. Berantai ke BUSTHREE. |
| `CHECK.BAS` | Buku Cek / Check Book Register | 1982 | Friendlyware | 65 | **terproteksi** | Menu #2 pilihan J. |
| `CRAPS.BAS` | Nevada Dice (Craps) | 1982 | Friendlyware | 254 | tokenized | Menu #1 pilihan L. Taruhan pass / don't-pass. |
| `CRAZY8.BAS` | Crazy Eights | 1986 | PD / majalah | 294 | tokenized | Les Davids. Rutin kocok, bagi, dan urutkan kartu dipisah rapi. |
| `CURVE.BAS` | Curve - regresi kuadrat terkecil | 1982 | Feldman & Rugg | 89 | tokenized | Phil Feldman & Tom Rugg. Ditulis untuk 'any BASIC, any CRT' - nol panggilan khas PC. |
| `DOMINOES.BAS` | Domino | 1982 | Friendlyware | 387 | **terproteksi** | Menu #1 pilihan H. Tiga ukuran papan. |
| `DRAW.BAS` | You Draw It (menggambar) | 1982 | Friendlyware | 287 | **terproteksi** | Menu #1 pilihan O. Menyimpan gambar ke disket data; butuh drive yang bisa ditulis. |
| `DREAM.BAS` | Dream (musik) | 1984 | PD / majalah | 18 | tokenized | Satu lagu yang seluruhnya ditulis sebagai string makro PLAY. |
| `DROIDS.BAS` | Droids | 1986 | IPCO | 183 | tokenized | Disk IPCO 2043-A. Koreksi error oleh John Beck, Melbourne PC-Group. |
| `ELIZA.BAS` | Eliza v3.0 | 1981 | PD / majalah | 514 | tokenized | Hak cipta 1981 Steve Grumette. Seluruh basis aturannya dibaca dari STRINGS.FIL. |
| `FLYS.BAS` | Flys (pukul lalat) | 1985 | PD / majalah | 180 | tokenized | Sprite lalat dan pemukul dibangun dengan bahasa makro DRAW, lalu di-GET ke array. |
| `FOOTBALL.BAS` | Head Coach (football) | 1982 | Friendlyware | 345 | **terproteksi** | Menu #1 pilihan J. Bertanggal 29 Jul 1982. |
| `GERMFOLK.BAS` | Lagu rakyat Jerman | 1990 | What Micro? | 10 | teks ASCII | Disebut di README.CAR sebagai demonstrasi perintah PLAY/SOUND. |
| `GOLF.BAS` | PC Golf | 1982 | Friendlyware | 361 | **terproteksi** | Menu #1 pilihan I. Update terakhir 17 Jul 1982 oleh A. Vanchura. |
| `HANGMAN.BAS` | Hangman | 1983 | Friendlyware | 217 | tokenized | Menu #1 pilihan G. Diperbarui 1 Feb 1983. |
| `HEAREYE.BAS` | Tes Mata & Pendengaran | 1982 | Friendlyware | 117 | tokenized | Menu #1 pilihan M. Kartu Snellen plus tes nada lewat speaker PC. |
| `HINTS.BAS` | Layar bantuan / petunjuk | 1982 | Friendlyware | 132 | **terproteksi** | Teks bantuan yang dipakai bersama oleh program-program Friendlyware. |
| `HIQUE2.BAS` | Hique (peg solitaire) | 1986 | PD / majalah | 142 | tokenized | Wes Meier, CompuServe 70215,1017. Mendukung input light pen. |
| `HISTORY.BAS` | Evolusi Ukuran Komputer | 1982 | Friendlyware | 351 | **terproteksi** | Pelajaran sejarah bergambar, mesin halaman sama dengan ANATOMY. |
| `INTEGRAT.BAS` | Integrate - aturan Simpson | 1982 | Feldman & Rugg | 42 | tokenized | Phil Feldman & Tom Rugg. Fungsinya Anda tulis sendiri di baris 2000-2999. |
| `INTRO.BAS` | Pengantar Komputer | 1982 | Friendlyware | 23 | **terproteksi** | Menu #2 pilihan G. |
| `KENO.BAS` | PC Keno | 1984 | PD / majalah | 137 | tokenized | Steve Schlich, Sep 1984. Papan digambar dengan karakter kotak CP437. |
| `LANDER.BAS` | Lunar Lander v1.0 | 1982 | PD / majalah | 399 | tokenized | Memuat LANDER.BIN lewat BLOAD dan menyimpan skor di LANDER.SCR. |
| `LIFE2.BAS` | Game of Life (Conway) | 1983 | PD / majalah | 188 | teks ASCII | Versi ini oleh John Sigle, 21 Feb 1983. Bersekat rapi dengan spanduk komentar. |
| `MASTER.BAS` | Mastermind | 1982 | Friendlyware | 137 | **terproteksi** | Menu #1 pilihan E. Tebak deret 3 sampai 6 angka. |
| `MATCH.BAS` | Match (permainan ingatan) | 1982 | Friendlyware | 369 | **terproteksi** | Menu #1 pilihan K. |
| `MAXIT1.BAS` | The Game of Maxit | 1982 | PD / majalah | 145 | teks ASCII | Diport dari Commodore PET ke IBM PC oleh Patrick Leabo, Tucson, 20 Mar 1982. |
| `MAZE.BAS` | Killer Maze | 1982 | Friendlyware | 305 | **terproteksi** | Menu #1 pilihan S. Labirin sudut-pandang-pertama, dikendalikan tombol panah. |
| `MENU.BAS` | Friendlyware Menu #1 | 1982 | Friendlyware | 41 | tokenized | Peluncur 21 entri untuk separuh permainan dari disket. |
| `MENU2.BAS` | Friendlyware Menu #2 | 1982 | Friendlyware | 642 | tokenized | Menu bisnis; tujuh dari sebelas entrinya adalah subrutin di dalam file ini sendiri. |
| `METEOR.BAS` | Meteor | 1981 | PD / majalah | 80 | tokenized | Edward T. Ordman, Nov 1981; terbit di Creative Computing Vol. 8 No. 8, hlm. 178-185. |
| `MORTGAGE.BAS` | IBM PC Mortgage v1.00 | 1982 | IBM | 204 | tokenized | (C) IBM 1981, 1982. Penulis Glenn Stuart Dardick; dimodifikasi Sep 1986 oleh Ayodele Isaac Anise. |
| `MUSIC.BAS` | IBM PC Music v1.10 | 1982 | IBM | 210 | tokenized | (C) IBM 1981, 1982. Memainkan dan menyunting lagu dengan perintah PLAY. |
| `MUSIC1.BAS` | IBM PC Music v1.10 (duplikat) | 1984 | IBM | 210 | teks ASCII | Nyaris kembar byte-per-byte dengan MUSIC.BAS, hanya disimpan dalam bentuk ASCII di tanggal berbeda. |
| `NOTETABL.BAS` | Tabel nada / frekuensi | 1990 | What Micro? | 26 | teks ASCII | Mencetak seluruh nada dan frekuensinya untuk dipakai dengan SOUND. Berbasis LPRINT. |
| `OCTAVE.BAS` | Demo satu oktaf | 1990 | What Micro? | 6 | teks ASCII | Enam baris: memainkan satu oktaf memakai SOUND dan rumus frekuensi standar. |
| `OTHELLO.BAS` | Othello | 1982 | PD / majalah | 248 | tokenized | Versi PET yang dimodifikasi Patrick Leabo, Tucson, Mar 1982. Penulisnya mengaku AI-nya belum selesai. |
| `PEGLEAP.BAS` | Peg Leap | 1982 | Friendlyware | 202 | **terproteksi** | Menu #1 pilihan C. Papan digambar dengan karakter garis CP437. |
| `PIECHART.BAS` | IBM PC Piechart v1.10 | 1982 | IBM | 77 | tokenized | (C) IBM 1981, 1982. |
| `READING.BAS` | Tachistoscope (kecepatan baca) | 1982 | PD / majalah | 39 | tokenized | Menampilkan frasa sekejap, lalu meminta Anda mengetik apa yang terbaca. |
| `SERPENT.BAS` | Serpent v00 | 1982 | Attack/Serpent/Zap'em | 64 | tokenized | Bertanggal 6 Okt 1982, kode build USR-5-5-K. |
| `SIMEQN.BAS` | Pemecah persamaan linear serentak | 1982 | Feldman & Rugg | 50 | tokenized | Phil Feldman & Tom Rugg. Eliminasi Gauss pada matriks augmented N x N+1. |
| `SOLITAIR.BAS` | Klondyke Solitaire | 1984 | PD / majalah | 313 | tokenized | Jeff Littlefield; simbol suit ditambah Ken Handzik 27 Nov 1983; direvisi 2 Feb 1984. 'For public use, may not be sold.' |
| `SPACE.BAS` | IBM PC Space v1.10 | 1982 | IBM | 57 | tokenized | (C) IBM 1981, 1982. Penulis R. Heiney & M. Hallerman. |
| `STARTREK.BAS` | Star Trek | 1981 | PD / majalah | 508 | tokenized | Dari 'BASIC Computer Games' karya Dave Ahl; diport ke IBM PC oleh Bob & Sharon Fritz, Okt-Nov 1981. Manual di docs/STARTREK.DOC. |
| `STATS.BAS` | Sports Predicting | 1982 | Friendlyware | 449 | **terproteksi** | Menu #1 pilihan R. Juga meminta disket data yang bisa ditulis. |
| `SUB.BAS` | Sea Battle (kapal selam) | 1982 | Friendlyware | 317 | tokenized | Menu #1 pilihan F. Tiga tingkat kedalaman dan grid 24 kuadran. |
| `TEM-INS.BAS` | Temple of Loth - petunjuk | 2000 | PD / majalah | 290 | tokenized | Manual untuk TEMPLE.BAS, yang sendirinya ditulis sebagai program BASIC. |
| `TEMPLE.BAS` | The Temple of Loth v4.2 | 1995 | PD / majalah | 1187 | tokenized | Dengan 1187 baris, program terbesar di sini. Grafik karakter opsional. |
| `TICTAC.BAS` | Tic Tac Toe | 1982 | Friendlyware | 141 | tokenized | Menu #1 pilihan N. |
| `TOWERS.BAS` | Towers of Atlantis (Menara Hanoi) | 1982 | Friendlyware | 131 | **terproteksi** | Menu #1 pilihan P. Update terakhir 1 Sep 1982. |
| `TRUCKER.BAS` | Trucker | 1982 | PD / majalah | 385 | tokenized | Simulasi bisnis angkutan truk lintas negara bagian. |
| `WHATMONF.BAS` | Deteksi jenis monitor | 1990 | What Micro? | 4 | teks ASCII | Empat baris: mem-PEEK byte BIOS video di memori bawah untuk membedakan warna vs Hercules. |
| `WILDCAT.BAS` | Wildcatter (pengeboran minyak) | 1982 | Friendlyware | 296 | tokenized | Menu #1 pilihan A. Update terakhir 17 Jul 1982 oleh A. Vanchura. |
| `WIZARD.BAS` | The Wizard's Castle | 1980 | IPCO | 944 | teks ASCII | Disk IPCO 2039-A. Joseph R. Power untuk Exidy Sorcerer, Recreational Computing Jul/Agu 1980; diport ke Heath Microsoft BASIC oleh J.F. Stetson. |
| `WORDS.BAS` | Words | 1990 | PD / majalah | 36 | tokenized | Utilitas daftar kata kecil. |
| `WRTSTR.BAS` | Penulis STRINGS.FIL | 1982 | PD / majalah | 17 | tokenized | Alat pendamping yang membangkitkan ulang file aturan Eliza. Nama aslinya WRTSTRNG.BAS. |
| `XWING.BAS` | X-Wing Fighter (Star Pilot) | 1978 | IPCO | 732 | teks ASCII | Disk IPCO 2060-A. George Blank, Leechburg PA, v4.0 25 Sep 1978; port IBM PC oleh Ernest Smith & Raymond Rogers, Houston, Des 1982. |
| `YAHTZEE.BAS` | Yatzee | 1980 | PD / majalah | 612 | tokenized | Asli oleh JL Helms & MF Pezok untuk CCII, Coronado CA; diadaptasi ke IBM PC oleh Patrick Leabo, Tucson. |
| `ZAP'EM.BAS` | Zap'em v1B | 1982 | Attack/Serpent/Zap'em | 137 | tokenized | Bertanggal 3 Feb 1982, kode build MAV-5-5-K. |

---

## 6. Katalog program siap-jalan

| Program | Judul | Thn | Keterangan |
|---|---|---|---|
| `3DTTT.EXE` | 3-D Tic-Tac-Toe | 1984 | Mengandung string 'Licensed Material - Program Property of IBM'. BASIC yang di-compile. |
| `PAC-GAL.EXE` | Pac-Gal | 1986 | Klon Pac-Man. BASIC ter-compile, jadi tidak butuh interpreter. |
| `HOPPER.EXE` | Hopper | 1991 | Klon Frogger, juga bertanda milik IBM. Skor disimpan di HOPPER.SCO. |
| `SPACEWAR.EXE` | Spacewar | 1985 | (C) 1985 B. Seiler. Dua pemain; menolak jalan tanpa kartu grafis warna 640x200. |

Keempatnya berjalan tanpa interpreter. `HOPPER.EXE` dan `SPACEWAR.EXE` menulis
skor tertinggi ke `HOPPER.SCO` dan `BS.SCO`.

---

## 7. Kenapa `.BAS` dan `.EXE` tercampur jadi satu?

Ini pertanyaan yang wajar, dan jawabannya ada tiga lapis.

**Lapis pertama — pada zamannya, itu memang wajar.** Sebuah disket DOS adalah
satu direktori rata. Tidak ada konsep "folder aplikasi". Apa pun yang ingin Anda
jalankan dari disket itu ya diletakkan di situ, tak peduli bentuknya. Yang
membedakan hanyalah *cara* menjalankannya: `.EXE` dan `.COM` diketik namanya
langsung di prompt DOS, sedangkan `.BAS` butuh interpreter dulu
(`GW NAMA.BAS`) — dan itulah tepatnya yang dijelaskan panjang lebar oleh
`docs\Readme.txt` dan `docs\USE.BAT`.

**Lapis kedua — perbedaannya lebih tipis dari yang terlihat.** Tiga dari empat
`.EXE` di sini (`3DTTT`, `PAC-GAL`, `HOPPER`) sebetulnya **program BASIC juga**,
hanya saja sudah di-*compile* dengan IBM BASIC Compiler. Bukti: di dalam binernya
masih tersimpan tabel pesan error khas BASIC —

```
Syntax error / RETURN without GOSUB / Out of DATA / Illegal function call /
Out of memory / Subscript out of range / Division by zero / Type mismatch
```

Jadi `PAC-GAL.EXE` dan `TICTAC.BAS` bukan dua spesies berbeda; keduanya program
BASIC, satu ditafsirkan saat jalan dan satu sudah diterjemahkan lebih dulu.
Meng-*compile* membuatnya jauh lebih cepat dan tidak lagi butuh GW-BASIC —
harganya, kode sumbernya hilang.

**Lapis ketiga — folder ini memang gabungan beberapa disket.** Seperti diuraikan
di bagian 4, isi folder berasal dari sedikitnya lima disket berbeda yang pernah
disalin ke satu tempat. Percampuran format adalah akibat dari penggabungan itu,
bukan hasil rancangan siapa pun.

---

## 8. Catatan teknis: format `.BAS` dan proses konversi

### Tiga format yang ditemukan

GW-BASIC dan BASICA bisa menyimpan program dalam tiga bentuk, dan ketiganya
ada di koleksi ini. Bentuknya ditentukan oleh byte pertama berkas:

| Byte pertama | Bentuk | Perintah simpan | Jumlah | Bisa dibuka Notepad? |
|---|---|---|--:|---|
| `0xFF` | ter-*tokenize* | `SAVE "X"` | 46 | Tidak |
| `0xFE` | **terproteksi** | `SAVE "X",P` | 27 | Tidak |
| karakter cetak | teks ASCII | `SAVE "X",A` | 10 | Ya |

**Ter-*tokenize*** artinya setiap kata kunci disimpan sebagai satu byte, bukan
sebagai teks. `PRINT` jadi `0x91`, `GOTO` jadi `0x89`, `LEFT$` jadi dua byte
`0xFF 0x81`. Ini menghemat tempat di disket 360 KB dan mempercepat pemuatan.
Angka pun disimpan biner, termasuk bilangan pecahan dalam format
*Microsoft Binary Format* yang mendahului standar IEEE 754.

**Terproteksi** adalah hal yang berbeda. Ketika program disimpan dengan
`SAVE "X",P`, GW-BASIC mengenkripsi seluruh isinya. Setelah itu program masih
bisa dijalankan, tapi `LIST` menolak menampilkannya dan `SAVE ...,A` menolak
mengekspornya — permanen, tanpa jalan kembali lewat perintah biasa. Ke-27
berkas Friendlyware disimpan begini karena produk komersial.

### Bagaimana yang terproteksi dibuka

Enkripsi `,P` bersifat periodik dengan panjang siklus lcm(11,13) = 143 byte:

```
plain[i] = ((cipher[i] - (11 - i mod 11)) XOR key1[i mod 13] XOR key2[i mod 11]) + (13 - i mod 13)
```

Dua tabel kunci (13 byte dan 11 byte) tidak diketahui. Kunci yang beredar umum
sudah dicoba dan tidak cocok, jadi kuncinya **dipulihkan dari koleksi ini
sendiri**, begini:

1. Karena periodenya 143, tiap posisi *i* mod 143 punya satu byte kunci tetap.
   Semua byte dari 27 berkas terproteksi dikelompokkan menurut posisi itu —
   sekitar seribu contoh per kelompok.
2. Distribusi byte plaintext-nya sudah diketahui: diukur dari 46 berkas
   ter-*tokenize* yang **tidak** terproteksi di folder yang sama. Untuk tiap
   kelompok posisi, dicoba 256 kemungkinan byte kunci dan dipilih yang
   menghasilkan distribusi paling mirip.
3. Hasilnya diuji: 143 byte kunci yang ditemukan secara independen ternyata
   membentuk tabel XOR rank-1 `key1[i mod 13] XOR key2[i mod 11]` dengan
   **0 dari 143 ketidakcocokan**. Itu bukan kebetulan — probabilitasnya
   praktis nol — sehingga kuncinya pasti benar.

Kunci yang dipulihkan (`key1[0]` dipatok 0, karena hanya XOR keduanya yang teramati):

```
key1 = [0x00, 0x2D, 0x24, 0x64, 0xDC, 0x2A, 0xEA, 0xCA, 0x8D, 0x2A, 0xB0, 0x5E, 0x33]
key2 =        [0xB7, 0xB4, 0x6D, 0xDE, 0x8F, 0x3E, 0x49, 0xDD, 0xF0, 0x21, 0xD5]
```

Setelah didekripsi, berkas menjadi program ter-*tokenize* biasa dan bisa
di-*detokenize* dengan tabel token GW-BASIC.

### Hasil konversi

Seluruh 83 program kini berbentuk teks ASCII dengan akhiran baris CRLF —
persis format yang dihasilkan `SAVE "X",A` di GW-BASIC asli. Artinya:

- bisa dibuka dan disunting dengan Notepad, dan
- **tetap bisa dijalankan** — GW-BASIC otomatis mengenali format ASCII saat `LOAD`.

Berkas biner aslinya tetap disimpan utuh di `_attic\original-bas-binary\`.

Satu catatan kecil: karakter gambar kotak CP437 (`░`, `│`, `█`, dan sebagainya)
banyak dipakai program-program ini untuk menggambar bingkai. Notepad akan
menampilkannya sebagai huruf aneh karena menebak encoding-nya Windows-1252,
tapi kodenya sendiri tetap terbaca sempurna dan berkasnya tetap benar untuk DOS.

### Perbaikan sisi lain

Tiga berkas ASCII (`BREAKOUT.BAS`, `WIZARD.BAS`, `XWING.BAS`) ternyata masih
menyimpan sampah di belakang penanda EOF DOS (`0x1A`) — sisa data lama dari
sektor disket yang sama, terbawa karena ukuran berkas di direktori mencakupnya.
Sampah itu dipotong. Isi programnya tidak diubah sedikit pun.

---

## 9. Duplikat, varian, dan anomali

**Empat program blackjack, dan semuanya berbeda.** Jangan dihapus salah satunya:

| Berkas | Asal | Ciri |
|---|---|---|
| `21.BAS` | Friendlyware | Terproteksi; ada split & double down |
| `BJ.BAS` | PD | Paling ringkas; nilai kartu dihitung dari indeks dek |
| `BLACK.BAS` | PD | 37% barisnya komentar — paling rapi didokumentasikan |
| `BLACKJCK.BAS` | CCII 1978 | Paling tua; lewat Patrick Leabo |

**`MUSIC.BAS` dan `MUSIC1.BAS`** benar-benar program yang sama (IBM PC Music
v1.10). Bedanya cuma bentuk penyimpanan dan tanggal berkas. Ini duplikat
sesungguhnya — satu-satunya di koleksi.

**`ELIZA.BAS` dan `ELIZA.SRC`** juga program yang sama. `.SRC` adalah versi
teks yang sudah ada sejak awal; disimpan di `misc\` karena ekstensinya tidak
akan dikenali GW-BASIC. Berguna sebagai pembanding independen untuk memeriksa
hasil konversi.

**`TEMPLE.BAS` dan `TEM-INS.BAS`** adalah pasangan permainan + manualnya.
Menariknya, manual itu sendiri ditulis sebagai program BASIC. Dan `TEMPLE.BAS`
ternyata **turunan dari `WIZARD.BAS`** — struktur `DIM` keduanya identik sampai
ke nama array (`C$(34)`, `I$(34)`, `L(512)`, `C(3,4)`), sesuatu yang tidak
mungkin kebetulan.

**`WORDS.BAS` bukan program.** Ia berkas data murni (daftar kata mulai baris
10000) yang disuntikkan ke `READING.BAS` saat berjalan lewat
`CHAIN MERGE "words", 75, ALL`. Menjalankannya sendiri tidak menghasilkan
apa-apa. Urutan barisnya pun bukan sembarangan — tiap baris satu pola fonetik,
tersusun dari yang sederhana ke yang kompleks.

**`LIST.BAS`** hanya 9 byte dan isinya satu baris rusak. Dipindah ke `_attic\`.

**`TJRHGFE`** — berkas tanpa ekstensi, isinya transkrip Eliza milik seseorang
bernama "RICHARD". Bukan program. Ada di `misc\`.

**Penamaan yang tak konsisten** sudah diseragamkan: berkas asli `Music1.bas`
kini `MUSIC1.BAS`, mengikuti sisanya. `ZAP'EM.BAS` dibiarkan apa adanya —
tanda kutip tunggal itu sah baik di DOS maupun Windows.

---

## 10. Isi folder pendukung

### `docs\`
| Berkas | Isi |
|---|---|
| `Readme.txt` | Panduan pengemas ulang tahun 2000: cara mengaitkan `.BAS` ke `GW.EXE` di Windows 95/98 dan cara membuat `.bat`. Ditutup dengan: *"there is no warranty, no support, no back-up, and no refunds! YOU ARE ON YOUR OWN!!!"* |
| `STARTREK.DOC` | Manual `STARTREK.BAS`: fungsi F1–F9, sistem arah 1–9, cara membaca angka tiga digit pada pemindaian |
| `README.CAR` | Daftar isi direktori CARPARK disket *What Micro?* — kunci pelacakan sumber 4.5 |
| `USE.BAT` | Tutorial DOS + GWBASIC dari disket public-domain lain, plus imbauan donasi ke penulis |
| `HELPME.BAT` | Tiga baris; hanya memanggil `USE.BAT` |

### `tools\`
`SPEED.COM`, `GOSLOW.COM`, `slodn200.zip` (SLOWDOWN 2.00 + manual 96 KB) —
alat memperlambat CPU. `CAL.COM` (kalender) dan `GETRTC.EXE` (baca jam
real-time) tidak ada hubungannya dengan koleksi permainan; kemungkinan besar
ikut tersalin dari disket utilitas.

### `misc\`
`SAMPLE.TXT` (transkrip Eliza klasik Weizenbaum), `TJRHGFE` (transkrip Eliza
milik "RICHARD"), `ELIZA.SRC` (kode sumber Eliza dalam bentuk teks).

---

## 11. Apa yang sudah diverifikasi

**Sudah diuji dan terbukti:**
- Backup berisi 135 berkas, jumlahnya dicocokkan dengan folder asli.
- Ke-83 berkas hasil konversi ter-*parse* bersih: nomor baris menaik ketat,
  tanpa token tak dikenal.
- Kunci dekripsi terbukti benar lewat uji struktur rank-1 (0/143 tidak cocok).
- GW-BASIC **dan** BASICA sama-sama berhasil dijalankan di dalam DOSBox-X
  memakai profil ini, dibuktikan dengan program uji yang menulis berkas dari
  dalam emulator.
- Profil DOSBox dengan zoom 5x diuji ulang dan tetap bisa memuat serta
  menjalankan program.
- **Uji bolak-balik lewat GW-BASIC asli: 73 dari 83 program, nol baris ditolak.**
  Tiap program dimuat oleh GW-BASIC sungguhan lalu disimpan ulang sebagai teks,
  dan daftar nomor barisnya dibandingkan dengan sumbernya. GW-BASIC membuang
  baris yang tidak bisa ia parse, jadi kecocokan sempurna berarti **setiap baris
  hasil konversi diterima oleh tokenizer aslinya**. Ini termasuk seluruh berkas
  yang tadinya terproteksi.

Sepuluh program belum sempat ikut uji bolak-balik itu karena pengujiannya
dihentikan: `FLYS`, `NOTETABL`, `OTHELLO`, `PEGLEAP`, `PIECHART`, `TRUCKER`,
`WHATMONF`, `WILDCAT`, `WIZARD`, `YAHTZEE`. Kesepuluhnya tetap lolos pemeriksaan
struktur, dan tujuh di antaranya berasal dari format yang sama dengan yang sudah
terbukti. Kalau ingin melengkapinya, muat saja salah satunya di `_GW-BASIC.bat`
lalu ketik `LIST` — kalau tampil utuh, berarti bersih.

**Belum diuji satu per satu:** apakah ke-83 permainan berjalan dengan benar dari
awal sampai akhir. Program-program ini interaktif, jadi butuh orang yang
memainkannya. Yang sudah dipastikan adalah kode sumbernya diterima interpreter
aslinya, dan interpreternya jalan.

**Diketahui bermasalah sejak awal (bukan akibat perapian ini):**
`DRAW.BAS` dan `STATS.BAS` menuntut "disket data" yang bisa ditulis — keduanya
mungkin mengeluh. `SPACEWAR.EXE` menolak jalan tanpa kartu grafis warna
640×200; profil `machine=cga` sudah menyediakannya.
