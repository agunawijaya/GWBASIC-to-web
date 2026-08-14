# -*- coding: utf-8 -*-
"""Membangun ulang tracer/program/XWING.js dan TEMPLE.js dari sumber .BAS-nya.

    python bangun.py            periksa saja — bandingkan dengan yang ada
    python bangun.py --tulis    tulis hasilnya ke tracer/program/

Kalau hasilnya berbeda dari berkas yang sekarang ada, salah satunya salah.
Itulah gunanya perintah tanpa `--tulis`."""
import pathlib, subprocess, sys

ALAT = pathlib.Path(__file__).resolve().parent
AKAR = ALAT.parents[2]
PROG = AKAR / 'tracer' / 'program'

RESEP = {
    'XWING.js': (['genxwing2.py', 'rakitxwing.py'],
                 ['xwing_kepala.js', 'xwing_tabel.js', 'xwing_ekor.js']),
    'TEMPLE.js': (['gentemple.py', 'rakittemple.py'],
                  ['temple_kepala.js', 'temple_tabel.js', 'temple_ekor_a.js',
                   'temple_data.js', 'temple_ekor_b.js']),
}

def data_temple():
    """temple_data.js dibangun dari temple_data.json: 88 nilai DATA, empat
       per baris, supaya berkas jadinya masih bisa dibaca orang."""
    import json
    nilai = json.loads((ALAT / 'temple_data.json').read_text(encoding='utf-8'))
    baris = []
    for i in range(0, len(nilai), 4):
        baris.append('      ' + ', '.join(
            json.dumps(x, ensure_ascii=False) for x in nilai[i:i+4]) + ',')
    (ALAT / 'temple_data.js').write_text(
        '\n'.join(baris).rstrip(','), encoding='utf-8', newline='\n')

def bangun(nama):
    langkah, potongan = RESEP[nama]
    if nama == 'TEMPLE.js':
        data_temple()
    for s in langkah:
        hasil = subprocess.run([sys.executable, str(ALAT / s)],
                               cwd=str(ALAT), capture_output=True, text=True)
        if hasil.returncode:
            print(hasil.stdout, hasil.stderr); raise SystemExit('gagal di ' + s)
        print('   ' + s + ': ' + hasil.stdout.strip().replace('\n', ' | '))
    return ''.join((ALAT / p).read_text(encoding='utf-8') for p in potongan)

if __name__ == '__main__':
    tulis = '--tulis' in sys.argv
    beda = 0
    for nama in RESEP:
        print(nama + ':')
        baru = bangun(nama)
        lama = (PROG / nama).read_text(encoding='utf-8') if (PROG / nama).exists() else None
        if lama == baru:
            print('   SAMA dengan yang ada (%d bita)' % len(baru))
        else:
            beda += 1
            print('   BERBEDA: yang ada %s bita, yang baru %d bita'
                  % (len(lama) if lama is not None else 'tidak ada', len(baru)))
            if tulis:
                (PROG / nama).write_text(baru, encoding='utf-8', newline='\n')
                print('   ditulis')
    raise SystemExit(1 if (beda and not tulis) else 0)
