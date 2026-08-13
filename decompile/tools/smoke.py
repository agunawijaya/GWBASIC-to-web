"""Jalankan ketiga .bas dan laporkan galat runtime pertamanya.

checkbas.py memeriksa bentuk berkas; alat ini memeriksa PERILAKU. Semua cacat yang
paling mahal di proyek ini -- operan tertukar, urutan CONCAT$ terbalik, LOAD! salah
tafsir, ubin labirin hilang -- lolos pemeriksaan statis dan hanya terlihat waktu
programnya dijalankan. Menjalankannya harus semurah menjalankan tes.

Yang diperiksa:
  1. adakah galat runtime BASIC di layar (`Illegal function call in NNNN`, dst)
  2. berapa baris layar terisi -- program yang mati diam meninggalkan layar kosong
  3. untuk PAC-GAL: apakah setiap baris labirin selebar 79 kolom

  python smoke.py            # ketiganya
  python smoke.py PAC-GAL    # satu saja
"""
import os, re, sys, subprocess

ROOT = r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
HERE = os.path.dirname(os.path.abspath(__file__))

CASES = [
    # stem, berkas, tombol, detik, minimal baris terisi
    ("PAC-GAL", "PAC-GAL/pac-gal-run.bas", "100\\r", 45, 20),
    ("3DTTT", "3DTTT/3dttt-run.bas", "\x1bAGUNA\r1YX", 50, 15),  # Esc, nama, pemain, duluan?, X/O
    # "K" saja berhenti di prompt skill; jawab skill dan speed supaya permainannya
    # benar-benar masuk mode grafis. Jendela DI TENGAH permainan: sesudah GAME
    # OVER layarnya dibersihkan.
    ("HOPPER", "HOPPER/hopper-run.bas", "K1\r100\r", 28, 1),
]

ERR = re.compile(
    r"(Syntax error|Illegal function call|Out of memory|Subscript out of range|"
    r"Overflow|Type mismatch|Undefined line number|Division by zero|"
    r"RETURN without GOSUB|Out of DATA|String too long|Line buffer overflow|"
    r"Input past end|Bad file mode|Subscript out of range|Path not found|"
    r"File not found|Field overflow|Disk full)"
    r"(?: in (\d+))?")


def run(stem, rel, keys, secs):
    """PLAY memutar musik dalam waktu nyata dan memperlambat uji sampai tak berguna;
    untuk uji-asap ia dilucuti. Itu tidak menyembunyikan galat -- PLAY tak pernah
    menjadi sumbernya."""
    src = open(os.path.join(ROOT, rel), encoding="latin-1").read()
    src = re.sub(r"(?<![A-Z0-9$])PLAY [^:\n]*", "REM", src)
    tmp = os.path.join(os.environ.get("TEMP", "."), "smoke-%s.bas" % stem.lower())
    open(tmp, "w", encoding="latin-1").write(src)
    out = subprocess.run(
        [sys.executable, os.path.join(HERE, "runbas.py"), tmp,
         "--keys", keys, "--seconds", str(secs), "--widths"],
        capture_output=True, text=True, encoding="utf-8", errors="replace")
    return out.stdout


def main():
    want = sys.argv[1:] or [c[0] for c in CASES]
    bad = 0
    for stem, rel, keys, secs, minrows in CASES:
        if stem not in want:
            continue
        txt = run(stem, rel, keys, secs)
        rows = [l for l in txt.splitlines() if re.match(r"^\s*\d+ lebar=", l)]
        mp = re.search(r"^piksel: (\d+)", txt, re.M)
        pix = int(mp.group(1)) if mp else 0
        m = ERR.search(txt)
        note = []
        if m:
            note.append("GALAT %s%s" % (m.group(1),
                                        " di %s" % m.group(2) if m.group(2) else ""))
        # Layar dianggap hidup kalau ADA isinya -- teks ATAU grafis.
        #
        # `get_pixels()` mengembalikan penyangga mode teks juga, jadi jumlah piksel
        # sendirian bukan bukti mode grafis dan tak bisa jadi kriteria tunggal.
        # Tapi HOPPER pindah ke SCREEN 1 dan layar TEKS-nya lalu memang kosong;
        # menuntut baris teks di situ menolak program yang justru berjalan paling
        # jauh. Piksel dicuplik pada bingkai terkaya selama permainan berjalan.
        if len(rows) < minrows and pix < 1000:
            note.append("layar mati: %d baris teks, %d piksel" % (len(rows), pix))
        if stem == "PAC-GAL":
            # hanya baris LABIRIN yang wajib 79 kolom; baris status di bawahnya
            # (skor, nyawa, judul) memang lebih pendek
            maze = [l for l in rows if "∙" in l or "█" in l]
            lebar = [int(re.search(r"lebar=(\d+)", l).group(1)) for l in maze]
            sempit = [w for w in lebar if w < 79]
            if sempit:
                note.append("%d baris labirin kependekan: %s" % (len(sempit), sempit[:5]))
        print("%-9s %-3s %s" % (stem, "OK" if not note else "!!",
                                "; ".join(note) if note else
                                "%d baris teks, %d piksel, tanpa galat" % (len(rows), pix)))
        bad += bool(note)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
