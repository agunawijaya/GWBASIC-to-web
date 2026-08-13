"""Jalankan penggulung 232 byte yang di-POKE HOPPER, dan lihat apa yang dikerjakannya.

PC-BASIC menerima `CALL` tapi tidak menjalankan kode 8086 (diuji dengan penanda),
jadi efek rutin ini tak pernah muncul di rekonstruksi. DOSBox-X dicoba dua kali dan
menggantung tanpa keluaran. Yang tersisa -- dan sebenarnya paling terkendali --
adalah menjalankan bytenya langsung di emulator yang sama yang dipakai membaca EXE.

Framebuffer CGA diisi pola bernomor baris lebih dulu, rutinnya dipanggil sebagai
panggilan JAUH (persis yang dilakukan `CALL` GW-BASIC), lalu isinya dibandingkan
sebelum dan sesudah.
"""
import io, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from unicorn import Uc, UC_ARCH_X86, UC_MODE_16, UC_PROT_ALL, UcError
from unicorn.x86_const import (UC_X86_REG_CS, UC_X86_REG_IP, UC_X86_REG_SS,
                               UC_X86_REG_SP, UC_X86_REG_DS, UC_X86_REG_ES)

BAS = r"C:\Users\aguna\Downloads\Personal\Games\old_games\decompile\HOPPER\hopper-run.bas"
KODE_SEG = 0x2000
VIDEO = 0xB8000
PULANG = 0x30000          # alamat sentinel: kalau eksekusi sampai sini, rutin selesai


def byte_data():
    src = io.open(BAS, encoding="latin-1").read()
    n = []
    for m in re.finditer(r"^\d+\s+DATA\s+(.*)$", src, re.M):
        n += [int(x) & 0xFF for x in m.group(1).split(",") if x.strip()]
    return bytes(n)


def kisi(fb):
    """Framebuffer CGA mode 4 -> 200 baris x 320 nilai 0-3."""
    out = []
    for y in range(200):
        d = (y & 1) * 0x2000 + (y >> 1) * 80
        r = []
        for b in fb[d:d + 80]:
            r += [(b >> 6) & 3, (b >> 4) & 3, (b >> 2) & 3, b & 3]
        out.append(r)
    return out


def main():
    kode = byte_data()
    print("kode yang di-POKE: %d byte" % len(kode))

    uc = Uc(UC_ARCH_X86, UC_MODE_16)
    uc.mem_map(0, 0x200000, UC_PROT_ALL)
    uc.mem_write(KODE_SEG * 16, kode)

    # Pola uji harus bervariasi di KEDUA sumbu. Versi pertama seragam sepanjang
    # baris (warna per baris saja), dan hasilnya "tidak ada yang berubah" -- padahal
    # jalur Frogger menggulung ke SAMPING, dan geseran horizontal pada pola yang
    # seragam mendatar memang tak terlihat sama sekali.
    fb = bytearray(0x4000)
    for y in range(200):
        d = (y & 1) * 0x2000 + (y >> 1) * 80
        for c in range(80):
            fb[d + c] = (c * 7 + y * 13) & 0xFF
    uc.mem_write(VIDEO, bytes(fb))
    sebelum = kisi(bytes(uc.mem_read(VIDEO, 0x4000)))

    # panggilan JAUH: dorong segmen:offset sentinel sebagai alamat kembali
    uc.reg_write(UC_X86_REG_SS, 0x1000)
    uc.reg_write(UC_X86_REG_SP, 0xFFF0)
    uc.reg_write(UC_X86_REG_DS, KODE_SEG)
    uc.reg_write(UC_X86_REG_ES, KODE_SEG)
    sp = 0x1000 * 16 + 0xFFF0
    uc.mem_write(sp, (PULANG & 0xFFFF).to_bytes(2, "little"))
    uc.mem_write(sp + 2, ((PULANG >> 4) & 0xFFFF).to_bytes(2, "little"))
    uc.reg_write(UC_X86_REG_CS, KODE_SEG)
    uc.reg_write(UC_X86_REG_IP, 0)

    try:
        uc.emu_start(KODE_SEG * 16, PULANG, count=20_000_000)
        alasan = "kembali normal"
    except UcError as e:
        alasan = "berhenti: %s" % e

    sesudah = kisi(bytes(uc.mem_read(VIDEO, 0x4000)))
    print("eksekusi: %s" % alasan)

    beda = sum(1 for y in range(200) for x in range(320)
               if sebelum[y][x] != sesudah[y][x])
    print("piksel berubah: %d dari 64000 (%.1f%%)" % (beda, 100.0 * beda / 64000))

    print("\nwarna baris (baris: sebelum -> sesudah), hanya yang BERUBAH:")
    n = 0
    for y in range(200):
        a = sebelum[y][0]
        b = sesudah[y][0]
        if a != b:
            print("   baris %3d: %d -> %d" % (y, a, b))
            n += 1
            if n >= 14:
                print("   ...")
                break
    if not n:
        print("   (tidak ada baris yang berubah warna)")

    # Apakah tiap baris yang berubah adalah GESERAN MENDATAR dari isi sebelumnya?
    # Itu yang membedakan penggulung jalur dari sekadar corat-coret.
    print("\ngeseran mendatar terbaik per baris (baris: geser, kecocokan):")
    dilihat = 0
    for y in range(30, 200):
        if sebelum[y] == sesudah[y]:
            continue
        terbaik, skor = 0, -1
        for g in range(-8, 9):
            cocok = sum(1 for x in range(320)
                        if 0 <= x + g < 320 and sebelum[y][x] == sesudah[y][x + g])
            if cocok > skor:
                terbaik, skor = g, cocok
        print("   baris %3d: geser %+d piksel, %.0f%% cocok"
              % (y, terbaik, 100.0 * skor / 320))
        dilihat += 1
        if dilihat >= 10:
            break


if __name__ == "__main__":
    main()
