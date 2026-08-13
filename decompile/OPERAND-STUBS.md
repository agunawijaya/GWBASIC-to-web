# Mesin PRINT BASCOM dan stub bertipe

Ditemukan iterasi #1, **dikoreksi iterasi #3 dan #5**. Nama berkas dipertahankan karena
sudah ditaut dari tempat lain.

## Koreksi

Di iterasi #1 saya menyimpulkan mekanisme ini adalah **pemuat operan** — bahwa
`rep movsw` menyalin operan ke akumulator untuk perhitungan. **Tujuannya salah.**

Struktur yang saya jelaskan tetap benar: stub 5 byte, deskriptor 2 byte, `AL` =
ukuran/tipe. Yang salah adalah kesimpulan tentang apa yang dikerjakan helper-nya.
Ini **mesin keluaran `PRINT`**, dan `AL` menentukan cara memformat item yang dicetak.

## Struktur stub (tetap berlaku)

```
E8 xx xx      call helper
db  AL, AH    deskriptor item
```

Helper mengambil alamat kembali *near* — yang menunjuk ke dua byte deskriptor —
lalu membacanya:

```asm
pop  word ptr [0x8b6]
mov  si, word ptr [0x8b6]
lodsw ax, word ptr cs:[si]   ; AX = (AL,AH)
cmp  al, 3
je   cetak_string
cmp  al, 2
je   cetak_integer
mov  si, bx                  ; jalur umum: salin nilai ke area kerja
mov  di, 0xB8
sub  di, ax
rep  movsw
```

Helper ini identik byte-per-byte di 3DTTT dan PAC-GAL.

## Bukti bahwa ini mesin PRINT

**Cabang `AL=2` (integer)** memancarkan spasi:

```asm
mov  [0xb4], bx
call 0xa85b              ; format bilangan jadi teks
mov  al, 0x20            ; SPASI
call 0x8641              ; pancarkan
```

Spasi di posisi tanda bilangan adalah perilaku `PRINT` angka yang khas di BASIC.

**Cabang `AL=3` (string)** memancarkan tanda kutip di salah satu jalurnya:

```asm
mov  al, 0x22            ; tanda kutip "
call 0x8641
```

Mengutip string adalah perilaku `WRITE`, bukan `PRINT`. Jadi bendera mode memilih
antara keduanya.

**Rutin `0xA2E9` adalah loop cetak string:**

```asm
mov  cx, word ptr [bx]     ; panjang dari deskriptor
jcxz selesai
mov  si, word ptr [bx+2]   ; penunjuk dari deskriptor
lodsb al, byte ptr [si]
call 0x8641                ; pancarkan karakter
loop
ret
```

**Rutin `0x8641` memilih perangkat keluaran:**

```asm
mov  si, word ptr [0x616]  ; pemilih perangkat
or   si, si
jne  perangkat_lain
jmp  0x73EA                ; 0 = layar
```

`[0x616]` adalah pemilih `PRINT` / `LPRINT` / `PRINT #n`. Nol berarti layar.

**Dan itu menutup lingkarannya:** `RT#4` — yang sudah teridentifikasi sebagai
"pembuka pernyataan `PRINT`" — menolkan tepat `[0x82C]`, `[0x616]`, `[0x82D]`.
Yaitu: kembalikan perangkat ke layar, dan reset dua bendera mode. Itu persis
yang harus dilakukan di awal sebuah pernyataan `PRINT`.

## AL = tipe item yang dicetak

| AL | tipe BASIC | ukuran |
|---|---|---|
| 2 | `INTEGER %` | 2 byte |
| 3 | `STRING $` | deskriptor |
| 4 | `SINGLE !` | 4 byte MBF |
| 8 | `DOUBLE #` | 8 byte MBF |

Ini tetap **memulihkan tipe setiap item yang dicetak**, jadi manfaatnya untuk
rekonstruksi tidak berubah — hanya tafsirnya yang bergeser dari "operan" ke
"item PRINT".

