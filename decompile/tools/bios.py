"""Telusuri tiap target tanpa nama sampai menemukan layanan BIOS/DOS yang dipakainya.

Antarmuka BIOS dan DOS punya kontrak register yang baku dan terdokumentasi, jadi nomor
fungsi di AH menentukan operasi tanpa perlu menebak. Teknik ini sudah dua kali menentukan
hasil: memisahkan CSRLIN dari POS lewat int 10h ah=2, dan membatalkan dugaan SCREEN lewat
int 21h ah=13/16.

Penelusuran mengikuti call dan jmp dekat sampai kedalaman 4, mencatat nilai AH yang
terakhir disetel sebelum tiap `int`. Keluarannya KANDIDAT -- tiap baris tetap harus
dibaca manual (sec. 12).
"""
import os,struct,re,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":26400,"PAC-GAL.EXE":12288,"HOPPER.EXE":7863}
SVC={0x10:"video",0x16:"papan ketik",0x21:"DOS",0x33:"tetikus",0x1a:"jam"}

def telusuri(img,start,depth=0,seen=None,ah=None,out=None):
    if seen is None: seen=set()
    if out is None: out=collections.Counter()
    if depth>4: return out
    pc=start; n=0
    while n<70:
        if pc in seen or pc<0 or pc>=len(img): break
        seen.add(pc)
        try: ins=next(md.disasm(img[pc:pc+16],pc,1))
        except StopIteration: break
        if ins.mnemonic=="(bad)": break
        o=ins.op_str
        if ins.mnemonic=="mov" and o.startswith("ah, 0x"): ah=int(o.split("0x")[1],16)
        elif ins.mnemonic=="mov" and re.match(r"^ah, \d+$",o): ah=int(o.split(", ")[1])
        elif ins.mnemonic in("xor","mov") and o.startswith("ax"): ah=None
        if ins.mnemonic=="int":
            v=int(o,16) if o.startswith("0x") else int(o)
            if v in SVC: out[(v,ah)]+=1
        if ins.mnemonic=="call":
            m2=re.match(r"0x([0-9a-f]+)$",o)
            if m2: telusuri(img,int(m2.group(1),16),depth+1,seen,ah,out)
        n+=1
        if ins.mnemonic in("ret","retf","iret"): break
        if ins.mnemonic=="jmp":
            m2=re.match(r"0x([0-9a-f]+)$",o)
            if m2: pc=int(m2.group(1),16); continue
            break
        pc=ins.address+ins.size
    return out

src=open("tools/emit2.py",encoding="utf-8").read()
for T,E in CFG.items():
    m=re.search(re.escape('"%s":dict('%T)+r'.*?named=\{(.*?)\}\)',src,re.S)
    known=set(int(x) for x in re.findall(r"(\d+):",m.group(1)))
    ms=re.search(re.escape('"%s":dict('%T)+r'.*?stub=\((\d+),(\d+)\)',src,re.S)
    known|=set(range(int(ms.group(1)),int(ms.group(2)),5))
    d=open(os.path.join(RUN,T),"rb").read()
    img=d[struct.unpack_from("<H",d,8)[0]*16:]
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    t=collections.Counter()
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E:
            t[struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]]+=1
    print("== %s"%T); ada=0
    for tgt,c in sorted(t.items(),key=lambda kv:-kv[1]):
        if tgt in known: continue
        r=telusuri(img,tgt)
        if r:
            det=", ".join("int %02Xh%s"%(v,(" ah=0x%02X"%a) if a is not None else "")
                          for (v,a),_ in r.most_common(4))
            print("   @%-6d %2d pgl | %s"%(tgt,c,det)); ada+=1
    if not ada: print("   (tidak ada)")
