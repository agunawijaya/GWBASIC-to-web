"""Tangkap LAYAR TEKS sebuah program DOS, untuk menguji klaim tentang isinya.

Kenapa ini ada
--------------
`comrun.py` membuang framebuffer grafis, dan itu tepat untuk permainan yang menggambar
piksel. Tetapi PAC-GAL merakit labirinnya dari karakter CP437 lewat PRINT, dan 3DTTT
menggambar papannya dengan LOCATE dan PRINT. Keduanya mode TEKS, jadi framebuffer
CGA-nya kosong dan `--png` selalu menghasilkan bingkai hitam.

Menariknya, penyangga teks di 0xB800 juga kosong: BASCOM menyalurkan keluaran konsol
lewat BIOS, dan `comrun` mencatat `INT 10h` lalu mengabaikannya. Jadi isi layarnya tidak
ada di memori mana pun -- ia hanya lewat sebagai panggilan.

Berkas ini mencegat panggilan itu. Ia TIDAK mengubah comrun.py; ia meng-import-nya dan
menurunkan Machine, lalu membungkus `_on_int` untuk memelihara kisi 80x25 sendiri.

Yang diikuti
------------
  ah=0x00  set mode        -> kosongkan layar, catat modenya
  ah=0x02  posisi kursor   -> dh=baris, dl=kolom
  ah=0x06  gulung jendela  -> al=0 berarti kosongkan persegi
  ah=0x09  tulis karakter+atribut, cx kali, TANPA memindahkan kursor
  ah=0x0A  tulis karakter saja, cx kali
  ah=0x0E  teletype        -> tulis lalu majukan kursor, tangani CR dan LF
"""
import sys, importlib.util
from pathlib import Path

COMRUN = Path(r"C:\Projects\DOS-Decompiler\tools\comrun.py")
spec = importlib.util.spec_from_file_location("comrun", COMRUN)
comrun = importlib.util.module_from_spec(spec)
sys.modules["comrun"] = comrun
spec.loader.exec_module(comrun)

from unicorn.x86_const import (UC_X86_REG_AX, UC_X86_REG_BX, UC_X86_REG_CX,
                               UC_X86_REG_DX)

W, H = 80, 25


