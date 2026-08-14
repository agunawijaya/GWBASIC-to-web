#!/usr/bin/env python3
"""Menyalin berkas .BAS dari run/ menjadi berkas .js yang menugaskan ke window.SUMBER.

Kenapa tidak dibaca langsung saja? Karena halaman ini dibuka lewat `file://`,
dan di sana `fetch()` diblokir oleh peramban. Satu-satunya cara memuat data
tanpa server adalah lewat <script src=...> yang menugaskan ke window.*.

Berkas .BAS koleksi ini disimpan sebagai teks (bukan token biner), tapi
sebagiannya memakai karakter grafik CP437 (mis. kotak, kartu). Maka dibaca
sebagai cp437 lalu ditulis kembali sebagai escape \\uXXXX supaya berkas .js
hasilnya tetap ASCII murni dan aman dari salah tafsir encoding.

Pakai:
    python tracer/alat/bikin-sumber.py MENU
    python tracer/alat/bikin-sumber.py            (semua yang ada di CAKUPAN)
"""

import sys
from pathlib import Path

AKAR = Path(__file__).resolve().parents[2]
SUMBER = AKAR / "run"
TUJUAN = AKAR / "tracer" / "sumber"

# Dulu daftar ini cuma memuat 25 program yang terjangkau MENU.BAS dan
# MENU2.BAS. Sejak cakupannya diperluas ke SELURUH koleksi, daftarnya
# dihasilkan dari isi run/ — jadi menambah berkas .BAS baru cukup dengan
# menaruhnya di sana lalu menjalankan skrip ini lagi.
def cakupan_semua():
    nama = set()
    for p in SUMBER.glob("*.BAS"):
        nama.add(p.stem.upper())
    for p in SUMBER.glob("*.bas"):
        nama.add(p.stem.upper())
    return sorted(nama)


def cari_berkas(nama):
    """run/ memakai campuran huruf besar dan kecil (mis. tictac.BAS)."""
    for kandidat in (f"{nama}.BAS", f"{nama}.bas", f"{nama.lower()}.BAS",
                     f"{nama.lower()}.bas"):
        p = SUMBER / kandidat
        if p.exists():
            return p
    return None


def sebagai_string_js(s):
    keluar = ['"']
    for ch in s:
        if ch == '"':
            keluar.append('\\"')
        elif ch == "\\":
            keluar.append("\\\\")
        elif ch == "\t":
            keluar.append("\\t")
        elif " " <= ch <= "~":
            keluar.append(ch)
        else:
            keluar.append("\\u%04x" % ord(ch))
    keluar.append('"')
    return "".join(keluar)


def olah(nama):
    berkas = cari_berkas(nama)
    if berkas is None:
        return f"  ! {nama}: tidak ada di run/"

    mentah = berkas.read_bytes()
    # 0x1A (Ctrl-Z) adalah penanda akhir berkas DOS; buang beserta sisanya.
    if b"\x1a" in mentah:
        mentah = mentah[: mentah.index(b"\x1a")]
    teks = mentah.decode("cp437")
    baris = teks.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    while baris and baris[-1].strip() == "":
        baris.pop()

    TUJUAN.mkdir(parents=True, exist_ok=True)
    isi = [
        "/* Dihasilkan oleh tracer/alat/bikin-sumber.py - jangan disunting tangan.",
        f"   Sumber: run/{berkas.name} ({len(baris)} baris) */",
        "window.SUMBER = window.SUMBER || {};",
        f"window.SUMBER[{sebagai_string_js(nama)}] = [",
    ]
    isi += ["  " + sebagai_string_js(b) + "," for b in baris]
    isi += ["];", ""]
    (TUJUAN / f"{nama}.js").write_text("\n".join(isi), encoding="ascii")
    return f"  + {nama}: {len(baris)} baris dari run/{berkas.name}"


def main():
    daftar = sys.argv[1:] or cakupan_semua()
    print(f"Menulis ke {TUJUAN}")
    for nama in daftar:
        print(olah(nama))


if __name__ == "__main__":
    main()
