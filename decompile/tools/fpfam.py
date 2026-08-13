"""Klasifikasi rutin titik-mengambang berdasarkan DUA penanda mandiri.

Penanda presisi  : operan tunggal dibaca di [si]/[di+2]; ganda di [si+6]/[di+6],
                   dan geseran mantissa ganda memakai rantai empat word.
Penanda operasi  : MUL menjumlahkan eksponen (add ah,ch); DIV mengurangkan
                   (sub ah,ch) dan berisi div; SUB memakai xor al,0x80 lalu masuk
                   jalur ADD; kali/bagi diawali xor al,cl, tambah/kurang tidak.

Penelusuran BERHENTI di ret/retf/jmp (sec. 12: jangan menembus batas rutin).
Keluarannya KANDIDAT, bukan nama -- tiap baris tetap harus dibaca manual.
"""
import os,struct,re,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":(26400,0xB4,0xB0),"PAC-GAL.EXE":(12288,0x1A,0x16),"HOPPER.EXE":(7863,0xB2,0xAE)}
src=open("tools/emit2.py",encoding="utf-8").read()
for T,(E,FS,FD) in CFG.items():
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
    print("== %s (FAC tunggal 0x%X, ganda 0x%X)"%(T,FS,FD))
    hit=0
    for tgt,c in sorted(t.items()):
        if tgt in known: continue
        pc=tgt; n=0; f=collections.Counter(); facset=None; jt=None
        while n<70:
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            o=ins.op_str
            if "si + 6" in o or "di + 6" in o: f["ganda"]+=1
            if o in("ax, word ptr [si]","ax, word ptr [di + 2]","cx, word ptr [di + 2]"): f["tunggal"]+=1
            if ins.mnemonic=="rcl": f["rcl"]+=1
            if ins.mnemonic in("mul","imul"): f["mul"]+=1
            if ins.mnemonic in("div","idiv"): f["div"]+=1
            if ins.mnemonic=="add" and o in("ah, ch","ah, cl"): f["eksp+"]+=1
            if ins.mnemonic=="sub" and o in("ah, ch","ah, cl"): f["eksp-"]+=1
            if ins.mnemonic=="xor" and o=="al, cl": f["tanda2"]+=1
            if ins.mnemonic=="xor" and o=="al, 0x80": f["negasi"]+=1
            if ins.mnemonic=="mov" and re.match(r"^(si|di), 0x[0-9a-f]+$",o):
                v=int(o.split("0x")[1],16)
                if v==FS: facset="tunggal"
                elif v==FD: facset="ganda"
            n+=1
            if ins.mnemonic in("ret","retf","iret"): break
            if ins.mnemonic=="jmp":
                mm=re.match(r"0x([0-9a-f]+)$",o)
                if mm: jt=int(mm.group(1),16)
                break
            pc=ins.address+ins.size
        if not (f["ganda"] or f["tunggal"] or f["eksp+"] or f["eksp-"] or f["negasi"] or facset): continue
        prec = "GANDA" if f["ganda"] else ("tunggal" if f["tunggal"] else "?")
        op = ("MUL" if f["eksp+"] else "DIV" if f["eksp-"] and f["div"] else
              "SUB" if f["negasi"] else "ADD?" if f["tanda2"]==0 and f["tunggal"]+f["ganda"] else "?")
        print("   @%-6d %2d pgl | presisi=%-7s op=%-4s | FAC=%-8s jmp->%s | %s"
              %(tgt,c,prec,op,facset or "-",jt if jt else "-",
                dict((k,v) for k,v in f.items() if v)))
        hit+=1
    if not hit: print("   (tidak ada)")