class TextMachine(comrun.Machine):
    """Machine milik comrun, ditambah model layar teks."""

    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.scr = [[0x20] * W for _ in range(H)]
        self.row = self.col = 0
        # Mode video BERJALAN, bukan hanya riwayat permintaannya. DOS menyerahkan
        # mesin dalam mode 3 (teks warna 80x25); comrun tak punya keadaan video
        # sama sekali, jadi tanpa nilai awal ini `int 10h ah=0Fh` menjawab 0 --
        # dan mode 0 berarti layar 40 kolom. Lihat _on_int ah=0x0F.
        self.mode = 3
        self.modes = []
        self.writes = 0
        self._pasang_hook_framebuffer()

    def _pasang_hook_framebuffer(self):
        """Ikuti juga penulisan LANGSUNG ke B800, bukan hanya INT 10h.

        Menulis ke sel paling kanan lewat teletype akan memajukan kursor melewati
        ujung baris dan menggulung layar, jadi program yang menggambar kotak sampai
        kolom 80 menaruh karakter sudutnya langsung ke framebuffer. 3DTTT melakukan
        persis itu untuk `╝` di baris 23 kolom 80: satu-satunya sel yang tak pernah
        lewat INT 10h. Tanpa hook ini sudut itu hilang dari sisi EXE, dan wasit
        melaporkannya sebagai selisih terhadap .bas yang menggambarnya lengkap.
        """
        from unicorn import UC_HOOK_MEM_WRITE

        def tulis(uc, acc, addr, size, val, ud):
            # HANYA di mode teks. Di mode grafis B800 adalah penyangga PIKSEL, bukan
            # pasangan karakter/atribut -- menafsirkannya sebagai teks membuat byte
            # piksel muncul sebagai karakter (0x55 jadi "U", 0x05 jadi "♣") dan layar
            # HOPPER terbaca seolah dunianya digambar dengan huruf.
            if self.mode not in (0, 1, 2, 3, 7):
                return
            off = addr - comrun.VIDEO
            for k in range(size):
                o = off + k
                if o % 2:                      # byte ganjil = atribut warna
                    continue
                sel = o // 2
                r, c = sel // W, sel % W
                if 0 <= r < H and 0 <= c < W:
                    self.scr[r][c] = (val >> (8 * k)) & 0xFF
                    self.writes += 1

        self.uc.hook_add(UC_HOOK_MEM_WRITE, tulis,
                         begin=comrun.VIDEO, end=comrun.VIDEO + W * H * 2 - 1)

    def _put(self, ch):
        if 0 <= self.row < H and 0 <= self.col < W:
            self.scr[self.row][self.col] = ch
            self.writes += 1

    def _scroll(self, n, top, left, bot, right):
        bot = min(bot, H - 1); right = min(right, W - 1)
        if n == 0:                       # al=0 -> kosongkan seluruh persegi
            for r in range(top, bot + 1):
                for c in range(left, right + 1):
                    self.scr[r][c] = 0x20
            return
        for _ in range(n):
            for r in range(top, bot):
                self.scr[r][left:right + 1] = self.scr[r + 1][left:right + 1]
            for c in range(left, right + 1):
                self.scr[bot][c] = 0x20

    def _on_int(self, uc, num, _):
        if num == 0x10:
            # Catat DULU lewat kelas dasar, baru ubah register.
            #
            # Beberapa penangan di bawah menulis AX sebagai nilai kembali
            # (ah=08h menaruh atribut di byte tinggi, ah=0Fh menaruh jumlah
            # kolom). Kelas dasar membaca AX untuk mencatat nomor fungsinya,
            # jadi kalau ia dipanggil belakangan ia mencatat nilai KEMBALI,
            # bukan fungsi yang diminta -- ah=08h tercatat sebagai 0x07 dan
            # seolah tak pernah dipanggil. Untuk int 10h kelas dasar memang
            # tidak melakukan apa-apa selain mencatat, jadi urutan ini aman.
            super()._on_int(uc, num, _)
            ax = uc.reg_read(UC_X86_REG_AX)
            ah, al = (ax >> 8) & 0xFF, ax & 0xFF
            cx = uc.reg_read(UC_X86_REG_CX)
            dx = uc.reg_read(UC_X86_REG_DX)
            if ah == 0x00:
                self.modes.append(al)
                self.mode = al
                self.scr = [[0x20] * W for _ in range(H)]
                self.row = self.col = 0
            elif ah == 0x08:
                # Baca karakter DAN atribut di posisi kursor.
                #
                # Inilah cara `SCREEN(baris, kolom)` BASCOM bekerja: ia menyetel
                # kursor dengan ah=02h lalu membaca dengan ah=08h (PAC-GAL @21120,
                # dua panggilan berturut-turut). Tanpa ini fungsinya mengembalikan
                # sampah, dan gelung permainan PAC-GAL -- yang seluruh deteksi
                # tabrakannya bersandar pada `SCREEN()` -- tak akan pernah benar.
                #
                # Model layar di sini memang penyangga yang sama yang ditulis
                # ah=09h/0Ah/0Eh, jadi menjawab dari sini setara dengan BIOS yang
                # membaca memori video.
                ch = (self.scr[self.row][self.col]
                      if 0 <= self.row < H and 0 <= self.col < W else 0x20)
                uc.reg_write(UC_X86_REG_AX, (0x07 << 8) | ch)
            elif ah == 0x0F:
                # Ambil mode video kini: al=mode, ah=jumlah kolom, bh=halaman.
                #
                # comrun tidak menangani int 10h sama sekali, jadi ax kembali
                # apa adanya dan BASCOM membaca mode 0. Startup-nya lalu
                # menghitung lebar dari mode itu (`cmp al,2 / jb` -> 40) dan
                # menyimpan 40 di [0x6f6], batas yang diuji LOCATE. PAC-GAL
                # kemudian meminta kolom 60 dan runtime melempar
                # `Illegal function call` -- galat yang dulu dikira cacat
                # rekonstruksi. Menjawab pertanyaan ini memperbaikinya.
                cols = 40 if self.mode in (0, 1, 4, 5) else W
                uc.reg_write(UC_X86_REG_AX, (cols << 8) | self.mode)
                bx = uc.reg_read(UC_X86_REG_BX)
                uc.reg_write(UC_X86_REG_BX, bx & 0x00FF)
            elif ah == 0x02:
                self.row, self.col = (dx >> 8) & 0xFF, dx & 0xFF
            elif ah == 0x06:
                bx = uc.reg_read(UC_X86_REG_BX)
                self._scroll(al, (cx >> 8) & 0xFF, cx & 0xFF,
                             (dx >> 8) & 0xFF, dx & 0xFF)
            elif ah in (0x09, 0x0A):
                n = max(1, cx)
                for i in range(n):
                    if self.col + i < W:
                        self.scr[self.row][self.col + i] = al
                self.writes += n
            elif ah == 0x0E:
                if al == 0x0D:
                    self.col = 0
                elif al == 0x0A:
                    self.row += 1
                    if self.row >= H:
                        self._scroll(1, 0, 0, H - 1, W - 1); self.row = H - 1
                elif al == 0x08:
                    self.col = max(0, self.col - 1)
                else:
                    self._put(al); self.col += 1
                    if self.col >= W:
                        self.col = 0; self.row += 1
            return None            # int 10h sudah dicatat di awal
        return super()._on_int(uc, num, _)

    # CP437 rentang 0x01-0x1F: di layar PC byte-byte ini BUKAN karakter kendali,
    # melainkan glif. Codec cp437 Python memetakannya ke U+0001..U+001F, lalu
    # penormalan wasit membuangnya sebagai karakter kendali -- sementara PC-BASIC
    # mengembalikan glifnya. Baris tombol fungsi 3DTTT ("↑UP ↓DOWN ←LEFT →RIGHT")
    # karenanya terbaca kosong di sisi EXE dan berisi di sisi .bas, dan selisih
    # itu tampak seperti cacat rekonstruksi padahal cuma beda penerjemahan.
    GLIF = (" ☺☻♥♦♣♠•◘○◙"
            "♂♀♪♫☼►◄↕‼¶"
            "§▬↨↑↓→←∟↔▲▼")

    # ---------------------------------------------------------------- berkas FCB
    #
    # comrun tidak menangani layanan FCB gaya lama sama sekali. HOPPER membaca
    # papan skornya lewat `int 21h ah=21h` (baca acak FCB), dan tanpa jawaban
    # gelungnya berputar selamanya: 18.023 percobaan baca dalam satu jalan, dan
    # EXE-nya tak pernah sampai ke kode gambar. Framebuffer yang tetap kosong itu
    # sempat terbaca sebagai "grafisnya tak bisa diverifikasi", padahal programnya
    # cuma tak pernah tiba di sana.
    def _dos(self, uc, ah):
        if ah in (0x0F, 0x10, 0x14, 0x21):
            return self._fcb(uc, ah)
        return super()._dos(uc, ah)

    def _cari(self, nama):
        if self.files is None:
            return None
        for f in self.files.iterdir():
            if f.is_file() and f.name.upper() == nama.upper():
                return f
        return None

    def _fcb(self, uc, ah):
        import struct as _s
        from unicorn.x86_const import UC_X86_REG_DS, UC_X86_REG_DX
        fcb = (uc.reg_read(UC_X86_REG_DS) << 4) + uc.reg_read(UC_X86_REG_DX)
        raw = bytes(uc.mem_read(fcb + 1, 11))
        stem, ext = raw[:8].decode("latin-1").strip(), raw[8:].decode("latin-1").strip()
        nama = stem + ("." + ext if ext else "")

        if ah == 0x0F:                                  # buka
            p = self._cari(nama)
            self._isi = p.read_bytes() if p else None
            if self._isi is None:
                uc.reg_write(UC_X86_REG_AX, 0xFF)
                return
            uc.mem_write(fcb + 12, b"\x00\x00")         # blok kini
            uc.mem_write(fcb + 14, _s.pack("<H", 128))  # ukuran rekaman
            uc.mem_write(fcb + 16, _s.pack("<I", len(self._isi)))
            uc.mem_write(fcb + 32, b"\x00")             # rekaman kini
            uc.reg_write(UC_X86_REG_AX, 0)
        elif ah == 0x10:                                # tutup
            uc.reg_write(UC_X86_REG_AX, 0)
        else:                                           # 0x14/0x21 baca
            rs = _s.unpack("<H", bytes(uc.mem_read(fcb + 14, 2)))[0] or 128
            if ah == 0x21:
                rec = _s.unpack("<I", bytes(uc.mem_read(fcb + 33, 4)))[0]
            else:
                blok = _s.unpack("<H", bytes(uc.mem_read(fcb + 12, 2)))[0]
                rec = blok * 128 + uc.mem_read(fcb + 32, 1)[0]
            isi = getattr(self, "_isi", None) or b""
            off = rec * rs
            if off >= len(isi):
                uc.reg_write(UC_X86_REG_AX, 1)          # 1 = habis berkas
                return
            potong = isi[off:off + rs]
            kurang = rs - len(potong)
            uc.mem_write(self.dta, potong + b"\x00" * kurang)
            uc.reg_write(UC_X86_REG_AX, 3 if kurang else 0)

    def pixels(self):
        """Framebuffer CGA mode 4 sebagai kisi 320x200 nilai 0-3.

        Tata letaknya berselang-seling: baris genap mulai di offset 0, baris ganjil
        di 0x2000, masing-masing 80 byte, empat piksel per byte dengan bit paling
        berarti lebih dulu. Ini yang membuat perbandingan piksel dua sisi mungkin --
        sisi .bas datang dari `get_pixels()` PC-BASIC dengan nilai 0-3 yang sama.
        """
        fb = bytes(self.uc.mem_read(comrun.VIDEO, 0x4000))
        kisi = []
        for y in range(200):
            dasar = (y & 1) * 0x2000 + (y >> 1) * 80
            baris = []
            for b in fb[dasar:dasar + 80]:
                baris += [(b >> 6) & 3, (b >> 4) & 3, (b >> 2) & 3, b & 3]
            kisi.append(baris)
        return kisi

    def text(self):
        """Layar sebagai daftar baris, ditafsirkan seperti layar PC sungguhan."""
        return ["".join(self.GLIF[c] if c < 0x20 else
                        "⌂" if c == 0x7F else
                        bytes([c]).decode("cp437") for c in r).rstrip()
                for r in self.scr]


