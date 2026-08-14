# -*- coding: utf-8 -*-
"""Pemeriksa kurung JavaScript yang melewati string dan komentar.

Bukan pengurai penuh — cuma cukup untuk menangkap kurung yang tidak
berpasangan di berkas tabel baris yang dibangkitkan."""
import sys, pathlib
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))

BACKSLASH = chr(92)

def periksa(nama):
    s = pathlib.Path(nama).read_text(encoding='utf-8')
    i, n = 0, len(s)
    tumpuk, masalah, baris = [], [], 1
    while i < n:
        c = s[i]
        if c == '\n':
            baris += 1; i += 1; continue
        if c == '/' and i + 1 < n and s[i+1] == '*':
            j = s.find('*/', i + 2)
            if j < 0:
                masalah.append((baris, 'komentar blok tidak ditutup')); break
            baris += s.count('\n', i, j); i = j + 2; continue
        if c == '/' and i + 1 < n and s[i+1] == '/':
            j = s.find('\n', i)
            i = n if j < 0 else j; continue
        if c in ('"', "'"):
            q = c; i += 1
            while i < n:
                if s[i] == BACKSLASH:
                    i += 2; continue
                if s[i] == q:
                    i += 1; break
                if s[i] == '\n':
                    masalah.append((baris, 'string tidak ditutup')); baris += 1; i += 1; break
                i += 1
            continue
        if c in '({[':
            tumpuk.append((c, baris)); i += 1; continue
        if c in ')}]':
            pas = {')': '(', '}': '{', ']': '['}[c]
            if not tumpuk or tumpuk[-1][0] != pas:
                masalah.append((baris, 'penutup ' + c + ' tanpa pembuka'))
                i += 1; continue
            tumpuk.pop(); i += 1; continue
        i += 1
    return masalah, tumpuk, s.count('\n') + 1

if __name__ == '__main__':
    for f in sys.argv[1:]:
        m, t, jml = periksa(f)
        print('%s: %d baris, masalah=%d, terbuka=%d' % (f, jml, len(m), len(t)))
        for x in m[:6]: print('   masalah', x)
        for x in t[:6]: print('   terbuka', x)
