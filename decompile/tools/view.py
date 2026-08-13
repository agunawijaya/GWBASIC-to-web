"""Tampilkan kode pengguna: instruksi selaras + panggilan dengan operan TERBACA.

  python view.py PAC-GAL 26 400
  python view.py HOPPER --stmt 40      # 40 pernyataan pertama
"""
import sys, collections
import ir, operands


def annot(p, O, tgt, nm, raw, reg):
    """Keterangan operan untuk satu panggilan."""
    bits = []
    if raw:
        bits.append("db=" + ",".join(str(b) for b in raw))
    if nm and nm.endswith("_FAC"):
        d = reg.get("di")
        if d and d[0] == "imm":
            dbl = "#" in nm
            v = O.const(d[1], dbl)
            bits.append("konst=%s" % operands.fmtnum(v))
    b = reg.get("bx")
    if b:
        if b[0] == "imm":
            s = O.string(b[1])
            if s is not None and s != "":
                bits.append("str=%r" % s[:40])
            else:
                bits.append("bx=0x%04X" % b[1])
        else:
            bits.append("bx=[0x%04X]" % b[1])
    return "  ; " + " ".join(bits) if bits else ""


def main():
    stem = sys.argv[1] if len(sys.argv) > 1 else "PAC-GAL"
    lo = int(sys.argv[2]) if len(sys.argv) > 2 else 26
    hi = int(sys.argv[3]) if len(sys.argv) > 3 else 400
    p = ir.Prog(stem)
    O = operands.Ops(p)
    st = p.stream()
    reg = {}
    for a, kind, v in st:
        if a < lo:
            # tetap lacak register supaya konteks benar saat masuk jendela
            if kind == "insn":
                mm = operands.re_movimm(v.mnemonic, v.op_str)
                if mm:
                    reg[mm[0]] = ("imm", mm[1])
            continue
        if a >= hi:
            break
        if kind == "insn":
            mm = operands.re_movimm(v.mnemonic, v.op_str)
            if mm:
                reg[mm[0]] = ("imm", mm[1])
            else:
                mm = operands.re_movmem(v.mnemonic, v.op_str)
                if mm:
                    reg[mm[0]] = ("mem", mm[1])
                else:
                    d = operands.dest_reg(v.mnemonic, v.op_str)
                    if d:
                        reg.pop(d, None)
            print("%6d      %-8s %s" % (a, v.mnemonic, v.op_str))
        elif kind == "call":
            tgt, nm, raw = v
            label = nm or ("@%d" % tgt)
            print("%6d  CALL %-14s%s" % (a, label, annot(p, O, tgt, nm, raw, reg)))
            for r in ("di", "si", "dx", "ax", "cx"):
                reg.pop(r, None)
        else:
            print("%6d      db 0x%02x" % (a, v))


if __name__ == "__main__":
    main()
