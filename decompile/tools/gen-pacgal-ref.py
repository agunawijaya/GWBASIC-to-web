# -*- coding: utf-8 -*-
"""Menghasilkan dokumen rujukan PAC-GAL dari SUMBERNYA, bukan dari ingatan.

    web/games/pacgal/GEOMETRY.md   <- diturunkan dari maze.js
    web/games/pacgal/GHOSTS.md     <- diturunkan dari pacgal.js

Alasan berkas ini ada: geometri labirin itu STATIS, tapi berkali-kali digali
ulang dari kode tiap kali ada yang perlu diperiksa. Sekali salah baca, salahnya
diam-diam ikut ke perbaikan berikutnya -- dan itu yang terjadi pada gerbang
kandang: dikira satu sel, ternyata dua, dan tiga gejala berbeda lahir darinya.

Karena itu dokumennya DIHASILKAN, bukan diketik. Angka di dalamnya tidak bisa
menyimpang dari kode, sebab ia dibaca dari kode. Tiap tetapan yang dikutip
GHOSTS.md diambil lewat regex yang gagal keras kalau tetapannya hilang atau
berganti nama -- jadi mengubah kode tanpa memperbarui dokumen akan MEMATAHKAN
skrip ini, bukan membuat dokumennya berbohong.

Jalankan:  python decompile/tools/gen-pacgal-ref.py
"""
import io
import os
import re
from collections import deque

AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PACGAL = os.path.join(AKAR, "web", "games", "pacgal")
MAZE_JS = os.path.join(PACGAL, "maze.js")
GAME_JS = os.path.join(PACGAL, "pacgal.js")
OUT_GEO = os.path.join(PACGAL, "GEOMETRY.md")
OUT_GHO = os.path.join(PACGAL, "GHOSTS.md")

SPASI, PELET, TEROWONGAN = u" ", u"∙", u"─"
KOLOM = 40          # sel per baris (satu sel = dua kolom layar)


# ---------------------------------------------------------------------------
# Membaca sumber
# ---------------------------------------------------------------------------
def baca(p):
    return io.open(p, encoding="utf-8").read()


def ambil_baris_labirin(teks):
    """Larik string 80-kolom dari `window.RETRO.PACGAL_ROWS` di maze.js.

    Sengaja mengikat ke nama lariknya, bukan "ambil string terpanjang": baris
    status di meta juga sepanjang 80 kolom, dan tebakan itu diam-diam
    menjadikannya baris ke-25."""
    i = teks.index("PACGAL_ROWS")
    j = teks.index("];", i)
    baris = re.findall(r'"((?:[^"\\]|\\.)*)"', teks[i:j])
    assert len(baris) == 24, "harusnya 24 baris petak, dapat %d" % len(baris)
    for b in baris:
        assert len(b) >= 79, "baris kependekan: %d" % len(b)
    return baris


def isi(templat, nilai):
    """Isi templat, meloloskan setiap '%' yang BUKAN ruang-isi sungguhan.

    Kutipan BASIC di dalam templat penuh dengan `I12%`, `J7%`, `I17%` --
    meloloskannya satu per satu dengan tangan cuma menunggu satu terlewat.

    Aturan "lolos-kan '%' yang tidak diikuti '('" TIDAK cukup, dan sempat
    memecahkan skrip ini: baris BASIC `J2%(I6%) = 7` punya '%' yang PERSIS
    diikuti '(' , jadi ia terbaca sebagai ruang-isi bernama `I6%`. Satu-satunya
    aturan yang benar: sesuatu itu ruang-isi hanya kalau namanya memang ada di
    kamus nilai. Selain itu, lolos-kan seluruh potongannya."""
    def rep(m):
        nama = m.group(1)
        if nama is not None and nama in nilai:
            return m.group(0)                       # ruang-isi sungguhan
        return "%%" + m.group(0)[1:].replace("%", "%%")
    return re.sub(r"%(?:\(([^)]{1,40})\))?", rep, templat) % nilai


def tetapan(teks, pola, nama, bendera=0):
    """Cari satu tetapan; gagal keras kalau tidak ada -- itu gunanya."""
    m = re.search(pola, teks, bendera)
    assert m, ("TETAPAN HILANG: %s. Kode berubah tanpa dokumennya ikut. "
               "Perbaiki pola di gen-pacgal-ref.py, jangan hapus assert-nya." % nama)
    return m


ROWS = ambil_baris_labirin(baca(MAZE_JS))
SRC = baca(GAME_JS)
MAZE_SRC = baca(MAZE_JS)


def sel(r, c):
    """Karakter di sel (baris, kolom-sel)."""
    if 0 <= r < len(ROWS) and 0 <= c * 2 < len(ROWS[r]):
        return ROWS[r][c * 2]
    return SPASI


def boleh_lewat(ch):
    return ch == SPASI or ch == PELET


def boleh_sel(r, c):
    return 0 <= r < len(ROWS) and 0 <= c < KOLOM and boleh_lewat(sel(r, c))


# ---------------------------------------------------------------------------
# Tetapan yang dikutip -- diambil dari pacgal.js, tidak diketik ulang
# ---------------------------------------------------------------------------
m = tetapan(SRC, r"const MULAI = \{ r: (\d+), c: (\d+) \}", "MULAI")
MULAI = (int(m.group(1)), int(m.group(2)))

m = tetapan(SRC, r"const KANDANG = \{ r: (\d+), cs: \[([\d, ]+)\] \}", "KANDANG")
KANDANG_R = int(m.group(1))
KANDANG_CS = [int(x) for x in m.group(2).split(",")]

m = tetapan(SRC, r"const GERBANG = \{ r: (\d+), c: (\d+) \}", "GERBANG")
GERBANG_R = int(m.group(1))

m = tetapan(SRC, r"adalahGerbang = \(r, c\) => r === GERBANG\.r "
                 r"&& \(c === (\d+) \|\| c === (\d+)\)", "adalahGerbang")
GERBANG_CS = [int(m.group(1)), int(m.group(2))]

m = tetapan(SRC, r"diKandang = \(r, c\) => r >= (\d+) && r <= (\d+)\s*"
                 r"&& c >= (\d+) && c <= (\d+)", "diKandang")
KND = [int(m.group(i)) for i in (1, 2, 3, 4)]   # r0 r1 c0 c1

m = tetapan(SRC, r"const ENERGIZER = (\[\[.*?\]\]);", "ENERGIZER")
ENERGIZER = [tuple(int(x) for x in p)
             for p in re.findall(r"\[(\d+), (\d+)\]", m.group(1))]

m = tetapan(SRC, r"const WATAK = \[(.*?)\n  \];", "WATAK", re.S)
WATAK = [(n, (int(a), int(b))) for n, a, b in
         re.findall(r"nama: '([^']+)', sudut: \[(\d+), (\d+)\]", m.group(1), re.S)]
assert len(WATAK) == 4, "harusnya 4 watak"

m = tetapan(SRC, r"const AMBANG_KELUAR = \[([\d, ]+)\]", "AMBANG_KELUAR")
AMBANG = [int(x) for x in m.group(1).split(",")]

m = tetapan(SRC, r"const PER_LANGKAH = ([\d.]+)", "PER_LANGKAH")
PER_LANGKAH = float(m.group(1))

