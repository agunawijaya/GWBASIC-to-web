
  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['TEMPLE'] = {
    nama: 'TEMPLE',
    judul: 'The Temple of Loth (John Belew, 25 Juli 1984)',
    sumber: 'TEMPLE',
    berkas: 'run/TEMPLE.BAS',
    tabel: tabel,
    benih: 84,

    /* Seluruh DATA berkas ini, baris 10330-10440, dalam urutannya. Dibaca
       tiga kali oleh tiga gelung berbeda: 34 pasang nama-dan-lambang ruang,
       8 pasang senjata/zirah dan cara memasak, lalu 4 nama bangsa. */
    data: [
