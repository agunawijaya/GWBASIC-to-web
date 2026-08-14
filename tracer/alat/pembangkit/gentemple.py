# -*- coding: utf-8 -*-
"""Membangkitkan bagian mekanis TEMPLE.js dari sumbernya.

Sama seperti generator XWING: yang bisa diterjemahkan dengan AMAN
diterjemahkan, sisanya dikembalikan sebagai daftar untuk ditulis tangan."""
import pathlib, re, json, sys
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
from xwexpr import terjemah, Menyerah
import temple_gabung, temple_lanjut

SRC = AKAR / 'run' / 'TEMPLE.BAS'
d = SRC.read_bytes().split(b'\x1a')[0].decode('cp437')
d = d.replace(chr(13) + chr(10), chr(10))
L = [l for l in d.split(chr(10)) if re.match(r'^\d+\s', l)]
src = {}
for l in L:
    p = l.split(None, 1)
    src[int(p[0])] = p[1] if len(p) > 1 else ''
NOMOR = sorted(src)

def js(s): return json.dumps(s, ensure_ascii=False)
def coba(f, *a):
    try: return f(*a)
    except Menyerah: return None

P_PRINT = re.compile(r'^PRINT\s*"([^"]*)"?(;?)$')
P_KOSONG = re.compile(r'^PRINT\s*:?$')
P_REM = re.compile(r"^(REM\b.*|'.*)$")
P_GOTO = re.compile(r'^GOTO\s+(\d+)$')
P_GOSUB = re.compile(r'^GOSUB\s+(\d+)$')
P_RET = re.compile(r'^RETURN$')
P_NEXT = re.compile(r'^NEXT\s*([A-Z][A-Z0-9]{0,7})?$')
P_FOR = re.compile(r'^FOR\s+([A-Z][A-Z0-9]{0,7})\s*=\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s*(-?\d+))?$')
P_IFG = re.compile(r'^IF\s+(.+?)\s+(?:THEN|GOTO)\s+(\d+)$')
P_ASG = re.compile(r'^([A-Z][A-Z0-9]{0,7})\s*=\s*(.+)$')
P_DATA = re.compile(r'^DATA\s+(.*)$')
import xwexpr
xwexpr.LARIK.update(['L', 'C', 'T', 'O', 'R'])

P_LOCATE = re.compile(r'^LOCATE\s+(\d+)\s*,\s*(\d+)$')
P_COLOR = re.compile(r'^COLOR\s+(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?$')
P_DIAM = re.compile(r'^(PLAY\s*"[^"]*"|SOUND\b[^:]*|BEEP|KEY\s+OFF|KEY\s+ON|RANDOMIZE\b.*|DEFINT\b.*|WIDTH\s+\d+)$')
P_CLS = re.compile(r'^CLS$')
P_SCREEN = re.compile(r'^SCREEN\s+(\d+)$')
P_LARIKASG = re.compile(r'^([A-Z][A-Z0-9]{0,7})\((.+)\)\s*=\s*(.+)$')