def main():
    import argparse
    # Layar CP437 penuh karakter gambar-kotak, dan konsol Windows baku cp1252
    # tak bisa menyandikannya -- tanpa ini seluruh cetakan mati UnicodeEncodeError
    # justru ketika programnya berhasil menggambar sesuatu.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("binary")
    ap.add_argument("--budget", type=int, default=40_000_000)
    ap.add_argument("--keys", default="")
    ap.add_argument("--poll-patience", type=int, default=200)
    ap.add_argument("--files")
    ap.add_argument("--timer-isr")
    ap.add_argument("--out")
    a = ap.parse_args()

    img = Path(a.binary).read_bytes()
    # escape diurai sama seperti runbas.py; tanpa ini "\x1b" masuk sebagai
    # empat karakter harfiah dan kedua sisi wasit menerima masukan BERBEDA
    keys = [ord(c) for c in a.keys.encode().decode("unicode_escape")]
    m = TextMachine(img, keys=keys, files=a.files)
    m.poll_patience = a.poll_patience
    if a.timer_isr:
        n, every = (a.timer_isr.split(",") + ["200000"])[:2]
        m.isr_num, m.isr_every = int(n, 16), int(every)
    m.run(budget=a.budget)

    print("berhenti: %s | mode video diminta: %s | penulisan karakter: %d"
          % (m.stopped, m.modes or "(tidak ada)", m.writes))
    lines = m.text()
    print("+" + "-" * W + "+")
    for r in lines:
        print("|" + r.ljust(W) + "|")
    print("+" + "-" * W + "+")
    if a.out:
        Path(a.out).write_text("\n".join(lines), encoding="utf-8")
        print("-> %s" % a.out)


if __name__ == "__main__":
    main()
