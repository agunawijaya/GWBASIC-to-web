# -*- coding: utf-8 -*-
"""Menghasilkan web/docs/trucker-bisnis.html dari trucker-bisnis.md.

Dua hal yang tidak bisa diserahkan ke peramban, dan karena itu dikerjakan
di sini:

1. MERMAID butuh pustaka JavaScript, dan proyek ini melarang CDN. Jadi
   keempat diagram alirnya digambar sebagai SVG buatan tangan di berkas ini.
   Blok ```mermaid di dalam .md dibiarkan apa adanya -- GitHub merendernya
   sendiri -- dan di halaman HTML ia DIGANTI oleh SVG padanannya, urut.

2. GRAFIK dihitung dari rumus yang sama dengan yang tertulis di dokumennya,
   bukan digambar dengan tangan. Kalau rumusnya salah, kurvanya ikut salah --
   itu memang yang diinginkan: kurva dan tabel harus tidak mungkin berbeda.

Jalankan dari akar repositori:

    python scripts/trucker-bisnis-html.py
"""
import io, os, sys, math

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, 'scripts'))
# Penafsir Markdown-nya dipakai ulang dari katalog-html.py lewat exec, karena
# nama berkasnya bertanda hubung dan tidak bisa di-import langsung.
_ns = {'__file__': os.path.join(AKAR, 'scripts', 'katalog-html.py')}
exec(io.open(_ns['__file__'], encoding='utf-8').read().split("if __name__")[0], _ns)
keHtml, sisip = _ns['keHtml'], _ns['sisip']
# Halaman ini tinggal di web/docs/ dan menaut ke tetangganya sendiri,
# jadi tautan relatifnya TIDAK boleh diberi awalan '../'.
_ns['AWALAN'] = ''

SUMBER = os.path.join(AKAR, 'web', 'docs', 'trucker-bisnis.md')
TUJUAN = os.path.join(AKAR, 'web', 'docs', 'trucker-bisnis.html')

# ==========================================================================
#  Saklar bahasa
#
#  Dokumennya terbit dalam dua bahasa sebagai berkas TERPISAH, bukan
#  dwibahasa berselang-seling. Prosanya diterjemahkan di berkas .md
#  masing-masing; yang tidak bisa diterjemahkan di sana adalah label di
#  dalam diagram dan grafik, karena label itu hidup di dalam Python ini.
#
#  Karena itu terjemahannya SATU KAMUS, bukan generator kedua. Menyalin
#  generatornya berarti dua berkas yang perlahan menyimpang; kamus berarti
#  label yang belum diterjemahkan lewat apa adanya dan langsung kelihatan
#  waktu halamannya dibaca.
#
#  Kunci kamus HARUS sama persis dengan yang tertulis di pemanggilnya,
#  termasuk tanda '|' pemisah barisnya.
# ==========================================================================
BAHASA = 'id'

