# 3DTTT.EXE — arsitektur pemrograman

`3-D Tic-Tac-Toe`, 1984, IBM BASIC Compiler. Judul internalnya **`LU's 3D Game`** —
nama yang tidak muncul di mana pun dalam katalog koleksi.

Direkonstruksi dari 2.322 panggilan runtime, 1.205 pernyataan, cakupan region kode
99,4%. **87% operasinya sudah bernama.**

## 1 · Bentuk program: mesin hitung, bukan mesin gambar

| kelompok | operasi | porsi |
|---|---|---|
| **aritmetika** | `LET!` 426, `LOAD!` 297, `ARITH!` 233, `FACSTORE!` 95, `MULDIV!` 75, `FACLOAD!` 38 | **50%** |
| tampilan | `PRINT` 198, `LOCATE` 154, `COLOR` 115, `PRINT_BEGIN` 111, `CHR$` 39 | 27% |
| subrutin | `GOSUB` 96, `RETURN` 27 | 5% |
| belum bernama | 303 | 13% |

Separuh program adalah aritmetika *single-precision*. Untuk permainan yang papannya
cuma 4×4×4 dan bidaknya `X`/`O`, itu tidak wajar — kecuali kalau programnya
**mengevaluasi posisi**.

Teks di dalam biner menegaskannya: `COMPUTER'S TURN`, `Please Wait`,
`Please enter how many players? (0-2)`. Nol pemain berarti komputer melawan dirinya
sendiri. `Please Wait` muncul tepat sebelum giliran komputer.

## 2 · Alur kendali

```
IF / lompatan maju     679
GOTO mundur             46
loop (kond. mundur)     10
GOSUB                   96 panggilan -> 31 target berbeda
```

**679 percabangan melawan 10 loop.** Programnya hampir seluruhnya keputusan, bukan
pengulangan. Itu bentuk khas penilai posisi: periksa garis, periksa garis, periksa garis.

Papan 4×4×4 punya 76 garis kemenangan. Angka `GOSUB` (31 target) dan kepadatan
percabangan konsisten dengan pemeriksaan garis yang dipanggil berulang dari beberapa
tempat — tapi pemetaan target ke fungsi permainan **belum dikerjakan**.

Kedalaman bersarang nol — semua loop datar. Pengulangan dibangun dari `GOTO`, khas
BASIC bernomor baris.

## 3 · Tampilan: teks berwarna, bukan grafis

```
LOCATE 22, 2      LOCATE 22, 5      COLOR 15, 0
```

`LOCATE` selalu tepat 2 argumen (154 panggilan), `COLOR` 1–3 (115). Tidak ada `DRAW`,
tidak ada primitif grafis — 3DTTT berjalan di mode teks.

`CHR$` dipakai 39 kali, dan nilainya mengungkap fungsinya: 24, 25, 26, 27 adalah panah
↑↓→← CP437, untuk legenda tombol kursor. [`menu-block.bas`](menu-block.bas)
merekonstruksi blok itu utuh:

```
 1   HELP        ^  UP
 2   SAVE        v  DOWN
 3   LOAD        <  LEFT
  4  NEW GAME    >  RIGHT
```

## 4 · Jebakan event dan papan ketik

Dua vektor dipasang saat startup (image 35125):

```asm
mov word ptr [0x0C], 0x2447   ; INT 3  -> titik periksa jebakan event
mov word ptr [0x24], 0x24A1   ; INT 9  -> handler papan ketik
```

Handler `INT 9` membaca port 60h, menguji scancode `0x3B` (F1) dan menghitung **10
tombol** — implementasi `ON KEY(1..10)`. Cocok persis dengan teks bantuannya:
*"(F1) is for instructions, (F2) save, (F3) load, (F4) start a new game, and (F10) is
to end the game"*.

**1.643 titik `INT 3`** di seluruh program — satu byte per titik alih-alih far call lima
byte. Penghematan 6,5 KB pada program 57 KB. Lihat [`../EVENT-TRAPS.md`](../EVENT-TRAPS.md).

## 5 · Format berkas simpanan

Salah satu literal di dalam biner:

```
O 1,1,1,3,3,2,1,1,2,4,4,1,1,1,3,1,1,4,1,2,2,2,2,3
```

Bidak `O` diikuti koordinat tiga angka (bidang, baris, kolom) di papan 4×4×4.
Simpanannya adalah **riwayat langkah**, bukan gambar papan. Itu konsisten dengan `F2`
simpan / `F3` muat di legenda tombol.

*Catatan: ini pembacaan dari bentuk literalnya, belum dikonfirmasi terhadap berkas
simpanan sungguhan.*

## 6 · Yang belum dipastikan

- **303 panggilan (13%) belum bernama.** Terbanyak `RT#16`/`RT#17` (30 masing-masing),
  keduanya operasi string.
- **4 nama masih `__maybe`** — `CINT`, `NEG!`, `STROP`, `STROUT`. Hanya satu jenis
  bukti; lihat [`../name-evidence.json`](../name-evidence.json).
- **105 byte dalam 12 rentang** terbaca sebagai kode tapi tak terjangkau penelusuran.
- Pembagian kerja 31 target `GOSUB` belum dipetakan ke fungsi permainan.
