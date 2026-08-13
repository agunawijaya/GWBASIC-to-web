import os, struct, sys, json, re, collections
from capstone import *

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
d = open(os.path.join(RUN,"HOPPER.EXE"),"rb").read()
hdr = struct.unpack_from("<H",d,8)[0]*16
img = d[hdr:]
md  = Cs(CS_ARCH_X86, CS_MODE_16); md.detail=True

calls = json.load(open("HOPPER_EXE_calls.json"))
tal   = {int(k):v for k,v in calls["tally"].items()}
ENTRIES = [t for t,_ in sorted(tal.items(), key=lambda kv:-kv[1])]

RTBASE = 0x247*16     # runtime segment base

# ---------- decode one basic block, return (instrs, successors) ----------
BLK={}
def block(pc):
    if pc in BLK: return BLK[pc]
    out=[]; succ=[]; cur=pc
    for _ in range(400):
        if cur<0 or cur>=len(img): break
        try: ins=next(md.disasm(img[cur:cur+16],cur,1))
        except StopIteration: break
        out.append(ins)
        m,op=ins.mnemonic,ins.op_str
        nxt=ins.address+ins.size
        if m in ("retf","ret","iret"): break
        if m=="jmp":
            mm=re.match(r"0x([0-9a-f]+)$",op)
            if mm: succ.append(int(mm.group(1),16))
            break
        if m.startswith("j") or m=="loop":
            mm=re.match(r"0x([0-9a-f]+)$",op)
            if mm: succ.append(int(mm.group(1),16))
            succ.append(nxt); break
        if m=="call":
            mm=re.match(r"0x([0-9a-f]+)$",op)
            if mm: succ.append(int(mm.group(1),16))
        cur=nxt
    BLK[pc]=(out,succ)
    return BLK[pc]

def reach(start, budget=600):
    seen=set(); q=[start]; ins_all=[]
    while q and len(seen)<budget:
        p=q.pop()
        if p in seen: continue
        seen.add(p)
        b,s=block(p)
        ins_all.extend(b)
        q.extend(s)
    return seen, ins_all

# ---------- pass 1: find hub blocks ----------
print("pass 1: computing reachability for %d entry points..." % len(ENTRIES))
reach_sets={}
for t in ENTRIES:
    reach_sets[t]=reach(t)[0]
freq=collections.Counter()
for t,s in reach_sets.items():
    for p in s: freq[p]+=1
N=len(ENTRIES)
HUB={p for p,c in freq.items() if c > N*0.45}
print("hub blocks excluded: %d (reachable from >45%% of entries)" % len(HUB))

# ---------- pass 2: fingerprint with hubs excluded ----------
def fp(start, budget=400):
    seen=set(); q=[start]
    ints=collections.Counter(); ports=set(); segs=set(); nins=0
    ahvals=collections.Counter()
    lastah=None
    while q and nins<budget:
        p=q.pop()
        if p in seen or (p in HUB and p!=start): continue
        seen.add(p)
        b,s=block(p)
        for ins in b:
            nins+=1
            m,op=ins.mnemonic,ins.op_str
            mm=re.match(r"^(ah|ax),\s*0x([0-9a-f]+)$",op)
            if m=="mov" and mm:
                v=int(mm.group(2),16)
                lastah = v if mm.group(1)=="ah" else (v>>8)
            if m=="int":
                iv=re.match(r"0x([0-9a-f]+)",op)
                if iv:
                    num=int(iv.group(1),16); ints[num]+=1
                    if num in (0x10,0x21,0x16) and lastah is not None:
                        ahvals[(num,lastah)]+=1
            if m in ("in","out"):
                for tok in re.findall(r"0x[0-9a-f]+",op): ports.add(int(tok,16))
            for tok in re.findall(r"0x[0-9a-f]+",op):
                v=int(tok,16)
                if v in (0xb800,0xb000,0xa000): segs.add(v)
        q.extend(s)
    return ints, ports, segs, nins, ahvals

AH10={0x00:"set video mode (SCREEN)",0x01:"cursor shape",0x02:"set cursor pos (LOCATE)",
      0x03:"get cursor pos (CSRLIN/POS)",0x05:"select page",0x06:"scroll up (CLS/scroll)",
      0x07:"scroll down",0x08:"read char/attr (SCREEN fn)",0x09:"write char+attr (PRINT)",
      0x0a:"write char (PRINT)",0x0b:"set palette (COLOR)",0x0c:"write pixel (PSET/PRESET)",
      0x0d:"read pixel (POINT)",0x0e:"teletype out (PRINT)",0x0f:"get video mode"}
AH21={0x3c:"create file",0x3d:"OPEN",0x3e:"CLOSE",0x3f:"read (GET/INPUT#)",
      0x40:"write (PUT/PRINT#)",0x42:"seek",0x41:"delete",0x4c:"exit (SYSTEM/END)",
      0x09:"print string",0x2c:"get time (TIME$)",0x2a:"get date (DATE$)"}
AH16={0x00:"wait key (INPUT$)",0x01:"peek key (INKEY$)",0x02:"shift flags"}

print("\n== HOPPER.EXE : identifikasi entry point (fingerprint perilaku) ==\n")
rows=[]
tot=sum(tal.values()); cum=0
for i,t in enumerate(ENTRIES[:46]):
    c=tal[t]; cum+=c
    ints,ports,segs,nins,ahv = fp(t)
    tags=[]
    for (num,ah),k in ahv.most_common(4):
        tbl = AH10 if num==0x10 else AH21 if num==0x21 else AH16 if num==0x16 else {}
        if ah in tbl: tags.append("INT%02X/%02X %s"%(num,ah,tbl[ah]))
    if not tags:
        for num,k in ints.most_common(3):
            tags.append("INT%02X"%num)
    if ports & {0x42,0x43,0x61}: tags.append("SPEAKER -> SOUND/PLAY/BEEP")
    if ports & {0x201}:          tags.append("PORT201 -> STICK/STRIG")
    if ports & {0x3d8,0x3d9,0x3da,0x3b8}: tags.append("CGA regs -> SCREEN/COLOR")
    if segs:                     tags.append("VRAM direct")
    rows.append((i+1,t,c,cum,tags,nins))
    print("RT#%-3d %-6d calls=%-4d cum=%4.1f%%  %s" % (i+1,t,c,100*cum/tot,
          "; ".join(tags) if tags else "(murni komputasi / tanpa I/O)"))
json.dump([(r[0],r[1],r[2],r[4]) for r in rows], open("HOPPER_EXE_fp3.json","w"), indent=1)
