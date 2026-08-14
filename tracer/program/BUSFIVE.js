/* ===========================================================================
   BUSFIVE.js — porting minimalis BUSFIVE.BAS sebagai tabel baris.

   Langkah VII: KERTAS KERJA. Satu tabel selebar 80 kolom dengan delapan kolom
   uang — empat pasang debit/kredit — yang merangkum seluruh siklusnya.

   Dan di sinilah terlihat bahwa dua belas berkas ini, walaupun tidak pernah
   menghitung apa pun, ANGKANYA COCOK SATU SAMA LAIN DARI UJUNG KE UJUNG:

       Kas         : 14.240 (neraca saldo, BUSFOUR)
                     - 1.750 (penyesuaian gaji)
                     = 12.490  <- persis angka Kas di BUSNINE
       Laba bersih : 12.045 - 9.545 = 2.500
                     20.700 - 18.200 = 2.500  <- dua jalan, hasil sama
       Neraca      : 20.700 - 860 (prive) = 19.840  <- total di BUSNINE

   Seseorang mengerjakan seluruh pembukuan ini dengan benar, sekali, pada
   1982, lalu mengetiknya sebagai teks ke dalam dua belas berkas.

   Satu lagi yang layak dilihat: baris 30 membuat singkatan untuk lima aksara
   kotak —

       30 A="║":B="═":C="│":D="╦":E="╔"

   — lalu memakainya TIGA KALI dan berhenti. `C` dan `D` tidak pernah dipakai
   sama sekali; sisanya kembali ditulis harfiah.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol.
   - Gelung perakit garis ditulis sebagai satu langkah.
   - Aksara kotak ditulis sebagai glif di berkas port, lalu dibalikkan ke
     bita CP437 sebelum dipakai.
   - Berakhir dengan `RUN"BUSSIX"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KANAN_BAWAH = 217, KIRI_BAWAH = 192;

  var PETA = { '║': 186, '═': 205, '╔': 201, '╗': 187, '╚': 200, '╝': 188,
               '╠': 204, '╣': 185, '╦': 203, '╩': 202, '╬': 206,
               '╤': 209, '╧': 207, '╪': 216, '╫': 215, '╟': 199, '╢': 182,
               '┼': 197, '─': 196, '│': 179 };
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
        m.jebakan(10, true); m.pasangJebakan(10, 1100);
      } },
    /* 20 `DEFSTR A-E,J,L` — huruf A sampai E, ditambah J dan L, jadi string. */
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 70);
        }
      } },
    /* 30 lima singkatan aksara kotak. Yang benar-benar dipakai cuma `E` dan
       `B` — tiga kali, di baris 100, 190, dan 630. `A`, `C`, dan `D` tidak
       muncul lagi di mana pun. */
    { baris: 30, jalan: function (m) {
        m.v.A = keBita('║'); m.v.B = keBita('═'); m.v.C = keBita('│');
        m.v.D = keBita('╦'); m.v.E = keBita('╔');
        m.lompat(80);
      } },

    { baris: 40, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 50, jalan: function (m) { if (m.inkey() !== '') m.lompat(40); } },
    { baris: 60, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(60);
      } },
    { baris: 70, jalan: function (m) { m.kembali(); } },

    { baris: 80, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(910); },
        function (m) { m.gosub(750); },
        function (m) { m.gosub(100); },
        function (m) { m.gosub(40); }
      ] },
    /* 90 `NO=1` mengubah perilaku subrutin kepala di baris 980: garis
       putus-putus di bawah judul dilewati. Satu variabel, satu perbedaan. */
    { baris: 90, bagian: [
        function (m) { m.cls(); m.v.NO = 1; },
        function (m) { m.gosub(910); },
        function (m) { m.gosub(1000); },
        function (m) { m.gosub(40); },
        function (m) { m.jalankan('BUSSIX'); }
      ] },

    /* --- 100-740: merakit kertas kerjanya --------------------------------- */
    { baris: 100, jalan: function (m) { m.v.JA = m.v.E + m.v.B + m.v.B; } },
    { baris: 110, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 18); } },
    { baris: 120, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 13); } },
    { baris: 130, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 13); } },
    { baris: 140, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 13); } },
    { baris: 150, jalan: function (m) { m.v.JA += u('╦', 1) + u('═', 13); } },
    { baris: 160, jalan: function (m) { m.v.JA += u('╗', 1); } },
    teks(170, 'JB', '║NO║  ACCOUNT NAME    ║TRIAL BALANCE║ ADJUSTMENTS ║  INCOME ST  ║BALANCE SHEET║'),
    teks(180, 'JC', '║  ║                  ║ DEB     CRD ║ DEB     CRD ║ DEB     CRD ║ DEB     CRD ║'),
    { baris: 190, jalan: function (m) { m.v.JD = keBita('╠') + m.v.B + m.v.B; } },
    { baris: 200, jalan: function (m) { m.v.JD += u('╬', 1) + u('═', 18); } },
    { baris: 210, jalan: function (m) { m.v.JD += u('╬', 1) + u('═', 6); } },
    { baris: 220, jalan: function (m) { m.v.JD += u('╤', 1) + u('═', 6); } },
    { baris: 230, jalan: function (m) { m.v.JD += u('╬', 1) + u('═', 6); } },
    { baris: 240, jalan: function (m) { m.v.JD += u('╤', 1) + u('═', 6); } },
    { baris: 250, jalan: function (m) { m.v.JD += u('╬', 1) + u('═', 6); } },
    { baris: 260, jalan: function (m) { m.v.JD += u('╤', 1) + u('═', 6); } },
    { baris: 270, jalan: function (m) { m.v.JD += u('╬', 1) + u('═', 6); } },
    { baris: 280, jalan: function (m) { m.v.JD += u('╤', 1) + u('═', 6); } },
    { baris: 290, jalan: function (m) { m.v.JD += u('╣', 1); } },

    /* 300-380 sembilan akun, delapan kolom uang. Perhatikan baris 300: Kas
       14.240 di neraca saldo, dikurangi 1.750 penyesuaian, jadi 12.490 di
       neraca — dan 12.490 itulah angka Kas di BUSNINE. */
    teks(300, 'JE', '║11║ CASH             ║14,240│      ║      │ 1,750║      │      ║12,490│      ║'),
    teks(310, 'JF', '║12║ ACCOUNTS REC.    ║ 1,695│      ║      │      ║      │      ║ 1,695│      ║'),
    teks(320, 'JG', '║14║ SUPPLIES         ║ 5,655│      ║      │      ║      │      ║ 5,655│      ║'),
    teks(330, 'JH', '║21║ ACCOUNTS PAYABLE ║      │ 3,500║      │      ║      │      ║      │ 3,500║'),
    teks(340, 'JI', '║31║ OWNER CAPITAL    ║      │14,700║      │      ║      │      ║      │14,700║'),
    teks(350, 'JJ', '║32║ OWNER WITHDRAWAL ║   860│      ║      │      ║      │      ║   860│      ║'),
    teks(360, 'JK', '║41║ SALES            ║      │12,045║      │      ║      │12,045║      │      ║'),
    teks(370, 'JL', '║51║ SALARY EXPENSE   ║ 1,750│      ║ 1,750│      ║ 3,500│      ║      │      ║'),
    teks(380, 'JM', '║52║ SUPPLIES EXPENSE ║ 6,045│      ║      │      ║ 6,045│      ║      │      ║'),

    { baris: 390, jalan: function (m) {
        m.v.JN = keBita('║  ║                  ') + u('╟', 1) + u('─', 6) + u('┼', 1);
      } },
    { baris: 400, jalan: function (m) { m.v.JN += u('─', 6) + u('╢', 1); } },
    { baris: 410, jalan: function (m) {
        m.v.JN += keBita('      │      ║      │      ║      │      ║');
      } },
    { baris: 420, jalan: function (m) {
        m.v.JO = keBita('║  ║                  ║30,245│30,245') + u('╟', 1);
      } },
    { baris: 430, jalan: function (m) { m.v.JO += u('─', 6) + u('┼', 1); } },
    { baris: 440, jalan: function (m) { m.v.JO += u('─', 6) + u('╫', 1); } },
    { baris: 450, jalan: function (m) { m.v.JO += u('─', 6) + u('┼', 1); } },
    { baris: 460, jalan: function (m) { m.v.JO += u('─', 6) + u('╫', 1); } },
    { baris: 470, jalan: function (m) { m.v.JO += u('─', 6) + u('┼', 1); } },
    { baris: 480, jalan: function (m) { m.v.JO += u('─', 6) + u('╢', 1); } },
    { baris: 490, jalan: function (m) {
        m.v.JP = keBita('║  ║                  ╠');
      } },
    { baris: 500, jalan: function (m) { m.v.JP += u('═', 6) + u('╪', 1); } },
    { baris: 510, jalan: function (m) { m.v.JP += u('═', 6) + u('╣', 1); } },
    /* 520 jumlah penyesuaian 1.750/1.750, laba-rugi 9.545/12.045, neraca
       20.700/18.200. Selisih keduanya sama-sama 2.500. */
    { baris: 520, jalan: function (m) {
        m.v.JP += keBita(' 1,750│ 1,750║ 9,545│12,045║20,700│18,200║');
      } },
    { baris: 530, jalan: function (m) {
        m.v.JQ = keBita('║  ║ NET INCOME       ║      │      ╠');
      } },
    { baris: 540, jalan: function (m) { m.v.JQ += u('═', 6) + u('╪', 1); } },
    { baris: 550, jalan: function (m) { m.v.JQ += u('═', 6) + u('╣', 1); } },
    { baris: 560, jalan: function (m) {
        m.v.JQ += keBita(' 2,500│      ║      │ 2,500║');
      } },
    { baris: 570, jalan: function (m) {
        m.v.JR = keBita('║  ║                  ║      │      ║      │      ') + u('╟', 1);
      } },
    { baris: 580, jalan: function (m) { m.v.JR += u('─', 6) + u('┼', 1); } },
    { baris: 590, jalan: function (m) { m.v.JR += u('─', 6) + u('╫', 1); } },
    { baris: 600, jalan: function (m) { m.v.JR += u('─', 6) + u('┼', 1); } },
    { baris: 610, jalan: function (m) { m.v.JR += u('─', 6) + u('╢', 1); } },
    teks(620, 'JS', '║  ║                  ║      │      ║      │      ║12,045│12,045║20,700│20,700║'),
    { baris: 630, jalan: function (m) { m.v.JZ = keBita('╚') + m.v.B + m.v.B; } },
    { baris: 640, jalan: function (m) { m.v.JZ += u('╩', 1) + u('═', 18); } },
    { baris: 650, jalan: function (m) { m.v.JZ += u('╩', 1) + u('═', 6); } },
    { baris: 660, jalan: function (m) { m.v.JZ += u('╧', 1) + u('═', 6); } },
    { baris: 670, jalan: function (m) { m.v.JZ += u('╩', 1) + u('═', 6); } },
    { baris: 680, jalan: function (m) { m.v.JZ += u('╧', 1) + u('═', 6); } },
    { baris: 690, jalan: function (m) { m.v.JZ += u('╩', 1) + u('═', 6); } },
    { baris: 700, jalan: function (m) { m.v.JZ += u('╧', 1) + u('═', 6); } },
    { baris: 710, jalan: function (m) { m.v.JZ += u('╩', 1) + u('═', 6); } },
    { baris: 720, jalan: function (m) { m.v.JZ += u('╧', 1) + u('═', 6); } },
    { baris: 730, jalan: function (m) { m.v.JZ += u('╝', 1); } },
    { baris: 740, jalan: function (m) { m.kembali(); } },

    /* --- 750-900: apa itu kertas kerja ------------------------------------ */
    { baris: 750, jalan: function (m) {
        m.locate(7, 20);
        m.cetak('The WORKSHEET is a particular type of working');
        m.barisBaru();
      } },
    naskah(760, 16, 'paper employed by accountants as a preliminary to'),
    naskah(770, 16, 'the preparation of financial statements.  Its use'),
    naskah(780, 16, 'reduces the possibility of overlooking a need for'),
    naskah(790, 16, 'an adjustment, will provide a convenient means of'),
    naskah(800, 16, 'verifying arithmetical accuracy, and provides for'),
    naskah(810, 16, 'the arrangement of data in a logical form.'),
    naskah(820, 20, 'A standard WORKSHEET has a column for account'),
    naskah(830, 16, 'titles and eight money columns,  arranged in four'),
    naskah(840, 16, 'pairs of debit and credit columns.  The principal'),
    { baris: 850, jalan: function (m) {
        m.tab(16); m.cetak('headings of the four sets of columns are;');
        m.barisBaru(); m.warna(11, 0);
      } },
    { baris: 860, jalan: function (m) { m.barisBaru(); } },
    naskah(870, 18, '1) Trial balance          3) Income Statement'),
    naskah(880, 18, '2) Adjustments            4) Balance Sheet'),
    { baris: 890, jalan: function (m) {
        m.locate(25, 18);
        m.cetak('***** Strike Any Key For The Worksheet *****');
        m.warna(7, 0);
      } },
    { baris: 900, jalan: function (m) { m.kembali(); } },

    /* --- 910-990: kepala halaman ------------------------------------------ */
    { baris: 910, jalan: function (m) {
        m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
        m.warna(11, 0);
      } },
    { baris: 920, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.H = 20; m.v.H <= 62; m.v.H++) {
            m.locate(m.v.I, m.v.H, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 930, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 940, jalan: function (m) {
        m.locate(2, 19); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 950, jalan: function (m) { m.warna(0, 7); } },
    { baris: 960, jalan: function (m) {
        m.locate(2, 22);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
      } },
    { baris: 970, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 27);
        m.cetak('STEP VII. WORKSHEET PREPARED '); m.barisBaru();
        m.warna(7, 0);
      } },
    /* 980 SATU-SATUNYA percabangan sungguhan di seluruh berkas ini: layar
       kedua (NO=1) tidak menggambar garis putus-putus di bawah judul, karena
       kertas kerjanya butuh setiap baris layar yang ada. */
    { baris: 980, jalan: function (m) {
        if (!m.v.NO) {
          m.warna(11, 0); m.locate(5, 27);
          m.cetak('----------------------------'); m.barisBaru();
          m.warna(7, 0);
        }
      } },
    { baris: 990, jalan: function (m) { m.kembali(); } },

    /* --- 1000-1090: cetak kertas kerjanya --------------------------------- */
    { baris: 1000, jalan: function (m) {
        m.locate(5, 1); cetak3(m, m.v.JA, m.v.JB, m.v.JC);
      } },
    { baris: 1010, jalan: function (m) { cetak3(m, m.v.JD, m.v.JE, m.v.JF); } },
    { baris: 1020, jalan: function (m) { cetak3(m, m.v.JG, m.v.JH, m.v.JI); } },
    { baris: 1030, jalan: function (m) { cetak3(m, m.v.JJ, m.v.JK, m.v.JL); } },
    { baris: 1040, jalan: function (m) { cetak3(m, m.v.JM, m.v.JN, m.v.JO); } },
    { baris: 1050, jalan: function (m) { cetak3(m, m.v.JP, m.v.JQ, m.v.JR); } },
    { baris: 1060, jalan: function (m) { m.locate(23, 1); m.cetak(m.v.JS); } },
    { baris: 1070, jalan: function (m) { m.locate(24, 1); m.cetak(m.v.JZ); } },
    { baris: 1080, jalan: function (m) {
        m.warna(11, 0); m.locate(25, 15);
        m.cetak('***** Strike Any Key For Financial Statements *****');
        m.warna(7, 0);
      } },
    { baris: 1090, jalan: function (m) { m.kembali(); } },
    { baris: 1100, jalan: function (m) { m.jalankan('MENU'); } }
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
  function cetak3(m, a, b, d) {
    m.cetak(a); m.barisBaru();
    m.cetak(b); m.barisBaru();
    m.cetak(d); m.barisBaru();
  }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSFIVE'] = {
    nama: 'BUSFIVE',
    judul: 'Business Simulation VII — kertas kerja',
    sumber: 'BUSFIVE',
    berkas: 'run/BUSFIVE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSFIVE.BAS',
      simpul: [
        { id: 'jebak', baris: '10-30', jenis: 'mulai',
          teks: ['DEFSTR A-E,J,L;', 'lima singkatan aksara kotak'] },
        { id: 'satu', baris: '80',
          teks: ['Layar 1: kepala,', 'apa itu kertas kerja'] },
        { id: 'rakit', baris: '100-740', jenis: 'subrutin',
          teks: ['Rakit kertas kerja:', 'delapan kolom uang'] },
        { id: 'kepala', baris: '910-990', jenis: 'subrutin',
          teks: ['Kotak judul;', 'NO=1 melewati garis bawahnya'] },
        { id: 'dua', baris: '90',
          teks: ['Layar 2: NO=1,', 'lalu cetak kertas kerjanya'] },
        { id: 'cetak', baris: '1000-1090', jenis: 'subrutin',
          teks: ['Dua puluh baris tabel', 'memenuhi layar'] },
        { id: 'lanjut', baris: '90', jenis: 'keluar',
          teks: ['RUN "BUSSIX"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'satu' },
        { dari: 'satu', ke: 'kepala' },
        { dari: 'satu', ke: 'rakit' },
        { dari: 'satu', ke: 'dua' },
        { dari: 'dua', ke: 'kepala', label: 'NO=1: tanpa garis bawah' },
        { dari: 'dua', ke: 'cetak' },
        { dari: 'dua', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 30, tingkat: 0, teks: 'singkat lima aksara kotak jadi <code>A</code>&hellip;<code>E</code> &mdash; lalu pakai tiga kali saja' },
      { baris: 80, tingkat: 0, teks: 'layar 1: apa itu kertas kerja, dan empat pasang kolomnya' },
      { baris: 100, tingkat: 0, teks: 'rakit kertas kerja: sembilan akun &times; delapan kolom uang' },
      { baris: 300, tingkat: 1, teks: 'Kas 14.240 &minus; 1.750 penyesuaian = <b>12.490</b> &mdash; angka Kas di BUSNINE' },
      { baris: 520, tingkat: 1, teks: 'laba-rugi 9.545/12.045, neraca 20.700/18.200' },
      { baris: 560, tingkat: 1, teks: 'laba bersih <b>2.500</b> &mdash; selisih keduanya, dua jalan hasil sama' },
      { baris: 90, tingkat: 0, teks: '<code>NO=1</code>, lalu cetak dua puluh baris tabelnya' },
      { baris: 980, tingkat: 1, teks: 'satu-satunya <code>IF</code> di seluruh berkas: lewati garis bawah judul' },
      { baris: 90, tingkat: 0, teks: '<code>RUN "BUSSIX"</code>' }
    ],

    perintahAsli: 'run\\BUSFIVE.bat',
    catatanAsli: 'Langkah VII dari rangkaian BUSONE sampai BUSTEN.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50.',

      '<b>Gelung perakit garis ditulis sebagai satu langkah.</b> ' +
      'Hasil stringnya identik.',

      '<b>Aksara kotak ditulis sebagai glif di berkas port</b> supaya terbaca, ' +
      'lalu dibalikkan ke bita CP437 sebelum dipakai.',

      '<b>Berakhir dengan <code>RUN"BUSSIX"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Kertas kerja delapan kolom yang angkanya cocok dengan sebelas ' +
        'berkas lain di rangkaian ini &mdash; tanpa satu pun perhitungan.',
      pelajari: [
        ['Satu bendera yang membedakan dua pemanggilan',
         'Subrutin kepala di 910&ndash;990 dipanggil dua kali. Baris 980 ' +
         'memeriksa <code>NO</code>: kalau nol, garis putus-putus di bawah ' +
         'judul digambar; kalau satu, dilewati. Layar kedua memuat kertas ' +
         'kerja setinggi dua puluh baris dan <b>butuh setiap baris layar yang ' +
         'ada</b>. Satu variabel, satu <code>IF</code>, dan sebuah subrutin ' +
         'dipakai untuk dua keperluan yang sedikit berbeda.'],
        ['Kertas kerja sebagai pemeriksaan silang',
         'Delapan kolom, empat pasang. Jumlah tiap pasang harus sama, dan ' +
         'selisih pasangan laba-rugi harus sama dengan selisih pasangan ' +
         'neraca &mdash; keduanya laba bersih. Di sini: 12.045 &minus; 9.545 ' +
         '= 2.500, dan 20.700 &minus; 18.200 = 2.500. <b>Dua jalan berbeda ' +
         'menuju angka yang sama</b>, dan itulah seluruh gunanya kertas ' +
         'kerja.'],
        ['Baris tabel yang dirakit dari potongan',
         'Baris 390&ndash;620 menyusun baris subtotal dengan menyelang-nyeling ' +
         'teks harfiah dan gelung garis, supaya persimpangannya jatuh persis ' +
         'di batas kolom. Delapan kolom selebar enam aksara, dipisah ' +
         '<code>│</code> di dalam pasangan dan <code>║</code> antar pasangan.']
      ],
      hindari: [
        ['Singkatan yang dibuat lalu ditinggalkan',
         'Baris 30 membuat lima singkatan: <code>A="║"</code>, ' +
         '<code>B="═"</code>, <code>C="│"</code>, <code>D="╦"</code>, ' +
         '<code>E="╔"</code>. Yang benar-benar dipakai cuma <code>E</code> dan ' +
         '<code>B</code>, tiga kali. <b><code>A</code>, <code>C</code>, dan ' +
         '<code>D</code> tidak muncul lagi di mana pun</b> &mdash; enam ratus ' +
         'baris berikutnya menulis aksaranya harfiah. Singkatan yang dipakai ' +
         'setengah jalan lebih membingungkan daripada tidak ada sama sekali.'],
        ['Angka yang cocok karena dicocokkan tangan',
         'Sembilan akun, delapan kolom, dua baris subtotal, dan sebuah laba ' +
         'bersih &mdash; semuanya konsisten dengan BUSFOUR di depannya dan ' +
         'BUSNINE di belakangnya. Dan seluruhnya <b>teks di dalam ' +
         '<code>PRINT</code></b>. Ubah satu digit dan tidak ada apa pun yang ' +
         'akan memberi tahu.']
      ]
    },

    penjelasan: [
      { judul: 'Dua belas berkas yang angkanya nyambung dari ujung ke ujung',
        isi: [
          'Kertas kerja ini tempat paling baik untuk melihat sesuatu yang ' +
          'tidak kelihatan kalau berkasnya dibaca satu-satu: <b>seluruh ' +
          'rangkaian dua belas program ini konsisten secara aritmetika</b>.',
          'Kas: BUSFOUR mencatat 14.240 di neraca saldo. Baris 300 di sini ' +
          'mengurangkannya dengan penyesuaian gaji 1.750, jadi ' +
          '<b>12.490</b> &mdash; dan itu persis angka Kas di neraca penutup ' +
          'BUSNINE.',
          'Laba bersih: 12.045 &minus; 9.545 = 2.500 dari sisi laba-rugi, dan ' +
          '20.700 &minus; 18.200 = 2.500 dari sisi neraca. Dua jalan, satu ' +
          'jawaban.',
          'Neraca: 20.700 dikurangi prive pemilik 860 = <b>19.840</b> ' +
          '&mdash; total neraca penutup di BUSNINE.',
          'Dan modal: 14.700 pembuka + 2.500 laba &minus; 860 prive = ' +
          '<b>16.340</b> &mdash; angka modal Homer Jones di baris terakhir ' +
          'BUSNINE.',
          'Semuanya cocok. Dan <b>tidak ada satu baris kode pun</b> di dua ' +
          'belas berkas itu yang menjumlahkan apa pun. Seseorang duduk, ' +
          'mengerjakan seluruh pembukuan sebuah perusahaan rekaan dengan ' +
          'benar, lalu mengetik hasilnya sebagai teks ke dalam dua belas ' +
          'program.',
          'Itu pekerjaan yang jauh lebih teliti daripada yang terlihat dari ' +
          'kodenya &mdash; dan pekerjaan yang seluruhnya rapuh, karena tidak ' +
          'ada satu pun bagian program yang tahu bahwa angka-angka itu saling ' +
          'berhubungan.'
        ] }
    ]
  };
})(window);
