import os,struct,re,json,collections,sys
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)

# identifications, keyed per-file by runtime target offset
NAMES={
"HOPPER.EXE":{13135:"FAC.LOAD.SGL",13109:"FAC.STORE.SGL",13112:"SGL.COPY",
 9359:"FAC.LOAD.ALT",9671:"FAC.LOAD.ALT2",18322:"SGL.ARITH.2OP",9370:"MBF.UNPACK",
 23248:"STMT.RESET",21569:"ERRFRAME+LOAD4",21497:"BH.FLAGS",12954:"DRAW",
 11523:"SPKR.STRHELPER",13638:"FAC.NUM.FMT",20227:"GFX.LINE",20297:"GFX.ATTR",
 20475:"GFX.STEP",10664:"EVENT.POLL",13841:"KEY.INPUT",20759:"INLINE.PARAM",
 22940:"PRINT",22920:"PRINT.AT",22506:"OPEN",22031:"INPUT.PROMPT"},
}
def analyse(TARGET):
    d=open(os.path.join(RUN,TARGET),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    cs,ip=struct.unpack_from("<H",d,0x16)[0],struct.unpack_from("<H",d,0x14)[0]
    img=d[hdr:]
    relocs=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); relocs.append(s*16+o)
    relocs.sort()
    far=[]
    for r in relocs:
        if r-3>=0 and r+2<=len(img) and img[r-3]==0x9A:
            off=struct.unpack_from("<H",img,r-2)[0]; seg=struct.unpack_from("<H",img,r)[0]
            far.append((r-3,seg*16+off))
    tal=collections.Counter(t for _,t in far)
    rank={t:i+1 for i,(t,c) in enumerate(tal.most_common())}
    CODE_END=max(a for a,_ in far)+16
    # code region = dense fixup region from entry
    sites=sorted(a for a,_ in far)
    end=CODE_END
    for a,b in zip(sites,sites[1:]):
        if b-a>900 and a>1000: end=a+16; break
    # literals
    lits={}
    i=0
    while i<len(img):
        if 0x20<=img[i]<=0x7e:
            j=i
            while j<len(img) and 0x20<=img[j]<=0x7e: j+=1
            if j-i>=4: lits[i]=img[i:j].decode('latin1')
            i=j
        else: i+=1
    # solve string base
    imms=set(); pc=cs*16+ip
    while pc<end:
        try: ins=next(md.disasm(img[pc:pc+16],pc,1))
        except StopIteration: pc+=1; continue
        m=re.search(r",\s*0x([0-9a-f]+)$",ins.op_str)
        if m: imms.add(int(m.group(1),16))
        pc=ins.address+ins.size
    sc=collections.Counter()
    for v in imms:
        for s in lits:
            b=s-v
            if 1000<=b<len(img): sc[b]+=1
    BASE=sc.most_common(1)[0][0]; sc1=sc.most_common(1)[0][1]
    sc2=sc.most_common(2)[1][1] if len(sc)>1 else 0
    def S(v):
        for delta in (0,1):     # literal scanner can glue one leading byte
            t=lits.get(BASE+v-delta)
            if t: return t[delta:] if delta else t
        return None
    return dict(img=img,cs=cs,ip=ip,end=end,far=far,tal=tal,rank=rank,lits=lits,
                BASE=BASE,sc1=sc1,sc2=sc2,S=S,nrel=nrel,hdr=hdr,filesize=len(d))

