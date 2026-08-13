"""Cari rutin runtime yang mengambil argumen SEBARIS dari aliran instruksi pemanggil.

Rutin semacam ini melakukan `pop si; pop ds` untuk mendapatkan alamat kembali, membaca
byte lewat `lodsb`/`lodsw`, lalu mendorong balik alamat yang sudah maju. Akibatnya byte
sesudah `lcall` 5-byte adalah DATA, bukan instruksi -- dan pembacaan yang tidak sadar
akan melenceng.

Uji dari SITUS PANGGILAN tidak bekerja dan sudah dibuang: byte nyasar hampir selalu
menyatu menjadi instruksi yang tetap masuk akal, jadi disassembly mulai s+5 terlihat
sama sehatnya dengan mulai s+6. Lihat NEGATIVE-RESULTS sec. 18.

Uji yang dipakai sekarang membaca TUBUH rutin: cari `pop <reg>; pop ds` di dekat entry
(mengambil alamat kembali jauh) yang diikuti `lodsb`/`lodsw`, lalu `push ds; push <reg>`
untuk mendorong balik alamat yang sudah maju. Pola itu tak punya tafsir lain.
"""
import os,struct,re,collections
from capstone import *
RUN=r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
md=Cs(CS_ARCH_X86,CS_MODE_16)
CFG={"3DTTT.EXE":26400,"PAC-GAL.EXE":12288,"HOPPER.EXE":7863}


src=open("tools/emit2.py",encoding="utf-8").read()
for T,E in CFG.items():
    d=open(os.path.join(RUN,T),"rb").read()
    img=d[struct.unpack_from("<H",d,8)[0]*16:]
    nrel=struct.unpack_from("<H",d,6)[0]; rof=struct.unpack_from("<H",d,0x18)[0]
    tal=collections.Counter()
    for k in range(nrel):
        o,s=struct.unpack_from("<HH",d,rof+4*k); r=s*16+o
        if r-3>=0 and img[r-3]==0x9A and r-3<E:
            tal[struct.unpack_from("<H",img,r)[0]*16+struct.unpack_from("<H",img,r-2)[0]]+=1
    print("== %s"%T); ada=0
    for tgt,c in sorted(tal.items()):
        pc=tgt; seq=[]; n=0
        while n<28:
            try: ins=next(md.disasm(img[pc:pc+16],pc,1))
            except StopIteration: break
            if ins.mnemonic=="(bad)": break
            seq.append((ins.mnemonic,ins.op_str)); n+=1
            if ins.mnemonic in("ret","retf","iret"): break
            pc=ins.address+ins.size
        # Alamat kembali jauh bisa dipanen ke ds:si ATAU es:di, dan byte sebarisnya
        # dibaca lewat lodsb ATAU mov al,es:[di]. Versi pertama alat ini hanya
        # mengenali bentuk ds:si+lodsb dan MELEWATKAN @21832 di HOPPER.
        popseg=any(seq[i][0]=="pop" and seq[i][1] in("ds","es") and i and seq[i-1][0]=="pop"
                   for i in range(len(seq)))
        baca=any(m.startswith("lods") or ("es:[di]" in o and m=="mov") for m,o in seq)
        simpan=any(m=="push" and o in("ds","es") for m,o in seq) or                any(m=="mov" and re.match(r"word ptr \[0x[0-9a-f]+\], (es|di|ds|si)$",o) for m,o in seq)
        if popseg and baca and simpan:
            print("   @%-6d %2d panggilan | pop <reg>;pop ds + lods + push ds = ARGUMEN SEBARIS"%(tgt,c)); ada+=1
    if not ada: print("   (tidak ada)")
