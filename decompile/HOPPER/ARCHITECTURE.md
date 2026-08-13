# HOPPER.EXE — arsitektur pemrograman

`Hopper`, 1991, klon Frogger. Bertanda `Licensed Material - Program Property of IBM`.
Skor tertinggi disimpan ke `hopper.SCO`.

Direkonstruksi dari 745 panggilan runtime, **208 pernyataan**, cakupan region kode
**99,9% — tertinggi dari ketiganya**. 73% operasinya bernama.

## 1 · Bentuk program: simulasi

| kelompok | operasi | porsi |
|---|---|---|
| **aritmetika** | `ARITH!` 81, `FACSTORE!` 69, `LET!` 57, `MULDIV!` 57, `LOAD!` 55, `FACLOAD!` 26 | **48%** |
| tampilan | `PRINT` 37, `PRINT_BEGIN` 30, `LOCATE` 28 | 13% |
| string | `LET$` 19 | 3% |
| FAC lain | `FACOP!` 24, `FACTEST` 7 | 4% |
| belum bernama | 200 | 27% |

Hampir separuh aritmetika *single-precision*, tapi tampilannya cuma 13% — **kebalikan
PAC-GAL**. HOPPER menghitung posisi benda bergerak (kendaraan, batang kayu) dan
menggambarnya lewat jalur yang belum sepenuhnya terpetakan.

## 2 · Alur kendali: paling banyak berulang

```
loop (kond. mundur)     22    <- terbanyak dari ketiganya
IF / lompatan maju     201
GOTO mundur             16
GOSUB                    2 target
```

**22 loop melawan hanya 2 target `GOSUB`.** Struktur HOPPER dibangun dari pengulangan
di tempat, bukan pemanggilan subrutin — masuk akal untuk simulasi: tiap jenis benda
bergerak punya loopnya sendiri.

Loop terpanjang 125 byte; semua datar (kedalaman bersarang nol).

## 3 · Grafis: `DRAW`, bukan `PRINT`

Berbeda dari kedua game lain, HOPPER menyimpan **string makro `DRAW`**:

```
C1RFL3BL3L0BL2R0BR11R0BR2DL2BL2L5BL2L2FBR3R5BR3GL0BL2L5BL2FR7GL5R5BFBRL0BL2L5BL2DR9DBL3L3BL3DL2BR11R2
C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF28
R5FL8GRBR5R0BR4DBL4L0BL5LGR2BR5R0BR5R2FRL17GR19FL21DR21BDBLL4BL10L4BFBR2L2BR14R2BR2BE10
L5GR8FLBL5L0BL4DBR4R0BR5RFL2BL5L0BL5L2GLR17FL19GR21DL21BDBRR4BR10R4BGBL2R2BL14L2BR26BE10
```

Empat sprite. **Dua terakhir adalah cermin satu sama lain** — perhatikan `R5FL8GR`
melawan `L5GR8FL`: tiap arah dibalik. Itu kendaraan menghadap kiri dan kanan.
Semuanya bisa dipakai ulang verbatim di `DRAW` GW-BASIC.

> [!NOTE]
> **Ditambahkan saat porting web (10 Agustus 2026).** Panen ulang untuk port-nya
> menemukan **enam** string, bukan empat: `S3$` sampai `S8$`. Keenamnya
> byte-identik dengan deskriptor di biner dan tersimpan di
> `web/games/hopper/hopper-data.js`.
>
> Catatan yang lebih penting untuk siapa pun yang mau memakainya: makro-makro ini
> **sprite CGA seukuran 11 × 10 piksel**. Port webnya sempat menafsirkannya
> sungguhan dan menggambar hasilnya ke layar seukuran jalur — hasilnya coretan,
> bukan gambar. Ia berguna sebagai **bukti**, bukan sebagai aset yang bisa
> diperbesar. Lihat [`../../web/docs/hopper.md`](../../web/docs/hopper.md) §3.

Ditambah satu melodi `PLAY`: `P2L8C.CL16CL8D.GL16FL8EL4C`.

Program memeriksa perangkat keras dan bisa menolak jalan:
`Color/graphics adaptor not available` / `Switching to Color/Graphics Adaptor ...`.

## 4 · Rutin `CALL ABSOLUTE`: scroller horizontal CGA

Empat blok `DATA`, 228 byte total, ternyata **satu rutin bersambung** — didisassembly
sebagai satu blok menghasilkan 74 instruksi dengan hanya 1 byte tak terdekode.

Isinya **scroller horizontal CGA** untuk jalur lalu lintas:

