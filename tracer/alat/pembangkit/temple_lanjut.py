# -*- coding: utf-8 -*-
"""Pola tambahan TEMPLE: syarat string, IF berpernyataan, PRINT campuran,
   ON GOTO/GOSUB, INPUT, READ, DIM.

Aturannya tetap: apa pun yang tidak cocok PERSIS dikembalikan None, dan
barisnya ditulis tangan."""
import re, json, sys
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
from xwexpr import terjemah, Menyerah
import temple_gabung as TG

def js(s): return json.dumps(s, ensure_ascii=False)

# --- syarat yang boleh memuat string --------------------------------------
T_SYARAT = re.compile(r"""
    \s*(?:
      (?P<lit>"[^"]*")
    | (?P<fn>LEFT\$|RIGHT\$|MID\$|VAL|LEN|ASC|CHR\$|STR\$|ABS|INT)\s*\(
    | (?P<rnd>RND\s*\(\s*1\s*\)|RND)
    | (?P<arr>[A-Z][A-Z0-9]{0,7}\$?)\s*\(
    | (?P<kata>AND|OR|NOT)
    | (?P<var>[A-Z][A-Z0-9]{0,7}\$?)
    | (?P<op><=|>=|<>|[-+*/()<>=,])
    )""", re.X)

FN = {'LEFT$': 'kiri', 'RIGHT$': 'kanan', 'MID$': 'tengah', 'VAL': 'nilai',
      'LEN': 'panjang', 'ASC': 'kode', 'CHR$': 'aksara', 'STR$': 'teks',
      'ABS': 'Math.abs', 'INT': 'Math.floor'}
LARIK_STR = {'C$', 'I$', 'R$', 'W$', 'E$'}
LARIK_NUM = {'L', 'C', 'T', 'O', 'R'}

def syarat(s, murni=True):
    """Syarat BASIC -> JS. Melempar Menyerah kalau ada yang tak dikenal.

       `murni=True` berarti hasilnya cuma dipakai sebagai benar-salah, jadi
       perbandingan boleh diterjemahkan apa adanya. `murni=False` dipakai di
       tempat nilainya ikut dihitung — dan di sana perbandingan DITOLAK,
       karena di BASIC yang benar bernilai −1 dan di JavaScript +1."""
    hasil, tumpuk = [], []
    i = 0
    while i < len(s):
        m = T_SYARAT.match(s, i)
        if not m or m.end() == i: raise Menyerah(s)
        i = m.end()
        if m.group('lit') is not None:
            hasil.append(js(m.group('lit')[1:-1]))
        elif m.group('fn') is not None:
            t = m.group('fn')
            hasil.append((FN[t] + '(') if t.startswith(('ABS', 'INT')) else (FN[t] + '('))
            tumpuk.append(False)
        elif m.group('rnd') is not None:
            hasil.append('m.acak()')
        elif m.group('arr') is not None:
            t = m.group('arr')
            if t not in LARIK_STR and t not in LARIK_NUM: raise Menyerah(s)
            hasil.append("m.v[%s][" % js(t + '()')); tumpuk.append(True)
        elif m.group('kata') is not None:
            k = m.group('kata')
            hasil.append({'AND': '&&', 'OR': '||', 'NOT': '!'}[k])
        elif m.group('var') is not None:
            t = m.group('var')
            hasil.append("(m.v[%s] || %s)" % (js(t), "''" if t.endswith('$') else '0'))
        else:
            t = m.group('op')
            if t == '(': hasil.append(t); tumpuk.append(False)
            elif t == ')':
                if not tumpuk: raise Menyerah(s)
                hasil.append(']' if tumpuk.pop() else ')')
            elif t == ',':
                hasil.append('][' if (tumpuk and tumpuk[-1]) else ',')
            elif t in ('=', '<', '>', '<=', '>=', '<>'):
                if not murni: raise Menyerah(s)
                hasil.append({'=': '===', '<>': '!=='}.get(t, t))
            else: hasil.append(t)
    if tumpuk: raise Menyerah(s)
    return ' '.join(hasil)

