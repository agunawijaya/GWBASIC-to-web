# Merakit tracer/docs/<nama>.md dari metadata yang sudah ada di berkas program.
# Mermaid-nya dibangkitkan dengan mermaid.py, yang sudah diverifikasi identik
# bita demi bita dengan TRACER.peta.mermaid().
import re, sys, json, pathlib, io
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
import mermaid as M

TRACER = AKAR / 'tracer'
PROG, DOCS = TRACER / 'program', TRACER / 'docs'

# --- literal JS -> nilai Python ------------------------------------------
def gabungPlus(s):
    """`"a" + "b"` -> `"ab"`, berulang sampai habis."""
    pola = re.compile(r'"((?:[^"\\]|\\.)*)"\s*\+\s*"((?:[^"\\]|\\.)*)"')
    while True:
        baru = pola.sub(lambda m: '"' + m.group(1) + m.group(2) + '"', s)
        if baru == s:
            return s
        s = baru

def nilai(nama, kunci, kurung='{'):
    teks = (PROG / (nama + '.js')).read_text(encoding='utf-8')
    i = teks.index(kunci)
    i = teks.index(kurung, i)
    tutup = {'{': '}', '[': ']'}[kurung]
    dalam = 0
    for j in range(i, len(teks)):
        if teks[j] == kurung: dalam += 1
        elif teks[j] == tutup:
            dalam -= 1
            if dalam == 0:
                return json.loads(gabungPlus(M.keJson(teks[i:j + 1])))
    raise ValueError(kunci)

def tali(nama, kunci):
    """Ambil nilai string sederhana seperti `judul: '...'`."""
    teks = (PROG / (nama + '.js')).read_text(encoding='utf-8')
    i = teks.index('\n    ' + kunci + ':')
    j = teks.index('\n', i + 5)
    while teks[j - 1] == '+':                  # baris sambungan
        j = teks.index('\n', j + 1)
    return json.loads(gabungPlus(M.keJson(teks[i:j].split(':', 1)[1].strip().rstrip(','))))

# --- HTML sederhana -> Markdown ------------------------------------------
GANTI = [
    ('&mdash;', '—'), ('&ndash;', '–'), ('&hellip;', '…'), ('&minus;', '−'),
    ('&times;', '×'), ('&sup2;', '²'), ('&rarr;', '→'), ('&larr;', '←'),
    ('&ne;', '≠'), ('&ge;', '≥'), ('&le;', '≤'), ('&uacute;', 'ú'),
    ('&nbsp;', ' '), ('&amp;', '&'), ('&lt;', '<'), ('&gt;', '>'),
    ('&quot;', '"'), ('&#x2400;', '␀'),
]

def md(t):
    t = re.sub(r'<a href="([^"]+)\.html">(.*?)</a>', r'[\2](\1.md)', t)
    t = t.replace('<b>', '**').replace('</b>', '**')
    t = t.replace('<i>', '*').replace('</i>', '*')
    t = re.sub(r'<code>(.*?)</code>', lambda m: '`' + m.group(1) + '`', t, flags=re.S)
    t = t.replace('<br>', '\n').replace('<br/>', '\n')
    for a, b in GANTI:
        t = t.replace(a, b)
    return t

def bungkusKode(t):
    """Alinea yang SELURUHNYA baris BASIC jadi blok berpagar. Satu baris pun
    dipagar, supaya bentuknya sama dengan halaman docs yang sudah ada."""
    p = t.strip()
    if not (p.startswith('`') and p.endswith('`')):
        return t
    baris = [b.strip().strip('`').strip() for b in p.split('\n') if b.strip()]
    if baris and all(re.match(r'^\d+ ', b) or b in ('…', '...') for b in baris):
        return '```basic\n' + '\n'.join(baris) + '\n```'
    return t

def alinea(daftar):
    out = []
    for a in daftar:
        t = bungkusKode(md(a))
        out.append(t)
    return '\n\n'.join(out)

# --- perakit --------------------------------------------------------------
def halaman(nama, urutan, tetangga, pembuka):
    judul = tali(nama, 'judul')
    berkas = tali(nama, 'berkas')
    catatan = tali(nama, 'catatanAsli')
    ar = nilai(nama, 'arsitektur:')
    pseudo = nilai(nama, 'pseudokode:', '[')
    peny = nilai(nama, 'penyimpangan:', '[')
    pel = nilai(nama, 'pelajaran:')
    penj = nilai(nama, 'penjelasan:', '[')
    src = AKAR / berkas
    d = src.read_bytes().split(b'\x1a')[0].decode('cp437').replace('\r\n', '\n')
    nomor = [int(m.group(1)) for m in re.finditer(r'^(\d+)', d, re.M)]

    L = []
    L.append('# %s.BAS di penelusur\n' % nama)
    L.append('> Program %s. %d baris, nomor %d–%d, cakupan tabel\n'
             '> **%d/%d (100%%)**.\n' %
             (urutan, len(nomor), nomor[0], nomor[-1], len(nomor), len(nomor)))
    L.append('Sumber: `%s` · tabel: `tracer/program/%s.js`\n' % (berkas, nama))
    L.append(judul.split('—')[0].strip() + '. ' + pembuka + '\n')

    for bagian in penj:
        L.append('## ' + md(bagian['judul']) + '\n')
        L.append(alinea(bagian['isi']) + '\n')

    L.append('## Peta arsitektur\n')
    L.append('```mermaid\n' + M.mermaid(ar) + '\n```\n')

    L.append('## Alur yang layak diikuti\n')
    L.append('| baris | yang terjadi |\n|---|---|')
    for p in pseudo:
        L.append('| `%s` | %s |' % (p['baris'], md(p['teks']).replace('\n', ' ')))
    L.append('')

    L.append('## Yang bisa dicoba di halaman\n')
    L.append('| coba ini | yang terlihat |\n|---|---|')
    for p in pseudo[:5]:
        b = str(p['baris']).split(',')[0].split('-')[0].strip()
        L.append('| pasang titik henti di %s | %s |' %
                 (b, md(p['teks']).replace('\n', ' ').replace('|', '\\|')))
    L.append('')
    L.append('Aslinya dijalankan dengan `%s`.\n' % tali(nama, 'perintahAsli'))
    L.append('> %s\n' % md(catatan).replace('\n', ' '))

    L.append('## Penyimpangan dari aslinya\n')
    for i, p in enumerate(peny, 1):
        L.append('%d. %s' % (i, md(p).replace('\n', ' ')))
    L.append('')

    L.append('## Yang layak ditiru\n')
    for judulKecil, *isi in pel['pelajari']:
        L.append('**%s.** %s\n' % (md(judulKecil), ' '.join(md(x) for x in isi)))

    L.append('## Yang jangan ditiru\n')
    for judulKecil, *isi in pel['hindari']:
        L.append('**%s.** %s\n' % (md(judulKecil), ' '.join(md(x) for x in isi)))

    L.append('---')
    L.append('[Rancangan penelusur](_rancangan.md) · ' + tetangga)
    return '\n'.join(L) + '\n'
