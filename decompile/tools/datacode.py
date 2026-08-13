"""Disassembly blok DATA HOPPER sebagai kode 8086.

Empat baris DATA di sumber BASIC aslinya, masing-masing 57 angka, di-POKE ke memori
lalu dipanggil lewat CALL ABSOLUTE. Ini rutin assembly yang ditanam di dalam program
BASIC untuk kecepatan.
"""
import os,re,struct,sys
from capstone import *

RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
md=Cs(CS_ARCH_X86,CS_MODE_16)

d=open(os.path.join(RUN,"HOPPER.EXE"),"rb").read()
hdr=struct.unpack_from("<H",d,8)[0]*16
img=d[hdr:]

# temukan kembali blok DATA
BLOCKS=[]
for m in re.finditer(rb"(?:\d{1,3},){7,}\d{1,3}", img):
    nums=[int(x) for x in m.group().split(b",")]
    if all(0<=n<=255 for n in nums):
        BLOCKS.append((m.start(), nums))

print("blok DATA ditemukan: %d"%len(BLOCKS))
for off,nums in BLOCKS:
    print("  @%-6d %3d angka"%(off,len(nums)))

out=["; " + "="*70,
     "; HOPPER.EXE -- blok DATA yang di-POKE lalu dipanggil CALL ABSOLUTE",
     ";",
     "; Empat baris DATA di sumber BASIC aslinya, %d byte total."%sum(len(n) for _,n in BLOCKS),
     "; Disassembly 8086 16-bit. Alamat relatif terhadap awal tiap blok --",
     "; alamat muat sebenarnya ditentukan VARPTR saat runtime, jadi target",
     "; lompatan absolut TIDAK bisa dipetakan tanpa mengetahui alamat itu.",
     "; " + "="*70, ""]

allb=b""
for i,(off,nums) in enumerate(BLOCKS,1):
    blob=bytes(nums)
    allb+=blob
    out.append("; ---- blok %d @image %d, %d byte ----"%(i,off,len(blob)))
    pc=0
    while pc<len(blob):
        try: ins=next(md.disasm(blob[pc:pc+16],pc,1))
        except StopIteration:
            out.append("  %4d  %-14s db 0x%02x"%(pc,"%02x"%blob[pc],blob[pc])); pc+=1; continue
        if ins.mnemonic=="(bad)":
            out.append("  %4d  %-14s db 0x%02x"%(pc,"%02x"%blob[pc],blob[pc])); pc+=1; continue
        out.append("  %4d  %-14s %-7s %s"%(ins.address,ins.bytes.hex(),ins.mnemonic,ins.op_str))
        pc=ins.address+ins.size
    out.append("")

# juga: coba sebagai SATU rutin bersambung
out.append("; ---- keempat blok disambung (%d byte) ----"%len(allb))
pc=0; nbad=0; nins=0
while pc<len(allb):
    try: ins=next(md.disasm(allb[pc:pc+16],pc,1))
    except StopIteration:
        out.append("  %4d  db 0x%02x"%(pc,allb[pc])); pc+=1; nbad+=1; continue
    if ins.mnemonic=="(bad)":
        out.append("  %4d  db 0x%02x"%(pc,allb[pc])); pc+=1; nbad+=1; continue
    out.append("  %4d  %-14s %-7s %s"%(ins.address,ins.bytes.hex(),ins.mnemonic,ins.op_str))
    nins+=1; pc=ins.address+ins.size

dest=os.path.join(ROOT,"HOPPER","data-blocks.asm")
open(dest,"w",encoding="utf-8").write("\n".join(out))
print("\nsambungan: %d instruksi, %d byte tak terdekode (%.0f%%)"%(nins,nbad,100*nbad/len(allb)))
print("-> %s"%os.path.relpath(dest,ROOT))
