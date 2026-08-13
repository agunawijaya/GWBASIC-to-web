"""Telusuri rantai literal -> variabel -> rutin konsumen.

Metode yang paling produktif dari semua yang dicoba. Literal jarang diteruskan
langsung ke rutin yang memakainya; ia ditugaskan dulu ke variabel
(`mov bx,<literal>; mov dx,<variabel>; lcall LET$`), lalu variabel itu yang
diteruskan. Menghubungkan kedua ujungnya memberi dua jenis bukti sekaligus:
  A  pola argumen di situs panggilan (rutin mana menerima variabel itu)
  L  isi variabel, ditelusuri independen dari literal di segmen data
"""
import os,struct,re,collections,json
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
CFG={"3DTTT.EXE":(26400,18564),"PAC-GAL.EXE":(12288,28084),"HOPPER.EXE":(7863,26916)}

def klas(t):
    """Tebak jenis literal dari bentuknya."""
    s=t.strip()
    if re.match(r"^[CBUDLREFGHMANSXP0-9+\-,;=\. ]+$",s) and len(re.findall(r"[BUDLREFGH]",s))>=5:
        return "DRAW"
    if re.match(r"^[a-gA-G#\+\-\.oOlLtTmMnNpPsSxX0-9<>]+$",s) and len(re.findall(r"[a-g]",s))>=5:
        return "PLAY"
    if re.search(r"\.(SCO|DAT|FIL|BAS)$",s,re.I): return "NAMA BERKAS"
    if len(re.findall(r"\b[A-Za-z]{2,}\b",s))>=2: return "teks"
    return "?"

out={}
for T,(E,BASE) in CFG.items():
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    img=d[hdr:]
    lits={}
    i=0
    while i<len(img):
        if 0x20<=img[i]<=0x7e:
            j=i
            while j<len(img) and 0x20<=img[j]<=0x7e: j+=1
            if j-i>=4: lits[i-BASE]=img[i:j].decode('latin1')
            i=j
        else: i+=1
    sites=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E:
            sites.append((r-3,struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]))
    sites.sort()

    # 1) pasangan (bx=literal, dx=variabel) di mana pun di kode
    var2lit={}
    for v,txt in lits.items():
        if v<0 or v>0xFFFF: continue
        pat=struct.pack("<H",v)
        for m in re.finditer(re.escape(pat),img[:E]):
            a=m.start()-1
            if a>=0 and img[a]==0xBB and a+3+3<=E and img[a+3]==0xBA:
                dst=struct.unpack_from("<H",img,a+4)[0]
                var2lit.setdefault(dst,[]).append(txt)

    # 2) rutin mana menerima variabel itu (bx = alamat variabel)
    cons=collections.defaultdict(lambda: collections.defaultdict(list))
    for s,t in sites:
        if s-3>=0 and img[s-3]==0xBB:
            bx=struct.unpack_from("<H",img,s-2)[0]
            if bx in var2lit: cons[t][bx]=var2lit[bx]

    print("== %s =="%T)
    if not cons: print("   tidak ada rantai ditemukan")
    rows=[]
    for t,vv in sorted(cons.items(), key=lambda kv:-len(kv[1])):
        kinds=collections.Counter()
        ex=[]
        for var,txts in vv.items():
            for x in txts:
                kinds[klas(x)]+=1
                if len(ex)<2: ex.append(x[:38])
        dom,dn=kinds.most_common(1)[0]
        print("   rutin @%-6d menerima %d variabel | isi dominan: %-11s | contoh: %s"
              %(t,len(vv),dom,ex))
        rows.append(dict(routine=t,nvars=len(vv),kind=dom,examples=ex))
    out[T]=rows
    print()
json.dump(out,open(os.path.join(ROOT,"chains.json"),"w"),indent=1,ensure_ascii=False)
print("-> decompile/chains.json")
