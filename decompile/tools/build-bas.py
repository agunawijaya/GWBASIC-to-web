"""Terbitkan ketiga .bas hasil rekompilasi ke direktori tujuan.

  python build-bas.py                 # ke decompile/<STEM>/<stem>-run.bas
  python build-bas.py --out <dir>     # ke direktori lain (untuk uji coba)
"""
import os, sys, argparse
import recover

ROOT = r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
STEMS = ("PAC-GAL", "3DTTT", "HOPPER")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=None)
    ap.add_argument("--flat", action="store_true")
    a = ap.parse_args()
    for stem in STEMS:
        r = recover.Rec(stem)
        t = r.text()
        if a.out:
            dest = os.path.join(a.out, stem.lower().replace("-", "") + ".bas")
        else:
            dest = os.path.join(ROOT, stem, stem.lower() + "-run.bas")
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w", encoding="latin-1", errors="replace").write("\n".join(t) + "\n")
        nums = [int(x.split()[0]) for x in t]
        ok = all(x < y for x, y in zip(nums, nums[1:]))
        print("%-8s %4d baris | terpanjang %3d | nomor menaik %s | sisa %s"
              % (stem, len(t), max(len(x) for x in t), ok,
                 sum(r.unhandled.values())))
        print("         -> %s" % dest)


if __name__ == "__main__":
    main()
