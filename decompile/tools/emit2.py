import os,struct,re,collections
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
CFG={
 "3DTTT.EXE":dict(base=18564,end=26400,stub=(36400,36460),
   named={45232:"RT_HEAPINIT",34878:"RT_STMTCTX",31393:"END_STMT",31384:"END_STMT",34244:"OPEN",34111:"CLOSE",29771:"WIDTH",30851:"DEF_SEG=",30869:"CLEAR",26774:"SND_TIMER_OFF",35081:"TRAP_INIT",28326:"KEY_DISPLAY",28353:"KEY_LIST",35565:"ON_KEY_GOSUB",35625:"KEY_ONOFF",34170:"OPEN_MODE$",32206:"VAL",28693:"SCREEN_STMT",28912:"CSRLIN",29775:"POS",33685:"LEFT$",33694:"RIGHT$",33708:"MID$",29895:"NONZERO!_FAC",29906:"ABS",29915:"ABS",29924:"SCALE2!",33452:"LEN",33459:"ASC",34963:"READ!",34970:"READ#",34977:"READ%",34984:"READ$",35922:"INPUT#_BEGIN",29118:"CONCAT$",29431:"FACSTORE!",29456:"FACSTORE#",31939:"MUL!_FAC",31950:"MUL!",29869:"SGNTEST_FAC",32897:"ARITH!_FAC",33479:"INKEY$",36733:"PRINT#",36709:"PRINT_BEGIN",35846:"INPUT",29064:"LET$",
          28098:"COLOR",28124:"COLOR",29219:"LOCATE",29245:"LOCATE",
          29388:"LET!",29385:"FACSTORE!",29411:"FACLOAD!",
          33189:"LOAD!",32908:"ARITH!",31638:"ADD!",31627:"ADD!",31614:"ADD!",31632:"ADD!",
          32958:"GOSUB",32999:"RETURN",31617:"SUB!",33264:"CINT",29851:"SGNTEST",33508:"CHR$",29176:"STRCMP",27973:"CLS",33151:"FACNORM",28667:"ARG_C",36119:"INPUT_ITEM",36318:"INPUT_DONE",33799:"STRING$",33792:"STRING$",33045:"ON_GOTO",33117:"INT2SGL"}),
 "PAC-GAL.EXE":dict(base=28084,end=12288,stub=(22438,22483),named={31168:"RT_HEAPINIT",17458:"RT_STMTCTX",22732:"PRINT_USING",14247:"END_STMT",14238:"END_STMT",14465:"RND",14595:"RANDOMIZE",19834:"SOUND",16985:"STRTEMP",22142:"INPUT_ITEM",22341:"INPUT_DONE",17484:"TRAP_INIT",20527:"KEY_DISPLAY",17968:"ON_KEY_GOSUB",18028:"KEY_ONOFF",21807:"INT2SGL",15787:"VAL",17237:"TIME$",16822:"LEFT$",16831:"RIGHT$",16845:"MID$",20174:"CLS",21120:"SCREEN",11999:"ADD!_FAC",12004:"ADD!",12779:"FACSTORE!",12804:"FACSTORE#",14633:"ADD#_FAC",14638:"ADD#",15726:"FCMP!_FAC",15731:"FCMP!",12311:"MUL!_FAC",12439:"DIV!_FAC",12444:"DIV!",15042:"MUL#_FAC",21903:"CINT#",16616:"INKEY$",22786:"PRINT_BEGIN",21265:"INPUT",12578:"LET$",12890:"LOCATE",12916:"LOCATE",16645:"CHR$",12632:"CONCAT$",16929:"STRING$_C",16936:"STRING$_S",21341:"PLAY",20299:"COLOR_FG",20325:"COLOR_BG",21954:"CINT",16494:"RETURN",16453:"GOSUB",12690:"STRCMP"}),
 "HOPPER.EXE":dict(base=26916,end=7863,stub=(22885,22945),named={31728:"RT_HEAPINIT",19801:"RT_STMTCTX",15089:"END_STMT",15446:"RANDOMIZE",13450:"SGN",19815:"CALL_VAR",20073:"TAB",16553:"ON_ERROR",16558:"ON_ERROR_OFF",21032:"PLAY",22114:"PAINT",23194:"PRINT_USING",19476:"STICK",17046:"OPEN",16913:"CLOSE",21832:"INPUT_ITEM",20039:"SPC",15098:"END_STMT",20372:"GET",20170:"LINE",20466:"GFXPT",20227:"LINE_BF",18724:"INSTR",13008:"CONCAT$",20545:"STR$",15316:"RND",19921:"READ!",19928:"READ#",19935:"READ%",19942:"READ$",14578:"CLEAR",12243:"KEY_LIST",12329:"KEY_ASSIGN",12216:"KEY_DISPLAY",19827:"LINE_INPUT",13841:"INPUT$",20360:"GFXPT",20366:"GFXSTART",20835:"INPUT#_BEGIN",16975:"OPEN_MODE$",17620:"VAL",19156:"TIME$",18741:"LEFT$",18750:"RIGHT$",18764:"MID$",20155:"GFXPT",20297:"PSET",20475:"PUT",13566:"SCALE2!",13545:"ABS",13554:"ABS",14551:"DEF_SEG",14556:"DEF_SEG=",14561:"CALL_ABS",17031:"OPEN_MODE",18508:"LEN",18515:"ASC",22031:"INPUT_DONE",16870:"EOF",9364:"ADD!",13514:"NONZERO!",13524:"NONZERO#",13534:"NONZERO!_FAC",13144:"LOAD#",13155:"FACSTORE!",13180:"FACSTORE#",15485:"ADD#_FAC",15490:"ADD#",9676:"MUL!",9679:"MUL!",9810:"DIV!",15894:"MUL#_FAC",21593:"CINT#",9338:"SUB!_FAC",9359:"ADD!_FAC",13508:"SGNTEST_FAC",18311:"ARITH!_FAC",18535:"INKEY$",23272:"PRINT#",9671:"MUL!_FAC",13638:"INT",11523:"SOUND",22506:"DRAW",21497:"INT2SGL",11863:"CLS",9682:"MUL!",13135:"FACLOAD!",21569:"LOAD!",9370:"ADD!",9346:"SUB!",13109:"FACSTORE!",18322:"ARITH!",18564:"CHR$",13266:"LOCATE",13292:"LOCATE",23248:"PRINT_BEGIN",12954:"LET$",13280:"LOCATE",21749:"LOAD!",12583:"SCREEN_B",12557:"SCREEN_A",11988:"COLOR_FG",12014:"COLOR_BG",13112:"LET!",13066:"STRCMP",20759:"INPUT",13490:"SGNTEST",18372:"GOSUB",21644:"CINT",18413:"RETURN"}),
}
TY={2:"%",3:"$",4:"!",8:"#"}; SEP={0:",",1:";",2:""}

