"""Wasit: bandingkan jejak EKSEKUSI nyata dengan rekonstruksi STATIS.

Semua pekerjaan penamaan sejauh ini bersifat statis -- membaca disassembly dan
menuntut dua bukti independen. Disiplin itu bisa konsisten dan tetap salah, karena
tak ada pembanding di luar dirinya sendiri.

comrun.py menjalankan EXE-nya sungguhan dan mencatat alamat mana yang benar-benar
dieksekusi. Berkas itu memberi tiga ukuran yang tak bisa dihasilkan pembacaan statis:

  1. Berapa rutin BERNAMA yang benar-benar dipanggil saat program berjalan
     -- nama yang tak pernah dieksekusi belum tentu salah, tapi belum teruji.
  2. Berapa situs panggilan jauh di kode pengguna yang benar-benar dijalankan,
     dan apakah semuanya ada dalam pernyataan yang saya pancarkan.
  3. Apakah ada alamat di kode pengguna yang DIEKSEKUSI tetapi tak pernah
     tersentuh penelusuran statis -- itu lubang nyata dalam rekonstruksi.
"""
import os,struct,re,collections,sys
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":26400,"PAC-GAL.EXE":12288,"HOPPER.EXE":7863}

T=sys.argv[1]; MAP=sys.argv[2]
E=CFG[T]
src=open("tools/emit2.py",encoding="utf-8").read()
m=re.search(re.escape('"%s":dict('%T)+r'.*?named=\{(.*?)\}\)',src,re.S)
named={int(a):b for a,b in re.findall(r'(\d+):"([^"]+)"',m.group(1))}
ms=re.search(re.escape('"%s":dict('%T)+r'.*?stub=\((\d+),(\d+)\)',src,re.S)
stub_lo,stub_hi=int(ms.group(1)),int(ms.group(2))

d=open(os.path.join(RUN,T),"rb").read()
img=d[struct.unpack_from("<H",d,8)[0]*16:]
nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
sites={}
for k in range(nrel):
    o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
    if r-3>=0 and img[r-3]==0x9A and r-3<E:
        sites[r-3]=struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]

ex=set(int(x,16) for x in open(MAP) if x.strip())
print("== %s =="%T)
print("alamat dieksekusi: %d"%len(ex))

# 1. rutin bernama yang benar-benar dijalankan
hidup=sorted({named[t] for s,t in sites.items() if s in ex and t in named})
mati=sorted(set(named.values())-set(hidup))
print("\n1. NAMA TERUJI SAAT BERJALAN: %d dari %d nama berbeda"%(len(hidup),len(set(named.values()))))
print("   terpanggil:", ", ".join(hidup))
print("   belum tersentuh jejak ini:", ", ".join(mati) if mati else "(tidak ada)")

# 2. situs panggilan jauh yang dieksekusi
sj=[s for s in sites if s in ex]
sj_named=[s for s in sj if sites[s] in named or stub_lo<=sites[s]<stub_hi]
print("\n2. SITUS PANGGILAN JAUH DIJALANKAN: %d dari %d"%(len(sj),len(sites)))
print("   di antaranya sudah bernama/stub: %d (%.1f%%)"%(len(sj_named),100.0*len(sj_named)/max(1,len(sj))))
tak=collections.Counter(sites[s] for s in sj if s not in sj_named)
if tak: print("   target dijalankan TANPA nama:", ", ".join("@%d x%d"%(t,c) for t,c in tak.most_common(8)))

# 3. byte kode pengguna yang dieksekusi tapi tak tersentuh penelusuran statis
stat=set()
for s in sites:
    for i in range(5): stat.add(s+i)
    if s+5<len(img) and img[s+5]==0xCC: stat.add(s+5)
ex_user=sorted(a for a in ex if a<E)
lolos=[a for a in ex_user if a not in stat]
print("\n3. ALAMAT KODE PENGGUNA DIEKSEKUSI: %d"%len(ex_user))
print("   bukan awal instruksi panggilan/INT3 (wajar -- itu setup argumen): %d"%len(lolos))
