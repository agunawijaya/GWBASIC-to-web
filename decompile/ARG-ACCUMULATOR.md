# Akumulator argumen `0x6E8B` — terpetakan, belum ternama

Iterasi loop #5, 2026-08-06. **Ini catatan kebuntuan sebagian**, bukan penyelesaian.

## Yang berhasil dipastikan

`RT#12` (`065C:0802`) dan `RT#13` (`065C:081C`) di 3DTTT keduanya memanggil helper
`0x6E8B` lalu jatuh ke `0x6A6B`. Mekanismenya:

```asm
0x6E8B:  or   bh, bh              ; nilai harus muat dalam byte
         jne  error
         mov  di, 0x6A            ; basis buffer argumen (DGROUP)
         mov  si, 0x7E            ; tabel pendamping, varian teks
         mov  ch, 3               ; batas 3 slot
         mov  bx, word ptr [0x68] ; indeks berjalan
         call 0x69BD              ; uji mode video
         je   selesai             ; mode teks  → si=0x7E, ch=3
         mov  si, 0x83            ; mode grafis → si=0x83, ch=4
         mov  ch, 4
selesai: ret

0x6A6B:  mov  [bx+di], cl         ; simpan argumen ke slot
         cmp  bl, ch              ; indeks mencapai batas?
         jae  0x6A7C              ; ya → reset (lihat bawah)
         inc  word ptr [0x68]     ; tidak → indeks maju
         pop  di,si,dx,cx,bx,ax
         retf
```

### Uji mode video

```asm
0x69BD:  mov  al, byte ptr [0x50]
         cmp  al, 7
         je   teks
         cmp  al, 4
         jae  grafis
         xor  al, al              ; 0-3 → teks
         or   al, al              ; set ZF
         ret
```

`[0x50]` menyimpan **nomor mode video BIOS**, dan pembagiannya persis benar:
mode 0–3 dan 7 adalah mode teks, mode 4–6 grafis. Pola `cmp 7 / je` lalu `cmp 4 / jae`
tidak masuk akal untuk nomor `SCREEN` GW-BASIC, tapi tepat untuk mode BIOS.

### Indeks berjalan

`[0x68]` **direset ke nol di empat tempat**: image 27260, 28202, 28783, 29359.
Yang pertama (27260) adalah target `jae 0x6A7C` — jadi indeks **berputar** saat
mencapai batas, bukan error.

## Batasan yang tersisa

**Pernyataannya menerima 3 argumen di mode teks dan 4 di mode grafis.**

Itu batasan yang kuat, tapi saya **tidak berhasil mencocokkannya** dengan pernyataan
GW-BASIC mana pun:

| kandidat | teks | grafis | cocok? |
|---|---|---|---|
| `COLOR` | 3 (depan, belakang, batas) | 2 (latar, palet) | ✗ grafis harusnya 2 |
| `LOCATE` | 5 | 5 | ✗ tidak bergantung mode |
| `SCREEN` | 4 | 4 | ✗ tidak bergantung mode |

Kemungkinan `CH` bukan jumlah argumen melainkan ukuran tabel pendamping di `SI`
(`0x7E` vs `0x83`, selisih 5). Itu belum diperiksa.

## Status

`RT#12`/`RT#13` **tetap belum teridentifikasi**. Di [`3DTTT/menu-block.bas`](3DTTT/menu-block.bas)
keduanya ditulis sebagai `REM ??` dengan nilai argumennya dipertahankan apa adanya.

Saya sudah menghabiskan dua iterasi di sini dan **menurunkan prioritasnya**. Rekonstruksi
`.bas` bisa berjalan tanpa ini — pernyataan `PRINT` sudah terbaca penuh berkat
[`PRINT-SEPARATORS.md`](PRINT-SEPARATORS.md); yang belum hanyalah penempatan/atribut
layarnya.

## Petunjuk untuk yang melanjutkan

1. Periksa isi tabel di `DGROUP+0x7E` dan `DGROUP+0x83` — kemungkinan nilai default
   per argumen. Ukurannya (3 vs 4 entri) akan memastikan apakah `CH` benar jumlah argumen.
2. Telusuri jalur `0x6A7C` sesudah reset indeks — di situ `SI` akhirnya dipakai, dan
   itu kemungkinan tempat pernyataan benar-benar dieksekusi.
3. Empat titik reset `[0x68]` (27260, 28202, 28783, 29359) menandai batas pernyataan;
   melihat kode di sekitar tiga yang lain bisa mengungkap pernyataan mana saja yang
   berbagi akumulator ini.
