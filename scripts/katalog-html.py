# -*- coding: utf-8 -*-
"""Menghasilkan web/katalog.html dari KATALOG.md.

Kenapa digenerate, bukan dirender di peramban: seluruh proyek ini harus jalan
lewat file://, dan di sana `fetch()` diblokir. Pembaca Markdown yang memuat
berkasnya saat dijalankan tidak akan berfungsi tanpa server. Jadi penerjemahan
dilakukan sekali di sini dan hasilnya berkas statis.

Jalankan ulang setiap KATALOG.md berubah, dari akar repositori:

    python scripts/katalog-html.py

Penafsir Markdown-nya sengaja kecil: hanya yang dipakai KATALOG.md, yaitu
judul, paragraf, daftar, tabel, kutipan, blok kode, garis pemisah, dan penanda
sebaris (kode, tebal, miring, tautan). Ia tidak berpura-pura lengkap.
"""
import io, os, re, html

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUMBER = os.path.join(AKAR, 'KATALOG.md')
TUJUAN = os.path.join(AKAR, 'web', 'katalog.html')


AWALAN = '../'          # disetel ulang oleh generator yang memakainya


def sisip(t):
    """Penanda sebaris: kode, tebal, miring, tautan."""
    t = html.escape(t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    # Tidak memakai [^*]+ : pola itu menolak bintang di dalamnya, sehingga
    # tebal yang MEMBUNGKUS miring -- '**awas *ini* penting**' -- tidak pernah
    # cocok dan bintang luarnya tercetak apa adanya. Yang malas (.+?) berhenti
    # di '**' berikutnya, dan miring di dalamnya diurus baris sesudah ini.
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?!\w)', r'<em>\1</em>', t)

    def tautan(m):
        teks, url = m.group(1), m.group(2)
        # AWALAN tergantung DI MANA halaman hasilnya tinggal, bukan tetap.
        #
        # katalog.html tinggal di web/ dan menaut ke berkas di akar repo,
        # jadi ia perlu naik satu tingkat. Tapi dokumen analisis bisnis
        # tinggal di web/docs/ dan menaut ke tetangganya sendiri -- di sana
        # '../' justru membuat tautannya rusak. Awalan '../' yang ditulis
        # tetap sempat menghasilkan dua tautan mati; generator masing-masing
        # sekarang menyetel AWALAN sendiri.
        if not url.startswith(('http', '#', 'mailto:', '../')):
            url = AWALAN + url
        return '<a href="%s">%s</a>' % (url, teks)

    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', tautan, t)


def keHtml(src):
    keluar, baris, i = [], src.split('\n'), 0
    while i < len(baris):
        b = baris[i]

        if b.startswith('```'):
            blok = []
            i += 1
            while i < len(baris) and not baris[i].startswith('```'):
                blok.append(html.escape(baris[i])); i += 1
            keluar.append('<pre class="k-kode">' + '\n'.join(blok) + '</pre>')

        elif b.startswith('#'):
            n = min(len(b) - len(b.lstrip('#')), 6)
            keluar.append('<h%d>%s</h%d>' % (n, sisip(b.lstrip('#').strip()), n))

        elif (b.startswith('|') and i + 1 < len(baris)
              and re.match(r'^\|[\s:|-]+\|$', baris[i + 1])):
            kepala = [c.strip() for c in b.strip('|').split('|')]
            i += 2
            isi = []
            while i < len(baris) and baris[i].startswith('|'):
                isi.append([c.strip() for c in baris[i].strip('|').split('|')]); i += 1
            i -= 1
            keluar.append(
                '<table class="k-tabel"><thead><tr>'
                + ''.join('<th>%s</th>' % sisip(c) for c in kepala)
                + '</tr></thead><tbody>'
                + ''.join('<tr>' + ''.join('<td>%s</td>' % sisip(c) for c in r) + '</tr>'
                          for r in isi)
                + '</tbody></table>')

        elif b.startswith('> '):
            # Gabungkan barisnya DULU, baru tafsirkan penanda sebarisnya.
            #
            # Sebelumnya sisip() dipanggil per baris lalu hasilnya disambung.
            # Akibatnya penanda yang MELINTASI pergantian baris tidak pernah
            # cocok: '*"Kalimat panjang' di baris satu dan 'yang berlanjut."*'
            # di baris dua terbaca sebagai dua potongan tanpa pasangan, dan
            # bintangnya tercetak apa adanya. Paragraf biasa sudah benar sejak
            # awal karena ia menggabung dulu; kutipan dan daftar tidak.
            kutip = []
            while i < len(baris) and baris[i].startswith('>'):
                kutip.append(baris[i].lstrip('>').strip()); i += 1
            i -= 1
            keluar.append('<blockquote>' + sisip(' '.join(kutip)) + '</blockquote>')

        elif re.match(r'^[-*] ', b) or re.match(r'^\d+\. ', b):
            tag = 'ul' if re.match(r'^[-*] ', b) else 'ol'
            butir = []
            while i < len(baris) and (re.match(r'^[-*] ', baris[i])
                                      or re.match(r'^\d+\. ', baris[i])
                                      or baris[i].startswith('  ')):
                t = re.sub(r'^([-*]|\d+\.) ', '', baris[i].strip())
                # Alasan yang sama dengan kutipan di atas: butirnya dikumpulkan
                # MENTAH, dan sisip() baru dijalankan sekali sesudah seluruh
                # baris lanjutannya tergabung.
                if baris[i].startswith('  ') and butir:
                    butir[-1] += ' ' + t
                else:
                    butir.append(t)
                i += 1
            i -= 1
            keluar.append('<%s>%s</%s>'
                          % (tag, ''.join('<li>%s</li>' % sisip(x) for x in butir), tag))

        elif b.strip() in ('---', '***'):
            keluar.append('<hr>')

        elif b.strip() == '':
            pass

        else:
            par = []
            while (i < len(baris) and baris[i].strip()
                   and not baris[i].startswith(('#', '|', '>', '```', '- ', '* '))):
                par.append(baris[i].strip()); i += 1
            i -= 1
            keluar.append('<p>' + sisip(' '.join(par)) + '</p>')

        i += 1
    return keluar


KERANGKA = """<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Katalog arsip — Classic DOS BASIC Games</title>
<meta name="description" content="Katalog lengkap arsip 83 program BASIC 1978-2000: asal-usul, isi tiap disket, dan cara menjalankannya.">
<link rel="stylesheet" href="_shared/tokens.css">
<link rel="stylesheet" href="_shared/base.css">
<link rel="stylesheet" href="katalog.css">
</head>
<body>
<div id="topbar-host"></div>
<main class="wrap k-wrap">
  <article class="k-isi">
%s
  </article>
  <p class="k-kaki">Halaman ini dihasilkan dari <code>KATALOG.md</code>.
     Ubah berkas itu, lalu jalankan <code>scripts/katalog-html.py</code>.</p>
</main>
<script src="_shared/ui.js"></script>
<script>
  document.getElementById('topbar-host').append(window.RETRO.ui.topbar({
    title: 'Katalog arsip', source: 'KATALOG.md'
  }));
</script>
</body>
</html>
"""

if __name__ == '__main__':
    src = io.open(SUMBER, encoding='utf-8').read()
    blok = keHtml(src)
    doc = KERANGKA % '\n'.join('    ' + x for x in blok)
    io.open(TUJUAN, 'w', encoding='utf-8').write(doc)
    print('%s: %d bita, %d blok' % (os.path.relpath(TUJUAN, AKAR), len(doc), len(blok)))
