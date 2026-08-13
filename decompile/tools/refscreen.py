"""Wasit LAYAR: bandingkan apa yang digambar EXE asli dengan apa yang digambar .bas.

Uji asap hanya menangkap galat runtime. Ia tidak menangkap hasil yang salah diam-diam
-- dan justru itulah kelas cacat yang paling mahal di proyek ini: urutan CONCAT$
terbalik, LOAD! salah tafsir, ubin labirin hilang, ON..GOSUB yang ternyata GOTO.
Semuanya lolos pemeriksaan statis dan baru ketahuan waktu layarnya terlihat aneh.

Sekarang ada DUA hal yang bisa dijalankan untuk program yang sama. Membandingkan
layarnya mengubah verifikasi dari "saya perhatikan ada yang janggal" menjadi terukur.

  EXE  -> tools/textscreen.py (menurunkan comrun.Machine, mencegat INT 10h)
  .bas -> tools/runbas.py     (membaca isi layar lewat API PC-BASIC)

Pemakaian:
  python refscreen.py 3DTTT --keys "\\x1b1YX" --seconds 60
"""
import argparse, os, re, subprocess, sys, tempfile

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"C:\Users\aguna\Downloads\Personal\Games\old_games"
HERE = os.path.dirname(os.path.abspath(__file__))
BAS = {"PAC-GAL": "PAC-GAL/pac-gal-run.bas",
       "3DTTT": "3DTTT/3dttt-run.bas",
       "HOPPER": "HOPPER/hopper-run.bas"}


def layar_exe(stem, keys, budget, timer_isr=None, files=None):
    out = os.path.join(tempfile.gettempdir(), "ref-exe-%s.txt" % stem.lower())
    r = subprocess.run(
        [sys.executable, os.path.join(HERE, "textscreen.py"),
         os.path.join(ROOT, "run", stem + ".EXE"),
         "--keys", keys, "--budget", str(budget), "--out", out]
        + (["--timer-isr", timer_isr] if timer_isr else [])
        + (["--files", files] if files else []),
        capture_output=True, text=True, encoding="utf-8", errors="replace")
    if not os.path.exists(out):
        return None, r.stdout + r.stderr
    return [l.rstrip() for l in open(out, encoding="utf-8")], r.stdout


def buang_play(src):
    """Netralkan pernyataan PLAY -- TANPA menyentuh isi literal string.

    Versi lama memakai `re.sub(r"(?<![A-Z0-9$])PLAY [^:\\n]*", "REM", src)` yang
    juga cocok DI DALAM tanda kutip. HOPPER punya
    `PRINT "WOULD YOU LIKE TO PLAY AGAIN (y/n)? ";` dan potongan itu berubah jadi
    `PRINT "WOULD YOU LIKE TO REM`, sehingga layarnya berbeda dari EXE justru
    karena alat pembandingnya sendiri yang merusaknya.

    Penggantinya `PLAY ""`, bukan `REM`: `REM` mengomentari SISA BARIS, jadi
    pernyataan apa pun sesudah PLAY pada baris yang sama ikut hilang. `PLAY ""`
    memainkan nol nada, selesai seketika, dan strukturnya tetap satu pernyataan.
    """
    out, i, q = [], 0, False
    while i < len(src):
        c = src[i]
        if c == '"':
            q = not q
        if not q and src.startswith("PLAY ", i) and (
                i == 0 or not re.match(r"[A-Z0-9$]", src[i - 1])):
            j = i
            while j < len(src) and src[j] not in ":\n":
                j += 1
            out.append('PLAY ""')
            i = j
            continue
        out.append(c)
        i += 1
    return "".join(out)


def layar_bas(stem, keys, seconds, keep_play=False, peak=False):
    src = open(os.path.join(ROOT, "decompile", BAS[stem]), encoding="latin-1").read()
    # PLAY berjalan dalam waktu NYATA dan memperlambat uji tanpa mengubah layar.
    #
    # Tapi untuk permainan bergerak, membuangnya justru MERUSAK perbandingan: EXE
    # di bawah comrun membeku pada labirin yang baru digambar (gelung permainannya
    # menunggu detak timer yang tak pernah datang), sementara .bas tanpa PLAY
    # melesat jauh ke dalam permainan. Yang terbandingkan lalu dua SAAT berbeda,
    # dan selisihnya terbaca seolah cacat rekonstruksi. Dengan PLAY dipertahankan,
    # kedua sisi sama-sama berada pada labirin awal dan PAC-GAL cocok 100%.
    if not keep_play:
        src = buang_play(src)
    tmp = os.path.join(tempfile.gettempdir(), "ref-bas-%s.bas" % stem.lower())
    open(tmp, "w", encoding="latin-1").write(src)
    out = os.path.join(tempfile.gettempdir(), "ref-bas-%s.txt" % stem.lower())
    subprocess.run(
        [sys.executable, os.path.join(HERE, "runbas.py"), tmp,
         "--keys", keys, "--seconds", str(seconds), "--out", out]
        + (["--peak"] if peak else []),
        capture_output=True, text=True, encoding="utf-8", errors="replace")
    if not os.path.exists(out):
        return None
    return [l.rstrip() for l in open(out, encoding="utf-8")]


