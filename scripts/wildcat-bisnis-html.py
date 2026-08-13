# -*- coding: utf-8 -*-
"""Menghasilkan web/docs/wildcat-bisnis.html dari wildcat-bisnis.md.

Pola dan alasannya sama persis dengan scripts/trucker-bisnis-html.py, dan
seluruh perkakas gambarnya dipakai ulang dari sana lewat exec -- bukan
disalin. Kalau helper diagramnya diperbaiki di satu tempat, keduanya ikut
membaik.

Yang khas WILDCAT hanya dua: tiga diagram alurnya, dan empat grafiknya yang
dihitung dari rumus biaya yang sama dengan yang tertulis di dokumennya.

Jalankan dari akar repositori:

    python scripts/wildcat-bisnis-html.py
"""
import io, os

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_T = os.path.join(AKAR, 'scripts', 'trucker-bisnis-html.py')
_ns = {'__file__': _T}
exec(io.open(_T, encoding='utf-8').read().split(chr(10) + 'if __name__')[0], _ns)

keHtml = _ns['keHtml']
kotak, belah, bagan = _ns['kotak'], _ns['belah'], _ns['bagan']
turun, kanan, kiri, kiriAtas, kananAtas = (_ns['turun'], _ns['kanan'],
    _ns['kiri'], _ns['kiriAtas'], _ns['kananAtas'])
_jalur, grafik = _ns['_jalur'], _ns['grafik']

SUMBER = os.path.join(AKAR, 'web', 'docs', 'wildcat-bisnis.md')
TUJUAN = os.path.join(AKAR, 'web', 'docs', 'wildcat-bisnis.html')

# ==========================================================================
#  Rumus — sama dengan yang tertulis di dokumennya
# ==========================================================================
def biaya(szn):
    """Bor $30/kaki zona + rekah $10/kaki (zona+500) + penyelesaian ~$2.200."""
    return 30 * szn + 10 * (szn + 500) + 2200

def sumur_terbeli(szn, modal=1000000):
    return modal // biaya(szn)

KERING = [25, 50, 75]        # peluang lubang kering per kelas lahan, %
TERKAYA = [15, 15, 20]       # peluang lapisan pembayaran tertinggi, %

# ==========================================================================
#  Grafik batang sederhana
# ==========================================================================
def batang(judul, sub, label, nilai, ymaks, satuan, kelas, lebar=760, tinggi=300):
    L, R, A, B = 70, 24, 52, 56
    pw, ph = lebar - L - R, tinggi - A - B
    o = ['<svg class="g-svg" viewBox="0 0 %d %d" role="img" aria-label="%s">'
         % (lebar, tinggi, judul)]
    o.append('<text class="g-judul" x="%d" y="22">%s</text>' % (L, judul))
    if sub:
        o.append('<text class="g-sub" x="%d" y="38">%s</text>' % (L, sub))
    for i in range(5):
        v = ymaks * i / 4.0
        y = A + ph - (v / ymaks) * ph
        o.append('<line class="g-kisi" x1="%d" y1="%.1f" x2="%.1f" y2="%.1f"/>'
                 % (L, y, L + pw, y))
        o.append('<text class="g-sumbu g-kanan" x="%d" y="%.1f">%d</text>'
                 % (L - 8, y + 4, round(v)))
    n = len(nilai)
    lb = pw / float(n)
    for i, v in enumerate(nilai):
        h = (v / float(ymaks)) * ph
        x = L + i * lb + lb * 0.22
        w = lb * 0.56
        o.append('<rect class="g-batang %s" x="%.1f" y="%.1f" width="%.1f" '
                 'height="%.1f" rx="4"/>' % (kelas[i], x, A + ph - h, w, h))
        o.append('<text class="g-legenda g-tengah" x="%.1f" y="%.1f">%s</text>'
                 % (x + w / 2, A + ph - h - 8, satuan % v))
        o.append('<text class="g-sumbu g-tengah" x="%.1f" y="%d">%s</text>'
                 % (x + w / 2, A + ph + 20, label[i]))
    o.append('</svg>')
    return '\n'.join(o)

def grafik_kering():
    return batang('Peluang lubang kering per kelas lahan',
                  'Tipe 3 kering tiga dari empat kali.',
                  ['Tipe 1', 'Tipe 2', 'Tipe 3'], KERING, 80, '%d %%',
                  ['g-a', 'g-b', 'g-c'])

