"""Ukur DI MANA waktu emulasi habis, alih-alih menebaknya.

Kenapa ini ada
--------------
HOPPER berhenti pada teks "INITIALIZING..." setelah ratusan juta instruksi. Reaksi
pertama saya salah: menambah anggaran, lalu membaca delapan alamat terakhir dari
`last inside` seolah itu bukti gelung. Delapan alamat terakhir bukan bukti apa pun --
itu sekadar ekor eksekusi.

Program BASIC sederhana tidak butuh ratusan juta instruksi untuk menyiapkan diri. Kalau
ia menghabiskannya, ada gelung yang berputar, dan letaknya bisa DIUKUR, bukan diterka.

Alat ini menghitung berapa kali tiap alamat dieksekusi lalu melaporkan yang terpanas,
beserta disassembly di sekitarnya. Itu menjawab "sedang apa dia" secara langsung.
"""
import sys, importlib.util, collections, struct
from pathlib import Path

COMRUN = Path(r"C:\Projects\DOS-Decompiler\tools\comrun.py")
spec = importlib.util.spec_from_file_location("comrun", COMRUN)
comrun = importlib.util.module_from_spec(spec)
sys.modules["comrun"] = comrun
spec.loader.exec_module(comrun)

from capstone import Cs, CS_ARCH_X86, CS_MODE_16
md = Cs(CS_ARCH_X86, CS_MODE_16)


class ProfMachine(comrun.Machine):
    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.hits = collections.Counter()

    def _on_code(self, uc, addr, size, user):
        self.hits[addr - self.img_bias] += 1
        return super()._on_code(uc, addr, size, user)


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("binary")
    ap.add_argument("--budget", type=int, default=20_000_000)
    ap.add_argument("--keys", default="")
    ap.add_argument("--poll-patience", type=int, default=100)
    ap.add_argument("--files")
    ap.add_argument("--top", type=int, default=12)
    ap.add_argument("--user-end", type=int, default=0)
    a = ap.parse_args()

    img = Path(a.binary).read_bytes()
    _k = [ord(c) for c in a.keys.encode().decode("unicode_escape")]
    m = ProfMachine(img, keys=_k, files=a.files)
    m.poll_patience = a.poll_patience
    m.run(budget=a.budget)

    tot = sum(m.hits.values())
    print("berhenti: %s" % m.stopped)
    print("instruksi tercatat: %,d" .replace(",", "") % tot if False else
          "instruksi tercatat: %d" % tot)

    # Kelompokkan menjadi region 64-byte supaya gelung terlihat sebagai satu blok
    reg = collections.Counter()
    for off, n in m.hits.items():
        reg[off & ~0x3F] += n
    print("\nregion terpanas (blok 64 byte):")
    for base, n in reg.most_common(a.top):
        print("   %6d-%-6d  %11d  %5.1f%%" % (base, base + 63, n, 100.0 * n / tot))

    # Kode pengguna berakhir jauh di bawah runtime. Kalau tak ada satu pun alamat
    # kode pengguna yang panas, programnya tidak sedang menjalankan pernyataan BASIC
    # -- ia terjebak di dalam SATU panggilan runtime, dan alamat pengguna dengan
    # hitungan tertinggi adalah pernyataan yang memanggilnya.
    if a.user_end:
        u = [(n, o) for o, n in m.hits.items() if o < a.user_end]
        u.sort(reverse=True)
        print("\nalamat KODE PENGGUNA terpanas (batas %d):" % a.user_end)
        for n, o in u[:10]:
            print("   %6d  %11d" % (o, n))
        if not u:
            print("   (tidak ada -- nol pernyataan BASIC dijalankan)")

    print("\nALAMAT tunggal terpanas:")
    for off, n in m.hits.most_common(15):
        print("   %6d  %11d  %5.1f%%" % (off, n, 100.0 * n / tot))

    hot = reg.most_common(1)[0][0]
    d = Path(a.binary).read_bytes()
    image = d[struct.unpack_from("<H", d, 8)[0] * 16:]
    print("\ndisassembly region terpanas (%d):" % hot)
    for ins in md.disasm(image[hot:hot + 64], hot):
        c = m.hits.get(ins.address, 0)
        print("   %6d  %11d  %-8s %s" % (ins.address, c, ins.mnemonic, ins.op_str))


if __name__ == "__main__":
    main()
