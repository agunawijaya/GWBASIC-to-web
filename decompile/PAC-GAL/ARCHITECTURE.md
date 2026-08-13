# PAC-GAL.EXE — arsitektur pemrograman

`Pac-Gal`, 1986, klon Pac-Man. Kredit internal `Al J. Jiménez, May 1982`. Banner IBM-nya
sudah dipatch orang jadi `Licensed Material Program Property of GHOST`.

Direkonstruksi dari 1.322 panggilan runtime, 208 pernyataan, cakupan region kode 98,4%.
**92% operasinya sudah bernama — tertinggi dari ketiga game BASIC.**

## 1 · Bentuk program: mesin cetak

| kelompok | operasi | porsi |
|---|---|---|
| **tampilan** | `PRINT` 931, `LOCATE` 124, `PRINT_BEGIN` 56, `CHR$` 53, `COLOR` 16 | **91%** |
| string | `LET$` 14 | 1% |
| subrutin | `GOSUB` 3, `RETURN` 9 | 1% |
| belum bernama | 106 | 8% |

**71% dari seluruh operasi adalah satu hal: mencetak item string.** Tidak ada satu pun
operasi aritmetika bernama di daftar teratas.

PAC-GAL tidak menggambar labirinnya dengan primitif grafis. Ia **mencetaknya**, sebagai
rantai `PRINT` string bertitik-koma. Satu pernyataan di offset 971 berisi puluhan item
berturut-turut:

```basic
PRINT_BEGIN : PRINT V09DC$; : PRINT V09F0$; : PRINT ?; : ... : PRINT V09F4$;
```

Itu satu baris labirin. Variabel `V09xx$` menyimpan potongan dinding — dan isinya sudah
terpecahkan: **dibangun saat startup dari `CHR$` dan `STRING$`**, bukan disimpan sebagai
literal. `V09DC$` = `CHR$(219)` █ dinding, `V09F0$` = `CHR$(249)` **∙ pelet**.

Baris di atas karena itu terbaca sebagai: dinding, delapan pelet, dinding samping — satu
koridor. Lihat [`MAZE-TILES.md`](MAZE-TILES.md).

Angka 71% ini bukan kebetulan pengukuran — ia sudah muncul lebih dulu sebagai statistik
tipe operan (68,7% panggilan bertipe `STRING`) sebelum pernyataannya disegmentasi.

## 2 · Alur kendali: paling sederhana dari ketiganya

```
IF / lompatan maju      72
GOTO mundur              4
loop (kond. mundur)      3
GOSUB                    3 target
```

Bandingkan 3DTTT (679 `IF`) dan HOPPER (201). PAC-GAL nyaris lurus.

Loop penggambaran labirin terbaca utuh di offset 161–241:

```asm
221  cmp  word ptr [0x9c6], 0x19   ; pencacah dalam sampai 25 (kolom)
226  jle  213                       ; ulangi
229  mov  ax, [0x9c4]
232  dec  ax                        ; pencacah luar turun (baris)
236  cmp  word ptr [0x9c4], 1
241  jge  161                       ; ulangi
```

Dua pencacah bersarang, 25 kolom per baris — dimensi labirin Pac-Man klasik.

## 3 · Suara

Enam string `PLAY` terpulihkan verbatim, dipanggil lewat tiga entry point berbeda:

```
t255mbl64o1afgao4d
mbl64abceabceebceabceagaa
mbt190o2l8bbbl16cecl8bbp8bbbl16cl8edcc
mbl8t255o4fego3abcdefgo0l1g-g
mbl24o2x        l32o3x
```

Semuanya bisa dipakai ulang apa adanya di GW-BASIC. Lihat [`assets.md`](assets.md).

## 4 · Jebakan event dan papan ketik

Seperti 3DTTT, PAC-GAL memasang `INT 3` (jebakan event) dan `INT 9` (papan ketik) di
image 17528/17538, plus `INT 07h` di 28179. Handler `INT 9`-nya **identik
instruksi-per-instruksi** dengan milik 3DTTT — runtime versi sama.

510 titik `INT 3` di seluruh program.

## 4b · AI hantu yang sebenarnya — dan `I12%`, saklar yang tidak pernah menyala

> Ringkasan siap-pakai dari bagian ini, berikut mode Pac-Man 1980 yang
> dipasang sebagai alternatif, ada di
> [`../../web/games/pacgal/GHOSTS.md`](../../web/games/pacgal/GHOSTS.md);
> geometri labirinnya di
> [`../../web/games/pacgal/GEOMETRY.md`](../../web/games/pacgal/GEOMETRY.md).
> Keduanya dihasilkan mesin dan tidak bisa menyimpang dari kode port.

