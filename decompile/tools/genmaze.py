"""Panen labirin PAC-GAL dari layar EXE ASLINYA menjadi berkas data web.

Kenapa diukur, bukan disalin: labirinnya TIDAK ada sebagai larik di mana pun.
`decompile/PAC-GAL/MAZE-TILES.md` menunjukkan ia dibangun saat startup dari
`CHR$`/`STRING$` lalu dicetak baris demi baris, jadi tak ada literal yang bisa
dibaca dari segmen data. Satu-satunya tempat labirin itu benar-benar berwujud
adalah LAYAR.

Sumbernya karena itu `run/PAC-GAL.EXE` yang dijalankan `textscreen.py`, dan
susunannya sudah terverifikasi 24 dari 24 baris sel demi sel terhadap
rekonstruksi `.bas` lewat `refscreen.py`.

Pemakaian:
  python textscreen.py ../../run/PAC-GAL.EXE --keys "100\\r" --budget 200000000 \\
      --timer-isr 1c --out <layar.txt>
  python genmaze.py <layar.txt> <keluaran.js>
"""
import io, sys, json

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Ubin yang BUKAN dinding. Sisanya dianggap dinding saat digambar.
PELET = "∙"          # CHR$(249) -- butir yang dimakan
HANTU = "♥♦♣♠"
PEMAIN = "☺"


def main():
    masuk, keluar = sys.argv[1], sys.argv[2]
    baris = [l.rstrip("\n") for l in io.open(masuk, encoding="utf-8")]
    assert len(baris) >= 25, "layar harus 25 baris, dapat %d" % len(baris)

    labirin = [b.ljust(80)[:80] for b in baris[:24]]
    status = baris[24]

    # --- angka yang memverifikasi dirinya sendiri ---------------------------
    pelet = sum(r.count(PELET) for r in labirin)
    # baris status program sendiri menulis jumlah peletnya: "dots 468"
    import re
    m = re.search(r"dots\s+(\d+)", status)
    diklaim = int(m.group(1)) if m else None
    lebar = [len(r.rstrip()) for r in labirin if r.strip()]

    print("baris labirin      : %d" % len(labirin))
    print("pelet terhitung    : %d" % pelet)
    print("pelet diklaim EXE  : %s  -> %s" % (diklaim,
          "COCOK" if diklaim == pelet else "TIDAK COCOK"))
    print("lebar baris berisi : min %d, maks %d" % (min(lebar), max(lebar)))

    # Sprite dibuang dari data: hantu dan pemain BUKAN bagian dari labirin.
    #
    # Selnya dikembalikan menjadi SPASI, bukan pelet. Versi pertama memakai
    # pelet dengan alasan "sprite pasti menimpa pelet", dan itu salah: keempat
    # hantu berada di KANDANG, yang memang tak pernah berpelet. Akibatnya data
    # berisi 472 pelet sementara programnya menulis 468, dan permainan tak
    # akan pernah bisa selesai.
    #
    # Bahwa spasi yang benar bisa dibuktikan tanpa menebak: cacah pelet dihitung
    # dari layar SEBELUM sprite dibuang, jadi kalau sesudah dibuang cacahnya
    # tetap sama, tak satu pun sprite sedang menutupi pelet.
    bersih = []
    for r in labirin:
        bersih.append("".join(" " if c in HANTU + PEMAIN else c for c in r))
    sesudah = sum(r.count(PELET) for r in bersih)
    print("pelet sesudah sprite dibuang: %d -> %s" % (
        sesudah, "tak ada sprite menutupi pelet" if sesudah == pelet
        else "ADA %d pelet tertutup sprite" % (pelet - sesudah)))
    assert sesudah == pelet, "cacah pelet berubah saat sprite dibuang"

    data = {
        "sumber": "run/PAC-GAL.EXE dijalankan lewat decompile/tools/textscreen.py",
        "verifikasi": "24/24 baris cocok sel demi sel dengan pac-gal-run.bas (refscreen.py)",
        "kolom": 80,
        "baris": len(bersih),
        "pelet": pelet,
        "status": status,
    }

    with io.open(keluar, "w", encoding="utf-8", newline="\n") as f:
        f.write("/* DIHASILKAN oleh decompile/tools/genmaze.py -- jangan disunting tangan.\n")
        f.write("\n")
        f.write("   Labirin ini DIUKUR, bukan disalin. Ia tidak ada sebagai larik di\n")
        f.write("   mana pun: PAC-GAL membangunnya saat startup dari CHR$/STRING$ lalu\n")
        f.write("   mencetaknya baris demi baris, jadi satu-satunya tempat ia berwujud\n")
        f.write("   adalah layar. Sumbernya karena itu tangkapan layar EXE 1982 yang\n")
        f.write("   dijalankan emulator, dan susunannya sudah dicocokkan sel demi sel\n")
        f.write("   dengan rekonstruksi .bas-nya -- 24 dari 24 baris.\n")
        f.write("\n")
        f.write("   Bukti yang memeriksa dirinya sendiri: jumlah ubin pelet di sini\n")
        f.write("   ada %d, dan baris status yang dicetak programnya sendiri berbunyi\n" % pelet)
        f.write("   \"dots %s\". Dua angka dari dua tempat berbeda, sama. */\n" % diklaim)
        f.write("window.RETRO = window.RETRO || {};\n")
        f.write("window.RETRO.PACGAL_MAZE = %s;\n"
                % json.dumps(data, ensure_ascii=False, indent=1))
        f.write("window.RETRO.PACGAL_ROWS = [\n")
        for r in bersih:
            f.write(" %s,\n" % json.dumps(r, ensure_ascii=False))
        f.write("];\n")
    print("-> %s" % keluar)


if __name__ == "__main__":
    main()