def grafik_terkaya():
    return batang('Peluang mendarat di lapisan pembayaran TERTINGGI',
                  'Dan justru tipe 3 yang paling sering mendarat di sana.',
                  ['Tipe 1', 'Tipe 2', 'Tipe 3'], TERKAYA, 25, '%d %%',
                  ['g-a', 'g-b', 'g-c'])

def grafik_biaya():
    d = list(range(1000, 6001, 1000))
    return grafik('Biaya satu sumur terhadap kedalaman zona',
                  'Garis lurus: tidak ada penghematan skala, tidak ada titik optimal.',
                  [('biaya total', 'g-c', [(x, biaya(x) / 1000.0) for x in d])],
                  (1000, 6000), (0, 260), 'kedalaman zona (kaki)', 'ribu $', '%.0f')

def grafik_sumur():
    d = list(range(1000, 6001, 1000))
    return batang('Berapa sumur yang bisa dibiayai satu juta dolar',
                  'Penurunan tercuram di dua ribu kaki pertama, lalu mendatar.',
                  ['%d' % x for x in d], [sumur_terbeli(x) for x in d], 24, '%d',
                  ['g-a', 'g-a', 'g-b', 'g-b', 'g-c', 'g-c'])

GRAFIK = [grafik_kering, grafik_terkaya, grafik_biaya, grafik_sumur]

# ==========================================================================
#  Tiga diagram alur
# ==========================================================================
def diagram_1():
    """Susunan satu kolom dengan cabang ke samping.

    Versi pertama memakai jalur yang saya tulis koordinatnya sendiri untuk
    lengkung umpan balik, dan pemeriksa menemukan tiga ruas bertumpuk, satu
    ujung menggantung, dan dua jalur yang menembus kotak. Sekarang seluruh
    panahnya memakai helper -- yang berarti setiap panah dijamin berangkat
    dan mendarat di TEPI bentuk, dan jalurnya selalu siku. Lengkung umpan
    baliknya dihapus dan diganti kotak akhir yang menyatakan hal yang sama:
    diagram yang lebih jujur dibaca daripada diagram yang lebih pintar.
    """
    o = []
    a = kotak(o, 300, 10, 200, 44, 'Modal $1.000.000')
    b = belah(o, 290, 80, 220, 70, 'Pilih titik|di petak 10 x 10')
    c = kotak(o, 300, 186, 200, 46, 'Laporan geologi:|kedalaman zona')
    d = belah(o, 290, 268, 220, 74, 'Bor atau lewati?')
    x = kotak(o, 20, 278, 230, 54, 'Lewati - gratis,|coba titik lain', 'n-kotak n-aman')
    e = kotak(o, 300, 380, 200, 46, 'Bayar per kaki|di muka')
    f = belah(o, 290, 462, 220, 74, 'Ada minyak?')
    g = kotak(o, 20, 472, 230, 54, 'Lubang kering:|seluruh biaya hilang', 'n-kotak n-buruk')
    h = kotak(o, 560, 472, 240, 54, 'Rekah, selesaikan,|terima bayaran', 'n-kotak n-baik')
    turun(o, a, b)
    turun(o, b, c)
    turun(o, c, d)
    kiri(o, d, x, 'lewati')
    turun(o, d, e, 'bor')
    turun(o, e, f)
    kiri(o, f, g, 'tidak')
    kanan(o, f, h, 'ya')
    return bagan(820, 560, o)

def diagram_2():
    o = []
    a = belah(o, 290, 10, 230, 76, 'Sisa sumur|dan sisa kas?')
    b = kotak(o, 30, 170, 200, 54, 'TIPE 1|sering, sedang', 'n-kotak n-baik')
    c = kotak(o, 300, 170, 210, 54, 'TIPE 3|jarang, besar', 'n-kotak n-hati')
    d = kotak(o, 580, 170, 220, 54, 'TIPE 1 atau 2|jaga hasil', 'n-kotak n-aman')
    b2 = kotak(o, 30, 260, 200, 42, 'Membangun modal', 'n-catatan')
    c2 = kotak(o, 300, 260, 210, 42, 'Mengejar ketertinggalan', 'n-catatan')
    d2 = kotak(o, 580, 260, 220, 42, 'Mengunci laba', 'n-catatan')
    kiri(o, a, b, 'banyak sisa')
    turun(o, a, c, 'tinggal sedikit, masih rugi')
    kanan(o, a, d, 'sudah untung')
    turun(o, b, b2); turun(o, c, c2); turun(o, d, d2)
    return bagan(830, 320, o)