EN = {
    # -- diagram 1: usaha dalam satu paragraf
    'Terminal|Los Angeles': 'Los Angeles|terminal',
    'Pilih muatan': 'Choose a load',
    'Tentukan|berat': 'Set the|weight',
    'Beli bahan|bakar &amp; ban': 'Buy fuel|&amp; tires',
    'Pilih rute': 'Pick a route',
    'Perjalanan:|keputusan tiap jam': 'The run:|hourly decisions',
    'Gudang|New York': 'New York|warehouse',
    'Laba?': 'Profit?',
    'Bangkrut': 'Out of business',
    'rugi': 'loss',
    'laba, muat lagi': 'profit, load again',
    # -- diagram 2: pemilihan muatan
    'Truk prima?|Cuaca baik?': 'Truck sound?|Weather good?',
    'JERUK': 'ORANGES',
    'Punya|cadangan kas?': 'Any cash|in reserve?',
    'ANGKUTAN UMUM': 'GENERAL FREIGHT',
    'SURAT POS': 'MAIL',
    '6,5 c/pon, bisa nihil': '6.5 c/lb, can pay nothing',
    '5,0 c/pon, tenggat 95 jam': '5.0 c/lb, 95-hour deadline',
    '4,75 c/pon, tanpa risiko': '4.75 c/lb, no risk',
    'ya': 'yes',
    'tidak': 'no',
    # -- diagram 3: kecepatan
    'Berapa cepat jam ini?': 'How fast this hour?',
    'Terlambat dari|tenggat?': 'Behind the|deadline?',
    '55 MPH|biaya minimum': '55 MPH|minimum cost',
    'Muatan punya|denda telat?': 'Does the load|penalize lateness?',
    'Denda 10 % lebih besar|dari tambahan biaya?':
        'Is the 10 % penalty|bigger than the added cost?',
    'Naikkan ke 65|masih aman tilang': 'Push to 65|still ticket-safe',
    'Sudah 3 kali|ditilang?': 'Three tickets|already?',
    'JANGAN.|Keempat = usaha tamat': 'DO NOT.|A fourth ends the business',
    'Boleh, per jam': 'Allowed, hour by hour',
    'surat pos': 'mail',
    'jeruk': 'oranges',
    'angkutan umum': 'general freight',
    # -- diagram 4: rute
    'Musim dan|cuaca?': 'Season and|weather?',
    'SELATAN 3.120 mil|+$118, badai terendah':
        'SOUTHERN 3,120 mi|+$118, lowest blizzard risk',
    'Muatan?': 'Which load?',
    'UTARA 2.710 mil|terpendek, tercepat': 'NORTHERN 2,710 mi|shortest, fastest',
    'TENGAH 2.850 mil|seimbang': 'CENTRAL 2,850 mi|balanced',
    'Jangan ngebut: denda tertinggi': 'Do not speed here: highest fines',
    'musim dingin': 'winter',
    'cuaca baik': 'fair weather',
    'jeruk / ketat': 'oranges / tight',
    # -- grafik
    'Efisiensi bahan bakar terhadap kecepatan': 'Fuel efficiency against speed',
    'Puncaknya tepat di 55 MPH. Terlalu pelan sama borosnya dengan terlalu cepat.':
        'It peaks exactly at 55 MPH. Too slow wastes as much as too fast.',
    'mil per galon': 'miles per gallon',
    'kecepatan (MPH)': 'speed (MPH)',
    'mpg': 'mpg',
    'Biaya per mil terhadap kecepatan': 'Cost per mile against speed',
    'Minimum di 55 MPH. Pada 70 MPH biayanya dua kali lipat, hemat waktu hanya 21 %.':
        'Lowest at 55 MPH. At 70 MPH it doubles, and saves only 21 % of the time.',
    'bahan bakar': 'fuel',
    'waktu ($85/hari)': 'time ($85/day)',
    'denda harapan': 'expected fines',
    'TOTAL': 'TOTAL',
    '$ / mil': '$ / mile',
    'Peluang ditilang per jam': 'Chance of a ticket per hour',
    'Nol sampai 10 MPH di atas batas, lalu naik kuadratik sampai kepastian di 90.':
        'Zero up to 10 MPH over the limit, then quadratic to certainty at 90.',
    'peluang / jam': 'chance / hour',
    'kecepatan (MPH), batas 55': 'speed (MPH), limit 55',
    # -- grafik rute (teks tertulis langsung)
    'Rute: jarak melawan risiko cuaca': 'Routes: distance against weather risk',
    'Yang terpendek justru paling sering kena badai salju. '
    'Itu yang membuat pilihannya nyata.':
        'The shortest one is the one blizzards hit most often. '
        'That is what makes the choice real.',
    'UTARA': 'NORTHERN',
    'TENGAH': 'CENTRAL',
    'SELATAN': 'SOUTHERN',
    'risiko badai': 'blizzard risk',
    'mil': 'miles',
}


def T(s):
    """Terjemahkan label kalau BAHASA == 'en'; kalau tidak, kembalikan apa adanya.

    Label yang belum ada di kamus sengaja LEWAT tanpa galat. Diagram yang
    setengah diterjemahkan langsung terlihat waktu halamannya dibuka, dan itu
    umpan balik yang lebih cepat daripada KeyError saat digenerate.
    """
    if BAHASA != 'en' or not isinstance(s, str):
        return s
    return EN.get(s, s)

# ==========================================================================
#  Rumus — sama persis dengan yang tertulis di dokumennya
# ==========================================================================
def mpg(sp):
    return 4.5 - 0.2 * min(abs(55 - sp), 12.5)

def galon_per_jam(sp):
    return sp / mpg(sp)

def biaya_bbm_per_mil(sp, harga=1.0):
    return harga / mpg(sp)

def biaya_waktu_per_mil(sp, per_hari=85.0):
    return (per_hari / 24.0) / sp

def peluang_tilang(sp, batas=55):
    """Pemeriksaan baru berjalan kalau lebih dari 10 di atas batas."""
    if sp <= batas + 10:
        return 0.0
    return min(1.0, ((sp - batas - 5) ** 2) / 900.0)