def build(T):
    C=CFG[T]
    d=open(os.path.join(RUN,T),"rb").read()
    hdr=struct.unpack_from("<H",d,8)[0]*16
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    img=d[hdr:]; BASE=C["base"]
    stub={}
    a,b=C["stub"]
    for t in range(a,b,5):
        if img[t]==0xE8: stub[t]=(img[t+3],img[t+4])
    lits={}; i=0
    while i<len(img):
        if 0x20<=img[i]<=0x7e:
            j=i
            while j<len(img) and 0x20<=img[j]<=0x7e: j+=1
            if j-i>=3: lits[i]=img[i:j].decode('latin1')
            i=j
        else: i+=1
    def S(v):
        for dl in (0,1):
            t=lits.get(BASE+v-dl)
            if t: return t[dl:] if dl else t
        return None
    sites=[]
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A:
            sites.append((r-3,struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]))
    sites.sort()
    HAS_INT3 = img.count(bytes([0xCC]))>200
    BRT=set()
    if not HAS_INT3:
        # tanpa INT 3, batas pernyataan = TARGET PERCABANGAN:
        # tiap alamat yang bisa dicapai kendali pasti memulai pernyataan baru
        from capstone import Cs as _Cs, CS_ARCH_X86 as _A, CS_MODE_16 as _M
        _md=_Cs(_A,_M)
        pc=26
        while pc<C["end"]:
            try: ins=next(_md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: pc+=1; continue
            m2,o2=ins.mnemonic,ins.op_str
            t2=re.match(r"0x([0-9a-f]+)$",o2)
            if t2 and (m2.startswith("j") or m2=="loop"): BRT.add(int(t2.group(1),16))
            pc=ins.address+ins.size
    rank={t:i+1 for i,(t,c) in enumerate(collections.Counter(t for _,t in sites).most_common())}
    code=[x for x in sites if x[0]<C["end"]]

    out=[];cur=[];start=None;nst=0;npr=0;nlit=0
    lastbx=None; ncarry=0; prev_end=None; lastdx=None
    for idx,(site,tgt) in enumerate(code):
        bx=None
        if site-3>=0 and img[site-3]==0xBB:
            bx=struct.unpack_from("<H",img,site-2)[0]; lastbx=bx
        elif site-2>=0 and img[site-2]==0x33 and img[site-1]==0xDB:
            bx=0; lastbx=0
        elif lastbx is not None and prev_end is not None and site-prev_end<=3              and 0xBB not in img[prev_end:site]:
            # tak ada 'mov bx,imm' antara panggilan sebelumnya dan ini:
            # wrapper runtime menyimpan/memulihkan bx, jadi nilainya bertahan
            bx=lastbx; ncarry+=1
        # dx = tujuan untuk penugasan (LET$ memakai bx=sumber, dx=tujuan)
        dxv=None
        if site-3>=0 and img[site-3]==0xBA: dxv=struct.unpack_from("<H",img,site-2)[0]
        elif site-6>=0 and img[site-6]==0xBA: dxv=struct.unpack_from("<H",img,site-5)[0]
        if dxv is not None: lastdx=dxv
        s=S(bx) if bx is not None else None
        if s: nlit+=1
        if tgt in stub:
            al,ah=stub[tgt]
            item='"%s"'%s if s else ("V%04X%s"%(bx,TY.get(al,"?")) if bx is not None else "?")
            txt="PRINT %s%s"%(item,SEP.get(ah,""))
        elif tgt in C["named"]:
            nm=C["named"][tgt]
            # LOCATE/COLOR/CHR$ menerima ANGKA -- jangan resolusikan sebagai literal
            if nm in ("LOCATE","COLOR","CHR$"):
                # menerima ANGKA -- jangan resolusikan sebagai literal
                txt="%s %s"%(nm,("V%04X"%bx) if bx is not None else "")
            elif nm=="LET$" and lastdx is not None:
                # LET$ memakai bx = sumber, dx = TUJUAN
                src='"%s"'%s if s else (("V%04X$"%bx) if bx is not None else "?")
                txt="V%04X$ = %s"%(lastdx,src)
            else:
                arg='"%s"'%s if s else (("V%04X"%bx) if bx is not None else "")
                txt="%s %s"%(nm,arg)
        else:
            txt="RT#%s(%s)"%(rank.get(tgt,"?"),'"%s"'%s if s else (("V%04X"%bx) if bx is not None else ""))
        if start is None: start=site
        cur.append(txt)
        prev_end=site+5
        # statement boundary: INT 3 right after this call, or a gap before the next call
        brk = img[site+5]==0xCC
        if not brk and idx+1<len(code):
            nxt=code[idx+1][0]
            if any(img[p]==0xCC for p in range(site+5,min(nxt,site+40))): brk=True
            # biner tanpa INT 3 (HOPPER): pakai jarak antar-panggilan sebagai pemisah
            elif not HAS_INT3:
                # putus bila ada target percabangan di antara panggilan ini dan berikutnya
                if any(p in BRT for p in range(site+5,nxt)): brk=True
                elif nxt-(site+5)>10: brk=True
        if brk:
            nst+=1
            npr+=sum(1 for t in cur if t.startswith("PRINT"))
            out.append("%6d  %s"%(start," : ".join(cur))); cur=[];start=None
    if cur:
        nst+=1; npr+=sum(1 for t in cur if t.startswith("PRINT")); out.append("%6d  %s"%(start," : ".join(cur)))
    return out,nst,npr,len(code),nlit,ncarry

tot={}
# Penjaga: dict literal MENELAN kunci ganda tanpa peringatan -- penyisipan nama baru
# yang menabrak nama lama akan hilang diam-diam (lihat NEGATIVE-RESULTS sec. 14).
import re as _re, collections as _c
for _T,_cfg in CFG.items():
    _src=open(__file__,encoding="utf-8").read()
    _m=_re.search(_re.escape('"%s":dict('%_T)+r'.*?named=\{(.*?)\}\)',_src,_re.S)
    _p=_re.findall(r'(\d+):"([^"]+)"',_m.group(1))
    _d=[k for k,n in _c.Counter(k for k,_ in _p).items() if n>1]
    if _d: raise SystemExit("KUNCI GANDA di %s: %s -- perbaiki dulu"%(_T,_d))

for T in ["3DTTT.EXE","PAC-GAL.EXE","HOPPER.EXE"]:
    out,nst,npr,nc,nlit,ncarry=build(T)
    stem=T.split(".")[0]
    dest=os.path.join(ROOT,stem,"statements.txt")
    h=["# %s — pernyataan tersegmentasi di batas INT 3"%T,
       "# %d pernyataan dari %d panggilan runtime di kode game"%(nst,nc),
       "# %d item PRINT; %d panggilan membawa literal string tertaut"%(npr,nlit),
       "# Vxxxx = alamat variabel; akhiran tipe (%!#$) berasal dari deskriptor stub",
       "# pemisah: ';' AH=1, ',' AH=0, kosong = ganti baris (AH=2)",
       "# BELUM .bas yang bisa dijalankan — RT#n yang belum ternama masih banyak","",]
    open(dest,"w",encoding="utf-8").write("\n".join(h+out))
    print("%-13s %4d pernyataan | %4d item PRINT | %4d panggilan | %3d literal | %4d bx bertahan"%(T,nst,npr,nc,nlit,ncarry))
    tot[T]=(nst,npr,nc,nlit)
    for l in out[:10]: print("     "+l[:112])
    print()
