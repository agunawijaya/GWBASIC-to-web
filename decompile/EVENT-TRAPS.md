# INT 3 sebagai titik jebakan event

Iterasi loop #2, 2026-08-06. **Dokumen ini mengoreksi kesimpulan sebelumnya.**

## Koreksi

Di iterasi sebelumnya saya menyimpulkan byte `0xCC` yang bertaburan sesudah `lcall`
adalah **argumen inline** yang dibaca rutin dari aliran kode. **Itu salah.**

`0xCC` adalah opcode `INT 3`, dan ia **benar-benar dieksekusi**. Buktinya: 3DTTT dan
PAC-GAL sama-sama memasang vektor INT 3 saat startup.

Mekanisme argumen inline memang ada dan nyata — `pop si; pop ds; lodsb` di beberapa
rutin, dan dua byte deskriptor di [stub operan](OPERAND-STUBS.md). Saya menggabungkan
dua mekanisme berbeda menjadi satu kesimpulan. Yang ubiquitous (`0xCC`) bukan itu.

## Bukti

Kedua biner memasang dua vektor sekaligus:

```asm
        push ds
        xor  ax, ax
        mov  ds, ax                    ; DS = 0, akses tabel vektor
        cli
        mov  word ptr [0x0C], 0x2447   ; vektor INT 3, offset
        mov  word ptr [0x0E], cs       ; vektor INT 3, segmen
        mov  word ptr [0x24], 0x24A1   ; vektor INT 9, offset  (0x24/4 = 9)
        mov  word ptr [0x26], cs       ; vektor INT 9, segmen
        pop  ds
```

| | 3DTTT | PAC-GAL | HOPPER |
|---|---|---|---|
| pemasangan vektor | image 35125 | image 17528 | **tidak ada** |
| handler INT 3 | `065C:2447` | `02EC:168A` | — |
| handler INT 9 | `065C:24A1` | `02EC:16E4` | — |
| byte `0xCC` di image | 1.643 | 510 | 42 (kebetulan) |

## Handler INT 3

```asm
cmp  byte ptr [0x678], 0     ; bendera: jebakan event aktif?
jne  handler_body
iret                          ; tidak aktif → kembali, 3 instruksi
```

Compiler menaburkan `INT 3` di antara pernyataan sebagai **titik pemeriksaan jebakan
event** — tempat runtime memeriksa apakah `ON KEY`, `ON TIMER`, atau `ON ERROR` perlu
dipicu.

Kenapa `INT 3` dan bukan far call: **1 byte, bukan 5**. Di 3DTTT ada 1.643 titik
periksa; sebagai far call biayanya 8.215 byte, sebagai `INT 3` cuma 1.643. Penghematan
6,5 KB pada program 57 KB.

Saat jebakan mati, ongkosnya tiga instruksi lalu `iret`.

## Handler INT 9 (papan ketik)

```asm
sti
push ax, bx, dx, ds
xor  dx, dx
mov  ds, dx
mov  ds, word ptr [0x510]    ; DS = segmen data program
mov  dx, 0x60
in   al, dx                  ; scancode mentah
cmp  al, 0x3B                ; 0x3B = scancode F1
jb   teruskan                ; di bawah F1 → serahkan ke BIOS
sub  al, 0x3B                ; jadikan indeks relatif terhadap F1
cmp  al, 0x0A                ; 10 tombol → F1..F10
jb   picu_jebakan            ; → ON KEY(1..10)
cmp  al, 0x0D
```

Ini implementasi **`ON KEY(n)`** untuk tombol fungsi. Cocok persis dengan teks bantuan
yang tertanam di 3DTTT:

> `(F1) is for instructions, (F2) save, (F3) load, (F4) start a new game,
> and (F10) is to end the game`

Sepuluh tombol fungsi, dan handler-nya menguji tepat 10 (`cmp al, 0x0A`).

Handler di kedua biner **identik instruksi-per-instruksi**, hanya beda alamat.
Konfirmasi lain bahwa runtime-nya versi yang sama.

## HOPPER tidak memakai ini

Nol pemasangan vektor, dan 42 byte `0xCC` di seluruh image adalah data kebetulan
(bandingkan 1.643 di 3DTTT). HOPPER menangani papan ketik lewat rutin runtime biasa
(`RT#41`, sudah teridentifikasi: bingkai error + `INT 16h`).

Ini konsisten dengan dua perbedaan HOPPER yang sudah ditemukan sebelumnya: tanpa
tabel stub operan, dan entry point berupa rutin langsung. **Tiga berkas, tiga
konvensi codegen** — kemungkinan besar versi atau opsi compiler yang berbeda.

## Dampak untuk disassembly

Titik `INT 3` **adalah instruksi**, jadi disassembler linier tidak salah baca di situ —
kebalikan dari yang saya tulis sebelumnya. Yang memang menyesatkan hanyalah dua byte
deskriptor di dalam stub operan.

Untuk rekonstruksi `.bas`: tiap `0xCC` menandai **batas pernyataan**. Itu justru
berguna — ia memberi pemisah pernyataan yang eksplisit, sesuatu yang biasanya hilang
saat compile.

## Tabel jebakan, dan rutin yang mengisinya

Iterasi lanjutan menemukan sisi lain dari mekanisme ini: bukan hanya `INT 3` sebagai
titik periksa, tetapi tabel yang diperiksanya dan dua statement yang mengisinya.

Tabelnya berisi **rekaman 5 byte**, dan alamat tiap rekaman dihitung dengan perkalian
telanjang:

```
35415  mov  bx, 0x679     ; basis tabel (3DTTT)
35418  mov  ah, 5
35420  mul  ah            ; indeks x 5
35422  add  bx, ax
```

Rutin penginisialisasi menolkan tepat `0x69` = 105 byte di sana — **21 rekaman**.

Dua statement BASIC mengisinya, dan keduanya memakai pembantu alamat yang sama:

| statement | rutin | cara |
|---|---|---|
| `ON KEY(n) GOSUB` | `ON_KEY_GOSUB` | simpan alamat penangan jauh ke `[bx+1]` dan `[bx+3]` |
| `KEY(n) ON/OFF/STOP` | `KEY_ONOFF` | cabang atas `dl` bernilai 0, 1, atau 2 |

Kelasnya dipilih pasangan `(batas, indeks dasar)` yang disetel tiap entry: `(14, 3)`
untuk tombol, dan tiga kelas lain dengan batas 2, 2, dan 4.

Yang mengunci arti tabelnya adalah penangan `INT 9`-nya sendiri:

```
17844  in   al, dx        ; port 0x60, papan ketik
17845  cmp  al, 0x3B      ; kode pindai F1
17849  sub  al, 0x3B
17851  cmp  al, 0x0A      ; sepuluh tombol fungsi
```

Struktur ini ada di 3DTTT maupun PAC-GAL, dan masing-masing dibaca dari disassembly
binernya sendiri — bukan dicocokkan antar-biner (NEGATIVE-RESULTS sec. 9).
