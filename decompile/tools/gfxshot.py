"""Tangkap layar GRAFIS .bas dari PC-BASIC dan render sebagai seni ASCII.

Wasit layar hanya membandingkan mode teks. HOPPER menggambar di `SCREEN 1`
(CGA 320x200 empat warna) dengan PSET/DRAW/PAINT/PUT, dan sampai sekarang tak
ada satu pun bukti bahwa gambar itu benar-benar terbentuk.

`get_pixels()` PC-BASIC ternyata MEMANG mengembalikan framebuffer grafis --
catatan lama yang bilang ia mengembalikan penyangga teks keliru: waktu itu
programnya belum sempat masuk mode grafis, jadi yang terbaca memang layar teks.
Diuji dengan `SCREEN 1 : LINE (0,0)-(319,199),3`, ia mengembalikan 320x200 dengan
warna 3 di sepanjang diagonal.

Pemakaian:
  python gfxshot.py ../HOPPER/hopper-run.bas --keys K --seconds 30
"""
import argparse, os, re, sys, tempfile, threading, time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pcbasic
from refscreen import buang_play

# empat warna CGA -> kepadatan tinta yang naik
TINTA = " .:#"


def tangkap(path, keys, seconds, no_play=True):
    src = open(path, encoding="latin-1").read()
    if no_play:
        src = buang_play(src)
    disk = os.path.join(tempfile.gettempdir(), "basdisk")
    os.makedirs(disk, exist_ok=True)
    kw = {"peek_values": {}, "allow_code_poke": True,
          "devices": {"Z": disk}, "current_device": "Z"}
    with pcbasic.Session(syntax="advanced", **kw) as s:
        for line in src.splitlines():
            if line.strip():
                s.execute(line)
        selesai = []

        def jalan():
            try:
                s.execute("RUN")
            except Exception as e:
                selesai.append(repr(e))
            else:
                selesai.append("selesai")

        def suap():
            for _ in range(120):
                time.sleep(seconds / 120.0)
                if selesai:
                    return
                try:
                    s.press_keys(keys)
                except Exception:
                    return

        threading.Thread(target=suap, daemon=True).start()
        t = threading.Thread(target=jalan, daemon=True)
        t.start()
        # Cuplik BERKALA selama permainan berjalan, bukan sekali di akhir. HOPPER
        # membersihkan layarnya begitu permainan usai, jadi tangkapan tunggal di
        # ujung waktu selalu kosong -- yang terbaca seolah tak ada grafis sama
        # sekali. Yang disimpan adalah bingkai dengan piksel TERBANYAK.
        terbaik, skor = None, -1
        habis = time.time() + seconds
        while time.time() < habis:
            t.join(0.4)
            try:
                px = s.get_pixels()
            except Exception:
                break
            n = sum(1 for r in px for v in r if v)
            if n > skor:
                terbaik, skor = px, n
            if selesai:
                break
        status = selesai[0] if selesai else "masih berjalan"
    return terbaik, status


def render(px, kolom=80, baris=25):
    """Perkecil ke petak kolom x baris, ambil warna yang PALING SERING per petak."""
    H, W = len(px), len(px[0])
    out = []
    for r in range(baris):
        baris_teks = []
        for c in range(kolom):
            y0, y1 = r * H // baris, (r + 1) * H // baris
            x0, x1 = c * W // kolom, (c + 1) * W // kolom
            hit = {}
            for y in range(y0, y1):
                for x in range(x0, x1):
                    v = px[y][x]
                    hit[v] = hit.get(v, 0) + 1
            # petak dianggap berisi kalau ADA piksel bukan-nol
            bukan_nol = {k: v for k, v in hit.items() if k}
            v = max(bukan_nol, key=bukan_nol.get) if bukan_nol else 0
            baris_teks.append(TINTA[v & 3])
        out.append("".join(baris_teks))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bas")
    ap.add_argument("--keys", default="")
    ap.add_argument("--seconds", type=float, default=30)
    ap.add_argument("--out")
    a = ap.parse_args()

    keys = a.keys.encode().decode("unicode_escape")
    px, status = tangkap(a.bas, keys, a.seconds)
    H, W = len(px), len(px[0])
    hist = {}
    for r in px:
        for v in r:
            hist[v] = hist.get(v, 0) + 1
    nz = sum(v for k, v in hist.items() if k)
    print("layar %dx%d | piksel bukan-nol %d | warna %s | %s"
          % (W, H, nz, dict(sorted(hist.items())), status))
    seni = render(px)
    print("+" + "-" * 80 + "+")
    for r in seni:
        print("|" + r + "|")
    print("+" + "-" * 80 + "+")
    if a.out:
        # simpan piksel MENTAH supaya bisa dibandingkan, bukan seni ASCII-nya
        with open(a.out, "w", encoding="utf-8") as f:
            for r in px:
                f.write("".join(str(v & 3) for v in r) + "\n")
        print("-> %s (piksel mentah %dx%d)" % (a.out, W, H))


if __name__ == "__main__":
    main()
