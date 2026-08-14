# -*- coding: utf-8 -*-
"""Penangan baris MAJEMUK: deret pernyataan dipisah titik dua.

Tiap penggal diterjemahkan sendiri-sendiri, dan kalau ADA SATU SAJA yang
tidak dikenali, seluruh barisnya dikembalikan untuk ditulis tangan. Tidak ada
baris yang diterjemahkan setengah."""
import re, json, sys
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
from xwexpr import terjemah, Menyerah

def js(s): return json.dumps(s, ensure_ascii=False)

def belah(isi):
    """Belah di titik dua yang BERADA DI LUAR tanda kutip."""
    keluar, kini, dalam = [], '', False
    for ch in isi:
        if ch == '"': dalam = not dalam
        if ch == ':' and not dalam:
            keluar.append(kini); kini = ''
        else:
            kini += ch
    keluar.append(kini)
    return [x.strip() for x in keluar if x.strip()]

P_PRINTS  = re.compile(r'^PRINT\s*"([^"]*)"?(;?)$')
P_PRINTK  = re.compile(r'^PRINT$')
P_COLOR   = re.compile(r'^COLOR\s+(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?$')
P_COLOR1  = re.compile(r'^COLOR\s+(\d+)$')
P_LOCATE  = re.compile(r'^LOCATE\s+(\d+)\s*,\s*(\d+)$')
P_CLS     = re.compile(r'^CLS$')
P_GOTO    = re.compile(r'^GOTO\s+(\d+)$')
P_GOSUB   = re.compile(r'^GOSUB\s+(\d+)$')
P_RET     = re.compile(r'^RETURN$')
P_ASGS    = re.compile(r'^([A-Z][A-Z0-9]{0,7}\$)\s*=\s*"([^"]*)"$')
P_ASGSA   = re.compile(r'^([A-Z][A-Z0-9]{0,7}\$)\(([^)]+)\)\s*=\s*"([^"]*)"$')
P_ASG     = re.compile(r'^([A-Z][A-Z0-9]{0,7})\s*=\s*([^"]+)$')
P_ASGA    = re.compile(r'^([A-Z][A-Z0-9]{0,7})\(([^)]+)\)\s*=\s*([^"]+)$')
P_DIAM    = re.compile(r'^(PLAY\s*"[^"]*"|SOUND[^:]*|BEEP|KEY\s+(ON|OFF)|WIDTH\s+\d+|RANDOMIZE.*|DEFINT.*|RESTORE)$')
P_NEXT    = re.compile(r'^NEXT\s*([A-Z][A-Z0-9]{0,7})?$')

def penggal(p):
    """Satu pernyataan -> potongan JS, atau None kalau tidak dikenali."""
    m = P_PRINTS.match(p)
    if m:
        akhir = '' if m.group(2) else ' m.barisBaru();'
        return 'm.cetak(%s);%s' % (js(m.group(1)), akhir)
    if P_PRINTK.match(p): return 'm.barisBaru();'
    m = P_COLOR.match(p)
    if m: return 'm.warna(%s, %s);' % (m.group(1), m.group(2))
    m = P_COLOR1.match(p)
    if m: return 'm.warna(%s);' % m.group(1)
    m = P_LOCATE.match(p)
    if m: return 'm.locate(%s, %s);' % (m.group(1), m.group(2))
    if P_CLS.match(p): return 'm.cls();'
    m = P_GOTO.match(p)
    if m: return 'm.lompat(%s);' % m.group(1)
    m = P_GOSUB.match(p)
    if m: return 'm.gosub(%s);' % m.group(1)
    if P_RET.match(p): return 'm.kembali();'
    if P_DIAM.match(p): return None if 'RESTORE' in p else '/* %s */' % p.replace('*/', '')
    m = P_NEXT.match(p)
    if m: return "m.lanjutkan(%s);" % ("'%s'" % m.group(1) if m.group(1) else '')
    m = P_ASGSA.match(p)
    if m:
        try: idx = terjemah(m.group(2))
        except Menyerah: return None
        return "m.v[%s][%s] = %s;" % (js(m.group(1) + '()'), idx, js(m.group(3)))
    m = P_ASGS.match(p)
    if m: return "m.v[%s] = %s;" % (js(m.group(1)), js(m.group(2)))
    m = P_ASGA.match(p)
    if m:
        try:
            kiri = terjemah(m.group(1) + '(' + m.group(2) + ')')
            kanan = terjemah(m.group(3))
        except Menyerah: return None
        return '%s = %s;' % (kiri, kanan)
    m = P_ASG.match(p)
    if m:
        try: kanan = terjemah(m.group(2))
        except Menyerah: return None
        return "m.v[%s] = %s;" % (js(m.group(1)), kanan)
    return None

def baris(isi):
    """Seluruh baris majemuk -> badan JS, atau None."""
    bagian = belah(isi)
    if len(bagian) < 2: return None
    keluar = []
    for p in bagian:
        r = penggal(p)
        if r is None: return None
        keluar.append(r)
    return ' '.join(keluar)