# --- PRINT campuran --------------------------------------------------------
def cetakDaftar(sisa):
    """`"teks";VAR;"lagi"` -> deret m.cetak(...)."""
    keluar, i, n = [], 0, len(sisa)
    gantung = sisa.rstrip().endswith(';') or sisa.rstrip().endswith(',')
    bagian = []
    kini, dalam = '', False
    for ch in sisa:
        if ch == '"': dalam = not dalam
        if ch in ';,' and not dalam:
            bagian.append(kini); kini = ''
        else:
            kini += ch
    bagian.append(kini)
    for b in bagian:
        b = b.strip()
        if not b: continue
        if b.startswith('"'):
            keluar.append('m.cetak(%s);' % js(b.strip('"')))
        else:
            try: e = syarat(b)
            except Menyerah: return None
            keluar.append('m.cetak(bas(%s));' % e if not b.endswith('$') and '$' not in b
                          else 'm.cetak(%s);' % e)
    if not gantung: keluar.append('m.barisBaru();')
    return ' '.join(keluar)

P_PRINTC = re.compile(r'^PRINT\s+(.+)$')
P_IFSTMT = re.compile(r'^IF\s+(.+?)\s+THEN\s+(.+)$')
P_IFGOTO = re.compile(r'^IF\s+(.+?)\s+(?:THEN|GOTO)\s+(\d+)$')
P_ON = re.compile(r'^ON\s+(.+?)\s+(GOTO|GOSUB)\s+([\d,\s]+)$')
P_INPUT = re.compile(r'^INPUT\s*"([^"]*)"\s*[;,]\s*([A-Z][A-Z0-9]{0,7}\$?)$')
P_INPUT2 = re.compile(r'^INPUT\s+([A-Z][A-Z0-9]{0,7}\$?)$')
P_READ = re.compile(r'^READ\s+(.+)$')
P_DIM = re.compile(r'^DIM\s+(.+)$')
P_DIM1 = re.compile(r'^([A-Z][A-Z0-9]{0,7}\$?)\(([\d,\s]+)\)$')

def baris(isi):
    m = P_IFGOTO.match(isi)
    if m:
        try: c = syarat(m.group(1))
        except Menyerah: c = None
        if c: return 'if (%s) m.lompat(%s);' % (c, m.group(2))
    m = P_ON.match(isi)
    if m:
        try: e = syarat(m.group(1), False)
        except Menyerah: return None
        tuj = [x.strip() for x in m.group(3).split(',') if x.strip()]
        perintah = 'm.lompat' if m.group(2) == 'GOTO' else 'm.gosub'
        return ('var tj = [%s][%s - 1]; if (tj) %s(tj);'
                % (', '.join(tuj), e, perintah))
    m = P_INPUT.match(isi)
    if m:
        return "m.masukan(%s, %s);" % (js(m.group(2)), js(m.group(1)))
    m = P_INPUT2.match(isi)
    if m:
        return "m.masukan(%s, '? ');" % js(m.group(1))
    m = P_READ.match(isi)
    if m:
        pot = []
        for v in m.group(1).split(','):
            v = v.strip()
            mm = re.fullmatch(r'([A-Z][A-Z0-9]{0,7}\$?)\(([^)]+)\)', v)
            if mm:
                try: idx = syarat(mm.group(2), False)
                except Menyerah: return None
                pot.append('m.v[%s][%s] = m.baca();' % (js(mm.group(1) + '()'), idx))
            elif re.fullmatch(r'[A-Z][A-Z0-9]{0,7}\$?', v):
                pot.append('m.v[%s] = m.baca();' % js(v))
            else: return None
        return ' '.join(pot)
    m = P_DIM.match(isi)
    if m:
        pot = []
        for d in re.findall(r'[A-Z][A-Z0-9]{0,7}\$?\([\d,\s]+\)', m.group(1)):
            mm = P_DIM1.fullmatch(d)
            if not mm: return None
            batas = [x.strip() for x in mm.group(2).split(',')]
            pot.append("m.dim(%s, %s);" % (js(mm.group(1) + '()'), ', '.join(batas)))
        if pot and len(pot) == len(re.findall(r',(?![^()]*\))', m.group(1))) + 1:
            return ' '.join(pot)
        return None
    m = P_IFSTMT.match(isi)
    if m:
        try: c = syarat(m.group(1))
        except Menyerah: return None
        pot = []
        for p in TG.belah(m.group(2)):
            r = TG.penggal(p)
            if r is None:
                r2 = baris(p)
                if r2 is None: return None
                r = r2
            pot.append(r)
        return 'if (%s) { %s }' % (c, ' '.join(pot))
    m = P_PRINTC.match(isi)
    if m and ':' not in isi:
        r = cetakDaftar(m.group(1))
        if r: return r
    return None
