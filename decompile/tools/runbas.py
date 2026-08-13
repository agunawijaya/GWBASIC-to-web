"""Jalankan sebuah .bas di PC-BASIC dan TANGKAP LAYARNYA.

Opsi `--output` milik PC-BASIC hanya merekam teks yang tergulir keluar. Program di
sini menulis lewat LOCATE ke posisi tetap, jadi layarnya tak pernah tergulir dan
berkas keluaran selalu tampak kosong -- yang sempat terbaca keliru sebagai "program
berhenti sesudah INPUT". API Python-nya memberi isi layar secara langsung.

  python runbas.py pacgal.bas --keys "100\r" --steps 400000
"""
import sys, os, argparse, tempfile, threading, time
import pcbasic

# konsol Windows memakai cp1252 dan tersedak karakter CP437 seperti U+263B (sprite
# Pac-Gal); paksa UTF-8 supaya layar bisa dicetak apa adanya
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass


def render(sess, rows=25, cols=80):
    ch = sess.get_chars(as_type=str)
    out = []
    for r in ch[:rows]:
        out.append(("".join(r) if not isinstance(r, str) else r)[:cols].rstrip())
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("prog")
    ap.add_argument("--keys", default="")
    ap.add_argument("--keys-late", default="",
                    help="tombol yang baru ditekan sesudah --late-after detik; untuk menguji gerak sesudah layar siap")
    ap.add_argument("--late-after", type=float, default=20.0)
    ap.add_argument("--seconds", type=float, default=20.0)
    ap.add_argument("--out", default=None)
    ap.add_argument("--peak", action="store_true",
                    help="ambil bingkai TERKAYA selama program berjalan, bukan layar terakhir; permainan membersihkan layarnya saat usai")
    ap.add_argument("--widths", action="store_true",
                    help="cetak lebar tiap baris layar, bukan isinya")
    ap.add_argument("--memory", type=int, default=0,
                    help="ruang kerja BASIC; 3DTTT (65 KB) tak muat di 64 KB baku")
    a = ap.parse_args()

    src = open(a.prog, encoding="latin-1").read()
    keys = a.keys.encode().decode("unicode_escape")

    # `peek_values` WAJIB diisi: dibiarkan kosong, setiap PEEK melempar
    # TypeError('NoneType' object is not subscriptable) dari dalam PC-BASIC. CLI-nya
    # mengisi ini sendiri, API Session tidak -- dan itu sempat terbaca sebagai cacat
    # rekonstruksi HOPPER, padahal PEEK-nya benar sejak awal.
    # `allow_code_poke` diperlukan karena HOPPER menyuntikkan kode mesin lewat POKE.
    # Tanpa disk terpasang setiap OPEN melempar `Path not found`. HOPPER menulis
    # berkas skor HOPPER.SCO dan 3DTTT menyimpan permainan, jadi disknya wajib ada --
    # kalau tidak, cacat harness terbaca sebagai cacat rekonstruksi.
    disk = os.path.join(tempfile.gettempdir(), "basdisk")
    os.makedirs(disk, exist_ok=True)
    kw = {"peek_values": {}, "allow_code_poke": True,
          "devices": {"Z": disk}, "current_device": "Z"}
    if a.memory:
        kw["max_memory"] = a.memory
    with pcbasic.Session(syntax="advanced", **kw) as s:
        for line in src.splitlines():
            if line.strip():
                s.execute(line)
        done = []

        def feed():
            """Tekan tombol SEMENTARA program berjalan.

            Menaruh semuanya di penyangga sebelum RUN tidak berhasil: gelung jajak
            INKEY$ menghabiskannya dalam sekejap, lalu program menunggu selamanya."""
            for _ in range(120):
                time.sleep(a.seconds / 120.0)
                if done:
                    return
                try:
                    s.press_keys(keys)
                except Exception:
                    return

        late = a.keys_late.encode().decode("unicode_escape") if a.keys_late else ""

        def feed_late():
            """Tombol gerak baru berarti sesudah permainannya siap. Menekannya dari
            awal justru dimakan prompt pembuka."""
            time.sleep(a.late_after)
            # tombol diperluas (panah) dikirim sebagai NUL + kode pindai: dua
            # karakter yang HARUS tetap menyatu, kalau tidak program cuma menerima
            # NUL dan kode terpisah
            tok, k = [], 0
            while k < len(late):
                if late[k] == chr(0) and k + 1 < len(late):
                    tok.append(late[k:k + 2]); k += 2
                else:
                    tok.append(late[k]); k += 1
            n = int(max(1.0, (a.seconds - a.late_after)) / 0.25)
            for i in range(n):
                time.sleep(0.25)
                if done:
                    return
                try:
                    s.press_keys(tok[(i // 8) % len(tok)])
                except Exception:
                    return

        if late:
            threading.Thread(target=feed_late, daemon=True).start()
        if keys:
            try:
                s.press_keys(keys)
            except Exception:
                pass
            threading.Thread(target=feed, daemon=True).start()

        def run():
            try:
                s.execute("RUN")
            except Exception as e:
                done.append(repr(e))
            else:
                done.append("selesai")

        t = threading.Thread(target=run, daemon=True)
        t.start()
        # Piksel dicuplik BERKALA selama program berjalan, lalu diambil bingkai
        # terkaya. Satu tangkapan di ujung waktu selalu nol untuk permainan yang
        # membersihkan layarnya saat usai -- itulah kenapa angka piksel selama ini
        # nol dan dianggap tak berarti. HOPPER sebenarnya menggambar 14.466 piksel
        # dalam empat warna CGA di tengah permainan.
        pix = 0
        puncak, skor = None, -1
        habis = time.time() + a.seconds
        while time.time() < habis:
            t.join(0.4)
            try:
                px = s.get_pixels()
            except Exception:
                break
            pix = max(pix, sum(1 for r in px for v in r if v))
            if a.peak:
                kini = render(s)
                n = sum(len(x.strip()) for x in kini)
                if n > skor:
                    puncak, skor = kini, n
            if done:
                break
        scr = puncak if (a.peak and puncak is not None) else render(s)
    status = done[0] if done else "masih berjalan (dipotong %.0f dtk)" % a.seconds
    txt = "\n".join(scr)
    print("piksel: %d" % pix)
    print("status: %s" % status)
    print("=" * 80)
    if a.widths:
        # lebar tiap baris layar. Baris labirin PAC-GAL HARUS 80 kolom penuh;
        # baris yang kependekan berarti ubin hilang, dan dinding kanannya bergeser
        # sehingga hantu bisa lolos keluar layar.
        for i, r in enumerate(scr):
            if r:
                print("%2d lebar=%2d |%s" % (i + 1, len(r), r[:76]))
    else:
        print(txt)
    print("=" * 80)
    if a.out:
        open(a.out, "w", encoding="utf-8").write(txt + "\n")


if __name__ == "__main__":
    main()
