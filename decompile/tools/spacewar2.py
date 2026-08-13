import os, struct, re, json, collections
from capstone import *

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
OUT = r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile\SPACEWAR"
os.makedirs(OUT, exist_ok=True)
d = open(os.path.join(RUN,"SPACEWAR.EXE"),"rb").read()
hdr  = struct.unpack_from("<H",d,8)[0]*16
nrel = struct.unpack_from("<H",d,6)[0]
rof  = struct.unpack_from("<H",d,0x18)[0]
cs,ip= struct.unpack_from("<H",d,0x16)[0], struct.unpack_from("<H",d,0x14)[0]
ss,sp= struct.unpack_from("<H",d,0x0e)[0], struct.unpack_from("<H",d,0x10)[0]
img  = d[hdr:]
ENTRY= cs*16+ip
CODE0= ENTRY                      # data segment precedes code
md = Cs(CS_ARCH_X86, CS_MODE_16); md.detail=True

RELOC=[]
for k in range(nrel):
    o,s=struct.unpack_from("<HH",d,rof+4*k); RELOC.append(s*16+o)

code=set(); targets=collections.Counter(); callt=set()
INTS=collections.Counter(); intsites={}; portsites={}; vechooks=[]

BAD={"(bad)"}
def valid_run(pc,need=10):
    n=0
    for ins in md.disasm(img[pc:pc+need*8], pc):
        if ins.mnemonic in BAD: return False
        n+=1
        if n>=need: return True
    return n>=need

def descend(seed):
    q=[seed]
    while q:
        pc=q.pop()
        lastimm={}
        while 0<=pc<len(img):
            if pc in code: break
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic in BAD: break
            for k in range(ins.size): code.add(ins.address+k)
            m,op=ins.mnemonic,ins.op_str
            mm=re.match(r"^(a[xhl]|b[xhl]|c[xhl]|d[xhl]|si|di|bp),\s*0x([0-9a-f]+)$",op)
            if m=="mov" and mm: lastimm[mm.group(1)]=int(mm.group(2),16)
            if m=="int":
                iv=re.match(r"0x([0-9a-f]+)",op)
                if iv:
                    num=int(iv.group(1),16); INTS[num]+=1
                    ah=lastimm.get("ah")
                    if ah is None and "ax" in lastimm: ah=lastimm["ax"]>>8
                    intsites[ins.address]=(num,ah,dict(lastimm))
            if m in ("in","out"):
                pv=lastimm.get("dx")
                lit=re.findall(r"0x([0-9a-f]+)",op)
                port = int(lit[0],16) if lit and not op.startswith("dx") and "dx" not in op.split(",")[0] else pv
                portsites[ins.address]=port
            # manual interrupt-vector hook: DS=0 and a word store below 0x400
            nxt=ins.address+ins.size
            if m in ("ret","retf","iret"): break
            if m=="jmp":
                t=re.match(r"0x([0-9a-f]+)$",op)
                if t: v=int(t.group(1),16); targets[v]+=1; q.append(v)
                break
            if m.startswith("j") or m=="loop":
                t=re.match(r"0x([0-9a-f]+)$",op)
                if t: v=int(t.group(1),16); targets[v]+=1; q.append(v)
            if m in ("call","lcall"):
                t=re.match(r"0x([0-9a-f]+)(?:, 0x([0-9a-f]+))?$",op)
                if t:
                    v=int(t.group(1),16)*16+int(t.group(2),16) if t.group(2) else int(t.group(1),16)
                    targets[v]+=1; callt.add(v); q.append(v)
            pc=nxt

descend(ENTRY)
# iterative gap recovery inside the code region only
for _ in range(8):
    grew=False
    i=CODE0
    while i<len(img):
        if i in code: i+=1; continue
        j=i
        while j<len(img) and j not in code: j+=1
        if j-i>=12 and valid_run(i):
            before=len(code); descend(i)
            if len(code)>before: grew=True
        i=j
    if not grew: break

codebytes=sum(1 for x in code if x>=CODE0)
print("SPACEWAR.EXE")
print("  data segment : 0 .. %d  (%d bytes)"%(CODE0,CODE0))
print("  code segment : %d .. %d (%d bytes)"%(CODE0,len(img),len(img)-CODE0))
print("  code reached : %d bytes = %.0f%% of code segment"%(codebytes,100*codebytes/(len(img)-CODE0)))
print("  subroutines  : %d   branch targets: %d"%(len(callt),len(targets)))
print("  interrupts   : %s"%", ".join("INT %02Xh x%d"%(k,v) for k,v in sorted(INTS.items())))
pc_used=collections.Counter(v for v in portsites.values() if v is not None)
print("  I/O ports    : %s"%", ".join("%03Xh x%d"%(k,v) for k,v in sorted(pc_used.items())))


strs={}
i=0
while i<len(img):
    if 0x20<=img[i]<=0x7e and i not in code:
        j=i
        while j<len(img) and (0x20<=img[j]<=0x7e): j+=1
        if j-i>=4: strs[i]=img[i:j].decode("latin1")
        i=j
    else: i+=1