m = tetapan(SRC, r"const SEBAR = \[([\d, ]+)\]", "SEBAR")
SEBAR = [int(x) for x in m.group(1).split(",")]

DEPAN = int(tetapan(SRC, r"const DEPAN = (\d+)", "DEPAN").group(1))
R_PEMALU = int(tetapan(SRC, r"const RADIUS_PEMALU = (\d+)", "RADIUS_PEMALU").group(1))
m = tetapan(SRC, r"const ELROY1 = (\d+), ELROY2 = (\d+)", "ELROY")
ELROY1, ELROY2 = int(m.group(1)), int(m.group(2))
I12_AWAL = int(tetapan(SRC, r"const I12_AWAL = (\d+)", "I12_AWAL").group(1))

m = tetapan(SRC, r"takut = Math\.round\(\(sisa / (\d+) \+ (\d+)\) / \(nyawa \* nyawa\)\)",
            "rumus takut")
TAKUT_BAGI, TAKUT_TAMBAH = int(m.group(1)), int(m.group(2))

m = tetapan(SRC, r"if \(h\.takut > 0 && !h\.dimakan && \(tik % (\d+)\)\) return;",
            "kecepatan takut")
TAKUT_LAMBAT = int(m.group(1))

m = tetapan(SRC, r"const NILAI_HANTU = \[([\d, ]+)\]", "NILAI_HANTU")
NILAI_HANTU = [int(x) for x in m.group(1).split(",")]

BEKU = float(tetapan(SRC, r"const BEKU_LAMA = ([\d.]+)", "BEKU_LAMA").group(1))

PELET_META = int(tetapan(MAZE_SRC, r'"pelet": (\d+)', "meta pelet").group(1))


# ---------------------------------------------------------------------------
# Pemeriksaan geometri: dokumen yang memeriksa dirinya sendiri
# ---------------------------------------------------------------------------
periksa = []


def cek(nama, syarat, rincian=""):
    periksa.append((nama, bool(syarat), rincian))
    return bool(syarat)


def langkah(r, c, dr, dc):
    """Satu langkah, aturan persis seperti `langkah()` di pacgal.js -- termasuk
    memeriksa ubin terowongan SEBELUM memeriksa bisa-dilewati."""
    nr, nc = r + dr, c + dc
    if nr < 0 or nr >= len(ROWS):
        return None
    if sel(nr, nc) == TEROWONGAN:
        nc = (KOLOM - 1) - c
    return (nr, nc) if boleh_sel(nr, nc) else None


def banjir(awal, lewat_gerbang):
    lihat, q = {awal}, deque([awal])
    while q:
        r, c = q.popleft()
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            p = langkah(r, c, dr, dc)
            if not p or p in lihat:
                continue
            if not lewat_gerbang and p[0] == GERBANG_R and p[1] in GERBANG_CS:
                continue
            lihat.add(p)
            q.append(p)
    return lihat


jangkau = banjir(MULAI, False)                       # yang dicapai pemain
dalam_kandang = banjir((KANDANG_R, KANDANG_CS[0]), False)   # yang dicapai dari kandang


# 1. Gerbang: sel terbuka di baris GERBANG_R, di dalam rentang dinding kandang.
gerbang_nyata = [c for c in range(KND[2] - 1, KND[3] + 2)
                 if boleh_sel(GERBANG_R, c)]
cek("Sel terbuka di baris gerbang (r%d) = sel yang dijaga adalahGerbang"
    % GERBANG_R, gerbang_nyata == GERBANG_CS,
    "petak: %s | kode: %s" % (gerbang_nyata, GERBANG_CS))

# 2. Interior kandang. DIUKUR dengan membanjiri dari sel start hantu tanpa
#    melewati gerbang -- jadi yang dihitung benar-benar ruang tertutup itu,
#    bukan jendela tebakan di sekitarnya. Versi pertama pemeriksaan ini menyapu
#    kotak baris 12..16 kolom 15..24 dan ikut menangkap lorong di luar kandang;
#    ia gagal bukan karena kodenya salah, melainkan karena alat ukurnya salah.
kotak_kode = set((r, c) for r in range(KND[0], KND[1] + 1)
                 for c in range(KND[2], KND[3] + 1))
cek("Ruang tertutup kandang (diukur dengan banjir) = kotak diKandang di kode",
    dalam_kandang == kotak_kode,
    "banjir %d sel, kode %d sel; selisih %s"
    % (len(dalam_kandang), len(kotak_kode),
       sorted(dalam_kandang ^ kotak_kode)[:8] or "tidak ada"))

# 3. Sel start hantu semuanya di dalam kandang, dan bisa dilewati.
cek("Keempat sel start hantu terbuka dan di dalam kotak diKandang",
    all(boleh_sel(KANDANG_R, c) and KND[0] <= KANDANG_R <= KND[1]
        and KND[2] <= c <= KND[3] for c in KANDANG_CS),
    "start: %s" % [(KANDANG_R, c) for c in KANDANG_CS])

# 4. Sel tepat di atas tiap gerbang terbuka -- kalau tidak, hantu terkurung.
cek("Sel di atas tiap gerbang terbuka (jalan keluar benar-benar ada)",
    all(boleh_sel(GERBANG_R - 1, c) for c in GERBANG_CS),
    "%s" % [((GERBANG_R - 1, c), sel(GERBANG_R - 1, c) != SPASI) for c in GERBANG_CS])

# 5. Start pemain & energizer bisa dilewati.
cek("Sel start pemain terbuka", boleh_sel(*MULAI), "%s" % (MULAI,))
cek("Keempat energizer di sel berpelet",
    all(sel(r, c) == PELET for r, c in ENERGIZER),
    "%s" % [(rc, sel(*rc)) for rc in ENERGIZER])

# 6. Sudut sebar. Keempatnya berada DI DALAM dinding tepi, dan itu memang
#    rancangan Pac-Man 1980: sasaran sebar sengaja dibuat tak terjangkau supaya
#    hantu tidak pernah "sampai" dan akhirnya berputar-putar di sudut itu.
#    Jadi yang perlu dipastikan bukan "bisa dilewati" -- pemeriksaan pertama di
#    sini salah karena menuntut itu -- melainkan bahwa tiap sudut punya sel
#    terjangkau yang dekat, dan keempatnya menarik ke empat penjuru berbeda.
sudut_dekat = []
for n, (sr, sc) in WATAK:
    d, p = min((abs(sr - r) + abs(sc - c), (r, c)) for r, c in jangkau)
    sudut_dekat.append((n, (sr, sc), p, d))
cek("Keempat sudut sebar tak terjangkau (rancangan 1980: hantu berputar di sudut)",
    all(not boleh_sel(r, c) for _, (r, c) in WATAK),
    "%s" % [(n, s) for n, s in WATAK])
cek("Tiap sudut sebar punya sel terjangkau berdekatan (<= 4 petak)",
    all(d <= 4 for _, _, _, d in sudut_dekat),
    " · ".join("%s %s->%s d=%d" % (n, s, p, d) for n, s, p, d in sudut_dekat))
