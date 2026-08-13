# 3DTTT.EXE — status dekompilasi

`3-D Tic-Tac-Toe`, 1984, IBM BASIC Compiler. 57.472 byte, 2.357 relokasi.
Program terbesar dari tiga EXE BASIC di koleksi ini.

```
kode game     0 .. ~26.400   (2.345 far call, 87 entry point runtime)
runtime      ~26.400 .. 47.744
basis string  image 18.564   (seg 0488)
```

## Yang sudah terpecahkan

**62 lokasi panggilan membawa literal string yang sudah tertaut** — jauh lebih banyak
dari HOPPER (31). Ini membuat 3DTTT jadi kandidat terbaik untuk rekonstruksi.

### Entry point teridentifikasi

| RT# | offset | peran | bukti |
|---|---|---|---|
| RT#5 | `065C:2893` | `PRINT` (string) | menerima `'HELP '`, `'!!!   DRAW   !!!'` |
| RT#11 | `065C:28A7` | `PRINT` varian | menerima `'Please make your move:'` |
| RT#4 | `065C:29A5` | **pembuka pernyataan `PRINT`** | menolkan `[82C]`,`[616]`,`[82D]` lalu `retf` |
| RT#37 | `065C:2646` | `INPUT` berprompt | menerima `'Please enter your name? '` |
| RT#19 | `065C:0BC8` | penugasan string | menerima `'COMPUTER'` |
| RT#12 | `065C:0802` | penempatan layar | `mov cl,bl` → helper `0x6E8B` |
| RT#13 | `065C:081C` | penempatan layar (pasangan) | jalur sama, plus bingkai error `[604]` |
| RT#1 | `065C:0D0C` | `SGL.COPY` | `movsw ×2; sub di,4; sub si,4; retf` |

### Temuan kunci: `INT 3` sebagai titik jebakan event

*(Bagian ini dikoreksi di iterasi #2. Kesimpulan awal — bahwa `0xCC` adalah argumen
inline — salah. Lihat [`../EVENT-TRAPS.md`](../EVENT-TRAPS.md).)*

Byte `0xCC` sesudah tiap `lcall` adalah `INT 3` yang **benar-benar dieksekusi**.
3DTTT memasang vektornya di image 35125, bersama vektor INT 9:

```asm
mov word ptr [0x0C], 0x2447   ; handler INT 3
mov word ptr [0x0E], cs
mov word ptr [0x24], 0x24A1   ; handler INT 9 = papan ketik
mov word ptr [0x26], cs
```

Handler INT 3 (`065C:2447`):

```asm
cmp byte ptr [0x678], 0    ; jebakan event aktif?
jne handler_body
iret                        ; tidak → no-op
```

Titik pemeriksaan `ON KEY`/`ON TIMER` seharga 1 byte. Ada **1.643** di 3DTTT.

Handler INT 9 (`065C:24A1`) membaca port 60h, menguji scancode `0x3B` (F1), dan
menghitung 10 tombol — implementasi `ON KEY(1..10)`, cocok persis dengan teks bantuan
program tentang F1–F10.

Untuk rekonstruksi, tiap `0xCC` menandai **batas pernyataan**.

## Rekonstruksi: blok menu (offset 13.532–14.223)

Pola di assembly-nya berulang rapi:

```asm
 13562  mov  bx, 0x6256     ; = ' 1'
 13565  lcall RT#5          ; PRINT
 13570  int  3              ; titik jebakan event = batas pernyataan
 13571  mov  bx, 0xb        ; 11
 13574  lcall RT#12
 13579  mov  bx, 6
 13582  lcall RT#13
 13587  db   0xCC
 13588  lcall RT#4          ; buka pernyataan PRINT berikutnya
 13593  mov  bx, 0x625c     ; = 'HELP '
 13596  lcall RT#5          ; PRINT
```

Pasangan `RT#12`/`RT#13` bergantian `(3,0)` dan `(11,6)` sepanjang blok, sementara
string bergantian antara nomor dan label. Bentuk BASIC-nya dua kolom:

```basic
PRINT ... " 1"  ...  "HELP "
PRINT ... " 2"  ...  "SAVE "
PRINT ... " 3"  ...  "LOAD "
PRINT ... "  4" ...  "NEW GAME "
PRINT ... "UP "      "DOWN "  "LEFT "  "RIGHT "  "ENTER "  "  10"  "END "
```

menghasilkan menu:

```
  1     HELP
  2     SAVE
  3     LOAD
   4    NEW GAME
```

**Yang belum pasti:** apakah pasangan `(3,0)`/`(11,6)` itu `LOCATE baris,kolom`,
`COLOR depan,belakang`, atau `TAB`. Keduanya masuk ke helper `0x6E8B` yang sama
lewat dua pintu berbeda. Menentukannya butuh pembacaan `0x6E8B` sampai ke port CRTC —
belum dikerjakan. Karena itu rekonstruksi di atas **belum bisa dijalankan apa adanya**;
struktur dan teksnya benar, penempatannya belum.

## String yang terpulihkan

Lihat [`assets.md`](assets.md) — 68 literal teks. Yang paling menjelaskan isi program:

```
Please enter how many players? (0-2)
Please enter name of first player?
Please enter name of second player?
would you like to move first? (Y/N)
would you like to use 'X' or 'O'? (X/O)
Would you like to use cursors input? (Y/N)
Please make your move:      Please remake your move:
COMPUTER'S  TURN            Please Wait
LAST MOVE:   MADE BY:
!!!   WIN   !!!             !!!   DRAW   !!!
Would you like to play again? (Y/N)
LU's   3D   Game
```

`LU's 3D Game` adalah judul internal program — nama yang tidak muncul di mana pun
dalam katalog koleksi.
