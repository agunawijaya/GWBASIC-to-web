import os,struct,re,json,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":26400,"PAC-GAL.EXE":12288,"HOPPER.EXE":7863}

out={}
for T,END in CFG.items():
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    cs,ip=struct.unpack_from("<H",d,0x16)[0],struct.unpack_from("<H",d,0x14)[0]
    img=d[hdr:]
    sites=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<END: sites.append(r-3)
    sites.sort()
    # anchors: entry, and every byte right after a far call (= guaranteed boundary)
    anchors=[cs*16+ip]+[s+5 for s in sites]
    # for 3DTTT/PAC-GAL an INT 3 may follow; skip it
    anchors=[a+1 if a<len(img) and img[a]==0xCC else a for a in anchors]
    stop=set(sites)          # stop when reaching the next call site
    covered=set(); br=[]
    for a in anchors:
        pc=a
        while pc<END:
            if pc in stop: break          # reached next call, gap done
            if pc in covered: break
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            for k in range(ins.size): covered.add(ins.address+k)
            m,op=ins.mnemonic,ins.op_str
            t=re.match(r"0x([0-9a-f]+)$",op)
            if m in ("ret","retf","iret"): break
            if m=="jmp":
                if t: br.append((pc,int(t.group(1),16),False))
                break
            if (m.startswith("j") or m=="loop") and t:
                br.append((pc,int(t.group(1),16),True))
            pc=ins.address+ins.size
    loops=[b for b in br if b[1]<=b[0] and b[2]]
    gotos=[b for b in br if b[1]<=b[0] and not b[2]]
    fwd  =[b for b in br if b[1]>b[0]]
    print("== %s =="%T)
    print("  jangkauan : %d dari %d byte (%.0f%%)   [rekursif sebelumnya: ~28%%]"
          %(len(covered),END,100*len(covered)/END))
    print("  percabangan: %d  (loop %d, GOTO mundur %d, IF/skip %d)"
          %(len(br),len(loops),len(gotos),len(fwd)))
    if loops:
        L=sorted(((h,e) for e,h,_ in [(b[0],b[1],b[2]) for b in loops]),key=lambda x:-(x[1]-x[0]))[:4]
        print("  loop terpanjang: %s"%", ".join("%d..%d (%d B)"%(h,e,e-h) for h,e in L))
    out[T]=dict(coverage=round(100*len(covered)/END,1),branches=len(br),
                loops=len(loops),gotos=len(gotos),fwd=len(fwd))
    print()
json.dump(out,open(os.path.join(ROOT,"blocks-gapscan.json"),"w"),indent=1)
print("-> decompile/blocks-gapscan.json")
