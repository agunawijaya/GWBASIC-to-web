import os, struct, sys, json, re, collections
from capstone import *

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET = sys.argv[1] if len(sys.argv)>1 else "HOPPER.EXE"
d = open(os.path.join(RUN,TARGET),"rb").read()
hdr = struct.unpack_from("<H",d,8)[0]*16
cs  = struct.unpack_from("<H",d,0x16)[0]
ip  = struct.unpack_from("<H",d,0x14)[0]
img = d[hdr:]
DGROUP_SEG = 0x0739
DG = DGROUP_SEG*16          # 29584

# ---- string table in DGROUP -------------------------------------------
def dg_strings():
    tbl={}
    i=DG
    while i < len(img):
        if 0x20<=img[i]<=0x7e:
            j=i
            while j<len(img) and 0x20<=img[j]<=0x7e: j+=1
            if j-i>=4:
                tbl[i-DG]=img[i:j].decode("latin1")
            i=j
        else: i+=1
    return tbl
STR = dg_strings()

# ---- user code extent: last validated far call -------------------------
calls = json.load(open(TARGET.replace(".","_")+"_calls.json"))
sites = sorted(s[0] for s in calls["farcalls"])
# user code = contiguous dense region from entry
END = 8192
for a,b in zip(sites, sites[1:]):
    if b-a > 900 and a > 1000:
        END = a+16; break

md = Cs(CS_ARCH_X86, CS_MODE_16); md.detail=True
START = cs*16+ip

# name entry points by rank
tally = collections.Counter(int(k) for k in [] )
tal = {int(k):v for k,v in calls["tally"].items()}
rank = {t:i+1 for i,(t,c) in enumerate(sorted(tal.items(), key=lambda kv:-kv[1]))}

def strnote(v):
    """v = DGROUP offset; return the literal if it points at/into one."""
    if v in STR: return STR[v]
    for off,s in STR.items():
        if off < v < off+len(s):
            return "..."+s[v-off:]
    return None

out=[]
pending=[]     # recent immediates, for call annotation
lastimm={}
pc=START
nins=0
while pc < END and pc < len(img):
    try: ins = next(md.disasm(img[pc:pc+16], pc, 1))
    except StopIteration:
        pc+=1; continue
    nins+=1
    m,op = ins.mnemonic, ins.op_str
    note=""
    if m=="lcall":
        mm=re.match(r"0x([0-9a-f]+), 0x([0-9a-f]+)", op)
        if mm:
            seg=int(mm.group(1),16); off=int(mm.group(2),16)
            t=seg*16+off
            note="  ; RT#%s  [%04X:%04X]" % (rank.get(t,"?"), seg, off)
            # attach recent string-bearing immediates
            hits=[]
            for reg,v in list(lastimm.items()):
                s=strnote(v)
                if s: hits.append("%s=%r"%(reg,s[:56]))
            if hits: note += "   <- " + ", ".join(hits)
            lastimm.clear()
    else:
        mm=re.match(r"(\w+), 0x([0-9a-f]+)$", op)
        if mm:
            reg=mm.group(1); v=int(mm.group(2),16)
            if m in ("mov","lea") and reg in ("ax","bx","cx","dx","si","di","bp"):
                lastimm[reg]=v
                s=strnote(v)
                if s: note="  ; DG+%04X = %r" % (v, s[:64])
    out.append("%6d  %-14s %-7s %-24s%s" % (ins.address, ins.bytes.hex(), m, op, note))
    pc = ins.address + ins.size

dest = TARGET.replace(".","_")+"_user.asm"
open(dest,"w",encoding="utf-8").write("\n".join(out))
print("== %s ==" % TARGET)
print("user code %d..%d  -> %d instructions" % (START,END,nins))
print("DGROUP strings indexed: %d" % len(STR))
print("-> %s" % dest)
print()
nstr=sum(1 for l in out if "<-" in l)
print("far calls with a resolved string argument: %d" % nstr)
print("\n--- sample: every call site that carries a game string ---")
for l in out:
    if "<-" in l and not re.search(r"'(Syntax|RETURN|Illegal|Subscript|Division|Out of|String|RESUME|Redo|Internal)", l):
        print(l[:190])
