import os, re, struct, sys

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET = sys.argv[1] if len(sys.argv) > 1 else "HOPPER.EXE"
d = open(os.path.join(RUN, TARGET), "rb").read()
hdrsize = struct.unpack_from("<H", d, 8)[0] * 16
nreloc  = struct.unpack_from("<H", d, 6)[0]
reloff  = struct.unpack_from("<H", d, 0x18)[0]
img = d[hdrsize:]

# relocation entries -> where segment fixups live. Code is dense in fixups,
# data segments have almost none. Use fixup density to find the code/data split.
relocs = []
for k in range(nreloc):
    off, seg = struct.unpack_from("<HH", d, reloff + 4*k)
    relocs.append(seg * 16 + off)
relocs.sort()

BUCKET = 512
nb = (len(img) + BUCKET - 1)//BUCKET
dens = [0]*nb
for r in relocs:
    if 0 <= r < len(img):
        dens[r//BUCKET] += 1

# printable density per bucket
pr = [0]*nb
for i,b in enumerate(img):
    if 0x20 <= b <= 0x7e:
        pr[i//BUCKET] += 1

print("== %s ==  image=%d  relocs=%d" % (TARGET, len(img), nreloc))
print("bucket(512B)  offset   fixups  printable%  guess")
for i in range(nb):
    g = "CODE" if dens[i] >= 4 else ("DATA" if pr[i] > 300 else "-")
    bar = "#" * min(40, dens[i])
    print("  %4d      %7d  %5d   %4d%%  %-5s %s" % (i, i*BUCKET, dens[i], 100*pr[i]//BUCKET, g, bar))
