import os, struct, sys, collections, json

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET = sys.argv[1] if len(sys.argv) > 1 else "HOPPER.EXE"
d = open(os.path.join(RUN, TARGET), "rb").read()
hdr    = struct.unpack_from("<H", d, 8)[0] * 16
nrel   = struct.unpack_from("<H", d, 6)[0]
reloff = struct.unpack_from("<H", d, 0x18)[0]
cs     = struct.unpack_from("<H", d, 0x16)[0]
ip     = struct.unpack_from("<H", d, 0x14)[0]
img    = d[hdr:]

relocs = []
for k in range(nrel):
    o, s = struct.unpack_from("<HH", d, reloff + 4*k)
    relocs.append(s*16 + o)
relocs.sort()

print("== %s ==" % TARGET)
print("image=%d  entry=cs:%04x ip:%04x -> image offset %d" % (len(img), cs, ip, cs*16+ip))
print("relocs=%d" % nrel)

# validated far calls: reloc points at the segment word of `9A off16 seg16`
farcalls = []   # (instr_off, target_linear, target_seg, target_off)
other    = []
for r in relocs:
    if r-3 >= 0 and r+2 <= len(img) and img[r-3] == 0x9A:
        off = struct.unpack_from("<H", img, r-2)[0]
        seg = struct.unpack_from("<H", img, r)[0]
        farcalls.append((r-3, seg*16+off, seg, off))
    else:
        other.append(r)

print("far calls validated : %d" % len(farcalls))
print("other fixups        : %d  (segment loads: mov ax,seg / push seg etc.)" % len(other))

lo = min(f[0] for f in farcalls); hi = max(f[0] for f in farcalls)
print("user-code span      : %d .. %d  (%d bytes)" % (lo, hi, hi-lo))

tally = collections.Counter(f[1] for f in farcalls)
print("\ndistinct runtime entry points: %d" % len(tally))
print("\n rank  target   calls  seg:off      %  cumulative")
tot = len(farcalls); cum = 0
for i,(t,c) in enumerate(tally.most_common()):
    cum += c
    seg, off = next((s,o) for (_,tt,s,o) in farcalls if tt==t)
    print("  %3d  %7d  %5d  %04X:%04X  %4.1f%%  %4.1f%%" % (i+1, t, c, seg, off, 100*c/tot, 100*cum/tot))
    if i >= 34:
        print("  ... (%d more entry points, %d calls)" % (len(tally)-35, tot-cum))
        break

json.dump({"file":TARGET,"entry":cs*16+ip,"farcalls":farcalls,
           "tally":{str(k):v for k,v in tally.items()}},
          open(TARGET.replace(".","_")+"_calls.json","w"), indent=1)
print("\n-> %s" % (TARGET.replace(".","_")+"_calls.json"))
