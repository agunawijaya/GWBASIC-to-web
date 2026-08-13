"""Profil pola argumen tiap entry point yang belum bernama.

Cara ini yang berhasil menamai STRING$ (bx=cacah, dx=kode karakter) dan
CONCAT$ (bx dan ax) di iterasi #14: bukan dari tubuh rutin, melainkan dari
BENTUK argumen yang konsisten di seluruh situs panggilannya.
"""
import os,struct,re,collections,json,sys
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":(26400,18564),"PAC-GAL.EXE":(12288,28084),"HOPPER.EXE":(7863,26916)}
import importlib.util
spec=importlib.util.spec_from_file_location("e2",os.path.join(ROOT,"tools","emit2.py"))

NAMED=json.load(open(os.path.join(ROOT,"tools","named.json"))) if os.path.exists(os.path.join(ROOT,"tools","named.json")) else {}

def named_for(T):
    # ambil dict 'named' dari emit2.py tanpa menjalankannya
    src=open(os.path.join(ROOT,"tools","emit2.py"),encoding="utf-8").read()
    m=re.search(re.escape('"%s":dict('%T)+r'.*?named=\{(.*?)\}\)',src,re.S)
    if not m: return set()
    return set(int(x) for x in re.findall(r"(\d+):",m.group(1)))

for T,(E,BASE) in CFG.items():
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    img=d[hdr:]
    sites=collections.defaultdict(list)
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E:
            sites[struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]].append(r-3)
    known=named_for(T)
    stubs=set()
    m=re.search(re.escape('"%s":dict('%T)+r'.*?stub=\((\d+),(\d+)\)',src if False else open(os.path.join(ROOT,"tools","emit2.py"),encoding="utf-8").read(),re.S)
    if m:
        a,b=int(m.group(1)),int(m.group(2))
        stubs=set(range(a,b,5))
    print("== %s =="%T)
    OP={0xBB:"bx",0xBA:"dx",0xB8:"ax",0xB9:"cx",0xBE:"si",0xBF:"di"}
    rows=[]
    for tgt,ss in sorted(sites.items(), key=lambda kv:-len(kv[1])):
        if tgt in known or tgt in stubs: continue
        prof=collections.Counter(); vals=collections.defaultdict(collections.Counter)
        for s in ss:
            regs=[]
            p=s-3
            for _ in range(3):
                if p>=0 and img[p] in OP:
                    r=OP[img[p]]; v=struct.unpack_from("<H",img,p+1)[0]
                    regs.append(r); vals[r][v]+=1; p-=3
                else: break
            prof["+".join(reversed(regs)) or "-"]+=1
        top,tc=prof.most_common(1)[0]
        if len(ss)<4: continue
        det=[]
        for r in ("bx","dx","ax","cx","si","di"):
            if vals[r]:
                vv=vals[r].most_common(3)
                det.append("%s={%s}"%(r,",".join("0x%X"%x for x,_ in vv)))
        print("  @%-6d %3d situs | pola %-12s (%d/%d) | %s"%(tgt,len(ss),top,tc,len(ss)," ".join(det)[:70]))
        rows.append((tgt,len(ss),top))
    print()
