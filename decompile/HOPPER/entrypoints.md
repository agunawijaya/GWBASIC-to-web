# HOPPER.EXE — peta entry point runtime BASCOM

776 far call tervalidasi (dicocokkan dengan tabel relokasi), **117 entry point unik**,
semuanya ke segmen runtime `0247`. Tabel di bawah urut menurut frekuensi panggilan.

| RT# | target | panggilan | kumulatif | identifikasi | bukti |
|---|---|---|---|---|---|
| 1 | 18322 | 81 | 10.4% | SGL.ARITH.2OP | `call 0x33b7 \| mov cx, 2 \| add si, cx \| add di, cx \| mov ax, word ptr [si] \| mo` |
| 2 | 13109 | 69 | 19.3% | FAC.STORE.SGL | `mov si, 0xb2 \| movsw word ptr es:[di], word ptr [si] \| movsw word ptr es:[di],` |
| 3 | 9370 | 57 | 26.7% | MBF.UNPACK | `call 0x33b7 \| mov ax, word ptr [di + 2] \| mov bx, word ptr [di + 1] \| mov dh, ` |
| 4 | 13112 | 57 | 34.0% | SGL.COPY | `movsw word ptr es:[di], word ptr [si] \| movsw word ptr es:[di], word ptr [si] ` |
| 5 | 21569 | 52 | 40.7% | ERRFRAME+LOAD4 | `mov word ptr [0x636], sp \| push ax \| push cx \| mov ax, word ptr [si + 2] \| mov` |
| 6 | 23248 | 30 | 44.6% | STMT.RESET | `mov byte ptr [0x7d6], 0 \| mov word ptr [0x648], 0 \| mov byte ptr [0x7d7], 0 \| ` |
| 7 | 13135 | 26 | 47.9% | FAC.LOAD.SGL | `mov di, 0xb2 \| movsw word ptr es:[di], word ptr [si] \| movsw word ptr es:[di],` |
| 8 | 22940 | 25 | 51.2% | *belum diidentifikasi* | `call 0x59a1 \| add ax, word ptr [bp + si] \| pop word ptr [0x874] \| call 0x33b7 ` |
| 9 | 21497 | 24 | 54.3% | BH.FLAGS.9000 | `push bx \| push dx \| push ax \| mov ax, 0x9000 \| or al, bh \| jns 0x5405` |
| 10 | 12954 | 19 | 56.7% | ERRFRAME+CALL | `mov word ptr [0x636], sp \| push bx \| call 0x659b \| jb 0x32af \| push cx \| push ` |
| 11 | 9359 | 17 | 58.9% | FAC.LOAD.ALT | `mov si, 0xb2 \| jmp 0x249a` |
| 12 | 21644 | 16 | 61.0% | *belum diidentifikasi* | `mov word ptr [0x636], sp \| push ax \| push cx \| mov ax, word ptr [0xb4] \| mov c` |
| 13 | 13066 | 14 | 62.8% | *belum diidentifikasi* | `push cx \| push si \| push di \| mov di, word ptr [bx + 2] \| mov cx, word ptr [bx` |
| 14 | 13292 | 11 | 64.2% | *belum diidentifikasi* | `mov word ptr [0x636], sp \| push ax \| push bx \| push cx \| push dx \| push si` |
| 15 | 13266 | 10 | 65.5% | *belum diidentifikasi* | `push ax \| push bx \| push cx \| push dx \| push si \| push di` |
| 16 | 13490 | 10 | 66.8% | *belum diidentifikasi* | `push ax \| mov ax, word ptr [si + 2] \| or ah, ah \| je 0x34bc \| rcl al, 1 \| pop ` |
| 17 | 11863 | 9 | 67.9% | *belum diidentifikasi* | `mov word ptr [0x636], sp \| push ax \| push bx \| push cx \| push dx \| call 0x2aa1` |
| 18 | 20155 | 9 | 69.1% | *belum diidentifikasi* | `call 0x33b7 \| jmp 0x6a1c` |
| 19 | 18372 | 9 | 70.2% | *belum diidentifikasi* | `cmp sp, word ptr [0x622] \| jb 0x480e \| pop si \| mov word ptr [0xb6], sp \| pop ` |
| 20 | 22506 | 8 | 71.3% | *belum diidentifikasi* | `mov word ptr [0x636], sp \| push ax \| mov byte ptr [0x88], 0 \| mov ax, 0x338a \|` |
| 21 | 9671 | 7 | 72.2% | FAC.LOAD.ALT2 | `mov si, 0xb2 \| jmp 0x25d2` |
| 22 | 13638 | 7 | 73.1% | FAC.NUM.FMT | `xchg bx, si \| call 0x35f9 \| xchg bx, si \| push cx \| mov cx, 2 \| cmp byte ptr [` |
| 23 | 20227 | 7 | 74.0% | GFX.LINE | `call 0x33b7 \| call 0x6a4f \| call 0x6a39 \| jb 0x4f12 \| mov cx, word ptr [0x612]` |
| 24 | 9682 | 7 | 74.9% | *belum diidentifikasi* | `call 0x33b7 \| lodsw ax, word ptr [si] \| mov si, word ptr [si] \| xchg si, ax \| ` |
| 25 | 20297 | 7 | 75.8% | GFX.ATTR | `call 0x33b7 \| mov ax, 3 \| cmp cx, -1 \| je 0x4f55 \| xchg cx, ax \| call 0x5e78` |
| 26 | 11523 | 7 | 76.7% | PLAY | `call 0x33b7 \| cmp bx, 0x25 \| jb 0x2d00 \| mov cx, bx \| mov si, dx \| mov di, 0x8` |

26 entry point teratas menutup **77%** dari seluruh panggilan.

## Cara membacanya

BASCOM menerjemahkan tiap operasi BASIC jadi *setup argumen pendek + satu far call*.
Jadi barisan `RT#` di `user-code.asm` pada dasarnya adalah program BASIC-nya,
hanya masih memakai nomor rutin alih-alih nama pernyataan.
