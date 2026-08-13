import os, struct, sys, json, re, collections
from capstone import *

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
OUT = r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile\HOPPER"
TARGET = "HOPPER.EXE"
d = open(os.path.join(RUN,TARGET),"rb").read()
hdr = struct.unpack_from("<H",d,8)[0]*16
cs  = struct.unpack_from("<H",d,0x16)[0]
ip  = struct.unpack_from("<H",d,0x14)[0]
img = d[hdr:]
md  = Cs(CS_ARCH_X86, CS_MODE_16); md.detail=True

calls = json.load(open("HOPPER_EXE_calls.json"))
tal   = {int(k):v for k,v in calls["tally"].items()}
rank  = {t:i+1 for i,(t,c) in enumerate(sorted(tal.items(), key=lambda kv:-kv[1]))}

# identifications established so far (evidence in entrypoints.md)
NAME = {
 13135:"FAC.LOAD.SGL      ; load 4-byte single from [si] into FAC(DG+B2)",
 13109:"FAC.STORE.SGL     ; store FAC(DG+B2) into es:[di]",
 13112:"SGL.COPY          ; copy 4-byte single [si] -> es:[di]",
  9359:"FAC.LOAD.ALT      ; load into FAC then tail-jump (variant)",
  9671:"FAC.LOAD.ALT2     ; load into FAC then tail-jump (variant)",
 18322:"SGL.ARITH.2OP     ; two 4-byte operands [si],[di] -- arith/compare",
  9370:"MBF.UNPACK        ; unpack MBF mantissa+implicit bit (arith core)",
 23248:"STMT.RESET        ; clear 3 state vars (statement/print-state reset)",
 21569:"ERRFRAME+LOAD4    ; save SP for ON ERROR, load 4 bytes from [si]",
 21497:"BH.FLAGS.9000     ; flag/coordinate helper (ax=9000h | bh)",
 12954:"ERRFRAME+CALL     ; save SP, guarded call (I/O-ish)",
 11523:"STR.OP.LEN37      ; string op, length bounded at 25h, dest DG+880",
}

START=cs*16+ip; END=7863
lines=[]
lines.append("; ------------------------------------------------------------------")
lines.append("; HOPPER.EXE  --  annotated disassembly of the COMPILED BASIC program")
lines.append("; user code %d..%d  (the rest of the image is the BASCOM runtime)" % (START,END))
lines.append("; RT#n = runtime entry point, ranked by call frequency")
lines.append("; ------------------------------------------------------------------")
lines.append("")
pc=START; n=0
while pc<END and pc<len(img):
    try: ins=next(md.disasm(img[pc:pc+16],pc,1))
    except StopIteration:
        lines.append("%6d  %-14s db 0x%02x" % (pc, "%02x"%img[pc], img[pc])); pc+=1; continue
    n+=1
    note=""
    if ins.mnemonic=="lcall":
        mm=re.match(r"0x([0-9a-f]+), 0x([0-9a-f]+)", ins.op_str)
        if mm:
            t=int(mm.group(1),16)*16+int(mm.group(2),16)
            note="   ; RT#%-3s %s" % (rank.get(t,"?"), NAME.get(t,""))
    lines.append("%6d  %-14s %-7s %-22s%s" % (ins.address, ins.bytes.hex(), ins.mnemonic, ins.op_str, note))
    pc=ins.address+ins.size
open(os.path.join(OUT,"user-code.asm"),"w",encoding="utf-8").write("\n".join(lines))
print("user-code.asm: %d instructions" % n)

# ---- entrypoints.md ----------------------------------------------------
fp2 = json.load(open("HOPPER_EXE_fp2.json"))
md2=["# HOPPER.EXE — peta entry point runtime BASCOM","",
 "776 far call tervalidasi (dicocokkan dengan tabel relokasi), **117 entry point unik**,",
 "semuanya ke segmen runtime `0247`. Tabel di bawah urut menurut frekuensi panggilan.","",
 "| RT# | target | panggilan | kumulatif | identifikasi | bukti |","|---|---|---|---|---|---|"]
tot=sum(tal.values()); cum=0
for rec in fp2:
    r,t,c,f = rec[0],rec[1],rec[2],rec[3]
    cum+=c
    nm=NAME.get(t,"")
    nm_short=nm.split(";")[0].strip() if nm else "*belum diidentifikasi*"
    ev=f["head"][:78].replace("|","\\|")
    md2.append("| %d | %d | %d | %.1f%% | %s | `%s` |" % (r,t,c,100*cum/tot,nm_short,ev))
md2 += ["", "26 entry point teratas menutup **%.0f%%** dari seluruh panggilan." % (100*cum/tot),
        "", "## Cara membacanya", "",
        "BASCOM menerjemahkan tiap operasi BASIC jadi *setup argumen pendek + satu far call*.",
        "Jadi barisan `RT#` di `user-code.asm` pada dasarnya adalah program BASIC-nya,",
        "hanya masih memakai nomor rutin alih-alih nama pernyataan.",""]
open(os.path.join(OUT,"entrypoints.md"),"w",encoding="utf-8").write("\n".join(md2))
print("entrypoints.md written")

# ---- assets.md ---------------------------------------------------------
a=json.load(open("HOPPER_EXE_assets.json"))
am=["# HOPPER.EXE — aset yang selamat dari proses compile","",
"Semua di bawah ini terpulihkan **verbatim** dari biner: tidak perlu direkonstruksi.","",
"## String game", ""]
GAME=[(o,s) for o,s in a["text"] if o>=29600]
for o,s in GAME: am.append("- `@%d` — `%s`" % (o,s))
am += ["","## String DRAW (grafik sprite/latar)","",
"Bisa langsung dipakai ulang di `DRAW` GW-BASIC dan menghasilkan gambar identik.",""]
for o,s in a["draw"]: am.append("- `@%d`\n  ```\n  %s\n  ```" % (o,s))
am += ["","## String PLAY (musik)",""]
for o,s in a["play"]+[(30922,"P2L8C.CL16CL8D.GL16FL8EL4C")]:
    if o>=29600: am.append("- `@%d` — `%s`" % (o,s))
am += ["","## Blok DATA (kode mesin yang di-POKE lalu CALL ABSOLUTE)","",
"Empat blok, masing-masing 57 angka (228 total). Ini rutin assembly yang ditanam",
"di dalam sumber BASIC aslinya sebagai baris `DATA` — sprite mover / scroller.",""]
for o,s in a["data"]:
    am.append("- `@%d` (%d angka)\n  ```\n  %s\n  ```" % (o, s.count(",")+1, s))
open(os.path.join(OUT,"assets.md"),"w",encoding="utf-8").write("\n".join(am))
print("assets.md written")
