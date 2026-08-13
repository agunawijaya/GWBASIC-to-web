"""Klasifikasi sisa region kode: teks / tabel / padding / kode sungguhan.

Pelajaran dari C:\\Projects\\DOS-Decompiler knowledge/11-unreached-code.md:
  "A bare '78.2% recovered' reads as '21.8% missing', and for three of these
   four games that is wrong."

Region kode ditentukan dengan memangkas blok data dari UJUNG berkas, jadi data
yang duduk di antara rutin tetap terhitung di dalamnya dan menekan persentase.
Skrip ini menamai jenis sisanya, bukan melaporkan persentase telanjang.

Uji "ini kode" mengikuti disiplin sumber: bukan sekadar "bisa didisassembly" —
harus tidak mengandung pasangan nol, tidak memakai instruksi yang 8088 tak punya,
dan mengandung SEBAGIAN alur kendali.
"""
import os,struct,re,json,sys
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":(26400,"trace/3dttt-union.map",32958),
     "PAC-GAL.EXE":(12288,"trace/pacgal-union.map",16453),
     "HOPPER.EXE":(7863,"trace/hopper-union.map",18372)}

# instruksi yang CPU 8088 tidak punya -- kemunculannya menandakan ini bukan kode
POST_8088={"pushaw","popaw","pushal","popal","fisttp","movsd","paddb","bound",
           "enter","leave","ins","outs","insb","insw","outsb","outsw"}

def covered_set(T,E,tracefile,GOSUB):
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    cs0=struct.unpack_from("<H",d,0x16)[0]; ip0=struct.unpack_from("<H",d,0x14)[0]
    img=d[hdr:]
    sites=[]; gt=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A:
            if r-3<E: sites.append(r-3)
            tgt=struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]
            if tgt==GOSUB and r-3+7<=len(img):
                w=struct.unpack_from("<H",img,r-3+5)[0]
                if 0<w<E: gt.append(w)
    sites.sort(); stop=set(sites)
    dyn=set()
    p=os.path.join(ROOT,tracefile)
    if os.path.exists(p):
        dyn={int(l,16) for l in open(p) if l.strip()}
        dyn={x for x in dyn if 26<=x<E}
    # ON..GOTO: rutin 33045 (3DTTT) membawa tabel lompat inline sesudah panggilan.
    # Deteksi umum: byte cacah n di situs+5, diikuti n word yang semua di rentang kode.
    ong=set()
    for s_ in sites:
        p_=s_+5
        if p_>=len(img): continue
        n_=img[p_]
        if not (2<=n_<=32) or p_+1+2*n_>len(img): continue
        ws=[struct.unpack_from("<H",img,p_+1+2*i)[0] for i in range(n_)]
        if all(26<=w<E for w in ws) and len(set(ws))>=n_-1:
            ong.update(ws)
    seeds=set([cs0*16+ip0])|set(gt)|{x+5 for x in sites}|dyn|ong
    seeds={a+1 if a<len(img) and img[a]==0xCC else a for a in seeds}
    covered=set(); q=list(seeds); tried=set()
    def walk(start):
        pc=start
        while pc<E:
            if pc in covered: break
            if pc in stop:
                for k in range(5): covered.add(pc+k)     # situs far call itu SENDIRI kode
                pc+=5
                if pc<len(img) and img[pc]==0xCC: covered.add(pc); pc+=1
                continue
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            for k in range(ins.size): covered.add(ins.address+k)
            m,op=ins.mnemonic,ins.op_str
            t=re.match(r"0x([0-9a-f]+)$",op)
            if m in ("ret","retf","iret"): break
            if m=="jmp":
                if t: q.append(int(t.group(1),16))
                break
            if (m.startswith("j") or m=="loop") and t: q.append(int(t.group(1),16))
            pc=ins.address+ins.size
    while True:
        before=len(covered)
        while q: walk(q.pop())
        for s in sites:
            a=s+5
            if a<E and a not in covered and a not in tried: tried.add(a); q.append(a)
        if not q and len(covered)==before: break
    return img,covered,E

def looks_like_code(img,a,b):
    """Disiplin sumber: bukan cuma 'bisa didisassembly'."""
    seg=img[a:b]
    if len(seg)<6: return False,"terlalu pendek"
    if b"\x00\x00" in seg: return False,"mengandung pasangan nol"
    n=0; ctrl=0; pc=a
    while pc<b:
        try: ins=next(md.disasm(img[pc:pc+16],pc,1))
        except StopIteration: return False,"gagal didisassembly"
        if ins.mnemonic=="(bad)": return False,"opcode tak sah"
        if ins.mnemonic in POST_8088: return False,"instruksi pasca-8088 (%s)"%ins.mnemonic
        if ins.mnemonic.startswith("j") or ins.mnemonic in ("call","lcall","loop","ret","retf"):
            ctrl+=1
        n+=1; pc=ins.address+ins.size
        if pc>b: return False,"instruksi melewati batas"
    if ctrl==0: return False,"tanpa alur kendali"
    return True,"%d instruksi, %d alur kendali"%(n,ctrl)

out={}
for T,(E,tf,GS) in CFG.items():
    img,cov,E=covered_set(T,E,tf,GS)
    runs=[];a=None
    for x in range(26,E):
        if x not in cov:
            if a is None: a=x
        else:
            if a is not None: runs.append((a,x)); a=None
    if a is not None: runs.append((a,E))
    kinds={"teks":0,"padding/nol":0,"tabel pointer":0,"kode tak terjangkau":0,"lain":0}
    codelike=[]
    for lo,hi in runs:
        seg=img[lo:hi]; L=hi-lo
        pr=sum(1 for c in seg if 0x20<=c<=0x7e)
        zr=sum(1 for c in seg if c==0)
        if pr>=L*0.8 and L>=4: kinds["teks"]+=L; continue
        if zr>=L*0.8: kinds["padding/nol"]+=L; continue
        # tabel pointer: word genap yang jatuh di region kode
        if L>=6 and L%2==0:
            ws=[struct.unpack_from("<H",img,lo+i)[0] for i in range(0,L,2)]
            if all(26<=w<E for w in ws) and len(set(ws))>=3:
                kinds["tabel pointer"]+=L; continue
        ok,why=looks_like_code(img,lo,hi)
        if ok: kinds["kode tak terjangkau"]+=L; codelike.append((lo,hi,why))
        else: kinds["lain"]+=L
    rest=sum(kinds.values())
    print("== %s =="%T)
    print("  region kode  : %d byte"%(E-26))
    print("  terjangkau   : %d (%.1f%%)"%(len(cov),100*len(cov)/(E-26)))
    print("  sisa         : %d byte, terdiri dari:"%rest)
    for k,v in sorted(kinds.items(),key=lambda kv:-kv[1]):
        if v: print("       %-22s %6d byte (%.1f%% dari region)"%(k,v,100*v/(E-26)))
    if codelike:
        print("  kandidat kode tak terjangkau (%d rentang), 5 terbesar:"%len(codelike))
        for lo,hi,why in sorted(codelike,key=lambda r:-(r[1]-r[0]))[:5]:
            print("       %6d..%-6d %4d byte  %s"%(lo,hi,hi-lo,why))
    else:
        print("  tidak ada sisa yang terbaca sebagai kode tak terjangkau")
    out[T]=dict(region=E-26,covered=len(cov),kinds=kinds,
                codelike=[[a,b,w] for a,b,w in codelike])
    print()
json.dump(out,open(os.path.join(ROOT,"residue.json"),"w"),indent=1)
print("-> decompile/residue.json")
