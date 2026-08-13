"""Pisahkan keluarga LOCATE / COLOR / SCREEN dari SIDIK JARI validator argumennya.

Ketiganya punya prolog yang identik -- simpan sp, dorong enam register, `mov cl, bl`,
lalu panggil validator. Yang membedakan ada di validator itu: ia memuat `si` dengan
alamat tabel batas dan `ch` dengan jumlah argumen maksimum. Pasangan (si, ch) itulah
sidik jari keluarganya, dan ia konsisten di ketiga biner:

    (0x53, 5)            LOCATE   -- row, col, cursor, start, stop
    (0x7A, 4)            SCREEN   -- mode, colorswitch, apage, vpage
    (0x7E, 3) + (0x83,4) COLOR    -- fg, bg, border

Dua kekeliruan penamaan lama terungkap lewat ini: PAC-GAL @20299 yang disebut LOCATE
sebenarnya COLOR, dan HOPPER @12557/@12583 yang disebut LOCATE sebenarnya SCREEN --
sehingga rekonstruksi HOPPER tak pernah menerbitkan pernyataan SCREEN sama sekali dan
seluruh grafiknya digambar di mode teks.

Alamat tabel bergeser antar biner (DGROUP-nya beda), jadi yang dicocokkan adalah
JUMLAH argumen `ch` beserta pola berapa tabel yang dicoba.
"""
import re, sys
from capstone import Cs, CS_ARCH_X86, CS_MODE_16
import ir

md = Cs(CS_ARCH_X86, CS_MODE_16)

# ch-tuple -> nama keluarga
KELUARGA = {(5,): "LOCATE", (4,): "SCREEN", (3, 4): "COLOR"}


def helper_of(prog, a):
    pc = a
    for _ in range(14):
        try:
            i = next(md.disasm(prog.img[pc:pc + 16], pc, 1))
        except StopIteration:
            return None
        if i.mnemonic == "call":
            m = re.match(r"^0x([0-9a-f]+)$", i.op_str)
            if m:
                return int(m.group(1), 16)
        if i.mnemonic in ("ret", "retf", "iret", "jmp"):
            return None
        pc = i.address + i.size
    return None


def fingerprint(prog, a):
    h = helper_of(prog, a)
    if h is None:
        return None
    pc, si, ch = h, [], []
    for _ in range(14):
        try:
            i = next(md.disasm(prog.img[pc:pc + 16], pc, 1))
        except StopIteration:
            break
        m = re.match(r"^si, (0x[0-9a-f]+)$", i.op_str)
        if i.mnemonic == "mov" and m:
            si.append(int(m.group(1), 16))
        m = re.match(r"^ch, (0x[0-9a-f]+|\d+)$", i.op_str)
        if i.mnemonic == "mov" and m:
            ch.append(int(m.group(1), 0))
        if i.mnemonic in ("ret", "retf", "iret"):
            break
        pc = i.address + i.size
    return (tuple(si), tuple(ch)) if ch else None


def main():
    for stem in (sys.argv[1:] or ["PAC-GAL", "3DTTT", "HOPPER"]):
        p = ir.Prog(stem)
        print("=== %s" % stem)
        for t, nm in sorted(p.named.items()):
            if not re.match(r"^(LOCATE|COLOR|SCREEN)", nm):
                continue
            f = fingerprint(p, t)
            if not f:
                continue
            keluarga = KELUARGA.get(f[1])
            n = sum(1 for s, x in p.sites.items() if s < p.end and x == t)
            tanda = "" if keluarga and nm.startswith(keluarga) else "   <-- KELIRU"
            print("   @%-6d %-12s ch=%-8s -> %-8s %2d situs%s"
                  % (t, nm, f[1], keluarga, n, tanda))


if __name__ == "__main__":
    main()
