import struct, re, sys, os

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
FILES = ["3DTTT.EXE", "PAC-GAL.EXE", "HOPPER.EXE", "SPACEWAR.EXE"]

def mz(d):
    sig, lastpage, pages, relocs, hdrpar, minal, maxal, ss, sp, csum, ip, cs, reloc_off, ovl = struct.unpack_from("<2sHHHHHHHHHHHHH", d, 0)
    hdrsize = hdrpar * 16
    imgsize = (pages - 1) * 512 + (lastpage if lastpage else 512) - hdrsize
    return dict(sig=sig.decode('latin1'), hdrsize=hdrsize, imgsize=imgsize,
                relocs=relocs, cs=cs, ip=ip, ss=ss, sp=sp, ovl=ovl)

def printable_runs(d, minlen=5):
    return re.findall(rb"[\x20-\x7e]{%d,}" % minlen, d)

# GW-BASIC tokenized program: 0xFF then chain of lines
# line = <u16 next_addr><u16 lineno><tokens...>\x00 ; end when next_addr==0
def scan_tokenized(d):
    hits = []
    for start in range(len(d) - 8):
        if d[start] != 0xFF:
            continue
        off = start + 1
        lines = 0
        prev_ln = -1
        ok = True
        while off + 4 <= len(d):
            nxt, ln = struct.unpack_from("<HH", d, off)
            if nxt == 0:
                break
            if ln <= prev_ln or ln > 65529:
                ok = False
                break
            end = d.find(b"\x00", off + 4)
            if end < 0:
                ok = False
                break
            lines += 1
            prev_ln = ln
            off = end + 1
            if lines > 4:
                break
        if ok and lines >= 4:
            hits.append((start, lines))
    return hits

SIGS = {
    "BASRUN runtime link":  [b"BASRUN"],
    "BASCOM/IBM banner":    [b"Licensed Material", b"Property of IBM", b"Microsoft", b"BASIC Compiler"],
    "BASIC error table":    [b"Syntax error", b"RETURN without GOSUB", b"Out of DATA", b"Subscript out of range", b"Division by zero"],
    "QuickBASIC":           [b"QB", b"BRUN", b"BCOM"],
    "Turbo/other":          [b"Turbo", b"Borland", b"Pascal"],
    "MS-C / assembler":     [b"MS Run-Time", b"floating point"],
}

for f in FILES:
    p = os.path.join(RUN, f)
    d = open(p, "rb").read()
    h = mz(d)
    print("=" * 70)
    print(f"{f}  ({len(d)} bytes)")
    print("  MZ:", h)
    print("  overlay/appended data after image:", len(d) - (h['hdrsize'] + h['imgsize']), "bytes")
    for name, pats in SIGS.items():
        found = [pt.decode('latin1') for pt in pats if pt in d]
        if found:
            print(f"  [{name}] -> {found}")
    tk = scan_tokenized(d)
    print("  tokenized-BASIC candidates:", tk[:5] if tk else "NONE")
    # longest strings, first 25
    runs = sorted(set(printable_runs(d, 8)), key=lambda s: -len(s))[:18]
    print("  notable strings:")
    for r in runs:
        print("     ", r.decode('latin1')[:100])
