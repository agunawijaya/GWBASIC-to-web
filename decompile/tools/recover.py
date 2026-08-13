"""Rekompilasi kode pengguna BASCOM menjadi BASIC yang BISA DI-RUN.

emit2.py merender keadaan register apa adanya. Modul ini menjalankan interpretasi
abstrak atas aliran instruksi yang sudah selaras (ir.py), menyusun EKSPRESI, lalu
menerbitkan pernyataan BASIC bernomor baris yang lolos parser GW-BASIC.

Model mesin yang dipulihkan
---------------------------
  bilangan bulat  variabel DGROUP langsung; aritmetikanya inline x86
  string          deskriptor 4 byte (len:word, ptr:word) di alamat DGROUP
  single/double   akumulator FAC; operan lewat INDEKS SEBARIS (variabel/temp compiler)
                  atau lewat di (konstanta MBF di DGROUP)

Nilai register yang menyeberangi batas blok dimaterialkan menjadi variabel bantu lewat
analisis liveness -- tanpa itu, penghitung gelung FOR yang dinaikkan di satu blok dan
disimpan di blok lain akan terbaca sebagai nol.

Nama variabel asli hilang permanen; yang diterbitkan adalah nama sintetis yang KONSISTEN.
Itu yang dibutuhkan supaya program berjalan, bukan supaya terlihat sama dengan aslinya.
"""
import re, sys, struct, collections
import ir
import operands
from operands import fmtnum

REGS = ("ax", "bx", "cx", "dx", "si", "di")

PREC = {"or": 1, "and": 2, "rel": 3, "+": 4, "-": 4, "*": 5, "/": 5, "\\": 5,
        "unary": 6, "atom": 7}


class E:
    __slots__ = ("s", "p")

    def __init__(self, s, p="atom"):
        self.s, self.p = s, p

    def par(self, need):
        return "(%s)" % self.s if PREC[self.p] < PREC[need] else self.s

    def __repr__(self):
        return self.s


def bin(a, op, b, p):
    return E("%s %s %s" % (a.par(p), op, b.par(p)), p)


def num(v):
    return E(str(v) if v >= 0 else "(%d)" % v, "atom")


def s16(v):
    return v - 0x10000 if v >= 0x8000 else v


class Names:
    """Namespace sintetis yang aman untuk GW-BASIC: huruf awal lalu digit saja,
    sehingga mustahil memuat kata kunci sebagai substring."""

    def __init__(self):
        self.i, self.s, self.f, self.a = {}, {}, {}, {}
        self._n = collections.Counter()

    def _mk(self, pfx, sfx):
        self._n[pfx] += 1
        return "%s%d%s" % (pfx, self._n[pfx], sfx)

    def integer(self, addr):
        if addr not in self.i:
            self.i[addr] = self._mk("I", "%")
        return self.i[addr]

    def string(self, addr):
        if addr not in self.s:
            self.s[addr] = self._mk("S", "$")
        return self.s[addr]

    def fac(self, slot, ty):
        k = (slot, ty)
        if k not in self.f:
            self.f[k] = self._mk("F" if ty == "!" else "D", ty)
        return self.f[k]

    def arr(self, base, ty="%"):
        if base not in self.a:
            self.a[base] = self._mk("J" if ty == "%" else "G", ty)
        return self.a[base]


JCC = {"je": "=", "jz": "=", "jne": "<>", "jnz": "<>",
       "jl": "<", "jnge": "<", "jle": "<=", "jng": "<=",
       "jg": ">", "jnle": ">", "jge": ">=", "jnl": ">=",
       "jb": "<", "jc": "<", "jbe": "<=", "ja": ">", "jae": ">=", "jnc": ">=",
       "js": "<", "jns": ">="}

MEMW = r"word ptr \[(0x[0-9a-f]+)\]"
# Compiler menumpahkan alamat deskriptor string ke bingkai tumpukan. Tanpa dimodelkan,
# `mov bx, [bp-6]` terbaca nol dan ubin labirin terbit sebagai CHR$(0) -- tak terlihat
# di layar, sehingga baris labirin memendek dan dinding kanannya bergeser.
BPLOC = re.compile(r"^word ptr \[bp ([-+]) (0x[0-9a-f]+|\d+)\]$")
IDXW = r"word ptr \[(di|si|bx) \+ (0x[0-9a-f]+)\]"


