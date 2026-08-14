# -*- coding: utf-8 -*-
import sys, pathlib
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
import genxwing as G, xwing_tangan as X

mek = {}
for l in (_ALAT / str(_ALAT / 'xwing_mekanis.txt')).read_text(encoding='utf-8').split('\n'):
    if not l.strip(): continue
    n, js = l.split('\t', 1)
    mek[int(n)] = js

baris = []
for n in G.NOMOR:
    if n in X.TANGAN:
        badan, kom = X.TANGAN[n]
        if kom:
            baris.append('  /* %d %s */' % (n, kom))
        if badan.startswith('/*'):
            baris.append('  T({ baris: %d, jalan: function () { %s } });' % (n, badan))
        else:
            b = badan.strip()
            if '\n' in b:
                baris.append('  T({ baris: %d, jalan: function (m) {\n      %s\n    } });' % (n, b))
            else:
                baris.append('  T({ baris: %d, jalan: function (m) { %s } });' % (n, b))
    else:
        baris.append(mek[n])

(_ALAT / str(_ALAT / 'xwing_tabel.js')).write_text('\n'.join(baris) + '\n', encoding='utf-8')
print('tabel', len(baris), 'entri,', sum(len(x) for x in baris), 'bita')
