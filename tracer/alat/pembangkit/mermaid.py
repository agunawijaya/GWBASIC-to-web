# Membangkitkan blok Mermaid untuk docs/*.md, meniru persis mesin/peta.js.
# Objek `arsitektur` dibaca dari berkas program dengan penguraian kecil —
# bentuknya selalu literal JS sederhana, tanpa ungkapan.
import re, io, sys, json, pathlib
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PROG = AKAR / 'tracer' / 'program'

BUNGKUS = {
    'mulai':    ('(["', '"])'),
    'keluar':   ('(["', '"])'),
    'putusan':  ('{"', '"}'),
    'subrutin': ('[["', '"]]'),
    'galat':    ('[/"', '"/]'),
    'proses':   ('["', '"]'),
}

def lolos(t):
    return str(t).replace('"', '#quot;').replace('|', '#124;')

def mermaid(ar):
    keluar = ['flowchart TD']
    for s in ar['simpul']:
        b = BUNGKUS.get(s.get('jenis') or 'proses', BUNGKUS['proses'])
        keluar.append('    ' + s['id'] + b[0] +
                      '<b>' + lolos(s['baris']) + '</b><br/>' +
                      '<br/>'.join(lolos(x) for x in s['teks']) + b[1])
    keluar.append('')
    for p in ar.get('panah', []):
        keluar.append('    ' + p['dari'] +
                      (" -->|" + lolos(p['label']) + "| " if p.get('label')
                       else ' --> ') + p['ke'])
    return '\n'.join(keluar)

def ambilBlok(teks, kunci):
    """Potong nilai objek `kunci: { ... }` dengan menghitung kurung."""
    i = teks.index(kunci)
    i = teks.index('{', i)
    dalam = 0
    for j in range(i, len(teks)):
        if teks[j] == '{': dalam += 1
        elif teks[j] == '}':
            dalam -= 1
            if dalam == 0:
                return teks[i:j + 1]
    raise ValueError('kurung tidak seimbang')

def keJson(js):
    """Literal objek JS sederhana -> JSON. Kunci tanpa kutip, string berkutip
    tunggal, dan koma menggantung."""
    out, i, n = [], 0, len(js)
    while i < n:
        c = js[i]
        if c == "'":                       # string berkutip tunggal
            j = i + 1; isi = []
            while js[j] != "'":
                if js[j] == '\\':
                    isi.append(js[j:j + 2]); j += 2
                else:
                    isi.append(js[j]); j += 1
            out.append(json.dumps(''.join(isi).replace("\\'", "'")))
            i = j + 1
        elif c == '"':
            j = i + 1
            while js[j] != '"':
                j += 2 if js[j] == '\\' else 1
            out.append(js[i:j + 1]); i = j + 1
        elif c.isalpha() or c == '_':      # kunci telanjang
            j = i
            while j < n and (js[j].isalnum() or js[j] in '_$'): j += 1
            kata = js[i:j]
            sisa = js[j:].lstrip()
            out.append('"%s"' % kata if sisa.startswith(':') else kata)
            i = j
        else:
            out.append(c); i += 1
    s = ''.join(out)
    s = re.sub(r',(\s*[}\]])', r'\1', s)   # koma menggantung
    return s

def arsitektur(nama):
    teks = (PROG / (nama + '.js')).read_text(encoding='utf-8')
    return json.loads(keJson(ambilBlok(teks, 'arsitektur:')))

if __name__ == '__main__':
    for nama in sys.argv[1:]:
        print('=====' + nama)
        print(mermaid(arsitektur(nama)))
