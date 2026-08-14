/* ===========================================================================
   BUSSEVEN.js — porting minimalis BUSSEVEN.BAS sebagai tabel baris.

   Langkah IX: JURNAL PENYESUAIAN. Satu ayat jurnal, dan naskahnya menyebutkan
   alasannya dengan jujur:

       "This was due to a mistake in payroll which went undetected until
        after the cutoff date for closing the books."

   Sebuah kesalahan penggajian yang baru ketahuan setelah buku ditutup. Itulah
   satu-satunya alasan seluruh langkah ini ada — dan angkanya, 1.750, adalah
   angka yang sudah muncul di kolom ADJUSTMENTS kertas kerja BUSFIVE.

   Bentuk berkasnya sama seperti BUSTHREE.BAS, termasuk cacatnya: baris 930
   mencetak `JP`, yang TIDAK PERNAH DIISI di mana pun. Dua berkas, satu
   kesalahan yang sama — tanda bahwa yang satu disalin dari yang lain.

   Naskahnya kali ini satu GOSUB per baris (80-170), bukan satu baris raksasa
   seperti BUSTHREE. Tiga gaya penulisan naskah di satu keluarga program.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol.
   - Gelung perakit garis ditulis sebagai satu langkah.
   - Aksara kotak ditulis sebagai glif di berkas port, lalu dibalikkan ke
     bita CP437 sebelum dipakai.
   - Berakhir dengan `RUN"BUSEIGHT"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KANAN_BAWAH = 217, KIRI_BAWAH = 192;

  var PETA = { '║': 186, '═': 205, '╔': 201, '╗': 187, '╚': 200, '╝': 188,
               '╠': 204, '╣': 185, '╦': 203, '╩': 202, '╬': 206,
               '─': 196, '│': 179 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  function u(glif, n) {
    var k = '', i;
    for (i = 0; i < n; i++) k += keBita(glif);
    return k;
  }

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 1020);
      } },
    /* 20 `DEFSTR A-E,J,L` disalin dari BUSFIVE.BAS — tapi di sini A sampai E
       tidak pernah dipakai sebagai string sama sekali. Yang tersisa cuma
       akibatnya: `A` di gelung ini adalah pencacah, dan ia bertipe string. */
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 70);
        }
      } },
    { baris: 30, jalan: function (m) { m.lompat(80); } },

    { baris: 40, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 50, jalan: function (m) { if (m.inkey() !== '') m.lompat(40); } },
    { baris: 60, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(60);
      } },
    { baris: 70, jalan: function (m) { m.kembali(); } },

    /* 80-170 naskahnya: SATU GOSUB per baris. Gaya ketiga di keluarga ini —
       BUSTHREE menulis dua puluh dalam satu baris, BUSSIX satu baris per
       layar, dan di sini satu baris per pemanggilan. */
    { baris: 80, jalan: function (m) { m.gosub(670); } },
    { baris: 90, jalan: function (m) { m.gosub(760); } },
    { baris: 100, jalan: function (m) { m.gosub(190); } },
    { baris: 110, jalan: function (m) { m.gosub(40); } },
    { baris: 120, jalan: function (m) { m.gosub(670); } },
    { baris: 130, jalan: function (m) { m.gosub(890); } },
    { baris: 140, jalan: function (m) { m.gosub(40); } },
    { baris: 150, jalan: function (m) { m.gosub(670); } },
    { baris: 160, jalan: function (m) { m.gosub(960); } },
    { baris: 170, jalan: function (m) { m.gosub(40); } },
    { baris: 180, jalan: function (m) { m.jalankan('BUSEIGHT'); } },

    /* --- 190-660: merakit jurnal dan buku besar --------------------------- */
    { baris: 190, jalan: function (m) { m.v.JA = u('╔', 1) + u('═', 10); } },
    { baris: 200, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 4); } },
    { baris: 210, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 22); } },
    { baris: 220, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 9); } },
    { baris: 230, jalan: function (m) {
        m.v.JA += u('╦', 1) + u('═', 9) + u('╗', 1);
      } },
    teks(240, 'JB', '║   DATE   ║ACCT║     ACCOUNT NAME     ║  DEBIT  ║ CREDIT  ║'),
    { baris: 250, jalan: function (m) { m.v.JC = u('╠', 1) + u('═', 10); } },
    { baris: 260, jalan: function (m) { m.v.JC += u('╬', 1) + u('═', 4); } },
    { baris: 270, jalan: function (m) { m.v.JC += u('╬', 1) + u('═', 22); } },
    { baris: 280, jalan: function (m) { m.v.JC += u('╬', 1) + u('═', 9); } },
    { baris: 290, jalan: function (m) {
        m.v.JC += u('╬', 1) + u('═', 9) + u('╣', 1);
      } },
    /* 300-310 ayat penyesuaiannya: beban gaji 1.750 debit, kas 1.750 kredit.
       Angka yang sama muncul di kolom ADJUSTMENTS kertas kerja BUSFIVE. */
    teks(300, 'JD', '║ 06/30/82 ║ 51 ║ SALARY EXPENSE       ║ 1750.00 ║         ║'),
    teks(310, 'JE', '║          ║ 11 ║   CASH               ║         ║ 1750.00 ║'),
    /* 320 perhatikan: JF DILEWATI. Urutannya JD, JE, lalu JG. */
    teks(320, 'JG', '║          ║    ║     PAID EMPLOYEES   ║         ║         ║'),
    teks(330, 'JH', '║          ║    ║                      ║         ║         ║'),
    teks(340, 'JI', '║          ║    ║                      ║         ║         ║'),
    teks(350, 'JJ', '║          ║    ║                      ║         ║         ║'),
    { baris: 360, jalan: function (m) { m.v.JK = u('╚', 1) + u('═', 10); } },
    { baris: 370, jalan: function (m) { m.v.JK += u('╩', 1) + u('═', 4); } },
    { baris: 380, jalan: function (m) { m.v.JK += u('╩', 1) + u('═', 22); } },
    { baris: 390, jalan: function (m) { m.v.JK += u('╩', 1) + u('═', 9); } },
    { baris: 400, jalan: function (m) {
        m.v.JK += u('╩', 1) + u('═', 9) + u('╝', 1);
      } },
    /* 410 tanda kutip penutupnya tidak ada — GW-BASIC menerimanya. */
    { baris: 410, jalan: function (m) {
        m.v.JM = 'Explanation :';
        m.v.JMA = ' 1) The debit to salary expense will increase it.';
      } },
    teks(420, 'LN', ' 2) The credit to cash will decrease it.'),
    { baris: 430, jalan: function (m) { m.v.LA = u('╔', 1) + u('═', 10); } },
    { baris: 440, jalan: function (m) { m.v.LA += u('╦', 1) + u('═', 22); } },
    { baris: 450, jalan: function (m) { m.v.LA += u('╦', 1) + u('═', 9); } },
    { baris: 460, jalan: function (m) { m.v.LA += u('╦', 1) + u('═', 9); } },
    { baris: 470, jalan: function (m) { m.v.LA += u('╦', 1) + u('═', 9); } },
    { baris: 480, jalan: function (m) {
        m.v.LA += u('╦', 1) + u('═', 9) + u('╗', 1);
      } },
    teks(490, 'LB', '║   DATE   ║         ITEM         ║  DEBIT  ║ CREDIT  ║ BAL DBT ║ BAL CRD ║'),
    { baris: 500, jalan: function (m) { m.v.LC = u('╠', 1) + u('═', 10); } },
    { baris: 510, jalan: function (m) { m.v.LC += u('╬', 1) + u('═', 22); } },
    { baris: 520, jalan: function (m) { m.v.LC += u('╬', 1) + u('═', 9); } },
    { baris: 530, jalan: function (m) { m.v.LC += u('╬', 1) + u('═', 9); } },
    { baris: 540, jalan: function (m) { m.v.LC += u('╬', 1) + u('═', 9); } },
    { baris: 550, jalan: function (m) {
        m.v.LC += u('╬', 1) + u('═', 9) + u('╣', 1);
      } },
    /* 560-590 dua buku besar: beban gaji 1.750 -> 3.500 (angka laba-rugi di
       BUSSIX), dan kas 14.240 -> 12.490 (angka neraca di BUSSIX dan
       BUSNINE). */
    teks(560, 'LD', '║ 06/30/82 ║ BALANCE              ║         ║         ║ 1750.00 ║         ║'),
    teks(570, 'LE', '║ 06/30/82 ║ PAYROLL ADJUSTMENT   ║ 1750.00 ║         ║ 3500.00 ║         ║'),
    teks(580, 'LF', '║ 06/30/82 ║ BALANCE              ║         ║         ║14240.00 ║         ║'),
    teks(590, 'LG', '║ 06/30/82 ║ PAYROLL ADJUSTMENT   ║         ║ 1750.00 ║12490.00 ║         ║'),
    { baris: 600, jalan: function (m) { m.v.LK = u('╚', 1) + u('═', 10); } },
    { baris: 610, jalan: function (m) { m.v.LK += u('╩', 1) + u('═', 22); } },
    { baris: 620, jalan: function (m) { m.v.LK += u('╩', 1) + u('═', 9); } },
    { baris: 630, jalan: function (m) { m.v.LK += u('╩', 1) + u('═', 9); } },
    { baris: 640, jalan: function (m) { m.v.LK += u('╩', 1) + u('═', 9); } },
    { baris: 650, jalan: function (m) {
        m.v.LK += u('╩', 1) + u('═', 9) + u('╝', 1);
      } },
    { baris: 660, jalan: function (m) { m.kembali(); } },

    /* --- 670-750: kepala halaman ------------------------------------------ */
    { baris: 670, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
        m.warna(11, 0);
      } },
    { baris: 680, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.H = 20; m.v.H <= 62; m.v.H++) {
            m.locate(m.v.I, m.v.H, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 690, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 700, jalan: function (m) {
        m.locate(2, 19, 0); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 710, jalan: function (m) { m.warna(0, 7); } },
    { baris: 720, jalan: function (m) {
        m.locate(2, 22);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
      } },
    { baris: 730, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 27);
        m.cetak('STEP IX. ADJUSTING ENTRIES'); m.barisBaru();
      } },
    { baris: 740, jalan: function (m) {
        m.tab(27); m.cetak('--------------------------'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 750, jalan: function (m) { m.kembali(); } },

    /* --- 760-880: kenapa ada penyesuaian ---------------------------------- */
    { baris: 760, jalan: function (m) {
        m.locate(7, 19);
        m.cetak('At the end of the accounting period the adjusting');
        m.barisBaru();
      } },
    naskah(770, 14, 'entries appearing in the worksheet are recorded in the'),
    naskah(780, 14, 'journal and posted to the ledger,  bringing the ledger'),
    naskah(790, 14, 'into agreement with the data reported on the financial'),
    naskah(800, 14, 'statements.  The adjusting entries are dated as of the'),
    naskah(810, 14, 'last day of the accounting cycle, even though they are'),
    naskah(820, 14, 'usually recorded at a later date.'),
    naskah(830, 19, 'In this simulation our adjusting entry dealt with'),
    naskah(840, 14, 'the salary expense and cash accounts.  This was due to'),
    /* 850-860 alasannya: KESALAHAN PENGGAJIAN yang baru ketahuan sesudah
       tanggal tutup buku. Satu-satunya "kejadian" di seluruh dua belas
       berkas yang bukan transaksi biasa. */
    naskah(850, 14, 'a mistake in payroll which went undetected until after'),
    naskah(860, 14, 'the cutoff date for closing the books.'),
    { baris: 870, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Journal *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 880, jalan: function (m) { m.kembali(); } },

    /* --- 890-950: jurnalnya ----------------------------------------------- */
    { baris: 890, jalan: function (m) {
        m.locate(7, 11); m.cetak(m.v.JA); m.barisBaru();
        t11(m, m.v.JB); t11(m, m.v.JC);
      } },
    { baris: 900, jalan: function (m) { t11(m, m.v.JD); t11(m, m.v.JE); } },
    { baris: 910, jalan: function (m) {
        t11(m, m.v.JG); t11(m, m.v.JH); t11(m, m.v.JI);
      } },
    { baris: 920, jalan: function (m) {
        t11(m, m.v.JJ); t11(m, m.v.JK); m.barisBaru();
        m.warna(11, 0); m.tab(10); m.cetak(m.v.JM);
        m.warna(7, 0); m.cetak(m.v.JMA); m.barisBaru();
      } },
    /* 930 `JP` TIDAK PERNAH DIISI — cacat yang sama persis dengan BUSTHREE
       baris 1210. Dua berkas, satu kesalahan: yang satu disalin dari yang
       lain. */
    { baris: 930, jalan: function (m) {
        m.tab(23); m.cetak(m.v.LN); m.barisBaru();
        m.tab(3); m.cetak(m.v.JP || ''); m.barisBaru();
      } },
    { baris: 940, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Ledger *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 950, jalan: function (m) { m.kembali(); } },

    /* --- 960-1010: dua buku besar ----------------------------------------- */
    { baris: 960, jalan: function (m) {
        m.locate(7, 5); m.cetak(m.v.LA); m.barisBaru();
        t5(m, m.v.LB); t5(m, m.v.LC);
      } },
    { baris: 970, jalan: function (m) {
        m.warna(11, 0); m.cetak('Sal.');
        m.warna(7, 0); m.cetak(m.v.LD); m.barisBaru();
        t5(m, m.v.LE); t5(m, m.v.LK);
      } },
    { baris: 980, jalan: function (m) {
        m.locate(15, 5); m.cetak(m.v.LA); m.barisBaru();
        t5(m, m.v.LB); t5(m, m.v.LC);
      } },
    { baris: 990, jalan: function (m) {
        m.warna(11, 0); m.cetak('Cash');
        m.warna(7, 0); m.cetak(m.v.LF); m.barisBaru();
        t5(m, m.v.LG); t5(m, m.v.LK);
      } },
    { baris: 1000, jalan: function (m) {
        m.warna(11, 0); m.locate(25, 17);
        m.cetak('***** Strike Any Key For Closing Entries *****       ');
        m.warna(7, 0);
      } },
    { baris: 1010, jalan: function (m) { m.kembali(); } },
    { baris: 1020, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function teks(nomor, nama, isi) {
    return { baris: nomor, jalan: function (m) { m.v[nama] = keBita(isi); } };
  }
  function naskah(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function t11(m, isi) { m.tab(11); m.cetak(isi); m.barisBaru(); }
  function t5(m, isi) { m.tab(5); m.cetak(isi); m.barisBaru(); }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSSEVEN'] = {
    nama: 'BUSSEVEN',
    judul: 'Business Simulation IX — jurnal penyesuaian',
    sumber: 'BUSSEVEN',
    berkas: 'run/BUSSEVEN.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSSEVEN.BAS',
      simpul: [
        { id: 'jebak', baris: '10-30', jenis: 'mulai',
          teks: ['F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'naskah', baris: '80-170',
          teks: ['Tiga layar,', 'satu GOSUB per baris'] },
        { id: 'rakit', baris: '190-660', jenis: 'subrutin',
          teks: ['Rakit jurnal JA..JK', 'dan buku besar LA..LK'] },
        { id: 'kepala', baris: '670-750', jenis: 'subrutin',
          teks: ['Kotak judul,', 'STEP IX'] },
        { id: 'sebab', baris: '760-880', jenis: 'subrutin',
          teks: ['Kenapa: kesalahan gaji', 'yang telat ketahuan'] },
        { id: 'jurnal', baris: '890-950', jenis: 'subrutin',
          teks: ['Ayat penyesuaian:', 'gaji 1.750 = kas 1.750'] },
        { id: 'besar', baris: '960-1010', jenis: 'subrutin',
          teks: ['Dua buku besar:', 'gaji 3.500, kas 12.490'] },
        { id: 'lanjut', baris: '180', jenis: 'keluar',
          teks: ['RUN "BUSEIGHT"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'naskah' },
        { dari: 'naskah', ke: 'kepala', label: 'GOSUB 670, tiga kali' },
        { dari: 'naskah', ke: 'sebab' },
        { dari: 'naskah', ke: 'rakit', label: 'GOSUB 190, sekali' },
        { dari: 'naskah', ke: 'jurnal' },
        { dari: 'naskah', ke: 'besar' },
        { dari: 'naskah', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 80, tingkat: 0, teks: 'tiga layar, <b>satu <code>GOSUB</code> per baris program</b>' },
      { baris: 760, tingkat: 0, teks: 'layar 1: kenapa ada penyesuaian &mdash; <b>kesalahan penggajian</b>' },
      { baris: 300, tingkat: 0, teks: 'ayat penyesuaian: beban gaji 1.750 debit = kas 1.750 kredit' },
      { baris: 570, tingkat: 1, teks: 'beban gaji 1.750 &rarr; <b>3.500</b> &mdash; angka laba-rugi di BUSSIX' },
      { baris: 590, tingkat: 1, teks: 'kas 14.240 &rarr; <b>12.490</b> &mdash; angka neraca di BUSSIX dan BUSNINE' },
      { baris: 930, tingkat: 1, teks: '&hellip;dan <code>JP</code> di sini <b>tidak pernah diisi</b> &mdash; sama seperti BUSTHREE' },
      { baris: 180, tingkat: 0, teks: '<code>RUN "BUSEIGHT"</code>' }
    ],

    perintahAsli: 'run\\BUSSEVEN.bat',
    catatanAsli: 'Langkah IX dari rangkaian BUSONE sampai BUSTEN.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50.',

      '<b>Gelung perakit garis ditulis sebagai satu langkah.</b> ' +
      'Hasil stringnya identik.',

      '<b>Aksara kotak ditulis sebagai glif di berkas port</b> supaya terbaca, ' +
      'lalu dibalikkan ke bita CP437 sebelum dipakai.',

      '<b>Berakhir dengan <code>RUN"BUSEIGHT"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Satu ayat jurnal penyesuaian, dan naskah yang mengakui ' +
        'alasannya: kesalahan penggajian yang baru ketahuan sesudah buku ' +
        'ditutup.',
      pelajari: [
        ['Kenapa jurnal penyesuaian ada',
         'Naskah di baris 760&ndash;860 menjelaskannya lebih baik daripada ' +
         'kebanyakan buku teks: catatan yang muncul di kolom ADJUSTMENTS ' +
         'kertas kerja harus <b>benar-benar dimasukkan</b> ke jurnal dan buku ' +
         'besar, supaya buku besarnya cocok dengan laporan yang sudah dicetak. ' +
         'Dan tanggalnya ditulis hari terakhir periode walaupun dicatat ' +
         'belakangan.'],
        ['Angka yang menyeberang empat berkas',
         '1.750 muncul di kolom ADJUSTMENTS kertas kerja BUSFIVE, jadi ayat ' +
         'jurnal di sini, membuat beban gaji jadi 3.500 yang dipakai laporan ' +
         'laba-rugi BUSSIX, dan menurunkan kas jadi 12.490 yang dipakai neraca ' +
         'BUSSIX dan BUSNINE. <b>Satu angka, empat berkas</b> &mdash; dan ' +
         'setiap kemunculannya diketik ulang.'],
        ['Gaya naskah ketiga di satu keluarga',
         'BUSTHREE menulis dua puluh <code>GOSUB</code> dalam satu baris; ' +
         'BUSSIX satu baris per layar; berkas ini <b>satu baris per ' +
         'pemanggilan</b>. Tiga gaya, satu keluarga, tugas yang persis sama. ' +
         'Tanda bahwa berkas-berkas ini disalin dan disunting satu dari yang ' +
         'lain, bukan ditulis dari satu cetakan.']
      ],
      hindari: [
        ['Cacat yang ikut tersalin',
         'Baris 930 mencetak <code>JP</code>, yang tidak pernah diisi di ' +
         'seluruh berkas. Cacat yang <b>sama persis</b> ada di BUSTHREE.BAS ' +
         'baris 1210. Menyalin berkas berarti menyalin kesalahannya, dan ' +
         'sekarang ada dua tempat yang harus diperbaiki.'],
        ['Nama variabel yang melompat',
         'Urutan pendefinisiannya JD, JE, lalu <b>JG</b> &mdash; ' +
         '<code>JF</code> tidak pernah ada. Sisa dari BUSTHREE.BAS, yang ' +
         'punya tiga baris ayat jurnal sementara di sini cuma dua.'],
        ['DEFSTR yang ikut tersalin tanpa dipakai',
         'Baris 20 menulis <code>DEFSTR A-E,J,L</code>, disalin dari ' +
         'BUSFIVE.BAS. Tapi <code>A</code> sampai <code>E</code> tidak pernah ' +
         'dipakai sebagai string di sini &mdash; yang tersisa cuma akibatnya: ' +
         'pencacah gelung <code>A</code> di baris yang sama bertipe string.'],
        ['Tanda kutip yang tidak ditutup',
         'Baris 410, sama seperti tiga tempat di BUSSIX.BAS dan baris ' +
         'terakhir BUSTEN.BAS.']
      ]
    },

    penjelasan: [
      { judul: 'Satu angka yang menyeberang empat berkas',
        isi: [
          'Ayat jurnal di berkas ini cuma dua baris: beban gaji 1.750 di ' +
          'debit, kas 1.750 di kredit. Tapi angka itu punya sejarah yang ' +
          'membentang sepanjang rangkaiannya.',
          'Ia <b>muncul pertama</b> di kertas kerja BUSFIVE, di kolom ' +
          'ADJUSTMENTS &mdash; sebagai penyesuaian yang belum dicatat di mana ' +
          'pun.',
          'Di sini ia <b>dicatat</b>: masuk jurnal, lalu ke dua buku besar. ' +
          'Beban gaji naik dari 1.750 jadi 3.500. Kas turun dari 14.240 jadi ' +
          '12.490.',
          'Angka 3.500 itu <b>dipakai</b> laporan laba-rugi BUSSIX, dan 12.490 ' +
          'dipakai neraca BUSSIX serta neraca penutup BUSNINE.',
          'Empat berkas, satu angka, dan setiap kemunculannya diketik ulang ' +
          'sebagai teks di dalam <code>PRINT</code>. Tidak ada satu pun ' +
          'variabel yang menyimpannya, dan tidak ada satu pun bagian program ' +
          'yang tahu bahwa keempatnya berhubungan.',
          'Yang membuat ini layak diperhatikan bukan kerapuhannya &mdash; ' +
          'berkas-berkas ini presentasi, dan tidak dimaksudkan untuk diubah. ' +
          'Yang layak diperhatikan adalah bahwa <b>seseorang melacak angka ini ' +
          'melalui empat berkas dengan benar</b>, tanpa satu pun alat bantu, ' +
          'pada 1982.'
        ] },
      { judul: 'Kesalahan penggajian yang dijadikan bahan ajar',
        isi: [
          'Baris 840&ndash;860:',
          '<i>"This was due to a mistake in payroll which went undetected ' +
          'until after the cutoff date for closing the books."</i>',
          'Ini satu-satunya "kejadian" di seluruh dua belas berkas yang bukan ' +
          'transaksi biasa. Pembelian di BUSTHREE adalah kegiatan usaha ' +
          'normal; ini kesalahan.',
          'Dan itu <b>sengaja dipilih</b>. Jurnal penyesuaian ada justru untuk ' +
          'hal-hal yang tidak tercatat pada waktunya &mdash; beban yang ' +
          'terlewat, pendapatan yang belum diakui, kesalahan yang baru ' +
          'ketahuan. Menjelaskannya dengan contoh transaksi normal akan ' +
          'kehilangan seluruh maksudnya.',
          'Ada pelajaran kecil di situ tentang cara mengajar: <b>contoh yang ' +
          'baik untuk sebuah mekanisme adalah keadaan yang membuat mekanisme ' +
          'itu diperlukan</b>, bukan keadaan yang paling rapi.'
        ] }
    ]
  };
})(window);
