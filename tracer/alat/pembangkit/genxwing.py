# -*- coding: utf-8 -*-
"""Membangkitkan bagian mekanis XWING.js dari sumbernya, supaya tidak ada
   satu pun angka atau aksara yang disalin dengan tangan."""
import pathlib, re, json
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))

SRC = AKAR / 'run' / 'XWING.BAS'
d = SRC.read_bytes().split(b'\x1a')[0].decode('cp437')
d = d.replace(chr(13) + chr(10), chr(10))
L = [l for l in d.split(chr(10)) if re.match(r'^\d+\s', l)]
src = {}
for l in L:
    p = l.split(None, 1)
    src[int(p[0])] = p[1] if len(p) > 1 else ''
NOMOR = sorted(src)

def js(s):
    return json.dumps(s, ensure_ascii=False)

# --- baris PRINT murni -----------------------------------------------------
polaP = re.compile(r'^PRINT\s*("((?:[^"]*))"?)?\s*(;?)$')
def cetak(n):
    m = polaP.match(src[n].strip())
    if not m: return None
    teks = m.group(2) or ''
    gantung = m.group(3) == ';'
    if not m.group(1):
        return "  T({ baris: %d, jalan: function (m) { m.barisBaru(); } });" % n
    if gantung:
        return "  T({ baris: %d, jalan: function (m) { m.cetak(%s); } });" % (n, js(teks))
    return ("  T({ baris: %d, jalan: function (m) { m.cetak(%s); m.barisBaru(); } });"
            % (n, js(teks)))

# --- baris penugasan larik -------------------------------------------------
asg = re.compile(r'^([A-Z][A-Z0-9]*)\((\d+)\)\s*=\s*(-?\d+)!?$')
dimP = re.compile(r'^DIM\s+(.+)$')
dim1 = re.compile(r'^([A-Z][A-Z0-9]*)\((\d+)\)$')
def larik(n):
    bagian = [b.strip() for b in src[n].strip().split(':') if b.strip()]
    dims, vals = [], []
    for b in bagian:
        m = asg.match(b)
        if m:
            vals.append("['%s()',%s,%s]" % (m.group(1), m.group(2), m.group(3)))
            continue
        md = dimP.match(b)
        if md:
            baik, dd = True, []
            for x in md.group(1).split(','):
                m2 = dim1.match(x.strip())
                if not m2: baik = False; break
                dd.append("['%s()',%s]" % (m2.group(1), m2.group(2)))
            if baik: dims.extend(dd); continue
        return None
    if not (dims or vals): return None
    if dims:
        return "  DIMISI(%d, [%s], [%s]);" % (n, ', '.join(dims), ', '.join(vals))
    return "  ISI(%d, [%s]);" % (n, ', '.join(vals))

if __name__ == '__main__':
    hasil = {}
    for n in NOMOR:
        for f in (cetak, larik):
            r = f(n)
            if r: hasil[n] = r; break
    (_ALAT / str(_ALAT / 'xwing_mekanis.txt')).write_text(
        '\n'.join('%d\t%s' % (n, hasil[n]) for n in sorted(hasil)), encoding='utf-8')
    print('dibangkitkan', len(hasil), 'dari', len(NOMOR))
    sisa = [n for n in NOMOR if n not in hasil]
    (_ALAT / str(_ALAT / 'xwing_sisa.txt')).write_text(
        '\n'.join('%d %s' % (n, src[n]) for n in sisa), encoding='utf-8')
    print('sisa ditulis tangan:', len(sisa))