def denda_harapan_per_mil(sp, batas=55):
    p = peluang_tilang(sp, batas)
    if p == 0:
        return 0.0
    denda = 9.5 + 2.0 * (sp - batas)      # pelanggaran pertama, nilai tengah
    jam = 1.0 * (85.0 / 24.0)             # satu jam menunggu sidang
    return p * (denda + jam) / sp

def biaya_total_per_mil(sp):
    return biaya_bbm_per_mil(sp) + biaya_waktu_per_mil(sp) + denda_harapan_per_mil(sp)

# ==========================================================================
#  Penggambar grafik garis
# ==========================================================================
def grafik(judul, sub, deret, xr, yr, xlab, ylab, fmt='%.2f', lebar=760, tinggi=320):
    """deret = [(nama, kelas, [(x,y),...]), ...]"""
    judul, sub, xlab, ylab = T(judul), T(sub), T(xlab), T(ylab)
    L, R, A, B = 62, 24, 46, 52
    pw, ph = lebar - L - R, tinggi - A - B
    x0, x1 = xr; y0, y1 = yr
    px = lambda x: L + (x - x0) / (x1 - x0) * pw
    py = lambda y: A + ph - (y - y0) / (y1 - y0) * ph
    o = ['<svg class="g-svg" viewBox="0 0 %d %d" role="img" aria-label="%s">'
         % (lebar, tinggi, judul)]
    o.append('<text class="g-judul" x="%d" y="20">%s</text>' % (L, judul))
    if sub:
        o.append('<text class="g-sub" x="%d" y="36">%s</text>' % (L, sub))
    # kisi mendatar
    for i in range(5):
        y = y0 + (y1 - y0) * i / 4.0
        yy = py(y)
        o.append('<line class="g-kisi" x1="%d" y1="%.1f" x2="%.1f" y2="%.1f"/>'
                 % (L, yy, L + pw, yy))
        o.append('<text class="g-sumbu g-kanan" x="%d" y="%.1f">%s</text>'
                 % (L - 8, yy + 4, fmt % y))
    # Kisi tegak + label.
    #
    # Langkahnya HARUS diturunkan dari rentangnya, bukan ditulis tetap.
    # Aturan lama -- "5 kalau rentangnya <= 50, selain itu 10" -- ditulis
    # untuk sumbu MPH (35..80). Begitu dipakai untuk rentang 1000..6000 ia
    # menghasilkan 501 tanda sumbu yang saling menimpa jadi gumpalan hitam.
    #
    # Sekarang langkahnya dipilih dari deret angka bulat yang enak dibaca
    # (1, 2, 2,5, 5, 10 dikali pangkat sepuluh) sehingga jumlah tandanya
    # selalu sekitar enam sampai delapan, berapa pun rentangnya. Dan kalau
    # ternyata masih terlalu rapat -- label panjang, bidang sempit -- teksnya
    # dimiringkan alih-alih dibiarkan bertumpuk.
    import math
    kasar = (x1 - x0) / 6.0
    mag = 10 ** math.floor(math.log10(kasar)) if kasar > 0 else 1
    langkah = mag * 10
    for m in (1, 2, 2.5, 5, 10):
        if mag * m >= kasar:
            langkah = mag * m
            break
    mulai = math.ceil(x0 / langkah) * langkah
    tanda = []
    x = mulai
    while x <= x1 + 0.01:
        tanda.append(x)
        x += langkah
    # Muat atau tidak? Perkirakan lebar label dari jumlah karakternya.
    lebarLabel = max(len(('%g' % v)) for v in tanda) * 7 + 10
    jarak = pw / max(1, len(tanda) - 1)
    miring = lebarLabel > jarak
    for v in tanda:
        xx = px(v)
        o.append('<line class="g-kisiT" x1="%.1f" y1="%d" x2="%.1f" y2="%.1f"/>'
                 % (xx, A, xx, A + ph))
        if miring:
            o.append('<text class="g-sumbu g-kanan" x="%.1f" y="%d" '
                     'transform="rotate(-35 %.1f %d)">%g</text>'
                     % (xx, A + ph + 16, xx, A + ph + 16, v))
        else:
            o.append('<text class="g-sumbu g-tengah" x="%.1f" y="%d">%g</text>'
                     % (xx, A + ph + 18, v))
    o.append('<text class="g-sumbu g-tengah" x="%.1f" y="%d">%s</text>'
             % (L + pw / 2, tinggi - (2 if miring else 8), xlab))
    o.append('<text class="g-sumbu" x="4" y="%d">%s</text>' % (A - 10, ylab))
    # deret
    for i, (nama, kelas, titik) in enumerate(deret):
        d = ' '.join(('%s%.1f %.1f' % ('M' if k == 0 else 'L', px(a), py(b)))
                     for k, (a, b) in enumerate(titik))
        o.append('<path class="g-garis %s" d="%s"/>' % (kelas, d))
        for a, b in titik:
            o.append('<circle class="g-titik %s" cx="%.1f" cy="%.1f" r="3"/>'
                     % (kelas, px(a), py(b)))
        o.append('<rect class="g-kunci %s" x="%d" y="%d" width="14" height="4"/>'
                 % (kelas, L + pw - 190, 18 + i * 16))
        o.append('<text class="g-legenda" x="%d" y="%d">%s</text>'
                 % (L + pw - 170, 22 + i * 16, T(nama)))
    o.append('</svg>')
    return '\n'.join(o)