def hasilkan():
    hasil = {}
    for n in NOMOR:
        isi = src[n].strip()
        if not isi:
            hasil[n] = '  rem(%d);' % n; continue
        m = P_REM.match(isi)
        if m: hasil[n] = '  rem(%d);' % n; continue
        if P_KOSONG.match(isi):
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.barisBaru(); } });' % n; continue
        m = P_PRINT.match(isi)
        if m:
            teks, gantung = m.group(1), m.group(2) == ';'
            akhir = '' if gantung else ' m.barisBaru();'
            hasil[n] = ('  T({ baris: %d, jalan: function (m) { m.cetak(%s);%s } });'
                        % (n, js(teks), akhir)); continue
        m = P_DATA.match(isi)
        if m:
            hasil[n] = '  rem(%d);   /* DATA — lihat `data` di objek program */' % n; continue
        m = P_GOTO.match(isi)
        if m:
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.lompat(%s); } });' % (n, m.group(1)); continue
        m = P_GOSUB.match(isi)
        if m:
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.gosub(%s); } });' % (n, m.group(1)); continue
        if P_RET.match(isi):
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.kembali(); } });' % n; continue
        m = P_NEXT.match(isi)
        if m:
            nama = "'%s'" % m.group(1) if m.group(1) else ''
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.lanjutkan(%s); } });' % (n, nama); continue
        m = P_FOR.match(isi)
        if m:
            a = coba(terjemah, m.group(2)); b = coba(terjemah, m.group(3))
            if a and b:
                hasil[n] = ("  T({ baris: %d, jalan: function (m) { m.untuk('%s', %s, %s, %s); } });"
                            % (n, m.group(1), a, b, m.group(4) or '1')); continue
        m = P_IFG.match(isi)
        if m:
            c = coba(terjemah, m.group(1), True)
            if c:
                hasil[n] = ("  T({ baris: %d, jalan: function (m) { if (%s) m.lompat(%s); } });"
                            % (n, c, m.group(2))); continue
        m = P_LOCATE.match(isi)
        if m:
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.locate(%s, %s); } });' % (n, m.group(1), m.group(2)); continue
        m = P_COLOR.match(isi)
        if m:
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.warna(%s, %s); } });' % (n, m.group(1), m.group(2)); continue
        if P_DIAM.match(isi):
            hasil[n] = '  T({ baris: %d, jalan: function () { /* %s */ } });' % (n, isi.replace('*/', '')); continue
        if P_CLS.match(isi):
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.cls(); } });' % n; continue
        m = P_SCREEN.match(isi)
        if m:
            hasil[n] = '  T({ baris: %d, jalan: function (m) { m.layar(%s); } });' % (n, m.group(1)); continue
        m = P_LARIKASG.match(isi)
        if m and '"' not in isi:
            kiri = coba(terjemah, m.group(1) + '(' + m.group(2) + ')')
            kanan = coba(terjemah, m.group(3))
            if kiri and kanan:
                hasil[n] = "  T({ baris: %d, jalan: function (m) { %s = %s; } });" % (n, kiri, kanan); continue
        if '"' not in isi and ':' in isi and ' IF ' not in (' ' + isi):
            bagian = [b.strip() for b in isi.split(':') if b.strip()]
            semua = [re.fullmatch(r'([A-Z][A-Z0-9]{0,7}(?:\([^)]*\))?)\s*=\s*(.+)', b) for b in bagian]
            if all(semua):
                pot = []
                baik = True
                for x in semua:
                    kiri = x.group(1)
                    kiri = coba(terjemah, kiri) if '(' in kiri else ("m.v[%r]" % kiri)
                    kanan = coba(terjemah, x.group(2))
                    if not (kiri and kanan): baik = False; break
                    pot.append('%s = %s;' % (kiri, kanan))
                if baik:
                    hasil[n] = "  T({ baris: %d, jalan: function (m) { %s } });" % (n, ' '.join(pot)); continue
        g2 = temple_lanjut.baris(isi)
        if g2:
            hasil[n] = '  T({ baris: %d, jalan: function (m) { %s } });' % (n, g2); continue
        g = temple_gabung.baris(isi)
        if g:
            hasil[n] = '  T({ baris: %d, jalan: function (m) { %s } });' % (n, g); continue
        m = P_ASG.match(isi)
        if m and ':' not in isi and '"' not in isi:
            e = coba(terjemah, m.group(2))
            if e:
                hasil[n] = ("  T({ baris: %d, jalan: function (m) { m.v['%s'] = %s; } });"
                            % (n, m.group(1), e)); continue
    return hasil

if __name__ == '__main__':
    h = hasilkan()
    (_ALAT / str(_ALAT / 'temple_mekanis.txt')).write_text(
        '\n'.join('%d\t%s' % (n, h[n]) for n in sorted(h)), encoding='utf-8')
    sisa = [n for n in NOMOR if n not in h]
    (_ALAT / str(_ALAT / 'temple_sisa.txt')).write_text(
        '\n'.join('%d %s' % (n, src[n]) for n in sisa), encoding='utf-8')
    print('dibangkitkan', len(h), ' sisa', len(sisa))
