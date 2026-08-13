"""Resolusi operan yang benar untuk tiap situs panggilan runtime.

Menggantikan tebakan bx di emit2.py dengan tiga saluran yang sudah terbukti:

  bx  = alamat DESKRIPTOR string  -> (len:word, ptr:word), alamat runtime = berkas + 4
  di  = alamat KONSTANTA float    -> MBF single (4 byte) atau double (8 byte)
  db  = INDEKS variabel SEBARIS   -> alamat = idx*8 + [0x60a]; identitas variabel

Bukti untuk saluran ketiga: helper @12831 (PAC-GAL) melakukan
    pop si / pop ds / lodsb / shl al,1 / mov ah,0 / shl ax,1 / shl ax,1
    add ax, es:[0x60a]
yaitu idx*8 + basis. FACSTORE! memanggilnya lalu menyalin FAC (si=0x1A) ke es:di.
"""
import struct, collections
import ir


def mbf(img, off, n):
    """MBF: n-1 byte mantissa little-endian, bit7 byte tertinggi = tanda,
    byte terakhir = eksponen bias 128. Eksponen 0 berarti nol."""
    b = img[off:off + n]
    if len(b) < n:
        return None
    ex = b[n - 1]
    if ex == 0:
        return 0.0
    sign = -1 if (b[n - 2] & 0x80) else 1
    M = 0
    for i in range(n - 1):
        c = b[i] | 0x80 if i == n - 2 else b[i]
        M |= c << (8 * i)
    bits = 8 * (n - 1)
    return sign * M * 2.0 ** (ex - 128 - bits)


def fmtnum(v):
    if v is None:
        return "?"
    if v == int(v) and abs(v) < 1e15:
        return str(int(v))
    r = repr(round(v, 7))
    return r


class Ops:
    def __init__(self, prog):
        self.p = prog

    # --- konstanta float di DGROUP ---
    def const(self, addr, dbl=False):
        off = self.p.base + addr - ir.DELTA
        if off < 0 or off + (8 if dbl else 4) > len(self.p.img):
            return None
        return mbf(self.p.img, off, 8 if dbl else 4)

    # --- string ---
    def string(self, addr):
        return self.p.sdesc(addr)

    def scan(self):
        """Untuk tiap panggilan: kumpulkan bx/dx/di terakhir yang DITETAPKAN LANGSUNG
        di antara panggilan sebelumnya dan panggilan ini -- tanpa pewarisan diam-diam."""
        st = self.p.stream()
        rows = []
        reg = {}
        for a, kind, v in st:
            if kind == "insn":
                m, o = v.mnemonic, v.op_str
                mm = re_movimm(m, o)
                if mm:
                    reg[mm[0]] = ("imm", mm[1])
                    continue
                mm = re_movmem(m, o)
                if mm:
                    reg[mm[0]] = ("mem", mm[1])
                    continue
                mm = re_movreg(m, o)
                if mm:
                    reg[mm[0]] = reg.get(mm[1], ("?", None))
                    continue
                # instruksi lain yang menulis register tujuan -> hanguskan
                d = dest_reg(m, o)
                if d:
                    reg.pop(d, None)
            elif kind == "call":
                tgt, nm, raw = v
                rows.append((a, tgt, nm, dict(reg), raw))
                # konvensi: bx bertahan lintas panggilan (wrapper push/pop),
                # tetapi dx/di/si TIDAK dijamin -- jangan wariskan
                for r in ("di", "si", "dx", "ax", "cx"):
                    reg.pop(r, None)
        return rows


import re as _re
_MOVIMM = _re.compile(r"^(ax|bx|cx|dx|si|di|al|ah|bl|bh|cl|ch|dl|dh), (0x[0-9a-f]+|\d+)$")
_MOVMEM = _re.compile(r"^(ax|bx|cx|dx|si|di), word ptr \[(0x[0-9a-f]+)\]$")
_MOVREG = _re.compile(r"^(ax|bx|cx|dx|si|di), (ax|bx|cx|dx|si|di)$")


def re_movimm(m, o):
    if m != "mov":
        return None
    g = _MOVIMM.match(o)
    return (g.group(1), int(g.group(2), 0)) if g else None


def re_movmem(m, o):
    if m != "mov":
        return None
    g = _MOVMEM.match(o)
    return (g.group(1), int(g.group(2), 0)) if g else None


def re_movreg(m, o):
    if m != "mov":
        return None
    g = _MOVREG.match(o)
    return (g.group(1), g.group(2)) if g else None


def dest_reg(m, o):
    if m in ("push", "cmp", "test", "jmp", "nop", "ret", "retf", "int3"):
        return None
    g = _re.match(r"^(ax|bx|cx|dx|si|di)\b", o)
    return g.group(1) if g else None


if __name__ == "__main__":
    import sys
    stem = sys.argv[1] if len(sys.argv) > 1 else "PAC-GAL"
    p = ir.Prog(stem)
    O = Ops(p)
    rows = O.scan()
    print("%d panggilan" % len(rows))
    # ringkas: rutin -> saluran operan yang dipakai
    chan = collections.defaultdict(collections.Counter)
    for a, tgt, nm, reg, raw in rows:
        key = nm or ("@%d" % tgt)
        if raw:
            chan[key]["inline"] += 1
        if "bx" in reg and reg["bx"][0] == "imm" and O.string(reg["bx"][1]) is not None:
            chan[key]["str(bx)"] += 1
        if "di" in reg and reg["di"][0] == "imm":
            chan[key]["const(di)"] += 1
        chan[key]["n"] += 1
    for k, c in sorted(chan.items(), key=lambda x: -x[1]["n"])[:40]:
        print("  %-14s n=%-4d %s" % (k, c["n"], {x: y for x, y in c.items() if x != "n"}))