def kotak(o, x, y, w, h, teks, kelas='n-kotak', rx=6):
    o.append('<rect class="%s" x="%d" y="%d" width="%d" height="%d" rx="%d"/>'
             % (kelas, x, y, w, h, rx))
    baris = T(teks).split('|')
    y0 = y + h / 2 - (len(baris) - 1) * 7 + 5
    for i, b in enumerate(baris):
        o.append('<text class="n-teks" x="%d" y="%.1f">%s</text>'
                 % (x + w / 2, y0 + i * 14, b))
    return {'x': x, 'y': y, 'w': w, 'h': h}

def belah(o, x, y, w, h, teks):
    cx, cy = x + w / 2.0, y + h / 2.0
    o.append('<path class="n-belah" d="M%.1f %d L%d %.1f L%.1f %d L%d %.1f Z"/>'
             % (cx, y, x + w, cy, cx, y + h, x, cy))
    baris = T(teks).split('|')
    y0 = cy - (len(baris) - 1) * 7 + 5
    for i, b in enumerate(baris):
        o.append('<text class="n-teks" x="%.1f" y="%.1f">%s</text>' % (cx, y0 + i * 14, b))
    return {'x': x, 'y': y, 'w': w, 'h': h}

# --------------------------------------------------------------------------
# Panah dihitung dari TEPI bentuk, bukan dari koordinat yang ditulis tangan.
#
# Versi pertama menaruh titik awal dan akhir panah dengan angka yang saya
# perkirakan sendiri. Akibatnya dua cacat yang keduanya terlihat: ujung panah
# menggantung tidak menempel ke bentuknya, dan garis miring menembus kotak
# yang kebetulan ada di jalurnya. Sekarang jangkarnya diambil dari sisi
# bentuk, dan jalurnya SIKU -- keluar tegak lurus, belok, masuk tegak lurus --
# sehingga tidak pernah memotong bentuk lain secara miring.
# --------------------------------------------------------------------------
def sisi(n, arah):
    x, y, w, h = n['x'], n['y'], n['w'], n['h']
    cx, cy = x + w / 2.0, y + h / 2.0
    return {'atas': (cx, y), 'bawah': (cx, y + h),
            'kiri': (x, cy), 'kanan': (x + w, cy)}[arah]

def _lbl(o, x, y, teks):
    if teks:
        o.append('<text class="n-label" x="%.1f" y="%.1f">%s</text>' % (x, y - 6, T(teks)))

