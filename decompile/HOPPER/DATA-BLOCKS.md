# HOPPER — rutin `CALL ABSOLUTE`: scroller horizontal CGA

Empat baris `DATA` di sumber BASIC aslinya, masing-masing 57 angka, di-`POKE` ke memori
lalu dipanggil `CALL ABSOLUTE`. Total **228 byte**.

Keempatnya **satu rutin bersambung**: didisassembly sebagai satu blok menghasilkan 74
instruksi dengan hanya **1 byte tak terdekode**. Dipisah per blok, batasnya jatuh di
tengah instruksi.

## Struktur

```
offset  0..2    eb 12 90        jmp short +18   (melompati blok parameter)
offset  3..19   blok parameter  (tabel kecepatan per jalur)
offset 20..227  kode
```

Rutin ini **memodifikasi dirinya sendiri**. Ia menulis ke `cs:[0x10]`–`cs:[0x13]` —
alamat di dalam blok parameternya sendiri. Itulah cara BASIC mengoper argumen ke rutin
assembly: `POKE` nilainya ke dalam kode, lalu `CALL`.

## Kode, dianotasi

```asm
 20  push ds
 21  push es
 22  mov  ax, 0xB855          ; segmen VRAM CGA (B800) + offset
 25  mov  ds, ax
 27  mov  es, ax              ; sumber DAN tujuan = memori layar
 29  mov  word ptr cs:[3], 0x0A  ; pencacah jalur = 10
 36  mov  si, word ptr cs:[3]    ; si = nomor jalur
 41  mov  al, byte ptr cs:[si+5] ; baca KECEPATAN jalur ini dari tabel parameter
 46  cmp  al, 0
 48  jne  gerak
 50  jmp  selesai                ; kecepatan 0 = jalur diam
 53  mov  cs:[0x11], al          ; simpan kecepatan (pencacah geser)
 57  mov  cs:[0x12], al          ; salinannya
 61  mov  ax, si
 63  mov  bx, 0x1E0              ; 480 byte per jalur
 66  mul  bx                     ; bx = jalur * 480
 70  mov  cs:[0x10], 2           ; pencacah bank = 2  <- CGA punya 2 bank scanline
 76  test cs:[0x11], 0x80        ; kecepatan negatif?
 82  jne  maju
 84  std                         ; ya -> geser mundur
 85  add  bx, 0x3E               ; mulai dari ujung kanan (+62)
 88  mov  di, bx
 90  mov  cs:[0x13], 6           ; 6 scanline per jalur

baris:
 96  mov  si, di
 98  sub  si, 2
101  mov  ax, word ptr [di]      ; simpan word di tepi
103  mov  cx, 0x1F               ; 31 word = 62 byte
106  rep  movsw                  ; GESER satu scanline
108  mov  word ptr [si+2], ax    ; kembalikan word tepi di sisi lain -> MELINGKAR
111  add  di, 0x8E               ; scanline berikutnya (+142)
115  dec  byte ptr cs:[0x13]
120  jne  baris                  ; ulangi 6 scanline

122  dec  byte ptr cs:[0x11]     ; pencacah kecepatan
127  jne  baris                  ; geser lagi -> makin cepat makin jauh
129  dec  byte ptr cs:[0x10]     ; pencacah bank
134  je   selesai
136  mov  al, cs:[0x12]          ; pulihkan kecepatan
140  mov  cs:[0x11], al
144  add  bx, 0x2000             ; +8192 = BANK CGA SATUNYA
```

## Kenapa angka-angkanya masuk akal

| konstanta | arti |
|---|---|
| `0x2000` = 8192 | jarak antar-bank scanline genap/ganjil CGA — dan pencacah bank memang 2 |
| `6` | tinggi tiap jalur dalam scanline |
| `0x1F` = 31 word = 62 byte | lebar area gulir |
| `0x8E` = 142 | langkah ke scanline berikutnya di dalam bank |
| `0x1E0` = 480 | byte per jalur (6 scanline × 80 byte) |
| `0x80` | bit tanda kecepatan = arah gerak |

## Tabel parameter = kecepatan per jalur

Blok di offset 3..19:

```
0, 0, 1, 255, 2, 255, 2, 0, 1, 255, 2, 254, 255, 0, 0, 0, 0
```

Dibaca sebagai byte bertanda: `+1, −1, +2, −1, +2, 0, +1, −1, +2, −2, −1, 0, …`

**Itu jalur-jalur lalu lintas Frogger** — tiap baris bergerak dengan kecepatan berbeda,
arah bergantian, beberapa diam. Kecepatan menentukan berapa kali geser diulang per
pemanggilan (`dec cs:[0x11]; jne`), jadi nilai 2 bergerak dua kali lebih cepat dari 1.

## Kenapa ini ada di assembly

`rep movsw` memindahkan 62 byte dalam satu instruksi. Melakukan hal yang sama di BASIC
berarti loop `POKE`/`PEEK` per byte — ratusan kali lebih lambat, dan gulir jalur harus
selesai dalam satu frame.

Ini pola yang lazim di program BASIC era itu: tulis permainannya di BASIC, turunkan
bagian yang menuntut kecepatan ke `DATA` + `CALL ABSOLUTE`.

## Paruh kedua: jalur maju, dan asimetri yang terpecahkan sendiri

Offset 150–210 adalah cermin dari jalur mundur:

```asm
150  cld                     ; maju
151  mov  di, bx             ; mulai dari tepi KIRI (tanpa +0x3E)
159  mov  si, di
161  add  si, 2              ; sumber = di+2  (mundur: di-2)
164  mov  ax, [di]           ; simpan word tepi
169  rep  movsw
171  mov  [si-2], ax         ; kembalikan  (mundur: [si+2])
174  add  di, 0x12           ; scanline berikutnya
184  inc  byte ptr cs:[0x11] ; pencacah kecepatan NAIK  (mundur: dec)
```

**Kenapa `inc` di sini dan `dec` di sana:** kecepatan negatif disimpan sebagai byte
bertanda, jadi ia menghitung *naik* menuju nol; kecepatan positif menghitung *turun*.
Satu pencacah, dua arah.

**Asimetri langkah scanline terpecahkan sendiri.** Jalur mundur menambah `0x8E` (142),
jalur maju hanya `0x12` (18) — tampak ganjil sampai `rep movsw` diperhitungkan:

| | perubahan `di` oleh `rep movsw` | tambahan | net |
|---|---|---|---|
| mundur (`std`) | −62 | +142 | **+80** |
| maju (`cld`) | +62 | +18 | **+80** |

Keduanya maju **tepat 80 byte — satu scanline CGA**. Bukan asimetri, melainkan
kompensasi arah `rep`.

## Loop jalur

```asm
212  dec  word ptr cs:[3]           ; nomor jalur turun
217  cmp  word ptr cs:[3], 0xFFFF   ; sudah -1?
224  je   selesai
```

Dimulai dari 10 (`mov word ptr cs:[3], 0x0A`) turun sampai −1 → **11 jalur**.
Kecepatan dibaca di `cs:[si+5]`, jadi tabelnya menempati offset 5–15:

```
+1, -1, +2, -1, +2, 0, +1, -1, +2, -2, -1
```

Sebelas jalur dengan arah bergantian dan satu yang diam — susunan lalu lintas Frogger.

## Yang belum dipastikan

- Nilai `0xB855` sebagai segmen: `B800` ditambah offset 0x55 paragraf (1.360 byte).
  Kemungkinan melewati area skor di atas layar; belum ditelusuri.
- Satu byte tak terdekode di sambungan.

Disassembly mentah lengkap: [`data-blocks.asm`](data-blocks.asm).
