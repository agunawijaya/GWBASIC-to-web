"""Pindai rutin tak bernama untuk instruksi yang LANGSUNG menentukan operasinya.

Beberapa instruksi x86 nyaris tak ambigu tentang apa yang dikerjakan rutin:
  repe cmpsb   perbandingan byte      -> STRCMP
  rep movsb/w  penyalinan blok        -> penyalinan string/memori
  rep stosb/w  pengisian blok         -> STRING$/SPACE$/pengosongan
  scasb        pencarian byte         -> INSTR
  div / idiv   pembagian              -> pembagian, MOD, konversi desimal
  mul / imul   perkalian              -> perkalian, indeks array
  int 10h/16h/21h  layanan BIOS/DOS

Ditemukan lewat teknik (f) di NEGATIVE-RESULTS: 'repe cmpsb' menyelesaikan STRCMP
yang sempat saya turunkan tanpa alasan sah.
"""
import os,struct,re,collections,json
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":26400,"PAC-GAL.EXE":12288,"HOPPER.EXE":7863}

DECISIVE={
 "cmpsb":"perbandingan byte -> STRCMP/INSTR",
 "cmpsw":"perbandingan word",
 "movsb":"penyalinan blok byte",
 "stosb":"pengisian blok byte -> STRING$/SPACE$",
 "stosw":"pengisian blok word",
 "scasb":"pencarian byte -> INSTR",
 "div":"pembagian -> MOD/konversi",
 "idiv":"pembagian bertanda",
 "mul":"perkalian",
 "imul":"perkalian bertanda",
 "aam":"konversi desimal",
 "aad":"konversi desimal",
 "int":"layanan BIOS/DOS",
}

src=open(os.path.join(ROOT,"tools","emit2.py"),encoding="utf-8").read()
out={}
for T,E in CFG.items():
    m=re.search(re.escape('"%s":dict('%T)+r'.*?named=\{(.*?)\}\)',src,re.S)
    known=set(int(x) for x in re.findall(r"(\d+):",m.group(1)))
    ms=re.search(re.escape('"%s":dict('%T)+r'.*?stub=\((\d+),(\d+)\)',src,re.S)
    known|=set(range(int(ms.group(1)),int(ms.group(2)),5))
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    img=d[hdr:]
    tal=collections.Counter()
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E:
            tal[struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]]+=1
    print("== %s =="%T)
    rows=[]
    for tgt,c in tal.most_common():
        if tgt in known: continue
        # telusuri linier + ikuti jmp tak-bersyarat, sampai 60 instruksi
        hits=collections.Counter(); pc=tgt; n=0; seen=set()
        while n<60:
            if pc in seen or pc<0 or pc>=len(img): break
            seen.add(pc)
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            for k2,v in DECISIVE.items():
                if k2 in ins.mnemonic or k2 in ins.op_str: hits[k2]+=1
            n+=1
            if ins.mnemonic in ("ret","retf","iret"): break
            if ins.mnemonic=="jmp":
                t2=re.match(r"0x([0-9a-f]+)$",ins.op_str)
                if t2: pc=int(t2.group(1),16); continue
                break
            pc=ins.address+ins.size
        if hits:
            det=", ".join("%s x%d"%(k2,v) for k2,v in hits.most_common(3))
            print("   @%-6d %3d panggilan | %s"%(tgt,c,det))
            rows.append(dict(routine=tgt,calls=c,hits=dict(hits)))
    if not rows: print("   (tidak ada instruksi penentu ditemukan)")
    out[T]=rows
    print()
json.dump(out,open(os.path.join(ROOT,"decisive.json"),"w"),indent=1)