cek("Keempat sudut sebar di empat penjuru berbeda",
    len(set((r < len(ROWS) // 2, c < KOLOM // 2) for _, (r, c) in WATAK)) == 4,
    "%s" % [s for _, s in WATAK])

# 7. Jangkauan: banjir dari start pemain harus menyentuh SEMUA pelet.
semua_pelet = [(r, c) for r in range(len(ROWS)) for c in range(KOLOM)
               if sel(r, c) == PELET]
tak_terjangkau = [p for p in semua_pelet if p not in jangkau]
cek("Semua %d pelet terjangkau dari start pemain tanpa lewat gerbang"
    % len(semua_pelet), not tak_terjangkau,
    "tak terjangkau: %s" % (tak_terjangkau[:8] or "tidak ada"))

cek("Jumlah pelet petak = angka 'dots' yang dicetak program sendiri",
    len(semua_pelet) == PELET_META,
    "petak %d, meta %d" % (len(semua_pelet), PELET_META))

# 8. Kandang benar-benar terkurung: tanpa gerbang, hantu tidak bisa keluar.
bocor = [p for p in dalam_kandang
         if not (KND[0] <= p[0] <= KND[1] and KND[2] <= p[1] <= KND[3])]
cek("Kandang tertutup rapat: satu-satunya jalan keluar adalah gerbang",
    not bocor, "kebocoran: %s" % (bocor[:8] or "tidak ada"))

# 9. Lewat gerbang, hantu bisa mencapai seluruh bagian yang dicapai pemain.
dari_kandang_buka = banjir((KANDANG_R, KANDANG_CS[0]), True)
cek("Lewat gerbang, hantu menjangkau seluruh petak yang dijangkau pemain",
    jangkau <= dari_kandang_buka,
    "selisih: %d sel" % len(jangkau - dari_kandang_buka))

# 10. Terowongan.
terowongan = [(r, c) for r in range(len(ROWS)) for c in range(KOLOM)
              if sel(r, c) == TEROWONGAN]
baris_terowongan = sorted(set(r for r, _ in terowongan))
cek("Ubin terowongan hanya di satu baris", len(baris_terowongan) == 1,
    "baris: %s" % baris_terowongan)

GAGAL = [n for n, ok, _ in periksa if not ok]


# ---------------------------------------------------------------------------
# Penggambaran petak
# ---------------------------------------------------------------------------
def peta(r0, r1, c0, c1, tandai=None):
    """Petak sebagai teks, dengan penggaris kolom. tandai: {(r,c): 'X'}."""
    tandai = tandai or {}
    lebar = c1 - c0 + 1
    puluh = "     " + "".join((str(c // 10) if c % 10 == 0 else " ")
                              for c in range(c0, c1 + 1))
    satuan = "     " + "".join(str(c % 10) for c in range(c0, c1 + 1))
    baris = [puluh, satuan, "    +" + "-" * lebar]
    for r in range(r0, r1 + 1):
        s = ""
        for c in range(c0, c1 + 1):
            if (r, c) in tandai:
                s += tandai[(r, c)]
            else:
                ch = sel(r, c)
                s += ("." if ch == PELET else
                      " " if ch == SPASI else
                      "=" if ch == TEROWONGAN else "#")
        baris.append("%3d |%s" % (r, s))
    return "\n".join(baris)


tanda = {}
for i, c in enumerate(KANDANG_CS):
    tanda[(KANDANG_R, c)] = str(i + 1)
for c in GERBANG_CS:
    tanda[(GERBANG_R, c)] = "G"
tanda[MULAI] = "P"
for r, c in ENERGIZER:
    tanda[(r, c)] = "O"
for i, (n, s) in enumerate(WATAK):
    tanda.setdefault(s, "abcd"[i])

# Sensus karakter.
sensus = {}
for r in range(len(ROWS)):
    for c in range(KOLOM):
        ch = sel(r, c)
        sensus[ch] = sensus.get(ch, 0) + 1


# ---------------------------------------------------------------------------
# GEOMETRY.md
# ---------------------------------------------------------------------------
def baris_periksa():
    out = []
    for n, ok, d in periksa:
        out.append("| %s | %s | %s |"
                   % ("LULUS" if ok else "**GAGAL**", n, d.replace("|", "\|")))
    return "\n".join(out)


def tabel_sensus():
    out = []
    for ch in sorted(sensus, key=lambda x: -sensus[x]):
        nama = {SPASI: "spasi", PELET: "pelet", TEROWONGAN: "terowongan"}.get(
            ch, "dinding")
        out.append("| `%s` | U+%04X | %d | %s | %s |"
                   % (ch if ch != SPASI else " ", ord(ch), sensus[ch], nama,
                      "ya" if boleh_lewat(ch) else
                      "khusus" if ch == TEROWONGAN else "tidak"))
    return "\n".join(out)


GEO = u"""# PAC-GAL — geometri labirin

> **DIHASILKAN** oleh `decompile/tools/gen-pacgal-ref.py` — jangan disunting tangan.
> Jalankan ulang skrip itu sesudah mengubah `maze.js` atau tetapan geometri di `pacgal.js`.

Berkas ini ada supaya geometri labirin **tidak perlu digali ulang dari kode**
setiap kali ada yang mau diperiksa. Ia statis; menggalinya berulang cuma
memberi kesempatan salah baca yang sama terjadi dua kali.

Dan itu bukan kekhawatiran teoretis. Gerbang kandang pernah dikira **satu** sel
padahal **dua**. Akibatnya hantu yang keluar lewat sel yang satunya tidak pernah
dianggap selesai keluar, dan tiga gejala yang kelihatannya tidak berhubungan —
hantu terjebak di kandang, hantu masuk kembali sendiri, hantu mondar-mandir di
atas kandang — semuanya lahir dari satu sel itu.

Yang lebih penting: uji otomatis waktu itu **lulus**, karena kotak "di dalam
kandang" pada ujinya dibangun dari empat posisi start hantu — asumsi yang sama
persis dengan yang bikin kodenya salah. Alat ukur yang mewarisi asumsi kode yang
diukurnya tidak akan pernah menemukan kesalahan itu. Karena itu tabel
[Pemeriksaan](#pemeriksaan) di bawah dibangun dari **petak**, bukan dari tetapan.

---

## Asal

| | |
|---|---|
| Sumber | %(sumber)s |
| Verifikasi | %(verifikasi)s |
| Ukuran | %(baris)d baris × %(kolom)d sel |
| Pelet | %(pelet)d |

Labirin ini **diukur, bukan disalin**: PAC-GAL tidak menyimpannya sebagai larik
di mana pun. Program membangunnya saat startup dari `CHR$`/`STRING$` lalu
mencetaknya baris demi baris, jadi satu-satunya tempat ia pernah berwujud utuh
adalah layar. Bukti yang memeriksa dirinya sendiri: jumlah pelet di petak ini
%(pelet)d, dan baris status yang dicetak programnya sendiri berbunyi `dots %(pelet)d`.

---

## Sistem koordinat

Ada **dua** sistem, dan mencampurnya adalah sumber kekeliruan yang paling
mudah terjadi di berkas ini.

| | Rentang | Dipakai oleh |
|---|---|---|
| **Kolom layar** | 0–79 | `maze.js` (string mentah), `at(r, c)` |
| **Kolom sel** | 0–%(kolmax)d | semua logika permainan: `pemain.c`, `h.c`, semua tetapan di bawah |

Sel `c` menempati kolom layar `2c` dan `2c+1`. Ubin selalu di kolom **genap**;
kolom ganjil selalu spasi. Karena itu `at(r, c * 2)` di `pacgal.js`.

Baris tidak punya dua sistem: baris 0–%(barmax)d, sama di keduanya.

**Semua koordinat di dokumen ini adalah (baris, kolom-sel).**

---

## Kamus ubin

| Karakter | Kode | Jumlah | Arti | Bisa dilewati |
|---|---|---|---|---|
%(sensus)s

`bolehLewat(ch)` di `pacgal.js` hanya menerima spasi dan pelet. Ubin terowongan
ditandai **khusus**: ia tidak lolos `bolehLewat`, tapi `langkah()` memeriksanya
lebih dulu dan memantulkan kolomnya — lihat [Terowongan](#terowongan).

---

## Petak lengkap

Tanda: `P` start pemain · `1`–`4` start hantu · `G` gerbang kandang ·
`O` energizer · `a`–`d` sudut sebar · `=` ubin terowongan · `#` dinding · `.` pelet

```
%(peta)s
```

---

## Kandang hantu

Bagian yang paling sering salah dibaca, jadi diperbesar:

```
%(peta_kandang)s
```

| | Nilai | Tetapan di `pacgal.js` |
|---|---|---|
| Baris gerbang | %(gr)d | `GERBANG.r` |
| **Sel gerbang** | **%(gcs)s** — dua sel, bukan satu | `adalahGerbang()` |
| Interior (baris) | %(kr0)d–%(kr1)d | `diKandang()` |
| Interior (kolom) | %(kc0)d–%(kc1)d — enam sel lebar, bukan empat | `diKandang()` |
| Baris start hantu | %(kandr)d | `KANDANG.r` |
| Kolom start hantu | %(kandcs)s | `KANDANG.cs` |

Perhatikan baris terakhir dibanding baris di atasnya: **start hantu menempati
kolom %(kandc0)d–%(kandc1)d, tapi kandangnya selebar kolom %(kc0)d–%(kc1)d.**
Menyamakan keduanya — mengira lebar kandang = jumlah hantu — adalah persis
kekeliruan yang dulu terjadi. Hantu yang berdiri di kolom %(kc1)d ada di dalam
kandang tapi tidak dikenali oleh kotak yang diturunkan dari posisi start.

### Aturan gerbang

Gerbang **satu arah**, dijaga di tiga tempat di `pacgal.js`:

1. Sasaran mode `kandang`/`keluar` adalah sel gerbang **terdekat** (`h.c >= %(gc1)d ? %(gc1)d : %(gc0)d`) —
   kalau selalu ke kolom %(gc0)d, hantu yang start di kolom %(gc1)d harus menyeberang dulu
   dan bisa saling menghalangi.
2. `bolehGerbang(h)` hanya benar untuk hantu yang sedang keluar, sedang di
   kandang, atau sudah dimakan dan pulang. Hantu yang sedang bermain tidak boleh
   melewatinya — tanpa aturan ini, hantu ketakutan yang bergerak acak bisa
   melangkah masuk dan terjebak.
3. Selesai keluar = `h.r < GERBANG.r`, yaitu **sudah berada di atas baris
   gerbang** — bukan menginjak satu sel tertentu. Syarat sel-tunggal adalah bug
   yang memicu perbaikan ini.

---

## Terowongan

Ubin `─` ada di baris **%(trow)s** saja, di kolom %(tkol)s.

`langkah()` memeriksa ubin terowongan **sebelum** memeriksa bisa-dilewati:

```js
if (at(nr, nc * 2) === TEROWONGAN) nc = 39 - c;
```

Jadi masuk ke ubin terowongan tidak berarti berdiri di atasnya — kolomnya
langsung dicerminkan ke `39 - c`. Berlaku untuk pemain maupun hantu.

Catatan penyimpangan: Pac-Man 1980 memperlambat hantu di terowongan. Port ini
tidak. Lihat `GHOSTS.md`.

---

## Koordinat penting

| Apa | Koordinat | Tetapan |
|---|---|---|
| Start pemain | %(mulai)s (menghadap kiri) | `MULAI` |
%(baris_hantu)s
| Energizer | %(energizer)s | `ENERGIZER` |

Energizer adalah **rekonstruksi, bukan pemulihan.** Aslinya memang punya keadaan
hantu-rentan dan rumus lamanya terpulihkan utuh, tapi pemicunya tidak: ujinya
`IF SCREEN(...) > 7`, dan setiap ubin labirin — pelet 249, spasi 32, dinding 205 —
semuanya lebih dari 7. Petak hasil panen juga tidak memuat ubin khusus yang bisa
jadi energizer. Empat sel sudut ini dipilih dengan mencari pelet terdekat ke tiap
sudut petak: konvensi Pac-Man, bukan temuan.

---

## Pemeriksaan

Dibangun dari **petak**, bukan dari tetapan — supaya bisa menemukan kesalahan
yang justru ada di tetapannya.

| Hasil | Pemeriksaan | Rincian |
|---|---|---|
%(periksa)s

%(ringkas)s
"""

meta_sumber = re.search(r'"sumber": "([^"]*)"', MAZE_SRC).group(1)
meta_verif = re.search(r'"verifikasi": "([^"]*)"', MAZE_SRC).group(1)

baris_hantu = "\n".join(
    "| Start hantu %d (%s) | %s | `KANDANG.cs[%d]` |"
    % (i + 1, WATAK[i][0], (KANDANG_R, c), i)
    for i, c in enumerate(KANDANG_CS))
baris_hantu += "\n" + "\n".join(
    "| Sudut sebar %s | %s | `WATAK[%d].sudut` |" % (n, s, i)
    for i, (n, s) in enumerate(WATAK))

ringkas = ("**Semua %d pemeriksaan lulus.**" % len(periksa) if not GAGAL else
           "**%d PEMERIKSAAN GAGAL:** %s" % (len(GAGAL), ", ".join(GAGAL)))

geo = isi(GEO, {
    "sumber": meta_sumber,
    "verifikasi": meta_verif,
    "baris": len(ROWS), "kolom": KOLOM, "pelet": len(semua_pelet),
    "kolmax": KOLOM - 1, "barmax": len(ROWS) - 1,
    "sensus": tabel_sensus(),
    "peta": peta(0, len(ROWS) - 1, 0, KOLOM - 1, tanda),
    "peta_kandang": peta(GERBANG_R - 2, KND[1] + 2, KND[2] - 3, KND[3] + 3, tanda),
    "gr": GERBANG_R, "gcs": " dan ".join(str((GERBANG_R, c)) for c in GERBANG_CS),
    "gc0": GERBANG_CS[0], "gc1": GERBANG_CS[1],
    "kr0": KND[0], "kr1": KND[1], "kc0": KND[2], "kc1": KND[3],
    "kandr": KANDANG_R, "kandcs": ", ".join(str(c) for c in KANDANG_CS),
    "kandc0": KANDANG_CS[0], "kandc1": KANDANG_CS[-1],
    "trow": ", ".join(str(r) for r in baris_terowongan),
    "tkol": ", ".join(str(c) for c in sorted(set(c for _, c in terowongan))),
    "mulai": str(MULAI),
    "baris_hantu": baris_hantu,
    "energizer": " · ".join(str(e) for e in ENERGIZER),
    "periksa": baris_periksa(),
    "ringkas": ringkas,
})

io.open(OUT_GEO, "w", encoding="utf-8").write(geo)


# ---------------------------------------------------------------------------
# GHOSTS.md
# ---------------------------------------------------------------------------
takut_awal = round((PELET_META / 5.0 + TAKUT_TAMBAH) / 9.0)
takut_detik = takut_awal * TAKUT_LAMBAT * PER_LANGKAH

jadwal = []
for i in range(len(SEBAR)):
    mode = "sebar" if (i + 1) % 2 else "kejar"
    akhir = SEBAR[i + 1] if i + 1 < len(SEBAR) else None
    jadwal.append("| %d | %s | tik %d%s | %.0f s%s |" % (
        i + 1, mode, SEBAR[i],
        "–%d" % (akhir - 1) if akhir else " dan seterusnya",
        SEBAR[i] * PER_LANGKAH,
        "–%.0f s" % ((akhir - 1) * PER_LANGKAH) if akhir else " →"))

GHO = u"""# PAC-GAL — perilaku hantu

> **DIHASILKAN** oleh `decompile/tools/gen-pacgal-ref.py` — jangan disunting tangan.
> Setiap angka di bawah dibaca langsung dari `pacgal.js`; skrip itu **gagal keras**
> kalau tetapannya hilang atau berganti nama, jadi dokumen ini tidak bisa
> diam-diam menyimpang dari kodenya.

Ada **dua mode**, dipilih lewat saklar *"hantu asli PAC-GAL"* di halaman. Itu
bukan tingkat kesulitan — keduanya menjalankan algoritma yang berbeda sama sekali,
dan keduanya punya alasan berbeda untuk ada.

| | Saklar **mati** | Saklar **hidup** |
|---|---|---|
| Nama | Konvensi Pac-Man 1980 | Asli PAC-GAL 1982 |
| Status | **rekonstruksi** | **pemulihan** |
| Fungsi | `gerakSatuHantu()` | `gerakAsli()` |
| Sasaran | empat sasaran berbeda | satu sasaran, sama untuk keempatnya |
| Mengejar? | ya | **tidak pernah** — lihat §3 |
| Kenapa ada | supaya bisa dimainkan | supaya bisa dilihat apa adanya |

Geometri yang dirujuk sepanjang dokumen ini — sel gerbang, kotak kandang, sudut
sebar — ada di [`GEOMETRY.md`](GEOMETRY.md). Jangan menggalinya ulang dari kode.

---

## 1. Mesin keadaan — berlaku di KEDUA mode

Setiap hantu selalu berada di salah satu keadaan ini:

```
   kandang ──(pelet cukup)──> keluar ──(h.r < %(gr)d)──> kejar/sebar
      ^                          ^                          │
      │                          │                    (dimakan pemain
      │                          │                     saat takut)
      │                          └───(sampai di sel start)──┐
      └──────────── pulang (h.dimakan = true) <─────────────┘
```

| Keadaan | Sasaran | Boleh lewat gerbang |
|---|---|---|
| `kandang` | sel gerbang terdekat | ya |
| `keluar` | sel gerbang terdekat | ya |
| `kejar` | lihat §2 / §3 | **tidak** |
| `sebar` | sudut watak sendiri | **tidak** |
| `dimakan` (pulang) | sel start sendiri | ya |

Tiga hal yang gampang dikira sepele padahal masing-masing pernah jadi bug:

- **Selesai keluar = `h.r < GERBANG.r`.** Bukan menginjak satu sel. Gerbangnya
  dua sel; syarat sel-tunggal membuat hantu yang lewat sel satunya terkurung
  dalam mode `keluar` selamanya.
- **Gerbang satu arah.** Tanpa itu, hantu ketakutan yang bergerak acak melangkah
  masuk kandang, modenya masih `kejar`, jadi jaring pengaman tidak kena dan ia
  terjebak. Ini gejala "hantu tiba-tiba respawn ke kotak awal".
- **Jaring pengaman:** hantu bermode `kejar`/`sebar` yang ternyata berada di
  dalam kotak kandang dikembalikan ke mode `keluar`. Kotak itu harus memakai
  lebar kandang yang sebenarnya, bukan lebar posisi start.

### Kapan hantu keluar kandang

Dihitung dari **pelet yang sudah dimakan**, bukan dari waktu:

| Hantu | Ambang | Dari %(peletmeta)d pelet |
|---|---|---|
%(ambang)s

Versi sebelumnya memakai penundaan **waktu** tetap, dan `reset()` memasangnya
ulang setiap kali pemain mati. Hantu keempat menunggu tiga belas detik — jadi
kalau pemain mati sebelum itu, ia **tidak pernah keluar sama sekali**, seumur
permainan. Dua hantu terakhir praktis tidak ikut bermain.

Pencacah pelet memperbaikinya karena `sisa` **tidak** di-reset saat pemain mati:
sesudah mati, keempatnya langsung keluar lagi. Ambangnya diskalakan ke %(peletmeta)d
pelet dan tetap **rekonstruksi** — PAC-GAL sendiri tidak punya aturan ini.

**Akibat praktis yang perlu diketahui sebelum melapor bug.** Hantu keempat butuh
%(ambang4)d pelet. Pemain yang berhati-hati, atau yang mati berkali-kali di awal,
bisa bermain cukup lama tanpa pernah melihatnya keluar — dan itu **bukan** hantu
yang macet, melainkan ambang yang belum tercapai. Cara memastikannya: lihat
angka "Pelet" di panel. Kalau sudah di bawah %(sisa4)d dan hantu keempat masih di
kandang, barulah itu cacat.

Pac-Man 1980 punya pengaman untuk keadaan ini yang **port ini tidak punya**:
pewaktu global yang melepas paksa hantu berikutnya kalau pemain tidak memakan
pelet apa pun selama beberapa detik. Lihat §5.

---

## 2. Mode Pac-Man 1980 (saklar mati) — REKONSTRUKSI

Diperiksa terhadap `pacman.fandom.com/wiki/Maze_Ghost_AI_Behaviors`, bagian
**"Pac-Man" saja** — bukan Arrangement 1996 dan seterusnya.

Aturan geraknya: di tiap langkah, coba semua arah **kecuali berbalik**, ambil
yang paling memperkecil jarak lurus ke sasaran. Berbalik hanya kalau buntu.
Larangan berbalik itu yang membuat hantu punya lintasan, bukan bergetar di tempat.

### Empat sasaran

| # | Nama | Padanan 1980 | Sudut sebar | Sasaran saat mengejar |
|---|---|---|---|---|
%(watak)s

**Pembayang** membidik `DEPAN = %(depan)d` petak di muka pemain.

**Penjepit** membidik `2 × (titik 2 petak di muka pemain) − posisi Pengejar` —
vektor dari Pengejar ke titik di depan pemain, digandakan. Itu sebabnya ia
menjepit: sasarannya bergantung pada di mana hantu **lain** berada.

**Pemalu** mengejar kalau jaraknya lebih dari `RADIUS_PEMALU = %(rpemalu)d` petak, dan
pulang ke sudutnya kalau lebih dekat. Dari sisi pemain ia terlihat seperti
mundur takut-takut — dan itu memang yang bikin sudut kiri-bawah relatif aman.

### Bug limpahan arah atas — SENGAJA DITIRU

```js
if (pemain.dr === -1 && pemain.dc === 0) c -= n;   // bug limpahan arah atas
```

Di mesin aslinya, offset arah ditambahkan lewat satu rutin yang, untuk arah
**atas**, juga menambahkan offset yang sama ke sumbu mendatar. Jadi saat pemain
menghadap atas, titik bidik Pembayang bukan %(depan)d petak di atasnya melainkan %(depan)d di
atas **dan** %(depan)d ke kiri.

Itu bug, bukan rancangan — tapi ia bug yang membentuk seluruh rasa main permainan
itu, karena ia yang membuat Pembayang bisa dikelabui dengan menghadap ke atas.
Meniru perilakunya tanpa meniru bugnya berarti meniru yang salah. Penjepit
memakai rutin yang sama, jadi ia mewarisi bug yang sama persis seperti di aslinya.

### Sebar / kejar bergantian

| Fase | Mode | Rentang | Perkiraan waktu |
|---|---|---|---|
%(jadwal)s

Tanpa pergantian ini, empat hantu yang semuanya mengejar akan menyudutkan pemain
sejak awal dan permainannya tidak bisa dimainkan.

### Mode marah (Cruise Elroy) — hanya Pengejar

| Tingkat | Pelet tersisa | Efek |
|---|---|---|
| 1 | ≤ %(elroy1)d | langkah tambahan tiap 4 tik; **berhenti ikut menyebar** |
| 2 | ≤ %(elroy2)d | langkah tambahan tiap 2 tik; berhenti ikut menyebar |

Ini yang mengubah akhir permainan dari "tinggal menyapu sisa" jadi kejaran
sungguhan. Tanpanya pelet terakhir selalu aman diambil. Berlaku **hanya di mode
1980** — PAC-GAL asli tidak punya padanannya.

---

## 3. Mode asli PAC-GAL (saklar hidup) — PEMULIHAN

Ini yang benar-benar dilakukan program 1982-nya. Tiga aturan, ketiganya dikutip
dari `pac-gal-run.bas`:

```basic
5210  IF CSNG(I12%) >= RND(2) THEN kejar ELSE jalan lurus
5270  kalau mengejar, koreksi hanya pada SUMBU YANG TIDAK SEDANG DITEMPUH
      (J7% = 0 -> samakan baris; selain itu -> samakan kolom)
----  sasarannya posisi pemain, SAMA untuk keempat hantu (I17%/I18%)
```

Perbedaan paling besar dari dugaan awal: **keempat hantu memakai pengejar yang
sama.** Satu-satunya yang membedakan mereka adalah nilai acak arah awal. Akibatnya
mereka menumpuk jadi satu rombongan dan permainannya gampang ditebak. Tidak ada
empat kepribadian; itu ditambahkan Pac-Man, bukan PAC-GAL.

### `I12%` — dan kenapa hantunya tidak pernah mengejar

```basic
1030  I12% = 0                      ' nilai awal
3320  I12% = CINT(I12% * 0.5)       ' saat pelet tersisa < 50
3680  I12% = I12% + I12%            ' mati saat pelet > 300, jika < 0,1
```

Nilai awalnya **nol**, dan kedua operasi yang mengubahnya cuma membagi dua dan
mengalikan dua. Nol tetap nol. Jadi syarat di 5210 tidak pernah benar, dan
hantunya **tidak pernah mengejar** — mereka berjalan lurus dan memantul.

Itu bukan cacat port ini; itu yang dilakukan pernyataan yang berhasil dipulihkan.
Nilainya ditampilkan di panel supaya bisa dilihat sendiri, dan kedua aturan
pengubahnya tetap dijalankan — kalau suatu saat pernyataan yang mengisi `I12%`
ditemukan, yang berubah cuma satu tetapan (`I12_AWAL`, sekarang `%(i12)d`).

Ini cocok dengan temuan terpisah di `decompile/PAC-GAL/ARCHITECTURE.md` §4b:
ada blok AI-pengejar di binernya yang **tidak pernah bisa dicapai**. Dua bukti
dari dua tempat berbeda, kesimpulan sama.

Perhatikan juga arah kedua aturan pengubahnya: keduanya **menurunkan** keganasan
saat pemain mendekati menang, dan **menaikkannya** saat pemain mati di awal —
kebalikan dari Cruise Elroy.

### Yang tidak terpulihkan

Apa yang terjadi saat langkah hantu menabrak dinding. Di sini dipilih arah sah
lain secara acak — perilaku memantul yang wajar untuk hantu yang arah awalnya
sendiri diundi. Itu **rekonstruksi**, dan satu-satunya di jalur ini.

---

## 4. Keadaan takut — berlaku di kedua mode

Rumusnya **asli**, dari baris 2880 `pac-gal-run.bas`:

```
takut = (sisa / %(tbagi)d + %(ttambah)d) / nyawa²
```

| | |
|---|---|
| Di awal permainan (%(peletmeta)d pelet, 3 nyawa) | %(takutawal)d giliran |
| Kecepatan saat takut | **sepertiga** — bergerak kalau `tik % %(tlambat)d === 0` |
| Lama sebenarnya di layar | ≈ %(takutdetik).1f detik |

Yang **diubah** bukan rumusnya, melainkan berapa lama satu "giliran" itu di
layar. Dengan setengah kecepatan, %(takutawal)d giliran cuma ≈%(takutsetengah).1f detik — dan karena
hantu bergerak **acak** saat takut (bukan kabur menjauh seperti Pac-Man 1980),
waktu sesingkat itu praktis tidak bisa dipakai: mereka tidak datang menghampiri,
jadi pemain tidak sempat mengejar. Dilaporkan pemilik proyek sebagai "hampir
tidak terasa". Sepertiga kecepatan memberi ≈%(takutdetik).1f detik **dan** membuat mereka
bisa dikejar.

Gerak acak saat takut hanya berlaku untuk hantu yang **sedang bermain**. Hantu
yang sedang keluar kandang atau sedang pulang tetap terarah — kalau tidak, hantu
yang baru keluar kehilangan sasarannya dan melantur kembali ke kandang.

### Dua fase terarah, satu mekanisme: peta jarak

Hantu punya dua fase yang harus **sampai ke suatu tempat**, bukan berkeliaran:
**keluar** dari kandang, dan **pulang** setelah dimakan. Keduanya kini memakai
peta jarak hasil banjir, dan pemilih langkah yang sama (`turuniPeta`):

| Peta | Benih banjir | Dipakai saat |
|---|---|---|
| `KELUAR` | kedua sel tepat di atas gerbang: (%(gr_atas)d,%(gc0)d) dan (%(gr_atas)d,%(gc1)d) | mode `keluar` |
| `PULANG` | sel start tiap hantu (empat peta) | `dimakan` |

Dihitung sekali saat muat, lalu gratis selamanya: hantu cukup melangkah ke
tetangga dengan angka terkecil. Selalu ada satu, jadi tidak ada jalan buntu dan
tidak ada undian. Berbalik arah diizinkan di kedua fase — hantu yang sedang
keluar atau pulang bukan hantu yang sedang berpatroli.

Sebelumnya keduanya dikemudikan **aturan sumbu**, dan keduanya rusak — dengan
cara berbeda, dan dilaporkan sebagai dua keluhan terpisah. Keduanya dibedah di
dua bagian berikut.

### Jalan pulang mata — peta jarak, bukan aturan sumbu

Hantu yang dimakan pulang dengan **peta jarak hasil banjir**: satu banjir per
sel start hantu, dihitung sekali saat muat, melewati gerbang (hantu yang dimakan
memang boleh melewatinya). Mata cukup melangkah ke tetangga dengan angka
terkecil — selalu jalan terpendek, dan biayanya nol saat bermain. Berbalik arah
diizinkan di sini: mata bukan hantu yang sedang berpatroli.

**Kenapa bukan aturan sumbu.** Versi sebelumnya mengemudikan mata dengan
"samakan baris dulu, baru kolom":

```js
dr = Math.sign(tr - h.r); dc = 0;
if (dr === 0) { dc = Math.sign(tc - h.c); }
```

Aturan itu **tidak bisa memulangkan siapa pun**. Untuk masuk kandang, hantu harus
sejajar di **kolom** gerbang (%(gcs_pendek)s) lalu turun lewat baris %(gr)d. Tapi aturan itu
baru mengizinkan gerak mendatar setelah baris sasaran tercapai — dan baris
sasarannya (%(kandr)d) ada **di dalam** kandang yang berdinding. Jadi mata mendorong
ke bawah, menabrak atap kandang, lalu memantul acak. Selamanya.

Gejalanya persis seperti yang dilaporkan: di mode PAC-GAL hantu yang dimakan
tetap berwujud mata dan tidak pernah kembali normal, bahkan sesudah masa rentan
habis — karena satu-satunya tempat `dimakan` dimatikan adalah saat mata tiba di
sel start-nya.

**Kontrol negatif.** Aturan lama dipasang kembali sementara untuk memastikan
ujinya memang bisa gagal. Hasilnya memisahkan keduanya dengan tegas:

| | mode 1980 | mode asli PAC-GAL |
|---|---|---|
| aturan sumbu (lama) | 2 dari 2 pulang | **0 pulang** |
| peta jarak (sekarang) | 2 dari 2 pulang | **3 dari 3 pulang** |

Mode 1980 tidak pernah terkena karena pemilih arahnya menimbang **keempat** arah
dan mengambil jarak lurus terkecil — masih bisa terjebak lembah lokal secara
teori, tapi tidak di petak ini. Peta jarak menghapus seluruh kelas kesalahan itu
untuk kedua mode sekaligus.

### Keluar kandang: undian di ambang pintu

Cacat kedua, dari aturan sumbu yang sama tapi di fase keluar. Yang paling
merusak bukan navigasinya, melainkan **apa yang terjadi saat hantu berdiri
persis di sel gerbang**: sasarannya adalah selnya sendiri, jadi `dr` dan `dc`
dua-duanya nol. Tidak ada langkah yang terhitung, dan hantu jatuh ke cabang
"memantul acak". Dari sel gerbang hanya ada dua tetangga — satu ke luar, satu
kembali ke dalam kandang.

Jadi setiap kali hantu sampai di ambang pintu, ia **melempar koin** apakah mau
keluar atau masuk lagi.

Mode 1980 tidak terkena: pemilihnya menimbang keempat arah dan mengambil jarak
terkecil, dan urutan `ARAH` menaruh "atas" lebih dulu — jadi ia selalu memilih
keluar. Mode asli PAC-GAL tidak punya penyeimbang itu. Hantunya bergelantungan
di sekitar kandang, dan yang apes terlihat seperti **tidak pernah pergi dari
kotak awal** — persis keluhan yang dilaporkan.

**Kontrol negatif** (mode asli PAC-GAL, pemain uji yang sama, 14.000 bingkai):

| | waktu di dalam kandang sesudah keluar | masuk lagi | petak dijelajahi | posisi akhir |
|---|---|---|---|---|
| aturan sumbu (lama) | 2–**10**% | 3–5× | 104–117 | keempatnya menempel kandang: (12,20) (11,20) (10,22) (14,15) |
| peta jarak (sekarang) | 1–3% | 2–4× | **142–195** | tersebar: (18,4) (13,2) (18,28) (13,38) |

Mode 1980 diperiksa ulang sesudah ikut dipindah ke peta jarak: keluar pada pelet
ke-5/7/15/29 seperti sebelumnya, 1–4% waktu di kandang, posisi akhir tetap di
empat sudut. Tidak ada perubahan perilaku, hanya satu mekanisme yang dipakai
bersama alih-alih dua yang bisa rusak sendiri-sendiri.

### Memakan hantu: skor berlipat dan jeda

**Apa yang PAC-GAL 1982 lakukan** — baris 4560 `pac-gal-run.bas`:

```basic
4560 J2%(I6%) = 7 : J3%(I6%) = 14 : J4%(I6%) = I6% + 16
```

Tiga hal seketika: warna kembali ke **7 (normal)**, baris ke **14**, kolom ke
**sel start-nya sendiri**. Tidak ada fase mata, tidak ada penundaan, tidak ada
penantian sampai masa rentan habis. Hantu itu langsung berdiri di kandang dalam
wujud normal dan langsung berjalan lagi. (`J2%` memang atribut warna — lihat
`COLOR J2%(I6%), 0` di baris 7010. Warna rentannya `26`, yaitu 16+10:
**hijau muda berkedip**, bukan biru.)

Pac-Man 1980 pada intinya sama: mata pulang, hantu lahir kembali, lalu **langsung
keluar** — ia tidak menunggu energizer habis. Bedanya matanya bergerak jauh lebih
cepat daripada hantu biasa, jadi jedanya malah lebih pendek lagi.

Jadi port ini sudah **lebih murah hati daripada aslinya**: matanya masih harus
menempuh jalan pulang, dan itu jeda yang tidak ada di PAC-GAL 1982.

**Yang ditambahkan, dan kenapa.** Yang hilang dari port ini bukan jedanya
melainkan **imbalannya**: PAC-GAL tidak punya skor sama sekali — satu-satunya
pencacah yang dicetaknya adalah `dots`. Memakan hantu karena itu tidak
menghasilkan apa pun, sehingga masa rentan hanya berarti beberapa detik aman
tanpa hasil. Di Pac-Man arcade justru di situ inti bonusnya. Dua mekanisme
arcade itu dipasang di sini:

| | Nilai | Tetapan |
|---|---|---|
| Nilai hantu berturut-turut dalam **satu** energizer | %(nilai)s | `NILAI_HANTU` |
| Permainan membeku sambil menampilkan angkanya | %(beku).2f detik | `BEKU_LAMA` |

Rantainya kembali ke %(nilai0)d setiap kali energizer **berikutnya** dimakan
(`rantai = 0` di cabang energizer, bukan di cabang pelet biasa — cabang yang
salah akan mereset rantai pada setiap pelet dan membuat kelipatannya tidak
pernah tercapai).

Jedanya diperiksa **paling awal** di `update()`, sebelum `langkahKe` menumpuk.
Kalau tidak, begitu jeda usai dunia akan melompat beberapa langkah sekaligus.
Ia juga membekukan pencacah rentan — persis seperti arcade, di mana waktu rentan
tidak berjalan selama angka ditampilkan.

Keduanya **rekonstruksi dari arcade, bukan dari PAC-GAL**, dan tercatat di §5.

---

## 5. Penyimpangan yang masih ada dari Pac-Man 1980

Disebutkan supaya tidak dicari-cari lagi sebagai bug:

| Penyimpangan | Alasan |
|---|---|
| Hantu **tidak berbalik arah** saat mode sebar/kejar berganti | 1980 memaksa berbalik; di sini tidak |
| Jadwal sebar/kejar sendiri (`SEBAR = %(sebarlist)s`) | 1980 punya jadwal per-level; port ini satu jadwal |
| **Tidak ada perlambatan di terowongan** | 1980 memperlambat hantu di terowongan |
| Hantu takut bergerak **acak**, bukan menjauh | rumus lamanya asli, tapi arah kaburnya tidak terpulihkan |
| Ambang keluar kandang berbasis pelet | rekonstruksi; PAC-GAL tidak punya aturan ini sama sekali |
| **Tidak ada pelepas-paksa berbasis waktu** | 1980 melepas hantu berikutnya kalau pemain lama tidak makan pelet; di sini pelepasan murni dari hitungan pelet |
| Mata hantu yang pulang bergerak **sekencang hantu biasa** | di 1980 mata jauh lebih cepat; laju di sini justru memberi jeda lebih panjang |
| Mata pulang lewat **jalan terpendek** (peta jarak) | 1980 memakai pemilih arah yang sama seperti hantu biasa; peta jarak dipakai di sini supaya mata tidak bisa tersesat |
| Keluar kandang juga lewat **peta jarak** | menghapus undian di ambang pintu; di 1980 hasilnya kebetulan sama karena urutan arahnya sudah membiaskan ke luar |
| **Skor hantu %(nilai)s dan jeda %(beku).2f detik ditambahkan** | rekonstruksi dari arcade; PAC-GAL 1982 tidak punya skor apa pun, hanya pencacah `dots` |

---

## 6. Kalau ada yang perlu diubah

1. Baca [`GEOMETRY.md`](GEOMETRY.md) dulu. Jangan menggali geometri dari kode.
2. Ubah tetapan di `pacgal.js`, bukan angka di dokumen ini.
3. Jalankan `python decompile/tools/gen-pacgal-ref.py` — dokumen ini dan
   `GEOMETRY.md` terbit ulang, dan pemeriksaan geometrinya jalan lagi.
4. Kalau skripnya gagal dengan `TETAPAN HILANG`, itu memang gunanya: kode
   berubah tanpa dokumennya ikut. Perbaiki polanya, jangan hapus assert-nya.

### Tiga cara harness berkas ini pernah gagal — semuanya diam-diam

Ditulis lengkap karena ketiganya menghasilkan angka yang **kelihatan masuk akal**:

1. **Kotak kandang diturunkan dari posisi start hantu.** Hantu yang naik satu
   petak — masih di dalam kandang — sudah terhitung "keluar". Ujinya lulus
   persis di saat permainannya rusak.
2. **Koordinat dibalik dengan `x / 8`.** `pacgal.js` menggambar di
   `x = c*2*W + W/2` dengan `W = 8`, jadi baliknya `c = (x - 4) / 16`. Konversi
   yang salah menaruh tiap hantu di kolom ganda dan satu baris di bawah
   tempatnya, dan "di dalam kandang" jadi tidak pernah kena.
3. **Pemain uji tidak digerakkan.** Ia berjalan ke kiri sampai mentok dinding,
   lalu dimakan tiga kali dalam ~10 detik. Seluruh sisa pengukuran berjalan di
   atas permainan yang **sudah usai** — dan tentu saja hantu keempat "tidak
   pernah keluar", karena ambang %(ambang4)d pelet tidak akan pernah tercapai.

Karena itu harness apa pun untuk berkas ini **wajib ikut melaporkan** nyawa,
jumlah kematian, dan pelet yang sudah termakan. Tanpa ketiganya, angka hantu
tidak bisa ditafsirkan sama sekali.

**Jangan** membangun uji dari posisi start hantu, dan jangan menurunkan geometri
apa pun dari tetapan yang sedang diuji. Ambil dari [`GEOMETRY.md`](GEOMETRY.md).
"""

ambang = "\n".join(
    "| %d (%s) | %d pelet | %.0f%%%s |"
    % (i + 1, WATAK[i][0], a, 100.0 * a / PELET_META,
       " — langsung" if a == 0 else "")
    for i, a in enumerate(AMBANG))

watak_tab = "\n".join(
    "| %d | %s | %s | %s | %s |" % (
        i + 1, n, ["Blinky (merah)", "Pinky (merah muda)", "Inky (biru)",
                   "Clyde (oranye)"][i], s,
        ["posisi pemain", "%d petak di muka pemain" % DEPAN,
         "cerminan Pengejar lewat titik %d petak di muka pemain" % DEPAN,
         "pemain kalau jauh, sudut sendiri kalau dekat"][i])
    for i, (n, s) in enumerate(WATAK))

gho = isi(GHO, {
    "gr": GERBANG_R,
    "peletmeta": PELET_META,
    "ambang": ambang,
    "watak": watak_tab,
    "depan": DEPAN,
    "rpemalu": R_PEMALU,
    "jadwal": "\n".join(jadwal),
    "elroy1": ELROY1, "elroy2": ELROY2,
    "i12": I12_AWAL,
    "tbagi": TAKUT_BAGI, "ttambah": TAKUT_TAMBAH,
    "takutawal": takut_awal,
    "tlambat": TAKUT_LAMBAT,
    "takutdetik": takut_awal * TAKUT_LAMBAT * PER_LANGKAH,
    "takutsetengah": takut_awal * 2 * PER_LANGKAH,
    "sebarlist": str(SEBAR),
    "gcs_pendek": "/".join(str(c) for c in GERBANG_CS),
    "gr_atas": GERBANG_R - 1,
    "gc0": GERBANG_CS[0],
    "gc1": GERBANG_CS[1],
    "kandr": KANDANG_R,
    "nilai": " / ".join(str(n) for n in NILAI_HANTU),
    "nilai0": NILAI_HANTU[0],
    "beku": BEKU,
    "ambang4": AMBANG[3],
    "sisa4": PELET_META - AMBANG[3],
})

io.open(OUT_GHO, "w", encoding="utf-8").write(gho)

print("GEOMETRY.md  %d bait" % len(geo.encode("utf-8")))
print("GHOSTS.md    %d bait" % len(gho.encode("utf-8")))
print("pemeriksaan  %d, gagal %d" % (len(periksa), len(GAGAL)))
for n, ok, d in periksa:
    print("  [%s] %s" % ("ok" if ok else "GAGAL", n))
    if not ok:
        print("        %s" % d)
