"""Periksa kesehatan .bas hasil rekompilasi tanpa menjalankannya.

Empat hal yang membuat GW-BASIC menolak berkas sebelum sempat berjalan:
nomor baris tidak menaik, baris lebih dari 255 karakter, target GOTO/GOSUB/THEN
yang tidak ada, dan `REM` yang tidak berada di ujung baris (ia menelan sisanya).
"""
import re, sys, os

ROOT = r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
FILES = [("PAC-GAL", "PAC-GAL/pac-gal-run.bas"),
         ("3DTTT", "3DTTT/3dttt-run.bas"),
         ("HOPPER", "HOPPER/hopper-run.bas")]

# `ON ERROR GOTO 0` bukan lompatan -- nol di situ berarti MEMATIKAN penangkap
# galat, dan baris 0 memang tak pernah ada. Sama seperti TREF di recover.py.
TARGET = re.compile(r"(?<!ON ERROR )\b(?:GOTO|THEN|GOSUB)\s+([\d,\s]+)")


def check(path):
    lines = [l.rstrip("\n") for l in open(path, encoding="latin-1") if l.strip()]
    nums = [int(l.split()[0]) for l in lines]
    have = set(nums)
    naik = all(a < b for a, b in zip(nums, nums[1:]))
    panjang = max(len(l) for l in lines)
    hilang = set()
    for l in lines:
        for m in TARGET.finditer(l):
            for y in m.group(1).split(","):
                y = y.strip()
                if y.isdigit() and int(y) not in have:
                    hilang.add(int(y))
    # REM harus jadi pernyataan TERAKHIR di barisnya
    rem_tengah = [n for n, l in zip(nums, lines)
                  if " REM " in l and " : " in l[l.index(" REM ") + 5:]]
    # THEN/ELSE menyerap SISA BARIS di BASIC. Pernyataan sesudahnya di baris yang
    # sama hanya jalan di cabang itu -- cacat yang sama kelasnya dengan REM.
    then_tengah = []
    for n, l in zip(nums, lines):
        for kata in (" THEN ", " ELSE "):
            k = l.find(kata)
            if k >= 0 and " : " in l[k + len(kata):]:
                then_tengah.append(n)
                break
    return len(lines), naik, panjang, sorted(hilang), rem_tengah + then_tengah


def cek_kunci_ganda():
    """Tabel nama di emit2.py adalah dict literal: kunci ganda DITELAN diam-diam dan
    yang terakhir menang. Koreksi nama yang disisipkan di depan lalu kalah oleh entri
    lama sudah terjadi dua kali (ON_GOSUB dan GFX2PT)."""
    import collections
    here = os.path.dirname(os.path.abspath(__file__))
    src = open(os.path.join(here, "emit2.py"), encoding="utf-8").read()
    salah = []
    for T in ("3DTTT.EXE", "PAC-GAL.EXE", "HOPPER.EXE"):
        m = re.search(re.escape('"%s":dict(' % T) + r".*?named=\{(.*?)\}\)", src, re.S)
        if not m:
            continue
        pairs = re.findall(r'(\d+):"([^"]+)"', m.group(1))
        for k, n in collections.Counter(k for k, _ in pairs).items():
            if n > 1:
                salah.append("%s @%s -> %s" % (T, k, [v for kk, v in pairs if kk == k]))

    # Tabel BUKTI di audit-names.py adalah dict literal yang sama rawannya, dan
    # jebakan itu sudah menggigit ketiga kalinya: entri INPUT_DONE @22031 yang
    # baru kalah diam-diam oleh entri STKPOP lama, sehingga auditnya masih
    # meluluskan nama yang sudah ditinggalkan.
    ev = open(os.path.join(here, "audit-names.py"), encoding="utf-8").read()
    for T in ("3DTTT.EXE", "PAC-GAL.EXE", "HOPPER.EXE"):
        m = re.search(r'"%s":\s*\{(.*?)\n \}' % re.escape(T), ev, re.S)
        if not m:
            continue
        pairs = re.findall(r'(\d+):\("([^"]+)"', m.group(1))
        for k, n in collections.Counter(k for k, _ in pairs).items():
            if n > 1:
                salah.append("bukti %s @%s -> %s"
                             % (T, k, [v for kk, v in pairs if kk == k]))
    return salah


def pisah(l):
    """Pecah satu baris fisik menjadi pernyataan, menghormati tanda kutip."""
    res, cur, q, i = [], "", False, 0
    while i < len(l):
        if l[i] == '"':
            q = not q
        if not q and l[i:i + 3] == " : ":
            res.append(cur); cur = ""; i += 3; continue
        cur += l[i]; i += 1
    res.append(cur)
    return res


