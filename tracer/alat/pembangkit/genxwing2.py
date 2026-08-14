# -*- coding: utf-8 -*-
import pathlib, re, json, sys
import pathlib as _pl, sys as _sys
_ALAT = _pl.Path(__file__).resolve().parent
AKAR = _ALAT.parents[2]          # .../old_games
if str(_ALAT) not in _sys.path: _sys.path.insert(0, str(_ALAT))
import genxwing as G
from xwexpr import terjemah, Menyerah

def js(s): return json.dumps(s, ensure_ascii=False)
src, NOMOR = G.src, G.NOMOR
hasil = {}

P_LP   = re.compile(r'^LOCATE\s+(\d+)\s*,\s*(\d+)\s*:\s*PRINT\s*"([^"]*)"\s*(;?)$')
P_PLAY = re.compile(r'^(PLAY\s*"[^"]*"|SOUND\b[^:]*)(\s*:\s*(PLAY\s*"[^"]*"|SOUND\b[^:]*))*$')
P_REM  = re.compile(r"^(REM\b.*|'.*)$")
P_PUT  = re.compile(r'^PUT\s*\(([^,]+),([^)]+)\)\s*,\s*([A-Z][A-Z0-9]*)$')
P_FOR  = re.compile(r'^FOR\s+([A-Z][A-Z0-9]*)\s*=\s*([^ ]+(?: [^ ]+)*?)\s+TO\s+([^ ]+)(?:\s+STEP\s+(-?\d+))?$')
P_NEXT = re.compile(r'^NEXT\s*([A-Z][A-Z0-9]*)?$')
P_IFG  = re.compile(r'^IF\s+(.+?)\s+(?:THEN|GOTO)\s+(\d+)$')
P_ASG  = re.compile(r'^([A-Z][A-Z0-9]*)\s*=\s*(.+)$')

def coba(f, *a):
    try: return f(*a)
    except Menyerah: return None

for n in NOMOR:
    isi = src[n].strip()
    for f in (G.cetak, G.larik):
        r = f(n)
        if r: hasil[n] = r; break
    if n in hasil: continue

    m = P_LP.match(isi)
    if m:
        akhir = '' if m.group(4) else ' m.barisBaru();'
        hasil[n] = ("  T({ baris: %d, jalan: function (m) { m.locate(%s, %s); m.cetak(%s);%s } });"
                    % (n, m.group(1), m.group(2), js(m.group(3)), akhir)); continue
    if P_PLAY.match(isi):
        hasil[n] = "  T({ baris: %d, jalan: function () { /* %s */ } });" % (n, isi.replace('*/', '')); continue
    if P_REM.match(isi):
        hasil[n] = "  rem(%d);" % n; continue
    m = P_PUT.match(isi)
    if m:
        a = coba(terjemah, m.group(1)); b = coba(terjemah, m.group(2))
        if a and b:
            hasil[n] = ("  T({ baris: %d, jalan: function (m) { m.taruh(%s, %s, m.v['%s()'], 'XOR'); } });"
                        % (n, a, b, m.group(3))); continue
    m = P_FOR.match(isi)
    if m:
        a = coba(terjemah, m.group(2)); b = coba(terjemah, m.group(3))
        if a and b:
            langkah = m.group(4) or '1'
            hasil[n] = ("  T({ baris: %d, jalan: function (m) { m.untuk('%s', %s, %s, %s); } });"
                        % (n, m.group(1), a, b, langkah)); continue
    m = P_NEXT.match(isi)
    if m:
        nama = "'%s'" % m.group(1) if m.group(1) else ''
        hasil[n] = "  T({ baris: %d, jalan: function (m) { m.lanjutkan(%s); } });" % (n, nama); continue
    m = P_IFG.match(isi)
    if m:
        c = coba(terjemah, m.group(1), True)
        if c:
            hasil[n] = ("  T({ baris: %d, jalan: function (m) { if (%s) m.lompat(%s); } });"
                        % (n, c, m.group(2))); continue

    if re.fullmatch(r'GOSUB\s+(\d+)', isi):
        hasil[n] = "  T({ baris: %d, jalan: function (m) { m.gosub(%s); } });" % (n, re.fullmatch(r'GOSUB\s+(\d+)', isi).group(1)); continue
    if re.fullmatch(r'GOTO\s+(\d+)', isi):
        hasil[n] = "  T({ baris: %d, jalan: function (m) { m.lompat(%s); } });" % (n, re.fullmatch(r'GOTO\s+(\d+)', isi).group(1)); continue
    if re.fullmatch(r'RETURN', isi):
        hasil[n] = "  T({ baris: %d, jalan: function (m) { m.kembali(); } });" % n; continue
    m = re.fullmatch(r'LOCATE\s+(\d+)\s*,\s*(\d+)\s*:\s*PRINT\s+([A-Z][A-Z0-9]*(?:\s*\*\s*\d+)?)', isi)
    if m:
        e = coba(terjemah, m.group(3))
        if e:
            hasil[n] = ("  T({ baris: %d, jalan: function (m) { m.locate(%s, %s); m.cetak(bas(%s)); m.barisBaru(); } });"
                        % (n, m.group(1), m.group(2), e)); continue
    if '"' not in isi and 'IF' not in isi and ':' in isi:
        bagian = [b.strip() for b in isi.split(':') if b.strip()]
        semua = [re.fullmatch(r'([A-Z][A-Z0-9]*)\s*=\s*(.+)', b) for b in bagian]
        if all(semua):
            ter = [coba(terjemah, x.group(2)) for x in semua]
            if all(ter):
                badan = ' '.join("m.v[%r] = %s;" % (semua[i].group(1), ter[i]) for i in range(len(ter)))
                hasil[n] = "  T({ baris: %d, jalan: function (m) { %s } });" % (n, badan); continue
    m = P_ASG.match(isi)
    if m and ':' not in isi and '"' not in isi:
        e = coba(terjemah, m.group(2))
        if e:
            hasil[n] = ("  T({ baris: %d, jalan: function (m) { m.v['%s'] = %s; } });"
                        % (n, m.group(1), e)); continue

(_ALAT / str(_ALAT / 'xwing_mekanis.txt')).write_text(
    '\n'.join('%d\t%s' % (n, hasil[n]) for n in sorted(hasil)), encoding='utf-8')
sisa = [n for n in NOMOR if n not in hasil]
(_ALAT / str(_ALAT / 'xwing_sisa.txt')).write_text(
    '\n'.join('%d %s' % (n, src[n]) for n in sisa), encoding='utf-8')
print('dibangkitkan', len(hasil), '  sisa ditulis tangan', len(sisa))