def norm(l):
    """Bandingkan isi, bukan spasi.

    Kedua penangkap memperlakukan sel kosong berbeda: comrun mengisi layar dengan
    spasi, PC-BASIC dengan NUL. Karakter kendali dibuang supaya baris yang sebenarnya
    kosong tidak terhitung sebagai isi."""
    l = "".join(c if c >= " " else " " for c in l)
    return re.sub(r"\s+", " ", l).strip()


KOTAK = frozenset(chr(c) for c in range(0x2500, 0x25A0))


def rangka(l):
    """Baris direduksi menjadi kerangka dindingnya saja.

    Untuk permainan bergerak, membandingkan baris apa adanya mengukur KAPAN
    cuplikan diambil, bukan apakah gambarnya benar: titik, hantu, pemain, dan
    ruang bekas titik yang dimakan menempati sel yang sama dan berganti-ganti
    sepanjang permainan. PAC-GAL bahkan menggulung satu baris begitu mencapai
    "Play again???", sehingga seluruh layar bergeser.

    Memetakan setiap sel bukan-dinding ke satu tanda membuang semua itu. Yang
    tersisa hanyalah labirinnya -- dan labirin itu tidak pernah berubah, jadi
    kecocokannya bisa diuji tanpa menyamakan waktu kedua sisi.
    """
    return "".join(c if c in KOTAK else "." for c in l).rstrip(".")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("stem")
    ap.add_argument("--keys", default="")
    ap.add_argument("--seconds", type=float, default=45)
    ap.add_argument("--budget", type=int, default=30_000_000)
    ap.add_argument("--timer-isr",
                    help="kirim detak timer ke penangan yang dipasang program "
                         "(mis. 1c); tanpa ini EXE-nya membeku di gelung tunggu")
    ap.add_argument("--files",
                    help="direktori berkas untuk layanan FCB DOS; HOPPER "
                         "membaca papan skornya lewat int 21h ah=21h dan "
                         "tanpa ini gelungnya tak pernah selesai")
    ap.add_argument("--peak", action="store_true",
                    help="bandingkan bingkai TERKAYA .bas, bukan layar terakhir")
    ap.add_argument("--keep-play", action="store_true",
                    help="pertahankan PLAY supaya .bas berjalan pada laju aslinya")
    a = ap.parse_args()

    exe, catatan = layar_exe(a.stem, a.keys, a.budget, a.timer_isr, a.files)
    bas = layar_bas(a.stem, a.keys, a.seconds, a.keep_play, a.peak)
    if exe is None:
        print("EXE tidak menghasilkan layar:\n%s" % catatan[-400:])
        return 2
    if bas is None:
        print(".bas tidak menghasilkan layar")
        return 2

    ne = [norm(l) for l in exe if norm(l)]
    nb = [norm(l) for l in bas if norm(l)]
    sama = [l for l in ne if l in nb]
    hanya_exe = [l for l in ne if l not in nb]
    hanya_bas = [l for l in nb if l not in ne]

    print("baris berisi: EXE %d | .bas %d | COCOK %d (%.0f%% dari EXE)"
          % (len(ne), len(nb), len(sama), 100.0 * len(sama) / max(1, len(ne))))
    if hanya_exe:
        print("\nhanya di EXE (%d):" % len(hanya_exe))
        for l in hanya_exe[:8]:
            print("   - %s" % l[:76])
    if hanya_bas:
        print("\nhanya di .bas (%d):" % len(hanya_bas))
        for l in hanya_bas[:8]:
            print("   + %s" % l[:76])

    # Ukuran kedua: kerangka dinding, yang tak bergantung pada waktu cuplikan.
    re_ = [rangka(l) for l in exe if set(l) & KOTAK]
    rb = [rangka(l) for l in bas if set(l) & KOTAK]
    if re_:
        set_b = set(rb)
        cocok = [l for l in re_ if l in set_b]
        print("\nkerangka dinding: EXE %d baris | .bas %d | COCOK %d (%.0f%%)"
              % (len(re_), len(rb), len(cocok), 100.0 * len(cocok) / len(re_)))
        for l in [x for x in re_ if x not in set_b][:6]:
            print("   - %s" % l[:76])
        if len(cocok) == len(re_):
            print("   -> labirin identik sel demi sel")
            return 0
    return 0 if not hanya_exe else 1


if __name__ == "__main__":
    sys.exit(main())