Ditulis 10 Agustus 2026, saat porting web, sesudah pemilik proyek bertanya:
*"kalau tidak mau seperti Pac-Man 1980, lantas perilaku PAC-GAL 1986 seperti apa
seharusnya?"* Pertanyaannya membuka sesuatu yang terlewat di seluruh 18 iterasi.

### Sasarannya memang satu untuk keempatnya

`I17%`/`I18%` diisi di baris 2980, tepat sesudah pemain digambar:

```basic
2980  ... : I17% = I4% : I18% = I5%      ' sasaran = posisi pemain
```

Tidak ada offset per-hantu di mana pun. Jadi klaim lama — *"satu pengejar untuk
keempatnya"* — **benar**. Yang salah bukan klaimnya, melainkan bahwa ia berhenti di
situ.

### Yang terlewat: hantu di sini TIDAK selalu mengejar

```basic
5210  F2! = RND(2) : IF CSNG(I12%) >= F2! THEN 5270   ' kejar
                     ELSE                    6050     ' JALAN TERUS
6050  I4% = J3%(I6%) + J7%(I6%) : I5% = J4%(I6%) + J8%(I6%)
```

Tiap langkah, tiap hantu melempar dadu. Kalau `I12%` menang, ia mengejar; kalau
tidak, ia **melanjutkan arah yang sedang ditempuhnya**. `J7%`/`J8%` — arah itu —
diundi sekali di baris 1190 dan tidak pernah diubah kecuali saat menabrak sesuatu.

Jadi model geraknya bukan "mengejar", melainkan **berjalan lurus yang sekali-sekali
disela oleh langkah mengejar**. Itu jenis yang berbeda sama sekali dari pembidikan
deterministik Pac-Man.

### Dan mengejarnya pun cuma pada satu sumbu

```basic
5270  IF J7%(I6%) = 0 THEN 5330    ' sedang tidak bergerak vertikal -> kejar baris
5300                    5660       ' sebaliknya                     -> kejar kolom
```

Hantu hanya mengoreksi pada **sumbu yang sedang tidak ia tempuh**. Hantu yang
sedang bergerak mendatar akan menyamakan kolomnya; yang bergerak tegak menyamakan
barisnya. Dari sini datang gerak zig-zag khasnya.

### `I12%` itu adaptif — dan arahnya terbalik dari Pac-Man

| kejadian | akibat pada `I12%` | baris |
|---|---|---|
| awal permainan | `= 0` | 1030 |
| pelet tersisa **< 50** | **dibagi dua** | 3260 → 3320 |
| tamat level (+1 nyawa) | **dibagi dua** | 4260 |
| mati saat pelet masih **> 300** dan `I12% < 0,1` | **dikali dua** | 3560 → 3680 |

Bacalah tabel itu sekali lagi. **Makin dekat Anda ke kemenangan, makin jinak
hantunya.** Kebalikan telak dari *Cruise Elroy* Pac-Man, yang justru mengganas saat
pelet menipis. Dan mati di awal justru **menaikkan** keganasannya.

Ini instans kedua dari tanda tangan rancangan yang sama dengan
[§Temuan 4](../../web/docs/pacgal.md): rumus lama-rentang hantu rentan membagi
dengan `nyawa²`, jadi kehilangan nyawa membuat energizer bertahan lebih lama.
PAC-GAL berulang kali **memberi kompensasi kepada pemain yang sedang kalah** — dua
mekanisme terpisah, satu watak.

### Saklar yang tidak pernah menyala

`I12%` bertipe **bilangan bulat**, dimulai dari `0`, dan satu-satunya operasi
padanya adalah dibagi dua dan dikali dua. Nol dikali dua tetap nol; `CINT(0 * 0.5)`
tetap nol. Tidak ada satu pun pernyataan lain yang mengisinya.

Artinya di dalam rekonstruksi yang bisa di-`RUN`, **`CSNG(I12%) >= RND(2)` tidak
pernah benar, dan hantunya tidak pernah mengejar sama sekali** — mereka berjalan
lurus dan memantul, selamanya.

Apakah itu juga berlaku di biner aslinya **belum bisa dipastikan**, dan dua
kemungkinannya sama-sama masuk akal:

- pernyataan yang mengisi `I12%` termasuk yang **tidak terpulihkan** (208 pernyataan
  yang dipulihkan bukan seluruh program), atau
- ia memang mati di aslinya juga.

Kemungkinan kedua punya pendukung yang kuat dan sudah tercatat sejak lama di tempat
lain: [`../RESIDUE-AND-FILES.md`](../RESIDUE-AND-FILES.md) menemukan blok 85 bita di
`10538`–`10623` yang **isinya AI kejar** — hitung selisih, ambil tanda, melangkah
satu petak — dan **tak terjangkau**: lima hipotesis diuji, semuanya gagal, dan
alamat `10538` tidak pernah muncul sebagai word di mana pun dalam berkas.