def _jalur(o, titik, label=''):
    d = ' '.join('%s%.1f %.1f' % ('M' if k == 0 else 'L', a, b)
                 for k, (a, b) in enumerate(titik))
    o.append('<path class="n-panah" marker-end="url(#mata)" d="%s"/>' % d)
    if label:
        m = titik[len(titik) // 2]
        _lbl(o, m[0], m[1], label)

def turun(o, a, b, label=''):
    x1, y1 = sisi(a, 'bawah'); x2, y2 = sisi(b, 'atas')
    ym = (y1 + y2) / 2.0
    _jalur(o, [(x1, y1), (x1, ym), (x2, ym), (x2, y2)], label)

def kanan(o, a, b, label=''):
    x1, y1 = sisi(a, 'kanan'); x2, y2 = sisi(b, 'kiri')
    xm = (x1 + x2) / 2.0
    _jalur(o, [(x1, y1), (xm, y1), (xm, y2), (x2, y2)], label)

def kiri(o, a, b, label=''):
    x1, y1 = sisi(a, 'kiri'); x2, y2 = sisi(b, 'kanan')
    xm = (x1 + x2) / 2.0
    _jalur(o, [(x1, y1), (xm, y1), (xm, y2), (x2, y2)], label)

def kiriAtas(o, a, b, label=''):
    """Keluar dari sisi KIRI a, menyusur mendatar, lalu masuk dari ATAS b.

    Dipakai kalau sudah ada panah lain yang masuk ke b dari samping. Dua
    panah yang sama-sama masuk lewat sisi kanan akan berbagi ruas dan
    tergambar bertumpuk -- terlihat seperti satu garis, padahal dua.
    """
    x1, y1 = sisi(a, 'kiri'); x2, y2 = sisi(b, 'atas')
    _jalur(o, [(x1, y1), (x2, y1), (x2, y2)], label)

def kananAtas(o, a, b, label=''):
    x1, y1 = sisi(a, 'kanan'); x2, y2 = sisi(b, 'atas')
    _jalur(o, [(x1, y1), (x2, y1), (x2, y2)], label)

def balik(o, a, b, lewat_y, label=''):
    """Umpan balik: turun dari a, menyusur, lalu naik ke sisi bawah b."""
    x1, y1 = sisi(a, 'bawah'); x2, y2 = sisi(b, 'bawah')
    _jalur(o, [(x1, y1), (x1, lewat_y), (x2, lewat_y), (x2, y2)], label)

def bagan(lebar, tinggi, isi):
    return ('<svg class="n-svg" viewBox="0 0 %d %d" role="img">'
            '<defs><marker id="mata" viewBox="0 0 10 10" refX="9" refY="5" '
            'markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
            '<path d="M0 0 L10 5 L0 10 z" class="n-mata"/></marker></defs>'
            '%s</svg>' % (lebar, tinggi, '\n'.join(isi)))

# ==========================================================================
#  Empat diagram — seluruhnya memakai jalur siku dari tepi ke tepi
# ==========================================================================
def diagram_1():
    o = []
    a = kotak(o, 20, 30, 130, 46, 'Terminal|Los Angeles')
    b = belah(o, 190, 20, 140, 66, 'Pilih muatan')
    c = kotak(o, 370, 30, 120, 46, 'Tentukan|berat')
    d = kotak(o, 530, 30, 140, 46, 'Beli bahan|bakar &amp; ban')
    e = belah(o, 710, 20, 130, 66, 'Pilih rute')
    f = kotak(o, 340, 160, 170, 46, 'Perjalanan:|keputusan tiap jam')
    g = kotak(o, 560, 160, 140, 46, 'Gudang|New York')
    h = belah(o, 740, 150, 130, 66, 'Laba?')
    i = kotak(o, 340, 270, 170, 46, 'Bangkrut', 'n-kotak n-buruk')
    kanan(o, a, b); kanan(o, b, c); kanan(o, c, d); kanan(o, d, e)
    _jalur(o, [(775, 86), (775, 120), (425, 120), (425, 160)])
    kanan(o, f, g); kanan(o, g, h)
    # "rugi" keluar lewat sisi BAWAH, "laba" lewat sisi KANAN. Versi
    # sebelumnya memakai sisi bawah untuk keduanya, jadi ruas tegak dari
    # y=216 sampai y=293 tergambar dua kali, bertumpuk.
    _jalur(o, [(805, 216), (805, 293), (510, 293)], 'rugi')
    _jalur(o, [(870, 183), (895, 183), (895, 350), (260, 350), (260, 86)],
           'laba, muat lagi')
    # 1000, bukan 920: label 'laba, muat lagi' dipusatkan di x=895 dan
    # separuh lebarnya keluar bingkai.
    return bagan(1000, 380, o)

def diagram_2():
    o = []
    a = belah(o, 300, 10, 200, 72, 'Truk prima?|Cuaca baik?')
    b = kotak(o, 60, 150, 170, 50, 'JERUK', 'n-kotak n-baik')
    c = belah(o, 300, 150, 200, 72, 'Punya|cadangan kas?')
    d = kotak(o, 600, 150, 190, 50, 'ANGKUTAN UMUM')
    e = kotak(o, 600, 300, 190, 50, 'SURAT POS', 'n-kotak n-aman')
    b2 = kotak(o, 45, 260, 200, 42, '6,5 c/pon, bisa nihil', 'n-catatan')
    d2 = kotak(o, 600, 225, 190, 40, '5,0 c/pon, tenggat 95 jam', 'n-catatan')
    e2 = kotak(o, 600, 375, 190, 40, '4,75 c/pon, tanpa risiko', 'n-catatan')
    kiri(o, a, b, 'ya')
    turun(o, a, c, 'tidak')
    kanan(o, c, d, 'ya')
    _jalur(o, [(400, 222), (400, 325), (600, 325)], 'tidak')
    turun(o, b, b2); turun(o, d, d2); turun(o, e, e2)
    return bagan(840, 440, o)

def diagram_3():
    o = []
    a = kotak(o, 300, 10, 220, 44, 'Berapa cepat jam ini?')
    b = belah(o, 300, 84, 220, 72, 'Terlambat dari|tenggat?')
    c = kotak(o, 40, 240, 200, 54, '55 MPH|biaya minimum', 'n-kotak n-baik')
    d = belah(o, 590, 230, 220, 76, 'Muatan punya|denda telat?')
    e = belah(o, 570, 370, 260, 76, 'Denda 10 % lebih besar|dari tambahan biaya?')
    f = kotak(o, 600, 500, 200, 54, 'Naikkan ke 65|masih aman tilang', 'n-kotak n-hati')
    g = belah(o, 300, 610, 220, 76, 'Sudah 3 kali|ditilang?')
    h = kotak(o, 40, 622, 220, 54, 'JANGAN.|Keempat = usaha tamat', 'n-kotak n-buruk')
    i = kotak(o, 600, 626, 200, 46, 'Boleh, per jam', 'n-kotak n-baik')
    turun(o, a, b)
    # b masuk ke c dari ATAS, d masuk dari SISI KANAN. Kalau keduanya masuk
    # lewat sisi kanan, ruas mendatarnya berbagi jalur dan tergambar
    # bertumpuk.
    kiriAtas(o, b, c, 'tidak')
    # b masuk ke d dari ATAS. Kalau ia masuk lewat sisi kiri, ruas
    # mendatarnya berimpit dengan panah 'surat pos' yang KELUAR dari sisi
    # kiri d pada ketinggian yang sama.
    kananAtas(o, b, d, 'ya')
    kiri(o, d, c, 'surat pos')
    turun(o, d, e)
    turun(o, e, f, 'ya')
    _jalur(o, [(570, 408), (140, 408), (140, 294)], 'tidak')
    _jalur(o, [(700, 554), (700, 582), (410, 582), (410, 610)])
    kiri(o, g, h, 'ya')
    kanan(o, g, i, 'tidak')
    return bagan(850, 710, o)

def diagram_4():
    o = []
    a = belah(o, 330, 10, 200, 72, 'Musim dan|cuaca?')
    b = kotak(o, 40, 150, 240, 60, 'SELATAN 3.120 mil|+$118, badai terendah', 'n-kotak n-aman')
    c = belah(o, 590, 150, 200, 76, 'Muatan?')
    d = kotak(o, 400, 320, 220, 58, 'UTARA 2.710 mil|terpendek, tercepat', 'n-kotak n-hati')
    e = kotak(o, 680, 320, 210, 58, 'TENGAH 2.850 mil|seimbang')
    b2 = kotak(o, 40, 250, 240, 44, 'Jangan ngebut: denda tertinggi', 'n-catatan')
    kiri(o, a, b, 'musim dingin')
    kanan(o, a, c, 'cuaca baik')
    turun(o, b, b2)
    # Dua cabang keluar dari SISI BERBEDA -- bawah dan kanan. Kalau keduanya
    # keluar dari sisi bawah, batang pertamanya tergambar dua kali.
    _jalur(o, [(690, 226), (690, 275), (510, 275), (510, 320)], 'jeruk / ketat')
    _jalur(o, [(790, 188), (850, 188), (850, 290), (785, 290), (785, 320)],
           'surat pos')
    return bagan(920, 400, o)

DIAGRAM = [diagram_1, diagram_2, diagram_3, diagram_4]

# ==========================================================================
#  Empat grafik
# ==========================================================================
def grafik_efisiensi():
    sp = list(range(35, 81, 5))
    return grafik(
        'Efisiensi bahan bakar terhadap kecepatan',
        'Puncaknya tepat di 55 MPH. Terlalu pelan sama borosnya dengan terlalu cepat.',
        [('mil per galon', 'g-a', [(s, mpg(s)) for s in sp])],
        (35, 80), (0, 5), 'kecepatan (MPH)', 'mpg', '%.1f')

def grafik_biaya():
    sp = list(range(40, 81, 5))
    return grafik(
        'Biaya per mil terhadap kecepatan',
        'Minimum di 55 MPH. Pada 70 MPH biayanya dua kali lipat, hemat waktu hanya 21 %.',
        [('bahan bakar', 'g-a', [(s, biaya_bbm_per_mil(s)) for s in sp]),
         ('waktu ($85/hari)', 'g-b', [(s, biaya_waktu_per_mil(s)) for s in sp]),
         ('denda harapan', 'g-c', [(s, denda_harapan_per_mil(s)) for s in sp]),
         ('TOTAL', 'g-d', [(s, biaya_total_per_mil(s)) for s in sp])],
        (40, 80), (0, 0.8), 'kecepatan (MPH)', '$ / mil', '%.2f')

def grafik_tilang():
    sp = list(range(55, 96, 5))
    return grafik(
        'Peluang ditilang per jam',
        'Nol sampai 10 MPH di atas batas, lalu naik kuadratik sampai kepastian di 90.',
        [('peluang / jam', 'g-c', [(s, peluang_tilang(s) * 100) for s in sp])],
        (55, 95), (0, 100), 'kecepatan (MPH), batas 55', '%', '%.0f')

def grafik_rute():
    """Jarak vs risiko cuaca -- dua sumbu yang berlawanan arah."""
    o = ['<svg class="g-svg" viewBox="0 0 760 344" role="img">']  # 344, bukan 300: label "risiko badai" di y=302 terpotong
    o.append('<text class="g-judul" x="62" y="20">%s</text>'
             % T('Rute: jarak melawan risiko cuaca'))
    o.append('<text class="g-sub" x="62" y="36">%s</text>'
             % T('Yang terpendek justru paling sering kena badai salju. '
                 'Itu yang membuat pilihannya nyata.'))
    data = [('UTARA', 2710, 3, 'g-c'), ('TENGAH', 2850, 2, 'g-b'), ('SELATAN', 3120, 1, 'g-a')]
    L, A, pw, ph = 90, 60, 600, 170
    for i in range(4):
        y = A + ph - i * ph / 3.0
        o.append('<line class="g-kisi" x1="%d" y1="%.1f" x2="%d" y2="%.1f"/>' % (L, y, L + pw, y))
    for i, (nama, mil, risiko, kls) in enumerate(data):
        x = L + 90 + i * 180
        h = (mil - 2600) / 600.0 * ph
        o.append('<rect class="g-batang %s" x="%d" y="%.1f" width="52" height="%.1f" rx="4"/>'
                 % (kls, x, A + ph - h, h))
        # Pemisah ribuan ikut bahasa: 2.710 di Indonesia, 2,710 di Inggris.
        # Kalau ini dilewatkan, angkanya terbaca sebagai 2,71 oleh pembaca
        # Inggris -- salah seribu kali lipat, dan tidak terlihat sebagai galat.
        angka = '{:,}'.format(mil)
        if BAHASA != 'en':
            angka = angka.replace(',', '.')
        o.append('<text class="g-legenda g-tengah" x="%d" y="%.1f">%s %s</text>'
                 % (x + 26, A + ph - h - 8, angka, T('mil')))
        o.append('<text class="g-sumbu g-tengah" x="%d" y="%d">%s</text>'
                 % (x + 26, A + ph + 20, T(nama)))
        for r in range(risiko):
            o.append('<circle class="g-risiko" cx="%d" cy="%d" r="7"/>' % (x + 12 + r * 18, A + ph + 52))
        o.append('<text class="g-sumbu g-tengah" x="%d" y="%d">%s</text>'
                 % (x + 26, A + ph + 80, T('risiko badai')))
    o.append('<text class="g-sumbu" x="4" y="52">%s</text>' % T('mil'))
    o.append('</svg>')
    return '\n'.join(o)

GRAFIK = {'efisiensi': grafik_efisiensi, 'biaya': grafik_biaya,
          'tilang': grafik_tilang, 'rute': grafik_rute}

# ==========================================================================
KERANGKA = """<!doctype html>
<html lang="%(lang)s">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(judul)s</title>
<meta name="description" content="%(ringkas)s">
<link rel="stylesheet" href="../_shared/tokens.css">
<link rel="stylesheet" href="../_shared/base.css">
<link rel="stylesheet" href="trucker-bisnis.css">
</head>
<body>
<div id="topbar-host"></div>
<main class="wrap k-wrap">
  <article class="k-isi">
%(isi)s
  </article>
  <p class="k-kaki">%(kaki)s</p>
  <p class="k-kaki"><a href="../games/trucker/index.html">&larr; %(balik)s</a>
     &middot; <a href="%(arsitektur)s">%(arsitektur_teks)s</a>
     &middot; <a href="%(lain)s">%(lain_teks)s</a></p>
</main>
<script src="../_shared/ui.js"></script>
<script>
  var tb = window.RETRO.ui.topbar({
    title: 'Delgado Freight Lines', source: '%(topbar)s', lang: '%(lang)s'
  });
  document.getElementById('topbar-host').append(tb);
  /* Topbar bersama menganggap dirinya dipasang dari web/games/<id>/, jadi
     tautan pulangnya '../../index.html'. Halaman ini ada di web/docs/, satu
     tingkat lebih dangkal -- tanpa koreksi ini tautannya 404. */
  var pulang = document.querySelector('#topbar-host a[href$="index.html"]');
  if (pulang) pulang.setAttribute('href', '../index.html');
</script>
</body>
</html>
"""

HALAMAN = {
    'id': {
        'lang': 'id',
        'judul': 'Delgado Freight Lines — dokumen analisis bisnis',
        'ringkas': 'Dokumen analisis bisnis untuk usaha angkutan truk Los '
                   'Angeles-New York 1982: logika kecepatan optimal, pemilihan '
                   'rute, menghindari denda, dan tips lapangan. Diturunkan dari '
                   'operasi TRUCKER.',
        'topbar': 'Dokumen analisis bisnis · TRUCKER',
        'balik': 'Kembali ke TRUCKER',
        'arsitektur': 'trucker.md',
        'arsitektur_teks': 'Dokumen arsitektur',
        'lain': 'trucker-business.html',
        'lain_teks': 'English version',
        'kaki': 'Halaman ini dihasilkan dari <code>trucker-bisnis.md</code>. '
                'Kurva dan grafiknya <b>dihitung dari rumus yang sama</b> dengan '
                'yang tertulis di dokumennya, bukan digambar terpisah &mdash; jadi '
                'tabel dan grafik tidak mungkin berbeda. Ubah dokumennya, lalu '
                'jalankan <code>scripts/trucker-bisnis-html.py</code>.',
    },
    'en': {
        'lang': 'en',
        'judul': 'Delgado Freight Lines — business analysis',
        'ringkas': 'A business analysis of a 1982 Los Angeles-New York trucking '
                   'operation: optimal speed logic, route selection, avoiding '
                   'fines, and field advice. Derived from the TRUCKER operation.',
        'topbar': 'Business analysis · TRUCKER',
        'balik': 'Back to TRUCKER',
        'arsitektur': 'trucker.md',
        'arsitektur_teks': 'Architecture notes',
        'lain': 'trucker-bisnis.html',
        'lain_teks': 'Versi Indonesia',
        'kaki': 'This page is generated from <code>trucker-business.md</code>. '
                'Its curves and charts are <b>computed from the same formulas</b> '
                'written in the document itself, not drawn separately &mdash; so '
                'the tables and the charts cannot disagree. Edit the document, '
                'then run <code>scripts/trucker-bisnis-html.py --en</code>.',
    },
}

if __name__ == '__main__':
    import sys as _sys
    if '--en' in _sys.argv:
        BAHASA = 'en'
        SUMBER = os.path.join(AKAR, 'web', 'docs', 'trucker-business.md')
        TUJUAN = os.path.join(AKAR, 'web', 'docs', 'trucker-business.html')
    src = io.open(SUMBER, encoding='utf-8').read()
    blok = keHtml(src)
    # ganti blok mermaid dengan SVG, urut
    n = 0
    for i, b in enumerate(blok):
        if b.startswith('<pre class="k-kode">flowchart'):
            blok[i] = '<figure class="n-gbr">%s</figure>' % DIAGRAM[n]()
            n += 1
    # Blok xychart-beta jadi jangkar grafik, URUT. Di .md ia ditulis sebagai
    # Mermaid supaya GitHub merendernya sendiri; di sini ia diganti SVG yang
    # dihitung dari rumus, bukan dari angka yang diketik ulang.
    urut = ['efisiensi', 'tilang', 'biaya', 'rute']
    m = 0
    for i, b in enumerate(blok):
        if b.startswith('<pre class="k-kode">xychart-beta'):
            blok[i] = '<figure class="g-gbr">%s</figure>' % GRAFIK[urut[m]]()
            m += 1
    ctx = dict(HALAMAN[BAHASA])
    ctx['isi'] = '\n'.join('    ' + x for x in blok)
    doc = KERANGKA % ctx
    io.open(TUJUAN, 'w', encoding='utf-8').write(doc)
    print('%s [%s]: %d bita, %d blok, %d diagram, %d grafik'
          % (os.path.relpath(TUJUAN, AKAR), BAHASA, len(doc), len(blok), n, m))