PORTS={0x3b4:"HGC index",0x3b5:"HGC data",0x3b8:"HGC mode",0x3bf:"HGC config",
 0x3d4:"CRTC index",0x3d5:"CRTC data",0x3d8:"CGA mode ctrl",0x3d9:"CGA color select",
 0x3da:"CGA status (retrace)",0x40:"PIT ch0",0x41:"PIT ch1",0x42:"PIT ch2 (speaker tone)",
 0x43:"PIT control",0x61:"PPI port B (speaker gate)",0x60:"keyboard data",
 0x20:"PIC command",0x21:"PIC mask",0x201:"game port (joystick)",0x3f2:"floppy digital output (motor control)",
 0x3f4:"FDC status",0x3f5:"FDC data"}
AH21={0x00:"terminate",0x09:"print $-string",0x4c:"terminate w/ code",0x25:"set int vector",0x35:"get int vector",0x2c:"get time",0x3d:"open",0x3e:"close",0x3f:"read",0x40:"write",0x3c:"create"}
AH10={0x00:"set video mode",0x02:"set cursor",0x0f:"get video mode",0x01:"cursor shape",0x06:"scroll",0x09:"write char+attr",0x0e:"teletype"}
AH16={0x00:"wait key",0x01:"check key",0x02:"shift status"}

def lbl(a):
    if a==ENTRY: return "start"
    return ("sub_%04X" if a in callt else "loc_%04X")%a

L=["; ==================================================================",
"; SPACEWAR.EXE   (C) 1985 Bill Seiler   --  annotated disassembly",
";",
"; Hand-written 8086 assembly, NOT compiled BASIC. Evidence: only %d"%nrel,
"; relocation entries and zero BASIC runtime error strings, against",
"; 786-2357 relocations and 22 such strings in the three BASCOM EXEs.",
";",
"; file %d bytes | header %d | image %d"%(len(d),hdr,len(img)),
"; entry  CS:IP = %04X:%04X  -> image offset %d"%(cs,ip,ENTRY),
"; stack  SS:SP = %04X:%04X"%(ss,sp),
"; layout: DATA 0..%d, CODE %d..%d"%(CODE0,CODE0,len(img)),
"; coverage: %.0f%% of the code segment via recursive descent + gap recovery"%(100*codebytes/(len(img)-CODE0)),
"; interrupts: %s"%", ".join("INT %02Xh x%d"%(k,v) for k,v in sorted(INTS.items())),
"; ==================================================================",""]

i=0
while i<len(img):
    if i in code:
        try: ins=next(md.disasm(img[i:i+16],i,1))
        except StopIteration: L.append("%6d  db 0x%02x"%(i,img[i])); i+=1; continue
        if i in targets or i==ENTRY:
            L.append("")
            L.append("%s:%s"%(lbl(i)," " if i!=ENTRY else "   ; <<<< PROGRAM ENTRY"))
        m,op=ins.mnemonic,ins.op_str; note=""
        if i in intsites:
            num,ah,imm=intsites[i]
            tbl=AH21 if num==0x21 else AH10 if num==0x10 else AH16 if num==0x16 else {}
            note="   ; INT %02Xh"%num+(" AH=%02X %s"%(ah,tbl.get(ah,"")) if ah is not None else "")
            if num==0x21 and ah==0x09 and imm.get("dx") in strs:
                note+="  -> %r"%strs[imm["dx"]][:56]
        elif i in portsites:
            p=portsites[i]
            if p is not None: note="   ; port %03Xh = %s"%(p,PORTS.get(p,"?"))
        else:
            t=re.match(r"0x([0-9a-f]+)$",op)
            if t and (m=="call" or m=="jmp" or m.startswith("j")):
                op+="        ; %s"%lbl(int(t.group(1),16))
        L.append("%6d  %-14s %-7s %s%s"%(ins.address,ins.bytes.hex(),m,op,note))
        i+=ins.size
    else:
        j=i
        while j<len(img) and j not in code: j+=1
        L.append(""); L.append("; ---- data @%d .. %d (%d bytes) ----"%(i,j,j-i))
        k=i; emitted=0
        while k<j:
            if k in strs:
                L.append("%6d  db '%s'"%(k,strs[k][:118])); k+=len(strs[k]); emitted+=1
            else:
                run=min(16,j-k)
                chunk=img[k:k+run]
                if set(chunk)=={0}:
                    z=k
                    while z<j and img[z]==0: z+=1
                    L.append("%6d  db %d dup(0)"%(k,z-k)); k=z; emitted+=1; continue
                L.append("%6d  db %s"%(k,",".join("0x%02x"%b for b in chunk))); k+=run; emitted+=1
            if emitted>700:
                L.append("; ... %d more data bytes omitted"%(j-k)); break
        i=j

open(os.path.join(OUT,"spacewar.asm"),"w",encoding="utf-8").write("\n".join(L))
print("-> spacewar.asm (%d lines)"%len(L))
json.dump({"entry":ENTRY,"code_start":CODE0,"ints":{str(k):v for k,v in INTS.items()},
  "ports":{str(k):v for k,v in pc_used.items()},"subs":sorted(callt),
  "strings":{str(k):v for k,v in strs.items()},"coverage_pct":round(100*codebytes/(len(img)-CODE0),1)},
  open(os.path.join(OUT,"spacewar.json"),"w"),indent=1)
