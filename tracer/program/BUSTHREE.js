/* ===========================================================================
   BUSTHREE.js — porting minimalis BUSTHREE.BAS sebagai tabel baris.

   Langkah III, IV, dan V sekaligus: transaksi terjadi, dicatat ke JURNAL,
   lalu dipindah ke BUKU BESAR. Berkas terbesar keluarga ini (125 baris), dan
   yang paling banyak isinya.

   SELURUH NASKAHNYA ADA DI SATU BARIS.

       80 GOSUB 820:GOSUB 890:GOSUB 980:GOSUB 300:GOSUB 40:GOSUB 820:
          GOSUB 930:GOSUB 1040:GOSUB 40:GOSUB 820:GOSUB 930:GOSUB 1170:
          GOSUB 40:GOSUB 820:GOSUB 960:GOSUB 1240:GOSUB 40:GOSUB 820:
          GOSUB 960:GOSUB 1360:GOSUB 40

   Dua puluh `GOSUB` berturut-turut. Pola berulangnya kepala-judul-isi-tunggu,
   lima kali. Tidak ada gelung, tidak ada larik nomor layar, tidak ada
   variabel keadaan — urutan pemanggilannya SENDIRI yang menjadi naskahnya.

   Dan angka-angkanya, lagi-lagi, seluruhnya teks. Pembukuan berpasangannya
   memang benar: 1500 debit = 500 kredit + 1000 kredit; persediaan 6700+1500
   = 8200; kas 8000-500 = 7500; utang 0+1000 = 1000. Tidak satu pun dihitung.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol, karena
     dipasangkan dengan gelung pembuang `IF INKEY$<>""` di baris 50.
   - Gelung perakit garis (`FOR I=1 TO 10:JA=JA+"═":NEXT`) ditulis sebagai
     satu langkah: tidak ada percabangan di dalamnya dan tidak ada yang bisa
     disorot. Hasil stringnya identik.
   - Aksara kotak ditulis sebagai glif di berkas port supaya terbaca, lalu
     dibalikkan ke bita CP437 sebelum dipakai.
   - Berakhir dengan `RUN"BUSFOUR"`.
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
  function g(kode, n) {
    var s = String.fromCharCode(kode), k = '', i;
    for (i = 0; i < n; i++) k += s;
    return k;
  }
  var GARIS = 205, SUDUT = { ka: 201, kn: 187, ba: 200, bn: 188,
                             ta: 203, tb: 202, sk: 204, sn: 185, x: 206 };
  function c(k) { return String.fromCharCode(k); }

  var tabel = [

    /* 1 `DEFSTR J,L` — SEMUA variabel berawalan J atau L bertipe string.
       Termasuk `LA`..`LK` yang menyimpan tabel buku besar. */
    { baris: 1, jalan: function () { } },
    { baris: 10, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 1440);
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

    /* 80 SELURUH naskah programnya, dua puluh GOSUB dalam satu baris.
       Lima layar: transaksi, penjelasan jurnal, jurnalnya, penjelasan buku
       besar, buku besarnya. */
    { baris: 80, bagian: [
        s(820), s(890), s(980), s(300), s(40),
        s(820), s(930), s(1040), s(40),
        s(820), s(930), s(1170), s(40),
        s(820), s(960), s(1240), s(40),
        s(820), s(960), s(1360), s(40)
      ] },
    { baris: 290, jalan: function (m) { m.jalankan('BUSFOUR'); } },

    /* --- 300-810: merakit dua tabel sebagai string ------------------------ */
    /* JA..JK = jurnal. LA..LK = buku besar. Keduanya dirakit di sini, jauh
       dari tempat pencetakannya di 1170 dan 1360. */
    { baris: 300, jalan: function (m) { m.v.JA = c(SUDUT.ka) + g(GARIS, 10); } },
    { baris: 310, jalan: function (m) { m.v.JA += c(SUDUT.ta) + g(GARIS, 4); } },
    { baris: 320, jalan: function (m) { m.v.JA += c(SUDUT.ta) + g(GARIS, 22); } },
    { baris: 330, jalan: function (m) { m.v.JA += c(SUDUT.ta) + g(GARIS, 9); } },
    { baris: 340, jalan: function (m) {
        m.v.JA += c(SUDUT.ta) + g(GARIS, 9) + c(SUDUT.kn);
      } },
    teks(350, 'JB', '║   DATE   ║ACCT║     ACCOUNT NAME     ║  DEBIT  ║ CREDIT  ║'),
    { baris: 360, jalan: function (m) { m.v.JC = c(SUDUT.sk) + g(GARIS, 10); } },
    { baris: 370, jalan: function (m) { m.v.JC += c(SUDUT.x) + g(GARIS, 4); } },
    { baris: 380, jalan: function (m) { m.v.JC += c(SUDUT.x) + g(GARIS, 22); } },
    { baris: 390, jalan: function (m) { m.v.JC += c(SUDUT.x) + g(GARIS, 9); } },
    { baris: 400, jalan: function (m) {
        m.v.JC += c(SUDUT.x) + g(GARIS, 9) + c(SUDUT.sn);
      } },
    /* 410-430 PEMBUKUAN BERPASANGAN: satu debit 1500, dua kredit 500 + 1000.
       Jumlah kedua sisinya sama — dan tidak ada yang memeriksanya. */
    teks(410, 'JD', '║ 06/03/82 ║ 14 ║ SUPPLIES             ║ 1500.00 ║         ║'),
    teks(420, 'JE', '║          ║ 11 ║   CASH               ║         ║  500.00 ║'),
    teks(430, 'JF', '║          ║ 21 ║   ACCOUNTS PAYABLE   ║         ║ 1000.00 ║'),
    teks(440, 'JG', '║          ║    ║     PURCHASED GOODS  ║         ║         ║'),
    teks(450, 'JH', '║          ║    ║                      ║         ║         ║'),
    teks(460, 'JI', '║          ║    ║                      ║         ║         ║'),
    teks(470, 'JJ', '║          ║    ║                      ║         ║         ║'),
    { baris: 480, jalan: function (m) { m.v.JK = c(SUDUT.ba) + g(GARIS, 10); } },
    { baris: 490, jalan: function (m) { m.v.JK += c(SUDUT.tb) + g(GARIS, 4); } },
    { baris: 500, jalan: function (m) { m.v.JK += c(SUDUT.tb) + g(GARIS, 22); } },
    { baris: 510, jalan: function (m) { m.v.JK += c(SUDUT.tb) + g(GARIS, 9); } },
    { baris: 520, jalan: function (m) {
        m.v.JK += c(SUDUT.tb) + g(GARIS, 9) + c(SUDUT.bn);
      } },
    /* 530 `JM` tanpa tanda dolar (karena DEFSTR) berdampingan dengan
       `JMA$` yang memakainya. Dua gaya penamaan dalam satu baris. */
    { baris: 530, jalan: function (m) {
        m.v.JM = 'Explanation :';
        m.v['JMA$'] = ' 1) The debit to supplies will increase it.';
      } },
    teks(540, 'JN', ' 2) The credit to cash will decrease it.'),
    teks(550, 'JO', ' 3) The credit to accounts payable will increase it.'),

    { baris: 560, jalan: function (m) { m.v.LA = c(SUDUT.ka) + g(GARIS, 10); } },
    { baris: 570, jalan: function (m) { m.v.LA += c(SUDUT.ta) + g(GARIS, 22); } },
    { baris: 580, jalan: function (m) { m.v.LA += c(SUDUT.ta) + g(GARIS, 9); } },
    { baris: 590, jalan: function (m) { m.v.LA += c(SUDUT.ta) + g(GARIS, 9); } },
    { baris: 600, jalan: function (m) { m.v.LA += c(SUDUT.ta) + g(GARIS, 9); } },
    { baris: 610, jalan: function (m) {
        m.v.LA += c(SUDUT.ta) + g(GARIS, 9) + c(SUDUT.kn);
      } },
    teks(620, 'LB', '║   DATE   ║         ITEM         ║  DEBIT  ║ CREDIT  ║ BAL DBT ║ BAL CRD ║'),
    { baris: 630, jalan: function (m) { m.v.LC = c(SUDUT.sk) + g(GARIS, 10); } },
    { baris: 640, jalan: function (m) { m.v.LC += c(SUDUT.x) + g(GARIS, 22); } },
    { baris: 650, jalan: function (m) { m.v.LC += c(SUDUT.x) + g(GARIS, 9); } },
    { baris: 660, jalan: function (m) { m.v.LC += c(SUDUT.x) + g(GARIS, 9); } },
    { baris: 670, jalan: function (m) { m.v.LC += c(SUDUT.x) + g(GARIS, 9); } },
    { baris: 680, jalan: function (m) {
        m.v.LC += c(SUDUT.x) + g(GARIS, 9) + c(SUDUT.sn);
      } },
    /* 690-740 tiga buku besar, masing-masing dua baris: saldo awal dan
       transaksinya. 6700+1500=8200, 8000-500=7500, 0+1000=1000. */
    teks(690, 'LD', '║ 06/01/82 ║ BALANCE              ║ 6700.00 ║         ║ 6700.00 ║         ║'),
    teks(700, 'LE', '║ 06/03/82 ║ PURCHASE OF GOODS    ║ 1500.00 ║         ║ 8200.00 ║         ║'),
    teks(710, 'LF', '║ 06/01/82 ║ BALANCE              ║ 8000.00 ║         ║ 8000.00 ║         ║'),
    teks(720, 'LG', '║ 06/03/82 ║ PURCHASE OF GOODS    ║         ║  500.00 ║ 7500.00 ║         ║'),
    teks(730, 'LH', '║ 06/01/82 ║ BALANCE              ║         ║    0.00 ║         ║    0.00 ║'),
    teks(740, 'LI', '║ 06/03/82 ║ PURCHASE OF GOODS    ║         ║ 1000.00 ║         ║ 1000.00 ║'),
    { baris: 750, jalan: function (m) { m.v.LK = c(SUDUT.ba) + g(GARIS, 10); } },
    { baris: 760, jalan: function (m) { m.v.LK += c(SUDUT.tb) + g(GARIS, 22); } },
    { baris: 770, jalan: function (m) { m.v.LK += c(SUDUT.tb) + g(GARIS, 9); } },
    { baris: 780, jalan: function (m) { m.v.LK += c(SUDUT.tb) + g(GARIS, 9); } },
    { baris: 790, jalan: function (m) { m.v.LK += c(SUDUT.tb) + g(GARIS, 9); } },
    { baris: 800, jalan: function (m) {
        m.v.LK += c(SUDUT.tb) + g(GARIS, 9) + c(SUDUT.bn);
      } },
    { baris: 810, jalan: function (m) { m.kembali(); } },

    /* --- 820-880: kepala halaman ------------------------------------------ */
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
    { baris: 880, jalan: function (m) { m.kembali(); } },

    /* --- 890-970: tiga judul langkah -------------------------------------- */
    { baris: 890, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 26);
        m.cetak('STEP III. TRANSACTIONS OCCUR'); m.barisBaru();
      } },
    { baris: 900, jalan: function (m) {
        m.tab(26); m.cetak('----------------------------'); m.barisBaru();
      } },
    { baris: 910, jalan: function (m) {
        m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Journal *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 920, jalan: function (m) { m.kembali(); } },
    { baris: 930, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 26);
        m.cetak(' STEP IV. POSTING TO JOURNAL'); m.barisBaru();
      } },
    { baris: 940, jalan: function (m) {
        m.tab(26); m.cetak(' ---------------------------'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 950, jalan: function (m) { m.kembali(); } },
    { baris: 960, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 27);
        m.cetak('STEP V. POSTING TO LEDGERS '); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 970, jalan: function (m) { m.kembali(); } },

    /* --- 980-1030: transaksinya ------------------------------------------- */
    { baris: 980, jalan: function (m) {
        m.locate(8, 20);
        m.cetak('On the 3rd day of June, Homer purchased $1500');
        m.barisBaru();
      } },
    naskah(990, 15, 'worth of hardware from his supplier.  He paid $500'),
    naskah(1000, 15, 'of the  bill in cash and put the  remaining amount'),
    naskah(1010, 15, 'of the bill on his account,  to be paid in full no'),
    naskah(1020, 15, 'later than the end of the month.'),
    { baris: 1030, jalan: function (m) { m.kembali(); } },

    /* --- 1040-1160: penjelasan jurnal ------------------------------------- */
    { baris: 1040, jalan: function (m) {
        m.locate(7, 18);
        m.cetak('The first thing that must be done after a business');
        m.barisBaru();
      } },
    naskah(1050, 13, 'transaction occurs is the posting to the journals. This'),
    naskah(1060, 13, 'should be done as soon as possible. For this simulation'),
    naskah(1070, 13, 'we will be using a double entry system. This means that'),
    naskah(1080, 13, 'for every debit that is posted,  a credit entry must be'),
    naskah(1090, 13, 'made.  There can be several different accounts involved'),
    naskah(1100, 13, 'in a single transaction.'),
    naskah(1110, 18, 'The first entry in the journal for any transaction'),
    naskah(1120, 13, 'should have the date it occured. All journal entries in'),
    naskah(1130, 13, 'the transaction must have account number, account name,'),
    naskah(1140, 13, 'and either debit or credit amount.'),
    { baris: 1150, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Journal *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 1160, jalan: function (m) { m.kembali(); } },

    /* --- 1170-1230: jurnalnya --------------------------------------------- */
    { baris: 1170, jalan: function (m) {
        m.locate(7, 11); m.cetak(m.v.JA); m.barisBaru();
        tab11(m, m.v.JB); tab11(m, m.v.JC);
      } },
    { baris: 1180, jalan: function (m) {
        tab11(m, m.v.JD); tab11(m, m.v.JE); tab11(m, m.v.JF);
      } },
    { baris: 1190, jalan: function (m) {
        tab11(m, m.v.JG); tab11(m, m.v.JH); tab11(m, m.v.JI);
      } },
    /* 1200 `JM` dan `JMA$` dicetak berdampingan: judul berwarna, isinya
       tidak. */
    { baris: 1200, jalan: function (m) {
        tab11(m, m.v.JJ); tab11(m, m.v.JK); m.barisBaru();
        m.warna(11, 0); m.tab(11); m.cetak(m.v.JM);
        m.warna(7, 0); m.cetak(m.v['JMA$']); m.barisBaru();
      } },
    /* 1210 `JP` TIDAK PERNAH DIISI di mana pun. `DEFSTR J` membuatnya string
       kosong, jadi baris ini mencetak baris kosong tanpa satu pun tanda. */
    { baris: 1210, jalan: function (m) {
        m.tab(24); m.cetak(m.v.JN); m.barisBaru();
        m.tab(24); m.cetak(m.v.JO); m.barisBaru();
        m.tab(3); m.cetak(m.v.JP || ''); m.barisBaru();
      } },
    { baris: 1220, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Ledger *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 1230, jalan: function (m) { m.kembali(); } },

    /* --- 1240-1350: penjelasan buku besar --------------------------------- */
    { baris: 1240, jalan: function (m) {
        m.warna(15, 0); m.locate(5, 27);
        m.cetak('-------------------------- '); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 1250, jalan: function (m) {
        m.locate(7, 18);
        m.cetak('After you have made your journal entries, you must');
        m.barisBaru();
      } },
    naskah(1260, 13, 'next transfer these entries, one at a time, to seperate'),
    naskah(1270, 13, 'ledgers. The purpose of the ledgers is to summarize all'),
    naskah(1280, 13, 'of the activity against any account for a  given period'),
    naskah(1290, 13, 'of time. Each account that is set up will have a ledger'),
    naskah(1300, 13, 'of its own.  This ledger will contain every transaction'),
    naskah(1310, 13, 'concerning this account and the amount.  The balance of'),
    naskah(1320, 13, 'the account before and after  the transaction occurs is'),
    naskah(1330, 13, 'also recorded.'),
    { baris: 1340, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key To Post To The Ledger *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 1350, jalan: function (m) { m.kembali(); } },

    /* --- 1360-1430: tiga buku besar --------------------------------------- */
    /* Namanya dicetak DI MARGIN KIRI: `PRINT"Supp";` di kolom 1, lalu baris
       tabelnya menyusul di kolom 5. Label tanpa kolom label. */
    { baris: 1360, jalan: function (m) {
        m.locate(5, 5); m.cetak(m.v.LA); m.barisBaru();
        tab5(m, m.v.LB); tab5(m, m.v.LC);
      } },
    { baris: 1370, jalan: function (m) {
        m.warna(11, 0); m.cetak('Supp');
        m.warna(7, 0); m.cetak(m.v.LD); m.barisBaru();
        tab5(m, m.v.LE); tab5(m, m.v.LK);
      } },
    { baris: 1380, jalan: function (m) {
        m.locate(12, 5); m.cetak(m.v.LA); m.barisBaru();
        tab5(m, m.v.LB); tab5(m, m.v.LC);
      } },
    { baris: 1390, jalan: function (m) {
        m.warna(11, 0); m.cetak('Cash');
        m.warna(7, 0); m.cetak(m.v.LF); m.barisBaru();
        tab5(m, m.v.LG); tab5(m, m.v.LK);
      } },
    { baris: 1400, jalan: function (m) {
        m.locate(19, 5); m.cetak(m.v.LA); m.barisBaru();
        tab5(m, m.v.LB); tab5(m, m.v.LC);
      } },
    { baris: 1410, jalan: function (m) {
        m.warna(11, 0); m.cetak('Acct');
        m.warna(7, 0); m.cetak(m.v.LH); m.barisBaru();
        m.warna(11, 0); m.cetak('Pay.');
        m.warna(7, 0); m.cetak(m.v.LI); m.barisBaru();
        m.tab(5); m.cetak(m.v.LK);
      } },
    { baris: 1420, jalan: function (m) {
        m.warna(11, 0); m.locate(25, 16);
        m.cetak('***** Strike Any Key For The Trial Balance *****       ');
        m.warna(7, 0);
      } },
    { baris: 1430, jalan: function (m) { m.kembali(); } },
    { baris: 1440, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function s(nomor) { return function (m) { m.gosub(nomor); }; }
  function teks(nomor, nama, isi) {
    return { baris: nomor, jalan: function (m) { m.v[nama] = keBita(isi); } };
  }
  function naskah(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function tab11(m, isi) { m.tab(11); m.cetak(isi); m.barisBaru(); }
  function tab5(m, isi) { m.tab(5); m.cetak(isi); m.barisBaru(); }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSTHREE'] = {
    nama: 'BUSTHREE',
    judul: 'Business Simulation III-V — jurnal dan buku besar',
    sumber: 'BUSTHREE',
    berkas: 'run/BUSTHREE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSTHREE.BAS',
      simpul: [
        { id: 'jebak', baris: '1-30', jenis: 'mulai',
          teks: ['DEFSTR J,L; F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'naskah', baris: '80',
          teks: ['SATU baris,', 'dua puluh GOSUB'] },
        { id: 'rakit', baris: '300-810', jenis: 'subrutin',
          teks: ['Rakit dua tabel:', 'jurnal JA..JK, buku besar LA..LK'] },
        { id: 'kepala', baris: '820-880', jenis: 'subrutin',
          teks: ['Kotak judul,', 'dipanggil lima kali'] },
        { id: 'transaksi', baris: '980-1030', jenis: 'subrutin',
          teks: ['STEP III:', 'Homer beli $1500'] },
        { id: 'jurnal', baris: '1170-1230', jenis: 'subrutin',
          teks: ['STEP IV: jurnal.', '1500 debit = 500 + 1000 kredit'] },
        { id: 'besar', baris: '1360-1430', jenis: 'subrutin',
          teks: ['STEP V: tiga buku besar,', 'namanya di margin kiri'] },
        { id: 'lanjut', baris: '290', jenis: 'keluar',
          teks: ['RUN "BUSFOUR"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'naskah' },
        { dari: 'naskah', ke: 'rakit', label: 'GOSUB 300, sekali' },
        { dari: 'naskah', ke: 'kepala', label: 'GOSUB 820, lima kali' },
        { dari: 'naskah', ke: 'transaksi' },
        { dari: 'naskah', ke: 'jurnal' },
        { dari: 'naskah', ke: 'besar' },
        { dari: 'naskah', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 1, tingkat: 0, teks: '<code>DEFSTR J,L</code> &mdash; semua variabel J* dan L* bertipe string' },
      { baris: 80, tingkat: 0, teks: '<b>seluruh naskah program dalam satu baris:</b> dua puluh <code>GOSUB</code>' },
      { baris: 80, tingkat: 1, teks: 'pola berulang: <code>kepala &rarr; judul &rarr; isi &rarr; tunggu</code>, lima kali' },
      { baris: 300, tingkat: 0, teks: 'rakit tabel <b>jurnal</b> (JA&hellip;JK) dan <b>buku besar</b> (LA&hellip;LK) sebagai string' },
      { baris: 410, tingkat: 1, teks: 'pembukuan berpasangan: debit 1500 = kredit 500 + kredit 1000' },
      { baris: 690, tingkat: 1, teks: 'buku besar: 6700+1500=8200, 8000&minus;500=7500, 0+1000=1000' },
      { baris: 1210, tingkat: 1, teks: '&hellip;dan <code>JP</code> yang dicetak di sini <b>tidak pernah diisi</b>' },
      { baris: 1370, tingkat: 0, teks: 'nama buku besar dicetak di <b>margin kiri</b>, di luar tabelnya' },
      { baris: 290, tingkat: 0, teks: '<code>RUN "BUSFOUR"</code>' }
    ],

    perintahAsli: 'run\\BUSTHREE.bat',
    catatanAsli: 'Langkah III sampai V dari rangkaian BUSONE sampai BUSTEN.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50.',

      '<b>Gelung perakit garis ditulis sebagai satu langkah.</b> ' +
      '<code>FOR I=1 TO 10:JA=JA+"═":NEXT</code> tidak punya percabangan dan ' +
      'tidak ada apa pun di dalamnya yang bisa disorot. Hasil stringnya ' +
      'identik.',

      '<b>Aksara kotak ditulis sebagai glif di berkas port</b> supaya terbaca, ' +
      'lalu dibalikkan ke bita CP437 sebelum dipakai.',

      '<b>Berakhir dengan <code>RUN"BUSFOUR"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Tiga langkah akuntansi dalam satu berkas, dan seluruh ' +
        'naskahnya muat di satu baris berisi dua puluh <code>GOSUB</code>.',
      pelajari: [
        ['Urutan pemanggilan sebagai naskah',
         'Baris 80 memuat dua puluh <code>GOSUB</code> berturut-turut, dengan ' +
         'pola berulang <b>kepala &rarr; judul &rarr; isi &rarr; tunggu</b> ' +
         'lima kali. Tidak ada gelung, tidak ada larik nomor layar, tidak ada ' +
         'variabel keadaan. <b>Urutannya sendiri yang menjadi naskahnya</b> ' +
         '&mdash; dan itu bisa dibaca dari kiri ke kanan seperti daftar acara.'],
        ['Dua tabel dirakit di satu tempat, dipakai di tempat lain',
         'Baris 300&ndash;810 merakit <b>keduanya</b>: jurnal di JA&hellip;JK, ' +
         'buku besar di LA&hellip;LK. Pencetakannya baru terjadi di 1170 dan ' +
         '1360. Memisahkan "apa isinya" dari "kapan ditampilkan" &mdash; dan ' +
         '<code>LA</code>, garis atas buku besar, dipakai ulang tiga kali ' +
         'untuk tiga akun.'],
        ['Label di luar tabel',
         'Baris 1370 mencetak <code>"Supp"</code> di kolom 1, lalu baris ' +
         'tabelnya di kolom 5. Nama akunnya berada di <b>margin kiri</b>, di ' +
         'luar bingkai tabel. Cara memberi keterangan tanpa perlu menambah ' +
         'kolom di dalam tabelnya.'],
        ['Pembukuan berpasangan sebagai aturan bentuk',
         'Baris 410&ndash;430: satu debit 1500, dua kredit 500 dan 1000. ' +
         'Jumlah kedua sisinya <b>selalu</b> sama &mdash; itulah seluruh isi ' +
         'aturan <i>double entry</i>, dan alasan kenapa neraca saldo di ' +
         'BUSFOUR bisa dipakai sebagai pemeriksaan.']
      ],
      hindari: [
        ['Variabel yang dicetak tapi tidak pernah diisi',
         'Baris 1210 mencetak <code>JP</code>. Tidak ada satu baris pun di ' +
         'seluruh berkas yang memberinya nilai. Karena <code>DEFSTR J</code>, ' +
         'ia string kosong &mdash; jadi yang tercetak sebuah <b>baris kosong ' +
         'tanpa satu pun tanda</b>. Kemungkinan besar ada baris keempat ' +
         'penjelasan yang terhapus, dan tempatnya masih di sana.'],
        ['Dua gaya penamaan dalam satu baris',
         'Baris 530: <code>JM="Explanation :":JMA$=" 1) The debit&hellip;"</code>. ' +
         'Yang pertama mengandalkan <code>DEFSTR</code>, yang kedua menulis ' +
         '<code>$</code>-nya. Keduanya benar; berdampingan begitu, keduanya ' +
         'jadi terlihat seperti kesalahan.'],
        ['Satu baris sepanjang dua ratus aksara',
         'Baris 80 memang naskah yang bisa dibaca &mdash; tapi untuk ' +
         'menyisipkan satu layar di tengahnya, seluruh urutan dua puluh ' +
         'nomor itu harus dibaca ulang sampai ketemu tempatnya.'],
        ['Salah eja di naskah yang akan dibaca calon pembeli',
         '<code>seperate</code> (baris 1260) dan <code>occured</code> ' +
         '(baris 1120). Berkas ini brosur penjualan &mdash; lihat BUSTEN.']
      ]
    },

    penjelasan: [
      { judul: 'Naskah yang muat di satu baris',
        isi: [
          'Baris 80 layak dilihat utuh:',
          '<code>80 GOSUB 820:GOSUB 890:GOSUB 980:GOSUB 300:GOSUB 40:' +
          'GOSUB 820:GOSUB 930:GOSUB 1040:GOSUB 40:&hellip;</code>',
          'Dua puluh pemanggilan, dan polanya terlihat begitu ditulis ' +
          'berkelompok empat: <b>820</b> gambar kepala, <b>890/930/960</b> ' +
          'tulis judul langkahnya, satu subrutin isi, lalu <b>40</b> tunggu ' +
          'tombol. Lima kali.',
          'Satu-satunya yang di luar pola adalah <code>GOSUB 300</code> di ' +
          'kelompok pertama &mdash; perakit kedua tabelnya, dipanggil sekali ' +
          'lalu tidak pernah lagi.',
          'Cara ini punya satu keunggulan yang jarang disebut: <b>seluruh ' +
          'alur programnya terlihat dalam satu pandangan</b>. Tidak perlu ' +
          'melacak variabel keadaan, tidak perlu mencari di mana nomor layar ' +
          'diubah. Yang ada daftar, dan daftar itu dijalankan dari kiri ke ' +
          'kanan.',
          'Kelemahannya juga satu, dan besar: menyisipkan layar baru di ' +
          'tengah berarti membaca dua puluh nomor sampai ketemu tempatnya, ' +
          'dan tidak ada apa pun yang menandai batas antar kelompok. Nomor ' +
          '820 muncul lima kali dan tidak ada satu pun yang mengatakan bahwa ' +
          'itulah awal sebuah layar baru.'
        ] },
      { judul: 'Angka yang benar, sekali lagi tanpa dihitung',
        isi: [
          'Transaksinya sederhana: Homer membeli barang $1500, membayar $500 ' +
          'tunai, sisanya $1000 jadi utang.',
          'Jurnalnya (baris 410&ndash;430) mencatat debit Persediaan 1500, ' +
          'kredit Kas 500, kredit Utang 1000. <b>1500 = 500 + 1000.</b>',
          'Buku besarnya (690&ndash;740) melanjutkan saldo dari BUSTWO: ' +
          'Persediaan 6700 + 1500 = <b>8200</b>. Kas 8000 &minus; 500 = ' +
          '<b>7500</b>. Utang 0 + 1000 = <b>1000</b>.',
          'Semuanya benar, dan konsisten dengan angka pembuka yang ditetapkan ' +
          'BUSTWO. Seseorang duduk dan mengerjakan pembukuan ini dengan benar ' +
          'sebelum mengetiknya.',
          'Dan seperti di seluruh keluarga ini, <b>tidak ada satu baris kode ' +
          'pun yang menghitungnya</b>. Kalau angka 1500 di baris 410 diubah ' +
          'jadi 1600, jurnalnya tidak lagi berimbang dan buku besarnya tidak ' +
          'lagi cocok &mdash; dan program akan menampilkannya dengan tenang, ' +
          'persis seperti sebelumnya.'
        ] }
    ]
  };
})(window);