def emit(TARGET):
    A=analyse(TARGET)
    img=A["img"]; S=A["S"]; rank=A["rank"]
    stem=TARGET.split(".")[0]
    OUT=os.path.join(ROOT,stem); os.makedirs(OUT,exist_ok=True)
    NM=NAMES.get(TARGET,{})
    L=["; %s -- annotated disassembly of the compiled BASIC program"%TARGET,
       "; file %d bytes, header %d, %d relocations"%(A["filesize"],A["hdr"],A["nrel"]),
       "; user code %d..%d ; string base = image %d (seg %04X)"%(A["cs"]*16+A["ip"],A["end"],A["BASE"],A["BASE"]//16),
       "; RT#n = BASCOM runtime entry point, ranked by call frequency","",]
    pc=A["cs"]*16+A["ip"]; lastimm={}; nstr=0; hits=collections.Counter()
    while pc<A["end"]:
        try: ins=next(md.disasm(img[pc:pc+16],pc,1))
        except StopIteration: pc+=1; continue
        m,op=ins.mnemonic,ins.op_str; note=""
        mm=re.match(r"^(ax|bx|cx|dx|si|di|bp),\s*0x([0-9a-f]+)$",op)
        if m=="mov" and mm:
            v=int(mm.group(2),16); lastimm[mm.group(1)]=v
            s=S(v)
            if s: note="   ; = %r"%s[:66]
        elif m=="lcall":
            t=re.match(r"0x([0-9a-f]+), 0x([0-9a-f]+)",op)
            if t:
                tgt=int(t.group(1),16)*16+int(t.group(2),16)
                nm=NM.get(tgt,"")
                note="   ; RT#%-3s %s"%(rank.get(tgt,"?"),nm)
                f=[(r,S(v)) for r,v in lastimm.items() if S(v)]
                if f:
                    note+="  <<< "+", ".join("%s=%r"%(r,x[:56]) for r,x in f)
                    nstr+=1; hits[rank.get(tgt,"?")]+=1
                lastimm.clear()
        L.append("%6d  %-14s %-7s %-22s%s"%(ins.address,ins.bytes.hex(),m,op,note))
        pc=ins.address+ins.size
    open(os.path.join(OUT,"user-code.asm"),"w",encoding="utf-8").write("\n".join(L))

    # assets
    game=[(o,s) for o,s in sorted(A["lits"].items())
          if len(s)>=6 and re.search(r"[A-Za-z]{3,}",s)]
    DRAW=[(o,s) for o,s in game if re.match(r"^[CBUDLREFGHMANSXP0-9+\-,;=\. ]+$",s) and len(re.findall(r"[BUDLREFGH]",s))>=5]
    PLAY=[(o,s) for o,s in game if re.match(r"^[a-gA-G#\+\-\.oOlLtTmMnNpPsSxX0-9<>]+$",s) and len(re.findall(r"[a-g]",s))>=5]
    TEXT=[(o,s) for o,s in game if (o,s) not in DRAW and (o,s) not in PLAY
          and len(re.findall(r"\b[A-Za-z]{2,}\b",s))>=2]
    DATA=[(m.start(),m.group().decode()) for m in re.finditer(rb"(?:\d{1,3},){7,}\d{1,3}",img)]
    am=["# %s — aset yang selamat"%TARGET,"",
        "Terpulihkan verbatim dari biner.","","## String teks",""]
    for o,s in TEXT: am.append("- `@%d` — `%s`"%(o,s))
    am+=["","## String DRAW",""]
    for o,s in DRAW: am.append("- `@%d`\n  ```\n  %s\n  ```"%(o,s))
    am+=["","## String PLAY",""]
    for o,s in PLAY: am.append("- `@%d` — `%s`"%(o,s))
    am+=["","## Blok DATA",""]
    for o,s in DATA: am.append("- `@%d` (%d angka)\n  ```\n  %s\n  ```"%(o,s.count(",")+1,s))
    open(os.path.join(OUT,"assets.md"),"w",encoding="utf-8").write("\n".join(am))

    print("%-13s code=%-6d farcalls=%-5d entries=%-4d strbase=%-6d (%d vs %d)  strcalls=%-3d TEXT=%-3d DRAW=%-2d PLAY=%-2d DATA=%d"
          %(TARGET,A["end"],len(A["far"]),len(A["tal"]),A["BASE"],A["sc1"],A["sc2"],nstr,len(TEXT),len(DRAW),len(PLAY),len(DATA)))
    return dict(target=TARGET,end=A["end"],far=len(A["far"]),entries=len(A["tal"]),
                base=A["BASE"],strcalls=nstr,hits=dict(hits),
                text=len(TEXT),draw=len(DRAW),play=len(PLAY),data=len(DATA))

res=[emit(t) for t in ["HOPPER.EXE","3DTTT.EXE","PAC-GAL.EXE"]]
json.dump(res,open(os.path.join(ROOT,"summary.json"),"w"),indent=1)
