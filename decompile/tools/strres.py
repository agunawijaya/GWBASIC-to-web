import os,struct,re,json,collections,sys
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET=sys.argv[1] if len(sys.argv)>1 else "HOPPER.EXE"
d=open(os.path.join(RUN,TARGET),"rb").read()
hdr=struct.unpack_from("<H",d,8)[0]*16
cs,ip=struct.unpack_from("<H",d,0x16)[0],struct.unpack_from("<H",d,0x14)[0]
img=d[hdr:]
md=Cs(CS_ARCH_X86,CS_MODE_16)
calls=json.load(open(TARGET.replace(".","_")+"_calls.json"))
tal={int(k):v for k,v in calls["tally"].items()}
rank={t:i+1 for i,(t,c) in enumerate(sorted(tal.items(),key=lambda kv:-kv[1]))}
sites={s[0]:s[1] for s in calls["farcalls"]}
CODE_END=max(sites)+16

# literals anywhere in image
lits={}
i=0
while i<len(img):
    if 0x20<=img[i]<=0x7e:
        j=i
        while j<len(img) and 0x20<=img[j]<=0x7e: j+=1
        if j-i>=4: lits[i]=img[i:j].decode('latin1')
        i=j
    else: i+=1

# collect imm16 from code
imms=set(); pc=cs*16+ip
while pc<CODE_END:
    try: ins=next(md.disasm(img[pc:pc+16],pc,1))
    except StopIteration: pc+=1; continue
    m=re.search(r",\s*0x([0-9a-f]+)$",ins.op_str)
    if m: imms.add(int(m.group(1),16))
    pc=ins.address+ins.size

# solve base
sc=collections.Counter()
for v in imms:
    for s in lits:
        b=s-v
        if 1000<=b<len(img): sc[b]+=1
BASE,score=sc.most_common(1)[0]
second=sc.most_common(2)[1][1] if len(sc)>1 else 0
print("== %s =="%TARGET)
print("string base = %d (seg %04X)   score %d vs runner-up %d"%(BASE,BASE//16,score,second))

def S(v):
    a=BASE+v
    return lits.get(a)

# annotate: for each far call, look back for an imm that resolves to a literal
pc=cs*16+ip
out=[]; hits=[]
lastimm={}
while pc<CODE_END:
    try: ins=next(md.disasm(img[pc:pc+16],pc,1))
    except StopIteration: pc+=1; continue
    m,op=ins.mnemonic,ins.op_str
    mm=re.match(r"^(ax|bx|cx|dx|si|di|bp),\s*0x([0-9a-f]+)$",op)
    note=""
    if m=="mov" and mm:
        v=int(mm.group(2),16); lastimm[mm.group(1)]=v
        s=S(v)
        if s: note="   ; -> %r"%s[:70]
    elif m=="lcall":
        t=re.match(r"0x([0-9a-f]+), 0x([0-9a-f]+)",op)
        if t:
            tgt=int(t.group(1),16)*16+int(t.group(2),16)
            note="   ; RT#%s"%rank.get(tgt,"?")
            found=[(r,S(v)) for r,v in lastimm.items() if S(v)]
            if found:
                note+="   <<< "+", ".join("%s=%r"%(r,s[:60]) for r,s in found)
                hits.append((ins.address,tgt,rank.get(tgt,"?"),found))
            lastimm.clear()
    out.append("%6d  %-14s %-7s %-22s%s"%(ins.address,ins.bytes.hex(),m,op,note))
    pc=ins.address+ins.size

print("far calls carrying a resolved literal: %d"%len(hits))
byrt=collections.Counter(h[2] for h in hits)
print("\nwhich RT# receive string literals:")
for r,c in byrt.most_common(12):
    ex=[h[3][0][1][:44] for h in hits if h[2]==r][:2]
    print("   RT#%-4s x%-3d  e.g. %s"%(r,c,ex))
open(TARGET.replace(".","_")+"_strres.asm","w",encoding="utf-8").write("\n".join(out))
json.dump({"base":BASE,"hits":[[a,t,r,[[x,y] for x,y in f]] for a,t,r,f in hits]},
          open(TARGET.replace(".","_")+"_strres.json","w"),indent=1)
