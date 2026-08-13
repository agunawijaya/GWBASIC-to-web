"""Terbitkan .bas dari pernyataan tersegmentasi.

Bentuknya BASIC bernomor baris. BELUM bisa dijalankan — lihat kepala tiap berkas.
Nama berakhiran __maybe hanya punya SATU jenis bukti (disiplin DOS-Decompiler).
"""
import os,re,sys,collections

ROOT=r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
GAMES={"3DTTT":("3-D Tic-Tac-Toe","1984","LU's 3D Game"),
       "PAC-GAL":("Pac-Gal","1986","Al J. Jimenez"),
       "HOPPER":("Hopper","1991","klon Frogger")}

def render(stem):
    src=os.path.join(ROOT,stem,"statements.txt")
    lines=[l.rstrip() for l in open(src,encoding="utf-8")]
    body=[l for l in lines if re.match(r"^\s*\d+\s{2}",l)]
    title,year,note=GAMES[stem]
    nmaybe=sum(l.count("__maybe") for l in body)
    nunnamed=sum(len(re.findall(r"RT#\d+",l)) for l in body)
    out=[]
    out.append("' " + "="*68)
    out.append("' %s (%s) -- %s"%(title,year,note))
    out.append("' Rekonstruksi dari %s.EXE"%stem)
    out.append("'")
    out.append("' STATUS: BELUM BISA DIJALANKAN. Ini rendering terbaca dari")
    out.append("' %d pernyataan yang dipulihkan, bukan sumber yang bisa di-RUN."%len(body))
    out.append("'")
    out.append("' Yang HILANG PERMANEN dan tidak bisa dipulihkan siapa pun:")
    out.append("'   - nama variabel  -> tampil sebagai Vxxxx (alamat DGROUP)")
    out.append("'   - nomor baris asli -> penomoran di sini dibuat baru")
    out.append("'   - seluruh komentar REM")
    out.append("' Yang SELAMAT: tipe tiap variabel (% ! # $), dari deskriptor stub.")
    out.append("'")
    out.append("' Yang BELUM selesai di berkas ini:")
    out.append("'   - %d panggilan runtime masih RT#n tanpa nama"%nunnamed)
    out.append("'   - %d nama berakhiran __maybe: hanya SATU jenis bukti,"%nmaybe)
    out.append("'     belum memenuhi disiplin dua-bukti. Perlakukan sebagai dugaan.")
    out.append("'")
    out.append("' Bukti tiap nama: ../name-evidence.json")
    out.append("' " + "="*68)
    out.append("")
    n=1000
    for l in body:
        m=re.match(r"^\s*(\d+)\s{2}(.*)$",l)
        if not m: continue
        off,stmt=int(m.group(1)),m.group(2)
        stmt=stmt.replace(" : "," : ")
        out.append("%-6d %-84s ' @%d"%(n,stmt,off))
        n+=10
    return out,len(body),nunnamed,nmaybe

for stem in GAMES:
    out,nb,nu,nm=render(stem)
    dest=os.path.join(ROOT,stem,"%s.bas"%stem.lower())
    open(dest,"w",encoding="utf-8").write("\n".join(out))
    print("%-8s %5d baris pernyataan | %4d RT#n tanpa nama | %3d __maybe -> %s"
          %(stem,nb,nu,nm,os.path.relpath(dest,ROOT)))
