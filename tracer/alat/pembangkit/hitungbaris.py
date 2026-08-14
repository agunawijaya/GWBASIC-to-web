# -*- coding: utf-8 -*-
"""Menghitung jumlah baris BASIC seluruh program yang sudah diport."""
import pathlib, re
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))

AKAR = AKAR
PROG = AKAR / 'tracer' / 'program'

pola = re.compile(r'berkas:\s*(".*?"|\'.*?\')')
total, jumlah, lewat = 0, 0, []
for f in sorted(PROG.glob('*.js')):
    s = f.read_text(encoding='utf-8')
    m = pola.search(s)
    if not m:
        lewat.append(f.name); continue
    nama = m.group(1)[1:-1]
    d = (AKAR / nama).read_bytes().split(b'\x1a')[0].decode('cp437')
    d = d.replace(chr(13) + chr(10), chr(10))
    total += len([l for l in d.split(chr(10)) if re.match(r'^\d+\s', l)])
    jumlah += 1

print('%d program, %d baris BASIC' % (jumlah, total))
if lewat: print('tidak terbaca:', lewat)
