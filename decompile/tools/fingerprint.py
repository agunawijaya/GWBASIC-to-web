import os, struct, sys, json, collections
from capstone import *

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET = sys.argv[1] if len(sys.argv) > 1 else "HOPPER.EXE"
d = open(os.path.join(RUN, TARGET), "rb").read()
hdr = struct.unpack_from("<H", d, 8)[0]*16
img = d[hdr:]

md = Cs(CS_ARCH_X86, CS_MODE_16)
md.detail = True

calls = json.load(open(TARGET.replace(".","_")+"_calls.json"))
tally = {int(k):v for k,v in calls["tally"].items()}

def trace(start, budget=1400):
    """Follow a runtime routine: linear decode with near-jump following,
    stop at RET/RETF/IRET on the main path. Return fingerprint facts."""
    seen=set(); todo=[start]
    ints=set(); ports=set(); segs=set(); calls_out=set()
    ninstr=0
    while todo and ninstr < budget:
        pc = todo.pop()
        if pc in seen or pc < 0 or pc >= len(img): continue
        while pc < len(img) and ninstr < budget:
            if pc in seen: break
            seen.add(pc)
            code = img[pc:pc+16]
            try: ins = next(md.disasm(code, pc, 1))
            except StopIteration: break
            ninstr += 1
            m = ins.mnemonic; op = ins.op_str
            if m == "int":
                try: ints.add(int(op,16) if op.startswith("0x") else int(op))
                except: pass
            elif m in ("in","out"):
                for tok in op.replace(","," ").split():
                    if tok.startswith("0x"):
                        try: ports.add(int(tok,16))
                        except: pass
            elif m in ("mov","push") and "0x" in op:
                for tok in op.replace(","," ").split():
                    if tok.startswith("0x"):
                        try:
                            v=int(tok,16)
                            if v in (0xb800,0xb000,0xa000,0x40): segs.add(v)
                        except: pass
            if m in ("ret","retf","iret"): break
            if m == "jmp" and op.startswith("0x"):
                try: pc = int(op,16); continue
                except: break
            if m.startswith("j") and op.startswith("0x"):
                try: todo.append(int(op,16))
                except: pass
            if m == "call" and op.startswith("0x"):
                try:
                    t=int(op,16); calls_out.add(t); todo.append(t)
                except: pass
            pc = ins.address + ins.size
    return dict(ints=sorted(ints), ports=sorted(ports), segs=sorted(segs), n=ninstr)

GUESS = []
def guess(fp):
    i=set(fp["ints"]); p=set(fp["ports"]); s=set(fp["segs"])
    g=[]
    if 0x10 in i: g.append("VIDEO/BIOS-10h")
    if 0x16 in i: g.append("KEYBD/BIOS-16h")
    if 0x21 in i: g.append("DOS-21h")
    if 0x1a in i: g.append("TIMER-1Ah")
    if 0x33 in i: g.append("MOUSE")
    if p & {0x42,0x43,0x61}: g.append("SPEAKER(SOUND/PLAY)")
    if p & {0x3d8,0x3d9,0x3b8,0x3ba,0x3da}: g.append("CGA-REGS")
    if p & {0x201}: g.append("JOYSTICK(STICK/STRIG)")
    if s & {0xb800,0xb000}: g.append("VRAM-direct")
    if 0x40 in s: g.append("BIOS-DATA-AREA")
    return g

print("== %s : runtime entry point fingerprints ==" % TARGET)
print("%-8s %6s  %-26s %s" % ("target","calls","fingerprint","detail"))
res={}
for t,c in sorted(tally.items(), key=lambda kv:-kv[1]):
    fp = trace(t)
    g  = guess(fp)
    res[t]={"calls":c,"fp":fp,"guess":g}
    det=[]
    if fp["ints"]: det.append("int="+",".join("%02Xh"%x for x in fp["ints"]))
    if fp["ports"]: det.append("port="+",".join("%Xh"%x for x in fp["ports"][:6]))
    if fp["segs"]: det.append("seg="+",".join("%Xh"%x for x in fp["segs"]))
    print("%-8d %6d  %-26s %s" % (t,c,",".join(g) if g else "-", " ".join(det)))

json.dump(res, open(TARGET.replace(".","_")+"_fp.json","w"), indent=1)
