"""Pecahkan basis tabel variabel [0x60a] dengan MENJALANKAN program.

FACSTORE! & kawan-kawan tidak menerima alamat variabel lewat bx. Mereka membaca
sebuah byte SEBARIS sesudah `lcall`, lalu helper @12831 menghitung

    alamat = byte*8 + word[0x60a]

Nilai [0x60a] disetel saat startup, jadi tak terbaca dari citra berkas. Alat ini
menjalankan program sebentar dan membacanya dari memori yang sebenarnya, sekaligus
mencatat pasangan (indeks sebaris -> alamat) yang benar-benar terjadi.

Pemakaian:
    python probe-vartab.py PAC-GAL --keys "100\r"
"""
import sys, struct, argparse, collections, importlib.util
from pathlib import Path

COMRUN = Path(r"C:\Projects\DOS-Decompiler\tools\comrun.py")
spec = importlib.util.spec_from_file_location("comrun", COMRUN)
comrun = importlib.util.module_from_spec(spec)
sys.modules["comrun"] = comrun
spec.loader.exec_module(comrun)

from unicorn.x86_const import (UC_X86_REG_DS, UC_X86_REG_ES, UC_X86_REG_DI,
                               UC_X86_REG_SI, UC_X86_REG_BX)

sys.path.insert(0, str(Path(__file__).parent))
import ir

RUN = Path(r"C:\Users\aguna\Downloads\Personal\Games\old_games\run")


class Probe(comrun.Machine):
    def __init__(self, image, prog, **kw):
        super().__init__(image, **kw)
        self.prog = prog
        self.vartab = None
        # alamat helper penyelesai indeks, dan alamat sesudah ia menghitung di
        self.pairs = collections.Counter()
        self.hits = collections.Counter()

    def _on_code(self, uc, addr, size, user):
        off = addr - self.img_bias
        self.hits[off] += 1
        # helper penyelesai indeks: rekam (indeks sebaris -> di) sesudah dihitung
        if off == self.prog.after_idx:
            di = uc.reg_read(UC_X86_REG_DI)
            ax = uc.reg_read(comrun.UC_X86_REG_AX) if hasattr(comrun, "UC_X86_REG_AX") else 0
            self.pairs[di] += 1
            if self.vartab is None:
                ds = uc.reg_read(UC_X86_REG_DS)
                try:
                    self.vartab = struct.unpack_from(
                        "<H", bytes(uc.mem_read(ds * 16 + 0x60A, 2)), 0)[0]
                except Exception:
                    pass
        return super()._on_code(uc, addr, size, user)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("stem")
    ap.add_argument("--keys", default="")
    ap.add_argument("--budget", type=int, default=3_000_000)
    ap.add_argument("--after-idx", type=int, default=12852,
                    help="alamat tepat sesudah 'add ax, es:[0x60a]' di helper")
    a = ap.parse_args()

    p = ir.Prog(a.stem)
    p.after_idx = a.after_idx
    # pantau alamat KEMBALI dari helper: di sudah berisi alamat variabel
    p.watch = set()

    img = (RUN / (a.stem + ".EXE")).read_bytes()
    keys = []
    for c in a.keys.encode().decode("unicode_escape"):
        keys.append(ord(c))
    m = Probe(img, p, keys=keys)
    m.poll_patience = 60
    m.run(budget=a.budget)
    print("berhenti  : %s" % m.stopped)
    print("instruksi : %d" % sum(m.hits.values()))
    print("[0x60a]   : %s" % (("0x%04X" % m.vartab) if m.vartab is not None else "TIDAK TERBACA"))
    print("helper %d dijalankan %d kali" % (a.after_idx, m.hits.get(a.after_idx, 0)))
    if m.pairs:
        ds = sorted(m.pairs)
        print("di (alamat variabel) yang terjadi: %d nilai unik, %s..%s"
              % (len(ds), hex(ds[0]), hex(ds[-1])))
        print("  contoh:", ", ".join(hex(x) for x in ds[:16]))
        # jarak antar alamat -> ukuran slot
        gaps = collections.Counter(b - a2 for a2, b in zip(ds, ds[1:]))
        print("  jarak antar alamat:", gaps.most_common(6))


if __name__ == "__main__":
    main()