def diagram_3():
    """Tulang punggung tegak dengan satu daun di tiap sisi.

    Susunan sebelumnya bercabang dua ke kiri dan kanan lalu bercabang lagi,
    dan pemeriksa menemukan tiga ruas bertumpuk serta satu jalur menembus
    kotak. Sebabnya selalu sama: begitu dua panah keluar dari sisi yang
    sama pada ketinggian yang sama, ruasnya berimpit. Bentuk tulang
    punggung tegak -- satu keputusan per baris, satu daun ke kiri, satu ke
    kanan -- tidak bisa menghasilkan keadaan itu.
    """
    o = []
    a = kotak(o, 300, 10, 250, 44, 'Laporan geologi')
    b = belah(o, 290, 80, 270, 84, 'Biaya lebih dari|seperempat sisa kas?')
    x = kotak(o, 20, 92, 240, 60, 'Lewati - gratis,|kalau masih ada titik', 'n-kotak n-aman')
    c = belah(o, 290, 210, 270, 84, 'Sisa sumur|masih banyak?')
    y = kotak(o, 600, 226, 250, 52, 'Bor - main aman,|kumpulkan yang sedang', 'n-kotak n-baik')
    d = belah(o, 290, 340, 270, 84, 'Sudah untung?')
    e = kotak(o, 20, 356, 240, 52, 'Bor yang murah saja,|kunci hasil', 'n-kotak n-baik')
    f = kotak(o, 600, 350, 260, 64, 'Bor yang peluang lapisan|terkayanya paling besar', 'n-kotak n-hati')
    turun(o, a, b)
    kiri(o, b, x, 'ya')
    turun(o, b, c, 'tidak')
    kanan(o, c, y, 'ya')
    turun(o, c, d, 'tinggal 1-2')
    kiri(o, d, e, 'ya')
    kanan(o, d, f, 'tidak')
    return bagan(890, 450, o)

DIAGRAM = [diagram_1, diagram_2, diagram_3]

KERANGKA = """<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Boom County Petroleum — dokumen analisis bisnis</title>
<meta name="description" content="Dokumen analisis bisnis untuk usaha pengeboran minyak spekulatif 1982: logika pemilihan lokasi, logika kedalaman, kapan berhenti, dan tips lapangan. Diturunkan dari operasi WILDCAT.">
<link rel="stylesheet" href="../_shared/tokens.css">
<link rel="stylesheet" href="../_shared/base.css">
<link rel="stylesheet" href="trucker-bisnis.css">
</head>
<body>
<div id="topbar-host"></div>
<main class="wrap k-wrap">
  <article class="k-isi">
%s
  </article>
  <p class="k-kaki">Halaman ini dihasilkan dari <code>wildcat-bisnis.md</code>.
     Grafiknya <b>dihitung dari rumus biaya yang sama</b> dengan yang tertulis di
     dokumennya, jadi tabel dan grafik tidak mungkin berbeda. Ubah dokumennya,
     lalu jalankan <code>scripts/wildcat-bisnis-html.py</code>.</p>
  <p class="k-kaki"><a href="../games/wildcat/index.html">&larr; Kembali ke WILDCAT</a>
     &middot; <a href="wildcat.md">Dokumen arsitektur</a></p>
</main>
<script src="../_shared/ui.js"></script>
<script>
  var tb = window.RETRO.ui.topbar({
    title: 'Boom County Petroleum', source: 'Dokumen analisis bisnis · WILDCAT'
  });
  document.getElementById('topbar-host').append(tb);
  /* Topbar bersama menganggap dirinya dipasang dari web/games/<id>/. Halaman
     ini ada di web/docs/, satu tingkat lebih dangkal. */
  var pulang = document.querySelector('#topbar-host a[href$="index.html"]');
  if (pulang) pulang.setAttribute('href', '../index.html');
</script>
</body>
</html>
"""

if __name__ == '__main__':
    blok = keHtml(io.open(SUMBER, encoding='utf-8').read())
    n = m = 0
    for i, b in enumerate(blok):
        if b.startswith('<pre class="k-kode">flowchart'):
            blok[i] = '<figure class="n-gbr">%s</figure>' % DIAGRAM[n](); n += 1
        elif b.startswith('<pre class="k-kode">xychart-beta'):
            blok[i] = '<figure class="g-gbr">%s</figure>' % GRAFIK[m](); m += 1
    doc = KERANGKA % '\n'.join('    ' + x for x in blok)
    io.open(TUJUAN, 'w', encoding='utf-8').write(doc)
    print('%s: %d bita, %d blok, %d diagram, %d grafik'
          % (os.path.relpath(TUJUAN, AKAR), len(doc), len(blok), n, m))