Dua hal mati yang saling cocok: **kode kejar yang tak terjangkau, dan saklar kejar
yang tak pernah menyala.** Itu bukan bukti, tapi ia dua petunjuk yang menunjuk ke
arah yang sama, dan keduanya ditemukan lewat jalur yang sepenuhnya terpisah.

> **Yang bisa dibawa.** Klaim lama saya — *"keempat hantu memakai pengejar yang
> sama, pembedanya cuma arah acak awal"* — tidak salah. Ia **berhenti terlalu
> cepat**. Begitu satu kalimat terasa cukup menjelaskan gejalanya (keempat hantu
> menumpuk), saya berhenti membaca, dan tiga mekanisme di baris-baris sesudahnya
> tidak pernah saya lihat: undian kejar-atau-lurus, aturan sumbu tegak lurus, dan
> keganasan adaptif yang berjalan mundur.
>
> Pertanyaan yang membukanya bukan "apa yang salah?" melainkan **"kalau bukan itu,
> lantas apa?"** — pertanyaan yang memaksa jawaban positif, bukan sekadar sanggahan.

---

## 5 · Catatan emulasi

Di bawah emulator `comrun.py`, PAC-GAL berhenti sendiri (`int 0x20`) setelah 88.834
instruksi tanpa mencapai loop permainan — ia menjalankan startup dan loop penggambaran
labirin (offset 26–241) lalu melompat ke kode keluar (12212–12287).

Sebabnya **belum dipastikan**. Program menulis ke port `0x21` (mask PIC),
`0x40`/`0x42`/`0x43` (PIT) dan `0x61`; dugaan bahwa ia menunggu tick timer sudah
**diuji dan gagal** — lihat [`../NEGATIVE-RESULTS.md`](../NEGATIVE-RESULTS.md) §6.

Ini tidak memengaruhi rekonstruksi: cakupan 98,4% dicapai sepenuhnya lewat analisis
statis.

> [!WARNING]
> **Koreksi manual, ditambahkan saat porting web (10 Agustus 2026).**
>
> Kalimat *"tanpa mencapai loop permainan"* di atas **tidak lagi berlaku sebagai
> batas**. Saat menyiapkan port web, EXE-nya berhasil disetir sampai labirinnya
> tergambar penuh, dan layar itu **dipanen jadi data**: `tools/genmaze.py`
> mengambil 24 baris labirin langsung dari layar EXE yang berjalan, dan hasilnya
> dipakai apa adanya sebagai `web/games/pacgal/maze.js`.
>
> Jadi yang benar: emulasinya berhenti sebelum loop permainan, **tetapi sesudah
> loop penggambaran labirin selesai** — dan itu sudah cukup untuk memanen aset
> yang paling berharga dari program ini. Wasitnya 24/24 baris cocok.
>
> Sebab keluar dininya tetap **belum dipastikan**; yang berubah cuma akibatnya,
> yang ternyata jauh lebih kecil daripada yang diduga waktu itu.

## 6 · Yang belum dipastikan

- **88 panggilan (7%) belum bernama.**
> [!NOTE]
> **Catatan porting web, 10 Agustus 2026.** AI hantu di biner ini **satu pengejar
> untuk keempat hantu** — pembedanya cuma nilai acak arah awal. Port webnya
> **tidak** meniru itu: ia memakai empat sasaran berbeda mengikuti konvensi
> Pac-Man 1980, berikut bug arah-atas Pinky dan mode marah Blinky.
>
> Jadi kalau ada yang membandingkan perilaku hantu di port web dengan biner ini
> dan menemukan mereka berbeda: **itu disengaja**, dan alasannya ada di
> [`../../web/docs/pacgal.md`](../../web/docs/pacgal.md). Empat hantu yang
> berperilaku identik terukur menempati **sel yang sama persis** di 120 dari 120
> langkah — bukan empat lawan, melainkan satu lawan yang digambar empat kali.

- **Rentang 85 byte di 10538–10623 sudah dibaca: itu AI hantu** — hitung selisih posisi
  terhadap target, ambil tandanya, melangkah satu petak. Dua tabel per-hantu di `0x964`
  dan `0x994` diindeks `[0x9CE]`. Lihat [`../RESIDUE-AND-FILES.md`](../RESIDUE-AND-FILES.md).
  Kenapa blok ini tak terjangkau penelusuran masih terbuka — tapi lihat
  **§4b**: `I12%`, saklar yang mengaktifkan pengejaran di `.bas`, juga tidak
  pernah menyala. Dua hal mati yang saling cocok, ditemukan lewat jalur terpisah.

- Kenapa program keluar dini di bawah emulasi. **Tetap terbuka**, tapi lihat
  peringatan di §5: akibatnya lebih kecil daripada yang diduga — labirinnya sempat
  tergambar penuh sebelum program berhenti, dan sudah dipanen jadi data.