```asm
 22  mov  ax, 0xB855          ; segmen VRAM CGA
 63  mov  bx, 0x1E0           ; 480 byte per jalur (6 scanline x 80)
 70  mov  cs:[0x10], 2        ; 2 bank scanline CGA
 84  std                      ; arah mundur bila kecepatan negatif
101  mov  ax, [di]            ; simpan word tepi
106  rep  movsw               ; geser 31 word = 62 byte
108  mov  [si+2], ax          ; kembalikan di sisi lain -> MELINGKAR
144  add  bx, 0x2000          ; +8192 = bank CGA satunya
```

Rutin ini **memodifikasi dirinya sendiri**: menulis ke `cs:[0x10]`–`cs:[0x13]`, alamat
di dalam blok parameternya sendiri. Itulah cara BASIC mengoper argumen — `POKE` nilainya
ke dalam kode, lalu `CALL`.

Blok parameter di offset 3–19 adalah **tabel kecepatan per jalur**:

```
+1, -1, +2, -1, +2, 0, +1, -1, +2, -2, -1, 0, ...
```

Tiap jalur bergerak dengan kecepatan berbeda, arah bergantian, beberapa diam — persis
jalur lalu lintas Frogger.

Kenapa di assembly: `rep movsw` memindahkan 62 byte dalam satu instruksi. Di BASIC itu
berarti loop `POKE`/`PEEK` per byte, ratusan kali lebih lambat, sementara gulir harus
selesai dalam satu frame.

Rincian lengkap: [`DATA-BLOCKS.md`](DATA-BLOCKS.md).

## 5 · Yang membedakan HOPPER dari dua lainnya

| | 3DTTT | PAC-GAL | HOPPER |
|---|---|---|---|
| jebakan `INT 3` | 1.643 titik | 510 titik | **tidak ada** |
| handler `INT 9` sendiri | ya | ya | **tidak** |
| panggilan lewat tabel stub | 197 | 930 | **36 dari 745** |
| grafis | teks berwarna | `PRINT` string | **`DRAW`** |
| alamat FAC | `0xB4` | — | **`0xB2`** |

HOPPER tidak memasang jebakan event maupun handler papan ketik sendiri; ia memakai
rutin runtime biasa (bingkai error + `INT 16h`). Itu perbedaan codegen yang nyata —
kemungkinan versi atau opsi compiler berbeda, konsisten dengan tahunnya (1991 versus
1984 dan 1986).

*Catatan: kesimpulan awal bahwa HOPPER juga tidak punya tabel stub ternyata salah —
lihat [`../NEGATIVE-RESULTS.md`](../NEGATIVE-RESULTS.md) §8. Tabelnya ada di
22885–22940, hanya jarang dipakai.*

## 6 · Yang belum dipastikan

- **200 panggilan (27%) belum bernama** — masih porsi terbesar dari ketiga game.
  Penerapan disiplin dua-bukti hanya menghasilkan tiga nama baru (`FACOP!` ×2,
  `FACTEST`); sisanya belum punya bukti kedua yang independen.
- **Segmentasi kini memakai target percabangan** (diperbaiki iterasi #8). Tanpa `INT 3`,
  pemisah pernyataan sebelumnya cuma jarak antar-panggilan >10 byte dan menghasilkan 96
  pernyataan. Memakai **target percabangan** sebagai batas — tiap alamat yang bisa
  dicapai kendali pasti memulai pernyataan — menaikkannya ke **208**, dengan median
  2 operasi per pernyataan, setara PAC-GAL.
- Sisa kode rutin scroller setelah offset 144 (84 byte) belum dianotasi baris per
  baris. **Perilakunya sudah diukur** walau anotasinya belum: dijalankan di
  emulator ia menggeser jalur **8 piksel mendatar**, sekali per bingkai, dan
  offset 5–15 di dalamnya terbaca sebagai tabel kecepatan 11 jalur
  `[1, -1, 2, -1, 2, 0, 1, -1, 2, -2, -1]` — yang keenam nol, median strip.
- **Logikanya tidak pernah membaca VRAM**, diukur dengan kait pada tiap pembacaan
  dari `B800` selama 150 juta instruksi: 21.873 pembacaan total, **0 dari kode
  pengguna**. Itu yang membolehkan port webnya mengganti penggulung dengan animasi
  biasa tanpa mengubah aturan apa pun.
- ~~Format `hopper.SCO` belum diperiksa.~~ **Sudah, dan lulus.** `run/HOPPER.SCO`
  yang ditulis program aslinya pada 2 Agustus 1991 (UTC) dibaca oleh rekonstruksi,
  diurutkan, lalu ditulis kembali dengan **isi identik bita demi bita** sampai
  penanda `0x1A` — 101 bita. Berkas aslinya 128 bita; selisih 27 bita itu padding
  nol karena DOS memadatkan ke blok. Klaimnya **isi-identik**, bukan
  berkas-identik, dan padding nol itu **satu sampel** — belum cukup untuk
  digeneralkan.
