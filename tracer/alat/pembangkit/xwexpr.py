# -*- coding: utf-8 -*-
"""Penerjemah ungkapan BASIC -> JavaScript, sengaja SEMPIT.

Hanya bentuk yang benar-benar aman yang diterjemahkan; apa pun di luar itu
melempar `Menyerah`, dan barisnya ditulis tangan. Lebih baik menulis tangan
tiga puluh baris daripada salah menerjemahkan satu."""
import re
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))

class Menyerah(Exception): pass

FUNGSI = {'ABS': 'Math.abs', 'INT': 'Math.floor', 'SQR': 'Math.sqrt',
          'SIN': 'Math.sin', 'COS': 'Math.cos'}

# Fungsi buatan program (`DEF FNx`) diterjemahkan jadi pemanggilan biasa
# dengan `m` sebagai argumen pertama; badannya ditulis tangan sekali.
FNDEF = {}

# Larik yang dikenal, supaya `L(Q)` jadi indeks larik dan bukan pemanggilan.
LARIK = set()

TOKEN = re.compile(r"""
    \s*(?:
      (?P<num>\d+\.\d+|\.\d+|\d+)
    | (?P<fn>ABS|INT|SQR|SIN|COS|FNA|FNB|FNC|FND|FNE)\s*\(
    | (?P<rnd>RND\s*\(\s*1\s*\)|RND)
    | (?P<arr>[A-Z][A-Z0-9]{0,7}[$%!#]?)\s*\(
    | (?P<var>[A-Z][A-Z0-9]{0,7}[$%!#]?)
    | (?P<op><=|>=|<>|[-+*/()<>=,])
    )""", re.X)

KATA = ('AND', 'OR', 'NOT', 'THEN', 'ELSE', 'GOTO', 'TO', 'STEP', 'GOSUB')

def token(s):
    i, keluar = 0, []
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m or m.end() == i: raise Menyerah(s)
        i = m.end()
        for k in ('num', 'fn', 'rnd', 'arr', 'var', 'op'):
            if m.group(k) is not None:
                keluar.append((k, m.group(k))); break
    return keluar

def terjemah(s, dalamIF=False):
    """Ungkapan BASIC -> JS.

       Variabel dibaca sebagai `(m.v.X || 0)`: di BASIC variabel angka yang
       belum pernah diisi bernilai NOL, tidak pernah "tidak ada".

       `dalamIF=True` hanya untuk syarat IF, tempat yang dipakai cuma
       benar-salahnya. Di luar itu perbandingan ditolak — lihat catatan
       di badan fungsinya."""
    hasil, tumpuk = [], []          # tumpuk: True = kurung milik larik
    for jenis, t in token(s):
        if jenis == 'num': hasil.append(t)
        elif jenis == 'fn':
            hasil.append((FUNGSI[t] + '(') if t in FUNGSI else (t + '(m, '))
            tumpuk.append(False)
        elif jenis == 'rnd': hasil.append('m.acak()')
        elif jenis == 'arr':
            if t in KATA or t not in LARIK: raise Menyerah(s)
            hasil.append("m.v[%r][" % (t + '()'))
            tumpuk.append(True)
        elif jenis == 'var':
            if t in KATA or '$' in t: raise Menyerah(s)
            hasil.append("(m.v[%r] || 0)" % t)
        elif t == '(':
            hasil.append(t); tumpuk.append(False)
        elif t == ')':
            if not tumpuk: raise Menyerah(s)
            hasil.append(']' if tumpuk.pop() else ')')
        elif t == ',':
            # Koma di dalam kurung larik memisahkan dua indeks: `C(A,1)` jadi
            # `C()[A][1]`. Di luar larik ia dibiarkan apa adanya.
            hasil.append('][' if (tumpuk and tumpuk[-1]) else t)
        elif t in ('=', '<', '>', '<=', '>=', '<>'):
            # PERBANDINGAN DI DALAM ARITMETIKA DITOLAK. Di BASIC perbandingan
            # yang benar bernilai −1; JavaScript memberi true, yang jadi +1
            # saat dikalikan. Selisih tanda itu membalik hasilnya, dan
            # TEMPLE.BAS baris 2150 (`OT=OT+4*(RC=1)`) memakainya sebagai
            # bilangan. Baris seperti itu harus ditulis tangan.
            if not dalamIF: raise Menyerah(s)
            hasil.append({'=': '===', '<>': '!=='}.get(t, t))
        else: hasil.append(t)
    if tumpuk: raise Menyerah(s)
    return ' '.join(hasil)