def cek_pemisah_print():
    """Jumlah PRINT berakhir-baris-baru di .bas HARUS sama dengan jumlah stub
    pemisah 'baris baru' di biner.

    Tiap item PRINT yang dikompilasi memanggil stub 5-byte yang membawa dua byte
    sebaris: tipe dan pemisah (0=koma, 1=titik-koma, 2=baris baru). Pemisah itu
    menentukan apakah kursor pindah baris -- dan di layar 25 baris, satu baris
    baru yang salah tempat MENGGULUNG seluruh layar.

    Ini invarian kesetiaan yang tak bergantung waktu, jadi ia menguji hal yang
    tak bisa diuji wasit layar pada permainan bergerak. Ia pula yang membuktikan
    bahwa gulungan PAC-GAL saat kehilangan nyawa memang perilaku asli 1982,
    bukan cacat rekonstruksi: birernya memang memuat tepat dua pemisah itu.
    """
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import ir
    salah = []
    for stem, rel in FILES:
        p = ir.Prog(stem)
        biner = sum(1 for s, t in p.sites.items()
                    if s < p.end and t in p.stub and p.stub[t][1] == 2)
        n = 0
        for l in open(os.path.join(ROOT, rel), encoding="latin-1"):
            for j, s in enumerate(pisah(l.rstrip("\n"))):
                s = s.strip()
                if j == 0:
                    s = re.sub(r"^\d+\s+", "", s)   # buang nomor baris
                if s.startswith("PRINT") and not s.endswith((";", ",")):
                    n += 1
        if n != biner:
            salah.append("%s: biner %d, .bas %d" % (stem, biner, n))
    return salah


def cek_literal():
    """Setiap teks yang bisa dicetak biner harus muncul di .bas.

    Wasit layar tak bisa menguji ini pada semua layar: layar instruksi HOPPER
    memakan waktu di mesin asli karena 233 kali READ dari DATA, sementara
    PC-BASIC menyelesaikannya seketika, jadi .bas sudah masuk permainan sebelum
    cuplikan pertama diambil. Selisihnya KECEPATAN, bukan isi -- dan isinya bisa
    diuji tanpa waktu sama sekali.

    Yang diperiksa hanya deskriptor yang alamatnya benar-benar muncul sebagai
    immediate 16-bit di kode pengguna, jadi tabel pesan galat runtime tidak ikut
    terhitung. Batas 8 karakter membuang potongan pendek yang kebetulan
    berbentuk deskriptor.

    Pemeriksaan inilah yang menemukan tiga pernyataan PRINT USING HOPPER yang
    hilang seluruhnya -- dua di antaranya prompt yang menampilkan nilai berjalan
    di dalam kurung siku.
    """
    import struct
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import ir
    salah = []
    for stem, rel in FILES:
        p = ir.Prog(stem)
        bas = open(os.path.join(ROOT, rel), encoding="latin-1").read()
        for a in range(0, len(p.dg) - 4):
            rt = a + ir.DELTA
            s = p.sdesc(rt)
            if not s or len(s) < 8 or not re.search(r"[A-Za-z]{3}", s):
                continue
            if struct.pack("<H", rt) not in p.img[:p.end]:
                continue                      # tak dirujuk kode pengguna
            if s not in bas:
                salah.append("%s: %r" % (stem, s[:50]))
    return salah


def main():
    bad = 0
    lit = cek_literal()
    if lit:
        print("LITERAL hilang dari .bas: %s" % "; ".join(lit[:6]))
        bad += 1
    else:
        print("literal terpakai: semuanya ada di .bas")
    sep = cek_pemisah_print()
    if sep:
        print("PEMISAH PRINT tidak cocok: %s" % "; ".join(sep))
        bad += 1
    else:
        print("pemisah PRINT baris-baru: cocok dengan biner di ketiganya")
    dup = cek_kunci_ganda()
    if dup:
        print("KUNCI GANDA di tabel nama: %s" % dup)
        bad += 1
    for name, rel in FILES:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            print("%-9s TIDAK ADA" % name)
            bad += 1
            continue
        n, naik, panjang, hilang, rem = check(p)
        ok = naik and panjang <= 255 and not hilang and not rem
        print("%-9s %4d baris | maks %3d kar | urut %-5s | target hilang %d | cabang menelan %d | %s"
              % (name, n, panjang, naik, len(hilang), len(rem), "OK" if ok else "PERIKSA"))
        if hilang:
            print("            target hilang: %s" % hilang[:8])
        bad += 0 if ok else 1
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
