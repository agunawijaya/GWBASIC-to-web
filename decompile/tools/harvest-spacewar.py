# -*- coding: utf-8 -*-
"""Panen string SPACEWAR.EXE -> web/games/spacewar/spacewar-data.js

SPACEWAR satu-satunya dari keempat EXE yang TIDAK PERNAH BASIC: assembly murni,
5 relokasi lawan 786-2.357 milik yang lain. Tidak ada `.bas` yang bisa jadi basis
port-nya, jadi yang bisa dipanen bukan kode melainkan TEKS -- dan ternyata
teksnya memuat seluruh aturan mainnya, dicetak program itu sendiri ke layar.

Semua yang ditulis berkas keluaran DIBACA DARI BINER, tidak ada yang diketik
tangan. Offset tiap potong ikut ditulis supaya bisa diperiksa ulang:

    python -c "import io; print(io.open('run/SPACEWAR.EXE','rb').read()[0x3c39:0x3c6e])"

Pemakaian:
    python decompile/tools/harvest-spacewar.py
"""
import io, json, os, sys

AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXE  = os.path.join(AKAR, "run", "SPACEWAR.EXE")
OUT  = os.path.join(AKAR, "web", "games", "spacewar", "spacewar-data.js")

b = io.open(EXE, "rb").read()


def s(off):
    """String cetak yang mulai tepat di `off`, sampai bita non-cetak pertama."""
    e = off
    while e < len(b) and 0x20 <= b[e] <= 0x7e:
        e += 1
    return b[off:e].decode("ascii")


def blok(a, z, minlen=4):
    """Semua string >= minlen di rentang [a, z), lengkap dengan offsetnya."""
    out, off = [], a
    while off < z:
        if 0x20 <= b[off] <= 0x7e:
            t = s(off)
            if len(t) >= minlen:
                out.append({"off": off, "teks": t})
            off += max(1, len(t))
        else:
            off += 1
    return out


data = {
    "berkas":    {"nama": "SPACEWAR.EXE", "bita": len(b)},
    "versi":     s(0x3647),
    "hakCipta":  s(0x3656) + s(0x3662),
    "syarat":    s(0x200).split("$")[0],     # pesan tolak kalau kartu grafisnya salah
    "farce":     s(0x200).split("$")[1],
    "instruksi": blok(0x3BD5, 0x3F70),       # layar GAME INSTRUCTIONS
    "shareware": blok(0x3F71, 0x4250),       # pemberitahuan USER-SUPPORTED
    "menu":      blok(0x42EA, 0x4340, 4),    # EXIT / PLAY / ROBOT / PLANET / GRAVITY / PAUSE
    "legenda":   blok(0x37AE, 0x3B60, 3),    # layar GAME KEYS
}

# --- peta tombol -----------------------------------------------------------
# Layar GAME KEYS memasang tiga baris tombol untuk tiap pemain, dan tiap tombol
# punya dua baris keterangan di bawahnya. Susunannya di berkas: tombol kiri,
# tombol kanan, keterangan-1 kiri, keterangan-1 kanan, keterangan-2 kiri,
# keterangan-2 kanan -- berulang tiga kali.
#
# Pemetaan di bawah TIDAK diketik lalu dipercaya: tiap barisnya menyebut offset,
# dan `assert` memastikan yang ada di offset itu memang tulisan yang dimaksud.
# Kalau offsetnya bergeser, skrip ini gagal keras alih-alih diam-diam salah.
PETA = [
    # (offset tombol, offset ket-1, offset ket-2)
    (0x3890, 0x38D1, 0x3914), (0x3898, 0x38D9, 0x391C), (0x38A0, 0x38E2, 0x3924),
    (0x3994, 0x39D5, 0x3A18), (0x399C, 0x39DD, 0x3A20), (0x39A4, 0x39E6, 0x3A29),
    (0x3A9A, 0x3ADB, 0x3B1F), (0x3AA2, 0x3AE3, 0x3B27), (0x3AAA, 0x3AEC, 0x3B30),
]
PETA_KANAN = [
    (0x38AD, 0x38F0, 0x3931), (0x38B5, 0x38F8, 0x3939), (0x38BD, 0x3901, 0x3941),
    (0x39B1, 0x39F4, 0x3A36), (0x39B9, 0x39FC, 0x3A3E), (0x39C1, 0x3A05, 0x3A47),
    (0x3AB7, 0x3AFA, 0x3B3E), (0x3ABF, 0x3B02, 0x3B46), (0x3AC7, 0x3B0B, 0x3B4F),
]

def peta(daftar):
    out = []
    for ot, o1, o2 in daftar:
        out.append({"tombol": s(ot).strip(), "offTombol": ot,
                    "aksi": (s(o1).strip() + " " + s(o2).strip()).strip(),
                    "off1": o1, "off2": o2})
    return out

data["kiri"]  = peta(PETA)
data["kanan"] = peta(PETA_KANAN)

# Yang dijaga assert: tombolnya satu karakter, dan pasangan kiri-kanan punya
# aksi yang SAMA -- itulah yang membuktikan pemetaannya tidak tergeser satu slot.
for sisi in ("kiri", "kanan"):
    for e in data[sisi]:
        assert len(e["tombol"]) == 1, (sisi, e)
assert [e["tombol"] for e in data["kiri"]]  == list("QWEASDZXC"), data["kiri"]
assert [e["tombol"] for e in data["kanan"]] == list("789456123"), data["kanan"]
for a, b_ in zip(data["kiri"], data["kanan"]):
    assert a["aksi"] == b_["aksi"], (a, b_)

