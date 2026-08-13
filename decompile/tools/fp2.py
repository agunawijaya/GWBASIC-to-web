import os, struct, sys, json, re, collections
from capstone import *

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET = sys.argv[1] if len(sys.argv)>1 else "HOPPER.EXE"
d = open(os.path.join(RUN,TARGET),"rb").read()
hdr = struct.unpack_from("<H",d,8)[0]*16
img = d[hdr:]
md = Cs(CS_ARCH_X86, CS_MODE_16); md.detail=True

calls = json.load(open(TARGET.replace(".","_")+"_calls.json"))
tal   = {int(k):v for k,v in calls["tally"].items()}
sites = calls["farcalls"]           # (site, target, seg, off)

# ---- tight body scan: linear only, stop at first RETF -------------------
def body(t, maxins=90):
    ins_list=[]; pc=t
    for _ in range(maxins):
        try: ins=next(md.disasm(img[pc:pc+16],pc,1))
        except StopIteration: break
        ins_list.append(ins)
        if ins.mnemonic in ("retf","ret","iret","jmp"): break
        pc=ins.address+ins.size
    return ins_list

def facts(t):
    b=body(t)
    ints=set(); ports=set(); segs=set(); nearcalls=set(); farc=set()
    for ins in b:
        m,op=ins.mnemonic,ins.op_str
        if m=="int":
            mm=re.match(r"0x([0-9a-f]+)",op)
            if mm: ints.add(int(mm.group(1),16))
        if m in ("in","out"):
            for tok in re.findall(r"0x[0-9a-f]+",op):
                ports.add(int(tok,16))
        if m=="call":
            mm=re.match(r"0x([0-9a-f]+)$",op)
            if mm: nearcalls.add(int(mm.group(1),16))
        if m=="lcall":
            mm=re.match(r"0x([0-9a-f]+), 0x([0-9a-f]+)",op)
            if mm: farc.add(int(mm.group(1),16)*16+int(mm.group(2),16))
        for tok in re.findall(r"0x[0-9a-f]+",op):
            v=int(tok,16)
            if v in (0xb800,0xb000,0xa000): segs.add(v)
    return dict(nins=len(b), ints=sorted(ints), ports=sorted(ports),
                segs=sorted(segs), nearcalls=sorted(nearcalls)[:4], far=sorted(farc)[:4],
                head=" | ".join("%s %s"%(i.mnemonic,i.op_str) for i in b[:6]))

# ---- caller-side arg profile ------------------------------------------
# what registers are loaded immediately before each call to target t
def argprofile(t, nmax=40):
    prof=collections.Counter()
    for (site,tt,_,_) in sites:
        if tt!=t: continue
        # walk back up to 6 instructions
        start=max(0,site-24)
        seq=[]
        pc=start
        while pc<site:
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: pc+=1; continue
            if ins.address+ins.size<=site: seq.append(ins)
            pc=ins.address+ins.size
        regs=[]
        for ins in seq[-4:]:
            mm=re.match(r"^(ax|bx|cx|dx|si|di|bp|es),",ins.op_str)
            if mm and ins.mnemonic in ("mov","lea","xor","les","lds"):
                regs.append(mm.group(1))
        prof["+".join(regs) or "-"]+=1
        if sum(prof.values())>=nmax: break
    return prof.most_common(3)

print("== %s : tight fingerprints (top entry points) ==\n" % TARGET)
tot=sum(tal.values()); cum=0
rows=[]
for i,(t,c) in enumerate(sorted(tal.items(), key=lambda kv:-kv[1])[:26]):
    f=facts(t); cum+=c
    ap=argprofile(t)
    tags=[]
    if 0x10 in f["ints"]: tags.append("INT10")
    if 0x16 in f["ints"]: tags.append("INT16")
    if 0x21 in f["ints"]: tags.append("INT21")
    if set(f["ports"]) & {0x42,0x43,0x61}: tags.append("SPKR")
    if set(f["ports"]) & {0x201}: tags.append("JOY")
    if f["segs"]: tags.append("VRAM")
    print("RT#%-3d target=%-6d calls=%-4d (cum %4.1f%%)  body=%2d ins %s"
          % (i+1,t,c,100*cum/tot,f["nins"], " ".join(tags)))
    print("     head: %s" % f["head"][:120])
    print("     caller args: %s" % ", ".join("%s x%d"%(k,v) for k,v in ap))
    rows.append((i+1,t,c,f,ap))
json.dump([(r[0],r[1],r[2],r[3]) for r in rows], open(TARGET.replace(".","_")+"_fp2.json","w"), indent=1)
