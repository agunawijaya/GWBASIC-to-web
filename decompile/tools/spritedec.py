# -*- coding: utf-8 -*-
"""Dekoder tabel sprite SPACEWAR.EXE — parameternya DIBACA dari kode, bukan ditebak.

Selama 18 iterasi dekompilasi, §9.1 `SPACEWAR/ARCHITECTURE.md` berbunyi "tata
letak piksel sprite belum terpecahkan", dan enam percobaan membaca datanya
langsung semuanya gagal. Yang memecahkannya bukan percobaan ketujuh atas datanya,
melainkan satu pertanyaan: **rutin mana yang membacanya?**

Dua penyalin menjawab semuanya.

`sub_4792` (offset citra 18322) — penyalin tak-tergeser, dipakai benda yang
selalu jatuh di batas bita:

    and ax,0xf | shl si,7 | add si,0x1840   16 entri, strid 128, basis 0x1840
    mov cx,0x20                              32 baris
    lodsw ; xchg al,ah ; stosw   (dua kali)  4 bita/baris -> 32 x 32 piksel

`sub_45CA` (offset citra 17866) — penyalin umum, XOR, dengan pergeseran saat
menggambar:

    mov bl,ch | shr bx,1 | sub ax,bx         dipusatkan pada X,Y
    mov cl,al | and cl,7                     CL = X mod 8  -> GESERAN BIT
    lodsw | mov dh,al | shr ax,cl | shr dx,cl
    xor es:[di],ah ; xor es:[di+1],al ; xor es:[di+2],dl
                                             3 bita keluaran per baris
    add di,0x1ffe  (setelah di maju 2)       = +0x2000 -> bank mode 6

Dua akibat penting dari `sub_45CA`:

* **XOR.** Menggambar dan menghapus dengan operasi yang sama. Itu sebabnya ada
  bendera per-pemain di `0xcbc`/`0xccc` yang di-`xor ...,1` tiap kali digambar.
* **Digeser saat menggambar.** Jadi **tidak pernah ada varian *pre-shifted*** di
  dalam berkas ini. Dugaan lama bahwa "sisa 64 bita tiap slot menyimpan varian
  ter-geser" tidak perlu diuji: pergeserannya dikerjakan CPU, bukan disimpan.

Pemanggilnya menentukan basis, tinggi, dan cara sudut dipetakan ke indeks:

    17999 mov si,0    | 18002 mov bp,0x1340   kapal pemain KIRI
    17990 mov si,0x10 | 17993 mov bp,0x1540   kapal pemain KANAN
    18017 add bl,8 | and bx,0xf0 | shl bx,1   16 sudut, strid 32
    18028 mov ch,0x10                          16 baris -> 16 x 16 piksel

    18047 mov bp,0x1740 / 18055 mov bp,0x17c0  sepasang, kiri & kanan
    18058 add bl,0x10 | and bx,0xe0 | shr bx,1 8 sudut, strid 16
    18045 mov ch,8                              8 baris -> 16 x 8 piksel
    18069 xor byte [si+0xcbc],1                 dikedipkan

    18294 shl bp,4 | 18296 add bp,0x22a0        strid 16, diindeks nilai
    18300 mov ch,8                              8 baris -> font angka

Keadaan pemain, dari pemanggil yang sama (strid 0x10 antar-pemain):

    [si+0xd5c] X    [si+0xd7c] Y    [si+0xe7c] sudut

JEBAKAN yang sempat memakan waktu berjam-jam, dan keduanya diam:

1. `spacewar.asm` memakai offset **citra**; `.EXE` punya header 512 bita di
   depannya. `offset_berkas = offset_asm + 0x200`.
2. `ARCHITECTURE.md` menyebut basis tabel bundar `0x1860`; kodenya bilang
   `0x1840`. Selisih 32 bita menggeser tiap entri seperempat baris.

Membaca dengan kerangka yang salah tetap menghasilkan pola yang rapi — lihat
`../NEGATIVE-RESULTS.md` §22.

Pemakaian:
    python decompile/tools/spritedec.py                # daftar tabel
    python decompile/tools/spritedec.py kapal-kiri     # satu tabel
    python decompile/tools/spritedec.py kapal-kiri --json
"""
import argparse, io, json, os, sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXE = os.path.join(AKAR, "run", "SPACEWAR.EXE")
HEADER = 0x200

# nama          basis   n   strid  lebar_bita  tinggi  penyalin
TABEL = {
    "bundar":      (0x1840, 16, 128, 4, 32, "sub_4792"),
    "kapal-kiri":  (0x1340, 16,  32, 2, 16, "sub_45CA"),
    "kapal-kanan": (0x1540, 16,  32, 2, 16, "sub_45CA"),
    "kecil-kiri":  (0x1740,  8,  16, 2,  8, "sub_45CA"),
    "kecil-kanan": (0x17c0,  8,  16, 2,  8, "sub_45CA"),
    "angka":       (0x22a0, 12,  16, 2,  8, "sub_45CA"),
}


def baca():
    return io.open(EXE, "rb").read()


def entri(b, nama, i):
    basis, n, strid, w, h, penyalin = TABEL[nama]
    a = HEADER + basis + i * strid
    e = b[a:a + h * w]
    keluar = []
    for r in range(h):
        p = e[r * w:(r + 1) * w]
        # Kedua penyalin menulis bita ganjil LEBIH DULU: `sub_4792` lewat
        # `xchg al,ah`, `sub_45CA` lewat urutan `ah` sebelum `al`. Jadi tiap
        # pasangan bita bertukar tempat sebelum jadi piksel.
        layar = bytes(v for k in range(0, len(p), 2) for v in (p[k + 1], p[k]))
        keluar.append("".join("#" if (x >> (7 - j)) & 1 else "."
                              for x in layar for j in range(8)))
    return keluar


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("tabel", nargs="?", choices=sorted(TABEL))
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    b = baca()

    if not a.tabel:
        print("%-13s %-8s %-4s %-6s %-9s %s" % ("tabel", "basis", "n", "strid", "ukuran", "penyalin"))
        for nama, (basis, n, strid, w, h, penyalin) in sorted(TABEL.items()):
            print("%-13s 0x%04X   %-4d %-6d %d x %-5d %s" % (nama, basis, n, strid, w * 8, h, penyalin))
        return

    if a.json:
        n = TABEL[a.tabel][1]
        print(json.dumps({i: entri(b, a.tabel, i) for i in range(n)}, indent=1))
        return

    n = TABEL[a.tabel][1]
    for i in range(n):
        s = entri(b, a.tabel, i)
        print("=== %s [%d] — %d piksel ===" % (a.tabel, i, sum(r.count("#") for r in s)))
        for r in s:
            print("  " + r)
        print()


if __name__ == "__main__":
    main()
