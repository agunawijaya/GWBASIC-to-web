# AH = pemisah PRINT — terpecahkan

Iterasi loop #4, 2026-08-06.

## Tabel stub adalah grid 4×3

Dump mentah tabel stub 3DTTT:

```
36400  e8 39 00 | 04 00     AL=4 SINGLE    AH=0
36405  e8 34 00 | 08 00     AL=8 DOUBLE    AH=0
36410  e8 2f 00 | 02 00     AL=2 INTEGER   AH=0
36415  e8 2a 00 | 03 00     AL=3 STRING    AH=0
36420  e8 25 00 | 04 01     AL=4 SINGLE    AH=1
36425  e8 20 00 | 08 01     AL=8 DOUBLE    AH=1
36430  e8 1b 00 | 02 01     AL=2 INTEGER   AH=1
36435  e8 16 00 | 03 01     AL=3 STRING    AH=1
36440  e8 11 00 | 04 02     AL=4 SINGLE    AH=2
36445  e8 0c 00 | 08 02     AL=8 DOUBLE    AH=2
36450  e8 07 00 | 02 02     AL=2 INTEGER   AH=2
36455  e8 02 00 | 03 02     AL=3 STRING    AH=2
36460  <helper>
```

Dua belas stub: **4 tipe item × 3 varian pemisah**. Seluruhnya menunjuk helper yang sama.

## Titik pakai AH

Helper menyimpan **kedua byte** deskriptor:

```asm
lodsw ax, word ptr cs:[si]   ; AL=tipe, AH=varian
mov   word ptr [0x8b6], ax   ; simpan keduanya
```

`[0x8b7]` adalah byte tinggi dari word di `[0x8b6]` — yaitu `AH`. Diuji setelah item
diformat:

```asm
cmp byte ptr [0x8b7], 1
jb  0x8F0D          ; AH = 0
ja  0x8EC1          ; AH = 2
ret                 ; AH = 1
```

## Ketiga cabang

**AH = 1 → `ret` langsung.** Tidak memancarkan apa pun setelah item.
Itu **titik koma `;`**.

**AH = 0 → `0x8F0D`:**

```asm
call 0x8652
mov  al, ah
mov  ah, 0
mov  cl, 0x0E     ; 14
div  cl           ; kolom ÷ 14
sub  cl, ah       ; 14 − (kolom mod 14) = spasi menuju zona berikutnya
mov  al, cl
add  ax, 0x0E
call 0x8F31       ; pancarkan sebanyak itu
```

Pembagian dengan **14** adalah lebar zona `PRINT` GW-BASIC. Itu **koma `,`**.

**AH = 2 → `0x8EC1` → `jmp 0xA24B`.** Jalur ganti baris (akhir pernyataan).

## Hasil

| AH | pemisah BASIC |
|---|---|
| 0 | `,` maju ke zona 14 kolom |
| 1 | `;` tanpa pemisah |
| 2 | ganti baris / akhir pernyataan |

Digabung dengan `AL`, **tiap panggilan stub sekarang terbaca penuh** sebagai satu item
`PRINT` lengkap dengan tipe dan pemisahnya. Untuk rekonstruksi ini besar: struktur
pernyataan `PRINT` bisa dipulihkan persis, bukan diduga.

## Dampak ke menu-block.bas — satu terbukti, satu memburuk

**Terbukti:** blok menu hanya memakai `RT#5` = `03 01` = STRING + `;`. Titik koma di
[`3DTTT/menu-block.bas`](3DTTT/menu-block.bas) yang saya tandai "tidak terbukti" di
iterasi #2 **ternyata benar**.

**Memburuk:** justru karena semuanya `;` dan tak ada `AH=2` di dalam blok, tidak ada
ganti baris sama sekali. Semua item akan tercetak berderet di satu baris — kecuali ada
yang memindahkan posisi kursor.

Itu **memperlemah hipotesis `COLOR`** untuk `RT#12`/`RT#13`. Kalau keduanya `COLOR`,
menu sepuluh baris itu tidak mungkin terbentuk. `LOCATE` jadi lebih masuk akal.

Tapi `LOCATE` juga belum cocok: pasangan nilainya `(3,0)` dan `(11,6)` berulang identik,
yang sebagai `LOCATE baris,kolom` akan saling menimpa.

**Kemungkinan penyelesaiannya ada di akumulator itu sendiri.** Helper `0x6E8B` menyimpan
ke buffer 3 slot di `DGROUP 0x6A` dengan indeks berjalan di `[0x68]` yang **terus
bertambah** — jadi panggilan berurutan mengisi slot 0, 1, 2, lalu entah apa. Asumsi saya
bahwa tiap pasangan panggilan adalah "argumen 1, argumen 2" dari satu pernyataan
**belum diperiksa**. Bisa jadi tiga panggilan membentuk satu pernyataan, atau indeksnya
di-reset di tempat yang belum saya lihat.

Sampai itu dilacak, `RT#12`/`RT#13` tetap **belum teridentifikasi**. Saya turunkan lagi
dari "COLOR" menjadi terbuka.