# Pemeriksaan: kalau salah satu blok kosong, offsetnya sudah bergeser dan
# berkas keluarannya akan diam-diam salah. Lebih baik gagal keras.
for k in ("instruksi", "shareware", "menu", "legenda"):
    assert data[k], "blok %s kosong -- offsetnya bergeser?" % k
assert data["versi"] == "V1.50", data["versi"]
assert "1985" in data["hakCipta"], data["hakCipta"]
assert len(data["instruksi"]) == 16, len(data["instruksi"])

# --- sprite kapal ----------------------------------------------------------
# Parameternya dibaca dari kode, bukan ditebak. Rinciannya di `spritedec.py`;
# ringkasnya: `sub_45CA` menyalin dengan XOR dan menggeser saat menggambar, dan
# pemanggilnya di 17990/17999 memilih basis 0x1340 (kiri) dan 0x1540 (kanan),
# 16 sudut, strid 32, 16 baris x 2 bita.
SPRITE = {"kiri": 0x1340, "kanan": 0x1540}
HEADER = 0x200


def sprite(basis, sudut, tinggi=16, lebar_bita=2, strid=32):
    a = HEADER + basis + sudut * strid
    e = b[a:a + tinggi * lebar_bita]
    keluar = []
    for r in range(tinggi):
        p = e[r * lebar_bita:(r + 1) * lebar_bita]
        # bita ganjil ditulis lebih dulu (`ah` sebelum `al` di sub_45CA)
        layar = bytes(v for k in range(0, len(p), 2) for v in (p[k + 1], p[k]))
        keluar.append("".join("#" if (x >> (7 - j)) & 1 else "."
                              for x in layar for j in range(8)))
    return keluar


data["sprite"] = {
    "catatan": "16 sudut per kapal, 16x16 piksel, dipanen dari tabel di biner",
    "basis": {k: hex(v) for k, v in SPRITE.items()},
    "sudut": 16, "strid": 32, "lebar": 16, "tinggi": 16,
    "penyalin": "sub_45CA",
    "kiri":  [sprite(SPRITE["kiri"], i) for i in range(16)],
    "kanan": [sprite(SPRITE["kanan"], i) for i in range(16)],
}

# Kalau salah satu sudut kosong, basis atau strid-nya salah -- gagal keras.
for sisi in ("kiri", "kanan"):
    for i, g in enumerate(data["sprite"][sisi]):
        isi = sum(r.count("#") for r in g)
        assert 20 < isi < 200, (sisi, i, isi)

# --- font ------------------------------------------------------------------
# `sub_46DD` (offset citra 18141): bp=0x22a0 | and bx,0x7f | shl bx,4 | ch=8
# -> font ASCII, strid 16 bita, 8 baris, 16 piksel lebar, maju 10 piksel.
# Perkecualian: 0x0D balik ke kolom awal, 0x0A turun 8, 0x1F spasi setengah,
# 0x20 cuma maju. Kode di bawah 0x20 lainnya glif bingkai kotak.
FONT = 0x22A0


def glif(kode):
    a = HEADER + FONT + (kode & 0x7F) * 16
    e = b[a:a + 16]
    return ["".join("#" if (x >> (7 - j)) & 1 else "." for x in (e[r * 2 + 1], e[r * 2])
                    for j in range(8)) for r in range(8)]


# Yang dipanen: seluruh ASCII tercetak, plus glif bingkai yang benar-benar
# dipakai string sebarisnya.
BINGKAI = [0x08, 0x0B, 0x0C, 0x15, 0x19, 0x1B, 0x1C, 0x1D, 0x1E]
data["font"] = {
    "catatan": "font milik program itu sendiri, diindeks ASCII, 16x8 piksel",
    "basis": hex(FONT), "strid": 16, "maju": 10, "penggambar": "sub_46DD",
    "glif": {("%02X" % k): glif(k) for k in list(range(0x20, 0x5B)) + BINGKAI},
}
assert sum(r.count("#") for r in data["font"]["glif"]["41"]) > 10, "glif A kosong"
assert sum(r.count("#") for r in data["font"]["glif"]["20"]) == 0, "spasi tidak kosong"

js = [
    "/* spacewar-data.js — DIPANEN dari run/SPACEWAR.EXE, bukan diketik tangan.",
    " *",
    " * Dihasilkan `decompile/tools/harvest-spacewar.py`. Tiap entri membawa offset",
    " * bita-nya di dalam EXE, jadi tiap baris di halaman bisa dilacak balik ke",
    " * tempatnya di berkas 1985 itu. Angka aturan mainnya BUKAN karangan: ia",
    " * kalimat yang program itu sendiri cetak ke layar.",
    " */",
    "window.RETRO = window.RETRO || {};",
    "window.RETRO.SPACEWAR = " + json.dumps(data, indent=1, ensure_ascii=False) + ";",
    "",
]
io.open(OUT, "w", encoding="utf-8").write("\n".join(js))
print("instruksi :", len(data["instruksi"]), "baris")
print("shareware :", len(data["shareware"]), "baris")
print("menu      :", [m["teks"] for m in data["menu"]])
print("legenda   :", len(data["legenda"]), "potong")
print("versi     :", data["versi"], "|", data["hakCipta"])
print("peta      :", " ".join(e["tombol"] + "=" + e["aksi"] for e in data["kiri"]))
print("->", OUT)
