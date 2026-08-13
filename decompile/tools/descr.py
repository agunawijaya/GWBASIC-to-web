import os, struct, sys, json, re
from capstone import *

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET = sys.argv[1] if len(sys.argv)>1 else "HOPPER.EXE"
d = open(os.path.join(RUN,TARGET),"rb").read()
hdr = struct.unpack_from("<H",d,8)[0]*16
img = d[hdr:]
DG  = 0x0739*16

# candidate literals in DGROUP
lits={}
i=DG
while i<len(img):
    if 0x20<=img[i]<=0x7e:
        j=i
        while j<len(img) and 0x20<=img[j]<=0x7e: j+=1
        if j-i>=3: lits[i-DG]=img[i:j].decode("latin1")
        i=j
    else: i+=1

# BASCOM string descriptor: <u16 length><u16 dgroup_offset>
# Scan DGROUP for 4-byte records whose (len,off) exactly frames a literal
desc={}
for p in range(DG, len(img)-4, 1):
    L,O = struct.unpack_from("<HH", img, p)
    if 1<=L<=255 and 0<O<0x4000:
        a=DG+O
        if a+L<=len(img):
            s=img[a:a+L]
            if all(0x20<=c<=0x7e for c in s):
                # require it to be a maximal-ish literal (starts a printable run)
                if a-1>=0 and (0x20<=img[a-1]<=0x7e): continue
                desc[p-DG]=(L,O,s.decode("latin1"))

print("== %s : string descriptors in DGROUP ==" % TARGET)
print("literal runs: %d   descriptors found: %d\n" % (len(lits), len(desc)))
good=[(k,v) for k,v in sorted(desc.items()) if len(v[2])>=6]
for k,(L,O,s) in good:
    print("  descr@DG+%04X -> len=%3d off=DG+%04X  %r" % (k,L,O,s[:70]))
json.dump({str(k):v for k,v in desc.items()}, open(TARGET.replace(".","_")+"_desc.json","w"), indent=1)
print("\n-> %s (%d descriptors)" % (TARGET.replace(".","_")+"_desc.json", len(desc)))
