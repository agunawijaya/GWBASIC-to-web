"""Lapisan menengah (IR) untuk rekonstruksi .bas yang bisa di-RUN.

Berbeda dari emit2.py yang cuma mengintip 3 byte sebelum tiap panggilan, modul ini
membangun aliran instruksi yang SELARAS dan model data yang benar:

  1. Situs far call diambil dari tabel relokasi -- ini kebenaran dasar, bukan tebakan.
  2. Panjang argumen SEBARIS tiap rutin dipecahkan lewat penyelarasan: potongan antara
     dua situs panggilan harus habis dibongkar tepat di situs berikutnya. k byte yang
     membuatnya selaras adalah panjang argumen sebaris rutin itu.
  3. String dibaca lewat DESKRIPTOR BASCOM yang sebenarnya -- (len:word, ptr:word),
     alamat runtime = offset berkas + DELTA. Bukan lagi tebakan "ada teks ASCII di sini".

Yang ketiga memperbaiki cacat yang menyebabkan literal palsu menempel ke panggilan yang
tidak menerimanya (lihat emit2.py:71 dan pembahasan pewarisan bx).
"""
import os, struct, re, collections
from capstone import Cs, CS_ARCH_X86, CS_MODE_16

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
ROOT = r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile"
HERE = os.path.dirname(os.path.abspath(__file__))

# delta alamat runtime terhadap offset berkas dalam DGROUP, dipecahkan secara empiris
# (17 suara lawan 2 untuk derau; lihat catatan di VERIFICATION.md)
DELTA = 4

TY = {2: "%", 3: "$", 4: "!", 8: "#"}
SEP = {0: ",", 1: ";", 2: ""}


def load_cfg():
    src = open(os.path.join(HERE, "emit2.py"), encoding="utf-8").read()
    ns = {}
    exec(re.search(r"^CFG=\{.*?^\}", src, re.S | re.M).group(0), ns)
    return ns["CFG"]


CFG = load_cfg()


