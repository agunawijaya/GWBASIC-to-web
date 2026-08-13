"""Cocokkan target tanpa nama dengan rutin bernama lewat SLOT DATA yang mereka tulis.

Dua rutin berbeda yang menulis slot data yang sama biasanya dua bentuk dari statement
yang sama -- runtime BASCOM memberi tiap bentuk sintaksis rutinnya sendiri, tetapi
semuanya bermuara ke keadaan yang sama. Inilah yang memberi OPEN_MODE$: ia menulis
[0x6A4], slot yang sudah diketahui ditulis OPEN_MODE dari indeks numerik.

Keluarannya KANDIDAT, bukan nama (sec. 12).
"""
import os,struct,re,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":26400,"PAC-GAL.EXE":12288,"HOPPER.EXE":7863}

def slots_ditulis(img,start,batas=40):
    """Slot absolut yang ditulis rutin ini (operand tujuan berbentuk [0xNNNN])."""
    out=set(); pc=start; n=0; seen=set()
    while n<batas:
        if pc in seen or pc<0 or pc>=len(img): break
        seen.add(pc)
        try: ins=next(md.disasm(img[pc:pc+16],pc,1))
        except StopIteration: break
        if ins.mnemonic=="(bad)": break
        if ins.mnemonic in("mov","and","or","xor","add","sub","inc","dec"):
            m2=re.match(r"(?:byte|word) ptr \[0x([0-9a-f]+)\],",ins.op_str)
            if m2: out.add(int(m2.group(1),16))
        n+=1
        if ins.mnemonic in("ret","retf","iret"): break
        if ins.mnemonic=="jmp":
            m2=re.match(r"0x([0-9a-f]+)$",ins.op_str)
            if m2: pc=int(m2.group(1),16); continue
            break
        pc=ins.address+ins.size
    return out

src=open("tools/emit2.py",encoding="utf-8").read()
for T,E in CFG.items():
    m=re.search(re.escape('"%s":dict('%T)+r'.*?named=\{(.*?)\}\)',src,re.S)
    named={int(a):b for a,b in re.findall(r'(\d+):"([^"]+)"',m.group(1))}
    d=open(os.path.join(RUN,T),"rb").read()
    img=d[struct.unpack_from("<H",d,8)[0]*16:]
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    t=collections.Counter()
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E:
            t[struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]]+=1
    # slot -> nama yang menulisnya (abaikan slot penanda sp yang universal)
    umum=collections.Counter()
    peta=collections.defaultdict(set)
    for off,nm in named.items():
        for s2 in slots_ditulis(img,off): peta[s2].add(nm); umum[s2]+=1
    print("== %s"%T); ada=0
    for tgt,c in sorted(t.items(),key=lambda kv:-kv[1]):
        if tgt in named: continue
        cocok=[]
        for s2 in slots_ditulis(img,tgt):
            if s2 in peta and umum[s2]<=3:
                cocok.append("0x%X -> %s"%(s2,"/".join(sorted(peta[s2]))))
        if cocok:
            print("   @%-6d %2d pgl | %s"%(tgt,c,"; ".join(cocok[:3]))); ada+=1
    if not ada: print("   (tidak ada slot bersama)")
