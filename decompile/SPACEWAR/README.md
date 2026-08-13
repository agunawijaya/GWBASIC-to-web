# SPACEWAR.EXE — disassembly assembly

`(C) 1985 Bill Seiler`, 22.528 byte. **Bukan BASIC ter-compile** — assembly 8086 tulis
tangan. Karena itu targetnya assembly beranotasi, bukan rekonstruksi BASIC.

Hasil: [`spacewar.asm`](spacewar.asm) — 6.081 baris, **99% segmen kode tercakup**.

## Bukti ini bukan BASIC

| | SPACEWAR | 3DTTT / PAC-GAL / HOPPER |
|---|---|---|
| entri relokasi | **5** | 2.357 / 1.361 / 786 |
| string error runtime BASIC | **0** | 22 masing-masing |
| far call ke runtime | **0** | 2.383 / 1.417 / 815 |

## Tata letak

```
CS:IP = 02AB:0000  ->  image offset 10.928
SS:SP = 0000:0000

     0 .. 10.928   SEGMEN DATA  (66% nol — buffer sprite/layar)
10.928 .. 22.016   SEGMEN KODE  (11.088 byte)
```

Data mendahului kode — tata letak MASM biasa. Itu sebabnya penelusuran rekursif
dari entry point tampak hanya menutup 35% *berkas*; terhadap *segmen kode* angkanya 99%.

## Statistik

```
subrutin (sub_)        104
label cabang (loc_)    388
interupsi              INT 10h ×3, INT 21h ×1
port I/O               020h ×3, 040h ×4, 042h ×10, 043h ×7,
                       060h ×1, 061h ×21, 3BFh ×1, 3F2h ×1
```

Hanya **empat panggilan interupsi di seluruh program**. Semua sisanya akses perangkat
keras langsung — itulah sebabnya game ini cepat, dan sebabnya ia rewel soal perangkat keras.

## Urutan startup, terbaca penuh

```asm
start:                          ; image 10928
 10928  mov  ax, ds
 10930  mov  cs:[0xba], ax      ; simpan segmen PSP untuk jalan keluar
 10934  mov  ax, 0
 10937  mov  ds, ax             ; DS = 0
 10939  mov  ah, 0xf
 10941  int  0x10               ; ambil mode video saat ini
 10943  mov  [0x5f], al         ; simpan untuk dipulihkan nanti
 10946  mov  dx, 0x3bf
 10949  mov  al, 0
 10951  out  dx, al             ; matikan konfigurasi Hercules
 10952  mov  ax, 0xb800
 10958  mov  es, ax             ; segmen VRAM CGA
 10960  ...                     ; tulis DI ke ES:[DI] tiap 1000h sampai 4000h,
                                ; lalu baca balik -> uji keberadaan 16K VRAM
```

Uji tulis-baca berulang pada `B800:0000/1000/2000/3000` itulah **deteksi kartu grafis**
yang menghasilkan pesan penolakan. Kalau gagal, alurnya ke `loc_2B56`:

```asm
loc_2B56:
 11094  push bx                 ; bx = offset pesan
 11095  xor  ah, ah
 11097  mov  al, [0x5f]         ; mode video yang tadi disimpan
 11100  int  0x10               ; pulihkan mode
 11103  mov  ah, 9
 11105  int  0x21               ; cetak pesan $-terminated
 11107  ljmp cs:[0xb8]          ; lompat ke PSP:0000 = keluar ke DOS
```

Pesannya: `SORRY !  You need a 640 X 200 Color Graphics card to run SPACEWAR !$`
disusul `May the farce be with you.$`.

Mode grafisnya sendiri diset di `sub_4A0C`:

```asm
sub_4A0C:
 18956  mov  ax, 6
 18959  int  0x10               ; mode 6 = CGA 640x200
 18961  ret
```

Ketiga `INT 10h` itu semuanya: ambil mode, pulihkan mode, set mode 6. Selebihnya
menulis langsung ke `B800`.

## Teknik yang menonjol

**Stack ditaruh di tabel vektor interupsi.** Sebelum masuk game:

```asm
 11013  cli
 11014  mov  ax, ss
 11016  mov  [0x64], ax         ; simpan SS lama di 0000:0064
 11019  mov  [0x62], sp         ; simpan SP lama
 11023  mov  ax, 0
 11026  mov  ss, ax
 11028  mov  sp, 0x166          ; stack baru di 0000:0166
```

`SS:SP` jadi `0000:0166` — stack tumbuh turun **ke dalam tabel vektor interupsi**,
memakai slot vektor yang tak terpakai sebagai RAM. Itu menjelaskan `SS:SP = 0000:0000`
di header EXE. Agresif, dan sepenuhnya khas program game era itu.

**Motor floppy dimatikan paksa.**

```asm
 11001  and  byte ptr es:[0x3f], 0xf0   ; ES=0040, byte status motor BIOS
 11007  mov  al, 0xc
 11009  mov  dx, 0x3f2
 11012  out  dx, al                     ; digital output register FDC
```

**Papan ketik dibaca langsung dari port 60h**, tanpa BIOS:

```asm
 18996  mov  ax, 0
 18999  mov  ds, ax
 19001  in   al, 0x60                   ; scancode mentah
 19003  mov  di, ax
 19005  and  di, 0x7f                   ; buang bit break
```

Itu sebabnya game ini bisa mendeteksi dua tombol ditekan bersamaan — syarat mutlak
untuk permainan dua pemain di satu papan ketik.

**Suara** lewat PIT kanal 2 (`port 42h`/`43h`) dan gerbang speaker (`port 61h`, 21 kali).

## Yang tersisa

Penamaan subrutin masih generik (`sub_46BD`). Menamainya secara bermakna butuh
pembacaan per-rutin — pekerjaan yang sekarang tinggal dilakukan, karena kerangkanya
sudah lengkap dan 99% kode sudah terdisassembly.
