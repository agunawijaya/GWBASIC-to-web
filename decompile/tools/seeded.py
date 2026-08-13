"""Walk statis yang disemai jejak dinamis, diiterasi sampai konvergen.

Pelajaran dari C:\\Projects\\DOS-Decompiler knowledge/11-unreached-code.md:
  - batas iterasi bukan hasil; iterasi sampai berhenti tumbuh
  - jelaskan sisa region, jangan laporkan persentase telanjang
"""
import os,struct,re,sys,json,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":(26400,32958,"trace/3dttt-union.map"),
     "PAC-GAL.EXE":(12288,16453,"trace/pacgal-union.map"),
     "HOPPER.EXE":(7863,18372,"trace/hopper-union.map")}

def build(T):
    E,GOSUB,tracefile=CFG[T]
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    cs0=struct.unpack_from("<H",d,0x16)[0]; ip0=struct.unpack_from("<H",d,0x14)[0]
    img=d[hdr:]
    sites=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E: sites.append(r-3)
    sites.sort(); stop=set(sites)
    gt=[]
    for s in sites:
        # target GOSUB = word inline sesudah panggilan
        pass
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A:
            tgt=struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]
            if tgt==GOSUB and r-3+7<=len(img):
                w=struct.unpack_from("<H",img,r-3+5)[0]
                if 0<w<E: gt.append(w)
    dyn=set()
    p=os.path.join(ROOT,tracefile)
    if os.path.exists(p):
        dyn={int(l,16) for l in open(p) if l.strip()}
        dyn={x for x in dyn if 26<=x<E}
    seeds=set([cs0*16+ip0])|set(gt)|set(x+5 for x in sites)|dyn
    seeds={a+1 if a<len(img) and img[a]==0xCC else a for a in seeds}

    covered=set(); br=[]
    def walk(start):
        pc=start
        while pc<E:
            if pc in covered: break
            if pc in stop:
                for k in range(5): covered.add(pc+k)     # situs far call itu SENDIRI kode
                pc+=5
                if pc<len(img) and img[pc]==0xCC: covered.add(pc); pc+=1
                continue
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            for k in range(ins.size): covered.add(ins.address+k)
            m,op=ins.mnemonic,ins.op_str
            t=re.match(r"0x([0-9a-f]+)$",op)
            if m in ("ret","retf","iret"): break
            if m=="jmp":
                if t: br.append((pc,int(t.group(1),16),False)); q.append(int(t.group(1),16))
                break
            if (m.startswith("j") or m=="loop") and t:
                v=int(t.group(1),16); br.append((pc,v,True)); q.append(v)
            pc=ins.address+ins.size

    q=list(seeds); rounds=0; tried=set()
    while True:
        rounds+=1; before=len(covered)
        while q: walk(q.pop())
        # jangkar sesudah situs panggilan, tiap alamat dicoba SEKALI saja
        for s in sites:
            a=s+5
            if a<E and a not in covered and a not in tried:
                tried.add(a); q.append(a)
        if not q and len(covered)==before: break
        if rounds>500:
            print("  [BERHENTI pada batas 500 ronde -- ini BATAS, bukan temuan]"); break
    loops=[b for b in br if b[1]<=b[0] and b[2]]
    gotos=[b for b in br if b[1]<=b[0] and not b[2]]
    fwd=[b for b in br if b[1]>b[0]]
    # jelaskan sisanya
    rest=[x for x in range(26,E) if x not in covered]
    zero=sum(1 for x in rest if img[x]==0)
    text=sum(1 for x in rest if 0x20<=img[x]<=0x7e)
    return dict(E=E,cov=len(covered),rounds=rounds,br=len(br),loops=len(loops),
                gotos=len(gotos),fwd=len(fwd),dyn=len(dyn),gosub=len(set(gt)),
                rest=len(rest),rest_zero=zero,rest_text=text)

out={}
for T in CFG:
    if not os.path.exists(os.path.join(ROOT,CFG[T][2])):
        print("%-13s (belum ada jejak, dilewati)"%T); continue
    r=build(T); out[T]=r
    print("== %s =="%T)
    print("  benih   : entry + %d target GOSUB + %d jangkar panggilan + %d alamat dinamis"
          %(r["gosub"],0,r["dyn"]))
    print("  ronde   : %d"%r["rounds"])
    print("  jangkauan: %d dari %d byte (%.0f%%)"%(r["cov"],r["E"],100*r["cov"]/r["E"]))
    print("  cabang  : %d (loop %d, GOTO %d, IF %d)"%(r["br"],r["loops"],r["gotos"],r["fwd"]))
    print("  sisa    : %d byte, dari itu %d nol dan %d printable"
          %(r["rest"],r["rest_zero"],r["rest_text"]))
    print()
json.dump(out,open(os.path.join(ROOT,"coverage-seeded.json"),"w"),indent=1)
