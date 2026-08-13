import os,struct,re,json,collections,sys
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)

TYPE={2:"INTEGER %  (2 byte)",3:"STRING $   (deskriptor 3 byte)",
      4:"SINGLE !   (4 byte MBF)",8:"DOUBLE #   (8 byte MBF)"}

def run(TARGET):
    d=open(os.path.join(RUN,TARGET),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    img=d[hdr:]
    relocs=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); relocs.append(s*16+o)
    far=[]
    for r in sorted(relocs):
        if r-3>=0 and r+2<=len(img) and img[r-3]==0x9A:
            off=struct.unpack_from("<H",img,r-2)[0]; seg=struct.unpack_from("<H",img,r)[0]
            far.append((r-3,seg*16+off))
    tal=collections.Counter(t for _,t in far)
    rank={t:i+1 for i,(t,c) in enumerate(tal.most_common())}

    # a stub = E8 rel16 followed by 2 descriptor bytes, target shared by many stubs
    stubs={}
    helpers=collections.Counter()
    for t in tal:
        if t+5>len(img) or img[t]!=0xE8: continue
        rel=struct.unpack_from("<h",img,t+1)[0]
        h=t+3+rel
        al,ah=img[t+3],img[t+4]
        stubs[t]=(h,al,ah); helpers[h]+=1
    if not helpers:
        print("%s: no stub table found"%TARGET); return None
    H,hn=helpers.most_common(1)[0]

    rows=[]
    for t,(h,al,ah) in sorted(stubs.items(), key=lambda kv:-tal[kv[0]]):
        if h!=H: continue
        rows.append((rank[t],t,tal[t],al,ah))
    tot=sum(tal.values())
    covered=sum(r[2] for r in rows)
    print("== %s =="%TARGET)
    print("  entry point total      : %d  (%d panggilan)"%(len(tal),tot))
    print("  stub ber-deskriptor    : %d menuju helper 0x%X  (%d panggilan = %.0f%%)"
          %(len(rows),H,covered,100*covered/tot))
    print("  RT#  target  panggilan  AL  AH  tipe operan")
    for r,t,c,al,ah in rows[:14]:
        print("   %-4d %-7d %-9d %-3d %-3d %s"%(r,t,c,al,ah,TYPE.get(al,"? (%d byte)"%al)))
    bysize=collections.Counter()
    for r,t,c,al,ah in rows: bysize[al]+=c
    print("  distribusi tipe operan (menurut jumlah panggilan):")
    for al,c in bysize.most_common():
        print("     %-28s %6d panggilan  %5.1f%%"%(TYPE.get(al,"? (%d byte)"%al),c,100*c/tot))
    return dict(target=TARGET,entries=len(tal),calls=tot,helper=H,
                stubs=[[r,t,c,al,ah] for r,t,c,al,ah in rows],
                bysize={str(k):v for k,v in bysize.items()},covered=covered)

out=[]
for t in ["HOPPER.EXE","3DTTT.EXE","PAC-GAL.EXE"]:
    r=run(t)
    if r: out.append(r)
    print()
json.dump(out,open(os.path.join(ROOT,"stub-descriptors.json"),"w"),indent=1)
print("-> decompile/stub-descriptors.json")