*Catatan ketidakcocokan:* `AL=3` menyiratkan deskriptor 3 byte (format klasik
MS BASIC: panjang 1 byte + penunjuk 2 byte), tapi `0xA2E9` membaca panjang sebagai
**word** di `[bx]` dan penunjuk di `[bx+2]` — menyiratkan 4 byte. Belum diselesaikan.

## AH = pemisah PRINT (terbukti iterasi #4)

`AH` bernilai 0, 1, atau 2, diuji di `[0x8b7]` — byte tinggi word deskriptor:

| AH | pemisah | bukti |
|---|---|---|
| 0 | `,` | cabang membagi kolom dengan **14** = lebar zona `PRINT` GW-BASIC |
| 1 | `;` | cabang langsung `ret`, tak memancarkan apa pun |
| 2 | ganti baris | `jmp 0xA24B` |

Rincian di [`PRINT-SEPARATORS.md`](PRINT-SEPARATORS.md). Ini juga menjawab pertanyaan
titik-koma di [`3DTTT/menu-block.bas`](3DTTT/menu-block.bas): `RT#5` adalah stub
`03 01`, jadi pemisahnya memang `;`.

## Hasil per berkas

### PAC-GAL.EXE

```
4 stub → helper 0x57D3, 930 dari 1.349 panggilan (69%)

RT#1   22458   924   AL=3 AH=1   STRING
RT#25  22453     3   AL=2 AH=1   INTEGER
RT#39  22478     2   AL=3 AH=2   STRING
RT#54  22438     1   AL=3 AH=0   STRING
```

**68,7% panggilan PAC-GAL adalah pencetakan item string.** Program membangun
labirinnya dengan mencetak string, bukan lewat primitif grafis.

### 3DTTT.EXE

```
7 stub → helper 0x8E6C, 197 dari 2.345 panggilan (8%)

RT#5   36435    98   AL=3 AH=1   STRING
RT#11  36455    67   AL=3 AH=2   STRING
RT#22  36400    17   AL=4 AH=0   SINGLE
RT#35  36440     8   AL=4 AH=2   SINGLE
RT#50  36420     4   AL=4 AH=1   SINGLE
RT#64  36410     2   AL=2 AH=0   INTEGER
RT#75  36450     1   AL=2 AH=2   INTEGER
```

Stub berjajar rapat di 36400–36455, stride 5 byte.

Ini juga **memulihkan identifikasi awal**: `RT#5` memang `PRINT` string, seperti
yang saya simpulkan dari literal yang diterimanya. Iterasi #1 sempat menurunkannya
jadi "pemuat operan"; itu keliru, dan kesimpulan pertama yang benar.

### HOPPER.EXE — memakai mekanisme yang sama (dikoreksi iterasi #5)

Kesimpulan awal "HOPPER tanpa tabel stub" **salah** — penyaringan saya memindai
rentang alamat yang keliru. HOPPER punya grid 4×3 yang sama di **22885–22940**,
dengan helper di 22945.

```
RT#8   22940   25 panggilan   AL=3 AH=2   STRING, ganti baris
RT#28  22920    5 panggilan   AL=3 AH=1   STRING, ;
RT#38  22905    5 panggilan   AL=4 AH=1   SINGLE, ;
       22925    1 panggilan   AL=4 AH=2   SINGLE, ganti baris
```

Hanya **36 dari 745** panggilan lewat tabel ini, versus 930 dari 1.322 di PAC-GAL.
HOPPER memang jauh lebih sedikit mencetak teks — ia game grafis yang menggambar
lewat `DRAW`. Perbedaannya nyata, tapi mekanismenya sama.

Yang tetap membedakan HOPPER: tidak memasang jebakan `INT 3` (lihat
[`EVENT-TRAPS.md`](EVENT-TRAPS.md)).

Data mentah: [`stub-descriptors.json`](stub-descriptors.json).
