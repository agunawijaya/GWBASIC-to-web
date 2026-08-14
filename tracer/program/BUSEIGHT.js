/* ===========================================================================
   BUSEIGHT.js — porting minimalis BUSEIGHT.BAS sebagai tabel baris.

   Langkah X: JURNAL PENUTUP. Akun pendapatan, beban, dan prive ditutup ke
   akun modal, supaya periode berikutnya mulai dari nol.

   DAN BERKAS INI PUNYA FOSIL YANG LAYAK DILIHAT.

   Sepuluh berkas lain di keluarga ini merakit garis tabelnya dengan gelung:

       190 JA="╔":FOR I=1 TO 10:JA=JA+"═":NEXT
       200 JA=JA+"╦":FOR I=1 TO 4:JA=JA+"═":NEXT
       ...lima baris untuk satu garis

   Di sini, satu baris:

       230 JA="╔"+STRING$(10,"═")+"╦"+STRING$(4,"═")+"╦"+...+"╗"

   Dan nomor barisnya melompat: 230 lalu 280, 290 lalu 340, 450 lalu 500,
   570 lalu 630, 750 lalu 810. LUBANG-LUBANG ITU adalah tempat gelung yang
   dihapus. Berkas ini disunting belakangan, dan `STRING$` menggantikan lima
   baris dengan satu — tapi nomor barisnya tidak pernah dirapikan.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol.
   - Aksara kotak ditulis sebagai glif di berkas port, lalu dibalikkan ke
     bita CP437 sebelum dipakai.
   - Berakhir dengan `RUN"BUSNINE"`.
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
  /* STRING$(n, "═") */
  function ulang(glif, n) {
    var k = '', i;
    for (i = 0; i < n; i++) k += keBita(glif);
    return k;
  }

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 1290);
      } },
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

    /* 80-210 naskahnya: empat layar, satu GOSUB per baris. Baris 180 menyetel
       `NO$="N"` sebelum layar terakhir — bendera yang membuat subrutin kepala
       melewati garis putus-putus di bawah judul. */
    { baris: 80, jalan: function (m) { m.gosub(820); } },
    { baris: 90, jalan: function (m) { m.gosub(920); } },
    { baris: 100, jalan: function (m) { m.gosub(230); } },
    { baris: 110, jalan: function (m) { m.gosub(40); } },
    { baris: 120, jalan: function (m) { m.gosub(820); } },
    { baris: 130, jalan: function (m) { m.gosub(1030); } },
    { baris: 140, jalan: function (m) { m.gosub(40); } },
    { baris: 150, jalan: function (m) { m.gosub(820); } },
    { baris: 160, jalan: function (m) { m.gosub(1100); } },
    { baris: 170, jalan: function (m) { m.gosub(40); } },
    { baris: 180, jalan: function (m) { m.v['NO$'] = 'N'; } },
    { baris: 190, jalan: function (m) { m.gosub(820); } },
    { baris: 200, jalan: function (m) { m.gosub(1180); } },
    { baris: 210, jalan: function (m) { m.gosub(40); } },
    { baris: 220, jalan: function (m) { m.jalankan('BUSNINE'); } },

    /* --- 230-810: merakit dua tabel, memakai STRING$ ----------------------- */
    /* Perhatikan lubang nomor barisnya: 230 -> 280, 290 -> 340, 450 -> 500,
       570 -> 630, 750 -> 810. Di situlah gelung perakit garis dulu berada. */
    { baris: 230, jalan: function (m) {
        m.v.JA = ulang('╔', 1) + ulang('═', 10) + ulang('╦', 1) +
                 ulang('═', 4) + ulang('╦', 1) + ulang('═', 22) +
                 ulang('╦', 1) + ulang('═', 9) + ulang('╦', 1) +
                 ulang('═', 9) + ulang('╗', 1);
      } },
    teks(280, 'JB', '║   DATE   ║ACCT║     ACCOUNT NAME     ║  DEBIT  ║ CREDIT  ║'),
    { baris: 290, jalan: function (m) {
        m.v.JC = ulang('╠', 1) + ulang('═', 10) + ulang('╬', 1) +
                 ulang('═', 4) + ulang('╬', 1) + ulang('═', 22) +
                 ulang('╬', 1) + ulang('═', 9) + ulang('╬', 1) +
                 ulang('═', 9) + ulang('╣', 1);
      } },
    /* 340-420 TIGA ayat penutup:
         penjualan 12.045 -> modal
         modal 9.545 -> beban gaji 3.500 + beban perlengkapan 6.045
         modal 860 -> prive
       Ketiganya berpasangan sempurna, dan tidak satu pun dijumlahkan. */
    teks(340, 'JD', '║ 06/30/82 ║ 41 ║ SALES                ║ 12045.00║         ║'),
    teks(350, 'JE', '║          ║ 31 ║    OWNER CAPITAL     ║         ║ 12045.00║'),
    teks(360, 'JF', '║          ║    ║                      ║         ║         ║'),
    teks(370, 'JG', '║          ║ 31 ║ OWNER CAPITAL        ║  9545.00║         ║'),
    teks(380, 'JH', '║          ║ 51 ║    SALARY EXPENSE    ║         ║  3500.00║'),
    teks(390, 'JI', '║          ║ 52 ║    SUPPLIES EXPENSE  ║         ║  6045.00║'),
    teks(400, 'JJ', '║          ║    ║                      ║         ║         ║'),
    teks(410, 'JK', '║          ║ 31 ║ OWNER CAPITAL        ║   860.00║         ║'),
    teks(420, 'JL', '║          ║ 32 ║    OWNER WITHDRAWAL  ║         ║   860.00║'),
    teks(430, 'JN', '║          ║    ║                      ║         ║         ║'),
    teks(440, 'JO', '║          ║    ║                      ║         ║         ║'),
    { baris: 450, jalan: function (m) {
        m.v.JM = ulang('╚', 1) + ulang('═', 10) + ulang('╩', 1) +
                 ulang('═', 4) + ulang('╩', 1) + ulang('═', 22) +
                 ulang('╩', 1) + ulang('═', 9) + ulang('╩', 1) +
                 ulang('═', 9) + ulang('╝', 1);
      } },
    { baris: 500, jalan: function (m) {
        m.v.LA = ulang('╔', 1) + ulang('═', 10) + ulang('╦', 1) +
                 ulang('═', 22) + ulang('╦', 1) + ulang('═', 9) +
                 ulang('╦', 1) + ulang('═', 9) + ulang('╦', 1) +
                 ulang('═', 9) + ulang('╦', 1) + ulang('═', 9) + ulang('╗', 1);
      } },
    teks(560, 'LB', '║   DATE   ║         ITEM         ║  DEBIT  ║ CREDIT  ║ BAL DBT ║ BAL CRD ║'),
    { baris: 570, jalan: function (m) {
        m.v.LC = ulang('╠', 1) + ulang('═', 10) + ulang('╬', 1) +
                 ulang('═', 22) + ulang('╬', 1) + ulang('═', 9) +
                 ulang('╬', 1) + ulang('═', 9) + ulang('╬', 1) +
                 ulang('═', 9) + ulang('╬', 1) + ulang('═', 9) + ulang('╣', 1);
      } },
    /* 630-660 buku besar modal: 14.700 + 12.045 = 26.745, - 9.545 = 17.200,
       - 860 = 16.340. Angka terakhir itulah modal Homer Jones di BUSNINE. */
    teks(630, 'LD', '║ 06/30/82 ║ BALANCE              ║         ║         ║         ║ 14700.00║'),
    teks(640, 'LE', '║ 06/30/82 ║ CLOSE OUT SALES      ║         ║ 12045.00║         ║ 26745.00║'),
    teks(650, 'LF', '║ 06/30/82 ║ CLOSE OUT EXPENSES   ║  9545.00║         ║         ║ 17200.00║'),
    teks(660, 'LG', '║ 06/30/82 ║ CLOSE OUT WITHDRAWAL ║   860.00║         ║         ║ 16340.00║'),
    /* 670-740 empat akun sementara, semuanya berakhir di 0.00 — itulah
       seluruh maksud jurnal penutup. */
    teks(670, 'LH', '║ 06/30/82 ║ BALANCE              ║         ║         ║         ║ 12045.00║'),
    teks(680, 'LI', '║ 06/30/82 ║ CLOSE OUT ACCOUNT    ║ 12045.00║         ║         ║     0.00║'),
    teks(690, 'LJ', '║ 06/30/82 ║ BALANCE              ║         ║         ║  3500.00║         ║'),
    teks(700, 'LK', '║ 06/30/82 ║ CLOSE OUT ACCOUNT    ║         ║  3500.00║     0.00║         ║'),
    teks(710, 'LL', '║ 06/30/82 ║ BALANCE              ║         ║         ║  6045.00║         ║'),
    teks(720, 'LM', '║ 06/30/82 ║ CLOSE OUT ACCOUNT    ║         ║  6045.00║     0.00║         ║'),
    teks(730, 'LN', '║ 06/30/82 ║ BALANCE              ║         ║         ║   860.00║         ║'),
    teks(740, 'LO', '║ 06/30/82 ║ CLOSE OUT ACCOUNT    ║         ║   860.00║     0.00║         ║'),
    { baris: 750, jalan: function (m) {
        m.v.LZ = ulang('╚', 1) + ulang('═', 10) + ulang('╩', 1) +
                 ulang('═', 22) + ulang('╩', 1) + ulang('═', 9) +
                 ulang('╩', 1) + ulang('═', 9) + ulang('╩', 1) +
                 ulang('═', 9) + ulang('╩', 1) + ulang('═', 9) + ulang('╝', 1);
      } },
    { baris: 810, jalan: function (m) { m.kembali(); } },

    /* --- 820-910: kepala halaman ------------------------------------------ */
    { baris: 820, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
        m.warna(11, 0);
      } },
    { baris: 830, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.H = 20; m.v.H <= 62; m.v.H++) {
            m.locate(m.v.I, m.v.H, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 840, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 850, jalan: function (m) {
        m.locate(2, 19); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 860, jalan: function (m) { m.warna(0, 7); } },
    { baris: 870, jalan: function (m) {
        m.locate(2, 22);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
      } },
    { baris: 880, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 29);
        m.cetak('STEP X. CLOSING ENTRIES'); m.barisBaru();
        m.warna(7, 0);
      } },
    /* 890 bendera yang sama dengan BUSFIVE, kali ini berupa string. Layar
       terakhir memuat tiga buku besar dan butuh setiap baris layar. */
    { baris: 890, jalan: function (m) {
        if (m.v['NO$'] === 'N') m.lompat(910);
      } },
    { baris: 900, jalan: function (m) {
        m.warna(11, 0); m.tab(29);
        m.cetak('-----------------------'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 910, jalan: function (m) { m.kembali(); } },

    /* --- 920-1020: kenapa akun ditutup ------------------------------------ */
    { baris: 920, jalan: function (m) {
        m.locate(7, 18);
        m.cetak('The revenue, expense and drawing accounts are only');
        m.barisBaru();
      } },
    naskah(930, 14, 'temporary accounts which are used to classify and sum-'),
    naskah(940, 14, 'marize changes in capital during the accounting period.'),
    naskah(950, 14, 'At the end of the period the net effect of the balance'),
    naskah(960, 14, 'in these  accounts is recorded in a permanent account.'),
    naskah(970, 14, 'The balances must also be removed so that they will be'),
    naskah(980, 14, 'ready for use in the  accumulation of data in the next'),
    naskah(990, 14, 'accounting period. This is accomplished by a series of'),
    naskah(1000, 14, 'entries called CLOSING ENTRIES.'),
    { baris: 1010, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Journal *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 1020, jalan: function (m) { m.kembali(); } },

    /* --- 1030-1090: jurnal penutup ---------------------------------------- */
    { baris: 1030, jalan: function (m) {
        m.locate(7, 11); m.cetak(m.v.JA); m.barisBaru();
        t11(m, m.v.JB); t11(m, m.v.JC);
      } },
    { baris: 1040, jalan: function (m) {
        t11(m, m.v.JD); t11(m, m.v.JE); t11(m, m.v.JF);
      } },
    { baris: 1050, jalan: function (m) {
        t11(m, m.v.JG); t11(m, m.v.JH); t11(m, m.v.JI);
      } },
    { baris: 1060, jalan: function (m) {
        t11(m, m.v.JJ); t11(m, m.v.JK); t11(m, m.v.JL);
      } },
    { baris: 1070, jalan: function (m) {
        t11(m, m.v.JN); t11(m, m.v.JO); t11(m, m.v.JM);
      } },
    { baris: 1080, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Ledger *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 1090, jalan: function (m) { m.kembali(); } },

    /* --- 1100-1170: buku besar modal dan penjualan ------------------------ */
    { baris: 1100, jalan: function (m) {
        m.locate(7, 5); m.cetak(m.v.LA); m.barisBaru();
        t5(m, m.v.LB); t5(m, m.v.LC);
      } },
    /* 1110-1120 nama akunnya dipecah dua baris di margin kiri: "Own." lalu
       "Cap." — karena margin cuma selebar empat aksara. */
    { baris: 1110, jalan: function (m) {
        m.warna(11, 0); m.cetak('Own.');
        m.warna(7, 0); m.cetak(m.v.LD); m.barisBaru();
      } },
    { baris: 1120, jalan: function (m) {
        m.warna(11, 0); m.cetak('Cap.');
        m.warna(7, 0); m.cetak(m.v.LE); m.barisBaru();
      } },
    { baris: 1130, jalan: function (m) {
        t5(m, m.v.LF); t5(m, m.v.LG); t5(m, m.v.LZ);
      } },
    { baris: 1140, jalan: function (m) {
        m.locate(17, 5); m.cetak(m.v.LA); m.barisBaru();
        t5(m, m.v.LB); t5(m, m.v.LC);
      } },
    { baris: 1150, jalan: function (m) {
        m.warna(11, 0); m.cetak('Sale');
        m.warna(7, 0); m.cetak(m.v.LH); m.barisBaru();
        t5(m, m.v.LI); t5(m, m.v.LZ);
      } },
    { baris: 1160, jalan: function (m) {
        m.warna(11, 0); m.locate(25, 17);
        m.cetak('***** Strike Any Key To Continue Posting *****       ');
        m.warna(7, 0);
      } },
    { baris: 1170, jalan: function (m) { m.kembali(); } },

    /* --- 1180-1280: tiga buku besar sisanya ------------------------------- */
    { baris: 1180, jalan: function (m) {
        m.locate(5, 5, 0); m.cetak(m.v.LA); m.barisBaru();
        t5(m, m.v.LB); t5(m, m.v.LC);
      } },
    { baris: 1190, jalan: function (m) {
        m.warna(11, 0); m.cetak('Sal.');
        m.warna(7, 0); m.cetak(m.v.LJ); m.barisBaru();
      } },
    { baris: 1200, jalan: function (m) {
        m.warna(11, 0); m.cetak('Exp.');
        m.warna(7, 0); m.cetak(m.v.LK); m.barisBaru();
        t5(m, m.v.LZ);
      } },
    { baris: 1210, jalan: function (m) {
        m.locate(12, 5); m.cetak(m.v.LA); m.barisBaru();
        t5(m, m.v.LB); t5(m, m.v.LC);
      } },
    { baris: 1220, jalan: function (m) {
        m.warna(11, 0); m.cetak('Sup.');
        m.warna(7, 0); m.cetak(m.v.LL); m.barisBaru();
      } },
    { baris: 1230, jalan: function (m) {
        m.warna(11, 0); m.cetak('Exp.');
        m.warna(7, 0); m.cetak(m.v.LM); m.barisBaru();
        t5(m, m.v.LZ);
      } },
    { baris: 1240, jalan: function (m) {
        m.locate(19, 5); m.cetak(m.v.LA); m.barisBaru();
        t5(m, m.v.LB); t5(m, m.v.LC);
      } },
    { baris: 1250, jalan: function (m) {
        m.warna(11, 0); m.cetak('With');
        m.warna(7, 0); m.cetak(m.v.LN); m.barisBaru();
      } },
    { baris: 1260, jalan: function (m) {
        m.warna(11, 0); m.cetak('draw');
        m.warna(7, 0); m.cetak(m.v.LO); m.barisBaru();
        m.tab(5); m.cetak(m.v.LZ);
      } },
    { baris: 1270, jalan: function (m) {
        m.warna(11, 0); m.locate(25, 16);
        m.cetak('***** Strike Any Key For Post-closing Trial BALANCE *****       ');
        m.warna(7, 0);
      } },
    { baris: 1280, jalan: function (m) { m.kembali(); } },
    { baris: 1290, jalan: function (m) { m.jalankan('MENU'); } }
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
  global.PROGRAM['BUSEIGHT'] = {
    nama: 'BUSEIGHT',
    judul: 'Business Simulation X — jurnal penutup',
    sumber: 'BUSEIGHT',
    berkas: 'run/BUSEIGHT.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSEIGHT.BAS',
      simpul: [
        { id: 'jebak', baris: '10-30', jenis: 'mulai',
          teks: ['F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'naskah', baris: '80-210',
          teks: ['Empat layar,', 'satu GOSUB per baris'] },
        { id: 'rakit', baris: '230-810', jenis: 'subrutin',
          teks: ['Rakit dua tabel', 'memakai STRING$'] },
        { id: 'kepala', baris: '820-910', jenis: 'subrutin',
          teks: ['Kotak judul; NO$="N"', 'melewati garis bawahnya'] },
        { id: 'sebab', baris: '920-1020', jenis: 'subrutin',
          teks: ['Kenapa: akun sementara', 'harus dikosongkan'] },
        { id: 'jurnal', baris: '1030-1090', jenis: 'subrutin',
          teks: ['Tiga ayat penutup', 'ke akun modal'] },
        { id: 'besar1', baris: '1100-1170', jenis: 'subrutin',
          teks: ['Buku besar modal:', '14.700 -> 16.340'] },
        { id: 'besar2', baris: '1180-1280', jenis: 'subrutin',
          teks: ['Tiga akun sementara,', 'semuanya jadi 0.00'] },
        { id: 'lanjut', baris: '220', jenis: 'keluar',
          teks: ['RUN "BUSNINE"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'naskah' },
        { dari: 'naskah', ke: 'kepala', label: 'GOSUB 820, empat kali' },
        { dari: 'naskah', ke: 'sebab' },
        { dari: 'naskah', ke: 'rakit', label: 'GOSUB 230, sekali' },
        { dari: 'naskah', ke: 'jurnal' },
        { dari: 'naskah', ke: 'besar1' },
        { dari: 'naskah', ke: 'besar2', label: 'NO$="N" lebih dulu' },
        { dari: 'naskah', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 230, tingkat: 0, teks: 'rakit tabel memakai <code>STRING$</code> &mdash; <b>satu baris, bukan lima</b>' },
      { baris: 920, tingkat: 0, teks: 'layar 1: akun pendapatan, beban, prive itu <b>sementara</b>' },
      { baris: 340, tingkat: 0, teks: 'ayat 1: penjualan 12.045 ditutup ke modal' },
      { baris: 370, tingkat: 0, teks: 'ayat 2: modal 9.545 ditutup ke beban gaji 3.500 + perlengkapan 6.045' },
      { baris: 410, tingkat: 0, teks: 'ayat 3: modal 860 ditutup ke prive' },
      { baris: 630, tingkat: 0, teks: 'buku besar modal: 14.700 + 12.045 &minus; 9.545 &minus; 860 = <b>16.340</b>' },
      { baris: 670, tingkat: 0, teks: 'empat akun sementara, semuanya berakhir di <b>0.00</b>' },
      { baris: 180, tingkat: 0, teks: '<code>NO$="N"</code> &mdash; layar terakhir butuh setiap baris layar' },
      { baris: 220, tingkat: 0, teks: '<code>RUN "BUSNINE"</code>' }
    ],

    perintahAsli: 'run\\BUSEIGHT.bat',
    catatanAsli: 'Langkah X dari rangkaian BUSONE sampai BUSTEN.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50.',

      '<b>Aksara kotak ditulis sebagai glif di berkas port</b> supaya terbaca, ' +
      'lalu dibalikkan ke bita CP437 sebelum dipakai.',

      '<b>Berakhir dengan <code>RUN"BUSNINE"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Jurnal penutup &mdash; dan satu-satunya berkas keluarga ini ' +
        'yang memakai <code>STRING$</code>, dengan lubang nomor baris sebagai ' +
        'bekasnya.',
      pelajari: [
        ['Lubang nomor baris sebagai catatan penyuntingan',
         'Nomor barisnya melompat: 230 lalu 280, 290 lalu 340, 450 lalu 500, ' +
         '570 lalu 630, 750 lalu 810. Di setiap lubang itu dulu ada gelung ' +
         '<code>FOR I=1 TO n:JA=JA+"═":NEXT</code> &mdash; persis seperti yang ' +
         'masih ada di sepuluh berkas lain. Seseorang menggantinya dengan ' +
         '<code>STRING$</code>, menghapus barisnya, dan <b>tidak merapikan ' +
         'penomorannya</b>. Lubangnya jadi catatan penyuntingan yang tersisa ' +
         'sampai hari ini.'],
        ['STRING$ menggantikan lima baris dengan satu',
         '<code>JA="╔"+STRING$(10,"═")+"╦"+STRING$(4,"═")+&hellip;</code> ' +
         'melakukan dalam satu baris apa yang di BUSTHREE.BAS butuh lima. ' +
         'Fungsinya sudah ada di GW-BASIC sejak awal; yang berubah cuma ' +
         'kebiasaan penulisnya.'],
        ['Apa gunanya jurnal penutup',
         'Naskah baris 920&ndash;1000 menjelaskannya dengan tepat: akun ' +
         'pendapatan, beban, dan prive adalah <b>akun sementara</b>. Ia ' +
         'mengelompokkan perubahan modal selama satu periode. Di akhir ' +
         'periode, hasil bersihnya dipindahkan ke akun tetap, dan saldonya ' +
         '<b>dikosongkan</b> supaya siap dipakai periode berikutnya. Empat ' +
         'buku besar di layar terakhir semuanya berakhir di 0,00 &mdash; itu ' +
         'seluruh maksudnya.'],
        ['Nama akun yang dipecah dua baris',
         'Baris 1110&ndash;1120 mencetak "Own." lalu "Cap." di margin kiri, ' +
         'masing-masing sejajar satu baris tabel. Margin kirinya cuma selebar ' +
         'empat aksara, jadi nama panjang dipenggal menurut baris tabel ' +
         '&mdash; bukan menurut suku katanya.']
      ],
      hindari: [
        ['Bendera yang berupa string padahal cukup angka',
         '<code>NO$="N"</code> di baris 180, diperiksa <code>IF NO$="N"</code> ' +
         'di baris 890. BUSFIVE.BAS melakukan hal yang persis sama dengan ' +
         'angka: <code>NO=1</code>. Dua berkas bersaudara, dua tipe untuk ' +
         'satu gagasan.'],
        ['Penomoran yang tidak dirapikan sesudah disunting',
         'Lubang di 240&ndash;270, 300&ndash;330, 460&ndash;490, ' +
         '510&ndash;550, 580&ndash;620, dan 760&ndash;800. Tidak berbahaya ' +
         '&mdash; tapi pembaca berikutnya akan mencari baris yang tidak ada.'],
        ['Angka yang menutup dengan benar, tanpa dihitung',
         '14.700 + 12.045 &minus; 9.545 &minus; 860 = 16.340. Empat langkah, ' +
         'empat baris <code>PRINT</code>, dan tidak ada satu pun operator ' +
         'aritmetika di seluruh berkas.']
      ]
    },

    penjelasan: [
      { judul: 'Fosil sebuah penyuntingan',
        isi: [
          'Sepuluh berkas lain di keluarga ini merakit garis tabelnya dengan ' +
          'gelung, lima baris untuk satu garis:',
          '<code>190 JA="╔":FOR I=1 TO 10:JA=JA+"═":NEXT</code><br>' +
          '<code>200 JA=JA+"╦":FOR I=1 TO 4:JA=JA+"═":NEXT</code><br>' +
          '<code>&hellip;</code>',
          'Berkas ini melakukannya dalam satu baris:',
          '<code>230 JA="╔"+STRING$(10,"═")+"╦"+STRING$(4,"═")+&hellip;+"╗"</code>',
          'Dan nomor barisnya melompat dari 230 ke 280. Lalu dari 290 ke 340. ' +
          'Dari 450 ke 500. Dari 570 ke 630. Dari 750 ke 810.',
          'Lima lubang, dan setiap lubang berukuran persis empat sampai lima ' +
          'nomor baris &mdash; sebesar gelung yang dulu ada di sana.',
          'Jadi ini bisa dibaca: berkasnya ditulis dengan gelung seperti ' +
          'saudara-saudaranya, lalu <b>disunting belakangan</b>. Seseorang ' +
          'mengganti lima baris dengan satu, menghapus sisanya, dan berhenti ' +
          'di situ. Nomor barisnya tidak dirapikan karena merapikannya berarti ' +
          'memeriksa ulang setiap <code>GOSUB</code> dan <code>GOTO</code> yang ' +
          'menunjuk ke sana.',
          'Yang tersisa adalah <b>catatan sejarah yang tidak sengaja</b>. ' +
          'Empat puluh tahun kemudian, lubang di penomoran itu masih ' +
          'menceritakan bahwa berkas inilah yang terakhir disentuh.',
          'Dan pertanyaan yang tidak akan pernah terjawab: kenapa cuma berkas ' +
          'ini? Kalau <code>STRING$</code> lebih baik &mdash; dan memang ' +
          'lebih baik &mdash; kenapa sepuluh berkas lain dibiarkan?'
        ] }
    ]
  };
})(window);
