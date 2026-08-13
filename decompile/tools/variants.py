"""Temukan entry point yang merupakan VARIAN dari rutin yang sudah bernama.

Runtime BASCOM memakai banyak entry point ke satu tubuh: tiap entry menyiapkan
operan berbeda lalu `jmp` ke kode bersama. Kalau sebuah entry tak bernama
akhirnya mendarat di tubuh rutin yang SUDAH bernama, ia varian pernyataan yang
sama -- dengan bukti P (berbagi tubuh) plus S (setup operannya sendiri).

Terbukti di iterasi lanjutan: STRFN ternyata jmp ke tubuh pengisi STRING$,
dan SUB! jmp ke tubuh ADD!.
"""
import os,struct,re,collections,json
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":26400,"PAC-GAL.EXE":12288,"HOPPER.EXE":7863}
src=open(os.path.join(ROOT,"tools","emit2.py"),encoding="utf-8").read()

def named_map(T):
    m=re.search(re.escape('"%s":dict('%T)+r'.*?named=\{(.*?)\}\)',src,re.S)
    return {int(a):b for a,b in re.findall(r'(\d+):"([^"]+)"',m.group(1))}

for T,E in CFG.items():
    named=named_map(T)
    ms=re.search(re.escape('"%s":dict('%T)+r'.*?stub=\((\d+),(\d+)\)',src,re.S)
    stubs=set(range(int(ms.group(1)),int(ms.group(2)),5))
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    img=d[hdr:]
    tal=collections.Counter()
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E:
            tal[struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]]+=1
    # peta: byte mana milik tubuh rutin bernama (telusuri linier dari tiap nama)
    owner={}
    for off,nm in named.items():
        pc=off; n=0
        while n<80:
            if pc<0 or pc>=len(img) or pc in owner: break
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            for k2 in range(ins.size): owner[ins.address+k2]=nm
            n+=1
            if ins.mnemonic in ("ret","retf","iret"): break
            if ins.mnemonic=="jmp": break
            pc=ins.address+ins.size
    print("== %s =="%T)
    found=0
    for tgt,c in tal.most_common():
        if tgt in named or tgt in stubs: continue
        # ikuti jmp tak-bersyarat sampai 6 lompatan
        pc=tgt; hops=0
        while hops<6:
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="jmp":
                t2=re.match(r"0x([0-9a-f]+)$",ins.op_str)
                if not t2: break
                pc=int(t2.group(1),16); hops+=1
                if pc in owner:
                    print("   @%-6d %3d panggilan -> mendarat di tubuh %s (setelah %d jmp)"
                          %(tgt,c,owner[pc],hops)); found+=1
                    break
                continue
            if ins.mnemonic in ("ret","retf","iret"): break
            pc=ins.address+ins.size
            if pc in owner:
                print("   @%-6d %3d panggilan -> jatuh ke tubuh %s"%(tgt,c,owner[pc])); found+=1
                break
    if not found: print("   (tidak ada varian ditemukan)")
    print()
