# PAC-GAL.EXE — status dekompilasi

`Pac-Gal`, 1986, klon Pac-Man. 39.296 byte, 1.361 relokasi.

```
kode game     0 .. ~12.288   (1.349 far call, 71 entry point runtime)
runtime      ~12.288 .. 33.664
basis string  image 28.084   (seg 06DB)
```

## Berbeda struktur dari HOPPER dan 3DTTT

Satu rutin — `RT#1` di `02EC:28FA` — menyerap **924 dari 1.349 panggilan (68,5%)**.
Bandingkan HOPPER, yang panggilan terbanyaknya cuma 10,4%.

Sebabnya: PAC-GAL memakai **dispatcher berargumen inline** sebagai jalur utama.

```asm
RT#1:   ...
        pop  word ptr [0x8ea]        ; ambil alamat kembali
        call 0x323f
        mov  si, word ptr [0x8ea]
        lodsw ax, word ptr cs:[si]   ; baca argumen inline dari aliran kode
```

**Terpecahkan di iterasi #1.** `RT#1` adalah [stub operan](../OPERAND-STUBS.md)
dengan deskriptor `AL=3` = `STRING $`. Jadi 68,7% panggilan PAC-GAL adalah
**pemuatan operan string** — bukan anomali struktur, melainkan tanda bahwa program
membangun labirinnya dari manipulasi string, bukan primitif grafis.

Mekanismenya sama persis dengan 3DTTT. Kekhawatiran awal bahwa PAC-GAL "lebih mirip
bytecode" tidak terbukti; hambatannya sudah terbuka.

## Entry point yang menerima literal

| RT# | menerima | kesimpulan |
|---|---|---|
| RT#1 | `'How fast (0-30000)'` | dispatcher (juga menangani `PRINT`) |
| RT#8 | `'t255mbl64o1afgao4d'` | `PLAY` |
| RT#12 | `'mbl24o2x'`, `'l32o3x'` | `PLAY` (efek pendek) |
| RT#14 | `'mbl8t255o4fego3abcdefgo0l1g-g'` | `PLAY` |
| RT#39 | `'...Hope you had a good time'` | `PRINT` |

## Aset terpulihkan

Lihat [`assets.md`](assets.md) — 45 literal teks dan **6 string `PLAY`**, termasuk:

```
t255mbl64o1afgao4d
mbl64abceabceebceabceagaa
mbt190o2l8bbbl16cecl8bbp8bbbl16cl8edcc
mbl8t255o4fego3abcdefgo0l1g-g
mbl24o2x        l32o3x
```

Yang ketiga itu melodi pembuka Pac-Man. Semuanya bisa dipakai ulang verbatim.

Banner-nya sudah dipatch orang: `Licensed Material Program Property of GHOST`
(aslinya `... of IBM`). Di dalamnya masih ada kredit `P A C - G A L … Al J. Jiménez,
May 1982`.
