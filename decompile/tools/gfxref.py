"""Wasit GRAFIS: bandingkan framebuffer CGA EXE asli dengan framebuffer .bas.

`refscreen.py` hanya membandingkan mode teks. HOPPER berjalan di `SCREEN 1`
(CGA 320x200, empat warna), jadi seluruh dunianya tak pernah masuk perbandingan.

Kedua sisi kini bisa memberi kisi 320x200 bernilai 0-3 yang sama bentuknya:

  EXE  -> textscreen.TextMachine.pixels()  (decode B800 mode 4, dua bank berselang)
  .bas -> get_pixels() PC-BASIC

Permainannya BERGERAK, jadi kecocokan sel-demi-sel mengukur kapan cuplikan diambil.
Yang dibandingkan karena itu tiga hal yang tak bergantung waktu:

  * profil tinta per baris  -- pita jalur horizontal ada di baris yang sama
  * himpunan warna terpakai -- palet yang sama benar-benar dipakai
  * peta baris berisi       -- baris mana yang digambar dan mana yang dibiarkan kosong
"""
import argparse, os, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

TINTA = " .:#"


def baca(path):
    kisi = []
    for l in open(path, encoding="utf-8"):
        l = l.strip()
        if l:
            kisi.append([int(c) for c in l])
    return kisi


def profil(px):
    return [sum(1 for v in r if v) for r in px]


def render(px, kolom=64, baris=25):
    H, W = len(px), len(px[0])
    out = []
    for r in range(baris):
        t = []
        for c in range(kolom):
            y0, y1 = r * H // baris, (r + 1) * H // baris
            x0, x1 = c * W // kolom, (c + 1) * W // kolom
            hit = {}
            for y in range(y0, y1):
                for x in range(x0, x1):
                    v = px[y][x]
                    if v:
                        hit[v] = hit.get(v, 0) + 1
            t.append(TINTA[max(hit, key=hit.get)] if hit else " ")
        out.append("".join(t))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("exe_px")
    ap.add_argument("bas_px")
    a = ap.parse_args()

    E, B = baca(a.exe_px), baca(a.bas_px)
    print("EXE  %dx%d | .bas %dx%d" % (len(E[0]), len(E), len(B[0]), len(B)))

    we = {v for r in E for v in r}
    wb = {v for r in B for v in r}
    print("warna terpakai: EXE %s | .bas %s | %s"
          % (sorted(we), sorted(wb), "SAMA" if we == wb else "BEDA"))

    pe, pb = profil(E), profil(B)
    ne = sum(pe)
    nb = sum(pb)
    print("piksel bukan-nol: EXE %d | .bas %d" % (ne, nb))

    # baris mana yang digambar sama sekali
    be = [1 if v else 0 for v in pe]
    bb = [1 if v else 0 for v in pb]
    sama = sum(1 for x, y in zip(be, bb) if x == y)
    print("peta baris berisi: %d dari %d baris sepakat (%.0f%%)"
          % (sama, len(be), 100.0 * sama / len(be)))

    # korelasi profil tinta per baris
    n = min(len(pe), len(pb))
    mx, my = sum(pe[:n]) / n, sum(pb[:n]) / n
    num = sum((pe[i] - mx) * (pb[i] - my) for i in range(n))
    dx = sum((pe[i] - mx) ** 2 for i in range(n)) ** 0.5
    dy = sum((pb[i] - my) ** 2 for i in range(n)) ** 0.5
    r = num / (dx * dy) if dx and dy else 0.0
    print("korelasi profil tinta per baris: %.3f" % r)

    print("\n%-64s   %s" % ("EXE ASLI", ".bas REKONSTRUKSI"))
    for x, y in zip(render(E), render(B)):
        print("|%s|  |%s|" % (x, y))


if __name__ == "__main__":
    main()