class Prog:
    def __init__(self, stem):
        self.stem = stem
        T = stem + ".EXE"
        self.C = C = CFG[T]
        d = open(os.path.join(RUN, T), "rb").read()
        hdr = struct.unpack_from("<H", d, 8)[0] * 16
        nrel = struct.unpack_from("<H", d, 6)[0]
        rof = struct.unpack_from("<H", d, 0x18)[0]
        self.img = img = d[hdr:]
        self.base = C["base"]
        self.end = C["end"]                    # nilai lama, dipakai bila derivasi gagal
        self.dg = img[self.base:]
        # --- situs far call (kebenaran dasar dari relokasi) ---
        self.sites = {}
        for k in range(nrel):
            o, s = struct.unpack_from("<HH", d, rof + 4 * k)
            r = s * 16 + o
            if r - 3 >= 0 and img[r - 3] == 0x9A:
                self.sites[r - 3] = (struct.unpack_from("<H", img, r)[0] * 16
                                     + struct.unpack_from("<H", img, r - 2)[0])
        # --- tabel stub PRINT ---
        self.stub = {}
        a, b = C["stub"]
        for t in range(a, b, 5):
            if img[t] == 0xE8:
                self.stub[t] = (img[t + 3], img[t + 4])
        self.named = C["named"]
        # Batas kode pengguna DITURUNKAN, bukan disetel tangan. Rutin runtime semuanya
        # berada di atas kode pengguna, jadi situs panggilan di bawah TARGET terendah
        # pasti milik pengguna. Nilai lama meleset di dua biner: PAC-GAL kelebihan 311
        # byte (memakan awal runtime), 3DTTT justru MEMOTONG 314 byte kode pengguna.
        lowest = min(self.sites.values()) if self.sites else self.end
        usites = sorted(x for x in self.sites if x < lowest)
        # Rutin runtime AWAL juga memuat situs panggilan di bawah target terendah, jadi
        # "situs terakhir di bawah target terendah" saja belum cukup. Teks hak cipta
        # BASCOM ("Licensed Material - Program Property of IBM") duduk tepat di batas
        # antara kode pengguna dan runtime; deretan ASCII panjang pertama menandainya.
        batas = lowest
        i = 0
        while i < lowest:
            if 0x20 <= self.img[i] <= 0x7E:
                j = i
                while j < lowest and 0x20 <= self.img[j] <= 0x7E:
                    j += 1
                if j - i >= 20:
                    batas = i
                    break
                i = j
            else:
                i += 1
        usites = [x for x in usites if x < batas]
        if usites:
            self.end = usites[-1] + 5
        self.md = Cs(CS_ARCH_X86, CS_MODE_16)
        self.inline = {}
        self._solve_inline()

    # ---------- string ----------
    def sdesc(self, R):
        """R = alamat runtime. Kembalikan teks bila R menunjuk deskriptor string sah."""
        a = R - DELTA
        if a < 0 or a + 4 > len(self.dg):
            return None
        L, P = struct.unpack_from("<HH", self.dg, a)
        if L == 0:
            return ""
        if L > 255:
            return None
        t = P - DELTA
        if t < 0 or t + L > len(self.dg):
            return None
        s = self.dg[t:t + L]
        # teks BASIC boleh memuat CP437 di atas 0x7F (ubin labirin), tapi bukan kendali
        if any(c < 0x20 and c not in (9, 10, 13) for c in s):
            return None
        return s.decode("latin1")

    # ---------- nama rutin ----------
    def rname(self, tgt):
        if tgt in self.stub:
            al, ah = self.stub[tgt]
            return "PRINT<%s%s>" % (TY.get(al, "?"), SEP.get(ah, "?"))
        return self.named.get(tgt)

    # ---------- argumen sebaris ----------
    def _walk(self, lo, hi, skip0=0):
        """Bongkar [lo,hi). Kembalikan (instruksi, selaras?) -- selaras bila berakhir
        tepat di hi tanpa menabrak situs panggilan yang diketahui."""
        pc = lo + skip0
        out = []
        while pc < hi:
            try:
                ins = next(self.md.disasm(self.img[pc:pc + 16], pc, 1))
            except StopIteration:
                return out, False
            if ins.mnemonic == "(bad)":
                return out, False
            nxt = ins.address + ins.size
            if nxt > hi:
                return out, False
            out.append(ins)
            pc = nxt
        return out, pc == hi

    def _body(self, a, n=40):
        pc = a
        out = []
        for _ in range(n):
            try:
                ins = next(self.md.disasm(self.img[pc:pc + 16], pc, 1))
            except StopIteration:
                break
            if ins.mnemonic == "(bad)":
                break
            out.append(ins)
            if ins.mnemonic in ("ret", "retf", "iret", "jmp"):
                break
            pc = ins.address + ins.size
        return out

    def _reads_inline(self, tgt, depth=1):
        """Berapa byte SEBARIS yang dimakan rutin ini.

        Tandanya: alamat kembali JAUH dipanen (`pop <reg>` lalu `pop ds|es`), lalu
        dibaca lewat `lodsb`/`lodsw` atau `mov al, es:[di]`. Polanya sering berada di
        HELPER yang dipanggil rutin itu -- FACSTORE! (PAC-GAL) menaruhnya di @12831 --
        jadi penelusuran turun satu tingkat lewat `call` dekat.
        """
        seq = self._body(tgt)
        n = 0
        pop_seg = False
        pop_gpr = False
        for i, ins in enumerate(seq):
            if ins.mnemonic == "pop" and ins.op_str in ("si", "di", "ax", "bx", "cx", "dx"):
                pop_gpr = True
            # `pop <reg>` dan `pop ds` tidak selalu bersebelahan: GOSUB (PAC-GAL @16453)
            # menyelipkan `mov [0x1e], sp` di antaranya.
            if ins.mnemonic == "pop" and ins.op_str in ("ds", "es") and pop_gpr:
                pop_seg = True
            if pop_seg and ins.mnemonic in ("lodsb",):
                n += 1
            elif pop_seg and ins.mnemonic in ("lodsw",):
                n += 2
            elif pop_seg and ins.mnemonic == "mov" and "es:[di]" in ins.op_str:
                n += 1
        if n:
            return n
        if depth:
            for ins in seq:
                if ins.mnemonic == "call":
                    m = re.match(r"^0x([0-9a-f]+)$", ins.op_str)
                    if m:
                        k = self._reads_inline(int(m.group(1), 16), depth - 1)
                        if k:
                            return k
        return 0

    def _solve_inline(self):
        """Panjang argumen sebaris per rutin.

        Bukti A -- TUBUH rutin memanen alamat kembali dan membacanya (decisive).
        Bukti B -- PENYELARASAN: potongan antara dua situs panggilan hanya habis
                   dibongkar bila k byte pertama dilewati.
        Keduanya dicatat; ketidaksepakatan dilaporkan alih-alih ditelan diam-diam.
        """
        S = sorted(s for s in self.sites if s < self.end)
        votes = collections.defaultdict(collections.Counter)
        for i, s in enumerate(S[:-1]):
            tgt = self.sites[s]
            nxt = S[i + 1]
            gap = nxt - (s + 5)
            if gap < 0 or gap > 64:
                continue
            for k in range(0, min(gap, 8) + 1):
                _, ok = self._walk(s + 5, nxt, k)
                if ok:
                    votes[tgt][k] += 1
                    break
        self.inline_conflict = []
        for tgt in set(self.sites[s] for s in S):
            body = self._reads_inline(tgt)
            c = votes.get(tgt)
            align = c.most_common(1)[0][0] if c else None
            if body:
                self.inline[tgt] = body
                if align is not None and align != body and c[body] == 0:
                    self.inline_conflict.append((tgt, body, align, dict(c)))
            elif align and c[align] >= 2 and c[0] == 0:
                self.inline[tgt] = align
        return self.inline

    # ---------- pembongkaran selaras ----------
    def stream(self):
        """Aliran (addr, kind, payload) untuk kode pengguna, selaras dengan situs."""
        S = set(s for s in self.sites if s < self.end)
        pc = 26
        out = []
        while pc < self.end:
            if pc in S:
                tgt = self.sites[pc]
                k = self.inline.get(tgt, 0)
                # ON ... GOSUB membawa tabel lompat SEBARIS: byte cacah lalu N word.
                # Panjangnya berubah-ubah per situs, jadi tak bisa disimpan per rutin.
                if self.rname(tgt) in ("ON_GOSUB", "ON_GOTO"):
                    k = 1 + 2 * self.img[pc + 5]
                raw = self.img[pc + 5:pc + 5 + k]
                out.append((pc, "call", (tgt, self.rname(tgt), raw)))
                pc += 5 + k
                continue
            try:
                ins = next(self.md.disasm(self.img[pc:pc + 16], pc, 1))
            except StopIteration:
                out.append((pc, "db", self.img[pc]))
                pc += 1
                continue
            if ins.mnemonic == "(bad)" or ins.address + ins.size > self.end:
                out.append((pc, "db", self.img[pc]))
                pc += 1
                continue
            # jangan biarkan sebuah instruksi menelan situs panggilan
            if any(pc < s < pc + ins.size for s in S):
                out.append((pc, "db", self.img[pc]))
                pc += 1
                continue
            out.append((pc, "insn", ins))
            pc = ins.address + ins.size
        return out


if __name__ == "__main__":
    import sys
    for stem in (sys.argv[1:] or ["PAC-GAL", "3DTTT", "HOPPER"]):
        p = Prog(stem)
        st = p.stream()
        nb = sum(1 for _, k, _ in st if k == "db")
        nc = sum(1 for _, k, _ in st if k == "call")
        ni = sum(1 for _, k, _ in st if k == "insn")
        print("%-8s %5d insn | %4d call | %4d byte nyasar | inline: %s"
              % (stem, ni, nc, nb, {p.rname(t) or ("@%d" % t): k
                                    for t, k in sorted(p.inline.items())}))
