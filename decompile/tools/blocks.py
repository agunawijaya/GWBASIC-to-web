import os,struct,re,json,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":(26400,32958),"PAC-GAL.EXE":(12288,16453),"HOPPER.EXE":(7863,18372)}

def analyse(T,END,GOSUB):
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    cs,ip=struct.unpack_from("<H",d,0x16)[0],struct.unpack_from("<H",d,0x14)[0]
    img=d[hdr:]
    # recursive descent, bounded to user code
    seen=set(); br=[]        # (src,dst,cond)
    # seed: entry + semua target GOSUB (word inline sesudah panggilan)
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    seeds=[cs*16+ip]; gt=[]
    for k in range(nrel):
        o,s2=struct.unpack_from("<HH",d,rof+4*k); r=s2*16+o
        if r-3>=0 and img[r-3]==0x9A:
            tgt=struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]
            site=r-3
            if tgt==GOSUB and site+7<=len(img):
                w=struct.unpack_from("<H",img,site+5)[0]
                if 0<w<END: gt.append(w)
    seeds+=sorted(set(gt))
    q=list(seeds)
    while q:
        pc=q.pop()
        while 0<=pc<END:
            if pc in seen: break
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            seen.add(pc)
            m,op=ins.mnemonic,ins.op_str
            t=re.match(r"0x([0-9a-f]+)$",op)
            if m in ("ret","retf","iret"): break
            if m=="jmp":
                if t: v=int(t.group(1),16); br.append((pc,v,False)); q.append(v)
                break
            if (m.startswith("j") or m=="loop") and t:
                v=int(t.group(1),16); br.append((pc,v,True)); q.append(v)
            pc=ins.address+ins.size
    back=[b for b in br if b[1]<=b[0] and b[2]]      # kondisional mundur = akhir loop
    goto=[b for b in br if b[1]<=b[0] and not b[2]]   # tak-bersyarat mundur = GOTO
    fwd =[b for b in br if b[1]>b[0]]
    tgt=collections.Counter(b[1] for b in br)
    # loop headers: targets of backward branches
    heads=sorted({b[1] for b in back})
    # nesting depth: how many loops contain each offset
    spans=sorted(((b[1],b[0]) for b in back))
    return dict(goto=goto,gosub_targets=sorted(set(gt)),img=img,br=br,back=back,fwd=fwd,heads=heads,spans=spans,tgt=tgt,seen=seen)

out={}
for T,(END,GOSUB) in CFG.items():
    A=analyse(T,END,GOSUB)
    print("== %s =="%T)
    print("  target GOSUB unik    : %d"%len(A["gosub_targets"]))
    print("  instruksi terjangkau : %d byte dari %d (%.0f%%)"%(len(A["seen"]),END,100*len(A["seen"])/END))
    print("  percabangan          : %d total"%len(A["br"]))
    print("    loop (kond. mundur): %d"%len(A["back"]))
    print("    GOTO (jmp mundur)  : %d"%len(A["goto"]))
    print("    IF/skip (maju)     : %d"%len(A["fwd"]))
    print("  kepala loop unik     : %d"%len(A["heads"]))
    # nesting histogram
    depth=collections.Counter()
    for h,e in A["spans"]:
        d_=sum(1 for h2,e2 in A["spans"] if h2<h and e2>e)
        depth[d_]+=1
    print("  kedalaman bersarang  : %s"%dict(sorted(depth.items())))
    # longest loops
    L=sorted(A["spans"],key=lambda x:-(x[1]-x[0]))[:5]
    print("  loop terpanjang      : %s"%", ".join("%d..%d (%d byte)"%(h,e,e-h) for h,e in L))
    out[T]=dict(goto=len(A["goto"]),gosub_targets=A["gosub_targets"],branches=len(A["br"]),back=len(A["back"]),fwd=len(A["fwd"]),
                heads=len(A["heads"]),spans=[[h,e] for h,e in A["spans"]],
                depth={str(k):v for k,v in depth.items()})
    print()
json.dump(out,open(os.path.join(ROOT,"blocks.json"),"w"),indent=1)
print("-> decompile/blocks.json")
