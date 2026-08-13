"""Disassembler kode pengguna dengan far-call diberi nama.

Dipakai sebagai mata untuk membangun recover.py -- emit2.py cuma mengintip 3 byte
sebelum tiap panggilan; di sini kita lihat seluruh aliran instruksi.

  python dis.py PAC-GAL 0 400        # bongkar offset 0..400
"""
import os, sys, struct, re
from capstone import Cs, CS_ARCH_X86, CS_MODE_16

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util
_spec = importlib.util.spec_from_file_location(
    "emit2cfg", os.path.join(os.path.dirname(os.path.abspath(__file__)), "emit2.py"))


def load_cfg():
    """Ambil CFG dari emit2.py tanpa menjalankan bagian penerbitannya."""
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "emit2.py"),
               encoding="utf-8").read()
    ns = {}
    m = re.search(r"^CFG=\{.*?^\}", src, re.S | re.M)
    exec(m.group(0), ns)
    return ns["CFG"]


CFG = load_cfg()


def load(stem):
    T = stem + ".EXE"
    C = CFG[T]
    d = open(os.path.join(RUN, T), "rb").read()
    hdr = struct.unpack_from("<H", d, 8)[0] * 16
    nrel = struct.unpack_from("<H", d, 6)[0]
    rof = struct.unpack_from("<H", d, 0x18)[0]
    img = d[hdr:]
    # situs far call: relokasi menunjuk word segmen; 0x9A ada 3 byte sebelumnya
    sites = {}
    for k in range(nrel):
        o, s = struct.unpack_from("<HH", d, rof + 4 * k)
        r = s * 16 + o
        if r - 3 >= 0 and img[r - 3] == 0x9A:
            tgt = (struct.unpack_from("<H", img, r)[0] * 16
                   + struct.unpack_from("<H", img, r - 2)[0])
            sites[r - 3] = tgt
    return img, C, sites


def stubtab(img, C):
    a, b = C["stub"]
    st = {}
    for t in range(a, b, 5):
        if img[t] == 0xE8:
            st[t] = (img[t + 3], img[t + 4])
    return st


TY = {2: "%", 3: "$", 4: "!", 8: "#"}
SEP = {0: ",", 1: ";", 2: "nl"}


def name_of(tgt, C, st):
    if tgt in st:
        al, ah = st[tgt]
        return "PRINT<%s%s>" % (TY.get(al, "?"), SEP.get(ah, "?"))
    return C["named"].get(tgt)


def disasm(stem, lo, hi):
    img, C, sites = load(stem)
    st = stubtab(img, C)
    md = Cs(CS_ARCH_X86, CS_MODE_16)
    md.detail = False
    pc = lo
    out = []
    while pc < hi:
        if pc in sites:
            tgt = sites[pc]
            nm = name_of(tgt, C, st) or ("@%d" % tgt)
            out.append("%6d  %-22s %s" % (pc, "9a %d" % tgt, "lcall " + nm))
            pc += 5
            continue
        try:
            ins = next(md.disasm(img[pc:pc + 16], pc, 1))
        except StopIteration:
            out.append("%6d  %-22s db 0x%02x" % (pc, "%02x" % img[pc], img[pc]))
            pc += 1
            continue
        raw = img[ins.address:ins.address + ins.size].hex()
        out.append("%6d  %-22s %s %s" % (ins.address, raw, ins.mnemonic, ins.op_str))
        pc = ins.address + ins.size
    return out


if __name__ == "__main__":
    stem = sys.argv[1] if len(sys.argv) > 1 else "PAC-GAL"
    lo = int(sys.argv[2]) if len(sys.argv) > 2 else 26
    hi = int(sys.argv[3]) if len(sys.argv) > 3 else 400
    print("\n".join(disasm(stem, lo, hi)))
