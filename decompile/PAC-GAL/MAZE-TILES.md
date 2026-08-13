# PAC-GAL — set ubin labirin

Iterasi loop #14. Menjawab pertanyaan yang sempat menggantung: potongan labirin
**tidak disimpan sebagai literal** di segmen data. Ia dibangun saat startup dari
karakter CP437.

## Dua rutin yang membangunnya

Ditemukan lewat pola argumennya, lalu dinamai dengan dua jenis bukti:

| offset | nama | bukti S (struktur) | bukti A (pola situs panggilan) |
|---|---|---|---|
| 12632 | `CONCAT$` | dua operan string (`bx` dan `ax`), hasil disimpan | selalu diikuti `LET$` yang menyimpan hasilnya |
| 16929 | `STRING$` | `bx` = cacah, `dx` = kode karakter | nilai yang lewat: `(79, 220)`, `(2, 205)` — cacah masuk akal, kode = karakter blok CP437 |

`CHR$` (16645) sudah dinamai lebih dulu.

## Kode pembangunnya

```asm
600  mov  bx, 0xDB      ; 219
603  lcall CHR$
608  mov  dx, 0x9DC
611  lcall LET$         ; V09DC$ = CHR$(219)

617  mov  bx, 0xBA      ; 186
620  lcall CHR$
625  mov  ax, 0x9D8     ; operan kedua
628  lcall CONCAT$
633  mov  dx, 0x9E0
636  lcall LET$         ; V09E0$ = CHR$(186) + V09D8$

733  mov  bx, 2
736  mov  dx, 0xCD      ; 205
739  lcall STRING$
744  mov  dx, 0x9F8
747  lcall LET$         ; V09F8$ = STRING$(2, 205)
```

## Set ubinnya

| variabel | isi | karakter CP437 | peran |
|---|---|---|---|
| `V09D8$` | literal di `0xAA8` | — | pengisi/spasi |
| `V09DC$` | `CHR$(219)` | █ blok penuh | dinding |
| `V09E0$` | `CHR$(186) + V09D8$` | ║ tegak ganda | dinding samping |
| `V09E4$` | `CHR$(196)` | ─ garis datar | dinding |
| `V09F0$` | `CHR$(249) + V09D8$` | **∙ butir** | **pelet yang dimakan** |
| `V09F4$` | `CHR$(219) + V09D8$` | █ + spasi | dinding berjarak |
| `V09F8$` | `STRING$(2, 205)` | ══ datar ganda | dinding |
| `V09FC$` | `CHR$(205)` | ═ | dinding |

Ditambah dua batang panjang yang dibangun terpisah untuk bingkai layar:
`STRING$(79, 223)` = ▀ dan `STRING$(79, 220)` = ▄ — garis atas dan bawah selebar layar.

## Dan baris labirin jadi masuk akal

Pernyataan di offset 971 yang saya baca di iterasi #12:

```basic
PRINT V09DC$; : PRINT V09F0$; ×8 : PRINT V09E0$; : ...
```

Terbaca sebagai: **dinding, lalu delapan pelet, lalu dinding samping** — satu koridor
labirin Pac-Man.

Delapan pengulangan `V09F0$` itu bukan pengulangan buta; itu delapan butir yang harus
dimakan pemain di lorong tersebut.

## Kenapa dibangun, bukan disimpan

Menyimpan labirin sebagai literal memerlukan setiap baris ditulis penuh di sumber BASIC.
Membangunnya dari `CHR$` dan `STRING$` sekali di awal, lalu mencetak variabelnya, jauh
lebih ringkas — dan itu sebabnya pencarian saya atas literal CP437 di segmen data
tidak menemukan apa pun.