class Rec:
    def __init__(self, stem):
        self.stem = stem
        self.p = ir.Prog(stem)
        self.O = operands.Ops(self.p)
        self.N = Names()
        self.st = self.p.stream()
        self.byaddr = {a: (k, v) for a, k, v in self.st}
        self.unhandled = collections.Counter()
        self.blk = self._blocks()
        self.index = {a: i for i, (a, b) in enumerate(self.blk)}
        self.svars = self.string_vars()
        self.gfxarr = set()
        self.strops = self.string_ops()
        self.omodes = self.open_modes()
        self.itypes = None   # diisi malas: butuh fvars
        self.fvars = self.float_vars()
        # `LOAD!` ternyata dua rutin berbeda dengan satu nama. Yang tubuhnya membaca
        # [si+2]/[si] lalu mendenormalisasi mantissa MENGONVERSI float ke integer di bx
        # (dengan pembulatan `adc bx,0` dan tanda `neg bx`) -- itu CINT, bukan pemuat
        # FAC. Yang tubuhnya `mov di,<FAC>; movsw...` barulah pemuat FAC. Dibedakan
        # dari BENTUK TUBUH, bukan dari namanya.
        # Rutin aritmetika punya BEBERAPA entry dengan konvensi operan berbeda, dan
        # tabel nama menyebut semuanya "ADD!". Yang membedakan terlihat di dua-tiga
        # instruksi pertama: entry yang menyetel si=<FAC> berarti FAC operan KIRI,
        # yang menyetel di=<FAC> berarti FAC operan KANAN, sisanya memakai si dan di
        # dari pemanggil. Tanpa pemisahan ini sebuah `FAC + konst` terbaca sebagai
        # `[si] + [di]` dan hasil perhitungan sebelumnya (mis. SCALE2! x16) hilang.
        self.facside = {}
        for t, nm in self.p.named.items():
            if re.match(r"^(ADD|SUB|MUL|DIV|FCMP|ARITH)[!#]$", nm):
                for i in self.p._body(t, 3):
                    g = re.match(r"^(si|di), (0x[0-9a-f]+)$", i.op_str)
                    if i.mnemonic == "mov" and g and int(g.group(2), 16) < 0x200:
                        self.facside[t] = g.group(1)
                        break
        self.load_int = set()
        for t, nm in self.p.named.items():
            if re.match(r"^(LOAD|FACLOAD)[!#]$", nm):
                body = self.p._body(t, 8)
                if not any(i.mnemonic.startswith("movs") for i in body):
                    self.load_int.add(t)

    # ---------------------------------------------------------- segmentasi
    def _leaders(self):
        L = {26}
        for a, k, v in self.st:
            if k == "insn":
                m, o = v.mnemonic, v.op_str
                t = re.match(r"^0x([0-9a-f]+)$", o)
                if t and (m.startswith("j") or m in ("loop", "call")):
                    tgt = int(t.group(1), 16)
                    if 26 <= tgt < self.p.end:
                        L.add(tgt)
                    L.add(a + v.size)
                if m in ("ret", "retf", "int3"):
                    L.add(a + v.size)
            elif k == "call":
                tgt, nm, raw = v
                if nm == "GOSUB" and len(raw) >= 2:
                    L.add(struct.unpack_from("<H", raw, 0)[0])
                elif nm in ("ON_GOSUB", "ON_GOTO") and raw:
                    for j in range(raw[0]):
                        L.add(struct.unpack_from("<H", raw, 1 + 2 * j)[0])
                if nm in ("GOSUB", "ON_GOSUB", "ON_GOTO", "RETURN"):
                    L.add(a + 5 + len(raw))
        return sorted(x for x in L if 26 <= x < self.p.end)

    def _blocks(self):
        L = self._leaders()
        return [(a, L[i + 1] if i + 1 < len(L) else self.p.end) for i, a in enumerate(L)]

    def _succ(self, lo, hi):
        """Penerus sebuah blok, untuk analisis liveness."""
        out = []
        last = None
        for a in range(lo, hi):
            e = self.byaddr.get(a)
            if e:
                last = (a, e)
        fall = True
        if last:
            a, (k, v) = last
            if k == "insn":
                m, o = v.mnemonic, v.op_str
                t = re.match(r"^0x([0-9a-f]+)$", o)
                if m == "jmp":
                    fall = False
                    if t:
                        out.append(int(t.group(1), 16))
                elif m in ("ret", "retf"):
                    fall = False
                elif t and (m.startswith("j") or m == "loop"):
                    out.append(int(t.group(1), 16))
                elif m == "call" and t:
                    out.append(int(t.group(1), 16))
            elif k == "call":
                tgt, nm, raw = v
                if nm == "RETURN":
                    fall = False
                elif nm == "GOSUB" and len(raw) >= 2:
                    out.append(struct.unpack_from("<H", raw, 0)[0])
                elif nm in ("ON_GOSUB", "ON_GOTO") and raw:
                    for j in range(raw[0]):
                        out.append(struct.unpack_from("<H", raw, 1 + 2 * j)[0])
        if fall and hi < self.p.end:
            out.append(hi)
        return [x for x in out if x in self.index]

    # ---------------------------------------------------------- konvensi rutin
    READS = {
        "LET$": ("bx", "dx"), "CONCAT$": ("bx", "ax"), "STRCMP": ("bx", "ax"),
        "STRING$_C": ("bx", "dx"), "STRING$_S": ("bx", "dx"), "LEFT$": ("dx",), "RIGHT$": ("dx",),
        "MID$": ("dx", "cx"), "INSTR": ("bx", "dx"),
        "LINE": ("bx", "dx", "cx"), "OPEN": ("bx", "dx"), "CLOSE": (), "PRINT_USING": ("bx",), "EOF": ("bx",), "STICK": ("bx",),
        "RT_HEAPINIT": (), "RT_STMTCTX": (), "RANDOMIZE": ("bx",),
        "SGN": ("si",), "CALL_VAR": ("ax",), "TAB": ("bx",),
        "ON_ERROR": ("bx",), "ON_ERROR_OFF": (), "PAINT": ("bx", "dx", "cx"),
        "WIDTH": ("bx",), "PRINT#": ("bx",), "OPEN_MODE$": ("bx",), "OPEN_MODE": ("bx",),
        "SPC": ("bx",), "END_STMT": (), "INPUT#_BEGIN": ("bx",), "LINE_BF": ("bx", "dx", "cx"),
        "GFXPT": ("bx", "dx"), "GFXSTART": ("bx", "dx"), "GET": ("bx",), "PSET": ("bx", "dx"), "ARITH!": ("si", "di"), "SCREEN": ("bx", "dx"), "SOUND": ("bx", "dx"),
        "PRINT_BEGIN": (), "RETURN": (), "CLS": (), "TIME$": (), "INKEY$": (),
        "TRAP_INIT": (), "KEY_DISPLAY": (), "KEY_LIST": (), "KEY_ASSIGN": ("bx", "dx"),
        # Rutin di bawah ini TIDAK membaca bx: targetnya sebaris, atau operannya
        # FAC/si/di. Menandainya membaca bx membuat hampir setiap nilai bx hidup
        # sampai akhir blok, dan penugasan bantu X2% sendirian memakan 12% berkas.
        "GOSUB": (), "CINT": (), "CINT#": (), "ARITH!": ("si", "di"),
        "SGNTEST": (), "SGNTEST_FAC": (), "FACTEST": (), "FACNORM": (),
        "NONZERO!": (), "NONZERO#": (), "NONZERO!_FAC": (),
        "DEF_SEG": (), "INPUT_ITEM": (),
        "ARG_C": (), "CSRLIN": (), "POS": (), "FACNORM": (), "STKPOP": (),
        "INT2SGL": ("bx",), "GFXSTART": (),
    }

    # Nama yang penanganannya BENAR-BENAR memakai bx. Daftar putih, bukan daftar
    # hitam: semula bawaannya "semua rutin membaca bx", dan itu membuat hampir setiap
    # nilai bx hidup sampai akhir blok. Akibatnya X2% ditugasi 356 kali tetapi hanya
    # dibaca 63 kali di 3DTTT, dan X6% 25 kali tanpa pernah dibaca sekali pun.
    PAKAI_BX = {
        "LOCATE", "COLOR", "COLOR_FG", "COLOR_BG", "CHR$", "LET$", "PLAY", "SOUND",
        "ON_GOTO", "ON_GOSUB", "SCREEN", "SCREEN_STMT", "SCREEN_A", "SCREEN_B", "LEN", "ASC", "STRCMP",
        "INT2SGL", "RND", "RANDOMIZE", "STR$", "STRTEMP", "INPUT_DONE", "DEF_SEG=",
        "STRING$", "STRING$_C", "STRING$_S", "CONCAT$", "READ!", "READ#", "READ%",
        "READ$", "KEY_ONOFF", "KEY_DISPLAY", "KEY_LIST",
        "ON_KEY_GOSUB", "CALL_ABS", "PSET", "PUT", "DRAW", "GFXPT", "GFX2PT",
        "OPEN_MODE", "OPEN_MODE$", "PRINT#", "LINE_INPUT", "INPUT$", "CLEAR",
    }

    def reads(self, nm):
        """Register yang dikonsumsi rutin ini, dari sudut pandang KELUARAN kita.

        Rutin tak dikenal tidak menerbitkan apa pun selain catatan REM, jadi nilai
        yang mengalir ke sana mati."""
        if nm is None or nm.startswith("@"):
            return ()
        if nm.endswith("_FAC"):
            return ("di",)
        if nm in self.READS:
            return self.READS[nm]
        if nm.startswith("PRINT<"):
            return ("bx",)
        return ("bx",) if nm in self.PAKAI_BX else ()

    # ---------------------------------------------------------- variabel string
    def string_vars(self):
        """Alamat yang PERNAH ditulis sebagai variabel string.

        Tanpa ini, deskriptor variabel yang kebetulan menunjuk teks sah akan terbaca
        sebagai literal -- dan sebuah variabel akan tercetak sebagai isinya saat itu."""
        sv = set()
        R = {}
        for a, k, v in self.st:
            if k == "insn":
                g = re.match(r"^(dx|bx), (0x[0-9a-f]+|\d+)$", v.op_str)
                if v.mnemonic == "mov" and g:
                    R[g.group(1)] = int(g.group(2), 0)
                elif re.match(r"^(dx|bx)\b", v.op_str):
                    R.pop(v.op_str[:2], None)
            elif k == "call":
                nm = v[1]
                if nm == "LET$" and "dx" in R:
                    sv.add(R["dx"])
                R.pop("dx", None)
        return sv

    # ---------------------------------------------------------- src/dst
    @staticmethod
    def _regs_in(s):
        return {r for r in REGS if re.search(r"\b%s\b" % r, s)}

    def srcdst(self, m, o):
        if BPLOC.search(o or ""):
            # operan lokal bingkai tumpukan bukan register; hanya sisi lainnya dihitung
            o = BPLOC.sub("", o)
        """Register yang DIBACA dan yang DITULIS satu instruksi.

        Membaca 'mov bx, 0xa60' sebagai pembacaan bx (karena bx muncul di operan)
        membuat bx tampak hidup di seluruh program dan membanjiri keluaran dengan
        penugasan bantu palsu. Tujuan murni-tulis harus dipisahkan."""
        parts = [x.strip() for x in o.split(",", 1)] if o else []
        if m == "mov" and len(parts) == 2:
            d, s = parts
            if d in REGS:
                return self._regs_in(s), {d}
            return self._regs_in(d) | self._regs_in(s), set()
        if m in ("add", "sub", "and", "or", "xor", "shl", "shr", "sar",
                 "adc", "sbb", "rcl", "ror") and len(parts) == 2:
            d, s = parts
            if d in REGS:
                return {d} | self._regs_in(s), {d}
            return self._regs_in(d) | self._regs_in(s), set()
        if m in ("cmp", "test") and len(parts) == 2:
            return self._regs_in(parts[0]) | self._regs_in(parts[1]), set()
        if m in ("inc", "dec", "neg", "not"):
            return (({o}, {o}) if o in REGS else (self._regs_in(o), set()))
        if m == "xchg" and len(parts) == 2:
            rs = self._regs_in(o)
            return rs, rs & set(REGS)
        if m == "imul":
            return {"ax"} | self._regs_in(o), {"ax", "dx"}
        if m == "push":
            return self._regs_in(o), set()
        if m == "pop":
            return set(), ({o} if o in REGS else set())
        if m in ("lodsb", "lodsw"):
            return {"si"}, {"ax", "si"}
        if m in ("stosb", "stosw"):
            return {"ax", "di"}, {"di"}
        if m in ("movsb", "movsw"):
            return {"si", "di"}, {"si", "di"}
        return self._regs_in(o), set()

    # Rutin yang operannya PASTI string, beserta register pembawanya.
    STROP = {"LEN": ("bx",), "ASC": ("bx",), "STRCMP": ("bx", "ax"),
             "CONCAT$": ("bx", "ax"), "LET$": ("bx", "dx"), "PLAY": ("bx",),
             "DRAW": ("bx",), "INSTR": ("bx", "dx"), "STRING$_S": ("dx",)}

    def string_ops(self):
        """Alamat yang pernah dipakai sebagai OPERAN string.

        Dipakai khusus untuk menentukan tipe tujuan INPUT. Byte tipe sebaris melewati
        tabel `xlat` di ruang data runtime yang tak terbaca dari citra, jadi kode tipe
        3DTTT (7) tak terpetakan. Cara pemakaian variabel itu sendiri yang menjawab:
        `LEN` diterapkan pada tujuan INPUT @12578, maka ia string.

        SENGAJA terpisah dari `svars`: himpunan ini juga memuat literal, dan memakainya
        di `_strsrc` akan membuat literal terbaca sebagai variabel."""
        sv, R = set(), {}
        for a, k, v in self.st:
            if k == "insn":
                g = re.match(r"^(ax|bx|cx|dx|si|di), (0x[0-9a-f]+|\d+)$", v.op_str)
                if v.mnemonic == "mov" and g:
                    R[g.group(1)] = int(g.group(2), 0)
                    continue
                g = re.match(r"^(ax|bx|cx|dx|si|di), (ax|bx|cx|dx|si|di)$", v.op_str)
                if v.mnemonic == "mov" and g:
                    if g.group(2) in R:
                        R[g.group(1)] = R[g.group(2)]
                    else:
                        R.pop(g.group(1), None)
                    continue
                d = re.match(r"^(ax|bx|cx|dx|si|di)\b", v.op_str)
                if d and v.mnemonic not in ("push", "cmp", "test"):
                    R.pop(d.group(1), None)
            elif k == "call":
                nm = v[1] or ""
                for r in self.STROP.get(nm, ()):
                    if r in R:
                        sv.add(R[r])
                if nm.startswith("PRINT<$"):
                    if "bx" in R:
                        sv.add(R["bx"])
        return sv

    def input_types(self):
        """Petakan byte tipe SEBARIS milik INPUT_ITEM ke tipe BASIC, secara empiris.

        Byte itu melewati tabel `xlat` yang ada di ruang data runtime dan tak terbaca
        dari citra berkas, jadi kode 3DTTT (7) tidak terpetakan oleh tabel stub. Tetapi
        sebagian tujuan INPUT terpakai di tempat lain dengan cara yang menentukan --
        `LEN` diterapkan padanya, misalnya. Dari pasangan itu kodenya bisa dipelajari,
        lalu diterapkan ke tujuan yang pemakaiannya tidak menentukan.

        Persis pola yang dipakai memecahkan DELTA deskriptor string: satu besaran tak
        terbaca, disimpulkan dari kasus-kasus yang konsisten."""
        suara = collections.defaultdict(collections.Counter)
        R, kode = {}, None
        for a, k, v in self.st:
            if k == "insn":
                g = re.match(r"^(ax|bx|cx|dx|si|di), (0x[0-9a-f]+|\d+)$", v.op_str)
                if v.mnemonic == "mov" and g:
                    R[g.group(1)] = int(g.group(2), 0)
                elif re.match(r"^(ax|bx|cx|dx|si|di)\b", v.op_str) and \
                        v.mnemonic not in ("push", "cmp", "test"):
                    R.pop(v.op_str[:2], None)
            elif k == "call":
                nm, raw = v[1] or "", v[2]
                if nm == "INPUT_ITEM" and len(raw) > 1:
                    kode = raw[1]
                elif nm == "INPUT_DONE" and kode is not None and "bx" in R:
                    a2 = R["bx"]
                    if a2 in self.svars or a2 in self.strops:
                        suara[kode]["$"] += 1
                    elif a2 in self.fvars:
                        suara[kode]["!"] += 1
        return {k: c.most_common(1)[0][0] for k, c in suara.items() if c}

    def open_modes(self):
        """Mode tiap situs OPEN, disimpulkan dari PEMAKAIANNYA.

        Sandi angka mode (cx) tidak terbaca dari citra, dan menebaknya salah: satu
        berkas terbuka sebagai "I" lalu ditulisi PRINT#, yang berakhir `Bad file mode`.
        Yang menentukan justru apa yang mengikuti OPEN itu -- PRINT# berarti keluaran,
        INPUT# berarti masukan. Bila tak ada keduanya sebelum OPEN/CLOSE berikutnya,
        situsnya dibiarkan memakai peta angka (idiom "buka untuk menguji lalu tutup").
        """
        urut = [(a, v[1] or "") for a, k, v in self.st if k == "call"]
        mode = {}
        for i, (a, nm) in enumerate(urut):
            if nm != "OPEN":
                continue
            for j in range(i + 1, min(i + 40, len(urut))):
                n2 = urut[j][1]
                if n2 in ("OPEN", "CLOSE"):
                    break
                if n2 == "PRINT#":
                    mode[a] = '"O"'
                    break
                if n2 == "INPUT#_BEGIN":
                    mode[a] = '"I"'
                    break
        return mode

    # ---------------------------------------------------------- variabel float
    def data_table(self):
        """Nilai `DATA` program, diambil dari DGROUP.

        Rutin READ (@19947) menelusuri teks lewat penunjuk di [0x6ac], memisah pada
        koma (0x2C), dan berhenti di NUL -- jadi DATA disimpan sebagai TEKS berkoma,
        bukan sebagai angka biner. Empat deret 57 angka di HOPPER persis cocok dengan
        klaim DATA-BLOCKS.md: 228 byte rutin assembly yang di-POKE lalu dipanggil,
        diawali `235,18,144` = `jmp short +18; nop`."""
        out = []
        # ambang 4 nilai: cukup ketat untuk menolak angka lepas di DGROUP, cukup
        # longgar untuk menangkap baris DATA terakhir HOPPER yang hanya berisi
        # `255,7,31,203`. Dengan itu totalnya 232 nilai -- gelung READ/POKE-nya
        # membaca 231, jadi empat blok 57 nilai saja (228) kurang.
        for m in re.finditer(rb"[0-9]+(?:,[0-9]+){3,}", self.p.dg):
            teks = m.group().decode()
            out.append((m.start(), [int(x) for x in teks.split(",")]))
        out.sort()
        return out

    def float_vars(self):
        """Alamat DGROUP yang pernah menjadi TUJUAN penyimpanan FAC.

        HOPPER dan 3DTTT memberi operan float lewat si/di sebagai ALAMAT, bukan lewat
        indeks sebaris seperti PAC-GAL. Alamat yang tak pernah ditulis adalah konstanta
        MBF; yang pernah ditulis adalah variabel. Tanpa pemisahan ini, sebuah variabel
        akan terbaca sebagai bilangan mati hasil dekode citra berkas."""
        fv, R = set(), {}
        for a, k, v in self.st:
            if k == "insn":
                # Alamat tujuan tidak selalu tiba sebagai immediate langsung ke
                # di: HOPPER menitipkannya lewat `mov bx, di` ... `mov di, bx`.
                # Melacak immediate saja membuat variabel itu lolos dan terbaca
                # sebagai KONSTANTA -- nilainya lalu didekode dari citra berkas
                # sebagai angka raksasa, dan CINT-nya meluap.
                g = re.match(r"^(ax|bx|cx|dx|si|di), (0x[0-9a-f]+|\d+)$", v.op_str)
                if v.mnemonic == "mov" and g:
                    R[g.group(1)] = int(g.group(2), 0)
                    continue
                g = re.match(r"^(ax|bx|cx|dx|si|di), (ax|bx|cx|dx|si|di)$", v.op_str)
                if v.mnemonic == "mov" and g:
                    if g.group(2) in R:
                        R[g.group(1)] = R[g.group(2)]
                    else:
                        R.pop(g.group(1), None)
                    continue
                d = re.match(r"^(ax|bx|cx|dx|si|di)\b", v.op_str)
                if d and v.mnemonic not in ("push", "cmp", "test"):
                    R.pop(d.group(1), None)
            elif k == "call":
                nm = v[1] or ""
                # hanya bila di DISETEL sejak panggilan terakhir. Register bertahan
                # lintas panggilan, jadi di yang basi dari operan rutin sebelumnya
                # akan menandai KONSTANTA sebagai variabel -- itu yang membuat
                # konstanta langkah 1 di 3DTTT terbaca sebagai variabel.
                if re.match(r"^(FACSTORE|LET)[!#]$", nm) and "di" in R and not v[2]:
                    fv.add(R["di"])
                # READ dan INPUT juga MENULIS variabel float, lewat bx. Tanpa ini
                # targetnya dianggap konstanta dan didekode dari citra berkas --
                # nilai raksasa yang membuat CINT meluap di gelung POKE HOPPER.
                if re.match(r"^(READ[!#]|INPUT_DONE)$", nm) and "bx" in R:
                    fv.add(R["bx"])
                R.pop("di", None)
                R.pop("si", None)
        return fv

    # ---------------------------------------------------------- konstanta masuk
    def const_regs(self):
        """Nilai IMMEDIATE register yang berlaku di awal tiap blok.

        Tanpa ini, alamat deskriptor string yang disetel di satu blok lalu dipakai di
        blok berikutnya hanya tersisa sebagai variabel bantu integer, dan `ASC(S$)`
        terbit sebagai `ASC(X4%)` -- Type mismatch. Analisis maju biasa: nilai masuk
        adalah nilai yang DISEPAKATI semua pendahulu, selain itu tak diketahui."""
        def transfer(lo, hi, st0):
            R = dict(st0)
            for a in range(lo, hi):
                e = self.byaddr.get(a)
                if not e:
                    continue
                k, v = e
                if k != "insn":
                    continue
                m, o = v.mnemonic, v.op_str
                g = re.match(r"^(ax|bx|cx|dx|si|di), (0x[0-9a-f]+|\d+)$", o)
                if m == "mov" and g:
                    R[g.group(1)] = int(g.group(2), 0)
                    continue
                if m == "mov":
                    d, _, rest = o.partition(", ")
                    kd, ks = self.bpkey(d), self.bpkey(rest)
                    if kd:
                        if rest in R:
                            R[kd] = R[rest]
                        else:
                            try:
                                R[kd] = int(rest, 0)
                            except ValueError:
                                R.pop(kd, None)
                        continue
                    if ks and d in REGS:
                        if ks in R:
                            R[d] = R[ks]
                        else:
                            R.pop(d, None)
                        continue
                g = re.match(r"^(ax|bx|cx|dx|si|di), (ax|bx|cx|dx|si|di)$", o)
                if m == "mov" and g:
                    if g.group(2) in R:
                        R[g.group(1)] = R[g.group(2)]
                    else:
                        R.pop(g.group(1), None)
                    continue
                _, dsts = self.srcdst(m, o)
                for d in dsts:
                    R.pop(d, None)
            return R

        pred = collections.defaultdict(list)
        for a, b in self.blk:
            for x in self._succ(a, b):
                pred[x].append(a)
        ins = {a: {} for a, _ in self.blk}
        outs = {a: {} for a, _ in self.blk}
        first = self.blk[0][0]
        for _ in range(12):
            ch = False
            for a, b in self.blk:
                if a == first:
                    new = {}
                else:
                    ps = pred.get(a, [])
                    if not ps:
                        new = {}
                    else:
                        new = dict(outs[ps[0]])
                        for q in ps[1:]:
                            oq = outs[q]
                            new = {k: v for k, v in new.items()
                                   if k in oq and oq[k] == v}
                if new != ins[a]:
                    ins[a] = new
                    ch = True
                o = transfer(a, b, new)
                if o != outs[a]:
                    outs[a] = o
                    ch = True
            if not ch:
                break
        return ins

    # ---------------------------------------------------------- liveness
    def liveness(self):
        use, de = {}, {}
        for lo, hi in self.blk:
            u, d = set(), set()
            for a in range(lo, hi):
                e = self.byaddr.get(a)
                if not e:
                    continue
                k, v = e
                if k != "insn":
                    if k == "call":
                        # hanya register yang BENAR-BENAR dikonsumsi rutin ini.
                        # Menandai keempatnya tanpa pandang bulu membuat hampir setiap
                        # bx hidup sampai akhir blok dan membanjiri keluaran dengan
                        # penugasan bantu yang tak pernah dipakai.
                        for r in self.reads(v[1]):
                            if r not in d:
                                u.add(r)
                        d.add("ax")
                    continue
                srcs, dsts = self.srcdst(v.mnemonic, v.op_str)
                for r in srcs:
                    if r not in d:
                        u.add(r)
                d |= dsts
            use[lo], de[lo] = u, d
        succ = {lo: self._succ(lo, hi) for lo, hi in self.blk}
        live_in = {lo: set() for lo, _ in self.blk}
        live_out = {lo: set() for lo, _ in self.blk}
        for _ in range(40):
            ch = False
            for lo, hi in reversed(self.blk):
                o = set()
                for s in succ[lo]:
                    o |= live_in[s]
                i = use[lo] | (o - de[lo])
                if o != live_out[lo] or i != live_in[lo]:
                    live_out[lo], live_in[lo] = o, i
                    ch = True
            if not ch:
                break
        self.live_in, self.live_out, self.succ = live_in, live_out, succ
        return live_in, live_out

    # ---------------------------------------------------------- ekspresi bantu
    def ftmp(self, ty):
        return "X7!" if ty == "!" else "X8#"

    def rtmp(self, r):
        return {"ax": "X1%", "bx": "X2%", "cx": "X3%",
                "dx": "X4%", "si": "X5%", "di": "X6%"}[r]

    @staticmethod
    def bpkey(o):
        g = BPLOC.match(o)
        return None if not g else "bp%s%d" % (g.group(1), int(g.group(2), 0))

    def _src(self, o, R):
        k = self.bpkey(o)
        if k:
            return R.get(k) or E("0")
        g = re.match(r"^%s$" % MEMW, o)
        if g:
            return E(self.N.integer(int(g.group(1), 16)))
        g = re.match(r"^%s$" % IDXW, o)
        if g:
            return E("%s(%s)" % (self.N.arr(int(g.group(2), 16)),
                                 self._unscale(R.get(g.group(1)))))
        if o in REGS:
            return R.get(o) or E(self.rtmp(o))
        m = re.match(r"^(byte|word) ptr ", o)
        if m:
            return E("0")
        try:
            return num(s16(int(o, 0)))
        except ValueError:
            return E("0")

    def _unscale(self, idx):
        """`[di + basis]` mengalamati larik word, jadi di SELALU berisi indeks*2.

        Kalau bentuk `* 2` masih terlihat, cukup dilepas. Kalau di diwarisi dari blok
        lain (jadi hanya tampak sebagai variabel bantu), skalanya tetap ada dan harus
        DIBAGI -- tanpa ini indeksnya dua kali lipat dan larik terbaca di luar batas."""
        if idx is None:
            return "0"
        m = re.match(r"^(.*) \* 2$", idx.s)
        if m:
            return m.group(1)
        if re.match(r"^[A-Za-z][A-Za-z0-9]*%$", idx.s):
            return "%s \\ 2" % idx.s
        return "(%s) \\ 2" % idx.s

    def _strarr(self, b):
        """Elemen larik string, atau None. Dipakai baik sebagai SUMBER maupun TUJUAN."""
        if b is None:
            return None
        m = self.ARR4.match(b.s)
        if not m:
            return None
        return E("%s(%s)" % (self.N.arr(int(m.group(2)), "$"), m.group(1)))

    def _strsrc(self, b):
        """Alamat -> literal string bila deskriptornya statis, jika tidak variabel."""
        if b is None:
            return E('""')
        if not re.match(r"^\d+$", b.s):
            # Elemen LARIK string: deskriptornya 4 byte, jadi alamatnya berbentuk
            # `indeks * 4 + basis` -- pola yang sama seperti larik single, dan
            # ARR4 sudah mengenalinya.
            #
            # Tanpa ini seluruh larik runtuh menjadi SATU skalar X9$: papan skor
            # HOPPER menulis sepuluh baris nama yang isinya sama persis, padahal
            # tiap barisnya elemen yang berbeda.
            m = self._strarr(b)
            if m is not None:
                return m
            # Nilai string yang dibawa REGISTER (mis. hasil subrutin yang mengembalikan
            # deskriptor lewat ax) tak punya alamat statis. Ia adalah temp string yang
            # sedang berjalan; menerbitkannya sebagai variabel bantu INTEGER membuat
            # `S2$ = X1%` -- Type mismatch.
            return E("X9$")
        if re.match(r"^\d+$", b.s):
            a = int(b.s)
            if a not in self.svars:
                s = self.p.sdesc(a)
                # deskriptor panjang-nol adalah literal "" yang sah -- itulah yang
                # dipakai `IF INKEY$ = "" THEN`, jadi jangan diperlakukan variabel
                if s is not None:
                    return E('"%s"' % s.replace('"', "'"))
            return E(self.N.string(a))
        return b

    # ---------------------------------------------------------- satu blok
    def block(self, lo, hi, line_of, flag_in=None, reg_in=None):
        R, out, loc, col, scr = ({k: num(v) for k, v in (reg_in or {}).items()},
                                 [], [], [], [])
        gp = []               # titik grafis yang tertunda: (x, y)
        fmode = None          # mode OPEN terakhir, dari OPEN_MODE$
        pfile = None          # nomor berkas untuk PRINT yang sedang dirakit
        using = None          # format PRINT USING, dari rutin penyetel format
        fac_baru = False      # rutin sebelumnya baru mengisi FAC
        inp_file = None       # nomor berkas untuk INPUT# yang sedang dirakit
        pr = None
        stmp = None
        fac = None
        facty = "!"
        inp_ty = "!"          # tipe item INPUT, dari byte sebaris INPUT_ITEM
        raw_ity = None        # byte tipe mentahnya, untuk pemetaan empiris
        inp_prompt = None     # prompt INPUT, dari bx pada panggilan INPUT
        inp_vars = []         # variabel tujuan; satu INPUT bisa punya banyak
        notes = []            # rutin tak tertangani -- DIKUMPULKAN, tidak disisipkan
        # Bendera bisa MENYEBERANGI batas blok. Pola SGN yang dipakai AI pengejar
        # PAC-GAL menaruh `and bx,bx / je` di satu blok lalu `jge` di blok berikutnya:
        #     bx = A - B : and bx,bx : je SAMA
        #     bx = 1     : jge PLUS  : neg bx      -> V = V + SGN(A-B)
        cmpop = flag_in
        N, O, P = self.N, self.O, self.p

        def flush_print():
            nonlocal pfile, using
            """Terbitkan buffer PRINT, dipecah bila terlalu panjang.

            Satu baris labirin PAC-GAL berisi ~40 item dan menjadi satu pernyataan
            PRINT sepanjang ribuan karakter. Memecahnya aman karena tiap potongan
            berakhir dengan ';' -- kursor tidak berpindah baris."""
            nonlocal pr
            if pr is None:
                return
            pfx = "#%s, " % pfile.s if pfile is not None else ""
            if using is not None:
                # PRINT USING: format DITETAPKAN lebih dulu oleh rutin tersendiri,
                # baru itemnya dicetak. Tiga pernyataan HOPPER memakainya, dan
                # tanpa penanganan ini ketiga teksnya hilang sama sekali dari
                # layar -- termasuk dua prompt yang menampilkan nilai berjalan
                # di dalam kurung siku ("[#]", "[####]").
                pfx = "USING %s; " % using.s + pfx
            if not pr:
                out.append("PRINT " + pfx if pfx else "PRINT")
                pr = None
                using = None
                return
            cur, n = [], 0
            for it in pr:
                if cur and n + len(it) > 150:
                    out.append("PRINT " + pfx + "".join(cur) +
                               ("" if cur[-1].endswith((";", ",")) else ";"))
                    cur, n = [], 0
                cur.append(it)
                n += len(it)
            if cur:
                out.append("PRINT " + pfx + "".join(cur))
            pr = None
            pfile = None
            using = None

        def flush_loc():
            """Terbitkan LOCATE.

            Argumen LOCATE tidak dieksekusi di situs panggilan: tiap panggilan hanya
            MENUMPUK satu byte ke penyangga (@19444, `mov [bx+di], cl` lalu menaikkan
            pencacah), dan validatornya cuma menolak byte tinggi bukan nol. Nilai 0
            lolos begitu saja, yang dalam BASIC berarti argumen DIHILANGKAN
            (`LOCATE , 5` mempertahankan barisnya). PAC-GAL memang menghapus hantu
            slot 1 yang tak pernah ditempatkan, jadi barisnya nol -- di GW-BASIC itu
            `Illegal function call`, di BASCOM tidak terjadi apa-apa.

            Argumen konstan diterbitkan apa adanya; yang dihitung saat jalan dibungkus
            penjaga supaya nol berperilaku seperti "dihilangkan"."""
            if not loc:
                return
            a1 = loc[0]
            a2 = loc[1] if len(loc) > 1 else None
            lit = re.compile(r"^\d+$")
            if a2 is None and lit.match(a1.s):
                out.append("LOCATE %s" % a1.s)
            elif a2 is not None and lit.match(a1.s) and lit.match(a2.s):
                out.append("LOCATE %s, %s" % (a1.s, a2.s))
            else:
                # Nol berarti argumen DIHILANGKAN, jadi nilainya harus jadi posisi
                # kursor saat ini. Bentuk `IF ... THEN LOCATE ... ELSE ...` tidak
                # boleh dipakai: di BASIC segala sesuatu sesudah THEN/ELSE ikut ke
                # cabang itu, sehingga pernyataan berikutnya pada baris yang sama --
                # termasuk penambah gelung FOR -- tak pernah dieksekusi.
                # `X + (X <= 0) * (X - C)` bebas cabang: (X<=0) bernilai -1 atau 0,
                # jadi hasilnya C bila X<=0 dan X bila X>0.
                out.append("L1%% = %s" % a1.s)
                out.append("L2%% = %s" % (a2.s if a2 is not None else "0"))
                out.append("L1% = L1% + (L1% <= 0) * (L1% - CSRLIN)")
                out.append("L2% = L2% + (L2% <= 0) * (L2% - POS(0))")
                out.append("LOCATE L1%, L2%")
            loc.clear()

        def flush_input():
            """Terbitkan pernyataan INPUT yang sudah terkumpul.

            Satu pernyataan bisa punya BANYAK variabel: di 3DTTT ada situs dengan
            delapan INPUT_DONE berturut-turut. Jadi variabelnya dikumpulkan dan
            diterbitkan sekali, bukan satu pernyataan per variabel."""
            nonlocal inp_prompt, inp_file
            if inp_vars:
                # Pemisah KOMA, bukan titik koma: `INPUT "x"; A` membuat GW-BASIC
                # menambahkan "? " sendiri, padahal literal promptnya sudah memuat
                # tanda tanya (`Please enter your name? `). Wasit layar menangkap ini
                # sebagai `? ?` ganda di .bas yang tak ada di EXE.
                pr_ = ""
                if inp_prompt is not None and inp_prompt.s not in ('""', "0"):
                    pr_ = inp_prompt.s + ", "
                if inp_file is not None:
                    out.append("INPUT #%s, %s" % (inp_file.s, ", ".join(inp_vars)))
                else:
                    out.append("INPUT %s%s" % (pr_, ", ".join(inp_vars)))
                inp_vars[:] = []
            inp_prompt = None
            inp_file = None

        def flush_color():
            if col:
                out.append("COLOR " + ", ".join(x.s for x in col[:2]))
                col.clear()

        def flush_screen():
            if scr:
                # Nol di sini nilai SUNGGUHAN, bukan "argumen dihilangkan": urutan
                # HOPPER adalah `SCREEN 0` (kembali ke teks) lalu `SCREEN 1, 0`
                # (CGA 320x200, saklar warna nyala). Memangkasnya mengubah arti.
                out.append("SCREEN " + ", ".join(x.s for x in scr[:2]))
                scr.clear()

        def flush():
            flush_print()
            flush_loc()
            flush_color()
            flush_screen()
            flush_input()

        used = []

        def getfac(ty="!"):
            """Nilai FAC. Kalau tak disetel di blok ini, ia DIWARISI: gelung FOR
            bertipe float memuat pencacah di satu blok dan menyimpannya di blok lain."""
            nonlocal facty
            if fac is not None:
                return fac
            facty = ty
            used.append(True)          # FAC dibaca dari blok LAIN
            return E(self.ftmp(ty))

        def setflag(x, y=None):
            nonlocal cmpop
            cmpop = (x, y if y is not None else num(0))

        i = lo
        while i < hi:
            e = self.byaddr.get(i)
            if e is None:
                i += 1
                continue
            k, v = e
            if k == "db":
                i += 1
                continue

            # ---------------- instruksi mesin ----------------
            if k == "insn":
                m, o, sz = v.mnemonic, v.op_str, v.size
                if m in JCC:
                    t = re.match(r"^0x([0-9a-f]+)$", o)
                    if t:
                        flush()
                        tgt = line_of.get(int(t.group(1), 16))
                        if tgt and cmpop:
                            out.append("IF %s %s %s THEN %d"
                                       % (cmpop[0].par("rel"), JCC[m],
                                          cmpop[1].par("rel"), tgt))
                        elif tgt:
                            # sama seperti catatan rutin: JANGAN sisipkan REM di
                            # tengah baris, ia menelan pernyataan sesudahnya
                            self.unhandled["lompatan tanpa bendera"] += 1
                            notes.append("lompat bersyarat ke %d" % tgt)
                    i += sz
                    continue
                if m == "jmp":
                    t = re.match(r"^0x([0-9a-f]+)$", o)
                    if t and int(t.group(1), 16) in line_of:
                        flush()
                        out.append("GOTO %d" % line_of[int(t.group(1), 16)])
                    i += sz
                    continue
                if m == "call":
                    t = re.match(r"^0x([0-9a-f]+)$", o)
                    if t and int(t.group(1), 16) in line_of:
                        flush()
                        out.append("GOSUB %d" % line_of[int(t.group(1), 16)])
                    i += sz
                    continue
                if m in ("ret", "retf"):
                    flush()
                    out.append("RETURN")
                    i += sz
                    continue
                self._insn(m, o, R, out, setflag)
                i += sz
                continue

            # ---------------- panggilan runtime ----------------
            tgt, nm, raw = v
            i += 5 + len(raw)
            nm = nm or ("@%d" % tgt)

            def reg(r):
                """Nilai register; kalau diwarisi dari blok lain, pakai nama bantunya.
                R.get() polos mengembalikan None dan operan hilang diam-diam."""
                return R.get(r) or E(self.rtmp(r))
            bx, dx, cx, di = (reg(r) for r in ("bx", "dx", "cx", "di"))
            si = reg("si")

            g = re.match(r"^PRINT<(.)(.?)>$", nm)
            if nm == "PRINT_BEGIN":
                # Pernyataan PRINT sebelumnya BERAKHIR di sini. Dulu `pr` cuma
                # ditimpa, jadi item yang belum terbit hilang diam-diam -- terlihat
                # di papan skor HOPPER, di mana angka skornya lenyap dan formatnya
                # bocor ke pernyataan berikutnya.
                flush_print()
                flush_loc()
                pr = []
            elif g:
                ty, sep = g.group(1), g.group(2)
                if pr is None:
                    pr = []
                if ty == "$":
                    item = stmp if stmp is not None else self._strsrc(bx)
                    stmp = None
                elif ty in ("!", "#"):
                    # float tak muat di bx, jadi yang dikirim ALAMATNYA -- berbeda
                    # dari stub integer yang menerima nilai langsung.
                    #
                    # Kecuali bila rutin aritmetika TEPAT sebelumnya baru mengisi
                    # FAC: nilainya lalu ada di FAC dan bx cuma menunjuk scratch.
                    # Prompt skill HOPPER begitu -- `ADD!` menghitung F19! + 1 lalu
                    # PRINT<!;> membawa bx=178, alamat yang bukan variabel dan
                    # ter-decode sebagai konstanta MBF sampah (-6,6e-24).
                    if fac_baru and fac is not None and self.facarr(bx, ty) is None \
                       and not (bx is not None and re.match(r"^\d+$", bx.s)
                                and int(bx.s) in self.fvars):
                        item = fac
                    else:
                        item = self.facop(None, bx, ty)
                else:
                    item = bx if bx is not None else num(0)
                pr.append(item.s + (";" if sep == ";" else ("," if sep == "," else "")))
                if sep == "":
                    flush_print()
            elif nm == "LOCATE":
                loc.append(bx if bx is not None else num(1))
                if len(loc) == 2:
                    flush_loc()
            elif nm in ("COLOR", "COLOR_FG", "COLOR_BG"):
                # COLOR memakai satu entry per argumen, sama seperti LOCATE.
                # @20299 sempat dinamai LOCATE; tabel batas argumennya (helper @20500,
                # ch=3/4) adalah keluarga COLOR, bukan LOCATE (helper @13039, ch=5).
                col.append(bx if bx is not None else num(0))
                if nm == "COLOR_BG" or len(col) == 2:
                    flush_color()
            elif nm == "CLS":
                flush(); out.append("CLS")
            elif nm in ("SCREEN_STMT", "SCREEN_A", "SCREEN_B"):
                # SCREEN memakai satu entry per argumen, sama seperti LOCATE dan COLOR.
                # Sidik jari validatornya ch=4 (tools/stmtfamily.py); di HOPPER dua
                # entry-nya sempat dinamai LOCATE, sehingga rekonstruksinya tak pernah
                # menerbitkan SCREEN dan seluruh grafiknya digambar di mode teks.
                scr.append(bx)
                if nm in ("SCREEN_STMT", "SCREEN_B") or len(scr) == 2:
                    flush_screen()
            elif nm == "CHR$":
                stmp = E("CHR$(%s)" % (bx or num(32)).s)
            elif nm == "STRING$":
                if re.match(r"^\d+$", dx.s) and (int(dx.s) in self.svars
                                                 or self.p.sdesc(int(dx.s))):
                    stmp = E("STRING$(%s, %s)" % (bx.s, self._strsrc(dx).s))
                else:
                    stmp = E("STRING$(%s, %s)" % (bx.s, dx.s))
            elif nm == "STRING$_C":
                # dx = KODE karakter (205, 223, ...) -- didorong apa adanya
                stmp = E("STRING$(%s, %s)" % ((bx or num(1)).s, (dx or num(32)).s))
            elif nm == "STRING$_S":
                # dx = alamat DESKRIPTOR; tubuhnya membaca [bx] dan [bx+2],
                # jadi karakternya diambil dari string, bukan dari angka
                stmp = E("STRING$(%s, %s)" % ((bx or num(1)).s, self._strsrc(dx).s))
            elif nm == "CONCAT$":
                # tubuh @29118: `mov si,ax / mov di,bx` lalu menyalin si DULU, baru bx.
                # Jadi hasilnya [ax] + [bx] -- bukan sebaliknya. Rutin penghasil string
                # (CHR$, STRING$, ...) mengembalikan temp-nya di bx, sehingga stmp
                # berpasangan dengan bx.
                left = self._strsrc(reg("ax"))
                right = stmp if stmp is not None else self._strsrc(bx)
                stmp = bin(left, "+", right, "+")
            elif nm == "LET$":
                src = stmp if stmp is not None else self._strsrc(bx)
                stmp = None
                arrd = self._strarr(dx)
                if dx is not None and re.match(r"^\d+$", dx.s):
                    flush(); out.append("%s = %s" % (N.string(int(dx.s)), src.s))
                elif arrd is not None:
                    # Tujuan berupa elemen larik. Tanpa cabang ini, tukar-menukar
                    # nama di pengurutan papan skor HOPPER berhenti separuh jalan:
                    # nilainya disimpan ke temp lalu tak pernah ditulis kembali.
                    flush(); out.append("%s = %s" % (arrd.s, src.s))
                else:
                    # tujuan tidak berupa alamat statis -- simpan ke temp string
                    # supaya nilainya tidak hilang begitu saja
                    flush(); out.append("X9$ = %s" % src.s)
            elif nm in ("GFXPT", "GFXSTART"):
                # Helper 0x6A1C menyimpan titik kini ke [0x60E]/[0x610]; GFXSTART
                # memindahkan titik lama ke [0x612]/[0x614] lebih dulu, jadi ia
                # argumen KEDUA sebuah pasangan `(x1,y1)-(x2,y2)`.
                if nm == "GFXPT":
                    gp[:] = [(bx.s, dx.s)]
                else:
                    gp.append((bx.s, dx.s))
            elif nm in ("LINE", "LINE_BF", "GET"):
                # LINE_BF menghitung |x2-x1|+1 dan |y2-y1|+1 lalu menggambar sebaris
                # penuh piksel per baris -- kotak TERISI. GET memakai kedua titik yang
                # sama untuk menangkap persegi ke dalam larik di bx.
                # Helper 0x6A4F JATUH ke badan GFXSTART: ia menyimpan titik kini ke
                # [0x612]/[0x614] lalu menyetel titik baru dari bx/dx-nya sendiri.
                # Jadi LINE dan LINE_BF membawa titik KEDUA di registernya, sedangkan
                # GET memakai dua titik yang sudah disiapkan GFXPT + GFXSTART.
                p1 = gp[0] if gp else ("0", "0")
                if nm == "GET":
                    p2 = gp[1] if len(gp) > 1 else p1
                else:
                    p2 = (bx.s, dx.s)
                flush()
                if nm == "GET":
                    out.append("GET (%s, %s)-(%s, %s), %s"
                               % (p1[0], p1[1], p2[0], p2[1], self._gfxarr(bx)))
                else:
                    warna = "" if cx is None or cx.s in ("32767", "65535", "(-1)") \
                            else ", " + cx.s
                    # warna boleh dihilangkan, tapi koma pemisahnya tetap wajib:
                    # `LINE (a)-(b), , BF`. Tanpa koma itu parser membaca `B F`.
                    if nm != "LINE_BF":
                        ekor = warna
                    elif warna:
                        ekor = warna + ", BF"
                    else:
                        ekor = ", , BF"
                    out.append("LINE (%s, %s)-(%s, %s)%s"
                               % (p1[0], p1[1], p2[0], p2[1], ekor))
                gp[:] = []
            elif nm == "PUT":
                p1 = gp[0] if gp else ("0", "0")
                flush()
                out.append("PUT (%s, %s), %s" % (p1[0], p1[1], self._gfxarr(bx)))
                gp[:] = []
            elif nm in ("OPEN_MODE$", "OPEN_MODE"):
                # OPEN_MODE$ menerima string mode, OPEN_MODE kode angkanya
                fmode = (self._strsrc(bx) if nm == "OPEN_MODE$"
                         else E('"%s"' % {0: "O", 1: "I", 2: "R"}.get(
                             int(bx.s) if re.match(r"^\d+$", bx.s) else -1, "O")))
            elif nm == "OPEN":
                # bx = nomor berkas, dx = nama berkas, mode dari OPEN_MODE$ sebelumnya
                flush()
                md = self.omodes.get(i - 5 - len(raw))
                if md is None:
                    md = fmode.s if fmode is not None else '"O"'
                out.append("OPEN %s, #%s, %s" % (md, bx.s, self._strsrc(dx).s))
                fmode = None
            elif nm == "CLOSE":
                flush(); out.append("CLOSE")
            elif nm == "END_STMT":
                # `clc / pushf / <bersihkan> / call <helper CLOSE> / popf / jmp` --
                # menutup berkas lalu mengakhiri program. Bentuk yang sama di ketiga
                # biner (@15098 HOPPER, @31384 3DTTT, @14247 PAC-GAL).
                flush(); out.append("END")
            elif nm == "SPC":
                # menulis bx buah spasi (mov al,0x20) sebagai ITEM di dalam PRINT
                if pr is None:
                    pr = []
                pr.append("SPC(%s);" % bx.s)
            elif nm == "INPUT#_BEGIN":
                flush()
                inp_prompt = None
                inp_vars[:] = []
                inp_file = bx
            elif nm == "WIDTH":
                flush(); out.append("WIDTH %s" % bx.s)
            elif nm == "PRINT_USING":
                # bx = string format. Rutinnya memasang penangan keluaran
                # ([0x7d7]=1, [0x7d8]=<offset>) lalu kembali; itemnya menyusul
                # lewat stub PRINT biasa, jadi ia MEMBUKA satu pernyataan PRINT.
                flush()
                using = self._strsrc(bx)
                pr = []
            elif nm == "PRINT#":
                # seperti PRINT_BEGIN tapi keluarannya ke berkas; nomor berkas di bx
                flush_loc()
                pfile = bx
                pr = []
            elif nm == "RANDOMIZE":
                # bx disimpan ke [0xc3], yang berada di dalam kata benih yang
                # DIBACA RND @15316 ([0xc2] dan [0xc4]).
                flush(); out.append("RANDOMIZE %s" % bx.s)
            elif nm == "SGN":
                # membaca kata TINGGI float di [si+2], lalu tubuh bersamanya menyetel
                # eksponen 0x81 dan menyisakan HANYA bit tanda (`mov ah,0x81 / and
                # al,0x80`) -- hasilnya +-1.0, nol bila eksponennya nol.
                fac = E("SGN(%s)" % self.facop(None, si, "!").s)
                facty = "!"
            elif nm == "PAINT":
                # bx,dx = titik, cx = atribut isi. Pembedanya dari PSET: ia memasang
                # tumpukan isi-banjir berbatas dari [0x7fa] (panjang berprefiks,
                # dijaga `cmp ax,0x1000`), dan helper-nya memperlakukan atribut batas
                # sebagai OPSIONAL lewat uji tanda.
                flush(); out.append("PAINT (%s, %s), %s" % (bx.s, dx.s, cx.s))
            elif nm == "TAB":
                # argumen kecil di tengah daftar PRINT, dan tubuhnya menghitung
                # selisih kolom (`sub cl, ch`) -- pindah MAJU ke kolom bx.
                if pr is None:
                    pr = []
                pr.append("TAB(%s);" % bx.s)
            elif nm == "ON_ERROR":
                # bx = ALAMAT penangan. Di HOPPER nilainya 7441, yang persis alamat
                # situs ON_ERROR_OFF -- penangannya mematikan dirinya sendiri lalu
                # menutup berkas dan mengakhiri program.
                flush()
                out.append("ON ERROR GOTO %s" % line_of.get(int(bx.s), 0)
                           if re.match(r"^\d+$", bx.s or "") else "ON ERROR GOTO 0")
            elif nm == "ON_ERROR_OFF":
                flush(); out.append("ON ERROR GOTO 0")
            elif nm == "CALL_VAR":
                # melompat-jauh ke [0x98]:[<arg>] -- segmen dari DEF SEG, offset dari
                # sebuah variabel. Itulah `CALL <var>` GW-BASIC. Argumennya didorong
                # ke TUMPUKAN (`mov ax,<alamat> / push ax`) dan dipanen `pop bx`
                # sesudah alamat kembali jauh, jadi ia ada di ax, bukan bx.
                ax_ = reg("ax")
                if ax_ is not None and re.match(r"^\d+$", ax_.s):
                    v = int(ax_.s)
                    nama = (N.fac(("@", v), "!") if v in self.fvars
                            else N.integer(v))
                else:
                    nama = "X1%"
                flush(); out.append("CALL %s" % nama)
            elif nm == "KEY_ASSIGN":
                # bx = nomor tombol, dx = string penggantinya
                flush(); out.append("KEY %s, %s" % (bx.s, self._strsrc(dx).s))
            elif nm == "PSET":
                # bx = x, dx = y (dari CINT sebelumnya); DRAW menyusul dari titik ini
                flush(); out.append("PSET (%s, %s)" % (bx.s, dx.s))
            elif nm == "DRAW":
                # sama seperti PRINT: kalau ada temp string yang baru dirakit, ITU
                # argumennya. Memakai bx membuat DRAW memakan nilai lintasan
                # SEBELUMNYA dan penugasannya terbit sesudahnya.
                arg = stmp if stmp is not None else self._strsrc(bx)
                stmp = None
                flush(); out.append("DRAW %s" % arg.s)
            elif nm in ("ARG_C",
                        "OPEN_MODE$", "INPUT#_BEGIN", "PRINT_BEGIN#"):
                pass                      # pembukuan runtime, tanpa padanan BASIC
            elif nm == "POS":
                R["bx"] = E("POS(0)")
            elif nm == "CSRLIN":
                # tubuhnya `xor bh,bh / mov bl,[0x53] / retf` -- membaca byte baris
                # kursor BIOS dan mengembalikannya di bx
                R["bx"] = E("CSRLIN")
            elif nm == "FACNORM":
                # menormalkan mantissa FAC di tempat; nilainya tak berubah, jadi tak
                # ada pernyataan BASIC yang perlu diterbitkan
                pass
            elif nm == "STKPOP":
                pass                      # pembukuan tumpukan runtime
            elif nm == "LINE_INPUT":
                # Prompt-nya datang dari panggilan INPUT tepat sebelumnya, sama
                # seperti INPUT biasa -- dan dulu DIBUANG di sini, sehingga
                # "ENTER YOUR NAME PLEASE: " hilang dari layar papan skor HOPPER.
                # Diambil SEBELUM flush(): flush_input() mengosongkan inp_prompt.
                # `LINE INPUT "x"; A$` tidak menambahkan "? " sendiri seperti
                # INPUT, jadi pemisahnya titik koma, bukan koma.
                pr0, f0 = inp_prompt, inp_file
                flush()
                arr = self._strarr(bx)
                dest = (N.string(int(bx.s))
                        if bx is not None and re.match(r"^\d+$", bx.s)
                        else arr.s if arr is not None else "X9$")
                if f0 is not None:
                    # LINE INPUT dari BERKAS. Nomor berkasnya datang dari
                    # INPUT#_BEGIN sebelumnya dan dulu terbuang, sehingga gelung
                    # pembaca papan skor membaca PAPAN KETIK, bukan berkasnya.
                    out.append("LINE INPUT #%s, %s" % (f0.s, dest))
                else:
                    pr_ = (pr0.s + "; " if pr0 is not None
                           and pr0.s not in ('""', "0") else "")
                    out.append("LINE INPUT %s%s" % (pr_, dest))
                inp_prompt = None
            elif nm == "INPUT$":
                # INPUT$(n) MEMBLOKIR sampai n karakter tersedia; INKEY$ tidak dan
                # bisa mengembalikan "". Menyamakan keduanya membuat `ASC(S1$)`
                # menerima string kosong dan melempar Illegal function call.
                stmp = E("INPUT$(%s)" % bx.s)
            elif nm == "PLAY":
                arg = stmp if stmp is not None else self._strsrc(bx)
                stmp = None
                flush(); out.append("PLAY %s" % arg.s)
            elif nm == "SOUND":
                flush(); out.append("SOUND %s, %s" % ((bx or num(440)).s, self._cst(dx, "!")))
            elif nm == "GOSUB" and len(raw) >= 2:
                t = struct.unpack_from("<H", raw, 0)[0]
                flush(); out.append("GOSUB %s" % line_of.get(t, 0))
            elif nm == "RETURN":
                flush(); out.append("RETURN")
            elif nm in ("ON_GOSUB", "ON_GOTO") and raw:
                # @33045 dan @33044 adalah entry TUMPANG-TINDIH ke tubuh yang sama:
                # 33044 = `mov ax,0xE432` (ah != 0) sehingga `or ah,ah / je` di 33067
                # TIDAK diambil -- alamat kembali didorong dan pencacah kedalaman
                # [0x61a] dinaikkan: itu ON ... GOSUB. 33045 = `xor ah,ah` sehingga
                # keduanya DILEWATI: itu ON ... GOTO. Seluruh situs 3DTTT memakai
                # 33045. Menerbitkannya sebagai GOSUB mendorong 64 alamat kembali per
                # lintasan gelung papan dan membuat RETURN mengambil yang salah --
                # itulah asal penghitung gelung yang basi.
                arms = [str(line_of.get(struct.unpack_from("<H", raw, 1 + 2 * j)[0], 0))
                        for j in range(raw[0])]
                kata = "GOSUB" if nm == "ON_GOSUB" else "GOTO"
                flush()
                out.append("ON %s %s %s" % ((bx or num(1)).s, kata, ", ".join(arms)))
            elif nm == "SCREEN":
                R["bx"] = E("SCREEN(%s, %s)" % ((bx or num(1)).s, (dx or num(1)).s))
            elif nm == "INKEY$":
                stmp = E("INKEY$")
            elif nm == "TIME$":
                stmp = E("TIME$")
            elif nm in ("LEFT$", "RIGHT$"):
                # sumbernya temp string bila ada, kalau tidak dari bx. Jatuh ke TIME$
                # hanya benar untuk rantai jam dan salah di tempat lain.
                src = stmp if stmp is not None else self._strsrc(bx)
                stmp = E("%s(%s, %s)" % (nm, src.s, (dx or num(1)).s))
            elif nm == "MID$":
                # cx = 0x7FFF adalah sentinel "panjang dihilangkan"; menerbitkannya
                # apa adanya menghasilkan MID$(s, n, 32767) yang menembus batas string
                src = (stmp if stmp is not None else self._strsrc(bx)).s
                if cx is not None and cx.s == "32767":
                    stmp = E("MID$(%s, %s)" % (src, (dx or num(1)).s))
                else:
                    stmp = E("MID$(%s, %s, %s)" % (src, (dx or num(1)).s,
                                                   (cx or num(1)).s))
            elif nm == "VAL":
                fac = E("VAL(%s)" % (stmp or E('"0"')).s); stmp = None
            elif nm == "STICK":
                # bx = 0..3. Nol memicu pencuplikan port permainan 0x201 (out lalu
                # in bertempo, memasker 0xF); 1..3 mengembalikan sumbu yang sudah
                # tersimpan di tabel empat entri [bx+0x102]. Itu persis STICK BASIC.
                R["bx"] = E("STICK(%s)" % bx.s)
            elif nm == "EOF":
                # bx = nomor berkas masuk, hasil -1/0 keluar lewat bx juga. Penjaga
                # gelung di 1436 mengujinya sebagai `NOT <hasil> <> 0`, yang persis
                # konvensi EOF BASIC: NOT(-1)=0 berhenti, NOT(0)=-1 lanjut.
                R["bx"] = E("EOF(%s)" % bx.s)
            elif nm == "LEN":
                R["bx"] = E("LEN(%s)" % (stmp or self._strsrc(bx)).s); stmp = None
            elif nm == "ASC":
                R["bx"] = E("ASC(%s)" % (stmp or self._strsrc(bx)).s); stmp = None
            elif nm == "STRCMP":
                a = stmp if stmp is not None else self._strsrc(bx)
                b = self._strsrc(R.get("ax"))
                stmp = None
                setflag(a, b)
            elif nm == "INT2SGL":
                fac = E("CSNG(%s)" % bx.s)
            elif nm in ("CINT", "CINT#"):
                R["bx"] = E("CINT(%s)" % getfac("#" if nm == "CINT#" else "!").s)
            elif re.match(r"^SCALE2([!#])$", nm):
                # menambahkan byte sebaris ke BYTE EKSPONEN FAC (es:[0xb7]) =
                # perkalian dengan pangkat dua; operan dimuat dari si
                k = raw[0] if raw else 1
                k = k - 256 if k >= 128 else k
                src = self.facop(None, si, "!") if re.match(r"^\d+$", si.s) else getfac()
                fac = bin(src, "*" if k >= 0 else "/", num(2 ** abs(k)), "*")
            elif re.match(r"^(ADD|SUB|MUL|DIV)([!#])(_FAC)?$", nm):
                gg = re.match(r"^(ADD|SUB|MUL|DIV)([!#])(_FAC)?$", nm)
                op = {"ADD": "+", "SUB": "-", "MUL": "*", "DIV": "/"}[gg.group(1)]
                ty = gg.group(2)
                side = self.facside.get(tgt)
                if gg.group(3) or side == "si":      # FAC <op> [di]
                    fac = bin(getfac(ty), op, self.facop(raw, di, ty), op)
                elif side == "di":                   # [si] <op> FAC
                    fac = bin(self.facop(raw, si, ty), op, getfac(ty), op)
                elif raw:                            # FAC <op> var[indeks sebaris]
                    fac = bin(getfac(ty), op, self.facop(raw, None, ty), op)
                else:                                # [si] <op> [di]
                    fac = bin(self.facop(None, si, ty), op,
                              self.facop(None, di, ty), op)
                facty = ty
            elif re.match(r"^FCMP([!#])(_FAC)?$", nm):
                gg = re.match(r"^FCMP([!#])(_FAC)?$", nm)
                setflag(getfac(gg.group(1)), self.facop(raw, di, gg.group(1)))
            elif nm == "ARITH!" or re.match(r"^ARITH([!#])(_FAC)?$", nm):
                # membandingkan [si] dengan [di] lalu menyetel bendera; inilah yang
                # mengubah `IF a <op> b` menjadi lompatan bersyarat
                ty = "#" if "#" in nm else "!"
                setflag(self.facop(None, si, ty), self.facop(None, di, ty))
            elif nm == "INT":
                # bukan penyetel bendera: di ketujuh situsnya hasilnya mengalir ke
                # aritmetika float berikutnya, tak pernah ke lompatan bersyarat.
                # Helper-nya memuat operan ke FAC, lalu uji eksponen dan TANDA
                # memilih jalur koreksi -- pembeda INT (pembulatan ke bawah) dari
                # FIX (pemotongan). Tanpa ini `STR$` menerima pecahan dan makro
                # DRAW-nya ditolak.
                src = getfac() if (bx is None or not re.match(r"^\d+$", bx.s)
                                   or int(bx.s) < 0x200) else self.facop(None, bx, "!")
                fac = E("INT(%s)" % src.s)
            elif re.match(r"^(SGNTEST)", nm):
                setflag(fac if fac is not None else self.facop(None, si, "!"), num(0))
            elif re.match(r"^NONZERO([!#])(_FAC)?$", nm):
                ty = re.match(r"^NONZERO([!#])", nm).group(1)
                src = fac if fac is not None else self.facop(None, si, ty)
                R["bx"] = E("(%s <> 0)" % src.s)
            elif re.match(r"^FACSTORE([!#])$", nm):
                ty = re.match(r"^FACSTORE([!#])$", nm).group(1)
                flush()
                out.append("%s = %s" % (self.facdest(raw, di, ty), getfac(ty).s))
            elif re.match(r"^(LOAD|FACLOAD)([!#])$", nm):
                ty = re.match(r"^(LOAD|FACLOAD)([!#])$", nm).group(2)
                src = self.facop(raw, None if raw else
                                 (si if re.match(r"^\d+$", si.s) else di), ty)
                if tgt in self.load_int:
                    R["bx"] = E("CINT(%s)" % src.s)
                else:
                    facty = ty
                    fac = src
            elif re.match(r"^LET([!#])$", nm):
                # tubuh @29388 hanyalah `movsw` dari [si] ke es:[di] -- penyalinan
                # variabel ke variabel yang TIDAK menyentuh FAC. Memakai FAC di sini
                # membuat inisialisasi variabel hilang sama sekali.
                ty = re.match(r"^LET([!#])$", nm).group(1)
                flush()
                out.append("%s = %s" % (self.facdest(raw, di, ty),
                                        self.facop(None, si, ty).s))
            elif re.match(r"^READ([!#%$])$", nm):
                ty = re.match(r"^READ([!#%$])$", nm).group(1)
                flush()
                if re.match(r"^\d+$", bx.s):
                    a = int(bx.s)
                    tgt_nm = (N.string(a) if ty == "$" else
                              N.integer(a) if ty == "%" else N.fac(("@", a), ty))
                else:
                    tgt_nm = "X9" + ("$" if ty == "$" else ty)
                out.append("READ %s" % tgt_nm)
            elif nm == "INSTR":
                # menukar bx/dx lalu menyetel bx=1: posisi awal 1 adalah bentuk baku
                # INSTR(1, a$, b$). Dua operan string, hasil INTEGER yang langsung
                # dikonversi INT2SGL -- hanya INSTR yang berbentuk (int,$,$) -> int.
                R["bx"] = E("INSTR(1, %s, %s)"
                            % (self._strsrc(bx).s,
                               (stmp if stmp is not None else self._strsrc(dx)).s))
                stmp = None
            elif nm == "STR$":
                # menyimpan seluruh FAC (0xAE..0xB5), memanggil pemformat, lalu
                # mengalokasikan deskriptor string -- angka menjadi teks
                stmp = E("STR$(%s)" % getfac().s)
            elif nm == "RND":
                fac = E("RND(%s)" % self._cst(bx, "!"))
            elif nm == "RANDOMIZE":
                flush(); out.append("RANDOMIZE %s" % (bx or num(0)).s)
            elif nm == "STRTEMP":
                # menyalin deskriptor ke temp; nilainya tetap string yang sama
                if stmp is None:
                    stmp = self._strsrc(bx)
            elif nm == "INPUT":
                # bx = string prompt (PAC-GAL memakai literal kosong karena prompt-nya
                # sudah dicetak sendiri; 3DTTT menaruh teksnya di sini)
                flush()
                inp_prompt = self._strsrc(bx)
                inp_vars[:] = []
            elif nm == "INPUT_ITEM":
                inp_ty = ir.TY.get(raw[1], None) if len(raw) > 1 else None
                raw_ity = raw[1] if len(raw) > 1 else None
            elif nm == "INPUT_DONE":
                # Tiap INPUT_DONE menyumbang SATU variabel tujuan. Tipe diambil dari
                # byte sebaris bila terpetakan; kalau tidak, dari peran alamat itu di
                # tempat lain -- 3DTTT memakai kode tipe yang tak ada di tabel stub.
                if bx is not None and re.match(r"^\d+$", bx.s):
                    a = int(bx.s)
                    ty = inp_ty
                    if ty is None:
                        if self.itypes is None:
                            self.itypes = self.input_types()
                        ty = self.itypes.get(raw_ity)
                    if ty is None:
                        ty = ("$" if a in self.svars or a in self.strops
                              else "!" if a in self.fvars else "%")
                    inp_vars.append(N.string(a) if ty == "$" else
                                    N.integer(a) if ty == "%" else N.fac(("@", a), ty))
                elif bx is not None and (self.ARR8.match(bx.s)
                                         or self.ARR4.match(bx.s)):
                    # Tujuan berupa elemen LARIK, bukan alamat statis. Gelung
                    # pembaca papan skor HOPPER menulis ke G1!(i) dengan cara ini;
                    # tanpa cabang ini seluruh pembacaan berkas menguap.
                    m8 = self.ARR8.match(bx.s)
                    m = m8 or self.ARR4.match(bx.s)
                    base = int(m.group(2))
                    if self.N.a.get(base, "").endswith("$"):
                        inp_vars.append(self._strarr(bx).s)
                    else:
                        t = "#" if m8 else (inp_ty if inp_ty in ("!", "#") else "!")
                        inp_vars.append("%s(%s)" % (self.N.arr(base, t), m.group(1)))
                else:
                    inp_vars.append("X9$")
            elif nm == "DEF_SEG=":
                flush(); out.append("DEF SEG = %s" % bx.s)
            elif nm == "DEF_SEG":
                flush(); out.append("DEF SEG")
            elif nm in ("TRAP_INIT", "KEY_DISPLAY", "KEY_LIST", "KEY_ONOFF",
                        "ON_KEY_GOSUB", "SND_TIMER_OFF", "CLEAR",
                        "SCREEN_STMT", "RT_HEAPINIT", "RT_STMTCTX"):
                # Dua yang terakhir adalah PROLOG runtime, bukan pernyataan: yang
                # pertama membaca PSP:[2] (batas memori yang diberi DOS) lalu memasang
                # segmen DGROUP dan bp = puncak - 0x10; yang kedua menyetel kode
                # konteks 5 dan mencatat sp sebagai titik periksa pernyataan. Bentuk
                # keduanya IDENTIK di ketiga biner, dan selalu di situs 26 dan 38.
                pass                      # tak punya padanan yang perlu diterbitkan
            else:
                # `REM` mengomentari SISA BARIS di BASIC. Menyisipkannya di tengah
                # daftar pernyataan menelan semua yang mengikutinya -- itu yang
                # membekukan gelung penyiapan tombol HOPPER selamanya. Catatannya
                # dikumpulkan dan ditempel di ujung baris.
                self.unhandled[nm] += 1
                notes.append(nm)
            # Rutin float yang BARU SAJA mengisi FAC. Dipakai item PRINT untuk
            # memutuskan apakah nilainya ada di FAC atau di alamat yang dibawa bx.
            fac_baru = bool(re.match(r"^(ADD|SUB|MUL|DIV|ARITH)[!#]?(_FAC)?$", nm))
        flush()
        return out, R, cmpop, (fac, facty, bool(used), stmp), notes

    # setelah rantai geser digabung, skala larik muncul sebagai `* 4` / `* 8`
    # (dan tetap bisa `* 2 * 2` bila gesernya tak berurutan)
    ARR4 = re.compile(r"^(.+?) \* (?:4|2 \* 2) \+ (\d+)$")
    ARR8 = re.compile(r"^(.+?) \* (?:8|2 \* 2 \* 2) \+ (\d+)$")

    def facarr(self, r, ty):
        """Elemen larik float: si = basis + indeks*4 (single) atau *8 (double).

        Papan 3DTTT adalah larik semacam ini; tanpa dikenali, seluruh pembacaan papan
        terbit sebagai konstanta 0 dan `IF papan(i) = 1` menjadi `IF 0 = 1`."""
        if r is None:
            return None
        m = self.ARR8.match(r.s) if ty == "#" else self.ARR4.match(r.s)
        if not m:
            return None
        return E("%s(%s)" % (self.N.arr(int(m.group(2)), ty), m.group(1)))

    def facop(self, raw, r, ty):
        """Operan float: indeks SEBARIS (PAC-GAL) atau ALAMAT di si/di (HOPPER, 3DTTT).

        Alamat yang pernah ditulis adalah variabel; sisanya konstanta MBF di DGROUP."""
        if raw:
            return E(self.N.fac(raw[0], ty))
        a = self.facarr(r, ty)
        if a is not None:
            return a
        if r is not None and re.match(r"^\d+$", r.s):
            a = int(r.s)
            if a in self.fvars:
                return E(self.N.fac(("@", a), ty))
            v = self.O.const(a, ty == "#")
            if v is not None:
                return E(fmtnum(v))
        return num(0)

    def facdest(self, raw, r, ty):
        if raw:
            return self.N.fac(raw[0], ty)
        a = self.facarr(r, ty)
        if a is not None:
            return a.s
        if r is not None and re.match(r"^\d+$", r.s):
            return self.N.fac(("@", int(r.s)), ty)
        return "F0" + ty

    def _gfxarr(self, b):
        """Larik penampung sprite untuk GET/PUT. Ukurannya tidak bisa diturunkan dari
        ekspresi indeks (tak ada), jadi ia dicatat terpisah dan di-DIM tetap."""
        a = int(b.s) if b is not None and re.match(r"^\d+$", b.s) else 0
        nmv = self.N.arr(a, "%")
        self.gfxarr.add(nmv)
        # GET/PUT menuntut nama larik TANPA subskrip; `J1%(0)` ditolak parser
        return nmv

    def _cst(self, di, ty):
        if di is not None and re.match(r"^\d+$", di.s):
            v = self.O.const(int(di.s), ty == "#")
            if v is not None:
                return fmtnum(v)
        return "0"

    # ---------------------------------------------------------- instruksi
    def _insn(self, m, o, R, out, setflag):
        N = self.N
        # PEEK: `mov ds, [<pemegang DEF SEG>]` lalu `mov bl, byte ptr [bx]`, dengan
        # `xor bh,bh` untuk memperluas nol. Tanpa dimodelkan, bx tetap berisi ALAMAT
        # dan `CSNG(&H510)` terbit sebagai konstanta 1296 -- lalu CINT-nya meluap.
        g = re.match(r"^([abcd])l, byte ptr \[(bx|si|di)\]$", o)
        if m == "mov" and g:
            base = R.get(g.group(2)) or E(self.rtmp(g.group(2)))
            R[g.group(1) + "x"] = E("PEEK(%s)" % base.s)
            return
        # POKE: kebalikannya, `mov byte ptr [bx], al`
        g = re.match(r"^byte ptr \[(bx|si|di)\], ([abcd])l$", o)
        if m == "mov" and g:
            base = R.get(g.group(1)) or E(self.rtmp(g.group(1)))
            val = R.get(g.group(2) + "x") or E(self.rtmp(g.group(2) + "x"))
            out.append("POKE %s, (%s) AND 255" % (base.s, val.s))
            return
        # `xor bh,bh` hanya memperluas nol byte yang baru dibaca -- jangan hanguskan
        if m == "xor" and re.match(r"^([abcd])h, \1h$", o):
            return
        g = re.match(r"^(ax|bx|cx|dx|si|di), (.+)$", o)
        if m == "mov" and g:
            R[g.group(1)] = self._src(g.group(2), R)
            return
        if m == "mov":
            d, _, rest = o.partition(", ")
            k = self.bpkey(d)
            if k and rest:
                R[k] = self._src(rest, R)
                return
        gm = re.match(r"^%s, (.+)$" % MEMW, o)
        if m == "mov" and gm:
            out.append("%s = %s" % (N.integer(int(gm.group(1), 16)),
                                    self._src(gm.group(2), R).s))
            return
        gi = re.match(r"^%s, (.+)$" % IDXW, o)
        if m == "mov" and gi:
            out.append("%s(%s) = %s" % (N.arr(int(gi.group(2), 16)),
                                        self._unscale(R.get(gi.group(1))),
                                        self._src(gi.group(3), R).s))
            return
        if m == "cmp":
            gc = re.match(r"^(.+?), (.+)$", o)
            if gc:
                setflag(self._src(gc.group(1), R), self._src(gc.group(2), R))
            return
        if m in ("or", "and", "test"):
            gc = re.match(r"^(.+?), (.+)$", o)
            if gc and gc.group(1) == gc.group(2):
                setflag(self._src(gc.group(1), R))
                if m == "test":
                    return
        if g and m in ("add", "sub", "and", "or", "xor", "shl", "shr", "sar"):
            d = g.group(1)
            a = R.get(d) or E(self.rtmp(d))
            b = self._src(g.group(2), R)
            if m == "add":
                R[d] = bin(a, "+", b, "+")
            elif m == "sub":
                R[d] = bin(a, "-", b, "-")
            elif m == "and":
                # `and bx,bx` adalah idiom penyetel bendera, bukan perhitungan
                R[d] = a if g.group(2) == d else bin(a, "AND", b, "and")
            elif m == "or":
                R[d] = bin(a, "OR", b, "or")
            elif m == "xor":
                R[d] = num(0) if g.group(2) == d else bin(a, "XOR", b, "and")
            elif m == "shl":
                # `shl bx,1` berturut-turut menghasilkan `x * 2 * 2 * 2`. Menggabungkan
                # pengalinya memendekkan program secara berarti -- pada 3DTTT itu
                # bagian dari selisih antara muat dan tidak muat di ruang kerja.
                k = self._imm(g.group(2))
                mm = re.match(r"^(.*) \* (\d+)$", a.s)
                if mm and (int(mm.group(2)) & (int(mm.group(2)) - 1)) == 0:
                    R[d] = E("%s * %d" % (mm.group(1), int(mm.group(2)) * 2 ** k), "*")
                else:
                    R[d] = bin(a, "*", num(2 ** k), "*")
            else:
                k = self._imm(g.group(2))
                R[d] = bin(a, "\\", num(2 ** k), "\\")
            setflag(R[d])
            return
        if m in ("inc", "dec"):
            if o in REGS:
                a = R.get(o) or E(self.rtmp(o))
                R[o] = bin(a, "+" if m == "inc" else "-", num(1), "+")
                setflag(R[o])
                return
            gm = re.match(r"^%s$" % MEMW, o)
            if gm:
                nmv = N.integer(int(gm.group(1), 16))
                out.append("%s = %s %s 1" % (nmv, nmv, "+" if m == "inc" else "-"))
                setflag(E(nmv))
                return
        if m == "neg" and o in REGS:
            R[o] = E("-(%s)" % (R.get(o) or E(self.rtmp(o))).s, "unary")
            return
        if m == "not" and o in REGS:
            R[o] = E("NOT (%s)" % (R.get(o) or E(self.rtmp(o))).s, "unary")
            return
        if m == "xchg":
            g2 = re.match(r"^(ax|bx|cx|dx|si|di), (ax|bx|cx|dx|si|di)$", o)
            if g2:
                a, b = g2.group(1), g2.group(2)
                va = R.get(a) or E(self.rtmp(a))
                vb = R.get(b) or E(self.rtmp(b))
                R[a], R[b] = vb, va
                return
        if m == "imul":
            a = R.get("ax") or E(self.rtmp("ax"))
            R["ax"] = bin(a, "*", self._src(o, R), "*")
            R.pop("dx", None)
            return

    def _imm(self, s):
        try:
            return int(s, 0)
        except ValueError:
            return 1

    # ---------------------------------------------------------- penerbitan
    XFER = re.compile(r"^(GOTO |RETURN$|IF .* THEN \d|ON .* GOSUB |GOSUB )")

    SAFE = re.compile(r"^[A-Z0-9!#%$ ()+\-*/\\.]+$")

    @staticmethod
    def hoist(stmts):
        """Angkat SUBEKSPRESI bersama yang muncul dua kali di satu baris.

        `IF A(x + B) = A(y + B)` menuliskan B dua kali; pada tabel penilaian 3DTTT B
        sepanjang 85 karakter, dan baris seperti itu ada ratusan. Yang dicari adalah
        potongan berkurung SEIMBANG terpanjang yang berulang -- bukan sekadar indeks
        yang identik seluruhnya, karena kedua indeks di baris itu berbeda.

        Hanya ekspresi bilangan bulat yang diangkat (harus memuat CINT dan lolos
        daftar karakter aman), supaya variabel bantu integer tidak memotong nilai
        pecahan."""
        out = []
        for st in stmts:
            best = None
            for i, ch in enumerate(st):
                if ch != "(":
                    continue
                depth = 0
                for j in range(i, len(st)):
                    if st[j] == "(":
                        depth += 1
                    elif st[j] == ")":
                        depth -= 1
                        if depth == 0:
                            sub = st[i:j + 1]
                            if (len(sub) >= 25 and st.count(sub) >= 2
                                    and "CINT(" in sub and Rec.SAFE.match(sub)
                                    and (best is None or len(sub) > len(best))):
                                best = sub
                            break
            if best:
                # potongan yang diangkat SELALU diapit kurung; kalau ia kebetulan
                # adalah kurung indeks larik itu sendiri, penggantinya harus tetap
                # berkurung -- `G3!L8%` bukan BASIC yang sah
                out.append("L8%% = %s" % best)
                out.append(st.replace(best, "(L8%)"))
            else:
                out.append(st)
        return out

    def _gen(self, line_of):
        """Hasilkan pernyataan tiap blok, dengan materialisasi register hidup
        disisipkan SEBELUM ekor alih-kendali -- kalau tidak, penugasannya berada
        setelah GOTO dan tak pernah dieksekusi."""
        # bendera masuk: hanya bila SATU-SATUNYA pendahulu adalah blok tepat sebelumnya
        # (jatuh-melalui). Lebih dari itu tak bisa dipastikan dan dibiarkan kosong.
        pred = collections.defaultdict(list)
        for a, b in self.blk:
            for s in self.succ.get(a, ()):
                pred[s].append(a)
        out = []
        flag_out = {}
        for i, (a, b) in enumerate(self.blk):
            fin = None
            if i and len(pred.get(a, [])) == 1 and pred[a][0] == self.blk[i - 1][0]:
                fin = flag_out.get(self.blk[i - 1][0])
            stmts, R, fo, (fv, fty, fu, sv), notes = self.block(
                a, b, line_of, fin, self.creg.get(a))
            self.fac_use[a] = fu
            self.fac_def[a] = fv is not None
            flag_out[a] = fo
            mat = []
            # Temp string yang belum dikonsumsi bisa dipakai blok lain: subrutin
            # pengubah huruf HOPPER mengembalikan hasilnya lewat register, dan tanpa
            # ini `S2$ = <hasil>` kehilangan nilainya. Harus masuk lewat `mat` supaya
            # tersisip SEBELUM ekor alih-kendali -- kalau ditempel di akhir daftar,
            # ia berada sesudah RETURN dan tak pernah dieksekusi.
            if sv is not None and sv.s != "X9$":
                mat.append("X9$ = %s" % sv.s)
            if (fv is not None and fv.s != self.ftmp(fty)
                    and a in self.fac_live_out):
                mat.append("%s = %s" % (self.ftmp(fty), fv.s))
            for r in sorted(self.live_out.get(a, ())):
                v = R.get(r)
                if v is None or v.s == self.rtmp(r):
                    continue
                # Nilai KONSTAN tak perlu variabel bantu: propagasi konstanta sudah
                # menyalurkannya ke tiap penerus. Menuliskannya tetap menambah ribuan
                # penugasan mati -- pada 3DTTT itu selisih antara muat dan tidak muat
                # di ruang kerja 64 KB.
                if re.match(r"^\d+$", v.s) and self.succ.get(a) and all(
                        self.creg.get(x, {}).get(r) == int(v.s)
                        for x in self.succ[a]):
                    continue
                mat.append("%s = %s" % (self.rtmp(r), v.s))
            if mat:
                cut = len(stmts)
                while cut and self.XFER.match(stmts[cut - 1]):
                    cut -= 1
                stmts = stmts[:cut] + mat + stmts[cut:]
            stmts = self.hoist(stmts)
            if notes:
                stmts = stmts + ["REM ?? " + ", ".join(sorted(set(notes)))]
            out.append((a, stmts))
        return out

    MAXLEN = 200          # batas keras GW-BASIC 255; sisakan ruang untuk nomor baris

    @staticmethod
    def chunks(stmts):
        """Pecah daftar pernyataan menjadi beberapa baris fisik.

        GW-BASIC menolak baris di atas 255 karakter dengan `Line buffer overflow`,
        dan satu baris PRINT labirin di sini panjangnya ribuan karakter."""
        out, cur, n = [], [], 0
        for s in stmts:
            if cur and n + len(s) + 3 > Rec.MAXLEN:
                out.append(cur)
                cur, n = [], 0
            cur.append(s)
            n += len(s) + 3
            # THEN/ELSE menyerap SISA BARIS: apa pun sesudahnya di baris yang sama
            # hanya jalan di cabang itu. Pernyataan berikutnya harus pindah baris.
            if " THEN " in s or " ELSE " in s:
                out.append(cur)
                cur, n = [], 0
        if cur:
            out.append(cur)
        return out

    def fac_liveness(self):
        """Blok mana yang benar-benar mewariskan FAC ke penerusnya.

        Menyimpan FAC di setiap akhir blok menambah ribuan penugasan mati; pada 3DTTT
        itu ikut mendorong programnya melewati ruang kerja 64 KB GW-BASIC."""
        live = set()
        for _ in range(30):
            ch = False
            for a, b in self.blk:
                for x in self.succ.get(a, ()):
                    if self.fac_use.get(x) or (x in live and not self.fac_def.get(x)):
                        if a not in live:
                            live.add(a)
                            ch = True
            if not ch:
                break
        return live

    def explicit_targets(self):
        """Alamat yang dituju lompatan/GOSUB/ON..GOTO secara eksplisit.

        Blok seperti ini WAJIB punya nomor baris sendiri. Menyaring hanya lewat
        `pred == {blok sebelumnya}` tidak cukup: sebuah target GOSUB yang kebetulan
        juga jatuh-melalui dari blok tepat sebelumnya lolos, lalu nomor barisnya
        hilang dan `GOSUB` menunjuk baris yang tak ada."""
        T = set()
        for a, k, v in self.st:
            if k == "insn":
                m = re.match(r"^0x([0-9a-f]+)$", v.op_str)
                if m and (v.mnemonic.startswith("j") or v.mnemonic in ("loop", "call")):
                    T.add(int(m.group(1), 16))
            elif k == "call":
                tgt, nm, raw = v
                if nm == "GOSUB" and len(raw) >= 2:
                    T.add(struct.unpack_from("<H", raw, 0)[0])
                elif nm in ("ON_GOSUB", "ON_GOTO") and raw:
                    for j in range(raw[0]):
                        T.add(struct.unpack_from("<H", raw, 1 + 2 * j)[0])
        return T

    def merge_fallthrough(self, gen):
        """Gabungkan blok yang HANYA bisa dimasuki lewat jatuh-melalui ke pendahulunya.

        GW-BASIC menyimpan 5 byte overhead per baris (2 tautan, 2 nomor, 1 penutup).
        Rekonstruksi 3DTTT punya 1.869 baris, jadi overhead itu sendiri 9 KB -- lebih
        besar daripada kekurangan memorinya. Blok tanpa pendahulu lain dan tanpa
        pelompat masuk bisa disatukan tanpa mengubah arti."""
        pred = collections.defaultdict(set)
        for a, b in self.blk:
            for x in self.succ.get(a, ()):
                pred[x].add(a)
        stmts = dict(gen)
        XFER = self.XFER
        hasil, induk = [], {}
        for i, (a, _b) in enumerate(self.blk):
            st = stmts.get(a)
            if st is None:
                continue
            prev = self.blk[i - 1][0] if i else None
            bisa = (prev is not None and pred.get(a) == {prev}
                    and a not in self._etgt
                    and prev in induk and stmts.get(prev) is not None
                    and not any(XFER.match(x) for x in stmts[prev]))
            if bisa and hasil and hasil[-1][0] == induk[prev]:
                # `REM` mengomentari sisa baris, jadi catatan kedua blok dikumpulkan
                # dan ditempel sekali di ujung baris gabungan
                gabung = [x for x in hasil[-1][1] if not x.startswith("REM ??")] + \
                         [x for x in st if not x.startswith("REM ??")]
                notes = [x[7:] for x in hasil[-1][1] + list(st) if x.startswith("REM ??")]
                if notes:
                    urut = sorted(set(", ".join(notes).split(", ")))
                    gabung.append("REM ?? " + ", ".join(urut))
                hasil[-1] = (hasil[-1][0], gabung)
                induk[a] = induk[prev]
                stmts[a] = hasil[-1][1]
            else:
                hasil.append((a, list(st)))
                induk[a] = a
        # peta alamat -> alamat baris yang memuatnya
        return hasil, induk

    def emit(self):
        self.liveness()
        self._etgt = self.explicit_targets()
        self.creg = self.const_regs()
        self.fac_use, self.fac_def, self.fac_live_out = {}, {}, set()
        prov = {a: i for i, (a, b) in enumerate(self.blk)}
        first = self._gen(prov)
        # Blok bisa butuh BEBERAPA baris fisik, jadi nomor baris dialokasikan per blok
        # dengan jatah sesuai jumlah potongannya (plus kelonggaran, karena lebar nomor
        # baris di pass kedua bisa sedikit berbeda dan menggeser titik potong).
        # 1..99 disisakan untuk DIM di kepala berkas
        self.fac_live_out = self.fac_liveness()
        self.unhandled.clear()      # hitungan pass penjajakan jangan ikut terhitung
        first = self._gen(prov)
        gab, induk = self.merge_fallthrough(first)
        line_of, n = {}, 100
        num_of = {}
        for a, s in gab:
            num_of[a] = n
            n += (len(self.chunks(s)) + 2) * 10
        # blok yang digabung memakai nomor baris induknya; blok kosong dialihkan ke
        # blok berisi berikutnya
        nxt = None
        for a, s in reversed(first):
            if a in induk and induk[a] in num_of:
                nxt = num_of[induk[a]]
            line_of[a] = nxt if nxt is not None else 100
        self.N = Names()          # ulangi penomoran nama agar deterministik
        final = self._gen(line_of)
        # Pengelompokan dipakai ULANG dari lintasan pertama. Menghitung ulang bisa
        # menghasilkan kepala blok yang berbeda -- lalu nomor baris yang sudah
        # dirujuk GOTO/GOSUB tidak lagi ada.
        stf = dict(final)
        out, urut = {}, []
        for a, _b in self.blk:
            st = stf.get(a)
            if not st:
                continue
            h = induk.get(a, a)
            if h not in out:
                out[h] = []
                urut.append(h)
            bersih = [x for x in st if not x.startswith("REM ??")]
            catat = [x[7:] for x in st if x.startswith("REM ??")]
            out[h] = [x for x in out[h] if not x.startswith("REM ??")] + bersih
            lama = [x[7:] for x in stf.get(h, []) if False]
            if catat:
                out[h].append("REM ?? " + ", ".join(sorted(set(
                    ", ".join(catat).split(", ")))))
        return [(line_of[h], out[h], h) for h in urut if out[h]], line_of

    # `ON ERROR GOTO 0` BUKAN lompatan: nol di situ berarti mematikan penangkap
    # galat. Tanpa pengecualian ini, fix_refs memperlakukannya sebagai rujukan ke
    # baris 0 yang tak terbit lalu mengalihkannya ke baris terbit pertama (100),
    # sehingga penangan galat justru memasang ulang dirinya ke awal program.
    TREF = re.compile(r"(?<!ON ERROR )\b(GOTO|THEN|GOSUB)((?: \d+,)* \d+)")

    @staticmethod
    def fix_refs(lines):
        """Alihkan rujukan ke nomor baris yang tidak terbit.

        Sebuah blok bisa menghasilkan nol pernyataan di lintasan kedua sesudah blok
        digabung, sementara nomornya sudah telanjur dialokasikan dan dirujuk. Nomor
        yang hilang dialihkan ke baris terbit BERIKUTNYA -- itu tepat sama dengan
        jatuh-melalui, jadi artinya tidak berubah."""
        ada = sorted(ln for ln, _s, _a in lines)
        aset = set(ada)
        import bisect

        def peta(n):
            if n in aset:
                return n
            i = bisect.bisect_left(ada, n)
            return ada[i] if i < len(ada) else ada[-1]

        def sub(m):
            nums = [str(peta(int(x))) for x in m.group(2).replace(",", " ").split()]
            return m.group(1) + " " + ", ".join(nums)

        return [(ln, [Rec.TREF.sub(sub, x) for x in st], a) for ln, st, a in lines]

    TMP = re.compile(r"\b([XL]\d+[%!#$])")
    ASSIGN = re.compile(r"^([XL]\d+[%!#$]) = (.*)$")

    @classmethod
    def drop_dead_temps(cls, lines):
        """Buang penugasan variabel bantu yang tak pernah dibaca lagi.

        Liveness di dalam rekompiler bekerja pada model MESIN: ia menandai bx hidup
        karena rutin runtime membacanya. Tetapi keluaran BASIC belum tentu ikut
        membacanya -- kalau tak ada penangan di blok itu yang meminta bx, `X2%` tak
        pernah muncul di teksnya. Akibatnya X2% ditugasi 355 kali dan dibaca 63 kali.
        Analisis ini berjalan pada TEKS yang benar-benar terbit, jadi yang tersisa
        hanya penugasan yang memang dipakai."""
        idx = {ln: i for i, (ln, _st, _a) in enumerate(lines)}
        n = len(lines)
        succ = [[] for _ in range(n)]
        # RETURN kembali ke pemanggil. Tanpa tepi itu, liveness meremehkan dan
        # penugasan yang hidup di seberang GOSUB ikut terhapus -- gelung penggambar
        # papan 3DTTT berhenti di tengah karena ini.
        after_gosub = [i + 1 for i, (_l, st, _a) in enumerate(lines)
                       if i + 1 < n and any(re.match(r"^(GOSUB |ON .* GOSUB )", x)
                                            for x in st)]
        for i, (ln, st, _a) in enumerate(lines):
            jatuh = True
            for x in st:
                for m in cls.TREF.finditer(x):
                    for t in m.group(2).replace(",", " ").split():
                        j = idx.get(int(t))
                        if j is not None:
                            succ[i].append(j)
                if x == "RETURN":
                    jatuh = False
                    succ[i].extend(after_gosub)
                elif re.match(r"^(GOTO |END$)", x):
                    jatuh = False
                elif re.match(r"^(GOSUB |ON .*)", x):
                    jatuh = True
            if jatuh and i + 1 < n:
                succ[i].append(i + 1)

        gen, kill = [], []
        for _ln, st, _a in lines:
            u, d = set(), set()
            for x in st:
                m = cls.ASSIGN.match(x)
                if m:
                    for t in cls.TMP.findall(m.group(2)):
                        if t not in d:
                            u.add(t)
                    d.add(m.group(1))
                else:
                    for t in cls.TMP.findall(x):
                        if t not in d:
                            u.add(t)
            gen.append(u)
            kill.append(d)

        li = [set() for _ in range(n)]
        for _ in range(60):
            ubah = False
            for i in range(n - 1, -1, -1):
                o = set()
                for j in succ[i]:
                    o |= li[j]
                baru_i = gen[i] | (o - kill[i])
                if baru_i != li[i]:
                    li[i] = baru_i
                    ubah = True
            if not ubah:
                break

        out = []
        for i, (ln, st, a) in enumerate(lines):
            hidup = set()
            for j in succ[i]:
                hidup |= li[j]
            simpan = []
            for x in reversed(st):
                m = cls.ASSIGN.match(x)
                if m and m.group(1) not in hidup:
                    continue                      # penugasan mati
                if m:
                    hidup.discard(m.group(1))
                    hidup |= set(cls.TMP.findall(m.group(2)))
                else:
                    hidup |= set(cls.TMP.findall(x))
                simpan.append(x)
            out.append((ln, list(reversed(simpan)) or ["REM"], a))
        return out

    def text(self):
        lines, _ = self.emit()
        lines = self.fix_refs(lines)
        lines = self.drop_dead_temps(lines)
        out = []
        # larik: GW-BASIC hanya memberi 10 elemen tanpa DIM, dan indeks di sini
        # bisa jauh melampauinya. DIM diletakkan di baris sebelum 10.
        # Ukuran DIM diturunkan PER LARIK dari ekspresi indeksnya, bukan disamaratakan.
        # Papan 3DTTT dialamati base-5 `(a*5+b)*5+c` -- dengan koordinat 1..5 indeks
        # tertingginya 155; 200 memberi kelonggaran. Larik lain diindeks variabel kecil (nomor
        # hantu, lajur) dan 40 sudah lebih dari cukup. Menyamaratakan 160 untuk semua
        # membuat 3DTTT kehabisan ruang kerja.
        body = " | ".join(" : ".join(st) for _, st, _ in lines)
        def indeks(nmv):
            """Semua ekspresi indeks larik ini. Kurung bisa bersarang beberapa tingkat
            (`((a * 5 + b) * 5 + c)`), jadi regex tidak cukup -- hitung kurungnya."""
            outi, k = [], 0
            while True:
                k = body.find(nmv + "(", k)
                if k < 0:
                    return outi
                j = k + len(nmv)
                depth, start = 0, j
                while j < len(body):
                    if body[j] == "(":
                        depth += 1
                    elif body[j] == ")":
                        depth -= 1
                        if depth == 0:
                            outi.append(body[start + 1:j])
                            break
                    j += 1
                k = j + 1

        def batas(expr, koor=4):
            """Nilai indeks TERBESAR yang mungkin: ganti tiap variabel dengan koordinat
            maksimum lalu hitung. Menebak satu ukuran untuk semua larik tidak jalan --
            papan 3DTTT base-5 tiga tingkat butuh ~160, tetapi tabel penilaiannya empat
            tingkat dengan pengali 8 dan 3 butuh ribuan.

            Koordinat maksimum 4: papannya 4x4x4 dan gelung yang mengindeksnya
            berjalan `1 TO 4`; langkah 5 pada perataan larik adalah stride, bukan
            jangkauan. Memakai 5 melebihkan larik terbesar sekitar 20%."""
            e = expr.replace("CINT(", "(")
            e = re.sub(r"\b[A-Z]+\d*[%!#]", str(koor), e)
            e = e.replace("\\", "//").replace(" AND ", " & ").replace(" OR ", " | ")
            if not re.fullmatch(r"[\d\s()+\-*/%&|]+", e):
                return None
            try:
                return int(eval(e))
            except Exception:
                return None

        dims = []
        for base, nmv in sorted(self.N.a.items()):
            perlu = 10
            for e in indeks(nmv):
                v = batas(e)
                if v is not None and v > perlu:
                    perlu = v
            if nmv in self.gfxarr:
                # penampung GET/PUT: butuh 4 byte kepala + bitmap; 2000 elemen
                # integer (4 KB) cukup untuk sprite terbesar HOPPER
                dims.append("%s(2000)" % nmv)
            else:
                dims.append("%s(%d)" % (nmv, perlu + 2))
        n, cur = 1, []
        for d in dims:
            cur.append(d)
            if sum(len(x) + 2 for x in cur) > 140:
                out.append("%d DIM %s" % (n, ", ".join(cur))); n += 1; cur = []
        if cur:
            out.append("%d DIM %s" % (n, ", ".join(cur)))
        # baris DATA: ditempatkan sesudah DIM dan sebelum badan program, dipecah
        # supaya tiap baris jauh di bawah batas 255 karakter
        for _off, vals in self.data_table():
            for k in range(0, len(vals), 20):
                n += 1
                out.append("%d DATA %s" % (n, ",".join(str(v) for v in vals[k:k + 20])))
        last = 10
        for ln, s, a in lines:
            for k, ch in enumerate(self.chunks(s)):
                out.append("%d %s" % (ln + k * 10, " : ".join(ch)))
                last = max(last, ln + k * 10)
        out.append("%d END" % (last + 10))
        return out


def main():
    stem = sys.argv[1] if len(sys.argv) > 1 else "PAC-GAL"
    r = Rec(stem)
    for l in r.text()[:70]:
        print(l[:150])
    print("\nbelum tertangani:", dict(r.unhandled.most_common(20)))


if __name__ == "__main__":
    main()
