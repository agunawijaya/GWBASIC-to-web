import os,struct,re,json,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)

NAMED_3DTTT={29388:"LET!",33189:"LOAD!",32908:"ARITH!",36709:"PRINT_BEGIN",
 32958:"GOSUB",29385:"FACSTORE!",29219:"LOCATE",29245:"LOCATE",31638:"MULDIV!",
 28098:"COLOR",28124:"COLOR",33508:"CHR$",29411:"FACLOAD!",29176:"STRCMP",
 32999:"RETURN",31617:"NEG!",33264:"CINT",29851:"SGNTEST",29064:"LET$",
 35846:"INPUT",33452:"STROUT"}

def load(T):
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    img=d[hdr:]
    far=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A:
            far.append((r-3,struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]))
    return img,far

def sig(img,pc,n=12):
    """mnemonic + operand-shape signature, immediates normalised away"""
    out=[];p=pc
    for _ in range(n):
        try: ins=next(md.disasm(img[p:p+16],p,1))
        except StopIteration: break
        op=re.sub(r"0x[0-9a-f]+","K",ins.op_str)
        out.append(ins.mnemonic+" "+op)
        if ins.mnemonic in ("retf","ret","iret"): break
        p=ins.address+ins.size
    return tuple(out)

img3,far3=load("3DTTT.EXE")
REF={}
for off,nm in NAMED_3DTTT.items():
    s=sig(img3,off)
    if len(s)>=4: REF.setdefault(s,nm)
print("tanda tangan referensi dari 3DTTT: %d (dari %d nama)"%(len(REF),len(NAMED_3DTTT)))

res={}
for T,end in [("HOPPER.EXE",7863),("PAC-GAL.EXE",12288)]:
    img,far=load(T)
    tal=collections.Counter(t for s,t in far if s<end)
    hits={};miss=0
    for tgt,c in tal.items():
        s=sig(img,tgt)
        # exact, then prefix-match down to 6 instructions
        nm=REF.get(s)
        if not nm:
            for L in range(min(len(s),12),5,-1):
                for rs,rn in REF.items():
                    if len(rs)>=L and rs[:L]==s[:L]:
                        nm=rn; break
                if nm: break
        if nm: hits[tgt]=(nm,c)
        else: miss+=c
    tot=sum(tal.values())
    cov=sum(c for _,c in hits.values())
    print("\n== %s =="%T)
    print("  %d entry point di kode, %d panggilan"%(len(tal),tot))
    print("  cocok: %d entry point, %d panggilan (%.0f%%)"%(len(hits),cov,100*cov/tot))
    for tgt,(nm,c) in sorted(hits.items(),key=lambda kv:-kv[1][1])[:14]:
        print("     %-6d %-12s %4d panggilan"%(tgt,nm,c))
    res[T]={str(k):v for k,v in hits.items()}
json.dump(res,open(os.path.join(ROOT,"name-transfer.json"),"w"),indent=1)
print("\n-> decompile/name-transfer.json")
